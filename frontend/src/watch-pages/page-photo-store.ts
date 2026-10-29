// The home's page photos as the page editor reaches them (part 4d batch 6,
// 6e): the list of built-in photos and the library, each photo's bytes
// fetched once by id and kept in memory for the session, an upload that
// scales and compresses the picked file in the browser first, and a delete.
// The library holds the tiles' icon photos too (`kind` icon, PNG with its
// clear background kept): their upload tidies the picture first
// (`icon-photo-tidy.ts`). A PNG's bytes are read once as they come in, for
// its size, the On photo the iPhone may have put in it and the look it may
// have saved in it (Light Look, `one-look/glow.ts`). An On photo gets its
// own URL then, once its size is checked, and its tint mask from the two
// photos (`one-look/tint.ts`), once; a photo with a look and no On
// photo has its three masks made then, once, as images a picture can mask
// with, never while drawing.
//
// Home Assistant's own store (`page_images_store.py`) makes the ids, so
// nothing here needs `crypto.randomUUID`, which a plain http page lacks.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md, "4d batch 6", and
// docs/photo_tiles_plan_2026-10.md.

import {
  type HassLike,
  type PageImageEntry,
  type PageImagePreset,
  type PageImageUploadInfo,
  deletePageImage,
  fetchPageImage,
  listPageImages,
  uploadPageImage,
} from "../ha-api.js";
import { iconPhotoCrop, stepDownIconPhoto, tidyIconPixels } from "./icon-photo-tidy.js";
import {
  type IconPngFacts,
  type OneLookLightMask,
  type OneLookLightPixels,
  type OneLookLightRecipe,
  type OneLookPhotoLight,
  oneLookLightMasks,
  oneLookMaskPixels,
  readIconPng,
} from "./one-look/glow.js";
import { oneLookOnTintMask } from "./one-look/tint.js";
import { PAGE_PHOTO_UNREADABLE_TEXT, pagePhotoKind, pagePhotoRefusalText, samePagePhotoId, stepDownPagePhoto } from "./page-photo.js";

/** Where a photo's bytes are: on the way, here, not in the store, or a read
 * that failed (tried again on the next list). */
export type PagePhotoStatus = "loading" | "ready" | "missing" | "failed";

interface Held {
  status: PagePhotoStatus;
  url?: string;
  done?: Promise<void>;
  /** A PNG's size and look (Light Look), read once from its bytes. */
  png?: Omit<IconPngFacts, "on">;
  /** The look with its masks made, once they are. */
  light?: OneLookPhotoLight;
  /** The On photo's URL, once it is made and its size checked. It lives
   * as long as `url` does. */
  on?: string;
  /** The On photo's tint mask (`one-look/tint.ts`) as an image URL, made
   * with the On photo's URL. */
  onMask?: string;
}

/** Makes a photo's look from its PNG bytes: its masks as image URLs. */
export type PhotoLightMaker = (bytes: Uint8Array, recipe: OneLookLightRecipe) => Promise<OneLookPhotoLight | undefined>;

/** Makes an On photo's URL from its PNG bytes, with the size it decodes
 * to, or undefined when it does not decode. */
export type PhotoOnMaker = (bytes: Uint8Array) => Promise<{ url: string; width: number; height: number } | undefined>;

/** Makes an On photo's tint mask as an image URL from the Off photo's and
 * the On photo's PNG bytes, or undefined where it cannot. */
export type PhotoOnMaskMaker = (off: Uint8Array, on: Uint8Array) => Promise<string | undefined>;

/** The makers a photo's bytes go through as they come in, and the way back
 * from a URL made for nothing. */
interface PhotoMakers {
  light: PhotoLightMaker;
  on: PhotoOnMaker;
  onMask: PhotoOnMaskMaker;
  revoke: (url: string) => void;
}

/** A mask as a PNG blob URL, white with the mask as its alpha, which a CSS
 * `mask-image` reads. */
function maskUrl(mask: OneLookLightMask): Promise<string | undefined> {
  const canvas = document.createElement("canvas");
  canvas.width = mask.width;
  canvas.height = mask.height;
  const context = canvas.getContext("2d");
  if (context === null) return Promise.resolve(undefined);
  const image = context.createImageData(mask.width, mask.height);
  image.data.set(oneLookMaskPixels(mask));
  context.putImageData(image, 0, 0);
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob === null ? undefined : URL.createObjectURL(blob)), "image/png"));
}

