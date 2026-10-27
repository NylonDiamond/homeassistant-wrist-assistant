// A small picture for every row of a library list: a page as one watch (or
// iPhone) screen of its tiles, a status page as the watch draws it, a menu
// as its screen with the ring of slots. Mock frames 2a and 2b, grown: a
// page or status page 56 by 68, on an iPhone 40 wide, a menu 56 tall, and
// the dimmed "Not on this watch" cards 76 wide.
//
// Each reuses the drawer the rest of the panel has: the page editor's row
// thumb (the page's background and the tiles that reach onto its first
// screen, `renderWatchTileFace`), the Status pages tab's picture
// (`renderStatusPagePicture`), and `wa-menu-thumbs`. The menu one lives in
// the menu editor's chunk, so it is loaded the first time a menu picture is
// asked for (`whenMenuPicturesReady`), and a plain ring stands in until it
// is in. A page or status page picture is kept per item object and redrawn
// only when the states, the icons or the size it was drawn with change, so
// a long list costs one layout per item per state change.

import { css, html, type TemplateResult } from "lit";
import type { HassEntityState, HassLike } from "../ha-api.js";
import { type PhonePageLook, phonePagesLayout, phonePagesScreen } from "../phone-frame.js";
import { type IconProvider, REFERENCE_CASE } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import { NO_ICONS } from "../watch-pages/editor-host.js";
import { type WatchPage, isSmartWatchPage } from "../watch-pages/model.js";
import type { OneLookGlowRecipe } from "../watch-pages/one-look/glow.js";
import {
  type WatchPagePreviewInput,
  previewOneLook,
  renderWatchTileFace,
  watchPreviewLayout,
  watchPreviewSideInset,
  watchPreviewTopInset,
  previewScreenLayers,
  watchScreenColor,
} from "../watch-pages/preview.js";
import { renderStatusPagePicture } from "../watch-status-pages/view.js";
import type { MenuUnit } from "./client.js";
import { type LibraryMenu, menuDocument } from "./model.js";

/** A page or status page in a list row, on a watch, in CSS pixels. The
 * mock drew them 36 wide; they grew to be readable (Jesse, 2026-10-17). */
export const ROW_PICTURE_W = 56;
/** The same on an iPhone. */
export const ROW_PICTURE_PHONE_W = 40;
/** The tallest a row picture is drawn. */
export const ROW_PICTURE_H = 68;
/** A menu in a list row: its screen's height. */
export const ROW_MENU_PICTURE_H = 56;
/** A dimmed "Not on this watch" card's picture. */
export const SMALL_CARD_PICTURE_W = 76;

/** The watch screen every picture is laid out on, when the caller has no
 * device's own. */
const WATCH_SCREEN = REFERENCE_CASE.screen;

/** The longest a picture is drawn for a given width: a watch screen's
 * proportions. */
function heightFor(width: number): number {
  return Math.round((width * WATCH_SCREEN.height) / WATCH_SCREEN.width);
}

export interface PageRowPictureInput {
  page: WatchPage;
  /** The device's pages, so a tile that opens a page can be named after
   * it (`pagesDocumentFor`). */
  pages?: readonly WatchPage[];
  states?: Record<string, HassEntityState>;
  icons?: IconProvider;
  /** The panel's icon tick: a new value draws again once more icons load. */
  tick?: number;
  /** Drawn as an iPhone's page: narrower, the phone's pages area. */
  iphone?: boolean;
  /** An iPhone's Page look (`phonePageLook`), so the row draws the page as
   * that phone's stage does; the iPhone look when not given. */
  look?: PhonePageLook;
  /** In CSS pixels; `ROW_PICTURE_W` (or `ROW_PICTURE_PHONE_W`) when not
   * given. */
  width?: number;
  /** The device's app version, which decides whether its tiles draw One
   * Look (`previewOneLook`); absent for a page drawn for no device, which
   * draws it. */
  appVersion?: string | null;
  /** A tile's icon photo's URL by its id once its bytes are in
   * (`PagePhotoStore.url`); without it the tiles draw their icons. */
  photo?: (id: string) => string | undefined;
  /** A tile's icon photo's size (`PagePhotoStore.size`), so the photo is
   * fitted, and the light saved in it (`PagePhotoStore.glow`, Light Look). */
  photoSize?: (id: string) => { width: number; height: number } | undefined;
  photoGlow?: (id: string) => OneLookGlowRecipe | undefined;
  /** A new value draws again once more photos are in. */
  photoTick?: number;
}

