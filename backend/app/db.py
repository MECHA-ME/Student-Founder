import os

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.engine import Connection, Engine

_engine: Engine | None = None
_engine_url: str | None = None


def get_engine() -> Engine:
    global _engine, _engine_url
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise HTTPException(
            status_code=500,
            detail={"code": "INTERNAL_ERROR", "message": "DATABASE_URL is not configured"},
        )
    if _engine is None or _engine_url != url:
        _engine = create_engine(url, pool_pre_ping=True)
        _engine_url = url
    return _engine


def get_conn():
    engine = get_engine()
    with engine.connect() as conn:
        transaction = conn.begin()
        try:
            yield conn
        except Exception:
            transaction.rollback()
            raise
        else:
            transaction.commit()


Connection  # re-exported for type hints without extra imports
