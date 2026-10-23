// Delete with Undo: what hides, when the delete is sent, what Undo does, what
// the toast says, and which ⌘Z it takes.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";

import {
  DELETE_LATER_MS,
  LATER_SAID_MS,
  deleteLater,
  dismissLater,
  holdLater,
  laterHidden,
  laterKey,
  laterToast,
  laterWaiting,
  resetLaterForTest,
  sendLaterNow,
  undoKeyTakesDelete,
  undoLater,
} from "../src/delete-later.js";
import { summaryWithout } from "../src/library/store.js";

const job = (text: string, keys: string[], fail?: string) => {
  const send = vi.fn(async () => fail);
  return { job: { text, hide: keys, send }, send };
};

describe("a delete with Undo", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { resetLaterForTest(); vi.useRealTimers(); });

  it("hides at once, shows Undo, and sends when the toast goes", async () => {
    const { job: j, send } = job("Deleted Kitchen.", [laterKey("pages", "p1")]);
    deleteLater(j);
    expect(laterHidden().has(laterKey("pages", "P1"))).toBe(true);
    expect(laterToast()).toEqual({ text: "Deleted Kitchen.", tone: "ok", undo: true });
    vi.advanceTimersByTime(DELETE_LATER_MS - 1);
    expect(send).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(send).toHaveBeenCalledOnce();
    // Still hidden while it is sent, so nothing flashes back.
    expect(laterHidden().size).toBe(1);
    await vi.runAllTimersAsync();
    expect(laterHidden().size).toBe(0);
    expect(laterToast()).toBeUndefined();
  });

  it("sends nothing on Undo, and shows it again", () => {
    const { job: j, send } = job("Deleted Kitchen.", [laterKey("menus", "m1")]);
    deleteLater(j);
    expect(undoLater()).toBe(true);
    expect(laterHidden().size).toBe(0);
    expect(laterToast()).toBeUndefined();
    vi.advanceTimersByTime(DELETE_LATER_MS * 2);
    expect(send).not.toHaveBeenCalled();
    expect(undoLater()).toBe(false);
  });

  it("sends the one waiting when another delete comes, so Undo is the newest", () => {
    const first = job("Deleted A.", [laterKey("pages", "a")]);
    const second = job("Deleted B.", [laterKey("pages", "b")]);
    deleteLater(first.job);
    deleteLater(second.job);
    expect(first.send).toHaveBeenCalledOnce();
    expect(laterToast()?.text).toBe("Deleted B.");
    undoLater();
    expect(second.send).not.toHaveBeenCalled();
    expect(laterHidden().has(laterKey("pages", "a"))).toBe(true);
  });

  it("says why a delete failed, until closed or for a while", async () => {
    deleteLater(job("Deleted A.", [laterKey("complications", "c1", "w1")], "Not deleted. It changed.").job);
    sendLaterNow();
    await vi.advanceTimersByTimeAsync(0);
    expect(laterToast()).toEqual({ text: "Not deleted. It changed.", tone: "err", undo: false });
    expect(laterHidden().size).toBe(0);
    dismissLater();
    expect(laterToast()).toBeUndefined();
    deleteLater(job("Deleted B.", [], "Again.").job);
    sendLaterNow();
    await vi.advanceTimersByTimeAsync(LATER_SAID_MS);
    expect(laterToast()).toBeUndefined();
  });

  it("holds while a pointer is over the toast, and keeps a few seconds after", () => {
    const { job: j, send } = job("Deleted A.", []);
    deleteLater(j);
    vi.advanceTimersByTime(DELETE_LATER_MS - 500);
    holdLater(true);
    vi.advanceTimersByTime(DELETE_LATER_MS * 3);
    expect(send).not.toHaveBeenCalled();
    holdLater(false);
    vi.advanceTimersByTime(2_999);
    expect(send).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(send).toHaveBeenCalledOnce();
    expect(laterWaiting()).toBe(false);
  });
});

describe("the ⌘Z that undoes a delete", () => {
  const key = (over: Partial<KeyboardEvent>, target: object = { tagName: "BODY" }) => ({
    key: "z", metaKey: true, ctrlKey: false, shiftKey: false, altKey: false, composedPath: () => [target as EventTarget], ...over,
  });

  it("is ⌘Z or Ctrl+Z, not Redo", () => {
    expect(undoKeyTakesDelete(key({}))).toBe(true);
    expect(undoKeyTakesDelete(key({ metaKey: false, ctrlKey: true, key: "Z" }))).toBe(true);
    expect(undoKeyTakesDelete(key({ shiftKey: true }))).toBe(false);
    expect(undoKeyTakesDelete(key({ metaKey: false }))).toBe(false);
  });

  it("is left to a text field, where it undoes the typing", () => {
    expect(undoKeyTakesDelete(key({}, { tagName: "INPUT", type: "text" }))).toBe(false);
    expect(undoKeyTakesDelete(key({}, { tagName: "TEXTAREA" }))).toBe(false);
    expect(undoKeyTakesDelete(key({}, { tagName: "DIV", isContentEditable: true }))).toBe(false);
    expect(undoKeyTakesDelete(key({}, { tagName: "INPUT", type: "checkbox" }))).toBe(true);
    expect(undoKeyTakesDelete(key({}, { tagName: "BUTTON" }))).toBe(true);
  });

  it("is the panel's where no editor has the key, and the toast's button says so", () => {
    const source = readFileSync(new URL("../src/panel.ts", import.meta.url), "utf8");
    expect(source).toContain("if (laterWaiting() && undoKeyTakesDelete(e) && swallowsSaveKey(this.route, this.draft !== undefined)) {");
    expect(source).toContain("title=${`Undo (${KEY_MOD}Z)`} @click=${() => undoLater()}>Undo</button>");
  });
});

describe("what a waiting delete hides", () => {
  it("leaves the items out of the library and of every device's picks, but a system page", () => {
    const out = summaryWithout({
      pages: { P1: { item: {}, owners: ["w"] }, P2: { item: {}, owners: ["w"] } },
      status_pages: { S1: { item: {}, owners: ["w"] } },
      menus: { M1: { name: "M", kind: "entity", sections: {}, owners: [] } },
      picks: { w: { pages: [{ id: "p1" }, { id: "P2" }, { id: "p1", page: {} }], status_pages: [{ id: "S1" }] } },
    }, new Set([laterKey("pages", "p1"), laterKey("status_pages", "s1"), laterKey("menus", "m1")]));
    expect(Object.keys(out.pages)).toEqual(["P2"]);
    expect(out.status_pages).toEqual({});
    expect(out.menus).toEqual({});
    expect(out.picks.w).toEqual({ pages: [{ id: "P2" }, { id: "p1", page: {} }], status_pages: [] });
  });

  it("leaves a complication out of every list, its seat still held", () => {
    const source = readFileSync(new URL("../src/panel.ts", import.meta.url), "utf8");
    expect(source).toContain(`if (later.has(laterKey("complications", record.id, ownerId))) continue;`);
    expect(source.indexOf("seats.push(slot);")).toBeLessThan(source.indexOf(`if (later.has(laterKey("complications"`));
  });
});
