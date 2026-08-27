// SF Symbol providers behind one interface so the development and release
// providers can differ without touching the saved document format.
//
// `CupertinoIconProvider` uses the icon set the Home Assistant Cupertino
// Icons frontend registers on `window.customIcons.ios` (names like
// `lightbulb-fill` for `lightbulb.fill`). `PlaceholderIconProvider` draws
// nothing and lets the renderer show its dashed "?" box; it is the fallback
// when no icon pack is installed.

import { svg, type TemplateResult } from "lit";
import type { IconProvider } from "./renderer.js";
import { parseColor } from "./renderer.js";

interface CustomIconResult {
  path?: string;
  viewBox?: string;
}
interface CustomIconSet {
  getIcon(name: string): Promise<CustomIconResult> | CustomIconResult;
}

declare global {
  interface Window {
    customIcons?: Record<string, CustomIconSet>;
  }
}

export function sfToCupertino(symbol: string): string {
  return symbol.trim().replace(/\./g, "-");
}

export class PlaceholderIconProvider implements IconProvider {
  render(): TemplateResult | undefined {
    return undefined;
  }
}

/** Resolves through `window.customIcons.ios`, caching paths; missing names
 * fall through to the placeholder. Because `getIcon` may be async, the
 * first render of a new symbol returns undefined and `onReady` fires when
 * the glyph has arrived so the host can re-render. */
export class CupertinoIconProvider implements IconProvider {
  private cache = new Map<string, CustomIconResult | null>();
  private pending = new Set<string>();

  constructor(private readonly onReady: () => void) {}

  static available(): boolean {
    return typeof window !== "undefined" && !!window.customIcons?.ios;
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

export function makeIconProvider(onReady: () => void): IconProvider {
  return CupertinoIconProvider.available() ? new CupertinoIconProvider(onReady) : new PlaceholderIconProvider();
}
