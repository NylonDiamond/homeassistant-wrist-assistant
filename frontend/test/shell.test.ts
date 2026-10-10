// The panel's shell: which tab a route is, the addresses each tab lives at
// (the iPhone app's included),
// the move between them, the first-open landing, when the complication
// editor's keys are live, and the tab bar itself, flattened to text.

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  COMPLICATIONS_PATH,
  HOME_PATH,
  IPHONE_PATH,
  IPHONE_SCREENS,
  PANEL_TABS,
  WATCH_SCREENS,
  WATCH_SETTINGS_SCREEN,
  deviceScreenPath,
  editorKeysLive,
  isComplicationsRoute,
  iphoneInnerRoute,
  iphoneScreenOf,
  iphoneScreenPath,
  isPlainClick,
  isSaveKey,
  landingPath,
  reopensDesign,
  navigatePanel,
  panelPrefix,
  panelTabs,
  panelUrl,
  renderTabBar,
  swallowsSaveKey,
  tabOfRoute,
  tabPath,
  watchScreenOf,
  watchScreenPath,
} from "../src/shell.js";
import { watchControlCenterRouteOwner } from "../src/watch-control-center/hook.js";
import { WATCH_CAMERAS_PATH } from "../src/watch-cameras/hook.js";
import { WATCH_HTTP_ACTIONS_PATH } from "../src/watch-http-actions/hook.js";
import { watchMenusRouteOwner } from "../src/watch-menus/hook.js";
import { watchPagesRouteOwner } from "../src/watch-pages/hook.js";
import { watchRouteOwner } from "../src/watch-pick.js";
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
      "/control-center", "/control-center/w1", "/rooms", "/rooms/w1", "/http-actions", "/cameras"]) {
      expect(tabOfRoute(at(path)), path).toBe("watch");
    }
  });

  it("is Home on an address it does not know", () => {
    expect(tabOfRoute(at("/pagesx"))).toBe("home");
    expect(tabOfRoute(at("/other"))).toBe("home");
  });

  it("is the iPhone app on /iphone and every iPhone screen under it, and Home on a watch only screen there", () => {
    for (const path of ["/iphone", "/iphone/", "/iphone/pages", "/iphone/pages/p1", "/iphone/menus/p1", "/iphone/status-pages",
      "/iphone/rooms/p1", "/iphone/settings", "/iphone/settings/p1"]) {
      expect(tabOfRoute(at(path)), path).toBe("iphone");
    }
    for (const path of ["/iphone/voice/p1", "/iphone/control-center", "/iphone/http-actions", "/iphone/cameras", "/iphonex"]) {
      expect(tabOfRoute(at(path)), path).toBe("home");
    }
  });
});

describe("iPhone app screens", () => {
  it("are Pages, Menus, Status pages and Rooms in the watch row's order, with Settings apart", () => {
    expect(IPHONE_SCREENS.map((s) => s.label)).toEqual(["Pages", "Menus", "Status pages", "Rooms"]);
    expect(iphoneScreenOf(at("/iphone/settings/p1"))).toBe(WATCH_SETTINGS_SCREEN);
  });

  it("read as the watch address they wrap, /iphone alone as Pages", () => {
    expect(iphoneInnerRoute(at("/iphone/rooms/p1"))).toEqual(at("/rooms/p1"));
    expect(iphoneInnerRoute(at("/iphone"))).toEqual(at("/pages"));
    expect(iphoneInnerRoute(at("/iphone/"))).toEqual(at("/pages"));
    expect(iphoneInnerRoute(at("/pages/p1"))).toBeUndefined();
    expect(iphoneInnerRoute(undefined)).toBeUndefined();
    expect(iphoneScreenOf(at("/iphone"))).toBe(WATCH_SCREENS[0]);
    expect(iphoneScreenOf(at("/pages/p1"))).toBeUndefined();
  });

  it("build an address each screen's own reader gives the iPhone back from", () => {
    for (const screen of [...IPHONE_SCREENS, WATCH_SETTINGS_SCREEN]) {
      const path = iphoneScreenPath(screen, "A1/B2 é");
      expect(path.startsWith(`${IPHONE_PATH}/`)).toBe(true);
      expect(iphoneScreenOf(at(path))).toBe(screen);
      expect(watchRouteOwner(iphoneInnerRoute(at(path)))).toBe("A1/B2 é");
      expect(iphoneScreenPath(screen)).toBe(`${IPHONE_PATH}${screen.path}`);
    }
  });

  it("are where a device's screen is for an iPhone, and the Watch app's for a watch", () => {
    expect(deviceScreenPath("iphone", WATCH_SCREENS[0]!, "p1")).toBe("/iphone/pages/p1");
    expect(deviceScreenPath("iphone", WATCH_SETTINGS_SCREEN, "p1")).toBe("/iphone/settings/p1");
    expect(deviceScreenPath("watch", WATCH_SCREENS[0]!, "w1")).toBe("/pages/w1");
  });
});

