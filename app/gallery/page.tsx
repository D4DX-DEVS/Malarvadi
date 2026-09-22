import GalleryView from "@/components/pages/GalleryView";
import { getGallery, getSettings, getVideos } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function GalleryPage({ searchParams }: { searchParams?: { f?: string } }) {
  const [settings, gallery, videos] = await Promise.all([getSettings(), getGallery(), getVideos()]);
  return <GalleryView settings={settings} gallery={gallery} videos={videos} initialFilter={searchParams?.f || "all"} />;
}
