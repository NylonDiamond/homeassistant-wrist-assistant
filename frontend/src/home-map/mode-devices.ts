// The edit page's devices (`edit-page.ts`, which uses this part): put each
// device where it is, at its height, and say what it shows and what a tap on
// it does.
//
// A device to add is a row drawn here (`deviceRow`), dragged onto the plan
// to place it (the room it would land in lit with "Drop in <room>") or
// clicked to put it in its area's room (`place`); Place all by area
// (`placeAll`) places a list at once. The page's Add dialog lists the
// devices. On the stage every pin is drawn by this part as a
// glass pin with its icon and live state (a light that is on amber, in its
// own colour when it has one) and its pill, over the rooms and things; a pin
// is dragged to move it, and
// the picked one is ringed, a light with the reach of its pool of light as a
// dashed ring whose handle sets `glow`. The room's side view, bottom left,
// shows the wall's height with a ruler, the furniture and the pin at its
// height, dragged up or down. The pill turns the device on or off, puts
// every light at this one's height, centres it in its room or takes it off
// the map. The inspector holds the pin's name, icon, room and pill; its
// height with presets; a light's glow size, colour and Stay in room (the
// room's walls stopping its pool of light, else `glowSpill`, the ring on the
// stage showing which); and what a tap on it does on the tiles, the iPhone
// and the watch.
//
// Several pins can be picked at once: Shift, Cmd or Ctrl and a click adds a
// pin or takes it out, and Shift and a drag over empty space picks every pin
// in the box (a plain drag there still pans). Each picked pin is ringed;
// dragging one moves them all, the arrow keys nudge them and Delete takes
// them off the map after the page's own yes, each as one edit. The pill
// then says how many, turns them on or off when every one can be, puts them
// at one height and removes them; the inspector lists them and sets the
// fields they can share (height, reading, tap, and for lights only the
// glow's size, colour and Stay in room) on all of them as one edit, Mixed
// where they differ.
//
// Things hold devices (a device's pin and the thing it sits on are one
// thing, a light and its lamp, a media player and its TV, `edit-ops.ts`
// keeping the pin on the thing). A light's row always adds another: a light
// group can sit in six ceiling cans. Its
// row says how many are on the map ("2 on map"), a click there picking each
// in turn. Adding a light, by a click on its row or a drop on the plan,
// opens the lamp chooser by the spot: Ceiling, Floor, Table, Wall or Just a
// bulb, each with its picture, the last one taken ringed (kept in the
// browser), Enter taking it and Escape or a click outside cancelling. A
// device dropped on a thing that holds nothing goes straight onto it (a
// light only into a lamp), and an unheld pin dragged onto one is put on it,
// the thing lit up while the pin is over it; a rug never takes one. A
// thing's inspector starts with its device (`thingCards`, called Light on a
// lamp): its name and entity, a light's glow, its icon and reading, its
// tap, a light's Add another, and Unlink. Its Choose… (holding nothing) and
// Change… open the Add dialog's Devices tab to choose one (`ctx.openAdd`
// with a `HomeMapDeviceChoice`), a lamp's listing only lights.
//
// Every edit is an `edit-ops.ts` function by ids, saved through the shell
// (`editor-mode.ts` has the rules). The device lists are `devices-model.ts`,
// a pin's look `pin-look.ts`.

import { type SVGTemplateResult, type TemplateResult, html, nothing, svg } from "lit";
import { live } from "lit/directives/live.js";
import { ref } from "lit/directives/ref.js";
import { rangeFill } from "../form-styles.js";
import { callService } from "../ha-api.js";
import {
  HOME_MAP_DEVICE_DRAG_TYPE,
  HOME_MAP_HEIGHT_PRESETS,
  HOME_MAP_LIGHT_DRAG_TYPE,
  HOME_MAP_TAP_CHOICES,
  type HomeMapDeviceEntry,
  homeMapAddPicks,
  homeMapCanToggle,
  homeMapDomainWords,
  homeMapEntityAreaId,
  homeMapGroupToggle,
  homeMapPickOf,
  homeMapPickedPins,
  homeMapPinOfEntity,
  homeMapPinsInBox,
  homeMapRoomOfArea,
  homeMapShared,
  homeMapStateText,
  homeMapTogglePick,
  homeMapToggleWords,
} from "./devices-model.js";
import {
  type HomeMapPinFields,
  type HomeMapThingRef,
  addAnotherLamp,
  addDeviceToThing,
  addLampLight,
  addPin,
  centerPinInRoom,
  homeMapHeldPin,
  homeMapPinsOfEntity,
  homeMapThingOfPin,
  linkDevice,
  movePin,
  movePins,
  placeAllByArea,
  removePin,
  removePins,
  sameHeightForLights,
  setPinEntity,
  setPinFields,
  setPinHeight,
  setPinsFields,
  setPinsHeight,
  unlinkDevice,
} from "./edit-ops.js";
import type { HomeMapEditorContext, HomeMapSelection, HomeMapViewItem } from "./editor-mode.js";
import { hmeCard, hmeChip, hmeColourInput, hmeHint, hmeNumber, hmePic, hmeRow, hmeSelect, hmeText } from "./editor-parts.js";
import { homeMapCount, homeMapShortcut, homeMapToPlan } from "./editor-view.js";
import { HOME_MAP_LAMP_CHOICES, HOME_MAP_LAMP_CHOICE_MODELS, type HomeMapLampChoice, homeMapLampPiece } from "./furniture.js";
import { homeBoxCorners, homeBoxOf, homeLabelPoint, homePointBounds, homePolygonHolds, homeRoomUnder } from "./geometry.js";
import { homeMapIsLamp, homeMapThingName } from "./mode-arrange.js";
import {
  type HomeMapFloor,
  type HomeMapPin,
  type HomeMapPinIcon,
  type HomeMapPinTap,
  type HomeMapStates,
  type HomePoint,
  HOME_MAP_GLOW_HIGH,
  HOME_MAP_GLOW_LOW,
  HOME_MAP_PIN_ICONS,
  homeMapObjectsShown,
  homeMapPinLook,
  homeMapPinName,
  homeMapPinRoom,
  homeMapRoomCenter,
  homeMapRoomName,
  sameHomeMapId,
} from "./model.js";
import { HOME_MAP_PIN_ICON_NAMES, homeMapAutoPinIcon, homeMapGlowHex, homeMapPinGlowRadius, homeMapPinGlyph, homeMapPinPill } from "./pin-look.js";
import { homeMapPinAt } from "./plan-pick.js";

/** The glow ring's handle sits at this angle, down and to the right. */
const HANDLE_ANGLE = Math.PI / 4;
/** The glow slider's top; a bigger pool is typed. */
const GLOW_SLIDER_HIGH = 8;

const LIT = "#ffbf55";
const fmt = (v: number) => v.toFixed(1);

/** The words under a device's name in its row: its kind and its state. */
export function homeMapDeviceLine(d: HomeMapDeviceEntry, states: HomeMapStates | undefined): string {
  return `${homeMapDomainWords(d.domain)} · ${homeMapStateText(d.entityId, states)}`;
}

/** The words of a pin's room in the inspector: the room, and that it was
 * found by where the pin stands, or none. */
export function homeMapPinRoomWords(floor: HomeMapFloor, pin: HomeMapPin): string {
  const room = homeMapPinRoom(floor, pin);
  if (room === undefined) return "Not in a room";
  const under = homeRoomUnder(floor, pin.at);
  return under !== undefined && sameHomeMapId(under.id, room.id) ? `${homeMapRoomName(room)} (found by place)` : homeMapRoomName(room);
}

/** The words for a pin's icon: its own by name, or Auto with the one its
 * kind picks. */
export function homeMapIconWords(pin: HomeMapPin, deviceClass?: string, name?: string): string {
  if (pin.icon !== undefined) return HOME_MAP_PIN_ICON_NAMES[pin.icon];
  return `Auto (${HOME_MAP_PIN_ICON_NAMES[homeMapAutoPinIcon(pin.entityId, deviceClass, name)].toLowerCase()})`;
}

/** The lamp chooser's choices in words. */
export const HOME_MAP_LAMP_CHOICE_NAMES: Readonly<Record<HomeMapLampChoice, string>> = {
  ceiling: "Ceiling",
  floor: "Floor",
  table: "Table",
  wall: "Wall",
  bulb: "Just a bulb",
};

/** Where the browser keeps the lamp chooser's last choice. */
export const HOME_MAP_LAMP_CHOICE_KEY = "wa-home-map-lamp-choice";

/** The browser's storage, or none where it is turned off or missing. */
function storage(): Pick<Storage, "getItem" | "setItem"> | undefined {
  try {
    return (globalThis as { localStorage?: Storage }).localStorage ?? undefined;
  } catch {
    return undefined;
  }
}

/** The lamp chooser's last choice, or none (nothing kept, no storage, or a
 * value that is no choice). */
export function homeMapLastLampChoice(): HomeMapLampChoice | undefined {
  try {
    const v = storage()?.getItem(HOME_MAP_LAMP_CHOICE_KEY);
    return HOME_MAP_LAMP_CHOICES.includes(v as HomeMapLampChoice) ? (v as HomeMapLampChoice) : undefined;
  } catch {
    return undefined;
  }
}

/** Keep the lamp chooser's choice for next time, when the browser lets it. */
export function homeMapKeepLampChoice(choice: HomeMapLampChoice): void {
  try {
    storage()?.setItem(HOME_MAP_LAMP_CHOICE_KEY, choice);
  } catch {
    /* no storage: the chooser starts from its default next time */
  }
}

/** Whether an entity is a light, the only kind a lamp's bulb shines. */
const isLight = (entityId: string) => entityId.startsWith("light.");

/** A press this near a small thing's middle, in pixels, lands on it. */
const LAMP_REACH = 16;

/** The lamp chooser while it is open: the light it adds, the spot, the
 * room there (none: only Just a bulb) and the choice it would take. */
interface LampChooser {
  entityId: string;
  at: HomePoint;
  roomId: string | undefined;
  choice: HomeMapLampChoice;
}

export class DevicesMode {
  /** `picture` draws a furniture piece's small 3D picture by its id, for
   * the lamp chooser (the edit page hands it the furniture picker's). */
  constructor(private readonly picture?: (ctx: HomeMapEditorContext, pieceId: string, cls: string) => TemplateResult) {}

