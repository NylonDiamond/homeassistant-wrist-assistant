// A page's Devices menu, drawn the same in the page editor (on a page row
// and the inspector's page card) and on the Pages tab's cards: a switch per
// device, on where the page is, with a line for what the last switch did
// and Done. The rules behind the switches are `links.ts` and
// `all-pages-model.ts`; this is only the drawing and its look. The voice
// editor draws the same menu for a watch's phrases (`watch-voice/links.ts`),
// with its own head, foot and switch titles.

import { css, html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import { uiIcon } from "../ui-icons.js";
import { type PageDevicePlace, deviceWord } from "./links.js";
import type { WatchPagesNote } from "./save-note.js";

export interface DevicesMenuInput {
  /** The page's name, for the switches' labels. */
  name: string;
  places: readonly PageDevicePlace[];
  /** Why no switch can be flipped now, or undefined. */
  blocked?: string;
  /** A link or an unlink is out. */
  busy: boolean;
  /** What the last switch did. */
  note?: WatchPagesNote;
  /** Extra classes on the menu, for where it hangs. */
  className?: string;
  /** Each device's color (`deviceColorVar`), on its glyph and the row's
   * edge, as on the Pages tab. None leaves the rows plain. */
  colorOf?(ownerId: string): string | undefined;
  /** The line over the switches, "This page is on" when left out. */
  head?: string;
  /** The line at the foot, `DEVICES_MENU_NOTE` when left out. */
  foot?: string;
  /** A switch's hover text when it can be flipped. Left out, a page's. */
  titleOf?(place: PageDevicePlace): string;
  onToggle(place: PageDevicePlace): void;
  onDone(): void;
}

/** The line at the menu's foot. */
export const DEVICES_MENU_NOTE = "On means the page is on that device. An edit on one device shows on all of them. Each device keeps its own order and Hidden.";

/**
 * The menu, the complication cards' look: a switch per device. A switch
 * follows the places, not the click: it is drawn again from them once the
 * write lands. It stays open across switches, with Done to close it.
 */
export function renderPageDevicesMenu(input: DevicesMenuInput): TemplateResult {
  const { name, places, blocked, busy, note } = input;
  return html`<div class="pk-dup-menu pe-dev-menu ${input.className ?? ""}" role="group" aria-label=${`Devices for ${name}`}>
    <div class="pk-dup-head">${input.head ?? "This page is on"}</div>
    ${blocked === undefined ? nothing : html`<div class="pe-dev-note warn">${blocked}</div>`}
    ${places.map((place) => {
      const label = place.device.name;
      const off = place.stuck !== undefined || blocked !== undefined || busy;
      const title = place.stuck ?? blocked ?? input.titleOf?.(place) ?? (place.on
        ? `Take it off ${label}. Its own order and Hidden go with it.`
        : `Put it on ${label}. An edit on one device then shows on both.`);
      const color = input.colorOf?.(place.device.ownerId);
      return html`<div class="pk-dup-row check ${off ? "off" : ""} ${color === undefined ? "" : "tinted"}"
        style=${color === undefined ? nothing : `--dc:${color}`}>
        <label class="pk-dup-pick" title=${title}>
          <input type="checkbox" role="switch" .checked=${live(place.on)} ?disabled=${off}
            aria-label=${`${name} on ${label}`}
            @change=${(e: Event) => {
              (e.currentTarget as HTMLInputElement).checked = place.on;
              input.onToggle(place);
            }}>
          ${uiIcon(place.device.kind === "iphone" ? "phone" : "watch")}
          <span class="pk-dup-name">${label}</span>
          ${place.here ? html`<span class="pk-dup-full">this ${deviceWord(place.device.kind)}</span>`
            : place.tag === undefined ? nothing : html`<span class="pk-dup-full">${place.tag}</span>`}
        </label>
      </div>`;
    })}
    ${busy ? html`<div class="pe-dev-note">Saving…</div>` : nothing}
    ${note === undefined ? nothing : html`<div class="pe-dev-note ${note.kind}" role="status">${note.text}</div>`}
    <div class="pk-dup-note">${input.foot ?? DEVICES_MENU_NOTE}</div>
    <button type="button" class="pk-dup-done" @click=${() => input.onDone()}>Done</button>
  </div>`;
}

/** The menu's look: the complication cards' (panel.ts .pk-dup-*), for an
 * element whose shadow root sees none of the panel's rules. Where it hangs
 * is the host's. */
export const devicesMenuStyles = css`
  .pk-dup-menu {
    display: flex; flex-direction: column; gap: 4px; padding: 8px; cursor: default;
    border: 1px solid var(--wa-line-strong); border-radius: 10px;
    background: var(--wa-card); box-shadow: var(--wa-shadow-pop); text-align: left;
  }
  .pk-dup-row {
    display: flex; align-items: center; gap: 7px; width: 100%; text-align: left; cursor: pointer;
    font: inherit; font-size: 12px; color: var(--wa-ink);
    padding: 5px 7px; border: 1px solid var(--wa-line); border-radius: 7px; background: var(--wa-card);
  }
  .pk-dup-row svg { flex: none; width: 14px; height: 14px; }
  .pk-dup-row.check { padding: 0; gap: 0; cursor: default; }
  .pk-dup-pick { flex: 1; min-width: 0; display: flex; align-items: center; gap: 7px; padding: 5px 7px; cursor: pointer; }
  .pk-dup-pick svg { flex: none; width: 14px; height: 14px; }
  .pk-dup-row.check input { margin: 0; cursor: inherit; }
  .pk-dup-row.check.off .pk-dup-pick { opacity: .5; cursor: default; }
  .pk-dup-row.tinted { box-shadow: inset 3px 0 0 var(--dc); }
  .pk-dup-row.tinted .pk-dup-pick svg { color: var(--dc); }
  .pk-dup-row.check:hover:not(.off) { border-color: var(--wa-line-strong); }
  .pk-dup-head { font-size: 11.5px; font-weight: 700; color: var(--wa-muted); margin: 2px 0; }
  .pk-dup-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pk-dup-full { flex: none; font-size: 10px; color: var(--wa-muted); }
  .pk-dup-note { font-size: 10px; line-height: 1.4; color: var(--wa-muted); border-top: 1px solid var(--wa-line); padding-top: 6px; }
  .pk-dup-done {
    align-self: flex-end; margin-top: 2px; font: inherit; font-size: 11px; font-weight: 600;
    padding: 4px 12px; border-radius: 7px; cursor: pointer;
    border: 1px solid var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent);
  }
  .pk-dup-done:hover { filter: brightness(1.1); }
  .pk-dup-done:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pe-dev-note { font-size: 11px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  .pe-dev-note.ok { color: var(--wa-ok, var(--wa-ink)); }
  .pe-dev-note.warn, .pe-dev-note.err { color: var(--wa-need); }
`;
