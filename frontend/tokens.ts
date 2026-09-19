/**
 * Malarvadi design-token foundation.
 * Original "Sunny Garden Classroom" tokens - NOT copied from any reference.
 *
 * Core identity colors (leaf / marigold / teal / plum / cream / cocoa) are
 * unchanged. The accent colors below are playful supporting tints used only
 * for decoration, illustration and section rhythm - never for body text.
 */
export const designTokens = {
  colors: {
    leaf: "#2FA36B",
    marigold: "#FFC93C",
    teal: "#2EC4B6",
    plum: "#7C3A8A",
    cream: "#FFF8E9",
    cocoa: "#2B2117",
    /* Playful accents (decor / illustration only) */
    sky: "#5AB6E8",
    blossom: "#F2789F",
    coral: "#FF8A5B",
    lilac: "#B79CE0",
    /* Loud call-to-action pink. Unlike the accents above this one IS used for
       interactive surfaces (Join Us, primary buttons), so it is dark enough to
       carry white text at AA. */
    berry: "#D92B6B",
    /* Page-section washes: the mint sky the hero sits in and the sand band
       under the category strip. */
    mint: "#EAF8EE",
    sand: "#FDF1D6",
    /* Home-page section washes, sampled from the reference sheet: the pale
       yellow news band, the pale blue objectives band, the mint picture panel,
       the grey-blue reach bar and the rose invitation band. */
    butter: "#FFF6DA",
    skySoft: "#E3F1FA",
    mintSoft: "#E6F5E4",
    mist: "#E8F0F7",
    rose: "#FBE3E8",
    /* The footer's deep green and the grass hill that leads into it. */
    forest: "#1F5B3B",
    grass: "#5DBE6E",
    /* Headline accent colors - the multi-color display type. */
    inkBlue: "#1D6FB8",
    inkRed: "#E2365C",
  },
  /**
   * Colors sampled from the official malarvadi.png wordmark. Used for decor
   * that sits next to the logo (header rule, footer trim) so the brand mark
   * and the page read as one system. Never used for body text - these are
   * light tints that would fail contrast.
   */
  logoColors: {
    red: "#EF3D42",
    orange: "#F6974C",
    yellow: "#F5BC31",
    green: "#95B83D",
    cyan: "#10B5D7",
  },
  radius: {
    card: "20px",
    lg: "28px",
    xl: "36px",
    pill: "999px",
  },
  locales: ["en", "ml"] as const,
} as const;

export type AppLocale = (typeof designTokens.locales)[number];
export const DEFAULT_LOCALE: AppLocale = "en";
