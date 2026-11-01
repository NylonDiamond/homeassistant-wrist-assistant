// The Devices tab of the 2026-10-31 redesign (mock-home items 3, 5, 6, 7): each
// device's own address and pick, what a person's box says, the row of a device's
// own screens, and an asleep device's words.

import { describe, expect, it } from "vitest";
import type { OwnerSummary } from "../src/ha-api.js";
import { homeAddress, homeGroupSummary, ownScreenBlurb } from "../src/home.js";
import { asleepRowWords } from "../src/sync-pill.js";
import { WATCH_SETTINGS_SCREEN } from "../src/shell.js";
import { deviceRowChoices, renderDeviceOwnRow, watchChipSub } from "../src/watch-row.js";
import { flat } from "./library-editor-home.js";

const at = (path: string) => ({ prefix: "/wrist-assistant", path });
const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
const heard = (id: string) => (id === "c" ? { last_seen_seconds: 5 } : { last_seen_seconds: 500 });
const none = { pick: undefined, all: false };

describe("homeAddress", () => {
  it("picks the device the address names, leaving the address alone", () => {
    expect(homeAddress(at("/devices/b"), rows, none, heard)).toEqual({ pick: "b", all: false });
    expect(homeAddress(at("/devices/b"), rows, { pick: "a", all: true }, heard)).toEqual({ pick: "b", all: false });
  });

  it("reads an encoded id", () => {
    const odd = [{ id: "a b" }];
    expect(homeAddress(at("/devices/a%20b"), odd, none, heard)).toEqual({ pick: "a b", all: false });
  });

  it("shows every device at /devices/all, keeping the pick for later", () => {
    expect(homeAddress(at("/devices/all"), rows, { pick: "a", all: false }, heard)).toEqual({ pick: "a", all: true });
  });

  it("names the device heard from last on the bare tab, rewriting the address", () => {
    for (const path of ["", "/", "/devices"]) {
      expect(homeAddress(at(path), rows, none, heard)).toEqual({ pick: "c", all: false, rewrite: "/devices/c" });
    }
  });

  it("goes back to what was picked on the bare tab, Overview included", () => {
    expect(homeAddress(at("/devices"), rows, { pick: "a", all: false }, heard)).toEqual({ pick: "a", all: false, rewrite: "/devices/a" });
    expect(homeAddress(at("/devices"), rows, { pick: "a", all: true }, heard)).toEqual({ pick: "a", all: true, rewrite: "/devices/all" });
  });

  it("moves the address on when the device it names has left", () => {
    expect(homeAddress(at("/devices/gone"), rows, { pick: "gone", all: false }, heard)).toEqual({ pick: "c", all: false, rewrite: "/devices/c" });
  });

  it("leaves the address alone while there are no devices to pick from", () => {
    expect(homeAddress(at("/devices/b"), [], none, heard)).toEqual({ pick: "b", all: false });
    expect(homeAddress(at("/devices"), [], none, heard)).toEqual({ pick: undefined, all: false });
  });

  it("leaves an address the tab does not know alone", () => {
    expect(homeAddress(at("/nothing-here"), rows, { pick: "a", all: false }, heard)).toEqual({ pick: "a", all: false });
  });
});

describe("homeGroupSummary", () => {
  it("counts only the waiting as waiting: an asleep device stays out of it", () => {
    expect(homeGroupSummary(["synced", "asleep", "asleep", "synced", "waiting"])).toEqual({ text: "1 waiting", tone: "waiting" });
  });

  it("says All synced only when each one is", () => {
    expect(homeGroupSummary(["synced", "synced"])).toEqual({ text: "All synced", tone: "synced" });
    expect(homeGroupSummary(["synced", "asleep"])).toEqual({ text: "1 synced, 1 asleep", tone: "" });
    expect(homeGroupSummary(["synced", "idle"])).toEqual({ text: "1 of 2 synced", tone: "" });
  });

  it("is grey with every device asleep", () => {
    expect(homeGroupSummary(["asleep", "asleep"])).toEqual({ text: "2 asleep", tone: "" });
    expect(homeGroupSummary(["asleep", "idle"])).toEqual({ text: "1 asleep", tone: "" });
  });
});

describe("an asleep device's row", () => {
  it("says how long, in small letters", () => {
    expect(asleepRowWords({ seenSeconds: 15 * 86_400 })).toBe("asleep, 15 days");
    expect(asleepRowWords({ seenSeconds: 86_400 })).toBe("asleep, 1 day");
  });
});

describe("an asleep device in the row over its screens", () => {
  const owners = [
    { owner_watch_id: "w1", device_name: "Watch", device_kind: "watch", complication_count: 1, token: 2, applied_token: 1, is_orphan: false },
    { owner_watch_id: "w2", device_name: "Other", device_kind: "watch", complication_count: 1, token: 2, applied_token: 1, is_orphan: false },
  ] as OwnerSummary[];

  it("says Asleep in place of Waiting", () => {
    expect(watchChipSub("Jesse", "waiting", true)).toBe("Jesse · Asleep");
    expect(watchChipSub("Jesse", "waiting")).toBe("Jesse · Waiting");
  });

  it("marks only the asleep ones among the choices", () => {
    const choices = deviceRowChoices(owners, "w1", false, new Map(), new Set(["w2"]));
    expect(choices.map((c) => [c.id, c.asleep === true])).toEqual([["w1", false], ["w2", true]]);
  });
});

describe("the row of a device's own screens", () => {
  const row = (kind: "watch" | "iphone", phones = true) => renderDeviceOwnRow({
    route: at("/devices/w1"), ownerId: "w1", kind, phones,
    titleOf: (screen) => ownScreenBlurb(screen.id, kind),
    onGo: () => undefined,
  });

  it("lists Overview, then a watch's Settings, Rooms and Voice at their own addresses", () => {
    const text = flat(row("watch"));
    for (const word of ["Overview", "Settings", "Rooms", "Voice"]) expect(text).toContain(word);
    expect(text).toContain("/wrist-assistant/devices/w1");
    expect(text).toContain("/wrist-assistant/settings/w1");
    expect(text).toContain("/wrist-assistant/rooms/w1");
    expect(text).toContain("/wrist-assistant/voice/w1");
    expect(text.match(/wa-wr-link on/g)?.length).toBe(1);
    expect(text).not.toContain("own screens");
  });

  it("lights the tab on show, and holds its save controls and unsaved dots", () => {
    const settings = WATCH_SETTINGS_SCREEN;
    const text = flat(renderDeviceOwnRow({
      route: at("/settings/w1"), ownerId: "w1", kind: "watch", phones: true,
      titleOf: () => undefined, onGo: () => undefined, unsaved: [settings], end: "SAVE-CONTROLS",
    }));
    expect(text).toContain("SAVE-CONTROLS");
    expect(text.match(/wa-wr-link on/g)?.length).toBe(1);
    expect(text).toContain("wa-wr-end");
  });

  it("leaves Voice off an iPhone, whose screens are the iPhone app's", () => {
    const text = flat(row("iphone"));
    expect(text).not.toContain(">Voice");
    expect(text).toContain("/wrist-assistant/iphone/settings/w1");
    expect(text).toContain("/wrist-assistant/iphone/rooms/w1");
  });

  it("draws nothing for an iPhone in a home with no phone pages, which has none of them", () => {
    expect(flat(row("iphone", false))).toBe(flat(undefined));
  });
});
