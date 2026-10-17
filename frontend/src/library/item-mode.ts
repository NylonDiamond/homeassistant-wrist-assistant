// Library mode: a page, status page or menu edited in the library itself,
// on its own address (`/library/pages/<id>` and so on, `shell.ts`), rather
// than on a device that has it. The three editors take a `libraryItem` and
// then read and save the one item (`library/item`, `library/item/save`)
// instead of a device's record; everything here is what they share for it.
//
// The editor still needs a device to draw on: the screen size, and the
// catalog, behavior and voice its tiles and slots read. That is the preview
// device: the home's first device of the kind picked ("Preview on", a watch
// or an iPhone thumbnail, remembered for the tab session). It only supplies
// those reads and is never written or ticked. With no device of the kind
// the editor draws on the reference watch or iPhone.
//
// A kept draft in library mode is kept under `libraryDraftKey`, never under
// a device's id, so it never meets that device's own draft, and the leave
// guards, which look at every kept draft, cover it.
// Plan: app repo docs/one_library_plan_2026-10.md.

import { css, html, svg, type TemplateResult } from "lit";
import type { HassLike, OwnerSummary, WatchConfigRecord } from "../ha-api.js";
import { isPhoneId } from "../phone-pages.js";
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

// ── Preview on ───────────────────────────────────────────────────────────
//
// Jesse, 2026-10-17: two tiny thumbnails, a plain watch and a plain iPhone,
// not a device picker. The kind is what is chosen and remembered; the
// editor quietly draws on the home's first device of that kind, which lends
// its screen size, catalog, settings and voice. With no device of that
// kind it draws on the 46 mm reference watch, or the reference iPhone, and
// the Add tile sheet says to open the iPhone app for its lists.

/** The kind of device a library item is previewed on. */
export type PreviewKind = "watch" | "iphone";

/** Where the kind picked for previews is remembered, for the session. */
export const LIBRARY_PREVIEW_KEY = "wrist-assistant-panel.library.preview-kind.v1";

/** The kind remembered for the session; a watch until one is picked. */
export function storedPreviewKind(): PreviewKind {
  try {
    return globalThis.sessionStorage?.getItem(LIBRARY_PREVIEW_KEY) === "iphone" ? "iphone" : "watch";
  } catch {
    return "watch";
  }
}

/** Remember the kind previews are drawn on. */
export function rememberPreview(kind: PreviewKind): void {
  try {
    globalThis.sessionStorage?.setItem(LIBRARY_PREVIEW_KEY, kind);
  } catch {
    // A session that keeps nothing draws on a watch again next time.
  }
}

/** The device to draw on for `kind`: the home's first device of that kind,
 * undefined when it has none (the editor then draws on the reference
 * device of the kind). */
export function previewOwner(devices: readonly OwnerSummary[], kind: PreviewKind): string | undefined {
  return devices.find((d) => isPhoneId(devices, d.owner_watch_id) === (kind === "iphone"))?.owner_watch_id;
}

/** The two thumbnails: a plain watch and a plain iPhone. */
function previewArt(kind: PreviewKind): TemplateResult {
  return kind === "watch"
    ? svg`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="6.5" y="1" width="7" height="3" rx="1"/><rect x="6.5" y="16" width="7" height="3" rx="1"/><rect x="4" y="3.5" width="12" height="13" rx="3.5"/></svg>`
    : svg`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="1" width="10" height="18" rx="2.5"/><rect class="pv-notch" x="8" y="2.2" width="4" height="1.2" rx=".6"/></svg>`;
}

/** The strip's "Preview on" picker: the watch and iPhone thumbnails, the
 * shown one pressed. A pick changes what the editor draws on and nothing
 * else. */
export function renderPreviewPicker(shown: PreviewKind, onPick: (kind: PreviewKind) => void): TemplateResult {
  const thumb = (kind: PreviewKind, title: string) => html`<button type="button" class="lib-preview-thumb ${kind} ${shown === kind ? "on" : ""}"
    aria-pressed=${shown === kind ? "true" : "false"} title=${title} aria-label=${title}
    @click=${() => { if (shown !== kind) { rememberPreview(kind); onPick(kind); } }}>${previewArt(kind)}</button>`;
  return html`<span class="lib-preview" role="group" aria-label="Preview on" title="What this is drawn on. Nothing is changed on any device.">
    <span class="lib-preview-l">Preview on</span>
    ${thumb("watch", "Preview on a watch")}
    ${thumb("iphone", "Preview on an iPhone")}
  </span>`;
}

