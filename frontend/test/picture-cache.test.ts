// The picker's picture cache: one fetch per entity, held for the life of the
// page, so a grid of cards does not re-ask every camera in the house each time
// the dialog opens.

import { describe, expect, it, vi } from "vitest";
import { PICTURE_CACHE_MAX, PICTURE_RETRY_MS, PictureCache, type PictureCacheHost } from "../src/picture-cache.js";

/** A blob the cache will accept, without needing a DOM. */
function bytes(size = 3): Blob {
  return { size } as Blob;
}

function host(over: Partial<PictureCacheHost> = {}) {
  const fetched: string[] = [];
  const revoked: string[] = [];
  let made = 0;
  const clock = { at: 1_000 };
  const answer = over.fetch
    ?? (async () => ({ ok: true, status: 200, blob: async () => bytes() }));
  const base: PictureCacheHost = {
    objectUrl: () => `blob:${++made}`,
    revoke: (url) => { revoked.push(url); },
    changed: () => {},
    now: () => clock.at,
    ...over,
    // Recording wraps whatever answer the test asked for, so a test that
    // overrides `fetch` still counts its calls.
    fetch: (url) => { fetched.push(url); return answer(url); },
  };
  return { host: base, fetched, revoked, clock };
}

/** Let the cache's own fetch chain settle. */
const settle = () => new Promise((r) => setTimeout(r, 0));

describe("PictureCache", () => {
  it("draws nothing on the first ask and the held copy after", async () => {
    const { host: h, fetched } = host();
    const cache = new PictureCache(h);

    expect(cache.urlFor("camera.front", "/api/camera_proxy/camera.front?token=a")).toBeUndefined();
    await settle();

    expect(cache.urlFor("camera.front", "/api/camera_proxy/camera.front?token=a")).toBe("blob:1");
    expect(fetched).toEqual(["/api/camera_proxy/camera.front?token=a"]);
  });

  it("fetches once however many cards ask at the same time", async () => {
    const { host: h, fetched } = host();
    const cache = new PictureCache(h);

    // One card's preview, its watch art and its phone art, all in one render.
    cache.urlFor("camera.front", "/live?token=a");
    cache.urlFor("camera.front", "/live?token=a");
    cache.urlFor("camera.front", "/live?token=a");
    await settle();

    expect(fetched).toHaveLength(1);
  });

  it("keeps the held copy when Home Assistant rotates the token", async () => {
    const { host: h, fetched } = host();
    const cache = new PictureCache(h);

    cache.urlFor("camera.front", "/live?token=a");
    await settle();
    // The same camera, a new token: the address moved, the picture did not.
    expect(cache.urlFor("camera.front", "/live?token=b")).toBe("blob:1");
    expect(fetched).toHaveLength(1);
  });

  it("tells the host once the bytes have landed", async () => {
    const changed = vi.fn();
    const { host: h } = host({ changed });
    const cache = new PictureCache(h);

    cache.urlFor("camera.front", "/live");
    expect(changed).not.toHaveBeenCalled();
    await settle();
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it("drop makes the next ask fetch a new frame", async () => {
    const { host: h, fetched, revoked } = host();
    const cache = new PictureCache(h);

    cache.urlFor("camera.front", "/live");
    await settle();
    cache.drop("camera.front");
    expect(revoked).toEqual(["blob:1"]);

    expect(cache.urlFor("camera.front", "/live")).toBeUndefined();
    await settle();
    expect(cache.urlFor("camera.front", "/live")).toBe("blob:2");
    expect(fetched).toHaveLength(2);
  });

  it("leaves a camera that will not answer alone until the retry window is up", async () => {
    const { host: h, fetched, clock } = host({
      fetch: async () => ({ ok: false, status: 500, blob: async () => bytes() }),
    });
    const cache = new PictureCache(h);

    cache.urlFor("camera.off", "/live");
    await settle();
    // Every re-render of the grid asks again; none of them re-ask the camera.
    clock.at += 1_000;
    cache.urlFor("camera.off", "/live");
    clock.at += 1_000;
    cache.urlFor("camera.off", "/live");
    await settle();
    expect(fetched).toHaveLength(1);
  });

  it("tries a failed camera again once the window has passed", async () => {
    const { host: h, fetched, clock } = host({
      fetch: async () => ({ ok: false, status: 500, blob: async () => bytes() }),
    });
    const cache = new PictureCache(h);

    cache.urlFor("camera.off", "/live");
    await settle();
    clock.at += PICTURE_RETRY_MS + 1;
    cache.urlFor("camera.off", "/live");
    await settle();
    expect(fetched).toHaveLength(2);
  });

  it("refuses an empty answer rather than pinning a blank card", async () => {
    const { host: h } = host({
      fetch: async () => ({ ok: true, status: 200, blob: async () => bytes(0) }),
    });
    const cache = new PictureCache(h);

    cache.urlFor("camera.warming", "/live");
    await settle();
    expect(cache.size).toBe(0);
  });

  it("lets the oldest picture go once it is holding too many", async () => {
    const { host: h, revoked } = host();
    const cache = new PictureCache(h);

    for (let i = 0; i <= PICTURE_CACHE_MAX; i++) {
      cache.urlFor(`camera.c${i}`, "/live");
      await settle();
    }

    expect(cache.size).toBe(PICTURE_CACHE_MAX);
    // The first one asked for is the first one let go.
    expect(revoked).toEqual(["blob:1"]);
    expect(cache.urlFor("camera.c0", "/live")).toBeUndefined();
  });

  it("counts a hit as recent, so a card still on screen is not the one evicted", async () => {
    const { host: h, revoked } = host();
    const cache = new PictureCache(h);

    for (let i = 0; i < PICTURE_CACHE_MAX; i++) {
      cache.urlFor(`camera.c${i}`, "/live");
      await settle();
    }
    // The oldest is drawn again, which should move it out of the firing line.
    expect(cache.urlFor("camera.c0", "/live")).toBe("blob:1");

    cache.urlFor("camera.new", "/live");
    await settle();
    expect(revoked).toEqual(["blob:2"]);
    expect(cache.urlFor("camera.c0", "/live")).toBe("blob:1");
  });

  it("clear lets go of every address it handed out", async () => {
    const { host: h, revoked } = host();
    const cache = new PictureCache(h);

    cache.urlFor("camera.a", "/live");
    await settle();
    cache.urlFor("camera.b", "/live");
    await settle();

    cache.clear();
    expect(revoked).toEqual(["blob:1", "blob:2"]);
    expect(cache.size).toBe(0);
  });
});
