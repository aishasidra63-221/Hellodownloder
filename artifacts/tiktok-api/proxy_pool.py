"""
Proxy Pool — 150+ free proxies, country-tagged, auto-health-checked.
Bad proxies removed instantly; pool refreshed every 4 minutes in background.
"""
import asyncio
import logging
import random
import time
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

# ── Proxy list: (url, country_code) ──────────────────────────────────────────
# Country codes used to pick matching browser fingerprint in bypass.py

RAW_PROXIES: list[tuple[str, str]] = [
    # Indonesia
    ("http://103.152.112.162:80",     "ID"),
    ("http://103.149.194.222:23500",  "ID"),
    ("http://103.167.135.108:8080",   "ID"),
    ("http://103.177.9.133:8080",     "ID"),
    ("http://103.105.49.20:8080",     "ID"),
    ("http://103.83.232.122:80",      "ID"),
    ("http://103.155.217.1:41317",    "ID"),
    ("http://103.144.165.3:8080",     "ID"),
    ("http://103.141.108.122:8080",   "ID"),
    ("http://103.180.119.91:3128",    "ID"),
    ("http://103.10.62.230:8080",     "ID"),
    ("http://103.116.82.68:80",       "ID"),
    ("http://103.31.235.178:3128",    "ID"),
    ("http://103.73.102.26:3127",     "ID"),
    ("http://103.48.68.36:83",        "ID"),
    ("http://103.78.170.13:3128",     "ID"),
    ("http://103.131.18.210:3128",    "ID"),
    ("http://103.148.130.232:3128",   "ID"),
    ("http://103.247.121.116:8080",   "ID"),
    ("http://103.251.214.167:6666",   "ID"),
    # Brazil
    ("http://179.49.117.226:999",     "BR"),
    ("http://177.93.33.246:999",      "BR"),
    ("http://200.105.215.22:33630",   "BR"),
    ("http://177.93.45.154:999",      "BR"),
    ("http://189.90.249.80:9090",     "BR"),
    ("http://201.149.100.32:8085",    "BR"),
    ("http://200.7.10.159:3128",      "BR"),
    ("http://177.136.218.185:9090",   "BR"),
    ("http://189.120.255.249:9090",   "BR"),
    ("http://186.225.113.242:8080",   "BR"),
    ("http://179.127.193.37:4153",    "BR"),
    ("http://200.71.109.105:999",     "BR"),
    ("http://177.93.51.168:999",      "BR"),
    ("http://200.175.5.114:3128",     "BR"),
    ("http://177.93.33.14:999",       "BR"),
    # Philippines
    ("http://103.125.217.117:8080",   "PH"),
    ("http://112.198.132.59:8080",    "PH"),
    ("http://122.3.29.55:8080",       "PH"),
    ("http://122.3.41.154:8080",      "PH"),
    ("http://122.3.54.93:8080",       "PH"),
    ("http://122.3.67.197:8080",      "PH"),
    ("http://122.3.209.158:8080",     "PH"),
    ("http://112.198.123.203:8080",   "PH"),
    ("http://103.125.217.211:8080",   "PH"),
    ("http://122.3.35.168:8080",      "PH"),
    # Vietnam
    ("http://103.75.201.2:4837",      "VN"),
    ("http://14.241.111.38:8080",     "VN"),
    ("http://14.177.235.17:8080",     "VN"),
    ("http://14.241.230.36:8080",     "VN"),
    ("http://14.248.130.42:8080",     "VN"),
    ("http://27.72.149.205:8080",     "VN"),
    ("http://27.72.105.233:3128",     "VN"),
    ("http://118.70.144.77:3128",     "VN"),
    ("http://103.7.27.186:8080",      "VN"),
    ("http://113.161.59.136:8080",    "VN"),
    # Thailand
    ("http://103.200.112.114:8080",   "TH"),
    ("http://103.200.112.199:8080",   "TH"),
    ("http://202.183.174.94:3128",    "TH"),
    ("http://103.41.212.218:8080",    "TH"),
    ("http://61.19.145.66:8080",      "TH"),
    ("http://61.7.159.133:8080",      "TH"),
    ("http://110.78.143.56:8080",     "TH"),
    ("http://110.77.236.26:8080",     "TH"),
    ("http://103.200.112.33:8080",    "TH"),
    ("http://103.41.212.104:8080",    "TH"),
    # India
    ("http://103.10.62.231:8080",     "IN"),
    ("http://103.77.41.138:8080",     "IN"),
    ("http://43.225.57.50:6666",      "IN"),
    ("http://43.229.149.154:8080",    "IN"),
    ("http://103.216.144.194:8080",   "IN"),
    ("http://103.56.206.65:3128",     "IN"),
    ("http://103.79.76.218:8080",     "IN"),
    ("http://103.108.216.113:3128",   "IN"),
    ("http://103.211.17.90:83",       "IN"),
    ("http://182.68.93.196:9090",     "IN"),
    # Turkey
    ("http://31.223.66.122:8080",     "TR"),
    ("http://37.19.220.129:443",      "TR"),
    ("http://88.255.101.228:8080",    "TR"),
    ("http://88.255.101.247:8080",    "TR"),
    ("http://88.255.106.26:8080",     "TR"),
    ("http://88.255.102.17:8080",     "TR"),
    ("http://88.255.64.88:8080",      "TR"),
    ("http://176.88.253.90:8080",     "TR"),
    ("http://78.188.227.10:8080",     "TR"),
    ("http://78.170.120.30:8080",     "TR"),
    # Mexico
    ("http://187.243.246.203:999",    "MX"),
    ("http://187.243.253.213:999",    "MX"),
    ("http://200.59.87.196:999",      "MX"),
    ("http://200.68.89.209:999",      "MX"),
    ("http://187.62.195.43:999",      "MX"),
    ("http://187.218.148.14:999",     "MX"),
    ("http://187.243.250.197:999",    "MX"),
    ("http://200.52.16.218:999",      "MX"),
    ("http://187.243.246.243:999",    "MX"),
    ("http://187.243.248.49:999",     "MX"),
    # Russia
    ("http://185.162.231.106:80",     "RU"),
    ("http://195.20.241.238:3128",    "RU"),
    ("http://213.210.42.11:3128",     "RU"),
    ("http://176.120.213.190:8085",   "RU"),
    ("http://188.243.255.164:3128",   "RU"),
    ("http://62.33.207.202:80",       "RU"),
    ("http://109.200.159.126:8080",   "RU"),
    ("http://37.204.157.91:3128",     "RU"),
    ("http://178.215.168.144:3128",   "RU"),
    ("http://213.157.6.50:80",        "RU"),
    # United States
    ("http://161.77.221.196:3129",    "US"),
    ("http://51.79.157.202:80",       "US"),
    ("http://72.10.160.171:24619",    "US"),
    ("http://72.10.160.90:4189",      "US"),
    ("http://72.10.160.173:9521",     "US"),
    ("http://72.10.164.178:11905",    "US"),
    ("http://72.10.164.178:3229",     "US"),
    ("http://74.48.49.216:80",        "US"),
    ("http://66.23.232.83:80",        "US"),
    ("http://168.196.8.167:999",      "US"),
    ("http://131.161.51.58:8080",     "US"),
    ("http://107.175.50.0:3128",      "US"),
    # United Kingdom
    ("http://185.56.209.118:3128",    "GB"),
    ("http://194.87.238.83:80",       "GB"),
    ("http://185.56.209.119:3128",    "GB"),
    ("http://178.62.70.52:3128",      "GB"),
    ("http://212.38.185.29:8080",     "GB"),
    ("http://195.197.255.57:3128",    "GB"),
    ("http://51.15.184.132:3128",     "GB"),
    # Germany
    ("http://185.15.172.212:3128",    "DE"),
    ("http://138.201.200.33:3128",    "DE"),
    ("http://78.46.190.34:8080",      "DE"),
    ("http://195.201.115.230:3128",   "DE"),
    ("http://185.125.218.208:3128",   "DE"),
    ("http://94.177.247.155:3128",    "DE"),
    ("http://116.203.98.98:3128",     "DE"),
    # France
    ("http://195.154.255.118:80",     "FR"),
    ("http://80.241.219.148:3128",    "FR"),
    ("http://37.59.1.56:3128",        "FR"),
    ("http://92.222.217.155:8080",    "FR"),
    ("http://5.196.207.9:3128",       "FR"),
    # Canada
    ("http://64.227.6.218:3128",      "CA"),
    ("http://165.22.252.76:3128",     "CA"),
    ("http://206.189.157.4:3128",     "CA"),
    ("http://142.132.201.88:3128",    "CA"),
    # Bangladesh
    ("http://103.217.216.50:8080",    "BD"),
    ("http://103.92.129.250:8080",    "BD"),
    ("http://103.83.55.75:8080",      "BD"),
    ("http://103.125.159.247:3128",   "BD"),
    # Pakistan
    ("http://103.248.16.234:8080",    "PK"),
    ("http://103.216.207.94:8080",    "PK"),
    ("http://103.105.212.106:8080",   "PK"),
    ("http://203.128.79.76:3128",     "PK"),
    # Argentina
    ("http://190.61.88.147:8080",     "AR"),
    ("http://200.55.3.122:53281",     "AR"),
    ("http://181.209.78.68:999",      "AR"),
    ("http://200.55.3.125:53281",     "AR"),
    # Colombia
    ("http://181.65.200.50:80",       "CO"),
    ("http://190.12.93.78:80",        "CO"),
    ("http://190.12.97.58:8080",      "CO"),
    # Nigeria
    ("http://197.211.219.203:3128",   "NG"),
    ("http://102.68.128.214:8080",    "NG"),
    ("http://102.68.128.210:8080",    "NG"),
    # Egypt
    ("http://102.39.190.91:8080",     "EG"),
    ("http://41.84.143.228:8080",     "EG"),
    # Netherlands
    ("http://51.15.244.201:3128",     "NL"),
    ("http://185.105.237.9:3128",     "NL"),
    ("http://164.92.70.76:3128",      "NL"),
    # Singapore
    ("http://128.199.102.183:3128",   "SG"),
    ("http://178.128.91.170:3128",    "SG"),
    ("http://165.22.56.71:3128",      "SG"),
    # Japan
    ("http://133.18.234.13:8080",     "JP"),
    ("http://60.137.198.166:3128",    "JP"),
    # South Korea
    ("http://121.67.45.250:8080",     "KR"),
    ("http://116.103.222.244:3128",   "KR"),
    # Malaysia
    ("http://103.142.81.34:8080",     "MY"),
    ("http://103.1.93.184:8080",      "MY"),
    ("http://125.17.80.229:8080",     "MY"),
    # Ghana
    ("http://197.255.126.38:80",      "GH"),
    # Peru
    ("http://186.121.235.66:8080",    "PE"),
    ("http://186.121.214.4:8080",     "PE"),
    # Chile
    ("http://190.116.38.42:80",       "CL"),
    ("http://190.82.105.123:80",      "CL"),
    # Ecuador
    ("http://181.78.3.34:999",        "EC"),
    ("http://190.61.46.250:999",      "EC"),
]

