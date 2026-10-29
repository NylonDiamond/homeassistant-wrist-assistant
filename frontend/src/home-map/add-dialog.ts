// The map editor's Add dialog (spec 2026-10-28, mock boards H and I): one
// place to put a device or a piece of furniture on the map, opened by the
// bar's ＋ Add, the key A, or a room's ＋ Add to <room> (`ctx.openAdd`). It
// has the look of the page editor's Add a tile dialog: a title, Close, and
// a body, here two tabs.
//
// Its title says where adds go: "Add to <room>" while a room, a thing in
// it, one of its walls or a device in it is picked, else "Add to <floor>".
//
// Devices: a search (focused on open), the area chips (the picked room's
// area first and on, then the floor's rooms' areas, the other areas, No area
// and All areas, each with how many devices it lists) and the devices in
// kind groups (Lights, Sensors, Climate, Switches and plugs, Media, Covers,
// Locks, Other), each row its icon, name, entity id, state and "on map" or
// "N on map". With no search it lists the kinds that belong on a plan, with
// no entity category, as the old rail did; a search finds any entity. A
// light opens the lamp chooser (`mode-devices.ts`) in the picked room, or
// its area's room; any other device is placed as the old rail's click
// placed it, one on the map already being picked instead. The footer's
// Place all N by area places every device whose area is a room here.
//
// Furniture: a search, the catalog's groups as chips and the pieces with
// their small pictures, names and sizes (the furniture picker's). A piece
// goes into the picked room, else the room under the middle of the plan,
// else the dialog asks for a room; it stands against the nearest free wall,
// facing into the room (`addPieceByWall`), and is picked.
//
// The dialog closes after an add, on Escape, on Close and on a press
// outside it; the shell then gives the focus back to ＋ Add. Every edit
// goes through `ctx.apply` as one undo step.

import { type TemplateResult, css, html, nothing } from "lit";
import { live } from "lit/directives/live.js";
import { ref } from "lit/directives/ref.js";
import {
  type HomeMapDeviceEntry,
  HOME_MAP_TRAY_DOMAINS,
  homeMapDeviceKind,
  homeMapDevices,
  homeMapFindDevices,
  homeMapPinOfEntity,
  homeMapPlaceableCount,
  homeMapStateText,
  homeMapTray,
} from "./devices-model.js";
import { addPieceByWall, homeMapPinsOfEntity } from "./edit-ops.js";
import { type HomeMapEditorContext, homeMapSelectionRoom } from "./editor-mode.js";
import { homeMapCount, homeMapToPlan } from "./editor-view.js";
import { HOME_MAP_FURNITURE, type HomeMapFurniturePiece, homeMapPieceSizeText } from "./furniture.js";
import { homeLabelPoint, homePolygonHolds, homeRoomUnder } from "./geometry.js";
import { homeMapPickerSections } from "./mode-arrange.js";
import type { DevicesMode } from "./mode-devices.js";
import {
  type HomeMapRoom,
  type HomeMapStates,
  type HomePoint,
  homeMapFloorName,
  homeMapPinRoom,
  homeMapRoomCenter,
  homeMapRoomName,
  sameHomeMapId,
} from "./model.js";
import { homeMapAutoPinIcon, homeMapPinGlyph } from "./pin-look.js";

/** The dialog's two tabs. */
export type HomeMapAddTab = "devices" | "furniture";

/** The Devices tab's kind groups. */
export type HomeMapAddKind = "lights" | "sensors" | "climate" | "switches" | "media" | "covers" | "locks" | "other";

/** The kind groups in the dialog's order, with their titles. */
export const HOME_MAP_ADD_KINDS: readonly [HomeMapAddKind, string][] = [
  ["lights", "Lights"],
  ["sensors", "Sensors"],
  ["climate", "Climate"],
  ["switches", "Switches and plugs"],
  ["media", "Media"],
  ["covers", "Covers"],
  ["locks", "Locks"],
  ["other", "Other"],
];

/** The area chip that lists every area. */
export const HOME_MAP_ADD_ALL_AREAS = "*";
/** The area chip that lists the devices with no area. */
export const HOME_MAP_ADD_NO_AREA = "";

