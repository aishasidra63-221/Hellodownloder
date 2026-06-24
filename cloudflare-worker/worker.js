/**
 * Luldown — TikTok Downloader Cloudflare Worker
 *
 * Architecture:
 *   - Calls tikwm.com API to extract TikTok CDN URLs
 *   - 3 fake Chrome headers only (UA + Referer + Language)
 *   - No proxy pool — Cloudflare's global IPs handle it
 *   - No random delays — each request hits from a different edge node
 *   - Rate limiting — configured in wrangler.toml (Cloudflare built-in)
 */

const TIKWM_API = "https://www.tikwm.com/api/";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// 3 lines — that's all tikwm needs to think we're a real browser
const CHROME_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Referer": "https://www.tiktok.com/",
  "Accept-Language": "en-US,en;q=0.9",
};

// ── tikwm helpers ──────────────────────────────────────────────────────────────

async function callTikwm(tiktokUrl) {
  const form = new FormData();
  form.append("url", tiktokUrl);
  form.append("hd", "1");

  const res = await fetch(TIKWM_API, {
    method: "POST",
    headers: CHROME_HEADERS,
    body: form,
  });

  if (!res.ok) throw new Error(`tikwm HTTP ${res.status}`);
  return res.json();
}

function parseTikwm(data) {
  const author = data.author || {};
  const images = data.images || [];
  return {
    title:      data.title || "TikTok Video",
    author:     typeof author === "object" ? (author.nickname || "") : String(author),
    duration:   data.duration || 0,
    thumbnail:  data.cover || data.origin_cover || "",
    view_count: data.play_count || 0,
    like_count: data.digg_count || 0,
    is_photo:   images.length > 0,
    images,
    _play_nowm: data.play    || "",
    _hd_play:   data.hdplay  || data.play || "",
    _music:     data.music   || "",
  };
}

// ── Response helpers ───────────────────────────────────────────────────────────

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function err(detail, status = 422) {
  return json({ detail }, status);
}

function validateTikTokUrl(url) {
  const u = (url || "").trim();
  if (!u || !u.includes("tiktok.com")) return null;
  return u;
}

// ── Main handler ───────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const method = request.method;

    // CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // GET /health
    if (pathname === "/health" && method === "GET") {
      return json({ status: "ok", version: "3.0.0", engine: "cloudflare-worker" });
    }

    // GET /api/token — compatibility stub (rate limiting is CF built-in now)
    if (pathname === "/api/token" && method === "GET") {
      return json({ token: "", ttl_seconds: 300 });
    }

    // POST /api/info — fetch video metadata
    if (pathname === "/api/info" && method === "POST") {
      let body;
      try { body = await request.json(); } catch { return err("Invalid JSON", 400); }

      const tiktokUrl = validateTikTokUrl(body.url);
      if (!tiktokUrl) return err("Invalid TikTok URL. Please copy the link from TikTok app.", 400);

      let tikwmRes;
      try {
        tikwmRes = await callTikwm(tiktokUrl);
      } catch (e) {
        return err(`Download service unreachable: ${e.message}`);
      }

      if (tikwmRes.code !== 0 || !tikwmRes.data) {
        return err(tikwmRes.msg || "Could not fetch video info");
      }

      const p = parseTikwm(tikwmRes.data);
      return json({
        success:    true,
        title:      p.title,
        author:     p.author,
        duration:   p.duration,
        thumbnail:  p.thumbnail,
        view_count: p.view_count,
        like_count: p.like_count,
        is_photo:   p.is_photo,
        images:     p.images,
      });
    }

    // POST /api/download — return CDN URL (zero server bandwidth)
    if (pathname === "/api/download" && method === "POST") {
      let body;
      try { body = await request.json(); } catch { return err("Invalid JSON", 400); }

      const tiktokUrl = validateTikTokUrl(body.url);
      if (!tiktokUrl) return err("Invalid TikTok URL", 400);

      const format = body.format || "mp4_1080";
      const allowed = ["mp4_720", "mp4_1080", "mp3"];
      if (!allowed.includes(format)) return err(`Unknown format: ${format}`, 400);

      let tikwmRes;
      try {
        tikwmRes = await callTikwm(tiktokUrl);
      } catch (e) {
        return err(`Download service unreachable: ${e.message}`);
      }

      if (tikwmRes.code !== 0 || !tikwmRes.data) {
        return err(tikwmRes.msg || "Could not fetch video");
      }

      const p = parseTikwm(tikwmRes.data);

      let cdnUrl = "", filename = "luldown", ext = "mp4", mediaType = "video/mp4";

      if (format === "mp4_720") {
        cdnUrl   = p._play_nowm || p._hd_play;
        filename = "luldown_720p";
      } else if (format === "mp4_1080") {
        cdnUrl   = p._hd_play || p._play_nowm;
        filename = "luldown_1080p";
      } else if (format === "mp3") {
        cdnUrl    = p._music;
        filename  = "luldown_audio";
        ext       = "mp3";
        mediaType = "audio/mpeg";
      }

      if (!cdnUrl) {
        return err("Download URL not available. The video may be private or region-restricted.");
      }

      return json({
        success:    true,
        cdn_url:    cdnUrl,
        all_images: p.images,
        filename:   `${filename}.${ext}`,
        media_type: mediaType,
        title:      p.title,
        author:     p.author,
        format,
      });
    }

    return json({ error: "Not found" }, 404);
  },
};
