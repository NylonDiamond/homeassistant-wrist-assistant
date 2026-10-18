// Help for writing a template: ready-made recipes, putting an entity into the
// box where the caret is, and the words under the box. Shared by a
// complication value's Template source and the watch page's Template tile.
// The form itself lives with the editors; this file is the part a test can
// read without a browser.

import { DOORS_OPEN_TEMPLATE, eventTitleTemplate } from "./presets.js";

/** What the box's result is used for, which decides the recipes offered. */
export type TemplateUse =
  /** Words or a number, the usual case. */
  | "text"
  /** An SF Symbol name. */
  | "symbol"
  /** An SF Symbol name or a whole `mdi:` name: a rich text icon part. */
  | "symbolMdi"
  /** True or false: a watch tile's Show tile template. */
  | "condition";

export interface TemplateRecipe {
  id: string;
  label: string;
  /** The chip's tooltip: what the recipe prints. */
  title: string;
  /** The entity domains the recipe reads; undefined when it reads none, and
   * empty when any entity will do. */
  domains?: readonly string[];
  uses: readonly TemplateUse[];
  build(entityId: string): string;
}

/** Counts the lights that are on, in words. Also the starter a new Template
 * source opens with, so the Lights on recipe shows as chosen there. */
export const LIGHTS_ON_TEMPLATE = "💡 {{ states.light | selectattr('state', 'eq', 'on') | list | count }} Lights On";

const TEXT: readonly TemplateUse[] = ["text"];
const CONDITION: readonly TemplateUse[] = ["condition"];
const ICONS: readonly TemplateUse[] = ["symbol", "symbolMdi"];
const ANY: readonly string[] = [];

export const TEMPLATE_RECIPES: readonly TemplateRecipe[] = [
  {
    id: "unit", label: "With unit", title: "The state with its unit, like 21.5 °C",
    domains: ANY, uses: TEXT,
    build: (e) => `{{ states('${e}', with_unit=True) }}`,
  },
  {
    id: "round", label: "Whole number", title: "The state rounded to a whole number, like 22",
    domains: ANY, uses: TEXT,
    build: (e) => `{{ states('${e}') | float(0) | round(0) | int }}`,
  },
  {
    id: "words", label: "On or off as words", title: "Your own word for on and for off",
    domains: ANY, uses: TEXT,
    build: (e) => `{{ 'Open' if is_state('${e}', 'on') else 'Closed' }}`,
  },
  {
    id: "since", label: "Time since change", title: "How long ago the state changed, like 5 minutes",
    domains: ANY, uses: TEXT,
    build: (e) => `{{ relative_time(states['${e}'].last_changed) }}`,
  },
  {
    id: "event", label: "Next event", title: "The name of the calendar's next event",
    domains: ["calendar"], uses: TEXT,
    build: (e) => eventTitleTemplate(e),
  },
  {
    id: "lights", label: "Lights on", title: "How many lights are on",
    uses: TEXT,
    build: () => LIGHTS_ON_TEMPLATE,
  },
  {
    id: "doors", label: "Doors open", title: "How many doors and windows are open",
    uses: TEXT,
    build: () => `🚪 ${DOORS_OPEN_TEMPLATE} Open`,
  },
  {
    id: "mdi", label: "MDI icon by state", title: "One Material Design icon when on, another when off",
    domains: ANY, uses: ["symbolMdi"],
    build: (e) => `{{ 'mdi:lightbulb-on' if is_state('${e}', 'on') else 'mdi:lightbulb-outline' }}`,
  },
  {
    id: "isOn", label: "Is on", title: "True while the entity is on",
    domains: ANY, uses: CONDITION,
    build: (e) => `{{ is_state('${e}', 'on') }}`,
  },
  {
    id: "isHome", label: "Is home", title: "True while the person is home",
    domains: ["person", "device_tracker"], uses: CONDITION,
    build: (e) => `{{ is_state('${e}', 'home') }}`,
  },
  {
    id: "above", label: "Above a number", title: "True while the state is above 20",
    domains: ANY, uses: CONDITION,
    build: (e) => `{{ states('${e}') | float(0) > 20 }}`,
  },
  {
    id: "anyoneHome", label: "Anyone home", title: "True while someone is home",
    uses: CONDITION,
    build: () => "{{ states.person | selectattr('state', 'eq', 'home') | list | count > 0 }}",
  },
  {
    id: "dark", label: "After sunset", title: "True while the sun is below the horizon",
    uses: CONDITION,
    build: () => "{{ is_state('sun.sun', 'below_horizon') }}",
  },
  {
    id: "sf", label: "Symbol by state", title: "One SF Symbol when on, another when off",
    domains: ANY, uses: ICONS,
    build: (e) => `{{ 'lightbulb.fill' if is_state('${e}', 'on') else 'lightbulb' }}`,
  },
];

export function recipesFor(use: TemplateUse): TemplateRecipe[] {
  return TEMPLATE_RECIPES.filter((r) => r.uses.includes(use));
}

