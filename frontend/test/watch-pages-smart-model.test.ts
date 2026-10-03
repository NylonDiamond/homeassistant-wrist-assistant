// Smart pages (part 3f batch 3): the readers, every writer of the Page card
// and the Rules card, the stand-in tile for the per-domain style, the
// resolve and the save step, and the watch's fill (active test, groups,
// layout, title and words).
//
// TODO(3f batch 3): when `tile-smart.json` and the case files land
// (`fixtures-pages/settings/smart-*.json`, `fixtures-pages/smart/fill-*.json`),
// replay them here as `watch-pages-tile-settings.test.ts` replays the
// settings cases, and set the floors: the writers covered and the case
// files run.

import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { WatchPage, WatchPagesDocument } from "../src/watch-pages/model.js";
import { setWatchTileBorderStyle, resetWatchTileTask } from "../src/watch-pages/styling-model.js";
import { setWatchTileLabel, setWatchTileShowLabel } from "../src/watch-pages/tile-settings-model.js";
import {
  WATCH_DOMAIN_TILE_STYLE_KEYS,
  WATCH_SMART_PAGE_DEFAULTS,
  addSmartRule,
  applySmartStyleStandIn,
  convertToSmartPage,
  deleteSmartRule,
  disableSmartPage,
  moveSmartRule,
  readSmartConfig,
  readWatchSmartTable,
  resetSmartRule,
  resolveSmartPagesBeforeSave,
  resolveSmartRule,
  setSmartLiveUpdates,
  setSmartPullToRefresh,
  setSmartRefreshOnAppear,
  setSmartRuleActiveWhen,
  setSmartRuleEntityIds,
  setSmartRuleHeader,
  setSmartRuleHeaderColor,
  setSmartRuleHeaderGlow,
  setSmartRuleHeaderLabel,
  setSmartRuleHeaderSize,
  setSmartRuleInvert,
  setSmartRuleMaxValue,
  setSmartRuleMode,
  setSmartRulePlayingOnly,
  setSmartRuleSize,
  setSmartRuleSpan,
  setSmartSortOrder,
  setSmartTileColSpan,
  setSmartTileRowSpan,
  setSmartTileShowLabel,
  setSmartTileSize,
  smartActiveGroups,
  smartConvertTileCount,
  smartDuplicateDomainNote,
  smartEntityActive,
  smartMaxValueText,
  smartPageLayout,
  smartPageTitle,
  smartPresetAdded,
  smartPresetForRule,
  smartResetPreset,
  smartRuleAfterDelete,
  smartRuleIndexForTile,
  smartRuleName,
  smartStandInTile,
  smartStyleStandIn,
  smartSyntheticPage,
  smartTrackingWords,
  toggleSmartRuleDeviceClass,
  withResolvedRule,
  type WatchSmartConfig,
  type WatchSmartRule,
} from "../src/watch-pages/smart-model.js";

type Json = Record<string, unknown>;

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";
const OTHER = "C3A0E000-0000-4000-8000-0000000000BB";
const SYSTEM = "C3A0E000-0000-4000-8000-0000000000CC";
const R1 = "11111111-0000-4000-8000-000000000001";
const R2 = "22222222-0000-4000-8000-000000000002";
const R3 = "33333333-0000-4000-8000-000000000003";
const NEW = "44444444-0000-4000-8000-000000000004";

/** A table in the shape `tile-smart.json` is read in, small. */
const TABLE = readWatchSmartTable({
  domains: [
    { domain: "light", displayName: "Lights", icon: "lightbulb.fill", colorRole: "entityLight", activeWord: "on", invertedWord: "off" },
    { domain: "switch", displayName: "Switches", icon: "switch.2", colorRole: "entitySwitch", activeWord: "on", invertedWord: "off" },
    {
      domain: "binary_sensor",
      displayName: "Binary Sensors",
      icon: "sensor.fill",
      colorRole: "entitySensor",
      activeWord: "on",
      invertedWord: "off",
      deviceClasses: [{ value: "door" }, { value: "window" }],
      activeWhen: true,
    },
    { domain: "sensor", displayName: "Sensors", icon: "chart.line.uptrend.xyaxis", colorRole: "entitySensor" },
    { domain: "media_player", displayName: "Media Players", icon: "hifispeaker.fill", colorRole: "entityMediaPlayer" },
  ],
  presets: [
    { label: "Lights", icon: "lightbulb.fill", domain: "light" },
    { label: "Doors", icon: "door.left.hand.open", domain: "binary_sensor", deviceClassFilter: ["door"] },
    { label: "Windows", icon: "window.horizontal", domain: "binary_sensor", deviceClassFilter: ["window"] },
    { label: "Binary Sensors", icon: "sensor.fill", domain: "binary_sensor" },
    { label: "Batteries", icon: "battery.25percent", domain: "sensor", deviceClassFilter: ["battery"] },
  ],
});

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as object)) deepFreeze(child);
  }
  return value;
}

function state(entityId: string, value: string, attributes: Json = {}): HassEntityState {
  return { entity_id: entityId, state: value, attributes, last_changed: "", last_updated: "" };
}

function statesOf(...list: HassEntityState[]): Record<string, HassEntityState> {
  return Object.fromEntries(list.map((s) => [s.entity_id, s]));
}

/** A rule as the phone writes it. */
function rule(id: string, domain: string, extra: Json = {}): Json {
  const out: Json = { domain, entityIds: [], header: "label", id, invertActive: false, mode: "all", ...extra };
  return Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]));
}

function config(rules: Json[], extra: Json = {}): Json {
  const out: Json = { ...WATCH_SMART_PAGE_DEFAULTS, ...extra, rules };
  return Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]));
}

/** A document with a system page, the page under test and another page. */
function docWith(page: Json): WatchPagesDocument {
  return deepFreeze({
    schemaVersion: 1,
    pages: [
      { id: SYSTEM, name: "System", isSystemPage: true, items: [] },
      { id: PAGE, name: "Active", ...page },
      { id: OTHER, name: "Other", items: [] },
    ],
  });
}

function smartDoc(rules: Json[], extra: Json = {}): WatchPagesDocument {
  return docWith({ items: [], dynamicConfig: config(rules, extra) });
}

