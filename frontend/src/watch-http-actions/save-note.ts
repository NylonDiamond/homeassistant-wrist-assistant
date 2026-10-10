// What the HTTP actions screen says after a save, one line per way a save
// can end. Kept apart from the element so the words can be tested without a
// browser.

import { NOT_FOR_IPHONE_TEXT, type WatchPagesNote } from "../watch-pages/save-note.js";
import type { HttpActionsSaveResult } from "./draft.js";
import type { HttpActionsClash } from "./merge.js";

function named(clash: HttpActionsClash): string {
  if (clash.list === "global") return clash.name.trim() === "" ? `{{${clash.key}}}` : clash.name;
  return `"${clash.name.trim() === "" ? "an untitled action" : clash.name}"`;
}

/**
 * The words for what changed somewhere else while it changed here too,
 * whose copy from here stayed: `"Doorbell" also changed somewhere else.
 * Your version was kept.` Empty for none.
 */
export function httpActionsKeptText(clashes: readonly HttpActionsClash[]): string {
  if (clashes.length === 0) return "";
  const names = clashes.map(named);
  const list = names.length === 1 ? names[0]! : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]!}`;
  return `${list} also changed somewhere else. ${names.length === 1 ? "Your version was kept." : "Your versions were kept."}`;
}

/** The note after a save, or none: a plain save that went through says
 * nothing, since the bar's "Saved just now" already does. */
export function httpActionsSaveNote(result: HttpActionsSaveResult): WatchPagesNote | undefined {
  if (result.ok) {
    const kept = result.kept ?? [];
    if (result.alreadySaved === true) {
      const tail = kept.length > 0 ? ` ${httpActionsKeptText(kept)}` : "";
      return { kind: kept.length > 0 ? "warn" : "ok", text: `Nothing left to save. The same changes were saved somewhere else, as revision ${result.revision}.${tail}` };
    }
    if (kept.length > 0) return { kind: "warn", text: `Saved. ${httpActionsKeptText(kept)}` };
    return result.merged ? { kind: "ok", text: "Saved. Changes made somewhere else were merged in." } : undefined;
  }
  const message = (result.message ?? "").trim();
  switch (result.code) {
    case "conflict":
      return { kind: "warn", text: "Not saved. The HTTP actions kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment." };
    case "invalid": {
      const problems = result.problems ?? [];
      if (problems.length > 0) return { kind: "err", text: `Not saved. ${problems.join(" ")}` };
      return { kind: "err", text: `Not saved. Home Assistant refused the HTTP actions${message === "" ? "." : `: ${message}`}` };
    }
    case "not_for_iphone":
      return { kind: "err", text: `Not saved. ${NOT_FOR_IPHONE_TEXT}` };
    case "busy":
      return { kind: "warn", text: "Already saving. Wait a moment for that save to finish." };
    case "unavailable":
      return { kind: "warn", text: "Not saved. Home Assistant could not store the HTTP actions just now. Your edits are kept, so try again in a moment." };
    case "unknown_command":
      return { kind: "err", text: "Not saved. Update the integration to edit HTTP actions here." };
    default:
      return { kind: "err", text: `Not saved${message === "" ? "." : `: ${message}`}` };
  }
}
