// A still picture of one notification on the watch, drawn from the
// notification style the form holds: its background, and two action buttons
// with their fill, size, corners, icons, color and state badge. Made-up
// entities, nothing live. It answers "what does this setting do" at a glance,
// the way the phone's Style screen does with its own preview.
//
// The sizes and colors are the app's (`NotificationStyleConfig` and
// `NotificationEntityRow` in the app's `Shared/Notification/`), drawn at
// `SCALE` so the card stays small in the dialog.

import { type TemplateResult, css, html, nothing } from "lit";
import type { StyleValue } from "./model.js";

/** The preview's size against the watch's points. */
const SCALE = 0.72;

/** `CornerStyle.radius`. */
const CORNER_RADIUS: Readonly<Record<string, number>> = { rounded: 16, sharp: 8, square: 4 };

/** `ButtonSize`'s paddings and type sizes. */
const BUTTON_SIZE: Readonly<Record<string, { v: number; h: number; icon: number; title: number; badge: number }>> = {
  small: { v: 9, h: 10, icon: 16, title: 14, badge: 11 },
  medium: { v: 13, h: 12, icon: 18, title: 16, badge: 12 },
  large: { v: 16, h: 14, icon: 21, title: 18, badge: 14 },
  extraLarge: { v: 20, h: 16, icon: 24, title: 21, badge: 16 },
};

/** `StateBadgeSize.fontSize(for:)`, as an offset from the button's badge
 * size. */
const BADGE_OFFSET: Readonly<Record<string, number>> = { small: -1, medium: 0, large: 1.5 };

/** `resolvedAccentColor`: the system colors in their dark appearance. "None"
 * is the system blue, and so is "Follow Theme" here: the watch's theme is not
 * known to the panel. */
export const ACCENT_HEX: Readonly<Record<string, string>> = {
  none: "#0A84FF",
  followTheme: "#0A84FF",
  blue: "#0A84FF",
  indigo: "#5E5CE6",
  purple: "#BF5AF2",
  pink: "#FF375F",
  red: "#FF453A",
  orange: "#FF9F0A",
  yellow: "#FFD60A",
  green: "#30D158",
  teal: "#40C8E0",
  cyan: "#64D2FF",
  mint: "#66D4CF",
};

/** The two made-up entities: one on, one off, as the phone's preview has. */
const SAMPLE = [
  { title: "Porch Light", icon: "lightbulb.fill", color: "#FFD60A", on: true, state: "On" },
  { title: "Garage Door", icon: "door.garage.closed", color: "#0A84FF", on: false, state: "Closed" },
] as const;

/** Draws an SF Symbol in a color, or nothing while the symbol file loads. */
export type GlyphDraw = (name: string, size: number, color: string) => TemplateResult | undefined;

function px(n: number): string {
  return `${Math.round(n * SCALE * 10) / 10}px`;
}

function str(values: ReadonlyMap<string, StyleValue>, key: string, fallback: string): string {
  const v = values.get(key);
  return typeof v === "string" ? v : fallback;
}

function bool(values: ReadonlyMap<string, StyleValue>, key: string, fallback: boolean): boolean {
  const v = values.get(key);
  return typeof v === "boolean" ? v : fallback;
}

