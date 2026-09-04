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
  type StyleProperty,
  type TapAction,
  type TapElement,
  type TimeField,
  type Value,
  type ValueFormat,
  type ValueKind,
  COMPARISON_KINDS,
  DRAWABLE_FAMILIES,
  RULE_TARGET_PROPERTIES,
  STYLE_PROPERTY,
  attachTap,
  attachedTapsOf,
  comparisonOperand,
  defaultAttachedTapAction,
  detachTaps,
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
import {
  type StatesTable,
  COMPARISON_LABELS,
  DEFAULT_COLUMN,
  PROPERTY_CHANGE_KIND,
  PROPERTY_LABELS,
  TABLE_COMPARISONS,
  addStateRow,
  cellChange,
  isNumericComparison,
  looksBinary,
  moveStateRow,
  removeColumn,
  removeStateRow,
  setOtherwise,
  setTestedValue,
  shownColumns,
  statesSummary,
  tableShape,
  whenText,
} from "./states.js";
import type { ForcedBranches } from "./resolver.js";
import type { HassEntityState, HassLike } from "./ha-api.js";
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

export function entityRefFrom(states: Record<string, HassEntityState>, entityId: string): EntityRef {
  const s = states[entityId];
  const friendly = s && typeof s.attributes.friendly_name === "string" ? s.attributes.friendly_name : entityId;
  return { entityId, displayName: friendly, domain: entityId.split(".")[0] ?? "" };
}

export function entityRefFor(hass: HassLike, entityId: string): EntityRef {
  return entityRefFrom(hass.states, entityId);
}

/** One shared <datalist> of entity ids; rendered once per panel. Entity fields
 * use the search field below instead, so this is only still here for anything
 * outside this file that asks for it. */
export function entityDatalist(hass: HassLike, id: string) {
  const ids = Object.keys(hass.states).sort();
  return html`<datalist id=${id}>${ids.map((e) => html`<option value=${e}>${String(hass.states[e]?.attributes.friendly_name ?? "")}</option>`)}</datalist>`;
}

// ── entity search ─────────────────────────────────────────────────────────

/** One row of the entity search list: what the user reads, plus what gets
 * stored when they pick it. */
export interface EntityChoice {
  entityId: string;
  /** friendly_name when Home Assistant has one, else the id. */
  name: string;
  state: string;
  domain: string;
}

/** Everything the search can offer, name first. `domain` restricts the pool to
 * one domain (a camera layer only wants `camera.*`); a name typed by hand is
 * still accepted whatever the restriction. */
export function entityChoices(states: Record<string, HassEntityState>, domain?: string): EntityChoice[] {
  const out: EntityChoice[] = [];
  for (const [entityId, s] of Object.entries(states)) {
    const dom = entityId.split(".")[0] ?? "";
    if (domain !== undefined && dom !== domain) continue;
    const friendly = typeof s?.attributes?.friendly_name === "string" ? s.attributes.friendly_name.trim() : "";
    out.push({ entityId, name: friendly || entityId, state: s?.state ?? "", domain: dom });
  }
  out.sort((a, b) => a.name.localeCompare(b.name) || a.entityId.localeCompare(b.entityId));
  return out;
}

export const ENTITY_RESULT_LIMIT = 50;

/**
 * Rank the pool against what has been typed, over both the friendly name and
 * the id, because a user knows one or the other and rarely both.
 *
 * The order is: the exact id, then anything starting with the text (id before
 * name, since a typed id is usually meant literally), then anything containing
 * it, and last a multi word search where every word appears somewhere. Ties
 * keep the pool's own alphabetical order.
 */
export function searchEntities(choices: readonly EntityChoice[], query: string, limit = ENTITY_RESULT_LIMIT): EntityChoice[] {
  const q = query.trim().toLowerCase();
  if (q === "") return choices.slice(0, limit);
  const words = q.split(/\s+/);
  const scored: { c: EntityChoice; rank: number }[] = [];
  for (const c of choices) {
    const id = c.entityId.toLowerCase();
    const name = c.name.toLowerCase();
    let rank = -1;
    if (id === q) rank = 0;
    else if (id.startsWith(q)) rank = 1;
    else if (name.startsWith(q)) rank = 2;
    else if (id.includes(q)) rank = 3;
    else if (name.includes(q)) rank = 4;
    else if (words.length > 1 && words.every((w) => id.includes(w) || name.includes(w))) rank = 5;
    if (rank >= 0) scored.push({ c, rank });
  }
  scored.sort((a, b) => a.rank - b.rank || a.c.name.localeCompare(b.c.name) || a.c.entityId.localeCompare(b.c.entityId));
  return scored.slice(0, limit).map((s) => s.c);
}

const ENTITY_ID_RE = /^[a-z0-9_]+\.[a-z0-9_]+$/i;

/** Whether text is shaped like an entity id, which is what lets an id Home
 * Assistant has never heard of still be stored by hand. */
export function looksLikeEntityId(text: string): boolean {
  return ENTITY_ID_RE.test(text.trim());
}

/**
 * What a typed entity field should store when it is left.
 *
 * `undefined` means keep what is already there: the text was a half finished
 * search rather than an id, so nothing should be written over a working entity.
 */
export function commitTypedEntity(text: string, ref: EntityRef, states: Record<string, HassEntityState>): EntityRef | undefined {
  const t = text.trim();
  if (t === ref.entityId) return undefined;
  if (t === "") return { entityId: "", displayName: "", domain: "" };
  if (t in states) return entityRefFrom(states, t);
  if (looksLikeEntityId(t)) return { ...ref, entityId: t, domain: t.split(".")[0] ?? "" };
  return undefined;
}

/**
 * Transient search state, keyed by field. It is deliberately not part of the
 * draft: a half typed search is not an edit, and putting it in the document
 * would fill the undo history with keystrokes. A field with no entry here is
 * closed and shows its stored id.
 */
interface EntitySearchState { query: string; index: number }
const entitySearches = new Map<string, EntitySearchState>();

/**
 * Ask the panel to draw again after transient state changed.
 *
 * These controls are plain templates rendered by the panel rather than
 * elements of their own, so there is no reactive property to set. Walking out
 * of the shadow root reaches the panel element, whose `requestUpdate` is the
 * same thing a `@state` change would have called.
 */
function requestRerender(node: EventTarget | null): void {
  let el: Node | null = node instanceof Node ? node : null;
  for (let hops = 0; el && hops < 8; hops += 1) {
    const root = el.getRootNode();
    if (!(root instanceof ShadowRoot)) return;
    const shadowHost = root.host as HTMLElement & { requestUpdate?: () => void };
    if (typeof shadowHost.requestUpdate === "function") {
      shadowHost.requestUpdate();
      return;
    }
    el = shadowHost;
  }
}

interface EntityFieldOptions {
  /** Only offer this domain in the list (the id can still be typed). */
  domain?: string;
  /** Drop the display-name control, for rows that are already tight. */
  compact?: boolean;
}

/**
 * A search field over every entity: type part of a friendly name or part of an
 * id, arrow keys to move, Enter to take the highlighted row. Picking writes the
 * id, the friendly name and the domain together, which is what every caller
 * used to have to get right by hand.
 */
