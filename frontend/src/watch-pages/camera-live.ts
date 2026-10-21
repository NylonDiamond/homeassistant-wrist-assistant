// Live camera video in the page editor, played the way the iPhone plays its
// live tiles: over WebRTC, through Home Assistant's own `camera/webrtc/*`
// websocket commands (go2rtc behind them). Two uses:
//
// - the Play box in a camera tile's Live video card, which plays the tile's
//   SD or HD stream with its size, codec and frame rate, so a person sees
//   what each stream really is before picking one;
// - the stage's live tiles, off by default (`watchEditorLiveCameras`), which
//   play every camera tile of an iPhone page on its SD stream.
//
// Which entity is a camera's SD and which its HD stream is the integration's
// camera device groups (`wrist_assistant/cameras/list`, `streams`), the same
// pairing the iPhone asks for with `quality_level`. A person picks one
// camera; the other stream comes with it.

import type { CameraFraming, HassLike } from "../ha-api.js";
import { fetchCameras } from "../ha-api.js";

// ── a camera's two streams ───────────────────────────────────────────────

/** A camera's SD and HD stream entities, as its device groups them. Either
 * is undefined when the device has none (a camera with one stream). */
export interface WatchCameraStreams {
  sd: string | undefined;
  hd: string | undefined;
}

/** The streams of the camera `entityId` belongs to, from the list command's
 * rows; undefined when no row holds it (a camera with no device). */
export function watchCameraStreamsFrom(rows: readonly CameraFraming[], entityId: string): WatchCameraStreams | undefined {
  const row = rows.find((r) => r.entity_id === entityId || r.all_entity_ids.includes(entityId));
  if (row === undefined) return undefined;
  return { sd: row.streams?.sd ?? undefined, hd: row.streams?.hd ?? undefined };
}

/** The camera entities the Add tile list leaves out: every other entity of
 * a device that has an SD stream (its HD stream, its snapshot cameras), so
 * a camera is one row, its SD stream. A tile on it plays both streams. A
 * device with no SD stream, or one whose SD stream has no state (disabled),
 * keeps all its entities. */
export function watchHiddenCameraIds(rows: readonly CameraFraming[], states: Readonly<Record<string, unknown>>): Set<string> {
  const hidden = new Set<string>();
  for (const row of rows) {
    const sd = row.streams?.sd;
    if (typeof sd !== "string" || states[sd] === undefined) continue;
    for (const id of row.all_entity_ids) if (id !== sd) hidden.add(id);
  }
  return hidden;
}

/** The SD stream a tile on `entityId` plays in the editor's live tiles: the
 * device's SD stream, else the entity itself. */
export function watchCameraLiveEntity(rows: readonly CameraFraming[] | undefined, entityId: string): string {
  return (rows === undefined ? undefined : watchCameraStreamsFrom(rows, entityId)?.sd) ?? entityId;
}

/** One home's camera rows, fetched once per connection and shared by every
 * card and the stage. */
let cameraRows: { connection: unknown; rows: CameraFraming[] | undefined; loading: boolean } | undefined;

/**
 * The home's camera rows, or undefined while they load (or when the
 * integration is too old to list them). The first call starts the fetch;
 * `onLoad` is called once they are in, to draw again.
 */
export function watchCameraRows(hass: HassLike, onLoad: () => void): CameraFraming[] | undefined {
  // A host with no connection (a test) lists nothing.
  if (hass.connection === undefined) return undefined;
  if (cameraRows !== undefined && cameraRows.connection === hass.connection) return cameraRows.rows;
  const entry: { connection: unknown; rows: CameraFraming[] | undefined; loading: boolean } = { connection: hass.connection, rows: undefined, loading: true };
  cameraRows = entry;
  fetchCameras(hass).then(
    (reply) => {
      entry.rows = reply.cameras;
      entry.loading = false;
      onLoad();
    },
    () => {
      entry.loading = false;
    },
  );
  return undefined;
}

/** Forget the rows, so the next call fetches them again (a test). */
export function forgetWatchCameraRows(): void {
  cameraRows = undefined;
}

// ── the stage's live tiles switch ────────────────────────────────────────

const LIVE_TILES_KEY = "wa-editor-live-cameras";

