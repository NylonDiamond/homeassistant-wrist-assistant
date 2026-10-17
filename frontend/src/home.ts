// Home, the panel's front page: what it lists and how it looks. The drawing
// itself is `renderHome` in panel.ts, which owns the state it reads; what can
// be worked out without the panel lives here, where a test can reach it.

import { css } from "lit";
import { litOutline } from "./editor-chrome.js";
import type { OwnerSummary, WatchConfigSummary } from "./ha-api.js";
import type { Person } from "./people.js";
import { type DeviceSync, type HomeDevice, agoWords, deviceSync, deviceSyncLabel } from "./send-state.js";
import { IPHONE_SCREENS, type WatchScreen, WATCH_SCREENS, WATCH_SETTINGS_SCREEN } from "./shell.js";
import type { UiIconName } from "./ui-icons.js";
import { type WatchPage, isHiddenWatchPage, isSystemWatchPage } from "./watch-pages/model.js";
import { type DeviceKind, deviceKindOf } from "./version.js";
import { type WatchAppSync, deviceVerdict, rejectedSaveText, waitingForText } from "./watch-app-sync.js";

/** A home device as the sync rule reads it, with the id it came from. */
export interface IdHomeDevice extends HomeDevice {
  id: string;
}

/**
 * Every owner as `homeSync` and `deviceSync` read it. Names are the bare
 * device names, unless two devices share one, which then take the longer
 * label (the paired phone, or "(iPhone)") so the two can be told apart.
 * The label functions are the panel's own, passed in.
 */
export function homeDevices(
  owners: readonly OwnerSummary[],
  short: (o: OwnerSummary) => string,
  long: (o: OwnerSummary) => string,
): IdHomeDevice[] {
  const bare = owners.map(short);
  return owners.map((o, i) => ({
    id: o.owner_watch_id,
    name: bare.filter((n) => n === bare[i]).length > 1 ? long(o) : bare[i]!,
    kind: o.device_kind,
    token: o.token,
    appliedToken: o.applied_token,
    count: o.complication_count,
    orphan: o.is_orphan,
  }));
}

/** One row of Home's Devices card. */
export interface HomeDeviceRow {
  id: string;
  name: string;
  kind: Exclude<DeviceKind, "library">;
  /** The worse of its complications and its watch app records (an iPhone's
   * own, on a home with phone pages). */
  sync: DeviceSync;
  /** What it is waiting for, empty unless `sync` is waiting. */
  waitingFor: string[];
  /** The watch app's parts whose last save the device reported it could not
   * use. Absent when there are none. */
  rejected?: string[];
}

/** The word beside a device on Home and in its sheet: "Not synced" for a
 * watch that could not use the last save of some part (it fetched it, so
 * the delivery numbers alone would call it Synced), else the sync word. */
export function homeDeviceLabel(row: Pick<HomeDeviceRow, "sync" | "rejected">): string {
  return (row.rejected?.length ?? 0) > 0 ? NOT_SYNCED_TEXT : deviceSyncLabel(row.sync);
}

export const NOT_SYNCED_TEXT = "Not synced";

/** Whether a device belongs under Waiting to sync: it waits for something,
 * or the watch could not use a save and needs a look. */
export function needsAttention(row: Pick<HomeDeviceRow, "sync" | "rejected">): boolean {
  return row.sync === "waiting" || (row.rejected?.length ?? 0) > 0;
}

/** A device's line under Waiting to sync: what the watch could not use, then
 * "Waiting for pages", then what its next pull brings. */
export function attentionText(row: Pick<HomeDeviceRow, "sync" | "waitingFor" | "rejected"> & { kind?: HomeDeviceRow["kind"] }, pending: string | undefined): string {
  return [
    (row.rejected?.length ?? 0) > 0 ? rejectedSaveText(row.rejected!, row.kind) : undefined,
    row.sync === "waiting" ? `Waiting for ${waitingForText(row.waitingFor)}` : undefined,
    pending,
  ].filter((w): w is string => w !== undefined).join(" · ");
}

/** The line under a device's name on Home: what the watch could not use,
 * then what it waits for, then what its next pull brings. Empty when there
 * is nothing to say. */
export function homeDeviceWhy(row: Pick<HomeDeviceRow, "waitingFor" | "rejected"> & { kind?: HomeDeviceRow["kind"] }, pending: string | undefined): string {
  return [
    (row.rejected?.length ?? 0) > 0 ? rejectedSaveText(row.rejected!, row.kind) : undefined,
    row.waitingFor.length === 0 ? undefined : `For ${waitingForText(row.waitingFor)}`,
    pending,
  ].filter((w): w is string => w !== undefined).join(" · ");
}

/** The Devices card's rows: every device the sync rule asks (the Library and
 * orphans left out), watches first and then phones, each group in the
 * order given. A device with a watch app reading in `watchApp` (a watch,
 * or an iPhone on a home with phone pages) takes the worse of that and its
 * complications (`deviceVerdict`); every other device is judged on its
 * complications alone. */
export function homeDeviceRows(devices: readonly IdHomeDevice[], watchApp: ReadonlyMap<string, WatchAppSync> = new Map()): HomeDeviceRow[] {
  const rows: HomeDeviceRow[] = [];
  for (const d of devices) {
    const complications = deviceSync(d);
    if (complications === undefined) continue;
    const kind = deviceKindOf({ owner_watch_id: d.id, device_kind: d.kind });
    if (kind === "library") continue;
    const { sync, waitingFor, rejected } = deviceVerdict(complications, watchApp.get(d.id));
    rows.push(rejected === undefined ? { id: d.id, name: d.name, kind, sync, waitingFor } : { id: d.id, name: d.name, kind, sync, waitingFor, rejected });
  }
  return [...rows.filter((r) => r.kind === "watch"), ...rows.filter((r) => r.kind === "iphone")];
}

/** The watch config kinds whose items the device sheet counts on a tab. */
export type DeviceCountKind = "pages" | "status_pages" | "control_center";

/** How many items one stored watch config holds, as its editor lists them:
 * the pages (the system ones are the watch's own and never listed), the
 * status pages, or the Control Center controls. Read straight off the
 * document rather than through each editor's model, which would pull the
 * editors into the panel's first bundle. Nothing stored counts as none. */
