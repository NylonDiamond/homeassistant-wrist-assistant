// The editor chrome that every editor shares: each sheet carries the rules
// its name promises, and sectionCard() draws the same card as the
// complication editor's own card().

import { CSSResult, html, type TemplateResult } from "lit";
import { describe, expect, it } from "vitest";

import {
  canvasStyles,
  chromeDarkValues,
  chromeRuns,
  chromeTokens,
  columnStyles,
  inspectorStyles,
  leftCardStyles,
  litOutline,
  rowListStyles,
  sectionCard,
  topBarStyles,
} from "../src/editor-chrome.js";
import { LEFT_CARD_COLOR } from "../src/kinds.js";
import { type EditorHost, card } from "../src/editors.js";
import { uiIcon } from "../src/ui-icons.js";

/** A template as the HTML it would write, listeners and `nothing` dropped. */
function flatten(node: unknown): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "symbol" || typeof node === "function") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  return String(node);
}

/** The card's frame, in document order: each element that is part of the
 * section card's own markup, as `tag.class`. The body and the glyphs are
 * left out, and so is the "?" that only card() carries. */
function skeleton(markup: string): string[] {
  const frame = new Set(["sec", "sec-h", "swatch", "tt", "sum", "chev", "sec-b"]);
  const out: string[] = [];
  for (const m of markup.matchAll(/<([a-z0-9]+)([^>]*)>/g)) {
    const tag = m[1] ?? "";
    const cls = (/class="([^"]*)"/.exec(m[2] ?? "")?.[1] ?? "").split(/\s+/).filter((c) => c !== "");
    const own = cls.find((c) => frame.has(c));
    if (own !== undefined) out.push(`${tag}.${own}`);
    else if (tag === "h4") out.push("h4");
  }
  return out;
}

function hostWith(open: boolean): EditorHost {
  return {
    openSections: new Set(open ? ["look"] : []),
    helpSections: new Set<string>(),
    litSection: undefined,
    toggleSection: () => {},
    toggleHelp: () => {},
  } as unknown as EditorHost;
}

