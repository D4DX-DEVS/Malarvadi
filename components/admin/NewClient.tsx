"use client";
import Link from "next/link";
import type { CollectionDef } from "@/lib/content-registry";
import DocForm from "./DocForm";

export default function NewClient({ def }: { def: CollectionDef }) {
  return (
    <>
      <div className="adm-head">
        <div>
          <h1>New {def.singular.toLowerCase()}</h1>
          <p className="adm-sub">
            <Link href={`/admin/content/${def.key}`}>← Back to {def.label}</Link>
          </p>
        </div>
      </div>
      <DocForm def={def} doc={null} />
    </>
  );
}
