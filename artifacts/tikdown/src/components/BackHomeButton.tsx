import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function BackHomeButton() {
  return (
    <Link href="/">
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)",
        cursor: "pointer", position: "relative", zIndex: 10,
        padding: "6px 14px 6px 10px",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 999,
        backdropFilter: "blur(8px)",
        transition: "background 0.15s",
      }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
      >
        <ArrowLeft size={13} />
        Home
      </span>
    </Link>
  );
}
