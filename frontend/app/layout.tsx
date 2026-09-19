import type { Metadata, Viewport } from "next";
import { Baloo_Chettan_2 } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";

const SITE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Malarvadi - Children's Community up to Class 7",
    template: "%s | Malarvadi",
  },
  description: "Malarvadi is a children's community for students up to Class 7 - creativity, values, friendship and nature.",
  icons: {
    // Generated from the official malarvadi.png wordmark: the leading "മ"
    // logomark on the brand cream, cropped straight out of the logo file so
    // the tab icon and the header logo are the same artwork.
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF8E9",
};

/* Every English heading, button and title - the brand's own hand-drawn
   display face. Malayalam text overrides this back to the body face instead
   (see the :lang(ml) rule in globals.css), since this face has no Malayalam
   glyphs of its own. Self-hosted rather than pulled from Google Fonts, so the
   exact family the client supplied is what ships. */
const display = localFont({
  src: "../public/Fonts/FSL-ATHIRA.otf",
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

/* Every paragraph, caption and label - a variable font, so the one file
   covers its whole weight range instead of shipping several static cuts. */
const body = localFont({
  src: "../public/Fonts/NotoSerifMalayalam-VariableFont_wght.ttf",
  weight: "100 900",
  variable: "--font-body",
  display: "swap",
});

/* Header and footer menu only. FSL-ATHIRA has no real Latin letterforms - it
   maps the English alphabet to Malayalam-shaped glyphs - so the English words
   in the nav ("Home", "About Us", ...) render as nonsense in it. This is a
   real Latin webfont in the same playful spirit, used only for that chrome. */
const nav = Baloo_Chettan_2({
  subsets: ["latin"],
  variable: "--font-nav",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${nav.variable}`}>{children}</body>
    </html>
  );
}
