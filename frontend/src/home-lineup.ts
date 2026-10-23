// `wa-home-lineup`: the part of Home's lineup for one device that comes
// from the library (plan step 6): its pages in swipe order with their
// pictures (hidden ones faded), its status pages, and the two menus it
// uses. Its own chunk, loaded by `home-lineup-hook.ts`, since the library
// store and the pictures are not in the panel's first download.

import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import type { HassLike } from "./ha-api.js";
import { type LineupDrag, type LineupGroup, type LineupLine, homeLineupStyles, renderLineupGroup } from "./home-lineup-look.js";
import type { LibraryKind, MenuUnit } from "./library/client.js";
import { MENU_UNIT_TITLES, itemsFor, menuFor, sameId, type Library, type LibraryPick } from "./library/model.js";
import { renderPageRowPicture, renderStatusRowPicture, rowPictureStyles } from "./library/row-picture.js";
import { LibraryController } from "./library/store.js";
import { libraryTicksStyles, renderTickAsk } from "./library/ticks.js";
import type { IconProvider } from "./renderer.js";
import { watchFrameStyles } from "./watch-frame.js";
import { dropChange, inOrder, movedOrder } from "./watch-pages/all-pages-model.js";
import { changeDevicePicks, picksDirtyText } from "./watch-pages/all-pages-picks.js";
import { picksIO } from "./watch-pages/all-pages-io.js";
import { keptWatchPagesDraft } from "./watch-pages/kept.js";
import { type UntickAsk, askUntick, tickItem } from "./watch-pages/library-editing-io.js";
import type { WatchPage } from "./watch-pages/model.js";
import { watchPagePreviewStyles } from "./watch-pages/preview.js";
import { watchCommandError } from "./watch-pages/save-note.js";
import { keptStatusPagesDraft } from "./watch-status-pages/draft.js";
import { statusPagesViewStyles } from "./watch-status-pages/view.js";

/** Pictures are drawn again at most this often for a new `hass`. */
const STATES_EVERY_MS = 2000;
/** A page card's picture: as wide as its card lets it be (`fitPictures`),
 * between these, in CSS pixels. An iPhone's is `PHONE_PICTURE_RATIO` of
 * that, so its taller page keeps the cards one height. */
const PAGE_PICTURE_MIN = 56;
const PAGE_PICTURE_MAX = 200;
const PHONE_PICTURE_RATIO = 40 / 56;
/** The share of a page card's width its picture takes. */
const PAGE_PICTURE_SHARE = 0.8;
const STATUS_PICTURE_W = 34;

export class WaHomeLineup extends LitElement {
  @property({ attribute: false }) ownerId = "";
  @property({ attribute: false }) kind: "watch" | "iphone" = "watch";
  /** The home keeps phone pages: an iPhone has pages, status pages and
   * menus. Without them an iPhone has none, and nothing is drawn. */
  @property({ attribute: false }) phones = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;
  /** Edit: open the thing in its tab's one editor, from this device. */
  @property({ attribute: false }) onEdit?: (kind: LibraryKind, id: string) => void;
  /** Change: that tab's board, focused on this device. */
  @property({ attribute: false }) onChange?: (kind: LibraryKind) => void;
  /** The device's name, for what a move or a remove says. */
  @property({ attribute: false }) deviceName = "";

  /** The line being dragged, and the one it is over. */
  @state() private dragged?: { kind: OrderedKind; id: string };
  @state() private overId?: string;
  /** The order a drag asked for, shown until the read after its save. */
  @state() private orderAsked?: { kind: OrderedKind; ids: string[] };
  /** A move or a remove is on its way: nothing else starts. */
  @state() private busy?: string;
  /** A remove's question, when it would clear menu slots or taps. */
  @state() private ask?: UntickAsk;
  /** What the last move or remove did, under its group; a remove can be undone. */
  @state() private said?: { kind: OrderedKind; tone: "ok" | "warn" | "err"; text: string; undo?: () => void };

