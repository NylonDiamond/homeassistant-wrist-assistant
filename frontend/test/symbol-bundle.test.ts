// The symbol pictures the panel ships (symbol-icons.json.gz, built by
// build-icons.mjs): the Speak tile's `message.and.waveform` is there under
// its own name in both forms, in the shape the devices draw today (one
// bubble with the waves over its lower right), so the panel needs no alias
// to an older drawing. The system draws `message.and.waveform` as its newer
// name `message.badge.waveform`, so the two are one drawing here too.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";

import { describe, expect, it } from "vitest";

const file = join(__dirname, "..", "..", "custom_components", "wrist_assistant", "frontend", "symbol-icons.json.gz");
const shipped = JSON.parse(gunzipSync(readFileSync(file)).toString("utf8")) as Record<string, [string, string]>;

/** A symbol's viewBox width and height. */
function box(name: string): [number, number] {
  const [, , w, h] = shipped[name]![1].split(" ").map(Number);
  return [w!, h!];
}

describe("the shipped symbols", () => {
  it("carry the Speak tile's symbol under its own name, outline and fill", () => {
    for (const name of ["message.and.waveform", "message.and.waveform.fill"]) expect(shipped[name], name).toBeDefined();
    expect(shipped["message.and.waveform"]).toEqual(shipped["message.badge.waveform"]);
    expect(shipped["message.and.waveform.fill"]).toEqual(shipped["message.badge.waveform.fill"]);
  });

  it("draw it at the set's own size, a little shorter than the light bulb and wider than tall", () => {
    // At 22 points the light bulb is 23.68 tall and the Speak symbol 22.18
    // (the system's own drawing, scaled as the bulb is).
    const [w, h] = box("message.and.waveform");
    expect(box("lightbulb.fill")[1]).toBeCloseTo(23.68, 2);
    expect(h).toBeCloseTo(22.18, 1);
    expect(w / h).toBeCloseTo(56.84 / 46.76, 2);
  });
});
