// The iPhone drawn around its pages, as the app's one screen shows them:
// the phone's body and screen, the status bar and the Dynamic Island, the
// top row (the grid for all pages, the page's name, the gear for Settings),
// the strip above the pages, the pages area itself, and the strip under it
// for bottom page dots. The app has no tab bar and no large title.
//
// The pages area is the page code's screen on the phone
// (`PlatformDevice.pagesArea`): the watch's own page code lays the tiles out
// in it the way it fills a watch's display, so every preview of an iPhone's
// pages, status pages or menus is drawn into that area rather than a watch's
// screen. Its size follows `PhonePagesView` in the app:
//
//   safe area top
//   home switcher, 42 tall, 16 in from each side, then 8 (two or more homes only)
//   top row, 44 (`PhonePagesView.topControls`)
//   top bar, 12 (`PhonePagesView.topBar`, a clear strip, `DS.space(.s)`)
//   pages area, 6 in from each side (`PhonePagesView.sideInset`)
//   bottom bar (`PhonePagesView.bottomBarHeight`): 46 for the iPhone look's
//     dock (`PhonePagesDock.height` 38, and 8) when its dots show, 14 under
//     the Watch look's dots at the top, else 32 (`pageBarHeight`)
//   safe area bottom
//
// On the iPhone 17 Pro (402 by 874 points) without the switcher the pages
// area is 6 to 396 across and starts 118 down; it ends at 794 above the
// dock (676 tall), at 808 with no dock and the dots not at the top (690
// tall), or at 826 under the Watch look's top dots (708 tall). The tiles'
// places inside it were measured on the simulator on 2026-10-10 and do not
// move with the chrome around it.
//
// The panel draws no home switcher: the phone shows one only with two or
// more homes, which Home Assistant cannot see, and the single home case is
// by far the common one (`InstanceSwitcherBar`). The phone reports no screen
// size yet, so every iPhone is drawn as the iPhone 17 Pro.
//
// A phone's Page look setting (`phonePageLook`) picks how it draws its
// pages. The iPhone look, the default, draws them as an iPhone app would:
// the page's name centred in the top row, the app's graphite ground behind
// a page with no background of its own, in the panel's light or dark skin,
// round 22 point tile corners, and a plain page control in the strip under
// the pages. The Watch look keeps the watch's own drawing, bigger, with the
// watch's small title in the page instead of the name in the top row.

import { css, html, svg, type TemplateResult, nothing, unsafeCSS } from "lit";

import type { IconProvider } from "./renderer.js";
import { renderWatchFrame } from "./watch-frame.js";

/** One iPhone screen: its size, the safe area the app's chrome keeps clear
 * of, the corner radius of its display, and its Dynamic Island, all in
 * points. */
export interface PhoneModel {
  label: string;
  screen: { width: number; height: number };
  safeTop: number;
  safeBottom: number;
  /** The display's corner radius. */
  radius: number;
  /** The Dynamic Island, centred, `top` below the screen's top edge. None on
   * a phone with a notch or a home button. */
  island?: { width: number; height: number; top: number };
}

const ISLAND = { width: 126, height: 37, top: 11 };

/** The iPhones the frame knows, by screen size. */
export const PHONE_MODELS: readonly PhoneModel[] = [
  { label: "iPhone 17 Pro", screen: { width: 402, height: 874 }, safeTop: 62, safeBottom: 34, radius: 62, island: ISLAND },
  { label: "iPhone 17 Pro Max", screen: { width: 440, height: 956 }, safeTop: 62, safeBottom: 34, radius: 62, island: ISLAND },
  { label: "iPhone 15 Pro", screen: { width: 393, height: 852 }, safeTop: 59, safeBottom: 34, radius: 55, island: ISLAND },
  { label: "iPhone 15 Pro Max", screen: { width: 430, height: 932 }, safeTop: 59, safeBottom: 34, radius: 55, island: ISLAND },
  { label: "iPhone 13 mini", screen: { width: 375, height: 812 }, safeTop: 50, safeBottom: 34, radius: 44 },
  { label: "iPhone SE", screen: { width: 375, height: 667 }, safeTop: 20, safeBottom: 0, radius: 0 },
];

/** The iPhone every phone is drawn as while its size is not known. */
export const DEFAULT_PHONE: PhoneModel = PHONE_MODELS[0]!;

