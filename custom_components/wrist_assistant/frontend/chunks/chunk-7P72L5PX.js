import{ea as s,fa as c,ja as p}from"./chunk-CTCEX2XB.js";import{b as a,c as r,eh as o,f as i}from"./chunk-WQ6ONAD4.js";var d=new Set;function u(n,e){return`${n}\0${e}`}function g(n,e){d.add(u(n,e))}function h(n,e){return d.has(u(n,e))}function x(n,e,t){return n==="start"?!0:t!==void 0&&h(e,t)}function v(n){return n.saving||n.dirty?"":n.newWatch?c:""}function m(n,e,t){return n&&e==="no_record"?{kind:"warn",text:p}:t}function b(){return r`<div class="pe-note nw-banner" role="note">${o("info")}<span>${s}</span></div>`}function N(n){return n===""?i:r`<span class="nw-why" role="status">${o("info")}<span>${n}</span></span>`}var y=a`
  .pe-note.nw-banner {
    flex: none;
    border-color: color-mix(in srgb, var(--wa-accent) 35%, var(--wa-line));
    background: color-mix(in srgb, var(--wa-accent) 6%, var(--wa-card));
  }
  .pe-note.nw-banner > svg.ui-icon { width: 15px; height: 15px; color: var(--wa-accent); flex: none; }
  .nw-why {
    display: inline-flex; align-items: center; gap: 5px; min-width: 0;
    font-size: 12px; color: var(--wa-muted); padding: 0 4px;
  }
  .nw-why > svg.ui-icon { width: 13px; height: 13px; flex: none; }
  .wa-bar.stacked .nw-why { white-space: normal; }
`;export{g as a,x as b,v as c,m as d,b as e,N as f,y as g};
