// The Add tile dialog's body. Most adds are entities, so the entity search
// and its list come first, added to the selected page with the phone's
// defaults (part 3c). Under them, "Other tiles" in small groups, each button
// with the icon its tile carries and one line on what it does: Layout
// (spacer, header), Navigation (go to page, peek page), App tiles (Music,
// Template, Assist, Speak and Point control, 3f batch 2, and the Home map
// once the home has a map with a floor) and Library (the iPhone's HTTP
// actions and status pages from the catalog, part 3e). With
// no catalog, one line says where the library lists come from; without
// Music Assistant, Music is off and one line says why. Last, the "iPhone
// only" group: a map, a chart, a text field and a web card (phone native
// pages, phase 3), greyed on a watch's editor and hidden on a page no iPhone
// picks.
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

import { betaPill } from "../editors.js";
import { css, html, nothing, svg, type TemplateResult } from "lit";
import { AsyncDirective, directive } from "lit/async-directive.js";
import { guard } from "lit/directives/guard.js";
import { watchCameraRows, watchHiddenCameraIds } from "./camera-live.js";
import type { CameraFraming } from "../ha-api.js";
import { goToWatchHttpActions } from "../shell.js";
import { type UiIconName, uiIcon } from "../ui-icons.js";
import {
  type WatchAddCandidate,
  type WatchAddKindKey,
  type WatchAppAddButton,
  type WatchAppAddKey,
  type WatchPhoneAddButton,
  WATCH_ADD_BUSY_TEXT,
  WATCH_ADD_GROUP_TITLES,
  WATCH_ADD_KIND_WORDS,
  WATCH_ADD_OTHER_TITLE,
  WATCH_ADD_ROWS,
  WATCH_APP_ADD_BUTTONS,
  WATCH_PHONE_ADD_BUTTONS,
  WATCH_PHONE_GREYED_TEXT,
  WATCH_PHONE_GROUP_TITLE,
  WatchAddListCache,
  watchAppAdd,
  watchPhoneAdd,
  watchPhoneTilesGroupOf,
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
  type WatchLibraryKind,
  WATCH_LIBRARY_WORDS,
  WATCH_NO_CATALOG_TEXT,
  WATCH_NO_HTTP_ACTIONS_TEXT,
  WATCH_ON_IPHONE_TEXT,
  type WatchCatalogHTTPAction,
  watchCatalogEntries,
  watchCatalogFromWatch,
  watchCatalogKnows,
  watchCatalogListedFor,
  watchCatalogSubtitle,
  watchCatalogWarning,
  watchHttpScreenOffered,
  watchLibraryLister,
  watchNoPhoneLibraryText,
} from "./catalog.js";
import { type AddTileHost, type TileSettingsHost, extendHost, hostDevice, hostDeviceNoun } from "./editor-host.js";
import { type HomeMapFloor, homeMapFloorName } from "../home-map/model.js";
import { WATCH_HOME_MAP_ADD_WORDS, watchHomeMapAddFloors, watchHomeMapAddedText } from "./home-map-tile.js";
import { detectCameraRatio } from "./special-settings.js";
import {
  type WatchPage,
  isHiddenWatchPage,
  isSmartWatchPage,
  parseTileColor,
  tileEntityId,
  tileKind,
  tileInkColor,
  watchPageId,
  watchPageName,
  watchPageTiles,
} from "./model.js";
import {
  type WatchPhoneAddKind,
  type WatchTileAdd,
  WATCH_TILE_APP,
  addNewWatchTile,
  watchAddRefusal,
  watchEntityAddFromHass,
  watchEntityDefaults,
  watchEntityLabel,
  watchLinkTargetPages,
} from "./tile-new.js";

type LinkKind = "pageLink" | "peekLink";
/** Which list is open under the kind buttons: pages to link to, the
 * iPhone's library of one kind, or the home map's floors. */
type OpenList = LinkKind | WatchLibraryKind | "homeMap";

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
/** Each list of camera rows' hidden entities, built once per list so the
 * pool cache sees the same set while nothing changed. */
