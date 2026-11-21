// More of the panel's words on an Android phone or a Wear OS watch: the tap
// menu's phone caveat, Refresh now, the Wear watch's delivery row, the phone
// extras and web card help, the certificate's source and a full device's
// line. Each case checks the Apple line too, which stays as it was.

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { setAndroidHere } from "../src/device-platform.js";

import { type CompCellFacts, compCell } from "../src/complication-board.js";
import { tapActionInfo } from "../src/model.js";
import { refreshNowTitle } from "../src/send-state.js";
import { clientCertSourceText } from "../src/watch-client-cert.js";
import {
  DELIVERY_DETAILS,
  WEAR_DELIVERY_DETAILS,
  WEAR_DELIVERY_HELP,
  styleRow,
  styleRowOn,
  styleTileChoices,
} from "../src/watch-notification-style/model.js";
import { phoneWordsFor } from "../src/watch-pages/editor-host.js";
import { WATCH_WEB_CARD_HELP } from "../src/watch-pages/phone-tiles-model.js";


// These homes have an Android device paired. General copy says phone and
// watch in every home (`generalCopy`, pinned in `general-copy.test.ts`).
beforeEach(() => setAndroidHere(true));
afterEach(() => setAndroidHere(false));

describe("the tap menu's phone caveat", () => {
  it("keeps the older iPhone's line for every action it only opens the app for", () => {
    for (const type of ["openPage", "openEntity", "openRoomPage", "addTodo"] as const) {
      expect(tapActionInfo(type, "ios-old")).toContain("On iPhone, HouseLit before 3.2 only opens the app.");
      expect(tapActionInfo(type, "ios")).toBe(tapActionInfo(type, true));
    }
    expect(tapActionInfo("toggleEntity", "ios-old")).not.toContain("iPhone");
  });

  it("says phone on an Android phone, whose widgets open a page or an entity themselves", () => {
    expect(tapActionInfo("openRoomPage", "android")).toContain("On a phone this only opens the app.");
    for (const type of ["openPage", "openEntity", "addTodo", "toggleEntity"] as const) {
      expect(tapActionInfo(type, "android")).toBe(tapActionInfo(type));
    }
    for (const type of ["openPage", "openRoomPage", "toggleEntity"] as const) {
      expect(tapActionInfo(type, "android")).not.toMatch(/iPhone|iOS/);
    }
  });
});

describe("Refresh now", () => {
  it("names iOS only for an iPhone", () => {
    expect(refreshNowTitle()).toBe(
      "Send the phone a push so it pulls this now. iOS decides when the widget redraws; opening the app or tapping the widget redraws it at once.",
    );
    expect(refreshNowTitle(true)).toBe("Send the phone a push so it pulls this now and redraws its widgets.");
    expect(refreshNowTitle(true)).not.toMatch(/iOS|iPhone/);
  });
});

describe("how alerts arrive on a Wear OS watch", () => {
  const row = styleRow("storedDeliveryMode")!;

  it("keeps the Apple Watch's words on an Apple Watch", () => {
    expect(styleRowOn(row, "watchos")).toBe(row);
    expect(styleRowOn(row, undefined)).toBe(row);
    expect(row.help).toMatch(/iPhone/);
    const tiles = styleTileChoices(row, "fast", "watchos");
    expect(tiles.map((t) => t.detail)).toEqual([DELIVERY_DETAILS["fast"], DELIVERY_DETAILS["reliable"]]);
    expect(styleTileChoices(row, "fast")).toEqual(tiles);
  });

  it("says the phone and no Apple quirk on a Wear OS watch", () => {
    expect(styleRowOn(row, "wearos").help).toBe(WEAR_DELIVERY_HELP);
    const details = styleTileChoices(row, "fast", "wearos").map((t) => t.detail);
    expect(details).toEqual([WEAR_DELIVERY_DETAILS["fast"], WEAR_DELIVERY_DETAILS["reliable"]]);
    for (const words of [WEAR_DELIVERY_HELP, ...details]) expect(words).not.toMatch(/iPhone|Apple/);
  });

  it("leaves every other row as the table has it", () => {
    const other = styleRow("showButtonIcons")!;
    expect(styleRowOn(other, "wearos")).toBe(other);
  });

  it("says your phone for the webhook buttons in a home with an Android device", () => {
    const webhook = styleRow("storedWebhookButtonSize")!;
    expect(webhook.help).toBe("How big the buttons are on webhook alerts, on your watch and your iPhone.");
    expect(styleRowOn(webhook, "wearos").help).toBe("How big the buttons are on webhook alerts, on your watch and your phone.");
    expect(styleRowOn(webhook, "watchos").help).toBe("How big the buttons are on webhook alerts, on your watch and your phone.");
  });
});

describe("the phone extras and the web card on an Android device", () => {
  it("says the phone on an Android phone or a Wear OS watch, and the iPhone on an Apple device", () => {
    expect(phoneWordsFor({ platform: "android" }, WATCH_WEB_CARD_HELP)).toBe(
      "An HA dashboard address works after you sign in once inside the card on the phone.",
    );
    expect(phoneWordsFor({ platform: "wearos" }, "A double tap on the iPhone switches. The iPhone ignores it on an iPhone page.")).toBe(
      "A double tap on the phone switches. The phone ignores it on a phone page.",
    );
    for (const platform of ["ios", "watchos", undefined] as const) {
      expect(phoneWordsFor({ platform }, WATCH_WEB_CARD_HELP)).toBe(WATCH_WEB_CARD_HELP);
    }
  });
});

describe("where the client certificate came from", () => {
  it("names the Android app beside the iPhone app and the panel", () => {
    expect(clientCertSourceText("panel")).toBe("Uploaded here");
    expect(clientCertSourceText("iphone")).toBe("From the iPhone app");
    expect(clientCertSourceText("android")).toBe("From the Android app");
    expect(clientCertSourceText(null)).toBeUndefined();
  });
});

describe("a full device on the Complications board", () => {
  const facts = (change: Partial<CompCellFacts> = {}): CompCellFacts => ({
    listed: true, on: false, draws: true, full: true, last: false,
    designKind: "watch", deviceKind: "watch", deviceName: "Chen Watch", lockShape: false, shelfName: "Not on a device",
    ...change,
  });

  it("counts the iPhone app's presets only on an Apple device", () => {
    expect(compCell(facts()).title).toBe("Chen Watch is full for this shape. Presets made in the iPhone app count too. Delete a complication on it first.");
    expect(compCell(facts({ android: true, deviceName: "Pixel Watch" })).title).toBe("Pixel Watch is full for this shape. Delete a complication on it first.");
  });
});
