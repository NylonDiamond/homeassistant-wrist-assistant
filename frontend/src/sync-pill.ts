// The home's one sync pill, in the top bar on every screen (2026-10-31
// review, fix 8; mock-home item 2). It says in one place whether every
// watch and iPhone has your latest changes, and opens a popover listing each
// device: Synced, Waiting (and for what), or Asleep.
//
// Asleep is new: a device not seen for a week or more (`ASLEEP_AFTER_DAYS`)
// that would otherwise wait. Its changes wait safely and it catches up when
// it next connects, so it no longer counts as waiting: "waiting" only means
// something you can act on. A synced device stays Synced however long it has
// been away; it has nothing to catch up on.
//
// The pill replaces the page-specific waiting strips: the amber "Waiting:"
// row over the Complications list and the editor's device sync pill.
//
// Pure model first (`syncPillDevices`, `syncStateOf`, `syncPillSummary`,
// `syncRowWords`), then the drawing (`renderSyncPill`) and its look
// (`syncPillStyles`). The Devices tab reads the same model for its rows.

import { css, html, nothing, type TemplateResult } from "lit";
import type { OwnerSummary } from "./ha-api.js";
import { type HomeDeviceRow, NOT_SYNCED_TEXT, needsAttention } from "./home.js";
import type { DeviceSync } from "./send-state.js";
import { isPlainClick } from "./shell.js";
import { uiIcon } from "./ui-icons.js";
import { waitingForText } from "./watch-app-sync.js";

/** A device unseen this many days or more, that would otherwise wait, is
 * asleep. */
export const ASLEEP_AFTER_DAYS = 7;

const DAY_SECONDS = 86_400;

/** One device as the pill and its popover read it. */
export interface SyncPillDevice {
  id: string;
  name: string;
  kind: "watch" | "iphone";
  /** Whose it is, under the name in the popover. */
  person?: string;
  /** Its color var (`device-colors.ts`). */
  color?: string;
  /** The home's verdict on it (`homeDeviceRows`). */
  sync: DeviceSync;
  /** What it waits for, when `sync` is waiting. */
  waitingFor: readonly string[];
  /** The parts whose last save it reported it could not use. */
  rejected?: readonly string[];
  /** Seconds since it was last heard from, aged to now: 0 while it holds a
   * long-poll, undefined when the server has not heard from it since it
   * started. */
  seenSeconds?: number;
}

/** Where one device stands, as the pill words it. */
export type SyncPillState = "synced" | "waiting" | "asleep" | "idle";

/** Whole days since a device was seen, or undefined when unknown. */
export function seenDays(seconds: number | undefined): number | undefined {
  return seconds === undefined ? undefined : Math.floor(seconds / DAY_SECONDS);
}

/** Whether a device counts as asleep: unseen for `ASLEEP_AFTER_DAYS` or
 * more, with something it would otherwise wait for. */
export function isAsleep(d: Pick<SyncPillDevice, "sync" | "rejected" | "seenSeconds">): boolean {
  const days = seenDays(d.seenSeconds);
  if (days === undefined || days < ASLEEP_AFTER_DAYS) return false;
  return needsAttention({ sync: d.sync, ...(d.rejected === undefined ? {} : { rejected: [...d.rejected] }) });
}

/** One device's state: asleep first (`isAsleep`), then waiting (a device
 * that could not use the last save waits too), then synced, else idle (it
 * has never synced and has nothing to receive). */
export function syncStateOf(d: Pick<SyncPillDevice, "sync" | "rejected" | "seenSeconds">): SyncPillState {
  if (isAsleep(d)) return "asleep";
  if (needsAttention({ sync: d.sync, ...(d.rejected === undefined ? {} : { rejected: [...d.rejected] }) })) return "waiting";
  return d.sync === "synced" ? "synced" : "idle";
}

/** A device's words in the popover, and on its row on the Devices tab:
 * "Synced", "Waiting: menus", "Not synced", "Asleep · 15 days", "Nothing
 * waiting". */
