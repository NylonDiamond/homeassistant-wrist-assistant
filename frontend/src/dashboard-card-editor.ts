// The dashboard card's visual editor: pick a design from its picture, its
// shape, and two switches. Home Assistant shows it in the card dialog beside a live preview
// and saves what `config-changed` carries.
//
// Plain form controls, not Home Assistant's own: those are loaded lazily by
// the frontend and may not be defined yet when a card dialog first opens.

import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { fetchCardDesigns, fetchCardThumb, type CardDesign } from "./card-api.js";
import { base64ToPng } from "./card-snapshot.js";
import { withCanvasHint, type CardConfig } from "./dashboard-card-config.js";
import type { HassLike } from "./ha-api.js";

const SHAPE_NAMES: Record<string, string> = {
  rectangular: "Rectangular",
  circular: "Circular",
  corner: "Corner",
  inline: "Inline",
  small: "Small tile",
  medium: "Medium tile",
  large: "Large tile",
  xlarge: "Extra large tile",
  dashboard: "Dashboard card",
};

/** The heading over the designs made for dashboards, which go first: they
 * are sized for this grid, where a watch's shape is a stand-in. */
const DASHBOARD_GROUP = "Made for dashboards";

/** Pictures fetched at once. A home has dozens of designs, and each picture
 * is a round trip of a few kilobytes over the dashboard's own connection. */
const THUMB_FETCHES = 3;

/** More designs than this and the picker gets a filter. */
const FILTER_FROM = 12;

/** One revision's picture: a new save is a new picture. */
function thumbKey(d: CardDesign): string {
  return `${d.owner_watch_id}|${d.complication_id}|${d.revision}`;
}

/** Designs whose name holds `text`, ignoring case. */
export function filterDesigns(designs: readonly CardDesign[], text: string): CardDesign[] {
  const wanted = text.trim().toLocaleLowerCase();
  if (!wanted) return [...designs];
  return designs.filter((d) => (d.name || "Untitled").toLocaleLowerCase().includes(wanted));
}

/** The picker's groups: Dashboard designs first, then every other design
 * under the device it sits on, in the order the store lists them. */
export function designGroups(designs: readonly CardDesign[]): [string, CardDesign[]][] {
  const groups = new Map<string, CardDesign[]>();
  const made = designs.filter((d) => d.families.includes("dashboard"));
  if (made.length > 0) groups.set(DASHBOARD_GROUP, made);
  for (const d of designs) {
    if (d.families.includes("dashboard")) continue;
    const list = groups.get(d.owner_name) ?? [];
    list.push(d);
    groups.set(d.owner_name, list);
  }
  return [...groups];
}

