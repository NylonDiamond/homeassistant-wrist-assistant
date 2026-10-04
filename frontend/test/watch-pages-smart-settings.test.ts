// The smart page views (part 3f batch 3): the Page card's Smart Page switch
// with the phone's convert question and its rows, the Rules card (the chip
// strip, Add Domain, each rule row, the Header), the per-domain style
// through the stand-in tile, and the stage's facts and faint tiles.
//
// No DOM: each view is drawn to its Lit templates, read as text, and its
// controls are pressed by calling the handler the template holds for them
// with a stand-in event. The host is a real draft, so every press is an
// edit with its undo step.

import { describe, expect, it, vi } from "vitest";
import { html } from "lit";

import type { HassEntityState } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { SymbolBrowser } from "../src/symbols.js";
import { type WatchPagesApplyOptions, WatchPagesDraft } from "../src/watch-pages/draft.js";
import { checkWatchPagesValues } from "../src/watch-pages/merge.js";
import type { WatchPagesEditorHost } from "../src/watch-pages/editor-host.js";
import type { JsonObject, WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { tileLabel } from "../src/watch-pages/model.js";
import { renderWatchPagePreview } from "../src/watch-pages/preview.js";
import { WATCH_SMART, readSmartConfig, smartWord } from "../src/watch-pages/smart-model.js";
import {
  SMART_PRESET_ADDED_REASON,
  renderSmartPageRows,
  renderSmartRulesCard,
  smartDomainColorHex,
  smartSelectedRuleIndex,
  smartStageFacts,
  smartStyleHost,
} from "../src/watch-pages/smart-settings.js";
import { renderTileSettings } from "../src/watch-pages/tile-settings.js";
import { watchDomainStyleSections } from "../src/watch-pages/tile-settings-options.js";
import tileSmart from "../src/watch-pages/tile-smart.json";

// The views ask for the focused field (`document.activeElement`); Node has
// no document.
(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};
(globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ??= class {};

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";
const R1 = "11111111-0000-4000-8000-000000000001";
const R2 = "22222222-0000-4000-8000-000000000002";
const R3 = "33333333-0000-4000-8000-000000000003";
const R4 = "44444444-0000-4000-8000-000000000004";

const W = (name: string, values?: Record<string, string | number>) => smartWord(name, values);

// ── reading templates ────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}

function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flatten(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (isTpl(node)) {
    out.push(node);
    for (const v of node.values) templates(v, out);
  }
  return out;
}

/** A template's text with where each of its own `event` handlers sits. */
function laidOut(t: Tpl, event: string): { text: string; fns: { fn: unknown; at: number }[] } {
  let text = "";
  const fns: { fn: unknown; at: number }[] = [];
  t.strings.forEach((s, i) => {
    text += s;
    if (i >= t.values.length) return;
    const v = t.values[i];
    if (typeof v === "function" && s.trimEnd().endsWith(event)) fns.push({ fn: v, at: text.length });
    text += flatten(v);
  });
  return { text, fns };
}

/** The handler for `event` of the smallest template whose text holds
 * `marker` and that binds the event itself; of its handlers, the one
 * nearest the marker. */
function handler(root: unknown, marker: string, event = "@click="): (e?: unknown) => void {
  const found = templates(root)
    .map((t) => laidOut(t, event))
    .filter((c) => c.text.includes(marker) && c.fns.length > 0)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) {
    // The marker is a field's title and the handler is on its box, a
    // template of its own inside the field's.
    const inner = templates(root)
      .filter((t) => flatten(t).includes(marker))
      .sort((a, b) => flatten(a).length - flatten(b).length)
      .map((field) => templates(field.values).map((t) => laidOut(t, event)).find((c) => c.fns.length > 0))
      .find((c) => c !== undefined);
    if (inner === undefined) throw new Error(`no ${event} handler near ${marker}`);
    return inner.fns[0]!.fn as (e?: unknown) => void;
  }
  const { text, fns } = found[0]!;
  const at = text.indexOf(marker);
  return [...fns].sort((a, b) => Math.abs(a.at - at) - Math.abs(b.at - at))[0]!.fn as (e?: unknown) => void;
}

const click = (root: unknown, marker: string) => handler(root, marker)({ currentTarget: null, stopPropagation() {} });
const check = (root: unknown, marker: string, on: boolean) => handler(root, marker, "@change=")({ target: { checked: on } });
const pick = (root: unknown, marker: string, value: string) => handler(root, marker, "@change=")({ target: { value } });
const type = (root: unknown, marker: string, value: string) =>
  handler(root, marker, "@input=")({ target: { value, type: "text", validity: { badInput: false } } });

// ── a host on a real draft ───────────────────────────────────────────────

const namedIcons: IconProvider = {
  render: (name: string) => html`<svg data-symbol=${name}></svg>`,
  available: () => true,
  names: () => undefined,
};

function state(entityId: string, value: string, attributes: Record<string, unknown> = {}): HassEntityState {
  return { entity_id: entityId, state: value, attributes: { friendly_name: entityId.split(".")[1]!.replace(/_/g, " "), ...attributes } } as unknown as HassEntityState;
}

function statesOf(...list: HassEntityState[]): Record<string, HassEntityState> {
  return Object.fromEntries(list.map((s) => [s.entity_id, s]));
}

const STATES = statesOf(
  state("light.desk", "on"),
  state("light.porch", "off"),
  state("light.attic", "on"),
  state("binary_sensor.front_door", "on", { device_class: "door" }),
  state("binary_sensor.hall_window", "off", { device_class: "window" }),
  state("sensor.phone_battery", "12", { device_class: "battery" }),
  state("media_player.den", "playing"),
);

function setup(page: WatchPage, states: Record<string, HassEntityState> = STATES) {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [page] }, 1);
  let selected: string | undefined;
  const uiState = new Map<string, unknown>();
  const applied: WatchPagesDocument[] = [];
  const host = {
    hass: { states },
    icons: namedIcons,
    symbols: new SymbolBrowser(() => {}),
    get document() { return draft.document; },
    pageId: PAGE,
    get page() { return (draft.document.pages as WatchPage[])[0]!; },
    otherPages: [],
    catalog: undefined,
    cameraRefreshDefaults: { on: true, debounce: "30s" },
    behavior: undefined,
    musicAssistant: undefined,
    cloudTTS: undefined,
    templateRenders: new Map(),
    deviceSiblings: () => [],
    loadImageSize: async () => undefined,
    busy: false,
    uiState,
    apply: (next: WatchPagesDocument, options?: WatchPagesApplyOptions) => {
      applied.push(next);
      return draft.apply(next, options);
    },
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    get smartRuleId() { return selected; },
    selectSmartRule: (id: string | undefined) => { selected = id; },
    requestUpdate: () => undefined,
  } as unknown as WatchPagesEditorHost;
  const pageNow = () => host.page;
  const config = () => readSmartConfig(pageNow());
  const rule = (id: string) => ((pageNow().dynamicConfig as JsonObject).rules as JsonObject[]).find((r) => r.id === id)!;
  return { draft, host, page: pageNow, config, rule, applied, selected: () => selected };
}

