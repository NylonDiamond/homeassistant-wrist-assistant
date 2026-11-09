import { html, svg, nothing, type TemplateResult } from "lit";
import type { TemplateEditorData } from "./template-editor.js";
import { templateRows } from "./template-rows.js";
import { type TemplateLayoutPart, type TemplateTileLayout, type TemplateLayoutItem, templateLayoutParts, templateLayoutShape, resolveTemplateLayout, alignTemplateItems } from "./template-layout.js";
import { type TemplateColorChoice, templateItemSource, templateItemCodeRange, templateItemColorChange, applyTemplateSourceChanges } from "./template-item-source.js";
import { templateIconColor } from "./rich-text.js";
import { templateSelectionRect, templateMarqueeSelection, type SelectionPoint } from "./template-item-selection.js";
import { snapTemplateItems, type TemplateSnapBox, type TemplateAlignmentGuide } from "./template-item-snap.js";

interface ItemHost {
  data(): TemplateEditorData;
  text(): string;
  element: HTMLElement;
  update(): void;
  write(text: string): void;
  showCode(from: number, to: number): void;
}
interface ItemDrag { tile: string; startX: number; startY: number; width: number; height: number; boxes: TemplateSnapBox[]; layout: TemplateTileLayout; before?: TemplateTileLayout; moved: boolean; lead: string; modifier: boolean }
interface MarqueeDrag { tile: string; pointer: number; frame: DOMRect; from: SelectionPoint; to: SelectionPoint; startX: number; startY: number; boxes: TemplateSnapBox[]; before: string[]; additive: boolean; moved: boolean }
interface ColorGroup { key: string; label: string; targets: { part: TemplateLayoutPart; choice: TemplateColorChoice }[] }

/** Canvas interaction and the small inspector below it. The CodeMirror
 * editor remains the sole owner of Jinja, its undo, helpers and options. */
export class TemplateItemEditor {
  private tile: string | undefined;
  private value = "";
  private selected = new Set<string>();
  private grid = false;
  private snap = true;
  private measure: CanvasRenderingContext2D | null | undefined;
  private note: string | undefined;
  private drag: ItemDrag | undefined;
  private marquee: MarqueeDrag | undefined;
  private working: TemplateTileLayout | undefined;
  private seenLayout: TemplateTileLayout | undefined;
  private baseline = new Map<string, string>();
  private symbolSearch = "";
  private sizeStart: Map<string, number> | undefined;
  private scale = 100;
  private pointerClick = false;
  private pointerCode: string | undefined;
  private guides: TemplateAlignmentGuide[] = [];

  constructor(private readonly host: ItemHost) {}
  private data(): TemplateEditorData { return this.host.data(); }

  private parts(): TemplateLayoutPart[] {
    const data = this.data();
    if (data.tileId !== this.tile) {
      this.dispose(); this.tile = data.tileId; this.value = ""; this.selected.clear(); this.baseline.clear(); this.working = undefined; this.seenLayout = undefined; this.note = undefined;
    }
    if (data.render?.ok === true) this.value = data.render.value;
    const automatic = templateLayoutParts(this.host.text(), this.value);
    const resolved = resolveTemplateLayout(this.layout(), this.value);
    if (resolved === undefined) return automatic;
    return resolved.parts.filter(part => part.row < data.rowLimit).map(part => ({ ...part, source: automatic.find(p => p.key === part.key)?.source }));
  }

  private layout(): TemplateTileLayout | undefined {
    const incoming = this.data().layout;
    if (incoming !== this.seenLayout && this.drag === undefined) { this.seenLayout = incoming; this.working = incoming; }
    return this.working ?? incoming;
  }

  private chosen(): TemplateLayoutPart[] { return this.parts().filter(p => this.selected.has(p.key)); }
  private writeLayout(layout: TemplateTileLayout | undefined, typing = false): void {
    this.working = layout;
    this.data().setLayout(layout, typing);
    this.host.update();
  }

