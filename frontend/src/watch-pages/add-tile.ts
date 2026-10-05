// The Add tile dialog's body: pick an entity or a kind (spacer, header, go to
// page, peek page) and add it to the selected page with the phone's defaults
// (part 3c), or one of the iPhone's HTTP actions, macros and status pages
// from the catalog (part 3e), or one of the app's own tiles: Music Hub,
// Template, Assist, Speak Message and Point Control (3f batch 2). With no
// catalog, one line says where the library lists come from; without Music
// Assistant, Music Hub is off and one line says why.
//
// `<wa-page-editor>` opens the dialog from the stage's Add tile button and
// draws `renderAddTile` under the dialog's title; Escape, the close button
// and `host.close()` shut it. `addTileStyles` goes in the element's sheet
// last, after the shared form rules and the element's own. Everything this
// module needs comes through its host (`editor-host.ts`); it edits only
// through `host.apply`.
//
// The dialog stays open after an add, so a person can fill a page in one
// visit: each add is its own undo step and selects the new tile behind the
// dialog. The list, the ranking and the words are `add-tile-list.ts`; this
// file draws them and keeps the view state in `host.uiState`, which outlives
// the draws Home Assistant causes several times a second.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md ("3c build contract").

import { css, html, nothing, svg, type TemplateResult } from "lit";
import { AsyncDirective, directive } from "lit/async-directive.js";
import { guard } from "lit/directives/guard.js";
import { goToWatchHttpActions } from "../shell.js";
import { uiIcon } from "../ui-icons.js";
import {
  type WatchAddCandidate,
  type WatchAppAddButton,
  WATCH_ADD_BUSY_TEXT,
  WATCH_ADD_ROWS,
  WATCH_APP_ADD_BUTTONS,
  WatchAddListCache,
  watchAppAdd,
  watchAppAddBlockedText,
  watchAddEmptyText,
  watchAddHighlightIndex,
  watchAddMoreText,
  watchAddNextOpen,
  watchAddRefusalText,
  watchAddResults,
  watchAddRowCount,
  watchAddStep,
  watchAddedCountText,
  watchLeftOutText,
} from "./add-tile-list.js";
import {
  type WatchCatalog,
  type WatchCatalogEntry,
  type WatchCatalogMacro,
  type WatchLibraryKind,
  WATCH_LIBRARY_WORDS,
  WATCH_NO_CATALOG_TEXT,
  WATCH_NO_HTTP_ACTIONS_TEXT,
  WATCH_ON_IPHONE_TEXT,
  type WatchCatalogHTTPAction,
  watchCatalogEntries,
  watchCatalogFromWatch,
  watchCatalogKnows,
  watchCatalogOffersAdd,
  watchCatalogListedFor,
  watchCatalogSubtitle,
  watchCatalogWarning,
  watchHttpScreenOffered,
  watchLibraryLister,
  watchNoPhoneLibraryText,
} from "./catalog.js";
import type { AddTileHost } from "./editor-host.js";
import {
  type WatchPage,
  isHiddenWatchPage,
  isSmartWatchPage,
  parseTileColor,
  tileEntityId,
  tileInkColor,
  watchPageId,
  watchPageName,
  watchPageTiles,
} from "./model.js";
import {
  type WatchTileAdd,
  addNewWatchTile,
  watchAddRefusal,
  watchEntityAddFromHass,
  watchEntityDefaults,
  watchEntityLabel,
  watchLinkTargetPages,
} from "./tile-new.js";

type LinkKind = "pageLink" | "peekLink";
/** Which list is open under the kind buttons: pages to link to, or the
 * iPhone's library of one kind. */
type OpenList = LinkKind | WatchLibraryKind;

/** What the dialog remembers between draws. One object, changed in place
 * and only here. */
