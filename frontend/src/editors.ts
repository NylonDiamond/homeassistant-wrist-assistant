// Inspector controls. Every function renders a form for one part of the
// draft and reports edits through `EditorHost.update`, which the panel wires
// to the Draft's undo history. Controls are plain HTML inputs styled to HA
// so the bundle stays free of HA's internal component library.

import { html, nothing, type TemplateResult } from "lit";
import {
  type AggregateSpec,
  type BezelGauge,
  type Comparison,
  type ComparisonKind,
  type CustomComplicationConfig,
  type Element as CElement,
  type EntityRef,
  type FamilyKind,
  type FamilyLayout,
  type FontWeight,
  type NamedValue,
  type NormalizedFrame,
  type Placement,
  type Rule,
  type RuleCase,
  type RuleTarget,
  type StyleChange,
  type StyleChangeKind,
  type TapAction,
  type TimeField,
  type Value,
  type ValueFormat,
  type ValueKind,
  COMPARISON_KINDS,
  DRAWABLE_FAMILIES,
  RULE_TARGET_PROPERTIES,
  STYLE_PROPERTY,
  comparisonOperand,
  formatIsEmpty,
  literal,
  newCase,
  newId,
  newRule,
  newStyleChange,
  newTest,
  styleChangePayload,
  switchComparison,
} from "./model.js";
import type { ForcedBranches } from "./resolver.js";
import type { HassLike } from "./ha-api.js";
import { familyTitle, type IconProvider } from "./renderer.js";
import { CURATED_SYMBOLS, SYMBOL_CATEGORIES, SymbolBrowser, searchSymbols } from "./symbols.js";
import { canRemoveFamily, missingFamilies, supportedFamilies } from "./layouts.js";

