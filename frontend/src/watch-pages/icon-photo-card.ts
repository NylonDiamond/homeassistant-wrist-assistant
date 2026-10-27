// A tile's icon photo: the Photo row that leads the tile inspector's Icon
// part (`renderIconPhoto`). None, then the home's icon photos as small
// pictures (those made for the tile's entity first, marked "For this tile"),
// then "Add photo", which tidies the picked picture into a PNG and stores it
// as an icon photo named for the tile (`PagePhotoStore.uploadIcon`). A pick
// is one commit of the tile key `iconPhotoId` (`setWatchTileIconPhoto`);
// None removes it. With several tiles picked, a photo is on only when every
// one has it, and the title says Mixed when they differ.
//
// One Look draws the photo in the icon's place (`one-look/render.ts`,
// `cutoutLayer`); the old look keeps the icon, so the row is greyed there.
// Plan: app repo docs/photo_tiles_plan_2026-10.md, "Panel".
//
// The rows' rules are in `tileSettingsStyles` (tile-settings.ts), under
// `.ts-ph`: this module imports that one, so it must not hand it values that
// are read while the two load.

import { html, nothing, type TemplateResult } from "lit";
import type { PageImageEntry } from "../ha-api.js";
import { photoTilesFor, photoTilesUpdateNote } from "../version.js";
import { type TileSettingsHost, hostDeviceNoun } from "./editor-host.js";
import { isVirtualTileKind, tileEntityId, tileKind, watchPagesOf } from "./model.js";
import { mixedWord } from "./picture-choice.js";
import { pagePhotoIdsInUse, samePagePhotoId } from "./page-photo.js";
import type { PagePhotoStore } from "./page-photo-store.js";
import { everyPicked, pickedMixed } from "./multi-pick.js";
import { setWatchTileIconPhoto, watchTileIconPhotoId } from "./tile-settings-model.js";
import { watchTileFallbackName } from "./tile-settings-options.js";
import { commit, linkButton } from "./tile-settings.js";

const KEY = "ts-photo";

/** The words under a photo made for the tile's own entity. */
export const ICON_PHOTO_FROM_PHONE = "For this tile";

/** The line under the row while the old look draws the page's tiles. */
export const ICON_PHOTO_OLD_LOOK_NOTE = "Only the new tile look draws a photo. This page draws the icon.";

/** The delete being asked about, by tile. */
const deleteAskKey = (host: TileSettingsHost) => `${KEY}:delete:${host.tileId.toUpperCase()}`;

/** An entity id Home Assistant knows the shape of, not one of the virtual
 * kinds (a page link, a spacer). */
function photoEntityOf(host: TileSettingsHost): string | undefined {
  const id = tileEntityId(host.tile);
  return /^[a-z0-9_]+\.[a-z0-9_]+$/.test(id) && !isVirtualTileKind(tileKind(id)) ? id : undefined;
}

/** The tile's name as it shows: its own label, else its fallback. */
function tileName(host: TileSettingsHost): string {
  const own = typeof host.tile.customLabel === "string" ? host.tile.customLabel.trim() : "";
  return own !== "" ? own : watchTileFallbackName(host.tile, host.hass.states, watchPagesOf(host.document), host.catalog);
}

/**
 * The icon photos in the order the row shows them: those made for `entityId`
 * first, then the rest, each run in the list's order (newest first). A photo
 * the tile names that is not listed as an icon (a missing one, or a
 * background) leads, so the pick still shows.
 */
