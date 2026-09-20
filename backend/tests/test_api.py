from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthz_ok():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "student-founder-api"}


def _paths():
    return set(app.openapi()["paths"].keys())


def test_projects_requires_auth():
    response = client.get("/api/v1/projects")
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHENTICATED"


def test_me_requires_auth():
    response = client.get("/api/v1/me")
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHENTICATED"


def test_auth_router_mounted():
    assert {"/api/v1/auth/login", "/api/v1/auth/refresh", "/api/v1/auth/register"} <= _paths()


def test_projects_router_mounted():
    assert "/api/v1/projects/{project_id}" in _paths()


def test_me_router_mounted():
    assert "/api/v1/me/export" in _paths()