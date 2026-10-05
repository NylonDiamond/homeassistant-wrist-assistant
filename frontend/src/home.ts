// Home, the panel's front page: what it lists and how it looks. The drawing
// itself is `renderHome` in panel.ts, which owns the state it reads; what can
// be worked out without the panel lives here, where a test can reach it.

import { css } from "lit";
import { litOutline } from "./editor-chrome.js";
import type { OwnerSummary } from "./ha-api.js";
import { type DeviceSync, type HomeDevice, deviceSync } from "./send-state.js";
import { type DeviceKind, deviceKindOf } from "./version.js";

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
  sync: DeviceSync;
}

/** The Devices card's rows: every device the sync rule asks (the Library and
 * orphans left out), watches first and then phones, each group in the
 * order given. */
export function homeDeviceRows(devices: readonly IdHomeDevice[]): HomeDeviceRow[] {
  const rows: HomeDeviceRow[] = [];
  for (const d of devices) {
    const sync = deviceSync(d);
    if (sync === undefined) continue;
    const kind = deviceKindOf({ owner_watch_id: d.id, device_kind: d.kind });
    if (kind === "library") continue;
    rows.push({ id: d.id, name: d.name, kind, sync });
  }
  return [...rows.filter((r) => r.kind === "watch"), ...rows.filter((r) => r.kind === "iphone")];
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
  .home-device-sync { flex: none; font-size: 12.5px; color: var(--wa-muted); }
  .home-device.waiting .home-device-sync { color: var(--wa-amber); }
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
