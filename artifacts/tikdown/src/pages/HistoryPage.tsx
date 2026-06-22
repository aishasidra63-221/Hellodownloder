import { useEffect, useState } from "react";
import { fetchHistory, clearHistory, HistoryItem } from "@/lib/api";
import { Trash2, Download, Clock, Video, Music, Image, Film, Inbox, Loader2, User } from "lucide-react";

const FORMAT_META: Record<string, { Icon: React.ElementType; label: string; color: string }> = {
  mp4_nowm: { Icon: Video, label: "MP4 No Watermark", color: "text-blue-500" },
  mp4:      { Icon: Film,  label: "MP4 Original",     color: "text-purple-500" },
  mp3:      { Icon: Music, label: "MP3 Audio",        color: "text-green-500" },
  photo:    { Icon: Image, label: "Photo",            color: "text-orange-500" },
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
    setHistory(await fetchHistory());
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Download History</h1>
          <p className="text-muted-foreground text-sm mt-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Last 10 downloads — auto-saved per session
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            disabled={clearing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive border border-destructive/30 rounded-xl hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Clear All
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p className="text-sm">Loading history…</p>
        </div>
      ) : history.length === 0 ? (
        /* Empty */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Inbox className="w-9 h-9 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No downloads yet</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            Your download history will appear here after you download a TikTok video.
          </p>
          <a
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Download a Video
          </a>
        </div>
      ) : (
        /* History list */
        <div className="space-y-3">
          {history.map((item, i) => {
            const meta = FORMAT_META[item.format] ?? FORMAT_META["mp4_nowm"];
            return (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center hover:border-primary/30 transition-all group"
              >
                {/* Thumbnail or icon */}
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-border"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <meta.Icon className={`w-6 h-6 ${meta.color}`} />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground line-clamp-1 mb-0.5">
                    {item.title || "TikTok Video"}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <User className="w-3 h-3" /> @{item.author || "Unknown"}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`flex items-center gap-1 text-xs bg-secondary px-2 py-0.5 rounded-full ${meta.color}`}>
                      <meta.Icon className="w-3 h-3" />
                      {meta.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {timeAgo(item.downloaded_at)}
                    </span>
                  </div>
                </div>

                {/* Re-download */}
                <a
                  href={`/?url=${encodeURIComponent(item.url)}`}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-primary border border-primary/30 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Download className="w-3.5 h-3.5" />
                  Again
                </a>
              </div>
            );
          })}

          <p className="text-center text-xs text-muted-foreground pt-2">
            {history.length} / 10 items — older downloads are auto-removed (FIFO)
          </p>
        </div>
      )}
    </div>
  );
}
