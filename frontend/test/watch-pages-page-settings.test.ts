// A page's styling: the phone's codec for the decoration keys, the one
// decoration at a time rule with its clear and restore, the page title,
// Reset Page, the theme change with the phone's color remap, and the Solid
// or Gradient switch.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { findWatchPage } from "../src/watch-pages/edit.js";
import type { WatchPage, WatchPagesDocument } from "../src/watch-pages/model.js";
import {
  encodeWatchPageKeys,
  resetWatchPage,
  selectWatchPageDecoration,
  setWatchPageBackgroundColor,
  setWatchPageBackgroundColorMode,
  setWatchPageBrightness,
  setWatchPageGradientColors,
  setWatchPageOverlay,
  setWatchPagePattern,
  setWatchPagePatternOpacity,
  setWatchPageTheme,
  setWatchPageTitleIcon,
  setWatchPageTitleStyle,
  watchPageDecoration,
  watchPageDecorationMemory,
  watchPageModified,
  watchPageSettings,
  watchPageTheme,
  watchPageThemes,
  watchRemapThemeHex,
  watchSolidVersion,
} from "../src/watch-pages/page-settings-model.js";
import { watchPageTitleSwatches } from "../src/watch-pages/page-settings.js";
import { watchGradientOf, watchThemeRoleColors } from "../src/watch-pages/tile-new.js";
import { watchRemapSamples, watchStylingReset, watchStylingTheme, watchTitleSwatches } from "../src/watch-pages/tile-styling.js";

type Json = Record<string, unknown>;

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";

function sortedObject(o: Json): Json {
  return Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
}

/** A page as the phone encodes a new one, keys sorted. */
function page(extra: Json = {}): Json {
  return sortedObject({
    backgroundBrightness: 0.6,
    backgroundColor: "#000000",
    fullScreen: false,
    id: PAGE,
    items: [],
    name: "Living",
    pageTitleDisplayStyle: "none",
    pageTitleIcon: "house",
    pageTitleTextSize: "size10",
    themeOverride: "neonLagoon",
    useGradientColors: false,
    ...extra,
  });
}

function docWith(p: Json): WatchPagesDocument {
  return { schemaVersion: 1, pages: [p] };
}

function pageIn(document: WatchPagesDocument): WatchPage {
  return findWatchPage(document, PAGE)!;
}

const isSorted = (o: object) => Object.keys(o).every((k, i, all) => i === 0 || all[i - 1]! < k);

describe("the codec", () => {
  it("writes the pattern's keys only while the pattern is not none", () => {
    const on = encodeWatchPageKeys(page({ backgroundPattern: "dots" }) as WatchPage);
    expect(on).toMatchObject({ backgroundPattern: "dots", backgroundPatternColor: "#FFFFFF", backgroundPatternOpacity: 0.5, backgroundPatternScale: 1 });
    expect(isSorted(on)).toBe(true);
    const off = encodeWatchPageKeys({ ...on, backgroundPattern: "none" });
    for (const key of ["backgroundPattern", "backgroundPatternColor", "backgroundPatternOpacity", "backgroundPatternScale"]) expect(off).not.toHaveProperty(key);
  });

  it("writes the overlay's keys only while there is one, and the image's only with an image", () => {
    const on = encodeWatchPageKeys(page({ backgroundOverlay: "aurora" }) as WatchPage);
    expect(on).toMatchObject({ backgroundOverlayColor: "#FFFFFF", backgroundOverlaySpeed: 1, backgroundOverlayIntensity: 0.5, backgroundOverlaySize: 1 });
    const stray = encodeWatchPageKeys(page({ backgroundImageBlur: 3 }) as WatchPage);
    expect(stray).not.toHaveProperty("backgroundImageBlur");
  });

  it("leaves an encoded page as it is", () => {
    const p = page() as WatchPage;
    expect(encodeWatchPageKeys(p)).toBe(p);
  });
});

