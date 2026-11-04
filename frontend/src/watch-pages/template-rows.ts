// A template tile's rendered text as rows and cells, read as the watch reads
// it: a port of `TemplateRichText.rows` in the app's
// `Shared/TemplateRichText.swift`. With the tile's `templateColumns` on, each
// row's cells stand in columns (`Line up columns`).
//
// The one rule: an icon starts a cell. Words before a row's first icon are a
// cell of their own. The number of columns is the row with the most cells, a
// column is as wide as its widest cell, and a shorter row leaves its last
// columns empty.
//
// No DOM here: the preview draws the rows (`preview.ts`), and the app's
// `TemplateRichTextTests.swift` pins the same cases.

import { templateRichTextSegments } from "./rich-text.js";
import { type TemplateFitDevice, templateTextUnits } from "./template-fit.js";

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
 * up: the key is off, or the text has one row or one column. The tile then
 * draws its text as it always did. */
export function templateColumnRows(text: string, on: boolean): TemplateCell[][] | undefined {
  if (!on) return undefined;
  const rows = templateRows(text);
  if (rows.length < 2) return undefined;
  return rows.some((row) => row.length > 1) ? rows : undefined;
}

/** A cell's icon slot and the gap after it, as parts of the text size. */
export const TEMPLATE_ICON_SLOT = 1.45;
export const TEMPLATE_CELL_GAP = 0.22;
export const TEMPLATE_COLUMN_GAP = 0.35;
/** A row's height as a part of the text size: the font's line, measured. */
export const TEMPLATE_COLUMN_ROW = 1.193;
/** A cell's icon fits a box this tall, as a part of the text size. */
export const TEMPLATE_ICON_TALL = 1.1;

/**
 * The size the columns are drawn at, in points: `largest`, shrunk (to 40% at
 * most, as the plain text) until the widest cell of each column and the rows
 * fit the box. Widths are the device's own (`template-fit.ts`), and a row is
 * as tall as its font's line, as a grid of `.system(size:)` text is.
 */
export function templateColumnsFontSize(rows: readonly (readonly TemplateCell[])[], widthPt: number, heightPt: number, largest: number, device: TemplateFitDevice = "iphone"): number {
  const widths: number[] = [];
  for (const row of rows) {
    row.forEach((cell, i) => {
      const units = (cell.icon === undefined ? 0 : TEMPLATE_ICON_SLOT + (cell.text === "" ? 0 : TEMPLATE_CELL_GAP)) + templateTextUnits(cell.text, device);
      widths[i] = Math.max(widths[i] ?? 0, units);
    });
  }
  const total = widths.reduce((sum, w) => sum + w, 0) + Math.max(0, widths.length - 1) * TEMPLATE_COLUMN_GAP;
  const fit = Math.min(largest, Math.max(1, widthPt) / Math.max(1, total), Math.max(1, heightPt) / (Math.max(1, rows.length) * TEMPLATE_COLUMN_ROW));
  return Math.round(Math.max(largest * 0.4, fit) * 10) / 10;
}
