// The "On each device" card in the one editor (plan step 4): a line per
// device that has the page or status page, with its place in that device's
// order ("3rd of 4 pages"), Hide here (pages only: status pages have none),
// and whether the device has collected the last save.
//
// Hide here is the device's own pick, as on the board: a save of that
// device's record (`changeDevicePicks`), which lands at once, like a tick.
// The order itself is changed on the device's board, which the place opens.
// The sync word reads `watch_config/summary`'s numbers for the device's
// record of the kind, as Home's Devices card does (`watch-app-sync.ts`), and
// reads them again on every delivery of the kind, as Home does
// (`followDeliveries`).

import { css, html, nothing, type TemplateResult } from "lit";
import { type HassLike, type WatchConfigSummary, subscribeDeliveries } from "../ha-api.js";
import { uiIcon } from "../ui-icons.js";
import type { LinkDevice } from "../watch-pages/devices.js";
import { type DeliveryState, deliveryState } from "../watch-settings.js";
import type { LibraryListKind } from "./client.js";
import { type Library, itemsFor, libraryItem, sameId } from "./model.js";

/** One device's line. */
export interface OnDeviceLine {
  ownerId: string;
  name: string;
  kind: LinkDevice["kind"];
  /** Its place in the device's order, from 1. */
  place: number;
  /** How many the device has of the kind. */
  count: number;
  hidden: boolean;
  /** Where the device's record of the kind has got to; undefined before the
   * summary is read, or on an integration older than it. */
  sync?: DeliveryState;
}

/** The lines for an item: the devices that have it, in the strip's order. */
export function onEachDeviceLines(
  lib: Library | undefined,
  kind: LibraryListKind,
  id: string,
  devices: readonly LinkDevice[],
  summary?: WatchConfigSummary,
): OnDeviceLine[] {
  if (lib === undefined) return [];
  const owners = libraryItem(lib, kind, id)?.owners ?? [];
  return devices.flatMap((d): OnDeviceLine[] => {
    if (!owners.some((o) => sameId(o, d.ownerId))) return [];
    const picks = itemsFor(lib, d.ownerId, kind);
    const at = picks.findIndex((p) => sameId(p.id, id));
    if (at < 0) return [];
    const line: OnDeviceLine = { ownerId: d.ownerId, name: d.name, kind: d.kind, place: at + 1, count: picks.length, hidden: picks[at]!.hidden };
    const owner = summary === undefined ? undefined : Object.entries(summary.owners).find(([o]) => sameId(o, d.ownerId))?.[1];
    if (summary !== undefined) line.sync = deliveryState(owner?.[kind]);
    return [line];
  });
}

/** How long a burst of deliveries is gathered before the numbers are read
 * again: a save of a shared page reaches several devices at once. */
export const DELIVERY_SETTLE_MS = 400;

/**
 * Hear every device picking up a record of `kind` while the card is on
 * screen, the way Home hears them (`subscribeDeliveries`), and call `onNews`
 * once a burst has settled. A delivery is no change, so the editor's own
 * live line never says it: without this the card read "Waiting for the
 * watch" until the editor was opened again. Gives the function that stops
 * it, safe to call before the subscription has answered. An integration
 * without the command leaves the words as last read.
 */
export function followDeliveries(hass: HassLike, kind: LibraryListKind, onNews: () => void): () => void {
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let end: (() => Promise<void>) | undefined;
  // Asked through a promise, so a connection with no subscriptions at all
  // is the same refusal as an integration without the command.
  Promise.resolve().then(() => subscribeDeliveries(hass, (event) => {
    if (stopped || event.kind !== kind) return;
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      if (!stopped) onNews();
    }, DELIVERY_SETTLE_MS);
  })).then(
    (unsubscribe) => {
      if (stopped) void unsubscribe().catch(() => undefined);
      else end = unsubscribe;
    },
    () => undefined,
  );
  return () => {
    stopped = true;
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    void end?.().catch(() => undefined);
    end = undefined;
  };
}

/** 1st, 2nd, 3rd, 4th, 11th, 21st. */
export function ordinal(n: number): string {
  const tens = n % 100;
  const suffix = tens >= 11 && tens <= 13 ? "th" : n % 10 === 1 ? "st" : n % 10 === 2 ? "nd" : n % 10 === 3 ? "rd" : "th";
  return `${n}${suffix}`;
}