export interface EditorHost {
  hass: HassLike;
  config: CustomComplicationConfig;
  /** Draws and enumerates SF Symbols for the symbol picker. */
  icons: IconProvider;
  /** Search text, category and recents for the symbol picker. */
  symbols: SymbolBrowser;
  /** Watch-app pages (id + name, watch order) from the watch's last sync
   * report; feeds the "Open the page" tap-action picker. */
  pages: { id: string; name: string }[];
  /** Mutate the draft. `coalesce` groups rapid edits of one control into one undo step. */
  update(mutate: (cfg: CustomComplicationConfig) => void, coalesce?: string): void;
  endGesture(): void;
  /** Resolved text for a value, for the "current value" line. */
  resolve(value: Value): string | undefined;
  /** Live result of one rule test. */
  evaluateTest(test: import("./model.js").Test): boolean;
  /** Which branch a rule takes live: a case id, "otherwise", or "none". */
  liveBranch(rule: Rule): string;
  forced: ForcedBranches;
  setForced(ruleId: string, branch: { caseId: string } | "otherwise" | "live"): void;
  /** The shape being edited; the Layouts row and the layout tab follow it. */
  activeFamily: FamilyKind;
  setActiveFamily(family: FamilyKind): void;
  /** Add a shape and seed its layout. Also makes it the active shape. */
  addFamily(family: FamilyKind): void;
  /** Remove a shape and its layout, confirming first when it holds content. */
  removeFamily(family: FamilyKind): void;
  /** The complication's name when this edit session opened, for the rename
   * note. Undefined for a brand-new complication (nothing on the watch yet). */
  savedName?: string;
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

// ── Symbol picker ─────────────────────────────────────────────────────────

/**
 * How many tiles the grid draws when the pool is the whole icon pack. Every tile
 * is an inline SVG fetched on demand, and a one letter search can match
 * thousands, so that case is capped and the search box is how the rest is
 * reached. The curated pools are at most a few hundred names and always draw in
 * full, which keeps browsing free of "showing some of" arithmetic.
 */
const SYMBOL_GRID_LIMIT = 120;

/**
 * Which names the grid offers, and whether they came from the icon pack rather
 * than the curated catalogue.
 *
 * The installed pack is the authority on what will actually draw, so when one is
 * present every curated list is filtered down to it. A picker tile with no
 * picture in it helps nobody, and a name the pack lacks can still be typed into
 * the field. With no pack at all (`known` empty) nothing is filtered and the
 * tiles show names only.
 */
export function symbolPool(
  category: string,
  query: string,
  pack: readonly string[],
  known: Set<string>
): { names: string[]; fromPack: boolean } {
  const drawable = (list: readonly string[]) => (known.size === 0 ? [...list] : list.filter((s) => known.has(s)));
  if (category !== "") {
    return { names: drawable(SYMBOL_CATEGORIES.find((c) => c.name === category)?.symbols ?? []), fromPack: false };
  }
  // Searching reaches the whole pack; browsing starts from the curated set,
  // which is short enough to skim and ordered by category.
  if (query.trim() !== "" && pack.length > 0) return { names: [...pack], fromPack: true };
  return { names: drawable(CURATED_SYMBOLS), fromPack: false };
}

/** How many of a list the installed pack can actually draw, which is what both
 * the grid and every count in the picker is measured in. */
export function drawableCount(list: readonly string[], known: Set<string>): number {
  return known.size === 0 ? list.length : list.filter((s) => known.has(s)).length;
}

/** The category dropdown. Each label carries its own size, so choosing one is a
 * decision made before the grid redraws rather than after. */
export function symbolChoices(known: Set<string>): { value: string; label: string }[] {
  return [
    { value: "", label: `Starter set (${drawableCount(CURATED_SYMBOLS, known)})` },
    ...SYMBOL_CATEGORIES.map((c) => ({ value: c.name, label: `${c.name} (${drawableCount(c.symbols, known)})` })),
  ];
}

/** Everything a search can reach: the whole installed pack, or the curated
 * catalogue when no pack answers with its names. Both the starter set and each
 * category are a window onto this, and the dropdown already sizes those, so this
 * is the one number the picker cannot show anywhere else. */
export function reachableCount(pack: readonly string[]): number {
  return pack.length > 0 ? pack.length : CURATED_SYMBOLS.length;
}

/**
 * The line under the grid.
 *
 * With nothing typed it reports everything reachable, whatever set is chosen.
 * The dropdown already says how big each set is, so repeating that here would
 * waste the one line that can say how much more there is to find. Once a search
 * is running it counts matches, and never says "x of x", because a count is a
 * total when nothing was left out and only truncation needs the arithmetic.
 */
export function symbolCount(shown: number, matches: number, searching: boolean, reachable: number): string {
  if (!searching) return reachable === 1 ? "1 symbol available." : `${reachable} symbols available.`;
  if (matches > shown) return `Showing ${shown} of ${matches}. Type more to narrow it down.`;
  return matches === 1 ? "1 symbol matches." : `${matches} symbols match.`;
}

function symbolTile(host: EditorHost, name: string, selected: boolean, pick: (n: string) => void): TemplateResult {
  // The colour passed here is overridden by CSS `currentColor`, which wins over
  // the presentation attribute the provider writes, so tiles follow the theme.
  const glyph = host.icons.render(name, 22, "#FFFFFF");
  return html`<button type="button" class="sym ${selected ? "on" : ""}" title=${name} @click=${() => pick(name)}>
    <span class="sym-glyph">${glyph ?? html`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${name}</span>
  </button>`;
}

/** A name field plus a searchable grid of glyphs. Stores the canonical Apple
 * name, never the Home Assistant asset name. */
function symbolField(host: EditorHost, symbol: string, set: (v: string) => void, key: string): TemplateResult {
  const browser = host.symbols;
  const open = browser.isOpen(key);
  const query = browser.query(key);
  const listed = host.icons.names();
  const pack = listed ?? [];
  const known = new Set(pack);
  const current = symbol.trim();
  const missing = current !== "" && known.size > 0 && !known.has(current);
  const pick = (name: string) => {
    set(name);
    browser.noteUsed(name);
  };

  let browsePane: TemplateResult | typeof nothing = nothing;
  if (open) {
    const category = browser.category(key);
    const pool = symbolPool(category, query, pack, known);
    const matches = searchSymbols(pool.names, query);
    const shown = pool.fromPack ? matches.slice(0, SYMBOL_GRID_LIMIT) : matches;
    const recent = known.size === 0 ? browser.recent : browser.recent.filter((s) => known.has(s));
    browsePane = html`<div class="sym-browse">
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${query} @input=${onInput((v) => browser.setQuery(key, v))} />
        <select @change=${onInput((v) => browser.setCategory(key, v))}>
          ${symbolChoices(known).map(
            (c) => html`<option value=${c.value} ?selected=${c.value === category}>${c.label}</option>`
          )}
        </select>
      </div>
      ${recent.length === 0 ? nothing : html`<div class="hint">Recent</div>
        <div class="sym-grid one-row">${recent.map((n) => symbolTile(host, n, n === current, pick))}</div>`}
      <div class="sym-grid">${shown.map((n) => symbolTile(host, n, n === current, pick))}</div>
      ${matches.length === 0
        ? html`<div class="hint">Nothing matches that search. Any name can still be typed above.</div>`
        : html`<div class="hint">
            ${symbolCount(shown.length, matches.length, query.trim() !== "", reachableCount(pack))}
          </div>`}
      ${!host.icons.available()
        ? html`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`
        : listed !== undefined && listed.length === 0
          ? html`<div class="hint">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`
          : nothing}
    </div>`;
  }

  return html`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${symbol} placeholder="lightbulb.fill"
        @input=${onInput(set)} @change=${onInput((v) => {
          // A typed name only joins the recents list once it is known to be
          // real, so a half finished name never sticks around as a tile.
          if (known.size === 0 || known.has(v.trim())) browser.noteUsed(v);
        })} /></label>
    ${missing ? html`<div class="hint warn">The installed icon pack has no <code>${current}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>` : nothing}
    <button type="button" class="link" @click=${() => browser.toggle(key)}>${open ? "Hide symbols" : "Browse symbols"}</button>
    ${browsePane}`;
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
  /** Fixed text is an SF Symbol name, so offer the picker instead of a plain field. */
  symbol?: boolean;
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
      body = opts.symbol
        ? symbolField(host, k.value, (v) => setKind({ ...k, value: v }), key)
        : textField("Text", k.value, (v) => setKind({ ...k, value: v }));
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

/** A tap layer offers everything but "Nothing": a layer that does nothing would
 * just let the tap fall through to the whole-complication action, which is what
 * deleting the layer does. */
const LAYER_TAP_TYPES: [TapAction["type"], string][] = TAP_TYPES.filter(([t]) => t !== "none");

// There is no slot picker. The slot index is plumbing: the panel assigns the
// first free one at create/duplicate time and it never changes afterwards,
// because moving a complication to another slot blanks its placement on the
// watch face. The face picker lists complications by name, so the number
// means nothing to the user.

/** Whether the current name differs from the one the watch last had, ignoring
 * surrounding whitespace and blanks. Undefined `savedName` means a brand-new
 * complication with nothing on the watch yet, so there is nothing to warn about. */
export function nameChangedFromWatch(savedName: string | undefined, name: string): boolean {
  return savedName !== undefined && name.trim() !== "" && name.trim() !== savedName.trim();
}

export function generalEditor(host: EditorHost): TemplateResult {
  const cfg = host.config;
  const tap = cfg.tapAction;
  const needsEntity = (t: TapAction["type"]) => ["toggleEntity", "runScene", "runScript", "addTodo", "runHTTPAction"].includes(t);
  // The watch face picker caches each complication's name per widget kind and
  // does not refresh it after a rename. Warn once the name actually differs
  // from what the watch last had, so the user knows to re-pick it there.
  const renamed = nameChangedFromWatch(host.savedName, cfg.name);
  return html`
    ${textField("Name", cfg.name, (v) => host.update((c) => { c.name = v; }, "name"))}
    ${renamed ? html`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>` : nothing}
    ${numberField("Refresh every (minutes, 0 = never)", cfg.refreshMinutes ?? 0, (v) => host.update((c) => { c.refreshMinutes = v ?? 0; }, "refresh"), { step: 1, min: 0 })}
    ${selectField("Tap action", tap.type, TAP_TYPES, (v) => host.update((c) => {
      c.tapAction = needsEntity(v) ? { type: v as "toggleEntity", ...("entityId" in c.tapAction ? { entityId: c.tapAction.entityId, displayName: c.tapAction.displayName, domain: c.tapAction.domain } : { entityId: "", displayName: "", domain: "" }) } : { type: v as "refresh" };
      // Mirrors the iPhone preset editor: the chosen page belongs to the
      // openPage type; leaving it clears the choice.
      if (v !== "openPage") { delete c.openPageId; delete c.openPageName; }
    }))}
    ${"entityId" in tap ? entityField(host, "Target", tap, (ref) => host.update((c) => { c.tapAction = { type: tap.type, ...ref }; }, "tap-entity"), "tap") : nothing}
    ${tap.type === "openPage" ? openPageField(host) : nothing}
    ${checkField("Flash on success", cfg.showSuccessFlash ?? true, (v) => host.update((c) => { c.showSuccessFlash = v; }))}
    ${colorField("Flash colour (blank = green)", cfg.successFlashColorHex, (v) => host.update((c) => { if (v === undefined) delete c.successFlashColorHex; else c.successFlashColorHex = v; }, "flash"), true)}
    ${layoutsRow(host)}`;
}

/** The shapes this complication has: one tab per supported shape (click to
 * edit it) and an "Add layout" menu for the missing ones. Removing a shape
 * lives in that shape's own layout tab. Adding a shape seeds its layout in
 * the same update, so the set and the document never disagree. */
function layoutsRow(host: EditorHost): TemplateResult {
  const cfg = host.config;
  const have = supportedFamilies(cfg);
  const missing = missingFamilies(cfg);
  return html`
    <div class="field"><span>Layouts</span>
      <div class="chips">
        ${have.map((f) => html`<button class="chip ${f === host.activeFamily ? "active" : ""}" title=${`Edit the ${familyTitle(f)} layout`} @click=${() => host.setActiveFamily(f)}>${familyTitle(f)}</button>`)}
        ${missing.length > 0 ? html`<select class="chip-add" title="Add a layout" @change=${(e: Event) => {
          const sel = e.target as HTMLSelectElement;
          const f = sel.value as FamilyKind | "";
          sel.value = "";
          if (f) host.addFamily(f);
        }}>
          <option value="" selected>Add layout…</option>
          ${missing.map((f) => html`<option value=${f}>${familyTitle(f)}</option>`)}
        </select>` : nothing}
      </div>
    </div>
    <div class="hint">The watch lists this complication in the face picker for these shapes only. Inline is one line of text with no canvas.</div>`;
}

/** Page picker for the openPage tap action. Options come from the watch's
 * page report; a stored id the report no longer lists stays selectable under
 * its stored name so opening the editor never silently drops the choice. */
function openPageField(host: EditorHost): TemplateResult {
  const cfg = host.config;
  return pageChoiceField(host, cfg.openPageId, cfg.openPageName, (id, name) => host.update((c) => {
    if (id === undefined) { delete c.openPageId; delete c.openPageName; return; }
    c.openPageId = id;
    if (name) c.openPageName = name; else delete c.openPageName;
  }));
}

/** The page picker behind an openPage action, for the document and for a tap
 * layer alike. `set` gets undefined when the choice is cleared, else the page
 * id and its name when the watch reported one. */
function pageChoiceField(host: EditorHost, pageId: string | undefined, pageName: string | undefined, set: (id: string | undefined, name: string | undefined) => void): TemplateResult {
  const current = pageId ?? "";
  const options: [string, string][] = host.pages.map((p) => [p.id, p.name || "Unnamed page"]);
  if (current && !host.pages.some((p) => p.id.toUpperCase() === current.toUpperCase())) {
    options.unshift([current, `${pageName || "Unknown page"} (not on the watch)`]);
  }
  if (!current) options.unshift(["", "Choose a page…"]);
  if (options.length <= 1 && !current) {
    return html`<div class="hint">No pages reported yet. Open the watch app once so it can send its page list.</div>`;
  }
  return html`${selectField("Page", current, options, (v) => {
    if (!v) { set(undefined, undefined); return; }
    set(v, host.pages.find((p) => p.id === v)?.name);
  })}
  ${current ? nothing : html`<div class="hint">Without a page the tap falls back to the complication list.</div>`}`;
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
    layout = { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] };
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
    case "image": return undefined;
    case "tap": return undefined;
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
        </div>
        ${checkField("Live countdown", el.payload.countdown === true, (v) => upd((e) => {
          const p = (e as typeof el).payload;
          if (v) p.countdown = true; else delete p.countdown;
        }))}
        ${el.payload.countdown ? html`<div class="hint">Ticks down to the value's target: an active HA timer's finish, or any future timestamp. Paused timers show their remaining time; idle ones show "Idle".</div>` : nothing}`;
      break;
    case "icon":
      content = html`
        ${valueEditor(host, el.payload.symbol, (v) => upd((e) => { (e as typeof el).payload.symbol = v; }, "symbol"), { noFormat: true, showResolved: true, symbol: true, key: `${key}-symbol` })}
        <div class="hint">An entity source uses that entity's own icon instead.</div>
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
    case "image":
      content = html`
        ${entityField(host, "Camera", el.payload.entity, (ref) => upd((e) => { (e as typeof el).payload.entity = ref; }, "entity"), key)}
        ${el.payload.entity.entityId && !el.payload.entity.entityId.startsWith("camera.") ? html`<div class="hint warn">Pick a camera.* entity — only cameras have snapshots.</div>` : nothing}
        ${checkField("Show timestamp", el.payload.timestamp === true, (v) => upd((e) => {
          const p = (e as typeof el).payload;
          if (v) p.timestamp = true; else delete p.timestamp;
        }))}
        <div class="hint">The watch fetches a fresh snapshot on refresh and shows the cached frame in between; the timestamp says when it was taken. This preview shows the camera's live picture.</div>`;
      break;
    case "tap": {
      const tap = el.payload.action;
      const needsEntity = (t: TapAction["type"]) => ["toggleEntity", "runScene", "runScript", "addTodo", "runHTTPAction"].includes(t);
      content = html`
        ${selectField("Tap action", tap.type, LAYER_TAP_TYPES, (v) => upd((e) => {
          const p = (e as typeof el).payload;
          p.action = needsEntity(v) ? { type: v as "toggleEntity", ...("entityId" in p.action ? { entityId: p.action.entityId, displayName: p.action.displayName, domain: p.action.domain } : { entityId: "", displayName: "", domain: "" }) } : { type: v as "refresh" };
          if (v !== "openPage") { delete p.openPageId; delete p.openPageName; }
        }))}
        ${"entityId" in tap ? entityField(host, "Target", tap, (ref) => upd((e) => { (e as typeof el).payload.action = { type: tap.type, ...ref }; }, "tap-entity"), `${key}-tap`) : nothing}
        ${tap.type === "openPage" ? pageChoiceField(host, el.payload.openPageId, el.payload.openPageName, (pid, name) => upd((e) => {
          const p = (e as typeof el).payload;
          if (pid === undefined) { delete p.openPageId; delete p.openPageName; return; }
          p.openPageId = pid;
          if (name) p.openPageName = name; else delete p.openPageName;
        }, "tap-page")) : nothing}
        <div class="hint">An invisible tap area. On the watch, a tap inside this frame runs this action; the rest of the complication keeps the tap action on the General tab. Put it over a row, an icon, or any part you want to respond on its own. Layers higher in the list win where two overlap.</div>`;
      break;
    }
  }