/** How many device rows the list draws; a search narrows the rest. */
export const HOME_MAP_ADD_ROWS_SHOWN = 200;

/** The kind group a device goes in, by its domain. */
export function homeMapAddKindOf(entityId: string): HomeMapAddKind {
  switch (homeMapDeviceKind(entityId)) {
    case "lights": return "lights";
    case "sensors": return "sensors";
    case "climate": return "climate";
    case "power": return "switches";
    case "media": return "media";
    case "covers": return "covers";
    case "security": return entityId.startsWith("lock.") ? "locks" : "other";
    default: return "other";
  }
}

/** The room the dialog adds into: the picked room, the room of the picked
 * thing or wall, the room whose walls are edited, or the picked device's
 * room; none while nothing or several things are picked. */
export function homeMapAddRoom(ctx: Pick<HomeMapEditorContext, "floor" | "selection" | "walls">): HomeMapRoom | undefined {
  const sel = ctx.selection;
  const id = homeMapSelectionRoom(sel) ?? ctx.walls;
  if (id !== undefined) return ctx.floor.rooms.find((r) => sameHomeMapId(r.id, id));
  if (sel?.kind !== "pin") return undefined;
  const pin = ctx.floor.pins.find((p) => sameHomeMapId(p.id, sel.pinId));
  return pin === undefined ? undefined : homeMapPinRoom(ctx.floor, pin);
}

/** The middle of the plan's view, on the plan. */
function viewMiddle(ctx: Pick<HomeMapEditorContext, "view" | "stage">): HomePoint {
  return homeMapToPlan(ctx.view, [ctx.stage.width / 2, ctx.stage.height / 2]);
}

/** The room furniture goes into without asking: the dialog's room, else
 * the room under the middle of the plan's view. */
export function homeMapAddFurnitureRoom(ctx: Pick<HomeMapEditorContext, "floor" | "selection" | "walls" | "view" | "stage">): HomeMapRoom | undefined {
  return homeMapAddRoom(ctx) ?? homeRoomUnder(ctx.floor, viewMiddle(ctx));
}

/** Where in `room` a new piece is wanted, the wall nearest it taking the
 * piece: the middle of the plan's view when that is in the room, else the
 * room's middle. */
export function homeMapAddNear(ctx: Pick<HomeMapEditorContext, "view" | "stage">, room: HomeMapRoom): HomePoint {
  const middle = viewMiddle(ctx);
  return homePolygonHolds(room.outline, middle) ? middle : homeLabelPoint(room) ?? homeMapRoomCenter(room);
}

/** The devices the Devices tab can list before its area chip: with no
 * search, the kinds that belong on a plan with no entity category; with
 * one, every entity whose name, id or area holds the words, the names that
 * start with them first. */
export function homeMapAddCandidates(devices: readonly HomeMapDeviceEntry[], query: string): HomeMapDeviceEntry[] {
  if (query.trim() === "") return devices.filter((d) => d.category === undefined && HOME_MAP_TRAY_DOMAINS.has(d.domain));
  return homeMapFindDevices(devices, query, Infinity);
}

/** Whether a device is in an area chip's list. */
function inArea(d: HomeMapDeviceEntry, area: string): boolean {
  if (area === HOME_MAP_ADD_ALL_AREAS) return true;
  if (area === HOME_MAP_ADD_NO_AREA) return d.areaId === undefined;
  return d.areaId === area;
}

/** One area chip: its value, its words and how many devices it lists. */
export interface HomeMapAddAreaChip {
  id: string;
  name: string;
  count: number;
}

/**
 * The area chips over `devices` (`homeMapAddCandidates`): `first` (the
 * picked room's area) even with none, then the areas of the floor's rooms
 * in the rooms' order, then the other areas by name, each only with a
 * device to list, and `on` (the chip that is on) even with none; then No
 * area, when any device has none or it is on, and All areas.
 */
