// How the Watch settings page draws each setting: the icon beside its
// title, and for a choice drawn as tiles, each tile's icon or small picture,
// its short name and its detail line.
//
// The catalog (`watch-settings-catalog.json`) is shared with the iPhone app,
// whose test checks it against the Swift types, so nothing about looks goes
// in there. This map is the panel's own, keyed by setting key and option
// value, and its test fails when a catalog setting or one of its choices has
// no entry here, or when an entry names a setting or choice the catalog no
// longer has.
//
// The icons are SF Symbols, the names the iPhone app's Watch behavior screens
// use (`WatchBehavior*SettingsView.swift` and `behaviorOptionIcon` in
// `WatchBehaviorSettingsComponents.swift`), and every one is in the symbol
// file the panel ships. The detail lines are the app's `optionDetails`.
// Where the app draws no icon for a row, one is chosen here in the same
// spirit; those are marked "panel's own".

import { type SVGTemplateResult, html, svg } from "lit";
import type { CatalogSetting, SettingOption } from "./watch-settings.js";

/** A choice drawn as a small picture of what it does instead of an icon. */
export type PreviewKind =
  | "indicatorStyle"
  | "indicatorPosition"
  | "indicatorSize"
  | "indicatorBrightness"
  | "popupMaterial"
  | "pageTransition";

export interface OptionLook {
  /** The SF Symbol on the choice's tile, and its mark wherever else it is
   * named. */
  icon: string;
  /** The tile's name, where the catalog's label says more than a tile has
   * room for ("Short" for "Short (150 ms)"). The catalog's label otherwise. */
  name?: string;
  /** The small mono line under the name, as the app prints it. */
  detail?: string;
}

export interface SettingLook {
  /** The SF Symbol beside the setting's title. */
  icon: string;
  /** Draw each choice as this kind of picture instead of its icon. */
  preview?: PreviewKind;
  /** One entry per catalog choice of an enum setting. */
  options?: Readonly<Record<string, OptionLook>>;
}

/** The most choices drawn as tiles. A longer list stays a dropdown. */
export const MAX_TILES = 5;

/** Every option of a setting wearing the same icon, as the app draws a
 * picker whose options it gives no icons of their own. */
function same(icon: string, values: readonly string[], details: Readonly<Record<string, string>> = {}): Record<string, OptionLook> {
  return Object.fromEntries(values.map((v) => [v, details[v] === undefined ? { icon } : { icon, detail: details[v] }]));
}

/** The double-tap and pull-down actions' icons, the app's own menus'. */
const ACTION_ICONS: Readonly<Record<string, string>> = {
  "Disabled": "xmark.circle",
  "Toggle Aimed Entity (Point Control)": "safari.fill",
  "Room Jump": "location.fill",
  "Activate Scene": "theatermasks",
  "Run Script": "scroll.fill",
  "Refresh": "arrow.clockwise",
  "Next Page": "arrow.right",
  "Previous Page": "arrow.left",
  "Toggle First Tile": "power",
};

function actions(values: readonly string[]): Record<string, OptionLook> {
  return Object.fromEntries(values.map((v) => [v, { icon: ACTION_ICONS[v] ?? "questionmark.circle" }]));
}

/** A camera polling rate's speed, slowest last, as the app's rate pickers. */
const RATE_ICONS: Record<string, OptionLook> = {
  "0.5s": { icon: "hare.fill" },
  "1s": { icon: "bolt.fill" },
  "2s": { icon: "timer" },
  "3s": { icon: "clock" },
  "5s": { icon: "tortoise.fill" },
};

/** An edge swipe's sensitivity, as the app's "Edge Swipe" and "Swipe Next
 * Camera" pickers. */
const SWIPE_ICONS: Record<string, OptionLook> = {
  "Off": { icon: "xmark.circle" },
  "Low": { icon: "hare.fill" },
  "Medium": { icon: "bolt.fill" },
  "High": { icon: "flame.fill" },
};

/** The page edge swipe has one level more. Max has no icon of its own in the
 * app and takes the row's there. */
const PAGE_SWIPE_ICONS: Record<string, OptionLook> = { ...SWIPE_ICONS, "Max": { icon: "hand.draw.fill" } };