function pageOf(document: WatchPagesDocument): Json {
  return (document.pages as Json[])[1]!;
}

function configOf(document: WatchPagesDocument): Json {
  return pageOf(document).dynamicConfig as Json;
}

function rulesOf(document: WatchPagesDocument): Json[] {
  return configOf(document).rules as Json[];
}

function sorted(object: unknown): boolean {
  const keys = Object.keys(object as Json);
  return keys.every((k, i) => i === 0 || keys[i - 1]! < k);
}

/** Only the path changed: the other pages are the same objects. */
function onlyPath(before: WatchPagesDocument, after: WatchPagesDocument): void {
  expect(after).not.toBe(before);
  const a = after.pages as Json[];
  const b = before.pages as Json[];
  expect(a[0]).toBe(b[0]);
  expect(a[2]).toBe(b[2]);
}

function view(r: Json): WatchSmartRule {
  return readSmartConfig({ dynamicConfig: { rules: [r] } })!.rules[0]!;
}

// ── readers ──────────────────────────────────────────────────────────────

describe("readers", () => {
  it("reads only a smart page", () => {
    expect(readSmartConfig({ id: PAGE, items: [] })).toBeUndefined();
    expect(readSmartConfig({ dynamicConfig: null })).toBeUndefined();
    expect(readSmartConfig({ dynamicConfig: [] })).toBeUndefined();
  });

  it("reads a missing or mistyped key as the decoder's default", () => {
    expect(readSmartConfig({ dynamicConfig: {} })).toEqual({
      rules: [],
      tileColSpan: 4,
      tileRowSpan: 3,
      tileShowLabel: true,
      sortOrder: "domain",
      liveUpdates: false,
      refreshOnAppear: false,
      pullToRefresh: true,
    });
    const c = readSmartConfig({ dynamicConfig: { tileColSpan: 2.5, sortOrder: "name", liveUpdates: "yes", rules: "x" } })!;
    expect([c.tileColSpan, c.sortOrder, c.liveUpdates, c.rules]).toEqual([4, "domain", false, []]);
  });

  it("skips a rule without a string domain, and reads each rule key", () => {
    const page = {
      dynamicConfig: {
        rules: [
          { id: R1 },
          rule(R2, "sensor", {
            mode: "specific",
            entityIds: ["sensor.a", 3],
            deviceClassFilter: ["battery"],
            maxNumericValue: 20,
            activeWhen: "low",
            mediaPlayerPlayingOnly: "yes",
            tileStyle: { colSpan: 6, rowSpan: 2, showLabel: false, customLabel: "x", color: "#FF0000" },
            header: "gap",
            headerGlow: 0.5,
            headerLabelSize: 12,
          }),
          { domain: 7 },
        ],
      },
    };
    const c = readSmartConfig(page)!;
    expect(c.rules).toHaveLength(1);
    const r = c.rules[0]!;
    expect(r).toMatchObject({
      id: R2,
      domain: "sensor",
      mode: "specific",
      entityIds: ["sensor.a"],
      deviceClassFilter: ["battery"],
      maxNumericValue: 20,
      activeWhen: "low",
      mediaPlayerPlayingOnly: false,
      header: "gap",
      headerGlow: 0.5,
      headerLabelSize: 12,
    });
    // customLabel is not a style key the watch reads.
    expect(r.tileStyle).toEqual({ keys: { colSpan: 6, rowSpan: 2, showLabel: false, color: "#FF0000" }, colSpan: 6, rowSpan: 2, showLabel: false, color: "#FF0000" });
    expect(r.resolvedEntityIds).toBeUndefined();
  });

  it("reads the table with tolerance", () => {
    const empty = readWatchSmartTable(undefined);
    expect([empty.domains, empty.presets, empty.words]).toEqual([[], [], {}]);
    const t = readWatchSmartTable({ domains: { fan: { displayName: "Fans" } }, presets: [{ label: "x" }, { label: "Fans", haDomain: "fan" }] });
    expect(t.domains.map((d) => [d.domain, d.displayName])).toEqual([["fan", "Fans"]]);
    expect(t.presets).toEqual([{ label: "Fans", icon: "", domain: "fan" }]);
    expect(TABLE.domains.find((d) => d.domain === "binary_sensor")!.deviceClasses).toEqual([
      { value: "door", label: "Door" },
      { value: "window", label: "Window" },
    ]);
  });

  it("lists the style keys of page-keys.json", () => {
    expect(WATCH_DOMAIN_TILE_STYLE_KEYS).toContain("borderStyle");
    expect(WATCH_DOMAIN_TILE_STYLE_KEYS).toContain("colSpan");
    for (const key of ["customLabel", "stateIcons", "stateColors", "singleTapAction", "hideWhenInactive", "gridCol"]) {
      expect(WATCH_DOMAIN_TILE_STYLE_KEYS).not.toContain(key);
    }
  });
});

// ── convert and disable ──────────────────────────────────────────────────

describe("convert and disable", () => {
  it("converts a page with tiles: the eight defaults, no tiles, no groups, every other key kept", () => {
    const before = docWith({ backgroundColor: "#112233", groups: [{ id: R1 }], items: [{ id: R2, entityId: "light.a" }, { id: R3, entityId: "light.b" }] });
    expect(smartConvertTileCount(before, PAGE)).toBe(2);
    const after = convertToSmartPage(before, PAGE);
    onlyPath(before, after);
    expect(pageOf(after)).toEqual({ id: PAGE, name: "Active", backgroundColor: "#112233", groups: [], items: [], dynamicConfig: config([]) });
    expect(sorted(configOf(after))).toBe(true);
    expect(Object.keys(configOf(after))).toEqual([
      "liveUpdates",
      "pullToRefresh",
      "refreshOnAppear",
      "rules",
      "sortOrder",
      "tileColSpan",
      "tileRowSpan",
      "tileShowLabel",
    ]);
    expect(smartConvertTileCount(after, PAGE)).toBeUndefined();
  });

  it("converts an empty page, at the sorted place of a sorted page", () => {
    const before = docWith({ items: [] });
    expect(smartConvertTileCount(before, PAGE)).toBe(0);
    const page = pageOf(convertToSmartPage(before, PAGE));
    expect(Object.keys(page)).toEqual(["id", "name", "items", "dynamicConfig", "groups"]);
    const sortedPage = deepFreeze({ pages: [{ id: PAGE, items: [], name: "A" }] });
    expect(Object.keys((convertToSmartPage(sortedPage, PAGE).pages as Json[])[0]!)).toEqual(["dynamicConfig", "groups", "id", "items", "name"]);
  });

  it("refuses a smart page, a system page and a missing page", () => {
    const smart = smartDoc([]);
    expect(convertToSmartPage(smart, PAGE)).toBe(smart);
    expect(convertToSmartPage(smart, SYSTEM)).toBe(smart);
    expect(convertToSmartPage(smart, NEW)).toBe(smart);
  });

  it("disables: dynamicConfig removed, nothing else", () => {
    const before = smartDoc([rule(R1, "light")], { liveUpdates: true });
    const after = disableSmartPage(before, PAGE);
    onlyPath(before, after);
    expect(pageOf(after)).toEqual({ id: PAGE, name: "Active", items: [] });
    expect(disableSmartPage(after, PAGE)).toBe(after);
  });
});

