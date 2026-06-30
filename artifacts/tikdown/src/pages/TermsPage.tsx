import { FileText, ChevronRight } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using Luldown (luldown.com), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use this service.",
  },
  {
    title: "Permitted Use",
    content: "Luldown is provided for personal, non-commercial use only. You may download content solely for private viewing and personal archiving. Automated scraping, bulk downloading, or using the service via bots is strictly prohibited. You must not use Luldown to infringe upon the intellectual property rights of others.",
  },
  {
    title: "Content & Copyright",
    content: "All videos, audio, and images downloaded through Luldown remain the property of their respective creators and rights holders. Luldown does not host any media — it only resolves publicly available CDN URLs provided by TikTok's platform. You are solely responsible for how you use any downloaded content. Redistribution, resale, or public republishing of downloaded content without the creator's permission is prohibited.",
  },
  {
    title: "No Affiliation with TikTok",
    content: "Luldown is an independent service and is not affiliated with, endorsed by, or connected to TikTok or ByteDance Ltd. in any way. TikTok™ is a trademark of ByteDance Ltd.",
  },
  {
    title: "Limitation of Liability",
    content: "Luldown is provided \"as is\" without warranties of any kind. We are not responsible for any damages arising from the use or inability to use this service, including but not limited to data loss, service interruptions, or content unavailability. We reserve the right to modify or discontinue the service at any time without notice.",
  },
  {
    title: "Changes to Terms",
    content: "We reserve the right to update these Terms at any time. Continued use of Luldown after changes are posted constitutes your acceptance of the revised Terms.",
  },
  {
    title: "Legal Contact",
    content: "For legal inquiries: legal@luldown.com",
  },
];

export default function TermsPage() {
  useSEO({
    title: "Terms & Conditions — Luldown",
    description: "Terms and conditions for using Luldown TikTok video downloader.",
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
          <FileText size={24} color="#4f6ef7" />
        </div>
        <h1 style={{
          fontSize: "clamp(1.6rem, 5vw, 2.2rem)", fontWeight: 800,
          color: "#ffffff", marginBottom: 10, letterSpacing: "-0.02em",
          position: "relative",
        }}>
          Terms &amp; Conditions
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", position: "relative" }}>
          Last updated: June 2025 · Please read carefully before use
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
