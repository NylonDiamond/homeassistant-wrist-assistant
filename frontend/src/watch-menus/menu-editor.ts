// `<wa-menu-editor>`: one menu of the home's library (`library/`), edited in
// the library itself with no device (`library/item-mode.ts`), on
// `/library/menus/<id>`: an Anywhere menu with its style and the page
// switcher's, or the Entity quick menu with each entity's own menu.
//
// It wears the complication editor's chrome (`editor-chrome.ts`) the way the
// page editor does: the top bar, then three columns with drag gutters (the
// Menus and Slots cards, the canvas with the shown menu on the device, and
// the inspector). One menu at a time is in the canvas, picked in the Menus
// card, as the complication editor shows one page. The views are
// `menu-view.ts`.
//
// The menu is read with `library/item` and kept as raw JSON in a draft
// (`draft.ts`) under `libraryDraftKey`, with undo and redo, and saved with
// `library/item/save` over its revision, merging when another save landed
// too. Home Assistant maps a save onto every device that uses the menu.
//
// The menu is drawn on a device of the home ("Preview on"), which lends its
// `catalog`, `status_pages`, `pages`, `behavior` and `voice` records, read
// only, for the pickers' names and the page switcher's pages; the live line
// reads them again when they change. The home's HTTP action library
// (`watch-pages/http-library.ts`) is read when the preview device opens and
// on a reconnect; it has no live line.
//
// The foot of the menu's row in the Menus card names it (and offers Delete
// while no device uses it), and the strip under the canvas head says which
// devices use it (a round tick each, which moves that device to this menu).
//
// The panel loads this module on its own, with one `import()`, when it opens
// a library menu (`hook.ts`). Nothing it imports may import `icons.ts`.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 1 build
// contract", items 5 to 7), and docs/one_library_plan_2026-10.md, step 3.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { type ColumnWidths, beginColumnDrag, fitColumnWidths, loadColumnWidths, saveColumnWidths } from "../column-split.js";
import {
  canvasStyles,
  chromeTokens,
  columnStyles,
  inspectorStyles,
  leftCardStyles,
  rowListStyles,
  topBarStyles,
} from "../editor-chrome.js";
import { SCRUB_END, SCRUB_START } from "../editors.js";
import { formStyles } from "../form-styles.js";
import {
  type HassLike,
  type OwnerSummary,
  type WatchConfigRecord,
  fetchOwners,
  fetchHttpActions,
  fetchWatchConfig,
  subscribeWatchConfig,
} from "../ha-api.js";
import { live } from "lit/directives/live.js";
import { type LinkDevice, linkDevicesOf } from "../watch-pages/devices.js";
import { type MenuUnit, libraryErrorText } from "../library/client.js";
import {
  fetchLibraryRecord,
  libraryDraftKey,
  libraryItemIO,
  type LibraryItemRef,
  libraryModeStyles,
  libraryOwners,
  type PreviewKind,
  previewOwner,
  renderBarDevices,
  renderLibraryTag,
  renderPreviewPicker,
  sameLibraryItem,
  startPreviewKind,
  summaryRevision,
} from "../library/item-mode.js";
import { type LibraryMenu, MENU_UNIT_TITLES, libraryMenu, sameId } from "../library/model.js";
import { LibraryController } from "../library/store.js";
import { libraryTicksStyles, renderTicks } from "../library/ticks.js";
import { dirtyElsewhereText } from "../watch-pages/library-editing.js";
import { deviceColor, deviceColors } from "../device-colors.js";
import { type IconProvider, REFERENCE_CASE, caseForScreenSize } from "../renderer.js";
import { SymbolBrowser } from "../symbols.js";
import { uiIcon } from "../ui-icons.js";
import {
  type WatchCatalog,
  type WatchCatalogStatusPage,
  watchCatalogEventIsNews,
  watchCatalogFromRecord,
  watchCatalogReadMeansNone,
  watchStatusPagesFromRecord,
} from "../watch-pages/catalog.js";
import { type WatchHttpLibrary, readWatchHttpLibrary, watchCatalogWithHttpLibrary, watchHttpLibraryReadMeansNone } from "../watch-pages/http-library.js";
import { NO_ICONS, memoIconNames, watchKeysTypeText } from "../watch-pages/editor-host.js";
import { watchFrameStyles } from "../watch-frame.js";
import {
  PHONE_SIZE_TEXT,
  PHONE_STAGE_ZOOM,
  type PhonePagesLayout,
  phoneFrameStyles,
  phoneModelForScreenSize,
  phonePagesLayout,
  phonePagesScreen,
} from "../phone-frame.js";
import {
  isHiddenWatchPage,
  isJsonObject,
  isSmartWatchPage,
  isSystemWatchPage,
  watchPageId,
  watchPageName,
  watchPageTiles,
  watchPagesOf,
} from "../watch-pages/model.js";
import { type WatchPagesNote, watchCommandError } from "../watch-pages/save-note.js";
import { stageFitZoom, stageZoomIn, stageZoomLabel, stageZoomOut } from "../watch-pages/stage.js";
import { type SettingDevice, watchAppDevices, watchName } from "../watch-settings.js";
import {
  type WatchMenusDraft,
  anyWatchMenusDirty,
  dropAllWatchMenus,
  forgetWatchMenusDraft,
  keptWatchMenusDraft,
  saveWatchMenusDraft,
  takeWatchMenusRecord,
} from "./draft.js";
import { registerWatchMenusDrafts } from "./hook.js";
import {
  type MenuSwitcherPage,
  type MenuSwitcherRow,
  type MenusScreen,
  type MenusSection,
  type MenusViewHost,
  deselectMenuSlot,
  loadMenusZoom,
  menuSectionLabel,
  menuStageFacts,
  menuStageHint,
  librarySections,
  menuViewStyles,
  renderMenuInspector,
  renderMenusCard,
  renderSlotsCard,
  saveMenusZoom,
  showMenuSettings,
  shownMenu,
} from "./menu-view.js";
import {
  type MenuTargets,
  type MenusDocument,
  WATCH_MENUS_UPDATE_TEXT,
  asWatchMenusDocument,
  isMenuUUID,
  scrubWatchMenuOrphanTriggers,
} from "./model.js";
import { howToStyles } from "../screen-howto.js";
import { menuStageStyles, renderMenuHowTo, renderMenuStage, renderMenuStageFoot, renderMenuStageTools } from "./menu-stage.js";
import { watchMenusReplacedText, watchMenusSaveNote } from "./save-note.js";
import type { MenuVoiceContext } from "./slot-voice.js";
import { menuInspectorLookStyles } from "./menu-inspector-look.js";
import { voiceDocumentOfRecord, voicePhraseTargets, watchVoiceFallbacks } from "../watch-voice/defaults.js";

registerWatchMenusDrafts({ dirty: anyWatchMenusDirty, drop: dropAllWatchMenus });

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
    if (!anyWatchMenusDirty()) return;
    e.preventDefault();
    e.returnValue = "";
  });
}

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl+";

/** The Menus and Slots column and the inspector, each widened by dragging
 * the gutter beside it, with the page editor's limits and defaults. */
const ME_COLUMNS = { min: 200, max: 720, middleMin: 320 } as const;
const ME_COLUMNS_DEFAULT: ColumnWidths = { left: 280, right: 320 };
export const ME_COLUMNS_KEY = "wrist-assistant-panel.menus.columns.v1";
/** What a stage click may land on and still keep the selection: anything
 * that does something itself, and the dots and page labels on the watch. */
const STAGE_KEEPS_SELECTION = "button, a, input, select, textarea, label, [role=toolbar], .me-dot, .me-page";
/** The grid's own cost beside its three columns, CSS px: two 8px gutters and
 * the 2px gap on each side of each. */
const ME_GRID_CHROME = 2 * 8 + 4 * 2;
/** At or below this content width the columns stack and the top bar takes
 * two rows (the `@container` rules on `.layout.pe-layout` say the same). */
const ME_STACK_WIDTH = 820;

type Note = WatchPagesNote;

/** The menu name field while it is typed in: the menu it names and the
 * text, sent as a rename once typing stops (`MENU_RENAME_MS`). */
interface MenuNaming {
  menuId: string;
  value: string;
  /** Sent, and kept on screen until the library is read again. */
  sent?: boolean;
}

/** How long after the last keystroke a menu's new name is sent. */
export const MENU_RENAME_MS = 600;