/** The model for a `screen_size` string ("402x874", points), else the
 * default iPhone. The phone does not report one yet. */
export function phoneModelForScreenSize(screenSize: string | null | undefined): PhoneModel {
  const match = /^(\d+)x(\d+)$/.exec((screenSize ?? "").trim());
  if (!match) return DEFAULT_PHONE;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return PHONE_MODELS.find((m) => m.screen.width === width && m.screen.height === height) ?? DEFAULT_PHONE;
}

/** `PhonePagesView.sideInset`: the room each side of the pages area. */
export const PHONE_PAGES_SIDE_INSET = 6;
/** `PhonePagesView.topBar` with no page pushed: a clear strip, `DS.space(.s)`. */
export const PHONE_PAGES_TOP_BAR = 12;
/** `PhonePagesView.pageBarHeight`: the dots' bar under the pages, a thumb's
 * height, with the dots in it or not (one page, dots off, or the iPhone
 * look with no dock to show). */
export const PHONE_PAGES_BOTTOM_BAR = 32;
/** The bar under the pages with the Watch look's dots at the top of them. */
export const PHONE_PAGES_BOTTOM_BAR_TOP_DOTS = 14;
/** `PhonePagesDock.height`: the iPhone look's glass capsule for its dots. */
export const PHONE_PAGES_DOCK_HEIGHT = 38;
/** `PhonePagesView.phoneDockBarHeight`: the dock and a little air round it. */
export const PHONE_PAGES_DOCK_BAR = PHONE_PAGES_DOCK_HEIGHT + 8;
/** How far the page dots sit below the top of the pages area when they are
 * at the top. */
export const PHONE_PAGE_DOTS_TOP = 3;
/** The home switcher's height (measured), its side room (`DS.space(.m)`) and
 * the gap under it (`DS.space(.xs)`). */
export const PHONE_SWITCHER_HEIGHT = 42;
export const PHONE_SWITCHER_SIDE = 16;
export const PHONE_SWITCHER_GAP = 8;
/** The top row (`PhonePagesView.topControls`): 44 tall, a 40 point round
 * glass button at each end in a 44 point target (`PhonePagesChrome`), lined
 * up with the tiles' edges, which sit `PhoneVault.gutter` in with the
 * iPhone look and the pages' side inset with the Watch look. */
export const PHONE_TOP_ROW_HEIGHT = 44;
export const PHONE_TOP_BUTTON = 40;
export const PHONE_TOP_ROW_SIDE_IPHONE = 16;
/** The page's name in the top row (`PhoneVault.Typography.title`, 16 point
 * semibold), held this far in from each side so it clears both buttons and
 * stays centred (`pageTitleInset`). */
export const PHONE_TOP_TITLE_SIZE = 16;
export const PHONE_TOP_TITLE_INSET = 68;

/** How an iPhone draws its pages, its `phonePageLook` setting: like an
 * iPhone app, or like a big watch. */
export type PhonePageLook = "iphone" | "watch";

/** The look a phone's behavior document asks for: the Watch look only when
 * it says `watch`. Absent or any other value is the iPhone look, as the app
 * reads it (an unknown value reads as the default). */
export function phonePageLookOf(behavior: Readonly<Record<string, unknown>> | undefined): PhonePageLook {
  return behavior?.phonePageLook === "watch" ? "watch" : "iphone";
}

/** The iPhone look's tile corners in points, held to half the tile's short
 * side as SwiftUI holds a rounded rectangle's. */
export const PHONE_TILE_RADIUS = 22;

/** A tile's corner radius in the iPhone look, in points. */
export function phoneTileCornerRadius(widthPt: number, heightPt: number): number {
  return Math.min(PHONE_TILE_RADIUS, Math.min(widthPt, heightPt) / 2);
}

/** The app's graphite ground (`PhoneVault` `.ground`) and its ink, which
 * the panel sets for its light and dark skins (`--wa-phone-grouped`,
 * `--wa-phone-ink`). */
export const PHONE_GROUPED_BACKGROUND = "var(--wa-phone-grouped, #f1f2f5)";
export const PHONE_LABEL_INK = "var(--wa-phone-ink, #14161a)";

/** The iPhone look's page control: each dot's size and the room between
 * two, in points; the current page's dot is the label ink, the others the
 * same at 0.3. */
