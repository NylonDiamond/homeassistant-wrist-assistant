// Home's Devices card and its look: one row per device the sync rule asks,
// named the way the header pill names them, and a sheet that reads only the
// panel's tokens.

import { describe, expect, it } from "vitest";
import type { OwnerSummary } from "../src/ha-api.js";
import { deviceFacts, deviceSheetTabs, watchConfigCount, homeDeviceRows, homeDevices, homeStyles } from "../src/home.js";
import { homeSync } from "../src/send-state.js";
import { shellStyles } from "../src/shell.js";

const owner = (over: Partial<OwnerSummary> = {}): OwnerSummary => ({
  owner_watch_id: "w1",
  device_name: "Watch",
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.0",
  screen_size: null,
  complication_count: 1,
  token: 5,
  applied_token: 5,
  is_orphan: false,
  ...over,
} as OwnerSummary);

const short = (o: OwnerSummary) => o.device_name ?? o.owner_watch_id;
const long = (o: OwnerSummary) => `${short(o)} (${o.paired_iphone_name ?? "iPhone"})`;

describe("homeDevices", () => {
  it("names each device bare unless two share a name", () => {
    const devices = homeDevices([
      owner({ owner_watch_id: "a", device_name: "Watch", paired_iphone_name: "Ann" }),
      owner({ owner_watch_id: "b", device_name: "Watch", paired_iphone_name: "Ben" }),
      owner({ owner_watch_id: "c", device_name: "Kitchen" }),
    ], short, long);
    expect(devices.map((d) => d.name)).toEqual(["Watch (Ann)", "Watch (Ben)", "Kitchen"]);
    expect(devices.map((d) => d.id)).toEqual(["a", "b", "c"]);
  });

  it("carries what the sync rule reads", () => {
    const [d] = homeDevices([owner({ token: 9, applied_token: null, complication_count: 3, is_orphan: true, device_kind: "iphone" })], short, long);
    expect(d).toMatchObject({ token: 9, appliedToken: null, count: 3, orphan: true, kind: "iphone" });
  });
});

describe("homeDeviceRows", () => {
  const rows = (owners: OwnerSummary[]) => homeDeviceRows(homeDevices(owners, short, long));

  it("leaves out the Library and orphans", () => {
    const list = rows([
      owner({ owner_watch_id: "library", device_name: "Library", device_kind: "library" }),
      owner({ owner_watch_id: "library", device_name: "Library", device_kind: null }),
      owner({ owner_watch_id: "gone", is_orphan: true }),
      owner({ owner_watch_id: "w1" }),
    ]);
    expect(list.map((r) => r.id)).toEqual(["w1"]);
  });

  it("puts watches first, then phones, each in the order given", () => {
    const list = rows([
      owner({ owner_watch_id: "p1", device_name: "Phone 1", device_kind: "iphone" }),
      owner({ owner_watch_id: "w1", device_name: "Watch 1" }),
      owner({ owner_watch_id: "p2", device_name: "Phone 2", device_kind: "iphone" }),
      owner({ owner_watch_id: "w2", device_name: "Watch 2", device_kind: null }),
    ]);
    expect(list.map((r) => r.id)).toEqual(["w1", "w2", "p1", "p2"]);
    expect(list.map((r) => r.kind)).toEqual(["watch", "watch", "iphone", "iphone"]);
  });

  it("gives each device the verdict the header pill counts it under", () => {
    const owners = [
      owner({ owner_watch_id: "ok", device_name: "Ok" }),
      owner({ owner_watch_id: "behind", device_name: "Behind", applied_token: 3 }),
      owner({ owner_watch_id: "new", device_name: "New", applied_token: null, complication_count: 2 }),
      owner({ owner_watch_id: "empty", device_name: "Empty", applied_token: null, complication_count: 0, device_kind: "iphone" }),
    ];
    const list = rows(owners);
    expect(list.map((r) => [r.id, r.sync])).toEqual([["ok", "synced"], ["behind", "waiting"], ["new", "waiting"], ["empty", "idle"]]);
    expect(homeSync(homeDevices(owners, short, long))).toEqual({ kind: "waiting", waiting: ["Behind", "New"] });
  });
});

describe("watchConfigCount", () => {
  it("counts the listed pages, never the watch's own system pages", () => {
    expect(watchConfigCount("pages", { pages: [{ id: "a" }, { id: "b", isSystemPage: true }, { id: "c", isHidden: true }, "junk"] })).toBe(2);
  });

  it("counts status pages and Control Center controls", () => {
    expect(watchConfigCount("status_pages", { statusPages: [{}, {}, {}] })).toBe(3);
    expect(watchConfigCount("control_center", { entities: [{ entityId: "light.a" }] })).toBe(1);
  });

  it("counts nothing stored as none", () => {
    expect(watchConfigCount("pages", null)).toBe(0);
    expect(watchConfigCount("status_pages", {})).toBe(0);
    expect(watchConfigCount("control_center", { entities: "x" })).toBe(0);
  });
});

