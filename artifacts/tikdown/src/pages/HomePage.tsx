import { useSEO } from "@/hooks/use-seo";
import DownloaderBox from "@/components/DownloaderBox";
import { Copy, Search, Download, CheckCircle2, ChevronRight, Zap, Lock, Smartphone } from "lucide-react";

const FEATURES = [
  {
    Icon: CheckCircle2,
    label: "No Watermark",
    desc: "Get the original clean video — no TikTok logo, no username overlay.",
    stat: "100%",
    statLabel: "Clean",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    statColor: "text-emerald-600 dark:text-emerald-400",
    accent: "border-l-emerald-400",
  },
  {
    Icon: Zap,
    label: "Lightning Fast",
    desc: "Video info loads in under 2 seconds. Download starts immediately.",
    stat: "<2s",
    statLabel: "Response",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    statColor: "text-amber-600 dark:text-amber-400",
    accent: "border-l-amber-400",
  },
  {
    Icon: Lock,
    label: "100% Private",
    desc: "Nothing is stored on any server. Your downloads stay on your device.",
    stat: "0",
    statLabel: "Data Stored",
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    statColor: "text-violet-600 dark:text-violet-400",
    accent: "border-l-violet-400",
  },
  {
    Icon: Smartphone,
    label: "All Devices",
    desc: "Works on iPhone, Android, Windows, Mac — any browser, no app needed.",
    stat: "Any",
    statLabel: "Device",
    iconBg: "bg-sky-50 dark:bg-sky-950/40",
    iconColor: "text-sky-600 dark:text-sky-400",
    statColor: "text-sky-600 dark:text-sky-400",
    accent: "border-l-sky-400",
  },
];

const STEPS = [
  { Icon: Copy,     num: "01", title: "Copy Link",    desc: "Open TikTok, tap Share → Copy Link" },
  { Icon: Search,   num: "02", title: "Paste & Fetch", desc: "Paste the URL and click Fetch"     },
  { Icon: Download, num: "03", title: "Download",     desc: "Choose 1080p, 720p or MP3"          },
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
        { "@type": "Question", "name": "What formats does Luldown support?", "acceptedAnswer": { "@type": "Answer", "text": "MP4 1080p HD, MP4 720p, MP3 192kbps audio, and TikTok photo slideshows." } },
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

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="hero-orb-purple absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-60" />
        <div className="hero-orb-cyan absolute top-[20%] -right-40 w-[500px] h-[500px] rounded-full opacity-50" />
        <div className="hero-orb-purple absolute bottom-[20%] left-[30%] w-[400px] h-[400px] rounded-full opacity-30" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-14">

        {/* Hero */}
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 hero-badge text-xs font-semibold px-4 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5" />
            Fast · Free · No Login Required
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.08]">
              <span className="gradient-text">Luldown</span>
            </h1>
            <p className="text-2xl sm:text-3xl font-bold text-foreground/80 tracking-tight">
              Download TikTok Videos
            </p>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              No watermark. No login. No limits. Save any TikTok video or music instantly — forever free.
            </p>
          </div>
        </header>

        {/* Downloader */}
        <DownloaderBox />

        {/* How it works */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground text-sm mt-1">Three steps. Done in seconds.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {STEPS.map(({ Icon, num, title, desc }) => (
              <div key={title} className="glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-4 card-hover">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-btn text-white text-xs font-bold flex items-center justify-center shadow-lg">
                    {parseInt(num)}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-foreground mb-1">{title}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards — professional stat style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(({ Icon, label, desc, stat, statLabel, iconBg, iconColor, statColor, accent }) => (
            <div key={label} className={`stat-card rounded-2xl p-5 flex gap-4 border-l-4 ${accent}`}>
              {/* Icon */}
              <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-sm text-foreground">{label}</span>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-base font-black leading-none ${statColor}`}>{stat}</div>
                    <div className="text-[10px] text-muted-foreground leading-none mt-0.5">{statLabel}</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SEO Content */}
        <article className="space-y-6 text-sm text-muted-foreground border-t border-border/50 pt-10">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">Luldown — Best TikTok Downloader Without Watermark</h2>
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
                <h3 className="font-semibold text-sm text-foreground mb-1.5 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
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
