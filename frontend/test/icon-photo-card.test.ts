// The Icon part's Photo row (icon-photo-card.ts): None, then the home's icon
// photos with those made for the tile's entity first and marked "From
// iPhone", then Add photo; a pick writes `iconPhotoId`, None removes it,
// several tiles picked show Mixed, and a photo anything uses has no delete.
// Also the key itself in page-keys.json and the version note.
//
// No DOM: the row is drawn to its Lit template and read as text, and a
// button is pressed by calling the handler its template holds, as
// watch-pages-multi-pick.test.ts does.

import { afterEach, describe, expect, it } from "vitest";

import type { HassLike } from "../src/ha-api.js";
import { SymbolBrowser } from "../src/symbols.js";
import { MIN_VERSION_FOR_PHOTO_TILES, photoTilesFor, photoTilesUpdateNote } from "../src/version.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TilePick, type TileSettingsHost, extendHost } from "../src/watch-pages/editor-host.js";
import { ICON_PHOTO_FROM_PHONE, iconPhotoChoices, renderIconPhoto } from "../src/watch-pages/icon-photo-card.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { PagePhotoStore, forgetPagePhotos } from "../src/watch-pages/page-photo-store.js";
import { setWatchTileIconPhoto, watchTileIconPhotoId } from "../src/watch-pages/tile-settings-model.js";
import { watchTileInspectorPartChanged, watchTileInspectorPartReset } from "../src/watch-pages/tile-settings.js";
import pageKeys from "../src/watch-pages/page-keys.json";

