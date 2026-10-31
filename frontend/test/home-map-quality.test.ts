// The map editor's 3D quality: Auto picks Low on weak hardware (4 threads
// or fewer, 4 GB or less, a touch device, slow first frames) and High
// elsewhere; the choice is kept in this browser; and what each quality
// turns on in the 3D look. The keys overlay's ? is read here too.

import { afterEach, describe, expect, it, vi } from "vitest";

import { HOME_MAP_EDIT_TOOLS, homeMapKeyGroups } from "../src/home-map/edit-page.js";
import { homeMapShortcut } from "../src/home-map/editor-view.js";
import { HOME_MAP_SHAPE_TOOLS } from "../src/home-map/mode-shape.js";
import {
  HOME_MAP_QUALITY_KEY,
  HOME_MAP_SLOW_FRAME_MS,
  homeMapAutoQuality,
  homeMapDeviceHints,
  homeMapMedianFrame,
  homeMapQualityOf,
  homeMapQualitySettings,
  homeMapReadQualityChoice,
  homeMapWriteQualityChoice,
} from "../src/home-map/quality.js";

/** A stand-in for `localStorage`. */
function storage(start: Record<string, string> = {}) {
  const kept = new Map(Object.entries(start));
  return {
    kept,
    getItem: (k: string) => kept.get(k) ?? null,
    setItem: (k: string, v: string) => void kept.set(k, v),
    removeItem: (k: string) => void kept.delete(k),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Auto's pick", () => {
  it("is High on a strong computer, and when the browser says nothing", () => {
    expect(homeMapAutoQuality({ cores: 10, memory: 8, coarse: false, slow: false })).toBe("high");
    expect(homeMapAutoQuality({})).toBe("high");
    // Safari gives no memory: the threads decide.
    expect(homeMapAutoQuality({ cores: 8, memory: undefined, coarse: false })).toBe("high");
  });

  it("is Low with 4 threads or fewer, 4 GB or less, a finger for a pointer, or slow first frames", () => {
    expect(homeMapAutoQuality({ cores: 4, memory: 8 })).toBe("low");
    expect(homeMapAutoQuality({ cores: 2 })).toBe("low");
    expect(homeMapAutoQuality({ cores: 12, memory: 4 })).toBe("low");
    expect(homeMapAutoQuality({ cores: 12, memory: 0.5 })).toBe("low");
    expect(homeMapAutoQuality({ cores: 12, memory: 8, coarse: true })).toBe("low");
    expect(homeMapAutoQuality({ cores: 12, memory: 8, slow: true })).toBe("low");
    expect(homeMapAutoQuality({ cores: 5, memory: 6 })).toBe("high");
  });

  it("counts a zero or nonsense hint for nothing", () => {
    expect(homeMapAutoQuality({ cores: 0, memory: 0 })).toBe("high");
  });

  it("is only Auto's: High and Low are what they say on any device", () => {
    const weak = { cores: 2, memory: 2, coarse: true, slow: true };
    expect(homeMapQualityOf("high", weak)).toBe("high");
    expect(homeMapQualityOf("low", { cores: 16, memory: 8 })).toBe("low");
    expect(homeMapQualityOf("auto", weak)).toBe("low");
  });

  it("reads the device from the browser", () => {
    vi.stubGlobal("navigator", { hardwareConcurrency: 4, deviceMemory: 8 });
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: q === "(pointer: coarse)" }));
    expect(homeMapDeviceHints()).toEqual({ cores: 4, memory: 8, coarse: true, slow: false });
    expect(homeMapDeviceHints(true).slow).toBe(true);
  });

  it("calls the middle of a few frames slow over 50 ms, one stall not counting", () => {
    expect(HOME_MAP_SLOW_FRAME_MS).toBe(50);
    expect(homeMapMedianFrame([16, 17, 400, 16, 18])).toBe(17);
    expect(homeMapMedianFrame([60, 70, 16, 80])).toBe(65);
    expect(homeMapMedianFrame([])).toBe(0);
  });
});

describe("the kept choice", () => {
  it("is Auto when nothing, or nothing it knows, is kept", () => {
    expect(homeMapReadQualityChoice(storage())).toBe("auto");
    expect(homeMapReadQualityChoice(storage({ [HOME_MAP_QUALITY_KEY]: "ultra" }))).toBe("auto");
    expect(homeMapReadQualityChoice(undefined)).toBe("auto");
    expect(homeMapReadQualityChoice({ getItem: () => { throw new Error("SecurityError"); } })).toBe("auto");
  });

  it("keeps High and Low, and Auto as no key", () => {
    const s = storage();
    homeMapWriteQualityChoice("low", s);
    expect(s.kept.get(HOME_MAP_QUALITY_KEY)).toBe("low");
    expect(homeMapReadQualityChoice(s)).toBe("low");
    homeMapWriteQualityChoice("high", s);
    expect(homeMapReadQualityChoice(s)).toBe("high");
    homeMapWriteQualityChoice("auto", s);
    expect(s.kept.has(HOME_MAP_QUALITY_KEY)).toBe(false);
    expect(() => homeMapWriteQualityChoice("low", { setItem: () => { throw new Error("QuotaExceeded"); }, removeItem: () => undefined })).not.toThrow();
  });
});

describe("what each quality draws", () => {
  it("is every effect at High, the pixel ratio at most 2", () => {
    expect(homeMapQualitySettings("high", 3)).toEqual({ samples: 4, ao: true, bloom: true, pixelRatio: 2, sunShadow: 2048, shadowBudget: 24, shadowLights: 8 });
    expect(homeMapQualitySettings("high", 1.5).pixelRatio).toBe(1.5);
    expect(homeMapQualitySettings("high", Number.NaN).pixelRatio).toBe(1);
  });

  it("leaves out the occlusion and glow at Low, with fewer pixels, samples and shadows", () => {
    expect(homeMapQualitySettings("low", 3)).toEqual({ samples: 2, ao: false, bloom: false, pixelRatio: 1, sunShadow: 1024, shadowBudget: 12, shadowLights: 4 });
  });
});

describe("the keys overlay's keys", () => {
  it("opens with ?, whatever Shift says, never while typing", () => {
    expect(homeMapShortcut({ key: "?", shiftKey: true }, false)).toBe("help");
    expect(homeMapShortcut({ key: "?" }, false)).toBe("help");
    expect(homeMapShortcut({ key: "?", shiftKey: true }, true)).toBeUndefined();
    expect(homeMapShortcut({ key: "?", metaKey: true }, false)).toBeUndefined();
  });

  it("lists every tool's key, the walls' tools too, and Cmd as this computer writes it", () => {
    const mac = homeMapKeyGroups(true);
    const listed = (title: string) => mac.find((g) => g.title === title)!.keys.map(([k]) => k);
    expect(listed("Tools")).toEqual(HOME_MAP_EDIT_TOOLS.map((t) => t.key.toUpperCase()));
    for (const t of HOME_MAP_SHAPE_TOOLS) expect(listed("A room's walls")).toContain(t.key.toUpperCase());
    expect(listed("Add")).toEqual(["A", "F"]);
    expect(listed("View")).toContain("?");
    expect(listed("Edit")).toContain("⌘Z");
    const pc = homeMapKeyGroups(false);
    expect(pc.find((g) => g.title === "Edit")!.keys.map(([k]) => k)).toContain("Ctrl+Z");
    expect(pc.find((g) => g.title === "Mouse")!.keys.map(([k]) => k)).toContain("Ctrl click");
  });
});
