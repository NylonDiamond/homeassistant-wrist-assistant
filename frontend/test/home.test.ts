// Home's Devices card and its look: one row per device the sync rule asks,
// named the way the header pill names them, and a sheet that reads only the
// panel's tokens.

import { describe, expect, it } from "vitest";
import type { OwnerSummary } from "../src/ha-api.js";
import catalog from "../src/watch-settings-catalog.json";
import { IPHONE_SETTINGS_BLURB, countWord, deviceCardTiles, deviceFacts, homeDoorLook, homeGroups, homePageThumbs, homePickOf, homeRowSub, homeStep, homeTotalBucket, homeTotals, needsAttention, pendingWords, seenWords, summaryCounts, tileWord, deviceSheetTabs, watchConfigCount, homeDeviceRows, homeDevices, homeStyles, neverConnected, userGone, USER_GONE_TEXT } from "../src/home.js";
import { phoneWidgetPlaces } from "../src/home-art.js";
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
  const labels = (kind: "watch" | "iphone") => deviceSheetTabs(kind).map((t) => t.label);

  it("gives a watch its Pages, complications, its other screens, its Control Center controls and Settings last, never the home's shared screens or the retired Control Center screen", () => {
    expect(labels("watch")).toEqual(["Pages", "Complications", "Menus", "Status pages", "Control Center", "Rooms", "Voice", "Settings"]);
    expect(deviceSheetTabs("watch")[4]).toEqual({ kind: "list", label: "Control Center", filter: "control" });
    expect(deviceSheetTabs("watch").some((t) => t.kind === "screen" && t.screen.id === "control-center")).toBe(false);
  });

  it("gives an iPhone its widgets and its Control Center controls", () => {
    expect(deviceSheetTabs("iphone")).toEqual([
      { kind: "list", label: "Widgets", filter: "all" },
      { kind: "list", label: "Control Center", filter: "control" },
    ]);
  });

  it("gives an iPhone every iPhone app screen around its widgets and controls on a home with phone pages, in the watch's order", () => {
    const tabs = deviceSheetTabs("iphone", true);
    expect(tabs.map((t) => t.label)).toEqual(["Pages", "Widgets", "Menus", "Status pages", "Control Center", "Rooms", "Settings"]);
    expect(tabs[0]).toMatchObject({ kind: "screen", count: "pages" });
    expect(tabs[6]).toMatchObject({ kind: "screen" });
    expect(tabs[6]).not.toHaveProperty("count");
    expect(deviceSheetTabs("watch", true)).toEqual(deviceSheetTabs("watch"));
  });

  it("puts a count on Pages and Status pages", () => {
    const counted = deviceSheetTabs("watch").flatMap((t) => t.kind === "screen" && t.count ? [`${t.label}:${t.count}`] : []);
    expect(counted).toEqual(["Pages:pages", "Status pages:status_pages"]);
  });
});

describe("homePageThumbs", () => {
  const page = (id: string, over: Record<string, unknown> = {}) => ({ id, name: id, ...over });

  it("draws the first four pages the watch swipes between", () => {
    const pages = [page("a"), page("b", { isHidden: true }), page("c"), page("sys", { isSystemPage: true }), page("d"), page("e"), page("f")];
    expect(homePageThumbs(pages).map((p) => p.id)).toEqual(["a", "c", "d", "e"]);
  });

  it("draws nothing for a watch with no pages", () => {
    expect(homePageThumbs([])).toEqual([]);
  });
});