  private pick(keys: Iterable<string>): void {
    this.selected = new Set(keys);
    this.sizeStart = undefined; this.scale = 100;
    const text = this.host.text();
    for (const part of this.chosen()) {
      const source = templateItemSource(text, part);
      const remember = (field: string, value: string) => { const key = `${part.key}:${field}`; if (!this.baseline.has(key)) this.baseline.set(key, value); };
      if (source.symbol !== undefined) remember("symbol", source.symbol.value);
      if (source.label !== undefined) remember("label", source.label.value);
      source.choices.forEach(choice => remember(choice.key, choice.value));
    }
    this.host.update();
  }

  private capture(): TemplateTileLayout | undefined {
    const existing = this.layout();
    if (existing !== undefined && resolveTemplateLayout(existing, this.value) !== undefined) return structuredClone(existing);
    const root = this.host.element.querySelector<HTMLElement>(".te-tile .wp-tpl");
    const scale = Number(root?.querySelector<HTMLElement>("[data-tpl-scale]")?.dataset["tplScale"]);
    const parts = this.parts();
    if (root === null || !Number.isFinite(scale) || scale <= 0 || parts.length === 0 || parts.length > 128) return undefined;
    const box = root.getBoundingClientRect(), left = box.left + 4 * scale, width = box.width - 8 * scale;
    if (width <= 0 || box.height <= 0) return undefined;
    const rows = templateRows(this.value);
    const items = parts.map(part => {
      const nodes = [...root.querySelectorAll<HTMLElement>("[data-tk]")].filter(p => p.dataset["tk"] === part.key);
      const rects = nodes.map(p => (part.kind === "icon" ? p.querySelector("svg") ?? p : p).getBoundingClientRect()).filter(r => r.width > 0 && r.height > 0);
      let x: number, y: number, size: number;
      if (rects.length > 0) {
        const x0 = Math.min(...rects.map(r => r.left)), x1 = Math.max(...rects.map(r => r.right));
        const y0 = Math.min(...rects.map(r => r.top)), y1 = Math.max(...rects.map(r => r.bottom));
        x = ((x0 + x1) / 2 - left) / width; y = ((y0 + y1) / 2 - box.top) / box.height;
        size = parseFloat(getComputedStyle(nodes[0]!).fontSize) / scale;
        // Inline symbols retain their original size while words shrink.
        if (part.kind === "icon" && root.querySelector(".wp-tpl-text") !== null) size = 15;
      } else {
        const columns = rows[part.row]?.length ?? 1;
        x = (part.cell + (part.kind === "icon" ? .12 : part.slice === "value" ? .35 : .65)) / columns;
        y = (part.row + .5) / Math.max(1, rows.length);
        size = Math.min(15, box.height / scale / (Math.max(1, rows.length) * 1.21));
      }
      size = Math.max(2, Math.min(80, Number.isFinite(size) ? size : 15));
      x = Math.max(0, Math.min(1, x)); y = Math.max(0, Math.min(1, y));
      const { key, row, cell, slice, prefix, suffix } = part;
      return { key, row, cell, slice, prefix, suffix, x, y, size, baseX: x, baseY: y, baseSize: size };
    });
    return { v: 1, shape: templateLayoutShape(rows), items };
  }

  /** Selection and guide bounds follow the ink, without changing the line
   * box or the stored center used by the device renderer. */
  private textBounds(el: HTMLElement): { left: number; top: number; width: number; height: number; right: number; bottom: number } {
    const rect = el.getBoundingClientRect();
    this.measure ??= document.createElement("canvas").getContext("2d");
    if (!this.measure || !el.textContent) return rect;
    const style = getComputedStyle(el), px = parseFloat(style.fontSize);
    this.measure.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const metrics = this.measure.measureText(el.textContent);
    const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    if (!(height > 0 && height <= rect.height && Number.isFinite(px))) return rect;
    // Inter's ascent and descent are 1984 and 494 on a 2048 em.
    const baseline = rect.top + rect.height / 2 + (1984 - 494) / (2 * 2048) * px;
    const top = baseline - metrics.actualBoundingBoxAscent;
    return { left: rect.left, top, width: rect.width, height, right: rect.right, bottom: top + height };
  }