(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};
(globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ??= class {};

// ── reading templates ────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}

function flat(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flat).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flat(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (isTpl(node)) {
    out.push(node);
    for (const v of node.values) templates(v, out);
  }
  return out;
}

/** The `event` handler of the smallest template whose text holds `marker`
 * and binds that event itself. */
function handler(root: unknown, marker: string, event = "@click="): (e: unknown) => unknown {
  const found = templates(root)
    .map((t) => {
      let text = "";
      let fn: unknown;
      t.strings.forEach((s, i) => {
        text += s;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && s.trimEnd().endsWith(event)) fn ??= v;
        text += flat(v);
      });
      return { text, fn };
    })
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no ${event} handler near ${marker}`);
  return found[0]!.fn as (e: unknown) => unknown;
}

const click = (root: unknown, marker: string) => handler(root, marker)({ type: "click" });

/** The photo ids of the row's choices, in order ("none" for None). */
const order = (text: string) => [...text.matchAll(/data-photo=(\S+)/g)].map((m) => m[1]!);

// ── a host and a store ───────────────────────────────────────────────────

const PAGE_ID = "C3A0E000-0000-4000-8000-0000000000AA";
const A = "C3A0E000-0000-4000-8000-000000000001";
const B = "C3A0E000-0000-4000-8000-000000000002";
const LAMP = "0A1B2C3D-4E5F-4A6B-8C7D-000000000001";
const FAN = "0A1B2C3D-4E5F-4A6B-8C7D-000000000002";
const OLD_LAMP = "0A1B2C3D-4E5F-4A6B-8C7D-000000000003";
const BACK = "0A1B2C3D-4E5F-4A6B-8C7D-000000000004";

const tile = (id: string, entityId: string, extra: Record<string, unknown> = {}): WatchPageTile => ({
  id, entityId, gridCol: 0, gridRow: 0, colSpan: 3, rowSpan: 2, ...extra,
});

const STATES = {
  "light.desk": { entity_id: "light.desk", state: "on", attributes: { friendly_name: "Desk lamp" } },
  "fan.ceiling": { entity_id: "fan.ceiling", state: "off", attributes: { friendly_name: "Ceiling fan" } },
};

const IMAGES = [
  // Newest first, as the list comes.
  { id: FAN, width: 300, height: 300, bytes: 9, added_at: "2026-10-26T10:00:00Z", used_by: [], format: "png", kind: "icon", label: "Ceiling fan", entity_id: "fan.ceiling" },
  { id: LAMP, width: 300, height: 200, bytes: 9, added_at: "2026-10-25T10:00:00Z", used_by: [], format: "png", kind: "icon", label: "Desk lamp", entity_id: "light.desk" },
  { id: BACK, width: 512, height: 384, bytes: 9, added_at: "2026-10-24T10:00:00Z", used_by: [] },
  { id: OLD_LAMP, width: 300, height: 300, bytes: 9, added_at: "2026-10-20T10:00:00Z", used_by: ["watch-1"], format: "png", kind: "icon", label: "Desk lamp", entity_id: "light.desk" },
];

function fakeHass() {
  const sent: Record<string, unknown>[] = [];
  const hass = {
    states: STATES,
    connection: {
      sendMessagePromise: async (m: Record<string, unknown>) => {
        sent.push(m);
        if (m.type === "wrist_assistant/page_images/list") return { presets: [], images: IMAGES };
        if (m.type === "wrist_assistant/page_images/upload") return { image_id: "0A1B2C3D-4E5F-4A6B-8C7D-0000000000FF", width: 200, height: 200, bytes: 3 };
        return { image_id: m.image_id, content_type: "image/png", data: "UE5H" };
      },
      subscribeMessage: async () => async () => {},
    },
  } as unknown as HassLike;
  return { hass, sent };
}

async function setup(items: WatchPageTile[], picked: string[]) {
  const { hass, sent } = fakeHass();
  const photos = new PagePhotoStore(() => hass, () => {}, { makeUrl: (b, type) => `${type}:${b}`, encodeIcon: async () => "UE5H" });
  await photos.refreshList();
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Living", items }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  const tileOf = (id: string) => ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((x) => x.id === id);
  let at: string | undefined;
  const base = {
    hass,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return draft.document; },
    pageId: PAGE_ID,
    get page() { return pageNow(); },
    otherPages: [],
    catalog: undefined,
    cameraRefreshDefaults: { on: true, debounce: "5" },
    behavior: undefined,
    musicAssistant: undefined,
    cloudTTS: undefined,
    templateRenders: new Map(),
    deviceSiblings: () => ({ selects: [], switches: [], sensors: [], all: [] }),
    loadImageSize: async () => undefined,
    photos,
    smartRuleId: undefined,
    busy: false,
    uiState: new Map<string, unknown>(),
    apply: (next: WatchPagesDocument) => draft.apply(next),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
    oneLook: true,
  } as unknown as TileSettingsHost;
  const pick: TilePick = {
    get ids() { return picked; },
    get tiles() { return picked.map((id) => tileOf(id)!); },
    as: (id, run) => {
      const was = at;
      at = id;
      try {
        return run();
      } finally {
        at = was;
      }
    },
  };
  const host = extendHost(base, {
    tileId: () => at ?? picked[0]!,
    tile: () => tileOf(at ?? picked[0]!) ?? ({} as WatchPageTile),
    ...(picked.length >= 2 ? { picked: () => pick } : {}),
  }) as TileSettingsHost;
  return { host, draft, photos, sent, tileOf };
}

afterEach(() => forgetPagePhotos());

// ── the key ──────────────────────────────────────────────────────────────

describe("the key", () => {
  it("is an optional string on a tile, with a note", () => {
    const keys = (pageKeys as { types: { tile: { keys: Record<string, unknown> } } }).types.tile.keys;
    expect(keys.iconPhotoId).toEqual({ type: "string", required: false });
    expect((pageKeys as { notes: { keys: Record<string, string> } }).notes.keys.iconPhotoId).toContain("UUID");
  });

  it("is written upper case, and None removes it", () => {
    const doc = { schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Living", items: [tile(A, "light.desk")] }] } as WatchPagesDocument;
    const set = setWatchTileIconPhoto(doc, PAGE_ID, A, LAMP.toLowerCase());
    const t = (d: WatchPagesDocument) => ((d.pages as WatchPage[])[0]!.items as WatchPageTile[])[0]!;
    expect(t(set).iconPhotoId).toBe(LAMP);
    expect(watchTileIconPhotoId(t(set))).toBe(LAMP);
    // The icon stays.
    expect(Object.hasOwn(t(setWatchTileIconPhoto(set, PAGE_ID, A, undefined)), "iconPhotoId")).toBe(false);
    expect(setWatchTileIconPhoto(doc, PAGE_ID, A, undefined)).toBe(doc);
    expect(watchTileIconPhotoId(tile(A, "light.desk", { iconPhotoId: " " }))).toBeUndefined();
  });
});

// ── the row ──────────────────────────────────────────────────────────────

describe("the Photo row", () => {
  it("None, then the tile's entity's icon photos marked From iPhone, then the rest; no backgrounds", async () => {
    const { host } = await setup([tile(A, "light.desk")], [A]);
    const text = flat(renderIconPhoto(host));
    expect(order(text)).toEqual(["none", LAMP, OLD_LAMP, FAN]);
    expect(text.match(new RegExp(`class="pc-label">${ICON_PHOTO_FROM_PHONE}<`, "g"))).toHaveLength(2);
    expect(text).toContain("Ceiling fan");
    expect(text).toContain("Add photo");
    // None is on with no photo.
    expect(text).toMatch(/aria-checked=true[^>]*data-photo=none/);
  });

  it("a pick writes iconPhotoId, None removes it", async () => {
    const { host, tileOf } = await setup([tile(A, "light.desk")], [A]);
    click(renderIconPhoto(host), `data-photo=${FAN}`);
    expect(tileOf(A)!.iconPhotoId).toBe(FAN);
    const text = flat(renderIconPhoto(host));
    expect(text).toMatch(new RegExp(`aria-checked=true[^>]*data-photo=${FAN}`));
    expect(text).toMatch(/aria-checked=false[^>]*data-photo=none/);
    click(renderIconPhoto(host), "data-photo=none");
    expect(Object.hasOwn(tileOf(A)!, "iconPhotoId")).toBe(false);
  });

  it("several tiles picked: Mixed when they differ, nothing on, a pick sets every one", async () => {
    const { host, tileOf } = await setup([tile(A, "light.desk", { iconPhotoId: LAMP }), tile(B, "fan.ceiling")], [A, B]);
    const text = flat(renderIconPhoto(host));
    expect(text).toContain("Mixed");
    expect(text).not.toContain("aria-checked=true");
    click(renderIconPhoto(host), `data-photo=${FAN}`);
    expect([tileOf(A)!.iconPhotoId, tileOf(B)!.iconPhotoId]).toEqual([FAN, FAN]);
    const same = flat(renderIconPhoto(host));
    expect(same).not.toContain("Mixed");
    expect(same).toMatch(new RegExp(`aria-checked=true[^>]*data-photo=${FAN}`));
  });

  it("a delete only on a photo no tile or page uses", async () => {
    // FAN is on another tile of the page; OLD_LAMP is used by a saved page.
    const { host } = await setup([tile(A, "light.desk"), tile(B, "fan.ceiling", { iconPhotoId: FAN })], [A]);
    const text = flat(renderIconPhoto(host));
    // Only LAMP is free: its cell alone carries the delete.
    const cells = text.split(`<span class="ts-ph-cell">`).slice(1);
    const withDelete = cells.filter((c) => c.includes(`class="ts-ph-del"`)).map((c) => /data-photo=(\S+)/.exec(c)?.[1]);
    expect(withDelete).toEqual([LAMP]);
  });

  it("Add photo stores an icon photo named for the tile and picks it", async () => {
    const { host, tileOf, sent } = await setup([tile(A, "light.desk", { customLabel: "Reading lamp" })], [A]);
    const input = { files: [new Blob(["x"])], value: "C:\\photo.jpg" };
    await handler(renderIconPhoto(host), "Add photo", "@change=")({ target: input });
    await new Promise((resolve) => setTimeout(resolve, 0));
    const upload = sent.find((m) => m.type === "wrist_assistant/page_images/upload");
    expect(upload).toEqual({ type: "wrist_assistant/page_images/upload", data: "UE5H", kind: "icon", label: "Reading lamp", entity_id: "light.desk" });
    expect(tileOf(A)!.iconPhotoId).toBe("0A1B2C3D-4E5F-4A6B-8C7D-0000000000FF");
    expect(input.value).toBe("");
  });

  it("a tile naming a photo that is not listed still shows it first, on", () => {
    const gone = "0A1B2C3D-4E5F-4A6B-8C7D-0000000000EE";
    const choices = iconPhotoChoices(IMAGES as never, "light.desk", gone);
    expect(choices.map((c) => c.id)).toEqual([gone, LAMP, OLD_LAMP, FAN]);
    expect(iconPhotoChoices(IMAGES as never, undefined, undefined).map((c) => c.forTile)).toEqual([false, false, false]);
  });

  it("says so on an integration with no photo store", async () => {
    const { host, photos } = await setup([tile(A, "light.desk")], [A]);
    photos.listState = "none";
    const text = flat(renderIconPhoto(host));
    expect(text).toContain("need a newer version of the integration");
    expect(text).not.toContain("Add photo");
  });
});

describe("the Icon part with a photo", () => {
  it("reads as changed, and its Reset takes the photo off", async () => {
    const { host, draft } = await setup([tile(A, "light.desk", { iconPhotoId: LAMP })], [A]);
    expect(watchTileInspectorPartChanged(host, "icon")).toBe(true);
    const reset = watchTileInspectorPartReset(host, "icon")!;
    const next = reset(draft.document);
    expect(Object.hasOwn(((next.pages as WatchPage[])[0]!.items as WatchPageTile[])[0]!, "iconPhotoId")).toBe(false);
  });
});

describe("the version note", () => {
  it("names the devices too old once a minimum is set, none before", () => {
    expect(MIN_VERSION_FOR_PHOTO_TILES).toBeNull();
    expect(photoTilesFor("1.0.0")).toBe(true);
    expect(photoTilesUpdateNote(["Chen Watch"])).toBeUndefined();
    expect(photoTilesFor("3.1.0", "3.2.0")).toBe(false);
    expect(photoTilesFor(undefined, "3.2.0")).toBe(true);
    expect(photoTilesUpdateNote(["Chen Watch"], "3.2.0")).toBe("Needs Wrist Assistant 3.2 on Chen Watch. Until then it draws the icon.");
    expect(photoTilesUpdateNote(["A", "B"], "3.2.0")).toBe("Needs Wrist Assistant 3.2 on A and B. Until then they draw the icon.");
    expect(photoTilesUpdateNote([], "3.2.0")).toBeUndefined();
  });
});
