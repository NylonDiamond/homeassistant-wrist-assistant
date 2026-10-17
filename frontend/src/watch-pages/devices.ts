// The devices the Watch app's lists and editors name: every watch and, on a
// home that keeps phone pages, every iPhone, with the few facts the lists
// read about each one and the words they put them in.
//
// Pages, status pages and menus live once in the home's library and each
// device picks from it (`library/model.ts`); this module knows nothing of
// the library. It holds the device side the tabs and editors share: the
// device list, "watch" or "iPhone", "A, B and C", the badge naming the other
// devices an item is on, and whether a device waits for its iPhone to move
// its pages here or is on the free plan.

import type { OwnerSummary, WatchConfigRecord } from "../ha-api.js";
import { deviceKindOf } from "../version.js";
import { WAIT_FOR_IPHONE_TEXT, noRecordStart, watchAppDevices, watchName } from "../watch-settings.js";

/** One device as the lists and editors name it. */
export interface LinkDevice {
  ownerId: string;
  /** The name the editor shows for it, "Jesse's iPhone". */
  name: string;
  kind: "watch" | "iphone";
}

/** Every device a page can be on: the Watch app's devices (the watches
 * and, on a home that keeps phone pages, the iPhones), named as the editor
 * names them. */
export function linkDevicesOf(owners: readonly OwnerSummary[], phones: boolean): LinkDevice[] {
  const devices = watchAppDevices(owners, phones);
  return devices.map((o) => ({ ownerId: o.owner_watch_id, name: watchName(o, devices), kind: deviceKindOf(o) === "iphone" ? "iphone" : "watch" }));
}

/** "iPhone" or "watch", as the lines name the device on screen. */
export function deviceWord(kind: LinkDevice["kind"]): string {
  return kind === "iphone" ? "iPhone" : "watch";
}

/** "A, B and C". */
export function joinWords(words: readonly string[]): string {
  if (words.length <= 1) return words[0] ?? "";
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]!}`;
}

/** One switch of a Devices menu: the voice editor's, for a watch's phrases
 * (`watch-voice/links.ts`, drawn by `devices-menu.ts`). */
export interface PageDevicePlace {
  device: LinkDevice;
  /** The phrases are on this device. */
  on: boolean;
  /** This is the device the editor is on. */
  here: boolean;
  /** Why the switch cannot be flipped, or undefined when it can. */
  stuck?: string;
  /** A few words drawn on the switch's row for why, when its title alone
   * would hide them: "waiting for iPhone". */
  tag?: string;
}

/** The small badge on a row for an item on other devices too: "Also on
 * Jesse's iPhone", or "On 3 devices" once there are more than two.
 * Undefined for an item on this device alone. */
export function linkBadgeText(holders: readonly string[], here: string, devices: readonly LinkDevice[]): string | undefined {
  const others = holders.filter((id) => id !== here);
  if (others.length === 0) return undefined;
  if (others.length === 1) {
    const name = devices.find((d) => d.ownerId === others[0])?.name;
    return name === undefined ? "On 2 devices" : `Also on ${name}`;
  }
  return `On ${holders.length} devices`;
}

// ── what a device's own pages record says ─────────────────────────────────
//
// A watch whose iPhone may still move its pages here (`noRecordStart` is
// `wait`) while Home Assistant holds no pages for it cannot take a page from
// the library yet: its page editor waits for that move, and a page put there
// first would make the move skip its pages for good. Home Assistant refuses
// such a pick too (`awaiting_move`). A watch that told Home Assistant it is
// on the free plan (`multiple_pages` false) shows only its first page, so a
// page added there says so.

/** What the panel read of one device's pages record. */
export interface PagesRecordFacts {
  /** Home Assistant holds a pages record for it (revision above 0). */
  held: boolean;
  /** The device said it is on the free plan. */
  free: boolean;
}

/** The facts of one pages record as read. */
export function pagesRecordFacts(record: Pick<WatchConfigRecord, "revision" | "multiple_pages">): PagesRecordFacts {
  return { held: record.revision > 0, free: record.multiple_pages === false };
}

/** A watch that waits for its iPhone, in the page editor's own wait words. */
export const DEVICES_WAIT_TEXT = `${WAIT_FOR_IPHONE_TEXT} Pages can go on this watch after that.`;

/**
 * The watches that wait for their iPhone to move their pages here: the page
 * editor's rule (`noRecordStart` is `wait`) while Home Assistant holds no
 * pages record for them. A device whose record was not read does not wait
 * here; Home Assistant still refuses it if it should.
 */
export function awaitingMove(owners: readonly OwnerSummary[], facts: ReadonlyMap<string, PagesRecordFacts>): Set<string> {
  return new Set(owners
    .filter((o) => facts.get(o.owner_watch_id)?.held === false && noRecordStart(o) === "wait")
    .map((o) => o.owner_watch_id));
}

/** The line after pages went on devices on the free plan: "On the free
 * plan, Jesse's Watch shows only its first page." Undefined for none. */
export function freePlanText(names: readonly string[]): string | undefined {
  if (names.length === 0) return undefined;
  return `On the free plan, ${joinWords(names)} ${names.length === 1 ? "shows only its" : "show only their"} first page.`;
}
