// The devices' own sizes for every SF Symbol the panel ships: what
// `UIImage(systemName:)` measures, which One Look lays a glyph out by. The
// panel draws its symbols from SVG outlines whose box is the ink alone, and
// the image around the ink differs by symbol, so a fixed margin was off by up
// to a fifth (the parity fixtures, 2026-11-05). The app writes the table
// (`OneLookParityTests`, `Fixtures/parity/symbol-sizes.json`) and
// `build-symbol-sizes.mjs` turns it into the gzipped file served beside the
// bundle, loaded on first use.

import type { SymbolInk } from "./renderer.js";
import { SYMBOL_SIZES_DIGEST } from "./symbol-sizes-digest.js";

export interface SymbolImageSize {
  readonly aspect: number;
  readonly extent: number;
  /** The image and its ink at the medium weight One Look's glyph is drawn
   * in, when the table has them. */
  readonly ink?: SymbolInk;
}

export class SymbolSizes {
  private sizes = new Map<string, SymbolImageSize>();
  private state: "idle" | "loading" | "loaded" = "idle";

  constructor(
    private readonly onReady: () => void,
    private readonly file = "symbol-sizes.json.gz",
    private readonly digest = SYMBOL_SIZES_DIGEST,
  ) {}

  /** The symbol's size, or undefined while the table loads or lacks it.
   * Asking starts the load. */
  get(name: string): SymbolImageSize | undefined {
    this.load();
    return this.sizes.get(name.trim());
  }

  /** Fill the table from its JSON (`{ name: [aspect, extent, imageWidth,
   * imageHeight, inkX, inkY, inkWidth, inkHeight] }`, the last six only
   * where the device drew the symbol). */
  fill(data: unknown): void {
    if (data === null || typeof data !== "object") return;
    for (const [name, v] of Object.entries(data as Record<string, unknown>)) {
      if (Array.isArray(v) && typeof v[0] === "number" && typeof v[1] === "number" && v[0] > 0 && v[1] > 0) {
        const n = v as number[];
        const ink = n.length >= 8 && n.slice(2, 8).every((x) => typeof x === "number") && n[4]! >= 0 && n[6]! > 0 && n[7]! > 0
          ? { imageWidth: n[2]!, imageHeight: n[3]!, x: n[4]!, y: n[5]!, width: n[6]!, height: n[7]! }
          : undefined;
        this.sizes.set(name, { aspect: n[0]!, extent: n[1]!, ...(ink === undefined ? {} : { ink }) });
      }
    }
    this.state = "loaded";
  }

  private load(): void {
    if (this.state !== "idle") return;
    this.state = "loading";
    if (typeof fetch !== "function" || typeof DecompressionStream === "undefined") {
      this.state = "loaded";
      return;
    }
    const url = new URL(`${this.file}?v=${this.digest}`, import.meta.url);
    fetch(url)
      .then((res) => {
        if (!res.ok || !res.body) throw new Error(`${this.file}: ${res.status}`);
        return new Response(res.body.pipeThrough(new DecompressionStream("gzip"))).json();
      })
      .then((data: unknown) => this.fill(data))
      .catch(() => {
        // Without the table the glyphs keep the outline's estimate.
      })
      .finally(() => {
        this.state = "loaded";
        this.onReady();
      });
  }
}
