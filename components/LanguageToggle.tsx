"use client";
import { useEffect, useState } from "react";

/**
 * Malayalam / English switch for the header.
 *
 * English is served by the Google Translate website widget, which reads the
 * `googtrans` cookie. Malayalam is the site's own copy, so the default state is
 * "no cookie, no widget": Google's script is only injected once the reader has
 * asked for English, and clearing the cookie puts the original text back.
 *
 * Anything marked `notranslate` (the header, the footer, the contact page) is
 * left in Malayalam by the widget.
 */
type Lang = "ml" | "en";

const SCRIPT_ID = "google-translate-script";

function currentLang(): Lang {
  const m = typeof document !== "undefined" && document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  return m && decodeURIComponent(m[1]).endsWith("/en") ? "en" : "ml";
}

/** Google reads the cookie from whichever host/domain form it was written to. */
function writeCookie(value: string | null) {
  const host = window.location.hostname;
  const scopes = ["", `;domain=${host}`, `;domain=.${host}`];
  for (const scope of scopes) {
    document.cookie = value
      ? `googtrans=${value};path=/${scope}`
      : `googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT${scope}`;
  }
}

function loadWidget() {
  if (document.getElementById(SCRIPT_ID)) return;
  (window as unknown as Record<string, unknown>).__mvTranslateInit = () => {
    const g = (window as unknown as { google?: { translate?: { TranslateElement: new (o: object, el: string) => void } } }).google;
    if (!g?.translate) return;
    new g.translate.TranslateElement(
      { pageLanguage: "ml", includedLanguages: "en,ml", autoDisplay: false },
      "google_translate_element",
    );
  };
  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.src = "https://translate.google.com/translate_a/element.js?cb=__mvTranslateInit";
  s.async = true;
  document.body.appendChild(s);
}

export default function LanguageToggle() {
  // Render Malayalam-active on the server; the cookie is only readable client side.
  const [lang, setLang] = useState<Lang>("ml");

  useEffect(() => {
    const active = currentLang();
    setLang(active);
    if (active === "en") loadWidget();
  }, []);

  const pick = (next: Lang) => {
    if (next === currentLang()) return;
    writeCookie(next === "en" ? "/ml/en" : null);
    // A reload is what makes the widget pick the cookie up - and what restores
    // the untouched Malayalam markup on the way back.
    window.location.reload();
  };

  return (
    <div className="lang-toggle notranslate" translate="no" role="group" aria-label="Language">
      <button type="button" className={lang === "ml" ? "on" : ""} aria-pressed={lang === "ml"} onClick={() => pick("ml")}>Mal</button>
      <button type="button" className={lang === "en" ? "on" : ""} aria-pressed={lang === "en"} onClick={() => pick("en")}>Eng</button>
      <div id="google_translate_element" aria-hidden />
    </div>
  );
}