export const WATCH_SETTING_LOOK: Readonly<Record<string, SettingLook>> = {
  // ── connection ──
  serverMode: {
    icon: "network", // panel's own
    options: {
      "Auto": { icon: "sparkles" },
      "Local": { icon: "house.fill" },
      "Remote": { icon: "globe" },
    },
  },
  deltaTimeout: { icon: "timer", options: same("timer", ["25s", "35s", "45s", "55s"]) },

  // ── interaction ──
  longPressDuration: {
    icon: "hand.tap.fill",
    options: {
      "Super Fast": { icon: "bolt.fill", name: "Super fast", detail: "75ms" },
      "Short": { icon: "hare.fill", name: "Short", detail: "150ms" },
      "Normal": { icon: "clock", name: "Normal", detail: "200ms" },
      "Long": { icon: "tortoise.fill", name: "Long", detail: "300ms" },
      "Extra Long": { icon: "hand.tap.fill", name: "Extra long", detail: "1s" },
    },
  },
  entityRadialVerticalQuickRadialGestureEnabled: { icon: "arrow.up.and.down.and.arrow.left.and.right" },
  entityRadialVerticalQuickRadialGestureTrigger: {
    icon: "hand.draw",
    options: same("hand.draw", ["Up/Down x2", "Swipe Up/Down", "Clockwise"], {
      "Up/Down x2": "Double vertical oscillation",
      "Swipe Up/Down": "Swipe past center & back",
      "Clockwise": "Circle gesture around center",
    }),
  },
  entityRadialVerticalQuickRadialGestureSpeed: {
    icon: "arrow.up.arrow.down",
    options: same("arrow.up.arrow.down", ["Fast", "Normal", "Slow", "Very Slow"], {
      "Fast": "0.35s",
      "Normal": "0.45s",
      "Slow": "0.60s",
      "Very Slow": "0.80s",
    }),
  },
  topSectionDoubleTapAction: {
    icon: "hand.tap", // panel's own
    options: actions([
      "Disabled", "Toggle Aimed Entity (Point Control)", "Room Jump", "Activate Scene", "Run Script",
      "Refresh", "Next Page", "Previous Page", "Toggle First Tile",
    ]),
  },
  topSectionDoubleTapSceneTargetId: { icon: "theatermasks" },
  topSectionDoubleTapScriptTargetId: { icon: "scroll.fill" },
  sliderCrownSensitivity: {
    icon: "digitalcrown.horizontal.arrow.counterclockwise",
    options: {
      "Precise": { icon: "tortoise.fill" },
      "Normal": { icon: "clock" },
      "Fast": { icon: "hare.fill" },
    },
  },
  dismissControlsOnClose: { icon: "rectangle.stack.badge.minus" },
  showControlEntityName: { icon: "textformat" },
  automationTriggerSkipConditions: { icon: "bolt.badge.automatic.fill" },
  showPendingAnimation: { icon: "hourglass.circle.fill" },

  // ── navigation ──
  pageTransitionStyle: {
    icon: "rectangle.2.swap", // panel's own; the app's Default choice
    preview: "pageTransition",
    options: {
      "Default": { icon: "rectangle.2.swap" },
      "Slide": { icon: "arrow.left.arrow.right" },
      "Fade": { icon: "circle.lefthalf.filled" },
      "None": { icon: "hare.fill" },
    },
  },
  showPageIndicator: { icon: "circle.grid.2x1.fill" },
  pageIndicatorStyle: {
    icon: "circle.grid.2x1", // panel's own
    preview: "indicatorStyle",
    options: same("circle.grid.2x1", ["Lines", "Dots", "Dash"]),
  },
  pageIndicatorOpacity: { icon: "sun.max.fill", preview: "indicatorBrightness", options: same("sun.max.fill", ["Subtle", "Medium", "Bright"]) },
  pageIndicatorPosition: { icon: "arrow.up.and.down", preview: "indicatorPosition", options: same("arrow.up.and.down", ["Bottom", "Top"]) },
  pageIndicatorSize: {
    icon: "arrow.up.left.and.arrow.down.right",
    preview: "indicatorSize",
    options: same("arrow.up.left.and.arrow.down.right", ["Small", "Medium", "Large"]),
  },
  pageIndicatorColorHex: { icon: "paintpalette.fill" }, // panel's own
  pullDownAction: {
    icon: "arrow.down.circle.fill",
    options: actions(["Disabled", "Refresh", "Next Page", "Previous Page", "Room Jump", "Activate Scene", "Run Script", "Toggle First Tile"]),
  },
  pullDownSceneTargetId: { icon: "theatermasks" },
  pullDownScriptTargetId: { icon: "scroll.fill" },
  wrapPages: { icon: "arrow.trianglehead.2.counterclockwise.rotate.90" },
  bottomEdgePageSwipeSensitivity: { icon: "hand.draw.fill", options: PAGE_SWIPE_ICONS },
  popupBackgroundMaterial: {
    icon: "rectangle.on.rectangle",
    preview: "popupMaterial",
    options: {
      "Ultra Thin": { icon: "rectangle.on.rectangle", name: "Ultra thin", detail: "Most transparent" },
      "Thin": { icon: "rectangle.on.rectangle", name: "Thin", detail: "Slightly opaque" },
      "Regular": { icon: "rectangle.on.rectangle", name: "Regular", detail: "Balanced" },
      "Thick": { icon: "rectangle.on.rectangle", name: "Thick", detail: "More opaque" },
      "Ultra Thick": { icon: "rectangle.on.rectangle", name: "Ultra thick", detail: "Most opaque" },
    },
  },

  // ── camera ──
  cameraStreamMode: {
    icon: "video", // panel's own
    options: {
      "Auto": { icon: "video.fill" },
      "Polling": { icon: "photo" },
    },
  },
  cameraRefreshRate: { icon: "timer", options: RATE_ICONS },
  cameraHDRefreshRate: { icon: "timer", options: RATE_ICONS },
  cameraRefreshOnOpen: { icon: "arrow.clockwise" },
  cameraRefreshOnOpenDebounce: { icon: "timer", options: same("timer", ["5s", "10s", "30s", "60s"]) },
  cameraRefreshOnPageOpenDelay: { icon: "hourglass", options: same("hourglass", ["Off", "250ms", "500ms", "1s"]) },
  cameraShowLoadingDots: { icon: "ellipsis" },
  cameraSwipeSensitivity: { icon: "hand.draw.fill", options: SWIPE_ICONS },
  cameraSwipeWrap: { icon: "arrow.trianglehead.2.counterclockwise.rotate.90" },
};

