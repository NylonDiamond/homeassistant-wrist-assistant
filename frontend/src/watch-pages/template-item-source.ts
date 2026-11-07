// Conservative visual edits to Jinja: change only a literal symbol, label,
// or a literal colour choice. Expressions and control flow are kept intact.
import { templateIconColor } from "./rich-text.js";
import { scanTemplateSource, alignTemplate } from "./template-source.js";
import { templateRows } from "./template-rows.js";
import type { TemplateLayoutPart } from "./template-layout.js";

/** Code navigation may highlight an entire cell with several expressions,
 * even when visual source edits cannot safely split that cell. */
export function templateItemCodeRange(source: string, rendered: string, part: TemplateLayoutPart): { from: number; to: number } | undefined {
  if (part.source !== undefined) return { from: part.source.from, to: part.source.to };
  const cell = alignTemplate(scanTemplateSource(source), templateRows(rendered))?.[part.row]?.cells[part.cell];
  return part.kind === "icon" ? cell?.icon : cell?.text;
}

export interface TemplateColorChoice { key: string; label: string; value: string; from: number; to: number }
interface ColorSource { spec: string; from: number; to: number; own: boolean }
export interface TemplateItemSource {
  symbol?: { value: string; from: number; to: number };
  label?: { value: string; from: number; to: number };
  color?: ColorSource;
  choices: TemplateColorChoice[];
}

export function templateColorChoices(spec: string): TemplateColorChoice[] {
  const trimmed = spec.trim(), at = spec.indexOf(trimmed);
  if (templateIconColor(trimmed) !== undefined) return [{ key: "color", label: "Color", value: trimmed, from: at, to: at + trimmed.length }];
  if (!trimmed.startsWith("{{") || !trimmed.endsWith("}}")) return [];
  const out: TemplateColorChoice[] = [];
  for (const match of spec.matchAll(/(['"])([^'"\n]+)\1/g)) {
    if (templateIconColor(match[2]!) === undefined) continue;
    const after = spec.slice(match.index + match[0].length);
    const condition = /^\s+if\s+([\s\S]*?)(?=\s+else\b)/.exec(after);
    const before = spec.slice(0, match.index);
    if (condition === null && !/\belse\s*$/.test(before) && !/^\s*}}/.test(after)) continue;
    if (condition === null && !/^\s*}}/.test(after)) continue;
    out.push({ key: `branch:${out.length}`, label: condition === null ? "Otherwise" : `If ${condition[1]!.trim()}`, value: match[2]!, from: match.index + 1, to: match.index + match[0].length - 1 });
  }
  return out;
}

export function templateItemSource(source: string, part: TemplateLayoutPart): TemplateItemSource {
  const range = part.source;
  const result: TemplateItemSource = { choices: [] };
  if (range === undefined) return result;
  const raw = source.slice(range.from, range.to);
  if (part.kind === "icon") {
    const symbol = /^\[icon:([^\s\]{}]+)/.exec(raw);
    if (symbol === null) return result;
    result.symbol = { value: symbol[1]!, from: range.from + 6, to: range.from + 6 + symbol[1]!.length };
    const own = /\s+color:/i.exec(raw);
    if (own !== null) {
      const from = range.from + own.index + own[0].length;
      const to = range.to - 1;
      result.color = { spec: source.slice(from, to), from, to, own: true };
    }
  } else if (range.kind === "label") result.label = { value: raw, from: range.from, to: range.to };
  if (result.color === undefined) {
    const scan = scanTemplateSource(source);
    let active: ColorSource | undefined;
    const lineStart = scan.rows.find(row => range.from >= row.from && range.from <= row.to)?.from ?? 0;
    for (const token of scan.rows.flatMap(row => row.tokens)) {
      if (token.from < lineStart || token.to > range.from) continue;
      if (token.src === "[/color]") active = undefined;
      else if (token.src.startsWith("[color:")) active = { spec: token.src.slice(7, -1), from: token.from + 7, to: token.to - 1, own: false };
    }
    result.color = active;
  }
  result.choices = result.color === undefined ? [{ key: "color", label: "Color", value: "", from: 0, to: 0 }] : templateColorChoices(result.color.spec);
  return result;
}

export interface TemplateSourceChange { from: number; to: number; insert: string }
export function applyTemplateSourceChanges(source: string, changes: readonly TemplateSourceChange[]): string | undefined {
  const ordered = [...changes].sort((a, b) => b.from - a.from || b.to - a.to);
  let last = source.length;
  for (const change of ordered) {
    if (change.from < 0 || change.to < change.from || change.to > last) return undefined;
    source = source.slice(0, change.from) + change.insert + source.slice(change.to);
    last = change.from;
  }
  return source;
}

/** Isolates an inherited colour when just one value or label is selected.
 * Restoring the enclosing run after it avoids recolouring its neighbours. */
export function templateItemColorChange(source: string, part: TemplateLayoutPart, key: string, color: string): TemplateSourceChange | undefined {
  if (part.source === undefined || (color !== "" && templateIconColor(color) === undefined)) return undefined;
  const info = templateItemSource(source, part), choice = info.choices.find(c => c.key === key);
  if (choice === undefined) return undefined;
  const original = info.color?.spec ?? "";
  if (color === "") {
    if (part.kind === "icon" && info.color?.own) {
      const before = source.slice(part.source.from, info.color.from);
      const own = /\s+color:$/i.exec(before);
      return own === null ? undefined : { from: part.source.from + own.index, to: info.color.to, insert: "" };
    }
    if (part.kind === "text" && info.color !== undefined && info.color.to + 1 === part.source.from && source.startsWith("[/color]", part.source.to)) {
      return { from: info.color.from - 7, to: part.source.to + 8, insert: source.slice(part.source.from, part.source.to) };
    }
    return undefined;
  }
  const next = original === "" ? color : original.slice(0, choice.from) + color + original.slice(choice.to);
  if (part.kind === "icon") {
    if (info.color?.own) return { from: info.color.from, to: info.color.to, insert: next };
    return { from: part.source.to - 1, to: part.source.to - 1, insert: ` color:${next}` };
  }
  const start = part.source.from, end = part.source.to;
  if (info.color !== undefined && info.color.to + 1 === start && source.startsWith("[/color]", end)) return { from: info.color.from, to: info.color.to, insert: next };
  return { from: start, to: end, insert: `[color:${next}]${source.slice(start, end)}[/color]${original === "" ? "" : `[color:${original}]`}` };
}
