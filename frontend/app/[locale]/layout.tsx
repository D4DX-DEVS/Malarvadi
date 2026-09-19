import { notFound } from "next/navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { HEADER_SOCIALS, SOCIALS } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteLoader } from "@/components/SiteLoader";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ml" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);

  /* Chrome (header + footer) stays in English on every locale by request -
     only the page content between them is translated. Links still carry the
     active locale, so navigating from a Malayalam page keeps you in Malayalam.
     The chrome is wrapped in lang="en" so screen readers switch voice for it
     and the :lang(ml) typography rules do not apply to English labels. */
  const chrome = getDictionary("en");

  return (
    /* `lang` lives here, not on <html>, so the locale layout stays statically
       rendered - it is what makes the :lang(ml) typography rules in
       globals.css apply on Malayalam pages. */
    <div lang={locale}>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cocoa focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <SiteLoader label="Loading" />
      <div lang="en">
        {/* One exception to the English chrome: the language toggle names the
            language it switches TO, so it has to come from the active locale's
            dictionary - on a Malayalam page it must read "English". */}
        <Header locale={locale} nav={chrome.nav} toggleLabel={dict.actions.toggleLanguage} socials={HEADER_SOCIALS} />
      </div>
      <div id="content" className="page-enter min-h-[60vh]">{children}</div>
      <div lang="en">
        <Footer
          locale={locale}
          tagline={chrome.footer.tagline}
          nav={chrome.nav}
          rights={chrome.footer.rights}
          quickLinksLabel={chrome.footer.quickLinks}
          followLabel={chrome.footer.follow}
          contact={{
            title: chrome.footer.contactTitle,
            address: chrome.contact.addressValue,
            phone: chrome.contact.phoneValue,
            email: chrome.contact.emailValue,
            hours: chrome.contact.hoursValue,
          }}
          socials={SOCIALS}
        />
      </div>
    </div>
  );
}
