import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MonthlyProgramDetailView from "@/components/pages/MonthlyProgramDetailView";
import { getMonthlyProgram, getMonthlyPrograms } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getMonthlyProgram(params.slug);
  if (!item) return { title: "മാസത്തെ പരിപാടി • മലർവാടി" };
  return { title: `${item.title} • മലർവാടി`, description: item.desc.slice(0, 160) };
}

export default async function MonthlyProgramPage({ params }: { params: { slug: string } }) {
  const [item, all] = await Promise.all([getMonthlyProgram(params.slug), getMonthlyPrograms()]);
  if (!item) notFound();
  const others = all.filter((p) => p.slug && p.slug !== item.slug).slice(0, 3);
  return <MonthlyProgramDetailView item={item} others={others} />;
}
