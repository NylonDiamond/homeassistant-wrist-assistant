// Saving the Home map page's edits and holding the map between screens: a
// save names the rev it was made from; refused `conflict`, the map is read
// again, the same edit made on it and saved once more, and the page is told
// when that cannot be done. The panel's two commands carry the store's keys
// exactly, and the read the page editor's tiles draw from is taken once per
// connection, only with the `home_map` capability.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import { type HassLike, fetchHomeMap, fetchHomeMapIfChanged, saveHomeMap, subscribeHomeMap } from "../src/ha-api.js";
import { moveRoom, startHomeMap } from "../src/home-map/edit-ops.js";
import { type HomeMapDocument, type HomeMapEdit, applyHomeMapEdit } from "../src/home-map/model.js";
import {
  HOME_MAP_AGAIN_TEXT,
  HOME_MAP_GONE_TEXT,
  HOME_MAP_RETRY_TEXT,
  HOME_MAP_SAVE_TIMEOUT_MS,
  type HomeMapApi,
  homeMapSaveCanRetry,
  saveHomeMapEdit,
} from "../src/home-map/save.js";
import {
  HOME_MAP_STALE_MS,
  forgetHomeMap,
  homeMapCapable,
  homeMapOn,
  homeMapRead,
  homeMapReadFailed,
  keepHomeMap,
  setHomeMapCapable,
} from "../src/home-map/store.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";
const SIDE_DOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000102";
const FIRST_FLOOR = "0a1b2c3d-0000-4000-8000-000000000001";

const refusal = (code: string, message: string) => Object.assign(new Error(message), { code });
const settle = () => new Promise((r) => setTimeout(r, 0));

/** The two commands over a stored map that another device may change
 * between the page's read and its save (`meanwhile`). */
function fakeStore(start: HomeMapDocument, rev: number, meanwhile: ((doc: HomeMapDocument) => HomeMapDocument)[] = []) {
  let doc = start;
  let stored = rev;
  const saves: { doc: HomeMapDocument; baseRev: number }[] = [];
  const api: HomeMapApi = {
    async get() {
      return { doc: structuredClone(doc), rev: stored };
    },
    async save(next, baseRev) {
      saves.push({ doc: next, baseRev });
      const change = meanwhile.shift();
      if (change !== undefined) {
        doc = change(doc);
        stored += 1;
      }
      if (baseRev !== stored) throw refusal("conflict", `stored revision is ${stored}, save was based on ${baseRev}`);
      doc = next;
      stored += 1;
      return { rev: stored };
    },
  };
  return { api, saves, now: () => ({ doc, rev: stored }) };
}

const move: HomeMapEdit = { kind: "movePin", pinId: READING, at: [2, 2] };

