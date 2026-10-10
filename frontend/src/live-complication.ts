// One complication kept live away from the editor: the dashboard card's data.
//
// The editor resolves the open draft against `hass.states`, a 30 s poll of
// `render_values`, and history and list fetches it schedules itself. A card on
// a wall tablet has nobody editing it, so it wants the same values pushed:
//
// * Entity states come with every `hass` the dashboard hands down. A redraw
//   happens only when one of the document's own entities moved.
// * The value document (the one Jinja template `compile` writes) is followed
//   with Home Assistant's own `render_template` subscription, which renders
//   again whenever an entity the template reads changes. It is open to every
//   signed-in user, as the Markdown card relies on.
// * History, statistics and list items are fetched on load, every minute, and
//   shortly after a state change of an entity a chart draws.
//
// Nothing here draws. `dashboard-card.ts` asks for layouts and draws them.

import { compile, parseValueDocument, type ValueDocument } from "./compiler.js";
import {
  collectListResults,
  collectSeriesResults,
  fetchHistorySeries,
  fetchListItems,
  fetchStatisticsSeries,
  listItemsRequests,
  seriesRequests,
  type HassLike,
} from "./ha-api.js";
import {
  DRAWABLE_FAMILIES,
  chartHistoryRequests,
  chartStatisticsRequests,
  hasCanvas,
  pagesSpecOf,
  parseConfig,
  type CustomComplicationConfig,
  type DrawableFamily,
  type FamilyKind,
} from "./model.js";
import { resolveAll, type EntityState, type ResolveContext, type ResolvedAll } from "./resolver.js";

/** Put in front of the value document before Home Assistant renders it.
 * `render_template` parses a result that looks like a Python literal into a
 * native value, which would turn the document's JSON object into a dict and
 * print its numbers the Python way. Text that starts with a letter is never
 * parsed, so the reply stays the exact string `render_values` gives. */
export const TEMPLATE_MARKER = "WA:";

/** How often history, statistics and lists are fetched again. */
export const SERIES_REFRESH_MS = 60_000;

/** How long after a charted entity changes the series are fetched again: long
 * enough for the recorder to have written the new state. */
export const SERIES_AFTER_CHANGE_MS = 2_000;

/** HA serializes timer durations as "H:MM:SS" (numbers pass through). */
export function parseDurationSeconds(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v !== "string" || v === "") return undefined;
  const parts = v.split(":").map((p) => Number(p));
  if (parts.length === 0 || parts.length > 3 || parts.some((n) => Number.isNaN(n))) return undefined;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

/** One entity's live state in the shape the resolver wants. The same reading
 * the panel's `entityStateFor` makes, without its test values and picture
 * cache: a card draws the entity's own picture URL. */
export function entityStateFor(hass: HassLike, id: string, iconName: string): EntityState | undefined {
  const s = hass.states[id];
  if (!s) return undefined;
  const attrs = (s.attributes ?? {}) as Record<string, unknown>;
  const domain = id.split(".")[0] ?? "";
  const entry: EntityState = {
    entityId: id,
    state: s.state,
    unitOfMeasurement: typeof attrs.unit_of_measurement === "string" ? attrs.unit_of_measurement : undefined,
    iconName,
    domain,
  };
  if (domain === "timer") {
    entry.timerState = s.state;
    if (typeof attrs.finishes_at === "string") entry.finishesAt = attrs.finishes_at;
    const remaining = parseDurationSeconds(attrs.remaining);
    if (remaining !== undefined) entry.remaining = remaining;
  }
  if (typeof attrs.entity_picture === "string") entry.entityPicture = attrs.entity_picture;
  return entry;
}

/** What one `render_template` event says, or undefined when it says nothing
 * usable (an error, a reply that is not the value object). */
export function parseTemplateEvent(message: unknown): ValueDocument | undefined {
  if (typeof message !== "object" || message === null) return undefined;
  const result = (message as { result?: unknown }).result;
  if (typeof result !== "string") return undefined;
  const text = result.startsWith(TEMPLATE_MARKER) ? result.slice(TEMPLATE_MARKER.length) : result;
  return parseValueDocument(text.trim());
}

/** The shape a card draws: the one asked for when the design has it, else the
 * design's first drawable shape, else Inline. Undefined for a design with no
 * shape at all. */
