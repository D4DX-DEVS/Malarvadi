"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import type { CollectionDef } from "@/lib/content-registry";
import { api } from "./api";
import DocForm from "./DocForm";
import { EmptyState } from "./ui";

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
          <Link href={`/admin/content/${def.key}`} className="adm-crumb">
            <ArrowLeft size={14} /> {def.label}
          </Link>
          <h1>Edit {def.singular.toLowerCase()}</h1>
        </div>
      </div>
      {loading ? (
        <div className="adm-editor">
          <div className="adm-card">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <div className="adm-skel" style={{ width: 90, height: 12, marginBottom: 8 }} />
                <div className="adm-skel" style={{ height: i === 3 ? 160 : 40 }} />
              </div>
            ))}
          </div>
          <div className="adm-card">
            <div className="adm-skel" style={{ height: 120 }} />
          </div>
        </div>
      ) : doc ? (
        <DocForm def={def} doc={doc} docId={docId} />
      ) : (
        <div className="adm-card">
          <EmptyState icon={FileText} title="Item not found" text={error || "It may have been deleted."}>
            <Link href={`/admin/content/${def.key}`} className="adm-btn">Back to {def.label}</Link>
          </EmptyState>
        </div>
      )}
    </>
  );
}