describe("watch screens", () => {
  it("lists the eight screens in Home's order", () => {
    expect(WATCH_SCREENS.map((s) => s.label)).toEqual(["Pages", "Menus", "Status pages", "Control Center", "Rooms", "Voice", "HTTP actions", "Cameras"]);
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
    const own = WATCH_SCREENS.filter((screen) => screen.shared !== true);
    expect(own).toHaveLength(readers.length);
    own.forEach((screen, i) => {
      expect(watchScreenPath(screen)).toBe(screen.path);
      expect(readers[i]!(at(watchScreenPath(screen, "A1/B2 é")))).toBe("A1/B2 é");
      expect(readers[i]!(at(watchScreenPath(screen)))).toBeUndefined();
    });
  });

  it("never names a watch in the address of HTTP actions or Cameras, which every watch shares", () => {
    const shared = WATCH_SCREENS.filter((screen) => screen.shared === true);
    expect(shared.map((screen) => screen.id)).toEqual(["http-actions", "cameras"]);
    expect(watchScreenPath(shared[0]!, "w1")).toBe(WATCH_HTTP_ACTIONS_PATH);
    expect(watchScreenPath(shared[1]!, "w1")).toBe(WATCH_CAMERAS_PATH);
    for (const screen of shared) expect(watchRouteOwner(at(watchScreenPath(screen, "w1")))).toBeUndefined();
    expect(watchRouteOwner(at("/http-actions/w1"))).toBeUndefined();
    expect(watchRouteOwner(at("/cameras/w1"))).toBeUndefined();
    expect(tabOfRoute(at("/http-actions/w1"))).toBe("watch");
    expect(tabOfRoute(at("/cameras/camera.door"))).toBe("watch");
  });

  it("lists Cameras last, as a shared screen with its own blurb", () => {
    expect(WATCH_SCREENS.at(-1)).toEqual({
      id: "cameras", label: "Cameras", blurb: "How each camera is framed in alerts", path: WATCH_CAMERAS_PATH, shared: true,
    });
    expect(watchScreenOf(at("/cameras"))).toBe(WATCH_SCREENS[7]);
  });
});