describe("deviceCardTiles", () => {
  const labels = (kind: "watch" | "iphone") => deviceCardTiles(kind).map((t) => t.label);

  it("gives a watch a tile for each counted page, complications and pages first, and an iPhone its widgets, Control Center never", () => {
    expect(labels("watch")).toEqual(["Complications", "Pages", "Status pages"]);
    expect(labels("iphone")).toEqual(["Widgets"]);
  });

  it("puts an iPhone's pages after its widgets on a home with phone pages", () => {
    expect(deviceCardTiles("iphone", true).map((t) => t.label)).toEqual(["Widgets", "Pages", "Status pages"]);
    expect(deviceCardTiles("iphone", true).map((t) => countWord(t.label, 2))).toEqual(["widgets", "pages", "status"]);
  });

  it("cuts a two word page name to one under the number", () => {
    expect(labels("watch").map(tileWord)).toEqual(["Complications", "Pages", "Status"]);
    expect(labels("iphone").map(tileWord)).toEqual(["Widgets"]);
    expect(tileWord("Control Center")).toBe("Controls");
  });
});

describe("summaryCounts", () => {
  const n = (revision: number, items?: number) => ({ revision, delivered_revision: revision, rejected_revision: 0, ...(items === undefined ? {} : { items }) });

  it("reads each watch's items, a kind with no record counting none", () => {
    const counts = summaryCounts({ owners: { w1: { pages: n(2, 5), status_pages: n(1, 2), behavior: n(3) } } }, ["w1"]);
    expect(counts.get("w1")).toEqual({ pages: 5, status_pages: 2, control_center: 0 });
  });

  it("counts none for a watch the summary leaves out, which has no records", () => {
    const counts = summaryCounts({ owners: { w1: { pages: n(2, 5) } } }, ["w1", "w2"]);
    expect(counts.get("w2")).toEqual({ pages: 0, status_pages: 0, control_center: 0 });
  });

  it("says nothing on an integration that sends no counts", () => {
    expect(summaryCounts({ owners: { w1: { pages: n(2) } } }, ["w1"]).size).toBe(0);
    expect(summaryCounts({ owners: {} }, ["w1"]).size).toBe(0);
  });
});

describe("seenWords and pendingWords", () => {
  it("says Online now for a polling watch, else how long ago, aged by the time since the list was read", () => {
    expect(seenWords({ polling: true, last_seen_seconds: 3 }, 0)).toBe("Online now");
    expect(seenWords({ polling: false, last_seen_seconds: 200 }, 100)).toBe("Seen 5 min ago");
    expect(seenWords({ polling: false, last_seen_seconds: null }, 0)).toBeUndefined();
    expect(seenWords(undefined, 0)).toBeUndefined();
  });

  it("counts what the next pull brings, and says nothing for none", () => {
    expect(pendingWords({ pending_changes: 1 })).toBe("1 change to pick up");
    expect(pendingWords({ pending_changes: 3 })).toBe("3 changes to pick up");
    expect(pendingWords({ pending_changes: 0 })).toBeUndefined();
    expect(pendingWords({ pending_changes: null })).toBeUndefined();
  });
});

describe("countWord", () => {
  it("writes the page's word small, singular for one, and leaves status alone", () => {
    expect(countWord("Widgets", 1)).toBe("widget");
    expect(countWord("Widgets", 0)).toBe("widgets");
    expect(countWord("Control Center", 1)).toBe("control");
    expect(countWord("Complications", 21)).toBe("complications");
    expect(countWord("Status pages", 1)).toBe("status");
    expect(countWord("Pages", undefined)).toBe("pages");
  });
});

