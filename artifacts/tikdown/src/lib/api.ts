const API_BASE = "/tikapi";
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

// ─── Local history helpers ────────────────────────────────────────────────────

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

// ─── Session token ────────────────────────────────────────────────────────────

async function getSessionToken(): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/token`);
    if (!res.ok) return "";
    const data = await res.json();
    return data.token || "";
  } catch {
    return "";
  }
}

// ─── CDN-direct download ──────────────────────────────────────────────────────
// Server never streams the file — only provides the CDN URL.
// Browser fetches the file directly from TikTok CDN.

async function _cdnDownload(cdnUrl: string, filename: string): Promise<void> {
  // Try blob download (zero server bandwidth — pure CDN direct)
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
    return;
  } catch {
    // CORS blocked by CDN — open CDN URL directly in new tab
    // User can long-press / right-click → Save
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
    const err = await res.json().catch(() => ({ detail: "Failed to fetch info" }));
    throw new Error(err.detail || "Failed to fetch video info");
  }
  return res.json();
}

export async function downloadVideo(
  url: string,
  format: DownloadFormat,
  videoMeta?: { title?: string; author?: string; thumbnail?: string },
  recaptchaToken?: string,
): Promise<void> {
  const token = await getSessionToken();

  // Server call: returns CDN URL only — no file streaming, zero server bandwidth
  const res = await fetch(`${API_BASE}/api/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      format,
      session_token: token,
      recaptcha_token: recaptchaToken ?? null,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Download failed" }));
    throw new Error(err.detail || "Download failed");
  }

  const data = await res.json();
  const cdnUrl: string = data.cdn_url;
  const filename: string = data.filename || "luldown.mp4";

  if (!cdnUrl) throw new Error("No download URL received");

  _addHistoryEntry({
    url,
    title: data.title || videoMeta?.title || "TikTok Video",
    author: data.author || videoMeta?.author || "Unknown",
    thumbnail: videoMeta?.thumbnail || "",
    format,
    downloaded_at: Math.floor(Date.now() / 1000),
  });

  // Download directly from CDN — server never touches the file bytes
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
