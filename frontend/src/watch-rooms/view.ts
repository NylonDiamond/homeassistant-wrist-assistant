// The Rooms editor's body, drawn from a host that holds the document and
// takes key writes. The element (`rooms-editor.ts`) owns loading, saving and
// the bar; this file only draws and turns a change into the writes the
// phone makes for it (`model.ts`).
//
// Three columns, as the other watch editors lay theirs out:
//
// - Your rooms on the left: one row per room the watch knows (a page or
//   targets stored, added here by name, or reported by the room sensor in
//   the last day), the picked one lit, the add-by-name field under them and
//   the Home Assistant areas not yet in the list as chips to add.
// - The lit stage in the middle: what the watch does when you walk into the
//   picked room. The sensor's word for it, the page it opens drawn on the
//   watch (`renderWatchPagePreview`, from the watch's pages record) and the
//   things to point at.
// - The inspector on the right: the picked room's card (its page, its point
//   control targets, Remove), then Every room: the room sensor, Switch pages
//   by room and the point control switches.
//
// On a home that is not the watch's main house (`home`), the gestures and the
// point control switches are the main house's: one line says so in place of
// them, and Switch pages by room offers only the automatic switch and the
// fallback page, which are this home's own.

import { css, html, nothing, svg, type TemplateResult } from "lit";
import { checkField, entityField, segField, selectField, textField } from "../editors.js";
import type { HassLike } from "../ha-api.js";
import type { EntityRef } from "../model.js";
import type { IconProvider } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import { renderWatchFrame } from "../watch-frame.js";
import { type WatchPage, type WatchPagesDocument, watchPageId, watchPageName, watchPagesOf } from "../watch-pages/model.js";
import { renderWatchPagePreview, watchScreenBackground } from "../watch-pages/preview.js";
import {
  type BehaviorDocument,
  type RoomListEntry,
  type RoomPageChoice,
  type RoomsView,
  FALLBACK_LABELS,
  HOME_AUTO_SWITCH_LABEL,
  HOME_ROOMS_MAIN_HOUSE_TEXT,
  ZONES_UNREADABLE_TEXT,
  fallbackChoice,
  fallbackWrites,
  findPageChoice,
  homeAutoSwitch,
  homeAutoSwitchWrites,
  pointSwitchWrites,
  removeRoomWrites,
  roomIsListed,
  roomPage,
  roomPageWrites,
  roomZones,
  roomZonesWrites,
  sensorWrites,
  switchingWritesFor,
  triggerWrites,
} from "./model.js";
import {
  type PointZone,
  type RoomTrigger,
  POINT_CONTROL_DOMAINS,
  ROOM_KEYS,
  ROOM_RULES,
  STAY_ON_CURRENT_PAGE,
  compassPoint,
  friendlyNameFromId,
  normalizedRoomKey,
  roomFromState,
  wrapHeading,
} from "./rules.js";

export interface RoomsViewHost {
  hass: HassLike;
  /** The document with the edits laid over it. */
  document: BehaviorDocument;
  view: RoomsView;
  /** Keys whose edit changes the stored copy, for the cards' changed dots. */
  dirty: ReadonlySet<string>;
  pages: readonly RoomPageChoice[];
  rooms: readonly RoomListEntry[];
  /** "loading" while the areas and the sensor's states are read. */
  roomsState: "loading" | "ready";
  busy: boolean;
  uiState: Map<string, unknown>;
  write(writes: ReadonlyMap<string, unknown>, coalesce?: string): void;
  endCoalesce(): void;
  addRoom(name: string): void;
  requestUpdate(): void;
  /** A home that is not the watch's main house: its own `rooms` record,
   * without the four main house keys. Absent or false is the main house. */
  home?: boolean;
  /** Rooms added here by name, which stay listed until the page is left. */
  added?: readonly string[];
  /** Take a room added by name off the list again. */
  forgetRoom?(key: string): void;
  /** The watch's pages, as Home Assistant holds them, for the picture of the
   * page a room opens. Without them the watch shows the page's name. */
  pagesDocument?: WatchPagesDocument;
  /** The watch's screen in points. Absent, the 46 mm watch's. */
  screen?: { width: number; height: number };
  icons?: IconProvider;
  /** The stage is one column: the watch drawn a little smaller. */
  narrow?: boolean;
}

/** The Rooms hue, Home's Rooms door: the card outlines, the icon chips and
 * the stage's edge. */
const ROOMS_HUE = "var(--wa-hue-pink)";

/** The 46 mm watch's screen, when the watch has not said its own. */
const DEFAULT_SCREEN = { width: 208, height: 248 };

function nameOf(hass: HassLike, entityId: string): string {
  const name = hass.states[entityId]?.attributes?.friendly_name;
  return typeof name === "string" && name.trim() !== "" ? name : entityId;
}

function refOf(hass: HassLike, entityId: string): EntityRef {
  const dot = entityId.indexOf(".");
  return { entityId, displayName: entityId === "" ? "" : nameOf(hass, entityId), domain: dot < 0 ? "" : entityId.slice(0, dot) };
}

function anyDirty(host: RoomsViewHost, keys: readonly string[]): boolean {
  return keys.some((k) => host.dirty.has(k));
}

function dirtyDot(on: boolean): TemplateResult | typeof nothing {
  return on ? html`<span class="sec-dot" title="Changed, not saved yet" aria-label="Changed"></span>` : nothing;
}

// ── Room sensor ──────────────────────────────────────────────────────────

/** What the sensor says now, and whether the watch reads it as a room. */
export function sensorReading(hass: HassLike, sensor: string): { line: string; tone: "ok" | "warn" | "none" } {
  if (sensor === "") return { line: NO_SENSOR_TEXT, tone: "none" };
  const state = hass.states[sensor];
  if (state === undefined) return { line: "Home Assistant has no entity with this id now.", tone: "warn" };
  const room = roomFromState(sensor, state);
  const raw = typeof state.state === "string" ? state.state : "";
  if (room === undefined) return { line: `Now "${raw}", which the watch does not read as a room.`, tone: "warn" };
  const key = normalizedRoomKey(room);
  return { line: `Now in ${room}${key === "" ? ", whose name has no letter or digit the watch can match" : ""}.`, tone: key === "" ? "warn" : "ok" };
}

/** The room the sensor names now, as the watch matches it; "" for none. */
function currentRoomKey(hass: HassLike, sensor: string): string {
  if (sensor === "") return "";
  const room = roomFromState(sensor, hass.states[sensor]);
  return room === undefined ? "" : normalizedRoomKey(room);
}

/** Bermuda, the integration that makes an area sensor from Bluetooth, is
 * not something a new user knows by name: the word links to it. */
export const BERMUDA_URL = "https://github.com/agittins/bermuda";

