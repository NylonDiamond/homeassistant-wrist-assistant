// Who saved a complication, and when, in words a person reads.
//
// The store counts saves as revisions and records who wrote each one as
// plumbing (`ha-panel:Jesse`, `app-import:<watch id>`). Both are right for a
// log and wrong for a sentence. The panel says "version" and a time instead,
// and keeps the number for a tooltip, where it still tells two versions
// apart for anyone who needs it.

import { agoWords } from "./send-state.js";

/** Who saved, as a name for a sentence, or undefined when the record does
 * not say. A save from the panel names its user; the app's own writes and
 * Home Assistant's tidying have ids after the prefix that mean nothing to a
 * reader, so they are named for what made them. */
export function saverName(updatedBy: string | null | undefined): string | undefined {
  const by = (updatedBy ?? "").trim();
  if (by.startsWith("ha-panel:")) {
    const name = by.slice("ha-panel:".length).trim();
    return name === "" ? undefined : name;
  }
  if (by === "" || by === "ha-panel") return undefined;
  if (by.startsWith("app-import:") || by.startsWith("watch-restore:")) return "the app";
  if (by === "orphan-sweep" || by.startsWith("forget:") || by.startsWith("device-removed:")) return "Home Assistant";
  return by;
}

/** "by Jesse", or nothing when nobody is named. */
export function savedByWords(updatedBy: string | null | undefined): string {
  const name = saverName(updatedBy);
  return name === undefined ? "" : `by ${name}`;
}

/** How long ago an ISO stamp was, or undefined for one that will not parse. */
export function agoFrom(stamp: string | null | undefined, nowMs: number): string | undefined {
  const at = stamp ? Date.parse(stamp) : Number.NaN;
  return Number.isNaN(at) ? undefined : agoWords(Math.max(0, (nowMs - at) / 1000));
}

/** A saved version's date and time, short: "3 May, 14:02", with the year
 * only when it is not this one. Undefined for a stamp that will not parse. */
export function versionWhen(stamp: string | null | undefined, nowMs: number = Date.now(), locale?: string): string | undefined {
  const at = stamp ? new Date(stamp) : undefined;
  if (at === undefined || Number.isNaN(at.getTime())) return undefined;
  const thisYear = new Date(nowMs).getFullYear() === at.getFullYear();
  const day = at.toLocaleDateString(locale, thisYear ? { day: "numeric", month: "short" } : { day: "numeric", month: "short", year: "numeric" });
  const time = at.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  return `${day}, ${time}`;
}

/** "Version from 3 May, 14:02", or "Version N" when the date is unknown. */
export function versionLabel(revision: number, savedAt: string | null | undefined, nowMs: number = Date.now(), locale?: string): string {
  const when = versionWhen(savedAt, nowMs, locale);
  return when === undefined ? `Version ${revision}` : `Version from ${when}`;
}

/** The note after a restore: "The version from 3 May, 14:02 is back." */
export function restoredText(savedAt: string | null | undefined, nowMs: number = Date.now(), locale?: string): string {
  const when = versionWhen(savedAt, nowMs, locale);
  return when === undefined ? "That version is back." : `The version from ${when} is back.`;
}

/** The first line of the banner a refused save shows: who saved over the
 * work, and when. `current` null means the complication is gone. */
export function conflictText(current: { updatedAt: string; updatedBy: string } | null, nowMs: number = Date.now()): string {
  if (current === null) return "This complication was deleted after you opened it.";
  const name = saverName(current.updatedBy) ?? "Someone";
  const who = name.charAt(0).toUpperCase() + name.slice(1);
  const ago = agoFrom(current.updatedAt, nowMs);
  return `${who} saved this complication${ago === undefined ? "" : ` ${ago}`}, after you opened it.`;
}

/** The editor foot's line for saved work: "Saved 3 min ago by Jesse". */
export function savedLine(updatedAt: string | null | undefined, updatedBy: string | null | undefined, nowMs: number = Date.now()): string {
  const ago = agoFrom(updatedAt, nowMs);
  const by = savedByWords(updatedBy);
  return ["Saved", ago, by].filter((w) => w !== undefined && w !== "").join(" ");
}
