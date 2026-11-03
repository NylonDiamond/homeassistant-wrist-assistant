// `<wa-template-editor>`: a template tile's editor. The tile as each device
// draws it on top, Line up columns under it, then the code. A press on a part
// of the tile finds that part's code, and the caret in the code lights the part
// on the tile.
//
// It draws into its parent's root, not a shadow root of its own, so the tile
// face takes the page editor's preview rules and the code editor its colors.
//
// The code editor (`template-code.ts`, CodeMirror) is its own chunk, loaded when
// a template's task first opens. Until then the text shows in a plain box, so
// the text can be read and changed from the first draw.

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { WATCH_APP } from "./app-model.js";
import type { RenderResult } from "../ha-api.js";
import type { TemplateCode, TemplateCodeOptions, TemplateCodeView } from "./template-code.js";
import { type TemplateCell, templateRows } from "./template-rows.js";
import { type AlignedRow, type SourceIssue, type SourceScan, alignTemplate, scanTemplateSource, templateNameIssues, templateTokenValues } from "./template-source.js";
import { templateIconColor } from "./rich-text.js";
import type { HassLike } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";

/** The selected tile drawn for a device, from the page editor. */
export interface TemplateTilePicture {
  device: "watch" | "iphone";
  face: TemplateResult;
  /** The text size against the device's full size, 0.4 to 1. */
  textScale: number;
  /** The most rows the tile draws on this device. */
  rowLimit: number;
  /** Home Assistant has no good answer for this text yet, or refused it, so
   * the editor keeps showing the tile's last good look. */
  stale: boolean;
}

export interface TemplateEditorData {
  tileId: string;
  text: string;
  /** Home Assistant's answer for this text, once it has one. */
  render: RenderResult | undefined;
  columns: boolean;
  busy: boolean;
  hass: HassLike;
  icons: IconProvider;
  /** Where a recipe or a picked entity left the caret, for the text just set. */
  caret(): number | undefined;
  write(text: string, typing: boolean): void;
  remember(position: number, root: Node): void;
  ended(): void;
  setColumns(on: boolean): void;
  picture(device: "watch" | "iphone" | undefined, maxWidth: number, maxHeight: number): TemplateTilePicture | undefined;
  /** Examples, drawn above the editor. */
  examples: TemplateResult;
  /** Recipes and Insert entity, drawn under the code. */
  helpers: TemplateResult;
}

const PREFS_KEY = "wrist-assistant-panel.template-editor.v1";
const SMALL_TEXT = 0.6;
const TILE_W = 280;
const TILE_H = 230;

interface Prefs extends TemplateCodeOptions {
  device: "watch" | "iphone" | undefined;
}

function readPrefs(): Prefs {
  const start: Prefs = { view: "full", format: true, wrap: true, rows: true, device: undefined };
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}");
    if (typeof raw !== "object" || raw === null) return start;
    const r = raw as Record<string, unknown>;
    return {
      view: r["view"] === "sections" ? "sections" : "full",
      format: r["format"] !== false,
      wrap: r["wrap"] !== false,
      rows: r["rows"] !== false,
      device: r["device"] === "watch" || r["device"] === "iphone" ? r["device"] : undefined,
    };
  } catch {
    return start;
  }
}

export class WaTemplateEditor extends LitElement {
  static override properties = { data: { attribute: false } };

  declare data: TemplateEditorData;
  private prefs = readPrefs();
  private code: TemplateCode | undefined;
  private loading = false;
  private tileId: string | undefined;
  private selection = { from: 0, to: 0, head: 0, focused: false };
  private cached: { text: string; scan: SourceScan } | undefined;
  private flipFrom: Map<string, DOMRect> | undefined;
  private flipGuides = false;
  private lastFace: { tileId: string; device: string; face: TemplateResult } | undefined;

  /** Draws into the parent's root: see the top of this file. */
  protected override createRenderRoot(): HTMLElement {
    return this;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.code?.destroy();
    this.code = undefined;
    this.tileId = undefined;
    this.querySelector(".te-cm")?.replaceChildren();
  }