export function cardShapeOf(cfg: CustomComplicationConfig, wanted: string | undefined): FamilyKind | undefined {
  const families = cfg.supportedFamilies;
  if (wanted !== undefined && (families as string[]).includes(wanted)) return wanted as FamilyKind;
  const drawable = DRAWABLE_FAMILIES.find((f) => families.includes(f));
  if (drawable) return drawable;
  return families.includes("inline") ? "inline" : undefined;
}

/** Whether the layouts show a countdown that is still running, which is the
 * one thing that changes with no event behind it. */
export function hasLiveCountdown(layouts: ResolvedAll, now = Date.now()): boolean {
  if ((layouts.inline?.countdownEnd ?? 0) > now) return true;
  return DRAWABLE_FAMILIES.some((f) => {
    const l = layouts[f];
    if (!l) return false;
    if ((l.bezelCountdownEnd ?? 0) > now) return true;
    return l.elements.some((el) => el.kind === "text" && (el.countdownEnd ?? 0) > now);
  });
}

/** What the card hands in: the connection of the moment, and what to call
 * when something it draws has changed. */
export interface LiveHost {
  hass(): HassLike | undefined;
  changed(): void;
}

/**
 * One document, its values kept current.
 *
 * `setDocument` takes a new revision; `noteHass` takes each `hass` the
 * dashboard hands down; `start` and `stop` follow whether the card is on
 * screen. `layouts(page)` is what to draw.
 */
export class LiveComplication {
  config?: CustomComplicationConfig;
  /** The last error worth showing: a template that does not render. Values
   * already on screen stay there. */
  templateError?: string;

  private templateResults = new Map<string, string>();
  private historySeries = new Map<string, string>();
  private listItems = new Map<string, string>();
  private entityIds: string[] = [];
  private iconNames = new Map<string, string>();
  private seriesEntities = new Set<string>();
  private lastSeen = new Map<string, string>();
  private doc?: string;
  private running = false;
  private unsubscribeTemplate?: () => Promise<void>;
  private templateRun = 0;
  private fetchRun = 0;
  private seriesTimer?: ReturnType<typeof setInterval>;
  private seriesSoon?: ReturnType<typeof setTimeout>;

  constructor(private readonly host: LiveHost) {}

  /** A new revision of the document, or the first one. */
  setDocument(document: unknown): void {
    const cfg = parseConfig(document);
    this.config = cfg;
    const compiled = compile(cfg);
    this.entityIds = [...compiled.entities.keys()];
    this.iconNames = new Map([...compiled.entities].map(([id, ref]) => [id, ref.iconName ?? ""]));
    this.seriesEntities = new Set([
      ...chartHistoryRequests(cfg).map((r) => r.entityId),
      ...chartStatisticsRequests(cfg).map((r) => r.entityId),
    ]);
    this.lastSeen = new Map();
    this.noteHass();
    const doc = compiled.document;
    if (doc !== this.doc) {
      this.doc = doc;
      this.templateResults = new Map();
      this.templateError = undefined;
      if (this.running) void this.subscribeTemplate();
    }
    if (this.running) void this.fetchSeriesAndLists();
  }

  /** Called with each new `hass`. True when one of the document's entities
   * changed, which is when the card redraws. */
  noteHass(): boolean {
    const hass = this.host.hass();
    if (!hass) return false;
    let changed = false;
    let charted = false;
    for (const id of this.entityIds) {
      const s = hass.states[id];
      const stamp = s ? `${s.last_updated ?? ""}|${s.state}` : "";
      if (this.lastSeen.get(id) !== stamp) {
        if (this.lastSeen.has(id) && this.seriesEntities.has(id)) charted = true;
        this.lastSeen.set(id, stamp);
        changed = true;
      }
    }
    if (charted && this.running) this.fetchSeriesSoon();
    return changed;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    void this.subscribeTemplate();
    void this.fetchSeriesAndLists();
    this.seriesTimer = setInterval(() => void this.fetchSeriesAndLists(), SERIES_REFRESH_MS);
  }

  stop(): void {
    this.running = false;
    this.templateRun++;
    this.fetchRun++;
    const unsubscribe = this.unsubscribeTemplate;
    this.unsubscribeTemplate = undefined;
    if (unsubscribe) void unsubscribe().catch(() => undefined);
    if (this.seriesTimer !== undefined) clearInterval(this.seriesTimer);
    if (this.seriesSoon !== undefined) clearTimeout(this.seriesSoon);
    this.seriesTimer = undefined;
    this.seriesSoon = undefined;
  }

