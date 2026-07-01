import { FileText, ChevronRight } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using Luldown (luldown.com), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must not use this service. These terms apply to all visitors and users of the service.",
  },
  {
    title: "Description of Service",
    content: "Luldown is a free online tool that allows users to download publicly available TikTok videos, audio, and photos for personal use. The service resolves publicly accessible CDN URLs and passes them directly to your browser. Luldown does not host, store, or distribute any media content.",
  },
  {
    title: "Permitted Use",
    content: "You may use Luldown for personal, non-commercial purposes only — such as saving a video for offline viewing or keeping a backup of your own content. You must not use this service for automated scraping, bulk downloading, commercial redistribution, or any purpose that violates TikTok's Terms of Service or applicable copyright law.",
  },
  {
    title: "Copyright & Intellectual Property",
    content: "All videos, audio, and images downloaded through Luldown are the intellectual property of their respective creators and rights holders. Luldown does not claim ownership over any downloaded content. You are solely responsible for ensuring that your use of any downloaded content complies with copyright law. Unauthorized redistribution, resale, or public republishing of content without the creator's permission is strictly prohibited.",
  },
  {
    title: "No Affiliation with TikTok",
    content: "Luldown is an independent service and is not affiliated with, endorsed by, sponsored by, or connected to TikTok, ByteDance Ltd., or any of their subsidiaries in any way. TikTok™ is a registered trademark of ByteDance Ltd. Use of TikTok's name on this website is solely for descriptive purposes.",
  },
  {
    title: "No Guarantee of Service",
    content: "Luldown is provided on an \"as is\" and \"as available\" basis. We do not guarantee that the service will be available at all times, uninterrupted, or error-free. Video availability depends on TikTok's CDN infrastructure, which may change without notice. We reserve the right to modify, suspend, or discontinue the service at any time without prior notice.",
  },
  {
    title: "Limitation of Liability",
    content: "To the maximum extent permitted by applicable law, Luldown and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of or inability to use this service. This includes but is not limited to loss of data, service interruptions, or content unavailability.",
  },
  {
    title: "User Responsibility",
    content: "You are solely responsible for your use of this service and any content you download. By using Luldown, you represent that you have the right to download the content in question and that you will comply with all applicable local, national, and international laws and regulations.",
  },
  {
    title: "Changes to Terms",
    content: "We reserve the right to update these Terms and Conditions at any time. Changes will be posted on this page with an updated effective date. Your continued use of Luldown after any changes constitutes your acceptance of the new terms.",
  },
];

export default function TermsPage() {
  useSEO({
    title: "Terms & Conditions — Luldown",
    description: "Terms and conditions for using Luldown TikTok video downloader.",
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
          Last updated: July 2025 · Please read carefully before use
        </p>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 20px 60px" }}>
        <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.75, marginBottom: 28, padding: "16px 20px", background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)" }}>
          Please read these Terms and Conditions carefully before using Luldown. By using this service, you confirm that you are at least 13 years of age and agree to comply with these terms.
        </p>
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
