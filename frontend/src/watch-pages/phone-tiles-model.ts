// The four tile kinds only the iPhone draws: a map, a chart, a text field
// and a web card. Without any drawing: which kinds they are, what each of
// their keys reads as, the setters, and the words of their settings.
//
// The kinds are the device table's (`tile-devices.json` `kinds` whose list
// leaves out the watch); their rules are `tile-app.json` `phoneTiles`. A
// watch decodes such a tile and skips it, packing the page without it, so
// nothing here changes what a watch shows. Every key is optional and none is
// fresh: an absent key reads as its rule's `absent`.
//
// Plan: app repo docs/phone_native_pages_plan_2026-10.md, phase 3; the names
// in docs/phone_native_contract.md.

import tileApp from "./tile-app.json";
import { REMOVE, editTile, isBool, setKey, withKey, withoutKey } from "./tile-settings-model.js";
import { type WatchPageTile, type WatchPagesDocument, VIRTUAL_TILE_KINDS, tileDevices, tileEntityId, tileKind } from "./model.js";

/** A kind only the iPhone draws, as the entity id spells it. */
export type WatchPhoneTileKind = "map" | "chart" | "text_field" | "web";

/** One choice of a menu: the stored value and its words. */
export interface WatchPhoneTileChoice {
  value: string;
  label: string;
  /** The domain a text field's target is picked from, for that kind. */
  domain?: string;
}

interface ChoiceRule {
  key: string;
  absent: string;
  choices: WatchPhoneTileChoice[];
}

interface AddRule {
  entityIdPrefix: string;
  icon: string;
  hex: string;
  customLabel: string;
  colSpan: number;
  rowSpan: number;
  textTargetKind?: string;
}

interface PhoneTilesTable {
  map: { add: AddRule; title: string; entities: { key: string; domains: string[] }; zoom: ChoiceRule; style: ChoiceRule };
  chart: { add: AddRule; title: string; entities: { key: string; max: number }; range: ChoiceRule; style: ChoiceRule };
  textField: {
    add: AddRule;
    title: string;
    targetKind: ChoiceRule;
    target: { key: string };
    field: { key: string };
    placeholder: { key: string };
    submit: ChoiceRule;
  };
  web: {
    add: AddRule;
    title: string;
    url: { key: string; schemes: string[] };
    scroll: { key: string; absent: boolean };
    interactive: { key: string; absent: boolean };
    help: string;
  };
}

/** The rules as `tile-app.json` has them. Exported for the tests. */
export const WATCH_PHONE_TILES: Readonly<PhoneTilesTable> = (tileApp as unknown as { phoneTiles: PhoneTilesTable }).phoneTiles;
const T = WATCH_PHONE_TILES;

/** The kinds only the iPhone draws, in the order the app's kinds are
 * listed (`VIRTUAL_TILE_KINDS`): the ones whose devices leave out the watch. */
export const WATCH_PHONE_TILE_KINDS: readonly WatchPhoneTileKind[] = Object.keys(VIRTUAL_TILE_KINDS)
  .filter((kind) => !tileDevices(kind).includes("watch")) as WatchPhoneTileKind[];

/** Whether a tile kind (`tileKind`) is one only the iPhone draws. */
export function isWatchPhoneTileKind(kind: string): kind is WatchPhoneTileKind {
  return (WATCH_PHONE_TILE_KINDS as readonly string[]).includes(kind);
}

/** The tile's kind when only the iPhone draws it, else undefined. */
export function watchPhoneTileKindOf(tile: WatchPageTile): WatchPhoneTileKind | undefined {
  const kind = tileKind(tileEntityId(tile));
  return isWatchPhoneTileKind(kind) ? kind : undefined;
}

/** The add rule of a kind: its id prefix, fixed icon, color, name and size. */
export function watchPhoneTileAddRule(kind: WatchPhoneTileKind): Readonly<AddRule> {
  switch (kind) {
    case "map":
      return T.map.add;
    case "chart":
      return T.chart.add;
    case "text_field":
      return T.textField.add;
    case "web":
      return T.web.add;
  }
}

/** The settings card's title for a kind: "Map", "Chart", "Text field",
 * "Web card". */
export function watchPhoneTileTitle(kind: WatchPhoneTileKind): string {
  switch (kind) {
    case "map":
      return T.map.title;
    case "chart":
      return T.chart.title;
    case "text_field":
      return T.textField.title;
    case "web":
      return T.web.title;
  }
}

/** Every tile key the setters here write or remove. */
export const WATCH_PHONE_TILE_SETTING_KEYS: readonly string[] = [
  T.map.entities.key, T.map.zoom.key, T.map.style.key,
  T.chart.entities.key, T.chart.range.key, T.chart.style.key,
  T.textField.targetKind.key, T.textField.target.key, T.textField.field.key, T.textField.placeholder.key, T.textField.submit.key,
  T.web.url.key, T.web.scroll.key, T.web.interactive.key,
];

