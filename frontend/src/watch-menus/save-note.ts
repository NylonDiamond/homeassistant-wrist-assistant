// What the menu editor says after a save, one line per way a save can end.
// Kept apart from the element so the words can be tested without a browser.

import { NOT_FOR_IPHONE_TEXT, type WatchPagesNote } from "../watch-pages/save-note.js";
import type { WatchMenusSaveResult } from "./draft.js";
import { type WatchMenusSection, watchMenusSectionName } from "./model.js";

/**
 * The words for sections another save changed while the panel's version of the
 * same section won the merge: "Another save also changed the Anywhere menu.
 * Your version replaced it." Empty for none.
 */
export function watchMenusReplacedText(sections: readonly WatchMenusSection[]): string {
  if (sections.length === 0) return "";
  const names = sections.map((s) => watchMenusSectionName(s));
  const list = names.length === 1 ? names[0]! : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]!}`;
  return `Another save also changed ${list}. ${names.length === 1 ? "Your version replaced it." : "Your versions replaced them."}`;
}

/** The note after a save, or none: a plain save that went through says
 * nothing, since the toolbar's "Saved just now" already does. */
export function watchMenusSaveNote(result: WatchMenusSaveResult): WatchPagesNote | undefined {
  if (result.ok) {
    if (result.alreadySaved === true) {
      return { kind: "ok", text: `Nothing left to save. The same changes were saved somewhere else, as revision ${result.revision}.` };
    }
    const replaced = result.replaced ?? [];
    if (replaced.length > 0) return { kind: "warn", text: `Saved. ${watchMenusReplacedText(replaced)}` };
    return result.merged ? { kind: "ok", text: "Saved. Changes made somewhere else were merged in." } : undefined;
  }
  const message = (result.message ?? "").trim();
  switch (result.code) {
    case "conflict":
      return { kind: "warn", text: "Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment." };
    case "no_record":
      return { kind: "warn", text: "Not saved. Home Assistant no longer holds menus for this watch. Start with the defaults again." };
    case "invalid": {
      const problems = result.problems ?? [];
      if (problems.length > 0) return { kind: "err", text: `Not saved. Something in the menus is not right: ${problems.join(" ")}` };
      return { kind: "err", text: `Not saved. Home Assistant refused the menus${message === "" ? "." : `: ${message}`}` };
    }
    case "not_for_iphone":
      return { kind: "err", text: `Not saved. ${NOT_FOR_IPHONE_TEXT}` };
    case "busy":
      return { kind: "warn", text: "Already saving these menus. Wait a moment for that save to finish." };
    case "unavailable":
      return { kind: "warn", text: "Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment." };
    default:
      return { kind: "err", text: `Not saved${message === "" ? "." : `: ${message}`}` };
  }
}
