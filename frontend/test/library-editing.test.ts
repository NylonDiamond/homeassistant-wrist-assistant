// The editors' words about the library (`watch-pages/library-editing.ts`),
// over the shared summary of two watches and an iPhone.

import { describe, expect, it } from "vitest";

import { libraryOf } from "../src/library/model.js";
import {
  copiedMenuText,
  copyMenuName,
  dirtyElsewhereText,
  hereTickText,
  libraryBadgeDevices,
  libraryBadgeText,
  libraryDeleteChoices,
  libraryLinkBadge,
  menuLabel,
  menuRestoreLines,
  otherOwners,
  ownerWords,
  restRows,
  restTitle,
  restoreOthersText,
  sameItemContent,
  statusSharedText,
  pageRefWords,
  unsavedTicksText,
  untickAskText,
  untickNote,
} from "../src/watch-pages/library-editing.js";
import { CAMERA, CHEN, CHEN_MENU, DEVICES, DOORS, HOME_MENU, JESSE, LIGHTS, LONELY, PAGE1, PHONE, QUICK, SMART, STARTER, summary } from "./library-fixture.js";

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
    expect(hereTickText("pages", "watch")).toBe("On this watch. Delete takes the page off it.");
    expect(hereTickText("status_pages", "iphone")).toBe("On this iPhone. Delete takes the status page off it.");
    expect(dirtyElsewhereText("Chen Watch")).toBe("Save or discard the edits on Chen Watch first.");
    expect(unsavedTicksText("pages")).toBe("Save first, then tick a device to put the page there too.");
  });
});

describe("the delete question", () => {
  it("offers remove here or delete from the library for an item other devices have", () => {
    const choices = libraryDeleteChoices(lib, "status_pages", STARTER, JESSE, "watch", DEVICES)!;
    expect(choices.count).toBe(3);
    expect(choices.remove).toBe("Remove from this watch only");
    expect(choices.library).toBe("Delete on all 3 devices");
    expect(choices.body).toBe("It is also on Chen Watch and iPhone 15 Pro. Remove takes it off this watch when you save, and those devices keep it. Undo brings it back. "
      + "Delete on all 3 devices applies right away to every device, and undo does not bring it back.");
    expect(libraryDeleteChoices(lib, "pages", PAGE1, PHONE, "iphone", DEVICES)!.remove).toBe("Remove from this iPhone only");
    expect(libraryDeleteChoices(lib, "pages", PAGE1, PHONE, "iphone", DEVICES)!.body).toContain("that device keeps it");
  });

  it("offers nothing more for an item on this device alone, or one not in the library", () => {
    expect(libraryDeleteChoices(lib, "pages", SMART, JESSE, "watch", DEVICES)).toBeUndefined();
    expect(libraryDeleteChoices(lib, "pages", "NEW", JESSE, "watch", DEVICES)).toBeUndefined();
    expect(libraryDeleteChoices(undefined, "pages", PAGE1, JESSE, "watch", DEVICES)).toBeUndefined();
  });
});