/** With no sensor picked the watch looks for one itself, by name
 * (`detectCurrentRoomName` in the watch app scores "bermuda", "area",
 * "room" and the like), which can find the wrong one or none. */
export const NO_SENSOR_TEXT = "No room sensor picked. The watch looks for one by its name, such as a Bermuda area sensor. Pick one to be sure.";

/** Why Bermuda, in the card that stands at the top until one is picked. */
export const BERMUDA_PITCH = "Bermuda uses Bluetooth to tell which room your watch is in. Rooms works best with its area sensor. Add Bermuda to Home Assistant, then pick its sensor here.";

/** A Bermuda area sensor: Bermuda marks its sensors with its own device
 * class, and its names often say Bermuda. */
export function isBermudaSensor(hass: HassLike, sensor: string): boolean {
  if (sensor === "") return false;
  const state = hass.states[sensor];
  const deviceClass = typeof state?.attributes?.device_class === "string" ? state.attributes.device_class : "";
  if (deviceClass.toLowerCase().startsWith("bermuda")) return true;
  const name = typeof state?.attributes?.friendly_name === "string" ? state.attributes.friendly_name : "";
  return `${sensor} ${name}`.toLowerCase().includes("bermuda");
}

/** Puts the cursor in the room sensor field, from the stage's button. */
function focusSensor(e: Event): void {
  const root = (e.currentTarget as HTMLElement).getRootNode() as ParentNode;
  const field = root.querySelector<HTMLElement>(".rm-sensor-field");
  field?.scrollIntoView({ block: "center", behavior: "smooth" });
  field?.querySelector<HTMLElement>("input, button")?.focus();
}

function withBermudaLink(line: string): TemplateResult | string {
  const at = line.indexOf("Bermuda");
  if (at < 0) return line;
  return html`${line.slice(0, at)}<a href=${BERMUDA_URL} target="_blank" rel="noopener noreferrer">Bermuda</a>${line.slice(at + "Bermuda".length)}`;
}

// ── pages ────────────────────────────────────────────────────────────────

function pageOptions(pages: readonly RoomPageChoice[], stored: string, lead: [string, string][]): [string, string][] {
  const options: [string, string][] = [...lead, ...pages.map((p): [string, string] => [p.id, p.name])];
  if (stored !== "" && !lead.some(([v]) => v === stored) && findPageChoice(pages, stored) === undefined) {
    options.push([stored, "A page not on this watch"]);
  }
  return options;
}

/** The option a stored page id selects: the listed page's own id spelling. */
function pageValue(pages: readonly RoomPageChoice[], stored: string): string {
  return findPageChoice(pages, stored)?.id ?? stored;
}

/** A stored page's name, "" for none. */
function pageNameOf(host: RoomsViewHost, stored: string): string {
  if (stored === "") return "";
  return findPageChoice(host.pages, stored)?.name ?? "A page not on this watch";
}

/** The watch's page a stored id names, without regard to case. */
function watchPageFor(host: RoomsViewHost, stored: string): WatchPage | undefined {
  const want = stored.trim().toLowerCase();
  if (want === "") return undefined;
  return watchPagesOf(host.pagesDocument).find((p) => watchPageId(p).toLowerCase() === want);
}

// ── the list ─────────────────────────────────────────────────────────────

/** The rooms in the Your rooms list, in the merged list's order. */
export function listedRooms(host: Pick<RoomsViewHost, "rooms" | "view" | "added">): RoomListEntry[] {
  return host.rooms.filter((r) => roomIsListed(host.view, r, host.added ?? []));
}

/** The Home Assistant areas not in the list yet, offered as chips. */
export function offeredAreas(host: Pick<RoomsViewHost, "rooms" | "view" | "added">): RoomListEntry[] {
  return host.rooms.filter((r) => r.area && !roomIsListed(host.view, r, host.added ?? []));
}

/** The room the stage and the inspector show: the one picked, else the
 * first in the list. */
export function pickedRoom(host: Pick<RoomsViewHost, "uiState">, listed: readonly RoomListEntry[]): RoomListEntry | undefined {
  const key = host.uiState.get("pick");
  return listed.find((r) => r.key === key) ?? listed[0];
}

function pick(host: RoomsViewHost, key: string): void {
  host.uiState.set("pick", key);
  host.requestUpdate();
}

function pointWords(n: number): string {
  if (n === 0) return "nothing to point at";
  return n === 1 ? "1 thing to point at" : `${n} things to point at`;
}

/** A room row's second line: the page it opens and how many targets. */
export function roomRowLine(host: RoomsViewHost, room: RoomListEntry): string {
  const page = pageNameOf(host, roomPage(host.view, room.key));
  const zones = host.view.zones.ok ? roomZones(host.view.zones.rooms, room.key).length : 0;
  return `${page === "" ? "No page yet" : `Opens ${page}`} · ${pointWords(zones)}`;
}

function renderRoomRow(host: RoomsViewHost, room: RoomListEntry, on: boolean, here: boolean): TemplateResult {
  return html`<li>
    <button type="button" class="rm-room ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} @click=${() => pick(host, room.key)}>
      <span class="rm-chip" aria-hidden="true">${uiIcon("home")}</span>
      <span class="rm-room-text">
        <span class="rm-room-top"><b class="rm-room-name">${room.name}</b>${here ? html`<span class="rm-here"><i aria-hidden="true"></i>You are here</span>` : nothing}</span>
        <span class="rm-room-sub">${roomRowLine(host, room)}</span>
      </span>
    </button>
  </li>`;
}

function addRoomNamed(host: RoomsViewHost, name: string): void {
  const key = normalizedRoomKey(name);
  if (key === "") return;
  host.addRoom(name.trim());
  pick(host, key);
}

function renderAddRoom(host: RoomsViewHost): TemplateResult {
  const text = String(host.uiState.get("addRoom") ?? "");
  const key = normalizedRoomKey(text);
  const listed = listedRooms(host);
  const exists = key !== "" && listed.some((r) => r.key === key);
  const add = () => {
    if (key === "" || exists) return;
    host.uiState.set("addRoom", "");
    addRoomNamed(host, text);
  };
  return html`<div class="rm-add-room">
    <input type="text" placeholder="Add a room by name" aria-label="Room name" .value=${text}
      @input=${(e: Event) => { host.uiState.set("addRoom", (e.target as HTMLInputElement).value); host.requestUpdate(); }}
      @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
    <button type="button" class="lc-btn rm-add" ?disabled=${key === "" || exists} @click=${add}>${uiIcon("plus")}<span>Add</span></button>
  </div>
  ${text.trim() !== "" && key === "" ? html`<p class="rm-help warn">The watch matches room names by their letters a to z and digits, and this name has none.</p>` : nothing}
  ${exists ? html`<p class="rm-help">That room is in the list.</p>` : nothing}`;
}