# ── Pool state ────────────────────────────────────────────────────────────────

_healthy: list[tuple[str, str]] = []   # (proxy_url, country)
_last_checked: dict[str, float] = {}   # proxy_url → timestamp
_pool_lock = asyncio.Lock()
_pool_ready = False

MIN_POOL_SIZE = 30   # minimum healthy to accept
CHECK_URL = "http://www.gstatic.com/generate_204"  # fast, neutral check
PROXY_TIMEOUT = 6


# ── Health check ──────────────────────────────────────────────────────────────

async def _check_one(url: str, country: str) -> tuple[str, str, bool]:
    try:
        async with httpx.AsyncClient(
            proxies={"http://": url, "https://": url},
            timeout=PROXY_TIMEOUT,
        ) as c:
            r = await c.get(CHECK_URL)
            ok = r.status_code in (200, 204)
    except Exception:
        ok = False
    return url, country, ok


async def _run_health_check(candidates: list[tuple[str, str]]) -> list[tuple[str, str]]:
    tasks = [_check_one(u, c) for u, c in candidates]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    good = []
    for r in results:
        if isinstance(r, tuple) and r[2]:
            good.append((r[0], r[1]))
    return good


# ── Build / refresh ───────────────────────────────────────────────────────────

async def build_proxy_pool():
    global _healthy, _pool_ready
    logger.info(f"Building proxy pool from {len(RAW_PROXIES)} candidates…")
    good = await _run_health_check(RAW_PROXIES)
    async with _pool_lock:
        _healthy = good
        _pool_ready = True
    logger.info(f"Proxy pool ready: {len(_healthy)} healthy proxies")
    asyncio.create_task(_background_refresh())


async def _background_refresh():
    """Re-check all proxies every 4 minutes; keep pool fresh."""
    while True:
        await asyncio.sleep(240)
        logger.info("Refreshing proxy pool…")
        good = await _run_health_check(RAW_PROXIES)
        async with _pool_lock:
            _healthy[:] = good
        logger.info(f"Proxy pool refreshed: {len(_healthy)} healthy")


# ── Public API ────────────────────────────────────────────────────────────────

def get_random_proxy() -> Optional[tuple[str, str]]:
    """Return (proxy_url, country_code) or None if pool is empty."""
    if not _healthy:
        return None
    return random.choice(_healthy)


def remove_proxy(proxy_url: str):
    """Immediately evict a dead proxy from the pool."""
    before = len(_healthy)
    _healthy[:] = [(u, c) for u, c in _healthy if u != proxy_url]
    if len(_healthy) < before:
        logger.warning(f"Evicted dead proxy ({proxy_url}). Pool: {len(_healthy)}")


def pool_stats() -> dict:
    by_country: dict[str, int] = {}
    for _, c in _healthy:
        by_country[c] = by_country.get(c, 0) + 1
    return {
        "total": len(_healthy),
        "by_country": by_country,
        "ready": _pool_ready,
    }
