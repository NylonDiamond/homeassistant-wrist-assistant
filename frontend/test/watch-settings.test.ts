// The Watch settings view's catalog and its three write rules: an absent key
// is the default and stays absent unless changed, a key the panel does not
// show goes back exactly as it came, and nothing is written as null. The app
// repo checks the same catalog against the Swift types; this checks that the
// file holds together on its own.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import {
  type CatalogSetting,
  NO_RECORD_TEXT,
  WATCH_SETTINGS_CATALOG,
  buildSaveDocument,
  catalogSettings,
  conflictRevision,
  deliveryState,
  dirtyKeys,
  errorCode,
  formValues,
  initialWatch,
  isShown,
  normalizeColor,
  optionsFor,
  sectionRuns,
  settingValue,
  settingsWatches,
  withEdit,
} from "../src/watch-settings.js";

const settings = catalogSettings();
const byKey = new Map(settings.map((s) => [s.key, s]));
const setting = (key: string): CatalogSetting => {
  const s = byKey.get(key);
  if (!s) throw new Error(`no setting ${key}`);
  return s;
};

describe("the catalog", () => {
  it("is version 1 with the phone's four pages, in the phone's order", () => {
    expect(WATCH_SETTINGS_CATALOG.version).toBe(1);
    expect(WATCH_SETTINGS_CATALOG.sections.map((s) => s.id)).toEqual(["connection", "interaction", "navigation", "camera"]);
    for (const section of WATCH_SETTINGS_CATALOG.sections) {
      expect(section.title).not.toBe("");
      expect(section.settings.length).toBeGreaterThan(0);
    }
  });

  it("names every key once", () => {
    const keys = settings.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("gives every row a known type, a label and a default of the right kind", () => {
    for (const s of settings) {
      expect(["bool", "enum", "color", "entity"], s.key).toContain(s.type);
      expect(s.label.trim(), s.key).not.toBe("");
      if (s.type === "bool") expect(typeof s.default, s.key).toBe("boolean");
      else expect(typeof s.default, s.key).toBe("string");
      if (s.type === "color") expect(s.default, s.key).toMatch(/^#[0-9A-F]{6}$/);
      if (s.type === "entity") {
        expect(["scene", "script"], s.key).toContain(s.domain);
        expect(s.default, s.key).toBe("");
      }
      if (s.type !== "enum") expect(s.options, s.key).toBeUndefined();
    }
  });

  it("lists distinct options for every choice, the default among them", () => {
    for (const s of settings.filter((x) => x.type === "enum")) {
      const values = (s.options ?? []).map((o) => o.value);
      expect(values.length, s.key).toBeGreaterThan(1);
      expect(new Set(values).size, s.key).toBe(values.length);
      expect(values, s.key).toContain(s.default);
      for (const o of s.options ?? []) expect(o.label.trim(), `${s.key} ${o.value}`).not.toBe("");
    }
  });

  it("points every showIf at a catalog key, with a value that key can hold", () => {
    for (const s of settings.filter((x) => x.showIf !== undefined)) {
      const target = byKey.get(s.showIf!.key);
      expect(target, s.key).toBeDefined();
      expect(target!.key, s.key).not.toBe(s.key);
      if (target!.type === "bool") expect(typeof s.showIf!.equals, s.key).toBe("boolean");
      if (target!.type === "enum") expect(target!.options!.map((o) => o.value), s.key).toContain(s.showIf!.equals);
    }
  });

  it("puts every dependent row after the row it depends on", () => {
    for (const section of WATCH_SETTINGS_CATALOG.sections) {
      const order = section.settings.map((s) => s.key);
      for (const s of section.settings.filter((x) => x.showIf !== undefined)) {
        expect(order.indexOf(s.showIf!.key), s.key).toBeGreaterThanOrEqual(0);
        expect(order.indexOf(s.showIf!.key), s.key).toBeLessThan(order.indexOf(s.key));
      }
    }
  });

  // The plan keeps these on the phone. A catalog that grew one of them would
  // let the panel write a key it has no business in.
  it("leaves out what stays on the phone", () => {
    const keys = settings.map((s) => s.key);
    for (const key of keys) {
      expect(key, key).not.toMatch(/^(roomQuickJump|roomAutoSwitch|pointControl|motionGesture|handGesture)/);
      expect(key, key).not.toMatch(/Debug|JSON$|^showHTTP|^cameraDebugFlash$|^showCameraFPSOverlay$|^showServerModeBadge$|^showDebugTargets$/);
    }
    expect(keys).not.toContain("pendingAnimationDisabledDomains");
  });

  it("says nothing with a spaced hyphen or a dash in its words", () => {
    const words = settings.flatMap((s) => [s.label, s.help ?? "", ...(s.options ?? []).map((o) => o.label)]);
    for (const w of words) {
      expect(w, w).not.toMatch(/ \x2d |–|—/);
    }
  });
});

describe("values after defaults", () => {
  it("reads a stored value of the right kind and the default otherwise", () => {
    expect(settingValue(setting("wrapPages"), { wrapPages: true })).toBe(true);
    expect(settingValue(setting("wrapPages"), {})).toBe(false);
    expect(settingValue(setting("wrapPages"), { wrapPages: "yes" })).toBe(false);
    expect(settingValue(setting("dismissControlsOnClose"), {})).toBe(true);
    expect(settingValue(setting("pageTransitionStyle"), {})).toBe("None");
    expect(settingValue(setting("pageTransitionStyle"), { pageTransitionStyle: "Fade" })).toBe("Fade");
  });

  it("keeps an enum value the catalog does not list, and offers it as a choice", () => {
    const s = setting("cameraStreamMode");
    expect(settingValue(s, { cameraStreamMode: "MJPEG" })).toBe("MJPEG");
    const options = optionsFor(s, "MJPEG");
    expect(options.map((o) => o.value)).toEqual(["Auto", "Polling", "MJPEG"]);
    expect(optionsFor(s, "Auto")).toBe(s.options);
  });

  it("reads a color as #RRGGBB and anything else as the default", () => {
    const s = setting("pageIndicatorColorHex");
    expect(settingValue(s, { pageIndicatorColorHex: "#ff8800" })).toBe("#FF8800");
    expect(settingValue(s, { pageIndicatorColorHex: "" })).toBe("#FFFFFF");
    expect(settingValue(s, {})).toBe("#FFFFFF");
    expect(normalizeColor("ff8800cc")).toBe("#FF8800");
    expect(normalizeColor("#12")).toBeUndefined();
  });

  it("fills every catalog key, edits over the document", () => {
    const values = formValues({ wrapPages: true }, new Map([["serverMode", "Local"]]));
    expect(values.size).toBe(settings.length);
    expect(values.get("wrapPages")).toBe(true);
    expect(values.get("serverMode")).toBe("Local");
    expect(values.get("deltaTimeout")).toBe("45s");
  });
});

describe("showIf", () => {
  it("hides a row until its key holds the value, defaults counted", () => {
    const style = setting("pageIndicatorStyle");
    expect(isShown(style, formValues({}))).toBe(true);
    expect(isShown(style, formValues({ showPageIndicator: false }))).toBe(false);
    const scene = setting("pullDownSceneTargetId");
    expect(isShown(scene, formValues({}))).toBe(false);
    expect(isShown(scene, formValues({}, new Map([["pullDownAction", "Activate Scene"]])))).toBe(true);
    expect(isShown(setting("wrapPages"), formValues({}))).toBe(true);
  });

  it("draws the rows that depend on the row above them as one run under it", () => {
    const nav = WATCH_SETTINGS_CATALOG.sections.find((s) => s.id === "navigation")!;
    const on = sectionRuns(nav, formValues({}));
    const dots = on.find((r) => r.setting.key === "showPageIndicator")!;
    expect(dots.dependents.map((s) => s.key)).toEqual([
      "pageIndicatorStyle", "pageIndicatorOpacity", "pageIndicatorPosition", "pageIndicatorSize", "pageIndicatorColorHex",
    ]);
    const off = sectionRuns(nav, formValues({ showPageIndicator: false }));
    expect(off.find((r) => r.setting.key === "showPageIndicator")!.dependents).toEqual([]);
    expect(off.some((r) => r.setting.key === "pageIndicatorStyle")).toBe(false);
  });
});

describe("edits and the dirty check", () => {
  it("drops an edit that puts a row back to what the document says", () => {
    const doc = { wrapPages: false };
    const once = withEdit(new Map(), doc, setting("wrapPages"), true);
    expect(dirtyKeys(doc, once)).toEqual(["wrapPages"]);
    const back = withEdit(once, doc, setting("wrapPages"), false);
    expect(back.size).toBe(0);
    expect(dirtyKeys(doc, back)).toEqual([]);
  });

  it("counts a default picked for an absent key as no change", () => {
    const edits = withEdit(new Map(), {}, setting("serverMode"), "Auto");
    expect(edits.size).toBe(0);
  });

  it("ignores edits for keys the catalog does not have", () => {
    expect(dirtyKeys({}, new Map([["roomQuickJumpEnabled", true]]))).toEqual([]);
  });
});

describe("the document a save sends", () => {
  const stored = {
    schemaVersion: 1,
    longPressDuration: "Short",
    wrapPages: false,
    roomQuickJumpMappings: { kitchen: "A1B2" },
    motionGestureActionsJSON: "{\"flick\":\"Refresh\"}",
    pendingAnimationDisabledDomains: ["fan", "light"],
    showGestureDebug: true,
    pullDownSceneTargetId: "scene.evening",
  };

  it("keeps every key it was given and changes only the edited ones", () => {
    const edits = new Map<string, string | boolean>([["wrapPages", true], ["serverMode", "Remote"]]);
    const out = buildSaveDocument(stored, edits);
    expect(out).toEqual({ ...stored, wrapPages: true, serverMode: "Remote" });
    // The loaded document is left alone, so a failed save loses nothing.
    expect(stored.wrapPages).toBe(false);
    expect(out.roomQuickJumpMappings).not.toBe(stored.roomQuickJumpMappings);
  });

  it("writes a key set back to its default explicitly, and never null", () => {
    const out = buildSaveDocument({ deltaTimeout: "25s" }, new Map([["deltaTimeout", "45s"]]));
    expect(out).toEqual({ deltaTimeout: "45s" });
    expect(Object.values(buildSaveDocument(stored, new Map([["pullDownSceneTargetId", ""]])))).not.toContain(null);
  });

  it("removes an entity left empty and trims one picked", () => {
    expect(buildSaveDocument(stored, new Map([["pullDownSceneTargetId", ""]]))).not.toHaveProperty("pullDownSceneTargetId");
    expect(buildSaveDocument({}, new Map([["pullDownScriptTargetId", " script.bed "]]))).toEqual({ pullDownScriptTargetId: "script.bed" });
  });

  it("writes a color as #RRGGBB", () => {
    expect(buildSaveDocument({}, new Map([["pageIndicatorColorHex", "#ff880080"]]))).toEqual({ pageIndicatorColorHex: "#FF8800" });
  });

  it("drops edits to keys outside the catalog", () => {
    expect(buildSaveDocument({ a: 1 }, new Map([["roomQuickJumpEnabled", true]]))).toEqual({ a: 1 });
  });

  // The phone turns the old room quick jump switch off whenever the top
  // double-tap becomes anything but Room jump, and the watch reads that switch
  // as Room jump under Disabled. The panel has to do the same.
  it("turns room quick jump off when the top double-tap leaves Room jump", () => {
    const doc = { topSectionDoubleTapAction: "Room Jump", roomQuickJumpEnabled: true };
    expect(buildSaveDocument(doc, new Map([["topSectionDoubleTapAction", "Disabled"]])))
      .toEqual({ topSectionDoubleTapAction: "Disabled", roomQuickJumpEnabled: false });
    expect(buildSaveDocument({ topSectionDoubleTapAction: "Refresh" }, new Map([["topSectionDoubleTapAction", "Disabled"]])))
      .toEqual({ topSectionDoubleTapAction: "Disabled" });
    expect(buildSaveDocument(doc, new Map([["wrapPages", true]])).roomQuickJumpEnabled).toBe(true);
  });
});

describe("delivery and errors", () => {
  it("reads the phone's copy against the stored revision", () => {
    expect(deliveryState(undefined)).toBe("none");
    expect(deliveryState({ revision: 0, delivered_revision: 0 })).toBe("none");
    expect(deliveryState({ revision: 5, delivered_revision: 4 })).toBe("waiting");
    expect(deliveryState({ revision: 5, delivered_revision: 5 })).toBe("delivered");
  });

  it("reads the stored revision out of a conflict", () => {
    const err = { code: "conflict", message: "stored revision is 7, save was based on 6" };
    expect(errorCode(err)).toBe("conflict");
    expect(conflictRevision(err)).toBe(7);
    expect(conflictRevision({ code: "conflict", message: "conflict", revision: 9 })).toBe(9);
    expect(conflictRevision({ code: "conflict", message: "something else" })).toBeUndefined();
    expect(errorCode({ code: "no_record", message: "no record" })).toBe("no_record");
    expect(errorCode(new Error("x"))).toBeUndefined();
    expect(conflictRevision(undefined)).toBeUndefined();
  });
});

describe("which devices the view offers", () => {
  const owner = (o: Partial<OwnerSummary> & { owner_watch_id: string }): OwnerSummary => ({
    device_name: null,
    device_kind: "watch",
    paired_iphone_name: null,
    app_version: "3.0.0",
    screen_size: null,
    complication_count: 0,
    token: 1,
    is_orphan: false,
    ...o,
  });
  const owners = [
    owner({ owner_watch_id: "w1", device_name: "Apple Watch" }),
    owner({ owner_watch_id: "p1", device_name: "Jesse's iPhone", device_kind: "iphone" }),
    owner({ owner_watch_id: "old", device_kind: null, is_orphan: true }),
    owner({ owner_watch_id: "library", device_kind: "library" }),
    owner({ owner_watch_id: "w2", device_name: "Apple Watch" }),
  ];

  it("lists watches only: no phone, no Library, no orphan", () => {
    expect(settingsWatches(owners).map((o) => o.owner_watch_id)).toEqual(["w1", "w2"]);
  });

  it("opens on the watch being edited, else the first", () => {
    const watches = settingsWatches(owners);
    expect(initialWatch(watches, "w2")).toBe("w2");
    expect(initialWatch(watches, "p1")).toBe("w1");
    expect(initialWatch(watches, undefined)).toBe("w1");
    expect(initialWatch([], "w1")).toBeUndefined();
  });

  it("opens on an unknown watch a link names as it would with none", () => {
    const watches = settingsWatches(owners);
    expect(initialWatch(watches, "gone")).toBe("w1");
  });
});

describe("a watch with nothing in Home Assistant yet", () => {
  it("points at the iPhone app's own switch, by its current name and place", () => {
    expect(NO_RECORD_TEXT).toBe("Open the iPhone app, then turn on Edit pages in Home Assistant under Settings, Pages in Home Assistant.");
    expect(NO_RECORD_TEXT).not.toMatch(/Developer|Save pages to Home Assistant/);
  });
});
