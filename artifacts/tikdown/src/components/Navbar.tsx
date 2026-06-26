import { Link, useLocation } from "wouter";
import { useTheme } from "@/App";
import { Sun, Moon, Download, Home, Clock, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", Icon: Home },
    { href: "/history", label: "History", Icon: Clock },
    { href: "/settings", label: "Settings", Icon: Settings },
  ];

  const isDark = theme === "dark";

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={isDark ? {
        borderColor: "rgba(168,85,247,0.15)",
        background: "rgba(7,5,15,0.80)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      } : {
        borderColor: undefined,
      }}
      {...(!isDark && { className: "sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md" })}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={isDark ? {
                background: "linear-gradient(135deg, hsl(262 83% 68%), hsl(197 100% 55%))",
                boxShadow: "0 0 16px rgba(168,85,247,0.5)",
              } : { background: "hsl(262 83% 60%)" }}
            >
              <Download className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Lul
              <span style={isDark ? { color: "hsl(197 100% 55%)" } : { color: "hsl(262 83% 60%)" }}>
                down
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ href, label, Icon }) => (
            <Link key={href} href={href}>
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                location === href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}>
                <Icon className="w-4 h-4" />
                {label}
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={isDark ? {
              background: "rgba(168,85,247,0.12)",
              border: "1px solid rgba(168,85,247,0.2)",
            } : { background: "hsl(var(--secondary))" }}
            aria-label="Toggle theme"
          >
            {isDark
              ? <Sun className="w-4 h-4 text-yellow-300" />
              : <Moon className="w-4 h-4 text-foreground" />}
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center bg-secondary"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="sm:hidden border-t px-4 py-3 space-y-1"
          style={isDark ? {
            borderColor: "rgba(168,85,247,0.15)",
            background: "rgba(7,5,15,0.95)",
          } : undefined}
        >
          {navLinks.map(({ href, label, Icon }) => (
            <Link key={href} href={href}>
              <div
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  location === href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
