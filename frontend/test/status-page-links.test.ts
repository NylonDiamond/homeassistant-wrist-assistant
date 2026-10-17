// Linked status pages, the Info pages of the Pages tab: the link call's
// kind, the status page editor's Devices menu, its Not on this list, and
// taking a status page off another device.

import { describe, expect, it } from "vitest";

import { type HassLike, linkWatchPages } from "../src/ha-api.js";
import type { JsonObject } from "../src/watch-pages/model.js";

function recorder() {
  const sent: JsonObject[] = [];
  const hass = {
    connection: {
      sendMessagePromise: (msg: JsonObject) => {
        sent.push(msg);
        return Promise.resolve({ targets: {}, link_ids: {} });
      },
    },
  } as unknown as HassLike;
  return { hass, sent };
}

describe("the link call", () => {
  it("sends no kind for pages, as it always did", async () => {
    const { hass, sent } = recorder();
    await linkWatchPages(hass, "w1", ["A"], ["p1"]);
    expect(sent[0]).toEqual({ type: "wrist_assistant/watch_pages/link", source_id: "w1", page_ids: ["A"], targets: ["p1"] });
  });

  it("names the kind for status pages", async () => {
    const { hass, sent } = recorder();
    await linkWatchPages(hass, "w1", ["S"], ["p1", "w2"], "status_pages");
    expect(sent[0]).toEqual({ type: "wrist_assistant/watch_pages/link", source_id: "w1", page_ids: ["S"], targets: ["p1", "w2"], kind: "status_pages" });
  });
});
