import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProgramDetailView from "@/components/pages/ProgramDetailView";
import { getProgram, getPrograms } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const program = await getProgram(params.slug);
  if (!program) return { title: "പരിപാടി • മലർവാടി" };
  return { title: `${program.title} • മലർവാടി`, description: program.tagline || program.desc };
}

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const [program, all] = await Promise.all([getProgram(params.slug), getPrograms()]);
  if (!program) notFound();
  const others = all.filter((p) => p.slug !== program.slug).slice(0, 3);
  return <ProgramDetailView program={program} others={others} />;
}
