/**
 * Video embedding for the three platforms the admin can add: YouTube,
 * Facebook and Instagram. Each stores a plain share URL; this turns that
 * into the iframe src for the player.
 */
export type VideoPlatform = "youtube" | "facebook" | "instagram";

export const VIDEO_PLATFORMS: { value: VideoPlatform; label: string }[] = [
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
];

/** Pull the 11-char id out of any common YouTube URL shape. */
export function youtubeIdFromUrl(url: string): string {
  if (!url) return "";
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,          // watch?v=ID
    /youtu\.be\/([A-Za-z0-9_-]{11})/,     // youtu.be/ID
    /\/embed\/([A-Za-z0-9_-]{11})/,       // /embed/ID
    /\/shorts\/([A-Za-z0-9_-]{11})/,      // /shorts/ID
    /\/live\/([A-Za-z0-9_-]{11})/,        // /live/ID
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1]!;
  }
  // a bare id pasted straight in
  return /^[A-Za-z0-9_-]{11}$/.test(url.trim()) ? url.trim() : "";
}

/** Instagram post/reel shortcode from a share URL. */
export function instagramCodeFromUrl(url: string): string {
  const m = url?.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  return m ? m[1]! : "";
}

/** Guess the platform from a pasted URL, so a missing field still works. */
export function detectPlatform(url: string): VideoPlatform {
  if (/facebook\.com|fb\.watch/i.test(url)) return "facebook";
  if (/instagram\.com/i.test(url)) return "instagram";
  return "youtube";
}

export interface EmbeddableVideo {
  platform?: string;
  url?: string;
  youtubeId?: string;
  thumb?: string;
}

/** iframe src for a stored video, or null when it can't be embedded. */
export function videoEmbedSrc(v: EmbeddableVideo): string | null {
  const url = (v.url || "").trim();
  const platform = (v.platform as VideoPlatform) || (url ? detectPlatform(url) : "youtube");

  if (platform === "facebook") {
    if (!url) return null;
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=false`;
  }

  if (platform === "instagram") {
    const code = instagramCodeFromUrl(url);
    return code ? `https://www.instagram.com/p/${code}/embed` : null;
  }

  // youtube - prefer the URL, fall back to the legacy youtubeId field
  const id = youtubeIdFromUrl(url) || (v.youtubeId || "").trim();
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : null;
}

/** Poster image for a video, or null when the platform gives us no public one. */
export function videoThumbnail(v: EmbeddableVideo): string | null {
  if (v.thumb) return v.thumb; // admin-uploaded cover wins
  const url = (v.url || "").trim();
  const platform = (v.platform as VideoPlatform) || (url ? detectPlatform(url) : "youtube");
  if (platform !== "youtube") return null; // Facebook/Instagram need an API token
  const id = youtubeIdFromUrl(url) || (v.youtubeId || "").trim();
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

/** Human label, used on the placeholder tile when there is no thumbnail. */
export function platformLabel(v: EmbeddableVideo): string {
  const url = (v.url || "").trim();
  const platform = (v.platform as VideoPlatform) || (url ? detectPlatform(url) : "youtube");
  return VIDEO_PLATFORMS.find((p) => p.value === platform)?.label || "Video";
}

/**
 * Facebook /share/ and fb.watch links are short redirects. The video plugin
 * cannot embed them - it renders "Video Unavailable" - so they must be
 * resolved to the canonical /reel/<id>/ or /videos/<id>/ permalink first.
 * Note: Facebook rejects long browser-style user agents here with a 400,
 * so we send a short one.
 */
export function isFacebookShareLink(url: string): boolean {
  return /facebook\.com\/share\//i.test(url) || /fb\.watch\//i.test(url);
}

export async function resolveFacebookShareUrl(url: string, timeoutMs = 7000): Promise<string> {
  const raw = (url || "").trim();
  if (!isFacebookShareLink(raw)) return raw;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(raw, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "user-agent": "curl/8.0" },
    });
    clearTimeout(timer);
    if (!res.url) return raw;
    const u = new URL(res.url);
    u.search = ""; // drop rdid/share_url tracking params
    u.hash = "";
    return u.toString();
  } catch {
    return raw; // best effort - never block a save on Facebook being slow
  }
}

/**
 * Pull the og:image out of a video permalink. Facebook/Instagram only serve
 * these to a crawler-ish user agent, and the resulting fbcdn/cdninstagram URLs
 * are signed and expire - so callers should copy the bytes locally rather than
 * storing the URL.
 */
export async function fetchOgImage(url: string, timeoutMs = 9000): Promise<string | null> {
  const raw = (url || "").trim();
  if (!raw) return null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(raw, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "user-agent": "facebookexternalhit/1.1", "accept-language": "en-US,en;q=0.9" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const html = await res.text();
    const m =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (!m) return null;
    // the tag is HTML-escaped
    return m[1]!.replace(/&amp;/g, "&").replace(/&#x2F;/g, "/").replace(/&quot;/g, '"');
  } catch {
    return null;
  }
}
