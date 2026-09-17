"use client";

import { useEffect, useRef, useState } from "react";
import { IconFileTypePdf, IconPaperclip, IconX } from "@tabler/icons-react";
import {
  ACCEPT,
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  decodedBytes,
  humanSize,
  type Attachment
} from "@/lib/attachments";

/**
 * Up to three photos on a form that posts JSON.
 *
 * Photographs off a phone are four or five megabytes each and three of them
 * would not survive the trip, so an image is drawn into a canvas and re-encoded
 * before it is ever counted: long edge capped, JPEG at a quality that still
 * reads clearly. A five megabyte photo of a van comes out around three hundred
 * kilobytes and says exactly the same thing. PDFs cannot be shrunk, so they are
 * measured as they are and refused if they are too big to carry.
 *
 * Everything is held as base64 in component state and sent with the form, so
 * nothing is stored anywhere until the visitor actually presses send — walk
 * away half way through and there is no orphaned upload to clean up.
 */

/** Long edge, in pixels. Enough to read a sign on a van or text on a screenshot. */
const MAX_EDGE = 1600;
const QUALITY = 0.82;

export type DroppedFile = Attachment & { id: string; bytes: number; preview?: string };

/** Canvas cannot decode every format a phone might hand over (HEIC, mainly). */
async function shrinkImage(file: File): Promise<{ data: string; type: string } | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
    const data = dataUrl.split(",")[1];
    return data ? { data, type: "image/jpeg" } : null;
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function readAsBase64(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result.split(",")[1] : null;
      resolve(result || null);
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

/**
 * Takes what a picker handed over, shrinks the images, checks the limits and
 * returns the list to keep plus the first thing that went wrong.
 *
 * Lives out here because the quote form and the chat both need it and they
 * draw completely different controls around it: one a drop zone with a list,
 * the other a paperclip and a row of thumbnails. The rules must not differ
 * between them.
 */
export async function shrinkForUpload(
  incoming: FileList | null,
  existing: DroppedFile[]
): Promise<{ files: DroppedFile[]; error: string }> {
  if (!incoming || incoming.length === 0) return { files: existing, error: "" };

  const next = [...existing];
  let problem = "";

  for (const file of Array.from(incoming)) {
    if (next.length >= MAX_FILES) {
      problem = `Up to ${MAX_FILES} files.`;
      break;
    }

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      problem = `${file.name} is not an image or a PDF.`;
      continue;
    }

    let data: string | null = null;
    let type = file.type;

    if (isImage) {
      const shrunk = await shrinkImage(file);
      if (shrunk) {
        data = shrunk.data;
        type = shrunk.type;
      } else {
        // Could not be decoded, so it travels as it is if it will fit.
        data = await readAsBase64(file);
      }
    } else {
      data = await readAsBase64(file);
    }

    if (!data) {
      problem = `${file.name} could not be read.`;
      continue;
    }

    const bytes = decodedBytes(data);
    if (bytes > MAX_FILE_BYTES) {
      problem = `${file.name} is too big (${humanSize(bytes)}). Limit is ${humanSize(MAX_FILE_BYTES)} each.`;
      continue;
    }
    if (next.reduce((sum, f) => sum + f.bytes, 0) + bytes > MAX_TOTAL_BYTES) {
      problem = `That would go over ${humanSize(MAX_TOTAL_BYTES)} in total.`;
      continue;
    }

    next.push({
      id: `${file.name}-${file.size}-${Date.now()}-${next.length}`,
      name: file.name,
      type,
      data,
      bytes,
      preview: isImage ? URL.createObjectURL(file) : undefined
    });
  }

  return { files: next, error: problem };
}

export function FileDrop({
  files,
  onChange,
  label,
  hint
}: {
  files: DroppedFile[];
  onChange: (files: DroppedFile[]) => void;
  label: string;
  hint: string;
}) {
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Object URLs for the thumbnails are ours to release.
  useEffect(
    () => () => {
      for (const f of files) if (f.preview) URL.revokeObjectURL(f.preview);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  async function accept(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;
    setError("");
    setBusy(true);
    const { files: next, error: problem } = await shrinkForUpload(incoming, files);
    setBusy(false);
    setError(problem);
    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(id: string) {
    const gone = files.find((f) => f.id === id);
    if (gone?.preview) URL.revokeObjectURL(gone.preview);
    setError("");
    onChange(files.filter((f) => f.id !== id));
  }

  const full = files.length >= MAX_FILES;

  return (
    <div>
      <p className="mb-1.5 text-[13.5px] font-medium text-forest-900">
        {label} <span className="font-normal text-forest-900/55">{hint}</span>
      </p>

      {!full && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            void accept(e.dataTransfer.files);
          }}
          className={`rounded-[10px] border border-dashed transition-colors ${
            over ? "border-ember-500 bg-ember-500/10" : "border-forest-900/25 bg-forest-50"
          }`}
        >
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex w-full flex-col items-center justify-center gap-1.5 px-4 py-5 text-center disabled:opacity-60"
          >
            <IconPaperclip size={20} className="text-forest-900/55" aria-hidden="true" />
            <span className="text-[13.5px] font-semibold text-forest-900">
              {busy ? "Adding…" : "Tap to add a photo, or drop one here"}
            </span>
            <span className="text-[12.5px] text-forest-900/55">
              Images or PDF · up to {MAX_FILES} · {humanSize(MAX_FILE_BYTES)} each
            </span>
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => void accept(e.target.files)}
      />

      {files.length > 0 && (
        <ul className="mt-2.5 grid gap-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 rounded-[10px] border border-forest-900/15 bg-white px-3 py-2"
            >
              {file.preview ? (
                // A local object URL for a file the visitor just picked.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={file.preview} alt="" className="h-10 w-10 shrink-0 rounded-[6px] object-cover" />
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-forest-50 text-forest-900/70">
                  <IconFileTypePdf size={20} aria-hidden="true" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-medium text-forest-900">{file.name}</span>
                <span className="block text-[12.5px] text-forest-900/55">{humanSize(file.bytes)}</span>
              </span>
              <button
                type="button"
                onClick={() => remove(file.id)}
                aria-label={`Remove ${file.name}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-forest-900/55 transition-colors hover:bg-forest-50 hover:text-forest-900"
              >
                <IconX size={17} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-2 text-[12.5px] text-ember-600">{error}</p>}
    </div>
  );
}
