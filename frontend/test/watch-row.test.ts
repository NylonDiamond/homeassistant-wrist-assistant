// The slim header row over a device's own screens (plan step 7): Home, the
// device switcher (the watches and the iPhones in one menu, one plain name,
// or the way to pair the first), then the device's own screens (Settings,
// Rooms, Voice on a watch), the screen on show marked, then a Pages link to
// the focused Pages board, then the screen's own save controls. HTTP actions
// and Cameras get a row of their own. Read from its helpers and by
// flattening the template it draws.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { type DeviceSheetTab, homeDoorLook } from "../src/home.js";
import { SCREEN_HOW_TO } from "../src/screen-howto.js";
import { WATCH_SCREENS, WATCH_SETTINGS_SCREEN, watchScreenSentence } from "../src/shell.js";
import {
  SHARED_ROW_LABEL,
  WATCH_ROW_NONE_NOTE,
  WATCH_SCREEN_LOOK,
  type WatchRowInput,
  deviceRowChoices,
  markRowMore,
  renderWatchRow,
  rowHasScreen,
  rowScrollFor,
  unsavedNotice,
  unsavedNoticeText,
  unsavedScreens,
  watchRowChoices,
  sharedRowLinks,
  watchRowBoardPath,
  watchRowLinks,
  watchRowSlot,
  watchChipSub,
  watchRowLinkTitle,
  watchRowStyles,
} from "../src/watch-row.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

/** Every `@click` handler a template holds, in order, and every `@keydown`. */
function handlers(v: unknown, name: "@click" | "@keydown", out: ((e: unknown) => void)[] = []): ((e: unknown) => void)[] {
  if (Array.isArray(v)) { for (const x of v) handlers(x, name, out); return out; }
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    r.values.forEach((value, i) => {
      if (typeof value === "function" && r.strings[i]!.trimEnd().endsWith(`${name}=`)) out.push(value as (e: unknown) => void);
      else handlers(value, name, out);
    });
  }
  return out;
}

const owner = (o: Partial<OwnerSummary>): OwnerSummary => ({
  owner_watch_id: "x",
  device_name: "Apple Watch",
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.0.0",
  screen_size: null,
  complication_count: 0,
  token: 3,
  applied_token: 3,
  is_orphan: false,
  ...o,
} as OwnerSummary);

const OWNERS = [
  owner({ owner_watch_id: "w1", device_name: "Jesse's Watch" }),
  owner({ owner_watch_id: "p1", device_name: "Jesse's iPhone", device_kind: "iphone" }),
  owner({ owner_watch_id: "w2", device_name: "Chen's Watch", applied_token: 1, complication_count: 2 }),
  owner({ owner_watch_id: "old", is_orphan: true }),
  owner({ owner_watch_id: "library", device_kind: "library" }),
];

/** A home whose iPhone shows pages of its own. */
const WITH_PHONE = OWNERS.map((o) => (o.owner_watch_id === "p1" ? { ...o, phone_pages: true } : o));

const route = (path: string) => ({ prefix: "/wrist-assistant", path });

function row(over: Partial<WatchRowInput> = {}) {
  const calls: string[] = [];
  const input: WatchRowInput = {
    route: route("/rooms/w1"),
    owners: OWNERS,
    watch: "w1",
    loaded: true,
    menuOpen: false,
    onMenu: (open) => calls.push(`menu:${open}`),
    onPick: (id) => calls.push(`pick:${id}`),
    onGo: (path) => calls.push(`go:${path}`),
    ...over,
  };
  const tpl = renderWatchRow(input);
  return { text: flat(tpl), tpl, calls };
}

const click = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, preventDefault: () => undefined };

