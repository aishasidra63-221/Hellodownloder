import { useState, useCallback } from "react";
import { fetchVideoInfo, downloadVideo, downloadPhoto, VideoInfo, DownloadFormat } from "@/lib/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  Video, Music, Film, Clipboard, Download, Image,
  AlertCircle, Loader2, X, FlaskConical, Link as LinkIcon,
} from "lucide-react";

interface FormatOption {
  format: DownloadFormat;
  label: string;
  sublabel: string;
  Icon: React.ElementType;
}

const FORMAT_OPTIONS: FormatOption[] = [
  { format: "mp4_1080", label: "HD 1080p — No Watermark",   sublabel: "Best Quality · Full HD",   Icon: Video },
  { format: "mp4_720",  label: "720p — No Watermark",        sublabel: "Standard HD · Smaller",    Icon: Film  },
  { format: "mp3",      label: "MP3 Download — 192kbps",     sublabel: "Audio Only · High Quality", Icon: Music },
  { format: "thumbnail",label: "Thumbnail Download",         sublabel: "Cover Image · JPG",         Icon: Image },
];

const DEMO_DATA: VideoInfo = {
  success: true,
  title: "This is how your result card will look 🎉 Title shows here like this",
  author: "@creator_username",
  duration: 47,
  thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
  view_count: 2400000,
  like_count: 184000,
  comment_count: 3200,
  share_count: 12000,
  is_photo: false,
  download_urls: { mp4_1080: "", mp4_720: "", mp3: "" },
};

type Step = "idle" | "loading-info" | "info-ready" | "downloading" | "error";

interface Props {
  highlightFormat?: DownloadFormat;
}

const PURPLE = "#8b5cf6";

