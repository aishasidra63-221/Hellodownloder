import { useState } from "react";
import { fetchVideoInfo, downloadVideo, VideoInfo, DownloadFormat } from "@/lib/api";

type Step = "idle" | "loading-info" | "info-ready" | "downloading" | "done" | "error";

const FORMAT_OPTIONS: { format: DownloadFormat; label: string; icon: string; desc: string }[] = [
  { format: "mp4_nowm", label: "MP4 No Watermark", icon: "🎬", desc: "HD video, no logo" },
  { format: "mp4", label: "MP4 Original", icon: "📹", desc: "Original with watermark" },
  { format: "mp3", label: "MP3 Audio", icon: "🎵", desc: "Audio only, 192kbps" },
  { format: "photo", label: "Photo / Slideshow", icon: "🖼️", desc: "Download images" },
];

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>("mp4_nowm");
  const [activeDownload, setActiveDownload] = useState<DownloadFormat | null>(null);

  const handleFetch = async () => {
    if (!url.trim()) return;
    setStep("loading-info");
    setError("");
    setInfo(null);
    try {
      const data = await fetchVideoInfo(url.trim());
      setInfo(data);
      setStep("info-ready");
    } catch (e: any) {
      setError(e.message || "Failed to fetch video info");
      setStep("error");
    }
  };

  const handleDownload = async (format: DownloadFormat) => {
    setActiveDownload(format);
    setStep("downloading");
    try {
      await downloadVideo(url.trim(), format);
      setStep("info-ready");
    } catch (e: any) {
      setError(e.message || "Download failed");
      setStep("error");
    } finally {
      setActiveDownload(null);
    }
  };

  const handleReset = () => {
    setUrl("");
    setStep("idle");
    setInfo(null);
    setError("");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {}
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4 leading-tight">
          Download TikTok Videos
          <br />
          <span className="text-primary">Without Watermark</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Free · Fast · No Login · MP4, MP3 & Photos
        </p>
      </div>

      {/* URL Input Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              placeholder="Paste TikTok link here..."
              className="w-full px-4 py-3.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm pr-20"
            />
            {!url && (
              <button
                onClick={handlePaste}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary font-medium hover:underline"
              >
                Paste
              </button>
            )}
            {url && (
              <button
                onClick={handleReset}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={handleFetch}
            disabled={!url.trim() || step === "loading-info"}
            className="px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl download-btn disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
          >
            {step === "loading-info" ? "⏳ Fetching..." : "🔍 Fetch"}
          </button>
        </div>

        {/* Error */}
        {step === "error" && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Video Info */}
      {step === "info-ready" && info && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex gap-4 mb-6">
            {info.thumbnail && (
              <img
                src={info.thumbnail}
                alt={info.title}
                className="w-24 h-24 object-cover rounded-xl flex-shrink-0 border border-border"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-1">
                {info.title || "TikTok Video"}
              </h2>
              <p className="text-xs text-muted-foreground">@{info.author || "Unknown"}</p>
              {info.duration > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  ⏱ {Math.floor(info.duration / 60)}:{String(info.duration % 60).padStart(2, "0")}
                </p>
              )}
            </div>
          </div>

          {/* Download buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FORMAT_OPTIONS.map((opt) => (
              <button
                key={opt.format}
                onClick={() => handleDownload(opt.format)}
                disabled={step === "downloading"}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-secondary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="text-2xl">{opt.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">
                    {activeDownload === opt.format ? "Downloading..." : opt.label}
                  </div>
                  <div className="text-xs text-muted-foreground group-hover:text-primary-foreground/70">
                    {opt.desc}
                  </div>
                </div>
                {activeDownload === opt.format && (
                  <span className="ml-auto animate-spin">⏳</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="grid grid-cols-3 gap-4 mt-10">
        {[
          { step: "1", icon: "📋", title: "Copy Link", desc: "Copy TikTok video link from the app" },
          { step: "2", icon: "🔍", title: "Paste & Fetch", desc: "Paste link above and click Fetch" },
          { step: "3", icon: "⬇️", title: "Download", desc: "Choose MP4, MP3 or Photo" },
        ].map((s) => (
          <div key={s.step} className="bg-card border border-border rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="font-bold text-sm text-foreground">{s.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: "✅", label: "No Watermark" },
          { icon: "🆓", label: "100% Free" },
          { icon: "🚀", label: "Lightning Fast" },
          { icon: "🔒", label: "Secure & Private" },
        ].map((f) => (
          <div key={f.label} className="bg-card border border-border rounded-xl px-3 py-3 flex items-center gap-2">
            <span>{f.icon}</span>
            <span className="text-sm font-medium text-foreground">{f.label}</span>
          </div>
        ))}
      </div>

      {/* SEO content */}
      <div className="mt-14 space-y-6 text-sm text-muted-foreground">
        <h2 className="text-xl font-bold text-foreground">Best TikTok Downloader 2025</h2>
        <p>
          TikDown is the fastest and most reliable way to download TikTok videos without watermark.
          Simply paste any TikTok URL and download in HD MP4, extract MP3 audio, or save photos
          from TikTok slideshows — all for free, no account needed.
        </p>

        <h3 className="text-lg font-semibold text-foreground">Why TikDown?</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Download TikTok videos in HD without watermark</li>
          <li>Extract MP3 audio at 192kbps quality</li>
          <li>Download TikTok photos and slideshows</li>
          <li>Works on mobile (Android, iPhone) and desktop</li>
          <li>No registration or login required</li>
          <li>History saved locally — revisit past downloads</li>
        </ul>
      </div>
    </div>
  );
}
