// `wa-home-lineup`: the part of Home's lineup for one device that comes
// from the library (plan step 6): its pages in swipe order with their
// pictures (hidden ones faded), its status pages, and the two menus it
// uses. Its own chunk, loaded by `home-lineup-hook.ts`, since the library
// store and the pictures are not in the panel's first download.

import { LitElement, html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import type { HassLike } from "./ha-api.js";
import { type LineupGroup, type LineupLine, homeLineupStyles, renderLineupGroup } from "./home-lineup-look.js";
import type { LibraryKind, MenuUnit } from "./library/client.js";
import { MENU_UNIT_TITLES, itemsFor, menuFor, type Library } from "./library/model.js";
import { renderPageRowPicture, renderStatusRowPicture, rowPictureStyles } from "./library/row-picture.js";
import { LibraryController } from "./library/store.js";
import type { IconProvider } from "./renderer.js";
import { watchFrameStyles } from "./watch-frame.js";
import type { WatchPage } from "./watch-pages/model.js";
import { watchPagePreviewStyles } from "./watch-pages/preview.js";
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
      onEdit: (kind, id) => this.onEdit?.(kind, id),
      onChange: (kind) => this.onChange?.(kind),
    }).map(renderLineupGroup)}</div>`;
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

  static override styles = [watchPagePreviewStyles, watchFrameStyles, statusPagesViewStyles, rowPictureStyles, homeLineupStyles];
}

/** What the groups draw with. */
export interface LineupDraw {
  hass?: HassLike;
  icons?: IconProvider;
  tick?: number;
  /** A watch page picture's width; an iPhone's is narrower. */
  pageWidth?: number;
  onEdit: (kind: LibraryKind, id: string) => void;
  onChange: (kind: LibraryKind) => void;
}

/** The library's three groups for one device: pages, status pages, menus. */
export function lineupGroups(library: Library, ownerId: string, kind: "watch" | "iphone", draw: LineupDraw): LineupGroup[] {
  const word = kind === "iphone" ? "iPhone" : "watch";
  const iphone = kind === "iphone";
  const pages = itemsFor(library, ownerId, "pages");
  const states = draw.hass?.states;
  const watchW = draw.pageWidth ?? PAGE_PICTURE_MIN;
  const pageW = iphone ? Math.round(watchW * PHONE_PICTURE_RATIO) : watchW;
  const pageLines = pages.map((pick): LineupLine => ({
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
  const statusLines = itemsFor(library, ownerId, "status_pages").map((pick): LineupLine => ({
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
    },
    {
      key: "status_pages", title: "Status pages", icon: "checklist", hue: "var(--wa-hue-yellow)",
      lines: statusLines, empty: `No status pages on this ${word} yet.`,
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
