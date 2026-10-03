// The shared menus fixtures: documents written by the phone, the merge cases,
// and documents written by the panel.
//
// `fixtures-menus` is a copy of the app repo's `WristAssistantTests/Fixtures/
// menus` (canonical), kept in step by `scripts/sync-complication-fixtures.sh`.
// The files directly in the folder are the phone's documents: each must open
// and save back with no edit as the very same bytes. `merge/` holds the
// three-way cases at the grain of the three top-level keys (`phone` is the
// local side, which in the panel is the draft). `panel/` holds what the
// panel's own edits write, one file per section, built here from the model's
// setters; the app decodes them through `ConfigMigrator`. Rebuild them with
// `WA_UPDATE_FIXTURES=1 npx vitest run test/watch-menus-fixtures.test.ts`.

import { describe, expect, it } from "vitest";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { JsonObject } from "../src/watch-pages/model.js";
import { WatchMenusDraft } from "../src/watch-menus/draft.js";
import { mergeWatchMenus } from "../src/watch-menus/merge.js";
import {
  MENU_KEYS,
  type MenuTargets,
  type MenusDocument,
  addWatchMenuOverride,
  addWatchMenuSlot,
  asWatchMenusDocument,
  checkWatchMenus,
  moveWatchMenuSlot,
  removeWatchMenuOverride,
  removeWatchMenuSlot,
  setWatchMenuActionKey,
  setWatchMenuInherits,
  setWatchMenuSlotAction,
  setWatchMenuSlotColor,
  setWatchMenuSlotEntityTypes,
  setWatchMenuSlotIcon,
  setWatchMenuSlotVisible,
  setWatchMenuStyle,
  watchMenusSize,
} from "../src/watch-menus/model.js";

const dir = join(__dirname, "fixtures-menus");
const documentFiles = existsSync(dir)
  ? readdirSync(dir, { withFileTypes: true }).filter((e) => e.isFile() && e.name.endsWith(".json")).map((e) => e.name).sort()
  : [];

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as object)) deepFreeze(child);
  }
  return value;
}

function read(name: string): { text: string; doc: MenusDocument } {
  const text = readFileSync(join(dir, name), "utf8");
  return { text, doc: JSON.parse(text) as MenusDocument };
}

describe("phone-written menus", () => {
  it("are there: the defaults, a configured one and a right-wrist mirror", () => {
    expect(documentFiles).toEqual(expect.arrayContaining(["01-defaults.json", "02-configured.json", "03-right-wrist.json"]));
  });

  for (const file of documentFiles) {
    describe(file, () => {
      it("saves back as the same bytes with no edit", () => {
        const { text, doc } = read(file);
        const draft = new WatchMenusDraft(asWatchMenusDocument(doc)!, 3);
        expect(draft.dirty).toBe(false);
        expect(draft.document).toBe(doc);
        expect(JSON.stringify(draft.document)).toBe(text.trimEnd());
        expect(watchMenusSize(draft.document)).toBe(Buffer.byteLength(text.trimEnd(), "utf8"));
      });

      it("passes the shape check Home Assistant runs", () => {
        expect(checkWatchMenus(read(file).doc)).toEqual([]);
      });

      it("holds the three sections, each with its own schema version", () => {
        const { doc } = read(file);
        for (const key of ["quickAction", "entityRadial", "pageSwitcher"]) {
          expect(typeof (doc[key] as JsonObject).schemaVersion, key).toBe("number");
        }
      });
    });
  }
});

// ── merge cases ──────────────────────────────────────────────────────────

const mergeDir = join(dir, "merge");
const mergeFiles = existsSync(mergeDir) ? readdirSync(mergeDir).filter((f) => f.endsWith(".json")).sort() : [];

interface MergeCase {
  name: string;
  base: MenusDocument | null;
  phone: MenusDocument;
  server: MenusDocument;
  expected: MenusDocument;
}