describe("deviceSheetTabs", () => {
  const labels = (kind: "watch" | "iphone", admin: boolean) => deviceSheetTabs(kind, admin).map((t) => t.label);

  it("gives a watch its complications, its own screens and Settings, never the home's shared screens", () => {
    expect(labels("watch", true)).toEqual(["Complications", "Pages", "Menus", "Status pages", "Control Center", "Rooms", "Voice", "Settings"]);
  });

  it("gives an iPhone its widgets and its Control Center controls", () => {
    expect(deviceSheetTabs("iphone", true)).toEqual([
      { kind: "list", label: "Widgets", filter: "all" },
      { kind: "list", label: "Control Center", filter: "control" },
    ]);
  });

  it("puts a count on Pages, Status pages and Control Center", () => {
    const counted = deviceSheetTabs("watch", true).flatMap((t) => t.kind === "screen" && t.count ? [`${t.label}:${t.count}`] : []);
    expect(counted).toEqual(["Pages:pages", "Status pages:status_pages", "Control Center:control_center"]);
  });

  it("keeps the watch screens for administrators", () => {
    expect(labels("watch", false)).toEqual(["Complications"]);
  });
});

describe("deviceFacts", () => {
  it("says what the device is, its app, and a watch's iPhone", () => {
    expect(deviceFacts(owner({ app_version: "3.1", app_build: "4", paired_iphone_name: "Ann's iPhone" }), "watch"))
      .toEqual(["Apple Watch", "App 3.1 (4)", "Paired with Ann's iPhone"]);
    expect(deviceFacts(owner({ device_kind: "iphone", app_version: "3.1", paired_iphone_name: null }), "iphone"))
      .toEqual(["iPhone", "App 3.1"]);
  });

  it("leaves out what the device never reported", () => {
    expect(deviceFacts(owner({ app_version: null }), "watch")).toEqual(["Apple Watch"]);
    expect(deviceFacts(undefined, "iphone")).toEqual(["iPhone"]);
  });
});

describe("the shell's and Home's look", () => {
  for (const [name, sheet] of [["home", homeStyles], ["shell", shellStyles]] as const) {
    const text = sheet.cssText;

    it(`${name}: reads only tokens, never a fixed color`, () => {
      expect(text).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(text).not.toMatch(/rgba?\(/);
    });

    it(`${name}: never selects on the dark attribute`, () => {
      expect(text).not.toContain("[dark]");
    });

    it(`${name}: no purple and no wash`, () => {
      expect(text).not.toContain("purple");
      expect(text).not.toContain("radial-gradient");
    });
  }

  it("draws every Home control with a one pixel outline", () => {
    const text = homeStyles.cssText;
    for (const sel of ["a.home-btn, button.home-btn {", "a.home-screen, button.home-screen {"]) {
      const rule = text.slice(text.indexOf(sel), text.indexOf("}", text.indexOf(sel)));
      expect(rule, sel).toContain("border: 1px solid var(--wa-line-strong)");
    }
  });

  it("outlines every tab, and marks the open one with weight and a grey fill", () => {
    const text = shellStyles.cssText;
    const tab = text.slice(text.indexOf("a.wa-tab {"), text.indexOf("}", text.indexOf("a.wa-tab {")));
    expect(tab).toContain("border: 1px solid var(--wa-line-strong)");
    const on = text.slice(text.indexOf("a.wa-tab.on {"), text.indexOf("}", text.indexOf("a.wa-tab.on {")));
    expect(on).toContain("font-weight: 600");
    expect(on).toContain("var(--wa-ink) 10%");
    expect(on).not.toContain("--wa-hue");
    expect(text).toContain("flex-wrap: wrap");
  });

  it("titles Home's sections in small capitals, weight 500, spaced", () => {
    const text = homeStyles.cssText;
    const title = text.slice(text.indexOf(".home-title {"), text.indexOf("}", text.indexOf(".home-title {")));
    expect(title).toContain("font-weight: 500");
    expect(title).toContain("text-transform: uppercase");
    expect(title).toContain("letter-spacing");
  });

  it("cuts a long device name with an ellipsis on a box of its own, not on the flex row", () => {
    const text = homeStyles.cssText;
    const rule = (sel: string) => text.slice(text.indexOf(sel), text.indexOf("}", text.indexOf(sel)));
    const label = rule(".home-device-label {");
    expect(label).toContain("min-width: 0");
    expect(label).toContain("overflow: hidden");
    expect(label).toContain("text-overflow: ellipsis");
    expect(label).toContain("white-space: nowrap");
    expect(rule(".home-device-name {")).not.toContain("text-overflow");
  });
});
