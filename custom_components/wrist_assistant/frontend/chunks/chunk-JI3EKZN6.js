import{ca as o,ea as c,la as w,ma as u,ra as f}from"./chunk-L7FZX4YY.js";import{b as l}from"./chunk-PF5FVRKR.js";import{b as s}from"./chunk-PGBBLK6E.js";var m="Tick a device and the page is on it.",v="A status page is a read-only screen of rows that a tile or a menu slot opens.";function d(e,a=1){let r=e==="status_pages"?"status page":"page";return a===1?r:`${r}s`}function L(e){return e==="status_pages"?"a status page":"a page"}function z(e){return e==="status_pages"?"Status pages":"Pages"}function C(e,a="pages"){return`${e} ${d(a,e)} in your home. ${a==="status_pages"?v:m}`}function D(e,a,r=!1){let n=d(e);if(r)return`Click ${d(e,2)} to pick them. Shift+click picks every ${n} between two.`;if(a!==void 0){let t=l(a.kind);return e==="status_pages"?`Click a status page to edit it. Drag to order. The order is this ${t}'s own.`:`Click a page to edit it. Drag to order, and Hide here keeps a page on this ${t} without showing it.`}return e==="status_pages"?"Click a status page to edit it. Tick a device to put it there.":"Click a page to edit it. Tick a device to show the page there. One page, the same everywhere."}function P(e){return e.starter?`${e.detail} \xB7 starter`:e.detail}var h="all";function K(e,a,r,n=()=>{}){return[{id:h,label:"All",count:a===void 0?0:c(a,r).length},...e.map(t=>{let i=n(t.ownerId);return{id:t.ownerId,label:t.name,kind:t.kind,...i===void 0?{}:{color:i},count:a===void 0?0:f(a,t.ownerId,r)}})]}function T(e,a){return e!==void 0&&a.some(r=>r.ownerId===e)?e:h}function b(e){return e.some(a=>a.kind==="watch")&&e.some(a=>a.kind==="iphone")}function I(e,a){return e!==void 0&&e!=="all"&&b(a)?e:"all"}function x(e,a,r){return a==="all"||r.some(n=>n.kind===a&&e.some(t=>o(t,n.ownerId)))}function $(e,a){return[{key:"all",label:"All",count:e.length},{key:"watch",label:"Watches",count:e.filter(r=>x(r.owners,"watch",a)).length},{key:"iphone",label:"iPhones",count:e.filter(r=>x(r.owners,"iphone",a)).length}]}function g(e,a){let r=a.trim().toLowerCase();return r===""||e.toLowerCase().includes(r)}function A(e,a,r="",n="all",t=[]){return c(e,a).filter(i=>g(i.name,r)&&x(i.owners,n,t))}function E(e,a,r,n=""){return{device:a,picks:w(e,a.ownerId,r).filter(t=>g(t.entry.name,n)),rest:u(e,a.ownerId,r).filter(t=>g(t.name,n))}}function F(e,a){if(a===void 0)return[...e];let r=a.flatMap(n=>e.filter(t=>o(t.id,n)));return[...r,...e.filter(n=>!r.includes(n))]}function _(e,a,r){let n=e.findIndex(i=>o(i,a)),t=e.findIndex(i=>o(i,r));if(!(n<0||t<0||n===t))return t<n?e[t]:t+1<e.length?e[t+1]:null}function N(e,a,r){let n=e.filter(p=>!o(p,a)),t=r===null?-1:n.findIndex(p=>o(p,r)),i=e.find(p=>o(p,a))??a;return t<0?[...n,i]:[...n.slice(0,t),i,...n.slice(t)]}function O(e,a,r,n){let t=n.filter(i=>e.owners.some(p=>o(p,i.ownerId)));return(a===h?void 0:t.find(i=>i.ownerId===a))??(r==="all"?void 0:t.find(i=>i.kind===r))??t.find(i=>i.kind==="watch")??t[0]}function S(e){return`No device has this ${d(e)}. Tick one to edit it there.`}function B(e){return`On ${e.name}`}function H(e){return`Drag to order. The order is this ${l(e.kind)}'s own.`}function j(e){return`Not on this ${l(e.kind)}`}var M="The rest of your home. Add one here with a tick.";function U(e,a,r){return r.trim()!==""?`No ${d(a)} on ${e.name} has that name.`:`No ${d(a,2)} on ${e.name} yet. Tick one below, or make a new one.`}function V(e,a,r="all",n="pages"){if(e.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";let t=d(n);return a.trim()!==""?`No ${t} has that name.`:r!=="all"?`No ${t} here is on ${r==="watch"?"a watch":"an iPhone"}.`:n==="status_pages"?"Your home has no status pages yet. Use New status page to make one.":"Your home has no pages yet. Use New page to make one."}var W=s`
  .lt-view { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  .lt-sect { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 8px; padding: 0 2px; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); }
  .lt-sect small { font-size: 12px; font-weight: 500; color: color-mix(in srgb, var(--wa-muted) 75%, transparent); }
  .lt-sect-r { margin-left: auto; font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
  .lt-list { display: flex; flex-direction: column; min-width: 0; border: 1px solid var(--wa-line-strong); border-radius: 8px; overflow: hidden; background: var(--wa-card); }
  .lt-row {
    display: flex; align-items: center; gap: 10px; min-width: 0; padding: 7px 12px 7px 8px;
    border-top: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
  }
  .lt-row:first-child { border-top: 0; }
  .lt-row.drag-over { box-shadow: inset 0 2px 0 var(--wa-accent); }
  .lt-row.drag-over.below { box-shadow: inset 0 -2px 0 var(--wa-accent); }
  .lt-row.dragging { opacity: .5; }
  .lt-row:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
  .lt-grip { display: inline-flex; flex: none; width: 14px; color: var(--wa-muted); cursor: grab; }
  .lt-grip svg { width: 14px; height: 14px; }
  .lt-row[draggable="false"] .lt-grip { opacity: .35; cursor: default; }
  .lt-row-open {
    display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; padding: 0; border: 0; background: none;
    font: inherit; color: inherit; text-align: left; cursor: pointer;
  }
  .lt-row-open:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
  .lt-row-nm { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
  .lt-row-n { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
  .lt-row-open:hover .lt-row-n { text-decoration: underline; text-underline-offset: 2px; }
  .lt-row-m { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--wa-muted); }
  .lt-row.hid { color: var(--wa-muted); }
  .lt-row.hid .lt-row-n { text-decoration: line-through; text-decoration-color: var(--wa-line-strong); }
  .lt-eye {
    flex: none; padding: 2px 7px; border-radius: 5px; border: 1px solid var(--wa-line-strong); background: transparent;
    font: inherit; font-size: 11px; color: var(--wa-muted); cursor: pointer;
  }
  .lt-eye:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
  .lt-eye:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lt-eye:disabled { opacity: .5; cursor: progress; }
  .lt-pick-sel {
    flex: none; max-width: 190px; height: 26px; padding: 0 24px 0 9px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
    font: inherit; font-size: 12.5px; color: var(--wa-ink); background-color: var(--wa-input, var(--wa-field)); cursor: pointer;
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8a8f' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 7px center; background-size: 11px;
  }
  .lt-pick-sel:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .lt-pick-sel:disabled { opacity: .5; cursor: progress; }
  .lt-line { margin: 0; padding: 0 2px; font-size: 12px; line-height: 1.5; color: var(--wa-muted); }
  .lt-line.warn, .lt-line.err { color: var(--wa-need); }
  .lt-line.ok { color: var(--wa-ok, var(--wa-ink)); }
  .lt-empty { margin: 0; padding: 12px 14px; font-size: 12.5px; color: var(--wa-muted); }
  /* "Not on this watch": the rest of the home, dimmed until hovered, each
     card with a small picture and its ticks. */
  .ap-card.lt-dim { opacity: .62; transition: opacity .12s ease-out, border-color .12s ease-out; }
  .ap-card.lt-dim:hover, .ap-card.lt-dim:focus-within { opacity: 1; }
  .ap-thumb.lt-thumb-sm { padding: 6px; }
  .lt-card-note { margin: 0; font-size: 11.5px; line-height: 1.35; color: var(--wa-need); }
  @media (max-width: 640px) {
    .lt-sect-r { margin-left: 0; flex-basis: 100%; }
    .lt-row { padding: 7px 10px 7px 6px; gap: 8px; }
    .lt-pick-sel { max-width: 130px; }
  }
`;var J=s`
  :host { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; color: var(--wa-ink); }
  * { box-sizing: border-box; }
  svg { display: block; }
  button { font: inherit; color: inherit; }
  /* The page, the Complications list page's (\`list-page.ts\`): the title
     and its line, then one outlined surface holding the head, the device
     tabs, the bar, the cards and the foot. */
  .ap-page {
    --ap-top: clamp(20px, 4vh, 40px);
    flex: 1 1 auto; min-height: 0; overflow: auto;
    padding: var(--ap-top) clamp(16px, 4vw, 40px) 48px;
    background: var(--wa-bg); color: var(--wa-ink);
  }
  .ap-wrap { width: min(1400px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
  .ap-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 16px; padding: 0 2px; }
  .ap-head-text { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .ap-head h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -.02em; }
  .ap-lead { margin: 0; font-size: 14px; color: var(--wa-muted); }
  .ap-warn { margin: 0; font-size: 12.5px; color: var(--wa-need); }
  .ap-empty { margin: 0; padding: 18px 4px; font-size: 13px; color: var(--wa-muted); }

  /* A copy of the Complications surface's rules in panel.ts (\`.pk-*\`,
     its page form in list-page.ts), so these tabs' head and tabs look the
     same. Keep the two in step. */
  .pk-surface.pk-page {
    display: flex; flex-direction: column; min-width: 0;
    border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-lg);
    background: var(--wa-card); color: var(--wa-ink);
  }
  .pk-page > :first-child { border-top-left-radius: calc(var(--wa-r-lg) - 1px); border-top-right-radius: calc(var(--wa-r-lg) - 1px); }
  .pk-page > :last-child { border-bottom-left-radius: calc(var(--wa-r-lg) - 1px); border-bottom-right-radius: calc(var(--wa-r-lg) - 1px); }
  .pk-page > .pk-pin { position: sticky; top: calc(-1 * var(--ap-top, 0px)); z-index: 7; background: var(--wa-card); }
  .pk-head { display: flex; align-items: center; gap: 12px; flex: none; padding: 12px 12px 12px 18px; border-bottom: 1px solid var(--wa-line); }
  .pk-head > .pk-search { margin-left: auto; }
  .pk-shape { display: inline-flex; align-items: center; gap: 6px; flex: none; }
  .pk-shape-lead { font-size: 12px; color: var(--wa-muted); }
  .pk-shape select {
    max-width: 180px; font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); cursor: pointer; height: 28px;
    padding: 0 26px 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background-color: var(--wa-input);
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8a8f' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 8px center; background-size: 12px;
    transition: border-color .12s ease-out, box-shadow .12s ease-out;
  }
  .pk-shape select:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
  .pk-shape select:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .pk-search {
    display: flex; align-items: center; gap: 8px; flex: none; width: 260px; max-width: 45vw;
    height: 28px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-field);
  }
  .pk-search:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
  .pk-search:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .pk-search svg { width: 14px; height: 14px; flex: none; color: var(--wa-muted); }
  .pk-search-input {
    flex: 1; min-width: 0; font: inherit; font-size: 13px; color: var(--wa-ink);
    border: 0; background: transparent; outline: 0; padding: 0;
  }
  .pk-search-input::placeholder { color: color-mix(in srgb, var(--wa-muted) 70%, transparent); }
  .pk-tabs {
    display: flex; align-items: stretch; flex-wrap: wrap; gap: 2px; flex: none;
    padding: 0 12px; border-bottom: 1px solid var(--wa-line);
  }
  .pk-tab {
    display: inline-flex; align-items: center; gap: 7px; flex: none; cursor: pointer;
    font: inherit; font-size: 12.5px; font-weight: 500; color: var(--wa-muted); white-space: nowrap;
    padding: 9px 12px; border: 0; background: transparent;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
  }
  .pk-tab:hover { color: var(--wa-ink); }
  .pk-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 7px 7px 0 0; }
  .pk-tab.on { color: var(--wa-ink); font-weight: 600; border-bottom-color: var(--dc, var(--wa-ink)); }
  .pk-tab svg { width: 15px; height: 15px; }
  .pk-tab-glyph { display: inline-flex; flex: none; color: var(--dc, var(--wa-muted)); }
  .pk-tab-count { font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
  .pk-body { padding: 14px 18px; background: var(--wa-bg); min-height: 160px; }
  .pk-foot {
    display: flex; align-items: center; gap: 10px; flex: none; padding: 12px 18px;
    border-top: 1px solid var(--wa-line); background: var(--wa-card);
  }
  .pk-foot-hint { flex: 1; min-width: 0; font-size: 12px; color: var(--wa-muted); }

  /* The cards, the Complications cards' shape: the name on top, the picture
     big under it, then the devices and Devices. Each card is as tall as
     its picture. */
  .ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(232px, 1fr)); gap: 12px; align-items: start; }
  .ap-card {
    position: relative; z-index: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 9px 10px 10px;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-card);
    transition: border-color .12s ease-out;
  }
  .ap-card:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
  .ap-card.over { z-index: 5; }
  .ap-thumb {
    display: grid; place-items: start center; width: 100%; padding: 10px; overflow: hidden;
    border: 0; border-radius: 6px; background: var(--wa-bg); cursor: pointer;
  }
  .ap-top { display: flex; align-items: center; gap: 8px; max-width: 100%; padding-top: 2px; }
  .ap-open {
    display: flex; align-items: baseline; gap: 8px; min-width: 0; flex: 1;
    padding: 0; border: 0; background: none; cursor: pointer; text-align: left;
  }
  .ap-open .ap-detail { margin-left: auto; flex: none; }
  .ap-foot { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; min-width: 0; }
  .ap-foot > .ap-dev-open { margin-left: auto; }
  .ap-open:focus-visible, .ap-thumb:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
  .ap-name { min-width: 0; font-size: 13.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ap-card:not(.picking) .ap-open:hover .ap-name { text-decoration: underline; text-underline-offset: 2px; }
  .ap-detail { font-size: 11.5px; color: var(--wa-muted); }
  .ap-devs { display: flex; flex-wrap: wrap; gap: 4px; min-width: 0; }
  .ap-dev {
    display: inline-flex; align-items: center; gap: 4px; max-width: 100%; padding: 2px 7px 2px 5px; border-radius: 999px;
    font-size: 11px; color: var(--wa-ink); background: var(--wa-hover); border: 1px solid var(--wa-line);
  }
  .ap-dev { border-color: color-mix(in srgb, var(--dc, var(--wa-line)) 60%, transparent); }
  .ap-dev svg { flex: none; width: 12px; height: 12px; color: var(--dc, var(--wa-muted)); }
  .ap-dev-n { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ap-dev.dim { opacity: .55; }
  .ap-dev em { font-style: normal; font-size: 10px; color: var(--wa-muted); }
  .ap-dev-open {
    display: inline-flex; align-items: center; gap: 4px; padding: 3px 6px 3px 7px; border-radius: 6px; cursor: pointer;
    font-size: 11.5px; font-weight: 600; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  .ap-dev-open svg { width: 13px; height: 13px; }
  .ap-dev-open:hover { background: var(--wa-hover); }
  .ap-dev-open:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .ap-dev-open.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent); }
  /* Over the chips, when copies on several devices could be one linked
     thing: a starter status page not linked yet, or menus with the same
     slots. A short line, Link, then what the last Link did. */
  .ap-same { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .ap-same-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .ap-same-t { flex: 1; min-width: 0; font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); }
  .ap-same-btn {
    display: inline-flex; align-items: center; gap: 4px; flex: none; padding: 3px 7px; border-radius: 6px; cursor: pointer;
    font-size: 11.5px; font-weight: 600; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  .ap-same-btn svg { width: 13px; height: 13px; }
  .ap-same-btn:hover:not(:disabled) { background: var(--wa-hover); }
  .ap-same-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .ap-same-btn:disabled { opacity: .45; cursor: default; }
  .ap-same-note { font-size: 11.5px; line-height: 1.35; color: var(--wa-ink); }
  .ap-same-note.ok { color: var(--wa-ok, var(--wa-ink)); }
  .ap-same-note.warn, .ap-same-note.err { color: var(--wa-need); }
  /* The Devices menu hangs under its card, over the cards below. */
  .ap-card > .pe-dev-menu { position: absolute; top: calc(100% - 4px); left: 8px; width: 250px; max-width: calc(100vw - 32px); z-index: 6; }
  /* A phone, as the Complications surface folds there: the head's
     controls wrap, the search and the Device menu share a line, the tabs
     wrap and the head stops being pinned. */
  @media (max-width: 640px) {
    .ap-page { padding: 14px 12px 32px; }
    .ap-head h1 { font-size: 22px; }
    .pk-page > .pk-pin { position: static; }
    .pk-head { flex-wrap: wrap; row-gap: 8px; column-gap: 8px; padding: 10px 10px 10px 14px; }
    .pk-head > .pk-search { order: 3; flex: 1 1 0; width: auto; max-width: none; min-width: 0; margin-left: 0; }
    .pk-head > .pk-shape { order: 3; }
    .pk-shape select { max-width: 130px; }
    .pk-tab { padding: 9px 10px; }
    .pk-body { padding: 10px; }
    .ap-grid { gap: 8px; }
  }
`;export{d as a,L as b,z as c,C as d,D as e,P as f,h as g,K as h,T as i,b as j,I as k,x as l,$ as m,g as n,A as o,E as p,F as q,_ as r,N as s,O as t,S as u,B as v,H as w,j as x,M as y,U as z,V as A,W as B,J as C};
