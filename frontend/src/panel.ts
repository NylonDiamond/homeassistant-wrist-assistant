// Home Assistant sidebar panel: <wrist-assistant-panel>.
// Pick an iPhone, pick a complication, edit a browser-side draft with live
// previews for all three families, then Save with the record's revision so
// a concurrent edit is caught instead of overwritten (plan §"Save and
// conflict rules"). Rule editing is slice 4; rules are shown and forceable.

import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  type ComplicationRecord,
  type HassLike,
  type OwnerSummary,
  deleteRecord,
  fetchList,
  fetchOwners,
  renderTemplates,
  saveRecord,
  subscribeChanges,
} from "./ha-api.js";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type FamilyKind,
  type NormalizedFrame,
  type Rule,
  type Value,
  DRAWABLE_FAMILIES,
  auditUnknownKeys,
  newConfig,
  newElement,
  newId,
  parseConfig,
} from "./model.js";
import { compile, parseValueDocument, type Compiled } from "./compiler.js";
import {
  type EntityState,
  type ForcedBranches,
  type ResolveContext,
  Resolver,
  resolveAll,
} from "./resolver.js";
import { CANVAS, familyTitle, renderLayout, type IconProvider } from "./renderer.js";
import { makeIconProvider } from "./icons.js";
import { Draft } from "./draft.js";
import { beginGesture, type HandleCorner } from "./interact.js";
import {
  type EditorHost,
  effectivePlacement,
  entityDatalist,
  familyEditor,
  generalEditor,
  layerEditor,
  namedValueEditor,
  newNamedValue,
  setPlacement,
} from "./editors.js";

const TEMPLATE_REFRESH_MS = 30_000;
const TEMPLATE_DEBOUNCE_MS = 500;

type Inspect =
  | { kind: "general" }
  | { kind: "family" }
  | { kind: "data"; id: string }
  | { kind: "layer"; id: string };

type Conflict = { current: ComplicationRecord | null; message: string };

