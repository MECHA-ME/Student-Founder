"""Database tests: seeds, RLS flags, and cross-tenant isolation.

Requires a live Postgres with the migrations applied:

    set DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/student_founder
    alembic upgrade head
    pytest tests/test_db.py -q

Skipped automatically when DATABASE_URL is not set. The connecting role must be
a superuser (CI uses the postgres service role) so the fixture can create the
low-privilege app_user role that RLS is verified against.
"""

import os
import uuid
from contextlib import contextmanager

import pytest
from sqlalchemy import create_engine, text

DATABASE_URL = os.environ.get("DATABASE_URL")

pytestmark = pytest.mark.skipif(
    not DATABASE_URL, reason="DATABASE_URL is not set (needs live Postgres)"
)

engine = create_engine(DATABASE_URL) if DATABASE_URL else None


@pytest.fixture(scope="module", autouse=True)
def app_role():
    reset_role()
    with engine.begin() as conn:
        conn.execute(text("CREATE ROLE app_user WITH LOGIN"))
        conn.execute(text("GRANT USAGE ON SCHEMA public TO app_user"))
        conn.execute(
            text("GRANT SELECT ON projects, project_members, evidence_items, "
                 "conversations, messages TO app_user")
        )
        conn.execute(text("GRANT EXECUTE ON FUNCTION is_project_member(uuid) TO app_user"))
    yield
    reset_role()


def reset_role():
    # DROP ROLE fails while grants depend on the role (e.g. after a crashed run),
    # so revoke first. Wrapped in DO to stay idempotent when the role is absent.
    with engine.begin() as conn:
        conn.execute(
            text(
                "DO $$ BEGIN "
                "IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN "
                "REVOKE ALL ON SCHEMA public FROM app_user; "
                "REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user; "
                "DROP ROLE app_user; "
                "END IF; END $$"
            )
        )


@contextmanager
def tx():
    with engine.connect() as conn:
        transaction = conn.begin()
        try:
            yield conn
        finally:
            transaction.rollback()


def test_stages_seeded():
    with engine.connect() as conn:
        codes = conn.execute(text("SELECT code FROM stages ORDER BY position")).scalars().all()
    assert codes == ["S0_READINESS", "S1_PROBLEM", "S2_VALIDATION", "S3_SOLUTION", "S4_BUILD"]


def test_gates_v1():
    with engine.connect() as conn:
        rows = conn.execute(
            text("SELECT s.code, g.pass_threshold, g.rubric FROM stage_gates g "
                 "JOIN stages s ON s.id = g.stage_id WHERE g.active")
        ).all()
    assert {row[0] for row in rows} == {"S1_PROBLEM", "S2_VALIDATION", "S3_SOLUTION"}
    for _, threshold, rubric in rows:
        assert float(threshold) == 70
        assert abs(sum(c["weight"] for c in rubric["criteria"]) - 1.0) < 1e-9


def test_rls_enabled():
    with engine.connect() as conn:
        tables = conn.execute(
            text("SELECT tablename FROM pg_tables WHERE schemaname = 'public' "
                 "AND rowsecurity AND tablename IN ('projects','evidence_items','messages')")
        ).scalars().all()
    assert sorted(tables) == ["evidence_items", "messages", "projects"]


def test_cross_tenant_isolation():
    user_a, user_b = str(uuid.uuid4()), str(uuid.uuid4())
    with tx() as conn:
        conn.execute(
            text("INSERT INTO users (id, email) VALUES (:id, :email)"),
            {"id": user_a, "email": f"a-{user_a}@example.test"},
        )
        conn.execute(
            text("INSERT INTO users (id, email) VALUES (:id, :email)"),
            {"id": user_b, "email": f"b-{user_b}@example.test"},
        )
        project_id = conn.execute(
            text("INSERT INTO projects (owner_id, title, entry_type) "
                 "VALUES (:owner, 'RLS probe', 'idea') RETURNING id"),
            {"owner": user_a},
        ).scalar()
        conn.execute(
            text("INSERT INTO evidence_items (project_id, type, title) "
                 "VALUES (:project, 'link', 'probe')"),
            {"project": project_id},
        )
        conversation_id = conn.execute(
            text("INSERT INTO conversations (project_id, agent_type) "
                 "VALUES (:project, 'coach') RETURNING id"),
            {"project": project_id},
        ).scalar()
        conn.execute(
            text("INSERT INTO messages (conversation_id, role, content) "
                 "VALUES (:conversation, 'user', 'probe')"),
            {"conversation": conversation_id},
        )

        conn.execute(text("SET LOCAL ROLE app_user"))
        # NOTE: SET does not accept bound parameters, so the uuid (server-generated,
        # quote-free by construction) is interpolated as a literal.
        conn.execute(text(f"SET LOCAL app.user_id = '{user_b}'"))
        assert conn.execute(text("SELECT COUNT(*) FROM projects")).scalar() == 0
        assert conn.execute(text("SELECT COUNT(*) FROM evidence_items")).scalar() == 0
        assert conn.execute(text("SELECT COUNT(*) FROM messages")).scalar() == 0

        conn.execute(text(f"SET LOCAL app.user_id = '{user_a}'"))
        assert conn.execute(text("SELECT COUNT(*) FROM projects")).scalar() == 1
        assert conn.execute(text("SELECT COUNT(*) FROM evidence_items")).scalar() == 1
        assert conn.execute(text("SELECT COUNT(*) FROM messages")).scalar() == 1
