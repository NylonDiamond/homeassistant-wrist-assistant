// iPhones in the panel, on a home whose integration keeps phone pages: the
// iPhone app tab's row lists them, its pick is its own, and Pages, Menus,
// Status pages, Rooms and Settings open the phone's own records. An old
// Watch app address that names an iPhone opens the iPhone app. Without
// `phone_pages` everything is as it was.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { HassLike, OwnerSummary } from "../src/ha-api.js";
import { moveKindMatches } from "../src/layouts.js";
import { PHONE_PAGES_CAPABILITY, iphoneAddressFor, iphoneDevices, isPhoneId, phonePagesOn } from "../src/phone-pages.js";
import { WATCH_SCREENS, WATCH_SETTINGS_SCREEN, screenTakesPhone } from "../src/shell.js";
import "../src/watch-control-center/control-center-editor.js";
import "../src/watch-menus/menu-editor.js";
import "../src/watch-pages/page-editor.js";
import { IPHONE_PICK_KEY, WATCH_PICK_KEY, iphoneRouteOwner, loadWatchPick, resolveWatchPick, saveWatchPick } from "../src/watch-pick.js";
import { controlCenterSaveNote } from "../src/watch-control-center/save-note.js";
import { httpActionsSaveNote } from "../src/watch-http-actions/save-note.js";
import { watchMenusSaveNote } from "../src/watch-menus/save-note.js";
import { createWatchPages } from "../src/watch-pages/draft.js";
import { NOT_FOR_IPHONE_TEXT, watchCommandError, watchPagesSaveNote } from "../src/watch-pages/save-note.js";
import { roomsKindFor, roomsSaveNote } from "../src/watch-rooms/model.js";
import "../src/watch-rooms/rooms-editor.js";
import { IPHONE_ROW_NONE_NOTE, WATCH_ROW_IPHONE_TAB_NOTE, WATCH_ROW_PHONES_NOTE, type WatchRowInput, renderWatchRow, watchRowChoices, watchRowLinks } from "../src/watch-row.js";
import { WATCH_SETTINGS_CATALOG, catalogFor, settingsTitle, watchAppDevices } from "../src/watch-settings.js";
import { statusPagesSaveNote } from "../src/watch-status-pages/save-note.js";
import "../src/watch-status-pages/status-pages-editor.js";
import { watchVoiceSaveNote } from "../src/watch-voice/save-note.js";
import "../src/watch-voice/voice-editor.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

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

// A phone listed first, as no reply sends it, to show the order is the
// panel's own.
const OWNERS = [
  owner({ owner_watch_id: "p1", device_name: "Jesse's iPhone", device_kind: "iphone" }),
  owner({ owner_watch_id: "w1", device_name: "Jesse's Watch" }),
  owner({ owner_watch_id: "old-phone", device_kind: null, is_orphan: true }),
  owner({ owner_watch_id: "w2", device_name: "Chen's Watch" }),
  owner({ owner_watch_id: "library", device_kind: "library", device_name: "Library" }),
];

describe("the home's phone pages", () => {
  it("is on only when the owners reply lists phone_pages", () => {
    expect(PHONE_PAGES_CAPABILITY).toBe("phone_pages");
    expect(phonePagesOn(["instant_poll", "phone_pages"])).toBe(true);
    expect(phonePagesOn(["instant_poll"])).toBe(false);
    expect(phonePagesOn([])).toBe(false);
    expect(phonePagesOn(undefined)).toBe(false);
  });

  it("tells a phone id from a watch's, the Library's and an unknown one", () => {
    expect(isPhoneId(OWNERS, "p1")).toBe(true);
    expect(isPhoneId(OWNERS, "w1")).toBe(false);
    expect(isPhoneId(OWNERS, "library")).toBe(false);
    expect(isPhoneId(OWNERS, "nobody")).toBe(false);
    expect(isPhoneId(OWNERS, undefined)).toBe(false);
  });

  it("gives a phone Pages, Menus, Status pages, Rooms and Settings, and nothing else", () => {
    expect(WATCH_SCREENS.filter(screenTakesPhone).map((s) => s.id)).toEqual(["pages", "menus", "status-pages", "rooms"]);
    expect(screenTakesPhone(WATCH_SETTINGS_SCREEN)).toBe(true);
  });
});

