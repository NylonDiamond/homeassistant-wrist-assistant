// Icon providers behind one interface so the development and release
// providers can differ without touching the saved document format.
//
// `BundledIconProvider` reads a gzipped icon file the integration ships beside
// the panel bundle, so pictures work with nothing else installed. There are two
// such files: SF Symbols, and Material Design. `CupertinoIconProvider` uses the
// icon set the Home Assistant Cupertino Icons frontend registers on
// `window.customIcons.ios` (names like `lightbulb-fill` for `lightbulb.fill`);
// it stays as a fallback for anyone who already has that integration.
// `PlaceholderIconProvider` draws nothing and lets the renderer show its dashed
// "?" box. `SplitIconProvider` puts an SF provider and the Material Design file
// behind one object, routing on the `mdi:` prefix.

import { svg, type TemplateResult } from "lit";
import type { IconProvider } from "./renderer.js";
import { parseColor } from "./renderer.js";
import { SYMBOL_DIGEST } from "./symbol-digest.js";
import { MDI_DIGEST } from "./mdi-digest.js";
import { MDI_PREFIX } from "./symbols.js";

interface CustomIconResult {
  path?: string;
  viewBox?: string;
}
interface CustomIconSet {
  getIcon(name: string): Promise<CustomIconResult> | CustomIconResult;
  /** Optional in the Home Assistant custom-icons convention, so always guarded. */
  getIconList?(): Promise<{ name: string }[]> | { name: string }[];
}

declare global {
  interface Window {
    customIcons?: Record<string, CustomIconSet>;
  }
}

export function sfToCupertino(symbol: string): string {
  return symbol.trim().replace(/\./g, "-");
}

/** The reverse. Apple's names use dots and no hyphens, so this round-trips. */
export function cupertinoToSF(name: string): string {
  return name.trim().replace(/-/g, ".");
}

export class PlaceholderIconProvider implements IconProvider {
  render(): TemplateResult | undefined {
    return undefined;
  }

  available(): boolean {
    return false;
  }

  /** Draws nothing, so it can honestly claim no names. The picker falls back to
   * its own curated catalogue and shows the names without pictures. */
  names(): string[] {
    return [];
  }
}

/** Resolves through `window.customIcons.ios`, caching paths; missing names
 * fall through to the placeholder. Because `getIcon` may be async, the
 * first render of a new symbol returns undefined and `onReady` fires when
 * the glyph has arrived so the host can re-render. */
export class CupertinoIconProvider implements IconProvider {
  private cache = new Map<string, CustomIconResult | null>();
  private pending = new Set<string>();
  private nameList: string[] = [];
  private nameState: "idle" | "loading" | "loaded" = "idle";

  constructor(private readonly onReady: () => void) {}

  static available(): boolean {
    return typeof window !== "undefined" && !!window.customIcons?.ios;
  }

  available(): boolean {
    return CupertinoIconProvider.available();
  }

  /** Undefined on the first call; `onReady` fires once the pack has answered.
   * `getIconList` is optional in the custom-icons convention, so a pack that
   * draws fine can still settle on an empty list. */
  names(): string[] | undefined {
    if (this.nameState === "idle") this.fetchNames();
    return this.nameState === "loaded" ? this.nameList : undefined;
  }

  private fetchNames() {
    this.nameState = "loading";
    const set = window.customIcons?.ios;
    if (!set || typeof set.getIconList !== "function") {
      this.nameState = "loaded";
      return;
    }
    Promise.resolve()
      .then(() => set.getIconList!())
      .then((items) => {
        this.nameList = (items ?? []).map((i) => cupertinoToSF(i.name)).sort();
      })
      .catch(() => {
        this.nameList = [];
      })
      .finally(() => {
        this.nameState = "loaded";
        this.onReady();
      });
  }

  render(symbol: string, size: number, colorHex: string): TemplateResult | undefined {
    const name = sfToCupertino(symbol);
    const cached = this.cache.get(name);
    if (cached === undefined) {
      this.fetch(name);
      return undefined;
    }
    if (cached === null || !cached.path) return undefined;
    const c = parseColor(colorHex) ?? { color: "#FFFFFF", opacity: 1 };
    const viewBox = cached.viewBox ?? "0 0 24 24";
    return svg`<svg x="0" y="0" width=${size} height=${size} viewBox=${viewBox}>
      <path d=${cached.path} fill=${c.color} fill-opacity=${c.opacity} /></svg>`;
  }

  private fetch(name: string) {
    if (this.pending.has(name)) return;
    const set = window.customIcons?.ios;
    if (!set) {
      this.cache.set(name, null);
      return;
    }
    this.pending.add(name);
    Promise.resolve()
      .then(() => set.getIcon(name))
      .then((res) => this.cache.set(name, res && res.path ? { ...res, path: snapHalfCircleArcs(res.path) } : null))
      .catch(() => this.cache.set(name, null))
      .finally(() => {
        this.pending.delete(name);
        this.onReady();
      });
  }
}

