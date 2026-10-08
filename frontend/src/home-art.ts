// Home's device drawings: a watch or an iPhone as it sits on the table, its
// case in brushed metal, its screen at 10:09 with a slot per thing it holds.
// A held slot is lit in the person's color (`--c`, through the `ha-lit`
// classes in Home's styles); an empty one is a dashed ring. The case and the
// screen are drawn in the device's own colors, which do not change with the
// panel's skin, since the watch on the wrist does not either.

import { html, svg, type TemplateResult } from "lit";

/** How the drawing reads the device's sync word: a waiting device's case
 * edge is lit amber, one that never synced has a dim clock. */
export type HomeArtState = "synced" | "waiting" | "idle";

/** The ring lengths of the three lit slots, out of a 69 unit circle, so the
 * three do not read as the same reading three times. */
const RING = [48, 26, 60] as const;

/** A key safe inside an SVG id, so two drawings never share a gradient. */
function idKey(key: string): string {
  return key.replace(/[^A-Za-z0-9_-]/g, "_");
}

/**
 * A watch, 104 by 134 on the card. Its three round slots light one by one as
 * it holds complications, and the line across the top lights from the
 * fourth; a watch with none shows every slot dashed and a dim clock.
 */
export function homeWatchArt(key: string, held: number, state: HomeArtState): TemplateResult {
  const id = `ha-w-${idKey(key)}`;
  const ring = (cx: number, i: number) => i < held
    ? svg`<circle cx=${cx} cy="124" r="11" stroke="#242427" stroke-width="3"></circle>
      <circle class="ha-lit" cx=${cx} cy="124" r="11" stroke-width="3" stroke-dasharray="${RING[i] ?? 40} 69"
        transform="rotate(-90 ${cx} 124)" stroke-linecap="round"></circle>`
    : svg`<circle cx=${cx} cy="124" r="11" stroke="#333337" stroke-width="1.2" stroke-dasharray="2 3"></circle>`;
  return html`<svg class="ha-art ha-watch" viewBox="0 0 140 180" width="104" height="134" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="${id}-case" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3a3a3f"></stop><stop offset="0.5" stop-color="#202023"></stop><stop offset="1" stop-color="#141416"></stop>
      </linearGradient>
      <linearGradient id="${id}-band" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#151517"></stop><stop offset="0.5" stop-color="#232326"></stop><stop offset="1" stop-color="#151517"></stop>
      </linearGradient>
    </defs>
    <rect x="38" y="0" width="64" height="28" rx="7" fill="url(#${id}-band)"></rect>
    <rect x="38" y="152" width="64" height="28" rx="7" fill="url(#${id}-band)"></rect>
    <rect x="12" y="18" width="116" height="144" rx="36" fill="url(#${id}-case)"></rect>
    <rect class=${state === "waiting" ? "ha-edge-wait" : ""} x="12.75" y="18.75" width="114.5" height="142.5" rx="35.25" stroke="rgba(255,255,255,0.10)" stroke-width="1.5"></rect>
    <rect x="126" y="55" width="7" height="24" rx="2.5" fill="url(#${id}-case)"></rect>
    <rect x="127" y="88" width="5" height="16" rx="2" fill="#26262a"></rect>
    <rect x="19" y="25" width="102" height="130" rx="29" fill="#000"></rect>
    ${held > 3
      ? svg`<rect class="ha-lit-fill" x="44" y="43" width="52" height="8" rx="4"></rect>`
      : svg`<rect x="40" y="42" width="60" height="11" rx="3" stroke="#333337" stroke-width="1.2" stroke-dasharray="2 3"></rect>`}
    <text x="70" y="93" text-anchor="middle" font-size="33" font-weight="300" letter-spacing="-1"
      fill=${held > 0 && state !== "idle" ? "#f2f2f4" : "#5a5a5f"}>10:09</text>
    ${ring(42, 0)}${ring(70, 1)}${ring(98, 2)}
  </svg>`;
}

/**
 * An iPhone, 68 by 136 on the card, at its lock screen. Its three widget
 * slots under the clock light one by one as it holds widgets.
 */
export function homePhoneArt(key: string, held: number, state: HomeArtState): TemplateResult {
  const id = `ha-p-${idKey(key)}`;
  const round = (cx: number, i: number) => i < held
    ? svg`<circle cx=${cx} cy="82" r="8" stroke="#242427" stroke-width="3"></circle>
      <circle class="ha-lit" cx=${cx} cy="82" r="8" stroke-width="3" stroke-dasharray="${Math.round((RING[i] ?? 40) * 0.73)} 50"
        transform="rotate(-90 ${cx} 82)" stroke-linecap="round"></circle>`
    : svg`<circle cx=${cx} cy="82" r="8" stroke="#333337" stroke-width="1.2" stroke-dasharray="2 3"></circle>`;
  return html`<svg class="ha-art ha-phone" viewBox="0 0 92 184" width="68" height="136" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="${id}-case" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#3a3a3f"></stop><stop offset="0.5" stop-color="#1e1e21"></stop><stop offset="1" stop-color="#141416"></stop>
      </linearGradient>
    </defs>
    <rect x="2" y="1" width="88" height="182" rx="18" fill="url(#${id}-case)"></rect>
    <rect class=${state === "waiting" ? "ha-edge-wait" : ""} x="2.75" y="1.75" width="86.5" height="180.5" rx="17.25" stroke="rgba(255,255,255,0.10)" stroke-width="1.5"></rect>
    <rect x="6" y="5" width="80" height="174" rx="14" fill="#000"></rect>
    <rect x="35" y="11" width="22" height="7" rx="3.5" fill="#1a1a1c"></rect>
    <text x="46" y="62" text-anchor="middle" font-size="25" font-weight="300" letter-spacing="-0.6"
      fill=${state === "idle" ? "#5a5a5f" : "#f2f2f4"}>10:09</text>
    ${round(24, 0)}${round(46, 1)}
    ${held > 2
      ? svg`<rect class="ha-lit" x="58" y="74" width="22" height="16" rx="4" stroke-width="2"></rect>`
      : svg`<rect x="58" y="74" width="22" height="16" rx="4" stroke="#333337" stroke-width="1.2" stroke-dasharray="2 3"></rect>`}
    <rect x="31" y="170" width="30" height="3" rx="1.5" fill="#3a3a3f"></rect>
  </svg>`;
}
