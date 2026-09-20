import { notFound } from "next/navigation";
import { COLLECTIONS } from "@/lib/content-registry";
import EditClient from "@/components/admin/EditClient";

export const dynamic = "force-dynamic";

export default function EditDocPage({ params }: { params: { collection: string; id: string } }) {
  const def = COLLECTIONS[params.collection];
  if (!def) notFound();
  return <EditClient def={def} docId={params.id} />;
}
