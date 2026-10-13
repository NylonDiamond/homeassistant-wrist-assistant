// Getting started: the three steps Home's welcome card and the Help sheet
// share, when the card shows, the words both say, the Help button in the
// tab bar, and the two drawings flattened to text. The panel's wiring is
// read from its source, since no test mounts the panel.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  APP_STORE_URL,
  CARD_STEPS,
  REPORT_PROBLEM_URL,
  SETUP_GUIDE_URL,
  TROUBLESHOOTING_URL,
  WELCOME_FACTS,
  WELCOME_FOOT,
  WELCOME_KEY,
  WELCOME_LEAD,
  type WelcomeStorage,
  doneWords,
  gettingStarted,
  helpStepWords,
  loadWelcomeMode,
  saveWelcomeMode,
  watchesWithPages,
  welcomeShows,
} from "../src/getting-started.js";
import type { OwnerSummary, WatchConfigSummary } from "../src/ha-api.js";
import { helpScreen, renderHelpSheet } from "../src/help-sheet.js";
import { WATCH_SCREENS, WATCH_SETTINGS_SCREEN, renderTabBar } from "../src/shell.js";
import { renderWelcomeCard } from "../src/welcome-card.js";

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

describe("the welcome card's mode", () => {
  const memory = () => {
    const map = new Map<string, string>();
    const storage: WelcomeStorage = {
      getItem: (k) => map.get(k) ?? null,
      setItem: (k, v) => { map.set(k, v); },
      removeItem: (k) => { map.delete(k); },
    };
    return { map, storage };
  };
  const broken: WelcomeStorage = {
    getItem: () => { throw new Error("blocked"); },
    setItem: () => { throw new Error("blocked"); },
    removeItem: () => { throw new Error("blocked"); },
  };

  it("is automatic with nothing stored, and reads back hidden and shown", () => {
    const { storage } = memory();
    expect(loadWelcomeMode(() => storage)).toBe("auto");
    saveWelcomeMode(() => storage, "hidden");
    expect(loadWelcomeMode(() => storage)).toBe("hidden");
    saveWelcomeMode(() => storage, "shown");
    expect(loadWelcomeMode(() => storage)).toBe("shown");
  });

  it("stores the two words under its own key, and automatic as no value", () => {
    const { map, storage } = memory();
    saveWelcomeMode(() => storage, "hidden");
    expect(map.get(WELCOME_KEY)).toBe("hidden");
    saveWelcomeMode(() => storage, "auto");
    expect(map.has(WELCOME_KEY)).toBe(false);
  });

  it("is automatic for anything else stored, and when storage throws or is missing", () => {
    const { map, storage } = memory();
    map.set(WELCOME_KEY, "maybe");
    expect(loadWelcomeMode(() => storage)).toBe("auto");
    expect(loadWelcomeMode(() => broken)).toBe("auto");
    expect(loadWelcomeMode(() => undefined)).toBe("auto");
    expect(loadWelcomeMode(() => { throw new Error("no storage"); })).toBe("auto");
    expect(() => saveWelcomeMode(() => broken, "hidden")).not.toThrow();
    expect(() => saveWelcomeMode(() => { throw new Error("no storage"); }, "shown")).not.toThrow();
  });
});

describe("welcomeShows", () => {
  const fresh = gettingStarted([owner()], new Set());
  const done = gettingStarted([owner()], new Set(["w1"]));
  const unknown = gettingStarted([owner()], undefined);

  it("shows automatically until a watch has its first page", () => {
    expect(welcomeShows("auto", gettingStarted([], undefined), true)).toBe(true);
    expect(welcomeShows("auto", fresh, true)).toBe(true);
    expect(welcomeShows("auto", done, true)).toBe(false);
  });

  it("waits, automatically, for the devices and the pages to be read", () => {
    expect(welcomeShows("auto", fresh, false)).toBe(false);
    expect(welcomeShows("auto", unknown, true)).toBe(false);
  });

  it("never shows once hidden, and always once shown again", () => {
    expect(welcomeShows("hidden", fresh, true)).toBe(false);
    expect(welcomeShows("shown", done, true)).toBe(true);
    expect(welcomeShows("shown", unknown, false)).toBe(true);
  });
});

