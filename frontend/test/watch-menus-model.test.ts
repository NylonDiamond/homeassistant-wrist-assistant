// The menus model, section by section: slot lists (add, remove, move), an
// action change and its payload, the trigger's target, the keys the panel
// keeps, the ring, the style rows, the Entity quick menu's inherit switch
// and per-entity menus, the size budget, the shape check, and the route.

import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { JsonObject } from "../src/watch-pages/model.js";
import { isWatchMenusRoute, navigateWatchMenus, watchMenusRouteOwner, watchMenusUrl } from "../src/watch-menus/hook.js";
import { watchMenuPageTargets, watchMenusSummary } from "../src/watch-menus/menu-editor.js";
import { MENUS_SECTIONS, SWITCHER_LINE, selectedMenuSlot } from "../src/watch-menus/menu-view.js";
import {
  ANYWHERE,
  MENU_ACTIONS,
  type MenuListRef,
  type MenuTargets,
  type MenusDocument,
  WATCH_MENUS_LIMIT_BYTES,
  addWatchMenuOverride,
  addWatchMenuSlot,
  checkWatchMenus,
  findWatchMenuSlot,
  moveWatchMenuSlot,
  newWatchMenuAction,
  normalizeMenuColor,
  removeWatchMenuOverride,
  removeWatchMenuSlot,
  retargetTriggerSlot,
  scrubWatchMenuOrphanTriggers,
  setWatchMenuActionKey,
  setWatchMenuInherits,
  setWatchMenuSlotAction,
  setWatchMenuSlotColor,
  setWatchMenuSlotEntityTypes,
  setWatchMenuSlotIcon,
  setWatchMenuSlotVisible,
  setWatchMenuStyle,
  watchMenuActionUnavailable,
  watchMenuActionValue,
  watchMenuEffectiveSlots,
  watchMenuFreePositions,
  watchMenuInheritedSlots,
  watchMenuOfferedActions,
  watchMenuOverrideIds,
  watchMenuPayloadSpec,
  watchMenuPositions,
  watchMenuRingPoint,
  watchMenuSlots,
  watchMenuStyleFields,
  watchMenuStyleShown,
  watchMenuStyleValue,
  watchMenusBudget,
  watchMenusDefaults,
  watchMenusReadMeansUnsupported,
  watchMenuShowForTypes,
  watchMenuOppositePosition,
  WATCH_MENUS_UNREAD_SWITCHER_KEYS,
  watchTriggerModes,
  withMenuKey,
} from "../src/watch-menus/model.js";

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as object)) deepFreeze(child);
  }
  return value;
}

const fixture = (name: string): MenusDocument =>
  deepFreeze(JSON.parse(readFileSync(join(__dirname, "fixtures-menus", name), "utf8")) as MenusDocument);

const DEFAULTS = fixture("01-defaults.json");
const CONFIGURED = fixture("02-configured.json");

const TARGETS: MenuTargets = {
  pages: [{ id: "aaaaaaaa-0000-4000-8000-000000000001", name: "Kitchen" }],
  statusPages: [{ id: "bbbbbbbb-0000-4000-8000-000000000001", name: "Lights" }],
  httpActions: [{ id: "cccccccc-0000-4000-8000-000000000001", name: "Gate" }],
};

const LIGHT: MenuListRef = { list: "domain", domain: "light" };

function slot(doc: MenusDocument, ref: MenuListRef, id: string): JsonObject {
  const s = findWatchMenuSlot(doc, ref, id);
  if (s === undefined) throw new Error(`no slot ${id}`);
  return s;
}

/** A document with only the parts a test looks at. */
function anywhere(...slots: JsonObject[]): MenusDocument {
  return { quickAction: { schemaVersion: 1, slots }, schemaVersion: 1 };
}

function s(id: string, position: string, action: JsonObject, extra: JsonObject = {}): JsonObject {
  return { action, color: "#FFFFFF", icon: "circle", id, isVisible: true, position, voiceConfig: {}, ...extra };
}

describe("the defaults", () => {
  it("are the phone's defaults with fixed ids, a fresh copy each time", () => {
    const a = watchMenusDefaults();
    expect(a).toEqual(DEFAULTS);
    expect(watchMenusDefaults()).not.toBe(a);
    expect(checkWatchMenus(a)).toEqual([]);
  });
});

describe("no record", () => {
  it("reads an integration that does not know the kind as unsupported, a dropped socket as not", () => {
    expect(watchMenusReadMeansUnsupported({ code: "invalid", message: "kind must be one of" })).toBe(true);
    expect(watchMenusReadMeansUnsupported({ code: "unknown_command", message: "Unknown command." })).toBe(true);
    expect(watchMenusReadMeansUnsupported({ type: "result", success: false, error: { code: "invalid", message: "x" } })).toBe(true);
    expect(watchMenusReadMeansUnsupported({ code: 3, message: "Connection lost" })).toBe(false);
    expect(watchMenusReadMeansUnsupported(new Error("timeout"))).toBe(false);
  });
});