function renderRoomsCard(host: RoomsViewHost, listed: readonly RoomListEntry[], picked: RoomListEntry | undefined): TemplateResult {
  const here = currentRoomKey(host.hass, host.view.sensor);
  const areas = offeredAreas(host);
  return html`<section class="card lc rm-rooms-card" aria-label="Your rooms" style=${`--c: ${ROOMS_HUE}`}>
    <div class="lc-head">
      <span class="swatch">${uiIcon("home")}</span><span class="lc-title">Your rooms</span>
      <span class="lc-sub">${listed.length}</span>${dirtyDot(anyDirty(host, [ROOM_KEYS.mappings, ROOM_KEYS.zones]))}
    </div>
    <div class="rm-rooms-body">
      ${listed.length === 0
        ? html`<div class="rm-none">
            <b>${host.roomsState === "loading" ? "Reading your rooms" : "No rooms yet"}</b>
            <span>${host.roomsState === "loading" ? "The areas and what the room sensor reported." : areas.length > 0 ? "Pick an area below, or type a name." : "Type a room's name below."}</span>
          </div>`
        : html`<ul class="rm-rooms" aria-label="Rooms">${listed.map((r) => renderRoomRow(host, r, r.key === picked?.key, r.key === here))}</ul>`}
      ${renderAddRoom(host)}
      ${areas.length > 0 ? html`<div class="rm-areas">
        <span class="rm-areas-l">From your Home Assistant areas</span>
        ${areas.map((a) => html`<button type="button" class="rm-area" title=${`Add ${a.name} to your rooms`} @click=${() => addRoomNamed(host, a.name)}>+ ${a.name}</button>`)}
      </div>` : nothing}
    </div>
  </section>`;
}

// ── the stage ────────────────────────────────────────────────────────────

/** The watch's size on the stage, in pixels per point. */
const STAGE_SCALE = 1.15;
/** The page picker's thumbnail, in pixels per point. */
const THUMB_SCALE = 0.2;

/** The screen's height in pixels at a scale: the picture of a page shows one
 * screen of it, what the watch opens on, and no more. */
function screenHeightPx(host: RoomsViewHost, scale: number): number {
  return Math.round((host.screen ?? DEFAULT_SCREEN).height * scale * 100) / 100;
}

/** The watch showing the page a room opens: the page itself when the
 * watch's pages are at hand, else a plain screen with its name. */
function renderRoomWatch(host: RoomsViewHost, stored: string): TemplateResult {
  const screen = host.screen ?? DEFAULT_SCREEN;
  const scale = host.narrow === true ? 1 : STAGE_SCALE;
  const page = watchPageFor(host, stored);
  if (page !== undefined) {
    return renderWatchPagePreview({
      page,
      pages: watchPagesOf(host.pagesDocument),
      screen,
      states: host.hass.states,
      ...(host.icons ? { icons: host.icons } : {}),
      scale,
      ...(host.home === true ? {} : { behavior: host.document }),
    });
  }
  const name = pageNameOf(host, stored);
  return renderWatchFrame(screen, scale, html`<div class="wp-screen rm-screen"
    style=${`width:${screen.width * scale}px;height:${screen.height * scale}px;background:${watchScreenBackground({}, scale, screen)}`}>
    <span>${name === "" ? "No page yet" : name}</span>
  </div>`, name === "" ? "Watch" : `Watch showing ${name}`);
}

function renderStage(host: RoomsViewHost, room: RoomListEntry | undefined): TemplateResult {
  if (room === undefined) {
    return html`<div class="card canvas-card lit rm-canvas" aria-label="Rooms">
      <div class="stage-area rm-stage-area rm-empty">
        <div class="rm-empty-watch" aria-hidden="true">${uiIcon("home")}</div>
        <div class="rm-empty-text">
          <b>Your watch can follow you around the house</b>
          <span>Add a room and give it a page. When you walk in, the watch opens that page. Point the watch at a lamp to control it.</span>
        </div>
        <ol class="rm-steps">
          <li><b>1</b>Add a room</li>
          <li><b>2</b>Pick its page</li>
          <li><b>3</b>Pick a room sensor</li>
        </ol>
      </div>
    </div>`;
  }
  const stored = roomPage(host.view, room.key);
  const value = pageValue(host.pages, stored);
  const switching = host.home === true ? homeAutoSwitch(host.document) : host.view.switching;
  return html`<div class="card canvas-card lit rm-canvas" aria-label=${`What the watch does in ${room.name}`}>
    <div class="rm-stage-head">
      <b class="rm-stage-title">${room.name}</b>
      <span class="rm-stage-sub">What the watch does when you walk in</span>
    </div>
    <div class="stage-area rm-stage-area">
      <div class="rm-flow">
        <div class="rm-flow-side rm-flow-in">
          <div class="rm-step">
            <span class="rm-step-l">1 · Sensor says</span>
            <code class="rm-key" title="The room sensor's state that names this room. The watch matches its letters and digits.">${room.key}</code>
            ${host.view.sensor === "" ? html`<span class="rm-step-note">No room sensor picked</span>
              <button type="button" class="rm-stage-btn" @click=${focusSensor}>Pick a sensor</button>` : nothing}
          </div>
          <div class="rm-step">
            <span class="rm-step-l">2 · Watch opens</span>
            <select class="rm-stage-select" aria-label=${`Page to open in ${room.name}`} ?disabled=${host.busy}
              @change=${(e: Event) => { if (!host.busy) host.write(roomPageWrites(host.document, room.key, (e.target as HTMLSelectElement).value)); }}>
              ${pageOptions(host.pages, value, [["", "No page"]]).map(([v, label]) => html`<option value=${v} ?selected=${v === value}>${label}</option>`)}
            </select>
            ${switching ? nothing : html`<span class="rm-step-note">${host.home === true ? "Switch automatically is off" : "Switch pages by room is off"}</span>
              <button type="button" class="rm-stage-btn" ?disabled=${host.busy} @click=${() => {
                if (host.busy) return;
                host.write(host.home === true ? homeAutoSwitchWrites(host.document, true) : switchingWritesFor(host.document, true));
              }}>Turn on</button>`}
          </div>
          <span class="rm-wire" aria-hidden="true"><i></i></span>
        </div>
        <div class="rm-stage-body" style=${`--rm-screen-h: ${screenHeightPx(host, host.narrow === true ? 1 : STAGE_SCALE)}px`}>${renderRoomWatch(host, stored)}</div>
        <!-- An empty side, so the watch stays in the middle. Point control is
             rare, so it lives only in the room's card on the right. -->
        <div class="rm-flow-side rm-flow-out" aria-hidden="true"></div>
      </div>
    </div>
  </div>`;
}

