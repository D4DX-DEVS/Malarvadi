"use client";
import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, RefreshCw, X } from "lucide-react";
import { api } from "./api";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";

/** Image input: drag & drop / click to upload, preview, or paste a URL. */
export default function ImageField({
  id,
  value,
  onChange,
  onError,
  hint,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  onError: (msg: string) => void;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [broken, setBroken] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await api<{ url: string }>("/api/upload", { method: "POST", body: fd });
      setBroken(false);
      onChange(url);
    } catch (e) {
      onError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  const pick = () => fileRef.current?.click();

  return (
    <>
      <input
        ref={fileRef}
        id={id}
        type="file"
        hidden
        accept={ACCEPT}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void upload(file);
        }}
      />
      {value ? (
        <div className="adm-imgprev">
          {broken ? (
            <span className="adm-row-thumb" style={{ width: 120, height: 80 }}>
              <ImagePlus size={20} />
            </span>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={value} alt="" onError={() => setBroken(true)} />
          )}
          <div className="grow">
            <span className="url" title={value}>{broken ? "Image could not be loaded — check the URL" : value}</span>
            <div className="btns">
              <button type="button" className="adm-btn sm" onClick={pick} disabled={busy}>
                {busy ? <LoaderCircle size={14} className="adm-spin" /> : <RefreshCw size={14} />}
                {busy ? "Uploading…" : "Replace"}
              </button>
              <button type="button" className="adm-btn sm ghostdanger" onClick={() => onChange("")} disabled={busy}>
                <X size={14} /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`adm-drop${over ? " over" : ""}${busy ? " busy" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Upload image"
          onClick={pick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              pick();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void upload(file);
          }}
        >
          <span className="ic">{busy ? <LoaderCircle size={20} className="adm-spin" /> : <ImagePlus size={20} />}</span>
          {busy ? (
            <b>Uploading…</b>
          ) : (
            <span>
              <b>Click to upload</b> or drag and drop
            </span>
          )}
          <span style={{ fontSize: 12 }}>JPG, PNG, WEBP, GIF or SVG · max 8MB</span>
        </div>
      )}
      <input
        className="adm-urlrow"
        id={`${id}-url`}
        type="url"
        value={value}
        placeholder="…or paste an image URL"
        aria-label="Image URL"
        onChange={(e) => {
          setBroken(false);
          onChange(e.target.value);
        }}
      />
      {hint ? <p className="adm-help">{hint}</p> : null}
    </>
  );
}
