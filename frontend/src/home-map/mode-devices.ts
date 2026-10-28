// The map editor's Devices mode (mock board 3): put each device where it
// is, at its height, and say what it shows and what a tap on it does.
//
// The left rail finds any device Home Assistant has; lists the devices not
// on the map yet by Home Assistant area (the areas of this floor's rooms
// first), each dragged onto the plan to place it (the room it would land in
// lit with "Drop in <room>") or clicked to put it in its area's room; places
// them all by area at once; and counts the pins on the map by kind, a kind's
// chip dimming the others. On the stage every pin is drawn by this mode as a
// glass pin with its icon and live state (a light that is on amber, in its
// own colour when it has one) and its pill; a pin is dragged to move it, and
// the picked one is ringed, a light with the reach of its pool of light as a
// dashed ring whose handle sets `glow`. The room's side view, bottom left,
// shows the wall's height with a ruler, the furniture and the pin at its
// height, dragged up or down. The pill turns the device on or off, puts
// every light at this one's height, centres it in its room or takes it off
// the map. The inspector holds the pin's name, icon, room and pill; its
// height with presets; a light's glow size and colour; and what a tap on it
// does on the tiles, the iPhone and the watch.
//
// Every edit is an `edit-ops.ts` function by ids, saved through the shell
// (`editor-mode.ts` has the rules). The device lists are `devices-model.ts`,
// a pin's look `pin-look.ts`.