/** The menus' choices, for the views and the tests. */
export const WATCH_MAP_ZOOMS = T.map.zoom;
export const WATCH_MAP_STYLES = T.map.style;
export const WATCH_CHART_RANGES = T.chart.range;
export const WATCH_CHART_STYLES = T.chart.style;
export const WATCH_TEXT_TARGET_KINDS = T.textField.targetKind;
export const WATCH_TEXT_SUBMITS = T.textField.submit;

/** The domains a map's entities are picked from. */
export const WATCH_MAP_ENTITY_DOMAINS: readonly string[] = T.map.entities.domains;

/** The most entities a chart draws. */
export const WATCH_CHART_MAX_ENTITIES = T.chart.entities.max;

/** The web card's one line of help. */
export const WATCH_WEB_CARD_HELP = T.web.help;

// ── reading ──────────────────────────────────────────────────────────────

function idList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.trim() !== "") : [];
}

function choiceOf(tile: WatchPageTile, rule: ChoiceRule): string {
  const stored = tile[rule.key];
  return typeof stored === "string" ? stored : rule.absent;
}

function textOf(tile: WatchPageTile, key: string): string {
  const stored = tile[key];
  return typeof stored === "string" ? stored : "";
}

/** The map's entities as stored, strings only. */
export function watchMapEntityIds(tile: WatchPageTile): string[] {
  return idList(tile[T.map.entities.key]);
}

/** The map's zoom: the stored value, else Fit. */
export function watchMapZoom(tile: WatchPageTile): string {
  return choiceOf(tile, T.map.zoom);
}

/** The map's imagery: the stored value, else Standard. */
export function watchMapStyle(tile: WatchPageTile): string {
  return choiceOf(tile, T.map.style);
}

/** The chart's series as stored, strings only (the iPhone draws the first
 * four). */
export function watchChartEntityIds(tile: WatchPageTile): string[] {
  return idList(tile[T.chart.entities.key]);
}

/** The chart's range: the stored value, else 24 hours. */
export function watchChartRange(tile: WatchPageTile): string {
  return choiceOf(tile, T.chart.range);
}

/** How the chart draws: the stored value, else Line. */
export function watchChartStyle(tile: WatchPageTile): string {
  return choiceOf(tile, T.chart.style);
}

/** Where a text field's text goes: the stored value, else Input text. */
export function watchTextTargetKind(tile: WatchPageTile): string {
  return choiceOf(tile, T.textField.targetKind);
}

/** The entity or script that takes the text, or "" for none. */
export function watchTextTargetId(tile: WatchPageTile): string {
  return textOf(tile, T.textField.target.key);
}

/** The script field that takes the text, or "". */
export function watchTextTargetField(tile: WatchPageTile): string {
  return textOf(tile, T.textField.field.key);
}

/** The grey text in the empty field, or "" (the iPhone then shows the tile's
 * name). */
export function watchTextPlaceholder(tile: WatchPageTile): string {
  return textOf(tile, T.textField.placeholder.key);
}

/** How the text is sent: the stored value, else the return key. */
export function watchTextSubmit(tile: WatchPageTile): string {
  return choiceOf(tile, T.textField.submit);
}

/** The domain a text field's target is picked from for its kind, or
 * undefined for Assist, which has no target. */
export function watchTextTargetDomain(kind: string): string | undefined {
  return T.textField.targetKind.choices.find((c) => c.value === kind)?.domain;
}

/** The web card's address as stored, or "". */
export function watchWebURL(tile: WatchPageTile): string {
  return textOf(tile, T.web.url.key);
}

/** Whether the iPhone loads this address: an http or https URL. */
export function watchWebURLLoads(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    return T.web.url.schemes.includes(parsed.protocol.replace(/:$/, "")) && parsed.host !== "";
  } catch {
    return false;
  }
}

/** The line under the address when the iPhone will not load it, naming
 * why; undefined for an empty or a loading address. */
export function watchWebURLNote(url: string): string | undefined {
  if (url.trim() === "" || watchWebURLLoads(url)) return undefined;
  return "Only http and https addresses load. The iPhone shows No address for this one.";
}

/** Whether the page scrolls inside the card: stored, else on. */
export function watchWebScroll(tile: WatchPageTile): boolean {
  const stored = tile[T.web.scroll.key];
  return isBool(stored) ? stored : T.web.scroll.absent;
}

/** Whether the page takes touches inside the card: stored, else on. */
export function watchWebInteractive(tile: WatchPageTile): boolean {
  const stored = tile[T.web.interactive.key];
  return isBool(stored) ? stored : T.web.interactive.absent;
}

