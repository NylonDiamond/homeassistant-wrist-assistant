// Furniture seen from above, ported from the app's `HomeMapFurnitureArt.swift`
// for the Home map tile's pictures: each piece of the scan's furniture as a
// small top-down drawing, the way a furnished floor plan shows it. A bed with
// its pillows and turned-down cover, a sofa with its back, arms and cushions,
// a chair with its back, a table's top, a cupboard's doors, a TV's thin
// screen, a bath, a basin, a toilet, a hob's rings, a washer's drum, a
// fireplace's glow and the treads of stairs. A kind the panel does not know
// is a plain soft box.
//
// Each piece is drawn in its own frame, `width` by `depth` drawing units
// centred on the origin with its back towards minus y; `tile-art.ts` places,
// turns and shades it. The few gradients a piece fills with are in
// `HOME_FURNITURE_DEFS`, which a drawing that holds furniture puts in its
// `<defs>` once; their ids name only their colours, so the same id in two
// drawings always means the same gradient.

import { type SVGTemplateResult, svg } from "lit";

const r2 = (v: number) => Math.round(v * 100) / 100;

/** The furniture's colours. */
export const HOME_FURNITURE_COLORS = {
  fabric: "rgb(120,110,102)",
  fabricLight: "rgb(158,148,138)",
  fabricDark: "rgb(89,82,77)",
  wood: "rgb(135,110,87)",
  woodLight: "rgb(158,133,107)",
  white: "rgb(204,201,196)",
  whiteShade: "rgb(158,156,153)",
  screen: "rgb(23,23,26)",
  ember: "rgb(255,140,56)",
  edge: "rgba(0,0,0,0.34)",
  line: "rgba(0,0,0,0.24)",
  shine: "rgba(255,255,255,0.16)",
} as const;

const C = HOME_FURNITURE_COLORS;

/** The gradients the pieces fill with, for a drawing's `<defs>`. */
export const HOME_FURNITURE_DEFS = svg`<linearGradient id="wa-hmf-table" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color=${C.woodLight} /><stop offset="1" stop-color=${C.wood} /></linearGradient>
  <linearGradient id="wa-hmf-appliance" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color=${C.white} /><stop offset="1" stop-color=${C.whiteShade} /></linearGradient>
  <linearGradient id="wa-hmf-tub" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color=${C.whiteShade} /><stop offset="1" stop-color=${C.white} stop-opacity="0.9" /></linearGradient>
  <radialGradient id="wa-hmf-ember">
    <stop offset="0" stop-color=${C.ember} stop-opacity="0.55" /><stop offset="1" stop-color=${C.ember} stop-opacity="0" /></radialGradient>`;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const inset = (b: Box, dx: number, dy: number): Box => ({ x: b.x + dx, y: b.y + dy, w: b.w - dx * 2, h: b.h - dy * 2 });

/** A rounded box, its corners never more than half its shorter side. */
function rounded(b: Box, radius: number, paint: string, extra: { stroke?: string; width?: number; dy?: number } = {}): SVGTemplateResult {
  const rx = Math.max(Math.min(radius, Math.min(b.w, b.h) / 2), 0);
  const fill = extra.stroke === undefined ? paint : "none";
  return svg`<rect x=${r2(b.x)} y=${r2(b.y + (extra.dy ?? 0))} width=${r2(Math.max(b.w, 0))} height=${r2(Math.max(b.h, 0))} rx=${r2(rx)}
    fill=${fill} stroke=${extra.stroke ?? "none"} stroke-width=${extra.width ?? 0} />`;
}

const ellipse = (b: Box, fill: string, stroke?: string, width?: number) =>
  svg`<ellipse cx=${r2(b.x + b.w / 2)} cy=${r2(b.y + b.h / 2)} rx=${r2(Math.max(b.w / 2, 0))} ry=${r2(Math.max(b.h / 2, 0))}
    fill=${fill} stroke=${stroke ?? "none"} stroke-width=${width ?? 0} />`;

const line = (x1: number, y1: number, x2: number, y2: number, stroke: string, width: number) =>
  svg`<line x1=${r2(x1)} y1=${r2(y1)} x2=${r2(x2)} y2=${r2(y2)} stroke=${stroke} stroke-width=${width} />`;

/** A piece's corner, by its kind. */
function corner(kind: string, small: number): number {
  switch (kind) {
    case "sofa": return small * 0.18;
    case "chair": return small * 0.22;
    case "bathtub": return small * 0.14;
    case "television": return 1.5;
    case "bed": return small * 0.06;
    default: return small * 0.08;
  }
}

