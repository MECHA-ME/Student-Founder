from dataclasses import dataclass

from fastapi import Depends, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import text
from sqlalchemy.engine import Connection

from app.auth.security import decode_token
from app.db import get_conn
from app.errors import api_error

bearer = HTTPBearer(auto_error=False)


@dataclass
class UserContext:
    id: str
    email: str
    role: str
    org_id: str | None
    age_group: str | None


def _token_claims(
    creds: HTTPAuthorizationCredentials | None = Security(bearer),
) -> dict:
    if creds is None or not creds.credentials:
        api_error(401, "UNAUTHENTICATED", "missing bearer token")
    return decode_token(creds.credentials, expect="access")


def set_rls_context(conn: Connection, user: UserContext) -> None:
    # SET does not accept bound parameters; values here are server-generated
    # (uuid/role strings), never raw user input.
    conn.execute(text(f"SET LOCAL app.user_id = '{user.id}'"))
    conn.execute(text(f"SET LOCAL app.org_id = '{user.org_id or ''}'"))
    conn.execute(text(f"SET LOCAL app.role = '{user.role}'"))
    # Drop to the row-level-security role so the owner/member policies enforced
    # by is_project_member actually apply (superusers bypass RLS).
    conn.execute(text("SET LOCAL ROLE app_role"))


def get_current_user(
    claims: dict = Depends(_token_claims),
    conn: Connection = Depends(get_conn),
) -> UserContext:
    row = conn.execute(
        text("SELECT id, email, role, org_id, age_group, deleted_at FROM users WHERE id = :id"),
        {"id": claims["sub"]},
    ).mappings().first()
    if row is None or row["deleted_at"] is not None:
        api_error(401, "UNAUTHENTICATED", "unknown or deleted user")
    user = UserContext(
        id=str(row["id"]),
        email=row["email"],
        role=row["role"],
        org_id=str(row["org_id"]) if row["org_id"] else None,
        age_group=row["age_group"],
    )
    set_rls_context(conn, user)
    return user


def require_role(*roles: str):
    def checker(user: UserContext = Depends(get_current_user)) -> UserContext:
        if user.role not in roles:
            api_error(403, "FORBIDDEN", "insufficient role")
        return user

    return checker


def require_mfa(
    user: UserContext = Depends(get_current_user),
    conn: Connection = Depends(get_conn),
) -> UserContext:
    # Privileged roles must have TOTP enabled before touching sensitive endpoints.
    if user.role != "student":
        row = conn.execute(
            text("SELECT mfa_enabled_at FROM users WHERE id = :id"), {"id": user.id}
        ).first()
        if row is None or row[0] is None:
            api_error(403, "FORBIDDEN", "MFA setup required for this role")
    return user