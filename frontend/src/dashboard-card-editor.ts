// The dashboard card's visual editor: pick a design, its shape, and two
// switches. Home Assistant shows it in the card dialog beside a live preview
// and saves what `config-changed` carries.
//
// Plain form controls, not Home Assistant's own: those are loaded lazily by
// the frontend and may not be defined yet when a card dialog first opens.

import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { fetchCardDesigns, type CardDesign } from "./card-api.js";
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

  private asked = false;

  setConfig(config: CardConfig): void {
    this.config = config;
  }

  protected override updated(): void {
    if (this.hass && !this.asked) {
      this.asked = true;
      fetchCardDesigns(this.hass)
        .then((designs) => {
          this.designs = designs;
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
    return html`
      <label>
        <span>Complication</span>
        <select @change=${(e: Event) => this.pickDesign((e.target as HTMLSelectElement).value)}>
          ${chosen ? nothing : html`<option value="" selected disabled>Pick a complication</option>`}
          ${designGroups(this.designs).map(([owner, list]) => html`<optgroup label=${owner}>
            ${list.map((d) => {
              const v = `${d.owner_watch_id}|${d.complication_id}`;
              return html`<option value=${v} ?selected=${v === value}>${d.name || "Untitled"}</option>`;
            })}
          </optgroup>`)}
        </select>
      </label>
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
      <p class="quiet">Taps that only the watch can do, such as opening a page, do nothing here.</p>
    `;
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
