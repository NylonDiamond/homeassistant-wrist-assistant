// The editors' side of the library: what the page, status page and menu
// editors say about the devices an item is on, worked out from the library
// summary (`library/model.ts`) and nothing else.
//
// The words: the tick row's locks, the question an untick asks when it
// clears menu slots or taps and the note it leaves, the badge on a row, the
// line under status pages other devices have too, and the name a menu's
// Duplicate starts with.
// Plan: app repo docs/one_library_plan_2026-10.md, step 3.

import type { LibraryListKind } from "../library/client.js";
import { type Library, devicesFor, sameId } from "../library/model.js";
import { type LinkDevice, joinWords, linkBadgeText } from "./devices.js";
import type { PageRefCount } from "./page-refs.js";
import type { WatchPagesNote } from "./save-note.js";

/** What a list item is called in a sentence. */
function noun(kind: LibraryListKind): string {
  return kind === "status_pages" ? "status page" : "page";
}

/** The devices other than `here` that have an item, as the summary lists
 * them. */
export function otherOwners(lib: Library, kind: LibraryListKind, id: string, here: string): string[] {
  return devicesFor(lib, kind, id).filter((o) => !sameId(o, here));
}

/** Owner ids by name, in device order; a device the editor does not list is
 * "another device" (or "N other devices"). */
export function ownerWords(owners: readonly string[], devices: readonly LinkDevice[]): string[] {
  const known = devices.filter((d) => owners.some((o) => sameId(o, d.ownerId))).map((d) => d.name);
  const unknown = owners.filter((o) => !devices.some((d) => sameId(d.ownerId, o))).length;
  if (unknown === 0) return known;
  return [...known, unknown === 1 ? "another device" : `${unknown} other devices`];
}

/** The badge on a row of an item other devices have too: "Also on Jesse's
 * iPhone", or "On 3 devices". Undefined for one on this device alone, or
 * not in the library yet. */
export function libraryBadgeText(lib: Library | undefined, kind: LibraryListKind, id: string, here: string, devices: readonly LinkDevice[]): string | undefined {
  if (lib === undefined) return undefined;
  const others = otherOwners(lib, kind, id, here);
  if (others.length === 0) return undefined;
  // `linkBadgeText` names a holder by exact id: hand it the ids as the
  // device list spells them.
  const spelled = others.map((o) => devices.find((d) => sameId(d.ownerId, o))?.ownerId ?? o);
  return linkBadgeText([here, ...spelled], here, devices);
}

/** The devices a row's badge draws, one icon each: the other devices that
 * have the item, in device order, then a watch called "another device" for
 * each owner the device list does not know (a device since removed, or one
 * the editor was not told about). Empty where `libraryBadgeText` is
 * undefined. */
export function libraryBadgeDevices(lib: Library | undefined, kind: LibraryListKind, id: string, here: string, devices: readonly LinkDevice[]): LinkDevice[] {
  if (lib === undefined) return [];
  const others = otherOwners(lib, kind, id, here);
  const known = devices.filter((d) => others.some((o) => sameId(o, d.ownerId)));
  const unknown = others
    .filter((o) => !devices.some((d) => sameId(d.ownerId, o)))
    .map((o): LinkDevice => ({ ownerId: o, name: "another device", kind: "watch" }));
  return [...known, ...unknown];
}

/** What a row's device badge needs (`library/link-badge.ts`): the devices,
 * the sentence for its tooltip, and each device's color. */
export interface LinkBadge {
  others: LinkDevice[];
  title: string;
  colorOf: (ownerId: string) => string | undefined;
}

/** The badge of a row of an item other devices have too, or undefined for
 * one on this device alone. One call for the editors' hosts, so a list's
 * row and its tooltip are worked out from the same summary. */
