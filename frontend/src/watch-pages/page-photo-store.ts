// The home's page photos as the page editor reaches them (part 4d batch 6,
// 6e): the list of built-in photos and the library, each photo's bytes
// fetched once by id and kept in memory for the session, an upload that
// scales and compresses the picked file in the browser first, and a delete.
//
// Home Assistant's own store (`page_images_store.py`) makes the ids, so
// nothing here needs `crypto.randomUUID`, which a plain http page lacks.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md, "4d batch 6".

import {
  type HassLike,
  type PageImageEntry,
  type PageImagePreset,
  deletePageImage,
  fetchPageImage,
  listPageImages,
  uploadPageImage,
} from "../ha-api.js";
import { PAGE_PHOTO_UNREADABLE_TEXT, pagePhotoRefusalText, stepDownPagePhoto } from "./page-photo.js";

/** Where a photo's bytes are: on the way, here, not in the store, or a read
 * that failed (tried again on the next list). */
export type PagePhotoStatus = "loading" | "ready" | "missing" | "failed";

interface Held {
  status: PagePhotoStatus;
  url?: string;
  done?: Promise<void>;
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

/** A JPEG in base64 as a URL a style can name: a blob URL where the browser
 * makes them (short, so a page's many thumbs carry no copy of the bytes),
 * else a data URL. */
export function pagePhotoUrl(base64: string): string {
  if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function" && typeof Blob !== "undefined" && typeof atob === "function") {
    const text = atob(base64);
    const bytes = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: "image/jpeg" }));
  }
  return `data:image/jpeg;base64,${base64}`;
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
  /** Base64 JPEG to a URL; `pagePhotoUrl` by default. */
  makeUrl?: (base64: string) => string;
  /** A picked file to the base64 JPEG uploaded; `encodePagePhotoFile` by
   * default. */
  encodeFile?: (file: Blob) => Promise<string>;
}

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
  private readonly makeUrl: (base64: string) => string;
  private readonly encodeFile: (file: Blob) => Promise<string>;

  constructor(
    private readonly hass: () => HassLike | undefined,
    private readonly changed: () => void,
    options: PagePhotoStoreOptions = {},
  ) {
    this.makeUrl = options.makeUrl ?? pagePhotoUrl;
    this.encodeFile = options.encodeFile ?? encodePagePhotoFile;
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
          entry.url = this.makeUrl(reply.data);
          entry.status = "ready";
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
    const hass = this.hass();
    if (hass === undefined || this.uploading) return undefined;
    this.uploading = true;
    this.error = undefined;
    this.changed();
    try {
      const data = await this.encodeFile(file);
      const reply = await uploadPageImage(hass, data);
      const id = reply.image_id;
      if (typeof id !== "string" || id === "") throw new PagePhotoError("Home Assistant did not take that. Try again.");
      if (held.get(id.toUpperCase())?.status !== "ready") held.set(id.toUpperCase(), { status: "ready", url: this.makeUrl(data) });
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
