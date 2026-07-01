import { useState, useCallback, useRef } from "react";
import { fetchVideoInfo, downloadVideo, downloadPhoto, VideoInfo, DownloadFormat } from "@/lib/api";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  Music, Clipboard, Download, Image,
  AlertCircle, Loader2, X, FlaskConical,
} from "lucide-react";

/* ── Format row configs ── */
interface FormatConfig {
  format: DownloadFormat;
  label: string;
  badges: { emoji: string; text: string; bg: string; color: string }[];
  leftBg: string;
  leftContent: React.ReactNode;
  rowBg: string;
  rowBorder: string;
  btnBg: string;
  btnHover: string;
}

const FORMAT_CONFIGS: FormatConfig[] = [
  {
    format: "mp4_1080",
    label: "Download 1080p — No Watermark",
    badges: [
      { emoji: "⭐", text: "Best Quality",  bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
      { emoji: "●",  text: "Recommended",   bg: "rgba(16,185,129,0.15)", color: "#10b981" },
    ],
    leftBg: "#6d28d9",
    leftContent: (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", lineHeight:1.1 }}>
        <span style={{ fontSize:11, fontWeight:900, color:"#fff" }}>1080p</span>
        <span style={{ fontSize:9,  fontWeight:700, color:"rgba(255,255,255,0.8)" }}>HD</span>
      </div>
    ),
    rowBg: "rgba(109,40,217,0.07)",
    rowBorder: "rgba(109,40,217,0.25)",
    btnBg: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)",
    btnHover: "#7c3aed",
  },
  {
    format: "mp4_720",
    label: "Download 720p — No Watermark",
    badges: [
      { emoji: "◆", text: "Good Quality", bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },
    ],
    leftBg: "#1d4ed8",
    leftContent: (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", lineHeight:1.1 }}>
        <span style={{ fontSize:11, fontWeight:900, color:"#fff" }}>720p</span>
        <span style={{ fontSize:9,  fontWeight:700, color:"rgba(255,255,255,0.8)" }}>HD</span>
      </div>
    ),
    rowBg: "rgba(29,78,216,0.06)",
    rowBorder: "rgba(29,78,216,0.22)",
    btnBg: "linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)",
    btnHover: "#2563eb",
  },
  {
    format: "mp3",
    label: "Download MP3 Audio — 192kbps",
    badges: [
      { emoji: "●", text: "High Quality Audio", bg: "rgba(16,185,129,0.15)", color: "#10b981" },
    ],
    leftBg: "#15803d",
    leftContent: <Music size={20} color="#fff" strokeWidth={2} />,
    rowBg: "rgba(21,128,61,0.06)",
    rowBorder: "rgba(21,128,61,0.22)",
    btnBg: "linear-gradient(135deg,#16a34a 0%,#15803d 100%)",
    btnHover: "#16a34a",
  },
  {
    format: "thumbnail",
    label: "Download Thumbnail",
    badges: [
      { emoji: "◉", text: "JPG Image", bg: "rgba(245,158,11,0.15)", color: "#d97706" },
    ],
    leftBg: "#b45309",
    leftContent: <Image size={20} color="#fff" strokeWidth={2} />,
    rowBg: "rgba(180,83,9,0.06)",
    rowBorder: "rgba(180,83,9,0.22)",
    btnBg: "linear-gradient(135deg,#d97706 0%,#b45309 100%)",
    btnHover: "#d97706",
  },
];

/* ── Demo data ── */
const DEMO_DATA: VideoInfo = {
  success: true,
  title: "Beautiful Nature Scenery in 4K – Relaxing Video 🌿 #nature #4k #relaxing #scenery",
  author: "@creator_username",
  duration: 28,
  thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85",
  view_count: 5400000,
  like_count: 1200000,
  comment_count: 3200,
  share_count: 12000,
  is_photo: false,
  download_urls: { mp4_1080: "", mp4_720: "", mp3: "" },
};

type Step = "idle" | "loading-info" | "info-ready" | "error";
interface Props { highlightFormat?: DownloadFormat; }

