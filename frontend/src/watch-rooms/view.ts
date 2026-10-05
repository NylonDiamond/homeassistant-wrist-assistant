// The Rooms editor's cards, drawn from a host that holds the document and
// takes key writes. The element (`rooms-editor.ts`) owns loading, saving and
// the bar; this file only draws and turns a change into the writes the
// phone makes for it (`model.ts`).
//
// The settings cards sit in a column on the left: Room sensor, Switch pages
// by room (with When and the fallback page) and Point control. Your rooms
// takes the rest: one row per room, its page, and, opened, its point control
// targets with a heading dial each.

import { css, html, nothing, svg, type TemplateResult } from "lit";
import { sectionCard } from "../editor-chrome.js";
import { checkField, entityField, segField, selectField, textField } from "../editors.js";
import type { HassLike } from "../ha-api.js";
import { SECTION_COLOR } from "../kinds.js";
import type { EntityRef } from "../model.js";
import { agoWords } from "../send-state.js";
import { type UiIconName, uiIcon } from "../ui-icons.js";
import {
  type BehaviorDocument,
  type RoomListEntry,
  type RoomPageChoice,
  type RoomsView,
  FALLBACK_LABELS,
  ZONES_UNREADABLE_TEXT,
  fallbackChoice,
  fallbackWrites,
  findPageChoice,
  pointSwitchWrites,
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
}

const LOOK: Record<string, { color: string; icon: UiIconName }> = {
  sensor: { color: SECTION_COLOR.content, icon: "place" },
  switching: { color: SECTION_COLOR.numbers, icon: "pages" },
  point: { color: SECTION_COLOR.tap, icon: "tap" },
  rooms: { color: SECTION_COLOR.look, icon: "home" },
};

function isOpen(host: Pick<RoomsViewHost, "uiState">, card: string): boolean {
  return host.uiState.get(`fold:${card}`) !== false;
}

function card(host: RoomsViewHost, id: keyof typeof LOOK, title: string, body: () => TemplateResult, extra: { summary?: string; dot?: boolean } = {}): TemplateResult {
  const open = isOpen(host, id);
  const look = LOOK[id]!;
  return sectionCard({
    color: look.color,
    icon: uiIcon(look.icon),
    title,
    open,
    onToggle: () => { host.uiState.set(`fold:${id}`, !open); host.requestUpdate(); },
    ...(extra.summary ? { summary: extra.summary } : {}),
    dot: extra.dot === true,
    id: `rooms:${id}`,
  }, open ? body() : html``);
}

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

// ── Room sensor ──────────────────────────────────────────────────────────

/** What the sensor says now, and whether the watch reads it as a room. */
export function sensorReading(hass: HassLike, sensor: string): { line: string; tone: "ok" | "warn" | "none" } {
  if (sensor === "") return { line: "No room sensor. The watch guesses the room from its sensors, which works best with a Bermuda area sensor.", tone: "none" };
  const state = hass.states[sensor];
  if (state === undefined) return { line: "Home Assistant has no entity with this id now.", tone: "warn" };
  const room = roomFromState(sensor, state);
  const raw = typeof state.state === "string" ? state.state : "";
  if (room === undefined) return { line: `Now "${raw}", which the watch does not read as a room.`, tone: "warn" };
  const key = normalizedRoomKey(room);
  return { line: `Now in ${room}${key === "" ? ", whose name has no letter or digit the watch can match" : ""}.`, tone: key === "" ? "warn" : "ok" };
}

function renderSensorCard(host: RoomsViewHost): TemplateResult {
  const { view } = host;
  const reading = sensorReading(host.hass, view.sensor);
  return card(host, "sensor", "Room sensor", () => html`
    <div class="rm-stack">${entityField({ hass: host.hass }, "Entity", refOf(host.hass, view.sensor), (ref) => {
      if (host.busy) return;
      host.write(sensorWrites(host.document, ref.entityId));
    }, "rooms:sensor", { clearable: true })}</div>
    <div class="rm-reading"><i class="rm-dot ${reading.tone}" aria-hidden="true"></i><span>${reading.line}</span></div>
    ${view.sensor !== "" ? html`<div class="hint">Clearing the sensor turns Switch pages by room off.</div>` : nothing}`,
  { summary: view.sensor === "" ? "None" : nameOf(host.hass, view.sensor), dot: anyDirty(host, [ROOM_KEYS.sensor]) });
}

