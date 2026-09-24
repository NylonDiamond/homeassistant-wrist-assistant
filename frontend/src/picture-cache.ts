// The bytes behind an entity's picture, held in memory while the panel is open
// and optionally restored from browser storage on the next visit.
//
// An image layer draws Home Assistant's own `entity_picture`: a proxy address
// with an access token in it. For a camera that proxy takes a fresh frame off
// the camera on every request and answers with no-store, so nothing the
// browser holds is ever reused. Browse cards read the stored frame. Opening a
// complication asks for one fresh frame and replaces that stored copy, so the
// main preview and Browse agree without refetching on every redraw.
//
// All editor previews read through here. Only the pixels are cached: the
// card is drawn from the document every time, so an edit to a layer's crop,
// zoom or frame shows up at once.
//
// A miss draws nothing and starts a fetch, and the host is told when the bytes
// land so it can draw again. That is the same placeholder the watch shows
// before its own first fetch, so a card is never wrong, only briefly empty.

/** How many pictures are held before the oldest is let go. A camera frame is a
 * couple of hundred KB, so this is a few tens of MB at the very worst, and a
 * home with more than forty picture entities on its complications is not a
 * home this dialog was sized for either. */
export const PICTURE_CACHE_MAX = 40;

/** How long a picture that would not load is left alone before it is tried
 * again. Without it a camera that is off answers instantly with an error and
 * every re-render asks it again. */
export const PICTURE_RETRY_MS = 30_000;

/** Everything the cache needs from the browser, injected so the whole thing
 * runs under vitest with no DOM. */
export interface PictureCacheHost {
  /** Ask for an address. */
  fetch: (url: string) => Promise<{ ok: boolean; status: number; blob: () => Promise<Blob> }>;
  /** Wrap fetched bytes in an address the DOM can draw. */
  objectUrl: (blob: Blob) => string;
  /** Let go of one of those addresses. */
  revoke: (url: string) => void;
  /** Bytes landed, or failed to: draw again. */
  changed: () => void;
  /** The clock the retry window is measured on. One clock for both ends of it,
   * so a stamp written when a fetch failed and the check that reads it later
   * can never come from two different ones. */
  now: () => number;
  /** Captured when a request starts, so a later account switch cannot file
   * the old account's frame under the new account's storage key. */
  scope?: () => string | undefined;
  /** Optional durable storage. A failed read falls back to the live address;
   * a failed write leaves the in-memory frame usable for this visit. */
  read?: (entityId: string, scope?: string) => Promise<StoredPicture | undefined>;
  write?: (entityId: string, picture: StoredPicture, scope?: string) => Promise<void>;
}

/** A frame as browser storage keeps it, with the address it came from. */
export interface StoredPicture {
  blob: Blob;
  /** `pictureSource` of the address the frame came from. Missing on a frame
   * stored before this was recorded, which counts as out of date. */
  source?: string;
}

/**
 * The part of an `entity_picture` address that says which picture it is.
 *
 * Only the access token is left out: Home Assistant rotates it every few
 * minutes, and a camera with a new token is still the same camera. Everything
 * else stays. A media player's address carries a hash of its cover art, so a
 * new song is a new source and the held frame is replaced.
 */
export function pictureSource(url: string): string {
  const q = url.indexOf("?");
  if (q < 0) return url;
  const params = new URLSearchParams(url.slice(q + 1));
  params.delete("token");
  const rest = params.toString();
  return rest === "" ? url.slice(0, q) : `${url.slice(0, q)}?${rest}`;
}

interface Held {
  url: string;
  source?: string;
}

interface Flight {
  epoch: number;
  kind: "read" | "fetch";
  refresh: boolean;
  scope?: string;
}