// ── page keys ────────────────────────────────────────────────────────────

describe("page keys", () => {
  it("writes each switch", () => {
    const before = smartDoc([]);
    expect(configOf(setSmartLiveUpdates(before, PAGE, true)).liveUpdates).toBe(true);
    expect(configOf(setSmartRefreshOnAppear(before, PAGE, true)).refreshOnAppear).toBe(true);
    expect(configOf(setSmartPullToRefresh(before, PAGE, false)).pullToRefresh).toBe(false);
    expect(configOf(setSmartTileShowLabel(before, PAGE, false)).tileShowLabel).toBe(false);
    expect(configOf(setSmartSortOrder(before, PAGE, "alphabetical")).sortOrder).toBe("alphabetical");
    // The same value, a bad value: the document as given.
    expect(setSmartLiveUpdates(before, PAGE, false)).toBe(before);
    expect(setSmartSortOrder(before, PAGE, "name")).toBe(before);
    expect(setSmartLiveUpdates(before, PAGE, "on" as never)).toBe(before);
  });

  it("clamps the spans to whole numbers from 1 to 12", () => {
    const before = smartDoc([]);
    expect(configOf(setSmartTileColSpan(before, PAGE, 6.4)).tileColSpan).toBe(6);
    expect(configOf(setSmartTileColSpan(before, PAGE, 40)).tileColSpan).toBe(12);
    expect(configOf(setSmartTileRowSpan(before, PAGE, 0)).tileRowSpan).toBe(1);
    expect(setSmartTileRowSpan(before, PAGE, Number.NaN)).toBe(before);
    const sized = configOf(setSmartTileSize(before, PAGE, 8, 3));
    expect([sized.tileColSpan, sized.tileRowSpan]).toEqual([8, 3]);
  });

  it("fills in the keys the decoder needs on any edit", () => {
    const before = docWith({ items: [], dynamicConfig: { rules: [] } });
    const after = setSmartLiveUpdates(before, PAGE, true);
    expect(configOf(after)).toEqual(config([], { liveUpdates: true }));
    expect(sorted(configOf(after))).toBe(true);
  });

  it("refuses a page that is not smart", () => {
    const before = docWith({ items: [] });
    expect(setSmartLiveUpdates(before, PAGE, true)).toBe(before);
    expect(setSmartLiveUpdates(before, OTHER, true)).toBe(before);
  });
});

// ── rules ────────────────────────────────────────────────────────────────

describe("add a rule", () => {
  const states = statesOf(state("binary_sensor.front", "off", { device_class: "door" }), state("binary_sensor.a", "on"), state("light.x", "on"));

  it("writes the phone's rule from a preset, then resolves it", () => {
    const before = smartDoc([]);
    const doors = TABLE.presets[1]!;
    const after = addSmartRule(before, PAGE, doors, "#ccd8e6", states, { newId: () => NEW.toLowerCase() });
    onlyPath(before, after);
    const added = rulesOf(after)[0]!;
    expect(added).toEqual({
      deviceClassFilter: ["door"],
      domain: "binary_sensor",
      entityIds: [],
      header: "label",
      headerLabel: "Doors",
      id: NEW,
      invertActive: false,
      mode: "all",
      // The filter is not applied: the watch filters at fill time.
      resolvedEntityIds: ["binary_sensor.a", "binary_sensor.front"],
      tileStyle: { color: "#CCD8E6", icon: "door.left.hand.open" },
    });
    expect(JSON.stringify(Object.keys(added))).toBe(JSON.stringify(Object.keys(added).sort()));
  });

  it("leaves the filter out for a whole domain and writes an empty resolve", () => {
    const after = addSmartRule(smartDoc([]), PAGE, TABLE.presets[0]!, "#FFCC00", statesOf(), { newId: () => NEW });
    const added = rulesOf(after)[0]!;
    expect(added.deviceClassFilter).toBeUndefined();
    expect(added.resolvedEntityIds).toEqual([]);
    // Without states, no resolve.
    expect(rulesOf(addSmartRule(smartDoc([]), PAGE, TABLE.presets[0]!, "#FFCC00", undefined, { newId: () => NEW }))[0]!.resolvedEntityIds).toBeUndefined();
  });

  it("appends, and refuses a bad color or a page that is not smart", () => {
    const before = smartDoc([rule(R1, "light")]);
    expect(rulesOf(addSmartRule(before, PAGE, TABLE.presets[2]!, "#FFCC00", undefined, { newId: () => NEW })).map((r) => r.id)).toEqual([R1, NEW]);
    expect(addSmartRule(before, PAGE, TABLE.presets[0]!, "teal", undefined)).toBe(before);
    const plain = docWith({ items: [] });
    expect(addSmartRule(plain, PAGE, TABLE.presets[0]!, "#FFCC00", undefined)).toBe(plain);
  });

  it("knows which presets are on the page, by domain and filter in order", () => {
    const c = readSmartConfig(pageOf(smartDoc([rule(R1, "binary_sensor", { deviceClassFilter: ["door"] }), rule(R2, "light")])))!;
    expect(TABLE.presets.map((p) => smartPresetAdded(c, p))).toEqual([true, true, false, false, false]);
    const twoWays = readSmartConfig({ dynamicConfig: { rules: [rule(R1, "binary_sensor", { deviceClassFilter: ["window", "door"] })] } })!;
    expect(smartPresetAdded(twoWays, { label: "x", icon: "", domain: "binary_sensor", deviceClassFilter: ["door", "window"] })).toBe(false);
  });

  it("names a rule after its preset, else its domain", () => {
    expect(smartRuleName(view(rule(R1, "binary_sensor", { deviceClassFilter: ["door"] })), TABLE)).toBe("Doors");
    expect(smartRuleName(view(rule(R1, "binary_sensor", { deviceClassFilter: ["door", "window"] })), TABLE)).toBe("Binary Sensors");
    expect(smartRuleName(view(rule(R1, "switch")), TABLE)).toBe("Switches");
    expect(smartRuleName(view(rule(R1, "garden_hose")), TABLE)).toBe("Garden_Hose");
  });
});

