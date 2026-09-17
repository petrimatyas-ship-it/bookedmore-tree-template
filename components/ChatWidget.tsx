"use client";

import { useEffect, useRef, useState } from "react";
import { IconPaperclip, IconX } from "@tabler/icons-react";
import { business } from "@/lib/business";
import type { SiteConfig } from "@/lib/site-config";
import { demoCopy } from "@/lib/demo-copy";
import { shrinkForUpload, type DroppedFile } from "@/components/FileDrop";
import { MAX_FILES } from "@/lib/attachments";

type ChatMessage = { role: "user" | "assistant"; content: string };

/** Replies a demo assistant gives before it makes the pitch instead. */
const DEMO_REPLY_LIMIT = 3;

export function ChatWidget({
  frameless = false,
  config = business,
  slug,
  lockHref = ""
}: {
  frameless?: boolean;
  config?: SiteConfig;
  slug?: string;
  /** Where the assistant's own pitch sends them, once it stops answering. */
  lockHref?: string;
}) {
  const greeting = `Hi! I'm the ${config.companyName} assistant. Tell me what's going on with your tree and I'll help you get an estimate.`;
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  // Only on a demo, and only once it has actually shown what it can do: the
  // greeting does not count, so they always get real answers first.
  const replies = messages.filter((m) => m.role === "assistant").length - 1;
  const spent = Boolean(config.isDemo && lockHref) && replies >= DEMO_REPLY_LIMIT;
  const scrollRef = useRef<HTMLDivElement>(null);
  /* Photos ride with the next message, then clear: the assistant has already
     said what it saw, and re-sending them every turn would grow without end. */
  const [photos, setPhotos] = useState<DroppedFile[]>([]);
  const [photoError, setPhotoError] = useState("");
  const photoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    // A photo on its own is a perfectly good message.
    if ((!text && photos.length === 0) || loading) return;

    const shown = text || `[${photos.length} photo${photos.length === 1 ? "" : "s"}]`;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: shown }];
    const sending = photos;
    setMessages(nextMessages);
    setInput("");
    setPhotos([]);
    setPhotoError("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          slug,
          attachments: sending.map(({ name, type, data }) => ({ name, type, data }))
        })
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
          : "flex h-full w-full flex-col overflow-hidden rounded-[10px] border border-forest-900/10 bg-white shadow-[0_24px_60px_rgba(18,49,25,0.28)]"
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

      {/*
        On a demo the assistant answers a few times and then stops. It is the
        most impressive thing on the page, which makes it the best place to
        show what having it properly is worth — and an owner who has just
        watched it answer as their own business is the easiest sell there is.
      */}
      {spent ? (
        <div className="border-t border-forest-900/8 bg-forest-50 p-4">
          <p className="text-sm font-bold text-forest-900">{demoCopy.assistantLock.title}</p>
          <p className="mt-1.5 text-xs leading-5 text-forest-900/70">{demoCopy.assistantLock.body}</p>
          <a
            href={lockHref}
            data-demo-cta="assistant-lock"
            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl bg-ember-500 px-4 text-sm font-bold text-white transition hover:bg-ember-600"
          >
            {demoCopy.assistantLock.cta}
          </a>
        </div>
      ) : (
        <form onSubmit={sendMessage} className="border-t border-forest-900/8 bg-white p-3">
          {/* Waiting to be sent: thumbnails above the box, each removable. */}
          {photos.length > 0 && (
            <ul className="mb-2 flex flex-wrap gap-2">
              {photos.map((photo) => (
                <li key={photo.id} className="relative">
                  {/* A local object URL for a file just picked. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.preview}
                    alt=""
                    className="h-14 w-14 rounded-[8px] border border-forest-900/15 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotos((list) => list.filter((f) => f.id !== photo.id))}
                    aria-label={`Remove ${photo.name}`}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-forest-900 text-white"
                  >
                    <IconX size={12} stroke={3} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {photoError && <p className="mb-2 text-xs text-ember-600">{photoError}</p>}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => photoInput.current?.click()}
              disabled={loading || photos.length >= MAX_FILES}
              aria-label="Add a photo"
              title="Add a photo of the tree"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-forest-900/15 text-forest-900/70 transition hover:border-forest-600/50 hover:text-forest-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconPaperclip size={18} aria-hidden="true" />
            </button>
            <input
              ref={photoInput}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={async (e) => {
                const { files: picked, error } = await shrinkForUpload(e.target.files, photos);
                setPhotos(picked);
                setPhotoError(error);
                if (photoInput.current) photoInput.current.value = "";
              }}
            />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={photos.length ? "Add a note, or just send" : "Type a message..."}
              /* `min-w-0`, or the row overflows: an input carries an intrinsic
                 minimum width that `flex-1` alone will not shrink past, so once
                 the paperclip joined the row the send button was pushed off the
                 right edge. */
              className="h-11 min-w-0 flex-1 rounded-full border border-forest-900/15 bg-[#f7f6f1] px-4 text-sm text-forest-900 outline-none placeholder:text-forest-900/40 focus:border-forest-600/50"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || (!input.trim() && photos.length === 0)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ember-500 text-white transition hover:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              →
            </button>
          </div>
        </form>
      )}
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