// ── the heading dial ─────────────────────────────────────────────────────

/** Degrees clockwise from north for a point on a dial centred on (cx, cy). */
export function headingAt(x: number, y: number, cx: number, cy: number): number {
  const degrees = (Math.atan2(x - cx, cy - y) * 180) / Math.PI;
  return wrapHeading(degrees);
}

function renderDial(host: RoomsViewHost, zones: readonly PointZone[], index: number, set: (heading: number, coalesce: string) => void, key: string): TemplateResult {
  const heading = zones[index]!.centerHeading;
  const r = 26;
  const c = 32;
  const at = (deg: number, len: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: c + Math.sin(rad) * len, y: c - Math.cos(rad) * len };
  };
  const tip = at(heading, r - 3);
  const drag = (e: PointerEvent) => {
    if (host.busy || e.button !== 0) return;
    const box = e.currentTarget as SVGSVGElement;
    const rect = box.getBoundingClientRect();
    const scale = rect.width / 64;
    const move = (ev: PointerEvent) => set(headingAt((ev.clientX - rect.left) / scale, (ev.clientY - rect.top) / scale, c, c), key);
    move(e);
    box.setPointerCapture?.(e.pointerId);
    const end = () => {
      box.removeEventListener("pointermove", move);
      box.removeEventListener("pointerup", end);
      box.removeEventListener("pointercancel", end);
      host.endCoalesce();
    };
    box.addEventListener("pointermove", move);
    box.addEventListener("pointerup", end);
    box.addEventListener("pointercancel", end);
  };
  const keys = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 15 : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") set(wrapHeading(heading + step), key);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") set(wrapHeading(heading - step), key);
    else return;
    e.preventDefault();
  };
  return html`<svg class="rm-dial" viewBox="0 0 64 64" role="slider" tabindex="0" aria-label="Heading"
    aria-valuemin="0" aria-valuemax="359" aria-valuenow=${Math.round(heading)} aria-valuetext=${`${Math.round(heading)} degrees, ${compassPoint(heading)}`}
    @pointerdown=${drag} @keydown=${keys} @blur=${() => host.endCoalesce()}>
    <circle class="rm-dial-face" cx=${c} cy=${c} r=${r}></circle>
    ${[0, 90, 180, 270].map((d) => {
      const a = at(d, r - 1);
      const b = at(d, r - 5);
      return svg`<line class="rm-dial-tick" x1=${a.x} y1=${a.y} x2=${b.x} y2=${b.y}></line>`;
    })}
    <text class="rm-dial-n" x=${c} y="13">N</text>
    ${zones.map((z, i) => {
      if (i === index) return nothing;
      const p = at(z.centerHeading, r - 3);
      return svg`<circle class="rm-dial-other" cx=${p.x} cy=${p.y} r="2"></circle>`;
    })}
    <line class="rm-dial-needle" x1=${c} y1=${c} x2=${tip.x} y2=${tip.y}></line>
    <circle class="rm-dial-tip" cx=${tip.x} cy=${tip.y} r="3.2"></circle>
    <circle class="rm-dial-hub" cx=${c} cy=${c} r="2.2"></circle>
  </svg>`;
}

// ── the picked room's card ───────────────────────────────────────────────

function renderTarget(host: RoomsViewHost, roomKey: string, zones: readonly PointZone[], index: number): TemplateResult {
  const zone = zones[index]!;
  const update = (change: (z: PointZone) => PointZone | undefined, coalesce?: string) => {
    if (host.busy) return;
    const next = zones.flatMap((z, i) => {
      if (i !== index) return [z];
      const changed = change(z);
      return changed === undefined ? [] : [changed];
    });
    const writes = roomZonesWrites(host.document, roomKey, next);
    if (writes !== undefined) host.write(writes, coalesce);
  };
  const setHeading = (heading: number, coalesce: string) => update((z) => ({ ...z, centerHeading: wrapHeading(heading) }), coalesce);
  const key = `target:${roomKey}:${index}`;
  return html`<div class="rm-target">
    ${renderDial(host, zones, index, setHeading, `${key}:heading`)}
    <div class="rm-target-fields">
      <div class="rm-stack">${entityField({ hass: host.hass }, "Entity", refOf(host.hass, zone.entityId), (ref) => {
        const id = ref.entityId.trim();
        if (id === "" || id === zone.entityId) return;
        update((z) => ({ ...z, entityId: id }));
      }, `rooms:${key}:entity`, { domain: POINT_CONTROL_DOMAINS, clearable: false })}</div>
      <label class="field num rm-heading">
        <span>Heading</span>
        <span class="rm-heading-box">
          <input type="number" min="0" max="359" step="1" .value=${String(Math.round(zone.centerHeading))} ?disabled=${host.busy}
            aria-label="Heading in degrees"
            @change=${(e: Event) => {
              const box = e.target as HTMLInputElement;
              const n = Number(box.value);
              if (box.value.trim() === "" || Number.isNaN(n)) { box.value = String(Math.round(zone.centerHeading)); return; }
              setHeading(n, `${key}:typed`);
              host.endCoalesce();
            }} />
          <span class="rm-compass">° ${compassPoint(zone.centerHeading)}</span>
        </span>
      </label>
      ${textField("Label", zone.label ?? "", (v) => update((z) => {
        const out: PointZone = { entityId: z.entityId, centerHeading: z.centerHeading };
        if (v !== "") out.label = v;
        return out;
      }, `${key}:label`), { placeholder: friendlyNameFromId(zone.entityId) })}
    </div>
    <button type="button" class="rm-remove" title="Remove this target" aria-label="Remove this target" ?disabled=${host.busy}
      @click=${() => update(() => undefined)}>${uiIcon("close")}</button>
  </div>`;
}

/** How to read a heading, kept out of the card and in the tooltip. */
export const HEADING_HELP_DETAIL = "To read a heading, stand where you point from, face the target and open Heading on the watch (in Connection Health, or on the point control of a room with no targets). Type the number it shows.";

