// The map editor's Style mode (mock board 4): the home style, the look
// every Home map tile starts with when it has none of its own (`doc.style`,
// the tile rule in `edit-ops.ts`).
//
// The left rail is the Looks gallery: seven pictures of this floor, each
// drawn by the tiles' own art (`tile-art.ts`) in its look, the picked one
// ringed. The middle column replaces the plan stage: a big live preview of
// the floor in the picked look with the home style's options (a model look
// turned by dragging across it, saved on letting go), and under it the same
// floor as a watch tile 2 × 2, an iPhone tile 4 × 2 and the iPhone's full
// map. The inspector holds the home style's turn, room names, devices,
// furniture and light glow; each room's floor finish; and the Home map
// tiles of the library's pages, each following the home style or with a
// look of its own, Edit opening its page, and Use the home style on all of
// them taking their own looks away and saving each page through the
// library, as the page editor saves it.
//
// Every edit of the map is an `edit-ops.ts` function, saved through the
// shell (`editor-mode.ts` has the rules); the words and the tile list are
// `style-model.ts`.

import { type TemplateResult, html, nothing } from "lit";
import { live } from "lit/directives/live.js";
import { rangeFill } from "../form-styles.js";
import { fetchLibraryItem, fetchLibrarySummary, saveLibraryItem, type LibraryObject, type LibrarySummary } from "../library/client.js";
import type { WatchPagesDocument } from "../watch-pages/model.js";
import { type HomeMapStyleChange, homeStyleOf, setHomeStyle, setRoomFinish } from "./edit-ops.js";
import type { HomeMapEditorContext, HomeMapMode } from "./editor-mode.js";
import { hmeCard } from "./editor-parts.js";
import { homeMapCount } from "./editor-view.js";
import { homeFloorGuess } from "./geometry.js";
import { HOME_MAP_FINISH_NAMES } from "./mode-arrange.js";
import {
  type HomeMapFinish,
  type HomeMapFloor,
  type HomeMapStyle,
  HOME_MAP_FINISHES,
  HOME_MAP_LOOKS,
  homeMapLightsOn,
  homeMapLightsOnWords,
  homeMapRoomName,
} from "./model.js";
import { HOME_MAP_LOOK_WORDS, type HomeMapTileUse, homeMapPagesWithoutTileStyle, homeMapTileUses } from "./style-model.js";
import { HOME_TILE_MODEL_LOOKS, homeTileArt, homeTileGround, homeTileLightsColor, homeTilePlanRect, homeTileTitleColor } from "./tile-art.js";

/** The gallery's pictures, in CSS pixels. */
const THUMB = { width: 112, height: 68 };

/** The previews under the big one, in the devices' points, and the fewest
 * pixels per point they are drawn at. */
const WATCH_TILE = { width: 94, height: 94, radius: 34 };
const PHONE_TILE = { width: 188, height: 94, radius: 22 };
const PHONE_MAP = { width: 60, height: 94, radius: 18 };
const PREVIEW_UNIT = 1.6;

/** Where the Used on card stands. */
type UsesState = "idle" | "loading" | "done" | "error";

export class StyleMode implements HomeMapMode {
  readonly id = "style" as const;
  /** The turn while the preview is dragged, before it is saved. */
  turnLive: number | undefined;
  private summary: LibrarySummary | undefined;
  private usesState: UsesState = "idle";
  private busy = false;
  private message: string | undefined;

  /** The home style as it shows now: the map's, with a turn being dragged. */
  private style(ctx: HomeMapEditorContext): Required<HomeMapStyle> {
    const style = homeStyleOf(ctx.doc);
    return this.turnLive === undefined ? style : { ...style, turn: this.turnLive };
  }

  private set(ctx: HomeMapEditorContext, change: HomeMapStyleChange): void {
    ctx.apply((d) => setHomeStyle(d, change));
  }

  // ── the rail ───────────────────────────────────────────────────────────