interface AddTileView {
  /** The page the dialog adds to: another page starts a fresh view. */
  pageId: string;
  query: string;
  /** The kind filter's plain name, `""` for all. */
  kind: string;
  /** How many rows the list draws. */
  shown: number;
  /** The highlighted row's entity; undefined is the first row. */
  highlighted: string | undefined;
  /** Entities added during this search, kept in the list as "Added". */
  keep: Set<string>;
  /** Which list is open under the kind buttons. */
  links: OpenList | undefined;
  /** Tiles added in this visit. */
  added: number;
  note: { tone: "ok" | "err"; text: string } | undefined;
  cache: WatchAddListCache;
}

const VIEW_KEY = "addTile:view";
/** Set when the dialog's body leaves the tree, which is how this module
 * learns that the dialog closed: the next draw is a new visit. */
const ENDED_KEY = "addTile:ended";

function freshView(pageId: string, cache = new WatchAddListCache()): AddTileView {
  return {
    pageId,
    query: "",
    kind: "",
    shown: WATCH_ADD_ROWS,
    highlighted: undefined,
    keep: new Set(),
    links: undefined,
    added: 0,
    note: undefined,
    cache,
  };
}

/** The view for this draw. A visit to another page starts over; a new visit
 * to the same page keeps the search and the filter (a person often comes
 * back for one more of the same kind) and starts the rest over. */
function viewOf(host: AddTileHost): AddTileView {
  let view = host.uiState.get(VIEW_KEY) as AddTileView | undefined;
  if (view === undefined || view.pageId !== host.pageId) {
    view = freshView(host.pageId, view?.cache);
    host.uiState.set(VIEW_KEY, view);
  } else if (host.uiState.get(ENDED_KEY) === true) {
    Object.assign(view, {
      shown: WATCH_ADD_ROWS,
      highlighted: undefined,
      keep: new Set<string>(),
      links: undefined,
      added: 0,
      note: undefined,
    });
  }
  host.uiState.delete(ENDED_KEY);
  return view;
}

/** Marks the visit ended when the body leaves the tree (the dialog closed),
 * and not when the whole editor only left and came back. */
class VisitWatch extends AsyncDirective {
  private state: Map<string, unknown> | undefined;

  render(state: Map<string, unknown>) {
    this.state = state;
    return nothing;
  }

  protected override disconnected(): void {
    this.state?.set(ENDED_KEY, true);
  }

  protected override reconnected(): void {
    this.state?.delete(ENDED_KEY);
  }
}

const visitWatch = directive(VisitWatch);

// ── adding ───────────────────────────────────────────────────────────────

/** Add one tile, select it, count it. False, with the reason in the note,
 * when nothing was added. */
function commit(host: AddTileHost, view: AddTileView, add: WatchTileAdd, done: string, name?: string): boolean {
  if (host.busy) {
    view.note = { tone: "err", text: WATCH_ADD_BUSY_TEXT };
    host.requestUpdate();
    return false;
  }
  const result = addNewWatchTile(host.document, host.pageId, add);
  if (result.refusal !== undefined) {
    view.note = { tone: "err", text: watchAddRefusalText(result.refusal, name) };
    host.requestUpdate();
    return false;
  }
  if (!host.apply(result.document)) {
    view.note = { tone: "err", text: WATCH_ADD_BUSY_TEXT };
    host.requestUpdate();
    return false;
  }
  view.added += 1;
  view.note = { tone: "ok", text: done };
  const id = result.tile?.id;
  if (typeof id === "string") host.selectTile(id);
  host.requestUpdate();
  return true;
}

/** The name a row shows: the label the tile will store (the friendly name,
 * else the object id made readable). */
function rowName(c: WatchAddCandidate): string {
  return watchEntityLabel(c.entityId, c.name === c.entityId ? undefined : c.name);
}