export function homeMapAddAreaChips(
  ctx: Pick<HomeMapEditorContext, "floor" | "areas">,
  devices: readonly HomeMapDeviceEntry[],
  first: string | undefined,
  on?: string,
): HomeMapAddAreaChip[] {
  const counts = new Map<string, number>();
  const names = new Map(ctx.areas.map((a) => [a.id, a.name]));
  let none = 0;
  for (const d of devices) {
    if (d.areaId === undefined) {
      none += 1;
      continue;
    }
    counts.set(d.areaId, (counts.get(d.areaId) ?? 0) + 1);
    if (!names.has(d.areaId)) names.set(d.areaId, d.areaName ?? d.areaId);
  }
  const order: string[] = [];
  const take = (id: string | undefined, always = false) => {
    if (id === undefined || id === "" || order.includes(id) || (!always && (counts.get(id) ?? 0) === 0)) return;
    order.push(id);
  };
  take(first, true);
  for (const room of ctx.floor.rooms) take(room.areaId);
  const rest = [...counts.keys()].sort((a, b) => (names.get(a) ?? a).localeCompare(names.get(b) ?? b));
  for (const id of rest) take(id);
  if (on !== HOME_MAP_ADD_ALL_AREAS) take(on, true);
  const chips = order.map((id) => ({ id, name: names.get(id) ?? id, count: counts.get(id) ?? 0 }));
  if (none > 0 || on === HOME_MAP_ADD_NO_AREA) chips.push({ id: HOME_MAP_ADD_NO_AREA, name: "No area", count: none });
  chips.push({ id: HOME_MAP_ADD_ALL_AREAS, name: "All areas", count: devices.length });
  return chips;
}

/** One kind group of the Devices tab. */
export interface HomeMapAddSection {
  kind: HomeMapAddKind;
  label: string;
  devices: HomeMapDeviceEntry[];
}

/** The devices of an area chip in kind groups, in the dialog's order, each
 * keeping the order it was given. */
export function homeMapAddSections(devices: readonly HomeMapDeviceEntry[], area: string): HomeMapAddSection[] {
  const byKind = new Map<HomeMapAddKind, HomeMapDeviceEntry[]>();
  for (const d of devices) {
    if (!inArea(d, area)) continue;
    const kind = homeMapAddKindOf(d.entityId);
    let list = byKind.get(kind);
    if (list === undefined) byKind.set(kind, (list = []));
    list.push(d);
  }
  return HOME_MAP_ADD_KINDS.filter(([k]) => byKind.has(k)).map(([kind, label]) => ({ kind, label, devices: byKind.get(kind)! }));
}

/** A device's tag in the list: a light's "N on map", any other's "on
 * map", none while it is not on the map. */
export function homeMapAddTag(doc: HomeMapEditorContext["doc"], entityId: string): string | undefined {
  if (entityId.startsWith("light.")) {
    const n = homeMapPinsOfEntity(doc, entityId).length;
    return n === 0 ? undefined : `${n} on map`;
  }
  return homeMapPinOfEntity(doc, entityId) === undefined ? undefined : "on map";
}

/** A piece's small picture, as the furniture picker draws it. */
export type HomeMapPiecePicture = (ctx: HomeMapEditorContext, piece: HomeMapFurniturePiece, cls: string) => TemplateResult;

/** Focus an element a moment after it is drawn. */
function focusSoon(el: Element | undefined): void {
  const target = el as (Element & { focus?: () => void }) | undefined;
  if (target?.focus !== undefined) setTimeout(() => target.focus?.(), 0);
}

/** Show a dialog element as modal once it is on the page. */
function showModalSoon(el: Element | undefined): void {
  const dialog = el as (Element & { open?: boolean; showModal?: () => void }) | undefined;
  if (dialog?.showModal === undefined) return;
  queueMicrotask(() => {
    if (dialog.isConnected && dialog.open !== true) dialog.showModal?.();
  });
}

export class HomeMapAddDialog {
  /** `devices` adds a device as the old rail did (the lamp chooser for a
   * light); `picture` draws a piece's small picture. */
  constructor(
    private readonly devices: DevicesMode,
    private readonly picture: HomeMapPiecePicture,
  ) {}

