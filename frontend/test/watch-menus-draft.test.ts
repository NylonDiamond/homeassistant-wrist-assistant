// The menus draft and its save: undo and redo, the merge of a change from
// elsewhere, a save that meets a conflict, the shape check that stops a send,
// the drafts kept per watch, and the no-record path ("Start with the
// defaults").

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { JsonObject } from "../src/watch-pages/model.js";
import {
  WATCH_MENUS_SAVE_ATTEMPTS,
  WatchMenusDraft,
  anyWatchMenusDirty,
  dropAllWatchMenus,
  forgetWatchMenusDraft,
  keptWatchMenusDraft,
  saveWatchMenusDraft,
  startWatchMenus,
  takeWatchMenusRecord,
} from "../src/watch-menus/draft.js";
import {
  ANYWHERE,
  type MenusDocument,
  WATCH_MENUS_NO_RECORD_TEXT,
  WATCH_MENUS_NO_RECORD_TITLE,
  WATCH_MENUS_PAIR_FIRST_TEXT,
  WATCH_MENUS_START_BUTTON,
  WATCH_MENUS_UPDATE_TEXT,
  scrubWatchMenuOrphanTriggers,
  setWatchMenuSlotAction,
  setWatchMenuStyle,
  watchMenusDefaults,
} from "../src/watch-menus/model.js";
import { watchMenusReplacedText, watchMenusSaveNote } from "../src/watch-menus/save-note.js";

const DEFAULTS = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "01-defaults.json"), "utf8")) as MenusDocument;

const style = (d: MenusDocument, key: string, value: unknown) => setWatchMenuStyle(d, "quickAction", key, value);
const switcher = (d: MenusDocument, key: string, value: unknown) => setWatchMenuStyle(d, "pageSwitcher", key, value);

function refusal(code: string, message = code): Error {
  return Object.assign(new Error(message), { code });
}

describe("the draft", () => {
  it("is clean as loaded, dirty after an edit, clean again when undone", () => {
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    expect(draft.dirty).toBe(false);
    expect(draft.apply(style(DEFAULTS, "showIconBubble", true))).toBe(true);
    expect(draft.dirty).toBe(true);
    expect(draft.undo()).toBe(true);
    expect(draft.document).toBe(DEFAULTS);
    expect(draft.dirty).toBe(false);
    expect(draft.redo()).toBe(true);
    expect(draft.dirty).toBe(true);
  });

  it("makes a run of edits with one key one step", () => {
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    draft.apply(style(draft.document, "backgroundDim", 0.5), "dim");
    draft.apply(style(draft.document, "backgroundDim", 0.6), "dim");
    draft.apply(style(draft.document, "backgroundDim", 0.7), "dim");
    expect(draft.canUndo).toBe(true);
    draft.undo();
    expect(draft.document).toBe(DEFAULTS);
    expect(draft.canUndo).toBe(false);
  });

  it("discards back to the base as a step undo takes back", () => {
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    const edited = style(DEFAULTS, "showIconBubble", true);
    draft.apply(edited);
    draft.discard();
    expect(draft.dirty).toBe(false);
    draft.undo();
    expect(draft.document).toBe(edited);
  });

  it("takes a change from elsewhere in, keeping its own section", () => {
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    draft.apply(style(DEFAULTS, "showIconBubble", true));
    const server = switcher(DEFAULTS, "selectedScale", 1.4);
    expect(draft.rebase(server, 3)).toBe(true);
    expect((draft.document.quickAction as JsonObject).showIconBubble).toBe(true);
    expect((draft.document.pageSwitcher as JsonObject).selectedScale).toBe(1.4);
    expect(draft.base).toBe(server);
    expect(draft.revision).toBe(3);
    expect(draft.replaced).toEqual([]);
    // A stale revision changes nothing.
    expect(draft.rebase(DEFAULTS, 1)).toBe(false);
  });

  it("keeps its own section whole when both sides changed it, and says which", () => {
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    draft.apply(style(DEFAULTS, "showIconBubble", true));
    const server = style(DEFAULTS, "beamStyle", "wakeWave");
    draft.rebase(server, 3);
    expect((draft.document.quickAction as JsonObject).showIconBubble).toBe(true);
    expect((draft.document.quickAction as JsonObject).beamStyle).toBe("none");
    expect(draft.replaced).toEqual(["quickAction"]);
  });

  it("names no section when both sides made the same change", () => {
    const edited = style(DEFAULTS, "showIconBubble", true);
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    draft.apply(edited);
    draft.rebase(switcher(structuredClone(edited), "glowIntensity", 0.9), 3);
    expect(draft.replaced).toEqual([]);
  });
});

