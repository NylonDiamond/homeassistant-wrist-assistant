// What the page editor says after a save, in plain words, one line per way a
// save can end. Kept apart from the element so the words can be tested
// without a browser.

import type { WatchPagesSaveResult } from "./draft.js";

export interface WatchPagesNote {
  kind: "ok" | "warn" | "err";
  text: string;
}

const NO_CONNECTION = "No connection to Home Assistant.";

function stringField(value: unknown, key: string): string | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const field = (value as Record<string, unknown>)[key];
  return typeof field === "string" && field.trim() !== "" ? field.trim() : undefined;
}

/**
 * A refused command's code and words, wherever they sit. Home Assistant's
 * own refusals carry `code` and `message` at the top; a dropped connection
 * rejects with the whole result, `{type, success: false, error: {code,
 * message}}`, whose code is a number. A code here is a string, from either
 * level; the message is the first one found, else the code, else the plain
 * fact that there is no connection.
 */
export function watchCommandError(err: unknown): { code?: string; message: string } {
  if (typeof err === "string" && err.trim() !== "") return { message: err.trim() };
  const inner = typeof err === "object" && err !== null ? (err as { error?: unknown }).error : undefined;
  const code = stringField(err, "code") ?? stringField(inner, "code");
  const message = stringField(err, "message") ?? stringField(inner, "message") ?? code ?? NO_CONNECTION;
  return code === undefined ? { message } : { code, message };
}

export function watchPagesSaveNote(result: WatchPagesSaveResult): WatchPagesNote {
  if (result.ok) {
    if (result.alreadySaved === true) {
      return { kind: "ok", text: `Nothing left to save. The iPhone saved the same changes, as revision ${result.revision}.` };
    }
    return result.merged
      ? { kind: "ok", text: "Saved. Changes from the iPhone were merged in." }
      : { kind: "ok", text: `Saved as revision ${result.revision}.` };
  }
  const message = (result.message ?? "").trim();
  switch (result.code) {
    case "conflict":
      return {
        kind: "warn",
        text: "Not saved. The pages kept changing on the iPhone while saving. Your edits are kept, so try Save again in a moment.",
      };
    case "no_record":
      return {
        kind: "warn",
        text: "Not saved. Home Assistant no longer holds pages for this watch. Open the iPhone app with Edit pages in Home Assistant turned on, then save again.",
      };
    case "invalid": {
      const problems = result.problems ?? [];
      if (problems.length > 0) return { kind: "err", text: `Not saved. Something in the pages is not right: ${problems.join(" ")}` };
      return { kind: "err", text: `Not saved. Home Assistant refused the pages${message === "" ? "." : `: ${message}`}` };
    }
    case "busy":
      return { kind: "warn", text: "Already saving these pages. Wait a moment for that save to finish." };
    case "unavailable":
      return { kind: "warn", text: "Not saved. Home Assistant could not store the pages just now. Your edits are kept, so try again in a moment." };
    default:
      return { kind: "err", text: `Not saved${message === "" ? "." : `: ${message}`}` };
  }
}
