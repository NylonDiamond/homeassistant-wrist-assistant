// Turning a text layer's rich text on and off. Each function edits a draft
// payload in place, the way the editor's update callbacks do, and returns what
// the editor needs for the note it shows. Nothing here knows about the UI.
//
// Its own module because joining parts into one template needs the compiler's
// expression builder, and the compiler already imports the model.

import {
  CHART_DEFAULT_BAND_HIGH_HEX,
  formatIsEmpty,
  inlineSymbolMarker,
  inlineUsesParts,
  literal,
  type InlinePart,
  type CustomComplicationConfig,
  literalPartText,
  newId,
  richTextFallback,
  type NamedValue,
  type Rule,
  type TextElement,
  type TextPart,
  type Value,
  type ValueFormat,
} from "./model.js";
import { expression } from "./compiler.js";

/** The layer's own color by value. Rich text ignores it, so it is cleared
 * whenever parts come or go rather than left to come back to life unseen. */
function clearLayerValueColors(el: TextElement): void {
  delete el.coloring;
  delete el.bands;
  delete el.bandAboveColorHex;
  delete el.highlight;
  delete el.highColorHex;
  delete el.lowColorHex;
}

/** Take every rule off whatever part it was aimed at, so it changes the whole
 * layer again. */
export function dropPartIds(rules: Rule[]): void {
  for (const rule of rules) delete rule.partId;
}

/**
 * Turn rich text on: the layer's value becomes its only part, and returns that
 * part's id so the editor can select it.
 *
 * A band table in use moves onto the part, because the layer's own color by
 * value stops applying and the numbers should keep their colors. A highlight
 * has no part equivalent and goes. A layer that already has parts is left as
 * it is, and the first part's id comes back.
 */
export function turnOnRichText(el: TextElement, id: string = newId()): string {
  if (el.parts !== undefined && el.parts.length > 0) return el.parts[0]!.id;
  const part: TextPart = { id, value: structuredClone(el.value) };
  if (el.coloring === "bands" && (el.bands?.length ?? 0) > 0) {
    part.coloring = "bands";
    part.bands = el.bands;
    if (el.bandAboveColorHex !== undefined && el.bandAboveColorHex !== CHART_DEFAULT_BAND_HIGH_HEX) {
      part.bandAboveColorHex = el.bandAboveColorHex;
    }
  }
  clearLayerValueColors(el);
  el.parts = [part];
  el.value = richTextFallback(el.parts);
  return id;
}

/** What turning rich text off with one part moved onto the layer. */
export type RichTextMoved = "fontSize" | "fontWeight" | "color" | "bands";

/** A part that stops its layer's parts joining into one template, and why:
 * `kind` for a value with no template form (data age, a chart's number, a
 * shared value that cannot be followed), `format` for a format with none
 * (relative time, duration). */
export interface RichTextBlocked {
  index: number;
  partId: string;
  reason: "kind" | "format";
}

export type RichTextJoin =
  | { ok: true; value: Value }
  | { ok: false; blocked: RichTextBlocked[] };

export type RichTextOff =
  | { ok: true; joined: false; moved: RichTextMoved[] }
  | { ok: true; joined: true }
  | { ok: false; blocked: RichTextBlocked[] };

/**
 * Turn rich text off.
 *
 * One part: its value becomes the layer's, and its own size, weight, color and
 * band table move onto the layer, so the text looks the same. Two or more: the
 * parts join into one value (`joinTextParts`) and their styles go; when a part
 * blocks the join nothing changes and the blocking parts come back. Either way
 * every rule loses its `partId` and changes the whole text. A countdown never
 * drew its parts, so they simply go.
 */
