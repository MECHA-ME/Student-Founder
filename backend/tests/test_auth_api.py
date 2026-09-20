"""End-to-end auth + RLS tests against a live DB.

Skipped automatically when DATABASE_URL is not set (runs in the CI db job).
Uses the TestClient against the real FastAPI app with a per-test clean user.
"""

import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text

from app.main import app

DATABASE_URL = __import__("os").environ.get("DATABASE_URL")

pytestmark = pytest.mark.skipif(
    not DATABASE_URL, reason="DATABASE_URL is not set (needs live Postgres)"
)

engine = create_engine(DATABASE_URL) if DATABASE_URL else None


@pytest.fixture()
def schema():
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM projects"))
        conn.execute(text("DELETE FROM audit_logs"))
        conn.execute(text("DELETE FROM refresh_tokens"))
        conn.execute(text("DELETE FROM consents"))
        conn.execute(text("DELETE FROM users"))
    yield
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM projects"))
        conn.execute(text("DELETE FROM audit_logs"))
        conn.execute(text("DELETE FROM refresh_tokens"))
        conn.execute(text("DELETE FROM consents"))
        conn.execute(text("DELETE FROM users"))


def register(client, email: str, **overrides):
    payload = {
        "email": email,
        "password": "password-123",
        "full_name": "Test User",
        "user_type": "founder",
        "age_group": "18_plus",
        **overrides,
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201, response.text
    return response.json()


def auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def test_register_login_mfa_lifecycle(schema):
    client = TestClient(app)
    email = f"alice-{uuid.uuid4().hex[:8]}@example.test"
    reg = register(client, email)
    assert reg["token_type"] == "bearer"
    assert reg["user"]["role"] == "student"
    assert reg["user"]["age_group"] == "18_plus"

    login = client.post("/api/v1/auth/login", json={"email": email, "password": "password-123"})
    assert login.status_code == 200
    login_body = login.json()
    assert login_body["user"]["email"] == email

    bad = client.post("/api/v1/auth/login", json={"email": email, "password": "wrong-password"})
    assert bad.status_code == 401
    assert bad.json()["error"]["code"] == "INVALID_CREDENTIALS"

    dup = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "password-123",
            "full_name": "Duplicate",
            "user_type": "founder",
            "age_group": "18_plus",
        },
    )
    assert dup.status_code == 409
    assert dup.json()["error"]["code"] == "EMAIL_IN_USE"


def test_refresh_rotation(schema):
    client = TestClient(app)
    email = f"bob-{uuid.uuid4().hex[:8]}@example.test"
    reg = register(client, email)

    refreshed = client.post("/api/v1/auth/refresh", json={"refresh_token": reg["refresh_token"]})
    assert refreshed.status_code == 200, refreshed.text
    assert refreshed.json()["access_token"] != reg["access_token"]

    reuse = client.post("/api/v1/auth/refresh", json={"refresh_token": reg["refresh_token"]})
    assert reuse.status_code == 401
    assert reuse.json()["error"]["code"] == "INVALID_REFRESH"


def test_me_and_consents(schema):
    client = TestClient(app)
    email = f"carol-{uuid.uuid4().hex[:8]}@example.test"
    reg = register(client, email)
    headers = auth_headers(reg["access_token"])

    me = client.get("/api/v1/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["user"]["email"] == email
    assert me.json()["profile"] is None
    assert me.json()["consents"] == []

    consent = client.post(
        "/api/v1/me/consents", json={"type": "privacy", "version": "1.0"}, headers=headers
    )
    assert consent.status_code == 201
    assert consent.json()["consent"]["type"] == "privacy"

    me2 = client.get("/api/v1/me", headers=headers)
    assert len(me2.json()["consents"]) == 1

    exported = client.get("/api/v1/me/export", headers=headers)
    assert exported.status_code == 200
    body = exported.json()
    assert body["user"]["email"] == email
    assert body["projects"] == []


def test_project_creation_and_rls(schema):
    client = TestClient(app)
    email_a = f"dana-{uuid.uuid4().hex[:8]}@example.test"
    email_b = f"erin-{uuid.uuid4().hex[:8]}@example.test"
    reg_a = register(client, email_a)
    reg_b = register(client, email_b)
    h_a = auth_headers(reg_a["access_token"])
    h_b = auth_headers(reg_b["access_token"])

    created = client.post(
        "/api/v1/projects",
        json={"title": "Campus Waste Tracker", "entry_type": "idea"},
        headers=h_a,
    )
    assert created.status_code == 201, created.text
    project = created.json()["project"]
    assert project["title"] == "Campus Waste Tracker"
    assert project["status"] == "active"

    list_a = client.get("/api/v1/projects", headers=h_a)
    assert list_a.status_code == 200
    titles_a = [p["title"] for p in list_a.json()["projects"]]
    assert "Campus Waste Tracker" in titles_a

    list_b = client.get("/api/v1/projects", headers=h_b)
    assert list_b.status_code == 200
    assert list_b.json()["projects"] == []

    get_b = client.get(f"/api/v1/projects/{project['id']}", headers=h_b)
    assert get_b.status_code == 404
    assert get_b.json()["error"]["code"] == "NOT_FOUND"

    get_a = client.get(f"/api/v1/projects/{project['id']}", headers=h_a)
    assert get_a.status_code == 200


def test_undeclared_guardian_consent_and_underage_profile(schema):
    client = TestClient(app)
    email = f"finn-{uuid.uuid4().hex[:8]}@example.test"
    reg = register(client, email, age_group="under_18")
    headers = auth_headers(reg["access_token"])

    me = client.get("/api/v1/me", headers=headers)
    assert me.json()["user"]["age_group"] == "under_18"
    assert me.json()["user"]["guardian_consent_at"] is None

    consent = client.post(
        "/api/v1/me/consents", json={"type": "guardian", "version": "1.0"}, headers=headers
    )
    assert consent.status_code == 201
    me2 = client.get("/api/v1/me", headers=headers)
    assert me2.json()["user"]["guardian_consent_at"] is not None


def test_delete_soft_deletes_and_revokes_tokens(schema):
    client = TestClient(app)
    email = f"gwen-{uuid.uuid4().hex[:8]}@example.test"
    reg = register(client, email)
    headers = auth_headers(reg["access_token"])

    removed = client.delete("/api/v1/me", headers=headers)
    assert removed.status_code == 204

    me = client.get("/api/v1/me", headers=headers)
    assert me.status_code == 401
    assert me.json()["error"]["code"] == "UNAUTHENTICATED"

    login = client.post("/api/v1/auth/login", json={"email": email, "password": "password-123"})
    assert login.status_code == 401