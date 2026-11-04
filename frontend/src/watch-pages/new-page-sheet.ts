// New page on the Pages tab: one sheet. A name, a tick per device (ticked as
// the last new page was), and where it starts: Empty (the default), From a
// room, From a page, or the home's map (an ALPHA, as before). From a room
// lists a Home Assistant area's entities with a tick each: the controls a
// page is for tapping (lights, switches and plugs, fans, covers, locks,
// climate, media players, scenes, scripts) start ticked, and everything else
// sits under "More in this room", unticked, so a room with thirty sensors
// still makes a short page. From a page copies a page's tiles and both its
// screens under new ids.
//
// The page is made in the library (`library/item/create`), then put on each
// ticked device, then opened in the editor. The tab holds the form and draws
// the sheet from its own render, as it drew the New dialog; the sheet keeps
// that dialog's look (`newItemDialogStyles`).
// Spec: integration repo docs/ux-review-2026-10-31/pages-design-v4.md,
// "Pages list", New page and From a room.

import { type TemplateResult, css, html, nothing } from "lit";
import { live } from "lit/directives/live.js";
import type { HassLike } from "../ha-api.js";
import { betaPill } from "../editors.js";
import { homeMapEntityAreaId } from "../home-map/devices-model.js";
import { sameId } from "../library/model.js";
import { type UiIconName, uiIcon } from "../ui-icons.js";
import type { LinkDevice } from "./devices.js";
import { newWatchPage, watchPageCopy } from "./edit.js";
import { newMapWatchPage } from "./map-page.js";
import { type WatchPage, type WatchPagesDocument, watchPageId, watchPageName } from "./model.js";
import type { WatchPagesNote } from "./save-note.js";
import { type WatchHassView, addNewWatchTile, watchEntityAddFromHass } from "./tile-new.js";

/** Where a new page starts. */
export type NewPageStart = "empty" | "room" | "page" | "map";

/** What the sheet holds while it is open. The tab owns it. */
export interface NewPageForm {
  name: string;
  busy: boolean;
  note?: WatchPagesNote;
  /** The devices ticked to show it. */
  owners: readonly string[];
  /** The line beside them that says why those are ticked. None when nothing
   * true needs saying. */
  ticksHint?: string;
  start: NewPageStart;
  /** From a room: the Home Assistant area. */
  areaId?: string;
  /** From a room: the entities ticked, or undefined while none was clicked,
   * which is the room's controls. */
  picked?: readonly string[];
  /** From a page: the library page it copies. */
  fromPage?: string;
}

/** The selector the tab opens the sheet by (`openNewPageSheet`). */
export const NEW_PAGE_SHEET = "dialog.lib-new-page";

/** The domains a room page starts ticked: the things a page is for
 * tapping. */
export const ROOM_CONTROL_DOMAINS: ReadonlySet<string> = new Set([
  "light", "switch", "input_boolean", "fan", "cover", "lock", "climate", "media_player", "scene", "script",
]);

/** One entity of a room. */
export interface RoomEntity {
  entityId: string;
  name: string;
}

/** A room's entities: the controls first, then the rest. */
export interface RoomEntities {
  controls: RoomEntity[];
  more: RoomEntity[];
}

/** The rooms a page can start from: the areas that hold an entity Home
 * Assistant shows, by name. */
