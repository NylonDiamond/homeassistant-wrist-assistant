// Home Assistant sidebar panel: <wrist-assistant-panel>.
// Slice 2 scope: read-only. Pick an iPhone, pick a complication, see all
// three family previews with live HA values, force any rule branch, and
// inspect the raw document. Editing arrives in slice 3.

import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  type ComplicationRecord,
  type HassLike,
  type OwnerSummary,
  fetchList,
  fetchOwners,
  renderTemplates,
  subscribeChanges,
} from "./ha-api.js";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type Rule,
  type Value,
  DRAWABLE_FAMILIES,
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

const TEMPLATE_REFRESH_MS = 30_000;

export class WristAssistantPanel extends LitElement {
  @property({ attribute: false }) hass!: HassLike;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) panel?: { config?: { version?: string } };

  @state() private owners: OwnerSummary[] = [];
  @state() private ownerId?: string;
  @state() private records: ComplicationRecord[] = [];
  @state() private selectedId?: string;
  @state() private config?: CustomComplicationConfig;
  @state() private parseError?: string;
  @state() private maxSchemaVersion = 4;
  @state() private templateResults = new Map<string, string>();
  @state() private templateError?: string;
  @state() private templateFetchedAt?: number;
  @state() private forced: ForcedBranches = new Map();
  @state() private showRaw = false;
  @state() private highlightId?: string;
  @state() private loadError?: string;

  private compiled?: Compiled;
  private icons: IconProvider = makeIconProvider(() => this.requestUpdate());
  private unsubscribe?: () => Promise<void>;
  private templateTimer?: number;
  private lastStatesSnapshot?: Record<string, unknown>;

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
      padding: 10px 16px;
      border-bottom: 1px solid var(--divider-color);
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #fff);
    }
    header h1 { font-size: 18px; font-weight: 500; margin: 0; flex: 1; }
    header select { font: inherit; padding: 4px 8px; }
    .layout {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr) 300px;
      gap: 16px;
      padding: 16px;
      height: calc(100% - 52px);
      box-sizing: border-box;
      overflow: hidden;
    }
    /* Tablet: keep the three previews together, inspector drops below. */
    @media (max-width: 1180px) {
      .layout { grid-template-columns: 260px minmax(0, 1fr); height: auto; overflow: auto; }
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
    .card h2 { font-size: 14px; font-weight: 500; margin: 0 0 8px; opacity: .8; text-transform: uppercase; letter-spacing: .04em; }
    ul { list-style: none; margin: 0; padding: 0; }
    li.row {
      padding: 8px 10px; border-radius: 8px; cursor: pointer;
      display: flex; justify-content: space-between; align-items: center; gap: 8px;
    }
    li.row:hover { background: var(--secondary-background-color); }
    li.row.selected { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    li.row .meta { font-size: 12px; opacity: .7; }
    .previews { display: flex; flex-direction: column; gap: 16px; align-items: center; }
    .preview { text-align: center; }
    .preview .label { font-size: 12px; opacity: .7; margin-top: 6px; }
    .preview svg { display: block; margin: 0 auto; background: #000; border-radius: 12px; }
    .preview.rectangular svg { width: 320px; height: 124px; }
    .preview.circular svg { width: 220px; height: 220px; border-radius: 50%; }
    /* The corner canvas is the wedge, not the SVG box: a dark grey surround
       makes the black wedge shape readable, like a watch face's dead zone. */
    .preview.corner svg { width: 312px; height: 252px; background: #2c2c2e; }
    .preview.circular svg { background: #000; }
    .previews-row { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
    .status { font-size: 13px; line-height: 1.5; }
    .status .ok { color: var(--success-color, #43a047); }
    .status .warn { color: var(--warning-color, #ffa600); }
    .status .err { color: var(--error-color, #db4437); }
    .kv { display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; font-size: 13px; }
    .kv dt { opacity: .7; }
    .kv dd { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .layer { padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .layer:hover, .layer.hl { background: var(--secondary-background-color); }
    .layer .kind { opacity: .6; font-size: 11px; text-transform: uppercase; margin-right: 6px; }
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
    .error { color: var(--error-color, #db4437); }
  `;

  // ── lifecycle ─────────────────────────────────────────────────────────

  override connectedCallback() {
    super.connectedCallback();
    void this.loadOwners();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    void this.unsubscribe?.();
    if (this.templateTimer) window.clearInterval(this.templateTimer);
  }

  protected override updated(changed: PropertyValues) {
    if (changed.has("hass") && this.config) {
      // `hass.states` is replaced on every state change; only re-render when
      // one of our entities actually moved so an idle panel stays idle.
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

  // ── data loading ──────────────────────────────────────────────────────

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
      this.loadError = `Could not load devices: ${String((err as { message?: string }).message ?? err)}`;
    }
  }

  private async selectOwner(ownerId: string) {
    this.ownerId = ownerId;
    this.selectedId = undefined;
    this.config = undefined;
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
      if (still) this.selectRecord(still);
      else if (this.records[0]) this.selectRecord(this.records[0]);
      else {
        this.selectedId = undefined;
        this.config = undefined;
      }
    } catch (err) {
      this.loadError = `Could not load complications: ${String((err as { message?: string }).message ?? err)}`;
    }
  }

  private selectRecord(record: ComplicationRecord) {
    this.selectedId = record.id;
    this.forced = new Map();
    this.highlightId = undefined;
    this.parseError = undefined;
    try {
      this.config = parseConfig(record.document);
      this.compiled = compile(this.config);
      this.lastStatesSnapshot = undefined;
    } catch (err) {
      this.config = undefined;
      this.compiled = undefined;
      this.parseError = String((err as { message?: string }).message ?? err);
    }
    void this.refreshTemplates();
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
      this.templateError = String((err as { message?: string }).message ?? err);
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
      namedValues: this.config?.values ?? [],
      dataAgeSeconds: this.templateFetchedAt === undefined ? undefined : (Date.now() - this.templateFetchedAt) / 1000,
    };
  }

  // ── render ────────────────────────────────────────────────────────────

  override render() {
    return html`
      <header>
        <h1>Wrist Assistant</h1>
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
        <div class="column">${this.renderPreviews()}</div>
        <div class="column">${this.renderStatus()}${this.renderRules()}${this.renderRaw()}</div>
      </div>`;
  }

  private renderList() {
    return html`<div class="card">
      <h2>Complications</h2>
      ${this.records.length === 0
        ? html`<div class="empty">No complications for this iPhone yet.</div>`
        : html`<ul>${this.records.map((r) => html`
            <li class="row ${r.id === this.selectedId ? "selected" : ""}" @click=${() => this.selectRecord(r)}>
              <span>${String(r.document?.name ?? "Untitled")}</span>
              <span class="meta">slot ${String(r.document?.slotIndex ?? "?")} · r${r.revision}</span>
            </li>`)}</ul>`}
    </div>`;
  }

  private renderData() {
    if (!this.config) return nothing;
    const resolver = new Resolver(this.buildContext());
    return html`<div class="card">
      <h2>Data</h2>
      ${this.config.values.length === 0 ? html`<div class="empty">No named values.</div>` : nothing}
      <dl class="kv">
        ${this.config.values.map((v) => html`
          <dt>${v.name || "(unnamed)"}</dt>
          <dd title=${describeValue(v.value)}>${resolver.resolve({ kind: { kind: "named", id: v.id } }) ?? html`<span class="warn">unresolved</span>`}</dd>`)}
      </dl>
    </div>`;
  }

  private renderLayers() {
    if (!this.config) return nothing;
    return html`<div class="card">
      <h2>Layers</h2>
      ${this.config.elements.length === 0 ? html`<div class="empty">No layers.</div>` : nothing}
      ${this.config.elements.map((el) => html`
        <div class="layer ${el.payload.id === this.highlightId ? "hl" : ""}"
          @click=${() => (this.highlightId = this.highlightId === el.payload.id ? undefined : el.payload.id)}>
          <span class="kind">${el.kind}</span>${layerTitle(el)}
          ${el.payload.isHidden ? html` <span class="meta">(hidden)</span>` : nothing}
        </div>`)}
    </div>`;
  }

  private renderPreviews() {
    if (this.parseError) return html`<div class="card error">This document cannot be read: ${this.parseError}</div>`;
    if (!this.config) return html`<div class="card"><div class="empty">Select a complication.</div></div>`;
    const layouts = resolveAll(this.config, this.buildContext(), this.forced);
    const opts = { icons: this.icons, showHidden: true, highlightId: this.highlightId };
    const one = (family: "rectangular" | "circular" | "corner") => html`
      <div class="preview ${family}">
        ${renderLayout(layouts[family], opts)}
        <div class="label">${familyTitle(family)} · ${CANVAS[family].width}×${CANVAS[family].height} pt</div>
      </div>`;
    return html`<div class="card">
      <div class="previews">
        ${one("rectangular")}
        <div class="previews-row">${one("circular")}${one("corner")}</div>
      </div>
    </div>`;
  }

  private renderStatus() {
    const rec = this.records.find((r) => r.id === this.selectedId);
    if (!rec) return nothing;
    const schema = Number(rec.document?.schemaVersion ?? 0);
    const tooNew = schema > this.maxSchemaVersion;
    return html`<div class="card status">
      <h2>Status</h2>
      <dl class="kv">
        <dt>Revision</dt><dd>${rec.revision}</dd>
        <dt>Saved</dt><dd>${rec.updatedAt || "—"} by ${rec.updatedBy || "—"}</dd>
        <dt>Schema</dt><dd class=${tooNew ? "err" : "ok"}>v${schema}${tooNew ? ` (newer than v${this.maxSchemaVersion}, read only)` : ""}</dd>
        <dt>Templates</dt><dd class=${this.templateError ? "err" : "ok"}>${this.templateError ?? (this.compiled?.document ? "rendered" : "none")}</dd>
        <dt>Entities</dt><dd>${this.compiled?.entities.size ?? 0}</dd>
      </dl>
      <p style="opacity:.7;font-size:12px;margin:8px 0 0">Committed to Home Assistant. Open Wrist Assistant on the iPhone to send it to the watch.</p>
    </div>`;
  }

  private renderRules() {
    if (!this.config) return nothing;
    const resolver = new Resolver(this.buildContext());
    const groups: { title: string; rules: Rule[] }[] = [];
    for (const el of this.config.elements) if (el.payload.rules.length) groups.push({ title: layerTitle(el), rules: el.payload.rules });
    for (const family of DRAWABLE_FAMILIES) {
      const layout = this.config.perFamily[family];
      if (layout?.rules.length) groups.push({ title: `${familyTitle(family)} layout`, rules: layout.rules });
    }
    if (groups.length === 0) return nothing;
    return html`<div class="card">
      <h2>Rules</h2>
      ${groups.map((g) => g.rules.map((rule, i) => this.renderRule(`${g.title} · rule ${i + 1}`, rule, resolver)))}
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
    const rec = this.records.find((r) => r.id === this.selectedId);
    if (!rec) return nothing;
    return html`<div class="card">
      <h2>Raw configuration <button class="link" @click=${() => (this.showRaw = !this.showRaw)}>${this.showRaw ? "hide" : "show"}</button></h2>
      ${this.showRaw ? html`<pre>${JSON.stringify(rec.document, null, 2)}</pre>` : nothing}
    </div>`;
  }
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
