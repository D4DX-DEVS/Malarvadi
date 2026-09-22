import ProgramsView from "@/components/pages/ProgramsView";
import { getPrograms, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const [settings, programs] = await Promise.all([getSettings(), getPrograms()]);
  return <ProgramsView settings={settings} programs={programs} />;
}
