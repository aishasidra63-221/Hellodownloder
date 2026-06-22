"""
Redis Global Cache — 30 min TTL
Falls back to in-memory cache if Redis is unavailable
"""
import asyncio
import hashlib
import json
import logging
import os
import time
from typing import Any, Optional

logger = logging.getLogger(__name__)

CACHE_TTL = 1800  # 30 minutes

# ── In-memory fallback ────────────────────────────────────────────────────────

_mem_cache: dict[str, dict] = {}


def _mem_get(key: str) -> Optional[Any]:
    entry = _mem_cache.get(key)
    if not entry:
        return None
    if time.time() > entry["expires_at"]:
        del _mem_cache[key]
        return None
    return entry["value"]


def _mem_set(key: str, value: Any, ttl: int = CACHE_TTL):
    _mem_cache[key] = {
        "value": value,
        "expires_at": time.time() + ttl,
    }


def _mem_delete(key: str):
    _mem_cache.pop(key, None)


def _mem_flush():
    _mem_cache.clear()


# ── Redis (optional) ──────────────────────────────────────────────────────────

_redis = None
_redis_available = False


async def init_redis():
    global _redis, _redis_available
    redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379")
    try:
        import redis.asyncio as aioredis
        _redis = await aioredis.from_url(redis_url, decode_responses=True)
        await _redis.ping()
        _redis_available = True
        logger.info("Redis connected ✅")
    except Exception as e:
        logger.warning(f"Redis unavailable, using in-memory cache: {e}")
        _redis_available = False


# ── Public API ────────────────────────────────────────────────────────────────

def make_cache_key(url: str, format_type: str) -> str:
    raw = f"{url}:{format_type}"
    return "tikdl:" + hashlib.sha256(raw.encode()).hexdigest()[:32]


async def cache_get(key: str) -> Optional[dict]:
    if _redis_available and _redis:
        try:
            val = await _redis.get(key)
            if val:
                return json.loads(val)
            return None
        except Exception:
            pass
    return _mem_get(key)


async def cache_set(key: str, value: dict, ttl: int = CACHE_TTL):
    if _redis_available and _redis:
        try:
            await _redis.setex(key, ttl, json.dumps(value))
            return
        except Exception:
            pass
    _mem_set(key, value, ttl)


async def cache_delete(key: str):
    if _redis_available and _redis:
        try:
            await _redis.delete(key)
            return
        except Exception:
            pass
    _mem_delete(key)


async def cache_flush():
    if _redis_available and _redis:
        try:
            await _redis.flushdb()
            return
        except Exception:
            pass
    _mem_flush()


def cache_stats() -> dict:
    return {
        "backend": "redis" if _redis_available else "memory",
        "memory_entries": len(_mem_cache),
    }
