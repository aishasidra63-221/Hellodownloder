import asyncio
import os
import tempfile
import glob
import logging
from typing import Optional

import yt_dlp

from bypass import build_ydl_opts, random_delay
from proxy_pool import get_random_proxy, remove_proxy

logger = logging.getLogger(__name__)


class DownloadError(Exception):
    pass


async def _run_ydl(opts: dict, url: str) -> dict:
    loop = asyncio.get_event_loop()

    def _download():
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=True)
            return info

    return await loop.run_in_executor(None, _download)


async def download_tiktok(url: str, format_type: str = "mp4") -> dict:
    await random_delay()

    proxy = get_random_proxy()
    tmpdir = tempfile.mkdtemp(prefix="tikdl_")

    output_template = os.path.join(tmpdir, "%(id)s.%(ext)s")

    opts = build_ydl_opts(format_type, output_template, proxy)

    try:
        info = await _run_ydl(opts, url)
    except Exception as e:
        if proxy:
            remove_proxy(proxy)
        proxy = get_random_proxy()
        if proxy:
            opts["proxy"] = proxy
            try:
                info = await _run_ydl(opts, url)
            except Exception as e2:
                raise DownloadError(f"Download failed: {str(e2)}")
        else:
            opts.pop("proxy", None)
            try:
                info = await _run_ydl(opts, url)
            except Exception as e3:
                raise DownloadError(f"Download failed (no proxy): {str(e3)}")

    if format_type == "photo":
        return _handle_photo(tmpdir, info)
    else:
        return _handle_video(tmpdir, info, format_type)


def _handle_video(tmpdir: str, info: dict, format_type: str) -> dict:
    ext = "mp3" if format_type == "mp3" else "mp4"
    files = glob.glob(os.path.join(tmpdir, f"*.{ext}"))
    if not files:
        all_files = glob.glob(os.path.join(tmpdir, "*"))
        if all_files:
            files = [all_files[0]]
        else:
            raise DownloadError("No output file found after download")

    file_path = files[0]
    file_size = os.path.getsize(file_path)

    return {
        "success": True,
        "file_path": file_path,
        "file_size": file_size,
        "title": info.get("title", "TikTok Video"),
        "author": info.get("uploader", "Unknown"),
        "duration": info.get("duration", 0),
        "thumbnail": info.get("thumbnail", ""),
        "format": format_type,
        "tmpdir": tmpdir,
    }


def _handle_photo(tmpdir: str, info: dict) -> dict:
    image_exts = ["jpg", "jpeg", "png", "webp"]
    image_files = []
    for ext in image_exts:
        image_files.extend(glob.glob(os.path.join(tmpdir, f"*.{ext}")))

    if not image_files:
        raise DownloadError("No photos found in this TikTok post")

    return {
        "success": True,
        "file_path": image_files[0],
        "all_photos": image_files,
        "photo_count": len(image_files),
        "title": info.get("title", "TikTok Photo"),
        "author": info.get("uploader", "Unknown"),
        "thumbnail": info.get("thumbnail", ""),
        "format": "photo",
        "tmpdir": tmpdir,
    }


async def get_video_info(url: str) -> dict:
    await random_delay()
    proxy = get_random_proxy()
    loop = asyncio.get_event_loop()

    opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": False,
        "skip_download": True,
    }
    if proxy:
        opts["proxy"] = proxy

    def _extract():
        with yt_dlp.YoutubeDL(opts) as ydl:
            return ydl.extract_info(url, download=False)

    try:
        info = await loop.run_in_executor(None, _extract)
        return {
            "success": True,
            "title": info.get("title", ""),
            "author": info.get("uploader", ""),
            "duration": info.get("duration", 0),
            "thumbnail": info.get("thumbnail", ""),
            "view_count": info.get("view_count", 0),
            "like_count": info.get("like_count", 0),
        }
    except Exception as e:
        raise DownloadError(f"Failed to fetch info: {str(e)}")