export class WristAssistantPanel extends LitElement {
  @property({ attribute: false }) hass!: HassLike;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) panel?: { config?: { version?: string } };

  @state() private owners: OwnerSummary[] = [];
  @state() private ownerId?: string;
  @state() private records: ComplicationRecord[] = [];
  @state() private selectedId?: string;
  @state() private draft?: Draft;
  @state() private readOnlyReason?: string;
  @state() private parseError?: string;
  @state() private maxSchemaVersion = 4;
  @state() private templateResults = new Map<string, string>();
  @state() private templateError?: string;
  @state() private templateFetchedAt?: number;
  @state() private forced: ForcedBranches = new Map();
  @state() private showRaw = false;
  @state() private inspect: Inspect = { kind: "general" };
  @state() private activeFamily: FamilyKind = "rectangular";
  @state() private loadError?: string;
  @state() private saveError?: string;
  @state() private saving = false;
  @state() private conflict?: Conflict;
  @state() private remoteRevision?: number;
  @state() private confirmDelete = false;
  @state() private version = 0; // bumped on every draft mutation

  private compiled?: Compiled;
  private compiledDocument?: string;
  private icons: IconProvider = makeIconProvider(() => this.requestUpdate());
  private unsubscribe?: () => Promise<void>;
  private templateTimer?: number;
  private debounceTimer?: number;
  private lastStatesSnapshot?: Record<string, unknown>;
  private cancelGesture?: () => void;
  private keyHandler = (e: KeyboardEvent) => this.onKey(e);

  static override styles = css`
    :host {
      display: block;
      height: 100%;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      border-bottom: 1px solid var(--divider-color);
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #fff);
      flex-wrap: wrap;
    }
    header h1 { font-size: 18px; font-weight: 500; margin: 0; flex: 1; }
    header select { font: inherit; padding: 4px 8px; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    .toolbar button, button.primary, button.small, button.danger {
      font: inherit; font-size: 13px; padding: 6px 12px; border-radius: 8px; cursor: pointer;
      border: 1px solid var(--divider-color); background: var(--card-background-color, #fff); color: var(--primary-text-color);
    }
    .toolbar button:disabled, button:disabled { opacity: .45; cursor: default; }
    button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    button.danger { color: var(--error-color, #db4437); border-color: var(--error-color, #db4437); }
    button.small { padding: 3px 8px; font-size: 12px; }
    button.icon { font: inherit; border: none; background: none; cursor: pointer; padding: 2px 6px; opacity: .7; color: inherit; }
    button.icon:hover { opacity: 1; }
    .dirty-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--warning-color, #ffa600); margin-left: 6px; }
    .layout {
      display: grid;
      grid-template-columns: 270px minmax(0, 1fr) 340px;
      gap: 16px;
      padding: 16px;
      height: calc(100% - 52px);
      box-sizing: border-box;
      overflow: hidden;
    }
    @media (max-width: 1180px) {
      .layout { grid-template-columns: 270px minmax(0, 1fr); height: auto; overflow: auto; }
      .layout > .column:nth-child(3) { grid-column: 1 / -1; }
    }
    .layout.narrow, .layout.narrow > .column:nth-child(3) { grid-template-columns: 1fr; grid-column: auto; height: auto; overflow: auto; }
    .column { overflow: auto; min-height: 0; }
    .card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0,0,0,.2));
      padding: 12px 16px;
      margin-bottom: 16px;
    }
    .card h2 { font-size: 14px; font-weight: 500; margin: 0 0 8px; opacity: .8; text-transform: uppercase; letter-spacing: .04em; display: flex; align-items: center; gap: 8px; }
    .card h2 .spacer { flex: 1; }
    .card h3 { font-size: 13px; font-weight: 500; margin: 14px 0 6px; opacity: .8; }
    ul { list-style: none; margin: 0; padding: 0; }
    li.row {
      padding: 8px 10px; border-radius: 8px; cursor: pointer;
      display: flex; justify-content: space-between; align-items: center; gap: 8px;
    }
    li.row:hover { background: var(--secondary-background-color); }
    li.row.selected { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    li.row .meta { font-size: 12px; opacity: .7; }
    .previews { display: flex; flex-direction: column; gap: 16px; align-items: center; }
    .preview { text-align: center; position: relative; }
    .preview .label { font-size: 12px; opacity: .7; margin-top: 6px; cursor: pointer; }
    .preview.active .label { color: var(--primary-color); opacity: 1; font-weight: 500; }
    .preview svg { display: block; margin: 0 auto; background: #000; border-radius: 12px; touch-action: none; }
    .preview.active svg { outline: 2px solid var(--primary-color); outline-offset: 3px; }
    .preview.rectangular svg { width: 320px; height: 124px; }
    .preview.circular svg { width: 220px; height: 220px; border-radius: 50%; }
    .preview.corner svg { width: 312px; height: 252px; background: #2c2c2e; }
    .previews-row { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
    .status { font-size: 13px; line-height: 1.5; }
    .ok { color: var(--success-color, #43a047); }
    .warn { color: var(--warning-color, #ffa600); }
    .err, .error { color: var(--error-color, #db4437); }
    .kv { display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; font-size: 13px; }
    .kv dt { opacity: .7; }
    .kv dd { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .layer, .datum { padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .layer:hover, .datum:hover { background: var(--secondary-background-color); }
    .layer.hl, .datum.hl { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .layer .kind { opacity: .6; font-size: 11px; text-transform: uppercase; margin-right: 2px; min-width: 42px; }
    .layer .name, .datum .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .layer .meta, .datum .meta { font-size: 12px; opacity: .7; }
    .layer .acts { display: none; gap: 0; }
    .layer:hover .acts, .layer.hl .acts { display: inline-flex; }
    .adders { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
    .rule { margin: 6px 0 10px; font-size: 13px; }
    .rule .title { opacity: .7; margin-bottom: 4px; }
    .branches { display: flex; flex-wrap: wrap; gap: 4px; }
    .branches button {
      font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px;
      border: 1px solid var(--divider-color); background: transparent; color: inherit; cursor: pointer;
    }
    .branches button.active { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    .branches button.live-match { border-color: var(--success-color, #43a047); }
    pre { font-size: 11px; white-space: pre-wrap; word-break: break-all; max-height: 400px; overflow: auto; background: var(--secondary-background-color); padding: 8px; border-radius: 6px; }
    button.link { font: inherit; background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 0; }
    .empty { opacity: .6; padding: 24px; text-align: center; }
    .banner { padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-size: 13px; background: var(--secondary-background-color); }
    .banner.warn { border-left: 4px solid var(--warning-color, #ffa600); }
    .banner.err { border-left: 4px solid var(--error-color, #db4437); }
    .banner .acts { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
    .tabs { display: flex; gap: 4px; margin-bottom: 10px; flex-wrap: wrap; }
    .tabs button { font: inherit; font-size: 12px; padding: 4px 10px; border-radius: 999px; border: 1px solid var(--divider-color); background: transparent; color: inherit; cursor: pointer; }
    .tabs button.active { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    /* form controls */
    .field { display: flex; flex-direction: column; gap: 3px; margin: 6px 0; font-size: 13px; }
    .field > span { opacity: .75; font-size: 12px; }
    .field input[type=text], .field input[type=number], .field select, .field textarea {
      font: inherit; font-size: 13px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--divider-color);
      background: var(--card-background-color, #fff); color: inherit; width: 100%; box-sizing: border-box;
    }
    .field .mono, code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    .field.check { flex-direction: row; align-items: center; gap: 8px; }
    .field.check > span { opacity: 1; font-size: 13px; }
    .color-row { display: flex; align-items: center; gap: 6px; }
    .color-row input[type=color] { width: 32px; height: 26px; padding: 0; border: 1px solid var(--divider-color); border-radius: 6px; background: none; }
    .color-row input[type=range] { flex: 1; min-width: 40px; }
    .color-row input.hex { width: 96px; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; }
    .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0 6px; }
    .row-inline { display: flex; align-items: flex-end; gap: 4px; }
    .row-inline .field { flex: 1; }
    .hint { font-size: 12px; opacity: .75; margin: 4px 0; }
    .hint.warn { opacity: 1; }
    details.sub { margin: 6px 0; }
    details.sub summary { font-size: 12px; opacity: .8; cursor: pointer; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; }
    .chip { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 2px 8px; border: 1px solid var(--divider-color); border-radius: 999px; }
    .value-editor { border-left: 2px solid var(--divider-color); padding-left: 10px; margin: 4px 0 8px; }
  `;

  // ── lifecycle ─────────────────────────────────────────────────────────

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.keyHandler);
    window.addEventListener("beforeunload", this.beforeUnload);
    void this.loadOwners();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.keyHandler);
    window.removeEventListener("beforeunload", this.beforeUnload);
    void this.unsubscribe?.();
    if (this.templateTimer) window.clearInterval(this.templateTimer);
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
    this.cancelGesture?.();
  }

  private beforeUnload = (e: BeforeUnloadEvent) => {
    if (this.draft?.dirty) e.preventDefault();
  };

  protected override updated(changed: PropertyValues) {
    if (changed.has("hass") && this.draft) {
      const snapshot: Record<string, unknown> = {};
      for (const id of this.compiled?.entities.keys() ?? []) snapshot[id] = this.hass.states[id]?.last_updated;
      const before = JSON.stringify(this.lastStatesSnapshot ?? {});
      const after = JSON.stringify(snapshot);
      if (before !== after) {
        this.lastStatesSnapshot = snapshot;
        this.requestUpdate();
      }
    }
  }

  private onKey(e: KeyboardEvent) {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    const inField = (e.composedPath()[0] as HTMLElement | undefined)?.tagName?.match(/INPUT|TEXTAREA|SELECT/);
    if (e.key === "s") {
      e.preventDefault();
      void this.save();
    } else if (e.key === "z" && !inField) {
      e.preventDefault();
      if (e.shiftKey) this.redo();
      else this.undo();
    } else if (e.key === "y" && !inField) {
      e.preventDefault();
      this.redo();
    }
  }

  // ── data loading ──────────────────────────────────────────────────────

  private get canEdit(): boolean {
    return !!this.hass.user?.is_admin && !this.readOnlyReason && !!this.draft;
  }

  private async loadOwners() {
    try {
      const reply = await fetchOwners(this.hass);
      this.owners = reply.owners;
      this.maxSchemaVersion = reply.max_schema_version;
      this.loadError = undefined;
      if (!this.ownerId && this.owners.length > 0) {
        const withData = this.owners.find((o) => o.complication_count > 0) ?? this.owners[0]!;
        await this.selectOwner(withData.owner_iphone_id);
      }
    } catch (err) {
      this.loadError = `Could not load devices: ${errText(err)}`;
    }
  }

  private async selectOwner(ownerId: string) {
    if (this.draft?.dirty && !this.confirmDiscard()) {
      this.requestUpdate();
      return;
    }
    this.ownerId = ownerId;
    this.selectedId = undefined;
    this.clearDraft();
    await this.unsubscribe?.();
    this.unsubscribe = await subscribeChanges(this.hass, ownerId, () => void this.loadRecords());
    await this.loadRecords();
  }

  private async loadRecords() {
    if (!this.ownerId) return;
    try {
      const reply = await fetchList(this.hass, this.ownerId);
      this.records = reply.records;
      this.maxSchemaVersion = reply.max_schema_version;
      const still = this.records.find((r) => r.id === this.selectedId);
      if (still) {
        if (this.draft && this.draft.dirty) {
          // Keep the draft; tell the user the server moved.
          this.remoteRevision = still.revision !== this.draft.baseRevision ? still.revision : undefined;
        } else if (this.draft && still.revision !== this.draft.baseRevision) {
          this.openRecord(still);
        }
      } else if (this.draft && this.selectedId && this.draft.baseRevision !== null) {
        // Deleted under us. Keep an unsaved draft; drop a clean one.
        if (this.draft.dirty) this.remoteRevision = -1;
        else this.selectFirst();
      } else if (!this.draft) {
        this.selectFirst();
      }
    } catch (err) {
      this.loadError = `Could not load complications: ${errText(err)}`;
    }
  }

  private selectFirst() {
    if (this.records[0]) this.openRecord(this.records[0]);
    else {
      this.selectedId = undefined;
      this.clearDraft();
    }
  }

  private clearDraft() {
    this.draft = undefined;
    this.compiled = undefined;
    this.compiledDocument = undefined;
    this.readOnlyReason = undefined;
    this.parseError = undefined;
    this.remoteRevision = undefined;
    this.conflict = undefined;
    this.saveError = undefined;
    this.confirmDelete = false;
  }

  private confirmDiscard(): boolean {
    // window.confirm is the one modal the panel uses; it only appears when
    // the user is about to lose typed work.
    return window.confirm("You have unsaved changes. Discard them?");
  }

  private selectRecord(record: ComplicationRecord) {
    if (record.id === this.selectedId) return;
    if (this.draft?.dirty && !this.confirmDiscard()) return;
    this.openRecord(record);
  }

  private openRecord(record: ComplicationRecord) {
    this.selectedId = record.id;
    this.clearDraft();
    this.forced = new Map();
    this.inspect = { kind: "general" };
    try {
      this.draft = Draft.fromDocument(record.document, record.revision);
      const schema = Number(record.document?.schemaVersion ?? 0);
      const unknown = auditUnknownKeys(record.document);
      if (schema > this.maxSchemaVersion) {
        this.readOnlyReason = `This document is schema v${schema}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`;
      } else if (unknown.length > 0) {
        this.readOnlyReason = `This document has fields the panel does not understand, so saving would drop them: ${unknown.slice(0, 5).join(", ")}${unknown.length > 5 ? ` and ${unknown.length - 5} more` : ""}. Update the integration to edit it.`;
      }
      this.recompile();
    } catch (err) {
      this.parseError = errText(err);
    }
    this.scheduleTemplates(0);
  }

  private startNew(config: CustomComplicationConfig) {
    if (this.draft?.dirty && !this.confirmDiscard()) return;
    this.selectedId = config.id;
    this.clearDraft();
    this.forced = new Map();
    this.inspect = { kind: "general" };
    this.draft = new Draft(config, null);
    this.recompile();
    this.scheduleTemplates(0);
  }

  private freeSlot(): number {
    const used = new Set(this.records.filter((r) => r.id !== this.selectedId).map((r) => Number(r.document?.slotIndex ?? -1)));
    for (let i = 0; i < 8; i++) if (!used.has(i)) return i;
    return 0;
  }

  private usedSlots(): Map<number, string> {
    const m = new Map<number, string>();
    for (const r of this.records) {
      if (r.id === this.selectedId || !r.document) continue;
      m.set(Number(r.document.slotIndex ?? -1), String(r.document.name ?? "Untitled"));
    }
    return m;
  }

  // ── draft mutation ────────────────────────────────────────────────────

  private mutate(mutateFn: (cfg: CustomComplicationConfig) => void, coalesce?: string) {
    if (!this.draft || !this.canEdit) return;
    this.draft.update(mutateFn, coalesce);
    this.afterMutation();
  }

  private afterMutation() {
    this.version++;
    this.recompile();
  }

  private recompile() {
    if (!this.draft) return;
    try {
      this.compiled = compile(this.draft.config);
    } catch {
      this.compiled = undefined;
    }
    this.lastStatesSnapshot = undefined;
    if (this.compiled?.document !== this.compiledDocument) {
      this.compiledDocument = this.compiled?.document;
      this.scheduleTemplates(TEMPLATE_DEBOUNCE_MS);
    }
  }

  private undo() {
    if (!this.draft?.canUndo) return;
    this.draft.undo();
    this.afterMutation();
  }

  private redo() {
    if (!this.draft?.canRedo) return;
    this.draft.redo();
    this.afterMutation();
  }

  private host(): EditorHost {
    const resolver = new Resolver(this.buildContext());
    return {
      hass: this.hass,
      config: this.draft!.config,
      update: (m, c) => this.mutate(m, c),
      endGesture: () => this.draft?.endGesture(),
      resolve: (v: Value) => resolver.resolve(v),
    };
  }

  // ── save / delete ─────────────────────────────────────────────────────

  private async save(asNew = false) {
    if (!this.draft || !this.ownerId || !this.canEdit || this.saving) return;
    if (!asNew && !this.draft.dirty) return;
    this.saving = true;
    this.saveError = undefined;
    try {
      let draft = this.draft;
      if (asNew) {
        const cfg = structuredClone(draft.config);
        cfg.id = newId();
        cfg.slotIndex = this.freeSlot();
        draft = new Draft(cfg, null);
      }
      const doc = draft.encoded();
      const result = await saveRecord(this.hass, this.ownerId, doc, draft.baseRevision);
      if (!result.ok || !result.record) {
        if (result.error === "conflict") {
          this.conflict = { current: result.current ?? null, message: result.message ?? "Someone else saved this complication first." };
        } else {
          this.saveError = result.message ?? result.error ?? "Save failed";
        }
        return;
      }
      this.conflict = undefined;
      this.remoteRevision = undefined;
      this.selectedId = result.record.id;
      this.draft = Draft.fromDocument(result.record.document, result.record.revision);
      this.recompile();
      await this.loadRecords();
    } catch (err) {
      this.saveError = errText(err);
    } finally {
      this.saving = false;
    }
  }

  private async deleteCurrent() {
    if (!this.draft || !this.ownerId || !this.selectedId || !this.canEdit) return;
    if (this.draft.baseRevision === null) {
      // Never saved: just drop it.
      this.clearDraft();
      this.selectedId = undefined;
      this.selectFirst();
      return;
    }
    this.saving = true;
    try {
      const result = await deleteRecord(this.hass, this.ownerId, this.selectedId, this.draft.baseRevision);
      if (!result.ok) {
        if (result.error === "conflict") this.conflict = { current: result.current ?? null, message: result.message ?? "This complication changed on the server." };
        else this.saveError = result.message ?? result.error ?? "Delete failed";
        return;
      }
      this.clearDraft();
      this.selectedId = undefined;
      await this.loadRecords();
    } catch (err) {
      this.saveError = errText(err);
    } finally {
      this.saving = false;
      this.confirmDelete = false;
    }
  }

  private duplicate() {
    if (!this.draft) return;
    const cfg = structuredClone(this.draft.config);
    cfg.id = newId();
    cfg.name = `${cfg.name} copy`;
    cfg.slotIndex = this.freeSlot();
    this.startNew(cfg);
  }

  private reloadFromServer() {
    const current = this.conflict?.current ?? this.records.find((r) => r.id === this.selectedId);
    this.conflict = undefined;
    if (current && !current.deleted) this.openRecord(current);
    else {
      this.clearDraft();
      this.selectedId = undefined;
      void this.loadRecords();
    }
  }

  // ── templates ─────────────────────────────────────────────────────────

  private scheduleTemplates(delay: number) {
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
    this.debounceTimer = window.setTimeout(() => void this.refreshTemplates(), delay);
    if (this.templateTimer) window.clearInterval(this.templateTimer);
    this.templateTimer = window.setInterval(() => void this.refreshTemplates(), TEMPLATE_REFRESH_MS);
  }

  private async refreshTemplates() {
    const doc = this.compiled?.document;
    if (!doc) {
      this.templateResults = new Map();
      this.templateError = undefined;
      this.templateFetchedAt = Date.now();
      return;
    }
    try {
      const reply = await renderTemplates(this.hass, { doc });
      const result = reply.doc;
      if (!result) return;
      if (!result.ok) {
        this.templateError = result.error;
        return;
      }
      const parsed = parseValueDocument(result.value);
      if (!parsed) {
        this.templateError = "Template did not render to a JSON object";
        return;
      }
      this.templateResults = parsed.values;
      this.templateError = undefined;
      this.templateFetchedAt = Date.now();
    } catch (err) {
      this.templateError = errText(err);
    }
  }

  // ── resolution ────────────────────────────────────────────────────────

  private buildContext(): ResolveContext {
    const entityStates = new Map<string, EntityState>();
    for (const id of this.compiled?.entities.keys() ?? []) {
      const s = this.hass.states[id];
      if (!s) continue;
      const attrs = s.attributes;
      entityStates.set(id, {
        entityId: id,
        state: s.state,
        unitOfMeasurement: typeof attrs.unit_of_measurement === "string" ? attrs.unit_of_measurement : undefined,
        iconName: this.compiled?.entities.get(id)?.iconName ?? "",
        domain: id.split(".")[0] ?? "",
      });
    }
    return {
      entityStates,
      templateResults: this.templateResults,
      namedValues: this.draft?.config.values ?? [],
      dataAgeSeconds: this.templateFetchedAt === undefined ? undefined : (Date.now() - this.templateFetchedAt) / 1000,
    };
  }

  // ── preview gestures ──────────────────────────────────────────────────

  private onPreviewPointerDown(family: FamilyKind, e: PointerEvent) {
    if (!this.draft || !this.canEdit) return;
    if (family !== this.activeFamily) {
      this.activeFamily = family;
      return;
    }
    const target = e.target as SVGElement;
    const handle = target.closest("[data-handle]")?.getAttribute("data-handle") as HandleCorner | null;
    const group = target.closest("[data-element-id]");
    const id = group?.getAttribute("data-element-id");
    if (!id) return;
    const svg = target.closest("svg") as SVGSVGElement | null;
    if (!svg) return;
    const el = this.draft.config.elements.find((x) => x.payload.id === id);
    if (!el) return;
    if (this.inspect.kind !== "layer" || this.inspect.id !== id) {
      this.inspect = { kind: "layer", id };
      if (handle) return;
    }
    e.preventDefault();
    const frame = effectivePlacement(this.draft.config, family, el).frame;
    const canvas = CANVAS[family as "rectangular" | "circular" | "corner"];
    this.cancelGesture?.();
    this.cancelGesture = beginGesture(svg, canvas, e, { elementId: id, frame, handle: handle ?? undefined }, {
      onFrame: (elementId: string, f: NormalizedFrame, done: boolean) => {
        this.mutate((c) => setPlacement(c, family, elementId, { frame: f }), `drag-${elementId}-${family}`);
        if (done) {
          this.draft?.endGesture();
          this.cancelGesture = undefined;
        }
      },
    });
  }

  // ── render ────────────────────────────────────────────────────────────

  override render() {
    const d = this.draft;
    const dirty = !!d?.dirty;
    return html`
      ${entityDatalist(this.hass, "wa-entities")}
      <header>
        <h1>Wrist Assistant${dirty ? html`<span class="dirty-dot" title="Unsaved changes"></span>` : nothing}</h1>
        <div class="toolbar">
          <button @click=${() => this.undo()} ?disabled=${!d?.canUndo} title="Undo (⌘Z)">Undo</button>
          <button @click=${() => this.redo()} ?disabled=${!d?.canRedo} title="Redo (⇧⌘Z)">Redo</button>
          <button class="primary" @click=${() => void this.save()} ?disabled=${!this.canEdit || !dirty || this.saving} title="Save (⌘S)">${this.saving ? "Saving…" : d?.baseRevision === null ? "Save new" : "Save"}</button>
        </div>
        <label>iPhone
          <select @change=${(e: Event) => void this.selectOwner((e.target as HTMLSelectElement).value)}>
            ${this.owners.map((o) => html`<option value=${o.owner_iphone_id} ?selected=${o.owner_iphone_id === this.ownerId}>
              ${o.device_name ?? o.owner_iphone_id} (${o.complication_count})</option>`)}
          </select>
        </label>
      </header>
      ${this.loadError ? html`<div class="card error">${this.loadError}</div>` : nothing}
      <div class="layout ${this.narrow ? "narrow" : ""}">
        <div class="column">${this.renderList()}${this.renderData()}${this.renderLayers()}</div>
        <div class="column">${this.renderBanners()}${this.renderPreviews()}</div>
        <div class="column">${this.renderInspector()}${this.renderStatus()}${this.renderRules()}${this.renderRaw()}</div>
      </div>`;
  }

  private renderBanners() {
    const out: TemplateResult[] = [];
    if (this.readOnlyReason) out.push(html`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`);
    else if (this.draft && !this.hass.user?.is_admin) out.push(html`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`);
    if (this.conflict) {
      const c = this.conflict;
      out.push(html`<div class="banner err"><b>Save rejected.</b> ${c.message}
        ${c.current ? html` The server has revision ${c.current.revision}, saved ${c.current.updatedAt} by ${c.current.updatedBy || "unknown"}.` : " The server no longer has this complication."}
        <div class="acts">
          <button class="small" @click=${() => this.reloadFromServer()}>Reload the server version (lose my draft)</button>
          <button class="small" @click=${() => void this.save(true)}>Save my draft as a new complication</button>
          <button class="small" @click=${() => { this.conflict = undefined; }}>Keep editing</button>
        </div></div>`);
    } else if (this.remoteRevision !== undefined) {
      out.push(html`<div class="banner warn">${this.remoteRevision === -1 ? "This complication was deleted on the server while you were editing." : `Revision ${this.remoteRevision} was saved on the server while you were editing.`} Saving now will be rejected.
        <div class="acts">
          <button class="small" @click=${() => this.reloadFromServer()}>Reload the server version</button>
          <button class="small" @click=${() => void this.save(true)}>Save my draft as a new complication</button>
        </div></div>`);
    }
    if (this.saveError) out.push(html`<div class="banner err"><b>Could not save.</b> ${this.saveError}</div>`);
    return out;
  }

  private renderList() {
    return html`<div class="card">
      <h2>Complications<span class="spacer"></span>
        ${this.hass.user?.is_admin ? html`<button class="small" @click=${() => this.startNew(newConfig("New complication", this.freeSlot()))} ?disabled=${this.records.length >= 8}>New</button>` : nothing}
      </h2>
      ${this.records.length === 0 && !(this.draft && this.draft.baseRevision === null)
        ? html`<div class="empty">No complications for this iPhone yet.</div>`
        : html`<ul>${this.records.map((r) => html`
            <li class="row ${r.id === this.selectedId ? "selected" : ""}" @click=${() => this.selectRecord(r)}>
              <span>${String(r.document?.name ?? "Untitled")}</span>
              <span class="meta">slot ${Number(r.document?.slotIndex ?? -1) + 1} · r${r.revision}</span>
            </li>`)}
            ${this.draft && this.draft.baseRevision === null ? html`<li class="row selected"><span>${this.draft.config.name}</span><span class="meta">unsaved</span></li>` : nothing}
          </ul>`}
    </div>`;
  }

  private renderData() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const resolver = new Resolver(this.buildContext());
    return html`<div class="card">
      <h2>Data<span class="spacer"></span>
        ${this.canEdit ? html`<button class="small" @click=${() => { const nv = newNamedValue(); this.mutate((c) => { c.values.push(nv); }); this.inspect = { kind: "data", id: nv.id }; }}>Add</button>` : nothing}
      </h2>
      ${cfg.values.length === 0 ? html`<div class="empty">No named values. Layers can also read entities directly.</div>` : nothing}
      ${cfg.values.map((v) => {
        const r = resolver.resolve({ kind: { kind: "named", id: v.id } });
        const hl = this.inspect.kind === "data" && this.inspect.id === v.id;
        return html`<div class="datum ${hl ? "hl" : ""}" @click=${() => { this.inspect = { kind: "data", id: v.id }; }}>
          <span class="name">${v.name || "(unnamed)"}</span>
          <span class="meta" title=${describeValue(v.value)}>${r ?? "unresolved"}</span>
          ${this.canEdit ? html`<button class="icon" title="Delete value" @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => { c.values = c.values.filter((x) => x.id !== v.id); }); if (hl) this.inspect = { kind: "general" }; }}>×</button>` : nothing}
        </div>`;
      })}
    </div>`;
  }

  private renderLayers() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const edit = this.canEdit;
    const family = this.activeFamily;
    const move = (id: string, dir: -1 | 1) => this.mutate((c) => {
      const i = c.elements.findIndex((e) => e.payload.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= c.elements.length) return;
      [c.elements[i], c.elements[j]] = [c.elements[j]!, c.elements[i]!];
    });
    const dup = (id: string) => {
      const copyId = newId();
      this.mutate((c) => {
        const i = c.elements.findIndex((e) => e.payload.id === id);
        const src = c.elements[i]!;
        const copy = structuredClone(src);
        copy.payload.id = copyId;
        copy.payload.frame = { ...copy.payload.frame, x: Math.min(0.9, copy.payload.frame.x + 0.05), y: Math.min(0.9, copy.payload.frame.y + 0.05) };
        c.elements.splice(i + 1, 0, copy);
        for (const fam of DRAWABLE_FAMILIES) {
          const p = c.perFamily[fam]?.placements[id];
          if (p) c.perFamily[fam]!.placements[copyId] = structuredClone(p);
        }
      });
      this.inspect = { kind: "layer", id: copyId };
    };
    const del = (id: string) => {
      this.mutate((c) => {
        c.elements = c.elements.filter((e) => e.payload.id !== id);
        for (const fam of DRAWABLE_FAMILIES) delete c.perFamily[fam]?.placements[id];
      });
      if (this.inspect.kind === "layer" && this.inspect.id === id) this.inspect = { kind: "general" };
    };
    // Top of the list = drawn last = on top, like the phone editor.
    const ordered = [...cfg.elements].reverse();
    return html`<div class="card">
      <h2>Layers <span class="meta" style="text-transform:none;letter-spacing:0">(top first)</span></h2>
      ${cfg.elements.length === 0 ? html`<div class="empty">No layers.</div>` : nothing}
      ${ordered.map((el) => {
        const id = el.payload.id;
        const hl = this.inspect.kind === "layer" && this.inspect.id === id;
        const eff = effectivePlacement(cfg, family, el);
        const hidden = el.payload.isHidden || eff.isHidden;
        return html`<div class="layer ${hl ? "hl" : ""}" @click=${() => { this.inspect = { kind: "layer", id }; }}>
          <span class="kind">${el.kind}</span>
          <span class="name" style=${hidden ? "opacity:.5" : ""}>${layerTitle(el)}</span>
          ${hidden ? html`<span class="meta">hidden</span>` : nothing}
          ${edit ? html`<span class="acts">
            <button class="icon" title="Bring forward" @click=${(e: Event) => { e.stopPropagation(); move(id, 1); }}>▲</button>
            <button class="icon" title="Send back" @click=${(e: Event) => { e.stopPropagation(); move(id, -1); }}>▼</button>
            <button class="icon" title=${eff.isHidden ? `Show in ${familyTitle(family)}` : `Hide in ${familyTitle(family)}`} @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => setPlacement(c, family, id, { isHidden: !eff.isHidden })); }}>${eff.isHidden ? "◌" : "●"}</button>
            <button class="icon" title="Duplicate" @click=${(e: Event) => { e.stopPropagation(); dup(id); }}>⧉</button>
            <button class="icon" title="Delete" @click=${(e: Event) => { e.stopPropagation(); del(id); }}>×</button>
          </span>` : nothing}
        </div>`;
      })}
      ${edit ? html`<div class="adders">
        ${(["text", "icon", "gauge", "shape"] as const).map((k) => html`<button class="small" ?disabled=${cfg.elements.length >= 64} @click=${() => { const el = newElement(k); this.mutate((c) => { c.elements.push(el); }); this.inspect = { kind: "layer", id: el.payload.id }; }}>+ ${k}</button>`)}
      </div>` : nothing}
    </div>`;
  }

  private renderPreviews() {
    if (this.parseError) return html`<div class="card error">This document cannot be read: ${this.parseError}</div>`;
    const cfg = this.draft?.config;
    if (!cfg) return html`<div class="card"><div class="empty">Select a complication, or press New.</div></div>`;
    const layouts = resolveAll(cfg, this.buildContext(), this.forced);
    const highlightId = this.inspect.kind === "layer" ? this.inspect.id : undefined;
    const one = (family: "rectangular" | "circular" | "corner") => {
      const active = family === this.activeFamily;
      const opts = { icons: this.icons, showHidden: true, highlightId, handles: active && this.canEdit };
      return html`
      <div class="preview ${family} ${active ? "active" : ""}" @pointerdown=${(e: PointerEvent) => this.onPreviewPointerDown(family, e)}>
        ${renderLayout(layouts[family], opts)}
        <div class="label" @click=${() => { this.activeFamily = family; }}>${familyTitle(family)} · ${CANVAS[family].width}×${CANVAS[family].height} pt${active ? " · editing" : ""}</div>
      </div>`;
    };
    return html`<div class="card">
      <div class="previews">
        ${one("rectangular")}
        <div class="previews-row">${one("circular")}${one("corner")}</div>
      </div>
      <div class="hint" style="text-align:center;margin-top:10px">Click a preview to make it the editing family. Drags and placement fields change only that family.</div>
    </div>`;
  }

  private renderInspector() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const host = this.host();
    const tab = (label: string, active: boolean, go: () => void) => html`<button class=${active ? "active" : ""} @click=${go}>${label}</button>`;
    let body: TemplateResult;
    let title: string;
    const ins = this.inspect;
    if (ins.kind === "layer") {
      const el = cfg.elements.find((e) => e.payload.id === ins.id);
      if (!el) {
        this.inspect = { kind: "general" };
        return nothing;
      }
      title = `${el.kind} layer`;
      body = layerEditor(host, el, this.activeFamily);
    } else if (ins.kind === "data") {
      const nv = cfg.values.find((v) => v.id === ins.id);
      if (!nv) {
        this.inspect = { kind: "general" };
        return nothing;
      }
      title = "Named value";
      body = namedValueEditor(host, nv);
    } else if (ins.kind === "family") {
      title = `${familyTitle(this.activeFamily)} layout`;
      body = familyEditor(host, this.activeFamily);
    } else {
      title = "Complication";
      body = generalEditor(host, this.usedSlots());
    }
    return html`<div class="card" style=${this.canEdit ? "" : "pointer-events:none;opacity:.6"} @change=${() => this.draft?.endGesture()}>
      <div class="tabs">
        ${tab("General", ins.kind === "general", () => { this.inspect = { kind: "general" }; })}
        ${tab(`${familyTitle(this.activeFamily)} layout`, ins.kind === "family", () => { this.inspect = { kind: "family" }; })}
        ${ins.kind === "layer" ? tab("Layer", true, () => undefined) : nothing}
        ${ins.kind === "data" ? tab("Value", true, () => undefined) : nothing}
      </div>
      <h2>${title}</h2>
      ${body}
      ${ins.kind === "general" && this.canEdit ? html`<h3>Actions</h3><div class="adders">
        <button class="small" @click=${() => this.duplicate()}>Duplicate</button>
        ${this.confirmDelete
          ? html`<button class="danger small" @click=${() => void this.deleteCurrent()}>Really delete</button><button class="small" @click=${() => { this.confirmDelete = false; }}>Cancel</button>`
          : html`<button class="danger small" @click=${() => { this.confirmDelete = true; }}>Delete</button>`}
      </div>` : nothing}
    </div>`;
  }

  private renderStatus() {
    const rec = this.records.find((r) => r.id === this.selectedId);
    const d = this.draft;
    if (!d) return nothing;
    return html`<div class="card status">
      <h2>Status</h2>
      <dl class="kv">
        <dt>Revision</dt><dd>${rec ? rec.revision : "unsaved"}${d.dirty ? html` <span class="warn">· unsaved changes</span>` : ""}</dd>
        ${rec ? html`<dt>Saved</dt><dd>${rec.updatedAt || "—"} by ${rec.updatedBy || "—"}</dd>` : nothing}
        <dt>Templates</dt><dd class=${this.templateError ? "err" : "ok"}>${this.templateError ?? (this.compiled?.document ? "rendered" : "none")}</dd>
        <dt>Entities</dt><dd>${this.compiled?.entities.size ?? 0}</dd>
      </dl>
      <p class="hint" style="margin:8px 0 0">Save writes to Home Assistant. Open Wrist Assistant on the iPhone to send it to the watch.</p>
    </div>`;
  }

  private renderRules() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const resolver = new Resolver(this.buildContext());
    const groups: { title: string; rules: Rule[] }[] = [];
    for (const el of cfg.elements) if (el.payload.rules.length) groups.push({ title: layerTitle(el), rules: el.payload.rules });
    for (const family of DRAWABLE_FAMILIES) {
      const layout = cfg.perFamily[family];
      if (layout?.rules.length) groups.push({ title: `${familyTitle(family)} layout`, rules: layout.rules });
    }
    if (groups.length === 0) return nothing;
    return html`<div class="card">
      <h2>Rules</h2>
      ${groups.map((g) => g.rules.map((rule, i) => this.renderRule(`${g.title} · rule ${i + 1}`, rule, resolver)))}
      <div class="hint">Rule editing arrives in the next slice. Forcing a branch changes the preview only.</div>
    </div>`;
  }

  private renderRule(title: string, rule: Rule, resolver: Resolver): TemplateResult {
    const live = resolver.liveBranches([rule]).get(rule.id);
    const current = this.forced.get(rule.id) ?? "live";
    const set = (v: ForcedBranches extends Map<string, infer V> ? V : never) => {
      const next = new Map(this.forced);
      if (v === "live") next.delete(rule.id);
      else next.set(rule.id, v);
      this.forced = next;
    };
    const isActive = (v: string) => (current === "live" ? v === "live" : current === "otherwise" ? v === "otherwise" : current.caseId === v);
    return html`<div class="rule">
      <div class="title">${title}</div>
      <div class="branches">
        <button class=${isActive("live") ? "active" : ""} @click=${() => set("live")}>Live</button>
        ${rule.cases.map((c, i) => html`<button class="${isActive(c.id) ? "active" : ""} ${live === c.id ? "live-match" : ""}"
          @click=${() => set({ caseId: c.id })}>Case ${i + 1}</button>`)}
        ${rule.otherwise ? html`<button class="${isActive("otherwise") ? "active" : ""} ${live === "otherwise" ? "live-match" : ""}"
          @click=${() => set("otherwise")}>Otherwise</button>` : nothing}
      </div>
    </div>`;
  }

  private renderRaw() {
    if (!this.draft) return nothing;
    return html`<div class="card">
      <h2>Raw configuration <button class="link" @click=${() => (this.showRaw = !this.showRaw)}>${this.showRaw ? "hide" : "show"}</button></h2>
      ${this.showRaw ? html`<pre>${JSON.stringify(this.draft.encoded(), null, 2)}</pre>` : nothing}
    </div>`;
  }
}