function entityField(host: EditorHost, label: string, ref: EntityRef, set: (ref: EntityRef) => void, key: string, opts: EntityFieldOptions = {}): TemplateResult {
  const states = host.hass.states;
  const search = entitySearches.get(key);
  const results = search ? searchEntities(entityChoices(states, opts.domain), search.query) : [];
  const index = search ? Math.max(0, Math.min(search.index, results.length - 1)) : 0;
  const live = ref.entityId ? states[ref.entityId] : undefined;

  const open = (target: EventTarget | null, query: string, at = 0) => {
    entitySearches.set(key, { query, index: at });
    requestRerender(target);
  };
  const close = (target: EventTarget | null) => {
    entitySearches.delete(key);
    requestRerender(target);
  };
  const commitText = (text: string) => {
    const next = commitTypedEntity(text, ref, states);
    if (next) set(next);
  };
  const pick = (choice: EntityChoice, target: EventTarget | null) => {
    set(entityRefFrom(states, choice.entityId));
    close(target);
  };

  // Read back rather than closing over `index`: a second key can arrive before
  // the redraw that the first one asked for.
  const liveIndex = () => Math.max(0, Math.min(entitySearches.get(key)?.index ?? 0, results.length - 1));

  const onKey = (e: KeyboardEvent) => {
    const el = e.target as HTMLInputElement;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const st = entitySearches.get(key);
      if (!st) { open(el, el.value); return; }
      const next = e.key === "ArrowDown" ? liveIndex() + 1 : liveIndex() - 1;
      open(el, st.query, Math.max(0, Math.min(results.length - 1, next)));
      revealHighlight(el);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const choice = results[liveIndex()];
      if (search && choice) pick(choice, el);
      else { commitText(el.value); close(el); }
      return;
    }
    if (e.key === "Escape") {
      if (!search) return;
      // Swallowed so it closes the list and not the popover around it.
      e.preventDefault();
      e.stopPropagation();
      close(el);
    }
  };

  const caption = ref.entityId === ""
    ? html`<div class="hint">Nothing chosen yet. Type a name such as "kitchen" to search.</div>`
    : live
      ? html`<div class="entity-current"><span class="ent-name">${typeof live.attributes.friendly_name === "string" ? live.attributes.friendly_name : ref.entityId}</span><span class="ent-state">${live.state}</span></div>`
      : html`<div class="hint warn">Not in Home Assistant right now.</div>`;

  return html`<div class="field entity-field">
    <span>${label}</span>
    <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${search ? "true" : "false"} autocomplete="off" spellcheck="false"
      .value=${search ? search.query : ref.entityId}
      placeholder="Search entities, or type an id"
      @focus=${(e: FocusEvent) => { const el = e.target as HTMLInputElement; open(el, ref.entityId); el.select(); }}
      @input=${(e: Event) => { const el = e.target as HTMLInputElement; open(el, el.value); }}
      @keydown=${onKey}
      @blur=${(e: FocusEvent) => { const el = e.target as HTMLInputElement; if (search) commitText(el.value); close(el); }} />
    ${search
      ? html`<div class="entity-results" role="listbox">
          ${results.length === 0
            ? html`<div class="hint" style="padding:6px 8px">${looksLikeEntityId(search.query) ? "Nothing here has that id. Press Enter to use it anyway." : "Nothing matches that search."}</div>`
            : results.map((c, i) => html`<button type="button" role="option" aria-selected=${i === index ? "true" : "false"} class="ent ${i === index ? "hl" : ""}"
                @mousedown=${(e: MouseEvent) => e.preventDefault()} @click=${(e: MouseEvent) => pick(c, e.target)}>
                <span class="ent-name">${c.name}</span>
                <span class="ent-id mono">${c.entityId}</span>
                <span class="ent-state">${c.state}</span>
              </button>`)}
        </div>`
      : caption}
    ${opts.compact ? nothing : html`<details class="sub">
      <summary>Display name: ${ref.displayName || "(none)"}</summary>
      ${textField("Display name", ref.displayName, (v) => set({ ...ref, displayName: v }))}
      <div class="hint">Stored with the entity and used where the watch needs a label for it.</div>
    </details>`}
  </div>`;
}

/** Keep the arrow-key selection visible when the result list scrolls. */
function revealHighlight(input: HTMLElement): void {
  requestAnimationFrame(() => {
    const hl = input.closest(".entity-field")?.querySelector<HTMLElement>("button.ent.hl");
    hl?.scrollIntoView({ block: "nearest" });
  });
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
  /** What this value is for, shown beside the chip. */
  label?: string;
  /** Draw the whole form in place instead of behind a chip. For the one screen
   * where the value is the entire subject (a named value's own editor). */
  inline?: boolean;
  /** Drop the label line and tighten the chip, for a states table cell where
   * the column heading has already said what the value is for. */
  compact?: boolean;
}

/**
 * A value, as one line that says what it is, with the full form a click away.
 *
 * The form underneath is unchanged: a source, a body for that source and a
 * format panel. What changed is that it no longer costs a screen of space to
 * say "the kitchen light". Six of these can sit in one rule and still be read
 * at a glance.
 */
export function valueEditor(host: EditorHost, value: Value, set: (v: Value) => void, opts: ValueEditorOptions): TemplateResult {
  if (opts.inline || !popoverSupported()) return html`<div class="value-editor">${valueForm(host, value, set, opts)}</div>`;

  const id = popoverId(opts.key);
  const label = opts.label ?? "Value";
  const resolved = opts.showResolved ? host.resolve(value) : undefined;
  const summary = describeValue(value, describeContext(host));
  return html`<div class="field value-chip-field ${opts.compact ? "compact" : ""}">
    ${opts.compact ? nothing : html`<span>${label}</span>`}
    <button type="button" class="value-chip ${opts.compact ? "chip-cell" : ""}" popovertarget=${id} aria-haspopup="dialog" title=${`${label}: ${summary}. Click to change it.`}>
      <span class="chip-text">${summary}</span>
      ${resolved === undefined ? nothing : html`<span class="chip-now mono" title="Value right now">${resolved}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${valuePopover(host, id, label, value, set, opts)}
  </div>`;
}

/** The popover half of a value chip, on its own so a states table can hang one
 * off a plain number input's "…" button without also drawing a chip. */
function valuePopover(host: EditorHost, id: string, label: string, value: Value, set: (v: Value) => void, opts: ValueEditorOptions): TemplateResult {
  return html`<div class="value-pop" id=${id} popover role="dialog" aria-label=${label} @toggle=${onValuePopoverToggle}>
    <div class="pop-head">
      <b>${label}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${id} popovertargetaction="hide">Done</button>
    </div>
    ${openedPopovers.has(id) ? valueForm(host, value, set, opts) : nothing}
  </div>`;
}

/** The named values and live states `describeValue` reads to put names where
 * ids would otherwise be. */
export function describeContext(host: EditorHost): DescribeContext {
  return { values: host.config.values, hass: host.hass };
}

function popoverId(key: string): string {
  return `wa-pop-${key.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

/**
 * The popover is what lets the form escape the inspector's scrolling card, and
 * it brings Escape, click-outside and focus return with it for free. A browser
 * old enough to lack it falls back to the form drawn in place, which is what
 * the editor did before: more scrolling, nothing broken.
 */
function popoverSupported(): boolean {
  return typeof HTMLElement !== "undefined" && typeof HTMLElement.prototype.showPopover === "function";
}

/**
 * Which popovers are open right now.
 *
 * The body of a closed popover is never built. It saves the inspector from
 * laying out a dozen full value forms (and, for icons, a dozen symbol grids)
 * that nobody has asked to see, and it is why the chip is cheaper than the
 * inline form it replaced rather than merely tidier.
 */
const openedPopovers = new Set<string>();

/** Popovers being kept under their chip while the page scrolls. */
const popoverTrackers = new WeakMap<HTMLElement, () => void>();

/**
 * The control a popover belongs under.
 *
 * Found by the `popovertarget` that opened it rather than by the class of the
 * chip, so a table cell, a row's "…" button and the original value chip all
 * position the same way. Where two controls share one popover (a plain number
 * input beside its "…" button) the first in document order wins, which is the
 * one the user is looking at.
 */
function anchorFor(pop: HTMLElement): HTMLElement | null {
  const root = pop.getRootNode();
  const scope = root instanceof ShadowRoot || root instanceof Document ? root : pop.ownerDocument;
  return scope.querySelector<HTMLElement>(`[popovertarget="${pop.id}"]`);
}

/**
 * Open a popover that does not exist yet.
 *
 * Filling an empty cell writes the change and then wants the form for it, but
 * the button carrying the popover is only built by the redraw that the edit
 * causes. Two frames is enough for lit to have rendered it; failing to find it
 * simply leaves the cell filled with its default, which is still a step
 * forward rather than an error.
 */
function openPopoverSoon(node: EventTarget | null, id: string): void {
  const start = node instanceof Node ? node : null;
  if (!start) return;
  const root = start.getRootNode();
  if (!(root instanceof ShadowRoot) && !(root instanceof Document)) return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const el = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (el && typeof el.showPopover === "function" && !el.matches(":popover-open")) el.showPopover();
  }));
}