  /** The room's side view under the picked pin. */
  side = true;
  /** Every pin's name in its pill. */
  names = false;
  /** The device dragged from its row, and where over the plan. */
  private dragging: string | undefined;
  private dropAt: HomePoint | undefined;
  /** A pin or its glow ring is being dragged. */
  private moving = false;
  /** The icon menu is open. */
  private iconsOpen = false;
  /** Open a page picked, waiting for its page. */
  private pickPage = false;
  /** The box Shift and a drag over empty space draws, on the plan. */
  private box: { a: HomePoint; b: HomePoint } | undefined;
  /** The lamp chooser while it is open, and whether its choice still has
   * to take the focus. */
  private chooser: LampChooser | undefined;
  private chooserFocus = false;
  /** The thing holding nothing that a device dragged from its row, or an
   * unheld pin dragged on the plan, is over: lit up, and the drop puts the
   * device on it. */
  private lampOver: HomeMapThingRef | undefined;

  private states(ctx: HomeMapEditorContext): HomeMapStates | undefined {
    return ctx.toggles.live ? ctx.hass?.states : undefined;
  }

  /** The one pin picked, when exactly one is. */
  private picked(ctx: HomeMapEditorContext): HomeMapPin | undefined {
    const sel = ctx.selection;
    return sel?.kind === "pin" ? ctx.floor.pins.find((p) => sameHomeMapId(p.id, sel.pinId)) : undefined;
  }

  /** Every pin picked, in the order picked: one, several or none. */
  private picks(ctx: HomeMapEditorContext): HomeMapPin[] {
    return homeMapPickedPins(ctx.selection).flatMap((id) => ctx.floor.pins.filter((p) => sameHomeMapId(p.id, id)));
  }

  private deviceClass(ctx: HomeMapEditorContext, entityId: string): string | undefined {
    const v = ctx.hass?.states?.[entityId]?.attributes?.device_class;
    return typeof v === "string" ? v : undefined;
  }

  private friendly(ctx: HomeMapEditorContext, entityId: string): string | undefined {
    const v = ctx.hass?.states?.[entityId]?.attributes?.friendly_name;
    return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
  }

  // ── placing ────────────────────────────────────────────────────────────

  /** Put a device on the floor shown: at `at`, else in the room of its
   * area, else in the middle of the view. A device on the map already is
   * picked instead, on its own floor. */
  place(ctx: HomeMapEditorContext, entityId: string, at?: HomePoint, areaId?: string): boolean {
    const there = homeMapPinOfEntity(ctx.doc, entityId);
    if (there !== undefined) {
      if (!sameHomeMapId(there.floorId, ctx.floor.id)) ctx.setFloor(there.floorId);
      ctx.select({ kind: "pin", pinId: there.pinId });
      return false;
    }
    const room = homeMapRoomOfArea(ctx.floor, areaId);
    const spot = at ?? (room === undefined ? homeMapToPlan(ctx.view, [ctx.stage.width / 2, ctx.stage.height / 2]) : homeLabelPoint(room) ?? homeMapRoomCenter(room));
    const id = ctx.newId().toUpperCase();
    const floorId = ctx.floor.id;
    const name = this.friendly(ctx, entityId);
    const ok = ctx.apply((d) => addPin(d, floorId, { id, entityId, at: [spot[0], spot[1]], ...(name === undefined ? {} : { name }) }), { select: { kind: "pin", pinId: id } });
    if (!ok) ctx.note("warn", "That device could not be put on the map: the map holds at most 400 devices.");
    return ok;
  }

  /** Put every device of `devices` with an area in its area's room. */
  placeAll(ctx: HomeMapEditorContext, devices: readonly HomeMapDeviceEntry[]): void {
    const list = devices.map((d) => ({ entityId: d.entityId, areaId: d.areaId, name: d.name, deviceClass: d.deviceClass }));
    const floorId = ctx.floor.id;
    ctx.apply((d) => placeAllByArea(d, floorId, list, () => ctx.newId())?.doc, { select: null });
  }

  /** A device's row, for a list of devices to add: dragged onto the plan
   * to place it, clicked to put it in its area's room; one on the map
   * already is picked. A light
   * always adds another (dragged, or clicked into its area's room), each
   * through the lamp chooser, and says how many it has on the map, a click
   * there picking the next one in turn. */
  deviceRow(ctx: HomeMapEditorContext, d: HomeMapDeviceEntry, states: HomeMapStates | undefined): TemplateResult {
    const light = isLight(d.entityId);
    const there = light ? undefined : homeMapPinOfEntity(ctx.doc, d.entityId);
    const count = light ? homeMapPinsOfEntity(ctx.doc, d.entityId).length : 0;
    const icon = homeMapAutoPinIcon(d.entityId, d.deviceClass, d.name);
    const add = () => (light ? this.addLight(ctx, d.entityId, undefined, d.areaId) : this.place(ctx, d.entityId, undefined, d.areaId));
    const title = light ? "Drag onto the plan or onto a lamp, or click to add it in its area's room. A light can be on the map many times."
      : there === undefined ? "Drag onto the plan, or click to put it in its area's room" : "On the map: click to pick it";
    return html`<div class="hme-dv ${this.dragging === d.entityId ? "dragging" : ""} ${there === undefined ? "" : "placed"}" role="button" tabindex="0"
      draggable=${there === undefined ? "true" : "false"} title=${title}
      @dragstart=${(e: DragEvent) => {
        e.dataTransfer?.setData(HOME_MAP_DEVICE_DRAG_TYPE, d.entityId);
        if (light) e.dataTransfer?.setData(HOME_MAP_LIGHT_DRAG_TYPE, d.entityId);
        e.dataTransfer?.setData("text/plain", d.entityId);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "copy";
        this.dragging = d.entityId;
        ctx.redraw();
      }}
      @dragend=${() => { this.dragging = undefined; this.dropAt = undefined; this.lampOver = undefined; ctx.redraw(); }}
      @click=${add}
      @keydown=${(e: KeyboardEvent) => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); add(); } }}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${homeMapPinGlyph(icon, "currentColor", 24, 2)}</svg></span>
      <span class="hme-dv-nm">${d.name}<small>${there === undefined ? homeMapDeviceLine(d, states) : "on the map"}</small></span>
      ${count === 0 ? nothing : html`<button type="button" class="hme-dv-count" title="Pick the next one on the map"
        @click=${(e: Event) => { e.stopPropagation(); this.pickNext(ctx, d.entityId); }}
        @keydown=${(e: KeyboardEvent) => e.stopPropagation()}>${count} on map</button>`}
      <span class="hme-dv-grip" aria-hidden="true">${there === undefined ? "⋮⋮" : "›"}</span>
    </div>`;
  }

  /** Pick the next of a light's pins on the map in turn (on its floor):
   * the one after the pin picked now (or after the light the picked lamp
   * holds), else the first. A light a lamp holds picks its lamp. */
  pickNext(ctx: HomeMapEditorContext, entityId: string): void {
    const all = ctx.doc.floors.flatMap((f) => f.pins.filter((p) => p.entityId === entityId).map((pin) => ({ floor: f, pin })));
    if (all.length === 0) return;
    const sel = ctx.selection;
    const now = sel?.kind === "pin" ? sel.pinId : sel?.kind === "object" ? homeMapHeldPin(ctx.floor, sel.roomId, sel.object)?.id : undefined;
    const i = now === undefined ? -1 : all.findIndex((x) => sameHomeMapId(x.pin.id, now));
    const next = all[(i + 1) % all.length]!;
    if (!sameHomeMapId(next.floor.id, ctx.floor.id)) ctx.setFloor(next.floor.id);
    const thing = homeMapThingOfPin(next.floor, next.pin.id);
    ctx.select(thing === undefined ? { kind: "pin", pinId: next.pin.id } : { kind: "object", roomId: thing.roomId, object: thing.object });
  }

  // ── the lamp chooser ───────────────────────────────────────────────────

  /** Add a light: the lamp chooser opens by the spot it goes to, `at`, else
   * the middle of its area's room, else the middle of the view. Outside
   * every room it offers only Just a bulb. */
  addLight(ctx: HomeMapEditorContext, entityId: string, at?: HomePoint, areaId?: string): void {
    const area = at === undefined ? homeMapRoomOfArea(ctx.floor, areaId ?? homeMapEntityAreaId(ctx.hass, entityId)) : undefined;
    const spot = at ?? (area === undefined ? homeMapToPlan(ctx.view, [ctx.stage.width / 2, ctx.stage.height / 2]) : homeLabelPoint(area) ?? homeMapRoomCenter(area));
    const room = homeRoomUnder(ctx.floor, spot) ?? area;
    const last = homeMapLastLampChoice();
    this.chooser = { entityId, at: [spot[0], spot[1]], roomId: room?.id, choice: room === undefined ? "bulb" : last ?? "ceiling" };
    this.chooserFocus = true;
    ctx.redraw();
  }

  /** Whether the lamp chooser is open. */
  get choosing(): boolean {
    return this.chooser !== undefined;
  }

  /** Close the lamp chooser, adding nothing. */
  cancelChooser(ctx: HomeMapEditorContext): void {
    this.chooser = undefined;
    ctx.redraw();
  }

  /** Whether the chooser can take a choice: a lamp needs a room. */
  private canChoose(choice: HomeMapLampChoice): boolean {
    return choice === "bulb" || this.chooser?.roomId !== undefined;
  }

  /** Take a choice (the ringed one by default): the light goes in a new
   * lamp of that kind, or alone as a bulb, as one edit, and the lamp (or
   * the bulb) is picked. The choice is kept for next time. */
  takeChoice(ctx: HomeMapEditorContext, choice?: HomeMapLampChoice): void {
    const c = this.chooser;
    if (c === undefined) return;
    const pick = choice ?? c.choice;
    if (!this.canChoose(pick)) return;
    this.chooser = undefined;
    homeMapKeepLampChoice(pick);
    const id = ctx.newId().toUpperCase();
    const floorId = ctx.floor.id;
    const room = c.roomId === undefined ? undefined : ctx.doc.floors.find((f) => sameHomeMapId(f.id, floorId))?.rooms.find((r) => sameHomeMapId(r.id, c.roomId));
    const name = this.friendly(ctx, c.entityId);
    const select: HomeMapSelection = pick !== "bulb" && room !== undefined ? { kind: "object", roomId: room.id, object: room.objects.length } : { kind: "pin", pinId: id };
    const ok = ctx.apply((d) => addLampLight(d, floorId, c.roomId, c.entityId, pick, c.at, id, name)?.doc, { select });
    if (!ok) ctx.note("warn", "That light could not be put on the map: the map holds at most 400 devices, and a room at most 256 things.");
  }