export function iconPhotoChoices(
  images: readonly PageImageEntry[],
  entityId: string | undefined,
  current: string | undefined,
): { id: string; entry?: PageImageEntry; forTile: boolean }[] {
  const icons = images.filter((i) => i.kind === "icon");
  const mine = (i: PageImageEntry) => entityId !== undefined && i.entity_id === entityId;
  const out: { id: string; entry?: PageImageEntry; forTile: boolean }[] = [
    ...icons.filter(mine).map((entry) => ({ id: entry.id, entry, forTile: true })),
    ...icons.filter((i) => !mine(i)).map((entry) => ({ id: entry.id, entry, forTile: false })),
  ];
  if (current !== undefined && !out.some((c) => samePagePhotoId(c.id, current))) {
    const entry = images.find((i) => samePagePhotoId(i.id, current));
    out.unshift({ id: current, ...(entry === undefined ? {} : { entry }), forTile: false });
  }
  return out;
}

function pick(host: TileSettingsHost, id: string | undefined): void {
  host.endCoalesce();
  commit(host, "iconPhoto", (d) => setWatchTileIconPhoto(d, host.pageId, host.tileId, id));
}

async function addPhoto(host: TileSettingsHost, photos: PagePhotoStore, input: HTMLInputElement): Promise<void> {
  const file = input.files?.[0];
  input.value = "";
  if (file === undefined) return;
  // With several tiles picked the photo is for none of them in particular.
  const one = host.picked === undefined;
  const entityId = one ? photoEntityOf(host) : undefined;
  const id = await photos.uploadIcon(file, {
    ...(one ? { label: tileName(host) } : {}),
    ...(entityId === undefined ? {} : { entityId }),
  });
  if (id !== undefined) pick(host, id);
}

/** One choice: its picture (the photo on a light ground, fitted whole), its
 * words under it, and a small delete for a photo nothing uses. */
function choice(
  o: { id: string | undefined; on: boolean; label: string; title: string; url?: string; missing?: boolean },
  host: TileSettingsHost,
  canDelete: boolean,
  deleting: boolean,
): TemplateResult {
  const pic = o.id === undefined
    ? html`<span class="ts-ph-pic ts-ph-none"></span>`
    : html`<span class="ts-ph-pic">${o.url === undefined
      ? (o.missing === true ? html`<span class="ts-ph-gone">Missing</span>` : nothing)
      : html`<img alt="" src=${o.url} />`}</span>`;
  return html`<span class="ts-ph-cell">
    <button type="button" role="radio" class="pc-opt ts-ph-opt ${o.on ? "on" : ""}" aria-checked=${o.on ? "true" : "false"}
      aria-label=${o.label} title=${o.title} data-photo=${o.id ?? "none"} @click=${() => { if (!o.on) pick(host, o.id); }}>
      ${pic}<span class="pc-label">${o.label}</span>
    </button>
    ${canDelete && o.id !== undefined ? html`<button type="button" class="ts-ph-del" title="Delete this photo from Home Assistant"
      aria-label=${`Delete ${o.label}`} ?disabled=${deleting} @click=${() => { host.uiState.set(deleteAskKey(host), o.id); host.requestUpdate(); }}>×</button>` : nothing}
  </span>`;
}

function addedWords(at: string | undefined): string {
  const date = at === undefined ? new Date(Number.NaN) : new Date(at);
  return Number.isNaN(date.getTime()) ? "" : `Added ${date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`;
}

/**
 * The Photo row: None, then the icon photos (those made for the tile's
 * entity first, "For this tile" under them), then "Add photo". The notes under
 * it: no photo store in this integration, a list that failed, a photo the
 * store does not have, the devices too old to draw one, the old look, and
 * the last upload's or delete's refusal.
 */
