"""
yt-dlp Auto-Updater — runs at midnight automatically
"""
import asyncio
import logging
import subprocess
import sys
from datetime import datetime, time

logger = logging.getLogger(__name__)


async def update_ytdlp():
    logger.info("Auto-updating yt-dlp...")
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "--upgrade", "yt-dlp"],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            logger.info("yt-dlp updated successfully")
            return True
        else:
            logger.error(f"yt-dlp update failed: {result.stderr}")
            return False
    except Exception as e:
        logger.error(f"Update error: {e}")
        return False


async def schedule_midnight_update():
    while True:
        now = datetime.now()
        midnight = datetime.combine(now.date(), time(0, 0, 0))
        if now > midnight:
            from datetime import timedelta
            midnight += timedelta(days=1)
        wait_seconds = (midnight - now).total_seconds()
        logger.info(f"Next yt-dlp update in {wait_seconds/3600:.1f} hours")
        await asyncio.sleep(wait_seconds)
        await update_ytdlp()


if __name__ == "__main__":
    asyncio.run(schedule_midnight_update())
