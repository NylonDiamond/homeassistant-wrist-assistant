// Home's Icon names card: a searchable list of SF Symbol names to copy into a
// blueprint or an automation, since the watch draws SF Symbols by name. It is
// the iPhone app's Icon Search, moved here, where the automations are written.
//
// It browses the same catalogue the layer editor's symbol field does
// (`symbolPool`, `searchSymbols`) and draws the same tiles (`.sym-grid`,
// `.sym`), so a name found here is one the editor finds too. What differs is
// what a click does: it copies the name rather than setting a field. The look
// lives in `homeStyles` (home.ts), beside the other Home cards.

import { html, nothing, type TemplateResult } from "lit";
import { drawableCount, reachableCount, symbolCount, symbolNameSet, symbolPool } from "./editors.js";
import type { IconProvider } from "./renderer.js";
import { SYMBOL_CATEGORIES, searchSymbols } from "./symbols.js";
import { uiIcon } from "./ui-icons.js";

/** Where the recently copied names are kept between visits. */
export const ICON_FINDER_RECENT_KEY = "wa-icon-finder-recent";
/** How many recently copied names the Recent row keeps. */
export const ICON_FINDER_RECENT_LIMIT = 12;
/** How many tiles the grid draws when a search runs over the whole icon pack.
 * The same cap as the symbol field's grid, for the same reason: a one letter
 * search matches thousands, and every tile is an inline SVG. */
export const ICON_FINDER_GRID_LIMIT = 120;
/** How long "Copied" stays up after a click, in milliseconds. */
const COPIED_MS = 1500;

/**
 * The names the grid offers for one category ("" for all) and one search, best
 * match first, and whether they came from the whole icon pack. `names` is what
 * the pack lists, or nothing when no pack answers, and then the curated
 * catalogue stands in. Only a pack search is ever long enough to need the cap.
 */
export function iconFinderMatches(
  names: readonly string[],
  category: string,
  query: string,
): { matches: string[]; fromPack: boolean } {
  const pool = symbolPool(category, query, names, symbolNameSet(names));
  return { matches: searchSymbols(pool.names, query), fromPack: pool.fromPack };
}

/** The recent list with `name` put first, once, at most twelve long. A blank
 * name leaves the list as it was. */
export function rememberRecent(recent: readonly string[], name: string): string[] {
  const clean = name.trim();
  if (!clean) return [...recent];
  return [clean, ...recent.filter((s) => s !== clean)].slice(0, ICON_FINDER_RECENT_LIMIT);
}

/** What the card remembers while the panel is open: the search, the chosen
 * category, the name just copied, and the recently copied names, which also
 * survive a reload. */
export class IconFinderState {
  query = "";
  /** A category name from `SYMBOL_CATEGORIES`, or "" for all of them. */
  category = "";
  /** The name the last click copied, while "Copied" is showing. */
  copied = "";
  /** Whether that copy failed, so the line says how to finish it by hand. */
  copyFailed = false;
  timer: ReturnType<typeof setTimeout> | undefined;
  recent: string[];

  /** The pack's names, kept once the provider has answered: the list does
   * not change while the panel is open, and asking again can mean sorting
   * thousands of names on every draw. */
  private pack: readonly string[] | undefined;
  private last: { pack: readonly string[]; category: string; query: string; result: { matches: string[]; fromPack: boolean } } | undefined;

  constructor() {
    this.recent = IconFinderState.load();
  }

  /** The pack's names, or an empty list while it loads or when there is none. */
  names(icons: Pick<IconProvider, "names">): readonly string[] {
    if (this.pack !== undefined) return this.pack;
    const listed = icons.names();
    if (listed === undefined) return [];
    this.pack = listed;
    return listed;
  }

  /** `iconFinderMatches`, the last answer again while nothing it reads has
   * changed. The card draws with every Home Assistant state change. */
  matches(names: readonly string[]): { matches: string[]; fromPack: boolean } {
    const last = this.last;
    if (last && last.pack === names && last.category === this.category && last.query === this.query) return last.result;
    const result = iconFinderMatches(names, this.category, this.query);
    this.last = { pack: names, category: this.category, query: this.query, result };
    return result;
  }

  noteRecent(name: string) {
    this.recent = rememberRecent(this.recent, name);
    try {
      localStorage.setItem(ICON_FINDER_RECENT_KEY, JSON.stringify(this.recent));
    } catch {
      // No storage here; the list holds for this visit only.
    }
  }

