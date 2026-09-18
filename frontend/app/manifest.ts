import type { MetadataRoute } from "next";

/** PWA / install metadata. Icons are the logomark cut from malarvadi.png. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Malarvadi - Children's Community",
    short_name: "Malarvadi",
    description: "A children's community for students up to Class 7 - creativity, values, friendship and nature.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8E9",
    theme_color: "#FFF8E9",
    icons: [
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "maskable" },
    ],
  };
}
