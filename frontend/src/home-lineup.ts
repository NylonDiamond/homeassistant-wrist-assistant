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
import { inOrder, movedOrder } from "./watch-pages/all-pages-model.js";
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

  /** The line being dragged: its kind, the order when it was picked up,
   * the order it would land in now (the cards it passes move aside), and
   * whether its slot has faded yet (after the browser drew the card it
   * drags, so that picture is the card at full strength). */
  @state() private drag?: { kind: OrderedKind; id: string; from: readonly string[]; order?: string[]; lifted: boolean };
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
        order: (kind) => (this.drag?.kind === kind && this.drag.order !== undefined ? this.drag.order
          : this.orderAsked?.kind === kind ? this.orderAsked.ids : undefined),
        // Only pages: their order is the order the device swipes them. A
        // status page opens from a tile or a menu slot, so its order shows
        // nowhere on the device.
        drag: (kind, pick, index, ids) => (kind === "pages" ? this.lineDrag(kind, pick, index, ids) : undefined),
        zone: (kind) => (kind === "pages" ? {
          onOver: (e) => { if (this.drag?.kind === kind) e.preventDefault(); },
          onDrop: (e) => { if (this.drag?.kind !== kind) return; e.preventDefault(); this.dropDrag(); },
        } : undefined),
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

  /** A line's drag in its kind's order: the cards it passes move aside to
   * show where it would land, and letting go there moves it; let go
   * anywhere else and they slide back. Alt and the arrow keys move it a
   * step. Off while a change is on its way. */
  private lineDrag(kind: OrderedKind, pick: LibraryPick, index: number, ids: readonly string[]): LineupDrag {
    const on = this.busy === undefined;
    const now = this.drag;
    return {
      on,
      dragging: now !== undefined && now.kind === kind && now.lifted && sameId(now.id, pick.id),
      onStart: (e) => {
        if (!on) return;
        this.drag = { kind, id: pick.id, from: [...ids], lifted: false };
        e.dataTransfer?.setData("text/plain", pick.id);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
        requestAnimationFrame(() => {
          if (this.drag !== undefined && sameId(this.drag.id, pick.id)) this.drag = { ...this.drag, lifted: true };
        });
      },
      onOver: (e) => {
        const held = this.drag;
        if (held?.kind !== kind) return;
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
        if (sameId(held.id, pick.id)) return;
        const at = ids.findIndex((id) => sameId(id, held.id));
        if (at < 0) return;
        // Into the place of the card it is over: past it going forward,
        // before it going back. That card is then where the dragged one
        // was, away from the pointer, so the two never swap back and forth.
        const order = movedOrder(ids, held.id, at < index ? ids[index + 1] ?? null : pick.id);
        if (order.every((id, i) => id === ids[i])) return;
        this.flipFrom = this.linePlaces();
        this.drag = { ...held, order };
      },
      onDrop: (e) => {
        if (this.drag?.kind !== kind) return;
        e.preventDefault();
        this.dropDrag();
      },
      onEnd: () => {
        if (this.drag === undefined) return;
        // Let go outside the cards: they slide back.
        this.flipFrom = this.linePlaces();
        this.drag = undefined;
      },
      onKey: (e) => {
        if (!e.altKey || !on) return;
        const back = e.key === "ArrowUp" || e.key === "ArrowLeft";
        const forth = e.key === "ArrowDown" || e.key === "ArrowRight";
        if (!back && !forth) return;
        e.preventDefault();
        this.flipFrom = this.linePlaces();
        if (back && index > 0) void this.move(kind, { id: pick.id, before: ids[index - 1]! }, ids);
        if (forth && index < ids.length - 1) void this.move(kind, { id: pick.id, before: ids[index + 2] ?? null }, ids);
      },
    };
  }

  /** Let go over the cards: the order shown is the one saved. */
  private dropDrag(): void {
    const held = this.drag;
    this.drag = undefined;
    if (held?.order === undefined || held.order.every((id, i) => sameId(id, held.from[i]))) return;
    const at = held.order.findIndex((id) => sameId(id, held.id));
    void this.move(held.kind, { id: held.id, before: held.order[at + 1] ?? null }, held.from);
  }

  /** Where each page card is now, by its id, for `flip`. */
  private flipFrom?: Map<string, DOMRect>;

  private linePlaces(): Map<string, DOMRect> {
    const places = new Map<string, DOMRect>();
    for (const li of this.renderRoot.querySelectorAll<HTMLElement>(".hl-lines.strip > .hl-line")) {
      places.set(li.dataset.line ?? "", li.getBoundingClientRect());
    }
    return places;
  }

  /** Slide each page card from where it was (`flipFrom`) to its new place,
   * so a card moving aside is seen to move rather than to jump. */
  private flip(): void {
    const from = this.flipFrom;
    this.flipFrom = undefined;
    if (from === undefined || typeof window.matchMedia !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (const li of this.renderRoot.querySelectorAll<HTMLElement>(".hl-lines.strip > .hl-line")) {
      const was = from.get(li.dataset.line ?? "");
      if (was === undefined || typeof li.animate !== "function") continue;
      for (const running of li.getAnimations()) running.cancel();
      const place = li.getBoundingClientRect();
      const dx = was.left - place.left;
      const dy = was.top - place.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
      li.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 200, easing: "cubic-bezier(.2, .7, .2, 1)" });
    }
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
    this.flip();
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
  drag?: (kind: OrderedKind, pick: LibraryPick, index: number, ids: readonly string[]) => LineupDrag | undefined;
  /** The list's own drop: a card let go in a gap between cards still lands. */
  zone?: (kind: OrderedKind) => LineupGroup["zone"];
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
      page: pick.entry.item, hass: draw.hass, width: pageW,
      ...(draw.icons === undefined ? {} : { icons: draw.icons }),
      ...(draw.tick === undefined ? {} : { tick: draw.tick }),
    }),
    action: { label: "Edit", title: `Edit ${pick.entry.name}`, onClick: () => draw.onEdit("status_pages", pick.id) },
  }));
  const underPages = arrange?.under?.("pages");
  const zonePages = arrange?.zone?.("pages");
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
      ...(zonePages === undefined ? {} : { zone: zonePages }),
    },
    {
      key: "status_pages", title: "Status pages", icon: "checklist", hue: "var(--wa-hue-yellow)",
      // Cards with their pictures as big as a page's, but no numbers: a
      // status page's order shows nowhere on the device.
      lines: statusLines, strip: true, numbered: false, empty: `No status pages on this ${word} yet.`,
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