describe("the Watch app's devices", () => {
  it("lists the watches, then the phones, with phone pages", () => {
    expect(watchAppDevices(OWNERS, true).map((o) => o.owner_watch_id)).toEqual(["w1", "w2", "p1"]);
  });

  it("lists the watches alone without", () => {
    expect(watchAppDevices(OWNERS, false).map((o) => o.owner_watch_id)).toEqual(["w1", "w2"]);
  });
});

describe("iPhone settings", () => {
  it("are the settings the catalog marks for the iPhone, in the catalog's cards, with no card left empty", () => {
    const sections = catalogFor("iphone");
    expect(sections.map((s) => s.id)).toEqual(["interaction", "navigation", "camera"]);
    const settings = sections.flatMap((s) => s.settings);
    expect(settings).toHaveLength(35);
    expect(settings.every((s) => s.devices?.includes("iphone"))).toBe(true);
  });

  it("leave a watch's page as it was", () => {
    expect(catalogFor("watch")).toEqual(WATCH_SETTINGS_CATALOG.sections);
  });

  it("count a setting that names no device as the watch's alone", () => {
    const catalog = { version: 1, sections: [{ id: "x", title: "X", settings: [{ key: "k", type: "bool" as const, label: "K", default: false }] }] };
    expect(catalogFor("iphone", catalog)).toEqual([]);
    expect(catalogFor("watch", catalog)).toHaveLength(1);
  });

  it("are titled for the device", () => {
    expect(settingsTitle("iphone")).toBe("iPhone settings");
    expect(settingsTitle("watch")).toBe("Watch settings");
  });
});

describe("the iPhone app's pick", () => {
  const phones = iphoneDevices([...OWNERS, owner({ owner_watch_id: "p2", device_name: "Chen's iPhone", device_kind: "iphone" })]);

  it("lists the home's iPhones alone, never an orphan, a watch or the Library", () => {
    expect(phones.map((o) => o.owner_watch_id)).toEqual(["p1", "p2"]);
  });

  it("takes the iPhone the address names, else the one remembered, else the first", () => {
    expect(resolveWatchPick(phones, { route: "p2", saved: "p1", fallback: undefined })).toBe("p2");
    expect(resolveWatchPick(phones, { route: undefined, saved: "p2", fallback: undefined })).toBe("p2");
    expect(resolveWatchPick(phones, { route: "w1", saved: "gone", fallback: undefined })).toBe("p1");
  });

  it("reads the iPhone out of an iPhone app address, and none out of a watch's", () => {
    const at = (path: string) => ({ prefix: "/wrist-assistant", path });
    expect(iphoneRouteOwner(at("/iphone/pages/p1"))).toBe("p1");
    expect(iphoneRouteOwner(at("/iphone/settings/a%2Fb"))).toBe("a/b");
    expect(iphoneRouteOwner(at("/iphone"))).toBeUndefined();
    expect(iphoneRouteOwner(at("/pages/p1"))).toBeUndefined();
  });

  it("is remembered apart from the watch, so neither moves the other", () => {
    const store = new Map<string, string>();
    const storage = () => ({ getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v); } });
    saveWatchPick(storage, "w2");
    saveWatchPick(storage, "p1", "iphone");
    expect(store.get(WATCH_PICK_KEY)).toBe(`{"watch":"w2"}`);
    expect(store.get(IPHONE_PICK_KEY)).toBe(`{"iphone":"p1"}`);
    expect(loadWatchPick(storage)).toBe("w2");
    expect(loadWatchPick(storage, "iphone")).toBe("p1");
  });
});

