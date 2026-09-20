import uuid
from typing import Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.engine import Connection

from app.auth.audit import log_action
from app.auth.dependencies import UserContext, get_current_user
from app.db import get_conn
from app.errors import api_error

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])

PROJECT_COLUMNS = "id, title, summary, entry_type, status, current_stage_id, created_at, updated_at"


def _project_row(conn: Connection, project_id: str) -> dict | None:
    row = conn.execute(
        text(
            f"SELECT {PROJECT_COLUMNS} FROM projects "
            "WHERE id = :pid AND deleted_at IS NULL"
        ),
        {"pid": project_id},
    ).mappings().first()
    return dict(row) if row else None


@router.get("")
def list_projects(
    _: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> dict:
    rows = conn.execute(
        text(
            f"SELECT {PROJECT_COLUMNS} FROM projects "
            "WHERE deleted_at IS NULL ORDER BY updated_at DESC"
        ),
    ).mappings().all()
    return {"projects": [dict(r) for r in rows]}


class CreateProjectRequest(BaseModel):
    title: str
    entry_type: Literal["idea", "prototype"]
    summary: str | None = None


@router.post("", status_code=201)
def create_project(
    body: CreateProjectRequest,
    user: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> dict:
    stage = conn.execute(
        text("SELECT id FROM stages WHERE code = 'S0_READINESS'"),
    ).mappings().first()
    stage_id = str(stage["id"]) if stage else None
    row = conn.execute(
        text(
            "INSERT INTO projects (owner_id, org_id, title, summary, entry_type, current_stage_id) "
            "VALUES (:owner, :org, :title, :summary, :entry, :stage) "
            "RETURNING id"
        ),
        {
            "owner": user.id,
            "org": user.org_id,
            "title": body.title,
            "summary": body.summary,
            "entry": body.entry_type,
            "stage": stage_id,
        },
    ).mappings().first()
    project_id = str(row["id"])
    if stage_id:
        conn.execute(
            text(
                "INSERT INTO project_stage_progress (project_id, stage_id, status, started_at) "
                "VALUES (:pid, :sid, 'in_progress', now())"
            ),
            {"pid": project_id, "sid": stage_id},
        )
    log_action(
        conn,
        actor_id=user.id,
        actor_role=user.role,
        action="project.created",
        entity_type="project",
        entity_id=project_id,
    )
    return {"project": _project_row(conn, project_id)}


@router.get("/{project_id}")
def get_project(
    project_id: uuid.UUID,
    _: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> dict:
    project = _project_row(conn, str(project_id))
    if project is None:
        api_error(404, "NOT_FOUND", "project not found")
    return {"project": project}