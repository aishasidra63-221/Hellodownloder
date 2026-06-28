import { useSEO } from "@/hooks/use-seo";
import DownloaderBox from "@/components/DownloaderBox";
import { ChevronRight, ClipboardCopy, ClipboardPaste, Download } from "lucide-react";

const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "Luldown",
      "url": "https://luldown.com",
      "description": "Free TikTok video downloader without watermark.",
    },
  ],
};

const STEPS = [
  { num: "1", label: "Copy link from TikTok",   Icon: ClipboardCopy,  },
  { num: "2", label: "Paste the link above",     Icon: ClipboardPaste, },
  { num: "3", label: "Click download and enjoy", Icon: Download,       },
];

const SEO_ITEMS = [
  { title: "1080p Without Watermark", body: "Full HD quality, no TikTok branding or logo." },
  { title: "720p Download",            body: "Smaller file, same clean output for mobile." },
  { title: "MP3 Audio 192kbps",        body: "Extract TikTok audio as high-quality MP3." },
  { title: "All Devices",              body: "iPhone, Android, PC — no app needed." },
];

export default function HomePage() {
  useSEO({
    title: "TikTok Video Downloader No Watermark",
    description: "Download TikTok videos without watermark in HD quality. Free, fast, unlimited downloads. No login required. Works on All Devices.",
    jsonLd: HOME_JSONLD,
  });

  return (
    <div className="relative">
      <div className="hero-mesh" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-20">

        {/* ── Hero ── */}
        <div className="text-center mb-8">
          <h1
            className="hero-title font-black leading-tight mb-4"
            style={{
              fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
              letterSpacing: "-0.02em",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Download TikTok<br />
            <span style={{ color: "#dc2020" }}>Without Watermark</span>
          </h1>
          <p className="hero-subtitle text-sm sm:text-base font-medium max-w-xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Paste any TikTok video link and download HD video, watermarked version, or MP3 audio — instantly, for free.
          </p>
        </div>

        {/* ── Downloader ── */}
        <DownloaderBox />

        {/* ── How to Download section ── */}
        <div className="mt-14">
          <div className="text-center mb-8">
            <h2 className="how-it-works-title font-black text-2xl sm:text-3xl mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              How to Download TikTok Videos
            </h2>
            <p className="step-label text-sm">3 steps — takes less than 5 seconds</p>
          </div>

          {/* Steps */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6 sm:gap-4">
            {STEPS.map(({ num, label, Icon }, i) => (
              <div key={num} className="flex flex-col items-center text-center flex-1 max-w-[180px]">
                <div className="relative mb-3">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(220,32,32,0.12)", border: "2px solid rgba(220,32,32,0.35)" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: "#dc2020" }} strokeWidth={1.8} />
                  </div>
                  <div
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black text-white flex items-center justify-center"
                    style={{ background: "#dc2020" }}
                  >
                    {num}
                  </div>
                </div>
                <p className="text-sm font-medium step-label leading-snug">{label}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute mt-7 text-xl step-arrow opacity-20" style={{ transform: "translateX(120px)" }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── SEO section ── */}
        <div className="mt-14 pt-8">
          <div className="neon-divider mb-8" />
          <h2 className="text-lg font-black mb-2 seo-heading">Best TikTok Downloader — No Watermark</h2>
          <p className="seo-text leading-relaxed mb-6 text-sm">
            Luldown lets you download TikTok videos in 1080p or 720p without watermark, or save as 192kbps MP3.
            Completely free, no account needed, works on any device.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {SEO_ITEMS.map(({ title, body }) => (
              <div key={title}>
                <h3 className="font-semibold text-xs mb-0.5 flex items-center gap-1.5 seo-subheading">
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#dc2020" }} />
                  {title}
                </h3>
                <p className="pl-5 text-xs leading-relaxed seo-text">{body}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