describe("menus merge cases", () => {
  it("are read from the folder", () => {
    expect(mergeFiles.length).toBeGreaterThanOrEqual(4);
  });

  for (const file of mergeFiles) {
    const c = JSON.parse(readFileSync(join(mergeDir, file), "utf8")) as MergeCase;
    it(`${file}: ${c.name}`, () => {
      const before = JSON.stringify([c.base, c.phone, c.server]);
      deepFreeze(c);
      const merged = mergeWatchMenus(c.base, c.phone, c.server);
      expect(merged).toEqual(c.expected);
      expect(JSON.stringify([c.base, c.phone, c.server])).toBe(before);
    });
  }

  it("rebases a draft the same way: the draft's section stays, the server's other sections come in", () => {
    const c = JSON.parse(readFileSync(join(mergeDir, "each-side-changes-a-different-section-both-stay.json"), "utf8")) as MergeCase;
    const draft = new WatchMenusDraft(c.base!, 4);
    draft.apply(c.phone);
    draft.rebase(c.server, 5);
    expect(draft.document).toEqual(c.expected);
    expect(draft.revision).toBe(5);
    expect(draft.dirty).toBe(true);
    // Undo takes back the draft's own edit, never the server's.
    draft.undo();
    expect(draft.document).toBe(c.server);
  });
});

// ── panel-written documents ──────────────────────────────────────────────

const PAGE_ID = "3E4D2000-0000-4000-8000-000000000101";
const HTTP_ID = "3E4D2000-0000-4000-8000-000000000201";
const STATUS_ID = "3E4D2000-0000-4000-8000-000000000301";

const TARGETS: MenuTargets = {
  pages: [{ id: PAGE_ID, name: "Kitchen" }],
  statusPages: [{ id: STATUS_ID, name: "Who is home" }],
  httpActions: [{ id: HTTP_ID, name: "Open gate" }],
};

function ids(...list: string[]): () => string {
  const queue = [...list];
  return () => {
    const next = queue.shift();
    if (next === undefined) throw new Error("out of ids");
    return next;
  };
}

/** Each panel fixture: a name and the edits that build it from the
 * defaults, as the editor's fields make them. */