/** What the folded card says it holds. */
export function watchPhoneTileSummary(tile: WatchPageTile): string {
  const label = (rule: ChoiceRule, value: string) => rule.choices.find((c) => c.value === value)?.label ?? value;
  const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
  switch (watchPhoneTileKindOf(tile)) {
    case "map": {
      const n = watchMapEntityIds(tile).length;
      return n === 0 ? "No places" : `${count(n, "place", "places")}, ${label(T.map.zoom, watchMapZoom(tile))}`;
    }
    case "chart": {
      const n = Math.min(watchChartEntityIds(tile).length, T.chart.entities.max);
      return n === 0 ? "No entities" : `${count(n, "entity", "entities")}, ${label(T.chart.range, watchChartRange(tile))}`;
    }
    case "text_field":
      return label(T.textField.targetKind, watchTextTargetKind(tile));
    case "web": {
      const url = watchWebURL(tile).trim();
      if (url === "") return "No address";
      try {
        return new URL(url).host || url;
      } catch {
        return url;
      }
    }
    default:
      return "";
  }
}

/** Whether the tile holds any key of its kind's own: the changed dot. */
export function watchPhoneTileChanged(tile: WatchPageTile): boolean {
  const kind = watchPhoneTileKindOf(tile);
  if (kind === undefined) return false;
  const keys: Record<WatchPhoneTileKind, string[]> = {
    map: [T.map.entities.key, T.map.zoom.key, T.map.style.key],
    chart: [T.chart.entities.key, T.chart.range.key, T.chart.style.key],
    // The add writes the target kind, so only one other than the absent
    // value counts.
    text_field: [T.textField.target.key, T.textField.field.key, T.textField.placeholder.key, T.textField.submit.key],
    web: [T.web.url.key, T.web.scroll.key, T.web.interactive.key],
  };
  if (kind === "text_field" && watchTextTargetKind(tile) !== T.textField.targetKind.absent) return true;
  return keys[kind].some((key) => Object.hasOwn(tile, key));
}

// ── setters ──────────────────────────────────────────────────────────────

/** `setKey` held to tiles of `kind`. */
function setOn(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  kind: WatchPhoneTileKind,
  key: string,
  accept: (tile: WatchPageTile) => unknown,
): WatchPagesDocument {
  return setKey(document, pageId, tileId, key, (tile) => (watchPhoneTileKindOf(tile) === kind ? accept(tile) : undefined));
}

/** A menu's pick: refused when not a choice, removed when the absent value. */
function setChoice(document: WatchPagesDocument, pageId: string, tileId: string, kind: WatchPhoneTileKind, rule: ChoiceRule, value: string): WatchPagesDocument {
  if (!rule.choices.some((c) => c.value === value)) return document;
  return setOn(document, pageId, tileId, kind, rule.key, () => (value === rule.absent ? REMOVE : value));
}

/** An entity appended to a list key once, up to `max`. */
function addToList(document: WatchPagesDocument, pageId: string, tileId: string, kind: WatchPhoneTileKind, key: string, entityId: string, max = Infinity): WatchPagesDocument {
  const id = entityId.trim();
  if (id === "") return document;
  return setOn(document, pageId, tileId, kind, key, (tile) => {
    const ids = idList(tile[key]);
    if (ids.includes(id) || ids.length >= max) return undefined;
    return [...ids, id];
  });
}

/** An entity taken off a list key; the last one removes the key. */
function removeFromList(document: WatchPagesDocument, pageId: string, tileId: string, kind: WatchPhoneTileKind, key: string, entityId: string): WatchPagesDocument {
  return setOn(document, pageId, tileId, kind, key, (tile) => {
    const ids = idList(tile[key]);
    if (!ids.includes(entityId)) return undefined;
    const rest = ids.filter((id) => id !== entityId);
    return rest.length === 0 ? REMOVE : rest;
  });
}

/** Free text: trimmed when `trim`, empty removes the key. */
function setText(document: WatchPagesDocument, pageId: string, tileId: string, kind: WatchPhoneTileKind, key: string, text: string, trim = true): WatchPagesDocument {
  const value = trim ? text.trim() : text;
  return setOn(document, pageId, tileId, kind, key, () => (value === "" ? REMOVE : value));
}

/** A switch whose absent value is on: on removes the key, off writes false. */
function setOnByDefault(document: WatchPagesDocument, pageId: string, tileId: string, kind: WatchPhoneTileKind, key: string, on: boolean): WatchPagesDocument {
  if (!isBool(on)) return document;
  return setOn(document, pageId, tileId, kind, key, () => (on ? REMOVE : false));
}

/** Add a person, tracker or zone to the map. Another domain is refused. */
export function addWatchMapEntity(document: WatchPagesDocument, pageId: string, tileId: string, entityId: string): WatchPagesDocument {
  if (!T.map.entities.domains.includes(tileKind(entityId.trim()))) return document;
  return addToList(document, pageId, tileId, "map", T.map.entities.key, entityId);
}