/**
 * Entity id to the address of its cached picture.
 *
 * Keyed by entity id rather than by the live address on purpose. Home
 * Assistant rotates the access token inside `entity_picture`, so the same
 * camera is a different address every few minutes; keying on the address would
 * throw the whole cache away each time the token moved, which is exactly the
 * refetch this exists to stop. Each frame remembers its `pictureSource`, so an
 * address that changed for any other reason (new cover art) fetches again.
 */
export class PictureCache {
  /** Entity id to object URL, in least-recently-wanted order: `Map` keeps
   * insertion order, and a hit is re-inserted, so the first key is the oldest. */
  private readonly held = new Map<string, Held>();
  private readonly inFlight = new Map<string, Flight>();
  private readonly failedAt = new Map<string, number>();
  private readonly writes = new Map<string, Promise<void>>();
  /** A cleared panel must not accept bytes from its previous visit. */
  private epoch = 0;

  /** `max` is how many are held at once. Browse's card pictures take a much
   * larger one than the pictures: every card on screen asks at every render,
   * and a limit below that would evict and restore them in a loop. */
  constructor(private readonly host: PictureCacheHost, private readonly max = PICTURE_CACHE_MAX) {}

  /**
   * The address to draw for this entity, or undefined while its bytes are on
   * the way. `liveUrl` is Home Assistant's own `entity_picture`, used only when
   * there is nothing held and a fetch has to start.
   */
  urlFor(entityId: string, liveUrl: string): string | undefined {
    const held = this.held.get(entityId);
    if (held !== undefined) {
      this.held.delete(entityId);
      this.held.set(entityId, held);
      // A different picture behind the same entity: the old one stays up
      // until the new one lands, the same as an opening refresh.
      if (held.source !== pictureSource(liveUrl) && this.mayStart(entityId)) this.refresh(entityId, liveUrl);
      return held.url;
    }
    if (!this.mayStart(entityId)) return undefined;
    const flight: Flight = {
      epoch: this.epoch, kind: this.host.read ? "read" : "fetch", refresh: false,
      scope: this.host.scope?.(),
    };
    this.inFlight.set(entityId, flight);
    if (this.host.read) void this.restoreOrFetch(entityId, liveUrl, flight);
    else void this.fetchFresh(entityId, liveUrl, flight);
    return undefined;
  }

  /** Opening a complication takes one fresh frame. Keep the old picture on
   * screen until the new bytes arrive, then replace it in both previews. */
  refresh(entityId: string, liveUrl: string): void {
    const active = this.inFlight.get(entityId);
    if (active?.kind === "fetch") return;
    if (active?.kind === "read") {
      active.refresh = true;
      return;
    }
    const restoreFirst = !this.held.has(entityId) && this.host.read !== undefined;
    const flight: Flight = {
      epoch: this.epoch, kind: restoreFirst ? "read" : "fetch", refresh: true,
      scope: this.host.scope?.(),
    };
    this.inFlight.set(entityId, flight);
    if (restoreFirst) void this.restoreOrFetch(entityId, liveUrl, flight);
    else void this.fetchFresh(entityId, liveUrl, flight);
  }

  /** Hold bytes the caller already has, as if they had just been fetched from
   * `liveUrl`, and keep them in storage. Whatever was on the way for this key
   * is dropped: these are newer. */
  seed(entityId: string, blob: Blob, liveUrl: string): void {
    this.inFlight.delete(entityId);
    this.failedAt.delete(entityId);
    const source = pictureSource(liveUrl);
    this.put(entityId, this.host.objectUrl(blob), source);
    this.persist(entityId, { blob, source }, this.host.scope?.());
    this.host.changed();
  }

  /** Whether the last try for this key failed recently, so a caller can draw
   * something else instead of waiting on it. */
  failing(entityId: string): boolean {
    const failed = this.failedAt.get(entityId);
    return failed !== undefined && this.host.now() - failed < PICTURE_RETRY_MS;
  }