describe("saveHomeMapEdit", () => {
  it("saves the edit made on the map it was read at, naming that rev", async () => {
    const store = fakeStore(fixture(), 3);
    const outcome = await saveHomeMapEdit(store.api, { doc: fixture(), rev: 3 }, move);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.merged).toBe(false);
    expect(outcome.read.rev).toBe(4);
    expect(store.saves.map((s) => s.baseRev)).toEqual([3]);
    expect(outcome.read.doc.floors[0]!.pins[0]!.at).toEqual([2, 2, 1.5]);
  });

  it("after a conflict, reads the map again, makes the same edit on it and saves it on top", async () => {
    // The iPhone renamed the kitchen meanwhile; the page's move goes on top.
    const rename = (d: HomeMapDocument) => applyHomeMapEdit(d, { kind: "renameRoom", roomId: KITCHEN, name: "Galley" })!;
    const store = fakeStore(fixture(), 3, [rename]);
    const outcome = await saveHomeMapEdit(store.api, { doc: fixture(), rev: 3 }, move);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.merged).toBe(true);
    expect(store.saves.map((s) => s.baseRev)).toEqual([3, 4]);
    expect(outcome.read).toEqual({ doc: store.now().doc, rev: 5 });
    expect(outcome.read.doc.floors[0]!.rooms[1]!.name).toBe("Galley");
    expect(outcome.read.doc.floors[0]!.pins[0]!.at).toEqual([2, 2, 1.5]);
  });

  it("says so, with the map as saved elsewhere, when the edit no longer fits it", async () => {
    const remove = (d: HomeMapDocument) => applyHomeMapEdit(d, { kind: "removePin", pinId: READING })!;
    const store = fakeStore(fixture(), 3, [remove]);
    const outcome = await saveHomeMapEdit(store.api, { doc: fixture(), rev: 3 }, move);
    expect(outcome).toEqual({ ok: false, text: HOME_MAP_GONE_TEXT, read: { doc: store.now().doc, rev: 4 } });
    expect(store.saves).toHaveLength(1);
  });

  it("gives up after a second conflict and says to try once more", async () => {
    const touch = (d: HomeMapDocument) => applyHomeMapEdit(d, { kind: "removePin", pinId: SIDE_DOOR })!;
    const store = fakeStore(fixture(), 3, [touch, (d) => d]);
    const outcome = await saveHomeMapEdit(store.api, { doc: fixture(), rev: 3 }, move);
    expect(outcome.ok).toBe(false);
    if (outcome.ok || outcome.retry === true) throw new Error("not a refusal");
    expect(outcome.text).toBe(HOME_MAP_AGAIN_TEXT);
    expect(outcome.read?.rev).toBe(4);
    expect(store.saves.map((s) => s.baseRev)).toEqual([3, 4]);
  });

  it("passes on any other refusal, and checks the edit before sending it", async () => {
    const api: HomeMapApi = {
      get: vi.fn(),
      save: vi.fn(async () => { throw refusal("too_large", "a home map is at most 256 KiB"); }),
    };
    expect(await saveHomeMapEdit(api, { doc: fixture(), rev: 1 }, move)).toEqual({ ok: false, text: "Not saved. The map is too big to save. Take out some rooms or things." });
    expect(api.get).not.toHaveBeenCalled();
    expect(await saveHomeMapEdit(api, { doc: fixture(), rev: 1 }, { kind: "removePin", pinId: LIVING })).toEqual({ ok: false, text: "That is no longer on the map." });
    // Before the first map, an edit is made on the empty map, where a pin
    // is not.
    expect(await saveHomeMapEdit(api, { doc: null, rev: 0 }, move)).toEqual({ ok: false, text: "That is no longer on the map." });
    expect(api.save).toHaveBeenCalledTimes(1);
  });

  it("saves the home's first map from rev 0, made on the empty map", async () => {
    const saves: { doc: HomeMapDocument; baseRev: number }[] = [];
    const api: HomeMapApi = {
      get: vi.fn(),
      save: async (doc, baseRev) => {
        saves.push({ doc, baseRev });
        return { rev: 1 };
      },
    };
    const start = (d: HomeMapDocument) => startHomeMap(d, { id: FIRST_FLOOR, name: "Ground floor", story: 0 });
    const outcome = await saveHomeMapEdit(api, { doc: null, rev: 0 }, start);
    expect(outcome).toEqual({ ok: true, read: { doc: { v: 1, floors: [{ id: FIRST_FLOOR, name: "Ground floor", story: 0, rooms: [], pins: [] }] }, rev: 1 }, merged: false });
    expect(saves).toEqual([{ doc: { v: 1, floors: [{ id: FIRST_FLOOR, name: "Ground floor", story: 0, rooms: [], pins: [] }] }, baseRev: 0 }]);
    // A start never stands on a map with a floor.
    expect(await saveHomeMapEdit(api, { doc: fixture(), rev: 3 }, start)).toEqual({ ok: false, text: "That is no longer on the map." });
  });

  it("says to try again when Home Assistant could not be reached, and never takes it for a refusal", async () => {
    for (const failure of [
      { type: "result", success: false, error: { code: 3, message: "Connection lost" } },
      new Error("WebSocket is closed"),
      refusal("unavailable", "integration not ready"),
      refusal("timeout", "Home Assistant did not answer."),
    ]) {
      expect(homeMapSaveCanRetry(failure)).toBe(true);
      const api: HomeMapApi = { get: vi.fn(), save: vi.fn(async () => { throw failure; }) };
      const outcome = await saveHomeMapEdit(api, { doc: fixture(), rev: 1 }, move);
      expect(outcome).toEqual({ ok: false, retry: true, text: HOME_MAP_RETRY_TEXT, sent: applyHomeMapEdit(fixture(), move) });
      expect(api.get).not.toHaveBeenCalled();
    }
    for (const code of ["conflict", "invalid", "too_large", "unauthorized", "unknown_command"]) expect(homeMapSaveCanRetry(refusal(code, "x"))).toBe(false);
  });

  it("gives up waiting for an answer after a while, as a save to try again", async () => {
    vi.useFakeTimers();
    try {
      const api: HomeMapApi = { get: vi.fn(), save: () => new Promise(() => undefined) };
      const pending = saveHomeMapEdit(api, { doc: fixture(), rev: 1 }, move);
      await vi.advanceTimersByTimeAsync(HOME_MAP_SAVE_TIMEOUT_MS);
      expect(await pending).toMatchObject({ ok: false, retry: true });
    } finally {
      vi.useRealTimers();
    }
  });

  it("knows a try that never heard back but did land, and does not make the edit twice", async () => {
    // A room moved a metre must not move two: the first try was stored, its
    // answer lost; the second, from the old rev, is refused `conflict`, and
    // the map read again is the one the first try sent.
    const shift = (d: HomeMapDocument) => moveRoom(d, KITCHEN, 1, 0);
    const sent = (await saveHomeMapEdit({ get: vi.fn(), save: async () => { throw new Error("Connection lost"); } }, { doc: fixture(), rev: 3 }, shift));
    if (sent.ok || sent.retry !== true) throw new Error("not a retry");
    const store = fakeStore(fixture(), 3, [() => sent.sent!]);
    const outcome = await saveHomeMapEdit(store.api, { doc: fixture(), rev: 3 }, shift, sent.sent);
    expect(outcome).toEqual({ ok: true, read: { doc: sent.sent, rev: 4 }, merged: false });
    expect(store.saves).toHaveLength(1);
    expect(store.now().doc.floors[0]!.rooms[1]!.outline[0]).toEqual([7, 0]);
  });
});

