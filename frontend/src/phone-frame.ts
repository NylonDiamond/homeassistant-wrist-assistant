// The iPhone drawn around its pages, as the app's Pages tab shows them: the
// phone's body and screen, the status bar and the Dynamic Island, the strip
// above the pages, the pages area itself, the strip under it for bottom page
// dots, and the app's floating tab bar (Pages, Watch, Widgets, Settings).
//
// The pages area is the page code's screen on the phone
// (`PlatformDevice.pagesArea`): the watch's own page code lays the tiles out
// in it the way it fills a watch's display, so every preview of an iPhone's
// pages, status pages or menus is drawn into that area rather than a watch's
// screen. Its size follows `PhonePagesView` in the app:
//
//   safe area top
//   home switcher, 42 tall, 16 in from each side, then 8 (two or more homes only)
//   top bar, 8 (`PhonePagesBoard.topBar`, a clear strip)
//   pages area, 6 in from each side (`PhonePagesBoard.sideInset`)
//   bottom bar, 14 (the page dots when they sit at the bottom)
//   tab bar, 61, 12 in from each side (`MainBottomBar`, floating)
//   safe area bottom
//
// Measured on the iPhone 17 Pro simulator (402 by 874 points), 2026-10-10:
// pages area 6 to 396 across and 120 to 765 down with the home switcher,
// tab bar 12 to 390 across and 779 to 840 down. Without the switcher the
// pages area starts at 70, 390 by 695 points.
//
// The panel draws no home switcher: the phone shows one only with two or
// more homes, which Home Assistant cannot see, and the single home case is
// by far the common one (`InstanceSwitcherBar`). The phone reports no screen
// size yet, so every iPhone is drawn as the iPhone 17 Pro.

import { css, html, svg, type TemplateResult, nothing } from "lit";

import type { IconProvider } from "./renderer.js";

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

/** `PhonePagesBoard.sideInset`: the room each side of the pages area. */
export const PHONE_PAGES_SIDE_INSET = 6;
/** `PhonePagesBoard.topBar` with no page pushed: a clear strip, `DS.space(.xs)`. */
export const PHONE_PAGES_TOP_BAR = 8;
/** `PhonePagesBoard.bottomBar`: the page dots when they sit at the bottom. */
export const PHONE_PAGES_BOTTOM_BAR = 14;
/** How far the page dots sit below the top of the pages area when they are
 * at the top. */
export const PHONE_PAGE_DOTS_TOP = 3;
/** The home switcher's height (measured), its side room (`DS.space(.m)`) and
 * the gap under it (`DS.space(.xs)`). */
export const PHONE_SWITCHER_HEIGHT = 42;
export const PHONE_SWITCHER_SIDE = 16;
export const PHONE_SWITCHER_GAP = 8;
/** The floating tab bar's height (measured), its side room (`DS.space(.s)`)
 * and its corner radius. */
export const PHONE_TAB_BAR_HEIGHT = 61;
export const PHONE_TAB_BAR_SIDE = 12;
export const PHONE_TAB_BAR_RADIUS = 28;

/** A rectangle in points from the screen's top left. */
export interface PhoneRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Where the Pages tab puts everything on one iPhone's screen. */
export interface PhonePagesLayout {
  model: PhoneModel;
  /** The home switcher, when drawn. */
  switcher?: PhoneRect;
  /** The pages area: the screen the page code lays a page out on. */
  area: PhoneRect;
  /** The strip under the pages area, where bottom page dots sit. */
  bottomBar: PhoneRect;
  tabBar: PhoneRect;
}

/** Where the Pages tab lays itself out on `model`, with the home switcher
 * when `switcher` (a phone with two or more homes). */
