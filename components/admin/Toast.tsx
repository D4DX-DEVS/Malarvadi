"use client";
import { useCallback, useRef, useState } from "react";

export interface ToastState {
  message: string;
  bad?: boolean;
}

/** Tiny bottom-right toast. `show(msg)` / `show(msg, true)` for errors. */
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, bad = false) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, bad });
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const node = toast ? <div className={`adm-toast${toast.bad ? " bad" : ""}`}>{toast.message}</div> : null;
  return { show, toast: node };
}
