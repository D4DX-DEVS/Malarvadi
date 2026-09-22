"use client";
import { useEffect, useRef, useState } from "react";
import { textToHtml } from "@/lib/richtext";
import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, Quote, Link2, Unlink, Eraser, Pilcrow, type LucideIcon } from "lucide-react";

/**
 * Small dependency-free rich-text editor for the admin.
 *
 * Uses document.execCommand: formally deprecated, but still the only thing every
 * current browser implements for contentEditable, and it keeps the admin free of
 * a heavy editor dependency. Output is sanitised server-side (lib/richtext.ts),
 * so anything execCommand emits that we do not allow is stripped on save.
 */

type Cmd = { cmd: string; arg?: string };

const TOOLS: { key: string; title: string; icon: LucideIcon; run: Cmd; block?: string }[] = [
  { key: "bold", title: "Bold", icon: Bold, run: { cmd: "bold" } },
  { key: "italic", title: "Italic", icon: Italic, run: { cmd: "italic" } },
  { key: "underline", title: "Underline", icon: Underline, run: { cmd: "underline" } },
  { key: "p", title: "Paragraph", icon: Pilcrow, run: { cmd: "formatBlock", arg: "<p>" }, block: "p" },
  { key: "h2", title: "Heading", icon: Heading2, run: { cmd: "formatBlock", arg: "<h2>" }, block: "h2" },
  { key: "h3", title: "Sub-heading", icon: Heading3, run: { cmd: "formatBlock", arg: "<h3>" }, block: "h3" },
  { key: "ul", title: "Bullet list", icon: List, run: { cmd: "insertUnorderedList" } },
  { key: "ol", title: "Numbered list", icon: ListOrdered, run: { cmd: "insertOrderedList" } },
  { key: "quote", title: "Quote", icon: Quote, run: { cmd: "formatBlock", arg: "<blockquote>" }, block: "blockquote" },
];

export default function RichText({ id, value, onChange }: { id: string; value: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});

  // Seeded once. The editor owns its DOM from here on - rewriting innerHTML from
  // a prop on every keystroke would throw the caret to the start of the field.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Bodies written before the editor existed are plain text with blank lines
    // between paragraphs; seed them as HTML or the paragraph breaks collapse.
    el.innerHTML = textToHtml(value);
    try { document.execCommand("defaultParagraphSeparator", false, "p"); } catch { /* not supported, <div> is fine */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => { if (ref.current) onChange(ref.current.innerHTML); };

  const refreshActive = () => {
    const next: Record<string, boolean> = {};
    for (const t of TOOLS) {
      try {
        next[t.key] = t.run.cmd === "formatBlock"
          ? document.queryCommandValue("formatBlock").toLowerCase() === t.block
          : document.queryCommandState(t.run.cmd);
      } catch { next[t.key] = false; }
    }
    setActive(next);
  };

  const run = ({ cmd, arg }: Cmd) => {
    ref.current?.focus();
    try { document.execCommand(cmd, false, arg); } catch { /* ignore */ }
    emit();
    refreshActive();
  };

  const addLink = () => {
    ref.current?.focus();
    const url = window.prompt("Link URL (https://… , mailto:… or /page)");
    if (!url) return;
    run({ cmd: "createLink", arg: url.trim() });
  };

  return (
    <div className="adm-rt">
      <div className="adm-rt-bar" role="toolbar" aria-label="Formatting">
        {TOOLS.map(({ key, title, icon: I, run: r }) => (
          <button
            key={key}
            type="button"
            title={title}
            aria-label={title}
            aria-pressed={!!active[key]}
            className={active[key] ? "on" : ""}
            // Keep the caret in the editor - a focused button would collapse the selection.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run(r)}
          >
            <I size={15} />
          </button>
        ))}
        <span className="adm-rt-sep" />
        <button type="button" title="Add link" aria-label="Add link" onMouseDown={(e) => e.preventDefault()} onClick={addLink}><Link2 size={15} /></button>
        <button type="button" title="Remove link" aria-label="Remove link" onMouseDown={(e) => e.preventDefault()} onClick={() => run({ cmd: "unlink" })}><Unlink size={15} /></button>
        <button type="button" title="Clear formatting" aria-label="Clear formatting" onMouseDown={(e) => e.preventDefault()} onClick={() => run({ cmd: "removeFormat" })}><Eraser size={15} /></button>
      </div>
      <div
        id={id}
        ref={ref}
        className="adm-rt-area"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        onInput={emit}
        onBlur={emit}
        onKeyUp={refreshActive}
        onMouseUp={refreshActive}
        // Paste as plain text: pasting from Word or a web page otherwise drags in
        // fonts, colours and spans that the sanitiser would strip on save anyway.
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          try { document.execCommand("insertText", false, text); } catch { /* ignore */ }
          emit();
        }}
      />
    </div>
  );
}