/** A Home Assistant that answers the two commands and records them. */
function fakeHass(reply: unknown) {
  const sent: Record<string, unknown>[] = [];
  const hass = {
    states: {},
    connection: {
      async sendMessagePromise(msg: Record<string, unknown>) {
        sent.push(msg);
        if (msg.type === "wrist_assistant/home_map/get") return reply;
        if (msg.type === "wrist_assistant/home_map/save") return { rev: 9 };
        throw refusal("unknown_command", "Unknown command.");
      },
      async subscribeMessage() {
        return async () => undefined;
      },
    },
  } as unknown as HassLike;
  return { hass, sent };
}

describe("the panel's commands", () => {
  it("are home_map/get and home_map/save with doc and base_rev", async () => {
    const { hass, sent } = fakeHass({ doc: null, rev: 0 });
    expect(await fetchHomeMap(hass)).toEqual({ doc: null, rev: 0 });
    expect(await saveHomeMap(hass, fixture(), 0)).toEqual({ rev: 9 });
    expect(sent).toEqual([{ type: "wrist_assistant/home_map/get" }, { type: "wrist_assistant/home_map/save", doc: fixture(), base_rev: 0 }]);
  });

  it("checks with the rev held, reading nothing when it is still the one stored", async () => {
    const { hass, sent } = fakeHass({ not_modified: true, rev: 4 });
    expect(await fetchHomeMapIfChanged(hass, 4)).toBeUndefined();
    expect(sent).toEqual([{ type: "wrist_assistant/home_map/get", rev: 4 }]);
    const changed = fakeHass({ doc: fixture(), rev: 5 });
    expect(await fetchHomeMapIfChanged(changed.hass, 4)).toEqual({ doc: fixture(), rev: 5 });
  });

  it("subscribes with home_map/subscribe and hands on each rev", async () => {
    const heard: number[] = [];
    let message: Record<string, unknown> | undefined;
    let deliver: ((event: unknown) => void) | undefined;
    const hass = {
      states: {},
      connection: {
        sendMessagePromise: vi.fn(),
        async subscribeMessage(callback: (event: unknown) => void, msg: Record<string, unknown>) {
          message = msg;
          deliver = callback;
          return async () => undefined;
        },
      },
    } as unknown as HassLike;
    await subscribeHomeMap(hass, (rev) => heard.push(rev));
    expect(message).toEqual({ type: "wrist_assistant/home_map/subscribe" });
    deliver!({ rev: 0 });
    deliver!({ rev: 3 });
    deliver!({ rev: "4" });
    deliver!(null);
    expect(heard).toEqual([0, 3]);
  });
});

