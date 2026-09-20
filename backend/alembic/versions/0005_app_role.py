"""Low-privilege app role so RLS actually gates the API.

The API must not run queries as a superuser (superusers bypass RLS). This
migration creates a NOLOGIN role that owns nothing, grants it table access,
and the app does `SET LOCAL ROLE app_role` per request after setting the
session GUCs, so owner/member policies are enforced for real queries.

Revision ID: 0005
Revises: 0004
"""

from alembic import op

revision = "0005"
down_revision = "0004"
branch_labels = None
depends_on = None

UPGRADE = """
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_role') THEN
    CREATE ROLE app_role NOLOGIN;
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app_role;

REVOKE ALL ON FUNCTION is_project_member(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_project_member(uuid) TO app_role;
"""

DOWNGRADE = """
REVOKE ALL ON FUNCTION is_project_member(uuid) FROM app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE USAGE, SELECT ON SEQUENCES FROM app_role;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_role;
REVOKE USAGE ON SCHEMA public FROM app_role;
DROP ROLE IF EXISTS app_role;
"""


def upgrade() -> None:
    op.execute(UPGRADE)


def downgrade() -> None:
    op.execute(DOWNGRADE)