  /** The chooser's keys: Enter takes the ringed choice, Escape cancels, the
   * arrows ring the one before or after; Delete does nothing while it is
   * open. False with the chooser closed, or for any other key. */
  chooserKey(ctx: HomeMapEditorContext, e: KeyboardEvent): boolean {
    const c = this.chooser;
    if (c === undefined) return false;
    switch (e.key) {
      case "Enter":
        this.takeChoice(ctx);
        return true;
      case "Escape":
        this.cancelChooser(ctx);
        return true;
      case "ArrowLeft":
      case "ArrowUp":
      case "ArrowRight":
      case "ArrowDown": {
        const open = HOME_MAP_LAMP_CHOICES.filter((x) => this.canChoose(x));
        const step = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
        c.choice = open[(open.indexOf(c.choice) + step + open.length) % open.length] ?? c.choice;
        this.chooserFocus = true;
        ctx.redraw();
        return true;
      }
      case "Delete":
      case "Backspace":
        return true;
      default:
        return false;
    }
  }

  /** The lamp chooser, by its spot over a clear scrim that cancels it when
   * pressed: the light, its room, and the five choices with their
   * pictures, the ringed one taken by Enter. */
  lampChooser(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const c = this.chooser;
    if (c === undefined) return nothing;
    // The spot in the window: the stage's own point less the stage's corner.
    const s = ctx.toScreen(c.at);
    const corner = ctx.toScreen(ctx.toPlan(0, 0));
    const x = s[0] - corner[0];
    const y = s[1] - corner[1];
    const width = 344;
    const wide = (globalThis as { innerWidth?: number }).innerWidth ?? Infinity;
    const left = x + 22 + width > wide ? Math.max(8, x - 22 - width) : x + 22;
    const room = c.roomId === undefined ? undefined : ctx.floor.rooms.find((r) => sameHomeMapId(r.id, c.roomId));
    const focus = this.chooserFocus;
    this.chooserFocus = false;
    const name = this.friendly(ctx, c.entityId) ?? c.entityId;
    return html`<div class="hme-scrim hme-lamp-scrim" @pointerdown=${(e: Event) => { if (e.target === e.currentTarget) this.cancelChooser(ctx); }}>
      <div class="hme-lampc" role="dialog" aria-label="Which lamp is it in?" style=${`left:${Math.round(left)}px;top:${Math.round(Math.max(8, y - 64))}px;width:${width}px`}
        @keydown=${(e: KeyboardEvent) => {
          if (!this.chooserKey(ctx, e)) return;
          e.preventDefault();
          e.stopPropagation();
        }}>
        <div class="hme-lampc-t"><strong>${name}</strong>
          <span>${room === undefined ? "In no room, so just a bulb." : `In ${homeMapRoomName(room)}. Which lamp is it in?`}</span></div>
        <div class="hme-lampc-row" role="group" aria-label="Lamp">
          ${HOME_MAP_LAMP_CHOICES.map((choice) => {
            const on = choice === c.choice;
            const can = this.canChoose(choice);
            const model = HOME_MAP_LAMP_CHOICE_MODELS[choice];
            return html`<button type="button" class="hme-lampc-b ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} ?disabled=${!can}
              title=${can ? HOME_MAP_LAMP_CHOICE_NAMES[choice] : "A lamp goes in a room"}
              ${ref((el) => { if (focus && on && el !== undefined) setTimeout(() => (el as HTMLElement).focus?.(), 0); })}
              @click=${() => this.takeChoice(ctx, choice)}>
              ${model === undefined || this.picture === undefined
                ? html`<span class="hme-lampc-pic bulb"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">${homeMapPinGlyph("bulb", "currentColor", 24, 1.8)}</svg></span>`
                : this.picture(ctx, model, "hme-lampc-pic")}
              <span>${HOME_MAP_LAMP_CHOICE_NAMES[choice]}</span></button>`;
          })}
        </div>
        <p class="hme-lampc-hint">Enter takes the ringed one · Esc cancels</p>
      </div>
    </div>`;
  }

  // ── things under the plan ──────────────────────────────────────────────

  /** The thing holding nothing at plan point `at` that a device dropped
   * there goes onto: a shown thing under the point, or with its middle
   * within a small reach of it on screen (a table lamp is a few pixels
   * wide); the nearest middle first. A light (`light`) goes only into a
   * lamp (a piece with a bulb), so a ceiling light dropped over a bed is
   * still a light of its own; anything else onto any thing but a rug, which
   * lies under everything else. On `floor`, the floor shown unless a drag
   * keeps the one it started on. */
  emptyThingAt(ctx: HomeMapEditorContext, at: HomePoint, light: boolean, floor: HomeMapFloor = ctx.floor): HomeMapThingRef | undefined {
    const s = ctx.toScreen(at);
    let best: { ref: HomeMapThingRef; d: number } | undefined;
    for (const room of floor.rooms) {
      room.objects.forEach((object, index) => {
        if (object.hidden === true) return;
        if (light ? homeMapLampPiece(object.model) === undefined : object.kind === "rug") return;
        if (homeMapHeldPin(floor, room.id, index) !== undefined) return;
        const c = ctx.toScreen(object.c);
        const d = Math.hypot(c[0] - s[0], c[1] - s[1]);
        if (d > LAMP_REACH && !homePolygonHolds(homeBoxCorners(homeBoxOf(object)), at)) return;
        if (best === undefined || d < best.d) best = { ref: { roomId: room.id, object: index }, d };
      });
    }
    return best?.ref;
  }

  /** The thing holding the pin a press at `at` lands on, if a thing holds
   * the pin there: the press is the thing's. */
  heldThingAt(ctx: HomeMapEditorContext, at: HomePoint): HomeMapThingRef | undefined {
    const pin = this.pinAt(ctx, ctx.toScreen(at));
    return pin === undefined ? undefined : homeMapThingOfPin(ctx.floor, pin.id);
  }

  /** A thing lit up as the device over it would go onto it, with a word: in
   * this lamp, or on this TV. */
  private lampMark(ctx: HomeMapEditorContext, ref: HomeMapThingRef): SVGTemplateResult | typeof nothing {
    const object = ctx.floor.rooms.find((r) => sameHomeMapId(r.id, ref.roomId))?.objects[ref.object];
    if (object === undefined) return nothing;
    const box = homeBoxCorners(homeBoxOf(object)).map((p) => ctx.toScreen(p).map(fmt).join(",")).join(" ");
    const [x, y] = ctx.toScreen(object.c);
    const text = homeMapIsLamp(object) ? "Put it in this lamp" : `Put it on this ${homeMapThingName(object)}`;
    const w = text.length * 6.4 + 20;
    return svg`<g class="hme-lamp-over" pointer-events="none">
      <circle cx=${fmt(x)} cy=${fmt(y)} r="22" fill="rgba(255,191,85,0.22)" stroke=${LIT} stroke-width="2" stroke-dasharray="4 3" />
      <polygon points=${box} fill="rgba(255,191,85,0.3)" stroke=${LIT} stroke-width="2" />
      <g class="hme-tag"><rect x=${fmt(x - w / 2)} y=${fmt(y + 28)} width=${fmt(w)} height="18" rx="9" fill=${LIT} />
        <text x=${fmt(x)} y=${fmt(y + 41)} fill="#3a2600" text-anchor="middle">${text}</text></g>
    </g>`;
  }

  // ── dragging a device onto the plan ────────────────────────────────────

  /** A device dragged from its row over the plan: the room it would land
   * in lit, or the thing holding nothing it would go onto (a light only
   * into a lamp). */
  dragOver(ctx: HomeMapEditorContext, at: HomePoint | undefined, e: DragEvent): boolean {
    const types = [...(e.dataTransfer?.types ?? [])];
    const carries = this.dragging !== undefined || types.includes(HOME_MAP_DEVICE_DRAG_TYPE);
    const light = this.dragging !== undefined ? isLight(this.dragging) : types.includes(HOME_MAP_LIGHT_DRAG_TYPE);
    const before = this.dropAt;
    const lampBefore = this.lampOver;
    this.dropAt = carries ? at : undefined;
    this.lampOver = carries && at !== undefined ? this.emptyThingAt(ctx, at, light) : undefined;
    if (before !== this.dropAt || JSON.stringify(lampBefore) !== JSON.stringify(this.lampOver)) ctx.redraw();
    return carries && at !== undefined;
  }

  /** A device dropped on the plan: on a thing that holds nothing it goes
   * straight onto it (a light only into a lamp); else a light opens the lamp
   * chooser there, and anything else is placed there. */
  drop(ctx: HomeMapEditorContext, at: HomePoint, e: DragEvent): void {
    const entityId = this.dragging ?? e.dataTransfer?.getData(HOME_MAP_DEVICE_DRAG_TYPE) ?? "";
    this.dragging = undefined;
    this.dropAt = undefined;
    this.lampOver = undefined;
    if (entityId === "") {
      ctx.redraw();
      return;
    }
    const light = isLight(entityId);
    const thing = this.emptyThingAt(ctx, at, light);
    if (thing === undefined) {
      if (light) this.addLight(ctx, entityId, at);
      else this.place(ctx, entityId, at);
      return;
    }
    this.putOn(ctx, thing, entityId);
  }

  /** A device put onto a thing that holds nothing, the thing picked: a new
   * pin for a light (a light can be on the map many times), and for
   * anything else its one pin when this floor has it, else a new one; a
   * device on another floor's map stays there, with a word. */
  private putOn(ctx: HomeMapEditorContext, thing: HomeMapThingRef, entityId: string): boolean {
    const floorId = ctx.floor.id;
    const there = isLight(entityId) ? undefined : homeMapPinOfEntity(ctx.doc, entityId);
    const select = { select: { kind: "object", ...thing } as HomeMapSelection };
    if (there !== undefined) {
      if (!sameHomeMapId(there.floorId, floorId)) {
        ctx.note("warn", "That device is on another floor's map. Remove it there first to put it here.");
        return false;
      }
      return ctx.apply((d) => linkDevice(d, floorId, thing.roomId, thing.object, there.pinId), select);
    }
    const id = ctx.newId().toUpperCase();
    const ok = ctx.apply((d) => addDeviceToThing(d, floorId, thing.roomId, thing.object, entityId, id), select);
    if (!ok) ctx.note("warn", "That device could not be put on it: the map holds at most 400 devices.");
    return ok;
  }