export const PHONE_PAGE_CONTROL_DOT = 7;
export const PHONE_PAGE_CONTROL_GAP = 9;

/** A rectangle in points from the screen's top left. */
export interface PhoneRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Where the pages screen puts everything on one iPhone's screen. */
export interface PhonePagesLayout {
  model: PhoneModel;
  /** The home switcher, when drawn. */
  switcher?: PhoneRect;
  /** Set only for the iPhone look; absent is the Watch look. */
  look?: "iphone";
  /** The top row, from the grid button's left edge to the gear's right
   * edge: the buttons line up with the tiles' edges. */
  topRow: PhoneRect;
  /** The pages area: the screen the page code lays a page out on. */
  area: PhoneRect;
  /** The bar under the pages area, where bottom page dots or the iPhone
   * look's dock sit, just above the safe area. */
  bottomBar: PhoneRect;
}

/** What the bar under the pages is sized for: whether the page dots show
 * (`showPageIndicator` on, and two or more pages to show), and whether the
 * phone's settings put them at the top (`pageIndicatorPosition`, which the
 * iPhone look does not read). */
export interface PhonePagesDotsPlace {
  shown: boolean;
  top: boolean;
}

/** The dots' place from a phone's behavior document and how many pages it
 * shows (`PhonePagesRules.visiblePages`: none hidden, no system page). */
export function phonePagesDotsOf(behavior: Readonly<Record<string, unknown>> | undefined, visiblePages: number): PhonePagesDotsPlace {
  return { shown: behavior?.showPageIndicator !== false && visiblePages > 1, top: behavior?.pageIndicatorPosition === "Top" };
}

/** `PhonePagesView.bottomBarHeight`: the dock's bar with the iPhone look
 * while its dots show, the short strip under the Watch look's top dots,
 * else the dots' thumb high bar, dots in it or not. */
export function phonePagesBottomBarHeight(iphone: boolean, dots: PhonePagesDotsPlace): number {
  if (iphone && dots.shown) return PHONE_PAGES_DOCK_BAR;
  if (!iphone && dots.top) return PHONE_PAGES_BOTTOM_BAR_TOP_DOTS;
  return PHONE_PAGES_BOTTOM_BAR;
}

/** Where the pages screen lays itself out on `model`, with the home
 * switcher when `switcher` (a phone with two or more homes). The top row is
 * the same height in both looks; `look` "iphone" moves the top row's
 * buttons in to the iPhone look's tile edges. The pages area runs down to
 * the bar under it, whose height follows the look and `dots`; with no
 * `dots`, the phone's own defaults: dots on, at the bottom, two or more
 * pages. */
export function phonePagesLayout(
  model: PhoneModel = DEFAULT_PHONE,
  options?: { switcher?: boolean; look?: PhonePageLook; dots?: PhonePagesDotsPlace },
): PhonePagesLayout {
  const { width, height } = model.screen;
  const iphone = options?.look === "iphone";
  let top = model.safeTop;
  let switcher: PhoneRect | undefined;
  if (options?.switcher === true) {
    switcher = { x: PHONE_SWITCHER_SIDE, y: top, width: width - PHONE_SWITCHER_SIDE * 2, height: PHONE_SWITCHER_HEIGHT };
    top += PHONE_SWITCHER_HEIGHT + PHONE_SWITCHER_GAP;
  }
  const side = iphone ? PHONE_TOP_ROW_SIDE_IPHONE : PHONE_PAGES_SIDE_INSET;
  const topRow = { x: side, y: top, width: width - side * 2, height: PHONE_TOP_ROW_HEIGHT };
  top += PHONE_TOP_ROW_HEIGHT + PHONE_PAGES_TOP_BAR;
  const bar = phonePagesBottomBarHeight(iphone, options?.dots ?? { shown: true, top: false });
  const bottomBar = { x: 0, y: height - model.safeBottom - bar, width, height: bar };
  const area = { x: PHONE_PAGES_SIDE_INSET, y: top, width: width - PHONE_PAGES_SIDE_INSET * 2, height: bottomBar.y - top };
  return {
    model,
    ...(switcher === undefined ? {} : { switcher }),
    ...(iphone ? { look: "iphone" as const } : {}),
    topRow, area, bottomBar,
  };
}

/** Whether `layout` draws the iPhone look. */
export function phoneDrawsIphoneLook(layout: PhonePagesLayout | undefined): boolean {
  return layout?.look === "iphone";
}