describe("homeTotals", () => {
  it("counts every device and each sync word", () => {
    expect(homeTotals([{ sync: "synced" }, { sync: "waiting" }, { sync: "synced" }, { sync: "idle" }]))
      .toEqual({ all: 4, synced: 2, waiting: 1, idle: 1 });
    expect(homeTotals([])).toEqual({ all: 0, synced: 0, waiting: 0, idle: 0 });
  });

  it("counts a watch that could not use the last save as waiting, never synced", () => {
    // Its delivery numbers say synced (it fetched the save), but its card says
    // Not synced and it is listed under Waiting to sync; the totals agree.
    const refused = { sync: "synced" as const, rejected: ["pages"] };
    expect(homeTotals([{ sync: "synced" }, refused]))
      .toEqual({ all: 2, synced: 1, waiting: 1, idle: 0 });
    expect(homeTotals([{ sync: "idle", rejected: ["settings"] }]))
      .toEqual({ all: 1, synced: 0, waiting: 1, idle: 0 });
    // An empty list of refused parts is no refusal.
    expect(homeTotals([{ sync: "synced", rejected: [] }]))
      .toEqual({ all: 1, synced: 1, waiting: 0, idle: 0 });
  });

  it("puts each device in the bucket Waiting to sync agrees with", () => {
    expect(homeTotalBucket({ sync: "synced" })).toBe("synced");
    expect(homeTotalBucket({ sync: "idle" })).toBe("idle");
    expect(homeTotalBucket({ sync: "waiting" })).toBe("waiting");
    expect(homeTotalBucket({ sync: "synced", rejected: ["pages"] })).toBe("waiting");
    for (const row of [{ sync: "synced" as const }, { sync: "synced" as const, rejected: ["pages"] }, { sync: "idle" as const, rejected: ["x"] }]) {
      expect(homeTotalBucket(row) === "waiting").toBe(needsAttention(row));
    }
  });
});

describe("homeGroups", () => {
  const row = (id: string) => ({ id, name: id, kind: "watch" as const, sync: "synced" as const, waitingFor: [] });

  it("puts each person's rows under them, in the people's order, and keeps a stray row", () => {
    const people = [
      { key: "user:b", label: "Chen", owners: [owner({ owner_watch_id: "w2" })] },
      { key: "user:a", label: "Jesse", owners: [owner({ owner_watch_id: "w1" }), owner({ owner_watch_id: "p1" })] },
    ];
    const groups = homeGroups(people, [row("w1"), row("w2"), row("p1"), row("w9")]);
    expect(groups.map((g) => [g.person?.label, g.index, g.rows.map((r) => r.id)])).toEqual([
      ["Chen", 0, ["w2"]],
      ["Jesse", 1, ["w1", "p1"]],
      [undefined, -1, ["w9"]],
    ]);
  });
});

describe("deviceFacts", () => {
  it("says what the device is, its app, and the iPhone that set a watch up while it may still move the setup", () => {
    expect(deviceFacts(owner({ app_version: "3.1", app_build: "4", paired_iphone_name: "Ann's iPhone", has_iphone: true }), "watch"))
      .toEqual(["Apple Watch", "App 3.1 (4)", "Set up by Ann's iPhone"]);
    expect(deviceFacts(owner({ device_kind: "iphone", app_version: "3.1", paired_iphone_name: null }), "iphone"))
      .toEqual(["iPhone", "App 3.1"]);
  });

  it("never says a watch is paired with an iPhone, and drops the iPhone once no iPhone holds the watch's key", () => {
    // Paired again by code: Home Assistant still names the old iPhone, but
    // the watch made its own key and `has_iphone` is false.
    const coded = owner({ app_version: "3.1", paired_iphone_name: "WA-E2E A iPhone", has_iphone: false });
    expect(deviceFacts(coded, "watch")).toEqual(["Apple Watch", "App 3.1"]);
    expect(deviceFacts(owner({ paired_iphone_name: "Ann's iPhone" }), "watch")).toEqual(["Apple Watch", "App 3.0"]);
    expect(deviceFacts(owner({ paired_iphone_name: "Ann's iPhone", has_iphone: true }), "watch").join(" · ")).not.toMatch(/Paired/);
  });

  it("leaves out what the device never reported", () => {
    expect(deviceFacts(owner({ app_version: null }), "watch")).toEqual(["Apple Watch"]);
    expect(deviceFacts(undefined, "iphone")).toEqual(["iPhone"]);
  });
});