describe("rule writers", () => {
  const base = () => smartDoc([rule(R1, "light"), rule(R2, "media_player"), rule(R3, "sensor")]);
  const r = (d: WatchPagesDocument, i = 0) => rulesOf(d)[i]!;

  it("sets the mode, resolving when it becomes All", () => {
    const before = smartDoc([rule(R1, "light", { mode: "specific", entityIds: ["light.b"] })]);
    const states = statesOf(state("light.b", "on"), state("light.a", "off"), state("switch.c", "on"));
    const after = setSmartRuleMode(before, PAGE, R1, "all", states);
    expect(r(after)).toEqual(rule(R1, "light", { entityIds: ["light.b"], resolvedEntityIds: ["light.a", "light.b"] }));
    expect(r(setSmartRuleMode(after, PAGE, R1, "specific"))).toMatchObject({ mode: "specific", resolvedEntityIds: ["light.a", "light.b"] });
    expect(setSmartRuleMode(before, PAGE, R1, "some")).toBe(before);
    expect(setSmartRuleMode(before, PAGE, NEW, "all")).toBe(before);
  });

  it("writes the picks in pick order", () => {
    const after = setSmartRuleEntityIds(base(), PAGE, R1.toLowerCase(), ["light.z", "light.a"]);
    expect(r(after).entityIds).toEqual(["light.z", "light.a"]);
    expect(setSmartRuleEntityIds(base(), PAGE, R1, [3 as never])).toEqual(base());
  });

  it("writes invert, true or false", () => {
    const on = setSmartRuleInvert(base(), PAGE, R1, true);
    expect(r(on).invertActive).toBe(true);
    expect(r(setSmartRuleInvert(on, PAGE, R1, false)).invertActive).toBe(false);
  });

  it("writes playing only when true and removes it when false, on a media player only", () => {
    const on = setSmartRulePlayingOnly(base(), PAGE, R2, true);
    expect(r(on, 1).mediaPlayerPlayingOnly).toBe(true);
    expect(sorted(r(on, 1))).toBe(true);
    expect(Object.hasOwn(r(setSmartRulePlayingOnly(on, PAGE, R2, false), 1), "mediaPlayerPlayingOnly")).toBe(false);
    const before = base();
    expect(setSmartRulePlayingOnly(before, PAGE, R1, true)).toBe(before);
  });

  it("toggles device classes in tapping order, the last one removing the key", () => {
    let d = toggleSmartRuleDeviceClass(base(), PAGE, R3, "humidity");
    d = toggleSmartRuleDeviceClass(d, PAGE, R3, "battery");
    expect(r(d, 2).deviceClassFilter).toEqual(["humidity", "battery"]);
    d = toggleSmartRuleDeviceClass(d, PAGE, R3, "humidity");
    expect(r(d, 2).deviceClassFilter).toEqual(["battery"]);
    d = toggleSmartRuleDeviceClass(d, PAGE, R3, "battery");
    expect(Object.hasOwn(r(d, 2), "deviceClassFilter")).toBe(false);
  });

  it("reads the max value box: trimmed, empty removes, a number written, the rest refused", () => {
    const before = base();
    const twenty = setSmartRuleMaxValue(before, PAGE, R3, " 20 ");
    expect(r(twenty, 2).maxNumericValue).toBe(20);
    expect(JSON.stringify(r(twenty, 2))).toContain('"maxNumericValue":20,');
    expect(r(setSmartRuleMaxValue(before, PAGE, R3, "2.5"), 2).maxNumericValue).toBe(2.5);
    expect(r(setSmartRuleMaxValue(before, PAGE, R3, "-.5"), 2).maxNumericValue).toBe(-0.5);
    expect(Object.hasOwn(r(setSmartRuleMaxValue(twenty, PAGE, R3, "  "), 2), "maxNumericValue")).toBe(false);
    for (const bad of ["abc", "1,5", "20%", "0x10", "Infinity"]) expect(setSmartRuleMaxValue(twenty, PAGE, R3, bad)).toBe(twenty);
    expect(smartMaxValueText(view(r(twenty, 2)))).toBe("20");
    expect(smartMaxValueText(view(rule(R1, "sensor")))).toBe("");
  });

  it("writes active when, empty removing it", () => {
    const set = setSmartRuleActiveWhen(base(), PAGE, R1, "detected");
    expect(r(set).activeWhen).toBe("detected");
    expect(Object.hasOwn(r(setSmartRuleActiveWhen(set, PAGE, R1, "")), "activeWhen")).toBe(false);
  });

  it("writes the header: style, label, size, glow and color", () => {
    const before = base();
    expect(r(setSmartRuleHeader(before, PAGE, R1, "gap")).header).toBe("gap");
    expect(setSmartRuleHeader(before, PAGE, R1, "box")).toBe(before);

    const labelled = setSmartRuleHeaderLabel(before, PAGE, R1, "Upstairs");
    expect(r(labelled).headerLabel).toBe("Upstairs");
    expect(Object.hasOwn(r(setSmartRuleHeaderLabel(labelled, PAGE, R1, "")), "headerLabel")).toBe(false);

    expect(r(setSmartRuleHeaderSize(before, PAGE, R1, 14.4)).headerLabelSize).toBe(14);
    expect(setSmartRuleHeaderSize(before, PAGE, R1, 30)).toBe(before);
    expect(Object.hasOwn(r(setSmartRuleHeaderSize(setSmartRuleHeaderSize(before, PAGE, R1, 12), PAGE, R1, null)), "headerLabelSize")).toBe(false);

    const glowing = setSmartRuleHeaderGlow(before, PAGE, R1, 0.5);
    expect(r(glowing).headerGlow).toBe(0.5);
    expect(Object.hasOwn(r(setSmartRuleHeaderGlow(glowing, PAGE, R1, 0)), "headerGlow")).toBe(false);
    expect(setSmartRuleHeaderGlow(before, PAGE, R1, 0)).toBe(before);
    expect(setSmartRuleHeaderGlow(before, PAGE, R1, 1.5)).toBe(before);

    const colored = setSmartRuleHeaderColor(before, PAGE, R1, "ff9800");
    expect(r(colored).headerColor).toBe("#FF9800");
    expect(Object.hasOwn(r(setSmartRuleHeaderColor(colored, PAGE, R1, undefined)), "headerColor")).toBe(false);
    expect(setSmartRuleHeaderColor(before, PAGE, R1, "#RAINBOW")).toBe(before);
    for (const d of [labelled, glowing, colored]) expect(sorted(r(d))).toBe(true);
  });

  it("writes a rule's own size into tileStyle, and Page size removes it", () => {
    const before = smartDoc([rule(R1, "light", { tileStyle: { color: "#FFCC00" } })]);
    const sized = setSmartRuleSize(before, PAGE, R1, { colSpan: 6, rowSpan: 4 });
    expect(r(sized).tileStyle).toEqual({ colSpan: 6, color: "#FFCC00", rowSpan: 4 });
    expect(r(setSmartRuleSpan(sized, PAGE, R1, "colSpan", 13)).tileStyle).toEqual({ colSpan: 12, color: "#FFCC00", rowSpan: 4 });
    expect(r(setSmartRuleSize(sized, PAGE, R1, undefined)).tileStyle).toEqual({ color: "#FFCC00" });
    // An emptied style is removed.
    const bare = smartDoc([rule(R1, "light")]);
    const one = setSmartRuleSpan(bare, PAGE, R1, "rowSpan", 2);
    expect(r(one).tileStyle).toEqual({ rowSpan: 2 });
    expect(Object.hasOwn(r(setSmartRuleSpan(one, PAGE, R1, "rowSpan", null)), "tileStyle")).toBe(false);
  });

  it("writes the edited rule as the phone encodes it", () => {
    const before = docWith({ items: [], dynamicConfig: { rules: [{ domain: "light", id: R1, headerGlow: 0, mediaPlayerPlayingOnly: false }] } });
    const after = setSmartRuleInvert(before, PAGE, R1, true);
    expect(r(after)).toEqual({ domain: "light", entityIds: [], header: "label", id: R1, invertActive: true, mode: "all" });
  });

  it("moves, deletes and clamps the selection", () => {
    const before = base();
    expect(rulesOf(moveSmartRule(before, PAGE, R3, 0)).map((x) => x.id)).toEqual([R3, R1, R2]);
    expect(rulesOf(moveSmartRule(before, PAGE, R1, 1)).map((x) => x.id)).toEqual([R2, R1, R3]);
    expect(moveSmartRule(before, PAGE, R1, -1)).toBe(before);
    expect(moveSmartRule(before, PAGE, R3, 3)).toBe(before);
    const deleted = deleteSmartRule(before, PAGE, R3);
    expect(rulesOf(deleted).map((x) => x.id)).toEqual([R1, R2]);
    const c = readSmartConfig(pageOf(deleted))!;
    expect(smartRuleAfterDelete(c, 2)).toBe(R2);
    expect(smartRuleAfterDelete(c, 0)).toBe(R1);
    expect(smartRuleAfterDelete(readSmartConfig({ dynamicConfig: {} })!, 0)).toBeUndefined();
    expect(deleteSmartRule(before, PAGE, NEW)).toBe(before);
  });
});

