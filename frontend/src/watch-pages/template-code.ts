// The template tile's code editor: CodeMirror with the template's own view of
// itself. `template-editor.ts` loads this file only when the Template task
// opens, so the editor stays out of every other page of the panel.
//
// Two views of one text. Full code is the saved text in color, with row numbers
// and lines between the rows (Rows), each column on its own line (Format) and
// wrapped (Wrap). Sections is one line per row showing what it draws, one row
// open at a time with its parts as short pills; a part the caret touches opens
// to its code.
//
// Every line break Format shows is a widget. A real line break outside `{{ }}`
// would make a new row on the tile, so no view ever changes the saved text.

import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap, insertCompletionText, pickedCompletion, startCompletion, type Completion, type CompletionContext, type CompletionResult } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { Annotation, Compartment, EditorState, type Range, StateEffect, StateField, type Transaction } from "@codemirror/state";
import { type BlockInfo, Decoration, type DecorationSet, EditorView, GutterMarker, type Tooltip, WidgetType, drawSelection, gutter, hoverTooltip, keymap, lineNumbers, placeholder, showTooltip } from "@codemirror/view";
import { type TemplateResult, render } from "lit";
import { type SourceIssue, type SourceScan, scanTemplateSource, sourceRowAt } from "./template-source.js";
import { type SourceTap, templateSourceTaps, templateTapNotes } from "./template-row-taps.js";
import type { TemplateTapNames } from "./template-taps.js";

export type TemplateCodeView = "full" | "sections";

export interface TemplateCodeOptions {
  view: TemplateCodeView;
  rows: boolean;
  format: boolean;
  wrap: boolean;
}

/** What the editor draws from the world around it, read on every draw. */
export interface TemplateCodeContext {
  /** A row's head in Sections: what it draws. The key says when it changed. */
  head(row: number, scan: SourceScan): { key: string; draw: TemplateResult };
  /** An icon or expression as a pill. The key says when it changed. */
  pill(from: number, scan: SourceScan): { key: string; draw: TemplateResult } | undefined;
  /** What is wrong with the names in the text, with the caret where it is. */
  issues(scan: SourceScan, caret: number): SourceIssue[];
  /** The most rows the tile draws. */
  rowLimit(): number;
  entities(): Completion[];
  symbols(): Completion[];
  colors(): Completion[];
  /** The `[tap:` actions, by name, each with what it does. */
  rowActions(): Completion[];
  /** Pages a `[tap:page` can open, by name. */
  pages(): Completion[];
  /** HTTP actions a `[tap:http` can run, by name. */
  httpActions(): Completion[];
  /** The pages and HTTP actions a `[tap:` marker can name, so the tap
   * gutter can say when one does not exist. */
  tapNames?(): TemplateTapNames;
  /** Home Assistant's services as `domain.service`. */
  services(): Completion[];
  /** An entity's attributes, for `state_attr('ENTITY', '`. */
  attributes?(entityId: string): Completion[];
  drawOption(completion: Completion): TemplateResult | undefined;
}

/** What `[tap:` suggests where the text before the caret is `before`
 * (the caret at `pos`): the actions after `[tap:`, then each action's value
 * (entities, `script.` or `scene.` entities, services and then entities,
 * pages, HTTP actions). Null when the caret is not in one. */
/** Domains `[tap:toggle ...]` suggests: the ones a toggle works on. */
export const TAP_TOGGLE_DOMAINS = ["light", "switch", "fan", "input_boolean", "cover", "valve", "lock", "media_player", "climate", "humidifier", "automation", "siren", "remote", "water_heater", "group"] as const;
/** Domains `[tap:maps ...]` suggests: entities with a place. */
export const TAP_MAPS_DOMAINS = ["person", "device_tracker", "zone"] as const;

