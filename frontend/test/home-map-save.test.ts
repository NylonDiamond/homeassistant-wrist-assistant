// Saving the Home map page's edits and holding the map between screens: a
// save names the rev it was made from; refused `conflict`, the map is read
// again, the same edit made on it and saved once more, and the page is told
// when that cannot be done. The panel's two commands carry the store's keys
// exactly, and the read the page editor's tiles draw from is taken once per
// connection, only with the `home_map` capability.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import { type HassLike, fetchHomeMap, saveHomeMap } from "../src/ha-api.js";
import { type HomeMapDocument, type HomeMapEdit, applyHomeMapEdit } from "../src/home-map/model.js";
import {
  HOME_MAP_AGAIN_TEXT,
  HOME_MAP_GONE_TEXT,
  type HomeMapApi,
  saveHomeMapEdit,
} from "../src/home-map/save.js";
import {
  HOME_MAP_STALE_MS,
  forgetHomeMap,
  homeMapCapable,
  homeMapOn,
  homeMapRead,
  keepHomeMap,
  setHomeMapCapable,
} from "../src/home-map/store.js";

const FIXTURE_TEXT = readFileSync(join(__dirname, "..", "..", "tests", "fixtures", "home_map", "basic.json"), "utf8");
const fixture = (): HomeMapDocument => JSON.parse(FIXTURE_TEXT) as HomeMapDocument;

const LIVING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000010";
const KITCHEN = "7B1E0C2A-5D3F-4A8B-9C6D-000000000011";
const READING = "7B1E0C2A-5D3F-4A8B-9C6D-000000000100";
const SIDE_DOOR = "7B1E0C2A-5D3F-4A8B-9C6D-000000000102";

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
    if (outcome.ok) return;
    expect(outcome.text).toBe(HOME_MAP_AGAIN_TEXT);
    expect(outcome.read?.rev).toBe(4);
    expect(store.saves.map((s) => s.baseRev)).toEqual([3, 4]);
  });

  it("passes on any other refusal, and checks the edit before sending it", async () => {
    const api: HomeMapApi = {
      get: vi.fn(),
      save: vi.fn(async () => { throw refusal("unavailable", "the stored home map could not be read"); }),
    };
    expect(await saveHomeMapEdit(api, { doc: fixture(), rev: 1 }, move)).toEqual({ ok: false, text: "Not saved. the stored home map could not be read" });
    expect(api.get).not.toHaveBeenCalled();
    expect(await saveHomeMapEdit(api, { doc: fixture(), rev: 1 }, { kind: "removePin", pinId: LIVING })).toEqual({ ok: false, text: "That is no longer on the map." });
    expect(await saveHomeMapEdit(api, { doc: null, rev: 0 }, move)).toEqual({ ok: false, text: "There is no map to change yet." });
    expect(api.save).toHaveBeenCalledTimes(1);
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
});