describe("the restore question", () => {
  it("names the other devices of every restored page whose content differs", () => {
    const restored = [
      { id: PAGE1.toLowerCase(), name: "Page one before", items: [] },
      { id: SMART, name: "Smart", items: [], dynamicConfig: { rules: [] } },
    ];
    expect(restoreOthersText(lib, "pages", JESSE, restored, DEVICES)).toBe(`It also changes "New Page 1" on iPhone 15 Pro, which has it too.`);
  });

  it("leaves out a page whose content is the same but for its own Hide here, or an old save's link key", () => {
    const same = { ...structuredClone(summary().pages[PAGE1]!.item), isHidden: true, linkId: PAGE1 };
    expect(sameItemContent(same, summary().pages[PAGE1]!.item)).toBe(true);
    expect(restoreOthersText(lib, "pages", JESSE, [same], DEVICES)).toBeUndefined();
  });

  it("joins several pages and devices", () => {
    const restored = [
      { id: LIGHTS, name: "Lights before", items: [] },
      { id: CAMERA, name: "Camera before", items: [] },
    ];
    expect(restoreOthersText(lib, "pages", PHONE, restored, DEVICES)).toBe(`It also changes "Lights" and "Camera" on Chen Watch, which has them too.`);
    expect(restoreOthersText(lib, "status_pages", CHEN, [{ id: STARTER, name: "Changed", rows: [] }], DEVICES))
      .toBe(`It also changes "Lights" on Jesse Apple Watch and iPhone 15 Pro, which have it too.`);
  });

  it("names the devices that use a menu the restore changes, one line per menu", () => {
    const now = { schemaVersion: 1, quickAction: { slots: [] }, pageSwitcher: {}, entityRadial: {} };
    const restored = { ...now, quickAction: { slots: [], beamIntensity: 0.2 } };
    expect(menuRestoreLines(lib, JESSE, now, restored, DEVICES)).toEqual([`It also changes the Anywhere menu "Home menu" on iPhone 15 Pro, which uses it too.`]);
    expect(menuRestoreLines(lib, JESSE, now, { ...now, entityRadial: { x: 1 } }, DEVICES)).toEqual(["It also changes the Entity quick menu on Chen Watch and iPhone 15 Pro, which use it too."]);
    expect(menuRestoreLines(lib, JESSE, now, { ...restored, entityRadial: { x: 1 } }, DEVICES)).toEqual([
      `It also changes the Anywhere menu "Home menu" on iPhone 15 Pro, which uses it too.`,
      "It also changes the Entity quick menu on Chen Watch and iPhone 15 Pro, which use it too.",
    ]);
    // The same slots: nothing changes on the menus.
    expect(menuRestoreLines(lib, JESSE, now, structuredClone(now), DEVICES)).toEqual([]);
    // A menu only this device uses.
    expect(menuRestoreLines(lib, CHEN, now, restored, DEVICES)).toEqual([]);
  });

  it("goes onto the menu this device uses now, whatever old link marks the save carries", () => {
    // A save from before the library may carry `linkIds`: Home Assistant
    // reads them as absent, so they never move this device to another menu
    // or give it a copy of its own, and they are no change on their own.
    const now = { schemaVersion: 1, quickAction: { slots: [] }, pageSwitcher: {}, entityRadial: {} };
    expect(menuRestoreLines(lib, JESSE, now, { ...now, linkIds: { anywhere: CHEN_MENU, entity: "gone" } }, DEVICES)).toEqual([]);
    expect(menuRestoreLines(lib, JESSE, { ...now, linkIds: { anywhere: HOME_MENU } }, now, DEVICES)).toEqual([]);
    const moved = { ...now, quickAction: { slots: [], beamIntensity: 0.4 }, linkIds: { anywhere: CHEN_MENU } };
    expect(menuRestoreLines(lib, JESSE, now, moved, DEVICES)).toEqual([`It also changes the Anywhere menu "Home menu" on iPhone 15 Pro, which uses it too.`]);
    for (const line of menuRestoreLines(lib, PHONE, now, { ...moved, entityRadial: { x: 1 } }, DEVICES)) {
      expect(line).not.toMatch(/goes back|own copy|keeps it as it is/);
    }
  });

  it("calls a menu by its own name only when it has one", () => {
    expect(menuLabel(lib.index.menus.get(HOME_MENU)!)).toBe(`the Anywhere menu "Home menu"`);
    expect(menuLabel({ id: "x", name: "Entity quick menu", unit: "entity", sections: {}, owners: [] })).toBe("the Entity quick menu");
  });
});

describe("the status pages' shared line", () => {
  it("says which are on other devices too", () => {
    expect(statusSharedText(lib, JESSE, [DOORS, STARTER], DEVICES)).toBe("1 of these status pages is also on Chen Watch and iPhone 15 Pro. An edit here shows there too.");
    expect(statusSharedText(lib, PHONE, [STARTER], DEVICES)).toBe("This status page is also on Chen Watch and Jesse Apple Watch. An edit here shows there too.");
    expect(statusSharedText(lib, JESSE, [DOORS], DEVICES)).toBeUndefined();
  });
});

describe("Not on this watch", () => {
  it("lists the library's rest for the device, with the devices that have each", () => {
    expect(restTitle("watch")).toBe("Not on this watch");
    expect(restTitle("iphone")).toBe("Not on this iPhone");
    expect(restRows(lib, JESSE, "pages", DEVICES).map((r) => [r.entry.id, r.meta])).toEqual([
      [LIGHTS, "11 tiles · on Chen Watch"],
      [CAMERA, "4 tiles · on Chen Watch"],
      [LONELY, "0 tiles · on no device"],
    ]);
    expect(restRows(lib, PHONE, "status_pages", DEVICES).map((r) => r.meta)).toEqual(["2 rows · on Jesse Apple Watch"]);
    expect(restRows(lib, CHEN, "status_pages", DEVICES).map((r) => r.entry.id)).toEqual([DOORS]);
    expect(restRows(undefined, CHEN, "pages", DEVICES)).toEqual([]);
  });

  it("marks a starter status page", () => {
    const rest = restRows(lib, "nobody", "status_pages", DEVICES);
    expect(rest[0]!.meta).toBe("1 row · starter · on Chen Watch, Jesse Apple Watch and iPhone 15 Pro");
  });
});

describe("Make a copy for this watch", () => {
  it("names the copy after the device, and says what it did", () => {
    expect(copyMenuName("Jesse Apple Watch")).toBe("Jesse Apple Watch's menu");
    expect(copiedMenuText("Jesse Apple Watch's menu", "watch")).toBe(`This watch uses its own copy now, "Jesse Apple Watch's menu". Edits here change only this watch.`);
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
