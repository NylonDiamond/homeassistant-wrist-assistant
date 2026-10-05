// What the voice editor says after a save, one line per way a save can end.
// Kept apart from the element so the words can be tested without a browser.

import type { WatchPagesNote } from "../watch-pages/save-note.js";
import type { WatchVoiceSaveResult } from "./draft.js";

const KEY_NAMES: Readonly<Record<string, string>> = {
  defaultAssistAgentId: "the conversation agent",
  defaultTTSEngine: "the text to speech engine",
  defaultSpeakers: "the speakers",
  phrases: "the phrases",
  watchSpeakReplyInSilentMode: "Speak even in Silent Mode",
  watchSpeechVoiceIdentifier: "the watch voice",
};

/** A top-level key's name in a sentence: "the phrases". */
export function watchVoiceKeyName(key: string): string {
  return KEY_NAMES[key] ?? "a setting this panel does not show";
}

/**
 * The words for settings the iPhone changed while the panel's version of the
 * same setting won the merge: "The iPhone also changed the phrases. Your
 * version replaced it." Empty for none.
 */
export function watchVoiceReplacedText(keys: readonly string[]): string {
  if (keys.length === 0) return "";
  const names = [...new Set(keys.map(watchVoiceKeyName))];
  const list = names.length === 1 ? names[0]! : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]!}`;
  return `The iPhone also changed ${list}. ${names.length === 1 ? "Your version replaced it." : "Your versions replaced them."}`;
}

/** The note after a save, or none: a plain save that went through says
 * nothing, since the toolbar's "Saved just now" already does. */
export function watchVoiceSaveNote(result: WatchVoiceSaveResult): WatchPagesNote | undefined {
  if (result.ok) {
    if (result.alreadySaved === true) {
      return { kind: "ok", text: `Nothing left to save. The iPhone saved the same changes, as revision ${result.revision}.` };
    }
    const replaced = result.replaced ?? [];
    if (replaced.length > 0) return { kind: "warn", text: `Saved. ${watchVoiceReplacedText(replaced)}` };
    return result.merged ? { kind: "ok", text: "Saved. Changes from the iPhone were merged in." } : undefined;
  }
  const message = (result.message ?? "").trim();
  switch (result.code) {
    case "conflict":
      return { kind: "warn", text: "Not saved. The voice settings kept changing on the iPhone while saving. Your edits are kept, so try Save again in a moment." };
    case "no_record":
      return { kind: "warn", text: "Not saved. Home Assistant no longer holds voice settings for this watch. Start with the defaults again, or let the iPhone send its own." };
    case "invalid": {
      const problems = result.problems ?? [];
      if (problems.length > 0) return { kind: "err", text: `Not saved. ${problems.join(" ")}` };
      return { kind: "err", text: `Not saved. Home Assistant refused the voice settings${message === "" ? "." : `: ${message}`}` };
    }
    case "busy":
      return { kind: "warn", text: "Already saving these voice settings. Wait a moment for that save to finish." };
    case "unavailable":
      return { kind: "warn", text: "Not saved. Home Assistant could not store the voice settings just now. Your edits are kept, so try again in a moment." };
    default:
      return { kind: "err", text: `Not saved${message === "" ? "." : `: ${message}`}` };
  }
}
