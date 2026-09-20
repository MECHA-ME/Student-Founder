import time

from app.errors import api_error

_hits: dict[str, list[float]] = {}


def check_rate_limit(key: str, limit: int = 30, window_s: int = 60) -> None:
    now = time.monotonic()
    hits = [t for t in _hits.get(key, []) if now - t < window_s]
    if len(hits) >= limit:
        api_error(429, "RATE_LIMITED", "too many requests, slow down")
    hits.append(now)
    _hits[key] = hits


def reset_rate_limits() -> None:
    _hits.clear()
