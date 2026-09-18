import { notFound } from "next/navigation";
import { RESOURCES } from "@/lib/admin-resources";
import { ResourceList } from "./ResourceList";

export default async function AdminResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!RESOURCES[resource]) notFound();
  return <ResourceList resource={resource} />;
}