describe("homePickOf and homeStep", () => {
  const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
  const seen: Record<string, Pick<OwnerSummary, "polling" | "last_seen_seconds">> = {
    a: { last_seen_seconds: 900 }, b: { last_seen_seconds: 60 }, c: {},
  };

  it("keeps the device asked for while it is in the list", () => {
    expect(homePickOf(rows, "c", (id) => seen[id])).toBe("c");
  });

  it("else picks the device heard from last, a polling watch first, else the first", () => {
    expect(homePickOf(rows, undefined, (id) => seen[id])).toBe("b");
    expect(homePickOf(rows, "gone", (id) => ({ ...seen, a: { polling: true } })[id])).toBe("a");
    expect(homePickOf(rows, undefined, () => undefined)).toBe("a");
    expect(homePickOf([], undefined, () => undefined)).toBeUndefined();
  });

  it("steps through the list, going round at either end", () => {
    expect(homeStep(rows, "a", 1)).toBe("b");
    expect(homeStep(rows, "c", 1)).toBe("a");
    expect(homeStep(rows, "a", -1)).toBe("c");
    expect(homeStep(rows, "gone", 1)).toBe("a");
    expect(homeStep([], "a", 1)).toBeUndefined();
  });
});

describe("homeRowSub", () => {
  it("says what the device holds, then when it was heard from", () => {
    expect(homeRowSub("watch", 22, "Seen 1 h ago")).toBe("22 complications · 1 h ago");
    expect(homeRowSub("watch", 1, "Online now")).toBe("1 complication · Online now");
    expect(homeRowSub("iphone", 1, undefined)).toBe("1 widget");
    expect(homeRowSub("iphone", 0, "Never connected")).toBe("0 widgets · Never connected");
    // Pages lead when the device has them (plan step 6).
    expect(homeRowSub("watch", 3, "Seen 1 h ago", 4)).toBe("4 pages, 3 complications · 1 h ago");
    expect(homeRowSub("iphone", 1, undefined, 1)).toBe("1 page, 1 widget");
  });
});

