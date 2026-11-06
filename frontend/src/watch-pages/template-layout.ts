// Template item placement is independent of Jinja. Older apps ignore this
// optional tile key and keep drawing the complete template. Both renderers
// fall back to automatic layout when the output no longer matches its shape.
import { type TemplateCell, type TemplateRun, templateRows } from "./template-rows.js";
import { alignTemplate, scanTemplateSource, type SourceToken } from "./template-source.js";

export type TemplatePartSlice = "icon" | "whole" | "prefix" | "value" | "suffix";
export interface TemplatePartIdentity {
  key: string;
  row: number;
  cell: number;
  slice: TemplatePartSlice;
  prefix: string;
  suffix: string;
}
export interface TemplateLayoutItem extends TemplatePartIdentity {
  /** Centre in the complete tile, from 0 to 1. Size is in virtual watch points. */
  x: number; y: number; size: number;
  baseX: number; baseY: number; baseSize: number;
}
export interface TemplateTileLayout { v: 1; shape: string; items: TemplateLayoutItem[] }
/** Center a selection on one shared column or row, preserving its other
 * coordinates, sizes and automatic placement values for reset. */
export function alignTemplateItems(layout: TemplateTileLayout, keys: ReadonlySet<string>, direction: "vertical" | "horizontal"): TemplateTileLayout {
  const own = layout.items.filter(p => keys.has(p.key));
  if (own.length < 2) return layout;
  const axis = direction === "vertical" ? "x" : "y";
  const positions = own.map(p => p[axis]);
  const center = (Math.min(...positions) + Math.max(...positions)) / 2;
  return { ...layout, items: layout.items.map(p => keys.has(p.key) ? { ...p, [axis]: center } : p) };
}

export interface TemplateLayoutPart extends TemplatePartIdentity {
  kind: "icon" | "text";
  text: string;
  symbol?: string;
  color?: string;
  runs: TemplateRun[];
  /** Original cell text range. Whitespace outside it stays in automatic layout. */
  from: number;
  to: number;
  source?: { from: number; to: number; kind: "icon" | "label" | "value" };
}
export const templatePartKey = (row: number, cell: number, slice: TemplatePartSlice): string => `${row}.${cell}.${slice}`;
export const templateLayoutShape = (rows: readonly (readonly TemplateCell[])[]): string => rows.map(r => r.map(c => c.icon === undefined ? "t" : "i").join("")).join("/");
const object = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);
const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const slices = new Set<unknown>(["icon", "whole", "prefix", "value", "suffix"]);
const tidy = (n: number) => Math.round(n * 10000) / 10000;

export function normalizeTemplateLayout(raw: unknown): TemplateTileLayout | undefined {
  if (!object(raw) || raw.v !== 1 || typeof raw.shape !== "string" || raw.shape.length > 256 || !Array.isArray(raw.items) || raw.items.length === 0 || raw.items.length > 128) return undefined;
  const items: TemplateLayoutItem[] = [];
  const keys = new Set<string>();
  for (const p of raw.items) {
    if (!object(p) || !Number.isInteger(p.row) || !Number.isInteger(p.cell) || (p.row as number) < 0 || (p.row as number) > 63 || (p.cell as number) < 0 || (p.cell as number) > 63 || !slices.has(p.slice) || typeof p.prefix !== "string" || typeof p.suffix !== "string" || p.prefix.length > 2048 || p.suffix.length > 2048) return undefined;
    const key = templatePartKey(p.row as number, p.cell as number, p.slice as TemplatePartSlice);
    if (p.key !== key || keys.has(key)) return undefined;
    if (![p.x, p.y, p.size, p.baseX, p.baseY, p.baseSize].every(finite)) return undefined;
    keys.add(key);
    const point = (n: unknown) => tidy(Math.max(0, Math.min(1, n as number)));
    const size = (n: unknown) => tidy(Math.max(2, Math.min(80, n as number)));
    items.push({ key, row: p.row as number, cell: p.cell as number, slice: p.slice as TemplatePartSlice, prefix: p.prefix, suffix: p.suffix, x: point(p.x), y: point(p.y), size: size(p.size), baseX: point(p.baseX), baseY: point(p.baseY), baseSize: size(p.baseSize) });
  }
  return { v: 1, shape: raw.shape, items };
}

function textRange(text: string, p: TemplatePartIdentity): [number, number] | undefined {
  let from = 0, to = text.length;
  if (p.slice !== "whole") {
    if (!text.startsWith(p.prefix) || !text.endsWith(p.suffix) || p.prefix.length + p.suffix.length > text.length) return undefined;
    if (p.slice === "prefix") to = p.prefix.length;
    else if (p.slice === "suffix") from = text.length - p.suffix.length;
    else { from = p.prefix.length; to = text.length - p.suffix.length; }
  }
  while (from < to && /\s/u.test(text[from]!)) from++;
  while (to > from && /\s/u.test(text[to - 1]!)) to--;
  return [from, to];
}
function slicedRuns(cell: TemplateCell, from: number, to: number): TemplateRun[] {
  if (cell.runs.length === 0) return [{ text: cell.text.slice(from, to), color: undefined }];
  let at = 0;
  return cell.runs.flatMap(run => { const start = at; at += run.text.length; const text = run.text.slice(Math.max(0, from - start), Math.max(0, Math.min(run.text.length, to - start))); return text === "" ? [] : [{ text, color: run.color }]; });
}
function resolve(p: TemplatePartIdentity, cell: TemplateCell): TemplateLayoutPart | undefined {
  if (p.slice === "icon") return cell.icon === undefined ? undefined : { ...p, kind: "icon", text: "", symbol: cell.icon.symbol, color: cell.icon.color, runs: [], from: 0, to: 0 };
  const range = textRange(cell.text, p);
  if (range === undefined) return undefined;
  return { ...p, kind: "text", text: cell.text.slice(...range), runs: slicedRuns(cell, ...range), from: range[0], to: range[1] };
}
const literal = (tokens: readonly SourceToken[]) => tokens.filter(t => t.kind === "text").map((t, i) => `${i > 0 && !t.glued ? " " : ""}${t.src}`).join("");

