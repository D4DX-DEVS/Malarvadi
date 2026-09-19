import type { SocialLink } from "@/lib/site";

/**
 * The row of round social badges the header and footer share - Facebook blue,
 * Instagram gradient, YouTube red, WhatsApp green, each on its own disc.
 *
 * A badge whose URL is not configured yet is rendered as an inert mark, so the
 * chrome matches the reference on day one without shipping a dead link.
 */
export function SocialIcons({
  items,
  size = "h-9 w-9",
  glyph = "h-[55%] w-[55%]",
  className = "",
}: {
  items: SocialLink[];
  size?: string;
  glyph?: string;
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {items.map((s) => {
        const cls = `inline-flex ${size} items-center justify-center rounded-full text-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${s.color}`;
        const icon = (
          <svg viewBox="0 0 24 24" className={glyph} fill="currentColor" aria-hidden="true">
            <path d={s.path} />
          </svg>
        );
        return (
          <li key={s.key}>
            {s.href ? (
              <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className={cls}>
                {icon}
              </a>
            ) : (
              <span role="img" aria-label={s.label} title={s.label} className={`${cls} cursor-default`}>
                {icon}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
