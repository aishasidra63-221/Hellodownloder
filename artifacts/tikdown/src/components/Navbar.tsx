import { Link, useLocation } from "wouter";
import { useTheme } from "@/App";
import { Download, Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/",            label: "Home"       },
  { href: "/how-it-works",label: "How to Use" },
  { href: "/features",    label: "Features"   },
  { href: "/faq",         label: "FAQ"        },
  { href: "/blog",        label: "Blog"       },
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const isLight = theme === "light";

  return (
    <nav className="navbar-glass sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer select-none shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }}>
              <Download className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-black text-lg tracking-tight" style={{ color: isLight ? "#0d0f1a" : "#ffffff" }}>
              Lul<span style={{ color: "#8b5cf6" }}>Down</span>
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ href, label }) => {
            const active = location === href;
            return (
              <Link key={href} href={href}>
                <div className="relative px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-150"
                  style={{ color: active ? "#ffffff" : (isLight ? "rgba(13,15,26,0.55)" : "rgba(200,200,220,0.55)") }}>
                  {label}
                  {active && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full" style={{ background: "#8b5cf6" }} />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Theme toggle + hamburger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)",
              color: isLight ? "#4b5563" : "rgba(200,200,220,0.7)",
              border: isLight ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isLight ? "Dark" : "Light"}</span>
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)",
              color: isLight ? "#4b5563" : "rgba(200,200,220,0.7)",
              border: isLight ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-4 py-3 space-y-1"
          style={{
            borderColor: isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)",
            background: isLight ? "rgba(255,255,255,0.98)" : "rgba(13,15,26,0.98)",
            backdropFilter: "blur(20px)",
          }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>
              <div
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all"
                style={location === href
                  ? { color: "#8b5cf6", background: "rgba(139,92,246,0.08)" }
                  : { color: isLight ? "#4b5563" : "rgba(200,200,220,0.55)" }}
              >
                {label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
