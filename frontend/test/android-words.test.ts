// The panel's words about a device on an Android phone or a Wear OS watch.
//
// A line about the device on show names it by what it runs (`device-platform.ts`):
// "iPhone" for an iPhone, "phone" for an Android phone, "watch" for either
// watch. Every Apple device keeps the words it had, so each case below checks
// the Apple line too. General copy says phone and watch, and an Apple only
// feature (Lock Screen, Siri, Control Center) says so.

import { describe, expect, it } from "vitest";

import { addressHint, addressesHelp, addressesSavedNote } from "../src/device-addresses.js";
import type { OwnerSummary } from "../src/ha-api.js";
import { NEW_ANDROID_PHONE_STATUS, NEW_IPHONE_STATUS, renderHeadStatus } from "../src/head-bar.js";
import { attentionText, homeDeviceRows, homeDevices } from "../src/home.js";
import { syncText } from "../src/library/on-each-device.js";
import { fullForShapeText } from "../src/panel.js";
import type { Person } from "../src/people.js";
import { deviceShortName } from "../src/people.js";
import { rowWhoText } from "../src/pickerRows.js";
import {
  ANDROID_WIDGET_STEP,
  NOT_ON_A_DEVICE_LINE,
  WEAR_FACE_STEP,
  afterSaveLine,
  describeSend,
  howItWorksSteps,
  onTheFaceStep,
  sendState,
} from "../src/send-state.js";
import { screenOnlyText, screenStatus, screenMoveToastText, screenTitleWord, screenWord, tileOnChipTitle } from "../src/watch-pages/device-differences.js";
import { deviceWord, linkDevicesOf } from "../src/watch-pages/devices.js";
import { copyNameFor } from "../src/watch-pages/make-copy.js";
import { wearWords } from "../src/watch-pages/app-settings.js";
import type { WatchPage } from "../src/watch-pages/model.js";
import { rejectedSaveText } from "../src/watch-app-sync.js";
import {
  PAIR_OPEN_ANDROID_APP_TEXT,
  PAIR_OPEN_APP_TEXT,
  PAIR_QR_REPLACE_HINT,
  PAIR_QR_REPLACE_LABEL,
  catalogFor,
  newDeviceText,
  pairErrorText,
  pairExpectLabel,
  pairOnAndroidPhone,
  pairOpenAppText,
  pairRemoteWarning,
} from "../src/watch-settings.js";
import { HOME_ROOMS_ANDROID_TEXT, HOME_ROOMS_MAIN_HOUSE_TEXT, HOME_ROOMS_MAIN_HOUSE_WEAR_TEXT, HOME_ROOMS_PHONE_TEXT } from "../src/watch-rooms/model.js";

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

const PIXEL = owner({ owner_watch_id: "p1", device_kind: "iphone", platform: "android", device_name: "Pixel 9", app_version: "0.1.0", phone_pages: true });
const WEAR = owner({ owner_watch_id: "w2", device_kind: "watch", platform: "wearos", device_name: "Pixel Watch 3", app_version: "0.1.0" });
const IPHONE = owner({ owner_watch_id: "p2", device_kind: "iphone", device_name: "Jesse's iPhone", phone_pages: true });
const APPLE_WATCH = owner({ device_kind: "watch" });

const phoneSend = { token: 3, appliedToken: 3, polling: false, pending: false, deviceKind: "iphone" as const, pushAvailable: true };

