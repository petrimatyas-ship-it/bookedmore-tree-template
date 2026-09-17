import {
  ALLOWED_TYPES,
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  decodedBytes,
  humanSize,
  safeName,
  sniffType,
  type Attachment
} from "@/lib/attachments";

/**
 * The checking half, kept apart from `lib/attachments.ts` on purpose.
 *
 * That file is imported by the picker, which runs in the browser, and holds
 * only limits and pure functions. This one reaches for `Buffer`, so it stays
 * out of the client bundle. Both the quote form's route and the chat's use
 * it, which is the other reason it is not inlined in either.
 */

export type ReadyAttachment = { filename: string; content: string; bytes: number; type: string };

/**
 * Turns what a form or the chat posted into something safe to send on, or
 * says why not.
 *
 * The declared type is treated as a hint and nothing more: what decides is
 * the first few bytes. These go out as attachments on a lead email and, in
 * the chat, on to a model, so the one thing worth being firm about is that
 * something executable cannot travel by calling itself a PNG. Size is
 * checked on the decoded length rather than the base64, because base64 is a
 * third larger and the limit is about the file.
 */
export function prepareAttachments(input: unknown): { files: ReadyAttachment[]; error?: string } {
  if (input === undefined || input === null) return { files: [] };
  if (!Array.isArray(input)) return { files: [], error: "Attachments are malformed." };
  if (input.length > MAX_FILES) return { files: [], error: `Up to ${MAX_FILES} files.` };

  const files: ReadyAttachment[] = [];
  let total = 0;

  for (const raw of input) {
    if (!raw || typeof raw !== "object") return { files: [], error: "Attachments are malformed." };
    const { name, data } = raw as Partial<Attachment>;
    if (typeof data !== "string" || data.length === 0) {
      return { files: [], error: "An attachment arrived empty." };
    }
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(data)) {
      return { files: [], error: "An attachment is not valid base64." };
    }

    const bytes = decodedBytes(data);
    if (bytes > MAX_FILE_BYTES) {
      return { files: [], error: `Each file must be under ${humanSize(MAX_FILE_BYTES)}.` };
    }
    total += bytes;
    if (total > MAX_TOTAL_BYTES) {
      return { files: [], error: `Attachments must come to under ${humanSize(MAX_TOTAL_BYTES)} in total.` };
    }

    // Only the header is decoded: enough to know what it is, and it keeps a
    // deliberately huge payload from being materialised just to be rejected.
    let head: Buffer;
    try {
      head = Buffer.from(data.slice(0, 64), "base64");
    } catch {
      return { files: [], error: "An attachment could not be read." };
    }
    const real = sniffType(new Uint8Array(head));
    if (!real || !ALLOWED_TYPES.includes(real)) {
      return { files: [], error: "Only images and PDFs can be attached." };
    }

    files.push({
      // Named from what it really is, not from what the upload claimed.
      filename: safeName(typeof name === "string" ? name : "", real),
      content: data,
      bytes,
      type: real
    });
  }

  return { files };
}
