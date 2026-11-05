// A template tile's rendered text as rows and cells, read as the watch reads
// it: a port of `TemplateRichText.rows` in the app's
// `Shared/TemplateRichText.swift`. With the tile's `templateColumns` on, each
// row's cells stand in columns (`Line up columns`).
//
// The one rule: an icon starts a cell. Words before a row's first icon are a
// cell of their own. The number of columns is the row with the most cells, a
// column is as wide as its widest cell, and a shorter row leaves its last
// columns empty. A row of one cell runs across them all, so a long line does
// not widen the first column.
//
// No DOM here: the preview draws the rows (`preview.ts`), and the app's
// `TemplateRichTextTests.swift` pins the same cases.

import { templateRichTextSegments } from "./rich-text.js";
import { TEMPLATE_INTER_ROW, type TemplateFitDevice, templateTextUnits } from "./template-fit.js";

/** One cell: its icon, when it starts with one, and the words after it with
 * the white space around them gone. */
export interface TemplateCell {
  icon?: { symbol: string; color: string | undefined };
  text: string;
}

/** The text's rows of cells, in order. A line of nothing but white space is
 * no row: it is what a template's line breaks leave behind. */
export function templateRows(text: string): TemplateCell[][] {
  const rows: TemplateCell[][] = [];
  for (const line of text.split("\n")) {
    if (line.trim() === "") continue;
    const cells: TemplateCell[] = [];
    for (const segment of templateRichTextSegments(line)) {
      if (segment.kind === "icon") {
        cells.push({ icon: { symbol: segment.symbol, color: segment.color }, text: "" });
        continue;
      }
      const words = segment.text.trim();
      if (words === "") continue;
      const last = cells[cells.length - 1];
      if (last === undefined) cells.push({ text: words });
      else last.text = last.text === "" ? words : `${last.text} ${words}`;
    }
    rows.push(cells);
  }
  return rows;
}

/** The rows to stand in columns, or undefined while there is nothing to line
 * up: the key is off, the text has one row, or it has one column and fewer than
 * two rows start with an icon. Two such rows are worth lining up, as icons of
 * different widths push their words to different places. The tile otherwise
 * draws its text as it always did. */
export function templateColumnRows(text: string, on: boolean): TemplateCell[][] | undefined {
  if (!on) return undefined;
  const rows = templateRows(text);
  if (rows.length < 2) return undefined;
  const hasColumns = rows.some((row) => row.length > 1);
  const hasIconRows = rows.filter((row) => row[0]?.icon !== undefined).length > 1;
  return hasColumns || hasIconRows ? rows : undefined;
}

/** Whether a row runs across all the columns: a row of one cell has nothing
 * to line up, and a long one would push the other columns off the tile. The
 * app's `TemplateRichText.spansColumns` says the same. */
export function templateRowSpans(row: readonly TemplateCell[]): boolean {
  return row.length === 1;
}

/** A cell's icon slot and the gap after it, as parts of the text size. */
export const TEMPLATE_ICON_SLOT = 1.45;
export const TEMPLATE_CELL_GAP = 0.22;
export const TEMPLATE_COLUMN_GAP = 0.35;
/** A row's height as a part of the text size: Inter's line, from its
 * metrics (`TEMPLATE_INTER_ROW`). */
export const TEMPLATE_COLUMN_ROW = TEMPLATE_INTER_ROW;
/** A cell's icon fits a box this tall, as a part of the text size. */
export const TEMPLATE_ICON_TALL = 1.1;

/**
 * The size the columns are drawn at, in points: `largest`, shrunk (to 40% at
 * most, as the plain text) until the widest cell of each column and the rows
 * fit the box. Widths are the device's own (`template-fit.ts`), and a row is
 * as tall as its font's line, as a grid of `.system(size:)` text is.
 */
export function templateColumnsFontSize(rows: readonly (readonly TemplateCell[])[], widthPt: number, heightPt: number, largest: number, device: TemplateFitDevice = "iphone"): number {
  const cellUnits = (cell: TemplateCell) => (cell.icon === undefined ? 0 : TEMPLATE_ICON_SLOT + (cell.text === "" ? 0 : TEMPLATE_CELL_GAP)) + templateTextUnits(cell.text, device);
  const widths: number[] = [];
  let across = 0;
  for (const row of rows) {
    if (templateRowSpans(row)) {
      across = Math.max(across, ...row.map(cellUnits));
      continue;
    }
    row.forEach((cell, i) => {
      widths[i] = Math.max(widths[i] ?? 0, cellUnits(cell));
    });
  }
  const total = Math.max(across, widths.reduce((sum, w) => sum + w, 0) + Math.max(0, widths.length - 1) * TEMPLATE_COLUMN_GAP);
  const fit = Math.min(largest, Math.max(1, widthPt) / Math.max(1, total), Math.max(1, heightPt) / (Math.max(1, rows.length) * TEMPLATE_COLUMN_ROW));
  return Math.round(Math.max(largest * 0.4, fit) * 10) / 10;
}
