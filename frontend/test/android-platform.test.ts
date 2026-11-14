// Android phones and Wear OS watches in the panel. An Android phone pairs as
// the `iphone` kind and a Wear OS watch as the `watch` kind, and the owner row
// says what each runs (`platform`, `device-platform.ts`). Every Apple device
// reads as before; these hold the four places the platform changes: the
// device's noun and model, the version gates (an Android device gets the
// current feature set), the round Wear OS watch and the Android phone in the
// previews, and the settings an Android device reads.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { html } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  ANDROID_FEATURE_VERSION,
  PLAY_STORE_URL,
  gateVersion,
  nounFor,
  ownerIsAndroid,
  platformModel,
  platformOf,
  setAndroidHere,
} from "../src/device-platform.js";
import type { OwnerSummary } from "../src/ha-api.js";
import { deviceFacts } from "../src/home.js";
import { pairFoundLines, pairFoundTitle, pairGoLabel } from "../src/pair-flow.js";
import { ownerGroups, ownerLabel } from "../src/panel.js";
import {
  DEFAULT_ANDROID_PHONE,
  DEFAULT_PHONE,
  isAndroidPhoneModel,
  phoneModelForScreenSize,
  phonePagesLayout,
  phoneSizeText,
  renderPhoneFrame,
} from "../src/phone-frame.js";
import { CASES, REFERENCE_CASE, WEAR_CASES, caseForScreenSize, watchCasesFor } from "../src/renderer.js";
import {
  MIN_VERSION_FOR_ONE_LOOK,
  deviceNoun,
  deviceSupportsShapes,
  oneLookFor,
  ownerSupportsControls,
  setupMoveNeedsUpdate,
  updateDeviceMessage,
} from "../src/version.js";
import { renderWatchFrame } from "../src/watch-frame.js";
import { catalogFor, deviceNoun as settingNoun, noRecordTitle, pairLookupLine, pairUserTitle, settingsTitle } from "../src/watch-settings.js";
import { thisDeviceNote, thisDeviceTitle } from "../src/watch-this-device.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const owner = (over: Partial<OwnerSummary> = {}): OwnerSummary => ({
  owner_watch_id: "w1",
  device_name: "Apple Watch",
  paired_iphone_name: null,
  app_version: "3.2.0",
  screen_size: null,
  complication_count: 0,
  token: 1,
  is_orphan: false,
  ...over,
});

const PIXEL = owner({ owner_watch_id: "p1", device_kind: "iphone", platform: "android", device_name: "Pixel 9", app_version: "0.1.0" });
const WEAR = owner({ owner_watch_id: "w2", device_kind: "watch", platform: "wearos", device_name: "Pixel Watch 3", app_version: "0.1.0", screen_size: "227x227" });
const IPHONE = owner({ owner_watch_id: "p2", device_kind: "iphone", device_name: "Jesse's iPhone" });
const APPLE_WATCH = owner({ device_kind: "watch" });


// These homes have an Android device paired, so general copy says phone and
// watch (`generalCopy`); `general-copy.test.ts` covers an Apple only home.
beforeEach(() => setAndroidHere(true));
afterEach(() => setAndroidHere(false));

describe("the platform of an owner row", () => {
  it("is the one it names when that fits the kind, else the kind's Apple one", () => {
    expect(platformOf(PIXEL)).toBe("android");
    expect(platformOf(WEAR)).toBe("wearos");
    expect(platformOf(IPHONE)).toBe("ios");
    expect(platformOf(APPLE_WATCH)).toBe("watchos");
    // An older integration's row names none.
    expect(platformOf({ device_kind: "iphone" })).toBe("ios");
    expect(platformOf({})).toBe("watchos");
    // A watch never reads as a phone.
    expect(platformOf({ device_kind: "watch", platform: "android" })).toBe("watchos");
    expect(ownerIsAndroid(WEAR)).toBe(true);
    expect(ownerIsAndroid(APPLE_WATCH)).toBe(false);
  });

  it("names each device by its platform", () => {
    expect(deviceNoun(PIXEL)).toBe("phone");
    expect(deviceNoun(IPHONE)).toBe("iPhone");
    expect(deviceNoun(WEAR)).toBe("watch");
    expect(platformModel("wearos")).toBe("Wear OS watch");
    expect(platformModel("android")).toBe("Android phone");
    expect(nounFor("iphone", "android")).toBe("phone");
    expect(settingNoun("iphone", "android")).toBe("phone");
    expect(settingNoun("iphone")).toBe("iPhone");
    expect(noRecordTitle("menus", "iphone", "android")).toBe("No menus on this phone yet.");
    expect(noRecordTitle("menus", "iphone")).toBe("No menus on this iPhone yet.");
    expect(settingsTitle("iphone", "android")).toBe("Phone settings");
    expect(settingsTitle("iphone")).toBe("iPhone settings");
    expect(thisDeviceTitle("iphone", "android")).toBe("This phone");
    expect(thisDeviceTitle("iphone")).toBe("This iPhone");
    expect(thisDeviceNote("iphone", "android")).toContain("If this phone stops connecting");
  });

  it("names the device in its facts, its labels and the device groups", () => {
    expect(deviceFacts(WEAR, "watch")[0]).toBe("Wear OS watch");
    expect(deviceFacts(PIXEL, "iphone")[0]).toBe("Android phone");
    expect(deviceFacts(APPLE_WATCH, "watch")[0]).toBe("Apple Watch");
    expect(deviceFacts(IPHONE, "iphone")[0]).toBe("iPhone");
    expect(ownerLabel(PIXEL)).toBe("Pixel 9 (phone)");
    expect(ownerLabel(IPHONE)).toBe("Jesse's iPhone");
    expect(ownerGroups([APPLE_WATCH, IPHONE]).map((g) => g.label)).toEqual(["Watch", "iPhone"]);
    expect(ownerGroups([WEAR, PIXEL, IPHONE]).map((g) => g.label)).toEqual(["Watch", "Phones"]);
  });
});