describe("a design's sync words on an Android phone", () => {
  it("say phone and Android's widgets, and an iPhone keeps its iOS words", () => {
    const apple = describeSend(sendState(phoneSend));
    expect(apple.label).toBe("On iPhone");
    expect(apple.title).toContain("iOS redraws the widget when it allows");
    const android = describeSend(sendState({ ...phoneSend, platform: "android" }));
    expect(android.label).toBe("On phone");
    expect(android.title).toBe("This phone has applied every change here. A save sends it a push, and it syncs and redraws its widgets in the background.");
    expect(android.refresh).toBe(true);
    expect(android.title).not.toMatch(/iPhone|iOS/);
  });

  it("name the phone while a push waits, and before it has a token", () => {
    const waiting = { ...phoneSend, appliedToken: 2 };
    expect(describeSend(sendState({ ...waiting, platform: "android" })).title).toContain("the phone has not confirmed");
    expect(describeSend(sendState(waiting)).title).toContain("the iPhone has not confirmed");
    const noToken = { ...waiting, pushAvailable: false };
    expect(describeSend(sendState({ ...noToken, platform: "android" })).label).toBe("Open Wrist Assistant on your phone to sync");
    expect(describeSend(sendState(noToken)).label).toBe("Open Wrist Assistant on your iPhone to sync");
    expect(afterSaveLine(sendState({ ...noToken, platform: "android" }))?.text).toBe("Saved. Open Wrist Assistant on your phone to get it.");
    expect(afterSaveLine(sendState(noToken))?.text).toBe("Saved. Open Wrist Assistant on your iPhone to get it.");
  });

  it("leave a watch's states alone, whatever it runs", () => {
    const watch = { token: 3, appliedToken: 3, polling: true, pending: false };
    expect(sendState({ ...watch, platform: "wearos" })).toEqual(sendState(watch));
  });

  it("tell each device how to put a design on, and a design on no device says phone", () => {
    expect(onTheFaceStep("watch", "wearos")).toBe(WEAR_FACE_STEP);
    expect(onTheFaceStep("iphone", "android")).toBe(ANDROID_WIDGET_STEP);
    expect(onTheFaceStep("iphone")).toBe("On the iPhone, touch and hold the Home Screen or Lock Screen, tap Edit, then add a Wrist Assistant widget.");
    expect(onTheFaceStep("watch")).toBe("On the watch, touch and hold the face, tap Edit, then pick Wrist Assistant in a complication slot.");
    expect(howItWorksSteps("iphone", false, "android")[2]).toBe("Save, then open Wrist Assistant on your phone to get it.");
    expect(howItWorksSteps("iphone", false)[2]).toBe("Save, then open Wrist Assistant on your iPhone to get it.");
    expect(NOT_ON_A_DEVICE_LINE).toBe("On no device yet. Tick a device over the preview to put it on a watch or a phone.");
  });

  it("never count the iPhone app's presets on an Android device", () => {
    expect(fullForShapeText("Pixel 9", true)).toBe("Pixel 9 is full for this shape.");
    expect(fullForShapeText("jesse's iPhone")).toBe("Jesse's iPhone is full for this shape. Presets made in the iPhone app count too.");
  });
});

describe("the device lists name an Android phone a phone", () => {
  it("carry the platform only on an Android device, so an Apple row is as it was", () => {
    const devices = linkDevicesOf([APPLE_WATCH, WEAR, IPHONE, PIXEL], true);
    expect(devices.map((d) => [d.ownerId, d.platform])).toEqual([["w1", undefined], ["w2", "wearos"], ["p2", undefined], ["p1", "android"]]);
    expect(Object.keys(devices[0]!)).not.toContain("platform");
    expect(devices.map((d) => deviceWord(d.kind, d.platform))).toEqual(["watch", "watch", "iPhone", "phone"]);
  });

  it("name a copy for Android phones only Phone", () => {
    const [, , iphone, pixel] = linkDevicesOf([APPLE_WATCH, WEAR, IPHONE, PIXEL], true);
    expect(copyNameFor("Lights", [pixel!])).toBe("Lights (Phone)");
    expect(copyNameFor("Lights", [iphone!])).toBe("Lights (iPhone)");
    expect(copyNameFor("Lights", [iphone!, pixel!])).toBe("Lights (iPhone)");
  });

  it("say which device a page waits for", () => {
    expect(syncText({ sync: "waiting", kind: "iphone", platform: "android" })).toBe("Waiting for the phone");
    expect(syncText({ sync: "waiting", kind: "iphone" })).toBe("Waiting for the iPhone");
    expect(syncText({ sync: "waiting", kind: "watch", platform: "wearos" })).toBe("Waiting for the watch");
  });

  it("put a phone in a person's brackets", () => {
    const people = [{ label: "Jesse", devices: [{ ownerId: "w1", kind: "watch" as const }, { ownerId: "p1", kind: "iphone" as const, android: true }, { ownerId: "p2", kind: "iphone" as const }] }];
    expect(rowWhoText(["w1", "p1", "p2"], people)).toBe("Jesse (watch, phone, iPhone)");
  });

  it("shorten a phone named like its person to its platform's word", () => {
    const pixel = { ...PIXEL, device_name: "Jesse" };
    const iphone = { ...IPHONE, device_name: "Jesse" };
    const person = (phone: OwnerSummary): Person => ({ key: phone.owner_watch_id, label: "Jesse", owners: [APPLE_WATCH, phone] });
    expect(deviceShortName(pixel, person(pixel))).toBe("Phone");
    expect(deviceShortName(iphone, person(iphone))).toBe("iPhone");
  });
});

