// The styling table: every list, word, range, swatch list and reset key set
// of the phone's State, Border, Background and Page tasks and its page
// theme picker, as `tile-styling.json` has them. The app writes that file
// from its Swift code (`WatchPagesTablesTests`), and a test there fails when
// it drifts; nothing in it is written here by hand.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3d build contract".

import tileStyling from "./tile-styling.json";
import { watchCapitalized } from "./tile-new.js";

/** One entry of a styling menu: the stored value and its words. */
export interface WatchStylingChoice {
  value: string;
  label: string;
}

/** A slider: its ends and step, and the value shown while the key is
 * absent, when there is one. */
export interface WatchStylingSlider {
  min: number;
  max: number;
  step: number;
  auto?: number;
}

/** One state of a domain's vocabulary. */
export interface WatchStateVocabularyRow {
  key: string;
  label: string;
}

/** A domain's states for the State Icons and Colors card. */
export interface WatchStateVocabulary {
  rows: WatchStateVocabularyRow[];
  /** `hvacModes`: the rows are the entity's own `hvac_modes`, in its order,
   * labelled from `labels`. `featureBits`: a state listed there is kept only
   * when `supported_features` has one of its bits. */
  narrow: { kind: "hvacModes"; labels: Record<string, string> } | { kind: "featureBits"; bits: Record<string, number[]> } | undefined;
  /** The icon a state draws with no override of its own. */
  defaultIcons: Record<string, string>;
  /** The icon of a state the list does not have. */
  otherStateIcon: string | undefined;
  /** Per `device_class`, the icons that stand in for `defaultIcons` (a
   * cover's garage door or blind). */
  deviceClassIcons: Record<string, Record<string, string>>;
}

/** One theme's page palettes. */
export interface WatchStylingTheme {
  pageDefaultBackground: string;
  backgroundSwatchHexes: string[];
  pageSwatchHexes: string[];
  subtleSwatchHexes: string[];
  animationSwatchHexes: string[];
  /** The title palette: the fixed swatches, then this theme's first
   * background swatches, each once. */
  pageTitleSwatches: string[];
  /** Every color role of the theme, to its hex. */
  roles: Record<string, string>;
}

/** A sample of `remapKnownThemeHex`. */
export interface WatchRemapSample {
  hex: string;
  from: string;
  to: string;
  result: string | null;
}

/** One card of the State task: its id (`temperature`, `valueLabel`,
 * `textSize`, `bar`, `activity`), words, and the keys of its rows in order. */
export interface WatchStateCard {
  id: string;
  title: string;
  subtitle: string;
  rows: string[];
}

/** The tasks with a reset. */
export type WatchStylingTask = "state" | "border" | "background" | "page";

type Json = Record<string, unknown>;

