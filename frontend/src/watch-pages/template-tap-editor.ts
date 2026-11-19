// Tap areas on the template editor's picture (`templateTaps`). While Edit
// areas is on, the areas are drawn over the tile face as numbered boxes that
// take every press there: a box drags, its corner resizes it, and a drag on
// empty space draws a new one. The item layout's dragging is off meanwhile,
// so the two never fight over one press. The areas are never drawn in the
// page previews. Positions are fractions of the tile's drawn face, the
// `.wp-tpl` box, which sits inside the grid's cell inset.
//
// The rule and the small edits are in `template-taps.ts`; the contract is
// "Tap areas (2026-11-18)" in the app repo's `docs/template_tile_links_2026-11.md`.

import { html, nothing, type TemplateResult } from "lit";
import { entityField, entityRefFrom } from "../editors.js";
import type { TemplateEditorData } from "./template-editor.js";
import {
  type TemplateTapAction,
  type TemplateTapArea,
  TEMPLATE_TAPS,
  isTemplateTapData,
  movedTemplateTapArea,
  newTemplateTapArea,
  resizedTemplateTapArea,
  spannedTemplateTapArea,
  templateTapField,
  withTemplateTapAction,
  withTemplateTapConfirm,
  withTemplateTapServiceExtras,
} from "./template-taps.js";

interface TapHost {
  data(): TemplateEditorData;
  element: HTMLElement;
  update(): void;
  /** Resolves once the editor has drawn its pending update. */
  drawn(): Promise<unknown>;
}

interface Point { x: number; y: number }
interface TapDrag {
  tile: string;
  kind: "move" | "size" | "draw";
  index: number;
  pointer: number;
  frame: DOMRect;
  start: Point;
  startX: number;
  startY: number;
  before: TemplateTapArea[];
  moved: boolean;
}

/** The place a new Open in Maps area gets: the home zone, which has a
 * latitude, a longitude and a name. */
const FIRST_PLACE = "zone.home";
const FIRST_URL = "https://";
/** The service a new Call service area gets: it toggles the entity the area
 * held, if any. */
const FIRST_SERVICE = "homeassistant.toggle";

/** The Action menu's groups, in order. Each action is in one. */
const ACTION_GROUPS: readonly (readonly [string, readonly TemplateTapAction[]])[] = [
  ["Home Assistant", ["toggle", "control", "script", "scene", "service", "http"]],
  ["Open", ["page", "maps", "link"]],
  ["Tile", ["refresh"]],
];

/** Where Toggle and Open controls look first for a start entity. */
const TOGGLE_FIRST = ["light", "switch", "fan", "input_boolean"] as const;
const CONTROL_FIRST = ["light", "climate", "cover", "fan", "media_player"] as const;

export class TemplateTapEditor {
  private tile: string | undefined;
  /** Edit areas is on: the areas are drawn and take presses on the face. */
  editing = false;
  private picked: number | undefined;
  private working: TemplateTapArea[] | undefined;
  private drag: TapDrag | undefined;
  private face: { left: number; top: number; width: number; height: number } | undefined;
  /** The Data (JSON) box's text while it does not match the stored data: as
   * typed, for one area, with its parse error if it has one. */
  private dataDraft: { tile: string; index: number; text: string; error: string | undefined } | undefined;

  constructor(private readonly host: TapHost) {}

  private data(): TemplateEditorData {
    const data = this.host.data();
    if (data.tileId !== this.tile) {
      this.dispose();
      this.tile = data.tileId;
      this.editing = false;
      this.picked = undefined;
      this.working = undefined;
      this.dataDraft = undefined;
    }
    return data;
  }

  private areas(): TemplateTapArea[] {
    return this.working ?? this.data().taps.areas;
  }

  /** The picked area's number, kept to the list. */
  private pickedIndex(): number | undefined {
    const n = this.picked;
    return n !== undefined && n < this.areas().length ? n : undefined;
  }

  private write(areas: TemplateTapArea[], typing = false): void {
    this.data().setTaps(areas, typing);
    this.host.update();
  }

  private replace(index: number, area: TemplateTapArea, typing = false): void {
    const areas = this.areas().slice();
    if (index >= areas.length) return;
    areas[index] = area;
    this.write(areas, typing);
  }