  private hassNow?: HassLike;
  private hassDrawnAt = 0;
  /** The page pictures' width, fitted to the cards (`fitPictures`). */
  private pageW = PAGE_PICTURE_MIN;
  private seen?: ResizeObserver;

  private readonly lib = new LibraryController(this, () => this.hassNow, () => (this.ownerId === "" ? [] : [this.ownerId]));

  get hass(): HassLike | undefined {
    return this.hassNow;
  }

  set hass(value: HassLike | undefined) {
    const first = this.hassNow === undefined;
    this.hassNow = value;
    const now = Date.now();
    if (first || now - this.hassDrawnAt >= STATES_EVERY_MS) {
      this.hassDrawnAt = now;
      this.requestUpdate();
    }
  }

  protected override render(): TemplateResult {
    if (this.kind === "iphone" && !this.phones) return html``;
    const library = this.lib.library;
    if (library === undefined) {
      const state = this.lib.readState;
      return html`<p class="hl-empty">${state === "failed" ? (this.lib.store?.readError ?? "Could not read the library.") : state === "unsupported" ? "This integration has no library to read." : "Reading the pages…"}</p>`;
    }
    return html`<div class="hl-groups">${lineupGroups(library, this.ownerId, this.kind, {
      ...(this.hassNow === undefined ? {} : { hass: this.hassNow }),
      ...(this.icons === undefined ? {} : { icons: this.icons }),
      tick: this.iconsTick,
      pageWidth: this.pageW,
      arrange: {
        order: (kind) => (this.orderAsked?.kind === kind ? this.orderAsked.ids : undefined),
        drag: (kind, pick, index, ids) => this.lineDrag(kind, pick, index, ids),
        remove: (kind, pick, next) => ({
          title: `Take ${pick.entry.name} off ${this.device}`,
          busy: this.busy !== undefined,
          onClick: () => void this.takeOff(kind, pick, next),
        }),
        under: (kind) => this.renderUnder(kind),
      },
      onEdit: (kind, id) => this.onEdit?.(kind, id),
      onChange: (kind) => this.onChange?.(kind),
    }).map(renderLineupGroup)}</div>`;
  }

  /** A device's name for the words, or "this watch". */
  private get device(): string {
    return this.deviceName || `this ${this.kind === "iphone" ? "iPhone" : "watch"}`;
  }

  /** Under a group: a remove's question, or what the last change did. */
  private renderUnder(kind: OrderedKind): TemplateResult | undefined {
    const ask = this.ask;
    if (ask !== undefined && ask.kind === kind) {
      return renderTickAsk({ ownerId: ask.ownerId, text: ask.text, onRemove: () => void this.removeAsked(ask), onCancel: () => { this.ask = undefined; } });
    }
    const said = this.said;
    if (said === undefined || said.kind !== kind) return undefined;
    return html`<p class="hl-note ${said.tone}" role=${said.tone === "err" ? "alert" : "status"}>
      <span>${said.text}</span>
      ${said.undo === undefined ? nothing : html`<button type="button" ?disabled=${this.busy !== undefined} @click=${said.undo}>Undo</button>`}
    </p>`;
  }