export function watchConfigCount(kind: DeviceCountKind, document: unknown): number {
  if (!isObject(document)) return 0;
  const list = document[kind === "pages" ? "pages" : kind === "status_pages" ? "statusPages" : "entities"];
  if (!Array.isArray(list)) return 0;
  return list.filter((item) => isObject(item) && !(kind === "pages" && item.isSystemPage === true)).length;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** The count each watch screen's tab wears, by screen. */
const SCREEN_COUNTS: Partial<Record<WatchScreen["id"], DeviceCountKind>> = {
  "pages": "pages",
  "status-pages": "status_pages",
  "control-center": "control_center",
};

/** One tab across the top of the device sheet: the device's complications
 * (all of them, or only its Control Center ones), or one watch screen. */
export type DeviceSheetTab =
  | { kind: "list"; label: string; filter: "all" | "control" }
  | { kind: "screen"; label: string; screen: WatchScreen; count?: DeviceCountKind };

/**
 * The picked device's doors, each opening its page on this device, in the
 * one order Home's doors and the device's header row (`watchRowLinks`) both
 * use: Pages, then its complications (Widgets on an iPhone), Menus, Status
 * pages, its Control Center controls, the rest, and Settings last. A watch
 * has every screen that belongs to one watch; HTTP actions and Cameras are
 * the home's, not a watch's. A watch's old Control Center screen is
 * retired: its tiles are complication controls now, so the door opens the
 * watch's designs that have a control, the way an iPhone's does. An iPhone
 * has its widgets and its Control Center controls, and on a home with phone
 * pages (`phones`) the iPhone app's screens around them.
 */
export function deviceSheetTabs(kind: "watch" | "iphone", phones = false): DeviceSheetTab[] {
  const controls: DeviceSheetTab = { kind: "list", label: "Control Center", filter: "control" };
  const comps: DeviceSheetTab = { kind: "list", label: kind === "watch" ? "Complications" : "Widgets", filter: "all" };
  const screenTab = (screen: WatchScreen): DeviceSheetTab => {
    const count = SCREEN_COUNTS[screen.id];
    return count === undefined ? { kind: "screen", label: screen.label, screen } : { kind: "screen", label: screen.label, screen, count };
  };
  if (kind === "iphone" && !phones) return [comps, controls];
  // The watch's complications are the sheet's own list tab, not a screen.
  const screens = kind === "iphone" ? IPHONE_SCREENS
    : WATCH_SCREENS.filter((s) => s.shared !== true && s.retired !== true && s.id !== "watch-complications");
  const tabs: DeviceSheetTab[] = [];
  for (const screen of screens) {
    tabs.push(screenTab(screen));
    if (screen.id === "pages") tabs.push(comps);
    if (screen.id === "status-pages") tabs.push(controls);
  }
  tabs.push(screenTab(WATCH_SETTINGS_SCREEN));
  return tabs;
}

/** The count tiles on a device's card on Home, each a door to that page on
 * this device: the sheet's tabs that carry a count. A watch has its
 * complications, then its pages and status pages; an iPhone has its
 * widgets, then on a home with phone pages its pages and status pages, then
 * its Control Center controls. Settings, which counts nothing, is the card's own door. */
export function deviceCardTiles(kind: "watch" | "iphone", phones = false): DeviceSheetTab[] {
  const tiles = deviceSheetTabs(kind, phones).filter((t) => t.kind === "list" || t.count !== undefined);
  const all = tiles.filter((t) => t.kind === "list" && t.filter === "all");
  return [...all, ...tiles.filter((t) => !all.includes(t))];
}

/** A tile's word under its number: the page's name, cut to one short word
 * where it has two, so four tiles fit across a card. */
export function tileWord(label: string): string {
  return label === "Status pages" ? "Status" : label === "Control Center" ? "Controls" : label;
}

/** A count door's word after its number, in small letters, singular for
 * one: "1 widget", "2 widgets", "1 status". */
export function countWord(label: string, n: number | undefined): string {
  const word = tileWord(label).toLocaleLowerCase();
  return n === 1 && word.endsWith("s") && word !== "status" ? word.slice(0, -1) : word;
}

/** Each watch's item counts, read off the watch config summary's `items`;
 * an iPhone's too, on a home with phone pages, whose records it lists the
 * same way.
 * A kind with no record counts none, and so does a watch the summary leaves
 * out, which has no records at all. An integration older than the field
 * sends `items` on no record, and then nothing is given, so the cards show
 * no number rather than a wrong one. */
export function summaryCounts(summary: WatchConfigSummary, watchIds: readonly string[]): Map<string, Partial<Record<DeviceCountKind, number>>> {
  const out = new Map<string, Partial<Record<DeviceCountKind, number>>>();
  const kinds: DeviceCountKind[] = ["pages", "status_pages", "control_center"];
  const counted = Object.values(summary.owners).some((owner) => Object.values(owner).some((k) => typeof k.items === "number"));
  if (!counted) return out;
  for (const id of watchIds) {
    const owner = summary.owners[id] ?? {};
    const counts: Partial<Record<DeviceCountKind, number>> = {};
    for (const kind of kinds) counts[kind] = owner[kind]?.items ?? 0;
    out.set(id, counts);
  }
  return out;
}

/** When a device was last heard from, as Home's card says it: "Online now"
 * for a watch holding a long-poll, else "Seen 5 min ago", aged by the time
 * since the list was read (`elapsed`, seconds). Nothing when the server has
 * not heard from it since it started, or is too old to say. */
export function seenWords(owner: Pick<OwnerSummary, "polling" | "last_seen_seconds"> | undefined, elapsed: number): string | undefined {
  if (owner?.polling === true) return "Online now";
  const seconds = owner?.last_seen_seconds;
  if (typeof seconds !== "number") return undefined;
  return `Seen ${agoWords(seconds + Math.max(0, elapsed))}`;
}

/** Home's small print under the devices: what Synced and Waiting are about.
 * The totals already say what each word means, so this only says what it
 * covers, which on a watch is more than its complications. */
/** The line under each of the whole home's screens in Home's side bar
 * (`renderHomeShared`): what it holds, short enough for one line. */
export const HOME_SHARED_SUB: Partial<Record<WatchScreen["id"], string>> = {
  "http-actions": "Web requests every device can run",
  "cameras": "How each camera is framed in alerts",
};

export const HOME_SYNC_NOTE = "On a watch, Synced and Waiting cover its complications and the whole watch app: pages, menus and settings.";

/** A device the server holds but that never talked to it: no app version,
 * and no change it ever said it had. A pairing left half done, or a test
 * record. Its card says so rather than leaving its facts line blank. */
export function neverConnected(owner: Pick<OwnerSummary, "app_version" | "applied_token" | "polling" | "last_seen_seconds"> | undefined): boolean {
  if (owner === undefined || owner.polling === true) return false;
  return !owner.app_version && (owner.applied_token === null || owner.applied_token === undefined)
    && typeof owner.last_seen_seconds !== "number";
}

export const NEVER_CONNECTED_TEXT = "Never connected";

/** Whether the Home Assistant user a device was paired to was deleted. Home
 * Assistant then refuses everything the device sends, so its card says so
 * and offers Remove and nothing else. */
export function userGone(owner: Pick<OwnerSummary, "user_gone"> | undefined): boolean {
  return owner?.user_gone === true;
}

export const USER_GONE_TEXT = "Its Home Assistant user was removed";

/** What a device's next pull brings, when it brings anything. */
export function pendingWords(owner: Pick<OwnerSummary, "pending_changes"> | undefined): string | undefined {
  const n = owner?.pending_changes;
  if (typeof n !== "number" || n <= 0) return undefined;
  return `${n} ${n === 1 ? "change" : "changes"} to pick up`;
}

/** Which of Home's totals a device counts under. A device that needs
 * attention counts as waiting, so a watch that could not use the last save
 * (it fetched it, so its delivery numbers alone say synced) is never
 * counted as Synced while its card says Not synced and it is listed under
 * Waiting to sync. */
export function homeTotalBucket(row: Pick<HomeDeviceRow, "sync" | "rejected">): DeviceSync {
  return needsAttention(row) ? "waiting" : row.sync;
}

/** Home's totals: how many devices, and how many are synced, waiting (or
 * could not use the last save), or have nothing waiting and never synced.
 * The thin bar and a person's summary dot read these too. */
export function homeTotals(rows: readonly Pick<HomeDeviceRow, "sync" | "rejected">[]): { all: number; synced: number; waiting: number; idle: number } {
  const count = (s: DeviceSync) => rows.filter((r) => homeTotalBucket(r) === s).length;
  return { all: rows.length, synced: count("synced"), waiting: count("waiting"), idle: count("idle") };
}

/** The device heard from last, for the totals' Last seen: a watch holding a
 * long-poll is "Now", else the shortest time since it was seen, aged by the
 * time since the list was read (`elapsed`, seconds), as a number and its
 * unit. Nothing when no device has been heard from since the server started. */
export function lastSeenDevice(
  rows: readonly Pick<HomeDeviceRow, "id" | "name">[],
  ownerOf: (id: string) => Pick<OwnerSummary, "polling" | "last_seen_seconds"> | undefined,
  elapsed: number,
): { name: string; n: string; unit: string } | undefined {
  let best: { name: string; seconds: number } | undefined;
  for (const r of rows) {
    const owner = ownerOf(r.id);
    const seconds = owner?.polling === true ? 0 : owner?.last_seen_seconds;
    if (typeof seconds !== "number") continue;
    if (best === undefined || seconds < best.seconds) best = { name: r.name, seconds };
  }
  if (best === undefined) return undefined;
  const seconds = best.seconds === 0 ? 0 : best.seconds + Math.max(0, elapsed);
  if (seconds < 60) return { name: best.name, n: "Now", unit: "" };
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return { name: best.name, n: `${minutes}`, unit: "min ago" };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { name: best.name, n: `${hours}`, unit: "h ago" };
  const days = Math.floor(hours / 24);
  return { name: best.name, n: `${days}`, unit: days === 1 ? "day ago" : "days ago" };
}

/** Home's devices by person, in the people's own order: each person with
 * their rows, in the rows' order (watches, then phones). A row no person
 * holds, which only an inconsistent list could give, ends up in a group of
 * its own at the end rather than going missing. */
export function homeGroups(people: readonly Person[], rows: readonly HomeDeviceRow[]): { person?: Person; index: number; rows: HomeDeviceRow[] }[] {
  const out: { person?: Person; index: number; rows: HomeDeviceRow[] }[] = [];
  const placed = new Set<string>();
  people.forEach((person, index) => {
    const ids = new Set(person.owners.map((o) => o.owner_watch_id));
    const mine = rows.filter((r) => ids.has(r.id));
    for (const r of mine) placed.add(r.id);
    if (mine.length > 0) out.push({ person, index, rows: mine });
  });
  const rest = rows.filter((r) => !placed.has(r.id));
  if (rest.length > 0) out.push({ index: -1, rows: rest });
  return out;
}

/** The line under the device sheet's title: what it is, its app version, and
 * on a watch the iPhone it is paired with. Only what the device reported. */
export function deviceFacts(owner: OwnerSummary | undefined, kind: "watch" | "iphone"): string[] {
  const facts: string[] = [kind === "iphone" ? "iPhone" : "Apple Watch"];
  if (owner?.app_version) facts.push(`App ${owner.app_version}${owner.app_build ? ` (${owner.app_build})` : ""}`);
  if (kind === "watch" && owner?.paired_iphone_name) facts.push(`Paired with ${owner.paired_iphone_name}`);
  return facts;
}

/**
 * The device Home shows on its right: the one asked for while it is still in
 * the list, else the one heard from last (a watch holding a long-poll first),
 * else the first. Undefined only for an empty list.
 */
export function homePickOf(
  rows: readonly Pick<HomeDeviceRow, "id">[],
  wanted: string | undefined,
  ownerOf: (id: string) => Pick<OwnerSummary, "polling" | "last_seen_seconds"> | undefined,
): string | undefined {
  if (wanted !== undefined && rows.some((r) => r.id === wanted)) return wanted;
  let best: { id: string; seconds: number } | undefined;
  for (const r of rows) {
    const owner = ownerOf(r.id);
    const seconds = owner?.polling === true ? 0 : owner?.last_seen_seconds;
    if (typeof seconds !== "number") continue;
    if (best === undefined || seconds < best.seconds) best = { id: r.id, seconds };
  }
  return best?.id ?? rows[0]?.id;
}

/** The device before (`step` -1) or after (+1) one, in the list's order,
 * going round from the last to the first. */
export function homeStep(rows: readonly Pick<HomeDeviceRow, "id">[], current: string | undefined, step: -1 | 1): string | undefined {
  if (rows.length === 0) return undefined;
  const at = rows.findIndex((r) => r.id === current);
  if (at < 0) return rows[0]!.id;
  return rows[(at + step + rows.length) % rows.length]!.id;
}

/** A list row's line under the device's name: what it holds, then when it
 * was heard from. "22 complications · 1 h ago", "1 widget · Online now". */
export function homeRowSub(kind: "watch" | "iphone", held: number, heard: string | undefined): string {
  const word = kind === "watch" ? (held === 1 ? "complication" : "complications") : (held === 1 ? "widget" : "widgets");
  return [`${held} ${word}`, heard?.replace(/^Seen /, "")].filter((w): w is string => w !== undefined).join(" · ");
}

/** How one door on the picked device looks: its glyph, the section hue its
 * chip is outlined in, and one line on what the page is for. */
export interface HomeDoorLook {
  icon: UiIconName;
  hue: string;
  blurb: string;
}

const SCREEN_DOORS: Partial<Record<WatchScreen["id"] | "settings", HomeDoorLook>> = {
  "pages": { icon: "pages", hue: "var(--wa-hue-green)", blurb: "The screens you swipe between." },
  "menus": { icon: "radial", hue: "var(--wa-hue-orange)", blurb: "The quick menus and the page switcher." },
  "status-pages": { icon: "checklist", hue: "var(--wa-hue-yellow)", blurb: "Lists to read at a glance." },
  "watch-complications": { icon: "gauge", hue: "var(--wa-hue-blue)", blurb: "On this watch’s faces." },
  "rooms": { icon: "home", hue: "var(--wa-hue-pink)", blurb: "Room pages and point control." },
  "voice": { icon: "mic", hue: "var(--wa-hue-red)", blurb: "How the watch listens and speaks." },
  "settings": { icon: "sliders", hue: "var(--wa-hue-grey)", blurb: "Gestures, wrist twists and how it connects." },
};

/** The look of one of the device's doors (`deviceSheetTabs`). */
export function homeDoorLook(tab: DeviceSheetTab, kind: "watch" | "iphone"): HomeDoorLook {
  if (tab.kind === "list") {
    if (tab.filter === "control") return { icon: "tap", hue: "var(--wa-hue-orange)", blurb: "Buttons in Control Center, from your designs." };
    return kind === "watch"
      ? { icon: "gauge", hue: "var(--wa-hue-blue)", blurb: "On this watch’s faces." }
      : { icon: "grid", hue: "var(--wa-hue-blue)", blurb: "On the Lock Screen and Home Screen." };
  }
  return SCREEN_DOORS[tab.screen.id] ?? { icon: "pages", hue: "var(--wa-hue-grey)", blurb: "" };
}

/** How many of a watch's pages its Pages door draws, and how wide each
 * screen is drawn, in CSS pixels. A door too narrow for all of them drops
 * the last whole rather than cutting it; the door's count says how many
 * there are. */
export const HOME_PAGE_THUMBS = 4;
export const HOME_PAGE_THUMB_WIDTH = 38;

/** The pages a watch's Pages door draws, small, in the watch's order: the
 * first `max` the watch swipes between (not hidden, not its own system
 * pages). */
export function homePageThumbs(pages: readonly WatchPage[], max = HOME_PAGE_THUMBS): WatchPage[] {
  return pages.filter((p) => !isHiddenWatchPage(p) && !isSystemWatchPage(p)).slice(0, max);
}

/** The length round Home's ring, a circle of radius 18 in a 44 box. */
export const HOME_RING_LENGTH = 2 * Math.PI * 18;

/** Home's ring of every device: the synced share in green from the top,
 * then the waiting share in amber after it, as stroke dash lengths on a
 * circle of `length`. A device that never synced leaves its share empty. */
export function homeRing(totals: { all: number; synced: number; waiting: number }, length: number): { synced: string; waiting: string; offset: string } {
  const share = (n: number) => (totals.all === 0 ? 0 : (n / totals.all) * length);
  const synced = share(totals.synced);
  const waiting = share(totals.waiting);
  const fmt = (n: number) => `${Math.round(n * 10) / 10}`;
  return { synced: `${fmt(synced)} ${fmt(length)}`, waiting: `${fmt(waiting)} ${fmt(length)}`, offset: fmt(-synced) };
}

/** The ring's words: "All 6 synced", "5 of 6 synced", or "1 device" with
 * nothing synced yet. */
export function homeRingHead(totals: { all: number; synced: number }): string {
  if (totals.all > 0 && totals.synced === totals.all) return `All ${totals.all} synced`;
  if (totals.synced === 0) return `${totals.all} ${totals.all === 1 ? "device" : "devices"}`;
  return `${totals.synced} of ${totals.all} synced`;
}

/**
 * Home's look, added to the panel's sheet. A device browser: the household's
 * devices down a side bar, grouped by person, and the picked device on the
 * right, standing on a lit stage over the doors to its pages. Graphite
 * cards, neutral controls each with a one pixel outline, and a hue only on a
 * lit outline, a chip or a dot. Titles are small capitals, weight 500,
 * spaced. Every color is a panel token, so the light skin reads as well as
 * the dark one; the stage's light is the one radial gradient, and it is a
 * token too (`--wa-stage-light`).
 */
export const homeStyles = css`
  .home {
    flex: 1 1 auto; min-height: 0; overflow: auto; box-sizing: border-box;
    background: var(--wa-bg); color: var(--wa-ink);
  }
  .home-pad { padding: clamp(20px, 4vh, 40px) clamp(16px, 4vw, 40px) 48px; }
  .home-wrap { width: min(1240px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }
  /* The sheen every Home card shares: a fill a shade lighter at the top, and
     a hairline of light along the top edge, so a card reads as a surface
     the light falls on rather than a flat box. */
  .home {
    --home-card: linear-gradient(180deg, color-mix(in srgb, var(--wa-ink) 4%, var(--wa-card)), var(--wa-card));
    --home-lift: inset 0 1px 0 color-mix(in srgb, var(--wa-ink) 7%, transparent);
  }
  .home-head { display: flex; align-items: flex-end; flex-wrap: wrap; gap: 12px 16px; padding: 0 2px; }
  .home-head-text { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .home-head h1 { margin: 0; font-size: 30px; font-weight: 500; letter-spacing: -.02em; }
  .home-lead { margin: 0; font-size: 14px; color: var(--wa-muted); }
  /* A person who is not an administrator sees only their own devices: one
     quiet line under the lead says so. */
  .home-scope { margin: 0; font-size: 12.5px; color: var(--wa-muted); }
  .home-head-acts { display: flex; flex-wrap: wrap; gap: 8px; }
  .home-title { margin: 0; font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--wa-ink); }
  a.home-btn, button.home-btn {
    display: inline-flex; align-items: center; gap: 6px; box-sizing: border-box; height: 32px; padding: 0 13px;
    border-radius: 7px; font: inherit; font-size: 12.5px; font-weight: 500; cursor: pointer; white-space: nowrap; text-decoration: none;
    color: var(--wa-ink); background: var(--home-card, var(--wa-card)); border: 1px solid var(--wa-line-strong);
    box-shadow: var(--home-lift, none);
  }
  a.home-btn:hover, button.home-btn:hover:not(:disabled) { background: var(--wa-hover); }
  a.home-btn:focus-visible, button.home-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.home-btn:disabled { opacity: .5; cursor: default; }
  .home-btn svg.ui-icon { width: 14px; height: 14px; }
  /* Adding something, a device or a complication, is outlined green, the way
     every Add is across the panel. */
  .home-btn.add { border-color: color-mix(in srgb, var(--wa-hue-green) 70%, var(--wa-card)); }
  .home-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--wa-muted); }
  .home-dot.synced { background: var(--wa-green); }
  .home-dot.waiting { background: var(--wa-amber); }
  .home-small { margin: 0; font-size: 11.5px; line-height: 1.45; color: var(--wa-muted); }
  .home-empty { margin: 0; font-size: 13px; color: var(--wa-muted); }
  /* The devices drawn on Home and in the pairing dialog light their slots
     in their person's color (--c). */
  .ha-art { display: block; }
  .ha-lit { stroke: var(--c); }
  .ha-lit-fill { fill: var(--c); }
  .ha-edge-wait { stroke: var(--wa-amber); stroke-opacity: .7; }
  /* Pair a device, the only card in a home with no devices yet: a dashed
     outline, nothing lit. */
  .home-devices { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(240px, 100%), 1fr)); gap: 10px; }
  .home-devices > li:has(> button.home-device-add) { display: flex; }
  button.home-device-add {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 120px;
    box-sizing: border-box; padding: 16px; border-radius: 12px; font: inherit; cursor: pointer;
    color: var(--wa-muted); background: transparent; border: 1.5px dashed var(--wa-line-strong);
  }
  button.home-device-add:hover { color: var(--wa-ink); border-color: var(--wa-muted); background: var(--wa-hover); }
  button.home-device-add:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.home-device-add b { font-size: 14px; font-weight: 600; color: var(--wa-ink); }
  button.home-device-add span { font-size: 12.5px; }
  button.home-device-add svg.ui-icon { width: 20px; height: 20px; }

  /* ── The device browser ── */
  .hb { display: flex; flex-wrap: wrap; align-items: stretch; min-height: 100%; }
  /* The side bar: the head, the household's state, Pair a device, then
     every device by person. */
  .hb-side {
    flex: 1 1 280px; max-width: 340px; min-width: 0; box-sizing: border-box;
    display: flex; flex-direction: column; gap: 16px; padding: 20px 12px 18px;
    background: color-mix(in srgb, var(--wa-card) 45%, var(--wa-bg)); border-right: 1px solid var(--wa-line);
  }
  .hb-head { display: flex; flex-direction: column; gap: 4px; padding: 0 8px; }
  .hb-head h1 { margin: 0; font-size: 20px; font-weight: 500; letter-spacing: -.02em; }
  .hb-head .home-lead { font-size: 12px; line-height: 1.45; }
  .hb-head .home-scope { font-size: 11.5px; }
  /* The household's state: a ring of every device, synced in green and
     waiting in amber, its words, the waiting devices, then the four totals.
     Lit green from its top left, or amber while anything waits. */
  .hb-sum {
    --c: var(--wa-green); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
    ${litOutline}
    border-width: 1px;
    display: flex; flex-direction: column; gap: 12px; padding: 14px; border-radius: 14px; box-shadow: var(--home-lift);
  }
  .hb-sum.on { --c: var(--wa-amber); }
  .hb-sum-top { display: flex; align-items: center; gap: 12px; }
  .hb-ring { flex: none; width: 44px; height: 44px; }
  .hb-ring circle { fill: none; stroke-width: 4; }
  .hb-ring .track { stroke: var(--wa-line-strong); }
  .hb-ring .ok { stroke: var(--wa-green); }
  .hb-ring .wait { stroke: var(--wa-amber); }
  .hb-sum-t { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .hb-sum-t b { font-size: 15px; font-weight: 500; letter-spacing: -.01em; }
  .hb-sum-t .home-title { font-size: 10.5px; color: var(--c); }
  .hb-sum-line { margin: 0; font-size: 12px; line-height: 1.45; color: var(--wa-label); }
  /* A waiting device: its name and what it waits for, opening it. */
  .hb-waits { display: flex; flex-direction: column; }
  button.hb-wait {
    display: flex; align-items: flex-start; gap: 9px; width: 100%; padding: 8px 0; box-sizing: border-box;
    font: inherit; text-align: left; cursor: pointer; color: var(--wa-ink);
    background: transparent; border: 0; border-top: 1px solid var(--wa-line);
  }
  button.hb-wait:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
  button.hb-wait i { width: 6px; height: 6px; flex: none; margin-top: 6px; border-radius: 50%; background: var(--c); }
  .hb-wait-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
  .hb-wait-t b { font-size: 12.5px; font-weight: 500; overflow-wrap: anywhere; }
  .hb-wait-t span { font-size: 11.5px; color: var(--wa-muted); overflow-wrap: anywhere; }
  button.hb-wait:hover .hb-wait-t b { text-decoration: underline; }
  .hb-totals { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; padding-top: 10px; border-top: 1px solid var(--wa-line); }
  .hb-total { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  .hb-total b { font-size: 17px; font-weight: 400; line-height: 1; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .hb-total b.ok { color: var(--wa-green); }
  .hb-total b.wait { color: var(--wa-amber); }
  .hb-total span { font-size: 10px; letter-spacing: .04em; color: var(--wa-muted); overflow-wrap: anywhere; }
  button.home-btn.hb-pair { width: 100%; height: 36px; justify-content: center; border-radius: 10px; }
  .hb-pair svg.ui-icon { color: var(--wa-green); }
  /* One person: their picture (or initial) ringed in grey (the colors are
     the devices'), their
     name in small capitals, how their devices stand, then a row each. */
  .hb-group { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .hb-person { display: flex; align-items: center; gap: 9px; padding: 8px 8px 6px; min-width: 0; }
  .hb-avatar {
    width: 22px; height: 22px; flex: none; box-sizing: border-box; border-radius: 50%; overflow: hidden;
    display: grid; place-items: center; border: 1.5px solid var(--c); background: var(--wa-field);
    font-size: 10px; font-weight: 600; color: var(--c);
  }
  .hb-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hb-person-name {
    flex: 1; min-width: 0; margin: 0; overflow-wrap: anywhere;
    font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-label);
  }
  .hb-person-sum { flex: none; display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--wa-muted); }
  .hb-person-note { padding: 0 8px 4px; font-size: 11px; color: var(--wa-muted); }
  /* A device's row: its small drawing, its name, what it holds and when it
     was heard from, and a dot in its sync color. The picked one is lit in
     its device's color from the top left. */
  button.hb-row {
    --s: var(--wa-muted);
    display: flex; align-items: center; gap: 11px; width: 100%; box-sizing: border-box; padding: 6px 10px 6px 6px;
    border-radius: 11px; font: inherit; text-align: left; cursor: pointer; color: var(--wa-ink);
    background: transparent; border: 1px solid transparent;
    transition: background-color .15s ease;
  }
  button.hb-row.synced { --s: var(--wa-green); }
  button.hb-row.waiting { --s: var(--wa-amber); }
  button.hb-row.rejected { --s: var(--error-color); }
  button.hb-row:hover { background-color: var(--wa-hover); }
  button.hb-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.hb-row.on {
    --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
    ${litOutline}
    border-width: 1px;
    box-shadow: var(--home-lift);
  }
  .hb-icon {
    width: 38px; height: 38px; flex: none; box-sizing: border-box; border-radius: 9px;
    display: grid; place-items: center; background: var(--wa-field); border: 1px solid var(--wa-line);
  }
  /* The device's own color (device-colors.ts) on its drawing's box. */
  .hb-icon.tinted { border-color: color-mix(in srgb, var(--c) 60%, transparent); }
  .hb-row-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .hb-row-name { font-size: 13px; font-weight: 500; line-height: 1.3; overflow-wrap: anywhere; }
  .hb-row-sub { font-size: 11px; line-height: 1.3; color: var(--wa-muted); overflow-wrap: anywhere; }
  .hb-row-dot { width: 7px; height: 7px; flex: none; border-radius: 50%; background: var(--s); }
  button.hb-row.on .hb-row-dot { box-shadow: 0 0 0 3px color-mix(in srgb, var(--s) 22%, transparent); }
  /* The whole home's screens: rows like a device's, as links, each glyph
     in its screen's hue as the watch row draws it. */
  .hb-shared { margin-top: 6px; }
  a.hb-link {
    display: flex; align-items: center; gap: 11px; width: 100%; box-sizing: border-box; padding: 6px 10px 6px 6px;
    border-radius: 11px; text-decoration: none; color: var(--wa-ink); border: 1px solid transparent;
    transition: background-color .15s ease;
  }
  a.hb-link:hover { background-color: var(--wa-hover); }
  a.hb-link:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hb-link-ic { color: var(--h); }
  .hb-link-ic svg.ui-icon { width: 18px; height: 18px; }
  .hb-side > .home-small { margin-top: auto; padding: 10px 8px 0; font-size: 11px; }

  /* The picked device. */
  .hb-main { flex: 999 1 520px; min-width: 0; box-sizing: border-box; padding: 18px clamp(16px, 3vw, 32px) 48px; container-type: inline-size; }
  .hb-detail { max-width: 940px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; }
  .hb-main > .home-welcome-slot { max-width: 940px; margin: 0 auto 18px; }
  /* Its bar: whose it is and its name, the arrows to the device before and
     after it, Rename and Remove. */
  .hb-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; min-height: 34px; }
  .hb-crumb { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-width: 0; font-size: 12.5px; color: var(--wa-muted); }
  .hb-crumb i { width: 7px; height: 7px; flex: none; border-radius: 50%; background: var(--c); }
  .hb-crumb b { font-weight: 500; color: var(--wa-ink); overflow-wrap: anywhere; }
  .hb-crumb svg.ui-icon { width: 12px; height: 12px; color: var(--wa-faint); }
  .hb-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  button.hb-step {
    width: 32px; height: 32px; box-sizing: border-box; border-radius: 9px; display: grid; place-items: center; cursor: pointer;
    color: var(--wa-label); background: var(--home-card); border: 1px solid var(--wa-line-strong); box-shadow: var(--home-lift);
  }
  button.hb-step:hover { background: var(--wa-hover); }
  button.hb-step:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.hb-step svg.ui-icon { width: 14px; height: 14px; }
  .hb-sep { width: 1px; height: 18px; margin: 0 4px; background: var(--wa-line-strong); }
  .hb-acts .home-btn { height: 32px; border-radius: 9px; }
  button.home-btn.hb-remove { color: var(--error-color); background: transparent; border-color: color-mix(in srgb, var(--error-color) 50%, var(--wa-line)); }
  button.home-btn.hb-remove:hover { background: color-mix(in srgb, var(--error-color) 10%, transparent); }
  /* The stage: the device standing in a soft light from above, on a floor
     that gives back its reflection, lit along its edge in its device's
     color. Two counts point at it from either side. */
  .hb-stage {
    position: relative; height: 380px; border-radius: 24px; overflow: hidden; box-sizing: border-box;
    border: 1px solid transparent;
    background:
      radial-gradient(46% 70% at 50% 0%, var(--wa-stage-light) 0%, transparent 80%) padding-box,
      linear-gradient(180deg, var(--wa-stage-top) 0%, var(--wa-stage-bottom) 100%) padding-box,
      linear-gradient(140deg, var(--c) 0%, color-mix(in srgb, var(--c) 25%, transparent) 32%,
        var(--wa-card-mid) 64%, color-mix(in srgb, var(--c) 15%, transparent) 100%) border-box;
    box-shadow: var(--home-lift);
  }
  .hb-floor {
    position: absolute; left: 0; right: 0; bottom: 0; height: 96px;
    background: linear-gradient(180deg, color-mix(in srgb, var(--wa-ink) 3%, transparent), transparent);
    border-top: 1px solid color-mix(in srgb, var(--wa-ink) 5%, transparent);
  }
  .hb-device { position: absolute; left: 0; right: 0; top: 44px; display: flex; justify-content: center; }
  .hb-device svg.ha-art {
    width: auto; height: 236px;
    -webkit-box-reflect: below 4px linear-gradient(transparent 72%, var(--wa-stage-reflect));
  }
  .hb-badge {
    --s: var(--wa-muted);
    position: absolute; top: 16px; right: 16px; display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 11px;
    border-radius: 999px; font-size: 12px; font-weight: 500; color: var(--s);
    background: color-mix(in srgb, var(--s) 10%, transparent); border: 1px solid color-mix(in srgb, var(--s) 35%, transparent);
  }
  .hb-badge.synced { --s: var(--wa-green); }
  .hb-badge.waiting { --s: var(--wa-amber); }
  .hb-badge.rejected { --s: var(--error-color); }
  .hb-badge i { width: 6px; height: 6px; border-radius: 50%; background: var(--s); }
  .hb-calls { position: absolute; inset: 0; pointer-events: none; }
  button.hb-call {
    position: absolute; top: 132px; display: flex; align-items: center; gap: 10px; padding: 6px 8px; margin: -6px -8px;
    border-radius: 10px; font: inherit; color: var(--wa-ink); background: transparent; border: 0; cursor: pointer; pointer-events: auto;
  }
  button.hb-call:hover .hb-call-n span { color: var(--wa-ink); }
  button.hb-call:hover .hb-call-line { width: 64px; }
  button.hb-call:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hb-call.l { right: calc(50% + var(--off)); }
  .hb-call.r { left: calc(50% + var(--off)); }
  .hb-call-n { display: flex; flex-direction: column; gap: 3px; }
  .hb-call.l .hb-call-n { align-items: flex-end; }
  .hb-call-n b { font-size: 28px; font-weight: 300; line-height: 1; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
  .hb-call-n b.none { color: var(--wa-faint); }
  .hb-call-n span { font-size: 10.5px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-muted); }
  .hb-call-line { width: 56px; height: 1px; transition: width .2s ease; }
  .hb-call.l .hb-call-line { background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--wa-ink) 30%, transparent)); }
  .hb-call.r .hb-call-line { background: linear-gradient(90deg, color-mix(in srgb, var(--wa-ink) 30%, transparent), transparent); }
  .hb-call i { width: 5px; height: 5px; border-radius: 50%; background: var(--c); }
  .hb-call.r i { background: var(--wa-label); }
  @container (max-width: 620px) {
    .hb-calls { display: none; }
    .hb-stage { height: 320px; }
    .hb-device svg.ha-art { height: 200px; }
  }
  /* The welcome, in a home with no devices yet: three numbered steps down
     the page, joined by a thin line. Install the app, pick the device on
     the lit stage, pair it. */
  .hw-wrap { width: min(1040px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }
  .hw-steps { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; }
  .hw-step { display: grid; grid-template-columns: 28px minmax(0, 1fr); column-gap: 16px; }
  .hw-rail { display: flex; flex-direction: column; align-items: center; }
  .hw-num {
    width: 28px; height: 28px; flex: none; box-sizing: border-box; border-radius: 50%; display: grid; place-items: center;
    font-size: 12px; font-weight: 500; color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
  }
  .hw-line { flex: 1; width: 1px; margin-top: 8px; background: var(--wa-line-strong); }
  .hw-step:last-child .hw-line { display: none; }
  .hw-body { min-width: 0; display: flex; flex-direction: column; gap: 14px; padding-bottom: 30px; }
  .hw-step:last-child .hw-body { padding-bottom: 0; }
  .hw-step-head { display: flex; flex-direction: column; gap: 3px; padding-top: 3px; }
  .hw-step-head h2 { margin: 0; font-size: 17px; font-weight: 500; letter-spacing: -.01em; overflow-wrap: anywhere; }
  .hw-step-head span { font-size: 12.5px; line-height: 1.45; color: var(--wa-muted); overflow-wrap: anywhere; }
  .hw-install {
    display: flex; flex-wrap: wrap; align-items: center; gap: 20px 24px; padding: 16px; border-radius: 16px;
    background: var(--home-card); border: 1px solid var(--wa-line); box-shadow: var(--home-lift);
  }
  .hw-install-t { flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
  .hw-install-t p { margin: 0; font-size: 13.5px; line-height: 1.55; color: var(--wa-ink); overflow-wrap: anywhere; }
  .hw-qr { flex: none; margin: 0; display: flex; align-items: center; gap: 14px; }
  .hw-qr svg, .hw-qr-empty { display: block; width: 96px; height: 96px; box-sizing: border-box; border-radius: 8px; border: 1px solid var(--wa-line); }
  .hw-qr figcaption { display: flex; flex-direction: column; gap: 3px; max-width: 150px; font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
  .hw-qr figcaption b { font-size: 12.5px; font-weight: 500; color: var(--wa-ink); }
  /* Pick one: both devices on Home's lit stage, its edge plain grey. The one
     picked is drawn in full with one thin green arc turning slowly round it;
     the other is faint inside a dashed ring. */
  .hb-stage.hw-stage { --c: var(--wa-line-strong); height: auto; display: flex; justify-content: center; padding: 28px 20px 30px; }
  .hw-choices { position: relative; display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: 24px 72px; }
  button.hw-choice {
    display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 0; margin: 0;
    border: 0; border-radius: 24px; background: none; font: inherit; color: inherit; cursor: pointer;
  }
  button.hw-choice:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hw-ring { position: relative; width: 236px; height: 236px; display: grid; place-items: center; }
  .hw-ring > svg.hw-ring-track, .hw-ring > svg.hw-ring-arc { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; fill: none; }
  .hw-ring-track circle { stroke: var(--wa-line-strong); stroke-width: 1; stroke-dasharray: 4 5; transition: stroke .2s ease; }
  .hw-choice:hover:not(.on) .hw-ring-track circle { stroke: var(--wa-muted); }
  .hw-choice.on .hw-ring-track circle { stroke: color-mix(in srgb, var(--wa-hue-green) 28%, transparent); stroke-dasharray: none; }
  .hw-ring-arc { animation: hw-in .45s ease-out both, hw-spin 6s linear infinite; }
  .hw-ring-arc circle { stroke: var(--wa-hue-green); stroke-width: 1.5; stroke-linecap: round; }
  @keyframes hw-spin { to { transform: rotate(360deg); } }
  @keyframes hw-in { from { opacity: 0; } to { opacity: 1; } }
  .hw-ghost-art { position: relative; opacity: .45; transition: opacity .25s ease; }
  .hw-choice:hover .hw-ghost-art { opacity: .9; }
  .hw-choice.on .hw-ghost-art { opacity: 1; }
  .hw-ghost { stroke: color-mix(in srgb, var(--wa-ink) 28%, transparent); }
  .hw-ghost-lit { stroke: color-mix(in srgb, var(--wa-hue-green) 70%, transparent); }
  .hw-ghost-faint { stroke: color-mix(in srgb, var(--wa-ink) 13%, transparent); }
  .hw-ghost-faint-fill { fill: color-mix(in srgb, var(--wa-ink) 13%, transparent); }
  .hw-ghost-fill { fill: color-mix(in srgb, var(--wa-ink) 2.5%, transparent); }
  .hw-ghost-ink { fill: color-mix(in srgb, var(--wa-ink) 45%, transparent); font-family: inherit; }
  .hw-ghost-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .hw-ghost-ink-line { stroke: color-mix(in srgb, var(--wa-ink) 45%, transparent); }
  .hw-choice-t { display: flex; flex-direction: column; align-items: center; gap: 3px; }
  .hw-choice-t b { font-size: 14px; font-weight: 500; }
  .hw-choice.on .hw-choice-t b { color: var(--wa-green); }
  .hw-choice-t span { font-size: 11.5px; color: var(--wa-muted); }
  /* Pair it: the pairing card for the device picked, lit green. */
  .hw-pair {
    --c: var(--wa-hue-green); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
    ${litOutline}
    display: flex; flex-direction: column; gap: 14px; padding: 18px 20px; border-radius: 18px; box-shadow: var(--home-lift);
  }
  .hw-pair-foot {
    display: flex; flex-wrap: wrap; gap: 8px 18px; padding-top: 14px; border-top: 1px solid var(--wa-line);
    font-size: 12.5px; line-height: 1.45; color: var(--wa-muted);
  }
  .hw-pair-foot a { color: var(--wa-ink); }
  @media (prefers-reduced-motion: reduce) {
    .hw-ring-arc { animation: none; }
  }
  /* On a phone the two stay side by side, smaller. */
  @media (max-width: 640px) {
    .hb-stage.hw-stage { padding: 20px 8px 22px; }
    .hw-ring { width: 118px; height: 118px; }
    .hw-ghost-art { transform: scale(.5); }
    .hw-choices { flex-wrap: nowrap; gap: 14px; }
  }
  /* Under the stage: its name and facts, the sync well, then its doors. */
  .hb-info { display: flex; flex-direction: column; gap: 18px; }
  .hb-name { display: flex; flex-direction: column; gap: 6px; padding: 4px 2px 0; min-width: 0; }
  .hb-name h2 { margin: 0; font-size: 30px; font-weight: 500; letter-spacing: -.025em; line-height: 1.15; overflow-wrap: anywhere; }
  .hb-facts { font-size: 13px; line-height: 1.45; color: var(--wa-muted); overflow-wrap: anywhere; }
  /* The sync state in a well lit in its color: a chip, its word and what it
     means, and when the device was last heard from. */
  .hb-state {
    --c: var(--wa-muted); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
    ${litOutline}
    border-width: 1px;
    display: flex; align-items: center; gap: 14px; padding: 13px 16px; border-radius: 14px;
  }
  .hb-state.synced { --c: var(--wa-green); }
  .hb-state.waiting { --c: var(--wa-amber); }
  .hb-state.rejected { --c: var(--error-color); }
  .hb-state-chip {
    width: 32px; height: 32px; flex: none; box-sizing: border-box; border-radius: 9px; display: grid; place-items: center;
    border: 1px solid var(--c); color: var(--c);
  }
  .hb-state-chip svg.ui-icon { width: 15px; height: 15px; }
  .hb-state-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .hb-state-t b { font-size: 14px; font-weight: 500; color: var(--c); }
  .hb-state-t span { font-size: 12.5px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .hb-seen { flex: none; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
  .hb-seen span { font-size: 10px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-faint); }
  .hb-seen b { font-size: 12.5px; font-weight: 400; color: var(--wa-label); }
  .hb-info .home-title { padding: 6px 2px 0; color: var(--wa-muted); }
  /* A door per page, each opening it on this device: a chip in the page's
     section hue, its name, how many it holds, and a line on what it is for. */
  .hb-doors { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(208px, 100%), 1fr)); gap: 10px; margin-top: -6px; }
  a.hb-door, button.hb-door {
    display: flex; flex-direction: column; gap: 12px; min-height: 104px; box-sizing: border-box; padding: 13px 14px 14px;
    border-radius: 14px; font: inherit; text-align: left; cursor: pointer; text-decoration: none; color: var(--wa-ink);
    background: var(--home-card); border: 1px solid var(--wa-line-strong); box-shadow: var(--home-lift);
    transition: background-color .15s ease, border-color .15s ease, transform .15s ease;
  }
  a.hb-door:hover, button.hb-door:hover { background: var(--wa-hover); transform: translateY(-1px); }
  a.hb-door:focus-visible, button.hb-door:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hb-door-top { display: flex; align-items: center; gap: 10px; }
  .hb-door-chip {
    width: 26px; height: 26px; flex: none; box-sizing: border-box; border-radius: 7px; display: grid; place-items: center;
    border: 1px solid var(--h); color: var(--h);
  }
  .hb-door-chip svg.ui-icon { width: 14px; height: 14px; }
  .hb-door-l { flex: 1; min-width: 0; font-size: 13.5px; font-weight: 500; overflow-wrap: anywhere; }
  .hb-door-n { flex: none; font-size: 20px; font-weight: 300; line-height: 1; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
  .hb-door-n.none { font-size: 12.5px; font-weight: 400; letter-spacing: 0; color: var(--wa-faint); }
  .hb-door-foot { display: flex; align-items: flex-end; gap: 8px; }
  .hb-door-b { flex: 1; font-size: 12px; line-height: 1.4; color: var(--wa-muted); }
  /* The Pages door draws the watch's first pages instead of its line: one
     screen of each, small, with the screen's corners and no watch case. */
  /* The pictures sit from the left, so two pages read as a pair. The Menus
     door's three spread across instead (\`wa-menu-thumbs\`): there are always
     three, so they line up with both edges. */
  .hb-door-pages {
    flex: 1; min-width: 0; height: var(--hb-screen-h); display: flex; flex-wrap: wrap; align-content: flex-start; gap: 0 5px;
    overflow: hidden; pointer-events: none;
  }
  .hb-page { flex: none; display: block; line-height: 0; }
  /* The Complications door's strip: each complication's card picture on a
     black tile, all one height, a round one cut to a circle. */
  .hb-door-comps {
    flex: 1; min-width: 0; height: var(--hb-comp-h); display: flex; flex-wrap: wrap; align-content: flex-start; gap: 0 5px;
    overflow: hidden; pointer-events: none;
  }
  .hb-comp {
    flex: none; display: block; height: var(--hb-comp-h); box-sizing: border-box; border-radius: 6px;
    background-color: var(--wa-art-screen); background-repeat: no-repeat; background-position: center; background-size: contain;
    box-shadow: 0 0 0 1px var(--wa-line-strong);
  }
  .hb-comp.round { border-radius: 50%; }
  .hb-page .wa-watch { padding: 0; margin: 0; background: none; box-shadow: 0 0 0 1px var(--wa-line-strong); border-radius: var(--wf-radius, 6px); }
  .hb-page .wa-watch::before, .hb-page .wa-watch::after { display: none; }
  .hb-page .wa-watch > .wp-screen { max-height: var(--hb-screen-h); }
  .hb-page .wp-fold { display: none; }
  .hb-door-go { flex: none; display: grid; color: var(--wa-label); opacity: 0; transform: translateX(-3px); transition: opacity .15s ease, transform .15s ease; }
  .hb-door-go svg.ui-icon { width: 14px; height: 14px; }
  a.hb-door:hover .hb-door-go, button.hb-door:hover .hb-door-go,
  a.hb-door:focus-visible .hb-door-go, button.hb-door:focus-visible .hb-door-go { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    button.hb-row, a.hb-link, a.hb-door, button.hb-door, .hb-door-go { transition: none; }
    a.hb-door:hover, button.hb-door:hover { transform: none; }
  }
  /* The rename field, the Remove step and the notes, in the detail. */
  .dev-paired {
    display: flex; align-items: flex-start; gap: 8px; padding: 9px 11px;
    border: 1px solid var(--wa-green); border-radius: 10px;
    font-size: 13px; line-height: 1.4; color: var(--wa-ink);
  }
  .dev-paired svg { flex: none; width: 16px; height: 16px; margin-top: 1px; color: var(--wa-green); }
  .dev-paired b { font-weight: 600; color: var(--wa-green); }
  .hb-ask {
    display: flex; flex-direction: column; gap: 12px; padding: 14px 16px; border-radius: 14px;
    border: 1px solid color-mix(in srgb, var(--error-color) 45%, var(--wa-line)); background: var(--wa-card);
  }
  .hb-ask p { margin: 0; font-size: 13px; line-height: 1.5; color: var(--wa-ink); }
  .hb-ask p.quiet { color: var(--wa-muted); }
  .dev-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .dev-acts button { height: 32px; padding: 0 14px; border-radius: 8px; }
  .dev-acts button.danger { display: inline-flex; align-items: center; gap: 6px; font-weight: 500; }
  .dev-acts button.danger svg.ui-icon { width: 14px; height: 14px; }
  .dev-rename { display: flex; align-items: center; gap: 8px; }
  .dev-rename input { flex: 1; min-width: 0; height: 32px; box-sizing: border-box; }
  .dev-rename button { height: 32px; }
  .dev-small { margin: 0; font-size: 11.5px; color: var(--wa-muted); }
  .dev-err { margin: 0; font-size: 12.5px; color: var(--error-color); }
  /* Pair a device: the transfer dialogs' frame with Home's sheen, a head
     with the link glyph in an outlined chip. */
  dialog.pair-dialog {
    --home-card: linear-gradient(180deg, color-mix(in srgb, var(--wa-ink) 4%, var(--wa-card)), var(--wa-card));
    --home-lift: inset 0 1px 0 color-mix(in srgb, var(--wa-ink) 7%, transparent);
    width: min(580px, calc(100vw - 32px)); border-radius: 16px; border-color: var(--wa-line-strong);
    background: var(--home-card); box-shadow: var(--home-lift), var(--wa-shadow-pop);
  }
  .pair-head { display: flex; align-items: center; gap: 12px; padding: 14px 12px 14px 16px; border-bottom: 1px solid var(--wa-line); flex: none; }
  .pair-chip {
    width: 32px; height: 32px; flex: none; box-sizing: border-box; border-radius: 9px; display: grid; place-items: center;
    border: 1px solid var(--wa-green); color: var(--wa-green);
  }
  .pair-chip svg.ui-icon { width: 16px; height: 16px; }
  .pair-head-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .pair-head h2 { margin: 0; font-size: 12px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; }
  .pair-head-t > span { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .pair-head > button.icon { width: 30px; height: 30px; flex: none; }
  .pair-head > button.icon svg.ui-icon { width: 16px; height: 16px; }
  @media (max-width: 720px) {
    .hb-side { max-width: none; border-right: 0; border-bottom: 1px solid var(--wa-line); }
    .hb-main { padding: 16px 12px 32px; }
    .hb-name h2 { font-size: 24px; }
  }
  @media (max-width: 640px) {
    .home-pad { padding: 14px 12px 32px; }
    .home-head h1 { font-size: 22px; }
  }
`;