function onValuePopoverToggle(e: Event): void {
  const pop = e.currentTarget as HTMLElement;
  const opening = (e as Event & { newState?: string }).newState === "open";
  const stop = popoverTrackers.get(pop);
  if (stop) { stop(); popoverTrackers.delete(pop); }
  if (!opening) {
    if (openedPopovers.delete(pop.id)) requestRerender(pop);
    return;
  }

  const anchor = anchorFor(pop);
  if (!anchor) return;
  const track = () => {
    if (!pop.isConnected || !pop.matches(":popover-open")) { popoverTrackers.get(pop)?.(); popoverTrackers.delete(pop); return; }
    // Following a chip that has scrolled out of the card would leave the form
    // floating over unrelated content, so it closes with it instead.
    const a = anchor.getBoundingClientRect();
    if (a.bottom < 0 || a.top > window.innerHeight) { pop.hidePopover(); return; }
    positionPopover(pop, a);
  };
  window.addEventListener("scroll", track, true);
  window.addEventListener("resize", track);
  popoverTrackers.set(pop, () => {
    window.removeEventListener("scroll", track, true);
    window.removeEventListener("resize", track);
  });

  positionPopover(pop, anchor.getBoundingClientRect());
  if (!openedPopovers.has(pop.id)) {
    openedPopovers.add(pop.id);
    requestRerender(pop);
    // The form only exists after that redraw, so measure once it does.
    requestAnimationFrame(() => { if (pop.isConnected) positionPopover(pop, anchor.getBoundingClientRect()); });
  }
}

function positionPopover(pop: HTMLElement, anchor: DOMRect): void {
  // Measured without the last placement's ceiling, so a form that was squeezed
  // once is not treated as short for ever.
  pop.style.maxHeight = "";
  const box = pop.getBoundingClientRect();
  const at = placePopover(
    { left: anchor.left, top: anchor.top, bottom: anchor.bottom, width: anchor.width },
    { width: box.width, height: box.height },
    { width: window.innerWidth, height: window.innerHeight },
  );
  pop.style.left = `${at.left}px`;
  pop.style.top = `${at.top}px`;
  pop.style.maxHeight = `${at.maxHeight}px`;
}

export interface AnchorBox { left: number; top: number; bottom: number; width: number }
export interface PopoverPlacement { left: number; top: number; maxHeight: number; above: boolean }

/** How far a popover stays from the edge of the window. */
const POPOVER_MARGIN = 8;
/** Gap between the chip and its popover. */
const POPOVER_GAP = 6;
/** Below this a popover is squeezed enough that flipping is worth it. */
const POPOVER_MIN_HEIGHT = 140;

/**
 * Where a popover goes under its chip.
 *
 * Under the chip by default, above it when there is not enough room below and
 * more room above, and always inside the window: a chip near the right edge of
 * a narrow inspector would otherwise open a form half off screen. The popover
 * itself sits in the top layer, so nothing an ancestor does with `overflow`
 * can clip it, which is the reason these are window coordinates.
 */
export function placePopover(anchor: AnchorBox, size: { width: number; height: number }, viewport: { width: number; height: number }): PopoverPlacement {
  const below = viewport.height - anchor.bottom - POPOVER_GAP - POPOVER_MARGIN;
  const above = anchor.top - POPOVER_GAP - POPOVER_MARGIN;
  const flip = size.height > below && above > below && below < POPOVER_MIN_HEIGHT;
  const room = Math.max(POPOVER_MIN_HEIGHT, flip ? above : below);
  const height = Math.min(size.height, room);
  const left = Math.max(POPOVER_MARGIN, Math.min(anchor.left, viewport.width - size.width - POPOVER_MARGIN));
  const top = flip
    ? Math.max(POPOVER_MARGIN, anchor.top - POPOVER_GAP - height)
    : Math.max(POPOVER_MARGIN, Math.min(anchor.bottom + POPOVER_GAP, viewport.height - height - POPOVER_MARGIN));
  return { left, top, maxHeight: room, above: flip };
}

