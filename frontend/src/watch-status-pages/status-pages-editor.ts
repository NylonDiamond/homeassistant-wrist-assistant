// `<wa-status-pages-editor>`: the watch's status pages as Home Assistant
// keeps them (the `status_pages` watch config kind), and an editor for them.
//
// It wears the complication editor's chrome (`editor-chrome.ts`) the way the
// page and menu editors do: the top bar, then three columns with drag gutters
// (the Status pages and Rows cards, the canvas with the picked page drawn on
// the watch from Home Assistant's states, and the inspector), and the foot
// bar. The views are `view.ts`.
//
// The host pattern of the menu editor (`watch-menus/menu-editor.ts`): watch
// chips from the owners list, the record read with `watch_config/get` and kept
// as raw JSON in a draft (`draft.ts`) with undo and redo, a save through
// `watch_config/save` that merges by page when another save landed too, the
// earlier saves with restore, the delivery check, and the size budget.
//
// A watch with no status pages record yet opens ready on the app's five
// system pages (`status-page-defaults.json`), unsaved, under the new watch
// line (`watch-menus/new-watch.ts`); its first Save is a save over revision
// 0, which Home Assistant takes for a paired watch. While its iPhone may
// still move the status pages here it waits, and "Start fresh instead" opens
// the same ready screen.
//
// A status page can be on several devices, linked, as a page can: each page
// but the starter ones has the page editor's Devices menu (`devices-menu.ts`)
// on its row and in the Page card, a delete of a linked page asks here or on
// every device, and a Not on this list under the pages adds what the other
// devices hold. The rules are `links.ts`, the writes `links-io.ts`.
//
// The panel loads this module on its own, with one `import()`, when its route
// is `/status-pages` (`hook.ts`). Nothing it imports may import `icons.ts`.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", items 16 and 17).

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
import { HeadBar, headBarStyles, renderHeadStatus } from "../head-bar.js";
import {
  type HassLike,
  type OwnerSummary,
  type WatchConfigHistoryEntry,
  type WatchConfigRecord,
  type WatchPagesPlaces,
  fetchOwners,
  fetchWatchConfig,
  fetchWatchConfigHistory,
  fetchWatchConfigHistoryEntry,
  fetchWatchPagesPlaces,
  linkWatchPages,
  restoreWatchConfig,
  saveWatchConfig,
  subscribeWatchConfig,
} from "../ha-api.js";
import { devicesMenuStyles, renderPageDevicesMenu } from "../watch-pages/devices-menu.js";
import { isPhoneId } from "../phone-pages.js";
import { deviceColor, deviceColors } from "../device-colors.js";
import { type IconProvider, REFERENCE_CASE, caseForScreenSize } from "../renderer.js";
import { agoWords } from "../send-state.js";
import { SymbolBrowser } from "../symbols.js";
import { uiIcon } from "../ui-icons.js";
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
import { NO_ICONS, memoIconNames, watchKeysTypeText } from "../watch-pages/editor-host.js";
import {
  type LinkDevice,
  type PageDevicePlace,
  type PagesRecordFacts,
  awaitingMove,
  deleteChoices,
  deviceWord,
  elsewhereTitle,
  joinWords,
  linkBadgeText,
  linkDevicesOf,
  linkErrorText,
  pagesRecordFacts,
  statusPageHolders,
  statusPagesSharedText,
} from "../watch-pages/links.js";
import { type ElsewhereStatusPage, elsewhereStatusPages, statusPageDevicePlaces, statusPageMayLink, statusPageTitle } from "./links.js";
import { clearStatusPageRefs, takeStatusPageOff } from "./links-io.js";
import { deletedPageIds } from "../watch-pages/page-refs.js";
import { type JsonObject, isJsonObject } from "../watch-pages/model.js";
import { type WatchPagesNote, linkFailuresOf, watchCommandError, withLinkFailures } from "../watch-pages/save-note.js";
import { friendlyError } from "../friendly-error.js";
import { restoredText } from "../revision-words.js";
import { stageFitZoom, stageZoomIn, stageZoomLabel, stageZoomOut } from "../watch-pages/stage.js";
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
import { START_FRESH_BUTTON, type NoRecordStart, type SettingDevice, WAIT_FOR_IPHONE_TEXT, deliveryState, deviceNoun, followWatch, mayStart, noRecordStart, noRecordTitle, savedByLine, watchAppDevices, watchName } from "../watch-settings.js";
import {
  type StatusPagesDraft,
  anyStatusPagesDirty,
  dropAllStatusPages,
  forgetStatusPagesDraft,
  keptStatusPagesDraft,
  newWatchStatusPagesDraft,
  saveStatusPagesDraft,
  takeStatusPageAsk,
  takeStatusPagesRecord,
} from "./draft.js";
import {
  chooseStartFresh,
  firstSaveNote,
  newWatchStyles,
  opensReady,
  renderNewWatchBanner,
  renderSaveReason,
  saveBlockedText,
} from "../watch-menus/new-watch.js";
import { navigateWatchStatusPages, registerWatchStatusPagesDrafts } from "./hook.js";
import {
  type StatusPagesDocument,
  STATUS_PAGES_UPDATE_TEXT,
  asStatusPagesDocument,
  findStatusPage,
  removeStatusPage,
  sameStatusId,
  statusPageId,
  statusPageName,
  statusPagesBudget,
  statusPagesOf,
  statusPagesReadMeansUnsupported,
  statusPagesSummary,
} from "./model.js";
import { statusPagesKeptText, statusPagesSaveNote } from "./save-note.js";
import {
  STATUS_PAGES_STAGE_HINT,
  type StatusDevicesWhere,
  type StatusPagesViewHost,
  deselectStatusRow,
  loadStatusPagesZoom,
  renderPagesCard,
  renderRowsCard,
  renderStatusElsewhere,
  renderStatusInspector,
  renderStatusPageScreen,
  saveStatusPagesZoom,
  selectStatusPage,
  shownStatusPage,
  statusPagesViewStyles,
  statusStageFacts,
} from "./view.js";

registerWatchStatusPagesDrafts({ dirty: anyStatusPagesDirty, drop: dropAllStatusPages });

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
    if (!anyStatusPagesDirty()) return;
    e.preventDefault();
    e.returnValue = "";
  });
}

/** How often the view asks whether a device has collected a save. */
const DELIVERY_POLL_MS = 15_000;

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl+";

/** The lists column and the inspector, each widened by dragging the gutter
 * beside it, with the page editor's limits and defaults. */
const SP_COLUMNS = { min: 200, max: 720, middleMin: 320 } as const;
const SP_COLUMNS_DEFAULT: ColumnWidths = { left: 280, right: 340 };
export const SP_COLUMNS_KEY = "wrist-assistant-panel.status-pages.columns.v1";
/** The grid's own cost beside its three columns, CSS px. */
const SP_GRID_CHROME = 2 * 8 + 4 * 2;
/** At or below this content width the columns stack. */
const SP_STACK_WIDTH = 820;

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

function isTextField(node: EventTarget | undefined): boolean {
  if (!(node instanceof HTMLElement)) return false;
  return watchKeysTypeText(node.tagName, node instanceof HTMLInputElement ? node.type : undefined, node.isContentEditable);
}