  rail(ctx: HomeMapEditorContext): TemplateResult {
    const style = this.style(ctx);
    const states = ctx.hass?.states;
    return html`<div class="hme-h hme-pad">Looks</div>
      <div class="hme-looks">
        ${HOME_MAP_LOOKS.map((look) => {
          const on = look === style.look;
          const art = homeTileArt({ floor: ctx.floor, states, ...style, look, names: false, width: THUMB.width, height: THUMB.height });
          return html`<button type="button" class="hme-look ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} @click=${() => this.set(ctx, { look })}>
            <svg viewBox=${`0 0 ${THUMB.width} ${THUMB.height}`} style=${`background:${homeTileGround(look, 0.5)}`} aria-hidden="true">${art}</svg>
            <span>${HOME_MAP_LOOK_WORDS[look].title}</span></button>`;
        })}
      </div>
      <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`;
  }

  // ── the middle ─────────────────────────────────────────────────────────

  stage(ctx: HomeMapEditorContext): TemplateResult {
    const style = this.style(ctx);
    const model = HOME_TILE_MODEL_LOOKS.includes(style.look);
    const words = HOME_MAP_LOOK_WORDS[style.look];
    const { width, height } = ctx.stage;
    // A wide stage draws the picture larger, so its names and lines grow
    // with it rather than staying tile sized on a big screen.
    const k = Math.min(Math.max(width / 760, 1), 2.6);
    const vw = Math.max(width / k, 1);
    const vh = Math.max(height / k, 1);
    const art = width <= 0 ? nothing : homeTileArt({
      floor: ctx.floor,
      states: ctx.hass?.states,
      ...style,
      width: Math.max(vw - 48, 1),
      height: Math.max(vh - 96, 1),
      tileHeight: vh,
      icons: ctx.icons,
    });
    return html`<div class="hme-style-col">
      <div class="hme-stage hme-style-big ${model ? "turns" : ""}" style=${`background:${homeTileGround(style.look, k)}`}
        @pointerdown=${(e: PointerEvent) => { if (model) this.turnDrag(ctx, e, style.turn); }}>
        <div class="hme-style-title" style=${`color:${homeTileTitleColor(style.look)}`}><strong>${words.title}</strong><span>${words.hint}</span></div>
        <svg class="hme-svg" viewBox=${`0 0 ${vw.toFixed(1)} ${vh.toFixed(1)}`} role="img" aria-label=${`The floor in the ${words.title} look`}>
          <g transform="translate(24 64)">${art}</g></svg>
        ${model ? html`<span class="hme-style-turn" style=${`color:${homeTileTitleColor(style.look)}`}>Drag to turn · ${style.turn}°</span>` : nothing}
      </div>
      <section class="hme-card hme-style-tiles">
        ${this.face(ctx, style, WATCH_TILE, "Watch tile 2 × 2", true)}
        ${this.face(ctx, style, PHONE_TILE, "iPhone tile 4 × 2", true)}
        ${this.face(ctx, style, PHONE_MAP, "iPhone full map", false)}
      </section>
    </div>`;
  }