export function turnOffRichText(el: TextElement, namedValues: readonly NamedValue[] = []): RichTextOff {
  const parts = el.parts ?? [];
  if (el.countdown === true || parts.length === 0) {
    delete el.parts;
    dropPartIds(el.rules);
    return { ok: true, joined: false, moved: [] };
  }
  if (parts.length === 1) {
    const part = parts[0]!;
    const moved: RichTextMoved[] = [];
    el.value = part.value;
    if (part.fontSize !== undefined) {
      el.fontSize = part.fontSize;
      moved.push("fontSize");
    }
    if (part.fontWeight !== undefined) {
      el.fontWeight = part.fontWeight;
      moved.push("fontWeight");
    }
    if (part.colorHex !== undefined) {
      el.colorSlot.baseColorHex = part.colorHex;
      moved.push("color");
    }
    clearLayerValueColors(el);
    if (part.coloring !== undefined && part.coloring !== "uniform") el.coloring = part.coloring;
    if (part.bands !== undefined && part.bands.length > 0) el.bands = part.bands;
    if (part.bandAboveColorHex !== undefined) el.bandAboveColorHex = part.bandAboveColorHex;
    if (part.coloring === "bands" && (part.bands?.length ?? 0) > 0) moved.push("bands");
    delete el.parts;
    dropPartIds(el.rules);
    return { ok: true, joined: false, moved };
  }
  const joined = joinTextParts(parts, namedValues);
  if (!joined.ok) return joined;
  el.value = joined.value;
  clearLayerValueColors(el);
  delete el.parts;
  dropPartIds(el.rules);
  return { ok: true, joined: true };
}

/** A Jinja string literal, escaped the way the compiler quotes one. */
function quote(s: string): string {
  return "'" + s.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
}

/** Typed text inside a template. A brace could open a tag, so text holding
 * one is fenced off as raw. */
function rawText(s: string): string {
  return s.includes("{") ? `{% raw %}${s}{% endraw %}` : s;
}

/** What `Resolver.dereference` settles a shared value on: the value it names,
 * carrying the nearest non-empty format. Undefined for a missing or looping
 * name. */
function followNamed(value: Value, namedValues: readonly NamedValue[]): Value | undefined {
  let current = value;
  let format = value.format;
  for (let depth = 0; current.kind.kind === "named"; depth++) {
    if (depth > 8) return undefined;
    const id = current.kind.id.toUpperCase();
    const target = namedValues.find((n) => n.id.toUpperCase() === id)?.value;
    if (!target) return undefined;
    format = !formatIsEmpty(format) ? format : target.format;
    current = target;
  }
  const out: Value = { kind: current.kind };
  if (!formatIsEmpty(format)) out.format = format;
  return out;
}

/**
 * One part as template text, or why it has none.
 *
 * The format is applied the way `formatValue` applies it: the number scaled and
 * printed to its decimals, then the entity's unit, then the prefix and suffix,
 * then the case over all of it. A prefix and suffix stay typed text around the
 * tag when there is no case to apply, so the template reads like the line.
 */