const hiddenByRows = new WeakMap<readonly CameraFraming[], { key: number; hidden: ReadonlySet<string> }>();

/** A camera's other streams, left out of the list: each camera is one row,
 * its SD stream. Undefined until the integration has listed the cameras. */
function hiddenCameras(host: AddTileHost): ReadonlySet<string> | undefined {
  const rows = watchCameraRows(host.hass, () => host.requestUpdate());
  if (rows === undefined) return undefined;
  // Built again only when the rows or the set of entities change.
  const key = Object.keys(host.hass.states ?? {}).length;
  const cached = hiddenByRows.get(rows);
  if (cached !== undefined && cached.key === key) return cached.hidden;
  const hidden = watchHiddenCameraIds(rows, host.hass.states ?? {});
  hiddenByRows.set(rows, { key, hidden });
  return hidden;
}

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
  if (tileKind(c.entityId) === "camera") detectNewCameraRatio(host, c.entityId);
  // On to the next row that can still be added, so Enter, Enter, Enter adds
  // three in a row.
  const next = watchAddNextOpen(results, index, (id) => id === c.entityId || onPage.has(id));
  view.highlighted = results[next]?.entityId;
}

/** A camera just added gets its ratio and size from its snapshot, as
 * Detect camera ratio in its Camera card does, as an undo step of its own.
 * A snapshot that does not load leaves the tile as it was added. */
export function detectNewCameraRatio(host: AddTileHost, entityId: string): void {
  const tile = watchPageTiles(host.page).find((t) => tileEntityId(t) === entityId);
  const tileId = tile?.id;
  if (typeof tileId !== "string") return;
  const find = () => watchPageTiles(host.page).find((t) => t.id === tileId) ?? tile!;
  const at = extendHost<AddTileHost, Pick<TileSettingsHost, "tileId" | "tile">>(host, { tileId: () => tileId, tile: find });
  void detectCameraRatio(at as unknown as TileSettingsHost, tileId);
}

function addLink(host: AddTileHost, view: AddTileView, kind: LinkKind, target: WatchPage): void {
  const name = watchPageName(target);
  const words = kind === "pageLink" ? `Added a Go to page tile for "${name}".` : `Added a Peek page tile for "${name}".`;
  if (commit(host, view, { kind, page: target }, words)) view.links = undefined;
}

/** What each library list asks, and what an add of it is called. The
 * button's words are `WATCH_ADD_KIND_WORDS`. */
const LIBRARY_WORDS: Readonly<Record<WatchLibraryKind, { question: string; tile: string }>> = {
  httpAction: { question: "Which HTTP action should the tile run?", tile: "an HTTP action tile" },
  statusPage: { question: "Which status page should the tile open?", tile: "a status page tile" },
};

/** Add a tile for one entry of the iPhone's library, as the phone's add
 * does: the entry's name as the label. Both kinds may repeat. */