  /** The floor as a tile, laid out as the apps lay it (`homeMapFace` in the
   * page editor): the picture inset, the title on a tile taller than 90
   * points, and how many lights are on. `words` false draws the picture
   * alone, as the iPhone's full map. */
  private face(ctx: HomeMapEditorContext, style: Required<HomeMapStyle>, box: { width: number; height: number; radius: number }, label: string, words: boolean): TemplateResult {
    // Larger on a wide screen, as the big preview is.
    const s = Math.min(Math.max(ctx.stage.width / 1100, PREVIEW_UNIT), 2.6);
    const states = ctx.hass?.states;
    const rect = words ? homeTilePlanRect(box.width, box.height) : { x: 4, y: 4, width: box.width - 8, height: box.height - 8 };
    const art = homeTileArt({ floor: ctx.floor, states, ...style, width: rect.width, height: rect.height, tileHeight: words ? box.height : 0, icons: ctx.icons });
    const lit = homeMapLightsOn(ctx.floor, states);
    const inset = 6 * s;
    return html`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${box.width * s}px;height:${box.height * s}px;border-radius:${box.radius}px;background:${homeTileGround(style.look, s)}`}>
        <svg viewBox=${`0 0 ${rect.width} ${rect.height}`} aria-hidden="true"
          style=${`left:${rect.x * s}px;top:${rect.y * s}px;width:${rect.width * s}px;height:${rect.height * s}px`}>${art}</svg>
        ${words && box.height > 90 ? html`<span class="hme-face-title" style=${`left:${inset}px;top:${inset}px;font-size:${11 * s}px;color:${homeTileTitleColor(style.look)}`}>${floorTitle(ctx.floor)}</span>` : nothing}
        ${words ? html`<span class="hme-face-words" style=${`left:${inset}px;bottom:${inset}px;font-size:${10 * s}px;color:${homeTileLightsColor(style.look, lit > 0)}`}>${homeMapLightsOnWords(lit)}</span>` : nothing}
      </div>
      <figcaption>${label}</figcaption>
    </figure>`;
  }

  /** Drag across the preview to turn the model; saved on letting go. */
  private turnDrag(ctx: HomeMapEditorContext, e: PointerEvent, start: number): void {
    if (e.button !== 0) return;
    const el = e.currentTarget as Element;
    const sx = e.clientX;
    try {
      el.setPointerCapture?.(e.pointerId);
    } catch {
      /* a synthetic press has no pointer to capture */
    }
    const move = (ev: Event) => {
      const p = ev as PointerEvent;
      let turn = start + (p.clientX - sx) * 0.5;
      turn = ((((turn + 180) % 360) + 360) % 360) - 180;
      this.turnLive = Math.round(turn);
      ctx.redraw();
    };
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      const turn = this.turnLive;
      this.turnLive = undefined;
      if (turn !== undefined && turn !== start) this.set(ctx, { turn });
      else ctx.redraw();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  }

  overlay(): typeof nothing {
    return nothing;
  }

  leave(): void {
    this.turnLive = undefined;
    this.usesState = "idle";
    this.message = undefined;
  }

  // ── the inspector ──────────────────────────────────────────────────────

  inspector(ctx: HomeMapEditorContext): TemplateResult {
    const style = this.style(ctx);
    const model = HOME_TILE_MODEL_LOOKS.includes(style.look);
    const chip = (label: string, on: boolean, click: () => void) => html`<button type="button" class="hme-chip sel ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} @click=${click}>${label}</button>`;
    return html`
      ${hmeCard("Home style", html`
        <p class="hme-text">Every Home map tile starts with this look. A tile can still pick its own in its Map card.</p>
        <div class="hme-r"><span class="hme-l">Turn</span>
          <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${live(String(style.turn))} ?disabled=${!model} aria-label="Turn the model"
            style=${rangeFill(style.turn, -180, 180)}
            @input=${(e: Event) => { this.turnLive = Number((e.target as HTMLInputElement).value); ctx.redraw(); }}
            @change=${(e: Event) => { this.turnLive = undefined; this.set(ctx, { turn: Number((e.target as HTMLInputElement).value) }); }} />
          <span class="hme-val mono hme-w48">${model ? `${style.turn}°` : "flat"}</span></div>
        <div class="hme-r"><span class="hme-l">Room names</span>${chip(style.names ? "Shown" : "Hidden", style.names, () => this.set(ctx, { names: !style.names }))}</div>
        <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
          ${chip("Lights", style.devices === "lights", () => this.set(ctx, { devices: "lights" }))}
          ${chip("All", style.devices === "all", () => this.set(ctx, { devices: "all" }))}
          ${chip("None", style.devices === "none", () => this.set(ctx, { devices: "none" }))}</div></div>
        <div class="hme-r"><span class="hme-l">Furniture</span>${chip(style.furniture ? "Shown" : "Hidden", style.furniture, () => this.set(ctx, { furniture: !style.furniture }))}</div>
        <div class="hme-r"><span class="hme-l">Light glow</span>${chip(style.glow ? "On" : "Off", style.glow, () => this.set(ctx, { glow: !style.glow }))}</div>`)}

      ${hmeCard("Floors", html`
        ${ctx.floor.rooms.length === 0 ? html`<p class="hme-empty-line">No rooms on this floor yet.</p>` : nothing}
        ${ctx.floor.rooms.map((room) => {
          const guess = homeFloorGuess(room);
          return html`<div class="hme-r top"><span class="hme-l">${homeMapRoomName(room)}</span><div class="hme-chips">
            ${chip(`Auto: ${HOME_MAP_FINISH_NAMES[guess]}`, room.finish === undefined, () => ctx.apply((d) => setRoomFinish(d, room.id, undefined)))}
            ${HOME_MAP_FINISHES.map((f: HomeMapFinish) => chip(HOME_MAP_FINISH_NAMES[f], room.finish === f, () => ctx.apply((d) => setRoomFinish(d, room.id, f))))}
          </div></div>`;
        })}`, "shows in Plan, Night and Warm")}

      ${this.usesCard(ctx)}`;
  }

  /** Read the library's pages once for the Used on card. */
  private loadUses(ctx: HomeMapEditorContext): void {
    const hass = ctx.hass;
    if (this.usesState !== "idle" || hass === undefined) return;
    this.usesState = "loading";
    fetchLibrarySummary(hass).then(
      (summary) => {
        this.summary = summary;
        this.usesState = "done";
        ctx.redraw();
      },
      () => {
        this.usesState = "error";
        ctx.redraw();
      },
    );
  }

  private usesCard(ctx: HomeMapEditorContext): TemplateResult {
    this.loadUses(ctx);
    if (this.usesState !== "done") {
      return hmeCard("Used on", html`<p class="hme-text dim">${this.usesState === "error" ? "Could not read your pages." : "Reading your pages…"}</p>`);
    }
    const uses = homeMapTileUses(this.summary, ctx.doc);
    const own = uses.filter((u) => u.own);
    return hmeCard(`Used on ${homeMapCount(uses.length, "tile")}`, html`
      ${uses.length === 0 ? html`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>` : nothing}
      ${uses.map((u) => this.useRow(ctx, u))}
      ${own.length === 0 ? nothing : html`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${() => void this.useHomeStyleOnAll(ctx, own)}>${this.busy ? "Saving…" : `Use the home style on all ${own.length}`}</button>`}
      ${this.message === undefined ? nothing : html`<p class="hme-text dim" role="status">${this.message}</p>`}`);
  }

  private useRow(ctx: HomeMapEditorContext, u: HomeMapTileUse): TemplateResult {
    return html`<div class="hme-use">
      <i style=${`background:${homeTileGround(u.look, 0.2)}`}></i>
      <div><span>${u.pageName} · ${u.what} ${u.size}</span><small>${u.words}</small></div>
      ${ctx.openPage === undefined ? nothing : html`<button type="button" class="hme-tb" @click=${() => ctx.openPage?.(u.pageId)}>Edit</button>`}
    </div>`;
  }

  /** Use the home style on every tile with a look of its own: each page
   * read, its tiles' look keys taken away and saved through the library
   * from the revision just read. */
  private async useHomeStyleOnAll(ctx: HomeMapEditorContext, own: readonly HomeMapTileUse[]): Promise<void> {
    const hass = ctx.hass;
    if (hass === undefined || this.busy) return;
    const pages = [...new Set(own.map((u) => u.pageId))];
    const sure = await ctx.confirm({
      title: `Use the home style on ${homeMapCount(own.length, "tile")}?`,
      text: `Their own looks come off, so each draws the home style. ${pages.length === 1 ? "The page is" : `The ${pages.length} pages are`} saved for every watch and iPhone that shows ${pages.length === 1 ? "it" : "them"}.`,
      ok: "Use the home style",
    });
    if (!sure) return;
    this.busy = true;
    this.message = undefined;
    ctx.redraw();
    let failed = 0;
    for (const pageId of pages) {
      try {
        const reply = await fetchLibraryItem(hass, "pages", pageId);
        const next = homeMapPagesWithoutTileStyle(reply.document as WatchPagesDocument);
        if (next !== undefined) await saveLibraryItem(hass, "pages", pageId, reply.revision, next as LibraryObject);
      } catch {
        failed += 1;
      }
    }
    this.busy = false;
    this.message = failed === 0 ? "Done: those tiles follow the home style now." : `${homeMapCount(failed, "page")} could not be saved. Try again, or open ${failed === 1 ? "it" : "them"} to see why.`;
    this.usesState = "idle";
    ctx.redraw();
  }
}

/** A tile's title over the floor: its name, else Home map. */
function floorTitle(floor: HomeMapFloor): string {
  return floor.name.trim() === "" ? "Home map" : floor.name.trim();
}
