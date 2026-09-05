"use client";

import { useState } from "react";
import { ChatWidget } from "@/components/ChatWidget";
import { QuoteForm } from "@/components/QuoteForm";
import { business } from "@/lib/business";
import type { SiteConfig } from "@/lib/site-config";

type Tab = "chat" | "form";

export function HeroPanel({ config = business, slug }: { config?: SiteConfig; slug?: string }) {
  const [tab, setTab] = useState<Tab>("chat");

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_24px_60px_rgba(18,49,25,0.28)]">
      <div className="grid grid-cols-2 gap-1 bg-[#f3f1eb] p-1.5">
        <TabButton active={tab === "chat"} onClick={() => setTab("chat")}>
          💬 Ask a question
        </TabButton>
        <TabButton active={tab === "form"} onClick={() => setTab("form")}>
          📋 Free quote
        </TabButton>
      </div>

      {tab === "chat" ? (
        <div className="min-h-0 flex-1">
          <ChatWidget frameless config={config} slug={slug} />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <h2 className="text-lg font-bold text-forest-900">Your Free Quote Request</h2>
          <p className="mt-1 text-sm text-forest-900/60">Takes about 30 seconds. We reply the same day.</p>
          <div className="mt-4">
            <QuoteForm compact config={config} slug={slug} />
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[14px] px-4 py-2.5 text-sm font-bold transition ${
        active ? "bg-forest-900 text-white shadow-sm" : "text-forest-900/65 hover:bg-white hover:text-forest-900"
      }`}
    >
      {children}
    </button>
  );
}
