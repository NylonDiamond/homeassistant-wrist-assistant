// A tiny picture of what each layer kind draws, for the Add a layer buttons.
//
// "Gauge" and "Chart" are the schema's words, not a picture of the result, and
// a row of seven equally tinted buttons asks the author to know the vocabulary
// before they can start. Each button now carries a sample of its own output on
// a black well, so the choice is made by eye.
//
// Nothing here is live: these are hand drawn samples, not the renderer. They
// are deliberately cheap, because seven of them draw on every panel update.
// Each one is one 120x46 box so the row scales as a set, and colour comes from
// `--k` (the kind's colour, set on the button) so a preview always agrees with
// the button around it.

import { type TemplateResult, html, svg } from "lit";
import type { LayerKind } from "./kinds.js";

/** The muted ink used for the parts of a sample that are not the subject:
 * a gauge's unfilled track, a chart's grid, a caption under a number. */
const DIM = "color-mix(in srgb, var(--k) 45%, #6b7280)";

const FONT = `system-ui, -apple-system, "Segoe UI", sans-serif`;

/** An arc of a circle, used by the gauge samples. `frac` is how much of the
 * 270 degree sweep is drawn, starting from the bottom left. */
function arc(cx: number, cy: number, r: number, frac: number): string {
  const start = 135;
  const end = start + 270 * Math.max(0, Math.min(1, frac));
  const p = (deg: number): { x: string; y: string } => {
    const rad = (deg * Math.PI) / 180;
    return { x: (cx - r * Math.cos(rad)).toFixed(2), y: (cy - r * Math.sin(rad)).toFixed(2) };
  };
  const a = p(start);
  const b = p(end);
  const large = end - start > 180 ? 1 : 0;
  return `M${a.x} ${a.y}A${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`;
}

/** One small gauge: its track, its filled part, and its needle dot. */
function miniGauge(cx: number, cy: number, r: number, frac: number): TemplateResult {
  return svg`<g fill="none" stroke-linecap="round">
    <path d=${arc(cx, cy, r, 1)} stroke=${DIM} stroke-width="2.6" opacity=".5" />
    <path d=${arc(cx, cy, r, frac)} stroke="var(--k)" stroke-width="2.6" />
  </g>`;
}

/** The sample drawn inside one kind's button. */
function sample(kind: LayerKind): TemplateResult {
  switch (kind) {
    // Three readings at three sizes, which is what a text layer is for: one
    // number big, a label under it, a second reading beside it.
    case "text":
      return svg`<g font-family=${FONT} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${DIM}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${DIM}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${DIM}>1.2 kW</text>
      </g>`;
    // Three symbols, the middle one larger, so the button reads as "a picture
    // from the icon set" rather than one particular icon.
    case "icon":
      return svg`<g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <g opacity=".55" transform="translate(14 14) scale(.8)">
          <path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />
        </g>
        <g transform="translate(42 8) scale(1.25)">
          <path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" />
          <path d="M10.5 21.5H13.5" />
        </g>
        <g opacity=".55" transform="translate(80 14) scale(.8)">
          <path d="M12 20.5A4.5 4.5 0 0 0 16.5 16C16.5 12.5 12 4.5 12 4.5S7.5 12.5 7.5 16A4.5 4.5 0 0 0 12 20.5Z" />
        </g>
      </g>`;
    // Three arcs at three fills, which is the one thing a still picture can say
    // about a gauge that a single arc cannot: it moves.
    case "gauge":
      return svg`<g>
        ${miniGauge(22, 24, 12, 0.28)}
        ${miniGauge(60, 24, 12, 0.62)}
        ${miniGauge(98, 24, 12, 0.92)}
        <text x="60" y="27" font-family=${FONT} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;
    // A filled history plot in front, a bar chart behind it, because a chart
    // layer draws either and the two look nothing alike.
    case "chart":
      return svg`<g>
        <g opacity=".4" fill=${DIM}>
          <rect x="72" y="26" width="6" height="14" rx="1.5" />
          <rect x="82" y="18" width="6" height="22" rx="1.5" />
          <rect x="92" y="29" width="6" height="11" rx="1.5" />
          <rect x="102" y="12" width="6" height="28" rx="1.5" />
        </g>
        <path d="M4 40L4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15L68 40Z" fill="var(--k)" opacity=".22" />
        <path d="M4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15" fill="none" stroke="var(--k)"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="60" cy="8" r="2.6" fill="var(--k)" />
      </g>`;
    // A strip of runs in three colours: the picture says "one entity, over
    // time" in a way the word Timeline on its own does not.
    case "timeline":
      return svg`<g>
        <rect x="6" y="17" width="30" height="12" rx="2.5" fill=${DIM} opacity=".55" />
        <rect x="37" y="17" width="18" height="12" rx="2.5" fill="var(--k)" />
        <rect x="56" y="17" width="8" height="12" rx="2.5" fill=${DIM} opacity=".55" />
        <rect x="65" y="17" width="24" height="12" rx="2.5" fill="var(--k)" />
        <rect x="90" y="17" width="24" height="12" rx="2.5" fill=${DIM} opacity=".55" />
        <text x="6" y="39" font-family=${FONT} font-size="7" fill=${DIM}>1h ago</text>
        <text x="114" y="39" font-family=${FONT} font-size="7" text-anchor="end" fill=${DIM}>now</text>
      </g>`;
    // The shapes a shape layer can be, outlined rather than filled so a
    // border-only shape is as visible here as a solid one. The bar is the line
    // kind, which is what a divider between two readings is.
    case "shape":
      return svg`<g fill="none" stroke="var(--k)" stroke-width="2">
        <rect x="6" y="12" width="26" height="22" rx="6" fill="var(--k)" fill-opacity=".18" />
        <rect x="40" y="11" width="2.5" height="24" fill="var(--k)" stroke="none" />
        <circle cx="63" cy="23" r="11" />
        <rect x="83" y="16" width="31" height="14" rx="7" stroke-dasharray="3 3" opacity=".7" />
      </g>`;
    // A framed photo: the sun and the hills say "picture" faster than a frame
    // on its own does.
    case "image":
      return svg`<g>
        <rect x="26" y="7" width="68" height="32" rx="5" fill="var(--k)" fill-opacity=".16"
          stroke="var(--k)" stroke-width="1.8" />
        <circle cx="44" cy="18" r="4" fill="var(--k)" opacity=".75" />
        <path d="M28 37L47 24L60 32L74 20L92 37Z" fill="var(--k)" opacity=".55" />
      </g>`;
    // A finger over a dashed region: the region is the layer, and the dashes
    // say it does not draw anything of its own.
    case "tap":
      return svg`<g>
        <rect x="30" y="6" width="60" height="34" rx="8" fill="var(--k)" fill-opacity=".12"
          stroke="var(--k)" stroke-width="1.6" stroke-dasharray="5 4" />
        <g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
          transform="translate(48 9) scale(1)">
          <path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" />
          <path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" />
          <path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />
        </g>
      </g>`;
  }
}

/**
 * The sample for one kind, sized by the `.add .shot` rule in the panel's
 * styles. Marked `aria-hidden`: the button's own words already name the kind,
 * and a screen reader has nothing to gain from the picture.
 */
export function addPreview(kind: LayerKind): TemplateResult {
  return html`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${sample(kind)}</svg>`;
}