/** The pages area's size: the screen the page code draws a page on. */
export function phonePagesScreen(layout: PhonePagesLayout): { width: number; height: number } {
  return { width: layout.area.width, height: layout.area.height };
}

/** What an editor says of the iPhone it draws, which is always the default
 * while the phone reports no screen size. */
export const PHONE_SIZE_TEXT = `Drawn as an ${DEFAULT_PHONE.label}. The iPhone does not tell Home Assistant its screen size.`;

/** The editors draw an iPhone at this share of the watch's zoom, so the
 * phone fits the stage the watch fits: 150% for the watch is 75% of the
 * phone's own points. */
export const PHONE_STAGE_ZOOM = 0.5;

/** The phone's body around the screen as a share of the screen's width: the
 * black border, and the metal rim outside it, never under two pixels. */
export const PHONE_BEZEL_RATIO = 0.024;
export const PHONE_RIM_RATIO = 0.009;

/** The app's page dots on the phone (`PageLineIndicator`): the row drawn
 * `width` points wide and `height` tall, at the top of the pages area or in
 * the strip under it. */
export interface PhonePageDots {
  row: TemplateResult;
  height: number;
  top: boolean;
}

/** The time the status bar shows. */
const STATUS_TIME = "9:41";

const r2 = (v: number): number => Math.round(v * 100) / 100;

function symbol(icons: IconProvider | undefined, name: string, px: number, ink: string, fallback: () => TemplateResult): TemplateResult {
  const glyph = icons?.render(name, px, ink);
  return glyph === undefined ? fallback() : html`<svg width=${px} height=${px} viewBox=${`0 0 ${px} ${px}`} aria-hidden="true">${glyph}</svg>`;
}

/** The status bar: the time centred 5 points right of the middle of the
 * left ear, the signal, Wi-Fi and battery ending 35 points from the right
 * edge, both centred 2.5 points below the island's middle (measured on the
 * 17 Pro: the time's digits 53 to 95 across and 26 to 38 down). White on
 * the Watch look; in the iPhone look the screen's own ink, so it reads on
 * the light skin's grouped background too. */
function statusBar(model: PhoneModel, s: number, icons: IconProvider | undefined, ios = false): TemplateResult {
  const { width } = model.screen;
  const island = model.island;
  const ear = island === undefined ? width / 2 : (width - island.width) / 2;
  const centreY = island === undefined ? model.safeTop / 2 : island.top + island.height / 2 + 2.5;
  const timeX = island === undefined ? 24 : ear / 2 + 5;
  const px = (pt: number) => `${r2(pt * s)}px`;
  const fill = ios ? "currentColor" : "#fff";
  const bars = svg`${[0, 1, 2, 3].map((i) => svg`<rect x=${i * 4.6} y=${10 - (i + 1) * 2.5} width="3" height=${(i + 1) * 2.5} rx="0.8" fill="${fill}" />`)}`;
  // The symbol provider takes a hex ink only, so the iPhone look draws the
  // Wi-Fi mark itself in the screen's ink.
  const wifi = symbol(ios ? undefined : icons, "wifi", 15 * s, "#FFFFFF", () => html`<svg width=${15 * s} height=${11 * s} viewBox="0 0 15 11" aria-hidden="true">${svg`<path d="M7.5 11 5.3 8.6a3.2 3.2 0 0 1 4.4 0zM2.9 6.3a6.6 6.6 0 0 1 9.2 0l1.5-1.6a8.8 8.8 0 0 0-12.2 0zM.4 3.6a10.3 10.3 0 0 1 14.2 0L15 3.2V3a12.4 12.4 0 0 0-15 0z" fill="${fill}" />`}</svg>`);
  return html`<div class="wa-phone-status" style=${`height:${px(model.safeTop)}`}>
    ${island === undefined ? nothing : html`<span class="wa-phone-island" style=${`left:${px((width - island.width) / 2)};top:${px(island.top)};width:${px(island.width)};height:${px(island.height)}`}></span>`}
    <span class="wa-phone-time" style=${`left:${px(timeX)};top:${px(centreY)};font-size:${px(17)}`}>${STATUS_TIME}</span>
    <span class="wa-phone-icons" style=${`right:${px(35)};top:${px(centreY)};gap:${px(6)}`}>
      <svg width=${r2(16.8 * s)} height=${r2(10 * s)} viewBox="0 0 16.8 10" aria-hidden="true">${bars}</svg>
      ${wifi}
      <span class="wa-phone-battery" style=${`width:${px(25)};height:${px(12)};border-radius:${px(4)};padding:${px(1.5)}`}><i style=${`border-radius:${px(2.5)}`}></i></span>
    </span>
  </div>`;
}

