// "Copy from watch": what one page and all pages carry onto an iPhone, the
// new ids and the links rewritten to them, the checks before anything is
// sent, and the order the phone's records are saved in. The watch's records
// are only ever read.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  type PhoneCopyIO,
  type PhoneCopyRecord,
  copyToPhone,
  phoneCopyNote,
  phoneCopyProblems,
  phoneCopyReach,
  planPhoneCopy,
  withCopiedPages,
  withCopiedRooms,
  withCopiedStatusPages,
} from "../src/phone-copy.js";
import type { WatchConfigPanelKind } from "../src/ha-api.js";
import { checkWatchMenus } from "../src/watch-menus/model.js";
import { checkWatchPages, checkWatchPagesValues } from "../src/watch-pages/merge.js";
import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";
import { checkStatusPages } from "../src/watch-status-pages/model.js";

/** A UUID as the app writes one, numbered. */
const U = (n: number) => `5A17E000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;

const HALL = U(1), YARD = U(2), PEEK = U(3), OTHER = U(4), SYS = U(5), GONE = U(6);
const S_ONE = U(11), S_TWO = U(12), S_THREE = U(13), S_GONE = U(14);

const tile = (id: number, entityId: string) => ({ id: U(100 + id), entityId, gridCol: 0, gridRow: id * 3, colSpan: 6, rowSpan: 3 });

/** Hall opens Yard, peeks at Peek, opens the status page One and points at
 * a page and a status page the watch no longer has. Yard opens Hall again
 * (a loop) and status page Two. Other opens Hall and status page Three, and
 * nothing opens Other. A system page is never copied. */
const WATCH_PAGES: WatchPagesDocument = {
  schemaVersion: 1,
  pages: [
    { id: HALL, name: "Hall", items: [tile(1, "light.hall"), tile(2, `page.${YARD}`), tile(3, `show_page.${PEEK}`), tile(4, `status_page.${S_ONE}`), tile(5, `page.${GONE}`), tile(6, `status_page.${S_GONE}`)] },
    { id: YARD, name: "Yard", items: [tile(1, `page.${HALL.toLowerCase()}`), tile(2, `status_page.${S_TWO}`)] },
    { id: PEEK, name: "Peek", isHidden: true, items: [tile(1, "switch.fan")] },
    { id: OTHER, name: "Other", items: [tile(1, `page.${HALL}`), tile(2, `status_page.${S_THREE}`)] },
    { id: SYS, name: "System", isSystemPage: true, items: [] },
  ],
};

const statusPage = (id: string, name: string) => ({ id, name, rows: [{ id: U(200), rowType: "entity", entityId: "sensor.t", displayName: "", domain: "sensor", iconName: "" }] });
const WATCH_STATUS: JsonObject = { schemaVersion: 1, statusPages: [statusPage(S_ONE, "One"), statusPage(S_TWO, "Two"), statusPage(S_THREE, "Three")] };

const slot = (id: number, action: JsonObject) => ({ id: U(300 + id), action, icon: "star", color: "#FFFFFF", isVisible: true, position: "topCenter" });
const WATCH_MENUS: JsonObject = {
  quickAction: { slots: [slot(1, { type: "navigateToPage", pageId: YARD }), slot(2, { type: "showStatusPage", pageId: S_ONE }), slot(3, { type: "navigateToPage", pageId: GONE })] },
  entityRadial: {
    lightSlots: [slot(4, { type: "navigateToPage", pageId: OTHER })],
    entityOverrides: { "light.hall": [slot(5, { type: "showStatusPage", pageId: S_THREE.toLowerCase() })] },
  },
  pageSwitcher: {},
  schemaVersion: 1,
};

/** The watch's behavior on its main house: three room keys, and a setting
 * that is no room key at all. */
const WATCH_BEHAVIOR: JsonObject = {
  roomQuickJumpFallbackPageId: HALL,
  roomQuickJumpMappings: { kitchen: YARD, den: GONE },
  roomQuickJumpSourceEntityId: "sensor.room",
  longPressDuration: 0.5,
};

/** New ids, numbered from `from`, in a range no fixture uses. */
function ids(from = 1): () => string {
  let n = from;
  return () => `C0FFEE00-0000-4000-8000-${(n++).toString(16).padStart(12, "0")}`;
}

const WATCH_IDS = [HALL, YARD, PEEK, OTHER, SYS, GONE, S_ONE, S_TWO, S_THREE, S_GONE];

const entityIds = (document: WatchPagesDocument | undefined, name: string): string[] =>
  ((document?.pages as JsonObject[]).find((p) => p.name === name)!.items as JsonObject[]).map((t) => t.entityId as string);

describe("what one page reaches", () => {
  it("is the page, every page its links open in turn, and the status pages any of them opens", () => {
    expect(phoneCopyReach(WATCH_PAGES, HALL)).toEqual({ pageIds: [HALL, YARD, PEEK], statusPageIds: [S_ONE, S_GONE, S_TWO] });
  });

  it("follows no link back up: a page nothing reached stays out", () => {
    expect(phoneCopyReach(WATCH_PAGES, PEEK)).toEqual({ pageIds: [PEEK], statusPageIds: [] });
    expect(phoneCopyReach(WATCH_PAGES, OTHER).pageIds).toEqual([HALL, YARD, PEEK, OTHER]);
  });

  it("is nothing for a page the watch does not list", () => {
    expect(phoneCopyReach(WATCH_PAGES, SYS)).toEqual({ pageIds: [], statusPageIds: [] });
    expect(phoneCopyReach(WATCH_PAGES, GONE)).toEqual({ pageIds: [], statusPageIds: [] });
  });
});

describe("one page", () => {
  const plan = planPhoneCopy({ pages: WATCH_PAGES, statusPages: WATCH_STATUS }, { pages: undefined, statusPages: undefined }, { kind: "page", pageId: HALL.toLowerCase() }, ids())!;

  it("copies the page and its linked pages, in the watch's order, and the status pages they open that the watch has", () => {
    expect(plan.pages.map((p) => p.name)).toEqual(["Hall", "Yard", "Peek"]);
    expect(plan.statusPages.map((p) => p.name)).toEqual(["One", "Two"]);
    expect(plan.menus).toBeUndefined();
    expect(plan.rooms).toBeUndefined();
  });

  it("gives every copy a new id, never one the watch uses", () => {
    const copied = [...plan.pages.map((p) => p.id), ...plan.statusPages.map((p) => p.id)] as string[];
    expect(new Set(copied).size).toBe(5);
    for (const id of copied) expect(WATCH_IDS).not.toContain(id);
    expect(plan.pageIds.get(HALL)).toBe(plan.pages[0]!.id);
    expect(plan.statusPageIds.get(S_ONE)).toBe(plan.statusPages[0]!.id);
  });

  it("points every link inside the copy at the copies, and leaves a link to what was not copied as it was", () => {
    const doc = withCopiedPages(undefined, plan);
    const p = (id: string) => plan.pageIds.get(id)!;
    const s = (id: string) => plan.statusPageIds.get(id)!;
    expect(entityIds(doc, "Hall")).toEqual(["light.hall", `page.${p(YARD)}`, `show_page.${p(PEEK)}`, `status_page.${s(S_ONE)}`, `page.${GONE}`, `status_page.${S_GONE}`]);
    expect(entityIds(doc, "Yard")).toEqual([`page.${p(HALL)}`, `status_page.${s(S_TWO)}`]);
  });

  it("leaves the watch's documents exactly as they were", () => {
    expect(WATCH_PAGES.pages as JsonObject[]).toHaveLength(5);
    expect(entityIds(WATCH_PAGES, "Hall")[1]).toBe(`page.${YARD}`);
    expect((WATCH_PAGES.pages as JsonObject[])[0]!.id).toBe(HALL);
  });

  it("is nothing for a page the watch does not list", () => {
    expect(planPhoneCopy({ pages: WATCH_PAGES, statusPages: WATCH_STATUS }, { pages: undefined, statusPages: undefined }, { kind: "page", pageId: GONE })).toBeUndefined();
  });
});

describe("all pages", () => {
  const plan = planPhoneCopy(
    { pages: WATCH_PAGES, statusPages: WATCH_STATUS, menus: WATCH_MENUS, rooms: WATCH_BEHAVIOR },
    { pages: undefined, statusPages: undefined },
    { kind: "all" },
    ids(),
  )!;

  it("copies every listed page and every status page, never a system page", () => {
    expect(plan.pages.map((p) => p.name)).toEqual(["Hall", "Yard", "Peek", "Other"]);
    expect(plan.statusPages.map((p) => p.name)).toEqual(["One", "Two", "Three"]);
  });

  it("points every menu slot that opens a copied page or status page at the copy, in every list", () => {
    const menus = plan.menus!;
    const qa = (menus.quickAction as { slots: JsonObject[] }).slots.map((s) => s.action);
    expect(qa).toEqual([
      { type: "navigateToPage", pageId: plan.pageIds.get(YARD) },
      { type: "showStatusPage", pageId: plan.statusPageIds.get(S_ONE) },
      { type: "navigateToPage", pageId: GONE },
    ]);
    const radial = menus.entityRadial as { lightSlots: JsonObject[]; entityOverrides: Record<string, JsonObject[]> };
    expect(radial.lightSlots[0]!.action).toEqual({ type: "navigateToPage", pageId: plan.pageIds.get(OTHER) });
    expect(radial.entityOverrides["light.hall"]![0]!.action).toEqual({ type: "showStatusPage", pageId: plan.statusPageIds.get(S_THREE) });
    // A slot keeps its id: the app's default slots have fixed ones.
    expect((menus.quickAction as { slots: JsonObject[] }).slots[0]!.id).toBe(U(301));
    expect(checkWatchMenus(menus)).toEqual([]);
    // The watch's own menus are untouched.
    expect((WATCH_MENUS.quickAction as { slots: JsonObject[] }).slots[0]!.action).toEqual({ type: "navigateToPage", pageId: YARD });
  });

  it("carries the room keys alone, their pages pointed at the copies, into the phone's rooms record", () => {
    expect(plan.rooms).toEqual({
      roomQuickJumpFallbackPageId: plan.pageIds.get(HALL),
      roomQuickJumpMappings: { kitchen: plan.pageIds.get(YARD), den: GONE },
      roomQuickJumpSourceEntityId: "sensor.room",
    });
    expect(withCopiedRooms(undefined, plan.rooms!)).toEqual({ schemaVersion: 1, ...plan.rooms });
    // The phone's own room keys go; what is no room key stays.
    expect(withCopiedRooms({ schemaVersion: 1, roomAutoSwitchEnabled: true, roomQuickJumpFallbackPageId: "__stay__" }, plan.rooms!))
      .toEqual({ schemaVersion: 1, ...plan.rooms });
  });

  it("copies no menus and no rooms the watch does not have", () => {
    const bare = planPhoneCopy({ pages: WATCH_PAGES, statusPages: undefined }, { pages: undefined, statusPages: undefined }, { kind: "all" }, ids())!;
    expect(bare.statusPages).toEqual([]);
    expect(bare.menus).toBeUndefined();
    expect(bare.rooms).toBeUndefined();
    expect(planPhoneCopy({ pages: WATCH_PAGES, statusPages: undefined, rooms: { longPressDuration: 1 } }, { pages: undefined, statusPages: undefined }, { kind: "all" }, ids())!.rooms).toBeUndefined();
  });

  it("is nothing from a watch with no pages", () => {
    expect(planPhoneCopy({ pages: undefined, statusPages: WATCH_STATUS }, { pages: undefined, statusPages: undefined }, { kind: "all" })).toBeUndefined();
    expect(planPhoneCopy({ pages: { schemaVersion: 1, pages: [(WATCH_PAGES.pages as JsonObject[])[4]] } as WatchPagesDocument, statusPages: undefined }, { pages: undefined, statusPages: undefined }, { kind: "all" })).toBeUndefined();
  });

  it("copies a real watch's pages, status pages and menus into records every check takes, sharing no id with the watch", () => {
    const read = (path: string) => JSON.parse(readFileSync(join(__dirname, path), "utf8")) as JsonObject;
    const pages = read("fixtures-pages/02-virtual-tiles.json");
    const status = read("fixtures-status-pages/02-configured.json");
    const menus = read("fixtures-menus/02-configured.json");
    const real = planPhoneCopy({ pages, statusPages: status, menus }, { pages: undefined, statusPages: undefined }, { kind: "all" })!;
    const doc = withCopiedPages(undefined, real);
    expect(checkWatchPages(doc)).toEqual([]);
    expect(checkWatchPagesValues(doc)).toEqual([]);
    expect(checkStatusPages(withCopiedStatusPages(undefined, real))).toEqual([]);
    expect(checkWatchMenus(real.menus)).toEqual([]);
    const watchIds = [...(pages.pages as JsonObject[]), ...(status.statusPages as JsonObject[])].map((p) => (p.id as string).toUpperCase());
    const text = JSON.stringify([doc, real.statusPages, real.menus]).toUpperCase();
    for (const id of watchIds) expect(text).not.toContain(id);
  });
});

describe("ids the phone already has", () => {
  it("are never given out, nor the watch's, nor one this copy already gave", () => {
    const phonePage = "C0FFEE00-0000-4000-8000-000000000001";
    const phoneStatus = "C0FFEE00-0000-4000-8000-000000000002";
    const phone = { pages: { schemaVersion: 1, pages: [{ id: phonePage, name: "Mine", items: [] }] }, statusPages: { schemaVersion: 1, statusPages: [statusPage(phoneStatus, "Mine")] } };
    // The id maker hands out the phone's ids, a watch id and a repeat
    // first, in any case.
    const queue = [phonePage.toLowerCase(), phoneStatus, HALL, "C0FFEE00-0000-4000-8000-000000000003", "c0ffee00-0000-4000-8000-000000000003"];
    const next = ids(4);
    const plan = planPhoneCopy({ pages: WATCH_PAGES, statusPages: WATCH_STATUS }, phone, { kind: "page", pageId: HALL }, () => queue.shift() ?? next())!;
    const given = [...plan.pageIds.values(), ...plan.statusPageIds.values()];
    expect(given[0]).toBe("C0FFEE00-0000-4000-8000-000000000003");
    expect(new Set(given).size).toBe(given.length);
    for (const id of given) expect([phonePage, phoneStatus, ...WATCH_IDS]).not.toContain(id);
  });

  it("stay where they are: the copies come after the phone's own pages and status pages", () => {
    const mine = { id: "C0FFEE00-0000-4000-8000-0000000000AA", name: "Mine", items: [] };
    const plan = planPhoneCopy({ pages: WATCH_PAGES, statusPages: WATCH_STATUS }, { pages: undefined, statusPages: undefined }, { kind: "page", pageId: PEEK }, ids())!;
    const doc = withCopiedPages({ schemaVersion: 1, pages: [mine], extra: true }, plan);
    expect(doc).toMatchObject({ schemaVersion: 1, extra: true });
    expect((doc.pages as JsonObject[]).map((p) => p.name)).toEqual(["Mine", "Peek"]);
    const status = withCopiedStatusPages({ schemaVersion: 1, statusPages: [statusPage(U(50), "Mine")] }, { ...plan, statusPages: [statusPage(U(51), "Copy")] });
    expect((status.statusPages as JsonObject[]).map((p) => p.name)).toEqual(["Mine", "Copy"]);
  });
});

describe("the checks", () => {
  it("are each editor's own, then the size Home Assistant keeps", () => {
    expect(phoneCopyProblems("pages", { pages: [{ name: "No id", items: [] }] })).toEqual(['Page 1 ("No id") has no id.']);
    expect(phoneCopyProblems("status_pages", { statusPages: "no" })).toEqual(["The status page list is missing."]);
    expect(phoneCopyProblems("menus", {})[0]).toMatch(/missing/);
    const big = { schemaVersion: 1, pages: [{ id: U(1), name: "x".repeat(720 * 1024), items: [] }] };
    expect(phoneCopyProblems("pages", big)).toEqual(["With the copy the iPhone's pages would be 721 KB, more than the 700 KB Home Assistant keeps."]);
    expect(phoneCopyProblems("rooms", { schemaVersion: 1, roomQuickJumpSourceEntityId: "x".repeat(65 * 1024) })[0]).toMatch(/rooms would be 66 KB, more than the 64 KB/);
    expect(phoneCopyProblems("pages", withCopiedPages(undefined, planPhoneCopy({ pages: WATCH_PAGES, statusPages: undefined }, { pages: undefined, statusPages: undefined }, { kind: "all" })!))).toEqual([]);
  });
});

// ── the copy, end to end ───────────────────────────────────────────────

/** Home Assistant's records by owner and kind, and every call made. */
function store(records: Record<string, Partial<Record<WatchConfigPanelKind, JsonObject>>>, conflicts: Partial<Record<string, number>> = {}) {
  const held = new Map<string, PhoneCopyRecord>();
  for (const [owner, kinds] of Object.entries(records)) {
    for (const [kind, document] of Object.entries(kinds)) held.set(`${owner}/${kind}`, { revision: 4, document });
  }
  const reads: string[] = [];
  const writes: { owner: string; kind: string; base: number; document: JsonObject }[] = [];
  const write = (owner: string, kind: string, base: number, document: JsonObject) => {
    const at = `${owner}/${kind}`;
    const now = held.get(at) ?? { revision: 0, document: null };
    if ((conflicts[kind] ?? 0) > 0) {
      conflicts[kind]!--;
      // Someone saved meanwhile.
      held.set(at, { revision: now.revision + 1, document: now.document });
      return Promise.reject({ code: "conflict", message: `stored revision is ${now.revision + 1}` });
    }
    if (base !== now.revision) return Promise.reject({ code: "conflict", message: `stored revision is ${now.revision}` });
    writes.push({ owner, kind, base, document });
    held.set(at, { revision: now.revision + 1, document });
    return Promise.resolve({ revision: now.revision + 1 });
  };
  const io = (phone: string, pagesResult?: { ok: boolean; code?: string; message?: string }): PhoneCopyIO => ({
    read: (owner, kind) => {
      reads.push(`${owner}/${kind}`);
      return Promise.resolve(structuredClone(held.get(`${owner}/${kind}`) ?? { revision: 0, document: null }));
    },
    savePhone: (kind, base, document) => write(phone, kind, base, document),
    savePages: (document) => pagesResult !== undefined
      ? Promise.resolve(pagesResult)
      : write(phone, "pages", held.get(`${phone}/pages`)?.revision ?? 0, document).then(() => ({ ok: true })),
  });
  return { held, reads, writes, io };
}

describe("the copy", () => {
  const WATCH = { pages: WATCH_PAGES as JsonObject, status_pages: WATCH_STATUS, menus: WATCH_MENUS, behavior: WATCH_BEHAVIOR };

  it("saves the phone's status pages, pages, menus and rooms, in that order, and writes nothing of the watch's", async () => {
    const s = store({ w1: WATCH });
    const result = await copyToPhone(s.io("p1"), { watch: "w1", watchRooms: "behavior", phone: "p1", scope: { kind: "all" }, phonePages: undefined, newId: ids() });
    expect(result).toMatchObject({ ok: true, pages: 4, statusPages: 3, saved: ["status_pages", "pages", "menus", "rooms"] });
    expect(s.writes.map((w) => `${w.owner}/${w.kind}`)).toEqual(["p1/status_pages", "p1/pages", "p1/menus", "p1/rooms"]);
    expect(s.writes.every((w) => w.base === 0)).toBe(true);
    for (const kind of ["pages", "status_pages", "menus", "behavior"]) expect(s.held.get(`w1/${kind}`)).toEqual({ revision: 4, document: WATCH[kind as keyof typeof WATCH] });
    // The watch's rooms were read where it keeps them, and never `behavior`
    // of the phone.
    expect(s.reads).toContain("w1/behavior");
    expect(s.reads).not.toContain("p1/behavior");
    expect(result.ok && result.firstPageId).toBe((s.writes[1]!.document.pages as JsonObject[])[0]!.id);
  });

  it("for one page saves only its pages and status pages, and reads no menus or rooms", async () => {
    const s = store({ w1: WATCH });
    const result = await copyToPhone(s.io("p1"), { watch: "w1", watchRooms: "rooms", phone: "p1", scope: { kind: "page", pageId: YARD }, phonePages: undefined, newId: ids() });
    expect(result).toMatchObject({ ok: true, pages: 3, statusPages: 2, saved: ["status_pages", "pages"] });
    expect(s.reads.filter((r) => /menus|rooms|behavior/.test(r))).toEqual([]);
    expect((s.writes[1]!.document.pages as JsonObject[]).map((p) => p.name)).toEqual(["Hall", "Yard", "Peek"]);
  });

  it("saves no status pages when the page opens none", async () => {
    const s = store({ w1: WATCH });
    const result = await copyToPhone(s.io("p1"), { watch: "w1", watchRooms: "rooms", phone: "p1", scope: { kind: "page", pageId: PEEK }, phonePages: undefined, newId: ids() });
    expect(result).toMatchObject({ ok: true, pages: 1, statusPages: 0, saved: ["pages"] });
  });

  it("adds to the phone's own records over their revisions", async () => {
    const mine = { schemaVersion: 1, statusPages: [statusPage(U(60), "Mine")] };
    const s = store({ w1: WATCH, p1: { status_pages: mine } });
    await copyToPhone(s.io("p1"), { watch: "w1", watchRooms: "behavior", phone: "p1", scope: { kind: "page", pageId: HALL }, phonePages: undefined, newId: ids() });
    expect(s.writes[0]).toMatchObject({ owner: "p1", kind: "status_pages", base: 4 });
    expect((s.writes[0]!.document.statusPages as JsonObject[]).map((p) => p.name)).toEqual(["Mine", "One", "Two"]);
  });

  it("reads the phone's record again on a conflict and adds the copies to the newer one", async () => {
    const mine = { schemaVersion: 1, statusPages: [statusPage(U(60), "Mine")] };
    const s = store({ w1: WATCH, p1: { status_pages: mine } }, { status_pages: 1 });
    const result = await copyToPhone(s.io("p1"), { watch: "w1", watchRooms: "behavior", phone: "p1", scope: { kind: "page", pageId: HALL }, phonePages: undefined, newId: ids() });
    expect(result.ok).toBe(true);
    expect(s.writes[0]).toMatchObject({ kind: "status_pages", base: 5 });
  });

  it("sends nothing when a record it would save fails its check", async () => {
    const huge = { schemaVersion: 1, pages: [{ id: U(70), name: "x".repeat(700 * 1024), items: [] }] };
    const s = store({ w1: WATCH });
    const result = await copyToPhone(s.io("p1"), { watch: "w1", watchRooms: "behavior", phone: "p1", scope: { kind: "all" }, phonePages: huge, newId: ids() });
    expect(result).toMatchObject({ ok: false, code: "invalid", stage: "pages", saved: [] });
    expect(s.writes).toEqual([]);
  });

  it("stops where a save fails and says what was saved before it", async () => {
    const s = store({ w1: WATCH });
    const result = await copyToPhone(s.io("p1", { ok: false, code: "unavailable", message: "Home Assistant is restarting" }), {
      watch: "w1", watchRooms: "behavior", phone: "p1", scope: { kind: "all" }, phonePages: undefined, newId: ids(),
    });
    expect(result).toEqual({ ok: false, code: "unavailable", message: "Home Assistant is restarting", stage: "pages", saved: ["status_pages"] });
    expect(s.writes.map((w) => w.kind)).toEqual(["status_pages"]);
    expect(phoneCopyNote(result, "Jesse's Watch")).toEqual({ kind: "warn", text: "Copied the status pages, then stopped: Home Assistant is restarting" });
  });

  it("says plainly that a watch with no pages has nothing to copy", async () => {
    const s = store({ w1: { status_pages: WATCH_STATUS } });
    const result = await copyToPhone(s.io("p1"), { watch: "w1", watchRooms: "behavior", phone: "p1", scope: { kind: "all" }, phonePages: undefined });
    expect(result).toEqual({ ok: false, code: "nothing", message: "The watch has no pages to copy.", saved: [] });
    expect(s.writes).toEqual([]);
    expect(phoneCopyNote(result, "W").text).toBe("Nothing copied. The watch has no pages to copy.");
  });
});

describe("the note after a copy", () => {
  it("names what was copied and from which watch", () => {
    expect(phoneCopyNote({ ok: true, pages: 4, statusPages: 3, saved: ["status_pages", "pages", "menus", "rooms"], firstPageId: HALL }, "Jesse's Watch").text)
      .toBe("Copied 4 pages, 3 status pages, the menus and the rooms from Jesse's Watch. The iPhone picks them up the next time it checks. Undo takes the pages back.");
    expect(phoneCopyNote({ ok: true, pages: 1, statusPages: 0, saved: ["pages"], firstPageId: HALL }, "W").text)
      .toBe("Copied 1 page from W. The iPhone picks them up the next time it checks. Undo takes the pages back.");
    expect(phoneCopyNote({ ok: false, code: "invalid", message: "Too big.", saved: [] }, "W")).toEqual({ kind: "err", text: "Not copied: Too big." });
  });

  it("never uses a dash to break a sentence", () => {
    const texts = [
      phoneCopyNote({ ok: true, pages: 2, statusPages: 1, saved: ["status_pages", "pages"], firstPageId: HALL }, "W").text,
      phoneCopyNote({ ok: false, code: "x", message: "m", saved: ["status_pages", "pages", "menus"] }, "W").text,
    ];
    for (const text of texts) expect(text).not.toMatch(/ - |–|—/);
  });
});
