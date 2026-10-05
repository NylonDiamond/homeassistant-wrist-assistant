// The panel's shell: which tab a route is, the addresses each tab lives at,
// the move between them, the first-open landing, when the complication
// editor's keys are live, and the tab bar itself, flattened to text.

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  COMPLICATIONS_PATH,
  HOME_PATH,
  WATCH_SCREENS,
  editorKeysLive,
  isComplicationsRoute,
  isPlainClick,
  isSaveKey,
  landingPath,
  reopensDesign,
  navigatePanel,
  panelPrefix,
  panelUrl,
  renderTabBar,
  swallowsSaveKey,
  tabOfRoute,
  tabPath,
  tabsFor,
  watchScreenOf,
  watchScreenPath,
} from "../src/shell.js";
import { watchControlCenterRouteOwner } from "../src/watch-control-center/hook.js";
import { watchMenusRouteOwner } from "../src/watch-menus/hook.js";
import { watchPagesRouteOwner } from "../src/watch-pages/hook.js";
import { watchRoomsRouteOwner } from "../src/watch-rooms/hook.js";
import { watchStatusPagesRouteOwner } from "../src/watch-status-pages/hook.js";
import { watchVoiceRouteOwner } from "../src/watch-voice/hook.js";

const at = (path: string) => ({ prefix: "/wrist-assistant", path });

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

describe("tabOfRoute", () => {
  it("is Home at the panel's own address", () => {
    expect(tabOfRoute(at(""))).toBe("home");
    expect(tabOfRoute(at("/"))).toBe("home");
    expect(tabOfRoute(undefined)).toBe("home");
  });

  it("is Complications at /complications and under it", () => {
    expect(tabOfRoute(at("/complications"))).toBe("complications");
    expect(tabOfRoute(at("/complications/"))).toBe("complications");
    expect(tabOfRoute(at("/complications/x"))).toBe("complications");
    expect(isComplicationsRoute(at("/complicationsx"))).toBe(false);
    expect(tabOfRoute(at("/complicationsx"))).toBe("home");
  });

  it("is the Watch app on every watch address the iPhone app builds", () => {
    for (const path of ["/pages", "/pages/w1", "/menus", "/menus/w1", "/voice", "/voice/w1", "/status-pages", "/status-pages/w1",
      "/control-center", "/control-center/w1", "/rooms", "/rooms/w1"]) {
      expect(tabOfRoute(at(path)), path).toBe("watch");
    }
  });

  it("is Home on an address it does not know", () => {
    expect(tabOfRoute(at("/pagesx"))).toBe("home");
    expect(tabOfRoute(at("/other"))).toBe("home");
  });
});

describe("watch screens", () => {
  it("lists the six screens in Home's order", () => {
    expect(WATCH_SCREENS.map((s) => s.label)).toEqual(["Pages", "Menus", "Status pages", "Control Center", "Rooms", "Voice"]);
  });

  it("finds the screen a route is on", () => {
    for (const screen of WATCH_SCREENS) {
      expect(watchScreenOf(at(screen.path))).toBe(screen);
      expect(watchScreenOf(at(`${screen.path}/w1`))).toBe(screen);
    }
    expect(watchScreenOf(at(""))).toBeUndefined();
    expect(watchScreenOf(at(COMPLICATIONS_PATH))).toBeUndefined();
  });

  it("builds an address each screen's own reader gives the watch back from", () => {
    const readers = [watchPagesRouteOwner, watchMenusRouteOwner, watchStatusPagesRouteOwner,
      watchControlCenterRouteOwner, watchRoomsRouteOwner, watchVoiceRouteOwner];
    WATCH_SCREENS.forEach((screen, i) => {
      expect(watchScreenPath(screen)).toBe(screen.path);
      expect(readers[i]!(at(watchScreenPath(screen, "A1/B2 é")))).toBe("A1/B2 é");
      expect(readers[i]!(at(watchScreenPath(screen)))).toBeUndefined();
    });
  });
});

