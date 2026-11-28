// The Rooms editor's body, drawn from a host that holds the document and
// takes key writes. The element (`rooms-editor.ts`) owns loading, saving and
// the bar; this file only draws and turns a change into the writes the
// phone makes for it (`model.ts`).
//
// The page reads top to bottom as rules, with the watch beside them:
//
// - Switching: one line that says what Rooms does, the sensor (Change opens
//   its field and what it reads now), Switch pages by room and When. Never
//   the room the sensor names now: it moves as you walk and the page jumped
//   with it, and the watch only acts on it while its app is open. With no sensor picked it is a Start here card instead: the
//   Bermuda pitch and the sensor field.
// - The rules: "When I walk into" a room, "the watch opens" a page. One row
//   per room (`listedRooms`), grouped by Home Assistant's floors when it has
//   them, each with its page's thumbnail and a page picker, then Anywhere
//   else (the fallback page), then a fold with the areas not listed yet and
//   the add-by-name field.
// - Point control, folded: the picked room's things to point at, and the
//   Tap to Toggle and Live tile switches.
// - Beside them a sticky lit stage: the watch drawing the picked room's page
//   (`renderWatchPagePreview`, from the watch's pages record). Under 1000px
//   it goes under the rules, in the one column.
//
// On a home that is not the watch's main house (`home`), the gestures and the
// point control switches and aim are the main house's: one line says so in place of
// them, and the switch is Switch automatically, which is this home's own.

import { css, html, nothing, svg, type TemplateResult } from "lit";
import { litOutline } from "../editor-chrome.js";
import { checkField, entityField, textField } from "../editors.js";
import type { HassLike } from "../ha-api.js";
import type { EntityRef } from "../model.js";
import type { IconProvider } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import { renderWatchFrame } from "../watch-frame.js";
import { type PhonePagesLayout, phonePagesScreen, renderPhoneFrame } from "../phone-frame.js";
import { type RoomsEditorMode, switchRoomsMode } from "./hook.js";
import { type WatchPage, type WatchPagesDocument, watchPageId, watchPageName, watchPagesOf } from "../watch-pages/model.js";
import { renderWatchPagePreview, watchScreenBackground } from "../watch-pages/preview.js";
import {
  type BehaviorDocument,
  type FloorEntry,
  type RoomListEntry,
  type RoomPageChoice,
  type RoomsView,
  FALLBACK_LABELS,
  HOME_AUTO_SWITCH_LABEL,
  HOME_ROOMS_MAIN_HOUSE_TEXT,
  HOME_ROOMS_MAIN_HOUSE_WEAR_TEXT,
  HOME_ROOMS_PHONE_JUMP_TEXT,
  HOME_ROOMS_PHONE_TEXT,
  ZONES_UNREADABLE_TEXT,
  aimWrites,
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
  /** Home Assistant's floors, in its order, to group the rooms by. None, and
   * the rooms stand in one list. */
  floors?: readonly FloorEntry[];
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
  /** The device is an iPhone: always `home`, with no main house of its own. */
  phone?: boolean;
  /** The phone is an Android phone, for its noun ("phone"). */
  android?: boolean;
  /** The watch is a Wear OS watch, which has no double pinch. */
  wear?: boolean;
  /** Rooms added here by name, which stay listed until the page is left. */
  added?: readonly string[];
  /** Take a room added by name off the list again. */
  forgetRoom?(key: string): void;
  /** The watch's pages, as Home Assistant holds them, for the picture of the
   * page a room opens. Without them the watch shows the page's name. */
  pagesDocument?: WatchPagesDocument;
  /** The watch's screen in points. Absent, the 46 mm watch's. */
  screen?: { width: number; height: number };
  /** The app version the device reported, which decides whether its page
   * pictures draw One Look (`previewOneLook`). */
  appVersion?: string | null;
  icons?: IconProvider;
  /** The page is one column: the watch drawn a little smaller. */
  narrow?: boolean;
  /** On a phone, where its pages screen sits: the pictures are drawn in the
   * phone, not a watch, and a page is laid out on its pages area. */
  phoneLayout?: PhonePagesLayout;
  /** Rooms (the default) or Point control: the same record on two tabs. */
  mode?: RoomsEditorMode;
  /** Go to the other tab. Absent, the address is swapped in place. */
  openMode?(mode: RoomsEditorMode): void;
  /** A phone's double-tap on the page title jumps to a room (its
   * `behavior` record's `topSectionDoubleTapAction`). Undefined until read. */
  titleJump?: boolean;
  /** Open this phone's Settings at the double-tap. */
  openSettings?(): void;
}

/** A phone: an iPhone or an Android phone, which both have the double-tap
 * row in their own settings. */
function isPhone(host: Pick<RoomsViewHost, "phone">): boolean {
  return host.phone === true;
}

/** The screen a page is laid out on: the phone's pages area, else the
 * watch's screen. */
function screenOf(host: Pick<RoomsViewHost, "phoneLayout" | "screen">): { width: number; height: number } {
  return host.phoneLayout === undefined ? (host.screen ?? DEFAULT_SCREEN) : phonePagesScreen(host.phoneLayout);
}

/** The Rooms hue, Home's Rooms door: the card outlines, the icon chips, the
 * picked row's edge and the stage's edge. */
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
  return on ? html`<span class="sec-dot rm-dirty" title="Changed, not saved yet" aria-label="Changed"></span>` : nothing;
}

/** Whether a fold is open: kept per editor session in `uiState`. */
function isOpen(host: Pick<RoomsViewHost, "uiState">, key: string, fallback = false): boolean {
  const value = host.uiState.get(key);
  return typeof value === "boolean" ? value : fallback;
}

function flip(host: RoomsViewHost, key: string, now: boolean): void {
  host.uiState.set(key, !now);
  host.requestUpdate();
}

// ── Room sensor ──────────────────────────────────────────────────────────

/** The word for the device this page is about. */
function deviceWord(host: Pick<RoomsViewHost, "phone" | "android">): string {
  if (host.phone === true) return host.android === true ? "phone" : "iPhone";
  return "watch";
}

/** What the sensor says now, and whether the device reads it as a room. */
export function sensorReading(hass: HassLike, sensor: string, device = "watch"): { line: string; tone: "ok" | "warn" | "none" } {
  if (sensor === "") return { line: noSensorText(device), tone: "none" };
  const state = hass.states[sensor];
  if (state === undefined) return { line: "Home Assistant has no entity with this id now.", tone: "warn" };
  const room = roomFromState(sensor, state);
  const raw = typeof state.state === "string" ? state.state : "";
  if (room === undefined) return { line: `Now "${raw}", which the ${device} does not read as a room.`, tone: "warn" };
  const key = normalizedRoomKey(room);
  return { line: `Now in ${room}${key === "" ? `, whose name has no letter or digit the ${device} can match` : ""}.`, tone: key === "" ? "warn" : "ok" };
}

/** Bermuda, the integration that makes an area sensor from Bluetooth, is
 * not something a new user knows by name: the word links to it. */
export const BERMUDA_URL = "https://github.com/agittins/bermuda";

/** With no sensor picked the watch looks for one itself, by name
 * (`detectCurrentRoomName` in the watch app scores "bermuda", "area",
 * "room" and the like), which can find the wrong one or none. */
export function noSensorText(device = "watch"): string {
  return `No room sensor picked. The ${device} looks for one by its name, such as a Bermuda area sensor. Pick one to be sure.`;
}

export const NO_SENSOR_TEXT = noSensorText();

/** Why Bermuda, in the card that stands at the top until a sensor is picked. */
export function bermudaPitch(device = "watch"): string {
  return `Bermuda uses Bluetooth to tell which room your ${device} is in. Rooms works best with its area sensor. Add Bermuda to Home Assistant, then pick its sensor here.`;
}

