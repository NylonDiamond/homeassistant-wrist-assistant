// `<wa-library-parts>`: the home's parts, one of Home's Library screens. A
// list of the layer sets saved with Save to parts, newest change first, each
// with when it was saved and its size, and Delete, which asks first. Making a
// part and dropping one in stay in the complication editor; this is where the
// library is looked over and tidied.
//
// The panel loads this module on its own (`hook.ts`). It reads the parts
// itself (`complications/parts_list`) and tells the panel of a delete, so
// the list the complication editor keeps drops the part too.

import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { type HassLike, deletePart, fetchParts } from "../ha-api.js";
import type { SavedPart } from "../parts.js";
import { uiIcon } from "../ui-icons.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { PARTS_EMPTY_TEXT, PARTS_LEAD, partDeleteQuestion, partFactsText } from "./model.js";
import { libraryStyles } from "./styles.js";

type ListState = "loading" | "ready" | "failed" | "none";

export class WaLibraryParts extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) onDeleted?: (partId: string) => void;
  @state() private parts: SavedPart[] = [];
  @state() private listState: ListState = "loading";
  @state() private deleting?: string;
  @state() private note?: { kind: "ok" | "err"; text: string };
  private asked = false;
  private seq = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    this.asked = false;
  }

  protected override willUpdate(): void {
    if (this.hass && !this.asked) {
      this.asked = true;
      void this.load();
    }
  }

  private async load(): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.seq;
    try {
      const reply = await fetchParts(hass);
      if (seq !== this.seq) return;
      this.parts = Array.isArray(reply?.parts) ? reply.parts : [];
      this.listState = "ready";
    } catch (err) {
      if (seq !== this.seq) return;
      this.listState = watchCommandError(err).code === "unknown_command" ? "none" : "failed";
    }
  }

  private async deleteOne(part: SavedPart): Promise<void> {
    const hass = this.hass;
    if (!hass || this.deleting !== undefined) return;
    if (!window.confirm(partDeleteQuestion(part.name))) return;
    this.deleting = part.id;
    try {
      await deletePart(hass, part.id);
      this.parts = this.parts.filter((p) => p.id !== part.id);
      this.note = { kind: "ok", text: `Deleted "${part.name}".` };
      this.onDeleted?.(part.id);
    } catch (err) {
      this.note = { kind: "err", text: `Not deleted. ${watchCommandError(err).message}` };
    } finally {
      this.deleting = undefined;
    }
  }

  override render(): TemplateResult {
    return html`<div class="lb-wrap">
      <div class="lb-head">
        <h2>Parts ${this.listState === "ready" ? html`<span class="lb-count">${this.parts.length}</span>` : nothing}</h2>
        <p class="lb-lead">${PARTS_LEAD}</p>
      </div>
      ${this.note ? html`<div class="lb-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
        <button class="lb-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      ${this.renderBody()}
    </div>`;
  }

  private renderBody(): TemplateResult {
    if (this.listState === "none") return html`<div class="lb-empty">Update the integration to see the home's parts here.</div>`;
    if (this.listState === "failed") {
      return html`<div class="lb-empty"><span>Could not read the parts.</span>
        <button class="lb-btn" @click=${() => { this.listState = "loading"; void this.load(); }}>Try again</button></div>`;
    }
    if (this.listState === "loading") return html`<div class="lb-empty">Loading…</div>`;
    if (this.parts.length === 0) return html`<div class="lb-empty">${PARTS_EMPTY_TEXT}</div>`;
    return html`<div class="lq-list" role="list">${this.parts.map((part) => html`<div class="lq-row" role="listitem">
      <span class="lq-ic" aria-hidden="true">${uiIcon("layers")}</span>
      <span class="lq-text"><b>${part.name}</b><small>${partFactsText(part)}</small></span>
      <button class="lb-btn danger" ?disabled=${this.deleting !== undefined} aria-label=${`Delete ${part.name}`}
        @click=${() => void this.deleteOne(part)}>${uiIcon("delete")}<span>${this.deleting === part.id ? "Deleting…" : "Delete"}</span></button>
    </div>`)}</div>`;
  }

  static override styles = [libraryStyles, css`
    .lq-list { display: flex; flex-direction: column; border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-card); }
    .lq-row { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-top: 1px solid var(--wa-line); }
    .lq-row:first-child { border-top: 0; }
    .lq-ic {
      width: 32px; height: 32px; flex: none; display: grid; place-items: center; border-radius: 8px;
      color: var(--wa-hue-yellow); background: var(--wa-field); border: 1px solid var(--wa-line);
    }
    .lq-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .lq-text b { font-size: 13px; font-weight: 500; overflow-wrap: anywhere; }
    .lq-text small { font-size: 11.5px; color: var(--wa-muted); overflow-wrap: anywhere; }
  `];
}

if (!customElements.get("wa-library-parts")) {
  customElements.define("wa-library-parts", WaLibraryParts);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-library-parts": WaLibraryParts;
  }
}