describe("keys", () => {
  it("go in at their sorted place and keep their place when changed", () => {
    const o = { a: 1, c: 3 };
    expect(Object.keys(withMenuKey(o, "b", 2))).toEqual(["a", "b", "c"]);
    expect(Object.keys(withMenuKey(o, "z", 2))).toEqual(["a", "c", "z"]);
    expect(Object.keys(withMenuKey({ c: 1, a: 2 }, "c", 5))).toEqual(["c", "a"]);
    expect(withMenuKey(o, "a", 1)).toBe(o);
  });
});

describe("Anywhere menu slots", () => {
  it("add at the first free place with the first offered action, its icon and color, shown, with empty voice routing", () => {
    const doc = anywhere(s("A", "topLeft", { type: "pages" }));
    const { document, id } = addWatchMenuSlot(doc, ANYWHERE, { newId: () => "1234abcd-0000-4000-8000-000000000000" });
    expect(id).toBe("1234ABCD-0000-4000-8000-000000000000");
    const added = watchMenuSlots(document, ANYWHERE)[1]!;
    const pages = MENU_ACTIONS.actions.find((a) => a.raw === "pages")!;
    expect(added).toEqual({ action: { type: "pages" }, color: pages.color, icon: pages.icon, id, isVisible: true, position: "topCenter", voiceConfig: {} });
    expect(Object.keys(added)).toEqual(["action", "color", "icon", "id", "isVisible", "position", "voiceConfig"]);
  });

  it("refuse an add with no free place, at a taken place, or an action the menu does not offer", () => {
    expect(addWatchMenuSlot(DEFAULTS, ANYWHERE).document).toBe(DEFAULTS);
    const doc = anywhere(s("A", "topLeft", { type: "pages" }));
    expect(addWatchMenuSlot(doc, ANYWHERE, { position: "topLeft" }).document).toBe(doc);
    expect(addWatchMenuSlot(doc, ANYWHERE, { action: "brightness" }).document).toBe(doc);
    // A target it must have and the panel has none of.
    expect(addWatchMenuSlot(doc, ANYWHERE, { action: "runHTTPAction" }).document).toBe(doc);
    expect(addWatchMenuSlot(doc, ANYWHERE, { action: "runHTTPAction", targets: TARGETS }).document).not.toBe(doc);
  });

  it("remove one slot and leave the rest as they were", () => {
    const next = removeWatchMenuSlot(DEFAULTS, ANYWHERE, "3e4d0000-0000-4000-8000-000000000008");
    const before = watchMenuSlots(DEFAULTS, ANYWHERE);
    const after = watchMenuSlots(next, ANYWHERE);
    expect(after.length).toBe(before.length - 1);
    after.forEach((slot, i) => expect(slot).toBe(before[i]));
    expect(next.entityRadial).toBe(DEFAULTS.entityRadial);
    expect(next.pageSwitcher).toBe(DEFAULTS.pageSwitcher);
    expect(removeWatchMenuSlot(DEFAULTS, ANYWHERE, "nope")).toBe(DEFAULTS);
  });

  it("move to a free place, or swap with the slot there", () => {
    const doc = anywhere(s("A", "topLeft", { type: "pages" }), s("B", "topCenter", { type: "settings" }));
    const free = moveWatchMenuSlot(doc, ANYWHERE, "A", "bottomRight");
    expect(watchMenuSlots(free, ANYWHERE).map((x) => x.position)).toEqual(["bottomRight", "topCenter"]);
    const swapped = moveWatchMenuSlot(doc, ANYWHERE, "A", "topCenter");
    expect(watchMenuSlots(swapped, ANYWHERE).map((x) => x.position)).toEqual(["topCenter", "topLeft"]);
    expect(moveWatchMenuSlot(doc, ANYWHERE, "A", "middle")).toBe(doc);
    expect(moveWatchMenuSlot(doc, ANYWHERE, "A", "topLeft")).toBe(doc);
  });

  it("move a linked slot's partner to the opposite place, as the phone moves the heat and cool pair", () => {
    const CLIMATE: MenuListRef = { list: "domain", domain: "climate" };
    const HEAT = "3E4D0000-0000-4000-8000-000000000019";
    const COOL = "3E4D0000-0000-4000-8000-00000000001A";
    const at = (doc: MenusDocument) => Object.fromEntries(watchMenuSlots(doc, CLIMATE).map((x) => [x.id, x.position]));
    expect(watchMenuOppositePosition("bottomRight")).toBe("bottomLeft");
    expect(watchMenuOppositePosition("topCenter")).toBe("bottomCenter");
    // To a free place: the partner goes opposite, and the preset slot that
    // held that place takes the place the pair left.
    const down = at(moveWatchMenuSlot(DEFAULTS, CLIMATE, HEAT, "bottomRight"));
    expect(down[HEAT]).toBe("bottomRight");
    expect(down[COOL]).toBe("bottomLeft");
    expect(down["3E4D0000-0000-4000-8000-00000000001E"]).toBe("topLeft");
    expect(down["3E4D0000-0000-4000-8000-00000000001F"]).toBe("rightCenter");
    // Onto the partner's place: the two swap and nothing else moves.
    const swapped = moveWatchMenuSlot(DEFAULTS, CLIMATE, HEAT, "topLeft");
    expect(at(swapped)[HEAT]).toBe("topLeft");
    expect(at(swapped)[COOL]).toBe("topRight");
    const before = watchMenuSlots(DEFAULTS, CLIMATE);
    watchMenuSlots(swapped, CLIMATE).forEach((x, i) => {
      if (x.id !== HEAT && x.id !== COOL) expect(x).toBe(before[i]);
    });
    // The links stay as they were.
    expect(findWatchMenuSlot(swapped, CLIMATE, HEAT)?.linkedSlotId).toBe(COOL);
    // A slot with no partner in the list moves alone.
    const lone = anywhere(s("A", "topLeft", { type: "pages" }, { linkedSlotId: "NOT-HERE" }), s("B", "topRight", { type: "settings" }));
    expect(watchMenuSlots(moveWatchMenuSlot(lone, ANYWHERE, "A", "bottomRight"), ANYWHERE).map((x) => x.position)).toEqual(["bottomRight", "topRight"]);
  });

  it("set shown, icon and color; a color is #RRGGBB in upper case, its opacity dropped", () => {
    let doc = setWatchMenuSlotVisible(DEFAULTS, ANYWHERE, "3E4D0000-0000-4000-8000-000000000001", false);
    doc = setWatchMenuSlotIcon(doc, ANYWHERE, "3E4D0000-0000-4000-8000-000000000001", " bolt ");
    doc = setWatchMenuSlotColor(doc, ANYWHERE, "3E4D0000-0000-4000-8000-000000000001", "#aabbcc80");
    const x = slot(doc, ANYWHERE, "3E4D0000-0000-4000-8000-000000000001");
    expect(x).toMatchObject({ isVisible: false, icon: "bolt", color: "#AABBCC" });
    expect(setWatchMenuSlotIcon(DEFAULTS, ANYWHERE, "3E4D0000-0000-4000-8000-000000000001", "  ")).toBe(DEFAULTS);
    expect(setWatchMenuSlotColor(DEFAULTS, ANYWHERE, "3E4D0000-0000-4000-8000-000000000001", "red")).toBe(DEFAULTS);
    expect(normalizeMenuColor("abcdef")).toBe("#ABCDEF");
  });

  it("show for some entity types, or every screen with the key gone", () => {
    const id = "3E4D0000-0000-4000-8000-000000000002";
    const some = setWatchMenuSlotEntityTypes(DEFAULTS, id, ["light", "cover", "light"]);
    expect(slot(some, ANYWHERE, id).entityTypes).toEqual(["light", "cover"]);
    expect(Object.keys(slot(some, ANYWHERE, id))).toContain("entityTypes");
    const every = setWatchMenuSlotEntityTypes(some, id, undefined);
    expect(Object.hasOwn(slot(every, ANYWHERE, id), "entityTypes")).toBe(false);
    expect(setWatchMenuSlotEntityTypes(DEFAULTS, id, ["not_a_domain"])).toBe(DEFAULTS);
    // An empty list is written: the watch then shows the slot only where no
    // entity is under the finger.
    expect(slot(setWatchMenuSlotEntityTypes(some, id, []), ANYWHERE, id).entityTypes).toEqual([]);
  });

  it("show for only the types the watch reports, and keep a stored one it does not", () => {
    expect(watchMenuShowForTypes()).toEqual([
      "light", "cover", "climate", "switch", "lock", "button", "sensor", "media_player",
      "fan", "remote", "vacuum", "input_number", "input_select", "automation", "alarm_control_panel",
    ]);
    const id = "3E4D0000-0000-4000-8000-000000000002";
    // A domain the Entity quick menu lists, but the watch never reports it
    // under the finger.
    expect(setWatchMenuSlotEntityTypes(DEFAULTS, id, ["scene"])).toBe(DEFAULTS);
    expect(slot(setWatchMenuSlotEntityTypes(DEFAULTS, id, ["media_player", "alarm_control_panel"]), ANYWHERE, id).entityTypes)
      .toEqual(["media_player", "alarm_control_panel"]);
    const stored = anywhere(s("X", "topLeft", { type: "pages" }, { entityTypes: ["scene", "light"] }));
    const more = setWatchMenuSlotEntityTypes(stored, "X", ["scene", "light", "cover"]);
    expect(slot(more, ANYWHERE, "X").entityTypes).toEqual(["scene", "light", "cover"]);
    const less = setWatchMenuSlotEntityTypes(more, "X", ["light", "cover"]);
    expect(slot(less, ANYWHERE, "X").entityTypes).toEqual(["light", "cover"]);
    // Once taken off, it cannot come back.
    expect(setWatchMenuSlotEntityTypes(less, "X", ["light", "cover", "scene"])).toBe(less);
  });
});

