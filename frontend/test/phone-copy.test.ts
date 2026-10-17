// "Add all watch pages": one `watch_pages/link_all` puts a watch's pages and
// status pages on an iPhone, linked, and copies its menus and rooms where
// the phone has none. The panel says what was added, counts the copied
// menus' Speak Phrase slots, and counts the pages for its question.

import { describe, expect, it } from "vitest";

import {
  type PhoneAddIO,
  type PhoneAddResult,
  addWatchPagesToPhone,
  phoneAddNote,
  speakPhraseSlotCount,
  watchPagesToAdd,
} from "../src/phone-copy.js";
import type { WatchPagesLinkAllReply } from "../src/ha-api.js";
import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";

/** A UUID as the app writes one, numbered. */
const U = (n: number) => `5A17E000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;

const HALL = U(1), YARD = U(2), SYS = U(5), S_ONE = U(11);

const WATCH_PAGES: WatchPagesDocument = {
  schemaVersion: 1,
  pages: [
    { id: HALL, name: "Hall", items: [] },
    { id: YARD, name: "Yard", items: [] },
    { id: SYS, name: "System", isSystemPage: true, items: [] },
  ],
};

const slot = (id: number, action: JsonObject) => ({ id: U(300 + id), action, icon: "star", color: "#FFFFFF", isVisible: true, position: "topCenter" });
const WATCH_MENUS: JsonObject = {
  quickAction: { slots: [slot(1, { type: "navigateToPage", pageId: YARD })] },
  entityRadial: {},
  pageSwitcher: {},
  schemaVersion: 1,
};
const SPEAKING: JsonObject = {
  ...WATCH_MENUS,
  quickAction: { slots: [slot(6, { type: "speakPhrase", phraseId: U(80) })] },
  entityRadial: { entityOverrides: { "light.hall": [slot(7, { type: "speakPhrase", phraseId: U(80) }), slot(8, { type: "ttsMenu" })] } },
};

/** The calls an add makes, answered with `reply` (or refused with it when
 * `fails`), and the watch's menus for the read. */
function io(reply: WatchPagesLinkAllReply | { fails: unknown }, menus?: JsonObject) {
  const calls: string[] = [];
  const out: PhoneAddIO = {
    linkAll: async (source, target) => {
      calls.push(`link_all ${source} ${target}`);
      if ("fails" in reply) throw reply.fails;
      return reply;
    },
    read: async (owner, kind) => {
      calls.push(`get ${owner}/${kind}`);
      return menus === undefined ? { revision: 0, document: null } : { revision: 2, document: menus };
    },
  };
  return { io: out, calls };
}

describe("the pages the question counts", () => {
  it("are every page the watch lists, in its order, never a system page", () => {
    expect(watchPagesToAdd(WATCH_PAGES, undefined)).toEqual([HALL, YARD]);
  });

  it("leave out a page whose id the phone holds already, whatever its case", () => {
    const phone: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: YARD.toLowerCase(), name: "Yard", items: [] }] };
    expect(watchPagesToAdd(WATCH_PAGES, phone)).toEqual([HALL]);
  });

  it("are none from a watch with no pages", () => {
    expect(watchPagesToAdd(undefined, undefined)).toEqual([]);
  });
});

describe("adding all watch pages", () => {
  it("is one link_all from the watch to the phone, and says what it added and copied", async () => {
    const s = io({ pages: [HALL, YARD], status_pages: [S_ONE], copied: ["menus", "rooms"] }, WATCH_MENUS);
    const result = await addWatchPagesToPhone(s.io, { watch: "w1", phone: "p1" });
    expect(s.calls).toEqual(["link_all w1 p1", "get w1/menus"]);
    expect(result).toEqual({ ok: true, pages: 2, statusPages: 1, saved: ["pages", "menus", "rooms"], firstPageId: HALL });
  });

  it("counts the phone's own starter status pages it linked, apart from those added", async () => {
    const s = io({ pages: [HALL], status_pages: [S_ONE], adopted_status_pages: [U(20), U(21)], copied: [] });
    expect(await addWatchPagesToPhone(s.io, { watch: "w1", phone: "p1" }))
      .toEqual({ ok: true, pages: 1, statusPages: 1, adoptedStatusPages: 2, saved: ["pages"], firstPageId: HALL });
  });

  it("is not nothing when it only linked the phone's own starter status pages", async () => {
    const s = io({ pages: [], status_pages: [], adopted_status_pages: [U(20)], copied: [] });
    expect(await addWatchPagesToPhone(s.io, { watch: "w1", phone: "p1" }))
      .toEqual({ ok: true, pages: 0, statusPages: 0, adoptedStatusPages: 1, saved: ["pages"] });
  });

  it("reads no menus when none were copied", async () => {
    const s = io({ pages: [YARD], status_pages: [], copied: [] }, SPEAKING);
    const result = await addWatchPagesToPhone(s.io, { watch: "w1", phone: "p1" });
    expect(s.calls).toEqual(["link_all w1 p1"]);
    expect(result).toEqual({ ok: true, pages: 1, statusPages: 0, saved: ["pages"], firstPageId: YARD });
  });

  it("counts the copied menus' Speak Phrase slots", async () => {
    const s = io({ pages: [HALL], status_pages: [], copied: ["menus"] }, SPEAKING);
    expect(await addWatchPagesToPhone(s.io, { watch: "w1", phone: "p1" })).toMatchObject({ ok: true, speakPhraseSlots: 2 });
  });

  it("says plainly when there was nothing to add", async () => {
    const s = io({ pages: [], status_pages: [], copied: [] });
    expect(await addWatchPagesToPhone(s.io, { watch: "w1", phone: "p1" }))
      .toEqual({ ok: false, code: "nothing", message: "The iPhone has every page of this watch already.", saved: [] });
  });

  it("says a refusal in the editor's words", async () => {
    const s = io({ fails: { code: "unknown_command", message: "Unknown command." } });
    const result = await addWatchPagesToPhone(s.io, { watch: "w1", phone: "p1" });
    expect(result).toMatchObject({ ok: false, code: "unknown_command", saved: [] });
    expect((result as { message: string }).message).toMatch(/Update it first\./);
  });

  it("reads a reply with missing lists as an empty one", async () => {
    const s = io({} as WatchPagesLinkAllReply);
    expect(await addWatchPagesToPhone(s.io, { watch: "w1", phone: "p1" })).toMatchObject({ ok: false, code: "nothing" });
  });
});

describe("Speak Phrase slots", () => {
  it("are counted in every list, and only Speak Phrase", () => {
    expect(speakPhraseSlotCount(WATCH_MENUS)).toBe(0);
    expect(speakPhraseSlotCount(SPEAKING)).toBe(2);
  });
});

describe("the note after an add", () => {
  const ok = (r: Partial<Extract<PhoneAddResult, { ok: true }>>): PhoneAddResult => ({ ok: true, pages: 0, statusPages: 0, saved: [], ...r });

  it("names what was added and from which watch, and that it stays linked", () => {
    expect(phoneAddNote(ok({ pages: 4, statusPages: 3, saved: ["pages", "menus", "rooms"] }), "Jesse's Watch").text)
      .toBe("Added 4 pages, 3 status pages, the menus and the rooms from Jesse's Watch. They stay linked: an edit on one device shows on both.");
    expect(phoneAddNote(ok({ saved: ["menus"] }), "W").text).toBe("Added the menus from W.");
    expect(phoneAddNote({ ok: false, code: "unknown", message: "Gone.", saved: [] }, "W")).toEqual({ kind: "err", text: "Not added: Gone." });
    expect(phoneAddNote({ ok: false, code: "nothing", message: "The iPhone has every page of this watch already.", saved: [] }, "W"))
      .toEqual({ kind: "warn", text: "Nothing added. The iPhone has every page of this watch already." });
  });

  it("says the phone's own starter status pages were linked and now match", () => {
    expect(phoneAddNote(ok({ pages: 2, adoptedStatusPages: 5, saved: ["pages"] }), "W").text)
      .toBe("Added 2 pages from W. Also linked the iPhone's own copies of 5 status pages, which now match the watch. They stay linked: an edit on one device shows on both.");
    expect(phoneAddNote(ok({ adoptedStatusPages: 1, saved: ["pages"] }), "W").text)
      .toBe("Linked the iPhone's own copy of 1 status page with W. It now matches the watch. They stay linked: an edit on one device shows on both.");
  });

  it("says when a copied Speak Phrase slot will not work on the iPhone", () => {
    expect(phoneAddNote(ok({ pages: 2, saved: ["pages", "menus"], speakPhraseSlots: 1 }), "W").text)
      .toBe("Added 2 pages and the menus from W. They stay linked: an edit on one device shows on both. 1 Speak Phrase slot in the menus will not work on the iPhone, which has no voice phrases.");
  });

  it("never uses a dash to break a sentence", () => {
    const texts = [
      phoneAddNote(ok({ pages: 2, statusPages: 1, saved: ["pages"] }), "W").text,
      phoneAddNote({ ok: false, code: "x", message: "m", saved: [] }, "W").text,
      phoneAddNote(ok({ pages: 2, saved: ["pages", "menus"], speakPhraseSlots: 3 }), "W").text,
      phoneAddNote(ok({ adoptedStatusPages: 3, saved: ["pages"] }), "W").text,
    ];
    for (const text of texts) expect(text).not.toMatch(/ - |–|—/);
  });
});