function addEntity(
  host: AddTileHost,
  view: AddTileView,
  results: readonly WatchAddCandidate[],
  index: number,
  onPage: ReadonlySet<string>,
): void {
  const c = results[index];
  if (c === undefined) return;
  view.highlighted = c.entityId;
  const name = rowName(c);
  // The page as it is now, not as drawn: a second click on a row before it
  // was drawn as added finds it there and adds nothing.
  if (onPage.has(c.entityId) || watchPageTiles(host.page).some((t) => tileEntityId(t) === c.entityId)) {
    view.note = { tone: "err", text: watchAddRefusalText("onPage", name) };
    host.requestUpdate();
    return;
  }
  const add: WatchTileAdd = { kind: "entity", ...watchEntityAddFromHass(host.hass, c.entityId) };
  if (!commit(host, view, add, `Added ${name}.`, name)) return;
  view.keep.add(c.entityId);
  // On to the next row that can still be added, so Enter, Enter, Enter adds
  // three in a row.
  const next = watchAddNextOpen(results, index, (id) => id === c.entityId || onPage.has(id));
  view.highlighted = results[next]?.entityId;
}

function addLink(host: AddTileHost, view: AddTileView, kind: LinkKind, target: WatchPage): void {
  const name = watchPageName(target);
  const words = kind === "pageLink" ? `Added a Go to page tile for "${name}".` : `Added a Peek page tile for "${name}".`;
  if (commit(host, view, { kind, page: target }, words)) view.links = undefined;
}

/** What each library list asks, and what an add of it is called. */
const LIBRARY_WORDS: Readonly<Record<WatchLibraryKind, { question: string; tile: string; button: string }>> = {
  httpAction: { question: "Which HTTP action should the tile run?", tile: "an HTTP action tile", button: "HTTP action" },
  macro: { question: "Which macro should the tile run?", tile: "a macro tile", button: "Macro" },
  statusPage: { question: "Which status page should the tile open?", tile: "a status page tile", button: "Status page" },
};

/** Add a tile for one entry of the iPhone's library, as the phone's add
 * does: the entry's name as the label, a macro's own icon and color. All
 * three may repeat. */
function addLibrary(host: AddTileHost, view: AddTileView, kind: WatchLibraryKind, entry: WatchCatalogEntry): void {
  let add: WatchTileAdd;
  if (kind === "httpAction") {
    add = { kind, action: { id: entry.id, name: entry.name } };
  } else if (kind === "macro") {
    const macro = entry as WatchCatalogMacro;
    add = {
      kind,
      macro: {
        id: macro.id,
        name: macro.name,
        ...(macro.icon === undefined ? {} : { icon: macro.icon }),
        ...(macro.colorHex === undefined ? {} : { colorHex: macro.colorHex }),
      },
    };
  } else {
    add = { kind, statusPage: { id: entry.id, name: entry.name } };
  }
  if (commit(host, view, add, `Added ${LIBRARY_WORDS[kind].tile} for "${entry.name}".`)) view.links = undefined;
}

/** Add one of the app's own tiles. All of them may repeat. A button that
 * cannot add (Music Hub without Music Assistant) says why instead. */
function addApp(host: AddTileHost, view: AddTileView, button: WatchAppAddButton): void {
  const blocked = watchAppAddBlockedText(button.key, host.musicAssistant);
  if (blocked !== undefined) {
    view.note = { tone: "err", text: blocked };
    host.requestUpdate();
    return;
  }
  commit(host, view, watchAppAdd(button.key, host.hass), button.done);
}

// ── drawing ──────────────────────────────────────────────────────────────

/** The id of an entity's row, for `aria-activedescendant`. Entity ids are
 * letters, digits, `_` and one dot, all fine in an id. */
function optionId(entityId: string): string {
  return `at-o-${entityId}`;
}

/** Scroll the highlighted row into the list's view once it is drawn. */
function revealHighlight(from: EventTarget | null): void {
  const root = from instanceof Node ? from.getRootNode() : undefined;
  if (!(root instanceof ShadowRoot)) return;
  requestAnimationFrame(() => {
    const id = root.querySelector("#at-search")?.getAttribute("aria-activedescendant");
    if (id) root.getElementById(id)?.scrollIntoView({ block: "nearest" });
  });
}

/** The tile a row will make, small: its symbol in its color on the watch's
 * black, or a dot when there is no symbol to draw. */
