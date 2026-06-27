import { useState, useCallback } from "react";
import { fetchVideoInfo, downloadVideo, downloadPhoto, VideoInfo, DownloadFormat } from "@/lib/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  Video, Music, Film, Copy, Download, Image,
  AlertCircle, Clock, User, Eye, Heart, Loader2, X,
} from "lucide-react";

interface FormatOption {
  format: DownloadFormat;
  label: string;
  sublabel: string;
  Icon: React.ElementType;
  neonColor: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  { format: "mp4_1080", label: "MP4 — 1080p HD",  sublabel: "Best quality · No Watermark",   Icon: Video, neonColor: "#ff2d78" },
  { format: "mp4_720",  label: "MP4 — 720p",       sublabel: "Standard HD · No Watermark",    Icon: Film,  neonColor: "#9b5de5" },
  { format: "mp3",      label: "MP3 Audio",         sublabel: "192 kbps · Audio only",         Icon: Music, neonColor: "#00f2ea" },
  { format: "thumbnail",label: "Thumbnail",         sublabel: "Cover image · JPG",             Icon: Image, neonColor: "#ffe94b" },
];

function fmtNum(n?: number) {
  if (!n) return null;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Step = "idle" | "loading-info" | "info-ready" | "downloading" | "error";

interface Props {
  highlightFormat?: DownloadFormat;
}

export default function DownloaderBox({ highlightFormat }: Props) {
  const [url, setUrl]                           = useState("");
  const [step, setStep]                         = useState<Step>("idle");
  const [info, setInfo]                         = useState<VideoInfo | null>(null);
  const [error, setError]                       = useState("");
  const [activeDownload, setActiveDownload]     = useState<DownloadFormat | null>(null);
  const [photoDownloading, setPhotoDownloading] = useState<number | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getToken = useCallback(async (action: string): Promise<string | undefined> => {
    if (!executeRecaptcha) return undefined;
    try { return await executeRecaptcha(action); } catch { return undefined; }
  }, [executeRecaptcha]);

  const handleFetch = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setStep("loading-info");
    setError("");
    setInfo(null);
    try {
      const token = await getToken("fetch_info");
      const data  = await fetchVideoInfo(trimmed, token);
      setInfo(data);
      setStep("info-ready");
    } catch (e: any) {
      setError(e.message || "Failed to fetch video info");
      setStep("error");
    }
  };

  const handleDownload = async (format: DownloadFormat) => {
    setActiveDownload(format);
    try {
      const token = await getToken("download");
      await downloadVideo(url.trim(), format, {
        title:         info?.title,
        author:        info?.author,
        thumbnail:     info?.thumbnail,
        download_urls: info?.download_urls,
      }, token);
    } catch (e: any) {
      setError(e.message || "Download failed");
      setStep("error");
    } finally {
      setActiveDownload(null);
    }
  };

  const handlePhotoDownload = async (imgUrl: string, index: number) => {
    setPhotoDownloading(index);
    try { await downloadPhoto(imgUrl, index); }
    finally { setPhotoDownloading(null); }
  };

  const handlePaste = async () => {
    try { setUrl(await navigator.clipboard.readText()); } catch {}
  };

  const reset = () => { setUrl(""); setStep("idle"); setInfo(null); setError(""); };

  const isPhoto = info?.is_photo && (info.images?.length ?? 0) > 0;

  const formats = highlightFormat
    ? [...FORMAT_OPTIONS].sort((a) => (a.format === highlightFormat ? -1 : 1))
    : FORMAT_OPTIONS;

  return (
    <div className="space-y-4">

      {/* ── Input row ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            placeholder="Paste TikTok link here…"
            className="neon-input w-full pl-4 pr-16 py-4 rounded-2xl text-sm font-medium"
          />
          {url ? (
            <button onClick={reset}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 p-1.5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handlePaste}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-[#ff6aaa] font-bold hover:text-[#ff2d78] transition-colors">
              <Copy className="w-3.5 h-3.5" /> Paste
            </button>
          )}
        </div>

        <button
          onClick={handleFetch}
          disabled={!url.trim() || step === "loading-info"}
          className="gradient-btn w-full sm:w-auto px-9 py-4 text-white font-black rounded-2xl text-sm whitespace-nowrap flex items-center justify-center gap-2"
        >
          {step === "loading-info"
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Fetching…</>
            : <><Download className="w-4 h-4" /> Download</>}
        </button>
      </div>

      {/* ── Error ── */}
      {step === "error" && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl text-sm text-[#ff6aaa] border border-[rgba(255,45,120,0.25)] bg-[rgba(255,45,120,0.08)]">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Result card ── */}
      {step === "info-ready" && info && (
        <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] animate-in fade-in slide-in-from-bottom-3 duration-300"
          style={{ background: "rgba(12,8,28,0.95)", boxShadow: "0 0 40px rgba(255,45,120,0.1), 0 20px 60px rgba(0,0,0,0.5)" }}>

          {/* ── Thumbnail + info ── */}
          {info.thumbnail ? (
            <div className="relative h-44 sm:h-56 overflow-hidden">
              <img src={info.thumbnail} alt={info.title} className="w-full h-full object-cover opacity-70" />
              {/* Gradient overlay */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(8,4,20,0.97) 0%, rgba(8,4,20,0.5) 50%, transparent 100%)" }} />
              {/* Neon top line */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, #ff2d78, #9b5de5, #00f2ea)" }} />

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold text-sm line-clamp-2 mb-2">{info.title}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(255,45,120,0.2)", color: "#ff6aaa", border: "1px solid rgba(255,45,120,0.3)" }}>
                    <User className="w-3 h-3" /> @{info.author}
                  </span>
                  {info.duration > 0 && (
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <Clock className="w-3 h-3" /> {fmtDuration(info.duration)}
                    </span>
                  )}
                  {!!info.view_count && (
                    <span className="flex items-center gap-1 text-xs text-white/40">
                      <Eye className="w-3 h-3" /> {fmtNum(info.view_count)}
                    </span>
                  )}
                  {!!info.like_count && (
                    <span className="flex items-center gap-1 text-xs text-[#ff6aaa]/70">
                      <Heart className="w-3 h-3 fill-current" /> {fmtNum(info.like_count)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 border-b border-white/6">
              <p className="font-bold text-white">{info.title || "TikTok Video"}</p>
              <p className="text-sm text-white/40 mt-1">@{info.author}</p>
            </div>
          )}

          {/* ── Photo post ── */}
          {isPhoto ? (
            <div className="p-5 space-y-3">
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                📸 Photo Post — {info.images!.length} image{info.images!.length > 1 ? "s" : ""}
              </p>
              {info.images!.length > 1 && (
                <button
                  onClick={() => info.images!.forEach((u, i) => setTimeout(() => handlePhotoDownload(u, i), i * 400))}
                  disabled={photoDownloading !== null}
                  className="gradient-btn w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  Save All {info.images!.length} Photos
                </button>
              )}
              <div className={`grid gap-3 ${info.images!.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                {info.images!.map((imgUrl, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-white/6 flex flex-col"
                    style={{ background: "rgba(10,6,22,0.9)" }}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img src={imgUrl} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs rounded-md px-1.5 py-0.5 font-bold">
                        {i + 1}/{info.images!.length}
                      </div>
                    </div>
                    <button
                      onClick={() => handlePhotoDownload(imgUrl, i)}
                      disabled={photoDownloading !== null}
                      className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[#ff6aaa] hover:text-white transition-colors disabled:opacity-50"
                      style={{ borderTop: "1px solid rgba(255,45,120,0.15)" }}
                    >
                      {photoDownloading === i
                        ? <><Loader2 className="w-3 h-3 animate-spin" /> Saving…</>
                        : <><Download className="w-3 h-3" /> Save Photo</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ── Format buttons ── */
            <div className="p-5 space-y-2.5">
              <p className="text-[10px] font-black text-white/25 uppercase tracking-widest mb-3">Choose Format</p>
              {formats.map(({ format, label, sublabel, Icon, neonColor }) => {
                const isActive      = activeDownload === format;
                const isHighlighted = highlightFormat === format;
                return (
                  <button
                    key={format}
                    onClick={() => handleDownload(format)}
                    disabled={!!activeDownload}
                    className="format-btn w-full flex items-center gap-4 p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                    style={isHighlighted ? {
                      background: `${neonColor}18`,
                      borderColor: `${neonColor}50`,
                      boxShadow: `0 0 16px ${neonColor}20`,
                    } : undefined}
                  >
                    {/* Icon bubble */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: `${neonColor}15`,
                        border: `1.5px solid ${neonColor}30`,
                      }}>
                      {isActive
                        ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: neonColor }} />
                        : <Icon className="w-4 h-4" style={{ color: neonColor }} />}
                    </div>

                    {/* Labels */}
                    <div className="text-left flex-1">
                      <div className="font-bold text-sm text-white group-hover:text-white">
                        {isActive ? "Downloading…" : label}
                      </div>
                      <div className="text-xs text-white/30">{sublabel}</div>
                    </div>

                    {/* Arrow */}
                    <Download className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