function alpha(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

/** One button's colors for its fill, as `rowBackgroundColor` and
 * `rowBorder` work them out. */
export function buttonColors(fill: string, accent: string, on: boolean): { background: string; border: string; width: number } {
  switch (fill) {
    case "solid":
      return { background: on ? alpha(accent, 25) : "#1a1a1a", border: on ? alpha(accent, 30) : "rgba(255,255,255,.08)", width: 0.5 };
    case "outlined":
      return { background: "#0f0f0f", border: alpha(accent, 30), width: 1 };
    case "glass":
      return { background: "rgba(255,255,255,.1)", border: "rgba(255,255,255,.15)", width: 0.5 };
    default:
      return { background: on ? alpha(accent, 12) : "#1a1a1a", border: "rgba(255,255,255,.08)", width: 0.5 };
  }
}

/** The preview card for the form's values after defaults. */
export function notificationPreview(values: ReadonlyMap<string, StyleValue>, glyph: GlyphDraw): TemplateResult {
  const background = str(values, "backgroundStyle", "black");
  const fill = str(values, "buttonFill", "tinted");
  const size = BUTTON_SIZE[str(values, "buttonSize", "medium")] ?? BUTTON_SIZE.medium!;
  const radius = CORNER_RADIUS[str(values, "cornerStyle", "sharp")] ?? 8;
  const icons = bool(values, "showButtonIcons", true);
  const tint = bool(values, "useEntityTintColor", true);
  const accentHex = ACCENT_HEX[str(values, "accentColor", "none")] ?? ACCENT_HEX.none!;
  const badge = bool(values, "showStateBadge", false);
  const below = str(values, "stateBadgePosition", "inside") === "below";
  const pill = bool(values, "stateBadgePill", true);
  const badgeFont = size.badge + (BADGE_OFFSET[str(values, "stateBadgeSize", "medium")] ?? 0);
  return html`<div class="ns-pv" data-bg=${background} data-fill=${fill} aria-label="Preview of a notification" role="img">
    <div class="ns-pv-app">Wrist Assistant</div>
    <div class="ns-pv-title">Garage</div>
    <div class="ns-pv-text">The garage door is still open.</div>
    ${SAMPLE.map((e) => {
      const accent = tint ? e.color : accentHex;
      const c = buttonColors(fill, accent, e.on);
      const style = [
        `--ns-r:${px(radius)}`,
        `--ns-bg:${c.background}`,
        `--ns-bd:${c.border}`,
        `--ns-bw:${c.width}px`,
        `--ns-strip:${e.color}`,
        `padding:${px(size.v)} ${px(size.h)}`,
        `font-size:${px(size.title)}`,
      ].join(";");
      const badgeStyle = `font-size:${px(badgeFont)}`;
      return html`<div class="ns-pv-item">
        <div class="ns-pv-btn ${e.on ? "on" : ""}" style=${style}>
          ${icons ? html`<span class="ns-pv-ic" style=${`width:${px(20)};height:${px(size.icon)}`}>${glyph(e.icon, size.icon * SCALE, e.color) ?? nothing}</span>` : nothing}
          <span class="ns-pv-name">${e.title}</span>
          ${badge && !below ? html`<span class="ns-pv-badge ${pill ? "pill" : ""}" style=${badgeStyle}>${e.state}</span>` : nothing}
        </div>
        ${badge && below ? html`<div class="ns-pv-below ${pill ? "pill" : ""}" style=${badgeStyle}>${e.state}</div>` : nothing}
      </div>`;
    })}
  </div>`;
}

/** The preview's look, added to the dialog's sheet. Always dark, as the
 * watch is. */
export const notificationPreviewStyles = css`
  .ns-pv {
    width: 196px; max-width: 100%; box-sizing: border-box; margin: 2px auto 6px; padding: 10px 9px 9px;
    border-radius: 22px; background: #000; color: #fff; display: flex; flex-direction: column; gap: 5px;
    box-shadow: 0 0 0 1px rgba(255,255,255,.12), 0 6px 18px rgba(0,0,0,.25);
    font-family: -apple-system, system-ui, sans-serif;
  }
  .ns-pv[data-bg="glass"] { background: linear-gradient(160deg, #3a3f49 0%, #1c1f25 55%, #121418 100%); }
  .ns-pv-app { font-size: 9px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: rgba(255,255,255,.5); }
  .ns-pv-title { font-size: 12.5px; font-weight: 600; line-height: 1.2; }
  .ns-pv-text { font-size: 11px; line-height: 1.3; color: rgba(255,255,255,.75); margin-bottom: 2px; }
  .ns-pv-item { display: flex; flex-direction: column; gap: 2px; }
  .ns-pv-btn {
    position: relative; display: flex; align-items: center; gap: 6px; min-width: 0; overflow: hidden;
    border-radius: var(--ns-r); background: var(--ns-bg); box-shadow: inset 0 0 0 var(--ns-bw) var(--ns-bd);
    font-weight: 500; line-height: 1.15;
  }
  .ns-pv[data-fill="glass"] .ns-pv-btn { backdrop-filter: blur(6px); }
  .ns-pv-btn.on::before {
    content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 2.5px; background: var(--ns-strip); opacity: .9;
  }
  .ns-pv-ic { flex: none; display: grid; place-items: center; }
  .ns-pv-ic svg { display: block; width: auto; height: 100%; overflow: visible; }
  .ns-pv-name { flex: 1 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ns-pv-badge { flex: none; color: rgba(255,255,255,.6); }
  .ns-pv-badge.pill, .ns-pv-below.pill { padding: 1px 4px; border-radius: 3px; background: rgba(255,255,255,.08); }
  .ns-pv-below { align-self: flex-start; margin-left: 4px; color: rgba(255,255,255,.6); }
`;
