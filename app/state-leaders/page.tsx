import StateLeadersView from "@/components/pages/StateLeadersView";
import { getMentors, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function StateLeadersPage() {
  const [settings, leaders] = await Promise.all([getSettings(), getMentors()]);
  return <StateLeadersView settings={settings} leaders={leaders} />;
}