function renderTargets(host: RoomsViewHost, room: RoomListEntry): TemplateResult {
  const { view } = host;
  const adding = host.uiState.get(`adding:${room.key}`) === true;
  const head = (zones: number) => html`<div class="rm-sub-h">
    <span>Things to point at</span>
    ${view.zones.ok ? html`<button type="button" class="lc-btn rm-add-thing" ?disabled=${host.busy} aria-expanded=${adding ? "true" : "false"}
      @click=${() => { host.uiState.set(`adding:${room.key}`, !adding); host.requestUpdate(); }}>${adding && zones > 0 ? "Done" : "+ Add a thing"}</button>` : nothing}
  </div>`;
  if (!view.zones.ok) return html`${head(0)}<p class="rm-help warn">${ZONES_UNREADABLE_TEXT}</p>`;
  const zones = roomZones(view.zones.rooms, room.key);
  const addKey = `rooms:target-add:${room.key}`;
  return html`${head(zones.length)}
    ${zones.length === 0 && !adding ? html`<p class="rm-help">None yet. Add a lamp or a switch you point the watch at in this room.</p>` : nothing}
    ${zones.map((_, i) => renderTarget(host, room.key, zones, i))}
    ${adding ? html`<div class="rm-stack rm-add-target">${entityField({ hass: host.hass }, "Add a thing", refOf(host.hass, ""), (ref) => {
      const id = ref.entityId.trim();
      if (id === "" || host.busy || zones.some((z) => z.entityId === id)) return;
      const writes = roomZonesWrites(host.document, room.key, [...zones, { entityId: id, centerHeading: 0, label: friendlyNameFromId(id) }]);
      if (writes !== undefined) host.write(writes);
      host.uiState.set(`adding:${room.key}`, false);
    }, addKey, { domain: POINT_CONTROL_DOMAINS, clearable: false })}</div>` : nothing}
    ${zones.length > 0 ? html`<p class="rm-help" title=${HEADING_HELP_DETAIL}>Heading is degrees clockwise from north. Drag the dial or type it.</p>` : nothing}`;
}

/** The thumbnail beside the page picker: the page at a small scale. */
function renderPageThumb(host: RoomsViewHost, stored: string): TemplateResult | typeof nothing {
  const page = watchPageFor(host, stored);
  if (page === undefined) return nothing;
  const screen = host.screen ?? DEFAULT_SCREEN;
  return html`<span class="rm-thumb" aria-hidden="true" title=${watchPageName(page)} style=${`--rm-screen-h: ${screenHeightPx(host, THUMB_SCALE)}px`}>${renderWatchPagePreview({
    page, pages: [page], screen, states: host.hass.states, ...(host.icons ? { icons: host.icons } : {}), scale: THUMB_SCALE,
  })}</span>`;
}

function renderRoomCard(host: RoomsViewHost, room: RoomListEntry): TemplateResult {
  const stored = roomPage(host.view, room.key);
  const value = pageValue(host.pages, stored);
  const remove = () => {
    if (host.busy) return;
    const writes = removeRoomWrites(host.document, room.key);
    host.forgetRoom?.(room.key);
    if (writes.size > 0) host.write(writes);
    host.requestUpdate();
  };
  return html`<section class="sec rm-card rm-room-card" data-open="true" aria-label=${room.name} style=${`--c: ${ROOMS_HUE}`}>
    <div class="sec-h pinned">
      <span class="swatch">${uiIcon("home")}</span>
      <span class="tt"><h4>${room.name}${dirtyDot(anyDirty(host, [ROOM_KEYS.mappings, ROOM_KEYS.zones]))}</h4></span>
      <button type="button" class="rm-danger" ?disabled=${host.busy}
        title="Take this room off: its page and its things to point at go. Undo brings them back." @click=${remove}>Remove</button>
    </div>
    <div class="sec-b">
      ${room.key !== room.name.toLowerCase() ? html`<p class="rm-help">The sensor has to say <code>${room.key}</code>, in any case or spacing.</p>` : nothing}
      <div class="rm-page-pick">
        ${renderPageThumb(host, stored)}
        <div class="rm-stack">${selectField("Page to open", value, pageOptions(host.pages, value, [["", "None"]]), (v) => {
          if (!host.busy) host.write(roomPageWrites(host.document, room.key, v));
        }, { snapBack: true })}</div>
      </div>
      ${renderTargets(host, room)}
    </div>
  </section>`;
}

// ── Every room ───────────────────────────────────────────────────────────

/** One switch with its line under it. */
function switchRow(label: string, on: boolean, line: string, set: (v: boolean) => void): TemplateResult {
  return html`<div class="rm-switch">${checkField(label, on, set)}<p class="rm-help">${line}</p></div>`;
}

function renderSensor(host: RoomsViewHost): TemplateResult {
  const { view } = host;
  const reading = view.sensor === "" ? undefined : sensorReading(host.hass, view.sensor);
  const bermuda = isBermudaSensor(host.hass, view.sensor);
  return html`<div class="rm-stack rm-sensor-field" title=${view.sensor === "" ? "" : "Clearing the sensor turns Switch pages by room off."}>${entityField({ hass: host.hass }, "Room sensor", refOf(host.hass, view.sensor), (ref) => {
      if (host.busy) return;
      host.write(sensorWrites(host.document, ref.entityId));
    }, "rooms:sensor", { clearable: true })}</div>
    ${reading ? html`<div class="rm-reading"><i class="rm-dot ${reading.tone}" aria-hidden="true"></i><span>${reading.line}</span></div>` : nothing}
    ${bermuda ? html`<p class="rm-bermuda-ok">${uiIcon("check")}<span>A Bermuda area sensor, the best kind for Rooms.</span></p>`
      : view.sensor === "" ? html`<p class="rm-help">${withBermudaLink(NO_SENSOR_TEXT)}</p>` : nothing}`;
}

/** Bermuda, standing out at the top of the inspector until its sensor is
 * the one picked. With no sensor at all the sensor field comes up here too,
 * so picking one is the first thing on the page. */
function renderBermudaCard(host: RoomsViewHost): TemplateResult | typeof nothing {
  const sensor = host.view.sensor;
  if (isBermudaSensor(host.hass, sensor)) return nothing;
  return html`<section class="sec rm-card rm-bermuda" data-open="true" aria-label="Best with Bermuda" style=${`--c: ${ROOMS_HUE}`}>
    <div class="sec-h pinned">
      <span class="swatch">${uiIcon("place")}</span>
      <span class="tt"><h4>Best with Bermuda</h4></span>
    </div>
    <div class="sec-b">
      <p class="rm-pitch">${BERMUDA_PITCH}</p>
      <a class="rm-bermuda-link" href=${BERMUDA_URL} target="_blank" rel="noopener noreferrer">Get Bermuda</a>
      ${sensor === "" ? renderSensor(host) : nothing}
    </div>
  </section>`;
}

function fallbackField(host: RoomsViewHost): TemplateResult {
  const fallback = fallbackChoice(host.view.fallback);
  const fallbackValue = fallback === "first" ? "" : fallback === "stay" ? STAY_ON_CURRENT_PAGE : pageValue(host.pages, host.view.fallback);
  return html`<div class="rm-stack">${selectField("Fallback page", fallbackValue,
    pageOptions(host.pages, fallbackValue, [[STAY_ON_CURRENT_PAGE, FALLBACK_LABELS.stay], ["", FALLBACK_LABELS.first]]),
    (v) => { if (!host.busy) host.write(fallbackWrites(v)); }, { snapBack: true })}</div>
    <p class="rm-help">When the room cannot be told, or has no page.</p>`;
}