  return html`
    ${content}
    ${el.kind === "image" || el.kind === "tap" ? nothing : colorField(el.kind === "shape" ? "Fill colour" : "Colour", el.payload.colorSlot.baseColorHex, (v) => upd((e) => { if (e.kind !== "image" && e.kind !== "tap") e.payload.colorSlot.baseColorHex = v ?? "#FFFFFF"; }, "color"))}
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
    ${el.kind === "shape" || el.kind === "image" || el.kind === "tap" ? nothing : html`<div class="row-inline">
      ${numberField(`${sizeLabel} in ${familyTitle(family)} (blank = shared ${elementSize(el)})`, eff.size, (v) => host.update((c) => (v === undefined ? setPlacement(c, family, id, {}, true) : setPlacement(c, family, id, { size: v })), `${key}-psize-${family}`), { step: 1, min: 1, optional: true })}
    </div>`}
    <div class="hint">Drag the layer in the ${familyTitle(family)} preview to move it. Drag a corner to resize it. Frames are fractions of the canvas.</div>
    <div class="hint">${el.payload.rules.length === 0 ? "No rules." : `${el.payload.rules.length} rule${el.payload.rules.length === 1 ? "" : "s"}.`} Use the Rules tab to change how this layer reacts to values.</div>`;
}

// ── Family layout ─────────────────────────────────────────────────────────

