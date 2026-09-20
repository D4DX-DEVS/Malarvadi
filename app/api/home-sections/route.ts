import type { AnyBulkWriteOperation, Document, ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { getHomeSections } from "@/lib/queries";
import { HOME_SECTION_DEFS } from "@/lib/content-registry";
import { err, json, readJson, requireAdmin, revalidateAll } from "@/lib/api";

export const dynamic = "force-dynamic";

const KNOWN = new Set(HOME_SECTION_DEFS.map((d) => d.key));

export async function GET() {
  return json({ sections: await getHomeSections() });
}

export async function PUT(req: Request) {
  const unauth = requireAdmin();
  if (unauth) return unauth;

  const body = await readJson(req);
  const sections = body?.sections;
  if (!Array.isArray(sections)) return err("sections must be an array");

  const ops: AnyBulkWriteOperation<Document>[] = [];
  for (const raw of sections) {
    if (!raw || typeof raw !== "object") return err("Each section must be an object");
    const s = raw as Record<string, unknown>;
    const key = String(s.key ?? "");
    if (!KNOWN.has(key)) return err(`Unknown home section "${key}"`);
    ops.push({
      updateOne: {
        filter: { _id: key as unknown as ObjectId },
        update: {
          $set: {
            key,
            enabled: s.enabled === undefined ? true : s.enabled !== false && s.enabled !== "false",
            order: Number(s.order ?? 0) || 0,
            title: s.title == null ? "" : String(s.title),
            subtitle: s.subtitle == null ? "" : String(s.subtitle),
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    });
  }

  if (ops.length) {
    const db = await getDb();
    await db.collection("homeSections").bulkWrite(ops);
  }
  revalidateAll();
  return json({ sections: await getHomeSections() });
}
