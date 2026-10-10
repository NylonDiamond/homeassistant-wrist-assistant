// What the Control Center editor says after a save, one line per way a save
// can end. Kept apart from the element so the words can be tested without a
// browser.

import { NOT_FOR_IPHONE_TEXT, type WatchPagesNote } from "../watch-pages/save-note.js";
import type { ControlCenterSaveResult } from "./draft.js";
import type { ControlCenterClash } from "./merge.js";

/** An entry's name in a sentence, quoted; its entity id with no name. */
function named(clash: ControlCenterClash): string {
  return `"${clash.name.trim() === "" ? clash.entityId : clash.name}"`;
}

/**
 * The words for entries another save changed while the panel changed them too,
 * whose copy from here stayed: `Another save also changed "Kitchen". Your
 * version was kept.` Empty for none.
 */
export function controlCenterKeptText(entries: readonly ControlCenterClash[]): string {
  if (entries.length === 0) return "";
  const names = entries.map(named);
  const list = names.length === 1 ? names[0]! : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]!}`;
  return `Another save also changed ${list}. ${names.length === 1 ? "Your version was kept." : "Your versions were kept."}`;
}

/** The note after a save, or none: a plain save that went through says
 * nothing, since the toolbar's "Saved just now" already does. */
export function controlCenterSaveNote(result: ControlCenterSaveResult): WatchPagesNote | undefined {
  if (result.ok) {
    const kept = result.kept ?? [];
    if (result.alreadySaved === true) {
      const tail = kept.length > 0 ? ` ${controlCenterKeptText(kept)}` : "";
      return { kind: kept.length > 0 ? "warn" : "ok", text: `Nothing left to save. The same changes were saved somewhere else, as revision ${result.revision}.${tail}` };
    }
    if (kept.length > 0) return { kind: "warn", text: `Saved. ${controlCenterKeptText(kept)}` };
    return result.merged ? { kind: "ok", text: "Saved. Changes made somewhere else were merged in." } : undefined;
  }
  const message = (result.message ?? "").trim();
  switch (result.code) {
    case "conflict":
      return { kind: "warn", text: "Not saved. The Control Center list kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment." };
    case "no_record":
      return { kind: "warn", text: "Not saved. Home Assistant no longer holds a Control Center list for this watch. Start with an empty list again." };
    case "invalid": {
      const problems = result.problems ?? [];
      if (problems.length > 0) return { kind: "err", text: `Not saved. Something in the Control Center list is not right: ${problems.join(" ")}` };
      return { kind: "err", text: `Not saved. Home Assistant refused the Control Center list${message === "" ? "." : `: ${message}`}` };
    }
    case "not_for_iphone":
      return { kind: "err", text: `Not saved. ${NOT_FOR_IPHONE_TEXT}` };
    case "busy":
      return { kind: "warn", text: "Already saving this Control Center list. Wait a moment for that save to finish." };
    case "unavailable":
      return { kind: "warn", text: "Not saved. Home Assistant could not store the Control Center list just now. Your edits are kept, so try again in a moment." };
    default:
      return { kind: "err", text: `Not saved${message === "" ? "." : `: ${message}`}` };
  }
}
