// The Pages tab and the Status pages tab: every page, or every status page,
// of the home's library, one card each. One element draws both, told by its
// `kind` which it lists.
//
// The library is read once, through the library store every tab and editor
// shares (`library/store.ts`, one `library/summary` read), and read again
// after every write and every change Home Assistant tells of. A row opens
// its page in a device's page editor, or a status page in its status pages
// editor (`openDevice`).
//
// The tab draws the board (`library/board.ts`, plan: app repo
// docs/panel_one_board_plan_2026-10.md, step 3): a row per page, a column
// per device, a box where the page is. A box writes at once: tick to put the
// page on that device, untick to take it off. "Cards" in the head shows the
// big pictures instead, each with its row of device chips
// (`library/ticks.ts`). A click on a device's name focuses its column: that
// device's pages come first, in its own order, with a drag handle and Hide
// here (a save of the device's own record, `all-pages-picks.ts`), then the
// rest, dimmed, each with its box to add it. The focus is in the address
// (`/all-pages/<owner>`), never in storage, so a reload keeps it and a new
// visit starts on every device.
//
// Multi select (or Cmd/Ctrl+click on a card or a row) turns the cards and
// rows into tick boxes, and a bar under the head, as on the Complications
// list, deletes the
// picked items from the library (`all-pages-bulk.ts`). The ticks do the
// rest. The panel loads this file the first time either tab opens
// (`all-pages-hook.ts`). What can be worked out without the element is in
// `all-pages-model.ts`.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { type HassLike, type OwnerSummary, fetchWatchConfig } from "../ha-api.js";
import { deviceColor, deviceColorsCache } from "../device-colors.js";
import { LIBRARY_UNSUPPORTED_TEXT } from "../library/client.js";
import {
  type Library,
  type LibraryItem,
  type LibraryPick,
  countFor,
  hasItem,
  holdsRecord,
  itemsFor,
  libraryItems,
  pagesDocumentFor,
  sameId,
} from "../library/model.js";
import { renderPageRowPicture, renderStatusRowPicture, rowPictureStyles } from "../library/row-picture.js";
import { LibraryController } from "../library/store.js";
import { type BoardCell, type BoardColumn, type BoardDrag, type BoardRow, type BoardSection, DEVICE_OWN_LABELS, type DeviceOwnScreen, type ListView,
  SAVED_FLASH_MS, WideWatch, boardStackStyles, boardStyles, noteViewPick, phoneView, renderBoard, renderViewSwitch } from "../library/board.js";
import { type TicksInput, libraryTicksStyles, renderTicks, tickChips } from "../library/ticks.js";
import { type IconProvider, REFERENCE_CASE } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import { watchFrameStyles } from "../watch-frame.js";
import { keptStatusPagesDraft } from "../watch-status-pages/draft.js";
import { renderStatusPagePicture, statusPagesViewStyles } from "../watch-status-pages/view.js";
import {
  ALL_FILTER,
  type CardKind,
  type DeviceView,
  type PagesFilter,
  aCard,
  allPagesLead,
  cardDetail,
  cardNoun,
  cardsTitle,
  deviceView,
  dropChange,
  emptyLibraryText,
  emptyText,
  footText,
  inOrder,
  movedOrder,
  newCardAdminText,
  noPicksText,
  onDeviceTitle,
  libraryEditTitle,
  openDevice,
  orderHint,
  resolveFilter,
  restTitle,
  shownItems,
} from "./all-pages-model.js";
import { deleteLater, laterKey } from "../delete-later.js";
import {
  bulkResultText,
  countText,
  deleteAskText,
  deletePlan,
  itemKey,
  keepPresent,
  rangeSelected,
  runDelete,
  toggleSelected,
  withAll,
  withNone,
} from "./all-pages-bulk.js";
import { type PickChange, changeDevicePicks, picksDirtyText } from "./all-pages-picks.js";
import { pagesBulkIO, picksIO } from "./all-pages-io.js";
import { NO_ICONS as NO_PICTURE_ICONS } from "./editor-host.js";
import { keptWatchPagesDraft } from "./kept.js";
import { DEVICES_WAIT_TEXT, type LinkDevice, type PagesRecordFacts, awaitingMove, deviceWord, freePlanText, linkDevicesOf, waitingEmptyText, waitingLibraryText } from "./devices.js";
import { type UntickAsk, askUntick, tickItem } from "./library-editing-io.js";
import { libraryListStyles } from "./library-list-styles.js";
import { listTabStyles } from "./list-tab-styles.js";
import { type WatchPage, isSmartWatchPage, watchPageTiles, watchPagesOf } from "./model.js";
import { watchSkippedTileNames } from "./phone-tiles-model.js";
import { newWatchPage, newWatchPageName } from "./edit.js";
import { newId } from "../model.js";
import { DELETE_EVERY_DEVICE, DELETE_THIS_DEVICE, rememberPreview } from "../library/item-mode.js";
import { type NewItemForm, type NewPreview, newItemDialogStyles, openNewItemDialog, renderNewItemDialog } from "../library/new-dialog.js";
import { newStatusPage, nextStatusPageName } from "../watch-status-pages/model.js";
import { renderWatchPagePreview, renderWatchPageTitle, watchPagePreviewStyles, watchPreviewLayout, watchReflowPage, watchSkippedTilesLayout } from "./preview.js";
import { type WatchPagesNote, watchCommandError } from "./save-note.js";

/** How wide a card's picture of its page is, in CSS pixels. */
const PIC_W = 200;
/** The tallest a picture grows before it is cut, in CSS pixels. */
const PIC_MAX_H = 320;
/** The room kept above the top tile and under the lowest, in points. */
const PIC_PAD_PT = 6;

/** A page is one page on every device, so its picture is the page alone:
 * no watch case, no iPhone, laid out on one screen for every card. */
const PIC_SCREEN = REFERENCE_CASE.screen;

/**
 * The part of a page's picture a card shows, in points from the top of the
 * page: from its title (or its top tile when it has no title) to just under
 * its lowest tile. A smart page, or one with no tiles, shows one screen.
 */
export function pageCrop(page: WatchPage, states: Record<string, unknown> | undefined, icons: IconProvider | undefined,
  screen: { width: number; height: number } = PIC_SCREEN): { top: number; height: number } {
  if (isSmartWatchPage(page)) return { top: 0, height: screen.height };
  const layout = watchPreviewLayout(watchReflowPage(page, states as Parameters<typeof watchReflowPage>[1]), screen);
  // The outlines of the tiles a watch skips count too: the picture shows
  // where each sits on the iPhone, unless the iPhone leaves it out too.
  const tiles = [...layout.tiles, ...watchSkippedTilesLayout(page, screen, { states: states as Parameters<typeof watchReflowPage>[1] })];
  if (tiles.length === 0) return { top: 0, height: screen.height };
  const titled = renderWatchPageTitle(page, 1, layout.topInset, icons) !== nothing;
  const top = titled ? 0 : Math.max(0, layout.topInset + Math.min(...tiles.map((t) => t.y)) - PIC_PAD_PT);
  const bottom = layout.topInset + Math.max(...tiles.map((t) => t.y + t.height)) + PIC_PAD_PT;
  return { top, height: Math.max(1, bottom - top) };
}
/** How often a stream of state changes draws the pictures again. */
const STATES_EVERY_MS = 2000;
/** How wide a board row's picture is, in CSS pixels: a watch's, and an
 * iPhone's, which is taller for its width, so both rows stay one height. */
const BOARD_PICTURE_W = 44;
const BOARD_PHONE_PICTURE_W = 28;

/** Where each tab's Board or Cards is remembered in this browser, as the
 * Complications list remembers its On device | Shape only toggle. The Pages
 * tab keeps the key it always had. */
const VIEW_STORE_KEYS: Record<CardKind, string> = {
  pages: "wrist-assistant-panel.all-pages.v1",
  status_pages: "wrist-assistant-panel.all-status-pages.v1",
};

/** The device kinds a new page's dialog offers to preview on: the ones the
 * home has, the watch first. */
function previewKinds(devices: readonly LinkDevice[]): NewPreview[] {
  return (["watch", "iphone"] as const).filter((kind) => devices.some((d) => d.kind === kind));
}

interface KeptView {
  view: ListView;
}

const kept = new Map<CardKind, KeptView>();

/** A tab's view as last left, read once from storage. A browser with
 * storage off keeps it while the panel is open. */
function keptView(cards: CardKind): KeptView {
  const held = kept.get(cards);
  if (held !== undefined) return held;
  // Cards first: a page is found by its picture. Board once picked.
  const view: KeptView = { view: "cards" };
  try {
    const raw = window.localStorage.getItem(VIEW_STORE_KEYS[cards]);
    const saved = raw ? (JSON.parse(raw) as { view?: unknown }) : {};
    if (saved.view === "board") view.view = "board";
  } catch {
    /* Storage off: the defaults. */
  }
  kept.set(cards, view);
  return view;
}