// ── Switch pages by room ─────────────────────────────────────────────────

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

function renderSwitchingCard(host: RoomsViewHost): TemplateResult {
  const { view } = host;
  const triggers = ROOM_RULES.switching.triggers;
  const help = triggers.find((t) => t.value === view.trigger)?.help ?? "";
  const fallback = fallbackChoice(view.fallback);
  const fallbackValue = fallback === "first" ? "" : fallback === "stay" ? STAY_ON_CURRENT_PAGE : pageValue(host.pages, view.fallback);
  const keys = [ROOM_KEYS.autoSwitch, ROOM_KEYS.legacyQuickJump, ROOM_KEYS.topSectionDoubleTap, ROOM_KEYS.handGesture, ROOM_KEYS.fallback];
  return card(host, "switching", "Switch pages by room", () => html`
    ${checkField("Switch pages by room", view.switching, (on) => { if (!host.busy) host.write(switchingWritesFor(host.document, on)); })}
    <div class="hint">Jump to the page you give a room below.</div>
    ${view.switching ? html`
      <div class="rm-stack">${segField("When", view.trigger, triggers.map((t): [RoomTrigger, string] => [t.value, t.label]), (v) => {
        if (!host.busy) host.write(triggerWrites(host.document, v));
      })}</div>
      <div class="hint">${help}</div>
      ${selectField("Fallback page", fallbackValue,
        pageOptions(host.pages, fallbackValue, [[STAY_ON_CURRENT_PAGE, FALLBACK_LABELS.stay], ["", FALLBACK_LABELS.first]]),
        (v) => { if (!host.busy) host.write(fallbackWrites(v)); }, { snapBack: true })}
      <div class="hint">When the room cannot be told, or has no page.</div>` : nothing}`,
  { summary: view.switching ? view.trigger : "Off", dot: anyDirty(host, keys) });
}

// ── Point control ────────────────────────────────────────────────────────

