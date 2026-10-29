// The map editor's Home style panel (mock board C), opened from the bar's
// Home style button: the home style, the look every Home map tile starts
// with when it has none of its own (`doc.style`, the tile rule in
// `edit-ops.ts`).
//
// It floats over the page under the bar and closes with ✕, Escape or a
// click outside it. It holds the Looks: seven pictures of this floor, each
// drawn by the tiles' own art (`tile-art.ts`) in its look, the picked one
// ringed; what the tiles show (room names, devices, furniture, light glow)
// and the model's turn; the floor as a watch tile 2 × 2 and an iPhone tile
// 4 × 2 in the picked look; and the Home map tiles of the library's pages,
// each following the home style or with a look of its own, Edit opening its
// page, and Use the home style on all of them taking their own looks away
// and saving each page through the library, as the page editor saves it. A
// room's floor finish is in that room's own card on the page.
//
// Every edit of the map is an `edit-ops.ts` function, saved through the
// shell (`editor-mode.ts` has the rules); the words and the tile list are
// `style-model.ts`.

import { type TemplateResult, html, nothing } from "lit";
import { live } from "lit/directives/live.js";
import { rangeFill } from "../form-styles.js";
import { fetchLibraryItem, fetchLibrarySummary, saveLibraryItem, type LibraryObject, type LibrarySummary } from "../library/client.js";
import type { WatchPagesDocument } from "../watch-pages/model.js";
import { type HomeMapStyleChange, homeStyleOf, setHomeStyle } from "./edit-ops.js";
import type { HomeMapEditorContext } from "./editor-mode.js";
import { hmeCard } from "./editor-parts.js";
import { homeMapCount } from "./editor-view.js";
import { type HomeMapFloor, type HomeMapStyle, HOME_MAP_LOOKS, homeMapLightsOn, homeMapLightsOnWords } from "./model.js";
import { HOME_MAP_LOOK_WORDS, type HomeMapTileUse, homeMapPagesWithoutTileStyle, homeMapTileUses } from "./style-model.js";
import { HOME_TILE_MODEL_LOOKS, homeTileArt, homeTileGround, homeTileLightsColor, homeTilePlanRect, homeTileTitleColor } from "./tile-art.js";

/** The looks' pictures, in CSS pixels. */
const THUMB = { width: 112, height: 68 };

/** The tile previews, in the devices' points, and the pixels per point they
 * are drawn at. */
const WATCH_TILE = { width: 94, height: 94, radius: 34 };
const PHONE_TILE = { width: 188, height: 94, radius: 22 };
const PREVIEW_UNIT = 0.9;

/** Where the Used on card stands. */
type UsesState = "idle" | "loading" | "done" | "error";

export class HomeStylePanel {
  /** The turn while its slider is dragged, before it is saved. */
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