describe("addresses", () => {
  it("sends each tab to its own path", () => {
    expect(tabPath("home")).toBe(HOME_PATH);
    expect(tabPath("complications")).toBe(COMPLICATIONS_PATH);
    expect(tabPath("watch")).toBe("/pages");
    expect(tabPath("iphone")).toBe("/iphone/pages");
  });

  it("opens the Watch app on Pages for the shared watch, encoded, and leaves the other tabs alone", () => {
    expect(tabPath("watch", "w2")).toBe("/pages/w2");
    expect(tabPath("watch", "a/b")).toBe("/pages/a%2Fb");
    expect(tabPath("watch", undefined)).toBe("/pages");
    expect(tabPath("home", "w2")).toBe(HOME_PATH);
    expect(tabPath("complications", "w2")).toBe(COMPLICATIONS_PATH);
  });

  it("opens the iPhone app on Pages for the shared iPhone, and keeps each app's pick to its own tab", () => {
    expect(tabPath("iphone", "w2", "p1")).toBe("/iphone/pages/p1");
    expect(tabPath("iphone", "w2", "a/b")).toBe("/iphone/pages/a%2Fb");
    expect(tabPath("watch", "w2", "p1")).toBe("/pages/w2");
  });

  it("offers every tab to everybody, the iPhone app only on a home with phone pages", () => {
    expect(PANEL_TABS).toEqual(["home", "watch", "iphone", "complications"]);
    expect(panelTabs(true)).toEqual(["home", "watch", "iphone", "complications"]);
    expect(panelTabs(false)).toEqual(["home", "watch", "complications"]);
    expect(panelTabs(false, "iphone")).toEqual(["home", "watch", "iphone", "complications"]);
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
    expect(panelPrefix(undefined, "/wrist-assistant/http-actions")).toBe("/wrist-assistant");
    expect(panelPrefix(undefined, "/wrist-assistant/cameras")).toBe("/wrist-assistant");
    expect(panelPrefix(undefined, "/wrist-assistant/pagesx")).toBe("/wrist-assistant/pagesx");
    expect(panelPrefix(undefined, "/wrist-assistant/iphone")).toBe("/wrist-assistant");
    expect(panelPrefix(undefined, "/wrist-assistant/iphone/pages/p1")).toBe("/wrist-assistant");
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
    for (const screen of [...IPHONE_SCREENS, WATCH_SETTINGS_SCREEN]) {
      expect(swallowsSaveKey(at(iphoneScreenPath(screen, "p1")), false)).toBe(false);
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
  const bar = (path: string, menu = false, phones = false) => flat(renderTabBar({
    route: at(path), menu, onMenu: () => undefined, onTab: () => undefined, phones,
  }));

  it("draws every tab, as links to their addresses", () => {
    const text = bar("");
    expect(text).toContain(">Home</a>");
    expect(text).toContain(">Watch app</a>");
    expect(text).toContain(">Complications</a>");
    expect(text.indexOf("Home</a>")).toBeLessThan(text.indexOf("Watch app</a>"));
    expect(text.indexOf("Watch app</a>")).toBeLessThan(text.indexOf("Complications</a>"));
    expect(text).not.toContain("iPhone app</a>");
  });

  it("draws the iPhone app between the Watch app and Complications on a home with phone pages", () => {
    const text = bar("", false, true);
    expect(text.indexOf("Watch app</a>")).toBeLessThan(text.indexOf(">iPhone app</a>"));
    expect(text.indexOf(">iPhone app</a>")).toBeLessThan(text.indexOf("Complications</a>"));
    expect(text).toMatch(/href=\/wrist-assistant\/iphone\/pages [^>]*>iPhone app<\/a>/);
    expect(flat(renderTabBar({ route: at(""), menu: false, onMenu: () => undefined, onTab: () => undefined, phones: true, iphone: "p1" })))
      .toMatch(/href=\/wrist-assistant\/iphone\/pages\/p1 [^>]*>iPhone app<\/a>/);
  });

  it("marks the tab on screen and no other", () => {
    const marks = (text: string) => text.match(/wa-tab on/g)?.length ?? 0;
    for (const [path, label] of [["", "Home"], ["/menus/w1", "Watch app"], ["/iphone/menus/p1", "iPhone app"], ["/complications", "Complications"]] as const) {
      const text = bar(path, false, true);
      expect(marks(text), path).toBe(1);
      expect(text).toMatch(new RegExp(`wa-tab on[^>]*>${label}</a>`));
    }
  });

  it("links the Watch app tab to Pages on the shared watch", () => {
    const text = flat(renderTabBar({
      route: at(""), menu: false, onMenu: () => undefined, onTab: () => undefined, watch: "w2",
    }));
    expect(text).toMatch(/href=\/wrist-assistant\/pages\/w2 [^>]*>Watch app<\/a>/);
    expect(bar("")).toMatch(/href=\/wrist-assistant\/pages [^>]*>Watch app<\/a>/);
  });

  it("offers Home Assistant's menu only when asked", () => {
    expect(bar("", true)).toContain("wa-tabs-menu");
    expect(bar("", false)).not.toContain("wa-tabs-menu");
  });
});

describe("the screen a route shows, for the leave question", () => {
  it("counts an iPhone app screen as the watch screen of the same name, the same editor on another device", async () => {
    const { screenIdOf } = await import("../src/shell.js");
    const at = (path: string) => screenIdOf({ prefix: "/wrist-assistant", path });
    expect(["/iphone", "/iphone/pages/p1", "/iphone/menus/p1", "/iphone/status-pages", "/iphone/rooms/p1", "/iphone/settings/p1"].map(at)).toEqual(
      ["pages", "pages", "menus", "status-pages", "rooms", "settings"],
    );
  });

  it("names each watch screen whatever watch or page follows, and the two other tabs", async () => {
    const { screenIdOf } = await import("../src/shell.js");
    const at = (path: string) => screenIdOf({ prefix: "/wrist-assistant", path });
    expect(["", "/complications", "/complications/abc", "/pages", "/pages/W1", "/pages/W2/p3", "/menus/W1", "/status-pages", "/control-center/W1", "/rooms", "/voice/W1", "/http-actions", "/cameras", "/settings/W1"].map(at)).toEqual(
      ["home", "complications", "complications", "pages", "pages", "pages", "menus", "status-pages", "control-center", "rooms", "voice", "http-actions", "cameras", "settings"],
    );
    expect(screenIdOf(undefined)).toBe("home");
  });
});
