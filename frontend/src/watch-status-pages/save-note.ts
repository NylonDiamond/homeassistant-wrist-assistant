// What the status page editor says after a save, one line per way a save can
// end. Kept apart from the element so the words can be tested without a
// browser.

import type { WatchPagesNote } from "../watch-pages/save-note.js";
import type { StatusPageClash, StatusPagesSaveResult } from "./draft.js";

/** A page's name in a sentence, quoted; "a status page" with none. */
function named(clash: StatusPageClash): string {
  return clash.name.trim() === "" ? "a status page" : `"${clash.name}"`;
}

/**
 * The words for pages the iPhone changed while the panel changed them too,
 * whose iPhone version stayed: `The iPhone also changed "House". The
 * iPhone's version was kept.` Empty for none.
 */
export function statusPagesKeptText(pages: readonly StatusPageClash[]): string {
  if (pages.length === 0) return "";
  const names = pages.map(named);
  const list = names.length === 1 ? names[0]! : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]!}`;
  return `The iPhone also changed ${list}. ${names.length === 1 ? "The iPhone's version was kept." : "The iPhone's versions were kept."}`;
}

/** The note after a save, or none: a plain save that went through says
 * nothing, since the toolbar's "Saved just now" already does. */
export function statusPagesSaveNote(result: StatusPagesSaveResult): WatchPagesNote | undefined {
  if (result.ok) {
    const kept = result.kept ?? [];
    if (result.alreadySaved === true) {
      const tail = kept.length > 0 ? ` ${statusPagesKeptText(kept)}` : "";
      return { kind: kept.length > 0 ? "warn" : "ok", text: `Nothing left to save. The iPhone saved the same changes, as revision ${result.revision}.${tail}` };
    }
    if (kept.length > 0) return { kind: "warn", text: `Saved. ${statusPagesKeptText(kept)}` };
    return result.merged ? { kind: "ok", text: "Saved. Changes from the iPhone were merged in." } : undefined;
  }
  const message = (result.message ?? "").trim();
  switch (result.code) {
    case "conflict":
      return { kind: "warn", text: "Not saved. The status pages kept changing on the iPhone while saving. Your edits are kept, so try Save again in a moment." };
    case "no_record":
      return { kind: "warn", text: "Not saved. Home Assistant no longer holds status pages for this watch. Start with the defaults again, or let the iPhone send its status pages." };
    case "invalid": {
      const problems = result.problems ?? [];
      if (problems.length > 0) return { kind: "err", text: `Not saved. Something in the status pages is not right: ${problems.join(" ")}` };
      return { kind: "err", text: `Not saved. Home Assistant refused the status pages${message === "" ? "." : `: ${message}`}` };
    }
    case "busy":
      return { kind: "warn", text: "Already saving these status pages. Wait a moment for that save to finish." };
    case "unavailable":
      return { kind: "warn", text: "Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment." };
    default:
      return { kind: "err", text: `Not saved${message === "" ? "." : `: ${message}`}` };
  }
}