/** Whether an enum setting draws its choices as tiles: up to `MAX_TILES` of
 * them in the catalog. Counted on the catalog's own list, so a stored value
 * from another app version, shown as one more tile, never turns the row into
 * a dropdown. */
export function usesTiles(setting: CatalogSetting): boolean {
  return setting.type === "enum" && (setting.options?.length ?? 0) > 0 && setting.options!.length <= MAX_TILES;
}

/** The SF Symbol beside a setting's title. */
export function settingIcon(setting: CatalogSetting): string {
  return WATCH_SETTING_LOOK[setting.key]?.icon ?? "questionmark.circle";
}

/** One tile, as the view draws it. */
export interface TileChoice {
  value: string;
  name: string;
  detail?: string;
  /** The SF Symbol, unless `preview` is drawn instead. */
  icon: string;
  preview?: PreviewKind;
  /** The catalog's full label, for the tooltip, when the name shortens it. */
  title?: string;
  on: boolean;
}

/**
 * The tiles of an enum setting, in the catalog's order. `options` is what
 * `optionsFor` gives, so a stored value the catalog does not list is one more
 * tile, named as it is stored and marked with the row's icon.
 */
export function tileChoices(setting: CatalogSetting, options: readonly SettingOption[], value: string): TileChoice[] {
  const look = WATCH_SETTING_LOOK[setting.key];
  return options.map((o) => {
    const own = look?.options?.[o.value];
    const name = own?.name ?? o.label;
    const known = own !== undefined;
    return {
      value: o.value,
      name,
      ...(own?.detail === undefined ? {} : { detail: own.detail }),
      icon: own?.icon ?? look?.icon ?? "questionmark.circle",
      ...(known && look?.preview !== undefined ? { preview: look.preview } : {}),
      ...(name === o.label ? {} : { title: o.label }),
      on: o.value === value,
    };
  });
}

// ── the small pictures ───────────────────────────────────────────────────
//
// Each is a 36 by 20 box drawn in `currentColor`, so a tile's own color (muted
// at rest, ink when picked) carries into it and the light skin needs nothing
// of its own. The popup picture's front card is filled with the tile's own
// background (`--ws-tile-bg`, which the tile sets), so a thicker material
// hides more of what is behind it.

/** The page dots' brightness, the watch's `PageIndicatorOpacity`. */
const BRIGHTNESS: Readonly<Record<string, { on: number; off: number }>> = {
  Subtle: { on: 0.5, off: 0.15 },
  Medium: { on: 0.7, off: 0.2 },
  Bright: { on: 0.9, off: 0.3 },
};