export function syncRowWords(d: Pick<SyncPillDevice, "sync" | "waitingFor" | "rejected" | "seenSeconds">): string {
  switch (syncStateOf(d)) {
    case "asleep": return `Asleep · ${asleepDaysWords(seenDays(d.seenSeconds) ?? ASLEEP_AFTER_DAYS)}`;
    case "waiting":
      if ((d.rejected?.length ?? 0) > 0) return NOT_SYNCED_TEXT;
      return d.waitingFor.length === 0 ? "Waiting" : `Waiting: ${waitingForText(d.waitingFor)}`;
    case "synced": return "Synced";
    case "idle": return "Nothing waiting";
  }
}

/** "1 day", "15 days". */
export function asleepDaysWords(days: number): string {
  return `${days} ${days === 1 ? "day" : "days"}`;
}

/** An asleep device's words in its row on the Devices tab, after what it
 * holds: "asleep, 15 days". */
export function asleepRowWords(d: Pick<SyncPillDevice, "seenSeconds">): string {
  return `asleep, ${asleepDaysWords(seenDays(d.seenSeconds) ?? ASLEEP_AFTER_DAYS)}`;
}

/** The devices for the pill, from the home's rows (`homeDeviceRows`) in the
 * order to list them, with what the owners list says of each: when it was
 * last heard from, aged by `elapsed` seconds since the list was read. */
export function syncPillDevices(
  rows: readonly HomeDeviceRow[],
  ownerOf: (id: string) => Pick<OwnerSummary, "polling" | "last_seen_seconds"> | undefined,
  elapsed: number,
  extra: { personOf?: (id: string) => string | undefined; colorOf?: (id: string) => string | undefined } = {},
): SyncPillDevice[] {
  return rows.map((row) => {
    const owner = ownerOf(row.id);
    const seconds = owner?.polling === true ? 0
      : typeof owner?.last_seen_seconds === "number" ? owner.last_seen_seconds + Math.max(0, elapsed) : undefined;
    // A person named after the device (none is linked) says nothing new.
    const owned = extra.personOf?.(row.id);
    const person = owned?.trim().toLocaleLowerCase() === row.name.trim().toLocaleLowerCase() ? undefined : owned;
    const color = extra.colorOf?.(row.id);
    return {
      id: row.id, name: row.name, kind: row.kind, sync: row.sync, waitingFor: row.waitingFor,
      ...(row.rejected === undefined ? {} : { rejected: row.rejected }),
      ...(seconds === undefined ? {} : { seenSeconds: seconds }),
      ...(person === undefined ? {} : { person }),
      ...(color === undefined ? {} : { color }),
    };
  });
}

/** What the pill says for the whole home. */
export interface SyncPillSummary {
  /** amber while any device waits, green once the rest are synced, grey
   * when nothing is synced or waiting (every device asleep or idle). */
  tone: "wait" | "ok" | "quiet";
  /** "Waiting · 1", "Synced", "Asleep · 2". */
  label: string;
  /** "· 2 asleep" after the label, in the quiet ink; empty when none. */
  more: string;
  /** The pill's tooltip and accessible name. */
  title: string;
  waiting: number;
  asleep: number;
  synced: number;
  all: number;
}

export function syncPillSummary(devices: readonly SyncPillDevice[]): SyncPillSummary {
  const states = devices.map(syncStateOf);
  const count = (s: SyncPillState) => states.filter((x) => x === s).length;
  const waiting = count("waiting");
  const asleep = count("asleep");
  const synced = count("synced");
  const all = devices.length;
  const more = asleep > 0 && (waiting > 0 || synced > 0) ? `· ${asleep} asleep` : "";
  const sleepWords = asleep === 0 ? "" : ` ${asleep} ${asleep === 1 ? "is" : "are"} asleep.`;
  if (waiting > 0) {
    const names = devices.filter((_, i) => states[i] === "waiting").map((d) => d.name).join(", ");
    return { tone: "wait", label: `Waiting · ${waiting}`, more, title: `Waiting for your latest changes: ${names}.${sleepWords} Show each device.`, waiting, asleep, synced, all };
  }
  if (synced > 0) {
    return { tone: "ok", label: "Synced", more, title: `Every device that is awake has your latest changes.${sleepWords} Show each device.`, waiting, asleep, synced, all };
  }
  if (asleep > 0) {
    return { tone: "quiet", label: `Asleep · ${asleep}`, more: "", title: `No device has been seen for a week or more.${sleepWords} Show each device.`, waiting, asleep, synced, all };
  }
  return { tone: "quiet", label: all === 0 ? "No devices" : "Nothing waiting", more: "", title: all === 0 ? "No watch or iPhone is paired yet." : "No device has anything to pick up. Show each device.", waiting, asleep, synced, all };
}

