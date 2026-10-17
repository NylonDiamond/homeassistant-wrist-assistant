// Getting started: the three steps the Help sheet shows, the words it says,
// the Help button in the tab bar, and the sheet flattened to text. The
// panel's wiring is read from its source, since no test mounts the panel.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  REPORT_PROBLEM_URL,
  SETUP_GUIDE_URL,
  TROUBLESHOOTING_URL,
  doneWords,
  gettingStarted,
  helpStepWords,
  watchesWithPages,
} from "../src/getting-started.js";
import type { OwnerSummary, WatchConfigSummary } from "../src/ha-api.js";
import { HELP_LIBRARY_TEXT, helpScreen, renderHelpSheet } from "../src/help-sheet.js";
import { IPHONE_SCREENS, WATCH_SCREENS, WATCH_SETTINGS_SCREEN, iphoneScreenPath, renderTabBar } from "../src/shell.js";
import { WATCH_CAMERAS_HELP_URL } from "../src/watch-cameras/hook.js";
import { WATCH_CONTROL_CENTER_HELP_URL } from "../src/watch-control-center/hook.js";
import { WATCH_HTTP_ACTIONS_HELP_URL } from "../src/watch-http-actions/hook.js";
import { WATCH_MENUS_HELP_URL } from "../src/watch-menus/hook.js";
import { WATCH_PAGES_HELP_URL } from "../src/watch-pages/hook.js";
import { WATCH_ROOMS_HELP_URL } from "../src/watch-rooms/hook.js";
import { WATCH_STATUS_PAGES_HELP_URL } from "../src/watch-status-pages/hook.js";
import { WATCH_VOICE_HELP_URL } from "../src/watch-voice/hook.js";

const owner = (over: Partial<OwnerSummary> = {}): OwnerSummary => ({
  owner_watch_id: "w1",
  device_name: "Jesse Apple Watch",
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.1",
  screen_size: null,
  complication_count: 0,
  token: 1,
  applied_token: 1,
  is_orphan: false,
  ...over,
} as OwnerSummary);

const phone = owner({ owner_watch_id: "p1", device_name: "iPhone", device_kind: "iphone" });
const library = owner({ owner_watch_id: "library", device_name: null, device_kind: "library" });
const orphan = owner({ owner_watch_id: "old", is_orphan: true, device_kind: null });

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

describe("gettingStarted", () => {
  it("has nothing done in a home with no device, with Get the app next", () => {
    const gs = gettingStarted([], undefined);
    expect(gs.steps.map((s) => [s.id, s.done])).toEqual([["app", false], ["pair", false], ["page", false]]);
    expect(gs.done).toBe(0);
    expect(gs.next).toBe("app");
    expect(gs.watch).toBeUndefined();
    expect(gs.known).toBe(true);
  });

  it("counts neither the Library nor an orphan as a device", () => {
    const gs = gettingStarted([library, orphan], new Set());
    expect(gs.done).toBe(0);
    expect(gs.next).toBe("app");
  });

  it("takes an iPhone alone as having the app, but not a paired watch", () => {
    const gs = gettingStarted([phone], undefined);
    expect(gs.steps.map((s) => s.done)).toEqual([true, false, false]);
    expect(gs.next).toBe("pair");
    expect(gs.watch).toBeUndefined();
  });

  it("is two of three with a watch and no page, New page on that watch", () => {
    const gs = gettingStarted([owner()], new Set());
    expect(gs.done).toBe(2);
    expect(gs.next).toBe("page");
    expect(gs.watch).toBe("w1");
    expect(gs.watchNames).toEqual(["Jesse Apple Watch"]);
    expect(gs.known).toBe(true);
  });

  it("is all done once any watch has a page", () => {
    const gs = gettingStarted([owner(), owner({ owner_watch_id: "w2" })], new Set(["w2"]));
    expect(gs.done).toBe(3);
    expect(gs.next).toBeUndefined();
  });

  it("does not know the page step until the pages are read, when there is a watch", () => {
    expect(gettingStarted([owner()], undefined).known).toBe(false);
    expect(gettingStarted([phone], undefined).known).toBe(true);
  });

  it("opens New page on the shared watch when it is a watch of the home, else the first", () => {
    const watches = [owner(), owner({ owner_watch_id: "w2" })];
    expect(gettingStarted(watches, new Set(), "w2").watch).toBe("w2");
    expect(gettingStarted(watches, new Set(), "gone").watch).toBe("w1");
    expect(gettingStarted([...watches, phone], new Set(), "p1").watch).toBe("w1");
  });
});

