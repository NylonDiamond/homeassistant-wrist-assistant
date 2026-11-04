// `<wa-status-pages-editor>`: one status page of the home's library, edited
// in the library itself with no device (`library/item-mode.ts`), at
// `/library/status-pages/<id>[/<owner>]`.
//
// It wears the same frame as the page editor (`watch-pages/page-frame.ts`), one
// editor layout to learn: the top bar (All status pages, the switcher's grid
// button, the name in place, "Shown on" and its chips, then Undo, Redo, Saved
// or Save, ··· and Hints), then two columns with a drag gutter (the stage with
// the page drawn on a watch or an iPhone from Home Assistant's states, and the
// inspector). The views are `view.ts`.
//
// The item is read with `library/item` and kept as raw JSON in a draft
// (`draft.ts`) under `libraryDraftKey`, with undo and redo, and saved with
// `library/item/save`; a save that meets another reads the item again and
// saves over its new revision. Home Assistant maps the save onto every
// device that has the page.
//
// Every status page lives once in the library (`library/`), and a device
// picks from it: the bar has a tick per device (`library/pick`), On each
// device says where it is, the switcher's popover opens the library's other
// status pages, and Delete takes it out of the library. The rules are
// `watch-pages/library-editing.ts`.
//
// The panel loads this module on its own, with one `import()` (`hook.ts`).
// Nothing it imports may import `icons.ts`.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", items 16 and 17), and docs/one_library_plan_2026-10.md, step 3.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { repeat } from "lit/directives/repeat.js";
import { type ColumnWidths, beginColumnDrag, fitOneColumnWidth, loadColumnWidths, saveColumnWidths } from "../column-split.js";
import {
  canvasStyles,
  chromeTokens,
  columnStyles,
  inspectorStyles,
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
import { SAVES_AT_ONCE_TEXT, SHOWN_ON_TEXT, libraryTicksStyles, renderTicks } from "../library/ticks.js";
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
  onDevicesQuestion,
  otherPreviewKind,
  type PreviewKind,
  previewLabel,
  previewOwner,
  renderStripSaved,
  sameLibraryItem,
  startPreviewKind,
  startSideBySide,
  summaryRevision,
} from "../library/item-mode.js";
import { followDeliveries, onEachDeviceLines, onEachDeviceStyles, renderOnEachDevice } from "../library/on-each-device.js";
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
import { renderLibraryWaitOuts } from "../move-wait-out.js";
import { type LinkDevice, linkDevicesOf } from "../watch-pages/devices.js";
import { randomWatchId } from "../watch-pages/edit.js";
import type { JsonObject } from "../watch-pages/model.js";
import {
  type NameFieldInput,
  type TypedName,
  ON_NO_DEVICE_TEXT,
  hintsOn,
  pageDevicesText,
  pageFrameStyles,
  renderBarMeta,
  renderHintsButton,
  renderNameInPlace,
  renderNameRow,
  renderPreviewSeg,
  renderSaveState,
  renderSwitcherButton,
  renderUndoRedo,
  setHintsOn,
} from "../watch-pages/page-frame.js";
import { type WatchPagesNote, watchCommandError } from "../watch-pages/save-note.js";
import { stageFitZoom, stageZoomIn, stageZoomLabel, stageZoomOut } from "../watch-pages/stage.js";
import { StageFitWatch } from "../watch-pages/stage-fit.js";
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
  anyStatusPagesUnsent,
  dropAllStatusPages,
  forgetStatusPagesDraft,
  keptStatusPagesDraft,
  saveStatusPagesDraft,
  statusPagesSavesDone,
  takeStatusPagesRecord,
} from "./draft.js";
import { registerWatchStatusPagesDrafts } from "./hook.js";
import {
  type StatusPagesDocument,
  STATUS_PAGES_UPDATE_TEXT,
  asStatusPagesDocument,
  findStatusPage,
  newStatusPage,
  nextStatusPageName,
  renameStatusPage,
  statusPageCopy,
  statusPageId,
  statusPageName,
  statusPageRows,
  statusPageTitle,
} from "./model.js";
import { statusPagesKeptText, statusPagesSaveNote } from "./save-note.js";
import {
  STATUS_PAGES_STAGE_HINT,
  type StatusPagesViewHost,
  deselectStatusRow,
  loadStatusPagesZoom,
  renderAddRowButton,
  renderStatusInspector,
  renderStatusPagePicture,
  renderStatusPageScreen,
  renderUndrawnRows,
  saveStatusPagesZoom,
  shownStatusPage,
  statusPagesViewStyles,
  statusStageFacts,
} from "./view.js";

