// Library mode: a page, status page or menu edited in the library itself,
// on its own address (`/library/pages/<id>` and so on, `shell.ts`), rather
// than on a device that has it. The three editors take a `libraryItem` and
// then read and save the one item (`library/item`, `library/item/save`)
// instead of a device's record; everything here is what they share for it.
//
// The editor still needs a device to draw on: the screen size, and the
// catalog, behavior and voice its tiles and slots read. That is the preview
// device ("Preview as"), any device in the home, remembered for the tab
// session. It only supplies those reads and is never written or ticked. In a
// home with no device at all the editor draws on a plain 46 mm watch.
//
// A kept draft in library mode is kept under `libraryDraftKey`, never under
// a device's id, so it never meets that device's own draft, and the leave
// guards, which look at every kept draft, cover it.
// Plan: app repo docs/one_library_plan_2026-10.md.

import { css, html, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary, WatchConfigRecord } from "../ha-api.js";
import { isPhoneId } from "../phone-pages.js";
import { watchName } from "../watch-settings.js";
import { type LibraryKind, type LibraryObject, fetchLibraryItem, saveLibraryItem } from "./client.js";
import { type Library, libraryItem, libraryMenu } from "./model.js";
import type { LibraryStore } from "./store.js";

/** One item of the library, as an editor's library mode is handed it. */
export interface LibraryItemRef {
  kind: LibraryKind;
  id: string;
}

/** The key a library mode draft is kept under: "library:pages:<id>". It can
 * never be an owner id. */
export function libraryDraftKey(ref: LibraryItemRef): string {
  return `library:${ref.kind}:${ref.id}`;
}

/** The same item (ids compared ignoring case, as the library compares them). */
export function sameLibraryItem(a: LibraryItemRef | undefined, b: LibraryItemRef | undefined): boolean {
  if (a === undefined || b === undefined) return a === b;
  return a.kind === b.kind && a.id.toUpperCase() === b.id.toUpperCase();
}

/** An item read as a record, so the editors' drawing stays as it is. It has
 * no delivery: nothing in library mode draws one. */
export function libraryRecord(kind: LibraryKind, reply: { document: LibraryObject; revision: number }): WatchConfigRecord {
  return {
    kind,
    revision: reply.revision,
    document: reply.document,
    hash: null,
    updated_at: null,
    updated_by: null,
    delivered_revision: 0,
    delivered_at: null,
  };
}

/** Read one item as a record. */
export async function fetchLibraryRecord(hass: HassLike, ref: LibraryItemRef): Promise<WatchConfigRecord & { name?: string }> {
  const reply = await fetchLibraryItem(hass, ref.kind, ref.id);
  return { ...libraryRecord(ref.kind, reply), ...(typeof reply.name === "string" ? { name: reply.name } : {}) };
}

/** The save and fetch a draft's save loop runs in library mode, in the
 * shape of its record save: a `conflict` rejects as it came (its code is
 * what the loop reads), and the fetch reads the item again to rebase on. The
 * save goes through the shared store when there is one, so the tabs read
 * the item's new revision. */
export function libraryItemIO<D extends object>(hass: HassLike, store: LibraryStore | undefined, ref: LibraryItemRef): {
  save: (baseRevision: number, document: D) => Promise<{ revision: number }>;
  fetch: () => Promise<{ revision: number; document: unknown }>;
} {
  return {
    save: (base, document) => store !== undefined
      ? store.saveItem(ref.kind, ref.id, base, document as LibraryObject)
      : saveLibraryItem(hass, ref.kind, ref.id, base, document as LibraryObject),
    fetch: async () => {
      const reply = await fetchLibraryItem(hass, ref.kind, ref.id);
      return { revision: reply.revision, document: reply.document };
    },
  };
}

/** The item's revision as the summary last read it, or undefined (an older
 * integration, or an item the summary does not list). An editor whose record
 * is older reads the item again: an edit made elsewhere. */
export function summaryRevision(lib: Library | undefined, ref: LibraryItemRef): number | undefined {
  if (lib === undefined) return undefined;
  return ref.kind === "menus" ? libraryMenu(lib, ref.id)?.revision : libraryItem(lib, ref.kind, ref.id)?.revision;
}

/** What the library mode delete question says, for an item `devices`
 * devices have. */
export function libraryDeleteText(devices: number): string {
  const opened = "with every tile and menu slot that opened it";
  if (devices <= 0) return `No device has it. It is deleted for good, ${opened}.`;
  const from = devices === 1 ? "the device that has it" : `all ${devices} devices that have it`;
  return `It goes from ${from} too, ${opened}. This cannot be undone.`;
}

// ── Preview as ───────────────────────────────────────────────────────────

/** Where the device picked for previews is remembered, for the session. */
export const LIBRARY_PREVIEW_KEY = "wrist-assistant-panel.library.preview.v1";

function storedPreview(): string | undefined {
  try {
    return globalThis.sessionStorage?.getItem(LIBRARY_PREVIEW_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

/** Remember the device a preview is drawn on. */
export function rememberPreview(ownerId: string): void {
  try {
    globalThis.sessionStorage?.setItem(LIBRARY_PREVIEW_KEY, ownerId);
  } catch {
    // A session that keeps nothing picks the first watch again next time.
  }
}

/** The device to draw on: the one shown while it is still in the home, else
 * the one remembered, else the first watch, else the first device.
 * Undefined in a home with no device. */
export function previewOwner(devices: readonly OwnerSummary[], shown: string | undefined): string | undefined {
  const has = (id: string | undefined) => id !== undefined && devices.some((d) => d.owner_watch_id === id);
  if (has(shown)) return shown;
  const stored = storedPreview();
  if (has(stored)) return stored;
  return (devices.find((d) => !isPhoneId(devices, d.owner_watch_id)) ?? devices[0])?.owner_watch_id;
}

/** The words for a home with no device to preview on. */
export const PREVIEW_NONE_TEXT = "Preview on a 46 mm watch";

/** The bar's "Preview as" picker: every device in the home. It changes what
 * the editor draws on and nothing else. */
export function renderPreviewPicker(devices: readonly OwnerSummary[], shown: string | undefined, onPick: (ownerId: string) => void): TemplateResult {
  if (devices.length === 0) return html`<span class="lib-preview lib-preview-none">${PREVIEW_NONE_TEXT}</span>`;
  return html`<label class="lib-preview" title="The device this is drawn on. Nothing is changed on it.">
    <span class="lib-preview-l">Preview as</span>
    <select class="lib-preview-pick" aria-label="Preview as" @change=${(e: Event) => {
      const id = (e.target as HTMLSelectElement).value;
      rememberPreview(id);
      onPick(id);
    }}>
      ${devices.map((d) => html`<option value=${d.owner_watch_id} ?selected=${d.owner_watch_id === shown}>${watchName(d, devices)}</option>`)}
    </select>
  </label>`;
}

/** The library mode line in the bar, before the picker. */
export function renderLibraryTag(): TemplateResult {
  return html`<span class="lib-mode-tag" title="Edited in the library. A save reaches every device that has it.">Library</span>`;
}

export const libraryModeStyles = css`
  .lib-preview { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--wa-muted); }
  .lib-preview-none { font-style: italic; }
  .lib-preview-pick {
    min-height: 28px; max-width: 220px; padding: 0 6px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
    background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 12.5px;
  }
  .lib-mode-tag {
    display: inline-flex; align-items: center; min-height: 22px; padding: 0 8px; border-radius: 999px;
    border: 1px solid var(--wa-line); color: var(--wa-muted); font-size: 11.5px; font-weight: 600;
  }
`;
