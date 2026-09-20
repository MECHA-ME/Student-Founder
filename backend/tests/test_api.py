from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthz_ok():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "student-founder-api"}


def test_overview_shape():
    response = client.get("/api/v1/overview")
    assert response.status_code == 200
    body = response.json()
    assert set(body) == {"user", "metrics", "projects"}
    assert {"active_projects", "interviews_completed", "stage_funnel"} <= set(body["metrics"])
    for project in body["projects"]:
        assert {"project_id", "title", "stage", "next_best_action"} <= set(project)


def test_list_projects():
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    projects = response.json()["projects"]
    assert len(projects) >= 1


def test_get_project_found():
    response = client.get("/api/v1/projects/p-101")
    assert response.status_code == 200
    assert response.json()["title"] == "Campus Waste Tracker"


def test_get_project_not_found():
    response = client.get("/api/v1/projects/does-not-exist")
    assert response.status_code == 200
    assert response.json() == {"detail": "Project not found"}


def test_stages_codes():
    response = client.get("/api/v1/stages")
    assert response.status_code == 200
    codes = [stage["code"] for stage in response.json()["stages"]]
    assert codes == ["S0", "S1", "S2", "S3"]


def test_journey_shape():
    response = client.get("/api/v1/journey")
    assert response.status_code == 200
    body = response.json()
    assert "user" in body and "stages" in body and "coach_message" in body
