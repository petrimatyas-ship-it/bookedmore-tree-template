"use client";

import { OPEN_PANEL_EVENT } from "@/components/Header";
import type { PanelTab } from "@/components/HeroPanel";

/** Opens the phone chat/quote sheet that the header owns. */
export function OpenPanelButton({
  tab,
  className = "",
  children
}: {
  tab: PanelTab;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_PANEL_EVENT, { detail: tab }))}
      className={`inline-flex h-12 items-center justify-center rounded-2xl px-3 text-[15px] font-bold transition ${className}`}
    >
      {children}
    </button>
  );
}