  private scan(): SourceScan {
    const text = this.code?.text() ?? this.data.text;
    if (this.cached?.text !== text) this.cached = { text, scan: scanTemplateSource(text) };
    return this.cached.scan;
  }

  private renderedRows(): TemplateCell[][] | undefined {
    const render = this.data.render;
    return render?.ok === true ? templateRows(render.value) : undefined;
  }

  private aligned(scan: SourceScan): AlignedRow[] | undefined {
    const rows = this.renderedRows();
    return rows === undefined ? undefined : alignTemplate(scan, rows);
  }

  private setPrefs(change: Partial<Prefs>): void {
    this.prefs = { ...this.prefs, ...change };
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(this.prefs));
    } catch {
      // Private browsing: the choice lasts this page.
    }
    this.code?.setOptions(this.prefs);
    this.requestUpdate();
  }

  private glyph(symbol: string, px: number, color: string): TemplateResult | typeof nothing {
    const drawn = this.data.icons.render(symbol, px, color);
    return drawn === undefined ? nothing : html`<svg width=${px} height=${px} viewBox=${`0 0 ${px} ${px}`} aria-hidden="true">${drawn}</svg>`;
  }

  private cellColor(cell: TemplateCell | undefined): string {
    const spec = cell?.icon?.color;
    return (spec === undefined ? undefined : templateIconColor(spec)?.hex) ?? "currentColor";
  }

  private async mount(): Promise<void> {
    if (this.loading || this.code !== undefined) return;
    this.loading = true;
    const { createTemplateCode } = await import("./template-code.js");
    this.loading = false;
    const parent = this.querySelector<HTMLElement>(".te-cm");
    if (parent === null || !this.isConnected) return;
    this.querySelector(".te-plain")?.remove();
    this.code = createTemplateCode(parent, this.data.text, this.prefs, {
      head: (row, scan) => this.rowHead(row, scan),
      pill: (from, scan) => this.pill(from, scan),
      issues: (scan, caret) => this.nameIssues(scan, caret),
      rowLimit: () => this.currentPicture()?.rowLimit ?? 5,
      entities: () => this.entityOptions(),
      symbols: () => (this.data.icons.names() ?? []).map((label) => ({ label, type: "icon" })),
      colors: () => WATCH_APP.template.richText.colorNames.filter((c: string) => c !== "grey").map((label: string) => ({ label, type: "color" })),
      drawOption: (completion) => {
        if (completion.type === "icon") return html`${this.glyph(completion.label, 14, "currentColor")}`;
        if (completion.type === "color") return html`<i style=${`background:${templateIconColor(completion.label)?.hex ?? "transparent"}`}></i>`;
        return undefined;
      },
    }, {
      changed: (text) => this.data.write(text, true),
      selected: (from, to, head, focused) => {
        this.selection = { from, to, head, focused };
        this.data.remember(head, this.getRootNode());
        this.lightTile();
      },
      blurred: () => this.data.ended(),
    });
    this.tileId = this.data.tileId;
    this.requestUpdate();
  }

  private entityOptions(): { label: string; detail: string; type: string; boost: number }[] {
    const states = this.data.hass.states;
    return Object.keys(states).sort().map((id) => {
      const entity = states[id]!;
      const unit = entity.attributes?.["unit_of_measurement"];
      const name = entity.attributes?.["friendly_name"];
      return {
        label: id,
        detail: `${typeof name === "string" ? `${name}  ` : ""}${entity.state}${typeof unit === "string" ? ` ${unit}` : ""}`,
        type: "entity",
        boost: id.startsWith("sensor.") ? 1 : 0,
      };
    });
  }

  private nameIssues(scan: SourceScan, caret: number): SourceIssue[] {
    const names = this.data.icons.names();
    return templateNameIssues(scan, { entities: Object.keys(this.data.hass.states), symbols: names }, caret);
  }

  private rowHead(row: number, scan: SourceScan): { key: string; draw: TemplateResult } {
    const aligned = this.aligned(scan)?.find((r) => r.row === row);
    const number = html`<span class="te-chv" aria-hidden="true">▸</span><span class="te-rn">${row + 1}</span>`;
    if (aligned !== undefined) {
      const key = `${row}:${JSON.stringify(aligned.cells.map((c) => c.cell))}`;
      return { key, draw: html`${number}<span class="te-rr">${aligned.cells.map((c) => html`${c.cell.icon === undefined ? nothing : html`<span class="te-g" style=${`color:${this.cellColor(c.cell)}`}>${this.glyph(c.cell.icon.symbol, 14, this.cellColor(c.cell))}</span>`}<span>${c.cell.text}</span>`)}</span>` };
    }
    const tokens = scan.rows[row]?.tokens ?? [];
    const words = tokens.map((t) => (t.kind === "text" ? t.src : t.kind === "icon" ? t.symbol ?? "" : "{ }")).join(" ");
    return { key: `${row}:${words}`, draw: html`${number}<span class="te-rr plain">${words === "" ? "Empty row" : words}</span>` };
  }

  private pill(from: number, scan: SourceScan): { key: string; draw: TemplateResult } | undefined {
    const token = scan.rows.flatMap((r) => r.tokens).find((t) => t.from === from);
    if (token === undefined) return undefined;
    const aligned = this.aligned(scan);
    if (token.kind === "icon") {
      const cell = aligned?.flatMap((r) => r.cells).find((c) => c.icon?.from === from)?.cell;
      const symbol = cell?.icon?.symbol ?? token.symbol ?? "";
      const color = this.cellColor(cell);
      return { key: `i:${from}:${symbol}:${color}`, draw: html`<span class="te-pill i"><span class="te-g" style=${`color:${color}`}>${this.glyph(symbol, 13, color)}</span>${symbol}</span>` };
    }
    if (token.kind !== "expr") return undefined;
    const value = templateTokenValues(aligned).get(from);
    const named = token.src.match(/['"]([a-z_]+\.[a-z0-9_]+)['"]/)?.[1];
    const entity = named === undefined ? undefined : this.data.hass.states[named];
    if (entity !== undefined) {
      const name = entity.attributes?.["friendly_name"];
      const label = typeof name === "string" ? name : named!;
      const shown = value ?? entity.state;
      return { key: `e:${from}:${label}:${shown}`, draw: html`<span class="te-pill e">${label} <b>${shown}</b></span>` };
    }
    return { key: `j:${from}:${value ?? ""}`, draw: html`<span class="te-pill j">{ }${value === undefined || value === "" ? nothing : html` <b>${value}</b>`}</span>` };
  }

  private currentPicture(): TemplateTilePicture | undefined {
    return this.data.picture(this.prefs.device, TILE_W, TILE_H) ?? this.data.picture(undefined, TILE_W, TILE_H);
  }

  /** Lights the tile's parts the caret is in, and marks parts that can be found. */
  private lightTile(): void {
    const tile = this.querySelector<HTMLElement>(".te-tile");
    if (tile === null) return;
    const { from, to, focused } = this.selection;
    const aligned = this.aligned(this.scan());
    tile.classList.toggle("found", aligned !== undefined);
    const at = (range: { from: number; to: number } | undefined): boolean => {
      if (range === undefined || !focused) return false;
      return from === to ? from >= range.from && from <= range.to : from < range.to && to > range.from;
    };
    for (const part of tile.querySelectorAll<HTMLElement>("[data-tp]")) {
      const cell = aligned?.[Number(part.dataset["tr"])]?.cells[Number(part.dataset["tc"])];
      part.classList.toggle("on", at(part.dataset["tp"] === "icon" ? cell?.icon : cell?.text));
    }
  }

  private pressTile(event: Event): void {
    const part = (event.target as Element).closest?.<HTMLElement>("[data-tp]");
    if (!part || this.code === undefined) return;
    const cell = this.aligned(this.scan())?.[Number(part.dataset["tr"])]?.cells[Number(part.dataset["tc"])];
    const range = part.dataset["tp"] === "icon" ? cell?.icon : cell?.text;
    if (range !== undefined) this.code.select(range.from, range.to);
  }

  /** Remembers where the cells are, so they can glide to their new places. */
  private toggleColumns(): void {
    const on = !this.data.columns;
    const rects = new Map<string, DOMRect>();
    this.querySelectorAll<HTMLElement>(".te-tile [data-tp]").forEach((part) => rects.set(`${part.dataset["tr"]}-${part.dataset["tc"]}-${part.dataset["tp"]}`, part.getBoundingClientRect()));
    this.flipFrom = rects;
    this.flipGuides = on;
    this.data.setColumns(on);
  }

  private runFlip(): void {
    const from = this.flipFrom;
    if (from === undefined || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.flipFrom = undefined;
      return;
    }
    this.flipFrom = undefined;
    const tile = this.querySelector<HTMLElement>(".te-tile");
    if (tile === null) return;
    tile.querySelectorAll<HTMLElement>("[data-tp]").forEach((part) => {
      const before = from.get(`${part.dataset["tr"]}-${part.dataset["tc"]}-${part.dataset["tp"]}`);
      if (before === undefined) return;
      const after = part.getBoundingClientRect();
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
      part.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 480, easing: "cubic-bezier(.2,.85,.2,1)" });
    });
    if (!this.flipGuides) return;
    const box = tile.getBoundingClientRect();
    const seen = new Set<number>();
    tile.querySelectorAll<HTMLElement>(".wp-tpl-cell").forEach((cell) => {
      const x = Math.round(cell.getBoundingClientRect().left - box.left);
      if (seen.has(x)) return;
      seen.add(x);
      const guide = document.createElement("i");
      guide.className = "te-guide";
      guide.style.left = `${x}px`;
      tile.appendChild(guide);
      guide.addEventListener("animationend", () => guide.remove());
    });
  }

  private openLarge(): void {
    const dialog = this.querySelector<HTMLDialogElement>("dialog.te-d");
    if (dialog === null) return;
    dialog.close();
    dialog.showModal();
    this.requestUpdate();
  }

  private closeLarge(): void {
    const dialog = this.querySelector<HTMLDialogElement>("dialog.te-d");
    if (dialog === null) return;
    dialog.close();
    dialog.show();
    this.requestUpdate();
  }

  protected override render(): TemplateResult {
    const d = this.data;
    const picture = this.currentPicture();
    const watch = d.picture("watch", TILE_W, TILE_H) !== undefined;
    const iphone = d.picture("iphone", TILE_W, TILE_H) !== undefined;
    const scan = this.scan();
    const issues = [...(scan.open === undefined ? [] : [scan.open]), ...this.nameIssues(scan, this.selection.focused ? this.selection.head : -1)];
    const refused = d.render?.ok === false && scan.open === undefined ? d.render.error : undefined;
    const small = picture !== undefined && !picture.stale && picture.textScale < SMALL_TEXT;
    let face = picture?.face;
    if (picture !== undefined) {
      const last = this.lastFace;
      if (picture.stale && last?.tileId === d.tileId && last.device === picture.device) face = last.face;
      else if (!picture.stale) this.lastFace = { tileId: d.tileId, device: picture.device, face: picture.face };
    }
    const large = this.querySelector<HTMLDialogElement>("dialog.te-d")?.matches(":modal") === true;
    const p = this.prefs;
    const viewButton = (view: TemplateCodeView, words: string) => html`<button type="button" class=${p.view === view ? "on" : ""} aria-pressed=${p.view === view ? "true" : "false"} @click=${() => this.setPrefs({ view })}>${words}</button>`;
    const chip = (key: "rows" | "format" | "wrap", words: string, title: string) => html`<button type="button" class="te-chip ${p[key] ? "on" : ""}" title=${title} aria-pressed=${p[key] ? "true" : "false"} @click=${() => this.setPrefs({ [key]: !p[key] })}>${words}</button>`;
    return html`<dialog class="te-d" @cancel=${(e: Event) => { e.preventDefault(); this.closeLarge(); }}>
      <div class="te-root">
        ${large ? html`<div class="te-large-h"><b>Template</b><button type="button" class="small" @click=${() => this.closeLarge()}>Done</button></div>` : nothing}
        ${d.examples}
        <div class="te-grid">
          <div class="te-left">
            ${picture === undefined ? nothing : html`<div class="te-well">
              ${watch && iphone ? html`<div class="te-seg" role="group" aria-label="Device">
                <button type="button" class=${picture.device === "watch" ? "on" : ""} @click=${() => this.setPrefs({ device: "watch" })}>Watch</button>
                <button type="button" class=${picture.device === "iphone" ? "on" : ""} @click=${() => this.setPrefs({ device: "iphone" })}>iPhone</button>
              </div>` : nothing}
              <div class="te-tile" @click=${(e: Event) => this.pressTile(e)}>${face}</div>
              ${small ? html`<div class="te-small" role="status">Text is small on the ${picture.device === "watch" ? "Watch" : "iPhone"}.</div>` : nothing}
            </div>`}
            <label class="te-sw"><span><b>Line up columns</b><small>Each icon starts a column.</small></span>
              <button type="button" class="te-switch ${d.columns ? "on" : ""}" role="switch" aria-checked=${d.columns ? "true" : "false"} aria-label="Line up columns" ?disabled=${d.busy} @click=${() => this.toggleColumns()}></button></label>
          </div>
          <div class="te-right">
            <div class="te-bar">
              <span class="te-lab">Code</span>
              ${p.view === "full" ? html`${chip("rows", "Rows", "Show row numbers and the lines between rows")}${chip("format", "Format", "Show each column on its own line")}${chip("wrap", "Wrap", "Wrap long lines")}` : nothing}
              <div class="te-seg" role="group" aria-label="View">${viewButton("sections", "Sections")}${viewButton("full", "Full code")}</div>
              ${large ? nothing : html`<button type="button" class="te-chip" title="Open a larger editor" @click=${() => this.openLarge()}>Open large</button>`}
            </div>
            <div class="te-cm">
              ${this.code === undefined ? html`<textarea class="te-plain" rows="6" spellcheck="false" aria-label="Template" .value=${d.text}
                @input=${(e: Event) => d.write((e.target as HTMLTextAreaElement).value, true)} @blur=${() => d.ended()}></textarea>` : nothing}
            </div>
            ${issues.length === 0 ? nothing : html`<div class="te-issues">${issues.map((issue) => html`<div class="te-issue" role="status"><span>${issue.text}</span>${issue.fix === undefined ? nothing
              : html`<button type="button" class="te-chip" @click=${() => this.code?.change(issue.fix!.from, issue.fix!.to, issue.fix!.insert)}>${issue.fix.words}</button>`}</div>`)}</div>`}
            ${refused === undefined ? nothing : html`<div class="te-issue" role="status"><span>${refused}</span></div>`}
            <div class="te-hint">${d.text.trim() === "" ? "Empty: the tile shows its symbol." : p.view === "sections" ? "Click a row to open it. Click a part to see its code." : p.format ? "Format changes the view only. The saved template stays the same." : "Type [icon: or {{ for suggestions."}</div>
            ${d.helpers}
          </div>
        </div>
      </div>
    </dialog>`;
  }

  protected override firstUpdated(): void {
    this.querySelector<HTMLDialogElement>("dialog.te-d")?.show();
    void this.mount();
  }

  protected override updated(): void {
    const d = this.data;
    if (this.code !== undefined) {
      if (this.tileId !== d.tileId) {
        this.tileId = d.tileId;
        this.code.reset(d.text);
      } else if (this.code.text() !== d.text) {
        this.code.setText(d.text, d.caret());
      } else {
        this.code.refresh();
      }
    }
    this.lightTile();
    this.runFlip();
  }
}

