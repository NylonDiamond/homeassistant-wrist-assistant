// Four small matters of look, each held in both skins through the panel's
// own tokens: no scroll bar between the canvas and the inspector, an Advanced
// rules editor whose boxes, buttons and words read apart, device chips that
// wear their person's color, and a green Save while there is something to
// save. The contrast checks resolve the real token values (and the
// color-mix() recipes over them) out of the sheets, so a token that drifts
// below 4.5:1 fails here rather than on someone's screen.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { CSSResultGroup } from "lit";
import { describe, expect, it } from "vitest";

import { canvasStyles, columnStyles } from "../src/editor-chrome.js";
import { formButtonStyles } from "../src/form-styles.js";
import { WristAssistantPanel } from "../src/panel.js";

// ── reading the sheets ─────────────────────────────────────────────────────

function cssOf(group: CSSResultGroup | undefined): string {
  if (group === undefined) return "";
  if (Array.isArray(group)) return group.map((g) => cssOf(g as CSSResultGroup)).join("\n");
  return (group as { cssText: string }).cssText;
}

const panelCss = cssOf(WristAssistantPanel.styles).replace(/\/\*[\s\S]*?\*\//g, "");

/** Every declaration of every rule whose selector is exactly `selector`, in
 * sheet order, later ones winning. Innermost braces only, so a rule inside an
 * @media block is read by its own selector. */
function decls(css: string, selector: string): Record<string, string> {
  const out: Record<string, string> = {};
  const plain = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of plain.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (m[1]!.trim() !== selector) continue;
    for (const d of m[2]!.split(/;(?![^(]*\))/)) {
      const at = d.indexOf(":");
      if (at < 0) continue;
      out[d.slice(0, at).trim()] = d.slice(at + 1).trim();
    }
  }
  return out;
}

/** The custom properties of a declaration list, without their dashes. */
function tokensOf(list: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(list).filter(([k]) => k.startsWith("--")).map(([k, v]) => [k.slice(2), v]));
}

const lightTokens = tokensOf(decls(panelCss, ":host"));
const darkTokens = { ...lightTokens, ...tokensOf(decls(panelCss, ":host([dark])")) };
const skins = [["light", lightTokens], ["dark", darkTokens]] as const;

// ── resolving a color ──────────────────────────────────────────────────────

type RGB = [number, number, number];

