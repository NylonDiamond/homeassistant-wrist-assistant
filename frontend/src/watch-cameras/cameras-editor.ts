// `<wa-cameras-editor>`: how each camera's picture is cut in alerts, on
// iPhone and Apple Watch, as Home Assistant keeps it
// (`wrist_assistant/cameras/*`). The crop belongs to the camera, shared by
// every device and person, so the screen is handed no watch and follows none.
//
// The iPhone app's Camera Framing screen, moved here: a card per camera with
// its picture cut to the saved crop, and an editor for one camera with the
// full still under a crop box, the stream a tap on the alert opens, whether
// the watch opens its live view zoomed to the crop, and a test alert. Left
// behind on the phone: its snapshot delivery probe (it tested the phone's own
// network) and its HD and SD preview switch (the panel draws Home
// Assistant's own full frame).
//
// The open camera and its edit live in `draft.ts`, so the panel's leave
// guards see them and a return finds them as they were. The crop rules are
// `model.ts`. Pictures are Home Assistant's own `entity_picture` for each
// camera, fetched once a visit through `PictureCache`; every crop on screen is
// drawn over that full frame in CSS, never cut by the server.
//
// The panel loads this module on its own, with one `import()`, when its route
// is `/cameras` (`hook.ts`). Nothing it imports may import `icons.ts`.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { chromeTokens, inspectorStyles, litOutline, topBarStyles } from "../editor-chrome.js";
import { formStyles } from "../form-styles.js";
import { type CameraFraming, type CameraViewport, type HassLike, fetchCameras, saveCameraFraming, sendCameraTest } from "../ha-api.js";
import { SECTION_COLOR } from "../kinds.js";
import { PictureCache } from "../picture-cache.js";
import { uiIcon } from "../ui-icons.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import {
  type CameraDraft,
  cameraDraftDirty,
  discardCameraEdit,
  dropCameraDraft,
  editCameraDraft,
  openCameraDraft,
  rebaseCameraDraft,
  startCameraDraft,
} from "./draft.js";
import { WATCH_CAMERAS_HELP_URL, registerWatchCamerasDrafts } from "./hook.js";
import {
  CROP_CORNERS,
  type CameraEdit,
  type CropCorner,
  FULL_FRAME,
  autoStreamLabel,
  cameraEditOf,
  cameraSavePayload,
  cameraTestWords,
  cameraWithEdit,
  cropAspect,
  cropImagePlacement,
  effectiveOpenZoomed,
  fitAspect,
  isFullFrame,
  moveViewport,
  resizeViewport,
  shortCameraId,
} from "./model.js";

registerWatchCamerasDrafts({ dirty: cameraDraftDirty, drop: dropCameraDraft });

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
    if (!cameraDraftDirty()) return;
    e.preventDefault();
    e.returnValue = "";
  });
}

export const CAMERAS_LEAD = "How each camera's picture is cut in alerts, on iPhone and Apple Watch. Tiles on the watch have their own crop.";
export const CAMERAS_EMPTY_TEXT = "No cameras in this Home Assistant.";
export const CAMERAS_UPDATE_TEXT = "Update the integration to frame cameras here.";
/** What the test alert says, as the phone's test did. */
const TEST_MESSAGE = "Motion detected";

/** The proportions of a card's picture well, and the narrowest the alert
 * previews' picture slots get before a tall crop is letterboxed. */
const TILE_ASPECT = 16 / 9;
const WATCH_SLOT_MIN_ASPECT = 176 / 140;
const PHONE_SLOT_MIN_ASPECT = 272 / 300;

/** One arrow key press moves the crop this far; with Shift, five times. */
const NUDGE = 0.01;

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl+";

type Note = { kind: "ok" | "warn" | "err"; text: string };

interface HassConnectionEvents {
  addEventListener?(type: "ready", listener: () => void): void;
  removeEventListener?(type: "ready", listener: () => void): void;
}

function nothingFocused(): boolean {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active === null || active === document.body || active === document.documentElement;
}

function pct(n: number): string {
  return `${Math.round(n * 1000) / 1000}%`;
}

