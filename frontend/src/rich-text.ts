// Turning a text layer's rich text on and off. Each function edits a draft
// payload in place, the way the editor's update callbacks do, and returns what
// the editor needs for the note it shows. Nothing here knows about the UI.
//
// Its own module because joining parts into one template needs the compiler's
// expression builder, and the compiler already imports the model.

import {
  CHART_DEFAULT_BAND_HIGH_HEX,
  formatIsEmpty,
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

/** The layer's own colour by value. Rich text ignores it, so it is cleared
 * whenever parts come or go rather than left to come back to life unseen. */
function clearLayerValueColours(el: TextElement): void {
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
 * A band table in use moves onto the part, because the layer's own colour by
 * value stops applying and the numbers should keep their colours. A highlight
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
  clearLayerValueColours(el);
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
 * One part: its value becomes the layer's, and its own size, weight, colour and
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
    clearLayerValueColours(el);
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
  clearLayerValueColours(el);
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