export const BERMUDA_PITCH = bermudaPitch();

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

function withBermudaLink(line: string): TemplateResult | string {
  const at = line.indexOf("Bermuda");
  if (at < 0) return line;
  return html`${line.slice(0, at)}<a href=${BERMUDA_URL} target="_blank" rel="noopener noreferrer">Bermuda</a>${line.slice(at + "Bermuda".length)}`;
}

// ── pages ────────────────────────────────────────────────────────────────

function pageOptions(host: Pick<RoomsViewHost, "phone">, pages: readonly RoomPageChoice[], stored: string, lead: [string, string][]): [string, string][] {
  const options: [string, string][] = [...lead, ...pages.map((p): [string, string] => [p.id, p.name])];
  if (stored !== "" && !lead.some(([v]) => v === stored) && findPageChoice(pages, stored) === undefined) {
    options.push([stored, `A page not on this ${deviceWord(host)}`]);
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
  return findPageChoice(host.pages, stored)?.name ?? `A page not on this ${deviceWord(host)}`;
}

/** The watch's page a stored id names, without regard to case. */
function watchPageFor(host: RoomsViewHost, stored: string): WatchPage | undefined {
  const want = stored.trim().toLowerCase();
  if (want === "") return undefined;
  return watchPagesOf(host.pagesDocument).find((p) => watchPageId(p).toLowerCase() === want);
}

/** A native select whose picked option is bound as a property: an attribute
 * binding left the wrong option shown once the pages loaded. */
function pageSelect(label: string, value: string, options: [string, string][], set: (v: string) => void, busy: boolean, cls = ""): TemplateResult {
  return html`<select class="rm-select ${cls}" aria-label=${label} ?disabled=${busy}
    @click=${(e: Event) => e.stopPropagation()}
    @change=${(e: Event) => { if (!busy) set((e.target as HTMLSelectElement).value); }}>
    ${options.map(([v, text]) => html`<option value=${v} .selected=${v === value}>${text}</option>`)}
  </select>`;
}

// ── the list ─────────────────────────────────────────────────────────────

/** The rooms in the rules, in the merged list's order. */
export function listedRooms(host: Pick<RoomsViewHost, "rooms" | "view" | "added">): RoomListEntry[] {
  return host.rooms.filter((r) => roomIsListed(host.view, r, host.added ?? []));
}

/** The Home Assistant areas not in the rules yet, offered in the fold. */
export function offeredAreas(host: Pick<RoomsViewHost, "rooms" | "view" | "added">): RoomListEntry[] {
  return host.rooms.filter((r) => r.area && !roomIsListed(host.view, r, host.added ?? []));
}

/** The room the stage and point control show: the one picked, else the
 * first in the list. Never the room the sensor names now: that moves as you
 * walk, and the page would move with it. */
export function pickedRoom(host: Pick<RoomsViewHost, "uiState">, listed: readonly RoomListEntry[]): RoomListEntry | undefined {
  const key = host.uiState.get("pick");
  return listed.find((r) => r.key === key) ?? listed[0];
}

/** The rooms grouped by Home Assistant's floors, in the floors' order. A
 * room on no floor (or not an area) goes in a last group, headed Other when
 * there are floors above it and with no heading when there are none. */
export function roomGroups(rooms: readonly RoomListEntry[], floors: readonly FloorEntry[] = []): { name: string; rooms: RoomListEntry[] }[] {
  const known = new Set(floors.map((f) => f.id));
  const groups = floors
    .map((f) => ({ name: f.name, rooms: rooms.filter((r) => r.floorId === f.id) }))
    .filter((g) => g.rooms.length > 0);
  const rest = rooms.filter((r) => r.floorId === undefined || !known.has(r.floorId));
  if (rest.length > 0) groups.push({ name: groups.length > 0 ? "Other" : "", rooms: rest });
  return groups;
}

function pick(host: RoomsViewHost, key: string): void {
  host.uiState.set("pick", key);
  host.requestUpdate();
}

/** How many things to point at in a room, in words, "" for none: Point
 * control's room picker names it beside the room. */
export function roomPointLine(host: Pick<RoomsViewHost, "view">, room: RoomListEntry): string {
  const n = host.view.zones.ok ? roomZones(host.view.zones.rooms, room.key).length : 0;
  if (n === 0) return "";
  return n === 1 ? "1 thing to point at" : `${n} things to point at`;
}

function addRoomNamed(host: RoomsViewHost, name: string): void {
  const key = normalizedRoomKey(name);
  if (key === "") return;
  host.addRoom(name.trim());
  pick(host, key);
}

// ── the switching card ────────────────────────────────────────────────────────────

/** The switch that turns room switching on: Switch pages by room on the main
 * house, Switch automatically on any other home. */
function switchingOn(host: RoomsViewHost): boolean {
  return host.home === true ? homeAutoSwitch(host.document) : host.view.switching;
}

function renderSensorField(host: RoomsViewHost): TemplateResult {
  const { view } = host;
  return html`<div class="rm-stack rm-sensor-field" title=${view.sensor === "" ? "" : "Clearing the sensor turns Switch pages by room off."}>${entityField({ hass: host.hass }, "Room sensor", refOf(host.hass, view.sensor), (ref) => {
    if (host.busy) return;
    host.write(sensorWrites(host.document, ref.entityId));
  }, "rooms:sensor", { clearable: true })}</div>`;
}

/** Switch pages by room (or Switch automatically on another home), then
 * When under a hairline while it is on. */
function renderSwitching(host: RoomsViewHost): TemplateResult {
  const home = host.home === true;
  const on = switchingOn(host);
  const label = home ? HOME_AUTO_SWITCH_LABEL : "Switch pages by room";
  const set = (v: boolean) => {
    if (host.busy) return;
    host.write(home ? homeAutoSwitchWrites(host.document, v) : switchingWritesFor(host.document, v));
  };
  const triggers = ROOM_RULES.switching.triggers;
  const help = triggers.find((t) => t.value === host.view.trigger)?.help ?? "";
  return html`<div class="rm-status-switch">${checkField(label, on, set)}</div>
    ${home ? (isPhone(host)
      ? html`<p class="rm-help rm-status-wide rm-main-house rm-phone-jump">
          <span>${host.titleJump === true ? HOME_ROOMS_PHONE_JUMP_TEXT : HOME_ROOMS_PHONE_TEXT}</span>
          ${host.openSettings === undefined ? nothing : html`<button type="button" class="rm-btn rm-small" @click=${() => host.openSettings?.()}>Open Settings</button>`}
        </p>`
      : html`<p class="rm-help rm-status-wide rm-main-house">${host.wear === true ? HOME_ROOMS_MAIN_HOUSE_WEAR_TEXT : HOME_ROOMS_MAIN_HOUSE_TEXT}</p>`)
      : on ? html`<div class="rm-when rm-status-wide">
        <span class="rm-when-l" id="rm-when-l">Switch</span>
        <div class="seg rm-seg" role="radiogroup" aria-labelledby="rm-when-l">
          ${triggers.map((t) => {
            const picked = t.value === host.view.trigger;
            return html`<button type="button" role="radio" aria-checked=${picked ? "true" : "false"} class=${picked ? "on" : ""} ?disabled=${host.busy}
              @click=${() => { if (!host.busy && !picked) host.write(triggerWrites(host.document, t.value as RoomTrigger)); }}>${t.label}</button>`;
          })}
        </div>
        <span class="rm-when-help">${help}</span>
      </div>` : nothing}`;
}

/** The top line: what the device does now. A switch that is off never
 * reads as on, and a switch by Room Jump never reads as automatic. */
export function switchingLine(host: RoomsViewHost): string {
  const device = deviceWord(host);
  if (!switchingOn(host)) {
    if (isPhone(host) && host.titleJump === true) return `${HOME_AUTO_SWITCH_LABEL} is off, so the ${device} changes pages only when you double-tap the page title.`;
    return host.home === true
      ? `${HOME_AUTO_SWITCH_LABEL} is off, so the ${device} does not change pages when you walk in.`
      : "Room pages are off. Turn on Switch pages by room to use the pages below.";
  }
  if (host.home === true || host.view.trigger === "Automatic") return `The ${device} opens a room's page when the room sensor says you walked in.`;
  return `The ${device} opens the page of the room you are in when you ask it to.`;
}

/** The line over the room list while switching is off. A watch on another
 * home still opens them with its main home's Room Jump; on a phone or a
 * watch's main home nothing reads them. */
export function rulesOffLine(host: RoomsViewHost): string {
  if (isPhone(host) && host.titleJump === true) return `${HOME_AUTO_SWITCH_LABEL} is off. These pages open when you double-tap the page title.`;
  if (!listUnused(host)) return `${HOME_AUTO_SWITCH_LABEL} is off. These pages still open with Room Jump.`;
  return `Nothing opens these pages until you turn on ${switchLabel(host)} at the top.`;
}

/** The switch that turns room pages on, by its label. */
function switchLabel(host: RoomsViewHost): string {
  return host.home === true ? HOME_AUTO_SWITCH_LABEL : "Switch pages by room";
}

/** Whether nothing reads the room list now: switching is off on a watch's
 * main home or on a phone. A watch on another home may still Room Jump. */
export function listUnused(host: RoomsViewHost): boolean {
  if (switchingOn(host)) return false;
  if (host.phone === true) return !(isPhone(host) && host.titleJump === true);
  return host.home !== true;
}

/** The folded list's line: how many rooms have a page, and what turns them
 * on. */
export function foldedListLine(host: RoomsViewHost, listed: readonly RoomListEntry[]): string {
  const n = listed.filter((r) => roomPage(host.view, r.key) !== "").length;
  const turn = `Turn on ${switchLabel(host)} above to use`;
  if (n === 0) return `No room has a page yet. ${turn} them.`;
  return n === 1 ? `1 room has a page. ${turn} it.` : `${n} rooms have pages. ${turn} them.`;
}

const STATUS_KEYS = [ROOM_KEYS.sensor, ROOM_KEYS.autoSwitch, ROOM_KEYS.legacyQuickJump, ROOM_KEYS.topSectionDoubleTap, ROOM_KEYS.handGesture];

/** The card at the top: where you are and what the watch shows, or, with no
 * sensor picked, Start here. */
function renderStatusCard(host: RoomsViewHost): TemplateResult {
  const { view } = host;
  const dirty = dirtyDot(anyDirty(host, STATUS_KEYS));
  if (view.sensor === "") {
    return html`<section class="rm-card rm-lit rm-start" aria-label="Start here">
      <span class="rm-eyebrow">Start here${dirty}</span>
      <h3 class="rm-start-title">Tell the ${deviceWord(host)} which room you are in</h3>
      <p class="rm-pitch">${bermudaPitch(deviceWord(host))}</p>
      <div class="rm-start-row">
        ${renderSensorField(host)}
        <a class="rm-btn rm-bermuda-link" href=${BERMUDA_URL} target="_blank" rel="noopener noreferrer">Get Bermuda</a>
      </div>
      <p class="rm-help">${withBermudaLink(noSensorText(deviceWord(host)))}</p>
      <div class="rm-start-switch">${renderSwitching(host)}</div>
    </section>`;
  }
  const changing = isOpen(host, "sensorOpen");
  const bermuda = isBermudaSensor(host.hass, view.sensor);
  const reading = sensorReading(host.hass, view.sensor, deviceWord(host));
  return html`<section class="rm-card rm-lit rm-status" aria-label="Switch pages by room">
    <span class="rm-ichip" aria-hidden="true">${uiIcon("home")}</span>
    <div class="rm-status-text">
      <p class="rm-now ${switchingOn(host) ? "" : "off"}">${switchingLine(host)}${dirty}</p>
      <div class="rm-sensor-line">
        ${bermuda
          ? html`<span class="rm-bermuda-ok">${uiIcon("check")}<span>${nameOf(host.hass, view.sensor)}, a Bermuda sensor</span></span>`
          : html`<span class="rm-sensor-name">${nameOf(host.hass, view.sensor)}.</span>
            <span class="rm-sensor-hint"><a href=${BERMUDA_URL} target="_blank" rel="noopener noreferrer">Bermuda</a> works best.</span>`}
        <button type="button" class="rm-btn rm-small" aria-expanded=${changing ? "true" : "false"}
          @click=${() => flip(host, "sensorOpen", changing)}>${changing ? "Done" : "Change"}</button>
      </div>
    </div>
    ${!changing && reading.tone === "warn" ? html`<div class="rm-reading rm-status-wide"><i class="rm-dot warn" aria-hidden="true"></i><span>${reading.line}</span></div>` : nothing}
    ${changing ? html`<div class="rm-sensor-edit rm-status-wide">
      ${renderSensorField(host)}
      <div class="rm-reading"><i class="rm-dot ${reading.tone}" aria-hidden="true"></i><span>${reading.line}</span></div>
    </div>` : nothing}
    ${renderSwitching(host)}
  </section>`;
}

// ── the rules ────────────────────────────────────────────────────────────

/** The thumbnail beside a page picker: one screen of the page, small. An
 * empty box when there is no page to draw, so the pickers line up. */
const THUMB_SCALE = 0.16;

/** The screen's height in pixels at a scale: the picture of a page shows one
 * screen of it, what the watch opens on, and no more. */
function screenHeightPx(host: RoomsViewHost, scale: number): number {
  return Math.round(screenOf(host).height * scale * 100) / 100;
}

/** A phone's pictures: the whole phone is far taller than a watch, so
 * smaller. */
const PHONE_THUMB_SCALE = 0.06;
const PHONE_STAGE_SCALE = 0.58;
const PHONE_STAGE_SCALE_NARROW = 0.5;

function thumbScale(host: RoomsViewHost): number {
  return host.phoneLayout === undefined ? THUMB_SCALE : PHONE_THUMB_SCALE;
}

function stageScale(host: RoomsViewHost): number {
  if (host.phoneLayout !== undefined) return host.narrow === true ? PHONE_STAGE_SCALE_NARROW : PHONE_STAGE_SCALE;
  return host.narrow === true ? 1 : STAGE_SCALE;
}

/** What a picture of a page is drawn in: the phone, else nothing extra. */
function phoneInput(host: RoomsViewHost): { phone?: PhonePagesLayout } {
  return host.phoneLayout === undefined ? {} : { phone: host.phoneLayout };
}

function renderPageThumb(host: RoomsViewHost, stored: string): TemplateResult {
  const page = watchPageFor(host, stored);
  const screen = screenOf(host);
  const scale = thumbScale(host);
  const phone = host.phoneLayout;
  // A phone's empty box is the phone's whole shape, so the pickers line up.
  const box = phone === undefined ? { width: screen.width, height: screen.height } : phone.model.screen;
  const size = `--rm-screen-h: ${screenHeightPx(host, scale)}px; --rm-thumb-w: ${Math.round(box.width * scale)}px; --rm-thumb-h: ${Math.round(box.height * scale)}px`;
  if (page === undefined) return html`<span class="rm-thumb empty ${phone === undefined ? "" : "phone"}" aria-hidden="true" style=${size}></span>`;
  return html`<span class="rm-thumb ${phone === undefined ? "" : "phone"}" aria-hidden="true" title=${watchPageName(page)} style=${size}>${renderWatchPagePreview({
    page, pages: [page], screen, states: host.hass.states, ...(host.icons ? { icons: host.icons } : {}), scale, ...phoneInput(host),
    ...(host.appVersion === undefined ? {} : { appVersion: host.appVersion }),
  })}</span>`;
}

function renderRuleRow(host: RoomsViewHost, room: RoomListEntry, on: boolean): TemplateResult {
  const stored = roomPage(host.view, room.key);
  const value = pageValue(host.pages, stored);
  const removal = removeRoomWrites(host.document, room.key);
  const removable = removal.size > 0 || (host.added ?? []).some((n) => normalizedRoomKey(n) === room.key);
  const remove = (e: Event) => {
    e.stopPropagation();
    if (host.busy) return;
    host.forgetRoom?.(room.key);
    if (removal.size > 0) host.write(removal);
    host.requestUpdate();
  };
  return html`<li class="rm-row ${on ? "on" : ""}" @click=${() => pick(host, room.key)}>
    <span class="rm-row-room">
      <button type="button" class="rm-row-name" aria-pressed=${on ? "true" : "false"} title=${`Show this room on the ${deviceWord(host)}`}
        @click=${(e: Event) => { e.stopPropagation(); pick(host, room.key); }}>${room.name}</button>
    </span>
    <span class="rm-arrow" aria-hidden="true">${uiIcon("arrow")}</span>
    <span class="rm-row-page">
      ${renderPageThumb(host, stored)}
      ${pageSelect(`Page for ${room.name}`, value, pageOptions(host, host.pages, value, [["", "No page"]]), (v) => {
        host.write(roomPageWrites(host.document, room.key, v));
        pick(host, room.key);
      }, host.busy)}
    </span>
    <span class="rm-row-end">${removable ? html`<button type="button" class="rm-row-x" aria-label=${`Remove ${room.name}`} ?disabled=${host.busy}
      title="Take this room off: its page and its things to point at go. Undo brings them back." @click=${remove}>${uiIcon("close")}</button>` : nothing}</span>
  </li>`;
}

function renderAddRoom(host: RoomsViewHost, listed: readonly RoomListEntry[]): TemplateResult {
  const text = String(host.uiState.get("addRoom") ?? "");
  const key = normalizedRoomKey(text);
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
    <button type="button" class="rm-btn" ?disabled=${key === "" || exists} @click=${add}>${uiIcon("plus")}<span>Add</span></button>
  </div>
  ${text.trim() !== "" && key === "" ? html`<p class="rm-help warn">The ${deviceWord(host)} matches room names by their letters a to z and digits, and this name has none.</p>` : nothing}
  ${exists ? html`<p class="rm-help">That room is in the list.</p>` : html`<p class="rm-help">For a name the sensor says that is not an area in Home Assistant.</p>`}`;
}

function renderFallbackRow(host: RoomsViewHost): TemplateResult {
  const fallback = fallbackChoice(host.view.fallback);
  const value = fallback === "first" ? "" : fallback === "stay" ? STAY_ON_CURRENT_PAGE : pageValue(host.pages, host.view.fallback);
  return html`<div class="rm-row rm-else">
    <span class="rm-row-room">
      <b class="rm-else-name">Anywhere else</b>
      <span class="rm-row-sub">A room with no page, or when the room cannot be told</span>
    </span>
    <span class="rm-arrow" aria-hidden="true">${uiIcon("arrow")}</span>
    <span class="rm-row-page">
      ${renderPageThumb(host, fallback === "page" ? host.view.fallback : "")}
      ${pageSelect("Page anywhere else", value, pageOptions(host, host.pages, value, [[STAY_ON_CURRENT_PAGE, FALLBACK_LABELS.stay], ["", FALLBACK_LABELS.first]]),
        (v) => host.write(fallbackWrites(v)), host.busy)}
    </span>
    <span class="rm-row-end"></span>
  </div>`;
}

function renderRulesCard(host: RoomsViewHost, listed: readonly RoomListEntry[], picked: RoomListEntry | undefined): TemplateResult {
  const areas = offeredAreas(host);
  const groups = roomGroups(listed, host.floors);
  const moreOpen = isOpen(host, "moreOpen", listed.length === 0);
  const moreLabel = areas.length === 0 ? "Add a room" : `${areas.length} more ${areas.length === 1 ? "area" : "areas"} in Home Assistant`;
  const off = !switchingOn(host);
  const folded = listUnused(host) && listed.length > 0 && !isOpen(host, "listOpen");
  return html`<section class="rm-card rm-rules ${off ? "off" : ""}" aria-label="Room pages">
    <div class="rm-rules-head">
      <span class="rm-cap">When I walk into${dirtyDot(anyDirty(host, [ROOM_KEYS.mappings, ROOM_KEYS.fallback]))}</span>
      <span class="rm-cap rm-cap-page">the ${deviceWord(host)} opens</span>
    </div>
    ${folded ? html`<button type="button" class="rm-fold rm-folded" aria-expanded="false" @click=${() => flip(host, "listOpen", false)}>
        <span class="rm-chev" aria-hidden="true">${uiIcon("right")}</span><span>${foldedListLine(host, listed)}</span>
      </button>` : html`${off ? html`<p class="rm-off-note"><i class="rm-dot" aria-hidden="true"></i><span>${rulesOffLine(host)}</span></p>` : nothing}
    ${listed.length === 0
      ? html`<div class="rm-none">
          <b>${host.roomsState === "loading" ? "Reading your rooms" : "No rooms yet"}</b>
          <span>${host.roomsState === "loading" ? "The areas and what the room sensor reported." : areas.length > 0 ? "Pick an area below, or type a name." : "Type a room's name below."}</span>
        </div>`
      : groups.map((g) => html`<div class="rm-group" role="group" aria-label=${g.name === "" ? "Rooms" : g.name}>
          ${g.name === "" ? nothing : html`<span class="rm-floor">${g.name}</span>`}
          <ul class="rm-rows">${g.rooms.map((r) => renderRuleRow(host, r, r.key === picked?.key))}</ul>
        </div>`)}
    ${renderFallbackRow(host)}`}
    <button type="button" class="rm-fold" aria-expanded=${moreOpen ? "true" : "false"} @click=${() => flip(host, "moreOpen", moreOpen)}>
      <span class="rm-chev" aria-hidden="true">${uiIcon("right")}</span>${moreLabel}
    </button>
    ${moreOpen ? html`<div class="rm-more">
      ${areas.length > 0 ? html`<div class="rm-areas">
        ${areas.map((a) => html`<button type="button" class="rm-area" title=${`Add ${a.name} to your rooms`} @click=${() => addRoomNamed(host, a.name)}>+ ${a.name}</button>`)}
        <span class="rm-help rm-areas-help">Click one to give it a page.</span>
      </div>` : nothing}
      ${renderAddRoom(host, listed)}
    </div>` : nothing}
  </section>`;
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

// ── a room's things to point at ──────────────────────────────────────────────────────────────────────────────────────

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
export const HEADING_HELP_DETAIL = "The easy way to measure a heading is with an iPhone: in HouseLit, open the watch's Rooms page, pick the room and the device, stand where you point from, hold the iPhone flat with its top edge toward the device and choose Set Direction. On the watch, stand in the same place, open Heading from the point control of a room with no targets, face the target and type the number it shows. The number is the device's direction.";

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
    ${zones.length === 0 && !adding ? html`<p class="rm-help">None yet. Add a lamp or a switch you point the ${deviceWord(host)} at in this room.</p>` : nothing}
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

// ── Point control ────────────────────────────────────────────────────────

/** One switch with its line under it. */
function switchRow(label: string, on: boolean, line: string, set: (v: boolean) => void): TemplateResult {
  return html`<div class="rm-switch">${checkField(label, on, set)}<p class="rm-help">${line}</p></div>`;
}

/** The label over the aim choice. */
export const AIM_LABEL = "How you aim";

/** Raise Wrist or Point Finger, with the picked one's detail under it. */
function renderAim(host: RoomsViewHost): TemplateResult {
  const { options } = ROOM_RULES.pointControl.aim;
  const detail = options.find((o) => o.value === host.view.aim)?.detail ?? "";
  return html`<div class="rm-when rm-aim">
    <span class="rm-when-l" id="rm-aim-l">${AIM_LABEL}</span>
    <div class="seg rm-seg" role="radiogroup" aria-labelledby="rm-aim-l">
      ${options.map((o) => {
        const picked = o.value === host.view.aim;
        return html`<button type="button" role="radio" aria-checked=${picked ? "true" : "false"} class=${picked ? "on" : ""} ?disabled=${host.busy}
          @click=${() => { if (!host.busy && !picked) host.write(aimWrites(o.value)); }}>${o.label}</button>`;
      })}
    </div>
    <span class="rm-when-help">${detail}</span>
  </div>`;
}

function renderPointSwitches(host: RoomsViewHost): TemplateResult {
  const { view } = host;
  const values: Record<string, boolean> = { [ROOM_KEYS.tapToToggle]: view.tapToToggle, [ROOM_KEYS.liveTile]: view.liveTile };
  return html`<div class="rm-point-switches" title="One value for every point control tile on this watch.">
    <div class="rm-sub-h"><span>Every room</span></div>
    ${renderAim(host)}
    ${ROOM_RULES.pointControl.switches.map((s) => {
      const on = values[s.key] ?? s.absent;
      return switchRow(s.label, on, on ? s.onDetail : s.offDetail, (v) => { if (!host.busy) host.write(pointSwitchWrites(s.key, v)); });
    })}
  </div>`;
}

/** Point control's line while folded: how many things in how many rooms. */
export function pointSummary(view: Pick<RoomsView, "zones">): string {
  if (!view.zones.ok) return "The stored targets cannot be read.";
  const counts = view.zones.rooms.map(([, zones]) => zones.length).filter((n) => n > 0);
  const things = counts.reduce((a, b) => a + b, 0);
  if (things === 0) return "Off in every room.";
  return `${things} ${things === 1 ? "thing" : "things"} in ${counts.length} ${counts.length === 1 ? "room" : "rooms"}.`;
}

function openMode(host: RoomsViewHost, mode: RoomsEditorMode): void {
  if (host.openMode !== undefined) host.openMode(mode);
  else switchRoomsMode(mode);
}

/** The line under Point control's title: where the room comes from. */
export function pointSensorLine(host: RoomsViewHost): string {
  const device = deviceWord(host);
  if (host.view.sensor === "") return `Pick a room sensor in Rooms first, so the ${device} knows which room you are in.`;
  return `The ${device} knows the room from the room sensor in Rooms: ${nameOf(host.hass, host.view.sensor)}.`;
}

/** Point control's own tab: the room's things to point at and, on a
 * watch's main home, how every room aims. The room sensor and the rooms are
 * Rooms', named here with a way there. */
function renderPointPage(host: RoomsViewHost, listed: readonly RoomListEntry[], picked: RoomListEntry | undefined): TemplateResult {
  const home = host.home === true;
  const keys = home ? [ROOM_KEYS.zones] : [ROOM_KEYS.zones, ROOM_KEYS.aim, ROOM_KEYS.tapToToggle, ROOM_KEYS.liveTile];
  const roomLabel = (r: RoomListEntry): string => {
    const line = roomPointLine(host, r);
    return line === "" ? r.name : `${r.name}, ${line}`;
  };
  return html`<section class="rm-card rm-lit rm-point rm-point-page" aria-label="Point control">
    <div class="rm-point-intro">
      <span class="rm-ichip" aria-hidden="true">${uiIcon("tap")}</span>
      <div class="rm-status-text">
        <p class="rm-now">Point the ${deviceWord(host)} at a lamp or a switch to control it.${dirtyDot(anyDirty(host, keys))}</p>
        <div class="rm-sensor-line">
          <span class=${host.view.sensor === "" ? "rm-warn" : ""}>${pointSensorLine(host)}</span>
          <button type="button" class="rm-btn rm-small" @click=${() => openMode(host, "rooms")}>Open Rooms</button>
        </div>
        <span class="rm-point-sub">${pointSummary(host.view)}</span>
      </div>
    </div>
    <div class="rm-point-body">
      ${picked === undefined
        ? html`<p class="rm-help">Add a room in Rooms first, then the things you point at in it.</p>`
        : html`<label class="rm-point-room">
            <span>Room</span>
            ${pageSelect("Room for point control", picked.key, listed.map((r): [string, string] => [r.key, roomLabel(r)]), (v) => pick(host, v), false)}
          </label>
          ${renderTargets(host, picked)}`}
      ${home ? nothing : renderPointSwitches(host)}
    </div>
  </section>`;
}

// ── the stage ────────────────────────────────────────────────────────────

/** The watch's size on the stage, in pixels per point. */
const STAGE_SCALE = 1.15;

/** The watch showing a page: the page itself when the watch's pages are at
 * hand, else a plain screen with its name, or `blank` when there is none. */
function renderRoomWatch(host: RoomsViewHost, stored: string, blank: string): TemplateResult {
  const screen = screenOf(host);
  const scale = stageScale(host);
  const page = watchPageFor(host, stored);
  if (page !== undefined) {
    return renderWatchPagePreview({
      page,
      pages: watchPagesOf(host.pagesDocument),
      screen,
      states: host.hass.states,
      ...(host.icons ? { icons: host.icons } : {}),
      scale,
      ...phoneInput(host),
      ...(host.home === true ? {} : { behavior: host.document }),
      ...(host.appVersion === undefined ? {} : { appVersion: host.appVersion }),
    });
  }
  const name = pageNameOf(host, stored);
  const plain = html`<div class="wp-screen rm-screen ${name === "" ? "blank" : ""}"
    style=${`width:${screen.width * scale}px;height:${screen.height * scale}px;background:${watchScreenBackground({}, scale, screen)}`}>
    <span>${name === "" ? blank : name}</span>
  </div>`;
  if (host.phoneLayout !== undefined) {
    const noun = host.android === true ? "Phone" : "iPhone";
    return renderPhoneFrame(host.phoneLayout, scale, plain, { label: name === "" ? noun : `${noun} showing ${name}`, ...(host.icons ? { icons: host.icons } : {}) });
  }
  return renderWatchFrame(screen, scale, plain, name === "" ? "Watch" : `Watch showing ${name}`);
}

/** The sticky stage beside the rules: the picked room's page on the watch. */
function renderStage(host: RoomsViewHost, room: RoomListEntry | undefined): TemplateResult {
  const scale = stageScale(host);
  if (room === undefined) {
    return html`<div class="card canvas-card lit rm-canvas" aria-label="Preview">
      <div class="rm-stage-head"><span class="rm-eyebrow">Preview</span><b class="rm-stage-title">No rooms yet</b></div>
      <div class="stage-area rm-stage-area rm-empty">
        <div class="rm-empty-watch" aria-hidden="true">${uiIcon("home")}</div>
        <span class="rm-empty-text">Add a room and give it a page. When you walk in, the ${deviceWord(host)} opens that page.</span>
      </div>
    </div>`;
  }
  const stored = roomPage(host.view, room.key);
  // A room with no page opens Anywhere else: that page when it is one.
  const fallback = host.view.fallback;
  const shown = stored !== "" ? stored : fallbackChoice(fallback) === "page" ? fallback : "";
  const note = stored !== "" ? "" : shown !== "" ? `No page for this room, so the ${deviceWord(host)} opens Anywhere else.` : "";
  return html`<div class="card canvas-card lit rm-canvas" aria-label=${`What the ${deviceWord(host)} opens in ${room.name}`}>
    <div class="rm-stage-head">
      <span class="rm-eyebrow">Preview</span>
      <b class="rm-stage-title">${room.name}</b>
      ${note === "" ? nothing : html`<span class="rm-stage-note">${note}</span>`}
    </div>
    <div class="stage-area rm-stage-area">
      <div class="rm-stage-body" style=${`--rm-screen-h: ${screenHeightPx(host, scale)}px`}>${renderRoomWatch(host, shown, `No page for this room. The ${deviceWord(host)} uses Anywhere else.`)}</div>
    </div>
    <p class="rm-stage-foot">Click a room to see what the ${deviceWord(host)} opens there.</p>
  </div>`;
}

// ── how it works ─────────────────────────────────────────────────────────

/** Where the browser keeps that How it works was closed, for every device. */
export const INTRO_HIDDEN_KEY = "wa-rooms-intro-hidden";

function introStorage(): Storage | undefined {
  try {
    return globalThis.localStorage ?? undefined;
  } catch {
    return undefined;
  }
}

/** Whether How it works shows: until it is closed, in this session or
 * before in this browser. */
export function introShown(host: Pick<RoomsViewHost, "uiState">): boolean {
  if (host.uiState.get("introHidden") === true) return false;
  try {
    return introStorage()?.getItem(INTRO_HIDDEN_KEY) !== "1";
  } catch {
    return true;
  }
}

function hideIntro(host: RoomsViewHost): void {
  host.uiState.set("introHidden", true);
  try {
    introStorage()?.setItem(INTRO_HIDDEN_KEY, "1");
  } catch {
    // Storage off: it stays closed for this visit only.
  }
  host.requestUpdate();
}

/** The three steps, in the device's word. */
export function introSteps(host: Pick<RoomsViewHost, "phone" | "android">): string[] {
  return [
    "A room sensor tells Home Assistant which room you are in.",
    "You pick a page for each room below.",
    `You walk in, and the ${deviceWord(host)} opens that room's page.`,
  ];
}

