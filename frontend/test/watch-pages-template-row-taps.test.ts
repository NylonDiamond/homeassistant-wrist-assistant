import { describe, expect, it } from "vitest";
import { describeTemplateTap, templateSourceTaps, templateTapDrawnRows, templateTapNotes, templateTapPlace, templateTapWebAddress } from "../src/watch-pages/template-row-taps.js";
import { alignTemplate, scanTemplateSource } from "../src/watch-pages/template-source.js";
import { templateRows } from "../src/watch-pages/template-rows.js";

const names = {
  pages: [{ id: "p_home", name: "Home map" }, { id: "p2", name: "Kitchen" }],
  httpActions: [{ id: "GARAGE", name: "Garage (iPhone)", plain: "Garage" }],
};
const say = (body: string) => describeTemplateTap(body, names);

describe("describeTemplateTap: the app's TemplateRowTap.parse in words", () => {
  it("says what each action does", () => {
    expect(say("page Home map")).toEqual({ ok: true, action: "page", text: "A tap on this row opens the page Home map." });
    expect(say("page p_home").text).toBe("A tap on this row opens the page Home map.");
    expect(say("page home MAP").ok).toBe(true);
    expect(say("toggle light.desk").text).toBe("A tap on this row toggles light.desk.");
    expect(say("maps 52.37,4.89").text).toBe("A tap on this row opens Maps at 52.37,4.89.");
    expect(say("maps 52.37, 4.89, Dam").text).toBe("A tap on this row opens Maps at Dam (52.37,4.89).");
    expect(say("maps person.jesse").text).toBe("A tap on this row opens person.jesse in Maps.");
    expect(say("script script.night").text).toBe("A tap on this row runs script.night.");
    expect(say("scene scene.evening").text).toBe("A tap on this row turns on scene.evening.");
    expect(say("control light.desk").text).toBe("A tap on this row opens the controls for light.desk.");
    expect(say("service light.turn_on light.desk").text).toBe("A tap on this row calls light.turn_on on light.desk.");
    expect(say("service light.turn_on").text).toBe("A tap on this row calls light.turn_on.");
    expect(say("refresh").text).toBe("A tap on this row refreshes the tile.");
    expect(say("refresh anything").ok).toBe(true);
    expect(say("http garage").text).toBe("A tap on this row runs the HTTP action Garage.");
    expect(say("link https://example.com/a").text).toBe("A tap on this row opens https://example.com/a on iPhone.");
  });

  it("reads the action in any case, with space around it", () => {
    expect(say("  TOGGLE   light.desk  ")).toMatchObject({ ok: true, action: "toggle", text: "A tap on this row toggles light.desk." });
  });

  it("says what is wrong when a marker does not read", () => {
    expect(say("dance")).toEqual({ ok: false, text: "Unknown tap action: dance" });
    expect(say("")).toEqual({ ok: false, text: "This tap has no action." });
    expect(say("page")).toEqual({ ok: false, action: "page", text: "This tap has no page." });
    expect(say("page Attic").text).toBe("No page is called Attic.");
    expect(say("toggle").text).toBe("This tap has no entity.");
    expect(say("script").ok).toBe(false);
    expect(say("http").ok).toBe(false);
    expect(say("http Gate").text).toBe("No HTTP action is called Gate.");
    expect(say("service").text).toBe("This tap has no service.");
    expect(say("service turn_on").text).toBe("Write the service as domain.service, like light.turn_on.");
    expect(say("maps").text).toBe("This tap has no place.");
    expect(say("maps 91,4").ok).toBe(false);
    expect(say("maps home").ok).toBe(false);
    expect(say("link example.com").ok).toBe(false);
    expect(say("link ftp://example.com").ok).toBe(false);
  });

  it("takes a value the template writes as it is", () => {
    expect(say("maps {{ lat }},{{ lon }}").ok).toBe(true);
    expect(say("page {{ p }}").ok).toBe(true);
    expect(say("link {{ url }}").ok).toBe(true);
    expect(say("service {{ s }}").ok).toBe(true);
    expect(say("{{ what }} light.desk")).toEqual({ ok: true, text: "A tap on this row runs the action the template writes." });
  });

  it("does not judge names while the lists are empty", () => {
    expect(describeTemplateTap("page Attic").ok).toBe(true);
    expect(describeTemplateTap("http Gate").ok).toBe(true);
  });

  it("reads places and web addresses as the app does", () => {
    expect(templateTapPlace("52.37,4.89")).toEqual({ lat: 52.37, lon: 4.89 });
    expect(templateTapPlace("-90,180,A, B")).toEqual({ lat: -90, lon: 180, name: "A, B" });
    expect(templateTapPlace("52.37")).toBeUndefined();
    expect(templateTapPlace("x,1")).toBeUndefined();
    expect(templateTapPlace(",1")).toBeUndefined();
    expect(templateTapWebAddress("http://a.b")).toBe(true);
    expect(templateTapWebAddress("https://a b")).toBe(false);
    expect(templateTapWebAddress("mailto:a@b.c")).toBe(false);
  });
});

