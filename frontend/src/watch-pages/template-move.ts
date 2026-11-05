// Moving a template tile's rows by dragging them on its picture. The code stays
// the only record of the layout: a move rewrites the code, so the app needs no
// new key and Undo takes a move back.
//
// A row moves as its whole line, with any `{% set %}` on it. A move is refused
// when it would change what a `{% set %}` gives another row.
//
// No DOM here.

import type { AlignedRow, SourceRow, SourceScan, SourceToken } from "./template-source.js";

export interface TemplateRowChange {
  from: number;
  to: number;
  insert: string;
}

export type TemplateRowMove =
  | { ok: true; change: TemplateRowChange }
  /** `trim`: a `{%-` or `-%}` joins lines, so a move would change the rows.
   * `shared`: another row reads a value this row sets, or the other way. */
  | { ok: false; reason: "trim" | "shared" };

const TRIMS = /^\{[{%#]-|-[}%#]\}$/;
const SET = /^\{%-?\s*(?:set|endset)\b/;
const SET_LINE = /^\{%-?\s*set\s+([^=%]+?)\s*=(?!=)([\s\S]*?)-?%\}$/;

interface RowNames {
  writes: Set<string>;
  /** Names the row reads before it sets them itself. */
  reads: Set<string>;
  /** A `{% set x %}...{% endset %}`, whose reach is not read here. */
  block: boolean;
}

function words(src: string): string[] {
  return src.replace(/'[^']*'|"[^"]*"/g, " ").match(/[A-Za-z_]\w*/g) ?? [];
}

function rowNames(row: SourceRow): RowNames {
  const names: RowNames = { writes: new Set(), reads: new Set(), block: false };
  const read = (src: string) => {
    for (const word of words(src)) if (!names.writes.has(word)) names.reads.add(word);
  };
  for (const token of row.tokens) {
    if (token.kind === "text" || token.src.startsWith("{#")) continue;
    if (!SET.test(token.src)) {
      read(token.src);
      continue;
    }
    const set = SET_LINE.exec(token.src);
    if (set === null) {
      names.block = true;
      continue;
    }
    read(set[2]!);
    for (const target of set[1]!.split(",")) {
      const [root, ...rest] = target.trim().split(".");
      if (rest.length > 0) read(root!);
      names.writes.add(root!);
    }
  }
  return names;
}

const shares = (a: ReadonlySet<string>, b: ReadonlySet<string>) => [...a].some((name) => b.has(name));
const trims = (token: SourceToken) => token.kind !== "text" && token.kind !== "icon" && TRIMS.test(token.src);

/**
 * The change to the code that moves a drawn row to another drawn row's place.
 * `from` and `to` count the rows the tile draws (`alignTemplate`).
 */
export function moveTemplateRow(doc: string, scan: SourceScan, aligned: readonly AlignedRow[], from: number, to: number): TemplateRowMove | undefined {
  const moved = aligned[from]?.row;
  const target = aligned[to]?.row;
  if (moved === undefined || target === undefined || moved === target) return undefined;
  const low = Math.min(moved, target);
  const high = Math.max(moved, target);
  const span = scan.rows.slice(low, high + 1);
  if (span.some((row) => row.tokens.some(trims))) return { ok: false, reason: "trim" };

  // Only the moved row changes its order against the others in the span.
  const named = scan.rows.map(rowNames);
  const own = named[moved]!;
  const others = named.slice(low, high + 1).filter((_, i) => i + low !== moved);
  if (own.block || others.some((other) => other.block)) return { ok: false, reason: "shared" };
  if (others.some((other) => shares(own.writes, other.reads) || shares(other.writes, own.reads))) return { ok: false, reason: "shared" };
  // Two rows in the span set one name: the last of them is what a later row reads.
  const contested = new Set([...own.writes].filter((name) => others.some((other) => other.writes.has(name))));
  if (named.slice(high + 1).some((later) => shares(contested, later.reads))) return { ok: false, reason: "shared" };

  const lines = span.map((row) => doc.slice(row.from, row.to));
  const line = lines[moved - low]!;
  const rest = lines.filter((_, i) => i + low !== moved);
  const ordered = moved < target ? [...rest, line] : [line, ...rest];
  return { ok: true, change: { from: span[0]!.from, to: span[span.length - 1]!.to, insert: ordered.join("\n") } };
}

/** Where a row stands on the picture, in screen points. */
export interface TemplateRowBox {
  top: number;
  height: number;
}

/** The place a dragged row takes with its top at `top`. It passes a row once
 * its leading edge is past that row's middle, so it can reach both ends. */
export function templateRowDropIndex(rows: readonly TemplateRowBox[], from: number, top: number): number {
  const height = rows[from]?.height ?? 0;
  return rows.filter((row, i) => {
    const middle = row.top + row.height / 2;
    return i < from ? top >= middle : i > from && top + height > middle;
  }).length;
}

/** How far each row stands from its own place once `from` has moved to `to`.
 * The rows keep their heights and the gap between them. */
export function templateRowShifts(rows: readonly TemplateRowBox[], from: number, to: number): number[] {
  const order = rows.map((_, i) => i).filter((i) => i !== from);
  order.splice(to, 0, from);
  const first = rows[0]?.top ?? 0;
  const last = rows[rows.length - 1];
  const filled = rows.reduce((sum, row) => sum + row.height, 0);
  const gap = rows.length > 1 && last !== undefined ? (last.top + last.height - first - filled) / (rows.length - 1) : 0;
  const shifts = rows.map(() => 0);
  let at = first;
  for (const i of order) {
    shifts[i] = at - rows[i]!.top;
    at += rows[i]!.height + gap;
  }
  return shifts;
}