function renderIntro(host: RoomsViewHost): TemplateResult | typeof nothing {
  if (!introShown(host)) return nothing;
  return html`<section class="rm-intro" aria-label="How Rooms works">
    <span class="rm-eyebrow rm-intro-head">How it works</span>
    <ol class="rm-steps">
      ${introSteps(host).map((step, i) => html`<li class="rm-step"><span class="rm-step-n" aria-hidden="true">${i + 1}</span><span>${step}</span></li>`)}
    </ol>
    <button type="button" class="rm-btn rm-small rm-intro-x" @click=${() => hideIntro(host)}>Got it</button>
  </section>`;
}

/** The whole body: the rules in the main column, the stage beside them. */
export function renderRoomsBody(host: RoomsViewHost): TemplateResult {
  const listed = listedRooms(host);
  const picked = pickedRoom(host, listed);
  const hues = `--wa-stage-hue: ${ROOMS_HUE}; --rm-hue: ${ROOMS_HUE}`;
  if (host.mode === "point") {
    return html`<div class="rm-layout rm-layout-point" style=${hues}>
      <div class="rm-cell rm-cell-status">${renderPointPage(host, listed, picked)}</div>
    </div>`;
  }
  return html`<div class="rm-layout" style=${hues}>
    <div class="rm-cell rm-cell-status">${renderIntro(host)}${renderStatusCard(host)}</div>
    <div class="rm-cell rm-cell-rules">${renderRulesCard(host, listed, picked)}</div>
    <aside class="rm-side column canvas" aria-label="Preview">${renderStage(host, picked)}</aside>
  </div>`;
}

