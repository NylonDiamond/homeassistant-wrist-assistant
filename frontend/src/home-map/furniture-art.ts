// Furniture seen from above, ported from the app's `HomeMapFurnitureArt.swift`
// for the Home map tile's pictures: each piece of the scan's furniture as a
// small top-down drawing, the way a furnished floor plan shows it. A bed with
// its pillows and turned-down cover, a sofa with its back, arms and cushions,
// a chair with its back, a table's top, a cupboard's doors, a TV's thin
// screen, a bath, a basin, a toilet, a hob's rings, a washer's drum, a
// fireplace's glow and the treads of stairs. A kind the panel does not know
// is a plain soft box.
//
// A thing picked from the furniture catalog draws as its piece (its
// `model`, `HomeFurnitureLook`) where the piece's kind alone says too
// little: an armchair with its arms, an office chair's round seat on its
// star of feet, a stool, a round or glass table, a desk, a corner desk or
// sofa, a bookcase's books, a lamp's shade, a ceiling fan, a rug, a potted
// plant, a speaker, a bin. Its own fabric and wood colours tint it, a
// lamp's shade taking the fabric's as the 3D view does. With no model and
// no colours a piece draws exactly as before.
//
// Each piece is drawn in its own frame, `width` by `depth` drawing units
// centred on the origin with its back towards minus y; `tile-art.ts` places,
// turns and shades it. The few gradients a piece fills with are in
// `HOME_FURNITURE_DEFS`, which a drawing that holds furniture puts in its
// `<defs>` once; their ids name only their colours, so the same id in two
// drawings always means the same gradient.

import { type SVGTemplateResult, nothing, svg } from "lit";

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

/** What a piece is drawn as beyond its kind: the furniture catalog piece
 * it is (`bedDouble`, `chairDesk`), and its own fabric and wood colours,
 * `#RRGGBB`. Each may be absent. */
export interface HomeFurnitureLook {
  model?: string | undefined;
  /** The piece's kind, when it is drawn as a piece other than its thing's
   * own kind names (the 3D view's default piece for a scanned thing). */
  kind?: string | undefined;
  fabric?: string | undefined;
  wood?: string | undefined;
  /** The colour of the rest of it seen from above (an appliance's metal, a
   * plant's leaves), `#RRGGBB`. */
  body?: string | undefined;
}

/** The paints a piece is drawn in: the furniture's own colours, or its
 * fabric and wood tinted. */
interface Paint {
  fabric: string;
  fabricLight: string;
  fabricDark: string;
  /** A bed's cover turned down. */
  fold: string;
  wood: string;
  woodLight: string;
  /** A table's top. */
  table: string;
  /** A lamp's shade. */
  shade: string;
  /** An appliance's top. */
  appliance: string;
  /** The look's body colour and its darker shade, if it has one. */
  body?: string;
  bodyDark?: string;
  /** Whether the look named a wood or a fabric colour, so a piece the
   * plain paints draw in colours of its own (a speaker, a box, a plant's
   * pot, a rug) takes it. */
  ownWood: boolean;
  ownFabric: boolean;
}

const PLAIN: Paint = {
  fabric: C.fabric,
  fabricLight: C.fabricLight,
  fabricDark: C.fabricDark,
  fold: "rgba(158,148,138,0.85)",
  wood: C.wood,
  woodLight: C.woodLight,
  table: "url(#wa-hmf-table)",
  shade: "rgb(222,212,192)",
  appliance: "url(#wa-hmf-appliance)",
  ownWood: false,
  ownFabric: false,
};

type Rgb = readonly [number, number, number];

function rgbOf(hex: string | undefined): Rgb | undefined {
  const m = hex === undefined ? null : /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  return m === null ? undefined : [parseInt(m[1]!, 16), parseInt(m[2]!, 16), parseInt(m[3]!, 16)];
}

/** `c` moved `t` of the way to white (t over 0) or black (t under 0). */
function toward(c: Rgb, t: number): Rgb {
  const to = t > 0 ? 255 : 0;
  const k = Math.abs(t);
  return [c[0] + (to - c[0]) * k, c[1] + (to - c[1]) * k, c[2] + (to - c[2]) * k];
}

