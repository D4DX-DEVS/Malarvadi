"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Check, TriangleAlert } from "lucide-react";

type Show = (message: string, bad?: boolean) => void;

const ToastCtx = createContext<Show>(() => {});

/** Bottom-right toasts. `const toast = useToast(); toast("Saved")` / `toast(msg, true)` for errors. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<{ id: number; message: string; bad: boolean }[]>([]);
  const seq = useRef(0);

  const show = useCallback<Show>((message, bad = false) => {
    const id = ++seq.current;
    setItems((p) => [...p.slice(-2), { id, message, bad }]);
    setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), bad ? 5000 : 3000);
  }, []);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="adm-toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`adm-toast${t.bad ? " bad" : ""}`}>
            <span className="ti">{t.bad ? <TriangleAlert size={14} /> : <Check size={14} />}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
