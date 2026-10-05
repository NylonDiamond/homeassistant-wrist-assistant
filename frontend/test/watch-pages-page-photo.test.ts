// A page's background photo: how the watch draws it and where it sits among
// the background's layers, the size and quality step down of an upload, and
// the store that fetches, uploads and deletes photos through Home
// Assistant's page_images commands.

import { afterEach, describe, expect, it } from "vitest";

import type { HassLike } from "../src/ha-api.js";
import type { WatchPage } from "../src/watch-pages/model.js";
import {
  PAGE_PHOTO_MAX_BYTES,
  PAGE_PHOTO_UNREADABLE_TEXT,
  isBuiltInPagePhoto,
  pagePhotoIdsInUse,
  pagePhotoRefusalText,
  pagePhotoSize,
  samePagePhotoId,
  stepDownPagePhoto,
  watchPagePhoto,
  watchPagePhotoStyle,
} from "../src/watch-pages/page-photo.js";
import { PagePhotoError, PagePhotoStore, base64OfBytes, forgetPagePhotos } from "../src/watch-pages/page-photo-store.js";
import { watchScreenBackground, watchScreenBackgroundLayers, watchScreenLayers } from "../src/watch-pages/preview.js";

const ID = "6F1C2D3E-4A5B-4C6D-8E7F-0123456789AB";
const SCREEN = { width: 208, height: 248 };

function page(extra: Record<string, unknown> = {}): WatchPage {
  return { id: "P", name: "Home", items: [], backgroundColor: "#000000", backgroundBrightness: 0.6, ...extra } as WatchPage;
}

describe("the photo as the watch reads it", () => {
  it("none without an id, else each value or its default", () => {
    expect(watchPagePhoto(page())).toBeUndefined();
    expect(watchPagePhoto(page({ backgroundImageId: "" }))).toBeUndefined();
    expect(watchPagePhoto(page({ backgroundImageId: "preset_waves" }))).toEqual({ id: "preset_waves", opacity: 1, blur: 0, fit: "fill" });
    expect(watchPagePhoto(page({ backgroundImageId: ID, backgroundImageOpacity: 1.4, backgroundImageBlur: -2, backgroundImageFit: "tile" })))
      .toEqual({ id: ID, opacity: 1, blur: 0, fit: "fill" });
  });

  it("frames the screen, fits the picture, then its opacity and blur in points times the scale", () => {
    const fill = watchPagePhotoStyle({ id: ID, opacity: 1, blur: 0, fit: "fill" }, "blob:x", 1.5, SCREEN);
    expect(fill).toContain("width:312px;height:372px");
    expect(fill).toContain(`background-image:url("blob:x")`);
    expect(fill).toContain("background-size:cover");
    expect(fill).not.toContain("opacity");
    expect(fill).not.toContain("filter");
    expect(watchPagePhotoStyle({ id: ID, opacity: 1, blur: 0, fit: "fit" }, "u", 1, SCREEN)).toContain("background-size:contain");
    expect(watchPagePhotoStyle({ id: ID, opacity: 1, blur: 0, fit: "stretch" }, "u", 1, SCREEN)).toContain("background-size:100% 100%");
    const soft = watchPagePhotoStyle({ id: ID, opacity: 0.45, blur: 4, fit: "fill" }, "u", 1.5, SCREEN);
    expect(soft).toContain("opacity:0.45");
    expect(soft).toContain("filter:blur(6px)");
  });

  it("ids: built-in by name, custom without case", () => {
    expect(isBuiltInPagePhoto("preset_cloudy_sea")).toBe(true);
    expect(isBuiltInPagePhoto(ID)).toBe(false);
    expect(samePagePhotoId(ID.toLowerCase(), ID)).toBe(true);
    expect(samePagePhotoId(undefined, ID)).toBe(false);
    expect([...pagePhotoIdsInUse([page({ backgroundImageId: ID.toLowerCase() }), page(), page({ backgroundImageId: "preset_sand" })])])
      .toEqual([ID, "PRESET_SAND"]);
  });
});

