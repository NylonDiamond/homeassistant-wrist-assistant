// `<wa-home-map-editor>`: the home's map in the panel (app repo
// docs/home_map_plan_2026-10.md, "The panel", step 5). The flat plan of one
// floor drawn in SVG (`draw.ts`), live from Home Assistant's states: drag a
// pin to move it, add a pin for any entity, remove one, and for a room its
// name, its Home Assistant area and the page a tap on it opens on the watch,
// or delete it. No scanning and no 3D: the map is made on an iPhone.
//
// Every edit saves at once, made from the rev the map was read at
// (`save.ts`): a save refused because the iPhone saved meanwhile reads the
// map again, makes the same edit on it and saves again, and says so when it
// cannot. Each map read or saved is handed to `store.ts`, so the page
// editor's Home map tiles draw it too.
//
// The panel loads this module on its own, with one `import()`, when its route
// is `/home-map` (`hook.ts`). Nothing it imports may import `icons.ts`.

import { LitElement, css, html, nothing, unsafeCSS, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { chromeTokens, inspectorStyles } from "../editor-chrome.js";
import { betaPill, entityField } from "../editors.js";
import { formStyles } from "../form-styles.js";
import { type HassLike, fetchHomeMap } from "../ha-api.js";
import { SECTION_COLOR } from "../kinds.js";
import { fetchLibrarySummary } from "../library/client.js";
import { libraryItems, libraryOf } from "../library/model.js";
import type { EntityRef } from "../model.js";
import type { IconProvider } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import { randomWatchId } from "../watch-pages/edit.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { HOME_PLAN_COLORS, homePlan, homePlanViewBox, homePlanViewBoxAttr } from "./draw.js";
import {
  type HomeMapEdit,
  type HomeMapFloor,
  type HomeMapPin,
  type HomeMapRead,
  type HomeMapRoom,
  type HomePoint,
  homeMapAreaChoices,
  homeMapDeleteRoomQuestion,
  homeMapFloorName,
  homeMapLightsOn,
  homeMapLightsOnWords,
  homeMapPinLook,
  homeMapPinName,
  homeMapPinRoom,
  homeMapRoomName,
  homeMapRoomPinCount,
  newHomeMapPin,
  readHomeMap,
  sameHomeMapId,
} from "./model.js";
import { HOME_MAP_MERGED_TEXT, homeMapApi, saveHomeMapEdit } from "./save.js";
import { keepHomeMap } from "./store.js";

export const HOME_MAP_LEAD = "The plan of your home from the iPhone's scan. Drag a pin to move it; click a room to name it, link its area and the page it opens on the watch.";
export const HOME_MAP_UPDATE_TEXT = "Update the Wrist Assistant integration to see the home map here.";
export const HOME_MAP_EMPTY_TEXT = "No home map yet. Scan your rooms with the Wrist Assistant app on an iPhone or iPad with LiDAR (the Pro models). The map shows here once it is saved.";

/** A drag shorter than this, in screen pixels, is a click. */
const DRAG_SLOP = 4;

type Note = { kind: "ok" | "warn" | "err"; text: string };
type Selection = { kind: "pin" | "room"; id: string };

/** One page a room can open, as the library lists it. */
interface HomeMapPageChoice {
  id: string;
  name: string;
}

export class WaHomeMapEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) icons: IconProvider | undefined = undefined;
  @property({ attribute: false }) iconsTick = 0;
  @property({ attribute: false }) capable = false;

  @state() private read?: HomeMapRead;
  @state() private unsupported = false;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private note?: Note;
  @state() private saving = false;
  @state() private floorId?: string;
  @state() private selected?: Selection;
  /** A pin drawn where it is being dragged to, or dropped while its save
   * is out. */
  @state() private moving?: { pinId: string; at: HomePoint };
  @state() private pages?: HomeMapPageChoice[];

  private loadSeq = 0;
  private askedOnce = false;
  private endDrag?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.askedOnce) void this.load(true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.endDrag?.();
    this.loadSeq++;
  }

  protected override willUpdate(_changed: PropertyValues): void {
    if (!this.hass || !this.capable || this.askedOnce) return;
    this.askedOnce = true;
    void this.load();
    void this.loadPages();
  }

  // ── loading ────────────────────────────────────────────────────────────

  private async load(quiet = false): Promise<void> {
    const hass = this.hass;
    if (!hass || !this.capable) return;
    const seq = ++this.loadSeq;
    if (!quiet) {
      this.loading = this.read === undefined;
      this.loadError = undefined;
    }
    try {
      const reply = await fetchHomeMap(hass);
      if (seq !== this.loadSeq) return;
      this.unsupported = false;
      this.loadError = undefined;
      this.show({ doc: readHomeMap(reply?.doc) ?? null, rev: typeof reply?.rev === "number" ? reply.rev : 0 });
    } catch (err) {
      if (seq !== this.loadSeq) return;
      const { code, message } = watchCommandError(err);
      if (code === "unknown_command") this.unsupported = true;
      else if (!quiet || this.read === undefined) this.loadError = message;
    }
    this.loading = false;
  }

  /** The library's pages, for a room's Page menu. A home without the
   * library offers none; the menu then shows only what the room holds. */
  private async loadPages(): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    try {
      const lib = libraryOf(await fetchLibrarySummary(hass));
      this.pages = libraryItems(lib, "pages").map((p) => ({ id: p.id, name: p.name }));
    } catch {
      this.pages = [];
    }
  }

  private show(read: HomeMapRead): void {
    this.read = read;
    if (this.hass) keepHomeMap(this.hass, read);
    const floors = read.doc?.floors ?? [];
    if (!floors.some((f) => sameHomeMapId(f.id, this.floorId))) this.floorId = floors[0]?.id;
    this.dropStaleSelection();
  }

  private dropStaleSelection(): void {
    const floor = this.floor();
    const sel = this.selected;
    if (sel === undefined) return;
    const there = floor !== undefined && (sel.kind === "pin" ? floor.pins.some((p) => sameHomeMapId(p.id, sel.id)) : floor.rooms.some((r) => sameHomeMapId(r.id, sel.id)));
    if (!there) this.selected = undefined;
  }

  private floor(): HomeMapFloor | undefined {
    return this.read?.doc?.floors.find((f) => sameHomeMapId(f.id, this.floorId));
  }

  // ── saving ─────────────────────────────────────────────────────────────

  /** Save one edit. `select` is what is selected once it is saved. */
  private async run(edit: HomeMapEdit, select?: Selection | null): Promise<boolean> {
    const hass = this.hass;
    const from = this.read;
    if (!hass || from === undefined || this.saving) return false;
    this.saving = true;
    this.note = undefined;
    // A read already on the way could land the old map over this save.
    this.loadSeq++;
    const outcome = await saveHomeMapEdit(homeMapApi(hass), from, edit);
    this.saving = false;
    this.moving = undefined;
    if (outcome.ok) {
      this.show(outcome.read);
      if (outcome.merged) this.note = { kind: "warn", text: HOME_MAP_MERGED_TEXT };
      if (select !== undefined) this.selected = select ?? undefined;
      this.dropStaleSelection();
      return true;
    }
    if (outcome.read !== undefined) this.show(outcome.read);
    this.note = { kind: "err", text: outcome.text };
    return false;
  }

  // ── the plan ───────────────────────────────────────────────────────────

  /** A point on the plan, in meters, under the pointer. */
  private planPoint(svgEl: SVGSVGElement, e: PointerEvent): HomePoint | undefined {
    const ctm = svgEl.getScreenCTM();
    if (ctm === null) return undefined;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    return [p.x, p.y];
  }

  /** A press on a pin drags it (a press that hardly moves selects it); on a
   * room, selects it; anywhere else, clears the selection. The pointer is
   * captured, so the drag carries on outside the plan. */
  private onPlanDown(e: PointerEvent): void {
    if (e.button !== 0) return;
    const svgEl = e.currentTarget as SVGSVGElement;
    const target = e.target as Element | null;
    const pinEl = target?.closest("[data-pin]");
    const roomEl = target?.closest("[data-room]");
    if (pinEl === null || pinEl === undefined) {
      const roomId = roomEl?.getAttribute("data-room") ?? undefined;
      this.selected = roomId === undefined ? undefined : { kind: "room", id: roomId };
      return;
    }
    const pinId = pinEl.getAttribute("data-pin") ?? "";
    const floor = this.floor();
    const pin = floor?.pins.find((p) => sameHomeMapId(p.id, pinId));
    if (pin === undefined || this.saving) {
      this.selected = { kind: "pin", id: pinId };
      return;
    }
    e.preventDefault();
    this.endDrag?.();
    const start = this.planPoint(svgEl, e);
    if (start === undefined) return;
    const sx = e.clientX;
    const sy = e.clientY;
    let dragging = false;
    try {
      svgEl.setPointerCapture(e.pointerId);
    } catch {
      /* a synthetic press has no pointer to capture */
    }
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      if (!dragging && Math.hypot(ev.clientX - sx, ev.clientY - sy) < DRAG_SLOP) return;
      dragging = true;
      const now = this.planPoint(svgEl, ev);
      if (now === undefined) return;
      this.moving = { pinId: pin.id, at: [pin.at[0] + now[0] - start[0], pin.at[1] + now[1] - start[1]] };
    };
    const finish = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      cleanup();
      const to = this.moving;
      if (!dragging || to === undefined) {
        this.moving = undefined;
        this.selected = { kind: "pin", id: pin.id };
        return;
      }
      void this.run({ kind: "movePin", pinId: pin.id, at: to.at }, { kind: "pin", id: pin.id });
    };
    const cleanup = () => {
      svgEl.removeEventListener("pointermove", move);
      svgEl.removeEventListener("pointerup", finish);
      svgEl.removeEventListener("pointercancel", finish);
      try {
        svgEl.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      if (this.endDrag === cleanup) this.endDrag = undefined;
    };
    svgEl.addEventListener("pointermove", move);
    svgEl.addEventListener("pointerup", finish);
    svgEl.addEventListener("pointercancel", finish);
    this.endDrag = cleanup;
  }

  // ── edits ──────────────────────────────────────────────────────────────

  /** Add a pin for an entity, in the selected room when one is, else in
   * the middle of the floor, and select it. */
  addPin(entityId: string): Promise<boolean> {
    const floor = this.floor();
    if (floor === undefined || entityId === "") return Promise.resolve(false);
    const sel = this.selected;
    const room = sel?.kind === "room" ? floor.rooms.find((r) => sameHomeMapId(r.id, sel.id))
      : sel?.kind === "pin" ? (() => {
        const pin = floor.pins.find((p) => sameHomeMapId(p.id, sel.id));
        return pin === undefined ? undefined : homeMapPinRoom(floor, pin);
      })() : undefined;
    // `randomWatchId`, not `crypto.randomUUID`, which a Home Assistant
    // reached over plain http does not have.
    const pin = newHomeMapPin(floor, entityId, room, randomWatchId);
    return this.run({ kind: "addPin", floorId: floor.id, pin }, { kind: "pin", id: pin.id });
  }

  removePin(pinId: string): Promise<boolean> {
    return this.run({ kind: "removePin", pinId }, null);
  }

  renameRoom(roomId: string, name: string): Promise<boolean> {
    // Leaving the box with the name as it was saves nothing.
    const room = this.floor()?.rooms.find((r) => sameHomeMapId(r.id, roomId));
    if (room !== undefined && (room.name ?? "") === name.trim().slice(0, 100)) return Promise.resolve(true);
    return this.run({ kind: "renameRoom", roomId, name });
  }

  setRoomArea(roomId: string, areaId: string | undefined): Promise<boolean> {
    return this.run({ kind: "setRoomArea", roomId, areaId });
  }

  setRoomPage(roomId: string, pageId: string | undefined): Promise<boolean> {
    return this.run({ kind: "setRoomPage", roomId, pageId });
  }

  deleteRoom(room: HomeMapRoom, floor: HomeMapFloor): Promise<boolean> {
    if (!window.confirm(homeMapDeleteRoomQuestion(room, homeMapRoomPinCount(floor, room.id)))) return Promise.resolve(false);
    return this.run({ kind: "deleteRoom", roomId: room.id }, null);
  }

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    return html`
      <div class="hm-top">
        <p class="hm-lead">${HOME_MAP_LEAD}${betaPill()}</p>
        ${this.note ? html`<div class="hm-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="hm-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      </div>
      ${this.renderBody()}`;
  }

  private renderBody(): TemplateResult {
    if (!this.capable || this.unsupported) return this.calm(html`<b>${HOME_MAP_UPDATE_TEXT}</b>`);
    if (this.loadError !== undefined) {
      return this.calm(html`<span>Could not read the home map: ${this.loadError}</span>
        <button class="hm-btn" @click=${() => void this.load()}>Try again</button>`);
    }
    if (this.loading || this.read === undefined) return this.calm(html`Loading…`);
    const doc = this.read.doc;
    if (doc === null || doc.floors.length === 0) return this.calm(html`<b>${HOME_MAP_EMPTY_TEXT}</b>`);
    const floor = this.floor() ?? doc.floors[0]!;
    return html`<div class="hm-edit">
      <section class="hm-stage">
        ${doc.floors.length > 1 ? this.renderFloors(doc.floors, floor) : nothing}
        ${this.renderPlan(floor)}
        <div class="hm-foot">
          <span>${homeMapLightsOnWords(homeMapLightsOn(floor, this.hass?.states))}</span>
          <span>${floor.rooms.length === 1 ? "1 room" : `${floor.rooms.length} rooms`}, ${floor.pins.length === 1 ? "1 pin" : `${floor.pins.length} pins`}${this.saving ? html` · Saving…` : nothing}</span>
        </div>
      </section>
      <div class="hm-side">
        ${this.renderSelection(floor)}
        ${this.renderAdd(floor)}
      </div>
    </div>`;
  }

  private calm(body: TemplateResult): TemplateResult {
    return html`<div class="hm-calm"><div class="hm-empty">${body}</div></div>`;
  }

  private renderFloors(floors: readonly HomeMapFloor[], on: HomeMapFloor): TemplateResult {
    return html`<div class="hm-floors" role="tablist" aria-label="Floors">${floors.map((f) => html`<button type="button" role="tab"
      class="hm-floor ${f === on ? "on" : ""}" aria-selected=${f === on ? "true" : "false"}
      @click=${() => { this.floorId = f.id; this.selected = undefined; }}>${homeMapFloorName(f)}</button>`)}</div>`;
  }

  private renderPlan(floor: HomeMapFloor): TemplateResult {
    const view = homePlanViewBox(floor);
    return html`<div class="hm-plan-well">
      <svg class="hm-plan" viewBox=${homePlanViewBoxAttr(floor)} preserveAspectRatio="xMidYMid meet" role="img"
        aria-label=${`Plan of ${homeMapFloorName(floor)}`} style=${`aspect-ratio:${Math.round((view.width / view.height) * 1000) / 1000}`}
        @pointerdown=${(e: PointerEvent) => this.onPlanDown(e)}>
        ${homePlan(floor, {
          states: this.hass?.states,
          icons: this.icons,
          names: true,
          pins: "buttons",
          ...(this.selected === undefined ? {} : { selected: this.selected }),
          ...(this.moving === undefined ? {} : { moving: this.moving }),
        })}
      </svg>
    </div>`;
  }

  /** A section card's header, always open. */
  private secHead(icon: TemplateResult, title: string, summary?: string): TemplateResult {
    return html`<div class="sec-h pinned">
      <span class="swatch">${icon}</span>
      <span class="tt"><h4>${title}</h4>${summary ? html`<span class="sum">${summary}</span>` : nothing}</span>
    </div>`;
  }

  private renderSelection(floor: HomeMapFloor): TemplateResult {
    const sel = this.selected;
    if (sel?.kind === "pin") {
      const pin = floor.pins.find((p) => sameHomeMapId(p.id, sel.id));
      if (pin !== undefined) return this.renderPin(floor, pin);
    }
    if (sel?.kind === "room") {
      const room = floor.rooms.find((r) => sameHomeMapId(r.id, sel.id));
      if (room !== undefined) return this.renderRoom(floor, room);
    }
    return html`<section class="sec" style=${`--c:${SECTION_COLOR.content}`}>
      ${this.secHead(uiIcon("home"), "Rooms and pins")}
      <div class="sec-b"><p class="hint keep">Click a room to change it, or a pin to see its device. Drag a pin to move it; it saves when you let go.</p></div>
    </section>`;
  }

  private renderRoom(floor: HomeMapFloor, room: HomeMapRoom): TemplateResult {
    const areas = homeMapAreaChoices(this.hass);
    const pages = this.pages ?? [];
    const busy = this.saving;
    const area = room.areaId;
    const page = room.pageId;
    const areaKnown = area === undefined || areas.some((a) => a.id === area);
    const pageKnown = page === undefined || pages.some((p) => sameHomeMapId(p.id, page));
    return html`<section class="sec" style=${`--c:${SECTION_COLOR.content}`}>
      ${this.secHead(uiIcon("home"), homeMapRoomName(room), "Room")}
      <div class="sec-b">
        <label class="field"><span>Name</span>
          <input type="text" maxlength="100" .value=${live(room.name ?? "")} placeholder="Room" ?disabled=${busy}
            @change=${(e: Event) => void this.renameRoom(room.id, (e.target as HTMLInputElement).value)} /></label>
        <label class="field"><span>Area</span>
          <select ?disabled=${busy} @change=${(e: Event) => {
            const v = (e.target as HTMLSelectElement).value;
            void this.setRoomArea(room.id, v === "" ? undefined : v);
          }}>
            <option value="" .selected=${live(area === undefined)}>None</option>
            ${areaKnown ? nothing : html`<option value=${area!} .selected=${live(true)} disabled>Not in Home Assistant (${area})</option>`}
            ${areas.map((a) => html`<option value=${a.id} .selected=${live(a.id === area)}>${a.name}</option>`)}
          </select></label>
        <p class="hint keep">The Home Assistant area this room is. The iPhone lists its devices to place.</p>
        <label class="field"><span>Page</span>
          <select ?disabled=${busy} @change=${(e: Event) => {
            const v = (e.target as HTMLSelectElement).value;
            void this.setRoomPage(room.id, v === "" ? undefined : v);
          }}>
            <option value="" .selected=${live(page === undefined)}>None</option>
            ${pageKnown ? nothing : html`<option value=${page!} .selected=${live(true)} disabled>Not in your pages</option>`}
            ${pages.map((p) => html`<option value=${p.id} .selected=${live(sameHomeMapId(p.id, page))}>${p.name}</option>`)}
          </select></label>
        <p class="hint keep">The page a tap on this room opens on the watch.</p>
        <div class="hm-row">
          <button class="hm-btn danger" ?disabled=${busy} @click=${() => void this.deleteRoom(room, floor)}>${uiIcon("delete")}<span>Delete room</span></button>
        </div>
      </div>
    </section>`;
  }

  private renderPin(floor: HomeMapFloor, pin: HomeMapPin): TemplateResult {
    const look = homeMapPinLook(pin.entityId, this.hass?.states);
    const room = homeMapPinRoom(floor, pin);
    const state = this.hass?.states?.[pin.entityId]?.state;
    return html`<section class="sec" style=${`--c:${SECTION_COLOR.tap}`}>
      ${this.secHead(uiIcon("place"), homeMapPinName(pin, this.hass), "Pin")}
      <div class="sec-b">
        <dl class="hm-facts">
          <dt>Entity</dt><dd class="mono">${pin.entityId}</dd>
          <dt>State</dt><dd>${look.kind === "gone" ? html`<span class="hm-gone">Not in Home Assistant right now. The pin stays, drawn gray.</span>` : String(state ?? "")}</dd>
          <dt>Room</dt><dd>${room === undefined ? "None" : homeMapRoomName(room)}</dd>
          <dt>Height</dt><dd>${pin.at[2]} m</dd>
        </dl>
        <p class="hint keep">Drag the pin on the plan to move it. Its height is set on the iPhone.</p>
        <div class="hm-row">
          <button class="hm-btn danger" ?disabled=${this.saving} @click=${() => void this.removePin(pin.id)}>${uiIcon("delete")}<span>Remove pin</span></button>
        </div>
      </div>
    </section>`;
  }

  private renderAdd(floor: HomeMapFloor): TemplateResult {
    const sel = this.selected;
    const room = sel?.kind === "room" ? floor.rooms.find((r) => sameHomeMapId(r.id, sel.id)) : undefined;
    const empty: EntityRef = { entityId: "", displayName: "", domain: "" };
    const hass = this.hass;
    return html`<section class="sec" style=${`--c:${SECTION_COLOR.numbers}`}>
      ${this.secHead(uiIcon("plus"), "Add a pin")}
      <div class="sec-b">
        ${hass === undefined ? nothing : entityField({ hass }, "Entity", empty, (ref) => {
          if (ref.entityId !== "" && !this.saving) void this.addPin(ref.entityId);
        }, "home-map-add", { clearable: false })}
        <p class="hint keep">${room === undefined
          ? "The pin goes in the middle of the floor; drag it into place. Select a room first to put it there."
          : `The pin goes in the middle of ${homeMapRoomName(room)}; drag it into place.`}</p>
      </div>
    </section>`;
  }

  static override styles = [formStyles, chromeTokens, inspectorStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --hm-pad: 16px;
      padding: var(--hm-pad);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h4, p { margin: 0; }
    .hm-top { flex: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
    .hm-lead { font-size: 13px; color: var(--wa-muted); }
    .hm-note {
      display: flex; align-items: center; gap: 10px; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .hm-note > span { flex: 1; min-width: 0; }
    .hm-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .hm-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .hm-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
    .hm-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 30px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap;
    }
    .hm-btn:hover:not(:disabled) { background: var(--wa-hover); }
    .hm-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .hm-btn:disabled { opacity: .5; cursor: default; }
    .hm-btn.danger { color: var(--wa-need); }
    .hm-calm { flex: 1 1 auto; min-height: 280px; display: flex; align-items: center; justify-content: center; padding: 24px 0; }
    .hm-empty {
      display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; max-width: 520px;
      padding: 28px 24px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .hm-empty > b { font-size: 15px; }

    /* The plan on the left, the selection and the add beside it. */
    .hm-edit { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr); gap: 12px; align-items: start; }
    .hm-stage {
      display: flex; flex-direction: column; gap: 10px; min-width: 0; padding: 10px;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: ${unsafeCSS(HOME_PLAN_COLORS.ground)};
    }
    .hm-floors { display: flex; flex-wrap: wrap; gap: 6px; }
    button.hm-floor {
      height: 28px; padding: 0 12px; border-radius: 6px; cursor: pointer; font: inherit; font-size: 13px; font-weight: 500;
      color: rgba(255, 255, 255, .7); background: transparent; border: 1px solid rgba(255, 255, 255, .22);
    }
    button.hm-floor.on { color: #fff; font-weight: 600; background: rgba(255, 255, 255, .12); }
    .hm-plan-well { display: flex; justify-content: center; min-width: 0; }
    svg.hm-plan { display: block; width: 100%; max-height: min(66vh, 680px); touch-action: none; user-select: none; }
    svg.hm-plan .hm-room { cursor: pointer; }
    svg.hm-plan .hm-pin { cursor: grab; }
    svg.hm-plan .hm-pin:active { cursor: grabbing; }
    svg.hm-plan text { font-family: inherit; font-weight: 600; }
    .hm-foot { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; font-size: 12.5px; color: rgba(255, 255, 255, .72); padding: 0 4px; }
    .hm-side { display: flex; flex-direction: column; min-width: 0; }
    .hm-side .sec { margin: 0 0 12px; }
    .hm-side .sec-b { display: flex; flex-direction: column; gap: 8px; }
    .hm-side .sec-b > .hint { margin: 0; font-size: 12.5px; color: var(--wa-muted); }
    .hm-row { display: flex; flex-wrap: wrap; gap: 8px; }
    dl.hm-facts { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 4px 12px; margin: 0; font-size: 13px; }
    dl.hm-facts dt { color: var(--wa-muted); }
    dl.hm-facts dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
    .hm-gone { color: var(--wa-need); }
    .mono { font-family: var(--wa-mono, ui-monospace, monospace); font-size: 12.5px; }

    @container (max-width: 820px) {
      .hm-edit { grid-template-columns: minmax(0, 1fr); }
    }
    :host([narrow]) { --hm-pad: 12px; }
  `];
}

if (!customElements.get("wa-home-map-editor")) {
  customElements.define("wa-home-map-editor", WaHomeMapEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-home-map-editor": WaHomeMapEditor;
  }
}