function tileChip(host: AddTileHost, c: WatchAddCandidate): TemplateResult {
  const look = watchEntityDefaults(watchEntityAddFromHass({ states: host.hass.states }, c.entityId), host.page);
  const color = parseTileColor(look.color);
  const ink = tileInkColor(color, "#8E8E93");
  const ground =
    color === undefined || color.kind === "rainbow"
      ? "rgba(255, 255, 255, 0.12)"
      : color.kind === "gradient"
        ? `linear-gradient(135deg, color-mix(in srgb, ${color.from} 38%, transparent), color-mix(in srgb, ${color.to} 38%, transparent))`
        : `color-mix(in srgb, ${color.hex} 30%, transparent)`;
  const px = 16;
  const glyph = look.icon === undefined ? undefined : host.icons.render(look.icon, px, ink);
  return html`<span class="ent-ico at-chip" style=${`background-image:${ground.startsWith("linear") ? ground : `linear-gradient(${ground}, ${ground})`}`}>
    <svg width=${px} height=${px} viewBox=${`0 0 ${px} ${px}`} aria-hidden="true">${glyph
      ?? svg`<circle cx=${px / 2} cy=${px / 2} r=${px / 5} fill=${ink} />`}</svg>
  </span>`;
}

function renderLinks(host: AddTileHost, view: AddTileView, kind: LinkKind): TemplateResult {
  const pages = watchLinkTargetPages(host.document, host.pageId, kind);
  const question = kind === "pageLink" ? "Which page should the tile open?" : "Which page should the tile peek at?";
  let empty = "";
  if (pages.length === 0) {
    const hiddenOnly = kind === "pageLink" && watchLinkTargetPages(host.document, host.pageId, "peekLink").length > 0;
    empty = hiddenOnly
      ? "Every other page is hidden, and Go to page cannot open a hidden page. Peek page can show one."
      : "There is no other page yet. Add a page first, then link to it here.";
  }
  return html`<div class="at-links" id="at-links">
    <div class="at-sub">${question}</div>
    ${pages.length === 0
      ? html`<div class="at-muted">${empty}</div>`
      : html`<div class="at-pages" role="group" aria-label=${kind === "pageLink" ? "Pages to go to" : "Pages to peek at"}>
          ${pages.map((p) => html`<button type="button" class="at-page" ?disabled=${host.busy}
            @click=${() => addLink(host, view, kind, p)}>
            <span class="at-page-name">${watchPageName(p)}</span>
            ${isHiddenWatchPage(p) ? html`<span class="at-tag">Hidden</span>` : nothing}
            ${isSmartWatchPage(p) ? html`<span class="at-tag">Smart</span>` : nothing}
          </button>`)}
        </div>`}
  </div>`;
}

/** One library list from the catalog, in the phone's order, with the
 * phone's subtitles and warnings; an entry with a warning is offered too,
 * as on the phone. HTTP actions lead with the home's library, and an
 * iPhone action after them says so. Where the HTTP actions screen can add
 * one, an empty list says so and leads there. */
