// iPhones in the Watch app tab, on a home whose integration keeps phone
// pages: the row lists them after the watches with a phone glyph, a phone can
// be the shared pick, and Pages, Menus, Status pages and Rooms open the
// phone's own records. Without `phone_pages` everything is as it was.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { HassLike, OwnerSummary } from "../src/ha-api.js";
import { moveKindMatches } from "../src/layouts.js";
import { PHONE_PAGES_CAPABILITY, isPhoneId, phonePagesOn, screenTakesPhone, watchOnlyFallback } from "../src/phone-pages.js";
import { WATCH_SCREENS, WATCH_SETTINGS_SCREEN } from "../src/shell.js";
import "../src/watch-control-center/control-center-editor.js";
import "../src/watch-menus/menu-editor.js";
import "../src/watch-pages/page-editor.js";
import { resolveWatchPick } from "../src/watch-pick.js";
import { controlCenterSaveNote } from "../src/watch-control-center/save-note.js";
import { httpActionsSaveNote } from "../src/watch-http-actions/save-note.js";
import { watchMenusSaveNote } from "../src/watch-menus/save-note.js";
import { createWatchPages } from "../src/watch-pages/draft.js";
import { NOT_FOR_IPHONE_TEXT, watchCommandError, watchPagesSaveNote } from "../src/watch-pages/save-note.js";
import { roomsKindFor, roomsSaveNote } from "../src/watch-rooms/model.js";
import "../src/watch-rooms/rooms-editor.js";
import { WATCH_ROW_PHONES_NOTE, type WatchRowInput, renderWatchOnlyNote, renderWatchRow, watchRowChoices, watchRowLinks } from "../src/watch-row.js";
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

describe("the shared pick with phones listed", () => {
  const devices = watchAppDevices(OWNERS, true);

  it("takes a phone the address names, or the one remembered", () => {
    expect(resolveWatchPick(devices, { route: "p1", saved: "w2", fallback: undefined })).toBe("p1");
    expect(resolveWatchPick(devices, { route: undefined, saved: "p1", fallback: undefined })).toBe("p1");
  });

  it("never falls back onto a phone while the home has a watch, even when the complications device is one", () => {
    expect(resolveWatchPick(devices, { route: undefined, saved: undefined, fallback: "p1" })).toBe("w1");
    expect(resolveWatchPick(devices, { route: undefined, saved: undefined, fallback: "w2" })).toBe("w2");
  });

  it("falls back onto the phone in a home with no watch", () => {
    const phoneOnly = watchAppDevices([OWNERS[0]!], true);
    expect(resolveWatchPick(phoneOnly, { route: undefined, saved: undefined, fallback: undefined })).toBe("p1");
  });

  it("leaves a phone out without phone pages", () => {
    expect(resolveWatchPick(watchAppDevices(OWNERS, false), { route: "p1", saved: "p1", fallback: "p1" })).toBe("w1");
  });
});

describe("the row with phones listed", () => {
  const route = { prefix: "/wrist-assistant", path: "/pages/p1" };
  function row(over: Partial<WatchRowInput> = {}) {
    const input: WatchRowInput = {
      route, owners: OWNERS, watch: "p1", phones: true, loaded: true, menuOpen: false,
      onMenu: () => undefined, onPick: () => undefined, onGo: () => undefined,
      ...over,
    };
    return flat(renderWatchRow(input));
  }

  it("lists the phones after the watches, each marked as an iPhone", () => {
    const choices = watchRowChoices(OWNERS, "p1", true);
    expect(choices.map((c) => [c.id, c.kind, c.on])).toEqual([["w1", "watch", false], ["w2", "watch", false], ["p1", "iphone", true]]);
    expect(watchRowChoices(OWNERS, "w1").map((c) => c.id)).toEqual(["w1", "w2"]);
  });

  it("names a picked phone as an iPhone, with the phone glyph's word in the chip", () => {
    const text = row();
    expect(text).toContain(`<span class="wa-wr-k">iPhone</span><b class="wa-wr-name">Jesse's iPhone</b>`);
    expect(text).toContain("aria-label=iPhone: Jesse's iPhone. Pick another");
    expect(text).toContain("title=Pick the watch or iPhone to set up");
    expect(text).toContain("How the iPhone app behaves");
  });

  it("puts a kind glyph on every row of the menu, and drops the line that phones are not here", () => {
    const text = row({ menuOpen: true });
    const menu = text.slice(text.indexOf(`class="wa-wr-menu"`));
    expect(menu).toContain("aria-label=Devices");
    expect(menu.match(/class="wa-wr-kind"/g)).toHaveLength(3);
    expect(menu).toMatch(/data-watch=p1 data-kind=iphone/);
    expect(menu).toMatch(/data-watch=w1 data-kind=watch/);
    expect(menu.indexOf("data-watch=w2")).toBeLessThan(menu.indexOf("data-watch=p1"));
    expect(menu).not.toContain(WATCH_ROW_PHONES_NOTE);
  });

  it("is the watch row it always was without phone pages", () => {
    const text = row({ phones: false, watch: "w1", menuOpen: true });
    expect(text).toContain(`<span class="wa-wr-k">Watch</span><b class="wa-wr-name">Jesse's Watch</b>`);
    expect(text).not.toContain("wa-wr-kind");
    expect(text).not.toContain("data-watch=p1");
    expect(text).toContain(WATCH_ROW_PHONES_NOTE);
    expect(text).toContain("aria-label=Watches");
  });
});

