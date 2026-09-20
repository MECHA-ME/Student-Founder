import json

from sqlalchemy import text
from sqlalchemy.engine import Connection


def log_action(
    conn: Connection,
    *,
    actor_id: str | None,
    actor_role: str | None,
    action: str,
    entity_type: str | None = None,
    entity_id: str | None = None,
    metadata: dict | None = None,
) -> None:
    conn.execute(
        text(
            "INSERT INTO audit_logs (actor_id, actor_role, action, entity_type, entity_id, metadata) "
            "VALUES (:actor, :role, :action, :entity_type, :entity_id, CAST(:metadata AS jsonb))"
        ),
        {
            "actor": actor_id,
            "role": actor_role,
            "action": action,
            "entity_type": entity_type,
            "entity_id": str(entity_id) if entity_id else None,
            "metadata": json.dumps(metadata or {}),
        },
    )