const PANEL_CASES: { file: string; build: (d: MenusDocument) => MenusDocument }[] = [
  {
    file: "anywhere-slots.json",
    build: (d) => {
      const A = { list: "anywhere" } as const;
      // topLeft: Refresh becomes a trigger for the kitchen light, turned off.
      let out = setWatchMenuSlotAction(d, A, "3E4D0000-0000-4000-8000-000000000001", "triggerEntity", TARGETS);
      out = setWatchMenuActionKey(out, A, "3E4D0000-0000-4000-8000-000000000001", "entityId", "light.kitchen");
      out = setWatchMenuActionKey(out, A, "3E4D0000-0000-4000-8000-000000000001", "triggerMode", "turnOff");
      out = setWatchMenuActionKey(out, A, "3E4D0000-0000-4000-8000-000000000001", "confirmOnRelease", false);
      // topCenter: Settings gets its own icon and color, shown only over lights and covers.
      out = setWatchMenuSlotIcon(out, A, "3E4D0000-0000-4000-8000-000000000002", "gearshape.fill");
      out = setWatchMenuSlotColor(out, A, "3E4D0000-0000-4000-8000-000000000002", "#e76f51");
      out = setWatchMenuSlotEntityTypes(out, "3E4D0000-0000-4000-8000-000000000002", ["light", "cover"]);
      // bottomRight goes; a Go to Page slot takes its place.
      out = removeWatchMenuSlot(out, A, "3E4D0000-0000-4000-8000-000000000008");
      out = addWatchMenuSlot(out, A, { action: "navigateToPage", targets: TARGETS, newId: ids("3e4d2000-0000-4000-8000-000000000001") }).document;
      // rightCenter: an HTTP action with a banner of 6 seconds.
      out = setWatchMenuSlotAction(out, A, "3E4D0000-0000-4000-8000-000000000005", "runHTTPAction", TARGETS);
      out = setWatchMenuActionKey(out, A, "3E4D0000-0000-4000-8000-000000000005", "bannerSeconds", 6);
      // Switch Instance with the picker ring, moved to swap with Pages.
      out = setWatchMenuSlotAction(out, A, "3E4D0000-0000-4000-8000-000000000003", "switchInstance", TARGETS);
      out = setWatchMenuActionKey(out, A, "3E4D0000-0000-4000-8000-000000000003", "instanceSwitchBehavior", "pickerRing");
      out = moveWatchMenuSlot(out, A, "3E4D0000-0000-4000-8000-000000000003", "leftCenter");
      // bottomLeft hidden.
      return setWatchMenuSlotVisible(out, A, "3E4D0000-0000-4000-8000-000000000006", false);
    },
  },
  {
    file: "anywhere-style.json",
    build: (d) => {
      let out = setWatchMenuStyle(d, "quickAction", "beamStyle", "auroraWash");
      out = setWatchMenuStyle(out, "quickAction", "beamColor", "#2a9d8f");
      out = setWatchMenuStyle(out, "quickAction", "beamIntensity", 0.8);
      out = setWatchMenuStyle(out, "quickAction", "entranceStyle", "spring");
      out = setWatchMenuStyle(out, "quickAction", "showIconBubble", true);
      out = setWatchMenuStyle(out, "quickAction", "showContextLabel", true);
      out = setWatchMenuStyle(out, "quickAction", "backgroundDim", 0.65);
      return setWatchMenuStyle(out, "quickAction", "glowIntensity", 0.7);
    },
  },
  {
    file: "entity-domain.json",
    build: (d) => {
      const L = { list: "domain", domain: "light" } as const;
      let out = setWatchMenuSlotAction(d, L, "3E4D0000-0000-4000-8000-00000000000C", "lightFlash", TARGETS);
      out = addWatchMenuSlot(out, L, { action: "runHTTPAction", targets: TARGETS, newId: ids("3E4D2000-0000-4000-8000-000000000002") }).document;
      out = addWatchMenuSlot(out, L, { action: "showStatusPage", targets: TARGETS, newId: ids("3E4D2000-0000-4000-8000-000000000003") }).document;
      out = setWatchMenuActionKey(out, L, "3E4D2000-0000-4000-8000-000000000003", "pageId", STATUS_ID);
      out = setWatchMenuActionKey(out, L, "3E4D2000-0000-4000-8000-000000000003", "openOnRelease", false);
      return setWatchMenuInherits(out, "light", true);
    },
  },
  {
    file: "entity-override.json",
    build: (d) => {
      let out = addWatchMenuOverride(d, "climate.hallway");
      out = addWatchMenuOverride(out, "light.porch");
      out = removeWatchMenuOverride(out, "light.porch");
      const E = { list: "entity", entityId: "climate.hallway" } as const;
      out = removeWatchMenuSlot(out, E, "3E4D0000-0000-4000-8000-00000000001B");
      out = setWatchMenuSlotAction(out, E, "3E4D0000-0000-4000-8000-00000000001D", "triggerEntity", TARGETS);
      return setWatchMenuActionKey(out, E, "3E4D0000-0000-4000-8000-00000000001D", "entityId", "switch.hallway_fan");
    },
  },
  {
    file: "page-switcher.json",
    // Only the two keys the watch reads: `iconRadius`, `displayOffset` and
    // `displayMode` have no control and go back as they came.
    build: (d) => {
      const out = setWatchMenuStyle(d, "pageSwitcher", "glowIntensity", 0.8);
      return setWatchMenuStyle(out, "pageSwitcher", "selectedScale", 1.3);
    },
  },
];

/** Every key the panel wrote, checked against `menu-keys.json`: a key of the
 * type, an enum value the tables name. `keep` and opaque keys are the
 * phone's and are not looked into. */
