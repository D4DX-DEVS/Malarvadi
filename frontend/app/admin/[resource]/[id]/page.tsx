import { notFound } from "next/navigation";
import { RESOURCES } from "@/lib/admin-resources";
import { ResourceForm } from "../ResourceForm";

export default async function AdminEditPage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!RESOURCES[resource]) notFound();
  return <ResourceForm resource={resource} id={id} />;
}