/** A piece's outline, for its shadow: `width` by `depth`, centred. */
export function homeFurnitureOutline(kind: string, w: number, d: number, fill: string): SVGTemplateResult {
  const b = { x: -w / 2, y: -d / 2, w, h: d };
  const small = Math.min(w, d);
  return rounded(b, small < 7 ? small * 0.2 : corner(kind, small), fill);
}

/**
 * One piece `w` by `d` drawing units, centred on the origin, its back
 * towards minus y. `scale` is units per meter, for the parts with a real
 * size (a stair's tread). Too small for its parts, a soft box.
 */
export function homeFurnitureArt(kind: string, w: number, d: number, scale: number): SVGTemplateResult {
  const b: Box = { x: -w / 2, y: -d / 2, w, h: d };
  const small = Math.min(w, d);
  if (small < 7) return rounded(b, small * 0.2, C.fabric);
  const parts = piece(kind, b, small, scale);
  return svg`${parts}${rounded(b, corner(kind, small), "", { stroke: C.edge, width: 1 })}`;
}

function appliance(b: Box, small: number): SVGTemplateResult {
  return rounded(b, small * 0.08, "url(#wa-hmf-appliance)");
}

function drain(x: number, y: number, small: number): SVGTemplateResult {
  const r = Math.max(small * 0.035, 1);
  return svg`<circle cx=${r2(x)} cy=${r2(y)} r=${r2(r)} fill=${C.screen} fill-opacity="0.6" />`;
}

