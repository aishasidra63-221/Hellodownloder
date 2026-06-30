import { Shield, ChevronRight } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

const SECTIONS = [
  {
    title: "What We Collect",
    content: "Luldown collects no personal information. We do not require registration, login, or email. The only data processed is the TikTok URL you submit — it is used solely to resolve the video download link and is never stored permanently.",
  },
  {
    title: "Cookies & Local Storage",
    content: "We use browser localStorage only to store your download history locally on your device. This data never leaves your browser and can be cleared anytime from Settings. We do not use tracking cookies or advertising cookies.",
  },
  {
    title: "Google reCAPTCHA",
    content: "We use Google reCAPTCHA v3 (invisible) to protect against automated bots. reCAPTCHA may collect device and behavioral data as per Google's Privacy Policy. No score or data is stored by Luldown.",
  },
  {
    title: "Third-Party CDN",
    content: "Videos and media are served directly from TikTok's CDN to your browser. Luldown does not host, store, or cache any media files. We act only as a URL resolver — your browser downloads content directly from TikTok's servers.",
  },
  {
    title: "Analytics",
    content: "We do not use Google Analytics, Facebook Pixel, or any third-party analytics platform. No behavioral data is sold or shared with advertisers.",
  },
  {
    title: "Contact",
    content: "For privacy concerns, contact us at legal@luldown.com",
  },
];

export default function PrivacyPage() {
  useSEO({
    title: "Privacy Policy — Luldown",
    description: "Luldown privacy policy — what we collect, how we store data, and your rights.",
  });

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh" }}>

      {/* Hero strip */}
      <div style={{
        background: "linear-gradient(160deg, #0d0b1f 0%, #13103a 60%, #0f0d28 100%)",
        padding: "48px 24px 52px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: 500, height: 300,
          background: "radial-gradient(ellipse, rgba(120,40,220,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          width: 52, height: 52, borderRadius: 16, margin: "0 auto 16px",
          background: "rgba(79,110,247,0.15)",
          border: "1px solid rgba(79,110,247,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <Shield size={24} color="#4f6ef7" />
        </div>
        <h1 style={{
          fontSize: "clamp(1.6rem, 5vw, 2.2rem)", fontWeight: 800,
          color: "#ffffff", marginBottom: 10, letterSpacing: "-0.02em",
          position: "relative",
        }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", position: "relative" }}>
          Last updated: June 2025 · Effective immediately
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "36px 20px 60px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {SECTIONS.map((s, i) => (
            <div key={s.title} style={{
              background: "#ffffff",
              borderRadius: i === 0 ? "16px 16px 0 0" : i === SECTIONS.length - 1 ? "0 0 16px 16px" : 0,
              borderTop: i === 0 ? "1px solid rgba(0,0,0,0.09)" : "none",
              borderLeft: "1px solid rgba(0,0,0,0.09)",
              borderRight: "1px solid rgba(0,0,0,0.09)",
              borderBottom: "1px solid rgba(0,0,0,0.09)",
              padding: "20px 22px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <ChevronRight size={16} color="#4f6ef7" style={{ marginTop: 3, flexShrink: 0 }} />
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 6 }}>{s.title}</h2>
                  <p style={{ fontSize: 13.5, color: "#4b5563", lineHeight: 1.7 }}>{s.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