  /** Fetch everything again now, the way a refresh tap makes the watch fetch. */
  refresh(): void {
    if (!this.running) return;
    void this.subscribeTemplate();
    void this.fetchSeriesAndLists();
  }

  /** How many pages the document has. */
  pageCount(): number {
    return this.config ? Math.max(1, pagesSpecOf(this.config).count) : 1;
  }

  context(page?: number): ResolveContext {
    const hass = this.host.hass();
    const entityStates = new Map<string, EntityState>();
    if (hass) {
      for (const id of this.entityIds) {
        const state = entityStateFor(hass, id, this.iconNames.get(id) ?? "");
        if (state) entityStates.set(id, state);
      }
    }
    return {
      entityStates,
      templateResults: this.templateResults,
      historySeries: this.historySeries,
      listItems: this.listItems,
      namedValues: this.config?.values ?? [],
      ...(page !== undefined && page > 1 ? { page } : {}),
    };
  }

  layouts(page?: number): ResolvedAll | undefined {
    if (!this.config) return undefined;
    return resolveAll(this.config, this.context(page));
  }

  private async subscribeTemplate(): Promise<void> {
    const run = ++this.templateRun;
    const previous = this.unsubscribeTemplate;
    this.unsubscribeTemplate = undefined;
    if (previous) void previous().catch(() => undefined);
    const hass = this.host.hass();
    const doc = this.doc;
    if (!hass || doc === undefined) return;
    try {
      const unsubscribe = await hass.connection.subscribeMessage<unknown>(
        (message) => {
          if (run !== this.templateRun) return;
          const error = (message as { error?: unknown }).error;
          if (typeof error === "string") {
            this.templateError = error;
            this.host.changed();
            return;
          }
          const parsed = parseTemplateEvent(message);
          if (!parsed) return;
          this.templateError = undefined;
          this.templateResults = parsed.values;
          this.host.changed();
        },
        { type: "render_template", template: `${TEMPLATE_MARKER}${doc}`, report_errors: true },
      );
      if (run !== this.templateRun) {
        void unsubscribe().catch(() => undefined);
        return;
      }
      this.unsubscribeTemplate = unsubscribe;
    } catch (err) {
      if (run !== this.templateRun) return;
      this.templateError = String((err as { message?: unknown })?.message ?? err);
      this.host.changed();
    }
  }

  private fetchSeriesSoon(): void {
    if (this.seriesSoon !== undefined) clearTimeout(this.seriesSoon);
    this.seriesSoon = setTimeout(() => {
      this.seriesSoon = undefined;
      void this.fetchSeriesAndLists();
    }, SERIES_AFTER_CHANGE_MS);
  }

  private async fetchSeriesAndLists(): Promise<void> {
    const hass = this.host.hass();
    const cfg = this.config;
    if (!hass || !cfg) return;
    const run = ++this.fetchRun;
    const series = seriesRequests(cfg);
    const lists = listItemsRequests(cfg);
    if (Object.keys(series.history).length + Object.keys(series.statistics).length + Object.keys(lists.requests).length === 0) return;
    // Each half on its own, so a slow recorder does not hold the lists back
    // and one failing keeps what the other drew.
    const [history, listReplies] = await Promise.all([
      Promise.all([
        fetchHistorySeries(hass, series.history).catch(() => undefined),
        fetchStatisticsSeries(hass, series.statistics).catch(() => ({})),
      ]),
      fetchListItems(hass, lists.requests).catch(() => undefined),
    ]);
    if (run !== this.fetchRun || cfg !== this.config) return;
    const [historyResults, statResults] = history;
    if (historyResults !== undefined) {
      this.historySeries = collectSeriesResults({ ...historyResults, ...statResults }).series;
    }
    if (listReplies !== undefined) this.listItems = collectListResults(listReplies);
    this.host.changed();
  }
}

/** A shape with a canvas, for the callers that need the narrower type. */
export function drawable(shape: FamilyKind | undefined): DrawableFamily | undefined {
  return shape !== undefined && hasCanvas(shape) ? shape : undefined;
}