export function libraryLinkBadge(
  lib: Library | undefined,
  kind: LibraryListKind,
  id: string,
  here: string,
  devices: readonly LinkDevice[],
  colorOf: (ownerId: string) => string | undefined,
): LinkBadge | undefined {
  const title = libraryBadgeText(lib, kind, id, here, devices);
  if (title === undefined) return undefined;
  return { others: libraryBadgeDevices(lib, kind, id, here, devices), title, colorOf };
}

/** Why another device's tick cannot be unticked: its editor in this tab
 * holds unsaved edits, whose next save would put the item back. */
export function dirtyElsewhereText(name: string): string {
  return `Save or discard the edits on ${name} first.`;
}

/** What the tick row says for an item not in the library yet (a new page
 * not saved). */
export function unsavedTicksText(kind: LibraryListKind): string {
  return `Save first, then tick a device to put the ${noun(kind)} there too.`;
}

/** What an untick clears, counted: "2 menu slots and 1 complication tap";
 * empty for none. */
export function pageRefWords(count: PageRefCount): string {
  return joinWords([
    count.slots > 0 ? `${count.slots} menu ${count.slots === 1 ? "slot" : "slots"}` : undefined,
    count.taps > 0 ? `${count.taps} complication ${count.taps === 1 ? "tap" : "taps"}` : undefined,
  ].filter((w): w is string => w !== undefined));
}

/**
 * The question an untick asks before it takes an item off a device whose
 * menu slots or complication taps open it, since those are cleared with it
 * and ticking again does not bring them back. `count` undefined: they
 * could not be read, so the question says what may go.
 */
export function untickAskText(kind: LibraryListKind, item: string, device: string, count: PageRefCount | undefined): string {
  const ask = `Take ${item} off ${device}?`;
  if (count === undefined) {
    return kind === "status_pages"
      ? `${ask} Any menu slots that open it there are cleared too.`
      : `${ask} Any menu slots and complication taps that open it there are cleared too.`;
  }
  const one = count.slots + count.taps === 1;
  return `${ask} ${pageRefWords(count)} that ${one ? "opens it is" : "open it are"} cleared too.`;
}

/**
 * What an untick says once it landed: what it cleared on the device, and
 * what it could not (`failed`: "the menus", a complication's quoted name,
 * "the complications"). Undefined when it cleared nothing and nothing
 * failed: the chip says the rest.
 */
export function untickNote(item: string, device: string, cleared: PageRefCount, failed: readonly string[]): WatchPagesNote | undefined {
  const words = pageRefWords(cleared);
  const took = `Took ${item} off ${device}${words === "" ? "" : ` and cleared ${words} that opened it`}.`;
  if (failed.length > 0) {
    return { kind: "warn", text: `${took} Could not clear it from ${joinWords(failed)}: change ${failed.length === 1 ? "that" : "those"} by hand.` };
  }
  return words === "" ? undefined : { kind: "ok", text: took };
}

/** The line under a device's status pages when some are on other devices
 * too: "These status pages are also on Jesse's iPhone. An edit here shows
 * there too." Undefined when none is. */
export function statusSharedText(lib: Library | undefined, here: string, ids: readonly string[], devices: readonly LinkDevice[]): string | undefined {
  if (lib === undefined) return undefined;
  const others = ids.map((id) => otherOwners(lib, "status_pages", id, here));
  const shared = others.filter((o) => o.length > 0).length;
  if (shared === 0) return undefined;
  const owners = new Map<string, string>();
  for (const o of others.flat()) owners.set(o.toUpperCase(), o);
  const which = shared === ids.length
    ? (shared === 1 ? "This status page is" : "These status pages are")
    : `${shared} of these status pages ${shared === 1 ? "is" : "are"}`;
  return `${which} also on ${joinWords(ownerWords([...owners.values()], devices))}. An edit here shows there too.`;
}

/** The name Duplicate gives a device's copy of a menu first. */
export function copyMenuName(deviceName: string): string {
  return `${deviceName}'s menu`;
}
