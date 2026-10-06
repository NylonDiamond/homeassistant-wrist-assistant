// `<wa-rooms-editor>`: a watch's room settings, the room keys of its
// `behavior` record as Home Assistant keeps it, and an editor for them.
//
// It wears the other editors' chrome (`editor-chrome.ts`): the top bar with
// the way back, the watch picker, the sync pill, Save and the panel's Watch
// settings, then the cards (`view.ts`), then the foot bar with the stored
// copy's line, History and Raw configuration.
//
// The host pattern of the status page editor
// (`watch-status-pages/status-pages-editor.ts`): watches from the owners
// list, the record read with `watch_config/get` and heard with
// `watch_config/subscribe`, the edits kept in a draft (`draft.ts`) with undo
// and redo, a save over the base revision that merges by key on a conflict,
// the earlier saves with restore, and the delivery check. It reads `pages`
// too, for the page names, and never writes them.
//
// Rooms never makes a `behavior` record: a watch without one is told where
// one comes from (Watch settings, or the iPhone).
//
// The room list also reads Home Assistant's area registry and the room
// sensor's states of the last 24 hours, over the same socket.
//
// Loaded on its own, with one `import()`, when the panel's route is `/rooms`
// (`hook.ts`). Nothing it imports may import `icons.ts`.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md, "4d batch 5", 5b.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { chromeTokens, inspectorStyles, topBarStyles } from "../editor-chrome.js";
import { formStyles } from "../form-styles.js";
import {
  type HassLike,
  type OwnerSummary,
  type WatchConfigHistoryEntry,
  type WatchConfigRecord,
  fetchOwners,
  fetchWatchConfig,
  fetchWatchConfigHistory,
  restoreWatchConfig,
  saveWatchConfig,
  subscribeWatchConfig,
} from "../ha-api.js";
import { peopleOf } from "../people.js";
import { personColorVar } from "../pickerRows.js";
import { agoWords } from "../send-state.js";
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
import { watchKeysTypeText } from "../watch-pages/editor-host.js";
import { asWatchPagesDocument } from "../watch-pages/model.js";
import { type WatchPagesNote, watchCommandError } from "../watch-pages/save-note.js";
import { deliveryState, followWatch, noRecordStart, settingsWatches, watchName } from "../watch-settings.js";
import { type RoomsDraft, anyRoomsDirty, dropAllRooms, forgetRoomsDraft, keptRoomsDraft, saveRoomsDraft, takeRoomsRecord } from "./draft.js";
import { WATCH_ROOMS_HELP_URL, navigateWatchRooms, registerWatchRoomsDrafts } from "./hook.js";
import {
  type AreaEntry,
  type SensorHistoryEntry,
  ROOMS_NO_RECORD_TEXT,
  ROOMS_NO_RECORD_TITLE,
  ROOMS_UNREADABLE_TEXT,
  ROOMS_WAIT_TEXT,
  ROOM_HISTORY_HOURS,
  areasFromReply,
  historyFromReply,
  mergeRoomList,
  readRooms,
  roomDirtyKeys,
  roomPageChoices,
  roomsBudget,
  roomsDocumentOf,
  roomsSaveNote,
} from "./model.js";
import { type RoomsViewHost, renderRoomsBody, roomsViewStyles } from "./view.js";

registerWatchRoomsDrafts({ dirty: anyRoomsDirty, drop: dropAllRooms });

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
    if (!anyRoomsDirty()) return;
    e.preventDefault();
    e.returnValue = "";
  });
}

/** How often the view asks whether a device has collected a save. */
const DELIVERY_POLL_MS = 15_000;
const NOUN = "watch settings" as const;

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl+";
/** At or below this content width the columns stack. */
const RM_STACK_WIDTH = 820;

type Note = WatchPagesNote;
type HistoryState = "loading" | "ready" | "error" | "unsupported";