describe("the iPhone app's row", () => {
  const route = { prefix: "/wrist-assistant", path: "/iphone/menus/p1" };
  const PHONES = [...OWNERS, owner({ owner_watch_id: "p2", device_name: "Chen's iPhone", device_kind: "iphone" })];
  function row(over: Partial<WatchRowInput> = {}) {
    const input: WatchRowInput = {
      route, owners: PHONES, watch: "p1", iphone: true, loaded: true, menuOpen: false,
      onMenu: () => undefined, onPick: () => undefined, onGo: () => undefined,
      ...over,
    };
    return flat(renderWatchRow(input));
  }

  it("lists the iPhones alone, each as an iPhone", () => {
    const choices = watchRowChoices(PHONES, "p1", "iphone");
    expect(choices.map((c) => [c.id, c.kind, c.on])).toEqual([["p1", "iphone", true], ["p2", "iphone", false]]);
    expect(watchRowChoices(PHONES, "w1").map((c) => c.id)).toEqual(["w1", "w2"]);
  });

  it("names the picked iPhone, offers the others, and says nothing of watches", () => {
    const text = row({ menuOpen: true });
    expect(text).toContain(`aria-label=iPhone app`);
    expect(text).toContain(`<span class="wa-wr-k">iPhone</span><b class="wa-wr-name">Jesse's iPhone</b>`);
    expect(text).toContain("aria-label=iPhone: Jesse's iPhone. Pick another");
    expect(text).toContain("title=Pick the iPhone to set up");
    expect(text).toContain("How the iPhone app behaves");
    const menu = text.slice(text.indexOf(`class="wa-wr-menu"`));
    expect(menu).toContain("aria-label=iPhones");
    expect(menu).toMatch(/data-watch=p2 data-kind=iphone/);
    expect(menu).not.toContain("data-watch=w1");
    expect(menu).not.toContain("wa-wr-menu-note");
  });

  it("walks Pages, Menus, Status pages and Rooms, then Settings, each at its iPhone app address", () => {
    const links = watchRowLinks(route, "p1", "iphone");
    expect(links.map((l) => l.path)).toEqual(["/iphone/pages/p1", "/iphone/menus/p1", "/iphone/status-pages/p1", "/iphone/rooms/p1"]);
    expect(links.filter((l) => l.on).map((l) => l.screen.id)).toEqual(["menus"]);
    const text = row();
    for (const gone of [">Control Center</a>", ">Voice</a>", ">HTTP actions</a>", ">Cameras</a>"]) expect(text, gone).not.toContain(gone);
    const order = [">Pages</a>", ">Menus</a>", ">Status pages</a>", ">Rooms</a>", ">Settings</a>"].map((part) => text.indexOf(part));
    expect(order.every((at) => at > 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(text).toContain("href=/wrist-assistant/iphone/settings/p1");
    expect(row({ route: { prefix: "/wrist-assistant", path: "/iphone/settings/p1" } }))
      .toMatch(/class="wa-wr-link wa-wr-settings on"\s+href=\/wrist-assistant\/iphone\/settings\/p1 aria-current=page/);
  });

  it("offers Pair an iPhone and nothing else in a home with no iPhone", () => {
    let paired = 0;
    const input: WatchRowInput = {
      route: { prefix: "/wrist-assistant", path: "/iphone/pages" }, owners: [OWNERS[1]!], watch: undefined, iphone: true, loaded: true, menuOpen: false,
      onMenu: () => undefined, onPick: () => undefined, onGo: () => undefined, onPair: () => { paired++; },
    };
    const tpl = renderWatchRow(input);
    const text = flat(tpl);
    expect(text).toContain(">Pair an iPhone</span>");
    expect(text).toContain(IPHONE_ROW_NONE_NOTE);
    expect(text).not.toContain("wa-wr-links");
    expect(text).not.toContain("Pair a watch");
    const click = (v: unknown): void => {
      const r = v as { strings: readonly string[]; values: unknown[] };
      r.values.forEach((value, i) => {
        if (typeof value === "function" && r.strings[i]!.trimEnd().endsWith("@click=")) (value as () => void)();
        else if (value !== null && typeof value === "object" && "strings" in value) click(value);
      });
    };
    click(tpl);
    expect(paired).toBe(1);
  });

  it("says Loading with an iPhone chip while the devices are not in", () => {
    const text = row({ owners: [], watch: undefined, loaded: false });
    expect(text).toContain(`<span class="wa-wr-k">iPhone</span><span class="wa-wr-wait">Loading…</span>`);
    expect(text).not.toContain("Pair an iPhone");
  });
});

describe("the Watch app's row on a home with phone pages", () => {
  const input = (over: Partial<WatchRowInput> = {}): WatchRowInput => ({
    route: { prefix: "/wrist-assistant", path: "/pages/w1" }, owners: OWNERS, watch: "w1", phones: true, loaded: true, menuOpen: true,
    onMenu: () => undefined, onPick: () => undefined, onGo: () => undefined,
    ...over,
  });

  it("lists the watches alone, and says the iPhones are in their own tab", () => {
    const text = flat(renderWatchRow(input()));
    expect(text).not.toContain("data-watch=p1");
    expect(text).not.toContain("data-kind=iphone");
    expect(text).toContain(WATCH_ROW_IPHONE_TAB_NOTE);
    expect(text).not.toContain(WATCH_ROW_PHONES_NOTE);
    expect(text).toContain("title=Pick the watch to set up");
  });

  it("keeps all eight screens and Settings on the watch", () => {
    expect(watchRowLinks({ prefix: "/wrist-assistant", path: "/control-center/w1" }, "w1").map((l) => l.path))
      .toEqual(["/pages/w1", "/menus/w1", "/status-pages/w1", "/control-center/w1", "/rooms/w1", "/voice/w1", "/http-actions", "/cameras"]);
  });

  it("offers Pair a watch in a home with an iPhone and no watch, with no iPhone in the slot", () => {
    const text = flat(renderWatchRow(input({ owners: [OWNERS[0]!], watch: undefined, menuOpen: false })));
    expect(text).toContain(">Pair a watch</span>");
    expect(text).not.toContain("Jesse's iPhone");
    expect(text).not.toContain(">Pages</a>");
  });
});

describe("an old Watch app address that names an iPhone", () => {
  const at = (path: string) => ({ prefix: "/wrist-assistant", path });

  it("opens the same screen in the iPhone app, the rest of the address kept", () => {
    expect(iphoneAddressFor(at("/pages/p1"), OWNERS, true)).toBe("/iphone/pages/p1");
    expect(iphoneAddressFor(at("/menus/p1"), OWNERS, true)).toBe("/iphone/menus/p1");
    expect(iphoneAddressFor(at("/status-pages/p1"), OWNERS, true)).toBe("/iphone/status-pages/p1");
    expect(iphoneAddressFor(at("/rooms/p1"), OWNERS, true)).toBe("/iphone/rooms/p1");
    expect(iphoneAddressFor(at("/settings/p1"), OWNERS, true)).toBe("/iphone/settings/p1");
    expect(iphoneAddressFor(at("/pages/p1/extra"), OWNERS, true)).toBe("/iphone/pages/p1/extra");
  });

  it("stays on a watch only screen, which then shows a watch", () => {
    expect(iphoneAddressFor(at("/control-center/p1"), OWNERS, true)).toBeUndefined();
    expect(iphoneAddressFor(at("/voice/p1"), OWNERS, true)).toBeUndefined();
    expect(resolveWatchPick(watchAppDevices(OWNERS, false), { route: "p1", saved: undefined, fallback: "p1" })).toBe("w1");
  });

  it("stays on a watch's address, an unknown id, one with no device, and a home without phone pages", () => {
    expect(iphoneAddressFor(at("/pages/w1"), OWNERS, true)).toBeUndefined();
    expect(iphoneAddressFor(at("/pages/nobody"), OWNERS, true)).toBeUndefined();
    expect(iphoneAddressFor(at("/pages"), OWNERS, true)).toBeUndefined();
    expect(iphoneAddressFor(at("/iphone/pages/p1"), OWNERS, true)).toBeUndefined();
    expect(iphoneAddressFor(at("/pages/p1"), OWNERS, false)).toBeUndefined();
    expect(iphoneAddressFor(undefined, OWNERS, true)).toBeUndefined();
  });
});

describe("moving a lost device's designs", () => {
  it("offers the Move list only the devices moveKindMatches lets through", () => {
    const source = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");
    const at = source.indexOf("  private renderOrphanBanner()");
    const banner = source.slice(at, source.indexOf("\n  }\n", at));
    expect(banner).toContain("const targets = this.owners.filter((o) => !o.is_orphan && !isLibraryOwner(o) && moveKindMatches(sourceKind, o.device_kind));");
  });

  it("never lists an iPhone for a lost watch, or for designs that cannot say", () => {
    const targets = (sourceKind: string | undefined) => OWNERS
      .filter((o) => !o.is_orphan && o.device_kind !== "library" && moveKindMatches(sourceKind, o.device_kind))
      .map((o) => o.owner_watch_id);
    expect(targets("watch")).toEqual(["w1", "w2"]);
    expect(targets(undefined)).toEqual(["w1", "w2"]);
    expect(targets("iphone")).toEqual(["p1"]);
  });
});

describe("the screens a phone has", () => {
  let made = 0;
  /** An unconnected editor in the shell, handed `ownerId`, with `phones` on
   * or off. Its `openWatch` is recorded rather than run. */
  function editor(tag: string, phones: boolean) {
    const n = ++made;
    const owners = [
      owner({ owner_watch_id: `pp-w1-${n}`, device_name: "Jesse's Watch" }),
      owner({ owner_watch_id: `pp-p1-${n}`, device_name: "Jesse's iPhone", device_kind: "iphone" }),
    ];
    const Ctor = customElements.get(tag) as unknown as new () => Record<string, unknown>;
    const el = new Ctor();
    el.hass = { user: { is_admin: true }, states: {} } as unknown as HassLike;
    el.owners = owners;
    el.watchId = owners[0]!.owner_watch_id;
    el.ownerId = owners[1]!.owner_watch_id;
    el.shellOwnsWatch = true;
    el.phones = phones;
    const opened: string[] = [];
    el.openWatch = (id: string) => { opened.push(id); el.watchId = id; };
    (el.willUpdate as (c: Map<string, unknown>) => void).call(el, new Map([["ownerId", owners[0]!.owner_watch_id]]));
    return { opened, phone: owners[1]!.owner_watch_id };
  }

  for (const tag of ["wa-page-editor", "wa-menu-editor", "wa-status-pages-editor", "wa-rooms-editor"]) {
    it(`${tag}: opens the phone it is handed with phone pages, and stays on the watch without`, () => {
      const on = editor(tag, true);
      expect(on.opened).toEqual([on.phone]);
      expect(editor(tag, false).opened).toEqual([]);
    });
  }

  for (const tag of ["wa-control-center-editor", "wa-voice-editor"]) {
    it(`${tag}: takes no phone at all`, () => {
      const el = new (customElements.get(tag) as unknown as new () => Record<string, unknown>)();
      expect("phones" in el).toBe(false);
    });
  }

  it("keeps a phone's rooms in its own rooms record, on every home", () => {
    expect(roomsKindFor({ device_kind: "iphone" })).toBe("rooms");
    expect(roomsKindFor({ device_kind: "iphone", main_house: true })).toBe("rooms");
    expect(roomsKindFor({ device_kind: "watch" })).toBe("behavior");
    expect(roomsKindFor({ device_kind: "watch", main_house: false })).toBe("rooms");
  });
});

describe("a refusal as not_for_iphone", () => {
  const refused = { code: "not_for_iphone", message: "kind 'control_center' is not for an iPhone" };

  it("reads in plain words, at the top or inside a lost connection's result", () => {
    expect(watchCommandError(refused)).toEqual({ code: "not_for_iphone", message: NOT_FOR_IPHONE_TEXT });
    expect(watchCommandError({ error: refused }).message).toBe(NOT_FOR_IPHONE_TEXT);
    expect(watchCommandError(Object.assign(new Error(refused.message), { code: refused.code })).message).toBe(NOT_FOR_IPHONE_TEXT);
    expect(NOT_FOR_IPHONE_TEXT).not.toMatch(/not_for_iphone| - |\u2013|\u2014/);
  });

  it("leaves every other refusal in Home Assistant's own words", () => {
    expect(watchCommandError({ code: "invalid", message: "bad page" })).toEqual({ code: "invalid", message: "bad page" });
  });

  it("is said the same way after a save on every screen", () => {
    const failed = { ok: false, revision: 3, merged: false, ...refused };
    const notes = [
      watchPagesSaveNote(failed),
      watchMenusSaveNote(failed),
      statusPagesSaveNote(failed),
      controlCenterSaveNote(failed),
      watchVoiceSaveNote(failed),
      httpActionsSaveNote(failed),
      roomsSaveNote({ ok: false, ...refused }, "rooms"),
      roomsSaveNote({ ok: false, ...refused }, "behavior"),
    ];
    for (const note of notes) expect(note).toEqual({ kind: "err", text: `Not saved. ${NOT_FOR_IPHONE_TEXT}` });
  });

  it("is said in plain words when a first record cannot start", async () => {
    const result = await createWatchPages(() => Promise.reject(refused));
    expect(result).toEqual({ ok: false, code: "error", message: NOT_FOR_IPHONE_TEXT });
  });

  it("is said in plain words by the panel and the Settings page too", () => {
    for (const file of ["panel.ts", "watch-settings-view.ts"]) {
      const source = readFileSync(join(__dirname, "..", "src", file), "utf8");
      expect(source).toMatch(/function errText\(err: unknown\): string \{\n  if \(watchCommandError\(err\)\.code === "not_for_iphone"\) return NOT_FOR_IPHONE_TEXT;/);
    }
  });
});
