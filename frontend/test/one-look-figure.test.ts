// A tile's number with smaller decimals: the same table as the app's
// `OneLookTextTests.decimalsAreASmallRun`.
import { describe, expect, it } from "vitest";

import { ONE_LOOK_FRACTION_SCALE, oneLookFigureRuns, oneLookFigureWidth, type TextMeasurer } from "../src/watch-pages/one-look/text.js";

const cases: [string, [string, boolean][]][] = [
  ["15.6", [["15", false], [".6", true]]],
  ["1,245.8", [["1,245", false], [".8", true]]],
  ["21.4°", [["21", false], [".4", true], ["°", false]]],
  ["20.5–24.5°", [["20", false], [".5", true], ["–24", false], [".5", true], ["°", false]]],
  ["12.38", [["12", false], [".38", true]]],
  ["87", [["87", false]]],
  ["4:32", [["4:32", false]]],
  [".5", [[".5", false]]],
  ["5.", [["5.", false]]],
  ["—", [["—", false]]],
];

describe("One Look figure runs", () => {
  it.each(cases)("splits %s", (figure, runs) => {
    expect(oneLookFigureRuns(figure)).toEqual(runs.map(([text, small]) => ({ text, small })));
  });

  it("measures the decimals smaller", () => {
    const fake: TextMeasurer = { width: (text, size) => [...text].length * size * 0.55 };
    expect(oneLookFigureWidth("15.6", 20, 0, fake)).toBeCloseTo(2 * 20 * 0.55 + 2 * 20 * ONE_LOOK_FRACTION_SCALE * 0.55, 6);
  });
});