  /** Turns Edit areas on or off. Off picks no area. */
  setEditing(on: boolean): void {
    this.data();
    this.editing = on;
    if (!on) { this.picked = undefined; this.cancel(); }
    this.host.update();
  }

  private pick(index: number | undefined): void {
    this.editing = true;
    this.picked = index;
    this.dataDraft = undefined;
    this.host.update();
  }

  private add(): void {
    const areas = this.areas();
    if (areas.length >= TEMPLATE_TAPS.max || this.data().busy) return;
    this.data().ended();
    this.write([...areas, newTemplateTapArea()]);
    this.data().ended();
    this.pick(areas.length);
  }

  private remove(index: number): void {
    this.data().ended();
    this.write(this.areas().filter((_, i) => i !== index));
    this.data().ended();
    this.picked = undefined;
    this.dataDraft = undefined;
    this.host.update();
  }

  // ── pointer ────────────────────────────────────────────────────────────

  private point(event: PointerEvent, frame: DOMRect): Point {
    return {
      x: Math.min(1, Math.max(0, (event.clientX - frame.left) / frame.width)),
      y: Math.min(1, Math.max(0, (event.clientY - frame.top) / frame.height)),
    };
  }

  private start(event: PointerEvent): void {
    event.stopPropagation();
    const data = this.data();
    if (event.button !== 0 || data.busy || this.drag !== undefined) return;
    const layer = event.currentTarget as HTMLElement;
    const frame = layer.getBoundingClientRect();
    if (!(frame.width > 0 && frame.height > 0)) return;
    event.preventDefault();
    layer.closest<HTMLElement>(".te-tile")?.focus({ preventScroll: true });
    const target = (event.target as Element).closest<HTMLElement>("[data-tap]");
    const before = this.areas().slice();
    const base = { tile: data.tileId, pointer: event.pointerId, frame, startX: event.clientX, startY: event.clientY, before, moved: false };
    if (target !== null) {
      const index = Number(target.dataset["tap"]);
      const kind = (event.target as Element).closest("[data-tap-size]") !== null ? "size" : "move";
      this.drag = { ...base, kind, index, start: this.point(event, frame) };
      this.picked = index;
    } else {
      // A drag on empty space draws a new area while there is room for one;
      // a press that does not move picks nothing.
      this.drag = { ...base, kind: "draw", index: before.length, start: this.point(event, frame) };
    }
    this.host.update();
    window.addEventListener("pointermove", this.move);
    window.addEventListener("pointerup", this.end);
    window.addEventListener("pointercancel", this.cancelled);
    window.addEventListener("keydown", this.escape, true);
  }