  /** A line's drag in its kind's order: drop it on another line, or Alt and
   * the arrow keys. Off while a change is on its way. */
  private lineDrag(kind: OrderedKind, pick: LibraryPick, index: number, ids: readonly string[]): LineupDrag {
    const on = this.busy === undefined;
    const dragging = this.dragged !== undefined && this.dragged.kind === kind;
    const from = dragging ? ids.findIndex((id) => sameId(id, this.dragged!.id)) : -1;
    const over = dragging && this.overId !== undefined && sameId(this.overId, pick.id) && from !== index;
    const end = () => { this.dragged = undefined; this.overId = undefined; };
    return {
      on,
      dragging: dragging && sameId(this.dragged!.id, pick.id),
      over,
      after: over && from < index,
      onStart: (e) => {
        if (!on) return;
        this.dragged = { kind, id: pick.id };
        e.dataTransfer?.setData("text/plain", pick.id);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
      },
      onOver: (e) => {
        if (this.dragged?.kind !== kind) return;
        e.preventDefault();
        if (this.overId !== pick.id) this.overId = pick.id;
      },
      onDrop: (e) => {
        if (this.dragged?.kind !== kind) return;
        e.preventDefault();
        const id = this.dragged.id;
        end();
        // The dragged line moves, not the one it lands on.
        const change = dropChange(ids, id, pick.id);
        if (change !== undefined) void this.move(kind, change, ids);
      },
      onEnd: end,
      onKey: (e) => {
        if (!e.altKey || !on) return;
        const back = e.key === "ArrowUp" || e.key === "ArrowLeft";
        const forth = e.key === "ArrowDown" || e.key === "ArrowRight";
        if (!back && !forth) return;
        e.preventDefault();
        if (back && index > 0) void this.move(kind, { id: pick.id, before: ids[index - 1]! }, ids);
        if (forth && index < ids.length - 1) void this.move(kind, { id: pick.id, before: ids[index + 2] ?? null }, ids);
      },
    };
  }

  /** Move a pick in the device's order: one save of its record, as the
   * focused board does, then the library read again. Not while the
   * device's editor holds unsaved edits, which the save would land under. */
  private async move(kind: OrderedKind, change: { id: string; before: string | null }, ids: readonly string[]): Promise<void> {
    const hass = this.hassNow;
    const store = this.lib.store;
    if (hass === undefined || store === undefined || this.busy !== undefined) return;
    const dirty = (kind === "status_pages" ? keptStatusPagesDraft(this.ownerId)?.dirty : keptWatchPagesDraft(this.ownerId)?.dirty) ?? false;
    if (dirty) {
      this.said = { kind, tone: "warn", text: picksDirtyText(kind, this.device) };
      return;
    }
    this.busy = change.id;
    this.said = undefined;
    this.ask = undefined;
    this.orderAsked = { kind, ids: movedOrder([...ids], change.id, change.before) };
    try {
      const result = await changeDevicePicks(picksIO(hass), this.ownerId, kind, change);
      if (!result.ok) this.said = { kind, tone: "err", text: `Not moved on ${this.device}: ${result.message.replace(/\.$/, "")}.` };
    } catch (err) {
      this.said = { kind, tone: "err", text: watchCommandError(err).message };
    }
    await store.refresh();
    this.orderAsked = undefined;
    this.busy = undefined;
  }

  /** Take a pick off the device. When that would clear menu slots or taps
   * that open it, ask first (`askUntick`); else it goes at once, with Undo. */
  private async takeOff(kind: OrderedKind, pick: LibraryPick, next: string | null): Promise<void> {
    const store = this.lib.store;
    if (store === undefined || this.busy !== undefined) return;
    this.busy = pick.id;
    this.said = undefined;
    this.ask = undefined;
    const names = { item: pick.entry.name, device: this.device };
    try {
      this.ask = await askUntick(this.hassNow, store, this.ownerId, kind, pick.id, names);
      if (this.ask === undefined) this.saidRemoved(kind, pick.id, names.item, next, store.noteFor(kind, pick.id));
    } finally {
      this.busy = undefined;
    }
  }

  /** Remove under its question, then say what it cleared. */
  private async removeAsked(ask: UntickAsk): Promise<void> {
    const store = this.lib.store;
    this.ask = undefined;
    if (store === undefined || this.busy !== undefined) return;
    const kind = ask.kind as OrderedKind;
    this.busy = ask.itemId;
    try {
      const result = await tickItem(this.hassNow, store, ask.ownerId, ask.kind, ask.itemId, false, ask.names);
      if (!result.ok) this.said = { kind, tone: "err", text: result.text };
      else if (result.note !== undefined) this.said = { kind, tone: result.note.kind === "ok" ? "ok" : "warn", text: result.note.text };
      else this.saidRemoved(kind, ask.itemId, ask.names.item, null, undefined);
    } finally {
      this.busy = undefined;
    }
  }