export class WaCamerasEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ type: Boolean, reflect: true }) narrow = false;

  @state() private cameras?: CameraFraming[];
  @state() private unsupported = false;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private note?: Note;
  @state() private saving = false;
  @state() private testing = false;
  @state() private testLine?: { ok: boolean; text: string };

  /** Each camera's full frame, by entity, held for this visit. */
  private readonly pictures = new PictureCache({
    fetch: (url) => fetch(url),
    objectUrl: (blob) => URL.createObjectURL(blob),
    revoke: (url) => URL.revokeObjectURL(url),
    changed: () => this.requestUpdate(),
    now: () => Date.now(),
  }, 200);
  /** Each picture's width over its height, once it has drawn. */
  private readonly aspects = new Map<string, number>();
  private loadSeq = 0;
  private askedOnce = false;
  private readyConnection?: HassConnectionEvents;
  private endDrag?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeyDown);
    this.listenForReconnect();
    if (this.askedOnce) void this.load(true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeyDown);
    this.stopListeningForReconnect();
    this.endDrag?.();
    this.pictures.clear();
    this.loadSeq++;
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (!this.hass) return;
    if (changed.has("hass")) this.listenForReconnect();
    if (!this.askedOnce) {
      this.askedOnce = true;
      void this.load();
    }
  }

  private listenForReconnect(): void {
    const connection = this.hass?.connection as unknown as HassConnectionEvents | undefined;
    if (connection === this.readyConnection) return;
    this.stopListeningForReconnect();
    if (!this.isConnected || typeof connection?.addEventListener !== "function") return;
    connection.addEventListener("ready", this.onReconnect);
    this.readyConnection = connection;
  }

  private stopListeningForReconnect(): void {
    this.readyConnection?.removeEventListener?.("ready", this.onReconnect);
    this.readyConnection = undefined;
  }

  private onReconnect = (): void => {
    if (this.isConnected) void this.load(true);
  };

  // ── loading ────────────────────────────────────────────────────────────

  private async load(quiet = false): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.loadSeq;
    if (!quiet) {
      this.loading = this.cameras === undefined;
      this.loadError = undefined;
    }
    try {
      const reply = await fetchCameras(hass);
      if (seq !== this.loadSeq) return;
      this.unsupported = false;
      this.loadError = undefined;
      this.show(Array.isArray(reply?.cameras) ? reply.cameras : []);
    } catch (err) {
      if (seq !== this.loadSeq) return;
      const { code, message } = watchCommandError(err);
      if (code === "unknown_command") {
        this.unsupported = true;
        this.loadError = undefined;
      } else if (!quiet || this.cameras === undefined) {
        this.loadError = message;
      }
    }
    this.loading = false;
  }

  /** A fresh list. The open camera follows it: one with nothing changed
   * takes what Home Assistant now holds, one with edits keeps them, and one
   * that is gone closes. */
  private show(cameras: CameraFraming[]): void {
    this.cameras = cameras;
    const draft = openCameraDraft();
    if (draft === undefined) return;
    const camera = cameras.find((c) => c.entity_id === draft.entityId);
    if (camera === undefined) {
      const lost = cameraDraftDirty();
      dropCameraDraft();
      if (lost) this.note = { kind: "warn", text: "That camera is no longer in Home Assistant, so its unsaved framing was dropped." };
      return;
    }
    rebaseCameraDraft(cameraEditOf(camera), cameraDraftDirty());
  }

  private cameraOf(entityId: string): CameraFraming | undefined {
    return this.cameras?.find((c) => c.entity_id === entityId);
  }

  private pictureAddress(entityId: string): string | undefined {
    const live = this.hass?.states[entityId]?.attributes?.entity_picture;
    return typeof live === "string" && live !== "" ? live : undefined;
  }

  /** "Refresh pictures": a new frame from every camera. What is on screen
   * stays until each one lands. */
  private refreshPictures(): void {
    for (const camera of this.cameras ?? []) {
      const live = this.pictureAddress(camera.entity_id);
      if (live !== undefined) this.pictures.refresh(camera.entity_id, live);
    }
    this.requestUpdate();
  }

  // ── opening and closing a camera ───────────────────────────────────────

  private openCamera(camera: CameraFraming): void {
    const draft = openCameraDraft();
    if (draft?.entityId === camera.entity_id) {
      this.requestUpdate();
      return;
    }
    if (cameraDraftDirty() && !window.confirm("You have unsaved changes. Discard them?")) return;
    startCameraDraft(camera.entity_id, cameraEditOf(camera));
    this.note = undefined;
    this.testLine = undefined;
    this.requestUpdate();
    this.scrollTop = 0;
  }

  private closeCamera(): void {
    if (this.saving || this.testing) return;
    if (cameraDraftDirty() && !window.confirm("You have unsaved changes. Discard them?")) return;
    dropCameraDraft();
    this.note = undefined;
    this.testLine = undefined;
    this.requestUpdate();
  }

  private setEdit(edit: CameraEdit): void {
    if (this.saving) return;
    editCameraDraft(edit);
    this.requestUpdate();
  }

  private discard(): void {
    if (this.saving || !cameraDraftDirty()) return;
    discardCameraEdit();
    this.note = undefined;
    this.requestUpdate();
  }

  // ── saving and testing ─────────────────────────────────────────────────

  /** Save the open camera. True when Home Assistant now holds what is on
   * screen, which is also the case when there was nothing to save. */
  private async save(): Promise<boolean> {
    const hass = this.hass;
    const draft = openCameraDraft();
    const camera = draft === undefined ? undefined : this.cameraOf(draft.entityId);
    if (!hass || draft === undefined || camera === undefined || this.saving) return false;
    if (!cameraDraftDirty()) return true;
    const edit = draft.edit;
    this.saving = true;
    this.note = undefined;
    // A read already on the way could land the old framing over this save.
    this.loadSeq++;
    let ok = false;
    try {
      await saveCameraFraming(hass, cameraSavePayload(camera, edit, draft.base));
      ok = true;
      this.cameras = (this.cameras ?? []).map((c) => (c.entity_id === camera.entity_id ? cameraWithEdit(c, edit) : c));
      if (openCameraDraft()?.entityId === camera.entity_id) rebaseCameraDraft(edit, false);
    } catch (err) {
      this.note = { kind: "err", text: `Not saved. ${watchCommandError(err).message}` };
    }
    this.saving = false;
    void this.load(true);
    return ok;
  }

  private async sendTest(): Promise<void> {
    const hass = this.hass;
    const draft = openCameraDraft();
    const camera = draft === undefined ? undefined : this.cameraOf(draft.entityId);
    if (!hass || camera === undefined || this.testing || this.saving) return;
    this.testLine = undefined;
    // The test shows the framing Home Assistant holds, so unsaved edits go
    // in first, as the phone's Send Test did.
    if (cameraDraftDirty() && !(await this.save())) return;
    this.testing = true;
    try {
      this.testLine = cameraTestWords(await sendCameraTest(hass, camera.entity_id, camera.name, TEST_MESSAGE));
    } catch (err) {
      this.testLine = { ok: false, text: `Not sent. ${watchCommandError(err).message}` };
    }
    this.testing = false;
  }

  // ── the crop box ───────────────────────────────────────────────────────

  /** A press on the box moves it; a press on a corner resizes from there.
   * The pointer is captured, so the drag carries on outside the picture, and
   * the travel is measured as a fraction of the picture as drawn. */
  private beginDrag(e: PointerEvent, corner?: CropCorner): void {
    if (e.button !== 0 || this.saving) return;
    const draft = openCameraDraft();
    const overlay = this.renderRoot.querySelector<HTMLElement>(".cm-overlay");
    const rect = overlay?.getBoundingClientRect();
    if (draft === undefined || rect === undefined || rect.width <= 0 || rect.height <= 0) return;
    e.preventDefault();
    e.stopPropagation();
    this.endDrag?.();
    const target = e.currentTarget as HTMLElement;
    const base = draft.edit.viewport;
    const startX = e.clientX;
    const startY = e.clientY;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      /* a synthetic press has no pointer to capture */
    }
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      const now = openCameraDraft();
      if (now === undefined || now.entityId !== draft.entityId) return;
      const dx = (ev.clientX - startX) / rect.width;
      const dy = (ev.clientY - startY) / rect.height;
      const viewport = corner === undefined ? moveViewport(base, dx, dy) : resizeViewport(base, corner, dx, dy);
      this.setEdit({ ...now.edit, viewport });
    };
    const finish = (ev: PointerEvent) => {
      if (ev.pointerId === e.pointerId) cleanup();
    };
    const cleanup = () => {
      target.removeEventListener("pointermove", move);
      target.removeEventListener("pointerup", finish);
      target.removeEventListener("pointercancel", finish);
      try {
        target.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      if (this.endDrag === cleanup) this.endDrag = undefined;
    };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", finish);
    target.addEventListener("pointercancel", finish);
    this.endDrag = cleanup;
  }

  private onBoxKey(e: KeyboardEvent): void {
    const draft = openCameraDraft();
    if (draft === undefined) return;
    const step = e.shiftKey ? NUDGE * 5 : NUDGE;
    const by: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const d = by[e.key];
    if (d === undefined) return;
    e.preventDefault();
    this.setEdit({ ...draft.edit, viewport: moveViewport(draft.edit.viewport, d[0], d[1]) });
  }

  // ── keys ───────────────────────────────────────────────────────────────

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.defaultPrevented) return;
    if (!e.composedPath().includes(this) && !nothingFocused()) return;
    if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      void this.save();
    }
  };

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const draft = openCameraDraft();
    const camera = draft === undefined ? undefined : this.cameraOf(draft.entityId);
    return html`
      <div class="cm-top">
        ${this.renderBar(draft, camera)}
        <p class="cm-lead">${CAMERAS_LEAD}</p>
        ${this.note ? html`<div class="cm-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="cm-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      </div>
      ${draft !== undefined && camera !== undefined ? this.renderEditor(camera, draft) : this.renderBody()}
    `;
  }

  private renderBar(draft: CameraDraft | undefined, camera: CameraFraming | undefined): TemplateResult {
    const editing = draft !== undefined && camera !== undefined;
    const dirty = editing && cameraDraftDirty();
    return html`<div class="wa-bar ${this.narrow ? "stacked" : ""}" role="toolbar" aria-label="Cameras">
      <span class="cm-title"><b>Cameras</b>${editing ? html`<span class="cm-crumb">
        <button class="cm-back" ?disabled=${this.saving || this.testing} title="Back to every camera" @click=${() => this.closeCamera()}>${uiIcon("left")}<span>All cameras</span></button>
        <span class="cm-cur">${camera.name}</span></span>` : nothing}</span>
      <span class="spacer"></span>
      ${editing ? html`
        <button class="cm-btn" ?disabled=${!dirty || this.saving} title="Go back to the framing Home Assistant holds"
          @click=${() => this.discard()}>Discard</button>
        <button class="primary save ${dirty ? "dirty" : ""}" ?disabled=${!dirty || this.saving}
          title=${dirty ? `Save (${MOD}S)` : `Nothing to save (${MOD}S)`}
          @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>
        <span class="tb-saved">${dirty ? "Unsaved changes" : ""}</span>`
        : this.cameras !== undefined && this.cameras.length > 0 ? html`<button class="cm-btn" title="Take a new frame from every camera"
          @click=${() => this.refreshPictures()}>${uiIcon("reset")}<span>Refresh pictures</span></button>` : nothing}
      <button class="help" title="Help: Cameras" aria-label="Help"
        @click=${() => window.open(WATCH_CAMERAS_HELP_URL, "_blank", "noopener")}>?</button>
    </div>`;
  }

  private renderBody(): TemplateResult {
    if (this.unsupported) return html`<div class="cm-calm"><div class="cm-empty"><b>${CAMERAS_UPDATE_TEXT}</b></div></div>`;
    if (this.loadError !== undefined) {
      return html`<div class="cm-calm"><div class="cm-empty">
        <span>Could not read the cameras: ${this.loadError}</span>
        <button class="cm-btn" @click=${() => void this.load()}>Try again</button>
      </div></div>`;
    }
    const cameras = this.cameras;
    if (this.loading || cameras === undefined) return html`<div class="cm-calm"><div class="cm-empty">Loading…</div></div>`;
    if (cameras.length === 0) return html`<div class="cm-calm"><div class="cm-empty"><b>${CAMERAS_EMPTY_TEXT}</b></div></div>`;
    return html`<div class="cm-grid">${cameras.map((camera) => this.renderCard(camera))}</div>`;
  }

  private renderCard(camera: CameraFraming): TemplateResult {
    const framed = !isFullFrame(camera.viewport);
    const viewport = camera.viewport ?? FULL_FRAME;
    const override = camera.stream?.override ?? null;
    return html`<button type="button" class="cm-card" data-camera=${camera.entity_id} @click=${() => this.openCamera(camera)}>
      ${this.renderPicture(camera.entity_id, viewport, TILE_ASPECT)}
      <span class="cm-card-text">
        <span class="cm-card-name">${framed ? html`<i class="cm-dot" title="Framed" aria-hidden="true"></i>` : nothing}<b>${camera.name}</b></span>
        <span class="cm-card-sub">${framed ? (camera.open_zoomed ? "Framed, watch opens zoomed" : "Framed") : "Full frame"}</span>
        ${override === null ? nothing : html`<span class="cm-card-sub">Tap opens ${shortCameraId(override)}</span>`}
      </span>
    </button>`;
  }

  /** The camera's full frame cut to `viewport`, letterboxed into a well of
   * `wellAspect`: the frame is drawn whole and the well shows only the crop. */
  private renderPicture(entityId: string, viewport: CameraViewport, wellAspect: number, cls = ""): TemplateResult {
    const live = this.pictureAddress(entityId);
    const url = live === undefined ? undefined : this.pictures.urlFor(entityId, live);
    const style = `aspect-ratio: ${wellAspect}`;
    if (url === undefined) {
      const failed = live === undefined || this.pictures.failing(entityId);
      return html`<span class="cm-pic ${cls} ${failed ? "none" : "wait"}" style=${style}>${failed ? html`<span>No picture</span>` : nothing}</span>`;
    }
    const fit = fitAspect(cropAspect(viewport, this.aspects.get(entityId) ?? TILE_ASPECT), wellAspect);
    const place = cropImagePlacement(viewport);
    return html`<span class="cm-pic ${cls}" style=${style}>
      <span class="cm-crop" style=${`width:${pct(fit.width)};height:${pct(fit.height)}`}>
        <img alt="" draggable="false" src=${url} @load=${(e: Event) => this.noteAspect(entityId, e.target as HTMLImageElement)}
          style=${`width:${pct(place.width)};height:${pct(place.height)};left:${pct(place.left)};top:${pct(place.top)}`}>
      </span>
    </span>`;
  }

  private noteAspect(entityId: string, img: HTMLImageElement): void {
    if (!(img.naturalWidth > 0) || !(img.naturalHeight > 0)) return;
    const aspect = img.naturalWidth / img.naturalHeight;
    if (Math.abs((this.aspects.get(entityId) ?? 0) - aspect) < 0.001) return;
    this.aspects.set(entityId, aspect);
    this.requestUpdate();
  }

  // ── the editor ─────────────────────────────────────────────────────────

  private renderEditor(camera: CameraFraming, draft: CameraDraft): TemplateResult {
    const edit = draft.edit;
    const full = isFullFrame(edit.viewport);
    return html`<div class="cm-edit">
      <section class="sec cm-stage-sec" style=${`--c:${SECTION_COLOR.position}`}>
        ${this.secHead(uiIcon("image"), "Framing", full ? "Full frame" : "Cropped")}
        <div class="sec-b">
          ${this.renderStage(camera, edit)}
          <p class="hint keep">Drag a corner to resize the box, or drag inside it to move it. Arrow keys move it too.</p>
          <div class="cm-row">
            <button class="cm-btn" ?disabled=${full || this.saving} @click=${() => this.setEdit({ ...edit, viewport: { ...FULL_FRAME } })}>
              ${uiIcon("reset")}<span>Reset to full frame</span></button>
          </div>
        </div>
      </section>
      <div class="cm-side">
        <section class="sec" style=${`--c:${SECTION_COLOR.tap}`}>
          ${this.secHead(uiIcon("tap"), "Live stream on tap")}
          <div class="sec-b">
            ${this.renderStreamSelect(camera, edit)}
            <p class="hint keep">The stream the watch opens when the alert's picture is tapped.</p>
            <label class="cm-check">
              <input type="checkbox" .checked=${effectiveOpenZoomed(edit)} ?disabled=${full || this.saving}
                @change=${(e: Event) => this.setEdit({ ...edit, openZoomed: (e.target as HTMLInputElement).checked })}>
              <span>Open the watch's live view zoomed to this crop</span>
            </label>
            ${full ? html`<p class="hint keep">Set a crop first.</p>` : nothing}
          </div>
        </section>
        <section class="sec" style=${`--c:${SECTION_COLOR.numbers}`}>
          ${this.secHead(uiIcon("check"), "Test")}
          <div class="sec-b">
            <p class="hint keep">Sends a real alert with this camera's picture to every device of yours paired with this Home Assistant.${cameraDraftDirty() ? " Your changes are saved first." : ""}</p>
            <div class="cm-row">
              <button class="cm-btn" ?disabled=${this.testing || this.saving} @click=${() => void this.sendTest()}>
                ${this.testing ? "Sending…" : "Send a test alert"}</button>
            </div>
            ${this.testLine ? html`<p class="cm-result ${this.testLine.ok ? "ok" : "err"}" role="status">${this.testLine.text}</p>` : nothing}
          </div>
        </section>
        <section class="sec" style=${`--c:${SECTION_COLOR.look}`}>
          ${this.secHead(uiIcon("phone"), "Preview")}
          <div class="sec-b cm-previews">
            ${this.renderAlert(camera, edit.viewport, "phone")}
            ${this.renderAlert(camera, edit.viewport, "watch")}
          </div>
        </section>
      </div>
    </div>`;
  }

  /** A section card's header, always open. */
  private secHead(icon: TemplateResult, title: string, summary?: string): TemplateResult {
    return html`<div class="sec-h pinned">
      <span class="swatch">${icon}</span>
      <span class="tt"><h4>${title}</h4>${summary ? html`<span class="sum">${summary}</span>` : nothing}</span>
    </div>`;
  }

  private renderStage(camera: CameraFraming, edit: CameraEdit): TemplateResult {
    const live = this.pictureAddress(camera.entity_id);
    const url = live === undefined ? undefined : this.pictures.urlFor(camera.entity_id, live);
    if (url === undefined) {
      const failed = live === undefined || this.pictures.failing(camera.entity_id);
      return html`<div class="cm-stage"><span class="cm-pic cm-stage-wait ${failed ? "none" : "wait"}">
        <span>${failed ? "No picture from this camera, so there is nothing to frame against." : "Loading the picture…"}</span></span></div>`;
    }
    const v = edit.viewport;
    const box = `left:${pct(v.x * 100)};top:${pct(v.y * 100)};width:${pct(v.w * 100)};height:${pct(v.h * 100)}`;
    return html`<div class="cm-stage">
      <div class="cm-frame">
        <img class="cm-still" alt="" draggable="false" src=${url} @load=${(e: Event) => this.noteAspect(camera.entity_id, e.target as HTMLImageElement)}>
        <div class="cm-dim" aria-hidden="true"><span class="cm-hole" style=${box}></span></div>
        <div class="cm-overlay">
          <div class="cm-box" style=${box} tabindex="0" role="group" aria-label="Crop box"
            @pointerdown=${(e: PointerEvent) => this.beginDrag(e)} @keydown=${(e: KeyboardEvent) => this.onBoxKey(e)}>
            ${CROP_CORNERS.map((corner) => html`<span class="cm-handle ${corner}" aria-hidden="true"
              @pointerdown=${(e: PointerEvent) => this.beginDrag(e, corner)}></span>`)}
          </div>
        </div>
      </div>
    </div>`;
  }

  private renderStreamSelect(camera: CameraFraming, edit: CameraEdit): TemplateResult {
    const choices = [...(camera.stream_choices ?? [])];
    if (edit.stream !== null && !choices.includes(edit.stream)) choices.push(edit.stream);
    return html`<select class="cm-select" aria-label="Live stream on tap" ?disabled=${this.saving}
      @change=${(e: Event) => {
        const value = (e.target as HTMLSelectElement).value;
        this.setEdit({ ...edit, stream: value === "" ? null : value });
      }}>
      <option value="" ?selected=${edit.stream === null}>${autoStreamLabel(camera.stream?.auto)}</option>
      ${choices.map((id) => html`<option value=${id} ?selected=${edit.stream === id}>${id}</option>`)}
    </select>`;
  }

  /** The alert as it lands, with the picture cut to the crop, on a phone and
   * on a watch. */
  private renderAlert(camera: CameraFraming, viewport: CameraViewport, device: "phone" | "watch"): TemplateResult {
    const crop = cropAspect(viewport, this.aspects.get(camera.entity_id) ?? TILE_ASPECT);
    const well = Math.max(crop, device === "watch" ? WATCH_SLOT_MIN_ASPECT : PHONE_SLOT_MIN_ASPECT);
    return html`<figure class="cm-alert ${device}">
      <div class="cm-alert-card">
        <b>${camera.name}</b>
        <span>${TEST_MESSAGE}</span>
        ${this.renderPicture(camera.entity_id, viewport, well, "cm-alert-pic")}
        <span class="cm-alert-done">Done</span>
      </div>
      <figcaption>${device === "watch" ? "Apple Watch" : "iPhone"}</figcaption>
    </figure>`;
  }

  static override styles = [formStyles, chromeTokens, topBarStyles, inspectorStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }
    .cm-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 12px;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    .cm-title { display: inline-flex; align-items: center; gap: 10px; min-width: 0; padding-left: 4px; }
    .cm-title > b { font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); white-space: nowrap; }
    .cm-crumb { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }
    button.cm-back {
      display: inline-flex; align-items: center; gap: 4px; height: 26px; padding: 0 8px 0 4px; border-radius: 6px; cursor: pointer;
      font: inherit; font-size: 13px; color: var(--wa-muted); background: transparent; border: 1px solid var(--wa-line-strong);
    }
    button.cm-back:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
    button.cm-back:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.cm-back:disabled { opacity: .45; cursor: default; }
    .cm-cur { font-size: 14px; font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .cm-lead { margin: 10px var(--cf-pad, 16px) 0; font-size: 13px; color: var(--wa-muted); }
    .cm-note {
      display: flex; align-items: center; gap: 10px; margin: 10px var(--cf-pad, 16px) 0; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .cm-note > span { flex: 1; min-width: 0; }
    .cm-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
    .cm-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .cm-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .cm-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
    .cm-link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
    .cm-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 30px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap;
    }
    .cm-btn:hover:not(:disabled) { background: var(--wa-hover); }
    .cm-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .cm-btn:disabled { opacity: .5; cursor: default; }
    /* Nothing to list yet: one calm card in the middle. */
    .cm-calm { flex: 1 1 auto; min-height: 280px; display: flex; align-items: center; justify-content: center; padding: 24px 0; }
    .cm-empty {
      display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; max-width: 520px;
      padding: 28px 24px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .cm-empty > b { font-size: 15px; }

    /* The list: one card per camera, the Watch app's blue on its lit
       outline, and a green dot on a camera that is framed. */
    .cm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; align-content: start; }
    button.cm-card {
      --c: var(--wa-hue-blue); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
      display: flex; flex-direction: column; gap: 10px; min-width: 0; padding: 10px; text-align: left;
      border-radius: var(--wa-lc-r, 10px); font: inherit; color: var(--wa-ink); cursor: pointer;
      ${litOutline}
    }
    button.cm-card:hover { --lo-fill: var(--wa-hover); }
    button.cm-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .cm-card-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; padding: 0 2px 2px; }
    .cm-card-name { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .cm-card-name b { font-size: 14px; font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .cm-card-sub { font-size: 12.5px; color: var(--wa-muted); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .cm-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: var(--wa-green); }

    /* A picture well: black, the crop centred in it, the full frame drawn
       inside the crop and clipped by it. */
    .cm-pic {
      position: relative; display: flex; align-items: center; justify-content: center; width: 100%;
      overflow: hidden; border-radius: 6px; background: #000;
    }
    .cm-pic.none, .cm-pic.wait { background: var(--wa-field); }
    .cm-pic.none > span { font-size: 12.5px; color: var(--wa-muted); padding: 0 12px; text-align: center; }
    .cm-crop { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: block; overflow: hidden; }
    .cm-crop > img { position: absolute; display: block; max-width: none; user-select: none; -webkit-user-drag: none; }

    /* The editor: the still and its box on the left, the rest beside it. */
    .cm-edit { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(280px, 1fr); gap: 12px; align-items: start; }
    .cm-side { display: flex; flex-direction: column; gap: 0; min-width: 0; }
    .cm-edit .sec { margin: 0 0 12px; }
    .cm-edit .sec-b { display: flex; flex-direction: column; gap: 8px; }
    .cm-edit .sec-b > .hint { margin: 0; font-size: 12.5px; color: var(--wa-muted); }
    .cm-row { display: flex; flex-wrap: wrap; gap: 8px; }
    /* Room round the still for the corner handles, which reach past it. */
    .cm-stage { display: flex; justify-content: center; padding: 10px 0; }
    .cm-stage-wait { aspect-ratio: 16 / 9; }
    /* The frame hugs the still, so the box's percentages are the still's. */
    .cm-frame { position: relative; display: inline-block; line-height: 0; max-width: 100%; }
    .cm-still { display: block; max-width: 100%; max-height: min(62vh, 620px); border-radius: 6px; user-select: none; -webkit-user-drag: none; }
    .cm-dim { position: absolute; inset: 0; overflow: hidden; border-radius: 6px; pointer-events: none; }
    .cm-hole { position: absolute; box-shadow: 0 0 0 9999px rgba(0, 0, 0, .55); }
    .cm-overlay { position: absolute; inset: 0; }
    .cm-box { position: absolute; border: 2px solid #fff; cursor: move; touch-action: none; }
    .cm-box:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--wa-accent); }
    .cm-handle { position: absolute; width: 28px; height: 28px; margin: -14px 0 0 -14px; touch-action: none; }
    .cm-handle::after {
      content: ""; position: absolute; left: 6px; top: 6px; width: 16px; height: 16px; border-radius: 50%;
      background: #fff; box-shadow: 0 0 0 1px rgba(0, 0, 0, .35), 0 1px 3px rgba(0, 0, 0, .4);
    }
    .cm-handle.nw { left: 0; top: 0; cursor: nwse-resize; }
    .cm-handle.ne { left: 100%; top: 0; cursor: nesw-resize; }
    .cm-handle.sw { left: 0; top: 100%; cursor: nesw-resize; }
    .cm-handle.se { left: 100%; top: 100%; cursor: nwse-resize; }
    select.cm-select { width: 100%; min-width: 0; }
    label.cm-check { display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer; }
    label.cm-check:has(input:disabled) { color: var(--wa-muted); cursor: default; }
    .cm-result { font-size: 13px; }
    .cm-result.ok { color: var(--wa-green); }
    .cm-result.err { color: var(--wa-need); }

    /* The alert previews: the notification's own black card, on either skin. */
    .cm-previews { flex-direction: row !important; flex-wrap: wrap; align-items: flex-start; justify-content: center; gap: 16px !important; }
    figure.cm-alert { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    figure.cm-alert.phone { width: 260px; max-width: 100%; }
    figure.cm-alert.watch { width: 176px; }
    figure.cm-alert figcaption { font-size: 11.5px; color: var(--wa-muted); }
    .cm-alert-card {
      display: flex; flex-direction: column; gap: 2px; width: 100%; padding: 12px; border-radius: 20px;
      background: #000; color: #fff; border: 1px solid rgba(255, 255, 255, .18);
    }
    .watch .cm-alert-card { padding: 9px; border-radius: 24px; }
    .cm-alert-card > b { font-size: 15px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .watch .cm-alert-card > b { font-size: 13.5px; }
    .cm-alert-card > span:not(.cm-pic):not(.cm-alert-done) { font-size: 13px; color: rgba(255, 255, 255, .5); margin-bottom: 6px; }
    .watch .cm-alert-card > span:not(.cm-pic):not(.cm-alert-done) { font-size: 11.5px; }
    .cm-alert-card .cm-pic { border-radius: 12px; }
    .cm-alert-card .cm-pic.none, .cm-alert-card .cm-pic.wait { background: #1c1c1e; }
    .cm-alert-done {
      margin-top: 8px; padding: 8px 0; text-align: center; border-radius: 14px; font-size: 14px; font-weight: 600;
      color: rgba(255, 255, 255, .85); background: rgba(255, 255, 255, .1);
    }
    .watch .cm-alert-done { font-size: 13px; padding: 6px 0; }

    @container (max-width: 820px) {
      .cm-edit { grid-template-columns: minmax(0, 1fr); }
    }
    :host([narrow]) { --cf-pad: 12px; }
  `];
}

if (!customElements.get("wa-cameras-editor")) {
  customElements.define("wa-cameras-editor", WaCamerasEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-cameras-editor": WaCamerasEditor;
  }
}