  tab: HomeMapAddTab = "devices";
  /** The Devices tab's search and area chip. */
  query = "";
  area: string = HOME_MAP_ADD_ALL_AREAS;
  /** An area chip was pressed since the dialog opened. */
  private areaChosen = false;
  /** The Furniture tab's search and group ("" every group). */
  pieceQuery = "";
  pieceGroup = "";
  /** The room picked in the dialog for furniture when none is picked on
   * the plan and none is under the middle of the view. */
  roomId: string | undefined;
  /** The open tab's search takes the focus at the next draw. */
  private focus = false;

  /** Ready the dialog to open on `tab`: empty searches, the picked room's
   * area chip on (else All areas), every furniture group. */
  open(ctx: HomeMapEditorContext, tab: HomeMapAddTab = "devices"): void {
    this.tab = tab;
    this.query = "";
    this.pieceQuery = "";
    this.pieceGroup = "";
    this.roomId = undefined;
    this.area = homeMapAddRoom(ctx)?.areaId ?? HOME_MAP_ADD_ALL_AREAS;
    this.areaChosen = false;
    this.focus = true;
  }

  setTab(ctx: HomeMapEditorContext, tab: HomeMapAddTab): void {
    if (this.tab === tab) return;
    this.tab = tab;
    this.focus = true;
    ctx.redraw();
  }

  /** The room a piece goes into: the one picked or under the middle of the
   * view, else the one picked in the dialog. */
  furnitureRoom(ctx: HomeMapEditorContext): HomeMapRoom | undefined {
    const auto = homeMapAddFurnitureRoom(ctx);
    if (auto !== undefined) return auto;
    const id = this.roomId;
    return id === undefined ? undefined : ctx.floor.rooms.find((r) => sameHomeMapId(r.id, id));
  }

  /** A device's row clicked: the dialog closes, then a light opens the lamp
   * chooser in the dialog's room (else its area's room), and any other
   * device is put there, or picked when it is on the map already. */
  addDevice(ctx: HomeMapEditorContext, d: HomeMapDeviceEntry, close: () => void): void {
    const room = homeMapAddRoom(ctx);
    const at = room === undefined ? undefined : homeLabelPoint(room) ?? homeMapRoomCenter(room);
    close();
    if (d.entityId.startsWith("light.")) this.devices.addLight(ctx, d.entityId, at, d.areaId);
    else this.devices.place(ctx, d.entityId, at, d.areaId);
  }

  /** A piece clicked: the dialog closes and the piece goes into its room
   * against the nearest free wall, picked. */
  addPiece(ctx: HomeMapEditorContext, piece: HomeMapFurniturePiece, close: () => void): void {
    const room = this.furnitureRoom(ctx);
    if (room === undefined) return;
    const id = room.id;
    const index = room.objects.length;
    const near = homeMapAddNear(ctx, room);
    close();
    if (!ctx.apply((d) => addPieceByWall(d, id, piece, near), { select: { kind: "object", roomId: id, object: index } })) {
      ctx.note("warn", "That piece could not be added: a room holds at most 256 things.");
    }
  }