/**
 * A photo's look as the browser makes it: the PNG decoded to its own
 * straight pixels (no premultiplying, no colour conversion), the three
 * masks made from them (`oneLookLightMasks`), and each written as a PNG
 * blob URL. Undefined where the browser cannot (no canvas) or the PNG does
 * not decode.
 */
export async function makePhotoLight(bytes: Uint8Array, recipe: OneLookLightRecipe): Promise<OneLookPhotoLight | undefined> {
  if (typeof createImageBitmap !== "function" || typeof document === "undefined" || typeof URL.createObjectURL !== "function") return undefined;
  const pixels = await straightPixels(bytes);
  if (pixels === undefined) return undefined;
  const { width, height } = pixels;
  const masks = oneLookLightMasks(pixels, recipe.dir);
  const [emit, aura, beam] = await Promise.all([maskUrl(masks.emit), maskUrl(masks.aura), masks.beam === undefined ? undefined : maskUrl(masks.beam)]);
  if (emit === undefined || aura === undefined) return undefined;
  return { recipe, width, height, pad: masks.pad, emit, aura, ...(beam === undefined ? {} : { beam }) };
}

/**
 * An On photo as the browser makes it: the PNG decoded once for its size
 * (a PNG that does not decode is none), and a blob URL of its bytes.
 * Undefined where the browser cannot (no `createImageBitmap`).
 */
export async function makePhotoOn(bytes: Uint8Array): Promise<{ url: string; width: number; height: number } | undefined> {
  if (typeof createImageBitmap !== "function" || typeof URL.createObjectURL !== "function") return undefined;
  const blob = new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "image/png" });
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(blob);
  } catch {
    return undefined;
  }
  const { width, height } = bitmap;
  bitmap.close();
  return { url: URL.createObjectURL(blob), width, height };
}

/** A PNG decoded to its own straight pixels (no premultiplying, no colour
 * conversion), or undefined where the browser cannot or it does not
 * decode. */
async function straightPixels(bytes: Uint8Array): Promise<OneLookLightPixels | undefined> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "image/png" }), { premultiplyAlpha: "none", colorSpaceConversion: "none" });
  } catch {
    return undefined;
  }
  try {
    const { width, height } = bitmap;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (context === null || width === 0 || height === 0) return undefined;
    context.drawImage(bitmap, 0, 0);
    return { width, height, data: context.getImageData(0, 0, width, height).data };
  } finally {
    bitmap.close();
  }
}

/**
 * An On photo's tint mask as the browser makes it: both PNGs decoded to
 * their straight pixels, the glow mask `W` clipped to the On photo's alpha
 * (`oneLookOnTintMask`), written as a PNG blob URL. Undefined where the
 * browser cannot (no canvas), either does not decode, or their sizes differ.
 */
export async function makePhotoOnMask(off: Uint8Array, on: Uint8Array): Promise<string | undefined> {
  if (typeof createImageBitmap !== "function" || typeof document === "undefined" || typeof URL.createObjectURL !== "function") return undefined;
  const [offPixels, onPixels] = await Promise.all([straightPixels(off), straightPixels(on)]);
  if (offPixels === undefined || onPixels === undefined) return undefined;
  const mask = oneLookOnTintMask(offPixels, onPixels);
  return mask === undefined ? undefined : maskUrl(mask);
}