  private readonly move = (event: PointerEvent): void => {
    const drag = this.drag;
    if (drag === undefined || event.pointerId !== drag.pointer || drag.tile !== this.data().tileId) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 4) return;
    event.preventDefault();
    const at = this.point(event, drag.frame);
    const dx = at.x - drag.start.x, dy = at.y - drag.start.y;
    const areas = drag.before.slice();
    if (drag.kind === "draw") {
      if (areas.length >= TEMPLATE_TAPS.max) return;
      areas.push(spannedTemplateTapArea(drag.start, at));
      this.picked = drag.index;
    } else {
      const area = drag.before[drag.index];
      if (area === undefined) return;
      areas[drag.index] = drag.kind === "move"
        ? movedTemplateTapArea(area, area.x + dx, area.y + dy)
        : resizedTemplateTapArea(area, area.x + area.w + dx, area.y + area.h + dy);
    }
    drag.moved = true;
    this.working = areas;
    this.write(areas, true);
  };

  private stopListeners(): void {
    window.removeEventListener("pointermove", this.move);
    window.removeEventListener("pointerup", this.end);
    window.removeEventListener("pointercancel", this.cancelled);
    window.removeEventListener("keydown", this.escape, true);
  }

  private readonly end = (event: PointerEvent): void => {
    const drag = this.drag;
    if (drag === undefined || event.pointerId !== drag.pointer) return;
    this.stopListeners();
    this.drag = undefined;
    this.working = undefined;
    if (drag.kind === "draw" && !drag.moved) this.picked = undefined;
    if (drag.moved) this.data().ended();
    this.host.update();
  };

  private readonly cancelled = (event: PointerEvent): void => {
    if (this.drag !== undefined && event.pointerId === this.drag.pointer) this.cancel();
  };

  /** Puts the areas back as they were before the drag. */
  private cancel(): void {
    const drag = this.drag;
    this.stopListeners();
    this.drag = undefined;
    this.working = undefined;
    if (drag === undefined) return;
    if (drag.moved) { this.write(drag.before, true); this.data().ended(); }
    if (drag.kind === "draw") this.picked = undefined;
    this.host.update();
  }

  private readonly escape = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    this.cancel();
  };

  dispose(): void {
    this.stopListeners();
    this.drag = undefined;
    this.working = undefined;
  }

  /** The tile's keys while Edit areas is on: arrows move the picked area,
   * Shift for bigger steps, and Delete removes it. True when it took the key. */
  key(event: KeyboardEvent): boolean {
    if (!this.editing) return false;
    const index = this.pickedIndex();
    if (index === undefined || this.data().busy) return true;
    const area = this.areas()[index]!;
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      this.remove(index);
      return true;
    }
    const moves: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const step = moves[event.key];
    if (step === undefined) return true;
    event.preventDefault();
    const by = event.shiftKey ? 0.05 : 0.01;
    this.replace(index, movedTemplateTapArea(area, area.x + step[0] * by, area.y + step[1] * by));
    return true;
  }

  // ── drawing ────────────────────────────────────────────────────────────

  /** Measures the face inside the tile picture, so the layer can sit on it.
   * Runs after each draw; draws again only when the face moved. */
  refresh(): void {
    const root = this.host.element.querySelector<HTMLElement>(".te-tile");
    const face = root?.querySelector<HTMLElement>(".wp-tpl");
    if (root === null || root === undefined || face === null || face === undefined) {
      if (this.face !== undefined) { this.face = undefined; this.host.update(); }
      return;
    }
    const outer = root.getBoundingClientRect(), box = face.getBoundingClientRect();
    const next = { left: box.left - outer.left, top: box.top - outer.top, width: box.width, height: box.height };
    const was = this.face;
    const same = was !== undefined && (["left", "top", "width", "height"] as const).every((k) => Math.abs(was[k] - next[k]) < 0.5);
    if (same) return;
    this.face = next;
    if (this.editing) this.host.update();
  }

  /** The layer over the face, while Edit areas is on. */
  overlay(): TemplateResult | typeof nothing {
    this.data();
    const face = this.face;
    if (!this.editing || face === undefined) return nothing;
    const picked = this.pickedIndex();
    const pct = (n: number) => `${Math.round(n * 100000) / 1000}%`;
    return html`<div class="te-taps-layer" style=${`left:${face.left}px;top:${face.top}px;width:${face.width}px;height:${face.height}px`}
      @pointerdown=${(e: PointerEvent) => this.start(e)} @click=${(e: MouseEvent) => e.stopPropagation()}>
      ${this.areas().map((a, i) => html`<div class="te-tap ${i === picked ? "on" : ""}" data-tap=${i}
        style=${`left:${pct(a.x)};top:${pct(a.y)};width:${pct(a.w)};height:${pct(a.h)}`}>
        <span class="te-tap-n">${i + 1}</span><span class="te-tap-size" data-tap-size aria-hidden="true"></span></div>`)}
    </div>`;
  }

  private actionWords(action: TemplateTapAction): string {
    return this.data().taps.words.actionLabels[action];
  }

  /** What an area opens or runs, in a few words, for its row in the list:
   * the entity's name, the page's name, the place, the URL or the service. */
  private areaDetail(area: TemplateTapArea): string {
    const d = this.data();
    switch (area.action) {
      case "page": return d.taps.pages.find((p) => p.id === area.page)?.name ?? "Missing page";
      case "http": return d.taps.httpActions.find((a) => a.id.toUpperCase() === area.http?.toUpperCase())?.name ?? "Missing action";
      case "maps": return area.place ?? "";
      case "link": return area.url ?? "";
      case "service": return area.service ?? "";
      case "refresh": return "";
      default: {
        if (area.entity === undefined) return "";
        const name = d.hass.states[area.entity]?.attributes?.["friendly_name"];
        return typeof name === "string" && name.trim() !== "" ? name : area.entity;
      }
    }
  }

  /** The Tap areas section under the code: its heading with Edit areas, the
   * areas as a numbered list with Add tap area at its foot, and beside the
   * list (under it when narrow) the picked area's settings. */
  section(): TemplateResult {
    const d = this.data(), words = d.taps.words;
    const areas = this.areas();
    const picked = this.pickedIndex();
    const full = areas.length >= TEMPLATE_TAPS.max;
    const editing = this.editing && areas.length > 0;
    const form = this.inspector();
    return html`<section class="te-taps" aria-label=${words.label}>
      <div class="te-taps-h"><span><b>${words.label}</b><small>${editing ? "Drag a box to move it, or its corner to resize it. Drag empty space to draw a new one." : words.help}</small></span>
        ${areas.length === 0 ? nothing : html`<button type="button" class="te-chip ${this.editing ? "on" : ""}" aria-pressed=${this.editing ? "true" : "false"} ?disabled=${d.busy}
          @click=${() => this.setEditing(!this.editing)}>${this.editing ? "Done" : "Edit areas"}</button>`}</div>
      <div class="te-taps-body ${areas.length === 0 ? "empty" : ""}">
        <div class="te-tap-list">
          ${areas.map((a, i) => {
            const on = this.editing && i === picked;
            const detail = this.areaDetail(a);
            return html`<button type="button" class="te-tap-row ${on ? "on" : ""}" data-tap-row=${i} aria-pressed=${on ? "true" : "false"} title=${detail} @click=${() => this.pick(i)}>
              <span class="te-tap-badge">${i + 1}</span><span class="te-tap-words"><b>${this.actionWords(a.action)}</b>${detail === "" ? nothing : html`<small>${detail}</small>`}</span></button>`;
          })}
          <button type="button" class="te-tap-add" ?disabled=${d.busy || full} title=${full ? `At most ${TEMPLATE_TAPS.max} areas` : ""} @click=${() => this.add()}><span aria-hidden="true">+</span>${words.addLabel}</button>
          <div class="te-tap-marker">${this.markerHint(words.markerHint)}</div>
        </div>
        ${form !== nothing ? form : editing ? html`<div class="te-tap-none">Pick an area in the list or on the tile.</div>` : nothing}
      </div>
    </section>`;
  }

  /** The list's foot line, with the marker as code. */
  private markerHint(text: string): TemplateResult {
    const marker = "[map:lat,lon]";
    const at = text.indexOf(marker);
    if (at < 0) return html`${text}`;
    return html`${text.slice(0, at)}<code>${marker}</code>${text.slice(at + marker.length)}`;
  }

  /** The picked area's settings: a card beside the list, each title over
   * its control. */
  private inspector(): TemplateResult | typeof nothing {
    const d = this.data();
    const index = this.pickedIndex();
    if (!this.editing || index === undefined) return nothing;
    const area = this.areas()[index]!;
    const words = d.taps.words;
    const pages = d.taps.pages;
    const httpActions = d.taps.httpActions;
    const ids = Object.keys(d.hass.states).sort();
    const firstOf = (domains: readonly string[]): string | undefined => {
      for (const domain of domains) {
        const hit = ids.find((id) => id.startsWith(`${domain}.`));
        if (hit !== undefined) return hit;
      }
      return undefined;
    };
    const held = area.entity;
    const heldIn = (domain: string) => held !== undefined && held.startsWith(`${domain}.`) ? held : undefined;
    // The text a newly picked action starts with, so the rule keeps the area.
    const firstText = (action: TemplateTapAction): string | undefined => {
      switch (action) {
        case "maps": return area.place ?? FIRST_PLACE;
        case "link": return area.url ?? FIRST_URL;
        case "page": return area.page ?? pages[0]?.id;
        case "toggle": return held ?? firstOf(TOGGLE_FIRST) ?? ids[0];
        case "control": return held ?? firstOf(CONTROL_FIRST) ?? ids[0];
        case "script": return heldIn("script") ?? firstOf(["script"]);
        case "scene": return heldIn("scene") ?? firstOf(["scene"]);
        case "service": return area.service ?? FIRST_SERVICE;
        case "http": return area.http ?? httpActions[0]?.id;
        default: return undefined;
      }
    };
    const setAction = (action: TemplateTapAction) => {
      if (action === area.action) return;
      const field = templateTapField(action);
      let next = withTemplateTapAction(area, action, field === undefined ? undefined : firstText(action));
      if (next === area) return;
      // A service starts on the entity the area held, so it does the same.
      if (action === "service") next = withTemplateTapServiceExtras(next, { entity: held });
      this.dataDraft = undefined;
      d.ended();
      this.replace(index, next);
      d.ended();
      if (action === "maps" || action === "link" || action === "service") void this.host.drawn().then(() => this.host.element.querySelector<HTMLInputElement>(".te-tap-text")?.focus());
    };
    // An action that cannot start (nothing to pick) is offered greyed.
    const offered = (action: TemplateTapAction): boolean =>
      action === area.action || templateTapField(action) === undefined || firstText(action) !== undefined;
    const typed = (field: "place" | "url" | "service") => (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      if (value.trim() === "") return;
      this.replace(index, { ...area, [field]: value }, true);
    };
    const left = (field: "place" | "url" | "service") => (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (input.value.trim() === "") input.value = area[field] ?? "";
      d.ended();
    };
    const textField = (field: "place" | "url" | "service", label: string, hint: string, placeholder: string, list?: string) => html`<label class="te-item-field"><span>${label}</span>
      <input class="te-tap-text" type="text" spellcheck="false" autocomplete="off" maxlength=${TEMPLATE_TAPS.maxText} placeholder=${placeholder} list=${list ?? nothing} .value=${area[field] ?? ""} ?disabled=${d.busy}
        @input=${typed(field)} @blur=${left(field)}></label>
      <div class="te-hint">${hint}</div>`;
    const hint = (action: TemplateTapAction) => {
      const said = words.actionHints[action];
      return said === undefined ? nothing : html`<div class="te-hint">${said}</div>`;
    };
    // The shared entity search. A needed entity has no x: clearing it would
    // drop the area. The service's own entity can be cleared.
    const entityPicker = (label: string, value: string | undefined, set: (id: string) => void, opts: { domain?: string; clearable: boolean }) =>
      entityField({ hass: d.hass }, label, value === undefined ? { entityId: "", displayName: "", domain: "" } : entityRefFrom(d.hass.states, value),
        (ref) => set(ref.entityId), `te-tap-${d.tileId}-${index}-${label}`, { domain: opts.domain, clearable: opts.clearable, compact: true });
    const setEntity = (id: string) => {
      if (id.trim() === "") return;
      d.ended();
      this.replace(index, { ...area, entity: id });
      d.ended();
    };
    const missing = area.action === "page" && !pages.some((p) => p.id === area.page);
    const missingHTTP = area.action === "http" && !httpActions.some((a) => a.id.toUpperCase() === area.http?.toUpperCase());
    return html`<section class="te-item-inspector te-tap-form" aria-label=${`Tap area ${index + 1}`}>
      <div class="te-item-head"><b>Tap area ${index + 1}</b>
        <button type="button" class="te-item-link" ?disabled=${d.busy} @click=${() => this.remove(index)}>Delete</button></div>
      <label class="te-item-field"><span>Action</span>
        <select class="te-select" aria-label="Action" ?disabled=${d.busy} @change=${(e: Event) => setAction((e.target as HTMLSelectElement).value as TemplateTapAction)}>
          ${ACTION_GROUPS.map(([group, actions]) => html`<optgroup label=${group}>
            ${actions.map((a) => html`<option value=${a} ?selected=${a === area.action} ?disabled=${!offered(a)}>${this.actionWords(a)}</option>`)}
          </optgroup>`)}
        </select></label>
      ${area.action === "maps" ? textField("place", "Place", words.placeHint, FIRST_PLACE) : nothing}
      ${area.action === "link" ? textField("url", "URL", words.urlHint, "https://example.com") : nothing}
      ${area.action === "page" ? html`<label class="te-item-field"><span>Page</span>
        <select class="te-select" aria-label="Page" ?disabled=${d.busy} @change=${(e: Event) => this.replace(index, { ...area, page: (e.target as HTMLSelectElement).value })}>
          ${missing ? html`<option value=${area.page ?? ""} selected>Missing page</option>` : nothing}
          ${pages.map((p) => html`<option value=${p.id} ?selected=${p.id === area.page}>${p.name}</option>`)}
        </select></label>` : nothing}
      ${area.action === "refresh" ? html`<div class="te-hint">Asks Home Assistant for the template again.</div>` : nothing}
      ${area.action === "toggle" || area.action === "control"
        ? html`${entityPicker("Entity", area.entity, setEntity, { clearable: false })}${hint(area.action)}` : nothing}
      ${area.action === "script" || area.action === "scene"
        ? html`${entityPicker(area.action === "script" ? "Script" : "Scene", area.entity, setEntity, { domain: area.action, clearable: false })}${hint(area.action)}` : nothing}
      ${area.action === "service" ? this.serviceFields(area, index, textField, entityPicker, hint("service")) : nothing}
      ${area.action === "http" ? html`<label class="te-item-field"><span>HTTP action</span>
        <select class="te-select" aria-label="HTTP action" ?disabled=${d.busy} @change=${(e: Event) => this.replace(index, { ...area, http: (e.target as HTMLSelectElement).value })}>
          ${missingHTTP ? html`<option value=${area.http ?? ""} selected>Missing action</option>` : nothing}
          ${httpActions.map((a) => html`<option value=${a.id} ?selected=${a.id.toUpperCase() === area.http?.toUpperCase()}>${a.name}</option>`)}
        </select></label>${hint("http")}` : nothing}
      <label class="te-sw te-tap-confirm"><span><b>${words.confirmLabel}</b><small>${words.confirmHint}</small></span>
        <button type="button" class="te-switch ${area.confirm === true ? "on" : ""}" role="switch" aria-checked=${area.confirm === true ? "true" : "false"} aria-label=${words.confirmLabel} ?disabled=${d.busy}
          @click=${() => { d.ended(); this.replace(index, withTemplateTapConfirm(area, area.confirm !== true)); d.ended(); }}></button></label>
    </section>`;
  }

  /** Call service's fields: the service, with Home Assistant's services as
   * suggestions, an optional entity, and optional data as a JSON object. */
  private serviceFields(
    area: TemplateTapArea,
    index: number,
    textField: (field: "service", label: string, hint: string, placeholder: string, list?: string) => TemplateResult,
    entityPicker: (label: string, value: string | undefined, set: (id: string) => void, opts: { domain?: string; clearable: boolean }) => TemplateResult,
    hint: TemplateResult | typeof nothing,
  ): TemplateResult {
    const d = this.data(), words = d.taps.words;
    const list = `te-tap-services-${index}`;
    const draft = this.dataDraft !== undefined && this.dataDraft.tile === d.tileId && this.dataDraft.index === index ? this.dataDraft : undefined;
    const shown = draft?.text ?? (area.data === undefined ? "" : JSON.stringify(area.data));
    const setEntity = (id: string) => {
      d.ended();
      this.replace(index, withTemplateTapServiceExtras(area, { entity: id }));
      d.ended();
    };
    const typedData = (e: Event) => {
      const text = (e.target as HTMLTextAreaElement).value;
      let data: Record<string, unknown> | undefined;
      let error: string | undefined;
      if (text.trim() !== "") {
        try {
          const parsed: unknown = JSON.parse(text);
          if (isTemplateTapData(parsed)) data = parsed;
          else error = "Data must be a JSON object, in { }.";
        } catch {
          error = "This is not valid JSON yet.";
        }
      }
      this.dataDraft = { tile: d.tileId, index, text, error };
      if (error === undefined) this.replace(index, withTemplateTapServiceExtras(area, { data }), true);
      else this.host.update();
    };
    const leftData = () => {
      // Valid text goes back to the stored form; text that does not parse
      // stays, with its error, until it is fixed.
      if (this.dataDraft?.error === undefined) this.dataDraft = undefined;
      d.ended();
      this.host.update();
    };
    return html`${textField("service", "Service", words.serviceHint, FIRST_SERVICE, d.taps.services.length > 0 ? list : undefined)}
      ${d.taps.services.length > 0 ? html`<datalist id=${list}>${d.taps.services.map((s) => html`<option value=${s}></option>`)}</datalist>` : nothing}
      ${entityPicker("Entity (optional)", area.entity, setEntity, { clearable: true })}
      <label class="te-item-field"><span>Data (JSON)</span>
        <textarea class="te-tap-data" rows="3" spellcheck="false" placeholder='{"brightness_pct": 40}' .value=${shown} ?disabled=${d.busy}
          aria-invalid=${draft?.error === undefined ? "false" : "true"} @input=${typedData} @blur=${leftData}></textarea></label>
      ${draft?.error === undefined ? html`<div class="te-hint">${words.dataHint}</div>` : html`<div class="te-hint warn" role="alert">${draft.error} It is not saved.</div>`}
      ${hint}`;
  }
}