export class WaDashboardCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @state() private config?: CardConfig;
  @state() private designs?: CardDesign[];
  @state() private loadError?: string;
  @state() private filter = "";

  private asked = false;
  /** Object URLs of the pictures fetched, by `thumbKey`. */
  private thumbs = new Map<string, string>();
  private thumbRun = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.designs) void this.loadThumbs(this.designs);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.thumbRun++;
    for (const url of this.thumbs.values()) URL.revokeObjectURL(url);
    this.thumbs.clear();
  }

  setConfig(config: CardConfig): void {
    this.config = config;
  }

  protected override updated(): void {
    if (this.hass && !this.asked) {
      this.asked = true;
      fetchCardDesigns(this.hass)
        .then((designs) => {
          this.designs = designs;
          void this.loadThumbs(designs);
          // A Dashboard design resized in the panel since this card was set
          // up: its grid hint is brought up to date, so the card's starting
          // size on the dashboard follows the design.
          if (this.config) {
            const next = withCanvasHint(this.config, this.chosen());
            if (next !== this.config) this.emit(next);
          }
        })
        .catch((err: unknown) => { this.loadError = String((err as { message?: unknown })?.message ?? err); });
    }
  }

  /** Fetch the picture of every design that has one, a few at a time. A
   * picture that fails leaves its tile with the name alone. */
  private async loadThumbs(designs: readonly CardDesign[]): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const run = ++this.thumbRun;
    const queue = designs.filter((d) => d.preview && !this.thumbs.has(thumbKey(d)));
    const worker = async () => {
      for (let d = queue.shift(); d && run === this.thumbRun; d = queue.shift()) {
        try {
          const png = await fetchCardThumb(hass, d.owner_watch_id, d.complication_id, d.revision);
          if (run !== this.thumbRun) return;
          this.thumbs.set(thumbKey(d), URL.createObjectURL(base64ToPng(png)));
          this.requestUpdate();
        } catch {
          // Refused or gone: the name is enough to pick by.
        }
      }
    };
    await Promise.all(Array.from({ length: THUMB_FETCHES }, worker));
  }

  private emit(next: CardConfig): void {
    this.config = next;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: next }, bubbles: true, composed: true }));
  }

  private chosen(): CardDesign | undefined {
    const c = this.config;
    if (!c || !this.designs) return undefined;
    const id = (c.complication ?? "").toUpperCase();
    return this.designs.find((d) => d.owner_watch_id === c.owner && d.complication_id === id)
      ?? this.designs.find((d) => d.complication_id === id);
  }

  private pickDesign(value: string): void {
    const design = this.designs?.find((d) => `${d.owner_watch_id}|${d.complication_id}` === value);
    if (!design || !this.config) return;
    const next: CardConfig = { ...this.config, owner: design.owner_watch_id, complication: design.complication_id };
    // A shape the new design has stays; otherwise its first shape.
    if (next.shape === undefined || !design.families.includes(next.shape)) {
      if (design.families[0] !== undefined) next.shape = design.families[0];
      else delete next.shape;
    }
    this.emit(withCanvasHint(next, design));
  }

  private pickShape(shape: string): void {
    if (!this.config) return;
    this.emit(withCanvasHint({ ...this.config, shape }, this.chosen()));
  }

  protected override render(): TemplateResult {
    if (this.loadError) return html`<p class="error">Could not list complications: ${this.loadError}</p>`;
    if (!this.designs || !this.config) return html`<p class="quiet">Loading complications…</p>`;
    if (this.designs.length === 0) {
      return html`<p class="quiet">No complications yet. Make one in the Wrist Assistant panel first.</p>`;
    }
    const chosen = this.chosen();
    const value = chosen ? `${chosen.owner_watch_id}|${chosen.complication_id}` : "";
    const c = this.config;
    const shown = filterDesigns(this.designs, this.filter);
    return html`
      <div class="pick" role="group" aria-label="Complication">
        <span>Complication</span>
        ${this.designs.length > FILTER_FROM
          ? html`<input class="filter" type="search" placeholder="Filter by name" .value=${this.filter}
              @input=${(e: Event) => { this.filter = (e.target as HTMLInputElement).value; }} />`
          : nothing}
        ${shown.length === 0 ? html`<p class="quiet">No complication is named like that.</p>` : nothing}
        ${designGroups(shown).map(([owner, list]) => html`<div class="group">
          <h4>${owner}</h4>
          <div class="tiles">${list.map((d) => this.renderTile(d, value))}</div>
        </div>`)}
      </div>
      ${chosen && chosen.families.length > 1
        ? html`<label>
            <span>Shape</span>
            <select @change=${(e: Event) => this.pickShape((e.target as HTMLSelectElement).value)}>
              ${chosen.families.map((f) => html`<option value=${f} ?selected=${f === c.shape}>${SHAPE_NAMES[f] ?? f}</option>`)}
            </select>
          </label>`
        : nothing}
      <label class="check">
        <input type="checkbox" .checked=${c.taps !== false}
          @change=${(e: Event) => this.emit({ ...c, taps: (e.target as HTMLInputElement).checked })} />
        <span>Taps run, the way they do on the watch</span>
      </label>
      <label class="check">
        <input type="checkbox" .checked=${c.background !== "none"}
          @change=${(e: Event) => this.emit({ ...c, background: (e.target as HTMLInputElement).checked ? "card" : "none" })} />
        <span>Card background</span>
      </label>
      ${c.shape === "dashboard" && c.canvas
        ? html`<p class="quiet">Sized ${Math.round(c.canvas.width)} × ${Math.round(c.canvas.height)} points in the panel. It starts at that size on a sections dashboard, and is drawn at its own proportions at any size.</p>`
        : nothing}
      <p class="quiet">Taps that only the watch can do, such as opening a page, starting a timer, adding a to-do or running an HTTP action, do nothing here.</p>
    `;
  }

  private renderTile(d: CardDesign, chosen: string): TemplateResult {
    const v = `${d.owner_watch_id}|${d.complication_id}`;
    const url = this.thumbs.get(thumbKey(d));
    const p = d.preview;
    let picture: TemplateResult;
    if (url && p?.focus) {
      // A corner's picture is its whole quarter of the screen: the tile shows
      // the disc, as Browse does.
      const f = p.focus;
      picture = html`<svg class="pic" viewBox=${`${f.cx - f.diameter / 2} ${f.cy - f.diameter / 2} ${f.diameter} ${f.diameter}`}
        aria-hidden="true"><image href=${url} width=${p.width} height=${p.height} preserveAspectRatio="none"></image></svg>`;
    } else if (url) {
      picture = html`<img class="pic" src=${url} alt="" />`;
    } else {
      picture = html`<span class="pic blank">${SHAPE_NAMES[d.families[0] ?? ""] ?? ""}</span>`;
    }
    return html`<button type="button" class="tile" aria-pressed=${v === chosen ? "true" : "false"}
      @click=${() => this.pickDesign(v)}>${picture}<span class="name">${d.name || "Untitled"}</span></button>`;
  }

  static override styles = css`
    :host {
      display: grid;
      gap: 12px;
      color: var(--primary-text-color);
    }
    label {
      display: grid;
      gap: 4px;
      font-size: 14px;
    }
    label.check {
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 8px;
    }
    .pick {
      display: grid;
      gap: 4px;
      font-size: 14px;
    }
    .group h4 {
      margin: 8px 0 4px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
      gap: 8px;
    }
    .tile {
      display: grid;
      justify-items: center;
      gap: 6px;
      padding: 8px;
      font: inherit;
      font-size: 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .tile[aria-pressed="true"] {
      border-color: var(--primary-color, #03a9f4);
      box-shadow: 0 0 0 1px var(--primary-color, #03a9f4);
    }
    .tile .pic {
      width: 88px;
      height: 88px;
      object-fit: contain;
    }
    .tile .blank {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: var(--secondary-background-color, #eee);
      color: var(--secondary-text-color);
      text-align: center;
    }
    .tile .name {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .filter,
    select {
      font: inherit;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .quiet {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin: 0;
    }
    .error {
      color: var(--error-color, #db4437);
    }
  `;
}

if (!customElements.get("wa-dashboard-card-editor")) customElements.define("wa-dashboard-card-editor", WaDashboardCardEditor);
