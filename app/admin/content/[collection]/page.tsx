import { notFound } from "next/navigation";
import { COLLECTIONS } from "@/lib/content-registry";
import ListClient from "@/components/admin/ListClient";

export const dynamic = "force-dynamic";

export default function CollectionListPage({ params }: { params: { collection: string } }) {
  const def = COLLECTIONS[params.collection];
  if (!def) notFound();
  return <ListClient def={def} />;
}
