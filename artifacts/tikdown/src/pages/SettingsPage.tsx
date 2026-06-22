import { useState, useEffect } from "react";
import { useTheme } from "@/App";
import { checkHealth } from "@/lib/api";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    checkHealth().then((ok) => setApiStatus(ok ? "online" : "offline"));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

      {/* Appearance */}
      <section className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-lg text-foreground mb-4">🎨 Appearance</h2>

        <div className="flex items-center justify-between py-4 border-b border-border">
          <div>
            <p className="font-medium text-sm text-foreground">Theme</p>
            <p className="text-xs text-muted-foreground mt-0.5">Switch between dark and light mode</p>
          </div>
          <button
            onClick={toggle}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              theme === "dark" ? "bg-primary" : "bg-secondary border border-border"
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                theme === "dark" ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium text-sm text-foreground">Current Theme</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {theme === "dark" ? "🌙 Dark Mode — easy on eyes" : "☀️ Light Mode — bright & clean"}
            </p>
          </div>
          <span className="text-2xl">{theme === "dark" ? "🌙" : "☀️"}</span>
        </div>

        {/* Theme preview */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => theme !== "light" && toggle()}
            className={`p-4 rounded-xl border-2 transition-all ${
              theme === "light" ? "border-primary bg-primary/5" : "border-border bg-secondary"
            }`}
          >
            <div className="bg-white rounded-lg p-2 mb-2 border">
              <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-2 bg-red-400 rounded w-1/2" />
            </div>
            <p className="text-xs font-medium text-foreground">☀️ Light</p>
          </button>

          <button
            onClick={() => theme !== "dark" && toggle()}
            className={`p-4 rounded-xl border-2 transition-all ${
              theme === "dark" ? "border-primary bg-primary/5" : "border-border bg-secondary"
            }`}
          >
            <div className="bg-gray-900 rounded-lg p-2 mb-2 border border-gray-700">
              <div className="h-2 bg-gray-700 rounded w-3/4 mb-1" />
              <div className="h-2 bg-red-500 rounded w-1/2" />
            </div>
            <p className="text-xs font-medium text-foreground">🌙 Dark</p>
          </button>
        </div>
      </section>

      {/* About */}
      <section className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-lg text-foreground mb-4">ℹ️ About TikDown</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Version</span>
            <span className="font-medium text-foreground">2.0.0</span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Engine</span>
            <span className="font-medium text-foreground">yt-dlp + FastAPI</span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Cache</span>
            <span className="font-medium text-foreground">30 min TTL</span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Rate Limit</span>
            <span className="font-medium text-foreground">10 req/min</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-muted-foreground">API Status</span>
            <span className={`font-medium flex items-center gap-1 ${
              apiStatus === "online" ? "text-green-500" : apiStatus === "offline" ? "text-destructive" : "text-muted-foreground"
            }`}>
              <span className={`w-2 h-2 rounded-full inline-block ${
                apiStatus === "online" ? "bg-green-500" : apiStatus === "offline" ? "bg-destructive" : "bg-muted-foreground animate-pulse"
              }`} />
              {apiStatus === "checking" ? "Checking..." : apiStatus === "online" ? "Online ✓" : "Offline ✗"}
            </span>
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-lg text-foreground mb-4">📥 Supported Formats</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🎬", label: "MP4 (No Watermark)", desc: "HD video, clean" },
            { icon: "📹", label: "MP4 (Original)", desc: "With watermark" },
            { icon: "🎵", label: "MP3 Audio", desc: "192kbps quality" },
            { icon: "🖼️", label: "Photo / Slideshow", desc: "TikTok images" },
          ].map((f) => (
            <div key={f.label} className="bg-secondary rounded-xl p-3">
              <div className="text-xl mb-1">{f.icon}</div>
              <div className="text-xs font-semibold text-foreground">{f.label}</div>
              <div className="text-xs text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-semibold text-lg text-foreground mb-4">🔒 Privacy</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>✅ No account required — fully anonymous</p>
          <p>✅ No downloads stored on our servers</p>
          <p>✅ History stored in your session only</p>
          <p>✅ Files auto-deleted after 2 minutes</p>
          <p>✅ Rate limiting protects your IP</p>
        </div>
      </section>
    </div>
  );
}