/** The page dots' scale, the watch's `PageIndicatorSize`. */
const SCALE: Readonly<Record<string, number>> = { Small: 0.75, Medium: 1, Large: 1.35 };

/** How much of what is behind a popup each material hides. */
const MATERIAL: Readonly<Record<string, number>> = {
  "Ultra Thin": 0.2,
  "Thin": 0.4,
  "Regular": 0.6,
  "Thick": 0.8,
  "Ultra Thick": 0.95,
};

/** Three page dots across the middle, the second one the current page. */
function dots(cx: number, cy: number, r: number, gap: number, on: number, off: number): SVGTemplateResult {
  return svg`${[-1, 0, 1].map((i) => svg`<circle cx=${cx + i * gap} cy=${cy} r=${i === 0 ? r * 1.15 : r}
    fill="currentColor" fill-opacity=${i === 0 ? on : off} />`)}`;
}

function previewShape(kind: PreviewKind, value: string): SVGTemplateResult {
  switch (kind) {
    case "indicatorStyle":
      if (value === "Lines") {
        return svg`${[0, 1, 2].map((i) => svg`<rect x=${4 + i * 10} y="8.75" width="8" height="2.5" rx="1.25"
          fill="currentColor" fill-opacity=${i === 1 ? 0.95 : 0.35} />`)}`;
      }
      if (value === "Dash") {
        return svg`<rect x="4" y="8.75" width="28" height="2.5" rx="1.25" fill="currentColor" fill-opacity="0.25" />
          <rect x="13.33" y="8.75" width="9.33" height="2.5" rx="1.25" fill="currentColor" />`;
      }
      return dots(18, 10, 2.3, 6.8, 0.95, 0.35);
    case "indicatorPosition": {
      const y = value === "Top" ? 4.6 : 15.4;
      return svg`<rect x="10.5" y="0.75" width="15" height="18.5" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.7" />
        <rect x="14" y="8.5" width="8" height="3" rx="1" fill="currentColor" fill-opacity="0.25" />
        ${dots(18, y, 0.9, 2.8, 1, 0.4)}`;
    }
    case "indicatorSize": {
      const s = SCALE[value] ?? 1;
      return dots(18, 10, 2.3 * s, 6.8 * s, 0.95, 0.35);
    }
    case "indicatorBrightness": {
      const b = BRIGHTNESS[value] ?? BRIGHTNESS.Subtle!;
      return dots(18, 10, 2.5, 7.2, b.on, b.off);
    }
    case "popupMaterial": {
      const hide = MATERIAL[value] ?? 0.6;
      return svg`<circle cx="11" cy="9" r="6" fill="currentColor" />
        <rect x="16" y="11" width="14" height="6" rx="2" fill="currentColor" fill-opacity="0.6" />
        <rect x="8.5" y="4.5" width="21" height="13" rx="3" style="fill: var(--ws-tile-bg)" fill-opacity=${hide}
          stroke="currentColor" stroke-width="1" stroke-opacity="0.6" />`;
    }
    case "pageTransition":
      switch (value) {
        // The phone's Default: the old page shrinks and fades as the new one
        // pushes in.
        case "Default":
          return svg`<rect x="5" y="5" width="10" height="10" rx="2" fill="currentColor" fill-opacity="0.3" />
            <rect x="14" y="2.5" width="15" height="15" rx="2.5" fill="currentColor" fill-opacity="0.9" />`;
        case "Slide":
          return svg`<rect x="1.5" y="2.5" width="12" height="15" rx="2.5" fill="currentColor" fill-opacity="0.3" />
            <rect x="15.5" y="2.5" width="12" height="15" rx="2.5" fill="currentColor" fill-opacity="0.9" />
            <path d="M34 7.5H30.5M34 12.5H30.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />`;
        case "Fade":
          return svg`<rect x="6" y="2.5" width="15" height="15" rx="2.5" fill="currentColor" fill-opacity="0.45" />
            <rect x="15" y="2.5" width="15" height="15" rx="2.5" fill="currentColor" fill-opacity="0.45" />`;
        default:
          // None: the next page is simply there.
          return svg`<rect x="10.5" y="2.5" width="15" height="15" rx="2.5" fill="currentColor" fill-opacity="0.9" />`;
      }
  }
}

/** One choice's picture, sized by the tile's glyph box. */
export function optionPreview(kind: PreviewKind, value: string) {
  return html`<svg class="ws-pv" viewBox="0 0 36 20" width="36" height="20" aria-hidden="true">${previewShape(kind, value)}</svg>`;
}
