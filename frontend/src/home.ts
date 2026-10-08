// Home, the panel's front page: what it lists and how it looks. The drawing
// itself is `renderHome` in panel.ts, which owns the state it reads; what can
// be worked out without the panel lives here, where a test can reach it.

import { css } from "lit";
import { litOutline } from "./editor-chrome.js";
import type { OwnerSummary, WatchConfigSummary } from "./ha-api.js";
import type { Person } from "./people.js";
import { type DeviceSync, type HomeDevice, agoWords, deviceSync } from "./send-state.js";
import { type WatchScreen, WATCH_SCREENS, WATCH_SETTINGS_SCREEN } from "./shell.js";
import { type DeviceKind, deviceKindOf } from "./version.js";
import { type WatchAppSync, deviceVerdict } from "./watch-app-sync.js";

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
  /** The worse of its complications and, on a watch, its watch app. */
  sync: DeviceSync;
  /** What it is waiting for, empty unless `sync` is waiting. */
  waitingFor: string[];
}

/** The Devices card's rows: every device the sync rule asks (the Library and
 * orphans left out), watches first and then phones, each group in the
 * order given. A watch with a watch app reading in `watchApp` takes the
 * worse of that and its complications (`deviceVerdict`); every other device
 * is judged on its complications alone. */
export function homeDeviceRows(devices: readonly IdHomeDevice[], watchApp: ReadonlyMap<string, WatchAppSync> = new Map()): HomeDeviceRow[] {
  const rows: HomeDeviceRow[] = [];
  for (const d of devices) {
    const complications = deviceSync(d);
    if (complications === undefined) continue;
    const kind = deviceKindOf({ owner_watch_id: d.id, device_kind: d.kind });
    if (kind === "library") continue;
    const { sync, waitingFor } = deviceVerdict(complications, kind === "watch" ? watchApp.get(d.id) : undefined);
    rows.push({ id: d.id, name: d.name, kind, sync, waitingFor });
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
 * The device sheet's tabs, each opening its page on this device. A watch has
 * its complications, then every watch screen that belongs to one watch, then
 * Settings; HTTP actions and Cameras are the home's, not a watch's, so they
 * stay on Home's Watch app card. An iPhone has its widgets and its Control
 * Center controls, which is all the panel holds for a phone. The watch
 * screens are an administrator's, as on Home.
 */
export function deviceSheetTabs(kind: "watch" | "iphone", admin: boolean): DeviceSheetTab[] {
  if (kind === "iphone") {
    return [
      { kind: "list", label: "Widgets", filter: "all" },
      { kind: "list", label: "Control Center", filter: "control" },
    ];
  }
  const tabs: DeviceSheetTab[] = [{ kind: "list", label: "Complications", filter: "all" }];
  if (!admin) return tabs;
  for (const screen of [...WATCH_SCREENS.filter((s) => s.shared !== true), WATCH_SETTINGS_SCREEN]) {
    const count = SCREEN_COUNTS[screen.id];
    tabs.push(count === undefined ? { kind: "screen", label: screen.label, screen } : { kind: "screen", label: screen.label, screen, count });
  }
  return tabs;
}

/** The count tiles on a device's card on Home, each a door to that page on
 * this device: the sheet's tabs that carry a count. A watch has its
 * complications, then its pages, status pages and Control Center (an
 * administrator's); an iPhone has its widgets and its Control Center
 * controls. Settings, which counts nothing, is the card's own door. */
export function deviceCardTiles(kind: "watch" | "iphone", admin: boolean): DeviceSheetTab[] {
  return deviceSheetTabs(kind, admin).filter((t) => t.kind === "list" || t.count !== undefined);
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

/** Each watch's item counts, read off the watch config summary's `items`.
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

/** What a device's next pull brings, when it brings anything. */
export function pendingWords(owner: Pick<OwnerSummary, "pending_changes"> | undefined): string | undefined {
  const n = owner?.pending_changes;
  if (typeof n !== "number" || n <= 0) return undefined;
  return `${n} ${n === 1 ? "change" : "changes"} to pick up`;
}

/** Home's totals: how many devices, and how many are synced, waiting, or
 * have nothing waiting and never synced. */
export function homeTotals(rows: readonly Pick<HomeDeviceRow, "sync">[]): { all: number; synced: number; waiting: number; idle: number } {
  const count = (s: DeviceSync) => rows.filter((r) => r.sync === s).length;
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
 * Home's look, added to the panel's sheet. Black ground, graphite cards,
 * neutral controls each with a one pixel outline. A section's hue shows in
 * three places only: its card's lit outline, the chip behind its title glyph,
 * and a dot. Titles are small capitals, weight 500, spaced. Every color is a
 * panel token, so the light skin reads as well as the dark one.
 */
export const homeStyles = css`
  .home {
    flex: 1 1 auto; min-height: 0; overflow: auto; box-sizing: border-box;
    padding: clamp(20px, 4vh, 40px) clamp(16px, 4vw, 40px) 48px;
    background: var(--wa-bg); color: var(--wa-ink);
  }
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
  /* The status row: the totals beside the devices that still wait, wrapping
     onto two rows when the page is narrow. */
  .home-status { display: flex; flex-wrap: wrap; gap: 12px; align-items: stretch; }
  .home-totals {
    flex: 3 1 520px; min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    border-radius: 12px; border: 1px solid var(--wa-line); background: var(--home-card); box-shadow: var(--home-lift); overflow: hidden;
  }
  .home-total { min-width: 0; padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; border-right: 1px solid var(--wa-line); }
  .home-total:last-child { border-right: 0; }
  .home-total-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 10.5px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--wa-muted);
  }
  .home-total-n { font-size: 34px; font-weight: 300; letter-spacing: -.02em; line-height: 1; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .home-total-n small { margin-left: 5px; font-size: 13px; font-weight: 400; letter-spacing: 0; color: var(--wa-muted); }
  .home-total-sub { font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); overflow-wrap: anywhere; }
  /* Every device as a share of one thin bar: synced, waiting, never synced. */
  .home-bar { display: flex; gap: 3px; }
  .home-bar i { height: 3px; border-radius: 2px; background: var(--wa-line-strong); }
  .home-bar i.synced { background: var(--wa-green); }
  .home-bar i.waiting { background: var(--wa-amber); }
  /* Needs attention: the waiting devices, one line each. Lit amber while any
     waits; a quiet card with a green check when none does. */
  .home-attn {
    --c: var(--wa-green);
    flex: 2 1 360px; min-width: 0; box-sizing: border-box; display: flex; flex-direction: column; padding: 14px 16px;
    border-radius: 12px; border: 1px solid var(--wa-line); background: var(--home-card); box-shadow: var(--home-lift);
  }
  .home-attn.on {
    --c: var(--wa-amber); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
    ${litOutline}
    border-width: 1px;
  }
  .home-attn-head { display: flex; align-items: center; gap: 8px; padding-bottom: 8px; }
  .home-attn-n { font-size: 12px; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
  .home-chip {
    width: 20px; height: 20px; flex: none; box-sizing: border-box; border-radius: 6px; display: grid; place-items: center;
    border: 1px solid var(--c); color: var(--c);
  }
  .home-chip svg.ui-icon { width: 12px; height: 12px; }
  .home-attn-row { display: flex; align-items: center; gap: 12px; min-width: 0; padding: 9px 0; border-top: 1px solid var(--wa-line); }
  .home-attn-who { width: 6px; height: 6px; flex: none; border-radius: 50%; background: var(--c); }
  .home-attn-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
  .home-attn-text b, .home-attn-text span { overflow-wrap: anywhere; }
  .home-attn-text b { font-size: 13px; font-weight: 500; }
  .home-attn-text span { font-size: 11.5px; color: var(--wa-muted); }
  .home-attn-ok { margin: 0; padding: 10px 0 2px; border-top: 1px solid var(--wa-line); font-size: 12.5px; color: var(--wa-muted); }
  /* One person's devices: the person on the left, their picture or initial
     ringed in their color (--c, the color their devices wear on the
     Complications tab), and their devices beside them. */
  .home-person { display: flex; flex-wrap: wrap; gap: 20px; min-width: 0; padding-top: 22px; border-top: 1px solid var(--wa-line); }
  .home-person-head { flex: 0 0 160px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .home-avatar {
    width: 36px; height: 36px; flex: none; box-sizing: border-box; border-radius: 50%; overflow: hidden;
    display: grid; place-items: center; border: 1.5px solid var(--c); background: var(--wa-field);
    font-size: 14px; font-weight: 600; color: var(--c);
  }
  .home-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .home-person-name { margin: 4px 0 0; min-width: 0; font-size: 16px; font-weight: 500; letter-spacing: -.01em; overflow-wrap: anywhere; }
  .home-person-n { font-size: 11.5px; color: var(--wa-muted); }
  .home-person-sum { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--wa-label); }
  /* The devices, one card each, as many to a row as fit. */
  .home-devices {
    flex: 999 1 560px; min-width: 0; align-content: start;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(min(196px, 100%), 1fr)); gap: 10px;
    margin: 0; padding: 0; list-style: none;
  }
  .home-device {
    position: relative; display: flex; flex-direction: column; gap: 10px; min-width: 0; box-sizing: border-box;
    padding: 8px; border-radius: 12px; background: var(--home-card); border: 1px solid var(--wa-line); box-shadow: var(--home-lift);
  }
  .home-device:hover { border-color: var(--wa-line-strong); }
  /* A waiting device is lit amber from its top left corner. */
  .home-device.waiting {
    background:
      linear-gradient(var(--wa-card), var(--wa-card)) padding-box,
      linear-gradient(140deg, var(--wa-amber) 0%, color-mix(in srgb, var(--wa-amber) 33%, transparent) 30%,
        var(--wa-card-mid) 62%, color-mix(in srgb, var(--wa-amber) 25%, transparent) 100%) border-box;
    border-color: transparent;
  }
  /* The device, standing in a soft light from above. */
  .home-stage {
    height: 148px; border-radius: 8px; display: grid; place-items: center;
    background: linear-gradient(180deg, color-mix(in srgb, var(--wa-ink) 8%, var(--wa-bg)) 0%, var(--wa-bg) 80%);
  }
  .ha-art { display: block; }
  .ha-lit { stroke: var(--c); }
  .ha-lit-fill { fill: var(--c); }
  .ha-edge-wait { stroke: var(--wa-amber); stroke-opacity: .7; }
  /* The whole card opens the device's sheet: the name's button reaches over
     the card, and the count doors sit above it. */
  button.home-device-open { all: unset; cursor: pointer; flex: 1; min-width: 0; }
  button.home-device-open::after { content: ""; position: absolute; inset: 0; border-radius: inherit; }
  .home-device:has(button.home-device-open:focus-visible) { box-shadow: var(--wa-ring); }
  .home-device-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; padding: 0 4px; }
  .home-device-line { display: flex; align-items: flex-start; gap: 8px; min-width: 0; line-height: 1.35; }
  .home-device-name { min-width: 0; display: flex; align-items: center; font-size: 13px; font-weight: 500; }
  /* The name in its own box, wrapping onto as many lines as it needs: Home
     shows every word, never an ellipsis. */
  .home-device-label { min-width: 0; overflow-wrap: anywhere; }
  .home-device-sync { flex: none; display: flex; align-items: center; gap: 5px; font-size: 11px; line-height: 17.5px; color: var(--wa-muted); }
  .home-device-sync b { font-weight: 500; }
  .home-device.synced .home-device-sync b { color: var(--wa-green); }
  .home-device.waiting .home-device-sync b { color: var(--wa-amber); }
  .home-device.synced .home-dot { background: var(--wa-green); }
  .home-device.waiting .home-dot { background: var(--wa-amber); }
  /* What it is, then one fact to a line, each wrapping rather than cut. */
  .home-device-facts { display: flex; flex-direction: column; gap: 1px; font-size: 11px; line-height: 1.35; color: var(--wa-muted); overflow-wrap: anywhere; }
  /* What a waiting device waits for and what its next pull brings. */
  .home-device-why { font-size: 11px; color: var(--wa-label); overflow-wrap: anywhere; }
  /* A small door per page that counts something, each opening that page on
     this device: its number, then its name. */
  .home-tiles { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 4px; padding: 8px 4px 2px; border-top: 1px solid var(--wa-line); margin-top: auto; }
  a.home-tile, button.home-tile {
    display: inline-flex; align-items: center; gap: 4px; box-sizing: border-box; height: 22px; padding: 0 7px;
    border-radius: 6px; font: inherit; font-size: 11px; cursor: pointer; text-decoration: none; white-space: nowrap;
    color: var(--wa-muted); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  a.home-tile:hover, button.home-tile:hover { color: var(--wa-ink); background: var(--wa-hover); }
  a.home-tile:focus-visible, button.home-tile:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .home-tile b { font-weight: 600; color: var(--wa-ink); font-variant-numeric: tabular-nums; }
  .home-tile b.none { font-weight: 500; color: var(--wa-muted); }
  a.home-door, button.home-door {
    display: inline-flex; align-items: center; gap: 6px; box-sizing: border-box; height: 26px; padding: 0 10px;
    border-radius: 6px; font: inherit; font-size: 11.5px; font-weight: 500; cursor: pointer; white-space: nowrap; text-decoration: none;
    color: var(--wa-ink); background: var(--wa-field); border: 1px solid var(--wa-line-strong);
  }
  a.home-door:hover, button.home-door:hover { background: var(--wa-hover); }
  a.home-door:focus-visible, button.home-door:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* Pair a device, the only card in a home with no devices yet: a dashed
     outline, nothing lit. */
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
  /* The device sheet: the device's card opened up. The device on its stage
     in its person's color (--c, set on the dialog), whose it is, its sync
     state in a well, and a tile per page. The frame is the transfer
     dialogs' (dialog.xf), given Home's sheen; the dialog sits outside .home,
     so it carries the sheen's tokens itself. */
  dialog.dev-dialog {
    --home-card: linear-gradient(180deg, color-mix(in srgb, var(--wa-ink) 4%, var(--wa-card)), var(--wa-card));
    --home-lift: inset 0 1px 0 color-mix(in srgb, var(--wa-ink) 7%, transparent);
    width: min(600px, calc(100vw - 32px)); border-radius: 16px; border-color: var(--wa-line-strong);
    background: var(--home-card); box-shadow: var(--home-lift), var(--wa-shadow-pop);
  }
  /* Pair a device: the same frame and sheen, a head with the link glyph in
     an outlined chip. */
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
  .dev-hero { display: flex; align-items: center; gap: 16px; padding: 16px 12px 16px 16px; border-bottom: 1px solid var(--wa-line); flex: none; }
  .dev-stage {
    flex: none; width: 96px; height: 112px; box-sizing: border-box; border-radius: 12px; display: grid; place-items: center;
    border: 1px solid var(--wa-line);
    background: linear-gradient(180deg, color-mix(in srgb, var(--wa-ink) 8%, var(--wa-bg)) 0%, var(--wa-bg) 85%);
  }
  .dev-stage svg.ha-art { width: auto; height: 92px; }
  dialog.dev-dialog.waiting .dev-stage { border-color: color-mix(in srgb, var(--wa-amber) 45%, var(--wa-line)); }
  .dev-hero-t { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  .dev-whose {
    display: flex; align-items: center; gap: 6px; min-width: 0; overflow-wrap: anywhere;
    font-size: 10.5px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--wa-muted);
  }
  .dev-whose i { width: 6px; height: 6px; flex: none; border-radius: 50%; background: var(--c); }
  .dev-hero h2 { margin: 0; font-size: 20px; font-weight: 500; letter-spacing: -.01em; line-height: 1.25; overflow-wrap: anywhere; }
  .dev-facts { font-size: 12px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  .dev-hero-acts { flex: none; align-self: flex-start; display: flex; align-items: center; gap: 6px; }
  .dev-hero-acts button.icon { width: 30px; height: 30px; }
  .dev-hero-acts button.icon svg.ui-icon { width: 16px; height: 16px; }
  .dev-hero button.dev-rename-open { height: 28px; padding: 0 11px; font-size: 12px; }
  /* The sync state in a sunken well: a chip in the state's color, its word
     and what it means, and when the device was last heard from. */
  .dev-state {
    --s: var(--wa-muted);
    display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px;
    border: 1px solid var(--wa-line); background: color-mix(in srgb, var(--wa-bg) 45%, var(--wa-card));
  }
  .dev-state.synced { --s: var(--wa-green); }
  .dev-state.waiting { --s: var(--wa-amber); border-color: color-mix(in srgb, var(--wa-amber) 45%, var(--wa-line)); }
  .dev-state-chip {
    width: 28px; height: 28px; flex: none; box-sizing: border-box; border-radius: 8px; display: grid; place-items: center;
    border: 1px solid var(--s); color: var(--s);
  }
  .dev-state-chip svg.ui-icon { width: 14px; height: 14px; }
  .dev-state-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .dev-state-t b { font-size: 13.5px; font-weight: 500; color: var(--s); }
  .dev-state-t span { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .dev-state-seen { flex: none; font-size: 11.5px; color: var(--wa-muted); }
  .dev-title { margin: 2px 0 -8px; font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--wa-muted); }
  /* A tile per page, each opening it on this device: its name, how many it
     holds, and an arrow. Outlined like every Home control; the person's
     color lights the outline under the pointer. */
  .dev-tabs { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(164px, 100%), 1fr)); gap: 8px; }
  a.dev-tab, button.dev-tab {
    display: flex; align-items: center; gap: 8px; box-sizing: border-box; min-height: 44px; padding: 6px 8px 6px 14px;
    border-radius: 10px; font: inherit; font-size: 13px; font-weight: 500; text-align: left; cursor: pointer; text-decoration: none;
    color: var(--wa-ink); background: var(--home-card); border: 1px solid var(--wa-line-strong); box-shadow: var(--home-lift);
  }
  a.dev-tab:hover, button.dev-tab:hover { border-color: var(--c); background: var(--wa-hover); }
  a.dev-tab:focus-visible, button.dev-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .dev-tab-l { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  /* How many the page holds on this device. None is drawn quieter, so a
     full tile stands out. */
  .dev-tab-n { flex: none; font-size: 18px; font-weight: 300; line-height: 1; font-variant-numeric: tabular-nums; color: var(--wa-ink); }
  .dev-tab-n.none { color: var(--wa-muted); }
  .dev-tab-go { flex: none; display: grid; color: var(--wa-muted); }
  .dev-tab-go svg.ui-icon { width: 14px; height: 14px; }
  a.dev-tab:hover .dev-tab-go, button.dev-tab:hover .dev-tab-go { color: var(--c); }
  .dev-paired {
    display: flex; align-items: flex-start; gap: 8px; padding: 9px 11px;
    border: 1px solid var(--wa-green); border-radius: 10px;
    font-size: 13px; line-height: 1.4; color: var(--wa-ink);
  }
  .dev-paired svg { flex: none; width: 16px; height: 16px; margin-top: 1px; color: var(--wa-green); }
  .dev-paired b { font-weight: 600; color: var(--wa-green); }
  /* The foot: Remove device on its own, under a hairline, outlined in red
     rather than filled, since it is the one thing here that cannot be
     undone. Its confirm step fills it. */
  .dev-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding-top: 14px; border-top: 1px solid var(--wa-line); }
  .dev-acts .dev-forget { margin-left: auto; }
  .dev-acts button { height: 32px; padding: 0 14px; border-radius: 8px; }
  .dev-acts button.danger { display: inline-flex; align-items: center; gap: 6px; font-weight: 500; }
  .dev-acts button.danger.dev-forget {
    color: var(--error-color); background: transparent;
    border: 1px solid color-mix(in srgb, var(--error-color) 50%, var(--wa-line));
  }
  .dev-acts button.danger.dev-forget:hover { background: color-mix(in srgb, var(--error-color) 10%, transparent); }
  .dev-acts button.danger svg.ui-icon { width: 14px; height: 14px; }
  .dev-rename { display: flex; align-items: center; gap: 8px; }
  .dev-rename input { flex: 1; min-width: 0; height: 32px; box-sizing: border-box; }
  .dev-rename button { height: 32px; }
  .dev-small { margin: 0; font-size: 11.5px; color: var(--wa-muted); }
  .dev-err { margin: 0; font-size: 12.5px; color: var(--error-color); }
  .home-small { margin: 0; font-size: 11.5px; color: var(--wa-muted); }
  .home-empty { margin: 0; font-size: 13px; color: var(--wa-muted); }
  @media (max-width: 640px) {
    .home { padding: 14px 12px 32px; }
    .home-head h1 { font-size: 22px; }
    /* The person goes on one line above their devices. */
    .home-person-head { flex-basis: 100%; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 6px 10px; }
    .home-person-name { margin: 0; }
    /* The sheet's stage shrinks, so the name keeps its room beside it. */
    .dev-hero { gap: 12px; padding: 12px 8px 12px 12px; }
    .dev-stage { width: 68px; height: 84px; }
    .dev-stage svg.ha-art { height: 66px; }
    .dev-hero h2 { font-size: 17px; }
  }
`;
