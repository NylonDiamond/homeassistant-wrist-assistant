// The Shared tab's landing page: one card for each thing the whole home keeps
// once, every watch and iPhone using the same (HTTP actions, Camera framing,
// the Home map). It replaces the "On every device" block that sat under the
// device list on Home and scrolled out of sight. Each card shows its state at
// a glance and opens its own screen, whose address stays what it was.
//
// Only reads: this page saves nothing, so it has no draft and no leave
// question. A card whose read fails says so and still opens its screen, which
// has its own words for the failure.

import { LitElement, css, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { type CameraFraming, type HassLike, type HttpActionsRecord, type OwnerSummary, fetchCameras, fetchHttpActions } from "../ha-api.js";
import { HOME_LIBRARY_LEAD, HOME_LIBRARY_TITLE, homeLibraryScreens } from "../home.js";
import { homeMapRead, homeMapReadFailed } from "../home-map/store.js";
import { isPlainClick, type WatchScreen } from "../shell.js";
import { uiIcon } from "../ui-icons.js";
import { type MapPlan, cameraCardFacts, httpCardFacts, mapCardFacts } from "./model.js";

/** A read that has not come back yet, or that failed. */
type Read<T> = { state: "loading" } | { state: "failed" } | { state: "ready"; value: T };

/** What a card whose read failed says in place of its facts. */
const NOT_READ_TEXT = "Could not read this just now. Open it to try again.";

@customElement("wa-shared-tab")
export class WaSharedTab extends LitElement {
  @property({ attribute: false }) hass: HassLike | undefined;
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  /** A screen's full address, so each Open is a real link. */
  @property({ attribute: false }) hrefOf: ((path: string) => string) | undefined;
  /** A plain click on Open: go there in place. */
  @property({ attribute: false }) onOpen: ((path: string) => void) | undefined;

  @state() private http: Read<HttpActionsRecord> = { state: "loading" };
  @state() private cameras: Read<CameraFraming[]> = { state: "loading" };
  /** The connection the reads were made on: a new one reads again. */
  private readFor: unknown;

  protected override willUpdate(): void {
    const connection = this.hass?.connection;
    if (connection === undefined || connection === this.readFor) return;
    this.readFor = connection;
    this.readAll(this.hass!);
  }

  private readAll(hass: HassLike): void {
    this.http = { state: "loading" };
    this.cameras = { state: "loading" };
    fetchHttpActions(hass).then(
      (value) => { this.http = { state: "ready", value }; },
      () => { this.http = { state: "failed" }; },
    );
    fetchCameras(hass).then(
      (reply) => { this.cameras = { state: "ready", value: reply.cameras }; },
      () => { this.cameras = { state: "failed" }; },
    );
  }

  /** The head of a card: its sign, its name (with its pre-release pill, read
   * from `WATCH_SCREENS`), and Open, a real link. */
  private cardHead(screen: WatchScreen, icon: Parameters<typeof uiIcon>[0]): TemplateResult {
    return html`<div class="sh-hd">
      <span class="sh-box" aria-hidden="true">${uiIcon(icon)}</span>
      <h2>${screen.label}</h2>
      ${screen.beta === undefined ? nothing : html`<span class="sh-beta">${screen.beta === "alpha" ? "ALPHA" : "BETA"}</span>`}
      <a class="sh-open" href=${this.hrefOf?.(screen.path) ?? screen.path} aria-label=${`Open ${screen.label}`}
        @click=${(e: MouseEvent) => {
          if (this.onOpen === undefined || !isPlainClick(e)) return;
          e.preventDefault();
          this.onOpen(screen.path);
        }}>Open${uiIcon("right")}</a>
    </div>`;
  }

  private renderHttp(screen: WatchScreen): TemplateResult {
    const read = this.http;
    const facts = read.state === "ready" ? httpCardFacts(read.value, this.owners) : undefined;
    return html`<section class="sh-card" aria-label=${screen.label}>
      ${this.cardHead(screen, "globe")}
      <p class="sh-m">${facts?.words ?? (read.state === "failed" ? NOT_READ_TEXT : "Reading…")}</p>
      ${facts === undefined || facts.rows.length === 0 ? nothing : html`<ul class="sh-list">${facts.rows.map((r) => html`<li>${r.method === undefined ? nothing : html`<code>${r.method}</code>`}<span>${r.name}</span></li>`)}</ul>`}
    </section>`;
  }

  private renderCameras(screen: WatchScreen): TemplateResult {
    const read = this.cameras;
    const facts = read.state === "ready" ? cameraCardFacts(read.value) : undefined;
    const picture = (entityId: string) => {
      const url = this.hass?.states?.[entityId]?.attributes?.entity_picture;
      return typeof url === "string" ? url : undefined;
    };
    return html`<section class="sh-card" aria-label=${screen.label}>
      ${this.cardHead(screen, "image")}
      <p class="sh-m">${facts?.words ?? (read.state === "failed" ? NOT_READ_TEXT : "Reading…")}</p>
      ${facts === undefined || facts.thumbs.length === 0 ? nothing : html`<div class="sh-thumbs">${facts.thumbs.map((t) => {
        const url = picture(t.entityId);
        return html`<span class="sh-thumb" title=${t.framed ? `${t.name}, framed` : t.name}>${url === undefined ? nothing : html`<img src=${url} alt="" loading="lazy" />`}${t.framed ? html`<i class="sh-framed" aria-hidden="true"></i>` : nothing}</span>`;
      })}</div>`}
    </section>`;
  }

  private renderMap(screen: WatchScreen): TemplateResult {
    const read = homeMapRead(this.hass, () => this.requestUpdate());
    const facts = read === undefined ? undefined : mapCardFacts(read.doc);
    return html`<section class="sh-card" aria-label=${screen.label}>
      ${this.cardHead(screen, "home")}
      <p class="sh-m">${facts?.words ?? (homeMapReadFailed() ? NOT_READ_TEXT : "Reading…")}</p>
      ${facts?.plan === undefined ? nothing : planArt(facts.plan)}
    </section>`;
  }

  protected override render(): TemplateResult {
    const screens = homeLibraryScreens();
    const card = (screen: WatchScreen) => {
      if (screen.id === "http-actions") return this.renderHttp(screen);
      if (screen.id === "cameras") return this.renderCameras(screen);
      return this.renderMap(screen);
    };
    return html`<div class="sh-page">
      <h1>${HOME_LIBRARY_TITLE}</h1>
      <p class="sh-lead">${HOME_LIBRARY_LEAD}</p>
      <div class="sh-cards">${screens.map(card)}</div>
    </div>`;
  }

  static override styles = css`
    :host { display: block; flex: 1 1 auto; min-height: 0; overflow: auto; background: var(--wa-bg); color: var(--wa-ink); }
    .sh-page { box-sizing: border-box; padding: 28px clamp(16px, 3vw, 40px) 40px; }
    h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -.01em; }
    .sh-lead { margin: 6px 0 0; font-size: 13.5px; color: var(--wa-label, var(--wa-muted)); }
    .sh-cards { margin-top: 22px; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr)); gap: 14px; }
    .sh-card {
      display: flex; flex-direction: column; gap: 10px; min-width: 0; box-sizing: border-box; padding: 14px 16px 16px;
      background: var(--wa-card); border: 1px solid var(--wa-line); border-radius: 12px;
    }
    .sh-hd { display: flex; align-items: center; gap: 10px; }
    .sh-box { display: grid; place-items: center; width: 28px; height: 28px; flex: none; border-radius: 7px; background: var(--wa-panel); color: var(--wa-label, var(--wa-muted)); }
    .sh-box svg.ui-icon { width: 14px; height: 14px; }
    h2 { margin: 0; font-size: 15px; font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sh-beta { flex: none; padding: 1px 6px; border: 1px solid var(--wa-line-strong); border-radius: 999px; font-size: 9.5px; font-weight: 600; letter-spacing: .1em; color: var(--wa-muted); }
    a.sh-open {
      display: inline-flex; align-items: center; gap: 6px; margin-left: auto; flex: none; height: 28px; box-sizing: border-box; padding: 0 11px;
      border-radius: 7px; border: 1px solid var(--wa-line-strong); background: var(--wa-card);
      color: var(--wa-ink); font-size: 12.5px; font-weight: 600; text-decoration: none; white-space: nowrap;
    }
    a.sh-open:hover { background: var(--wa-hover); }
    a.sh-open:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    a.sh-open svg.ui-icon { width: 13px; height: 13px; }
    .sh-m { margin: 0; font-size: 12.5px; color: var(--wa-muted); }
    .sh-list { list-style: none; margin: 0; padding: 0; border: 1px solid var(--wa-line); border-radius: 8px; overflow: hidden; }
    .sh-list li { display: flex; align-items: center; gap: 14px; height: 28px; padding: 0 10px; font-size: 12.5px; border-top: 1px solid var(--wa-line); }
    .sh-list li:first-child { border-top: 0; }
    .sh-list span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sh-list code { flex: none; width: 34px; font: 600 10.5px ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--wa-muted); }
    .sh-thumbs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
    .sh-thumb { position: relative; height: 48px; border-radius: 6px; overflow: hidden; background: var(--wa-panel); }
    .sh-thumb img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .sh-framed { position: absolute; left: 5px; bottom: 5px; width: 6px; height: 6px; border-radius: 50%; background: var(--wa-green); box-shadow: 0 0 0 1px rgba(0, 0, 0, .4); }
    svg.sh-plan { display: block; width: 100%; height: 104px; border-radius: 8px; background: var(--wa-panel); }
    .sh-room { fill: color-mix(in srgb, var(--wa-ink) 16%, transparent); stroke: color-mix(in srgb, var(--wa-ink) 60%, transparent); }
    .sh-pin { fill: var(--wa-hue-yellow, currentColor); }
  `;
}

/** A floor drawn small: its rooms' outlines and a dot for each pin. Only to
 * recognize the map by, so it carries no names. */
function planArt(plan: MapPlan): TemplateResult {
  const dot = plan.stroke * 2.4;
  return html`<svg class="sh-plan" viewBox=${plan.viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    ${plan.rooms.map((r) => svg`<polygon class="sh-room" points=${r.points} stroke-width=${plan.stroke}></polygon>`)}
    ${plan.pins.map((p) => svg`<circle class="sh-pin" cx=${p.x} cy=${p.y} r=${dot}></circle>`)}
  </svg>`;
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-shared-tab": WaSharedTab;
  }
}
