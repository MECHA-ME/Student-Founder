from typing import Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.engine import Connection

from app.auth.audit import log_action
from app.auth.dependencies import UserContext, get_current_user
from app.db import get_conn

router = APIRouter(prefix="/api/v1/me", tags=["me"])


def _user_row(conn: Connection, user_id: str) -> dict | None:
    row = conn.execute(
        text(
            "SELECT id, email, full_name, role, user_type, org_id, age_group, "
            "guardian_consent_at, onboarding_completed_at, created_at "
            "FROM users WHERE id = :uid AND deleted_at IS NULL"
        ),
        {"uid": user_id},
    ).mappings().first()
    return dict(row) if row else None


def _profile_row(conn: Connection, user_id: str) -> dict | None:
    row = conn.execute(
        text(
            "SELECT institution_name, program, graduation_year, skills, weekly_hours, "
            "budget_limit, goal, preferences, updated_at "
            "FROM profiles WHERE user_id = :uid"
        ),
        {"uid": user_id},
    ).mappings().first()
    return dict(row) if row else None


def _consent_rows(conn: Connection, user_id: str) -> list[dict]:
    rows = conn.execute(
        text(
            "SELECT type, version, granted_at FROM consents "
            "WHERE user_id = :uid AND revoked_at IS NULL ORDER BY granted_at"
        ),
        {"uid": user_id},
    ).mappings().all()
    return [dict(r) for r in rows]


@router.get("")
def get_me(
    user: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> dict:
    return {
        "user": _user_row(conn, user.id),
        "profile": _profile_row(conn, user.id),
        "consents": _consent_rows(conn, user.id),
    }


class PatchMeRequest(BaseModel):
    full_name: str | None = None
    user_type: Literal["founder", "builder"] | None = None


@router.patch("")
def patch_me(
    body: PatchMeRequest,
    user: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> dict:
    updates: dict = {}
    if body.full_name is not None:
        updates["full_name"] = body.full_name
    if body.user_type is not None:
        updates["user_type"] = body.user_type
    if updates:
        sets = ", ".join(f"{col} = :{col}" for col in updates)
        conn.execute(
            text(f"UPDATE users SET {sets}, updated_at = now() WHERE id = :id"),
            {**updates, "id": user.id},
        )
    return {"user": _user_row(conn, user.id)}


@router.get("/export")
def export_me(
    user: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> dict:
    projects = conn.execute(
        text(
            "SELECT id, title, entry_type, status, current_stage_id, created_at, updated_at "
            "FROM projects WHERE owner_id = :oid AND deleted_at IS NULL "
            "ORDER BY updated_at DESC"
        ),
        {"oid": user.id},
    ).mappings().all()
    log_action(
        conn,
        actor_id=user.id,
        actor_role=user.role,
        action="gdpr.export",
        entity_type="user",
        entity_id=user.id,
    )
    return {
        "user": _user_row(conn, user.id),
        "profile": _profile_row(conn, user.id),
        "consents": _consent_rows(conn, user.id),
        "projects": [dict(r) for r in projects],
    }


@router.delete("", status_code=204)
def delete_me(
    user: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> None:
    conn.execute(
        text("UPDATE users SET deleted_at = now(), updated_at = now() WHERE id = :id"),
        {"id": user.id},
    )
    conn.execute(
        text(
            "UPDATE refresh_tokens SET revoked_at = now() "
            "WHERE user_id = :id AND revoked_at IS NULL"
        ),
        {"id": user.id},
    )
    log_action(
        conn,
        actor_id=user.id,
        actor_role=user.role,
        action="user.deleted",
        entity_type="user",
        entity_id=user.id,
    )


class ConsentRequest(BaseModel):
    type: str
    version: str


@router.post("/consents", status_code=201)
def add_consent(
    body: ConsentRequest,
    user: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> dict:
    row = conn.execute(
        text(
            "INSERT INTO consents (user_id, type, version) "
            "VALUES (:uid, :t, :v) RETURNING type, version, granted_at"
        ),
        {"uid": user.id, "t": body.type, "v": body.version},
    ).mappings().first()
    if body.type == "guardian":
        conn.execute(
            text("UPDATE users SET guardian_consent_at = now() WHERE id = :id"),
            {"id": user.id},
        )
    return {"consent": dict(row)}