function keepView(cards: CardKind, change: Partial<KeptView>): void {
  const view = { ...keptView(cards), ...change };
  kept.set(cards, view);
  try {
    window.localStorage.setItem(VIEW_STORE_KEYS[cards], JSON.stringify(view));
  } catch {
    /* Storage off: the choice still holds while the panel is open. */
  }
}

/** Whether a device's page editor, or for status pages its status pages
 * editor, holds unsaved edits in this tab. */
const dirtyHere = (ownerId: string, kind: CardKind = "pages"): boolean =>
  (kind === "status_pages" ? keptStatusPagesDraft(ownerId)?.dirty : keptWatchPagesDraft(ownerId)?.dirty) ?? false;

/** A row's key on a device tab: the device and the item. */
const rowKey = (ownerId: string, id: string): string => `${ownerId}|${id.toUpperCase()}`;

export class WaAllPages extends LitElement {
  /** What the tab lists: pages (the Pages tab), or status pages (the
   * Status pages tab). */
  @property({ attribute: false }) kind: CardKind = "pages";
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ attribute: false }) ownersReady = false;
  @property({ attribute: false }) phones = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;
  /** Open an item in the one editor, its editor's library mode, with the
   * focused device when there is one. */
  @property({ attribute: false }) onOpenLibrary?: (kind: CardKind, id: string, from?: string) => void;
  /** The focused device, by owner id: the address's (`/all-pages/<owner>`). */
  @property({ attribute: false }) focusOwner?: string;
  /** Focus a device's column, or with undefined every device: the host
   * moves to that address. */
  @property({ attribute: false }) onFocus?: (ownerId: string | undefined) => void;
  /** Open one of a device's own screens: Settings, Rooms or Voice. */
  @property({ attribute: false }) onOpenScreen?: (ownerId: string, kind: "watch" | "iphone", screen: DeviceOwnScreen) => void;
  /** Drawn inside Home's "All devices" (plan step 6): the board alone,
   * with no head, title or New, under the host's one search. */
  @property({ type: Boolean, reflect: true }) embedded = false;
  /** The host's search, when embedded. */
  @property({ attribute: false }) searchText = "";

  @state() private search = "";
  /** New page's dialog, open: a name for a page the library gets and no
   * device has yet, and the device kind its editor opens on. */
  @state() private newForm?: NewItemForm;
  /** Select mode: a click picks a card instead of opening it. */
  @state() private selecting = false;
  /** The picked cards, by `itemKey`. Only those shown count. */
  @state() private selected: ReadonlySet<string> = new Set();
  /** The bar's delete question is open. */
  @state() private asking = false;
  /** The line while a delete runs, and what the last one did. */
  @state() private bulkBusy?: string;
  /** The item whose own Delete is asking, by `itemKey`. */
  @state() private itemAsk?: string;
  @state() private bulkNote?: WatchPagesNote;
  /** What a tick said beyond the store's refusals (the free plan, what an
   * untick cleared), by `itemKey`. */
  @state() private tickNotes: ReadonlyMap<string, WatchPagesNote> = new Map();
  /** An untick that would clear menu slots or complication taps on its
   * device, asking under its card's row first (`askUntick`). */
  @state() private untickAsk?: UntickAsk;
  /** A device tab's Hide here or order change on its way, and what the last
   * one said. */
  @state() private picksBusy = false;
  @state() private picksNote?: WatchPagesNote;
  /** The order a drag asked for, shown until the read after its save. */
  @state() private orderAsked?: { ownerId: string; kind: CardKind; ids: string[] };
  /** Hide here or Show here asked, by `rowKey`, until the read after. */
  @state() private hiddenAsked: ReadonlyMap<string, boolean> = new Map();
  /** The row being dragged, and the one it is over. */
  @state() private dragId?: string;
  @state() private overId?: string;
  /** Which devices said they are on the free plan, as their pages record
   * last said. */
  @state() private freeFacts: ReadonlyMap<string, boolean> = new Map();
  /** "Saved" beside the head, for a moment after a box's write lands. */
  @state() private saved = false;
  private savedTimer: ReturnType<typeof setTimeout> | undefined;

  private hassNow?: HassLike;
  /** The last card clicked in select mode, where a Shift+click run starts. */
  private anchor?: string;
  private hassDrawnAt = 0;
  /** Bumped when the tab is told to list the other kind, so a delete still
   * running for the old kind says nothing on the new one. */
  private kindSeq = 0;
  private freeAsked = new Set<string>();

  /** The library, shared with every other tab and editor. */
  private readonly lib = new LibraryController(this, () => this.hassNow, () => this.devices.map((d) => d.ownerId));

  /** Home Assistant. A new object on every state change: the pictures are
   * drawn again at most every couple of seconds for it. */
  get hass(): HassLike | undefined {
    return this.hassNow;
  }

  set hass(value: HassLike | undefined) {
    const first = this.hassNow === undefined;
    this.hassNow = value;
    const now = Date.now();
    if (first || now - this.hassDrawnAt >= STATES_EVERY_MS) {
      this.hassDrawnAt = now;
      this.requestUpdate();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeyDown);
    clearTimeout(this.savedTimer);
  }

  protected override willUpdate(changed: PropertyValues): void {
    // Told to list the other kind: what was open, picked or typed was of the
    // old one.
    if (changed.has("kind") && changed.get("kind") !== undefined) this.kindChanged();
    // Focused on another device: a selection belongs to every device.
    if (changed.has("focusOwner") && this.focusOwner !== undefined) this.endSelect(true);
    if (this.embedded && changed.has("searchText")) this.search = this.searchText;
    // The board's pages say where a device on the free plan shows only its
    // first page.
    if (this.kind === "pages") for (const d of this.devices) if (!this.freeAsked.has(d.ownerId)) void this.readFree(d.ownerId);
  }

  private kindChanged(): void {
    this.kindSeq++;
    this.search = "";
    this.endSelect(true);
    this.newForm = undefined;
    this.picksNote = undefined;
    this.tickNotes = new Map();
    this.untickAsk = undefined;
  }

  /** The focused device's owner id, or All: the address's, once the device
   * is listed. */
  private get filter(): PagesFilter {
    return resolveFilter(this.focusOwner, this.devices);
  }

  /** The focused device, or undefined on every device. */
  private filterDevice(): LinkDevice | undefined {
    const filter = this.filter;
    return filter === ALL_FILTER ? undefined : this.devices.find((d) => d.ownerId === filter);
  }

  /** Board or Cards, kept for each tab apart (`keptView`). A focused device
   * is always the board: its column is the focus. */
  private get view(): ListView {
    return this.embedded || this.filterDevice() !== undefined ? "board" : phoneView(this.kind, keptView(this.kind).view);
  }

  /** Whether this tab is wide enough for big row pictures. */
  private roomy = new WideWatch(this);

  private colorsFor = deviceColorsCache();

  /** A device's color (`device-colors.ts`), the one it wears on every tab. */
  private colorOf = (ownerId: string): string | undefined => deviceColor(this.colorsFor(this.owners), ownerId);

  /** Every device a page can be on. */
  private get devices(): LinkDevice[] {
    return linkDevicesOf(this.owners, this.phones);
  }

  /** The watches that wait for their iPhone to move their pages (or status
   * pages) here: none can go on them yet (`awaitingMove`). Whether a device
   * holds a record is the summary's word. */
  private waiting(library: Library): Set<string> {
    const facts = new Map<string, PagesRecordFacts>();
    for (const d of this.devices) facts.set(d.ownerId, { held: holdsRecord(library, d.ownerId, this.kind), free: false });
    return awaitingMove(this.owners, facts);
  }

  // ── acting ─────────────────────────────────────────────────────────────

  /** A column head clicked: that device focused, or every device. */
  private setFocus(ownerId: string | undefined): void {
    if (ownerId !== undefined) this.endSelect(true);
    this.picksNote = undefined;
    this.onFocus?.(ownerId);
  }

  /** Board or Cards, remembered. Cards leaves a focused device. */
  private setView(view: ListView): void {
    noteViewPick(this.kind, view);
    keepView(this.kind, { view });
    if (view === "cards" && this.filterDevice() !== undefined) this.setFocus(undefined);
    this.requestUpdate();
  }

  /** "Saved", beside the head, for a moment. */
  private flashSaved(): void {
    clearTimeout(this.savedTimer);
    this.saved = true;
    this.savedTimer = setTimeout(() => { this.saved = false; }, SAVED_FLASH_MS);
  }

  private setSearch(search: string): void {
    this.search = search;
    this.pruneSelected();
  }

  /**
   * New page on a focused device: an empty page named as the app names the
   * next one, put last on that device with a save of its own record, then
   * open in the one editor with the device ringed (plan step 4). Anyone who
   * manages the device may, where a page no device has is an
   * administrator's. On the Status pages tab, the same for a status page.
   */
  private async newPage(device: LinkDevice): Promise<void> {
    const hass = this.hassNow;
    const store = this.lib.store;
    if (hass === undefined || store === undefined || this.picksBusy) return;
    this.newForm = undefined;
    const kind = this.kind;
    if (dirtyHere(device.ownerId, kind)) {
      this.picksNote = { kind: "warn", text: picksDirtyText(kind, device.name) };
      return;
    }
    const id = newId();
    const name = this.nextCardName();
    const add = kind === "status_pages" ? newStatusPage(name, id) : newWatchPage(id, name);
    this.picksBusy = true;
    this.picksNote = undefined;
    let made = false;
    try {
      const result = await changeDevicePicks(picksIO(hass), device.ownerId, kind, { add: add as unknown as Extract<PickChange, { add: unknown }>["add"] });
      made = result.ok && result.changed;
      if (!result.ok) this.picksNote = { kind: "err", text: `Not made on ${device.name}. ${result.message}` };
    } catch (err) {
      this.picksNote = { kind: "err", text: watchCommandError(err).message };
    }
    await store.refresh();
    this.picksBusy = false;
    if (made) this.onOpenLibrary?.(kind, id, device.ownerId);
  }

  /** Whether New page may make a page in the library: administrators only,
   * as a page no device has is an administrator's. */
  private get mayMake(): boolean {
    return this.hassNow?.user?.is_admin === true;
  }

  /** Open New page's dialog, named as the app names the next page and set
   * to preview on a watch, or close it. */
  private toggleNew(): void {
    if (this.newForm?.busy) return;
    if (this.newForm !== undefined) {
      this.newForm = undefined;
      return;
    }
    this.newForm = { name: this.nextCardName(), busy: false, preview: previewKinds(this.devices)[0] };
    void this.updateComplete.then(() => openNewItemDialog(this.renderRoot));
  }

  /** "New Page N", counting the library's pages as the app counts a
   * device's, so a page made here is named as one made on a watch. */
  private nextCardName(): string {
    const library = this.lib.library;
    const items = library === undefined ? [] : libraryItems(library, this.kind).map((e) => e.item);
    return this.kind === "status_pages"
      ? nextStatusPageName({ schemaVersion: 1, statusPages: items })
      : newWatchPageName({ schemaVersion: 1, pages: items });
  }

  /**
   * New page: a page in the library under the name given, empty, that no
   * device has (`library/item/create`), then its editor in library mode,
   * where a tick puts it on a device. The library is read again after it,
   * so its card shows with no device ticked. The dialog's Preview on names
   * the kind of device the editor first draws it on, remembered as the
   * editor's Preview on.
   */
  private async makeCard(): Promise<void> {
    const form = this.newForm;
    const store = this.lib.store;
    if (form === undefined || form.busy || store === undefined) return;
    const name = form.name.trim();
    if (name === "") {
      this.newForm = { ...form, note: { kind: "warn", text: `Give the ${cardNoun(this.kind)} a name.` } };
      return;
    }
    const { note: _dropped, ...asked } = form;
    this.newForm = { ...asked, busy: true };
    const id = newId();
    const document = this.kind === "status_pages"
      ? { schemaVersion: 1, statusPages: [newStatusPage(name, id)] }
      : { schemaVersion: 1, pages: [newWatchPage(id, name)] };
    const made = await store.createItem(this.kind, document);
    if (!made.ok) {
      this.newForm = { ...form, busy: false, note: { kind: "err", text: `Not made. ${made.text}` } };
      return;
    }
    this.newForm = undefined;
    rememberPreview(form.preview ?? previewKinds(this.devices)[0] ?? "watch");
    // Straight into the new page, in the library: no device has it yet.
    this.onOpenLibrary?.(this.kind, made.reply.id);
  }

  /** Open an item in the one editor, the library's, whichever devices have
   * it (plan step 4). From a focused board the device goes along, so the
   * editor rings it and Back comes back to that board. */
  private open(entry: LibraryItem): void {
    this.onOpenLibrary?.(entry.kind, entry.id, this.focusOwner);
  }

  /** A tick: put the item on the device, or take it off, with that device's
   * menu slots and complication taps that opened it (`tickItem`). An untick
   * that would clear some asks under the card first (`askUntick`). A page
   * put on a device on the free plan says that it shows only its first
   * page. */
  private async tick(entry: LibraryItem, ownerId: string, on: boolean): Promise<void> {
    const store = this.lib.store;
    if (store === undefined) return;
    this.dropTickNote(itemKey(entry));
    this.untickAsk = undefined;
    if (!on) {
      const names = { item: entry.name, device: this.devices.find((d) => d.ownerId === ownerId)?.name ?? "the device" };
      this.untickAsk = await askUntick(this.hassNow, store, ownerId, entry.kind, entry.id, names);
      if (this.untickAsk === undefined && store.noteFor(entry.kind, entry.id) === undefined) this.flashSaved();
      return;
    }
    const key = itemKey(entry);
    const result = await tickItem(this.hassNow, store, ownerId, entry.kind, entry.id, true);
    if (result.ok) this.flashSaved();
    if (!result.ok || entry.kind !== "pages") return;
    const free = await this.readFree(ownerId);
    const library = this.lib.library;
    const name = this.devices.find((d) => d.ownerId === ownerId)?.name;
    if (!free || library === undefined || name === undefined || countFor(library, ownerId, "pages") < 2) return;
    const text = freePlanText([name]);
    if (text !== undefined) this.tickNotes = new Map(this.tickNotes).set(key, { kind: "warn", text: `Added to ${name}. ${text}` });
  }

  /** Remove under an untick's question: take the item off, then say under
   * its card what was cleared there. */
  private async untickNow(ask: UntickAsk): Promise<void> {
    const store = this.lib.store;
    this.untickAsk = undefined;
    if (store === undefined) return;
    const result = await tickItem(this.hassNow, store, ask.ownerId, ask.kind, ask.itemId, false, ask.names);
    if (result.ok) this.flashSaved();
    if (result.note !== undefined) this.tickNotes = new Map(this.tickNotes).set(itemKey({ id: ask.itemId }), result.note);
  }

  private dropTickNote(key: string): void {
    if (!this.tickNotes.has(key)) return;
    const notes = new Map(this.tickNotes);
    notes.delete(key);
    this.tickNotes = notes;
  }

  /** Whether a device is on the free plan, as its pages record says now. */
  private async readFree(ownerId: string): Promise<boolean> {
    const hass = this.hassNow;
    if (hass === undefined) return false;
    this.freeAsked.add(ownerId);
    try {
      const record = await fetchWatchConfig(hass, ownerId, "pages");
      const free = record.multiple_pages === false;
      if (this.freeFacts.get(ownerId) !== free) this.freeFacts = new Map(this.freeFacts).set(ownerId, free);
      return free;
    } catch {
      return this.freeFacts.get(ownerId) ?? false;
    }
  }

  /** A device tab's Hide here, Show here or a move: one save of that
   * device's record, then the library read again. Not while the device's
   * editor holds unsaved edits, which the save would land under. */
  private async changePicks(device: LinkDevice, change: Exclude<PickChange, { add: unknown }>, order?: string[]): Promise<void> {
    const hass = this.hassNow;
    const store = this.lib.store;
    if (hass === undefined || store === undefined || this.picksBusy) return;
    const kind = this.kind;
    if (dirtyHere(device.ownerId, kind)) {
      this.picksNote = { kind: "warn", text: picksDirtyText(kind, device.name) };
      return;
    }
    const view = this.kindSeq;
    const hide = "hidden" in change;
    const at = rowKey(device.ownerId, change.id);
    this.picksBusy = true;
    this.picksNote = undefined;
    if (hide) this.hiddenAsked = new Map(this.hiddenAsked).set(at, change.hidden);
    else if (order !== undefined) this.orderAsked = { ownerId: device.ownerId, kind, ids: movedOrder(order, change.id, change.before) };
    const asked = this.orderAsked;
    let note: WatchPagesNote | undefined;
    try {
      const result = await changeDevicePicks(picksIO(hass), device.ownerId, kind, change);
      if (result.ok) this.flashSaved();
      if (!result.ok) note = { kind: "err", text: `${hide ? "Not changed" : "Not moved"} on ${device.name}: ${result.message.replace(/\.$/, "")}.` };
    } catch (err) {
      note = { kind: "err", text: watchCommandError(err).message };
    }
    await store.refresh();
    this.picksBusy = false;
    if (hide) {
      const next = new Map(this.hiddenAsked);
      next.delete(at);
      this.hiddenAsked = next;
    } else if (this.orderAsked === asked) this.orderAsked = undefined;
    if (view === this.kindSeq) this.picksNote = note;
  }

  /** Escape closes the newest thing open: the delete question, then Multi
   * select. */
  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== "Escape") return;
    if (this.itemAsk !== undefined) {
      e.preventDefault();
      this.itemAsk = undefined;
    } else if (this.asking && this.bulkBusy === undefined) {
      e.preventDefault();
      this.asking = false;
    } else if (this.selecting && this.bulkBusy === undefined) {
      e.preventDefault();
      this.endSelect();
    }
  };

  // ── picking ────────────────────────────────────────────────────────────

  /** The cards or rows shown now on every device, under the search. */
  private shownNow(): LibraryItem[] {
    const library = this.lib.library;
    return library === undefined ? [] : shownItems(library, this.kind, this.search);
  }

  /** The picked cards among those shown, in the order shown. */
  private pickedItems(): LibraryItem[] {
    return this.shownNow().filter((e) => this.selected.has(itemKey(e)));
  }

  /** Unpick the cards a search or a delete hides. */
  private pruneSelected(): void {
    if (this.selected.size === 0) return;
    this.selected = keepPresent(this.selected, this.shownNow().map(itemKey));
  }

  private startSelect(): void {
    this.selecting = true;
    this.itemAsk = undefined;
    this.bulkNote = undefined;
  }

  private endSelect(force = false): void {
    if (this.bulkBusy !== undefined && !force) return;
    this.selecting = false;
    this.selected = new Set();
    this.anchor = undefined;
    this.asking = false;
    this.bulkNote = undefined;
  }

  /**
   * A click on a card. Outside Multi select it opens the page, unless
   * Cmd/Ctrl is held: that picks it and turns Multi select on. In Multi
   * select it picks or unpicks the card, and Shift+click picks every card
   * from the last one clicked.
   */
  private cardClick(e: MouseEvent, entry: LibraryItem): void {
    const toggle = e.metaKey || e.ctrlKey;
    if (!this.selecting && !toggle) {
      this.open(entry);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.pick(entry, e.shiftKey && this.selecting && !toggle);
  }

  private pick(entry: LibraryItem, range: boolean): void {
    if (this.bulkBusy !== undefined) return;
    if (!this.selecting) this.startSelect();
    const key = itemKey(entry);
    this.selected = range ? rangeSelected(this.selected, this.shownNow().map(itemKey), this.anchor, key) : toggleSelected(this.selected, key);
    this.anchor = key;
    this.bulkNote = undefined;
    if (this.selected.size === 0) this.asking = false;
  }

  /** The bar's All shown, or None: every card on screen picked, or let go. */
  private selectShown(all: boolean): void {
    if (this.bulkBusy !== undefined) return;
    const keys = this.shownNow().map(itemKey);
    this.selected = all ? withAll(this.selected, keys) : withNone(this.selected, keys);
    this.bulkNote = undefined;
    if (this.selected.size === 0) this.asking = false;
  }

  /** Open the delete question in the bar, or close it. */
  private toggleAsk(): void {
    if (this.bulkBusy !== undefined) return;
    this.asking = !this.asking;
    this.bulkNote = undefined;
    if (!this.asking) return;
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector?.<HTMLElement>(".pk-bar .pk-bar-cancel")?.focus();
    });
  }

  /**
   * Delete the picked items, with Undo: they hide at once and a toast says
   * so (`delete-later.ts`). When it goes, each is deleted from the library,
   * the complication taps that opened a deleted page are cleared, and the
   * library is read again; anything that went wrong is the toast's to say.
   * An item a device with unsaved edits has stays, and the bar says why.
   */
  private runDelete(): void {
    const picked = this.pickedItems();
    if (picked.length === 0) return;
    this.asking = false;
    this.anchor = undefined;
    this.deleteEntries(picked);
    this.pruneSelected();
  }

  /** `runDelete` for any items: Multi select's, or one card's or row's. */
  private deleteEntries(entries: readonly LibraryItem[]): void {
    const hass = this.hassNow;
    const store = this.lib.store;
    if (hass === undefined || store === undefined || this.bulkBusy !== undefined) return;
    const devices = this.devices;
    const plan = deletePlan(entries, devices, dirtyHere);
    const kept = bulkResultText({ kind: plan.kind, gone: [], kept: plan.kept, failed: [], stuck: [], taps: [] });
    this.bulkNote = plan.kept.length > 0 ? kept : undefined;
    if (plan.items.length === 0) return;
    const n = plan.items.length;
    deleteLater({
      text: `Deleted ${n === 1 ? plan.items[0]!.name : countText(plan.kind, n)}.`,
      hide: plan.items.map((item) => laterKey(plan.kind, item.id)),
      send: async () => {
        let note: WatchPagesNote;
        try {
          note = bulkResultText(await runDelete(pagesBulkIO(hass), { ...plan, kept: [] }, devices));
        } catch (err) {
          note = { kind: "err", text: watchCommandError(err).message };
        }
        await store.refresh();
        return note.kind === "ok" ? undefined : note.text;
      },
    });
  }

  /** Delete, at the end of a card's name row or after a board row's name:
   * one press asks in place, as a Complications card does. */
  private renderItemDelete(entry: LibraryItem, cls: string): TemplateResult {
    return html`<button type="button" class=${cls} title=${`Delete ${entry.name}`} aria-label=${`Delete ${entry.name}`}
      ?disabled=${this.bulkBusy !== undefined}
      @click=${(e: Event) => { e.stopPropagation(); this.itemAsk = itemKey(entry); }}>${uiIcon("delete")}</button>`;
  }

  /**
   * One item's delete question: what goes with it, then Really delete. On
   * a focused device that shares it with another, This device (an untick
   * there) or Every device, as the editor asks. An item a device with
   * unsaved edits has says so, with only Close.
   */
  private renderItemAsk(entry: LibraryItem, devices: readonly LinkDevice[], focus?: LinkDevice): TemplateResult {
    const plan = deletePlan([entry], devices, dirtyHere);
    const ask = deleteAskText(plan, devices);
    const close = () => { this.itemAsk = undefined; };
    const gone = () => { close(); this.deleteEntries([entry]); };
    const here = focus !== undefined && entry.owners.some((o) => sameId(o, focus.ownerId)) && entry.owners.some((o) => !sameId(o, focus.ownerId))
      ? focus : undefined;
    const can = plan.items.length > 0;
    return html`<div class="ap-ask" role="alertdialog" aria-label=${`Delete ${entry.name}?`} @click=${(e: Event) => e.stopPropagation()}>
      <span><b>Delete ${entry.name}?</b> ${ask.body}</span>
      <span class="ap-ask-acts">
        ${!can ? nothing : here === undefined
          ? html`<button type="button" class="ap-ask-btn danger" @click=${gone}>Really delete</button>`
          : html`<button type="button" class="ap-ask-btn danger" title=${`Take it off ${here.name} only`}
              @click=${() => { close(); void this.tick(entry, here.ownerId, false); }}>${DELETE_THIS_DEVICE}</button>
            <button type="button" class="ap-ask-btn danger" title="Delete it on every device" @click=${gone}>${DELETE_EVERY_DEVICE}</button>`}
        <button type="button" class="ap-ask-btn" @click=${close}>${can ? "Cancel" : "Close"}</button>
      </span>
    </div>`;
  }

  // ── drawing ────────────────────────────────────────────────────────────

  protected override render(): TemplateResult {
    const devices = this.devices;
    if (devices.length === 0 && !this.ownersReady) return html`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;
    if (this.embedded) return this.renderEmbedded();
    const what = this.kind;
    const library = this.lib.library;
    const readState = this.lib.readState;
    const device = this.filterDevice();
    const many = cardNoun(what, 2);
    const view = this.view;
    const lead = library === undefined
      ? (readState === "unsupported" ? LIBRARY_UNSUPPORTED_TEXT : readState === "failed" ? (this.lib.store?.readError ?? "Could not read the library.") : `Reading the ${many}…`)
      : allPagesLead(libraryItems(library, what).length, what);
    const stale = library !== undefined && readState === "failed";
    return html`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${cardsTitle(what)}</h1>
          <p class="ap-lead">${lead}</p>
        </div>
        ${devices.length === 0 ? nothing : this.renderNew(device, devices)}
      </div>
      ${this.newForm === undefined ? nothing : this.renderNewDialog(this.newForm, devices)}
      ${stale ? html`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError ?? ""} It shows as last read.</p>` : nothing}
      <div class="pk-surface pk-page" role="region" aria-label=${`Your ${many}`}>
        <div class="pk-pin">
          ${this.renderHead(library, device, view)}
          ${this.selecting && device === undefined ? this.renderBar(devices) : nothing}
        </div>
        <div class="pk-body">
          ${library === undefined ? html`<p class="ap-empty">${lead}</p>`
            : device !== undefined ? this.renderFocus(library, deviceView(library, device, what, this.search), devices)
            : view === "board" ? this.renderBoardAll(library, devices)
            : this.renderAll(library, devices)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${footText(what, device, this.selecting && device === undefined, view)}</span></div>
      </div>
    </div></div>`;
  }

  /** Inside Home's "All devices": the board on every device, a box a
   * tick as on the tab, with "Saved" over it for a moment after a write. */
  private renderEmbedded(): TemplateResult {
    const library = this.lib.library;
    const devices = this.devices;
    const many = cardNoun(this.kind, 2);
    const readState = this.lib.readState;
    if (library === undefined) {
      const why = readState === "unsupported" ? LIBRARY_UNSUPPORTED_TEXT : readState === "failed" ? (this.lib.store?.readError ?? "Could not read the library.") : `Reading the ${many}…`;
      return html`<p class="ap-empty">${why}</p>`;
    }
    if (devices.length === 0) return html`<p class="ap-empty">No device can have ${many}.</p>`;
    const body = libraryItems(library, this.kind).length === 0
      ? html`<p class="ap-empty">No ${many} yet.</p>`
      : this.renderBoardAll(library, devices);
    return html`${this.saved ? html`<span class="bd-saved ap-embed-saved" role="status">${uiIcon("check")}<span>Saved</span></span>` : nothing}${body}`;
  }

  /** Cards: one card per item of the library, in its order. */
  private renderAll(library: Library, devices: readonly LinkDevice[]): TemplateResult {
    const empty = this.renderEmptyLibrary(library, devices);
    if (empty !== undefined) return empty;
    const shown = shownItems(library, this.kind, this.search);
    if (shown.length === 0) return html`<p class="ap-empty">${emptyText(devices, this.search, this.kind)}</p>`;
    const waiting = this.waiting(library);
    return html`<div class="ap-grid" role="list">${shown.map((entry) => this.renderCard(library, entry, devices, waiting))}</div>`;
  }

  /** An empty library's block: how a page works, with New page for whoever
   * may make one, and while a watch waits for its iPhone, that its pages
   * move here by themselves. Undefined while the library holds some. */
  private renderEmptyLibrary(library: Library, devices: readonly LinkDevice[]): TemplateResult | undefined {
    if (devices.length === 0 || libraryItems(library, this.kind).length > 0) return undefined;
    const may = this.mayMake;
    const waiting = this.waiting(library).size > 0;
    return html`<div class="ap-empty-lib">
      <p>${emptyLibraryText(this.kind, may)}</p>
      ${waiting ? html`<p class="ap-empty-wait">${waitingLibraryText(cardNoun(this.kind, 2))}</p>` : nothing}
      ${may ? html`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy === true} @click=${() => this.toggleNew()}>
        ${uiIcon("plus")}<span>New ${cardNoun(this.kind)}</span></button>` : nothing}
    </div>`;
  }

  /**
   * The head, the Complications list's: Multi select on every device,
   * Board or Cards, "Saved" for a moment after a box's write, then the
   * search at the right. A page is the same page on a watch and on an
   * iPhone, so neither view draws a device around it.
   */
  private renderHead(library: Library | undefined, device: LinkDevice | undefined, view: ListView): TemplateResult {
    const on = this.selecting;
    const busy = this.bulkBusy !== undefined;
    const many = cardNoun(this.kind, 2);
    return html`<div class="pk-head">
      ${device === undefined ? html`<button type="button" class="pk-pick-btn ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
        title=${on ? `Back to opening one ${cardNoun(this.kind)} at a time` : `Pick several ${many} to delete together`}
        ?disabled=${busy || library === undefined} @click=${() => (on ? this.endSelect() : this.startSelect())}>
        ${uiIcon("checklist")}<span>Multi select</span></button>` : nothing}
      ${renderViewSwitch(view, (v) => this.setView(v), many)}
      ${this.saved ? html`<span class="bd-saved" role="status">${uiIcon("check")}<span>Saved</span></span>` : nothing}
      <label class="pk-search">
        ${uiIcon("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${many}`}
          @input=${(e: InputEvent) => this.setSearch((e.target as HTMLInputElement).value)} />
      </label>
    </div>`;
  }

  /**
   * New page, at the head's right as New complication is on its tab, or
   * New status page on the Status pages tab. On a focused device it adds
   * the page there. On every device it asks for a name and makes the page
   * in the library, where no device has it until one is ticked, as New
   * menu does.
   */
  private renderNew(device: LinkDevice | undefined, _devices: readonly LinkDevice[]): TemplateResult {
    const label = `New ${cardNoun(this.kind)}`;
    if (device !== undefined) {
      return html`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${aCard(this.kind)} on ${device.name}`}
          ?disabled=${this.picksBusy} @click=${() => void this.newPage(device)}>
          ${uiIcon("plus")}<span>${label}</span></button>
      </div>`;
    }
    const may = this.mayMake;
    const open = this.newForm !== undefined;
    return html`<div class="ap-new">
      <button type="button" class="ap-new-btn ${open ? "on" : ""}" aria-expanded=${open ? "true" : "false"}
        ?disabled=${!may || this.newForm?.busy === true}
        title=${may ? `Make ${aCard(this.kind)} no device has yet` : newCardAdminText(this.kind)}
        @click=${() => this.toggleNew()}>
        ${uiIcon("plus")}<span>${label}</span></button>
    </div>`;
  }

  /** New page's dialog: a name, and on a home with watches and iPhones the
   * kind of device to preview on. No device: a tick in the editor puts the
   * page on one. */
  private renderNewDialog(form: NewItemForm, devices: readonly LinkDevice[]): TemplateResult {
    return renderNewItemDialog(this.kind, form, previewKinds(devices), {
      onName: (name) => { this.newForm = { ...form, name }; },
      onPreview: (preview) => { this.newForm = { ...form, preview }; },
      onMake: () => void this.makeCard(),
      onClose: () => { if (!form.busy) this.newForm = undefined; },
    });
  }

  /** What a tick row or a board row of one item is drawn from: its chips'
   * input, with its last note and an untick asking first. */
  private ticksInput(library: Library, entry: LibraryItem, devices: readonly LinkDevice[], waiting: ReadonlySet<string>): TicksInput {
    const store = this.lib.store;
    const key = itemKey(entry);
    const refusal = store?.noteFor(entry.kind, entry.id);
    const note: WatchPagesNote | undefined = refusal === undefined ? this.tickNotes.get(key) : { kind: "warn", text: refusal };
    const asked = this.untickAsk;
    const ask = asked !== undefined && asked.kind === entry.kind && sameId(asked.itemId, entry.id) ? asked : undefined;
    const admin = this.hassNow?.user?.is_admin;
    const skips = entry.kind === "pages" ? watchSkippedTileNames(entry.item as WatchPage) : [];
    return {
      library, kind: entry.kind, itemId: entry.id, devices, colorOf: this.colorOf, skips,
      ...(store === undefined ? {} : { pending: store.pending }),
      ...(note === undefined ? {} : { note: note.text, noteKind: note.kind }),
      ...(ask === undefined ? {} : {
        ask: { ownerId: ask.ownerId, text: ask.text, onRemove: () => void this.untickNow(ask), onCancel: () => { this.untickAsk = undefined; } },
      }),
      ...(admin === undefined ? {} : { admin }),
      locked: (ownerId) => {
        const on = hasItem(library, ownerId, entry.kind, entry.id);
        if (on && dirtyHere(ownerId, entry.kind)) return picksDirtyText(entry.kind, devices.find((d) => d.ownerId === ownerId)?.name ?? "This device");
        if (!on && waiting.has(ownerId)) return DEVICES_WAIT_TEXT;
        return undefined;
      },
    };
  }

  /** A card's row of ticks: one per device. A page's watch chips count the
   * tiles a watch skips there, as the device strip over the stage does. */
  private renderCardTicks(library: Library, entry: LibraryItem, devices: readonly LinkDevice[], waiting: ReadonlySet<string>): TemplateResult {
    return renderTicks(this.ticksInput(library, entry, devices, waiting), (ownerId, on) => void this.tick(entry, ownerId, on));
  }

  private renderCard(library: Library, entry: LibraryItem, devices: readonly LinkDevice[], waiting: ReadonlySet<string>): TemplateResult {
    const selecting = this.selecting;
    const key = itemKey(entry);
    const picked = selecting && this.selected.has(key);
    const opensOn = openDevice(entry, devices);
    const title = this.openTitle(entry);
    const click = (e: MouseEvent) => this.cardClick(e, entry);
    const asking = !selecting && this.itemAsk === key;
    return html`<div class="ap-card ${selecting ? "picking" : ""} ${picked ? "picked" : ""} ${asking ? "asking" : ""}" role="listitem" data-card=${key}
      @click=${(e: MouseEvent) => { if (selecting) click(e); }}>
      <div class="ap-top">
        ${selecting ? html`<input type="checkbox" class="pk-card-pick" .checked=${live(picked)} ?disabled=${this.bulkBusy !== undefined}
          aria-label=${title}
          @click=${(e: MouseEvent) => {
            e.stopPropagation();
            this.pick(entry, e.shiftKey);
          }} />` : nothing}
        <button type="button" class="ap-open" title=${title} tabindex=${selecting ? "-1" : "0"} @click=${click}>
          <b class="ap-name">${entry.name}</b>
          <small class="ap-detail">${cardDetail(entry)}</small>
        </button>
        ${selecting ? nothing : this.renderItemDelete(entry, "ap-del")}
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${title} @click=${click}>
        ${entry.kind === "status_pages" ? this.renderStatusThumb(entry) : this.renderThumb(library, entry, opensOn)}
      </button>
      ${this.renderCardTicks(library, entry, devices, waiting)}
      ${asking ? this.renderItemAsk(entry, devices) : nothing}
    </div>`;
  }

  /** What a card's or a row's name says it opens: Pick in Multi select,
   * else the item in the one editor. */
  private openTitle(entry: LibraryItem): string {
    if (this.selecting) {
      const picked = this.selected.has(itemKey(entry));
      return `${picked ? "Let" : "Pick"} ${entry.name}${picked ? " go" : ""}`;
    }
    return libraryEditTitle(entry.name);
  }

  // ── the board ──────────────────────────────────────────────────────────

  /** The board's columns: every device, with how many of the kind it has. */
  private boardColumns(library: Library, devices: readonly LinkDevice[]): BoardColumn[] {
    return devices.map((device) => ({ device, color: this.colorOf(device.ownerId), count: countFor(library, device.ownerId, this.kind) }));
  }

  /** The board on every device: a row per item, in the library's order. */
  private renderBoardAll(library: Library, devices: readonly LinkDevice[]): TemplateResult {
    const empty = this.renderEmptyLibrary(library, devices);
    if (empty !== undefined) return empty;
    if (devices.length === 0) return html`<p class="ap-empty">${emptyText(devices, this.search, this.kind)}</p>`;
    const waiting = this.waiting(library);
    const shown = shownItems(library, this.kind, this.search);
    return this.renderBoardOf(library, devices, [{
      key: "all", rows: shown.map((entry) => this.boardRow(library, entry, devices, waiting)),
      empty: emptyText(devices, this.search, this.kind),
    }]);
  }

  private renderBoardOf(library: Library, devices: readonly LinkDevice[], sections: BoardSection[], focus?: string): TemplateResult {
    const one = cardNoun(this.kind);
    const many = cardNoun(this.kind, 2);
    return renderBoard({
      label: `${cardsTitle(this.kind)} on each device`,
      thing: one.charAt(0).toUpperCase() + one.slice(1),
      columns: this.boardColumns(library, devices),
      ...(focus === undefined ? {} : { focus }),
      onFocus: (ownerId) => this.setFocus(ownerId),
      wide: this.roomy.wide,
      focusWord: "Order",
      focusTitle: (d) => `Show ${d.name}'s ${many} first, in its order`,
      sections,
    });
  }

  /**
   * One item's row: its picture, name and facts, then a box per device
   * (`tickChips`), each with what is special there: the tiles a watch
   * skips, "shows nothing" when a watch skips every tile, and on a device
   * on the free plan which page is its one page. On the focused device a
   * picked row also drags and has Hide here.
   */
  private boardRow(library: Library, entry: LibraryItem, devices: readonly LinkDevice[], waiting: ReadonlySet<string>,
    focus?: { device: LinkDevice; pick?: LibraryPick; drag?: BoardDrag }): BoardRow {
    const input = this.ticksInput(library, entry, devices, waiting);
    const chips = tickChips(input);
    const page = entry.kind === "pages" ? (entry.item as WatchPage) : undefined;
    const tiles = page === undefined ? 0 : watchPageTiles(page).length;
    const skipsAll = page !== undefined && tiles > 0 && (input.skips?.length ?? 0) >= tiles;
    const cells = chips.map((chip): BoardCell => {
      const cell: BoardCell = { chip, onPick: (on) => void this.tick(entry, chip.ownerId, on) };
      if (chip.on && chip.device === "watch" && skipsAll) {
        cell.note = "shows nothing";
        cell.noteWarn = true;
        cell.noteTitle = `Every tile on ${entry.name} is iPhone only, so ${chip.name} shows an empty page.`;
      } else if (chip.skips !== undefined) {
        cell.note = chip.skips.text;
        cell.noteTitle = chip.skips.title;
      }
      const free = this.freeNote(library, entry, chip.ownerId, chip.name, chip.on);
      if (free !== undefined && cell.note === undefined) Object.assign(cell, free);
      if (focus?.pick !== undefined && sameId(chip.ownerId, focus.device.ownerId) && entry.kind === "pages") {
        const at = rowKey(focus.device.ownerId, entry.id);
        const hidden = this.hiddenAsked.get(at) ?? focus.pick.hidden;
        cell.eye = {
          hidden, busy: this.picksBusy,
          title: hidden ? `Show ${entry.name} on ${focus.device.name} again` : `Hide here: keep ${entry.name} on ${focus.device.name} without showing it`,
          onToggle: () => void this.changePicks(focus.device, { id: entry.id, hidden: !hidden }),
        };
      }
      return cell;
    });
    const selecting = this.selecting && focus === undefined;
    const key = itemKey(entry);
    const row: BoardRow = {
      key, name: entry.name, detail: cardDetail(entry), picture: this.rowPicture(entry, focus?.pick !== undefined ? focus.device : undefined),
      openTitle: focus?.pick !== undefined ? `${libraryEditTitle(entry.name)}. Alt+Up or Alt+Down moves it.` : this.openTitle(entry),
      onOpen: (e) => {
        if (focus?.pick !== undefined && !e.metaKey && !e.ctrlKey) {
          this.open(entry);
          return;
        }
        this.cardClick(e, entry);
      },
      cells,
      ...(focus !== undefined && focus.pick === undefined ? { dim: true } : {}),
      ...(focus?.drag === undefined ? {} : { drag: focus.drag }),
      ...(input.ask === undefined ? {} : { ask: input.ask }),
      ...(input.note === undefined ? {} : { note: { text: input.note, kind: input.noteKind ?? "warn" } }),
    };
    if (selecting) {
      row.select = { picked: this.selected.has(key), disabled: this.bulkBusy !== undefined, label: this.openTitle(entry), onPick: (e) => this.pick(entry, e.shiftKey) };
    } else {
      row.actions = this.renderItemDelete(entry, "bd-act danger");
      if (this.itemAsk === key) row.under = this.renderItemAsk(entry, devices, focus?.device);
    }
    return row;
  }

  /** A device on the free plan shows only its first page: its box on that
   * page says "1st page", on every other page "free: not shown". Nothing for
   * a device with one page, or not on the free plan. */
  private freeNote(library: Library, entry: LibraryItem, ownerId: string, name: string, on: boolean): Pick<BoardCell, "note" | "noteTitle" | "noteWarn"> | undefined {
    if (entry.kind !== "pages" || !on || this.freeFacts.get(ownerId) !== true) return undefined;
    const shown = itemsFor(library, ownerId, "pages").filter((p) => !p.hidden);
    if (shown.length < 2) return undefined;
    const why = freePlanText([name]);
    if (sameId(shown[0]!.id, entry.id)) return { note: "1st page", ...(why === undefined ? {} : { noteTitle: why }) };
    return { note: "free: not shown", noteWarn: true, ...(why === undefined ? {} : { noteTitle: why }) };
  }

  /** A row's small picture: the page as a watch draws it, or as the
   * focused iPhone does. */
  private rowPicture(entry: LibraryItem, device: LinkDevice | undefined): TemplateResult {
    if (entry.kind === "status_pages") {
      return renderStatusRowPicture({ page: entry.item, hass: this.hassNow, width: this.roomy.size(BOARD_PICTURE_W), tick: this.iconsTick, ...(this.icons === undefined ? {} : { icons: this.icons }) });
    }
    return renderPageRowPicture({
      page: entry.item as WatchPage, width: this.roomy.size(device?.kind === "iphone" ? BOARD_PHONE_PICTURE_W : BOARD_PICTURE_W), tick: this.iconsTick, iphone: device?.kind === "iphone",
      ...(this.hassNow === undefined ? {} : { states: this.hassNow.states }),
      ...(this.icons === undefined ? {} : { icons: this.icons }),
    });
  }

  /**
   * A focused device (mock screen 4): its own screens one click away, then
   * the board with its picks first, in its own order, each with a drag
   * handle and, for a page, Hide here in its column; then the rest of the
   * library, dimmed, where its box adds one. Dragging is off while a search
   * narrows the list.
   */
  private renderFocus(library: Library, view: DeviceView, devices: readonly LinkDevice[]): TemplateResult {
    const { device } = view;
    const asked = this.orderAsked;
    const order = asked !== undefined && asked.ownerId === device.ownerId && asked.kind === this.kind ? asked.ids : undefined;
    const picks = inOrder(view.picks, order);
    const ids = picks.map((p) => p.id);
    const total = countFor(library, device.ownerId, this.kind);
    const drag = this.search.trim() === "" && !this.picksBusy;
    const free = this.kind === "pages" && this.freeFacts.get(device.ownerId) === true && total > 1 ? freePlanText([device.name]) : undefined;
    const waiting = this.waiting(library);
    const many = cardNoun(this.kind, 2);
    const rows = picks.map((pick, i) => this.boardRow(library, pick.entry, devices, waiting, { device, pick, drag: this.rowDrag(pick, i, ids, device, drag) }));
    const rest = view.rest.map((entry) => this.boardRow(library, entry, devices, waiting, { device }));
    return html`${this.renderFocusHead(device, total)}
      ${this.picksNote === undefined ? nothing : html`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${free === undefined ? nothing : html`<p class="lt-line">${free}</p>`}
      ${this.renderBoardOf(library, devices, [
        {
          key: "on", title: onDeviceTitle(device), count: total, hint: orderHint(device), rows,
          empty: waiting.has(device.ownerId) && this.search.trim() === ""
            ? waitingEmptyText(many, device.name)
            : noPicksText(device, this.kind, this.search, view.rest.length, this.mayMake),
        },
        {
          key: "rest", title: restTitle(device), count: view.rest.length, hint: `Tick its box under ${device.name} to add it.`, rows: rest,
          empty: this.search.trim() === "" ? `Every ${cardNoun(this.kind)} in your home is on ${device.name}.` : `No other ${cardNoun(this.kind)} has that name.`,
        },
      ], device.ownerId)}
      <p class="lt-line bd-foot-line">${total} ${total === 1 ? cardNoun(this.kind) : many} on ${device.name}.</p>`;
  }

  /** The focused device's head: who it is, its order, its own screens, and
   * the way back to every device. */
  private renderFocusHead(device: LinkDevice, total: number): TemplateResult {
    const word = deviceWord(device.kind);
    const noun = cardNoun(this.kind, total);
    const own: DeviceOwnScreen[] = device.kind === "watch" ? ["settings", "rooms", "voice"] : ["settings", "rooms"];
    const color = this.colorOf(device.ownerId);
    return html`<div class="bd-focus" style=${color === undefined ? nothing : `--dc:${color}`}>
      <span class="bd-focus-glyph" aria-hidden="true">${uiIcon(device.kind === "iphone" ? "phone" : "watch")}</span>
      <span class="bd-focus-t"><b>${device.name}</b> <span>${total} ${noun}, in the order the ${word} ${this.kind === "pages" ? "shows" : "keeps"} them</span></span>
      ${this.onOpenScreen === undefined ? nothing : html`<span class="bd-focus-own">Also on this ${word}:
        ${own.map((screen) => html`<button type="button" class="bd-link" @click=${() => this.onOpenScreen?.(device.ownerId, device.kind, screen)}>${DEVICE_OWN_LABELS[screen]}</button>`)}</span>`}
      <button type="button" class="bd-focus-all" @click=${() => this.setFocus(undefined)}>${uiIcon("grid")}<span>All devices</span></button>
    </div>`;
  }

  /** A focused device's row moves: drag it onto another, or Alt+Up and
   * Alt+Down from the keyboard. */
  private rowDrag(pick: LibraryPick, index: number, ids: readonly string[], device: LinkDevice, on: boolean): BoardDrag {
    const over = this.overId !== undefined && sameId(this.overId, pick.id) && this.dragId !== undefined && !sameId(this.dragId, pick.id);
    const move = (before: string | null | undefined) => {
      if (before === undefined) return;
      void this.changePicks(device, { id: pick.id, before }, [...ids]);
    };
    return {
      on,
      dragging: this.dragId !== undefined && sameId(this.dragId, pick.id),
      over,
      below: over && ids.findIndex((id) => sameId(id, this.dragId!)) < index,
      onStart: (e) => {
        if (!on) return;
        this.dragId = pick.id;
        e.dataTransfer?.setData("text/plain", pick.id);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
      },
      onOver: (e) => {
        if (this.dragId === undefined) return;
        e.preventDefault();
        if (this.overId !== pick.id) this.overId = pick.id;
      },
      onDrop: (e) => {
        e.preventDefault();
        const dragged = this.dragId;
        this.dragId = undefined;
        this.overId = undefined;
        // The dragged row moves, not the one it lands on.
        const change = dragged === undefined ? undefined : dropChange(ids, dragged, pick.id);
        if (change !== undefined) void this.changePicks(device, change, [...ids]);
      },
      onEnd: () => { this.dragId = undefined; this.overId = undefined; },
      onKey: (e) => {
        if (!e.altKey || !on || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
        e.preventDefault();
        if (e.key === "ArrowUp") move(index > 0 ? ids[index - 1]! : undefined);
        else move(index < ids.length - 1 ? (ids[index + 2] ?? null) : undefined);
      },
    };
  }

  /**
   * The bar under the head while Multi select is on, the Complications
   * list's: how many are picked (or what is running), All shown or None,
   * what the last delete did, then Delete and Done. Delete asks in the bar
   * itself.
   */
  private renderBar(devices: readonly LinkDevice[]): TemplateResult {
    const shown = this.shownNow();
    const picked = shown.filter((e) => this.selected.has(itemKey(e)));
    const n = picked.length;
    const busy = this.bulkBusy !== undefined;
    const none = n === 0;
    const allShown = shown.length > 0 && shown.every((e) => this.selected.has(itemKey(e)));
    const note = busy ? undefined : this.bulkNote;
    const one = cardNoun(this.kind);
    const many = cardNoun(this.kind, 2);
    return html`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${many}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy ?? (none ? `Pick ${aCard(this.kind)} to start.` : `${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${busy || shown.length === 0}
        title=${allShown ? `Let the ${many} on screen go` : `Pick every ${one} the search has left`}
        @click=${() => this.selectShown(!allShown)}>${allShown ? "None" : "All shown"}</button>
      ${note === undefined ? nothing : html`<span class="pk-bar-said ${note.kind}">${note.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking && !none
        ? this.renderDeleteAsk(picked, devices)
        : html`<button type="button" class="ghost danger small" ?disabled=${busy || none}
            title=${`Delete these ${many} from every device they are on`}
            @click=${() => this.toggleAsk()}>${uiIcon("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${busy}
        title=${`Stop picking and go back to opening one ${one} at a time`}
        @click=${() => this.endSelect()}>${uiIcon("check")}<span>Done</span></button>
    </div>`;
  }

  /** The delete question, in the bar where Delete was: how many, from the
   * library and which devices. */
  private renderDeleteAsk(picked: readonly LibraryItem[], devices: readonly LinkDevice[]): TemplateResult {
    const plan = deletePlan(picked, devices, dirtyHere);
    const ask = deleteAskText(plan, devices);
    return html`<span class="pk-bar-ask" id="ap-del-ask"><b>${ask.title}</b> ${ask.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${plan.items.length === 0}
        @click=${() => this.runDelete()}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${() => { this.asking = false; }}>Cancel</button>`;
  }

  /**
   * The page alone, with a plain outline: no watch case, no iPhone, no
   * clock and no page dots, since the same page is on a watch and on an
   * iPhone. One screen width for every card. Only as tall as its tiles
   * (`pageCrop`), and cut with a fade past `PIC_MAX_H`. The tiles that open
   * a page are named from the pages of the device it opens on.
   */
  private renderThumb(library: Library, entry: LibraryItem, on: LinkDevice | undefined): TemplateResult {
    const page = entry.item as WatchPage;
    const listed = on === undefined ? [] : watchPagesOf(pagesDocumentFor(library, on.ownerId));
    const pages = listed.length === 0 ? [page] : listed;
    const states = this.hassNow?.states;
    const icons = this.icons;
    const scale = PIC_W / PIC_SCREEN.width;
    const crop = pageCrop(page, states, icons);
    const tall = crop.height * scale;
    const cut = tall > PIC_MAX_H;
    const px = (n: number) => `${Math.round(n * 100) / 100}px`;
    return html`<span class="ap-pic ${cut ? "cut" : ""}" style=${`width:${px(PIC_W)};height:${px(Math.min(tall, PIC_MAX_H))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${px(-crop.top * scale)})`}>${renderWatchPagePreview({
        page, pages, screen: PIC_SCREEN, scale,
        ...(states === undefined ? {} : { states }), ...(icons === undefined ? {} : { icons }),
      })}</span>
    </span>`;
  }

  /**
   * A status page alone, as the watch draws it from the states now
   * (`renderStatusPagePicture`), with the same plain outline as a page: one
   * screen tall, cut with a fade when its rows go on past it.
   */
  private renderStatusThumb(entry: LibraryItem): TemplateResult {
    const hass = this.hassNow;
    const scale = PIC_W / PIC_SCREEN.width;
    const px = (n: number) => `${Math.round(n * 100) / 100}px`;
    const rows = Array.isArray(entry.item.rows) ? entry.item.rows.length : 0;
    // About as many rows as one screen holds before the fade is needed.
    const cut = rows > 5;
    return html`<span class="ap-pic ap-pic-status ${cut ? "cut" : ""}" style=${`width:${px(PIC_W)};height:${px(Math.min(PIC_SCREEN.height * scale, PIC_MAX_H))}`}>
      <span class="ap-pic-in">${hass === undefined ? nothing : renderStatusPagePicture({
        page: entry.item, hass, icons: this.icons ?? NO_PICTURE_ICONS, screen: PIC_SCREEN, scale,
      })}</span>
    </span>`;
  }

  /** The look the list tabs share (`list-tab-styles.ts`), a device tab's
   * rows (`library-list-styles.ts`), the ticks and the row pictures, then
   * this tab's own: New page, Multi select and its bar, and a page's
   * picture. */
  static override styles = [watchPagePreviewStyles, watchFrameStyles, statusPagesViewStyles, listTabStyles, libraryListStyles,
    libraryTicksStyles, rowPictureStyles, newItemDialogStyles, boardStyles, boardStackStyles, css`
    .ap-embed-saved { position: absolute; right: 0; top: -26px; }
    :host([embedded]) { position: relative; }
    /* New page: filled, as New complication is, the one way to start a page
       from this tab. On All it opens the New dialog (new-dialog.ts). */
    .ap-new { position: relative; flex: none; }
    .ap-new-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px; font-weight: 600;
      height: 30px; padding: 0 11px; border-radius: 8px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink);
    }
    .ap-new-btn:hover:not(:disabled) { filter: brightness(1.1); }
    .ap-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-new-btn:disabled { opacity: .45; cursor: default; }
    .ap-new-btn svg { width: 16px; height: 16px; }
    /* An empty library: how a page works, centered, with New page. */
    .ap-empty-lib { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px 16px; text-align: center; }
    .ap-empty-lib p { margin: 0; max-width: 40ch; font-size: 14px; line-height: 1.45; color: var(--wa-muted); }

    /* A status page's picture: the watch's black screen, one screen tall. */
    .ap-pic-status .sp-screen { pointer-events: none; }
    .pk-pick-btn {
      display: inline-flex; align-items: center; gap: 6px; flex: none; font: inherit; font-size: 12.5px;
      height: 28px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
      background: var(--wa-field); color: var(--wa-ink); cursor: pointer; font-weight: 600;
    }
    .pk-pick-btn:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .pk-pick-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-pick-btn:disabled { opacity: .45; cursor: default; }
    .pk-pick-btn svg { width: 14px; height: 14px; }
    .pk-pick-btn.on { border-color: transparent; background: var(--wa-seg-on); color: var(--wa-ink); }

    /* The panel's small buttons (form-styles.ts), for the bar. */
    button.small {
      display: inline-flex; align-items: center; gap: 5px;
      font: inherit; font-size: 13px; font-weight: 600; padding: 0 9px; min-height: 26px; border-radius: 6px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-field); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    button.small:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.small:disabled { opacity: .45; cursor: default; }
    button.small > svg { width: 13px; height: 13px; flex: none; }
    button.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }
    button.primary:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-primary-bg) 85%, var(--wa-muted)); }

    /* The bar under the tabs while cards are picked, the Complications
       list's. */
    .pk-bar {
      display: flex; align-items: center; flex-wrap: wrap; gap: 8px; flex: none;
      padding: 8px 18px; border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .pk-bar-count { font-size: 12px; color: var(--wa-muted); min-width: 90px; }
    .pk-bar-said { min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
    .pk-bar-said.ok { color: var(--wa-ok, var(--wa-ink)); }
    .pk-bar-said.warn, .pk-bar-said.err { color: var(--wa-need); }
    .pk-bar-ask { flex: 1 1 260px; min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
    .pk-bar-ask b { font-weight: 600; }
    .pk-bar-gap { flex: 1; min-width: 0; }
    .pk-bar button.ghost {
      font-size: 12.5px; min-height: 28px; padding: 0 10px; border-radius: 8px;
      border-color: var(--wa-line); background: var(--wa-panel); color: var(--wa-ink);
    }
    .pk-bar button.ghost:hover:not(:disabled), .pk-bar button.ghost.on { border-color: var(--wa-line-strong); background: var(--wa-card); }
    .pk-bar button.ghost.danger {
      color: var(--error-color, #b42318);
      border-color: color-mix(in srgb, var(--error-color, #b42318) 45%, var(--wa-line));
      background: color-mix(in srgb, var(--error-color, #b42318) 10%, var(--wa-panel));
    }
    .pk-bar button.ghost.danger:hover:not(:disabled) {
      background: color-mix(in srgb, var(--error-color, #b42318) 18%, var(--wa-panel));
    }
    .pk-bar button.ghost svg { width: 14px; height: 14px; color: var(--wa-muted); }
    .pk-bar button.ghost.danger svg { color: inherit; }
    .pk-bar-done { margin-left: 4px; }
    .pk-bar-done svg { width: 14px; height: 14px; }
    /* A card's tick while picking: a box, not the panel's switch. */
    input.pk-card-pick {
      appearance: none; -webkit-appearance: none; position: relative; flex: none; margin: 0; cursor: pointer;
      width: 17px; height: 17px; border-radius: 5px; border: 0;
      background: color-mix(in srgb, var(--wa-ink) 8%, transparent);
      box-shadow: inset 0 0 0 1.5px var(--wa-line-strong);
    }
    input.pk-card-pick::after {
      content: ""; position: absolute; top: 2px; left: 6px; width: 4px; height: 8.5px; opacity: 0;
      border: solid var(--wa-primary-ink, #fff); border-width: 0 2px 2px 0;
      transform: rotate(45deg); transition: opacity .1s ease-out;
    }
    input.pk-card-pick:checked { background: var(--wa-accent); box-shadow: inset 0 0 0 1.5px var(--wa-accent); }
    input.pk-card-pick:checked::after { opacity: 1; }
    input.pk-card-pick:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px var(--wa-accent); }
    input.pk-card-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    input.pk-card-pick:disabled { opacity: .45; cursor: default; }

    /* The page alone in a plain outline: no case, no clock, no page dots,
       no fold line. */
    .ap-pic {
      position: relative; display: block; max-width: 100%; overflow: hidden; line-height: 0; pointer-events: none;
      border-radius: 10px; box-shadow: 0 0 0 1px var(--wa-line-strong);
    }
    .ap-pic-in { display: block; }
    .ap-pic .wa-watch { padding: 0; margin: 0; background: none; box-shadow: none; border-radius: 0; }
    .ap-pic .wa-watch::before, .ap-pic .wa-watch::after { display: none; }
    .ap-pic .wa-watch > .wp-screen { border-radius: 0; }
    .ap-pic :is(.wp-clock, .wp-pages, .wp-fold) { display: none; }
    /* A page taller than the picture fades out at its foot. */
    .ap-pic.cut::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 36px;
      background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, .75));
    }
    /* Picking: every click on the card picks it, and a picked card wears
       the Complications card's ink ring. */
    .ap-card.picking { cursor: pointer; user-select: none; }
    .ap-card.picked { border-color: var(--wa-ink); box-shadow: 0 0 0 1px var(--wa-ink); }
    /* A phone: the bar folds with the head (\`listTabStyles\`). */
    @media (max-width: 640px) {
      .pk-bar { padding: 8px 10px; }
    }
  `];
}

if (!customElements.get("wa-all-pages")) customElements.define("wa-all-pages", WaAllPages);

declare global {
  interface HTMLElementTagNameMap {
    "wa-all-pages": WaAllPages;
  }
}
