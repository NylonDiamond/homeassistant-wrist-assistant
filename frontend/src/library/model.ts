// The words of Home's Library screens for the home's photos and parts,
// without any drawing: what each row says under its name, why a photo
// cannot go yet, and the questions before a delete. The screens are
// `photos-screen.ts` and `parts-screen.ts`; this is the part a test reaches.

import type { OwnerSummary, PageImageEntry } from "../ha-api.js";
import type { SavedPart } from "../parts.js";
import { agoWords } from "../send-state.js";
import { watchName } from "../watch-settings.js";

/** A size in words: "640 bytes", "84.2 KB". */
export function libraryBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  return bytes < 1000 ? `${Math.round(bytes)} bytes` : `${Number((bytes / 1000).toFixed(1))} KB`;
}

/** How long ago, from an ISO time, "3 days ago"; "" for none. */
export function libraryAgo(iso: string | null | undefined, now = Date.now()): string {
  const at = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(at) ? "" : agoWords(Math.max(0, (now - at) / 1000));
}

// ── photos ───────────────────────────────────────────────────────────────

/** The devices whose pages show a photo, by the names the screens give
 * them. A device the list does not hold any more is "another device". */
export function photoUsers(entry: Pick<PageImageEntry, "used_by">, owners: readonly OwnerSummary[]): string[] {
  return (entry.used_by ?? []).map((id) => {
    const owner = owners.find((o) => o.owner_watch_id === id);
    return owner === undefined ? "another device" : watchName(owner, owners);
  });
}

/** What a photo's card says about its use: "Not on any page", "On
 * Jesse's Watch", "On Jesse's Watch and Chen's iPhone", "On 3 devices". */
export function photoUseText(entry: Pick<PageImageEntry, "used_by">, owners: readonly OwnerSummary[]): string {
  const names = photoUsers(entry, owners);
  if (names.length === 0) return "Not on any page";
  if (names.length === 1) return `On ${names[0]!}`;
  if (names.length === 2) return `On ${names[0]!} and ${names[1]!}`;
  return `On ${names.length} devices`;
}

/** A photo's facts line: its size in points and bytes, and when it came. */
export function photoFactsText(entry: Pick<PageImageEntry, "width" | "height" | "bytes" | "added_at">, now = Date.now()): string {
  const ago = libraryAgo(entry.added_at, now);
  return [`${entry.width} × ${entry.height}`, libraryBytes(entry.bytes), ago === "" ? "" : `added ${ago}`].filter((w) => w !== "").join(" · ");
}

/** Why a photo's Delete is off, or undefined when it may go: Home
 * Assistant refuses a photo a saved page still shows. */
export function photoDeleteBlocked(entry: Pick<PageImageEntry, "used_by">): string | undefined {
  return (entry.used_by ?? []).length > 0 ? "A page shows this photo. Pick another background on that page first." : undefined;
}

export const PHOTO_DELETE_QUESTION = "Delete this photo? It cannot be brought back.";

/** The screen's line under its title. */
export const PHOTOS_LEAD = "The pictures behind your pages, kept once for the whole home. A photo no page shows goes by itself a week later; Delete takes it now.";
export const PHOTOS_EMPTY_TEXT = "No photos yet. Add one from a page's Background in the page editor.";
export const PHOTOS_UPDATE_TEXT = "Update the integration to see the home's photos here.";

// ── parts ────────────────────────────────────────────────────────────────

/** A part's size: the bytes of its text. */
export function partBytes(part: Pick<SavedPart, "text">): number {
  return new TextEncoder().encode(part.text).length;
}

/** A part's line under its name: "Saved 3 days ago · 2.4 KB". */
export function partFactsText(part: Pick<SavedPart, "text" | "updated_at">, now = Date.now()): string {
  const ago = libraryAgo(part.updated_at, now);
  return [ago === "" ? "" : `Saved ${ago}`, libraryBytes(partBytes(part))].filter((w) => w !== "").join(" · ");
}

export function partDeleteQuestion(name: string): string {
  return `Delete the part "${name}"? Complications it went into keep their layers.`;
}

export const PARTS_LEAD = "Layers saved from a complication with Save to parts, to drop into another one from the Saved parts tab of + Add.";
export const PARTS_EMPTY_TEXT = "No parts yet. Pick layers in a complication's Layers list and press Save to parts.";