interface Kept {
  stamp: readonly unknown[];
  picture: TemplateResult;
}

/** Pictures by item object, then by size. A new summary brings new
 * objects, so nothing kept outlives the read it was drawn from. */
const kept = new WeakMap<object, Map<string, Kept>>();

function keptPicture(item: object, size: string, stamp: readonly unknown[], draw: () => TemplateResult): TemplateResult {
  let sizes = kept.get(item);
  if (sizes === undefined) {
    sizes = new Map();
    kept.set(item, sizes);
  }
  const held = sizes.get(size);
  if (held !== undefined && held.stamp.length === stamp.length && held.stamp.every((v, i) => v === stamp[i])) return held.picture;
  const picture = draw();
  sizes.set(size, { stamp, picture });
  return picture;
}

/** A page as one screen, small: its background and the tiles that reach
 * onto the screen; a smart page its color and glyph. */
export function renderPageRowPicture(input: PageRowPictureInput): TemplateResult {
  const iphone = input.iphone === true;
  const width = input.width ?? (iphone ? ROW_PICTURE_PHONE_W : ROW_PICTURE_W);
  const stamp = [input.states, input.icons, input.tick, input.pages, input.photoTick];
  const look = input.look ?? "iphone";
  const tiles = previewOneLook({ appVersion: input.appVersion }) === undefined ? "old" : "one";
  return keptPicture(input.page, `page:${iphone ? `p:${look}` : "w"}:${width}:${tiles}`, stamp, () => drawPage(input, width, iphone, look));
}

function drawPage(input: PageRowPictureInput, width: number, iphone: boolean, look: PhonePageLook): TemplateResult {
  const { page } = input;
  const phone = iphone ? phonePagesLayout(undefined, { look }) : undefined;
  const screen = phone === undefined ? WATCH_SCREEN : phonePagesScreen(phone);
  const s = width / screen.width;
  const height = Math.min(Math.round(screen.height * s), heightFor(Math.max(width, ROW_PICTURE_W)));
  const box = `width:${width}px;height:${height}px`;
  if (isSmartWatchPage(page)) {
    return html`<span class="lr-pic lr-smart ${iphone ? "ph" : ""}" style=${`${box};background:${watchScreenColor(page)}`} aria-hidden="true">${uiIcon("states")}</span>`;
  }
  const preview: WatchPagePreviewInput = {
    page, pages: input.pages ?? [page], screen, scale: s, stateMode: "live",
    ...(input.states === undefined ? {} : { states: input.states }),
    ...(input.icons === undefined ? {} : { icons: input.icons }),
    ...(phone === undefined ? {} : { phone }),
    ...(input.appVersion === undefined ? {} : { appVersion: input.appVersion }),
    // The tiles' icon photos; the page's own photo stays out of a row.
    ...(input.photo === undefined ? {} : { photo: input.photo }),
    ...(input.photoSize === undefined ? {} : { photoSize: input.photoSize }),
    ...(input.photoGlow === undefined ? {} : { photoGlow: input.photoGlow }),
  };
  const layout = watchPreviewLayout(page, screen, { sideInset: watchPreviewSideInset(preview), topInset: watchPreviewTopInset(preview) });
  // Only what reaches onto the picture: a long page costs no more than a short one.
  const shown = layout.tiles.filter((t) => (layout.topInset + t.y) * s < height);
  const back = previewScreenLayers(preview, page, s, screen, undefined);
  return html`<span class="lr-pic ${iphone ? "ph" : ""}" style=${`${box};background:${back.background}`} aria-hidden="true">
    ${back.layers}
    ${shown.map((t) => html`<span class="lr-tile"
      style=${`left:${t.x * s}px;top:${(layout.topInset + t.y) * s}px;width:${t.width * s}px;height:${t.height * s}px`}>${renderWatchTileFace(t.tile, { width: t.width, height: t.height }, preview, layout.unit)}</span>`)}
  </span>`;
}

export interface StatusRowPictureInput {
  page: Record<string, unknown>;
  hass: HassLike | undefined;
  icons?: IconProvider;
  tick?: number;
  /** In CSS pixels; `ROW_PICTURE_W` when not given. */
  width?: number;
}

/** A status page as the watch draws it from the states now, one screen of
 * it, small. Nothing but the frame before `hass` is in. */
