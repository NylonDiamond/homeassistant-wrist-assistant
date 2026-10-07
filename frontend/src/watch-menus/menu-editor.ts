// `<wa-menu-editor>`: the watch's menus as Home Assistant keeps them (the
// `menus` watch config kind), and an editor for them: the Anywhere menu and
// its style, the Entity quick menu with each entity's own menu, and the page
// switcher's style.
//
// It wears the complication editor's chrome (`editor-chrome.ts`) the way the
// page editor does: the top bar, then three columns with drag gutters (the
// Menus and Slots cards, the canvas with the shown menu on the watch, and the
// inspector), and the foot bar. One menu at a time is in the canvas, picked
// in the Menus card, as the complication editor shows one page. The views
// are `menu-view.ts`.
//
// The host pattern of the page editor (`watch-pages/page-editor.ts`): watch
// chips from the owners list, the record read with `watch_config/get` and kept
// as raw JSON in a draft (`draft.ts`) with undo and redo, a save through
// `watch_config/save` that merges when another save landed too, the earlier
// saves with restore, the delivery check, and the size budget. The `catalog` and
// `behavior` records are read beside it, read only, for the pickers' names;
// the live line reads them again when they change and merges a `menus`
// change into the open draft. The home's HTTP action library
// (`watch-pages/http-library.ts`) is read when a watch opens and on a
// reconnect; it has no live line.
//
// The `pages` record is read beside it too, into the page draft the page
// editor keeps for the watch (`watch-pages/kept.ts`): a page's own settings
// for the page switcher (hidden, name or icon, its name, icon and color) are
// edited here, as on the iPhone, through that second draft. So an unsaved
// edit made on either screen is on the other, Save saves both, Discard
// discards both, and Undo works on the pages while a page is picked in the
// switcher's Pages card.
//
// A watch with no menus record yet can start from the app's defaults
// (`menu-defaults.json`): a save over revision 0, which Home Assistant takes
// for a paired watch.
//
// The panel loads this module on its own, with one `import()`, when its route
// is `/menus` (`hook.ts`). Nothing it imports may import `icons.ts`.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 1 build
// contract", items 5 to 7).

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
  type WatchConfigHistoryEntry,
  type WatchConfigRecord,
  fetchOwners,
  fetchHttpActions,
  fetchWatchConfig,
  fetchWatchConfigHistory,
  fetchWatchConfigHistoryEntry,
  restoreWatchConfig,
  saveWatchConfig,
  subscribeWatchConfig,
} from "../ha-api.js";
import { peopleOf } from "../people.js";
import { personColorVar } from "../pickerRows.js";
import { type IconProvider, REFERENCE_CASE, caseForScreenSize } from "../renderer.js";
import { agoWords } from "../send-state.js";
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
import {
  SavedAgoTicker,
  configFootStatus,
  configFootStyles,
  copyConfigText,
  openConfigDialogs,
  renderConfigFoot,
  renderConfigHistoryDialog,
  renderConfigRawDialog,
  renderConfigSaved,
} from "../watch-pages/config-foot.js";
import { type WatchPagesDraft, saveWatchPagesDraft } from "../watch-pages/draft.js";
import { findWatchPage } from "../watch-pages/edit.js";
import { NO_ICONS, memoIconNames, watchKeysTypeText } from "../watch-pages/editor-host.js";
import { anyWatchPagesDirty, dropAllWatchPages, keptWatchPagesDraft, takeWatchPagesRecord } from "../watch-pages/kept.js";
import { watchFrameStyles } from "../watch-frame.js";
import {
  type WatchPagesDocument,
  isHiddenWatchPage,
  isJsonObject,
  isSmartWatchPage,
  isSystemWatchPage,
  watchPageId,
  watchPageName,
  watchPageTiles,
  watchPagesOf,
} from "../watch-pages/model.js";
import { type WatchPagesNote, watchCommandError, watchPagesSaveNote } from "../watch-pages/save-note.js";
import { resolveSmartPagesBeforeSave } from "../watch-pages/smart-model.js";
import { stageFitZoom, stageZoomIn, stageZoomLabel, stageZoomOut } from "../watch-pages/stage.js";
import type { SwitcherSettingsHost } from "../watch-pages/switcher-settings.js";
import { scrubWatchOrphanTriggers } from "../watch-pages/tile-settings-model.js";
import {
  START_FRESH_BUTTON,
  type NoRecordStart,
  deliveryState,
  followWatch,
  mayStart,
  noRecordStart,
  noRecordText,
  settingsWatches,
  watchName,
} from "../watch-settings.js";
import {
  type WatchMenusDraft,
  anyWatchMenusDirty,
  dropAllWatchMenus,
  forgetWatchMenusDraft,
  keptWatchMenusDraft,
  saveWatchMenusDraft,
  startWatchMenus,
  takeWatchMenusRecord,
} from "./draft.js";
import { WATCH_MENUS_HELP_URL, navigatePagesFromMenus, navigateWatchMenus, registerWatchMenusDrafts } from "./hook.js";
import {
  type MenuSwitcherPage,
  type MenuSwitcherRow,
  type MenusScreen,
  type MenusViewHost,
  deselectMenuSlot,
  loadMenusZoom,
  menuSectionLabel,
  menuStageFacts,
  menuStageHint,
  menuViewStyles,
  renderMenuInspector,
  renderMenuScreen,
  renderMenusCard,
  renderSlotsCard,
  saveMenusZoom,
  selectedSwitcherPage,
  shownMenu,
} from "./menu-view.js";
import {
  type MenuTargets,
  type MenusDocument,
  WATCH_MENUS_NO_RECORD_TEXT,
  WATCH_MENUS_NO_RECORD_TITLE,
  WATCH_MENUS_PAIR_FIRST_TEXT,
  WATCH_MENUS_START_BUTTON,
  WATCH_MENUS_UPDATE_TEXT,
  asWatchMenusDocument,
  isMenuUUID,
  scrubWatchMenuOrphanTriggers,
  watchMenuOverrideIds,
  watchMenuSlots,
  watchMenusBudget,
  watchMenusReadMeansUnsupported,
} from "./model.js";
import { watchMenusReplacedText, watchMenusSaveNote } from "./save-note.js";
import type { MenuVoiceContext } from "./slot-voice.js";
import { voiceDocumentOfRecord, voicePhraseTargets, watchVoiceFallbacks } from "../watch-voice/defaults.js";

/** Whether this editor holds unsaved edits: to the menus, or to the pages
 * (a page's switcher settings are edited here, in the page draft the page
 * editor keeps too). The page editor's own chunk may never have loaded, so
 * the pages count here as well. */
function anyMenusEditorDirty(): boolean {
  return anyWatchMenusDirty() || anyWatchPagesDirty();
}

registerWatchMenusDrafts({
  dirty: anyMenusEditorDirty,
  drop: () => {
    dropAllWatchMenus();
    dropAllWatchPages();
  },
});

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
    if (!anyMenusEditorDirty()) return;
    e.preventDefault();
    e.returnValue = "";
  });
}

