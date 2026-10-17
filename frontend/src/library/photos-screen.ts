// `<wa-library-photos>`: the home's own page photos, one of Home's Library
// screens. A grid of the photos the pages' Background can show, each with its
// size, when it came and which devices' pages show it, and Delete, which asks
// first and is off while a page shows the photo (Home Assistant refuses it
// then). The built-in photos are not listed: they ship with the integration
// and cannot go. Adding a photo stays in the page editor, where it is picked.
//
// The list, the bytes and the delete go through the page editor's own photo
// store (`watch-pages/page-photo-store.ts`), so a photo read there is not read
// again here. The panel loads this module on its own (`hook.ts`).

import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import type { HassLike, OwnerSummary, PageImageEntry } from "../ha-api.js";
import { uiIcon } from "../ui-icons.js";
import { PagePhotoStore } from "../watch-pages/page-photo-store.js";
import {
  PHOTOS_EMPTY_TEXT,
  PHOTOS_LEAD,
  PHOTOS_UPDATE_TEXT,
  PHOTO_DELETE_QUESTION,
  photoDeleteBlocked,
  photoFactsText,
  photoUseText,
} from "./model.js";
import { libraryStyles } from "./styles.js";

export class WaLibraryPhotos extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ type: Boolean, reflect: true }) narrow = false;
  @state() private note?: { kind: "ok" | "err"; text: string };
  private readonly store = new PagePhotoStore(() => this.hass, () => this.requestUpdate());

  override connectedCallback(): void {
    super.connectedCallback();
    // Read again on every visit: a page may have taken a photo up since.
    if (this.hass) void this.store.refreshList();
  }

  protected override willUpdate(): void {
    if (this.hass) this.store.ensureList();
  }

  private async deleteOne(entry: PageImageEntry): Promise<void> {
    if (this.store.deleting || photoDeleteBlocked(entry) !== undefined) return;
    if (!window.confirm(PHOTO_DELETE_QUESTION)) return;
    const ok = await this.store.remove(entry.id);
    this.note = ok ? { kind: "ok", text: "Photo deleted." } : { kind: "err", text: `Not deleted. ${this.store.error ?? ""}`.trim() };
  }

  override render(): TemplateResult {
    const store = this.store;
    const images = store.list?.images ?? [];
    return html`<div class="lb-wrap">
      <div class="lb-head">
        <h2>Photos ${store.listState === "ready" ? html`<span class="lb-count">${images.length}</span>` : nothing}</h2>
        <p class="lb-lead">${PHOTOS_LEAD}</p>
      </div>
      ${this.note ? html`<div class="lb-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
        <button class="lb-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      ${this.renderBody(images)}
    </div>`;
  }

  private renderBody(images: readonly PageImageEntry[]): TemplateResult {
    const state = this.store.listState;
    if (state === "none") return html`<div class="lb-empty">${PHOTOS_UPDATE_TEXT}</div>`;
    if (state === "failed" && this.store.list === undefined) {
      return html`<div class="lb-empty"><span>Could not read the photos.</span>
        <button class="lb-btn" @click=${() => void this.store.refreshList()}>Try again</button></div>`;
    }
    if (this.store.list === undefined) return html`<div class="lb-empty">Loading…</div>`;
    if (images.length === 0) return html`<div class="lb-empty">${PHOTOS_EMPTY_TEXT}</div>`;
    return html`<div class="lp-grid" role="list">${images.map((entry) => this.renderPhoto(entry))}</div>`;
  }

  private renderPhoto(entry: PageImageEntry): TemplateResult {
    const url = this.store.url(entry.id);
    const blocked = photoDeleteBlocked(entry);
    const use = photoUseText(entry, this.owners);
    return html`<div class="lp-card" role="listitem">
      <div class="lp-pic" style=${url === undefined ? nothing : `background-image:url("${url}")`} aria-hidden="true"></div>
      <div class="lp-text">
        <span class="lp-use ${blocked === undefined ? "" : "on"}">${use}</span>
        <span class="lp-facts">${photoFactsText(entry)}</span>
      </div>
      <button class="lb-btn danger" ?disabled=${blocked !== undefined || this.store.deleting}
        title=${blocked ?? "Delete this photo"} aria-label=${`Delete the photo: ${use}`}
        @click=${() => void this.deleteOne(entry)}>${uiIcon("delete")}<span>Delete</span></button>
    </div>`;
  }

  static override styles = [libraryStyles, css`
    .lp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
    .lp-card {
      display: flex; flex-direction: column; gap: 8px; padding: 8px; min-width: 0;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-card);
    }
    .lp-pic { aspect-ratio: 4 / 3; border-radius: 8px; background: var(--wa-field) center / cover no-repeat; border: 1px solid var(--wa-line); }
    .lp-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .lp-use { font-size: 13px; font-weight: 500; overflow-wrap: anywhere; }
    .lp-use:not(.on) { color: var(--wa-muted); }
    .lp-facts { font-size: 11.5px; color: var(--wa-muted); overflow-wrap: anywhere; }
    .lp-card > .lb-btn { align-self: flex-start; }
  `];
}

if (!customElements.get("wa-library-photos")) {
  customElements.define("wa-library-photos", WaLibraryPhotos);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-library-photos": WaLibraryPhotos;
  }
}