/** The top row: at the left the grid (`square.grid.2x2`) that opens all
 * pages, only with `grid` (two or more pages to show), at the right the
 * gear (`gearshape.fill`) for Settings, each a round glass button, and
 * `title`, the page's name, centred between them. The glyphs are drawn here
 * in the screen's ink, as the status bar's Wi-Fi mark is, since the symbol
 * provider takes a hex ink only. */
function topRow(layout: PhonePagesLayout, s: number, ios: boolean, grid: boolean, title: string): TemplateResult {
  const px = (pt: number) => `${r2(pt * s)}px`;
  const row = layout.topRow;
  const fill = ios ? "currentColor" : "#fff";
  const glyph = r2(16 * s);
  const button = (name: string, mark: TemplateResult) =>
    html`<span class=${`wa-phone-glass ${name}`} style=${`width:${px(PHONE_TOP_BUTTON)};height:${px(PHONE_TOP_BUTTON)}`}>
      <svg width=${glyph} height=${glyph} viewBox="0 0 16 16" aria-hidden="true">${mark}</svg>
    </span>`;
  const gridMark = svg`${[1.5, 9.1].flatMap((y) => [1.5, 9.1].map((x) => svg`<rect x=${x} y=${y} width="5.4" height="5.4" rx="1.5" fill="none" stroke="${fill}" stroke-width="1.6" />`))}`;
  // Eight teeth round a ring with a hole in the middle.
  const gearMark = svg`<circle cx="8" cy="8" r="6.3" fill="none" stroke="${fill}" stroke-width="2.6" stroke-dasharray="2.47 2.48" stroke-dashoffset="1.24" />
    <circle cx="8" cy="8" r="4.3" fill="none" stroke="${fill}" stroke-width="3.2" />`;
  return html`<div class="wa-phone-top" style=${`height:${px(row.height)};padding:0 ${px(row.x)}`}>
    ${grid ? button("wa-phone-grid", gridMark) : nothing}
    ${title === "" ? nothing : html`<span class="wa-phone-title" style=${`left:${px(PHONE_TOP_TITLE_INSET)};right:${px(PHONE_TOP_TITLE_INSET)};font-size:${px(PHONE_TOP_TITLE_SIZE)}`}><span>${title}</span></span>`}
    ${button("wa-phone-gear", gearMark)}
  </div>`;
}

/**
 * Wrap `area` (a box the pages area's width, at least its height, the page
 * code's screen) in the iPhone: its body, status bar, top row, the strip
 * above the pages, and the strip under them with the page dots when they
 * sit at the bottom. A box taller than the pages area (a page that scrolls
 * on) makes the phone that much taller, as the watch's case grows, so
 * everything under the pages keeps its place below them. The box gets
 * `--wf-radius: 0px`: the pages area has square corners.
 *
 * The top row's grid shows only with `grid` (two or more pages to show), as
 * the phone hides it with one. A layout in the iPhone look
 * (`phonePagesLayout` with `look`) puts `title` in the top row and adds the
 * `ios` class, which draws the screen around the pages on the graphite
 * ground in its ink. `ink` adds the `ink` class when the page itself sits on
 * that ground (no color of its own), so marks drawn over the page can use
 * the ink too; a page with its own color keeps light marks.
 */