describe("reset a rule", () => {
  const busy = (domain: string, extra: Json = {}) =>
    rule(R1, domain, {
      entityIds: ["x.a"],
      resolvedEntityIds: ["x.b"],
      mode: "specific",
      tileStyle: { color: "#000000", borderStyle: "line" },
      header: "gap",
      headerColor: "#FF0000",
      headerLabel: "Mine",
      headerLabelSize: 14,
      headerGlow: 0.3,
      activeWhen: "x",
      invertActive: true,
      maxNumericValue: 3,
      mediaPlayerPlayingOnly: true,
      ...extra,
    });

  it("writes the matching preset's add, keeping the ids, the mode and the filter", () => {
    const after = resetSmartRule(smartDoc([busy("binary_sensor", { deviceClassFilter: ["door"] })]), PAGE, R1, "#CCD8E6", TABLE);
    expect(rulesOf(after)[0]).toEqual({
      deviceClassFilter: ["door"],
      domain: "binary_sensor",
      entityIds: ["x.a"],
      header: "label",
      headerLabel: "Doors",
      id: R1,
      invertActive: false,
      mode: "specific",
      resolvedEntityIds: ["x.b"],
      tileStyle: { color: "#CCD8E6", icon: "door.left.hand.open" },
    });
  });

  it("falls back to the whole domain preset, then to the domain's icon and no label", () => {
    const mixed = view(rule(R1, "binary_sensor", { deviceClassFilter: ["door", "window"] }));
    expect(smartPresetForRule(mixed, TABLE)).toBeUndefined();
    expect(smartResetPreset(mixed, TABLE)?.label).toBe("Binary Sensors");
    const sensor = resetSmartRule(smartDoc([busy("sensor", { deviceClassFilter: ["humidity"] })]), PAGE, R1, "#CCD8E6", TABLE);
    // No Humidity preset in this table and no whole Sensors preset: the domain's icon, no label.
    expect(rulesOf(sensor)[0]!.tileStyle).toEqual({ color: "#CCD8E6", icon: "chart.line.uptrend.xyaxis" });
    expect(Object.hasOwn(rulesOf(sensor)[0]!, "headerLabel")).toBe(false);
    const unknown = resetSmartRule(smartDoc([busy("garden")]), PAGE, R1, "#CCD8E6", TABLE);
    expect(rulesOf(unknown)[0]!.tileStyle).toEqual({ color: "#CCD8E6" });
  });
});

