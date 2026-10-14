import { describe, expect, it } from "vitest";
import type { PickerCopy, PickerListRow } from "../src/pickerRows.js";
import { COMPLICATIONS_PATH, panelPrefix, tabOfRoute, watchScreenOf } from "../src/shell.js";
import { LIBRARY_OWNER_ID } from "../src/version.js";
import { watchRouteOwner } from "../src/watch-pick.js";
import {
  WATCH_COMPLICATIONS_PATH, isWatchComplicationsRoute, splitForWatch, watchComplicationsLead, watchComplicationsRouteOwner,
} from "../src/watch-complications.js";

const at = (path: string) => ({ prefix: "/wrist-assistant", path });

function row(key: string, ...owners: string[]): PickerListRow<null> {
  const copies: PickerCopy<null>[] = owners.map((ownerId, i) => ({ ownerId, id: `${key}${i}`, slot: i, name: key, item: null }));
  return { key, name: key, copies, open: copies[0]! };
}

describe("the Watch app's Complications screen", () => {
  it("is a watch screen with its own address, apart from the Complications tab", () => {
    expect(isWatchComplicationsRoute(at(WATCH_COMPLICATIONS_PATH))).toBe(true);
    expect(isWatchComplicationsRoute(at(`${WATCH_COMPLICATIONS_PATH}/w1`))).toBe(true);
    expect(isWatchComplicationsRoute(at(COMPLICATIONS_PATH))).toBe(false);
    expect(tabOfRoute(at("/watch-complications/w1"))).toBe("watch");
    expect(watchScreenOf(at("/watch-complications"))?.id).toBe("watch-complications");
    expect(tabOfRoute(at("/complications"))).toBe("complications");
  });

  it("reads the watch from its address", () => {
    expect(watchComplicationsRouteOwner(at("/watch-complications/A1%2FB2"))).toBe("A1/B2");
    expect(watchComplicationsRouteOwner(at("/watch-complications"))).toBeUndefined();
    expect(watchRouteOwner(at("/watch-complications/w1"))).toBe("w1");
  });

  it("takes the whole screen address off the panel's own address", () => {
    expect(panelPrefix(undefined, "/wrist-assistant/watch-complications/w1")).toBe("/wrist-assistant");
  });

  it("puts the watch's designs first, and the rest under it with the shelf last", () => {
    const rows = [row("a", "phone"), row("b", "w1", "phone"), row("c", LIBRARY_OWNER_ID), row("d", "w2"), row("e", "w1")];
    const { on, off } = splitForWatch(rows, "w1");
    expect(on.map((r) => r.key)).toEqual(["b", "e"]);
    expect(off.map((r) => r.key)).toEqual(["a", "d", "c"]);
  });

  it("puts everything under Not on this watch with no watch", () => {
    const { on, off } = splitForWatch([row("a", "w1")], undefined);
    expect(on).toEqual([]);
    expect(off.map((r) => r.key)).toEqual(["a"]);
  });

  it("says how many are on the watch, or how to add one", () => {
    expect(watchComplicationsLead(1, "Jesse's watch")).toBe("1 complication is on Jesse's watch.");
    expect(watchComplicationsLead(3, "Jesse's watch")).toBe("3 complications are on Jesse's watch.");
    expect(watchComplicationsLead(0, "Jesse's watch")).toBe("Nothing is on Jesse's watch yet. Open a card's Devices menu to add it here.");
  });
});