/** The library mode line in the bar, before the picker. */
export function renderLibraryTag(): TemplateResult {
  return html`<span class="lib-mode-tag" title="Edited in the library. A save reaches every device that has it.">Library</span>`;
}

// ── the devices, in the bar ──────────────────────────────────────────────

/** The question over the ticks. */
export function onDevicesQuestion(kind: LibraryKind): string {
  return kind === "menus" ? "Which devices should use this menu?" : "Which devices do you want this on?";
}

/** The count after the ticks: how many devices have the item. */
export function onDevicesText(kind: LibraryKind, count: number): string {
  if (count === 0) return kind === "menus" ? "No device uses it yet" : "On no device yet";
  const noun = count === 1 ? "device" : "devices";
  return kind === "menus" ? `Used by ${count} ${noun}` : `On ${count} ${noun}`;
}

/**
 * The bar's device block in library mode: the question, a tick per device
 * (`renderTicks`), then the count. It stands in the bar under the top bar,
 * right after the way back, framed in the accent so it is the first thing
 * seen (Jesse, 2026-10-17: the inspector's Devices row and the menu row's
 * Used by were too easy to miss, and the plain count was still too quiet).
 * With no device yet the count is in the warning ink.
 */
export function renderBarDevices(kind: LibraryKind, count: number, ticks: TemplateResult): TemplateResult {
  return html`<div class="lib-on ${count === 0 ? "none" : ""}" role="group" aria-label=${onDevicesQuestion(kind)}>
    <span class="lib-on-l">${onDevicesQuestion(kind)}</span>${ticks}<span class="lib-on-n">${onDevicesText(kind, count)}</span>
  </div>`;
}

export const libraryModeStyles = css`
  /* Preview on, in the strip over the stage beside the watch's size and the
     zoom: the words, then the two thumbnails, the shown one filled in the
     accent. */
  .lib-preview { display: inline-flex; align-items: center; gap: 3px; padding-left: 6px; font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .lib-preview-l { margin-right: 3px; }
  .lib-preview-thumb {
    display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 24px; padding: 0;
    border: 1px solid transparent; border-radius: 6px; background: transparent; color: var(--wa-muted); cursor: pointer;
  }
  .lib-preview-thumb svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.4; }
  .lib-preview-thumb svg .pv-notch { fill: currentColor; stroke: none; }
  .lib-preview-thumb:hover { color: var(--wa-ink); background: var(--wa-hover); }
  .lib-preview-thumb:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lib-preview-thumb.on { color: var(--wa-accent, var(--wa-ink)); border-color: color-mix(in srgb, currentColor 45%, transparent); background: color-mix(in srgb, currentColor 14%, transparent); cursor: default; }
  .lib-preview-thumb.on svg { fill: color-mix(in srgb, currentColor 22%, transparent); }
  .lib-preview-thumb.on svg .pv-notch { fill: var(--wa-card); }
  .lib-mode-tag {
    display: inline-flex; align-items: center; min-height: 22px; padding: 0 8px; border-radius: 999px;
    border: 1px solid var(--wa-line); color: var(--wa-muted); font-size: 11.5px; font-weight: 600;
  }
  /* The device block in the bar: a framed strip in the accent, the question
     in bold, the chips a size up from the cards', then the count. It wraps
     when the bar is narrow. */
  .lib-on {
    display: flex; align-items: center; flex-wrap: wrap; gap: 6px 12px; min-width: 0; flex: 0 1 auto;
    margin-left: 6px; padding: 5px 12px; border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--wa-accent, var(--wa-ink)) 40%, transparent);
    background: color-mix(in srgb, var(--wa-accent, var(--wa-ink)) 9%, transparent);
  }
  .lib-on-l { font-size: 13px; font-weight: 700; color: var(--wa-ink); white-space: nowrap; }
  .lib-on-n { font-size: 12px; font-weight: 600; color: var(--wa-muted); white-space: nowrap; }
  .lib-on.none .lib-on-n { color: var(--wa-amber); }
  .lib-on .lt-ticks { flex-direction: row; align-items: center; flex-wrap: wrap; gap: 4px 10px; }
  .lib-on .lt-chips { gap: 6px; }
  .lib-on .lt-chip { height: 28px; padding: 0 11px 0 9px; font-size: 12.5px; border-color: color-mix(in srgb, var(--dc, var(--wa-muted)) 55%, transparent); }
  .lib-on .lt-chip.off { color: var(--wa-ink); }
  .lib-on .lt-box { width: 13px; height: 13px; }
  .wa-bar.stacked .lib-on { order: 3; flex: 1 1 100%; margin-left: 0; }
`;
