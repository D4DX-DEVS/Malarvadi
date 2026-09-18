import Link from "next/link";
import type { AppLocale } from "@/tokens";
import { Logo } from "../Logo";
import { KidsGroup, Rainbow, WaveDivider } from "../Decor";
import { NewsletterForm } from "./NewsletterForm";

interface CategoryItem {
  type: string;
  label: string;
}

/* `slug` is the route segment, `label` the key in the nav dictionary. */
const QUICK_LINKS: { slug: string; label: string }[] = [
  { slug: "about", label: "about" },
  { slug: "objectives", label: "objectives" },
  { slug: "global-presence", label: "globalPresence" },
  { slug: "programs", label: "programs" },
  { slug: "events", label: "events" },
  { slug: "gallery", label: "gallery" },
  { slug: "leaders", label: "leaders" },
  { slug: "news", label: "news" },
  { slug: "contact", label: "contact" },
];

/* Footer links keep a comfortable tap height - a 17px-tall link is far below
   one - but the way they are laid out changes with the room available.
   Below lg they flow inline and wrap, which fits ten links into three lines
   instead of the five rows a grid needed; from lg they return to the tidy
   two-up columns the wider footer has space for. */
const FOOTER_LINK =
  "inline-flex min-h-[38px] items-center rounded px-0.5 text-sm text-cream/80 transition-colors duration-200 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold lg:hover:translate-x-0.5";

const FOOTER_LABEL = "t-micro text-cream/50";

const FOOTER_LIST = "mt-1 flex flex-wrap gap-x-4 leading-snug lg:mt-2 lg:grid lg:grid-cols-2 lg:gap-x-4";

/**
 * Social links only render once a real URL is filled in below, so the footer
 * never ships a row of icons that go nowhere.
 */
const SOCIALS: { key: string; label: string; href: string; path: string }[] = [
  {
    key: "facebook",
    label: "Facebook",
    href: "",
    path: "M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.5-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.8v3h2.2v8h3.5Z",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "",
    path: "M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm5.7-7.6a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5Zm0 1.7A2.8 2.8 0 0 0 5.2 8v8A2.8 2.8 0 0 0 8 18.8h8A2.8 2.8 0 0 0 18.8 16V8A2.8 2.8 0 0 0 16 5.2H8Z",
  },
  {
    key: "youtube",
    label: "YouTube",
    href: "",
    path: "M21.6 7.9a2.5 2.5 0 0 0-1.8-1.8C18.2 5.7 12 5.7 12 5.7s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.9 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.1 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.1ZM10 15V9l5.2 3L10 15Z",
  },
];

export function Footer({
  locale,
  tagline,
  explore,
  programsLabel,
  nav,
  rights,
  quickLinksLabel,
  newsletter,
  categories,
}: {
  locale: AppLocale;
  tagline: string;
  explore: string;
  programsLabel: string;
  nav: Record<string, string>;
  rights: string;
  quickLinksLabel: string;
  newsletter: {
    title: string;
    sub: string;
    placeholder: string;
    submit: string;
    closing: string;
    follow: string;
    success: string;
    fail: string;
  };
  categories: CategoryItem[];
}) {
  const year = new Date().getFullYear();
  const socials = SOCIALS.filter((s) => s.href);

  return (
    <div className="mt-10 sm:mt-16">
      <div aria-hidden="true" className="bg-transparent">
        <WaveDivider className="block h-6 w-full text-cocoa sm:h-8" />
      </div>
      <footer className="bg-cocoa text-cream">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-7 sm:grid-cols-2 sm:gap-x-8 sm:px-6 sm:py-9 lg:grid-cols-[1fr_1.35fr_1.05fr_1.15fr] lg:gap-10">
          {/* Brand */}
          <div>
            <span className="inline-flex rounded-2xl bg-cream px-3.5 py-2.5">
              <Logo className="h-9" />
            </span>
            <p className="mt-2.5 max-w-sm text-sm leading-snug text-cream/75">{tagline}</p>

            {socials.length ? (
              <div className="mt-4">
                <p className={FOOTER_LABEL}>{newsletter.follow}</p>
                <ul className="mt-2.5 flex gap-2.5">
                  {socials.map((s) => (
                    <li key={s.key}>
                      <a
                        href={s.href}
                        aria-label={s.label}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream transition-all duration-200 hover:-translate-y-0.5 hover:bg-marigold hover:text-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                          <path d={s.path} />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-1 flex items-center gap-1 text-sm">
              <Link
                href="/en"
                hrefLang="en"
                aria-current={locale === "en" ? "true" : undefined}
                className={`inline-flex min-h-[38px] items-center rounded px-2 font-bold transition-colors hover:text-marigold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold ${locale === "en" ? "text-marigold" : "text-cream/80"}`}
              >
                English
              </Link>
              <span aria-hidden="true" className="text-cream/30">|</span>
              <Link
                href="/ml"
                hrefLang="ml"
                lang="ml"
                aria-current={locale === "ml" ? "true" : undefined}
                className={`inline-flex min-h-[38px] items-center rounded px-2 font-bold transition-colors hover:text-marigold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold ${locale === "ml" ? "text-marigold" : "text-cream/80"}`}
              >
                മലയാളം
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label={quickLinksLabel}>
            <p className={FOOTER_LABEL}>{quickLinksLabel}</p>
            <ul className={FOOTER_LIST}>
              <li>
                <Link href={`/${locale}`} className={FOOTER_LINK}>
                  {nav.home}
                </Link>
              </li>
              {QUICK_LINKS.map((l) => (
                <li key={l.slug}>
                  <Link href={`/${locale}/${l.slug}`} className={FOOTER_LINK}>
                    {nav[l.label]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Programs - the real program type filters */}
          <nav aria-label={programsLabel}>
            <p className={FOOTER_LABEL}>{programsLabel}</p>
            <ul className={FOOTER_LIST}>
              {categories.map((c) => (
                <li key={c.type || "all"}>
                  <Link
                    href={c.type ? `/${locale}/programs?type=${c.type}` : `/${locale}/programs`}
                    className={FOOTER_LINK}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="sr-only">{explore}</p>
          </nav>

          {/* Newsletter */}
          <div>
            <p className={FOOTER_LABEL}>{newsletter.title}</p>
            <p className="mt-1.5 text-sm leading-snug text-cream/75">{newsletter.sub}</p>
            <NewsletterForm
              locale={locale}
              placeholder={newsletter.placeholder}
              submit={newsletter.submit}
              success={newsletter.success}
              fail={newsletter.fail}
            />
          </div>
        </div>

        {/* Closing band: rainbow over a line-up of children, as in the reference */}
        <div className="border-t border-cream/10">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-3 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5">
            <Rainbow className="h-7 w-20 shrink-0 animate-arc-glow sm:h-8 sm:w-28" />
            <p className="text-center text-sm font-bold leading-snug text-cream/90 sm:text-base">{newsletter.closing}</p>
            <KidsGroup className="hidden h-9 w-auto max-w-[180px] shrink-0 text-cream/60 sm:block" />
          </div>
        </div>

        <div className="border-t border-cream/10">
          <p className="mx-auto w-full max-w-6xl px-4 py-3 text-xs text-cream/60 sm:px-6">
            © {year} {rights}
          </p>
        </div>
      </footer>
    </div>
  );
}