  /** "Took X off the watch", with Undo: put it back, where it was. */
  private saidRemoved(kind: OrderedKind, id: string, name: string, next: string | null, failed: string | undefined): void {
    if (failed !== undefined) {
      this.said = { kind, tone: "err", text: failed };
      return;
    }
    this.said = { kind, tone: "ok", text: `Took ${name} off ${this.device}.`, undo: () => void this.putBack(kind, id, next) };
  }

  /** Undo a remove: the pick goes back on, at the end, then before the one
   * that followed it. */
  private async putBack(kind: OrderedKind, id: string, next: string | null): Promise<void> {
    const store = this.lib.store;
    if (store === undefined || this.busy !== undefined) return;
    this.busy = id;
    this.said = undefined;
    try {
      const result = await tickItem(this.hassNow, store, this.ownerId, kind, id, true);
      if (!result.ok) {
        this.said = { kind, tone: "err", text: result.text };
        return;
      }
    } finally {
      this.busy = undefined;
    }
    const library = this.lib.library;
    const ids = library === undefined ? [] : itemsFor(library, this.ownerId, kind).map((p) => p.id);
    if (next !== null && ids.some((o) => sameId(o, next))) await this.move(kind, { id, before: next }, ids);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver === "undefined") return;
    this.seen = new ResizeObserver(() => this.fitPictures());
    this.seen.observe(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.seen?.disconnect();
    this.seen = undefined;
  }

  protected override updated(): void {
    this.fitPictures();
  }

  /** Size the page pictures to the cards they stand in: the cards' width
   * comes from the grid, not from the pictures, so this settles at once. */
  private fitPictures(): void {
    const card = this.renderRoot.querySelector<HTMLElement>(".hl-lines.strip .hl-line");
    if (card === null) return;
    const inner = card.clientWidth - 16;
    const width = Math.max(PAGE_PICTURE_MIN, Math.min(PAGE_PICTURE_MAX, Math.floor((inner * PAGE_PICTURE_SHARE) / 4) * 4));
    if (width === this.pageW) return;
    this.pageW = width;
    this.requestUpdate();
  }

  static override styles = [watchPagePreviewStyles, watchFrameStyles, statusPagesViewStyles, rowPictureStyles, libraryTicksStyles, homeLineupStyles];
}

/** The two kinds a device keeps in an order of its own. */
export type OrderedKind = "pages" | "status_pages";

/** A device's own order and picks, changed from Home: drag, remove, and
 * what to draw under a group while one is asked or done. */
export interface LineupArrange {
  /** The order a drag asked for, shown until the read after its save. */
  order?: (kind: OrderedKind) => readonly string[] | undefined;
  drag?: (kind: OrderedKind, pick: LibraryPick, index: number, ids: readonly string[]) => LineupDrag;
  /** `next` is the id after it, so an undo can put it back in its place. */
  remove?: (kind: OrderedKind, pick: LibraryPick, next: string | null) => LineupLine["remove"];
  under?: (kind: OrderedKind) => TemplateResult | undefined;
}

/** What the groups draw with. */
export interface LineupDraw {
  hass?: HassLike;
  icons?: IconProvider;
  tick?: number;
  /** A watch page picture's width; an iPhone's is narrower. */
  pageWidth?: number;
  arrange?: LineupArrange;
  onEdit: (kind: LibraryKind, id: string) => void;
  onChange: (kind: LibraryKind) => void;
}