export function familyEditor(host: EditorHost, family: FamilyKind): TemplateResult {
  if (family === "inline") return html`${inlineEditor(host)}${removeLayoutRow(host, family)}`;
  const layout = host.config.perFamily[family];
  if (!layout) {
    return html`<div class="hint">No settings stored for ${familyTitle(family)} yet.</div>
      <button class="small" @click=${() => host.update((c) => { c.perFamily[family] = { placements: {}, cornerBodyShape: "circle", borderWidth: 2, rules: [] }; })}>Add ${familyTitle(family)} settings</button>
      ${removeLayoutRow(host, family)}`;
  }
  const upd = (mutate: (l: FamilyLayout) => void, k?: string) => host.update((c) => mutate(c.perFamily[family]!), k ? `fam-${family}-${k}` : undefined);
  const placed = Object.keys(layout.placements).length;
  return html`
    ${colorField("Background (blank = transparent)", layout.backgroundColorHex, (v) => upd((l) => { if (v === undefined) delete l.backgroundColorHex; else l.backgroundColorHex = v; }, "bg"), true)}
    ${colorField("Border colour", layout.borderColorHex, (v) => upd((l) => { if (v === undefined) delete l.borderColorHex; else l.borderColorHex = v; }, "border"), true)}
    ${numberField("Border width (pt)", layout.borderWidth, (v) => upd((l) => { l.borderWidth = v ?? 2; }, "bw"), { step: 0.5, min: 0 })}
    ${family === "corner" ? cornerEditor(host, layout, upd) : nothing}
    <div class="hint">${placed === 0 ? "Layers use their shared frames here." : `${placed} layer${placed === 1 ? " has" : "s have"} a ${familyTitle(family)} placement.`}</div>
    ${placed > 0 ? html`<button class="small" @click=${() => upd((l) => { l.placements = {}; })}>Reset placements to the shared frames</button>` : nothing}
    <div class="hint">${layout.rules.length === 0 ? "No layout rules." : `${layout.rules.length} layout rule${layout.rules.length === 1 ? "" : "s"}.`} Use the Rules tab to change the background, border, and bezel label from values.</div>
    ${removeLayoutRow(host, family)}`;
}