describe("pairing an Android device", () => {
  it("asks about the phone or the watch by what it runs", () => {
    expect(pairFoundTitle("iphone", "android")).toBe("Is this your phone?");
    expect(pairFoundTitle("iphone")).toBe("Is this your iPhone?");
    expect(pairFoundTitle("watch", "wearos")).toBe("Is this your watch?");
    expect(pairGoLabel("iphone", "android")).toBe("Pair this phone");
    expect(pairGoLabel("iphone")).toBe("Pair this iPhone");
    expect(pairFoundLines({ kind: "watch", platform: "wearos" }).name).toBe("Wear OS watch");
    expect(pairFoundLines({ kind: "watch" }).name).toBe("Apple Watch");
    expect(pairLookupLine({ kind: "iphone", platform: "android", app_version: "0.1.0" })).toBe("Android phone, app 0.1.0");
    expect(pairUserTitle("iphone", "android")).toBe("Whose phone is this?");
    expect(pairUserTitle("iphone", "any")).toBe("Whose phone is this?");
    expect(pairUserTitle("iphone")).toBe("Whose iPhone is this?");
  });

  it("links Google Play beside the App Store where the app is offered", () => {
    expect(PLAY_STORE_URL).toBe("https://play.google.com/store/apps/details?id=com.wristassistant.android");
    const panel = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");
    const welcome = panel.slice(panel.indexOf('step(1, "Install the app"'), panel.indexOf('step(2, "Pick one"'));
    expect(welcome).toContain("href=${APP_STORE_URL}");
    expect(welcome).toContain("href=${PLAY_STORE_URL}");
    expect(welcome).toContain("QR code for the Google Play page");
    const help = readFileSync(join(__dirname, "..", "src", "help-sheet.ts"), "utf8");
    expect(help).toContain("href=${PLAY_STORE_URL}");
    expect(panel).toContain(`"Pair a watch with a code, a phone with a QR code"`);
  });
});

describe("the version gates on an Android device", () => {
  it("read the current feature set, not the version the app reports", () => {
    expect(gateVersion(PIXEL)).toBe(ANDROID_FEATURE_VERSION);
    expect(gateVersion(WEAR)).toBe(ANDROID_FEATURE_VERSION);
    expect(gateVersion(APPLE_WATCH)).toBe("3.2.0");
    expect(gateVersion(owner({ app_version: "2.7.0" }))).toBe("2.7.0");
    // 0.1.0 would close the editor on an Apple device; on Android it opens.
    expect(deviceSupportsShapes(owner({ app_version: "0.1.0" }))).toBe(false);
    expect(deviceSupportsShapes(WEAR)).toBe(true);
    expect(deviceSupportsShapes(PIXEL)).toBe(true);
    expect(ownerSupportsControls(WEAR)).toBe(true);
    expect(updateDeviceMessage(WEAR)).not.toContain("0.1.0");
    expect(MIN_VERSION_FOR_ONE_LOOK).not.toBeNull();
    expect(oneLookFor(gateVersion(WEAR))).toBe(true);
    expect(oneLookFor("0.1.0")).toBe(false);
    expect(setupMoveNeedsUpdate(gateVersion(PIXEL))).toBe(false);
  });
});

