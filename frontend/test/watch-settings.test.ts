// The Watch settings view's catalog and its three write rules: an absent key
// is the default and stays absent unless changed, a key the panel does not
// show goes back exactly as it came, and nothing is written as null. The app
// repo checks the same catalog against the Swift types; this checks that the
// file holds together on its own.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { applyRoomEdits, roomSwitchTrigger, switchingWritesFor, triggerWrites, withRoomWrites } from "../src/watch-rooms/model.js";
import {
  type CatalogSetting,
  BEHAVIOR_SCHEMA_VERSION,
  COLLECTED_PILL_TEXT,
  PAGES_NO_RECORD_TEXT,
  PAGES_START_BUTTON,
  PAGES_START_CONFLICT_TEXT,
  PAIR_FIRST_TEXT,
  SETTINGS_MAIN_HOUSE_TEXT,
  SETTINGS_NO_RECORD_TEXT,
  SETTINGS_PAIR_FIRST_TEXT,
  SETTINGS_START_BUTTON,
  SETTINGS_START_CONFLICT_TEXT,
  WAITING_HELP_TEXT,
  WAITING_PILL_TEXT,
  WATCH_SETTINGS_CATALOG,
  buildSaveDocument,
  catalogSettings,
  TWIST_LEVELS,
  conflictRevision,
  createWatchBehavior,
  decodeMotionMap,
  domainList,
  encodeMotionMap,
  motionAction,
  readMotionActions,
  sameValue,
  twistStrength,
  withMotionAction,
  withMotionTarget,
  deliveryState,
  dirtyKeys,
  errorCode,
  followWatch,
  formValues,
  initialWatch,
  isShown,
  PAIR_ALREADY_PAIRED_TEXT,
  PAIR_NOT_FOUND_TEXT,
  PAIR_OTHER_USER_TEXT,
  PAIR_REMOTE_WARNING_TEXT,
  isPrivateAddress,
  normalizeColor,
  normalizePairCode,
  optionsFor,
  pairCodeIsComplete,
  pairErrorText,
  pairNeedsAdmin,
  PAIR_OTHER_PERSON_TEXT,
  pairLookupLine,
  pairLookupWarnings,
  pairRemoteWarning,
  pairRequestLine,
  PAIR_USER_TITLE,
  PAIR_CARD_TITLE,
  PAIR_CODE_HINT,
  PAIR_MODES,
  pairOnIPhone,
  PAIR_OPEN_APP_TEXT,
  PAIR_QR_EXPIRED_TEXT,
  PAIR_QR_HINT,
  PAIR_QR_REPLACE_HINT,
  PAIR_QR_REPLACE_LABEL,
  PAIR_MORE_TEXT,
  PAIR_REPLACE_LABEL,
  PAIR_SHOW_QR_TEXT,
  PAIR_USER_PLACEHOLDER,
  mayPairForOthers,
  pairCanConfirm,
  pairChecksNeeded,
  pairCountdownText,
  pairDefaultUser,
  pairDeviceKind,
  pairExpectLabel,
  pairPersonPicked,
  pairUserChoices,
  pairUserHint,
  pairUserIsAdmin,
  pairUserTitle,
  pairUserToSend,
  pairedFor,
  pairedText,
  savedByWords,
  sectionRuns,
  settingValue,
  settingsWatches,
  takesSettingsFromAnotherHome,
  waitingHelpText,
  watchBehaviorDefaults,
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
  it("is version 1 with the phone's four pages in the phone's order, then its Motion Gestures page", () => {
    expect(WATCH_SETTINGS_CATALOG.version).toBe(1);
    expect(WATCH_SETTINGS_CATALOG.sections.map((s) => s.id)).toEqual(["connection", "interaction", "navigation", "camera", "motion"]);
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
      expect(["bool", "enum", "color", "entity", "number", "domains", "motionGestures"], s.key).toContain(s.type);
      expect(s.label.trim(), s.key).not.toBe("");
      if (s.type === "bool") expect(typeof s.default, s.key).toBe("boolean");
      else if (s.type === "number") expect(typeof s.default, s.key).toBe("number");
      else if (s.type === "domains") expect(Array.isArray(s.default), s.key).toBe(true);
      else expect(typeof s.default, s.key).toBe("string");
      if (s.type === "color") expect(s.default, s.key).toMatch(/^#[0-9A-F]{6}$/);
      if (s.type === "entity") {
        expect(["scene", "script"], s.key).toContain(s.domain);
        expect(s.default, s.key).toBe("");
      }
      if (s.type === "number") {
        expect(s.min! < s.max! && s.step! > 0, s.key).toBe(true);
        expect(s.default as number, s.key).toBeGreaterThanOrEqual(s.min!);
        expect(s.default as number, s.key).toBeLessThanOrEqual(s.max!);
      }
      if (s.type === "motionGestures") {
        expect(s.default, s.key).toBe("");
        expect(s.gestures!.length, s.key).toBeGreaterThan(0);
        expect(s.sceneKey, s.key).toBeDefined();
        expect(s.scriptKey, s.key).toBeDefined();
      }
      if (s.type !== "enum" && s.type !== "domains" && s.type !== "motionGestures") expect(s.options, s.key).toBeUndefined();
      if (s.initial !== undefined) expect(s.type, s.key).toBe("domains");
    }
  });

  it("lists every domain once, the stored list and a new watch's list among them and sorted", () => {
    for (const s of settings.filter((x) => x.type === "domains")) {
      const values = (s.options ?? []).map((o) => o.value);
      expect(new Set(values).size, s.key).toBe(values.length);
      for (const list of [s.default, s.initial ?? []] as string[][]) {
        expect(list, s.key).toEqual([...list].sort());
        for (const d of list) expect(values, `${s.key} ${d}`).toContain(d);
      }
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
      const wanted = s.showIf!.equals ?? s.showIf!.notEquals;
      expect((s.showIf!.equals === undefined) !== (s.showIf!.notEquals === undefined), s.key).toBe(true);
      if (target!.type === "bool") expect(typeof wanted, s.key).toBe("boolean");
      if (target!.type === "enum") expect(target!.options!.map((o) => o.value), s.key).toContain(wanted);
    }
  });

  // The integration keeps only the `iphone` keys on a phone's settings, and
  // its own copy of that list is held to this file by a Python test.
  it("says for every row which devices read it: the watch always, the iPhone for 35", () => {
    for (const s of settings) {
      expect(s.devices, s.key).toBeDefined();
      expect([["watch"], ["watch", "iphone"]], s.key).toContainEqual([...s.devices!]);
    }
    expect(settings.filter((s) => s.devices!.includes("iphone")).length).toBe(35);
    expect(
      settings
        .filter((s) => !s.devices!.includes("iphone"))
        .map((s) => s.key)
        .sort(),
    ).toEqual([
      "bottomEdgePageSwipeSensitivity",
      "deltaTimeout",
      "handGestureAction",
      "handGestureSceneTargetId",
      "handGestureScriptTargetId",
      "motionGestureActionsJSON",
      "motionGestureSensitivity",
      "motionGestureSensitivityLevel",
      "serverMode",
      "sliderCrownSensitivity",
    ]);
  });

  it("hangs every iPhone row's showIf on another iPhone row", () => {
    for (const s of settings.filter((x) => x.showIf !== undefined && x.devices!.includes("iphone"))) {
      expect(byKey.get(s.showIf!.key)!.devices, s.key).toContain("iphone");
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

  // Rooms owns the room keys and the point control targets, and the debug
  // flags have no editor. A catalog that grew one of them would let this page
  // write a key it has no business in.
  it("leaves out what Rooms edits and the debug flags", () => {
    const keys = settings.map((s) => s.key);
    for (const key of keys) {
      expect(key, key).not.toMatch(/^(roomQuickJump|roomAutoSwitch)|^pointControl(RoomMappingsJSON|TapToToggle|LiveTile)$/);
      expect(key, key).not.toMatch(/Debug|^showHTTP|^cameraDebugFlash$|^showCameraFPSOverlay$|^showServerModeBadge$|^showDebugTargets$/);
    }
    // The twists' targets are written by the twists' row, not rows of their own.
    expect(keys).not.toContain("motionGestureSceneTargetsJSON");
    expect(keys).not.toContain("motionGestureScriptTargetsJSON");
  });

  // Keys the watch stores but never reads get no row: the crown no longer
  // turns pages, the grid takes neither the double-tap speed nor the haptic
  // strength, and nothing reads the camera downscaling or preview refresh.
  it("gives no row to a key the watch never reads", () => {
    const keys = settings.map((s) => s.key);
    for (const key of ["crownSwitchesPages", "crownSensitivity", "doubleTapSpeed", "hapticIntensity",
      "cameraImageDownscaling", "cameraPreviewAutoRefresh", "cameraPreviewRefreshInterval", "showPageTitle", "pageTitleStyle"]) {
      expect(keys, key).not.toContain(key);
    }
  });

  it("says nothing with a spaced hyphen or a dash in its words", () => {
    const words = settings.flatMap((s) => [s.label, s.help ?? "", ...(s.options ?? []).map((o) => o.label), ...(s.gestures ?? []).map((g) => g.label)]);
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

  it("opens the handed watch when nothing is shown or the shown one left, and stays when that is the one", () => {
    const watches = settingsWatches(owners);
    expect(followWatch(watches, undefined, "w2", false)).toBe("w2");
    expect(followWatch(watches, undefined, undefined, false)).toBe("w1");
    expect(followWatch(watches, "gone", "w2", false)).toBe("w2");
    expect(followWatch(watches, "gone", "p1", true)).toBe("w1");
    expect(followWatch([], undefined, "w1", true)).toBeUndefined();
    expect(followWatch(watches, "w2", "w2", true)).toBeUndefined();
  });

  it("keeps a listed watch unless asked to follow, and then moves only to a listed watch", () => {
    const watches = settingsWatches(owners);
    expect(followWatch(watches, "w1", "w2", false)).toBeUndefined();
    expect(followWatch(watches, "w1", "w2", true)).toBe("w2");
    expect(followWatch(watches, "w1", "p1", true)).toBeUndefined();
    expect(followWatch(watches, "w1", "gone", true)).toBeUndefined();
    expect(followWatch(watches, "w1", undefined, true)).toBeUndefined();
  });
});

describe("a watch with nothing in Home Assistant yet", () => {
  it("offers the button, and names no iPhone switch", () => {
    expect(PAGES_NO_RECORD_TEXT).toBe("Start with an empty page to begin.");
    expect(SETTINGS_NO_RECORD_TEXT).toBe("Start with the defaults to begin.");
    expect(PAGES_START_BUTTON).toBe("Start with an empty page");
    expect(SETTINGS_START_BUTTON).toBe("Start with the defaults");
    expect(PAIR_FIRST_TEXT).toBe("Pair this watch first. Go to Watch app, Settings, Pair a device.");
    expect(SETTINGS_PAIR_FIRST_TEXT).toBe("Pair this watch first, under Pair a device on this page.");
    expect(PAGES_START_CONFLICT_TEXT).toBe("Pages for this watch arrived meanwhile, so those are shown.");
    expect(SETTINGS_START_CONFLICT_TEXT).toBe("Settings for this watch arrived meanwhile, so those are shown.");
    const all = [PAGES_NO_RECORD_TEXT, SETTINGS_NO_RECORD_TEXT, PAIR_FIRST_TEXT, SETTINGS_PAIR_FIRST_TEXT, PAGES_START_CONFLICT_TEXT, SETTINGS_START_CONFLICT_TEXT];
    for (const text of all) {
      expect(text).not.toMatch(/Developer|Save pages to Home Assistant/);
      expect(text).not.toMatch(new RegExp(" - |\\u2013|\\u2014"));
    }
  });

  it("says who saved a record and where a save has got to without naming only the iPhone", () => {
    expect(savedByWords("panel")).toBe("saved here");
    expect(savedByWords("W1")).toBe("from the watch");
    expect(savedByWords(null)).toBe("from the watch");
    expect(WAITING_PILL_TEXT).toBe("Waiting to be collected");
    expect(COLLECTED_PILL_TEXT).toBe("Synced");
    expect(WAITING_HELP_TEXT).toBe("The watch picks it up the next time it checks.");
    // The iPhone passes nothing to the watch any more.
    expect(WAITING_HELP_TEXT).not.toMatch(/iPhone/);
    // A phone's own records wait for the phone.
    expect(waitingHelpText("iphone")).toBe("The iPhone picks it up the next time it checks.");
    expect(waitingHelpText("watch")).toBe(WAITING_HELP_TEXT);
  });
});

describe("Start with the defaults", () => {
  const refusal = (code: string, message = code) => Object.assign(new Error(message), { code });

  it("builds every catalog setting at its first value or default, schema 1, keys sorted", () => {
    const doc = watchBehaviorDefaults();
    expect(doc.schemaVersion).toBe(BEHAVIOR_SCHEMA_VERSION);
    expect(BEHAVIOR_SCHEMA_VERSION).toBe(1);
    for (const setting of catalogSettings()) {
      if ((setting.type === "entity" || setting.type === "motionGestures") && setting.default === "") {
        expect(Object.hasOwn(doc, setting.key), setting.key).toBe(false);
      } else {
        expect(doc[setting.key], setting.key).toEqual(setting.initial ?? setting.default);
      }
    }
    const keys = Object.keys(doc);
    expect(keys).toEqual([...keys].sort());
    expect(Object.values(doc)).not.toContain(null);
    // Every value reads back as itself: nothing in the form differs from the
    // first document, so the new record opens with no edits.
    const values = formValues(doc);
    for (const setting of catalogSettings()) {
      expect(values.get(setting.key), setting.key).toEqual(settingValue(setting, { [setting.key]: setting.initial ?? setting.default }));
    }
    expect(values.get("motionGestureActionsJSON")).toEqual({ actions: {}, scenes: {}, scripts: {} });
  });

  it("carries the keys the app cannot decode without, at the app's own defaults", () => {
    const doc = watchBehaviorDefaults();
    // The fields of `BehaviorPreferences` that are not optional in Swift.
    const required: Record<string, unknown> = {
      longPressDuration: "Short",
      doubleTapSpeed: "Fast",
      hapticIntensity: "Medium",
      showPendingAnimation: true,
      crownSwitchesPages: false,
      crownSensitivity: "Normal",
      wrapPages: false,
      showPageIndicator: true,
    };
    for (const [key, value] of Object.entries(required)) expect(doc[key], key).toEqual(value);
    expect(doc.pendingAnimationDisabledDomains).toEqual([
      "automation", "fan", "input_boolean", "input_number", "input_select", "light", "media_player", "switch", "timer",
    ]);
  });

  it("is a new object each time", () => {
    const a = watchBehaviorDefaults();
    (a.pendingAnimationDisabledDomains as string[]).push("lock");
    expect(watchBehaviorDefaults().pendingAnimationDisabledDomains).not.toContain("lock");
  });

  it("saves the defaults over revision 0 for a paired watch", async () => {
    const calls: [number, Record<string, unknown>][] = [];
    const result = await createWatchBehavior(async (base, document) => { calls.push([base, document]); return { revision: 1 }; });
    expect(result).toEqual({ ok: true, revision: 1, document: watchBehaviorDefaults() });
    expect(calls).toHaveLength(1);
    expect(calls[0]![0]).toBe(0);
    expect(calls[0]![1]).toEqual(watchBehaviorDefaults());
  });

  it("tells a watch that is not paired, a record that came meanwhile, and an old integration apart", async () => {
    expect(await createWatchBehavior(async () => { throw refusal("no_record"); })).toMatchObject({ ok: false, code: "no_record" });
    expect(await createWatchBehavior(async () => { throw refusal("conflict", "stored revision is 1, save was based on 0"); }))
      .toEqual({ ok: false, code: "conflict", message: "stored revision is 1, save was based on 0" });
    expect(await createWatchBehavior(async () => { throw { type: "result", success: false, error: { code: "unknown_command", message: "x" } }; }))
      .toMatchObject({ ok: false, code: "unsupported" });
    expect(await createWatchBehavior(async () => { throw refusal("unavailable", "the store is not ready"); }))
      .toEqual({ ok: false, code: "error", message: "the store is not ready" });
  });
});

describe("pairing a watch by its code", () => {
  it("cleans a typed code the way the server compares it", () => {
    expect(normalizePairCode("  abc def ")).toBe("ABCDEF");
    expect(normalizePairCode("abc-def")).toBe("ABCDEF");
    expect(normalizePairCode("ab c-\td9")).toBe("ABCD9");
    expect(normalizePairCode("k7m2p9")).toBe("K7M2P9");
  });

  it("keeps only letters and the digits 2 to 9", () => {
    expect(normalizePairCode("A1B0C!d.e_f")).toBe("ABCDEF");
    expect(normalizePairCode("é2ü3")).toBe("23");
    expect(normalizePairCode("")).toBe("");
  });

  it("calls a code complete at exactly six characters", () => {
    expect(pairCodeIsComplete("ABCDEF")).toBe(true);
    expect(pairCodeIsComplete("K7M2P9")).toBe(true);
    expect(pairCodeIsComplete("ABCDE")).toBe(false);
    expect(pairCodeIsComplete("ABCDEFG")).toBe(false);
    expect(pairCodeIsComplete("")).toBe(false);
  });

  it("names the watch with its app version and build", () => {
    expect(pairLookupLine({ device_name: "Apple Watch Series 11", app_version: "3.0.1", app_build: "2" }))
      .toBe("Apple Watch Series 11, app 3.0.1 (2)");
  });

  it("falls back to Apple Watch and leaves out what is missing", () => {
    expect(pairLookupLine({ device_name: null, app_version: "3.0.1", app_build: "2" })).toBe("Apple Watch, app 3.0.1 (2)");
    expect(pairLookupLine({ device_name: "  ", app_version: "3.0.1" })).toBe("Apple Watch, app 3.0.1");
    expect(pairLookupLine({ device_name: "Apple Watch Ultra 3", app_version: null, app_build: "2" })).toBe("Apple Watch Ultra 3");
    expect(pairLookupLine({})).toBe("Apple Watch");
  });

  it("warns about a watch that is already paired, or paired by someone else", () => {
    expect(pairLookupWarnings({ already_paired: false, paired_by_other_user: false })).toEqual([]);
    expect(pairLookupWarnings({ already_paired: true, paired_by_other_user: false })).toEqual([PAIR_ALREADY_PAIRED_TEXT]);
    expect(pairLookupWarnings({ already_paired: true, paired_by_other_user: true }))
      .toEqual([PAIR_ALREADY_PAIRED_TEXT, PAIR_OTHER_USER_TEXT]);
    expect(PAIR_ALREADY_PAIRED_TEXT).toBe("This watch is already paired. Pairing again gives it a new key.");
    expect(PAIR_OTHER_USER_TEXT).toBe("This watch was paired by another user.");
  });

  it("says how long a code lasts when none matches", () => {
    expect(PAIR_NOT_FOUND_TEXT).toBe("No pairing with that code. Codes last 10 minutes.");
  });

  it("names the watch once it is paired", () => {
    expect(pairedText("Apple Watch Series 11")).toBe("Paired Apple Watch Series 11.");
    expect(pairedText(null)).toBe("Paired Apple Watch.");
    expect(pairedText(" ")).toBe("Paired Apple Watch.");
    expect(pairedText("Chen's Watch", "Chen")).toBe("Paired Chen's Watch for Chen.");
    expect(pairedText(null, " ")).toBe("Paired Apple Watch.");
    expect(pairedText(null, "Chen", "iphone")).toBe("Paired iPhone for Chen.");
    expect(pairedText("Chen's iPhone", "Chen", "iphone")).toBe("Paired Chen's iPhone for Chen.");
  });

  const USERS = [
    { id: "sup", name: "Supervisor", is_active: true, system_generated: true, group_ids: ["system-admin"] },
    { id: "pat", name: "Pat", is_active: true, system_generated: false, group_ids: ["system-users"] },
    { id: "root", name: "Jesse", is_active: true, system_generated: false, is_owner: true, group_ids: ["system-users"] },
    { id: "old", name: "Old Account", is_active: false, system_generated: false },
    { id: "chen", name: "Chen", is_active: true, system_generated: false, group_ids: ["system-admin"] },
    { id: "nameless", name: " ", username: "guest", is_active: true },
  ];

  it("offers active people only, the administrator first, then the rest by name, each with its account type", () => {
    expect(pairUserChoices(USERS, "root")).toEqual([
      { id: "root", label: "Jesse (you) · Admin", name: "Jesse", admin: true },
      { id: "chen", label: "Chen · Admin", name: "Chen", admin: true },
      { id: "nameless", label: "guest · User", name: "guest", admin: false },
      { id: "pat", label: "Pat · User", name: "Pat", admin: false },
    ]);
    // An administrator missing from the list is no reason to offer nobody.
    expect(pairUserChoices(USERS, "gone").map((c) => c.id)).toEqual(["chen", "nameless", "root", "pat"]);
    expect(PAIR_USER_TITLE).toBe("Whose watch is this?");
    expect(pairUserTitle("iphone")).toBe("Whose iPhone is this?");
    expect(pairUserHint("iphone")).toBe("The iPhone runs with this person's rights.");
    expect(PAIR_USER_PLACEHOLDER).toBe("Choose a person");
  });

  it("lets only an administrator pair for somebody else; anyone else pairs for themselves", () => {
    expect(mayPairForOthers({ is_admin: true })).toBe(true);
    expect(mayPairForOthers({ is_admin: false })).toBe(false);
    expect(mayPairForOthers({})).toBe(false);
    expect(mayPairForOthers(undefined)).toBe(false);
  });

  it("counts the owner and the administrators group as Admin, everyone else as User", () => {
    expect(pairUserIsAdmin({ id: "a", is_owner: true })).toBe(true);
    expect(pairUserIsAdmin({ id: "a", group_ids: ["system-admin"] })).toBe(true);
    expect(pairUserIsAdmin({ id: "a", group_ids: ["system-users", "system-admin"] })).toBe(true);
    expect(pairUserIsAdmin({ id: "a", group_ids: ["system-users"] })).toBe(false);
    expect(pairUserIsAdmin({ id: "a", group_ids: null })).toBe(false);
    expect(pairUserIsAdmin({ id: "a" })).toBe(false);
  });

  it("picks nobody among several people, except the owner of a known device", () => {
    const choices = pairUserChoices(USERS, "root");
    expect(pairDefaultUser(choices, null)).toBeUndefined();
    expect(pairDefaultUser(choices, undefined)).toBeUndefined();
    expect(pairDefaultUser(choices, "chen")).toBe("chen");
    // Bound to someone no longer offered (deactivated): nobody.
    expect(pairDefaultUser(choices, "old")).toBeUndefined();
    // One person: nothing to choose.
    expect(pairDefaultUser(pairUserChoices([USERS[2]!], "root"), null)).toBe("root");
    expect(pairDefaultUser([], null)).toBeUndefined();
  });

  it("holds Pair until a person is picked and every box shown is ticked", () => {
    const choices = pairUserChoices(USERS, "root");
    const none = { replace: false, remote: false };
    expect(pairPersonPicked(choices, undefined)).toBe(false);
    expect(pairPersonPicked(choices, "old")).toBe(false);
    expect(pairPersonPicked(choices, "pat")).toBe(true);
    // No menu (an older integration, or one person): nothing to pick.
    expect(pairPersonPicked(undefined, undefined)).toBe(true);
    expect(pairPersonPicked(choices.slice(0, 1), undefined)).toBe(true);

    expect(pairCanConfirm(none, none, choices, undefined)).toBe(false);
    expect(pairCanConfirm(none, none, choices, "pat")).toBe(true);
    expect(pairCanConfirm({ replace: true, remote: false }, none, choices, "pat")).toBe(false);
    expect(pairCanConfirm({ replace: true, remote: false }, { replace: true, remote: false }, choices, "pat")).toBe(true);
    expect(pairCanConfirm({ replace: true, remote: true }, { replace: true, remote: false }, choices, "pat")).toBe(false);
    expect(pairCanConfirm({ replace: false, remote: true }, { replace: false, remote: true }, undefined, undefined)).toBe(true);
  });

  it("asks for Replace on a paired device and for I expect this on an outside request", () => {
    expect(pairChecksNeeded({})).toEqual({ replace: false, remote: false });
    expect(pairChecksNeeded({ already_paired: true })).toEqual({ replace: true, remote: false });
    expect(pairChecksNeeded({ paired_by_other_user: true })).toEqual({ replace: true, remote: false });
    expect(pairChecksNeeded({ remote: "203.0.113.7" })).toEqual({ replace: false, remote: true });
    // The server's own reading wins where the panel cannot see it: a request
    // through Home Assistant Cloud has a home-looking address.
    expect(pairChecksNeeded({ remote: "127.0.0.1", needs_allow_remote: true })).toEqual({ replace: false, remote: true });
    expect(pairChecksNeeded({ needs_replace: true })).toEqual({ replace: true, remote: false });
    expect(pairChecksNeeded({ remote: "192.168.1.4" })).toEqual({ replace: false, remote: false });
    // A box the server asked for stays, whatever the lookup said.
    expect(pairChecksNeeded({ remote: "192.168.1.4" }, { remote: true })).toEqual({ replace: false, remote: true });
    expect(pairChecksNeeded({}, { replace: true })).toEqual({ replace: true, remote: false });
    expect(PAIR_REPLACE_LABEL).toBe("Replace its pairing");
    expect(pairExpectLabel("watch")).toBe("I expect this watch");
    expect(pairExpectLabel("iphone")).toBe("I expect this iPhone");
  });

  it("names the person picked, only where there was a menu", () => {
    const choices = pairUserChoices(USERS, "root");
    expect(pairedFor(choices, "root")).toBe("Jesse");
    expect(pairedFor(choices, "chen")).toBe("Chen");
    expect(pairedFor(choices, undefined)).toBeUndefined();
    expect(pairedFor(choices, "nobody")).toBeUndefined();
    expect(pairedFor(undefined, "chen")).toBeUndefined();
    expect(pairedFor(choices.slice(0, 1), "root")).toBeUndefined();
  });

  it("reads the device kind, a watch when the integration names none", () => {
    expect(pairDeviceKind({ kind: "iphone" })).toBe("iphone");
    expect(pairDeviceKind({ kind: "watch" })).toBe("watch");
    expect(pairDeviceKind({})).toBe("watch");
    expect(pairDeviceKind({ kind: "toaster" })).toBe("watch");
    expect(pairLookupLine({ kind: "iphone", device_name: null, app_version: "3.2" })).toBe("iPhone, app 3.2");
    expect(pairLookupWarnings({ kind: "iphone", already_paired: true, paired_by_other_user: true }))
      .toEqual(["This iPhone is already paired. Pairing again gives it a new key.", "This iPhone was paired by another user."]);
    expect(pairRemoteWarning("203.0.113.7", "iphone")).toBe("The request came from outside your network. Only pair an iPhone you expect.");
  });

  it("tells a non-admin that someone else's device needs an administrator, and never to tick Replace", () => {
    const theirs = { kind: "watch", already_paired: true, paired_by_other_user: true, needs_replace: true };
    expect(pairNeedsAdmin(theirs, false)).toBe(true);
    expect(pairNeedsAdmin(theirs, true)).toBe(false);
    expect(pairNeedsAdmin({ already_paired: true }, false)).toBe(false);
    expect(PAIR_OTHER_PERSON_TEXT).toBe("This watch is paired to another person. Only an administrator can replace that pairing.");
    expect(pairLookupWarnings(theirs, false)).toEqual([PAIR_OTHER_PERSON_TEXT]);
    // The admin path is as it was.
    expect(pairLookupWarnings(theirs, true))
      .toEqual(["This watch is already paired. Pairing again gives it a new key.", "This watch was paired by another user."]);
    expect(pairErrorText({ code: "paired_by_other_user", message: "x" }, "confirm")).toBe(PAIR_OTHER_PERSON_TEXT);
    expect(pairErrorText({ code: "paired_by_other_user", message: "x" }, "confirm")).not.toContain("Tick");
  });

  it("offers the link into the app only on an iPhone, which cannot scan its own screen", () => {
    expect(pairOnIPhone("Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) Home Assistant/2026.9")).toBe(true);
    expect(pairOnIPhone("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/140.0")).toBe(false);
    expect(pairOnIPhone("Mozilla/5.0 (iPad; CPU OS 26_0 like Mac OS X)")).toBe(false);
    expect(pairOnIPhone(undefined)).toBe(false);
  });

  it("names the card and its two modes in plain words", () => {
    expect(PAIR_CARD_TITLE).toBe("Pair a device");
    expect(PAIR_MODES).toEqual([["qr", "Show a QR code"], ["code", "Type a code"]]);
    expect(PAIR_SHOW_QR_TEXT).toBe("Show QR code");
    expect(PAIR_OPEN_APP_TEXT).toBe("Pair this iPhone instead");
    expect(PAIR_QR_EXPIRED_TEXT).toBe("This code ran out. Show a new one.");
    const words = [PAIR_CARD_TITLE, PAIR_CODE_HINT, PAIR_QR_HINT, PAIR_QR_REPLACE_LABEL, PAIR_QR_REPLACE_HINT, PAIR_MORE_TEXT, PAIR_REPLACE_LABEL, PAIR_SHOW_QR_TEXT,
      PAIR_OPEN_APP_TEXT, PAIR_QR_EXPIRED_TEXT, PAIR_USER_PLACEHOLDER, pairUserHint("watch"), pairUserHint("iphone"),
      ...PAIR_MODES.map(([, label]) => label),
      pairErrorText({ code: "needs_replace" }, "confirm", "iphone"), pairErrorText({ code: "needs_allow_remote" }, "confirm")];
    for (const w of words) expect(w).not.toMatch(/ \x2d |\u2013|\u2014/);
  });

  it("counts down in minutes and seconds", () => {
    expect(pairCountdownText(300)).toBe("Runs out in 5:00");
    expect(pairCountdownText(299.2)).toBe("Runs out in 5:00");
    expect(pairCountdownText(65)).toBe("Runs out in 1:05");
    expect(pairCountdownText(9)).toBe("Runs out in 0:09");
    expect(pairCountdownText(-4)).toBe("Runs out in 0:00");
  });

  it("sends a user only when it is not the administrator at the card", () => {
    expect(pairUserToSend("chen", "root")).toBe("chen");
    expect(pairUserToSend("root", "root")).toBeUndefined();
    expect(pairUserToSend(undefined, "root")).toBeUndefined();
    expect(pairUserToSend("chen", undefined)).toBe("chen");
  });

  it("asks for a newer integration when the command is unknown, else gives the message", () => {
    expect(pairErrorText({ code: "unknown_command", message: "Unknown command." }, "lookup"))
      .toBe("Update the Wrist Assistant integration to pair a watch with a code.");
    expect(pairErrorText({ code: "unavailable", message: "Integration not ready" }, "lookup"))
      .toBe("Could not look up that code: Integration not ready");
    expect(pairErrorText({ code: "invalid_secret", message: "secret must be 32 bytes" }, "confirm"))
      .toBe("Could not pair: secret must be 32 bytes");
    expect(pairErrorText({ code: "unknown_command", message: "Unknown command." }, "offer"))
      .toBe("Update the Wrist Assistant integration to pair an iPhone with a QR code.");
    expect(pairErrorText({ code: "unavailable", message: "Integration not ready" }, "offer"))
      .toBe("Could not show a QR code: Integration not ready");
  });

  it("says which box to tick when the server refuses a confirm for one", () => {
    expect(pairErrorText({ code: "needs_replace", message: "replace required" }, "confirm"))
      .toBe("This watch is already paired. Tick Replace its pairing to pair it again.");
    expect(pairErrorText({ code: "needs_replace", message: "replace required" }, "confirm", "iphone"))
      .toBe("This iPhone is already paired. Tick Replace its pairing to pair it again.");
    expect(pairErrorText({ code: "needs_allow_remote", message: "allow_remote required" }, "confirm"))
      .toBe("The request came from outside your network. Tick I expect this watch to pair it.");
  });

  it("says when and from where the watch asked", () => {
    expect(pairRequestLine({ age_seconds: 12, remote: "172.16.43.50" })).toBe("Requested 12 s ago from 172.16.43.50");
    expect(pairRequestLine({ age_seconds: 12, remote: null })).toBe("Requested 12 s ago");
    expect(pairRequestLine({ age_seconds: 0, remote: "" })).toBe("Requested 0 s ago");
    expect(pairRequestLine({ age_seconds: 90, remote: null })).toBe("Requested 90 s ago");
    expect(pairRequestLine({ age_seconds: 91, remote: null })).toBe("Requested 1 min ago");
    expect(pairRequestLine({ age_seconds: 150, remote: "10.0.0.4" })).toBe("Requested 2 min ago from 10.0.0.4");
    expect(pairRequestLine({ age_seconds: 599, remote: null })).toBe("Requested 9 min ago");
    expect(pairRequestLine({ age_seconds: -3, remote: null })).toBe("Requested 0 s ago");
    expect(pairRequestLine({ remote: "192.168.1.9" })).toBe("Requested from 192.168.1.9");
    expect(pairRequestLine({})).toBeUndefined();
    expect(pairRequestLine({ remote: null })).toBeUndefined();
  });

  it("tells a home network address from an outside one", () => {
    for (const a of ["10.1.2.3", "172.16.0.1", "172.31.255.254", "192.168.1.1", "127.0.0.1", "::1", "fe80::1",
      "FE80::abcd", "fc00::1", "fd12:3456::1", "::ffff:192.168.1.5", "[fd00::2]"]) {
      expect(isPrivateAddress(a), a).toBe(true);
    }
    for (const a of ["8.8.8.8", "172.15.0.1", "172.32.0.1", "192.169.0.1", "11.0.0.1", "2001:db8::1", "::ffff:8.8.8.8"]) {
      expect(isPrivateAddress(a), a).toBe(false);
    }
  });

  it("warns about a request from outside the network, and says nothing of an unknown one", () => {
    expect(pairRemoteWarning("203.0.113.7")).toBe(PAIR_REMOTE_WARNING_TEXT);
    expect(pairRemoteWarning("2001:db8::1")).toBe(PAIR_REMOTE_WARNING_TEXT);
    expect(pairRemoteWarning("172.16.43.50")).toBeUndefined();
    expect(pairRemoteWarning("fd00::5")).toBeUndefined();
    expect(pairRemoteWarning(null)).toBeUndefined();
    expect(pairRemoteWarning(undefined)).toBeUndefined();
    expect(pairRemoteWarning("")).toBeUndefined();
    expect(PAIR_REMOTE_WARNING_TEXT).toBe("The request came from outside your network. Only pair a watch you expect.");
  });
});

describe("the main house", () => {
  it("takes the settings from another home only on an explicit false", () => {
    expect(takesSettingsFromAnotherHome({ main_house: false })).toBe(true);
    expect(takesSettingsFromAnotherHome({ main_house: true })).toBe(false);
    expect(takesSettingsFromAnotherHome({ main_house: null })).toBe(false);
    // An integration from before the field, and a watch with one home.
    expect(takesSettingsFromAnotherHome({})).toBe(false);
    expect(takesSettingsFromAnotherHome(undefined)).toBe(false);
  });

  it("says where to change them, in plain words", () => {
    expect(SETTINGS_MAIN_HOUSE_TEXT).toBe("This watch takes its settings from your main house. Change them there.");
    expect(SETTINGS_MAIN_HOUSE_TEXT).not.toMatch(/ \x2d |\u2013|\u2014/);
  });
});

// ── the rows that read or write more than their own key ──────────────────

describe("the page title", () => {
  const mode = setting("pageTitleMode");

  it("reads pageTitleMode first, then the older keys as the watch does", () => {
    expect(settingValue(mode, { pageTitleMode: "Auto" })).toBe("Auto");
    expect(settingValue(mode, { pageTitleMode: "Off", showPageTitle: true })).toBe("Off");
    expect(settingValue(mode, {})).toBe("On");
    expect(settingValue(mode, { showPageTitle: false })).toBe("Off");
    expect(settingValue(mode, { showPageTitle: false, pageTitleStyle: "Auto" })).toBe("Off");
    expect(settingValue(mode, { showPageTitle: true, pageTitleStyle: "Auto" })).toBe("Auto");
    expect(settingValue(mode, { pageTitleStyle: "Pill" })).toBe("On");
    // A mode the watch does not know falls back like an absent one.
    expect(settingValue(mode, { pageTitleMode: "Fade", showPageTitle: false })).toBe("Off");
  });

  it("is no change when the old keys already say what is picked", () => {
    expect(withEdit(new Map(), { showPageTitle: false }, mode, "Off").size).toBe(0);
    expect(withEdit(new Map(), { pageTitleStyle: "Auto" }, mode, "Auto").size).toBe(0);
  });

  it("writes the old keys as the app's setPageTitleMode does, so they never disagree", () => {
    const old = { showPageTitle: false, pageTitleStyle: "Auto" };
    expect(buildSaveDocument(old, new Map([["pageTitleMode", "On"]])))
      .toEqual({ pageTitleMode: "On", showPageTitle: true, pageTitleStyle: "Pill" });
    expect(buildSaveDocument({ pageTitleStyle: "Minimal" }, new Map([["pageTitleMode", "On"]])))
      .toEqual({ pageTitleMode: "On", showPageTitle: true, pageTitleStyle: "Minimal" });
    expect(buildSaveDocument({ showPageTitle: true, pageTitleStyle: "Pill" }, new Map([["pageTitleMode", "Auto"]])))
      .toEqual({ pageTitleMode: "Auto", showPageTitle: true, pageTitleStyle: "Auto" });
    expect(buildSaveDocument({ showPageTitle: true, pageTitleStyle: "Pill" }, new Map([["pageTitleMode", "Off"]])))
      .toEqual({ pageTitleMode: "Off", showPageTitle: false, pageTitleStyle: "Pill" });
    // Untouched, the old keys go back as they came.
    expect(buildSaveDocument(old, new Map([["wrapPages", true]]))).toEqual({ ...old, wrapPages: true });
  });
});

describe("the top double-tap and the old room quick jump", () => {
  const top = setting("topSectionDoubleTapAction");

  it("shows Room jump for a document with only the old switch on, as the watch reads it", () => {
    expect(settingValue(top, { roomQuickJumpEnabled: true })).toBe("Room Jump");
    expect(settingValue(top, { roomQuickJumpEnabled: false })).toBe("Disabled");
    expect(settingValue(top, { topSectionDoubleTapAction: "Refresh", roomQuickJumpEnabled: true })).toBe("Refresh");
  });

  it("turns the old switch off when Disabled or Switch house is picked over it", () => {
    const doc = { roomQuickJumpEnabled: true };
    const edits = withEdit(new Map(), doc, top, "Disabled");
    expect([...edits]).toEqual([["topSectionDoubleTapAction", "Disabled"]]);
    expect(buildSaveDocument(doc, edits)).toEqual({ topSectionDoubleTapAction: "Disabled", roomQuickJumpEnabled: false });
    expect(buildSaveDocument(doc, new Map([["topSectionDoubleTapAction", "Switch Instance"]])))
      .toEqual({ topSectionDoubleTapAction: "Switch Instance", roomQuickJumpEnabled: false });
  });
});

describe("Switch house", () => {
  it("is offered on both gestures under the watch's value, and says it needs two homes", () => {
    for (const key of ["topSectionDoubleTapAction", "handGestureAction"]) {
      const s = setting(key);
      expect(s.options!.find((o) => o.value === "Switch Instance")?.label, key).toBe("Switch house");
      expect(s.help, key).toContain("two or more homes");
    }
  });
});

describe("the double pinch, shared with Rooms", () => {
  const hand = setting("handGestureAction");

  it("reads Refresh for an absent key, as the watch and Rooms do", () => {
    expect(settingValue(hand, {})).toBe("Refresh");
    expect(watchBehaviorDefaults().handGestureAction).toBe("Refresh");
  });

  it("shows a Room jump picked in Rooms, and Rooms shows one picked here", () => {
    const doc: Record<string, unknown> = { handGestureAction: "Refresh" };
    const fromRooms = applyRoomEdits(doc, withRoomWrites(doc, new Map(), triggerWrites(doc, "Double Pinch")));
    expect(settingValue(hand, fromRooms)).toBe("Room Jump");
    const fromHere = buildSaveDocument(doc, withEdit(new Map(), doc, hand, "Room Jump"));
    expect(roomSwitchTrigger(fromHere)).toBe("Double Pinch");
  });

  it("keeps an action picked here when Rooms changes its room switching", () => {
    const doc = buildSaveDocument({}, withEdit(new Map(), {}, hand, "Next Page"));
    for (const writes of [switchingWritesFor(doc, true), switchingWritesFor(doc, false), triggerWrites(doc, "Automatic"), triggerWrites(doc, "Double-Tap Top")]) {
      const out = applyRoomEdits(doc, withRoomWrites(doc, new Map(), writes));
      expect(out.handGestureAction).toBe("Next Page");
    }
    // Rooms only takes back a Room jump of its own.
    const jump = { handGestureAction: "Room Jump" };
    const off = applyRoomEdits(jump, withRoomWrites(jump, new Map(), triggerWrites(jump, "Automatic")));
    expect(off.handGestureAction).toBe("Refresh");
  });

  it("removes a target left empty and shows its row only for its action", () => {
    expect(buildSaveDocument({ handGestureSceneTargetId: "scene.a" }, new Map([["handGestureSceneTargetId", ""]]))).toEqual({});
    expect(isShown(setting("handGestureSceneTargetId"), formValues({ handGestureAction: "Activate Scene" }))).toBe(true);
    expect(isShown(setting("handGestureScriptTargetId"), formValues({ handGestureAction: "Activate Scene" }))).toBe(false);
  });
});

describe("the domains that skip the bounce", () => {
  const domains = setting("pendingAnimationDisabledDomains");

  it("reads a stored list sorted and once each, and an absent one as none skipped", () => {
    expect(settingValue(domains, { pendingAnimationDisabledDomains: ["light", "fan", "light"] })).toEqual(["fan", "light"]);
    expect(settingValue(domains, {})).toEqual([]);
    expect(settingValue(domains, { pendingAnimationDisabledDomains: "light" })).toEqual([]);
    expect(domainList(["b", "a", 3, "a"])).toEqual(["a", "b"]);
  });

  it("starts a new watch with the app's fresh install list", () => {
    expect(domains.initial).toEqual(["automation", "fan", "input_boolean", "input_number", "input_select", "light", "media_player", "switch", "timer"]);
  });

  it("is shown under Pending animation only while it is on", () => {
    expect(isShown(domains, formValues({}))).toBe(true);
    expect(isShown(domains, formValues({ showPendingAnimation: false }))).toBe(false);
    const interaction = WATCH_SETTINGS_CATALOG.sections.find((s) => s.id === "interaction")!;
    const run = sectionRuns(interaction, formValues({})).find((r) => r.setting.key === "showPendingAnimation")!;
    expect(run.dependents.map((s) => s.key)).toEqual(["pendingAnimationDisabledDomains"]);
  });

  it("keeps the list sorted, counts the same list in another order as no change, and saves it sorted", () => {
    const doc = { pendingAnimationDisabledDomains: ["fan", "light"] };
    expect(withEdit(new Map(), doc, domains, ["light", "fan"]).size).toBe(0);
    const edits = withEdit(new Map(), doc, domains, ["light", "fan", "lock"]);
    expect(edits.get("pendingAnimationDisabledDomains")).toEqual(["fan", "light", "lock"]);
    expect(dirtyKeys(doc, edits)).toEqual(["pendingAnimationDisabledDomains"]);
    expect(buildSaveDocument(doc, edits)).toEqual({ pendingAnimationDisabledDomains: ["fan", "light", "lock"] });
  });

  it("removes the key when every type bounces, as the phone's encoder did", () => {
    const doc = { pendingAnimationDisabledDomains: ["fan"], wrapPages: true };
    expect(buildSaveDocument(doc, withEdit(new Map(), doc, domains, []))).toEqual({ wrapPages: true });
  });
});

describe("the wrist twists", () => {
  const strength = setting("motionGestureSensitivity");
  const level = setting("motionGestureSensitivityLevel");
  const twists = setting("motionGestureActionsJSON");
  const CW = "Twist Clockwise";
  const CCW = "Twist Counter-Clockwise";

  it("names the watch's two gestures and the phone's eight actions", () => {
    expect(twists.gestures!.map((g) => g.value)).toEqual([CW, CCW]);
    expect(twists.options!.map((o) => o.value)).toEqual([
      "Disabled", "Toggle Aimed Entity", "Run Script", "Activate Scene", "Refresh", "Next Page", "Previous Page", "Toggle First Tile",
    ]);
    expect([twists.sceneKey, twists.scriptKey]).toEqual(["motionGestureSceneTargetsJSON", "motionGestureScriptTargetsJSON"]);
  });

  it("decodes a string as the watch does: an object of strings, else nothing", () => {
    expect(decodeMotionMap('{"Twist Clockwise":"Next Page"}')).toEqual({ [CW]: "Next Page" });
    expect(decodeMotionMap('{"Twist Clockwise":"scene.a\\/b"}')).toEqual({ [CW]: "scene.a/b" });
    expect(decodeMotionMap('{"Twist Clockwise":1}')).toEqual({});
    expect(decodeMotionMap('["Next Page"]')).toEqual({});
    expect(decodeMotionMap("null")).toEqual({});
    expect(decodeMotionMap("not json")).toEqual({});
    expect(decodeMotionMap("")).toEqual({});
    expect(decodeMotionMap(undefined)).toEqual({});
    expect(decodeMotionMap({ [CW]: "Refresh" })).toEqual({});
  });

  it("encodes as the phone's JSONSerialization did: no spaces, keys sorted, / escaped", () => {
    expect(encodeMotionMap({ [CW]: "Next Page", [CCW]: "Refresh" })).toBe('{"Twist Clockwise":"Next Page","Twist Counter-Clockwise":"Refresh"}');
    expect(encodeMotionMap({ [CW]: "scene.a/b" })).toBe('{"Twist Clockwise":"scene.a\\/b"}');
    expect(decodeMotionMap(encodeMotionMap({ [CW]: "scene.a/b" }))).toEqual({ [CW]: "scene.a/b" });
  });

  it("reads the three strings, the phone's old aimed action under its new name", () => {
    const doc = {
      motionGestureActionsJSON: '{"Twist Clockwise":"Point Control Toggle","Twist Counter-Clockwise":"Activate Scene"}',
      motionGestureSceneTargetsJSON: '{"Twist Counter-Clockwise":"scene.evening"}',
      motionGestureScriptTargetsJSON: "{}",
    };
    const value = readMotionActions(twists, doc);
    expect(value).toEqual({
      actions: { [CW]: "Toggle Aimed Entity", [CCW]: "Activate Scene" },
      scenes: { [CCW]: "scene.evening" },
      scripts: {},
    });
    expect(settingValue(twists, doc)).toEqual(value);
    expect(motionAction(readMotionActions(twists, {}), CW)).toBe("Disabled");
  });

  it("is hidden, with the fine tune, while twists are off", () => {
    expect(settingValue(strength, {})).toBe("Off");
    expect(settingValue(level, {})).toBe(4);
    for (const s of [level, twists]) {
      expect(isShown(s, formValues({})), s.key).toBe(false);
      expect(isShown(s, formValues({ motionGestureSensitivity: "Low" })), s.key).toBe(true);
    }
    const motion = WATCH_SETTINGS_CATALOG.sections.find((s) => s.id === "motion")!;
    const runs = sectionRuns(motion, formValues({ motionGestureSensitivity: "High" }));
    expect(runs.map((r) => [r.setting.key, r.dependents.map((d) => d.key)])).toEqual([
      ["motionGestureSensitivity", ["motionGestureSensitivityLevel", "motionGestureActionsJSON"]],
    ]);
  });

  it("sets the fine tune when a strength is picked, and the strength when the fine tune moves", () => {
    expect(TWIST_LEVELS).toEqual({ Low: 4, Medium: 6, High: 8 });
    expect([1, 4.5, 5, 6.5, 7, 10].map(twistStrength)).toEqual(["Low", "Low", "Medium", "Medium", "High", "High"]);
    const doc = { motionGestureSensitivity: "Off", motionGestureSensitivityLevel: 4 };
    const high = withEdit(new Map(), doc, strength, "High");
    expect([...high]).toEqual([["motionGestureSensitivity", "High"], ["motionGestureSensitivityLevel", 8]]);
    // Low's level is already stored: only the strength changes.
    expect([...withEdit(new Map(), doc, strength, "Low")]).toEqual([["motionGestureSensitivity", "Low"]]);
    const fine = withEdit(high, doc, level, 5.5);
    expect(fine.get("motionGestureSensitivity")).toBe("Medium");
    expect(fine.get("motionGestureSensitivityLevel")).toBe(5.5);
    // Off leaves the fine tune where it was.
    const on = { motionGestureSensitivity: "High", motionGestureSensitivityLevel: 8 };
    expect([...withEdit(new Map(), on, strength, "Off")]).toEqual([["motionGestureSensitivity", "Off"]]);
    expect(buildSaveDocument(doc, fine)).toEqual({ motionGestureSensitivity: "Medium", motionGestureSensitivityLevel: 5.5 });
  });

  it("picks an action and a target per gesture, an empty target removing it", () => {
    let value = readMotionActions(twists, {});
    value = withMotionAction(value, CW, "Activate Scene");
    value = withMotionTarget(value, "scenes", CW, " scene.evening ");
    expect(value).toEqual({ actions: { [CW]: "Activate Scene" }, scenes: { [CW]: "scene.evening" }, scripts: {} });
    // Another action keeps the target, as the phone did.
    value = withMotionAction(value, CW, "Refresh");
    expect(value.scenes).toEqual({ [CW]: "scene.evening" });
    expect(withMotionTarget(value, "scenes", CW, "").scenes).toEqual({});
  });

  it("writes only the strings that changed, an emptied one as no key, and leaves the rest as read", () => {
    const doc = {
      motionGestureActionsJSON: '{"Twist Clockwise": "Next Page"}',
      motionGestureSceneTargetsJSON: '{"Twist Clockwise":"scene.a"}',
      motionGestureScriptTargetsJSON: "{ }",
      motionGestureSensitivity: "Medium",
    };
    const read = readMotionActions(twists, doc);
    expect(withEdit(new Map(), doc, twists, read).size).toBe(0);
    // A new action: only the actions string is written.
    const acted = withEdit(new Map(), doc, twists, withMotionAction(read, CCW, "Run Script"));
    expect(buildSaveDocument(doc, acted)).toEqual({
      ...doc,
      motionGestureActionsJSON: '{"Twist Clockwise":"Next Page","Twist Counter-Clockwise":"Run Script"}',
    });
    // The last scene removed: the scenes key goes, the others stay as read.
    const cleared = withEdit(new Map(), doc, twists, withMotionTarget(read, "scenes", CW, ""));
    const out = buildSaveDocument(doc, cleared);
    expect(out).not.toHaveProperty("motionGestureSceneTargetsJSON");
    expect(out.motionGestureActionsJSON).toBe(doc.motionGestureActionsJSON);
    expect(out.motionGestureScriptTargetsJSON).toBe("{ }");
    expect(Object.values(out)).not.toContain(null);
  });

  it("compares the row by what it holds", () => {
    expect(sameValue({ actions: { a: "1", b: "2" }, scenes: {}, scripts: {} }, { actions: { b: "2", a: "1" }, scenes: {}, scripts: {} })).toBe(true);
    expect(sameValue({ actions: { a: "1" }, scenes: {}, scripts: {} }, { actions: {}, scenes: {}, scripts: {} })).toBe(false);
    expect(sameValue(["a"], ["a"])).toBe(true);
    expect(sameValue(4, 4)).toBe(true);
    expect(sameValue("4", 4)).toBe(false);
  });

  it("starts a new watch with twists off at the app's level and no actions", () => {
    const doc = watchBehaviorDefaults();
    expect(doc.motionGestureSensitivity).toBe("Off");
    expect(doc.motionGestureSensitivityLevel).toBe(4);
    for (const key of ["motionGestureActionsJSON", "motionGestureSceneTargetsJSON", "motionGestureScriptTargetsJSON"]) {
      expect(Object.hasOwn(doc, key), key).toBe(false);
    }
  });
});

describe("the point control overlay", () => {
  it("is a switch here, off when absent, and not one Rooms draws", () => {
    const hud = setting("pointControlShowHUD");
    expect(hud.type).toBe("bool");
    expect(settingValue(hud, {})).toBe(false);
    expect(buildSaveDocument({ pointControlTapToToggle: true }, new Map([["pointControlShowHUD", true]])))
      .toEqual({ pointControlTapToToggle: true, pointControlShowHUD: true });
  });
});
