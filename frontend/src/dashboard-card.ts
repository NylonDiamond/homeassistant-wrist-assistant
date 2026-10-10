// The dashboard card's drawing: one complication, live, inside an `ha-card`.
//
// Loaded on demand by `dashboard-card-loader.ts` the first time a card is on
// screen, so a dashboard with no card never fetches it. The loader owns the
// element the dashboard knows (`wrist-assistant-card`) and puts one of these
// inside it.
//
// The design is read with `card/get` and followed with `card/subscribe`, so an
// edit in the panel shows here without a reload. Its values come from
// `LiveComplication`. It is drawn by the editor's own renderer, at the
// reference watch's or iPhone's slot, so the card and the editor's preview are
// one drawing.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { errorCode, fetchCardRecord, subscribeCardRecord, type CardEvent, type CardRecord } from "./card-api.js";
import type { CardConfig } from "./dashboard-card-config.js";
import { actionAt, runTapAction } from "./demo.js";
import type { HassLike } from "./ha-api.js";
import { makeIconProvider } from "./icons.js";
import { isHomeFamily } from "./layouts.js";
import { LiveComplication, cardShapeOf, drawable, hasLiveCountdown } from "./live-complication.js";
import { inlineRuns, type CustomComplicationConfig, type DrawableFamily, type TapAction } from "./model.js";
import { CANVAS, REFERENCE_CASE, REFERENCE_PHONE, renderLayout, slotFor, type IconProvider } from "./renderer.js";
import { countdownRemainingString, type ResolvedAll, type ResolvedInline, type ResolvedLayout } from "./resolver.js";
import { previewTintFor } from "./shapePreviews.js";

/** Tap actions only the watch can run: they open its screens or keep its own
 * state. A press on one does nothing here rather than pretend. */
const WATCH_ONLY: ReadonlySet<TapAction["type"]> = new Set([
  "openApp", "openPage", "openRoomPage", "timerStartPause", "timerCancel", "addTodo", "runHTTPAction",
]);

/** How long a failed tap's note stays on the card. */
const NOTE_MS = 4_000;