// ── resolve ──────────────────────────────────────────────────────────────

describe("resolve", () => {
  const states = statesOf(state("light.b", "on"), state("light.a", "off"), state("lights.x", "on"), state("switch.c", "on"));

  it("gives the domain's ids, sorted, by prefix", () => {
    expect(resolveSmartRule(states, "light")).toEqual(["light.a", "light.b"]);
    expect(resolveSmartRule(states, "fan")).toEqual([]);
    expect(resolveSmartRule(undefined, "light")).toEqual([]);
  });

  it("writes the list even when empty, and leaves an equal list alone", () => {
    const before = smartDoc([rule(R1, "fan")]);
    const after = withResolvedRule(before, PAGE, R1, states);
    expect(rulesOf(after)[0]!.resolvedEntityIds).toEqual([]);
    expect(withResolvedRule(after, PAGE, R1, states)).toBe(after);
    expect(withResolvedRule(before, PAGE, R1, undefined)).toBe(before);
  });

  it("resolves every all rule of the smart pages a draft changed before a save", () => {
    const base = deepFreeze({
      pages: [
        { id: PAGE, items: [], dynamicConfig: config([rule(R1, "light"), rule(R2, "switch", { mode: "specific" })]) },
        { id: OTHER, items: [], dynamicConfig: config([rule(R3, "light")]) },
      ],
    });
    // Nothing changed: nothing written.
    expect(resolveSmartPagesBeforeSave(base, base, states)).toBe(base);
    const draft = setSmartLiveUpdates(base, PAGE, true);
    const out = resolveSmartPagesBeforeSave(draft, base, states);
    const pages = out.pages as Json[];
    const rules = (pages[0]!.dynamicConfig as Json).rules as Json[];
    expect(rules[0]!.resolvedEntityIds).toEqual(["light.a", "light.b"]);
    expect(Object.hasOwn(rules[1]!, "resolvedEntityIds")).toBe(false);
    // The page the draft left alone is not touched.
    expect(pages[1]).toBe((draft.pages as Json[])[1]);
    // Already current: the document as given.
    expect(resolveSmartPagesBeforeSave(out, base, states)).toBe(out);
    // Without a base, every smart page.
    const all = resolveSmartPagesBeforeSave(base, undefined, states);
    expect((((all.pages as Json[])[1]!.dynamicConfig as Json).rules as Json[])[0]!.resolvedEntityIds).toEqual(["light.a", "light.b"]);
  });
});

// ── the stand-in tile ────────────────────────────────────────────────────

describe("the per-domain style through a stand-in tile", () => {
  const styled = rule(R1, "light", { tileStyle: { borderStyle: "line", color: "#FFCC00", icon: "lightbulb.fill", junk: 1 } });
  const page: WatchPage = { id: PAGE, name: "Active", themeOverride: "ocean", items: [], dynamicConfig: config([styled]) };

  it("builds a one page document with the rule's style keys on a tile", () => {
    const standIn = smartStyleStandIn(styled, PAGE, page);
    expect(standIn).toEqual({
      pages: [
        {
          id: PAGE,
          name: "Active",
          themeOverride: "ocean",
          items: [{ borderStyle: "line", color: "#FFCC00", entityId: "light.rule", icon: "lightbulb.fill", id: R1 }],
        },
      ],
    });
    expect(smartStandInTile(standIn, PAGE, R1)?.entityId).toBe("light.rule");
  });

  it("writes back what a tile setter changed, and never a key outside the style", () => {
    const document = docWith(page);
    const standIn = smartStyleStandIn(styled, PAGE, page);
    let next = setWatchTileBorderStyle(standIn, PAGE, R1, "animate");
    next = setWatchTileLabel(next, PAGE, R1, "Kitchen");
    next = setWatchTileShowLabel(next, PAGE, R1, false);
    const after = applySmartStyleStandIn(document, PAGE, R1, next);
    onlyPath(document, after);
    expect(rulesOf(after)[0]!.tileStyle).toEqual({ borderStyle: "animate", color: "#FFCC00", icon: "lightbulb.fill", junk: 1, showLabel: false });
  });

  it("removes a key the setter removed, and an emptied tileStyle", () => {
    const only = rule(R1, "light", { tileStyle: { borderStyle: "animate", borderGlow: 0.5 } });
    const document = smartDoc([only]);
    const reset = resetWatchTileTask(smartStyleStandIn(only, PAGE), PAGE, R1, "border");
    const after = applySmartStyleStandIn(document, PAGE, R1, reset);
    const tile = smartStandInTile(reset, PAGE, R1)!;
    const left = Object.fromEntries(WATCH_DOMAIN_TILE_STYLE_KEYS.filter((k) => Object.hasOwn(tile, k)).map((k) => [k, tile[k]]));
    expect(rulesOf(after)[0]!.tileStyle ?? {}).toEqual(left);
    const bare = smartDoc([rule(R1, "light", { tileStyle: { borderStyle: "line" } })]);
    const cleared = smartStyleStandIn(rulesOf(bare)[0]!, PAGE);
    const tileGone = { pages: [{ id: PAGE, items: [{ id: R1, entityId: "light.rule" }] }] };
    expect(Object.hasOwn(rulesOf(applySmartStyleStandIn(bare, PAGE, R1, tileGone))[0]!, "tileStyle")).toBe(false);
    // Unchanged, or no stand-in: the document as given.
    expect(applySmartStyleStandIn(bare, PAGE, R1, cleared)).toBe(bare);
    expect(applySmartStyleStandIn(bare, PAGE, R1, { pages: [] })).toBe(bare);
  });
});

// ── the fill ─────────────────────────────────────────────────────────────