  private snapBoxes(left: number, top: number, width: number, height: number): TemplateSnapBox[] {
    if (!(width > 0 && height > 0)) return [];
    const root = this.host.element.querySelector<HTMLElement>(".te-tile");
    const parts = this.parts();
    return parts.flatMap(part => {
      const nodes = [...root?.querySelectorAll<HTMLElement>("[data-tk]") ?? []].filter(el => el.dataset["tk"] === part.key);
      const rects = nodes.map(el => part.kind === "icon" ? (el.querySelector("svg") ?? el).getBoundingClientRect() : this.textBounds(el)).filter(r => r.width > 0 && r.height > 0);
      if (rects.length === 0) return [];
      const x0 = Math.min(...rects.map(r => r.left)), x1 = Math.max(...rects.map(r => r.right));
      const y0 = Math.min(...rects.map(r => r.top)), y1 = Math.max(...rects.map(r => r.bottom));
      return [{ key: part.key, x: (x0 - left) / width, y: (y0 - top) / height, width: (x1 - x0) / width, height: (y1 - y0) / height }];
    });
  }

  start(event: PointerEvent): void {
    if (event.button !== 0 || this.data().busy || this.drag || this.marquee) return;
    this.pointerClick = true; this.pointerCode = undefined;
    const target = (event.target as Element).closest<HTMLElement>("[data-tk]");
    if (!target) { this.startMarquee(event); return; }
    const key = target.dataset["tk"]!; this.pointerCode = key;
    const modifier = event.ctrlKey || event.metaKey;
    if (modifier) this.pick(this.selected.has(key) ? [...this.selected].filter(k => k !== key) : [...this.selected, key]);
    else if (!this.selected.has(key)) this.pick([key]);
    if (!this.selected.has(key)) {
      event.preventDefault(); this.pointerCode = undefined; this.highlightCode(key); return;
    }
    event.preventDefault();
    const layout = this.capture();
    const box = this.host.element.querySelector<HTMLElement>(".te-tile .wp-tpl")?.getBoundingClientRect();
    if (layout === undefined || box === undefined) { this.note = "Wait for the template preview before moving items."; this.host.update(); return; }
    const pointScale = Number(this.host.element.querySelector<HTMLElement>(".te-tile [data-tpl-scale]")?.dataset["tplScale"]);
    const width = box.width - 8 * pointScale;
    this.guides = [];
    this.drag = { tile: this.data().tileId, startX: event.clientX, startY: event.clientY, width, height: box.height, boxes: this.snapBoxes(box.left + 4 * pointScale, box.top, width, box.height), layout, before: this.layout() === undefined ? undefined : structuredClone(this.layout()), moved: false, lead: key, modifier };
    window.addEventListener("pointermove", this.move);
    window.addEventListener("pointerup", this.end);
    window.addEventListener("pointercancel", this.cancel);
    window.addEventListener("keydown", this.escape, true);
  }

  private startMarquee(event: PointerEvent): void {
    const root = this.host.element.querySelector<HTMLElement>(".te-tile"), frame = root?.querySelector<HTMLElement>(".wp-tpl")?.getBoundingClientRect();
    if (!root || !frame || !(frame.width > 0 && frame.height > 0)) return;
    event.preventDefault(); root.focus({ preventScroll: true });
    const from = { x: (event.clientX - frame.left) / frame.width, y: (event.clientY - frame.top) / frame.height };
    this.marquee = { tile: this.data().tileId, pointer: event.pointerId, frame, from, to: from, startX: event.clientX, startY: event.clientY, boxes: this.snapBoxes(frame.left, frame.top, frame.width, frame.height), before: [...this.selected], additive: event.ctrlKey || event.metaKey || event.shiftKey, moved: false };
    window.addEventListener("pointermove", this.move);
    window.addEventListener("pointerup", this.end);
    window.addEventListener("pointercancel", this.cancel);
    window.addEventListener("keydown", this.escape, true);
  }

  private highlightCode(key: string): void {
    const part = this.parts().find(p => p.key === key);
    const range = part && templateItemCodeRange(this.host.text(), this.value, part);
    if (range !== undefined && range.from < range.to) this.host.showCode(range.from, range.to);
  }

