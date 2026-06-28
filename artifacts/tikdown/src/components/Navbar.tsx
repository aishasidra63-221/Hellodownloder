import { Link, useLocation } from "wouter";
import { useTheme } from "@/App";
import { Download, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/how-it-works", label: "How it works" },
    { href: "/faq",          label: "FAQ"          },
    { href: "/history",      label: "History"      },
  ];

  const isLight = theme === "light";

  return (
    <nav className="navbar-glass sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer select-none group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: "#dc2020",
                boxShadow: "0 2px 10px rgba(220,32,32,0.4)",
              }}>
              <Download className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="logo-text text-xl font-black tracking-tight" style={{ color: isLight ? "#111111" : "#ffffff" }}>
              Lul<span style={{ color: "#dc2020" }}>Down</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}>
                <div className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150"
                  style={location === href
                    ? { color: "#dc2020" }
                    : { color: isLight ? "rgba(20,20,20,0.5)" : "rgba(200,200,200,0.5)" }}>
                  {label}
                </div>
              </Link>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all ml-1"
            style={{
              background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
              color: isLight ? "#4b5563" : "rgba(200,200,200,0.6)",
              border: isLight ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.08)",
            }}
            aria-label="Toggle theme"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all ml-1"
            style={{
              background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
              color: isLight ? "#4b5563" : "rgba(200,200,200,0.6)",
              border: isLight ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.08)",
            }}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t px-4 py-3 space-y-1"
          style={{
            borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)",
            background: isLight ? "rgba(255,255,255,0.97)" : "rgba(10,10,10,0.98)",
            backdropFilter: "blur(20px)",
          }}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}>
              <div
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all"
                style={location === href
                  ? { color: "#dc2020", background: "rgba(220,32,32,0.08)" }
                  : { color: isLight ? "#4b5563" : "rgba(200,200,200,0.55)" }}
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
