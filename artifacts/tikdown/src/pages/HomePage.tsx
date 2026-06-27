import { useSEO } from "@/hooks/use-seo";
import DownloaderBox from "@/components/DownloaderBox";
import { Copy, Download, CheckCircle2, ChevronRight, Zap, Lock, Smartphone, Music, Image, Play } from "lucide-react";

const FEATURES = [
  {
    Icon: CheckCircle2,
    label: "No Watermark",
    desc: "Original clean video — no TikTok logo, no username overlay.",
    stat: "100%",
    statLabel: "Clean",
    iconColor: "#a5f3fc",
    statColor: "#a5f3fc",
  },
  {
    Icon: Zap,
    label: "Lightning Fast",
    desc: "Video info in under 2 seconds. Download starts instantly.",
    stat: "<2s",
    statLabel: "Response",
    iconColor: "#fde68a",
    statColor: "#fde68a",
  },
  {
    Icon: Lock,
    label: "100% Private",
    desc: "Nothing stored on any server. Your downloads stay yours.",
    stat: "0",
    statLabel: "Data Stored",
    iconColor: "#c4b5fd",
    statColor: "#c4b5fd",
  },
  {
    Icon: Smartphone,
    label: "All Devices",
    desc: "iPhone, Android, Windows, Mac — any browser, no app needed.",
    stat: "Any",
    statLabel: "Device",
    iconColor: "#93c5fd",
    statColor: "#93c5fd",
  },
];

const STEPS = [
  { Icon: Copy,     num: "1", title: "Copy Link",     desc: "Open TikTok → tap Share → Copy Link",  color: "#c4b5fd" },
  { Icon: Download, num: "2", title: "Paste & Click", desc: "Paste the URL here and hit Download",  color: "#93c5fd" },
  { Icon: Play,     num: "3", title: "Save & Enjoy",  desc: "Pick your format — done in seconds!",  color: "#a5f3fc" },
];

const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "Luldown",
      "url": "https://luldown.com",
      "description": "Free TikTok video downloader without watermark. Download TikTok videos in 1080p, 720p, MP3, and photos.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://luldown.com/?url={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "name": "Luldown TikTok Downloader",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "description": "Download TikTok videos without watermark in HD quality. Free, fast, no login required.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Is Luldown free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, completely free. No subscription, no hidden fees." } },
        { "@type": "Question", "name": "Does Luldown remove the watermark?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Luldown downloads the original clean video without any TikTok watermark or logo." } },
        { "@type": "Question", "name": "What formats does Luldown support?", "acceptedAnswer": { "@type": "Answer", "text": "MP4 1080p HD, MP4 720p, MP3 192kbps audio, and thumbnail JPG." } },
      ],
    },
  ],
};

export default function HomePage() {
  useSEO({
    title: "Luldown — Download TikTok Videos Without Watermark Free",
    description: "Download TikTok videos without watermark in 1080p HD, 720p, or MP3 audio. Free, fast, no login. Works on iPhone, Android, and PC.",
    jsonLd: HOME_JSONLD,
  });

  return (
    <div className="relative">

      {/* Fixed gradient background + orbs */}
      <div className="hero-mesh">
        <div className="hero-mesh-purple" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-16">

        {/* ── Hero ── */}
        <header className="text-center space-y-7">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 hero-badge text-xs font-bold px-5 py-2 rounded-full">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Fast · Free · No Login Required
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-6xl sm:text-7xl font-black tracking-tighter leading-none text-white drop-shadow-lg">
              Lul<span className="gradient-text">down</span>
            </h1>
            <p className="text-2xl sm:text-3xl font-extrabold text-white/90 tracking-tight">
              TikTok Downloader
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/65 max-w-md mx-auto leading-relaxed">
            No watermark. No login. No limits.<br />
            Save any TikTok video or music —{" "}
            <span className="text-white font-semibold">forever free.</span>
          </p>

        </header>

        {/* ── Downloader ── */}
        <div className="downloader-wrap rounded-3xl p-6 sm:p-8">

          {/* Top label */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">TikTok Video Downloader</span>
          </div>

          <DownloaderBox />

          {/* Format support row */}
          <div className="flex items-center justify-center gap-1.5 mt-5 flex-wrap">
            <span className="text-[10px] text-white/30 mr-1">Supports:</span>
            {[
              { label: "MP4 1080p", color: "rgba(196,181,253,0.9)" },
              { label: "MP4 720p",  color: "rgba(147,197,253,0.9)" },
              { label: "MP3",       color: "rgba(165,243,252,0.9)" },
              { label: "Thumbnail", color: "rgba(253,230,138,0.9)" },
            ].map(({ label, color }) => (
              <span key={label}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── How it works ── */}
        <div className="space-y-7">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white tracking-tight">How It Works</h2>
            <p className="text-white/40 text-sm mt-1">Three steps. Done in seconds.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {STEPS.map(({ Icon, num, title, desc, color }) => (
              <div key={title} className="step-card rounded-2xl p-6 flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)" }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black text-white flex items-center justify-center shadow-lg"
                    style={{ background: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.4)" }}>
                    {num}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-white mb-1">{title}</div>
                  <div className="text-xs text-white/45">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Features ── */}
        <div className="space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white tracking-tight">Why Luldown?</h2>
            <p className="text-white/40 text-sm mt-1">Built for speed, privacy and quality.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ Icon, label, desc, stat, statLabel, iconColor, statColor }) => (
              <div key={label} className="stat-card rounded-2xl p-5 flex gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
                  <Icon className="w-5 h-5" style={{ color: iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-sm text-white">{label}</span>
                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-black leading-none" style={{ color: statColor }}>{stat}</div>
                      <div className="text-[9px] text-white/35 leading-none mt-0.5 uppercase tracking-wide">{statLabel}</div>
                    </div>
                  </div>
                  <p className="text-xs text-white/45 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEO Content ── */}
        <article className="space-y-6 text-sm text-white/35 pt-4">
          <div className="neon-divider" />
          <div className="pt-6">
            <h2 className="text-xl font-black text-white mb-3">Best TikTok Downloader — No Watermark</h2>
            <p className="leading-relaxed">
              Luldown is the fastest free TikTok video downloader in 2026. Paste any TikTok URL and instantly
              download in 1080p or 720p MP4 without watermark, or extract 192kbps MP3 audio — completely free,
              no account needed.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: "Download 1080p Without Watermark", body: "Save TikTok videos in full HD 1080p with no watermark or logo. Perfect for repurposing or saving memories." },
              { title: "Download 720p Without Watermark",  body: "Standard HD 720p — smaller file size, clean output, great for mobile storage." },
              { title: "Extract MP3 Audio 192kbps",        body: "Download TikTok sounds as high-quality 192kbps MP3 — great for ringtones, music discovery, podcasts." },
              { title: "Works on All Devices",             body: "Fully responsive — use on iPhone, Android, tablet, or desktop. No app install ever needed." },
            ].map(({ title, body }) => (
              <div key={title}>
                <h3 className="font-semibold text-sm text-white/60 mb-1.5 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                  {title}
                </h3>
                <p className="leading-relaxed pl-6">{body}</p>
              </div>
            ))}
          </div>
        </article>

      </div>
    </div>
  );
}