export class WaDashboardCard extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) config?: CardConfig;
  /** The loader's own `import.meta.url`: the symbol files sit beside it. */
  @property({ attribute: false }) iconBase = "";

  @state() private record?: CardRecord;
  @state() private problem?: string;
  @state() private page = 1;
  @state() private note?: string;
  @state() private tick = 0;

  private live = new LiveComplication({
    hass: () => this.hass,
    changed: () => this.requestUpdate(),
  });
  private icons?: IconProvider;
  private unsubscribe?: () => Promise<void>;
  private loadRun = 0;
  private loadedFor = "";
  private countdown?: ReturnType<typeof setInterval>;
  private noteTimer?: ReturnType<typeof setTimeout>;
  private onVisibility = () => this.syncRunning();

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this.onVisibility);
    this.syncRunning();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.teardown();
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass) {
      this.live.noteHass();
      this.syncRunning();
    }
    if (changed.has("config")) {
      this.page = 1;
      this.syncRunning();
    }
  }

  /** Whether this card should be live: on the page, in a visible tab, with a
   * connection and a config. A hidden tab costs nothing. */
  private syncRunning(): void {
    const on = this.isConnected && document.visibilityState !== "hidden" && !!this.hass && !!this.config;
    if (!on) {
      this.teardown();
      return;
    }
    if (!this.icons) this.icons = makeIconProvider(() => this.requestUpdate(), this.iconBase || document.baseURI);
    const key = `${this.config!.owner}|${this.config!.complication}`;
    if (key !== this.loadedFor) {
      this.teardown();
      this.loadedFor = key;
      void this.load(this.config!.owner, this.config!.complication);
    }
  }

  private teardown(): void {
    this.loadRun++;
    this.loadedFor = "";
    this.live.stop();
    const unsubscribe = this.unsubscribe;
    this.unsubscribe = undefined;
    if (unsubscribe) void unsubscribe().catch(() => undefined);
    if (this.countdown !== undefined) clearInterval(this.countdown);
    this.countdown = undefined;
  }

  private async load(owner: string, id: string): Promise<void> {
    const run = ++this.loadRun;
    const hass = this.hass!;
    try {
      const record = await fetchCardRecord(hass, owner, id);
      if (run !== this.loadRun) return;
      this.take(record);
      this.live.start();
      const unsubscribe = await subscribeCardRecord(hass, owner, id, (event) => {
        if (run === this.loadRun) this.onRecordEvent(event);
      });
      if (run !== this.loadRun) {
        void unsubscribe().catch(() => undefined);
        return;
      }
      this.unsubscribe = unsubscribe;
    } catch (err) {
      if (run !== this.loadRun) return;
      this.record = undefined;
      const code = errorCode(err);
      this.problem = code === "not_found"
        ? "This complication was deleted, or this card names one that never existed."
        : code === "unknown_command"
          ? "Update the Wrist Assistant integration to show complications on dashboards."
          : `Could not load this complication: ${String((err as { message?: unknown })?.message ?? err)}`;
      // Not found now can be found later (a restore, a restart), so try again
      // the next time the card comes back on screen.
      this.loadedFor = "";
    }
  }

  private onRecordEvent(event: CardEvent): void {
    if ("deleted" in event) {
      this.record = undefined;
      this.problem = "This complication was deleted.";
      return;
    }
    this.take(event);
  }

  /** The card ships in the integration's own bundle, beside the store that
   * refuses any schema newer than it knows, so every stored document is one
   * this code can draw. */
  private take(record: CardRecord): void {
    this.problem = undefined;
    this.record = record;
    this.live.setDocument(record.document);
    if (this.page > this.live.pageCount()) this.page = 1;
  }

  // ── drawing ─────────────────────────────────────────────────────────

  protected override render(): TemplateResult {
    const config = this.config;
    const bare = config?.background === "none";
    const cls = bare ? "bare" : "";
    if (this.problem) return html`<ha-card class=${cls}><div class="message">${this.problem}</div></ha-card>`;
    const cfg = this.live.config;
    if (!cfg || !this.record) return html`<ha-card class=${cls}><div class="message quiet">Loading…</div></ha-card>`;
    const shape = cardShapeOf(cfg, config?.shape);
    if (shape === undefined) {
      return html`<ha-card class=${cls}><div class="message">${cfg.name || "This complication"} has no shape to draw.</div></ha-card>`;
    }
    const layouts = this.live.layouts(this.page) ?? {};
    this.syncCountdown(layouts);
    const family = drawable(shape);
    const body = family === undefined
      ? this.renderInline(layouts.inline)
      : this.renderFace(cfg, family, layouts[family]);
    return html`<ha-card class=${cls}>
      ${body}
      ${this.note ? html`<div class="note" role="status">${this.note}</div>` : nothing}
    </ha-card>`;
  }

  private renderFace(cfg: CustomComplicationConfig, family: DrawableFamily, layout: ResolvedLayout | undefined) {
    if (!layout || !this.icons) return html`<div class="message quiet">Nothing to draw yet.</div>`;
    const slot = slotFor(isHomeFamily(family) ? REFERENCE_PHONE : REFERENCE_CASE, family);
    const art = renderLayout(layout, {
      icons: this.icons,
      slot,
      ...previewTintFor(family, false, undefined),
    });
    const taps = this.config?.taps !== false;
    return html`<div class="face ${family} ${taps ? "taps" : ""}"
      aria-label=${cfg.name || "Complication"}
      @pointerdown=${taps ? (e: PointerEvent) => void this.onPress(cfg, family, layout, e) : undefined}>${art}</div>`;
  }

  private renderInline(inline: ResolvedInline | undefined) {
    if (!inline) return html`<div class="message quiet">Nothing to draw yet.</div>`;
    const now = Date.now();
    const value = inline.countdownEnd !== undefined && inline.countdownEnd > now
      ? countdownRemainingString((inline.countdownEnd - now) / 1000)
      : inline.text;
    const runs = inlineRuns(`${inline.label ? `${inline.label}: ` : ""}${value}`);
    const symbol = inline.symbol && this.icons ? this.icons.render(inline.symbol, 18, "#FFFFFF") : undefined;
    return html`<div class="inline">
      ${symbol ? html`<span class="sym">${symbol}</span>` : nothing}
      <span>${runs.map((r) => ("text" in r ? r.text : html`<span class="sym">${this.icons?.render(r.symbol, 16, "#FFFFFF") ?? nothing}</span>`))}</span>
    </div>`;
  }

  /** A one-second redraw while a countdown runs, and none otherwise. */
  private syncCountdown(layouts: ResolvedAll): void {
    const live = hasLiveCountdown(layouts);
    if (live && this.countdown === undefined) {
      this.countdown = setInterval(() => { this.tick++; }, 1000);
    } else if (!live && this.countdown !== undefined) {
      clearInterval(this.countdown);
      this.countdown = undefined;
    }
  }

  // ── taps ────────────────────────────────────────────────────────────

  /**
   * A press on the face, treated as a finger on the watch: the point is taken
   * inside the design box, which every shape letterboxes into its slot and the
   * corner draws inside a whole screen quadrant. The editor's demo does the
   * same (`demoPoint` in panel.ts).
   */
  private async onPress(cfg: CustomComplicationConfig, family: DrawableFamily, layout: ResolvedLayout, e: PointerEvent): Promise<void> {
    const face = e.currentTarget as HTMLElement | null;
    const svg = face?.querySelector<SVGSVGElement>("svg.complication");
    const box = svg?.querySelector<SVGGraphicsElement>("[data-design-box]");
    const ctm = box?.getScreenCTM();
    const design = CANVAS[family];
    if (!svg || !ctm || design.width <= 0 || design.height <= 0) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const local = pt.matrixTransform(ctm.inverse());
    const { action } = actionAt(cfg, layout, { x: local.x / design.width, y: local.y / design.height });
    if (action.type === "none" || WATCH_ONLY.has(action.type)) return;
    e.preventDefault();
    face?.classList.add("pressed");
    setTimeout(() => face?.classList.remove("pressed"), 160);
    if (action.type === "openEntity") {
      this.dispatchEvent(new CustomEvent("hass-more-info", {
        detail: { entityId: action.entityId }, bubbles: true, composed: true,
      }));
      return;
    }
    const pages = this.live.pageCount();
    const outcome = await runTapAction(action, {
      hass: this.hass!,
      refresh: () => this.live.refresh(),
      stepPage: (by) => {
        if (pages <= 1) return false;
        this.page = ((this.page - 1 + by + pages) % pages) + 1;
        return true;
      },
      showPage: (page) => {
        if (pages <= 1) return false;
        this.page = Math.min(Math.max(1, Math.trunc(page)), pages);
        return true;
      },
      playTour: () => false,
    });
    if (outcome.kind === "failed") this.showNote(outcome.text);
  }

  private showNote(text: string): void {
    this.note = text;
    if (this.noteTimer !== undefined) clearTimeout(this.noteTimer);
    this.noteTimer = setTimeout(() => { this.note = undefined; }, NOTE_MS);
  }

  static override styles = css`
    :host {
      display: block;
      height: 100%;
    }
    ha-card {
      height: 100%;
      box-sizing: border-box;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    ha-card.bare {
      background: none;
      border: none;
      box-shadow: none;
      padding: 0;
    }
    .face {
      flex: 1 1 auto;
      width: 100%;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;
      transition: opacity 120ms ease;
    }
    .face.taps {
      cursor: pointer;
    }
    .face.pressed {
      opacity: 0.6;
    }
    .face svg.complication {
      display: block;
      width: 100%;
      height: 100%;
      max-height: 100%;
    }
    .inline {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 16px;
      font-weight: 600;
      padding: 4px 8px;
      background: #000;
      color: #fff;
      border-radius: 10px;
    }
    .inline .sym {
      display: inline-flex;
      vertical-align: middle;
    }
    .inline .sym svg {
      display: block;
    }
    .message {
      padding: 8px 12px;
      color: var(--primary-text-color);
      font-size: 14px;
      text-align: center;
    }
    .message.quiet {
      color: var(--secondary-text-color);
    }
    .note {
      position: absolute;
      left: 8px;
      right: 8px;
      bottom: 8px;
      padding: 6px 10px;
      border-radius: 8px;
      background: var(--error-color, #db4437);
      color: #fff;
      font-size: 12px;
      text-align: center;
    }
  `;
}

if (!customElements.get("wa-dashboard-card")) customElements.define("wa-dashboard-card", WaDashboardCard);
