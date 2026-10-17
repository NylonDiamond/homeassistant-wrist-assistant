import{Z as w,_ as N,o as L,p as m,r as _,w as K}from"./chunk-G2VUZ5HE.js";import{d as v,g as z,j as A,k as $,u as k}from"./chunk-BHQDJHSH.js";import{b as y}from"./chunk-KWDEJLUK.js";import{e as E}from"./chunk-UPANJPAF.js";import{m as P,n as C,o as I,p as T,q as D,r as S}from"./chunk-ESIOP3D4.js";var O="A page on more than one device is the same page: an edit shows on all of them.",R="A status page is a read-only screen of rows that a tile or a menu slot opens.";function W(e,n=1){let t=e==="status_pages"?"status page":"page";return n===1?t:`${t}s`}function ee(e){return e==="status_pages"?"a status page":"a page"}function ne(e){return e==="status_pages"?"Status pages":"Pages"}function ae(e,n="pages"){return`${e} ${W(n,e)} on your watches and iPhones. ${n==="status_pages"?R:O}`}var M="This is its only device. Delete it in the page editor instead.",U="This is its only device. Delete it in the status pages editor instead.",V="Save or discard the edits to these pages first. A page goes on another device as it is saved.",X="Save or discard the edits to these status pages first. A status page goes on another device as it is saved.";function te(e){return e==="status_pages"?X:V}var u=e=>e.toUpperCase();function ie(e,n,t=new Map){let o=[],i=new Map,s=(a,r,d)=>{let c=i.get(a);if(c!==void 0){c.copies.some(l=>l.device.ownerId===r.device.ownerId)||c.copies.push(r);return}let p={key:a,...d(),copies:[r]};i.set(a,p),o.push(p)};for(let a of e){let r=n.get(a.ownerId);r!==void 0&&E(r).forEach((d,c)=>{let p=C(d);if(p==="")return;let l=v(d),h=l===void 0?`page:${a.ownerId}:${u(p)}`:`link:${l}`;s(h,{device:a,page:d,hidden:T(d),index:c},()=>{let f=S(d);return{kind:"pages",pageId:p,name:I(d),tiles:f?0:P(d).length,rows:0,smart:f,...l===void 0?{}:{linkId:l}}})})}for(let a of e){let r=t.get(a.ownerId);r!==void 0&&L(r).forEach((d,c)=>{let p=m(d);if(p==="")return;let l=w(d),h=K(d),f=l!==void 0?`status-link:${l}`:h?`status-starter:${u(p)}`:`status:${a.ownerId}:${u(p)}`;s(f,{device:a,page:d,hidden:!1,index:c},()=>({kind:"status_pages",pageId:p,name:N(d),tiles:0,rows:_(d).length,smart:!1,...h?{starter:!0}:{},...l===void 0?{}:{linkId:l}}))})}return j(o,e)}function j(e,n){let t=new Map;for(let i of e)i.starter&&i.linkId!==void 0&&!t.has(u(i.pageId))&&t.set(u(i.pageId),i);if(t.size===0)return e;let o=new Map(n.map((i,s)=>[i.ownerId,s]));return e.filter(i=>{let s=i.starter&&i.linkId===void 0?t.get(u(i.pageId)):void 0;if(s===void 0)return!0;for(let a of i.copies)s.copies.some(r=>r.device.ownerId===a.device.ownerId)||s.copies.push(a);return s.copies.sort((a,r)=>(o.get(a.device.ownerId)??0)-(o.get(r.device.ownerId)??0)),!1})}function F(e){return e.starter?e.copies.filter(n=>w(n.page)===void 0):[]}var G="Not linked: each device has its own copy.";function Y(e){let n=F(e);return e.copies.length<2||n.length===0?void 0:e.linkId===void 0?G:`Not linked on ${k(n.map(o=>o.device.name))}: ${n.length===1?"it has its own copy":"each has its own copy"}.`}function re(e,n,t){if(Y(e)===void 0)return;let o=F(e),i=n===x?void 0:g(e,n),s,a;if(e.linkId===void 0)s=i??e.copies[0],a=e.copies.filter(r=>r!==s);else{let r=e.copies.filter(d=>w(d.page)===e.linkId);s=(i!==void 0&&r.includes(i)?i:void 0)??r[0],a=o}return[s,...a].some(r=>t(r.device.ownerId,e.kind))?"dirty":{source:s.device.ownerId,pageId:m(s.page),targets:a.map(r=>r.device.ownerId)}}function oe(e){return`Linked on ${k(e)}. An edit on one now shows on all of them.`}function se(e,n){return e.filter(t=>t.kind===n)}var x="all";function de(e,n,t=()=>{}){return[{id:x,label:"All",count:n.length},...e.map(o=>{let i=t(o.ownerId);return{id:o.ownerId,label:o.name,kind:o.kind,...i===void 0?{}:{color:i},count:n.filter(s=>g(s,o.ownerId)!==void 0).length}})]}function pe(e,n){return e!==void 0&&n.some(t=>t.ownerId===e)?e:x}function g(e,n){return e.copies.find(t=>t.device.ownerId===n)}function b(e,n){return n==="all"||e.copies.some(t=>t.device.kind===n)}function B(e){return e.some(n=>n.kind==="watch")&&e.some(n=>n.kind==="iphone")}function le(e,n){return e!==void 0&&e!=="all"&&B(n)?e:"all"}function ce(e){return[{key:"all",label:"All",count:e.length},{key:"watch",label:"Watches",count:e.filter(n=>b(n,"watch")).length},{key:"iphone",label:"iPhones",count:e.filter(n=>b(n,"iphone")).length}]}function ge(e,n,t="",o="all"){let i=t.trim().toLowerCase(),s=(i===""?[...e]:e.filter(a=>a.name.toLowerCase().includes(i))).filter(a=>b(a,o));return n===x?s:s.filter(a=>g(a,n)!==void 0).sort((a,r)=>g(a,n).index-g(r,n).index)}function ue(e,n,t="all"){return(n===x?void 0:g(e,n))??(t==="all"?void 0:e.copies.find(o=>o.device.kind===t))??e.copies.find(o=>o.device.kind==="watch")??e.copies[0]}function xe(e,n,t=new Set){let o=n.kind==="status_pages",i=!o&&n.copies.some(a=>D(a.page)),s=n.copies.length<=1;return e.map(a=>{let r=g(n,a.ownerId)!==void 0;if(!i&&!r&&t.has(a.ownerId))return{device:a,on:r,here:!1,stuck:$,tag:A};let d=i?z:r&&s?o?U:M:void 0;return{device:a,on:r,here:!1,...d===void 0?{}:{stuck:d}}})}function he(e,n){return e.copies.find(t=>(e.linkId===void 0||v(t.page)===e.linkId)&&!n(t.device.ownerId,e.kind))?.device.ownerId}function fe(e){return e.kind==="status_pages"?`${e.rows} ${e.rows===1?"row":"rows"}`:e.smart?"Smart page":`${e.tiles} ${e.tiles===1?"tile":"tiles"}`}function we(e,n,t,o="all",i="pages"){if(n.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";let s=W(i);if(t.trim()!=="")return`No ${s} has that name.`;if(o!=="all")return`No ${s} here is on ${o==="watch"?"a watch":"an iPhone"}.`;let a=n.find(r=>r.ownerId===e);return i==="status_pages"?a!==void 0?`No status pages on ${a.name} yet.`:"No device has status pages yet. Use New status page to make one.":a!==void 0?`No pages on ${a.name} yet.`:"No device has pages yet. Open a device's Pages to make one."}var ke=y`
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
`;export{W as a,ee as b,ne as c,ae as d,te as e,ie as f,Y as g,re as h,oe as i,se as j,x as k,de as l,pe as m,g as n,B as o,le as p,ce as q,ge as r,ue as s,xe as t,he as u,fe as v,we as w,ke as x};
