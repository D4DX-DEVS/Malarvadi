"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { CollectionDef } from "@/lib/content-registry";
import { api } from "./api";
import DocForm from "./DocForm";

type Doc = Record<string, unknown> & { _id: string };

export default function EditClient({ def, docId }: { def: CollectionDef; docId: string }) {
  const [doc, setDoc] = useState<Doc | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { item } = await api<{ item: Doc }>(`/api/content/${def.key}/${docId}`);
        setDoc(item);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load this item");
      } finally {
        setLoading(false);
      }
    })();
  }, [def.key, docId]);

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Edit {def.singular.toLowerCase()}</h1>
          <p className="adm-sub">
            <Link href={`/admin/content/${def.key}`}>← Back to {def.label}</Link>
          </p>
        </div>
      </div>
      {error ? <p className="adm-err">{error}</p> : null}
      {loading ? (
        <div className="adm-card adm-empty">Loading…</div>
      ) : doc ? (
        <DocForm def={def} doc={doc} docId={docId} />
      ) : null}
    </>
  );
}
