// The editors' words about the library (`watch-pages/library-editing.ts`),
// over the shared summary of two watches and an iPhone.

import { describe, expect, it } from "vitest";

import { libraryOf } from "../src/library/model.js";
import {
  copyMenuName,
  dirtyElsewhereText,
  libraryBadgeDevices,
  libraryBadgeText,
  libraryLinkBadge,
  otherOwners,
  ownerWords,
  statusSharedText,
  pageRefWords,
  unsavedTicksText,
  untickAskText,
  untickNote,
} from "../src/watch-pages/library-editing.js";
import { CHEN, DEVICES, DOORS, JESSE, PAGE1, PHONE, SMART, STARTER, summary } from "./library-fixture.js";

const lib = libraryOf(summary());

describe("who else has an item", () => {
  it("lists the other devices, ignoring case, by name in device order", () => {
    expect(otherOwners(lib, "pages", PAGE1, JESSE.toUpperCase())).toEqual([PHONE]);
    expect(ownerWords([PHONE, CHEN], DEVICES)).toEqual(["Chen Watch", "iPhone 15 Pro"]);
    expect(ownerWords([CHEN, "gone"], DEVICES)).toEqual(["Chen Watch", "another device"]);
    expect(ownerWords(["a", "b"], DEVICES)).toEqual(["2 other devices"]);
  });

  it("badges a row with the other device, or the count, and nothing for one here alone", () => {
    expect(libraryBadgeText(lib, "pages", PAGE1, JESSE, DEVICES)).toBe("Also on iPhone 15 Pro");
    expect(libraryBadgeText(lib, "status_pages", STARTER, JESSE, DEVICES)).toBe("On 3 devices");
    expect(libraryBadgeText(lib, "pages", SMART, JESSE, DEVICES)).toBeUndefined();
    expect(libraryBadgeText(undefined, "pages", PAGE1, JESSE, DEVICES)).toBeUndefined();
  });

  it("draws the badge as the other devices, in device order, with a stand-in for one the list does not know", () => {
    expect(libraryBadgeDevices(lib, "pages", PAGE1, JESSE, DEVICES)).toEqual([DEVICES[2]]);
    expect(libraryBadgeDevices(lib, "status_pages", STARTER, JESSE.toUpperCase(), DEVICES)).toEqual([DEVICES[0], DEVICES[2]]);
    expect(libraryBadgeDevices(lib, "status_pages", STARTER, JESSE, DEVICES.slice(1))).toEqual([
      DEVICES[2],
      { ownerId: CHEN, name: "another device", kind: "watch" },
    ]);
    expect(libraryBadgeDevices(lib, "pages", SMART, JESSE, DEVICES)).toEqual([]);
    expect(libraryBadgeDevices(undefined, "pages", PAGE1, JESSE, DEVICES)).toEqual([]);
  });

  it("hands a host the devices, the sentence and the colors in one, or nothing for an item here alone", () => {
    const colorOf = (o: string) => (o === PHONE ? "#f00" : undefined);
    expect(libraryLinkBadge(lib, "pages", PAGE1, JESSE, DEVICES, colorOf)).toEqual({ others: [DEVICES[2]], title: "Also on iPhone 15 Pro", colorOf });
    expect(libraryLinkBadge(lib, "pages", SMART, JESSE, DEVICES, colorOf)).toBeUndefined();
  });

  it("says why a tick is locked", () => {
    expect(dirtyElsewhereText("Chen Watch")).toBe("Save or discard the edits on Chen Watch first.");
    expect(unsavedTicksText("pages")).toBe("Save first, then tick a device to put the page there too.");
  });
});

describe("the status pages' shared line", () => {
  it("says which are on other devices too", () => {
    expect(statusSharedText(lib, JESSE, [DOORS, STARTER], DEVICES)).toBe("1 of these status pages is also on Chen Watch and iPhone 15 Pro. An edit here shows there too.");
    expect(statusSharedText(lib, PHONE, [STARTER], DEVICES)).toBe("This status page is also on Chen Watch and Jesse Apple Watch. An edit here shows there too.");
    expect(statusSharedText(lib, JESSE, [DOORS], DEVICES)).toBeUndefined();
  });
});

describe("Duplicate", () => {
  it("names a device's copy after the device", () => {
    expect(copyMenuName("Jesse Apple Watch")).toBe("Jesse Apple Watch's menu");
  });
});

describe("the untick's question and note", () => {
  it("counts the menu slots and complication taps, singular and plural", () => {
    expect(pageRefWords({ slots: 1, taps: 0 })).toBe("1 menu slot");
    expect(pageRefWords({ slots: 2, taps: 1 })).toBe("2 menu slots and 1 complication tap");
    expect(pageRefWords({ slots: 0, taps: 3 })).toBe("3 complication taps");
    expect(pageRefWords({ slots: 0, taps: 0 })).toBe("");
  });

  it("asks what goes with the page, the verb agreeing with the count", () => {
    expect(untickAskText("pages", "Kitchen", "Jesse's Watch", { slots: 2, taps: 1 }))
      .toBe("Take Kitchen off Jesse's Watch? 2 menu slots and 1 complication tap that open it are cleared too.");
    expect(untickAskText("pages", "Kitchen", "Jesse's Watch", { slots: 1, taps: 0 }))
      .toBe("Take Kitchen off Jesse's Watch? 1 menu slot that opens it is cleared too.");
    expect(untickAskText("pages", "Kitchen", "Jesse's Watch", { slots: 0, taps: 1 }))
      .toBe("Take Kitchen off Jesse's Watch? 1 complication tap that opens it is cleared too.");
    expect(untickAskText("status_pages", "Doors", "Jesse's iPhone", { slots: 3, taps: 0 }))
      .toBe("Take Doors off Jesse's iPhone? 3 menu slots that open it are cleared too.");
  });

  it("asks without a count when the records could not be read", () => {
    expect(untickAskText("pages", "Kitchen", "Jesse's Watch", undefined))
      .toBe("Take Kitchen off Jesse's Watch? Any menu slots and complication taps that open it there are cleared too.");
    expect(untickAskText("status_pages", "Doors", "Jesse's Watch", undefined))
      .toBe("Take Doors off Jesse's Watch? Any menu slots that open it there are cleared too.");
  });

  it("says what was cleared, what could not be, and nothing when nothing was", () => {
    expect(untickNote("Kitchen", "Jesse's Watch", { slots: 2, taps: 0 }, []))
      .toEqual({ kind: "ok", text: "Took Kitchen off Jesse's Watch and cleared 2 menu slots that opened it." });
    expect(untickNote("Kitchen", "Jesse's Watch", { slots: 1, taps: 1 }, []))
      .toEqual({ kind: "ok", text: "Took Kitchen off Jesse's Watch and cleared 1 menu slot and 1 complication tap that opened it." });
    expect(untickNote("Kitchen", "Jesse's Watch", { slots: 0, taps: 0 }, [])).toBeUndefined();
    expect(untickNote("Kitchen", "Jesse's Watch", { slots: 0, taps: 1 }, ["the menus"]))
      .toEqual({ kind: "warn", text: "Took Kitchen off Jesse's Watch and cleared 1 complication tap that opened it. Could not clear it from the menus: change that by hand." });
    expect(untickNote("Kitchen", "Jesse's Watch", { slots: 0, taps: 0 }, ["the menus", "\"Lamp\""]))
      .toEqual({ kind: "warn", text: "Took Kitchen off Jesse's Watch. Could not clear it from the menus and \"Lamp\": change those by hand." });
  });
});