function renderLibrary(host: AddTileHost, view: AddTileView, kind: WatchLibraryKind, catalog: WatchCatalog): TemplateResult {
  const entries = watchCatalogEntries(catalog, kind);
  const words = WATCH_LIBRARY_WORDS[kind];
  // The watch's own status pages are made in Status pages, not listed by
  // the iPhone.
  const fromWatch = watchCatalogFromWatch(catalog, kind);
  const listed = watchCatalogListedFor(catalog, kind);
  const screen = kind === "httpAction" && watchHttpScreenOffered(catalog);
  const label = fromWatch ? `This watch's ${words.many}` : kind === "httpAction" && catalog.httpLibrary === "held" ? "HTTP actions" : `The iPhone's ${words.many}`;
  const goToScreen = () => {
    host.close();
    goToWatchHttpActions();
  };
  return html`<div class="at-links" id="at-links">
    <div class="at-sub">${LIBRARY_WORDS[kind].question}</div>
    ${entries.length === 0
      ? html`<div class="at-muted">${fromWatch
        ? `${watchLibraryLister(catalog, kind)} has no ${words.many} yet. Make one in Status pages and it shows here.`
        : screen ? WATCH_NO_HTTP_ACTIONS_TEXT
        : `The iPhone lists no ${words.many} yet. Make one in the iPhone app and it shows here.`}</div>
        ${screen ? html`<div><button type="button" class="pe-btn" @click=${goToScreen}>Open HTTP actions</button></div>` : nothing}`
      : html`<div class="at-pages" role="group" aria-label=${label}>
          ${entries.map((e) => {
            const sub = watchCatalogSubtitle(kind, e);
            const warning = watchCatalogWarning(kind, e);
            const phone = kind === "httpAction" && warning === undefined && (e as WatchCatalogHTTPAction).source === "iphone";
            return html`<button type="button" class="at-page" ?disabled=${host.busy}
              @click=${() => addLibrary(host, view, kind, e)}>
              <span class="at-page-name">${e.name}</span>
              ${sub === undefined ? nothing : html`<span class="at-tag">${sub}</span>`}
              ${phone ? html`<span class="at-tag">${WATCH_ON_IPHONE_TEXT}</span>` : nothing}
              ${warning === undefined ? nothing : html`<span class="at-tag warn">${warning}</span>`}
            </button>`;
          })}
        </div>`}
    ${listed === undefined ? nothing : html`<div class="at-muted">${listed}</div>`}
  </div>`;
}

/** The dialog's body. The visit watch sits outside the part that changes,
 * so swapping the body for a refusal is not taken for a close. */
export function renderAddTile(host: AddTileHost): TemplateResult | typeof nothing {
  const view = viewOf(host);
  return html`${visitWatch(host.uiState)}${renderBody(host, view)}`;
}