/** The unit a section of the Menus card belongs to: the page switcher is
 * part of the Anywhere menu. */
export function menuUnitOf(menu: MenusSection): MenuUnit {
  return menu === "entity" ? "entity" : "anywhere";
}

interface HassConnectionEvents {
  addEventListener?(type: "ready", listener: () => void): void;
  removeEventListener?(type: "ready", listener: () => void): void;
}

function errText(err: unknown): string {
  return watchCommandError(err).message;
}

function errCode(err: unknown): string | undefined {
  return watchCommandError(err).code;
}

function isTextField(node: EventTarget | undefined): boolean {
  if (!(node instanceof HTMLElement)) return false;
  return watchKeysTypeText(node.tagName, node instanceof HTMLInputElement ? node.type : undefined, node.isContentEditable);
}

function nothingFocused(): boolean {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active === null || active === document.body || active === document.documentElement;
}

/** The pages a Go to Page slot can open, from the pages record: every page
 * with a UUID id that is not a system page, in watch order. */
export function watchMenuPageTargets(document: unknown): { id: string; name: string }[] {
  if (!isJsonObject(document)) return [];
  return watchPagesOf(document)
    .filter((p) => !isSystemWatchPage(p) && isMenuUUID(watchPageId(p)))
    .map((p) => ({ id: watchPageId(p), name: watchPageName(p) }));
}

/** The colors the watch's page switcher gives a page with no switcher color
 * of its own, by its place in the switcher (`PageSwitcherOverlay.swift`). */
export const WATCH_SWITCHER_COLORS: readonly string[] = ["#8FA8C4", "#9CB6A6", "#C8AE8E", "#A5B7CF", "#D8A3A0", "#A8BED5", "#CCD8E6", "#D8A3A0"];