describe("the chrome sheets", () => {
  const sheets: [string, CSSResult, string[]][] = [
    ["chromeTokens", chromeTokens, [".wa-chrome", "--wa-float-bg", "--wa-lc-pages", ".canvas-card"]],
    ["topBarStyles", topBarStyles, ["header, .wa-bar", "button.tb-btn.tb-new", ".tb-sync .tb-dot", "@keyframes wa-pulse", "button.help", "button.tb-btn.tb-pages"]],
    ["columnStyles", columnStyles, [".layout {", ".gutter", ".column {", ".card {"]],
    ["leftCardStyles", leftCardStyles, [".card.lc", ".lc-head .swatch", "button.lc-btn.pri", ".pop-menu {"]],
    ["rowListStyles", rowListStyles, [".layer.hl", ".layer .thumb.clear", ".badge.need", ".tap-strip", ".values-list .datum.svr"]],
    ["canvasStyles", canvasStyles, [".cv-head", ".stage-tools", "button.tb.pct", "@container vfoot"]],
    ["inspectorStyles", inspectorStyles, [".insp-head", ".crumbs .kchip", ".sec-h h4", ".fgroup", "button.sec-help"]],
  ];

  for (const [name, sheet, selectors] of sheets) {
    it(`${name} is a stylesheet with its rules in it`, () => {
      expect(sheet).toBeInstanceOf(CSSResult);
      for (const s of selectors) expect(sheet.cssText).toContain(s);
    });
  }

  it("names each left card's hue as a palette token, not a literal", () => {
    expect(leftCardStyles.cssText).toContain(".card.pages-card { --c: var(--wa-lc-pages); }");
    expect(chromeTokens.cssText).toContain(`--wa-lc-pages: ${LEFT_CARD_COLOR.pages};`);
    expect(chromeTokens.cssText).toContain(`--wa-lc-layers: ${LEFT_CARD_COLOR.layers};`);
    expect(chromeTokens.cssText).toContain(`--wa-lc-values: ${LEFT_CARD_COLOR.values};`);
    expect(LEFT_CARD_COLOR).toEqual({ pages: "var(--wa-hue-blue)", layers: "var(--wa-hue-green)", values: "var(--wa-hue-red)" });
  });

  it("lets a child element inherit the dark values instead of shadowing them", () => {
    // Most chrome colors are the panel's skin tokens, which the panel sets
    // for both skins and a child inherits. What has no token comes down from
    // the panel's dark host under a private name, the light value only the
    // fallback.
    expect(chromeTokens.cssText).toContain("--wa-float-bg: var(--wa-card);");
    expect(chromeDarkValues.cssText).toContain("--wa-dark-check-a: #2a2a2e;");
    expect(rowListStyles.cssText).toContain("repeating-conic-gradient(var(--wa-dark-check-a, #d8d8de) 0% 25%, var(--wa-dark-check-b, #f2f2f5) 0% 50%)");
    expect(rowListStyles.cssText).toContain(".badge.tap { color: var(--wa-hue-red);");
    expect(rowListStyles.cssText).toContain("--tp: var(--wa-hue-red);");
  });

  it("draws every colored card with the one lit outline", () => {
    expect(litOutline.cssText).toContain("linear-gradient(140deg, var(--c) 0%, color-mix(in srgb, var(--c) 33%, transparent) 30%");
    expect(litOutline.cssText).toContain("border: 1.5px solid transparent;");
    for (const [name, sheet, selector] of [
      ["sectionCard", chromeRuns.sectionCard, ".sec {"],
      ["leftCards", chromeRuns.leftCards, ".card.lc {"],
    ] as const) {
      const text = sheet.cssText;
      const rule = text.slice(text.indexOf(selector), text.indexOf("}", text.indexOf(selector)));
      expect(rule, name).toContain("linear-gradient(140deg, var(--c)");
    }
  });

  it("gives the top bar buttons a plain outline in their own hue, and rule badges a plain fill", () => {
    const bar = chromeRuns.topBar.cssText;
    for (const selector of [".picker > button.tb-browse {", "button.tb-btn.tb-new, button.tb-btn.tb-import, button.tb-btn.tb-share {"]) {
      const rule = bar.slice(bar.indexOf(selector), bar.indexOf("}", bar.indexOf(selector)));
      expect(rule, selector).toContain("border: 1px solid color-mix(in srgb, var(--c) 60%, var(--wa-card));");
      expect(rule, selector).not.toContain("linear-gradient");
    }
    const all = Object.values(chromeRuns).map((sheet) => sheet.cssText).join("\n");
    expect(all).toContain(".badge.states { color: var(--wa-hue-yellow); background: color-mix(in srgb, var(--wa-hue-yellow) 14%, transparent); }");
    expect(all).not.toContain(".badge.states::before");
  });

  it("keeps a card's hue off everything inside it", () => {
    // The body puts --c back to the neutral accent; the hue stays on the
    // outline, the title chip and the changed dot.
    expect(chromeRuns.sectionCard.cssText).toContain(".sec-b { --c: var(--wa-accent); }");
    expect(chromeRuns.sectionCard.cssText).toMatch(/\.swatch \{[^}]*background: var\(--c\); color: var\(--wa-chip-ink\);/);
    expect(chromeRuns.sectionCardTail.cssText).toContain(".sec-h h4 .sec-dot { display: block; width: 7px; height: 7px; border-radius: 50%; background: var(--c);");
  });

  it("never selects on the dark attribute, which a child element cannot see", () => {
    const sheets: [string, CSSResult][] = [
      ...Object.entries(chromeRuns),
      ["chromeTokens", chromeTokens], ["chromeDarkValues", chromeDarkValues],
      ["topBarStyles", topBarStyles], ["columnStyles", columnStyles], ["leftCardStyles", leftCardStyles],
      ["rowListStyles", rowListStyles], ["canvasStyles", canvasStyles], ["inspectorStyles", inspectorStyles],
    ];
    for (const [name, sheet] of sheets) expect(sheet.cssText.includes("[dark]"), name).toBe(false);
  });

  it("gives every private dark name it reads a value in chromeDarkValues", () => {
    const all = Object.values(chromeRuns).map((r) => r.cssText).join("") + chromeTokens.cssText;
    const read = new Set([...all.matchAll(/var\((--wa-dark-[a-z-]+)/g)].map((m) => m[1]));
    const set = new Set([...chromeDarkValues.cssText.matchAll(/(--wa-dark-[a-z-]+):/g)].map((m) => m[1]));
    expect(read.size).toBeGreaterThan(0);
    expect([...read].filter((n) => !set.has(n))).toEqual([]);
    expect([...set].filter((n) => !read.has(n))).toEqual([]);
  });

  it("joins the runs in order for an element that takes them whole", () => {
    const joined = (...runs: CSSResult[]) => runs.map((r) => r.cssText).join("");
    expect(topBarStyles.cssText).toBe(joined(chromeRuns.topBar, chromeRuns.picker, chromeRuns.helpButton));
    expect(inspectorStyles.cssText).toBe(joined(chromeRuns.inspectorHead, chromeRuns.sectionCard, chromeRuns.sectionCardTail));
  });
});

describe("sectionCard", () => {
  const body = html`<div class="field"><span>Size</span></div>`;

  for (const open of [true, false]) {
    it(`draws the frame card() draws, ${open ? "open" : "shut"}`, () => {
      const ours = flatten(sectionCard(
        { color: "#4a7fe8", icon: uiIcon("look"), title: "Look", open, onToggle: () => {}, summary: "Blue", id: "look" },
        body,
      ));
      const theirs = flatten(card(hostWith(open), "look", "Look", body, { icon: "look", color: "#4a7fe8", summary: "Blue" }));
      expect(skeleton(ours)).toEqual(skeleton(theirs));
      expect(skeleton(ours)[0]).toBe("section.sec");
      // Bound attributes, written the way card() writes them.
      expect(ours).toContain(`data-open=${open ? "true" : "false"}`);
      expect(ours).toContain("style=--c:#4a7fe8");
      expect(ours).toContain("data-sec=look");
    });
  }

  it("puts the help first in the body and a dot after the title", () => {
    const out = flatten(sectionCard(
      { color: "#000", icon: uiIcon("look"), title: "Look", open: true, onToggle: () => {}, help: "What it does.", dot: true },
      html`<p>body</p>`,
    ));
    expect(out).toMatch(/<div class="sec-b"><p class="hint">What it does\.<\/p><p>body<\/p>/);
    expect(out).toMatch(/<h4>Look<span class="sec-dot"/);
  });

  it("leaves the body out while shut", () => {
    const out: TemplateResult = sectionCard({ color: "#000", icon: uiIcon("look"), title: "Look", open: false, onToggle: () => {} }, body);
    expect(flatten(out)).not.toContain("sec-b");
  });
});
