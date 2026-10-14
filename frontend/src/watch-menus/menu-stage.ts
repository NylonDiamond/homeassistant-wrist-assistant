// The menu editor's stage: the watch in its case with the shown menu drawn
// the way the watch draws it, and around it one label per place of the ring.
//
// The watch reads one set of style keys for every menu it opens
// (`style.quickAction` in `menu-keys.json`: the Anywhere menu, the Entity
// quick menu and the page switcher all take them, `TileGridPageView.swift`
// hands the same config to both overlays), and the page switcher adds its
// own Glow and Selected Scale. The preview draws each of them roughly as the
// watch app does (`RadialMenuComponents.swift`, `QuickActionOverlay.swift`,
// `PageSwitcherOverlay.swift`):
//
// - Background Dim: the page under the menu is a faint stand-in of rounded
//   tiles, blurred and darkened by a black veil as the dim rises (the watch
//   lays an ultra thin material and black, each scaled by the dim).
// - Glass Background: a frosted bubble behind each icon.
// - Neon Outline: a blurred ring in each slot's own color.
// - Glow: the halo of the slot the finger points at, in its color.
// - Icon Labels: a small name under each icon, over it in the lower half.
// - Finger Shadow: each icon's soft shadow cast away from the finger at the
//   centre, where a soft dark spot marks the finger.
// - Beam: from the centre toward the selected slot (else the top one), in
//   its color and intensity: Wedge a tapered cone, Aurora a wide wash,
//   Bloom a glow at the target, Ripple rings there, Wake a trail.
// - Entrance: replayed on demand by Play opening.
//
// The colors that come from the document (slots, the beam) are drawn
// inline; the stand-in page and the veil are watch drawing; the chrome
// around the watch (the labels, the tool buttons) takes only `--wa-*`
// tokens.

import { css, html, nothing, svg, type TemplateResult } from "lit";
import { uiIcon } from "../ui-icons.js";
import { renderWatchFrame } from "../watch-frame.js";
import type { JsonObject } from "../watch-pages/model.js";
import {
  MENU_RING_RADIUS,
  type MenusScreen,
  type MenusViewHost,
  addMenuSlotAt,
  deselectMenuSlot,
  menuGlyph,
  menuListLabel,
  menuScreenPoint,
  menuSlotLook,
  menuSlotName,
  sameMenuId,
  selectMenuSlotOf,
  selectedMenuSlot,
  selectedSwitcherPage,
  shownMenu,
  shownMenuList,
} from "./menu-view.js";
import {
  type MenuListRef,
  type MenuStyleSection,
  type MenusDocument,
  slotActionType,
  watchMenuActionLabel,
  watchMenuFreePositions,
  watchMenuInheritedSlots,
  watchMenuPositionLabel,
  watchMenuPositions,
  watchMenuRingPoint,
  watchMenuSlotId,
  watchMenuSlots,
  watchMenuStyleFields,
  watchMenuStyleValue,
} from "./model.js";

// ── the look the style keys give ─────────────────────────────────────────

export type MenuEntrance = "spring" | "popIn" | "fade" | "none";
export type MenuBeam = "sectorWedge" | "auroraWash" | "radiantBloom" | "ripplePulse" | "wakeWave" | "none";

/** The quick menus' style as the watch reads it: stored, else the default,
 * numbers held to their range. */
export interface MenuLook {
  readonly glass: boolean;
  readonly neon: boolean;
  readonly labels: boolean;
  readonly finger: boolean;
  readonly entrance: MenuEntrance;
  readonly dim: number;
  readonly beam: MenuBeam;
  readonly beamColor: string;
  readonly beamIntensity: number;
  readonly glow: number;
}

/** The page switcher's own two keys. */
export interface SwitcherLook {
  readonly glow: number;
  readonly scale: number;
}

const ENTRANCES: readonly MenuEntrance[] = ["spring", "popIn", "fade", "none"];
const BEAMS: readonly MenuBeam[] = ["sectorWedge", "auroraWash", "radiantBloom", "ripplePulse", "wakeWave", "none"];

/** A style key's value as the watch reads it, through the table's row. */
function styleValue(document: MenusDocument, section: MenuStyleSection, key: string): unknown {
  const field = watchMenuStyleFields(section).find((f) => f.key === key);
  return field === undefined ? undefined : watchMenuStyleValue(document, section, field);
}

function styleNumber(document: MenusDocument, section: MenuStyleSection, key: string, fallback: number): number {
  const field = watchMenuStyleFields(section).find((f) => f.key === key);
  const raw = styleValue(document, section, key);
  const n = typeof raw === "number" && Number.isFinite(raw) ? raw : typeof field?.default === "number" ? field.default : fallback;
  return Math.min(field?.max ?? Infinity, Math.max(field?.min ?? -Infinity, n));
}

function styleBool(document: MenusDocument, key: string): boolean {
  return styleValue(document, "quickAction", key) === true;
}

/** A color the preview may draw inline: `#RRGGBB` or `#RRGGBBAA`, else white. */
function safeColor(raw: unknown): string {
  return typeof raw === "string" && /^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(raw) ? raw : "#FFFFFF";
}

export function menuLook(document: MenusDocument): MenuLook {
  const entrance = styleValue(document, "quickAction", "entranceStyle");
  const beam = styleValue(document, "quickAction", "beamStyle");
  return {
    glass: styleBool(document, "showIconBubble"),
    neon: styleBool(document, "showNeonOutline"),
    labels: styleBool(document, "showContextLabel"),
    finger: styleBool(document, "showFingerShadow"),
    entrance: ENTRANCES.includes(entrance as MenuEntrance) ? (entrance as MenuEntrance) : "none",
    dim: styleNumber(document, "quickAction", "backgroundDim", 1),
    beam: BEAMS.includes(beam as MenuBeam) ? (beam as MenuBeam) : "none",
    beamColor: safeColor(styleValue(document, "quickAction", "beamColor")),
    beamIntensity: styleNumber(document, "quickAction", "beamIntensity", 0.5),
    glow: styleNumber(document, "quickAction", "glowIntensity", 0.5),
  };
}

export function switcherLook(document: MenusDocument): SwitcherLook {
  return {
    glow: styleNumber(document, "pageSwitcher", "glowIntensity", 0.5),
    scale: styleNumber(document, "pageSwitcher", "selectedScale", 1.2),
  };
}

// ── Play opening ─────────────────────────────────────────────────────────

const PLAY_KEY = "ms:play";

/** How long after a click the opening counts as playing: past it, a redraw
 * (a slot added, a zoom) does not replay it. */
const PLAY_MS = 1500;

interface PlayState {
  readonly menu: string;
  readonly count: number;
  readonly at: number;
}