function renderBody(host: AddTileHost, view: AddTileView): TemplateResult {
  const done = html`<div class="at-foot">
      <span class="at-count" role="status">${watchAddedCountText(view.added)}</span>
      <button type="button" class="pe-btn pe-primary" @click=${() => host.close()}>Done</button>
    </div>`;

  // A page nothing can be added to (a smart page, say) says why and no more.
  // The spacer stands for any kind that may repeat, so only the page's own
  // reasons come back.
  const pageRefusal = watchAddRefusal(host.document, host.pageId, "spacer.");
  if (pageRefusal !== undefined) {
    return html`<div class="at-body">
      <div class="at-note err" role="alert">${watchAddRefusalText(pageRefusal)}</div>
      ${done}
    </div>`;
  }

  const busy = host.busy;
  // The line at the top says it while the editor is busy, and once it is
  // not, the refusal no longer holds.
  const note = view.note?.text === WATCH_ADD_BUSY_TEXT ? undefined : view.note;
  const onPage = new Set(watchPageTiles(host.page).map(tileEntityId));
  const pool = view.cache.poolFor({ hass: host.hass, onPage, keep: view.keep });
  const results = view.cache.resultsOf(pool, view.query, view.kind);
  const hl = watchAddHighlightIndex(results, view.highlighted);
  const count = watchAddRowCount(results.length, view.shown, hl);
  const left = results.length - count;
  const leftOut = watchLeftOutText(pool.leftOut);
  const kinds = view.kind !== "" && !pool.kinds.some((k) => k.name === view.kind)
    ? [...pool.kinds, { name: view.kind, count: 0 }]
    : pool.kinds;

  const toggleLinks = (kind: OpenList) => {
    view.links = view.links === kind ? undefined : kind;
    host.requestUpdate();
  };
  const catalog = host.catalog;
  // The one app button that can be off says why under the buttons.
  const appBlocked = WATCH_APP_ADD_BUTTONS.map((b) => watchAppAddBlockedText(b.key, host.musicAssistant)).find(
    (t) => t !== undefined,
  );
  const listButton = (kind: OpenList, text: string) => html`<button type="button" class="pe-btn ${view.links === kind ? "on" : ""}"
    aria-expanded=${view.links === kind ? "true" : "false"} aria-controls=${view.links === kind ? "at-links" : nothing}
    @click=${() => toggleLinks(kind)}>${text}${uiIcon("chevron")}</button>`;
  let openList: TemplateResult | typeof nothing = nothing;
  if (view.links === "pageLink" || view.links === "peekLink") openList = renderLinks(host, view, view.links);
  else if (view.links !== undefined && watchCatalogKnows(catalog, view.links)) openList = renderLibrary(host, view, view.links, catalog!);
  const searchChanged = (query: string, kind: string) => {
    view.query = query;
    view.kind = kind;
    view.shown = WATCH_ADD_ROWS;
    view.highlighted = undefined;
    // Rows added during the last search leave the list now.
    view.keep = new Set();
    host.requestUpdate();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.isComposing) return;
    const steps: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, PageDown: 10, PageUp: -10 };
    const step = steps[e.key];
    if (step !== undefined) {
      e.preventDefault();
      const next = watchAddStep(hl, step, results.length);
      if (next < 0) return;
      view.highlighted = results[next]!.entityId;
      view.shown = watchAddRowCount(results.length, view.shown, next);
      host.requestUpdate();
      revealHighlight(e.target);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      // A held Enter repeats: one press, one tile.
      if (e.repeat) return;
      if (hl >= 0) addEntity(host, view, results, hl, onPage);
      revealHighlight(e.target);
    }
    // Escape is left to the dialog, which closes.
  };
  const showMore = (e: Event) => {
    view.shown = count + WATCH_ADD_ROWS;
    host.requestUpdate();
    // The button may go with the press; the search keeps the keys.
    const root = (e.currentTarget as Node).getRootNode() as ShadowRoot;
    requestAnimationFrame(() => root.querySelector<HTMLInputElement>("#at-search")?.focus());
  };

  // The rows are drawn again only when what they show moved: the rows, how
  // many, the highlight, the page's entities, the page (its theme colors
  // the chips), the provider (glyphs that arrived) and busy. A new `hass`
  // with nothing else changed (several a second) redraws none of them. A
  // state's own change (a device class) shows with the next of those.
  const onPageKey = [...onPage].sort().join("\n");
  const rows = () => results.slice(0, count).map((c, i) => {
    const added = onPage.has(c.entityId);
    const name = rowName(c);
    const label = [name, c.kind, c.area, added ? "added" : undefined].filter(Boolean).join(", ");
    return html`<button type="button" role="option" tabindex="-1" id=${optionId(c.entityId)}
      class="ent at-row ${i === hl ? "hl" : ""} ${added ? "added" : ""}"
      aria-selected=${i === hl ? "true" : "false"} aria-disabled=${added || busy ? "true" : "false"} aria-label=${label}
      @mousedown=${(e: MouseEvent) => e.preventDefault()}
      @click=${() => addEntity(host, view, results, i, onPage)}>
      ${tileChip(host, c)}
      <span class="ent-main">
        <span class="ent-name">${name}</span>
        <span class="ent-sub">
          ${c.area ? html`<span class="ent-area">${c.area}</span>` : nothing}
          <span class="ent-id">${c.entityId}</span>
        </span>
      </span>
      <span class="ent-right">
        ${added
          ? html`<span class="at-added">${uiIcon("check")}Added</span>`
          : html`<span class="ent-type">${c.kind}</span>`}
      </span>
    </button>`;
  });

  return html`<div class="at-body">
    ${busy ? html`<div class="at-note" role="status">${WATCH_ADD_BUSY_TEXT}</div>` : nothing}
    <div class="at-kinds" role="group" aria-label="Other tiles">
      <button type="button" class="pe-btn" ?disabled=${busy}
        @click=${() => commit(host, view, { kind: "spacer" }, "Added a spacer.")}>Spacer</button>
      <button type="button" class="pe-btn" ?disabled=${busy}
        @click=${() => commit(host, view, { kind: "header" }, "Added a header.")}>Header</button>
      ${listButton("pageLink", "Go to page")}
      ${listButton("peekLink", "Peek page")}
      ${WATCH_APP_ADD_BUTTONS.map((b) => {
        const blocked = watchAppAddBlockedText(b.key, host.musicAssistant);
        return html`<button type="button" class="pe-btn" ?disabled=${busy || blocked !== undefined}
          title=${blocked ?? nothing} aria-describedby=${blocked === undefined ? nothing : "at-app-blocked"}
          @click=${() => addApp(host, view, b)}>${b.label}</button>`;
      })}
    </div>
    ${appBlocked === undefined ? nothing : html`<div class="at-muted" id="at-app-blocked">${appBlocked}</div>`}
    ${catalog === undefined
      ? html`<div class="at-muted at-lib-none">${WATCH_NO_CATALOG_TEXT}</div>`
      : html`<div class="at-kinds at-lib" role="group" aria-label=${catalog.noPhone === true ? (catalog.statusPagesFromWatch === true ? "From the watch" : "From Home Assistant") : "From the iPhone"}>
          ${(Object.keys(LIBRARY_WORDS) as WatchLibraryKind[]).filter((kind) => watchCatalogOffersAdd(catalog, kind)).map((kind) => listButton(kind, LIBRARY_WORDS[kind].button))}
        </div>
        ${catalog.noPhone === true ? html`<div class="at-muted at-lib-none">${watchNoPhoneLibraryText(catalog)}</div>` : nothing}`}
    ${openList}

    <div class="at-ents">
      <label class="at-sub" for="at-search">Entity</label>
      <div class="at-find">
        <div class="ent-box open">
          <span class="ent-glass">${uiIcon("search")}</span>
          <input id="at-search" type="text" autofocus autocomplete="off" spellcheck="false"
            role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="at-listbox"
            aria-activedescendant=${hl >= 0 ? optionId(results[hl]!.entityId) : nothing}
            placeholder="Name, room, or id"
            .value=${view.query}
            @input=${(e: Event) => searchChanged((e.target as HTMLInputElement).value, view.kind)}
            @keydown=${onKey} />
        </div>
        <select class="at-kind" aria-label="Kind of entity"
          @change=${(e: Event) => searchChanged(view.query, (e.target as HTMLSelectElement).value)}>
          <option value="" ?selected=${view.kind === ""}>All kinds</option>
          ${kinds.map((k) => html`<option value=${k.name} ?selected=${view.kind === k.name}>${k.name} (${k.count})</option>`)}
        </select>
      </div>
      <div class="at-list">
        <div role="listbox" id="at-listbox" aria-label="Entities">${guard([results, count, hl, onPageKey, host.page, host.icons, busy], rows)}</div>
        ${results.length === 0
          ? html`<div class="at-empty">${watchAddEmptyText(view.query, view.kind, pool.candidates.length,
              view.query.trim() === "" ? [] : watchAddResults(pool.onPage, view.query, view.kind), pool.onPage.length)}</div>`
          : nothing}
        ${left > 0
          ? html`<button type="button" class="at-more" @click=${showMore}>${watchAddMoreText(left)}</button>`
          : nothing}
      </div>
      ${leftOut === undefined ? nothing : html`<div class="at-muted">${leftOut}</div>`}
    </div>

    ${note === undefined
      ? nothing
      : html`<div class="at-note ${note.tone}" role=${note.tone === "err" ? "alert" : "status"}>
          ${note.tone === "ok" ? uiIcon("check") : nothing}<span>${note.text}</span>
        </div>`}
    ${done}
  </div>`;
}