function filled(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

/** The color a page left out of the switcher is listed in, having no place
 * there to take a color from. */
export const WATCH_SWITCHER_LEFT_OUT_COLOR = "#8E8E93";

/** Every page the watch's page switcher could show, from the pages record,
 * as it would draw them: every page not hidden and not a system page, in
 * watch order, those left out of the switcher marked `hidden`; by its
 * switcher text (else its name) or, set to icon, by its switcher icon (else
 * its first tile's, else the watch's stand-in); in its switcher color, else
 * the switcher's color for its place among the pages it shows. */
export function watchSwitcherRows(document: unknown): MenuSwitcherRow[] {
  if (!isJsonObject(document)) return [];
  let place = 0;
  return watchPagesOf(document)
    .filter((p) => !isHiddenWatchPage(p) && !isSystemWatchPage(p))
    .map((p) => {
      const hidden = p.hideFromSwitcher === true;
      const name = watchPageName(p);
      const icon = filled(p.switcherIcon) ?? filled(watchPageTiles(p)[0]?.icon) ?? (isSmartWatchPage(p) ? "bolt.fill" : "square.grid.2x2.fill");
      const byPlace = hidden ? WATCH_SWITCHER_LEFT_OUT_COLOR : WATCH_SWITCHER_COLORS[place++ % WATCH_SWITCHER_COLORS.length]!;
      const color = filled(p.switcherColor) ?? byPlace;
      const text = p.switcherDisplayMode === "icon" ? undefined : filled(p.switcherText) ?? name;
      return { id: watchPageId(p), name, icon, color, ...(text === undefined ? {} : { text }), hidden };
    });
}

/** The pages the watch's page switcher shows, as it draws them: the rows of
 * `watchSwitcherRows` not left out of it. */
export function watchSwitcherPages(document: unknown): MenuSwitcherPage[] {
  return watchSwitcherRows(document).filter((p) => !p.hidden).map(({ hidden: _, ...page }) => page);
}

export class WaMenuEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;
  /** The top bar offers Home Assistant's menu, as the panel's own bar does on
   * a phone or with the sidebar hidden (`hook.ts`). */
  @property({ attribute: false }) haMenu = false;
  @property({ attribute: false }) onHaMenu?: () => void;
  /** Back to the Menus tab. */
  @property({ attribute: false }) onBack?: () => void;
  /** The panel's own buttons for the bar's right end. */
  @property({ attribute: false }) barActions: TemplateResult | typeof nothing = nothing;
  /** The home keeps phone pages (`phone-pages.ts`): an iPhone is a device
   * the menu can be drawn on and used by too. */
  @property({ attribute: false }) phones = false;
  /** The one menu edited (`library/item-mode.ts`), in the library with no
   * device. `watchId` is only the device it is drawn on ("Preview on"),
   * which also lends its catalog, behavior, voice, status pages and pages;
   * the draft is kept under `libraryDraftKey`, and only the menu's own unit
   * is shown and saved. Nothing opens without it. */
  @property({ attribute: false }) libraryItem: LibraryItemRef | undefined = undefined;

  @state() private watchId?: string;
  /** The library menu open now. */
  private openedItem?: LibraryItemRef;
  /** The preview kind was picked with the library read. */
  private previewSettled = false;
  /** The summary revision a quiet read was last asked for. */
  private followedRevision?: number;
  /** The library menu whose unit the Menus card was turned to. */
  private shownUnitFor?: string;
  /** Delete asks first, in the menu's row. */
  @state() private menuDeleteAsk = false;
  @state() private record?: WatchConfigRecord;
  @state() private catalog?: WatchCatalog;
  /** The watch's own status pages (the `status_pages` record), which the
   * Show Status Page target lists before the iPhone's; undefined while Home
   * Assistant holds none or before the first read. */
  @state() private statusPages?: WatchCatalogStatusPage[];
  /** The home's HTTP action library (`http-library.ts`), the same for every
   * device, read when the preview device opens and on a reconnect (it has
   * no live line);
   * undefined before the first read and with an integration older than it. */
  @state() private httpLibrary?: WatchHttpLibrary;
  private httpLibrarySeq = 0;
  /** The preview device's pages record as last read: its revision (0 for
   * none) and the document. Undefined before the first read. */
  @state() private pagesRecord?: { revision: number; document: unknown };
  /** The watch's behavior settings, read only. The Entity quick menu's
   * gestures live there; batch 1 shows none of them. */
  @state() private behavior?: Readonly<Record<string, unknown>>;
  /** The watch's voice settings (the `voice` record), read only: its phrases
   * for Speak Phrase and Pick from List, its defaults behind a slot's voice.
   * Undefined while there is none, before the read, and after a failed one. */
  @state() private voiceDocument?: Readonly<Record<string, unknown>>;
  private voiceSeq = 0;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private note?: Note;
  @state() private ownList?: readonly OwnerSummary[];
  /** The top bar's ··· menu is open. */
  @state() private topMenuOpen = false;
  /** The library (`library/store.ts`): every menu once, its name and the
   * devices that use it, read from `library/summary` and read again when a
   * device's menus change. Undefined before the first read and on an
   * integration older than the library, which leaves the name and Used by
   * off. */
  private readonly lib = new LibraryController(this, () => this.hass, () => this.linkDevices.map((d) => d.ownerId));
  /** The menu name field while it is typed in. */
  @state() private naming?: MenuNaming;
  private renameTimer?: ReturnType<typeof setTimeout>;
  /** What the library line said after its last write (a delete). */
  @state() private libNote?: Note;
  /** The stage's scale as stepped with the zoom buttons, undefined while it
   * fits (`stageFitZoom`). Remembered between visits (`MENUS_ZOOM_KEY`). */
  @state() private zoom = loadMenusZoom();
  /** The side columns' widths as dragged (a preference, saved), and the
   * host's measured content width and height, which fit them and cap the
   * self-scrolling columns. Zero before the first measurement. */
  @state() private columns: ColumnWidths = { ...ME_COLUMNS_DEFAULT };
  @state() private hostWidth = 0;
  @state() private hostHeight = 0;
  private ownListAsked = false;
  private sizeObserver?: ResizeObserver;
  /** The sticky block at the top (the bar and a note under it) the observer
   * measures, and its height, written to `--pe-top-h` on the host for the
   * sticky columns under it. */
  private observedTop?: HTMLElement;
  private topHeight = 0;

  private readonly symbols = new SymbolBrowser(() => this.requestUpdate());
  private readonly uiState = new Map<string, unknown>();
  private iconMemo?: { provider: IconProvider; tick: number; icons: IconProvider };
  /** The coalesce key of a drag on a number field running now. */
  private scrubKey?: string;
  private scrubSeq = 0;
  private reloadPending = false;
  private followedSave?: Promise<unknown>;
  private loadSeq = 0;
  private catalogSeq = 0;
  private statusPagesSeq = 0;
  private pagesSeq = 0;
  private behaviorSeq = 0;
  private subscribeSeq = 0;
  private unsubscribe?: () => Promise<void>;
  private readyConnection?: HassConnectionEvents;

  private get watches(): OwnerSummary[] {
    return watchAppDevices(this.owners.length > 0 ? this.owners : (this.ownList ?? []), this.phones);
  }

  /** The device drawn on, for the lines that name it: Preview on decides,
   * so an iPhone is drawn with no iPhone in the home too. */
  private get device(): SettingDevice {
    return this.previewKind;
  }

  /** Preview on: the kind of device drawn on. `watchId` is then the home's
   * first device of that kind, or undefined with none. */
  @state() private previewKind: PreviewKind = "watch";

  /** The menu being edited. Made from the record when none is kept (the
   * panel's leave guard may have dropped it); none for a record this panel
   * cannot read. */
  private get draft(): WatchMenusDraft | undefined {
    const key = this.recordKey;
    const record = this.record;
    if (key === undefined || record === undefined || record.revision <= 0) return undefined;
    const kept = keptWatchMenusDraft(key);
    if (kept !== undefined) return kept;
    const document = asWatchMenusDocument(record.document);
    return document === undefined ? undefined : takeWatchMenusRecord(key, document, record.revision).draft;
  }

  /** What the menu's record and its kept draft are keyed by: the menu's
   * `libraryDraftKey`. */
  private get recordKey(): string | undefined {
    return this.libraryItem === undefined ? undefined : libraryDraftKey(this.libraryItem);
  }

  /** The menu's unit, from the summary: undefined before it is read. */
  private get libraryUnit(): MenuUnit | undefined {
    const item = this.libraryItem;
    const lib = this.lib.library;
    return item === undefined || lib === undefined ? undefined : libraryMenu(lib, item.id)?.unit;
  }

  /** The preview device's pages, read only. */
  private get pagesDocument(): unknown {
    const record = this.pagesRecord;
    return record !== undefined && record.revision > 0 ? record.document : undefined;
  }

  /** The pages a Go to Page slot can open, worked out on every draw. */
  private get pages(): { id: string; name: string }[] {
    return watchMenuPageTargets(this.pagesDocument);
  }

  /** The draft is being saved: every field is drawn off then. */
  private get saving(): boolean {
    const key = this.recordKey;
    if (key === undefined) return false;
    return keptWatchMenusDraft(key)?.saving ?? false;
  }

  /** Unsaved edits to the menu: the Save button and Discard edits. */
  private get dirty(): boolean {
    return this.draft?.dirty ?? false;
  }

  private get holdReload(): boolean {
    return this.saving || this.scrubKey !== undefined;
  }

  constructor() {
    super();
    this.addEventListener(SCRUB_START, this.onScrubStart);
    this.addEventListener(SCRUB_END, this.onScrubEnd);
    this.addEventListener("focusout", () => {
      this.draft?.endCoalesce();
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointerdown", this.onWindowPointerDown, true);
    this.columns = loadColumnWidths(ME_COLUMNS_KEY, ME_COLUMNS_DEFAULT, ME_COLUMNS);
    this.watchSize();
    this.listenForReconnect();
    if (this.openedItem !== undefined) {
      this.openPreview(this.watchId);
      this.openItem(true);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("pointerdown", this.onWindowPointerDown, true);
    this.sizeObserver?.disconnect();
    this.observedTop = undefined;
    this.stopListeningForReconnect();
    this.reloadPending = false;
    this.endScrub();
    this.endSubscription();
    this.loadSeq++;
    this.catalogSeq++;
    this.statusPagesSeq++;
    this.httpLibrarySeq++;
    this.pagesSeq++;
    this.behaviorSeq++;
    this.voiceSeq++;
    this.flushRename();
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (this.hass) {
      if (changed.has("hass")) this.listenForReconnect();
      if (this.owners.length === 0 && !this.ownListAsked) {
        this.ownListAsked = true;
        fetchOwners(this.hass).then(
          (reply) => { this.ownList = reply.owners; },
          () => { this.ownList = []; },
        );
      }
      if (this.libraryItem !== undefined) this.followLibraryItem(this.libraryItem);
    }
    this.followSave();
  }

  protected override updated(): void {
    this.observeTop();
  }

  /** Measure the host, not the window: the Home Assistant sidebar changes
   * the editor's width without changing the window's. Its height caps the
   * side columns, which scroll on their own past it. The sticky top block is
   * measured by the same observer. */
  private watchSize(): void {
    if (typeof ResizeObserver === "undefined") return;
    this.sizeObserver ??= new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== this) {
          this.measureTop(entry.target as HTMLElement);
          continue;
        }
        const box = entry.contentRect;
        if (Math.abs(box.width - this.hostWidth) >= 1) this.hostWidth = box.width;
        if (Math.abs(box.height - this.hostHeight) >= 1) this.hostHeight = box.height;
      }
    });
    this.sizeObserver.observe(this);
    this.observeTop();
  }

  /** Watch the sticky top block's height; after every draw, since a
   * reconnect starts the observer over. Nothing to do for the same block. */
  private observeTop(): void {
    const observer = this.sizeObserver;
    if (observer === undefined) return;
    const top = this.renderRoot?.querySelector<HTMLElement>(".pe-top") ?? undefined;
    if (top === this.observedTop) return;
    if (this.observedTop !== undefined) observer.unobserve(this.observedTop);
    this.observedTop = top;
    if (top !== undefined) observer.observe(top);
  }

  /** The top block's whole height onto the host, for CSS: no draw follows. */
  private measureTop(top: HTMLElement): void {
    const height = top.offsetHeight;
    if (height === this.topHeight) return;
    this.topHeight = height;
    this.style.setProperty("--pe-top-h", `${height}px`);
  }

  private listenForReconnect(): void {
    const connection = this.hass?.connection as unknown as HassConnectionEvents | undefined;
    if (connection === this.readyConnection) return;
    this.stopListeningForReconnect();
    if (!this.isConnected || typeof connection?.addEventListener !== "function") return;
    connection.addEventListener("ready", this.onReconnect);
    this.readyConnection = connection;
  }

  private stopListeningForReconnect(): void {
    this.readyConnection?.removeEventListener?.("ready", this.onReconnect);
    this.readyConnection = undefined;
  }

  private onReconnect = (): void => {
    const key = this.recordKey;
    if (this.isConnected && key !== undefined) void this.load(key, true);
    const watchId = this.watchId;
    if (!this.isConnected || watchId === undefined) return;
    void this.loadCatalog(watchId);
    void this.loadHttpLibrary();
    void this.loadStatusPages(watchId);
    void this.loadPages(watchId);
    void this.loadBehavior(watchId);
    void this.loadVoice(watchId);
    void this.lib.store?.refresh();
  };

  private followSave(): void {
    const key = this.recordKey;
    if (key === undefined) return;
    const done = keptWatchMenusDraft(key)?.saveDone;
    if (done === undefined || done === this.followedSave) return;
    this.followedSave = done;
    const ended = (): void => this.saveEnded(key);
    void done.then(ended, ended);
  }

  private saveEnded(key: string): void {
    this.requestUpdate();
    if (!this.isConnected) return;
    if (key === this.recordKey) {
      this.reloadPending = false;
      void this.load(key, true);
    } else {
      this.flushPending();
    }
  }

  // ── the library menu ───────────────────────────────────────────────────

  /** The preview device (the shown one while it is in the
   * home, else the remembered one, else the first watch), the menu read
   * when it changes, the Menus card turned to its unit once the summary
   * names it, and the menu read again quietly once the summary says it
   * moved on elsewhere. */
  private followLibraryItem(ref: LibraryItemRef): void {
    // The kind is decided once per item, when the library says who has it.
    const owners = libraryOwners(this.lib.library, ref);
    if (!sameLibraryItem(ref, this.openedItem) || !this.previewSettled) {
      this.previewKind = startPreviewKind(this.watches, ref, owners);
      this.previewSettled = owners !== undefined;
    }
    const preview = previewOwner(this.watches, this.previewKind, [ref.from, ...(owners ?? [])]);
    if (preview !== this.watchId || (preview === undefined && this.openedItem === undefined)) this.openPreview(preview);
    if (!sameLibraryItem(ref, this.openedItem)) {
      this.openedItem = ref;
      this.openItem();
    }
    const key = libraryDraftKey(ref);
    const unit = this.libraryUnit;
    if (unit !== undefined && this.shownUnitFor !== key) {
      this.shownUnitFor = key;
      showMenuSettings({ uiState: this.uiState, requestUpdate: () => this.requestUpdate() }, unit);
    }
    const moved = summaryRevision(this.lib.library, ref);
    const shown = this.record?.revision;
    if (moved !== undefined && shown !== undefined && moved > shown && moved !== this.followedRevision) {
      this.followedRevision = moved;
      void this.load(key, true);
    }
  }

  /** Preview on: the kind picked, drawn on the home's first device of it. */
  private pickPreview(kind: PreviewKind): void {
    this.previewKind = kind;
    this.openPreview(previewOwner(this.watches, kind, [this.libraryItem?.from, ...(libraryOwners(this.lib.library, this.libraryItem!) ?? [])]));
  }

  /** The device to draw on: its catalog, HTTP actions, status pages, pages,
   * behavior and voice are read and followed, for the slot pickers and the
   * page switcher. Its menus are never read. */
  private openPreview(watchId: string | undefined): void {
    this.watchId = watchId;
    this.catalog = undefined;
    this.catalogSeq++;
    this.statusPages = undefined;
    this.statusPagesSeq++;
    this.pagesRecord = undefined;
    this.pagesSeq++;
    this.behavior = undefined;
    this.behaviorSeq++;
    this.voiceDocument = undefined;
    this.voiceSeq++;
    if (watchId === undefined) this.endSubscription();
    else this.startSubscription(watchId);
    this.loadContext(watchId);
  }

  /** Open the library menu: its record read, a fresh screen unless quiet. */
  private openItem(quiet = false): void {
    const key = this.recordKey;
    if (key === undefined) return;
    if (!quiet) {
      this.reloadPending = false;
      this.note = undefined;
      this.flushRename();
      this.libNote = undefined;
      this.menuDeleteAsk = false;
      this.endScrub();
      this.uiState.clear();
      this.shownUnitFor = undefined;
      this.followedRevision = undefined;
    }
    void this.load(key, quiet);
  }

  // ── loading ────────────────────────────────────────────────────────────

  /** What the slot pickers and the page switcher read beside the menu: the
   * home's HTTP actions, and the preview device's catalog, status pages,
   * pages, behavior and voice (none of those with no device to draw on). */
  private loadContext(watchId: string | undefined): void {
    void this.loadHttpLibrary();
    if (watchId === undefined) return;
    void this.loadCatalog(watchId);
    void this.loadStatusPages(watchId);
    void this.loadPages(watchId);
    void this.loadBehavior(watchId);
    void this.loadVoice(watchId);
  }

  private async loadVoice(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.voiceSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "voice");
      if (seq !== this.voiceSeq || watchId !== this.watchId) return;
      this.voiceDocument = voiceDocumentOfRecord(record);
    } catch {
      if (seq !== this.voiceSeq || watchId !== this.watchId) return;
      this.voiceDocument = undefined;
    }
  }

  /** The voice settings as the slot editors read them. */
  private voiceContext(): MenuVoiceContext {
    const document = this.voiceDocument;
    return {
      phrases: document === undefined ? undefined : voicePhraseTargets(document),
      defaults: watchVoiceFallbacks(document, this.catalog),
    };
  }

  private async loadCatalog(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.catalogSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "catalog");
      if (seq !== this.catalogSeq || watchId !== this.watchId) return;
      this.catalog = watchCatalogFromRecord(record);
    } catch (error) {
      if (seq !== this.catalogSeq || watchId !== this.watchId) return;
      if (watchCatalogReadMeansNone(error)) this.catalog = undefined;
    }
  }

  /** The home's HTTP action library, for the Run HTTP Action target. An
   * integration older than it does not know the command: none, and the
   * target lists the iPhone's catalog alone. Any other failure keeps what
   * is shown. Only the newest read lands. */
  private async loadHttpLibrary(): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.httpLibrarySeq;
    try {
      const record = await fetchHttpActions(hass);
      if (seq !== this.httpLibrarySeq) return;
      this.httpLibrary = readWatchHttpLibrary(record);
    } catch (error) {
      if (seq !== this.httpLibrarySeq) return;
      if (watchHttpLibraryReadMeansNone(error)) this.httpLibrary = undefined;
    }
  }

  /** The watch's own status pages, for the Show Status Page target. An
   * integration too old for the kind refuses it: none, and the iPhone's list
   * stands. Any other failure keeps what is shown. */
  private async loadStatusPages(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.statusPagesSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "status_pages");
      if (seq !== this.statusPagesSeq || watchId !== this.watchId) return;
      this.statusPages = watchStatusPagesFromRecord(record);
    } catch (error) {
      if (seq !== this.statusPagesSeq || watchId !== this.watchId) return;
      if (watchCatalogReadMeansNone(error)) this.statusPages = undefined;
    }
  }

  private async loadPages(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.pagesSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "pages");
      if (seq !== this.pagesSeq || watchId !== this.watchId) return;
      // Only read: the preview device's kept page draft is never touched.
      this.pagesRecord = { revision: record.revision, document: record.document };
    } catch {
      // A failed read keeps the pages shown: the picker still saves ids.
    }
  }

  private async loadBehavior(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.behaviorSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "behavior");
      if (seq !== this.behaviorSeq || watchId !== this.watchId) return;
      this.behavior = record.revision > 0 && isJsonObject(record.document) ? record.document : undefined;
    } catch {
      if (seq !== this.behaviorSeq || watchId !== this.watchId) return;
      this.behavior = undefined;
    }
  }

  /** Read the menu (`library/item`) into the draft kept under `key`, its
   * `libraryDraftKey`. A quiet read keeps the screen as it is meanwhile, and
   * waits while a save or a drag is out. */
  private async load(key: string, quiet = false): Promise<void> {
    const hass = this.hass;
    const item = this.libraryItem;
    if (!hass || item === undefined) return;
    if (quiet && this.holdReload) {
      this.reloadPending = true;
      return;
    }
    const seq = ++this.loadSeq;
    if (!quiet) {
      this.record = undefined;
      this.loading = true;
      this.loadError = undefined;
    }
    try {
      const record = await fetchLibraryRecord(hass, item);
      if (seq !== this.loadSeq) return;
      if (quiet && this.holdReload) {
        this.reloadPending = true;
        return;
      }
      this.show(key, record);
      this.loadError = undefined;
    } catch (err) {
      if (seq !== this.loadSeq) return;
      if (!quiet) this.loadError = libraryErrorText(err);
    }
    this.loading = false;
  }

  private flushPending(): void {
    const key = this.recordKey;
    if (!this.reloadPending || this.holdReload || key === undefined) return;
    this.reloadPending = false;
    void this.load(key, true);
  }

  private show(key: string, record: WatchConfigRecord): void {
    this.record = record;
    const document = record.revision > 0 ? asWatchMenusDocument(record.document) : undefined;
    if (document === undefined) return;
    const taken = takeWatchMenusRecord(key, document, record.revision);
    if (taken.replaced.length > 0) this.note = { kind: "warn", text: watchMenusReplacedText(taken.replaced) };
    else if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The menus changed somewhere else. Your edits are kept." };
    this.requestUpdate();
  }

  /** Hear every save of the preview device's config: `catalog`,
   * `status_pages`, `pages`, `behavior` and `voice` are read again for the
   * pickers. Its own `menus` are not what is open. */
  private startSubscription(watchId: string): void {
    const hass = this.hass;
    this.endSubscription();
    if (!hass) return;
    const seq = ++this.subscribeSeq;
    subscribeWatchConfig(hass, watchId, (event) => {
      if (seq !== this.subscribeSeq) return;
      if (event.kind === "catalog") {
        if (watchCatalogEventIsNews(event, this.catalog)) void this.loadCatalog(watchId);
      } else if (event.kind === "status_pages") {
        void this.loadStatusPages(watchId);
      } else if (event.kind === "pages") {
        void this.loadPages(watchId);
      } else if (event.kind === "behavior") {
        void this.loadBehavior(watchId);
      } else if (event.kind === "voice") {
        void this.loadVoice(watchId);
      }
    }).then(
      (unsubscribe) => {
        if (seq === this.subscribeSeq) this.unsubscribe = unsubscribe;
        else void unsubscribe().catch(() => undefined);
      },
      () => undefined,
    );
  }

  private endSubscription(): void {
    this.subscribeSeq++;
    const unsubscribe = this.unsubscribe;
    this.unsubscribe = undefined;
    void unsubscribe?.().catch(() => undefined);
  }

  // ── editing ────────────────────────────────────────────────────────────

  private edit(change: (document: MenusDocument) => MenusDocument, coalesce?: string): boolean {
    const draft = this.draft;
    if (!draft || this.saving) return false;
    const changed = draft.apply(change(draft.document), this.scrubKey ?? coalesce);
    // A refused edit draws too, so a field that shows its own new value (a
    // select) goes back to the document's.
    this.requestUpdate();
    return changed;
  }

  private onScrubStart = (e: Event): void => {
    e.stopPropagation();
    this.endScrub();
    this.draft?.endCoalesce();
    this.scrubKey = `scrub:${++this.scrubSeq}`;
    window.addEventListener("pointerup", this.onScrubPointerUp, true);
    window.addEventListener("pointercancel", this.onScrubPointerUp, true);
  };

  private onScrubEnd = (e: Event): void => {
    e.stopPropagation();
    this.endScrub();
  };

  private onScrubPointerUp = (): void => {
    this.endScrub();
  };

  private endScrub(): void {
    window.removeEventListener("pointerup", this.onScrubPointerUp, true);
    window.removeEventListener("pointercancel", this.onScrubPointerUp, true);
    if (this.scrubKey === undefined) return;
    this.scrubKey = undefined;
    this.draft?.endCoalesce();
    this.flushPending();
  }

  private memoIcons(): IconProvider {
    const provider = this.icons ?? NO_ICONS;
    const memo = this.iconMemo;
    if (memo !== undefined && memo.provider === provider && memo.tick === this.iconsTick) return memo.icons;
    const icons = memoIconNames(provider);
    this.iconMemo = { provider, tick: this.iconsTick, icons };
    return icons;
  }

  private targets(): MenuTargets {
    return {
      pages: this.pages,
      // The watch's own status pages first, else the iPhone's list.
      statusPages: this.statusPages ?? this.catalog?.statusPages ?? [],
      // The home's library first, then the iPhone's own.
      httpActions: watchCatalogWithHttpLibrary(this.catalog, this.httpLibrary)?.httpActions ?? [],
      // Unknown, not empty, while Home Assistant holds no voice settings: a
      // Speak Phrase slot's phrase may well be on the iPhone.
      phrases: this.voiceDocument === undefined ? undefined : voicePhraseTargets(this.voiceDocument),
    };
  }

  /** The open watch's screen in points, as the page editor finds it: the
   * size the watch reported, else the 46 mm reference. */
  private screen(): MenusScreen {
    const phone = this.phoneLayout();
    if (phone !== undefined) return phonePagesScreen(phone);
    const owner = this.watches.find((w) => w.owner_watch_id === this.watchId);
    return (caseForScreenSize(owner?.screen_size) ?? REFERENCE_CASE).screen;
  }

  /** On an iPhone, where its pages screen lays itself out: the menus open over
   * its pages area (`phone-frame.ts`). Undefined on a watch. */
  private phoneLayout(): PhonePagesLayout | undefined {
    if (this.device !== "iphone") return undefined;
    const owner = this.watches.find((w) => w.owner_watch_id === this.watchId);
    return phonePagesLayout(phoneModelForScreenSize(owner?.screen_size));
  }

  private viewHost(): MenusViewHost | undefined {
    const draft = this.draft;
    const hass = this.hass;
    if (draft === undefined || hass === undefined) return undefined;
    const self = this;
    // The preview device's pages, read only: no page's switcher settings
    // are edited here.
    const rows = watchSwitcherRows(this.pagesDocument);
    return {
      hass,
      icons: this.memoIcons(),
      symbols: this.symbols,
      uiState: this.uiState,
      screen: this.screen(),
      // An iPhone is drawn at half the watch's zoom, so the taller phone fits.
      scale: this.phoneLayout() === undefined ? this.stageScale : this.stageScale * PHONE_STAGE_ZOOM,
      ...(this.phoneLayout() === undefined ? {} : { phone: this.phoneLayout() }),
      switcherPages: rows.filter((p) => !p.hidden).map(({ hidden: _, ...page }) => page),
      switcherRows: rows,
      menuFoot: (menu) => (menu === "switcher" ? nothing : this.libraryHead(menu)),
      menuBadge: (menu) => this.menuBadge(menu),
      ...(this.libraryUnit === undefined ? {} : { sections: librarySections(this.libraryUnit) }),
      get document() { return draft.document; },
      get targets() { return self.targets(); },
      get catalogKnown() { return self.catalog !== undefined; },
      get httpLibrary() { return self.httpLibrary === undefined ? undefined : self.httpLibrary.revision > 0 ? "held" as const : "empty" as const; },
      get statusPagesKnown() { return self.statusPages !== undefined; },
      get voice() { return self.voiceContext(); },
      get device() { return self.device; },
      get busy() { return self.saving; },
      edit: (change, coalesce) => this.draft === draft && this.edit(change, coalesce),
      endCoalesce: () => draft.endCoalesce(),
      requestUpdate: () => this.requestUpdate(),
    };
  }

  private undo(): void {
    if (this.draft?.undo()) this.requestUpdate();
  }

  private redo(): void {
    if (this.draft?.redo()) this.requestUpdate();
  }

  /** Back to the copy Home Assistant holds, as one step undo takes back. */
  private discard(): void {
    if (this.saving) return;
    if (this.draft?.discard() ?? false) {
      this.note = { kind: "ok", text: "Edits discarded. Undo brings them back." };
      this.requestUpdate();
    }
  }

  /** Save the menu's edits; the note says how it ended. */
  private async save(): Promise<void> {
    const hass = this.hass;
    const key = this.recordKey;
    this.endScrub();
    const draft = this.draft;
    if (!hass || key === undefined || !draft || this.saving || !draft.dirty) return;
    this.note = undefined;
    const note = await this.saveMenus(hass, key, draft);
    if (key === this.recordKey) this.note = note;
  }

  /** Save the menu's draft with `library/item/save` over its revision
   * (`libraryItemIO`); the note for how it ended, or none. */
  private async saveMenus(hass: HassLike, key: string, draft: WatchMenusDraft): Promise<Note | undefined> {
    const item = this.libraryItem;
    if (item === undefined) return undefined;
    const running = saveWatchMenusDraft(draft, { prepare: scrubWatchMenuOrphanTriggers, ...libraryItemIO(hass, this.lib.store, item) });
    this.followedSave = draft.saveDone;
    this.requestUpdate();
    const result = await running.catch((err: unknown) => ({
      ok: false,
      revision: draft.revision,
      merged: false,
      code: errCode(err) ?? "unknown",
      message: errText(err),
    }));
    this.saveEnded(key);
    return watchMenusSaveNote(result);
  }

  // ── the library: the menu's name, Used by, Delete ──────────────────────

  /** Every device a menu can be used by (`watch-pages/devices.ts`): the Watch app's
   * devices, the watches and, on a home that keeps phone pages, the
   * iPhones, which have menus too. */
  private get linkDevices(): LinkDevice[] {
    return linkDevicesOf(this.owners.length > 0 ? this.owners : (this.ownList ?? []), this.phones);
  }

  /** The menu open, for its own unit's rows: none for another unit's,
   * before the library is read, and on an integration older than it. */
  private libraryMenuOf(menu: MenusSection): LibraryMenu | undefined {
    const lib = this.lib.library;
    const item = this.libraryItem;
    if (item === undefined || lib === undefined) return undefined;
    const open = libraryMenu(lib, item.id);
    return open?.unit === menuUnitOf(menu) ? open : undefined;
  }

  /** The badge on a menu's row in the Menus card: the menu's own name, when
   * it has one ("Home menu"). */
  private menuBadge(menu: MenusSection): string | undefined {
    if (menu === "switcher") return undefined;
    const used = this.libraryMenuOf(menu);
    return used === undefined || used.name === MENU_UNIT_TITLES[used.unit] ? undefined : used.name;
  }

  /** The name field as typed: sent as a rename once typing stops. */
  private typeMenuName(menuId: string, value: string): void {
    this.naming = { menuId, value };
    if (this.renameTimer !== undefined) clearTimeout(this.renameTimer);
    this.renameTimer = setTimeout(() => this.flushRename(), MENU_RENAME_MS);
  }

  /**
   * Send the typed name (`library/menus/rename`), trimmed. An empty name is
   * not sent: the field shows the menu's name again. The typed name stays
   * on screen until the library is read again after the rename, so the
   * field never flickers back to the old one.
   */
  private flushRename(): void {
    if (this.renameTimer !== undefined) clearTimeout(this.renameTimer);
    this.renameTimer = undefined;
    const naming = this.naming;
    if (naming === undefined || naming.sent === true) return;
    const store = this.lib.store;
    const lib = this.lib.library;
    const name = naming.value.trim();
    const menu = lib === undefined ? undefined : lib.index.menus.get(naming.menuId.toUpperCase());
    if (store === undefined || name === "" || menu === undefined || menu.name === name) {
      this.naming = undefined;
      return;
    }
    const sent: MenuNaming = { menuId: naming.menuId, value: name, sent: true };
    this.naming = sent;
    void store.renameMenu(naming.menuId, name).then(() => {
      if (this.naming === sent) this.naming = undefined;
    });
  }

  /** Let go of the typed name unsent. */
  private cancelRename(): void {
    if (this.renameTimer !== undefined) clearTimeout(this.renameTimer);
    this.renameTimer = undefined;
    this.naming = undefined;
  }

  /** Why another device's tick cannot be clicked now: a kept menus draft of
   * that device in this tab holds unsaved edits, which would land on this
   * menu. No device is "here": the preview device ticks as any other. */
  private menuTickLocked(ownerId: string): string | undefined {
    if (!(keptWatchMenusDraft(ownerId)?.dirty ?? false)) return undefined;
    return dirtyElsewhereText(this.linkDevices.find((d) => sameId(d.ownerId, ownerId))?.name ?? "that device");
  }

  /**
   * The foot of the menu's row in the Menus card (Jesse, 2026-10-17: with
   * the menu, not in the inspector): the menu's name ("Home menu") and,
   * for a menu no device uses, Delete. The devices that use it are in the
   * strip under the canvas head (`renderStageDevices`), as in every editor.
   * Clicks in it stop at the row, which picks the menu on a click. Nothing
   * before the library is read.
   */
  private libraryHead(menu: MenusSection): TemplateResult | typeof nothing {
    const used = this.libraryMenuOf(menu);
    const store = this.lib.store;
    if (used === undefined || store === undefined || this.recordKey === undefined) return nothing;
    const title = MENU_UNIT_TITLES[used.unit];
    const naming = this.naming !== undefined && sameId(this.naming.menuId, used.id) ? this.naming : undefined;
    const note = store.noteFor("menus", used.id);
    return html`<div class="me-lib" role="group" aria-label=${title} @click=${(e: Event) => e.stopPropagation()}>
      <label class="me-lib-name"><span class="me-lib-h">Name</span>
        <input type="text" class="me-lib-input" aria-label=${`${title} name`} placeholder=${title} maxlength="80"
          .value=${live(naming?.value ?? used.name)}
          @input=${(e: InputEvent) => this.typeMenuName(used.id, (e.target as HTMLInputElement).value)}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter") { e.preventDefault(); this.flushRename(); }
            else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); this.cancelRename(); }
          }}
          @blur=${() => this.flushRename()} />
      </label>
      ${this.renderLibraryDelete(used)}
      ${note === undefined ? nothing : html`<p class="me-lib-note err" role="alert">${note}</p>`}
      ${this.libNote === undefined ? nothing : html`<p class="me-lib-note ${this.libNote.kind}" role="status">${this.libNote.text}</p>`}
    </div>`;
  }

  /** The menu's tick row: Used by with a round tick per device (a device
   * uses one menu of each kind, so a tick moves that device to this menu;
   * the ticked ones cannot be unticked). In the strip under the canvas head
   * the question and the count say it, so the row's own words are left off
   * there. */
  private menuTicks(used: LibraryMenu, inBar = false): TemplateResult {
    const store = this.lib.store!;
    const admin = this.hass?.user?.is_admin;
    return renderTicks({
      library: this.lib.library!,
      kind: "menus",
      itemId: used.id,
      ...(this.libraryItem?.from === undefined ? {} : { viewing: this.libraryItem.from }),
      devices: this.linkDevices,
      colorOf: (ownerId) => this.colorOf(ownerId),
      pending: store.pending,
      ...(admin === undefined ? {} : { admin }),
      ...(inBar ? { hint: false as const } : {}),
      locked: (ownerId) => this.menuTickLocked(ownerId),
    }, (ownerId) => { void store.pickMenu(ownerId, used.unit, used.id); });
  }

  /** The menu's devices, in the strip under the canvas head where every
   * editor has them: how many devices use the menu, then its round ticks.
   * Nothing before the library or the menu are read. */
  private renderStageDevices(): TemplateResult | typeof nothing {
    const item = this.libraryItem;
    const lib = this.lib.library;
    const used = item === undefined || lib === undefined ? undefined : libraryMenu(lib, item.id);
    if (used === undefined || this.lib.store === undefined || this.draft === undefined) return nothing;
    return renderBarDevices("menus", used.owners.length, this.menuTicks(used, true), this.lib.store?.savedStamp("menus", used.id));
  }

  /** Delete from the library, for a menu no device uses (a
   * menu in use is refused `in_use`, so it is not offered): asked first,
   * then the way is back to the Menus tab. */
  private renderLibraryDelete(menu: LibraryMenu): TemplateResult | typeof nothing {
    if (menu.owners.length > 0) {
      return html`<p class="me-lib-hint">A save changes it on every device that uses it. To delete it, pick another menu for each of them first.</p>`;
    }
    if (!this.menuDeleteAsk) {
      return html`<button type="button" class="pe-btn pe-danger me-lib-del" ?disabled=${this.saving}
        title=${`Delete ${menu.name}. It is on no device yet.`} @click=${() => { this.menuDeleteAsk = true; }}>Delete</button>`;
    }
    return html`<div class="me-lib-copy me-lib-del-ask" role="alertdialog" aria-label=${`Delete ${menu.name}?`}>
      <span class="me-lib-hint"><b>Delete ${menu.name}?</b> It is on no device yet. This cannot be undone.</span>
      <button type="button" class="pe-btn pe-danger" @click=${() => void this.deleteLibraryMenu(menu)}>Really delete</button>
      <button type="button" class="pe-btn" @click=${() => { this.menuDeleteAsk = false; }}>Cancel</button>
    </div>`;
  }

  private async deleteLibraryMenu(menu: LibraryMenu): Promise<void> {
    const store = this.lib.store;
    const key = this.recordKey;
    if (store === undefined || key === undefined || this.libraryItem === undefined) return;
    this.menuDeleteAsk = false;
    const result = await store.deleteItem("menus", menu.id);
    if (key !== this.recordKey) return;
    if (!result.ok) {
      this.libNote = { kind: "err", text: `Not deleted. ${result.text}` };
      return;
    }
    forgetWatchMenusDraft(key);
    this.onBack?.();
  }

  // ── keys ───────────────────────────────────────────────────────────────

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.defaultPrevented) return;
    const path = e.composedPath();
    if (!path.includes(this) && !nothingFocused()) return;
    if (this.renderRoot.querySelector("dialog[open]")) return;
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();
    if (mod && !e.altKey && key === "s") {
      e.preventDefault();
      void this.save();
      return;
    }
    if (e.key === "Escape" && this.topMenuOpen) {
      e.preventDefault();
      this.topMenuOpen = false;
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(".wa-bar .tb-more")?.focus());
      return;
    }
    if (isTextField(path[0])) return;
    if (mod && !e.altKey && key === "z") {
      e.preventDefault();
      if (e.shiftKey) this.redo();
      else this.undo();
      return;
    }
    if (e.ctrlKey && !e.metaKey && !e.altKey && key === "y") {
      e.preventDefault();
      this.redo();
      return;
    }
    // Escape lets go of the selected slot, back to the menu's own settings,
    // as it lets go of a tile in the page editor.
    if (e.key === "Escape" && !mod && !e.altKey) {
      const host = this.viewHost();
      if (host !== undefined && deselectMenuSlot(host)) e.preventDefault();
    }
  };

  /** A click on the stage that lands on nothing, the watch's black screen
   * or the ground around it, lets go of the selected slot (or the
   * switcher's picked page), back to the menu's own settings. A slot, an
   * add button, a picked page's label and the tool strip keep theirs. */
  private onStageClick = (e: MouseEvent): void => {
    const path = e.composedPath();
    const stage = path.indexOf(e.currentTarget as EventTarget);
    // Only what is inside the stage counts, not the cards around it.
    const inside = stage < 0 ? path : path.slice(0, stage);
    if (inside.some((n) => typeof (n as Partial<Element>).matches === "function" && (n as Element).matches(STAGE_KEEPS_SELECTION))) return;
    const host = this.viewHost();
    if (host !== undefined) deselectMenuSlot(host);
  };

  /** A press anywhere outside the top bar's open ··· menu closes it. */
  private onWindowPointerDown = (e: PointerEvent): void => {
    if (!this.topMenuOpen) return;
    const path = e.composedPath();
    if (!path.some((n) => n instanceof HTMLElement && n.classList.contains("pe-top-menu"))) this.topMenuOpen = false;
  };

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    return html`
      <div class="pe-top">
        ${this.renderTopBar(this.draft)}
        ${this.note ? html`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      </div>
      ${this.renderBody(this.watches)}
    `;
  }

  /** Whether the editor is one column: the measured width, or Home
   * Assistant saying it is a phone. Before the first measurement it is not. */
  private get stacked(): boolean {
    return this.narrow || (this.hostWidth > 0 && this.hostWidth <= ME_STACK_WIDTH);
  }

  /** The top bar: back to the Menus tab, the Library tag, then the ···
   * menu and Save. No delivery and no way to Pages: a save reaches every
   * device that uses the menu, each on its own. Undo and Redo are in the
   * canvas head, the devices that use the menu in the strip under it, and
   * Preview on in the tool strip over the stage. Two rows when stacked. */
  private renderTopBar(draft: WatchMenusDraft | undefined): TemplateResult {
    const editing = draft !== undefined;
    const dirty = editing && this.dirty;
    return html`<div class="wa-bar ${this.stacked ? "stacked" : ""}" role="toolbar" aria-label="Menu in the library">
      ${this.haMenu ? html`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${() => this.onHaMenu?.()}>${uiIcon("menu")}</button>` : nothing}
      <button class="tb-btn tb-back" title="Back to the Menus tab" @click=${() => this.onBack?.()}>${uiIcon("left")}<span>Menus</span></button>
      ${renderLibraryTag()}
      <span class="spacer"></span>
      ${this.renderTopMenu(editing ? draft : undefined)}
      ${editing ? html`<button class="primary save ${dirty ? "dirty" : ""}" ?disabled=${!dirty || this.saving}
          title=${dirty ? `Save (${MOD}S). A save reaches every device that uses this menu.` : `Nothing to save (${MOD}S)`}
          @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>` : nothing}
      ${this.barActions}
    </div>`;
  }

  /** The ··· menu: Discard edits. */
  private renderTopMenu(draft: WatchMenusDraft | undefined): TemplateResult | typeof nothing {
    if (draft === undefined) return nothing;
    const open = this.topMenuOpen;
    const run = (fn: () => void) => () => { this.topMenuOpen = false; fn(); };
    return html`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"} aria-label="More actions" title="More"
        @click=${() => { this.topMenuOpen = !open; }}>···</button>
      ${open ? html`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        <button class="row" role="menuitem" ?disabled=${!this.dirty || this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${run(() => this.discard())}>Discard edits</button>
      </div>` : nothing}
    </span>`;
  }

  /** A device's color (`device-colors.ts`), for its tick. */
  private colorOf(watchId: string): string | undefined {
    return deviceColor(deviceColors(this.owners.length > 0 ? this.owners : (this.ownList ?? [])), watchId);
  }

  // ── the columns ────────────────────────────────────────────────────────

  /** The side widths the grid can afford right now. */
  private fittedColumns(): ColumnWidths {
    if (this.hostWidth > 0 && this.hostWidth <= ME_STACK_WIDTH) return this.columns;
    return fitColumnWidths(this.hostWidth - ME_GRID_CHROME, this.columns, ME_COLUMNS);
  }

  private renderGutter(side: "left" | "right"): TemplateResult {
    return html`<div class="gutter ${side}" role="separator" aria-orientation="vertical"
      aria-label=${side === "left" ? "Resize the menus and slots column" : "Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${(e: PointerEvent) => {
        // Drag from the width on screen, not the stored preference.
        const shown = this.fittedColumns();
        beginColumnDrag(e, {
          side,
          base: side === "left" ? shown.left : shown.right,
          limits: ME_COLUMNS,
          onWidth: (width) => { this.columns = { ...this.columns, [side]: width }; },
          onEnd: () => saveColumnWidths(ME_COLUMNS_KEY, this.columns),
        });
      }}
      @dblclick=${() => {
        this.columns = { ...this.columns, [side]: ME_COLUMNS_DEFAULT[side] };
        saveColumnWidths(ME_COLUMNS_KEY, this.columns);
      }}></div>`;
  }

  // ── the stage ──────────────────────────────────────────────────────────

  /** The stage's scale now: as stepped, else the page editor's fit for the
   * width. */
  private get stageScale(): number {
    return this.zoom ?? stageFitZoom(this.narrow || this.stacked);
  }

  private setZoom(scale: number | undefined): void {
    this.zoom = scale;
    saveMenusZoom(scale);
  }

  /**
   * The canvas card: the head (the shown menu's name, the preview device's
   * name as text, the menu's facts and the device's size, then Undo and
   * Redo), the strip of devices that use the menu, the dotted stage with
   * the floating tool strip over the device, and the hint under it. Menus
   * have no live state, so there is no Live strip.
   */
  private renderStage(host: MenusViewHost, watches: readonly OwnerSummary[]): TemplateResult {
    const owner = watches.find((w) => w.owner_watch_id === this.watchId);
    const found = caseForScreenSize(owner?.screen_size);
    const watchCase = found ?? REFERENCE_CASE;
    const caseLabel = host.phone === undefined ? watchCase.label : host.phone.model.label;
    const facts = [...menuStageFacts(host), caseLabel];
    const draft = this.draft;
    const name = menuSectionLabel(shownMenu(host));
    return html`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${name}>${name}</span>
        ${owner !== undefined ? html`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${watchName(owner, watches)}</span></span>` : nothing}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${host.phone !== undefined ? PHONE_SIZE_TEXT : found === undefined ? `${watchCase.label}, this watch's size is not known` : facts.join(" · ")}><span class="fam">${facts.join(" · ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!draft?.canUndo} title=${`Undo (${MOD}Z)`} aria-label="Undo"
            @click=${() => this.undo()}>${uiIcon("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!draft?.canRedo} title=${IS_MAC ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${() => this.redo()}>${uiIcon("redo")}</button>
        </span>
      </div>
      ${this.renderStageDevices()}
      <div class="stage-area me-stage-area" @click=${this.onStageClick}>
        ${this.renderStageTools(host)}
        ${renderMenuHowTo(host)}
        ${renderMenuStage(host)}
        <div class="under"><span class="tail">${menuStageHint(host)}</span>${renderMenuStageFoot(host)}</div>
      </div>
    </div>`;
  }

  /** The floating tool strip over the stage, the page editor's: the shown
   * menu's Add and Play opening (`menu-stage.ts`), Preview on, and the
   * zoom. The device's size is in the head over the stage. */
  private renderStageTools(host: MenusViewHost): TemplateResult {
    const phone = host.phone !== undefined;
    const scale = this.stageScale;
    const fit = stageFitZoom(this.narrow || this.stacked);
    // The percent is of the device's own points.
    const shownAs = (zoom: number): string => stageZoomLabel(phone ? zoom * PHONE_STAGE_ZOOM : zoom);
    return html`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      ${renderMenuStageTools(host)}
      ${renderPreviewPicker(this.previewKind, (kind) => this.pickPreview(kind))}<span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${scale <= stageZoomOut(scale)} aria-label="Zoom out" title="Zoom out"
          @click=${() => this.setZoom(stageZoomOut(scale))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${shownAs(scale)}. Back to fit`}
          title=${`The ${phone ? "iPhone" : "watch"} at ${shownAs(scale)} of its own points. Click to fit it again (${shownAs(fit)}).`}
          @click=${() => this.setZoom(undefined)}>${shownAs(scale)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${scale >= stageZoomIn(scale)} aria-label="Zoom in" title="Zoom in"
          @click=${() => this.setZoom(stageZoomIn(scale))}>+</button>
      </span>
    </div>`;
  }

  private renderBody(watches: readonly OwnerSummary[]): TemplateResult {
    if (this.loading) return html`<div class="pe-empty">Loading…</div>`;
    // Only the menu's own unit is drawn, which the summary names.
    if (this.loadError === undefined && this.libraryUnit === undefined) {
      const failed = this.lib.readState === "failed" ? this.lib.store?.readError : undefined;
      return html`<div class="pe-empty">${failed ?? "Loading…"}</div>`;
    }
    if (this.loadError !== undefined) {
      const id = this.recordKey;
      return html`<div class="pe-empty">
        <span>Could not read this menu: ${this.loadError}</span>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => void this.load(id)}>Try again</button>`}
      </div>`;
    }
    const record = this.record;
    if (record === undefined) return html`<div class="pe-empty">Loading…</div>`;
    const draft = this.draft;
    // A record this panel cannot read, such as one from a newer schema.
    if (draft === undefined) return html`<div class="pe-empty"><b>${WATCH_MENUS_UPDATE_TEXT}</b></div>`;
    const host = this.viewHost();
    if (host === undefined) return html`<div class="pe-empty">Loading…</div>`;
    const fit = this.fittedColumns();
    const view = this.hostHeight > 0 ? `--pe-view-h:${this.hostHeight}px;` : "";
    // The complication editor's three columns (`editor-chrome.ts`), as the
    // page editor lays them out: the Menus and Slots cards, the canvas card,
    // and the inspector, with a drag gutter between each pair. The editor
    // scrolls as a whole and the side columns stick under the top bar.
    return html`<div class="layout pe-layout ${this.stacked ? "cols-1" : "cols-3"}" style=${`--wa-left:${fit.left}px;--wa-right:${fit.right}px;${view}`}>
      <div class="column left">
        ${renderMenusCard(host)}
        ${renderSlotsCard(host)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(host, watches)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${renderMenuInspector(host)}
      </div>
    </div>`;
  }

  static override styles = [formStyles, chromeTokens, topBarStyles, columnStyles, leftCardStyles, rowListStyles, canvasStyles, inspectorStyles, watchFrameStyles, phoneFrameStyles, css`
    /* A column; --cf-pad is the padding the sticky top block reaches
       through to sit edge to edge. */
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
      /* A field brought into view lands under the sticky top. */
      scroll-padding-top: var(--pe-top-h, 0px);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }

    /* The top bar, and a note under it while there is one, stay at the top
       of the editor, as in the page editor: one block, sticky to the host's
       top edge and edge to edge, on the host's own background so the editor
       scrolls under it. Above the cards and their menus. Its measured
       height is --pe-top-h on the host (measureTop), which the sticky side
       columns stand under. */
    .pe-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 0;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    /* The browser's own monospace, not the shared sheet's family. */
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }

    /* The bar's buttons with a glyph and words (the way back) on one line,
       as the panel's own bar draws them. */
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .wa-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
    .wa-bar .pop-menu .row:disabled:hover { background: transparent; }
    .pe-top > .pe-note { margin: 10px var(--cf-pad, 16px) 0; }

    .pe-note {
      display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .pe-note > span { flex: 1; min-width: 0; }
    .pe-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
    .pe-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .pe-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .pe-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
    .pe-link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }

    .pe-empty {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 560px;
      padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }

    /* The complication editor's three columns (editor-chrome.ts), laid out
       as the page editor lays them: the editor scrolls as a whole, the stage
       with it, and the side widths come in as custom properties already
       fitted to the measured host width (fitColumnWidths). */
    .layout.pe-layout {
      flex: none; min-height: auto; overflow: visible; align-items: start; padding: 0;
      /* The room at the foot. */
      margin-bottom: 14px;
    }
    /* The Menus and Slots cards and the inspector stay in view while the
       editor scrolls: each sticks just under the sticky top block (the
       host's scroll box, inside its padding, starts --cf-pad down; the block
       reaches --pe-top-h down from the edge) and, when taller than the room
       left, scrolls on its own. --pe-view-h is the host's measured content
       height, less what the top block covers past the padding, and a little
       air. */
    .pe-layout > .column.left, .pe-layout > .column.inspector {
      --pe-under-top: max(0px, calc(var(--pe-top-h, 0px) - var(--cf-pad, 16px)));
      position: sticky; top: var(--pe-under-top);
      max-height: calc(var(--pe-view-h, calc(100dvh - 120px)) - 30px - var(--pe-under-top));
      overflow-y: auto; overflow-x: hidden;
    }
    .pe-layout > .column.left { display: flex; flex-direction: column; gap: 8px; scrollbar-gutter: auto; }
    .pe-layout > .column.left > .card { flex: none; }
    .pe-layout > .column.canvas { overflow: visible; min-height: auto; }
    /* One column under 820px, the complication editor's order: the menu on
       the watch, the settings, then the lists. */
    @container (max-width: 820px) {
      .layout.pe-layout { grid-template-columns: minmax(0, 1fr); }
      .pe-layout > .gutter { display: none; }
      /* As strong as the sticky rule, so a stacked list or inspector stops
         sliding over the cards above it (the page editor's fix). */
      .pe-layout > .column.left, .pe-layout > .column.canvas, .pe-layout > .column.inspector { grid-column: auto; position: static; max-height: none; overflow: visible; }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
      .pe-layout > .column.left { order: 3; }
    }

    /* The canvas card: the head, the dotted stage and its tool strip. The
       stage is the watch at a set scale, not a fitted box: it grows with
       the zoom and the editor scrolls. */
    .column.canvas > .card.canvas-card.me-canvas { min-height: 0; flex: none; }
    /* The lit stage's edge in Menus' hue, Home's Menus door. */
    .canvas-card.me-canvas { --wa-stage-hue: var(--wa-hue-orange); }
    /* The shown menu's name: read, not typed. */
    .cv-head .cv-title { flex: 0 1 auto; min-width: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* The preview device's name in the head: a fact. */
    .cv-head .cv-watch { min-width: 0; font-size: 12.5px; font-weight: 500; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .me-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    @container (max-width: 460px) {
      .me-stage-area { padding-top: 92px; }
    }
    /* The picture keeps its size and the stage scrolls sideways under it on
       a screen narrower than the watch drawn at this scale. */
    .me-stage-body { display: flex; justify-content: center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    .me-stage-area > .under {
      display: flex; flex-direction: column; gap: 4px; align-self: center; max-width: 460px; text-align: center;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
    }
    /* The watch's size is a fact, not a menu. */

    .pe-badge {
      display: inline-block; padding: 1px 7px; border-radius: 999px; font-size: 11px; font-weight: 600;
      color: var(--wa-muted); background: var(--wa-field); white-space: nowrap;
    }

    .pe-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 32px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-btn:hover:not(:disabled) { background: var(--wa-panel); }
    .pe-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-btn:disabled { opacity: .55; cursor: default; }
    .pe-btn.pe-primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .pe-btn.pe-primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }
    /* Not "primary" and "danger": the shared sheet's button.primary and
       button.danger outrank .pe-btn and would restyle these. */
    .pe-btn.pe-danger { color: var(--wa-need); align-self: flex-start; }

    :host([narrow]) { --cf-pad: 12px; }

    /* The foot of the menu's row in the Menus card: the menu's name and
       Delete (libraryHead). */
    .me-lib { display: flex; flex-direction: column; gap: 8px; padding: 0; font-weight: 400; }
    .me-lib-name { max-width: 420px; }
    .me-lib-name { display: flex; flex-direction: column; gap: 4px; }
    .me-lib-h { font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
    .me-lib-input {
      min-height: 32px; padding: 0 10px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-input, var(--wa-field)); color: var(--wa-ink); font: inherit; font-size: 13.5px; font-weight: 600;
    }
    .me-lib-input:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .me-lib-copy { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
    .me-lib-hint { font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
    .me-lib-note { margin: 0; font-size: 12px; line-height: 1.35; color: var(--wa-muted); }
    .me-lib-note.err { color: var(--wa-need); }
    .me-lib-note.ok { color: var(--wa-ink); }
  `, menuViewStyles, menuStageStyles, menuInspectorLookStyles, howToStyles, libraryTicksStyles, libraryModeStyles];
}

if (!customElements.get("wa-menu-editor")) {
  customElements.define("wa-menu-editor", WaMenuEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-menu-editor": WaMenuEditor;
  }
}
