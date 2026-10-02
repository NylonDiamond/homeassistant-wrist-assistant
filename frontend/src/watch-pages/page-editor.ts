// `<wa-page-editor>`: the watch's pages as Home Assistant keeps them.
//
// Part 3a draws them and changes nothing: the watch tabs, the page list, one
// page at the watch's own size, where the stored copy has got to, and the
// earlier saves with a way to put one back. Editing arrives in later parts on
// top of the same model, which is why the document is held as an opened
// `WatchPagesModel` rather than as typed fields.
//
// The panel loads this module on its own, with one `import()`, when its route
// is `/pages`, and draws the element in its own shadow tree. The element has
// a shadow root of its own, so none of the panel's rules reach it; it reads
// the panel's `--wa-*` colors, which do, and keeps every other rule here.
//
// Nothing here decides anything that needs a test: the reading is in
// `model.ts`, the delivery rules in `../watch-settings.ts`.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  type HassLike,
  type OwnerSummary,
  type WatchConfigHistoryEntry,
  type WatchConfigRecord,
  fetchOwners,
  fetchWatchConfig,
  fetchWatchConfigHistory,
  fetchWatchConfigHistoryEntry,
  restoreWatchConfig,
  subscribeWatchConfig,
} from "../ha-api.js";
import { peopleOf } from "../people.js";
import { personColorVar } from "../pickerRows.js";
import { type IconProvider, REFERENCE_CASE, caseForScreenSize } from "../renderer.js";
import { agoWords } from "../send-state.js";
import { uiIcon } from "../ui-icons.js";
import { deliveryState, errorCode, initialWatch, rejectedNow, settingsWatches, watchName } from "../watch-settings.js";
import {
  type WatchPage,
  type WatchPagesModel,
  WATCH_SYNC_LIMIT_BYTES,
  asWatchPagesDocument,
  isHiddenWatchPage,
  isSmartWatchPage,
  isSystemWatchPage,
  openWatchPages,
  sizeOf,
  watchPageExtent,
  watchPageId,
  watchPageName,
  watchPageTiles,
  watchPagesOf,
} from "./model.js";
import { renderWatchPagePreview, watchPagePreviewStyles } from "./preview.js";

/** How often the view asks whether the iPhone has collected a save. Nothing
 * on the live line says so: it only carries new revisions. */
const DELIVERY_POLL_MS = 15_000;

const NO_RECORD_TEXT = "Open the iPhone app once with Save pages to Home Assistant turned on.";

interface Note {
  kind: "ok" | "warn" | "err";
  text: string;
}

/** The restore question, and what the entry holds once it has been read. */
interface RestoreAsk {
  entry: WatchConfigHistoryEntry;
  summary?: string;
}

type HistoryState = "loading" | "ready" | "error" | "unsupported";

function errText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

function kb(bytes: number): string {
  return bytes < 1000 ? `${bytes} bytes` : `${Number((bytes / 1000).toFixed(1))} KB`;
}

function ago(iso: string | null | undefined): string {
  const at = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(at) ? "" : agoWords(Math.max(0, (Date.now() - at) / 1000));
}

/** Who made a save, in words: the panel writes `panel`, a device its id. */
function savedBy(updatedBy: string | null | undefined): string {
  return updatedBy === "panel" ? "Saved here" : "From the iPhone";
}