if (!customElements.get("wa-template-editor")) customElements.define("wa-template-editor", WaTemplateEditor);

export const templateEditorStyles = css`
  wa-template-editor { display: block; min-width: 0; container-type: inline-size; }
  dialog.te-d { position: static; display: block; width: auto; max-width: none; margin: 0; padding: 0; border: 0; background: none; color: inherit; }
  dialog.te-d:modal { position: fixed; inset: 24px; width: auto; height: auto; max-height: none; padding: 16px; border: 1px solid var(--wa-line-strong); border-radius: 14px; background: var(--wa-card); overflow: auto; }
  dialog.te-d::backdrop { background: rgba(0, 0, 0, 0.6); }
  .te-root { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .te-large-h { display: flex; align-items: center; justify-content: space-between; font-size: 14px; }
  .te-grid { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  @container (min-width: 720px) {
    .te-grid { display: grid; grid-template-columns: 300px minmax(0, 1fr); align-items: start; }
  }
  dialog.te-d:modal .te-grid { display: grid; grid-template-columns: 300px minmax(0, 1fr); align-items: start; }
  .te-left, .te-right { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .te-well { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 8px 10px 10px; border: 1px solid var(--wa-line); border-radius: 12px; background: var(--wa-well, #000); }
  .te-seg { display: inline-flex; padding: 2px; border-radius: 8px; background: var(--wa-panel); }
  .te-well .te-seg { align-self: flex-end; }
  .te-seg button { font: inherit; font-size: 11.5px; font-weight: 600; min-height: 22px; padding: 2px 9px; border: 0; border-radius: 6px; background: none; color: var(--wa-muted); cursor: pointer; }
  .te-seg button.on { background: var(--wa-seg-on, var(--wa-hover)); color: var(--wa-ink); }
  .te-tile { position: relative; display: flex; justify-content: center; max-width: 100%; }
  .te-tile.found [data-tp] { cursor: pointer; border-radius: 5px; outline: 1.5px solid transparent; outline-offset: 1px; transition: outline-color .12s; }
  .te-tile.found [data-tp]:hover { outline-color: color-mix(in srgb, currentColor 50%, transparent); }
  .te-tile.found [data-tp].on { outline-color: var(--wa-hue-orange); }
  .te-guide { position: absolute; top: 6px; bottom: 6px; width: 1px; background: var(--wa-hue-orange); opacity: 0; animation: te-guide 1.1s ease-out; pointer-events: none; }
  @keyframes te-guide { 20% { opacity: .8; } 70% { opacity: .5; } 100% { opacity: 0; } }
  .te-small { font-size: 12px; color: var(--wa-hue-orange); }
  .te-sw { display: flex; align-items: center; gap: 10px; }
  .te-sw > span { flex: 1; min-width: 0; }
  .te-sw b { display: block; font-size: 13px; font-weight: 600; }
  .te-sw small { font-size: 11.5px; color: var(--wa-muted); }
  .te-switch { flex: none; position: relative; width: 36px; height: 21px; padding: 0; border: 0; border-radius: 11px; background: var(--wa-switch-off); cursor: pointer; transition: background .18s; }
  .te-switch::after { content: ""; position: absolute; left: 2px; top: 2px; width: 17px; height: 17px; border-radius: 50%; background: #fff; transition: transform .22s cubic-bezier(.2,.8,.2,1); }
  .te-switch.on { background: var(--wa-switch-on); }
  .te-switch.on::after { transform: translateX(15px); }
  .te-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .te-lab { flex: 1; font-size: 12px; font-weight: 600; color: var(--wa-label); }
  .te-chip { font: inherit; font-size: 12px; font-weight: 600; min-height: 23px; padding: 0 9px; border: 1px solid var(--wa-line-strong); border-radius: 7px; background: none; color: var(--wa-ink); cursor: pointer; }
  .te-chip:hover { background: var(--wa-panel); }
  .te-chip.on { background: var(--wa-pick-bg); border-color: var(--wa-pick-line); }
  .te-cm { min-width: 0; }
  .te-plain { width: 100%; box-sizing: border-box; font: 12.5px/1.65 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--wa-ink); background: var(--wa-field, var(--wa-input)); border: 1px solid var(--wa-line-strong); border-radius: 9px; padding: 6px 10px; }
  .te-issues { display: flex; flex-direction: column; gap: 5px; }
  .te-issue { display: flex; align-items: center; gap: 9px; padding: 6px 9px; border: 1px solid color-mix(in srgb, var(--wa-need) 45%, transparent); border-radius: 8px; font-size: 12px; color: var(--wa-need); }
  .te-issue > span { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .te-issue .te-chip { flex: none; color: var(--wa-ink); }
  .te-hint { font-size: 11.5px; color: var(--wa-muted); }
  /* Inside the code. */
  .te-i { color: var(--wa-hue-purple); }
  .te-e { color: var(--wa-ent); }
  .te-j { color: var(--wa-val); }
  .te-on { background: color-mix(in srgb, var(--wa-hue-orange) 14%, transparent); box-shadow: 0 0 0 1.5px var(--wa-hue-orange); border-radius: 4px; animation: te-flash .7s ease-out; }
  @keyframes te-flash { 0% { background: color-mix(in srgb, var(--wa-hue-orange) 55%, transparent); } }
  .te-bad { text-decoration: underline wavy var(--wa-need); text-underline-offset: 3px; }
  .te-in { display: inline-block; width: 2ch; }
  .cm-line.te-cutline { opacity: .42; }
  .cm-line.te-rowline { padding: 5px 0 6px; border-bottom: 1px solid var(--wa-line); }
  .cm-line.te-rowline:last-child { border-bottom: 0; }
  .cm-line.te-openrow { padding: 0 0 0 27px; }
  .cm-line.te-openrow:has(+ .te-rh), .cm-line.te-openrow:last-child { padding-bottom: 9px; border-bottom: 1px solid var(--wa-line); }
  .te-rh { display: flex; align-items: center; gap: 8px; margin: 0 -10px; padding: 8px 12px; border-bottom: 1px solid var(--wa-line); font: 600 13.5px ui-rounded, "SF Pro Rounded", system-ui, sans-serif; color: var(--wa-ink); white-space: nowrap; overflow: hidden; cursor: pointer; user-select: none; }
  .te-rh:hover { background: var(--wa-hover); }
  .te-rh.open { padding-bottom: 3px; border-bottom: 0; }
  .te-rh.cut { opacity: .5; }
  .te-rh.cut::after { content: "The tile draws fewer rows"; margin-left: auto; font-size: 11.5px; color: var(--wa-hue-orange); }
  .te-rh.bad::after { content: ""; width: 7px; height: 7px; margin-left: 2px; border-radius: 50%; background: var(--wa-need); }
  .te-chv { width: 11px; font-size: 14px; line-height: 1; text-align: center; color: var(--wa-soft); transition: transform .14s; }
  .te-rh.open .te-chv { transform: rotate(90deg); }
  .te-rn { min-width: .9em; font-size: 11.5px; font-weight: 700; color: var(--wa-muted); }
  .te-rr { display: inline-flex; align-items: center; gap: 5px; min-width: 0; }
  .te-rr.plain { color: var(--wa-soft); font-weight: 500; }
  .te-g { display: inline-flex; align-items: center; }
  .te-pill { display: inline-flex; align-items: center; gap: 5px; height: 21px; margin: 1px 0; padding: 0 7px; border-radius: 6px; font: 600 11.5px system-ui, sans-serif; white-space: nowrap; vertical-align: 1px; cursor: pointer; }
  .te-pill b { font-weight: 700; color: var(--wa-ink); }
  .te-pill.e { background: var(--wa-ent-bg); color: var(--wa-ent); }
  .te-pill.i { background: color-mix(in srgb, var(--wa-hue-purple) 14%, transparent); color: var(--wa-hue-purple); }
  .te-pill.j { background: var(--wa-val-bg); color: var(--wa-val); }
  .te-opt { display: inline-flex; flex: none; width: 18px; justify-content: center; }
  .te-opt i { display: block; width: 12px; height: 12px; border-radius: 50%; }
`;
