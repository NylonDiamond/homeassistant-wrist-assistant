import{c as a}from"./chunk-ZKYND2IQ.js";import{b as n}from"./chunk-VWIMYR2L.js";import{U as i}from"./chunk-Q6MTLD6E.js";function d(e){return!Number.isFinite(e)||e<0?"":e<1e3?`${Math.round(e)} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function p(e,r=Date.now()){let t=e?Date.parse(e):NaN;return Number.isNaN(t)?"":a(Math.max(0,(r-t)/1e3))}function l(e,r){return(e.used_by??[]).map(t=>{let o=r.find(s=>s.owner_watch_id===t);return o===void 0?"another device":i(o,r)})}function x(e,r){let t=l(e,r);return t.length===0?"Not on any page":t.length===1?`On ${t[0]}`:t.length===2?`On ${t[0]} and ${t[1]}`:`On ${t.length} devices`}function b(e,r=Date.now()){let t=p(e.added_at,r);return[`${e.width} \xD7 ${e.height}`,d(e.bytes),t===""?"":`added ${t}`].filter(o=>o!=="").join(" \xB7 ")}function h(e){return(e.used_by??[]).length>0?"A page shows this photo. Pick another background on that page first.":void 0}var f="Delete this photo? It cannot be brought back.",m="The pictures behind your pages, kept once for the whole home. A photo no page shows goes by itself a week later; Delete takes it now.",w="No photos yet. Add one from a page's Background in the page editor.",y="Update the integration to see the home's photos here.";function c(e){return new TextEncoder().encode(e.text).length}function v(e,r=Date.now()){let t=p(e.updated_at,r);return[t===""?"":`Saved ${t}`,d(c(e))].filter(o=>o!=="").join(" \xB7 ")}function k(e){return`Delete the part "${e}"? Complications it went into keep their layers.`}var P="Layers saved from a complication with Save to parts, to drop into another one from the Saved parts tab of + Add.",T="No parts yet. Pick layers in a complication's Layers list and press Save to parts.";var S=n`
  :host {
    display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; overflow: auto;
    box-sizing: border-box; padding: 18px clamp(16px, 3vw, 32px) 48px;
    color: var(--wa-ink); background: var(--wa-bg); font-size: 14px;
  }
  * { box-sizing: border-box; }
  svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
  h2, p { margin: 0; }
  .lb-wrap { width: 100%; max-width: 940px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }
  .lb-head { display: flex; flex-direction: column; gap: 4px; }
  .lb-head h2 { font-size: 17px; font-weight: 600; letter-spacing: -.01em; }
  .lb-lead { font-size: 13px; line-height: 1.45; color: var(--wa-muted); max-width: 640px; }
  .lb-note {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px; font-size: 13px;
    border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card);
  }
  .lb-note > span { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .lb-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
  .lb-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
  .lb-empty {
    display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 20px;
    border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    font-size: 13px; color: var(--wa-muted);
  }
  button.lb-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex: none;
    min-height: 30px; padding: 0 11px; border-radius: var(--wa-r-sm, 8px); cursor: pointer;
    font: inherit; font-size: 12.5px; color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
  }
  button.lb-btn:hover:not(:disabled) { background: var(--wa-hover); }
  button.lb-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.lb-btn:disabled { opacity: .5; cursor: default; }
  button.lb-btn.danger { color: var(--wa-need); }
  button.lb-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
  .lb-count { font-size: 12px; color: var(--wa-muted); }
`;export{x as a,b,h as c,f as d,m as e,w as f,y as g,v as h,k as i,P as j,T as k,S as l};
