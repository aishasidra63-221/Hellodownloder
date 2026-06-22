import { Link, useLocation } from "wouter";
import { useTheme } from "@/App";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/history", label: "History" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-2xl">⬇️</span>
            <span className="text-xl font-bold text-foreground">
              Tik<span className="text-primary">Down</span>
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`text-sm font-medium cursor-pointer transition-colors ${
                  location === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/70 transition-colors text-lg"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden border-t border-border flex">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <span
              className={`flex-1 py-2 text-center text-xs font-medium cursor-pointer ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
