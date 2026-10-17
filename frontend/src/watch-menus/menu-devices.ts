// The menu editor's Devices menu: the page editor's (`watch-pages/
// devices-menu.ts`), with a group per menu. Hung from the top bar's ··· it
// shows the Anywhere menu and the Entity quick menu; from a menu's Devices
// line at the top of the inspector, and from a card on the Menus tab
// (`all-menus.ts`), that menu's group alone. The rules are `menu-links.ts`;
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
  /** A question asked in the menu itself, under the switches: the Menus
   * tab's "Replace the Anywhere menu on X?", where the editor asks in a
   * dialog instead. */
  ask?: TemplateResult;
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
    ${input.ask ?? nothing}
    ${busy ? html`<div class="pe-dev-note">Saving…</div>` : nothing}
    ${note === undefined ? nothing : html`<div class="pe-dev-note ${note.kind}" role="status">${note.text}</div>`}
    <div class="pk-dup-note">${MENU_DEVICES_NOTE}</div>
    <button type="button" class="pk-dup-done" @click=${() => input.onDone()}>Done</button>
  </div>`;
}

/** Where the menu hangs and its groups' own bits, after `devicesMenuStyles`:
 * under the ··· in the top bar, in the flow of the inspector under a menu's
 * Devices line. */
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
  /* The question asked in the menu: its words, then Replace and Cancel. */
  .me-dev-ask { display: flex; flex-direction: column; gap: 6px; padding: 8px; border-radius: 8px; background: var(--wa-hover); font-size: 12px; line-height: 1.4; }
  .me-dev-ask b { font-weight: 600; }
  .me-dev-ask-acts { display: flex; gap: 6px; }
  .me-dev-ask-acts button {
    font: inherit; font-size: 12px; font-weight: 600; min-height: 26px; padding: 0 10px; border-radius: 6px; cursor: pointer;
    border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-ink);
  }
  .me-dev-ask-acts button.danger { color: var(--error-color, #b42318); border-color: color-mix(in srgb, var(--error-color, #b42318) 45%, var(--wa-line)); }
  .me-dev-ask-acts button:disabled { opacity: .5; cursor: default; }
  .me-dev-ask-acts button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .wa-bar .pe-top-menu { position: relative; }
  .pe-top-menu > .pe-dev-menu.at-bar { position: absolute; top: calc(100% + 6px); right: 0; z-index: 60; width: min(320px, calc(100vw - 32px)); }
  .pe-dev-menu.at-card { margin: 0 0 8px; box-shadow: none; }
  /* A menu's Devices line, at the top of the inspector under its name: the
     title, where the menu is (a chip per device, in its color, as the Pages
     tab's cards have them), then Devices at the right. */
  .me-devices {
    display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; margin: 2px 0 8px; padding: 8px 10px;
    border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px); background: var(--wa-card);
  }
  .me-devices-h { flex: none; font-size: 12px; font-weight: 600; color: var(--wa-ink); }
  .me-devices-on { display: flex; flex-wrap: wrap; gap: 4px; flex: 1 1 auto; min-width: 0; }
  .me-devices-only { font-size: 12px; color: var(--wa-muted); }
  .me-dev-chip {
    display: inline-flex; align-items: center; gap: 4px; max-width: 100%; padding: 2px 7px 2px 5px; border-radius: 999px;
    font-size: 11px; color: var(--wa-ink); background: var(--wa-hover);
    border: 1px solid color-mix(in srgb, var(--dc, var(--wa-line)) 60%, transparent);
  }
  .me-dev-chip svg { flex: none; width: 12px; height: 12px; color: var(--dc, var(--wa-muted)); }
  .me-dev-chip-n { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .me-devices > .pe-btn.pe-dev-open { flex: none; margin-left: auto; min-height: 26px; font-size: 12px; gap: 4px; }
  .me-devices > .pe-btn.pe-dev-open svg { width: 13px; height: 13px; }
  .pe-btn.pe-dev-open.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent); }
  .badge.pe-linked {
    max-width: 140px; overflow: hidden; text-overflow: ellipsis; display: inline-block; line-height: 20px;
    color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
  }
`;
