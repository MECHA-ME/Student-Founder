import hashlib
import uuid
from typing import Literal

from fastapi import APIRouter, Depends, Request, Response
from pydantic import BaseModel, EmailStr
from sqlalchemy import text
from sqlalchemy.engine import Connection
from sqlalchemy.exc import IntegrityError

from app.auth.audit import log_action
from app.auth.dependencies import UserContext, get_current_user
from app.auth.mfa import new_mfa_secret, provisioning_uri, verify_totp
from app.auth.ratelimit import check_rate_limit
from app.auth.security import (
    ACCESS_TTL_MINUTES,
    hash_password,
    mint_access_token,
    new_refresh_token,
    refresh_expires_at,
    verify_password,
)
from app.db import get_conn
from app.errors import api_error

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    user_type: Literal["founder", "builder"]
    age_group: Literal["under_18", "18_plus"]
    org_id: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenRequest(BaseModel):
    refresh_token: str


class MfaCodeRequest(BaseModel):
    code: str


@router.post("/register", status_code=201)
def register(body: RegisterRequest, request: Request, conn: Connection = Depends(get_conn)) -> dict:
    check_rate_limit(request.client.host if request.client else "unknown", limit=5, window_s=60)
    if len(body.password) < 8:
        api_error(400, "VALIDATION_ERROR", "password must be at least 8 characters")
    email = body.email.lower()
    user_id = str(uuid.uuid4())
    password_hash = hash_password(body.password)
    try:
        conn.execute(
            text(
                "INSERT INTO users (id, email, full_name, user_type, age_group, org_id, password_hash) "
                "VALUES (:id, :email, :full_name, :user_type, :age_group, :org_id, :password_hash)"
            ),
            {
                "id": user_id,
                "email": email,
                "full_name": body.full_name,
                "user_type": body.user_type,
                "age_group": body.age_group,
                "org_id": body.org_id,
                "password_hash": password_hash,
            },
        )
    except IntegrityError:
        api_error(409, "EMAIL_IN_USE", "email already registered")
    log_action(
        conn,
        actor_id=user_id,
        actor_role="student",
        action="user.register",
        entity_type="user",
        entity_id=user_id,
        metadata={"email": email},
    )
    access_token = mint_access_token(user_id, "student", body.org_id, body.age_group)
    refresh_token, refresh_hash = new_refresh_token()
    conn.execute(
        text(
            "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (:uid, :h, :exp)"
        ),
        {"uid": user_id, "h": refresh_hash, "exp": refresh_expires_at()},
    )
    return {
        "user": {
            "id": user_id,
            "email": email,
            "full_name": body.full_name,
            "role": "student",
            "user_type": body.user_type,
            "age_group": body.age_group,
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_in": ACCESS_TTL_MINUTES * 60,
        "token_type": "bearer",
    }


@router.post("/login")
def login(body: LoginRequest, request: Request, conn: Connection = Depends(get_conn)) -> dict:
    ip = request.client.host if request.client else "unknown"
    email = body.email.lower()
    check_rate_limit(f"{email}:{ip}", limit=10, window_s=60)
    row = conn.execute(
        text(
            "SELECT id, email, full_name, role, user_type, age_group, password_hash "
            "FROM users WHERE email = :email AND deleted_at IS NULL"
        ),
        {"email": email},
    ).mappings().first()
    if row is None or not verify_password(body.password, row["password_hash"]):
        api_error(401, "INVALID_CREDENTIALS", "invalid email or password")
    user_id = str(row["id"])
    conn.execute(
        text("UPDATE users SET last_active_at = now() WHERE id = :id"), {"id": user_id}
    )
    log_action(
        conn,
        actor_id=user_id,
        actor_role=row["role"],
        action="user.login",
        entity_type="user",
        entity_id=user_id,
        metadata={"email": row["email"]},
    )
    access_token = mint_access_token(user_id, row["role"], row["org_id"], row["age_group"])
    refresh_token, refresh_hash = new_refresh_token()
    conn.execute(
        text(
            "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (:uid, :h, :exp)"
        ),
        {"uid": user_id, "h": refresh_hash, "exp": refresh_expires_at()},
    )
    return {
        "user": {
            "id": user_id,
            "email": row["email"],
            "full_name": row["full_name"],
            "role": row["role"],
            "user_type": row["user_type"],
            "age_group": row["age_group"],
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_in": ACCESS_TTL_MINUTES * 60,
        "token_type": "bearer",
    }


@router.post("/refresh")
def refresh(body: TokenRequest, conn: Connection = Depends(get_conn)) -> dict:
    token_hash = hashlib.sha256(body.refresh_token.encode()).hexdigest()
    row = conn.execute(
        text(
            "SELECT id, user_id FROM refresh_tokens "
            "WHERE token_hash = :h AND revoked_at IS NULL AND expires_at > now()"
        ),
        {"h": token_hash},
    ).mappings().first()
    if row is None:
        api_error(401, "INVALID_REFRESH", "invalid or expired refresh token")
    old_id = str(row["id"])
    user_id = str(row["user_id"])
    user = conn.execute(
        text(
            "SELECT role, org_id, age_group FROM users WHERE id = :id AND deleted_at IS NULL"
        ),
        {"id": user_id},
    ).mappings().first()
    if user is None:
        api_error(401, "INVALID_REFRESH", "invalid or expired refresh token")
    refresh_token, refresh_hash = new_refresh_token()
    new_id = conn.execute(
        text(
            "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) "
            "VALUES (:uid, :h, :exp) RETURNING id"
        ),
        {"uid": user_id, "h": refresh_hash, "exp": refresh_expires_at()},
    ).scalar()
    conn.execute(
        text(
            "UPDATE refresh_tokens SET revoked_at = now(), replaced_by = :nid WHERE id = :oid"
        ),
        {"nid": str(new_id), "oid": old_id},
    )
    access_token = mint_access_token(user_id, user["role"], user["org_id"], user["age_group"])
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_in": ACCESS_TTL_MINUTES * 60,
        "token_type": "bearer",
    }


@router.post("/logout", status_code=204)
def logout(
    body: TokenRequest,
    user: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> Response:
    token_hash = hashlib.sha256(body.refresh_token.encode()).hexdigest()
    conn.execute(
        text(
            "UPDATE refresh_tokens SET revoked_at = now() "
            "WHERE token_hash = :h AND user_id = :uid AND revoked_at IS NULL"
        ),
        {"h": token_hash, "uid": user.id},
    )
    return Response(status_code=204)


@router.get("/mfa/setup")
def mfa_setup(
    user: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> dict:
    secret = new_mfa_secret()
    conn.execute(
        text("UPDATE users SET mfa_secret = :s WHERE id = :id"),
        {"s": secret, "id": user.id},
    )
    return {"secret": secret, "provisioning_uri": provisioning_uri(secret, user.email)}


@router.post("/mfa/enable")
def mfa_enable(
    body: MfaCodeRequest,
    user: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> dict:
    row = conn.execute(
        text("SELECT mfa_secret FROM users WHERE id = :id"), {"id": user.id}
    ).first()
    secret = row[0] if row else None
    if not verify_totp(secret, body.code):
        api_error(400, "INVALID_CODE", "invalid or expired code")
    conn.execute(
        text("UPDATE users SET mfa_enabled_at = now() WHERE id = :id"), {"id": user.id}
    )
    log_action(
        conn,
        actor_id=user.id,
        actor_role=user.role,
        action="user.mfa_enabled",
        entity_type="user",
        entity_id=user.id,
    )
    return {"enabled": True}


@router.post("/mfa/disable")
def mfa_disable(
    body: MfaCodeRequest,
    user: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> dict:
    row = conn.execute(
        text("SELECT mfa_secret FROM users WHERE id = :id"), {"id": user.id}
    ).first()
    secret = row[0] if row else None
    if not verify_totp(secret, body.code):
        api_error(400, "INVALID_CODE", "invalid or expired code")
    conn.execute(
        text("UPDATE users SET mfa_secret = NULL, mfa_enabled_at = NULL WHERE id = :id"),
        {"id": user.id},
    )
    log_action(
        conn,
        actor_id=user.id,
        actor_role=user.role,
        action="user.mfa_disabled",
        entity_type="user",
        entity_id=user.id,
    )
    return {"enabled": False}