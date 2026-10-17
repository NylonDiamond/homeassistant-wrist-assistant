// The editors' words about the library (`watch-pages/library-editing.ts`),
// over the shared summary of two watches and an iPhone.

import { describe, expect, it } from "vitest";

import { libraryOf } from "../src/library/model.js";
import {
  copiedMenuText,
  copyMenuName,
  dirtyElsewhereText,
  hereTickText,
  libraryBadgeText,
  libraryDeleteChoices,
  menuLabel,
  menuRestoreLines,
  otherOwners,
  ownerWords,
  restRows,
  restTitle,
  restoreOthersText,
  sameItemContent,
  statusSharedText,
  unsavedTicksText,
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
    expect(choices.library).toBe("Delete from the library (it is on 3 devices)");
    expect(choices.body).toBe("It is also on Chen Watch and iPhone 15 Pro. Remove takes it off this watch when you save, and those devices keep it. "
      + "Delete from the library takes it off every device at once, which undo here does not bring back.");
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

  it("leaves out a page whose content is the same but for its own Hide here and link mark", () => {
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
    const restored = { ...now, quickAction: { slots: [], beamIntensity: 0.2 }, linkIds: { anywhere: "x" } };
    expect(menuRestoreLines(lib, JESSE, now, restored, DEVICES)).toEqual([`It also changes the Anywhere menu "Home menu" on iPhone 15 Pro, which uses it too.`]);
    expect(menuRestoreLines(lib, JESSE, now, { ...now, entityRadial: { x: 1 } }, DEVICES)).toEqual(["It also changes the Entity quick menu on Chen Watch and iPhone 15 Pro, which use it too."]);
    // Only link marks differ: nothing changes on the menus.
    expect(menuRestoreLines(lib, JESSE, now, { ...now, linkIds: { anywhere: HOME_MENU } }, DEVICES)).toEqual([]);
    // A menu only this device uses.
    expect(menuRestoreLines(lib, CHEN, now, restored, DEVICES)).toEqual([]);
  });

  it("says a restore of a save from before the menu was shared gives this device its own copy", () => {
    // Jesse's watch shares Home menu with the iPhone, and its record holds
    // the server's mark; the restored save has none.
    const now = { schemaVersion: 1, quickAction: { slots: [] }, pageSwitcher: {}, entityRadial: {}, linkIds: { anywhere: HOME_MENU, entity: QUICK } };
    const restored = { schemaVersion: 1, quickAction: { slots: [], beamIntensity: 0.2 }, pageSwitcher: {}, entityRadial: {}, linkIds: { entity: QUICK } };
    expect(menuRestoreLines(lib, JESSE, now, restored, DEVICES, "watch")).toEqual([
      `This watch gets its own copy of the Anywhere menu "Home menu". iPhone 15 Pro keeps it as it is.`,
    ]);
    // Even with the same slots: the copy is made all the same.
    expect(menuRestoreLines(lib, PHONE, { ...now }, { ...now, linkIds: {} }, DEVICES, "iphone")).toEqual([
      `This iPhone gets its own copy of the Anywhere menu "Home menu". Jesse Apple Watch keeps it as it is.`,
      "This iPhone gets its own copy of the Entity quick menu. Chen Watch and Jesse Apple Watch keep it as it is.",
    ]);
    // A menu this device alone uses: nothing to copy.
    expect(menuRestoreLines(lib, CHEN, { ...now, linkIds: { anywhere: CHEN_MENU } }, { ...now, linkIds: {} }, DEVICES)).toEqual([]);
  });

  it("says a restore of a save made on another menu moves this device back onto it", () => {
    const now = { schemaVersion: 1, quickAction: { slots: [] }, pageSwitcher: {}, entityRadial: {} };
    // Saved while Jesse's watch used Chen's menu, whose slots differ: Chen
    // Watch sees the change too.
    const restored = { ...now, quickAction: { slots: [], beamIntensity: 0.4 }, linkIds: { anywhere: CHEN_MENU } };
    expect(menuRestoreLines(lib, JESSE, now, restored, DEVICES)).toEqual([
      `This watch goes back to using the Anywhere menu "Chen's menu".`,
      `It also changes the Anywhere menu "Chen's menu" on Chen Watch, which uses it too.`,
    ]);
    // The same slots as Chen's menu holds: only the move.
    const same = { schemaVersion: 1, quickAction: { slots: [] }, entityRadial: {}, linkIds: { anywhere: CHEN_MENU } };
    expect(menuRestoreLines(lib, JESSE, now, same, DEVICES)).toEqual([`This watch goes back to using the Anywhere menu "Chen's menu".`]);
    // A mark naming a menu of the other kind, or one the library does not
    // hold, changes nothing but the slots.
    expect(menuRestoreLines(lib, CHEN, now, { ...now, linkIds: { anywhere: QUICK, entity: "gone" } }, DEVICES)).toEqual([]);
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