function errText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

function layerTitle(el: CElement): string {
  switch (el.kind) {
    case "text": return describeValue(el.payload.value);
    case "icon": return describeValue(el.payload.symbol);
    case "gauge": return describeValue(el.payload.value);
    case "shape": return el.payload.kind;
  }
}

function describeValue(v: Value): string {
  const k = v.kind;
  switch (k.kind) {
    case "literal": return k.value ? `"${k.value}"` : "(empty)";
    case "entityState": return k.entityId;
    case "entityAttribute": return `${k.entityId}.${k.attribute}`;
    case "entityAge": return `age of ${k.entityId}`;
    case "aggregate": return `${k.aggregate.function}(...)`;
    case "time": return `time.${k.timeField}`;
    case "dataAge": return "data age";
    case "jinja": return "jinja";
    case "named": return `named ${k.id.slice(0, 8)}`;
  }
}

// After an HA restart the frontend re-imports the panel module under its
// new cache-busted URL in the same page, so a plain @customElement would
// throw "name already used". The old class keeps serving until reload.
if (!customElements.get("wrist-assistant-panel")) {
  customElements.define("wrist-assistant-panel", WristAssistantPanel);
}

declare global {
  interface HTMLElementTagNameMap {
    "wrist-assistant-panel": WristAssistantPanel;
  }
}