describe("a save", () => {
  it("sends the draft over its revision and makes it the base", async () => {
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    draft.apply(style(DEFAULTS, "showIconBubble", true));
    const sent: [number, MenusDocument][] = [];
    const result = await saveWatchMenusDraft(draft, {
      save: async (base, document) => { sent.push([base, document]); return { revision: 3 }; },
      fetch: async () => { throw new Error("not asked"); },
    });
    expect(result).toEqual({ ok: true, revision: 3, merged: false });
    expect(sent).toHaveLength(1);
    expect(sent[0]![0]).toBe(2);
    expect(draft.dirty).toBe(false);
    expect(draft.revision).toBe(3);
  });

  it("drops a trigger with nothing picked before it sends, as the phone's save does", async () => {
    let draftDoc = setWatchMenuSlotAction(DEFAULTS, ANYWHERE, "3E4D0000-0000-4000-8000-000000000001", "triggerEntity");
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    draft.apply(draftDoc);
    let sent: MenusDocument | undefined;
    await saveWatchMenusDraft(draft, {
      prepare: scrubWatchMenuOrphanTriggers,
      save: async (_b, d) => { sent = d; return { revision: 3 }; },
      fetch: async () => ({ revision: 0, document: undefined }),
    });
    draftDoc = sent!;
    expect(((draftDoc.quickAction as JsonObject).slots as unknown[]).length).toBe(7);
  });

  it("meets a conflict, merges the newer record in and saves again", async () => {
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    draft.apply(style(DEFAULTS, "showIconBubble", true));
    const server = switcher(DEFAULTS, "selectedScale", 1.4);
    const bases: number[] = [];
    let last: MenusDocument | undefined;
    const result = await saveWatchMenusDraft(draft, {
      save: async (base, document) => {
        bases.push(base);
        if (base === 2) throw refusal("conflict", "stored revision is 3");
        last = document;
        return { revision: 4 };
      },
      fetch: async () => ({ revision: 3, document: server }),
    });
    expect(result).toEqual({ ok: true, revision: 4, merged: true });
    expect(bases).toEqual([2, 3]);
    expect((last!.pageSwitcher as JsonObject).selectedScale).toBe(1.4);
    expect((last!.quickAction as JsonObject).showIconBubble).toBe(true);
    expect(watchMenusSaveNote(result)?.text).toBe("Saved. Changes made somewhere else were merged in.");
  });

  it("says nothing after a plain save: the toolbar's Saved just now does", () => {
    expect(watchMenusSaveNote({ ok: true, revision: 4, merged: false })).toBeUndefined();
  });

  it("says when the iPhone changed the same section and the draft's version replaced it", async () => {
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    draft.apply(switcher(style(DEFAULTS, "showIconBubble", true), "glowIntensity", 0.9));
    const server = switcher(style(DEFAULTS, "beamStyle", "wakeWave"), "selectedScale", 1.4);
    const result = await saveWatchMenusDraft(draft, {
      save: async (base) => {
        if (base === 2) throw refusal("conflict");
        return { revision: 4 };
      },
      fetch: async () => ({ revision: 3, document: server }),
    });
    expect(result).toMatchObject({ ok: true, revision: 4, merged: true, replaced: ["quickAction", "pageSwitcher"] });
    expect(watchMenusSaveNote(result)).toEqual({
      kind: "warn",
      text: "Saved. Another save also changed the Anywhere menu and the page switcher. Your versions replaced them.",
    });
    expect(watchMenusReplacedText(["quickAction"])).toBe("Another save also changed the Anywhere menu. Your version replaced it.");
    expect(watchMenusReplacedText(["entityRadial"])).toBe("Another save also changed the Entity quick menu. Your version replaced it.");
    expect(watchMenusReplacedText([])).toBe("");
  });

  it("keeps the page switcher keys the watch never reads as they came", async () => {
    const stored: MenusDocument = { ...DEFAULTS, pageSwitcher: { ...(DEFAULTS.pageSwitcher as JsonObject), displayMode: "icon", displayOffset: -12, iconRadius: 0.52 } };
    const draft = new WatchMenusDraft(stored, 2);
    draft.apply(switcher(stored, "glowIntensity", 0.9));
    let sent: MenusDocument | undefined;
    await saveWatchMenusDraft(draft, {
      save: async (_b, d) => { sent = d; return { revision: 3 }; },
      fetch: async () => { throw new Error("not asked"); },
    });
    expect(sent!.pageSwitcher).toEqual({ ...(stored.pageSwitcher as JsonObject), glowIntensity: 0.9 });
    expect(Object.keys(sent!.pageSwitcher as JsonObject)).toEqual(Object.keys(stored.pageSwitcher as JsonObject));
  });

  it("ends with nothing to send when the iPhone saved the very same edit", async () => {
    const edited = style(DEFAULTS, "showIconBubble", true);
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    draft.apply(edited);
    const result = await saveWatchMenusDraft(draft, {
      save: async () => { throw refusal("conflict"); },
      fetch: async () => ({ revision: 3, document: structuredClone(edited) }),
    });
    expect(result).toMatchObject({ ok: true, alreadySaved: true, revision: 3 });
  });

  it("gives up after its attempts, keeping the edits", async () => {
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    draft.apply(style(DEFAULTS, "showIconBubble", true));
    let calls = 0;
    let rev = 2;
    const result = await saveWatchMenusDraft(draft, {
      save: async () => { calls++; throw refusal("conflict"); },
      fetch: async () => ({ revision: ++rev, document: switcher(DEFAULTS, "glowIntensity", rev / 10) }),
    });
    expect(result).toMatchObject({ ok: false, code: "conflict" });
    expect(calls).toBe(WATCH_MENUS_SAVE_ATTEMPTS);
    expect(draft.dirty).toBe(true);
    expect(watchMenusSaveNote(result)?.kind).toBe("warn");
  });

  it("is not sent when the shape check fails, and runs once at a time", async () => {
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    draft.apply({ ...DEFAULTS, quickAction: { slots: [{ id: "" }] } });
    const io = { save: async () => ({ revision: 3 }), fetch: async () => ({ revision: 2, document: DEFAULTS }) };
    const result = await saveWatchMenusDraft(draft, io);
    expect(result).toMatchObject({ ok: false, code: "invalid" });
    expect(watchMenusSaveNote(result)?.text).toMatch(/^Not saved\. Something in the menus is not right/);

    const ok = new WatchMenusDraft(DEFAULTS, 2);
    ok.apply(style(DEFAULTS, "showIconBubble", true));
    let release: () => void = () => undefined;
    const first = saveWatchMenusDraft(ok, { save: () => new Promise((r) => { release = () => r({ revision: 3 }); }), fetch: io.fetch });
    expect(ok.saving).toBe(true);
    expect(await saveWatchMenusDraft(ok, io)).toMatchObject({ ok: false, code: "busy" });
    release();
    expect(await first).toMatchObject({ ok: true });
    expect(ok.saving).toBe(false);
  });

  it("reads a record that went away as no record", async () => {
    const draft = new WatchMenusDraft(DEFAULTS, 2);
    draft.apply(style(DEFAULTS, "showIconBubble", true));
    const result = await saveWatchMenusDraft(draft, {
      save: async () => { throw refusal("conflict"); },
      fetch: async () => ({ revision: 0, document: undefined }),
    });
    expect(result).toMatchObject({ ok: false, code: "no_record" });
  });
});

