// The Complications tab's list page: when it shows, what it shows, which
// device tab it opens on, what Escape closes there, and a sheet that reads
// only the panel's tokens.

import { describe, expect, it } from "vitest";
import {
  type TabMemory, browseAllTab, listPageEscape, listPageLead, listPageShown, listPageState, listPageStyles,
  listsReady, pickTab, pickerSurfaceClass, restoreTab,
} from "../src/list-page.js";
import { ALL_DEVICES } from "../src/pickerRows.js";

const route = (path: string) => ({ prefix: "/wrist-assistant", path });

describe("pickerSurfaceClass", () => {
  it("keeps the dialog's own class, which showModal finds it by", () => {
    expect(pickerSurfaceClass("dialog", false)).toBe("pk-dialog pk-surface");
    expect(pickerSurfaceClass("dialog", true)).toBe("pk-dialog pk-surface bare");
  });

  it("gives the page the shared class and never the dialog's", () => {
    expect(pickerSurfaceClass("page", false)).toBe("pk-page pk-surface");
    expect(pickerSurfaceClass("page", true)).toBe("pk-page pk-surface bare");
    expect(pickerSurfaceClass("page", true)).not.toContain("pk-dialog");
  });
});

describe("listPageShown", () => {
  it("is the Complications tab with nothing open", () => {
    expect(listPageShown(route("/complications"), false)).toBe(true);
    expect(listPageShown(route("/complications/"), false)).toBe(true);
  });

  it("gives way to the editor once a design is open", () => {
    expect(listPageShown(route("/complications"), true)).toBe(false);
  });

  it("is never on Home or a watch screen", () => {
    for (const path of ["", "/", "/pages", "/menus/w1", "/voice", "/status-pages", "/control-center", "/rooms/w2", "/http-actions", "/nowhere"]) {
      expect(listPageShown(route(path), false), path).toBe(false);
    }
    expect(listPageShown(undefined, false)).toBe(false);
  });
});

describe("listPageState", () => {
  it("lists whatever there is at once, even before every list is in", () => {
    expect(listPageState({ rows: 3, unsaved: false, ready: false })).toBe("list");
    expect(listPageState({ rows: 3, unsaved: false, ready: true })).toBe("list");
  });

  it("lists a design being made and not saved yet", () => {
    expect(listPageState({ rows: 0, unsaved: true, ready: true })).toBe("list");
    expect(listPageState({ rows: 0, unsaved: true, ready: false })).toBe("list");
  });

  it("says Loading rather than offering a first complication before every list is in", () => {
    expect(listPageState({ rows: 0, unsaved: false, ready: false })).toBe("loading");
  });

  it("is the empty state only once every list has answered with nothing", () => {
    expect(listPageState({ rows: 0, unsaved: false, ready: true })).toBe("empty");
  });
});

describe("listsReady", () => {
  const base = { devicesLoaded: true, ownerBusy: false, ownerId: "w1", otherListsOwner: "w1", otherListsRead: true };

  it("is ready once the devices, the edited device and the others have answered", () => {
    expect(listsReady(base)).toBe(true);
  });

  it("waits for the device list", () => {
    expect(listsReady({ ...base, devicesLoaded: false })).toBe(false);
  });

  it("waits through a device switch", () => {
    expect(listsReady({ ...base, ownerBusy: true })).toBe(false);
  });

  it("waits for the other devices' lists", () => {
    expect(listsReady({ ...base, otherListsRead: false })).toBe(false);
  });

  it("does not take lists read for another edited device", () => {
    expect(listsReady({ ...base, otherListsOwner: "w2" })).toBe(false);
    expect(listsReady({ ...base, otherListsOwner: undefined })).toBe(false);
  });

  it("has nothing more to wait for in a home with no device", () => {
    expect(listsReady({ devicesLoaded: true, ownerBusy: false, ownerId: undefined, otherListsOwner: undefined, otherListsRead: false })).toBe(true);
    expect(listsReady({ devicesLoaded: false, ownerBusy: false, ownerId: undefined, otherListsOwner: undefined, otherListsRead: false })).toBe(false);
  });
});