describe("one decoration at a time", () => {
  it("is derived from the page as the phone derives it", () => {
    expect(watchPageDecoration(page() as WatchPage)).toBe("none");
    expect(watchPageDecoration(page({ backgroundColor: "#112233" }) as WatchPage)).toBe("color");
    expect(watchPageDecoration(page({ backgroundOverlay: "rain", backgroundColor: "#112233" }) as WatchPage)).toBe("animation");
    expect(watchPageDecoration(page({ backgroundPattern: "dots", backgroundOverlay: "rain" }) as WatchPage)).toBe("pattern");
    expect(watchPageDecoration(page({ backgroundImageId: "preset_waves", backgroundPattern: "dots" }) as WatchPage)).toBe("image");
  });

  it("clears the rest and keeps a brightness only on Color", () => {
    const doc = docWith(page({ backgroundColor: "#112233", backgroundBrightness: 0.9 }));
    const pattern = selectWatchPageDecoration(doc, PAGE, "pattern");
    const p = pageIn(pattern.document);
    expect(p.backgroundColor).toBe("#000000");
    expect(p.backgroundBrightness).toBe(watchStylingReset("page").backgroundBrightness);
    expect(p).not.toHaveProperty("backgroundPattern");
    // Back to Color: the remembered color and brightness return.
    const color = selectWatchPageDecoration(pattern.document, PAGE, "color", { from: "pattern", memory: pattern.memory });
    expect(pageIn(color.document)).toMatchObject({ backgroundColor: "#112233", backgroundBrightness: 0.9 });
  });

  it("remembers a pattern while another decoration is shown", () => {
    const doc = docWith(page({ backgroundPattern: "stripes", backgroundPatternOpacity: 0.8, backgroundPatternColor: "#FF0000", backgroundPatternScale: 2 }));
    const anim = selectWatchPageDecoration(doc, PAGE, "animation");
    expect(pageIn(anim.document)).not.toHaveProperty("backgroundPattern");
    const back = selectWatchPageDecoration(anim.document, PAGE, "pattern", { from: "animation", memory: anim.memory });
    // Every key comes back: the phone's clear sets the pattern to none and
    // leaves its color and size in the page.
    expect(pageIn(back.document)).toMatchObject({ backgroundPattern: "stripes", backgroundPatternOpacity: 0.8, backgroundPatternColor: "#FF0000", backgroundPatternScale: 2 });
  });

  // A round trip through another decoration gives back the page it started
  // from, as on the phone.
  const roundTrips: [string, Json, "color" | "pattern" | "animation", "none" | "color" | "pattern" | "animation"][] = [
    ["Pattern to Color and back", { backgroundPattern: "waves", backgroundPatternColor: "#D8A3A0", backgroundPatternOpacity: 0.3, backgroundPatternScale: 2.5 }, "pattern", "color"],
    ["Animation to None and back", { backgroundOverlay: "snow", backgroundOverlayColor: "#AEBFD4", backgroundOverlaySpeed: 2, backgroundOverlayIntensity: 0.8, backgroundOverlaySize: 1.5 }, "animation", "none"],
    ["Color to Pattern and back", { backgroundColor: "#101238", backgroundBrightness: 0.9 }, "color", "pattern"],
  ];
  for (const [name, extra, segment, other] of roundTrips) {
    it(`round trip: ${name}`, () => {
      const doc = docWith(page(extra));
      const away = selectWatchPageDecoration(doc, PAGE, other);
      expect(pageIn(away.document)).not.toEqual(pageIn(doc));
      const back = selectWatchPageDecoration(away.document, PAGE, segment, { from: other, memory: away.memory });
      expect(pageIn(back.document)).toEqual(pageIn(doc));
      expect(Object.keys(pageIn(back.document))).toEqual(Object.keys(pageIn(doc)));
    });
  }

  it("seeds its memory from the page", () => {
    expect(watchPageDecorationMemory(page({ backgroundPattern: "dots" }) as WatchPage).pattern).toEqual({
      backgroundPattern: "dots", backgroundPatternColor: "#FFFFFF", backgroundPatternOpacity: 0.5, backgroundPatternScale: 1,
    });
    expect(watchPageDecorationMemory(page({ backgroundColor: undefined }) as WatchPage).color.backgroundColor).toBeUndefined();
  });

  it("drops an image when leaving it, as the phone does, and never picks one", () => {
    const doc = docWith(page({ backgroundImageId: "preset_waves", backgroundImageOpacity: 1, backgroundImageBlur: 0, backgroundImageFit: "fill" }));
    const p = pageIn(selectWatchPageDecoration(doc, PAGE, "none").document);
    for (const key of ["backgroundImageId", "backgroundImageOpacity", "backgroundImageBlur", "backgroundImageFit"]) expect(p).not.toHaveProperty(key);
    const plain = docWith(page());
    expect(selectWatchPageDecoration(plain, PAGE, "image").document).toBe(plain);
  });

  it("a pick that is the shown decoration changes nothing", () => {
    const doc = docWith(page());
    expect(selectWatchPageDecoration(doc, PAGE, "none").document).toBe(doc);
  });
});

