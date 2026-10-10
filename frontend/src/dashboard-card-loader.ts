// The dashboard card's entry: `wrist-assistant-card.js`.
//
// The integration adds this file to every dashboard page for every user
// (`frontend.add_extra_js_url` in complication_panel.py), so it stays small:
// it defines the element the dashboard asks for, lists the card in the card
// picker, and answers the questions the dashboard asks before anything is
// drawn. The drawing code is imported the first time a card is on screen, and
// the editor the first time someone opens the card dialog.
//
// No Lit here, and nothing that imports it: this file would carry it.

import { CARD_TAG, cardSizeFor, gridOptionsFor, parseCardConfig, type CardConfig } from "./dashboard-card-config.js";
import type { CardDesign } from "./card-api.js";
import type { HassLike } from "./ha-api.js";

type Inner = HTMLElement & { hass?: HassLike; config?: CardConfig; iconBase?: string };

/** The symbol files sit beside this entry, as they do beside the panel's. */
const ICON_BASE = import.meta.url;

class WristAssistantCard extends HTMLElement {
  private config?: CardConfig;
  private _hass?: HassLike;
  private inner?: Inner;
  private loading = false;

  setConfig(raw: unknown): void {
    this.config = parseCardConfig(raw);
    if (this.inner) this.inner.config = this.config;
  }

  set hass(hass: HassLike) {
    this._hass = hass;
    if (this.inner) this.inner.hass = hass;
  }

  get hass(): HassLike | undefined {
    return this._hass;
  }

  connectedCallback(): void {
    this.style.display = "block";
    this.style.height = "100%";
    if (this.inner || this.loading) return;
    this.loading = true;
    import("./dashboard-card.js")
      .then(() => {
        const inner = document.createElement("wa-dashboard-card") as Inner;
        inner.iconBase = ICON_BASE;
        if (this.config) inner.config = this.config;
        if (this._hass) inner.hass = this._hass;
        this.inner = inner;
        this.appendChild(inner);
      })
      .catch((err: unknown) => {
        this.textContent = `Wrist Assistant card failed to load: ${String((err as { message?: unknown })?.message ?? err)}`;
      })
      .finally(() => { this.loading = false; });
  }

  /** Masonry dashboards: height in 50 px units. */
  getCardSize(): number {
    return cardSizeFor(this.config?.shape);
  }

  /** Sections dashboards: the starting size on the 12-column grid. */
  getGridOptions() {
    return gridOptionsFor(this.config?.shape);
  }

  static async getConfigElement(): Promise<HTMLElement> {
    await import("./dashboard-card-editor.js");
    return document.createElement("wa-dashboard-card-editor");
  }

  /** What the card picker previews: the home's first design, so the preview
   * draws something real. With none, the picker shows the card's own "pick a
   * complication" message. */
  static async getStubConfig(hass: HassLike): Promise<Record<string, unknown>> {
    try {
      const { fetchCardDesigns } = await import("./card-api.js");
      const designs: CardDesign[] = await fetchCardDesigns(hass);
      const first = designs[0];
      if (first) {
        return { owner: first.owner_watch_id, complication: first.complication_id, ...(first.families[0] ? { shape: first.families[0] } : {}) };
      }
    } catch {
      // An integration too old for the command: the empty stub below.
    }
    return { owner: "library", complication: "" };
  }
}

if (!customElements.get(CARD_TAG)) customElements.define(CARD_TAG, WristAssistantCard);

interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview: boolean;
  documentationURL?: string;
}

const w = window as unknown as { customCards?: CustomCardEntry[] };
w.customCards = w.customCards ?? [];
if (!w.customCards.some((c) => c.type === CARD_TAG)) {
  w.customCards.push({
    type: CARD_TAG,
    name: "Wrist Assistant complication",
    description: "One of your Wrist Assistant complications, live, with its taps.",
    preview: true,
  });
}