describe("the active test", () => {
  const cases: [string, string, Json, boolean, Json?][] = [
    ["light.a", "on", {}, true],
    ["switch.a", "off", {}, false],
    ["automation.a", "on", {}, true],
    ["cover.a", "open", {}, true],
    ["cover.a", "opening", {}, false],
    ["valve.a", "open", {}, true],
    ["lock.a", "unlocked", {}, true],
    ["lock.a", "locked", {}, false],
    ["lock.a", "jammed", {}, true],
    ["climate.a", "heat", { hvac_action: "idle" }, false],
    ["climate.a", "off", { hvac_action: "heating" }, true],
    ["climate.a", "heat", {}, true],
    ["climate.a", "off", {}, false],
    ["media_player.a", "idle", {}, true],
    ["media_player.a", "paused", {}, false, { mediaPlayerPlayingOnly: true }],
    ["media_player.a", "standby", {}, false],
    ["vacuum.a", "returning", {}, true],
    ["vacuum.a", "docked", {}, false],
    ["remote.a", "on", {}, true],
    ["alarm_control_panel.a", "armed_home", {}, true],
    ["alarm_control_panel.a", "disarmed", {}, false],
    ["binary_sensor.a", "on", {}, true],
    ["binary_sensor.a", "open", {}, true],
    ["siren.a", "Detected", {}, true, { activeWhen: "detected" }],
    ["siren.a", "on", {}, false, { activeWhen: "detected" }],
    ["light.a", "on", {}, false, { invertActive: true }],
  ];
  for (const [id, value, attributes, active, extra] of cases) {
    it(`${id} ${value}${extra ? ` ${JSON.stringify(extra)}` : ""} is ${active ? "active" : "not active"}`, () => {
      const r = view(rule(R1, id.split(".")[0]!, extra ?? {}));
      expect(smartEntityActive(id, r, statesOf(state(id, value, attributes)))).toBe(active);
    });
  }

  it("reads a remote by its media player when there is one", () => {
    const r = view(rule(R1, "remote"));
    expect(smartEntityActive("remote.tv", r, statesOf(state("remote.tv", "on"), state("media_player.tv", "off")))).toBe(false);
    expect(smartEntityActive("remote.tv", r, statesOf(state("remote.tv", "off"), state("media_player.tv", "playing")))).toBe(true);
  });

  it("counts a missing entity as not active, inverted as active", () => {
    expect(smartEntityActive("light.gone", view(rule(R1, "light")), {})).toBe(false);
    expect(smartEntityActive("light.gone", view(rule(R1, "light", { invertActive: true })), {})).toBe(true);
  });
});

describe("the groups", () => {
  const states = statesOf(
    state("light.b", "on", { friendly_name: "beta" }),
    state("light.a", "on", { friendly_name: "Zed" }),
    state("light.c", "off"),
    state("light.d", "unavailable"),
    state("binary_sensor.front", "on", { device_class: "door" }),
    state("binary_sensor.hall", "on", { device_class: "motion" }),
    state("sensor.phone", "15", { device_class: "battery" }),
    state("sensor.tablet", "80", { device_class: "battery" }),
    state("sensor.temp", "12", { device_class: "temperature" }),
    state("sensor.unknown", "unknown", { device_class: "battery" }),
  );
  const configOfRules = (rules: Json[], extra: Json = {}): WatchSmartConfig => readSmartConfig({ dynamicConfig: config(rules, extra) })!;

  it("keeps available, passing, active entities per rule, empty groups dropped", () => {
    const c = configOfRules([
      rule(R1, "light"),
      rule(R2, "binary_sensor", { deviceClassFilter: ["door"] }),
      rule(R3, "sensor", { deviceClassFilter: ["battery"], maxNumericValue: 20, invertActive: true, activeWhen: "x" }),
      rule(NEW, "fan"),
    ]);
    expect(smartActiveGroups(c, states)).toEqual([
      { ruleIndex: 0, entityIds: ["light.a", "light.b"] },
      { ruleIndex: 1, entityIds: ["binary_sensor.front"] },
      { ruleIndex: 2, entityIds: ["sensor.phone"] },
    ]);
  });

  it("reads a resolved list as frozen, and an empty one as every entity of the domain", () => {
    expect(smartActiveGroups(configOfRules([rule(R1, "light", { resolvedEntityIds: ["light.b", "light.c"] })]), states)).toEqual([
      { ruleIndex: 0, entityIds: ["light.b"] },
    ]);
    expect(smartActiveGroups(configOfRules([rule(R1, "light", { resolvedEntityIds: [] })]), states)[0]!.entityIds).toEqual(["light.a", "light.b"]);
    expect(smartActiveGroups(configOfRules([rule(R1, "light", { mode: "specific", entityIds: ["light.b", "light.a"] })]), states)[0]!.entityIds).toEqual([
      "light.b",
      "light.a",
    ]);
  });

  it("sorts by friendly name, case folded, on an alphabetical page", () => {
    const c = configOfRules([rule(R1, "light")], { sortOrder: "alphabetical" });
    expect(smartActiveGroups(c, states)[0]!.entityIds).toEqual(["light.b", "light.a"]);
  });
});

