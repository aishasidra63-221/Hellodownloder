import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { BLOGS } from "@/data/blogs";
import { Clock, Calendar, ChevronRight, BookOpen } from "lucide-react";
import BackHomeButton from "@/components/BackHomeButton";

export default function BlogIndexPage() {
  useSEO({
    title: "TikTok Downloader Blog — Tips, Guides & How-Tos",
    description: "Learn how to download TikTok videos without watermark, save TikTok as MP3, download on iPhone, Android, PC and more. Free guides updated for 2025.",
  });

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh" }}>

      {/* Hero Header */}
      <div style={{
        background: "linear-gradient(160deg, #0d0b1f 0%, #13103a 60%, #0f0d28 100%)",
        padding: "48px 24px 52px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 16, left: 20, zIndex: 10 }}>
          <BackHomeButton />
        </div>
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
          <BookOpen size={24} color="#4f6ef7" />
        </div>
        <h1 style={{
          fontSize: "clamp(1.6rem, 5vw, 2.2rem)", fontWeight: 800,
          color: "#ffffff", marginBottom: 10, letterSpacing: "-0.02em",
          position: "relative",
        }}>
          Blog & Guides
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", position: "relative", maxWidth: 500, margin: "0 auto" }}>
          Step-by-step tutorials on how to download TikTok videos, save audio, and more.
        </p>
      </div>

      {/* Blog Grid */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 20px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
          {BLOGS.map((post) => {
            const dateFormatted = new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
            });

            return (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article style={{
                  background: "#ffffff",
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.09)",
                  padding: "20px 22px",
                  cursor: "pointer",
                  transition: "box-shadow 0.18s, transform 0.18s",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(79,110,247,0.10)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, color: "#6b7280", marginBottom: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar size={12} /> {dateFormatted}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} /> {post.readTime} min read
                    </span>
                  </div>

                  <h2 style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 8, lineHeight: 1.4 }}>
                    {post.title}
                  </h2>

                  <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7, marginBottom: 16, flexGrow: 1,
                    display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.intro}
                  </p>

                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: "#4f6ef7" }}>
                    Read Guide <ChevronRight size={14} />
                  </span>
                </article>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