describe("an action change", () => {
  it("resets the payload to the new action's starting values and drops the old keys", () => {
    const id = "3E4D1000-0000-4000-8000-000000000002";
    expect(slot(CONFIGURED, ANYWHERE, id).action).toMatchObject({ bannerSeconds: 6, showBanner: false, type: "runHTTPAction" });
    const http = setWatchMenuSlotAction(CONFIGURED, ANYWHERE, id, "triggerEntity", TARGETS);
    // The HTTP slot's keys (banner, confirm, its id) are all gone.
    expect(slot(http, ANYWHERE, id).action).toEqual({ confirmOnRelease: true, entityId: "", triggerMode: "toggle", type: "triggerEntity" });
    const spec = MENU_ACTIONS.actions.find((a) => a.raw === "triggerEntity")!;
    expect(slot(http, ANYWHERE, id)).toMatchObject({ icon: spec.icon, color: spec.color });
  });

  it("keeps every key of the slot the panel does not model", () => {
    const id = "3E4D1000-0000-4000-8000-000000000007";
    const before = slot(CONFIGURED, ANYWHERE, id);
    const after = slot(setWatchMenuSlotAction(CONFIGURED, ANYWHERE, id, "assist", TARGETS), ANYWHERE, id);
    for (const key of ["voiceConfig", "hiddenPhraseIds", "knownPhraseIds", "id", "position", "isVisible"]) {
      expect(after[key], key).toBe(before[key]);
    }
    const linked = setWatchMenuSlotIcon(CONFIGURED, { list: "entity", entityId: "climate.hallway" }, "3E4D1000-0000-4000-8000-000000000010", "flame");
    expect(slot(linked, { list: "entity", entityId: "climate.hallway" }, "3E4D1000-0000-4000-8000-000000000010").linkedSlotId).toBe("3E4D1000-0000-4000-8000-000000000011");
  });

  it("is refused for an action the list does not offer or the same action", () => {
    const id = "3E4D0000-0000-4000-8000-000000000001";
    expect(setWatchMenuSlotAction(DEFAULTS, ANYWHERE, id, "brightness", TARGETS)).toBe(DEFAULTS);
    expect(setWatchMenuSlotAction(DEFAULTS, ANYWHERE, id, "refresh", TARGETS)).toBe(DEFAULTS);
    expect(setWatchMenuSlotAction(DEFAULTS, ANYWHERE, id, "madeUp", TARGETS)).toBe(DEFAULTS);
  });

  it("picks the first target an action must have, upper case, and is refused with none", () => {
    expect(newWatchMenuAction("navigateToPage", TARGETS)).toEqual({ pageId: "AAAAAAAA-0000-4000-8000-000000000001", type: "navigateToPage" });
    expect(newWatchMenuAction("runHTTPAction", TARGETS)).toEqual({ confirmOnRelease: true, entityId: "CCCCCCCC-0000-4000-8000-000000000001", type: "runHTTPAction" });
    expect(newWatchMenuAction("navigateToPage")).toBeUndefined();
    expect(watchMenuActionUnavailable("speakPhrase", TARGETS)).toBe("No phrases");
    expect(watchMenuActionUnavailable("runHTTPAction", { ...TARGETS, httpActions: [] })).toBe("No HTTP actions");
    // A status page is not required: none is fine.
    expect(newWatchMenuAction("showStatusPage")).toEqual({ type: "showStatusPage" });
    expect(newWatchMenuAction("switchInstance")).toEqual({ type: "switchInstance" });
  });
});