function nothingFocused(): boolean {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active === null || active === document.body || active === document.documentElement;
}

export class WaStatusPagesEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ attribute: false }) ownerId?: string;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;
  @property({ attribute: false }) haMenu = false;
  @property({ attribute: false }) onHaMenu?: () => void;
  /** Back to the complication editor. Without it, the address less
   * `/status-pages`. */
  @property({ attribute: false }) onBack?: () => void;
  /** The panel's own buttons for the bar's right end: Watch settings. */
  @property({ attribute: false }) barActions: TemplateResult | typeof nothing = nothing;
  /** The panel's Watch app row owns the watch: it picks the watch (this
   * element follows `ownerId` wherever it goes) and holds the ways to the
   * other screens, so the bar leaves out its own watch picker and the way
   * back to complications. Off, the bar is as it always was. */
  @property({ attribute: false }) shellOwnsWatch = false;
  /** The home keeps phone pages (`phone-pages.ts`): an iPhone is a device
   * this element opens too, on its own status pages. */
  @property({ attribute: false }) phones = false;
  /** The box in the panel's Watch app header the bar is drawn in
   * (`head-bar.ts`). Without one the bar is drawn on top, as it always was. */
  @property({ attribute: false }) barHost: HTMLElement | undefined = undefined;
  private readonly headBar = new HeadBar(this);

  @state() private watchId?: string;
  @state() private record?: WatchConfigRecord;
  /** The integration does not keep status pages (too old for the kind). */
  @state() private unsupported = false;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private history: WatchConfigHistoryEntry[] = [];
  @state() private historyState: HistoryState = "loading";
  @state() private note?: Note;
  @state() private restoreAsk?: RestoreAsk;
  @state() private restoring = false;
  @state() private historyOpen = false;
  @state() private rawOpen = false;
  @state() private rawCopied = false;
  private readonly shownFootDialogs = new WeakSet<HTMLDialogElement>();
  @state() private ownList?: readonly OwnerSummary[];
  /** Where each linked page and status page is (`watch_pages/places`), for
   * the badges on linked status pages. Undefined until read, and on an
   * integration without linked pages. */
  @state() private places?: WatchPagesPlaces;
  /** The other devices' status pages as last read, for the Not on this
   * list; a device with none, or not read, is missing. */
  @state() private elsewhere: ReadonlyMap<string, StatusPagesDocument> = new Map();
  /** What each other device's status pages record said, for the watches
   * that wait for their iPhone (`awaitingMove`). */
  @state() private elsewhereFacts: ReadonlyMap<string, PagesRecordFacts> = new Map();
  /** The page whose Devices menu is open, and where. */
  @state() private devicesMenu?: { pageId: string; where: StatusDevicesWhere };
  @state() private devicesNote?: Note;
  /** What the last + in the Not on this list did. */
  @state() private elsewhereNote?: Note;
  /** A link or an unlink is out. */
  @state() private linking = false;
  /** The delete question for a page on other devices too. */
  @state() private deleteAsk?: { pageId: string };
  @state() private deletingAll = false;
  @state() private topMenuOpen = false;
  @state() private watchMenuOpen = false;
  @state() private zoom = loadStatusPagesZoom();
  @state() private columns: ColumnWidths = { ...SP_COLUMNS_DEFAULT };
  @state() private hostWidth = 0;
  @state() private hostHeight = 0;
  private ownListAsked = false;
  private sizeObserver?: ResizeObserver;
  private observedTop?: HTMLElement;
  private topHeight = 0;
  private readonly savedTicker = new SavedAgoTicker(this);

  private readonly symbols = new SymbolBrowser(() => this.requestUpdate());
  private readonly uiState = new Map<string, unknown>();
  private iconMemo?: { provider: IconProvider; tick: number; icons: IconProvider };
  private scrubKey?: string;
  private scrubSeq = 0;
  private reloadPending = false;
  private restartDraft?: { watchId: string; revision: number };
  private followedSave?: Promise<unknown>;
  private shownDialog?: HTMLDialogElement;
  private loadSeq = 0;
  private placesSeq = 0;
  private historySeq = 0;
  private subscribeSeq = 0;
  private unsubscribe?: () => Promise<void>;
  private pollTimer?: number;
  private readyConnection?: HassConnectionEvents;

  private get watches(): OwnerSummary[] {
    return watchAppDevices(this.owners.length > 0 ? this.owners : (this.ownList ?? []), this.phones);
  }

  /** The shown device, for the lines that name it. */
  private get device(): SettingDevice {
    return isPhoneId(this.watches, this.watchId) ? "iphone" : "watch";
  }

  /** The status pages being edited. While Home Assistant holds none for the
   * watch it is the new watch's ready draft (`new-watch.ts`), on the
   * defaults at revision 0 and unsaved, once the screen opens ready; none
   * while it waits for the iPhone. */
  private get draft(): StatusPagesDraft | undefined {
    const watchId = this.watchId;
    const record = this.record;
    if (watchId === undefined || record === undefined) return undefined;
    if (record.revision > 0) {
      // Made from the record when none is kept (the panel's leave guard may
      // have dropped it); none for a record this panel cannot read.
      const kept = keptStatusPagesDraft(watchId);
      if (kept !== undefined) return kept;
      const document = asStatusPagesDocument(record.document);
      return document === undefined ? undefined : takeStatusPagesRecord(watchId, document, record.revision).draft;
    }
    if (this.unsupported || !this.opensReady()) return undefined;
    return keptStatusPagesDraft(watchId) ?? newWatchStatusPagesDraft(watchId);
  }

  /** Home Assistant holds no status pages for the watch: the ready screen's
   * banner, and Save's reason while there is nothing to save. */
  private get newWatch(): boolean {
    const record = this.record;
    return record !== undefined && record.revision <= 0 && !this.unsupported;
  }

  private get saving(): boolean {
    return this.draft?.saving ?? false;
  }

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
    this.addEventListener("focusout", () => this.draft?.endCoalesce());
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // The bar goes back into the header on the next draw.
    if (this.barHost !== undefined) this.requestUpdate();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointerdown", this.onWindowPointerDown, true);
    this.columns = loadColumnWidths(SP_COLUMNS_KEY, SP_COLUMNS_DEFAULT, SP_COLUMNS);
    this.watchSize();
    this.listenForReconnect();
    if (this.watchId !== undefined) this.openWatch(this.watchId, true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.headBar.clear();
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
    this.headBar.draw(this.barHost, () => this.renderTopBar(this.draft, this.watches));
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.pe-ask") ?? undefined;
    if (dialog !== this.shownDialog) {
      this.shownDialog = dialog;
      if (dialog && !dialog.open) dialog.showModal();
    }
    openConfigDialogs(this.renderRoot, this.shownFootDialogs);
    this.observeTop();
    this.savedTicker.show(this.headBar.query(this.renderRoot, ".cf-saved") !== null
      || this.renderRoot.querySelector(".cf-saved") !== null);
  }

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

  private observeTop(): void {
    const observer = this.sizeObserver;
    if (observer === undefined) return;
    const top = this.renderRoot?.querySelector<HTMLElement>(".pe-top") ?? undefined;
    if (top === this.observedTop) return;
    if (this.observedTop !== undefined) observer.unobserve(this.observedTop);
    this.observedTop = top;
    if (top !== undefined) observer.observe(top);
  }

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
  };

  private followSave(): void {
    const watchId = this.watchId;
    if (watchId === undefined) return;
    const done = keptStatusPagesDraft(watchId)?.saveDone;
    if (done === undefined || done === this.followedSave) return;
    this.followedSave = done;
    const ended = (): void => this.saveEnded(watchId);
    void done.then(ended, ended);
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
      this.history = [];
      if (this.historyState !== "unsupported") this.historyState = "loading";
      this.closeAsk();
      this.endScrub();
      this.uiState.clear();
      this.places = undefined;
      this.elsewhere = new Map();
      this.elsewhereFacts = new Map();
      this.closeDevices();
      this.elsewhereNote = undefined;
      quiet = false;
    }
    // The Pages tab's Info page card opened this device on one page.
    const asked = takeStatusPageAsk(watchId);
    if (asked !== undefined) selectStatusPage({ uiState: this.uiState, requestUpdate: () => this.requestUpdate() }, asked);
    this.startSubscription(watchId);
    void this.load(watchId, quiet);
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
      const record = await fetchWatchConfig(hass, watchId, "status_pages");
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
      if (statusPagesReadMeansUnsupported(err)) {
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
    void this.loadPlaces(watchId);
  }

  /** Read where the linked status pages are, for their badges and Devices
   * menus, then the other devices' status pages for the Not on this list.
   * An integration without linked pages (`unknown_command`) shows none of
   * them; any other failure keeps what was known. */
  private async loadPlaces(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.placesSeq;
    try {
      const reply = await fetchWatchPagesPlaces(hass);
      if (seq !== this.placesSeq || watchId !== this.watchId) return;
      this.places = {
        pages: isJsonObject(reply?.pages) ? (reply.pages as WatchPagesPlaces["pages"]) : {},
        status_pages: isJsonObject(reply?.status_pages) ? (reply.status_pages as WatchPagesPlaces["status_pages"]) : {},
      };
    } catch (err) {
      if (seq === this.placesSeq && errCode(err) === "unknown_command") this.places = undefined;
      return;
    }
    const others = this.linkDevices.filter((d) => d.ownerId !== watchId);
    const read = await Promise.all(others.map(async (d): Promise<{ id: string; doc?: StatusPagesDocument; facts?: PagesRecordFacts }> => {
      try {
        const record = await fetchWatchConfig(hass, d.ownerId, "status_pages");
        const doc = record.revision > 0 ? asStatusPagesDocument(record.document) : undefined;
        return { id: d.ownerId, facts: pagesRecordFacts(record), ...(doc === undefined ? {} : { doc }) };
      } catch {
        // A device whose status pages could not be read lists nothing.
        return { id: d.ownerId };
      }
    }));
    if (seq !== this.placesSeq || watchId !== this.watchId) return;
    this.elsewhere = new Map(read.flatMap((r): [string, StatusPagesDocument][] => (r.doc === undefined ? [] : [[r.id, r.doc]])));
    this.elsewhereFacts = new Map(read.flatMap((r): [string, PagesRecordFacts][] => (r.facts === undefined ? [] : [[r.id, r.facts]])));
  }

  /** Every device a status page can be on, named as the page editor names
   * them. */
  private get linkDevices(): LinkDevice[] {
    return linkDevicesOf(this.owners.length > 0 ? this.owners : (this.ownList ?? []), this.phones);
  }

  private flushPending(): void {
    if (!this.reloadPending || this.holdReload || this.watchId === undefined) return;
    this.reloadPending = false;
    void this.load(this.watchId, true);
  }

  private show(record: WatchConfigRecord): void {
    const watchId = this.watchId;
    this.record = record;
    // No status pages here: a kept draft from an earlier record moves onto
    // the defaults at revision 0, its edits kept, so its first save makes
    // the record (`newWatchStatusPagesDraft`).
    if (watchId !== undefined && record.revision <= 0) newWatchStatusPagesDraft(watchId);
    const document = record.revision > 0 ? asStatusPagesDocument(record.document) : undefined;
    if (watchId === undefined || document === undefined) return;
    const restart = this.restartDraft;
    if (restart !== undefined && restart.watchId === watchId && record.revision >= restart.revision) {
      this.restartDraft = undefined;
      if (!(keptStatusPagesDraft(watchId)?.dirty ?? false)) forgetStatusPagesDraft(watchId);
    }
    const taken = takeStatusPagesRecord(watchId, document, record.revision);
    if (taken.kept.length > 0) this.note = { kind: "warn", text: statusPagesKeptText(taken.kept) };
    else if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The status pages changed somewhere else. Your edits are kept." };
    this.requestUpdate();
  }

  private async loadHistory(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass || this.historyState === "unsupported") return;
    const seq = ++this.historySeq;
    try {
      const reply = await fetchWatchConfigHistory(hass, watchId, "status_pages");
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.history = Array.isArray(reply?.entries) ? reply.entries : [];
      this.historyState = "ready";
    } catch (err) {
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.historyState = errCode(err) === "unknown_command" ? "unsupported" : "error";
    }
  }

  /** Hear every save of this watch's config: a new `status_pages` revision
   * is read and merged into the draft. */
  private startSubscription(watchId: string): void {
    const hass = this.hass;
    this.endSubscription();
    if (!hass) return;
    const seq = ++this.subscribeSeq;
    subscribeWatchConfig(hass, watchId, (event) => {
      if (seq !== this.subscribeSeq) return;
      if (event.kind === "status_pages" && event.revision !== (this.record?.revision ?? 0)) void this.load(watchId, true);
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
      const fresh = await fetchWatchConfig(hass, watchId, "status_pages");
      if (watchId !== this.watchId || this.record !== shown) return;
      if (fresh.revision === shown.revision) {
        this.record = {
          ...shown,
          delivered_revision: fresh.delivered_revision,
          delivered_at: fresh.delivered_at,
          rejected_revision: fresh.rejected_revision,
          rejected_at: fresh.rejected_at,
          rejected_reason: fresh.rejected_reason,
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

  private edit(change: (document: StatusPagesDocument) => StatusPagesDocument, coalesce?: string): boolean {
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

  /** The open watch's screen in points: the size the watch reported, else
   * the 46 mm reference. */
  private screen(): { width: number; height: number } {
    const phone = this.phoneLayout();
    if (phone !== undefined) return phonePagesScreen(phone);
    const owner = this.watches.find((w) => w.owner_watch_id === this.watchId);
    return (caseForScreenSize(owner?.screen_size) ?? REFERENCE_CASE).screen;
  }

  /** On an iPhone, where its Pages tab lays itself out: a status page opens
   * over its pages area (`phone-frame.ts`). Undefined on a watch. */
  private phoneLayout(): PhonePagesLayout | undefined {
    if (this.device !== "iphone") return undefined;
    const owner = this.watches.find((w) => w.owner_watch_id === this.watchId);
    return phonePagesLayout(phoneModelForScreenSize(owner?.screen_size));
  }

  private viewHost(): StatusPagesViewHost | undefined {
    const draft = this.draft;
    const hass = this.hass;
    if (draft === undefined || hass === undefined) return undefined;
    const self = this;
    return {
      hass,
      icons: this.memoIcons(),
      symbols: this.symbols,
      uiState: this.uiState,
      screen: this.screen(),
      // An iPhone is drawn at half the watch's zoom, so the taller phone fits.
      scale: this.phoneLayout() === undefined ? this.stageScale : this.stageScale * PHONE_STAGE_ZOOM,
      ...(this.phoneLayout() === undefined ? {} : { phone: this.phoneLayout() }),
      get document() { return draft.document; },
      get busy() { return self.saving; },
      ...this.linkHost(draft),
      edit: (change, coalesce) => this.draft === draft && this.edit(change, coalesce),
      endCoalesce: () => draft.endCoalesce(),
      requestUpdate: () => this.requestUpdate(),
    };
  }

  /** The view's link badges, its shared line, the Devices menus, the delete
   * that asks for a linked page, and the Not on this list, from the places
   * as last read. None before they are read, and on an integration without
   * linked pages. */
  private linkHost(draft: StatusPagesDraft): Pick<StatusPagesViewHost, "linkBadge" | "sharedLine" | "devices" | "deletePage" | "elsewhere"> {
    const places = this.places;
    const watchId = this.watchId;
    if (places === undefined || watchId === undefined) return {};
    const devices = this.linkDevices;
    const line = statusPagesSharedText(statusPagesOf(draft.document), watchId, places, devices);
    const menus = devices.length > 1;
    const elsewhere = this.renderElsewhere(draft.document);
    return {
      linkBadge: (page) => linkBadgeText(statusPageHolders(page, watchId, places), watchId, devices),
      ...(line === undefined ? {} : { sharedLine: line }),
      devices: (page) => {
        if (!menus || !statusPageMayLink(page)) return undefined;
        const pageId = statusPageId(page);
        const at = this.devicesMenu;
        const open = at !== undefined && sameStatusId(at.pageId, pageId) ? at.where : undefined;
        return {
          ...(open === undefined ? {} : { open }),
          toggle: (where) => (open === where ? this.closeDevices() : this.openDevices(pageId, where)),
          menu: (where) => this.renderDevicesMenu(page, where),
        };
      },
      deletePage: (pageId) => this.askDelete(pageId),
      ...(elsewhere === nothing ? {} : { elsewhere }),
    };
  }

  // ── linked status pages ────────────────────────────────────────────────

  private deviceName(ownerId: string): string {
    return this.linkDevices.find((d) => d.ownerId === ownerId)?.name ?? "the other device";
  }

  /** The watches that wait for their iPhone to move their status pages
   * here, so none can go on them yet. */
  private waitingDevices(): Set<string> {
    return awaitingMove(this.owners.length > 0 ? this.owners : (this.ownList ?? []), this.elsewhereFacts);
  }

  /** Open a page's Devices menu, and read the places again for it. */
  private openDevices(pageId: string, where: StatusDevicesWhere): void {
    this.devicesNote = undefined;
    this.devicesMenu = { pageId, where };
    if (this.watchId !== undefined) void this.loadPlaces(this.watchId);
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector?.<HTMLElement>(".pe-dev-menu")?.scrollIntoView({ block: "nearest" });
    });
  }

  private closeDevices(): void {
    this.devicesMenu = undefined;
    this.devicesNote = undefined;
  }

  /** Why no status page can go on or off another device now, or undefined:
   * a link copies the page as saved, so not over edits. */
  private linkBlocked(): string | undefined {
    if (this.saving) return "Saving. Try again once the save is done.";
    if (this.dirty) return `Save or discard your edits first. A status page goes on another device as it is saved on this ${deviceWord(this.device)}.`;
    return undefined;
  }

  /** The menu for one page (`devices-menu.ts`), the page editor's rules:
   * this device stays on, Delete takes it off here. */
  private renderDevicesMenu(page: JsonObject, where: StatusDevicesWhere): TemplateResult {
    const watchId = this.watchId ?? "";
    const pageId = statusPageId(page);
    const blocked = this.linkBlocked();
    return renderPageDevicesMenu({
      name: statusPageTitle(page),
      places: statusPageDevicePlaces(this.linkDevices, page, watchId, this.places, this.waitingDevices()),
      ...(blocked === undefined ? {} : { blocked }),
      busy: this.linking,
      ...(this.devicesNote === undefined ? {} : { note: this.devicesNote }),
      className: `at-${where}`,
      colorOf: (ownerId) => this.colorOf(ownerId),
      onToggle: (place) => void this.toggleDevice(pageId, place),
      onDone: () => this.closeDevices(),
    });
  }

  /**
   * A switch flipped. On: the page, as saved, goes on that device as a
   * linked status page (`watch_pages/link` with `kind` `status_pages`), and
   * this device's copy gets its link too, which arrives as a change. Off:
   * the page comes off that device (`takeStatusPageOff`).
   */
  private async toggleDevice(pageId: string, place: PageDevicePlace): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    const target = place.device.ownerId;
    if (!hass || watchId === undefined || target === watchId || this.linking || place.stuck !== undefined || this.linkBlocked() !== undefined) return;
    const name = place.device.name;
    this.linking = true;
    this.devicesNote = undefined;
    let note: Note;
    try {
      if (place.on) {
        const refusal = await takeStatusPageOff(hass, target, pageId, name);
        note = refusal === undefined ? { kind: "ok", text: `Taken off ${name}.` } : { kind: "err", text: refusal };
      } else {
        await linkWatchPages(hass, watchId, [pageId], [target], "status_pages");
        note = { kind: "ok", text: `Added to ${name}.` };
      }
    } catch (err) {
      note = { kind: "err", text: `Not added. ${linkErrorText(err)}` };
    } finally {
      this.linking = false;
    }
    if (watchId !== this.watchId) return;
    this.devicesNote = note;
    void this.loadPlaces(watchId);
  }

  /** The Not on this list (`elsewhereStatusPages`), or nothing. */
  private renderElsewhere(document: StatusPagesDocument): TemplateResult | typeof nothing {
    const watchId = this.watchId;
    if (watchId === undefined) return nothing;
    const groups = elsewhereStatusPages(watchId, document, this.linkDevices, this.elsewhere);
    const blocked = this.linkBlocked();
    return renderStatusElsewhere({
      title: elsewhereTitle(this.device),
      here: deviceWord(this.device),
      groups,
      colorOf: (ownerId) => this.colorOf(ownerId),
      ...(blocked === undefined ? {} : { blocked }),
      busy: this.linking,
      ...(this.elsewhereNote === undefined ? {} : { note: this.elsewhereNote }),
      onAdd: (page) => void this.addHere(page),
    });
  }

  /** + in the Not on this list: the status page, as saved on the device it
   * comes from, goes on this one, linked. It arrives as a change, and is
   * shown once it is here. */
  private async addHere(page: ElsewhereStatusPage): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    if (!hass || watchId === undefined || this.linking || this.linkBlocked() !== undefined) return;
    const from = this.deviceName(page.ownerId);
    if (keptStatusPagesDraft(page.ownerId)?.dirty ?? false) {
      this.elsewhereNote = { kind: "warn", text: `Not added: ${from} has unsaved edits to its status pages. Save or discard them first.` };
      return;
    }
    this.linking = true;
    this.elsewhereNote = undefined;
    try {
      await linkWatchPages(hass, page.ownerId, [page.pageId], [watchId], "status_pages");
      if (watchId !== this.watchId) return;
      this.elsewhereNote = { kind: "ok", text: `Added ${page.name} from ${from}.` };
      selectStatusPage({ uiState: this.uiState, requestUpdate: () => this.requestUpdate() }, page.pageId);
      void this.load(watchId, true);
    } catch (err) {
      if (watchId === this.watchId) this.elsewhereNote = { kind: "err", text: `Not added. ${linkErrorText(err)}` };
    } finally {
      this.linking = false;
    }
  }

  /** Delete a page. One on other devices too asks first, here or on every
   * device; any other goes at once, an edit Save sends, as it always did. */
  private askDelete(pageId: string): void {
    const watchId = this.watchId;
    const page = findStatusPage(this.draft?.document, pageId);
    if (watchId === undefined || page === undefined || this.saving) return;
    const holders = statusPageHolders(page, watchId, this.places);
    if (this.places === undefined || holders.length < 2) {
      this.edit((d) => removeStatusPage(d, pageId));
      return;
    }
    this.closeDevices();
    this.deleteAsk = { pageId };
  }

  private closeDelete(): void {
    this.renderRoot?.querySelector<HTMLDialogElement>("dialog.sp-del-ask")?.close();
    this.deleteAsk = undefined;
  }

  /** Delete on this device only: an edit, which Save sends. */
  private deleteHere(): void {
    const ask = this.deleteAsk;
    this.closeDelete();
    if (ask !== undefined) this.edit((d) => removeStatusPage(d, ask.pageId));
  }

  /**
   * Delete on every device: the page comes off each other device that holds
   * it at once (`takeStatusPageOff`, as unticking it there does), then off
   * this one as an edit that Save sends. A device whose copy could not be
   * taken off is named in the note; this device's delete goes ahead.
   */
  private async deleteEverywhere(): Promise<void> {
    const ask = this.deleteAsk;
    const hass = this.hass;
    const watchId = this.watchId;
    const page = ask === undefined ? undefined : findStatusPage(this.draft?.document, ask.pageId);
    if (!ask || !hass || watchId === undefined || page === undefined || this.deletingAll) return;
    const others = statusPageHolders(page, watchId, this.places).filter((id) => id !== watchId);
    this.deletingAll = true;
    const failed: string[] = [];
    for (const owner of others) {
      const refusal = await takeStatusPageOff(hass, owner, ask.pageId, this.deviceName(owner));
      if (refusal !== undefined) failed.push(refusal);
    }
    this.deletingAll = false;
    if (watchId !== this.watchId) return;
    this.deleteHere();
    const here = deviceWord(this.device);
    this.note = failed.length > 0
      ? { kind: "warn", text: `Deleted here. ${failed.join(" ")} Save to finish the delete on this ${here}.` }
      : { kind: "ok", text: `Deleted on the other devices. Save to finish the delete on this ${here}.` };
    void this.loadPlaces(watchId);
  }

  /** The delete question for a status page on other devices too. */
  private renderDeleteAsk(ask: { pageId: string }): TemplateResult | typeof nothing {
    const watchId = this.watchId;
    const page = findStatusPage(this.draft?.document, ask.pageId);
    if (watchId === undefined || page === undefined) return nothing;
    const holders = statusPageHolders(page, watchId, this.places);
    const choices = deleteChoices(holders, this.device);
    if (choices === undefined) return nothing;
    const others = holders.filter((h) => h !== watchId).map((h) => this.deviceName(h));
    const busy = this.deletingAll;
    return html`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
      @cancel=${(e: Event) => { if (busy) e.preventDefault(); }}
      @close=${() => { if (!this.deletingAll) this.deleteAsk = undefined; }}>
      <h3 id="sp-del-title">Delete "${statusPageTitle(page)}"?</h3>
      <p>It is also on ${joinWords(others)}. You can undo the delete here until you leave this page.
        ${choices.all} takes it off ${others.length === 1 ? "that device" : "those devices"} at once, which undo here does not bring back.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${busy} @click=${() => this.closeDelete()}>Cancel</button>
        <button class="pe-btn pe-danger sp-del-here" ?disabled=${busy} @click=${() => this.deleteHere()}>${choices.here}</button>
        <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${busy || this.saving}
          @click=${() => void this.deleteEverywhere()}>${busy ? "Deleting…" : choices.all}</button>
      </div>
    </dialog>`;
  }

  private undo(): void {
    if (this.draft?.undo()) this.requestUpdate();
  }

  private redo(): void {
    if (this.draft?.redo()) this.requestUpdate();
  }

  private discard(): void {
    if (this.saving) return;
    if (this.draft?.discard()) {
      this.note = { kind: "ok", text: "Edits discarded. Undo brings them back." };
      this.requestUpdate();
    }
  }

  private async save(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    this.endScrub();
    const draft = this.draft;
    if (!hass || watchId === undefined || !draft || this.saving || !draft.dirty) return;
    this.note = undefined;
    // A first save over revision 0 that Home Assistant refuses as
    // `no_record` means the watch is not paired (`firstSaveNote`).
    const first = draft.revision <= 0;
    // The status pages this save deletes: once it lands, the menu slots that
    // show them are cleared (`clearStatusPageRefs`), but for a linked menu's
    // slots to one still on another device.
    const deleted = deletedPageIds(statusPagesOf(draft.base), statusPagesOf(draft.document));
    const elsewhere = deleted.filter((id) => statusPageHolders(findStatusPage(draft.base, id), watchId, this.places).length > 1);
    const running = saveStatusPagesDraft(draft, {
      save: (base, document) => saveWatchConfig(hass, watchId, "status_pages", base, document).catch((err: unknown) => {
        throw flatError(err);
      }),
      fetch: async () => {
        const record = await fetchWatchConfig(hass, watchId, "status_pages").catch((err: unknown) => {
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
    if (watchId === this.watchId) this.note = firstSaveNote(first, result.code, statusPagesSaveNote(result));
    if (result.ok && deleted.length > 0) {
      const cleared = await clearStatusPageRefs(hass, watchId, deleted, elsewhere);
      if (cleared !== undefined && watchId === this.watchId && this.note === undefined) this.note = cleared;
    }
  }

  /** "Start fresh instead", asked first: while an iPhone may still move the
   * status pages here, open the same ready screen a watch without one opens
   * on, the defaults unsaved. Nothing is written until Save. */
  private startFresh(): void {
    const watchId = this.watchId;
    if (watchId === undefined || !mayStart(this.noRecordState())) return;
    chooseStartFresh("status_pages", watchId);
    this.note = undefined;
    this.requestUpdate();
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
    fetchWatchConfigHistoryEntry(hass, watchId, "status_pages", entry.revision).then(
      (reply) => {
        if (this.restoreAsk === ask) this.restoreAsk = { ...ask, summary: statusPagesSummary(reply.document) };
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
      const reply = await restoreWatchConfig(hass, watchId, "status_pages", ask.entry.revision, ask.baseRevision);
      note = withLinkFailures({ kind: "ok", text: restoredText(ask.entry.updated_at) }, linkFailuresOf(reply), "status pages")!;
      if (watchId === this.watchId) this.restartDraft = { watchId, revision: reply.revision };
      else if (!(keptStatusPagesDraft(watchId)?.dirty ?? false)) forgetStatusPagesDraft(watchId);
    } catch (err) {
      const code = errCode(err);
      if (code === "conflict") note = { kind: "warn", text: "Not restored. The status pages changed somewhere else, so the newest copy is shown." };
      else if (code === "no_record") note = { kind: "warn", text: `Not restored. Home Assistant no longer holds status pages for this ${deviceNoun(this.device)}.` };
      else if (code === "not_found") note = { kind: "warn", text: "Not restored. That save is no longer kept." };
      else if (code === "unknown_command") {
        this.historyState = "unsupported";
        note = { kind: "warn", text: "This version of the integration cannot restore status pages. Update it to restore an earlier save." };
      } else note = { kind: "err", text: `Could not restore: ${friendlyError(err)}` };
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
    if (!path.includes(this) && !this.headBar.holds(path) && !nothingFocused()) return;
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
      return;
    }
    if (e.key === "Escape" && this.watchMenuOpen) {
      e.preventDefault();
      this.watchMenuOpen = false;
      return;
    }
    if (e.key === "Escape" && this.devicesMenu !== undefined) {
      e.preventDefault();
      this.closeDevices();
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
    // Escape lets go of the picked row, back to the page's own settings.
    if (e.key === "Escape" && !mod && !e.altKey) {
      const host = this.viewHost();
      if (host !== undefined && deselectStatusRow(host)) e.preventDefault();
    }
  };

  private onWindowPointerDown = (e: PointerEvent): void => {
    if (!this.topMenuOpen && !this.watchMenuOpen && this.devicesMenu === undefined) return;
    const path = e.composedPath();
    const within = (name: string) => path.some((n) => n instanceof HTMLElement && n.classList.contains(name));
    if (this.topMenuOpen && !within("pe-top-menu")) this.topMenuOpen = false;
    if (this.watchMenuOpen && !within("sp-watch-picker")) this.watchMenuOpen = false;
    if (this.devicesMenu !== undefined && !within("pe-dev-menu") && !within("sp-dev-open")) this.closeDevices();
  };

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const watches = this.watches;
    const draft = this.draft;
    return html`
      <div class="pe-top">
        ${this.barHost === undefined ? this.renderTopBar(draft, watches) : nothing}
        ${this.note ? html`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      </div>
      ${this.renderBody(watches)}
      ${this.restoreAsk ? this.renderRestoreAsk(this.restoreAsk) : nothing}
      ${this.deleteAsk && !this.restoreAsk ? this.renderDeleteAsk(this.deleteAsk) : nothing}
    `;
  }

  private get stacked(): boolean {
    return this.narrow || (this.hostWidth > 0 && this.hostWidth <= SP_STACK_WIDTH);
  }

  private renderTopBar(draft: StatusPagesDraft | undefined, watches: readonly OwnerSummary[]): TemplateResult {
    const editing = draft !== undefined && !this.unsupported;
    const dirty = editing && this.dirty;
    return html`<div class="wa-bar ${this.barHost !== undefined ? "in-head" : this.stacked ? "stacked" : ""}" role="toolbar" aria-label="Watch status pages">
      ${this.haMenu ? html`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${() => this.onHaMenu?.()}>${uiIcon("menu")}</button>` : nothing}
      ${this.shellOwnsWatch ? nothing : html`<button class="tb-btn tb-back" title="Back to complications"
        @click=${() => (this.onBack ? this.onBack() : navigateWatchStatusPages(undefined, false))}>${uiIcon("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch ? nothing : this.renderWatchPicker(watches)}
      ${this.barHost !== undefined && editing ? renderHeadStatus({ newWatch: this.newWatch, dirty, saved: renderConfigSaved(this.record, undefined, this.device), device: this.device }) : nothing}
      ${this.renderSyncPill(editing ? draft : undefined)}
      ${this.renderTopMenu(editing ? draft : undefined)}
      ${editing ? html`<button class="primary save ${dirty ? "dirty" : ""}" ?disabled=${!dirty || this.saving}
          title=${dirty ? `Save (${MOD}S). A save reaches the ${deviceNoun(this.device)} the next time it checks.` : `Nothing to save (${MOD}S)`}
          @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>
        ${this.barHost !== undefined ? nothing : html`<span class="tb-saved" title=${dirty ? "Unsaved changes" : ""}>${renderConfigSaved(this.record, undefined, this.device)}</span>
        ${renderSaveReason(saveBlockedText({ newWatch: this.newWatch, dirty, saving: this.saving }))}`}` : nothing}
      ${this.barActions}
    </div>`;
  }

  private renderSyncPill(draft: StatusPagesDraft | undefined): TemplateResult | typeof nothing {
    const record = this.record;
    if (record === undefined || record.revision <= 0 || this.unsupported) return nothing;
    const budget = draft === undefined ? { size: 0, limit: 1 } : statusPagesBudget(draft.document);
    const status = configFootStatus({ record, size: budget.size, limit: budget.limit, noun: "status pages", historyState: this.historyState, device: this.device });
    return html`<span class="tb-sync ${status.tone === "ok" ? "ok" : "warn"}" title=${`${status.state}. ${status.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${status.state}</span>
    </span>`;
  }

  /** Whether this watch's iPhone may still move this kind here, so the
   * screen waits and "Start fresh instead" asks first (`noRecordStart`). */
  private noRecordState(watches: readonly OwnerSummary[] = this.watches): NoRecordStart {
    return noRecordStart(watches.find((w) => w.owner_watch_id === this.watchId));
  }

  /** With no status pages here, whether the screen opens ready
   * (`new-watch.ts`) rather than wait for the iPhone. */
  private opensReady(watches: readonly OwnerSummary[] = this.watches): boolean {
    return opensReady(this.noRecordState(watches), "status_pages", this.watchId);
  }

  /** "Start fresh instead" applies: Home Assistant holds no status pages for
   * this watch, the integration keeps them, and the screen waits for the
   * iPhone. */
  private canStartFresh(): boolean {
    return this.watchId !== undefined && this.newWatch && !this.opensReady();
  }

  /** The ··· menu: Discard edits, and Start fresh instead while the screen
   * waits for the iPhone. */
  private renderTopMenu(draft: StatusPagesDraft | undefined): TemplateResult | typeof nothing {
    const start = this.canStartFresh();
    if (draft === undefined && !start) return nothing;
    const open = this.topMenuOpen;
    const run = (fn: () => void) => () => { this.topMenuOpen = false; fn(); };
    return html`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"} aria-label="More actions" title="More"
        @click=${() => { this.topMenuOpen = !open; }}>···</button>
      ${open ? html`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${draft ? html`<button class="row" role="menuitem" ?disabled=${!this.dirty || this.saving}
          title=${this.newWatch ? "Go back to the defaults. Undo brings the edits back." : "Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${run(() => this.discard())}>Discard edits</button>` : nothing}
        ${start ? html`<button class="row" role="menuitem"
          @click=${run(() => this.startFresh())}>${START_FRESH_BUTTON}</button>` : nothing}
      </div>` : nothing}
    </span>`;
  }

  /** A watch's device color (`device-colors.ts`), for its glyph. */
  private colorOf(watchId: string): string | undefined {
    return deviceColor(deviceColors(this.owners.length > 0 ? this.owners : (this.ownList ?? [])), watchId);
  }

  private renderWatchPicker(watches: readonly OwnerSummary[]): TemplateResult | typeof nothing {
    if (watches.length < 2) return nothing;
    const current = watches.find((w) => w.owner_watch_id === this.watchId);
    const open = this.watchMenuOpen;
    const glyph = (id: string | undefined) => {
      const color = id === undefined ? undefined : this.colorOf(id);
      return html`<span class="pe-chip-glyph" style=${color ? `--pe-person: ${color}` : nothing} aria-hidden="true">${uiIcon("watch")}</span>`;
    };
    return html`<span class="picker sp-watch-picker">
      <button type="button" class="tb-browse sp-watch-btn" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"}
        title="Choose the watch whose status pages are shown" @click=${() => { this.watchMenuOpen = !open; }}>
        ${glyph(current?.owner_watch_id)}<span class="tb-browse-l">${current ? watchName(current, watches) : "Choose a watch"}</span>
        <span class="sp-caret" aria-hidden="true">${uiIcon("chevron")}</span>
      </button>
      ${open ? html`<div class="pop-menu sp-watch-menu" role="menu" aria-label="Watches">
        ${watches.map((w) => {
          const on = w.owner_watch_id === this.watchId;
          return html`<button type="button" class="row sp-watch-row" role="menuitemradio" aria-checked=${on ? "true" : "false"}
            @click=${() => { this.watchMenuOpen = false; if (!on) this.openWatch(w.owner_watch_id); }}>
            ${glyph(w.owner_watch_id)}<span class="sp-watch-name">${watchName(w, watches)}</span>
            <span class="sp-watch-check" aria-hidden="true">${on ? uiIcon("check") : nothing}</span>
          </button>`;
        })}
      </div>` : nothing}
    </span>`;
  }

  // ── the columns ────────────────────────────────────────────────────────

  private fittedColumns(): ColumnWidths {
    if (this.hostWidth > 0 && this.hostWidth <= SP_STACK_WIDTH) return this.columns;
    return fitColumnWidths(this.hostWidth - SP_GRID_CHROME, this.columns, SP_COLUMNS);
  }

  private renderGutter(side: "left" | "right"): TemplateResult {
    return html`<div class="gutter ${side}" role="separator" aria-orientation="vertical"
      aria-label=${side === "left" ? "Resize the pages and rows column" : "Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${(e: PointerEvent) => {
        const shown = this.fittedColumns();
        beginColumnDrag(e, {
          side,
          base: side === "left" ? shown.left : shown.right,
          limits: SP_COLUMNS,
          onWidth: (width) => { this.columns = { ...this.columns, [side]: width }; },
          onEnd: () => saveColumnWidths(SP_COLUMNS_KEY, this.columns),
        });
      }}
      @dblclick=${() => {
        this.columns = { ...this.columns, [side]: SP_COLUMNS_DEFAULT[side] };
        saveColumnWidths(SP_COLUMNS_KEY, this.columns);
      }}></div>`;
  }

  // ── the stage ──────────────────────────────────────────────────────────

  private get stageScale(): number {
    return this.zoom ?? stageFitZoom(this.narrow || this.stacked);
  }

  private setZoom(scale: number | undefined): void {
    this.zoom = scale;
    saveStatusPagesZoom(scale);
  }

  private renderStage(host: StatusPagesViewHost, watches: readonly OwnerSummary[]): TemplateResult {
    const owner = watches.find((w) => w.owner_watch_id === this.watchId);
    const found = caseForScreenSize(owner?.screen_size);
    const watchCase = found ?? REFERENCE_CASE;
    const phone = host.phone !== undefined;
    const caseLabel = host.phone === undefined ? watchCase.label : host.phone.model.label;
    const facts = [...statusStageFacts(host), caseLabel];
    // The percent is of the device's own points.
    const shownAs = (zoom: number): string => stageZoomLabel(phone ? zoom * PHONE_STAGE_ZOOM : zoom);
    const page = shownStatusPage(host);
    const name = page === undefined ? "Status pages" : statusPageName(page) || "Untitled page";
    const draft = this.draft;
    const scale = this.stageScale;
    const fit = stageFitZoom(this.narrow || this.stacked);
    return html`<div class="card canvas-card lit sp-canvas" aria-label="Status page">
      <div class="cv-head">
        <span class="cv-title" title=${name}>${name}</span>
        ${owner !== undefined ? html`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${watchName(owner, watches)}</span></span>` : nothing}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${facts.join(" · ")}><span class="fam">${facts.join(" · ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!draft?.canUndo} title=${`Undo (${MOD}Z)`} aria-label="Undo"
            @click=${() => this.undo()}>${uiIcon("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!draft?.canRedo} title=${IS_MAC ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${() => this.redo()}>${uiIcon("redo")}</button>
        </span>
      </div>
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <button class="tb sp-case" aria-disabled="true" tabindex="-1" title=${phone ? PHONE_SIZE_TEXT : `This watch's screen, ${watchCase.label}.`}>
            ${uiIcon(phone ? "phone" : "watch")}<span class="word keep">${caseLabel}</span></button>
          <span class="tb-sep" aria-hidden="true"></span>
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${scale <= stageZoomOut(scale)} aria-label="Zoom out" title="Zoom out"
              @click=${() => this.setZoom(stageZoomOut(scale))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${shownAs(scale)}. Back to fit`}
              title=${`The ${phone ? "iPhone" : "watch"} at ${shownAs(scale)} of its own points. Click to fit it again (${shownAs(fit)}).`}
              @click=${() => this.setZoom(undefined)}>${shownAs(scale)}</button>
            <button class="tb icon" ?disabled=${scale >= stageZoomIn(scale)} aria-label="Zoom in" title="Zoom in"
              @click=${() => this.setZoom(stageZoomIn(scale))}>+</button>
          </span>
        </div>
        <div class="sp-stage-body">${renderStatusPageScreen(host)}</div>
        <div class="under"><span class="tail">${STATUS_PAGES_STAGE_HINT}</span></div>
      </div>
    </div>`;
  }

  private renderBody(watches: readonly OwnerSummary[]): TemplateResult {
    if (watches.length === 0) {
      const waiting = this.owners.length === 0 && this.ownList === undefined;
      return html`<div class="pe-empty">${waiting ? "Loading…" : "No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`;
    }
    if (this.unsupported) return html`<div class="pe-empty"><b>${STATUS_PAGES_UPDATE_TEXT}</b></div>`;
    if (this.loading) return html`<div class="pe-empty">Loading…</div>`;
    if (this.loadError !== undefined) {
      const id = this.watchId;
      return html`<div class="pe-empty">
        <span>Could not read this ${deviceNoun(this.device)}'s status pages: ${this.loadError}</span>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => void this.load(id)}>Try again</button>`}
      </div>`;
    }
    const record = this.record;
    if (record === undefined) return html`<div class="pe-empty">Loading…</div>`;
    const draft = this.draft;
    // A record this panel cannot read, such as one from a newer schema.
    if (draft === undefined && record.revision > 0) return html`<div class="pe-empty"><b>${STATUS_PAGES_UPDATE_TEXT}</b></div>`;
    if (draft === undefined) {
      const kept = this.watchId === undefined ? undefined : keptStatusPagesDraft(this.watchId);
      const id = this.watchId;
      // No status pages here and the screen does not open ready: the
      // iPhone's move may still come, so it waits, and "Start fresh instead"
      // is a small link that asks first.
      return html`<div class="pe-empty"><b>${noRecordTitle("status pages", this.device)}</b><span>${WAIT_FOR_IPHONE_TEXT}</span>
        <button class="link start-fresh" @click=${() => this.startFresh()}>${START_FRESH_BUTTON}</button>
        ${kept?.dirty && id !== undefined ? html`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when status pages are here again.</span>
          <button class="pe-btn" @click=${() => { forgetStatusPagesDraft(id); this.requestUpdate(); }}>Discard the kept edits</button>` : nothing}
      </div>`;
    }
    const host = this.viewHost();
    if (host === undefined) return html`<div class="pe-empty">Loading…</div>`;
    const fit = this.fittedColumns();
    const view = this.hostHeight > 0 ? `--pe-view-h:${this.hostHeight}px;` : "";
    const fresh = record.revision <= 0;
    return html`${fresh && this.barHost === undefined ? renderNewWatchBanner(this.device) : nothing}
    <div class="layout pe-layout ${this.stacked ? "cols-1" : "cols-3"}" style=${`--wa-left:${fit.left}px;--wa-right:${fit.right}px;${view}`}>
      <div class="column left">
        ${renderPagesCard(host)}
        ${renderRowsCard(host)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(host, watches)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${renderStatusInspector(host)}
      </div>
    </div>
    ${fresh ? nothing : this.renderFoot(record, draft.document, draft.dirty)}`;
  }

  private renderFoot(record: WatchConfigRecord, document: StatusPagesDocument, dirty: boolean): TemplateResult {
    const budget = statusPagesBudget(document);
    const status = configFootStatus({ record, size: budget.size, limit: budget.limit, noun: "status pages", historyState: this.historyState, device: this.device });
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
      noun: "status pages",
      device: this.device,
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
      onRestore: (entry) => { this.historyOpen = false; this.askRestore(entry); },
      onClosed: () => { this.historyOpen = false; },
    }) : nothing}
    ${this.rawOpen ? renderConfigRawDialog({
      noun: "status pages",
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
    return html`<dialog class="pe-ask" aria-labelledby="sp-ask-title"
      @cancel=${(e: Event) => { if (this.restoring) e.preventDefault(); }}
      @close=${() => { this.restoreAsk = undefined; }}>
      <h3 id="sp-ask-title">Restore revision ${ask.entry.revision}?</h3>
      <p>${savedByLine(ask.entry.updated_by, this.device)}${when ? ` ${when}` : ""}, ${kb(ask.entry.size)}.</p>
      ${ask.summary ? html`<p class="pe-muted">${ask.summary}</p>` : nothing}
      <p>It is saved again as a new revision${record ? `, after revision ${record.revision}` : ""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${() => this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${() => void this.restore()}>${this.restoring ? "Restoring…" : "Restore"}</button>
      </div>
    </dialog>`;
  }

  static override styles = [formStyles, chromeTokens, topBarStyles, columnStyles, leftCardStyles, rowListStyles, canvasStyles, inspectorStyles, watchFrameStyles, phoneFrameStyles, newWatchStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
      scroll-padding-top: var(--pe-top-h, 0px);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }
    .pe-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 0;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }
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
    .layout.pe-layout { flex: none; min-height: auto; overflow: visible; align-items: start; padding: 0; margin-bottom: 14px; }
    .pe-layout > .column.left, .pe-layout > .column.inspector {
      --pe-under-top: max(0px, calc(var(--pe-top-h, 0px) - var(--cf-pad, 16px)));
      position: sticky; top: var(--pe-under-top);
      max-height: calc(var(--pe-view-h, calc(100dvh - 120px)) - 30px - var(--pe-under-top));
      overflow-y: auto; overflow-x: hidden;
    }
    .pe-layout > .column.left { display: flex; flex-direction: column; gap: 8px; scrollbar-gutter: auto; }
    .pe-layout > .column.left > .card { flex: none; }
    .pe-layout > .column.canvas { overflow: visible; min-height: auto; }
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
    .column.canvas > .card.canvas-card.sp-canvas { min-height: 0; flex: none; }
    /* The lit stage's edge in Status pages' hue, Home's Status pages door. */
    .canvas-card.sp-canvas { --wa-stage-hue: var(--wa-hue-yellow); }
    .cv-head .cv-title { flex: 0 1 auto; min-width: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cv-head .cv-watch { min-width: 0; font-size: 12.5px; font-weight: 500; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.sp-watch-btn { max-width: 260px; }
    .sp-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sp-watch-btn .sp-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.sp-watch-btn .sp-caret svg { width: 11px; height: 11px; }
    .pop-menu.sp-watch-menu { left: 0; right: auto; min-width: 220px; }
    .sp-watch-menu .row.sp-watch-row { display: flex; align-items: center; gap: 8px; }
    .sp-watch-row .sp-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .sp-watch-row[aria-checked="true"] { font-weight: 700; }
    .sp-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .sp-watch-check svg.ui-icon { width: 14px; height: 14px; }
    .sp-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    @container (max-width: 460px) {
      .sp-stage-area { padding-top: 92px; }
    }
    .sp-stage-body { display: flex; justify-content: center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    .sp-stage-area > .under {
      display: flex; flex-direction: column; gap: 4px; align-self: center; max-width: 460px; text-align: center;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
    }
    .stage-tools button.tb.sp-case { cursor: default; }
    .stage-tools button.tb.sp-case:hover { background: transparent; }
    .stage-tools button.tb.sp-case > svg.ui-icon { width: 14px; height: 14px; }
    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
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
  `, statusPagesViewStyles, devicesMenuStyles, configFootStyles, headBarStyles];
}

if (!customElements.get("wa-status-pages-editor")) {
  customElements.define("wa-status-pages-editor", WaStatusPagesEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-status-pages-editor": WaStatusPagesEditor;
  }
}
