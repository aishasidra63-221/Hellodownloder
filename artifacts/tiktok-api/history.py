"""
History System — FIFO, max 10 URLs per client
Stored in memory (per IP). Optionally persisted to Redis.
"""
import hashlib
import time
from collections import deque
from typing import Optional
import logging

logger = logging.getLogger(__name__)

MAX_HISTORY = 10

# ip_hash -> deque of history items
_history_store: dict[str, deque] = {}


def _get_client_key(ip: str) -> str:
    return hashlib.sha256(ip.encode()).hexdigest()[:16]


def add_to_history(
    ip: str,
    url: str,
    title: str,
    author: str,
    thumbnail: str,
    format_type: str,
):
    key = _get_client_key(ip)
    if key not in _history_store:
        _history_store[key] = deque(maxlen=MAX_HISTORY)

    entry = {
        "url": url,
        "title": title[:80] if title else "TikTok Video",
        "author": author[:40] if author else "Unknown",
        "thumbnail": thumbnail or "",
        "format": format_type,
        "downloaded_at": int(time.time()),
    }

    # Remove duplicate URLs (keep latest)
    _history_store[key] = deque(
        [e for e in _history_store[key] if e["url"] != url],
        maxlen=MAX_HISTORY,
    )
    _history_store[key].appendleft(entry)
    logger.debug(f"History updated for {key}: {len(_history_store[key])} items")


def get_history(ip: str) -> list:
    key = _get_client_key(ip)
    if key not in _history_store:
        return []
    return list(_history_store[key])


def clear_history(ip: str):
    key = _get_client_key(ip)
    _history_store.pop(key, None)


def history_stats() -> dict:
    return {
        "total_clients": len(_history_store),
        "total_entries": sum(len(v) for v in _history_store.values()),
    }