describe("payload keys", () => {
  const A = anywhere(s("H", "topLeft", { entityId: "CCCCCCCC-0000-4000-8000-000000000001", type: "runHTTPAction" }));
  const action = (doc: MenusDocument) => slot(doc, ANYWHERE, "H").action as JsonObject;

  it("leave a flag out at its default, as the phone encodes it", () => {
    const on = setWatchMenuActionKey(A, ANYWHERE, "H", "showBanner", false);
    expect(action(on).showBanner).toBe(false);
    const off = setWatchMenuActionKey(on, ANYWHERE, "H", "showBanner", true);
    expect(Object.hasOwn(action(off), "showBanner")).toBe(false);
    expect(setWatchMenuActionKey(A, ANYWHERE, "H", "confirmOnRelease", false)).toBe(A);
  });

  it("hold a number to its range and remove it when cleared", () => {
    expect(action(setWatchMenuActionKey(A, ANYWHERE, "H", "bannerSeconds", 99)).bannerSeconds).toBe(30);
    const set = setWatchMenuActionKey(A, ANYWHERE, "H", "bannerSeconds", 5);
    expect(Object.hasOwn(action(setWatchMenuActionKey(set, ANYWHERE, "H", "bannerSeconds", undefined)), "bannerSeconds")).toBe(false);
    expect(watchMenuActionValue(slot(A, ANYWHERE, "H"), watchMenuPayloadSpec("runHTTPAction", "bannerSeconds")!)).toBe(3);
  });

  it("refuse a required key cleared, an id that is no UUID, an enum value the tables do not name, a key the action lacks", () => {
    expect(setWatchMenuActionKey(A, ANYWHERE, "H", "entityId", undefined)).toBe(A);
    expect(setWatchMenuActionKey(A, ANYWHERE, "H", "entityId", "not-a-uuid")).toBe(A);
    expect(setWatchMenuActionKey(A, ANYWHERE, "H", "pageId", "AAAAAAAA-0000-4000-8000-000000000001")).toBe(A);
    const sw = anywhere(s("S", "topLeft", { type: "switchInstance" }));
    expect(setWatchMenuActionKey(sw, ANYWHERE, "S", "instanceSwitchBehavior", "teleport")).toBe(sw);
    const picker = setWatchMenuActionKey(sw, ANYWHERE, "S", "instanceSwitchBehavior", "pickerRing");
    expect(slot(picker, ANYWHERE, "S").action).toEqual({ instanceSwitchBehavior: "pickerRing", type: "switchInstance" });
    expect(slot(setWatchMenuActionKey(picker, ANYWHERE, "S", "instanceSwitchBehavior", "nextInstance"), ANYWHERE, "S").action).toEqual({ type: "switchInstance" });
  });
});