describe("Color, Pattern and Animation rows", () => {
  it("color and its Solid or Gradient form; black stays black", () => {
    const doc = docWith(page());
    const blue = setWatchPageBackgroundColor(doc, PAGE, "#1b2a41");
    expect(pageIn(blue).backgroundColor).toBe("#1B2A41");
    const g = setWatchPageBackgroundColorMode(blue, PAGE, "gradient");
    expect(pageIn(g).backgroundColor).toBe(watchGradientOf("#1B2A41"));
    expect(pageIn(setWatchPageBackgroundColorMode(g, PAGE, "solid")).backgroundColor).toBe("#1B2A41");
    expect(setWatchPageBackgroundColorMode(doc, PAGE, "gradient")).toBe(doc);
  });

  it("brightness in hundredths from 0 to 1.5", () => {
    const doc = docWith(page());
    expect(pageIn(setWatchPageBrightness(doc, PAGE, 1.234)).backgroundBrightness).toBe(1.23);
    expect(setWatchPageBrightness(doc, PAGE, 1.6)).toBe(doc);
  });

  it("a pattern's rows need a pattern", () => {
    const doc = docWith(page());
    expect(setWatchPagePatternOpacity(doc, PAGE, 0.7)).toBe(doc);
    const dots = setWatchPagePattern(doc, PAGE, "dots");
    expect(pageIn(setWatchPagePatternOpacity(dots, PAGE, 0.7)).backgroundPatternOpacity).toBe(0.7);
    expect(pageIn(setWatchPagePattern(dots, PAGE, "none"))).not.toHaveProperty("backgroundPatternOpacity");
    expect(pageIn(setWatchPageOverlay(doc, PAGE, "snow")).backgroundOverlay).toBe("snow");
  });
});

describe("the page title", () => {
  it("style and icon, None as an empty icon", () => {
    const doc = docWith(page());
    expect(pageIn(setWatchPageTitleStyle(doc, PAGE, "pill")).pageTitleDisplayStyle).toBe("pill");
    expect(setWatchPageTitleStyle(doc, PAGE, "huge")).toBe(doc);
    expect(pageIn(setWatchPageTitleIcon(doc, PAGE, "")).pageTitleIcon).toBe("");
  });

  it("the color swatches: the fixed ones, then eight of the theme's, each once", () => {
    const sw = watchPageTitleSwatches("neonLagoon");
    expect(sw.slice(0, watchTitleSwatches().length)).toEqual(watchTitleSwatches());
    expect(new Set(sw.map((h) => h.toUpperCase())).size).toBe(sw.length);
    expect(sw.length).toBeLessThanOrEqual(watchTitleSwatches().length + 8);
  });
});