describe("the row's watches", () => {
  it("lists watches only, named as the screens name them, with the shown one on", () => {
    const choices = watchRowChoices(OWNERS, "w2");
    expect(choices.map((c) => [c.id, c.name, c.on])).toEqual([["w1", "Jesse's Watch", false], ["w2", "Chen's Watch", true]]);
  });

  it("gives each its complications' verdict, by Home's rule", () => {
    expect(watchRowChoices(OWNERS, "w1").map((c) => c.sync)).toEqual(["synced", "waiting"]);
  });

  it("tells two watches of one name apart by their phones", () => {
    const twins = [
      owner({ owner_watch_id: "a", device_name: "Apple Watch", paired_iphone_name: "Jesse" }),
      owner({ owner_watch_id: "b", device_name: "Apple Watch", paired_iphone_name: "Chen" }),
    ];
    expect(watchRowChoices(twins, "a").map((c) => c.name)).toEqual(["Apple Watch (Jesse)", "Apple Watch (Chen)"]);
  });

  it("says under the chip's name whose watch it is and how it stands", () => {
    expect(watchChipSub("Jesse", "synced")).toBe("Jesse · Synced");
    expect(watchChipSub(undefined, "waiting")).toBe("Waiting");
    expect(watchChipSub("Jesse", undefined)).toBe("Jesse");
    expect(watchChipSub(undefined, undefined)).toBe("");
  });

  it("holds a loading line, the way to pair, one plain name, or a menu", () => {
    expect(watchRowSlot(false, 0)).toBe("loading");
    expect(watchRowSlot(true, 0)).toBe("none");
    expect(watchRowSlot(true, 1)).toBe("one");
    expect(watchRowSlot(false, 1)).toBe("one");
    expect(watchRowSlot(true, 2)).toBe("many");
  });

  it("lists the watches, then the iPhones that show pages, in one switcher", () => {
    const both = deviceRowChoices(WITH_PHONE, "p1", true);
    expect(both.map((c) => [c.id, c.kind, c.on])).toEqual([["w1", "watch", false], ["w2", "watch", false], ["p1", "iphone", true]]);
    expect(deviceRowChoices(WITH_PHONE, "w1", false).map((c) => c.id)).toEqual(["w1", "w2"]);
    // An iPhone whose app is too old for pages has no screens of its own.
    expect(deviceRowChoices(OWNERS, "w1", true).map((c) => c.id)).toEqual(["w1", "w2"]);
  });
});

describe("the row's screen links", () => {
  it("lists a watch's own screens, Settings first, each on the shared watch, the one on show marked", () => {
    const links = watchRowLinks(route("/rooms/w1"), "w2");
    expect(links.map((l) => l.screen.label)).toEqual(["Settings", "Rooms", "Voice"]);
    expect(links.map((l) => l.path)).toEqual(["/settings/w2", "/rooms/w2", "/voice/w2"]);
    expect(links.filter((l) => l.on).map((l) => l.screen.id)).toEqual(["rooms"]);
  });

  it("lists an iPhone's own screens at their iPhone addresses, with no Voice", () => {
    const links = watchRowLinks(route("/iphone/rooms/p1"), "p1", "iphone");
    expect(links.map((l) => l.screen.label)).toEqual(["Settings", "Rooms"]);
    expect(links.map((l) => l.path)).toEqual(["/iphone/settings/p1", "/iphone/rooms/p1"]);
    expect(links.filter((l) => l.on).map((l) => l.screen.id)).toEqual(["rooms"]);
  });

  it("knows which screens each kind has of its own", () => {
    const of = (id: string) => ({ id } as Parameters<typeof rowHasScreen>[0]);
    expect(rowHasScreen(of("voice"), "watch")).toBe(true);
    expect(rowHasScreen(of("voice"), "iphone")).toBe(false);
    expect(rowHasScreen(of("rooms"), "iphone")).toBe(true);
    expect(rowHasScreen(of("settings"), "iphone")).toBe(true);
    for (const id of ["pages", "menus", "status-pages", "watch-complications", "http-actions"]) expect(rowHasScreen(of(id), "watch"), id).toBe(false);
  });

  it("ends on the Pages board focused on the device", () => {
    expect(watchRowBoardPath("w1")).toBe("/all-pages/w1");
    expect(watchRowBoardPath(undefined)).toBe("/all-pages");
  });

  it("never puts a whole-home screen in a device's row: they have a row of their own, with no watch in their addresses", () => {
    const own = watchRowLinks(route("/rooms/w1"), "w1").map((l) => l.screen.id);
    for (const id of ["http-actions", "cameras"]) expect(own).not.toContain(id);
    const links = sharedRowLinks(route("/cameras"));
    expect(links.map((l) => l.path)).toEqual(["/http-actions", "/cameras"]);
    expect(sharedRowLinks(route("/http-actions")).filter((l) => l.on).map((l) => l.screen.id)).toEqual(["http-actions"]);
    expect(links.filter((l) => l.on).map((l) => l.screen.id)).toEqual(["cameras"]);
  });

  it("leaves the watch out of the address while there is none, and encodes it when there is", () => {
    expect(watchRowLinks(route("/rooms"), undefined).map((l) => l.path)[0]).toBe("/settings");
    expect(watchRowLinks(route("/rooms"), "a/b").map((l) => l.path)[0]).toBe("/settings/a%2Fb");
  });
});

