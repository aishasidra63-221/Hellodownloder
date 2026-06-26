import { useSEO } from "@/hooks/use-seo";
import DownloaderBox from "@/components/DownloaderBox";
import { Copy, Search, Download, CheckCircle2, ChevronRight, Zap, Lock, Smartphone } from "lucide-react";

const FEATURES = [
  { Icon: CheckCircle2, label: "No Watermark",   desc: "Clean videos",      color: "text-blue-400"   },
  { Icon: Zap,          label: "Lightning Fast",  desc: "Instant download",  color: "text-yellow-400" },
  { Icon: Lock,         label: "100% Private",    desc: "No data stored",    color: "text-green-400"  },
  { Icon: Smartphone,   label: "Mobile Ready",    desc: "Works everywhere",  color: "text-purple-400" },
];

const STEPS = [
  { Icon: Copy,     title: "Copy Link",    desc: "Open TikTok, tap Share → Copy Link" },
  { Icon: Search,   title: "Paste & Fetch", desc: "Paste the link and click Fetch"    },
  { Icon: Download, title: "Download",     desc: "Pick 720p, 1080p or MP3"            },
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
  ],
};

export default function HomePage() {
  useSEO({
    title: "Luldown — Download TikTok Videos Without Watermark Free",
    description: "Download TikTok videos without watermark in 1080p HD, 720p, or MP3 audio. Free, fast, no login. Works on iPhone, Android, and PC.",
    jsonLd: HOME_JSONLD,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 bg-secondary border border-border text-muted-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
          <Zap className="w-3.5 h-3.5 text-primary" />
          FREE • FAST • NO LOGIN REQUIRED
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
          Download TikTok Videos<br />
          <span className="text-primary">Without Watermark</span>
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
          The fastest, most reliable TikTok video downloader. No watermarks, no registration, completely free.
        </p>
      </header>

      {/* ── Downloader ───────────────────────────────────────────── */}
      <DownloaderBox />

      {/* ── How It Works — connected steps ───────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">How It Works</h2>
        <p className="text-muted-foreground text-sm mb-4">Three simple steps to get your favorite content.</p>

        <div className="relative">
          {/* vertical blue connector line */}
          <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-primary/40 z-0" />

          <div className="space-y-0">
            {STEPS.map(({ Icon, title, desc }, i) => (
              <div key={title} className="relative flex items-start gap-4 py-3 z-10">
                {/* step icon with dark circle bg */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center relative">
                    <Icon className="w-4 h-4 text-primary" />
                    {/* step number badge */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center leading-none">
                      {i + 1}
                    </div>
                  </div>
                </div>
                <div className="pt-1.5">
                  <div className="font-semibold text-sm text-foreground">{title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Feature chips ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map(({ Icon, label, desc, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <div className="font-semibold text-sm text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground">{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── SEO text ─────────────────────────────────────────────── */}
      <article className="space-y-5 text-sm text-muted-foreground border-t border-border pt-8">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            Why Choose <span className="text-primary">Luldown?</span>
          </h2>
          <p className="leading-relaxed">
            Luldown is the fastest and most reliable TikTok video downloader in 2026. Paste any TikTok URL
            and instantly download in 1080p or 720p MP4 without watermark, or extract 192kbps MP3 audio —
            completely free, no account or app installation needed.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Download 1080p Without Watermark", body: "Save TikTok videos in full HD 1080p quality with no watermark or logo overlay. Perfect for repurposing content or saving memories." },
            { title: "Download 720p Without Watermark",  body: "Get standard HD 720p quality videos, smaller file size with clean output — great for mobile storage." },
            { title: "Extract MP3 Audio",                body: "Download TikTok sounds and music as high-quality 192kbps MP3 files — great for ringtones, podcasts, and music discovery." },
            { title: "Works on All Devices",             body: "Fully responsive — use Luldown on iPhone, Android, tablet, or desktop. No app download required." },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="font-semibold text-sm text-foreground mb-1 flex items-center gap-1.5">
                <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                {title}
              </h3>
              <p className="leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
