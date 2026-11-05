// The devices' own sizes for every SF Symbol the panel ships: what
// `UIImage(systemName:)` measures, which One Look lays a glyph out by. The
// panel draws its symbols from SVG outlines whose box is the ink alone, and
// the image around the ink differs by symbol, so a fixed margin was off by up
// to a fifth (the parity fixtures, 2026-11-05). The app writes the table
// (`OneLookParityTests`, `Fixtures/parity/symbol-sizes.json`) and
// `build-symbol-sizes.mjs` turns it into the gzipped file served beside the
// bundle, loaded on first use.

import { SYMBOL_SIZES_DIGEST } from "./symbol-sizes-digest.js";

export interface SymbolImageSize {
  readonly aspect: number;
  readonly extent: number;
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

  /** Fill the table from its JSON (`{ name: [aspect, extent] }`). */
  fill(data: unknown): void {
    if (data === null || typeof data !== "object") return;
    for (const [name, v] of Object.entries(data as Record<string, unknown>)) {
      if (Array.isArray(v) && typeof v[0] === "number" && typeof v[1] === "number" && v[0] > 0 && v[1] > 0) {
        this.sizes.set(name, { aspect: v[0], extent: v[1] });
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