export function renderPhoneFrame(
  layout: PhonePagesLayout,
  scale: number,
  area: TemplateResult,
  options?: { label?: string; icons?: IconProvider; dots?: PhonePageDots; title?: string; ink?: boolean; grid?: boolean },
): TemplateResult {
  const s = scale;
  const { model } = layout;
  const ios = phoneDrawsIphoneLook(layout);
  const px = (pt: number) => `${r2(pt * s)}px`;
  const bezel = Math.round(model.screen.width * s * PHONE_BEZEL_RATIO);
  const rim = Math.max(2, Math.round(model.screen.width * s * PHONE_RIM_RATIO));
  const radius = r2(model.radius * s);
  // The buttons sit by the phone's own height, however far a page that
  // scrolls on makes the drawing run.
  const caseHeight = model.screen.height * s + bezel * 2;
  const at = (f: number) => `${r2(caseHeight * f)}px`;
  const dots = options?.dots;
  const switcher = layout.switcher === undefined ? nothing
    : html`<div class="wa-phone-switcher" aria-hidden="true" style=${`height:${px(layout.switcher.height)};margin:0 ${px(layout.switcher.x)} ${px(PHONE_SWITCHER_GAP)}`}></div>`;
  const title = ios ? (options?.title ?? "").trim() : "";
  return html`<div class="wa-phone${ios ? " ios" : ""}${ios && options?.ink === true ? " ink" : ""}" aria-label=${options?.label ?? "iPhone"}
    style=${`--pf-bezel:${bezel}px;--pf-rim:${rim}px;--pf-radius:${radius}px;--wf-radius:0px;--pf-left-top:${at(0.17)};--pf-left-h:${at(0.22)};--pf-right-top:${at(0.26)};--pf-right-h:${at(0.1)}`}>
    <div class="wa-phone-screen" style=${`width:${px(model.screen.width)};min-height:${px(model.screen.height)}`}>
      ${statusBar(model, s, options?.icons, ios)}
      ${switcher}
      ${topRow(layout, s, ios, options?.grid === true, title)}
      <div class="wa-phone-gap" style=${`height:${px(PHONE_PAGES_TOP_BAR)}`}></div>
      <div class="wa-phone-area" style=${`margin:0 ${px(layout.area.x)};min-height:${px(layout.area.height)}`}>
        ${area}
        ${dots?.top === true ? html`<span class="wa-phone-dots" style=${`top:${px(PHONE_PAGE_DOTS_TOP)};height:${px(dots.height)}`}>${dots.row}</span>` : nothing}
      </div>
      <div class="wa-phone-dots-bar" style=${`height:${px(layout.bottomBar.height)}`}>${dots?.top === false ? dots.row : nothing}</div>
      <div class="wa-phone-foot" style=${`height:${px(model.safeBottom)}`}>
        ${model.safeBottom > 0 ? html`<span class="wa-phone-home" style=${`width:${px(134)};height:${px(5)};bottom:${px(8)}`}></span>` : nothing}
      </div>
    </div>
  </div>`;
}

/** Wrap a box drawn at `screen` (the page code's screen) in its device: the
 * watch's case, or with `phone` the iPhone around its pages area, which
 * `screen` then is. What the menu and status page editors draw with. */
export function renderDeviceFrame(
  phone: PhonePagesLayout | undefined,
  screen: { width: number; height: number },
  scale: number,
  body: TemplateResult,
  label: string,
  icons?: IconProvider,
): TemplateResult {
  if (phone === undefined) return renderWatchFrame(screen, scale, body, label);
  return renderPhoneFrame(phone, scale, body, { label, ...(icons === undefined ? {} : { icons }) });
}

/** The phone's own rules. Add to a component's `styles` beside the watch
 * frame's. The rim and the buttons take the panel's `--wa-art-case` token;
 * the screen around the pages is the app's `bg0`. */
