// A template's source read for the code editor (`template-code.ts`): where its
// rows, icons and expressions are, what is wrong with its names, and which part
// of the source each part of the rendered tile came from.
//
// A row ends at a line break outside a marker or an expression, as the
// rendered text does. Nothing here changes the text.
//
// No DOM here.

import type { TemplateCell } from "./template-rows.js";

export interface SourceToken {
  kind: "text" | "icon" | "expr" | "logic";
  from: number;
  to: number;
  src: string;
  /** An icon's symbol as written, which may be an expression. */
  symbol?: string;
  /** A text run with nothing between it and the part before it, like the
   * degree sign after a value. */
  glued?: boolean;
  /** A `{% set %}` or `{# note #}`, which draws nothing: it does not move a
   * row or a cell, so the tile can still be lined up with the source. */
  silent?: boolean;
}

export interface SourceRow {
  from: number;
  to: number;
  tokens: SourceToken[];
}

/** A change that fixes an issue, and the words on its button. */
export interface SourceFix {
  from: number;
  to: number;
  insert: string;
  words: string;
}

export interface SourceIssue {
  kind: "open" | "entity" | "icon";
  from: number;
  to: number;
  text: string;
  fix?: SourceFix;
}

export interface SourceScan {
  rows: SourceRow[];
  /** A marker or expression that never closes. Reading stops there. */
  open?: SourceIssue;
}