/** Replay the shown menu's opening. Each click flips between two keyframe
 * names that draw the same, so the animation restarts every time. */
export function playMenuOpening(host: Pick<MenusViewHost, "uiState" | "requestUpdate">): void {
  const was = host.uiState.get(PLAY_KEY) as PlayState | undefined;
  host.uiState.set(PLAY_KEY, { menu: shownMenu(host), count: (was?.count ?? 0) + 1, at: Date.now() } satisfies PlayState);
  host.requestUpdate();
}

/** The screen's play class while the opening plays, else none. */
function playClass(host: Pick<MenusViewHost, "uiState">): string {
  const state = host.uiState.get(PLAY_KEY) as PlayState | undefined;
  if (state === undefined || state.menu !== shownMenu(host) || Date.now() - state.at > PLAY_MS) return "";
  return state.count % 2 === 1 ? "ms-play-a" : "ms-play-b";
}

// ── the places of the ring ───────────────────────────────────────────────

/** What one place of the ring holds: the list's own slots there, the one
 * drawn as the main dot and a second one nearer the centre, an All slot the
 * list takes in, and whether a slot can be added there. */
interface RingPlace {
  readonly position: string;
  readonly own: readonly JsonObject[];
  readonly main: JsonObject | undefined;
  readonly second: JsonObject | undefined;
  readonly shared: JsonObject | undefined;
  readonly free: boolean;
}

/**
 * Each place, in the tables' order. The dot at a place is the first of the
 * list's own visible slots there; else a visible All slot the list takes in;
 * else the list's own hidden slot. Any other slot of the list's own there is
 * a second, smaller dot.
 */
function ringPlaces(document: MenusDocument, ref: MenuListRef): RingPlace[] {
  const slots = watchMenuSlots(document, ref);
  const inherited = watchMenuInheritedSlots(document, ref);
  const free = new Set(watchMenuFreePositions(document, ref));
  return watchMenuPositions().map((position) => {
    const own = slots.filter((s) => s.position === position);
    const shown = own.find((s) => s.isVisible !== false);
    const shared = shown === undefined ? inherited.find((s) => s.position === position && s.isVisible !== false) : undefined;
    const main = shown ?? (shared === undefined ? own[0] : undefined);
    return { position, own, main, second: own.find((s) => s !== main), shared, free: free.has(position) };
  });
}

/** The slot the finger points at in the preview, where the beam goes and
 * the glow shows: the selected one while it is on the watch, else the top
 * one, else the first. Its place, and whether it is the list's own. */
function activePlace(places: readonly RingPlace[], selected: JsonObject | undefined): { position: string; slot: JsonObject } | undefined {
  const onWatch = (s: JsonObject | undefined) => s !== undefined && s.isVisible !== false;
  if (selected !== undefined && onWatch(selected)) {
    const id = watchMenuSlotId(selected);
    const place = places.find((p) => p.main !== undefined && sameMenuId(watchMenuSlotId(p.main), id));
    if (place !== undefined) return { position: place.position, slot: selected };
  }
  const drawn = places.flatMap((p) => {
    const slot = onWatch(p.main) ? p.main : p.shared;
    return slot === undefined ? [] : [{ position: p.position, slot }];
  });
  return drawn.find((d) => d.position === "topCenter") ?? drawn[0];
}

// ── drawing on the screen ────────────────────────────────────────────────

const round = (n: number) => Math.round(n * 100) / 100;

/** Where a point of the unit square lands, as shares of the screen and as
 * the screen's points. */
function placeOn(screen: MenusScreen, point: { x: number; y: number }): { x: number; y: number; px: number; py: number } {
  const at = menuScreenPoint(screen, point);
  return { ...at, px: at.x * screen.width, py: at.y * screen.height };
}

/**
 * A dot's style: its place, its color, how far it flies in from the centre
 * on the opening (`--fx`, `--fy`), and with Finger Shadow on the offset of
 * its shadow, cast away from the finger at the centre (`--sx`, `--sy`).
 */
function dotStyle(host: MenusViewHost, look: MenuLook, point: { x: number; y: number }, color?: string): string {
  return dotStyleAt(host, look, placeOn(host.screen, point), color);
}

/** `dotStyle` for a point already placed on the screen: shares and points. */
function dotStyleAt(host: MenusViewHost, look: MenuLook, at: { x: number; y: number; px: number; py: number }, color?: string): string {
  const { width, height } = host.screen;
  const s = host.scale;
  const parts = [`left:${at.x * 100}%`, `top:${at.y * 100}%`];
  if (color !== undefined) parts.push(`--c:${color}`);
  parts.push(`--fx:${round((width / 2 - at.px) * s)}px`, `--fy:${round((height / 2 - at.py) * s)}px`);
  if (look.finger) {
    const dx = at.px - width / 2;
    const dy = at.py - height / 2;
    const len = Math.hypot(dx, dy);
    if (len > 1) parts.push(`--sx:${round((dx / len) * 5 * s)}px`, `--sy:${round((dy / len) * 5 * s)}px`);
  }
  return parts.join(";");
}

/** A glyph's size in pixels on the preview: `points` at the preview's scale. */
function dotGlyph(host: MenusViewHost, points: number): number {
  return Math.round(points * host.scale);
}

/** A slot's name under its icon (over it in the lower half), as Icon Labels
 * draws it: 9 points, in the slot's color, clear of the preview's dot (the
 * watch draws a bare icon, so its 20 points would land on the dot's edge). */
function iconLabel(host: MenusViewHost, look: MenuLook, point: { x: number; y: number }, color: string, text: string): TemplateResult {
  const at = placeOn(host.screen, point);
  const offset = (look.glass ? 28 : 25) * (at.y > 0.5 ? -1 : 1);
  const top = (at.py + offset) / host.screen.height;
  return html`<span class="ms-name" aria-hidden="true" style=${`left:${at.x * 100}%;top:${round(top * 10000) / 100}%;--c:${color}`}>${text}</span>`;
}

/** The stand-in page under the menu: a title and six rounded tiles in muted
 * colors, in the screen's points. */