const css = (c: Rgb, alpha?: number) => {
  const [r, g, b] = c.map((v) => Math.round(v));
  return alpha === undefined ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`;
};

/** The paints for a look: the plain ones, with the fabric's and the wood's
 * shades made from the look's own colours where it has them. */
function paintOf(look: HomeFurnitureLook): Paint {
  const fabric = rgbOf(look.fabric);
  const wood = rgbOf(look.wood);
  const body = rgbOf(look.body);
  if (fabric === undefined && wood === undefined && body === undefined) return PLAIN;
  const out: Paint = { ...PLAIN };
  if (body !== undefined) Object.assign(out, { body: css(body), bodyDark: css(toward(body, -0.3)), appliance: css(body) });
  if (fabric !== undefined) {
    Object.assign(out, {
      fabric: css(fabric),
      fabricLight: css(toward(fabric, 0.25)),
      fabricDark: css(toward(fabric, -0.26)),
      fold: css(toward(fabric, 0.25), 0.85),
      shade: css(fabric),
      ownFabric: true,
    });
  }
  if (wood !== undefined) Object.assign(out, { wood: css(wood), woodLight: css(toward(wood, 0.18)), table: css(wood), ownWood: true });
  return out;
}

/** A piece's outline, for its edge and its shadow: a box, a round, an L
 * along its back and right side (a corner sofa or desk), the same L with a
 * wider right arm (a sofa with a chaise), or none (a rug lies flat). The
 * catalog's corner pieces turn right, as the 3D view draws them. */
type Shape = "box" | "round" | "cornerL" | "chaiseR" | "flat";

const ROUND_MODELS = new Set(["tableRound", "rugRound", "stoolBar", "chairDesk", "lampRoundFloor", "lampRoundTable", "trashcan", "coatRackStanding"]);

function shapeOf(kind: string, model: string | undefined): Shape {
  if (model === "loungeSofaCorner" || model === "loungeDesignSofaCorner" || model === "deskCorner") return "cornerL";
  if (model === "loungeSofaLong") return "chaiseR";
  if (kind === "rug" || kind === "fan") return "flat";
  if (kind === "plant" || kind === "bin" || (model !== undefined && ROUND_MODELS.has(model))) return "round";
  return "box";
}

/** The L of a corner piece along its back and its right side, its arms
 * `t` thick. */
function lPath(b: Box, t: number): string {
  const maxX = b.x + b.w;
  const maxY = b.y + b.h;
  return `M${r2(b.x)} ${r2(b.y)}H${r2(maxX)}V${r2(maxY)}H${r2(maxX - t)}V${r2(b.y + Math.min(t, b.h))}H${r2(b.x)}Z`;
}

/** How thick a corner piece's arms are, and a chaise's. */
const cornerArm = (b: Box) => Math.min(b.w, b.h) * 0.44;
const chaiseArm = (b: Box) => b.w * 0.36;

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

/** A piece's outline, for its shadow: `width` by `depth`, centred; a round
 * piece's round, a corner piece's L, nothing for a rug, which lies flat. */
export function homeFurnitureOutline(kind: string, w: number, d: number, fill: string, look: HomeFurnitureLook = {}): SVGTemplateResult | typeof nothing {
  const b = { x: -w / 2, y: -d / 2, w, h: d };
  const small = Math.min(w, d);
  const shape = small < 7 ? "box" : shapeOf(kind, look.model);
  if (shape === "flat") return nothing;
  if (shape === "round") return ellipse(b, fill);
  if (shape === "cornerL" || shape === "chaiseR") return svg`<path d=${lPath(b, shape === "cornerL" ? cornerArm(b) : chaiseArm(b))} fill=${fill} />`;
  return rounded(b, small < 7 ? small * 0.2 : corner(kind, small), fill);
}

/**
 * One piece `w` by `d` drawing units, centred on the origin, its back
 * towards minus y. `scale` is units per meter, for the parts with a real
 * size (a stair's tread). `look` is the catalog piece it is and its own
 * colours. Too small for its parts, a soft box.
 */
export function homeFurnitureArt(kind: string, w: number, d: number, scale: number, look: HomeFurnitureLook = {}): SVGTemplateResult {
  const b: Box = { x: -w / 2, y: -d / 2, w, h: d };
  const small = Math.min(w, d);
  const paint = paintOf(look);
  if (small < 7) return rounded(b, small * 0.2, paint.fabric);
  const own = look.model === undefined ? undefined : pieceOf(look.model, b, small, paint);
  const parts = own ?? piece(kind, b, small, scale, paint);
  const shape = shapeOf(kind, look.model);
  // A plant's leaves are its edge.
  const edge = shape === "box" ? rounded(b, corner(kind, small), "", { stroke: C.edge, width: 1 })
    : shape === "round" ? (kind === "plant" ? nothing : ellipse(b, "none", C.edge, 1))
    : shape === "flat" ? nothing
    : svg`<path d=${lPath(b, shape === "cornerL" ? cornerArm(b) : chaiseArm(b))} fill="none" stroke=${C.edge} stroke-width="1" />`;
  return svg`${parts}${edge}`;
}

function appliance(b: Box, small: number, fill: string): SVGTemplateResult {
  return rounded(b, small * 0.08, fill);
}

function drain(x: number, y: number, small: number): SVGTemplateResult {
  const r = Math.max(small * 0.035, 1);
  return svg`<circle cx=${r2(x)} cy=${r2(y)} r=${r2(r)} fill=${C.screen} fill-opacity="0.6" />`;
}

function piece(kind: string, b: Box, small: number, scale: number, p: Paint): SVGTemplateResult[] {
  const maxX = b.x + b.w;
  const maxY = b.y + b.h;
  const midX = b.x + b.w / 2;
  const midY = b.y + b.h / 2;
  switch (kind) {
    case "bed": {
      const out = [rounded(b, small * 0.06, p.wood)];
      const mattress = inset(b, small * 0.04, small * 0.04);
      out.push(rounded(mattress, small * 0.05, p.fabricLight));
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
      out.push(rounded({ x: mattress.x, y: top, w: mattress.w, h: mattress.y + mattress.h - top }, small * 0.05, p.fabric));
      const fold = { x: mattress.x, y: top, w: mattress.w, h: b.h * 0.08 };
      out.push(rounded(fold, small * 0.04, p.fold), line(fold.x, fold.y + fold.h, fold.x + fold.w, fold.y + fold.h, C.line, 0.75));
      return out;
    }
    case "sofa": {
      const out = [rounded(b, small * 0.18, p.fabricDark)];
      const back = b.h * 0.28;
      const arm = Math.min(b.w * 0.12, b.h * 0.32);
      const seat = { x: b.x + arm, y: b.y + back, w: b.w - arm * 2, h: b.h - back - small * 0.06 };
      if (seat.w <= 4 || seat.h <= 4) return out;
      const count = b.w > b.h * 2.4 ? 3 : b.w > b.h * 1.2 ? 2 : 1;
      const gap = 1.5;
      const width = (seat.w - gap * (count - 1)) / count;
      for (let i = 0; i < count; i += 1) {
        const cushion = { x: seat.x + i * (width + gap), y: seat.y, w: width, h: seat.h };
        out.push(rounded(cushion, small * 0.1, p.fabric), rounded(cushion, small * 0.1, "", { stroke: C.shine, width: 0.75, dy: 0.5 }));
      }
      return out;
    }
    case "chair": {
      const seat = { x: b.x + b.w * 0.12, y: b.y + b.h * 0.26, w: b.w * 0.76, h: b.h * 0.64 };
      return [rounded(b, small * 0.22, p.fabricDark), rounded(seat, small * 0.18, p.fabric), rounded(seat, small * 0.18, "", { stroke: C.shine, width: 0.75 })];
    }
    case "table": {
      const i = Math.min(small * 0.1, 4);
      return [rounded(b, small * 0.08, p.table), rounded(inset(b, i, i), small * 0.05, "", { stroke: C.shine, width: 0.75 })];
    }
    case "storage": {
      // Its doors meet in the middle, with a handle each side.
      const handle = Math.max(small * 0.05, 1.2);
      return [
        rounded(b, small * 0.08, p.wood),
        line(midX, b.y + small * 0.12, midX, maxY, C.line, 1),
        ...[-handle * 2.2, handle * 2.2].map((dx) => svg`<circle cx=${r2(midX + dx)} cy=${r2(maxY - small * 0.28)} r=${r2(handle)} fill=${C.shine} />`),
        line(b.x, b.y + small * 0.12, maxX, b.y + small * 0.12, C.shine, 0.75),
      ];
    }
    case "television":
      return [rounded(b, 1.5, p.bodyDark ?? C.screen), line(b.x + 1, maxY - 0.5, maxX - 1, maxY - 0.5, "rgba(255,255,255,0.35)", 1)];
    case "refrigerator": {
      const front = maxY - b.h * 0.14;
      return [appliance(b, small, p.appliance), line(b.x + small * 0.08, front, maxX - small * 0.08, front, C.line, 1)];
    }
    case "oven":
    case "stove": {
      const radius = small * 0.15;
      const out = [appliance(b, small, p.appliance)];
      for (const x of [midX - b.w * 0.22, midX + b.w * 0.22]) {
        for (const y of [midY - b.h * 0.2, midY + b.h * 0.2]) {
          out.push(svg`<circle cx=${r2(x)} cy=${r2(y)} r=${r2(radius)} fill="none" stroke=${C.screen} stroke-opacity="0.7" stroke-width=${r2(Math.max(radius * 0.3, 1))} />`);
        }
      }
      return out;
    }
    case "dishwasher": {
      const i = small * 0.14;
      return [appliance(b, small, p.appliance), rounded(inset(b, i, i), small * 0.05, "", { stroke: C.line, width: 1 })];
    }
    case "washerDryer": {
      const radius = small * 0.32;
      return [appliance(b, small, p.appliance), svg`<circle cx=${r2(midX)} cy=${r2(midY)} r=${r2(radius)} fill=${C.whiteShade} stroke=${C.line} stroke-width=${r2(Math.max(radius * 0.14, 1))} />`];
    }
    case "sink": {
      const bowl = inset(b, b.w * 0.18, b.h * 0.2);
      bowl.y += b.h * 0.04;
      return [appliance(b, small, p.appliance), ellipse(bowl, C.whiteShade), drain(bowl.x + bowl.w / 2, bowl.y + bowl.h / 2, small)];
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
      return [rounded(b, small * 0.04, p.wood), svg`<path d=${d} stroke=${C.line} stroke-width="1" fill="none" />`];
    }
    // The kinds only the furniture catalog has.
    case "ottoman":
      return [rounded(b, small * 0.22, p.fabricDark), ...cushion(inset(b, small * 0.1, small * 0.1), small * 0.16, p.fabric)];
    case "bench":
      return [rounded(b, small * 0.1, p.wood), line(b.x + small * 0.08, midY, maxX - small * 0.08, midY, C.line, 0.75)];
    case "speaker": {
      const cone = Math.max(small * 0.32, 1);
      return [
        rounded(b, small * 0.12, p.ownWood ? p.wood : DARK),
        svg`<circle cx=${r2(midX)} cy=${r2(midY)} r=${r2(cone)} fill=${p.bodyDark ?? "rgb(70,70,76)"} stroke="rgba(255,255,255,0.18)" stroke-width="1" />`,
        svg`<circle cx=${r2(midX)} cy=${r2(midY)} r=${r2(cone * 0.32)} fill="rgb(96,96,102)" />`,
      ];
    }
    case "screen": {
      // The screen along the back, its foot in front of it.
      const panel = { x: b.x, y: b.y + b.h * 0.08, w: b.w, h: b.h * 0.3 };
      return [ellipse({ x: midX - b.w * 0.16, y: b.y + b.h * 0.42, w: b.w * 0.32, h: b.h * 0.5 }, p.body ?? "rgb(96,96,102)"), rounded(panel, 1, p.bodyDark ?? C.screen)];
    }
    case "laptop": {
      const lid = { x: b.x, y: b.y, w: b.w, h: b.h * 0.12 };
      const base = { x: b.x, y: b.y + b.h * 0.1, w: b.w, h: b.h * 0.9 };
      return [rounded(base, small * 0.06, p.body ?? "rgb(176,178,182)"), rounded(inset(base, b.w * 0.08, b.h * 0.14), small * 0.03, p.bodyDark ?? "rgb(132,134,138)"), rounded(lid, 1, "rgb(56,56,60)")];
    }
    case "microwave":
      return [appliance(b, small, p.appliance), rounded({ x: b.x + b.w * 0.08, y: maxY - b.h * 0.18, w: b.w * 0.62, h: b.h * 0.1 }, 1, C.screen)];
    case "coffeeMachine":
      return [appliance(b, small, p.appliance), svg`<circle cx=${r2(midX)} cy=${r2(maxY - b.h * 0.28)} r=${r2(small * 0.16)} fill=${C.screen} fill-opacity="0.7" />`];
    case "toaster": {
      const slot = (y: number) => rounded({ x: b.x + b.w * 0.16, y, w: b.w * 0.68, h: b.h * 0.14 }, 1, C.screen);
      return [rounded(b, small * 0.2, p.body ?? "rgb(190,190,194)"), slot(midY - b.h * 0.22), slot(midY + b.h * 0.08)];
    }
    case "hood":
      return [appliance(b, small, p.appliance), rounded(inset(b, small * 0.14, small * 0.14), small * 0.04, "", { stroke: C.line, width: 1 })];
    case "shower": {
      const tray = inset(b, small * 0.08, small * 0.08);
      return [
        rounded(b, small * 0.06, C.white),
        rounded(tray, small * 0.05, "url(#wa-hmf-tub)"),
        drain(midX, midY, small),
        line(b.x + 1, maxY - 0.75, maxX - 1, maxY - 0.75, GLASS, 1.5),
      ];
    }
    case "mirror":
      return [rounded(b, 1.5, "rgb(196,206,212)"), line(b.x + 1, maxY - 0.5, maxX - 1, maxY - 0.5, "rgba(255,255,255,0.55)", 1)];
    case "lamp":
      return shade(b, small, p, true);
    case "fan": {
      // Four blades round a hub.
      const blade = { x: -small * 0.07, y: -small * 0.48, w: small * 0.14, h: small * 0.4 };
      const blades = [0, 90, 180, 270].map((a) => svg`<g transform=${`translate(${r2(midX)} ${r2(midY)}) rotate(${a + 20})`}>${rounded(blade, small * 0.06, p.wood)}</g>`);
      return [...blades, svg`<circle cx=${r2(midX)} cy=${r2(midY)} r=${r2(small * 0.11)} fill=${p.body ?? "rgb(200,200,204)"} stroke=${C.edge} stroke-width="1" />`];
    }
    case "rug":
      return rug(b, small, p, false);
    case "plant":
      return plant(b, small, p);
    case "books": {
      const book = (i: number, fill: string) => rounded({ x: b.x + i * b.w * 0.06, y: b.y + b.h * (0.06 + i * 0.12), w: b.w * 0.86, h: b.h * 0.62 }, 0.8, fill);
      return [book(0, "rgb(160,72,60)"), book(1, "rgb(60,96,140)"), book(2, "rgb(200,180,120)")];
    }
    case "bin":
      return [ellipse(b, p.body ?? "rgb(118,120,124)"), ellipse(inset(b, small * 0.14, small * 0.14), p.bodyDark ?? "rgb(64,66,70)")];
    case "box":
      return [rounded(b, small * 0.04, p.ownWood ? p.wood : "rgb(184,146,100)"), line(midX, b.y, midX, maxY, "rgba(255,240,205,0.45)", Math.max(small * 0.12, 1))];
    default:
      return [rounded(b, small * 0.14, p.fabric)];
  }
}

const DARK = "rgb(44,44,48)";
const GLASS = "rgba(150,200,235,0.85)";
/** A table's glass top. */
const GLASS_TOP = "rgba(176,206,222,0.4)";

/** A cushion with its shine. */
function cushion(b: Box, radius: number, fill: string): SVGTemplateResult[] {
  return [rounded(b, radius, fill), rounded(b, radius, "", { stroke: C.shine, width: 0.75, dy: 0.5 })];
}

/** A lamp's shade from above, round or square, its bulb a warm dot inside
 * the rim. */
function shade(b: Box, small: number, p: Paint, round: boolean): SVGTemplateResult[] {
  const s = { x: b.x + (b.w - small) / 2, y: b.y + (b.h - small) / 2, w: small, h: small };
  const rim = inset(s, small * 0.16, small * 0.16);
  const cx = s.x + small / 2;
  const cy = s.y + small / 2;
  const bulb = svg`<circle cx=${r2(cx)} cy=${r2(cy)} r=${r2(Math.max(small * 0.1, 0.8))} fill="rgb(255,232,180)" />`;
  return round
    ? [ellipse(s, p.shade, C.edge, 1), ellipse(rim, "none", C.line, 0.75), bulb]
    : [rounded(s, small * 0.08, p.shade, {}), rounded(s, small * 0.08, "", { stroke: C.edge, width: 1 }), rounded(rim, small * 0.04, "", { stroke: C.line, width: 0.75 }), bulb];
}

/** A rug: its field and a border a little in from its edge; in its own
 * fabric, else its wood (a coir doormat), else a light fabric. */
function rug(b: Box, small: number, p: Paint, round: boolean): SVGTemplateResult[] {
  const i = Math.max(small * 0.07, 1.5);
  const field = p.ownFabric ? p.fabric : p.ownWood ? p.wood : p.fabricLight;
  const border = p.ownFabric || !p.ownWood ? p.fabricDark : C.line;
  return round
    ? [ellipse(b, field), ellipse(inset(b, i, i), "none", border, 1.5)]
    : [rounded(b, small * 0.04, field), rounded(inset(b, i, i), small * 0.03, "", { stroke: border, width: 1.5 })];
}

/** A potted plant: its pot under a ring of leaves, the leaves in its body
 * colour and the pot in its wood when the look has them. */
function plant(b: Box, small: number, p: Paint): SVGTemplateResult[] {
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const r = small / 2;
  const leaf = [p.body ?? "rgb(84,128,76)", p.bodyDark ?? "rgb(110,152,90)"];
  const leaves = [0, 1, 2, 3, 4, 5, 6].map((i) => svg`<ellipse cx=${r2(cx)} cy=${r2(cy - r * 0.48)} rx=${r2(r * 0.2)} ry=${r2(r * 0.5)}
    fill=${leaf[i % 2]} transform=${`rotate(${i * 51.4} ${r2(cx)} ${r2(cy)})`} />`);
  return [svg`<circle cx=${r2(cx)} cy=${r2(cy)} r=${r2(r * 0.62)} fill=${p.ownWood ? p.wood : "rgb(150,96,70)"} />`, ...leaves];
}

/** A corner sofa's L along its back and right side, or a sofa with its
 * chaise down the right: its back, arms and cushions. */
function cornerSofa(b: Box, small: number, p: Paint, chaise: boolean): SVGTemplateResult[] {
  const maxX = b.x + b.w;
  const t = chaise ? chaiseArm(b) : cornerArm(b);
  const back = t * 0.3;
  const arm = t * 0.26;
  const gap = small * 0.03;
  const out = [svg`<path d=${lPath(b, t)} fill=${p.fabricDark} />`];
  // The seat along the back, an arm at its left end.
  const seat = { x: b.x + arm, y: b.y + back, w: b.w - t - arm, h: t - back - gap };
  // A chaise runs down the right from the back with no arm at its foot; a
  // corner's right arm has a back along the outside and an arm at its foot.
  const right = chaise
    ? { x: maxX - t + gap, y: b.y + back, w: t - gap * 2, h: b.h - back - gap }
    : { x: maxX - t + gap, y: b.y + back, w: t - back - gap * 2, h: b.h - back - arm };
  out.push(...cushions(seat, small, p), ...cushion(right, small * 0.08, p.fabric));
  return out;
}

/** A sofa's seat split into one, two or three cushions by its length. */
function cushions(seat: Box, small: number, p: Paint): SVGTemplateResult[] {
  if (seat.w <= 4 || seat.h <= 4) return [];
  const count = seat.w > seat.h * 2.4 ? 3 : seat.w > seat.h * 1.2 ? 2 : 1;
  const gap = 1.5;
  const width = (seat.w - gap * (count - 1)) / count;
  const out: SVGTemplateResult[] = [];
  for (let i = 0; i < count; i += 1) out.push(...cushion({ x: seat.x + i * (width + gap), y: seat.y, w: width, h: seat.h }, small * 0.08, p.fabric));
  return out;
}

/** The catalog pieces whose kind alone draws them wrong: a chair that is
 * an armchair, an office chair or a stool, a table that is round, glass,
 * clothed, a desk or a corner desk, a bookcase with open shelves, an old
 * TV, a round rug, a square or wall lamp, a corner shower. Undefined for
 * any other, drawn by its kind. */
function pieceOf(model: string, b: Box, small: number, p: Paint): SVGTemplateResult[] | undefined {
  const maxX = b.x + b.w;
  const maxY = b.y + b.h;
  const midX = b.x + b.w / 2;
  const midY = b.y + b.h / 2;
  switch (model) {
    case "loungeSofaCorner":
    case "loungeDesignSofaCorner":
      return cornerSofa(b, small, p, false);
    case "loungeSofaLong":
      return cornerSofa(b, small, p, true);
    case "loungeChair":
    case "loungeChairRelax":
    case "loungeDesignChair": {
      // An armchair: a deep back, an arm each side, one seat cushion.
      const back = b.h * 0.28;
      const arm = Math.min(b.w * 0.17, b.h * 0.3);
      const seat = { x: b.x + arm, y: b.y + back, w: b.w - arm * 2, h: b.h - back - small * 0.06 };
      return [rounded(b, small * 0.2, p.fabricDark), ...cushion(seat, small * 0.12, p.fabric)];
    }
    case "chairDesk": {
      // An office chair: five feet in a star, a round seat, a curved back.
      const r = small * 0.48;
      let d = "";
      for (let i = 0; i < 5; i += 1) {
        const a = (i * 72 + 90) * (Math.PI / 180);
        d += `M${r2(midX)} ${r2(midY)}L${r2(midX + Math.cos(a) * r)} ${r2(midY + Math.sin(a) * r)}`;
      }
      const seat = inset({ x: midX - small / 2, y: midY - small / 2, w: small, h: small }, small * 0.12, small * 0.12);
      const backrest = { x: midX - b.w * 0.34, y: b.y, w: b.w * 0.68, h: b.h * 0.18 };
      return [
        svg`<path d=${d} stroke=${p.bodyDark ?? C.screen} stroke-opacity=${p.bodyDark === undefined ? 0.55 : 1} stroke-width=${r2(Math.max(small * 0.06, 1))} stroke-linecap="round" fill="none" />`,
        ellipse(seat, p.fabric, C.edge, 1),
        rounded(backrest, b.h * 0.09, p.fabricDark),
      ];
    }
    case "stoolBar":
      return [ellipse(b, p.wood), ellipse(inset(b, small * 0.14, small * 0.14), p.woodLight)];
    case "stoolBarSquare":
      return [rounded(b, small * 0.18, p.wood), rounded(inset(b, small * 0.14, small * 0.14), small * 0.12, p.woodLight)];
    case "chair":
    case "chairCushion":
    case "chairModernCushion":
    case "chairModernFrameCushion":
    case "chairRounded": {
      // A dining chair: its frame, its back along the back, its seat in
      // wood or a cushion.
      const radius = model === "chairRounded" ? small * 0.24 : small * 0.1;
      const seat = { x: b.x + b.w * 0.1, y: b.y + b.h * 0.24, w: b.w * 0.8, h: b.h * 0.68 };
      const backrest = { x: b.x, y: b.y, w: b.w, h: b.h * 0.16 };
      return [
        rounded(b, radius, p.wood),
        ...(model === "chair" ? [rounded(seat, radius * 0.8, p.woodLight)] : cushion(seat, radius * 0.8, p.fabric)),
        rounded(backrest, b.h * 0.08, p.wood),
        line(backrest.x + 1, backrest.y + backrest.h, backrest.x + backrest.w - 1, backrest.y + backrest.h, C.line, 0.75),
      ];
    }
    case "benchCushion":
      return [rounded(b, small * 0.1, p.wood), ...cushion(inset(b, small * 0.08, small * 0.1), small * 0.1, p.fabric)];
    case "tableRound": {
      const i = Math.min(small * 0.1, 4);
      return [ellipse(b, p.table), ellipse(inset(b, i, i), "none", C.shine, 0.75)];
    }
    case "tableGlass":
    case "tableCoffeeGlass": {
      // The legs seen through the glass.
      const leg = Math.max(small * 0.1, 1.5);
      const legs = [[b.x, b.y], [maxX - leg, b.y], [b.x, maxY - leg], [maxX - leg, maxY - leg]].map(([x, y]) => rounded({ x: x!, y: y!, w: leg, h: leg }, leg * 0.3, p.body ?? p.wood));
      return [...legs, rounded(b, small * 0.06, GLASS_TOP), rounded(inset(b, 1, 1), small * 0.05, "", { stroke: GLASS, width: 0.75 })];
    }
    case "tableCloth":
      return [rounded(b, small * 0.08, p.table), rounded(inset(b, small * 0.05, small * 0.05), small * 0.06, p.fabricLight), rounded(inset(b, small * 0.05, small * 0.05), small * 0.06, "", { stroke: p.fabricDark, width: 0.75 })];
    case "desk": {
      // Its top, a drawer unit at its right end under it.
      const i = Math.min(small * 0.1, 4);
      const drawers = { x: maxX - b.w * 0.3, y: b.y + b.h * 0.1, w: b.w * 0.26, h: b.h * 0.8 };
      return [rounded(b, small * 0.05, p.table), rounded(inset(b, i, i), small * 0.04, "", { stroke: C.shine, width: 0.75 }), rounded(drawers, small * 0.04, "", { stroke: C.line, width: 0.75 })];
    }
    case "deskCorner":
      return [svg`<path d=${lPath(b, cornerArm(b))} fill=${p.table} />`];
    case "bookcaseOpen":
    case "bookcaseOpenLow": {
      // Its top, and the books' spines along its open front.
      const shelf = { x: b.x + small * 0.08, y: maxY - b.h * 0.42, w: b.w - small * 0.16, h: b.h * 0.34 };
      const spine = Math.max(shelf.w / Math.max(Math.round(shelf.w / 3), 1), 1);
      const books = Array.from({ length: Math.max(Math.round(shelf.w / spine), 0) }, (_, i) =>
        rounded({ x: shelf.x + i * spine + 0.2, y: shelf.y + (i % 3) * 0.6, w: spine - 0.4, h: shelf.h - (i % 3) * 0.6 }, 0.3, BOOKS[i % BOOKS.length]!));
      return [rounded(b, small * 0.06, p.wood), rounded(shelf, 0.5, "rgb(58,46,36)"), ...books];
    }
    case "coatRackStanding":
      return [ellipse(inset(b, small * 0.1, small * 0.1), "none", p.wood, Math.max(small * 0.06, 1)), svg`<circle cx=${r2(midX)} cy=${r2(midY)} r=${r2(small * 0.12)} fill=${p.wood} />`];
    case "televisionVintage":
      return [rounded(b, small * 0.14, "rgb(78,66,56)"), rounded({ x: b.x + b.w * 0.12, y: maxY - b.h * 0.2, w: b.w * 0.76, h: b.h * 0.12 }, 1, C.screen)];
    case "rugRound":
      return rug(b, small, p, true);
    case "lampSquareFloor":
    case "lampSquareTable":
    case "lampSquareCeiling":
      return shade(b, small, p, false);
    case "lampWall": {
      // Half a shade against the wall behind it.
      return [svg`<path d=${`M${r2(b.x)} ${r2(b.y)}A${r2(b.w / 2)} ${r2(b.h)} 0 0 0 ${r2(maxX)} ${r2(b.y)}Z`} fill=${p.shade} stroke=${C.edge} stroke-width="1" />`,
        svg`<circle cx=${r2(midX)} cy=${r2(b.y + b.h * 0.35)} r=${r2(Math.max(small * 0.14, 0.8))} fill="rgb(255,232,180)" />`];
    }
    case "showerRound": {
      // A quarter round tray in the corner behind it on the left, its
      // curved glass at the front.
      const arc = (box: Box) => `M${r2(box.x)} ${r2(box.y)}H${r2(box.x + box.w)}A${r2(box.w)} ${r2(box.h)} 0 0 1 ${r2(box.x)} ${r2(box.y + box.h)}Z`;
      return [
        svg`<path d=${arc(b)} fill=${C.white} />`,
        svg`<path d=${arc(inset(b, small * 0.06, small * 0.06))} fill="url(#wa-hmf-tub)" />`,
        drain(b.x + b.w * 0.32, b.y + b.h * 0.32, small),
        svg`<path d=${`M${r2(maxX)} ${r2(b.y)}A${r2(b.w)} ${r2(b.h)} 0 0 1 ${r2(b.x)} ${r2(maxY)}`} fill="none" stroke=${GLASS} stroke-width="1.5" />`,
      ];
    }
  }
  return undefined;
}

const BOOKS = ["rgb(160,72,60)", "rgb(60,96,140)", "rgb(200,180,120)", "rgb(90,120,84)", "rgb(120,90,130)"];
