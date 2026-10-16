// Rooms on a home that is not the watch's main house (step 8). There the
// watch's owner row says `main_house: false`, the home keeps no `behavior`
// of its own, and its rooms are a `rooms` record: the six room keys under
// their `behavior` names and a `schemaVersion`. The editor reads, saves,
// restores and hears that kind, hides the four keys that stay with the main
// house behind one line. With no record it opens ready, unsaved, and its
// first save makes the record, or it waits for the iPhone's move while the
// watch has one. The main house is unchanged, but for opening ready too.
//
// No DOM: the editor is made but never connected, and read by flattening the
// Lit templates it returns, as watch-start-flows.test.ts does.

import { afterEach, describe, expect, it, vi } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { anyRoomsDirty, forgetRoomsDraft } from "../src/watch-rooms/draft.js";
import { forgetStartFreshChoices } from "../src/watch-menus/new-watch.js";
import {
  type BehaviorDocument,
  HOME_AUTO_SWITCH_LABEL,
  HOME_ROOMS_LIMIT_BYTES,
  HOME_ROOMS_MAIN_HOUSE_TEXT,
  HOME_ROOMS_NO_RECORD_TITLE,
  HOME_ROOMS_PHONE_TEXT,
  HOME_ROOMS_UPDATE_TEXT,
  HOME_ROOM_KEYS,
  MAIN_HOUSE_ROOM_KEYS,
  ROOMS_NO_RECORD_TITLE,
  ROOMS_WAIT_TEXT,
  clearSensorWrites,
  homeAutoSwitch,
  homeAutoSwitchWrites,
  homeRoomWrites,
  homeRoomsStart,
  mergeRoomList,
  readRooms,
  roomsBudget,
  roomsKindFor,
  roomsSaveNote,
  switchingWritesFor,
  triggerWrites,
} from "../src/watch-rooms/model.js";
import { WaRoomsEditor } from "../src/watch-rooms/rooms-editor.js";
import { ROOM_KEYS } from "../src/watch-rooms/rules.js";
import { type RoomsViewHost, renderRoomsBody } from "../src/watch-rooms/view.js";
import { WATCH_CONFIG_LIMIT_BYTES } from "../src/watch-pages/model.js";
import {
  NEW_WATCH_TEXT,
  NOTHING_TO_SAVE_TEXT,
  PAIR_FIRST_TEXT,
  START_FRESH_BUTTON,
  START_FRESH_CONFIRM_TEXT,
  WAIT_FOR_IPHONE_TEXT,
  newDeviceText,
  watchBehaviorDefaults,
} from "../src/watch-settings.js";

// ── reading templates ────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}

