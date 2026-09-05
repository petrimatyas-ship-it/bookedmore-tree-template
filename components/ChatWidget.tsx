"use client";

import { useEffect, useRef, useState } from "react";
import { business } from "@/lib/business";
import type { SiteConfig } from "@/lib/site-config";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function ChatWidget({
  frameless = false,
  config = business,
  slug
}: {
  frameless?: boolean;
  config?: SiteConfig;
  slug?: string;
}) {
  const greeting = `Hi! I'm the ${config.companyName} assistant. Tell me what's going on with your tree and I'll help you get an estimate.`;
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, slug })
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Something went wrong. Please call us instead." }
        ]);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (data.leadCaptured) setLeadCaptured(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Something went wrong. Please call us at ${config.phone} instead.` }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={
        frameless
          ? "flex h-full w-full flex-col overflow-hidden bg-white"
          : "flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-forest-900/10 bg-white shadow-[0_24px_60px_rgba(18,49,25,0.28)]"
      }
    >
      <div className="flex items-center gap-3 border-b border-forest-900/8 bg-forest-900 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg" aria-hidden="true">
          🌳
        </span>
        <div>
          <p className="text-sm font-bold text-white">{config.companyName} Assistant</p>
          <p className="text-xs text-white/65">Usually replies in seconds</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={
                message.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-ember-500 px-4 py-2.5 text-sm font-medium text-white"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm bg-[#f3f1eb] px-4 py-2.5 text-sm leading-6 text-forest-900"
              }
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-[#f3f1eb] px-4 py-3">
              <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
            </div>
          </div>
        )}
        {leadCaptured && (
          <p className="rounded-xl bg-forest-50 px-4 py-2.5 text-xs font-semibold text-forest-700">
            Got your details. We&apos;ll be in touch shortly.
          </p>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-forest-900/8 bg-white p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="h-11 flex-1 rounded-full border border-forest-900/15 bg-[#f7f6f1] px-4 text-sm text-forest-900 outline-none placeholder:text-forest-900/40 focus:border-forest-600/50"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ember-500 text-white transition hover:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          →
        </button>
      </form>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest-900/40"
      style={{ animationDelay: delay }}
      aria-hidden="true"
    />
  );
}