function templatePiece(original: Value, namedValues: readonly NamedValue[]): string | { blocked: RichTextBlocked["reason"] } {
  const value = followNamed(original, namedValues);
  if (!value) return { blocked: "kind" };
  const words = literalPartText(value);
  if (words !== undefined) return rawText(words);
  const k = value.kind;
  const f: ValueFormat = value.format ?? {};
  if (f.relativeTime || f.duration) return { blocked: "format" };

  // The reading as a Jinja expression. A template-shaped value is captured
  // into a variable first, since a filter cannot follow a block of text.
  let setup = "";
  let reading: string;
  switch (k.kind) {
    case "entityState":
      reading = `states(${quote(k.entityId)})`;
      break;
    case "jinja": {
      if (k.value.trim() === "") return "";
      const template = k.value.includes("{{") || k.value.includes("{%");
      const onlyAround = f.decimals === undefined && f.multiply === undefined && f.offset === undefined && !f.textCase;
      if (template && onlyAround) return rawText(f.prefix ?? "") + k.value + rawText(f.suffix ?? "");
      if (template) {
        setup = `{% set wa_text %}${k.value}{% endset %}`;
        reading = "wa_text";
      } else {
        reading = `(${k.value})`;
      }
      break;
    }
    case "entityAttribute":
    case "entityAge":
    case "aggregate":
    case "time": {
      const expr = expression(k);
      if (expr === undefined) return { blocked: "kind" };
      reading = expr;
      break;
    }
    default:
      return { blocked: "kind" };
  }

  if (f.decimals !== undefined || f.multiply !== undefined || f.offset !== undefined) {
    let n = `(${reading} | float(0))`;
    if (f.multiply !== undefined) n = `(${n} * ${f.multiply})`;
    if (f.offset !== undefined) n = `(${n} + ${f.offset})`;
    reading = f.decimals !== undefined ? `${quote(`%.${Math.max(0, Math.trunc(f.decimals))}f`)} | format(${n})` : n;
  }
  const unitEntity = f.useEntityUnit && "entityId" in k ? k.entityId : undefined;
  if (unitEntity !== undefined) {
    setup += `{% set wa_unit = state_attr(${quote(unitEntity)}, 'unit_of_measurement') %}`;
  }
  // A degree or percent sign sits against the number, any other unit a space
  // away, and no unit prints nothing, as `formatValue` does.
  const unit = "('' if not wa_unit else (wa_unit if wa_unit[:1] in ['°', '%'] else ' ' ~ wa_unit))";

  if (f.textCase) {
    const filter = f.textCase === "upper" ? "upper" : f.textCase === "lower" ? "lower" : "title";
    const joined = [
      ...(f.prefix ? [quote(f.prefix)] : []),
      `(${reading})`,
      ...(unitEntity !== undefined ? [unit] : []),
      ...(f.suffix ? [quote(f.suffix)] : []),
    ].join(" ~ ");
    return `${setup}{{ (${joined}) | ${filter} }}`;
  }
  return setup + rawText(f.prefix ?? "") + `{{ ${reading} }}` + (unitEntity !== undefined ? `{{ ${unit} }}` : "") + rawText(f.suffix ?? "");
}

/**
 * Two or more parts as one value, every word and reading kept.
 *
 * Only typed words: one literal of them joined. Anything live: one Jinja
 * template, typed words as text, an entity's state as `states()`, an attribute
 * as `state_attr()`, a template as it was, and every other kind through the
 * compiler's own expression. A part whose value has no template form blocks the
 * join, and every such part is listed so the editor can name them all at once.
 */
export function joinTextParts(parts: readonly TextPart[], namedValues: readonly NamedValue[] = []): RichTextJoin {
  if (parts.every((p) => p.value.kind.kind === "literal")) return { ok: true, value: richTextFallback(parts) };
  const pieces: string[] = [];
  const blocked: RichTextBlocked[] = [];
  parts.forEach((part, index) => {
    const piece = templatePiece(part.value, namedValues);
    if (typeof piece === "string") pieces.push(piece);
    else blocked.push({ index, partId: part.id, reason: piece.blocked });
  });
  if (blocked.length > 0) return { ok: false, blocked };
  return { ok: true, value: { kind: { kind: "jinja", value: pieces.join("") } } };
}

/**
 * Bring an Inline line into the one shape the editor shows: parts, and no
 * label of its own.
 *
 * A line with no parts gets the old symbol as a first icon part, then the old
 * value as one part. A label becomes typed words, `Label: `, right after the
 * first icon, unless the line already starts with exactly those words (a
 * countdown keeps its label, see `syncInlineParts`, and must not gain the
 * words twice). What the watch draws does not change, except that the label no
 * longer drops away on a narrow face. Run when a draft opens and on every edit.
 */
export function inlineToParts(cfg: CustomComplicationConfig): void {
  const inline = cfg.inline;
  if (!inline) return;
  if ((inline.parts?.length ?? 0) === 0) {
    const parts: InlinePart[] = [];
    if (inline.symbol) parts.push({ id: newId(), value: literal(""), symbol: inline.symbol });
    parts.push({ id: newId(), value: structuredClone(inline.value) });
    inline.parts = parts;
  } else if (inline.symbol && inline.parts![0]!.symbol === undefined) {
    // Parts saved while the Symbol card still set the symbol on its own. The
    // symbol is the first icon part now, or the next write would drop it.
    inline.parts!.unshift({ id: newId(), value: literal(""), symbol: inline.symbol });
  }
  const label = inline.label;
  if (label === undefined) return;
  const parts = inline.parts!;
  const lead = parts[0]?.symbol !== undefined ? 1 : 0;
  const words = `${label}: `;
  if (leadingWords(parts.slice(lead)) !== words) parts.splice(lead, 0, { id: newId(), value: literal(words) });
  if (inline.countdown !== true) delete inline.label;
}

