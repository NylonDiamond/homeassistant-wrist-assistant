// When the page editor asks Home Assistant to render a page's templates: a
// pause in typing asks about the tile being edited, the 30 second clock asks
// about all of them and is not pushed back by typing, and a refusal keeps what
// each tile had.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RenderResult } from "../src/ha-api.js";
import { WATCH_TEMPLATE_DEBOUNCE_MS, WATCH_TEMPLATE_REFRESH_MS, type WatchTemplateRender } from "../src/watch-pages/app-model.js";
import "../src/watch-pages/page-editor.js";

type Answer = (templates: Record<string, string>) => Promise<Record<string, RenderResult>> | Record<string, RenderResult>;

const rendered: Answer = (templates) =>
  Object.fromEntries(Object.entries(templates).map(([id, text]) => [id, { ok: true, value: `=${text}` }]));

function editor(texts: Record<string, string>, answer: Answer = rendered) {
  const asked: Record<string, string>[] = [];
  const page = { texts };
  const Ctor = customElements.get("wa-page-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  Object.defineProperty(el, "isConnected", { value: true });
  Object.defineProperty(el, "draft", { value: { schemaVersion: 1, pages: [] } });
  el.currentPage = () => ({
    id: "P",
    name: "P",
    items: Object.entries(page.texts).map(([id, templateString]) => ({ id, entityId: `template.${id}`, templateString })),
  });
  el.hass = {
    connection: {
      sendMessagePromise: async (message: { templates: Record<string, string> }) => {
        asked.push(message.templates);
        return { results: await answer(message.templates) };
      },
    },
  };
  const follow = () => (el.followTemplates as () => void).call(el);
  const stop = () => (el.stopTemplates as () => void).call(el);
  const renders = () => el.templateRenders as ReadonlyMap<string, WatchTemplateRender>;
  const refused = () => el.templateRefused as ReadonlySet<string>;
  return { asked, page, follow, stop, renders, refused };
}

describe("when the page editor renders templates", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("window", globalThis);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("asks about every tile first, then only about the tile being typed in", async () => {
    const e = editor({ A: "a", B: "b", C: "c" });
    e.follow();
    await vi.advanceTimersByTimeAsync(WATCH_TEMPLATE_DEBOUNCE_MS);
    expect(e.asked).toEqual([{ A: "a", B: "b", C: "c" }]);

    // Typing with pauses, the pattern that used to spend the budget.
    for (const text of ["a1", "a12", "a123"]) {
      e.page.texts = { ...e.page.texts, A: text };
      e.follow();
      await vi.advanceTimersByTimeAsync(WATCH_TEMPLATE_DEBOUNCE_MS);
    }
    expect(e.asked.slice(1)).toEqual([{ A: "a1" }, { A: "a12" }, { A: "a123" }]);
    expect(e.renders().get("B")?.result).toEqual({ ok: true, value: "=b" });
    e.stop();
  });

  it("keeps the 30 second clock for all of them running through the typing", async () => {
    const e = editor({ A: "a", B: "b" });
    e.follow();
    await vi.advanceTimersByTimeAsync(WATCH_TEMPLATE_DEBOUNCE_MS);
    // A word every 5 s: when each word restarted the clock, it never ran out.
    for (let typed = 1; typed <= 8; typed++) {
      e.page.texts = { ...e.page.texts, A: `a${typed}` };
      e.follow();
      await vi.advanceTimersByTimeAsync(5_000);
    }
    expect(WATCH_TEMPLATE_REFRESH_MS).toBeLessThan(8 * 5_000);
    // The first ask, and the clock's.
    expect(e.asked.filter((templates) => Object.keys(templates).length === 2).length).toBe(2);
    e.stop();
  });

  it("keeps each tile's value through a refusal and says so until an answer comes", async () => {
    let refuse = false;
    const e = editor({ A: "a", B: "b" }, (templates) => (refuse
      ? Object.fromEntries(Object.keys(templates).map((id) => [id, { ok: false, error: "Too many slow templates", refused: true }]))
      : rendered(templates)));
    e.follow();
    await vi.advanceTimersByTimeAsync(WATCH_TEMPLATE_DEBOUNCE_MS);
    expect(e.refused().size).toBe(0);

    refuse = true;
    await vi.advanceTimersByTimeAsync(WATCH_TEMPLATE_REFRESH_MS);
    expect(e.renders().get("A")?.result).toEqual({ ok: true, value: "=a" });
    expect(e.renders().get("B")?.result).toEqual({ ok: true, value: "=b" });
    expect([...e.refused()].sort()).toEqual(["A", "B"]);

    refuse = false;
    await vi.advanceTimersByTimeAsync(WATCH_TEMPLATE_REFRESH_MS);
    expect(e.refused().size).toBe(0);
    e.stop();
  });

  it("drops only the keys a newer call asked about again when an answer is late", async () => {
    const late: ((value: Record<string, RenderResult>) => void)[] = [];
    const e = editor({ A: "a", B: "b" }, (templates) => (Object.keys(templates).length === 2
      ? new Promise((resolve) => { late.push(resolve); })
      : rendered(templates)));
    e.follow();
    await vi.advanceTimersByTimeAsync(WATCH_TEMPLATE_DEBOUNCE_MS);
    e.page.texts = { ...e.page.texts, A: "a2" };
    e.follow();
    await vi.advanceTimersByTimeAsync(WATCH_TEMPLATE_DEBOUNCE_MS);
    expect(e.renders().get("A")?.text).toBe("a2");

    late[0]!({ A: { ok: true, value: "=a" }, B: { ok: true, value: "=b" } });
    await vi.advanceTimersByTimeAsync(0);
    expect(e.renders().get("A")?.text).toBe("a2");
    expect(e.renders().get("B")?.result).toEqual({ ok: true, value: "=b" });
    e.stop();
  });
});
