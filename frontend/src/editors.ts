// Inspector controls. Every function renders a form for one part of the
// draft and reports edits through `EditorHost.update`, which the panel wires
// to the Draft's undo history. Controls are plain HTML inputs styled to HA
// so the bundle stays free of HA's internal component library.

import { html, nothing, type TemplateResult } from "lit";
import {
  type AggregateSpec,
  type Comparison,
  type CustomComplicationConfig,
  type Element as CElement,
  type EntityRef,
  type FamilyKind,
  type FamilyLayout,
  type FontWeight,
  type NamedValue,
  type NormalizedFrame,
  type Placement,
  type TapAction,
  type TimeField,
  type Value,
  type ValueFormat,
  type ValueKind,
  DRAWABLE_FAMILIES,
  formatIsEmpty,
  literal,
  newId,
} from "./model.js";
import type { HassLike } from "./ha-api.js";
import { familyTitle } from "./renderer.js";

export interface EditorHost {
  hass: HassLike;
  config: CustomComplicationConfig;
  /** Mutate the draft. `coalesce` groups rapid edits of one control into one undo step. */
  update(mutate: (cfg: CustomComplicationConfig) => void, coalesce?: string): void;
  endGesture(): void;
  /** Resolved text for a value, for the "current value" line. */
  resolve(value: Value): string | undefined;
}

// ── small controls ────────────────────────────────────────────────────────

function onInput(handler: (v: string) => void) {
  return (e: Event) => handler((e.target as HTMLInputElement).value);
}

export function textField(label: string, value: string, set: (v: string) => void, opts: { placeholder?: string; list?: string; mono?: boolean } = {}) {
  return html`<label class="field"><span>${label}</span>
    <input type="text" .value=${value} placeholder=${opts.placeholder ?? ""} list=${opts.list ?? nothing}
      class=${opts.mono ? "mono" : ""} @input=${onInput(set)} /></label>`;
}

export function textArea(label: string, value: string, set: (v: string) => void, rows = 3) {
  return html`<label class="field"><span>${label}</span>
    <textarea rows=${rows} .value=${value} class="mono" @input=${onInput(set)}></textarea></label>`;
}

export function numberField(label: string, value: number | undefined, set: (v: number | undefined) => void, opts: { step?: number; min?: number; max?: number; optional?: boolean } = {}) {
  const shown = value === undefined || Number.isNaN(value) ? "" : String(value);
  return html`<label class="field"><span>${label}</span>
    <input type="number" .value=${shown} step=${opts.step ?? "any"} min=${opts.min ?? nothing} max=${opts.max ?? nothing}
      @input=${onInput((v) => {
        if (v.trim() === "") {
          if (opts.optional) set(undefined);
          return;
        }
        const n = Number(v);
        if (!Number.isNaN(n)) set(n);
      })} /></label>`;
}

export function selectField<T extends string>(label: string, value: T, options: [T, string][], set: (v: T) => void) {
  return html`<label class="field"><span>${label}</span>
    <select @change=${onInput((v) => set(v as T))}>
      ${options.map(([v, text]) => html`<option value=${v} ?selected=${v === value}>${text}</option>`)}
    </select></label>`;
}

export function checkField(label: string, value: boolean, set: (v: boolean) => void) {
  return html`<label class="field check"><input type="checkbox" .checked=${value} @change=${(e: Event) => set((e.target as HTMLInputElement).checked)} /><span>${label}</span></label>`;
}