export function removeWatchMapEntity(document: WatchPagesDocument, pageId: string, tileId: string, entityId: string): WatchPagesDocument {
  return removeFromList(document, pageId, tileId, "map", T.map.entities.key, entityId);
}

export function setWatchMapZoom(document: WatchPagesDocument, pageId: string, tileId: string, zoom: string): WatchPagesDocument {
  return setChoice(document, pageId, tileId, "map", T.map.zoom, zoom);
}

export function setWatchMapStyle(document: WatchPagesDocument, pageId: string, tileId: string, style: string): WatchPagesDocument {
  return setChoice(document, pageId, tileId, "map", T.map.style, style);
}

/** Add a series to the chart, up to four. */
export function addWatchChartEntity(document: WatchPagesDocument, pageId: string, tileId: string, entityId: string): WatchPagesDocument {
  return addToList(document, pageId, tileId, "chart", T.chart.entities.key, entityId, T.chart.entities.max);
}

export function removeWatchChartEntity(document: WatchPagesDocument, pageId: string, tileId: string, entityId: string): WatchPagesDocument {
  return removeFromList(document, pageId, tileId, "chart", T.chart.entities.key, entityId);
}

export function setWatchChartRange(document: WatchPagesDocument, pageId: string, tileId: string, range: string): WatchPagesDocument {
  return setChoice(document, pageId, tileId, "chart", T.chart.range, range);
}

export function setWatchChartStyle(document: WatchPagesDocument, pageId: string, tileId: string, style: string): WatchPagesDocument {
  return setChoice(document, pageId, tileId, "chart", T.chart.style, style);
}

/**
 * Where the text goes. Always written, the absent value too, as the add
 * writes it. The target goes when it is not of the new kind's domain (all of
 * it for Assist), and the script field goes unless the new kind is Script.
 */
export function setWatchTextTargetKind(document: WatchPagesDocument, pageId: string, tileId: string, kind: string): WatchPagesDocument {
  const rule = T.textField.targetKind;
  if (!rule.choices.some((c) => c.value === kind)) return document;
  return editTile(document, pageId, tileId, (tile) => {
    if (watchPhoneTileKindOf(tile) !== "text_field") return tile;
    let next = withKey(tile, rule.key, kind);
    const domain = watchTextTargetDomain(kind);
    const target = watchTextTargetId(next);
    if (target !== "" && (domain === undefined || tileKind(target) !== domain)) next = withoutKey(next, T.textField.target.key);
    if (kind !== "script") next = withoutKey(next, T.textField.field.key);
    return next;
  });
}

/** The entity or script that takes the text: one of the kind's domain;
 * empty removes it. Refused for Assist. */
export function setWatchTextTargetId(document: WatchPagesDocument, pageId: string, tileId: string, entityId: string): WatchPagesDocument {
  const id = entityId.trim();
  return setOn(document, pageId, tileId, "text_field", T.textField.target.key, (tile) => {
    if (id === "") return REMOVE;
    const domain = watchTextTargetDomain(watchTextTargetKind(tile));
    return domain !== undefined && tileKind(id) === domain ? id : undefined;
  });
}

export function setWatchTextTargetField(document: WatchPagesDocument, pageId: string, tileId: string, field: string): WatchPagesDocument {
  return setText(document, pageId, tileId, "text_field", T.textField.field.key, field);
}

/** The placeholder, as typed (spaces kept); empty removes it. */
export function setWatchTextPlaceholder(document: WatchPagesDocument, pageId: string, tileId: string, text: string): WatchPagesDocument {
  return setText(document, pageId, tileId, "text_field", T.textField.placeholder.key, text, false);
}

export function setWatchTextSubmit(document: WatchPagesDocument, pageId: string, tileId: string, submit: string): WatchPagesDocument {
  return setChoice(document, pageId, tileId, "text_field", T.textField.submit, submit);
}

/** The address, trimmed; empty removes it. Any text is kept: the line under
 * the field says when the iPhone will not load it. */
export function setWatchWebURL(document: WatchPagesDocument, pageId: string, tileId: string, url: string): WatchPagesDocument {
  return setText(document, pageId, tileId, "web", T.web.url.key, url);
}

export function setWatchWebScroll(document: WatchPagesDocument, pageId: string, tileId: string, on: boolean): WatchPagesDocument {
  return setOnByDefault(document, pageId, tileId, "web", T.web.scroll.key, on);
}

export function setWatchWebInteractive(document: WatchPagesDocument, pageId: string, tileId: string, on: boolean): WatchPagesDocument {
  return setOnByDefault(document, pageId, tileId, "web", T.web.interactive.key, on);
}
