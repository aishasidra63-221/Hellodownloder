const API_BASE = "/tikapi";

export interface VideoInfo {
  success: boolean;
  title: string;
  author: string;
  duration: number;
  thumbnail: string;
  view_count?: number;
  like_count?: number;
}

export interface HistoryItem {
  url: string;
  title: string;
  author: string;
  thumbnail: string;
  format: string;
  downloaded_at: number;
}

export type DownloadFormat = "mp4_nowm" | "mp4" | "mp3" | "photo";

async function getSessionToken(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/token`);
  if (!res.ok) return "";
  const data = await res.json();
  return data.token || "";
}

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const res = await fetch(`${API_BASE}/api/info`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to fetch info" }));
    throw new Error(err.detail || "Failed to fetch video info");
  }
  return res.json();
}

export async function downloadVideo(url: string, format: DownloadFormat): Promise<void> {
  const token = await getSessionToken();

  const res = await fetch(`${API_BASE}/api/download`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, format, session_token: token }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Download failed" }));
    throw new Error(err.detail || "Download failed");
  }

  const blob = await res.blob();
  const extMap: Record<DownloadFormat, string> = {
    mp4_nowm: "mp4",
    mp4: "mp4",
    mp3: "mp3",
    photo: "jpg",
  };
  const ext = extMap[format];
  const title = res.headers.get("X-Video-Title") || "tiktok";
  const filename = `${title.slice(0, 40).replace(/[^a-z0-9]/gi, "_")}.${ext}`;

  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE}/api/history`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.history || [];
}

export async function clearHistory(): Promise<void> {
  await fetch(`${API_BASE}/api/history`, { method: "DELETE" });
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