const tiles = (n: number): WatchPageTile[] =>
  Array.from({ length: n }, (_, i) => ({ id: `T${i}`, entityId: `light.t${i}`, gridCol: 0, gridRow: i * 3, colSpan: 4, rowSpan: 3 }));

const plainPage = (n: number): WatchPage => ({ id: PAGE, name: "Home", themeOverride: "neonLagoon", items: tiles(n) });

function ruleOf(id: string, domain: string, extra: JsonObject = {}): JsonObject {
  return { domain, entityIds: [], header: "label", id, invertActive: false, mode: "all", ...extra };
}

function smartPage(rules: JsonObject[], config: JsonObject = {}): WatchPage {
  return {
    id: PAGE,
    name: "Active",
    themeOverride: "neonLagoon",
    items: [],
    groups: [],
    dynamicConfig: {
      liveUpdates: false, pullToRefresh: true, refreshOnAppear: false, rules, sortOrder: "domain",
      tileColSpan: 4, tileRowSpan: 3, tileShowLabel: true, ...config,
    },
  };
}

const LIGHTS = ruleOf(R1, "light", { headerLabel: "Lights", resolvedEntityIds: ["light.attic", "light.desk", "light.porch"], tileStyle: { color: "#F5C26B", icon: "lightbulb.fill" } });
const DOORS = ruleOf(R2, "binary_sensor", { deviceClassFilter: ["door"], headerLabel: "Doors" });
const BATTERIES = ruleOf(R3, "sensor", { deviceClassFilter: ["battery"], headerLabel: "Batteries" });
const PLAYERS = ruleOf(R4, "media_player", { mode: "specific", entityIds: ["media_player.den"] });

// ── the Page card ────────────────────────────────────────────────────────

describe("the Smart Page switch", () => {
  it("asks before converting a page with tiles, in the phone's words, and Convert is one undo step", () => {
    const s = setup(plainPage(2));
    expect(flatten(renderSmartPageRows(s.host))).toContain(W("smartPage"));
    check(renderSmartPageRows(s.host), W("smartPage"), true);
    expect(s.draft.canUndo).toBe(false);
    const asked = flatten(renderSmartPageRows(s.host));
    expect(asked).toContain(W("convertTitle"));
    expect(asked).toContain("This will remove all 2 tiles on this page.");
    expect(asked).toContain(`>${W("cancel")}<`);
    expect(asked).toContain(`>${W("convert")}<`);
    click(renderSmartPageRows(s.host), `>${W("convert")}<`);
    expect(s.page().items).toEqual([]);
    expect(s.config()?.rules).toEqual([]);
    expect(flatten(renderSmartPageRows(s.host))).not.toContain(W("convertTitle"));
    s.draft.undo();
    expect(s.page().items).toHaveLength(2);
    expect(s.page().dynamicConfig).toBeUndefined();
  });

  it("says one tile in the singular, and Cancel changes nothing", () => {
    const s = setup(plainPage(1));
    check(renderSmartPageRows(s.host), W("smartPage"), true);
    expect(flatten(renderSmartPageRows(s.host))).toContain(W("convertMessageOne"));
    click(renderSmartPageRows(s.host), `>${W("cancel")}<`);
    expect(flatten(renderSmartPageRows(s.host))).not.toContain(W("convertTitle"));
    expect(s.draft.canUndo).toBe(false);
  });

  it("converts an empty page at once, and off turns it back at once", () => {
    const s = setup(plainPage(0));
    check(renderSmartPageRows(s.host), W("smartPage"), true);
    expect(s.config()).toBeDefined();
    expect(flatten(renderSmartPageRows(s.host))).not.toContain(W("convertTitle"));
    check(renderSmartPageRows(s.host), W("smartPage"), false);
    expect(s.page().dynamicConfig).toBeUndefined();
    expect(s.page().items).toEqual([]);
  });
});