describe("a trigger slot's target", () => {
  const fresh = (): JsonObject => s("T", "topLeft", newWatchMenuAction("triggerEntity")!, { icon: "target", color: "#7CC4E8" });

  it("takes the new domain's icon, color and first mode while they are the old ones", () => {
    const out = retargetTriggerSlot(fresh(), "scene.movie");
    expect(out.icon).toBe(MENU_ACTIONS.triggerEntity.targetIcons.scene);
    expect(out.color).toBe(MENU_ACTIONS.triggerEntity.targetColors.scene);
    expect((out.action as JsonObject).triggerMode).toBe(watchTriggerModes("scene")[0]);
    expect((out.action as JsonObject).entityId).toBe("scene.movie");
  });

  it("keeps an icon, a color and a mode the person picked", () => {
    const own: JsonObject = { ...fresh(), icon: "star", color: "#123456" };
    const light = retargetTriggerSlot({ ...own, action: { ...(own.action as JsonObject), triggerMode: "turnOn" } }, "light.kitchen");
    const sw = retargetTriggerSlot(light, "switch.fan");
    expect(sw).toMatchObject({ icon: "star", color: "#123456" });
    expect((sw.action as JsonObject).triggerMode).toBe("turnOn");
  });

  it("allows only the domain's modes", () => {
    const doc = anywhere(s("T", "topLeft", { entityId: "lock.front", triggerMode: "lock", type: "triggerEntity" }));
    expect(setWatchMenuActionKey(doc, ANYWHERE, "T", "triggerMode", "play")).toBe(doc);
    expect((slot(setWatchMenuActionKey(doc, ANYWHERE, "T", "triggerMode", "unlock"), ANYWHERE, "T").action as JsonObject).triggerMode).toBe("unlock");
  });

  it("with nothing picked is dropped at a save, from every list", () => {
    const doc: MenusDocument = {
      ...anywhere(s("T", "topLeft", { entityId: "", triggerMode: "toggle", type: "triggerEntity" }), s("K", "topCenter", { type: "pages" })),
      entityRadial: { lightSlots: [s("L", "topLeft", { entityId: " ", type: "triggerEntity" })], entityOverrides: { "light.a": [s("O", "topLeft", { type: "triggerEntity", entityId: "" })] } },
    };
    const out = scrubWatchMenuOrphanTriggers(doc);
    expect(watchMenuSlots(out, ANYWHERE).map((x) => x.id)).toEqual(["K"]);
    expect(watchMenuSlots(out, LIGHT)).toEqual([]);
    expect(watchMenuSlots(out, { list: "entity", entityId: "light.a" })).toEqual([]);
    expect(scrubWatchMenuOrphanTriggers(DEFAULTS)).toBe(DEFAULTS);
  });
});

describe("the ring", () => {
  it("puts the eight places around the center, top center straight up", () => {
    expect(watchMenuPositions()).toHaveLength(8);
    const top = watchMenuRingPoint("topCenter", 0.4)!;
    expect(top.x).toBeCloseTo(0.5);
    expect(top.y).toBeCloseTo(0.1);
    expect(watchMenuRingPoint("rightCenter", 0.4)).toEqual({ x: 0.9, y: 0.5 });
    const tl = watchMenuRingPoint("topLeft", 0.4)!;
    expect(tl.x).toBeLessThan(0.5);
    expect(tl.y).toBeLessThan(0.5);
    const br = watchMenuRingPoint("bottomRight", 0.4)!;
    expect(br.x).toBeGreaterThan(0.5);
    expect(br.y).toBeGreaterThan(0.5);
    for (const p of watchMenuPositions()) {
      const pt = watchMenuRingPoint(p)!;
      expect(Math.hypot(pt.x - 0.5, pt.y - 0.5)).toBeCloseTo(0.36, 3);
    }
    expect(watchMenuRingPoint("middle")).toBeUndefined();
  });

  it("selects the picked slot while it is there, else none, so the menu's own settings show", () => {
    const uiState = new Map<string, unknown>();
    expect(selectedMenuSlot({ document: DEFAULTS, uiState }, ANYWHERE)).toBeUndefined();
    uiState.set("me:sel:anywhere", "3e4d0000-0000-4000-8000-000000000005");
    expect(selectedMenuSlot({ document: DEFAULTS, uiState }, ANYWHERE)?.position).toBe("rightCenter");
    uiState.set("me:sel:anywhere", "gone");
    expect(selectedMenuSlot({ document: DEFAULTS, uiState }, ANYWHERE)).toBeUndefined();
  });
});

