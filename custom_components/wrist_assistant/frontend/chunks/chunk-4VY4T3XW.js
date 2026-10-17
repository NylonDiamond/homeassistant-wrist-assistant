import{Z as z,_ as A,o as I,p as T,r as D,w as S}from"./chunk-ZGLX37NK.js";import{d as E,g as _,j as K,k as L}from"./chunk-ZZWBYO74.js";import{b as w}from"./chunk-KWDEJLUK.js";import{e as C}from"./chunk-UPANJPAF.js";import{m,n as v,o as b,p as k,q as y,r as P}from"./chunk-ESIOP3D4.js";var F="A page on more than one device is the same page: an edit shows on all of them.",N="A status page is a read-only screen of rows that a tile or a menu slot opens.";function W(e,a=1){let t=e==="status_pages"?"status page":"page";return a===1?t:`${t}s`}function H(e){return e==="status_pages"?"a status page":"a page"}function q(e){return e==="status_pages"?"Status pages":"Pages"}function J(e,a="pages"){return`${e} ${W(a,e)} on your watches and iPhones. ${a==="status_pages"?N:F}`}var O="This is its only device. Delete it in the page editor instead.",R="This is its only device. Delete it in the status pages editor instead.",V="Save or discard the edits to these pages first. A page goes on another device as it is saved.",M="Save or discard the edits to these status pages first. A status page goes on another device as it is saved.";function Q(e){return e==="status_pages"?M:V}var $=e=>e.toUpperCase();function Z(e,a,t=new Map){let r=[],p=new Map,s=(n,o,i)=>{let c=p.get(n);if(c!==void 0){c.copies.some(d=>d.device.ownerId===o.device.ownerId)||c.copies.push(o);return}let l={key:n,...i(),copies:[o]};p.set(n,l),r.push(l)};for(let n of e){let o=a.get(n.ownerId);o!==void 0&&C(o).forEach((i,c)=>{let l=v(i);if(l==="")return;let d=E(i),u=d===void 0?`page:${n.ownerId}:${$(l)}`:`link:${d}`;s(u,{device:n,page:i,hidden:k(i),index:c},()=>{let f=P(i);return{kind:"pages",pageId:l,name:b(i),tiles:f?0:m(i).length,rows:0,smart:f,...d===void 0?{}:{linkId:d}}})})}for(let n of e){let o=t.get(n.ownerId);o!==void 0&&I(o).forEach((i,c)=>{let l=T(i);if(l===""||S(i))return;let d=z(i),u=d===void 0?`status:${n.ownerId}:${$(l)}`:`status-link:${d}`;s(u,{device:n,page:i,hidden:!1,index:c},()=>({kind:"status_pages",pageId:l,name:A(i),tiles:0,rows:D(i).length,smart:!1,...d===void 0?{}:{linkId:d}}))})}return r}function ee(e,a){return e.filter(t=>t.kind===a)}var x="all";function ae(e,a,t=()=>{}){return[{id:x,label:"All",count:a.length},...e.map(r=>{let p=t(r.ownerId);return{id:r.ownerId,label:r.name,kind:r.kind,...p===void 0?{}:{color:p},count:a.filter(s=>g(s,r.ownerId)!==void 0).length}})]}function ne(e,a){return e!==void 0&&a.some(t=>t.ownerId===e)?e:x}function g(e,a){return e.copies.find(t=>t.device.ownerId===a)}function h(e,a){return a==="all"||e.copies.some(t=>t.device.kind===a)}function X(e){return e.some(a=>a.kind==="watch")&&e.some(a=>a.kind==="iphone")}function te(e,a){return e!==void 0&&e!=="all"&&X(a)?e:"all"}function re(e){return[{key:"all",label:"All",count:e.length},{key:"watch",label:"Watches",count:e.filter(a=>h(a,"watch")).length},{key:"iphone",label:"iPhones",count:e.filter(a=>h(a,"iphone")).length}]}function ie(e,a,t="",r="all"){let p=t.trim().toLowerCase(),s=(p===""?[...e]:e.filter(n=>n.name.toLowerCase().includes(p))).filter(n=>h(n,r));return a===x?s:s.filter(n=>g(n,a)!==void 0).sort((n,o)=>g(n,a).index-g(o,a).index)}function oe(e,a,t="all"){return(a===x?void 0:g(e,a))??(t==="all"?void 0:e.copies.find(r=>r.device.kind===t))??e.copies.find(r=>r.device.kind==="watch")??e.copies[0]}function pe(e,a,t=new Set){let r=a.kind==="status_pages",p=!r&&a.copies.some(n=>y(n.page)),s=a.copies.length<=1;return e.map(n=>{let o=g(a,n.ownerId)!==void 0;if(!p&&!o&&t.has(n.ownerId))return{device:n,on:o,here:!1,stuck:L,tag:K};let i=p?_:o&&s?r?R:O:void 0;return{device:n,on:o,here:!1,...i===void 0?{}:{stuck:i}}})}function se(e,a){return e.copies.find(t=>!a(t.device.ownerId,e.kind))?.device.ownerId}function de(e){return e.kind==="status_pages"?`${e.rows} ${e.rows===1?"row":"rows"}`:e.smart?"Smart page":`${e.tiles} ${e.tiles===1?"tile":"tiles"}`}function le(e,a,t,r="all",p="pages"){if(a.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";let s=W(p);if(t.trim()!=="")return`No ${s} has that name.`;if(r!=="all")return`No ${s} here is on ${r==="watch"?"a watch":"an iPhone"}.`;let n=a.find(o=>o.ownerId===e);return p==="status_pages"?n!==void 0?`No status pages on ${n.name} yet. The five starter pages every device has are not listed here.`:"No device has status pages of its own yet. Use New status page to make one.":n!==void 0?`No pages on ${n.name} yet.`:"No device has pages yet. Open a device's Pages to make one."}var xe=w`
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
`;export{W as a,H as b,q as c,J as d,Q as e,Z as f,ee as g,x as h,ae as i,ne as j,g as k,X as l,te as m,re as n,ie as o,oe as p,pe as q,se as r,de as s,le as t,xe as u};
