// The Watch app tab's header row: the shared watch at the left (a menu of
// watches, one plain name, or the way to pair the first), then the eight
// screens (on that watch, but HTTP actions and Cameras, which every watch
// shares) and Settings as one track, the screen on show marked, then the
// screen's own save controls. Read from its helpers and by flattening the
// template it draws.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { type DeviceSheetTab, homeDoorLook } from "../src/home.js";
import { WATCH_SCREENS, WATCH_SETTINGS_SCREEN, watchScreenSentence } from "../src/shell.js";
import {
  WATCH_ROW_NONE_NOTE,
  WATCH_SCREEN_LOOK,
  WATCH_ROW_PHONES_NOTE,
  type WatchRowInput,
  markRowMore,
  renderWatchRow,
  rowScrollFor,
  unsavedNotice,
  unsavedNoticeText,
  unsavedScreens,
  watchRowChoices,
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

const route = (path: string) => ({ prefix: "/wrist-assistant", path });

function row(over: Partial<WatchRowInput> = {}) {
  const calls: string[] = [];
  const input: WatchRowInput = {
    route: route("/menus/w1"),
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
});

describe("the row's screen links", () => {
  it("walks the seven screens in Home's order, each on the shared watch but HTTP actions and Cameras, the one on show marked", () => {
    const links = watchRowLinks(route("/status-pages/w1"), "w2");
    expect(links.map((l) => l.screen.label)).toEqual(["Pages", "Menus", "Status pages", "Rooms", "Voice", "HTTP actions", "Cameras"]);
    expect(links.map((l) => l.path)).toEqual(["/pages/w2", "/menus/w2", "/status-pages/w2", "/rooms/w2", "/voice/w2", "/http-actions", "/cameras"]);
    expect(links.filter((l) => l.on).map((l) => l.screen.id)).toEqual(["status-pages"]);
  });

  it("leaves the retired Control Center out, unless an old link has it on show", () => {
    expect(watchRowLinks(route("/pages/w1"), "w1").map((l) => l.screen.id)).not.toContain("control-center");
    const links = watchRowLinks(route("/control-center/w1"), "w1");
    expect(links.map((l) => l.screen.id)).toContain("control-center");
    expect(links.filter((l) => l.on).map((l) => l.screen.id)).toEqual(["control-center"]);
  });

  it("marks HTTP actions on its own address, and keeps the shared watch on every other link from there", () => {
    const links = watchRowLinks(route("/http-actions"), "w2");
    expect(links.filter((l) => l.on).map((l) => l.screen.id)).toEqual(["http-actions"]);
    expect(links[0]!.path).toBe("/pages/w2");
    expect(links.at(-2)!.path).toBe("/http-actions");
  });

  it("marks Cameras on its own address, with no watch in it", () => {
    const links = watchRowLinks(route("/cameras"), "w2");
    expect(links.filter((l) => l.on).map((l) => l.screen.id)).toEqual(["cameras"]);
    expect(links.at(-1)!.path).toBe("/cameras");
  });

  it("leaves the watch out of the address while there is none, and encodes it when there is", () => {
    expect(watchRowLinks(route("/pages"), undefined).map((l) => l.path)[0]).toBe("/pages");
    expect(watchRowLinks(route("/pages"), "a/b").map((l) => l.path)[0]).toBe("/pages/a%2Fb");
  });
});

describe("the row as drawn", () => {
  it("puts the watch first, then the seven screens and Settings, Menus marked as on show", () => {
    const { text } = row();
    expect(text).not.toContain(">Control Center</a>");
    const order = [`class="wa-wr-picker"`, ">Pages</a>", ">Menus</a>", ">Status pages</a>", ">Rooms</a>", ">Voice</a>", ">HTTP actions</a>", ">Cameras</a>", ">Settings</a>"];
    const places = order.map((part) => text.indexOf(part));
    for (const [i, at] of places.entries()) expect(at, order[i]).toBeGreaterThan(-1);
    expect([...places].sort((a, b) => a - b)).toEqual(places);
    expect(text.match(/class="wa-wr-link on"/g)).toHaveLength(1);
    expect(text).toMatch(/class="wa-wr-link on"\s+href=\/wrist-assistant\/menus\/w1 aria-current=page/);
    expect(text).toContain("href=/wrist-assistant/voice/w1");
    expect(text).toContain("href=/wrist-assistant/http-actions aria-current");
    expect(text).toContain("href=/wrist-assistant/cameras aria-current");
    expect(text).toContain(`<b class="wa-wr-name">Jesse's Watch</b>`);
    expect(text).not.toContain("wa-wr-menu");
  });

  it("opens a menu of the watches with a check on the shown one, their verdicts, and the phones line", () => {
    const { text } = row({ menuOpen: true });
    const menu = text.slice(text.indexOf(`class="wa-wr-menu"`), text.indexOf("</p>", text.indexOf(`class="wa-wr-menu-note"`)));
    expect(menu).toContain(">You are editing</div>");
    expect(menu.match(/class="wa-wr-row /g)).toHaveLength(2);
    expect(menu).toMatch(/class="wa-wr-row on" role="menuitemradio"\s+aria-checked=true data-watch=w1/);
    expect(menu).toContain(`<span class="wa-wr-check" aria-hidden="true">`);
    expect(menu).toContain(`<i class="wa-wr-dot waiting" aria-hidden="true"></i><span class="wa-wr-row-name">Chen's Watch</span>`);
    expect(menu).toContain(`<span class="wa-wr-sync">Waiting</span>`);
    expect(menu).toContain(WATCH_ROW_PHONES_NOTE);
    expect(menu).not.toContain("iPhone");
  });

  it("sends a pick, a screen, Settings and the menu's toggle to the panel, Settings as a page on the shared watch", () => {
    const shut = row();
    const [toggle, pages, , statusPages, , , httpActions, cameras, settings] = handlers(shut.tpl, "@click");
    toggle!(click);
    pages!(click);
    statusPages!(click);
    httpActions!(click);
    cameras!(click);
    settings!(click);
    expect(shut.calls).toEqual(["menu:true", "go:/pages/w1", "go:/status-pages/w1", "go:/http-actions", "go:/cameras", "go:/settings/w1"]);
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
    expect(calls).toEqual([]);
  });

  it("names a lone watch plainly, with no menu", () => {
    const { text } = row({ owners: [OWNERS[0]!, OWNERS[1]!] });
    expect(text).toContain(`<span class="wa-wr-id"><b class="wa-wr-name">Jesse's Watch</b>`);
    expect(text).toMatch(/<span class="wa-wr-watch" title="The watch you are setting up">/);
    expect(text).not.toContain("wa-wr-open");
    expect(text).not.toContain("wa-wr-picker");
  });

  it("offers pairing in a home with no watch, with Settings and no screens", () => {
    const { text, tpl, calls } = row({ owners: [OWNERS[1]!], watch: undefined, route: route("/pages") });
    expect(text).toContain(`class="wa-wr-pair"`);
    expect(text).toContain(">Pair a watch</span>");
    expect(text).toContain(WATCH_ROW_NONE_NOTE);
    expect(text).not.toContain(`<a class="wa-wr-link "`);
    expect(text).not.toContain(">Pages</a>");
    expect(text).toContain(">Settings</a>");
    const [pair, settings] = handlers(tpl, "@click");
    pair!(click);
    settings!(click);
    expect(calls).toEqual(["go:/settings", "go:/settings"]);
  });

  it("says Loading while the devices are not in, never Pair a watch", () => {
    const { text } = row({ owners: [], watch: undefined, loaded: false });
    expect(text).toContain("Loading…");
    expect(text).not.toContain("Pair a watch");
    expect(text).toContain(">Pages</a>");
  });

  it("marks Settings on the Settings page, and leaves a press on it where it is", () => {
    const on = row({ route: route("/settings/w1") });
    expect(on.text).toMatch(/class="wa-wr-link wa-wr-settings on"\s+href=\/wrist-assistant\/settings\/w1 aria-current=page/);
    expect(on.text.match(/ on"/g)).toHaveLength(1);
    const links = handlers(on.tpl, "@click");
    links.at(-1)!(click);
    expect(on.calls).toEqual([]);
    expect(row().text).toMatch(/class="wa-wr-link wa-wr-settings "\s+href=\/wrist-assistant\/settings\/w1 aria-current=false/);
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
    const { text } = row({ route: route("/pages/w1"), unsaved: unsavedScreens({ menus: true, settings: true }) });
    expect(text).toMatch(/>Menus<i class="wa-unsaved" role="img" aria-label="unsaved changes"><\/i><\/a>/);
    expect(text).toMatch(/>Settings<i class="wa-unsaved"/);
    expect(text).toContain(">Pages</a>");
  });

  it("draws the bar only while another screen is unsaved, each other screen a link there on the shared watch", () => {
    expect(row({ route: route("/pages/w1"), unsaved: unsavedScreens({ pages: true }) }).text).not.toContain("wa-wr-unsaved");
    const { text, tpl, calls } = row({ route: route("/pages/w1"), unsaved: unsavedScreens({ pages: true, menus: true }) });
    expect(text).toContain('class="wa-wr-unsaved" role="status"');
    expect(text).toContain("2 screens have unsaved changes: <b>Pages</b> and <a href=/wrist-assistant/menus/w1 @click=>Menus</a>.");
    handlers(tpl, "@click").at(-1)!(click);
    expect(calls).toEqual(["go:/menus/w1"]);
  });

  it("says what each screen is in its tab's tooltip, not on a line of its own, and nothing for a retired one", () => {
    const { text } = row({ route: route("/pages/w1") });
    expect(text).not.toContain("wa-wr-blurb");
    expect(text).toContain("title=Pages are the screens you swipe between on the watch: tiles for lights, scenes, cameras and more.");
    expect(text).toContain("title=Settings sets how the watch behaves");
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