export function scanTemplateSource(doc: string): SourceScan {
  const rows: SourceRow[] = [{ from: 0, to: doc.length, tokens: [] }];
  let open: SourceIssue | undefined;
  let i = 0;
  let textStart: number | null = null;
  const row = () => rows[rows.length - 1]!;
  const endText = (end: number) => {
    if (textStart === null) return;
    const raw = doc.slice(textStart, end);
    const lead = raw.length - raw.trimStart().length;
    const trimmed = raw.trim();
    if (trimmed !== "") row().tokens.push({ kind: "text", from: textStart + lead, to: textStart + lead + trimmed.length, src: trimmed, glued: lead === 0 && row().tokens.length > 0 });
    textStart = null;
  };
  while (i < doc.length) {
    if (doc.startsWith("[icon:", i)) {
      endText(i);
      const close = markerEnd(doc, i);
      if (close < 0) {
        open = { kind: "open", from: i, to: doc.length, text: "This [icon: has no closing ].", fix: { from: doc.length, to: doc.length, insert: "]", words: "Add ]" } };
        i = doc.length;
        break;
      }
      const src = doc.slice(i, close + 1);
      const symbol = src.slice(6, -1).trim().split(/\s+/)[0] ?? "";
      row().tokens.push({ kind: "icon", from: i, to: close + 1, src, symbol });
      i = close + 1;
      continue;
    }
    if (doc.startsWith("{{", i) || doc.startsWith("{%", i) || doc.startsWith("{#", i)) {
      const logic = doc[i + 1] !== "{";
      const closer = doc[i + 1] === "#" ? "#}" : logic ? "%}" : "}}";
      endText(i);
      const close = doc.indexOf(closer, i + 2);
      if (close < 0) {
        open = { kind: "open", from: i, to: doc.length, text: `This ${doc.slice(i, i + 2)} has no closing ${closer}.`, fix: { from: doc.length, to: doc.length, insert: ` ${closer}`, words: `Add ${closer}` } };
        i = doc.length;
        break;
      }
      const src = doc.slice(i, close + 2);
      row().tokens.push({ kind: logic ? "logic" : "expr", from: i, to: close + 2, src, ...(logic && /^\{(?:#|%-?\s*(?:set|endset)\b)/.test(src) ? { silent: true } : {}) });
      i = close + 2;
      continue;
    }
    if (doc[i] === "\n") {
      endText(i);
      row().to = i;
      rows.push({ from: i + 1, to: doc.length, tokens: [] });
      i++;
      continue;
    }
    if (textStart === null) textStart = i;
    i++;
  }
  endText(i);
  return open === undefined ? { rows } : { rows, open };
}

/** Where a marker's `]` is, past any `{{ }}` in it, which may hold a `]` of
 * its own. -1 when it never closes. */
function markerEnd(doc: string, from: number): number {
  let i = from;
  while (i < doc.length) {
    if (doc.startsWith("{{", i)) {
      const close = doc.indexOf("}}", i + 2);
      if (close < 0) return -1;
      i = close + 2;
      continue;
    }
    if (doc[i] === "]") return i;
    if (doc[i] === "\n") return -1;
    i++;
  }
  return -1;
}

/** The first row a position is in, or -1. */
export function sourceRowAt(rows: readonly SourceRow[], position: number): number {
  return rows.findIndex((row) => position >= row.from && position <= row.to);
}

/** The entity ids a piece of source names, with where each starts. Only a
 * quoted word whose domain this Home Assistant has: `attributes.device_class`
 * is no entity. */
export function namedEntityIds(src: string, domains: ReadonlySet<string>): { id: string; at: number }[] {
  const out: { id: string; at: number }[] = [];
  for (const match of src.matchAll(/['"]([a-z_]+\.[a-z0-9_]+)['"]/g)) {
    const id = match[1]!;
    if (domains.has(id.split(".")[0]!)) out.push({ id, at: match.index + 1 });
  }
  return out;
}

export interface TemplateNames {
  /** Every entity id Home Assistant has. */
  entities: readonly string[];
  /** Every symbol name the panel knows, or undefined while they load. */
  symbols: readonly string[] | undefined;
}

/**
 * The names in the source that do not exist, each with the nearest real one
 * as its fix. A name the caret is in is left alone: it is still being typed.
 * Symbols written as an expression, or as an `mdi:` name, are not checked.
 */
export function templateNameIssues(scan: SourceScan, names: TemplateNames, caret: number): SourceIssue[] {
  const issues: SourceIssue[] = [];
  const entities = new Set(names.entities);
  const domains = new Set(names.entities.map((id) => id.split(".")[0]!));
  const symbols = names.symbols === undefined ? undefined : new Set(names.symbols);
  const seen = new Set<string>();
  for (const row of scan.rows) {
    for (const token of row.tokens) {
      if (token.kind === "text") continue;
      if (token.kind === "icon" && symbols !== undefined && symbols.size > 0) {
        const symbol = token.symbol ?? "";
        const from = token.from + token.src.indexOf(symbol);
        const to = from + symbol.length;
        const plain = symbol !== "" && !symbol.includes("{") && !symbol.startsWith("mdi:");
        if (plain && !symbols.has(symbol) && !(caret >= from && caret <= to)) {
          const best = nearestName(symbol, names.symbols ?? []);
          issues.push({ kind: "icon", from, to, text: `The icon ${symbol} does not exist, so the tile draws nothing.`, ...(best === undefined ? {} : { fix: { from, to, insert: best, words: `Use ${best}` } }) });
        }
      }
      for (const { id, at } of namedEntityIds(token.src, domains)) {
        const from = token.from + at;
        const to = from + id.length;
        if (entities.has(id) || (caret >= from && caret <= to) || seen.has(id)) continue;
        seen.add(id);
        const domain = `${id.split(".")[0]!}.`;
        const best = nearestName(id, names.entities.filter((e) => e.startsWith(domain)));
        issues.push({ kind: "entity", from, to, text: `The entity ${id} does not exist.`, ...(best === undefined ? {} : { fix: { from, to, insert: best, words: `Use ${best}` } }) });
      }
    }
  }
  return issues;
}

/** The closest name by edit distance, if it is close enough to be a typo. */
export function nearestName(word: string, names: readonly string[]): string | undefined {
  let best: string | undefined;
  let score = Infinity;
  for (const name of names) {
    if (Math.abs(name.length - word.length) > 6) continue;
    const distance = editDistance(word, name);
    if (distance < score) {
      score = distance;
      best = name;
    }
  }
  return score <= Math.max(3, word.length / 3) ? best : undefined;
}

function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const here = row[j]!;
      row[j] = Math.min(here + 1, row[j - 1]! + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = here;
    }
  }
  return row[b.length]!;
}

/** Where one rendered cell came from in the source. */
export interface AlignedCell {
  icon?: { from: number; to: number };
  text?: { from: number; to: number };
  /** The cell as rendered. */
  cell: TemplateCell;
  tokens: SourceToken[];
}

/** One source row with content, and the rendered cells it drew. */
export interface AlignedRow {
  /** Its index in the scan's rows. */
  row: number;
  cells: AlignedCell[];
}

const sourceCells = (row: SourceRow): SourceToken[][] => {
  const out: SourceToken[][] = [];
  let current: SourceToken[] = [];
  for (const token of row.tokens) {
    if (token.silent === true) continue;
    if (token.kind === "icon" && current.length > 0) {
      out.push(current);
      current = [];
    }
    current.push(token);
  }
  if (current.length > 0) out.push(current);
  return out;
};

/**
 * Which source part drew each rendered part. Undefined when they cannot be
 * lined up with certainty: the template has logic that decides what draws
 * (`{% if %}`, `{% for %}`; a `{% set %}` draws nothing and is fine), or the
 * rendered rows or icons are not the ones the source writes.
 */
export function alignTemplate(scan: SourceScan, rendered: readonly (readonly TemplateCell[])[]): AlignedRow[] | undefined {
  if (scan.open !== undefined) return undefined;
  const filled = scan.rows.map((row, index) => ({ row, index })).filter(({ row }) => row.tokens.some((t) => t.silent !== true));
  if (scan.rows.some((row) => row.tokens.some((t) => t.kind === "logic" && t.silent !== true))) return undefined;
  if (filled.length !== rendered.length) return undefined;
  const out: AlignedRow[] = [];
  for (let r = 0; r < filled.length; r++) {
    const parts = sourceCells(filled[r]!.row);
    const cells = rendered[r]!;
    if (parts.length !== cells.length) return undefined;
    const aligned: AlignedCell[] = [];
    for (let c = 0; c < parts.length; c++) {
      const tokens = parts[c]!;
      const cell = cells[c]!;
      const icon = tokens[0]!.kind === "icon" ? tokens[0]! : undefined;
      if ((icon === undefined) !== (cell.icon === undefined)) return undefined;
      if (icon !== undefined && !(icon.symbol ?? "").includes("{") && icon.symbol !== cell.icon?.symbol) return undefined;
      const words = icon === undefined ? tokens : tokens.slice(1);
      aligned.push({
        ...(icon === undefined ? {} : { icon: { from: icon.from, to: icon.to } }),
        ...(words.length === 0 ? {} : { text: { from: words[0]!.from, to: words[words.length - 1]!.to } }),
        cell,
        tokens,
      });
    }
    out.push({ row: filled[r]!.index, cells: aligned });
  }
  return out;
}

/**
 * What each expression shows, by where it starts: a cell's rendered words
 * with the words the source writes around the expression taken off. Only for
 * a cell with one expression; with two, nothing says which words are whose.
 */
export function templateTokenValues(aligned: readonly AlignedRow[] | undefined): Map<number, string> {
  const values = new Map<number, string>();
  for (const row of aligned ?? []) {
    for (const cell of row.cells) {
      const exprs = cell.tokens.filter((t) => t.kind === "expr");
      if (exprs.length !== 1) continue;
      const expr = exprs[0]!;
      let words = cell.cell.text;
      const before = cell.tokens.filter((t) => t.kind === "text" && t.to <= expr.from).map((t) => t.src).join(" ");
      const after = cell.tokens.filter((t) => t.kind === "text" && t.from >= expr.to).map((t) => t.src).join(" ");
      if (before !== "" && words.startsWith(before)) words = words.slice(before.length);
      if (after !== "" && words.endsWith(after)) words = words.slice(0, words.length - after.length);
      values.set(expr.from, words.trim());
    }
  }
  return values;
}

/**
 * The best guess at where a rendered part came from when the template cannot
 * be lined up: an icon of that name, or written words that hold it. Undefined
 * when the part comes out of logic and no one place wrote it.
 */
export function findTemplatePart(scan: SourceScan, cell: TemplateCell | undefined, part: "icon" | "text"): { from: number; to: number } | undefined {
  if (cell === undefined) return undefined;
  const tokens = scan.rows.flatMap((row) => row.tokens);
  if (part === "icon") {
    const found = tokens.find((t) => t.kind === "icon" && t.symbol === cell.icon?.symbol);
    return found === undefined ? undefined : { from: found.from, to: found.to };
  }
  const found = tokens.find((t) => t.kind === "text" && (cell.text.includes(t.src) || t.src.includes(cell.text)));
  return found === undefined ? undefined : { from: found.from, to: found.to };
}
