// The address a Browse card's picture is cached under, and how the cache
// treats one picture per record with the revision riding in that address.

import { describe, expect, it } from "vitest";
import { cardPreviewAddress, parseCardPreviewAddress } from "../src/card-snapshot.js";
import { PictureCache, type PictureCacheHost, pictureSource } from "../src/picture-cache.js";

function bytes(size = 3): Blob {
  return { size } as Blob;
}

const settle = () => new Promise((r) => setTimeout(r, 0));

describe("card picture addresses", () => {
  it("round-trips owner, record and revision, whatever the ids hold", () => {
    const address = cardPreviewAddress("watch/1?x", "AB|CD", 7);
    expect(parseCardPreviewAddress(address)).toEqual({ ownerId: "watch/1?x", recordId: "AB|CD", revision: 7 });
    expect(parseCardPreviewAddress("/api/camera_proxy/camera.front?token=a")).toBeUndefined();
  });

  it("makes a new revision a new source, so the held picture is replaced", () => {
    expect(pictureSource(cardPreviewAddress("w", "A", 1))).not.toBe(pictureSource(cardPreviewAddress("w", "A", 2)));
  });
});

describe("PictureCache for card pictures", () => {
  function host(fetched: string[]): PictureCacheHost {
    let made = 0;
    return {
      fetch: async (url) => { fetched.push(url); return { ok: true, status: 200, blob: async () => bytes() }; },
      objectUrl: () => `blob:${++made}`,
      revoke: () => {},
      changed: () => {},
      now: () => 1_000,
    };
  }

  it("serves seeded bytes without fetching them back", async () => {
    const fetched: string[] = [];
    const cache = new PictureCache(host(fetched), 2000);
    cache.seed("w|A", bytes(), cardPreviewAddress("w", "A", 3));
    expect(cache.urlFor("w|A", cardPreviewAddress("w", "A", 3))).toBe("blob:1");
    await settle();
    expect(fetched).toEqual([]);
  });

  it("holds more than the pictures' limit when asked to", async () => {
    const fetched: string[] = [];
    const cache = new PictureCache(host(fetched), 2000);
    for (let i = 0; i < 100; i++) cache.urlFor(`w|${i}`, cardPreviewAddress("w", String(i), 1));
    await settle();
    expect(cache.size).toBe(100);
    // Asked again, every one is held: no evict-and-restore loop.
    for (let i = 0; i < 100; i++) cache.urlFor(`w|${i}`, cardPreviewAddress("w", String(i), 1));
    await settle();
    expect(fetched).toHaveLength(100);
  });

  it("says when a picture is failing so the card can draw live", async () => {
    const cache = new PictureCache({
      ...host([]),
      fetch: async () => ({ ok: false, status: 404, blob: async () => bytes() }),
    }, 2000);
    cache.urlFor("w|A", cardPreviewAddress("w", "A", 1));
    await settle();
    expect(cache.failing("w|A")).toBe(true);
  });
});