/** One symbol as the build script writes it: the path data, then the viewBox. */
type BundledIcon = [path: string, viewBox: string];

/** How far short of its circle's diameter, in user units, half an arc's
 * chord may fall and still be taken for a half circle. Two decimals put each
 * end within 0.005 of where it was and the radius within 0.005 too, so a
 * true half circle comes back up to about 0.015 short. */
const ARC_SNAP = 0.015;

const PATH_NUMBER = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;
const PATH_ARGS: Readonly<Record<string, number>> = { m: 2, l: 2, t: 2, h: 1, v: 1, c: 6, s: 4, q: 4, a: 7, z: 0 };

/**
 * `d` with every arc that is a half circle drawn as one again.
 *
 * The symbol file was squeezed by svgo at two decimals, which turns a circle
 * into two arcs between opposite points and rounds both. An arc whose chord
 * is a hair short of its diameter has two centres, each `sqrt(r * shortfall)`
 * off the chord's middle (SVG's own rule), so a rounding of 0.01 moves a
 * circle of radius 8 by 0.4: a ring and the disc inside it stop sharing a
 * centre, and the ring draws thick on one side and the gap closes
 * (`button.programmable`, `record.circle` and every other ring, dot, cap and
 * rounded end). Such an arc's radii are cut to just under half the chord,
 * which SVG grows back to exactly half: the centre is the chord's middle,
 * where the symbol had it. Every other arc, and everything else, is left as
 * it was. A path this cannot read is returned unchanged.
 */
export function snapHalfCircleArcs(d: string): string {
  const edits: { start: number; end: number; text: string }[] = [];
  let i = 0;
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let cmd = "";
  const skip = () => {
    while (i < d.length && /[\s,]/.test(d[i]!)) i++;
  };
  const number = (): { value: number; start: number; end: number } | undefined => {
    skip();
    PATH_NUMBER.lastIndex = i;
    const m = PATH_NUMBER.exec(d);
    if (!m) return undefined;
    const start = i;
    i += m[0].length;
    return { value: Number(m[0]), start, end: i };
  };
  const flag = (): number | undefined => {
    skip();
    const c = d[i];
    if (c !== "0" && c !== "1") return undefined;
    i++;
    return c === "1" ? 1 : 0;
  };
  while (true) {
    skip();
    if (i >= d.length) break;
    const c = d[i]!;
    if (/[A-Za-z]/.test(c)) {
      if (!Object.hasOwn(PATH_ARGS, c.toLowerCase())) return d;
      cmd = c;
      i++;
      if (c === "z" || c === "Z") {
        x = startX;
        y = startY;
        continue;
      }
    } else if (cmd === "" || cmd === "z" || cmd === "Z") {
      return d;
    }
    const lower = cmd.toLowerCase();
    const rel = cmd === lower;
    const ox = rel ? x : 0;
    const oy = rel ? y : 0;
    if (lower === "a") {
      const rx = number();
      const ry = number();
      const rot = number();
      const large = flag();
      const sweep = flag();
      const ex = number();
      const ey = number();
      if (!rx || !ry || !rot || large === undefined || sweep === undefined || !ex || !ey) return d;
      const x2 = ox + ex.value;
      const y2 = oy + ey.value;
      const a = Math.abs(rx.value);
      const b = Math.abs(ry.value);
      if (a > 0 && b > 0) {
        // SVG's radius check (F.6.6): above 1 the radii are grown to fit.
        const phi = (rot.value * Math.PI) / 180;
        const hx = (x - x2) / 2;
        const hy = (y - y2) / 2;
        const px = Math.cos(phi) * hx + Math.sin(phi) * hy;
        const py = -Math.sin(phi) * hx + Math.cos(phi) * hy;
        const fit = Math.sqrt((px * px) / (a * a) + (py * py) / (b * b));
        if (fit < 1 && (1 - fit) * Math.max(a, b) <= ARC_SNAP) {
          const cut = (r: number) => String(Math.floor(r * fit * 10000) / 10000);
          edits.push({ start: rx.start, end: ry.end, text: ` ${cut(a)} ${cut(b)} ` });
        }
      }
      x = x2;
      y = y2;
      continue;
    }
    const n = PATH_ARGS[lower]!;
    const args: number[] = [];
    for (let k = 0; k < n; k++) {
      const v = number();
      if (!v) return d;
      args.push(v.value);
    }
    if (lower === "h") x = ox + args[0]!;
    else if (lower === "v") y = oy + args[0]!;
    else {
      x = ox + args[n - 2]!;
      y = oy + args[n - 1]!;
    }
    if (lower === "m") {
      startX = x;
      startY = y;
      // Pairs after a move's first are lines.
      cmd = rel ? "l" : "L";
    }
  }
  if (edits.length === 0) return d;
  let out = "";
  let at = 0;
  for (const e of edits) {
    out += d.slice(at, e.start) + e.text;
    at = e.end;
  }
  return out + d.slice(at);
}