/** "3rd of 4 pages", "Its only status page". */
export function placeText(line: Pick<OnDeviceLine, "place" | "count">, kind: LibraryListKind): string {
  const noun = kind === "status_pages" ? "status page" : "page";
  if (line.count <= 1) return `Its only ${noun}`;
  return `${ordinal(line.place)} of ${line.count} ${noun}s`;
}

/** The sync word, or "" when there is nothing to say. */
export function syncText(line: Pick<OnDeviceLine, "sync" | "kind">): string {
  if (line.sync === "delivered") return "Synced";
  if (line.sync === "waiting") return `Waiting for the ${line.kind === "iphone" ? "iPhone" : "watch"}`;
  return "";
}

/** What the card asks of its editor. */
export interface OnEachDeviceHost {
  kind: LibraryListKind;
  lines: readonly OnDeviceLine[];
  colorOf: (ownerId: string) => string | undefined;
  /** A Hide here write is running: the switches wait. */
  busy: boolean;
  onHide: (ownerId: string, hidden: boolean) => void;
  /** Open the device's board, where its order is changed. */
  onOpenBoard?: (ownerId: string) => void;
}

/** The card's body: a line per device, or the line that no device has it. */
export function renderOnEachDevice(host: OnEachDeviceHost): TemplateResult {
  if (host.lines.length === 0) {
    return html`<div class="oed"><p class="oed-none">On no device yet. Tick a device over the preview to put it there.</p></div>`;
  }
  return html`<div class="oed" role="list">
    ${host.lines.map((line) => {
      const color = host.colorOf(line.ownerId);
      const sync = syncText(line);
      const place = placeText(line, host.kind);
      return html`<div class="oed-row ${line.hidden ? "hidden" : ""}" role="listitem" style=${color === undefined ? "" : `--dc:${color}`}>
        <span class="oed-name"><span class="oed-glyph" aria-hidden="true">${uiIcon(line.kind === "iphone" ? "phone" : "watch")}</span><span class="oed-n" title=${line.name}>${line.name}</span></span>
        ${host.onOpenBoard === undefined
          ? html`<span class="oed-place">${place}</span>`
          : html`<button type="button" class="oed-place link" title=${`Open ${line.name}'s board to change the order`}
              @click=${() => host.onOpenBoard!(line.ownerId)}>${place}</button>`}
        ${sync === "" ? nothing : html`<span class="oed-sync ${line.sync ?? ""}">${sync}</span>`}
        ${host.kind === "status_pages" ? nothing : html`<label class="oed-hide" title=${line.hidden ? `Hidden on ${line.name}. It keeps its place there.` : `Hide it on ${line.name}. It keeps its place there.`}>
          <span>Hide here</span>
          <input type="checkbox" role="switch" .checked=${line.hidden} ?disabled=${host.busy}
            @change=${(e: Event) => host.onHide(line.ownerId, (e.target as HTMLInputElement).checked)} />
        </label>`}
      </div>`;
    })}
  </div>`;
}

export const onEachDeviceStyles = css`
  .oed { display: flex; flex-direction: column; gap: 2px; }
  .oed-none { margin: 2px 0; font-size: 12.5px; color: var(--wa-amber); }
  .oed-row {
    display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "name hide" "place sync";
    align-items: center; gap: 2px 10px; padding: 7px 8px; border-radius: 8px;
  }
  .oed-row + .oed-row { border-top: 1px solid var(--wa-line); border-radius: 0; }
  .oed-name { grid-area: name; display: inline-flex; align-items: center; gap: 6px; min-width: 0; font-size: 13px; font-weight: 600; color: var(--wa-ink); }
  .oed-glyph { display: inline-flex; width: 15px; height: 15px; color: var(--dc, var(--wa-muted)); flex: none; }
  .oed-glyph svg { width: 15px; height: 15px; }
  .oed-n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .oed-row.hidden .oed-n { opacity: .6; }
  .oed-place { grid-area: place; justify-self: start; font-size: 12px; color: var(--wa-muted); }
  .oed-place.link { padding: 0; border: 0; background: none; font: inherit; font-size: 12px; color: var(--wa-muted); cursor: pointer; text-decoration: underline dotted; text-underline-offset: 3px; }
  .oed-place.link:hover { color: var(--wa-ink); }
  .oed-place.link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
  .oed-sync { grid-area: sync; justify-self: end; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); white-space: nowrap; }
  .oed-sync.delivered { color: var(--wa-green); }
  .oed-sync.waiting { color: var(--wa-amber); }
  .oed-hide { grid-area: hide; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--wa-muted); cursor: pointer; white-space: nowrap; }
`;
