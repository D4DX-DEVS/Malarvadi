// Rich-text helpers shared by the admin editor, the API and the public views.
//
// Rich-text fields are stored as HTML and rendered with dangerouslySetInnerHTML,
// so every write goes through sanitizeHtml() in validateDoc(). The allowlist is
// deliberately tiny: anything not named here loses its tag and keeps its text.

const ALLOWED_TAGS: Record<string, string[]> = {
  p: [], br: [], strong: [], b: [], em: [], i: [], u: [], s: [],
  h2: [], h3: [], h4: [], ul: [], ol: [], li: [], blockquote: [],
  a: ["href"],
};

/** Allowlist, not a denylist: `javascript:` and friends simply never match. */
const SAFE_HREF = /^(?:https?:\/\/|mailto:|tel:|\/|#)/i;

function escapeAttr(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function readAttr(attrs: string, name: string): string | null {
  const re = new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const m = re.exec(attrs);
  if (!m) return null;
  return (m[1] ?? m[2] ?? m[3] ?? "").trim();
}

/** Strip everything outside the allowlist. Unknown tags are dropped, text kept. */
export function sanitizeHtml(input: string): string {
  if (!input) return "";
  const html = input
    .replace(/<!--[\s\S]*?-->/g, "")
    // Drop these outright, contents included - unlike other tags their text is not content.
    .replace(/<(script|style|iframe|object|embed|template)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<\/?(script|style|iframe|object|embed|template)\b[^>]*>/gi, "")
    .replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?)\/?>/g, (_m, close: string, rawName: string, attrs: string) => {
      const name = rawName.toLowerCase();
      const allowed = ALLOWED_TAGS[name];
      if (!allowed) return "";
      if (close) return `</${name}>`;
      if (name === "a") {
        const href = readAttr(attrs, "href");
        // An anchor we cannot vouch for becomes plain text rather than a dead link.
        if (!href || !SAFE_HREF.test(href)) return "";
        const external = /^https?:/i.test(href);
        return `<a href="${escapeAttr(href)}"${external ? ' target="_blank" rel="noreferrer noopener"' : ""}>`;
      }
      const kept = allowed
        .map((a) => { const v = readAttr(attrs, a); return v == null ? null : `${a}="${escapeAttr(v)}"`; })
        .filter(Boolean);
      return `<${name}${kept.length ? ` ${kept.join(" ")}` : ""}>`;
    })
    // An <a> whose href was rejected leaves a stray closing tag behind.
    .replace(/<\/a>/g, (m, offset: number, s: string) => (s.slice(0, offset).includes("<a ") ? m : ""));

  return tidy(html);
}

const BLOCK = "ul|ol|h2|h3|h4|blockquote";

/** execCommand happily emits `<p><ul>…</ul></p>`, which is invalid HTML: a <p>
 *  cannot contain a block. Unwrap those and drop paragraphs left empty. */
function tidy(html: string): string {
  let out = html;
  for (let i = 0; i < 4; i++) {
    const next = out
      .replace(new RegExp(`<p>\\s*(<(?:${BLOCK})\\b)`, "gi"), "$1")
      .replace(new RegExp(`(</(?:${BLOCK})>)\\s*</p>`, "gi"), "$1");
    if (next === out) break;
    out = next;
  }
  return out
    .replace(/<p>(?:\s|<br\s*\/?>|&nbsp;)*<\/p>/gi, "")
    .trim();
}

/** True when a stored value is HTML rather than the older plain-text format. */
export function isHtml(value?: string): boolean {
  return !!value && /<(p|br|strong|b|em|i|u|s|h2|h3|h4|ul|ol|li|a|blockquote)\b[^>]*>/i.test(value);
}

/** Plain-text preview of a rich-text value, e.g. for meta descriptions. */
export function htmlToText(value?: string): string {
  if (!value) return "";
  return value
    .replace(/<\/(p|h2|h3|h4|li|blockquote)>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Plain text (blank line = paragraph) to HTML, for seeding the editor with
 *  content written before rich text existed. */
export function textToHtml(value?: string): string {
  if (!value) return "";
  if (isHtml(value)) return value;
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return value
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => `<p>${esc(para).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