describe("addresses", () => {
  it("sends each tab to its own path", () => {
    expect(tabPath("home")).toBe(HOME_PATH);
    expect(tabPath("complications")).toBe(COMPLICATIONS_PATH);
    expect(tabPath("watch")).toBe("/pages");
  });

  it("opens the Watch app on Pages for the shared watch, encoded, and leaves the other tabs alone", () => {
    expect(tabPath("watch", "w2")).toBe("/pages/w2");
    expect(tabPath("watch", "a/b")).toBe("/pages/a%2Fb");
    expect(tabPath("watch", undefined)).toBe("/pages");
    expect(tabPath("home", "w2")).toBe(HOME_PATH);
    expect(tabPath("complications", "w2")).toBe(COMPLICATIONS_PATH);
  });

  it("offers the Watch app to administrators only", () => {
    expect(tabsFor(true)).toEqual(["home", "watch", "complications"]);
    expect(tabsFor(false)).toEqual(["home", "complications"]);
  });

  it("takes the prefix from the route when there is one", () => {
    expect(panelPrefix(at("/pages/w1"), "/somewhere/else")).toBe("/wrist-assistant");
    expect(panelUrl(at("/pages/w1"), COMPLICATIONS_PATH)).toBe("/wrist-assistant/complications");
    expect(panelUrl(at("/complications"), HOME_PATH)).toBe("/wrist-assistant");
  });

  it("works the prefix out of the address bar without a route", () => {
    expect(panelPrefix(undefined, "/wrist-assistant")).toBe("/wrist-assistant");
    expect(panelPrefix(undefined, "/wrist-assistant/")).toBe("/wrist-assistant");
    expect(panelPrefix(undefined, "/wrist-assistant/complications")).toBe("/wrist-assistant");
    expect(panelPrefix(undefined, "/wrist-assistant/pages/w1")).toBe("/wrist-assistant");
    expect(panelPrefix(undefined, "/wrist-assistant/control-center/w%201/x")).toBe("/wrist-assistant");
    expect(panelPrefix(undefined, "/wrist-assistant/pagesx")).toBe("/wrist-assistant/pagesx");
  });
});

describe("navigatePanel", () => {
  let pushed: string[];
  let replaced: string[];
  let events: { type: string; replace: unknown }[];
  const stubAt = (pathname: string) => {
    pushed = [];
    replaced = [];
    events = [];
    vi.stubGlobal("window", {
      location: { pathname },
      dispatchEvent: (e: CustomEvent) => { events.push({ type: e.type, replace: (e.detail as { replace?: unknown })?.replace }); return true; },
    });
    vi.stubGlobal("history", {
      state: null,
      pushState: (_s: unknown, _t: string, url: string) => { pushed.push(url); },
      replaceState: (_s: unknown, _t: string, url: string) => { replaced.push(url); },
    });
  };
  afterEach(() => { vi.unstubAllGlobals(); });

  it("pushes a new entry and tells Home Assistant", () => {
    stubAt("/wrist-assistant");
    expect(navigatePanel(at(""), COMPLICATIONS_PATH)).toEqual(at(COMPLICATIONS_PATH));
    expect(pushed).toEqual(["/wrist-assistant/complications"]);
    expect(replaced).toEqual([]);
    expect(events).toEqual([{ type: "location-changed", replace: false }]);
  });

  it("rewrites the current entry when asked to replace", () => {
    stubAt("/wrist-assistant");
    navigatePanel(at(""), COMPLICATIONS_PATH, true);
    expect(pushed).toEqual([]);
    expect(replaced).toEqual(["/wrist-assistant/complications"]);
    expect(events).toEqual([{ type: "location-changed", replace: true }]);
  });

  it("goes home from a watch screen", () => {
    stubAt("/wrist-assistant/rooms/w1");
    expect(navigatePanel(at("/rooms/w1"), HOME_PATH)).toEqual(at(""));
    expect(pushed).toEqual(["/wrist-assistant"]);
  });

  it("works without a route", () => {
    stubAt("/wrist-assistant/pages/w1");
    expect(navigatePanel(undefined, COMPLICATIONS_PATH)).toEqual(at(COMPLICATIONS_PATH));
    expect(pushed).toEqual(["/wrist-assistant/complications"]);
  });

  it("stays put at the address it is already at", () => {
    stubAt("/wrist-assistant/complications");
    expect(navigatePanel(at(COMPLICATIONS_PATH), COMPLICATIONS_PATH)).toBeUndefined();
    expect(pushed).toEqual([]);
    expect(events).toEqual([]);
  });
});

describe("isPlainClick", () => {
  const click = (over: Partial<MouseEvent> = {}) => ({ button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, ...over });

  it("takes a plain left click and leaves the rest to the browser", () => {
    expect(isPlainClick(click())).toBe(true);
    expect(isPlainClick(click({ button: 1 }))).toBe(false);
    expect(isPlainClick(click({ metaKey: true }))).toBe(false);
    expect(isPlainClick(click({ ctrlKey: true }))).toBe(false);
    expect(isPlainClick(click({ shiftKey: true }))).toBe(false);
    expect(isPlainClick(click({ altKey: true }))).toBe(false);
  });
});

describe("editorKeysLive", () => {
  it("is live only on the Complications tab with a design open", () => {
    expect(editorKeysLive(at(COMPLICATIONS_PATH), true)).toBe(true);
    expect(editorKeysLive(at(COMPLICATIONS_PATH), false)).toBe(false);
    expect(editorKeysLive(at(""), true)).toBe(false);
    expect(editorKeysLive(undefined, true)).toBe(false);
    for (const screen of WATCH_SCREENS) {
      expect(editorKeysLive(at(screen.path), true)).toBe(false);
      expect(editorKeysLive(at(`${screen.path}/w1`), true)).toBe(false);
    }
  });
});

