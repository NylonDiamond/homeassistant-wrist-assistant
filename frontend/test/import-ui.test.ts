// The arithmetic behind the import dialog: what to call the copy, what the
// pasted text turned out to be, and whether Import can do anything yet. The
// dialog itself is markup over these three answers, and nothing here needs a
// browser to check.

import { describe, expect, it } from "vitest";
import { seriesRequests } from "../src/ha-api.js";
import { type CustomComplicationConfig, type Element, newConfig, newElement } from "../src/model.js";
import { importProblem, importSummary, importTextFolded, remapEntities, suggestImportName } from "../src/transfer.js";

const taken = (...names: string[]) => new Set(names.map((n) => n.toLowerCase()));

describe("suggestImportName", () => {
  it("keeps the sender's name when this watch is free of it", () => {
    expect(suggestImportName("Energy today", taken("Kitchen"))).toBe("Energy today");
  });

  it("numbers a name the watch already has", () => {
    expect(suggestImportName("Energy today", taken("Energy today"))).toBe("Energy today 2");
  });

  it("keeps counting past the first suggestion", () => {
    expect(suggestImportName("Energy", taken("Energy", "Energy 2", "Energy 3"))).toBe("Energy 4");
  });

  it("matches without regard to case or the spaces around it", () => {
    expect(suggestImportName("  energy TODAY ", taken("Energy Today"))).toBe("energy TODAY 2");
  });

  it("has nothing to suggest for a document with no name", () => {
    expect(suggestImportName("   ", taken("Energy"))).toBe("");
  });
});

describe("importSummary", () => {
  const withElements = (cfg: CustomComplicationConfig, n: number) => {
    for (let i = 0; i < n; i += 1) cfg.elements.push(newElement("text"));
    return cfg;
  };

  it("counts one layer in the singular", () => {
    const cfg = withElements(newConfig("One", 0, ["rectangular"]), 1);
    expect(importSummary(cfg)).toBe("1 layer, rectangular");
  });

  it("names every shape the document has, in schema order", () => {
    const cfg = withElements(newConfig("Two", 0, ["circular", "rectangular"]), 4);
    expect(importSummary(cfg)).toBe("4 layers, rectangular and circular");
  });

  it("joins three shapes with a comma and an and", () => {
    const cfg = newConfig("Three", 0, ["rectangular", "circular", "corner"]);
    expect(importSummary(cfg)).toBe("0 layers, rectangular, circular and corner");
  });
});

describe("importProblem", () => {
  const base = { parsed: true, name: "Energy", taken: taken(), unchosen: 0 };

  it("asks for the text before anything else", () => {
    expect(importProblem({ ...base, parsed: false, name: "" })).toBe("Paste a complication first.");
  });

  it("asks for a name next", () => {
    expect(importProblem({ ...base, name: "  " })).toBe("Give it a name first.");
  });

  it("refuses a name the watch already has", () => {
    expect(importProblem({ ...base, taken: taken("energy") })).toBe("A complication on this watch already has that name.");
  });

  it("counts the entities still to pick, in the singular", () => {
    expect(importProblem({ ...base, unchosen: 1 })).toBe("One entity still needs choosing.");
  });

  it("counts them in the plural", () => {
    expect(importProblem({ ...base, unchosen: 3 })).toBe("3 entities still need choosing.");
  });

  it("says nothing when the dialog is answered", () => {
    expect(importProblem(base)).toBeUndefined();
  });
});

describe("importTextFolded", () => {
  const parsed = { ok: true as const, config: newConfig("Energy", 0), unknownKeys: [] };

  it("keeps the box open while there is nothing to read", () => {
    expect(importTextFolded(undefined, false)).toBe(false);
  });

  it("keeps text with a problem readable", () => {
    expect(importTextFolded({ ok: false, error: "Not a complication." }, false)).toBe(false);
  });

  it("folds text that parsed", () => {
    expect(importTextFolded(parsed as never, false)).toBe(true);
  });

  it("stays open once the reader asks to see it", () => {
    expect(importTextFolded(parsed as never, true)).toBe(false);
  });
});

describe("the import preview's history", () => {
  // A history bar chart as a share leaves it: reading a numbered placeholder.
  function sharedChart(): CustomComplicationConfig {
    const cfg = newConfig("Power", 0);
    const el = newElement("chart") as Extract<Element, { kind: "chart" }>;
    el.payload.value = { kind: { kind: "entityState", entityId: "sensor.shared_1", displayName: "Power", domain: "sensor" } };
    el.payload.historyMinutes = 360;
    el.payload.historyPoints = 24;
    cfg.elements.push(el);
    return cfg;
  }
  const inHouse = (ids: string[]) => (id: string) => ids.includes(id);

  it("asks nothing about a placeholder nobody has answered", () => {
    const wanted = seriesRequests(sharedChart(), inHouse(["sensor.grid_power"]));
    expect(wanted.history).toEqual({});
  });

  it("asks about the entity picked for the slot", () => {
    const map = new Map([["sensor.shared_1", { entityId: "sensor.grid_power", displayName: "Grid power", domain: "sensor" }]]);
    const wanted = seriesRequests(remapEntities(sharedChart(), map), inHouse(["sensor.grid_power"]));
    expect(Object.values(wanted.history)).toEqual([{ entity_id: "sensor.grid_power", minutes: 360, points: 24 }]);
  });

  it("gives the same question the same signature, and a new pick a new one", () => {
    const keep = inHouse(["sensor.grid_power", "sensor.solar"]);
    const pick = (id: string) => remapEntities(sharedChart(), new Map([["sensor.shared_1", { entityId: id, displayName: "", domain: "sensor" }]]));
    expect(seriesRequests(pick("sensor.solar"), keep).signature).toBe(seriesRequests(pick("sensor.solar"), keep).signature);
    expect(seriesRequests(pick("sensor.solar"), keep).signature).not.toBe(seriesRequests(pick("sensor.grid_power"), keep).signature);
  });
});