export const roomsViewStyles = css`
  /* A main column of rules and a sticky stage beside it, the page no wider
     than 1240px, at the left under the device's tabs. Under 1000px one column:
     the stage goes under the rules, before point control, and scrolls with
     the page. */
  .rm-layout {
    width: 100%; max-width: 1240px; margin: 0 0 14px;
    display: grid; grid-template-columns: minmax(0, 1fr) 360px; grid-template-rows: auto auto 1fr;
    column-gap: 16px; row-gap: 14px; align-items: start;
  }
  .rm-cell { min-width: 0; }
  .rm-cell-status { grid-column: 1; grid-row: 1; }
  .rm-cell-rules { grid-column: 1; grid-row: 2; }
  .rm-layout-point { grid-template-columns: minmax(0, 820px); }
  .rm-side { grid-column: 2; grid-row: 1 / span 3; position: sticky; top: var(--rm-side-top, 12px); min-width: 0; }
  @container (max-width: 1000px) {
    .rm-layout { grid-template-columns: minmax(0, 1fr); grid-template-rows: none; }
    .rm-cell-status, .rm-cell-rules, .rm-side { grid-column: 1; grid-row: auto; }
    .rm-side { position: static; }
  }

  /* Help is one plain line: muted, never italic. */
  .rm-help { margin: 2px 0 8px; font-size: 12px; line-height: 1.45; font-style: normal; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-help.warn { color: var(--wa-amber); }
  .rm-help a, .rm-sensor-hint a { color: var(--wa-ink); }
  .rm-help code, .rm-card code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .rm-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .rm-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .rm-card .field :is(input[type=text], input[type=number], select) {
    height: 30px; min-height: 30px; padding: 0 9px; font-size: 13px; border-radius: 9px;
    border-color: var(--wa-line-strong); background-color: var(--wa-field);
  }
  .rm-card .field .ent-box input[type=text] { padding-left: 32px; padding-right: 30px; }
  .rm-card .field.check { grid-template-columns: minmax(0, 1fr) auto; min-height: 30px; padding: 0; font-size: 13px; gap: 10px; }
  .rm-card .field.check > span { color: var(--wa-ink); font-size: 13px; }
  /* A picked entity wraps its name, id and state rather than cutting them
     short; the box grows a line instead. */
  .rm-card .ent-chosen { height: auto; min-height: 28px; }
  .rm-card button.ent-pick { flex-wrap: wrap; row-gap: 0; padding-top: 3px; padding-bottom: 3px; }
  .rm-card .ent-pick :is(.ent-name, .ent-id, .ent-state) { white-space: normal; overflow: visible; text-overflow: clip; overflow-wrap: anywhere; max-width: none; }
  .rm-card .ent-pick .ent-id { flex: 0 1 auto; }
  .rm-dirty { display: inline-block; width: 7px; height: 7px; margin-left: 7px; vertical-align: middle; border-radius: 50%; background: var(--rm-hue); }

  /* The cards: plain, the Rooms hue only on the lit outline of the card at
     the top, the icon chip and the picked row's edge. */
  .rm-card {
    border-radius: var(--wa-lc-r, 16px); background: var(--wa-card); border: 1px solid var(--wa-line); color: var(--wa-ink);
  }
  .rm-card.rm-lit { --c: var(--rm-hue); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid); ${litOutline} }
  /* The hue stays on the outline: the controls inside are neutral. */
  .rm-card.rm-lit > * { --c: var(--wa-accent); }
  .rm-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-muted); }
  .rm-start .rm-eyebrow { color: var(--rm-hue); }
  .rm-cap { font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-soft); }
  /* Every button and link button: a visible one pixel outline, neutral. */
  .rm-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 5px; flex: none;
    height: 32px; padding: 0 12px; border-radius: 999px; font: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
    text-decoration: none; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  .rm-btn.rm-small { height: 24px; padding: 0 9px; border-radius: 999px; font-size: 12px; font-weight: 400; color: var(--wa-soft); }
  .rm-btn:hover:not(:disabled) { background: var(--wa-hover); }
  .rm-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-btn:disabled { opacity: .45; cursor: default; }
  .rm-btn svg.ui-icon { width: 13px; height: 13px; }
  select.rm-select {
    min-width: 0; max-width: 100%; height: 30px; padding: 0 8px; border-radius: 9px; font: inherit; font-size: 13px;
    color: var(--wa-ink); background-color: var(--wa-field); border: 1px solid var(--wa-line-strong); cursor: pointer;
  }
  select.rm-select:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  select.rm-select:disabled { opacity: .45; cursor: default; }

  /* Switching: the chip, the line and the sensor, the switch at the
     right end, When under a hairline. */
  .rm-status {
    display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center;
    column-gap: 16px; row-gap: 12px; padding: 16px 18px;
  }
  .rm-ichip {
    width: 38px; height: 38px; border-radius: 10px; display: grid; place-items: center;
    border: 1px solid var(--rm-hue); color: var(--rm-hue);
  }
  .rm-ichip svg.ui-icon { width: 18px; height: 18px; stroke-width: 2; }
  .rm-status-text { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
  .rm-now { margin: 0; font-size: 16px; line-height: 1.4; overflow-wrap: anywhere; }
  .rm-now b { font-weight: 600; }
  .rm-sensor-line { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: 12px; color: var(--wa-muted); }
  .rm-sensor-name, .rm-sensor-hint { overflow-wrap: anywhere; }
  .rm-bermuda-ok { display: inline-flex; align-items: center; gap: 6px; color: var(--wa-green); overflow-wrap: anywhere; }
  .rm-bermuda-ok svg.ui-icon { width: 13px; height: 13px; flex: none; stroke-width: 2.4; }
  .rm-status-switch { min-width: 0; }
  .rm-status > .rm-status-switch { grid-column: 3; grid-row: 1; }
  .rm-status-wide { grid-column: 1 / -1; }
  .rm-status > .rm-help.rm-main-house { margin: 0; }
  .rm-help.rm-phone-jump { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
  .rm-sensor-edit { display: flex; flex-direction: column; gap: 4px; padding-top: 10px; border-top: 1px solid var(--wa-line); }
  .rm-when { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; padding-top: 12px; border-top: 1px solid var(--wa-line); }
  .rm-when-l { font-size: 12px; color: var(--wa-muted); }
  .seg.rm-seg { flex: 0 1 auto; max-width: 100%; height: auto; min-height: 30px; flex-wrap: wrap; }
  .seg.rm-seg button { min-height: 26px; padding: 3px 11px; font-size: 12px; font-weight: 500; letter-spacing: 0; line-height: 1.2; white-space: normal; overflow-wrap: anywhere; text-align: center; }
  .seg.rm-seg button:disabled { opacity: .45; cursor: default; }
  .rm-when-help { flex: 1 1 220px; min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  @container (max-width: 560px) {
    .rm-status { grid-template-columns: auto minmax(0, 1fr); }
    .rm-status > .rm-status-switch { grid-column: 1 / -1; grid-row: auto; }
  }
  .rm-reading { display: flex; align-items: flex-start; gap: 8px; margin: 2px 0; font-size: 12.5px; line-height: 1.45; overflow-wrap: anywhere; }
  .rm-dot { flex: none; width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; background: var(--wa-line-strong); }
  .rm-dot.ok { background: var(--wa-green); }
  .rm-dot.warn { background: var(--wa-amber); }

  .rm-now.off { color: var(--wa-soft); }
  /* How it works: three numbered steps in one row, closed for good by Got it. */
  .rm-intro {
    display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 12px; row-gap: 8px;
    margin-bottom: 14px; padding: 12px 14px 12px 16px; border-radius: var(--wa-lc-r, 16px);
    border: 1px dashed var(--wa-line-strong); background: var(--wa-panel);
  }
  .rm-intro-head { grid-column: 1; }
  .rm-intro-x { grid-column: 2; grid-row: 1; }
  ol.rm-steps { grid-column: 1 / -1; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .rm-step { display: flex; align-items: flex-start; gap: 9px; font-size: 13px; line-height: 1.45; color: var(--wa-ink); overflow-wrap: anywhere; }
  .rm-step-n {
    flex: none; width: 22px; height: 22px; border-radius: 999px; display: grid; place-items: center;
    font-size: 12px; font-weight: 600; color: var(--rm-hue); border: 1px solid var(--rm-hue);
  }
  @container (max-width: 640px) { ol.rm-steps { grid-template-columns: minmax(0, 1fr); gap: 8px; } }

  /* Start here: no sensor picked yet. */
  .rm-start { display: flex; flex-direction: column; gap: 10px; padding: 18px; }
  .rm-start-title { margin: 0; font-size: 18px; font-weight: 500; letter-spacing: -.015em; text-transform: none; color: var(--wa-ink); overflow-wrap: anywhere; }
  .rm-pitch { margin: 0; max-width: 640px; font-size: 13px; line-height: 1.5; color: var(--wa-soft); overflow-wrap: anywhere; }
  .rm-start-row { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 8px; }
  .rm-start-row > .rm-stack { flex: 1 1 280px; min-width: 0; }
  .rm-start-row > .rm-bermuda-link { margin-bottom: 2px; }
  .rm-start > .rm-help { margin: 0; }
  .rm-start-switch { display: flex; flex-direction: column; gap: 10px; padding-top: 12px; border-top: 1px solid var(--wa-line); }

  /* The rules: a head of two small capitals, the floors, a row per room. */
  .rm-rules { display: flex; flex-direction: column; overflow: hidden; }
  .rm-rules-head { display: flex; align-items: baseline; gap: 10px; padding: 14px 16px 8px; }
  .rm-rules-head > .rm-cap:first-child { flex: 1; }
  .rm-group { display: flex; flex-direction: column; }
  /* Switching off: the rooms dim, still there to edit, and one line says why. */
  .rm-off-note { display: flex; align-items: flex-start; gap: 8px; margin: 0 16px 6px; padding: 8px 10px; border-radius: 10px; font-size: 12.5px; line-height: 1.45; color: var(--wa-soft); background: var(--wa-panel); overflow-wrap: anywhere; }
  .rm-off-note .rm-dot { margin-top: 5px; }
  .rm-rules.off :is(.rm-group, .rm-else) { opacity: .55; transition: opacity .15s ease; }
  .rm-rules.off :is(.rm-group, .rm-else):is(:hover, :focus-within) { opacity: 1; }
  .rm-floor { padding: 8px 16px 4px; font-size: 11.5px; color: var(--wa-faint); overflow-wrap: anywhere; }
  ul.rm-rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
  .rm-row {
    display: flex; align-items: center; gap: 12px; padding: 8px 10px 8px 16px; cursor: pointer;
    transition: background-color .15s ease;
  }
  li.rm-row:hover { background: var(--wa-hover); }
  li.rm-row.on { background: var(--wa-raise); box-shadow: inset 2px 0 0 var(--rm-hue); }
  /* On the raised and hovered fills the controls' outline is lifted, so it
     stays visible. */
  li.rm-row:is(.on, :hover) :is(select.rm-select, button.rm-row-x) { border-color: color-mix(in srgb, var(--wa-ink) 26%, var(--wa-raise)); }
  .rm-row-room { flex: 1 1 auto; min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 3px 8px; }
  button.rm-row-name {
    padding: 0; border: 0; background: transparent; font: inherit; font-size: 14px; font-weight: 500; text-align: left;
    color: var(--wa-ink); cursor: pointer; overflow-wrap: anywhere; border-radius: 4px;
  }
  button.rm-row-name:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-row-sub { flex-basis: 100%; font-size: 12px; line-height: 1.35; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-arrow { flex: none; display: inline-flex; color: var(--wa-faint); }
  .rm-arrow svg.ui-icon { width: 16px; height: 16px; }
  .rm-row-page { flex: 0 0 260px; min-width: 0; display: flex; align-items: center; gap: 8px; }
  .rm-row-page > select.rm-select { flex: 1 1 auto; }
  .rm-row-end { flex: 0 0 26px; display: flex; justify-content: flex-end; }
  button.rm-row-x {
    width: 26px; height: 26px; padding: 0; display: grid; place-items: center; border-radius: 999px; cursor: pointer;
    color: var(--wa-muted); background: transparent; border: 1px solid var(--wa-line-strong); opacity: 0;
  }
  li.rm-row:hover button.rm-row-x, li.rm-row:focus-within button.rm-row-x, li.rm-row.on button.rm-row-x { opacity: 1; }
  @media (hover: none) { button.rm-row-x { opacity: 1; } }
  button.rm-row-x:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
  button.rm-row-x:focus-visible { outline: none; opacity: 1; box-shadow: var(--wa-ring); }
  button.rm-row-x:disabled { cursor: default; }
  button.rm-row-x svg.ui-icon { width: 12px; height: 12px; }
  .rm-else { margin-top: 6px; padding-top: 12px; padding-bottom: 12px; cursor: default; border-top: 1px solid var(--wa-line); background: var(--wa-panel); }
  .rm-else-name { font-size: 14px; font-weight: 500; }
  /* One screen of the page, small, beside each picker; an empty box when
     there is none. */
  .rm-thumb { flex: none; display: block; width: var(--rm-thumb-w); }
  .rm-thumb .wa-watch { margin: 0; }
  .rm-thumb.empty { height: var(--rm-screen-h); border-radius: 6px; border: 1px dashed var(--wa-line-strong); }
  .rm-thumb.phone { width: auto; min-width: var(--rm-thumb-w); }
  .rm-thumb.phone.empty { height: var(--rm-thumb-h); border-radius: 7px; }
  :is(.rm-stage-body, .rm-thumb) .wa-watch > .wp-screen { max-height: var(--rm-screen-h); }
  :is(.rm-stage-body, .rm-thumb) .wa-phone-area > .wp-screen { max-height: var(--rm-screen-h); overflow: hidden; }
  :is(.rm-stage-body, .rm-thumb) .wp-fold { display: none; }
  @container (max-width: 640px) {
    .rm-row { flex-wrap: wrap; row-gap: 8px; }
    .rm-row-room { flex-basis: calc(100% - 40px); }
    .rm-arrow { display: none; }
    .rm-row-page { flex: 1 1 auto; }
    .rm-row-end { order: 0; }
    .rm-row > .rm-row-room { order: -1; }
  }
  .rm-none { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; }
  .rm-none b { font-size: 13px; font-weight: 600; }
  .rm-none span { font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
  /* The fold under the rules: the areas not listed yet and the name field. */
  button.rm-fold {
    display: flex; align-items: center; gap: 8px; width: 100%; padding: 12px 16px; font: inherit; font-size: 12.5px;
    text-align: left; cursor: pointer; color: var(--wa-muted); background: transparent; border: 0; border-top: 1px solid var(--wa-line);
  }
  button.rm-fold:hover { background: var(--wa-hover); color: var(--wa-ink); }
  button.rm-fold:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-chev { display: inline-flex; flex: none; transition: transform .15s ease; }
  .rm-chev svg.ui-icon { width: 12px; height: 12px; stroke-width: 2.2; }
  [aria-expanded="true"] > .rm-chev { transform: rotate(90deg); }
  .rm-more { display: flex; flex-direction: column; gap: 10px; padding: 0 16px 14px; }
  .rm-areas { display: flex; flex-wrap: wrap; gap: 6px; }
  .rm-areas-help { width: 100%; margin: 2px 0 0; }
  button.rm-area {
    min-height: 26px; padding: 2px 10px; border-radius: 999px; font: inherit; font-size: 12px; cursor: pointer;
    color: var(--wa-soft); background: transparent; border: 1px solid var(--wa-line-strong); overflow-wrap: anywhere; text-align: left;
  }
  button.rm-area:hover { background: var(--wa-hover); color: var(--wa-ink); }
  button.rm-area:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-add-room { display: flex; gap: 6px; max-width: 480px; }
  .rm-add-room input {
    flex: 1 1 auto; min-width: 0; height: 32px; padding: 0 10px; border-radius: 10px;
    border: 1px solid var(--wa-line-strong); background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px;
  }
  .rm-add-room input:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .rm-more > .rm-help { margin: -4px 0 0; }

  /* Point control's own tab: the line and where the room comes from, then
     the picked room's targets and the switches. */
  .rm-point-intro { display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 16px; align-items: start; padding: 16px 18px 6px; }
  .rm-point-page .rm-point-body { padding: 4px 18px 16px; }
  .rm-warn { color: var(--wa-amber); }
  button.rm-folded { border-top: 0; color: var(--wa-soft); }
  .rm-point-sub { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-point-body { display: flex; flex-direction: column; padding: 2px 16px 14px 38px; }
  @container (max-width: 560px) { .rm-point-body { padding-left: 16px; } }
  .rm-point-room { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 12px; color: var(--wa-muted); }
  .rm-point-room > select.rm-select { flex: 0 1 260px; }
  .rm-sub-h { display: flex; align-items: center; gap: 8px; margin: 12px 0 4px; font-size: 12px; color: var(--wa-muted); }
  .rm-sub-h > span { flex: 1; }
  .rm-sub-h button.lc-btn { height: 26px; font-size: 12px; font-weight: 500; border: 1px solid var(--wa-line-strong); background: transparent; }
  .rm-switch { margin-top: 6px; }
  .rm-switch .rm-help { margin: 0 0 4px; }
  .rm-point-switches { margin-top: 8px; padding-top: 2px; border-top: 1px solid var(--wa-line); }
  .rm-when.rm-aim { padding-top: 4px; border-top: 0; }
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
    width: 28px; height: 28px; padding: 0; display: grid; place-items: center; border-radius: 8px;
    border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-muted); cursor: pointer;
  }
  .rm-remove:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
  .rm-remove:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-remove svg.ui-icon { width: 13px; height: 13px; }
  .rm-add-target { margin: 4px 0 8px; }

  /* The stage: the lit card (the watch editors' recipe, its edge in the
     Rooms hue), the picked room over the watch, one line at its foot. */
  .column.canvas.rm-side { gap: 0; }
  .column.canvas > .card.canvas-card.rm-canvas { min-height: 0; flex: none; }
  .rm-stage-head { display: flex; flex-direction: column; gap: 2px; padding: 14px 16px 0; }
  .rm-stage-title { font-size: 16px; font-weight: 500; overflow-wrap: anywhere; }
  .rm-stage-note { font-size: 12px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  .canvas-card.lit .stage-area.rm-stage-area { flex: none; align-items: center; justify-content: center; padding: 18px 12px 24px; }
  .canvas-card.lit .stage-area > .rm-stage-body { display: flex; justify-content: center; max-width: 100%; padding-bottom: 32px; }
  .rm-stage-foot { margin: 0; padding: 0 16px 16px; font-size: 12px; line-height: 1.45; color: var(--wa-muted); overflow-wrap: anywhere; }
  /* A plain watch screen: the page's name, or why there is none, on the
     watch's black. */
  .wp-screen.rm-screen { display: grid; place-items: center; padding: 20px; text-align: center; }
  .wp-screen.rm-screen span { font-size: 15px; font-weight: 600; color: var(--wa-face-muted); overflow-wrap: anywhere; }
  .wp-screen.rm-screen.blank span { font-size: 13px; font-weight: 500; line-height: 1.4; }
  /* No rooms yet: a dashed watch and one line. */
  .canvas-card.lit .stage-area.rm-empty { flex-direction: column; gap: 18px; padding: 24px 20px 40px; text-align: center; }
  .rm-empty-watch {
    width: 180px; height: 218px; border-radius: 50px; display: grid; place-items: center;
    border: 1.5px dashed var(--wa-line-strong); color: var(--wa-stage-hue);
  }
  .rm-empty-watch svg.ui-icon { width: 42px; height: 42px; stroke-width: 1.6; }
  .rm-empty-text { max-width: 280px; font-size: 13px; line-height: 1.5; color: var(--wa-muted); }
`;
