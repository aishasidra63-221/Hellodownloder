import { useEffect, useState } from "react";
import { fetchHistory, clearHistory, HistoryItem } from "@/lib/api";

const FORMAT_ICONS: Record<string, string> = {
  mp4_nowm: "🎬",
  mp4: "📹",
  mp3: "🎵",
  photo: "🖼️",
};

const FORMAT_LABELS: Record<string, string> = {
  mp4_nowm: "MP4 No Watermark",
  mp4: "MP4 Original",
  mp3: "MP3 Audio",
  photo: "Photo",
};

function timeAgo(ts: number): string {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const load = async () => {
    setLoading(true);
    const h = await fetchHistory();
    setHistory(h);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleClear = async () => {
    if (!confirm("Clear all download history?")) return;
    setClearing(true);
    await clearHistory();
    setHistory([]);
    setClearing(false);
  };

  const handleDownloadAgain = (url: string) => {
    window.location.href = `/?url=${encodeURIComponent(url)}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Download History</h1>
          <p className="text-muted-foreground text-sm mt-1">Last 10 downloads saved per session</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            disabled={clearing}
            className="px-4 py-2 text-sm font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            {clearing ? "Clearing..." : "🗑️ Clear All"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-spin">⏳</div>
            <p className="text-muted-foreground text-sm">Loading history...</p>
          </div>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No history yet</h2>
          <p className="text-muted-foreground text-sm mb-6">Your downloads will appear here</p>
          <a
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Download a Video
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center hover:border-primary/30 transition-colors"
            >
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-border"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 text-2xl">
                  {FORMAT_ICONS[item.format] || "⬇️"}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground line-clamp-1">
                  {item.title || "TikTok Video"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">@{item.author || "Unknown"}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                    {FORMAT_ICONS[item.format]} {FORMAT_LABELS[item.format] || item.format}
                  </span>
                  <span className="text-xs text-muted-foreground">{timeAgo(item.downloaded_at)}</span>
                </div>
              </div>

              <a
                href={`/?url=${encodeURIComponent(item.url)}`}
                className="flex-shrink-0 px-3 py-2 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Download Again
              </a>
            </div>
          ))}

          <p className="text-center text-xs text-muted-foreground pt-2">
            {history.length}/10 items • Older downloads are auto-removed
          </p>
        </div>
      )}
    </div>
  );
}
