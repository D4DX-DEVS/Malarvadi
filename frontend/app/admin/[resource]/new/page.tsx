import { notFound } from "next/navigation";
import { RESOURCES } from "@/lib/admin-resources";
import { ResourceForm } from "../ResourceForm";

export default async function AdminNewPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!RESOURCES[resource]) notFound();
  return <ResourceForm resource={resource} />;
}