/** The popover's foot under the rows, while any device is asleep. */
export const ASLEEP_NOTE = "Asleep: not seen for a week or more. Its changes wait safely and it catches up when it next connects, so it does not count as waiting.";

export interface SyncPillInput {
  devices: readonly SyncPillDevice[];
  /** A device's own page (`devicePath`), so each row is a real link. */
  deviceHref?: (id: string) => string;
  /** A plain click on a row: go to that device. */
  onOpenDevice?: (id: string) => void;
}

/**
 * The pill, then its popover. A `<details>`: the pill is its summary, so it
 * is a real button for the keyboard and a screen reader, and it needs no
 * open state of its own. A click outside it or Escape closes it. Nothing
 * while the home has no devices.
 */
export function renderSyncPill(input: SyncPillInput): TemplateResult | typeof nothing {
  const devices = input.devices;
  if (devices.length === 0) return nothing;
  const s = syncPillSummary(devices);
  const row = (d: SyncPillDevice) => {
    const state = syncStateOf(d);
    const words = syncRowWords(d);
    const body = html`<span class="wa-sync-art" style=${d.color === undefined ? nothing : `--c:${d.color}`} aria-hidden="true">${uiIcon(d.kind === "iphone" ? "phone" : "watch")}</span>
      <span class="wa-sync-nm">${d.name}${d.person === undefined ? nothing : html`<small>${d.person}</small>`}</span>
      <span class="wa-sync-st ${state}"><i class="wa-sync-dot ${state}" aria-hidden="true"></i>${words}</span>`;
    const href = input.deviceHref?.(d.id);
    if (href === undefined) return html`<li class="wa-sync-row ${state}">${body}</li>`;
    return html`<li><a class="wa-sync-row ${state}" href=${href} title=${`Open ${d.name}`}
      @click=${(e: MouseEvent) => {
        (e.currentTarget as HTMLElement).closest("details")?.removeAttribute("open");
        if (input.onOpenDevice === undefined || !isPlainClick(e)) return;
        e.preventDefault();
        input.onOpenDevice(d.id);
      }}>${body}</a></li>`;
  };
  return html`<details class="wa-sync" @toggle=${popoverToggled}>
    <summary class="wa-sync-pill ${s.tone}" title=${s.title} aria-label=${`Sync: ${s.label}${s.more === "" ? "" : ` ${s.more}`}. ${s.title}`}>
      <i class="wa-sync-dot" aria-hidden="true"></i><span>${s.label}</span>${s.more === "" ? nothing : html`<span class="wa-sync-more">${s.more}</span>`}<svg class="wa-sync-chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 4l2.5 2.5L7.5 4"/></svg>
    </summary>
    <div class="wa-sync-pop" role="group" aria-label="Sync, by device">
      <div class="wa-sync-head"><b>Sync</b><span>${devices.length} ${devices.length === 1 ? "device" : "devices"}</span></div>
      <ul class="wa-sync-list">${devices.map(row)}</ul>
      ${s.asleep > 0 ? html`<p class="wa-sync-foot">${ASLEEP_NOTE}</p>` : nothing}
    </div>
  </details>`;
}

/** While the popover is open, a click outside it or Escape shuts it; the
 * listeners go when it shuts, however it shut. Escape gives the focus back
 * to the pill. */
function popoverToggled(e: Event): void {
  const details = e.currentTarget as HTMLDetailsElement;
  if (!details.open) return;
  const doc = details.ownerDocument;
  const outside = (ev: Event) => {
    if (!ev.composedPath().includes(details)) details.open = false;
  };
  const key = (ev: KeyboardEvent) => {
    if (ev.key !== "Escape") return;
    details.open = false;
    details.querySelector("summary")?.focus();
  };
  const stop = () => {
    if (details.open) return;
    doc.removeEventListener("pointerdown", outside, true);
    doc.removeEventListener("keydown", key, true);
    details.removeEventListener("toggle", stop);
  };
  doc.addEventListener("pointerdown", outside, true);
  doc.addEventListener("keydown", key, true);
  details.addEventListener("toggle", stop);
}