/** Independent values and labels where the source is unambiguous. Complex
 * control flow remains a whole text item rather than guessing at its source. */
export function templateLayoutParts(source: string, rendered: string): TemplateLayoutPart[] {
  const rows = templateRows(rendered);
  const aligned = alignTemplate(scanTemplateSource(source), rows);
  const out: TemplateLayoutPart[] = [];
  rows.forEach((row, r) => row.forEach((cell, c) => {
    const mapped = aligned?.[r]?.cells[c];
    const identity = (slice: TemplatePartSlice, prefix = "", suffix = ""): TemplatePartIdentity => ({ key: templatePartKey(r, c, slice), row: r, cell: c, slice, prefix, suffix });
    if (cell.icon !== undefined) {
      const p = resolve(identity("icon"), cell)!;
      if (mapped?.icon !== undefined) p.source = { ...mapped.icon, kind: "icon" };
      out.push(p);
    }
    if (cell.text === "") return;
    const exprs = mapped?.tokens.filter(t => t.kind === "expr") ?? [];
    if (exprs.length === 1) {
      const expr = exprs[0]!;
      const before = mapped!.tokens.filter(t => t.kind === "text" && t.to <= expr.from);
      let after = mapped!.tokens.filter(t => t.kind === "text" && t.from >= expr.to);
      const glued = after[0];
      const unit = glued?.glued ? /^(\S+)(\s+)([\s\S]+)$/.exec(glued.src) : null;
      if (glued !== undefined && unit !== null) {
        const start = glued.from + unit[1]!.length + unit[2]!.length;
        after = [{ ...glued, src: unit[1]!, to: glued.from + unit[1]!.length }, { ...glued, src: unit[3]!, from: start, glued: false }, ...after.slice(1)];
      }
      const prefix = literal(before);
      // Units glued to a value (°C, %, kWh without a space) travel with it.
      const suffixTokens = after[0]?.glued === true ? after.slice(1) : after;
      const suffix = literal(suffixTokens);
      const ids = [...(prefix === "" ? [] : [identity("prefix", prefix, suffix)]), identity("value", prefix, suffix), ...(suffix === "" ? [] : [identity("suffix", prefix, suffix)])];
      const parts = ids.map(id => resolve(id, cell));
      if (parts.every((p): p is TemplateLayoutPart => p !== undefined)) {
        for (const p of parts) {
          const tokens = p.slice === "prefix" ? before : p.slice === "suffix" ? suffixTokens : [expr, ...after.filter(t => !suffixTokens.includes(t))];
          if (tokens.length > 0) p.source = { from: tokens[0]!.from, to: tokens[tokens.length - 1]!.to, kind: p.slice === "value" ? "value" : "label" };
          out.push(p);
        }
        return;
      }
    }
    const p = resolve(identity("whole"), cell)!;
    if (mapped?.text !== undefined && mapped.tokens.filter(t => t.kind === "text").length === 1 && mapped.tokens.every(t => t.kind !== "expr")) p.source = { ...mapped.text, kind: "label" };
    out.push(p);
  }));
  return out;
}

/** Fail as a whole rather than dropping or assigning new output to an old
 * item when a branch, a loop, or a manual edit changes the output structure. */
export function resolveTemplateLayout(raw: unknown, rendered: string): { layout: TemplateTileLayout; parts: TemplateLayoutPart[] } | undefined {
  const layout = normalizeTemplateLayout(raw), rows = templateRows(rendered);
  if (layout === undefined || templateLayoutShape(rows) !== layout.shape) return undefined;
  const parts: TemplateLayoutPart[] = [];
  for (const item of layout.items) { const cell = rows[item.row]?.[item.cell]; const part = cell === undefined ? undefined : resolve(item, cell); if (part === undefined) return undefined; parts.push(part); }
  for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r]!.length; c++) {
    const cell = rows[r]![c]!, own = parts.filter(p => p.row === r && p.cell === c);
    if (own.filter(p => p.kind === "icon").length !== (cell.icon === undefined ? 0 : 1)) return undefined;
    const text = own.filter(p => p.kind === "text").sort((a, b) => a.from - b.from);
    let at = 0;
    for (const p of text) { if (p.from < at || cell.text.slice(at, p.from).trim() !== "") return undefined; at = p.to; }
    if (cell.text.slice(at).trim() !== "") return undefined;
  }
  return { layout, parts };
}