  // ── the stage ──────────────────────────────────────────────────────────

  overlay(ctx: HomeMapEditorContext): SVGTemplateResult {
    const states = this.states(ctx);
    const picked = this.picked(ctx);
    const picks = homeMapPickedPins(ctx.selection);
    const parts: SVGTemplateResult[] = [];
    const lamp = this.lampOver === undefined ? nothing : this.lampMark(ctx, this.lampOver);
    if (lamp !== nothing) parts.push(lamp);
    else if (this.dropAt !== undefined) parts.push(this.dropMark(ctx, this.dropAt));
    const look = picked === undefined ? undefined : homeMapPinLook(picked.entityId, states);
    if (picked !== undefined && look?.kind === "light") parts.push(this.glowRing(ctx, picked, look.on ? look.brightness : undefined));
    for (const pin of ctx.floor.pins) {
      const on = picks.some((id) => sameHomeMapId(pin.id, id));
      parts.push(this.pinMark(ctx, pin, on, false, states));
    }
    if (this.box !== undefined) parts.push(this.boxMark(ctx, this.box));
    return svg`${parts}`;
  }

  /** The box Shift and a drag draws, the pins inside it picked on letting
   * go. */
  private boxMark(ctx: HomeMapEditorContext, box: { a: HomePoint; b: HomePoint }): SVGTemplateResult {
    const [ax, ay] = ctx.toScreen(box.a);
    const [bx, by] = ctx.toScreen(box.b);
    return svg`<rect class="hme-box" x=${fmt(Math.min(ax, bx))} y=${fmt(Math.min(ay, by))} width=${fmt(Math.abs(bx - ax))} height=${fmt(Math.abs(by - ay))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`;
  }

