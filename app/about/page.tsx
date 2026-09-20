import AboutView from "@/components/pages/AboutView";
import { getMentors, getSettings, getTimeline } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [settings, timeline, mentors] = await Promise.all([getSettings(), getTimeline(), getMentors()]);
  return <AboutView settings={settings} timeline={timeline} mentors={mentors} />;
}