describe("the page editor's screens on an Android phone", () => {
  const page = { id: "P", name: "Home", items: [] } as unknown as WatchPage;

  it("say phone where an iPhone's say iPhone", () => {
    expect(screenWord("iphone", "android")).toBe("phone");
    expect(screenWord("iphone")).toBe("iPhone");
    expect(screenTitleWord("iphone", "android")).toBe("Phone");
    expect(screenOnlyText("iphone", "android")).toBe("Phone only");
    expect(screenOnlyText("iphone")).toBe("iPhone only");
    expect(screenStatus(page, "watch", "android")).toEqual({ text: "Same order as the phone" });
    expect(screenStatus(page, "watch")).toEqual({ text: "Same order as the iPhone" });
    expect(tileOnChipTitle("watch", false, false, "android")).toBe("Phone only. The watch cannot draw this kind of tile.");
    expect(screenMoveToastText("watch", [], "android")).toBe("Moved on the watch only. The phone stays as it is.");
    expect(screenMoveToastText("watch", [])).toBe("Moved on the watch only. The iPhone stays as it is.");
  });
});

describe("a phone's own records and settings", () => {
  it("say New phone and Phone could not use the last save", () => {
    expect(newDeviceText("iphone", "android")).toBe("New phone. The phone keeps what it has until you save here. Your first Save replaces it.");
    expect(newDeviceText("iphone")).toBe("New iPhone. The iPhone keeps what it has until you save here. Your first Save replaces it.");
    expect(NEW_ANDROID_PHONE_STATUS).toBe("New phone, not saved yet");
    expect(flat(renderHeadStatus({ newWatch: true, dirty: false, device: "iphone", platform: "android" }))).toContain(NEW_ANDROID_PHONE_STATUS);
    expect(flat(renderHeadStatus({ newWatch: true, dirty: false, device: "iphone" }))).toContain(NEW_IPHONE_STATUS);
    expect(rejectedSaveText(["pages"], "iphone", "android")).toBe("Phone could not use the last save of its pages");
    expect(rejectedSaveText(["pages"], "iphone")).toBe("iPhone could not use the last save of its pages");
  });

  it("carry an Android row's platform to Home's lines", () => {
    const rows = homeDeviceRows(homeDevices([{ ...PIXEL, applied_token: 1 }, { ...IPHONE, applied_token: 1 }], (o) => o.device_name ?? "", (o) => o.device_name ?? ""));
    expect(rows.map((r) => r.platform)).toEqual(["android", undefined]);
    expect(attentionText({ sync: "synced", waitingFor: [], rejected: ["menus"], kind: "iphone", platform: "android" }, undefined)).toBe("Phone could not use the last save of its menus");
  });

  it("name the phone in its addresses", () => {
    expect(addressesHelp("android")).toBe("The two addresses this phone uses to reach Home Assistant.");
    expect(addressesHelp("iphone")).toBe("The two addresses this iPhone uses to reach Home Assistant.");
    expect(addressHint("remote", "android")).toBe("Used when the phone is away from home.");
    expect(addressesSavedNote("android")).not.toMatch(/iPhone/);
  });

  it("give an Android phone the hold time's line without iOS in it", () => {
    const row = (platform?: "android") => catalogFor("iphone", undefined, platform).flatMap((s) => s.settings).find((s) => s.key === "longPressDuration")!;
    expect(row("android").help).toBe("How long you press a tile before its extra options open.");
    expect(row().help).toContain("iOS sets this time itself");
  });

  it("leave the double pinch out of a Wear watch's rooms, and name an Android phone", () => {
    expect(HOME_ROOMS_MAIN_HOUSE_WEAR_TEXT).not.toMatch(/pinch/);
    expect(HOME_ROOMS_MAIN_HOUSE_TEXT).toMatch(/double pinch/);
    expect(HOME_ROOMS_ANDROID_TEXT).toBe("The double-tap on the page title is in this phone's settings.");
    expect(HOME_ROOMS_PHONE_TEXT).toBe("The double-tap on the page title is in this iPhone's settings.");
  });

  it("speak from the watch on a Wear OS watch, not an Apple Watch", () => {
    expect(wearWords("Apple Watch")).toBe("Watch");
    expect(wearWords("Speaks directly from the Apple Watch speaker.")).toBe("Speaks directly from the watch speaker.");
    expect(wearWords("Plays speech locally from Apple Watch. No Home Assistant media_player target is required.")).toBe("Plays speech locally from the watch. No Home Assistant media_player target is required.");
  });
});

