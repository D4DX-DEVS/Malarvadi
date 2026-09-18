import Image from "next/image";
import logo from "@/public/malarvadi.png";

/**
 * The official Malarvadi wordmark. Single source of truth so the header,
 * the footer and the generated favicons all show the same artwork.
 * Callers set the height (e.g. `h-9 w-auto`); the aspect ratio comes from
 * the static import.
 */
export function Logo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src={logo}
      alt="Malarvadi"
      priority={priority}
      className={`w-auto select-none ${className}`}
    />
  );
}