describe("the words", () => {
  const all = [
    WELCOME_LEAD, WELCOME_FOOT,
    ...Object.values(CARD_STEPS).flatMap((s) => [s.title, s.text]),
    ...WELCOME_FACTS.flatMap((f) => [f.title, f.text]),
  ];

  it("never use a dash to break a sentence", () => {
    for (const text of all) {
      expect(text, text).not.toMatch(/[–—]| - /);
    }
  });

  it("say the steps as the mockup does", () => {
    expect(CARD_STEPS.app.title).toBe("Get the app");
    expect(CARD_STEPS.pair.text).toBe("On the watch, open Wrist Assistant and choose Pair with Home Assistant. It shows a 6-character code. Type it here.");
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

describe("the welcome card", () => {
  const card = (gs = gettingStarted([], undefined), mode: "auto" | "shown" = "auto") => flat(renderWelcomeCard({
    gs, mode, onPair: () => undefined, onNewPage: () => undefined, onHelp: () => undefined, onHide: () => undefined,
  }));

  it("has the title, the count, the three steps and the three facts", () => {
    const text = card();
    expect(text).toContain("Welcome to Wrist Assistant");
    expect(text).toContain("0 of 3 done");
    for (const s of Object.values(CARD_STEPS)) expect(text).toContain(s.title);
    for (const f of WELCOME_FACTS) expect(text).toContain(f.text);
  });

  it("links the App Store and the setup guide out of the panel", () => {
    const text = card();
    expect(text).toContain(`href=${APP_STORE_URL} target="_blank"`);
    expect(text).toContain(`href=${SETUP_GUIDE_URL} target="_blank"`);
  });

  it("greys New page with its reason until a watch is paired, then makes it the green next step", () => {
    const before = card();
    expect(before).toMatch(/<button type="button" class="home-btn" disabled[^>]*>New page<\/button>/);
    expect(before).toContain("Pair a watch first.");
    const after = card(gettingStarted([owner()], new Set()));
    expect(after).not.toContain("Pair a watch first.");
    expect(after).toMatch(/class="home-btn add"[^>]*>[\s\S]*?<span>New page<\/span>/);
    expect(after).toMatch(/wl-step next[^"]*"[\s\S]*?Make your first page/);
  });

  it("marks only the next step Next", () => {
    expect(card().match(/>Next</g)).toHaveLength(1);
    expect(card(gettingStarted([owner()], new Set(["w1"])), "shown")).not.toContain(">Next<");
  });

  it("says it goes away only while it follows the automatic rule, and always offers Hide", () => {
    expect(card()).toContain(WELCOME_FOOT);
    expect(card(undefined, "shown")).not.toContain(WELCOME_FOOT);
    expect(card(undefined, "shown")).toContain(">Hide</button>");
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
    onClosed: () => undefined, onPair: () => undefined, onNewPage: () => undefined, onShowWelcome: () => undefined,
    ...(editor ? { onEditorHelp: () => undefined } : {}),
  }));

  it("names the screen in view: Home, Complications, and each watch screen by its own blurb", () => {
    expect(helpScreen(at(""))).toMatchObject({ name: "Home" });
    expect(helpScreen(undefined).name).toBe("Home");
    expect(helpScreen(at("/complications")).name).toBe("Complications");
    for (const screen of [...WATCH_SCREENS, WATCH_SETTINGS_SCREEN]) {
      const h = helpScreen(at(screen.path));
      expect(h.name).toBe(screen.label);
      expect(h.text[0]).toContain(screen.blurb.trim().replace(/[.!?]$/, ""));
    }
    expect(helpScreen(at("/http-actions")).text[1]).toBe("Every watch in this home shares it.");
    expect(helpScreen(at("/pages/w1")).text[1]).toBe("It is for the watch picked at the top.");
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

  it("lists the three guides and the version, and can bring the card back", () => {
    const text = sheet("/menus");
    expect(text).toContain("On this screen: Menus");
    for (const url of [SETUP_GUIDE_URL, TROUBLESHOOTING_URL, REPORT_PROBLEM_URL]) expect(text).toContain(`href=${url}`);
    expect(text).toContain("Wrist Assistant 3.1.2");
    expect(text).toContain("Show the welcome card again");
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

  it("draws the welcome card at the top of Home, under its head", () => {
    const home = method("  private renderHome() {");
    expect(home).toContain("this.renderWelcome()");
    expect(home.indexOf("this.renderWelcome()")).toBeGreaterThan(home.indexOf("home-head"));
    expect(home.indexOf("this.renderWelcome()")).toBeLessThan(home.indexOf("this.renderNotReady()"));
  });

  it("gives the tab bar its Help button and draws the sheet over every tab", () => {
    const render = method("  override render() {");
    expect(render).toContain("onHelp: () => this.openHelpSheet()");
    expect(render).toContain("${this.helpSheetOpen ? this.renderHelpSheet() : nothing}");
  });

  it("opens New page on the Pages screen of the step's watch", () => {
    expect(method("  private renderWelcome() {")).toContain("this.goTo(watchScreenPath(WATCH_SCREENS[0]!, watch))");
  });

  it("puts focus back on the Help button when the sheet closes by itself", () => {
    expect(method("  private renderHelpSheet() {")).toContain("onClosed: () => this.closeHelpSheet(true)");
    expect(method("  private closeHelpSheet(")).toContain(`querySelector<HTMLElement>("button.wa-tabs-help")?.focus()`);
  });
});