describe("Reset Page", () => {
  it("writes the phone's keys, the title icon as house, keeps the theme", () => {
    const doc = docWith(page({
      backgroundColor: "#112233", backgroundBrightness: 1.2, backgroundPattern: "dots", pageTitleDisplayStyle: "glass",
      pageTitleIcon: "star", pageTitleTextColor: "#FFFFFF", themeOverride: "ember", useGradientColors: true,
    }));
    expect(watchPageModified(doc, PAGE)).toBe(true);
    const p = pageIn(resetWatchPage(doc, PAGE));
    expect(p).toMatchObject({ backgroundColor: "#000000", backgroundBrightness: 0.6, pageTitleDisplayStyle: "none", pageTitleIcon: "house", themeOverride: "ember", useGradientColors: true });
    for (const key of ["pageTitleTextColor", "backgroundPattern", "backgroundPatternColor"]) expect(p).not.toHaveProperty(key);
    expect(isSorted(p)).toBe(true);
  });

  it("an untouched page is not modified, with house or with no icon, and a reset leaves it", () => {
    for (const p of [page(), page({ pageTitleIcon: undefined })]) {
      const doc = docWith(p);
      expect(watchPageModified(doc, PAGE)).toBe(false);
      expect(resetWatchPage(doc, PAGE, { keepImage: true })).toBe(doc);
      expect(resetWatchPage(doc, PAGE)).toBe(doc);
    }
    expect(watchPageModified(docWith(page({ pageTitleIcon: "" })), PAGE)).toBe(true);
    // Through the draft: no step, nothing to save.
    const doc = docWith(page({ pageTitleIcon: undefined }));
    const draft = new WatchPagesDraft(doc, 1);
    expect(draft.apply(resetWatchPage(draft.document, PAGE, { keepImage: true }))).toBe(false);
    expect(draft.dirty).toBe(false);
    expect(draft.canUndo).toBe(false);
  });

  it("drops an image as the phone does, or keeps it for the panel's own Reset", () => {
    const doc = docWith(page({ backgroundImageId: "preset_sand", backgroundImageOpacity: 0.4, backgroundImageBlur: 2, backgroundImageFit: "fit" }));
    expect(pageIn(resetWatchPage(doc, PAGE))).not.toHaveProperty("backgroundImageId");
    expect(pageIn(resetWatchPage(doc, PAGE, { keepImage: true }))).toMatchObject({ backgroundImageId: "preset_sand", backgroundImageOpacity: 0.4 });
  });
});

describe("the theme remap", () => {
  it("matches the phone's samples", () => {
    const samples = watchRemapSamples();
    expect(samples.length).toBeGreaterThan(0);
    for (const s of samples) expect(watchRemapThemeHex(s.hex, s.to) ?? null, `${s.hex} to ${s.to}`).toBe(s.result);
  });

  it("keeps black and white, takes a gradient end by end", () => {
    expect(watchRemapThemeHex("#ffffff", "ember")).toBe("#FFFFFF");
    expect(watchRemapThemeHex("#000000", "ember")).toBe("#000000");
    const light = (t: string) => watchThemeRoleColors(t).entityLight!;
    expect(watchRemapThemeHex(light("neonLagoon"), "ember")).toBe(light("ember"));
    expect(watchRemapThemeHex(`GRADIENT|${light("neonLagoon")}|#123457`, "ember")).toBe(`GRADIENT|${light("ember")}|#123457`);
    expect(watchRemapThemeHex("#123457", "ember")).toBeUndefined();
  });

  it("maps a swatch to the same place in the target's list", () => {
    const from = watchStylingTheme("neonLagoon")!.backgroundSwatchHexes;
    const to = watchStylingTheme("ember")!.backgroundSwatchHexes;
    const i = from.findIndex((h) => watchRemapThemeHex(h, "ember") === to[from.indexOf(h)]?.toUpperCase());
    expect(i).toBeGreaterThanOrEqual(0);
  });
});