export default function DownloaderBox({ highlightFormat }: Props) {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState("");
  const [activeDownload, setActiveDownload] = useState<DownloadFormat | null>(null);
  const [photoDownloading, setPhotoDownloading] = useState<number | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getToken = useCallback(async (action: string) => {
    if (!executeRecaptcha) return undefined;
    try { return await executeRecaptcha(action); } catch { return undefined; }
  }, [executeRecaptcha]);

  const handleFetch = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setIsDemo(false); setStep("loading-info"); setError(""); setInfo(null);
    try {
      const token = await getToken("fetch_info");
      setInfo(await fetchVideoInfo(trimmed, token));
      setStep("info-ready");
    } catch (e: any) {
      setError(e.message || "Failed to fetch video info");
      setStep("error");
    }
  };

  const handleDemo = () => {
    setIsDemo(true);
    setUrl("https://www.tiktok.com/@demo/video/1234567890");
    setInfo(DEMO_DATA); setStep("info-ready"); setError("");
  };

  const handleDownload = async (format: DownloadFormat) => {
    if (isDemo) return;
    setActiveDownload(format);
    try {
      const token = await getToken("download");
      await downloadVideo(url.trim(), format, {
        title: info?.title, author: info?.author,
        thumbnail: info?.thumbnail, download_urls: info?.download_urls,
      }, token);
    } catch (e: any) {
      setError(e.message || "Download failed"); setStep("error");
    } finally { setActiveDownload(null); }
  };

  const handlePhotoDownload = async (imgUrl: string, index: number) => {
    if (isDemo) return;
    setPhotoDownloading(index);
    try { await downloadPhoto(imgUrl, index); }
    finally { setPhotoDownloading(null); }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) { setUrl(text); return; }
    } catch {}
    const ta = document.createElement("textarea");
    ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0";
    document.body.appendChild(ta); ta.focus();
    try { const ok = document.execCommand("paste"); if (ok && ta.value) { setUrl(ta.value); return; } }
    catch {} finally { document.body.removeChild(ta); }
    inputRef.current?.focus();
  };

  const reset = () => { setUrl(""); setStep("idle"); setInfo(null); setError(""); setIsDemo(false); };

  const isPhoto = info?.is_photo && (info.images?.length ?? 0) > 0;
  const formats = highlightFormat
    ? [...FORMAT_CONFIGS].sort((a) => (a.format === highlightFormat ? -1 : 1))
    : FORMAT_CONFIGS;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%" }}>

      {/* ── Input row ── */}
      <div className="input-action-row">
        <div className="input-box" style={{ flex:1 }}>
          <input
            ref={inputRef} type="text" inputMode="url"
            value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleFetch()}
            placeholder="Paste TikTok link here..."
            disabled={step === "loading-info"}
            style={{
              flex:1, minWidth:0, background:"transparent",
              padding:"15px 8px 15px 16px", fontSize:14.5, outline:"none",
              color:"var(--text-primary)", fontWeight:400, fontFamily:"inherit",
            }}
          />
          {step === "loading-info" ? (
            <div style={{ margin:"0 14px", display:"flex", alignItems:"center", gap:7, color:"#7c3aed", fontSize:12, fontWeight:600, flexShrink:0 }}>
              <Loader2 size={17} className="animate-spin" style={{ flexShrink:0 }} />
              <span style={{ whiteSpace:"nowrap" }}>Fetching…</span>
            </div>
          ) : url ? (
            <button onClick={reset} className="btn-ghost" style={{ margin:"0 10px", padding:"7px 14px", fontSize:13 }}>
              <X size={14} /> Clear
            </button>
          ) : (
            <button onClick={handlePaste} className="btn-ghost" style={{ margin:"0 10px", padding:"7px 14px", fontSize:13 }}>
              <Clipboard size={14} /> Paste
            </button>
          )}
        </div>
        <button onClick={handleFetch} disabled={!url.trim() || step === "loading-info"} className="btn-primary dl-btn">
          {step === "loading-info"
            ? <><Loader2 size={18} className="animate-spin" /> Fetching…</>
            : <><Download size={18} /> Download Now</>}
        </button>
      </div>

      {/* Demo button */}
      {step === "idle" && (
        <button onClick={handleDemo} className="demo-btn">
          <FlaskConical size={13} /> Preview demo — see result card
        </button>
      )}

      {/* Error */}
      {step === "error" && (
        <div className="error-box">
          <AlertCircle size={16} style={{ flexShrink:0, marginTop:2 }} /> {error}
        </div>
      )}

      {/* ── Result card ── */}
      {step === "info-ready" && info && (() => {
        const tags = (info.title || "").match(/#[\w\u0900-\u097F]+/g) ?? [];
        const cleanTitle = (info.title || "").replace(/#[\w\u0900-\u097F]+/g, "").trim();

        return (
          <div className="result-card" style={{
            animation:"fadeUp 0.35s ease both",
            overflow:"hidden",
            borderRadius:16,
          }}>

            {/* Demo banner */}
            {isDemo && (
              <div style={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                padding:"8px 0", fontSize:11, fontWeight:700, letterSpacing:"0.08em",
                textTransform:"uppercase", color:"var(--cyan)",
                background:"var(--result-header-bg)", borderBottom:"1px solid var(--result-header-border)",
              }}>
                <FlaskConical size={12} /> Demo preview
              </div>
            )}

            {/* ── Thumbnail ── */}
            {info.thumbnail && (
              <div style={{ position:"relative", overflow:"hidden" }}>
                <img
                  src={info.thumbnail} alt=""
                  style={{ width:"100%", height:210, objectFit:"cover", display:"block" }}
                />
                {/* subtle gradient overlay at bottom */}
                <div style={{
                  position:"absolute", bottom:0, left:0, right:0, height:60,
                  background:"linear-gradient(to top, rgba(0,0,0,0.45), transparent)",
                }} />
              </div>
            )}

            {/* ── Author row ── */}
            <div style={{ padding:"16px 16px 10px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                {/* Avatar */}
                <div style={{
                  width:46, height:46, borderRadius:"50%", flexShrink:0,
                  background:"linear-gradient(135deg,#7c3aed,#4f46e5)",
                  border:"2.5px solid rgba(124,58,237,0.4)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:800, fontSize:18, color:"#fff",
                  boxShadow:"0 2px 10px rgba(124,58,237,0.3)",
                }}>
                  {(info.author || "T").replace("@","").charAt(0).toUpperCase()}
                </div>

                {/* Name + verified */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ fontWeight:700, fontSize:14.5, color:"var(--cyan)" }}>
                      {info.author}
                    </span>
                    {/* Verified tick */}
                    <svg width="15" height="15" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="11" fill="#1d9bf0"/>
                      <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2.4"
                        strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </div>

                  {/* Title */}
                  {cleanTitle && (
                    <p style={{
                      margin:"4px 0 0", fontSize:13, fontWeight:600,
                      color:"var(--text-primary)", lineHeight:1.45,
                      display:"-webkit-box", WebkitLineClamp:3,
                      WebkitBoxOrient:"vertical", overflow:"hidden",
                    }}>
                      {cleanTitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:10 }}>
                  {tags.slice(0, 6).map(tag => (
                    <span key={tag} style={{
                      fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:999,
                      background:"var(--tag-bg)", border:"1px solid var(--tag-border)",
                      color:"var(--cyan)",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── Download rows ── */}
            {isPhoto ? (
              <div style={{ padding:"0 12px 12px" }}>
                <p style={{ textAlign:"center", fontSize:11, fontWeight:700, letterSpacing:"0.06em", color:"var(--text-muted)", marginBottom:10 }}>
                  📸 Photo Post — {info.images!.length} images
                </p>
                {info.images!.length > 1 && (
                  <button
                    onClick={() => info.images!.forEach((u,i) => setTimeout(() => handlePhotoDownload(u,i), i*400))}
                    disabled={photoDownloading !== null || isDemo}
                    className="gradient-btn"
                    style={{ width:"100%", padding:12, borderRadius:10, marginBottom:10, fontSize:14 }}>
                    <Download size={15} /> Save All {info.images!.length} Photos
                  </button>
                )}
                <div style={{ display:"grid", gridTemplateColumns: info.images!.length === 1 ? "1fr" : "1fr 1fr", gap:8 }}>
                  {info.images!.map((imgUrl, i) => (
                    <div key={i} style={{ borderRadius:10, overflow:"hidden", border:"1px solid var(--photo-btn-border)" }}>
                      <div style={{ position:"relative", aspectRatio:"3/4", overflow:"hidden" }}>
                        <img src={imgUrl} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} loading="lazy" />
                        <div style={{ position:"absolute", top:6, right:6, background:"rgba(0,0,0,0.65)", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:6 }}>
                          {i+1}/{info.images!.length}
                        </div>
                      </div>
                      <button
                        onClick={() => handlePhotoDownload(imgUrl, i)}
                        disabled={photoDownloading !== null || isDemo}
                        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"9px 0", fontSize:12, fontWeight:600, color:"var(--cyan)", background:"transparent", border:"none", borderTop:"1px solid var(--photo-btn-border)", cursor:"pointer" }}>
                        {photoDownloading === i ? <><Loader2 size={12} className="animate-spin"/> Saving…</> : <><Download size={12}/> Save</>}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding:"4px 12px 14px", display:"flex", flexDirection:"column", gap:8 }}>
                {formats.map(cfg => {
                  const isActive = activeDownload === cfg.format;
                  const disabled = !!activeDownload || isDemo;
                  return (
                    <div key={cfg.format} style={{
                      display:"flex", alignItems:"stretch",
                      borderRadius:13, overflow:"hidden",
                      background:cfg.rowBg,
                      border:`1.5px solid ${cfg.rowBorder}`,
                    }}>
                      {/* Left colored icon block */}
                      <div style={{
                        width:56, minWidth:56,
                        background:cfg.leftBg,
                        display:"flex", alignItems:"center",
                        justifyContent:"center",
                      }}>
                        {cfg.leftContent}
                      </div>

                      {/* Middle: text + quality badges */}
                      <div style={{ flex:1, padding:"10px 12px", minWidth:0 }}>
                        <p style={{
                          margin:0, fontSize:13.5, fontWeight:700,
                          color:"var(--text-primary)", lineHeight:1.3,
                        }}>
                          {cfg.label}
                        </p>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:6 }}>
                          {cfg.badges.map(b => (
                            <span key={b.text} style={{
                              fontSize:10.5, fontWeight:700,
                              padding:"2px 8px", borderRadius:999,
                              background:b.bg, color:b.color,
                              display:"inline-flex", alignItems:"center", gap:3,
                            }}>
                              <span style={{ fontSize:8 }}>{b.emoji}</span> {b.text}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Download button */}
                      <div style={{ display:"flex", alignItems:"center", padding:"0 10px 0 0" }}>
                        <button
                          onClick={() => handleDownload(cfg.format)}
                          disabled={disabled}
                          style={{
                            padding:"10px 16px", borderRadius:10, border:"none",
                            background: disabled && !isActive ? "rgba(255,255,255,0.1)" : cfg.btnBg,
                            color:"#fff", fontSize:13, fontWeight:700,
                            cursor: disabled ? "default" : "pointer",
                            display:"flex", alignItems:"center", gap:6,
                            opacity: disabled && !isActive ? 0.5 : 1,
                            transition:"all 0.2s",
                            whiteSpace:"nowrap",
                            boxShadow: disabled ? "none" : "0 2px 8px rgba(0,0,0,0.2)",
                          }}
                        >
                          {isActive
                            ? <><Loader2 size={13} className="animate-spin"/> Saving…</>
                            : <><Download size={13}/> Download</>}
                        </button>
                      </div>
                    </div>
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