describe("style", () => {
  it("rows read the stored value or the default, and the beam rows show only with a beam", () => {
    const beamColor = watchMenuStyleFields("quickAction").find((f) => f.key === "beamColor")!;
    expect(watchMenuStyleShown(DEFAULTS, "quickAction", beamColor)).toBe(false);
    expect(watchMenuStyleShown(CONFIGURED, "quickAction", beamColor)).toBe(true);
    expect(watchMenuStyleValue({}, "quickAction", beamColor)).toBe("#FFFFFF");
  });

  it("set values held to type, enum and range", () => {
    expect((setWatchMenuStyle(DEFAULTS, "quickAction", "backgroundDim", 0.1).quickAction as JsonObject).backgroundDim).toBe(0.3);
    expect((setWatchMenuStyle(DEFAULTS, "quickAction", "backgroundDim", 0.65000000001).quickAction as JsonObject).backgroundDim).toBe(0.65);
    expect(setWatchMenuStyle(DEFAULTS, "quickAction", "beamStyle", "laser")).toBe(DEFAULTS);
    expect(setWatchMenuStyle(DEFAULTS, "quickAction", "showIconBubble", "yes")).toBe(DEFAULTS);
    expect(setWatchMenuStyle(DEFAULTS, "quickAction", "madeUp", 1)).toBe(DEFAULTS);
    expect((setWatchMenuStyle(DEFAULTS, "quickAction", "beamColor", "#abcdef").quickAction as JsonObject).beamColor).toBe("#ABCDEF");
    const ps = setWatchMenuStyle(DEFAULTS, "pageSwitcher", "selectedScale", 1.3);
    expect((ps.pageSwitcher as JsonObject).selectedScale).toBe(1.3);
    expect(ps.quickAction).toBe(DEFAULTS.quickAction);
    expect(setWatchMenuStyle(DEFAULTS, "pageSwitcher", "selectedScale", "big")).toBe(DEFAULTS);
  });

  it("shows only the page switcher keys the watch reads, and never writes the others", () => {
    expect(watchMenuStyleFields("pageSwitcher").map((f) => f.key)).toEqual(["glowIntensity", "selectedScale"]);
    expect(WATCH_MENUS_UNREAD_SWITCHER_KEYS).toEqual(["iconRadius", "displayOffset", "displayMode"]);
    for (const [key, value] of [["iconRadius", 0.45], ["displayOffset", 20], ["displayMode", "icon"]] as const) {
      expect(setWatchMenuStyle(DEFAULTS, "pageSwitcher", key, value), key).toBe(DEFAULTS);
    }
  });
});

describe("Entity quick menu", () => {
  it("offers each domain its own actions; an alias reads its domain's", () => {
    expect(watchMenuOfferedActions(LIGHT).flatMap((g) => g.actions)).toContain("brightness");
    expect(watchMenuOfferedActions(ANYWHERE).flatMap((g) => g.actions)).not.toContain("brightness");
    expect(watchMenuOfferedActions({ list: "entity", entityId: "input_button.x" })).toEqual(MENU_ACTIONS.entityActions.button);
  });

  it("a domain that shares a list edits that list", () => {
    const valve = watchMenuSlots(DEFAULTS, { list: "domain", domain: "valve" });
    expect(valve).toEqual((DEFAULTS.entityRadial as JsonObject).coverSlots);
    const id = (valve[0] as JsonObject).id as string;
    const hidden = setWatchMenuSlotVisible(DEFAULTS, { list: "domain", domain: "valve" }, id, false);
    expect(findWatchMenuSlot(hidden, { list: "domain", domain: "cover" }, id)?.isVisible).toBe(false);
  });

  it("the inherit switch adds the visible All slots at the free places, and keeps them from new slots", () => {
    const all: JsonObject[] = [s("ALL1", "leftCenter", { type: "pages" }), s("ALL2", "topCenter", { type: "settings" }), s("ALL3", "rightCenter", { type: "assist" }, { isVisible: false })];
    const radial = { ...(DEFAULTS.entityRadial as JsonObject), allSlots: all };
    const doc = { ...DEFAULTS, entityRadial: radial };
    expect(watchMenuInheritedSlots(doc, LIGHT)).toEqual([]);
    const on = setWatchMenuInherits(doc, "light", true);
    expect((on.entityRadial as JsonObject).lightInheritsAll).toBe(true);
    // topCenter is the light's own, so leftCenter comes in, and the hidden
    // rightCenter slot too: the phone's effectiveSlots(for:) keeps hidden
    // All slots.
    expect(watchMenuInheritedSlots(on, LIGHT).map((x) => x.id)).toEqual(["ALL1", "ALL3"]);
    expect(watchMenuFreePositions(on, LIGHT)).not.toContain("leftCenter");
    // A hidden All slot does not hold its place against a new slot.
    expect(watchMenuFreePositions(on, LIGHT)).toContain("rightCenter");
    expect(watchMenuFreePositions(doc, LIGHT)).toContain("leftCenter");
    expect(watchMenuEffectiveSlots(on, "light").map((x) => x.id).slice(0, 2)).toEqual(["ALL1", "ALL3"]);
    expect(setWatchMenuInherits(doc, "all", true)).toBe(doc);
    // The light's own topCenter slot hidden: the All slot there comes in.
    const hidden = setWatchMenuSlotVisible(on, LIGHT, "3E4D0000-0000-4000-8000-000000000009", false);
    expect(watchMenuInheritedSlots(hidden, LIGHT).map((x) => x.id)).toEqual(["ALL1", "ALL2", "ALL3"]);
  });

  it("an entity's own menu starts as a copy of its domain's, and goes with its map when the last is removed", () => {
    const one = addWatchMenuOverride(DEFAULTS, "light.porch");
    expect(watchMenuOverrideIds(one)).toEqual(["light.porch"]);
    expect(watchMenuSlots(one, { list: "entity", entityId: "light.porch" })).toEqual(watchMenuSlots(DEFAULTS, LIGHT));
    expect(addWatchMenuOverride(one, "light.porch")).toBe(one);
    expect(addWatchMenuOverride(one, "nodot")).toBe(one);
    const radialKeys = Object.keys(one.entityRadial as JsonObject);
    expect(radialKeys.indexOf("entityOverrides")).toBeGreaterThan(radialKeys.indexOf("deviceTrackerSlots"));
    const none = removeWatchMenuOverride(one, "light.porch");
    expect(Object.hasOwn(none.entityRadial as JsonObject, "entityOverrides")).toBe(false);
    expect(none).toEqual(DEFAULTS);
    const two = removeWatchMenuOverride(addWatchMenuOverride(CONFIGURED, "light.porch"), "light.porch");
    expect(two).toEqual(CONFIGURED);
  });

  it("edits one entity's menu without touching its domain's", () => {
    const doc = addWatchMenuOverride(DEFAULTS, "light.porch");
    const E: MenuListRef = { list: "entity", entityId: "light.porch" };
    const out = removeWatchMenuSlot(doc, E, "3E4D0000-0000-4000-8000-000000000009");
    expect(watchMenuSlots(out, E)).toHaveLength(4);
    expect(watchMenuSlots(out, LIGHT)).toHaveLength(5);
  });
});