  press(event: MouseEvent): void {
    if (this.pointerClick && event.detail !== 0) {
      this.pointerClick = false;
      const key = this.pointerCode; this.pointerCode = undefined;
      if (key !== undefined) this.highlightCode(key);
      return;
    }
    this.pointerClick = false; this.pointerCode = undefined;
    const target = (event.target as Element).closest<HTMLElement>("[data-tk]");
    if (!target) return;
    const key = target.dataset["tk"]!;
    this.pick(event.ctrlKey || event.metaKey ? this.selected.has(key) ? [...this.selected].filter(k => k !== key) : [...this.selected, key] : [key]);
    this.highlightCode(key);
  }

  private readonly move = (event: PointerEvent): void => {
    const marquee = this.marquee;
    if (marquee) {
      if (event.pointerId !== marquee.pointer || marquee.tile !== this.data().tileId) return;
      if (!marquee.moved && Math.hypot(event.clientX - marquee.startX, event.clientY - marquee.startY) < 5) return;
      marquee.moved = true; this.pointerCode = undefined; event.preventDefault();
      marquee.to = { x: (event.clientX - marquee.frame.left) / marquee.frame.width, y: (event.clientY - marquee.frame.top) / marquee.frame.height };
      this.pick(templateMarqueeSelection(marquee.boxes, templateSelectionRect(marquee.from, marquee.to), marquee.before, marquee.additive));
      return;
    }
    const drag = this.drag;
    if (!drag || drag.tile !== this.data().tileId) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 5) return;
    drag.moved = true; this.pointerCode = undefined; event.preventDefault();
    const dx = (event.clientX - drag.startX) / drag.width, dy = (event.clientY - drag.startY) / drag.height;
    const lead = drag.layout.items.find(p => p.key === drag.lead)!;
    const layout = structuredClone(drag.layout), own = layout.items.filter(p => this.selected.has(p.key));
    const result = snapTemplateItems({ moving: drag.boxes.filter(p => this.selected.has(p.key)), others: drag.boxes, centers: own, lead, width: drag.width, height: drag.height, dx, dy, on: this.snap, free: event.altKey, grid: this.grid });
    this.guides = result.guides;
    own.forEach(p => { p.x += result.dx; p.y += result.dy; });
    this.writeLayout(layout, true);
  };
  private stopListeners(): void {
    window.removeEventListener("pointermove", this.move); window.removeEventListener("pointerup", this.end); window.removeEventListener("pointercancel", this.cancel); window.removeEventListener("keydown", this.escape, true);
  }
  private readonly end = (event?: PointerEvent): void => {
    const marquee = this.marquee;
    if (marquee) {
      if (event && event.pointerId !== marquee.pointer) return;
      this.stopListeners(); this.marquee = undefined;
      if (!marquee.moved && !marquee.additive) this.pick([]);
      this.host.update(); return;
    }
    const drag = this.drag; this.stopListeners(); this.drag = undefined; this.guides = [];
    const code = drag && !drag.moved ? this.pointerCode : undefined; this.pointerCode = undefined;
    if (drag && !drag.moved && !drag.modifier) this.pick([drag.lead]);
    this.data().ended(); this.host.update();
    // A Control-click can finish as a context menu on macOS, with no click
    // event. Pointer-up is the common end of every stationary item press.
    if (code !== undefined) this.highlightCode(code);
  };
  private readonly cancel = (event?: PointerEvent): void => {
    this.pointerCode = undefined;
    const marquee = this.marquee;
    if (marquee) {
      if (event && event.pointerId !== marquee.pointer) return;
      this.stopListeners(); this.marquee = undefined; this.pick(marquee.before); return;
    }
    const drag = this.drag; this.stopListeners(); this.drag = undefined; this.guides = [];
    if (drag?.moved) this.writeLayout(drag.before, true);
    this.data().ended(); this.host.update();
  };
  private readonly escape = (event: KeyboardEvent): void => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); this.cancel(); } };
  dispose(): void { this.pointerCode = undefined; this.stopListeners(); this.drag = undefined; this.marquee = undefined; this.guides = []; }

  key(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") { event.preventDefault(); this.pick(this.parts().map(p => p.key)); return; }
    const moves: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const move = moves[event.key];
    if (move === undefined || this.selected.size === 0) return;
    const layout = this.capture(); if (layout === undefined) return;
    event.preventDefault();
    const step = event.shiftKey ? .05 : .01;
    layout.items.filter(p => this.selected.has(p.key)).forEach(p => { p.x = Math.max(0, Math.min(1, p.x + move[0] * step)); p.y = Math.max(0, Math.min(1, p.y + move[1] * step)); });
    this.writeLayout(layout);
  }

  refresh(): void {
    const parts = this.parts();
    const root = this.host.element.querySelector<HTMLElement>(".te-tile");
    if (!root) return;
    root.classList.toggle("te-free-grid", this.grid);
    root.querySelector(".te-selection-box")?.remove();
    if (this.marquee?.moved) {
      const face = root.querySelector<HTMLElement>(".wp-tpl")?.getBoundingClientRect(), frame = root.getBoundingClientRect();
      if (face) {
        const rect = templateSelectionRect(this.marquee.from, this.marquee.to), selection = document.createElement("span");
        selection.className = "te-selection-box"; selection.setAttribute("aria-hidden", "true");
        selection.style.cssText = `left:${face.left - frame.left + rect.x * face.width}px;top:${face.top - frame.top + rect.y * face.height}px;width:${rect.width * face.width}px;height:${rect.height * face.height}px`;
        root.append(selection);
      }
    }
    root.querySelector(".te-pick-outlines")?.remove();
    const outlines = document.createElement("span"), frame = root.getBoundingClientRect();
    outlines.className = "te-pick-outlines"; outlines.setAttribute("aria-hidden", "true");
    root.querySelectorAll<HTMLElement>("[data-tk]").forEach(el => {
      const selected = this.selected.has(el.dataset["tk"]!);
      el.classList.toggle("te-picked", selected);
      el.tabIndex = 0; el.setAttribute("role", "button"); el.setAttribute("aria-pressed", String(selected));
      const p = parts.find(p => p.key === el.dataset["tk"]);
      el.setAttribute("aria-label", p?.kind === "icon" ? `Icon ${p.symbol}` : p?.text || "Template text");
      if (selected && p?.kind === "text") {
        const rect = this.textBounds(el), outline = document.createElement("span");
        outline.style.cssText = `left:${rect.left - frame.left}px;top:${rect.top - frame.top}px;width:${rect.width}px;height:${rect.height}px`;
        outlines.append(outline);
      }
    });
    if (outlines.childElementCount > 0) root.append(outlines);
    root.querySelector(".te-snap-guides")?.remove();
    if (this.guides.length > 0) {
      const tile = root.querySelector<HTMLElement>(".wp-tpl"), area = tile?.getBoundingClientRect(), frame = root.getBoundingClientRect();
      const scale = Number(tile?.querySelector<HTMLElement>("[data-tpl-scale]")?.dataset["tplScale"]);
      if (area && scale > 0) {
        const overlay = document.createElement("span");
        overlay.className = "te-snap-guides"; overlay.setAttribute("aria-hidden", "true");
        overlay.style.cssText = `left:${area.left - frame.left + 4 * scale}px;top:${area.top - frame.top}px;width:${area.width - 8 * scale}px;height:${area.height}px`;
        for (const guide of this.guides) {
          const line = document.createElement("span"); line.className = `te-snap-${guide.axis}`;
          line.style[guide.axis === "x" ? "left" : "top"] = `${guide.at * 100}%`;
          line.style[guide.axis === "x" ? "top" : "left"] = `${guide.from * 100}%`;
          line.style[guide.axis === "x" ? "height" : "width"] = `${(guide.to - guide.from) * 100}%`;
          overlay.append(line);
        }
        root.append(overlay);
      }
    }
    // Reconcile literal label edits once HA has rendered the new text. Never
    // guess when a branch changes the set of parts or their kinds.
    const layout = this.layout();
    if (layout !== undefined && this.data().render?.ok === true && this.drag === undefined) {
      const automatic = templateLayoutParts(this.host.text(), this.value);
      if (automatic.length === layout.items.length && automatic.every(p => layout.items.some(i => i.key === p.key))) {
        const items = layout.items.map(item => { const p = automatic.find(p => p.key === item.key)!; return { ...item, prefix: p.prefix, suffix: p.suffix }; });
        if (JSON.stringify(items) !== JSON.stringify(layout.items)) this.writeLayout({ ...layout, items }, true);
      }
    }
  }

  toolbar(): TemplateResult {
    this.parts();
    return html`<div class="te-item-tools"><label><input type="checkbox" .checked=${this.grid} @change=${(e: Event) => { this.grid = (e.target as HTMLInputElement).checked; this.host.update(); }}>Grid</label><label><input type="checkbox" .checked=${this.snap} title="Snap to nearby item or group edges and centers, then the grid" @change=${(e: Event) => { this.snap = (e.target as HTMLInputElement).checked; }}>Snap</label><button type="button" class="te-item-link" ?disabled=${this.data().busy || this.parts().length === 0} @click=${() => this.pick(this.parts().map(p => p.key))}>Select all</button><button type="button" class="te-item-link" ?disabled=${this.data().busy || this.layout() === undefined} @click=${() => { this.writeLayout(undefined); this.note = undefined; this.data().ended(); }}>Reset layout</button></div><div class="te-hint">Drag empty space to select items. Ctrl-click adds or removes items. Hold Option/Alt to move freely.</div>`;
  }

  private glyph(symbol: string, px = 18): TemplateResult { return html`<svg width=${px} height=${px} viewBox=${`0 0 ${px} ${px}`} aria-hidden="true">${this.data().icons.render(symbol, px, "currentColor") ?? nothing}</svg>`; }
  private dot(changed: boolean, name: string, action: () => void): TemplateResult | typeof nothing { return changed ? html`<button type="button" class="te-reset-dot" aria-label=${`Reset ${name}`} title=${`Reset ${name}`} @click=${() => { this.data().ended(); action(); }}></button>` : nothing; }
  private groups(): ColorGroup[] {
    const groups = new Map<string, ColorGroup>();
    for (const part of this.chosen()) for (const choice of templateItemSource(this.host.text(), part).choices) {
      const key = choice.label;
      if (!groups.has(key)) groups.set(key, { key, label: choice.label, targets: [] });
      groups.get(key)!.targets.push({ part, choice });
    }
    return [...groups.values()];
  }

  private editColors(group: ColorGroup, value?: string): void {
    const source = this.host.text();
    const changes = group.targets.flatMap(({ part, choice }) => {
      const next = value ?? this.baseline.get(`${part.key}:${choice.key}`);
      const color = next;
      const change = color === undefined ? undefined : templateItemColorChange(source, part, choice.key, color);
      return change === undefined ? [] : [change];
    });
    const next = applyTemplateSourceChanges(source, changes);
    if (next === undefined) this.note = "These items share source code. Change their colors in Jinja.";
    else if (next !== source) this.host.write(next);
    this.host.update();
  }

  private editSymbol(part: TemplateLayoutPart, value: string): void {
    const source = templateItemSource(this.host.text(), part).symbol;
    if (source !== undefined) this.host.write(this.host.text().slice(0, source.from) + value + this.host.text().slice(source.to));
  }

  private editLabel(part: TemplateLayoutPart, value: string): void {
    const source = templateItemSource(this.host.text(), part).label;
    if (source === undefined || /\[icon:|\[color:|\{[{%#]/.test(value)) return;
    this.host.write(this.host.text().slice(0, source.from) + value + this.host.text().slice(source.to));
  }

  private size(value: number): void {
    const layout = this.capture(); if (layout === undefined || !Number.isFinite(value)) return;
    const own = layout.items.filter(p => this.selected.has(p.key));
    if (own.length > 1) {
      this.sizeStart ??= new Map(own.map(p => [p.key, p.size])); this.scale = value;
      own.forEach(p => p.size = Math.max(2, Math.min(80, this.sizeStart!.get(p.key)! * value / 100)));
    } else own.forEach(p => p.size = Math.max(2, Math.min(80, value)));
    this.writeLayout(layout, true);
  }

  private align(direction: "vertical" | "horizontal", vertical: "center" | "left" = "center"): void {
    if (this.data().busy) return;
    const layout = this.capture();
    if (layout === undefined) return;
    const root = this.host.element.querySelector<HTMLElement>(".te-tile .wp-tpl"), box = root?.getBoundingClientRect();
    const scale = Number(root?.querySelector<HTMLElement>("[data-tpl-scale]")?.dataset["tplScale"]);
    const bounds = box && scale > 0 ? this.snapBoxes(box.left + 4 * scale, box.top, box.width - 8 * scale, box.height) : [];
    const next = alignTemplateItems(layout, this.selected, direction, bounds, vertical);
    if (next === layout) return;
    this.data().ended();
    this.writeLayout(next);
    this.data().ended();
  }

  /** Whether a saved layout draws the tile. One that no longer fits the
   * template's output leaves the automatic tile, where Line up columns and
   * Lines apply. Until the first answer, a saved layout counts. */
  layoutDraws(): boolean {
    this.parts();
    const layout = this.layout();
    return layout !== undefined && (this.value === "" || resolveTemplateLayout(layout, this.value) !== undefined);
  }

  inspector(): TemplateResult | typeof nothing {
    const chosen = this.chosen(), text = this.host.text();
    if (chosen.length === 0) return this.note === undefined ? nothing : html`<div class="te-hint">${this.note}</div>`;
    const icons = chosen.filter(p => p.kind === "icon"), labels = chosen.filter(p => templateItemSource(text, p).label !== undefined);
    const singleIcon = icons.length === 1 ? icons[0] : undefined, singleLabel = labels.length === 1 ? labels[0] : undefined;
    const iconSource = singleIcon === undefined ? undefined : templateItemSource(text, singleIcon).symbol;
    const labelSource = singleLabel === undefined ? undefined : templateItemSource(text, singleLabel).label;
    const stored = this.layout(), items = stored?.items.filter(p => this.selected.has(p.key)) ?? [];
    const changedPlacement = items.some(p => p.x !== p.baseX || p.y !== p.baseY);
    const changedSize = items.some(p => Math.abs(p.size - p.baseSize) > .001);
    const symbols = (this.data().icons.names() ?? []).filter(s => this.symbolSearch === "" ? ["lightbulb.fill", "lock.fill", "lock.open.fill", "person.fill", "thermometer", "door.left.hand.open", "house.fill", "checkmark"].includes(s) : s.includes(this.symbolSearch.toLowerCase())).slice(0, 40);
    const unsupported = chosen.some(p => p.source === undefined || templateItemSource(text, p).choices.length === 0);
    const sizeValue = chosen.length > 1 ? this.scale : items[0]?.size;
    return html`<section class="te-item-inspector" aria-label="Selected template items"><div class="te-item-head"><b>${chosen.length > 1 ? `${chosen.length} items selected` : chosen[0]!.kind === "icon" ? this.glyph(chosen[0]!.symbol!) : chosen[0]!.text}</b>${this.dot(changedPlacement, "placement", () => { const layout = this.capture(); if (layout) { layout.items.filter(p => this.selected.has(p.key)).forEach(p => { p.x = p.baseX; p.y = p.baseY; }); this.writeLayout(layout); } })}</div>
      ${chosen.length < 2 ? nothing : html`<div class="te-item-field"><span>Align selected</span><div class="te-item-align">
        <button type="button" aria-label="Align vertical center" title="Line up centers in one column; keep vertical spacing" ?disabled=${this.data().busy} @click=${() => this.align("vertical", "center")}>${svg`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M8 1v14" stroke-dasharray="2 2"/><rect x="3" y="3" width="10" height="3" rx="1"/><rect x="5" y="10" width="6" height="3" rx="1"/></svg>`}<span>Vertical<br>Center</span></button>
        <button type="button" aria-label="Align vertical left" title="Line up left edges in one column; keep vertical spacing" ?disabled=${this.data().busy} @click=${() => this.align("vertical", "left")}>${svg`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 1v14" stroke-dasharray="2 2"/><rect x="3" y="3" width="10" height="3" rx="1"/><rect x="3" y="10" width="6" height="3" rx="1"/></svg>`}<span>Vertical<br>Left</span></button>
        <button type="button" aria-label="Align horizontally" title="Line up centers in one row; keep horizontal spacing" ?disabled=${this.data().busy} @click=${() => this.align("horizontal")}>${svg`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M1 8h14" stroke-dasharray="2 2"/><rect x="3" y="3" width="3" height="10" rx="1"/><rect x="10" y="5" width="3" height="6" rx="1"/></svg>`}<span>Horizontal</span></button>
      </div></div>`}
      ${singleIcon === undefined || iconSource === undefined ? nothing : html`<div class="te-item-field"><span>Icon${this.dot(iconSource.value !== this.baseline.get(`${singleIcon.key}:symbol`), "icon", () => this.editSymbol(singleIcon, this.baseline.get(`${singleIcon.key}:symbol`) ?? iconSource.value))}</span><details class="te-symbol-picker"><summary aria-label="Choose icon">${this.glyph(iconSource.value, 22)}</summary><input type="search" aria-label="Search icons" placeholder="Search icons" .value=${this.symbolSearch} @input=${(e: Event) => { this.symbolSearch = (e.target as HTMLInputElement).value; this.host.update(); }}><div class="te-symbol-grid">${symbols.map(symbol => html`<button type="button" aria-label=${symbol} title=${symbol} @click=${() => { this.editSymbol(singleIcon, symbol); this.host.element.querySelector<HTMLDetailsElement>(".te-symbol-picker")?.removeAttribute("open"); }}>${this.glyph(symbol)}</button>`)}</div></details></div>`}
      ${singleLabel === undefined || labelSource === undefined ? nothing : html`<label class="te-item-field"><span>Label${this.dot(labelSource.value !== this.baseline.get(`${singleLabel.key}:label`), "label", () => this.editLabel(singleLabel, this.baseline.get(`${singleLabel.key}:label`) ?? labelSource.value))}</span><input type="text" aria-label="Item label" .value=${labelSource.value} @change=${(e: Event) => this.editLabel(singleLabel, (e.target as HTMLInputElement).value)}></label>`}
      ${this.groups().map(group => {
        const values = [...new Set(group.targets.map(t => t.choice.value))], first = values[0] ?? "";
        const hex = templateIconColor(first)?.hex ?? "#FFFFFF";
        const modified = group.targets.some(({ part, choice }) => this.baseline.get(`${part.key}:${choice.key}`) !== choice.value);
        return html`<label class="te-item-color"><input type="color" aria-label=${group.label === "Color" ? "Item color" : `${group.label} color`} .value=${hex} @input=${(e: Event) => this.editColors(group, (e.target as HTMLInputElement).value)} @blur=${() => this.data().ended()}><span>${group.label}<small>${values.length > 1 ? "Mixed" : first === "" ? "Inherited" : first}</small></span>${this.dot(modified, `${group.label.toLowerCase()} color`, () => this.editColors(group))}</label>`;
      })}
      <div class="te-item-field"><span>${chosen.length > 1 ? "Scale selected" : "Size"}${this.dot(changedSize, "size", () => { const layout = this.capture(); if (layout) { layout.items.filter(p => this.selected.has(p.key)).forEach(p => p.size = p.baseSize); this.sizeStart = undefined; this.scale = 100; this.writeLayout(layout); } })}</span><div class="te-item-size"><input type="number" aria-label="Selected item size" min=${chosen.length > 1 ? 25 : 2} max=${chosen.length > 1 ? 300 : 80} step="1" .value=${sizeValue === undefined ? "" : String(Math.round(sizeValue * 10) / 10)} placeholder="Auto" @input=${(e: Event) => this.size(Number((e.target as HTMLInputElement).value))} @blur=${() => this.data().ended()}><span>${chosen.length > 1 ? "%" : "pt"}</span></div><input type="range" aria-label="Selected item size slider" min=${chosen.length > 1 ? 25 : 2} max=${chosen.length > 1 ? 200 : 60} .value=${String(sizeValue ?? 15)} @input=${(e: Event) => this.size(Number((e.target as HTMLInputElement).value))} @change=${() => this.data().ended()}></div>
      ${unsupported ? html`<p class="te-hint">This item comes from template logic. Edit ambiguous icons, labels, or colors in Jinja; placement and size still work.</p>` : nothing}
      ${stored !== undefined && resolveTemplateLayout(stored, this.value) === undefined ? html`<p class="te-hint">The template output changed. Automatic layout keeps all content visible. Reset layout to arrange it again.</p>` : nothing}
      ${this.note === undefined ? nothing : html`<p class="te-hint">${this.note}</p>`}
    </section>`;
  }
}