describe("the layers", () => {
  it("splits what lies over the photo (animation, pattern) from what lies under it (veil, base)", () => {
    const p = page({ backgroundPattern: "dots", backgroundOverlay: "snow", backgroundColor: "#112233", backgroundBrightness: 0.5 });
    const { over, under } = watchScreenBackgroundLayers(p, 1.5, SCREEN);
    expect(over[0]).toMatch(/^radial-gradient\(ellipse/);
    expect(over.length).toBeGreaterThan(1);
    expect(under).toHaveLength(2);
    expect(under[0]).toBe("linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))");
    expect(under[1]).toMatch(/^linear-gradient\(rgba\(17, 34, 51, 1\)/);
    expect(watchScreenBackground(p, 1.5, SCREEN)).toBe([...over, ...under].join(", "));
  });

  it("draws the photo between them once its bytes are in", () => {
    const p = page({ backgroundImageId: ID, backgroundPattern: "dots" });
    const none = watchScreenLayers(p, 1, SCREEN, () => undefined);
    expect(none.background).toBe(watchScreenBackground(p, 1, SCREEN));
    const drawn = watchScreenLayers(p, 1, SCREEN, (id) => (id === ID ? "blob:photo" : undefined));
    const { over, under } = watchScreenBackgroundLayers(p, 1, SCREEN);
    expect(drawn.background).toBe(under.join(", "));
    const layers = drawn.layers as { values: unknown[] };
    // A box of one screen clips the photo to the screen's corners.
    expect(layers.values[0]).toBe("wp-page-photo-clip");
    expect(layers.values[1]).toBe(`height:${SCREEN.height}px`);
    // Its own class: .wp-photo is a person tile's round photo.
    expect(layers.values[2]).toBe("wp-page-photo");
    expect(layers.values[3]).toContain(`url("blob:photo")`);
    // The pattern in a layer of its own over the photo.
    expect((layers.values[4] as { values: unknown[] }).values).toContain(`inset:0;background:${over.join(", ")}`);
    // No photo: the whole background, nothing drawn over it.
    expect(watchScreenLayers(page(), 1, SCREEN, () => "blob:x").background).toBe(watchScreenBackground(page(), 1, SCREEN));
  });
});

describe("an upload's size", () => {
  it("scales the longest side to 512 or less, never up", () => {
    expect(pagePhotoSize(4032, 3024)).toEqual({ width: 512, height: 384 });
    expect(pagePhotoSize(1000, 3000)).toEqual({ width: 171, height: 512 });
    expect(pagePhotoSize(300, 200)).toEqual({ width: 300, height: 200 });
    expect(pagePhotoSize(0, 10)).toEqual({ width: 1, height: 10 });
  });

  it("takes quality 0.8 when it fits", async () => {
    const tried: [number, number, number][] = [];
    const out = await stepDownPagePhoto(2048, 1536, async (w, h, q) => { tried.push([w, h, q]); return { size: 1000 }; });
    expect(out).toMatchObject({ width: 512, height: 384, quality: 0.8 });
    expect(tried).toEqual([[512, 384, 0.8]]);
  });

  it("steps the quality down until it is 200 KB or less", async () => {
    const tried: number[] = [];
    const out = await stepDownPagePhoto(512, 512, async (_w, _h, q) => { tried.push(q); return { size: q > 0.55 ? PAGE_PHOTO_MAX_BYTES + 1 : PAGE_PHOTO_MAX_BYTES }; });
    expect(tried).toEqual([0.8, 0.7, 0.6, 0.5]);
    expect(out?.quality).toBe(0.5);
  });

  it("then the size, by fifths, down to 128", async () => {
    const sizes: number[] = [];
    const out = await stepDownPagePhoto(512, 256, async (w) => { sizes.push(w); return { size: w > 300 ? 10 ** 9 : 1 }; });
    expect(out?.quality).toBe(0.8);
    expect(out!.width).toBeLessThanOrEqual(300);
    expect(out!.width / out!.height).toBeCloseTo(2, 1);
    const steps = [...new Set(sizes)];
    expect(steps.slice(0, 3)).toEqual([512, 409, 327]);
    expect(steps.length).toBe(4);
    expect(await stepDownPagePhoto(512, 512, async () => ({ size: 10 ** 9 }))).toBeUndefined();
    expect(await stepDownPagePhoto(512, 512, async () => undefined)).toBeUndefined();
  });

  it("base64 of bytes, in chunks", () => {
    const bytes = new Uint8Array(70_000).map((_, i) => i % 256);
    expect(base64OfBytes(bytes)).toBe(Buffer.from(bytes).toString("base64"));
  });
});

describe("refusals in words", () => {
  it("names each code", () => {
    expect(pagePhotoRefusalText({ code: "in_use" })).toBe("A page still uses that photo.");
    expect(pagePhotoRefusalText({ code: "full" })).toContain("500");
    expect(pagePhotoRefusalText(new Error("x"))).toContain("Try again");
  });
});

// ── the store ────────────────────────────────────────────────────────────

function fakeHass(answer: (message: Record<string, unknown>) => unknown) {
  const sent: Record<string, unknown>[] = [];
  const hass = {
    states: {},
    connection: {
      sendMessagePromise: async (message: Record<string, unknown>) => {
        sent.push(message);
        return answer(message);
      },
      subscribeMessage: async () => async () => {},
    },
  } as unknown as HassLike;
  return { hass, sent };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

afterEach(() => forgetPagePhotos());

describe("the photo store", () => {
  it("fetches a photo once, by id, and hands out its URL", async () => {
    const { hass, sent } = fakeHass((m) => ({ image_id: m.image_id, content_type: "image/jpeg", data: "QUJD" }));
    let changed = 0;
    const store = new PagePhotoStore(() => hass, () => changed++, { makeUrl: (b) => `data:${b}` });
    expect(store.url("preset_waves")).toBeUndefined();
    expect(store.status("preset_waves")).toBe("loading");
    expect(store.url("preset_waves")).toBeUndefined();
    await flush();
    expect(store.url("preset_waves")).toBe("data:QUJD");
    expect(changed).toBe(1);
    // A second editor reads the same memory.
    const other = new PagePhotoStore(() => hass, () => {}, { makeUrl: () => "never" });
    expect(other.url("PRESET_WAVES")).toBe("data:QUJD");
    expect(sent.filter((m) => m.type === "wrist_assistant/page_images/get")).toEqual([{ type: "wrist_assistant/page_images/get", image_id: "preset_waves" }]);
  });

  it("marks a photo the store does not have as missing, and asks again after the next list", async () => {
    let have = false;
    const { hass, sent } = fakeHass((m) => {
      if (m.type === "wrist_assistant/page_images/list") return { presets: [], images: [] };
      if (!have) throw { code: "not_found", message: "No such photo." };
      return { image_id: ID, content_type: "image/jpeg", data: "QQ==" };
    });
    const store = new PagePhotoStore(() => hass, () => {}, { makeUrl: (b) => b });
    store.url(ID);
    await flush();
    expect(store.status(ID)).toBe("missing");
    expect(store.url(ID)).toBeUndefined();
    have = true;
    await store.refreshList();
    expect(store.url(ID)).toBeUndefined();
    await flush();
    expect(store.url(ID)).toBe("QQ==");
    expect(sent.filter((m) => m.type === "wrist_assistant/page_images/get")).toHaveLength(2);
  });

  it("lists, or says when the integration has no store", async () => {
    const ok = fakeHass(() => ({ presets: [{ id: "preset_waves", name: "Waves", width: 208, height: 248 }], images: [] }));
    const store = new PagePhotoStore(() => ok.hass, () => {});
    store.ensureList();
    store.ensureList();
    await flush();
    expect(store.listState).toBe("ready");
    expect(store.list?.presets.map((p) => p.name)).toEqual(["Waves"]);
    expect(ok.sent).toHaveLength(1);
    const old = fakeHass(() => { throw { code: "unknown_command", message: "Unknown command." }; });
    const none = new PagePhotoStore(() => old.hass, () => {});
    await none.refreshList();
    expect(none.listState).toBe("none");
  });

  it("uploads the encoded photo and keeps its bytes", async () => {
    const { hass, sent } = fakeHass((m) => {
      if (m.type === "wrist_assistant/page_images/upload") return { image_id: ID, width: 512, height: 384, bytes: 3 };
      return { presets: [], images: [] };
    });
    const store = new PagePhotoStore(() => hass, () => {}, { makeUrl: (b) => `u:${b}`, encodeFile: async () => "QUJD" });
    const id = await store.upload(new Blob(["x"]));
    expect(id).toBe(ID);
    expect(sent[0]).toEqual({ type: "wrist_assistant/page_images/upload", data: "QUJD" });
    expect(store.url(ID)).toBe(`u:QUJD`);
    expect(store.uploading).toBe(false);
    expect(store.error).toBeUndefined();
  });

  it("an unreadable file or a refusal says so", async () => {
    const { hass } = fakeHass(() => { throw { code: "too_large", message: "big" }; });
    const unreadable = new PagePhotoStore(() => hass, () => {}, { encodeFile: async () => { throw new PagePhotoError(PAGE_PHOTO_UNREADABLE_TEXT); } });
    expect(await unreadable.upload(new Blob(["x"]))).toBeUndefined();
    expect(unreadable.error).toBe(PAGE_PHOTO_UNREADABLE_TEXT);
    const refused = new PagePhotoStore(() => hass, () => {}, { encodeFile: async () => "QQ==" });
    expect(await refused.upload(new Blob(["x"]))).toBeUndefined();
    expect(refused.error).toBe("That photo is too big for Home Assistant.");
  });

  it("deletes a library photo, or says why not", async () => {
    let inUse = false;
    const { hass, sent } = fakeHass((m) => {
      if (m.type === "wrist_assistant/page_images/list") return { presets: [], images: [{ id: ID, width: 1, height: 1, bytes: 1, added_at: "", used_by: [] }] };
      if (inUse) throw { code: "in_use", message: "used" };
      return {};
    });
    const store = new PagePhotoStore(() => hass, () => {});
    await store.refreshList();
    inUse = true;
    expect(await store.remove(ID)).toBe(false);
    expect(store.error).toBe("A page still uses that photo.");
    inUse = false;
    expect(await store.remove(ID)).toBe(true);
    expect(sent.some((m) => m.type === "wrist_assistant/page_images/delete" && m.image_id === ID)).toBe(true);
  });
});