/** `URL.revokeObjectURL` where there is one. */
function revokeUrl(url: string): void {
  if (typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") URL.revokeObjectURL(url);
}

/** Base64 bytes as bytes, or undefined where the browser cannot decode them. */
function bytesOfBase64(base64: string): Uint8Array | undefined {
  if (typeof atob !== "function") return undefined;
  try {
    const text = atob(base64);
    const bytes = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
    return bytes;
  } catch {
    return undefined;
  }
}

/**
 * An On photo's URL when its bytes make one of the photo's own size, else
 * undefined. Bytes whose `IHDR` names another size are never decoded; a
 * URL made for a PNG that decodes to another size is revoked.
 */
async function onUrlOf(on: Uint8Array, width: number, height: number, make: PhotoMakers): Promise<string | undefined> {
  const header = readIconPng(on);
  if (header === undefined || header.width !== width || header.height !== height) return undefined;
  const made = await make.on(on).catch(() => undefined);
  if (made === undefined) return undefined;
  if (made.width === width && made.height === height) return made.url;
  make.revoke(made.url);
  return undefined;
}

/**
 * A photo's bytes in: its URL on `entry`, ready, and for a PNG what its
 * bytes say of its size, its On photo and its look. An On photo gets its
 * URL then (`make.on`), and a look without one its masks (`make.light`):
 * the On photo wins whenever the look would draw, so its masks would never
 * be used. The promise settles once they are made, or once there is
 * nothing to make. An On photo of another size, or one that does not
 * decode, is none; a look whose masks cannot be made draws no light.
 */
function takeBytes(entry: Held, url: string, base64: string, contentType: string, make: PhotoMakers): Promise<void> {
  entry.url = url;
  entry.status = "ready";
  if (contentType !== "image/png") return Promise.resolve();
  const bytes = bytesOfBase64(base64);
  const read = bytes === undefined ? undefined : readIconPng(bytes);
  if (read === undefined || bytes === undefined) return Promise.resolve();
  const { on, ...png } = read;
  entry.png = png;
  const onUrl = on === undefined ? Promise.resolve(undefined) : onUrlOf(on, png.width, png.height, make);
  return onUrl.then((onAt) => {
    if (onAt !== undefined && on !== undefined) {
      entry.on = onAt;
      // The tint mask, made once with the On photo's URL; none where it
      // cannot be made (the On photo then draws untinted).
      return make.onMask(bytes, on).then(
        (mask) => {
          if (mask !== undefined) entry.onMask = mask;
        },
        () => undefined,
      );
    }
    const recipe = png.recipe;
    if (recipe === undefined) return;
    return make.light(bytes, recipe).then(
      (light) => {
        if (light !== undefined) entry.light = light;
      },
      () => undefined,
    );
  });
}

/** Every photo's bytes as a URL, by id upper cased, for the session. A
 * photo's id never names other bytes, so nothing here goes stale. */
const held = new Map<string, Held>();

/** How many photo reads may be out at once. */
const MAX_READS = 4;
let reading = 0;
const waiting: (() => void)[] = [];

async function slot<T>(run: () => Promise<T>): Promise<T> {
  if (reading >= MAX_READS) await new Promise<void>((resolve) => waiting.push(resolve));
  reading++;
  try {
    return await run();
  } finally {
    reading--;
    waiting.shift()?.();
  }
}

/** Forget every photo held, for tests. */
export function forgetPagePhotos(): void {
  held.clear();
}

/** The content types a photo comes in; anything else reads as JPEG, as
 * every photo did before tile photos. */
export function pagePhotoContentType(type: unknown): "image/jpeg" | "image/png" {
  return type === "image/png" ? "image/png" : "image/jpeg";
}

/** A photo in base64 as a URL a style can name, of its content type (JPEG
 * unless it says PNG): a blob URL where the browser makes them (short, so a
 * page's many thumbs carry no copy of the bytes), else a data URL. */
export function pagePhotoUrl(base64: string, contentType?: string): string {
  const type = pagePhotoContentType(contentType);
  if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function" && typeof Blob !== "undefined" && typeof atob === "function") {
    const text = atob(base64);
    const bytes = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type }));
  }
  return `data:${type};base64,${base64}`;
}

/** Bytes as base64, a chunk at a time so a large photo never overflows the
 * call stack. */
export function base64OfBytes(bytes: Uint8Array): string {
  let text = "";
  for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(text);
}

/** A refusal in words, to show as it is. */
export class PagePhotoError extends Error {}

/**
 * The picked file as the JPEG the panel uploads, in base64: decoded by the
 * browser, drawn on black at its longest side 512 px or less, and written at
 * quality 0.8, stepping down until it is 200 KB or less
 * (`stepDownPagePhoto`). A file the browser cannot decode (HEIC in Chrome)
 * throws a `PagePhotoError` that says so.
 */
export async function encodePagePhotoFile(file: Blob): Promise<string> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new PagePhotoError(PAGE_PHOTO_UNREADABLE_TEXT);
  }
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context === null) throw new PagePhotoError(PAGE_PHOTO_UNREADABLE_TEXT);
    const encode = (width: number, height: number, quality: number) => {
      canvas.width = width;
      canvas.height = height;
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(bitmap, 0, 0, width, height);
      return new Promise<Blob | undefined>((resolve) => canvas.toBlob((blob) => resolve(blob ?? undefined), "image/jpeg", quality));
    };
    const out = await stepDownPagePhoto(bitmap.width, bitmap.height, encode);
    if (out === undefined) throw new PagePhotoError("That photo could not be made small enough.");
    return base64OfBytes(new Uint8Array(await out.result.arrayBuffer()));
  } finally {
    bitmap.close();
  }
}