describe("watchesWithPages", () => {
  const delivery = (items?: number) => ({ revision: 1, delivered_revision: 1, rejected_revision: 0, ...(items === undefined ? {} : { items }) });
  const summary = (owners: WatchConfigSummary["owners"]): WatchConfigSummary => ({ owners });

  it("lists a watch whose pages record holds a page", () => {
    expect([...watchesWithPages(summary({ w1: { pages: delivery(2) } }), ["w1"])]).toEqual(["w1"]);
  });

  it("leaves out a watch with no pages record, or one that lists no page", () => {
    const s = summary({ w1: { menus: delivery() }, w2: { pages: delivery(0) } });
    expect([...watchesWithPages(s, ["w1", "w2", "w3"])]).toEqual([]);
  });

  it("takes the record itself as the page when the integration sends no counts", () => {
    expect([...watchesWithPages(summary({ w1: { pages: delivery() } }), ["w1"])]).toEqual(["w1"]);
  });

  it("only asks about the watches it is given", () => {
    expect([...watchesWithPages(summary({ w9: { pages: delivery(1) } }), ["w1"])]).toEqual([]);
  });
});

describe("the words", () => {
  it("count the steps done", () => {
    expect(doneWords(2)).toBe("2 of 3 done");
  });

  it("name the paired watch in Help, or how many", () => {
    expect(helpStepWords("pair", gettingStarted([owner()], new Set())).text).toBe("Jesse Apple Watch is paired.");
    const two = gettingStarted([owner(), owner({ owner_watch_id: "w2", device_name: "Other" })], new Set());
    expect(helpStepWords("pair", two).text).toBe("2 watches are paired.");
    expect(helpStepWords("pair", gettingStarted([], undefined)).text).toBe("Type the code the watch shows.");
    expect(helpStepWords("app", gettingStarted([phone], undefined)).text).toBe("Wrist Assistant is on the App Store.");
  });
});

describe("the Help button", () => {
  const at = (path: string) => ({ prefix: "/wrist-assistant", path });

  it("sits at the end of the tab bar when the panel asks for it", () => {
    const text = flat(renderTabBar({ route: at(""), menu: false, onMenu: () => undefined, onTab: () => undefined, onHelp: () => undefined }));
    expect(text).toContain("<span>Help</span></button>");
    expect(text.indexOf("wa-tabs-help")).toBeGreaterThan(text.indexOf("Complications</a>"));
    expect(flat(renderTabBar({ route: at(""), menu: false, onMenu: () => undefined, onTab: () => undefined }))).not.toContain("wa-tabs-help");
  });
});

