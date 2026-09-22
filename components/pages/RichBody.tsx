import { isHtml } from "@/lib/richtext";
import { paragraphs } from "./format";

/**
 * Renders a long-form body field.
 *
 * Rich-text fields are stored as HTML, but everything written before the editor
 * existed is plain text with blank lines between paragraphs - so fall back to the
 * paragraph splitter when the value has no markup. The HTML was sanitised by
 * validateDoc on the way in; nothing here is user-submitted.
 */
export default function RichBody({ body, className }: { body?: string; className?: string }) {
  if (!body) return null;
  if (isHtml(body)) {
    return <div className={className ? `rich ${className}` : "rich"} dangerouslySetInnerHTML={{ __html: body }} />;
  }
  const paras = paragraphs(body);
  if (!paras.length) return null;
  return (
    <div className={className ? `rich ${className}` : "rich"}>
      {paras.map((para, i) => <p key={i}>{para}</p>)}
    </div>
  );
}