/** The library's three groups for one device: pages, status pages, menus. */
export function lineupGroups(library: Library, ownerId: string, kind: "watch" | "iphone", draw: LineupDraw): LineupGroup[] {
  const word = kind === "iphone" ? "iPhone" : "watch";
  const iphone = kind === "iphone";
  const states = draw.hass?.states;
  const watchW = draw.pageWidth ?? PAGE_PICTURE_MIN;
  const pageW = iphone ? Math.round(watchW * PHONE_PICTURE_RATIO) : watchW;
  const arrange = draw.arrange;
  /** A kind's picks in the device's order, each with its drag and remove. */
  const linesOf = (k: OrderedKind, line: (pick: LibraryPick) => LineupLine): LineupLine[] => {
    const picks = inOrder(itemsFor(library, ownerId, k), arrange?.order?.(k));
    const ids = picks.map((p) => p.id);
    return picks.map((pick, i) => {
      const drag = arrange?.drag?.(k, pick, i, ids);
      const remove = arrange?.remove?.(k, pick, ids[i + 1] ?? null);
      return { ...line(pick), ...(drag === undefined ? {} : { drag }), ...(remove === undefined ? {} : { remove }) };
    });
  };
  const pageLines = linesOf("pages", (pick) => ({
    key: pick.id,
    name: pick.entry.name,
    detail: pick.entry.detail,
    hidden: pick.hidden,
    picture: renderPageRowPicture({
      page: pick.entry.item as WatchPage, width: pageW, iphone,
      ...(states === undefined ? {} : { states }),
      ...(draw.icons === undefined ? {} : { icons: draw.icons }),
      ...(draw.tick === undefined ? {} : { tick: draw.tick }),
    }),
    action: { label: "Edit", title: `Edit ${pick.entry.name}`, onClick: () => draw.onEdit("pages", pick.id) },
  }));
  const statusLines = linesOf("status_pages", (pick) => ({
    key: pick.id,
    name: pick.entry.name,
    detail: pick.entry.detail,
    hidden: pick.hidden,
    picture: renderStatusRowPicture({
      page: pick.entry.item, hass: draw.hass, width: STATUS_PICTURE_W,
      ...(draw.icons === undefined ? {} : { icons: draw.icons }),
      ...(draw.tick === undefined ? {} : { tick: draw.tick }),
    }),
    action: { label: "Edit", title: `Edit ${pick.entry.name}`, onClick: () => draw.onEdit("status_pages", pick.id) },
  }));
  const underPages = arrange?.under?.("pages");
  const underStatus = arrange?.under?.("status_pages");
  const units: MenuUnit[] = ["anywhere", "entity"];
  const menuLines = units.flatMap((unit): LineupLine[] => {
    const menu = menuFor(library, ownerId, unit);
    if (menu === undefined) return [];
    return [{
      key: unit,
      name: `${MENU_UNIT_TITLES[unit]}: ${menu.name}`,
      action: { label: "Edit", title: `Edit ${menu.name}`, onClick: () => draw.onEdit("menus", menu.id) },
    }];
  });
  return [
    {
      key: "pages", title: "Pages", icon: "pages", hue: "var(--wa-hue-green)", sub: `in the order the ${word} swipes them`,
      lines: pageLines, strip: true, empty: `No pages on this ${word} yet.`,
      change: { title: `Add, order and hide pages on this ${word}`, onClick: () => draw.onChange("pages") },
      ...(underPages === undefined ? {} : { under: underPages }),
    },
    {
      key: "status_pages", title: "Status pages", icon: "checklist", hue: "var(--wa-hue-yellow)",
      lines: statusLines, empty: `No status pages on this ${word} yet.`,
      ...(underStatus === undefined ? {} : { under: underStatus }),
      change: { title: `Add, order and hide status pages on this ${word}`, onClick: () => draw.onChange("status_pages") },
    },
    {
      key: "menus", title: "Menus", icon: "radial", hue: "var(--wa-hue-orange)",
      lines: menuLines, empty: `This ${word} uses no menu yet.`,
      change: { title: `Pick the menus this ${word} uses`, onClick: () => draw.onChange("menus") },
    },
  ];
}

if (!customElements.get("wa-home-lineup")) customElements.define("wa-home-lineup", WaHomeLineup);

declare global {
  interface HTMLElementTagNameMap {
    "wa-home-lineup": WaHomeLineup;
  }
}