export function templateTapCompletion(
  before: string, pos: number,
  context: Pick<TemplateCodeContext, "entities" | "rowActions" | "pages" | "httpActions" | "services">,
): CompletionResult | null {
  const action = before.match(/\[tap:\s*(\w*)$/i);
  if (action !== null) {
    return { from: pos - action[1]!.length, options: context.rowActions().map((o) => (o.label === "refresh" ? o : thenValue(o))), validFor: /^\w*$/ };
  }
  const m = before.match(/\[tap:\s*(\w+)\s+([^\]\n]*)$/i);
  if (m === null) return null;
  const value = m[2]!;
  const id = /^[\w.]*$/.test(value);
  const entities = (prefix?: string): CompletionResult => ({
    from: pos - value.length,
    options: prefix === undefined ? context.entities() : context.entities().filter((o) => o.label.startsWith(prefix)),
    validFor: /^[\w.]*$/,
  });
  const named = (options: Completion[]): CompletionResult => ({ from: pos - value.length, options, validFor: /^[^\]\n]*$/ });
  // Only entities the action can use: things that turn on and off, and
  // things with a place on the map.
  const inDomains = (domains: readonly string[]): CompletionResult => ({
    from: pos - value.length,
    options: context.entities().filter((o) => domains.includes(o.label.split(".")[0]!)),
    validFor: /^[\w.]*$/,
  });
  switch (m[1]!.toLowerCase()) {
    case "toggle": return id ? inDomains(TAP_TOGGLE_DOMAINS) : null;
    case "maps": return id ? inDomains(TAP_MAPS_DOMAINS) : null;
    case "control": return id ? entities() : null;
    case "script": return id ? entities("script.") : null;
    case "scene": return id ? entities("scene.") : null;
    case "service": {
      if (id) return { from: pos - value.length, options: context.services().map(thenValue), validFor: /^[\w.]*$/ };
      const target = value.match(/^\w+\.\w+\s+([\w.]*)$/);
      return target === null ? null : { from: pos - target[1]!.length, options: context.entities(), validFor: /^[\w.]*$/ };
    }
    case "page": return named(context.pages());
    case "http": return named(context.httpActions());
    default: return null;
  }
}

/** What `state_attr('ENTITY', '` suggests: the entity's attributes. Null
 * when the caret is not in one, or the context has none. */
