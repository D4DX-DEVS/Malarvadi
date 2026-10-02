"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CollectionDef } from "@/lib/content-registry";
import DocForm from "./DocForm";

export default function NewClient({ def }: { def: CollectionDef }) {
  return (
    <>
      <div className="adm-head">
        <div>
          <Link href={`/admin/content/${def.key}`} className="adm-crumb">
            <ArrowLeft size={14} /> {def.label}
          </Link>
          <h1>Create {def.singular.toLowerCase()}</h1>
        </div>
      </div>
      <DocForm def={def} doc={null} />
    </>
  );
}
