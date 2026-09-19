/**
 * Site-wide links that are configuration rather than content: the social
 * profiles the header and footer point at.
 *
 * Each URL comes from the environment (see .env.example), so one build serves
 * staging and production. A profile whose URL is not set still renders its
 * badge - the reference design shows all four - but as an inert mark rather
 * than a link to nowhere.
 */
export interface SocialLink {
  key: string;
  label: string;
  href: string;
  /** Tailwind background for the round badge - each network keeps its own colour. */
  color: string;
  /** 24x24 glyph path. */
  path: string;
}

export const SOCIALS: SocialLink[] = [
  {
    key: "facebook",
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    color: "bg-[#1877F2]",
    path: "M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.5-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.8v3h2.2v8h3.5Z",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    color: "bg-gradient-to-br from-[#F9A03F] via-[#E1306C] to-[#833AB4]",
    path: "M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm5.7-7.6a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5Zm0 1.7A2.8 2.8 0 0 0 5.2 8v8A2.8 2.8 0 0 0 8 18.8h8A2.8 2.8 0 0 0 18.8 16V8A2.8 2.8 0 0 0 16 5.2H8Z",
  },
  {
    key: "youtube",
    label: "YouTube",
    href: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "",
    color: "bg-[#FF0000]",
    path: "M21.6 7.9a2.5 2.5 0 0 0-1.8-1.8C18.2 5.7 12 5.7 12 5.7s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.9 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.1 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.1ZM10 15V9l5.2 3L10 15Z",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "",
    color: "bg-[#25D366]",
    path: "M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3ZM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z",
  },
];

/** The header shows the three the reference draws there; the footer shows all four. */
export const HEADER_SOCIALS = SOCIALS.filter((s) => s.key !== "whatsapp");