function valueForm(host: EditorHost, value: Value, set: (v: Value) => void, opts: ValueEditorOptions): TemplateResult {
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
      body = entityField(host, "Entity", k, (ref) => setKind({ ...k, ...ref }), `${key}-entity`);
      break;
    case "entityAttribute": {
      const attrs = Object.keys(host.hass.states[k.entityId]?.attributes ?? {}).sort();
      const listId = `wa-attrs-${key.replace(/[^a-z0-9]/gi, "")}`;
      body = html`${entityField(host, "Entity", k, (ref) => setKind({ ...k, ...ref }), `${key}-entity`)}
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
      body = host.config.values.length === 0
        ? html`<div class="hint warn">There are no named values yet. Add one in the Data card first.</div>`
        : selectField("Value", k.id, [["", "(choose)"], ...host.config.values.map((n): [string, string] => [n.id, n.name || n.id.slice(0, 8)])], (v) => setKind({ ...k, id: v }));
      break;
  }
  const resolved = opts.showResolved ? host.resolve(value) : undefined;
  return html`
    ${selectField("Source", k.kind, kinds, (kind) => setKind(switchKind(k, kind)))}
    ${body}
    ${opts.noFormat ? nothing : formatEditor(value.format, (f) => set(formatIsEmpty(f) ? { kind: value.kind } : { ...value, format: f }))}
    ${opts.showResolved ? html`<div class="hint">Now: ${resolved === undefined ? html`<span class="warn">unresolved</span>` : html`<code>${resolved}</code>`}</div>` : nothing}`;
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
            ${entityField(host, `Entity ${i + 1}`, e, (ref) => { const list = [...scope.entities]; list[i] = ref; set({ ...a, scope: { ...scope, entities: list } }); }, `${key}-agg-${i}`, { compact: true })}
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
    ${"entityId" in tap ? entityField(host, "Target", tap, (ref) => host.update((c) => { c.tapAction = { type: tap.type, ...ref }; }, "tap-entity"), "general-tap") : nothing}
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
    ${valueEditor(host, nv.value, (v) => host.update((c) => { c.values[idx]!.value = v; }, key), { allowNamed: false, showResolved: true, inline: true, key })}
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
        ${valueEditor(host, el.payload.value, (v) => upd((e) => { (e as typeof el).payload.value = v; }, "value"), { showResolved: true, label: "Text", key: `${key}-value` })}
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
        ${valueEditor(host, el.payload.symbol, (v) => upd((e) => { (e as typeof el).payload.symbol = v; }, "symbol"), { noFormat: true, showResolved: true, symbol: true, label: "Symbol", key: `${key}-symbol` })}
        <div class="hint">An entity source uses that entity's own icon instead.</div>
        ${numberField("Icon size (pt)", el.payload.size, (v) => upd((e) => { (e as typeof el).payload.size = v ?? 14; }, "size"), { step: 1, min: 4 })}`;
      break;
    case "gauge":
      content = html`
        ${valueEditor(host, el.payload.value, (v) => upd((e) => { (e as typeof el).payload.value = v; }, "value"), { showResolved: true, label: "Reading", key: `${key}-value` })}
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
        ${entityField(host, "Camera", el.payload.entity, (ref) => upd((e) => { (e as typeof el).payload.entity = ref; }, "entity"), `${key}-camera`, { domain: "camera" })}
        ${el.payload.entity.entityId && !el.payload.entity.entityId.startsWith("camera.") ? html`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera.</div>` : nothing}
        ${checkField("Show timestamp", el.payload.timestamp === true, (v) => upd((e) => {
          const p = (e as typeof el).payload;
          if (v) p.timestamp = true; else delete p.timestamp;
        }))}
        <div class="hint">The watch fetches a fresh snapshot on refresh and shows the cached frame in between; the timestamp says when it was taken. This preview shows the camera's live picture.</div>`;
      break;
    case "tap": {
      content = html`
        ${tapActionEditor(host, el.payload, (m, k) => upd((e) => m((e as typeof el).payload), k), key)}
        <div class="hint">An invisible tap area. On the watch, a tap inside this frame runs this action; the rest of the complication keeps the tap action on the General tab. Put it over a row, an icon, or any part you want to respond on its own. Layers higher in the list win where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead. Its tap follows the layer and needs no lining up.</div>`;
      break;
    }
  }

  return html`
    ${content}
    ${el.kind === "image" || el.kind === "tap" ? nothing : colorField(el.kind === "shape" ? "Fill colour" : "Colour", el.payload.colorSlot.baseColorHex, (v) => upd((e) => { if (e.kind !== "image" && e.kind !== "tap") e.payload.colorSlot.baseColorHex = v ?? "#FFFFFF"; }, "color"))}
    ${checkField("Hidden in every family", el.payload.isHidden, (v) => upd((e) => { e.payload.isHidden = v; }))}
    ${tappableSection(host, el, key)}
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
    <div class="hint">${statesSummary(el.payload.rules)} Use the States tab to give this layer a different look when a value changes.</div>`;
}

// ── Tappable ──────────────────────────────────────────────────────────────

/**
 * The action form behind a tap: what it does, the entity it does it to, and
 * the page picker for Open the page. Shared by a free-standing tap layer's own
 * editor and by the Tappable section below, so the two can never drift apart.
 */
export function tapActionEditor(
  host: EditorHost,
  tap: TapElement,
  upd: (mutate: (p: TapElement) => void, k?: string) => void,
  key: string,
): TemplateResult {
  const action = tap.action;
  const needsEntity = (t: TapAction["type"]) => ["toggleEntity", "runScene", "runScript", "addTodo", "runHTTPAction"].includes(t);
  return html`
    ${selectField("Tap action", action.type, LAYER_TAP_TYPES, (v) => upd((p) => {
      p.action = needsEntity(v)
        ? { type: v as "toggleEntity", ...("entityId" in p.action ? { entityId: p.action.entityId, displayName: p.action.displayName, domain: p.action.domain } : { entityId: "", displayName: "", domain: "" }) }
        : { type: v as "refresh" };
      if (v !== "openPage") { delete p.openPageId; delete p.openPageName; }
    }))}
    ${"entityId" in action ? entityField(host, "Target", action, (ref) => upd((p) => { p.action = { type: action.type, ...ref }; }, "tap-entity"), `${key}-tap`) : nothing}
    ${action.type === "openPage" ? pageChoiceField(host, tap.openPageId, tap.openPageName, (pid, name) => upd((p) => {
      if (pid === undefined) { delete p.openPageId; delete p.openPageName; return; }
      p.openPageId = pid;
      if (name) p.openPageName = name; else delete p.openPageName;
    }, "tap-page")) : nothing}`;
}

/** One-line description of a tap action, for the checkbox hint. */
function describeTapAction(action: TapAction): string {
  const label = TAP_TYPES.find(([t]) => t === action.type)?.[1] ?? action.type;
  if (!("entityId" in action)) return label;
  const target = action.displayName || action.entityId;
  return target ? `${label}: ${target}` : label;
}

/**
 * "Tappable" on a drawing layer. Ticking it attaches a tap that copies this
 * layer's frame and per-shape placements, so the author never sizes an
 * invisible rectangle by hand; the action editor then sits right here, which
 * is why an attached tap needs no row of its own in the Layers card.
 */
