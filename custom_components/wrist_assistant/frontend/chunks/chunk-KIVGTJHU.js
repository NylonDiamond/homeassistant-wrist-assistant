import{b as i,d as r,g as a,kh as o}from"./chunk-IHFAZWMC.js";import{$ as s,aa as c,ea as p}from"./chunk-2ZMALKUC.js";var d=new Set;function h(e,n){return`${e}\0${n}`}function g(e,n){d.add(h(e,n))}function u(e,n){return d.has(h(e,n))}function x(e,n,t){return e==="start"?!0:t!==void 0&&u(n,t)}function v(e){return e.saving||e.dirty?"":e.newWatch?c:""}function m(e,n,t){return e&&n==="no_record"?{kind:"warn",text:p}:t}function b(e="watch"){return r`<div class="pe-note nw-banner" role="note">${o("info")}<span>${s(e)}</span></div>`}function y(e){return e===""?a:r`<span class="nw-why" role="status">${o("info")}<span>${e}</span></span>`}var N=i`
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
`;export{g as a,x as b,v as c,m as d,b as e,y as f,N as g};