describe("the screens a phone does not have", () => {
  const screen = (id: string) => WATCH_SCREENS.find((s) => s.id === id)!;
  const route = (path: string) => ({ prefix: "/wrist-assistant", path });

  it("leave the row while the pick is a phone, all but the one on show", () => {
    const ids = (path: string, phone: boolean) => watchRowLinks(route(path), "p1", phone).map((l) => l.screen.id);
    expect(ids("/pages/p1", true)).toEqual(["pages", "menus", "status-pages", "rooms"]);
    expect(ids("/control-center/p1", true)).toEqual(["pages", "menus", "status-pages", "control-center", "rooms"]);
    expect(ids("/cameras", true)).toEqual(["pages", "menus", "status-pages", "rooms", "cameras"]);
    expect(ids("/pages/w1", false)).toHaveLength(8);
  });

  it("leave the row as drawn on a phone, with Settings still last", () => {
    const text = flat(renderWatchRow({
      route: route("/pages/p1"), owners: OWNERS, watch: "p1", phones: true, loaded: true, menuOpen: false,
      onMenu: () => undefined, onPick: () => undefined, onGo: () => undefined,
    }));
    for (const gone of [">Control Center</a>", ">Voice</a>", ">HTTP actions</a>", ">Cameras</a>"]) expect(text, gone).not.toContain(gone);
    for (const kept of [">Pages</a>", ">Menus</a>", ">Status pages</a>", ">Rooms</a>", ">Settings</a>"]) expect(text, kept).toContain(kept);
    expect(text).toContain("href=/wrist-assistant/settings/p1");
  });

  it("show the first watch instead when opened on a phone, and say so", () => {
    expect(watchOnlyFallback(screen("control-center"), OWNERS, "p1")).toEqual({
      watch: "w1", text: "The iPhone has no Control Center list. Showing Jesse's Watch.",
    });
    expect(watchOnlyFallback(screen("voice"), OWNERS, "p1")).toEqual({ watch: "w1", text: "The iPhone has no voice commands. Showing Jesse's Watch." });
  });

  it("say plainly when the home has no watch to show", () => {
    const phoneOnly = [OWNERS[0]!];
    expect(watchOnlyFallback(screen("control-center"), phoneOnly, "p1")).toEqual({
      watch: undefined, text: "The iPhone has no Control Center list, and no watch has connected yet.",
    });
  });

  it("say on a screen every watch shares whose it is: the watches' cameras, the whole home's HTTP actions", () => {
    expect(watchOnlyFallback(screen("http-actions"), OWNERS, "p1")).toEqual({ watch: undefined, text: "HTTP actions belong to the whole home, so the iPhone's pages use these too." });
    expect(watchOnlyFallback(screen("cameras"), OWNERS, "p1")?.text).toBe("The iPhone has no camera alerts. These are for the watches.");
  });

  it("need no fallback on a watch, or on a screen a phone has", () => {
    expect(watchOnlyFallback(screen("control-center"), OWNERS, "w2")).toBeUndefined();
    expect(watchOnlyFallback(screen("control-center"), OWNERS, undefined)).toBeUndefined();
    expect(watchOnlyFallback(screen("pages"), OWNERS, "p1")).toBeUndefined();
    expect(watchOnlyFallback(WATCH_SETTINGS_SCREEN, OWNERS, "p1")).toBeUndefined();
  });

  it("draw their line under the row as plain words", () => {
    expect(flat(renderWatchOnlyNote("The iPhone has no voice commands."))).toContain(`<div class="wa-wr-only" role="status">`);
    expect(flat(renderWatchOnlyNote("The iPhone has no voice commands."))).toContain("<span>The iPhone has no voice commands.</span>");
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
