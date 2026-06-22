import asyncio
import logging
import os
import shutil
from contextlib import asynccontextmanager
from typing import Literal

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, HttpUrl
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from downloader import DownloadError, download_tiktok, get_video_info
from proxy_pool import build_proxy_pool

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(build_proxy_pool())
    yield


app = FastAPI(
    title="TikTok Downloader API",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DownloadRequest(BaseModel):
    url: str
    format: Literal["mp4", "mp4_nowm", "mp3", "photo"] = "mp4_nowm"


class InfoRequest(BaseModel):
    url: str


@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


@app.post("/api/info")
@limiter.limit("10/minute")
async def video_info(request: Request, body: InfoRequest):
    url = str(body.url).strip()
    if "tiktok.com" not in url and "vm.tiktok.com" not in url:
        raise HTTPException(status_code=400, detail="Invalid TikTok URL")
    try:
        info = await get_video_info(url)
        return info
    except DownloadError as e:
        raise HTTPException(status_code=422, detail=str(e))


@app.post("/api/download")
@limiter.limit("10/minute")
async def download(request: Request, body: DownloadRequest):
    url = str(body.url).strip()
    if "tiktok.com" not in url and "vm.tiktok.com" not in url:
        raise HTTPException(status_code=400, detail="Invalid TikTok URL")

    try:
        result = await download_tiktok(url, body.format)
    except DownloadError as e:
        raise HTTPException(status_code=422, detail=str(e))

    file_path = result["file_path"]
    tmpdir = result["tmpdir"]

    ext_map = {"mp4": "video/mp4", "mp4_nowm": "video/mp4", "mp3": "audio/mpeg", "photo": "image/jpeg"}
    media_type = ext_map.get(body.format, "application/octet-stream")

    filename = os.path.basename(file_path)

    async def cleanup():
        await asyncio.sleep(60)
        shutil.rmtree(tmpdir, ignore_errors=True)

    asyncio.create_task(cleanup())

    return FileResponse(
        path=file_path,
        media_type=media_type,
        filename=filename,
        headers={
            "X-Video-Title": result.get("title", "")[:100],
            "X-Video-Author": result.get("author", "")[:50],
        },
    )


@app.post("/api/download/photos")
@limiter.limit("10/minute")
async def download_photos(request: Request, body: DownloadRequest):
    url = str(body.url).strip()
    if "tiktok.com" not in url and "vm.tiktok.com" not in url:
        raise HTTPException(status_code=400, detail="Invalid TikTok URL")

    body.format = "photo"
    try:
        result = await download_tiktok(url, "photo")
    except DownloadError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return {
        "success": True,
        "photo_count": result.get("photo_count", 1),
        "photos": [
            f"/api/download/photo-file?path={p}" for p in result.get("all_photos", [])
        ],
        "title": result.get("title", ""),
        "author": result.get("author", ""),
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
