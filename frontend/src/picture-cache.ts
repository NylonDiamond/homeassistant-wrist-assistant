// The bytes behind an entity's picture, held for as long as the panel is open.
//
// An image layer draws Home Assistant's own `entity_picture`: a proxy address
// with an access token in it. For a camera that proxy takes a fresh frame off
// the camera on every request and answers with no-store, so nothing the
// browser holds is ever reused. That is the right answer for the complication
// being edited, whose crop has to be adjusted against a current frame, and the
// wrong one for the picker, where twenty-odd cards ask for every camera in the
// house at once. SVG `<image>` has no `loading="lazy"` either, so the cards
// below the fold do not wait their turn: they all fire together and the grid
// fades in over several seconds, every single time the dialog opens.
//
// So the cards read through here. One fetch per entity for the life of the
// page, handed to every card that wants it as an object URL, and the second
// open of the dialog costs nothing at all. Only the pixels are cached: the
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
}

/**
 * Entity id to the address of its cached picture.
 *
 * Keyed by entity id rather than by the live address on purpose. Home
 * Assistant rotates the access token inside `entity_picture`, so the same
 * camera is a different address every few minutes; keying on the address would
 * throw the whole cache away each time the token moved, which is exactly the
 * refetch this exists to stop.
 */
export class PictureCache {
  /** Entity id to object URL, in least-recently-wanted order: `Map` keeps
   * insertion order, and a hit is re-inserted, so the first key is the oldest. */
  private readonly held = new Map<string, string>();
  private readonly inFlight = new Set<string>();
  private readonly failedAt = new Map<string, number>();

  constructor(private readonly host: PictureCacheHost) {}

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
      return held;
    }
    if (this.inFlight.has(entityId)) return undefined;
    const failed = this.failedAt.get(entityId);
    if (failed !== undefined && this.host.now() - failed < PICTURE_RETRY_MS) return undefined;
    this.inFlight.add(entityId);
    void this.load(entityId, liveUrl);
    return undefined;
  }

  /** Forget one entity's picture, so the next card that wants it fetches a new
   * frame. */
  drop(entityId: string) {
    const url = this.held.get(entityId);
    if (url !== undefined) this.host.revoke(url);
    this.held.delete(entityId);
    this.failedAt.delete(entityId);
  }

  /** Let go of everything. The panel calls this on its way out: an object URL
   * the document never revokes holds its bytes until the tab is closed. */
  clear() {
    for (const url of this.held.values()) this.host.revoke(url);
    this.held.clear();
    this.failedAt.clear();
  }

  /** How many pictures are held. For the tests. */
  get size(): number {
    return this.held.size;
  }

  private async load(entityId: string, liveUrl: string) {
    try {
      const reply = await this.host.fetch(liveUrl);
      if (!reply.ok) throw new Error(`HTTP ${reply.status}`);
      const blob = await reply.blob();
      // A zero-byte answer is a camera that is up but has no frame yet. Holding
      // it would pin an empty picture on that card for the rest of the session.
      if (blob.size === 0) throw new Error("empty");
      this.put(entityId, this.host.objectUrl(blob));
      this.failedAt.delete(entityId);
    } catch {
      this.failedAt.set(entityId, this.host.now());
    } finally {
      this.inFlight.delete(entityId);
      this.host.changed();
    }
  }

  private put(entityId: string, url: string) {
    const old = this.held.get(entityId);
    if (old !== undefined) this.host.revoke(old);
    this.held.set(entityId, url);
    while (this.held.size > PICTURE_CACHE_MAX) {
      const oldest = this.held.keys().next();
      if (oldest.done) break;
      this.drop(oldest.value);
    }
  }
}