  /** The dialog, modal over the page. */
  render(ctx: HomeMapEditorContext, close: () => void): TemplateResult {
    const room = homeMapAddRoom(ctx);
    const title = `Add to ${room === undefined ? homeMapFloorName(ctx.floor) : homeMapRoomName(room)}`;
    const focus = this.focus;
    this.focus = false;
    const search = ref((el) => {
      if (focus) focusSoon(el);
    });
    const tab = (id: HomeMapAddTab, words: string) => html`<button type="button" role="tab" id=${`hma-tab-${id}`} class=${this.tab === id ? "on" : ""}
      aria-selected=${this.tab === id ? "true" : "false"} aria-controls="hma-panel" @click=${() => this.setTab(ctx, id)}>${words}</button>`;
    return html`<dialog class="hma" aria-labelledby="hma-title" ${ref(showModalSoon)}
      @cancel=${(e: Event) => { e.preventDefault(); close(); }}
      @keydown=${(e: KeyboardEvent) => {
        // Every key stays in the dialog, so Delete or an arrow never reaches the plan.
        e.stopPropagation();
        if (e.key === "Escape") {
          e.preventDefault();
          close();
        }
      }}
      @pointerdown=${(e: Event) => { if (e.target === e.currentTarget) close(); }}>
      <div class="hma-in">
        <div class="hma-head">
          <h3 id="hma-title">${title}</h3>
          <button type="button" class="hme-x hma-close" aria-label="Close" title="Close (Esc)" @click=${close}>×</button>
        </div>
        <div class="hme-seg hma-tabs" role="tablist" aria-label="What to add">${tab("devices", "Devices")}${tab("furniture", "Furniture")}</div>
        <div class="hma-panel" id="hma-panel" role="tabpanel" aria-labelledby=${`hma-tab-${this.tab}`}>
          ${this.tab === "devices" ? this.devicesTab(ctx, room, close, search) : this.furnitureTab(ctx, close, search)}
        </div>
      </div>
    </dialog>`;
  }

  // ── devices ────────────────────────────────────────────────────────────

  private devicesTab(ctx: HomeMapEditorContext, room: HomeMapRoom | undefined, close: () => void, search: unknown): TemplateResult {
    const states: HomeMapStates | undefined = ctx.hass?.states;
    const all = homeMapDevices(ctx.hass);
    const candidates = homeMapAddCandidates(all, this.query);
    // The picked room's area opens on, unless it has nothing to add: an empty
    // list on opening reads as "nothing to add here", so All areas takes over
    // until a chip is pressed.
    if (!this.areaChosen && this.area !== HOME_MAP_ADD_ALL_AREAS && homeMapAddSections(candidates, this.area).every((s) => s.devices.length === 0)) {
      this.area = HOME_MAP_ADD_ALL_AREAS;
    }
    const chips = homeMapAddAreaChips(ctx, candidates, room?.areaId, this.area);
    const sections = homeMapAddSections(candidates, this.area);
    const total = sections.reduce((n, s) => n + s.devices.length, 0);
    let left = HOME_MAP_ADD_ROWS_SHOWN;
    const shown = sections.map((s) => {
      const devices = s.devices.slice(0, Math.max(left, 0));
      left -= devices.length;
      return { ...s, devices };
    }).filter((s) => s.devices.length > 0);
    const tray = homeMapTray(ctx.doc, ctx.floor, all);
    const placeable = homeMapPlaceableCount(ctx.floor, tray);
    const where = this.area === HOME_MAP_ADD_ALL_AREAS ? "in any area"
      : this.area === HOME_MAP_ADD_NO_AREA ? "with no area"
      : `in ${chips.find((c) => c.id === this.area)?.name ?? "this area"}`;
    const searching = this.query.trim() !== "";
    return html`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a device" aria-label="Find a device" autofocus .value=${live(this.query)} ${search}
          @input=${(e: Event) => { this.query = (e.target as HTMLInputElement).value; ctx.redraw(); }} /></label>
      <div class="hme-chips hma-chips" role="group" aria-label="Areas">
        ${chips.map((c) => {
          const on = c.id === this.area;
          return html`<button type="button" class="hme-chip sel ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
            @click=${() => { this.area = c.id; this.areaChosen = true; ctx.redraw(); }}>${c.name}<span class="hma-n">${c.count}</span></button>`;
        })}
      </div>
      <div class="hma-list">
        ${total === 0 ? html`<p class="hma-empty">${searching ? `Nothing by that name ${where}.` : `No devices ${where}.`}</p>` : nothing}
        ${shown.map((s) => html`<section class="hma-sec">
          <div class="hme-h">${s.label}<span class="hme-h-end">${s.devices.length}</span></div>
          ${s.devices.map((d) => this.deviceRow(ctx, d, states, close))}
        </section>`)}
        ${total > HOME_MAP_ADD_ROWS_SHOWN ? html`<p class="hma-empty">Showing ${HOME_MAP_ADD_ROWS_SHOWN} of ${total}. Type to narrow the list.</p>` : nothing}
      </div>
      <div class="hma-foot">
        <span class="hma-count">${homeMapCount(total, "device")}</span>
        <button type="button" class="hme-tb" ?disabled=${placeable === 0}
          title=${placeable === 0 ? "Link this floor's rooms to Home Assistant areas first (a room's Area, in its card)" : "Each device not on the map goes into the room linked to its area, at a good height for its kind"}
          @click=${() => { this.devices.placeAll(ctx, tray.flatMap((g) => g.devices)); close(); }}>Place all ${placeable} by area</button>
      </div>`;
  }