/** The longest side the tidy reads a picked picture at. The stored photo
 * is 384 px at most, so a phone camera's 12 megapixels are drawn smaller
 * first; the means and the bounds come out the same. */
const ICON_WORK_SIDE = 1024;

/**
 * The picked file as a tile's icon photo, a PNG in base64 with its clear
 * background kept: decoded by the browser, drawn at its longest side 1024
 * px or less, tidied (`tidyIconPixels`), cropped to what is drawn with its
 * padding (`iconPhotoCrop`), then scaled to 384 px at most and stepped down
 * by fifths until it is 256 KiB or less (`stepDownIconPhoto`). A file the
 * browser cannot decode throws a `PagePhotoError` that says so.
 */
export async function encodeIconPhotoFile(file: Blob): Promise<string> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new PagePhotoError(PAGE_PHOTO_UNREADABLE_TEXT);
  }
  try {
    const k = Math.min(1, ICON_WORK_SIDE / Math.max(1, bitmap.width, bitmap.height));
    const work = document.createElement("canvas");
    work.width = Math.max(1, Math.round(bitmap.width * k));
    work.height = Math.max(1, Math.round(bitmap.height * k));
    const wc = work.getContext("2d", { willReadFrequently: true });
    if (wc === null) throw new PagePhotoError(PAGE_PHOTO_UNREADABLE_TEXT);
    wc.imageSmoothingEnabled = true;
    wc.imageSmoothingQuality = "high";
    wc.drawImage(bitmap, 0, 0, work.width, work.height);
    const pixels = wc.getImageData(0, 0, work.width, work.height);
    tidyIconPixels(pixels.data);
    wc.putImageData(pixels, 0, 0);
    const crop = iconPhotoCrop(pixels.data, work.width, work.height);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context === null) throw new PagePhotoError(PAGE_PHOTO_UNREADABLE_TEXT);
    const encode = (width: number, height: number) => {
      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, width, height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      // The crop box may reach past the picture: what lies there stays clear.
      context.drawImage(work, crop.x, crop.y, crop.width, crop.height, 0, 0, width, height);
      return new Promise<Blob | undefined>((resolve) => canvas.toBlob((blob) => resolve(blob ?? undefined), "image/png"));
    };
    const out = await stepDownIconPhoto(crop.width, crop.height, encode);
    if (out === undefined) throw new PagePhotoError("That photo could not be made small enough.");
    return base64OfBytes(new Uint8Array(await out.result.arrayBuffer()));
  } finally {
    bitmap.close();
  }
}

/** What the store's list holds: the built-in photos in the phone's order,
 * then the library, newest first. */
export interface PagePhotoList {
  presets: PageImagePreset[];
  images: PageImageEntry[];
}

/** Where the list is: never asked, on the way, here, no store in this
 * integration (an older one), or a read that failed. */
export type PagePhotoListState = "idle" | "loading" | "ready" | "none" | "failed";

export interface PagePhotoStoreOptions {
  /** Base64 bytes of a content type to a URL; `pagePhotoUrl` by default. */
  makeUrl?: (base64: string, contentType: string) => string;
  /** A picked file to the base64 JPEG uploaded; `encodePagePhotoFile` by
   * default. */
  encodeFile?: (file: Blob) => Promise<string>;
  /** A picked file to the base64 PNG uploaded as an icon photo;
   * `encodeIconPhotoFile` by default. */
  encodeIcon?: (file: Blob) => Promise<string>;
  /** A photo's look from its PNG bytes, its masks made; `makePhotoLight`
   * by default. */
  makeLight?: PhotoLightMaker;
  /** An On photo's URL and decoded size from its PNG bytes; `makePhotoOn`
   * by default. */
  makeOn?: PhotoOnMaker;
  /** An On photo's tint mask URL from the Off and On PNG bytes;
   * `makePhotoOnMask` by default. */
  makeOnMask?: PhotoOnMaskMaker;
  /** Lets go of a URL `makeOn` made; `URL.revokeObjectURL` by default. */
  revokeUrl?: (url: string) => void;
}

/** What an icon photo's upload says it is for: the tile's name and its
 * entity. */
export interface IconPhotoInfo {
  label?: string;
  entityId?: string;
}