interface RestoreAsk {
  entry: WatchConfigHistoryEntry;
  baseRevision: number;
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

/** Rooms added by name here, per watch, until they have a page or a target. */
const addedRooms = new Map<string, string[]>();

export class WaRoomsEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ attribute: false }) ownerId?: string;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) haMenu = false;
  @property({ attribute: false }) onHaMenu?: () => void;
  /** Back to the complication editor. Without it, the address less `/rooms`. */
  @property({ attribute: false }) onBack?: () => void;
  /** The panel's own buttons for the bar's right end: Watch settings. */
  @property({ attribute: false }) barActions: TemplateResult | typeof nothing = nothing;
  /** The panel's Watch app row owns the watch: it picks the watch (this
   * element follows `ownerId` wherever it goes) and holds the ways to the
   * other screens, so the bar leaves out its own watch picker and the way
   * back to complications. Off, the bar is as it always was. */
  @property({ attribute: false }) shellOwnsWatch = false;

  @state() private watchId?: string;
  @state() private record?: WatchConfigRecord;
  @state() private pagesRecord?: WatchConfigRecord;
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
  @state() private ownList?: readonly OwnerSummary[];
  @state() private topMenuOpen = false;
  @state() private watchMenuOpen = false;
  @state() private hostWidth = 0;
  @state() private areas: AreaEntry[] = [];
  @state() private areasRead = false;
  @state() private sensorHistory: SensorHistoryEntry[] = [];
  @state() private sensorHistoryFor?: string;
  private readonly shownFootDialogs = new WeakSet<HTMLDialogElement>();
  private ownListAsked = false;
  private areasAsked?: HassLike["connection"];
  private sizeObserver?: ResizeObserver;
  private readonly savedTicker = new SavedAgoTicker(this);
  private readonly uiState = new Map<string, unknown>();
  private reloadPending = false;
  private shownDialog?: HTMLDialogElement;
  private loadSeq = 0;
  private historySeq = 0;
  private sensorSeq = 0;
  private subscribeSeq = 0;
  private unsubscribe?: () => Promise<void>;
  private pollTimer?: number;
  private readyConnection?: HassConnectionEvents;

  private get watches(): OwnerSummary[] {
    return settingsWatches(this.owners.length > 0 ? this.owners : (this.ownList ?? []));
  }

  /** The shown watch's draft, made from the record when none is kept (the
   * panel's leave guard may have dropped it). */
  private get draft(): RoomsDraft | undefined {
    const record = this.record;
    const document = roomsDocumentOf(record);
    if (this.watchId === undefined || record === undefined || document === undefined) return undefined;
    return keptRoomsDraft(this.watchId) ?? takeRoomsRecord(this.watchId, document, record.revision).draft;
  }

  private get saving(): boolean {
    return this.draft?.saving ?? false;
  }

  private get dirty(): boolean {
    return this.draft?.dirty ?? false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointerdown", this.onWindowPointerDown, true);
    this.watchSize();
    this.listenForReconnect();
    if (this.watchId !== undefined) this.openWatch(this.watchId, true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("pointerdown", this.onWindowPointerDown, true);
    this.sizeObserver?.disconnect();
    this.stopListeningForReconnect();
    this.reloadPending = false;
    this.endSubscription();
    this.stopPolling();
    this.loadSeq++;
    this.historySeq++;
    this.sensorSeq++;
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
      if (this.areasAsked !== this.hass.connection) void this.loadAreas();
      const sensor = this.currentSensor();
      if (sensor !== this.sensorHistoryFor) void this.loadSensorHistory(sensor);
    }
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
    this.savedTicker.show(this.renderRoot.querySelector(".cf-saved") !== null);
  }

  private watchSize(): void {
    if (typeof ResizeObserver === "undefined") return;
    this.sizeObserver ??= new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (Math.abs(width - this.hostWidth) >= 1) this.hostWidth = width;
      }
    });
    this.sizeObserver.observe(this);
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

  // ── loading ────────────────────────────────────────────────────────────

  private openWatch(watchId: string, quiet = false): void {
    if (watchId !== this.watchId) {
      this.reloadPending = false;
      this.watchId = watchId;
      this.note = undefined;
      this.history = [];
      this.pagesRecord = undefined;
      if (this.historyState !== "unsupported") this.historyState = "loading";
      this.closeAsk();
      this.uiState.clear();
      quiet = false;
    }
    this.startSubscription(watchId);
    void this.load(watchId, quiet);
    void this.loadPages(watchId);
  }

  private async load(watchId: string, quiet = false): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    if (quiet && this.saving) {
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
      const record = await fetchWatchConfig(hass, watchId, "behavior");
      if (seq !== this.loadSeq) return;
      if (quiet && this.saving) {
        this.reloadPending = true;
        return;
      }
      this.show(record);
      this.loadError = undefined;
    } catch (err) {
      if (seq !== this.loadSeq) return;
      if (!quiet) this.loadError = errText(err);
    }
    this.loading = false;
    this.pollIfWaiting();
    void this.loadHistory(watchId);
  }

  private show(record: WatchConfigRecord): void {
    const watchId = this.watchId;
    this.record = record;
    const document = roomsDocumentOf(record);
    if (watchId === undefined || document === undefined) return;
    const taken = takeRoomsRecord(watchId, document, record.revision);
    if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The watch's settings changed elsewhere. Your edits are kept on top." };
    this.requestUpdate();
  }

  private async loadPages(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    try {
      const record = await fetchWatchConfig(hass, watchId, "pages");
      if (watchId === this.watchId) this.pagesRecord = record;
    } catch {
      // Without pages the page pickers offer none; a stored page still shows.
    }
  }

  private async loadHistory(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass || this.historyState === "unsupported") return;
    const seq = ++this.historySeq;
    try {
      const reply = await fetchWatchConfigHistory(hass, watchId, "behavior");
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.history = Array.isArray(reply?.entries) ? reply.entries : [];
      this.historyState = "ready";
    } catch (err) {
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.historyState = errCode(err) === "unknown_command" ? "unsupported" : "error";
    }
  }

  /** Home Assistant's areas, names and aliases, once per connection. */
  private async loadAreas(): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    this.areasAsked = hass.connection;
    try {
      const reply = await hass.connection.sendMessagePromise<unknown>({ type: "config/area_registry/list" });
      this.areas = areasFromReply(reply);
    } catch {
      // Without the registry, the names the frontend already has.
      this.areas = Object.values(hass.areas ?? {}).flatMap((a) => (typeof a.name === "string" && a.name.trim() !== "" ? [{ name: a.name }] : []));
    }
    this.areasRead = true;
  }

  /** The room sensor's states of the last 24 hours, read again when the
   * sensor changes. */
  private async loadSensorHistory(sensor: string): Promise<void> {
    const hass = this.hass;
    this.sensorHistoryFor = sensor;
    const seq = ++this.sensorSeq;
    this.sensorHistory = [];
    if (!hass || sensor === "") return;
    try {
      const reply = await hass.connection.sendMessagePromise<unknown>({
        type: "history/history_during_period",
        start_time: new Date(Date.now() - ROOM_HISTORY_HOURS * 3600_000).toISOString(),
        entity_ids: [sensor],
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      if (seq !== this.sensorSeq) return;
      this.sensorHistory = historyFromReply(reply, sensor);
    } catch {
      // The rooms the sensor reported are a help, not a need.
    }
  }

  /** Hear every save of this watch's config: a new `behavior` revision is
   * read and laid under the edits, a new `pages` one read for the names. */
  private startSubscription(watchId: string): void {
    const hass = this.hass;
    this.endSubscription();
    if (!hass) return;
    const seq = ++this.subscribeSeq;
    subscribeWatchConfig(hass, watchId, (event) => {
      if (seq !== this.subscribeSeq) return;
      if (event.kind === "behavior" && event.revision !== (this.record?.revision ?? 0)) void this.load(watchId, true);
      if (event.kind === "pages" && event.revision !== (this.pagesRecord?.revision ?? 0)) void this.loadPages(watchId);
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
    if (this.saving) {
      this.pollIfWaiting();
      return;
    }
    try {
      const fresh = await fetchWatchConfig(hass, watchId, "behavior");
      if (watchId !== this.watchId || this.record !== shown) return;
      if (fresh.revision === shown.revision) {
        this.record = {
          ...shown,
          delivered_revision: fresh.delivered_revision,
          delivered_at: fresh.delivered_at,
          rejected_revision: fresh.rejected_revision,
          rejected_at: fresh.rejected_at,
        };
      } else if (this.saving) {
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

  /** The sensor as the editor shows it now, edits and all. */
  private currentSensor(): string {
    const draft = this.draft;
    return draft === undefined ? "" : readRooms(draft.effective).sensor;
  }

  private viewHost(): RoomsViewHost | undefined {
    const draft = this.draft;
    const hass = this.hass;
    const watchId = this.watchId;
    if (draft === undefined || hass === undefined || watchId === undefined) return undefined;
    const document = draft.effective;
    const view = readRooms(document);
    const added = addedRooms.get(watchId) ?? [];
    const rooms = mergeRoomList({
      areas: this.areas,
      mappingKeys: Object.keys(view.mappings),
      zoneKeys: view.zones.ok ? view.zones.rooms.map(([key]) => key) : [],
      history: this.sensorHistory,
      added,
    });
    return {
      hass,
      document,
      view,
      dirty: new Set(roomDirtyKeys(draft.document, draft.pending)),
      pages: roomPageChoices(asWatchPagesDocument(this.pagesRecord?.document)),
      rooms,
      roomsState: this.areasRead ? "ready" : "loading",
      busy: draft.saving,
      uiState: this.uiState,
      write: (writes, coalesce) => {
        if (this.draft !== draft) return;
        draft.apply(writes, coalesce);
        this.requestUpdate();
      },
      endCoalesce: () => draft.endCoalesce(),
      addRoom: (name) => {
        const list = addedRooms.get(watchId) ?? [];
        if (!list.includes(name)) addedRooms.set(watchId, [...list, name]);
        this.requestUpdate();
      },
      requestUpdate: () => this.requestUpdate(),
    };
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
    const draft = this.draft;
    const record = this.record;
    if (!hass || watchId === undefined || !draft || !record || draft.saving || !draft.dirty) return;
    this.note = undefined;
    draft.endCoalesce();
    const running = saveRoomsDraft(draft, {
      save: (base, document) => saveWatchConfig(hass, watchId, "behavior", base, document).catch((err: unknown) => {
        throw flatError(err);
      }),
      fetch: () => fetchWatchConfig(hass, watchId, "behavior").catch((err: unknown) => {
        throw flatError(err);
      }),
    });
    this.requestUpdate();
    const result = await running;
    if (watchId !== this.watchId) return;
    if (result.ok) {
      const base = result.fresh ?? record;
      this.record = result.alreadySaved
        ? base
        : { ...base, revision: result.revision, updated_at: new Date().toISOString(), updated_by: "panel", document: result.document };
    } else if (result.fresh !== undefined) {
      this.record = result.fresh;
    }
    this.note = roomsSaveNote(result);
    if (this.reloadPending) {
      this.reloadPending = false;
      void this.load(watchId, true);
    } else {
      this.pollIfWaiting();
      void this.loadHistory(watchId);
    }
    this.requestUpdate();
  }

  // ── restore ────────────────────────────────────────────────────────────

  private closeAsk(): void {
    this.renderRoot?.querySelector<HTMLDialogElement>("dialog.pe-ask")?.close();
    this.restoreAsk = undefined;
  }

  private askRestore(entry: WatchConfigHistoryEntry): void {
    const record = this.record;
    if (this.watchId === undefined || record === undefined || this.dirty) return;
    this.restoreAsk = { entry, baseRevision: record.revision };
  }

  private async restore(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    const ask = this.restoreAsk;
    if (!hass || watchId === undefined || ask === undefined || this.restoring) return;
    this.restoring = true;
    let note: Note;
    try {
      await restoreWatchConfig(hass, watchId, "behavior", ask.entry.revision, ask.baseRevision);
      note = { kind: "ok", text: `Revision ${ask.entry.revision} is back.` };
      if (!(keptRoomsDraft(watchId)?.dirty ?? false)) forgetRoomsDraft(watchId);
    } catch (err) {
      const code = errCode(err);
      if (code === "conflict") note = { kind: "warn", text: "Not restored. The watch's settings changed somewhere else, so the newest copy is shown." };
      else if (code === "no_record") note = { kind: "warn", text: "Not restored. Home Assistant no longer holds settings for this watch." };
      else if (code === "not_found") note = { kind: "warn", text: "Not restored. That save is no longer kept." };
      else if (code === "unknown_command") {
        this.historyState = "unsupported";
        note = { kind: "warn", text: "This version of the integration cannot restore an earlier save. Update it to restore one." };
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
    if (e.key === "Escape" && (this.topMenuOpen || this.watchMenuOpen)) {
      e.preventDefault();
      this.topMenuOpen = false;
      this.watchMenuOpen = false;
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
    }
  };

  private onWindowPointerDown = (e: PointerEvent): void => {
    if (!this.topMenuOpen && !this.watchMenuOpen) return;
    const path = e.composedPath();
    const within = (name: string) => path.some((n) => n instanceof HTMLElement && n.classList.contains(name));
    if (this.topMenuOpen && !within("pe-top-menu")) this.topMenuOpen = false;
    if (this.watchMenuOpen && !within("rm-watch-picker")) this.watchMenuOpen = false;
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

  private get stacked(): boolean {
    return this.narrow || (this.hostWidth > 0 && this.hostWidth <= RM_STACK_WIDTH);
  }

  private renderTopBar(draft: RoomsDraft | undefined, watches: readonly OwnerSummary[]): TemplateResult {
    const editing = draft !== undefined;
    const dirty = editing && this.dirty;
    return html`<div class="wa-bar ${this.stacked ? "stacked" : ""}" role="toolbar" aria-label="Watch rooms">
      ${this.haMenu ? html`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${() => this.onHaMenu?.()}>${uiIcon("menu")}</button>` : nothing}
      ${this.shellOwnsWatch ? nothing : html`<button class="tb-btn tb-back" title="Back to complications"
        @click=${() => (this.onBack ? this.onBack() : navigateWatchRooms(undefined, false))}>${uiIcon("left")}<span>Complications</span></button>`}
      <span class="rm-title">Rooms</span>
      <span class="spacer"></span>
      ${this.shellOwnsWatch ? nothing : this.renderWatchPicker(watches)}
      ${this.renderSyncPill(draft)}
      ${editing ? html`
        <button class="tb-btn icon rm-undo" ?disabled=${!draft.canUndo || this.saving} title=${`Undo (${MOD}Z)`} aria-label="Undo"
          @click=${() => this.undo()}>${uiIcon("undo")}</button>
        <button class="tb-btn icon rm-undo" ?disabled=${!draft.canRedo || this.saving} title=${IS_MAC ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)"} aria-label="Redo"
          @click=${() => this.redo()}>${uiIcon("redo")}</button>` : nothing}
      ${this.renderTopMenu(draft)}
      ${editing ? html`<button class="primary save ${dirty ? "dirty" : ""}" ?disabled=${!dirty || this.saving}
          title=${dirty ? `Save (${MOD}S). A save reaches the watch the next time it checks, or through the iPhone.` : `Nothing to save (${MOD}S)`}
          @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>
        <span class="tb-saved" title=${dirty ? "Unsaved changes" : ""}>${renderConfigSaved(this.record)}</span>` : nothing}
      ${this.barActions}
      <button class="help" title="Help: rooms" aria-label="Help"
        @click=${() => window.open(WATCH_ROOMS_HELP_URL, "_blank", "noopener")}>?</button>
    </div>`;
  }

  private renderSyncPill(draft: RoomsDraft | undefined): TemplateResult | typeof nothing {
    const record = this.record;
    if (record === undefined || draft === undefined) return nothing;
    const budget = roomsBudget(draft.effective);
    const status = configFootStatus({ record, size: budget.size, limit: budget.limit, noun: NOUN, historyState: this.historyState });
    return html`<span class="tb-sync ${status.tone === "ok" ? "ok" : "warn"}" title=${`${status.state}. ${status.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${status.state}</span>
    </span>`;
  }

  private renderTopMenu(draft: RoomsDraft | undefined): TemplateResult | typeof nothing {
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

  private personColor(watchId: string): string | undefined {
    const people = peopleOf(this.owners.length > 0 ? this.owners : (this.ownList ?? []));
    return personColorVar(people.findIndex((p) => p.owners.some((o) => o.owner_watch_id === watchId)));
  }

  private renderWatchPicker(watches: readonly OwnerSummary[]): TemplateResult | typeof nothing {
    if (watches.length < 2) return nothing;
    const current = watches.find((w) => w.owner_watch_id === this.watchId);
    const open = this.watchMenuOpen;
    const glyph = (id: string | undefined) => {
      const color = id === undefined ? undefined : this.personColor(id);
      return html`<span class="pe-chip-glyph" style=${color ? `--pe-person: ${color}` : nothing} aria-hidden="true">${uiIcon("watch")}</span>`;
    };
    return html`<span class="picker rm-watch-picker">
      <button type="button" class="tb-browse rm-watch-btn" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"}
        title="Choose the watch whose rooms are shown" @click=${() => { this.watchMenuOpen = !open; }}>
        ${glyph(current?.owner_watch_id)}<span class="tb-browse-l">${current ? watchName(current, watches) : "Choose a watch"}</span>
        <span class="rm-caret" aria-hidden="true">${uiIcon("chevron")}</span>
      </button>
      ${open ? html`<div class="pop-menu rm-watch-menu" role="menu" aria-label="Watches">
        ${watches.map((w) => {
          const on = w.owner_watch_id === this.watchId;
          return html`<button type="button" class="row rm-watch-row" role="menuitemradio" aria-checked=${on ? "true" : "false"}
            @click=${() => { this.watchMenuOpen = false; if (!on) this.openWatch(w.owner_watch_id); }}>
            ${glyph(w.owner_watch_id)}<span class="rm-watch-name">${watchName(w, watches)}</span>
            <span class="rm-watch-check" aria-hidden="true">${on ? uiIcon("check") : nothing}</span>
          </button>`;
        })}
      </div>` : nothing}
    </span>`;
  }

  private renderBody(watches: readonly OwnerSummary[]): TemplateResult {
    if (watches.length === 0) {
      const waiting = this.owners.length === 0 && this.ownList === undefined;
      return html`<div class="pe-empty">${waiting ? "Loading…" : "No watch has connected to this Home Assistant yet."}</div>`;
    }
    if (this.loading) return html`<div class="pe-empty">Loading…</div>`;
    if (this.loadError !== undefined) {
      const id = this.watchId;
      return html`<div class="pe-empty">
        <span>Could not read this watch's settings: ${this.loadError}</span>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => void this.load(id)}>Try again</button>`}
      </div>`;
    }
    const record = this.record;
    if (record === undefined) return html`<div class="pe-empty">Loading…</div>`;
    if (record.revision <= 0) {
      // Rooms have no start of their own; while the iPhone's move may still
      // bring the settings, say so rather than point at Watch settings' start.
      const waiting = noRecordStart(watches.find((w) => w.owner_watch_id === this.watchId)) === "wait";
      return html`<div class="pe-empty"><b>${ROOMS_NO_RECORD_TITLE}</b><span>${waiting ? ROOMS_WAIT_TEXT : ROOMS_NO_RECORD_TEXT}</span></div>`;
    }
    const draft = this.draft;
    const host = this.viewHost();
    if (draft === undefined || host === undefined) return html`<div class="pe-empty"><b>${ROOMS_UNREADABLE_TEXT}</b></div>`;
    return html`${renderRoomsBody(host)}${this.renderFoot(record, draft)}`;
  }

  private renderFoot(record: WatchConfigRecord, draft: RoomsDraft): TemplateResult {
    const document = draft.effective;
    const budget = roomsBudget(document);
    const status = configFootStatus({ record, size: budget.size, limit: budget.limit, noun: NOUN, historyState: this.historyState });
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
      noun: NOUN,
      record,
      entries: this.history,
      historyState: this.historyState,
      dirty: draft.dirty,
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
      noun: NOUN,
      document,
      revision: record.revision,
      dirty: draft.dirty,
      copied: this.rawCopied,
      onCopy: (text) => { void copyConfigText(text).then((ok) => { this.rawCopied = ok; }); },
      onClosed: () => { this.rawOpen = false; },
    }) : nothing}`;
  }

  private renderRestoreAsk(ask: RestoreAsk): TemplateResult {
    const record = this.record;
    const when = ago(ask.entry.updated_at);
    return html`<dialog class="pe-ask" aria-labelledby="rm-ask-title"
      @cancel=${(e: Event) => { if (this.restoring) e.preventDefault(); }}
      @close=${() => { this.restoreAsk = undefined; }}>
      <h3 id="rm-ask-title">Restore revision ${ask.entry.revision}?</h3>
      <p>${ask.entry.updated_by === "panel" ? "Saved here" : "From the watch"}${when ? ` ${when}` : ""}, ${kb(ask.entry.size)}.</p>
      <p>Every watch setting comes back as it was in that save, not only the rooms. It is saved again as a new revision${record ? `, after revision ${record.revision}` : ""}, and the copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${() => this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${() => void this.restore()}>${this.restoring ? "Restoring…" : "Restore"}</button>
      </div>
    </dialog>`;
  }

  static override styles = [formStyles, chromeTokens, topBarStyles, inspectorStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
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
    .rm-title { font-size: 14px; font-weight: 600; letter-spacing: -.01em; padding: 0 4px; white-space: nowrap; }
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn.icon { padding: 0 8px; }
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
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.rm-watch-btn { max-width: 260px; }
    .rm-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .rm-watch-btn .rm-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.rm-watch-btn .rm-caret svg { width: 11px; height: 11px; }
    .pop-menu.rm-watch-menu { left: 0; right: auto; min-width: 220px; }
    .rm-watch-menu .row.rm-watch-row { display: flex; align-items: center; gap: 8px; }
    .rm-watch-row .rm-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .rm-watch-row[aria-checked="true"] { font-weight: 700; }
    .rm-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .rm-watch-check svg.ui-icon { width: 14px; height: 14px; }
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
    dialog.pe-ask {
      width: min(460px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }
    :host([narrow]) { --cf-pad: 12px; }
  `, roomsViewStyles, configFootStyles];
}

if (!customElements.get("wa-rooms-editor")) {
  customElements.define("wa-rooms-editor", WaRoomsEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-rooms-editor": WaRoomsEditor;
  }
}