function renderSwitching(host: RoomsViewHost): TemplateResult {
  const { view } = host;
  const triggers = ROOM_RULES.switching.triggers;
  const help = triggers.find((t) => t.value === view.trigger)?.help ?? "";
  return html`${switchRow("Switch pages by room", view.switching, "Jump to the page you give a room.", (on) => { if (!host.busy) host.write(switchingWritesFor(host.document, on)); })}
    ${view.switching ? html`<div class="rm-sub-group">
      <div class="rm-stack">${segField("When", view.trigger, triggers.map((t): [RoomTrigger, string] => [t.value, t.label]), (v) => {
        if (!host.busy) host.write(triggerWrites(host.document, v));
      })}</div>
      <p class="rm-help">${help}</p>
      ${fallbackField(host)}
    </div>` : nothing}`;
}

/** Switch pages by room on a home that is not the main house: the automatic
 * switch and the fallback page, which this home keeps. The gestures that
 * also switch are the main house's. */
function renderHomeSwitching(host: RoomsViewHost): TemplateResult {
  const auto = homeAutoSwitch(host.document);
  const help = ROOM_RULES.switching.triggers.find((t) => t.value === "Automatic")?.help ?? "";
  return html`${switchRow(HOME_AUTO_SWITCH_LABEL, auto, help, (on) => { if (!host.busy) host.write(homeAutoSwitchWrites(host.document, on)); })}
    <div class="rm-sub-group">${fallbackField(host)}</div>`;
}

function renderPointSwitches(host: RoomsViewHost): TemplateResult {
  const { view } = host;
  const values: Record<string, boolean> = { [ROOM_KEYS.tapToToggle]: view.tapToToggle, [ROOM_KEYS.liveTile]: view.liveTile };
  return html`<div class="rm-point-switches" title="One value for every point control tile on this watch.">
    <div class="rm-sub-h"><span>Point control</span></div>
    ${ROOM_RULES.pointControl.switches.map((s) => {
      const on = values[s.key] ?? s.absent;
      return switchRow(s.label, on, on ? s.onDetail : s.offDetail, (v) => { if (!host.busy) host.write(pointSwitchWrites(s.key, v)); });
    })}
  </div>`;
}

function renderEveryRoomCard(host: RoomsViewHost): TemplateResult {
  const home = host.home === true;
  const keys = home
    ? [ROOM_KEYS.sensor, ROOM_KEYS.autoSwitch, ROOM_KEYS.legacyQuickJump, ROOM_KEYS.fallback]
    : [ROOM_KEYS.sensor, ROOM_KEYS.autoSwitch, ROOM_KEYS.legacyQuickJump, ROOM_KEYS.topSectionDoubleTap, ROOM_KEYS.handGesture, ROOM_KEYS.fallback, ROOM_KEYS.tapToToggle, ROOM_KEYS.liveTile];
  return html`<section class="sec rm-card rm-every" data-open="true" aria-label="Every room">
    <div class="sec-h pinned"><span class="tt"><h4>Every room${dirtyDot(anyDirty(host, keys))}</h4></span></div>
    <div class="sec-b">
      ${home ? html`<p class="rm-help rm-main-house">${HOME_ROOMS_MAIN_HOUSE_TEXT}</p>` : nothing}
      ${host.view.sensor === "" ? nothing : renderSensor(host)}
      ${home ? renderHomeSwitching(host) : renderSwitching(host)}
      ${home ? nothing : renderPointSwitches(host)}
    </div>
  </section>`;
}

/** The whole body: the rooms, the stage and the inspector. */
export function renderRoomsBody(host: RoomsViewHost): TemplateResult {
  const listed = listedRooms(host);
  const picked = pickedRoom(host, listed);
  return html`<div class="rm-layout" style=${`--wa-stage-hue: ${ROOMS_HUE}`}>
    <div class="rm-col rm-list-col">${renderRoomsCard(host, listed, picked)}</div>
    <div class="rm-col column canvas rm-stage-col">${renderStage(host, picked)}</div>
    <div class="rm-col rm-insp-col">
      ${renderBermudaCard(host)}
      ${picked === undefined ? nothing : renderRoomCard(host, picked)}
      ${renderEveryRoomCard(host)}
    </div>
  </div>`;
}

