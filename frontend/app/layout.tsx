import type { Metadata, Viewport } from "next";
import { Baloo_Chettan_2, Noto_Sans_Malayalam } from "next/font/google";
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

const display = Baloo_Chettan_2({
  subsets: ["latin", "malayalam"],
  variable: "--font-display",
  display: "swap",
});

const body = Noto_Sans_Malayalam({
  subsets: ["latin", "malayalam"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