/** `#RRGGBB` or `#RRGGBBAA`. The native picker handles RGB; alpha is a slider. */
export function colorField(label: string, value: string | undefined, set: (v: string | undefined) => void, optional = false) {
  const h = (value ?? "").replace(/^#/, "");
  const valid = /^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(h);
  const rgb = valid ? `#${h.slice(0, 6)}` : "#ffffff";
  const alpha = valid && h.length === 8 ? Math.round((parseInt(h.slice(6, 8), 16) / 255) * 100) : 100;
  const compose = (rgbHex: string, a: number) => {
    const base = rgbHex.replace(/^#/, "").toUpperCase();
    return a >= 100 ? `#${base}` : `#${base}${Math.round((a / 100) * 255).toString(16).padStart(2, "0").toUpperCase()}`;
  };
  return html`<div class="field color"><span>${label}</span>
    <div class="color-row">
      ${optional ? html`<input type="checkbox" title="Enabled" .checked=${value !== undefined} @change=${(e: Event) => set((e.target as HTMLInputElement).checked ? compose(rgb, alpha) : undefined)} />` : nothing}
      <input type="color" .value=${rgb} ?disabled=${optional && value === undefined} @input=${onInput((v) => set(compose(v, alpha)))} />
      <input type="range" min="0" max="100" .value=${String(alpha)} title="Opacity" ?disabled=${optional && value === undefined} @input=${onInput((v) => set(compose(rgb, Number(v))))} />
      <input type="text" class="mono hex" .value=${value ?? ""} placeholder="#RRGGBB" ?disabled=${optional && value === undefined}
        @input=${onInput((v) => { const t = v.trim(); if (/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(t)) set(t.startsWith("#") ? t.toUpperCase() : `#${t.toUpperCase()}`); })} />
    </div></div>`;
}

// ── entity helpers ────────────────────────────────────────────────────────

export function entityRefFor(hass: HassLike, entityId: string): EntityRef {
  const s = hass.states[entityId];
  const friendly = s && typeof s.attributes.friendly_name === "string" ? s.attributes.friendly_name : entityId;
  return { entityId, displayName: friendly, domain: entityId.split(".")[0] ?? "" };
}

/** One shared <datalist> of entity ids; rendered once per panel. */
export function entityDatalist(hass: HassLike, id: string) {
  const ids = Object.keys(hass.states).sort();
  return html`<datalist id=${id}>${ids.map((e) => html`<option value=${e}>${String(hass.states[e]?.attributes.friendly_name ?? "")}</option>`)}</datalist>`;
}

function entityField(host: EditorHost, label: string, ref: EntityRef, set: (ref: EntityRef) => void, key: string) {
  return html`${textField(label, ref.entityId, (v) => set(v in host.hass.states ? entityRefFor(host.hass, v) : { ...ref, entityId: v, domain: v.split(".")[0] ?? "" }), { list: "wa-entities", mono: true })}
    ${ref.entityId && !(ref.entityId in host.hass.states) ? html`<div class="hint warn">Not in Home Assistant right now.</div>` : nothing}
    ${textField("Display name", ref.displayName, (v) => set({ ...ref, displayName: v }))}`;
}

// ── Value editor ──────────────────────────────────────────────────────────

const VALUE_KINDS: [ValueKind["kind"], string][] = [
  ["literal", "Fixed text"],
  ["entityState", "Entity state"],
  ["entityAttribute", "Entity attribute"],
  ["entityAge", "Entity age (seconds)"],
  ["aggregate", "Aggregate"],
  ["time", "Time"],
  ["dataAge", "Data age (seconds)"],
  ["jinja", "Jinja template"],
  ["named", "Named value"],
];

const TIME_FIELDS: [TimeField, string][] = [
  ["now", "Now (HH:mm)"], ["hour", "Hour"], ["minute", "Minute"], ["weekday", "Weekday"], ["day", "Day"], ["month", "Month"], ["timestamp", "Unix timestamp"],
];

function switchKind(current: ValueKind, kind: ValueKind["kind"]): ValueKind {
  const ref: EntityRef = "entityId" in current ? { entityId: current.entityId, displayName: current.displayName, domain: current.domain } : { entityId: "", displayName: "", domain: "" };
  switch (kind) {
    case "literal": return { kind, value: current.kind === "literal" ? current.value : "" };
    case "entityState": return { kind, ...ref };
    case "entityAttribute": return { kind, ...ref, attribute: "" };
    case "entityAge": return { kind, ...ref };
    case "aggregate": return { kind, aggregate: { function: "count", scope: { kind: "filter", domains: [], areaIds: [], labelIds: [], floorIds: [] }, stateFilter: { kind: "isOn" } } };
    case "time": return { kind, timeField: "now" };
    case "dataAge": return { kind };
    case "jinja": return { kind, value: current.kind === "jinja" ? current.value : "{{ states('sensor.example') }}" };
    case "named": return { kind, id: "" };
  }
}

export interface ValueEditorOptions {
  /** Named values are not offered inside a named value (no self reference). */
  allowNamed?: boolean;
  /** Hide the format section (icon symbols, colours). */
  noFormat?: boolean;
  /** Show the live resolved value. */
  showResolved?: boolean;
  /** Undo coalescing key prefix. */
  key: string;
}

export function valueEditor(host: EditorHost, value: Value, set: (v: Value) => void, opts: ValueEditorOptions): TemplateResult {
  const k = value.kind;
  const setKind = (kind: ValueKind) => set({ ...value, kind });
  const key = opts.key;
  const kinds = VALUE_KINDS.filter(([kind]) => opts.allowNamed !== false || kind !== "named");
  let body: TemplateResult | typeof nothing = nothing;
  switch (k.kind) {
    case "literal":
      body = textField("Text", k.value, (v) => setKind({ ...k, value: v }));
      break;
    case "entityState":
    case "entityAge":
      body = entityField(host, "Entity", k, (ref) => setKind({ ...k, ...ref }), key);
      break;
    case "entityAttribute": {
      const attrs = Object.keys(host.hass.states[k.entityId]?.attributes ?? {}).sort();
      const listId = `wa-attrs-${key.replace(/[^a-z0-9]/gi, "")}`;
      body = html`${entityField(host, "Entity", k, (ref) => setKind({ ...k, ...ref }), key)}
        ${textField("Attribute", k.attribute, (v) => setKind({ ...k, attribute: v }), { list: listId, mono: true })}
        <datalist id=${listId}>${attrs.map((a) => html`<option value=${a}></option>`)}</datalist>`;
      break;
    }
    case "aggregate":
      body = aggregateEditor(host, k.aggregate, (a) => setKind({ ...k, aggregate: a }), key);
      break;
    case "time":
      body = selectField("Field", k.timeField, TIME_FIELDS, (v) => setKind({ ...k, timeField: v }));
      break;
    case "dataAge":
      body = html`<div class="hint">Seconds since the watch last fetched values.</div>`;
      break;
    case "jinja":
      body = html`${textArea("Template", k.value, (v) => setKind({ ...k, value: v }), 4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;
      break;
    case "named":
      body = selectField("Value", k.id, [["", "(choose)"], ...host.config.values.map((n): [string, string] => [n.id, n.name || n.id.slice(0, 8)])], (v) => setKind({ ...k, id: v }));
      break;
  }
  const resolved = opts.showResolved ? host.resolve(value) : undefined;
  return html`<div class="value-editor">
    ${selectField("Source", k.kind, kinds, (kind) => setKind(switchKind(k, kind)))}
    ${body}
    ${opts.noFormat ? nothing : formatEditor(value.format, (f) => set(formatIsEmpty(f) ? { kind: value.kind } : { ...value, format: f }))}
    ${opts.showResolved ? html`<div class="hint">Now: ${resolved === undefined ? html`<span class="warn">unresolved</span>` : html`<code>${resolved}</code>`}</div>` : nothing}
  </div>`;
}

function formatEditor(format: ValueFormat | undefined, set: (f: ValueFormat) => void) {
  const f = format ?? {};
  const upd = (patch: Partial<ValueFormat>) => {
    const next: ValueFormat = { ...f, ...patch };
    for (const key of Object.keys(next) as (keyof ValueFormat)[]) if (next[key] === undefined || next[key] === false || next[key] === "") delete next[key];
    set(next);
  };
  return html`<details class="sub" ?open=${!formatIsEmpty(format)}>
    <summary>Format${formatIsEmpty(format) ? "" : " (on)"}</summary>
    <div class="grid2">
      ${numberField("Decimals", f.decimals, (v) => upd({ decimals: v }), { step: 1, min: 0, max: 6, optional: true })}
      ${numberField("Multiply", f.multiply, (v) => upd({ multiply: v }), { optional: true })}
      ${numberField("Offset", f.offset, (v) => upd({ offset: v }), { optional: true })}
      ${selectField("Case", f.textCase ?? "", [["", "As is"], ["upper", "UPPER"], ["lower", "lower"], ["capitalized", "Capitalized"]], (v) => upd({ textCase: (v || undefined) as ValueFormat["textCase"] }))}
      ${textField("Prefix", f.prefix ?? "", (v) => upd({ prefix: v }))}
      ${textField("Suffix", f.suffix ?? "", (v) => upd({ suffix: v }))}
    </div>
    ${checkField("Append the entity's unit", !!f.useEntityUnit, (v) => upd({ useEntityUnit: v }))}
    ${checkField("Show as relative time (45s, 2m, 3h)", !!f.relativeTime, (v) => upd({ relativeTime: v }))}
  </details>`;
}

function aggregateEditor(host: EditorHost, a: AggregateSpec, set: (a: AggregateSpec) => void, key: string) {
  const csv = (list: string[]) => list.join(", ");
  const parse = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
  const scope = a.scope;
  return html`
    ${selectField("Function", a.function, [["count", "Count"], ["sum", "Sum"], ["average", "Average"], ["min", "Min"], ["max", "Max"]], (v) => set({ ...a, function: v }))}
    ${selectField("Over", scope.kind, [["filter", "Entities matching a filter"], ["entities", "A fixed entity list"]], (v) =>
      set({ ...a, scope: v === "entities" ? { kind: "entities", entities: [] } : { kind: "filter", domains: [], areaIds: [], labelIds: [], floorIds: [] } }))}
    ${scope.kind === "filter"
      ? html`<div class="grid2">
          ${textField("Domains", csv(scope.domains), (v) => set({ ...a, scope: { ...scope, domains: parse(v) } }), { placeholder: "light, switch" })}
          ${textField("Area ids", csv(scope.areaIds), (v) => set({ ...a, scope: { ...scope, areaIds: parse(v) } }))}
          ${textField("Label ids", csv(scope.labelIds), (v) => set({ ...a, scope: { ...scope, labelIds: parse(v) } }))}
          ${textField("Floor ids", csv(scope.floorIds), (v) => set({ ...a, scope: { ...scope, floorIds: parse(v) } }))}
        </div>`
      : html`${scope.entities.map((e, i) => html`<div class="row-inline">
            ${textField(`Entity ${i + 1}`, e.entityId, (v) => { const list = [...scope.entities]; list[i] = v in host.hass.states ? entityRefFor(host.hass, v) : { ...e, entityId: v, domain: v.split(".")[0] ?? "" }; set({ ...a, scope: { ...scope, entities: list } }); }, { list: "wa-entities", mono: true })}
            <button class="icon" title="Remove" @click=${() => set({ ...a, scope: { ...scope, entities: scope.entities.filter((_, j) => j !== i) } })}>×</button>
          </div>`)}
          <button class="small" @click=${() => set({ ...a, scope: { ...scope, entities: [...scope.entities, { entityId: "", displayName: "", domain: "" }] } })}>Add entity</button>`}
    ${selectField("Only count when", a.stateFilter?.kind ?? "", [["", "Any state"], ["isOn", "On"], ["isOff", "Off"], ["equals", "State equals"], ["notEquals", "State does not equal"]], (v) => {
      const next = { ...a };
      if (v === "") delete next.stateFilter;
      else if (v === "equals" || v === "notEquals") next.stateFilter = { kind: v, value: a.stateFilter && "value" in a.stateFilter ? a.stateFilter.value : "" };
      else next.stateFilter = { kind: v as "isOn" | "isOff" };
      set(next);
    })}
    ${a.stateFilter && "value" in a.stateFilter ? textField("State", a.stateFilter.value, (v) => set({ ...a, stateFilter: { kind: a.stateFilter!.kind as "equals", value: v } })) : nothing}
    ${a.function === "count" ? nothing : textField("Attribute (blank = state)", a.attribute ?? "", (v) => { const next = { ...a }; if (v) next.attribute = v; else delete next.attribute; set(next); })}`;
}

// ── General ───────────────────────────────────────────────────────────────

const TAP_TYPES: [TapAction["type"], string][] = [
  ["refresh", "Refresh"], ["none", "Nothing"], ["openApp", "Open the app"], ["openPage", "Open the page"], ["openRoomPage", "Open the room page"],
  ["timerStartPause", "Timer start / pause"], ["timerCancel", "Timer cancel"],
  ["toggleEntity", "Toggle an entity"], ["runScene", "Run a scene"], ["runScript", "Run a script"], ["addTodo", "Add a to-do"], ["runHTTPAction", "Run an HTTP action"],
];

export function generalEditor(host: EditorHost, usedSlots: Map<number, string>): TemplateResult {
  const cfg = host.config;
  const tap = cfg.tapAction;
  const needsEntity = (t: TapAction["type"]) => ["toggleEntity", "runScene", "runScript", "addTodo", "runHTTPAction"].includes(t);
  const clash = usedSlots.get(cfg.slotIndex);
  return html`
    ${textField("Name", cfg.name, (v) => host.update((c) => { c.name = v; }, "name"))}
    ${selectField("Slot", String(cfg.slotIndex), Array.from({ length: 8 }, (_, i): [string, string] => [String(i), `Slot ${i + 1}${usedSlots.has(i) && i !== cfg.slotIndex ? ` (used by ${usedSlots.get(i)})` : ""}`]), (v) => host.update((c) => { c.slotIndex = Number(v); }))}
    ${clash ? html`<div class="hint warn">"${clash}" already uses this slot. The watch shows one complication per slot.</div>` : nothing}
    ${numberField("Refresh every (minutes, 0 = never)", cfg.refreshMinutes ?? 0, (v) => host.update((c) => { c.refreshMinutes = v ?? 0; }, "refresh"), { step: 1, min: 0 })}
    ${selectField("Tap action", tap.type, TAP_TYPES, (v) => host.update((c) => {
      c.tapAction = needsEntity(v) ? { type: v as "toggleEntity", ...("entityId" in c.tapAction ? { entityId: c.tapAction.entityId, displayName: c.tapAction.displayName, domain: c.tapAction.domain } : { entityId: "", displayName: "", domain: "" }) } : { type: v as "refresh" };
    }))}
    ${"entityId" in tap ? entityField(host, "Target", tap, (ref) => host.update((c) => { c.tapAction = { type: tap.type, ...ref }; }, "tap-entity"), "tap") : nothing}
    ${checkField("Flash on success", cfg.showSuccessFlash ?? true, (v) => host.update((c) => { c.showSuccessFlash = v; }))}
    ${colorField("Flash colour (blank = green)", cfg.successFlashColorHex, (v) => host.update((c) => { if (v === undefined) delete c.successFlashColorHex; else c.successFlashColorHex = v; }, "flash"), true)}
    <div class="field"><span>Families</span>
      <div class="chips">${(["rectangular", "circular", "corner", "inline"] as FamilyKind[]).map((f) => html`<label class="chip"><input type="checkbox" .checked=${cfg.supportedFamilies.includes(f)}
        @change=${(e: Event) => host.update((c) => { const on = (e.target as HTMLInputElement).checked; c.supportedFamilies = on ? [...new Set([...c.supportedFamilies, f])] : c.supportedFamilies.filter((x) => x !== f); })} />${familyTitle(f)}</label>`)}</div>
    </div>`;
}

// ── Data (named values) ───────────────────────────────────────────────────

export function namedValueEditor(host: EditorHost, nv: NamedValue): TemplateResult {
  const idx = host.config.values.findIndex((v) => v.id === nv.id);
  const key = `nv-${nv.id}`;
  return html`
    ${textField("Name", nv.name, (v) => host.update((c) => { c.values[idx]!.name = v; }, `${key}-name`))}
    ${valueEditor(host, nv.value, (v) => host.update((c) => { c.values[idx]!.value = v; }, key), { allowNamed: false, showResolved: true, key })}
    <div class="hint">Used by ${countNamedUses(host.config, nv.id)} layer${countNamedUses(host.config, nv.id) === 1 ? "" : "s"}.</div>`;
}

function countNamedUses(cfg: CustomComplicationConfig, id: string): number {
  return JSON.stringify(cfg.elements).split(`"${id}"`).length - 1 + JSON.stringify(cfg.perFamily).split(`"${id}"`).length - 1;
}

export function newNamedValue(): NamedValue {
  return { id: newId(), name: "Value", value: literal("") };
}

// ── Layers ────────────────────────────────────────────────────────────────

export interface EffectivePlacement {
  frame: NormalizedFrame;
  isHidden: boolean;
  size?: number;
  fromPlacement: boolean;
}

/** What a layer actually uses in one family (schema §4.3). */
export function effectivePlacement(cfg: CustomComplicationConfig, family: FamilyKind, el: CElement): EffectivePlacement {
  const layout = cfg.perFamily[family];
  const p = layout?.placements[el.payload.id];
  if (layout && Object.keys(layout.placements).length > 0 && p) {
    return { frame: p.frame, isHidden: p.isHidden, size: p.size, fromPlacement: true };
  }
  return { frame: el.payload.frame, isHidden: el.payload.isHidden, fromPlacement: false };
}

/** Write a per-family placement for a layer, creating it from the effective values. */
export function setPlacement(cfg: CustomComplicationConfig, family: FamilyKind, id: string, patch: Partial<Placement>, clearSize = false): void {
  const el = cfg.elements.find((e) => e.payload.id === id);
  if (!el) return;
  let layout = cfg.perFamily[family];
  if (!layout) {
    layout = { placements: {}, cornerBodyShape: "wedge", borderWidth: 2, rules: [] };
    cfg.perFamily[family] = layout;
  }
  const eff = effectivePlacement(cfg, family, el);
  const existing: Placement = layout.placements[id] ?? { frame: { ...eff.frame }, isHidden: eff.isHidden, ...(eff.size !== undefined ? { size: eff.size } : {}) };
  const next: Placement = { ...existing, ...patch };
  if (clearSize) delete next.size;
  // Creating the first placement in a family freezes every other layer at
  // its current frame, otherwise they would silently keep following the
  // shared frame while this one does not.
  if (Object.keys(layout.placements).length === 0) {
    for (const other of cfg.elements) {
      if (other.payload.id === id) continue;
      layout.placements[other.payload.id] = { frame: { ...other.payload.frame }, isHidden: other.payload.isHidden };
    }
  }
  layout.placements[id] = next;
}

export function elementSize(el: CElement): number | undefined {
  switch (el.kind) {
    case "text": return el.payload.fontSize;
    case "icon": return el.payload.size;
    case "gauge": return el.payload.lineWidth;
    case "shape": return undefined;
  }
}

const FONT_WEIGHTS: [FontWeight, string][] = [["regular", "Regular"], ["medium", "Medium"], ["semibold", "Semibold"], ["bold", "Bold"]];

export function layerEditor(host: EditorHost, el: CElement, family: FamilyKind): TemplateResult {
  const id = el.payload.id;
  const idx = host.config.elements.findIndex((e) => e.payload.id === id);
  const key = `el-${id}`;
  const upd = (mutate: (e: CElement) => void, k?: string) => host.update((c) => mutate(c.elements[idx]!), k ? `${key}-${k}` : undefined);
  const eff = effectivePlacement(host.config, family, el);
  const f = eff.frame;
  const setFrame = (patch: Partial<NormalizedFrame>, k: string) => host.update((c) => setPlacement(c, family, id, { frame: { ...f, ...patch } }), `${key}-${k}-${family}`);
  const sizeLabel = el.kind === "text" ? "Font size" : el.kind === "icon" ? "Icon size" : "Line width";

  let content: TemplateResult;
  switch (el.kind) {
    case "text":
      content = html`
        ${valueEditor(host, el.payload.value, (v) => upd((e) => { (e as typeof el).payload.value = v; }, "value"), { showResolved: true, key: `${key}-value` })}
        <div class="grid2">
          ${numberField("Font size (pt)", el.payload.fontSize, (v) => upd((e) => { (e as typeof el).payload.fontSize = v ?? 14; }, "size"), { step: 1, min: 4 })}
          ${selectField("Weight", el.payload.fontWeight, FONT_WEIGHTS, (v) => upd((e) => { (e as typeof el).payload.fontWeight = v; }))}
        </div>`;
      break;
    case "icon":
      content = html`
        ${valueEditor(host, el.payload.symbol, (v) => upd((e) => { (e as typeof el).payload.symbol = v; }, "symbol"), { noFormat: true, showResolved: true, key: `${key}-symbol` })}
        <div class="hint">Fixed text is an SF Symbol name such as <code>thermometer.medium</code>. An entity source uses that entity's icon.</div>
        ${numberField("Icon size (pt)", el.payload.size, (v) => upd((e) => { (e as typeof el).payload.size = v ?? 14; }, "size"), { step: 1, min: 4 })}`;
      break;
    case "gauge":
      content = html`
        ${valueEditor(host, el.payload.value, (v) => upd((e) => { (e as typeof el).payload.value = v; }, "value"), { showResolved: true, key: `${key}-value` })}
        <div class="grid2">
          ${numberField("Min", el.payload.minValue, (v) => upd((e) => { (e as typeof el).payload.minValue = v ?? 0; }, "min"))}
          ${numberField("Max", el.payload.maxValue, (v) => upd((e) => { (e as typeof el).payload.maxValue = v ?? 100; }, "max"))}
          ${selectField("Style", el.payload.style, [["arc", "Arc (270°)"], ["ring", "Ring"], ["bar", "Bar"]], (v) => upd((e) => { (e as typeof el).payload.style = v; }))}
          ${numberField("Line width (pt)", el.payload.lineWidth, (v) => upd((e) => { (e as typeof el).payload.lineWidth = v ?? 4; }, "lw"), { step: 0.5, min: 0.5 })}
        </div>
        ${colorField("Track colour", el.payload.trackColorHex, (v) => upd((e) => { (e as typeof el).payload.trackColorHex = v ?? "#FFFFFF40"; }, "track"))}`;
      break;
    case "shape":
      content = html`
        <div class="grid2">
          ${selectField("Shape", el.payload.kind, [["roundedRectangle", "Rounded rectangle"], ["rectangle", "Rectangle"], ["capsule", "Capsule"], ["circle", "Circle"]], (v) => upd((e) => { (e as typeof el).payload.kind = v; }))}
          ${el.payload.kind === "roundedRectangle" ? numberField("Corner radius (pt)", el.payload.cornerRadius, (v) => upd((e) => { (e as typeof el).payload.cornerRadius = v ?? 6; }, "radius"), { step: 0.5, min: 0 }) : nothing}
        </div>
        ${colorField("Border colour", el.payload.borderColorHex, (v) => upd((e) => { if (v === undefined) delete (e as typeof el).payload.borderColorHex; else (e as typeof el).payload.borderColorHex = v; }, "border"), true)}
        ${el.payload.borderColorHex !== undefined ? numberField("Border width (pt)", el.payload.borderWidth, (v) => upd((e) => { (e as typeof el).payload.borderWidth = v ?? 1; }, "bw"), { step: 0.5, min: 0 }) : nothing}`;
      break;
  }

  return html`
    ${content}
    ${colorField(el.kind === "shape" ? "Fill colour" : "Colour", el.payload.colorSlot.baseColorHex, (v) => upd((e) => { e.payload.colorSlot.baseColorHex = v ?? "#FFFFFF"; }, "color"))}
    ${checkField("Hidden in every family", el.payload.isHidden, (v) => upd((e) => { e.payload.isHidden = v; }))}
    <h3>${familyTitle(family)} placement${eff.fromPlacement ? "" : " (shared frame)"}</h3>
    <div class="grid4">
      ${numberField("X", f.x, (v) => setFrame({ x: v ?? 0 }, "x"), { step: 0.01 })}
      ${numberField("Y", f.y, (v) => setFrame({ y: v ?? 0 }, "y"), { step: 0.01 })}
      ${numberField("W", f.width, (v) => setFrame({ width: v ?? 0.5 }, "w"), { step: 0.01, min: 0 })}
      ${numberField("H", f.height, (v) => setFrame({ height: v ?? 0.5 }, "h"), { step: 0.01, min: 0 })}
    </div>
    ${numberField("Rotation (degrees)", f.rotationDegrees, (v) => setFrame({ rotationDegrees: v ?? 0 }, "rot"), { step: 1 })}
    ${checkField(`Hidden in ${familyTitle(family)}`, eff.isHidden, (v) => host.update((c) => setPlacement(c, family, id, { isHidden: v })))}
    ${el.kind === "shape" ? nothing : html`<div class="row-inline">
      ${numberField(`${sizeLabel} in ${familyTitle(family)} (blank = shared ${elementSize(el)})`, eff.size, (v) => host.update((c) => (v === undefined ? setPlacement(c, family, id, {}, true) : setPlacement(c, family, id, { size: v })), `${key}-psize-${family}`), { step: 1, min: 1, optional: true })}
    </div>`}
    <div class="hint">Drag the layer in the ${familyTitle(family)} preview to move it. Drag a corner to resize it. Frames are fractions of the canvas.</div>`;
}

// ── Family layout ─────────────────────────────────────────────────────────

export function familyEditor(host: EditorHost, family: FamilyKind): TemplateResult {
  const layout = host.config.perFamily[family];
  if (!layout) {
    return html`<div class="hint">No settings stored for ${familyTitle(family)} yet.</div>
      <button class="small" @click=${() => host.update((c) => { c.perFamily[family] = { placements: {}, cornerBodyShape: "wedge", borderWidth: 2, rules: [] }; })}>Add ${familyTitle(family)} settings</button>`;
  }
  const upd = (mutate: (l: FamilyLayout) => void, k?: string) => host.update((c) => mutate(c.perFamily[family]!), k ? `fam-${family}-${k}` : undefined);
  const placed = Object.keys(layout.placements).length;
  return html`
    ${colorField("Background (blank = transparent)", layout.backgroundColorHex, (v) => upd((l) => { if (v === undefined) delete l.backgroundColorHex; else l.backgroundColorHex = v; }, "bg"), true)}
    ${colorField("Border colour", layout.borderColorHex, (v) => upd((l) => { if (v === undefined) delete l.borderColorHex; else l.borderColorHex = v; }, "border"), true)}
    ${numberField("Border width (pt)", layout.borderWidth, (v) => upd((l) => { l.borderWidth = v ?? 2; }, "bw"), { step: 0.5, min: 0 })}
    ${family === "corner"
      ? html`${selectField("Body shape", layout.cornerBodyShape, [["wedge", "Wedge"], ["circle", "Circle"]], (v) => upd((l) => { l.cornerBodyShape = v; }))}
          ${checkField("Bezel label", !!layout.bezelText, (v) => upd((l) => { if (v) l.bezelText = literal("Label"); else delete l.bezelText; }))}
          ${layout.bezelText ? valueEditor(host, layout.bezelText, (val) => upd((l) => { l.bezelText = val; }, "bezel"), { showResolved: true, key: `fam-${family}-bezel` }) : nothing}`
      : nothing}
    <div class="hint">${placed === 0 ? "Layers use their shared frames here." : `${placed} layer${placed === 1 ? " has" : "s have"} a ${familyTitle(family)} placement.`}</div>
    ${placed > 0 ? html`<button class="small" @click=${() => upd((l) => { l.placements = {}; })}>Reset placements to the shared frames</button>` : nothing}
    ${layout.rules.length ? html`<div class="hint">${layout.rules.length} layout rule${layout.rules.length === 1 ? "" : "s"} (rule editing arrives in the next slice).</div>` : nothing}`;
}

export const FAMILY_OPTIONS = DRAWABLE_FAMILIES.map((f): [FamilyKind, string] => [f, familyTitle(f)]);
export type { Comparison };