describe("a theme change", () => {
  const light = (t: string) => watchThemeRoleColors(t).entityLight!;
  const tiles = () => [
    sortedObject({ id: "A", entityId: "light.a", color: light("neonLagoon"), borderColor: "#THEME", overlayColor: "#FFFFFF", patternColor: light("neonLagoon"), stateColors: { on: light("neonLagoon") } }),
    sortedObject({ id: "B", entityId: "light.b", color: "#RAINBOW", animationColor: light("neonLagoon"), borderColor: light("neonLagoon") }),
  ];

  it("remaps tile colors, leaves the others, and writes the theme", () => {
    const doc = docWith(page({ items: tiles(), backgroundColor: light("neonLagoon") }));
    const p = pageIn(setWatchPageTheme(doc, PAGE, "ember"));
    const [a, b] = p.items as Json[];
    expect(a).toMatchObject({ color: light("ember"), borderColor: "#THEME", overlayColor: "#FFFFFF", patternColor: light("neonLagoon"), stateColors: { on: light("neonLagoon") } });
    expect(b).toMatchObject({ color: "#RAINBOW", animationColor: light("ember"), borderColor: light("ember") });
    expect(p.backgroundColor).toBe(light("ember"));
    expect(p.themeOverride).toBe("ember");
    expect(watchPageTheme(p)).toBe("ember");
  });

  it("with gradient colors on, writes every tile color again as a gradient", () => {
    const doc = docWith(page({ items: tiles(), useGradientColors: true }));
    const [a, b] = pageIn(setWatchPageTheme(doc, PAGE, "ember")).items as Json[];
    expect(a!.color).toBe(watchGradientOf(light("ember")));
    expect(b!.color).toBe("#RAINBOW");
    expect(b!.animationColor).toBe(watchGradientOf(light("ember")));
  });

  it("a theme the app does not have is refused; the order is the phone's", () => {
    const doc = docWith(page());
    expect(setWatchPageTheme(doc, PAGE, "vaporwave")).toBe(doc);
    expect(watchPageThemes()[0]).toBe("midnight");
    expect(watchPageTheme(page({ themeOverride: undefined }) as WatchPage)).toBe("neonLagoon");
  });

  it("adds a missing themeOverride at its sorted place", () => {
    const p = page();
    delete p.themeOverride;
    const out = pageIn(setWatchPageTheme(docWith(p), PAGE, "forest"));
    expect(out.themeOverride).toBe("forest");
    expect(isSorted(out)).toBe(true);
  });
});

describe("the Solid or Gradient switch", () => {
  it("rewrites every tile's color and effect color, not rainbow, not borders", () => {
    const items = [
      sortedObject({ id: "A", entityId: "light.a", color: "#FFD60A", animationColor: "#FF0000", borderColor: "#00FF00" }),
      sortedObject({ id: "B", entityId: "light.b", color: "#RAINBOW" }),
    ];
    const on = setWatchPageGradientColors(docWith(page({ items })), PAGE, true);
    const p = pageIn(on);
    expect(p.useGradientColors).toBe(true);
    const [a, b] = p.items as Json[];
    expect(a).toMatchObject({ color: watchGradientOf("#FFD60A"), animationColor: watchGradientOf("#FF0000"), borderColor: "#00FF00" });
    expect(b!.color).toBe("#RAINBOW");
    const off = pageIn(setWatchPageGradientColors(on, PAGE, false));
    expect((off.items as Json[])[0]).toMatchObject({ color: "#FFD60A", animationColor: "#FF0000" });
    expect(watchSolidVersion(" #RAINBOW")).toBe(" #RAINBOW");
  });
});