/**
 * The symbols the integration ships, in one gzipped file served beside the
 * panel bundle.
 *
 * Home Assistant serves static files uncompressed, so the file arrives zipped
 * and is unpacked here with `DecompressionStream`. It is fetched once, on the
 * first question asked of it, and answered from memory after that.
 */
export class BundledIconProvider implements IconProvider {
  private icons = new Map<string, BundledIcon>();
  /** The path each symbol is drawn with, by name, worked out on first use. */
  private drawn = new Map<string, string>();
  private state: "idle" | "loading" | "loaded" = "idle";

  /** `file` and `digest` are arguments because two of these exist: the SF
   * Symbol catalogue every panel loads at once, and the much larger Material
   * Design one that waits until somebody opens its tab. */
  constructor(
    private readonly onReady: () => void,
    private readonly file: string = "symbol-icons.json.gz",
    private readonly digest: string = SYMBOL_DIGEST
  ) {}

  /** The `d` string for one name, or undefined when it is unknown or the file
   * has not arrived. Asking starts the load, like `names()` does. */
  path(symbol: string): string | undefined {
    this.load();
    return this.icons.get(symbol.trim())?.[0];
  }

  /** True once anything has been loaded. Before that the picker cannot tell
   * this apart from a missing file, which is why nothing warns until the
   * fetch has settled. */
  available(): boolean {
    return this.state !== "loaded" || this.icons.size > 0;
  }

  names(): string[] | undefined {
    this.load();
    return this.state === "loaded" ? [...this.icons.keys()].sort() : undefined;
  }

  render(symbol: string, size: number, colorHex: string): TemplateResult | undefined {
    this.load();
    const name = symbol.trim();
    const icon = this.icons.get(name);
    if (!icon) return undefined;
    // The half circles put back (`snapHalfCircleArcs`), once per symbol.
    let d = this.drawn.get(name);
    if (d === undefined) {
      d = snapHalfCircleArcs(icon[0]);
      this.drawn.set(name, d);
    }
    const c = parseColor(colorHex) ?? { color: "#FFFFFF", opacity: 1 };
    return svg`<svg x="0" y="0" width=${size} height=${size} viewBox=${icon[1]}>
      <path d=${d} fill=${c.color} fill-opacity=${c.opacity} /></svg>`;
  }

  private load() {
    if (this.state !== "idle") return;
    this.state = "loading";
    // Beside the panel bundle, whatever URL that was served from, so the same
    // code works under a subpath or a reverse proxy. The digest is in the query
    // because Home Assistant serves this route with a month of cache, and a
    // rebuilt symbol file would otherwise stay invisible for that long.
    const url = new URL(`${this.file}?v=${this.digest}`, import.meta.url);
    fetch(url)
      .then((res) => {
        if (!res.ok || !res.body) throw new Error(`${this.file}: ${res.status}`);
        return new Response(res.body.pipeThrough(new DecompressionStream("gzip"))).json();
      })
      .then((data: unknown) => {
        if (data && typeof data === "object") {
          for (const [name, icon] of Object.entries(data as Record<string, unknown>)) {
            if (Array.isArray(icon) && typeof icon[0] === "string" && typeof icon[1] === "string") {
              this.icons.set(name, [icon[0], icon[1]]);
            }
          }
        }
      })
      .catch(() => {
        // A missing or broken file leaves the picker showing names without
        // pictures, which is worth saying out loud but not worth breaking on.
      })
      .finally(() => {
        this.state = "loaded";
        this.onReady();
      });
  }
}

/**
 * SF Symbols and Material Design icons behind one provider, routed on the
 * `mdi:` prefix a document carries in `symbol`.
 *
 * The two catalogues are separate files on purpose. Every panel loads the SF
 * one straight away because most documents need it; the MDI one is half a
 * megabyte and only somebody browsing the MDI tab has any use for it, so
 * nothing fetches it until `mdiNames` or `mdiPath` is asked a question.
 */
export class SplitIconProvider implements IconProvider {
  private readonly mdi: BundledIconProvider;

  constructor(
    private readonly sf: IconProvider,
    onReady: () => void
  ) {
    this.mdi = new BundledIconProvider(onReady, "mdi-icons.json.gz", MDI_DIGEST);
  }

  render(symbol: string, size: number, colorHex: string): TemplateResult | undefined {
    const provider = symbol.trim().startsWith(MDI_PREFIX) ? this.mdi : this.sf;
    return provider.render(symbol, size, colorHex);
  }

  /** The SF side answers this: it is what the symbol picker's default tab and
   * the "missing symbol" warning are about. */
  available(): boolean {
    return this.sf.available();
  }

  names(): string[] | undefined {
    return this.sf.names();
  }

  mdiNames(): string[] | undefined {
    return this.mdi.names();
  }

  mdiPath(name: string): string | undefined {
    return this.mdi.path(name);
  }
}

export function makeIconProvider(onReady: () => void): IconProvider {
  const sf = CupertinoIconProvider.available()
    ? new CupertinoIconProvider(onReady)
    : new BundledIconProvider(onReady);
  return new SplitIconProvider(sf, onReady);
}