  // Storage can be missing or throw outright with site data blocked, so a
  // broken read is an empty list rather than a broken card.
  private static load(): string[] {
    try {
      const raw = localStorage.getItem(ICON_FINDER_RECENT_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((s): s is string => typeof s === "string" && s.trim() !== "").slice(0, ICON_FINDER_RECENT_LIMIT);
    } catch {
      return [];
    }
  }
}

/** What the card reads from the panel. */
export interface IconFinderHost {
  icons: Pick<IconProvider, "names" | "render">;
  finder: IconFinderState;
  requestUpdate: () => void;
}

/**
 * Put `text` on the clipboard. Home Assistant over plain http has no
 * `navigator.clipboard`, and a browser can refuse the write where it has one,
 * so the old `execCommand("copy")` on a hidden box goes second. False when
 * both failed.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Refused; try the old way.
  }
  const box = document.createElement("textarea");
  box.value = text;
  box.setAttribute("readonly", "");
  box.style.position = "fixed";
  box.style.top = "0";
  box.style.left = "0";
  box.style.opacity = "0";
  document.body.appendChild(box);
  box.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  box.remove();
  return copied;
}

async function copyName(host: IconFinderHost, name: string) {
  const finder = host.finder;
  const ok = await copyText(name);
  finder.noteRecent(name);
  finder.copied = name;
  finder.copyFailed = !ok;
  clearTimeout(finder.timer);
  // A failed copy stays up longer: it has a shortcut to read.
  finder.timer = setTimeout(() => {
    finder.copied = "";
    finder.copyFailed = false;
    finder.timer = undefined;
    host.requestUpdate();
  }, ok ? COPIED_MS : COPIED_MS * 3);
  host.requestUpdate();
}

function tile(host: IconFinderHost, name: string): TemplateResult {
  // The color is overridden by the grid's `currentColor`, so tiles follow the theme.
  const glyph = host.icons.render(name, 22, "#FFFFFF");
  const on = host.finder.copied === name && !host.finder.copyFailed;
  return html`<button type="button" class="sym ${on ? "on" : ""}" title="Copy ${name}"
    @click=${() => void copyName(host, name)}>
    <span class="sym-glyph">${glyph ?? html`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${name}</span>
  </button>`;
}

/** Home's Icon names card. Full width, for every user: copying a name needs
 * no rights at all. */
export function renderIconFinder(host: IconFinderHost): TemplateResult {
  const finder = host.finder;
  const pack = finder.names(host.icons);
  const known = symbolNameSet(pack);
  const { matches, fromPack } = finder.matches(pack);
  const shown = fromPack ? matches.slice(0, ICON_FINDER_GRID_LIMIT) : matches;
  const searching = finder.query.trim() !== "";
  const recent = known.size === 0 ? finder.recent : finder.recent.filter((s) => known.has(s));
  const pickCategory = (name: string) => {
    finder.category = name;
    host.requestUpdate();
  };
  const chip = (value: string, label: string, count?: number) => html`<button type="button"
    class="icon-cat ${finder.category === value ? "on" : ""}" aria-pressed=${finder.category === value ? "true" : "false"}
    @click=${() => pickCategory(value)}>${label}${count === undefined ? nothing : html`<span class="icon-cat-n">${count}</span>`}</button>`;
  return html`<section class="home-card icons">
    <div class="home-card-head">
      <span class="home-chip" aria-hidden="true">${uiIcon("icon")}</span>
      <h2 class="home-title">Icon names</h2>
      <span class="icon-copied ${finder.copyFailed ? "failed" : ""}" role="status" aria-live="polite">${finder.copied === ""
        ? nothing
        : finder.copyFailed
          ? html`Could not copy. Select <code>${finder.copied}</code> and press Cmd+C or Ctrl+C.`
          : html`${uiIcon("check")}<span>Copied <code>${finder.copied}</code></span>`}</span>
    </div>
    <span class="home-sub">SF Symbol names for your blueprints and automations. Click one to copy it.</span>
    <input type="search" class="icon-search" placeholder="Search symbols, like light or door" aria-label="Search SF Symbol names"
      .value=${finder.query} @input=${(e: Event) => {
        finder.query = (e.target as HTMLInputElement).value;
        host.requestUpdate();
      }} />
    <div class="icon-cats" role="group" aria-label="Categories">
      ${chip("", "All")}
      ${SYMBOL_CATEGORIES.map((c) => chip(c.name, c.name, drawableCount(c.symbols, known)))}
    </div>
    ${recent.length === 0 ? nothing : html`<div class="icon-row-label">Recent</div>
      <div class="sym-grid one-row">${recent.map((n) => tile(host, n))}</div>`}
    ${shown.length === 0 ? nothing : html`<div class="sym-grid">${shown.map((n) => tile(host, n))}</div>`}
    <p class="home-small">${matches.length === 0
      ? "Nothing matches that search. Try another word, or All."
      : symbolCount(shown.length, matches.length, searching, reachableCount(pack))}</p>
  </section>`;
}