export const phoneFrameStyles = css`
  .wa-phone {
    position: relative;
    display: inline-block;
    flex: none;
    box-sizing: content-box;
    padding: var(--pf-bezel, 10px);
    margin: var(--pf-rim, 3px) calc(var(--pf-rim, 3px) + 3px);
    border-radius: calc(var(--pf-radius, 46px) + var(--pf-bezel, 10px));
    background: #050608;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.05),
      0 0 0 var(--pf-rim, 3px) var(--wa-art-case, #2b2f3d),
      0 0 0 calc(var(--pf-rim, 3px) + 1px) rgba(255, 255, 255, 0.1),
      0 14px 34px rgba(0, 0, 0, 0.4);
  }
  /* The side buttons, just outside the rim: on the left the Action button
     and the volume pair (one strip, cut in three), on the right the side
     button. */
  .wa-phone::before,
  .wa-phone::after {
    content: "";
    position: absolute;
    width: 3px;
    pointer-events: none;
  }
  .wa-phone::before {
    right: calc(100% + var(--pf-rim, 3px));
    top: var(--pf-left-top, 17%);
    height: var(--pf-left-h, 22%);
    border-radius: 2px 0 0 2px;
    background: linear-gradient(
      to bottom,
      var(--wa-art-case, #2b2f3d) 0 14%, transparent 14% 36%,
      var(--wa-art-case, #2b2f3d) 36% 64%, transparent 64% 73%,
      var(--wa-art-case, #2b2f3d) 73% 100%
    );
  }
  .wa-phone::after {
    left: calc(100% + var(--pf-rim, 3px));
    top: var(--pf-right-top, 26%);
    height: var(--pf-right-h, 10%);
    border-radius: 0 2px 2px 0;
    background: var(--wa-art-case, #2b2f3d);
  }
  .wa-phone-screen {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: var(--pf-radius, 46px);
    background: #131316;
    color: #fff;
    font-family: "SF Pro Text", "SF Pro", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .wa-phone-screen > * { flex: none; }
  .wa-phone-status { position: relative; }
  .wa-phone-island { position: absolute; border-radius: 999px; background: #000; }
  .wa-phone-time { position: absolute; transform: translate(-50%, -50%); font-weight: 600; line-height: 1; letter-spacing: -0.01em; }
  .wa-phone-icons { position: absolute; display: flex; align-items: center; transform: translateY(-50%); }
  .wa-phone-icons svg { display: block; }
  .wa-phone-battery { display: flex; box-sizing: border-box; border: 1px solid rgba(255, 255, 255, 0.45); }
  .wa-phone-battery i { flex: 1; background: #fff; }
  .wa-phone-switcher { border-radius: 999px; background: #222328; }
  .wa-phone-area { position: relative; display: flex; flex-direction: column; }
  .wa-phone-area > * { flex: none; }
  /* The page code's own system font on the phone is SF Pro, not the watch's
     SF Compact. */
  .wa-phone-area .wp-screen { font-family: "SF Pro Text", "SF Pro", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  .wa-phone-dots { position: absolute; left: 0; right: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 4; }
  .wa-phone-dots-bar { display: flex; align-items: center; justify-content: center; }
  /* The top row: two round glass buttons at its ends, dark glass on the
     Watch look's dark screen, and the page's name centred between them. */
  .wa-phone-top { position: relative; display: flex; align-items: center; box-sizing: border-box; }
  .wa-phone-glass {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 50%;
    background: rgba(44, 46, 51, 0.52);
    box-shadow: inset 0 0 0 1px rgba(242, 246, 252, 0.08), 0 4px 12px rgba(0, 0, 0, 0.18);
  }
  .wa-phone-glass svg { display: block; opacity: 0.92; }
  .wa-phone-gear { margin-left: auto; }
  .wa-phone-title {
    position: absolute; top: 0; bottom: 0;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    font-weight: 600; line-height: 1.2; letter-spacing: -0.01em;
  }
  .wa-phone-title > span { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .wa-phone-foot { position: relative; }
  .wa-phone-home { position: absolute; left: 50%; transform: translateX(-50%); border-radius: 999px; background: rgba(255, 255, 255, 0.7); }
  /* The iPhone look: the screen on the app's graphite ground in its ink,
     light or dark with the panel's skin, and the top row's glass, battery
     and home bar in the same skin. */
  .wa-phone.ios .wa-phone-screen { background: ${unsafeCSS(PHONE_GROUPED_BACKGROUND)}; color: ${unsafeCSS(PHONE_LABEL_INK)}; }
  .wa-phone.ios .wa-phone-glass {
    background: var(--wa-phone-glass, rgba(255, 255, 255, 0.74));
    box-shadow: inset 0 0 0 1px var(--wa-phone-glass-rim, rgba(20, 22, 26, 0.07)), 0 3px 10px rgba(0, 0, 0, 0.08);
  }
  .wa-phone.ios .wa-phone-battery { border-color: color-mix(in srgb, currentColor 45%, transparent); }
  .wa-phone.ios .wa-phone-battery i { background: currentColor; }
  .wa-phone.ios .wa-phone-home { background: currentColor; opacity: 0.7; }
  .wa-phone.ios .wp-fold { border-top-color: color-mix(in srgb, ${unsafeCSS(PHONE_LABEL_INK)} 45%, transparent); }
  .wa-phone-pc { flex: none; border-radius: 50%; }
`;
