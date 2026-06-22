import asyncio
import random
import httpx
from typing import Optional
import logging

logger = logging.getLogger(__name__)

FREE_PROXIES = [
    "http://103.152.112.162:80",
    "http://103.149.194.222:23500",
    "http://185.162.231.106:80",
    "http://103.167.135.108:8080",
    "http://103.177.9.133:8080",
    "http://103.105.49.20:8080",
    "http://51.79.157.202:80",
    "http://103.83.232.122:80",
    "http://103.155.217.1:41317",
    "http://181.78.19.239:999",
    "http://103.144.165.3:8080",
    "http://103.141.108.122:8080",
    "http://179.49.117.226:999",
    "http://161.77.221.196:3129",
    "http://103.180.119.91:3128",
]

healthy_proxies: list[str] = []
_pool_ready = False


async def check_proxy(proxy_url: str, timeout: int = 5) -> bool:
    try:
        async with httpx.AsyncClient(
            proxies={"http://": proxy_url, "https://": proxy_url},
            timeout=timeout,
        ) as client:
            resp = await client.get("https://www.google.com", follow_redirects=True)
            return resp.status_code == 200
    except Exception:
        return False


async def build_proxy_pool():
    global healthy_proxies, _pool_ready
    logger.info("Building proxy pool...")
    results = await asyncio.gather(*[check_proxy(p) for p in FREE_PROXIES])
    healthy_proxies = [p for p, ok in zip(FREE_PROXIES, results) if ok]
    _pool_ready = True
    logger.info(f"Proxy pool ready: {len(healthy_proxies)} healthy proxies")


def get_random_proxy() -> Optional[str]:
    if not healthy_proxies:
        return None
    return random.choice(healthy_proxies)


def remove_proxy(proxy: str):
    if proxy in healthy_proxies:
        healthy_proxies.remove(proxy)
        logger.warning(f"Removed dead proxy: {proxy}")