describe("the kept drafts", () => {
  it("one per watch: made on the first read, rebased on a newer one, kept when there is none", () => {
    dropAllWatchMenus();
    const first = takeWatchMenusRecord("w1", DEFAULTS, 2);
    expect(keptWatchMenusDraft("w1")).toBe(first.draft);
    first.draft.apply(style(DEFAULTS, "showIconBubble", true));
    expect(anyWatchMenusDirty()).toBe(true);
    const newer = takeWatchMenusRecord("w1", switcher(DEFAULTS, "selectedScale", 1.4), 3);
    expect(newer.draft).toBe(first.draft);
    expect(newer.mergedIntoEdits).toBe(true);
    expect(newer.replaced).toEqual([]);
    const clash = takeWatchMenusRecord("w1", style(switcher(DEFAULTS, "selectedScale", 1.4), "beamStyle", "wakeWave"), 4);
    expect(clash.replaced).toEqual(["quickAction"]);
    expect(takeWatchMenusRecord("w1", DEFAULTS, 0).draft).toBe(first.draft);
    forgetWatchMenusDraft("w1");
    expect(keptWatchMenusDraft("w1")).toBeUndefined();
    expect(anyWatchMenusDirty()).toBe(false);
  });

  it("a clean draft is replaced when the store started over", () => {
    dropAllWatchMenus();
    const a = takeWatchMenusRecord("w2", DEFAULTS, 5).draft;
    const b = takeWatchMenusRecord("w2", DEFAULTS, 1).draft;
    expect(b).not.toBe(a);
    expect(b.revision).toBe(1);
    dropAllWatchMenus();
  });
});

