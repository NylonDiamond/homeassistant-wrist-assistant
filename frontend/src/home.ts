// Home, the panel's front page: what it lists and how it looks. The drawing
// itself is `renderHome` in panel.ts, which owns the state it reads; what can
// be worked out without the panel lives here, where a test can reach it.

import { css } from "lit";
import { litOutline } from "./editor-chrome.js";
import type { OwnerSummary } from "./ha-api.js";
import { type DeviceSync, type HomeDevice, deviceSync } from "./send-state.js";
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

/** The hover card's width, and the gap it keeps from its pill and from the
 * window's edges. */
export const DEVICES_POP_WIDTH = 340;
const POP_GAP = 8;

/** Where the devices hover card stands for a pill at `rect`: under it, its
 * edge on the pill's (the right one for a pill on the right), kept inside the
 * window; over it when the pill is
 * in the lower half (a foot line), so the card never runs off the bottom. */
export function devicesPopPlace(
  rect: Pick<DOMRect, "left" | "right" | "top" | "bottom">, width: number, height: number,
): { left: number; top?: number; bottom?: number } {
  const leftSide = (rect.left + rect.right) / 2 < width / 2;
  const want = leftSide ? rect.left : rect.right - DEVICES_POP_WIDTH;
  const left = Math.round(Math.max(POP_GAP, Math.min(want, width - DEVICES_POP_WIDTH - POP_GAP)));
  const under = (rect.top + rect.bottom) / 2 < height / 2;
  return under ? { left, top: Math.round(rect.bottom + POP_GAP) } : { left, bottom: Math.round(height - rect.top + POP_GAP) };
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
  .home-wrap { width: min(1080px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
  .home-head { display: flex; flex-direction: column; gap: 6px; padding: 0 2px; }
  .home-head h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -.02em; }
  .home-lead { margin: 0; font-size: 14px; color: var(--wa-muted); }
  .home-card {
    --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
    display: flex; flex-direction: column; gap: 14px; min-width: 0; box-sizing: border-box;
    padding: 16px; border-radius: var(--wa-lc-r, 12px);
    ${litOutline}
  }
  .home-card.watch { --c: var(--wa-hue-blue); }
  .home-card.complications { --c: var(--wa-hue-pink); }
  .home-card.devices { --c: var(--wa-hue-grey); }
  .home-card-head { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; min-width: 0; }
  .home-chip {
    width: 20px; height: 20px; border-radius: 6px; flex: none; display: grid; place-items: center;
    background: var(--c); color: var(--wa-chip-ink);
  }
  .home-chip svg.ui-icon { width: 12px; height: 12px; stroke-width: 2.4; }
  .home-title { margin: 0; font-size: 12px; font-weight: 500; letter-spacing: .09em; text-transform: uppercase; color: var(--wa-ink); }
  .home-sub { font-size: 12.5px; color: var(--wa-muted); }
  .home-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; align-items: start; }
  .home-screens { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  a.home-screen, button.home-screen {
    display: flex; flex-direction: column; gap: 4px; min-width: 0; box-sizing: border-box; text-align: left;
    padding: 12px 14px; border-radius: 8px; font: inherit; cursor: pointer; text-decoration: none;
    color: var(--wa-ink); background: var(--wa-field); border: 1px solid var(--wa-line-strong);
  }
  a.home-screen:hover, button.home-screen:hover { background: var(--wa-hover); }
  a.home-screen:focus-visible, button.home-screen:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .home-screen b { font-size: 14px; font-weight: 600; }
  .home-screen span { font-size: 12.5px; color: var(--wa-muted); }
  .home-count { display: flex; align-items: baseline; gap: 8px; }
  .home-count b { font-size: 28px; font-weight: 600; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
  .home-count span { color: var(--wa-muted); }
  .home-acts { display: flex; flex-wrap: wrap; gap: 8px; }
  a.home-btn, button.home-btn {
    display: inline-flex; align-items: center; gap: 6px; box-sizing: border-box; height: 30px; padding: 0 12px;
    border-radius: 6px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; text-decoration: none;
    color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
  }
  a.home-btn:hover, button.home-btn:hover:not(:disabled) { background: var(--wa-hover); }
  a.home-btn:focus-visible, button.home-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.home-btn:disabled { opacity: .5; cursor: default; }
  .home-btn svg.ui-icon { width: 14px; height: 14px; }
  .devices-pop {
    position: fixed; z-index: 60; width: 340px; max-width: calc(100vw - 16px); box-sizing: border-box;
    max-height: min(70vh, 520px); overflow: auto; scrollbar-width: thin;
    display: flex; flex-direction: column; gap: 8px; padding: 12px 14px;
    background: var(--wa-card); color: var(--wa-ink); font-size: 13px;
    border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-md, 10px); box-shadow: var(--wa-shadow-pop);
  }
  .devices-pop-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
  .devices-pop .home-device { padding: 6px 0; }
  .devices-pop .home-small, .devices-pop .home-empty { margin: 0; }
  .home-devices { display: flex; flex-direction: column; margin: 0; padding: 0; list-style: none; }
  .home-device { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 8px 0; border-top: 1px solid var(--wa-line); }
  .home-device:first-child { border-top: 0; }
  .home-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: var(--wa-muted); }
  .home-device.synced .home-dot { background: var(--wa-green); }
  .home-device.waiting .home-dot { background: var(--wa-amber); }
  .home-device-name { flex: 1; min-width: 0; display: inline-flex; align-items: center; gap: 6px; }
  /* The name in its own box: an ellipsis only reaches a block, never the
     bare text of a flex row. */
  .home-device-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .home-device-name svg.ui-icon { width: 13px; height: 13px; flex: none; color: var(--wa-muted); }
  .home-device-sync { flex: 0 1 auto; min-width: 0; max-width: 60%; font-size: 12.5px; color: var(--wa-muted); text-align: right; overflow-wrap: anywhere; }
  .home-device.waiting .home-device-sync { color: var(--wa-amber); }
  /* What a waiting device waits for, after the word, in the quiet ink. */
  .home-device.waiting .home-device-why { color: var(--wa-muted); font-weight: 400; }
  .home-small { margin: 0; font-size: 11.5px; color: var(--wa-muted); }
  .home-empty { margin: 0; font-size: 13px; color: var(--wa-muted); }
  @media (max-width: 900px) {
    .home-pair { grid-template-columns: minmax(0, 1fr); }
    .home-screens { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 640px) {
    .home { padding: 14px 12px 32px; }
    .home-head h1 { font-size: 22px; }
    .home-screens { grid-template-columns: minmax(0, 1fr); }
  }
`;