/** The longest name the store keeps with a photo. */
const MAX_LABEL = 60;

/**
 * One editor's way to the photos. Reads go through the module's memory, so
 * a photo is fetched once whichever editor asks first; `changed` is called
 * whenever something this store asked for or did moves, for a redraw.
 */
export class PagePhotoStore {
  list: PagePhotoList | undefined;
  listState: PagePhotoListState = "idle";
  /** True while an upload is out. */
  uploading = false;
  /** True while a delete is out. */
  deleting = false;
  /** The last upload's or delete's refusal, in words; cleared by the next. */
  error: string | undefined;
  private listSeq = 0;
  private readonly asked = new Set<string>();
  private readonly makeUrl: (base64: string, contentType: string) => string;
  private readonly encodeFile: (file: Blob) => Promise<string>;
  private readonly encodeIcon: (file: Blob) => Promise<string>;
  private readonly make: PhotoMakers;

  constructor(
    private readonly hass: () => HassLike | undefined,
    private readonly changed: () => void,
    options: PagePhotoStoreOptions = {},
  ) {
    this.makeUrl = options.makeUrl ?? pagePhotoUrl;
    this.encodeFile = options.encodeFile ?? encodePagePhotoFile;
    this.encodeIcon = options.encodeIcon ?? encodeIconPhotoFile;
    this.make = { light: options.makeLight ?? makePhotoLight, on: options.makeOn ?? makePhotoOn, onMask: options.makeOnMask ?? makePhotoOnMask, revoke: options.revokeUrl ?? revokeUrl };
  }

  /** The library's photos of one kind, in the list's order (newest first). A
   * photo listed with no kind is a background. */
  photosOf(kind: "background" | "icon"): PageImageEntry[] {
    return (this.list?.images ?? []).filter((image) => pagePhotoKind(image) === kind);
  }

  /** A listed photo's size in pixels, else a PNG's own once its bytes are
   * in (a picture that never reads the list still fits an icon photo), or
   * undefined while neither has it. */
  size(id: string): { width: number; height: number } | undefined {
    const image = this.list?.images.find((i) => samePagePhotoId(i.id, id));
    if (image !== undefined && image.width > 0 && image.height > 0) return { width: image.width, height: image.height };
    const png = held.get(id.toUpperCase())?.png;
    return png !== undefined && png.width > 0 && png.height > 0 ? { width: png.width, height: png.height } : undefined;
  }

  /** The look saved in an icon photo (Light Look) once its bytes are in
   * and its masks made, without asking for them; undefined for a photo with
   * none. */
  glow(id: string): OneLookPhotoLight | undefined {
    return held.get(id.toUpperCase())?.light;
  }

  /** The URL of the On photo an icon photo carries, once its bytes are in
   * and its size checked, without asking for them; undefined for a photo
   * with none. */
  onUrl(id: string): string | undefined {
    return held.get(id.toUpperCase())?.on;
  }

  /** The URL of an On photo's tint mask (`one-look/tint.ts`), made with its
   * On photo, without asking for the bytes; undefined until then, for a
   * photo with no On photo, and where it could not be made. */
  onMask(id: string): string | undefined {
    return held.get(id.toUpperCase())?.onMask;
  }

  /** Read the list again. A photo that was missing or failed is asked for
   * again on its next draw (the phone may have handed it over since). Only
   * the newest read lands. */
  async refreshList(): Promise<void> {
    const hass = this.hass();
    if (hass === undefined) return;
    const seq = ++this.listSeq;
    if (this.list === undefined) this.listState = "loading";
    for (const [id, h] of held) if (h.status === "missing" || h.status === "failed") held.delete(id);
    try {
      const reply = await listPageImages(hass);
      if (seq !== this.listSeq) return;
      this.list = {
        presets: Array.isArray(reply?.presets) ? reply.presets : [],
        images: Array.isArray(reply?.images) ? reply.images : [],
      };
      this.listState = "ready";
    } catch (error) {
      if (seq !== this.listSeq) return;
      const code = error !== null && typeof error === "object" ? (error as Record<string, unknown>).code : undefined;
      this.listState = code === "unknown_command" ? "none" : "failed";
    }
    this.changed();
  }

  /** Read the list once, the first time it is wanted. */
  ensureList(): void {
    if (this.listState === "idle") void this.refreshList();
  }

  /** Where a photo's bytes are now, without asking for them. */
  status(id: string): PagePhotoStatus | undefined {
    return held.get(id.toUpperCase())?.status;
  }