export function renderStatusRowPicture(input: StatusRowPictureInput): TemplateResult {
  const width = input.width ?? ROW_PICTURE_W;
  const height = heightFor(width);
  const box = `width:${width}px;height:${height}px`;
  const hass = input.hass;
  if (hass === undefined) return html`<span class="lr-pic lr-status" style=${box} aria-hidden="true"></span>`;
  return keptPicture(input.page, `status:${width}`, [hass.states, input.icons, input.tick], () => html`<span class="lr-pic lr-status" style=${box} aria-hidden="true">
    ${renderStatusPagePicture({ page: input.page, hass, icons: input.icons ?? NO_ICONS, screen: WATCH_SCREEN, scale: width / WATCH_SCREEN.width })}
  </span>`);
}

let menuPictures: Promise<void> | undefined;
let menuPicturesIn = false;

/** Load `wa-menu-thumbs` once (it is in the menu editor's chunk), then call
 * `ready` so the caller draws again. Already in: nothing to wait for. */
export function whenMenuPicturesReady(ready: () => void): boolean {
  if (menuPicturesIn || customElements.get("wa-menu-thumbs") !== undefined) {
    menuPicturesIn = true;
    return true;
  }
  menuPictures ??= import("../watch-menus/menu-thumbs.js").then(() => {
    menuPicturesIn = true;
  });
  void menuPictures.then(ready, () => undefined);
  return false;
}

export interface MenuRowPictureInput {
  menu: LibraryMenu;
  hass: HassLike | undefined;
  icons: IconProvider | undefined;
  tick?: number;
  /** The device's pages document (`pagesDocumentFor`), for the page
   * switcher's rows; an Entity quick menu needs none. */
  pages?: unknown;
  /** Its screen's height in CSS pixels; `ROW_MENU_PICTURE_H` when not
   * given. */
  height?: number;
  /** Called once the menu pictures' code is in, to draw again. */
  onReady: () => void;
}

/** Each menu's document, made once per menu object. */
const menuDocs = new WeakMap<object, Record<string, unknown>>();

/** A menu as its screen with the ring of its slots, small. A plain ring
 * stands in while the drawer's code loads. */
export function renderMenuRowPicture(input: MenuRowPictureInput): TemplateResult {
  const height = input.height ?? ROW_MENU_PICTURE_H;
  const unit: MenuUnit = input.menu.unit;
  if (!whenMenuPicturesReady(input.onReady) || input.hass === undefined || input.icons === undefined) {
    return html`<span class="lr-ring" style=${`width:${height}px;height:${height}px`} aria-hidden="true"></span>`;
  }
  let doc = menuDocs.get(input.menu);
  if (doc === undefined) {
    doc = menuDocument(input.menu);
    menuDocs.set(input.menu, doc);
  }
  return html`<wa-menu-thumbs class="lr-menu" .hass=${input.hass} .icons=${input.icons} .tick=${input.tick ?? 0} .menus=${doc}
    .pages=${input.pages} .screen=${WATCH_SCREEN} .height=${height} menu=${unit}></wa-menu-thumbs>`;
}

/** The pictures' look: a screen's corners and a hairline, no case. A row
 * marked hidden draws its picture faint (`.hid`). */
export const rowPictureStyles = css`
  .lr-pic {
    position: relative; display: block; flex: none; overflow: hidden; line-height: 0; pointer-events: none;
    border-radius: 9px; box-shadow: 0 0 0 1px var(--wa-line-strong); background: #000;
  }
  .lr-pic.ph { border-radius: 6px; }
  .lr-tile { position: absolute; overflow: hidden; pointer-events: none; }
  .lr-smart { display: grid; place-items: center; color: rgba(255, 255, 255, .7); }
  .lr-smart svg { width: 16px; height: 16px; }
  .lr-status .wa-watch { padding: 0; margin: 0; background: none; box-shadow: none; border-radius: 0; }
  .lr-status .wa-watch::before, .lr-status .wa-watch::after { display: none; }
  .lr-ring { display: block; flex: none; border-radius: 50%; border: 1px dashed var(--wa-line-strong); box-sizing: border-box; }
  wa-menu-thumbs.lr-menu { flex: none; }
  .hid .lr-pic, .hid .lr-ring, .hid wa-menu-thumbs.lr-menu { opacity: .45; }
`;
