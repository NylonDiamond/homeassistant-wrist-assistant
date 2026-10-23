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

import { css, html, nothing, svg, type TemplateResult } from "lit";
import { keyed } from "lit/directives/keyed.js";
import type { HassLike, OwnerSummary, WatchConfigRecord } from "../ha-api.js";
import { isPhoneId } from "../phone-pages.js";
import { type LibraryKind, type LibraryObject, fetchLibraryItem, saveLibraryItem } from "./client.js";
import { type Library, libraryItem, libraryMenu } from "./model.js";
import { SAVED_FLASH_MS } from "./board.js";
import type { LibraryStore } from "./store.js";

/** One item of the library, as an editor's library mode is handed it. */
export interface LibraryItemRef {
  kind: LibraryKind;
  id: string;
  /** The device whose focused board opened it, by owner id: the editor rings
   * it in the strip, and Back goes to that board. */
  from?: string;
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

/** The device to draw on for `kind`: the first of `prefer` of that kind
 * (the device the editor was opened from, then the devices that have the
 * item), else the home's first device of that kind, undefined when it has
 * none (the editor then draws on the reference device of the kind). */
export function previewOwner(devices: readonly OwnerSummary[], kind: PreviewKind, prefer: readonly (string | undefined)[] = []): string | undefined {
  const ofKind = (d: OwnerSummary) => isPhoneId(devices, d.owner_watch_id) === (kind === "iphone");
  for (const id of prefer) {
    if (id === undefined) continue;
    const d = devices.find((o) => o.owner_watch_id.toUpperCase() === id.toUpperCase());
    if (d !== undefined && ofKind(d)) return d.owner_watch_id;
  }
  return devices.find(ofKind)?.owner_watch_id;
}

/** The devices that have a library item, by owner id; undefined before the
 * library is read. */
export function libraryOwners(lib: Library | undefined, ref: LibraryItemRef): readonly string[] | undefined {
  if (lib === undefined) return undefined;
  return (ref.kind === "menus" ? libraryMenu(lib, ref.id)?.owners : libraryItem(lib, ref.kind, ref.id)?.owners) ?? [];
}

/** The kind an item opens previewed on: the kind of the device it was
 * opened from; else the one kind every device that has it is; else the kind
 * remembered for the session. */
export function startPreviewKind(devices: readonly OwnerSummary[], ref: LibraryItemRef, owners: readonly string[] | undefined): PreviewKind {
  const kindOf = (id: string): PreviewKind | undefined => {
    const d = devices.find((o) => o.owner_watch_id.toUpperCase() === id.toUpperCase());
    return d === undefined ? undefined : isPhoneId(devices, d.owner_watch_id) ? "iphone" : "watch";
  };
  const from = ref.from === undefined ? undefined : kindOf(ref.from);
  if (from !== undefined) return from;
  const kinds = new Set((owners ?? []).map(kindOf).filter((k): k is PreviewKind => k !== undefined));
  if (kinds.size === 1) return [...kinds][0]!;
  return storedPreviewKind();
}

/** The two thumbnails: a plain watch and a plain iPhone. */
function previewArt(kind: PreviewKind): TemplateResult {
  return kind === "watch"
    ? svg`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="6.5" y="1" width="7" height="3" rx="1"/><rect x="6.5" y="16" width="7" height="3" rx="1"/><rect x="4" y="3.5" width="12" height="13" rx="3.5"/></svg>`
    : svg`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="1" width="10" height="18" rx="2.5"/><rect class="pv-notch" x="8" y="2.2" width="4" height="1.2" rx=".6"/></svg>`;
}

/** The watch and the iPhone together, for Side by side. */
function sideBySideArt(): TemplateResult {
  return svg`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="1" y="5.5" width="7.5" height="9" rx="2.4"/><rect x="11" y="2" width="7.5" height="16" rx="2"/></svg>`;
}

/** Side by side in the picker: whether it is on, and its pick. */
export interface SideBySidePick {
  on: boolean;
  pick: () => void;
}

/** The strip's "Preview on" picker: the watch and iPhone thumbnails, the
 * shown one pressed, and with `both` a third, Side by side, which draws the
 * other kind too. A pick changes what the editor draws on and nothing
 * else. */
export function renderPreviewPicker(shown: PreviewKind, onPick: (kind: PreviewKind) => void, both?: SideBySidePick): TemplateResult {
  const duo = both?.on === true;
  const thumb = (kind: PreviewKind, title: string) => {
    const on = shown === kind && !duo;
    return html`<button type="button" class="lib-preview-thumb ${kind} ${on ? "on" : ""}"
      aria-pressed=${on ? "true" : "false"} title=${title} aria-label=${title}
      @click=${() => { if (!on) { rememberPreview(kind); onPick(kind); } }}>${previewArt(kind)}</button>`;
  };
  return html`<span class="lib-preview" role="group" aria-label="Preview on" title="What this is drawn on. Nothing is changed on any device.">
    <span class="lib-preview-l">Preview on</span>
    ${thumb("watch", "Preview on a watch")}
    ${thumb("iphone", "Preview on an iPhone")}
    ${both === undefined ? nothing : html`<button type="button" class="lib-preview-thumb duo ${duo ? "on" : ""}"
      aria-pressed=${duo ? "true" : "false"} title="Side by side: a watch and an iPhone" aria-label="Side by side: a watch and an iPhone"
      @click=${() => { if (!duo) both.pick(); }}>${sideBySideArt()}</button>`}
  </span>`;
}

/** Whether an item opens Side by side: the home has a watch and an iPhone,
 * and the item is on both kinds or on no device yet. On one kind only, it
 * opens on that kind alone. */
export function startSideBySide(devices: readonly OwnerSummary[], owners: readonly string[] | undefined, phones: boolean): boolean {
  if (!phones) return false;
  const kinds = new Set(devices.map((d) => isPhoneId(devices, d.owner_watch_id)));
  if (kinds.size < 2) return false;
  const has = new Set((owners ?? []).flatMap((id) => {
    const d = devices.find((o) => o.owner_watch_id.toUpperCase() === id.toUpperCase());
    return d === undefined ? [] : [isPhoneId(devices, d.owner_watch_id)];
  }));
  return has.size !== 1;
}

/** The other kind of device. */
export function otherPreviewKind(kind: PreviewKind): PreviewKind {
  return kind === "watch" ? "iphone" : "watch";
}

/** The label over one preview of Side by side: the kind, then the devices
 * of that kind that have the item ("Watch · Jesse Apple Watch"), or that
 * none of them has it. */
export function previewLabel(kind: PreviewKind, names: readonly string[]): string {
  const word = kind === "watch" ? "Watch" : "iPhone";
  if (names.length === 0) return `${word} · on no ${kind === "watch" ? "watch" : "iPhone"} yet`;
  return `${word} · ${names.join(", ")}`;
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
 * The device strip: the question, a tick per device (`renderTicks`), then
 * the count. It stands under the canvas head, over the preview, in every
 * editor and in both modes, framed in the accent so it is found in the same
 * place whichever thing is open (Jesse, 2026-10-17: the inspector's Devices
 * row, the menu row's Used by and the bar's block each stood somewhere
 * else, and were too easy to miss). With no device yet the count is in the
 * warning ink. `where` is only ever "stage" now.
 */
export function renderBarDevices(kind: LibraryKind, count: number, ticks: TemplateResult, savedAt?: number): TemplateResult {
  // "over-stage", not "stage": the complication editor's drawing stage owns
  // that class.
  return html`<div class="lib-on over-stage ${count === 0 ? "none" : ""}" role="group" aria-label=${onDevicesQuestion(kind)}>
    <span class="lib-on-l">${onDevicesQuestion(kind)}</span>${ticks}<span class="lib-on-n">${onDevicesText(kind, count)}</span>${renderStripSaved(savedAt)}
  </div>`;
}

/** "Saved" beside the strip for a moment after a tick's write lands
 * (`LibraryStore.savedStamp`), never on the Save button: a tick saves at
 * once, an edit waits for Save. Keyed on the stamp, so each write plays the
 * fade again; a stamp older than the flash draws nothing. */
export function renderStripSaved(savedAt: number | undefined, now = Date.now()): TemplateResult | typeof nothing {
  if (savedAt === undefined || now - savedAt >= SAVED_FLASH_MS) return nothing;
  return html`${keyed(savedAt, html`<span class="lib-saved" role="status" style=${`animation-delay:${Math.max(0, SAVED_FLASH_MS - 400 - (now - savedAt))}ms`}>Saved</span>`)}`;
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
  .lib-preview-thumb.duo { width: 30px; }
  /* Side by side: the edited preview and the other kind's, each under its
     label and over its differences line, watch first. They wrap one under
     the other when the canvas is too narrow for both. */
  .lib-duo { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: 18px 28px; width: 100%; }
  .lib-duo-side { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 0; }
  .lib-duo-side.watch { order: 0; }
  .lib-duo-side.iphone { order: 1; }
  .lib-duo-l {
    display: inline-flex; align-items: center; gap: 6px; max-width: 100%; font-size: 12.5px; font-weight: 600; color: var(--wa-ink);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .lib-duo-l .lib-duo-tag { font-size: 11px; font-weight: 600; color: var(--wa-muted); }
  .lib-duo-other {
    position: relative; padding: 0; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; border-radius: 12px;
  }
  .lib-duo-other > * { pointer-events: none; }
  .lib-duo-other:hover { box-shadow: 0 0 0 2px color-mix(in srgb, var(--wa-accent, var(--wa-ink)) 45%, transparent); }
  .lib-duo-other:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* The differences line: only what this kind does otherwise. */
  .lib-diff { max-width: 340px; font-size: 12px; line-height: 1.4; color: var(--wa-muted); text-align: center; }
  .lib-mode-tag {
    display: inline-flex; align-items: center; min-height: 22px; padding: 0 8px; border-radius: 999px;
    border: 1px solid var(--wa-line); color: var(--wa-muted); font-size: 11.5px; font-weight: 600;
  }
  /* The device strip under the canvas head (renderBarDevices): framed in
     the accent, the question in bold, the chips a size up from the cards',
     then the count. It wraps when the canvas card is narrow: the chips take
     a line of their own under the question, and only when they cannot all
     fit even that line do the unticked ones fold into "+ Add to a device"
     (the chip row measures it, chip-row.ts). */
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
  /* An untick's question (ticks.ts) takes a line of its own under the chips. */
  .lib-on .lt-ask { flex: 1 1 100%; max-width: none; }
  /* Its place under the canvas head, over the stage: the canvas card's
     width, one line when it fits, the question first. */
  .lib-on.over-stage { flex: none; margin: 6px 6px 0; padding: 7px 12px; box-sizing: border-box; }
  .lib-on.over-stage .lt-ticks { flex: 1 1 auto; }
  .lib-on.over-stage .lib-on-n { margin-left: auto; }
  /* "Saved" after the count, fading out once the flash is over. */
  .lib-saved {
    font-size: 12px; font-weight: 600; color: var(--wa-green); white-space: nowrap;
    animation: lib-saved-out .4s ease-in forwards;
  }
  @keyframes lib-saved-out { to { opacity: 0; } }
`;
