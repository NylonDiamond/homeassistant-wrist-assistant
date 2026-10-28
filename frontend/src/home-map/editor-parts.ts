// The map editor's small shared pieces, drawn the same in every mode: an
// inspector card and its rows, a number field that saves when it is left or
// Enter is pressed, a menu, a picture button, a toggle chip, and the small
// pictures (a floor's outline, a room's, a floor finish's swatch). Styled by
// `editor-styles.ts`; the modes build their rails and inspectors from these.

import { type TemplateResult, html, nothing, svg } from "lit";
import { live } from "lit/directives/live.js";
import { homeMapNumberText, homeMapParseNumber } from "./editor-view.js";
import type { HomeFloorKind } from "./geometry.js";
import { homeFloorKind } from "./geometry.js";
import { type HomeMapFloor, type HomeMapRoom, type HomePoint, homeMapBounds } from "./model.js";

/** An inspector or rail card with its small capital title. */
export function hmeCard(title: string | TemplateResult, body: unknown, extra?: unknown, cls = ""): TemplateResult {
  return html`<section class="hme-card ${cls}">
    <div class="hme-h">${title}${extra === undefined ? nothing : html`<span class="hme-h-end">${extra}</span>`}</div>
    ${body}
  </section>`;
}

/** A labelled row of a card. */
export function hmeRow(label: string, ...controls: unknown[]): TemplateResult {
  return html`<div class="hme-r"><span class="hme-l">${label}</span>${controls}</div>`;
}

/** A hint under a row, lined up with the controls. */
export function hmeHint(text: unknown): TemplateResult {
  return html`<p class="hme-hint">${text}</p>`;
}

/**
 * A number field: shows `value` with `digits` decimals and a unit after
 * it; saves on leaving it or Enter, and goes back to the value when what
 * was typed is not a number, lies outside `min` to `max` or is unchanged.
 */
export function hmeNumber(o: {
  value: number;
  unit?: string;
  digits?: number;
  min?: number;
  max?: number;
  label: string;
  disabled?: boolean;
  set: (v: number) => void;
  width?: string;
}): TemplateResult {
  const digits = o.digits ?? 2;
  const text = homeMapNumberText(o.value, digits);
  const commit = (input: HTMLInputElement) => {
    const v = homeMapParseNumber(input.value);
    if (v === undefined || (o.min !== undefined && v < o.min) || (o.max !== undefined && v > o.max) || homeMapNumberText(v, digits) === text) {
      input.value = text;
      return;
    }
    o.set(v);
  };
  return html`<span class="hme-in hme-num" style=${o.width === undefined ? nothing : `flex:0 0 ${o.width}`}>
    <input type="text" inputmode="decimal" aria-label=${o.label} .value=${live(text)} ?disabled=${o.disabled === true}
      @change=${(e: Event) => commit(e.target as HTMLInputElement)}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") {
          (e.target as HTMLInputElement).value = text;
          (e.target as HTMLInputElement).blur();
        }
      }} />${o.unit === undefined ? nothing : html`<span class="hme-unit">${o.unit}</span>`}</span>`;
}

/** A text field that saves on leaving it or Enter. */
export function hmeText(o: { value: string; label: string; placeholder?: string; max?: number; set: (v: string) => void }): TemplateResult {
  return html`<span class="hme-in"><input type="text" aria-label=${o.label} maxlength=${o.max ?? 100} placeholder=${o.placeholder ?? ""}
    .value=${live(o.value)}
    @change=${(e: Event) => {
      const v = (e.target as HTMLInputElement).value;
      if (v.trim() !== o.value.trim()) o.set(v);
    }}
    @keydown=${(e: KeyboardEvent) => {
      if (e.key === "Enter") (e.target as HTMLInputElement).blur();
    }} /></span>`;
}

/** One choice of a menu. */
export interface HmeOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** A menu showing `value`; `set` with the value picked. */
export function hmeSelect(o: { value: string; options: readonly HmeOption[]; label: string; set: (v: string) => void; cls?: string }): TemplateResult {
  return html`<span class="hme-in hme-sel ${o.cls ?? ""}"><select aria-label=${o.label} @change=${(e: Event) => o.set((e.target as HTMLSelectElement).value)}>
    ${o.options.map((opt) => html`<option value=${opt.value} ?disabled=${opt.disabled === true} .selected=${live(opt.value === o.value)}>${opt.label}</option>`)}
  </select></span>`;
}

/** A menu that looks like a button and does something when a choice is
 * picked, showing its own name again after: Move to floor, Add a thing. */