function tappableSection(host: EditorHost, el: CElement, key: string): TemplateResult | typeof nothing {
  // A tap has no tap, and a free-standing tap layer is edited on its own.
  if (el.kind === "tap") return nothing;
  const id = el.payload.id;
  const attached = attachedTapsOf(host.config, id)[0];
  const updTap = (mutate: (p: TapElement) => void, k?: string) => host.update((c) => {
    const t = c.elements.find((e) => e.kind === "tap" && e.payload.attachedTo === id);
    if (t) mutate(t.payload as TapElement);
  }, k ? `${key}-${k}` : undefined);
  const preview = defaultAttachedTapAction(host.config, el);
  return html`
    <h3>Tap</h3>
    ${checkField("Tappable", attached !== undefined, (v) => host.update((c) => {
      if (v) attachTap(c, id);
      else detachTaps(c, id);
    }))}
    ${attached
      ? html`<div class="value-editor">
          ${tapActionEditor(host, attached.payload as TapElement, updTap, `${key}-attached`)}
        </div>
        <div class="hint">The tap area is this layer's own frame and follows it in every shape, so there is nothing to line up. Unticking Tappable removes it; Undo brings it back with its action.</div>`
      : html`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${describeTapAction(preview)}</b>.</div>`}`;
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
    <div class="hint">${statesSummary(layout.rules)} Use the States tab to change the background, border and bezel label from values.</div>
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
    ${valueEditor(host, inline.value, (v) => upd((i) => { i.value = v; }, "value"), { showResolved: true, label: "Text", key: "inline-value" })}
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
      ${valueEditor(host, layout.curvedText, (val) => upd((l) => { l.curvedText = val; }, "curved"), { showResolved: true, label: "Curved text", key: "fam-corner-curved" })}
      ${colorField("Curved text colour", layout.curvedColorHex ?? "#FFFFFF", (v) => upd((l) => { if (v === undefined) delete l.curvedColorHex; else l.curvedColorHex = v; }, "curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    ` : nothing}
    ${selectField("Bezel", bezelKind, [["none", "None (biggest circle)"], ["text", "Text label"], ["gauge", "Gauge arc"]], (v) => upd((l) => {
      if (v === "text") { delete l.bezelGauge; if (!l.bezelText) l.bezelText = literal("Label"); }
      else if (v === "gauge") { delete l.bezelText; if (!l.bezelGauge) l.bezelGauge = { value: literal("50"), minValue: 0, maxValue: 100, colorHexes: ["#34C759", "#FFCC00", "#FF3B30"] }; }
      else { delete l.bezelText; delete l.bezelGauge; }
    }))}
    ${bezelKind === "text" && layout.bezelText ? html`
      ${valueEditor(host, layout.bezelText, (val) => upd((l) => { l.bezelText = val; }, "bezel"), { showResolved: true, label: "Bezel label", key: "fam-corner-bezel" })}
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
    ${valueEditor(host, g.value, (val) => upd((l) => { l.bezelGauge!.value = val; }, "gvalue"), { showResolved: true, label: "Reading", key: "fam-corner-gvalue" })}
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
    ${g.minLabel ? valueEditor(host, g.minLabel, (val) => upd((l) => { l.bezelGauge!.minLabel = val; }, "gminlab"), { label: "Min label", key: "fam-corner-gminlab" }) : nothing}
    ${g.maxLabel ? valueEditor(host, g.maxLabel, (val) => upd((l) => { l.bezelGauge!.maxLabel = val; }, "gmaxlab"), { label: "Max label", key: "fam-corner-gmaxlab" }) : nothing}`;
}

export const FAMILY_OPTIONS = DRAWABLE_FAMILIES.map((f): [FamilyKind, string] => [f, familyTitle(f)]);
export type { Comparison };

// ── Rules ─────────────────────────────────────────────────────────────────

// COMPARISON_LABELS lives in states.ts, beside the table that turns a numeric
// comparison into "below 20", so the two wordings cannot drift apart.

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

/**
 * What a value is, in words, for the chip on the front of every value editor
 * and for rule summaries.
 *
 * The context is optional so callers that only hold a value (the layer list in
 * the panel) still get a sensible line. With it, a named value reads as its
 * name and an entity reads as its friendly name, which is what the user typed
 * into the picker and what they will recognise.
 */
export interface DescribeContext {
  values?: readonly NamedValue[];
  hass?: HassLike;
}

const TIME_FIELD_WORDS: Record<TimeField, string> = {
  now: "the time", hour: "the hour", minute: "the minute", weekday: "the weekday",
  day: "the day", month: "the month", timestamp: "the timestamp",
};

/** The friendly name a stored entity reference should read as. */
function entityWords(ref: EntityRef, ctx?: DescribeContext): string {
  if (ref.entityId === "") return "(no entity)";
  const stored = ref.displayName.trim();
  if (stored !== "" && stored !== ref.entityId) return stored;
  const live = ctx?.hass?.states[ref.entityId]?.attributes.friendly_name;
  return typeof live === "string" && live.trim() !== "" ? live.trim() : ref.entityId;
}

function truncate(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

/** The short form of a value's formatting, for the end of a description. */
export function describeFormat(format: ValueFormat | undefined): string {
  if (!format || formatIsEmpty(format)) return "";
  const bits: string[] = [];
  if (format.decimals !== undefined) bits.push(`${format.decimals} dp`);
  if (format.multiply !== undefined) bits.push(`×${format.multiply}`);
  if (format.offset !== undefined) bits.push(`${format.offset < 0 ? "" : "+"}${format.offset}`);
  if (format.prefix) bits.push(`"${format.prefix}" first`);
  if (format.suffix) bits.push(`"${format.suffix}" after`);
  if (format.useEntityUnit) bits.push("with unit");
  if (format.relativeTime) bits.push("as relative time");
  if (format.textCase) bits.push(format.textCase === "capitalized" ? "Capitalized" : format.textCase === "upper" ? "UPPER" : "lower");
  return bits.length === 0 ? "" : ` (${bits.join(", ")})`;
}

/** Short one-line description of a value, for the value chip and rule summaries. */
export function describeValue(v: Value, ctx?: DescribeContext): string {
  return `${describeValueBody(v, ctx)}${describeFormat(v.format)}`;
}

function describeValueBody(v: Value, ctx?: DescribeContext): string {
  const k = v.kind;
  switch (k.kind) {
    case "literal": return k.value ? `"${truncate(k.value, 40)}"` : "(empty)";
    case "entityState": return entityWords(k, ctx);
    case "entityAttribute": return k.attribute ? `${entityWords(k, ctx)} · ${k.attribute}` : entityWords(k, ctx);
    case "entityAge": return `age of ${entityWords(k, ctx)}`;
    case "aggregate": return describeAggregate(k.aggregate);
    case "time": return TIME_FIELD_WORDS[k.timeField];
    case "dataAge": return "data age";
    case "jinja": return k.value ? `template ${truncate(k.value, 32)}` : "template (empty)";
    case "named": {
      if (k.id === "") return "(no value chosen)";
      const named = ctx?.values?.find((n) => n.id === k.id);
      return named?.name?.trim() || `named ${k.id.slice(0, 8)}`;
    }
  }
}

function describeAggregate(a: AggregateSpec): string {
  const of = a.scope.kind === "entities"
    ? `${a.scope.entities.length} entit${a.scope.entities.length === 1 ? "y" : "ies"}`
    : a.scope.domains.length > 0 ? a.scope.domains.join(" + ") : "matching entities";
  return `${a.function} of ${of}`;
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
      extra = valueEditor(host, c.value ?? literal(""), (v) => upd((x) => { x.comparison.value = v; }, "rhs"), { showResolved: true, label: "Compare with", key: `${key}-rhs` });
      break;
    case "between":
      extra = html`${valueEditor(host, c.value ?? literal(""), (v) => upd((x) => { x.comparison.value = v; }, "rhs"), { showResolved: true, label: "Lower bound", key: `${key}-rhs` })}
        ${valueEditor(host, c.upper ?? literal(""), (v) => upd((x) => { x.comparison.upper = v; }, "upper"), { showResolved: true, label: "Upper bound", key: `${key}-upper` })}`;
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
      : valueEditor(host, t.value, (v) => upd((x) => { x.value = v; }, "lhs"), { showResolved: true, label: "Value", key: `${key}-lhs` })}
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
  return html`<div class="change-box">
    <div class="rule-head">
      <span>${CHANGE_LABELS[ch.kind]}${ignored ? html` <span class="no">(ignored by ${target === "layout" ? "layouts" : `${target} layers`})</span>` : nothing}</span>
      <span class="spacer"></span>
      <button class="icon" title="Delete change" @click=${remove}>×</button>
    </div>
    ${changeBody(host, ch, upd, key)}
  </div>`;
}

/** The controls behind one style change: a colour, a symbol, a value, a number
 * or a weight. Shared by the Advanced editor's change box and by a states
 * table cell, so the two can never offer different things. */
