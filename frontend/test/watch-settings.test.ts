// The Watch settings view's catalog and its three write rules: an absent key
// is the default and stays absent unless changed, a key the panel does not
// show goes back exactly as it came, and nothing is written as null. The app
// repo checks the same catalog against the Swift types; this checks that the
// file holds together on its own.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
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
  conflictRevision,
  createWatchBehavior,
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
  pairLookupLine,
  pairLookupWarnings,
  pairRemoteWarning,
  pairRequestLine,
  PAIR_USER_TITLE,
  pairDefaultUser,
  pairUserChoices,
  pairUserToSend,
  pairedText,
  savedByWords,
  sectionRuns,
  settingValue,
  settingsWatches,
  takesSettingsFromAnotherHome,
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
    expect(PAIR_FIRST_TEXT).toBe("Pair this watch first. Watch settings has Pair a watch.");
    expect(SETTINGS_PAIR_FIRST_TEXT).toBe("Pair this watch first, under Pair a watch on this page.");
    expect(PAGES_START_CONFLICT_TEXT).toBe("The iPhone sent pages meanwhile, so those are shown.");
    expect(SETTINGS_START_CONFLICT_TEXT).toBe("The iPhone sent settings meanwhile, so those are shown.");
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
    expect(COLLECTED_PILL_TEXT).toBe("Collected");
    expect(WAITING_HELP_TEXT).toBe("The watch picks it up the next time it checks, or the iPhone passes it on.");
  });
});

describe("Start with the defaults", () => {
  const refusal = (code: string, message = code) => Object.assign(new Error(message), { code });

  it("builds every catalog setting at its default, schema 1, keys sorted", () => {
    const doc = watchBehaviorDefaults();
    expect(doc.schemaVersion).toBe(BEHAVIOR_SCHEMA_VERSION);
    expect(BEHAVIOR_SCHEMA_VERSION).toBe(1);
    for (const setting of catalogSettings()) {
      if (setting.type === "entity" && setting.default === "") expect(Object.hasOwn(doc, setting.key), setting.key).toBe(false);
      else expect(doc[setting.key], setting.key).toEqual(setting.default);
    }
    const keys = Object.keys(doc);
    expect(keys).toEqual([...keys].sort());
    expect(Object.values(doc)).not.toContain(null);
    // Every value reads back as itself: nothing in the form differs from the
    // defaults, so the new record opens with no edits.
    const values = formValues(doc);
    for (const setting of catalogSettings()) expect(values.get(setting.key), setting.key).toBe(setting.default);
  });

  it("carries the keys the app cannot decode without, at the app's own defaults", () => {
    const doc = watchBehaviorDefaults();
    // The fields of `WCBehaviorPreferences` that are not optional in Swift.
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
  });

  const USERS = [
    { id: "sup", name: "Supervisor", is_active: true, system_generated: true },
    { id: "pat", name: "Pat", is_active: true, system_generated: false },
    { id: "root", name: "Jesse", is_active: true, system_generated: false },
    { id: "old", name: "Old Account", is_active: false, system_generated: false },
    { id: "chen", name: "Chen", is_active: true, system_generated: false },
    { id: "nameless", name: " ", username: "guest", is_active: true },
  ];

  it("offers active people only, the administrator first, then the rest by name", () => {
    expect(pairUserChoices(USERS, "root")).toEqual([
      { id: "root", label: "Jesse (you)" },
      { id: "chen", label: "Chen" },
      { id: "nameless", label: "guest" },
      { id: "pat", label: "Pat" },
    ]);
    // An administrator missing from the list is no reason to offer nobody.
    expect(pairUserChoices(USERS, "gone").map((c) => c.id)).toEqual(["chen", "nameless", "root", "pat"]);
    expect(PAIR_USER_TITLE).toBe("Whose watch is this?");
  });

  it("starts on the user a known watch is bound to, else the administrator", () => {
    const choices = pairUserChoices(USERS, "root");
    expect(pairDefaultUser(choices, "root", null)).toBe("root");
    expect(pairDefaultUser(choices, "root", undefined)).toBe("root");
    expect(pairDefaultUser(choices, "root", "chen")).toBe("chen");
    // Bound to someone no longer offered (deactivated): the administrator.
    expect(pairDefaultUser(choices, "root", "old")).toBe("root");
    expect(pairDefaultUser(pairUserChoices(USERS, "gone"), "gone", null)).toBe("chen");
    expect(pairDefaultUser([], "root", null)).toBeUndefined();
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