function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flatten(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

/** Every listener a template holds, in order. */
function listeners(node: unknown, out: ((e?: unknown) => unknown)[] = []): ((e?: unknown) => unknown)[] {
  if (Array.isArray(node)) for (const n of node) listeners(n, out);
  else if (isTpl(node)) for (const v of node.values) {
    if (typeof v === "function") out.push(v as (e?: unknown) => unknown);
    else listeners(v, out);
  }
  return out;
}

const DASH = new RegExp(" - |\\u2013|\\u2014");

// ── the stand-ins ────────────────────────────────────────────────────────

const owner = (id: string, extra: Partial<OwnerSummary> = {}): OwnerSummary => ({
  ...extra,
  owner_watch_id: id,
  device_name: "Apple Watch",
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.1.0",
  screen_size: null,
  complication_count: 0,
  token: 1,
  is_orphan: false,
} as OwnerSummary);

function record(kind: string, revision: number, document?: BehaviorDocument): WatchConfigRecord {
  return {
    kind,
    revision,
    hash: revision > 0 ? "h" : null,
    updated_at: null,
    updated_by: revision > 0 ? "panel" : null,
    delivered_revision: 0,
    delivered_at: null,
    ...(document === undefined ? {} : { document }),
  };
}

const refusal = (code: string, message = code) => Object.assign(new Error(message), { code });

/** A connection holding one record per kind. `refuse` names kinds this
 * integration does not keep, refused as `invalid`; `onSave` answers a save. */
function fakeHass(held: Record<string, WatchConfigRecord>, opts: { refuse?: string[]; onSave?: (msg: Record<string, unknown>) => Promise<{ revision: number }> } = {}) {
  const sent: Record<string, unknown>[] = [];
  const stored = { ...held };
  const hass = {
    user: { is_admin: true },
    states: {},
    connection: {
      async sendMessagePromise(msg: Record<string, unknown>): Promise<unknown> {
        sent.push(msg);
        const type = String(msg.type);
        const kind = String(msg.kind);
        if (opts.refuse?.includes(kind)) throw refusal("invalid", `unknown kind ${kind}`);
        if (type.endsWith("/get")) return structuredClone(stored[kind] ?? record(kind, 0));
        if (type.endsWith("/history")) return { entries: [] };
        if (type.endsWith("/save")) {
          if (opts.onSave) return opts.onSave(msg);
          const next = record(kind, (stored[kind]?.revision ?? 0) + 1, msg.document as BehaviorDocument);
          stored[kind] = next;
          return { revision: next.revision };
        }
        if (type.endsWith("/restore")) return { revision: (stored[kind]?.revision ?? 0) + 1 };
        throw refusal("unknown_command");
      },
      async subscribeMessage() {
        return async () => undefined;
      },
    },
  } as unknown as HassLike;
  return {
    hass,
    sent,
    of: (suffix: string) => sent.filter((m) => String(m.type).endsWith(suffix)),
    hold(kind: string, next: WatchConfigRecord) { stored[kind] = next; },
  };
}

/** The element's private parts this file reads and drives. */
interface EditorInside {
  hass?: HassLike;
  owners: readonly OwnerSummary[];
  watchId?: string;
  record?: WatchConfigRecord;
  note?: { kind: string; text: string };
  unsupported: boolean;
  draft?: { effective: BehaviorDocument; dirty: boolean; pending: ReadonlyMap<string, unknown> };
  load(watchId: string, quiet?: boolean): Promise<void>;
  startFresh(): void;
  save(): Promise<void>;
  restore(): Promise<void>;
  restoreAsk?: { entry: { revision: number }; baseRevision: number };
  viewHost(): RoomsViewHost | undefined;
  renderBody(watches: readonly OwnerSummary[]): unknown;
  renderTopBar(draft: unknown, watches: readonly OwnerSummary[]): unknown;
}

/** The top bar as drawn now. */
const bar = (el: EditorInside) => flatten(el.renderTopBar(el.draft, el.owners));

function editor(hass: HassLike, row: OwnerSummary): EditorInside {
  const el = new WaRoomsEditor() as unknown as EditorInside;
  el.hass = hass;
  el.owners = [row];
  el.watchId = row.owner_watch_id;
  return el;
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

const SECOND = { main_house: false } as const;

/** A `rooms` record's document as the iPhone would move it. */
function homeRooms(extra: BehaviorDocument = {}): BehaviorDocument {
  return {
    schemaVersion: 1,
    roomQuickJumpSourceEntityId: "sensor.cabin_area",
    roomQuickJumpMappings: { kitchen: "P1" },
    roomAutoSwitchEnabled: false,
    ...extra,
  };
}

afterEach(() => {
  for (const id of ["w1", "w2"]) {
    forgetRoomsDraft(id);
    forgetRoomsDraft(`${id}\u0000rooms`);
  }
  forgetStartFreshChoices();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// ── the kind ─────────────────────────────────────────────────────────────

describe("the record a watch's rooms live in", () => {
  it("is rooms only on a home whose row says main_house false", () => {
    expect(roomsKindFor(owner("w1", SECOND))).toBe("rooms");
    expect(roomsKindFor(owner("w1", { main_house: true }))).toBe("behavior");
    expect(roomsKindFor(owner("w1", { main_house: null }))).toBe("behavior");
    expect(roomsKindFor(owner("w1"))).toBe("behavior");
    expect(roomsKindFor(undefined)).toBe("behavior");
  });

  it("holds the six room keys, never the four that stay with the main house", () => {
    expect([...HOME_ROOM_KEYS].sort()).toEqual([
      "pointControlRoomMappingsJSON",
      "roomAutoSwitchEnabled",
      "roomQuickJumpEnabled",
      "roomQuickJumpFallbackPageId",
      "roomQuickJumpMappings",
      "roomQuickJumpSourceEntityId",
    ]);
    expect([...MAIN_HOUSE_ROOM_KEYS].sort()).toEqual([
      "handGestureAction",
      "pointControlLiveTile",
      "pointControlTapToToggle",
      "topSectionDoubleTapAction",
    ]);
    const all = Object.values(ROOM_KEYS).sort();
    expect([...HOME_ROOM_KEYS, ...MAIN_HOUSE_ROOM_KEYS].sort()).toEqual(all);
  });

  it("starts as a schemaVersion and nothing else", () => {
    expect(homeRoomsStart()).toEqual({ schemaVersion: 1 });
  });

  it("is measured against its own 64 KiB cap", () => {
    expect(HOME_ROOMS_LIMIT_BYTES).toBe(65536);
    expect(roomsBudget({ schemaVersion: 1 }, "rooms")).toEqual({ size: 19, limit: 65536 });
    expect(roomsBudget({ schemaVersion: 1 }).limit).toBe(WATCH_CONFIG_LIMIT_BYTES);
    expect(roomsBudget({ schemaVersion: 1 }, "behavior").limit).toBe(WATCH_CONFIG_LIMIT_BYTES);
  });
});

// ── the writes ───────────────────────────────────────────────────────────

describe("the writes on a home that is not the main house", () => {
  it("drop the four main house keys from any write", () => {
    const doc = homeRooms({ roomAutoSwitchEnabled: true, roomQuickJumpEnabled: true });
    for (const writes of [clearSensorWrites(doc), switchingWritesFor(doc, true), triggerWrites(doc, "Double Pinch"), triggerWrites(doc, "Double-Tap Top")]) {
      const kept = homeRoomWrites(writes);
      for (const key of kept.keys()) expect(MAIN_HOUSE_ROOM_KEYS).not.toContain(key);
      for (const [key, value] of writes) if (!MAIN_HOUSE_ROOM_KEYS.includes(key)) expect(kept.get(key)).toEqual(value);
    }
    expect(homeRoomWrites(new Map([[ROOM_KEYS.tapToToggle, true], [ROOM_KEYS.liveTile, true]])).size).toBe(0);
  });

  it("turn the automatic switch on as the phone's Automatic, and off alone", () => {
    const doc = homeRooms({ roomQuickJumpEnabled: true });
    expect(homeAutoSwitch(doc)).toBe(false);
    expect([...homeAutoSwitchWrites(doc, true)]).toEqual([[ROOM_KEYS.legacyQuickJump, false], [ROOM_KEYS.autoSwitch, true]]);
    const on = homeRooms({ roomAutoSwitchEnabled: true });
    expect(homeAutoSwitch(on)).toBe(true);
    expect([...homeAutoSwitchWrites(on, false)]).toEqual([[ROOM_KEYS.autoSwitch, false]]);
  });
});

// ── the cards ────────────────────────────────────────────────────────────

describe("the cards on a home that is not the main house", () => {
  function host(doc: BehaviorDocument, home: boolean): RoomsViewHost & { writes: ReadonlyMap<string, unknown>[] } {
    const writes: ReadonlyMap<string, unknown>[] = [];
    const view = readRooms(doc);
    return {
      hass: { states: {} } as unknown as HassLike,
      document: doc,
      view,
      dirty: new Set(),
      pages: [{ id: "P1", name: "Kitchen page" }],
      rooms: mergeRoomList({ mappingKeys: Object.keys(view.mappings) }),
      roomsState: "ready",
      busy: false,
      uiState: new Map<string, unknown>([["sensorOpen", true], ["pointOpen", true]]),
      writes,
      write: (w) => { writes.push(w); },
      endCoalesce: () => undefined,
      addRoom: () => undefined,
      requestUpdate: () => undefined,
      ...(home ? { home: true } : {}),
    };
  }

  it("hide the four main house keys behind one line", () => {
    const text = flatten(renderRoomsBody(host(homeRooms(), true)));
    expect(text).toContain(HOME_ROOMS_MAIN_HOUSE_TEXT);
    expect(text.split(HOME_ROOMS_MAIN_HOUSE_TEXT)).toHaveLength(2);
    // Point control stays (its targets are this home's own); its two
    // switches, the gestures and When are the main house's.
    for (const gone of ["Every room<", "Tap to Toggle", "Live Point Control Tile", "Double Pinch<", "rm-when"]) expect(text).not.toContain(gone);
    for (const shown of ["Room sensor", "Switch pages by room", HOME_AUTO_SWITCH_LABEL, "Anywhere else", "When I walk into", "Kitchen page", "Things to point at"]) expect(text).toContain(shown);
  });

  it("say it in plain words, with no dash", () => {
    expect(HOME_ROOMS_MAIN_HOUSE_TEXT).toBe("The double-tap on the page title, the double pinch and the point control switches come from this watch's main home.");
    for (const t of [HOME_ROOMS_MAIN_HOUSE_TEXT, HOME_ROOMS_NO_RECORD_TITLE, HOME_ROOMS_UPDATE_TEXT, HOME_AUTO_SWITCH_LABEL]) {
      expect(t).not.toMatch(DASH);
    }
  });

  it("leave the main house's four cards as they were", () => {
    const text = flatten(renderRoomsBody(host(homeRooms(), false)));
    expect(text).not.toContain(HOME_ROOMS_MAIN_HOUSE_TEXT);
    for (const title of ["Room sensor", "Switch pages by room", "Point control", "Tap to Toggle", "When I walk into"]) expect(text).toContain(title);
    expect(text).not.toContain(HOME_AUTO_SWITCH_LABEL);
  });

  it("word a save in rooms, and the main house's as before", () => {
    const conflict = { ok: false as const, code: "conflict", message: "" };
    expect(roomsSaveNote(conflict, "rooms")?.text).toBe("Not saved. This home's rooms kept changing elsewhere while saving. Your edits are kept, so try Save again in a moment.");
    expect(roomsSaveNote(conflict)?.text).toBe("Not saved. The watch's settings kept changing elsewhere while saving. Your edits are kept, so try Save again in a moment.");
    expect(roomsSaveNote({ ok: false, code: "no_record", message: "" }, "rooms")?.text).toBe("Not saved. Home Assistant no longer holds rooms for this home.");
  });
});

// ── the editor ───────────────────────────────────────────────────────────

describe("the rooms editor on a home that is not the main house", () => {
  it("reads the rooms kind, never behavior", async () => {
    const ha = fakeHass({ rooms: record("rooms", 3, homeRooms()), behavior: record("behavior", 9, { roomQuickJumpSourceEntityId: "sensor.main" }) });
    const el = editor(ha.hass, owner("w1", SECOND));
    await el.load("w1");
    expect(ha.of("/get").map((m) => m.kind)).toEqual(["rooms"]);
    expect(ha.of("/history").map((m) => m.kind)).toEqual(["rooms"]);
    expect(el.record?.revision).toBe(3);
    expect(el.draft?.effective).toEqual(homeRooms());
    const text = flatten(el.renderBody(el.owners));
    expect(text).toContain(HOME_ROOMS_MAIN_HOUSE_TEXT);
    expect(text).not.toContain("Tap to Toggle");
  });

  it("saves its edits to the rooms kind, without the main house's keys", async () => {
    const ha = fakeHass({ rooms: record("rooms", 3, homeRooms()) });
    const el = editor(ha.hass, owner("w1", SECOND));
    await el.load("w1");
    const host = el.viewHost()!;
    expect(host.home).toBe(true);
    host.write(new Map<string, unknown>([[ROOM_KEYS.fallback, "__stay__"], [ROOM_KEYS.handGesture, "Room Jump"], [ROOM_KEYS.tapToToggle, true]]));
    expect([...el.draft!.pending.keys()]).toEqual([ROOM_KEYS.fallback]);
    await el.save();
    const [save] = ha.of("/save");
    expect(save).toMatchObject({ kind: "rooms", owner_watch_id: "w1", base_revision: 3 });
    expect(save!.document).toEqual({ ...homeRooms(), roomQuickJumpFallbackPageId: "__stay__" });
  });

  it("restores the rooms kind", async () => {
    const ha = fakeHass({ rooms: record("rooms", 3, homeRooms()) });
    const el = editor(ha.hass, owner("w1", SECOND));
    await el.load("w1");
    el.restoreAsk = { entry: { revision: 2 } as never, baseRevision: 3 };
    await el.restore();
    expect(ha.of("/restore")).toEqual([expect.objectContaining({ kind: "rooms", revision: 2, base_revision: 3 })]);
  });

  it("opens ready with no record and no iPhone, unsaved, and its first save makes the record over revision 0", async () => {
    const ha = fakeHass({});
    const el = editor(ha.hass, owner("w1", { ...SECOND, has_iphone: false }));
    await el.load("w1");
    const text = flatten(el.renderBody(el.owners));
    expect(text).toContain(NEW_WATCH_TEXT);
    expect(text).toContain("When I walk into");
    expect(text).toContain(HOME_ROOMS_MAIN_HOUSE_TEXT);
    expect(text).not.toContain(HOME_ROOMS_NO_RECORD_TITLE);
    expect(text).not.toContain(START_FRESH_BUTTON);
    expect(text).not.toContain(WAIT_FOR_IPHONE_TEXT);
    // Nothing written, nothing unsaved, and Save says why it is greyed out.
    expect(ha.of("/save")).toEqual([]);
    expect(el.draft?.dirty).toBe(false);
    expect(anyRoomsDirty()).toBe(false);
    expect(bar(el)).toContain(NOTHING_TO_SAVE_TEXT);

    el.viewHost()!.write(new Map<string, unknown>([[ROOM_KEYS.fallback, "__stay__"], [ROOM_KEYS.tapToToggle, true]]));
    expect(el.draft?.dirty).toBe(true);
    expect(bar(el)).not.toContain(NOTHING_TO_SAVE_TEXT);
    await el.save();
    expect(ha.of("/save")).toEqual([expect.objectContaining({ kind: "rooms", base_revision: 0, document: { schemaVersion: 1, roomQuickJumpFallbackPageId: "__stay__" } })]);
    expect(el.record?.revision).toBe(1);
    expect(el.note).toBeUndefined();
    const after = flatten(el.renderBody(el.owners));
    expect(after).toContain("When I walk into");
    expect(after).not.toContain(NEW_WATCH_TEXT);
  });

  it("waits for the iPhone while the watch has one; the link asks first and opens the ready screen, unsaved", async () => {
    const ha = fakeHass({});
    const el = editor(ha.hass, owner("w1", { ...SECOND, has_iphone: true }));
    await el.load("w1");
    const tpl = el.renderBody(el.owners);
    const text = flatten(tpl);
    expect(text).toContain(HOME_ROOMS_NO_RECORD_TITLE);
    expect(text).toContain(WAIT_FOR_IPHONE_TEXT);
    expect(text).toContain("link start-fresh");
    expect(text).toContain(START_FRESH_BUTTON);
    expect(text).not.toContain("pe-btn pe-primary");
    expect(text).not.toContain(NEW_WATCH_TEXT);
    expect(el.draft).toBeUndefined();

    const ask = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true);
    vi.stubGlobal("window", { confirm: ask });
    const [click] = listeners(tpl);
    click!();
    expect(ask).toHaveBeenCalledWith(START_FRESH_CONFIRM_TEXT);
    expect(flatten(el.renderBody(el.owners))).toContain(WAIT_FOR_IPHONE_TEXT);
    click!();
    const ready = flatten(el.renderBody(el.owners));
    expect(ready).toContain(NEW_WATCH_TEXT);
    expect(ready).toContain("When I walk into");
    expect(ready).not.toContain(WAIT_FOR_IPHONE_TEXT);
    expect(ha.of("/save")).toEqual([]);
    expect(el.draft?.dirty).toBe(false);
  });

  it("lays its edits over the iPhone's rooms when they came meanwhile", async () => {
    const ha = fakeHass({}, {
      onSave: async (msg) => {
        if (msg.base_revision === 0) throw refusal("conflict");
        return { revision: 2 };
      },
    });
    const el = editor(ha.hass, owner("w1", SECOND));
    await el.load("w1");
    el.viewHost()!.write(new Map<string, unknown>([[ROOM_KEYS.fallback, "__stay__"]]));
    ha.hold("rooms", record("rooms", 1, homeRooms()));
    await el.save();
    const saves = ha.of("/save");
    expect(saves.map((m) => m.base_revision)).toEqual([0, 1]);
    expect(saves[1]!.document).toEqual({ ...homeRooms(), roomQuickJumpFallbackPageId: "__stay__" });
    expect(el.record?.revision).toBe(2);
  });

  it("asks to pair first when its first save meets a watch that is not paired here", async () => {
    const ha = fakeHass({}, { onSave: async () => { throw refusal("no_record"); } });
    const el = editor(ha.hass, owner("w1", SECOND));
    await el.load("w1");
    el.viewHost()!.write(new Map<string, unknown>([[ROOM_KEYS.fallback, "__stay__"]]));
    await el.save();
    expect(el.note).toEqual({ kind: "warn", text: PAIR_FIRST_TEXT });
    expect(el.draft?.dirty).toBe(true);
  });

  it("points an iPhone at its own settings, not at a main house", async () => {
    const ha = fakeHass({ rooms: record("rooms", 3, homeRooms()) });
    const el = editor(ha.hass, { ...owner("p1"), device_kind: "iphone", phone_pages: true, device_name: "iPhone" } as OwnerSummary);
    (el as unknown as { phones: boolean }).phones = true;
    await el.load("p1");
    expect(ha.of("/get").map((m) => m.kind)).toEqual(["rooms"]);
    expect(el.viewHost()).toMatchObject({ home: true, phone: true });
    const text = flatten(el.renderBody(el.owners));
    expect(text).toContain(HOME_ROOMS_PHONE_TEXT);
    expect(text).not.toContain(HOME_ROOMS_MAIN_HOUSE_TEXT);
    expect(HOME_ROOMS_PHONE_TEXT).not.toMatch(DASH);
  });

  it("opens ready as a new iPhone when it has no rooms yet", async () => {
    const ha = fakeHass({});
    const el = editor(ha.hass, { ...owner("p1"), device_kind: "iphone", phone_pages: true, device_name: "iPhone" } as OwnerSummary);
    (el as unknown as { phones: boolean }).phones = true;
    await el.load("p1");
    const text = flatten(el.renderBody(el.owners));
    expect(text).toContain(newDeviceText("iphone"));
    expect(text).not.toContain(NEW_WATCH_TEXT);
    expect(text).not.toContain(HOME_ROOMS_NO_RECORD_TITLE);
    expect(text).toContain(HOME_ROOMS_PHONE_TEXT);
  });

  it("asks for an update when the integration does not keep the kind", async () => {
    const ha = fakeHass({}, { refuse: ["rooms"] });
    const el = editor(ha.hass, owner("w1", SECOND));
    await el.load("w1");
    expect(el.unsupported).toBe(true);
    expect(flatten(el.renderBody(el.owners))).toContain(HOME_ROOMS_UPDATE_TEXT);
  });
});

describe("the rooms editor on the main house", () => {
  it("reads behavior and, with no record and no iPhone, opens ready on Watch settings' defaults", async () => {
    for (const row of [owner("w1"), owner("w1", { main_house: true })]) {
      forgetRoomsDraft("w1");
      const ha = fakeHass({});
      const el = editor(ha.hass, row);
      await el.load("w1");
      expect(ha.of("/get").map((m) => m.kind)).toEqual(["behavior"]);
      const text = flatten(el.renderBody(el.owners));
      expect(text).toContain(NEW_WATCH_TEXT);
      expect(text).toContain("Switch pages by room");
      expect(text).not.toContain(HOME_AUTO_SWITCH_LABEL);
      expect(text).not.toContain(HOME_ROOMS_MAIN_HOUSE_TEXT);
      expect(text).not.toContain(ROOMS_NO_RECORD_TITLE);
      expect(text).not.toContain("Open Settings");
      expect(el.draft?.effective).toEqual(watchBehaviorDefaults());
      expect(el.draft?.dirty).toBe(false);
      expect(ha.of("/save")).toEqual([]);
    }
  });

  it("makes the whole settings record with its first save, the room edits on Watch settings' defaults", async () => {
    const ha = fakeHass({});
    const el = editor(ha.hass, owner("w1"));
    await el.load("w1");
    el.viewHost()!.write(new Map<string, unknown>([[ROOM_KEYS.fallback, "__stay__"]]));
    await el.save();
    const [save] = ha.of("/save");
    expect(save).toMatchObject({ kind: "behavior", base_revision: 0 });
    expect(save!.document).toEqual({ ...watchBehaviorDefaults(), roomQuickJumpFallbackPageId: "__stay__" });
    expect(el.record?.revision).toBe(1);
  });

  it("waits for the iPhone with a Start fresh link while the watch has one", async () => {
    const ha = fakeHass({});
    const el = editor(ha.hass, owner("w1", { has_iphone: true }));
    await el.load("w1");
    const text = flatten(el.renderBody(el.owners));
    expect(text).toContain(ROOMS_NO_RECORD_TITLE);
    expect(text).toContain(ROOMS_WAIT_TEXT);
    expect(text).toContain(START_FRESH_BUTTON);
    expect(text).not.toContain(NEW_WATCH_TEXT);
    vi.stubGlobal("window", { confirm: () => true });
    el.startFresh();
    expect(flatten(el.renderBody(el.owners))).toContain(NEW_WATCH_TEXT);
    expect(ha.of("/save")).toEqual([]);
  });

  it("saves behavior with the four keys as before", async () => {
    const doc = { roomQuickJumpSourceEntityId: "sensor.main", wrapPages: true };
    const ha = fakeHass({ behavior: record("behavior", 4, doc) });
    const el = editor(ha.hass, owner("w1"));
    await el.load("w1");
    expect(el.viewHost()!.home).toBeUndefined();
    el.viewHost()!.write(new Map<string, unknown>([[ROOM_KEYS.tapToToggle, true]]));
    await el.save();
    const [save] = ha.of("/save");
    expect(save).toMatchObject({ kind: "behavior", base_revision: 4 });
    expect(save!.document).toEqual({ ...doc, pointControlTapToToggle: true });
    expect(flatten(el.renderBody(el.owners))).not.toContain(HOME_ROOMS_MAIN_HOUSE_TEXT);
  });
});