function standInPage(screen: MenusScreen): TemplateResult {
  const { width: w, height: h } = screen;
  const m = w * 0.08;
  const gap = w * 0.045;
  const top = h * 0.18;
  const tw = (w - m * 2 - gap) / 2;
  const th = (h - top - m - gap * 2) / 3;
  const tiles = [0, 1, 2, 3, 4, 5].map((i) => {
    const x = m + (i % 2) * (tw + gap);
    const y = top + Math.floor(i / 2) * (th + gap);
    return svg`<rect class=${`ms-tile t${i % 4}`} x=${round(x)} y=${round(y)} width=${round(tw)} height=${round(th)} rx=${round(w * 0.06)}></rect>`;
  });
  return html`<svg class="ms-page" viewBox=${`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
    <rect class="ms-tile ms-title" x=${round(m)} y=${round(h * 0.075)} width=${round(w * 0.4)} height=${round(h * 0.045)} rx=${round(h * 0.0225)}></rect>
    ${tiles}
  </svg>`;
}

/** A Gaussian blur over the whole screen, `deviation` in the screen's
 * points. */
function blurFilter(id: string, deviation: number, screen: MenusScreen): TemplateResult {
  return svg`<filter id=${id} filterUnits="userSpaceOnUse" x="0" y="0" width=${screen.width} height=${screen.height}>
    <feGaussianBlur stdDeviation=${deviation}></feGaussianBlur></filter>`;
}

/** Three stops of a radial wash, the watch's opacities times `i`. */
function washGradient(id: string, color: string, a: number, b: number): TemplateResult {
  return svg`<radialGradient id=${id}>
    <stop offset="0" stop-color=${color} stop-opacity=${round(a)}></stop>
    <stop offset="0.5" stop-color=${color} stop-opacity=${round(b)}></stop>
    <stop offset="1" stop-color=${color} stop-opacity="0"></stop></radialGradient>`;
}

/**
 * The beam from the finger at the centre toward `to`, in the screen's points,
 * as the watch draws each style (sizes and opacities from
 * `RadialMenuComponents.swift`; the watch's blur radius is taken as twice
 * the deviation). Ripple and Wake move on the watch; here they stand still.
 */
export function beamArt(look: MenuLook, screen: MenusScreen, to: { x: number; y: number }): TemplateResult | typeof nothing {
  if (look.beam === "none") return nothing;
  const c = look.beamColor;
  const i = look.beamIntensity;
  const cx = screen.width / 2;
  const cy = screen.height / 2;
  const dx = to.x - cx;
  const dy = to.y - cy;
  const dist = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const ray = (spread: number, length: number) => `${round(cx + Math.cos(angle + spread) * length)},${round(cy + Math.sin(angle + spread) * length)}`;
  const tx = round(to.x);
  const ty = round(to.y);
  let art: TemplateResult;
  switch (look.beam) {
    case "sectorWedge": {
      const spread = Math.PI / 4;
      art = svg`${blurFilter("ms-b8", 8, screen)}${blurFilter("ms-b3", 3, screen)}
        <polygon points=${`${cx},${cy} ${ray(-spread / 2, dist * 1.2)} ${ray(spread / 2, dist * 1.2)}`} fill=${c} fill-opacity=${round(0.2 * i)} filter="url(#ms-b8)"></polygon>
        <polygon points=${`${cx},${cy} ${ray(-spread * 0.3, dist)} ${ray(spread * 0.3, dist)}`} fill=${c} fill-opacity=${round(0.5 * i)} filter="url(#ms-b3)"></polygon>`;
      break;
    }
    case "auroraWash":
      art = svg`${blurFilter("ms-b7", 7, screen)}${blurFilter("ms-b10", 10, screen)}${washGradient("ms-wash", c, 0.35 * i, 0.18 * i)}
        <circle cx=${round((cx + to.x) / 2)} cy=${round((cy + to.y) / 2)} r="140" fill="url(#ms-wash)" filter="url(#ms-b7)"></circle>
        <circle cx=${tx} cy=${ty} r="40" fill=${c} fill-opacity=${round(0.25 * i)} filter="url(#ms-b10)"></circle>`;
      break;
    case "radiantBloom":
      art = svg`${blurFilter("ms-b4", 4, screen)}${blurFilter("ms-b5", 5, screen)}${washGradient("ms-bloom", c, 0.4 * i, 0.15 * i)}
        <circle cx=${tx} cy=${ty} r="80" fill="url(#ms-bloom)" filter="url(#ms-b4)"></circle>
        <circle cx=${tx} cy=${ty} r="25" fill=${c} fill-opacity=${round(0.3 * i)} filter="url(#ms-b5)"></circle>`;
      break;
    case "ripplePulse":
      art = svg`${blurFilter("ms-b6", 6, screen)}
        <circle cx=${tx} cy=${ty} r="30" fill=${c} fill-opacity=${round(0.15 * i)} filter="url(#ms-b6)"></circle>
        ${[0.15, 0.55].map((t) => svg`<circle cx=${tx} cy=${ty} r=${round((30 + t * 100) / 2)} fill="none" stroke=${c}
          stroke-opacity=${round((1 - t) * 0.45 * i)} stroke-width=${round(2 - t * 1.2)}></circle>`)}`;
      break;
    case "wakeWave":
      art = svg`${blurFilter("ms-b4", 4, screen)}
        <linearGradient id="ms-wake" gradientUnits="userSpaceOnUse" x1=${cx} y1=${cy} x2=${tx} y2=${ty}>
          <stop offset="0" stop-color=${c} stop-opacity="0"></stop><stop offset="1" stop-color=${c} stop-opacity=${round(0.5 * i)}></stop></linearGradient>
        <line x1=${cx} y1=${cy} x2=${tx} y2=${ty} stroke="url(#ms-wake)" stroke-width="1.5" stroke-linecap="round"></line>
        ${[0.35, 0.6, 0.85].map((f) => {
          const life = 1 - f;
          return svg`<circle cx=${round(cx + dx * f)} cy=${round(cy + dy * f)} r=${round((20 + life * 50) / 2)} fill="none" stroke=${c}
            stroke-opacity=${round((1 - life) * 0.5 * i)} stroke-width=${round(Math.max(1.5 - life * 1.2, 0.3))}></circle>`;
        })}
        <circle cx=${tx} cy=${ty} r="18" fill=${c} fill-opacity=${round(0.25 * i)} filter="url(#ms-b4)"></circle>`;
      break;
  }
  return svg`<g class="ms-beam">${art}</g>`;
}

/** The screen's look, as classes and custom properties: the opening, the
 * effects switched on, the veil's strength and the glow. */
function screenLook(host: MenusViewHost, look: MenuLook): { classes: string; style: string } {
  const classes = [
    `ms-enter-${look.entrance}`,
    look.entrance === "none" ? "" : playClass(host),
    look.glass ? "ms-glass" : "",
    look.neon ? "ms-neon" : "",
    look.finger ? "ms-finger" : "",
  ].filter((c) => c !== "").join(" ");
  const style = [
    `--ms-veil:${round(look.dim * 0.85)}`,
    `--ms-blur:${round(2 + look.dim * 4)}px`,
    `--ms-g-r:${round(15 * look.glow)}px`,
    `--ms-g-a:${Math.round(60 * look.glow)}%`,
  ].join(";");
  return { classes, style };
}

/**
 * The watch screen in its case, at the screen's real proportions: the
 * stand-in page under its veil, the beam, a dashed guide ring, the finger at
 * the centre, and `content` over them (dots placed in shares of the screen).
 * Sizes follow the scale through `--me-s`.
 */
function renderScreen(host: MenusViewHost, label: string, look: MenuLook, content: unknown, extra: {
  beamTo?: { x: number; y: number } | undefined;
  classes?: string;
  style?: string;
} = {}): TemplateResult {
  const { width, height } = host.screen;
  const scale = host.scale;
  const side = Math.min(width, height);
  const lookOf = screenLook(host, look);
  const style = [`width:${Math.round(width * scale)}px;height:${Math.round(height * scale)}px;--me-s:${scale}`, lookOf.style, extra.style ?? ""]
    .filter((s) => s !== "").join(";");
  const box = html`<div class=${`me-screen ms-screen ${lookOf.classes} ${extra.classes ?? ""}`.trim()} role="group" aria-label=${label} style=${style}>
    <div class="ms-backdrop" aria-hidden="true">${standInPage(host.screen)}</div>
    <div class="ms-veil" aria-hidden="true"></div>
    <svg class="me-screen-bg" viewBox=${`0 0 ${width} ${height}`} aria-hidden="true">
      ${extra.beamTo === undefined ? nothing : beamArt(look, host.screen, extra.beamTo)}
      <circle cx=${width / 2} cy=${height / 2} r=${side * MENU_RING_RADIUS} class="me-track"></circle>
      ${look.finger ? svg`<radialGradient id="ms-finger-g"><stop offset="0" class="ms-finger-in"></stop><stop offset="1" class="ms-finger-out"></stop></radialGradient>
        <circle cx=${width / 2} cy=${height / 2} r=${round(side * 0.13)} fill="url(#ms-finger-g)" class="ms-finger-spot"></circle>` : nothing}
      <circle cx=${width / 2} cy=${height / 2} r=${side * 0.05} class="me-center"></circle>
    </svg>
    ${content}
  </div>`;
  return renderWatchFrame({ width, height }, scale, box, label);
}

/**
 * The ring preview, one place at a time: the main dot (the list's own slot,
 * a button; or an All slot the list takes in, dashed, not a button; or an
 * add button where the place is free), a second own slot as a smaller dot
 * nearer the centre, and a main dot of the list's own carries a count of
 * the list's slots there (the phone's climate defaults put two at top
 * centre). With Icon Labels on, each slot on the watch has its name.
 */
function renderRing(host: MenusViewHost, ref: MenuListRef, selected: JsonObject | undefined, label: string): TemplateResult {
  const look = menuLook(host.document);
  const places = ringPlaces(host.document, ref);
  const active = activePlace(places, selected);
  const activeId = active === undefined ? undefined : watchMenuSlotId(active.slot);
  const selectedId = selected === undefined ? undefined : watchMenuSlotId(selected);
  const ringPoint = (position: string, radius = MENU_RING_RADIUS) => watchMenuRingPoint(position, radius);
  const isActive = (slot: JsonObject) => activeId !== undefined && sameMenuId(watchMenuSlotId(slot), activeId);
  const ownDot = (slot: JsonObject, position: string, point: { x: number; y: number }, extra: string, count: number): TemplateResult => {
    const slotLook = menuSlotLook(slot);
    const id = watchMenuSlotId(slot);
    const on = selectedId !== undefined && sameMenuId(id, selectedId);
    const hidden = slot.isVisible === false;
    const title = `${watchMenuPositionLabel(position)}: ${watchMenuActionLabel(slotActionType(slot))}${hidden ? ", hidden" : ""}`;
    const classes = ["me-dot", extra, on ? "on" : "", hidden ? "off" : "", isActive(slot) && extra === "" ? "ms-active" : ""].filter((c) => c !== "").join(" ");
    return html`<button type="button" class=${classes} style=${dotStyle(host, look, point, slotLook.color)}
      title=${title} aria-label=${title} aria-pressed=${on ? "true" : "false"} @click=${() => selectMenuSlotOf(host, ref, id)}>
      ${menuGlyph(host, slotLook.icon, dotGlyph(host, extra === "" ? 15 : 11), slotLook.color)}${count > 1 ? html`<span class="me-count" aria-hidden="true">${count}</span>` : nothing}</button>`;
  };
  const dots = places.map((place) => {
    const point = ringPoint(place.position);
    if (point === undefined) return nothing;
    let dot: TemplateResult | typeof nothing = nothing;
    let named: JsonObject | undefined;
    if (place.main !== undefined) {
      dot = ownDot(place.main, place.position, point, "", place.own.length);
      if (place.main.isVisible !== false) named = place.main;
    } else if (place.shared !== undefined) {
      const slotLook = menuSlotLook(place.shared);
      const title = `${watchMenuPositionLabel(place.position)}: ${watchMenuActionLabel(slotActionType(place.shared))}, from All`;
      dot = html`<span class=${`me-dot inh${isActive(place.shared) ? " ms-active" : ""}`} style=${dotStyle(host, look, point, slotLook.color)} title=${title}>
        ${menuGlyph(host, slotLook.icon, dotGlyph(host, 13), slotLook.color)}</span>`;
      named = place.shared;
    } else if (place.free) {
      const where = watchMenuPositionLabel(place.position);
      dot = html`<button type="button" class="me-dot free" style=${dotStyle(host, look, point)} ?disabled=${host.busy}
        title=${`Add a slot at ${where}`} aria-label=${`Add a slot at ${where}`}
        @click=${() => addMenuSlotAt(host, ref, place.position)}>${uiIcon("plus")}</button>`;
    }
    const inner = place.second === undefined ? undefined : ringPoint(place.position, 0.2);
    const second = place.second === undefined || inner === undefined ? nothing : ownDot(place.second, place.position, inner, "two", 0);
    const name = look.labels && named !== undefined ? iconLabel(host, look, point, menuSlotLook(named).color, menuSlotName(host, named)) : nothing;
    return html`${dot}${second}${name}`;
  });
  const target = active === undefined ? undefined : ringPoint(active.position);
  const beamTo = placeOn(host.screen, target ?? { x: 0.5, y: 0.5 - MENU_RING_RADIUS });
  return renderScreen(host, `${label} on the watch`, look, dots, { beamTo: { x: beamTo.px, y: beamTo.py } });
}

/** The watch's own screen scales (`WatchScreenMetrics`): each axis against
 * the 45 mm screen of 198 by 242 points, held to 0.82 to 1.18. */
function screenScales(screen: MenusScreen): { w: number; h: number } {
  const clamp = (n: number) => Math.min(1.18, Math.max(0.82, n));
  return { w: clamp(screen.width / 198), h: clamp(screen.height / 242) };
}

/**
 * Where page `index` of `count` sits in the page switcher, in the screen's
 * points: the watch's `dynamicSlotPosition`. Eight anchors trace a track
 * near the screen's edge (`textRadialSlotPosition`), counterclockwise from
 * top centre, and the pages are spread along it at equal distances.
 */
export function switcherTrackPoint(screen: MenusScreen, index: number, count: number): { x: number; y: number } {
  const { width, height } = screen;
  const k = screenScales(screen);
  const left = 34 * k.w;
  const right = width - 34 * k.w;
  const top = 52 * k.h;
  const bottom = height - 30 * k.h;
  const mid = (top + bottom) / 2;
  const cx = width / 2;
  const ix = 18 * k.w;
  const iy = 8 * k.h;
  const anchors = [
    { x: cx, y: top - 14 * k.h }, // top centre
    { x: left + ix, y: top + iy }, // top left
    { x: left, y: mid }, // left centre
    { x: left + ix, y: bottom - iy }, // bottom left
    { x: cx, y: bottom + 8 * k.h }, // bottom centre
    { x: right - ix, y: bottom - iy }, // bottom right
    { x: right, y: mid }, // right centre
    { x: right - ix, y: top + iy }, // top right
  ];
  if (count <= 1) return anchors[0]!;
  const lengths = [0];
  for (let i = 1; i <= anchors.length; i++) {
    const a = anchors[i - 1]!;
    const b = anchors[i % anchors.length]!;
    lengths.push(lengths[i - 1]! + Math.hypot(b.x - a.x, b.y - a.y));
  }
  const total = lengths[anchors.length]!;
  const arc = ((index * total) / count) % total;
  for (let i = 0; i < anchors.length; i++) {
    const from = lengths[i]!;
    const to = lengths[i + 1]!;
    if (arc >= from && arc <= to) {
      const t = to > from ? (arc - from) / (to - from) : 0;
      const a = anchors[i]!;
      const b = anchors[(i + 1) % anchors.length]!;
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  return anchors[0]!;
}

/** What a page's bubble says: the first four characters of its switcher
 * text, as the watch cuts it (`text.prefix(4)`). */
export function switcherBubbleText(text: string): string {
  return [...text].slice(0, 4).join("").trim();
}

/**
 * The page switcher as the watch draws it (`PageSwitcherOverlay`,
 * `RadialMenuTextIcon`): the pages spread along the track near the screen's
 * edge, each a small round bubble with the first four letters of its text
 * (or its icon) in its color, a soft glow by Glow behind it. Without Glass
 * the bubble is a faint white disc and the page you are on has a ring in its
 * color; with Glass it is a larger frosted bubble. The page the finger
 * points at (the one picked in the Pages card, else the first) is drawn at
 * Selected Scale, lit in its color, with its name at the top. No guide ring
 * and no centre dot: the watch draws neither here. A page is picked in that
 * card, so nothing here is a button.
 */
function renderSwitcherScreen(host: MenusViewHost): TemplateResult {
  const look = menuLook(host.document);
  const own = switcherLook(host.document);
  const pages = host.switcherPages;
  const picked = selectedSwitcherPage(host);
  const activeIndex = Math.max(0, picked === undefined ? 0 : pages.findIndex((p) => sameMenuId(p.id, picked.id)));
  const { width, height } = host.screen;
  const share = (pt: { x: number; y: number }) => ({ x: pt.x / width, y: pt.y / height, px: pt.x, py: pt.y });
  const content = pages.length === 0
    ? html`<p class="me-screen-note">No pages in the switcher yet.</p>`
    : pages.map((page, i) => {
      const at = share(switcherTrackPoint(host.screen, i, pages.length));
      const active = i === activeIndex;
      const current = i === 0 && !active;
      // The radial glow behind the bubble: 70% of Glow on the page the
      // finger points at, 40% on the page you are on, 15% on the rest.
      const glow = Math.round((active ? 0.7 : current ? 0.4 : 0.15) * own.glow * 100);
      const style = [
        dotStyleAt(host, look, at, page.color),
        `--ms-ga:${glow}%`,
        `--ms-gr:${active ? 45 : 30}`,
        `--ms-k:${active ? own.scale : 1}`,
      ].join(";");
      const classes = ["ms-sw", active ? "ms-active" : "", current ? "ms-current" : ""].filter((c) => c !== "").join(" ");
      const face = page.text === undefined
        ? menuGlyph(host, page.icon, dotGlyph(host, look.glass ? 18 : active ? 16 : 14), active && !look.glass ? "white" : page.color)
        : html`<span class="ms-sw-text">${switcherBubbleText(page.text)}</span>`;
      return html`<span class=${classes} style=${style} title=${page.name} aria-hidden="true">
        <i class="ms-sw-glow"></i><i class="ms-sw-disc"></i>${face}</span>`;
    });
  const activePage = pages[activeIndex];
  const name = activePage === undefined ? nothing
    : html`<span class="ms-sw-name" style=${`top:${round(((8 * screenScales(host.screen).h) / height) * 10000) / 100}%`}>${activePage.name}</span>`;
  const target = pages.length === 0 ? undefined : switcherTrackPoint(host.screen, activeIndex, pages.length);
  return renderScreen(host, "Page switcher on the watch", look, html`${content}${name}`, {
    beamTo: target,
    classes: "ms-switcher",
  });
}

/** The shown menu on the watch, for the canvas: its ring with the selected
 * slot lit, or the page switcher. */
export function renderMenuScreen(host: MenusViewHost): TemplateResult {
  if (shownMenu(host) === "switcher") return renderSwitcherScreen(host);
  const ref = shownMenuList(host);
  if (ref === undefined) {
    return renderScreen(host, "Entity quick menu on the watch", menuLook(host.document), html`<p class="me-screen-note">Add an entity to edit its menu.</p>`);
  }
  return renderRing(host, ref, selectedMenuSlot(host, ref), menuListLabel(host, ref));
}

// ── the labels around the watch ──────────────────────────────────────────

/** Where each place's label sits around the watch. */
const PLACE_SIDE: Readonly<Record<string, "left" | "right" | "top" | "bottom">> = {
  topLeft: "left",
  leftCenter: "left",
  bottomLeft: "left",
  topRight: "right",
  rightCenter: "right",
  bottomRight: "right",
  topCenter: "top",
  bottomCenter: "bottom",
};

function slotLabel(host: MenusViewHost, ref: MenuListRef, slot: JsonObject, selected: JsonObject | undefined): TemplateResult {
  const id = watchMenuSlotId(slot);
  const on = selected !== undefined && sameMenuId(id, watchMenuSlotId(selected));
  const hidden = slot.isVisible === false;
  const name = menuSlotName(host, slot);
  const line = `${watchMenuActionLabel(slotActionType(slot))}${hidden ? ", hidden" : ""}`;
  return html`<button type="button" class=${`ms-label${on ? " on" : ""}${hidden ? " off" : ""}`} data-slot=${id}
    style=${`--k:${menuSlotLook(slot).color}`} aria-pressed=${on ? "true" : "false"}
    @click=${() => selectMenuSlotOf(host, ref, id)}>
    <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${name}</b><small>${line}</small></span></button>`;
}

/** One place's label: a button per slot of the list's own there, an All
 * slot the list takes in (dashed, not a button), or Add a slot. */
function placeLabel(host: MenusViewHost, ref: MenuListRef, place: RingPlace, selected: JsonObject | undefined): TemplateResult {
  const where = watchMenuPositionLabel(place.position);
  const items: TemplateResult[] = place.own.map((slot) => slotLabel(host, ref, slot, selected));
  if (place.shared !== undefined) {
    items.push(html`<span class="ms-label ms-inh" style=${`--k:${menuSlotLook(place.shared).color}`}>
      <span class="ms-k" aria-hidden="true"></span><span class="ms-t"><b>${menuSlotName(host, place.shared)}</b><small>From the All menu</small></span></span>`);
  }
  if (items.length === 0 && place.free) {
    items.push(html`<button type="button" class="ms-label ms-add" ?disabled=${host.busy} aria-label=${`Add a slot at ${where}`}
      @click=${() => addMenuSlotAt(host, ref, place.position)}>${uiIcon("plus")}<span class="ms-t"><b>Add a slot</b></span></button>`);
  }
  return html`<div class=${`ms-place ms-at-${place.position} ms-${PLACE_SIDE[place.position] ?? "top"}`} data-place=${place.position}
    role="group" aria-label=${where}>${items}</div>`;
}

/**
 * The stage's body: the watch, and for the Anywhere menu and the Entity
 * quick menu one label per place around it (left of the watch for the left
 * places, right of it for the right, the top and bottom over and under it),
 * a two column list under it on a narrow stage. A label picks its slot as
 * its dot does.
 */
export function renderMenuStage(host: MenusViewHost): TemplateResult {
  const screen = renderMenuScreen(host);
  const ref = shownMenu(host) === "switcher" ? undefined : shownMenuList(host);
  if (ref === undefined) return html`<div class="me-stage-body">${screen}</div>`;
  const selected = selectedMenuSlot(host, ref);
  return html`<div class="me-stage-body ms-body"><div class="ms-around">
    <div class="ms-watch">${screen}</div>
    ${ringPlaces(host.document, ref).map((place) => placeLabel(host, ref, place, selected))}
  </div></div>`;
}

// ── the tool strip and the foot ──────────────────────────────────────────

const PLAY_GLYPH = html`<svg class="ui-icon ms-play-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"></path></svg>`;

/** The stage tools for the shown menu, before the watch's size: Add (a slot
 * at the first free place) and, while there is an opening to see, Play
 * opening. */
export function renderMenuStageTools(host: MenusViewHost): TemplateResult {
  const menu = shownMenu(host);
  const look = menuLook(host.document);
  let add: TemplateResult | typeof nothing = nothing;
  if (menu !== "switcher") {
    const ref = shownMenuList(host);
    const free = ref === undefined ? [] : watchMenuFreePositions(host.document, ref);
    const title = ref === undefined ? "Add an entity first, in the menu's settings."
      : free.length === 0 ? "Every place around the ring is taken." : "Add a slot at the first free place";
    add = html`<button class="tb ms-add-slot" aria-label="Add slot" ?disabled=${host.busy || ref === undefined || free.length === 0}
      title=${title} @click=${() => { if (ref !== undefined) addMenuSlotAt(host, ref); }}>${uiIcon("plus")}<span class="word keep">Add</span></button>`;
  }
  const play = look.entrance === "none" ? nothing
    : html`<button class="tb ms-play" title="Play the menu's opening as the watch shows it" @click=${() => playMenuOpening(host)}>${PLAY_GLYPH}<span class="word">Play opening</span></button>`;
  if (add === nothing && play === nothing) return html``;
  return html`${add}${play}<span class="tb-sep" aria-hidden="true"></span>`;
}

/** Under the hint, for the Entity quick menu with a slot selected: the way
 * back to the menu's own settings, where its type or entity is picked. */
export function renderMenuStageFoot(host: MenusViewHost): TemplateResult | typeof nothing {
  if (shownMenu(host) !== "entity") return nothing;
  const ref = shownMenuList(host);
  if (ref === undefined || selectedMenuSlot(host, ref) === undefined) return nothing;
  return html`<span class="ms-foot"><button type="button" class="ms-change" title="Pick the type or the entity in the menu's settings"
    @click=${() => deselectMenuSlot(host)}>Change the type or entity</button></span>`;
}

// ── styles ───────────────────────────────────────────────────────────────

/** The stage's rules, after `menuViewStyles` in the editor's sheet. */
export const menuStageStyles = css`
  /* The watch screen's layers: the stand-in page, its veil, then the
     guide ring, the beam and the dots. Watch drawing, not panel chrome. */
  .ms-screen { isolation: isolate; }
  .ms-backdrop, .ms-veil { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; }
  .ms-backdrop { filter: blur(calc(var(--ms-blur, 4px) * var(--me-s, 1))); }
  .ms-page { display: block; width: 100%; height: 100%; }
  .ms-tile { fill: color-mix(in srgb, var(--wa-hue-grey) 45%, black); }
  .ms-tile.t0 { fill: color-mix(in srgb, var(--wa-hue-blue) 45%, black); }
  .ms-tile.t1 { fill: color-mix(in srgb, var(--wa-hue-green) 40%, black); }
  .ms-tile.t2 { fill: color-mix(in srgb, var(--wa-hue-orange) 40%, black); }
  .ms-tile.ms-title { fill: color-mix(in srgb, white 30%, black); }
  .ms-veil { background: black; opacity: var(--ms-veil, .85); }
  .ms-finger-in { stop-color: black; stop-opacity: .55; }
  .ms-finger-out { stop-color: black; stop-opacity: 0; }

  /* Every dot of the watch: its picked ring, neon, glow and glass shadow
     are one list of shadows, each part off unless its effect is on. */
  .ms-screen .me-dot, .ms-screen .me-page {
    transform: translate(-50%, -50%) scale(var(--ms-k, 1));
    box-shadow: var(--ms-ring, 0 0 transparent), var(--ms-neon, 0 0 transparent), var(--ms-glow, 0 0 transparent), var(--ms-cast, 0 0 transparent);
  }
  .ms-screen .me-dot.on, .ms-screen .me-page.on { --ms-ring: 0 0 0 2px black, 0 0 0 4px var(--me-mark); }
  .ms-screen .me-dot:focus-visible { --ms-ring: 0 0 0 2px black, 0 0 0 4px var(--me-mark), var(--wa-ring); }
  /* Each icon's soft glow in its color, cast away from the finger with
     Finger Shadow on. */
  .ms-screen .me-dot:not(.free) > :not(.me-count) {
    filter: drop-shadow(var(--sx, 0px) var(--sy, 0px) calc(3px * var(--me-s, 1)) color-mix(in srgb, var(--c, white) 60%, transparent));
  }
  /* Glass Background: a frosted bubble behind each icon. */
  .ms-glass .me-dot:not(.free), .ms-glass .me-page {
    background: color-mix(in srgb, white 16%, transparent);
    -webkit-backdrop-filter: blur(calc(6px * var(--me-s, 1))); backdrop-filter: blur(calc(6px * var(--me-s, 1)));
    border-color: color-mix(in srgb, var(--c, white) 45%, transparent);
    --ms-cast: var(--sx, 0px) var(--sy, 0px) calc(10px * var(--me-s, 1)) color-mix(in srgb, var(--c, white) 50%, transparent);
  }
  /* Neon Outline: a blurred ring in the slot's color. */
  .ms-neon .me-dot:not(.free), .ms-neon .me-page {
    border-color: var(--c, white);
    --ms-neon: 0 0 calc(4px * var(--me-s, 1)) calc(1px * var(--me-s, 1)) color-mix(in srgb, var(--c, white) 70%, transparent);
  }
  /* Glow: the halo of the slot the finger points at. */
  .ms-screen:not(.ms-switcher) .me-dot.ms-active {
    --ms-glow: 0 0 calc(var(--ms-g-r, 0px) * var(--me-s, 1)) calc(var(--ms-g-r, 0px) * .3 * var(--me-s, 1)) color-mix(in srgb, var(--c, white) var(--ms-g-a, 0%), transparent);
  }
  /* The page switcher, in the watch's points times --me-s: no guide ring,
     no centre dot, no finger spot. Each page is a bubble (RadialMenuTextIcon):
     an 80 point glow by Glow, a 36 point faint disc, and four letters. */
  .ms-switcher .me-track, .ms-switcher .me-center, .ms-switcher .ms-finger-spot { display: none; }
  .ms-sw {
    position: absolute; transform: translate(-50%, -50%) scale(var(--ms-k, 1));
    width: calc(80px * var(--me-s, 1)); height: calc(80px * var(--me-s, 1));
    display: grid; place-items: center; pointer-events: none;
  }
  .ms-sw > * { grid-area: 1 / 1; }
  /* The glass disc's blur and the neon ring's blur paint in a layer of their
     own, over anything plain: the letters (or icon) are lifted above both. */
  .ms-sw > :not(.ms-sw-glow, .ms-sw-disc) { position: relative; z-index: 1; }
  .ms-sw.ms-active { z-index: 1; }
  .ms-sw-glow {
    width: 100%; height: 100%; border-radius: 50%;
    background: radial-gradient(circle closest-side, color-mix(in srgb, var(--c, white) var(--ms-ga, 0%), transparent) calc(8 / 40 * 100%), transparent calc(var(--ms-gr, 30) / 40 * 100%));
  }
  .ms-sw-disc {
    width: calc(36px * var(--me-s, 1)); height: calc(36px * var(--me-s, 1)); border-radius: 50%; box-sizing: border-box;
    background: color-mix(in srgb, white 10%, transparent);
    box-shadow: var(--sx, 0px) var(--sy, 0px) calc(6px * var(--me-s, 1)) color-mix(in srgb, var(--c, white) 30%, transparent);
  }
  .ms-sw.ms-current .ms-sw-disc {
    background: color-mix(in srgb, white 20%, transparent);
    outline: calc(2px * var(--me-s, 1)) solid color-mix(in srgb, var(--c, white) 60%, transparent); outline-offset: calc(1px * var(--me-s, 1));
  }
  .ms-sw.ms-active .ms-sw-disc { background: color-mix(in srgb, var(--c, white) 30%, transparent); }
  .ms-sw-text {
    font-family: ui-rounded, "SF Pro Rounded", system-ui, sans-serif; font-weight: 700; white-space: nowrap;
    font-size: calc(12px * var(--me-s, 1)); line-height: 1; color: var(--c, white);
    text-shadow: var(--sx, 0px) var(--sy, 0px) calc(6px * var(--me-s, 1)) color-mix(in srgb, var(--c, white) 60%, transparent);
  }
  .ms-sw.ms-active .ms-sw-text { font-size: calc(14px * var(--me-s, 1)); color: white; }
  /* Glass: a 44 point frosted bubble, the letters at 16 points in the color. */
  .ms-glass .ms-sw-disc {
    width: calc(44px * var(--me-s, 1)); height: calc(44px * var(--me-s, 1));
    background: color-mix(in srgb, white 14%, transparent); outline: none;
    border: calc(.5px * var(--me-s, 1)) solid color-mix(in srgb, var(--c, white) 20%, transparent);
    -webkit-backdrop-filter: blur(calc(8px * var(--me-s, 1))); backdrop-filter: blur(calc(8px * var(--me-s, 1)));
    box-shadow: var(--sx, 0px) var(--sy, 0px) calc(10px * var(--me-s, 1)) color-mix(in srgb, var(--c, white) 50%, transparent);
  }
  .ms-glass .ms-sw.ms-active .ms-sw-disc { border-color: color-mix(in srgb, var(--c, white) 50%, transparent); }
  .ms-glass .ms-sw-text, .ms-glass .ms-sw.ms-active .ms-sw-text { font-size: calc(16px * var(--me-s, 1)); color: var(--c, white); }
  /* Neon: a blurred ring in the page's color. */
  .ms-neon .ms-sw::after {
    content: ""; grid-area: 1 / 1; border-radius: 50%; filter: blur(calc(3px * var(--me-s, 1)));
    width: calc(42px * var(--me-s, 1)); height: calc(42px * var(--me-s, 1));
    border: calc(1.5px * var(--me-s, 1)) solid color-mix(in srgb, var(--c, white) 70%, transparent);
  }
  .ms-glass.ms-neon .ms-sw::after { width: calc(46px * var(--me-s, 1)); height: calc(46px * var(--me-s, 1)); }
  /* The name of the page the finger points at, at the top of the screen. */
  .ms-sw-name {
    position: absolute; left: 50%; transform: translate(-50%, -50%); white-space: nowrap; pointer-events: none;
    font-family: ui-rounded, "SF Pro Rounded", system-ui, sans-serif; font-weight: 600;
    font-size: calc(13px * var(--me-s, 1)); color: white; text-shadow: 0 0 calc(4px * var(--me-s, 1)) black;
  }
  /* Icon Labels: the name under each icon. */
  .ms-name {
    position: absolute; transform: translate(-50%, -50%); pointer-events: none; white-space: nowrap;
    font-size: calc(9px * var(--me-s, 1)); font-weight: 500; line-height: 1.2;
    color: color-mix(in srgb, var(--c, white) 90%, transparent);
  }

  /* Play opening: two keyframe names that draw the same, so each click
     starts the animation again. */
  @keyframes ms-fly-a { from { opacity: 0; transform: translate(calc(-50% + var(--fx, 0px)), calc(-50% + var(--fy, 0px))) scale(.3); } }
  @keyframes ms-fly-b { from { opacity: 0; transform: translate(calc(-50% + var(--fx, 0px)), calc(-50% + var(--fy, 0px))) scale(.3); } }
  @keyframes ms-pop-a { from { transform: translate(-50%, -50%) scale(.1); } }
  @keyframes ms-pop-b { from { transform: translate(-50%, -50%) scale(.1); } }
  @keyframes ms-fade-a { from { opacity: 0; } }
  @keyframes ms-fade-b { from { opacity: 0; } }
  .ms-play-a.ms-enter-spring :is(.me-dot:not(.free), .me-page, .ms-sw) { animation: ms-fly-a .5s cubic-bezier(.34, 1.56, .64, 1) backwards; }
  .ms-play-b.ms-enter-spring :is(.me-dot:not(.free), .me-page, .ms-sw) { animation: ms-fly-b .5s cubic-bezier(.34, 1.56, .64, 1) backwards; }
  .ms-play-a.ms-enter-popIn :is(.me-dot:not(.free), .me-page, .ms-sw) { animation: ms-pop-a .35s cubic-bezier(.3, 1.9, .55, 1) backwards; }
  .ms-play-b.ms-enter-popIn :is(.me-dot:not(.free), .me-page, .ms-sw) { animation: ms-pop-b .35s cubic-bezier(.3, 1.9, .55, 1) backwards; }
  .ms-play-a.ms-enter-fade :is(.me-dot:not(.free), .me-page, .ms-sw) { animation: ms-fade-a .3s ease-in backwards; }
  .ms-play-b.ms-enter-fade :is(.me-dot:not(.free), .me-page, .ms-sw) { animation: ms-fade-b .3s ease-in backwards; }
  .ms-play-a :is(.ms-veil, .ms-name, .ms-beam) { animation: ms-fade-a .35s ease-out backwards; }
  .ms-play-b :is(.ms-veil, .ms-name, .ms-beam) { animation: ms-fade-b .35s ease-out backwards; }
  @media (prefers-reduced-motion: reduce) {
    .ms-screen, .ms-screen * { animation: none !important; }
  }

  /* The labels around the watch: the left places left of it, right
     aligned; the right places right of it; the top and bottom over and
     under it. */
  .me-stage-body.ms-body { justify-content: safe center; }
  .ms-around {
    display: grid; flex: none; align-items: center;
    grid-template-columns: minmax(120px, 190px) auto minmax(120px, 190px);
    grid-template-rows: auto 1fr auto 1fr auto;
    column-gap: 14px; row-gap: 8px;
  }
  .ms-watch { grid-area: 2 / 2 / 5 / 3; display: flex; justify-content: center; }
  .ms-place { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .ms-at-topCenter { grid-area: 1 / 2; }
  .ms-at-bottomCenter { grid-area: 5 / 2; }
  .ms-at-topLeft { grid-area: 2 / 1; }
  .ms-at-leftCenter { grid-area: 3 / 1; }
  .ms-at-bottomLeft { grid-area: 4 / 1; }
  .ms-at-topRight { grid-area: 2 / 3; }
  .ms-at-rightCenter { grid-area: 3 / 3; }
  .ms-at-bottomRight { grid-area: 4 / 3; }
  .ms-top, .ms-bottom { justify-self: center; align-items: center; }
  .ms-left { justify-self: end; align-items: flex-end; }
  .ms-right { justify-self: start; align-items: flex-start; }
  .ms-label {
    display: flex; align-items: flex-start; gap: 8px; width: max-content; max-width: 100%; min-width: 0; box-sizing: border-box;
    margin: 0; padding: 5px 10px 6px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
    background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 12.5px; line-height: 1.3; text-align: left; cursor: pointer;
  }
  .ms-left .ms-label { flex-direction: row-reverse; text-align: right; }
  button.ms-label:hover:not(:disabled) { background: var(--wa-hover); }
  button.ms-label:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .ms-label.on, .ms-label.on:hover:not(:disabled) { border-color: var(--wa-pick-line); background: var(--wa-pick-bg); }
  .ms-label .ms-k {
    flex: none; width: 9px; height: 9px; margin-top: 4px; border-radius: 50%; background: var(--k, var(--wa-muted));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ink) 25%, transparent);
  }
  .ms-label .ms-t { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
  .ms-label .ms-t b { font-weight: 600; overflow-wrap: anywhere; }
  .ms-label .ms-t small { font-size: 11.5px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .ms-label.off .ms-t b, .ms-label.off .ms-k { opacity: .55; }
  .ms-label.ms-add, .ms-label.ms-inh { border-style: dashed; background: transparent; color: var(--wa-muted); }
  .ms-label.ms-add { align-items: center; }
  .ms-label.ms-add svg.ui-icon { width: 12px; height: 12px; }
  .ms-label.ms-add .ms-t b { font-weight: 500; }
  .ms-label.ms-add:disabled { opacity: .5; cursor: default; }
  .ms-label.ms-inh { cursor: default; }
  /* A narrow stage: the watch alone, the same labels as a two column list
     under it. */
  @container cvcard (max-width: 720px) {
    .ms-around { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: none; width: 100%; max-width: 480px; }
    .ms-around > .ms-watch { grid-area: auto; grid-column: 1 / -1; }
    .ms-around > .ms-place { grid-area: auto; justify-self: stretch; align-items: stretch; align-self: start; }
    .ms-around > .ms-place .ms-label { width: 100%; flex-direction: row; text-align: left; }
  }

  /* The tool strip's Play opening glyph, and the way back under the hint. */
  svg.ms-play-glyph { fill: currentColor; stroke: none; }
  .ms-foot { display: flex; justify-content: center; }
  button.ms-change {
    margin: 2px 0 0; padding: 3px 10px; border: 1px solid var(--wa-line-strong); border-radius: 6px;
    background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 12px; cursor: pointer;
  }
  button.ms-change:hover { background: var(--wa-hover); }
  button.ms-change:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`;
