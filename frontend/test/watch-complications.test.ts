import { describe, expect, it } from "vitest";
import { COMPLICATIONS_PATH, panelPrefix, tabOfRoute, watchScreenOf } from "../src/shell.js";
import { watchRouteOwner } from "../src/watch-pick.js";
import { WATCH_COMPLICATIONS_PATH, isWatchComplicationsRoute, watchComplicationsRouteOwner } from "../src/watch-complications.js";

const at = (path: string) => ({ prefix: "/wrist-assistant", path });

describe("the old address of a watch's Complications screen", () => {
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
});
