// Which look each picture of the page editor's stage draws: One Look or the
// old tile look, by the newest app version among the devices of that kind
// that show the page (the devices named under the picture), not by the one
// device picked in Preview on.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { libraryDraftKey } from "../src/library/item-mode.js";
import { forgetWatchPagesDraft, keptWatchPagesDraft } from "../src/watch-pages/kept.js";
import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";
import "../src/watch-pages/page-editor.js";
import { type WatchPagePreviewInput, previewOneLook } from "../src/watch-pages/preview.js";
import { newestAppVersion } from "../src/version.js";
import { connectLibrary, libraryHome } from "./library-editor-home.js";

const U = (n: number) => `100C0000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
const HALL = U(1);
const tile = (n: number, entityId: string) => ({ id: U(100 + n), entityId, gridCol: 0, gridRow: n * 3, colSpan: 6, rowSpan: 3 });

const owner = (o: Partial<OwnerSummary>): OwnerSummary => ({
  owner_watch_id: "x", device_name: "Apple Watch", device_kind: "watch", paired_iphone_name: null, app_version: "3.0.0",
  screen_size: null, complication_count: 0, token: 3, applied_token: 3, is_orphan: false, ...o,
} as OwnerSummary);

const pagesDoc = (...pages: JsonObject[]): WatchPagesDocument => ({ schemaVersion: 1, pages });

let made = 0;

/**
 * The page editor on Hall in the library, previewed on the old watch (3.1.0),
 * both pictures side by side. `newWatchHasHall` puts Hall on a 3.2.0 watch
 * too; the 3.2.0 iPhone always has it.
 */
async function editor(newWatchHasHall: boolean) {
  const n = ++made;
  const oldWatch = `lv-w-old-${n}`;
  const newWatch = `lv-w-new-${n}`;
  const phone = `lv-p-${n}`;
  const owners = [
    owner({ owner_watch_id: oldWatch, device_name: "Old Watch", app_version: "3.1.0", main_house: true }),
    owner({ owner_watch_id: newWatch, device_name: "Apple Watch", app_version: "3.2.0" }),
    owner({ owner_watch_id: phone, device_name: "Jesse's iPhone", device_kind: "iphone", app_version: "3.2.0", phone_pages: true }),
  ];
  const hall = { id: HALL, name: "Hall", linkId: HALL, items: [tile(1, "light.hall")] };
  const ha = libraryHome({
    [`${oldWatch}/pages`]: pagesDoc(hall),
    [`${newWatch}/pages`]: newWatchHasHall ? pagesDoc(hall) : pagesDoc(),
    [`${phone}/pages`]: pagesDoc(hall),
  });
  const Ctor = customElements.get("wa-page-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  const ref = { kind: "pages" as const, id: HALL };
  el.hass = ha.hass;
  el.owners = owners;
  el.phones = true;
  el.libraryItem = ref;
  el.openedItem = ref;
  el.watchId = oldWatch;
  el.previewKind = "watch";
  el.sideBySide = true;
  const key = libraryDraftKey(ref);
  forgetWatchPagesDraft(key);
  el.renderInspector = () => "";
  el.renderRoot = { activeElement: null, querySelector: () => null };
  el.leaveTile = () => undefined;
  Object.defineProperty(el, "updateComplete", { value: Promise.resolve(true) });
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  await call<Promise<void>>("load", key);
  await connectLibrary(el);
  const page = (keptWatchPagesDraft(key)!.document.pages as JsonObject[])[0]!;
  const pages = [page];
  // The edited (watch) picture's input, and the iPhone's beside it.
  const watchInput = call<WatchPagePreviewInput>("previewInput", page, pages, { width: 205, height: 251 }, 1);
  const phoneInput = call<WatchPagePreviewInput>("companionInput", page, pages, watchInput, "iphone");
  return { el, call, watchInput, phoneInput };
}

describe("the look each picture draws", () => {
  it("takes the newest of several reported versions, an unreported one reading as new", () => {
    expect(newestAppVersion(["3.1.0", "3.2.0", "3.0.1"])).toBe("3.2.0");
    expect(newestAppVersion(["3.1.0", null])).toBeNull();
    expect(newestAppVersion([])).toBeUndefined();
  });

  it("draws One Look on both pictures when a 3.2.0 watch shows the page beside the 3.1.0 one picked in Preview on", async () => {
    const { call, watchInput, phoneInput } = await editor(true);
    expect(call("screenNames", "watch")).toEqual(["Old Watch", "Apple Watch"]);
    expect(call("screenLookVersion", "watch")).toBe("3.2.0");
    expect(watchInput.appVersion).toBe("3.2.0");
    expect(previewOneLook(watchInput)).toBe("watch");
    expect(previewOneLook(phoneInput)).toBe("phone");
  });

  it("draws the old look on the watch picture when only a 3.1.0 watch shows the page, and One Look on the iPhone's", async () => {
    const { call, watchInput, phoneInput } = await editor(false);
    expect(call("screenNames", "watch")).toEqual(["Old Watch"]);
    expect(call("screenLookVersion", "watch")).toBe("3.1.0");
    expect(previewOneLook(watchInput)).toBeUndefined();
    expect(previewOneLook(phoneInput)).toBe("phone");
  });
});
