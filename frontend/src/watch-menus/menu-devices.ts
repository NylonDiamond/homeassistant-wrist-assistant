// The menu editor's Devices menu: the page editor's (`watch-pages/
// devices-menu.ts`), with a group per menu. Hung from the top bar's ··· it
// shows the Anywhere menu and the Entity quick menu; from a menu's card in
// the inspector, that menu's group alone. The rules are `menu-links.ts`;
// this is only the drawing.

import { css, html, nothing, type TemplateResult } from "lit";
import type { LinkDevice, PageDevicePlace } from "../watch-pages/links.js";
import { renderDeviceSwitch } from "../watch-pages/devices-menu.js";
import type { WatchPagesNote } from "../watch-pages/save-note.js";
import { MENU_DEVICES_NOTE, MENU_UNIT_NAMES, type MenuDevicesGroup, type MenuLinkUnit, menuDeviceTitle, menuUnlinkHereLabel } from "./menu-links.js";

export interface MenuDevicesInput {
  groups: readonly MenuDevicesGroup[];
  /** The device the editor is on, for "Unlink this watch". */
  hereKind: LinkDevice["kind"];
  /** Why no switch can be flipped now, or undefined. */
  blocked?: string;
  /** A link or an unlink is out. */
  busy: boolean;
  /** What the last switch did. */
  note?: WatchPagesNote;
  /** Extra classes on the menu, for where it hangs. */
  className?: string;
  colorOf?(ownerId: string): string | undefined;
  onToggle(unit: MenuLinkUnit, place: PageDevicePlace): void;
  onUnlinkHere(unit: MenuLinkUnit): void;
  onDone(): void;
}

/** The menu: per group its head, a switch per device, its lines and, on a
 * linked copy, Unlink this watch. It stays open across switches, with Done
 * to close it. */
export function renderMenuDevicesMenu(input: MenuDevicesInput): TemplateResult {
  const { blocked, busy, note } = input;
  const off = (place: PageDevicePlace) => place.stuck !== undefined || blocked !== undefined || busy;
  const label = input.groups.length === 1 ? `Devices for the ${MENU_UNIT_NAMES[input.groups[0]!.unit]}` : "Devices for the menus";
  return html`<div class="pk-dup-menu pe-dev-menu me-dev-menu ${input.className ?? ""}" role="group" aria-label=${label}>
    ${blocked === undefined ? nothing : html`<div class="pe-dev-note warn">${blocked}</div>`}
    ${input.groups.map((group) => html`<div class="me-dev-group" data-unit=${group.unit}>
      <div class="pk-dup-head">${group.head}</div>
      ${group.places.map((place) => renderDeviceSwitch({
        place,
        name: MENU_UNIT_NAMES[group.unit],
        title: blocked ?? menuDeviceTitle(group.unit, place),
        off: off(place),
        ...(input.colorOf === undefined ? {} : { colorOf: input.colorOf }),
        onToggle: (p) => input.onToggle(group.unit, p),
      }))}
      ${group.lines.map((line) => html`<div class="pe-dev-note me-dev-line">${line}</div>`)}
      ${group.linked ? html`<button type="button" class="me-dev-unlink" ?disabled=${blocked !== undefined || busy}
        title=${`Keep the ${MENU_UNIT_NAMES[group.unit]} here as it is, and stop sharing it. The other devices keep theirs.`}
        @click=${() => input.onUnlinkHere(group.unit)}>${menuUnlinkHereLabel(input.hereKind)}</button>` : nothing}
    </div>`)}
    ${busy ? html`<div class="pe-dev-note">Saving…</div>` : nothing}
    ${note === undefined ? nothing : html`<div class="pe-dev-note ${note.kind}" role="status">${note.text}</div>`}
    <div class="pk-dup-note">${MENU_DEVICES_NOTE}</div>
    <button type="button" class="pk-dup-done" @click=${() => input.onDone()}>Done</button>
  </div>`;
}

/** Where the menu hangs and its groups' own bits, after `devicesMenuStyles`:
 * under the ··· in the top bar, in the flow of a menu's card in the
 * inspector. */
export const menuDevicesStyles = css`
  .me-dev-group { display: flex; flex-direction: column; gap: 4px; }
  .me-dev-group + .me-dev-group { border-top: 1px solid var(--wa-line); padding-top: 6px; margin-top: 2px; }
  .me-dev-line { font-size: 10.5px; }
  .me-dev-unlink {
    align-self: flex-start; border: 0; background: none; padding: 2px 0; cursor: pointer;
    font: inherit; font-size: 11px; font-weight: 600; color: var(--wa-accent);
  }
  .me-dev-unlink:disabled { opacity: .5; cursor: default; }
  .me-dev-unlink:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
  .wa-bar .pe-top-menu { position: relative; }
  .pe-top-menu > .pe-dev-menu.at-bar { position: absolute; top: calc(100% + 6px); right: 0; z-index: 60; width: min(320px, calc(100vw - 32px)); }
  .pe-dev-menu.at-card { margin-top: 8px; box-shadow: none; }
  /* A menu's Devices line, in its card: the field's title, then a button
     with what the menu is shared with. */
  .me-dev-field > .pe-btn.pe-dev-open { justify-self: start; max-width: 100%; min-height: 28px; font-size: 12px; }
  .me-dev-field > .pe-btn.pe-dev-open > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pe-btn.pe-dev-open.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent); }
  .badge.pe-linked {
    max-width: 140px; overflow: hidden; text-overflow: ellipsis; display: inline-block; line-height: 20px;
    color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
  }
`;