describe("a rebase after a theme change, the gradient switch or a pattern switched off", () => {
  type Case = { page: Json; expected: Json };
  const load = (name: string) => JSON.parse(readFileSync(join(__dirname, "fixtures-pages", "settings", `${name}.json`), "utf8")) as Case;
  const docOf = (p: Json): WatchPagesDocument => ({ schemaVersion: 1, pages: [structuredClone(p)] });
  const only = (d: WatchPagesDocument) => (d.pages as Json[])[0]!;
  const tilesOf = (d: WatchPagesDocument) => only(d).items as Json[];
  /** The panel's draft made from `base` and edited to `local`, rebased onto
   * `server`. */
  const rebased = (base: WatchPagesDocument, local: WatchPagesDocument, server: WatchPagesDocument) => {
    const draft = new WatchPagesDraft(base, 1);
    draft.apply(local);
    draft.rebase(server, 2);
    return draft.document;
  };
  const inForm = (d: WatchPagesDocument, gradient: boolean) =>
    tilesOf(d).flatMap((t) => [t.color, t.animationColor]).filter((c): c is string => typeof c === "string" && c !== "#RAINBOW")
      .every((c) => c.startsWith("GRADIENT|") === gradient);

  it("B: the panel turned gradient on while the phone changed a tile and added one", () => {
    const c = load("gradient-colors-on");
    const base = docOf(c.page);
    const id = String(c.page.id);
    const local = setWatchPageGradientColors(base, id, true);
    const server = structuredClone(base);
    tilesOf(server)[0]!.color = "#123456";
    const added = { ...structuredClone(tilesOf(base)[0]!), id: "C3A0E000-0000-4000-8000-0000000000AB", color: "#00FF00" };
    tilesOf(server).push(added);
    const merged = rebased(base, local, server);
    expect(only(merged).useGradientColors).toBe(true);
    expect(tilesOf(merged).find((t) => t.id === added.id)!.color).toBe(watchGradientOf("#00FF00"));
    expect(inForm(merged, true)).toBe(true);
  });

  it("C: the phone turned gradient on while the panel changed the theme", () => {
    const c = load("gradient-colors-on");
    const base = docOf(c.page);
    const id = String(c.page.id);
    const server = docOf(c.expected);
    const local = setWatchPageTheme(base, id, "ember");
    const merged = rebased(base, local, server);
    expect(only(merged)).toMatchObject({ useGradientColors: true, themeOverride: "ember" });
    expect(inForm(merged, true)).toBe(true);
    // The same tiles as the phone gives doing both, one after the other.
    expect(tilesOf(merged)).toEqual(tilesOf(setWatchPageTheme(server, id, "ember")));
  });

  it("C turned round: the phone turned gradient off while the panel changed the theme", () => {
    const c = load("gradient-colors-on");
    const id = String(c.page.id);
    const base = docOf(c.expected);
    const server = setWatchPageGradientColors(base, id, false);
    const local = setWatchPageTheme(base, id, "ember");
    const merged = rebased(base, local, server);
    expect(only(merged)).toMatchObject({ useGradientColors: false, themeOverride: "ember" });
    expect(inForm(merged, false)).toBe(true);
  });

  it("a tile the phone added meanwhile is remapped to the panel's new theme", () => {
    const c = load("theme-change");
    const base = docOf(c.page);
    const id = String(c.page.id);
    const light = (t: string) => watchThemeRoleColors(t).entityLight!;
    const from = watchPageTheme(only(base) as WatchPage);
    const to = watchPageThemes().find((t) => t !== from)!;
    const local = setWatchPageTheme(base, id, to);
    const server = structuredClone(base);
    tilesOf(server).push({ id: "C3A0E000-0000-4000-8000-0000000000AC", entityId: "light.new", color: light(from), borderColor: light(from) });
    const merged = rebased(base, local, server);
    expect(tilesOf(merged).at(-1)).toMatchObject({ color: light(to), borderColor: light(to) });
  });

  it("D: the phone switched the pattern off while the panel changed its opacity", () => {
    const c = load("page-pattern-opacity");
    const base = docOf(c.page);
    const id = String(c.page.id);
    const local = setWatchPagePatternOpacity(base, id, 0.35);
    const server = structuredClone(base);
    for (const k of ["backgroundPattern", "backgroundPatternColor", "backgroundPatternOpacity", "backgroundPatternScale"]) delete only(server)[k];
    const merged = rebased(base, local, server);
    for (const k of ["backgroundPattern", "backgroundPatternColor", "backgroundPatternOpacity", "backgroundPatternScale"]) expect(only(merged)).not.toHaveProperty(k);
  });

  it("a clean draft still holds the server's very document", () => {
    const c = load("gradient-colors-on");
    const base = docOf(c.page);
    const server = docOf(c.expected);
    const draft = new WatchPagesDraft(base, 1);
    draft.rebase(server, 2);
    expect(draft.document).toBe(server);
  });
});

describe("readers", () => {
  it("read an absent key as the phone decodes it", () => {
    const s = watchPageSettings(page({ backgroundColor: undefined, pageTitleIcon: undefined }) as WatchPage);
    expect(s).toMatchObject({ theme: "neonLagoon", decoration: "none", backgroundColor: undefined, brightness: 0.6, pattern: "none", patternOpacity: 0.5, titleIcon: "house", titleSize: "size10" });
  });
});