  private deviceRow(ctx: HomeMapEditorContext, d: HomeMapDeviceEntry, states: HomeMapStates | undefined, close: () => void): TemplateResult {
    const light = d.entityId.startsWith("light.");
    const tag = homeMapAddTag(ctx.doc, d.entityId);
    const title = light ? "Add it in a lamp. A light can be on the map many times."
      : tag === undefined ? "Put it on the map" : "On the map: click to pick it";
    const icon = homeMapAutoPinIcon(d.entityId, d.deviceClass, d.name);
    return html`<button type="button" class="hma-row ${!light && tag !== undefined ? "placed" : ""}" title=${title}
      @click=${() => this.addDevice(ctx, d, close)}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${homeMapPinGlyph(icon, "currentColor", 24, 2)}</svg></span>
      <span class="hma-nm"><span>${d.name}</span><small class="mono">${d.entityId}</small></span>
      <span class="hma-state">${homeMapStateText(d.entityId, states)}</span>
      ${tag === undefined ? nothing : html`<span class="hma-tag">${tag}</span>`}
    </button>`;
  }

  // ── furniture ──────────────────────────────────────────────────────────

  private furnitureTab(ctx: HomeMapEditorContext, close: () => void, search: unknown): TemplateResult {
    const room = this.furnitureRoom(ctx);
    const sections = homeMapPickerSections(this.pieceQuery, this.pieceGroup).filter((s) => s.pieces.length > 0);
    const groups = ["", ...HOME_MAP_FURNITURE.groups];
    const count = (g: string) => HOME_MAP_FURNITURE.pieces.filter((p) => g === "" || p.group === g).length;
    return html`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" autofocus .value=${live(this.pieceQuery)} ${search}
          @input=${(e: Event) => { this.pieceQuery = (e.target as HTMLInputElement).value; ctx.redraw(); }} /></label>
      <div class="hme-chips hma-chips" role="group" aria-label="Groups">
        ${groups.map((g) => {
          const on = g === this.pieceGroup;
          return html`<button type="button" class="hme-chip sel ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
            @click=${() => { this.pieceGroup = g; ctx.redraw(); }}>${g === "" ? "All" : g}<span class="hma-n">${count(g)}</span></button>`;
        })}
      </div>
      ${room === undefined ? this.askRoom(ctx)
        : html`<p class="hma-where">Into <b>${homeMapRoomName(room)}</b>: each piece stands against the nearest free wall, facing into the room. Drag it into place after.</p>`}
      <div class="hma-list">
        ${sections.length === 0 ? html`<p class="hma-empty">No piece by that name${this.pieceGroup === "" ? "" : ` in ${this.pieceGroup}`}.</p>` : nothing}
        ${sections.map((s) => html`<section class="hma-sec">
          <div class="hme-h">${s.title}<span class="hme-h-end">${homeMapCount(s.pieces.length, "piece")}</span></div>
          <div class="hma-grid">${s.pieces.map((p) => html`<button type="button" class="hme-fcard" ?disabled=${room === undefined}
            title=${`Add ${p.name}, ${homeMapPieceSizeText(p)}`} @click=${() => this.addPiece(ctx, p, close)}>
            ${this.picture(ctx, p, "hme-fcard-pic")}
            <span class="hme-fcard-name">${p.name}</span>
            <span class="hme-fcard-size mono">${homeMapPieceSizeText(p)}</span>
          </button>`)}</div>
        </section>`)}
      </div>`;
  }