function renderPointCard(host: RoomsViewHost): TemplateResult {
  const { view } = host;
  const values: Record<string, boolean> = { [ROOM_KEYS.tapToToggle]: view.tapToToggle, [ROOM_KEYS.liveTile]: view.liveTile };
  const switches = ROOM_RULES.pointControl.switches;
  return card(host, "point", "Point control", () => html`
    ${switches.map((s) => {
      const on = values[s.key] ?? s.absent;
      return html`${checkField(s.label, on, (v) => { if (!host.busy) host.write(pointSwitchWrites(s.key, v)); })}
        <div class="hint">${on ? s.onDetail : s.offDetail}</div>`;
    })}
    <div class="hint">One value for every point control tile on this watch.</div>`,
  { summary: switches.filter((s) => values[s.key]).map((s) => s.label).join(", ") || "Off", dot: anyDirty(host, switches.map((s) => s.key)) });
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

// ── Your rooms ───────────────────────────────────────────────────────────

function seenWords(at: number | undefined): string | undefined {
  if (at === undefined) return undefined;
  return `Seen ${agoWords(Math.max(0, (Date.now() - at) / 1000))}`;
}

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

function renderTargets(host: RoomsViewHost, room: RoomListEntry): TemplateResult {
  const { view } = host;
  if (!view.zones.ok) return html`<div class="hint warn">${ZONES_UNREADABLE_TEXT}</div>`;
  const zones = roomZones(view.zones.rooms, room.key);
  const addKey = `rooms:target-add:${room.key}`;
  return html`<div class="rm-targets">
    <div class="rm-sub">Point control targets</div>
    ${zones.length === 0 ? html`<div class="hint">None yet. Add what you point at in this room, then set the direction it lies in from where you stand.</div>` : nothing}
    ${zones.map((_, i) => renderTarget(host, room.key, zones, i))}
    <div class="rm-stack rm-add-target">${entityField({ hass: host.hass }, "Add a target", refOf(host.hass, ""), (ref) => {
      const id = ref.entityId.trim();
      if (id === "" || host.busy || zones.some((z) => z.entityId === id)) return;
      const writes = roomZonesWrites(host.document, room.key, [...zones, { entityId: id, centerHeading: 0, label: friendlyNameFromId(id) }]);
      if (writes !== undefined) host.write(writes);
    }, addKey, { domain: POINT_CONTROL_DOMAINS, clearable: false })}</div>
    <div class="hint">Heading is degrees clockwise from north. Drag the dial or type it; capturing it with the watch compass is on the iPhone.</div>
  </div>`;
}

function renderRoomRow(host: RoomsViewHost, room: RoomListEntry): TemplateResult {
  const { view } = host;
  const page = roomPage(view, room.key);
  const value = pageValue(host.pages, page);
  const zoneCount = view.zones.ok ? roomZones(view.zones.rooms, room.key).length : 0;
  const openKey = `room:${room.key}`;
  const open = host.uiState.get(openKey) === true;
  const seen = seenWords(room.lastSeen);
  const pageName = page === "" ? undefined : (findPageChoice(host.pages, page)?.name ?? "A page not on this watch");
  const facts = [pageName, zoneCount > 0 ? `${zoneCount} ${zoneCount === 1 ? "target" : "targets"}` : undefined].filter((f): f is string => f !== undefined);
  return html`<li class="rm-room ${open ? "open" : ""}">
    <button type="button" class="rm-room-head" aria-expanded=${open ? "true" : "false"}
      @click=${() => { host.uiState.set(openKey, !open); host.requestUpdate(); }}>
      <i class="rm-dot ${room.lastSeen !== undefined ? "ok" : "none"}" aria-hidden="true"></i>
      <span class="rm-room-name">${room.name}</span>
      ${room.key !== room.name.toLowerCase() ? html`<code class="rm-room-key" title="The name the watch matches">${room.key}</code>` : nothing}
      <span class="rm-room-facts">${facts.join(" · ") || "Nothing set"}</span>
      ${seen ? html`<span class="rm-chip">${seen}</span>` : nothing}
      <span class="rm-chev" aria-hidden="true">${uiIcon("chevron")}</span>
    </button>
    ${open ? html`<div class="rm-room-body">
      ${selectField("Page", value, pageOptions(host.pages, value, [["", "None"]]), (v) => {
        if (!host.busy) host.write(roomPageWrites(host.document, room.key, v));
      }, { snapBack: true })}
      ${renderTargets(host, room)}
    </div>` : nothing}
  </li>`;
}

function renderAddRoom(host: RoomsViewHost): TemplateResult {
  const text = String(host.uiState.get("addRoom") ?? "");
  const key = normalizedRoomKey(text);
  const exists = key !== "" && host.rooms.some((r) => r.key === key);
  const add = () => {
    if (key === "" || exists) return;
    host.addRoom(text.trim());
    host.uiState.set("addRoom", "");
    host.uiState.set(`room:${key}`, true);
    host.requestUpdate();
  };
  return html`<div class="rm-add-room">
    <input type="text" placeholder="Add a room by name" aria-label="Room name" .value=${text}
      @input=${(e: Event) => { host.uiState.set("addRoom", (e.target as HTMLInputElement).value); host.requestUpdate(); }}
      @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
    <button type="button" class="pe-btn" ?disabled=${key === "" || exists} @click=${add}>${uiIcon("plus")}<span>Add</span></button>
  </div>
  ${text.trim() !== "" && key === "" ? html`<div class="hint warn">The watch matches room names by their letters a to z and digits, and this name has none.</div>` : nothing}
  ${exists ? html`<div class="hint">That room is in the list.</div>` : nothing}`;
}

function renderRoomsCard(host: RoomsViewHost): TemplateResult {
  const { rooms } = host;
  return card(host, "rooms", "Your rooms", () => html`
    <div class="hint">Every area in Home Assistant, every room with a page or targets, and every room the sensor reported in the last day. A room is matched by its name, so the sensor's state has to name it.</div>
    ${renderAddRoom(host)}
    ${rooms.length === 0
      ? html`<div class="hint">${host.roomsState === "loading" ? "Reading the areas and the sensor's states…" : "No rooms yet. Add one by name."}</div>`
      : html`<ul class="rm-rooms">${rooms.map((r) => renderRoomRow(host, r))}</ul>`}`,
  { summary: `${rooms.length} ${rooms.length === 1 ? "room" : "rooms"}`, dot: anyDirty(host, [ROOM_KEYS.mappings, ROOM_KEYS.zones]) });
}

/** The whole body: the settings column and the rooms. */
export function renderRoomsBody(host: RoomsViewHost): TemplateResult {
  return html`<div class="rm-layout">
    <div class="rm-col rm-settings">
      ${renderSensorCard(host)}
      ${renderSwitchingCard(host)}
      ${renderPointCard(host)}
    </div>
    <div class="rm-col rm-rooms-col">${renderRoomsCard(host)}</div>
  </div>`;
}

export const roomsViewStyles = css`
  .rm-layout { display: grid; grid-template-columns: minmax(280px, 380px) minmax(0, 1fr); gap: 14px; align-items: start; margin-bottom: 14px; }
  @container (max-width: 820px) { .rm-layout { grid-template-columns: minmax(0, 1fr); } }
  .rm-col { min-width: 0; display: flex; flex-direction: column; }
  .rm-col > .sec:first-child { margin-top: 0; }
  .rm-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .rm-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .rm-reading { display: flex; align-items: flex-start; gap: 8px; margin: 6px 0 4px; font-size: 12.5px; line-height: 1.45; }
  .rm-dot { flex: none; width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; background: var(--wa-line-strong); }
  .rm-dot.ok { background: var(--wa-green); }
  .rm-dot.warn { background: var(--wa-amber); }
  .rm-room-head .rm-dot { margin-top: 0; }
  .rm-add-room { display: flex; gap: 8px; margin: 8px 0; }
  .rm-add-room input { flex: 1 1 auto; min-width: 0; height: 32px; padding: 0 10px; border-radius: var(--wa-r-sm, 8px);
    border: 1px solid var(--wa-line-strong); background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px; }
  .rm-add-room input:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .rm-add-room .pe-btn svg.ui-icon { width: 13px; height: 13px; }
  ul.rm-rooms { list-style: none; margin: 4px 0 10px; padding: 0; display: flex; flex-direction: column; }
  .rm-room { border-top: 1px solid var(--wa-line); }
  .rm-room:first-child { border-top: 0; }
  .rm-room-head {
    display: flex; align-items: center; gap: 8px; width: 100%; min-height: 40px; padding: 6px 2px; border: 0; background: none;
    color: var(--wa-ink); font: inherit; font-size: 13px; text-align: left; cursor: pointer; border-radius: 6px;
  }
  .rm-room-head:hover { background: color-mix(in srgb, var(--wa-ink) 4%, transparent); }
  .rm-room-head:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-room-name { flex: 0 1 auto; min-width: 0; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rm-room-key { flex: 0 1 auto; min-width: 0; font-size: 11px; color: var(--wa-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rm-room-facts { flex: 1 1 auto; min-width: 0; color: var(--wa-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; }
  .rm-chip {
    flex: none; display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 6px; font-size: 11px; font-weight: 600;
    color: var(--wa-ink); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-green) 55%, transparent);
  }
  .rm-chev { flex: none; display: inline-flex; color: var(--wa-muted); transition: transform .12s ease-out; }
  .rm-chev svg.ui-icon { width: 12px; height: 12px; }
  .rm-room.open .rm-chev { transform: rotate(90deg); }
  .rm-room-body { padding: 2px 4px 12px 18px; }
  .rm-sub { margin: 10px 0 2px; font-size: 11.5px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
  .rm-target {
    display: grid; grid-template-columns: 72px minmax(0, 1fr) 28px; gap: 10px; align-items: start;
    margin: 8px 0; padding: 10px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-field);
  }
  .rm-target-fields { min-width: 0; }
  .rm-dial { width: 72px; height: 72px; touch-action: none; cursor: grab; display: block; border-radius: 50%; }
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
  .rm-heading-box input { width: 72px; }
  .rm-compass { font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .rm-remove {
    width: 28px; height: 28px; padding: 0; display: grid; place-items: center; border-radius: 6px; border: 0; background: none;
    color: var(--wa-muted); cursor: pointer;
  }
  .rm-remove:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
  .rm-remove:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-remove svg.ui-icon { width: 13px; height: 13px; }
  .rm-add-target { margin-top: 6px; }
`;
