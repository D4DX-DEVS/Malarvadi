import MonthlyProgramsListView from "@/components/pages/MonthlyProgramsListView";
import { getMonthlyPrograms } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "മാസത്തെ പരിപാടികൾ • മലർവാടി" };

export default async function MonthlyProgramsPage() {
  const items = await getMonthlyPrograms();
  return <MonthlyProgramsListView items={items} />;
}