describe("no record: Start with the defaults", () => {
  it("saves the defaults over revision 0", async () => {
    const calls: [number, MenusDocument][] = [];
    const result = await startWatchMenus(async (base, document) => { calls.push([base, document]); return { revision: 1 }; });
    expect(result).toEqual({ ok: true, revision: 1 });
    expect(calls[0]![0]).toBe(0);
    expect(calls[0]![1]).toEqual(watchMenusDefaults());
    expect(calls[0]![1]).toEqual(DEFAULTS);
  });

  it("tells a watch that is not paired, a record that came meanwhile, and an old integration apart", async () => {
    expect(await startWatchMenus(async () => { throw refusal("no_record"); })).toMatchObject({ ok: false, code: "no_record" });
    expect(await startWatchMenus(async () => { throw refusal("conflict"); })).toMatchObject({ ok: false, code: "conflict" });
    expect(await startWatchMenus(async () => { throw { type: "result", success: false, error: { code: "unknown_command", message: "x" } }; })).toMatchObject({ ok: false, code: "unsupported" });
    expect(await startWatchMenus(async () => { throw refusal("unavailable"); })).toMatchObject({ ok: false, code: "error" });
  });

  it("shows a refused document as an error in Home Assistant's words, never as an old integration", async () => {
    const message = "document is 300000 bytes; the limit for menus is 262144";
    expect(await startWatchMenus(async () => { throw refusal("invalid", message); })).toEqual({ ok: false, code: "error", message });
  });

  it("says so in plain words, with no iPhone switch", () => {
    expect(WATCH_MENUS_NO_RECORD_TITLE).toBe("No menus from this watch yet.");
    expect(WATCH_MENUS_START_BUTTON).toBe("Start with the defaults");
    expect(WATCH_MENUS_PAIR_FIRST_TEXT).toBe("Pair this watch first.");
    expect(WATCH_MENUS_UPDATE_TEXT).toBe("Update the integration to edit menus here.");
    expect(WATCH_MENUS_NO_RECORD_TEXT).toBe("Start with the defaults to begin.");
    expect(WATCH_MENUS_NO_RECORD_TEXT.startsWith(WATCH_MENUS_START_BUTTON)).toBe(true);
    for (const text of [WATCH_MENUS_NO_RECORD_TEXT, WATCH_MENUS_NO_RECORD_TITLE]) expect(text).not.toMatch(new RegExp(" - |\\u2013|\\u2014"));
  });
});