export function phonePagesLayout(model: PhoneModel = DEFAULT_PHONE, options?: { switcher?: boolean }): PhonePagesLayout {
  const { width, height } = model.screen;
  let top = model.safeTop;
  let switcher: PhoneRect | undefined;
  if (options?.switcher === true) {
    switcher = { x: PHONE_SWITCHER_SIDE, y: top, width: width - PHONE_SWITCHER_SIDE * 2, height: PHONE_SWITCHER_HEIGHT };
    top += PHONE_SWITCHER_HEIGHT + PHONE_SWITCHER_GAP;
  }
  top += PHONE_PAGES_TOP_BAR;
  const tabBar = { x: PHONE_TAB_BAR_SIDE, y: height - model.safeBottom - PHONE_TAB_BAR_HEIGHT, width: width - PHONE_TAB_BAR_SIDE * 2, height: PHONE_TAB_BAR_HEIGHT };
  const bottomBar = { x: 0, y: tabBar.y - PHONE_PAGES_BOTTOM_BAR, width, height: PHONE_PAGES_BOTTOM_BAR };
  const area = { x: PHONE_PAGES_SIDE_INSET, y: top, width: width - PHONE_PAGES_SIDE_INSET * 2, height: bottomBar.y - top };
  return { model, ...(switcher === undefined ? {} : { switcher }), area, bottomBar, tabBar };
}

/** The pages area's size: the screen the page code draws a page on. */
export function phonePagesScreen(layout: PhonePagesLayout): { width: number; height: number } {
  return { width: layout.area.width, height: layout.area.height };
}

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

/** The tab bar's tabs, as `MainBottomBar` lists them. Pages is the one on. */
const TABS: readonly { title: string; icon: string }[] = [
  { title: "Pages", icon: "square.grid.2x2" },
  { title: "Watch", icon: "applewatch" },
  { title: "Widgets", icon: "widget.small" },
  { title: "Settings", icon: "gearshape.fill" },
];

/** The app's accent (`sunnyBeachDay`) and its quiet text, as measured. */
const ACCENT = "#2EC4B6";
const QUIET = "#BCBCBC";

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
 * 17 Pro: the time's digits 53 to 95 across and 26 to 38 down). */
