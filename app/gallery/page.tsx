import GalleryView from "@/components/pages/GalleryView";
import { getGallery, getPosters, getSettings, getVideos } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function GalleryPage({ searchParams }: { searchParams?: { f?: string } }) {
  const [settings, gallery, videos, posters] = await Promise.all([getSettings(), getGallery(), getVideos(), getPosters()]);
  return <GalleryView settings={settings} gallery={gallery} videos={videos} posters={posters} initialFilter={searchParams?.f || "all"} />;
}