registerWatchStatusPagesDrafts({ dirty: anyStatusPagesDirty, unsent: anyStatusPagesUnsent, savesDone: statusPagesSavesDone, drop: dropAllStatusPages });

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
    if (!anyStatusPagesDirty()) return;
    e.preventDefault();
    e.returnValue = "";
  });
}

/** The inspector, widened by dragging the gutter beside it. No left column
 * since the list moved into the switcher's popover. */
const SP_COLUMNS = { min: 280, max: 720, middleMin: 320 } as const;
const SP_COLUMNS_DEFAULT: ColumnWidths = { left: 0, right: 372 };
export const SP_COLUMNS_KEY = "wrist-assistant-panel.status-pages.columns.v2";
/** The grid's own cost beside its two columns, CSS px. */
const SP_GRID_CHROME = 8 + 4;
/** At or below this content width the columns stack. */
const SP_STACK_WIDTH = 820;
/** Each page card's picture in the switcher's popover, CSS px wide. */
const SP_CARD_THUMB_W = 76;

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
  /** The name being typed, in the bar or the inspector's Page. */
  @state() private renaming?: TypedName;
  /** The switcher's popover is open, and what its find field holds. */
  @state() private pickerOpen = false;
  @state() private pickerFind = "";
  /** New status page or Duplicate is out. */
  @state() private pickerBusy = false;
  /** The bar's Hints, one switch with the page editor's. */
  @state() private helpOn = hintsOn();
  /** A control to focus once drawn, by selector. */
  private focusAfter?: string;
  @state() private zoom = loadStatusPagesZoom();
  /** Fit held to the stage's width (`stage-fit.ts`). */
  private stageFit = new StageFitWatch(this, ".sp-stage-body", () => this.stageScale);
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
  /** Every device's delivery numbers, for On each device: read on open,
   * after each write and on each delivery of status pages. */
  @state() private configSummary?: WatchConfigSummary;
  private configSummarySeq = 0;
  /** Stops hearing deliveries (`followDeliveries`); set while a status page
   * is open. */
  private stopDeliveries?: () => void;

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
    this.stopDeliveries?.();
    this.stopDeliveries = undefined;
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
    if (this.focusAfter !== undefined) {
      const selector = this.focusAfter;
      this.focusAfter = undefined;
      this.renderRoot.querySelector<HTMLElement>(selector)?.focus();
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
    // Deliveries while the socket was down sent no event.
    void this.readConfigSummary();
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
    // A device picking the save up is no change: the sync words follow the
    // deliveries, as Home's do.
    if (this.stopDeliveries === undefined && this.hass !== undefined && this.isConnected) {
      this.stopDeliveries = followDeliveries(this.hass, "status_pages", () => void this.readConfigSummary());
    }
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
      this.renaming = undefined;
      this.pickerOpen = false;
      this.pickerFind = "";
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
      helpOn: this.helpOn,
      deletePage: (pageId) => this.askDelete(pageId),
      pageHead: this.renderPageHead(),
      edit: (change, coalesce) => this.draft === draft && this.edit(change, coalesce),
      endCoalesce: () => draft.endCoalesce(),
      requestUpdate: () => this.requestUpdate(),
    };
  }

  /** The first of the page's own settings: its real name, which the bar's
   * title sets too, then On each device. */
  private renderPageHead(): TemplateResult {
    const page = this.draft === undefined ? undefined : this.shownPage();
    const lib = this.lib.library;
    return html`${page === undefined ? nothing : renderNameRow(this.nameField(page))}${this.renderDevicesCard()}
      ${lib === undefined ? nothing : renderLibraryWaitOuts(this.hass, this.owners.length > 0 ? this.owners : (this.ownList ?? []), lib, "status_pages")}`;
  }

  /** The shown page, without needing a whole view host. */
  private shownPage(): JsonObject | undefined {
    const draft = this.draft;
    return draft === undefined ? undefined : shownStatusPage({ uiState: this.uiState, document: draft.document });
  }

  // ── the name ───────────────────────────────────────────────────────────

  /** What a name field draws and calls, in the bar or in the inspector. */
  private nameField(page: JsonObject): NameFieldInput {
    const pageId = statusPageId(page);
    const typed = this.renaming !== undefined && sameId(this.renaming.pageId, pageId) ? this.renaming.value : undefined;
    return {
      name: statusPageName(page),
      typed,
      label: "Status page name",
      placeholder: "Page name",
      disabled: this.saving,
      onInput: (value) => { this.renaming = { pageId, value }; },
      onCommit: () => this.commitRename(),
      onCancel: () => { this.renaming = undefined; },
    };
  }

  /** All status pages. A press on it lets go of a name being typed, which
   * starts that name's save: it goes once the save has landed, so the way out
   * never asks about edits that are on their way. */
  private leave(): void {
    const running = this.saving ? this.draft?.saveDone : undefined;
    if (running === undefined) {
      this.onBack?.();
      return;
    }
    const go = (): void => this.onBack?.();
    void running.then(go, go);
  }

  /** The typed name into the draft, one undo step. Empty, or the name it
   * already had, writes nothing and the field goes back. Whether it wrote. */
  private writeTypedName(): boolean {
    const renaming = this.renaming;
    if (renaming === undefined) return false;
    this.renaming = undefined;
    const name = renaming.value.trim();
    const page = findStatusPage(this.draft?.document, renaming.pageId);
    if (page === undefined || name === "" || name === statusPageName(page)) return false;
    this.draft?.endCoalesce();
    return this.edit((d) => renameStatusPage(d, renaming.pageId, name));
  }

  /** Enter, or clicking away from a name field. Like the device chips, the
   * name saves at once, and Undo steps it back: with no other edit waiting it
   * goes straight out. With edits waiting it joins them, since a save sends
   * the page whole, and the bar's Save says so. */
  private commitRename(): void {
    const clean = this.draft?.dirty === false;
    if (this.writeTypedName() && clean) void this.save();
  }

  // ── the switcher ───────────────────────────────────────────────────────

  private togglePicker(): void {
    if (this.pickerOpen) {
      this.closePicker(true);
      return;
    }
    this.topMenuOpen = false;
    this.pickerOpen = true;
    this.pickerFind = "";
    this.focusAfter = ".pe-pp-find";
  }

  private closePicker(refocus: boolean): void {
    if (!this.pickerOpen) return;
    this.pickerOpen = false;
    if (refocus) this.focusAfter = ".pe-pp";
  }

  /** Open another status page of the library here. The open page's edits
   * stay in its kept draft until it is opened again. */
  private openPickedPage(id: string): void {
    this.closePicker(false);
    if (this.libraryItem !== undefined && sameId(id, this.libraryItem.id)) {
      this.focusAfter = ".pe-pp";
      return;
    }
    this.onOpenItem?.(id);
  }

  /** Why New status page and Duplicate cannot make one now, or undefined when
   * they can: a page the library makes is on no device, an administrator's,
   * as on the board. */
  private pickerMakeRefusal(): string | undefined {
    if (this.lib.store === undefined) return "The library is not read yet.";
    if (this.hass?.user?.is_admin !== true) return "Only an administrator can make a status page.";
    if (this.pickerBusy) return "Making the status page…";
    return undefined;
  }

  /** New status page: empty, named as the app names the next one, on no device
   * yet, then open here. */
  private async newPickedPage(): Promise<void> {
    const lib = this.lib.library;
    const name = nextStatusPageName({ schemaVersion: 1, statusPages: lib === undefined ? [] : libraryItems(lib, "status_pages").map((e) => e.item) });
    await this.makeLibraryPage(newStatusPage(name, randomWatchId().toUpperCase()), "Not made");
  }

  /** Duplicate: the open page as it stands here, unsaved edits and all, as a
   * new page named "<name> copy", on no device yet, then open here. */
  private async duplicatePage(): Promise<void> {
    this.writeTypedName();
    const page = this.shownPage();
    if (page === undefined) return;
    await this.makeLibraryPage(statusPageCopy(page, `${statusPageName(page)} copy`), "Not copied");
  }

  private async makeLibraryPage(page: JsonObject, failed: string): Promise<void> {
    const store = this.lib.store;
    if (store === undefined || this.pickerMakeRefusal() !== undefined) return;
    this.pickerBusy = true;
    const made = await store.createItem("status_pages", { schemaVersion: 1, statusPages: [page] });
    this.pickerBusy = false;
    if (!made.ok) {
      this.note = { kind: "err", text: `${failed}. ${made.text}` };
      return;
    }
    this.pickerOpen = false;
    this.onOpenItem?.(made.reply.id);
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
   * The shown status page's devices in the bar, after the name and a divider,
   * as on Pages: "Shown on", a checkbox chip per device where the page is
   * (`library/pick`), "+ Add to a device", then "saves at once", since these
   * skip Save. Ticking puts the page, as saved, on that device; unsaved edits
   * here reach it with the next save, since it is one page. Nothing before
   * the page or the library is read.
   */
  private renderBarTicks(page: JsonObject | undefined): TemplateResult | typeof nothing {
    const lib = this.lib.library;
    const item = this.libraryItem;
    if (lib === undefined || page === undefined || item === undefined) return nothing;
    const count = libraryItem(lib, "status_pages", item.id)?.owners.length ?? 0;
    return html`<span class="pe-bar-div" aria-hidden="true"></span>
      <div class="pe-bar-on ${count === 0 ? "none" : ""}" role="group" aria-label=${onDevicesQuestion("status_pages")}>
        ${this.statusTicksBody(page)}${renderStripSaved(this.lib.store?.savedStamp("status_pages", item.id))}
      </div>`;
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
      lead: entry.owners.length === 0 ? ON_NO_DEVICE_TEXT : SHOWN_ON_TEXT,
      saves: SAVES_AT_ONCE_TEXT,
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
    const names = { item: entry.name, device: this.deviceName(ownerId) };
    if (on) {
      void tickItem(this.hass, store, ownerId, "status_pages", entry.id, true, names);
      return;
    }
    void askUntick(this.hass, store, ownerId, "status_pages", entry.id, names).then((ask) => { this.untickAsk = ask; });
  }

  /** Remove under the untick's question: take the status page off, then
   * say what was cleared there. */
  private async untickNow(ask: UntickAsk): Promise<void> {
    const store = this.lib.store;
    this.untickAsk = undefined;
    if (store === undefined) return;
    let said: Note | undefined;
    const result = await tickItem(this.hass, store, ask.ownerId, ask.kind, ask.itemId, false, ask.names, {
      onUndone: () => { if (said !== undefined && this.note === said) this.note = undefined; },
    });
    if (result.note !== undefined) {
      said = result.note;
      this.note = said;
    }
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
   * The way is back to the Status pages tab at once, with Undo: the delete
   * is sent when its toast goes (`delete-later.ts`), and the kept draft
   * goes with it then.
   */
  private deleteFromLibrary(): void {
    const ask = this.deleteAsk;
    const store = this.lib.store;
    const key = this.recordKey;
    if (!ask || store === undefined || key === undefined || this.deletingAll) return;
    const library = store.library;
    const name = (library === undefined ? undefined : libraryItem(library, "status_pages", ask.pageId)?.name) ?? "the status page";
    this.closeDelete();
    store.deleteItemLater("status_pages", ask.pageId, `Deleted ${name}.`, async () => {
      forgetStatusPagesDraft(key);
      return undefined;
    });
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
    // A name still being typed is part of what gets saved.
    this.writeTypedName();
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
    if (e.key === "Escape" && this.pickerOpen) {
      // From its find field too.
      e.preventDefault();
      this.closePicker(true);
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
    if (!this.topMenuOpen && !this.pickerOpen) return;
    const path = e.composedPath();
    const within = (name: string) => path.some((n) => n instanceof HTMLElement && n.classList.contains(name));
    if (this.pickerOpen && !within("pe-pp-wrap")) this.closePicker(false);
    if (this.topMenuOpen && !within("pe-top-menu")) this.topMenuOpen = false;
  };

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const draft = this.draft;
    return html`
      <div class="pe-top">
        ${this.renderTopBar(draft)}
        ${this.note ? html`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      </div>
      ${this.renderBody()}
      ${this.deleteAsk ? this.renderDeleteAsk(this.deleteAsk) : nothing}
    `;
  }

  private get stacked(): boolean {
    return this.narrow || (this.hostWidth > 0 && this.hostWidth <= SP_STACK_WIDTH);
  }

  /**
   * The bar, the page editor's frame (mock-pages, item 11): All status pages,
   * a divider, the switcher's grid button, the name in place, the rows and
   * Shared, the devices (`renderBarTicks`), then a divider and the fixed right
   * cluster: Undo and Redo, Saved or Save, the ··· menu and Hints. No
   * delivery: a save reaches every device that has the page, each on its own.
   * Drawn in every state, so a page still loading can still be left.
   */
  private renderTopBar(draft: StatusPagesDraft | undefined): TemplateResult {
    const page = draft === undefined || this.loading || this.loadError !== undefined || this.record === undefined ? undefined : this.shownPage();
    return html`<div class="wa-bar pe-bar" role="group" aria-label="Status page editor">
      ${this.haMenu ? html`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${() => this.onHaMenu?.()}>${uiIcon("menu")}</button>` : nothing}
      <button type="button" class="tb-btn tb-back pe-bar-back" title="Back to the Status pages board" @click=${() => this.leave()}>${uiIcon("left")}<span>All status pages</span></button>
      ${page === undefined ? nothing : html`<span class="pe-bar-div" aria-hidden="true"></span>
        ${this.renderPagePicker(page)}
        ${this.renderBarTicks(page)}`}
      <span class="spacer"></span>
      <div class="pe-bar-right">
        <span class="pe-bar-div" aria-hidden="true"></span>
        ${draft === undefined ? nothing : html`${renderUndoRedo({ canUndo: draft.canUndo, canRedo: draft.canRedo, onUndo: () => this.undo(), onRedo: () => this.redo() })}
          ${renderSaveState({ dirty: draft.dirty, saving: this.saving, reach: "A save reaches every device that has this status page.", onSave: () => void this.save() })}`}
        ${this.renderTopMenu(draft)}
        ${renderHintsButton(this.helpOn, () => { this.helpOn = !this.helpOn; setHintsOn(this.helpOn); })}
        ${this.barActions}
      </div>
    </div>`;
  }

  /** The page's head in the bar: the switcher's grid button with its popover,
   * the name in place, and how many rows with Shared. */
  private renderPagePicker(page: JsonObject): TemplateResult {
    const name = statusPageName(page) || "Untitled page";
    const rows = statusPageRows(page).length;
    const open = this.pickerOpen;
    return html`<div class="pe-pp-wrap">
        ${renderSwitcherButton({ open, title: "Pick a status page to edit, or make one", label: `Switch status page. Editing ${name}`, onClick: () => this.togglePicker() })}
        ${open ? this.renderPickerPopover(page) : nothing}
      </div>
      ${renderNameInPlace(this.nameField(page))}
      ${renderBarMeta(`${rows} ${rows === 1 ? "row" : "rows"}`, "One status page for every device that has it. A save reaches all of them.")}`;
  }

  /**
   * The switcher's popover, as on Pages: "Pick a status page to edit" with the
   * count and a find field (by name), the library's status pages as cards in
   * its order, each with its picture, its name and the devices it is on, the
   * open one tagged Editing, then New status page; under them Duplicate and
   * Open the Status pages board.
   */
  private renderPickerPopover(page: JsonObject): TemplateResult {
    const ref = this.libraryItem;
    const openId = ref?.id ?? statusPageId(page);
    const lib = this.lib.library;
    const items = lib === undefined ? [] : libraryItems(lib, "status_pages");
    // The open page from the draft, so its card shows the edits; in its own
    // place, or first when the library does not list it yet.
    type Card = { id: string; page: JsonObject; name: string; sub: string };
    const devicesOf = (owners: readonly string[]) => pageDevicesText(owners.map((o) => this.deviceName(o)));
    const own: Card = {
      id: openId, page, name: statusPageName(page) || "Untitled page",
      sub: devicesOf(lib === undefined ? [] : devicesFor(lib, "status_pages", openId)),
    };
    const cards: Card[] = items.map((entry) => (sameId(entry.id, openId) ? own : {
      id: entry.id, page: entry.item as JsonObject, name: entry.name, sub: devicesOf(entry.owners),
    }));
    if (!cards.includes(own)) cards.unshift(own);
    const find = this.pickerFind.trim().toLowerCase();
    const shown = find === "" ? cards : cards.filter((c) => c.name.toLowerCase().includes(find));
    const makeRefusal = this.pickerMakeRefusal();
    const hass = this.hass;
    const scale = SP_CARD_THUMB_W / REFERENCE_CASE.screen.width;
    return html`<div class="pe-pp-pop" role="dialog" aria-label="Switch status page">
      <div class="pe-pp-top">
        <strong>Pick a status page to edit</strong>
        <span class="pe-pp-count">${cards.length} ${cards.length === 1 ? "status page" : "status pages"}</span>
        <input type="search" class="pe-pp-find" placeholder="Find a status page" aria-label="Find a status page" .value=${live(this.pickerFind)}
          @input=${(e: Event) => { this.pickerFind = (e.target as HTMLInputElement).value; }} />
      </div>
      <div class="pe-pp-grid" role="group" aria-label="Status pages">
        ${repeat(shown, (c) => c.id.toUpperCase(), (c) => {
          const current = sameId(c.id, openId);
          return html`<button type="button" class="pe-pp-card ${current ? "on" : ""}" data-pick-page=${c.id}
            aria-current=${current ? "true" : "false"} title=${current ? `Editing ${c.name}` : `Open ${c.name}`}
            @click=${() => this.openPickedPage(c.id)}>
            <span class="sp-pp-pic" aria-hidden="true">${hass === undefined ? nothing : renderStatusPagePicture({
              page: c.page, hass, icons: this.memoIcons(), screen: REFERENCE_CASE.screen, scale,
            })}</span>
            <span class="pe-pp-card-name">${c.name}</span>
            <span class="pe-pp-card-sub">${c.sub}</span>
            ${current ? html`<span class="pe-pp-tag">Editing</span>` : nothing}
          </button>`;
        })}
        <button type="button" class="pe-pp-card pe-pp-new" ?disabled=${makeRefusal !== undefined}
          title=${makeRefusal ?? "An empty status page in the library, on no device yet"} @click=${() => void this.newPickedPage()}>
          <span class="pe-pp-plus" aria-hidden="true">${uiIcon("plus")}</span><span class="pe-pp-card-name">New status page</span>
        </button>
      </div>
      ${shown.length === 0 ? html`<p class="pe-pp-none">No status page's name has "${this.pickerFind.trim()}" in it.</p>` : nothing}
      <div class="pe-pp-foot">
        <button type="button" class="pe-btn pe-pp-dup" ?disabled=${makeRefusal !== undefined}
          title=${makeRefusal ?? "A copy of this status page as it is now, in the library, on no device yet"}
          @click=${() => void this.duplicatePage()}>${uiIcon("duplicate")}<span>Duplicate</span></button>
        <button type="button" class="pe-link pe-pp-board" @click=${() => { this.closePicker(false); this.onBack?.(); }}>Open the Status pages board</button>
      </div>
    </div>`;
  }

  /** The ··· menu: what the preview is drawn on and the page's facts, as a
   * line at its top as on Pages, then Discard edits. */
  private renderTopMenu(draft: StatusPagesDraft | undefined): TemplateResult | typeof nothing {
    if (draft === undefined) return nothing;
    const open = this.topMenuOpen;
    const run = (fn: () => void) => () => { this.topMenuOpen = false; fn(); };
    const host = open ? this.viewHost() : undefined;
    const owner = this.watches.find((w) => w.owner_watch_id === this.watchId);
    const label = host?.phone === undefined ? (caseForScreenSize(owner?.screen_size) ?? REFERENCE_CASE).label : host.phone.model.label;
    const facts = host === undefined ? [] : [...statusStageFacts(host), label];
    return html`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"} aria-label="More actions" title="More"
        @click=${() => { this.topMenuOpen = !open; }}>···</button>
      ${open ? html`<div class="pop-menu side-pop pe-menu" role="menu" aria-label="More actions">
        ${facts.length === 0 ? nothing : html`<div class="pe-menu-facts">
          ${owner === undefined ? nothing : html`<b class="pe-watch-crumb">${watchName(owner, this.watches)}</b>`}
          <span>${facts.join(" · ")}</span>
        </div>`}
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
    return { left: 0, right: fitOneColumnWidth(this.hostWidth - SP_GRID_CHROME, this.columns.right, SP_COLUMNS) };
  }

  private renderGutter(): TemplateResult {
    return html`<div class="gutter right" role="separator" aria-orientation="vertical"
      aria-label="Resize the settings column"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${(e: PointerEvent) => {
        beginColumnDrag(e, {
          side: "right",
          base: this.fittedColumns().right,
          limits: SP_COLUMNS,
          onWidth: (width) => { this.columns = { ...this.columns, right: width }; },
          onEnd: () => saveColumnWidths(SP_COLUMNS_KEY, this.columns),
        });
      }}
      @dblclick=${() => {
        this.columns = { ...this.columns, right: SP_COLUMNS_DEFAULT.right };
        saveColumnWidths(SP_COLUMNS_KEY, this.columns);
      }}></div>`;
  }

  // ── the stage ──────────────────────────────────────────────────────────

  private get stageScale(): number {
    return this.zoom ?? this.stageFit.fit(stageFitZoom(this.narrow || this.stacked));
  }

  private setZoom(scale: number | undefined): void {
    this.zoom = scale;
    saveStatusPagesZoom(scale);
  }

  /**
   * The stage, as on Pages: the big + Add row at its top, the hint while
   * Hints is on, the device in the middle with its rows to pick and drag, the
   * rows it cannot draw now under it, and at its foot the dock: the zoom, Fit,
   * then Preview on (Watch, iPhone, Both).
   */
  private renderStage(host: StatusPagesViewHost): TemplateResult {
    const phone = host.phone !== undefined;
    const device = phone ? "iPhone" : "watch";
    // The percent is of the device's own points.
    const shownAs = (zoom: number): string => stageZoomLabel(phone ? zoom * PHONE_STAGE_ZOOM : zoom);
    const scale = this.stageScale;
    const fitting = this.zoom === undefined;
    const fit = this.stageFit.fit(stageFitZoom(this.narrow || this.stacked));
    return html`<div class="card canvas-card lit sp-canvas" aria-label="Status page">
      <div class="stage-area sp-stage-area">
        <div class="pe-stage-top">${renderAddRowButton(host)}</div>
        ${this.helpOn ? html`<div class="under"><span class="tail">${STATUS_PAGES_STAGE_HINT}</span></div>` : nothing}
        <div class="sp-stage-body">${this.renderLibraryStage(host)}</div>
        ${renderUndrawnRows(host)}
        <div class="pe-dock-area">
          <div class="stage-tools pe-dock" role="toolbar" aria-label="Stage tools">
            <span class="tb-zoom" role="group" aria-label="Zoom">
              <button class="tb icon pe-zoom-out" ?disabled=${scale <= stageZoomOut(scale)} aria-label="Zoom out" title="Zoom out"
                @click=${() => this.setZoom(stageZoomOut(scale))}>−</button>
              <span class="pe-zoom-pct" role="status" title=${`The ${device} at ${shownAs(scale)} of its own points`}>${shownAs(scale)}</span>
              <button class="tb icon pe-zoom-in" ?disabled=${scale >= stageZoomIn(scale)} aria-label="Zoom in" title="Zoom in"
                @click=${() => this.setZoom(stageZoomIn(scale))}>+</button>
              <button class="tb pe-fit ${fitting ? "lit" : ""}" aria-pressed=${fitting ? "true" : "false"}
                title=${fitting ? `Fitting the ${device} to the stage (${shownAs(fit)})` : `Fit the ${device} to the stage again (${shownAs(fit)})`}
                @click=${() => this.setZoom(undefined)}>Fit</button>
            </span>
            <span class="tb-sep" aria-hidden="true"></span>
            ${renderPreviewSeg({
              kind: this.previewKind,
              duo: this.sideBySide,
              phones: this.phones,
              onPick: (k) => this.pickPreview(k),
              onBoth: () => { this.sideBySide = true; },
            })}
          </div>
        </div>
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
    const shown: StatusPagesViewHost = { ...host, still: true, screen, scale: phone === undefined ? this.stageScale : this.stageScale * PHONE_STAGE_ZOOM };
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

  private renderBody(): TemplateResult {
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
    return html`<div class="layout pe-layout ${this.stacked ? "cols-1" : "sp-wide"}" style=${`--wa-right:${fit.right}px;${view}`}>
      <div class="column canvas">
        ${this.renderStage(host)}
      </div>
      ${this.renderGutter()}
      <div class="column inspector card">
        ${renderStatusInspector(host)}
      </div>
    </div>`;
  }

  static override styles = [formStyles, chromeTokens, topBarStyles, columnStyles, canvasStyles, inspectorStyles, watchFrameStyles, phoneFrameStyles, pageFrameStyles, css`
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
    h3 { font-size: 13px; font-weight: 650; color: var(--wa-muted); }
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
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
    /* Two columns, the stage and the inspector, one screen tall, as the page
       editor: the editor never scrolls as a whole, and the stage and the
       inspector each scroll in their own box, so every card stays on screen. */
    .layout.pe-layout { padding: 0; align-items: stretch; }
    .layout.pe-layout.sp-wide {
      grid-template-columns: minmax(0, 1fr) 8px var(--wa-right, 372px); column-gap: 0;
      flex: 1 1 0; min-height: 0; overflow: hidden;
    }
    .pe-layout.sp-wide > .column.inspector { overflow-y: auto; overscroll-behavior: contain; }
    .pe-layout.sp-wide > .column.canvas { overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; overscroll-behavior: contain; }
    .pe-layout.sp-wide > .column.canvas > .card.canvas-card.sp-canvas { flex: 1 1 0; min-height: 420px; }
    .pe-layout.sp-wide .sp-canvas > .sp-stage-area { flex: 1 1 0; min-height: 0; }
    .pe-layout.sp-wide .sp-stage-body { flex: 1 1 0; min-height: 0; overflow-y: auto; scrollbar-width: thin; overscroll-behavior: contain; }
    .pe-layout.sp-wide .sp-stage-area > :not(.sp-stage-body) { flex: none; }
    .layout.pe-layout.cols-1 { flex: none; min-height: auto; overflow: visible; }
    @container (max-width: 820px) {
      .layout.pe-layout { grid-template-columns: minmax(0, 1fr); }
      .pe-layout > .gutter { display: none; }
      /* As strong as the wide rules, so a stacked inspector stops sliding over
         the stage above it (the page editor's fix). */
      .pe-layout > .column.canvas, .pe-layout > .column.inspector { grid-column: auto; position: static; max-height: none; overflow: visible; }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
    }
    .column.canvas > .card.canvas-card.sp-canvas { min-height: 0; flex: none; }
    /* The lit stage's edge in Status pages' hue, Home's Status pages door. */
    .canvas-card.sp-canvas { --wa-stage-hue: var(--wa-hue-yellow); }
    .canvas-card.lit .stage-area.sp-stage-area { position: relative; padding: 14px 12px 14px; gap: 8px; }
    /* "safe": a watch wider than the stage starts at its left edge, so all
       of it can be scrolled to, instead of hanging off both sides. */
    .sp-stage-body { display: flex; justify-content: safe center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    /* A status page's picture on a switcher card: its top, cut at the card. */
    .sp-pp-pic { position: relative; display: block; flex: none; width: 76px; height: 96px; overflow: hidden; border-radius: 12px; box-shadow: 0 0 0 1px var(--wa-line-strong); pointer-events: none; }
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
    /* On each device under the Name. */
    .sp-devices { margin-bottom: 10px; }
    .pe-chip:disabled { opacity: .55; cursor: default; }
  `, statusPagesViewStyles, libraryTicksStyles, libraryModeStyles, onEachDeviceStyles];
}

if (!customElements.get("wa-status-pages-editor")) {
  customElements.define("wa-status-pages-editor", WaStatusPagesEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-status-pages-editor": WaStatusPagesEditor;
  }
}
