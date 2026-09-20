import HomePage from "@/components/home/HomePage";
import { getHomeData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getHomeData();
  return <HomePage data={data} />;
}