function changeBody(host: EditorHost, ch: StyleChange, upd: (m: (c: StyleChange) => void, k?: string) => void, key: string): TemplateResult | typeof nothing {
  const payload = styleChangePayload(ch.kind);
  let body: TemplateResult | typeof nothing = nothing;
  if (payload === "value") {
    const v = ch.value ?? literal("");
    if (COLOR_KINDS.includes(ch.kind)) {
      const fixed = v.kind.kind === "literal";
      body = html`${fixed
        ? colorField("Colour", v.kind.kind === "literal" ? v.kind.value : "", (hex) => upd((c) => { c.value = literal(hex ?? "#FFFFFF"); }, "color"))
        : valueEditor(host, v, (nv) => upd((c) => { c.value = nv; }, "value"), { noFormat: true, showResolved: true, label: "Colour from", key: `${key}-value` })}
        <button class="link" @click=${() => upd((c) => { c.value = fixed ? { kind: { kind: "entityAttribute", entityId: "", displayName: "", domain: "", attribute: "rgb_color" } } : literal("#FFFFFF"); })}>${fixed ? "Read the colour from a value instead" : "Use a fixed colour instead"}</button>
        ${fixed ? nothing : html`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`;
    } else {
      body = valueEditor(host, v, (nv) => upd((c) => { c.value = nv; }, "value"), { noFormat: ch.kind === "setIcon", symbol: ch.kind === "setIcon", showResolved: true, label: ch.kind === "setIcon" ? "Symbol" : "To", key: `${key}-value` });
    }
  } else if (payload === "number") {
    const opts = ch.kind === "setOpacity" ? { step: 0.05, min: 0, max: 1 } : ch.kind === "setRotation" ? { step: 1 } : { step: 0.5, min: 0 };
    body = numberField(ch.kind === "setOpacity" ? "Opacity (0 to 1)" : ch.kind === "setRotation" ? "Degrees" : ch.kind === "setFontSize" ? "Points" : "Value", ch.number ?? 0, (n) => upd((c) => { c.number = n ?? 0; }, "number"), opts);
  } else if (payload === "weight") {
    body = selectField("Weight", ch.weight ?? "regular", FONT_WEIGHTS, (w) => upd((c) => { c.weight = w; }));
  }
  return body;
}

// ── States table ──────────────────────────────────────────────────────────
// A two-state light is two rows and nothing else. The table is a view of one
// ordinary rule (see states.ts): rows are cases, columns are the properties a
// change sets, and every edit here writes the same `Rule` the Advanced editor
// would have written by hand.

/** Keys the user has sent to the Advanced editor. Transient on purpose: which
 * editor is open is not part of the document and does not belong in undo. */
const advancedRules = new Set<string>();
/** Columns added by the picker that no change fills in yet. A column with a
 * change in it is always shown, so this only ever holds empty ones. */
const pickedColumns = new Map<string, Set<StyleProperty>>();
/** The column a "Remove column" click is waiting for confirmation on. */
const pendingColumnRemoval = new Map<string, StyleProperty>();
/** What the header chip says before the first row exists. A table with no rows
 * has nowhere to store the value being tested, and inventing an empty rule to
 * hold it would put a rule on the watch that does nothing. */
const pendingTestValues = new Map<string, Value>();

/**
 * The Rules tab for a layer: the states table when the rules are one, today's
 * `rulesEditor` when they are not.
 *
 * `defaultValue` is what a brand-new table tests, which the panel fills in
 * from the layer's own entity: a light layer already knows it is about the
 * light, and asking again would be the duplication this whole slice removes.
 */
export function statesEditor(
  host: EditorHost,
  rules: Rule[],
  target: RuleTarget,
  locate: (cfg: CustomComplicationConfig) => Rule[] | undefined,
  key: string,
  defaultValue?: Value,
): TemplateResult {
  const shape = tableShape(rules);
  const advanced = !shape.ok || advancedRules.has(key);
  if (advanced) {
    return html`
      <div class="states-switch">
        <button class="link" ?disabled=${!shape.ok} title=${shape.ok ? "Go back to the table" : "These rules cannot be shown as a table"}
          @click=${(e: Event) => { advancedRules.delete(key); requestRerender(e.target); }}>Show as table</button>
        ${shape.ok ? nothing : html`<span class="hint">${shape.reason}</span>`}
      </div>
      ${rulesEditor(host, rules, target, locate, key)}`;
  }
  return statesTable(host, shape.table, rules[0], target, locate, key, defaultValue);
}

function statesTable(
  host: EditorHost,
  table: StatesTable,
  rule: Rule | undefined,
  target: RuleTarget,
  locate: (cfg: CustomComplicationConfig) => Rule[] | undefined,
  key: string,
  defaultValue?: Value,
): TemplateResult {
  const upd = (mutate: (rules: Rule[]) => void, k?: string) =>
    host.update((c) => { const r = locate(c); if (r) mutate(r); }, k ? `${key}-${k}` : undefined);

  // What a new row tests: whatever the rows already test, else the header
  // chip's pending choice, else the layer's own entity.
  const tested = table.value ?? pendingTestValues.get(key) ?? defaultValue;
  // An empty table guesses from the value itself: a light gets on/off rows, a
  // thermometer gets bands. The live reading settles the cases a domain name
  // cannot, such as a sensor that reports words.
  const fresh = table.rows.length === 0;
  const numberMode = table.numberMode
    || (fresh && tested !== undefined && !looksBinary(tested) && isNumberish(host.resolve(tested)));

  const allowed = RULE_TARGET_PROPERTIES[target];
  const picked = pickedColumns.get(key) ?? new Set<StyleProperty>();
  const seed = table.columns.length === 0 && picked.size === 0 ? [DEFAULT_COLUMN[target]] : [];
  const columns = shownColumns(table.columns, [...picked, ...seed.filter((p): p is StyleProperty => p !== undefined)], allowed);

  const live = rule ? host.liveBranch(rule) : "none";
  const forced = rule ? host.forced.get(rule.id) ?? "live" : "live";
  const isForced = (branch: string) => forced !== "live" && (forced === "otherwise" ? branch === "otherwise" : forced.caseId === branch);
  const force = (branch: string) => {
    if (!rule) return;
    host.setForced(rule.id, isForced(branch) ? "live" : branch === "otherwise" ? "otherwise" : { caseId: branch });
  };

  const setTested = (v: Value) => {
    pendingTestValues.set(key, v);
    if (table.rows.length === 0) return;
    upd((rs) => setTestedValue(rs, v), "lhs");
  };

  const addRow = () => upd((rs) => addStateRow(rs, tested ?? literal(""), numberMode));

  const rows = table.rows.map((row, i) => statesRow(host, {
    key: `${key}-${row.caseId}`,
    label: whenText(row.comparison, (v) => describeValue(v, describeContext(host))),
    columns,
    changes: row.changes,
    live: live === row.caseId,
    forced: isForced(row.caseId),
    onForce: () => force(row.caseId),
    // Coalescing keys carry the row and the column, so typing in one cell is
    // one undo step and typing in the next one is another.
    when: whenCell(host, row.comparison, `${key}-${row.caseId}`, (m, k) => upd((rs) => {
      const t = rs[0]?.cases.find((c) => c.id === row.caseId)?.when.tests[0];
      if (t) m(t.comparison);
    }, k && `${row.caseId}-${k}`)),
    updChanges: (m, k) => upd((rs) => {
      const c = rs[0]?.cases.find((x) => x.id === row.caseId);
      if (c) m(c.then);
    }, k && `${row.caseId}-${k}`),
    acts: html`
      <button class="icon" title="Move up" ?disabled=${i === 0} @click=${() => upd((rs) => moveStateRow(rs, i, i - 1))}>▲</button>
      <button class="icon" title="Move down" ?disabled=${i === table.rows.length - 1} @click=${() => upd((rs) => moveStateRow(rs, i, i + 1))}>▼</button>
      <button class="icon" title="Delete this state" @click=${() => upd((rs) => removeStateRow(rs, row.caseId))}>×</button>`,
  }));

  const otherwiseRow = table.otherwise === undefined ? nothing : statesRow(host, {
    key: `${key}-otherwise`,
    label: "Otherwise",
    columns,
    changes: table.otherwise,
    live: live === "otherwise",
    forced: isForced("otherwise"),
    onForce: () => force("otherwise"),
    when: html`<span class="when-otherwise">Otherwise</span>`,
    updChanges: (m, k) => upd((rs) => { const o = rs[0]?.otherwise; if (o) m(o); }, k),
    acts: html`<button class="icon" title="Remove the Otherwise row" @click=${() => upd((rs) => setOtherwise(rs, false))}>×</button>`,
  });

  const pendingRemoval = pendingColumnRemoval.get(key);
  const spare = COLUMN_PICKER_ORDER.filter((p) => allowed.includes(p) && !columns.includes(p));

  return html`
    <div class="states">
      ${valueEditor(host, tested ?? literal(""), setTested, { label: "Testing", showResolved: true, key: `${key}-lhs` })}
      ${tested === undefined ? html`<div class="hint">Choose what these states look at. A layer bound to an entity fills this in for you.</div>` : nothing}
      <table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${columns.map((p) => html`<th>
              <span>${PROPERTY_LABELS[p]}</span>
              <button class="icon" title=${`Remove the ${PROPERTY_LABELS[p]} column`}
                @click=${(e: Event) => { pendingColumnRemoval.set(key, p); requestRerender(e.target); }}>×</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          ${otherwiseRow}
          ${table.rows.length === 0 && table.otherwise === undefined
            ? html`<tr><td class="empty-row" colspan=${columns.length + 2}>No states yet. Add one to change how this ${target === "layout" ? "shape" : "layer"} looks when a value changes.</td></tr>`
            : nothing}
        </tbody>
      </table>
      ${pendingRemoval === undefined ? nothing : html`<div class="hint warn confirm-row">
        Remove the ${PROPERTY_LABELS[pendingRemoval]} column? Its ${countColumnUses(table, pendingRemoval)} value${countColumnUses(table, pendingRemoval) === 1 ? "" : "s"} are deleted from every state.
        <button class="danger small" @click=${(e: Event) => {
          pendingColumnRemoval.delete(key);
          pickedColumns.get(key)?.delete(pendingRemoval);
          requestRerender(e.target);
          upd((rs) => removeColumn(rs, pendingRemoval));
        }}>Remove</button>
        <button class="small" @click=${(e: Event) => { pendingColumnRemoval.delete(key); requestRerender(e.target); }}>Cancel</button>
      </div>`}
      <div class="states-foot">
        <button class="small" @click=${addRow}>+ state</button>
        ${table.otherwise === undefined
          ? html`<button class="small" title="What this layer looks like when no state above matches" @click=${() => upd((rs) => setOtherwise(rs, true))}>+ otherwise</button>`
          : nothing}
        <span class="spacer"></span>
        ${forced === "live" ? nothing : html`<button class="small" @click=${() => rule && host.setForced(rule.id, "live")}>Back to live</button>`}
        ${spare.length === 0 ? nothing : html`<select class="chip-add" title="Add a column" @change=${(e: Event) => {
          const sel = e.target as HTMLSelectElement;
          const p = sel.value as StyleProperty | "";
          sel.value = "";
          if (!p) return;
          const set = pickedColumns.get(key) ?? new Set<StyleProperty>();
          set.add(p);
          pickedColumns.set(key, set);
          requestRerender(sel);
        }}>
          <option value="" selected>+ column…</option>
          ${spare.map((p) => html`<option value=${p}>${PROPERTY_LABELS[p]}</option>`)}
        </select>`}
      </div>
      <div class="hint">${numberMode
        ? "States are checked top to bottom and the first match wins, so each band only has to say where it starts."
        : "States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it. Click it again for the live value.</div>
      <div class="states-switch">
        <button class="link" @click=${(e: Event) => { advancedRules.add(key); requestRerender(e.target); }}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`;
}

/** Whether a resolved reading is a number, which is what makes a fresh table
 * a set of bands rather than a set of states. */
function isNumberish(resolved: string | undefined): boolean {
  const t = (resolved ?? "").trim();
  return t !== "" && Number.isFinite(Number(t));
}

/** Column picker order. The same order the header reads in, so a column lands
 * where the list said it would. */
const COLUMN_PICKER_ORDER: StyleProperty[] = [
  "icon", "text", "color", "visibility", "opacity", "fontSize", "fontWeight",
  "rotation", "gaugeValue", "gaugeMin", "gaugeMax", "backgroundColor",
  "borderColor", "borderWidth",
];

function countColumnUses(table: StatesTable, property: StyleProperty): number {
  let n = 0;
  for (const row of table.rows) if (cellChange(row.changes, property)) n += 1;
  if (table.otherwise && cellChange(table.otherwise, property)) n += 1;
  return n;
}

interface StatesRowOptions {
  key: string;
  label: string;
  columns: StyleProperty[];
  changes: StyleChange[];
  live: boolean;
  forced: boolean;
  onForce: () => void;
  when: TemplateResult;
  updChanges: (m: (list: StyleChange[]) => void, k?: string) => void;
  acts: TemplateResult;
}

/** Whether a click landed on something that handles its own clicks, so the row
 * does not also treat it as "preview this state". */
function onControl(e: Event): boolean {
  const el = e.target as HTMLElement | null;
  return !!el?.closest?.("input, select, textarea, button, label, [popover]");
}

function statesRow(host: EditorHost, o: StatesRowOptions): TemplateResult {
  return html`<tr class="state-row ${o.live ? "live" : ""} ${o.forced ? "forced" : ""}"
    title=${`${o.label}. Click to hold the previews on this state.`}
    @click=${(e: Event) => { if (!onControl(e)) o.onForce(); }}>
    <td class="when">
      <span class="row-flag" title=${o.forced ? "The previews are held on this state" : o.live ? "This state matches right now" : ""}>${o.forced ? "◉" : o.live ? "●" : ""}</span>
      ${o.when}
    </td>
    ${o.columns.map((p) => html`<td>${statesCell(host, p, o.changes, o.updChanges, `${o.key}-${p}`)}</td>`)}
    <td class="acts">${o.acts}</td>
  </tr>`;
}

/** One cell: what this state sets for one column, or "unchanged". Clicking an
 * empty cell writes the column's default and opens its form, so filling in a
 * table is one click per cell rather than a trip through an adder menu. */
function statesCell(
  host: EditorHost,
  property: StyleProperty,
  changes: StyleChange[],
  updChanges: (m: (list: StyleChange[]) => void, k?: string) => void,
  key: string,
): TemplateResult {
  const ch = cellChange(changes, property);
  const id = popoverId(key);
  if (!ch) {
    return html`<button type="button" class="cell empty" title=${`Set ${PROPERTY_LABELS[property]} for this state`}
      @click=${(e: Event) => {
        updChanges((list) => { list.push(newStyleChange(PROPERTY_CHANGE_KIND[property])); });
        openPopoverSoon(e.target, id);
      }}>unchanged</button>`;
  }
  const upd = (m: (c: StyleChange) => void, k?: string) => updChanges((list) => {
    const target = list.find((x) => STYLE_PROPERTY[x.kind] === property);
    if (target) m(target);
  }, k && `${property}-${k}`);
  const label = PROPERTY_LABELS[property];
  return html`
    <button type="button" class="cell filled" popovertarget=${id} aria-haspopup="dialog" title=${`${label}. Click to change it.`}>${cellSummary(host, ch)}</button>
    <div class="value-pop" id=${id} popover role="dialog" aria-label=${label} @toggle=${onValuePopoverToggle}>
      <div class="pop-head">
        <b>${label}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${id} popovertargetaction="hide">Done</button>
      </div>
      ${openedPopovers.has(id)
        ? html`${property === "visibility"
            ? selectField("This state", ch.kind === "hide" ? "hide" : "show", [["show", "Shown"], ["hide", "Hidden"]], (v) => upd((c) => { c.kind = v as StyleChangeKind; }))
            : changeBody(host, ch, upd, key)}
          <button class="link" @click=${(e: Event) => {
            // Closed first: emptying the cell takes this popover's own button
            // out of the document, and a popover removed while open never
            // fires the toggle that tidies up after it.
            (e.target as HTMLElement).closest<HTMLElement>("[popover]")?.hidePopover();
            updChanges((list) => {
              const i = list.findIndex((x) => STYLE_PROPERTY[x.kind] === property);
              if (i >= 0) list.splice(i, 1);
            });
          }}>Leave ${label.toLowerCase()} unchanged</button>`
        : nothing}
    </div>`;
}

/** What a filled cell shows: a colour swatch, a symbol and its name, or the
 * value in words. Short enough that a row still reads as one line. */
function cellSummary(host: EditorHost, ch: StyleChange): TemplateResult {
  if (ch.kind === "hide") return html`<span class="cell-word">Hidden</span>`;
  if (ch.kind === "show") return html`<span class="cell-word">Shown</span>`;
  const payload = styleChangePayload(ch.kind);
  if (payload === "number") return html`<span class="cell-word mono">${ch.number ?? 0}</span>`;
  if (payload === "weight") return html`<span class="cell-word">${FONT_WEIGHTS.find(([w]) => w === (ch.weight ?? "regular"))?.[1]}</span>`;
  const v = ch.value ?? literal("");
  const fixed = v.kind.kind === "literal" ? v.kind.value : undefined;
  if (COLOR_KINDS.includes(ch.kind)) {
    return html`<span class="swatch" style=${`background:${fixed && /^#[0-9a-fA-F]{6,8}$/.test(fixed) ? fixed : "transparent"}`}></span>
      <span class="cell-word">${fixed ? colorWords(fixed) : describeValue(v, describeContext(host))}</span>`;
  }
  if (ch.kind === "setIcon" && fixed) {
    const glyph = host.icons.render(fixed, 16, "#FFFFFF");
    return html`${glyph ?? nothing}<span class="cell-word">${fixed}</span>`;
  }
  return html`<span class="cell-word">${describeValue(v, describeContext(host))}</span>`;
}

/** A hex colour as something a person can read back. Names are the closest of
 * the Apple system colours the rest of the editor already offers; anything
 * else keeps its hex. */
export function colorWords(hex: string): string {
  const named: Record<string, string> = {
    "#FF453A": "red", "#FF9F0A": "orange", "#FFD60A": "amber", "#34C759": "green",
    "#30D158": "green", "#0A84FF": "blue", "#64D2FF": "cyan", "#BF5AF2": "purple",
    "#FFFFFF": "white", "#8E8E93": "grey", "#000000": "black", "#FFCC00": "amber",
    "#FF3B30": "red",
  };
  return named[hex.toUpperCase()] ?? hex;
}

/**
 * The "When" cell: a comparison and, when it needs one, its right-hand side.
 *
 * A literal right-hand side is a plain input, because that is what it is; a
 * value that reads an entity or a template shows the chip instead. The "…"
 * button beside a literal is how the first becomes the second.
 */
function whenCell(host: EditorHost, c: Comparison, key: string, upd: (m: (c: Comparison) => void, k?: string) => void): TemplateResult {
  const operand = comparisonOperand(c.kind);
  const numeric = isNumericComparison(c.kind);
  const rhs = (v: Value, set: (v: Value) => void, k: string, placeholder: string) =>
    compactValue(host, v, set, `${key}-${k}`, numeric, placeholder, k === "rhs" ? "Compare with" : "Upper bound");
  return html`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${onInput((v) => upd((x) => {
      const next = switchComparison(x, v as ComparisonKind);
      x.kind = next.kind;
      if (next.value !== undefined) x.value = next.value; else delete x.value;
      if (next.upper !== undefined) x.upper = next.upper; else delete x.upper;
    }))}>
      ${TABLE_COMPARISONS.map((k) => html`<option value=${k} ?selected=${k === c.kind}>${tableComparisonLabel(k)}</option>`)}
    </select>
    ${operand === "value" || operand === "between"
      ? rhs(c.value ?? literal(""), (v) => upd((x) => { x.value = v; }, "rhs"), "rhs", numeric ? "0" : "value")
      : nothing}
    ${operand === "between" ? html`<span class="when-and">to</span>${rhs(c.upper ?? literal(""), (v) => upd((x) => { x.upper = v; }, "upper"), "upper", "100")}` : nothing}
  </span>`;
}

/** The comparison dropdown's wording. Numeric kinds read the way the row will
 * read once it has a number in it, so choosing one is choosing a sentence. */
function tableComparisonLabel(kind: ComparisonKind): string {
  switch (kind) {
    case "lessThan": return "below…";
    case "lessOrEqual": return "…or below";
    case "between": return "between…";
    case "greaterOrEqual": return "…or above";
    case "greaterThan": return "above…";
    default: return COMPARISON_LABELS[kind];
  }
}

/** A right-hand side inside a row: a plain input while it is a literal, the
 * value chip once it is anything else, and one button between the two. */
function compactValue(
  host: EditorHost,
  v: Value,
  set: (v: Value) => void,
  key: string,
  numeric: boolean,
  placeholder: string,
  label: string,
): TemplateResult {
  const id = popoverId(key);
  const opts: ValueEditorOptions = { showResolved: true, label, key };
  if (v.kind.kind !== "literal") {
    return html`<span class="rhs">
      ${valueEditor(host, v, set, { ...opts, compact: true })}
    </span>`;
  }
  const text = v.kind.value;
  return html`<span class="rhs">
    <input class="cellin ${numeric ? "num" : ""}" type=${numeric ? "number" : "text"} .value=${text} placeholder=${placeholder}
      @input=${onInput((val) => set({ ...v, kind: { kind: "literal", value: val } }))} />
    <button type="button" class="icon more" popovertarget=${id} title="Compare with an entity or a template instead">…</button>
    ${valuePopover(host, id, label, v, set, opts)}
  </span>`;
}
