/** Camera and entity-picture frames kept by this browser for Browse cards.
 * IndexedDB works on a local HTTP Home Assistant address as well as HTTPS.
 * The browser may evict this data or the user may clear site storage; a miss
 * simply falls back to one fresh request. */

import type { StoredPicture } from "./picture-cache.js";

const DATABASE = "wrist-assistant-preview-frames";
const STORE = "frames";

export class BrowserPictureStore {
  private database?: Promise<IDBDatabase>;

  /** `name` is the IndexedDB database. The Browse card pictures keep their own,
   * so clearing one kind never costs the other. */
  constructor(private readonly name = DATABASE) {}

  /** Home Assistant user ids keep one account's private camera frames out of
   * another account's Browse cards in the same browser profile. */
  async read(entityId: string, userId?: string): Promise<StoredPicture | undefined> {
    if (!userId) return undefined;
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE, "readonly").objectStore(STORE).get([userId, entityId]);
      request.onsuccess = () => resolve(storedPicture(request.result));
      request.onerror = () => reject(request.error);
    });
  }

  async write(entityId: string, picture: StoredPicture, userId?: string): Promise<void> {
    if (!userId) return;
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put({ blob: picture.blob, source: picture.source }, [userId, entityId]);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  private open(): Promise<IDBDatabase> {
    if (this.database) return this.database;
    this.database = new Promise((resolve, reject) => {
      if (typeof indexedDB === "undefined") {
        reject(new Error("IndexedDB is unavailable"));
        return;
      }
      const request = indexedDB.open(this.name, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("Preview storage is blocked"));
    });
    return this.database;
  }
}

/** A row as written now, or a bare Blob from before rows carried their
 * source. The bare one comes back with no source, so it is shown and then
 * replaced by one fresh frame. */
function storedPicture(row: unknown): StoredPicture | undefined {
  if (row instanceof Blob) return { blob: row };
  if (typeof row !== "object" || row === null) return undefined;
  const { blob, source } = row as { blob?: unknown; source?: unknown };
  if (!(blob instanceof Blob)) return undefined;
  return typeof source === "string" ? { blob, source } : { blob };
}
