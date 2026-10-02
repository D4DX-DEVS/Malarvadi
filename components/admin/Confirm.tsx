"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { LogOut, TriangleAlert, type LucideIcon } from "lucide-react";

export interface ConfirmOptions {
  title: string;
  message?: React.ReactNode;
  /** Shown in a highlighted box under the message, e.g. the item's title. */
  subject?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  icon?: LucideIcon;
}

type Ask = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmCtx = createContext<Ask>(async () => false);

/**
 * Promise-based confirmation dialog used instead of window.confirm():
 *   const confirm = useConfirm();
 *   if (!(await confirm({ title: "Delete?", tone: "danger" }))) return;
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const ask = useCallback<Ask>(
    (o) =>
      new Promise<boolean>((resolve) => {
        resolver.current?.(false);
        resolver.current = resolve;
        setOpts(o);
      }),
    [],
  );

  const close = useCallback((ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = null;
    setOpts(null);
  }, []);

  return (
    <ConfirmCtx.Provider value={ask}>
      {children}
      {opts ? <ConfirmDialog opts={opts} onClose={close} /> : null}
    </ConfirmCtx.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmCtx);

/** Pre-baked dialogs for the common cases. */
export const confirmDelete = (what: string, subject?: string): ConfirmOptions => ({
  title: `Delete ${what}?`,
  message: "This will permanently remove it. This action cannot be undone.",
  subject,
  confirmLabel: "Delete",
  tone: "danger",
});

export const CONFIRM_LOGOUT: ConfirmOptions = {
  title: "Log out?",
  message: "You will need to enter the admin password again to get back in.",
  confirmLabel: "Log out",
  tone: "danger",
  icon: LogOut,
};

function ConfirmDialog({ opts, onClose }: { opts: ConfirmOptions; onClose: (ok: boolean) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const tone = opts.tone ?? "primary";
  const Icon = opts.icon ?? TriangleAlert;

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Destructive dialogs start on Cancel so a stray Enter does no harm.
    box.current?.querySelector<HTMLButtonElement>(tone === "danger" ? "[data-cancel]" : "[data-ok]")?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [tone]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose(false);
    }
    if (e.key === "Tab" && box.current) {
      const btns = Array.from(box.current.querySelectorAll<HTMLButtonElement>("button"));
      const i = btns.indexOf(document.activeElement as HTMLButtonElement);
      e.preventDefault();
      btns[(i + (e.shiftKey ? -1 : 1) + btns.length) % btns.length]?.focus();
    }
  }

  return (
    <div className="adm-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose(false)} onKeyDown={onKeyDown}>
      <div className="adm-modal" role="alertdialog" aria-modal="true" aria-labelledby="adm-confirm-t" aria-describedby="adm-confirm-m" ref={box}>
        <div className={`mic ${tone === "danger" ? "tone-red" : "tone-teal"}`}>
          <Icon size={22} />
        </div>
        <h2 id="adm-confirm-t">{opts.title}</h2>
        {opts.message ? <p id="adm-confirm-m">{opts.message}</p> : null}
        {opts.subject ? <div className="quote ml">{opts.subject}</div> : null}
        <div className="adm-modal-actions">
          <button type="button" className="adm-btn" data-cancel onClick={() => onClose(false)}>
            {opts.cancelLabel ?? "Cancel"}
          </button>
          <button type="button" className={`adm-btn ${tone === "danger" ? "danger" : "primary"}`} data-ok onClick={() => onClose(true)}>
            {opts.confirmLabel ?? "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