export default function DownloaderBox({ highlightFormat }: Props) {
  const [url, setUrl]                           = useState("");
  const [step, setStep]                         = useState<Step>("idle");
  const [info, setInfo]                         = useState<VideoInfo | null>(null);
  const [error, setError]                       = useState("");
  const [activeDownload, setActiveDownload]     = useState<DownloadFormat | null>(null);
  const [photoDownloading, setPhotoDownloading] = useState<number | null>(null);
  const [isDemo, setIsDemo]                     = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getToken = useCallback(async (action: string): Promise<string | undefined> => {
    if (!executeRecaptcha) return undefined;
    try { return await executeRecaptcha(action); } catch { return undefined; }
  }, [executeRecaptcha]);

  const handleFetch = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setIsDemo(false);
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

  const handleDemo = () => {
    setIsDemo(true);
    setUrl("https://www.tiktok.com/@demo/video/1234567890");
    setInfo(DEMO_DATA);
    setStep("info-ready");
    setError("");
  };

  const handleDownload = async (format: DownloadFormat) => {
    if (isDemo) return;
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
    if (isDemo) return;
    setPhotoDownloading(index);
    try { await downloadPhoto(imgUrl, index); }
    finally { setPhotoDownloading(null); }
  };

  const handlePaste = async () => {
    try { setUrl(await navigator.clipboard.readText()); } catch {}
  };

  const reset = () => { setUrl(""); setStep("idle"); setInfo(null); setError(""); setIsDemo(false); };

  const isPhoto = info?.is_photo && (info.images?.length ?? 0) > 0;
  const formats = highlightFormat
    ? [...FORMAT_OPTIONS].sort((a) => (a.format === highlightFormat ? -1 : 1))
    : FORMAT_OPTIONS;

  return (
    <div className="space-y-3 w-full">

      {/* ── Input row ── */}
      <div className="downloader-input-wrap flex items-center rounded-xl overflow-hidden">
        <div className="pl-4 pr-2 shrink-0" style={{ color: "rgba(139,92,246,0.6)" }}>
          <LinkIcon className="w-4 h-4" />
        </div>
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFetch()}
          placeholder="Paste TikTok video link here..."
          className="min-w-0 flex-1 bg-transparent pl-1 pr-2 py-3.5 text-sm outline-none"
        />

        {url ? (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 mr-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0"
            style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        ) : (
          <button
            onClick={handlePaste}
            className="flex items-center gap-1.5 mr-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0"
            style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}
          >
            <Clipboard className="w-3.5 h-3.5" />
            Paste
          </button>
        )}

        <button
          onClick={handleFetch}
          disabled={!url.trim() || step === "loading-info"}
          className="gradient-btn shrink-0 py-3.5 px-5 text-sm font-bold flex items-center gap-2"
        >
          {step === "loading-info"
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Fetching…</>
            : <><Download className="w-4 h-4" /> Download</>}
        </button>
      </div>

      {/* Example URL */}
      {step === "idle" && (
        <p className="text-xs text-center" style={{ color: "rgba(200,200,220,0.4)" }}>
          Example:{" "}
          <span style={{ color: PURPLE }}>https://www.tiktok.com/@user/video/1234567890</span>
        </p>
      )}

      {/* ── Demo button ── */}
      {step === "idle" && (
        <button
          onClick={handleDemo}
          className="demo-btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Preview Demo — dekho result card kaisa dikhega
        </button>
      )}

      {/* ── Error ── */}
      {step === "error" && (
        <div className="error-box flex items-start gap-2.5 p-4 rounded-xl text-sm border">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Result card ── */}
      {step === "info-ready" && info && (() => {
        const tags = (info.title || "").match(/#\w+/g) ?? [];
        const cleanTitle = (info.title || "").replace(/#\w+/g, "").trim();
        return (
          <div className="result-card rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">

            {isDemo && (
              <div className="flex items-center justify-center gap-1.5 py-2 text-[10px] font-black uppercase tracking-widest"
                style={{ background: "rgba(139,92,246,0.08)", color: "#a78bfa", borderBottom: "1px solid rgba(139,92,246,0.12)" }}>
                <FlaskConical className="w-3 h-3" />
                DEMO — Yeh sirf preview hai
              </div>
            )}

            {info.thumbnail && (
              <div className="relative w-full overflow-hidden" style={{ maxHeight: "160px" }}>
                <img src={info.thumbnail} alt={info.title} className="w-full object-cover" style={{ maxHeight: "160px" }} />
              </div>
            )}

            <div className="px-4 pt-3 pb-3 space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-black text-sm text-white"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
                  {info.author ? info.author.replace("@","").charAt(0).toUpperCase() : "T"}
                </div>
                <div className="flex-1 min-w-0">
                  {info.author && (
                    <p className="font-bold text-sm" style={{ color: PURPLE }}>{info.author}</p>
                  )}
                  {cleanTitle && (
                    <p className="text-xs leading-snug line-clamp-3 mt-0.5" style={{ color: "rgba(200,215,235,0.7)" }}>
                      {cleanTitle}
                    </p>
                  )}
                </div>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.slice(0, 6).map((tag) => (
                    <span key={tag} className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(139,92,246,0.15)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.25)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {isPhoto ? (
              <div className="p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: "rgba(200,215,235,0.35)" }}>
                  📸 Photo Post — {info.images!.length} image{info.images!.length > 1 ? "s" : ""}
                </p>
                {info.images!.length > 1 && (
                  <button
                    onClick={() => info.images!.forEach((u, i) => setTimeout(() => handlePhotoDownload(u, i), i * 400))}
                    disabled={photoDownloading !== null || isDemo}
                    className="gradient-btn w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" /> Save All {info.images!.length} Photos
                  </button>
                )}
                <div className={`grid gap-3 ${info.images!.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {info.images!.map((imgUrl, i) => (
                    <div key={i} className="rounded-xl overflow-hidden flex flex-col"
                      style={{ border: "1px solid rgba(139,92,246,0.15)", background: "rgba(13,15,26,0.6)" }}>
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img src={imgUrl} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs rounded-md px-1.5 py-0.5 font-bold">
                          {i + 1}/{info.images!.length}
                        </div>
                      </div>
                      <button
                        onClick={() => handlePhotoDownload(imgUrl, i)}
                        disabled={photoDownloading !== null || isDemo}
                        className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold disabled:opacity-50"
                        style={{ color: PURPLE, borderTop: "1px solid rgba(139,92,246,0.12)" }}
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
              <div className="p-3 space-y-2">
                {formats.map(({ format, label, Icon }) => {
                  const isActive = activeDownload === format;
                  return (
                    <button
                      key={format}
                      onClick={() => handleDownload(format)}
                      disabled={!!activeDownload || isDemo}
                      className="gradient-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50"
                    >
                      {isActive
                        ? <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                        : <Download className="w-4 h-4 shrink-0" />}
                      <span>{isActive ? "Downloading…" : label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