describe("templateSourceTaps", () => {
  it("finds each marker with its row, and marks the ones that do nothing", () => {
    const taps = templateSourceTaps(scanTemplateSource("tests[tap:page Home map]\nLights[tap:toggle light.desk][tap:refresh]\nBad[tap:dance][tap:refresh]"), names);
    expect(taps.map((t) => [t.row, t.reading.ok, t.later])).toEqual([[0, true, false], [1, true, false], [1, true, true], [2, false, false], [2, true, false]]);
    expect(templateTapNotes(taps[2]!)).toEqual(["A tap on this row refreshes the tile.", "Only the first tap on a line counts."]);
    expect(taps[0]!.from).toBe(5);
    expect(taps[0]!.to).toBe(24);
  });

  it("knows a marker in a loop", () => {
    const text = "{% for e in lights %}{{ e.name }}[tap:toggle {{ e.entity_id }}]\n{% endfor %}After[tap:refresh]";
    const taps = templateSourceTaps(scanTemplateSource(text));
    expect(taps.map((t) => t.loop)).toEqual([true, false]);
    expect(templateTapNotes(taps[0]!)).toContain("Each row the loop makes gets this tap.");
  });
});

describe("templateTapDrawnRows", () => {
  it("uses the lined up rows when the template has no logic", () => {
    const text = "Head\ntests[tap:page Home map]\n\nLights[tap:toggle light.desk]";
    const rendered = text;
    const scan = scanTemplateSource(text);
    const aligned = alignTemplate(scan, templateRows(rendered));
    expect(aligned).toBeDefined();
    expect(templateTapDrawnRows(scan, 1, rendered, aligned)).toEqual([1]);
    expect(templateTapDrawnRows(scan, 3, rendered, aligned)).toEqual([2]);
    expect(templateTapDrawnRows(scan, 2, rendered, aligned)).toEqual([]);
  });

  it("finds every row a loop makes by its marker", () => {
    const text = "Lights\n{% for e in lights %}{{ e.name }}[tap:toggle {{ e.entity_id }}]\n{% endfor %}All off[tap:service light.turn_off]";
    const rendered = "Lights\nDesk[tap:toggle light.desk]\nShelf[tap:toggle light.shelf]\nAll off[tap:service light.turn_off]";
    const scan = scanTemplateSource(text);
    expect(alignTemplate(scan, templateRows(rendered))).toBeUndefined();
    expect(templateTapDrawnRows(scan, 1, rendered, undefined)).toEqual([1, 2]);
    expect(templateTapDrawnRows(scan, 2, rendered, undefined)).toEqual([3]);
    expect(templateTapDrawnRows(scan, 0, rendered, undefined)).toEqual([]);
  });

  it("finds nothing when two source rows could have made a row", () => {
    const text = "{% if a %}A[tap:toggle {{ x }}]\n{% endif %}B[tap:toggle {{ y }}]";
    const rendered = "A[tap:toggle light.a]\nB[tap:toggle light.b]";
    const scan = scanTemplateSource(text);
    expect(templateTapDrawnRows(scan, 0, rendered, undefined)).toEqual([]);
    expect(templateTapDrawnRows(scan, 1, rendered, undefined)).toEqual([]);
  });
});
