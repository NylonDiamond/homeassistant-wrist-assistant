// SF Symbol providers behind one interface so the development and release
// providers can differ without touching the saved document format.
//
// `BundledIconProvider` reads the gzipped symbol file the integration ships
// beside the panel bundle, so pictures work with nothing else installed.
// `CupertinoIconProvider` uses the icon set the Home Assistant Cupertino
// Icons frontend registers on `window.customIcons.ios` (names like
// `lightbulb-fill` for `lightbulb.fill`); it stays as a fallback for anyone
// who already has that integration. `PlaceholderIconProvider` draws nothing
// and lets the renderer show its dashed "?" box.

import { svg, type TemplateResult } from "lit";
import type { IconProvider } from "./renderer.js";
import { parseColor } from "./renderer.js";
import { SYMBOL_DIGEST } from "./symbol-digest.js";

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
      .then((res) => this.cache.set(name, res && res.path ? res : null))
      .catch(() => this.cache.set(name, null))
      .finally(() => {
        this.pending.delete(name);
        this.onReady();
      });
  }
}

/** One symbol as the build script writes it: the path data, then the viewBox. */
type BundledIcon = [path: string, viewBox: string];

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
  private state: "idle" | "loading" | "loaded" = "idle";

  constructor(private readonly onReady: () => void) {}

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
    const icon = this.icons.get(symbol.trim());
    if (!icon) return undefined;
    const c = parseColor(colorHex) ?? { color: "#FFFFFF", opacity: 1 };
    return svg`<svg x="0" y="0" width=${size} height=${size} viewBox=${icon[1]}>
      <path d=${icon[0]} fill=${c.color} fill-opacity=${c.opacity} /></svg>`;
  }

  private load() {
    if (this.state !== "idle") return;
    this.state = "loading";
    // Beside the panel bundle, whatever URL that was served from, so the same
    // code works under a subpath or a reverse proxy. The digest is in the query
    // because Home Assistant serves this route with a month of cache, and a
    // rebuilt symbol file would otherwise stay invisible for that long.
    const url = new URL(`symbol-icons.json.gz?v=${SYMBOL_DIGEST}`, import.meta.url);
    fetch(url)
      .then((res) => {
        if (!res.ok || !res.body) throw new Error(`symbol file: ${res.status}`);
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

export function makeIconProvider(onReady: () => void): IconProvider {
  if (CupertinoIconProvider.available()) return new CupertinoIconProvider(onReady);
  return new BundledIconProvider(onReady);
}