describe("the device tab the page comes back to", () => {
  const start: TabMemory = { shown: "w1", remembered: "w1" };

  it("remembers a tab picked by hand, in either form", () => {
    expect(pickTab(start, "w2")).toEqual({ shown: "w2", remembered: "w2" });
    expect(pickTab(browseAllTab(start), "w3")).toEqual({ shown: "w3", remembered: "w3" });
  });

  it("lets Browse all show All without wiping the page's tab", () => {
    expect(browseAllTab(start)).toEqual({ shown: ALL_DEVICES, remembered: "w1" });
  });

  it("brings the page's tab back once the dialog shuts", () => {
    expect(restoreTab(browseAllTab(start))).toEqual(start);
  });

  it("keeps a tab picked inside the dialog after it shuts", () => {
    expect(restoreTab(pickTab(browseAllTab(start), "library"))).toEqual({ shown: "library", remembered: "library" });
  });

  it("opens on All when All is what was left", () => {
    const all: TabMemory = { shown: ALL_DEVICES, remembered: ALL_DEVICES };
    expect(restoreTab(browseAllTab(all))).toEqual(all);
  });
});

describe("listPageEscape", () => {
  it("closes the Devices menu first, as the dialog does", () => {
    expect(listPageEscape({ dupOpen: true, selecting: true })).toBe("dup");
    expect(listPageEscape({ dupOpen: true, selecting: false })).toBe("dup");
  });

  it("then ends picking several", () => {
    expect(listPageEscape({ dupOpen: false, selecting: true })).toBe("select");
  });

  it("leaves the key alone with nothing open", () => {
    expect(listPageEscape({ dupOpen: false, selecting: false })).toBeUndefined();
  });
});

describe("listPageLead", () => {
  it("counts, and says a design can be on more than one device", () => {
    expect(listPageLead(0)).toBe("0 complications and widgets. One design can be on more than one device.");
    expect(listPageLead(1)).toBe("1 complication or widget. One design can be on more than one device.");
    expect(listPageLead(46)).toBe("46 complications and widgets. One design can be on more than one device.");
  });

  it("uses no dash to break a sentence", () => {
    expect(listPageLead(2)).not.toMatch(/[–—]| \x2d /);
  });
});

describe("the list page's look", () => {
  const text = listPageStyles.cssText;

  it("reads only tokens, never a fixed color", () => {
    expect(text).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(text).not.toMatch(/rgba?\(/);
  });

  it("never selects on the dark attribute", () => {
    expect(text).not.toContain("[dark]");
  });

  it("no purple and no wash", () => {
    expect(text).not.toContain("purple");
    expect(text).not.toContain("gradient");
  });

  it("draws every head button with a one pixel outline", () => {
    const sel = "a.cl-btn, button.cl-btn {";
    const rule = text.slice(text.indexOf(sel), text.indexOf("}", text.indexOf(sel)));
    expect(rule).toContain("border: 1px solid var(--wa-line-strong)");
  });

  it("outlines the page's surface and lets the page scroll rather than the grid", () => {
    const sel = ".pk-surface.pk-page {";
    const rule = text.slice(text.indexOf(sel), text.indexOf("}", text.indexOf(sel)));
    expect(rule).toContain("border: 1px solid var(--wa-line-strong)");
    expect(text).toContain(".pk-page > .pk-body { flex: none; overflow: visible;");
  });

  it("wraps the device tabs on a phone, where the dialog's scroll sideways", () => {
    const phone = text.slice(text.indexOf("@media (max-width: 640px)"));
    const sel = ".pk-page .pk-tabs {";
    expect(phone).toContain(sel);
    const rule = phone.slice(phone.indexOf(sel), phone.indexOf("}", phone.indexOf(sel)));
    expect(rule).toContain("flex-wrap: wrap");
    expect(rule).toContain("overflow-x: visible");
    expect(rule).toContain("mask-image: none");
  });

  it("pins the head, the device tabs and the picking bar while the page scrolls, but not on a phone", () => {
    expect(text).toContain(".pk-page > .pk-pin { position: sticky; top: calc(-1 * var(--cl-top, 0px)); z-index: 3; background: var(--wa-card); }");
    const phone = text.slice(text.indexOf("@media (max-width: 640px)"));
    expect(phone).toContain(".pk-page > .pk-pin { position: static; }");
  });

  it("keys nothing on the dialog, so the dialog's frame never reaches the page", () => {
    expect(text).not.toContain("pk-dialog");
  });

  it("writes the stacked bar rule as a header and .wa-bar twin", () => {
    expect(text).toContain("header.stacked > button.tb-btn.tb-list, .wa-bar.stacked > button.tb-btn.tb-list { order: 0; }");
  });
});