describe("budget and shape", () => {
  it("measures compact UTF-8 JSON against the watch's 250,000 bytes", () => {
    const b = watchMenusBudget(DEFAULTS);
    expect(b.limit).toBe(WATCH_MENUS_LIMIT_BYTES);
    expect(b.limit).toBe(250_000);
    expect(b.size).toBe(Buffer.byteLength(JSON.stringify(DEFAULTS)));
    expect(b.near).toBe(false);
    const big = anywhere(...Array.from({ length: 1 }, () => s("X", "topLeft", { type: "pages" }, { pad: "x".repeat(210_000) })));
    expect(watchMenusBudget(big).near).toBe(true);
  });

  it("finds what Home Assistant's shape check refuses", () => {
    const whole = (parts: JsonObject): MenusDocument => ({ entityRadial: {}, pageSwitcher: {}, quickAction: {}, schemaVersion: 1, ...parts });
    expect(checkWatchMenus(whole({}))).toEqual([]);
    expect(checkWatchMenus(DEFAULTS)).toEqual([]);
    expect(checkWatchMenus([])).not.toEqual([]);
    // Every section is required, as an object; missing or null is a fault.
    expect(checkWatchMenus({})).toHaveLength(3);
    expect(checkWatchMenus(whole({ quickAction: [] }))).not.toEqual([]);
    expect(checkWatchMenus(whole({ pageSwitcher: null }))).not.toEqual([]);
    const { entityRadial: _, ...noRadial } = whole({});
    expect(checkWatchMenus(noRadial)).not.toEqual([]);
    // Slot lists: objects with a non-empty string id, unique ignoring case.
    expect(checkWatchMenus(whole({ quickAction: { slots: [s("A", "topLeft", { type: "pages" }), s("A", "topCenter", { type: "pages" })] } }))).not.toEqual([]);
    expect(checkWatchMenus(whole({ quickAction: { slots: [s("ab-1", "topLeft", { type: "pages" }), s("AB-1", "topCenter", { type: "pages" })] } }))).not.toEqual([]);
    expect(checkWatchMenus(whole({ quickAction: { slots: [{ id: "", position: "topLeft" }] } }))).not.toEqual([]);
    expect(checkWatchMenus(whole({ quickAction: { slots: [{ id: 7 }] } }))).not.toEqual([]);
    expect(checkWatchMenus(whole({ quickAction: { slots: ["A"] } }))).not.toEqual([]);
    // A null list is a fault; an absent one is not.
    expect(checkWatchMenus(whole({ quickAction: { slots: null } }))).not.toEqual([]);
    expect(checkWatchMenus(whole({ quickAction: { schemaVersion: 1 } }))).toEqual([]);
    expect(checkWatchMenus(whole({ entityRadial: { lightSlots: {} } }))).not.toEqual([]);
    expect(checkWatchMenus(whole({ entityRadial: { lightSlots: null } }))).not.toEqual([]);
    expect(checkWatchMenus(whole({ entityRadial: { lightSlots: [{ id: "X" }, { id: "x" }] } }))).not.toEqual([]);
    // The same id in two lists is fine: each list is a menu of its own.
    expect(checkWatchMenus(whole({ entityRadial: { allSlots: [{ id: "X" }], lightSlots: [{ id: "X" }] } }))).toEqual([]);
    // Entity overrides: absent, or an object of such lists.
    expect(checkWatchMenus(whole({ entityRadial: { entityOverrides: [] } }))).not.toEqual([]);
    expect(checkWatchMenus(whole({ entityRadial: { entityOverrides: null } }))).not.toEqual([]);
    expect(checkWatchMenus(whole({ entityRadial: { entityOverrides: { "light.a": null } } }))).not.toEqual([]);
    expect(checkWatchMenus(whole({ entityRadial: { entityOverrides: { "light.a": [{ id: "" }] } } }))).not.toEqual([]);
    expect(checkWatchMenus(whole({ entityRadial: { entityOverrides: { "light.a": [{ id: "X" }] } } }))).toEqual([]);
  });
});