/** How often the view asks whether a device has collected a save. */
const DELIVERY_POLL_MS = 15_000;

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl+";

/** The Menus and Slots column and the inspector, each widened by dragging
 * the gutter beside it, with the page editor's limits and defaults. */
const ME_COLUMNS = { min: 200, max: 720, middleMin: 320 } as const;
const ME_COLUMNS_DEFAULT: ColumnWidths = { left: 280, right: 320 };
export const ME_COLUMNS_KEY = "wrist-assistant-panel.menus.columns.v1";
/** The grid's own cost beside its three columns, CSS px: two 8px gutters and
 * the 2px gap on each side of each. */
const ME_GRID_CHROME = 2 * 8 + 4 * 2;
/** At or below this content width the columns stack and the top bar takes
 * two rows (the `@container` rules on `.layout.pe-layout` say the same). */
const ME_STACK_WIDTH = 820;

type Note = WatchPagesNote;
type HistoryState = "loading" | "ready" | "error" | "unsupported";

interface RestoreAsk {
  entry: WatchConfigHistoryEntry;
  baseRevision: number;
  summary?: string;
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

function flatError(err: unknown): Error {
  const { code, message } = watchCommandError(err);
  return Object.assign(new Error(message), code === undefined ? {} : { code });
}

function kb(bytes: number): string {
  return bytes < 1000 ? `${bytes} bytes` : `${Number((bytes / 1000).toFixed(1))} KB`;
}

function ago(iso: string | null | undefined): string {
  const at = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(at) ? "" : agoWords(Math.max(0, (Date.now() - at) / 1000));
}

/** Who made a save: the panel writes `panel`, a device its id. */
function savedBy(updatedBy: string | null | undefined): string {
  return updatedBy === "panel" ? "Saved here" : "From the watch";
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

const NOTE_WEIGHT: Readonly<Record<WatchPagesNote["kind"], number>> = { ok: 0, warn: 1, err: 2 };

/** The note after a save of the menus and the pages: each one's words, both
 * in one line when both said something (once when they said the same), in
 * the graver of the two kinds. */
export function joinSaveNotes(menus: WatchPagesNote | undefined, pages: WatchPagesNote | undefined): WatchPagesNote | undefined {
  if (menus === undefined) return pages;
  if (pages === undefined) return menus;
  const kind = NOTE_WEIGHT[pages.kind] > NOTE_WEIGHT[menus.kind] ? pages.kind : menus.kind;
  return { kind, text: menus.text === pages.text ? menus.text : `${menus.text} ${pages.text}` };
}

/** A restore's one line: how many slots each menu holds. */
export function watchMenusSummary(document: unknown): string {
  const doc = asWatchMenusDocument(document) ?? {};
  const anywhere = watchMenuSlots(doc, { list: "anywhere" }).length;
  const overrides = watchMenuOverrideIds(doc).length;
  const slots = (n: number) => `${n} ${n === 1 ? "slot" : "slots"}`;
  return `Anywhere menu: ${slots(anywhere)}. ${overrides === 0 ? "No entity has its own menu." : `${overrides} ${overrides === 1 ? "entity has" : "entities have"} its own menu.`}`;
}

export class WaMenuEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ attribute: false }) ownerId?: string;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;
  /** The top bar offers Home Assistant's menu, as the panel's own bar does on
   * a phone or with the sidebar hidden (`hook.ts`). */
  @property({ attribute: false }) haMenu = false;
  @property({ attribute: false }) onHaMenu?: () => void;
  /** Back to the complication editor. Without it, the address less `/menus`. */
  @property({ attribute: false }) onBack?: () => void;
  /** To the page editor. Without it, the address's `/menus` made `/pages`. */
  @property({ attribute: false }) onPages?: () => void;
  /** The panel's own buttons for the bar's right end: Watch settings, whose
   * dialog the panel draws. */
  @property({ attribute: false }) barActions: TemplateResult | typeof nothing = nothing;
  /** The panel's Watch app row owns the watch: it picks the watch (this
   * element follows `ownerId` wherever it goes) and holds the ways to the
   * other screens, so the bar leaves out its own watch picker, the way back
   * to complications and Pages. Off, the bar is as it always was. */
  @property({ attribute: false }) shellOwnsWatch = false;

  @state() private watchId?: string;
  @state() private record?: WatchConfigRecord;
  /** The integration does not keep menus (too old for the kind). */
  @state() private unsupported = false;
  @state() private catalog?: WatchCatalog;
  /** The watch's own status pages (the `status_pages` record), which the
   * Show Status Page target lists before the iPhone's; undefined while Home
   * Assistant holds none or before the first read. */
  @state() private statusPages?: WatchCatalogStatusPage[];
  /** The home's HTTP action library (`http-library.ts`), the same for every
   * watch, read when a watch opens and on a reconnect (it has no live line);
   * undefined before the first read and with an integration older than it. */
  @state() private httpLibrary?: WatchHttpLibrary;
  private httpLibrarySeq = 0;
  /** The pages record as last read: its revision (0 for none) and the
   * document. Undefined before the first read. The pages shown come from the
   * page draft when there is one (`pagesDocument`). */
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
  @state() private history: WatchConfigHistoryEntry[] = [];
  @state() private historyState: HistoryState = "loading";
  @state() private note?: Note;
  @state() private restoreAsk?: RestoreAsk;
  @state() private restoring = false;
  @state() private starting = false;
  /** The foot bar's History dialog is open (`config-foot.ts`). */
  @state() private historyOpen = false;
  /** The foot bar's Raw configuration dialog is open. */
  @state() private rawOpen = false;
  /** The raw JSON went to the clipboard since the dialog opened. */
  @state() private rawCopied = false;
  /** The foot bar's dialogs opened so far, each once. */
  private readonly shownFootDialogs = new WeakSet<HTMLDialogElement>();
  @state() private ownList?: readonly OwnerSummary[];
  /** The top bar's ··· menu is open. */
  @state() private topMenuOpen = false;
  /** The top bar's watch picker is open. */
  @state() private watchMenuOpen = false;
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
  /** Draws again while the toolbar says "Saved 3 min ago". */
  private readonly savedTicker = new SavedAgoTicker(this);

  private readonly symbols = new SymbolBrowser(() => this.requestUpdate());
  private readonly uiState = new Map<string, unknown>();
  private iconMemo?: { provider: IconProvider; tick: number; icons: IconProvider };
  /** The coalesce key of a drag on a number field running now. */
  private scrubKey?: string;
  private scrubSeq = 0;
  private reloadPending = false;
  private restartDraft?: { watchId: string; revision: number };
  private followedSave?: Promise<unknown>;
  /** The page draft's save this element follows (its own, or one the page
   * editor began), to read the pages again when it ends. */
  private followedPagesSave?: Promise<unknown>;
  private shownDialog?: HTMLDialogElement;
  private loadSeq = 0;
  private catalogSeq = 0;
  private statusPagesSeq = 0;
  private pagesSeq = 0;
  private behaviorSeq = 0;
  private historySeq = 0;
  private subscribeSeq = 0;
  private unsubscribe?: () => Promise<void>;
  private pollTimer?: number;
  private readyConnection?: HassConnectionEvents;

  private get watches(): OwnerSummary[] {
    return settingsWatches(this.owners.length > 0 ? this.owners : (this.ownList ?? []));
  }

  private get draft(): WatchMenusDraft | undefined {
    if (this.watchId === undefined || this.record === undefined || this.record.revision <= 0) return undefined;
    return keptWatchMenusDraft(this.watchId);
  }

  /**
   * The page draft kept for the watch (`watch-pages/kept.ts`), shared with
   * the page editor, so an unsaved page edit made there is here before the
   * pages record is read, and one made here is there. None once the read
   * says Home Assistant holds no pages for the watch.
   */
  private get pagesDraft(): WatchPagesDraft | undefined {
    if (this.watchId === undefined || (this.pagesRecord !== undefined && this.pagesRecord.revision <= 0)) return undefined;
    return keptWatchPagesDraft(this.watchId);
  }

  /** The pages as edited now: the page draft's, else the record's. */
  private get pagesDocument(): unknown {
    const record = this.pagesRecord;
    return this.pagesDraft?.document ?? (record !== undefined && record.revision > 0 ? record.document : undefined);
  }

  /** The pages a Go to Page slot can open, worked out on every draw so an
   * edit shows at once. */
  private get pages(): { id: string; name: string }[] {
    return watchMenuPageTargets(this.pagesDocument);
  }

  /** Either draft is being saved: every field is drawn off then. */
  private get saving(): boolean {
    if (this.watchId === undefined) return false;
    return (keptWatchMenusDraft(this.watchId)?.saving ?? false) || (this.pagesDraft?.saving ?? false);
  }

  /** Unsaved edits to the menus or to the pages: the Save button, its
   * "Unsaved changes" and Discard edits. */
  private get dirty(): boolean {
    return (this.draft?.dirty ?? false) || (this.pagesDraft?.dirty ?? false);
  }

  /** The draft Undo and Redo work on: the pages while a page is picked in the
   * switcher's Pages card, else the menus. */
  private get undoDraft(): WatchMenusDraft | WatchPagesDraft | undefined {
    const pages = this.pagesDraft;
    if (pages !== undefined && this.pickedSwitcherPage() !== undefined) return pages;
    return this.draft;
  }

  /** The page picked in the switcher's Pages card, while the switcher is
   * shown and the page is still there. */
  private pickedSwitcherPage(): MenuSwitcherRow | undefined {
    return selectedSwitcherPage({ uiState: this.uiState, switcherPages: [], switcherRows: watchSwitcherRows(this.pagesDocument) });
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
      this.pagesDraft?.endCoalesce();
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointerdown", this.onWindowPointerDown, true);
    this.columns = loadColumnWidths(ME_COLUMNS_KEY, ME_COLUMNS_DEFAULT, ME_COLUMNS);
    this.watchSize();
    this.listenForReconnect();
    if (this.watchId !== undefined) this.openWatch(this.watchId, true);
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
    this.stopPolling();
    this.loadSeq++;
    this.catalogSeq++;
    this.statusPagesSeq++;
    this.httpLibrarySeq++;
    this.pagesSeq++;
    this.behaviorSeq++;
    this.voiceSeq++;
    this.historySeq++;
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
      // A move takes the watch's kept menu draft and its kept page draft
      // together (`openWatch`), so both stay as they were on the watch left.
      const id = followWatch(this.watches, this.watchId, this.ownerId, this.shellOwnsWatch || changed.has("ownerId"));
      if (id !== undefined) this.openWatch(id);
    }
    this.followSave();
    const ask = this.restoreAsk;
    if (ask !== undefined && !this.restoring && this.historyState === "ready" && !this.history.some((e) => e.revision === ask.entry.revision)) {
      this.closeAsk();
    }
  }

  protected override updated(): void {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.pe-ask") ?? undefined;
    if (dialog !== this.shownDialog) {
      this.shownDialog = dialog;
      if (dialog && !dialog.open) dialog.showModal();
    }
    openConfigDialogs(this.renderRoot, this.shownFootDialogs);
    this.observeTop();
    this.savedTicker.show(this.renderRoot.querySelector(".cf-saved") !== null);
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
    const watchId = this.watchId;
    if (!this.isConnected || watchId === undefined) return;
    void this.load(watchId, true);
    void this.loadCatalog(watchId);
    void this.loadHttpLibrary();
    void this.loadStatusPages(watchId);
    void this.loadPages(watchId);
    void this.loadBehavior(watchId);
    void this.loadVoice(watchId);
  };

  private followSave(): void {
    const watchId = this.watchId;
    if (watchId === undefined) return;
    const pagesDone = this.pagesDraft?.saveDone;
    if (pagesDone !== undefined && pagesDone !== this.followedPagesSave) {
      this.followedPagesSave = pagesDone;
      const ended = (): void => this.pagesSaveEnded(watchId);
      void pagesDone.then(ended, ended);
    }
    const done = keptWatchMenusDraft(watchId)?.saveDone;
    if (done === undefined || done === this.followedSave) return;
    this.followedSave = done;
    const ended = (): void => this.saveEnded(watchId);
    void done.then(ended, ended);
  }

  /** A save of the page draft ended: the pages are read again (the read
   * skipped while it was out), and a menus reload held for it goes ahead. */
  private pagesSaveEnded(watchId: string): void {
    this.requestUpdate();
    if (!this.isConnected || watchId !== this.watchId) return;
    void this.loadPages(watchId);
    this.flushPending();
  }

  private saveEnded(watchId: string): void {
    this.requestUpdate();
    if (!this.isConnected) return;
    if (watchId === this.watchId) {
      this.reloadPending = false;
      void this.load(watchId, true);
    } else {
      this.flushPending();
    }
  }

  // ── loading ────────────────────────────────────────────────────────────

  private openWatch(watchId: string, quiet = false): void {
    if (watchId !== this.watchId) {
      this.reloadPending = false;
      this.restartDraft = undefined;
      this.watchId = watchId;
      this.note = undefined;
      this.unsupported = false;
      this.catalog = undefined;
      this.catalogSeq++;
      this.statusPages = undefined;
      this.statusPagesSeq++;
      // The new watch's kept page draft, if any, shows until its record is
      // read (`pagesDraft`). Clearing `uiState` below lets go of the picked
      // page with the rest.
      this.pagesRecord = undefined;
      this.pagesSeq++;
      this.behavior = undefined;
      this.behaviorSeq++;
      this.voiceDocument = undefined;
      this.voiceSeq++;
      this.history = [];
      if (this.historyState !== "unsupported") this.historyState = "loading";
      this.closeAsk();
      this.endScrub();
      this.uiState.clear();
      quiet = false;
    }
    this.startSubscription(watchId);
    void this.load(watchId, quiet);
    void this.loadCatalog(watchId);
    void this.loadHttpLibrary();
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
      this.pagesRecord = { revision: record.revision, document: record.document };
      // Into the page draft the page editor keeps too, rebasing any edits
      // onto it. Not while that draft is being saved: the record may be the
      // save's own, and the save reads the pages again when it ends.
      if (record.revision > 0 && isJsonObject(record.document) && !(keptWatchPagesDraft(watchId)?.saving ?? false)) {
        const taken = takeWatchPagesRecord(watchId, record.document as WatchPagesDocument, record.revision);
        if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The pages changed elsewhere. Your edits are kept." };
      }
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

  private async load(watchId: string, quiet = false): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    if (quiet && this.holdReload) {
      this.reloadPending = true;
      return;
    }
    const seq = ++this.loadSeq;
    this.stopPolling();
    if (!quiet) {
      this.record = undefined;
      this.loading = true;
      this.loadError = undefined;
    }
    try {
      const record = await fetchWatchConfig(hass, watchId, "menus");
      if (seq !== this.loadSeq) return;
      if (quiet && this.holdReload) {
        this.reloadPending = true;
        return;
      }
      this.unsupported = false;
      this.show(record);
      this.loadError = undefined;
    } catch (err) {
      if (seq !== this.loadSeq) return;
      if (watchMenusReadMeansUnsupported(err)) {
        this.unsupported = true;
        this.loadError = undefined;
      } else if (!quiet) {
        this.loadError = errText(err);
      }
      if (this.restartDraft?.watchId === watchId) this.restartDraft = undefined;
    }
    this.loading = false;
    if (this.unsupported) return;
    this.pollIfWaiting();
    void this.loadHistory(watchId);
  }

  private flushPending(): void {
    if (!this.reloadPending || this.holdReload || this.watchId === undefined) return;
    this.reloadPending = false;
    void this.load(this.watchId, true);
  }

  private show(record: WatchConfigRecord): void {
    const watchId = this.watchId;
    this.record = record;
    const document = record.revision > 0 ? asWatchMenusDocument(record.document) : undefined;
    if (watchId === undefined || document === undefined) return;
    const restart = this.restartDraft;
    if (restart !== undefined && restart.watchId === watchId && record.revision >= restart.revision) {
      this.restartDraft = undefined;
      if (!(keptWatchMenusDraft(watchId)?.dirty ?? false)) forgetWatchMenusDraft(watchId);
    }
    const taken = takeWatchMenusRecord(watchId, document, record.revision);
    if (taken.replaced.length > 0) this.note = { kind: "warn", text: watchMenusReplacedText(taken.replaced) };
    else if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The menus changed somewhere else. Your edits are kept." };
    this.requestUpdate();
  }

  private async loadHistory(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass || this.historyState === "unsupported") return;
    const seq = ++this.historySeq;
    try {
      const reply = await fetchWatchConfigHistory(hass, watchId, "menus");
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.history = Array.isArray(reply?.entries) ? reply.entries : [];
      this.historyState = "ready";
    } catch (err) {
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.historyState = errCode(err) === "unknown_command" ? "unsupported" : "error";
    }
  }

  /** Hear every save of this watch's config: a new `menus` revision is read
   * and merged into the draft; `catalog`, `pages` and `behavior` are read
   * again for the pickers. */
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
      } else if (event.kind === "menus") {
        if (event.revision !== (this.record?.revision ?? 0)) void this.load(watchId, true);
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

  private pollIfWaiting(): void {
    this.stopPolling();
    if (!this.isConnected || deliveryState(this.record) !== "waiting") return;
    this.pollTimer = window.setTimeout(() => void this.poll(), DELIVERY_POLL_MS);
  }

  private async poll(): Promise<void> {
    this.pollTimer = undefined;
    const hass = this.hass;
    const watchId = this.watchId;
    const shown = this.record;
    if (!hass || watchId === undefined || shown === undefined) return;
    if (this.holdReload) {
      this.pollIfWaiting();
      return;
    }
    try {
      const fresh = await fetchWatchConfig(hass, watchId, "menus");
      if (watchId !== this.watchId || this.record !== shown) return;
      if (fresh.revision === shown.revision) {
        this.record = {
          ...shown,
          delivered_revision: fresh.delivered_revision,
          delivered_at: fresh.delivered_at,
          rejected_revision: fresh.rejected_revision,
          rejected_at: fresh.rejected_at,
        };
      } else if (this.holdReload) {
        this.reloadPending = true;
      } else {
        this.show(fresh);
        void this.loadHistory(watchId);
      }
    } catch {
      // A missed check is not news.
    }
    this.pollIfWaiting();
  }

  private stopPolling(): void {
    if (this.pollTimer !== undefined) window.clearTimeout(this.pollTimer);
    this.pollTimer = undefined;
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

  /** Apply `change` to the page draft, as `edit` does to the menus: one undo
   * step, or with `coalesce` a step the next edits with that key replace
   * (typing in one field). */
  private editPages(change: (document: WatchPagesDocument) => WatchPagesDocument, coalesce?: string): boolean {
    const draft = this.pagesDraft;
    if (!draft || this.saving) return false;
    const key = this.scrubKey ?? coalesce;
    const changed = draft.apply(change(draft.document), key === undefined ? undefined : { coalesce: key });
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
    const owner = this.watches.find((w) => w.owner_watch_id === this.watchId);
    return (caseForScreenSize(owner?.screen_size) ?? REFERENCE_CASE).screen;
  }

  private viewHost(): MenusViewHost | undefined {
    const draft = this.draft;
    const hass = this.hass;
    if (draft === undefined || hass === undefined) return undefined;
    const self = this;
    // Worked out from the pages as edited now, on every draw, so a switcher
    // edit shows at once in the Pages card and on the watch.
    const rows = watchSwitcherRows(this.pagesDocument);
    return {
      hass,
      icons: this.memoIcons(),
      symbols: this.symbols,
      uiState: this.uiState,
      screen: this.screen(),
      scale: this.stageScale,
      switcherPages: rows.filter((p) => !p.hidden).map(({ hidden: _, ...page }) => page),
      switcherRows: rows,
      switcherSettings: (pageId) => this.switcherSettingsHost(pageId),
      get document() { return draft.document; },
      get targets() { return self.targets(); },
      get catalogKnown() { return self.catalog !== undefined; },
      get httpLibrary() { return self.httpLibrary === undefined ? undefined : self.httpLibrary.revision > 0 ? "held" as const : "empty" as const; },
      get statusPagesKnown() { return self.statusPages !== undefined; },
      get voice() { return self.voiceContext(); },
      get busy() { return self.saving; },
      edit: (change, coalesce) => this.draft === draft && this.edit(change, coalesce),
      endCoalesce: () => draft.endCoalesce(),
      requestUpdate: () => this.requestUpdate(),
    };
  }

  /**
   * The host of one page's switcher settings, editing the page draft: `page`
   * and `busy` read the draft each time they are read. Undefined while there
   * is no page draft or the page is not in it.
   */
  private switcherSettingsHost(pageId: string): SwitcherSettingsHost | undefined {
    const draft = this.pagesDraft;
    if (draft === undefined || findWatchPage(draft.document, pageId) === undefined) return undefined;
    const self = this;
    const icons = this.memoIcons();
    return {
      pageId,
      icons,
      symbols: this.symbols,
      uiState: this.uiState,
      // The page as the draft has it now; an empty one when an undo took it
      // away mid-task, so a row's handler still has a page to read (its
      // setters then change nothing).
      get page() { return findWatchPage(draft.document, pageId) ?? {}; },
      get busy() { return self.saving; },
      edit: (change, opts) => {
        if (this.pagesDraft === draft) this.editPages(change, opts?.typing === true ? `switcher:${pageId.toUpperCase()}` : undefined);
      },
      endCoalesce: () => draft.endCoalesce(),
      requestUpdate: () => this.requestUpdate(),
    };
  }

  private undo(): void {
    if (this.undoDraft?.undo()) this.requestUpdate();
  }

  private redo(): void {
    if (this.undoDraft?.redo()) this.requestUpdate();
  }

  /** Back to the copies Home Assistant holds, menus and pages, each as one
   * step its own undo takes back. */
  private discard(): void {
    if (this.saving) return;
    const menus = this.draft?.discard() ?? false;
    const pages = this.pagesDraft?.discard() ?? false;
    if (menus || pages) {
      this.note = { kind: "ok", text: "Edits discarded. Undo brings them back." };
      this.requestUpdate();
    }
  }

  /**
   * Save what holds edits: the menus, then the pages (a page's switcher
   * settings), each its own record. One failing does not keep the other
   * from saving. The note says how each ended, both in one line.
   */
  private async save(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    this.endScrub();
    const draft = this.draft;
    const pages = this.pagesDraft;
    if (!hass || watchId === undefined || !draft || this.saving) return;
    const menusDirty = draft.dirty;
    const pagesDirty = pages?.dirty ?? false;
    if (!menusDirty && !pagesDirty) return;
    this.note = undefined;
    const menusNote = menusDirty ? await this.saveMenus(hass, watchId, draft) : undefined;
    const pagesNote = pagesDirty && pages !== undefined && this.pagesDraft === pages ? await this.savePages(hass, watchId, pages) : undefined;
    if (watchId === this.watchId) this.note = joinSaveNotes(menusNote, pagesNote);
  }

  /** Save the menus draft; the note for how it ended, or none. */
  private async saveMenus(hass: HassLike, watchId: string, draft: WatchMenusDraft): Promise<Note | undefined> {
    const running = saveWatchMenusDraft(draft, {
      prepare: scrubWatchMenuOrphanTriggers,
      save: (base, document) => saveWatchConfig(hass, watchId, "menus", base, document).catch((err: unknown) => {
        throw flatError(err);
      }),
      fetch: async () => {
        const record = await fetchWatchConfig(hass, watchId, "menus").catch((err: unknown) => {
          throw flatError(err);
        });
        return { revision: record.revision, document: record.document };
      },
    });
    this.followedSave = draft.saveDone;
    this.requestUpdate();
    const result = await running.catch((err: unknown) => ({
      ok: false,
      revision: draft.revision,
      merged: false,
      code: errCode(err) ?? "unknown",
      message: errText(err),
    }));
    this.saveEnded(watchId);
    return watchMenusSaveNote(result);
  }

  /** Save the page draft as the page editor does (`page-editor.ts`
   * `save()`): the same tidying before each send, the same record. The note
   * for how it ended, or none. The pages are read again when it ends
   * (`pagesSaveEnded`). */
  private async savePages(hass: HassLike, watchId: string, draft: WatchPagesDraft): Promise<Note | undefined> {
    const running = saveWatchPagesDraft(draft, {
      // A hold and slide direction left on Trigger entity with nothing
      // picked is saved as None, and every `all` rule of a smart page the
      // draft changed is resolved from Home Assistant's states at the send.
      prepare: (document) => resolveSmartPagesBeforeSave(scrubWatchOrphanTriggers(document), draft.base, this.hass?.states),
      save: (base, document) => saveWatchConfig(hass, watchId, "pages", base, document).catch((err: unknown) => {
        throw flatError(err);
      }),
      fetch: async () => {
        const record = await fetchWatchConfig(hass, watchId, "pages").catch((err: unknown) => {
          throw flatError(err);
        });
        return { revision: record.revision, document: record.document };
      },
    });
    this.followedPagesSave = draft.saveDone;
    this.requestUpdate();
    const result = await running.catch((err: unknown) => ({
      ok: false,
      revision: draft.revision,
      merged: false,
      code: errCode(err) ?? "unknown",
      message: errText(err),
    }));
    this.pagesSaveEnded(watchId);
    return watchPagesSaveNote(result);
  }

  /** "Start with the defaults": create the record from the app's default
   * menus. */
  private async startWithDefaults(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    if (!hass || watchId === undefined || this.starting) return;
    this.starting = true;
    this.note = undefined;
    const result = await startWatchMenus((base, document) => saveWatchConfig(hass, watchId, "menus", base, document));
    this.starting = false;
    if (watchId !== this.watchId) return;
    if (result.ok) {
      this.note = { kind: "ok", text: "Started with the defaults. The watch picks them up the next time it checks." };
    } else if (result.code === "no_record") {
      this.note = { kind: "warn", text: `${WATCH_MENUS_PAIR_FIRST_TEXT} Go to Watch app, Settings, Pair a watch.` };
      return;
    } else if (result.code === "conflict") {
      this.note = { kind: "warn", text: "Menus arrived meanwhile, so those are shown." };
    } else if (result.code === "unsupported") {
      this.unsupported = true;
      return;
    } else {
      this.note = { kind: "err", text: `Could not start: ${result.message}` };
      return;
    }
    void this.load(watchId, true);
  }

  // ── restore ────────────────────────────────────────────────────────────

  private closeAsk(): void {
    this.renderRoot?.querySelector<HTMLDialogElement>("dialog.pe-ask")?.close();
    this.restoreAsk = undefined;
  }

  private askRestore(entry: WatchConfigHistoryEntry): void {
    const hass = this.hass;
    const watchId = this.watchId;
    const record = this.record;
    if (!hass || watchId === undefined || record === undefined || this.draft?.dirty) return;
    const ask: RestoreAsk = { entry, baseRevision: record.revision };
    this.restoreAsk = ask;
    fetchWatchConfigHistoryEntry(hass, watchId, "menus", entry.revision).then(
      (reply) => {
        if (this.restoreAsk === ask) this.restoreAsk = { ...ask, summary: watchMenusSummary(reply.document) };
      },
      () => undefined,
    );
  }

  private async restore(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    const ask = this.restoreAsk;
    if (!hass || watchId === undefined || ask === undefined || this.restoring) return;
    this.restoring = true;
    let note: Note;
    try {
      const reply = await restoreWatchConfig(hass, watchId, "menus", ask.entry.revision, ask.baseRevision);
      note = { kind: "ok", text: `Revision ${ask.entry.revision} is back.` };
      if (watchId === this.watchId) this.restartDraft = { watchId, revision: reply.revision };
      else if (!(keptWatchMenusDraft(watchId)?.dirty ?? false)) forgetWatchMenusDraft(watchId);
    } catch (err) {
      const code = errCode(err);
      if (code === "conflict") note = { kind: "warn", text: "Not restored. The menus changed somewhere else, so the newest copy is shown." };
      else if (code === "no_record") note = { kind: "warn", text: "Not restored. Home Assistant no longer holds menus for this watch." };
      else if (code === "not_found") note = { kind: "warn", text: "Not restored. That save is no longer kept." };
      else if (code === "unknown_command") {
        this.historyState = "unsupported";
        note = { kind: "warn", text: "This version of the integration cannot restore menus. Update it to restore an earlier save." };
      } else note = { kind: "err", text: `Could not restore: ${errText(err)}` };
    } finally {
      this.restoring = false;
      if (this.restoreAsk === ask) this.closeAsk();
    }
    if (watchId !== this.watchId) return;
    this.note = note;
    void this.load(watchId, true);
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
    if (e.key === "Escape" && this.watchMenuOpen) {
      e.preventDefault();
      this.watchMenuOpen = false;
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(".wa-bar .me-watch-btn")?.focus());
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

  /** A press anywhere outside an open menu of the top bar (the ··· menu, the
   * watch picker) closes it. */
  private onWindowPointerDown = (e: PointerEvent): void => {
    if (!this.topMenuOpen && !this.watchMenuOpen) return;
    const path = e.composedPath();
    const within = (name: string) => path.some((n) => n instanceof HTMLElement && n.classList.contains(name));
    if (this.topMenuOpen && !within("pe-top-menu")) this.topMenuOpen = false;
    if (this.watchMenuOpen && !within("me-watch-picker")) this.watchMenuOpen = false;
  };

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const watches = this.watches;
    const draft = this.draft;
    return html`
      <div class="pe-top">
        ${this.renderTopBar(draft, watches)}
        ${this.note ? html`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      </div>
      ${this.renderBody(watches)}
      ${this.restoreAsk ? this.renderRestoreAsk(this.restoreAsk) : nothing}
    `;
  }

  /** Whether the editor is one column: the measured width, or Home
   * Assistant saying it is a phone. Before the first measurement it is not. */
  private get stacked(): boolean {
    return this.narrow || (this.hostWidth > 0 && this.hostWidth <= ME_STACK_WIDTH);
  }

  /**
   * The top bar, the page editor's and the complication editor's: the way
   * back at the left; then the watch picker (with more than one watch),
   * where the stored copy has got to, the ··· menu, Save with when the copy
   * was saved, Pages, Watch settings and the help at the right. Undo and
   * Redo are in the canvas head. Two rows when stacked.
   */
  private renderTopBar(draft: WatchMenusDraft | undefined, watches: readonly OwnerSummary[]): TemplateResult {
    const editing = draft !== undefined && !this.unsupported;
    // The pages count too: a page's switcher settings are edited here.
    const dirty = editing && this.dirty;
    const admin = this.hass?.user?.is_admin === true;
    const shell = this.shellOwnsWatch;
    return html`<div class="wa-bar ${this.stacked ? "stacked" : ""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu ? html`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${() => this.onHaMenu?.()}>${uiIcon("menu")}</button>` : nothing}
      ${shell ? nothing : html`<button class="tb-btn tb-back" title="Back to complications"
        @click=${() => (this.onBack ? this.onBack() : navigateWatchMenus(undefined, false))}>${uiIcon("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${shell ? nothing : this.renderWatchPicker(watches)}
      ${this.renderSyncPill(editing ? draft : undefined)}
      ${this.renderTopMenu(editing ? draft : undefined)}
      ${editing ? html`<button class="primary save ${dirty ? "dirty" : ""}" ?disabled=${!dirty || this.saving}
          title=${dirty ? `Save (${MOD}S). A save reaches the watch the next time it checks.` : `Nothing to save (${MOD}S)`}
          @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>
        <span class="tb-saved" title=${dirty ? "Unsaved changes" : ""}>${renderConfigSaved(this.record)}</span>` : nothing}
      ${admin && !shell ? html`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${() => (this.onPages ? this.onPages() : navigatePagesFromMenus(undefined))}>${uiIcon("pages")}<span>Pages</span></button>` : nothing}
      ${this.barActions}
      <button class="help" title="Help: the quick menu editor" aria-label="Help"
        @click=${() => window.open(WATCH_MENUS_HELP_URL, "_blank", "noopener")}>?</button>
    </div>`;
  }

  /** Where the stored copy has got to, as the complication editor's sync
   * pill: green once a device collected it, amber otherwise. The same facts
   * as the foot bar's line (`configFootStatus`). */
  private renderSyncPill(draft: WatchMenusDraft | undefined): TemplateResult | typeof nothing {
    const record = this.record;
    if (record === undefined || record.revision <= 0 || this.unsupported) return nothing;
    const budget = draft === undefined ? { size: 0, limit: 1 } : watchMenusBudget(draft.document);
    const status = configFootStatus({ record, size: budget.size, limit: budget.limit, noun: "menus", historyState: this.historyState });
    return html`<span class="tb-sync ${status.tone === "ok" ? "ok" : "warn"}" title=${`${status.state}. ${status.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${status.state}</span>
    </span>`;
  }

  /** The "Start with the defaults" flow applies: Home Assistant holds no
   * menus for this watch, and the integration keeps them. */
  /** Whether this watch's iPhone may still move this kind here, so a start
   * waits behind a confirm (`noRecordStart`). */
  private noRecordState(watches: readonly OwnerSummary[] = this.watches): NoRecordStart {
    return noRecordStart(watches.find((w) => w.owner_watch_id === this.watchId));
  }

  private canStart(): boolean {
    const record = this.record;
    return this.watchId !== undefined && record !== undefined && record.revision <= 0 && !this.unsupported;
  }

  /** The ··· menu: Discard edits, and Start with the defaults while that
   * applies. */
  private renderTopMenu(draft: WatchMenusDraft | undefined): TemplateResult | typeof nothing {
    const start = this.canStart();
    if (draft === undefined && !start) return nothing;
    const open = this.topMenuOpen;
    const run = (fn: () => void) => () => { this.topMenuOpen = false; fn(); };
    return html`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"} aria-label="More actions" title="More"
        @click=${() => { this.topMenuOpen = !open; }}>···</button>
      ${open ? html`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${draft ? html`<button class="row" role="menuitem" ?disabled=${!this.dirty || this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${run(() => this.discard())}>Discard edits</button>` : nothing}
        ${start ? html`<button class="row" role="menuitem" ?disabled=${this.starting}
          @click=${run(() => { if (mayStart(this.noRecordState())) void this.startWithDefaults(); })}>${this.noRecordState() === "wait" ? START_FRESH_BUTTON : WATCH_MENUS_START_BUTTON}</button>` : nothing}
      </div>` : nothing}
    </span>`;
  }

  /** A watch's person color, for its glyph. */
  private personColor(watchId: string): string | undefined {
    const people = peopleOf(this.owners.length > 0 ? this.owners : (this.ownList ?? []));
    return personColorVar(people.findIndex((p) => p.owners.some((o) => o.owner_watch_id === watchId)));
  }

  /**
   * The watch picker, the complication editor's Browse picker: the shown
   * watch's glyph in its person's color, its name and a caret, opening a
   * menu of every watch with a check on the shown one. Drawn whenever there
   * is more than one watch, in every state of the body, so a watch with no
   * menus yet (only the empty card) can still be switched away from.
   */
  private renderWatchPicker(watches: readonly OwnerSummary[]): TemplateResult | typeof nothing {
    if (watches.length < 2) return nothing;
    const current = watches.find((w) => w.owner_watch_id === this.watchId);
    const open = this.watchMenuOpen;
    const glyph = (id: string | undefined) => {
      const color = id === undefined ? undefined : this.personColor(id);
      return html`<span class="pe-chip-glyph" style=${color ? `--pe-person: ${color}` : nothing} aria-hidden="true">${uiIcon("watch")}</span>`;
    };
    return html`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"}
        title="Choose the watch whose menus are shown" @click=${() => { this.watchMenuOpen = !open; }}>
        ${glyph(current?.owner_watch_id)}<span class="tb-browse-l">${current ? watchName(current, watches) : "Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${uiIcon("chevron")}</span>
      </button>
      ${open ? html`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${watches.map((w) => {
          const on = w.owner_watch_id === this.watchId;
          return html`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${on ? "true" : "false"}
            @click=${() => { this.watchMenuOpen = false; if (!on) this.openWatch(w.owner_watch_id); }}>
            ${glyph(w.owner_watch_id)}<span class="me-watch-name">${watchName(w, watches)}</span>
            <span class="me-watch-check" aria-hidden="true">${on ? uiIcon("check") : nothing}</span>
          </button>`;
        })}
      </div>` : nothing}
    </span>`;
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
   * The canvas card: the head (the shown menu's name, the watch's name as
   * text (the picker that changes it is in the top bar), the menu's facts
   * and the watch's size, then Undo and Redo), the dotted stage
   * with the floating tool strip over the watch, and the hint under it.
   * Menus have no live state, so there is no Live strip.
   */
  private renderStage(host: MenusViewHost, watches: readonly OwnerSummary[]): TemplateResult {
    const owner = watches.find((w) => w.owner_watch_id === this.watchId);
    const found = caseForScreenSize(owner?.screen_size);
    const watchCase = found ?? REFERENCE_CASE;
    const facts = [...menuStageFacts(host), watchCase.label];
    // The pages' steps while a page is picked in the switcher, as the keys.
    const draft = this.undoDraft;
    const name = menuSectionLabel(shownMenu(host));
    return html`<div class="card canvas-card me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${name}>${name}</span>
        ${owner !== undefined ? html`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${watchName(owner, watches)}</span></span>` : nothing}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${found === undefined ? `${watchCase.label}, this watch's size is not known` : facts.join(" · ")}><span class="fam">${facts.join(" · ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!draft?.canUndo} title=${`Undo (${MOD}Z)`} aria-label="Undo"
            @click=${() => this.undo()}>${uiIcon("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!draft?.canRedo} title=${IS_MAC ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${() => this.redo()}>${uiIcon("redo")}</button>
        </span>
      </div>
      <div class="stage-area me-stage-area">
        ${this.renderStageTools(watchCase.label)}
        <div class="me-stage-body">${renderMenuScreen(host)}</div>
        <div class="under"><span class="tail">${menuStageHint(host)}</span></div>
      </div>
    </div>`;
  }

  /** The floating tool strip over the stage, the page editor's: the watch's
   * size (read only) and the zoom. */
  private renderStageTools(caseLabel: string): TemplateResult {
    const scale = this.stageScale;
    const fit = stageFitZoom(this.narrow || this.stacked);
    return html`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      <button class="tb me-case" aria-disabled="true" tabindex="-1" title=${`This watch's screen, ${caseLabel}.`}>
        ${uiIcon("watch")}<span class="word keep">${caseLabel}</span></button>
      <span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${scale <= stageZoomOut(scale)} aria-label="Zoom out" title="Zoom out"
          @click=${() => this.setZoom(stageZoomOut(scale))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${stageZoomLabel(scale)}. Back to fit`}
          title=${`The watch at ${stageZoomLabel(scale)} of its own points. Click to fit it again (${stageZoomLabel(fit)}).`}
          @click=${() => this.setZoom(undefined)}>${stageZoomLabel(scale)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${scale >= stageZoomIn(scale)} aria-label="Zoom in" title="Zoom in"
          @click=${() => this.setZoom(stageZoomIn(scale))}>+</button>
      </span>
    </div>`;
  }

  private renderBody(watches: readonly OwnerSummary[]): TemplateResult {
    if (watches.length === 0) {
      const waiting = this.owners.length === 0 && this.ownList === undefined;
      return html`<div class="pe-empty">${waiting ? "Loading…" : "No watch has connected to this Home Assistant yet."}</div>`;
    }
    if (this.unsupported) return html`<div class="pe-empty"><b>${WATCH_MENUS_UPDATE_TEXT}</b></div>`;
    if (this.loading) return html`<div class="pe-empty">Loading…</div>`;
    if (this.loadError !== undefined) {
      const id = this.watchId;
      return html`<div class="pe-empty">
        <span>Could not read this watch's menus: ${this.loadError}</span>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => void this.load(id)}>Try again</button>`}
      </div>`;
    }
    const record = this.record;
    if (record === undefined) return html`<div class="pe-empty">Loading…</div>`;
    const draft = this.draft;
    const host = this.viewHost();
    if (record.revision <= 0 || draft === undefined || host === undefined) {
      const kept = this.watchId === undefined ? undefined : keptWatchMenusDraft(this.watchId);
      const id = this.watchId;
      // While the iPhone's move may still come it waits, and the start is a
      // small link that asks first.
      const state = this.noRecordState(watches);
      return html`<div class="pe-empty"><b>${WATCH_MENUS_NO_RECORD_TITLE}</b><span>${noRecordText(state, WATCH_MENUS_NO_RECORD_TEXT)}</span>
        ${state === "wait"
          ? html`<button class="link start-fresh" ?disabled=${this.starting} @click=${() => { if (mayStart(state)) void this.startWithDefaults(); }}>${this.starting ? "Starting…" : START_FRESH_BUTTON}</button>`
          : html`<button class="pe-btn pe-primary" ?disabled=${this.starting} @click=${() => void this.startWithDefaults()}>${this.starting ? "Starting…" : WATCH_MENUS_START_BUTTON}</button>`}
        ${kept?.dirty && id !== undefined ? html`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${() => { forgetWatchMenusDraft(id); this.requestUpdate(); }}>Discard the kept edits</button>` : nothing}
      </div>`;
    }
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
    </div>
    ${this.renderFoot(record, draft.document, draft.dirty)}`;
  }

  /** The stored copy's line, History and Raw configuration, pinned to the
   * foot of the editor (`config-foot.ts`), with the two dialogs they open. */
  private renderFoot(record: WatchConfigRecord, document: MenusDocument, dirty: boolean): TemplateResult {
    const budget = watchMenusBudget(document);
    const status = configFootStatus({ record, size: budget.size, limit: budget.limit, noun: "menus", historyState: this.historyState });
    const watchId = this.watchId;
    return html`${renderConfigFoot({
      status,
      historyState: this.historyState,
      historyOpen: this.historyOpen,
      rawOpen: this.rawOpen,
      onHistory: () => { this.historyOpen = true; },
      onRaw: () => { this.rawCopied = false; this.rawOpen = true; },
    })}
    ${this.historyOpen ? renderConfigHistoryDialog({
      noun: "menus",
      record,
      entries: this.history,
      historyState: this.historyState,
      dirty,
      restoring: this.restoring,
      onRetry: () => {
        if (watchId === undefined) return;
        this.historyState = "loading";
        void this.loadHistory(watchId);
      },
      // The restore question takes over from the list.
      onRestore: (entry) => { this.historyOpen = false; this.askRestore(entry); },
      onClosed: () => { this.historyOpen = false; },
    }) : nothing}
    ${this.rawOpen ? renderConfigRawDialog({
      noun: "menus",
      document,
      revision: record.revision,
      dirty,
      copied: this.rawCopied,
      onCopy: (text) => { void copyConfigText(text).then((ok) => { this.rawCopied = ok; }); },
      onClosed: () => { this.rawOpen = false; },
    }) : nothing}`;
  }

  private renderRestoreAsk(ask: RestoreAsk): TemplateResult {
    const record = this.record;
    const when = ago(ask.entry.updated_at);
    return html`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${(e: Event) => { if (this.restoring) e.preventDefault(); }}
      @close=${() => { this.restoreAsk = undefined; }}>
      <h3 id="me-ask-title">Restore revision ${ask.entry.revision}?</h3>
      <p>${savedBy(ask.entry.updated_by)}${when ? ` ${when}` : ""}, ${kb(ask.entry.size)}.</p>
      ${ask.summary ? html`<p class="pe-muted">${ask.summary}</p>` : nothing}
      <p>It is saved again as a new revision${record ? `, after revision ${record.revision}` : ""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${() => this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${() => void this.restore()}>${this.restoring ? "Restoring…" : "Restore"}</button>
      </div>
    </dialog>`;
  }

  static override styles = [formStyles, chromeTokens, topBarStyles, columnStyles, leftCardStyles, rowListStyles, canvasStyles, inspectorStyles, watchFrameStyles, css`
    /* A column, so the foot bar (config-foot.ts) can take the space left
       at the foot of a short editor; --cf-pad is the padding it reaches
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
       top edge and edge to edge as the foot bar is at the bottom, on the
       host's own background so the editor scrolls under it. Above the cards
       and their menus; the dialogs are modal, in the top layer, above it.
       Its measured height is --pe-top-h on the host (measureTop), which the
       sticky side columns stand under. */
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

    /* The bar's buttons with a glyph and words (the way back, Pages, the
       panel's Watch settings) on one line, as the panel's own bar draws them. */
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .wa-bar .tb-saved .cf-saved { margin: 0; font-size: inherit; color: inherit; }
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
      /* The room above the foot bar. */
      margin-bottom: 14px;
    }
    /* The Menus and Slots cards and the inspector stay in view while the
       editor scrolls: each sticks just under the sticky top block (the
       host's scroll box, inside its padding, starts --cf-pad down; the block
       reaches --pe-top-h down from the edge) and, when taller than the room
       left, scrolls on its own. --pe-view-h is the host's measured content
       height, less what the top block covers past the padding, what the foot
       bar covers and a little air. */
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
      .pe-layout > .column { grid-column: auto; position: static; max-height: none; overflow: visible; }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
      .pe-layout > .column.left { order: 3; }
    }

    /* The canvas card: the head, the dotted stage and its tool strip. The
       stage is the watch at a set scale, not a fitted box: it grows with
       the zoom and the editor scrolls. */
    .column.canvas > .card.canvas-card.me-canvas { min-height: 0; flex: none; }
    /* The shown menu's name: read, not typed. */
    .cv-head .cv-title { flex: 0 1 auto; min-width: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* The shown watch's name in the head: a fact; the picker is in the bar. */
    .cv-head .cv-watch { min-width: 0; font-size: 12.5px; font-weight: 500; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* The watch picker, the complication editor's Browse picker: its glyph
       in the watch's person color, the name, a caret; the menu lists every
       watch with a check on the shown one. */
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.me-watch-btn { max-width: 260px; }
    .me-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .me-watch-btn .me-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.me-watch-btn .me-caret svg { width: 11px; height: 11px; }
    .pop-menu.me-watch-menu { left: 0; right: auto; min-width: 220px; }
    .me-watch-menu .row.me-watch-row { display: flex; align-items: center; gap: 8px; }
    .me-watch-row .me-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .me-watch-row[aria-checked="true"] { font-weight: 700; }
    .me-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .me-watch-check svg.ui-icon { width: 14px; height: 14px; }
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
    .stage-tools button.tb.me-case { cursor: default; }
    .stage-tools button.tb.me-case:hover { background: transparent; }
    .stage-tools button.tb.me-case > svg.ui-icon { width: 14px; height: 14px; }

    .pe-badge {
      display: inline-block; padding: 1px 7px; border-radius: 999px; font-size: 11px; font-weight: 600;
      color: var(--wa-muted); background: var(--wa-field); white-space: nowrap;
    }

    /* The earlier saves, in the foot bar's History dialog. */
    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-history > li.offer .pe-h-text > b { color: var(--wa-accent); }
    .pe-h-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .pe-h-text > .pe-muted { font-size: 12px; }

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

    dialog.pe-ask {
      width: min(460px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    dialog.pe-ask p.pe-muted { font-size: 13px; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }

    :host([narrow]) { --cf-pad: 12px; }
  `, menuViewStyles, configFootStyles];
}

if (!customElements.get("wa-menu-editor")) {
  customElements.define("wa-menu-editor", WaMenuEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-menu-editor": WaMenuEditor;
  }
}
