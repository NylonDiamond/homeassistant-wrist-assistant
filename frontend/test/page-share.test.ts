// Share page and Paste a page: the text, reading it back, the entities a home
// lacks, and the page made from it.

import { describe, expect, it } from "vitest";

import { newPageDocument, newPageForm, newPageRefusal } from "../src/watch-pages/new-page-sheet.js";
import {
  PAGE_SHARE_KEY,
  autoPicks,
  missingEntities,
  pageEntityIds,
  pageFromShare,
  pageShareFacts,
  pageShareFactsText,
  pageShareFileName,
  pageShareText,
  parsePageShare,
} from "../src/watch-pages/page-share.js";
import type { WatchPage } from "../src/watch-pages/model.js";

const state = (name: string) => ({ state: "on", attributes: { friendly_name: name } });

const AUTHOR = {
  "light.kitchen": state("Kitchen"),
  "sensor.power": state("Power"),
  "lock.front": state("Front door"),
};

const PAGE: WatchPage = {
  id: "AAAA-1",
  name: "Downstairs",
  backgroundImageId: "B6F1C2D0-0000-0000-0000-000000000001",
  items: [
    { id: "T1", entityId: "light.kitchen", gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 4, iconPhotoId: "C0FFEE00-0000-0000-0000-000000000002", icon: "lightbulb" },
    { id: "T2", entityId: "divider.label.light", gridCol: 0, gridRow: 4, colSpan: 12, rowSpan: 2 },
    { id: "T3", entityId: "template.tile", templateSource: "{{ states('sensor.power') }} W, {{ '3.5' }}", gridCol: 6, gridRow: 0, colSpan: 6, rowSpan: 4 },
    { id: "T4", entityId: "lock.front", gridCol: 0, gridRow: 6, colSpan: 6, rowSpan: 4 },
  ],
};

describe("the shared text", () => {
  it("names each entity the page uses once, from tiles and templates, never ids or non-entities", () => {
    expect(pageEntityIds(PAGE, (id) => Object.hasOwn(AUTHOR, id))).toEqual(["light.kitchen", "sensor.power", "lock.front"]);
  });

  it("is the page with its entities' names, and reads back whole", () => {
    const text = pageShareText(PAGE, AUTHOR);
    const json = JSON.parse(text);
    expect(json[PAGE_SHARE_KEY]).toBe(1);
    expect(json.name).toBe("Downstairs");
    expect(json.entities).toEqual({ "light.kitchen": "Kitchen", "lock.front": "Front door", "sensor.power": "Power" });
    expect(json).not.toHaveProperty("states");
    const parsed = parsePageShare(text);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.share.page).toEqual(PAGE);
  });

  it("has a file name from the page's name", () => {
    expect(pageShareFileName(PAGE)).toBe("houselit-page-downstairs.json");
  });
});

describe("reading pasted text", () => {
  it("says what is wrong with text that is not a page", () => {
    expect(parsePageShare("").ok).toBe(false);
    expect(parsePageShare("{ cut").ok).toBe(false);
    expect(parsePageShare('{"hello": 1}').ok).toBe(false);
    expect(parsePageShare(JSON.stringify({ [PAGE_SHARE_KEY]: 99, page: PAGE })).ok).toBe(false);
  });

  it("takes a bare page, or a pages document with one page, and finds its entities by domain", () => {
    const bare = parsePageShare(JSON.stringify(PAGE));
    expect(bare.ok && Object.keys(bare.share.entities)).toEqual(["light.kitchen", "sensor.power", "lock.front"]);
    expect(parsePageShare(JSON.stringify({ schemaVersion: 1, pages: [PAGE] })).ok).toBe(true);
    expect(parsePageShare(JSON.stringify({ schemaVersion: 1, pages: [PAGE, PAGE] })).ok).toBe(false);
  });

  it("refuses a color that carries CSS", () => {
    const bad = { ...PAGE, items: [{ id: "X", entityId: "light.kitchen", color: "red;background:url(https://x.example/a)" }] };
    expect(parsePageShare(JSON.stringify(bad)).ok).toBe(false);
  });
});

describe("pasting on another home", () => {
  const READER = { "light.kitchen": state("Kitchen"), "sensor.energy": state("Energy"), "lock.back": state("Front door"), "lock.shed": state("Shed") };
  const parsed = parsePageShare(pageShareText(PAGE, AUTHOR));
  if (!parsed.ok) throw new Error("fixture");
  const share = parsed.share;

  it("asks only about the entities this home lacks, offering its own of the same domain", () => {
    const missing = missingEntities(share, READER);
    expect(missing.map((m) => m.entityId)).toEqual(["lock.front", "sensor.power"]);
    expect(missing[0]!.choices.map((c) => c.entityId)).toEqual(["lock.back", "lock.shed"]);
  });

  it("picks one of the same name by itself", () => {
    expect(autoPicks(missingEntities(share, READER))).toEqual({ "lock.front": "lock.back" });
  });

  it("says what came, what is missing and that photos stay", () => {
    const facts = pageShareFacts(share, READER);
    expect(facts).toEqual({ name: "Downstairs", tiles: 4, entities: 3, missing: 2, photos: 2 });
    expect(pageShareFactsText(facts)).toContain("2 photos stay behind");
  });

  it("swaps the picks in tiles and templates and drops custom photos", () => {
    const page = pageFromShare(share, { "lock.front": "lock.back", "sensor.power": "sensor.energy" });
    const items = page.items as Record<string, unknown>[];
    expect(items[3]!.entityId).toBe("lock.back");
    expect(items[2]!.templateSource).toBe("{{ states('sensor.energy') }} W, {{ '3.5' }}");
    expect(items[0]!.entityId).toBe("light.kitchen");
    expect(items[0]).not.toHaveProperty("iconPhotoId");
    expect(items[0]!.icon).toBe("lightbulb");
    expect(page).not.toHaveProperty("backgroundImageId");
    expect(page.id).toBe("AAAA-1");
    // The share itself is untouched.
    expect((share.page.items as Record<string, unknown>[])[3]!.entityId).toBe("lock.front");
  });

  it("makes a new page under new ids from New page's Paste a page", () => {
    const form = { ...newPageForm("Downstairs", []), start: "shared" as const, shared: pageShareText(PAGE, AUTHOR), sharedPicks: { "lock.front": "lock.back" } };
    const ctx = { hass: { states: READER } as never, pages: [] };
    expect(newPageRefusal(form, ctx)).toBeUndefined();
    const doc = newPageDocument(form, ctx, "new-id");
    const page = (doc?.pages as WatchPage[])[0]!;
    expect(page.id).toBe("NEW-ID");
    const items = page.items as Record<string, unknown>[];
    expect(items.map((t) => t.id)).not.toContain("T1");
    expect(items[3]!.entityId).toBe("lock.back");
    expect(newPageRefusal({ ...form, shared: "nope" }, ctx)).toBeTypeOf("string");
  });
});
