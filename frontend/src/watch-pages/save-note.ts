// What the page editor says after a save, in plain words, one line per way a
// save can end. Kept apart from the element so the words can be tested
// without a browser.

import type { WatchConfigLinkFailure, WatchConfigTemplateBudget } from "../ha-api.js";
import { type SettingDevice, deviceNoun } from "../watch-settings.js";
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

/** What `not_for_iphone` means: Home Assistant refused to give an iPhone a
 * record or a setting only a watch keeps (phone pages, `phone-pages.ts`). */
export const NOT_FOR_IPHONE_TEXT = "An iPhone keeps only its own pages, status pages, menus, rooms and settings, so Home Assistant did not take this.";

/**
 * A refused command's code and words, wherever they sit. Home Assistant's
 * own refusals carry `code` and `message` at the top; a dropped connection
 * rejects with the whole result, `{type, success: false, error: {code,
 * message}}`, whose code is a number. A code here is a string, from either
 * level; the message is the first one found, else the code, else the plain
 * fact that there is no connection. `not_for_iphone` always reads as
 * `NOT_FOR_IPHONE_TEXT`, whatever the server said, so every "Could not ..."
 * line built from the message says it in plain words.
 */
export function watchCommandError(err: unknown): { code?: string; message: string } {
  if (typeof err === "string" && err.trim() !== "") return { message: err.trim() };
  const inner = typeof err === "object" && err !== null ? (err as { error?: unknown }).error : undefined;
  const code = stringField(err, "code") ?? stringField(inner, "code");
  if (code === "not_for_iphone") return { code, message: NOT_FOR_IPHONE_TEXT };
  const message = stringField(err, "message") ?? stringField(inner, "message") ?? code ?? NO_CONNECTION;
  return code === undefined ? { message } : { code, message };
}

/** The devices a save's reply says kept the old version of their linked
 * copies (`link_failures`). A missing or malformed list is none, and an
 * entry with no name is named by its device id. */
export function linkFailuresOf(reply: unknown): WatchConfigLinkFailure[] {
  const list = typeof reply === "object" && reply !== null ? (reply as { link_failures?: unknown }).link_failures : undefined;
  if (!Array.isArray(list)) return [];
  return list.flatMap((item): WatchConfigLinkFailure[] => {
    const owner = stringField(item, "owner");
    if (owner === undefined) return [];
    return [{ owner, name: stringField(item, "name") ?? owner }];
  });
}

/** A pages save's template count (`template_budget`), or undefined for a
 * reply without one (an older integration) or one that cannot be read. */
export function templateBudgetOf(reply: unknown): WatchConfigTemplateBudget | undefined {
  const raw = typeof reply === "object" && reply !== null ? (reply as { template_budget?: unknown }).template_budget : undefined;
  if (typeof raw !== "object" || raw === null) return undefined;
  const { used, limit, scope } = raw as { used?: unknown; limit?: unknown; scope?: unknown };
  if (typeof used !== "number" || !Number.isFinite(used) || typeof limit !== "number" || !(limit > 0)) return undefined;
  return { used, limit, scope: scope === "page" ? "page" : "device" };
}

/** What a save says when the pages ask a device for more templates than a
 * delta poll takes: the tiles past the limit draw plain. Undefined within
 * it. */
export function templateBudgetText(budget: WatchConfigTemplateBudget | undefined): string | undefined {
  if (budget === undefined || budget.used <= budget.limit) return undefined;
  const subject = budget.scope === "page" ? "This page asks" : "These pages ask";
  return `${subject} for ${budget.used} templates and a device takes ${budget.limit}, so the tiles past that show their plain look.`;
}

/** What a save of a shared kind calls what it saved: the library's pages,
 * status pages and menus, or a watch's linked phrases. */
export type LinkedNoun = "pages" | "status pages" | "menus" | "phrases";

/** What a save that left other devices behind says after "Saved.": "Jesse's
 * iPhone kept the old version: Home Assistant could not update the shared
 * pages there." Undefined for none. `noun` is what was saved. */
export function linkFailuresText(failures: readonly WatchConfigLinkFailure[], noun: LinkedNoun): string | undefined {
  const names = failures.map((f) => f.name);
  if (names.length === 0) return undefined;
  const list = names.length === 1 ? names[0]! : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]!}`;
  return `${list} kept the old version: Home Assistant could not update the shared ${noun} there.`;
}

/** A save's note with the devices that kept the old version added: a
 * warning, after the note's own words or after "Saved.". */
export function withLinkFailures(
  note: WatchPagesNote | undefined,
  failures: readonly WatchConfigLinkFailure[] | undefined,
  noun: LinkedNoun,
): WatchPagesNote | undefined {
  const text = linkFailuresText(failures ?? [], noun);
  if (text === undefined) return note;
  return { kind: note?.kind === "err" ? "err" : "warn", text: `${note === undefined ? "Saved." : note.text} ${text}` };
}

/** The note after a save, or none: a plain save that went through says
 * nothing, since the toolbar's "Saved just now" already does. A note is
 * there only when it tells something more. `device` is the device whose
 * pages these are. */
export function watchPagesSaveNote(result: WatchPagesSaveResult, device: SettingDevice = "watch"): WatchPagesNote | undefined {
  if (result.ok) {
    if (result.alreadySaved === true) {
      return { kind: "ok", text: `Nothing left to save. The same changes were saved somewhere else, as revision ${result.revision}.` };
    }
    const note: WatchPagesNote | undefined = result.merged ? { kind: "ok", text: "Saved. Changes made somewhere else were merged in." } : undefined;
    const linked = withLinkFailures(note, result.linkFailures, "pages");
    const budget = templateBudgetText(result.templateBudget);
    if (budget === undefined) return linked;
    return { kind: linked?.kind === "err" ? "err" : "warn", text: `${linked === undefined ? "Saved." : linked.text} ${budget}` };
  }
  const message = (result.message ?? "").trim();
  switch (result.code) {
    case "conflict":
      return {
        kind: "warn",
        text: "Not saved. The pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment.",
      };
    case "no_record":
      return {
        kind: "warn",
        text: `Not saved. Home Assistant no longer holds pages for this ${deviceNoun(device)}.`,
      };
    case "invalid": {
      const problems = result.problems ?? [];
      if (problems.length > 0) return { kind: "err", text: `Not saved. Something in the pages is not right: ${problems.join(" ")}` };
      return { kind: "err", text: `Not saved. Home Assistant refused the pages${message === "" ? "." : `: ${message}`}` };
    }
    case "not_for_iphone":
      return { kind: "err", text: `Not saved. ${NOT_FOR_IPHONE_TEXT}` };
    case "busy":
      return { kind: "warn", text: "Already saving these pages. Wait a moment for that save to finish." };
    case "unavailable":
      return { kind: "warn", text: "Not saved. Home Assistant could not store the pages just now. Your edits are kept, so try again in a moment." };
    default:
      return { kind: "err", text: `Not saved${message === "" ? "." : `: ${message}`}` };
  }
}