function unknownKeys(value: unknown, type: string, path: string): string[] {
  const spec = MENU_KEYS.types[type];
  if (spec === undefined || typeof value !== "object" || value === null) return [];
  const out: string[] = [];
  for (const [key, v] of Object.entries(value as JsonObject)) {
    const k = spec.keys[key];
    if (k === undefined) {
      out.push(`${path}.${key}`);
      continue;
    }
    if (k.keep === true || k.type === "opaque") continue;
    if (k.type === "enum" && k.enum !== undefined && !(MENU_KEYS.enums[k.enum] ?? []).includes(v as string)) out.push(`${path}.${key}=${String(v)}`);
    if (k.type === "object" && k.ref !== undefined) out.push(...unknownKeys(v, k.ref, `${path}.${key}`));
    if (k.type === "array" && Array.isArray(v)) {
      const ref = (k.items as { ref?: string } | undefined)?.ref;
      if (ref !== undefined) v.forEach((item, i) => out.push(...unknownKeys(item, ref, `${path}.${key}[${i}]`)));
    }
    if (k.type === "map" && typeof v === "object" && v !== null) {
      const ref = ((k.items as { items?: { ref?: string } } | undefined)?.items)?.ref;
      for (const [entity, list] of Object.entries(v as JsonObject)) {
        if (ref !== undefined && Array.isArray(list)) list.forEach((item, i) => out.push(...unknownKeys(item, ref, `${path}.${key}.${entity}[${i}]`)));
      }
    }
  }
  return out;
}

describe("panel-written menus", () => {
  const panelDir = join(dir, "panel");
  const update = process.env.WA_UPDATE_FIXTURES === "1";
  const defaults = deepFreeze(read("01-defaults.json").doc);

  for (const c of PANEL_CASES) {
    it(`${c.file} is what the panel writes`, () => {
      const built = c.build(defaults);
      expect(built).not.toBe(defaults);
      const text = JSON.stringify(built);
      if (update) {
        mkdirSync(panelDir, { recursive: true });
        writeFileSync(join(panelDir, c.file), text);
      }
      expect(readFileSync(join(panelDir, c.file), "utf8")).toBe(text);
    });

    it(`${c.file} passes the shape check and names only keys and values the tables know`, () => {
      const built = c.build(defaults);
      expect(checkWatchMenus(built)).toEqual([]);
      expect(unknownKeys(built, "document", "$")).toEqual([]);
    });

    it(`${c.file} keeps every key the panel does not model`, () => {
      const built = c.build(defaults);
      // The defaults' slots all carry `voiceConfig`; every slot that came
      // from them still does, unchanged.
      const lists = [
        ...((built.quickAction as JsonObject).slots as JsonObject[]),
        ...Object.entries(built.entityRadial as JsonObject)
          .filter(([k, v]) => k.endsWith("Slots") && Array.isArray(v))
          .flatMap(([, v]) => v as JsonObject[]),
      ];
      for (const slot of lists) expect(slot.voiceConfig, String(slot.id)).toEqual({});
    });
  }

  it("the anywhere edit wrote the trigger as the phone encodes it", () => {
    const built = PANEL_CASES[0]!.build(defaults);
    const slot = ((built.quickAction as JsonObject).slots as JsonObject[]).find((s) => s.id === "3E4D0000-0000-4000-8000-000000000001")!;
    expect(slot.action).toEqual({ entityId: "light.kitchen", triggerMode: "turnOff", type: "triggerEntity" });
    expect(Object.keys(slot.action as JsonObject)).toEqual(["entityId", "triggerMode", "type"]);
    // The icon and color followed the target, as they were the action's own.
    expect(slot.icon).toBe("lightbulb");
    const added = ((built.quickAction as JsonObject).slots as JsonObject[]).at(-1)!;
    expect(added).toMatchObject({ id: "3E4D2000-0000-4000-8000-000000000001", position: "bottomRight", action: { pageId: PAGE_ID, type: "navigateToPage" } });
  });
});