function addLibrary(host: AddTileHost, view: AddTileView, kind: WatchLibraryKind, entry: WatchCatalogEntry): void {
  const add: WatchTileAdd = kind === "httpAction"
    ? { kind, action: { id: entry.id, name: entry.name } }
    : { kind, statusPage: { id: entry.id, name: entry.name } };
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

/** Add a Home map tile for one floor. A floor may be on a page once. */
function addHomeMap(host: AddTileHost, view: AddTileView, floor: HomeMapFloor, floors: number): void {
  const name = floors > 1 ? `The Home map tile for ${homeMapFloorName(floor)}` : "The Home map tile";
  if (commit(host, view, { kind: "homeMap", floor: { id: floor.id } }, watchHomeMapAddedText(floor, floors), name)) view.links = undefined;
}

/** The home map's floors to pick from, when it has more than one. */
function renderHomeMapFloors(host: AddTileHost, view: AddTileView, floors: readonly HomeMapFloor[]): TemplateResult {
  return html`<div class="at-links" id="at-links">
    <div class="at-sub">${WATCH_HOME_MAP_ADD_WORDS.question}</div>
    <div class="at-pages" role="group" aria-label="Floors">
      ${floors.map((f) => html`<button type="button" class="at-page" ?disabled=${host.busy}
        @click=${() => addHomeMap(host, view, f, floors.length)}>
        <span class="at-page-name">${homeMapFloorName(f)}</span>
        <span class="at-tag">${f.rooms.length === 1 ? "1 room" : `${f.rooms.length} rooms`}</span>
      </button>`)}
    </div>
  </div>`;
}

/** Add a tile only the iPhone draws. Refused on a watch's editor, where the
 * group is greyed, and while a watch that picks the page runs an app too old
 * to skip it, which the note then names. */
function addPhone(host: AddTileHost, view: AddTileView, button: WatchPhoneAddButton): void {
  const group = watchPhoneTilesGroupOf(host.phoneTiles, hostDevice(host));
  if (group.state !== "open") {
    view.note = { tone: "err", text: WATCH_PHONE_GREYED_TEXT };
    host.requestUpdate();
    return;
  }
  const blocked = watchAppAddBlockedText(button.key, host.musicAssistant, group.oldWatch);
  if (blocked !== undefined) {
    view.note = { tone: "err", text: blocked };
    host.requestUpdate();
    return;
  }
  commit(host, view, watchPhoneAdd(button.key), button.done);
}

/** The "iPhone only" group, last, titled with the phone glyph, its buttons
 * drawn as the other kinds' are. Greyed on
 * a watch's editor with what the rows mean; off with the reason while a
 * watch that picks the page is too old; nothing on a page no iPhone picks. */
function renderPhoneGroup(host: AddTileHost, view: AddTileView): TemplateResult | typeof nothing {
  const group = watchPhoneTilesGroupOf(host.phoneTiles, hostDevice(host));
  if (group.state === "hidden") return nothing;
  const greyed = group.state === "greyed";
  const blocked = greyed ? undefined : watchAppAddBlockedText(WATCH_PHONE_ADD_BUTTONS[0]!.key, host.musicAssistant, group.oldWatch);
  const off = greyed || blocked !== undefined;
  const why = greyed ? WATCH_PHONE_GREYED_TEXT : blocked;
  return html`<div class="at-phone ${off ? "greyed" : ""}">
    <div class="at-sub at-phone-h">${uiIcon("phone")}<span>${WATCH_PHONE_GROUP_TITLE}</span></div>
    <div class="at-kind-grid" role="group" aria-label=${WATCH_PHONE_GROUP_TITLE}>
      ${WATCH_PHONE_ADD_BUTTONS.map((b) => kindButton(host, b.key, b, {
        disabled: host.busy || off,
        why,
        whyId: "at-phone-why",
        onClick: () => addPhone(host, view, b),
      }))}
    </div>
    ${why === undefined ? nothing : html`<div class="at-muted" id="at-phone-why">${why}</div>`}
  </div>`;
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
  const label = fromWatch ? `This ${hostDeviceNoun(host)}'s ${words.many}` : kind === "httpAction" && catalog.httpLibrary === "held" ? "HTTP actions" : `The iPhone's ${words.many}`;
  const goToScreen = () => {
    host.close();
    goToWatchHttpActions();
  };
  return html`<div class="at-links" id="at-links">
    <div class="at-sub">${LIBRARY_WORDS[kind].question}</div>
    ${entries.length === 0
      ? html`<div class="at-muted">${fromWatch
        ? `${watchLibraryLister(catalog, kind, hostDevice(host))} has no ${words.many} yet. Make one in Status pages and it shows here.`
        : screen ? WATCH_NO_HTTP_ACTIONS_TEXT
        : `The iPhone's list has no ${words.many}.`}</div>
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

/** The line under the library buttons without an iPhone catalog, naming
 * the list Home Assistant does not know; nothing when it knows both. */
function noPhoneLine(text: string | undefined): TemplateResult | typeof nothing {
  return text === undefined ? nothing : html`<div class="at-muted at-lib-none">${text}</div>`;
}

/** Every kind with a button under "Other tiles". */
type KindKey = WatchAddKindKey | WatchAppAddKey | WatchPhoneAddKind | "homeMap";

/** The panel's own glyph for a kind whose tile carries no symbol (a spacer,
 * a header), and for the others until the symbols have loaded. A kind with
 * neither shows a dot, as an entity row does. */
const KIND_GLYPH: Readonly<Partial<Record<KindKey, UiIconName>>> = {
  spacer: "shape",
  header: "text",
  pageLink: "arrow",
  peekLink: "pages",
  httpAction: "globe",
  statusPage: "list",
  template: "braces",
  assist: "mic",
  pointControl: "tap",
  homeMap: "home",
  chart: "chart",
  textField: "keyboard",
  web: "globe",
};

/** The symbol's color on the chip's watch black, in both skins. */
const KIND_INK = "#E5E5EA";

/** A kind's icon as a small tile, the way the entity rows show theirs: the
 * symbol its new tile carries on the watch's black. */
function kindChip(host: AddTileHost, key: KindKey, icon: string | undefined): TemplateResult {
  const px = 16;
  const glyph = icon === undefined ? undefined : host.icons.render(icon, px, KIND_INK);
  const fallback = KIND_GLYPH[key];
  return html`<span class="at-kind-ico">${glyph !== undefined
    ? html`<svg width=${px} height=${px} viewBox=${`0 0 ${px} ${px}`} aria-hidden="true">${glyph}</svg>`
    : fallback !== undefined
      ? uiIcon(fallback)
      : html`<svg width=${px} height=${px} viewBox=${`0 0 ${px} ${px}`} aria-hidden="true">${svg`<circle cx=${px / 2} cy=${px / 2} r=${px / 5} fill=${KIND_INK} />`}</svg>`}</span>`;
}

/** One kind's button: its icon, its name and one line on what it does. A
 * button that opens a list carries `expanded` and a chevron. */
function kindButton(
  host: AddTileHost,
  key: KindKey,
  words: { label: string; icon: string | undefined; hint: string; beta?: boolean },
  options: { disabled: boolean; onClick: () => void; expanded?: boolean; why?: string; whyId?: string },
): TemplateResult {
  const { expanded } = options;
  return html`<button type="button" class="at-kind" ?disabled=${options.disabled}
    title=${options.why ?? nothing} aria-describedby=${options.why === undefined ? nothing : (options.whyId ?? nothing)}
    aria-expanded=${expanded === undefined ? nothing : expanded ? "true" : "false"}
    aria-controls=${expanded === true ? "at-links" : nothing}
    @click=${options.onClick}>
    ${kindChip(host, key, words.icon)}
    <span class="at-kind-text">
      <span class="at-kind-name">${words.label}${words.beta === true ? betaPill() : nothing}</span>
      <span class="at-kind-hint">${words.hint}</span>
    </span>
    ${expanded === undefined ? nothing : uiIcon("chevron")}
  </button>`;
}

/** One small group under "Other tiles": its title, then its buttons. */
function kindGroup(title: string, label: string, buttons: readonly TemplateResult[], after: unknown = nothing): TemplateResult {
  return html`<div class="at-group">
    <div class="at-sub">${title}</div>
    ${buttons.length === 0 ? nothing : html`<div class="at-kind-grid" role="group" aria-label=${label}>${buttons}</div>`}
    ${after}
  </div>`;
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
  const pool = view.cache.poolFor({ hass: host.hass, onPage, keep: view.keep, hidden: hiddenCameras(host) });
  const results = view.cache.resultsOf(pool, view.query, view.kind);
  const hl = watchAddHighlightIndex(results, view.highlighted);
  const count = watchAddRowCount(results.length, view.shown, hl);
  const left = results.length - count;
  const leftOut = watchLeftOutText(pool.leftOut, hostDevice(host));
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
  // A button that opens a list; the list opens under its own group.
  const listButton = (kind: Exclude<OpenList, "homeMap">) =>
    kindButton(host, kind, WATCH_ADD_KIND_WORDS[kind], { disabled: false, expanded: view.links === kind, onClick: () => toggleLinks(kind) });
  let linkList: TemplateResult | typeof nothing = nothing;
  let libraryList: TemplateResult | typeof nothing = nothing;
  if (view.links === "pageLink" || view.links === "peekLink") linkList = renderLinks(host, view, view.links);
  else if (view.links !== undefined && view.links !== "homeMap" && watchCatalogKnows(catalog, view.links)) libraryList = renderLibrary(host, view, view.links, catalog!);
  // The Home map tile, once the home's map has a floor with a room: one
  // floor adds at once, several open the floors under App tiles.
  const floors = watchHomeMapAddFloors(host.homeMap);
  const homeMapWords = { label: WATCH_HOME_MAP_ADD_WORDS.label, icon: WATCH_TILE_APP.homeMap.add.icon, hint: WATCH_HOME_MAP_ADD_WORDS.hint, beta: true };
  const homeMapButtons = floors.length === 0 ? [] : [floors.length === 1
    ? kindButton(host, "homeMap", homeMapWords, { disabled: busy, onClick: () => addHomeMap(host, view, floors[0]!, 1) })
    : kindButton(host, "homeMap", homeMapWords, { disabled: false, expanded: view.links === "homeMap", onClick: () => toggleLinks("homeMap") })];
  const homeMapList = view.links === "homeMap" && floors.length > 1 ? renderHomeMapFloors(host, view, floors) : nothing;
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

  // The other kinds, in their groups under the entities.
  const layout = kindGroup(WATCH_ADD_GROUP_TITLES.layout, WATCH_ADD_GROUP_TITLES.layout, [
    kindButton(host, "spacer", WATCH_ADD_KIND_WORDS.spacer, {
      disabled: busy,
      onClick: () => commit(host, view, { kind: "spacer" }, "Added a spacer."),
    }),
    kindButton(host, "header", WATCH_ADD_KIND_WORDS.header, {
      disabled: busy,
      onClick: () => commit(host, view, { kind: "header" }, "Added a header line. Pick Label in its Header card to add a title."),
    }),
  ]);
  const navigation = kindGroup(
    WATCH_ADD_GROUP_TITLES.navigation,
    WATCH_ADD_GROUP_TITLES.navigation,
    [listButton("pageLink"), listButton("peekLink")],
    linkList,
  );
  const apps = kindGroup(
    WATCH_ADD_GROUP_TITLES.app,
    WATCH_ADD_GROUP_TITLES.app,
    [...WATCH_APP_ADD_BUTTONS.map((b) => {
      const blocked = watchAppAddBlockedText(b.key, host.musicAssistant);
      return kindButton(host, b.key, b, {
        disabled: busy || blocked !== undefined,
        why: blocked,
        whyId: "at-app-blocked",
        onClick: () => addApp(host, view, b),
      });
    }), ...homeMapButtons],
    html`${appBlocked === undefined ? nothing : html`<div class="at-muted" id="at-app-blocked">${appBlocked}</div>`}${homeMapList}`,
  );
  const library = catalog === undefined
    ? kindGroup(WATCH_ADD_GROUP_TITLES.library, WATCH_ADD_GROUP_TITLES.library, [], html`<div class="at-muted at-lib-none">${WATCH_NO_CATALOG_TEXT}</div>`)
    : kindGroup(
        WATCH_ADD_GROUP_TITLES.library,
        catalog.noPhone === true ? (catalog.statusPagesFromWatch === true ? `From the ${hostDeviceNoun(host)}` : "From Home Assistant") : "From the iPhone",
        (Object.keys(LIBRARY_WORDS) as WatchLibraryKind[]).filter((kind) => watchCatalogKnows(catalog, kind)).map((kind) => listButton(kind)),
        html`${catalog.noPhone === true ? noPhoneLine(watchNoPhoneLibraryText(catalog)) : nothing}${libraryList}`,
      );

  return html`<div class="at-body">
    ${busy ? html`<div class="at-note" role="status">${WATCH_ADD_BUSY_TEXT}</div>` : nothing}

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
              view.query.trim() === "" ? [] : watchAddResults(pool.onPage, view.query, view.kind), pool.onPage.length, hostDevice(host))}</div>`
          : nothing}
        ${left > 0
          ? html`<button type="button" class="at-more" @click=${showMore}>${watchAddMoreText(left)}</button>`
          : nothing}
      </div>
      ${leftOut === undefined ? nothing : html`<div class="at-muted">${leftOut}</div>`}
    </div>

    <section class="at-other" aria-labelledby="at-other-h">
      <h3 class="at-other-h" id="at-other-h">${WATCH_ADD_OTHER_TITLE}</h3>
      ${layout}
      ${navigation}
      ${apps}
      ${library}
      ${renderPhoneGroup(host, view)}
    </section>

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

  /* "Other tiles", under the entities: small groups of kinds, each button
     its tile's icon, its name and one line. As many columns as fit, so a
     group of one or two fills its row and a phone gets one column. */
  .at-other { display: flex; flex-direction: column; gap: 14px; min-width: 0; padding-top: 14px; border-top: 1px solid var(--wa-line); }
  /* Outranks the dialog's own h3, its title. */
  .at-other > h3.at-other-h { margin: 0; font-size: 13px; font-weight: 600; text-transform: none; letter-spacing: 0; color: var(--wa-ink); }
  .at-group { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .at-kind-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr)); gap: 6px; }
  button.at-kind {
    display: flex; align-items: center; gap: 10px; min-width: 0; min-height: 48px; padding: 7px 10px 7px 8px;
    border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-raised, var(--wa-card));
    color: var(--wa-ink); font: inherit; text-align: left; cursor: pointer;
    transition: background-color .1s ease-out, border-color .1s ease-out;
  }
  button.at-kind:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-accent) 10%, var(--wa-card)); }
  button.at-kind:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.at-kind:disabled { opacity: .55; cursor: default; }
  button.at-kind[aria-expanded=true] { background: var(--wa-sel-bg, var(--wa-panel)); border-color: var(--wa-sel-ring, var(--wa-line-strong)); }
  /* The tile as the watch draws it, as the entity rows' chips: the symbol
     on the watch's black, in both skins. */
  .at-kind-ico {
    flex: none; width: 28px; height: 28px; border-radius: 7px; display: grid; place-items: center;
    background: linear-gradient(rgba(255, 255, 255, .12), rgba(255, 255, 255, .12)), #0b0b0d; color: #E5E5EA;
  }
  .at-kind-ico > svg { width: 16px; height: 16px; display: block; }
  .at-kind-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
  .at-kind-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 600; }
  .at-kind-hint { font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); }
  button.at-kind > svg.ui-icon { width: 12px; height: 12px; flex: none; color: var(--wa-muted); transition: transform .12s ease-out; }
  button.at-kind[aria-expanded=true] > svg.ui-icon { transform: rotate(180deg); }

  /* The "iPhone only" group, last: titled with the phone glyph; greyed
     on a watch's editor, and on an iPhone's while an old watch holds the
     page. */
  .at-phone { display: flex; flex-direction: column; gap: 6px; }
  .at-phone-h { display: inline-flex; align-items: center; gap: 5px; }
  .at-phone-h > svg.ui-icon { width: 13px; height: 13px; flex: none; }
  .at-phone.greyed .at-kind-grid { opacity: .55; }
  /* Off already: the grid's own fade is the one that shows. */
  .at-phone.greyed button.at-kind:disabled { opacity: 1; }

  .at-note { display: flex; align-items: flex-start; gap: 6px; font-size: 13px; line-height: 1.4; color: var(--wa-muted); }
  .at-note.ok { color: var(--wa-green, var(--wa-ink)); }
  .at-note.err { color: var(--wa-need); }
  .at-note > svg.ui-icon { width: 14px; height: 14px; flex: none; margin-top: 2px; }
  .at-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 2px; }
  .at-count { font-size: 13px; color: var(--wa-muted); }

  @media (max-width: 480px) {
    .at-kind-grid { grid-template-columns: minmax(0, 1fr); }
  }
`;
