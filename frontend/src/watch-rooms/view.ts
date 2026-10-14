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
// point control switches are the main house's: one line says so in place of
// them, and the switch is Switch automatically, which is this home's own.

import { css, html, nothing, svg, type TemplateResult } from "lit";
import { litOutline } from "../editor-chrome.js";
import { checkField, entityField, textField } from "../editors.js";
import type { HassLike } from "../ha-api.js";
import type { EntityRef } from "../model.js";
import type { IconProvider } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import { renderWatchFrame } from "../watch-frame.js";
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
  /** The page is one column: the watch drawn a little smaller. */
  narrow?: boolean;
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
function isOpen(host: RoomsViewHost, key: string, fallback = false): boolean {
  const value = host.uiState.get(key);
  return typeof value === "boolean" ? value : fallback;
}

function flip(host: RoomsViewHost, key: string, now: boolean): void {
  host.uiState.set(key, !now);
  host.requestUpdate();
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

/** Bermuda, the integration that makes an area sensor from Bluetooth, is
 * not something a new user knows by name: the word links to it. */
export const BERMUDA_URL = "https://github.com/agittins/bermuda";

/** With no sensor picked the watch looks for one itself, by name
 * (`detectCurrentRoomName` in the watch app scores "bermuda", "area",
 * "room" and the like), which can find the wrong one or none. */
export const NO_SENSOR_TEXT = "No room sensor picked. The watch looks for one by its name, such as a Bermuda area sensor. Pick one to be sure.";

/** Why Bermuda, in the card that stands at the top until a sensor is picked. */
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

/** A room row's small line: how many things to point at in it, "" for none. */
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
    ${home ? html`<p class="rm-help rm-status-wide rm-main-house">${HOME_ROOMS_MAIN_HOUSE_TEXT}</p>`
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

const STATUS_KEYS = [ROOM_KEYS.sensor, ROOM_KEYS.autoSwitch, ROOM_KEYS.legacyQuickJump, ROOM_KEYS.topSectionDoubleTap, ROOM_KEYS.handGesture];

/** The card at the top: where you are and what the watch shows, or, with no
 * sensor picked, Start here. */
function renderStatusCard(host: RoomsViewHost): TemplateResult {
  const { view } = host;
  const dirty = dirtyDot(anyDirty(host, STATUS_KEYS));
  if (view.sensor === "") {
    return html`<section class="rm-card rm-lit rm-start" aria-label="Start here">
      <span class="rm-eyebrow">Start here${dirty}</span>
      <h3 class="rm-start-title">Tell the watch which room you are in</h3>
      <p class="rm-pitch">${BERMUDA_PITCH}</p>
      <div class="rm-start-row">
        ${renderSensorField(host)}
        <a class="rm-btn rm-bermuda-link" href=${BERMUDA_URL} target="_blank" rel="noopener noreferrer">Get Bermuda</a>
      </div>
      <p class="rm-help">${withBermudaLink(NO_SENSOR_TEXT)}</p>
      <div class="rm-start-switch">${renderSwitching(host)}</div>
    </section>`;
  }
  const changing = isOpen(host, "sensorOpen");
  const bermuda = isBermudaSensor(host.hass, view.sensor);
  const reading = sensorReading(host.hass, view.sensor);
  return html`<section class="rm-card rm-lit rm-status" aria-label="Switch pages by room">
    <span class="rm-ichip" aria-hidden="true">${uiIcon("home")}</span>
    <div class="rm-status-text">
      <p class="rm-now">The watch opens a room's page when the room sensor says you walked in.${dirty}</p>
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
  return Math.round((host.screen ?? DEFAULT_SCREEN).height * scale * 100) / 100;
}

function renderPageThumb(host: RoomsViewHost, stored: string): TemplateResult {
  const page = watchPageFor(host, stored);
  const screen = host.screen ?? DEFAULT_SCREEN;
  const size = `--rm-screen-h: ${screenHeightPx(host, THUMB_SCALE)}px; --rm-thumb-w: ${Math.round(screen.width * THUMB_SCALE)}px`;
  if (page === undefined) return html`<span class="rm-thumb empty" aria-hidden="true" style=${size}></span>`;
  return html`<span class="rm-thumb" aria-hidden="true" title=${watchPageName(page)} style=${size}>${renderWatchPagePreview({
    page, pages: [page], screen, states: host.hass.states, ...(host.icons ? { icons: host.icons } : {}), scale: THUMB_SCALE,
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
  const line = roomPointLine(host, room);
  return html`<li class="rm-row ${on ? "on" : ""}" @click=${() => pick(host, room.key)}>
    <span class="rm-row-room">
      <button type="button" class="rm-row-name" aria-pressed=${on ? "true" : "false"} title="Show this room on the watch"
        @click=${(e: Event) => { e.stopPropagation(); pick(host, room.key); }}>${room.name}</button>
      ${line === "" ? nothing : html`<span class="rm-row-sub">${line}</span>`}
    </span>
    <span class="rm-arrow" aria-hidden="true">${uiIcon("arrow")}</span>
    <span class="rm-row-page">
      ${renderPageThumb(host, stored)}
      ${pageSelect(`Page for ${room.name}`, value, pageOptions(host.pages, value, [["", "No page"]]), (v) => {
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
  ${text.trim() !== "" && key === "" ? html`<p class="rm-help warn">The watch matches room names by their letters a to z and digits, and this name has none.</p>` : nothing}
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
      ${pageSelect("Page anywhere else", value, pageOptions(host.pages, value, [[STAY_ON_CURRENT_PAGE, FALLBACK_LABELS.stay], ["", FALLBACK_LABELS.first]]),
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
  return html`<section class="rm-card rm-rules" aria-label="Room pages">
    <div class="rm-rules-head">
      <span class="rm-cap">When I walk into${dirtyDot(anyDirty(host, [ROOM_KEYS.mappings, ROOM_KEYS.fallback]))}</span>
      <span class="rm-cap rm-cap-page">the watch opens</span>
    </div>
    ${listed.length === 0
      ? html`<div class="rm-none">
          <b>${host.roomsState === "loading" ? "Reading your rooms" : "No rooms yet"}</b>
          <span>${host.roomsState === "loading" ? "The areas and what the room sensor reported." : areas.length > 0 ? "Pick an area below, or type a name." : "Type a room's name below."}</span>
        </div>`
      : groups.map((g) => html`<div class="rm-group" role="group" aria-label=${g.name === "" ? "Rooms" : g.name}>
          ${g.name === "" ? nothing : html`<span class="rm-floor">${g.name}</span>`}
          <ul class="rm-rows">${g.rooms.map((r) => renderRuleRow(host, r, r.key === picked?.key))}</ul>
        </div>`)}
    ${renderFallbackRow(host)}
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

// ── Point control ────────────────────────────────────────────────────────

/** One switch with its line under it. */
function switchRow(label: string, on: boolean, line: string, set: (v: boolean) => void): TemplateResult {
  return html`<div class="rm-switch">${checkField(label, on, set)}<p class="rm-help">${line}</p></div>`;
}

function renderPointSwitches(host: RoomsViewHost): TemplateResult {
  const { view } = host;
  const values: Record<string, boolean> = { [ROOM_KEYS.tapToToggle]: view.tapToToggle, [ROOM_KEYS.liveTile]: view.liveTile };
  return html`<div class="rm-point-switches" title="One value for every point control tile on this watch.">
    <div class="rm-sub-h"><span>Every room</span></div>
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

function renderPointCard(host: RoomsViewHost, listed: readonly RoomListEntry[], picked: RoomListEntry | undefined): TemplateResult {
  const open = isOpen(host, "pointOpen");
  const home = host.home === true;
  const keys = home ? [ROOM_KEYS.zones] : [ROOM_KEYS.zones, ROOM_KEYS.tapToToggle, ROOM_KEYS.liveTile];
  return html`<section class="rm-card rm-point" aria-label="Point control">
    <button type="button" class="rm-point-head" aria-expanded=${open ? "true" : "false"} @click=${() => flip(host, "pointOpen", open)}>
      <span class="rm-chev" aria-hidden="true">${uiIcon("right")}</span>
      <span class="rm-point-text">
        <span class="rm-point-title">Point control${dirtyDot(anyDirty(host, keys))}</span>
        <span class="rm-point-sub">Point the watch at a lamp to control it. ${pointSummary(host.view)}</span>
      </span>
    </button>
    ${open ? html`<div class="rm-point-body">
      ${picked === undefined
        ? html`<p class="rm-help">Add a room first, then the things you point at in it.</p>`
        : html`<label class="rm-point-room">
            <span>Room</span>
            ${pageSelect("Room for point control", picked.key, listed.map((r): [string, string] => [r.key, r.name]), (v) => pick(host, v), false)}
          </label>
          ${renderTargets(host, picked)}`}
      ${home ? nothing : renderPointSwitches(host)}
    </div>` : nothing}
  </section>`;
}

// ── the stage ────────────────────────────────────────────────────────────

/** The watch's size on the stage, in pixels per point. */
const STAGE_SCALE = 1.15;

/** The watch showing a page: the page itself when the watch's pages are at
 * hand, else a plain screen with its name, or `blank` when there is none. */
function renderRoomWatch(host: RoomsViewHost, stored: string, blank: string): TemplateResult {
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
  return renderWatchFrame(screen, scale, html`<div class="wp-screen rm-screen ${name === "" ? "blank" : ""}"
    style=${`width:${screen.width * scale}px;height:${screen.height * scale}px;background:${watchScreenBackground({}, scale, screen)}`}>
    <span>${name === "" ? blank : name}</span>
  </div>`, name === "" ? "Watch" : `Watch showing ${name}`);
}

/** The sticky stage beside the rules: the picked room's page on the watch. */
function renderStage(host: RoomsViewHost, room: RoomListEntry | undefined): TemplateResult {
  const scale = host.narrow === true ? 1 : STAGE_SCALE;
  if (room === undefined) {
    return html`<div class="card canvas-card lit rm-canvas" aria-label="Preview">
      <div class="rm-stage-head"><span class="rm-eyebrow">Preview</span><b class="rm-stage-title">No rooms yet</b></div>
      <div class="stage-area rm-stage-area rm-empty">
        <div class="rm-empty-watch" aria-hidden="true">${uiIcon("home")}</div>
        <span class="rm-empty-text">Add a room and give it a page. When you walk in, the watch opens that page.</span>
      </div>
    </div>`;
  }
  const stored = roomPage(host.view, room.key);
  // A room with no page opens Anywhere else: that page when it is one.
  const fallback = host.view.fallback;
  const shown = stored !== "" ? stored : fallbackChoice(fallback) === "page" ? fallback : "";
  const note = stored !== "" ? "" : shown !== "" ? "No page for this room, so the watch opens Anywhere else." : "";
  return html`<div class="card canvas-card lit rm-canvas" aria-label=${`What the watch opens in ${room.name}`}>
    <div class="rm-stage-head">
      <span class="rm-eyebrow">Preview</span>
      <b class="rm-stage-title">${room.name}</b>
      ${note === "" ? nothing : html`<span class="rm-stage-note">${note}</span>`}
    </div>
    <div class="stage-area rm-stage-area">
      <div class="rm-stage-body" style=${`--rm-screen-h: ${screenHeightPx(host, scale)}px`}>${renderRoomWatch(host, shown, "No page for this room. The watch uses Anywhere else.")}</div>
    </div>
    <p class="rm-stage-foot">Click a room to see what the watch opens there.</p>
  </div>`;
}

/** The whole body: the rules in the main column, the stage beside them. */
export function renderRoomsBody(host: RoomsViewHost): TemplateResult {
  const listed = listedRooms(host);
  const picked = pickedRoom(host, listed);
  return html`<div class="rm-layout" style=${`--wa-stage-hue: ${ROOMS_HUE}; --rm-hue: ${ROOMS_HUE}`}>
    <div class="rm-cell rm-cell-status">${renderStatusCard(host)}</div>
    <div class="rm-cell rm-cell-rules">${renderRulesCard(host, listed, picked)}</div>
    <aside class="rm-side column canvas" aria-label="Preview">${renderStage(host, picked)}</aside>
    <div class="rm-cell rm-cell-point">${renderPointCard(host, listed, picked)}</div>
  </div>`;
}

export const roomsViewStyles = css`
  /* A main column of rules and a sticky stage beside it, the page no wider
     than 1240px and centred. Under 1000px one column: the stage goes under
     the rules, before point control, and scrolls with the page. */
  .rm-layout {
    width: 100%; max-width: 1240px; margin: 0 auto 14px;
    display: grid; grid-template-columns: minmax(0, 1fr) 360px; grid-template-rows: auto auto 1fr;
    column-gap: 16px; row-gap: 14px; align-items: start;
  }
  .rm-cell { min-width: 0; }
  .rm-cell-status { grid-column: 1; grid-row: 1; }
  .rm-cell-rules { grid-column: 1; grid-row: 2; }
  .rm-cell-point { grid-column: 1; grid-row: 3; }
  .rm-side { grid-column: 2; grid-row: 1 / span 3; position: sticky; top: 12px; min-width: 0; }
  @container (max-width: 1000px) {
    .rm-layout { grid-template-columns: minmax(0, 1fr); grid-template-rows: none; }
    .rm-cell-status, .rm-cell-rules, .rm-cell-point, .rm-side { grid-column: 1; grid-row: auto; }
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
    height: 30px; min-height: 30px; padding: 0 9px; font-size: 13px; border-radius: 7px;
    border-color: var(--wa-line-strong); background-color: var(--wa-field);
  }
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
    height: 32px; padding: 0 12px; border-radius: 8px; font: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
    text-decoration: none; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  .rm-btn.rm-small { height: 24px; padding: 0 9px; border-radius: 6px; font-size: 12px; font-weight: 400; color: var(--wa-soft); }
  .rm-btn:hover:not(:disabled) { background: var(--wa-hover); }
  .rm-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-btn:disabled { opacity: .45; cursor: default; }
  .rm-btn svg.ui-icon { width: 13px; height: 13px; }
  select.rm-select {
    min-width: 0; max-width: 100%; height: 30px; padding: 0 8px; border-radius: 7px; font: inherit; font-size: 13px;
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
    width: 26px; height: 26px; padding: 0; display: grid; place-items: center; border-radius: 6px; cursor: pointer;
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
  :is(.rm-stage-body, .rm-thumb) .wa-watch > .wp-screen { max-height: var(--rm-screen-h); }
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
    flex: 1 1 auto; min-width: 0; height: 32px; padding: 0 10px; border-radius: 8px;
    border: 1px solid var(--wa-line-strong); background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px;
  }
  .rm-add-room input:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .rm-more > .rm-help { margin: -4px 0 0; }

  /* Point control, folded: one line, then the picked room's targets and the
     two switches. */
  button.rm-point-head {
    display: flex; align-items: center; gap: 10px; width: 100%; padding: 13px 16px; border-radius: var(--wa-lc-r, 16px);
    font: inherit; text-align: left; cursor: pointer; color: var(--wa-ink); background: transparent; border: 0;
  }
  button.rm-point-head:hover { background: var(--wa-hover); }
  button.rm-point-head:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.rm-point-head > .rm-chev { color: var(--wa-muted); }
  .rm-point-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .rm-point-title { font-size: 13.5px; font-weight: 500; }
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