/** "Remove layout" sits in the shape's own tab. Disabled on the last
 * remaining shape (the set is never empty). The host confirms when the
 * layout has content. */
function removeLayoutRow(host: EditorHost, family: FamilyKind): TemplateResult {
  const last = !canRemoveFamily(host.config, family);
  const title = last
    ? "A complication keeps at least one shape."
    : `Drop the ${familyTitle(family)} shape. The watch stops listing this complication for ${familyTitle(family)} slots.`;
  return html`<h3>Shape</h3>
    <div class="adders">
      <button class="danger small" ?disabled=${last} title=${title} @click=${() => host.removeFamily(family)}>Remove ${familyTitle(family)} layout</button>
    </div>
    ${last ? html`<div class="hint">This is the only shape. Add another before removing it.</div>` : nothing}`;
}

/** The Inline shape: one line of text, no canvas. The watch draws
 * `symbol label: value` and drops the label when the face is narrow. The
 * value is the same control a text layer uses, so an entity, an attribute or
 * a template all work; the symbol is the same picker an icon layer uses. */
function inlineEditor(host: EditorHost): TemplateResult {
  const inline = host.config.inline;
  if (!inline) {
    return html`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${() => host.addFamily("inline")}>Add Inline text</button>`;
  }
  const upd = (mutate: (i: NonNullable<CustomComplicationConfig["inline"]>) => void, k?: string) => host.update((c) => { if (c.inline) mutate(c.inline); }, k ? `inline-${k}` : undefined);
  return html`
    ${textField("Label (blank = value only)", inline.label ?? "", (v) => upd((i) => { if (v) i.label = v; else delete i.label; }, "label"))}
    ${valueEditor(host, inline.value, (v) => upd((i) => { i.value = v; }, "value"), { showResolved: true, key: "inline-value" })}
    ${checkField("Live countdown", inline.countdown === true, (v) => upd((i) => { if (v) i.countdown = true; else delete i.countdown; }))}
    ${inline.countdown ? html`<div class="hint">Ticks down to the value's target: an active HA timer's finish, or any future timestamp. Paused timers show their remaining time; idle ones show "Idle".</div>` : nothing}
    <h3>Symbol</h3>
    ${symbolField(host, inline.symbol ?? "", (v) => upd((i) => { if (v) i.symbol = v; else delete i.symbol; }, "symbol"), "inline-symbol")}
    <div class="hint">Drawn before the text. Leave blank for text only.</div>
    <div class="hint">On the face: ${inline.symbol ? `${inline.symbol} ` : ""}${inline.label ? `${inline.label}: ` : ""}${host.resolve(inline.value) ?? "--"}</div>`;
}

/** Corner-only controls: main content mode (canvas vs big curved text) and the
 * bezel (none / text label / gauge arc), matching what the watch can draw. */
