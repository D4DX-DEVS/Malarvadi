import type { Metadata } from "next";
import { MediaLibrary } from "./MediaLibrary";

export const metadata: Metadata = { title: "Admin media library" };

export default function AdminMediaPage() {
  return <MediaLibrary />;
}