  /** Forget one entity's picture, so the next card that wants it fetches a new
   * frame. */
  drop(entityId: string) {
    const held = this.held.get(entityId);
    if (held !== undefined) this.host.revoke(held.url);
    this.held.delete(entityId);
    this.inFlight.delete(entityId);
    this.failedAt.delete(entityId);
  }

  /** Let go of everything. The panel calls this on its way out: an object URL
   * the document never revokes holds its bytes until the tab is closed. */
  clear() {
    this.epoch++;
    for (const held of this.held.values()) this.host.revoke(held.url);
    this.held.clear();
    this.inFlight.clear();
    this.failedAt.clear();
  }

  /** How many pictures are held. For the tests. */
  get size(): number {
    return this.held.size;
  }

  /** Nothing already on the way, and no recent failure to wait out. */
  private mayStart(entityId: string): boolean {
    if (this.inFlight.has(entityId)) return false;
    const failed = this.failedAt.get(entityId);
    return failed === undefined || this.host.now() - failed >= PICTURE_RETRY_MS;
  }

  private current(entityId: string, flight: Flight): boolean {
    return flight.epoch === this.epoch && this.inFlight.get(entityId) === flight;
  }

  private finish(entityId: string, flight: Flight): void {
    if (!this.current(entityId, flight)) return;
    this.inFlight.delete(entityId);
    this.host.changed();
  }

  private async restoreOrFetch(entityId: string, liveUrl: string, flight: Flight): Promise<void> {
    try {
      const stored = await this.host.read?.(entityId, flight.scope);
      if (!this.current(entityId, flight)) return;
      if (stored && stored.blob.size > 0) {
        this.put(entityId, this.host.objectUrl(stored.blob), stored.source);
        // A stored frame of another picture is shown, then replaced.
        if (!flight.refresh && stored.source === pictureSource(liveUrl)) {
          this.finish(entityId, flight);
          return;
        }
        this.host.changed();
      }
    } catch {
      // Storage is optional: the live address remains the fallback.
    }
    if (!this.current(entityId, flight)) return;
    flight.kind = "fetch";
    await this.fetchFresh(entityId, liveUrl, flight);
  }

  private async fetchFresh(entityId: string, liveUrl: string, flight: Flight): Promise<void> {
    try {
      const reply = await this.host.fetch(liveUrl);
      if (!reply.ok) throw new Error(`HTTP ${reply.status}`);
      const blob = await reply.blob();
      if (!this.current(entityId, flight)) return;
      // A zero-byte answer is a camera that is up but has no frame yet. Holding
      // it would pin an empty picture on that card for the rest of the session.
      if (blob.size === 0) throw new Error("empty");
      const source = pictureSource(liveUrl);
      this.put(entityId, this.host.objectUrl(blob), source);
      this.failedAt.delete(entityId);
      this.persist(entityId, { blob, source }, flight.scope);
    } catch {
      if (this.current(entityId, flight)) this.failedAt.set(entityId, this.host.now());
    } finally {
      this.finish(entityId, flight);
    }
  }

  private persist(entityId: string, picture: StoredPicture, scope: string | undefined): void {
    if (!this.host.write) return;
    // Two refreshes can finish before storage has completed the first write.
    // Serialize each entity's writes so the newest frame remains on disk.
    const prior = this.writes.get(entityId) ?? Promise.resolve();
    const next = prior.catch(() => undefined).then(() => this.host.write!(entityId, picture, scope));
    this.writes.set(entityId, next);
    void next.catch(() => undefined).finally(() => {
      if (this.writes.get(entityId) === next) this.writes.delete(entityId);
    });
  }

  private put(entityId: string, url: string, source: string | undefined) {
    const old = this.held.get(entityId);
    if (old !== undefined) this.host.revoke(old.url);
    this.held.delete(entityId);
    this.held.set(entityId, { url, source });
    while (this.held.size > this.max) {
      const oldest = this.held.keys().next();
      if (oldest.done) break;
      this.drop(oldest.value);
    }
  }
}
