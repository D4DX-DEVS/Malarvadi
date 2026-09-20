import ProgramsView from "@/components/pages/ProgramsView";
import { getEvents, getPrograms, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const [settings, programs, events] = await Promise.all([getSettings(), getPrograms(), getEvents()]);
  return <ProgramsView settings={settings} programs={programs} events={events} />;
}
