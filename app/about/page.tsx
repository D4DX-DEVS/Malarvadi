import AboutView from "@/components/pages/AboutView";
import { getSettings, getTimeline } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [settings, timeline] = await Promise.all([getSettings(), getTimeline()]);
  return <AboutView settings={settings} timeline={timeline} />;
}
