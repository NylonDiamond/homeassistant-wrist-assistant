// `<wa-status-pages-editor>`: one status page of the home's library, edited
// in the library itself with no device (`library/item-mode.ts`), at
// `/library/status-pages/<id>[/<owner>]`.
//
// It wears the complication editor's chrome (`editor-chrome.ts`) the way the
// page and menu editors do: the top bar, then three columns with drag gutters
// (the Status pages and Rows cards, the canvas with the page drawn on a watch
// or an iPhone from Home Assistant's states, and the inspector). The views
// are `view.ts`.
//
// The item is read with `library/item` and kept as raw JSON in a draft
// (`draft.ts`) under `libraryDraftKey`, with undo and redo, and saved with
// `library/item/save`; a save that meets another reads the item again and
// saves over its new revision. Home Assistant maps the save onto every
// device that has the page.
//
// Every status page lives once in the library (`library/`), and a device
// picks from it: the strip under the canvas head has a tick per device
// (`library/pick`), On each device says where it is, the list under the
// page opens the library's other status pages, and Delete takes it out of
// the library. The rules are `watch-pages/library-editing.ts`.
//
// The panel loads this module on its own, with one `import()` (`hook.ts`).
// Nothing it imports may import `icons.ts`.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", items 16 and 17), and docs/one_library_plan_2026-10.md, step 3.

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
  fetchWatchConfigSummary,
  type WatchConfigSummary,
} from "../ha-api.js";
import { type LibraryItem, devicesFor, libraryItem, libraryItems, sameId } from "../library/model.js";
import { LibraryController } from "../library/store.js";
import { libraryTicksStyles, renderTicks } from "../library/ticks.js";
import { libraryErrorText } from "../library/client.js";
import {
  fetchLibraryRecord,
  DELETE_EVERY_DEVICE,
  DELETE_THIS_DEVICE,
  libraryDeleteText,
  libraryDeleteTitle,
  libraryDraftKey,
  libraryItemIO,
  type LibraryItemRef,
  libraryModeStyles,
  libraryOwners,
  otherPreviewKind,
  type PreviewKind,
  previewLabel,
  previewOwner,
  renderBarDevices,
  renderLibraryTag,
  renderPreviewPicker,
  sameLibraryItem,
  startPreviewKind,
  startSideBySide,
  summaryRevision,
} from "../library/item-mode.js";
import { onEachDeviceLines, onEachDeviceStyles, renderOnEachDevice } from "../library/on-each-device.js";
import { type ItemFilter, itemListStyles, itemWhereText, listedItems, renderItemFilter, renderNoneLeft } from "../library/item-list.js";
import { sectionCard } from "../editor-chrome.js";
import { SECTION_COLOR } from "../kinds.js";
import { sectionOpen, setSectionOpen } from "../watch-pages/fold-memory.js";
import { dirtyElsewhereText, unsavedTicksText } from "../watch-pages/library-editing.js";
import { type UntickAsk, askUntick, tickItem } from "../watch-pages/library-editing-io.js";
import { deviceColor, deviceColors } from "../device-colors.js";
import { type IconProvider, REFERENCE_CASE, caseForScreenSize } from "../renderer.js";
import { SymbolBrowser } from "../symbols.js";
import { uiIcon } from "../ui-icons.js";
import { NO_ICONS, memoIconNames, watchKeysTypeText } from "../watch-pages/editor-host.js";
import { type LinkDevice, linkDevicesOf } from "../watch-pages/devices.js";
import type { JsonObject } from "../watch-pages/model.js";
import { type WatchPagesNote, watchCommandError } from "../watch-pages/save-note.js";
import { stageFitZoom, stageZoomIn, stageZoomLabel, stageZoomOut } from "../watch-pages/stage.js";
import { watchFrameStyles } from "../watch-frame.js";
import {
  PHONE_STAGE_ZOOM,
  type PhonePagesLayout,
  phoneFrameStyles,
  phoneModelForScreenSize,
  phonePagesLayout,
  phonePagesScreen,
} from "../phone-frame.js";
import { watchAppDevices, watchName } from "../watch-settings.js";
import {
  type StatusPagesDraft,
  anyStatusPagesDirty,
  dropAllStatusPages,
  forgetStatusPagesDraft,
  keptStatusPagesDraft,
  saveStatusPagesDraft,
  takeStatusPagesRecord,
} from "./draft.js";
import { registerWatchStatusPagesDrafts } from "./hook.js";
import {
  type StatusPagesDocument,
  STATUS_PAGES_UPDATE_TEXT,
  asStatusPagesDocument,
  findStatusPage,
  statusPageId,
  statusPageName,
  statusPageTitle,
} from "./model.js";
import { statusPagesKeptText, statusPagesSaveNote } from "./save-note.js";
import {
  STATUS_PAGES_STAGE_HINT,
  type StatusPagesViewHost,
  deselectStatusRow,
  loadStatusPagesZoom,
  renderPagesCard,
  renderRowsCard,
  renderStatusInspector,
  renderStatusPageScreen,
  saveStatusPagesZoom,
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

export class WaStatusPagesEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;
  @property({ attribute: false }) haMenu = false;
  @property({ attribute: false }) onHaMenu?: () => void;
  /** Back to the Status pages tab. */
  @property({ attribute: false }) onBack?: () => void;
  /** The panel's own buttons for the bar's right end. */
  @property({ attribute: false }) barActions: TemplateResult | typeof nothing = nothing;
  /** The home keeps phone pages (`phone-pages.ts`): an iPhone is a device
   * the status page can be on, and drawn on. */
  @property({ attribute: false }) phones = false;
  /** The one status page edited (`library/item-mode.ts`), in the library
   * with no device. `watchId` is only the device it is drawn on ("Preview
   * on"); the draft is kept under `libraryDraftKey`. */
  @property({ attribute: false }) libraryItem: LibraryItemRef | undefined = undefined;
  /** Open another status page of the library, from the list. */
  @property({ attribute: false }) onOpenItem?: (id: string) => void;
  /** Open a device's board focused on it (On each device). */
  @property({ attribute: false }) onOpenBoard?: (ownerId: string) => void;

  /** The device the status page is drawn on (Preview on). */
  @state() private watchId?: string;
  /** The library item open now. */
  private openedItem?: LibraryItemRef;
  /** The preview kind was picked with the library read. */
  private previewSettled = false;
  /** The summary revision a quiet read was last asked for. */
  private followedRevision?: number;
  @state() private record?: WatchConfigRecord;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private note?: Note;
  /** An untick of a device in the tick row that would clear Status page
   * slots there, asking under the row first (`askUntick`). */
  @state() private untickAsk?: UntickAsk;
  @state() private ownList?: readonly OwnerSummary[];
  /** The library (`library/store.ts`): every status page once, with the
   * devices that have it, read from `library/summary` and read again when
   * any device's status pages change. It draws the tick strip under the
   * canvas head, the list of the other status pages, On each device and the
   * delete question. Undefined before the first read and on an integration
   * older than the library, which leaves all of them off. */
  private readonly lib = new LibraryController(this, () => this.hass, () => this.linkDevices.map((d) => d.ownerId));
  /** The delete question. */
  @state() private deleteAsk?: { pageId: string };
  /** A delete from the library is out. */
  @state() private deletingAll = false;
  @state() private topMenuOpen = false;
  @state() private zoom = loadStatusPagesZoom();
  @state() private columns: ColumnWidths = { ...SP_COLUMNS_DEFAULT };
  @state() private hostWidth = 0;
  @state() private hostHeight = 0;
  private ownListAsked = false;
  private sizeObserver?: ResizeObserver;
  private observedTop?: HTMLElement;
  private topHeight = 0;

  private readonly symbols = new SymbolBrowser(() => this.requestUpdate());
  private readonly uiState = new Map<string, unknown>();
  private iconMemo?: { provider: IconProvider; tick: number; icons: IconProvider };
  private scrubKey?: string;
  private scrubSeq = 0;
  private reloadPending = false;
  private followedSave?: Promise<unknown>;
  private shownDialog?: HTMLDialogElement;
  private loadSeq = 0;
  private readyConnection?: HassConnectionEvents;

  private get watches(): OwnerSummary[] {
    return watchAppDevices(this.owners.length > 0 ? this.owners : (this.ownList ?? []), this.phones);
  }

  /** Preview on: the kind of device drawn on, so an iPhone is drawn with no
   * iPhone in the home too. `watchId` is the home's first device of that
   * kind, or undefined with none. */
  @state() private previewKind: PreviewKind = "watch";
  /** Side by side: the other kind is drawn beside the edited preview. */
  @state() private sideBySide = false;
  /** The Status pages card: every status page, or those on no device. */
  @state() private listFilter: ItemFilter = "all";
  /** Every device's delivery numbers, for On each device. */
  @state() private configSummary?: WatchConfigSummary;
  private configSummarySeq = 0;

  /** The status page being edited, made from the record when none is kept
   * (the panel's leave guard may have dropped it). None before the record is
   * read, and none for a record this panel cannot read. */
  private get draft(): StatusPagesDraft | undefined {
    const key = this.recordKey;
    const record = this.record;
    if (key === undefined || record === undefined || record.revision <= 0) return undefined;
    const kept = keptStatusPagesDraft(key);
    if (kept !== undefined) return kept;
    const document = asStatusPagesDocument(record.document);
    return document === undefined ? undefined : takeStatusPagesRecord(key, document, record.revision).draft;
  }

  /** What the record and its kept draft are keyed by: the item's
   * `libraryDraftKey`. */
  private get recordKey(): string | undefined {
    return this.libraryItem === undefined ? undefined : libraryDraftKey(this.libraryItem);
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
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointerdown", this.onWindowPointerDown, true);
    this.columns = loadColumnWidths(SP_COLUMNS_KEY, SP_COLUMNS_DEFAULT, SP_COLUMNS);
    this.watchSize();
    this.listenForReconnect();
    if (this.openedItem !== undefined) this.openItem(true);
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
    this.loadSeq++;
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
    // The delete question opens as a modal once drawn.
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.pe-ask") ?? undefined;
    if (dialog !== this.shownDialog) {
      this.shownDialog = dialog;
      if (dialog && !dialog.open) dialog.showModal();
    }
    this.observeTop();
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
    const watchId = this.recordKey;
    if (!this.isConnected || watchId === undefined) return;
    void this.load(watchId, true);
  };

  /** The preview device (the home's first device of the kind remembered for
   * the session, a watch to start), the item read when it changes, and read
   * again quietly once the summary says it moved on elsewhere. */
  private followLibraryItem(ref: LibraryItemRef): void {
    // The kind is decided once per item, when the library says who has it.
    const owners = libraryOwners(this.lib.library, ref);
    if (!sameLibraryItem(ref, this.openedItem) || !this.previewSettled) {
      this.previewKind = startPreviewKind(this.watches, ref, owners);
      this.sideBySide = startSideBySide(this.watches, owners, this.phones);
      this.previewSettled = owners !== undefined;
    }
    const preview = previewOwner(this.watches, this.previewKind, [ref.from, ...(owners ?? [])]);
    if (preview !== this.watchId) this.watchId = preview;
    if (!sameLibraryItem(ref, this.openedItem)) {
      this.openedItem = ref;
      this.openItem();
      void this.readConfigSummary();
      return;
    }
    const moved = summaryRevision(this.lib.library, ref);
    const shown = this.record?.revision;
    if (moved !== undefined && shown !== undefined && moved > shown && moved !== this.followedRevision) {
      this.followedRevision = moved;
      void this.load(libraryDraftKey(ref), true);
    }
  }

  /** Read every device's delivery numbers, for the On each device card. An
   * integration older than the summary leaves the sync words out. */
  private async readConfigSummary(): Promise<void> {
    const hass = this.hass;
    if (hass === undefined || this.libraryItem === undefined) return;
    const seq = ++this.configSummarySeq;
    try {
      const summary = await fetchWatchConfigSummary(hass);
      if (seq === this.configSummarySeq) this.configSummary = summary;
    } catch {
      if (seq === this.configSummarySeq) this.configSummary = undefined;
    }
  }

  /** Preview on: a kind's thumbnail shows it alone; `keepBoth` (a click on
   * the other preview of Side by side) swaps which kind is edited. */
  private pickPreview(kind: PreviewKind, keepBoth = false): void {
    this.sideBySide = keepBoth;
    if (kind === this.previewKind) return;
    this.previewKind = kind;
    this.watchId = previewOwner(this.watches, kind, [this.libraryItem?.from, ...(libraryOwners(this.lib.library, this.libraryItem!) ?? [])]);
  }

  /** Open the library item, with no live line, no history and no delivery:
   * a library item has none of its own. */
  private openItem(quiet = false): void {
    const key = this.recordKey;
    if (key === undefined) return;
    if (!quiet) {
      this.reloadPending = false;
      this.note = undefined;
      this.endScrub();
      this.uiState.clear();
      this.closeDelete();
      this.followedRevision = undefined;
    }
    void this.load(key, quiet);
  }

  private followSave(): void {
    const watchId = this.recordKey;
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
    if (watchId === this.recordKey) {
      this.reloadPending = false;
      void this.load(watchId, true);
    } else {
      this.flushPending();
    }
  }

  // ── loading ────────────────────────────────────────────────────────────

  /** Read the item (`library/item`). Every caller passes `recordKey` as
   * `_key`; the read is always of `libraryItem`. A library item has no
   * delivery and no earlier saves of its own, so nothing more is read. */
  private async load(_key: string, quiet = false): Promise<void> {
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
      this.show(record);
      this.loadError = undefined;
    } catch (err) {
      if (seq !== this.loadSeq) return;
      if (!quiet) this.loadError = libraryErrorText(err);
    }
    this.loading = false;
  }

  /** Every device a status page can be on, named as the page editor names
   * them. */
  private get linkDevices(): LinkDevice[] {
    return linkDevicesOf(this.owners.length > 0 ? this.owners : (this.ownList ?? []), this.phones);
  }

  private flushPending(): void {
    const key = this.recordKey;
    if (!this.reloadPending || this.holdReload || key === undefined) return;
    this.reloadPending = false;
    void this.load(key, true);
  }

  private show(record: WatchConfigRecord): void {
    const key = this.recordKey;
    this.record = record;
    const document = record.revision > 0 ? asStatusPagesDocument(record.document) : undefined;
    if (key === undefined || document === undefined) return;
    const taken = takeStatusPagesRecord(key, document, record.revision);
    if (taken.kept.length > 0) this.note = { kind: "warn", text: statusPagesKeptText(taken.kept) };
    else if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The status pages changed somewhere else. Your edits are kept." };
    this.requestUpdate();
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

  /** The preview device's screen in points: the size it reported, else the
   * 46 mm reference. */
  private screen(): { width: number; height: number } {
    const phone = this.phoneLayout();
    if (phone !== undefined) return phonePagesScreen(phone);
    const owner = this.watches.find((w) => w.owner_watch_id === this.watchId);
    return (caseForScreenSize(owner?.screen_size) ?? REFERENCE_CASE).screen;
  }

  /** On an iPhone, where its pages screen lays itself out: a status page opens
   * over its pages area (`phone-frame.ts`). Undefined on a watch. */
  private phoneLayout(): PhonePagesLayout | undefined {
    if (this.previewKind !== "iphone") return undefined;
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
      ...this.libraryHost(),
      edit: (change, coalesce) => this.draft === draft && this.edit(change, coalesce),
      endCoalesce: () => draft.endCoalesce(),
      requestUpdate: () => this.requestUpdate(),
    };
  }

  /** The view's library parts: the one page, Delete, which asks to delete it
   * from the library, the list's filter and the library's other status pages
   * under it. Nothing of a device's own. The ticks are not the view's: they
   * stand in the strip under the canvas head (`renderStageDevices`). */
  private libraryHost(): Pick<StatusPagesViewHost, "deletePage" | "elsewhere" | "single" | "listTools"> {
    return {
      single: true,
      deletePage: (pageId) => this.askDelete(pageId),
      listTools: renderItemFilter(this.listFilter, (f) => { this.listFilter = f; }, "status page"),
      elsewhere: this.renderLibraryOthers(),
    };
  }

  // ── the library: ticks, delete ─────────────────────────────────────────

  private deviceName(ownerId: string): string {
    return this.linkDevices.find((d) => sameId(d.ownerId, ownerId))?.name ?? "the other device";
  }

  /** Why a device's tick cannot be clicked: the untick of a device whose
   * status pages in this tab hold unsaved edits, which would put it back. No
   * device is "here": the preview device ticks as any. */
  private statusTickLocked(pageId: string, ownerId: string): string | undefined {
    const lib = this.lib.library;
    const on = lib !== undefined && devicesFor(lib, "status_pages", pageId).some((o) => sameId(o, ownerId));
    if (on && (keptStatusPagesDraft(ownerId)?.dirty ?? false)) return dirtyElsewhereText(this.deviceName(ownerId));
    return undefined;
  }

  /**
   * The shown status page's devices, in the strip under the canvas head
   * where every editor has them: a chip per device, ticked where the page
   * is (`library/pick`). Ticking puts the page, as saved, on that device;
   * unsaved edits here reach it with the next save, since it is one page.
   * Nothing before the page or the library is read.
   */
  private renderStageDevices(page: JsonObject | undefined): TemplateResult | typeof nothing {
    const lib = this.lib.library;
    const item = this.libraryItem;
    if (lib === undefined || page === undefined || item === undefined) return nothing;
    const count = libraryItem(lib, "status_pages", item.id)?.owners.length ?? 0;
    return renderBarDevices("status_pages", count, this.statusTicksBody(page), this.lib.store?.savedStamp("status_pages", item.id));
  }

  /** The ticks themselves, or the save-first line while the library has no
   * entry for the page. */
  private statusTicksBody(page: JsonObject): TemplateResult {
    const lib = this.lib.library;
    const store = this.lib.store;
    const entry = lib === undefined ? undefined : libraryItem(lib, "status_pages", statusPageId(page));
    if (lib === undefined || store === undefined || entry === undefined) {
      return html`<p class="sp-lib-hint">${unsavedTicksText("status_pages")}</p>`;
    }
    const note = store.noteFor("status_pages", entry.id);
    const admin = this.hass?.user?.is_admin;
    const asked = this.untickAsk;
    const ask = asked !== undefined && asked.kind === "status_pages" && sameId(asked.itemId, entry.id) ? asked : undefined;
    return renderTicks({
      library: lib,
      kind: "status_pages",
      itemId: entry.id,
      devices: this.linkDevices,
      ...(this.libraryItem?.from === undefined ? {} : { viewing: this.libraryItem.from }),
      colorOf: (ownerId) => this.colorOf(ownerId),
      pending: store.pending,
      ...(note === undefined ? {} : { note }),
      ...(admin === undefined ? {} : { admin }),
      locked: (ownerId) => this.statusTickLocked(entry.id, ownerId),
      ...(ask === undefined ? {} : {
        ask: { ownerId: ask.ownerId, text: ask.text, onRemove: () => void this.untickNow(ask), onCancel: () => { this.untickAsk = undefined; } },
      }),
    }, (ownerId, on) => this.tickStatusPage(entry, ownerId, on));
  }

  /** A click on a chip of the status page's tick row: a tick puts it there
   * at once; an untick that would clear Status page slots there asks first
   * (`askUntick`), and otherwise takes it off at once. */
  private tickStatusPage(entry: LibraryItem, ownerId: string, on: boolean): void {
    const store = this.lib.store;
    if (store === undefined) return;
    this.untickAsk = undefined;
    if (on) {
      void tickItem(this.hass, store, ownerId, "status_pages", entry.id, true);
      return;
    }
    const names = { item: entry.name, device: this.deviceName(ownerId) };
    void askUntick(this.hass, store, ownerId, "status_pages", entry.id, names).then((ask) => { this.untickAsk = ask; });
  }

  /** Remove under the untick's question: take the status page off, then
   * say what was cleared there. */
  private async untickNow(ask: UntickAsk): Promise<void> {
    const store = this.lib.store;
    this.untickAsk = undefined;
    if (store === undefined) return;
    const result = await tickItem(this.hass, store, ask.ownerId, ask.kind, ask.itemId, false, ask.names);
    if (result.note !== undefined) this.note = result.note;
  }

  /** Delete the page: always out of the library, asked first, since there
   * is no device to remove it from. */
  private askDelete(pageId: string): void {
    const page = findStatusPage(this.draft?.document, pageId);
    if (page === undefined || this.saving) return;
    this.deleteAsk = { pageId };
  }

  private closeDelete(): void {
    this.renderRoot?.querySelector<HTMLDialogElement>("dialog.sp-del-ask")?.close();
    this.deleteAsk = undefined;
  }

  /**
   * "Delete from the library": the status page goes from every device at
   * once (`library/delete`), with every tile and menu slot that opened it.
   * Its kept draft goes too, and the way is back to the Status pages tab.
   */
  private async deleteFromLibrary(): Promise<void> {
    const ask = this.deleteAsk;
    const store = this.lib.store;
    const key = this.recordKey;
    if (!ask || store === undefined || key === undefined || this.deletingAll) return;
    this.deletingAll = true;
    const result = await store.deleteItem("status_pages", ask.pageId);
    this.deletingAll = false;
    if (key !== this.recordKey) return;
    this.closeDelete();
    if (!result.ok) {
      this.note = { kind: "err", text: `Not deleted. ${result.text}` };
      return;
    }
    forgetStatusPagesDraft(key);
    this.onBack?.();
  }

  /** The delete question: "This device" (an untick, on the device it was
   * opened from, when another device has it too) or "Every device" (plan
   * step 8). */
  private renderDeleteAsk(ask: { pageId: string }): TemplateResult | typeof nothing {
    const page = findStatusPage(this.draft?.document, ask.pageId);
    const from = this.libraryItem?.from;
    if (page === undefined) return nothing;
    const busy = this.deletingAll;
    const owners = this.lib.library === undefined ? [] : devicesFor(this.lib.library, "status_pages", ask.pageId);
    const entry = this.lib.library === undefined ? undefined : libraryItem(this.lib.library, "status_pages", ask.pageId);
    const here = from !== undefined && entry !== undefined && owners.length > 1 && owners.some((o) => sameId(o, from)) ? from : undefined;
    return html`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
      @cancel=${(e: Event) => { if (busy) e.preventDefault(); }}
      @close=${() => { if (!this.deletingAll) this.deleteAsk = undefined; }}>
      <h3 id="sp-del-title">${libraryDeleteTitle(statusPageTitle(page))}</h3>
      <p>${libraryDeleteText(owners.length, here === undefined ? undefined : this.deviceName(here))}</p>
      <div class="pe-ask-foot sp-del-foot">
        <button class="pe-btn" ?disabled=${busy} @click=${() => this.closeDelete()}>Cancel</button>
        ${here === undefined || entry === undefined ? nothing : html`<button class="pe-btn pe-danger sp-del-here" ?disabled=${busy || this.saving}
          title=${`Take it off ${this.deviceName(here)} only`}
          @click=${() => { this.closeDelete(); this.tickStatusPage(entry, here, false); }}>${DELETE_THIS_DEVICE}</button>`}
        <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${busy || this.saving}
          @click=${() => void this.deleteFromLibrary()}>${busy ? "Deleting…" : owners.length > 1 ? DELETE_EVERY_DEVICE : "Delete"}</button>
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

  /** Save the item with `library/item/save` (`libraryItemIO`). A save never
   * takes the page off a device: its Delete is the library's own, never an
   * edit. */
  private async save(): Promise<void> {
    const hass = this.hass;
    const key = this.recordKey;
    const item = this.libraryItem;
    this.endScrub();
    const draft = this.draft;
    if (!hass || key === undefined || item === undefined || !draft || this.saving || !draft.dirty) return;
    this.note = undefined;
    const running = saveStatusPagesDraft(draft, libraryItemIO(hass, this.lib.store, item));
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
    if (result.ok) void this.readConfigSummary();
    if (key === this.recordKey) this.note = statusPagesSaveNote(result);
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
    if (!this.topMenuOpen) return;
    const path = e.composedPath();
    const within = (name: string) => path.some((n) => n instanceof HTMLElement && n.classList.contains(name));
    if (!within("pe-top-menu")) this.topMenuOpen = false;
  };

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const watches = this.watches;
    const draft = this.draft;
    return html`
      <div class="pe-top">
        ${this.renderTopBar(draft)}
        ${this.note ? html`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      </div>
      ${this.renderBody(watches)}
      ${this.deleteAsk ? this.renderDeleteAsk(this.deleteAsk) : nothing}
    `;
  }

  private get stacked(): boolean {
    return this.narrow || (this.hostWidth > 0 && this.hostWidth <= SP_STACK_WIDTH);
  }

  /** The bar: back to the Status pages tab, the Library tag, then the ···
   * menu and Save. No delivery: a save reaches every device that has the
   * page, each on its own. The devices that have it are in the strip under
   * the canvas head, Preview on in the tool strip over the stage. */
  private renderTopBar(draft: StatusPagesDraft | undefined): TemplateResult {
    const editing = draft !== undefined;
    const dirty = editing && this.dirty;
    return html`<div class="wa-bar ${this.stacked ? "stacked" : ""}" role="toolbar" aria-label="Status page in the library">
      ${this.haMenu ? html`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${() => this.onHaMenu?.()}>${uiIcon("menu")}</button>` : nothing}
      <button class="tb-btn tb-back" title="Back to the Status pages tab" @click=${() => this.onBack?.()}>${uiIcon("left")}<span>Status pages</span></button>
      ${renderLibraryTag()}
      <span class="spacer"></span>
      ${this.renderTopMenu(editing ? draft : undefined)}
      ${editing ? html`<button class="primary save ${dirty ? "dirty" : ""}" ?disabled=${!dirty || this.saving}
          title=${dirty ? `Save (${MOD}S). A save reaches every device that has this status page.` : `Nothing to save (${MOD}S)`}
          @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>` : nothing}
      ${this.barActions}
    </div>`;
  }

  /** The ··· menu: Discard edits. */
  private renderTopMenu(draft: StatusPagesDraft | undefined): TemplateResult | typeof nothing {
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

  /** A device's color (`device-colors.ts`), for its glyph. */
  private colorOf(watchId: string): string | undefined {
    return deviceColor(deviceColors(this.owners.length > 0 ? this.owners : (this.ownList ?? [])), watchId);
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
      ${this.renderStageDevices(page)}
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          ${renderPreviewPicker(this.previewKind, (kind) => this.pickPreview(kind),
            this.phones ? { on: this.sideBySide, pick: () => { this.sideBySide = true; } } : undefined)}<span class="tb-sep" aria-hidden="true"></span>
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
        <div class="sp-stage-body">${this.renderLibraryStage(host)}</div>
        <div class="under"><span class="tail">${STATUS_PAGES_STAGE_HINT}</span></div>
      </div>
    </div>`;
  }

  /** The names of the devices of `kind` that have the library status page. */
  private libraryNamesOf(kind: PreviewKind): string[] {
    const ref = this.libraryItem;
    if (ref === undefined) return [];
    const owners = libraryOwners(this.lib.library, ref) ?? [];
    return this.linkDevices.filter((d) => d.kind === kind && owners.some((o) => sameId(o, d.ownerId))).map((d) => d.name);
  }

  /**
   * The stage: the edited status page under the devices of its
   * kind that have it; with Side by side, the other kind's beside it, a
   * picture whose click edits on that kind instead. A status page draws the
   * same on both kinds, so neither has a differences line. Watch first.
   */
  private renderLibraryStage(host: StatusPagesViewHost): TemplateResult {
    const kind = this.previewKind;
    const side = (k: PreviewKind, body: TemplateResult, tag: string) => html`<div class="lib-duo-side ${k}">
      <span class="lib-duo-l" title=${previewLabel(k, this.libraryNamesOf(k))}>${previewLabel(k, this.libraryNamesOf(k))}<span class="lib-duo-tag">${tag}</span></span>
      ${body}
    </div>`;
    const edited = renderStatusPageScreen(host);
    if (!this.sideBySide) return html`<div class="lib-duo">${side(kind, edited, "")}</div>`;
    const other = otherPreviewKind(kind);
    const word = other === "watch" ? "watch" : "iPhone";
    const ref = this.libraryItem;
    const id = previewOwner(this.watches, other, [ref?.from, ...(ref === undefined ? [] : libraryOwners(this.lib.library, ref) ?? [])]);
    const owner = this.watches.find((w) => w.owner_watch_id === id);
    const phone = other === "iphone" ? phonePagesLayout(phoneModelForScreenSize(owner?.screen_size)) : undefined;
    const screen = phone !== undefined ? phonePagesScreen(phone) : (caseForScreenSize(owner?.screen_size) ?? REFERENCE_CASE).screen;
    const shown: StatusPagesViewHost = { ...host, screen, scale: phone === undefined ? this.stageScale : this.stageScale * PHONE_STAGE_ZOOM };
    const companion: StatusPagesViewHost = phone === undefined ? (({ phone: _drop, ...rest }) => rest)(shown) : { ...shown, phone };
    return html`<div class="lib-duo">
      ${side(kind, edited, "editing")}
      ${side(other, html`<button type="button" class="lib-duo-other" title=${`Click to edit on the ${word}`} aria-label=${`Edit on the ${word}`}
        @click=${() => this.pickPreview(other, true)}>${renderStatusPageScreen(companion)}</button>`, "preview")}
    </div>`;
  }

  /** The On each device card: each device that has the status
   * page, its place there and whether it has the last save. Status pages
   * have no Hide here. */
  private renderDevicesCard(): TemplateResult | typeof nothing {
    const ref = this.libraryItem;
    if (ref === undefined) return nothing;
    const module = "status-pages";
    const section = "devices";
    const open = sectionOpen(this.uiState, module, section);
    const lines = onEachDeviceLines(this.lib.library, "status_pages", ref.id, this.linkDevices, this.configSummary);
    return html`<div class="sp-devices">${sectionCard({
      color: SECTION_COLOR.place,
      icon: uiIcon("layers"),
      title: "On each device",
      open,
      onToggle: () => { setSectionOpen(this.uiState, module, section, !open); this.requestUpdate(); },
      ...(open ? {} : { summary: lines.length === 0 ? "On no device yet" : `${lines.length} ${lines.length === 1 ? "device" : "devices"}` }),
      id: `${module}:${section}`,
    }, open ? renderOnEachDevice({
      kind: "status_pages",
      lines,
      colorOf: (o) => this.colorOf(o),
      busy: false,
      onHide: () => undefined,
      ...(this.onOpenBoard === undefined ? {} : { onOpenBoard: this.onOpenBoard }),
    }) : html``)}</div>`;
  }

  /** The list: every other status page of the library, a row
   * that opens it, after the open one (the view's own row). */
  private renderLibraryOthers(): TemplateResult {
    const ref = this.libraryItem;
    const lib = this.lib.library;
    if (ref === undefined || lib === undefined) return html``;
    const shown = listedItems(libraryItems(lib, "status_pages"), ref.id, this.listFilter);
    const others = shown.filter((entry) => !sameId(entry.id, ref.id));
    return html`${others.length === 0 ? nothing : html`<div class="layers sp-page-list sp-lib-others" role="list">
      ${others.map((entry) => html`<button type="button" class="layer lib-other-row ${entry.owners.length === 0 ? "nowhere" : ""}" role="listitem"
        data-lib-status=${entry.id} title=${`Open ${entry.name}`} @click=${() => this.onOpenItem?.(entry.id)}>
        <span class="grip" aria-hidden="true"></span>
        <span class="thumb sp-lib-thumb" aria-hidden="true">${uiIcon("list")}</span>
        <span class="name"><b><span class="nm-t">${entry.name}</span></b><small>${entry.detail} · ${itemWhereText(entry)}</small></span>
      </button>`)}
    </div>`}${renderNoneLeft(this.listFilter, others.length + 1, "status page")}`;
  }

  private renderBody(watches: readonly OwnerSummary[]): TemplateResult {
    if (this.loading) return html`<div class="pe-empty">Loading…</div>`;
    if (this.loadError !== undefined) {
      const id = this.recordKey;
      return html`<div class="pe-empty">
        <span>Could not read this status page: ${this.loadError}</span>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => void this.load(id)}>Try again</button>`}
      </div>`;
    }
    const record = this.record;
    if (record === undefined) return html`<div class="pe-empty">Loading…</div>`;
    // A record this panel cannot read, such as one from a newer schema.
    if (this.draft === undefined) return html`<div class="pe-empty"><b>${STATUS_PAGES_UPDATE_TEXT}</b></div>`;
    const host = this.viewHost();
    if (host === undefined) return html`<div class="pe-empty">Loading…</div>`;
    const fit = this.fittedColumns();
    const view = this.hostHeight > 0 ? `--pe-view-h:${this.hostHeight}px;` : "";
    return html`<div class="layout pe-layout ${this.stacked ? "cols-1" : "cols-3"}" style=${`--wa-left:${fit.left}px;--wa-right:${fit.right}px;${view}`}>
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
        ${this.renderDevicesCard()}
        ${renderStatusInspector(host)}
      </div>
    </div>`;
  }

  static override styles = [formStyles, chromeTokens, topBarStyles, columnStyles, leftCardStyles, rowListStyles, canvasStyles, inspectorStyles, watchFrameStyles, phoneFrameStyles, css`
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
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    /* Stacked, the way back stays first on the first line, not under it. */
    .wa-bar.stacked > button.tb-btn.tb-back { order: 0; }
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
    /* One screen tall, as the page editor: the editor never scrolls as a
       whole, and each list, the stage and the inspector scroll in their own
       box, so every card stays on screen. */
    .layout.pe-layout { padding: 0; align-items: stretch; }
    .layout.pe-layout.cols-3 { flex: 1 1 0; min-height: 0; overflow: hidden; }
    .pe-layout > .column.left { display: flex; flex-direction: column; gap: 8px; scrollbar-gutter: auto; }
    .pe-layout.cols-3 > .column.left { overflow: hidden; }
    .pe-layout.cols-3 > .column.left > .card { display: flex; flex-direction: column; min-height: 120px; }
    .pe-layout.cols-3 > .column.left > .card:first-child { flex: 0 1 auto; max-height: 50%; }
    .pe-layout.cols-3 > .column.left > .card:last-child { flex: 1 1 0; }
    .pe-layout.cols-3 > .column.left > .card > :not(.layers) { flex: none; }
    .pe-layout.cols-3 > .column.left > .card > .layers { flex: 0 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
    .pe-layout.cols-3 > .column.inspector { overflow-y: auto; overscroll-behavior: contain; }
    .pe-layout.cols-3 > .column.canvas { overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; overscroll-behavior: contain; }
    .pe-layout.cols-3 > .column.canvas > .card { flex: none; }
    .layout.pe-layout.cols-1 { flex: none; min-height: auto; overflow: visible; }
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
    .sp-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    @container (max-width: 460px) {
      .sp-stage-area { padding-top: 92px; }
    }
    .sp-stage-body { display: flex; justify-content: center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    .sp-stage-area > .under {
      display: flex; flex-direction: column; gap: 4px; align-self: center; max-width: 460px; text-align: center;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
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
    .pe-btn.pe-danger { color: var(--wa-need); align-self: flex-start; }
    dialog.pe-ask {
      width: min(460px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }
    /* The delete question's two long answers wrap under each other. */
    .pe-ask-foot.sp-del-foot { flex-wrap: wrap; }
    :host([narrow]) { --cf-pad: 12px; }
    /* On each device over the inspector's cards, and the other status pages
       under the open one, each with a list glyph. */
    .sp-devices { margin-bottom: 10px; }
    .sp-lib-others { margin-top: 2px; }
    .sp-lib-thumb { display: inline-flex; align-items: center; justify-content: center; color: var(--wa-muted); }
    .sp-lib-thumb svg.ui-icon { width: 16px; height: 16px; }
  `, statusPagesViewStyles, libraryTicksStyles, libraryModeStyles, onEachDeviceStyles, itemListStyles];
}

if (!customElements.get("wa-status-pages-editor")) {
  customElements.define("wa-status-pages-editor", WaStatusPagesEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-status-pages-editor": WaStatusPagesEditor;
  }
}