export function hmeMenuButton(o: { label: string; options: readonly HmeOption[]; pick: (v: string) => void; cls?: string }): TemplateResult {
  return html`<span class="hme-menu ${o.cls ?? ""}"><select aria-label=${o.label} @change=${(e: Event) => {
    const el = e.target as HTMLSelectElement;
    const v = el.value;
    el.value = "";
    if (v !== "") o.pick(v);
  }}>
    <option value="" .selected=${live(true)}>${o.label}</option>
    ${o.options.map((opt) => html`<option value=${opt.value} ?disabled=${opt.disabled === true}>${opt.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`;
}

/** A button with a small picture over its name, ringed when on. */
export function hmePic(o: { label: string; picture: unknown; on: boolean; click: () => void; title?: string }): TemplateResult {
  return html`<button type="button" class="hme-pic ${o.on ? "on" : ""}" aria-pressed=${o.on ? "true" : "false"} title=${o.title ?? o.label}
    @click=${o.click}>${o.picture}<span>${o.label}</span></button>`;
}

/** A small round toggle: Shown or Hidden. */
export function hmeChip(o: { on: boolean; onText: string; offText: string; click: () => void; label: string }): TemplateResult {
  return html`<button type="button" class="hme-chip ${o.on ? "" : "off"}" aria-pressed=${o.on ? "true" : "false"} aria-label=${o.label}
    @click=${o.click}>${o.on ? o.onText : o.offText}</button>`;
}

// ── pictures ─────────────────────────────────────────────────────────────

/** A floor finish's swatch colours, as the plan lays them. */
export const HME_FINISH_SWATCH: Readonly<Record<HomeFloorKind, string>> = {
  wood: "repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",
  tile: "linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",
  stone: "#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",
  carpet: "#99928a",
  plain: "#a8a6a1",
};

/** A finish's plain colour, for a layer row's dot. */
export const HME_FINISH_DOT: Readonly<Record<HomeFloorKind, string>> = {
  wood: "#a17a55",
  tile: "#bdbbb4",
  stone: "#b0b5ba",
  carpet: "#8f8880",
  plain: "#9c9a95",
};

export function hmeFinishSwatch(kind: HomeFloorKind): TemplateResult {
  return html`<span class="hme-sw" style=${`background:${HME_FINISH_SWATCH[kind]}`}></span>`;
}

const pts = (points: readonly HomePoint[]) => points.map(([x, y]) => `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`).join(" ");

/** A floor's rooms as outlines in a box `w` by `h`. */
export function hmeFloorThumb(floor: HomeMapFloor | undefined, w = 34, h = 24): TemplateResult {
  const rooms = floor?.rooms ?? [];
  if (rooms.length === 0) {
    return html`<svg class="hme-thumb" width=${w} height=${h} viewBox=${`0 0 ${w} ${h}`} aria-hidden="true">
      <rect x="1" y="1" width=${w - 2} height=${h - 2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;
  }
  const b = homeMapBounds(floor!);
  const pad = 4;
  const k = Math.min((w - pad * 2) / Math.max(b.maxX - b.minX, 0.5), (h - pad * 2) / Math.max(b.maxY - b.minY, 0.5));
  const ox = w / 2 - ((b.minX + b.maxX) / 2) * k;
  const oy = h / 2 - ((b.minY + b.maxY) / 2) * k;
  return html`<svg class="hme-thumb" width=${w} height=${h} viewBox=${`0 0 ${w} ${h}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${w - 1} height=${h - 1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${rooms.map((r) => svg`<polygon points=${pts(r.outline.map(([x, y]) => [ox + x * k, oy + y * k] as HomePoint))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`;
}

/** One room alone, filled with its finish, with a warm pool when lit. */
export function hmeRoomThumb(room: HomeMapRoom, lit: boolean, w = 76, h = 54): TemplateResult {
  const xs = room.outline.map((p) => p[0]);
  const ys = room.outline.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = 8;
  const k = Math.min((w - pad * 2) / Math.max(maxX - minX, 0.5), (h - pad * 2) / Math.max(maxY - minY, 0.5));
  const ox = w / 2 - ((minX + maxX) / 2) * k;
  const oy = h / 2 - ((minY + maxY) / 2) * k;
  const shape = pts(room.outline.map(([x, y]) => [ox + x * k, oy + y * k] as HomePoint));
  return html`<svg class="hme-room-thumb" width=${w} height=${h} viewBox=${`0 0 ${w} ${h}`} aria-hidden="true">
    <rect width=${w} height=${h} rx="8" fill="#121010" />
    <polygon points=${shape} fill=${HME_FINISH_DOT[homeFloorKind(room)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${lit ? svg`<circle cx=${w * 0.58} cy=${h * 0.42} r=${Math.min(w, h) * 0.22} fill="#ffb648" opacity="0.35" />` : nothing}
  </svg>`;
}
