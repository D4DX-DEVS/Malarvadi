"use client";

import { useState } from "react";

/**
 * Pill tab switcher used on the About page, in the reference's style.
 * Panels are rendered on the server and handed in as nodes, so the tab state
 * is the only thing that lives on the client.
 */
export function Tabs({ items, label }: { items: { key: string; label: string; node: React.ReactNode }[]; label: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div role="tablist" aria-label={label} className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {items.map((t, i) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={i === active}
            aria-controls={`panel-${t.key}`}
            onClick={() => setActive(i)}
            className={`min-h-[44px] shrink-0 rounded-full px-5 text-sm font-bold shadow-playful transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf ${
              i === active ? "bg-berry text-white" : "bg-white text-cocoa ring-1 ring-cocoa/15 hover:-translate-y-0.5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {items.map((t, i) => (
        <div
          key={t.key}
          role="tabpanel"
          id={`panel-${t.key}`}
          aria-labelledby={`tab-${t.key}`}
          hidden={i !== active}
          className="mt-6 animate-fade-up"
        >
          {t.node}
        </div>
      ))}
    </div>
  );
}