describe("pickers' names", () => {
  it("lists the pages a Go to Page slot can open: not system pages, only UUID ids", () => {
    const pages = {
      pages: [
        { id: "AAAAAAAA-0000-4000-8000-000000000001", name: "Kitchen" },
        { id: "settings", name: "Settings", isSystemPage: true },
        { id: "BBBBBBBB-0000-4000-8000-000000000001", name: " " },
        { id: "not-a-uuid", name: "Odd" },
      ],
    };
    expect(watchMenuPageTargets(pages)).toEqual([
      { id: "AAAAAAAA-0000-4000-8000-000000000001", name: "Kitchen" },
      { id: "BBBBBBBB-0000-4000-8000-000000000001", name: "Untitled page" },
    ]);
    expect(watchMenuPageTargets(undefined)).toEqual([]);
  });

  it("says what an earlier save holds", () => {
    expect(watchMenusSummary(DEFAULTS)).toBe("Anywhere menu: 8 slots. No entity has its own menu.");
    expect(watchMenusSummary(CONFIGURED)).toBe("Anywhere menu: 8 slots. 1 entity has its own menu.");
  });

  it("names the three sections in the phone's words", () => {
    expect(MENUS_SECTIONS.map(([, label]) => label)).toEqual(["Anywhere menu", "Entity quick menu", "Page switcher"]);
    expect(SWITCHER_LINE).not.toMatch(new RegExp(" - |\\u2013|\\u2014"));
  });
});

describe("the route", () => {
  it("is /menus and its sub-paths", () => {
    expect(isWatchMenusRoute({ prefix: "/wrist-assistant", path: "/menus" })).toBe(true);
    expect(isWatchMenusRoute({ prefix: "/wrist-assistant", path: "/menus/x" })).toBe(true);
    expect(isWatchMenusRoute({ prefix: "/wrist-assistant", path: "/menusx" })).toBe(false);
    expect(isWatchMenusRoute({ prefix: "/wrist-assistant", path: "/pages" })).toBe(false);
    expect(isWatchMenusRoute(undefined)).toBe(false);
  });

  it("reads the watch a link names from the first segment after /menus/", () => {
    const at = (path: string) => watchMenusRouteOwner({ prefix: "/wrist-assistant", path });
    expect(at("/menus/watch-1")).toBe("watch-1");
    expect(at("/menus/watch-1/more")).toBe("watch-1");
    expect(at("/menus/a%20b")).toBe("a b");
    expect(at("/menus")).toBeUndefined();
    expect(at("/menus/")).toBeUndefined();
    expect(at("/menus/%E0%A4%A")).toBeUndefined();
    expect(at("/pages/watch-1")).toBeUndefined();
  });

  it("builds both addresses from the route, or from the address bar without one", () => {
    const route = { prefix: "/wrist-assistant", path: "/menus/watch-1" };
    expect(watchMenusUrl(route, true)).toBe("/wrist-assistant/menus");
    expect(watchMenusUrl(route, false)).toBe("/wrist-assistant");
    expect(watchMenusUrl(undefined, false, "/wrist-assistant/menus/watch-1")).toBe("/wrist-assistant");
    expect(watchMenusUrl(undefined, true, "/wrist-assistant")).toBe("/wrist-assistant/menus");
  });

  describe("moving between addresses", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("pushes the new address and tells Home Assistant", () => {
      const pushed: string[] = [];
      const events: string[] = [];
      vi.stubGlobal("window", {
        location: { pathname: "/wrist-assistant" },
        dispatchEvent: (e: Event) => { events.push(e.type); return true; },
      });
      vi.stubGlobal("history", { pushState: (_s: unknown, _t: string, url: string) => pushed.push(url) });
      vi.stubGlobal("CustomEvent", class extends Event { constructor(type: string) { super(type); } });
      navigateWatchMenus({ prefix: "/wrist-assistant", path: "" }, true);
      expect(pushed).toEqual(["/wrist-assistant/menus"]);
      expect(events).toEqual(["location-changed"]);
    });
  });
});