describe("the map held between screens", () => {
  afterEach(() => {
    forgetHomeMap();
    vi.useRealTimers();
  });

  it("reads only with the home_map capability, the owners reply's", () => {
    expect(homeMapOn(["phone_pages", "home_map"])).toBe(true);
    expect(homeMapOn(["phone_pages"])).toBe(false);
    expect(homeMapOn(undefined)).toBe(false);
    const { hass, sent } = fakeHass({ doc: fixture(), rev: 2 });
    expect(homeMapCapable()).toBe(false);
    expect(homeMapRead(hass, () => undefined)).toBeUndefined();
    expect(sent).toEqual([]);
  });

  it("reads once per connection, draws again once in, and again once a minute old", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    setHomeMapCapable(true);
    const { hass, sent } = fakeHass({ doc: fixture(), rev: 2 });
    const drawn = vi.fn();
    expect(homeMapRead(hass, drawn)).toBeUndefined();
    expect(homeMapRead(hass, drawn)).toBeUndefined();
    await settle();
    expect(drawn).toHaveBeenCalled();
    expect(homeMapRead(hass, drawn)).toEqual({ doc: fixture(), rev: 2 });
    expect(sent).toHaveLength(1);
    vi.setSystemTime(Date.now() + HOME_MAP_STALE_MS + 1);
    // The old read stands while the new one is out.
    expect(homeMapRead(hass, drawn)).toEqual({ doc: fixture(), rev: 2 });
    expect(sent).toHaveLength(2);
  });

  it("takes the page's saves, and keeps a newer save over an older read", async () => {
    setHomeMapCapable(true);
    const { hass } = fakeHass({ doc: fixture(), rev: 2 });
    homeMapRead(hass, () => undefined);
    const moved = applyHomeMapEdit(fixture(), move)!;
    keepHomeMap(hass, { doc: moved, rev: 3 });
    await settle();
    expect(homeMapRead(hass, () => undefined)).toEqual({ doc: moved, rev: 3 });
  });

  it("reads a damaged map as none", async () => {
    setHomeMapCapable(true);
    const { hass } = fakeHass({ doc: { v: 7 }, rev: 4 });
    homeMapRead(hass, () => undefined);
    await settle();
    expect(homeMapRead(hass, () => undefined)).toEqual({ doc: null, rev: 4 });
  });

  it("says when the first read failed, and asks to draw again so a card can say so", async () => {
    setHomeMapCapable(true);
    const hass = { connection: { sendMessagePromise: () => Promise.reject(new Error("no")) } } as unknown as Parameters<typeof homeMapRead>[0];
    const drawn = vi.fn();
    expect(homeMapRead(hass, drawn)).toBeUndefined();
    expect(homeMapReadFailed()).toBe(false);
    await settle();
    expect(drawn).toHaveBeenCalledOnce();
    expect(homeMapReadFailed()).toBe(true);
    // Drawing again does not read again, so the two cannot loop.
    expect(homeMapRead(hass, drawn)).toBeUndefined();
    expect(drawn).toHaveBeenCalledOnce();
  });

  it("does not call a read that came back a failure", async () => {
    setHomeMapCapable(true);
    const { hass } = fakeHass({ doc: fixture(), rev: 2 });
    homeMapRead(hass, () => undefined);
    await settle();
    expect(homeMapReadFailed()).toBe(false);
  });
});