function cornerEditor(
  host: EditorHost,
  layout: FamilyLayout,
  upd: (mutate: (l: FamilyLayout) => void, k?: string) => void,
): TemplateResult {
  const mode: "canvas" | "curved" = layout.curvedText ? "curved" : "canvas";
  const bezelKind: "none" | "text" | "gauge" = layout.bezelGauge ? "gauge" : layout.bezelText ? "text" : "none";
  return html`
    <h3>Corner content</h3>
    ${selectField("Main content", mode, [["canvas", "Layer canvas (circle)"], ["curved", "Big curved text"]], (v) => upd((l) => {
      if (v === "curved") { if (!l.curvedText) l.curvedText = literal("Text"); }
      else { delete l.curvedText; delete l.curvedColorHex; }
    }))}
    ${mode === "curved" && layout.curvedText ? html`
      ${valueEditor(host, layout.curvedText, (val) => upd((l) => { l.curvedText = val; }, "curved"), { showResolved: true, key: "fam-corner-curved" })}
      ${colorField("Curved text colour", layout.curvedColorHex ?? "#FFFFFF", (v) => upd((l) => { if (v === undefined) delete l.curvedColorHex; else l.curvedColorHex = v; }, "curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    ` : nothing}
    ${selectField("Bezel", bezelKind, [["none", "None (biggest circle)"], ["text", "Text label"], ["gauge", "Gauge arc"]], (v) => upd((l) => {
      if (v === "text") { delete l.bezelGauge; if (!l.bezelText) l.bezelText = literal("Label"); }
      else if (v === "gauge") { delete l.bezelText; if (!l.bezelGauge) l.bezelGauge = { value: literal("50"), minValue: 0, maxValue: 100, colorHexes: ["#34C759", "#FFCC00", "#FF3B30"] }; }
      else { delete l.bezelText; delete l.bezelGauge; }
    }))}
    ${bezelKind === "text" && layout.bezelText ? html`
      ${valueEditor(host, layout.bezelText, (val) => upd((l) => { l.bezelText = val; }, "bezel"), { showResolved: true, key: "fam-corner-bezel" })}
      ${checkField("Live countdown", layout.bezelCountdown === true, (v) => upd((l) => {
        if (v) l.bezelCountdown = true; else delete l.bezelCountdown;
      }))}` : nothing}
    ${bezelKind === "gauge" && layout.bezelGauge ? bezelGaugeEditor(host, layout.bezelGauge, upd) : nothing}`;
}

function bezelGaugeEditor(
  host: EditorHost,
  g: BezelGauge,
  upd: (mutate: (l: FamilyLayout) => void, k?: string) => void,
): TemplateResult {
  const stops = [
    g.colorHexes[0] ?? "#34C759",
    g.colorHexes[1] ?? g.colorHexes[g.colorHexes.length - 1] ?? "#FFCC00",
    g.colorHexes[g.colorHexes.length - 1] ?? "#FF3B30",
  ];
  const setStop = (i: number) => (v: string | undefined) => upd((l) => {
    const next = [...stops];
    next[i] = v ?? next[i]!;
    l.bezelGauge!.colorHexes = next;
  }, `gstop${i}`);
  return html`
    ${valueEditor(host, g.value, (val) => upd((l) => { l.bezelGauge!.value = val; }, "gvalue"), { showResolved: true, key: "fam-corner-gvalue" })}
    <div class="grid2">
      ${numberField("Gauge min", g.minValue, (v) => upd((l) => { l.bezelGauge!.minValue = v ?? 0; }, "gmin"), { step: 1 })}
      ${numberField("Gauge max", g.maxValue, (v) => upd((l) => { l.bezelGauge!.maxValue = v ?? 100; }, "gmax"), { step: 1 })}
    </div>
    ${colorField("Arc colour (min end)", stops[0], setStop(0))}
    ${colorField("Arc colour (middle)", stops[1], setStop(1))}
    ${colorField("Arc colour (max end)", stops[2], setStop(2))}
    ${checkField("End number labels", !!(g.minLabel || g.maxLabel), (v) => upd((l) => {
      const gauge = l.bezelGauge!;
      if (v) { gauge.minLabel = literal(String(gauge.minValue)); gauge.maxLabel = literal(String(gauge.maxValue)); }
      else { delete gauge.minLabel; delete gauge.maxLabel; }
    }))}
    ${g.minLabel ? valueEditor(host, g.minLabel, (val) => upd((l) => { l.bezelGauge!.minLabel = val; }, "gminlab"), { key: "fam-corner-gminlab" }) : nothing}
    ${g.maxLabel ? valueEditor(host, g.maxLabel, (val) => upd((l) => { l.bezelGauge!.maxLabel = val; }, "gmaxlab"), { key: "fam-corner-gmaxlab" }) : nothing}`;
}

export const FAMILY_OPTIONS = DRAWABLE_FAMILIES.map((f): [FamilyKind, string] => [f, familyTitle(f)]);
export type { Comparison };

// ── Rules ─────────────────────────────────────────────────────────────────

const COMPARISON_LABELS: Record<ComparisonKind, string> = {
  isOn: "is on", isOff: "is off", equals: "equals", notEquals: "does not equal",
  isUnavailable: "is unavailable or unknown", isStale: "data is stale", isEmpty: "is empty",
  greaterThan: "is greater than", greaterOrEqual: "is at least", lessThan: "is less than", lessOrEqual: "is at most",
  between: "is between", contains: "contains", startsWith: "starts with", endsWith: "ends with",
  matchesRegex: "matches regex", isOneOf: "is one of",
};

const CHANGE_LABELS: Record<StyleChangeKind, string> = {
  setColor: "Set colour", setOpacity: "Set opacity", setText: "Set text", setIcon: "Set icon",
  setFontSize: "Set size", setFontWeight: "Set weight", setRotation: "Set rotation",
  hide: "Hide", show: "Show", setGaugeValue: "Set gauge value", setGaugeMin: "Set gauge min", setGaugeMax: "Set gauge max",
  setBorderColor: "Set border colour", setBorderWidth: "Set border width", setBackgroundColor: "Set background colour",
};

const CHANGE_KINDS = Object.keys(CHANGE_LABELS) as StyleChangeKind[];

function changeKindsFor(target: RuleTarget): StyleChangeKind[] {
  const allowed = RULE_TARGET_PROPERTIES[target];
  return CHANGE_KINDS.filter((k) => allowed.includes(STYLE_PROPERTY[k]));
}

/** Short one-line description of a value, for rule summaries. */
export function describeValue(v: Value): string {
  const k = v.kind;
  switch (k.kind) {
    case "literal": return k.value ? `"${k.value}"` : "(empty)";
    case "entityState": return k.entityId || "(no entity)";
    case "entityAttribute": return `${k.entityId}.${k.attribute}`;
    case "entityAge": return `age of ${k.entityId}`;
    case "aggregate": return `${k.aggregate.function}(...)`;
    case "time": return `time.${k.timeField}`;
    case "dataAge": return "data age";
    case "jinja": return "jinja";
    case "named": return `named ${k.id.slice(0, 8)}`;
  }
}

function moveItem<T>(list: T[], from: number, to: number): void {
  if (to < 0 || to >= list.length) return;
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item!);
}

/**
 * Rule list editor for one layer or one family layout. `locate` finds the
 * live rule array inside a config so every edit goes through the undo history.
 */
export function rulesEditor(host: EditorHost, rules: Rule[], target: RuleTarget, locate: (cfg: CustomComplicationConfig) => Rule[] | undefined, key: string): TemplateResult {
  const upd = (mutate: (rules: Rule[]) => void, k?: string) => host.update((c) => { const r = locate(c); if (r) mutate(r); }, k ? `${key}-${k}` : undefined);
  return html`
    ${rules.length === 0 ? html`<div class="hint">No rules yet. A rule checks values and changes how this ${target === "layout" ? "family" : "layer"} looks.</div>` : nothing}
    ${rules.map((rule, ri) => ruleEditor(host, rule, ri, rules.length, target, upd, `${key}-${rule.id}`))}
    <div class="adders"><button class="small" @click=${() => upd((r) => { r.push(newRule()); })}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`;
}

function ruleEditor(host: EditorHost, rule: Rule, ri: number, count: number, target: RuleTarget, upd: (m: (rules: Rule[]) => void, k?: string) => void, key: string): TemplateResult {
  const live = host.liveBranch(rule);
  const current = host.forced.get(rule.id) ?? "live";
  const isActive = (v: string) => (current === "live" ? v === "live" : current === "otherwise" ? v === "otherwise" : current.caseId === v);
  const updRule = (m: (r: Rule) => void, k?: string) => upd((rs) => { const r = rs.find((x) => x.id === rule.id); if (r) m(r); }, k);
  return html`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${ri + 1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${ri === 0} @click=${() => upd((rs) => moveItem(rs, ri, ri - 1))}>▲</button>
      <button class="icon" title="Move down" ?disabled=${ri === count - 1} @click=${() => upd((rs) => moveItem(rs, ri, ri + 1))}>▼</button>
      <button class="icon" title="Delete rule" @click=${() => upd((rs) => { const i = rs.findIndex((x) => x.id === rule.id); if (i >= 0) rs.splice(i, 1); })}>×</button>
    </div>
    <div class="branches">
      <span class="hint" style="margin:0 4px 0 0">Preview:</span>
      <button class=${isActive("live") ? "active" : ""} @click=${() => host.setForced(rule.id, "live")}>Live</button>
      ${rule.cases.map((c, i) => html`<button class="${isActive(c.id) ? "active" : ""} ${live === c.id ? "live-match" : ""}" @click=${() => host.setForced(rule.id, { caseId: c.id })}>Case ${i + 1}</button>`)}
      ${rule.otherwise ? html`<button class="${isActive("otherwise") ? "active" : ""} ${live === "otherwise" ? "live-match" : ""}" @click=${() => host.setForced(rule.id, "otherwise")}>Otherwise</button>` : nothing}
    </div>
    ${rule.cases.map((c, ci) => caseEditor(host, c, ci, rule, target, updRule, `${key}-${c.id}`))}
    <div class="adders"><button class="small" @click=${() => updRule((r) => { r.cases.push(newCase()); })}>+ case</button></div>
    ${checkField("Otherwise (when no case matches)", rule.otherwise !== undefined, (v) => updRule((r) => { if (v) r.otherwise = r.otherwise ?? []; else delete r.otherwise; }))}
    ${rule.otherwise
      ? html`<div class="case-box otherwise">
          <div class="hint">${live === "otherwise" ? html`<b>Active now.</b> ` : nothing}Changes when no case matches:</div>
          ${changesEditor(host, rule.otherwise, target, (m) => updRule((r) => { if (r.otherwise) m(r.otherwise); }), `${key}-otherwise`)}
        </div>`
      : nothing}
  </div>`;
}

function caseEditor(host: EditorHost, c: RuleCase, ci: number, rule: Rule, target: RuleTarget, updRule: (m: (r: Rule) => void, k?: string) => void, key: string): TemplateResult {
  const updCase = (m: (c: RuleCase) => void, k?: string) => updRule((r) => { const x = r.cases.find((y) => y.id === c.id); if (x) m(x); }, k);
  const matches = host.liveBranch(rule) === c.id;
  return html`<div class="case-box ${matches ? "match" : ""}">
    <div class="rule-head">
      <span>Case ${ci + 1}${matches ? html` <span class="ok">· active now</span>` : nothing}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${ci === 0} @click=${() => updRule((r) => moveItem(r.cases, ci, ci - 1))}>▲</button>
      <button class="icon" title="Move down" ?disabled=${ci === rule.cases.length - 1} @click=${() => updRule((r) => moveItem(r.cases, ci, ci + 1))}>▼</button>
      <button class="icon" title="Delete case" @click=${() => updRule((r) => { const i = r.cases.findIndex((y) => y.id === c.id); if (i >= 0) r.cases.splice(i, 1); })}>×</button>
    </div>
    <div class="row-inline">
      ${selectField("When", c.when.join, [["all", "all of these are true"], ["any", "any of these is true"]], (v) => updCase((x) => { x.when.join = v; }))}
    </div>
    ${c.when.tests.length === 0 ? html`<div class="hint">No tests: this case always matches.</div>` : nothing}
    ${c.when.tests.map((t, ti) => testEditor(host, t, ti, (m) => updCase((x) => { const y = x.when.tests.find((z) => z.id === t.id); if (y) m(y); }), () => updCase((x) => { x.when.tests = x.when.tests.filter((z) => z.id !== t.id); }), `${key}-${t.id}`))}
    <div class="adders"><button class="small" @click=${() => updCase((x) => { x.when.tests.push(newTest()); })}>+ test</button></div>
    <div class="hint" style="margin-top:8px">Then:</div>
    ${changesEditor(host, c.then, target, (m) => updCase((x) => m(x.then)), `${key}-then`)}
  </div>`;
}

function testEditor(host: EditorHost, t: import("./model.js").Test, ti: number, updTest: (m: (t: import("./model.js").Test) => void, k?: string) => void, remove: () => void, key: string): TemplateResult {
  const upd = (m: (t: import("./model.js").Test) => void, k?: string) => updTest(m, k ? `${key}-${k}` : undefined);
  const c = t.comparison;
  const operand = comparisonOperand(c.kind);
  const result = host.evaluateTest(t);
  let extra: TemplateResult | typeof nothing = nothing;
  switch (operand) {
    case "value":
      extra = html`<details class="sub" open><summary>Compare with: ${c.value ? describeValue(c.value) : "(empty)"}</summary>
        ${valueEditor(host, c.value ?? literal(""), (v) => upd((x) => { x.comparison.value = v; }, "rhs"), { showResolved: true, key: `${key}-rhs` })}</details>`;
      break;
    case "between":
      extra = html`<details class="sub" open><summary>Lower bound: ${c.value ? describeValue(c.value) : "(empty)"}</summary>
        ${valueEditor(host, c.value ?? literal(""), (v) => upd((x) => { x.comparison.value = v; }, "rhs"), { showResolved: true, key: `${key}-rhs` })}</details>
        <details class="sub" open><summary>Upper bound: ${c.upper ? describeValue(c.upper) : "(empty)"}</summary>
        ${valueEditor(host, c.upper ?? literal(""), (v) => upd((x) => { x.comparison.upper = v; }, "upper"), { showResolved: true, key: `${key}-upper` })}</details>`;
      break;
    case "pattern":
      extra = html`${textField("Pattern", c.pattern ?? "", (v) => upd((x) => { x.comparison.pattern = v; }, "pattern"), { mono: true, placeholder: "^on$" })}
        ${c.pattern && !regexOk(c.pattern) ? html`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>` : nothing}`;
      break;
    case "options":
      extra = textField("Options (comma separated)", (c.options ?? []).join(", "), (v) => upd((x) => { x.comparison.options = v.split(",").map((s) => s.trim()).filter(Boolean); }, "options"));
      break;
    case "none":
      break;
  }
  return html`<div class="test-box">
    <div class="rule-head">
      <span>Test ${ti + 1} <span class=${result ? "ok" : "no"}>${result ? "✓ true now" : "✗ false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon" title="Delete test" @click=${remove}>×</button>
    </div>
    ${c.kind === "isStale"
      ? html`<div class="hint">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`
      : html`<details class="sub" open><summary>Value: ${describeValue(t.value)}</summary>
          ${valueEditor(host, t.value, (v) => upd((x) => { x.value = v; }, "lhs"), { showResolved: true, key: `${key}-lhs` })}</details>`}
    ${selectField("Comparison", c.kind, COMPARISON_KINDS.map((k): [ComparisonKind, string] => [k, COMPARISON_LABELS[k]]), (v) => upd((x) => { x.comparison = switchComparison(x.comparison, v); }))}
    ${extra}
  </div>`;
}

function regexOk(pattern: string): boolean {
  try { new RegExp(pattern); return true; } catch { return false; }
}

function changesEditor(host: EditorHost, changes: StyleChange[], target: RuleTarget, updList: (m: (list: StyleChange[]) => void, k?: string) => void, key: string): TemplateResult {
  const allowed = changeKindsFor(target);
  return html`
    ${changes.length === 0 ? html`<div class="hint">No changes.</div>` : nothing}
    ${changes.map((ch, i) => changeEditor(host, ch, i, target, (m, k) => updList((list) => { if (list[i]) m(list[i]!); }, k ? `${key}-${i}-${k}` : undefined), () => updList((list) => { list.splice(i, 1); }), `${key}-${i}`))}
    <select class="adder" @change=${(e: Event) => { const sel = e.target as HTMLSelectElement; const kind = sel.value as StyleChangeKind; sel.value = ""; if (kind) updList((list) => { list.push(newStyleChange(kind)); }); }}>
      <option value="">+ change…</option>
      ${allowed.map((k) => html`<option value=${k}>${CHANGE_LABELS[k]}</option>`)}
    </select>`;
}

const COLOR_KINDS: StyleChangeKind[] = ["setColor", "setBorderColor", "setBackgroundColor"];

function changeEditor(host: EditorHost, ch: StyleChange, i: number, target: RuleTarget, upd: (m: (c: StyleChange) => void, k?: string) => void, remove: () => void, key: string): TemplateResult {
  const ignored = !RULE_TARGET_PROPERTIES[target].includes(STYLE_PROPERTY[ch.kind]);
  const payload = styleChangePayload(ch.kind);
  let body: TemplateResult | typeof nothing = nothing;
  if (payload === "value") {
    const v = ch.value ?? literal("");
    if (COLOR_KINDS.includes(ch.kind)) {
      const fixed = v.kind.kind === "literal";
      body = html`${fixed
        ? colorField("Colour", v.kind.kind === "literal" ? v.kind.value : "", (hex) => upd((c) => { c.value = literal(hex ?? "#FFFFFF"); }, "color"))
        : valueEditor(host, v, (nv) => upd((c) => { c.value = nv; }, "value"), { noFormat: true, showResolved: true, key: `${key}-value` })}
        <button class="link" @click=${() => upd((c) => { c.value = fixed ? { kind: { kind: "entityAttribute", entityId: "", displayName: "", domain: "", attribute: "rgb_color" } } : literal("#FFFFFF"); })}>${fixed ? "Read the colour from a value instead" : "Use a fixed colour instead"}</button>
        ${fixed ? nothing : html`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`;
    } else {
      body = valueEditor(host, v, (nv) => upd((c) => { c.value = nv; }, "value"), { noFormat: ch.kind === "setIcon", symbol: ch.kind === "setIcon", showResolved: true, key: `${key}-value` });
    }
  } else if (payload === "number") {
    const opts = ch.kind === "setOpacity" ? { step: 0.05, min: 0, max: 1 } : ch.kind === "setRotation" ? { step: 1 } : { step: 0.5, min: 0 };
    body = numberField(ch.kind === "setOpacity" ? "Opacity (0 to 1)" : ch.kind === "setRotation" ? "Degrees" : ch.kind === "setFontSize" ? "Points" : "Value", ch.number ?? 0, (n) => upd((c) => { c.number = n ?? 0; }, "number"), opts);
  } else if (payload === "weight") {
    body = selectField("Weight", ch.weight ?? "regular", FONT_WEIGHTS, (w) => upd((c) => { c.weight = w; }));
  }
  return html`<div class="change-box">
    <div class="rule-head">
      <span>${CHANGE_LABELS[ch.kind]}${ignored ? html` <span class="no">(ignored by ${target === "layout" ? "layouts" : `${target} layers`})</span>` : nothing}</span>
      <span class="spacer"></span>
      <button class="icon" title="Delete change" @click=${remove}>×</button>
    </div>
    ${body}
  </div>`;
}