export const roomsViewStyles = css`
  /* Three columns: the rooms, the stage, the inspector. Under 1100px the
     inspector goes under the other two, under 820px everything is one
     column in reading order. */
  .rm-layout {
    display: grid; grid-template-columns: minmax(240px, 290px) minmax(0, 1fr) minmax(300px, 360px);
    gap: 10px; align-items: start; margin-bottom: 14px;
  }
  @container (max-width: 1100px) {
    .rm-layout { grid-template-columns: minmax(240px, 290px) minmax(0, 1fr); }
    .rm-layout > .rm-insp-col { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 0 10px; align-items: start; }
  }
  @container (max-width: 820px) {
    .rm-layout { grid-template-columns: minmax(0, 1fr); }
    .rm-layout > .rm-insp-col { grid-column: auto; display: flex; align-items: stretch; }
  }
  .rm-col { min-width: 0; display: flex; flex-direction: column; }
  .rm-insp-col > .sec:first-child { margin-top: 0; }
  @container (max-width: 1100px) { .rm-insp-col > .sec { margin-top: 0; } }
  @container (max-width: 820px) { .rm-insp-col > .sec + .sec { margin-top: 10px; } }

  /* Help is one plain line: muted, never italic. */
  .rm-help { margin: 2px 0 8px; font-size: 12px; line-height: 1.45; font-style: normal; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-help.warn { color: var(--wa-amber); }
  .rm-help a { color: var(--wa-ink); }
  .rm-help code, .rm-key, .rm-room-card code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .rm-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .rm-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .rm-card .field :is(input[type=text], input[type=number], select) {
    height: 30px; min-height: 30px; padding: 0 9px; font-size: 13px; border-radius: 7px;
    border-color: var(--wa-line-strong); background-color: var(--wa-field);
  }
  .rm-card .field.check { grid-template-columns: minmax(0, 1fr) auto; min-height: 30px; padding: 0; font-size: 13px; }
  .rm-card .field.check > span { color: var(--wa-ink); font-size: 13px; }
  /* A picked entity wraps its name, id and state rather than cutting them
     short; the box grows a line instead. */
  .rm-card .ent-chosen { height: auto; min-height: 28px; }
  .rm-card button.ent-pick { flex-wrap: wrap; row-gap: 0; padding-top: 3px; padding-bottom: 3px; }
  .rm-card .ent-pick :is(.ent-name, .ent-id, .ent-state) { white-space: normal; overflow: visible; text-overflow: clip; overflow-wrap: anywhere; max-width: none; }
  .rm-card .ent-pick .ent-id { flex: 0 1 auto; }
  /* When's three choices wrap their words rather than cut them short. */
  .rm-card .seg.wide { height: auto; min-height: 28px; }
  .rm-card .seg.wide button { height: auto; min-height: 28px; padding: 4px 6px; white-space: normal; overflow: visible; text-overflow: clip; line-height: 1.2; overflow-wrap: anywhere; }

  /* The left card: the rooms, the add field and the areas. */
  .rm-rooms-card .lc-head .sec-dot { display: block; width: 7px; height: 7px; border-radius: 50%; background: var(--c); }
  .rm-rooms-body { display: flex; flex-direction: column; gap: 10px; padding: 0 10px 12px; }
  ul.rm-rooms { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
  button.rm-room {
    display: flex; align-items: center; gap: 10px; width: 100%; padding: 7px; border-radius: 10px;
    border: 1px solid var(--wa-line); background: transparent; color: var(--wa-ink);
    font: inherit; text-align: left; cursor: pointer;
  }
  button.rm-room:hover { background: var(--wa-hover); }
  button.rm-room.on { background: var(--wa-raise); border-color: var(--wa-line-strong); }
  button.rm-room:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-chip {
    flex: none; width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center;
    background: var(--wa-field); border: 1px solid var(--wa-line); color: var(--wa-muted);
  }
  .rm-room.on .rm-chip { border-color: var(--c); color: var(--c); }
  .rm-chip svg.ui-icon { width: 15px; height: 15px; }
  .rm-room-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .rm-room-top { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 7px; }
  .rm-room-name { font-size: 13px; font-weight: 600; overflow-wrap: anywhere; }
  .rm-room-sub { font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-here {
    display: inline-flex; align-items: center; gap: 4px; height: 18px; padding: 0 7px; border-radius: 999px;
    font-size: 10.5px; font-weight: 500; color: var(--wa-ink); border: 1px solid color-mix(in srgb, var(--wa-hue-green) 60%, transparent);
  }
  .rm-here i { width: 5px; height: 5px; border-radius: 50%; background: var(--wa-hue-green); }
  .rm-none { display: flex; flex-direction: column; gap: 4px; padding: 14px 8px; text-align: center; }
  .rm-none b { font-size: 13px; font-weight: 600; }
  .rm-none span { font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
  .rm-add-room { display: flex; gap: 6px; }
  .rm-add-room input {
    flex: 1 1 auto; min-width: 0; height: 30px; padding: 0 10px; border-radius: 7px;
    border: 1px solid var(--wa-line-strong); background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px;
  }
  .rm-add-room input:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  button.lc-btn.rm-add { height: 30px; }
  .rm-rooms-body > .rm-help { margin: -4px 0 0; }
  .rm-areas { display: flex; flex-wrap: wrap; gap: 5px; }
  .rm-areas-l { width: 100%; font-size: 11.5px; color: var(--wa-muted); }
  button.rm-area {
    min-height: 24px; padding: 2px 9px; border-radius: 999px; font: inherit; font-size: 12px; cursor: pointer;
    color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong); overflow-wrap: anywhere; text-align: left;
  }
  button.rm-area:hover { background: var(--wa-hover); }
  button.rm-area:focus-visible { outline: none; box-shadow: var(--wa-ring); }

  /* The stage: what the watch does when you walk into the picked room. */
  .column.canvas.rm-stage-col { gap: 0; }
  .column.canvas > .card.canvas-card.rm-canvas { min-height: 560px; flex: none; }
  @container (max-width: 820px) { .column.canvas > .card.canvas-card.rm-canvas { min-height: 0; } }
  .rm-stage-head { display: flex; flex-direction: column; gap: 2px; padding: 14px 18px 0; }
  .rm-stage-title { font-size: 18px; font-weight: 500; letter-spacing: -.015em; overflow-wrap: anywhere; }
  .rm-stage-sub { font-size: 12px; color: var(--wa-muted); }
  .canvas-card.lit .stage-area.rm-stage-area { flex: 1 1 auto; justify-content: center; padding: 20px 18px 60px; container: rmstage / inline-size; }
  .rm-flow { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 18px; }
  .rm-flow-side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  .rm-flow-in { align-items: flex-end; text-align: right; }
  .rm-step { display: flex; flex-direction: column; gap: 5px; min-width: 0; align-items: inherit; }
  .rm-step-l { font-size: 10.5px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-muted); }
  .rm-key {
    display: inline-flex; align-items: center; min-height: 28px; padding: 3px 11px; border-radius: 8px; font-size: 12px;
    color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong); overflow-wrap: anywhere;
  }
  .rm-step-v { font-size: 14px; font-weight: 500; overflow-wrap: anywhere; }
  .rm-step-v.none { font-size: 13px; font-weight: 400; color: var(--wa-muted); }
  .rm-step-note { font-size: 11.5px; color: var(--wa-amber); }
  /* The stage's own controls: the page to open and the quick fixes beside
     a step, outlined like every other control. */
  select.rm-stage-select {
    max-width: 100%; height: 30px; padding: 0 8px; border-radius: 7px; font: inherit; font-size: 13.5px; font-weight: 500;
    color: var(--wa-ink); background: var(--wa-field); border: 1px solid var(--wa-line-strong); cursor: pointer;
  }
  select.rm-stage-select:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.rm-stage-btn {
    height: 26px; padding: 0 10px; border-radius: 7px; font: inherit; font-size: 12px; cursor: pointer;
    color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
  }
  button.rm-stage-btn:hover:not(:disabled) { background: var(--wa-hover); }
  button.rm-stage-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.rm-stage-btn:disabled { opacity: .45; cursor: default; }
  /* Bermuda's card, and the tick once its sensor is the one picked. */
  .rm-pitch { margin: 0 0 10px; font-size: 13px; line-height: 1.5; color: var(--wa-ink); overflow-wrap: anywhere; }
  a.rm-bermuda-link {
    display: inline-flex; align-items: center; height: 28px; padding: 0 11px; margin-bottom: 12px; border-radius: 7px;
    font-size: 12.5px; font-weight: 500; text-decoration: none; color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
  }
  a.rm-bermuda-link:hover { background: var(--wa-hover); }
  a.rm-bermuda-link:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-bermuda-ok { display: flex; align-items: center; gap: 6px; margin: 2px 0 8px; font-size: 12px; color: var(--wa-green); }
  .rm-bermuda-ok svg.ui-icon { width: 13px; height: 13px; flex: none; }
  /* The wire from the steps to the watch: a hairline ending in a dot in the
     Rooms hue. */
  .rm-wire { display: flex; align-items: center; width: 70px; height: 7px; }
  .rm-wire::before { content: ""; flex: 1; height: 1px; background: var(--wa-line-strong); }
  .rm-wire i { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--wa-stage-hue); }
  .canvas-card.lit .stage-area > .rm-flow .rm-stage-body { display: flex; justify-content: center; padding-bottom: 32px; }
  /* One screen of the page: a taller page is cut at the screen's foot, as
     the watch opens it, rather than drawn on down past the case. */
  :is(.rm-stage-body, .rm-thumb) .wa-watch > .wp-screen { max-height: var(--rm-screen-h); }
  :is(.rm-stage-body, .rm-thumb) .wp-fold { display: none; }
  /* A plain watch screen: the page's name on the watch's black. */
  .wp-screen.rm-screen { display: grid; place-items: center; padding: 20px; text-align: center; }
  .wp-screen.rm-screen span { font-size: 15px; font-weight: 600; color: var(--wa-face-muted); overflow-wrap: anywhere; }
  /* A narrow stage: the steps over the watch. */
  @container rmstage (max-width: 600px) {
    .rm-flow { grid-template-columns: minmax(0, 1fr); justify-items: center; }
    .rm-flow-out { display: none; }
    .rm-flow-in { align-items: center; text-align: center; }
    .rm-wire { display: none; }
    .canvas-card.lit .stage-area > .rm-flow .rm-stage-body { padding-bottom: 20px; }
  }
  /* No rooms yet: the dashed watch, the line and the three steps. */
  .canvas-card.lit .stage-area.rm-empty { align-items: center; gap: 22px; padding: 30px 24px 70px; text-align: center; }
  .rm-empty-watch {
    width: 200px; height: 242px; border-radius: 56px; display: grid; place-items: center;
    border: 1.5px dashed var(--wa-line-strong); color: var(--wa-stage-hue);
  }
  .rm-empty-watch svg.ui-icon { width: 46px; height: 46px; stroke-width: 1.6; }
  .rm-empty-text { display: flex; flex-direction: column; gap: 6px; max-width: 440px; }
  .rm-empty-text b { font-size: 20px; font-weight: 500; letter-spacing: -.02em; }
  .rm-empty-text span { font-size: 13px; line-height: 1.5; color: var(--wa-muted); }
  ol.rm-steps { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
  ol.rm-steps li {
    display: flex; align-items: center; gap: 8px; min-height: 32px; padding: 4px 12px; border-radius: 9px;
    font-size: 12.5px; color: var(--wa-soft); border: 1px solid var(--wa-line-strong);
  }
  ol.rm-steps b { font-weight: 600; color: var(--wa-stage-hue); }

  /* The inspector's cards: the picked room in the Rooms hue, Every room
     plain. */
  .rm-card .sec-h { height: auto; min-height: 40px; }
  .rm-card .sec-h h4 { white-space: normal; overflow-wrap: anywhere; flex: 0 1 auto; }
  .rm-card .sec-h .tt { min-width: 0; }
  .sec.rm-every { --c: var(--wa-line-strong); background: var(--wa-card); border: 1px solid var(--wa-line); }
  button.rm-danger {
    flex: none; height: 26px; padding: 0 9px; border-radius: 6px; font: inherit; font-size: 12px; cursor: pointer;
    color: var(--wa-hue-red); background: transparent; border: 1px solid color-mix(in srgb, var(--wa-hue-red) 50%, transparent);
  }
  button.rm-danger:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-hue-red) 10%, transparent); }
  button.rm-danger:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.rm-danger:disabled { opacity: .45; cursor: default; }
  .rm-page-pick { display: flex; align-items: flex-end; gap: 10px; }
  .rm-page-pick > .rm-stack { flex: 1; min-width: 0; }
  .rm-thumb { flex: none; display: block; margin-bottom: 4px; }
  .rm-thumb .wa-watch { margin: 0; }
  .rm-sub-h { display: flex; align-items: center; gap: 8px; margin: 12px 0 4px; font-size: 12px; color: var(--wa-muted); }
  .rm-sub-h > span { flex: 1; }
  .rm-sub-h button.lc-btn { height: 26px; font-size: 12px; font-weight: 500; }
  .rm-switch { margin-top: 6px; }
  .rm-switch .rm-help { margin: 0 0 4px; }
  .rm-sub-group { margin: 2px 0 6px; padding-left: 10px; border-left: 1px solid var(--wa-line); }
  .rm-point-switches { margin-top: 6px; padding-top: 2px; border-top: 1px solid var(--wa-line); }
  .rm-point-switches > .rm-sub-h { margin-top: 8px; }
  .rm-reading { display: flex; align-items: flex-start; gap: 8px; margin: 4px 0 2px; font-size: 12.5px; line-height: 1.45; overflow-wrap: anywhere; }
  .rm-dot { flex: none; width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; background: var(--wa-line-strong); }
  .rm-dot.ok { background: var(--wa-green); }
  .rm-dot.warn { background: var(--wa-amber); }
  .rm-target {
    display: grid; grid-template-columns: 64px minmax(0, 1fr) 28px; gap: 10px; align-items: start;
    margin: 8px 0; padding: 10px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-field);
  }
  .rm-target-fields { min-width: 0; }
  .rm-dial { width: 64px; height: 64px; touch-action: none; cursor: grab; display: block; border-radius: 50%; }
  .rm-dial:active { cursor: grabbing; }
  .rm-dial:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-dial-face { fill: var(--wa-card); stroke: var(--wa-line-strong); stroke-width: 1.2; }
  .rm-dial-tick { stroke: var(--wa-muted); stroke-width: 1.2; }
  .rm-dial-n { font-size: 7px; font-weight: 700; fill: var(--wa-muted); text-anchor: middle; }
  .rm-dial-other { fill: var(--wa-muted); opacity: .5; }
  .rm-dial-needle { stroke: var(--wa-ink); stroke-width: 2; stroke-linecap: round; }
  .rm-dial-tip { fill: var(--wa-ink); }
  .rm-dial-hub { fill: var(--wa-ink); }
  .rm-heading-box { display: inline-flex; align-items: center; gap: 6px; }
  .rm-card .rm-heading-box input { width: 72px; }
  .rm-compass { font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .rm-remove {
    width: 28px; height: 28px; padding: 0; display: grid; place-items: center; border-radius: 6px;
    border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-muted); cursor: pointer;
  }
  .rm-remove:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
  .rm-remove:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-remove svg.ui-icon { width: 13px; height: 13px; }
  .rm-add-target { margin: 4px 0 8px; }
`;
