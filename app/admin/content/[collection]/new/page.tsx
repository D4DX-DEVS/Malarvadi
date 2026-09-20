import { notFound } from "next/navigation";
import { COLLECTIONS } from "@/lib/content-registry";
import NewClient from "@/components/admin/NewClient";

export const dynamic = "force-dynamic";

export default function NewDocPage({ params }: { params: { collection: string } }) {
  const def = COLLECTIONS[params.collection];
  if (!def) notFound();
  return <NewClient def={def} />;
}