describe("the layout", () => {
  const configOfRules = (rules: Json[], extra: Json = {}): WatchSmartConfig => readSmartConfig({ dynamicConfig: config(rules, extra) })!;
  const place = (items: Json[]) => items.map((i) => [i.entityId, i.gridCol, i.gridRow, i.colSpan, i.rowSpan]);

  it("places two rules with label and line headers as the watch does", () => {
    const c = configOfRules([
      rule(R1, "light", { headerLabel: "Up", headerLabelSize: 12, headerColor: "#FF0000", tileStyle: { color: "#FFCC00", showLabel: false } }),
      rule(R2, "switch", { header: "line", headerGlow: 0.5 }),
    ]);
    const items = smartPageLayout(c, [
      { ruleIndex: 0, entityIds: ["light.a", "light.b", "light.c", "light.d"] },
      { ruleIndex: 1, entityIds: ["switch.a"] },
    ]);
    expect(place(items as Json[])).toEqual([
      ["divider.label.light", 0, 0, 12, 1],
      ["light.a", 0, 1, 4, 3],
      ["light.b", 4, 1, 4, 3],
      ["light.c", 8, 1, 4, 3],
      ["light.d", 0, 4, 4, 3],
      ["divider.line.switch.g50", 0, 7, 12, 1],
      ["switch.a", 0, 8, 4, 3],
    ]);
    expect(items[0]).toEqual({
      color: "#FF0000",
      colSpan: 12,
      customLabel: "Up",
      entityId: "divider.label.light",
      gridCol: 0,
      gridRow: 0,
      id: "smart:0",
      labelFontSizeOverride: 12,
      rowSpan: 1,
      showLabel: false,
    });
    expect(items[1]).toMatchObject({ color: "#FFCC00", showLabel: false });
    expect(items[5]).not.toHaveProperty("color");
    expect(items[6]).toMatchObject({ showLabel: true });
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
  });

  it("takes a row for a gap, nothing for none, and per domain spans", () => {
    const c = configOfRules(
      [rule(R1, "light", { header: "gap", tileStyle: { colSpan: 6, rowSpan: 2 } }), rule(R2, "switch", { header: "none" })],
      { tileShowLabel: false, tileColSpan: 5 },
    );
    const items = smartPageLayout(c, [
      { ruleIndex: 0, entityIds: ["light.a", "light.b", "light.c"] },
      { ruleIndex: 1, entityIds: ["switch.a", "switch.b", "switch.c"] },
    ]);
    expect(place(items as Json[])).toEqual([
      ["light.a", 0, 1, 6, 2],
      ["light.b", 6, 1, 6, 2],
      ["light.c", 0, 3, 6, 2],
      // The row advances by the previous group's row span.
      ["switch.a", 0, 5, 5, 3],
      ["switch.b", 5, 5, 5, 3],
      ["switch.c", 0, 8, 5, 3],
    ]);
    expect(items.every((i) => i.showLabel === false)).toBe(true);
  });

  it("draws a second rule of a domain with the first rule's header and style", () => {
    const c = configOfRules([
      rule(R1, "binary_sensor", { headerLabel: "Doors", deviceClassFilter: ["door"], tileStyle: { icon: "door" } }),
      rule(R2, "binary_sensor", { headerLabel: "Windows", deviceClassFilter: ["window"], tileStyle: { icon: "window" } }),
    ]);
    const items = smartPageLayout(c, [
      { ruleIndex: 0, entityIds: ["binary_sensor.front"] },
      { ruleIndex: 1, entityIds: ["binary_sensor.kitchen"] },
    ]);
    expect(items.map((i) => [i.customLabel ?? i.icon])).toEqual([["Doors"], ["door"], ["Doors"], ["door"]]);
    expect(smartDuplicateDomainNote(c, TABLE)).toBe("Two rules share Binary Sensors. The watch draws every Binary Sensors group with the first rule's header and style.");
    expect(smartDuplicateDomainNote(configOfRules([rule(R1, "light")]), TABLE)).toBeUndefined();
  });

  it("finds the rule that drew a tile", () => {
    const c = configOfRules([rule(R1, "light"), rule(R2, "switch"), rule(R3, "light")]);
    expect(smartRuleIndexForTile(c, { entityId: "switch.a" })).toBe(1);
    expect(smartRuleIndexForTile(c, { entityId: "light.a" })).toBe(0);
    expect(smartRuleIndexForTile(c, { entityId: "divider.line.switch.g50" })).toBe(1);
    expect(smartRuleIndexForTile(c, { entityId: "fan.a" })).toBeUndefined();
  });
});

describe("the title and words", () => {
  const configOfRules = (rules: Json[]): WatchSmartConfig => readSmartConfig({ dynamicConfig: config(rules) })!;
  const states = statesOf(state("light.a", "on"), state("light.b", "on"), state("switch.a", "on"), state("switch.b", "off"));

  it("names the page as the watch does", () => {
    const lights = configOfRules([rule(R1, "light", { resolvedEntityIds: ["light.a", "light.b"] }), rule(R2, "switch", { resolvedEntityIds: ["switch.b"] })]);
    expect(smartPageTitle(lights, smartActiveGroups(lights, states), states, TABLE)).toBe("2 Lights On");
    const both = configOfRules([rule(R1, "light", { resolvedEntityIds: ["light.a"] }), rule(R2, "switch", { resolvedEntityIds: ["switch.a"] })]);
    expect(smartPageTitle(both, smartActiveGroups(both, states), states, TABLE)).toBe("2 Active");
    expect(smartPageTitle(both, [], states, TABLE)).toBe("All Off");
    // Unresolved rules count nothing per rule: "N Active".
    const unresolved = configOfRules([rule(R1, "light")]);
    expect(smartPageTitle(unresolved, smartActiveGroups(unresolved, states), states, TABLE)).toBe("2 Active");
    const unknown = configOfRules([rule(R1, "water_can", { mode: "specific", entityIds: ["water_can.a"] })]);
    const s = statesOf(state("water_can.a", "on"));
    expect(smartPageTitle(unknown, smartActiveGroups(unknown, s), s, TABLE)).toBe("1 Water_Can On");
  });

  it("tracks the counted ids, or says none are configured", () => {
    const c = configOfRules([
      rule(R1, "light", { resolvedEntityIds: ["light.a", "light.b"] }),
      rule(R2, "switch"),
      rule(R3, "water_can", { mode: "specific", entityIds: ["water_can.a"] }),
    ]);
    expect(smartTrackingWords(c, TABLE)).toBe("Tracking 2 lights, 1 water_can");
    expect(smartTrackingWords(configOfRules([rule(R1, "light")]), TABLE)).toBe("No entities configured");
  });

  it("builds the synthetic page", () => {
    const page: WatchPage = { id: PAGE, name: "Active", items: [{ id: R3, entityId: "light.stale" }], dynamicConfig: config([rule(R1, "light", { header: "none" })]) };
    const out = smartSyntheticPage(page, states, TABLE);
    expect(out.items).toEqual([
      { colSpan: 4, entityId: "light.a", gridCol: 0, gridRow: 0, id: "smart:0", rowSpan: 3, showLabel: true },
      { colSpan: 4, entityId: "light.b", gridCol: 4, gridRow: 0, id: "smart:1", rowSpan: 3, showLabel: true },
    ]);
    expect(out.switcherText).toBe("2 Active");
    expect(out.dynamicConfig).toBe(page.dynamicConfig);
    const plain: WatchPage = { id: PAGE, items: [] };
    expect(smartSyntheticPage(plain, states)).toBe(plain);
  });
});