/** This module's rules, last in the page editor's sheet: after the shared
 * form rules and the editor's own. Prefix classes with `at-`. The dialog
 * itself is `dialog.pe-add-dialog`, 460 px wide unless a rule here says
 * otherwise. */
export const addTileStyles = css`
  /* A little wider than a question, so a row's name, room and id fit. */
  dialog.pe-add-dialog { width: min(540px, calc(100vw - 32px)); }

  .at-body { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  .at-sub { font-size: 12px; font-weight: 600; color: var(--wa-muted); }
  .at-muted { font-size: 12px; line-height: 1.4; color: var(--wa-muted); }

  .at-kinds { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
  .at-kinds > .pe-btn { min-width: 0; padding: 0 8px; }
  .at-kinds > .pe-btn > svg.ui-icon { width: 12px; height: 12px; flex: none; transition: transform .12s ease-out; }
  .at-kinds > .pe-btn[aria-expanded=true] { background: var(--wa-sel-bg, var(--wa-panel)); border-color: var(--wa-sel-ring, var(--wa-line-strong)); }
  .at-kinds > .pe-btn[aria-expanded=true] > svg.ui-icon { transform: rotate(180deg); }
  .at-kinds.at-lib { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .at-tag.warn { color: var(--wa-need); background: color-mix(in srgb, var(--wa-need) 12%, transparent); }

  .at-links {
    display: flex; flex-direction: column; gap: 8px; padding: 10px;
    border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-raised, var(--wa-panel));
  }
  .at-pages { display: flex; flex-direction: column; gap: 2px; max-height: 180px; overflow: auto; }
  button.at-page {
    display: flex; align-items: center; gap: 8px; width: 100%; min-height: 32px; padding: 4px 8px;
    border: 0; border-radius: 7px; background: none; color: var(--wa-ink); font: inherit; font-size: 13px;
    text-align: left; cursor: pointer;
  }
  button.at-page:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-accent) 14%, var(--wa-card)); }
  button.at-page:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
  button.at-page:disabled { opacity: .5; cursor: default; }
  .at-page-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
  .at-tag {
    flex: none; padding: 1px 7px; border-radius: 999px; font-size: 11px; color: var(--wa-muted);
    background: color-mix(in srgb, var(--wa-ink) 8%, transparent);
  }

  .at-ents { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .at-find { display: flex; gap: 6px; min-width: 0; }
  .at-find > .ent-box { flex: 1; min-width: 0; }
  .at-find > .at-kind { flex: 0 1 auto; max-width: 42%; min-width: 0; text-overflow: ellipsis; }
  /* A fixed height, so the dialog does not grow and shrink with every
     letter typed. */
  .at-list {
    height: min(320px, 40vh); overflow: auto; overscroll-behavior: contain; padding: 4px;
    border: 1px solid var(--wa-line); border-radius: 12px; background: var(--wa-raised, var(--wa-card));
  }
  .at-list button.ent { padding: 6px 8px; }
  .at-list button.ent .ent-right { max-width: 38%; }
  .at-list button.ent .ent-type { overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
  /* The tile as the watch draws it: its color, faint, over black, in both
     skins, so a pale yellow symbol reads on the light one too. */
  .at-list .ent-ico.at-chip { background-color: #0b0b0d; }
  .at-list .ent-ico.at-chip svg { width: 16px; height: 16px; }
  .at-list button.ent.added .ent-name, .at-list button.ent.added .ent-sub { opacity: .6; }
  .at-added { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: var(--wa-green, var(--wa-accent)); white-space: nowrap; }
  .at-added > svg.ui-icon { width: 12px; height: 12px; }
  .at-empty { padding: 14px 10px; font-size: 13px; color: var(--wa-muted); }
  button.at-more {
    display: block; width: 100%; margin-top: 4px; padding: 8px; border: 0; border-radius: 9px;
    background: color-mix(in srgb, var(--wa-ink) 5%, transparent); color: var(--wa-accent);
    font: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
  }
  button.at-more:hover { background: color-mix(in srgb, var(--wa-accent) 12%, transparent); }
  button.at-more:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }

  .at-note { display: flex; align-items: flex-start; gap: 6px; font-size: 13px; line-height: 1.4; color: var(--wa-muted); }
  .at-note.ok { color: var(--wa-green, var(--wa-ink)); }
  .at-note.err { color: var(--wa-need); }
  .at-note > svg.ui-icon { width: 14px; height: 14px; flex: none; margin-top: 2px; }
  .at-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 2px; }
  .at-count { font-size: 13px; color: var(--wa-muted); }

  @media (max-width: 480px) {
    .at-kinds { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .at-kinds.at-lib { grid-template-columns: minmax(0, 1fr); }
  }
`;