  /** No room picked and none under the middle of the view: the floor's
   * rooms to pick one from, or a word when it has none. */
  private askRoom(ctx: HomeMapEditorContext): TemplateResult {
    if (ctx.floor.rooms.length === 0) return html`<p class="hma-where warn">Draw or scan a room first, then add its furniture.</p>`;
    return html`<div class="hma-ask">
      <p class="hma-where warn">Which room is it for? Pick one, or pick a room on the plan first.</p>
      <div class="hme-chips hma-chips" role="group" aria-label="Rooms">
        ${ctx.floor.rooms.map((r) => html`<button type="button" class="hme-chip sel" aria-pressed="false"
          @click=${() => { this.roomId = r.id; ctx.redraw(); }}>${homeMapRoomName(r)}</button>`)}
      </div>
    </div>`;
  }
}

/** The dialog's rules, in the shell's sheet after the editor's own. Its
 * classes start `hma-`; the parts it shares with the editor (the search,
 * the chips, the tabs, the furniture cards) keep the editor's look. */
export const homeMapAddDialogStyles = css`
  dialog.hma {
    width: min(600px, calc(100vw - 32px)); max-width: none; padding: 0; border: 1px solid var(--wa-line-strong); border-radius: 16px;
    background: var(--wa-card); color: var(--wa-ink); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  }
  dialog.hma::backdrop { background: rgba(0, 0, 0, 0.45); }
  .hma-in { display: flex; flex-direction: column; gap: 12px; padding: 20px; min-width: 0; }
  .hma-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .hma-head h3 { font-size: 17px; font-weight: 600; overflow-wrap: anywhere; }
  .hme-x.hma-close { width: 30px; height: 30px; font-size: 20px; margin: -4px -6px 0 0; }
  .hma-tabs { align-self: flex-start; }
  .hma-panel { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
  .hma-chips { max-height: 64px; overflow: auto; }
  .hma-n { margin-left: 6px; color: var(--wa-faint); font-variant-numeric: tabular-nums; }
  .hme-chip.sel.on .hma-n { color: inherit; opacity: 0.7; }
  /* A fixed height, so the dialog does not grow and shrink with every
     letter typed. */
  .hma-list {
    height: min(380px, 46vh); overflow: auto; overscroll-behavior: contain; padding: 4px 6px 8px;
    border: 1px solid var(--wa-line); border-radius: 12px; background: var(--wa-raised, var(--wa-card));
    display: flex; flex-direction: column; gap: 8px;
  }
  .hma-sec { display: flex; flex-direction: column; gap: 2px; }
  .hma-sec > .hme-h { padding: 8px 6px 4px; }
  button.hma-row {
    display: flex; align-items: center; gap: 10px; width: 100%; min-height: 42px; padding: 5px 8px; flex: none;
    border: 0; border-radius: 8px; background: none; color: var(--wa-ink); font: inherit; font-size: 13px; text-align: left; cursor: pointer;
  }
  button.hma-row:hover { background: var(--wa-hover); }
  button.hma-row:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--hme-sel); }
  .hma-nm { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.25; }
  .hma-nm > span { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hma-nm > small { color: var(--wa-faint); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hma-state { flex: 0 1 auto; max-width: 30%; color: var(--wa-muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hma-tag { flex: none; padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; color: var(--hme-sel); background: var(--hme-sel-bg); white-space: nowrap; }
  .hma-empty { padding: 14px 10px; font-size: 13px; color: var(--wa-muted); }
  .hma-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .hma-count { font-size: 12.5px; color: var(--wa-muted); }
  .hma-where { font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
  .hma-where b { color: var(--wa-ink); font-weight: 600; }
  .hma-where.warn { color: var(--wa-soft); }
  .hma-ask { display: flex; flex-direction: column; gap: 8px; }
  .hma-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(124px, 1fr)); gap: 8px; padding: 0 2px; }
  .hma-grid .hme-fcard:disabled { opacity: 0.5; cursor: default; }
  .hma-grid .hme-fcard:disabled:hover { border-color: var(--wa-line); background: var(--wa-input); }
`;
