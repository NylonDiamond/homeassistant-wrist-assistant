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

import { templateIconDrawnColor, templateStyledSegments } from "./rich-text.js";
import { TEMPLATE_INTER_ROW, type TemplateFitDevice, templateTextUnits } from "./template-fit.js";

/** Words in one colour inside a cell (undefined: the ink). */
export interface TemplateRun {
  text: string;
  color: string | undefined;
}

/** One cell: its icon, when it starts with one, with the colour it draws in
 * (its own, else its run's), and the words after it with the white space
 * around them gone. `runs` holds the words by colour when any of them has
 * one, and is empty otherwise; `text` is always the words alone. */
export interface TemplateCell {
  icon?: { symbol: string; color: string | undefined };
  text: string;
  runs: TemplateRun[];
}

/** A cell's runs with the white space at its two ends cut, and the runs left
 * empty dropped (`TemplateRichText.trimmed`). */
function trimmedRuns(given: readonly TemplateRun[]): TemplateRun[] {
  const runs = given.map((r) => ({ ...r }));
  while (runs.length > 0) {
    const cut = runs[0]!.text.replace(/^\s+/u, "");
    if (cut === "") runs.shift();
    else { runs[0]!.text = cut; break; }
  }
  while (runs.length > 0) {
    const cut = runs[runs.length - 1]!.text.replace(/\s+$/u, "");
    if (cut === "") runs.pop();
    else { runs[runs.length - 1]!.text = cut; break; }
  }
  return runs.filter((r) => r.text !== "");
}

/** The text's rows of cells, in order (`TemplateRichText.rows`). An icon
 * starts a cell, and words before a row's first icon are a cell of their own.
 * A line whose text, with the markers gone, is only white space is no row: it
 * is what a template's line breaks leave behind. */
export function templateRows(text: string): TemplateCell[][] {
  const rows: TemplateCell[][] = [];
  for (const line of text.split("\n")) {
    const styled = templateStyledSegments(line);
    if (styled.every((seg) => seg.kind === "text" && seg.text.trim() === "")) continue;
    const cells: { icon?: { symbol: string; color: string | undefined }; runs: TemplateRun[] }[] = [];
    for (const seg of styled) {
      if (seg.kind === "icon") {
        cells.push({ icon: { symbol: seg.symbol, color: templateIconDrawnColor(seg.color, seg.run) }, runs: [] });
        continue;
      }
      if (cells.length === 0) {
        if (seg.text.trim() === "") continue;
        cells.push({ runs: [] });
      }
      cells[cells.length - 1]!.runs.push({ text: seg.text, color: seg.color });
    }
    const row: TemplateCell[] = [];
    for (const cell of cells) {
      const runs = trimmedRuns(cell.runs);
      if (cell.icon === undefined && runs.length === 0) continue;
      row.push({
        ...(cell.icon === undefined ? {} : { icon: cell.icon }),
        text: runs.map((r) => r.text).join(""),
        runs: runs.some((r) => r.color !== undefined) ? runs : [],
      });
    }
    rows.push(row);
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

/** A cell's icon slot and the gap after it, as parts of the text size. */
function iconUnits(cell: TemplateCell): number {
  return cell.icon === undefined ? 0 : TEMPLATE_ICON_SLOT + (cell.text === "" ? 0 : TEMPLATE_CELL_GAP);
}

function cellUnits(cell: TemplateCell, device: TemplateFitDevice): number {
  return iconUnits(cell) + templateTextUnits(cell.text, device);
}

/**
 * The size the columns are drawn at, in points: `largest`, shrunk (to 40% at
 * most, as the plain text) until the widest cell of each column and the rows
 * fit the box. Widths are the device's own (`template-fit.ts`), and a row is
 * as tall as its font's line, as a grid of `.system(size:)` text is.
 *
 * Beside real columns a row of one cell takes no part in the width: its own
 * words shrink instead (`templateSpanFontSize`), so one long line no longer
 * shrinks the whole grid (R5-050). With no columns, every row is one cell
 * and they set the size. The app's `TemplateColumnsText` does the same.
 */
export function templateColumnsFontSize(rows: readonly (readonly TemplateCell[])[], widthPt: number, heightPt: number, largest: number, device: TemplateFitDevice = "watch"): number {
  const widths: number[] = [];
  let across = 0;
  for (const row of rows) {
    if (templateRowSpans(row)) {
      across = Math.max(across, ...row.map((cell) => cellUnits(cell, device)));
      continue;
    }
    row.forEach((cell, i) => {
      widths[i] = Math.max(widths[i] ?? 0, cellUnits(cell, device));
    });
  }
  const total = widths.length === 0 ? across : widths.reduce((sum, w) => sum + w, 0) + (widths.length - 1) * TEMPLATE_COLUMN_GAP;
  const fit = Math.min(largest, Math.max(1, widthPt) / Math.max(1, total), Math.max(1, heightPt) / (Math.max(1, rows.length) * TEMPLATE_COLUMN_ROW));
  return Math.round(Math.max(largest * 0.4, fit) * 10) / 10;
}

/**
 * The rows that fit `heightPt` at the smallest size, 40% of `largest`: the
 * rest are dropped from the end, as the plain text drops lines, so no row is
 * cut in half. At least one. The app's `TemplateColumnsText.rowsInRoom`.
 */
export function templateColumnsInRoom<Row>(rows: readonly Row[], heightPt: number, largest: number): Row[] {
  const fits = Math.floor(heightPt / (largest * 0.4 * TEMPLATE_COLUMN_ROW) + 0.001);
  return rows.slice(0, Math.max(1, fits));
}

/**
 * The size, in points, the words of a row of one cell beside columns draw at:
 * the grid's `size`, or less so the row fits `widthPt`, but never under 40%
 * of `largest`. Its icon keeps the grid's size. Past that floor the row ends
 * in an ellipsis, as the app's `minimumScaleFactor` and tail truncation do.
 */
export function templateSpanFontSize(cell: TemplateCell, widthPt: number, size: number, largest: number, device: TemplateFitDevice = "watch"): number {
  const text = templateTextUnits(cell.text, device);
  if (text <= 0) return size;
  const fit = (Math.max(0, widthPt) - iconUnits(cell) * size) / text;
  return Math.round(Math.max(largest * 0.4, Math.min(size, fit)) * 10) / 10;
}