export function roomAreas(hass: Pick<HassLike, "states" | "entities" | "devices" | "areas"> | undefined): { id: string; name: string }[] {
  const used = new Set<string>();
  for (const entityId of Object.keys(hass?.states ?? {})) {
    if (!shown(hass, entityId)) continue;
    const area = homeMapEntityAreaId(hass, entityId);
    if (area !== undefined) used.add(area);
  }
  return Object.entries(hass?.areas ?? {})
    .filter(([id]) => used.has(id))
    .map(([id, a]) => ({ id, name: typeof a?.name === "string" && a.name.trim() !== "" ? a.name.trim() : id }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Whether an entity is one a person sees: not hidden, not a config or
 * diagnostic entity. */
function shown(hass: Pick<HassLike, "entities"> | undefined, entityId: string): boolean {
  const reg = hass?.entities?.[entityId];
  return reg?.hidden !== true && (reg?.entity_category ?? null) === null;
}

/** A room's entities, each list by name. */
export function roomEntities(hass: Pick<HassLike, "states" | "entities" | "devices"> | undefined, areaId: string | undefined): RoomEntities {
  const out: RoomEntities = { controls: [], more: [] };
  if (areaId === undefined) return out;
  for (const [entityId, entity] of Object.entries(hass?.states ?? {})) {
    if (!shown(hass, entityId) || homeMapEntityAreaId(hass, entityId) !== areaId) continue;
    const friendly = entity?.attributes?.friendly_name;
    const name = typeof friendly === "string" && friendly.trim() !== "" ? friendly.trim() : entityId;
    const domain = entityId.slice(0, entityId.indexOf("."));
    (ROOM_CONTROL_DOMAINS.has(domain) ? out.controls : out.more).push({ entityId, name });
  }
  const byName = (a: RoomEntity, b: RoomEntity) => a.name.localeCompare(b.name) || a.entityId.localeCompare(b.entityId);
  out.controls.sort(byName);
  out.more.sort(byName);
  return out;
}

/** The entities a room page is made of, in the order the sheet lists them. */
export function roomPicked(form: Pick<NewPageForm, "picked">, room: RoomEntities): string[] {
  const all = [...room.controls, ...room.more].map((e) => e.entityId);
  if (form.picked === undefined) return room.controls.map((e) => e.entityId);
  return all.filter((id) => form.picked!.includes(id));
}

/** The form after a click on a room's entity. */
export function tickRoomEntity(form: NewPageForm, room: RoomEntities, entityId: string, on: boolean): NewPageForm {
  const now = roomPicked(form, room);
  const picked = on ? [...now.filter((id) => id !== entityId), entityId] : now.filter((id) => id !== entityId);
  const { note: _note, ...rest } = form;
  return { ...rest, picked };
}

// ── the devices, as the last new page ─────────────────────────────────────

/** Where this browser remembers the devices the last new page went on. */
export const NEW_PAGE_DEVICES_KEY = "wa-new-page-devices";

/** The last new page's devices while the panel is open, for a browser with
 * storage off. */
let keptHere: string[] | undefined;

/** The devices the last new page went on, by owner id; undefined before
 * the first. */
export function lastNewPageDevices(storage?: Pick<Storage, "getItem">): string[] | undefined {
  try {
    const raw = (storage ?? globalThis.localStorage)?.getItem(NEW_PAGE_DEVICES_KEY);
    const ids = raw ? (JSON.parse(raw) as unknown) : undefined;
    if (Array.isArray(ids)) return ids.filter((id): id is string => typeof id === "string");
  } catch {
    /* Storage off: what this panel kept. */
  }
  return keptHere === undefined ? undefined : [...keptHere];
}

/** Remember the devices a new page went on. */
export function keepNewPageDevices(ids: readonly string[], storage?: Pick<Storage, "setItem">): void {
  keptHere = [...ids];
  try {
    (storage ?? globalThis.localStorage)?.setItem(NEW_PAGE_DEVICES_KEY, JSON.stringify(ids));
  } catch {
    /* Storage off: kept while the panel is open. */
  }
}

/** For tests: forget the devices kept with storage off. */
export function resetNewPageDevicesForTest(): void {
  keptHere = undefined;
}

/** The devices a new sheet starts ticked: the last new page's that are
 * still here, or with none before it every device that can take a page. */
export function newPageOwners(devices: readonly LinkDevice[], kept: readonly string[] | undefined, locked?: (ownerId: string) => boolean): string[] {
  const free = devices.filter((d) => locked?.(d.ownerId) !== true);
  if (kept === undefined) return free.map((d) => d.ownerId);
  return free.filter((d) => kept.some((k) => sameId(k, d.ownerId))).map((d) => d.ownerId);
}

/** The hint when the ticks did follow the last new page. */
export const NEW_PAGE_LAST_HINT = "Ticked like your last new page.";

/** The hint on What next's form, which ticks the watch just paired. */
export const NEW_PAGE_PAIRED_HINT = "Ticked for the watch you just paired.";

/** A new form: the name, the devices to start ticked and what to say of them,
 * Empty. */
export function newPageForm(name: string, owners: readonly string[], ticksHint?: string): NewPageForm {
  return { name, busy: false, owners, start: "empty", ...(ticksHint === undefined ? {} : { ticksHint }) };
}

/** The form with a device ticked or unticked, in device order. */
export function tickNewPageDevice(form: NewPageForm, devices: readonly LinkDevice[], ownerId: string, on: boolean): NewPageForm {
  const owners = on
    ? devices.filter((d) => sameId(d.ownerId, ownerId) || form.owners.some((o) => sameId(o, d.ownerId))).map((d) => d.ownerId)
    : form.owners.filter((o) => !sameId(o, ownerId));
  return { ...form, owners };
}

// ── making it ─────────────────────────────────────────────────────────────

/** What the sheet reads to make a page. */
export interface NewPageContext {
  hass?: Pick<HassLike, "states" | "entities" | "devices" | "areas">;
  /** The library's pages, for From a page. */
  pages: readonly WatchPage[];
  /** The home map's first floor with a room, for a map page; undefined
   * while the home has none. */
  mapFloorId?: string;
  /** Why a map page cannot be made, when it cannot. */
  mapRefusal?: string;
}

/** Why Create cannot run now, or undefined. */
export function newPageRefusal(form: NewPageForm, ctx: NewPageContext): string | undefined {
  if (form.name.trim() === "") return "Type a name to start.";
  if (form.start === "room") {
    if (form.areaId === undefined) return "Pick a room.";
    if (roomPicked(form, roomEntities(ctx.hass, form.areaId)).length === 0) return "Tick something in the room.";
  }
  if (form.start === "page" && (form.fromPage === undefined || !ctx.pages.some((p) => sameId(watchPageId(p), form.fromPage!)))) return "Pick a page to start from.";
  if (form.start === "map" && ctx.mapFloorId === undefined) return ctx.mapRefusal ?? "Scan a room in the iPhone app first.";
  return undefined;
}

/** The new page's document, holding the one page under `id`. Undefined when
 * the form is refused (`newPageRefusal`). */
export function newPageDocument(form: NewPageForm, ctx: NewPageContext, id: string): WatchPagesDocument | undefined {
  if (newPageRefusal(form, ctx) !== undefined) return undefined;
  const name = form.name.trim();
  const pageId = id.toUpperCase();
  if (form.start === "map") return { schemaVersion: 1, pages: [newMapWatchPage(pageId, name, ctx.mapFloorId!)] };
  if (form.start === "page") {
    const from = ctx.pages.find((p) => sameId(watchPageId(p), form.fromPage!))!;
    return { schemaVersion: 1, pages: [watchPageCopy(from, pageId, name)] };
  }
  let document: WatchPagesDocument = { schemaVersion: 1, pages: [newWatchPage(pageId, name)] };
  if (form.start !== "room") return document;
  const view: WatchHassView = { states: ctx.hass?.states ?? {}, ...(ctx.hass?.entities === undefined ? {} : { entities: ctx.hass.entities }) };
  for (const entityId of roomPicked(form, roomEntities(ctx.hass, form.areaId))) {
    document = addNewWatchTile(document, pageId, { kind: "entity", ...watchEntityAddFromHass(view, entityId) }, { last: true }).document;
  }
  return document;
}

/** The footer's one line: what is missing, or what Create makes and where. */
export function newPageSummary(form: NewPageForm, ctx: NewPageContext, devices: readonly LinkDevice[]): string {
  const refusal = newPageRefusal(form, ctx);
  if (refusal !== undefined) return refusal;
  const name = form.name.trim();
  const on = devices.filter((d) => form.owners.some((o) => sameId(o, d.ownerId)));
  const where = on.length === 0 ? "on no device yet. Tick a device any time." : on.length === 1 ? `on ${on[0]!.name}.` : `on ${on.length} devices.`;
  if (form.start === "room") {
    const n = roomPicked(form, roomEntities(ctx.hass, form.areaId)).length;
    return `${name}, ${n} ${n === 1 ? "tile" : "tiles"}, ${where}`;
  }
  return `${name}, ${form.start === "map" ? "a map page" : "a page"} ${where}`;
}

// ── drawing ───────────────────────────────────────────────────────────────

export interface NewPageSheetHandlers {
  onName: (name: string) => void;
  onDevice: (ownerId: string, on: boolean) => void;
  onStart: (start: NewPageStart) => void;
  onArea: (areaId: string) => void;
  onEntity: (entityId: string, on: boolean) => void;
  onFromPage: (pageId: string) => void;
  onMake: () => void;
  onClose: () => void;
}

/** What the sheet draws beside the form. */
export interface NewPageSheetInput extends NewPageContext {
  devices: readonly LinkDevice[];
  /** Why a device cannot take a page now (a watch waiting for its
   * iPhone's move), or undefined. */
  locked?: (ownerId: string) => string | undefined;
  /** What goes under the devices: the way out of a watch's wait. */
  waitOuts?: TemplateResult | typeof nothing;
}

const START_TITLES: Record<NewPageStart, string> = { empty: "Empty", room: "From a room", page: "From a page", map: "Home map" };

function startNote(start: NewPageStart, mapRefusal: string | undefined): string {
  switch (start) {
    case "empty": return "Add tiles yourself.";
    case "room": return "A tile for each thing in a room you tick.";
    case "page": return "A copy of a page's tiles, to change on its own.";
    case "map": return mapRefusal ?? "On the iPhone the whole page is your home's live map. The watch shows it as one tile.";
  }
}

function startIcon(start: NewPageStart): UiIconName {
  return start === "room" ? "home" : start === "page" ? "duplicate" : start === "map" ? "place" : "grid";
}

function checkRow(on: boolean, name: string, disabled: boolean, onChange: (on: boolean) => void, title?: string): TemplateResult {
  return html`<label class="np-check" title=${title ?? nothing}>
    <input type="checkbox" .checked=${live(on)} ?disabled=${disabled} @change=${(e: Event) => onChange((e.target as HTMLInputElement).checked)} />
    <span>${name}</span>
  </label>`;
}

function renderDevices(form: NewPageForm, input: NewPageSheetInput, h: NewPageSheetHandlers): TemplateResult {
  const group = (kind: LinkDevice["kind"], title: string) => {
    const list = input.devices.filter((d) => d.kind === kind);
    if (list.length === 0) return nothing;
    return html`<div class="np-group" role="group" aria-label=${title}>
      <span class="np-kind">${uiIcon(kind === "iphone" ? "phone" : "watch")}<span>${title}</span></span>
      ${list.map((d) => {
        const locked = input.locked?.(d.ownerId);
        return checkRow(form.owners.some((o) => sameId(o, d.ownerId)), d.name, form.busy || locked !== undefined, (on) => h.onDevice(d.ownerId, on), locked);
      })}
    </div>`;
  };
  return html`<div class="np-devices">${group("watch", "Watches")}${group("iphone", "iPhones")}</div>`;
}

function renderRoom(form: NewPageForm, input: NewPageSheetInput, h: NewPageSheetHandlers): TemplateResult {
  const areas = roomAreas(input.hass);
  if (areas.length === 0) return html`<p class="np-none">No room in Home Assistant has anything in it yet. Give your devices an area there first.</p>`;
  const room = roomEntities(input.hass, form.areaId);
  const picked = new Set(roomPicked(form, room));
  const list = (entities: readonly RoomEntity[]) => entities.map((e) => checkRow(picked.has(e.entityId), e.name, form.busy, (on) => h.onEntity(e.entityId, on), e.entityId));
  return html`<label class="np-area"><span>Room</span>
      <select ?disabled=${form.busy} @change=${(e: Event) => h.onArea((e.target as HTMLSelectElement).value)}>
        <option value="" ?selected=${form.areaId === undefined} disabled>Pick a room</option>
        ${areas.map((a) => html`<option value=${a.id} ?selected=${a.id === form.areaId}>${a.name}</option>`)}
      </select></label>
    ${form.areaId === undefined ? nothing : html`<div class="np-room">
      ${room.controls.length === 0 ? html`<p class="np-none">Nothing to tap in this room.</p>` : list(room.controls)}
      ${room.more.length === 0 ? nothing : html`<p class="np-more">More in this room</p>${list(room.more)}`}
    </div>`}`;
}

function renderFromPage(form: NewPageForm, input: NewPageSheetInput, h: NewPageSheetHandlers): TemplateResult {
  if (input.pages.length === 0) return html`<p class="np-none">Your home has no page to start from yet.</p>`;
  return html`<label class="np-area"><span>Page</span>
    <select ?disabled=${form.busy} @change=${(e: Event) => h.onFromPage((e.target as HTMLSelectElement).value)}>
      <option value="" ?selected=${form.fromPage === undefined} disabled>Pick a page</option>
      ${input.pages.map((p) => html`<option value=${watchPageId(p)} ?selected=${form.fromPage !== undefined && sameId(form.fromPage, watchPageId(p))}>${watchPageName(p)}</option>`)}
    </select></label>`;
}

/** The sheet. Rendered only while the tab holds a form; the tab calls
 * `openNewPageSheet` once it is in the tree. */
export function renderNewPageSheet(form: NewPageForm, input: NewPageSheetInput, h: NewPageSheetHandlers): TemplateResult {
  const refusal = newPageRefusal(form, input);
  const starts: NewPageStart[] = ["empty", "room", "page", "map"];
  return html`<dialog class="new-dialog lib-new lib-new-page" aria-label="New page" @close=${() => h.onClose()}
    @cancel=${(e: Event) => { e.preventDefault(); if (!form.busy) h.onClose(); }}>
    <form class="lib-new-form" @submit=${(e: Event) => { e.preventDefault(); if (refusal === undefined && !form.busy) h.onMake(); }}>
      <div class="new-head">
        <h2>New page</h2>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Cancel" aria-label="Cancel" ?disabled=${form.busy} @click=${() => h.onClose()}>${uiIcon("close")}</button>
      </div>
      <div class="new-body">
        <section class="new-step step-name">
          <div class="new-step-head"><span class="new-step-title">Name</span></div>
          <input type="text" class="new-name" .value=${live(form.name)} maxlength="80" autofocus aria-label="New page name"
            ?disabled=${form.busy} @input=${(e: Event) => h.onName((e.target as HTMLInputElement).value)} />
        </section>
        ${input.devices.length === 0 ? nothing : html`<section class="new-step np-step">
          <div class="new-step-head"><span class="new-step-title">Show on</span>${form.ticksHint === undefined ? nothing : html`<span class="new-step-hint">${form.ticksHint}</span>`}</div>
          ${renderDevices(form, input, h)}
          ${input.waitOuts ?? nothing}
        </section>`}
        <section class="new-step np-step">
          <div class="new-step-head"><span class="new-step-title">Start</span></div>
          <div class="np-starts" role="radiogroup" aria-label="Start">
            ${starts.map((start) => {
              const on = form.start === start;
              const off = start === "map" && input.mapFloorId === undefined;
              return html`<button type="button" class="np-start ${on ? "on" : ""}" role="radio" aria-checked=${on ? "true" : "false"}
                data-start=${start} ?disabled=${form.busy || off} title=${startNote(start, input.mapRefusal)} @click=${() => h.onStart(start)}>
                ${uiIcon(startIcon(start))}<span class="np-start-t">${START_TITLES[start]}${start === "map" ? betaPill("ALPHA") : nothing}</span>
                <span class="np-start-n">${startNote(start, start === "map" ? input.mapRefusal : undefined)}</span>
              </button>`;
            })}
          </div>
          ${form.start === "room" ? renderRoom(form, input, h) : form.start === "page" ? renderFromPage(form, input, h) : nothing}
        </section>
        ${form.note === undefined ? nothing : html`<p class="lt-line ${form.note.kind}" role="status">${form.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${newPageSummary(form, input, input.devices)}</span>
        <button type="button" class="lib-new-btn" ?disabled=${form.busy} @click=${() => h.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary" ?disabled=${refusal !== undefined || form.busy} title=${refusal ?? "Make the page"}>${form.busy ? "Making…" : "Create"}</button>
      </div>
    </form>
  </dialog>`;
}

/** Show the sheet as a modal once it is in the tree, the name selected. */
export function openNewPageSheet(root: { querySelector?: (s: string) => Element | null } | undefined): void {
  const dialog = root?.querySelector?.(NEW_PAGE_SHEET) as HTMLDialogElement | null | undefined;
  if (!dialog) return;
  if (!dialog.open && typeof dialog.showModal === "function") dialog.showModal();
  dialog.querySelector<HTMLInputElement>("input.new-name")?.select();
}

/** The sheet's own look, on top of the New dialog's. */
export const newPageSheetStyles = css`
  .lib-new .new-step.np-step { background: none; }
  .np-devices { display: flex; flex-wrap: wrap; gap: 6px 24px; }
  .np-group { display: flex; flex-direction: column; gap: 3px; min-width: 160px; }
  .np-kind { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .np-kind svg { width: 13px; height: 13px; }
  .np-check { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 2px 0 2px 2px; cursor: pointer; }
  .np-check input { margin: 0; accent-color: var(--wa-accent); }
  .np-starts { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 6px; }
  .np-start {
    display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding: 8px 9px; text-align: left; cursor: pointer;
    font: inherit; border-radius: 9px; border: 1px solid var(--wa-line); background: var(--wa-raised, var(--wa-card)); color: var(--wa-muted);
  }
  .np-start svg { width: 18px; height: 18px; }
  .np-start:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
  .np-start:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .np-start.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); box-shadow: 0 0 0 2px var(--wa-sel-ring); color: var(--wa-ink); }
  .np-start:disabled { opacity: .5; cursor: default; }
  .np-start-t { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
  .np-start-n { font-size: 10.5px; line-height: 1.3; }
  .np-area { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--wa-muted); }
  .np-area select {
    flex: 1; min-width: 0; height: 30px; padding: 0 8px; border-radius: 7px; border: 1px solid var(--wa-line-strong);
    font: inherit; font-size: 13px; color: var(--wa-ink); background: var(--wa-input, var(--wa-field));
  }
  .np-room { display: flex; flex-direction: column; gap: 1px; max-height: 240px; overflow-y: auto; padding-right: 4px; }
  .np-more { margin: 8px 0 2px; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .np-none { margin: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
`;
