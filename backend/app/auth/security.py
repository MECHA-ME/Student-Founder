import hashlib
import os
import secrets
import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from app.errors import api_error

ACCESS_TTL_MINUTES = 15
REFRESH_TTL_DAYS = 30


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash:
        return False
    try:
        return bcrypt.checkpw(password.encode(), password_hash.encode())
    except (ValueError, TypeError):
        return False


def jwt_secret() -> str:
    return os.environ.get("JWT_SECRET", "change-me-in-production")


def mint_access_token(user_id: str, role: str, org_id: str | None, age_group: str | None) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "role": role,
        "org_id": str(org_id) if org_id else None,
        "age_group": age_group,
        "type": "access",
        "iat": now,
        "exp": now + timedelta(minutes=ACCESS_TTL_MINUTES),
        "jti": uuid.uuid4().hex,
    }
    return jwt.encode(payload, jwt_secret(), algorithm="HS256")


def decode_token(token: str, expect: str = "access") -> dict:
    try:
        data = jwt.decode(token, jwt_secret(), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        api_error(401, "UNAUTHENTICATED", "token expired")
    except jwt.InvalidTokenError:
        api_error(401, "UNAUTHENTICATED", "invalid token")
    if data.get("type") != expect:
        api_error(401, "UNAUTHENTICATED", "wrong token type")
    return data


def new_refresh_token() -> tuple[str, str]:
    token = secrets.token_urlsafe(48)
    return token, hashlib.sha256(token.encode()).hexdigest()


def refresh_expires_at() -> datetime:
    return datetime.now(timezone.utc) + timedelta(days=REFRESH_TTL_DAYS)