/** Matches an entity id written as a quoted string: `'sensor.kitchen'`. */
const QUOTED_ID = /['"]([a-z_][a-z0-9_]*\.[a-z0-9_]+)['"]/g;

/**
 * The entity a recipe should read: the last one the template names that this
 * Home Assistant has. The last, because "Insert entity" adds at the caret and
 * the newest pick is the one the author is working on.
 */
export function namedEntity(template: string, states: Record<string, unknown>): string | undefined {
  let found: string | undefined;
  for (const m of template.matchAll(QUOTED_ID)) if (m[1]! in states) found = m[1];
  return found;
}

/** Whether a recipe needs an entity picked before it can go in: it reads
 * one, and the template names none it can read. */
export function recipeNeedsEntity(recipe: TemplateRecipe, entityId: string | undefined): boolean {
  if (recipe.domains === undefined) return false;
  if (entityId === undefined) return true;
  return recipe.domains.length > 0 && !recipe.domains.includes(entityId.split(".")[0]!);
}

/** "an entity", or "a calendar entity" for a recipe that reads one kind. */
export function recipeEntityWords(recipe: TemplateRecipe): string {
  const kinds = recipe.domains ?? [];
  return kinds.length === 0 ? "an entity" : `a ${kinds.join(" or ")} entity`;
}

/** Whether the box holds exactly what this recipe prints, so its button
 * shows as chosen. */
export function recipeChosen(recipe: TemplateRecipe, template: string, entityId: string | undefined): boolean {
  if (recipeNeedsEntity(recipe, entityId)) return false;
  return recipe.build(entityId ?? "").trim() === template.trim();
}

/** A recipe clicked before its entity was picked, by the box's key: the
 * entity search below the box then asks for one, and the pick puts the
 * recipe in instead of the bare entity. */
export const pendingRecipes = new Map<string, string>();

/** A template that is only a start, which a recipe may replace whole: empty,
 * the starter, one plain state, or what a recipe printed. */
export function isReplaceable(template: string, starter: string, states: Record<string, unknown>): boolean {
  const t = template.trim();
  if (t === "" || t === starter.trim()) return true;
  if (/^\{\{\s*states\(\s*['"][^'"]+['"]\s*\)\s*\}\}$/.test(t)) return true;
  const e = namedEntity(t, states) ?? "";
  return TEMPLATE_RECIPES.some((r) => r.build(e).trim() === t);
}

export interface Inserted {
  text: string;
  /** Where the caret goes after the insert. */
  cursor: number;
}

/** Put `snippet` in at `cursor` (clamped; undefined is the end). */
export function insertAt(text: string, cursor: number | undefined, snippet: string): Inserted {
  const at = cursor === undefined ? text.length : Math.max(0, Math.min(cursor, text.length));
  return { text: text.slice(0, at) + snippet + text.slice(at), cursor: at + snippet.length };
}

/** Whether `cursor` sits inside a `{{ … }}` or `{% … %}` block. */
export function insideBlock(text: string, cursor: number): boolean {
  const before = text.slice(0, cursor);
  const open = Math.max(before.lastIndexOf("{{"), before.lastIndexOf("{%"));
  const close = Math.max(before.lastIndexOf("}}"), before.lastIndexOf("%}"));
  return open > close;
}

/** An entity put into the box: its state, wrapped in `{{ }}` unless the caret
 * is already inside a block. */
export function insertEntity(text: string, cursor: number | undefined, entityId: string): Inserted {
  const at = cursor === undefined ? text.length : Math.max(0, Math.min(cursor, text.length));
  const read = `states('${entityId}')`;
  if (insideBlock(text, at)) return insertAt(text, at, read);
  const gap = at > 0 && !/\s$/.test(text.slice(0, at)) ? " " : "";
  return insertAt(text, at, `${gap}{{ ${read} }}`);
}

/** A recipe put into the box: the whole box when it is only a start,
 * otherwise in at the caret. */
export function applyRecipe(
  text: string,
  cursor: number | undefined,
  recipe: TemplateRecipe,
  entityId: string | undefined,
  starter: string,
  states: Record<string, unknown>,
): Inserted {
  const built = recipe.build(entityId ?? "");
  if (isReplaceable(text, starter, states)) return { text: built, cursor: built.length };
  return insertAt(text, cursor, built);
}

/** The caret of each template box when it last lost focus, by the box's key.
 * A click on a recipe or the entity search moves focus out of the box, and
 * the insert still has to land where the author left off. */
export const templateCursors = new Map<string, number>();

/**
 * The lines under a template box, for what its result is used for.
 * `bare` says whether one expression without braces works: a complication's
 * template document takes it as is, a page tile renders the text as written.
 */
export function templateHint(use: TemplateUse, bare: boolean): string[] {
  const lines = [bare
    ? "Home Assistant renders this. Write {{ … }} around each part that reads something, or write one expression on its own, like states('sensor.power')."
    : "Home Assistant renders this. Write {{ … }} around each part that reads something, like {{ states('sensor.power') }}."];
  if (use === "text") lines.push("The result should be one value: words or a number.");
  if (use === "condition") {
    lines.push("The tile shows while the result is true, on, yes or a number other than 0, and is left out for anything else.");
    lines.push("A template that fails, or renders unknown or unavailable, shows the tile. Home Assistant renders it again when an entity it reads changes.");
  }
  if (use === "symbol") lines.push("The result should be an SF Symbol name, like lightbulb.fill. An empty result draws nothing.");
  if (use === "symbolMdi") {
    lines.push("The result should be an SF Symbol name, like lightbulb.fill, or a Material Design icon written out in full, like 'mdi:water'. A name pieced together, like 'mdi:water-' ~ level, does not draw.");
  }
  return lines;
}
