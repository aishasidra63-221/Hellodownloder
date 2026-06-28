import { Link, useLocation } from "wouter";
import { Download, Menu, X } from "lucide-react";
import { useState } from "react";

const LINKS = [
  { href: "/",        label: "Home"    },
  { href: "/faq",     label: "FAQ"     },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)", boxShadow: "0 2px 12px rgba(34,211,238,0.3)" }}>
              <Download className="w-4 h-4" style={{ color: "#050a0b" }} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "#f4f4f6" }}>
              Lul<span style={{ color: "#22d3ee" }}>Down</span>
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {LINKS.map(({ href, label }) => {
            const active = loc === href;
            return (
              <Link key={href} href={href}>
                <div className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                  style={{ color: active ? "#22d3ee" : "rgba(180,185,210,0.6)" }}>
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg btn-ghost"
          aria-label="Menu"
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t px-4 py-3 space-y-1"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(10,10,15,0.98)" }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>
              <div onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors"
                style={{ color: loc === href ? "#22d3ee" : "rgba(180,185,210,0.55)" }}>
                {label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