describe("the Help sheet", () => {
  const at = (path: string) => ({ prefix: "/wrist-assistant", path });
  const sheet = (path: string, gs = gettingStarted([owner()], new Set()), editor = false) => flat(renderHelpSheet({
    gs, route: at(path), version: "3.1.2",
    onClosed: () => undefined, onPair: () => undefined, onNewPage: () => undefined,
    ...(editor ? { onEditorHelp: () => undefined } : {}),
  }));

  it("names the screen in view: Home, Complications, and each watch screen by its own blurb", () => {
    expect(helpScreen(at(""))).toMatchObject({ name: "Home" });
    expect(helpScreen(at("")).text).toContain("Its Library holds what every device shares: HTTP actions and camera framing.");
    expect(helpScreen(undefined).name).toBe("Home");
    expect(helpScreen(at("/complications")).name).toBe("Complications");
    for (const screen of [...WATCH_SCREENS, WATCH_SETTINGS_SCREEN]) {
      const h = helpScreen(at(screen.path));
      expect(h.name).toBe(screen.label);
      expect(h.text[0]).toContain(screen.blurb.trim().replace(/[.!?]$/, ""));
    }
    expect(helpScreen(at("/http-actions")).text[1]).toBe(HELP_LIBRARY_TEXT);
    expect(helpScreen(at("/cameras")).text).toEqual([
      "Cameras sets how each camera's picture is framed in alerts, the same on the watch and the iPhone.",
      "It is in Home's Library, shared by every device in this home.",
    ]);
    expect(helpScreen(at("/photos")).name).toBe("Home");
    expect(helpScreen(at("/pages/w1")).text[1]).toBe("It is for the watch picked at the top.");
  });

  it("names the Pages tab, and says an info page is a status page", () => {
    const h = helpScreen(at("/all-pages"));
    expect(h.name).toBe("Pages");
    expect(h.more).toBe(WATCH_PAGES_HELP_URL);
    expect(h.text.join(" ")).toContain("An info page is a status page");
    for (const line of h.text) expect(line).not.toMatch(/[–—]| - /);
  });

  it("links each screen's guide, the page its bar's old ? opened", () => {
    const guides: Record<string, string | undefined> = {
      "pages": WATCH_PAGES_HELP_URL,
      "menus": WATCH_MENUS_HELP_URL,
      "status-pages": WATCH_STATUS_PAGES_HELP_URL,
      "control-center": WATCH_CONTROL_CENTER_HELP_URL,
      "rooms": WATCH_ROOMS_HELP_URL,
      "voice": WATCH_VOICE_HELP_URL,
      "http-actions": WATCH_HTTP_ACTIONS_HELP_URL,
      "cameras": WATCH_CAMERAS_HELP_URL,
      "watch-complications": undefined,
      "settings": undefined,
    };
    for (const screen of [...WATCH_SCREENS, WATCH_SETTINGS_SCREEN]) {
      expect(screen.id in guides, screen.id).toBe(true);
      expect(helpScreen(at(screen.path)).more, screen.id).toBe(guides[screen.id]);
    }
    expect(helpScreen(at("/pages/w1")).more).toBe(WATCH_PAGES_HELP_URL);
    const text = sheet("/pages/w1");
    expect(text).toContain("On this screen: Pages");
    expect(text).toContain(`href=${WATCH_PAGES_HELP_URL}`);
    expect(text).toContain(">More about Pages</a>");
  });

  it("names an iPhone's screen on the iPhone app, with the same guide, not Home", () => {
    for (const screen of [...IPHONE_SCREENS, WATCH_SETTINGS_SCREEN]) {
      const h = helpScreen(at(iphoneScreenPath(screen, "p1")));
      expect(h.name).toBe(screen.label);
      expect(h.text[1]).toBe("It is for the iPhone picked at the top.");
      expect(h.more).toBe(helpScreen(at(screen.path)).more);
    }
    expect(helpScreen(at("/iphone")).name).toBe("Pages");
    expect(sheet("/iphone/pages/p1")).toContain(`href=${WATCH_PAGES_HELP_URL}`);
    // A watch only screen behind /iphone is no iPhone screen.
    expect(helpScreen(at("/iphone/voice/p1")).name).toBe("Home");
  });

  it("shows the steps with a green bar, and the open step's action only", () => {
    const text = sheet("");
    expect(text).toContain("2 of 3 done");
    expect(text).toContain("width:67%");
    expect(text).toContain("Jesse Apple Watch is paired.");
    expect(text).toContain(">New page</button>");
    expect(text).not.toContain(">Pair a device</button>");
    expect(text).not.toContain(">Open the App Store</a>");
  });

  it("lists the three guides and the version", () => {
    const text = sheet("/menus");
    expect(text).toContain("On this screen: Menus");
    for (const url of [SETUP_GUIDE_URL, TROUBLESHOOTING_URL, REPORT_PROBLEM_URL]) expect(text).toContain(`href=${url}`);
    expect(text).toContain("Wrist Assistant 3.1.2");
    expect(text).not.toContain("welcome card");
  });

  it("links the editor's own Help only when the panel hands it over", () => {
    expect(sheet("/complications", undefined, true)).toContain("How the editor works");
    expect(sheet("/complications")).not.toContain("How the editor works");
  });

  it("never uses a dash to break a sentence", () => {
    for (const path of ["", "/complications", ...[...WATCH_SCREENS, WATCH_SETTINGS_SCREEN].map((s) => s.path)]) {
      expect(helpScreen(at(path)).text.join(" ")).not.toMatch(/[–—]| - /);
    }
  });
});

describe("the panel's wiring", () => {
  const SOURCE = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");
  const method = (signature: string) => {
    const at = SOURCE.indexOf(signature);
    if (at < 0) throw new Error(`no ${signature}`);
    return SOURCE.slice(at, SOURCE.indexOf("\n  }\n", at));
  };

  it("no longer draws a welcome card on Home: a home with no devices gets the welcome instead", () => {
    const home = method("  private renderHome() {");
    expect(SOURCE).not.toContain("renderWelcome()");
    expect(home).toContain("if (!failed && !loading && devices.length === 0) return html`${error}${this.renderHomeWelcome(scope)}${pair}`;");
  });

  it("gives the tab bar its Help button and draws the sheet over every tab", () => {
    const render = method("  override render() {");
    expect(render).toContain("onHelp: () => this.openHelpSheet()");
    expect(render).toContain("${this.helpSheetOpen ? this.renderHelpSheet() : nothing}");
  });

  it("opens New page on the Pages screen of the step's watch", () => {
    expect(method("  private renderHelpSheet() {")).toContain("this.goTo(watchScreenPath(WATCH_SCREENS[0]!, watch))");
  });

  it("puts focus back on the Help button when the sheet closes by itself", () => {
    expect(method("  private renderHelpSheet() {")).toContain("onClosed: () => this.closeHelpSheet(true)");
    expect(method("  private closeHelpSheet(")).toContain(`querySelector<HTMLElement>("button.wa-tabs-help")?.focus()`);
  });
});
