"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";

interface Asset {
  _id: string;
  key: string;
  cdnUrl: string;
  mime: string;
  size: number;
}

const FOLDERS = ["events", "news", "gallery", "leaders", "programs", "pages", "publications", "misc"] as const;

export function MediaLibrary() {
  const [items, setItems] = useState<Asset[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const j = await adminApi.list("media", "?limit=48");
      setItems(j.data as Asset[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function upload(file: File, folder: string) {
    setBusy(true);
    setNotice("");
    try {
      const j = (await adminApi.requestUpload({ filename: file.name, mime: file.type, size: file.size, folder })) as {
        data: { key: string; uploadUrl: string; cdnUrl: string };
      };
      const put = await fetch(j.data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!put.ok) throw new Error("Direct upload failed");
      await adminApi.completeUpload({ key: j.data.key, mime: file.type, size: file.size, altEn: file.name });
      setNotice(`Uploaded. CDN URL: ${j.data.cdnUrl || j.data.key}`);
      load();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Media Library</h1>
      <p className="mt-1 text-sm text-cocoa/70">Browser uploads directly to Spaces via presigned URLs — secrets never touch the browser.</p>
      {error ? <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <div className="mt-4 rounded-card bg-white p-5 shadow-playful">
        <label className="text-sm font-bold" htmlFor="media-file">Upload image</label>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            id="media-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f, "misc");
              e.target.value = "";
            }}
          />
        </div>
        {notice ? <p className="mt-2 break-all text-xs text-cocoa/70">{notice}</p> : null}
        <p className="mt-1 text-xs text-cocoa/50">Folders: {FOLDERS.join(", ")} (misc used here; resource uploads use their own folder).</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((a) => (
          <div key={a._id} className="rounded-card bg-white p-3 shadow-playful">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.cdnUrl || a.key} alt={a.key} loading="lazy" className="h-32 w-full rounded-2xl object-cover" />
            <p className="mt-2 break-all text-xs text-cocoa/70">{a.cdnUrl || a.key}</p>
          </div>
        ))}
      </div>
      {!items.length && !error ? <p className="mt-4 rounded-card bg-white p-6 text-center text-sm text-cocoa/60">No media yet.</p> : null}
    </div>
  );
}