export function templateAttributeCompletion(
  before: string, pos: number,
  context: Pick<TemplateCodeContext, "attributes">,
): CompletionResult | null {
  const m = before.match(/state_attr\(\s*['"]([\w.]+)['"]\s*,\s*['"](\w*)$/);
  if (m === null || context.attributes === undefined) return null;
  return { from: pos - m[2]!.length, options: context.attributes(m[1]!), validFor: /^\w*$/ };
}

/** An entity picked inside `state_attr('`: its id, then, when the attribute's
 * quotes follow (`', '`), the caret into them and the attributes asked for,
 * as Quick add's Attribute writes it. */
export function entityThenAttribute(option: Completion): Completion {
  return {
    ...option,
    apply: (view, completion, from, to) => {
      view.dispatch({ ...insertCompletionText(view.state, completion.label, from, to), annotations: pickedCompletion.of(completion) });
      const end = from + completion.label.length;
      const quotes = view.state.doc.sliceString(end, end + 8).match(/^['"]\s*,\s*['"]/);
      if (quotes === null) return;
      view.dispatch({ selection: { anchor: end + quotes[0].length } });
      startCompletion(view);
    },
  };
}

/** A pick that types its label and a space, then asks for the value. */
function thenValue(option: Completion): Completion {
  return {
    ...option,
    apply: (view, completion, from, to) => {
      view.dispatch({ ...insertCompletionText(view.state, `${completion.label} `, from, to), annotations: pickedCompletion.of(completion) });
      startCompletion(view);
    },
  };
}

export interface TemplateCodeEvents {
  changed(text: string): void;
  selected(from: number, to: number, head: number, focused: boolean): void;
  blurred(): void;
  /** The scan row whose `[tap:` marker the pointer or the caret is on, or
   * -1: the tile lights the rows it makes. */
  tapRow?(row: number): void;
}

export interface TemplateCode {
  text(): string;
  /** Put a text the editor did not type in, out of its undo. */
  setText(text: string, caret?: number): void;
  /** A fresh text with a fresh undo, for another tile. */
  reset(text: string): void;
  setOptions(options: TemplateCodeOptions): void;
  /** The context's answers changed. */
  refresh(): void;
  select(from: number, to: number): void;
  /** Selects a range and shows it inside the code box, leaving the page
   * where it is. */
  highlight(from: number, to: number): void;
  change(from: number, to: number, insert: string): void;
  /** Where the caret is, as the code box keeps it while it is out of focus. */
  caret(): { from: number; to: number };
  /** Quick add's edit: replaces `from`..`to` with `insert` out of the
   * changed event (the caller writes it as its own step), selects
   * `anchor`..`head`, focuses the box and opens its suggestions when
   * `suggest` is set. */
  put(edit: { from: number; to: number; insert: string; anchor: number; head: number; suggest: boolean }): void;
  destroy(): void;
}

const outside = Annotation.define<boolean>();
const redraw = StateEffect.define<null>();
const setFocus = StateEffect.define<boolean>();
const setOpen = StateEffect.define<number>();

class Drawn extends WidgetType {
  constructor(readonly key: string, readonly draw: TemplateResult, readonly classes: string, readonly data: Record<string, string>, readonly block: boolean) { super(); }
  override eq(other: Drawn): boolean { return other.key === this.key && other.classes === this.classes && other.block === this.block && JSON.stringify(other.data) === JSON.stringify(this.data); }
  toDOM(): HTMLElement {
    const el = document.createElement(this.block ? "div" : "span");
    el.className = this.classes;
    for (const [k, v] of Object.entries(this.data)) el.dataset[k] = v;
    render(this.draw, el);
    return el;
  }
  override ignoreEvent(): boolean { return false; }
}

class SoftBreak extends WidgetType {
  constructor(readonly indent: boolean) { super(); }
  override eq(other: SoftBreak): boolean { return other.indent === this.indent; }
  toDOM(): HTMLElement {
    const el = document.createElement("span");
    el.className = "te-br";
    el.appendChild(document.createElement("br"));
    if (this.indent) {
      const pad = document.createElement("span");
      pad.className = "te-in";
      el.appendChild(pad);
    }
    return el;
  }
  override ignoreEvent(): boolean { return false; }
}

const COLOR_RULE = /\{\{/;

const theme = EditorView.theme({
  "&": { background: "var(--wa-field, var(--wa-input))", color: "var(--wa-soft, var(--wa-ink))", borderRadius: "9px", border: "1px solid var(--wa-line-strong)", fontSize: "12.5px" },
  "&.cm-focused": { outline: "none", borderColor: "var(--wa-pick-line, var(--wa-line-strong))" },
  ".cm-scroller": { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", lineHeight: "1.65", padding: "2px 0 8px", overflow: "auto", minHeight: "120px", maxHeight: "620px" },
  ".cm-scroller:has(.cm-lineWrapping)": { overflowX: "hidden" },
  ".cm-content": { caretColor: "var(--wa-ink)", padding: "0 10px" },
  ".cm-line": { padding: "0" },
  ".cm-cursor": { borderLeftColor: "var(--wa-ink)", borderLeftWidth: "1.5px" },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground": { background: "color-mix(in srgb, var(--wa-hue-blue) 32%, transparent) !important" },
  ".cm-gutters": { background: "transparent", border: "0", color: "var(--wa-faint)" },
  ".cm-lineNumbers .cm-gutterElement": { padding: "0 6px 0 8px" },
  ".cm-tooltip": { background: "var(--wa-raised, var(--wa-card))", border: "1px solid var(--wa-line-strong)", borderRadius: "9px", overflow: "hidden" },
  // Never wider than the window, so a narrow panel shows the whole list.
  ".cm-tooltip.cm-tooltip-autocomplete": { maxWidth: "min(420px, calc(100vw - 24px))" },
  ".cm-tooltip-autocomplete > ul": { fontFamily: "inherit", fontSize: "12.5px", maxHeight: "230px", minWidth: "0", maxWidth: "100%" },
  ".cm-tooltip-autocomplete > ul > li": { padding: "4px 9px", display: "flex", alignItems: "center", justifyContent: "flex-start", textAlign: "left", gap: "7px", color: "var(--wa-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": { background: "var(--wa-pick-bg)", color: "var(--wa-ink)" },
  ".cm-completionDetail": { marginLeft: "auto", paddingLeft: "12px", fontStyle: "normal", color: "var(--wa-ent)" },
  ".cm-completionMatchedText": { textDecoration: "none", color: "var(--wa-pick-ink)", fontWeight: "700" },
  ".cm-completionIcon": { display: "none" },
  // The tap gutter: a small mark beside each line with a `[tap:` marker.
  ".te-tap-gutter .cm-gutterElement": { display: "flex", alignItems: "flex-start", justifyContent: "center", width: "14px", padding: "0 0 0 4px" },
  ".te-tapg": { display: "inline-flex", alignItems: "center", height: "1.65em", color: "var(--wa-hue-blue)", cursor: "help" },
  ".te-tapg svg": { width: "11px", height: "11px", display: "block" },
  ".te-tapg.bad": { color: "var(--wa-need)" },
  ".te-tapg.later": { opacity: "0.45" },
  ".te-tapbad": { textDecoration: "underline wavy color-mix(in srgb, var(--wa-need) 70%, transparent)", textUnderlineOffset: "3px" },
  ".te-taptip": { maxWidth: "min(320px, calc(100vw - 40px))", display: "flex", flexDirection: "column", gap: "3px", padding: "6px 9px", fontFamily: "system-ui, sans-serif", fontSize: "12px", lineHeight: "1.4", color: "var(--wa-ink)" },
  ".te-taptip + .te-taptip": { borderTop: "1px solid var(--wa-line)" },
  ".te-taptip .bad": { color: "var(--wa-need)" },
  ".te-taptip small": { fontSize: "11.5px", color: "var(--wa-muted)" },
});

const TAP_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="2.7" fill="currentColor"/><circle cx="8" cy="8" r="5.8" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".55"/></svg>';
const TAP_WARN = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.2 14.6 13.6H1.4Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.4v3.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="11.6" r=".9" fill="currentColor"/></svg>';

/** The gutter's mark for a line's markers: a warning when one does not
 * read, faint when none of them counts. */
class TapMark extends GutterMarker {
  constructor(readonly kind: "ok" | "bad" | "later", readonly label: string) { super(); }
  override eq(other: TapMark): boolean { return other.kind === this.kind && other.label === this.label; }
  override toDOM(): Node {
    const el = document.createElement("span");
    el.className = `te-tapg ${this.kind}`;
    if (this.label !== "") el.setAttribute("aria-label", this.label);
    el.innerHTML = this.kind === "bad" ? TAP_WARN : TAP_ICON;
    return el;
  }
}

function tapMark(taps: readonly SourceTap[]): TapMark | null {
  if (taps.length === 0) return null;
  const kind = taps.some((t) => !t.reading.ok) ? "bad" : taps.every((t) => t.later) ? "later" : "ok";
  return new TapMark(kind, taps.map((t) => t.reading.text).join(" "));
}

/** A tooltip's words for some markers: each one's sentence and notes. */
function tapTip(taps: readonly SourceTap[]): HTMLElement {
  const dom = document.createElement("div");
  for (const tap of taps) {
    const box = document.createElement("div");
    box.className = "te-taptip";
    templateTapNotes(tap).forEach((line, i) => {
      const el = document.createElement(i === 0 ? "span" : "small");
      if (i === 0 && !tap.reading.ok) el.className = "bad";
      el.textContent = line;
      box.appendChild(el);
    });
    dom.appendChild(box);
  }
  return dom;
}

export function createTemplateCode(parent: HTMLElement, text: string, initial: TemplateCodeOptions, context: TemplateCodeContext, events: TemplateCodeEvents): TemplateCode {
  let options = initial;
  const wrapping = new Compartment();
  const numbers = new Compartment();

  const focusField = StateField.define<boolean>({
    create: () => false,
    update(value, tr) {
      for (const e of tr.effects) if (e.is(setFocus)) return e.value;
      return value;
    },
  });
  /** Which row Sections shows open: the first at the start, then the row the
   * caret is in. A row's head opens or shuts one by hand. */
  const openField = StateField.define<number>({
    create: () => 0,
    update(value, tr) {
      for (const e of tr.effects) if (e.is(setOpen)) return e.value;
      const gained = tr.effects.some((e) => e.is(setFocus) && e.value);
      if (gained || (tr.selection !== undefined && tr.state.field(focusField))) {
        const row = sourceRowAt(scanTemplateSource(tr.state.doc.toString()).rows, tr.state.selection.main.head);
        if (row >= 0) return row;
      }
      return value;
    },
  });

  /** Every `[tap:` marker, read again when the text or the names change. */
  const tapsOf = (state: EditorState): SourceTap[] => templateSourceTaps(scanTemplateSource(state.doc.toString()), context.tapNames?.());
  const tapsField = StateField.define<SourceTap[]>({
    create: tapsOf,
    update(value, tr) {
      if (!tr.docChanged && !tr.effects.some((e) => e.is(redraw))) return value;
      const next = tapsOf(tr.state);
      // The same markers keep the same list, so an open tooltip stays.
      return JSON.stringify(next) === JSON.stringify(value) ? value : next;
    },
  });
  const tapsIn = (state: EditorState, from: number, to: number): SourceTap[] => state.field(tapsField).filter((t) => t.from >= from && t.from <= to);
  /** The gutter mark the pointer is on, from its block; its markers'
   * words show at `anchor`. */
  const setPoint = StateEffect.define<{ from: number; to: number; anchor: number } | null>();
  const pointField = StateField.define<{ from: number; to: number; anchor: number } | null>({
    create: () => null,
    update(value, tr) {
      for (const e of tr.effects) if (e.is(setPoint)) return e.value;
      return tr.docChanged ? null : value;
    },
    provide: (field) => showTooltip.compute([field, tapsField], (state): Tooltip | null => {
      const point = state.field(field);
      const taps = point === null ? [] : tapsIn(state, point.from, point.to);
      if (point === null || taps.length === 0) return null;
      return { pos: point.anchor, above: true, create: () => ({ dom: tapTip(taps) }) };
    }),
  });
  // Which row's taps the tile lights: the one the pointer is on (in the
  // gutter, else in the code), else the caret's.
  let gutterRow = -1, codeRow = -1, caretRow = -1, sentRow = -1;
  const sendTapRow = (): void => {
    const row = gutterRow >= 0 ? gutterRow : codeRow >= 0 ? codeRow : caretRow;
    if (row === sentRow) return;
    sentRow = row;
    events.tapRow?.(row);
  };
  const caretTapRow = (state: EditorState, focused: boolean): number => {
    if (!focused) return -1;
    const row = sourceRowAt(scanTemplateSource(state.doc.toString()).rows, state.selection.main.head);
    return row >= 0 && state.field(tapsField).some((t) => t.row === row) ? row : -1;
  };
  const pointGutter = (view: EditorView, block: BlockInfo | null): void => {
    const taps = block === null ? [] : tapsIn(view.state, block.from, block.to);
    const next = block === null || taps.length === 0 ? null : { from: block.from, to: block.to, anchor: block.widget === undefined || block.widget === null ? taps[0]!.from : block.from };
    const now = view.state.field(pointField);
    if (now?.from !== next?.from || now?.to !== next?.to) view.dispatch({ effects: setPoint.of(next) });
    gutterRow = taps[0]?.row ?? -1;
    sendTapRow();
  };
  const tapGutter = gutter({
    class: "te-tap-gutter",
    lineMarker: (view, line) => tapMark(tapsIn(view.state, line.from, line.to)),
    // A row Sections shows shut is one block: its mark is its markers'.
    widgetMarker: (view, _widget, block) => (block.to > block.from ? tapMark(tapsIn(view.state, block.from, block.to)) : null),
    lineMarkerChange: (update) => update.startState.field(tapsField) !== update.state.field(tapsField),
    initialSpacer: () => new TapMark("ok", ""),
    domEventHandlers: {
      mousemove(view, block, event) {
        pointGutter(view, (event.target as Element | null)?.closest?.(".te-tapg") == null ? null : block);
        return false;
      },
      mouseleave(view) {
        pointGutter(view, null);
        return false;
      },
    },
  });
  const tapHover = hoverTooltip((view, pos) => {
    const tap = view.state.field(tapsField).find((t) => pos >= t.from && pos <= t.to);
    return tap === undefined ? null : { pos: tap.from, end: tap.to, above: true, create: () => ({ dom: tapTip([tap]) }) };
  }, { hoverTime: 200 });

  const build = (state: EditorState): DecorationSet => {
    const scan = scanTemplateSource(state.doc.toString());
    const focused = state.field(focusField);
    const sel = state.selection.main;
    const issues = context.issues(scan, sel.empty ? sel.head : -1);
    const sections = options.view === "sections";
    const stacked = sections || options.format;
    const openRow = state.field(openField);
    const limit = context.rowLimit();
    const decos: Range<Decoration>[] = [];
    const hidden: { from: number; to: number }[] = [];
    if (scan.open !== undefined) issues.unshift(scan.open);
    let filled = 0;
    scan.rows.forEach((row, index) => {
      const hasParts = row.tokens.some((t) => t.kind !== "logic");
      const cut = hasParts && filled >= limit;
      if (hasParts) filled++;
      const lineStarts: number[] = [];
      for (let p = row.from; p <= row.to;) {
        const line = state.doc.lineAt(p);
        lineStarts.push(line.from);
        if (line.to + 1 > row.to) break;
        p = line.to + 1;
      }
      if (sections) {
        const open = index === openRow;
        const head = context.head(index, scan);
        const bad = issues.some((x) => x.from >= row.from && x.from <= row.to);
        const widget = new Drawn(head.key, head.draw, `te-rh${cut ? " cut" : ""}${open ? " open" : ""}${bad ? " bad" : ""}`, { row: String(index) }, true);
        if (!open) {
          hidden.push(row);
          if (row.from < row.to) decos.push(Decoration.replace({ widget, block: true }).range(row.from, row.to));
          else decos.push(Decoration.widget({ widget, block: true, side: -1 }).range(row.from));
          return;
        }
        decos.push(Decoration.widget({ widget, block: true, side: -1 }).range(row.from));
        for (const start of lineStarts) decos.push(Decoration.line({ class: "te-openrow" }).range(start));
      } else if (options.rows) {
        for (const start of lineStarts) decos.push(Decoration.line({ class: "te-rowline" }).range(start));
      }
      if (cut) for (const start of lineStarts) decos.push(Decoration.line({ class: "te-cutline" }).range(start));
      let first = true;
      for (const token of row.tokens) {
        const touching = focused && sel.from <= token.to && sel.to >= token.from;
        if (token.kind === "icon" && stacked && !first) decos.push(Decoration.widget({ widget: new SoftBreak(false), side: -1 }).range(token.from));
        if (token.kind !== "logic") first = false;
        if (token.kind === "text") continue;
        const on = focused && (sel.empty ? sel.head >= token.from && sel.head <= token.to : sel.from < token.to && sel.to > token.from);
        if (sections && !touching && token.kind !== "logic") {
          const pill = context.pill(token.from, scan);
          if (pill !== undefined) {
            decos.push(Decoration.replace({ widget: new Drawn(pill.key, pill.draw, "te-pillwrap", { from: String(token.from), to: String(token.to) }, false) }).range(token.from, token.to));
            continue;
          }
        }
        const entity = /(?:states|state_attr|is_state)\s*[([]/.test(token.src);
        const cls = token.kind === "icon" ? "te-i" : entity ? "te-e" : "te-j";
        const badTap = token.kind === "logic" && token.src.startsWith("[tap:") && state.field(tapsField, false)?.some((t) => t.from === token.from && !t.reading.ok) === true;
        decos.push(Decoration.mark({ class: `${cls}${on ? " te-on" : ""}${badTap ? " te-tapbad" : ""}` }).range(token.from, token.to));
        // A long color expression reads one branch to a line.
        const brace = token.kind === "icon" ? token.src.match(COLOR_RULE) : null;
        if (stacked && brace !== null && /\selse\s/.test(token.src)) {
          const inner = token.from + brace.index! + 2 + (token.src[brace.index! + 2] === " " ? 1 : 0);
          decos.push(Decoration.widget({ widget: new SoftBreak(true), side: 1 }).range(inner));
          for (const e of token.src.matchAll(/\selse\s/g)) decos.push(Decoration.widget({ widget: new SoftBreak(true), side: 1 }).range(token.from + e.index + 1));
          decos.push(Decoration.widget({ widget: new SoftBreak(false), side: -1 }).range(token.from + token.src.indexOf("}}")));
          // What the icon sits beside starts its own line, after the space.
          if (token.to < row.to) decos.push(Decoration.widget({ widget: new SoftBreak(false), side: 1 }).range(state.sliceDoc(token.to, token.to + 1) === " " ? token.to + 1 : token.to));
        }
      }
    });
    for (const issue of issues) {
      if (issue.kind === "open" || issue.from === issue.to) continue;
      if (hidden.some((r) => issue.from >= r.from && issue.from <= r.to)) continue;
      decos.push(Decoration.mark({ class: "te-bad" }).range(issue.from, issue.to));
    }
    return Decoration.set(decos, true);
  };

  const decoField = StateField.define<DecorationSet>({
    create: build,
    update(value, tr: Transaction) {
      if (tr.docChanged || tr.selection !== undefined || tr.effects.some((e) => e.is(redraw) || e.is(setFocus) || e.is(setOpen))) return build(tr.state);
      return value.map(tr.changes);
    },
    provide: (field) => EditorView.decorations.from(field),
  });

  const complete = (ctx: CompletionContext): CompletionResult | null => {
    const before = ctx.state.doc.sliceString(Math.max(0, ctx.pos - 80), ctx.pos);
    let m: RegExpMatchArray | null;
    const attribute = templateAttributeCompletion(before, ctx.pos, context);
    if (attribute !== null) return attribute;
    if ((m = before.match(/(?:states\(|is_state\(|state_attr\(|states\[)['"]([\w.]*)$/)) !== null) {
      const options = context.entities();
      return { from: ctx.pos - m[1]!.length, options: /state_attr\(['"][\w.]*$/.test(before) ? options.map(entityThenAttribute) : options, validFor: /^[\w.]*$/ };
    }
    if ((m = before.match(/\[icon:([\w.]*)$/)) !== null) {
      return { from: ctx.pos - m[1]!.length, options: context.symbols(), validFor: /^[\w.]*$/ };
    }
    if ((m = before.match(/\[icon:[\w.]+\s+color:(\w*)$/)) !== null || (m = before.match(/\[color:(\w*)$/)) !== null) {
      return { from: ctx.pos - m[1]!.length, options: context.colors(), validFor: /^\w*$/ };
    }
    const tap = templateTapCompletion(before, ctx.pos, context);
    if (tap !== null) return tap;
    if ((m = before.match(/\{\{\s*([\w.]*)$/)) !== null) {
      const typed = m[1]!;
      const pad = before.endsWith(`{{${typed}`) ? " " : "";
      return {
        from: ctx.pos - typed.length,
        filter: true,
        options: context.entities().map((option) => ({ ...option, apply: `${pad}states('${option.label}')${pad}` })),
      };
    }
    return null;
  };

  const makeState = (doc: string): EditorState => EditorState.create({
    doc,
    extensions: [
      history(), drawSelection(), closeBrackets(),
      keymap.of([...closeBracketsKeymap, ...completionKeymap, ...defaultKeymap, ...historyKeymap]),
      autocompletion({
        override: [complete], activateOnTyping: true, maxRenderedOptions: 60, icons: false,
        addToOptions: [{
          position: 20,
          render(completion) {
            const draw = context.drawOption(completion);
            if (draw === undefined) return null;
            const el = document.createElement("span");
            el.className = "te-opt";
            render(draw, el);
            return el;
          },
        }],
      }),
      focusField, openField, tapsField, pointField, decoField, theme, tapHover, placeholder("{{ states('sensor.outside_temperature') }}°"),
      wrapping.of(options.view === "sections" || options.wrap ? EditorView.lineWrapping : []),
      numbers.of(options.view === "full" && options.rows ? lineNumbers() : []),
      tapGutter,
      EditorView.contentAttributes.of({ spellcheck: "false", autocorrect: "off", autocapitalize: "off", "aria-label": "Template" }),
      EditorView.domEventHandlers({
        mousedown(event, view) {
          const target = event.target as Element | null;
          const head = target?.closest?.(".te-rh") as HTMLElement | null;
          if (head) {
            event.preventDefault();
            const row = Number(head.dataset["row"]);
            view.dispatch({ effects: setOpen.of(view.state.field(openField) === row ? -1 : row) });
            return true;
          }
          const pill = target?.closest?.(".te-pillwrap") as HTMLElement | null;
          if (!pill) return false;
          event.preventDefault();
          view.focus();
          view.dispatch({ selection: { anchor: Number(pill.dataset["from"]), head: Number(pill.dataset["to"]) }, effects: setFocus.of(true) });
          return true;
        },
        mousemove(event, view) {
          const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
          const tap = pos === null ? undefined : view.state.field(tapsField).find((t) => pos >= t.from && pos < t.to);
          codeRow = tap?.row ?? -1;
          sendTapRow();
          return false;
        },
        mouseleave() {
          codeRow = -1;
          sendTapRow();
          return false;
        },
        focus(_, view) { setTimeout(() => view.dispatch({ effects: setFocus.of(true) })); return false; },
        blur(_, view) {
          setTimeout(() => { if (!view.hasFocus) view.dispatch({ effects: setFocus.of(false) }); });
          events.blurred();
          return false;
        },
      }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && !update.transactions.some((t) => t.annotation(outside))) events.changed(update.state.doc.toString());
        if (update.docChanged || update.selectionSet || update.focusChanged) {
          const main = update.state.selection.main;
          events.selected(main.from, main.to, main.head, update.view.hasFocus);
        }
        if (update.docChanged || update.selectionSet || update.focusChanged || update.transactions.some((t) => t.effects.some((e) => e.is(setFocus)))) {
          caretRow = caretTapRow(update.state, update.view.hasFocus);
          sendTapRow();
        }
      }),
    ],
  });

  const view = new EditorView({ parent, state: makeState(text) });

  return {
    text: () => view.state.doc.toString(),
    setText(next, caret) {
      const current = view.state.doc.toString();
      if (current === next) return;
      view.dispatch({
        changes: { from: 0, to: current.length, insert: next },
        annotations: [outside.of(true)],
        ...(caret === undefined ? {} : { selection: { anchor: Math.min(caret, next.length) } }),
      });
    },
    reset(next) {
      view.setState(makeState(next));
    },
    setOptions(next) {
      options = next;
      const full = next.view === "full";
      view.dispatch({ effects: [wrapping.reconfigure(!full || next.wrap ? EditorView.lineWrapping : []), numbers.reconfigure(full && next.rows ? lineNumbers() : []), redraw.of(null)] });
    },
    refresh() {
      view.dispatch({ effects: redraw.of(null) });
    },
    select(from, to) {
      view.focus();
      view.dispatch({ selection: { anchor: from, head: to }, effects: [setFocus.of(true), EditorView.scrollIntoView(from, { y: "center" })] });
    },
    highlight(from, to) {
      view.focus();
      view.dispatch({ selection: { anchor: from, head: to }, effects: setFocus.of(true) });
      const line = view.lineBlockAt(from), box = view.scrollDOM;
      if (line.top < box.scrollTop || line.bottom > box.scrollTop + box.clientHeight) box.scrollTop = line.top - (box.clientHeight - line.height) / 2;
    },
    change(from, to, insert) {
      view.dispatch({ changes: { from, to, insert } });
      view.focus();
    },
    caret() {
      const main = view.state.selection.main;
      return { from: main.from, to: main.to };
    },
    put(edit) {
      view.focus();
      view.dispatch({
        changes: { from: edit.from, to: edit.to, insert: edit.insert },
        selection: { anchor: edit.anchor, head: edit.head },
        annotations: [outside.of(true)],
        effects: [setFocus.of(true), EditorView.scrollIntoView(edit.head, { y: "nearest" })],
      });
      if (edit.suggest) startCompletion(view);
    },
    destroy() {
      view.destroy();
    },
  };
}
