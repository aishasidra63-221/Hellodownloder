import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function BackHomeButtonLight() {
  return (
    <Link href="/">
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 13, fontWeight: 700, color: "#4f6ef7",
        cursor: "pointer",
        padding: "6px 14px 6px 10px",
        background: "rgba(79,110,247,0.07)",
        border: "1px solid rgba(79,110,247,0.2)",
        borderRadius: 999,
        transition: "background 0.15s",
      }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(79,110,247,0.13)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(79,110,247,0.07)")}
      >
        <ArrowLeft size={13} />
        Home
      </span>
    </Link>
  );
}
