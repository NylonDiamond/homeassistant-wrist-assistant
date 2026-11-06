import { describe, expect, it } from "vitest";
import fixture from "./fixtures-template-layout/cases.json";
import { normalizeTemplateLayout, resolveTemplateLayout, templateLayoutParts, templateLayoutShape } from "../src/watch-pages/template-layout.js";
import { applyTemplateSourceChanges, templateColorChoices, templateItemColorChange, templateItemSource } from "../src/watch-pages/template-item-source.js";
import { setWatchTemplateLayout } from "../src/watch-pages/app-model.js";
import type { WatchPagesDocument } from "../src/watch-pages/model.js";

describe("template item layout, shared with the native renderer", () => {
  for (const test of fixture.cases) it(test.name, () => {
    const result = resolveTemplateLayout(fixture.layout, test.text);
    if (test.texts === null) { expect(result).toBeUndefined(); return; }
    expect(result?.parts.map(p => p.text)).toEqual(test.texts);
    expect(result?.parts[0]?.symbol).toBe(test.symbol);
    expect(result?.parts.map(p => p.kind === "icon" ? p.color ?? null : p.runs[0]?.color ?? null)).toEqual(test.colors);
  });

  it("refuses damaged, future, incomplete and duplicate layouts", () => {
    for (const raw of [null, "bad", { ...fixture.layout, v: 2 }, { ...fixture.layout, items: [] }, { ...fixture.layout, items: [...fixture.layout.items, fixture.layout.items[0]] }, { ...fixture.layout, items: [{ ...fixture.layout.items[0], x: NaN }] }]) expect(normalizeTemplateLayout(raw)).toBeUndefined();
    expect(resolveTemplateLayout({ ...fixture.layout, items: fixture.layout.items.slice(0, 2) }, fixture.cases[0]!.text)).toBeUndefined();
  });

  it("splits expressions and labels, keeping a glued unit with the value", () => {
    const source = "[icon:thermometer] {{ states('sensor.temp') }}°C indoors";
    const parts = templateLayoutParts(source, "[icon:thermometer] 21°C indoors");
    expect(parts.map(p => [p.key, p.text, p.source?.kind])).toEqual([["0.0.icon", "", "icon"], ["0.0.value", "21°C", "value"], ["0.0.suffix", "indoors", "label"]]);
    expect(source.slice(parts[1]!.source!.from, parts[1]!.source!.to)).toBe("{{ states('sensor.temp') }}°C");
  });

  it("keeps ambiguous branch output whole and offers no source rewrite", () => {
    const source = "{% if home %}[icon:house] Home{% else %}[icon:figure.walk] Away{% endif %}";
    const parts = templateLayoutParts(source, "[icon:house] Home");
    expect(parts.map(p => p.slice)).toEqual(["icon", "whole"]);
    expect(parts.every(p => p.source === undefined)).toBe(true);
    expect(templateItemSource(source, parts[0]!).choices).toEqual([]);
  });

  it("edits each conditional color literal without changing its condition", () => {
    const source = "[color:{{ '#FFD4CC' if unlocked > 0 else '#B5EAD7' }}][icon:lock.open.fill] {{ unlocked }} unlocked[/color]";
    const parts = templateLayoutParts(source, "[color:#FFD4CC][icon:lock.open.fill] 2 unlocked[/color]");
    const icon = parts[0]!;
    expect(templateItemSource(source, icon).choices.map(c => c.label)).toEqual(["If unlocked > 0", "Otherwise"]);
    const change = templateItemColorChange(source, icon, "branch:0", "#ff0000")!;
    const next = applyTemplateSourceChanges(source, [change])!;
    expect(next).toContain("[icon:lock.open.fill color:{{ '#ff0000' if unlocked > 0 else '#B5EAD7' }}]");
    expect(next).toContain("{{ unlocked }} unlocked");
    expect(templateColorChoices("{{ 'red' if x == 'blue' else 'green' }}").map(c => c.value)).toEqual(["red", "green"]);
  });

  it("isolates the selected label from its neighboring icon and value", () => {
    const source = "[color:red][icon:lightbulb.fill] {{ count }} lights on[/color]";
    const parts = templateLayoutParts(source, "[color:red][icon:lightbulb.fill] 12 lights on[/color]");
    const next = applyTemplateSourceChanges(source, [templateItemColorChange(source, parts[2]!, "color", "blue")!]);
    expect(next).toBe("[color:red][icon:lightbulb.fill] {{ count }} [color:blue]lights on[/color][color:red][/color]");
  });

  it("restores inherited ink rather than hard-coding white on reset", () => {
    const source = "[icon:power] {{ count }} on";
    const initial = templateLayoutParts(source, "[icon:power] 1 on");
    for (const part of [initial[0]!, initial[2]!]) {
      const changed = applyTemplateSourceChanges(source, [templateItemColorChange(source, part, "color", "blue")!])!;
      const rendered = part.kind === "icon" ? "[icon:power color:blue] 1 on" : "[icon:power] 1 [color:blue]on[/color]";
      const current = templateLayoutParts(changed, rendered).find(p => p.key === part.key)!;
      expect(applyTemplateSourceChanges(changed, [templateItemColorChange(changed, current, "color", "")!])).toBe(source);
    }
  });

  it("reads long and multiline conditional colors without splitting their rows", () => {
    const source = "[color:{{\n 'red' if states('sensor.temperature') | float(0) > 25 else 'green'\n}}][icon:thermometer] {{ states('sensor.temperature') }}°C";
    const parts = templateLayoutParts(source, "[color:red][icon:thermometer] 26°C");
    expect(parts.map(p => p.slice)).toEqual(["icon", "value"]);
    expect(templateItemSource(source, parts[0]!).choices.map(c => c.value)).toEqual(["red", "green"]);
  });

  it("writes a layout sparsely and only to a template tile", () => {
    const document = { pages: [{ id: "page", items: [{ id: "tile", entityId: "template.a", unrelated: 42 }] }] } as WatchPagesDocument;
    const layout = normalizeTemplateLayout(fixture.layout)!;
    const changed = setWatchTemplateLayout(document, "page", "tile", layout);
    expect(JSON.stringify(changed)).toContain('"templateLayout"');
    expect(JSON.stringify(changed)).toContain('"unrelated":42');
    expect(setWatchTemplateLayout(changed, "page", "tile", layout)).toBe(changed);
    expect(setWatchTemplateLayout(changed, "page", "tile", undefined)).toEqual(document);
    const other = { pages: [{ id: "page", items: [{ id: "tile", entityId: "light.a" }] }] } as WatchPagesDocument;
    expect(setWatchTemplateLayout(other, "page", "tile", layout)).toBe(other);
  });
});
