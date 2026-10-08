// Home, the panel's front page: what it lists and how it looks. The drawing
// itself is `renderHome` in panel.ts, which owns the state it reads; what can
// be worked out without the panel lives here, where a test can reach it.

import { css } from "lit";
import { litOutline } from "./editor-chrome.js";
import type { OwnerSummary } from "./ha-api.js";
import { type DeviceSync, type HomeDevice, deviceSync } from "./send-state.js";
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

/** The few doors at the foot of a device's card on Home: the sheet's own
 * tabs, cut to the ones a household opens most. A watch has its
 * complications, its pages and its settings (the last two an
 * administrator's); an iPhone has its widgets. The sheet has the rest. */
export function deviceCardDoors(kind: "watch" | "iphone", admin: boolean): DeviceSheetTab[] {
  return deviceSheetTabs(kind, admin).filter((t) => t.kind === "list"
    ? t.filter === "all"
    : t.screen.id === "pages" || t.screen.id === WATCH_SETTINGS_SCREEN.id);
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
  .home-wrap { width: min(1200px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
  .home-head { display: flex; align-items: flex-end; flex-wrap: wrap; gap: 12px 16px; padding: 0 2px; }
  .home-head-text { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .home-head h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -.02em; }
  .home-lead { margin: 0; font-size: 14px; color: var(--wa-muted); }
  .home-title { margin: 0; font-size: 12px; font-weight: 500; letter-spacing: .09em; text-transform: uppercase; color: var(--wa-ink); }
  a.home-btn, button.home-btn {
    display: inline-flex; align-items: center; gap: 6px; box-sizing: border-box; height: 30px; padding: 0 12px;
    border-radius: 6px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; text-decoration: none;
    color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
  }
  a.home-btn:hover, button.home-btn:hover:not(:disabled) { background: var(--wa-hover); }
  a.home-btn:focus-visible, button.home-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.home-btn:disabled { opacity: .5; cursor: default; }
  .home-btn svg.ui-icon { width: 14px; height: 14px; }
  /* The devices, one card each, as many to a row as fit. A card's outline is
     lit in its state's color: green for synced, amber for waiting, grey for
     nothing waiting. */
  .home-devices {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr)); gap: 14px;
    margin: 0; padding: 0; list-style: none;
  }
  .home-device {
    --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid); --c: var(--wa-hue-grey);
    position: relative; display: flex; flex-direction: column; gap: 14px; min-width: 0; box-sizing: border-box;
    padding: 16px; border-radius: var(--wa-lc-r, 12px);
    ${litOutline}
  }
  .home-device.synced { --c: var(--wa-green); }
  .home-device.waiting { --c: var(--wa-amber); }
  .home-device:hover { --lo-fill: var(--wa-hover); }
  /* The whole card opens the device's sheet: the name's button reaches over
     the card, and the doors at the foot sit above it. */
  button.home-device-open {
    all: unset; cursor: pointer; min-width: 0;
  }
  button.home-device-open::after { content: ""; position: absolute; inset: 0; border-radius: inherit; }
  .home-device:has(button.home-device-open:focus-visible) { box-shadow: var(--wa-ring); }
  .home-device-top { display: flex; align-items: center; gap: 14px; min-width: 0; }
  /* The device itself, drawn with one shape lit in the card's color. */
  .home-device-art { flex: none; display: grid; place-items: center; width: 52px; height: 64px; color: var(--c); }
  .home-device-art .shape-art { width: 46px; height: 60px; display: block; }
  .home-device-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
  .home-device-name { min-width: 0; display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 600; }
  /* The name in its own box: an ellipsis only reaches a block, never the
     bare text of a flex row. */
  .home-device-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .home-device-facts { font-size: 12px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .home-device-sync { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .home-device.synced .home-device-sync b { color: var(--wa-green); }
  .home-device.waiting .home-device-sync b { color: var(--wa-amber); }
  .home-device-sync b { font-weight: 600; }
  .home-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: var(--wa-muted); }
  .home-device.synced .home-dot { background: var(--wa-green); }
  .home-device.waiting .home-dot { background: var(--wa-amber); }
  /* What a waiting device waits for, after the word, in the quiet ink. */
  .home-device-why { color: var(--wa-muted); font-weight: 400; }
  /* A right-pointing chevron: the down one, turned. */
  .home-device-go { display: inline-flex; flex: none; align-self: flex-start; color: var(--wa-muted); transform: rotate(-90deg); }
  .home-device-go svg.ui-icon { width: 13px; height: 13px; }
  .home-device-doors { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; }
  a.home-door, button.home-door {
    display: inline-flex; align-items: center; gap: 6px; box-sizing: border-box; height: 26px; padding: 0 10px;
    border-radius: 6px; font: inherit; font-size: 12px; font-weight: 550; cursor: pointer; white-space: nowrap; text-decoration: none;
    color: var(--wa-ink); background: var(--wa-field); border: 1px solid var(--wa-line-strong);
  }
  a.home-door:hover, button.home-door:hover { background: var(--wa-card); }
  a.home-door:focus-visible, button.home-door:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .home-door-n { font-variant-numeric: tabular-nums; color: var(--wa-muted); }
  /* Pair a device, the grid's last card: a dashed outline, nothing lit. */
  button.home-device-add {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 150px;
    box-sizing: border-box; padding: 16px; border-radius: var(--wa-lc-r, 12px); font: inherit; cursor: pointer;
    color: var(--wa-muted); background: transparent; border: 1.5px dashed var(--wa-line-strong);
  }
  button.home-device-add:hover { color: var(--wa-ink); border-color: var(--wa-muted); background: var(--wa-hover); }
  button.home-device-add:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.home-device-add b { font-size: 14px; font-weight: 600; color: var(--wa-ink); }
  button.home-device-add span { font-size: 12.5px; }
  button.home-device-add svg.ui-icon { width: 20px; height: 20px; }
  /* The device sheet: one device's state, a few of its designs, and Forget.
     The dialog's frame is the transfer dialogs' (dialog.xf). */
  dialog.dev-dialog { width: min(560px, calc(100vw - 32px)); }
  /* The sheet's tabs: a door to each of the device's pages, wrapping onto a
     second line on a narrow screen. Outlined like every Home control. */
  .dev-tabs { display: flex; flex-wrap: wrap; gap: 12px 14px; padding: 7px 7px 0 0; }
  a.dev-tab, button.dev-tab {
    position: relative; display: inline-flex; align-items: center; box-sizing: border-box; height: 28px; padding: 0 10px;
    border-radius: 6px; font: inherit; font-size: 12.5px; font-weight: 550; cursor: pointer; white-space: nowrap; text-decoration: none;
    color: var(--wa-ink); background: var(--wa-field); border: 1px solid var(--wa-line-strong);
  }
  a.dev-tab:hover, button.dev-tab:hover { background: var(--wa-hover); }
  a.dev-tab:focus-visible, button.dev-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* How many the page holds on this device, as a badge on the tab's top
     right corner. None is drawn quieter, so a full tab stands out. */
  .dev-tab-n {
    position: absolute; top: -7px; right: -7px; min-width: 16px; height: 16px; box-sizing: border-box; padding: 0 4px;
    border-radius: 999px; display: grid; place-items: center;
    font-size: 10.5px; font-weight: 650; line-height: 1; font-variant-numeric: tabular-nums;
    background: var(--wa-ink); color: var(--wa-bg);
  }
  .dev-tab-n.none { background: var(--wa-line-strong); color: var(--wa-muted); }
  .dev-state { display: flex; align-items: center; gap: 8px; font-size: 13px; }
  .dev-state.synced .home-dot { background: var(--wa-green); }
  .dev-state.waiting .home-dot { background: var(--wa-amber); }
  .dev-state.waiting b { color: var(--wa-amber); }
  .dev-state b { font-weight: 600; }
  .dev-state .home-device-why { color: var(--wa-muted); }
  .dev-paired {
    display: flex; align-items: flex-start; gap: 8px; padding: 9px 11px;
    border: 1px solid var(--wa-green); border-radius: 10px;
    font-size: 13px; line-height: 1.4; color: var(--wa-ink);
  }
  .dev-paired svg { flex: none; width: 16px; height: 16px; margin-top: 1px; color: var(--wa-green); }
  .dev-paired b { font-weight: 600; color: var(--wa-green); }
  .dev-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .dev-acts .dev-forget { margin-left: auto; }
  .dev-acts button { height: 32px; padding: 0 14px; }
  .dev-acts button.danger { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; }
  .dev-acts button.danger svg.ui-icon { width: 14px; height: 14px; }
  .dev-rename { display: flex; align-items: center; gap: 8px; }
  .dev-rename input { flex: 1; min-width: 0; height: 32px; box-sizing: border-box; }
  .dev-rename button { height: 32px; }
  .dev-small { margin: 0; font-size: 11.5px; color: var(--wa-muted); }
  .xf-head button.dev-rename-open { height: 28px; padding: 0 10px; font-size: 12.5px; }
  .dev-err { margin: 0; font-size: 12.5px; color: var(--error-color); }
  .home-small { margin: 0; font-size: 11.5px; color: var(--wa-muted); }
  .home-empty { margin: 0; font-size: 13px; color: var(--wa-muted); }
  @media (max-width: 640px) {
    .home { padding: 14px 12px 32px; }
    .home-head h1 { font-size: 22px; }
  }
`;
