// The device side the lists and editors share (`watch-pages/devices.ts`):
// the badge naming the other devices an item is on, a watch that waits for
// its iPhone, the free plan line, and that nothing live imports the link
// modules step 4 of the one library plan removed.

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import type { OwnerSummary } from "../src/ha-api.js";
import { type LinkDevice, type PagesRecordFacts, awaitingMove, freePlanText, joinWords, linkBadgeText, pagesRecordFacts } from "../src/watch-pages/devices.js";

const W1: LinkDevice = { ownerId: "w1", name: "Jesse's Watch", kind: "watch" };
const W2: LinkDevice = { ownerId: "w2", name: "Chen's Watch", kind: "watch" };
const P1: LinkDevice = { ownerId: "p1", name: "Jesse's iPhone", kind: "iphone" };
const DEVICES = [W1, W2, P1];

describe("a watch that waits for its iPhone", () => {
  const owner = (id: string, has_iphone?: boolean): OwnerSummary => ({ owner_watch_id: id, has_iphone } as OwnerSummary);
  const OWNERS = [owner("w1", true), owner("w2", true), owner("w3", false), owner("w4", true)];
  const facts = new Map<string, PagesRecordFacts>([
    ["w1", { held: false, free: false }],
    ["w2", { held: true, free: false }],
    ["w3", { held: false, free: false }],
  ]);

  it("is one whose iPhone may still move its pages, while Home Assistant holds none", () => {
    // w2 holds pages already, w3 has no iPhone to wait for, w4 was not read.
    expect([...awaitingMove(OWNERS, facts)]).toEqual(["w1"]);
  });

  it("reads a record's facts: held from its revision, free only from an explicit false", () => {
    expect(pagesRecordFacts({ revision: 0 })).toEqual({ held: false, free: false });
    expect(pagesRecordFacts({ revision: 3, multiple_pages: null })).toEqual({ held: true, free: false });
    expect(pagesRecordFacts({ revision: 3, multiple_pages: true })).toEqual({ held: true, free: false });
    expect(pagesRecordFacts({ revision: 3, multiple_pages: false })).toEqual({ held: true, free: true });
  });
});

describe("the free plan line", () => {
  it("names the devices that show only their first page", () => {
    expect(freePlanText([])).toBeUndefined();
    expect(freePlanText(["Chen's Watch"])).toBe("On the free plan, Chen's Watch shows only its first page.");
    expect(freePlanText(["Chen's Watch", "Jesse's Watch"])).toBe("On the free plan, Chen's Watch and Jesse's Watch show only their first page.");
  });
});

describe("the badge on a row", () => {
  it("names the one other device, or counts them all", () => {
    expect(linkBadgeText(["w1", "p1"], "w1", DEVICES)).toBe("Also on Jesse's iPhone");
    expect(linkBadgeText(["p1", "w1"], "p1", DEVICES)).toBe("Also on Jesse's Watch");
    expect(linkBadgeText(["w1", "w2", "p1"], "w1", DEVICES)).toBe("On 3 devices");
  });

  it("is none on one device, and counts a device the panel does not list", () => {
    expect(linkBadgeText(["w1"], "w1", DEVICES)).toBeUndefined();
    expect(linkBadgeText(["w1", "gone"], "w1", DEVICES)).toBe("On 2 devices");
  });
});

describe("joining words", () => {
  it("says A, B and C", () => {
    expect(joinWords([])).toBe("");
    expect(joinWords(["A"])).toBe("A");
    expect(joinWords(["A", "B"])).toBe("A and B");
    expect(joinWords(["A", "B", "C"])).toBe("A, B and C");
  });
});

describe("the link code step 4 removed", () => {
  const SRC = join(__dirname, "..", "src");
  const sources = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? sources(path) : path.endsWith(".ts") ? [path] : [];
  });
  const files = sources(SRC).map((path) => ({ path: relative(SRC, path), text: readFileSync(path, "utf8") }));

  it("is gone from the source tree", () => {
    const gone = ["watch-menus/menu-links.ts", "watch-menus/menu-devices.ts", "watch-menus/new-menu.ts", "watch-pages/links.ts", "watch-status-pages/links.ts"];
    for (const path of gone) expect(files.some((f) => f.path === path), path).toBe(false);
  });

  it("is imported by no live module", () => {
    const dead = /from "[./]*(?:watch-menus\/)?(?:menu-links|menu-devices|new-menu)\.js"|from "(?:\.\.\/watch-pages\/|\.\/)links\.js"|watch-status-pages\/links\.js"/;
    const importers = files.filter((f) => !f.path.startsWith("watch-voice/") && dead.test(f.text)).map((f) => f.path);
    expect(importers).toEqual([]);
    // The voice editor's own `./links.js` is the voice link module.
    const voice = files.filter((f) => f.path.startsWith("watch-voice/") && /from "\.\.\/watch-pages\/links\.js"/.test(f.text)).map((f) => f.path);
    expect(voice).toEqual([]);
  });

  it("sends no page, status page, menu or link-all link command", () => {
    for (const f of files) {
      expect(f.text, f.path).not.toContain("watch_pages/link_all");
      expect(f.text, f.path).not.toContain("linkWatchPages");
      expect(f.text, f.path).not.toContain("linkAllWatchPages");
      expect(f.text, f.path).not.toContain("linkWatchMenus");
    }
    // The one link call left is the voice editor's.
    const linkers = files.filter((f) => /\blinkWatchUnits\(hass/.test(f.text)).map((f) => f.path);
    expect(linkers).toEqual(["watch-voice/voice-editor.ts"]);
  });

  it("reads `linkIds` only in the voice code", () => {
    const readers = files.filter((f) => /\blinkIds\b/.test(f.text)).map((f) => f.path).sort();
    expect(readers.every((p) => p.startsWith("watch-voice/") || p === "ha-api.ts"), readers.join(", ")).toBe(true);
  });
});