/** The pill's look, added to the panel's sheet: green, amber and grey are
 * status here and nowhere in the device colors. */
export const syncPillStyles = css`
  details.wa-sync { position: relative; flex: none; }
  .wa-sync-pill {
    display: inline-flex; align-items: center; gap: 7px; height: 28px; box-sizing: border-box; padding: 0 10px 0 11px;
    border-radius: 999px; font-size: 12.5px; font-weight: 600; white-space: nowrap; cursor: pointer; user-select: none;
    list-style: none; color: var(--wa-muted); border: 1px solid var(--wa-line-strong); background: transparent;
  }
  .wa-sync-pill::-webkit-details-marker { display: none; }
  .wa-sync-pill::marker { content: ""; }
  .wa-sync-pill:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .wa-sync-pill.wait {
    color: var(--wa-amber); background: color-mix(in srgb, var(--wa-amber) 10%, transparent);
    border-color: color-mix(in srgb, var(--wa-amber) 45%, transparent);
  }
  .wa-sync-pill.ok {
    color: var(--wa-green); background: color-mix(in srgb, var(--wa-green) 8%, transparent);
    border-color: color-mix(in srgb, var(--wa-green) 45%, transparent);
  }
  .wa-sync-pill:hover { filter: brightness(1.12); }
  .wa-sync-pill > .wa-sync-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex: none; }
  .wa-sync-more { color: var(--wa-muted); font-weight: 500; }
  .wa-sync-chev { width: 12px; height: 12px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; transition: transform .12s ease-out; }
  details.wa-sync[open] .wa-sync-chev { transform: rotate(180deg); }
  .wa-sync-pop {
    position: absolute; top: calc(100% + 6px); right: 0; z-index: 60; width: 360px; max-width: calc(100vw - 24px);
    box-sizing: border-box; padding: 6px; border-radius: 12px;
    background: var(--wa-card); border: 1px solid var(--wa-line-strong); box-shadow: var(--wa-shadow-pop);
    max-height: min(70vh, 520px); overflow: auto;
  }
  .wa-sync-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 8px 8px; }
  .wa-sync-head b { font-size: 13px; font-weight: 600; color: var(--wa-ink); }
  .wa-sync-head span { font-size: 11.5px; color: var(--wa-muted); }
  .wa-sync-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }
  .wa-sync-row {
    display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 7px;
    color: var(--wa-ink); text-decoration: none; font-size: 12.5px;
  }
  a.wa-sync-row:hover { background: var(--wa-hover); }
  a.wa-sync-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .wa-sync-row.waiting { background: color-mix(in srgb, var(--wa-amber) 9%, transparent); }
  .wa-sync-art {
    display: grid; place-items: center; width: 24px; height: 24px; flex: none; box-sizing: border-box; border-radius: 6px;
    border: 1.25px solid var(--c, var(--wa-line-strong)); color: var(--c, var(--wa-muted)); background: var(--wa-bg);
  }
  .wa-sync-art svg.ui-icon { width: 14px; height: 14px; }
  /* The device's name keeps its room: a long "Waiting: pages, menus, status
     pages" wraps beside it rather than cut the name to "Apple ...". */
  .wa-sync-nm { flex: 1 1 120px; min-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .wa-sync-nm small { display: block; color: var(--wa-muted); font-size: 11px; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; }
  .wa-sync-st { display: inline-flex; align-items: center; gap: 6px; flex: 0 1 auto; min-width: 0; font-size: 12px; text-align: right; color: var(--wa-muted); }
  .wa-sync-st.synced { color: var(--wa-green); }
  .wa-sync-st.waiting { color: var(--wa-amber); font-weight: 600; }
  i.wa-sync-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--wa-faint); }
  i.wa-sync-dot.synced { background: var(--wa-green); }
  i.wa-sync-dot.waiting { background: var(--wa-amber); }
  .wa-sync-foot { margin: 6px 0 0; padding: 8px 8px 4px; border-top: 1px solid var(--wa-line); font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
  /* A phone: the pill keeps its dot and its count only. */
  @media (max-width: 480px) {
    .wa-sync-more { display: none; }
    .wa-sync-pop { position: fixed; top: 52px; left: 12px; right: 12px; width: auto; }
  }
`;