function statusBar(model: PhoneModel, s: number, icons: IconProvider | undefined): TemplateResult {
  const { width } = model.screen;
  const island = model.island;
  const ear = island === undefined ? width / 2 : (width - island.width) / 2;
  const centreY = island === undefined ? model.safeTop / 2 : island.top + island.height / 2 + 2.5;
  const timeX = island === undefined ? 24 : ear / 2 + 5;
  const px = (pt: number) => `${r2(pt * s)}px`;
  const bars = svg`${[0, 1, 2, 3].map((i) => svg`<rect x=${i * 4.6} y=${10 - (i + 1) * 2.5} width="3" height=${(i + 1) * 2.5} rx="0.8" fill="#fff" />`)}`;
  const wifi = symbol(icons, "wifi", 15 * s, "#FFFFFF", () => html`<svg width=${15 * s} height=${11 * s} viewBox="0 0 15 11" aria-hidden="true">${svg`<path d="M7.5 11 5.3 8.6a3.2 3.2 0 0 1 4.4 0zM2.9 6.3a6.6 6.6 0 0 1 9.2 0l1.5-1.6a8.8 8.8 0 0 0-12.2 0zM.4 3.6a10.3 10.3 0 0 1 14.2 0L15 3.2V3a12.4 12.4 0 0 0-15 0z" fill="#fff" />`}</svg>`);
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

/** The floating tab bar: four equal tabs, each its symbol over its title,
 * Pages lit in the accent. */
function tabBar(layout: PhonePagesLayout, s: number, icons: IconProvider | undefined): TemplateResult {
  const px = (pt: number) => `${r2(pt * s)}px`;
  const bar = layout.tabBar;
  return html`<div class="wa-phone-tabs" aria-hidden="true"
    style=${`height:${px(bar.height)};margin:0 ${px(bar.x)};border-radius:${px(PHONE_TAB_BAR_RADIUS)}`}>
    ${TABS.map((tab, i) => {
      const ink = i === 0 ? ACCENT : QUIET;
      const glyph = symbol(icons, tab.icon, 22 * s, ink, () => html`<span class="wa-phone-tab-dot" style=${`width:${px(20)};height:${px(20)};border-color:${ink}`}></span>`);
      return html`<span class="wa-phone-tab" style=${`color:${ink};gap:${px(4)};font-size:${px(10)};${i === 0 ? "transform:scale(1.12)" : ""}`}>${glyph}<span>${tab.title}</span></span>`;
    })}
  </div>`;
}

/**
 * Wrap `area` (a box the pages area's width, at least its height, the page
 * code's screen) in the iPhone: its body, status bar, the strip above the
 * pages, the strip under them with the page dots when they sit at the
 * bottom, and the tab bar. A box taller than the pages area (a page that
 * scrolls on) makes the phone that much taller, as the watch's case grows,
 * so everything under the pages keeps its place below them. The box gets
 * `--wf-radius: 0px`: the pages area has square corners.
 */
export function renderPhoneFrame(
  layout: PhonePagesLayout,
  scale: number,
  area: TemplateResult,
  options?: { label?: string; icons?: IconProvider; dots?: PhonePageDots },
): TemplateResult {
  const s = scale;
  const { model } = layout;
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
  return html`<div class="wa-phone" aria-label=${options?.label ?? "iPhone"}
    style=${`--pf-bezel:${bezel}px;--pf-rim:${rim}px;--pf-radius:${radius}px;--wf-radius:0px;--pf-left-top:${at(0.17)};--pf-left-h:${at(0.22)};--pf-right-top:${at(0.26)};--pf-right-h:${at(0.1)}`}>
    <div class="wa-phone-screen" style=${`width:${px(model.screen.width)};min-height:${px(model.screen.height)}`}>
      ${statusBar(model, s, options?.icons)}
      ${switcher}
      <div class="wa-phone-gap" style=${`height:${px(PHONE_PAGES_TOP_BAR)}`}></div>
      <div class="wa-phone-area" style=${`margin:0 ${px(layout.area.x)};min-height:${px(layout.area.height)}`}>
        ${area}
        ${dots?.top === true ? html`<span class="wa-phone-dots" style=${`top:${px(PHONE_PAGE_DOTS_TOP)};height:${px(dots.height)}`}>${dots.row}</span>` : nothing}
      </div>
      <div class="wa-phone-dots-bar" style=${`height:${px(layout.bottomBar.height)}`}>${dots?.top === false ? dots.row : nothing}</div>
      ${tabBar(layout, s, options?.icons)}
      <div class="wa-phone-foot" style=${`height:${px(model.safeBottom)}`}>
        ${model.safeBottom > 0 ? html`<span class="wa-phone-home" style=${`width:${px(134)};height:${px(5)};bottom:${px(8)}`}></span>` : nothing}
      </div>
    </div>
  </div>`;
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
  .wa-phone-area > .wp-screen,
  .wa-phone-area > .sp-screen { flex: none; }
  /* The page code's own system font on the phone is SF Pro, not the watch's
     SF Compact. */
  .wa-phone-area .wp-screen { font-family: "SF Pro Text", "SF Pro", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  .wa-phone-dots { position: absolute; left: 0; right: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 4; }
  .wa-phone-dots-bar { display: flex; align-items: center; justify-content: center; }
  .wa-phone-tabs {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background: #1e1e20;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-bottom-color: rgba(255, 255, 255, 0.16);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.35);
  }
  .wa-phone-tab { flex: 1; display: flex; flex-direction: column; align-items: center; font-weight: 600; line-height: 1; }
  .wa-phone-tab svg { display: block; }
  .wa-phone-tab-dot { box-sizing: border-box; border: 2px solid; border-radius: 5px; }
  .wa-phone-foot { position: relative; }
  .wa-phone-home { position: absolute; left: 50%; transform: translateX(-50%); border-radius: 999px; background: rgba(255, 255, 255, 0.7); }
`;