  /** The panel, `close` putting it away. */
  panel(ctx: HomeMapEditorContext, close: () => void): TemplateResult {
    const style = this.style(ctx);
    const states = ctx.hass?.states;
    const model = HOME_TILE_MODEL_LOOKS.includes(style.look);
    const chip = (label: string, on: boolean, click: () => void) => html`<button type="button" class="hme-chip sel ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} @click=${click}>${label}</button>`;
    return html`<div class="hme-style-scrim" @pointerdown=${(e: Event) => { if (e.target === e.currentTarget) close(); }}></div>
      <div class="hme-style-pop" role="dialog" aria-label="Home style">
        <header class="hme-style-head">
          <strong>Home style</strong>
          <span>How every map tile looks, unless a tile picks its own</span>
          <button type="button" class="hme-x hme-style-close" aria-label="Close" title="Close (Esc)" @click=${close}>✕</button>
        </header>

        ${hmeCard("Look", html`<div class="hme-looks four">
          ${HOME_MAP_LOOKS.map((look) => {
            const on = look === style.look;
            const art = homeTileArt({ floor: ctx.floor, states, ...style, look, names: false, width: THUMB.width, height: THUMB.height });
            return html`<button type="button" class="hme-look ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} title=${HOME_MAP_LOOK_WORDS[look].hint}
              @click=${() => this.set(ctx, { look })}>
              <svg viewBox=${`0 0 ${THUMB.width} ${THUMB.height}`} style=${`background:${homeTileGround(look, 0.5)}`} aria-hidden="true">${art}</svg>
              <span>${HOME_MAP_LOOK_WORDS[look].title}</span></button>`;
          })}
        </div>
        <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`)}

        <div class="hme-style-row">
          ${hmeCard("Show", html`
            <div class="hme-r"><span class="hme-l">Room names</span>${chip(style.names ? "Shown" : "Hidden", style.names, () => this.set(ctx, { names: !style.names }))}</div>
            <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
              ${chip("Lights", style.devices === "lights", () => this.set(ctx, { devices: "lights" }))}
              ${chip("All", style.devices === "all", () => this.set(ctx, { devices: "all" }))}
              ${chip("None", style.devices === "none", () => this.set(ctx, { devices: "none" }))}</div></div>
            <div class="hme-r"><span class="hme-l">Furniture</span>${chip(style.furniture ? "Shown" : "Hidden", style.furniture, () => this.set(ctx, { furniture: !style.furniture }))}</div>
            <div class="hme-r"><span class="hme-l">Light glow</span>${chip(style.glow ? "On" : "Off", style.glow, () => this.set(ctx, { glow: !style.glow }))}</div>
            <div class="hme-r"><span class="hme-l">Turn</span>
              <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${live(String(style.turn))} ?disabled=${!model} aria-label="Turn the model"
                style=${rangeFill(style.turn, -180, 180)}
                @input=${(e: Event) => { this.turnLive = Number((e.target as HTMLInputElement).value); ctx.redraw(); }}
                @change=${(e: Event) => { this.turnLive = undefined; this.set(ctx, { turn: Number((e.target as HTMLInputElement).value) }); }} />
              <span class="hme-val mono hme-w48">${model ? `${style.turn}°` : "flat"}</span></div>`, undefined, "hme-grow-card")}
          ${hmeCard("Preview", html`<div class="hme-style-tiles">
            ${this.face(ctx, style, WATCH_TILE, "Watch tile 2 × 2")}
            ${this.face(ctx, style, PHONE_TILE, "iPhone tile 4 × 2")}
          </div>`, HOME_MAP_LOOK_WORDS[style.look].title, "hme-grow-card")}
        </div>

        ${this.usesCard(ctx)}
      </div>`;
  }

  /** The floor as a tile, laid out as the apps lay it (`homeMapFace` in the
   * page editor): the picture inset, the title on a tile taller than 90
   * points, and how many lights are on. */
  private face(ctx: HomeMapEditorContext, style: Required<HomeMapStyle>, box: { width: number; height: number; radius: number }, label: string): TemplateResult {
    const s = PREVIEW_UNIT;
    const states = ctx.hass?.states;
    const rect = homeTilePlanRect(box.width, box.height);
    const art = homeTileArt({ floor: ctx.floor, states, ...style, width: rect.width, height: rect.height, tileHeight: box.height, icons: ctx.icons });
    const lit = homeMapLightsOn(ctx.floor, states);
    const inset = 6 * s;
    return html`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${box.width * s}px;height:${box.height * s}px;border-radius:${box.radius * s}px;background:${homeTileGround(style.look, s)}`}>
        <svg viewBox=${`0 0 ${rect.width} ${rect.height}`} aria-hidden="true"
          style=${`left:${rect.x * s}px;top:${rect.y * s}px;width:${rect.width * s}px;height:${rect.height * s}px`}>${art}</svg>
        ${box.height > 90 ? html`<span class="hme-face-title" style=${`left:${inset}px;top:${inset}px;font-size:${11 * s}px;color:${homeTileTitleColor(style.look)}`}>${floorTitle(ctx.floor)}</span>` : nothing}
        <span class="hme-face-words" style=${`left:${inset}px;bottom:${inset}px;font-size:${10 * s}px;color:${homeTileLightsColor(style.look, lit > 0)}`}>${homeMapLightsOnWords(lit)}</span>
      </div>
      <figcaption>${label}</figcaption>
    </figure>`;
  }

  /** The panel put away: a turn half dragged dropped, the pages read again
   * next time. */
  leave(): void {
    this.turnLive = undefined;
    this.usesState = "idle";
    this.message = undefined;
  }

  /** The home style's look, for the bar's swatch. */
  look(ctx: Pick<HomeMapEditorContext, "doc">): Required<HomeMapStyle>["look"] {
    return homeStyleOf(ctx.doc).look;
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