export function renderIconPhoto(host: TileSettingsHost): TemplateResult {
  const photos = host.photos;
  photos?.ensureList();
  const list = photos?.list;
  const many = host.picked !== undefined;
  const mixed = pickedMixed(host, (t) => watchTileIconPhotoId(t)?.toUpperCase());
  const current = mixed ? undefined : watchTileIconPhotoId(host.tile);
  const noneOn = everyPicked(host, () => watchTileIconPhotoId(host.tile) === undefined);
  const entityId = photoEntityOf(host);
  const choices = iconPhotoChoices(list?.images ?? [], entityId, current);
  const inUse = pagePhotoIdsInUse(host.document.pages);
  const asked = host.uiState.get(deleteAskKey(host)) as string | undefined;
  const askedChoice = asked === undefined ? undefined : choices.find((c) => samePagePhotoId(c.id, asked));
  const missing = current !== undefined && photos?.status(current) === "missing";
  const old = photoTilesUpdateNote((host.pickers ?? []).filter((p) => !photoTilesFor(p.version ?? null)).map((p) => p.name));
  const noStore = photos === undefined || photos.listState === "none";
  const row = html`<div class="field ts-ph-field"><span>Photo${mixed ? html` ${mixedWord()}` : nothing}</span>
    <div class="ts-ph-group" role="radiogroup" aria-label="Photo">
      ${choice({ id: undefined, on: noneOn, label: "None", title: "No photo: the tile draws its icon" }, host, false, false)}
      ${photos === undefined ? nothing : choices.map((c) => {
        const on = !mixed && samePagePhotoId(current, c.id);
        const label = c.forTile ? ICON_PHOTO_FROM_PHONE : (c.entry?.label?.trim() || "Photo");
        const title = [c.entry?.label?.trim(), addedWords(c.entry?.added_at)].filter((w) => w !== undefined && w !== "").join(", ") || label;
        const canDelete = c.entry !== undefined && c.entry.used_by.length === 0 && !inUse.has(c.id.toUpperCase());
        const url = photos.url(c.id);
        return choice({ id: c.id, on, label, title, ...(url === undefined ? {} : { url }), missing: photos.status(c.id) === "missing" }, host, canDelete, photos.deleting);
      })}
    </div>
  </div>`;
  const add = photos === undefined || noStore ? nothing : html`<div class="ts-after">
    <label class="pe-chip ts-ph-add ${photos.uploading || host.busy ? "off" : ""}" title="A photo of the thing itself, best on a plain background. It is tidied and made tile size first.">
      <input type="file" accept="image/*" ?disabled=${photos.uploading || host.busy}
        @change=${(e: Event) => void addPhoto(host, photos, e.target as HTMLInputElement)} />${photos.uploading ? "Adding..." : "Add photo"}
    </label>
  </div>`;
  return html`<div class="ts-ph">
    ${row}
    ${noStore ? html`<div class="hint warn ts-under">Photo icons need a newer version of the integration.</div>` : nothing}
    ${photos?.listState === "failed" ? html`<div class="hint warn ts-under">Home Assistant did not list its photos. ${linkButton("Try again", "Read the photo list again", () => void photos.refreshList())}</div>` : nothing}
    ${askedChoice !== undefined && photos !== undefined ? html`<div class="ts-ph-ask" role="alert">
      <span>Delete this photo from Home Assistant? This cannot be undone.</span>
      <button type="button" class="small danger" ?disabled=${photos.deleting} @click=${async () => {
        if (await photos.remove(askedChoice.id)) host.uiState.delete(deleteAskKey(host));
        host.requestUpdate();
      }}>Delete</button>
      <button type="button" class="small" @click=${() => { host.uiState.delete(deleteAskKey(host)); host.requestUpdate(); }}>Keep</button>
    </div>` : nothing}
    ${add}
    ${photos?.error !== undefined ? html`<div class="hint warn ts-under" role="status">${photos.error}</div>` : nothing}
    ${missing ? html`<div class="hint warn ts-under">Photo missing. Home Assistant does not have it, so the ${hostDeviceNoun(host)} draws the icon. Pick another or None.</div>` : nothing}
    ${old === undefined || (current === undefined && !many) ? nothing : html`<div class="hint warn ts-under" role="status">${old}</div>`}
    ${host.oneLook === true ? nothing : html`<div class="hint keep ts-under">${ICON_PHOTO_OLD_LOOK_NOTE}</div>`}
  </div>`;
}
