// If WORKER_URL is set at build time, use the Cloudflare Worker directly.
// Otherwise fall back to the local Python API proxy (for dev).
declare const __WORKER_URL__: string;
const WORKER_URL = typeof __WORKER_URL__ !== "undefined" ? __WORKER_URL__ : "";
const API_BASE = WORKER_URL || "/tikapi";

const HISTORY_KEY = "luldown_history";
const MAX_HISTORY = 10;

export interface VideoInfo {
  success: boolean;
  title: string;
  author: string;
  duration: number;
  thumbnail: string;
  view_count?: number;
  like_count?: number;
  is_photo?: boolean;
  images?: string[];
}

export interface HistoryItem {
  url: string;
  title: string;
  author: string;
  thumbnail: string;
  format: string;
  downloaded_at: number;
}

export type DownloadFormat = "mp4_720" | "mp4_1080" | "mp3";

// ─── Local history (localStorage) ────────────────────────────────────────────
// History is stored client-side — no server needed, fully private.

function _loadHistory(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function _saveHistory(items: HistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

function _addHistoryEntry(entry: HistoryItem) {
  let items = _loadHistory().filter((h) => h.url !== entry.url);
  items.unshift(entry);
  if (items.length > MAX_HISTORY) items = items.slice(0, MAX_HISTORY);
  _saveHistory(items);
}

// ─── CDN-direct download ──────────────────────────────────────────────────────
// Worker returns CDN URL only — server never streams file bytes.
// Browser fetches directly from TikTok CDN.

async function _cdnDownload(cdnUrl: string, filename: string): Promise<void> {
  try {
    const res = await fetch(cdnUrl, { mode: "cors" });
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  } catch {
    // CORS blocked by CDN — open in new tab, user can long-press → Save
    window.open(cdnUrl, "_blank", "noopener,noreferrer");
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchVideoInfo(
  url: string,
  recaptchaToken?: string,
): Promise<VideoInfo> {
  const res = await fetch(`${API_BASE}/api/info`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, recaptcha_token: recaptchaToken ?? null }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: "Failed to fetch info" }));
    throw new Error(errData.detail || "Failed to fetch video info");
  }
  return res.json();
}

export async function downloadVideo(
  url: string,
  format: DownloadFormat,
  videoMeta?: { title?: string; author?: string; thumbnail?: string },
  recaptchaToken?: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, format, recaptcha_token: recaptchaToken ?? null }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: "Download failed" }));
    throw new Error(errData.detail || "Download failed");
  }

  const data = await res.json();
  const cdnUrl: string = data.cdn_url;
  const filename: string = data.filename || "luldown.mp4";

  if (!cdnUrl) throw new Error("No download URL received");

  _addHistoryEntry({
    url,
    title:         data.title || videoMeta?.title || "TikTok Video",
    author:        data.author || videoMeta?.author || "Unknown",
    thumbnail:     videoMeta?.thumbnail || "",
    format,
    downloaded_at: Math.floor(Date.now() / 1000),
  });

  await _cdnDownload(cdnUrl, filename);
}

// Photo CDN-direct download — no server call at all, pure CDN
export async function downloadPhoto(cdnUrl: string, index: number): Promise<void> {
  const filename = `luldown_photo_${index + 1}.jpg`;
  await _cdnDownload(cdnUrl, filename);
}

// ─── History (localStorage) ───────────────────────────────────────────────────

export async function fetchHistory(): Promise<HistoryItem[]> {
  return _loadHistory();
}

export async function clearHistory(): Promise<void> {
  _saveHistory([]);
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
