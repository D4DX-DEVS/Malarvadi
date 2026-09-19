import Link from "next/link";
import type { SocialLink } from "@/lib/site";
import type { AppLocale } from "@/tokens";
import { Logo } from "../Logo";
import { Leaf, Sprout } from "../Decor";
import { SocialIcons } from "../SocialIcons";

export interface FooterContact {
  title: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

/* `slug` is the route segment, `label` the key in the nav dictionary. */
const QUICK_LINKS: { slug: string; label: string }[] = [
  { slug: "", label: "home" },
  { slug: "about", label: "about" },
  { slug: "objectives", label: "objectives" },
  { slug: "programs", label: "programs" },
  { slug: "events", label: "events" },
  { slug: "gallery", label: "gallery" },
  { slug: "news", label: "news" },
  { slug: "leaders", label: "leaders" },
  { slug: "contact", label: "contact" },
];

/* The footer menu and its section titles are English chrome (the footer
   lives inside a lang="en" wrapper - see the locale layout) and share the
   page's own display face on every locale, never the Malayalam body serif. */
const FOOTER_LINK =
  "inline-flex min-h-[36px] items-center rounded px-0.5 font-nav text-sm text-cream/80 transition-colors duration-200 hover:text-marigold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold";

const FOOTER_TITLE = "font-nav text-base font-bold text-cream";

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}
function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

/**
 * The green footer under its grass hills: the wordmark with the movement's
 * line and social badges, the quick links, and how to reach us.
 *
 * The hills are drawn here rather than in the page above so every route ends
 * the same way; the home page's invitation band simply pulls the footer up
 * underneath itself to sit on them.
 */
export function Footer({
  locale,
  tagline,
  nav,
  rights,
  quickLinksLabel,
  followLabel,
  contact,
  socials,
}: {
  locale: AppLocale;
  tagline: string;
  nav: Record<string, string>;
  rights: string;
  quickLinksLabel: string;
  followLabel: string;
  contact: FooterContact;
  socials: SocialLink[];
}) {
  const year = new Date().getFullYear();
  const rows = [
    { key: "address", Icon: PinIcon, value: contact.address, href: "" },
    { key: "phone", Icon: PhoneIcon, value: contact.phone, href: contact.phone ? `tel:${contact.phone.replace(/\s+/g, "")}` : "" },
    { key: "email", Icon: MailIcon, value: contact.email, href: contact.email ? `mailto:${contact.email}` : "" },
    { key: "hours", Icon: ClockIcon, value: contact.hours, href: "" },
  ].filter((r) => r.value);

  return (
    <div className="mt-10 sm:mt-16">
      {/* Two hills - bright grass in front of the deep green - lead into the footer. */}
      <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="block h-14 w-full sm:h-20" aria-hidden="true">
        <path d="M0 34 Q 60 4 130 26 T 270 20 T 400 30 L400 60 L0 60 Z" fill="#5DBE6E" />
        <path d="M0 46 Q 90 20 180 40 T 400 34 L400 60 L0 60 Z" fill="#1F5B3B" />
      </svg>

      <footer className="relative overflow-hidden bg-forest text-cream">
        <Leaf className="pointer-events-none absolute -bottom-3 right-[4%] h-24 w-24 rotate-[15deg] text-grass/40" />
        <Sprout className="pointer-events-none absolute bottom-6 right-[12%] hidden h-14 w-14 text-grass/50 lg:block" />
        <Leaf className="pointer-events-none absolute -left-4 top-6 h-16 w-16 -rotate-[50deg] text-grass/25" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 pb-8 pt-4 sm:grid-cols-2 sm:gap-x-8 sm:px-6 sm:pb-10 sm:pt-6 lg:grid-cols-[1.4fr_1fr_1.3fr] lg:gap-10">
          {/* Brand */}
          <div>
            <span className="inline-flex rounded-2xl bg-cream px-3.5 py-2.5 shadow-playful">
              <Logo className="h-10" />
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/80">{tagline}</p>
            <p className="sr-only">{followLabel}</p>
            <SocialIcons items={socials} size="h-9 w-9" className="mt-4" />
          </div>

          {/* Quick links */}
          <nav aria-label={quickLinksLabel}>
            <p className={FOOTER_TITLE}>{quickLinksLabel}</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 sm:grid-cols-1 lg:grid-cols-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.slug || "home"}>
                  <Link href={l.slug ? `/${locale}/${l.slug}` : `/${locale}`} className={FOOTER_LINK}>
                    {nav[l.label]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className={FOOTER_TITLE}>{contact.title}</p>
            <ul className="mt-2 grid gap-2">
              {rows.map(({ key, Icon, value, href }) => (
                <li key={key} className="flex items-start gap-3 text-sm text-cream/85">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream/10 text-marigold">
                    <Icon className="h-4 w-4" />
                  </span>
                  {href ? (
                    <a href={href} className="rounded leading-relaxed transition-colors hover:text-marigold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold">
                      {value}
                    </a>
                  ) : (
                    <span className="leading-relaxed">{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative border-t border-cream/10">
          <p className="mx-auto w-full max-w-6xl px-4 py-3 text-xs text-cream/60 sm:px-6">
            © {year} {rights}
          </p>
        </div>
      </footer>
    </div>
  );
}