const RAW = tileStyling as unknown as Json;

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function objectAt(value: unknown, key: string): Json {
  const v = isObject(value) && Object.hasOwn(value, key) ? value[key] : undefined;
  return isObject(v) ? v : {};
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

// ── enums ────────────────────────────────────────────────────────────────

interface EnumEntry {
  all: WatchStylingChoice[];
  offered: WatchStylingChoice[];
}

const ENUMS: ReadonlyMap<string, EnumEntry> = new Map(
  Object.entries(objectAt(RAW, "enums")).map(([name, raw]): [string, EnumEntry] => {
    const values = isObject(raw) && Array.isArray(raw.values) ? raw.values.filter(isObject) : [];
    const all = values.map((c) => ({ value: String(c.value), label: typeof c.label === "string" ? c.label : String(c.value) }));
    const offeredValues = isObject(raw) && Array.isArray(raw.offered) ? strings(raw.offered) : undefined;
    const offered = offeredValues === undefined ? all : all.filter((c) => offeredValues.includes(c.value));
    return [name, { all, offered }];
  }),
);

/** The values a styling enum offers, in the phone's order. Empty for an
 * enum the table does not have. */
export function watchStylingChoices(name: string): WatchStylingChoice[] {
  return (ENUMS.get(name)?.offered ?? []).map((c) => ({ ...c }));
}

/** Every value of a styling enum, offered or not: what the phone decodes. */
export function watchStylingValues(name: string): string[] {
  return (ENUMS.get(name)?.all ?? []).map((c) => c.value);
}

/** The words for a stored enum value, or the value itself. */
export function watchStylingLabel(name: string, value: string): string {
  return ENUMS.get(name)?.all.find((c) => c.value === value)?.label ?? value;
}

// ── sliders ──────────────────────────────────────────────────────────────

const SLIDERS: Json = objectAt(RAW, "sliders");

/** A slider by the key it writes. Throws for a key the table does not
 * have: every slider of these tasks is in it. */
export function watchStylingSlider(name: string): WatchStylingSlider {
  const s = Object.hasOwn(SLIDERS, name) ? SLIDERS[name] : undefined;
  if (!isObject(s) || typeof s.min !== "number" || typeof s.max !== "number" || typeof s.step !== "number") {
    throw new Error(`tile-styling.json has no slider ${name}`);
  }
  return typeof s.auto === "number" ? { min: s.min, max: s.max, step: s.step, auto: s.auto } : { min: s.min, max: s.max, step: s.step };
}

// ── state ────────────────────────────────────────────────────────────────

const STATE: Json = objectAt(RAW, "state");

/** A domain list of the State task: `valueLabels`, `bars`,
 * `activityStatus`, `activityIcon`, `decimals`, `temperature`. */
export function watchStateDomains(list: string): string[] {
  return strings(STATE[list]);
}

/** The State task's cards for a domain, in the phone's order; none for a
 * domain the task has nothing for. */
export function watchStateCards(domain: string): WatchStateCard[] {
  const cards = objectAt(STATE, "cards");
  const list = Object.hasOwn(cards, domain) ? cards[domain] : undefined;
  if (!Array.isArray(list)) return [];
  return list.filter(isObject).map((c) => ({
    id: String(c.id),
    title: typeof c.title === "string" ? c.title : "",
    subtitle: typeof c.subtitle === "string" ? c.subtitle : "",
    rows: strings(c.rows),
  }));
}

/** A State card's title for a domain, or undefined. */
export function watchStateCardTitle(card: string, domain: string): string | undefined {
  return watchStateCards(domain).find((c) => c.id === card)?.title;
}

/** The Decimals choices, and what an absent `decimalPlaces` shows. */
export function watchDecimalOptions(): { options: number[]; absent: number } {
  const options = Array.isArray(STATE.decimalOptions) ? STATE.decimalOptions.filter((n): n is number => typeof n === "number") : [];
  return { options, absent: typeof STATE.decimalsAbsent === "number" ? STATE.decimalsAbsent : (options[0] ?? 0) };
}

/** What the State task says for a domain with no cards. */
export function watchStateEmptyText(): string {
  return typeof STATE.emptyText === "string" ? STATE.emptyText : "";
}

// ── state vocabulary ─────────────────────────────────────────────────────

const VOCABULARY: Json = objectAt(RAW, "stateVocabulary");
const VOCABULARY_DOMAINS: Json = objectAt(VOCABULARY, "domains");

/** A domain's states, or undefined for a domain with no card. */
export function watchStateVocabulary(domain: string): WatchStateVocabulary | undefined {
  const raw = Object.hasOwn(VOCABULARY_DOMAINS, domain) ? VOCABULARY_DOMAINS[domain] : undefined;
  if (!isObject(raw)) return undefined;
  const rows = Array.isArray(raw.rows)
    ? raw.rows.filter(isObject).map((r) => ({ key: String(r.key), label: String(r.label ?? r.key) }))
    : [];
  let narrow: WatchStateVocabulary["narrow"];
  const n = raw.narrowing;
  if (n === "hvacModes") narrow = { kind: "hvacModes", labels: objectAt(raw, "hvacModeLabels") as Record<string, string> };
  else if (isObject(n) && isObject(n.featureBits)) narrow = { kind: "featureBits", bits: n.featureBits as Record<string, number[]> };
  return {
    rows,
    narrow,
    defaultIcons: objectAt(raw, "defaultIcons") as Record<string, string>,
    otherStateIcon: typeof raw.otherStateIcon === "string" ? raw.otherStateIcon : undefined,
    deviceClassIcons: Object.fromEntries(
      Object.entries(objectAt(raw, "deviceClassIcons")).filter(([, v]) => isObject(v)),
    ) as Record<string, Record<string, string>>,
  };
}

/** The states the card never offers (it keeps them when overridden). */
export function watchStatesNotOffered(): string[] {
  return strings(VOCABULARY.notOffered);
}

/** The label of a state the vocabulary does not list (an override kept for
 * a state the entity no longer has): `_` to a space, then Foundation's
 * `capitalized`: a letter after anything that is not a letter is upper
 * case, every other letter lower case (`fan-only` reads "Fan-Only",
 * `3rd_floor` "3Rd Floor"). */
export function watchExtraStateLabel(key: string): string {
  return watchCapitalized(key.replace(/_/g, " "));
}

/** The table's sample of appended states: the overridden keys and the rows
 * the card shows for them on a light. */
export function watchExtraStateSample(): { overridden: string[]; rows: WatchStateVocabularyRow[] } {
  const sample = objectAt(VOCABULARY, "extraSample");
  const rows = Array.isArray(sample.rows) ? sample.rows.filter(isObject).map((r) => ({ key: String(r.key), label: String(r.label) })) : [];
  return { overridden: strings(sample.overridden), rows };
}

// ── themes ───────────────────────────────────────────────────────────────

const THEME_TABLE: Json = objectAt(RAW, "themes");
const THEMES: Json = objectAt(THEME_TABLE, "themes");

/** A theme's page palettes, or undefined for a theme the table lacks. */
export function watchStylingTheme(theme: string): WatchStylingTheme | undefined {
  const t = Object.hasOwn(THEMES, theme) ? THEMES[theme] : undefined;
  if (!isObject(t)) return undefined;
  return {
    pageDefaultBackground: String(t.pageDefaultBackground ?? "#000000"),
    backgroundSwatchHexes: strings(t.backgroundSwatchHexes),
    pageSwatchHexes: strings(t.pageSwatchHexes),
    subtleSwatchHexes: strings(t.subtleSwatchHexes),
    animationSwatchHexes: strings(t.animationSwatchHexes),
    pageTitleSwatches: strings(t.pageTitleSwatches),
    roles: objectAt(t, "roleHexes") as Record<string, string>,
  };
}

/** The swatches of the page pattern and animation palettes. */
export function watchPatternSwatches(): string[] {
  return strings(THEME_TABLE.patternSwatchHexes);
}

/** The title palette's own swatches, before the theme's background
 * swatches. */
export function watchTitleSwatches(): string[] {
  return strings(THEME_TABLE.pageTitleSwatchHexes);
}

/** How many of the theme's background swatches the title palette adds. */
export function watchTitleBackgroundSwatchCount(): number {
  return typeof THEME_TABLE.pageTitleBackgroundSwatchCount === "number" ? THEME_TABLE.pageTitleBackgroundSwatchCount : 0;
}

/** The theme whose swatches a page with no known theme shows. */
export function watchSwatchFallbackTheme(): string {
  return typeof THEME_TABLE.swatchFallbackTheme === "string" ? THEME_TABLE.swatchFallbackTheme : "";
}

/** The role colors the theme strip shows under the themes, with their
 * words, in the phone's order (`PageThemePicker.themeColorSwatches`). The
 * table has no list of them, so it is kept here; the colors come from the
 * table. */
const ROLE_SWATCHES: readonly { role: string; label: string }[] = [
  { role: "entityLight", label: "Light" },
  { role: "entitySwitch", label: "Switch" },
  { role: "entityLock", label: "Lock" },
  { role: "entityCover", label: "Cover" },
  { role: "entityClimate", label: "Climate" },
  { role: "entitySensor", label: "Sensor" },
  { role: "entityCamera", label: "Camera" },
  { role: "entityMediaPlayer", label: "Media" },
  { role: "entityScene", label: "Scene" },
  { role: "entityFan", label: "Fan" },
];

export function watchPageRoleSwatches(): { role: string; label: string }[] {
  return ROLE_SWATCHES.map((r) => ({ ...r }));
}

// ── resets and the remap ─────────────────────────────────────────────────

const RESETS: Json = objectAt(RAW, "resets");

/** The keys a task's reset writes, in the table's order; `null` removes. */
export function watchStylingReset(task: WatchStylingTask): Record<string, unknown> {
  return { ...objectAt(RESETS, task) };
}

const REMAP: Json = objectAt(RAW, "remap");

/** The table's samples of the phone's theme remap. */
export function watchRemapSamples(): WatchRemapSample[] {
  return (Array.isArray(REMAP.samples) ? REMAP.samples.filter(isObject) : []) as unknown as WatchRemapSample[];
}

/** Hex (upper case, with `#`) to color role, over every theme, as the
 * phone's remap looks a color up. */
export function watchRoleByHex(): Readonly<Record<string, string>> {
  return objectAt(REMAP, "roleByHex") as Record<string, string>;
}

/** The palettes a swatch is looked up in, in the remap's order. */
export function watchRemapIndexLists(): string[] {
  return strings(REMAP.indexLists);
}

/** The themes the remap goes through, in order. */
export function watchRemapThemeOrder(): string[] {
  return strings(REMAP.themeOrder);
}

/** The table as the app wrote it, for the tests. */
export const WATCH_STYLING_TABLE: Readonly<Json> = RAW;
