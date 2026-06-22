"""
reCAPTCHA v3 Bot Protection
Set RECAPTCHA_SECRET in env to enable. Disabled by default (dev mode).
"""
import httpx
import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)

RECAPTCHA_SECRET = os.environ.get("RECAPTCHA_SECRET", "")
RECAPTCHA_MIN_SCORE = float(os.environ.get("RECAPTCHA_MIN_SCORE", "0.5"))
RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

_enabled = bool(RECAPTCHA_SECRET)


def is_enabled() -> bool:
    return _enabled


async def verify_token(token: Optional[str], remote_ip: Optional[str] = None) -> tuple[bool, float, str]:
    """
    Verify reCAPTCHA token.
    Returns (is_human, score, action)
    """
    if not _enabled:
        return True, 1.0, "disabled"

    if not token:
        return False, 0.0, "missing_token"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                RECAPTCHA_VERIFY_URL,
                data={
                    "secret": RECAPTCHA_SECRET,
                    "response": token,
                    **({"remoteip": remote_ip} if remote_ip else {}),
                },
            )
            data = resp.json()

        if not data.get("success"):
            errors = data.get("error-codes", [])
            logger.warning(f"reCAPTCHA failed: {errors}")
            return False, 0.0, str(errors)

        score = data.get("score", 0.0)
        action = data.get("action", "")

        if score < RECAPTCHA_MIN_SCORE:
            logger.warning(f"reCAPTCHA score too low: {score}")
            return False, score, action

        return True, score, action

    except Exception as e:
        logger.error(f"reCAPTCHA error: {e}")
        return True, 1.0, "error_bypass"  # fail open in case of network error
