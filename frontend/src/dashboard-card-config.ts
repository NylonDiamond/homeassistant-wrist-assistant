// The dashboard card's configuration and starting size. Its own small module
// because the card's loader (`dashboard-card-loader.ts`) answers these before
// the drawing code has loaded, and that loader is fetched on every dashboard
// page for every user.

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
  return { ...(c as object), type: String(c.type ?? `custom:${CARD_TAG}`), owner, complication } as CardConfig;
}

/** The sections grid size a shape starts at: about its design box's
 * proportions at a size that reads across a room. The drawing is fitted
 * inside whatever size the user drags it to, so these are only a start. */
export function gridOptionsFor(shape: string | undefined): { columns: number; rows: number; min_columns: number; min_rows: number } {
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

/** The masonry view's card height, in its 50 px units. */
export function cardSizeFor(shape: string | undefined): number {
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