/** Whether the stage plays an iPhone page's camera tiles live. Off by
 * default: each one holds a stream open on Home Assistant while the editor
 * shows the page. Kept in this browser only. */
export function watchEditorLiveCameras(): boolean {
  try {
    return window.localStorage.getItem(LIVE_TILES_KEY) === "1";
  } catch {
    return false;
  }
}

export function setWatchEditorLiveCameras(on: boolean): void {
  try {
    if (on) window.localStorage.setItem(LIVE_TILES_KEY, "1");
    else window.localStorage.removeItem(LIVE_TILES_KEY);
  } catch {
    // A browser without storage keeps the switch off.
  }
}

// ── the stream's facts ───────────────────────────────────────────────────

/** What a playing stream is: its frame size, codec and frame rate. */
export interface WatchCameraLiveFacts {
  width: number;
  height: number;
  codec: string | undefined;
  fps: number | undefined;
}

/** "H.265" for "video/H265", the codec's name as people write it. */
export function watchCodecName(mimeType: string | undefined): string | undefined {
  if (mimeType === undefined) return undefined;
  const name = mimeType.replace(/^video\//i, "").toUpperCase();
  if (name === "H264" || name === "H265") return `H.${name.slice(1)}`;
  return name === "" ? undefined : name;
}

/** The facts as one line: "7680×2160 · H.265 · 20 fps". */
export function watchCameraLiveFactsText(facts: WatchCameraLiveFacts): string {
  const parts = [`${facts.width}×${facts.height}`];
  if (facts.codec !== undefined) parts.push(facts.codec);
  if (facts.fps !== undefined) parts.push(`${Math.round(facts.fps)} fps`);
  return parts.join(" · ");
}

/**
 * Whether a frame should be turned a quarter left to look like the camera:
 * the iPhone's rule (`CameraWebRTCStreamPlan.mainStreamTurn`), where a
 * camera's main stream comes tall and its other stream wide (a Reolink Duo
 * 3). `wide` is what the camera looks like (its tile's detected ratio); a
 * frame clearly the other shape is turned.
 */
export function watchCameraLiveTurns(width: number, height: number, wide: boolean | undefined): boolean {
  if (wide === undefined || width <= 0 || height <= 0) return false;
  return wide ? height > width * 1.2 : width > height * 1.2;
}

// ── the player ───────────────────────────────────────────────────────────

interface OfferEvent {
  type: string;
  session_id?: string;
  answer?: string;
  candidate?: unknown;
  code?: string;
  message?: string;
}

/** A candidate as Home Assistant takes it: the three fields it knows. */
function candidateOut(c: RTCIceCandidate): Record<string, unknown> {
  const out: Record<string, unknown> = { candidate: c.candidate };
  if (c.sdpMid !== null) out.sdpMid = c.sdpMid;
  if (c.sdpMLineIndex !== null) out.sdpMLineIndex = c.sdpMLineIndex;
  return out;
}

function candidateIn(raw: unknown): RTCIceCandidateInit | undefined {
  if (typeof raw === "string") return raw === "" ? undefined : { candidate: raw, sdpMLineIndex: 0 };
  if (raw === null || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  if (typeof r.candidate !== "string" || r.candidate === "") return undefined;
  const out: RTCIceCandidateInit = { candidate: r.candidate };
  if (typeof r.sdpMid === "string") out.sdpMid = r.sdpMid;
  if (typeof r.sdpMLineIndex === "number") out.sdpMLineIndex = r.sdpMLineIndex;
  if (out.sdpMid === undefined && out.sdpMLineIndex === undefined) out.sdpMLineIndex = 0;
  return out;
}

/** How long a stream may show packets without a decoded frame before the
 * player says the browser cannot decode it. */
const NO_FRAME_MS = 8000;

/**
 * `<wa-camera-live>`: one camera entity's live video. Set `hass` and
 * `entity` (a property each); it plays while it is in the page and stops
 * when it leaves or the entity changes. `fit` letterboxes the picture, else
 * it fills; `info` shows the facts in the top right corner; `wide` turns a
 * frame of the other shape a quarter left (`watchCameraLiveTurns`).
 */
// The tests run without a DOM: the class still loads there, and is never
// defined as an element.
const ElementBase = (typeof HTMLElement === "undefined" ? class {} : HTMLElement) as typeof HTMLElement;

export class WaCameraLive extends ElementBase {
  hass: HassLike | undefined;
  private _entity = "";
  private _fit = false;
  private _info = false;
  private _wide: boolean | undefined;
  private run = 0;
  private pc: RTCPeerConnection | undefined;
  private unsubscribe: (() => Promise<void>) | undefined;
  private timer: number | undefined;
  private resize: ResizeObserver | undefined;
  private readonly video: HTMLVideoElement;
  private readonly badge: HTMLSpanElement;
  private readonly note: HTMLSpanElement;
  private facts: WatchCameraLiveFacts | undefined;
  private started = 0;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `<style>
      :host { position: relative; display: block; overflow: hidden; background: #000; pointer-events: none; }
      video { position: absolute; left: 50%; top: 50%; width: 100%; height: 100%; transform: translate(-50%, -50%); object-fit: cover; }
      .badge { position: absolute; top: 4px; right: 4px; padding: 1px 5px; border-radius: 99px; background: rgba(0,0,0,.6); color: #fff; font: 600 10px/1.4 system-ui, sans-serif; font-variant-numeric: tabular-nums; }
      .note { position: absolute; left: 8px; right: 8px; bottom: 8px; color: #fff; font: 12px/1.35 system-ui, sans-serif; text-align: center; text-shadow: 0 1px 2px #000; }
      [hidden] { display: none; }
    </style><video muted autoplay playsinline></video><span class="badge" hidden></span><span class="note" hidden></span>`;
    this.video = root.querySelector("video")!;
    this.badge = root.querySelector(".badge")!;
    this.note = root.querySelector(".note")!;
  }

  get entity(): string {
    return this._entity;
  }
  set entity(value: string) {
    if (value === this._entity) return;
    this._entity = value;
    if (this.isConnected) void this.start();
  }

  get fit(): boolean {
    return this._fit;
  }
  set fit(value: boolean) {
    this._fit = value;
    this.layout();
  }

  get info(): boolean {
    return this._info;
  }
  set info(value: boolean) {
    this._info = value;
    this.showFacts();
  }

  get wide(): boolean | undefined {
    return this._wide;
  }
  set wide(value: boolean | undefined) {
    this._wide = value;
    this.layout();
  }

  connectedCallback(): void {
    this.resize = new ResizeObserver(() => this.layout());
    this.resize.observe(this);
    void this.start();
  }

  disconnectedCallback(): void {
    this.resize?.disconnect();
    this.resize = undefined;
    this.stop();
  }

  private say(text: string | undefined): void {
    this.note.hidden = text === undefined;
    this.note.textContent = text ?? "";
  }

  private stop(): void {
    this.run += 1;
    if (this.timer !== undefined) window.clearInterval(this.timer);
    this.timer = undefined;
    void this.unsubscribe?.().catch(() => undefined);
    this.unsubscribe = undefined;
    this.pc?.close();
    this.pc = undefined;
    this.video.srcObject = null;
    this.facts = undefined;
    this.showFacts();
  }

  private async start(): Promise<void> {
    this.stop();
    const run = this.run;
    const hass = this.hass;
    const entity = this._entity;
    if (hass === undefined || entity === "") return;
    this.say(undefined);
    this.started = Date.now();
    let config: { configuration?: RTCConfiguration } = {};
    try {
      config = await hass.connection.sendMessagePromise({ type: "camera/webrtc/get_client_config", entity_id: entity });
    } catch {
      // Home Assistant's default servers.
    }
    if (run !== this.run) return;
    const pc = new RTCPeerConnection(config.configuration ?? {});
    this.pc = pc;
    pc.addTransceiver("video", { direction: "recvonly" });
    pc.ontrack = (event) => {
      this.video.srcObject = event.streams[0] ?? new MediaStream([event.track]);
      void this.video.play().catch(() => undefined);
    };
    let sessionId: string | undefined;
    const pending: Record<string, unknown>[] = [];
    const send = (candidate: Record<string, unknown>) => {
      void hass.connection
        .sendMessagePromise({ type: "camera/webrtc/candidate", entity_id: entity, session_id: sessionId, candidate })
        .catch(() => undefined);
    };
    pc.onicecandidate = (event) => {
      if (event.candidate === null || event.candidate.candidate === "") return;
      const out = candidateOut(event.candidate);
      if (sessionId === undefined) pending.push(out);
      else send(out);
    };
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    if (run !== this.run) return;
    try {
      const unsubscribe = await hass.connection.subscribeMessage<OfferEvent>((event) => {
        if (run !== this.run) return;
        if (event.type === "session" && typeof event.session_id === "string") {
          sessionId = event.session_id;
          pending.splice(0).forEach(send);
        } else if (event.type === "answer" && typeof event.answer === "string") {
          void pc.setRemoteDescription({ type: "answer", sdp: event.answer }).catch((e: unknown) => this.say(`Could not play: ${String(e)}`));
        } else if (event.type === "candidate") {
          const c = candidateIn(event.candidate);
          if (c !== undefined) void pc.addIceCandidate(c).catch(() => undefined);
        } else if (event.type === "error") {
          this.say(`Could not play: ${event.message || event.code || "the camera refused"}`);
        }
      }, { type: "camera/webrtc/offer", entity_id: entity, offer: offer.sdp });
      if (run !== this.run) {
        void unsubscribe().catch(() => undefined);
        return;
      }
      this.unsubscribe = unsubscribe;
    } catch (e) {
      const message = e !== null && typeof e === "object" && "message" in e ? String((e as { message: unknown }).message) : String(e);
      this.say(`Could not play: ${message}`);
      return;
    }
    this.timer = window.setInterval(() => void this.measure(run), 1000);
  }

  /** Reads the video's size, codec and frame rate from the connection. */
  private async measure(run: number): Promise<void> {
    const pc = this.pc;
    if (pc === undefined || run !== this.run) return;
    const stats = await pc.getStats().catch(() => undefined);
    if (stats === undefined || run !== this.run) return;
    let inbound: Record<string, unknown> | undefined;
    stats.forEach((report: Record<string, unknown>) => {
      if (report.type === "inbound-rtp" && report.kind === "video") inbound = report;
    });
    if (inbound === undefined) return;
    const codecReport = typeof inbound.codecId === "string" ? (stats.get(inbound.codecId) as Record<string, unknown> | undefined) : undefined;
    const codec = watchCodecName(typeof codecReport?.mimeType === "string" ? codecReport.mimeType : undefined);
    const decoded = typeof inbound.framesDecoded === "number" ? inbound.framesDecoded : 0;
    const packets = typeof inbound.packetsReceived === "number" ? inbound.packetsReceived : 0;
    const width = typeof inbound.frameWidth === "number" ? inbound.frameWidth : this.video.videoWidth;
    const height = typeof inbound.frameHeight === "number" ? inbound.frameHeight : this.video.videoHeight;
    if (decoded === 0) {
      if (packets > 0 && Date.now() - this.started > NO_FRAME_MS) {
        this.say(`This browser cannot show ${codec ?? "this stream"}. The iPhone can.`);
      }
      return;
    }
    this.say(undefined);
    this.facts = { width, height, codec, fps: typeof inbound.framesPerSecond === "number" ? inbound.framesPerSecond : undefined };
    this.showFacts();
    this.layout();
    this.dispatchEvent(new CustomEvent("wa-camera-live-facts", { detail: this.facts }));
  }

  private showFacts(): void {
    this.badge.hidden = !this._info || this.facts === undefined;
    this.badge.textContent = this.facts === undefined ? "" : watchCameraLiveFactsText(this.facts);
  }

  /** Lays the video out: filled or fitted, and turned a quarter left when
   * its frames are the other shape from the camera. */
  private layout(): void {
    const w = this.clientWidth;
    const h = this.clientHeight;
    const frameW = this.video.videoWidth;
    const frameH = this.video.videoHeight;
    const turn = watchCameraLiveTurns(frameW, frameH, this._wide);
    this.video.style.objectFit = this._fit ? "contain" : "cover";
    this.video.style.width = turn ? `${h}px` : "100%";
    this.video.style.height = turn ? `${w}px` : "100%";
    this.video.style.transform = turn ? "translate(-50%, -50%) rotate(-90deg)" : "translate(-50%, -50%)";
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wa-camera-live")) customElements.define("wa-camera-live", WaCameraLive);