/** Split at the commas that are not inside parentheses. */
function args(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

/** A hex, a var() or an sRGB color-mix() of those, as 0..255 channels. */
function color(expr: string, tokens: Record<string, string>): RGB {
  const e = expr.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(e);
  if (hex) {
    const h = hex[1]!.length === 3 ? [...hex[1]!].map((c) => c + c).join("") : hex[1]!;
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
  }
  const v = /^var\(--([\w-]+)(?:,\s*([\s\S]+))?\)$/.exec(e);
  if (v) {
    const value = tokens[v[1]!] ?? v[2];
    if (value === undefined) throw new Error(`no token --${v[1]}`);
    return color(value, tokens);
  }
  const mix = /^color-mix\(([\s\S]+)\)$/.exec(e);
  if (mix) {
    const [space, a, b] = args(mix[1]!);
    expect(space).toBe("in srgb");
    const part = (s: string) => {
      const m = /^([\s\S]+?)\s+(\d+(?:\.\d+)?)%$/.exec(s);
      return m ? { c: m[1]!, p: Number(m[2]) / 100 } : { c: s, p: undefined };
    };
    const pa = part(a!);
    const pb = part(b!);
    const wa = pa.p ?? (pb.p !== undefined ? 1 - pb.p : 0.5);
    const ca = color(pa.c, tokens);
    const cb = color(pb.c, tokens);
    return [0, 1, 2].map((i) => ca[i]! * wa + cb[i]! * (1 - wa)) as RGB;
  }
  throw new Error(`cannot read the color ${e}`);
}

function luminance([r, g, b]: RGB): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

// ── 1. the canvas column draws no scroll bar ───────────────────────────────

describe("the gap between the canvas and the inspector", () => {
  it("draws no scroll bar for the canvas column in any browser, and it still scrolls", () => {
    const css = columnStyles.cssText;
    expect(decls(css, ".column.canvas")["scrollbar-width"]).toBe("none");
    expect(decls(css, ".column.canvas::-webkit-scrollbar").display).toBe("none");
    // The column keeps the shared overflow, so a short window still scrolls it.
    expect(decls(css, ".column")["overflow-y"]).toBe("auto");
    expect(decls(css, ".column.canvas").overflow ?? decls(css, ".column.canvas")["overflow-y"]).toBeUndefined();
  });

  it("draws none for the stage inside it either, which still pans a zoomed face", () => {
    const css = canvasStyles.cssText;
    const stage = decls(css, ".stage-wrap > .stage");
    expect(stage.overflow).toBe("auto");
    expect(stage["scrollbar-width"]).toBe("none");
    expect(decls(css, ".stage-wrap > .stage::-webkit-scrollbar").display).toBe("none");
  });

  it("leaves the inspector's and the Layers list's own bars alone", () => {
    for (const css of [columnStyles.cssText, canvasStyles.cssText, panelCss]) {
      for (const sel of [".column.inspector", ".column.left", ".layers", ".column"]) {
        expect(decls(css, sel)["scrollbar-width"]).not.toBe("none");
        expect(decls(css, `${sel}::-webkit-scrollbar`).display).toBeUndefined();
      }
    }
  });
});

// ── 2. the Advanced rules editor ───────────────────────────────────────────

describe("the Advanced rules editor's look", () => {
  const rules = tokensOf(decls(panelCss, ".rules"));
  const rule = decls(panelCss, ".rule");
  const tone = tokensOf(decls(panelCss, ".states, .rules"));
  const scoped = (base: Record<string, string>) => {
    // Custom properties on .rules resolve against the skin; the muted grey
    // inside a rule is set on .rule.
    const at = { ...base, ...tone, ...rules };
    return { ...at, muted: rule["--wa-muted"]! };
  };

  it("gives the rule and each case a 1.5px edge, grey unless it means something", () => {
    expect(rule.border).toMatch(/^1\.5px solid /);
    expect(decls(panelCss, ".case").border).toBe("1.5px solid var(--wa-rl-edge)");
    expect(decls(panelCss, ".case.match")["border-color"]).toBe("var(--wa-hue-green)");
    expect(decls(panelCss, ".case.otherwise")["border-color"]).toContain("var(--wa-rule-else)");
  });

  for (const [skin, base] of skins) {
    const t = scoped(base);
    const c = (name: string) => color(`var(--${name})`, t);

    it(`steps each nested ground further from the card, ${skin}`, () => {
      const card = luminance(c("wa-card"));
      const steps = ["wa-rl-rule", "wa-rl-case", "wa-rl-row"].map((n) => Math.abs(luminance(c(n)) - card));
      expect(steps[0]).toBeGreaterThan(0);
      expect(steps[1]).toBeGreaterThan(steps[0]!);
      expect(steps[2]).toBeGreaterThan(steps[1]!);
    });

    it(`draws the inactive edges a grey that shows, ${skin}`, () => {
      expect(contrast(c("wa-rl-edge"), c("wa-rl-case"))).toBeGreaterThanOrEqual(2);
      expect(contrast(c("wa-rl-edge"), c("wa-rl-rule"))).toBeGreaterThanOrEqual(2);
      // Brighter than the hairline it replaced.
      expect(contrast(c("wa-rl-edge"), c("wa-rl-rule"))).toBeGreaterThan(contrast(c("wa-line"), c("wa-rl-rule")));
    });

    it(`keeps every word at 4.5:1 or better, ${skin}`, () => {
      const caseGround = c("wa-rl-case");
      const rowGround = c("wa-rl-row");
      for (const hue of ["wa-rule-if", "wa-rule-then", "wa-rule-else"]) {
        const label = color(`color-mix(in srgb, var(--${hue}) 75%, var(--wa-ink))`, t);
        expect(contrast(label, caseGround), `${hue} label`).toBeGreaterThanOrEqual(4.5);
      }
      expect(decls(panelCss, ".rlabel").color).toBe("color-mix(in srgb, var(--rpart, var(--wa-states)) 75%, var(--wa-ink))");
      const note = color(decls(panelCss, ".rnote").color!, t);
      expect(contrast(note, caseGround), "active now").toBeGreaterThanOrEqual(4.5);
      const muted = c("muted");
      expect(contrast(muted, rowGround), "muted on a row").toBeGreaterThanOrEqual(4.5);
      expect(contrast(muted, caseGround), "muted on a case").toBeGreaterThanOrEqual(4.5);
      expect(contrast(c("wa-ink"), c("wa-rl-row-hover")), "row text under the pointer").toBeGreaterThanOrEqual(4.5);
    });

    it(`fills the add buttons with their own hue and keeps their words ink, ${skin}`, () => {
      const fill = decls(panelCss, ".rules button.small.pill")["--lo-fill"]!;
      const hover = decls(panelCss, ".rules button.small.pill:hover:not(:disabled)")["--lo-fill"]!;
      for (const hue of ["wa-rule-if", "wa-rule-preset", "wa-rule-then", "wa-hue-green", "wa-rule-else"]) {
        const at = { ...t, c: `var(--${hue})` };
        for (const f of [fill, hover]) {
          const bg = color(f, at);
          expect(contrast(c("wa-ink"), bg), `${hue} pill`).toBeGreaterThanOrEqual(4.5);
          expect(contrast(bg, c("wa-card")), `${hue} pill shows on the card`).toBeGreaterThan(1.1);
        }
      }
      expect(decls(panelCss, ".rules button.small.pill.add-rule")["--lo-fill"]).toBe("var(--wa-rl-chip)");
      expect(contrast(c("wa-ink"), c("wa-rl-chip")), "Add a rule").toBeGreaterThanOrEqual(4.5);
    });

    it(`fills the Preview chips and keeps their words ink, ${skin}`, () => {
      const chip = decls(panelCss, ".rules .branches button");
      expect(chip.background).toBe("var(--wa-rl-chip)");
      expect(chip.color).toBe("var(--wa-ink)");
      expect(contrast(c("wa-ink"), c("wa-rl-chip"))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(c("wa-ink"), c("wa-rl-chip-hover"))).toBeGreaterThanOrEqual(4.5);
      const active = color(decls(panelCss, ".rules .branches button.active").background!, t);
      expect(contrast(c("wa-ink"), active), "the picked chip").toBeGreaterThanOrEqual(4.5);
    });
  }

  it("leaves Simple mode's pills as they were", () => {
    expect(decls(panelCss, ".states button.small.pill")["--lo-fill"]).toBeUndefined();
    expect(decls(panelCss, "button.small.pill")["--lo-fill"]).toBe("var(--wa-field)");
  });
});

// ── 3. the device chips ────────────────────────────────────────────────────

describe("the device chips in the canvas head", () => {
  const chip = decls(canvasStyles.cssText, ".cv-head .doc-chip.hued");
  const glyph = decls(canvasStyles.cssText, ".cv-head .doc-chip.hued > svg");

  it("wash the card with the chip's hue and edge it in the same hue", () => {
    expect(chip.background).toBe("color-mix(in srgb, var(--chip-c) 18%, var(--wa-card))");
    expect(chip["border-color"]).toBe("color-mix(in srgb, var(--chip-c) 60%, var(--wa-card))");
  });

  for (const [skin, base] of skins) {
    it(`keep the name and the glyph readable on every person's color, ${skin}`, () => {
      const hues = [1, 2, 3, 4, 5, 6].map((n) => `var(--wa-person-${n})`).concat(["var(--wa-hue-blue)", "var(--wa-hue-green)"]);
      for (const hue of hues) {
        const t = { ...base, "chip-c": hue };
        const bg = color(chip.background!, t);
        expect(contrast(color("var(--wa-ink)", t), bg), `${hue} name`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(color(glyph.color!, t), bg), `${hue} glyph`).toBeGreaterThanOrEqual(4.5);
        // Plainly not the plain card any more.
        expect(contrast(bg, color("var(--wa-card)", t)), `${hue} wash`).toBeGreaterThan(1.1);
      }
    });
  }
});

// ── 4. Save ────────────────────────────────────────────────────────────────

describe("Save while there is something to save", () => {
  const css = formButtonStyles.cssText;
  const on = decls(css, "button.primary.save.dirty:not(:disabled)");

  it("is solid palette green with a still, soft glow", () => {
    expect(on.background).toBe("var(--wa-hue-green)");
    expect(on.color).toBe("var(--wa-chip-ink)");
    expect(on["box-shadow"]).toBe("var(--wa-save-glow)");
    expect(on["--wa-save-glow"]).toContain("var(--wa-hue-green)");
    expect(on.animation).toBeUndefined();
    expect(css).not.toMatch(/save[^{}]*\{[^}]*animation/);
    // Focus keeps its ring, round the glow.
    expect(decls(css, "button.primary.save.dirty:not(:disabled):focus-visible")["box-shadow"]).toBe("var(--wa-ring), var(--wa-save-glow)");
  });

  it("stays quiet with nothing to save", () => {
    expect(decls(css, "header button.save:not(.dirty), .wa-bar button.save:not(.dirty)").background).toBe("var(--wa-card)");
  });

  for (const [skin, tokens] of skins) {
    it(`reads at 4.5:1 or better, at rest and under the pointer, ${skin}`, () => {
      const ink = color("var(--wa-chip-ink)", tokens);
      expect(contrast(ink, color(on.background!, tokens))).toBeGreaterThanOrEqual(4.5);
      const hover = decls(css, "button.primary.save.dirty:not(:disabled):hover").background!;
      expect(contrast(ink, color(hover, tokens))).toBeGreaterThanOrEqual(4.5);
    });
  }

  // The dialog's foot is private, so its source is the check: the button
  // carries the same two classes the top bar's Save does, and the green rule
  // is not scoped to a bar.
  it("is the same Save in the Watch settings dialog", () => {
    const src = readFileSync(join(__dirname, "..", "src", "watch-settings-view.ts"), "utf8");
    expect(src).toContain(`<button class="primary save \${changes > 0 ? "dirty" : ""}" ?disabled=\${!canSave}`);
  });
});