  /** The photo's URL once its bytes are in; asks for them the first time,
   * and undefined until they come (or when they never will). */
  url(id: string): string | undefined {
    const key = id.toUpperCase();
    const now = held.get(key);
    if (now?.status === "ready") return now.url;
    if (now === undefined) {
      const hass = this.hass();
      if (hass === undefined) return undefined;
      const entry: Held = { status: "loading" };
      entry.done = slot(() => fetchPageImage(hass, id)).then(
        (reply) => {
          if (typeof reply?.data !== "string" || reply.data === "") {
            entry.status = "failed";
            return;
          }
          const type = pagePhotoContentType(reply.content_type);
          // Settles once an On photo's URL or a look's masks are made, so the
          // redraw has them.
          return takeBytes(entry, this.makeUrl(reply.data, type), reply.data, type, this.make);
        },
        (error: unknown) => {
          const code = error !== null && typeof error === "object" ? (error as Record<string, unknown>).code : undefined;
          entry.status = code === "not_found" || code === "invalid" ? "missing" : "failed";
        },
      );
      held.set(key, entry);
    }
    const loading = held.get(key);
    if (loading?.status === "loading" && !this.asked.has(key)) {
      this.asked.add(key);
      void loading.done?.then(() => {
        this.asked.delete(key);
        this.changed();
      });
    }
    return undefined;
  }

  /**
   * Make the picked file the JPEG the panel uploads and store it. The id
   * Home Assistant gave (a new one, or the stored photo's with the same
   * bytes), or undefined after a refusal, whose words are in `error`. The
   * bytes are kept, so the photo draws without a read.
   */
  async upload(file: Blob): Promise<string | undefined> {
    return this.send(file, this.encodeFile, "image/jpeg", {});
  }

  /**
   * Make the picked file a tile's icon photo (`encodeIconPhotoFile`: the
   * tidy, the crop, a PNG with its clear background) and store it as kind
   * icon, with the tile's name (cut to 60 characters) and its entity when
   * given. The id, or undefined after a refusal, whose words are in
   * `error`; an integration before tile photos refuses the new keys, which
   * says to update it.
   */
  async uploadIcon(file: Blob, info: IconPhotoInfo = {}): Promise<string | undefined> {
    const label = info.label?.trim().slice(0, MAX_LABEL);
    return this.send(file, this.encodeIcon, "image/png", {
      kind: "icon",
      ...(label === undefined || label === "" ? {} : { label }),
      ...(info.entityId === undefined || info.entityId === "" ? {} : { entity_id: info.entityId }),
    });
  }

  private async send(file: Blob, encode: (file: Blob) => Promise<string>, contentType: string, info: PageImageUploadInfo): Promise<string | undefined> {
    const hass = this.hass();
    if (hass === undefined || this.uploading) return undefined;
    this.uploading = true;
    this.error = undefined;
    this.changed();
    try {
      const data = await encode(file);
      const reply = await uploadPageImage(hass, data, info);
      const id = reply.image_id;
      if (typeof id !== "string" || id === "") throw new PagePhotoError("Home Assistant did not take that. Try again.");
      if (held.get(id.toUpperCase())?.status !== "ready") {
        const entry: Held = { status: "loading" };
        held.set(id.toUpperCase(), entry);
        void takeBytes(entry, this.makeUrl(data, contentType), data, contentType, this.make).then(() => {
          if (entry.light !== undefined || entry.on !== undefined) this.changed();
        });
      }
      void this.refreshList();
      return id;
    } catch (error) {
      this.error = error instanceof PagePhotoError ? error.message : pagePhotoRefusalText(error);
      return undefined;
    } finally {
      this.uploading = false;
      this.changed();
    }
  }

  /** Delete a photo of the library. False after a refusal, whose words are
   * in `error`. */
  async remove(id: string): Promise<boolean> {
    const hass = this.hass();
    if (hass === undefined || this.deleting) return false;
    this.deleting = true;
    this.error = undefined;
    this.changed();
    try {
      await deletePageImage(hass, id);
      if (this.list !== undefined) {
        this.list = { ...this.list, images: this.list.images.filter((image) => image.id.toUpperCase() !== id.toUpperCase()) };
      }
      void this.refreshList();
      return true;
    } catch (error) {
      this.error = pagePhotoRefusalText(error);
      return false;
    } finally {
      this.deleting = false;
      this.changed();
    }
  }
}