  /** One pin: glass with its icon, amber (or its own colour) when a light is
   * on, its pill under it, ringed when picked. */
  private pinMark(ctx: HomeMapEditorContext, pin: HomeMapPin, picked: boolean, dim: boolean, states: HomeMapStates | undefined): SVGTemplateResult {
    const [x, y] = ctx.toScreen(pin.at);
    const look = homeMapPinLook(pin.entityId, states);
    const lit = look.kind === "light" && look.on;
    const fill = lit ? homeMapGlowHex(pin) ?? LIT : "rgba(36,36,40,0.92)";
    const ring = lit ? "#fff3d6" : look.kind === "gone" ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.4)";
    const ink = lit ? "#3a2600"
      : look.kind === "lock" ? (look.locked ? "#30d158" : "#ff9f0a")
      : look.kind === "other" && look.on ? "#ffffff"
      : look.kind === "gone" ? "#8e8e93" : "#d1d1d6";
    const icon = pin.icon ?? homeMapAutoPinIcon(pin.entityId, this.deviceClass(ctx, pin.entityId), this.friendly(ctx, pin.entityId));
    const r = picked ? 13 : 12;
    const words = picked || this.names ? homeMapPinName(pin, ctx.hass) : homeMapPinPill(pin, states);
    const w = words === undefined ? 0 : words.length * 5.9 + 14;
    return svg`<g class="hme-pin" data-hme="pin" data-pin=${pin.id} transform=${`translate(${fmt(x)} ${fmt(y)})`} opacity=${dim ? 0.25 : 1} style="cursor:grab">
      ${picked ? svg`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />` : nothing}
      ${lit ? svg`<circle r=${r + 7} fill=${fill} opacity="0.22" />` : nothing}
      <circle r=${r} fill=${fill} stroke=${ring} stroke-width="1.2" />
      <g transform="translate(-7 -7)">${homeMapPinGlyph(icon, ink, 14, 1.5)}</g>
      ${words === undefined || words === "" ? nothing : svg`<g pointer-events="none"><rect x=${fmt(-w / 2)} y=${r + 4} width=${fmt(w)} height="16" rx="8" fill=${picked ? "#5b8def" : "rgba(0,0,0,0.7)"} />
        <text y=${r + 15.5} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${words}</text></g>`}
    </g>`;
  }

  /** The picked light's pool as a dashed ring, its handle and its size. A
   * pool that stays in its room (no `glowSpill`) shows the ring solid only
   * inside the room's walls and faint past them, as the plan clips it. */
  private glowRing(ctx: HomeMapEditorContext, pin: HomeMapPin, brightness: number | undefined): SVGTemplateResult {
    const [x, y] = ctx.toScreen(pin.at);
    const meters = homeMapPinGlowRadius(pin, brightness);
    const R = ctx.px(meters);
    const h: HomePoint = [x + R * Math.cos(HANDLE_ANGLE), y + R * Math.sin(HANDLE_ANGLE)];
    const text = `Glow ${meters.toFixed(1)} m`;
    const w = text.length * 6.2 + 18;
    const room = pin.glowSpill === true ? undefined : homeMapPinRoom(ctx.floor, pin);
    const walls = room !== undefined && room.outline.length >= 3 ? room.outline.map((p) => ctx.toScreen(p).map(fmt).join(",")).join(" ") : undefined;
    const ring = (opacity: number) => svg`<circle cx=${fmt(x)} cy=${fmt(y)} r=${fmt(R)} fill="none" stroke=${homeMapGlowHex(pin) ?? "#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${opacity} pointer-events="none" />`;
    return svg`<g class="hme-glow-ring">
      ${walls === undefined ? ring(1) : svg`<clipPath id="hme-glow-walls"><polygon points=${walls} /></clipPath>
        ${ring(0.28)}<g clip-path="url(#hme-glow-walls)">${ring(1)}</g>`}
      <circle data-hme="glow" cx=${fmt(h[0])} cy=${fmt(h[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${fmt(h[0] - w / 2)} y=${fmt(h[1] + 12)} width=${fmt(w)} height="18" rx="9" fill="#5b8def" />
        <text x=${fmt(h[0])} y=${fmt(h[1] + 25)} fill="#fff" text-anchor="middle">${text}</text></g>
    </g>`;
  }

  /** Where a dragged device would land: the room under it lit, with its
   * name, and a ghost pin. */
  private dropMark(ctx: HomeMapEditorContext, at: HomePoint): SVGTemplateResult {
    const room = homeRoomUnder(ctx.floor, at);
    const [x, y] = ctx.toScreen(at);
    const text = room === undefined ? "Drop here, in no room" : `Drop in ${homeMapRoomName(room)}`;
    const w = text.length * 6.4 + 20;
    return svg`<g class="hme-drop" pointer-events="none">
      ${room === undefined ? nothing : svg`<polygon points=${room.outline.map((p) => ctx.toScreen(p).map(fmt).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${fmt(x)} cy=${fmt(y)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${fmt(x - w / 2)} y=${fmt(y + 20)} width=${fmt(w)} height="18" rx="9" fill="#5b8def" />
        <text x=${fmt(x)} y=${fmt(y + 33)} fill="#fff" text-anchor="middle">${text}</text></g>
    </g>`;
  }

  /** The pin a press at stage point `s` lands on, the top one first, as
   * the plan's hover finds it (`plan-pick.ts`). */
  private pinAt(ctx: HomeMapEditorContext, s: HomePoint): HomeMapPin | undefined {
    return homeMapPinAt(ctx.floor, ctx.toScreen, s);
  }

  /** A press on the stage: the glow ring's handle, a pin (Shift, Cmd or
   * Ctrl adding it to the pick or taking it out; a press on one of several
   * picked moving them all), or with Shift off a pin a box that picks the
   * pins inside it. Anything else is left (the edit page tries a thing, then
   * a room). */
  pointerDown(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    if (e.button !== 0) return false;
    return this.pressHandle(ctx, e, at) || this.pressPin(ctx, e, at) || this.pressBox(ctx, e, at);
  }

  /** A press on the picked light's glow handle drags it. */
  pressHandle(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    const picked = this.picked(ctx);
    if (picked === undefined || e.shiftKey || e.metaKey || e.ctrlKey) return false;
    const look = homeMapPinLook(picked.entityId, this.states(ctx));
    if (look.kind !== "light") return false;
    const s = ctx.toScreen(at);
    const [x, y] = ctx.toScreen(picked.at);
    const R = ctx.px(homeMapPinGlowRadius(picked, look.on ? look.brightness : undefined));
    if (Math.hypot(s[0] - (x + R * Math.cos(HANDLE_ANGLE)), s[1] - (y + R * Math.sin(HANDLE_ANGLE))) > 10) return false;
    this.glowDrag(ctx, e, picked);
    return true;
  }

  /** Whether a press at plan point `at` lands on a pin. */
  onPin(ctx: HomeMapEditorContext, at: HomePoint): boolean {
    return this.pinAt(ctx, ctx.toScreen(at)) !== undefined;
  }

  /** With Shift, a press anywhere off a pin starts the box that picks the
   * pins inside it. */
  pressBox(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    if (!e.shiftKey) return false;
    this.boxDrag(ctx, e, at);
    return true;
  }

  /** A press on a pin: picks it and drags it, Shift, Cmd or Ctrl adding it
   * to the pick or taking it out, a press on one of several picked moving
   * them all. */
  pressPin(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    const many = e.shiftKey || e.metaKey || e.ctrlKey;
    const pin = this.pinAt(ctx, ctx.toScreen(at));
    if (pin === undefined) return false;
    this.pickPage = false;
    this.iconsOpen = false;
    if (many) {
      ctx.select(homeMapTogglePick(ctx.selection, pin.id));
      return true;
    }
    const picks = homeMapPickedPins(ctx.selection);
    if (picks.length > 1 && picks.some((id) => sameHomeMapId(id, pin.id))) {
      this.groupDrag(ctx, e, picks, pin.id, at);
      return true;
    }
    ctx.select({ kind: "pin", pinId: pin.id });
    this.moveDrag(ctx, e, pin, at);
    return true;
  }

  /** Drag one of several picked pins: they all follow the pointer by the
   * same step, each into the room it lands in, saved once on the drop as one
   * edit. A press without a move picks that pin alone. */
  private groupDrag(ctx: HomeMapEditorContext, e: PointerEvent, ids: readonly string[], pinId: string, start: HomePoint): void {
    let step: HomePoint = [0, 0];
    const selection = homeMapPickOf(ids);
    ctx.drag(e, {
      move: (p) => {
        this.moving = true;
        step = [p[0] - start[0], p[1] - start[1]];
        const [dx, dy] = step;
        ctx.preview((d) => movePins(d, ids, dx, dy));
      },
      end: (_p, _ev, moved) => {
        this.moving = false;
        ctx.preview(undefined);
        const [dx, dy] = step;
        if (!moved) ctx.select({ kind: "pin", pinId });
        else if (Math.hypot(dx, dy) >= 0.005) ctx.apply((d) => movePins(d, ids, dx, dy), selection === undefined ? {} : { select: selection });
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** A drag dropped before it let go: the plan as it was, nothing saved. */
  private stopDrag(ctx: HomeMapEditorContext): void {
    this.moving = false;
    this.box = undefined;
    this.lampOver = undefined;
    ctx.preview(undefined);
  }

  /** Shift and a drag over empty space: a box, and every pin inside it
   * added to the pick on letting go. */
  private boxDrag(ctx: HomeMapEditorContext, e: PointerEvent, start: HomePoint): void {
    const pins = ctx.floor.pins;
    const before = ctx.selection;
    ctx.drag(e, {
      move: (p) => {
        this.box = { a: start, b: p };
        ctx.redraw();
      },
      end: (p, _ev, moved) => {
        this.box = undefined;
        if (moved) ctx.select(homeMapAddPicks(before, homeMapPinsInBox(pins, start, p)));
        else ctx.redraw();
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Take the picked pins off the map: several only after the page's own
   * yes, as one edit that one undo brings back. */
  private async removePicks(ctx: HomeMapEditorContext, ids: readonly string[]): Promise<void> {
    if (ids.length === 0) return;
    if (ids.length > 1) {
      const sure = await ctx.confirm({
        title: `Remove ${homeMapCount(ids.length, "device")} from the map?`,
        text: "They come off the map, and Add can put them back. Undo puts them back where they were.",
        ok: "Remove",
        danger: true,
      });
      if (!sure) return;
    }
    ctx.apply((d) => removePins(d, ids), { select: null });
  }

  /** Drag a pin: it follows the pointer, into the room it lands in, saved
   * once on the drop. A pin no thing holds, let go over a thing that holds
   * nothing (a light only over a lamp), goes onto that thing instead: the
   * thing lights up while the pin is over it and the pin shows on it. */
  private moveDrag(ctx: HomeMapEditorContext, e: PointerEvent, pin: HomeMapPin, start: HomePoint): void {
    const id = pin.id;
    const floor = ctx.floor;
    const floorId = floor.id;
    const from: HomePoint = [pin.at[0], pin.at[1]];
    const free = homeMapThingOfPin(floor, id) === undefined;
    const light = isLight(pin.entityId);
    let to = from;
    ctx.drag(e, {
      move: (p) => {
        this.moving = true;
        to = [from[0] + p[0] - start[0], from[1] + p[1] - start[1]];
        const thing = free ? this.emptyThingAt(ctx, to, light, floor) : undefined;
        this.lampOver = thing;
        ctx.preview(thing === undefined ? (d) => movePin(d, id, to) : (d) => linkDevice(d, floorId, thing.roomId, thing.object, id));
      },
      end: (_p, _ev, moved) => {
        const thing = this.lampOver;
        this.moving = false;
        this.lampOver = undefined;
        ctx.preview(undefined);
        if (moved && thing !== undefined) ctx.apply((d) => linkDevice(d, floorId, thing.roomId, thing.object, id), { select: { kind: "object", ...thing } });
        else if (moved && Math.hypot(to[0] - from[0], to[1] - from[1]) >= 0.005) ctx.apply((d) => movePin(d, id, to), { select: { kind: "pin", pinId: id } });
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Drag the glow ring's handle: the pool reaches as far as the pointer,
   * in 5 cm steps. */
  private glowDrag(ctx: HomeMapEditorContext, e: PointerEvent, pin: HomeMapPin): void {
    const id = pin.id;
    let glow: number | undefined;
    ctx.drag(e, {
      move: (p) => {
        this.moving = true;
        const r = Math.hypot(p[0] - pin.at[0], p[1] - pin.at[1]);
        glow = Math.min(Math.max(Math.round(r / 0.05) * 0.05, HOME_MAP_GLOW_LOW), HOME_MAP_GLOW_HIGH);
        const g = glow;
        ctx.preview((d) => setPinFields(d, id, { glow: g }));
      },
      end: () => {
        this.moving = false;
        ctx.preview(undefined);
        const g = glow;
        if (g !== undefined) ctx.apply((d) => setPinFields(d, id, { glow: g }));
      },
      cancel: () => this.stopDrag(ctx),
    });
  }

  /** Delete or Backspace takes the picked pins off the map; the arrow keys
   * nudge them all. */
  keyDown(ctx: HomeMapEditorContext, e: KeyboardEvent): boolean {
    const ids = this.picks(ctx).map((p) => p.id);
    if (ids.length === 0) return false;
    const shortcut = homeMapShortcut(e, false);
    if (shortcut === "delete") {
      void this.removePicks(ctx, ids);
      return true;
    }
    if (typeof shortcut === "object" && "nudge" in shortcut) {
      const [dx, dy] = shortcut.nudge;
      ctx.apply((d) => movePins(d, ids, dx, dy));
      return true;
    }
    return false;
  }

  leave(): void {
    this.dragging = undefined;
    this.dropAt = undefined;
    this.box = undefined;
    this.moving = false;
    this.iconsOpen = false;
    this.pickPage = false;
    this.chooser = undefined;
    this.lampOver = undefined;
  }

  /** The dock's View menu: the side view and every pin's name. */
  viewItems(ctx: HomeMapEditorContext): HomeMapViewItem[] {
    return [
      { label: "Side view", on: this.side, title: "The picked device's room from the side, to set its height", flip: () => { this.side = !this.side; ctx.redraw(); } },
      { label: "Names", on: this.names, title: "Every device's name under its pin", flip: () => { this.names = !this.names; ctx.redraw(); } },
    ];
  }

  // ── the side view ──────────────────────────────────────────────────────

  stageExtra(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const pin = this.picked(ctx);
    if (!this.side || pin === undefined) return nothing;
    const room = homeMapPinRoom(ctx.floor, pin);
    const H = room?.height ?? 2.5;
    const b = homePointBounds(room?.outline ?? ctx.floor.rooms.flatMap((r) => r.outline)) ?? { minX: pin.at[0] - 1, maxX: pin.at[0] + 1, minY: 0, maxY: 0 };
    const top = 18;
    const floorY = 118;
    const k = (floorY - top) / Math.max(H, 0.5);
    const left = 30;
    const right = 262;
    const kx = (right - left) / Math.max(b.maxX - b.minX, 0.5);
    const sx = (x: number) => left + (Math.min(Math.max(x, b.minX), b.maxX) - b.minX) * kx;
    const z = pin.at[2];
    const py = floorY - Math.min(Math.max(z, 0), H) * k;
    const px = sx(pin.at[0]);
    const lit = (() => {
      const look = homeMapPinLook(pin.entityId, this.states(ctx));
      return look.kind === "light" && look.on;
    })();
    const marks: number[] = [];
    for (let m = 0; m <= H + 1e-9; m += 1) marks.push(m);
    const objects = room === undefined ? [] : homeMapObjectsShown(room);
    const name = room === undefined ? "No room" : homeMapRoomName(room);
    return html`<div class="hme-side">
      <div class="hme-h">${name} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${homeMapPinName(pin, ctx.hass)} at ${z.toFixed(2)} m, the wall ${H.toFixed(1)} m tall`}
        @pointerdown=${(e: PointerEvent) => this.heightDrag(ctx, e, pin, H, floorY, k)}>
        <path d=${`M${left} ${fmt(top)}H${right}M${left} ${floorY}H${right}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${left} ${fmt(top)}V${floorY}M${right} ${fmt(top)}V${floorY}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${marks.map((m) => svg`<text x=${left - 6} y=${fmt(floorY - m * k + 3)}>${m === 0 ? "0" : `${m} m`}</text>
            <path d=${`M${left - 4} ${fmt(floorY - m * k)}H${left}`} stroke="#8e8e93" />`)}
        </g>
        ${objects.map((o) => {
          const x0 = sx(o.c[0] - o.size[0] / 2);
          const x1 = sx(o.c[0] + o.size[0] / 2);
          const h = Math.min(o.size[2], H) * k;
          return svg`<rect x=${fmt(x0)} y=${fmt(floorY - h)} width=${fmt(Math.max(x1 - x0, 2))} height=${fmt(h)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`;
        })}
        <path d=${`M${fmt(px)} ${floorY}V${fmt(py)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${lit ? svg`<circle cx=${fmt(px)} cy=${fmt(py)} r="20" fill="#ffb648" opacity="0.22" />` : nothing}
        <circle cx=${fmt(px)} cy=${fmt(py)} r="9" fill=${lit ? LIT : "#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${fmt(Math.min(px + 14, 222))} y=${fmt(py - 8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${fmt(Math.min(px + 14, 222) + 22)} y=${fmt(py + 3.5)} fill="#fff" font-size="10" text-anchor="middle">${z.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`;
  }

  /** Drag in the side view: the pin's height follows the pointer, in 5 cm
   * steps, from the floor to the wall's top; saved on letting go. */
  private heightDrag(ctx: HomeMapEditorContext, e: PointerEvent, pin: HomeMapPin, H: number, floorY: number, k: number): void {
    if (e.button !== 0) return;
    const el = e.currentTarget as SVGSVGElement;
    const id = pin.id;
    const at = (ev: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const y = ((ev.clientY - rect.top) * 130) / Math.max(rect.height, 1);
      return Math.min(Math.max(Math.round((floorY - y) / k / 0.05) * 0.05, 0), H);
    };
    let z = at(e);
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* a synthetic press has no pointer to capture */
    }
    this.moving = true;
    ctx.preview((d) => setPinHeight(d, id, z));
    const move = (ev: PointerEvent) => {
      z = at(ev);
      const v = z;
      ctx.preview((d) => setPinHeight(d, id, v));
    };
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      this.moving = false;
      ctx.preview(undefined);
      const v = z;
      if (Math.abs(v - pin.at[2]) >= 0.005) ctx.apply((d) => setPinHeight(d, id, v));
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  }

  // ── the pill ───────────────────────────────────────────────────────────

  pill(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const picks = this.picks(ctx);
    if (picks.length > 1 && !this.moving) return this.groupPill(ctx, picks);
    const pin = this.picked(ctx);
    if (pin === undefined || this.moving) return nothing;
    const id = pin.id;
    const light = pin.entityId.startsWith("light.");
    const inRoom = homeMapPinRoom(ctx.floor, pin) !== undefined;
    return html`<span class="hme-pill-name">${homeMapPinName(pin, ctx.hass)}</span>
      ${homeMapCanToggle(pin.entityId) && ctx.hass !== undefined ? html`<button type="button" class="hme-tb" @click=${() => this.toggle(ctx, pin.entityId)}>${homeMapToggleWords(pin.entityId, ctx.hass.states)}</button>` : nothing}
      ${light ? html`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${() => ctx.apply((d) => sameHeightForLights(d, id))}>Same height for all lights</button>` : nothing}
      ${inRoom ? html`<button type="button" class="hme-tb" @click=${() => ctx.apply((d) => centerPinInRoom(d, id))}>Center in room</button>` : nothing}
      <button type="button" class="hme-tb danger" @click=${() => ctx.apply((d) => removePin(d, id), { select: null })}>Remove</button>`;
  }

  /** The pill for several picked pins: how many, Turn on or off when every
   * one takes it, every one at the first picked's height, and Remove. */
  private groupPill(ctx: HomeMapEditorContext, picks: readonly HomeMapPin[]): TemplateResult {
    const ids = picks.map((p) => p.id);
    const first = picks[0]!;
    const z = first.at[2];
    const level = picks.every((p) => Math.abs(p.at[2] - z) < 0.005);
    const toggle = ctx.hass === undefined ? undefined : homeMapGroupToggle(picks.map((p) => p.entityId), ctx.hass.states);
    return html`<span class="hme-pill-name">${homeMapCount(picks.length, "device")}</span>
      ${toggle === undefined ? nothing : html`<button type="button" class="hme-tb" @click=${() => this.turn(ctx, picks.map((p) => p.entityId), toggle.service)}>${toggle.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${level} title=${level ? "They are all at one height" : `Every picked device at ${homeMapPinName(first, ctx.hass)}'s height, ${z.toFixed(2)} m`}
        @click=${() => ctx.apply((d) => setPinsHeight(d, ids, z))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${() => void this.removePicks(ctx, ids)}>Remove</button>`;
  }

  /** Turn a device on or off in Home Assistant itself. */
  private toggle(ctx: HomeMapEditorContext, entityId: string): void {
    const hass = ctx.hass;
    if (hass === undefined) return;
    callService(hass, "homeassistant", "toggle", { entity_id: entityId }).catch((err: unknown) => {
      ctx.note("err", `Could not turn it on or off: ${err instanceof Error ? err.message : String(err)}`);
    });
  }

  /** Turn several devices on, or off, together in Home Assistant itself. */
  private turn(ctx: HomeMapEditorContext, entityIds: readonly string[], service: "turn_on" | "turn_off"): void {
    const hass = ctx.hass;
    if (hass === undefined) return;
    callService(hass, "homeassistant", service, { entity_id: [...entityIds] }).catch((err: unknown) => {
      ctx.note("err", `Could not turn them ${service === "turn_on" ? "on" : "off"}: ${err instanceof Error ? err.message : String(err)}`);
    });
  }

  // ── the inspector ──────────────────────────────────────────────────────

  /** The picked pin's cards, or several picked pins'; nothing with none. */
  inspector(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const picks = this.picks(ctx);
    if (picks.length > 1) return this.groupInspector(ctx, picks);
    const pin = this.picked(ctx);
    if (pin === undefined) return nothing;
    const states = ctx.hass?.states;
    const id = pin.id;
    const look = homeMapPinLook(pin.entityId, states);
    const lit = look.kind === "light" && look.on;
    const friendly = this.friendly(ctx, pin.entityId);
    const deviceClass = this.deviceClass(ctx, pin.entityId);
    const auto = homeMapAutoPinIcon(pin.entityId, deviceClass, friendly);
    const icon = pin.icon ?? auto;
    const room = homeMapPinRoom(ctx.floor, pin);
    const H = room?.height ?? 2.5;
    const set = (fields: HomeMapPinFields) => ctx.apply((d) => setPinFields(d, id, fields, friendly));
    const hex = homeMapGlowHex(pin);
    const tile = hex ?? LIT;
    return html`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${lit ? "lit" : ""}" style=${lit ? `background:${tile};box-shadow:0 0 24px ${tile}80` : ""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${homeMapPinGlyph(icon, lit ? "#3a2600" : "#d1d1d6", 24, 2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${homeMapPinName(pin, ctx.hass)}</strong>
          <span class="mono">${pin.entityId}</span>
        </div>
        <span class="hme-state ${lit ? "lit" : ""}">${homeMapStateText(pin.entityId, states)}</span>
      </section>

      ${hmeCard("On the map", html`
        ${hmeRow("Name", hmeText({ value: pin.name ?? "", label: "Name on the map", placeholder: friendly ?? pin.entityId, set: (v) => set({ name: v.trim() === "" ? null : v }) }))}
        ${this.iconRows(ctx, pin, set)}
        ${hmeRow("Room", html`<span class="hme-in hme-ro">${homeMapPinRoomWords(ctx.floor, pin)}</span>`)}
        ${readingRow(pin, tile, set)}`)}

      ${hmeCard("Height", html`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${H} step="0.05" .value=${live(String(pin.at[2]))} aria-label="Height" style=${rangeFill(pin.at[2], 0, H)}
            @input=${(e: Event) => { const v = Number((e.target as HTMLInputElement).value); ctx.preview((d) => setPinHeight(d, id, v)); }}
            @change=${(e: Event) => { const v = Number((e.target as HTMLInputElement).value); ctx.apply((d) => setPinHeight(d, id, v)); }} />
          ${hmeNumber({ label: "Height", value: pin.at[2], unit: "m", min: 0, max: 100, width: "92px", set: (v) => ctx.apply((d) => setPinHeight(d, id, v)) })}
        </div>
        <div class="hme-chips">${HOME_MAP_HEIGHT_PRESETS.map(([label, z]) => html`<button type="button" class="hme-chip sel ${Math.abs(pin.at[2] - z) < 0.005 ? "on" : ""}"
          @click=${() => ctx.apply((d) => setPinHeight(d, id, z))}>${label} ${z}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${pin.entityId.startsWith("light.") ? this.lightCard(ctx, pin, look.kind === "light" && look.on ? look.brightness : undefined, set) : nothing}

      ${this.tapCard(ctx, pin, set)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${() => ctx.apply((d) => removePin(d, id), { select: null })}>Remove from the map</button></div>`;
  }

  /** A pin's Icon row, its own icon or Auto, and the icon menu under it
   * while open. */
  private iconRows(ctx: HomeMapEditorContext, pin: HomeMapPin, set: (f: HomeMapPinFields) => void): TemplateResult {
    const friendly = this.friendly(ctx, pin.entityId);
    const deviceClass = this.deviceClass(ctx, pin.entityId);
    const auto = homeMapAutoPinIcon(pin.entityId, deviceClass, friendly);
    const icon = pin.icon ?? auto;
    return html`${hmeRow("Icon", html`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen ? "true" : "false"}
        @click=${() => { this.iconsOpen = !this.iconsOpen; ctx.redraw(); }}>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${homeMapPinGlyph(icon, "currentColor", 24, 2)}</svg>
        <span class="hme-grow">${homeMapIconWords(pin, deviceClass, friendly)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
      ${this.iconsOpen ? this.iconMenu(ctx, pin, auto, set) : nothing}`;
  }

  /** The icon menu: Auto and the sixteen icons, each drawn. */
  private iconMenu(ctx: HomeMapEditorContext, pin: HomeMapPin, auto: HomeMapPinIcon, set: (f: HomeMapPinFields) => void): TemplateResult {
    const pick = (icon: HomeMapPinIcon | null) => {
      this.iconsOpen = false;
      set({ icon });
      ctx.redraw();
    };
    const cell = (icon: HomeMapPinIcon, label: string, on: boolean, value: HomeMapPinIcon | null) => html`<button type="button" class="hme-icon-cell ${on ? "on" : ""}"
      title=${label} aria-label=${label} aria-pressed=${on ? "true" : "false"} @click=${() => pick(value)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${homeMapPinGlyph(icon, "currentColor", 24, 1.9)}</svg><span>${label}</span></button>`;
    return html`<div class="hme-icons" role="group" aria-label="Icon">
      ${cell(auto, "Auto", pin.icon === undefined, null)}
      ${HOME_MAP_PIN_ICONS.map((icon) => cell(icon, HOME_MAP_PIN_ICON_NAMES[icon], pin.icon === icon, icon))}
    </div>`;
  }

  /** A light's glow: how far it reaches and its colour. */
  private lightCard(ctx: HomeMapEditorContext, pin: HomeMapPin, brightness: number | undefined, set: (f: HomeMapPinFields) => void): TemplateResult {
    return hmeCard("Light", this.glowRows(ctx, pin, brightness, set));
  }

  /** The Light card's glow rows, a lamp's Light card's too: the glow's
   * size, its colour and whether it stays in its room. */
  private glowRows(ctx: HomeMapEditorContext, pin: HomeMapPin, brightness: number | undefined, set: (f: HomeMapPinFields) => void): TemplateResult {
    const id = pin.id;
    const reach = homeMapPinGlowRadius(pin, brightness);
    const hex = homeMapGlowHex(pin);
    const chip = (label: string, on: boolean, click: () => void) => html`<button type="button" class="hme-chip sel ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} @click=${click}>${label}</button>`;
    return html`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${HOME_MAP_GLOW_LOW} max=${Math.max(GLOW_SLIDER_HIGH, reach)} step="0.05" .value=${live(String(reach))} aria-label="Glow size"
          style=${rangeFill(reach, HOME_MAP_GLOW_LOW, Math.max(GLOW_SLIDER_HIGH, reach))}
          @input=${(e: Event) => { const v = Number((e.target as HTMLInputElement).value); ctx.preview((d) => setPinFields(d, id, { glow: v })); }}
          @change=${(e: Event) => set({ glow: Number((e.target as HTMLInputElement).value) })} />
        <span class="hme-val mono hme-w48">${reach.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${chip("By its brightness", pin.glow === undefined, () => set({ glow: null }))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${chip("Follow the light", pin.glowColor === undefined, () => set({ glowColor: null }))}
        ${chip("Warm", pin.glowColor === "warm", () => set({ glowColor: "warm" }))}
        <label class="hme-chip sel hme-pick ${hex !== undefined ? "on" : ""}">${hex === undefined ? nothing : html`<span class="hme-swatch" style=${`background:${hex}`}></span>`}Pick
          ${hmeColourInput({
            value: hex ?? "#ffb648",
            label: "Pick the glow's color",
            preview: (v) => ctx.preview(v === undefined ? undefined : (d) => setPinFields(d, id, { glowColor: v }) ?? d),
            set: (v) => set({ glowColor: v }),
          })}</label>
      </div></div>
      ${stayRow(pin.glowSpill === true ? "off" : "on", (stay) => set({ glowSpill: stay ? null : true }))}
      ${hmeHint("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`;
  }

  // ── a thing's device ───────────────────────────────────────────────────

  /** The cards a picked thing shows before its own: the device it holds
   * (its name and entity, a search to change it, a light's glow, its icon
   * and reading, a light's Add another, and Unlink) and what a tap on it
   * does; or for a thing that holds none, its Choose…. Choose… and Change…
   * open the Add dialog to choose one, a lamp's listing only the home's
   * lights. A lamp calls its device its Light. The pin's height is the
   * thing's, so it has no Height card. */
  thingCards(ctx: HomeMapEditorContext, roomId: string, index: number): TemplateResult | typeof nothing {
    const room = ctx.floor.rooms.find((r) => sameHomeMapId(r.id, roomId));
    const object = room?.objects[index];
    if (room === undefined || object === undefined) return nothing;
    const lamp = homeMapIsLamp(object) || homeMapLampPiece(object.model) !== undefined;
    const title = lamp ? "Light" : "Device";
    const thingName = homeMapThingName(object);
    const floorId = ctx.floor.id;
    const pin = homeMapHeldPin(ctx.floor, room.id, index);
    const rowTitle = (name: string) => lamp ? `Put ${name} in this lamp` : `Put ${name} on this ${thingName}`;
    if (pin === undefined) {
      const choose = () => ctx.openAdd("devices", {
        title: lamp ? "Choose a light for this lamp" : `Choose a device for this ${thingName}`,
        lightsOnly: lamp,
        rowTitle,
        pick: (entityId) => {
          if (!this.putOn(ctx, { roomId: room.id, object: index }, entityId)) ctx.redraw();
        },
      });
      return hmeCard(title, html`
        ${hmeRow(title, html`<span class="hme-in hme-ro dim">None</span>`,
          html`<button type="button" class="hme-tb" aria-haspopup="dialog" title=${lamp ? "Pick the light this lamp holds" : `Pick the device this ${thingName} is or carries`}
            @click=${choose}>Choose…</button>`)}
        ${hmeHint(lamp ? "Pick the light this lamp holds, or drag its light's pin onto it on the plan."
          : `The device this ${thingName} is or carries, a TV's media player or a fan's switch: choose it, or drag its pin onto it on the plan.`)}`);
    }
    const states = ctx.hass?.states;
    const id = pin.id;
    const light = isLight(pin.entityId);
    const look = homeMapPinLook(pin.entityId, states);
    const lit = look.kind === "light" && look.on;
    const friendly = this.friendly(ctx, pin.entityId);
    const set = (fields: HomeMapPinFields) => ctx.apply((d) => setPinFields(d, id, fields, friendly));
    const icon = pin.icon ?? homeMapAutoPinIcon(pin.entityId, this.deviceClass(ctx, pin.entityId), friendly);
    const tile = homeMapGlowHex(pin) ?? LIT;
    const doc = ctx.doc.floors.find((f) => sameHomeMapId(f.id, floorId))?.rooms.find((r) => sameHomeMapId(r.id, room.id));
    const another = () => {
      const newId = ctx.newId().toUpperCase();
      const select: HomeMapSelection | null = doc === undefined ? null : { kind: "object", roomId: room.id, object: doc.objects.length };
      if (!ctx.apply((d) => addAnotherLamp(d, floorId, room.id, index, newId)?.doc, { select })) {
        ctx.note("warn", "Another lamp could not be added: the map holds at most 400 devices, and a room at most 256 things.");
      }
    };
    // Any other entity keeps one pin, so it can take only a device not on
    // the map yet; a light may be on it many times.
    const change = () => ctx.openAdd("devices", {
      title: lamp ? "Change the light in this lamp" : `Change the device on this ${thingName}`,
      lightsOnly: lamp,
      now: pin.entityId,
      rowTitle,
      pick: (entityId) => {
        if (!isLight(entityId) && homeMapPinOfEntity(ctx.doc, entityId) !== undefined) {
          ctx.note("warn", "That device is on the map already. Drag its pin onto this instead.");
          ctx.redraw();
          return;
        }
        if (!ctx.apply((d) => setPinEntity(d, id, entityId))) ctx.redraw();
      },
    });
    const holder = lamp ? "lamp" : thingName;
    const what = light ? "light" : "device";
    return html`${hmeCard(title, html`
        <div class="hme-lamp-light">
          <span class="hme-pin-big ${lit ? "lit" : ""}" style=${lit ? `background:${tile};box-shadow:0 0 24px ${tile}80` : ""}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${homeMapPinGlyph(icon, lit ? "#3a2600" : "#d1d1d6", 24, 2)}</svg></span>
          <div class="hme-head-t hme-grow">
            <strong>${homeMapPinName(pin, ctx.hass)}</strong>
            <span class="mono">${pin.entityId}</span>
          </div>
          <span class="hme-state ${lit ? "lit" : ""}">${homeMapStateText(pin.entityId, states)}</span>
        </div>
        ${hmeRow("Name", hmeText({ value: pin.name ?? "", label: "Name on the map", placeholder: friendly ?? pin.entityId, set: (v) => set({ name: v.trim() === "" ? null : v }) }))}
        ${hmeRow(title, html`<span class="hme-in hme-ro mono">${pin.entityId}</span>`,
          html`<button type="button" class="hme-tb" aria-haspopup="dialog" title=${lamp ? "Show another of the home's lights in this lamp" : `Show another of the home's devices on this ${thingName}`}
            @click=${change}>Change…</button>`)}
        ${light ? this.glowRows(ctx, pin, lit ? look.brightness : undefined, set) : nothing}
        ${this.iconRows(ctx, pin, set)}
        ${readingRow(pin, tile, set)}
        <div class="hme-row-end">
          ${homeMapCanToggle(pin.entityId) && ctx.hass !== undefined ? html`<button type="button" class="hme-tb" @click=${() => this.toggle(ctx, pin.entityId)}>${homeMapToggleWords(pin.entityId, states)}</button>` : nothing}
          ${light ? html`<button type="button" class="hme-tb" title=${`Another of this ${holder} beside it, holding the same light: a light group in many lamps`} @click=${another}>Add another</button>` : nothing}
          <button type="button" class="hme-tb push" title=${`The ${holder} lets go of the ${what}; both stay where they are`} @click=${() => ctx.apply((d) => unlinkDevice(d, floorId, room.id, index))}>Unlink</button>
        </div>
        <p class="hme-foot-hint">${lamp && light ? "The light sits in the lamp: move, lift or turn the lamp and the light goes with it."
          : `The ${what} sits on the ${holder}: move, lift or turn the ${holder} and the ${what} goes with it.`}</p>`)}
      ${this.tapCard(ctx, pin, set)}`;
  }

  // ── several pins picked ────────────────────────────────────────────────

  /** The inspector for several picked pins: who they are, and the fields
   * they can share, each set on all of them as one edit (one undo, one
   * save). A field whose values differ shows Mixed, or a slider with no
   * knob, until it is set. Name and icon are one pin's own. */
  private groupInspector(ctx: HomeMapEditorContext, picks: readonly HomeMapPin[]): TemplateResult {
    const states = ctx.hass?.states;
    const ids = picks.map((p) => p.id);
    const setAll = (fields: Omit<HomeMapPinFields, "name">) => {
      if (!ctx.apply((d) => setPinsFields(d, ids, fields))) ctx.note("warn", "That could not be set on every picked device.");
    };
    const roomTop = Math.max(2.5, ...picks.map((p) => homeMapPinRoom(ctx.floor, p)?.height ?? 2.5));
    const height = homeMapShared(picks.map((p) => p.at[2]));
    const reading = homeMapShared(picks.map((p) => p.reading));
    const lights = picks.every((p) => p.entityId.startsWith("light."));
    const tile = LIT;
    return html`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${homeMapPinGlyph("bulb", "#d1d1d6", 24, 2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${homeMapCount(picks.length, "device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${hmeCard("Picked", html`${picks.map((p) => html`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${() => ctx.select({ kind: "pin", pinId: p.id })}>${homeMapPinName(p, ctx.hass)}</button>
          <span class="hme-val">${homeMapStateText(p.entityId, states)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${homeMapPinName(p, ctx.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${() => ctx.select(homeMapTogglePick(ctx.selection, p.id))}>×</button></div>`)}`, String(picks.length))}

      ${hmeCard("On the map", html`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${hmePic({ label: "None", picture: readingPicture("none", tile), on: !reading.mixed && reading.value === "none", click: () => setAll({ reading: "none" }) })}
          ${hmePic({ label: "Pill", picture: readingPicture("pill", tile), on: !reading.mixed && reading.value === undefined, title: "Each one's reading, as 21.5°, 52% or 627 W, when it has one", click: () => setAll({ reading: null }) })}
          ${hmePic({ label: "Name", picture: readingPicture("name", tile), on: !reading.mixed && reading.value === "name", click: () => setAll({ reading: "name" }) })}
        </div></div>
        ${reading.mixed ? hmeHint("Mixed: they show different things. Pick one to set them all.") : nothing}`)}

      ${hmeCard("Height", html`
        <div class="hme-r">
          ${mixedRange({ label: "Height", value: height.mixed ? undefined : height.value, min: 0, max: roomTop, step: 0.05,
            preview: (v) => ctx.preview((d) => setPinsHeight(d, ids, v)), set: (v) => ctx.apply((d) => setPinsHeight(d, ids, v)) })}
          ${hmeNumber({ label: "Height", value: height.mixed ? undefined : height.value, unit: "m", min: 0, max: 100, width: "92px", set: (v) => ctx.apply((d) => setPinsHeight(d, ids, v)) })}
        </div>
        <div class="hme-chips">${HOME_MAP_HEIGHT_PRESETS.map(([label, z]) => html`<button type="button" class="hme-chip sel ${picks.every((p) => Math.abs(p.at[2] - z) < 0.005) ? "on" : ""}"
          @click=${() => ctx.apply((d) => setPinsHeight(d, ids, z))}>${label} ${z}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${lights ? this.groupLightCard(ctx, picks, setAll) : nothing}

      ${this.groupTapCard(ctx, picks, setAll)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${() => void this.removePicks(ctx, ids)}>Remove ${homeMapCount(picks.length, "device")} from the map</button></div>`;
  }

  /** Several lights' glow: size, colour and whether it stays in its room,
   * Mixed where they differ. */
  private groupLightCard(ctx: HomeMapEditorContext, picks: readonly HomeMapPin[], setAll: (f: Omit<HomeMapPinFields, "name">) => void): TemplateResult {
    const ids = picks.map((p) => p.id);
    const states = this.states(ctx);
    const reaches = picks.map((p) => {
      const look = homeMapPinLook(p.entityId, states);
      return Math.round(homeMapPinGlowRadius(p, look.kind === "light" && look.on ? look.brightness : undefined) * 20) / 20;
    });
    const reach = homeMapShared(reaches);
    const top = Math.max(GLOW_SLIDER_HIGH, ...reaches);
    const byBrightness = picks.every((p) => p.glow === undefined);
    const colour = homeMapShared(picks.map((p) => p.glowColor?.toLowerCase()));
    const spill = homeMapShared(picks.map((p) => p.glowSpill === true));
    const hex = colour.mixed || colour.value === undefined || colour.value === "warm" ? undefined : colour.value;
    const chip = (label: string, on: boolean, click: () => void) => html`<button type="button" class="hme-chip sel ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} @click=${click}>${label}</button>`;
    return hmeCard("Light", html`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${mixedRange({ label: "Glow size", value: reach.mixed ? undefined : reach.value, min: HOME_MAP_GLOW_LOW, max: top, step: 0.05,
          preview: (v) => ctx.preview((d) => setPinsFields(d, ids, { glow: v })), set: (v) => setAll({ glow: v }) })}
        <span class="hme-val mono hme-w48">${reach.mixed ? "Mixed" : `${reach.value.toFixed(1)} m`}</span></div>
      <div class="hme-row-end indent">${chip("By its brightness", byBrightness, () => setAll({ glow: null }))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${chip("Follow the light", !colour.mixed && colour.value === undefined, () => setAll({ glowColor: null }))}
        ${chip("Warm", !colour.mixed && colour.value === "warm", () => setAll({ glowColor: "warm" }))}
        <label class="hme-chip sel hme-pick ${hex !== undefined ? "on" : ""}">${hex === undefined ? nothing : html`<span class="hme-swatch" style=${`background:${hex}`}></span>`}Pick
          ${hmeColourInput({
            value: hex ?? "#ffb648",
            label: "Pick the glow's color for every picked light",
            preview: (v) => ctx.preview(v === undefined ? undefined : (d) => setPinsFields(d, ids, { glowColor: v }) ?? d),
            set: (v) => setAll({ glowColor: v }),
          })}</label>
      </div></div>
      ${colour.mixed ? hmeHint("Mixed: their colors differ. Pick one to set them all.") : nothing}
      ${stayRow(spill.mixed ? "mixed" : spill.value ? "off" : "on", (stay) => setAll({ glowSpill: stay ? null : true }))}`);
  }

  /** What a tap does on several pins, Mixed where they differ. Open a page
   * sets the same page on all of them. */
  private groupTapCard(ctx: HomeMapEditorContext, picks: readonly HomeMapPin[], setAll: (f: Omit<HomeMapPinFields, "name">) => void): TemplateResult {
    const tap = homeMapShared(picks.map((p) => [p.tap, p.tap === "page" ? p.pageId?.toLowerCase() : undefined] as const));
    const shared = tap.mixed ? undefined : tap.value;
    const page = shared?.[0] === "page" || this.pickPage;
    const pageId = shared?.[0] === "page" ? picks[0]!.pageId : undefined;
    const pick = (choice: HomeMapPinTap | undefined) => {
      if (choice === "page") {
        if (ctx.pages.length === 1) setAll({ tap: "page", pageId: ctx.pages[0]!.id });
        else {
          this.pickPage = true;
          ctx.redraw();
        }
        return;
      }
      this.pickPage = false;
      setAll({ tap: choice ?? null });
    };
    return hmeCard("Tap on the map", html`
      <div class="hme-chips">${HOME_MAP_TAP_CHOICES.map(([choice, label]) => {
        const on = choice === "page" ? page : !this.pickPage && shared !== undefined && shared[0] === choice;
        return html`<button type="button" class="hme-chip sel ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
          ?disabled=${choice === "page" && ctx.pages.length === 0} title=${choice === "page" && ctx.pages.length === 0 ? "Your library has no pages" : ""}
          @click=${() => pick(choice)}>${label}</button>`;
      })}</div>
      ${page ? hmeRow("Page", hmeSelect({
        label: "Page",
        value: pageId ?? "",
        options: [
          ...(pageId === undefined ? [{ value: "", label: "Pick a page…", disabled: true }] : []),
          ...(pageId === undefined || ctx.pages.some((p) => sameHomeMapId(p.id, pageId)) ? [] : [{ value: pageId, label: "A page not in your library", disabled: true }]),
          ...ctx.pages.map((p) => ({ value: p.id, label: p.name })),
        ],
        set: (v) => {
          this.pickPage = false;
          if (v !== "") setAll({ tap: "page", pageId: v });
        },
      })) : nothing}
      <p class="hme-text dim">${tap.mixed && !this.pickPage ? "Mixed: a tap does different things on them. Pick one to set them all." : "Set on every picked device."}</p>`);
  }

  /** What a tap on the pin does on the tiles, the iPhone and the watch. */
  private tapCard(ctx: HomeMapEditorContext, pin: HomeMapPin, set: (f: HomeMapPinFields) => void): TemplateResult {
    const page = pin.tap === "page" || this.pickPage;
    const pageKnown = pin.pageId === undefined || ctx.pages.some((p) => sameHomeMapId(p.id, pin.pageId));
    const pick = (tap: HomeMapPinTap | undefined) => {
      if (tap === "page") {
        if (pin.tap === "page") return;
        // A page tap needs its page: pick one first.
        if (ctx.pages.length === 1) set({ tap: "page", pageId: ctx.pages[0]!.id });
        else {
          this.pickPage = true;
          ctx.redraw();
        }
        return;
      }
      this.pickPage = false;
      set({ tap: tap ?? null });
    };
    return hmeCard("Tap on the map", html`
      <div class="hme-chips">${HOME_MAP_TAP_CHOICES.map(([tap, label]) => {
        const on = tap === "page" ? page : !this.pickPage && pin.tap === tap;
        return html`<button type="button" class="hme-chip sel ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
          ?disabled=${tap === "page" && ctx.pages.length === 0} title=${tap === "page" && ctx.pages.length === 0 ? "Your library has no pages" : ""}
          @click=${() => pick(tap)}>${label}</button>`;
      })}</div>
      ${page ? hmeRow("Page", hmeSelect({
        label: "Page",
        value: pin.tap === "page" ? pin.pageId ?? "" : "",
        options: [
          ...(pin.tap === "page" ? [] : [{ value: "", label: "Pick a page…", disabled: true }]),
          ...(pageKnown ? [] : [{ value: pin.pageId!, label: "A page not in your library", disabled: true }]),
          ...ctx.pages.map((p) => ({ value: p.id, label: p.name })),
        ],
        set: (v) => {
          this.pickPage = false;
          if (v !== "") set({ tap: "page", pageId: v });
        },
      })) : nothing}
      <p class="hme-text dim">${pin.tap === undefined && !this.pickPage ? "As the tile does: a light toggles, anything else opens its control." : "Hold on the watch or iPhone: its controls."}</p>`);
  }

}

/** The Light card's Stay in room switch: On keeps the pool of light inside
 * the light's room (no `glowSpill`), Off lets it spread past the walls;
 * Mixed for several lights that differ, set to On by a press. `set` takes
 * whether it now stays. */
function stayRow(state: "on" | "off" | "mixed", set: (stay: boolean) => void): TemplateResult {
  const words = state === "on" ? "walls stop the glow" : state === "off" ? "the glow spreads past the walls" : "some stay in, some spread";
  return html`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${state === "mixed"
      ? html`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${() => set(true)}>Mixed</button>`
      : hmeChip({ on: state === "on", onText: "On", offText: "Off", label: "Stay in room", click: () => set(state !== "on") })}
    <span class="hme-text dim">${words}</span></div>`;
}

/** A slider for several picked things: at their shared value, or with no
 * knob (`mixed`) while they differ, until it is moved. `preview` follows the
 * drag, `set` saves on letting go. */
function mixedRange(o: { label: string; value: number | undefined; min: number; max: number; step: number; preview: (v: number) => void; set: (v: number) => void }): TemplateResult {
  const shown = o.value ?? (o.min + o.max) / 2;
  return html`<input class="hme-range ${o.value === undefined ? "mixed" : ""}" type="range" min=${o.min} max=${o.max} step=${o.step} .value=${live(String(shown))}
    aria-label=${o.label} aria-valuetext=${o.value === undefined ? "Mixed" : nothing} style=${o.value === undefined ? "--p:0%" : rangeFill(o.value, o.min, o.max)}
    @input=${(e: Event) => {
      const el = e.target as HTMLInputElement;
      el.classList.remove("mixed");
      o.preview(Number(el.value));
    }}
    @change=${(e: Event) => o.set(Number((e.target as HTMLInputElement).value))} />`;
}

/** A pin's Reading row: no pill, its reading in its pill, or its name. */
function readingRow(pin: HomeMapPin, tile: string, set: (f: HomeMapPinFields) => void): TemplateResult {
  return html`<div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
    ${hmePic({ label: "None", picture: readingPicture("none", tile), on: pin.reading === "none", click: () => set({ reading: "none" }) })}
    ${hmePic({ label: "Pill", picture: readingPicture("pill", tile), on: pin.reading === undefined, title: "Its reading, as 21.5°, 52% or 627 W, when it has one", click: () => set({ reading: null }) })}
    ${hmePic({ label: "Name", picture: readingPicture("name", tile), on: pin.reading === "name", click: () => set({ reading: "name" }) })}
  </div></div>`;
}

/** The Reading choice's small pictures: a pin alone, with its pill, or with
 * its name. */
function readingPicture(kind: "none" | "pill" | "name", fill: string): TemplateResult {
  return html`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${kind === "none" ? 20 : 16} r="9" fill=${fill} />
    ${kind === "pill" ? svg`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>` : nothing}
    ${kind === "name" ? svg`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>` : nothing}
  </svg>`;
}
