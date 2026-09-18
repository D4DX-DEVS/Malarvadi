import type { Config } from "tailwindcss";
import { designTokens } from "./tokens";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: designTokens.colors.leaf,
        marigold: designTokens.colors.marigold,
        teal: designTokens.colors.teal,
        plum: designTokens.colors.plum,
        cream: designTokens.colors.cream,
        cocoa: designTokens.colors.cocoa,
        sky: designTokens.colors.sky,
        blossom: designTokens.colors.blossom,
        coral: designTokens.colors.coral,
        lilac: designTokens.colors.lilac,
        berry: designTokens.colors.berry,
        mint: designTokens.colors.mint,
        sand: designTokens.colors.sand,
        "ink-blue": designTokens.colors.inkBlue,
        "ink-red": designTokens.colors.inkRed,
        /* Sampled straight from the malarvadi.png wordmark. */
        logo: {
          red: designTokens.logoColors.red,
          orange: designTokens.logoColors.orange,
          yellow: designTokens.logoColors.yellow,
          green: designTokens.logoColors.green,
          cyan: designTokens.logoColors.cyan,
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: designTokens.radius.card,
        cardLg: designTokens.radius.lg,
        cardXl: designTokens.radius.xl,
        blob: "58% 42% 47% 53% / 46% 52% 48% 54%",
      },
      boxShadow: {
        playful: "0 4px 0 0 rgba(43, 33, 23, 0.12)",
        playfulLg: "0 7px 0 0 rgba(43, 33, 23, 0.14)",
        soft: "0 10px 30px -12px rgba(43, 33, 23, 0.25)",
        lift: "0 18px 38px -18px rgba(43, 33, 23, 0.4)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(10px, -6px)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.6" },
          "50%": { transform: "translateY(-10px)", opacity: "1" },
        },
        /* Gentle side-to-side sway, for kites, balloons and leaves. */
        sway: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        /* Tiny happy wiggle used on hover micro-interactions. */
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-6deg)" },
          "75%": { transform: "rotate(6deg)" },
        },
        /* Twinkling stars and sparkles. */
        twinkle: {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.85)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
        /* Slow drifting clouds across a scene (contained by overflow-hidden). */
        "cloud-cross": {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(115%)" },
        },
        /* Entry pop used for loading + first paint. */
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.9) translateY(10px)" },
          "60%": { opacity: "1", transform: "scale(1.02) translateY(0)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "none" },
        },
        /* Organic blob morph for soft background shapes. */
        blob: {
          "0%, 100%": { borderRadius: "58% 42% 47% 53% / 46% 52% 48% 54%" },
          "50%": { borderRadius: "44% 56% 62% 38% / 56% 44% 56% 44%" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        /* Soft ring that breathes outward from a logo or icon. */
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.55" },
          "70%": { transform: "scale(1.35)", opacity: "0" },
          "100%": { transform: "scale(1.35)", opacity: "0" },
        },
        /* --- Garden vocabulary -------------------------------------- */
        /* A word of the headline dropping into place, like a child placing
           letter blocks on a shelf. */
        "drop-in": {
          "0%": { opacity: "0", transform: "translateY(-16px) rotate(-5deg)" },
          "70%": { opacity: "1", transform: "translateY(2px) rotate(1deg)" },
          "100%": { opacity: "1", transform: "none" },
        },
        /* A seed pushing up out of the soil - timeline dots and empty states. */
        "sprout-grow": {
          "0%": { transform: "scaleY(0.2) translateY(6px)", opacity: "0" },
          "100%": { transform: "scaleY(1) translateY(0)", opacity: "1" },
        },
        /* A petal or leaf drifting down across a section. */
        "petal-fall": {
          "0%": { transform: "translateY(-10%) translateX(0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.75" },
          "90%": { opacity: "0.55" },
          "100%": { transform: "translateY(115%) translateX(26px) rotate(220deg)", opacity: "0" },
        },
        /* A butterfly crossing a band, rising and falling as it goes. */
        "flit-across": {
          "0%": { transform: "translate(-8%, 0) rotate(-6deg)", opacity: "0" },
          "12%": { opacity: "0.8" },
          "50%": { transform: "translate(50%, -22px) rotate(6deg)" },
          "88%": { opacity: "0.8" },
          "100%": { transform: "translate(112%, 4px) rotate(-4deg)", opacity: "0" },
        },
        /* Sun rays turning slowly behind the disc. */
        "ray-turn": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        /* Rainbow arc brightening gently, used in the footer band. */
        "arc-glow": {
          "0%, 100%": { opacity: "0.65", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(-3px)" },
        },
        /* Dashed path that looks like it is being drawn. */
        "dash-draw": {
          "0%": { strokeDashoffset: "40" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        drift: "drift 11s ease-in-out infinite",
        "bounce-soft": "bounce-soft 1.2s ease-in-out infinite",
        sway: "sway 5s ease-in-out infinite",
        "sway-slow": "sway 8s ease-in-out infinite",
        wiggle: "wiggle 0.6s ease-in-out",
        twinkle: "twinkle 3s ease-in-out infinite",
        "cloud-cross": "cloud-cross 38s linear infinite",
        "pop-in": "pop-in 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) both",
        "fade-up": "fade-up 0.5s ease-out both",
        blob: "blob 14s ease-in-out infinite",
        "spin-slow": "spin-slow 26s linear infinite",
        "spin-gentle": "spin-slow 7s linear infinite",
        "dash-draw": "dash-draw 2.4s ease-in-out infinite alternate",
        "drop-in": "drop-in 0.55s cubic-bezier(0.34, 1.4, 0.64, 1) both",
        "sprout-grow": "sprout-grow 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) both",
        "petal-fall": "petal-fall 13s linear infinite",
        "flit-across": "flit-across 19s ease-in-out infinite",
        "ray-turn": "ray-turn 40s linear infinite",
        "arc-glow": "arc-glow 4.5s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.2s cubic-bezier(0.22, 0.85, 0.3, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