/** The typed words a row of parts opens with, up to the first value or icon. */
function leadingWords(parts: readonly InlinePart[]): string {
  let out = "";
  for (const p of parts) {
    const words = p.symbol === undefined ? literalPartText(p.value) : undefined;
    if (words === undefined) break;
    out += words;
  }
  return out;
}

/** The one live value in an Inline line, the one a countdown counts to, or
 * undefined when there is none or more than one. */
export function inlineCountdownPart(parts: readonly InlinePart[]): InlinePart | undefined {
  const live = parts.filter((p) => p.symbol === undefined && p.value.kind.kind !== "literal");
  return live.length === 1 ? live[0] : undefined;
}

/**
 * Write the Inline line's parts into `symbol`, `label` and `value`, the three
 * things the watch reads. Returns the parts left out of the line (see below).
 *
 * An icon as the first part becomes `symbol`, which the watch draws ahead of
 * the text with its own gap, keeps while counting down, and which every app
 * version draws. Any other icon becomes a marker (`inlineSymbolMarker`) in
 * the words.
 *
 * With at most one live value, the words around it go into that value's own
 * prefix and suffix (`richTextFallback`), so it keeps its kind and format: a
 * relative time still reads "2 min ago". With more, the parts join into one
 * template, and a part with no template form (see `RichTextBlocked`) is left
 * out of the line rather than stopping it.
 *
 * With Count down on, `value` is the one live part, which the watch counts
 * to, and the words before it become `label`, which the watch draws ahead of
 * the time. Otherwise there is no label: words are parts.
 *
 * Run on every edit (`Draft.update`), not only on a parts edit: a part can read
 * a shared value, and the join copies what that value says today.
 */
export function syncInlineParts(cfg: CustomComplicationConfig): RichTextBlocked[] {
  const inline = cfg.inline;
  if (!inline || !inlineUsesParts(inline)) return [];
  const all = inline.parts!;
  const leadIcon = all[0]?.symbol !== undefined;
  if (leadIcon && all[0]!.symbol !== "") inline.symbol = all[0]!.symbol;
  else delete inline.symbol;
  const rest = leadIcon ? all.slice(1) : all;
  if (inline.countdown === true) {
    const live = inlineCountdownPart(rest);
    if (live) inline.value = structuredClone(live.value);
    const label = leadingWords(rest).replace(/[\s:]+$/, "");
    if (label !== "") inline.label = label;
    else delete inline.label;
    return [];
  }
  delete inline.label;
  const parts = rest.map((p) => (p.symbol === undefined ? p : { id: p.id, value: literal(inlineSymbolMarker(p.symbol)) }));
  const line = lineValue(parts, cfg.values);
  if (line.ok) {
    inline.value = line.value;
    return [];
  }
  const skip = new Set(line.blocked.map((b) => b.partId));
  const kept = lineValue(parts.filter((p) => !skip.has(p.id)), cfg.values);
  inline.value = kept.ok ? kept.value : literal("");
  // The index the editor names is the part's place in the whole list.
  return line.blocked.map((b) => ({ ...b, index: b.index + (leadIcon ? 1 : 0) }));
}

/** A row of words and values as the one value the watch reads: the words
 * around a lone live value go into its prefix and suffix, and two or more
 * join into a template. */
function lineValue(parts: readonly TextPart[], namedValues: readonly NamedValue[]): RichTextJoin {
  if (parts.length === 0) return { ok: true, value: literal("") };
  if (parts.filter((p) => p.value.kind.kind !== "literal").length <= 1) return { ok: true, value: richTextFallback(parts) };
  return joinTextParts(parts, namedValues);
}