describe("the row as drawn", () => {
  it("puts the device first, then its own screens and the Pages link, Rooms marked as on show", () => {
    const { text } = row();
    for (const gone of [">HTTP actions</a>", ">Cameras</a>", ">Menus</a>", ">Status pages</a>", ">Complications</a>", ">Control Center</a>"]) expect(text, gone).not.toContain(gone);
    const order = [`class="wa-wr-picker"`, ">Settings</a>", ">Rooms</a>", ">Voice</a>", `class="wa-wr-link to-board"`];
    const places = order.map((part) => text.indexOf(part));
    for (const [i, at] of places.entries()) expect(at, order[i]).toBeGreaterThan(-1);
    expect([...places].sort((a, b) => a - b)).toEqual(places);
    expect(text.match(/class="wa-wr-link on"/g)).toHaveLength(1);
    expect(text).toMatch(/class="wa-wr-link on"\s+href=\/wrist-assistant\/rooms\/w1 aria-current=page/);
    expect(text).toContain("href=/wrist-assistant/voice/w1");
    expect(text).toContain(`class="wa-wr-link to-board" href=/wrist-assistant/all-pages/w1`);
    expect(text).toContain("title=This watch's pages, on the Pages board");
    expect(text).toContain("aria-label=This watch's own");
    expect(text).toContain(`<b class="wa-wr-name">Jesse's Watch</b>`);
    expect(text).not.toContain("wa-wr-menu");
  });

  it("opens a menu of the watches with a check on the shown one and their verdicts, and no phones line", () => {
    const { text } = row({ menuOpen: true });
    const menu = text.slice(text.indexOf(`class="wa-wr-menu"`));
    expect(menu).toContain(">You are editing</div>");
    expect(menu.match(/class="wa-wr-row /g)).toHaveLength(2);
    expect(menu).toMatch(/class="wa-wr-row on tinted" role="menuitemradio"\s+style=--dc:var\(--wa-person-1\)\s+aria-checked=true data-watch=w1/);
    // Each device's row has its own color on its edge, as on the Pages tab.
    expect(menu).toMatch(/style=--dc:var\(--wa-person-2\)\s+aria-checked=false data-watch=w2/);
    expect(menu).toContain(`<span class="wa-wr-check" aria-hidden="true">`);
    expect(menu).toContain(`<i class="wa-wr-dot waiting" aria-hidden="true"></i><span class="wa-wr-row-name">Chen's Watch</span>`);
    expect(menu).toContain(`<span class="wa-wr-sync">Waiting</span>`);
    expect(menu).not.toContain("wa-wr-menu-sub");
    expect(menu).not.toContain("wa-wr-menu-note");
    expect(menu).not.toContain("Phones only get");
  });

  it("lists the iPhones under the watches in a home with phone pages, each under its own head", () => {
    const { text, tpl, calls } = row({ owners: WITH_PHONE, phones: true, menuOpen: true });
    const menu = text.slice(text.indexOf(`class="wa-wr-menu"`));
    expect(menu).toContain(`aria-label="Devices"`);
    const order = [">Watches</div>", "data-watch=w1", "data-watch=w2", ">iPhones</div>", "data-watch=p1 data-kind=iphone"].map((p) => menu.indexOf(p));
    expect(order.every((at) => at > 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    // The toggle, then the three devices: an iPhone is a pick like a watch.
    handlers(tpl, "@click")[3]!(click);
    expect(calls).toEqual(["menu:false", "pick:p1"]);
  });

  it("sends a pick, a screen, the Pages link and the menu's toggle to the panel", () => {
    const shut = row();
    const [toggle, settings, , voice, board] = handlers(shut.tpl, "@click");
    toggle!(click);
    settings!(click);
    voice!(click);
    board!(click);
    expect(shut.calls).toEqual(["menu:true", "go:/settings/w1", "go:/voice/w1", "go:/all-pages/w1"]);
    expect(shut.text).toContain("href=/wrist-assistant/settings/w1");

    const open = row({ menuOpen: true });
    const clicks = handlers(open.tpl, "@click");
    // The toggle, then the two watches.
    clicks[1]!(click);
    clicks[2]!(click);
    expect(open.calls).toEqual(["menu:false", "menu:false", "pick:w2"]);
    const [escape] = handlers(open.tpl, "@keydown");
    escape!({ key: "Escape", stopPropagation: () => undefined });
    expect(open.calls.at(-1)).toBe("menu:false");
  });

  it("leaves a press on the screen on show, and a ⌘ click, to stay put or to the browser", () => {
    const { tpl, calls } = row();
    const links = handlers(tpl, "@click");
    links[2]!(click);
    links[1]!({ ...click, metaKey: true });
    links[4]!({ ...click, metaKey: true });
    expect(calls).toEqual([]);
  });

  it("goes back to Home first", () => {
    const calls: string[] = [];
    const { tpl, text } = row({ onHome: () => calls.push("home") });
    expect(text.indexOf(`class="wa-wr-home"`)).toBeLessThan(text.indexOf(`class="wa-wr-picker"`));
    const [home] = handlers(tpl, "@click");
    home!(click);
    expect(calls).toEqual(["home"]);
  });

  it("gives the chip Home's verdict when the panel has one, so it never says Synced over a waiting screen", () => {
    const { text } = row({ syncs: new Map([["w1", "waiting"]]) });
    expect(text).toMatch(/<i class="wa-wr-dot waiting" aria-hidden="true"><\/i>[^<]*Waiting/);
  });

  it("names no device on a screen of the whole home, and links only its two screens", () => {
    const { text } = row({ route: route("/http-actions"), onHome: () => undefined });
    expect(text).toContain(SHARED_ROW_LABEL);
    expect(text).not.toContain("wa-wr-picker");
    expect(text).toContain(">HTTP actions</a>");
    expect(text).toContain(">Cameras</a>");
    expect(text).not.toContain(">Pages</a>");
    expect(text).not.toContain(">Settings</a>");
  });

  it("names a lone watch plainly, with no menu, and opens a menu once an iPhone with pages joins it", () => {
    const { text } = row({ owners: [OWNERS[0]!, OWNERS[1]!] });
    expect(text).toContain(`<span class="wa-wr-id"><b class="wa-wr-name">Jesse's Watch</b>`);
    expect(text).toMatch(/<span class="wa-wr-watch" title=The watch you are setting up>/);
    expect(text).not.toContain("wa-wr-open");
    expect(text).not.toContain("wa-wr-picker");
    const withPhone = row({ owners: [WITH_PHONE[0]!, WITH_PHONE[1]!], phones: true }).text;
    expect(withPhone).toContain(`class="wa-wr-picker"`);
    expect(withPhone).toContain(`title="Pick the device to set up"`);
  });

  it("offers pairing in a home with no watch, with Settings, no other screen and no Pages link", () => {
    const { text, tpl, calls } = row({ owners: [OWNERS[1]!], watch: undefined, route: route("/rooms") });
    expect(text).toContain(`class="wa-wr-pair"`);
    expect(text).toContain(">Pair a watch</span>");
    expect(text).toContain(WATCH_ROW_NONE_NOTE);
    expect(text).not.toContain(">Rooms</a>");
    expect(text).not.toContain("to-board");
    expect(text).toContain(">Settings</a>");
    const [pair, settings] = handlers(tpl, "@click");
    pair!(click);
    settings!(click);
    expect(calls).toEqual(["go:/settings", "go:/settings"]);
  });

  it("offers pairing on a watch's screen in a home whose only device is an iPhone", () => {
    const { text, tpl, calls } = row({ owners: [WITH_PHONE[1]!], watch: undefined, phones: true, route: route("/rooms") });
    expect(text).not.toContain("Jesse's iPhone");
    expect(text).toContain(`class="wa-wr-pair"`);
    expect(text).toContain(WATCH_ROW_NONE_NOTE);
    expect(text).not.toContain(">Rooms</a>");
    const [pair] = handlers(tpl, "@click");
    pair!(click);
    expect(calls).toEqual(["go:/settings"]);
  });

  it("says Loading while the devices are not in, never Pair a watch", () => {
    const { text } = row({ owners: [], watch: undefined, loaded: false });
    expect(text).toContain("Loading…");
    expect(text).not.toContain("Pair a watch");
    expect(text).toContain(">Rooms</a>");
    expect(text).not.toContain("to-board");
  });

  it("marks Settings on the Settings page, and leaves a press on it where it is", () => {
    const on = row({ route: route("/settings/w1") });
    expect(on.text).toMatch(/class="wa-wr-link on"\s+href=\/wrist-assistant\/settings\/w1 aria-current=page/);
    expect(on.text.match(/ on"/g)).toHaveLength(1);
    const links = handlers(on.tpl, "@click");
    links[1]!(click);
    expect(on.calls).toEqual([]);
    expect(row().text).toMatch(/class="wa-wr-link "\s+href=\/wrist-assistant\/settings\/w1 aria-current=false/);
  });
});

describe("unsaved work across the screens", () => {
  const names = (dirty: Parameters<typeof unsavedScreens>[0]) => unsavedScreens(dirty).map((s) => s.label);
  const notice = (dirty: Parameters<typeof unsavedScreens>[0], shown: Parameters<typeof unsavedNotice>[1]) => {
    const pieces = unsavedNotice(unsavedScreens(dirty), shown);
    return pieces === undefined ? undefined : unsavedNoticeText(pieces);
  };

  it("lists the unsaved screens in the row's order, Settings last", () => {
    expect(names({ settings: true, menus: true, pages: true, cameras: false })).toEqual(["Pages", "Menus", "Settings"]);
    expect(names({})).toEqual([]);
  });

  it("says nothing while only the screen on show is unsaved", () => {
    expect(notice({ pages: true }, "pages")).toBeUndefined();
    expect(notice({}, "pages")).toBeUndefined();
  });

  it("names one other screen on its own", () => {
    expect(notice({ menus: true }, "pages")).toBe("Menus has unsaved changes.");
    expect(notice({ settings: true }, undefined)).toBe("Settings has unsaved changes.");
  });

  it("counts every unsaved screen, the one on show too, and joins the names plainly", () => {
    expect(notice({ pages: true, menus: true }, "pages")).toBe("2 screens have unsaved changes: Pages and Menus.");
    expect(notice({ pages: true, menus: true, voice: true }, "voice")).toBe("3 screens have unsaved changes: Pages, Menus and Voice.");
  });

  it("dots each unsaved screen in the row, named for a screen reader", () => {
    const { text } = row({ route: route("/voice/w1"), unsaved: unsavedScreens({ rooms: true, settings: true }) });
    expect(text).toMatch(/>Rooms<i class="wa-unsaved" role="img" aria-label="unsaved changes"><\/i><\/a>/);
    expect(text).toMatch(/>Settings<i class="wa-unsaved"/);
    expect(text).toContain(">Voice</a>");
  });

  it("draws the bar only while another screen is unsaved, each other screen a link there on the shared watch", () => {
    expect(row({ route: route("/pages/w1"), unsaved: unsavedScreens({ pages: true }) }).text).not.toContain("wa-wr-unsaved");
    const { text, tpl, calls } = row({ route: route("/pages/w1"), unsaved: unsavedScreens({ pages: true, menus: true }) });
    expect(text).toContain('class="wa-wr-unsaved" role="status"');
    expect(text).toContain("2 screens have unsaved changes: <b>Pages</b> and <a href=/wrist-assistant/menus/w1 @click=>Menus</a>.");
    handlers(tpl, "@click").at(-1)!(click);
    expect(calls).toEqual(["go:/menus/w1"]);
  });

  it("says what each screen is, and how it is used on the watch, in its tab's hover card, and nothing for a retired one", () => {
    const { text } = row({ route: route("/rooms/w1") });
    expect(text).not.toContain("wa-wr-blurb");
    // A screen's tab has a hover card, not a title; the Pages link, which
    // leaves for another tab, has a plain title.
    expect(text).not.toMatch(/class="wa-wr-link (?!to-board)[^"]*"[^>]*title=/);
    expect(text).toContain("aria-describedby=wa-wr-tip-rooms");
    expect(text).toContain(`id=wa-wr-tip-rooms popover="manual" role="tooltip"`);
    expect(text).toContain(watchScreenSentence(WATCH_SCREENS.find((s) => s.id === "rooms")!));
    expect(text).toContain(SCREEN_HOW_TO.rooms.how);
    expect(text).toContain(SCREEN_HOW_TO.voice.how);
    expect(text).toContain("Settings sets how the watch behaves");
    expect(text).not.toContain("wa-wr-tip-pages");
    expect(text).not.toContain("wa-wr-tip-control-center");
    expect(watchRowLinkTitle(WATCH_SCREENS.find((s) => s.id === "control-center")!)).toBeUndefined();
    expect(watchRowLinkTitle(WATCH_SCREENS[1]!)).toBe(watchScreenSentence(WATCH_SCREENS[1]!));
  });
});

describe("the phone's line of screens", () => {
  it("centres the link on show, held inside the line's ends, and leaves a line that fits alone", () => {
    expect(rowScrollFor({ width: 300, scrollWidth: 300 }, { left: 200, width: 60 })).toBeUndefined();
    expect(rowScrollFor({ width: 300, scrollWidth: 800 }, { left: 400, width: 60 })).toBe(280);
    expect(rowScrollFor({ width: 300, scrollWidth: 800 }, { left: 20, width: 60 })).toBe(0);
    expect(rowScrollFor({ width: 300, scrollWidth: 800 }, { left: 760, width: 60 })).toBe(500);
  });

  it("marks more past the right edge until the line is scrolled to its end", () => {
    const box = (scrollLeft: number, scrollWidth = 800) => {
      const attrs = new Set<string>();
      markRowMore({ scrollWidth, clientWidth: 300, scrollLeft, toggleAttribute: (n: string, on: boolean) => { if (on) attrs.add(n); else attrs.delete(n); return on; } } as unknown as HTMLElement);
      return attrs.has("data-more");
    };
    expect(box(0)).toBe(true);
    expect(box(499.5)).toBe(false);
    expect(box(0, 300)).toBe(false);
  });

  it("marks more past the left edge once the line is scrolled from its start", () => {
    const back = (scrollLeft: number, scrollWidth = 800) => {
      const attrs = new Set<string>();
      markRowMore({ scrollWidth, clientWidth: 300, scrollLeft, toggleAttribute: (n: string, on: boolean) => { if (on) attrs.add(n); else attrs.delete(n); return on; } } as unknown as HTMLElement);
      return attrs.has("data-back");
    };
    expect(back(0)).toBe(false);
    expect(back(120)).toBe(true);
    expect(back(500)).toBe(true);
    expect(back(0, 300)).toBe(false);
  });
});

describe("the row's look", () => {
  const text = watchRowStyles.cssText;
  const rule = (sel: string) => text.slice(text.indexOf(sel), text.indexOf("}", text.indexOf(sel)));

  it("reads only tokens, never a fixed color, and never selects on the dark attribute", () => {
    expect(text).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(text).not.toMatch(/rgba?\(/);
    expect(text).not.toContain("[dark]");
    expect(text).not.toContain("purple");
    expect(text).not.toContain("radial-gradient");
    // The one gradient is the phone line's fade mask, never a wash.
    for (const line of text.split("\n").filter((l) => l.includes("gradient"))) expect(line).toMatch(/^\s*(-webkit-)?mask-image: linear-gradient/);
  });

  it("keeps the section hues off the row's rules: a tab's glyph takes its screen's hue (--h) only while it is on show", () => {
    expect(text).not.toContain("--wa-hue");
    expect(rule("a.wa-wr-link.on .wa-wr-ic {")).toContain("color: var(--h)");
    expect(rule("a.wa-wr-link .wa-wr-ic {")).toContain("color: var(--wa-faint)");
    expect(rule("a.wa-wr-link {")).not.toContain("var(--h)");
  });

  it("gives each screen Home's glyph and hue for it, and no purple", () => {
    for (const screen of [...WATCH_SCREENS, WATCH_SETTINGS_SCREEN]) {
      const look = WATCH_SCREEN_LOOK[screen.id];
      expect(look.hue).toMatch(/^var\(--wa-hue-(green|orange|yellow|pink|red|blue|grey)\)$/);
      if (screen.shared === true || screen.retired === true) continue;
      const door = homeDoorLook({ kind: "screen", label: screen.label, screen } as DeviceSheetTab, "watch");
      expect([look.icon, look.hue], screen.id).toEqual([door.icon, door.hue]);
    }
    expect(WATCH_SCREEN_LOOK["http-actions"].hue).toBe("var(--wa-hue-blue)");
    expect(WATCH_SCREEN_LOOK.cameras.hue).toBe("var(--wa-hue-grey)");
  });

  it("outlines the watch's chip, the pairing button and the menu's rows with one pixel, and the track once round its tabs", () => {
    for (const sel of [".wa-wr-watch, button.wa-wr-open {", "  button.wa-wr-pair {", "button.wa-wr-row {"]) {
      expect(rule(sel), sel).toMatch(/border: 1px solid var\(--wa-line(-strong)?\)/);
    }
    expect(rule("nav.wa-wr-links {")).toContain("border: 1px solid var(--wa-line)");
    expect(rule("a.wa-wr-link {")).toContain("border: 0");
  });

  it("is one row: the tab on show raised in grey, the track one line that scrolls sideways, fading while more is hidden", () => {
    const on = rule("a.wa-wr-link.on {");
    expect(on).toContain("font-weight: 500");
    expect(on).toContain("background: var(--wa-hover)");
    expect(rule(".wa-watchrow {")).toContain("flex-wrap: nowrap");
    expect(rule(".wa-watchrow {")).toContain("min-height: 60px");
    const track = rule("nav.wa-wr-links {");
    for (const want of ["flex-wrap: nowrap", "overflow-x: auto", "scrollbar-width: none"]) expect(track).toContain(want);
    expect(text).toMatch(/nav\.wa-wr-links\[data-more\] \{\s*-webkit-mask-image/);
    expect(text).toMatch(/nav\.wa-wr-links\[data-back\] \{\s*-webkit-mask-image/);
    expect(rule("a.wa-wr-link {")).toContain("height: 32px");
  });

  it("never cuts a name short with an ellipsis", () => {
    expect(text).not.toContain("text-overflow: ellipsis");
    expect(rule(".wa-wr-name {")).toContain("overflow-wrap: anywhere");
  });

  it("on a phone puts the watch and the save controls on the first line and the screens on a second that scrolls sideways", () => {
    const phone = text.slice(text.indexOf("@media (max-width: 640px)"));
    expect(phone).toContain(".wa-watchrow { flex-wrap: wrap;");
    expect(phone).toMatch(/\.wa-wr-end \{ order: 1; flex: 1 1 0;/);
    expect(phone).toMatch(/nav\.wa-wr-links \{ order: 3; flex: 1 1 100%; scroll-snap-type: x/);
    expect(phone).toContain("scroll-snap-align: start");
  });

  it("titles the menu in small capitals, weight 500, spaced", () => {
    const head = rule(".wa-wr-menu-h {");
    expect(head).toContain("font-weight: 500");
    expect(head).toContain("text-transform: uppercase");
    expect(head).toContain("letter-spacing");
  });
});