describe("pairing a phone of either platform", () => {
  const PIXEL_UA = "Mozilla/5.0 (Linux; Android 16; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36";
  const TABLET_UA = "Mozilla/5.0 (Linux; Android 16; Pixel Tablet) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";
  const IPHONE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 27_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";

  it("offers the open the app link on the phone the panel is open on", () => {
    expect(pairOnAndroidPhone(PIXEL_UA)).toBe(true);
    expect(pairOnAndroidPhone(TABLET_UA)).toBe(false);
    expect(pairOpenAppText(PIXEL_UA)).toBe(PAIR_OPEN_ANDROID_APP_TEXT);
    expect(pairOpenAppText(IPHONE_UA)).toBe(PAIR_OPEN_APP_TEXT);
    expect(PAIR_OPEN_APP_TEXT).toBe("Pair this iPhone instead");
    expect(pairOpenAppText(TABLET_UA)).toBeUndefined();
    expect(pairOpenAppText(undefined)).toBeUndefined();
  });

  it("says phone for a QR code, which any phone can scan", () => {
    expect(PAIR_QR_REPLACE_LABEL).toBe("Replace a phone paired for someone else");
    expect(PAIR_QR_REPLACE_HINT).not.toMatch(/iPhone/);
    expect(pairErrorText({ code: "unknown_command" }, "offer")).toBe("Update the Wrist Assistant integration to pair a phone with a QR code.");
  });

  it("names a device found by its code by its platform", () => {
    expect(pairRemoteWarning("8.8.8.8", "iphone", "android")).toBe("The request came from outside your network. Only pair a phone you expect.");
    expect(pairRemoteWarning("8.8.8.8", "iphone")).toBe("The request came from outside your network. Only pair an iPhone you expect.");
    expect(pairExpectLabel("iphone", "android")).toBe("I expect this phone");
    expect(pairExpectLabel("iphone")).toBe("I expect this iPhone");
    expect(pairErrorText({ code: "needs_replace" }, "confirm", "iphone", "android")).toMatch(/^This phone is already paired\./);
    expect(pairErrorText({ code: "needs_replace" }, "confirm", "iphone")).toMatch(/^This iPhone is already paired\./);
  });
});