describe("homeDoorLook", () => {
  it("gives every door of a watch and an iPhone a glyph, a section hue and a line", () => {
    for (const kind of ["watch", "iphone"] as const) {
      for (const tab of deviceSheetTabs(kind)) {
        const look = homeDoorLook(tab, kind);
        expect(look.hue, tab.label).toMatch(/^var\(--wa-hue-/);
        expect(look.blurb, tab.label).not.toBe("");
      }
    }
  });

  it("gives an iPhone's Settings iPhone words, from the sections its Settings screen shows", () => {
    const settings = deviceSheetTabs("iphone", true).find((t) => t.kind === "screen" && t.screen.id === "settings")!;
    expect(homeDoorLook(settings, "iphone").blurb).toBe(IPHONE_SETTINGS_BLURB);
    expect(IPHONE_SETTINGS_BLURB).not.toMatch(/wrist|connect/i);
    expect(homeDoorLook(settings, "watch").blurb).toBe("Gestures, wrist twists and how it connects.");
    expect(homeDoorLook(settings, "iphone").hue).toBe(homeDoorLook(settings, "watch").hue);
    // Every section the blurb names holds a setting the iPhone shows.
    const sections = (catalog as { sections: { title: string; settings: { devices?: string[] }[] }[] }).sections
      .filter((s) => s.settings.some((row) => row.devices?.includes("iphone")))
      .map((s) => s.title.toLowerCase());
    expect(sections).toEqual(expect.arrayContaining(["gestures", "pages", "cameras"]));
    expect(sections).not.toContain("wrist twists");
    expect(sections).not.toContain("connection");
  });

  it("gives a watch's Control Center the iPhone's look, and leaves Settings alone in grey", () => {
    const tabs = deviceSheetTabs("watch");
    const controls = tabs.find((t) => t.kind === "list" && t.filter === "control")!;
    expect(homeDoorLook(controls, "watch")).toEqual(homeDoorLook(controls, "iphone"));
    const hues = tabs.map((t) => homeDoorLook(t, "watch").hue);
    expect(hues.at(-1)).toBe("var(--wa-hue-grey)");
    expect(hues.filter((h) => h === "var(--wa-hue-grey)")).toHaveLength(1);
  });
});

describe("phoneWidgetPlaces", () => {
  it("pairs two small widgets on one strip, gives a medium the full width, and stops when the screen is full", () => {
    expect(phoneWidgetPlaces(["small", "small", "medium"])).toEqual([
      { x: 10, y: 98, w: 34, h: 34 }, { x: 48, y: 98, w: 34, h: 34 }, { x: 10, y: 136, w: 72, h: 34 },
    ]);
    expect(phoneWidgetPlaces(["small", "medium"])).toEqual([{ x: 10, y: 98, w: 34, h: 34 }, { x: 10, y: 136, w: 72, h: 34 }]);
    expect(phoneWidgetPlaces(["large", "small"])).toEqual([{ x: 10, y: 98, w: 72, h: 72 }]);
    expect(phoneWidgetPlaces([])).toEqual([]);
  });
});

describe("homeDoorLook's Control Center line", () => {
  it("says the controls are buttons in Control Center, made from designs", () => {
    const tab = deviceSheetTabs("iphone").find((t) => t.kind === "list" && t.filter === "control")!;
    expect(homeDoorLook(tab, "iphone").blurb).toBe("Buttons in Control Center, from your designs.");
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
      // The one radial gradient is the light on Home's stage, and it is a
      // token, so the light skin gets its own.
      const stage = text.indexOf(".hb-stage {");
      const rest = stage < 0 ? text : text.slice(0, stage) + text.slice(text.indexOf("}", stage));
      expect(rest).not.toContain("radial-gradient");
    });
  }

  it("lights Home's stage with a token, never a fixed light", () => {
    const text = homeStyles.cssText;
    const stage = text.slice(text.indexOf(".hb-stage {"), text.indexOf("}", text.indexOf(".hb-stage {")));
    expect(stage).toContain("radial-gradient(46% 70% at 50% 0%, var(--wa-stage-light) 0%, transparent 80%)");
    expect(stage).toContain("var(--wa-stage-top)");
  });

  it("draws every Home control with a one pixel outline", () => {
    const text = homeStyles.cssText;
    for (const sel of ["a.home-btn, button.home-btn {", "button.hb-step {", "a.hb-door, button.hb-door {"]) {
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

  it("shows every word: no ellipsis anywhere on Home, a long name or fact wraps instead", () => {
    const text = homeStyles.cssText;
    expect(text).not.toContain("text-overflow");
    const rule = (sel: string) => text.slice(text.indexOf(sel), text.indexOf("}", text.indexOf(sel)));
    for (const sel of [".hb-row-name {", ".hb-row-sub {", ".hb-facts {", ".hb-name h2 {", ".hb-person-name {", ".hb-door-l {"]) {
      expect(rule(sel), sel).toContain("overflow-wrap: anywhere");
    }
  });
});

describe("userGone", () => {
  it("is true only when the integration says the device's user was deleted", () => {
    expect(userGone(owner({ user_gone: true }))).toBe(true);
    expect(userGone(owner({ user_gone: false }))).toBe(false);
    // An integration older than the field, and no row at all.
    expect(userGone(owner())).toBe(false);
    expect(userGone(undefined)).toBe(false);
  });

  it("says what happened in plain words", () => {
    expect(USER_GONE_TEXT).toBe("Its Home Assistant user was removed");
  });
});

describe("neverConnected", () => {
  it("is true only for a device with no app version, no applied change and no sighting", () => {
    expect(neverConnected({ app_version: null, applied_token: null, last_seen_seconds: null })).toBe(true);
    expect(neverConnected({ app_version: null, applied_token: undefined })).toBe(true);
    expect(neverConnected({ app_version: "3.0.1", applied_token: null, last_seen_seconds: null })).toBe(false);
    expect(neverConnected({ app_version: null, applied_token: 0, last_seen_seconds: null })).toBe(false);
    expect(neverConnected({ app_version: null, applied_token: null, last_seen_seconds: 30 })).toBe(false);
    expect(neverConnected({ app_version: null, applied_token: null, polling: true })).toBe(false);
    expect(neverConnected(undefined)).toBe(false);
  });
});