describe("the save key while the editor's keys are still", () => {
  it("reads ⌘S and Ctrl+S, not a bare S", () => {
    const key = (over: Partial<Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey">>) => ({ key: "s", metaKey: false, ctrlKey: false, ...over });
    expect(isSaveKey(key({ metaKey: true }))).toBe(true);
    expect(isSaveKey(key({ ctrlKey: true }))).toBe(true);
    expect(isSaveKey(key({}))).toBe(false);
    expect(isSaveKey(key({ metaKey: true, key: "z" }))).toBe(false);
  });

  it("is held back from the browser on Home and on the list with nothing open, with or without a draft out of sight", () => {
    expect(swallowsSaveKey(at(""), false)).toBe(true);
    expect(swallowsSaveKey(at(""), true)).toBe(true);
    expect(swallowsSaveKey(undefined, false)).toBe(true);
    expect(swallowsSaveKey(at(COMPLICATIONS_PATH), false)).toBe(true);
  });

  it("is left to the editor while it is live, and to a watch screen, which saves on it itself", () => {
    expect(swallowsSaveKey(at(COMPLICATIONS_PATH), true)).toBe(false);
    for (const screen of WATCH_SCREENS) {
      expect(swallowsSaveKey(at(screen.path), false)).toBe(false);
      expect(swallowsSaveKey(at(`${screen.path}/w1`), true)).toBe(false);
    }
  });
});

describe("landingPath", () => {
  const none = { shareLink: false };

  it("stays where it is without a share link, so no path is always Home", () => {
    expect(landingPath(at(""), none)).toBeUndefined();
    expect(landingPath(undefined, none)).toBeUndefined();
    expect(landingPath(at("/pages/w1"), none)).toBeUndefined();
    expect(landingPath(at(COMPLICATIONS_PATH), none)).toBeUndefined();
  });

  it("takes a share link to the Complications tab from anywhere", () => {
    expect(landingPath(at(""), { shareLink: true })).toBe(COMPLICATIONS_PATH);
    expect(landingPath(at("/menus"), { shareLink: true })).toBe(COMPLICATIONS_PATH);
    expect(landingPath(at(COMPLICATIONS_PATH), { shareLink: true })).toBeUndefined();
  });
});

describe("reopensDesign", () => {
  it("reopens the last complication only on a reload of the Complications tab", () => {
    expect(reopensDesign(at(COMPLICATIONS_PATH))).toBe(true);
    expect(reopensDesign(at(""))).toBe(false);
    expect(reopensDesign(undefined)).toBe(false);
    expect(reopensDesign(at("/pages/w1"))).toBe(false);
    expect(reopensDesign(at("/settings"))).toBe(false);
  });
});

describe("renderTabBar", () => {
  const bar = (path: string, admin: boolean, menu = false) => flat(renderTabBar({
    route: at(path), admin, menu, onMenu: () => undefined, onTab: () => undefined,
  }));

  it("draws every tab for an administrator, as links to their addresses", () => {
    const text = bar("", true);
    expect(text).toContain(">Home</a>");
    expect(text).toContain(">Watch app</a>");
    expect(text).toContain(">Complications</a>");
    expect(text.indexOf("Home</a>")).toBeLessThan(text.indexOf("Watch app</a>"));
    expect(text.indexOf("Watch app</a>")).toBeLessThan(text.indexOf("Complications</a>"));
  });

  it("leaves the Watch app out for anyone else", () => {
    const text = bar("", false);
    expect(text).not.toContain("Watch app");
    expect(text).toContain(">Complications</a>");
  });

  it("marks the tab on screen and no other", () => {
    const marks = (text: string) => text.match(/wa-tab on/g)?.length ?? 0;
    for (const [path, label] of [["", "Home"], ["/menus/w1", "Watch app"], ["/complications", "Complications"]] as const) {
      const text = bar(path, true);
      expect(marks(text), path).toBe(1);
      expect(text).toMatch(new RegExp(`wa-tab on[^>]*>${label}</a>`));
    }
  });

  it("links the Watch app tab to Pages on the shared watch", () => {
    const text = flat(renderTabBar({
      route: at(""), admin: true, menu: false, onMenu: () => undefined, onTab: () => undefined, watch: "w2",
    }));
    expect(text).toMatch(/href=\/wrist-assistant\/pages\/w2 [^>]*>Watch app<\/a>/);
    expect(bar("", true)).toMatch(/href=\/wrist-assistant\/pages [^>]*>Watch app<\/a>/);
  });

  it("offers Home Assistant's menu only when asked", () => {
    expect(bar("", true, true)).toContain("wa-tabs-menu");
    expect(bar("", true, false)).not.toContain("wa-tabs-menu");
  });
});