import { type SVGTemplateResult, type TemplateResult, html, nothing, svg } from "lit";
import { live } from "lit/directives/live.js";
import { rangeFill } from "../form-styles.js";
import { callService } from "../ha-api.js";
import {
  HOME_MAP_DEVICE_DRAG_TYPE,
  HOME_MAP_HEIGHT_PRESETS,
  HOME_MAP_TAP_CHOICES,
  type HomeMapDeviceEntry,
  type HomeMapDeviceKind,
  homeMapCanToggle,
  homeMapDeviceKind,
  homeMapDevices,
  homeMapDomainWords,
  homeMapFindDevices,
  homeMapKindCounts,
  homeMapPinOfEntity,
  homeMapPlaceableCount,
  homeMapRoomOfArea,
  homeMapStateText,
  homeMapToggleWords,
  homeMapTray,
} from "./devices-model.js";
import {
  type HomeMapPinFields,
  addPin,
  centerPinInRoom,
  homeMapPinsOfRoom,
  movePin,
  placeAllByArea,
  removePin,
  sameHeightForLights,
  setPinFields,
  setPinHeight,
} from "./edit-ops.js";
import { type HomeMapEditorContext, type HomeMapMode, homeMapSelectionRoom } from "./editor-mode.js";
import { hmeCard, hmeHint, hmeNumber, hmePic, hmeRow, hmeSelect, hmeText } from "./editor-parts.js";
import { homeMapCount, homeMapShortcut, homeMapToPlan } from "./editor-view.js";
import { homeLabelPoint, homePointBounds, homeRoomUnder } from "./geometry.js";
import {
  type HomeMapFloor,
  type HomeMapPin,
  type HomeMapPinIcon,
  type HomeMapPinTap,
  type HomeMapRoom,
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

/** A press this near a pin's middle, in pixels, picks it. */
const PIN_REACH = 15;
/** The glow ring's handle sits at this angle, down and to the right. */
const HANDLE_ANGLE = Math.PI / 4;
/** The glow slider's top; a bigger pool is typed. */
const GLOW_SLIDER_HIGH = 8;

const LIT = "#ffbf55";
const fmt = (v: number) => v.toFixed(1);

/** The words under a device's name in the rail: its kind and its state. */
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

export class DevicesMode implements HomeMapMode {
  readonly id = "devices" as const;
  readonly drawsPins = true;
  /** What the find box holds. */
  query = "";
  /** The kind whose pins stay bright; the rest dim. */
  filter: HomeMapDeviceKind | undefined;
  /** The room's side view under the picked pin. */
  side = true;
  /** Every pin's name in its pill. */
  names = false;
  /** The device dragged from the rail, and where over the plan. */
  private dragging: string | undefined;
  private dropAt: HomePoint | undefined;
  /** A pin or its glow ring is being dragged. */
  private moving = false;
  /** The icon menu is open. */
  private iconsOpen = false;
  /** Open a page picked, waiting for its page. */
  private pickPage = false;

  private states(ctx: HomeMapEditorContext): HomeMapStates | undefined {
    return ctx.toggles.live ? ctx.hass?.states : undefined;
  }

  private picked(ctx: HomeMapEditorContext): HomeMapPin | undefined {
    const sel = ctx.selection;
    return sel?.kind === "pin" ? ctx.floor.pins.find((p) => sameHomeMapId(p.id, sel.pinId)) : undefined;
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

  private placeAll(ctx: HomeMapEditorContext, devices: readonly HomeMapDeviceEntry[]): void {
    const list = devices.map((d) => ({ entityId: d.entityId, areaId: d.areaId, name: d.name, deviceClass: d.deviceClass }));
    const floorId = ctx.floor.id;
    ctx.apply((d) => placeAllByArea(d, floorId, list, () => ctx.newId())?.doc, { select: null });
  }

  // ── the rail ───────────────────────────────────────────────────────────

  rail(ctx: HomeMapEditorContext): TemplateResult {
    const states = ctx.hass?.states;
    const devices = homeMapDevices(ctx.hass);
    const groups = homeMapTray(ctx.doc, ctx.floor, devices);
    const tray = groups.reduce((n, g) => n + g.devices.length, 0);
    const placeable = homeMapPlaceableCount(ctx.floor, groups);
    const found = homeMapFindDevices(devices, this.query);
    const kinds = homeMapKindCounts(ctx.floor);
    const shownPins = ctx.floor.pins.filter((p) => this.filter === undefined || homeMapDeviceKind(p.entityId) === this.filter);
    return html`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find any device" aria-label="Find any device" .value=${live(this.query)}
          @input=${(e: Event) => { this.query = (e.target as HTMLInputElement).value; ctx.redraw(); }} /></label>
      ${this.query.trim() === "" ? nothing : hmeCard("Found", html`
        ${found.length === 0 ? html`<p class="hme-empty-line">No device by that name.</p>` : nothing}
        ${found.map((d) => this.deviceRow(ctx, d, states))}`, found.length >= 40 ? "40+" : String(found.length), "hme-tray")}
      ${hmeCard("Not on the map", html`
        ${tray === 0 ? html`<p class="hme-empty-line">Every device with an area is on the map. Find any other above.</p>` : nothing}
        ${groups.map((g) => html`<div class="hme-ar ${g.here ? "" : "dim"}">${g.name}<span>${g.devices.length}</span></div>
          ${g.devices.map((d) => this.deviceRow(ctx, d, states))}`)}
        ${tray === 0 ? nothing : html`<button type="button" class="hme-tb hme-wide" ?disabled=${placeable === 0}
            title=${placeable === 0 ? "Link this floor's rooms to Home Assistant areas in Arrange first" : ""}
            @click=${() => this.placeAll(ctx, groups.flatMap((g) => g.devices))}>Place all ${placeable} by area</button>
          <p class="hme-foot">Each goes into the room linked to its area, at a good height for its kind. Then drag to fine tune.</p>`}`,
        String(tray), "hme-tray")}
      ${hmeCard("On the map", html`
        ${kinds.length === 0 ? html`<p class="hme-empty-line">No devices on this floor yet. Drag one onto the plan.</p>` : html`<div class="hme-chips">
          ${kinds.map((k) => html`<button type="button" class="hme-chip sel ${this.filter === k.kind ? "on" : ""}" aria-pressed=${this.filter === k.kind ? "true" : "false"}
            @click=${() => { this.filter = this.filter === k.kind ? undefined : k.kind; ctx.redraw(); }}>${k.label} ${k.count}</button>`)}</div>`}
        ${shownPins.slice(0, 60).map((p) => {
          const on = ctx.selection?.kind === "pin" && sameHomeMapId(ctx.selection.pinId, p.id);
          return html`<button type="button" class="hme-lay ${on ? "on" : ""}" @click=${() => ctx.select({ kind: "pin", pinId: p.id })}>
            <span class="hme-dot dev ${homeMapPinLook(p.entityId, states).kind === "light" ? "" : "gray"}"></span>${homeMapPinName(p, ctx.hass)}
            <span class="n">${homeMapStateText(p.entityId, states)}</span></button>`;
        })}`, String(ctx.floor.pins.length))}`;
  }

  /** A device in the rail: dragged onto the plan to place it, clicked to
   * put it in its area's room; one on the map already is picked. */
  private deviceRow(ctx: HomeMapEditorContext, d: HomeMapDeviceEntry, states: HomeMapStates | undefined): TemplateResult {
    const there = homeMapPinOfEntity(ctx.doc, d.entityId);
    const icon = homeMapAutoPinIcon(d.entityId, d.deviceClass, d.name);
    return html`<div class="hme-dv ${this.dragging === d.entityId ? "dragging" : ""} ${there === undefined ? "" : "placed"}" role="button" tabindex="0"
      draggable=${there === undefined ? "true" : "false"} title=${there === undefined ? "Drag onto the plan, or click to put it in its area's room" : "On the map: click to pick it"}
      @dragstart=${(e: DragEvent) => {
        e.dataTransfer?.setData(HOME_MAP_DEVICE_DRAG_TYPE, d.entityId);
        e.dataTransfer?.setData("text/plain", d.entityId);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "copy";
        this.dragging = d.entityId;
        ctx.redraw();
      }}
      @dragend=${() => { this.dragging = undefined; this.dropAt = undefined; ctx.redraw(); }}
      @click=${() => this.place(ctx, d.entityId, undefined, d.areaId)}
      @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this.place(ctx, d.entityId, undefined, d.areaId); } }}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${homeMapPinGlyph(icon, "currentColor", 24, 2)}</svg></span>
      <span class="hme-dv-nm">${d.name}<small>${there === undefined ? homeMapDeviceLine(d, states) : "on the map"}</small></span>
      <span class="hme-dv-grip" aria-hidden="true">${there === undefined ? "⋮⋮" : "›"}</span>
    </div>`;
  }

  // ── dragging a device onto the plan ────────────────────────────────────

  dragOver(ctx: HomeMapEditorContext, at: HomePoint | undefined, e: DragEvent): boolean {
    const carries = this.dragging !== undefined || [...(e.dataTransfer?.types ?? [])].includes(HOME_MAP_DEVICE_DRAG_TYPE);
    const before = this.dropAt;
    this.dropAt = carries ? at : undefined;
    if (before !== this.dropAt) ctx.redraw();
    return carries && at !== undefined;
  }

  drop(ctx: HomeMapEditorContext, at: HomePoint, e: DragEvent): void {
    const entityId = this.dragging ?? e.dataTransfer?.getData(HOME_MAP_DEVICE_DRAG_TYPE) ?? "";
    this.dragging = undefined;
    this.dropAt = undefined;
    if (entityId !== "") this.place(ctx, entityId, at);
    else ctx.redraw();
  }

  // ── the stage ──────────────────────────────────────────────────────────

  overlay(ctx: HomeMapEditorContext): SVGTemplateResult {
    const states = this.states(ctx);
    const picked = this.picked(ctx);
    const parts: SVGTemplateResult[] = [];
    if (this.dropAt !== undefined) parts.push(this.dropMark(ctx, this.dropAt));
    const look = picked === undefined ? undefined : homeMapPinLook(picked.entityId, states);
    if (picked !== undefined && look?.kind === "light") parts.push(this.glowRing(ctx, picked, look.on ? look.brightness : undefined));
    for (const pin of ctx.floor.pins) {
      const on = picked !== undefined && sameHomeMapId(pin.id, picked.id);
      const dim = this.filter !== undefined && homeMapDeviceKind(pin.entityId) !== this.filter;
      parts.push(this.pinMark(ctx, pin, on, dim, states));
    }
    return svg`${parts}`;
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

  /** The picked light's pool as a dashed ring, its handle and its size. */
  private glowRing(ctx: HomeMapEditorContext, pin: HomeMapPin, brightness: number | undefined): SVGTemplateResult {
    const [x, y] = ctx.toScreen(pin.at);
    const meters = homeMapPinGlowRadius(pin, brightness);
    const R = ctx.px(meters);
    const h: HomePoint = [x + R * Math.cos(HANDLE_ANGLE), y + R * Math.sin(HANDLE_ANGLE)];
    const text = `Glow ${meters.toFixed(1)} m`;
    const w = text.length * 6.2 + 18;
    return svg`<g class="hme-glow-ring">
      <circle cx=${fmt(x)} cy=${fmt(y)} r=${fmt(R)} fill="none" stroke=${homeMapGlowHex(pin) ?? "#5b8def"} stroke-width="1.4" stroke-dasharray="5 5" pointer-events="none" />
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

  /** The pin a press at stage point `s` lands on, the top one first. */
  private pinAt(ctx: HomeMapEditorContext, s: HomePoint): HomeMapPin | undefined {
    let best: HomeMapPin | undefined;
    let bestD = PIN_REACH;
    for (const pin of ctx.floor.pins) {
      const p = ctx.toScreen(pin.at);
      const d = Math.hypot(p[0] - s[0], p[1] - s[1]);
      if (d <= bestD) {
        best = pin;
        bestD = d;
      }
    }
    return best;
  }

  pointerDown(ctx: HomeMapEditorContext, e: PointerEvent, at: HomePoint): boolean {
    if (e.button !== 0) return false;
    const s = ctx.toScreen(at);
    const picked = this.picked(ctx);
    const look = picked === undefined ? undefined : homeMapPinLook(picked.entityId, this.states(ctx));
    if (picked !== undefined && look?.kind === "light") {
      const [x, y] = ctx.toScreen(picked.at);
      const R = ctx.px(homeMapPinGlowRadius(picked, look.on ? look.brightness : undefined));
      if (Math.hypot(s[0] - (x + R * Math.cos(HANDLE_ANGLE)), s[1] - (y + R * Math.sin(HANDLE_ANGLE))) <= 10) {
        this.glowDrag(ctx, e, picked);
        return true;
      }
    }
    const pin = this.pinAt(ctx, s);
    if (pin === undefined) return false;
    ctx.select({ kind: "pin", pinId: pin.id });
    this.pickPage = false;
    this.iconsOpen = false;
    this.moveDrag(ctx, e, pin, at);
    return true;
  }

  /** Drag a pin: it follows the pointer, into the room it lands in, saved
   * once on the drop. */
  private moveDrag(ctx: HomeMapEditorContext, e: PointerEvent, pin: HomeMapPin, start: HomePoint): void {
    const id = pin.id;
    const from: HomePoint = [pin.at[0], pin.at[1]];
    let to = from;
    ctx.drag(e, {
      move: (p) => {
        this.moving = true;
        to = [from[0] + p[0] - start[0], from[1] + p[1] - start[1]];
        ctx.preview((d) => movePin(d, id, to));
      },
      end: (_p, _ev, moved) => {
        this.moving = false;
        ctx.preview(undefined);
        if (moved && Math.hypot(to[0] - from[0], to[1] - from[1]) >= 0.005) ctx.apply((d) => movePin(d, id, to), { select: { kind: "pin", pinId: id } });
      },
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
    });
  }

  keyDown(ctx: HomeMapEditorContext, e: KeyboardEvent): boolean {
    const pin = this.picked(ctx);
    if (pin === undefined) return false;
    const shortcut = homeMapShortcut(e, false);
    if (shortcut === "delete") {
      ctx.apply((d) => removePin(d, pin.id), { select: null });
      return true;
    }
    if (typeof shortcut === "object" && "nudge" in shortcut) {
      const [dx, dy] = shortcut.nudge;
      ctx.apply((d) => movePin(d, pin.id, [pin.at[0] + dx, pin.at[1] + dy]));
      return true;
    }
    return false;
  }

  leave(): void {
    this.dragging = undefined;
    this.dropAt = undefined;
    this.moving = false;
    this.iconsOpen = false;
    this.pickPage = false;
  }

  dock(ctx: HomeMapEditorContext): TemplateResult {
    const toggle = (label: string, on: boolean, flip: () => void, title: string) => html`<button type="button" class="hme-tb ${on ? "on" : ""}"
      aria-pressed=${on ? "true" : "false"} title=${title} @click=${() => { flip(); ctx.redraw(); }}>${label}</button>`;
    return html`${toggle("Side view", this.side, () => { this.side = !this.side; }, "The picked device's room from the side, to set its height")}
      ${toggle("Names", this.names, () => { this.names = !this.names; }, "Every device's name under its pin")}`;
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

  /** Turn a device on or off in Home Assistant itself. */
  private toggle(ctx: HomeMapEditorContext, entityId: string): void {
    const hass = ctx.hass;
    if (hass === undefined) return;
    callService(hass, "homeassistant", "toggle", { entity_id: entityId }).catch((err: unknown) => {
      ctx.note("err", `Could not turn it on or off: ${err instanceof Error ? err.message : String(err)}`);
    });
  }

  // ── the inspector ──────────────────────────────────────────────────────

  inspector(ctx: HomeMapEditorContext): TemplateResult {
    const pin = this.picked(ctx);
    if (pin === undefined) return this.overview(ctx);
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
        ${hmeRow("Icon", html`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen ? "true" : "false"}
          @click=${() => { this.iconsOpen = !this.iconsOpen; ctx.redraw(); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${homeMapPinGlyph(icon, "currentColor", 24, 2)}</svg>
          <span class="hme-grow">${homeMapIconWords(pin, deviceClass, friendly)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
        ${this.iconsOpen ? this.iconMenu(ctx, pin, auto, set) : nothing}
        ${hmeRow("Room", html`<span class="hme-in hme-ro">${homeMapPinRoomWords(ctx.floor, pin)}</span>`)}
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${hmePic({ label: "None", picture: readingPicture("none", tile), on: pin.reading === "none", click: () => set({ reading: "none" }) })}
          ${hmePic({ label: "Pill", picture: readingPicture("pill", tile), on: pin.reading === undefined, title: "Its reading, as 21.5°, 52% or 627 W, when it has one", click: () => set({ reading: null }) })}
          ${hmePic({ label: "Name", picture: readingPicture("name", tile), on: pin.reading === "name", click: () => set({ reading: "name" }) })}
        </div></div>`)}

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
    const id = pin.id;
    const reach = homeMapPinGlowRadius(pin, brightness);
    const hex = homeMapGlowHex(pin);
    const chip = (label: string, on: boolean, click: () => void) => html`<button type="button" class="hme-chip sel ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} @click=${click}>${label}</button>`;
    return hmeCard("Light", html`
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
          <input type="color" .value=${live(hex ?? "#ffb648")} aria-label="Pick the glow's color"
            @change=${(e: Event) => set({ glowColor: (e.target as HTMLInputElement).value })} /></label>
      </div></div>
      ${hmeHint("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`);
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

  /** With no pin picked: the floor's devices, or a picked room's. */
  private overview(ctx: HomeMapEditorContext): TemplateResult {
    const roomId = homeMapSelectionRoom(ctx.selection);
    const room: HomeMapRoom | undefined = roomId === undefined ? undefined : ctx.floor.rooms.find((r) => sameHomeMapId(r.id, roomId));
    const pins = room === undefined ? ctx.floor.pins : homeMapPinsOfRoom(ctx.floor, room.id);
    const states = ctx.hass?.states;
    return html`${hmeCard(room === undefined ? "Devices" : homeMapRoomName(room), html`
        <p class="hme-text">${room === undefined ? `${homeMapCount(ctx.floor.pins.length, "device")} on this floor.` : `${homeMapCount(pins.length, "device")} in this room.`}</p>
        ${pins.map((p) => html`<button type="button" class="hme-list-row" @click=${() => ctx.select({ kind: "pin", pinId: p.id })}>
          <span class="hme-grow">${homeMapPinName(p, ctx.hass)}</span><span class="hme-val">${homeMapStateText(p.entityId, states)}</span></button>`)}`)}
      ${hmeCard("Devices", html`<p class="hme-text">Pick a device on the plan to set its name, icon, height, glow and what a tap on it does.</p>
        <p class="hme-text dim">Drag a device from Not on the map onto the plan to place it. Drag a pin to move it; arrow keys nudge it, Delete takes it off the map.</p>`)}`;
  }
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