describe("a round Wear OS watch in the previews", () => {
  it("is found by its square screen in dp, the nearest round case standing in", () => {
    expect(caseForScreenSize("227x227")?.label).toBe("Wear OS large round");
    expect(caseForScreenSize("192x192")?.label).toBe("Wear OS small round");
    expect(caseForScreenSize("198x198")?.label).toBe("Wear OS small round");
    expect(caseForScreenSize("240x240")?.label).toBe("Wear OS large round");
    expect(caseForScreenSize("227x227")?.screen.round).toBe(true);
    // Every Apple size is as it was, and nothing Apple is round.
    expect(caseForScreenSize("208x248")).toBe(REFERENCE_CASE);
    expect(CASES.every((c) => c.screen.round !== true)).toBe(true);
    expect(watchCasesFor("wearos")).toBe(WEAR_CASES);
    expect(watchCasesFor("watchos")).toBe(CASES);
    expect(watchCasesFor(undefined)).toBe(CASES);
  });

  it("draws a round case around a round screen, and the Apple case as it was", () => {
    const wear = flat(renderWatchFrame(WEAR_CASES[1]!.screen, 1, html`<div></div>`, "Pixel Watch"));
    expect(wear).toContain(`class="wa-watch round"`);
    // A circle: corners half the screen's width.
    expect(wear).toContain("--wf-radius:114px");
    const apple = flat(renderWatchFrame(REFERENCE_CASE.screen, 1, html`<div></div>`));
    expect(apple).toContain(`class="wa-watch"`);
    expect(apple).not.toContain("round");
  });
});

describe("an Android phone in the previews", () => {
  it("is drawn as a generic Android phone, an iPhone as before", () => {
    expect(phoneModelForScreenSize(undefined, "android")).toBe(DEFAULT_ANDROID_PHONE);
    expect(phoneModelForScreenSize("360x800", "android").label).toBe("Android phone (small)");
    expect(phoneModelForScreenSize(undefined)).toBe(DEFAULT_PHONE);
    expect(phoneModelForScreenSize(undefined, "ios")).toBe(DEFAULT_PHONE);
    expect(isAndroidPhoneModel(DEFAULT_ANDROID_PHONE)).toBe(true);
    expect(isAndroidPhoneModel(DEFAULT_PHONE)).toBe(false);
    expect(phoneSizeText(DEFAULT_ANDROID_PHONE)).toContain("Android phone");
    expect(phoneSizeText(DEFAULT_PHONE)).toContain("iPhone");
  });

  it("has a punch hole camera and no Dynamic Island", () => {
    const android = flat(renderPhoneFrame(phonePagesLayout(DEFAULT_ANDROID_PHONE), 1, html`<div></div>`));
    expect(android).toContain("wa-phone-punch");
    expect(android).not.toContain("wa-phone-island");
    expect(android).toContain(" android");
    expect(android).toContain("aria-label=Android phone");
    const iphone = flat(renderPhoneFrame(phonePagesLayout(DEFAULT_PHONE), 1, html`<div></div>`));
    expect(iphone).toContain("wa-phone-island");
    expect(iphone).not.toContain("wa-phone-punch");
    expect(iphone).toContain("aria-label=iPhone");
  });
});

describe("the settings an Android device reads", () => {
  const keys = (sections: ReturnType<typeof catalogFor>) => sections.flatMap((s) => s.settings.map((x) => x.key));

  it("on a Wear OS watch: every watch row but the double pinch, the crown's as the rotary input", () => {
    const wear = catalogFor("watch", undefined, "wearos");
    const apple = catalogFor("watch");
    expect(keys(wear)).not.toContain("handGestureAction");
    expect(keys(wear)).not.toContain("handGestureSceneTargetId");
    expect(keys(apple)).toContain("handGestureAction");
    expect(keys(apple).filter((k) => !k.startsWith("handGesture"))).toEqual(keys(wear));
    const crown = wear.flatMap((s) => s.settings).find((s) => s.key === "sliderCrownSensitivity")!;
    expect(crown.label).toBe("Rotary speed");
    expect(crown.help).toContain("bezel");
    const appleCrown = apple.flatMap((s) => s.settings).find((s) => s.key === "sliderCrownSensitivity")!;
    expect(appleCrown.label).toBe("Digital Crown speed");
  });

  it("on an Android phone: every iPhone row but the Page look", () => {
    const android = keys(catalogFor("iphone", undefined, "android"));
    const iphone = keys(catalogFor("iphone"));
    expect(iphone).toContain("phonePageLook");
    expect(android).not.toContain("phonePageLook");
    expect(iphone.filter((k) => k !== "phonePageLook")).toEqual(android);
  });
});
