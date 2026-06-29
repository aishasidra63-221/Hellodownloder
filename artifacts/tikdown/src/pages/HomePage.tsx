import { useSEO } from "@/hooks/use-seo";
import DownloaderBox from "@/components/DownloaderBox";
import { FaTiktok } from "react-icons/fa";
import { FiGift, FiUser, FiShield, FiHeadphones, FiLock } from "react-icons/fi";
import { MdHd } from "react-icons/md";
import { RiShieldCheckLine } from "react-icons/ri";
import { BsLightningChargeFill, BsClipboard, BsDownload, BsCheck2Circle } from "react-icons/bs";

const FEATURES = [
  {
    label: "No Watermark",
    sub: "Clean videos",
    color: "#4f6ef7",
    bg: "rgba(79,110,247,0.12)",
    icon: <RiShieldCheckLine size={24} color="#4f6ef7" />,
  },
  {
    label: "HD Quality",
    sub: "High Quality",
    color: "#e63f7a",
    bg: "rgba(230,63,122,0.12)",
    icon: <MdHd size={26} color="#e63f7a" />,
  },
  {
    label: "Fast Download",
    sub: "In seconds",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    icon: <BsLightningChargeFill size={20} color="#8b5cf6" />,
  },
  {
    label: "All Devices",
    sub: "Android, iOS, PC",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="13" height="10" rx="2" stroke="#10b981" strokeWidth="2"/>
        <rect x="16" y="8" width="6" height="9" rx="1.5" stroke="#10b981" strokeWidth="2"/>
        <path d="M2 19h13M8 19v2M8.5 21h5" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const STEPS = [
  {
    n: "1", title: "Copy link from TikTok",
    color: "#4f6ef7", badgeColor: "#4f6ef7",
    bg: "rgba(79,110,247,0.13)",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#4f6ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#4f6ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    n: "2", title: "Paste the link above",
    color: "#8b5cf6", badgeColor: "#8b5cf6",
    bg: "rgba(139,92,246,0.13)",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect x="8" y="2" width="8" height="4" rx="1.5" stroke="#8b5cf6" strokeWidth="2"/>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
        <path d="M9 12h6M9 16h4" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    n: "3", title: "Click download and enjoy",
    color: "#e63f7a", badgeColor: "#e63f7a",
    bg: "rgba(230,63,122,0.13)",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#e63f7a" strokeWidth="2"/>
        <path d="M12 8v6M9 11l3 3 3-3" stroke="#e63f7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const FOOTER_ITEMS = [
  { icon: <FiGift size={15} />, label: "100% Free" },
  { icon: <FiUser size={15} />, label: "No Registration" },
  { icon: <FiShield size={15} />, label: "Secure & Safe" },
  { icon: <FiHeadphones size={15} />, label: "Fast Support" },
];

export default function HomePage() {
  useSEO({
    title: "TikTok Video Downloader — No Watermark | LulDown",
    description: "Download TikTok videos without watermark in 1080p, 720p or MP3. Free, fast, no login required. Works on all devices.",
  });

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "var(--page-bg)" }}>

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{ padding: "32px 20px 8px", textAlign: "center", maxWidth: 640, margin: "0 auto", position: "relative" }}>

        {/* TikTok watermark */}
        <div style={{
          position: "absolute", top: 0, right: -20,
          opacity: 0.07, pointerEvents: "none",
        }}>
          <FaTiktok size={160} style={{ color: "var(--tiktok-mark)" }} />
        </div>

        {/* Badge */}
        <div style={{ marginBottom: 18 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 16px", borderRadius: 999,
            border: "1.5px solid var(--badge-border)",
            background: "var(--badge-bg)",
            color: "var(--text-primary)",
            fontSize: 12, fontWeight: 600,
          }}>
            100% Free <span style={{ color: "#4f6ef7", fontWeight: 800 }}>✦</span>
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(1.9rem, 5.5vw, 2.8rem)",
          fontWeight: 900, lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: "var(--text-primary)",
          marginBottom: 14,
        }}>
          Download{" "}
          <span style={{
            background: "linear-gradient(90deg, #4f6ef7, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            TikTok
          </span>{" "}
          Videos<br />Without Watermark
        </h1>

        <p style={{
          fontSize: 15, color: "var(--text-muted)",
          marginBottom: 28, fontWeight: 400, lineHeight: 1.5,
        }}>
          Fast. Free. High Quality.
        </p>

        {/* Downloader */}
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <DownloaderBox />
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────── */}
      <section style={{ padding: "28px 16px 0", maxWidth: 640, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10,
          background: "var(--card-bg)", borderRadius: 18,
          border: "1px solid var(--card-border)",
          padding: "20px 8px",
        }}>
          {FEATURES.map(({ label, sub, color, bg, icon }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {icon}
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 700, fontSize: 11, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section style={{ padding: "16px 16px 0", maxWidth: 640, margin: "0 auto" }}>
        <div style={{
          background: "var(--card-bg)", borderRadius: 18,
          border: "1px solid var(--card-border)",
          padding: "28px 24px 32px",
        }}>
          <h2 style={{
            textAlign: "center", fontWeight: 800, fontSize: 18,
            color: "var(--text-primary)", marginBottom: 32,
          }}>
            How it works?
          </h2>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
            {STEPS.map(({ n, title, icon, bg, color }, i) => (
              <div key={n} style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>

                {/* Step column */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, flex: 1 }}>

                  {/* Circle + badge */}
                  <div style={{ position: "relative" }}>
                    <div style={{
                      width: 76, height: 76, borderRadius: "50%",
                      background: bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {icon}
                    </div>
                    {/* Number badge */}
                    <div style={{
                      position: "absolute", bottom: -2, right: -2,
                      width: 22, height: 22, borderRadius: "50%",
                      background: color,
                      color: "#fff", fontSize: 11, fontWeight: 900,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "2.5px solid var(--card-bg)",
                      boxShadow: `0 2px 8px ${color}55`,
                    }}>
                      {n}
                    </div>
                  </div>

                  {/* Label */}
                  <p style={{
                    fontSize: 12, fontWeight: 700, textAlign: "center",
                    color: "var(--text-primary)", lineHeight: 1.4,
                    maxWidth: 100,
                  }}>
                    {title}
                  </p>
                </div>

                {/* Dotted arrow connector */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    display: "flex", alignItems: "center",
                    paddingTop: 27, flexShrink: 0, gap: 2,
                  }}>
                    {/* Dots */}
                    {[0,1,2,3,4].map(d => (
                      <div key={d} style={{
                        width: 4, height: 4, borderRadius: "50%",
                        background: "var(--step-dot)", opacity: 0.5,
                        margin: "0 1.5px",
                      }} />
                    ))}
                    {/* Arrow head */}
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" style={{ marginLeft: 2 }}>
                      <path d="M1.5 1.5L6.5 6L1.5 10.5" stroke="var(--step-dot)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAFE & SECURE ─────────────────────────── */}
      <section style={{ padding: "16px 16px 0", maxWidth: 640, margin: "0 auto" }}>
        <div style={{
          background: "var(--card-bg)", borderRadius: 18,
          border: "1px solid var(--card-border)",
          padding: "20px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 54, height: 54, borderRadius: "50%",
              background: "rgba(16,185,129,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <FiLock size={24} color="#10b981" />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 15, color: "#10b981", marginBottom: 4 }}>
                Safe &amp; Secure
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                We don't store any videos.<br />Your data is 100% safe.
              </p>
            </div>
          </div>

          {/* Shield decoration */}
          <div style={{ position: "relative", opacity: 0.85, flexShrink: 0 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(16,185,129,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BsCheck2Circle size={28} color="#10b981" />
            </div>
            <span style={{ position: "absolute", top: -4, right: -4, fontSize: 12 }}>✦</span>
            <span style={{ position: "absolute", bottom: -4, left: -4, fontSize: 10 }}>✦</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER BAR ────────────────────────────── */}
      <section style={{ padding: "16px 16px 32px", maxWidth: 640, margin: "0 auto" }}>
        <div style={{
          background: "var(--footer-bar-bg)", borderRadius: 18,
          border: "1px solid var(--card-border)",
          padding: "16px 12px",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          flexWrap: "wrap", gap: 12,
        }}>
          {FOOTER_ITEMS.map(({ icon, label }, i) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 11, fontWeight: 600, color: "var(--text-secondary)",
              paddingRight: i < FOOTER_ITEMS.length - 1 ? 12 : 0,
              borderRight: i < FOOTER_ITEMS.length - 1 ? "1px solid var(--card-border)" : "none",
            }}>
              <span style={{ color: "var(--text-muted)" }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
        <p style={{
          textAlign: "center", fontSize: 11, color: "var(--text-muted)",
          marginTop: 16,
        }}>
          © {new Date().getFullYear()} LulDown.com – All rights reserved.
        </p>
      </section>
    </div>
  );
}