function piece(kind: string, b: Box, small: number, scale: number): SVGTemplateResult[] {
  const maxX = b.x + b.w;
  const maxY = b.y + b.h;
  const midX = b.x + b.w / 2;
  const midY = b.y + b.h / 2;
  switch (kind) {
    case "bed": {
      const out = [rounded(b, small * 0.06, C.wood)];
      const mattress = inset(b, small * 0.04, small * 0.04);
      out.push(rounded(mattress, small * 0.05, C.fabricLight));
      // A double bed has two pillows.
      const count = b.w > b.h * 0.62 ? 2 : 1;
      const gap = mattress.w * 0.06;
      const ph = b.h * 0.14;
      const pw = (mattress.w - gap * (count + 1)) / count;
      for (let i = 0; i < count; i += 1) {
        const pillow = { x: mattress.x + gap + i * (pw + gap), y: mattress.y + b.h * 0.04, w: pw, h: ph };
        out.push(rounded(pillow, ph * 0.4, C.white), rounded(pillow, ph * 0.4, "", { stroke: C.line, width: 0.75 }));
      }
      // The cover, turned down below the pillows.
      const top = mattress.y + b.h * 0.26;
      out.push(rounded({ x: mattress.x, y: top, w: mattress.w, h: mattress.y + mattress.h - top }, small * 0.05, C.fabric));
      const fold = { x: mattress.x, y: top, w: mattress.w, h: b.h * 0.08 };
      out.push(rounded(fold, small * 0.04, "rgba(158,148,138,0.85)"), line(fold.x, fold.y + fold.h, fold.x + fold.w, fold.y + fold.h, C.line, 0.75));
      return out;
    }
    case "sofa": {
      const out = [rounded(b, small * 0.18, C.fabricDark)];
      const back = b.h * 0.28;
      const arm = Math.min(b.w * 0.12, b.h * 0.32);
      const seat = { x: b.x + arm, y: b.y + back, w: b.w - arm * 2, h: b.h - back - small * 0.06 };
      if (seat.w <= 4 || seat.h <= 4) return out;
      const count = b.w > b.h * 2.4 ? 3 : b.w > b.h * 1.2 ? 2 : 1;
      const gap = 1.5;
      const width = (seat.w - gap * (count - 1)) / count;
      for (let i = 0; i < count; i += 1) {
        const cushion = { x: seat.x + i * (width + gap), y: seat.y, w: width, h: seat.h };
        out.push(rounded(cushion, small * 0.1, C.fabric), rounded(cushion, small * 0.1, "", { stroke: C.shine, width: 0.75, dy: 0.5 }));
      }
      return out;
    }
    case "chair": {
      const seat = { x: b.x + b.w * 0.12, y: b.y + b.h * 0.26, w: b.w * 0.76, h: b.h * 0.64 };
      return [rounded(b, small * 0.22, C.fabricDark), rounded(seat, small * 0.18, C.fabric), rounded(seat, small * 0.18, "", { stroke: C.shine, width: 0.75 })];
    }
    case "table": {
      const i = Math.min(small * 0.1, 4);
      return [rounded(b, small * 0.08, "url(#wa-hmf-table)"), rounded(inset(b, i, i), small * 0.05, "", { stroke: C.shine, width: 0.75 })];
    }
    case "storage": {
      // Its doors meet in the middle, with a handle each side.
      const handle = Math.max(small * 0.05, 1.2);
      return [
        rounded(b, small * 0.08, C.wood),
        line(midX, b.y + small * 0.12, midX, maxY, C.line, 1),
        ...[-handle * 2.2, handle * 2.2].map((dx) => svg`<circle cx=${r2(midX + dx)} cy=${r2(maxY - small * 0.28)} r=${r2(handle)} fill=${C.shine} />`),
        line(b.x, b.y + small * 0.12, maxX, b.y + small * 0.12, C.shine, 0.75),
      ];
    }
    case "television":
      return [rounded(b, 1.5, C.screen), line(b.x + 1, maxY - 0.5, maxX - 1, maxY - 0.5, "rgba(255,255,255,0.35)", 1)];
    case "refrigerator": {
      const front = maxY - b.h * 0.14;
      return [appliance(b, small), line(b.x + small * 0.08, front, maxX - small * 0.08, front, C.line, 1)];
    }
    case "oven":
    case "stove": {
      const radius = small * 0.15;
      const out = [appliance(b, small)];
      for (const x of [midX - b.w * 0.22, midX + b.w * 0.22]) {
        for (const y of [midY - b.h * 0.2, midY + b.h * 0.2]) {
          out.push(svg`<circle cx=${r2(x)} cy=${r2(y)} r=${r2(radius)} fill="none" stroke=${C.screen} stroke-opacity="0.7" stroke-width=${r2(Math.max(radius * 0.3, 1))} />`);
        }
      }
      return out;
    }
    case "dishwasher": {
      const i = small * 0.14;
      return [appliance(b, small), rounded(inset(b, i, i), small * 0.05, "", { stroke: C.line, width: 1 })];
    }
    case "washerDryer": {
      const radius = small * 0.32;
      return [appliance(b, small), svg`<circle cx=${r2(midX)} cy=${r2(midY)} r=${r2(radius)} fill=${C.whiteShade} stroke=${C.line} stroke-width=${r2(Math.max(radius * 0.14, 1))} />`];
    }
    case "sink": {
      const bowl = inset(b, b.w * 0.18, b.h * 0.2);
      bowl.y += b.h * 0.04;
      return [appliance(b, small), ellipse(bowl, C.whiteShade), drain(bowl.x + bowl.w / 2, bowl.y + bowl.h / 2, small)];
    }
    case "bathtub": {
      const tub = inset(b, small * 0.11, small * 0.11);
      return [rounded(b, small * 0.14, C.white), rounded(tub, Math.min(tub.w, tub.h) * 0.4, "url(#wa-hmf-tub)"), drain(tub.x + tub.w / 2, tub.y + small * 0.2, small)];
    }
    case "toilet": {
      const tank = { x: b.x + b.w * 0.08, y: b.y, w: b.w * 0.84, h: b.h * 0.28 };
      const bowl = { x: b.x + b.w * 0.12, y: b.y + b.h * 0.22, w: b.w * 0.76, h: b.h * 0.78 };
      return [
        rounded(tank, small * 0.06, C.white),
        rounded(tank, small * 0.06, "", { stroke: C.line, width: 0.75 }),
        ellipse(bowl, C.white),
        ellipse(inset(bowl, bowl.w * 0.2, bowl.h * 0.2), C.whiteShade),
      ];
    }
    case "fireplace": {
      const box = { x: b.x + b.w * 0.18, y: b.y + b.h * 0.2, w: b.w * 0.64, h: b.h * 0.62 };
      return [rounded(b, small * 0.06, "rgb(97,92,87)"), rounded(box, small * 0.05, C.screen), ellipse(inset(box, -box.w * 0.1, -box.h * 0.1), "url(#wa-hmf-ember)")];
    }
    case "stairs": {
      // A tread about 27 centimeters deep, across the stair's long side.
      const alongDepth = b.h >= b.w;
      const run = alongDepth ? b.h : b.w;
      const count = Math.max(Math.round(run / Math.max(scale * 0.27, 4)), 2);
      const step = run / count;
      let d = "";
      for (let i = 1; i < count; i += 1) {
        const at = i * step;
        d += alongDepth ? `M${r2(b.x)} ${r2(b.y + at)}H${r2(maxX)}` : `M${r2(b.x + at)} ${r2(b.y)}V${r2(maxY)}`;
      }
      return [rounded(b, small * 0.04, C.wood), svg`<path d=${d} stroke=${C.line} stroke-width="1" fill="none" />`];
    }
    default:
      return [rounded(b, small * 0.14, C.fabric)];
  }
}