describe("the smart page rows", () => {
  it("show Refresh on Page View and Pull to Refresh only while Live Updates is off", () => {
    const off = flatten(renderSmartPageRows(setup(smartPage([])).host));
    expect(off).toContain("Live Updates");
    expect(off).toContain("Real-time via background sync");
    expect(off).toContain("Refresh on Page View");
    expect(off).toContain("Pull to Refresh");
    const on = flatten(renderSmartPageRows(setup(smartPage([], { liveUpdates: true })).host));
    expect(on).toContain("Live Updates");
    expect(on).not.toContain("Refresh on Page View");
    expect(on).not.toContain("Pull to Refresh");
  });

  it("write each switch, the size presets, the boxes, the labels and the sort order", () => {
    const s = setup(smartPage([]));
    check(renderSmartPageRows(s.host), "Live Updates", true);
    expect(s.config()?.liveUpdates).toBe(true);
    check(renderSmartPageRows(s.host), W("showLabels"), false);
    expect(s.config()?.tileShowLabel).toBe(false);
    const rows = flatten(renderSmartPageRows(s.host));
    expect(rows).toMatch(/pe-chip on" aria-pressed=true title=4w × 3h\s+@click=>Standard/);
    click(renderSmartPageRows(s.host), ">Small<");
    expect([s.config()?.tileColSpan, s.config()?.tileRowSpan]).toEqual([2, 2]);
    type(renderSmartPageRows(s.host), "Columns", "7");
    expect(s.config()?.tileColSpan).toBe(7);
    type(renderSmartPageRows(s.host), "Rows", "40");
    expect(s.config()?.tileRowSpan).toBe(2);
    expect(flatten(renderSmartPageRows(s.host))).toContain("Use a number from 1 to 12.");
    pick(renderSmartPageRows(s.host), W("sortOrder"), "alphabetical");
    expect(s.config()?.sortOrder).toBe("alphabetical");
  });
});

// ── the Rules card ───────────────────────────────────────────────────────

describe("the rule strip", () => {
  it("names each rule by its preset, marks the first as selected, and a chip selects its rule", () => {
    const s = setup(smartPage([LIGHTS, DOORS, BATTERIES]));
    const card = flatten(renderSmartRulesCard(s.host));
    expect(card).toContain(">Lights</button>");
    expect(card).toContain(">Doors</button>");
    expect(card).toContain(">Batteries</button>");
    expect(card).toMatch(/sm-chip on" aria-pressed=true\s+title=light/);
    click(renderSmartRulesCard(s.host), ">Doors</button>");
    expect(s.selected()).toBe(R2);
    expect(smartSelectedRuleIndex(s.config()!, s.selected())).toBe(1);
  });

  it("shows the shared domain note above the strip", () => {
    const windows = ruleOf("55555555-0000-4000-8000-000000000005", "binary_sensor", { deviceClassFilter: ["window"] });
    const card = flatten(renderSmartRulesCard(setup(smartPage([DOORS, windows])).host));
    expect(card).toContain(W("sharedDomain", { domain: "binary_sensor" }));
  });

  it("draws nothing on a page that is not smart", () => {
    expect(flatten(renderSmartRulesCard(setup(plainPage(1)).host))).toBe("");
  });
});

describe("Add Domain", () => {
  it("lists the presets with the added ones off and checked, and a pick adds, resolves, selects and closes", () => {
    const s = setup(smartPage([LIGHTS]));
    click(renderSmartRulesCard(s.host), W("addDomain"));
    const dialog = flatten(renderSmartRulesCard(s.host));
    expect(dialog).toContain(`<h3 id="sm-add-title">${W("addDomain")}</h3>`);
    expect(dialog).toContain(W("pickerIntro"));
    for (const preset of WATCH_SMART.presets) expect(dialog).toContain(`>${preset.label}<`);
    expect(dialog).not.toContain(">Persons<");
    // Lights is on the page: off, with the check and the reason.
    expect(dialog).toMatch(new RegExp(`sm-preset added" \\?disabled=true\\s+title=${SMART_PRESET_ADDED_REASON}`));
    expect(dialog).toMatch(/>Lights<\/span>\s*<span class="at-added">/);
    click(renderSmartRulesCard(s.host), ">Doors<");
    const rules = s.config()!.rules;
    expect(rules.map((r) => r.domain)).toEqual(["light", "binary_sensor"]);
    const added = rules[1]!;
    expect(added.deviceClassFilter).toEqual(["door"]);
    expect(added.headerLabel).toBe("Doors");
    expect(added.tileStyle?.color).toBe(smartDomainColorHex("binary_sensor", s.page()).toUpperCase());
    expect(added.resolvedEntityIds).toEqual(["binary_sensor.front_door", "binary_sensor.hall_window"]);
    expect(s.selected()).toBe(added.id);
    expect(flatten(renderSmartRulesCard(s.host))).not.toContain("sm-add-title");
    // One undo step.
    s.draft.undo();
    expect(s.config()!.rules).toHaveLength(1);
  });

  it("colors a preset with its domain's role in the page's theme", () => {
    const roles = (tileSmart as { domains: { list: { domain: string; colorRole: string }[] } }).domains.list;
    expect(roles.find((d) => d.domain === "light")?.colorRole).toBe("entityLight");
    expect(smartDomainColorHex("light", smartPage([]))).toMatch(/^#[0-9A-F]{6}$/i);
    expect(smartDomainColorHex("light", smartPage([]))).not.toBe(smartDomainColorHex("switch", smartPage([])));
  });
});

describe("a rule's rows", () => {
  it("All shows the count and Resolve, or Not resolved; Resolve writes the list", () => {
    const s = setup(smartPage([LIGHTS, DOORS]));
    expect(flatten(renderSmartRulesCard(s.host))).toContain("3 entities");
    s.host.selectSmartRule(R2);
    const card = flatten(renderSmartRulesCard(s.host));
    expect(card).toContain(W("notResolved"));
    click(renderSmartRulesCard(s.host), `>${W("resolve")}<`);
    expect(s.rule(R2).resolvedEntityIds).toEqual(["binary_sensor.front_door", "binary_sensor.hall_window"]);
  });

  it("Specific lists the domain's entities, filtered by the device classes, picks first, and a tick writes the picks", () => {
    const s = setup(smartPage([DOORS]));
    click(renderSmartRulesCard(s.host), ">Specific<");
    expect(s.rule(R2).mode).toBe("specific");
    let card = flatten(renderSmartRulesCard(s.host));
    expect(card).toContain(W("entitiesSelected", { count: 0 }));
    expect(card).toContain("front door");
    expect(card).not.toContain("hall window");
    check(renderSmartRulesCard(s.host), "front door", true);
    expect(s.rule(R2).entityIds).toEqual(["binary_sensor.front_door"]);
    card = flatten(renderSmartRulesCard(s.host));
    expect(card).toContain(W("entitiesSelected", { count: 1 }));
    // Back to All resolves the rule from the states.
    click(renderSmartRulesCard(s.host), ">All<");
    expect(s.rule(R2).mode).toBe("all");
    expect(s.rule(R2).resolvedEntityIds).toEqual(["binary_sensor.front_door", "binary_sensor.hall_window"]);
    expect(s.rule(R2).entityIds).toEqual(["binary_sensor.front_door"]);
  });

  it("writes Show when, the device class chips and Active when state is", () => {
    const s = setup(smartPage([DOORS]));
    check(renderSmartRulesCard(s.host), "Show when off", true);
    expect(s.rule(R2).invertActive).toBe(true);
    click(renderSmartRulesCard(s.host), ">Window<");
    expect(s.rule(R2).deviceClassFilter).toEqual(["door", "window"]);
    click(renderSmartRulesCard(s.host), ">Door<");
    click(renderSmartRulesCard(s.host), ">Window<");
    expect(Object.hasOwn(s.rule(R2), "deviceClassFilter")).toBe(false);
    type(renderSmartRulesCard(s.host), W("activeWhen"), "detected");
    expect(s.rule(R2).activeWhen).toBe("detected");
    type(renderSmartRulesCard(s.host), W("activeWhen"), "");
    expect(Object.hasOwn(s.rule(R2), "activeWhen")).toBe(false);
  });

  it("offers Playing only on a media player rule, and no Show when on a sensor", () => {
    const s = setup(smartPage([PLAYERS, BATTERIES]));
    check(renderSmartRulesCard(s.host), W("playingOnly"), true);
    expect(s.rule(R4).mediaPlayerPlayingOnly).toBe(true);
    s.host.selectSmartRule(R3);
    const card = flatten(renderSmartRulesCard(s.host));
    expect(card).not.toContain("Show when");
    expect(card).not.toContain(W("playingOnly"));
  });

  it("writes the max value, refuses text that is no number and keeps the stored value", () => {
    const s = setup(smartPage([BATTERIES]));
    const card = flatten(renderSmartRulesCard(s.host));
    expect(card).toContain("Max value (%)");
    expect(card).toContain(`placeholder=${W("noLimit")}`);
    type(renderSmartRulesCard(s.host), "Max value (%)", "20");
    expect(s.rule(R3).maxNumericValue).toBe(20);
    type(renderSmartRulesCard(s.host), "Max value (%)", "abc");
    expect(s.rule(R3).maxNumericValue).toBe(20);
    expect(flatten(renderSmartRulesCard(s.host))).toContain("Use a number");
    type(renderSmartRulesCard(s.host), "Max value (%)", "");
    expect(Object.hasOwn(s.rule(R3), "maxNumericValue")).toBe(false);
  });

  it("moves, resets and deletes from the heading, each one undo step, and the selection clamps", () => {
    const s = setup(smartPage([LIGHTS, DOORS, BATTERIES]));
    s.host.selectSmartRule(R3);
    click(renderSmartRulesCard(s.host), ">Up<");
    expect(s.config()!.rules.map((r) => r.id)).toEqual([R1, R3, R2]);
    expect(s.selected()).toBe(R3);
    // Reset writes the preset's look back.
    s.host.selectSmartRule(R1);
    click(renderSmartRulesCard(s.host), ">Gap<");
    click(renderSmartRulesCard(s.host), ">Reset<");
    expect(s.rule(R1).header).toBe("label");
    expect(s.rule(R1).headerLabel).toBe("Lights");
    s.host.selectSmartRule(R2);
    click(renderSmartRulesCard(s.host), ">Delete<");
    expect(s.config()!.rules.map((r) => r.id)).toEqual([R1, R3]);
    expect(s.selected()).toBe(R3);
    s.draft.undo();
    expect(s.config()!.rules.map((r) => r.id)).toEqual([R1, R3, R2]);
  });

  it("moves by the document's places when a rule without a domain sits between", () => {
    const skipped = { id: "55555555-0000-4000-8000-000000000005", header: "label", mode: "all" };
    const s = setup(smartPage([LIGHTS, skipped, DOORS]));
    const ids = () => ((s.page().dynamicConfig as JsonObject).rules as JsonObject[]).map((r) => r.id);
    s.host.selectSmartRule(R2);
    click(renderSmartRulesCard(s.host), ">Up<");
    expect(ids()).toEqual([R1, R2, skipped.id]);
    click(renderSmartRulesCard(s.host), ">Up<");
    expect(ids()).toEqual([R2, R1, skipped.id]);
    // First in the document: Up is off.
    expect(flatten(renderSmartRulesCard(s.host))).toContain("title=Move Doors up ?disabled=true");
    expect(flatten(renderSmartRulesCard(s.host))).toContain("title=Move Doors down ?disabled=false");
  });

  it("reads the count badge as a number of entities", () => {
    const s = setup(smartPage([LIGHTS]));
    expect(flatten(renderSmartRulesCard(s.host))).toContain("aria-label=3 entities>3</span>");
  });
});

describe("a rule's Header", () => {
  it("writes the style, the label (typing is one step), the size, the glow and the color with its Default", () => {
    const s = setup(smartPage([LIGHTS]));
    const card = flatten(renderSmartRulesCard(s.host));
    for (const style of ["None", "Gap", "Line", "Label"]) expect(card).toContain(`>${style}<`);
    expect(card).toContain("placeholder=Lights");
    expect(card).toContain("placeholder=10");
    expect(card).toContain(W("colorDefault"));
    type(renderSmartRulesCard(s.host), W("labelText"), "Inside");
    type(renderSmartRulesCard(s.host), W("labelText"), "Indoor");
    expect(s.rule(R1).headerLabel).toBe("Indoor");
    s.draft.undo();
    expect(s.rule(R1).headerLabel).toBe("Lights");
    type(renderSmartRulesCard(s.host), W("textSize"), "14");
    expect(s.rule(R1).headerLabelSize).toBe(14);
    type(renderSmartRulesCard(s.host), W("textSize"), "30");
    expect(s.rule(R1).headerLabelSize).toBe(14);
    expect(flatten(renderSmartRulesCard(s.host))).toContain("Use a number from 8 to 20.");
    type(renderSmartRulesCard(s.host), W("glow"), "33");
    expect(s.rule(R1).headerGlow).toBe(0.35);
    expect(flatten(renderSmartRulesCard(s.host))).toContain(">35%</div>");
    type(renderSmartRulesCard(s.host), W("glow"), "0");
    expect(Object.hasOwn(s.rule(R1), "headerGlow")).toBe(false);
    expect(flatten(renderSmartRulesCard(s.host))).toContain(`>${W("off")}</div>`);
    const swatch = /title=(#[0-9A-F]{6})/i.exec(flatten(renderSmartRulesCard(s.host)).split(`<span>${W("color")}</span>`)[1]!)![1]!;
    click(renderSmartRulesCard(s.host), `title=${swatch}`);
    expect(s.rule(R1).headerColor).toBe(swatch.toUpperCase());
    click(renderSmartRulesCard(s.host), W("colorDefault"));
    expect(Object.hasOwn(s.rule(R1), "headerColor")).toBe(false);
    click(renderSmartRulesCard(s.host), ">None<");
    expect(s.rule(R1).header).toBe("none");
    expect(flatten(renderSmartRulesCard(s.host))).not.toContain(W("labelText"));
  });
});

// ── the per-domain style ─────────────────────────────────────────────────

/** Every tile key a rule's style may hold (`tile-smart.json`). */
const ALLOWED = new Set<string>((tileSmart as { domainStyle: { keys: string[] } }).domainStyle.keys);

/** Presses every control the style sections draw (each handler with a
 * stand-in event that turns a switch both ways, picks, types and clicks),
 * each through the real adapter into the draft, and returns the stand-in
 * tile keys each edit changed and what `checkWatchPagesValues` found in the
 * document after any edit (a value the `DomainTileStyle` decoder refuses). */
function pressEverything(s: ReturnType<typeof setup>, ruleId: string, sections: ReturnType<typeof watchDomainStyleSections>) {
  const changed = new Set<string>();
  const problems: string[] = [];
  let edits = 0;
  const style = smartStyleHost(s.host, ruleId);
  for (const section of sections) style.uiState.set(`tile-settings:open:${section}`, true);
  const adapter = style.apply;
  // Watch what each setter did to the stand-in, then hand it to the
  // adapter, which keeps only the style keys.
  Object.defineProperty(style, "apply", {
    get: () => (next: WatchPagesDocument, options?: WatchPagesApplyOptions) => {
      const before = style.tile as JsonObject;
      const after = ((next.pages as WatchPage[])[0]!.items as JsonObject[])[0]!;
      for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
        if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) changed.add(key);
      }
      edits++;
      const applied = adapter(next, options);
      problems.push(...checkWatchPagesValues(s.draft.document));
      return applied;
    },
  });
  const events = [
    { target: { checked: true, value: "", type: "checkbox" }, currentTarget: null, stopPropagation() {}, preventDefault() {} },
    { target: { checked: false, value: "12", type: "number", validity: { badInput: false } }, currentTarget: null, stopPropagation() {}, preventDefault() {} },
    { target: { checked: false, value: "#123456", type: "text", validity: { badInput: false } }, currentTarget: null, stopPropagation() {}, preventDefault() {} },
  ];
  const tree = renderTileSettings(style, { sections: sections.filter((x) => x !== "size") });
  for (const t of templates(tree)) {
    t.values.forEach((v) => {
      if (typeof v !== "function") return;
      for (const e of events) {
        try {
          (v as (e: unknown) => void)(e);
        } catch {
          // A handler that needs a real element (a picker opening) is left
          // out; the rows' setters are reached through the others.
        }
      }
    });
  }
  return { changed, edits, problems };
}

describe("a rule's style through the stand-in tile", () => {
  it("writes only keys a rule's tileStyle holds, and only values the phone reads, from every control drawn", () => {
    const rules = [
      { id: R1, domain: "light", tileStyle: { borderStyle: "line", tileAnimation: "aurora", backgroundPattern: "dots", color: "#FFCC00", icon: "lightbulb" } },
      { id: R2, domain: "climate", tileStyle: { borderStyle: "animate", borderAnimation: "pulse", statusTextShadow: false } },
      { id: R3, domain: "automation", tileStyle: {} },
      { id: R4, domain: "media_player", tileStyle: { requiresConfirmation: true, overlayStyle: "rain" } },
    ];
    let total = 0;
    const all = new Set<string>();
    for (const r of rules) {
      const s = setup(smartPage([ruleOf(r.id, r.domain, { tileStyle: r.tileStyle })]));
      expect(checkWatchPagesValues(s.draft.document), `${r.domain} before`).toEqual([]);
      const { changed, edits, problems } = pressEverything(s, r.id, watchDomainStyleSections(true));
      total += edits;
      expect(problems, r.domain).toEqual([]);
      for (const key of changed) {
        all.add(key);
        expect(ALLOWED.has(key), `${r.domain}: ${key}`).toBe(true);
      }
    }
    // Not vacuous: the presses reached many rows.
    expect(total).toBeGreaterThan(40);
    for (const key of ["iconShadow", "showLabel", "labelShadow", "borderStyle", "requiresConfirmation", "backgroundPattern"]) expect(all.has(key), key).toBe(true);
  });

  it("leaves out the name, the state icons, dim when off, the temperature switches and every action but the confirmation", () => {
    const s = setup(smartPage([ruleOf(R2, "climate", { tileStyle: {} })]));
    const style = smartStyleHost(s.host, R2);
    for (const section of ["icon", "state", "text", "action"]) style.uiState.set(`tile-settings:open:${section}`, true);
    const text = flatten(renderTileSettings(style, { sections: ["icon", "state", "text", "action"] }));
    expect(text).toContain("Ask before running");
    expect(text).toContain("Show label");
    for (const gone of ["Single tap", "Hold and slide", "Hide when off", "State icons and colors", "Target temperature", "Current temperature", "Dim when off", ">Label<"]) {
      expect(text, gone).not.toContain(gone);
    }
  });

  it("an edit through the stand-in is one undo step on the rule's tileStyle", () => {
    const s = setup(smartPage([LIGHTS]));
    const style = smartStyleHost(s.host, R1);
    style.uiState.set("tile-settings:open:text", true);
    check(renderTileSettings(style, { sections: ["text"] }), "Text shadow", false);
    expect((s.rule(R1).tileStyle as JsonObject).labelShadow).toBe(false);
    s.draft.undo();
    expect(Object.hasOwn(s.rule(R1).tileStyle as JsonObject, "labelShadow")).toBe(false);
  });

  it("Default icon and Default color remove the key, and light only while it is absent", () => {
    const s = setup(smartPage([ruleOf(R1, "light", { tileStyle: { color: "#FFCC00", icon: "lightbulb", iconShadow: true } })]));
    const style = smartStyleHost(s.host, R1);
    style.uiState.set("tile-settings:open:icon", true);
    const view = () => renderTileSettings(style, { sections: ["icon"] });
    const lit = (words: string) => new RegExp(`class="pe-chip on" aria-pressed=true[^>]*>${words}<`).test(flatten(view()));
    // The kind's add icon is still the rule's own: not lit.
    expect(lit("Default")).toBe(false);
    expect(lit("Default color")).toBe(false);
    click(view(), ">Default<");
    expect(s.rule(R1).tileStyle).toEqual({ color: "#FFCC00", iconShadow: true });
    expect(lit("Default")).toBe(true);
    click(view(), ">Default color<");
    expect(s.rule(R1).tileStyle).toEqual({ iconShadow: true });
    expect(lit("Default color")).toBe(true);
    expect(checkWatchPagesValues(s.draft.document)).toEqual([]);
    s.draft.undo();
    expect((s.rule(R1).tileStyle as JsonObject).color).toBe("#FFCC00");
  });

  it("a section Reset removes the section's keys, shown only while the style holds one", () => {
    const s = setup(smartPage([ruleOf(R1, "light", { tileStyle: { borderStyle: "animate", borderGlow: 0.5, statusTextShadow: false, color: "#FFCC00" } })]));
    const style = smartStyleHost(s.host, R1);
    for (const section of ["state", "border", "background"]) style.uiState.set(`tile-settings:open:${section}`, true);
    const view = () => flatten(renderTileSettings(style, { sections: ["state", "border", "background"] }));
    expect(view()).toContain("Reset State");
    expect(view()).toContain("Reset Border");
    // Nothing of the background in the style: no row.
    expect(view()).not.toContain("Reset Background");
    click(renderTileSettings(style, { sections: ["state", "border", "background"] }), "Reset Border");
    expect(s.rule(R1).tileStyle).toEqual({ color: "#FFCC00", statusTextShadow: false });
    click(renderTileSettings(style, { sections: ["state", "border", "background"] }), "Reset State");
    expect(s.rule(R1).tileStyle).toEqual({ color: "#FFCC00" });
    expect(view()).not.toContain("Reset State");
    expect(view()).not.toContain("Reset Border");
    expect(checkWatchPagesValues(s.draft.document)).toEqual([]);
    // A fresh rule reads no "Changed" on its folded State section.
    style.uiState.set("tile-settings:open:state", false);
    expect(flatten(renderTileSettings(style, { sections: ["state"] }))).not.toContain("Changed");
    style.uiState.set("tile-settings:open:state", true);
    s.draft.undo();
    expect((s.rule(R1).tileStyle as JsonObject).statusTextShadow).toBe(false);
  });

  it("draws Size before Background with the domain presets and Page size", () => {
    const s = setup(smartPage([LIGHTS]));
    const card = flatten(renderSmartRulesCard(s.host));
    expect(card.indexOf('<span class="ts-title">Size</span>')).toBeGreaterThan(-1);
    expect(card.indexOf('<span class="ts-title">Size</span>')).toBeLessThan(card.indexOf('<span class="ts-title">Background</span>'));
    for (const p of WATCH_SMART.styleSizes) expect(card).toContain(`>${p.name}<`);
    click(renderSmartRulesCard(s.host), ">Medium<");
    expect([(s.rule(R1).tileStyle as JsonObject).colSpan, (s.rule(R1).tileStyle as JsonObject).rowSpan]).toEqual([6, 4]);
    click(renderSmartRulesCard(s.host), `>${W("pageSize")}<`);
    expect(Object.hasOwn(s.rule(R1).tileStyle as JsonObject, "colSpan")).toBe(false);
    expect(Object.hasOwn(s.rule(R1).tileStyle as JsonObject, "rowSpan")).toBe(false);
  });
});

// ── folds ────────────────────────────────────────────────────────────────

describe("the settings' folds", () => {
  it("start open, and a fold of a style section survives a reload", () => {
    const data: Record<string, string> = {};
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => (Object.hasOwn(data, key) ? data[key]! : null),
      setItem: (key: string, value: string) => { data[key] = value; },
      removeItem: (key: string) => { delete data[key]; },
    });
    try {
      const s = setup(smartPage([LIGHTS]));
      const style = smartStyleHost(s.host, R1);
      const view = () => flatten(renderTileSettings(style, { sections: ["state", "text", "border"] }));
      const textBody = /id="?ts-body-text/;
      // Nothing folded yet: every section draws its rows, here and in the
      // Rules card.
      expect(view().match(/data-open="?true/g)?.length).toBe(3);
      expect(flatten(renderSmartRulesCard(s.host))).not.toMatch(/data-open="?false/);
      expect(view()).toMatch(textBody);
      click(renderTileSettings(style, { sections: ["state", "text", "border"] }), '<span class="ts-title">Text</span>');
      expect(view()).not.toMatch(textBody);
      // A reload: the editor's view state starts empty, the fold is still there.
      s.host.uiState.clear();
      expect(view()).not.toMatch(textBody);
      expect(view().match(/data-open="?true/g)?.length).toBe(2);
      expect(view()).toMatch(/id="?ts-body-state/);
      // The Rules card draws the same style sections: Text is folded there
      // too, and the card's own Header fold is still open.
      const card = flatten(renderSmartRulesCard(s.host));
      expect(card).toMatch(/id="?sm-body-header/);
      expect(card).not.toMatch(textBody);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

// ── the stage ────────────────────────────────────────────────────────────

describe("the stage of a smart page", () => {
  const screen = { width: 184, height: 224 };

  it("reads Smart page, the rule count and the watch's title", () => {
    const doors = { ...DOORS, resolvedEntityIds: ["binary_sensor.front_door", "binary_sensor.hall_window"] };
    expect(smartStageFacts(smartPage([LIGHTS, doors]), STATES)).toEqual(["Smart page", "2 rules", "3 Active"]);
    // The watch counts a rule's title share from its resolved list only.
    expect(smartStageFacts(smartPage([LIGHTS, DOORS]), STATES)).toEqual(["Smart page", "2 rules", "2 Lights On"]);
    expect(smartStageFacts(smartPage([LIGHTS]), STATES)).toEqual(["Smart page", "1 rule", "2 Lights On"]);
    expect(smartStageFacts(plainPage(1), STATES)).toBeUndefined();
  });

  it("draws the fill, the other rule's tiles and header at 30%, and a click picks the tile's rule", () => {
    const page = smartPage([LIGHTS, DOORS]);
    const picked: number[] = [];
    const tree = renderWatchPagePreview({ page, pages: [page], screen, states: STATES, smart: { rule: 0, pick: (i) => picked.push(i) } });
    const text = flatten(tree);
    expect(text.match(/class=wp-smart-item \s/g)?.length).toBe(3); // the lights' header and two tiles
    expect(text.match(/class=wp-smart-item dim/g)?.length).toBe(2); // the doors' header and one tile
    expect(text).toContain("data-rule=1");
    // The selected rule's tiles are announced as pressed.
    expect(text.match(/aria-pressed=true/g)?.length).toBe(3);
    expect(text.match(/aria-pressed=false/g)?.length).toBe(2);
    handler(tree, "front door")({ stopPropagation() {} });
    expect(picked).toEqual([1]);
  });

  it("dims by domain: the second of two rules on one domain lights them all, and a click keeps it", () => {
    const doors = { ...DOORS, resolvedEntityIds: ["binary_sensor.front_door", "binary_sensor.hall_window"] };
    const windows = ruleOf(R3, "binary_sensor", { deviceClassFilter: ["window"], headerLabel: "Windows", resolvedEntityIds: ["binary_sensor.front_door", "binary_sensor.hall_window"], invertActive: true });
    const page = smartPage([LIGHTS, doors, windows]);
    const picked: number[] = [];
    const tree = renderWatchPagePreview({ page, pages: [page], screen, states: STATES, smart: { rule: 2, pick: (i) => picked.push(i) } });
    const text = flatten(tree);
    // Only the lights draw faint: their header and two tiles.
    expect(text.match(/class=wp-smart-item dim/g)?.length).toBe(3);
    expect(text).not.toMatch(/class=wp-smart-item dim[^>]*data-rule=1/);
    handler(tree, "front door")({ stopPropagation() {} });
    expect(picked).toEqual([2]);
    handler(tree, "desk")({ stopPropagation() {} });
    expect(picked).toEqual([2, 0]);
  });

  it("with no active entity shows All Off, bold, and what the page tracks", () => {
    const off = statesOf(state("light.desk", "off"));
    const page = smartPage([ruleOf(R1, "light", { resolvedEntityIds: ["light.desk"] })]);
    const text = flatten(renderWatchPagePreview({ page, pages: [page], screen, states: off }));
    expect(text).toContain(`<b>${W("allOff")}</b>`);
    expect(text).toContain("Tracking 1 lights");
  });

  it("names a header with no label as the watch does, and draws an unset color white", () => {
    expect(tileLabel({ entityId: "divider.label.binary_sensor" })).toBe("Binary Sensors");
    expect(tileLabel({ entityId: "divider.label.water_softener" })).toBe("Water_Softener");
    const page = smartPage([ruleOf(R1, "light", { resolvedEntityIds: ["light.desk"] })]);
    const text = flatten(renderWatchPagePreview({ page, pages: [page], screen, states: STATES }));
    expect(text).toContain('<span class="wp-divider-label">Lights</span>');
    expect(text).toMatch(/wp-divider label" style=[^>]*--ink:#FFFFFF/);
  });
});
