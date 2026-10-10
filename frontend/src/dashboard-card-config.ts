// The dashboard card's configuration and starting size. Its own small module
// because the card's loader (`dashboard-card-loader.ts`) answers these before
// the drawing code has loaded, and that loader is fetched on every dashboard
// page for every user.

import type { CardDesign } from "./card-api.js";
import { DASHBOARD_GRID, dashboardCanvasFor, dashboardGridFor, type GridBox } from "./dashboard-grid.js";

/** The element the dashboard creates for `type: custom:wrist-assistant-card`. */
export const CARD_TAG = "wrist-assistant-card";

/** What a user writes in the card's YAML. */
export interface CardConfig {
  type: string;
  /** Which device the design sits on, or "library". */
  owner: string;
  /** The design's id. */
  complication: string;
  /** Which of the design's shapes to draw. Default: its first. */
  shape?: string;
  /** Whether a press runs the design's taps. Default true. */
  taps?: boolean;
  /** "card" draws the dashboard's card behind the design, "none" nothing. */
  background?: "card" | "none";
  /** A Dashboard design's size in points, as the card editor last saw it.
   * Only a hint for the starting grid size: the dashboard asks for that
   * before the design is read, and the design is drawn at its own size
   * whatever this says. */
  canvas?: GridBox;
}

const SHAPES = new Set(["rectangular", "circular", "corner", "inline", "small", "medium", "large", "xlarge", "dashboard"]);

/** The config with its defaults filled in, or an error the dashboard shows in
 * place of the card. Unknown keys are kept, so a newer card's options survive
 * an older one reading them. */
export function parseCardConfig(raw: unknown): CardConfig {
  if (typeof raw !== "object" || raw === null) throw new Error("The card needs a configuration.");
  const c = raw as Record<string, unknown>;
  const complication = typeof c.complication === "string" ? c.complication.trim() : "";
  if (complication === "") throw new Error("Pick a complication: set `complication` to its id.");
  const owner = typeof c.owner === "string" && c.owner.trim() !== "" ? c.owner.trim() : "library";
  if (c.shape !== undefined && (typeof c.shape !== "string" || !SHAPES.has(c.shape))) {
    throw new Error(`\`shape\` must be one of: ${[...SHAPES].join(", ")}.`);
  }
  if (c.taps !== undefined && typeof c.taps !== "boolean") throw new Error("`taps` must be true or false.");
  if (c.background !== undefined && c.background !== "card" && c.background !== "none") {
    throw new Error("`background` must be card or none.");
  }
  if (c.canvas !== undefined && !isCanvas(c.canvas)) {
    throw new Error("`canvas` must be a width and a height in points, both above zero.");
  }
  return { ...(c as object), type: String(c.type ?? `custom:${CARD_TAG}`), owner, complication } as CardConfig;
}

/**
 * The config with its canvas hint brought up to date with the design it
 * names: the design's own canvas when the card draws its Dashboard shape, and
 * none otherwise. The same config back when nothing changed, so the editor
 * can tell whether there is anything to send.
 */
export function withCanvasHint(config: CardConfig, design: CardDesign | undefined): CardConfig {
  const shape = config.shape ?? design?.families[0];
  const want = shape === "dashboard" ? design?.canvas : undefined;
  const have = config.canvas;
  if (want?.width === have?.width && want?.height === have?.height) return config;
  const next: CardConfig = { ...config };
  if (want) next.canvas = { width: want.width, height: want.height };
  else delete next.canvas;
  return next;
}

function isCanvas(v: unknown): v is GridBox {
  if (typeof v !== "object" || v === null) return false;
  const { width, height } = v as Record<string, unknown>;
  return typeof width === "number" && typeof height === "number"
    && Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
}

/** The size a Dashboard design starts at when nothing says its own: the
 * panel's default canvas, six columns by two rows. */
const DASHBOARD_FALLBACK = dashboardCanvasFor(6, 2);

/** Whether a card draws a Dashboard design: it says so, or it carries the
 * canvas only a Dashboard design has and names no other shape. */
function isDashboardCard(shape: string | undefined, canvas: GridBox | undefined): boolean {
  return shape === "dashboard" || (shape === undefined && canvas !== undefined);
}

/** The sections grid size a shape starts at: about its design box's
 * proportions at a size that reads across a room. The drawing is fitted
 * inside whatever size the user drags it to, so these are only a start.
 *
 * A Dashboard design was sized on this very grid, so it starts at the cells
 * its canvas covers, and may be dragged down to one cell either way. */
export function gridOptionsFor(
  shape: string | undefined,
  canvas?: GridBox,
): { columns: number; rows: number; min_columns: number; min_rows: number } {
  if (isDashboardCard(shape, canvas)) {
    const cells = dashboardGridFor(canvas ?? DASHBOARD_FALLBACK);
    return { columns: cells.columns, rows: cells.rows, min_columns: 1, min_rows: 1 };
  }
  switch (shape) {
    case "circular":
    case "corner":
      return { columns: 3, rows: 2, min_columns: 2, min_rows: 1 };
    case "small":
      return { columns: 6, rows: 4, min_columns: 3, min_rows: 2 };
    case "medium":
      return { columns: 12, rows: 4, min_columns: 6, min_rows: 2 };
    case "large":
      return { columns: 12, rows: 8, min_columns: 6, min_rows: 4 };
    case "xlarge":
      return { columns: 12, rows: 12, min_columns: 6, min_rows: 6 };
    case "inline":
      return { columns: 12, rows: 1, min_columns: 4, min_rows: 1 };
    default:
      return { columns: 12, rows: 3, min_columns: 4, min_rows: 1 };
  }
}

/** The masonry view's card height, in its 50 px units. A Dashboard design's is
 * its canvas height, at the width a masonry column gives it: a column is about
 * as wide as a full section, so a design narrower than that is drawn taller
 * than its own points, by the same share. */
export function cardSizeFor(shape: string | undefined, canvas?: GridBox): number {
  if (isDashboardCard(shape, canvas)) {
    const c = canvas ?? DASHBOARD_FALLBACK;
    const full = dashboardCanvasFor(DASHBOARD_GRID.columns, 1).width;
    return Math.max(1, Math.ceil((c.height * full) / Math.max(c.width, 1) / 50));
  }
  switch (shape) {
    case "circular":
    case "corner":
    case "inline":
      return 2;
    case "small":
    case "medium":
      return 4;
    case "large":
      return 7;
    case "xlarge":
      return 11;
    default:
      return 3;
  }
}
