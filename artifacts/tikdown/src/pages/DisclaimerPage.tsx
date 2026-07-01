import { AlertTriangle, ChevronRight } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

const SECTIONS = [
  {
    title: "No Affiliation with TikTok",
    content: "Luldown is an independent, third-party service. We are not associated with, sponsored by, funded by, or endorsed by TikTok™ or ByteDance Ltd. in any way. All trademarks, service marks, logos, and company names referenced on this website are the property of their respective owners and are used solely for descriptive and identification purposes.",
  },
  {
    title: "Personal Use Only",
    content: "This service is intended strictly for personal, non-commercial use. Downloading TikTok content for commercial redistribution, public display, or any use that violates the intellectual property rights of the original creator is prohibited. Users are solely responsible for ensuring their use of downloaded content complies with all applicable copyright laws and TikTok's Terms of Service.",
  },
  {
    title: "Copyright & Content Ownership",
    content: "All videos, images, and audio files accessible through Luldown are protected by copyright and remain the property of their original creators and rights holders. Luldown does not store, reproduce, modify, or redistribute any media. Our service only provides a technical bridge to publicly accessible CDN links that are already hosted on TikTok's own infrastructure.",
  },
  {
    title: "No Server Storage",
    content: "Luldown does not download or store any video, audio, or image files on our servers. All media is delivered directly from TikTok's content delivery network (CDN) to your browser. We do not create copies of any content — we only resolve the URL so your browser can fetch it directly from the source.",
  },
  {
    title: "Service Availability & Accuracy",
    content: "We do not guarantee that Luldown will be available at all times, free of errors, or that all videos can be downloaded. The service depends on TikTok's public CDN infrastructure, which may change, restrict access, or become unavailable without notice. We accept no liability for failed downloads, degraded quality, or service interruptions.",
  },
  {
    title: "User Responsibility",
    content: "By using Luldown, you acknowledge and accept full responsibility for your actions and any content you download. You agree not to download, share, or use content in a way that infringes upon the rights of creators or violates any law. Always respect the original creator and give credit where it is due.",
  },
  {
    title: "Limitation of Liability",
    content: "Luldown and its operators shall not be held liable for any damages, losses, or legal consequences arising from the use or misuse of this service. This service is provided on an \"as is\" basis without warranties of any kind, either express or implied. Use of this service is at your own risk.",
  },
];

export default function DisclaimerPage() {
  useSEO({
    title: "Disclaimer — Luldown",
    description: "Luldown disclaimer — no affiliation with TikTok, personal use only, copyright notice.",
  });

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh" }}>

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
          background: "rgba(245,158,11,0.12)",
          border: "1px solid rgba(245,158,11,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <AlertTriangle size={24} color="#f59e0b" />
        </div>
        <h1 style={{
          fontSize: "clamp(1.6rem, 5vw, 2.2rem)", fontWeight: 800,
          color: "#ffffff", marginBottom: 10, letterSpacing: "-0.02em",
          position: "relative",
        }}>
          Disclaimer
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", position: "relative" }}>
          Last updated: July 2025 · Please read before using this service
        </p>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 20px 60px" }}>
        <div style={{
          background: "rgba(245,158,11,0.07)",
          border: "1px solid rgba(245,158,11,0.25)",
          borderRadius: 12,
          padding: "14px 18px",
          marginBottom: 24,
          fontSize: 13.5,
          color: "#92400e",
          lineHeight: 1.65,
        }}>
          <strong>Important:</strong> Luldown is an independent tool not affiliated with TikTok or ByteDance. Please use this service responsibly and respect the rights of content creators.
        </div>

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
                <ChevronRight size={16} color="#f59e0b" style={{ marginTop: 3, flexShrink: 0 }} />
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