export class WaPageEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  /** The home's devices, as the panel holds them. */
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  /** The device the panel has selected. The view opens on it when it is a
   * watch, else on the first watch. */
  @property({ attribute: false }) ownerId?: string;
  @property({ type: Boolean, reflect: true }) narrow = false;
  /** The panel's symbol provider, shared so the symbol file is read once. */
  @property({ attribute: false }) icons?: IconProvider;

  @state() private watchId?: string;
  @state() private record?: WatchConfigRecord;
  @state() private model?: WatchPagesModel;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private pageIndex = 0;
  @state() private history: WatchConfigHistoryEntry[] = [];
  @state() private historyState: HistoryState = "loading";
  @state() private note?: Note;
  @state() private restoreAsk?: RestoreAsk;
  @state() private restoring = false;
  /** The panel's list arrives after the panel's first draw. Until it does,
   * the view asks for the devices itself, to tell "none yet" from "not
   * loaded yet". */
  @state() private ownList?: readonly OwnerSummary[];
  private ownListAsked = false;

  /** Bumped by every load, so a reply that arrives after another watch was
   * picked, or after a newer load, is dropped. */
  private loadSeq = 0;
  private subscribeSeq = 0;
  private unsubscribe?: () => Promise<void>;
  private pollTimer?: number;
  private iconTimer?: number;

  private get watches(): OwnerSummary[] {
    return settingsWatches(this.owners.length > 0 ? this.owners : (this.ownList ?? []));
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Back in the tree after a visit elsewhere: the record may have moved.
    if (this.watchId !== undefined) this.openWatch(this.watchId, true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.endSubscription();
    this.stopPolling();
    if (this.iconTimer !== undefined) window.clearInterval(this.iconTimer);
    this.iconTimer = undefined;
    this.loadSeq++;
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (!this.hass) return;
    if (this.owners.length === 0 && !this.ownListAsked) {
      this.ownListAsked = true;
      fetchOwners(this.hass).then(
        (reply) => { this.ownList = reply.owners; },
        () => { this.ownList = []; },
      );
    }
    const watches = this.watches;
    if (this.watchId === undefined || !watches.some((w) => w.owner_watch_id === this.watchId)) {
      const id = initialWatch(watches, this.ownerId);
      if (id !== undefined && id !== this.watchId) this.openWatch(id);
    }
    if (changed.has("icons")) this.waitForSymbols();
  }

  protected override updated(): void {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.pe-ask");
    if (dialog && !dialog.open) dialog.showModal();
  }

  /** Redraw once the symbol file has arrived. The provider tells the panel,
   * not this element, so this asks it now and then until it knows its names. */
  private waitForSymbols(): void {
    if (this.iconTimer !== undefined) window.clearInterval(this.iconTimer);
    this.iconTimer = undefined;
    const icons = this.icons;
    if (!icons || icons.names() !== undefined) return;
    let tries = 0;
    this.iconTimer = window.setInterval(() => {
      tries++;
      if (icons.names() !== undefined || tries > 60) {
        window.clearInterval(this.iconTimer);
        this.iconTimer = undefined;
        this.requestUpdate();
      }
    }, 500);
  }

  // ── loading ────────────────────────────────────────────────────────────

  private openWatch(watchId: string, quiet = false): void {
    if (watchId !== this.watchId) {
      this.watchId = watchId;
      this.note = undefined;
      this.history = [];
      if (this.historyState !== "unsupported") this.historyState = "loading";
      quiet = false;
    }
    this.startSubscription(watchId);
    void this.load(watchId, quiet);
  }

  /** Read the record. A quiet load keeps what is on screen until the answer
   * is in, which is how a change from elsewhere arrives. */
  private async load(watchId: string, quiet = false): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.loadSeq;
    this.stopPolling();
    if (!quiet) {
      this.record = undefined;
      this.model = undefined;
      this.loading = true;
      this.loadError = undefined;
    }
    try {
      const record = await fetchWatchConfig(hass, watchId, "pages");
      if (seq !== this.loadSeq) return;
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

  /** Put a record on screen, keeping the page that was selected when the new
   * document still has it. */
  private show(record: WatchConfigRecord): void {
    const before = this.model ? watchPagesOf(this.model.document)[this.pageIndex] : undefined;
    const beforeId = before ? watchPageId(before) : "";
    this.record = record;
    const document = asWatchPagesDocument(record.document);
    this.model = document === undefined ? undefined : openWatchPages(document);
    const pages = watchPagesOf(this.model?.document);
    const kept = beforeId === "" ? -1 : pages.findIndex((p) => watchPageId(p) === beforeId);
    this.pageIndex = kept >= 0 ? kept : Math.min(this.pageIndex, Math.max(0, pages.length - 1));
  }

  private async loadHistory(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass || this.historyState === "unsupported") return;
    try {
      const reply = await fetchWatchConfigHistory(hass, watchId, "pages");
      if (watchId !== this.watchId) return;
      this.history = Array.isArray(reply?.entries) ? reply.entries : [];
      this.historyState = "ready";
    } catch (err) {
      if (watchId !== this.watchId) return;
      // An integration from before the history commands: say nothing about
      // history at all rather than show a list that can never fill.
      this.historyState = errorCode(err) === "unknown_command" ? "unsupported" : "error";
    }
  }

  /** Hear every save of this watch's config. A new `pages` revision reloads
   * quietly; the phone's own uploads arrive this way too. */
  private startSubscription(watchId: string): void {
    const hass = this.hass;
    this.endSubscription();
    if (!hass) return;
    const seq = ++this.subscribeSeq;
    subscribeWatchConfig(hass, watchId, (event) => {
      if (seq !== this.subscribeSeq || event.kind !== "pages") return;
      if (event.revision !== (this.record?.revision ?? 0)) void this.load(watchId, true);
    }).then(
      (unsubscribe) => {
        if (seq === this.subscribeSeq) this.unsubscribe = unsubscribe;
        else void unsubscribe().catch(() => undefined);
      },
      () => {
        // No live line (an older integration, or the store is not ready):
        // the delivery check and reopening still bring changes in.
      },
    );
  }

  private endSubscription(): void {
    this.subscribeSeq++;
    const unsubscribe = this.unsubscribe;
    this.unsubscribe = undefined;
    void unsubscribe?.().catch(() => undefined);
  }

  /** While a save waits for the phone, ask the store again now and then. */
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
    try {
      const fresh = await fetchWatchConfig(hass, watchId, "pages");
      if (watchId !== this.watchId || this.record !== shown) return;
      if (fresh.revision === shown.revision) {
        this.record = {
          ...shown,
          delivered_revision: fresh.delivered_revision,
          delivered_at: fresh.delivered_at,
          rejected_revision: fresh.rejected_revision,
          rejected_at: fresh.rejected_at,
        };
      } else {
        this.show(fresh);
        void this.loadHistory(watchId);
      }
    } catch {
      // A missed check is not news: the next one will tell.
    }
    this.pollIfWaiting();
  }

  private stopPolling(): void {
    if (this.pollTimer !== undefined) window.clearTimeout(this.pollTimer);
    this.pollTimer = undefined;
  }

  // ── restoring an earlier save ──────────────────────────────────────────

  private askRestore(entry: WatchConfigHistoryEntry): void {
    const hass = this.hass;
    const watchId = this.watchId;
    if (!hass || watchId === undefined) return;
    const ask: RestoreAsk = { entry };
    this.restoreAsk = ask;
    fetchWatchConfigHistoryEntry(hass, watchId, "pages", entry.revision).then(
      (reply) => {
        if (this.restoreAsk !== ask) return;
        const pages = watchPagesOf(asWatchPagesDocument(reply.document));
        const tiles = pages.reduce((n, p) => n + watchPageTiles(p).length, 0);
        this.restoreAsk = {
          entry,
          summary: `${pages.length} ${pages.length === 1 ? "page" : "pages"}, ${tiles} ${tiles === 1 ? "tile" : "tiles"}: ${pages.map(watchPageName).join(", ")}`,
        };
      },
      () => undefined,
    );
  }

  private closeAsk(): void {
    this.renderRoot.querySelector<HTMLDialogElement>("dialog.pe-ask")?.close();
  }

  private async restore(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    const record = this.record;
    const ask = this.restoreAsk;
    if (!hass || watchId === undefined || record === undefined || ask === undefined || this.restoring) return;
    this.restoring = true;
    try {
      const reply = await restoreWatchConfig(hass, watchId, "pages", ask.entry.revision, record.revision);
      this.note = {
        kind: "ok",
        text: `Revision ${ask.entry.revision} is back, saved as revision ${reply.revision}. The iPhone picks it up the next time it checks.`,
      };
    } catch (err) {
      const code = errorCode(err);
      if (code === "conflict") {
        this.note = { kind: "warn", text: "Not restored. The pages changed somewhere else, so the newest copy is shown." };
      } else if (code === "no_record") {
        this.note = { kind: "warn", text: "Not restored. Home Assistant no longer holds pages for this watch." };
      } else if (code === "not_found") {
        this.note = { kind: "warn", text: "Not restored. That save is no longer kept." };
      } else if (code === "unknown_command") {
        this.historyState = "unsupported";
        this.note = { kind: "warn", text: "This version of the integration cannot restore pages. Update it to restore an earlier save." };
      } else {
        this.note = { kind: "err", text: `Could not restore: ${errText(err)}` };
      }
    } finally {
      this.restoring = false;
      this.closeAsk();
    }
    if (watchId === this.watchId) void this.load(watchId, true);
  }

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const watches = this.watches;
    const only = watches.length === 1 ? watches[0] : undefined;
    return html`
      <div class="pe-head">
        <div class="pe-title">
          <h2>Watch pages</h2>
          <span>${only ? `${watchName(only, watches)}. ` : ""}Shown as Home Assistant keeps them. Edit pages in the iPhone app for now.</span>
        </div>
        ${watches.length > 1 ? this.renderTabs(watches) : nothing}
      </div>
      ${this.note ? html`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
        <button class="pe-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      ${this.renderBody(watches)}
      ${this.restoreAsk ? this.renderAsk(this.restoreAsk) : nothing}
    `;
  }

  /** One tab per watch, the glyph in its person's color. */
  private renderTabs(watches: readonly OwnerSummary[]): TemplateResult {
    const people = peopleOf(this.owners.length > 0 ? this.owners : (this.ownList ?? []));
    return html`<div class="pe-tabs" role="tablist" aria-label="Watches">
      ${watches.map((w) => {
        const index = people.findIndex((p) => p.owners.some((o) => o.owner_watch_id === w.owner_watch_id));
        const color = personColorVar(index);
        const on = w.owner_watch_id === this.watchId;
        return html`<button type="button" role="tab" class="pe-tab ${on ? "on" : ""}" aria-selected=${on ? "true" : "false"}
          style=${color ? `--pe-person: ${color}` : nothing}
          @click=${() => { if (!on) this.openWatch(w.owner_watch_id); }}>
          <span class="pe-tab-glyph" aria-hidden="true">${uiIcon("watch")}</span>
          <span class="pe-tab-name">${watchName(w, watches)}</span>
        </button>`;
      })}
    </div>`;
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
        <span>Could not read this watch's pages: ${this.loadError}</span>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => void this.load(id)}>Try again</button>`}
      </div>`;
    }
    const record = this.record;
    const model = this.model;
    if (record === undefined) return html`<div class="pe-empty">Loading…</div>`;
    if (record.revision <= 0 || model === undefined) {
      return html`<div class="pe-empty"><b>No pages from this watch yet.</b><span>${NO_RECORD_TEXT}</span></div>`;
    }
    const pages = watchPagesOf(model.document);
    const page = pages[this.pageIndex];
    const owner = watches.find((w) => w.owner_watch_id === this.watchId);
    return html`<div class="pe-grid">
      <nav class="pe-card pe-pages" aria-label="Pages">
        <h3>Pages <span class="pe-count">${pages.length}</span></h3>
        ${pages.length === 0 ? html`<p class="pe-muted">This watch has no pages.</p>` : nothing}
        ${pages.map((p, i) => this.renderPageRow(p, i))}
      </nav>
      <section class="pe-card pe-stage" aria-label="Page preview">
        ${page ? this.renderStage(page, pages, owner) : html`<p class="pe-muted">Pick a page.</p>`}
      </section>
      <aside class="pe-side">
        ${this.renderState(record, model)}
        ${this.renderHistory(record)}
      </aside>
    </div>`;
  }

  private renderPageRow(page: WatchPage, index: number): TemplateResult {
    const on = index === this.pageIndex;
    const smart = isSmartWatchPage(page);
    const tiles = watchPageTiles(page).length;
    return html`<button type="button" class="pe-page ${on ? "on" : ""}" aria-current=${on ? "true" : "false"}
      @click=${() => { this.pageIndex = index; }}>
      <span class="pe-page-name">${watchPageName(page)}</span>
      <span class="pe-page-meta">
        ${smart ? html`<span class="pe-badge smart">Smart</span>` : html`<span>${tiles} ${tiles === 1 ? "tile" : "tiles"}</span>`}
        ${isHiddenWatchPage(page) ? html`<span class="pe-badge">Hidden</span>` : nothing}
        ${isSystemWatchPage(page) ? html`<span class="pe-badge">System</span>` : nothing}
      </span>
    </button>`;
  }

  private renderStage(page: WatchPage, pages: readonly WatchPage[], owner: OwnerSummary | undefined): TemplateResult {
    const found = caseForScreenSize(owner?.screen_size);
    const watchCase = found ?? REFERENCE_CASE;
    const smart = isSmartWatchPage(page);
    const tiles = watchPageTiles(page).length;
    const rows = watchPageExtent(page);
    const facts = [
      smart ? "Smart page" : `${tiles} ${tiles === 1 ? "tile" : "tiles"}, ${rows} ${rows === 1 ? "row" : "rows"}`,
      found ? watchCase.label : `${watchCase.label}, this watch's size is not known`,
    ];
    if (isHiddenWatchPage(page)) facts.push("hidden on the watch");
    return html`<div class="pe-stage-head">
        <h3>${watchPageName(page)}</h3>
        <span class="pe-muted">${facts.join(" · ")}</span>
      </div>
      <div class="pe-stage-body">
        ${renderWatchPagePreview({
          page,
          pages,
          screen: watchCase.screen,
          states: this.hass?.states,
          icons: this.icons,
          scale: this.narrow ? 1.25 : 1.5,
        })}
      </div>`;
  }

  /** Where the stored copy has got to: who saved it and when, whether the
   * iPhone has it, whether it could read it, and how big it is. */
  private renderState(record: WatchConfigRecord, model: WatchPagesModel): TemplateResult {
    const delivery = deliveryState(record);
    const rejected = rejectedNow(record);
    const size = sizeOf(model.document);
    const share = size / WATCH_SYNC_LIMIT_BYTES;
    const when = ago(record.updated_at);
    return html`<div class="pe-card pe-state">
      <h3>Stored copy</h3>
      <p><b>Revision ${record.revision}</b> · ${savedBy(record.updated_by)}${when ? ` ${when}` : ""}</p>
      ${rejected
        ? html`<p class="pe-pill err"><i aria-hidden="true"></i>The iPhone could not read this save</p>
          <p class="pe-muted">${this.historyState === "unsupported" ? "Save the pages again from the iPhone." : "Restore an earlier save below."}</p>`
        : delivery === "delivered"
        ? html`<p class="pe-pill ok" title=${`The iPhone has revision ${record.revision} and passes it to the watch.`}><i aria-hidden="true"></i>On the iPhone</p>`
        : html`<p class="pe-pill warn"><i aria-hidden="true"></i>Waiting for the iPhone</p>
          <p class="pe-muted">The iPhone picks it up the next time Wrist Assistant opens or comes to the front.</p>`}
      <p class=${share > 0.8 ? "pe-warn" : "pe-muted"}>${kb(size)} of the ${kb(WATCH_SYNC_LIMIT_BYTES)} the watch takes${share > 0.8 ? ". Close to the limit." : ""}</p>
    </div>`;
  }

  private renderHistory(record: WatchConfigRecord): TemplateResult | typeof nothing {
    if (this.historyState === "unsupported") return nothing;
    const entries = this.history;
    const rejected = rejectedNow(record);
    let body: TemplateResult;
    if (this.historyState === "loading") body = html`<p class="pe-muted">Loading…</p>`;
    else if (this.historyState === "error") {
      const id = this.watchId;
      body = html`<p class="pe-muted">Could not load the earlier saves.</p>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => { this.historyState = "loading"; void this.loadHistory(id); }}>Try again</button>`}`;
    } else if (entries.length === 0) body = html`<p class="pe-muted">No earlier saves yet.</p>`;
    else {
      // The newest entry older than the copy on screen is the one to offer
      // first when the iPhone could not read that copy.
      const offer = rejected ? entries.find((e) => e.revision < record.revision)?.revision : undefined;
      body = html`<ul class="pe-history">
        ${entries.map((entry) => {
          const current = entry.revision === record.revision;
          const when = ago(entry.updated_at);
          return html`<li class=${entry.revision === offer ? "offer" : ""}>
            <span class="pe-h-text">
              <b>Revision ${entry.revision}</b>
              <span class="pe-muted">${savedBy(entry.updated_by)}${when ? ` ${when}` : ""} · ${kb(entry.size)}</span>
            </span>
            ${current
              ? html`<span class="pe-badge">Current</span>`
              : html`<button class="pe-btn ${entry.revision === offer ? "primary" : ""}" ?disabled=${this.restoring}
                  @click=${() => this.askRestore(entry)}>Restore</button>`}
          </li>`;
        })}
      </ul>`;
    }
    return html`<div class="pe-card pe-past"><h3>Earlier saves</h3>${body}</div>`;
  }

  /** The restore question, as a native modal: Escape and the backdrop behave
   * as everywhere else, and the page under it cannot be clicked. */
  private renderAsk(ask: RestoreAsk): TemplateResult {
    const record = this.record;
    const when = ago(ask.entry.updated_at);
    return html`<dialog class="pe-ask" aria-labelledby="pe-ask-title"
      @cancel=${(e: Event) => { if (this.restoring) e.preventDefault(); }}
      @close=${() => { this.restoreAsk = undefined; }}>
      <h3 id="pe-ask-title">Restore revision ${ask.entry.revision}?</h3>
      <p>${savedBy(ask.entry.updated_by)}${when ? ` ${when}` : ""}, ${kb(ask.entry.size)}.</p>
      ${ask.summary ? html`<p class="pe-muted">${ask.summary}</p>` : nothing}
      <p>It is saved again as a new revision${record ? `, after revision ${record.revision}` : ""}. The copy shown now stays in the earlier saves. The iPhone picks it up the next time it checks and sends it to the watch.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${() => this.closeAsk()}>Cancel</button>
        <button class="pe-btn primary" ?disabled=${this.restoring} @click=${() => void this.restore()}>${this.restoring ? "Restoring…" : "Restore"}</button>
      </div>
    </dialog>`;
  }

  static override styles = [watchPagePreviewStyles, css`
    :host {
      display: block;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      padding: 16px;
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; }
    h2, h3, p { margin: 0; }
    h2 { font-size: 20px; font-weight: 650; }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }

    .pe-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 24px; margin-bottom: 14px; }
    .pe-title { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1 1 280px; }
    .pe-title > span { color: var(--wa-muted); font-size: 13px; }

    .pe-tabs { display: flex; flex-wrap: wrap; gap: 6px; }
    .pe-tab {
      display: inline-flex; align-items: center; gap: 6px; min-height: 32px; padding: 0 12px;
      border: 1px solid var(--wa-line); border-radius: 999px; background: var(--wa-card);
      color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-tab:hover { border-color: var(--wa-line-strong); }
    .pe-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-tab.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
    .pe-tab-glyph { color: var(--pe-person, var(--wa-muted)); }

    .pe-note {
      display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .pe-note > span { flex: 1; min-width: 0; }
    .pe-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
    .pe-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .pe-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .pe-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; cursor: pointer; }

    .pe-empty {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 560px;
      padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }

    /* Three columns when there is room: the pages, the picture, the record.
       One column, in that order, when there is not. */
    .pe-grid {
      display: grid;
      grid-template-columns: minmax(180px, 240px) minmax(0, 1fr) minmax(240px, 300px);
      gap: 14px;
      align-items: start;
    }
    @container (max-width: 820px) {
      .pe-grid { grid-template-columns: minmax(0, 1fr); }
    }
    .pe-card {
      display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 14px;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .pe-side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
    .pe-count { margin-left: 4px; font-weight: 500; }

    .pe-page {
      display: flex; flex-direction: column; align-items: flex-start; gap: 3px; width: 100%; padding: 8px 10px;
      border: 1px solid transparent; border-radius: var(--wa-r-sm, 8px); background: none;
      color: var(--wa-ink); font: inherit; text-align: left; cursor: pointer;
    }
    .pe-page:hover { background: var(--wa-field); }
    .pe-page:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-page.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); }
    .pe-page-name { max-width: 100%; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pe-page-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; color: var(--wa-muted); font-size: 12px; }
    .pe-badge {
      display: inline-block; padding: 1px 7px; border-radius: 999px; font-size: 11px; font-weight: 600;
      color: var(--wa-muted); background: var(--wa-field); white-space: nowrap;
    }
    .pe-badge.smart { color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 14%, transparent); }

    .pe-stage { align-items: stretch; }
    .pe-stage-head { display: flex; flex-direction: column; gap: 2px; }
    .pe-stage-head h3 { font-size: 16px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); }
    /* The picture keeps its size and the card scrolls sideways under it on a
       screen narrower than the watch drawn at this scale. */
    .pe-stage-body { display: flex; justify-content: center; padding: 14px 8px 10px; overflow-x: auto; }

    .pe-state p { font-size: 13px; }
    .pe-pill {
      display: inline-flex; align-items: center; gap: 7px; align-self: flex-start;
      padding: 3px 10px; border-radius: 999px; font-weight: 600;
    }
    .pe-pill > i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
    .pe-pill.ok { color: var(--wa-green); background: color-mix(in srgb, var(--wa-green) 13%, transparent); }
    .pe-pill.warn { color: var(--wa-amber); background: var(--wa-amber-bg); }
    .pe-pill.err { color: var(--wa-need); background: color-mix(in srgb, var(--wa-need) 13%, transparent); }

    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-history > li.offer .pe-h-text > b { color: var(--wa-accent); }
    .pe-h-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .pe-h-text > .pe-muted { font-size: 12px; }

    .pe-btn {
      flex: none; min-height: 30px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-btn:hover:not(:disabled) { background: var(--wa-panel); }
    .pe-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-btn:disabled { opacity: .55; cursor: default; }
    .pe-btn.primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .pe-btn.primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }

    dialog.pe-ask {
      width: min(440px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }

    :host([narrow]) { padding: 12px; }
  `];
}

if (!customElements.get("wa-page-editor")) {
  customElements.define("wa-page-editor", WaPageEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-page-editor": WaPageEditor;
  }
}
