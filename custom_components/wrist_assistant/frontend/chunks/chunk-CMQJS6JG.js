import{De as v,oh as k}from"./chunk-IBZGIRVS.js";import{p as g}from"./chunk-TWJXXRS4.js";import{b as y,f as d,i as u}from"./chunk-6ZDBXU6B.js";var I="all";function h(e,n){let r=e.findIndex(t=>t.ownerId===n);return r<0?e.length:r}function T(e,n){let r=e.toLocaleLowerCase(),t=n.toLocaleLowerCase();return r<t?-1:r>t?1:0}function C(e){return e.linkId!==void 0&&e.linkId!==""?`link:${e.linkId}`:`rec:${e.ownerId}\0${e.id}`}function G(e,n,r){let t=new Map;for(let i of e){let o=C(i),c=t.get(o);c?c.push(i):t.set(o,[i])}let s=[];for(let[i,o]of t){let c=[...o].sort((f,x)=>h(n,f.ownerId)-h(n,x.ownerId)||f.slot-x.slot),a=c[0];if(!a)continue;let l=c.find(f=>f.ownerId===r)??a;s.push({key:i,name:l.name,copies:c,open:l})}return s}function L(e,n){return e.filter(r=>r.copies.some(t=>t.ownerId===n))}function H(e,n,r){let t=[],s=new Set(n),i=new Set;for(let o of n){if(i.has(o))continue;let c=e.find(l=>r(l).includes(o)),a=c?[...r(c)]:[o];if(a.some(l=>!s.has(l)))return;for(let l of a)i.add(l);t.push(a)}return t}function j(e,n){return n?{deleteAsk:e===1?"Delete 1 design from every device it is on? Faces and widgets using it lose it.":`Delete ${e} designs from every device they are on? Faces and widgets using them lose them.`,deleteTitle:"Delete these designs from every device they are on",takeOff:"Take off everywhere",takeOffTitle:`Take these designs off every device they are on. Each one is kept, under ${p}.`}:{deleteAsk:`Delete ${e}? Faces and widgets using them lose them.`,deleteTitle:"Delete these complications",takeOff:"Take off",takeOffTitle:`Take each of these off the device its card is under. The last copy of a design is kept, under ${p}.`}}function R(e){return e.copies.length>0&&e.copies.every(n=>n.ownerId===g)}function A(e){let n;for(let r of e)for(let t of r.copies)if(n===void 0)n=t.ownerId;else if(n!==t.ownerId)return;return n}function P(e,n,r){let t=r??A(e),s=(i,o)=>i.copies.find(c=>c.ownerId===o)?.slot??Number.MAX_SAFE_INTEGER;return t!==void 0?[...e].sort((i,o)=>s(i,t)-s(o,t)||T(i.name,o.name)):[...e].sort((i,o)=>T(i.name,o.name)||h(n,i.copies[0]?.ownerId??"")-h(n,o.copies[0]?.ownerId??"")||i.open.slot-o.open.slot)}function z(e,n,r){return r===I?P(e,n):P(L(e,r),n,r)}var p="Not on a device",U=`the ${p} list`;function w(e){return e.kind==="library"||e.ownerId===g}function O(e){return[...e.filter(n=>!w(n)),...e.filter(w)]}function Y(e,n){let r=[{key:I,label:"All",kind:"all",count:e.length}];for(let t of O(n))r.push({key:t.ownerId,label:w(t)?p:t.label,kind:t.kind,count:L(e,t.ownerId).length});return r}function N(e){return e==="iphone"?"iPhone":"watch"}function q(e,n){let r=new Set(e),t=[];for(let s of n){let i=s.devices.filter(o=>r.has(o.ownerId));i.length!==0&&t.push(`${s.label} (${i.map(o=>N(o.kind)).join(", ")})`)}return t.length>0?t.join(" \xB7 "):r.has(g)?p:"On no device yet"}function V(e,n,r){let t=new Map;for(let i of e){let{key:o,label:c}=n(i),a=t.get(o);a?a.rows.push(i):t.set(o,{key:o,label:c,rows:[i]})}let s=i=>{let o=r.indexOf(i);return o<0?r.length:o};return[...t.values()].sort((i,o)=>s(i.key)-s(o.key))}var Q="Empty, no layers",Z="Search by name, person or entity";function ee(e){if(e.elements.length>0||e.control!==void 0||e.values.length>0||e.dataSources.length>0||e.notes!==void 0&&e.notes.trim()!==""||e.tapAction.type!=="refresh"&&e.tapAction.type!=="openApp")return!1;for(let n of Object.values(e.perFamily))if(n!==void 0&&(v(n)||n.backgroundColorHex!==void 0||n.backgroundFill!==void 0||n.borderColorHex!==void 0||n.rules.length>0))return!1;return!e.supportedFamilies.includes("inline")}var _=new Set(["entityId","entity_id"]),F=new Set(["displayName"]),M=/\b[a-z_]+\.[a-z0-9_]+\b/g;function K(e){return e.includes("{{")||e.includes("{%")}function ne(e){let n=new Set,r=new Set,t=(s,i)=>{if(typeof s=="string"){if(s==="")return;let o=s.toLocaleLowerCase();if(i!==void 0&&_.has(i))n.add(o);else if(i!==void 0&&F.has(i))r.add(o);else if(K(s)){r.add(o);for(let c of o.match(M)??[])n.add(c)}return}if(Array.isArray(s)){for(let o of s)t(o,i);return}if(s!==null&&typeof s=="object")for(let[o,c]of Object.entries(s))t(c,o)};return t(e,void 0),{entities:[...n],words:[...r]}}function re(e,n,r){return n===""?!1:e.entities.some(t=>t.includes(n))||e.words.some(t=>t.includes(n))?!0:e.entities.some(t=>r(t)?.toLocaleLowerCase().includes(n)===!0)}function D(e,n){let r={all:void 0,shown:[],more:[],shelf:void 0};for(let t of e)t.kind==="all"?r.all=t:t.kind==="library"?r.shelf=t:t.count>0||t.key===n?r.shown.push(t):r.more.push(t);return r}function te(e,n){let r=[],t=[],s=[];for(let i of e)R(i)?n(i)?s.push(i):t.push(i):r.push(i);return{placed:r,shelved:[...t,...s],empty:s}}function oe(e,n){return n>0?`(${e}) \xB7 ${n} empty`:`(${e})`}function ie(e){return e===1?"Delete 1 empty design?":`Delete ${e} empty designs?`}function se(e){return e===1?"Deleted 1 empty design.":`Deleted ${e} empty designs.`}function ae(e,n,r,t){let s=new Map(e);return r===t?s.delete(n):s.set(n,r),s}function ce(e){return[...e].sort(([,n],[,r])=>Number(r)-Number(n))}function le(e,n){return new Map(e.slice(n))}function de(e){return e.queued>0?e.queued===1?"1 change waits for Save":`${e.queued} changes wait for Save`:e.on===0?"On no device yet. Changes here apply at once":"Changes here apply at once"}function S(e){return e==="all"?"grid":e==="iphone"?"phone":e==="library"?"layers":"watch"}function he(e){let{current:n,open:r,onToggle:t,onPick:s,styleOf:i}=e,o=D(e.tabs,n),c=(a,l="")=>d`<button type="button" role="tab" class="pk-tab ${l} ${a.key===n?"on":""}"
      style=${i(a.key)} id=${`pk-tab-${a.key}`} aria-selected=${a.key===n?"true":"false"}
      aria-controls="pk-tabpanel" @click=${()=>s(a.key)}>
      <span class="pk-tab-glyph" aria-hidden="true">${k(S(a.kind))}</span>
      <span class="pk-tab-name">${a.label}</span>
      <span class="pk-tab-count">${a.count}</span>
    </button>`;return d`<div class="pk-tabs" role="tablist" aria-label="Devices">
    ${o.all===void 0?u:c(o.all)}
    ${o.shown.map(a=>c(a))}
    ${o.more.length===0?u:d`<span class="pk-more" data-menu="tabs" role="presentation"
      @keydown=${a=>{a.key==="Escape"&&r&&(a.preventDefault(),a.stopPropagation(),t(!1))}}>
      <button type="button" class="pk-more-btn" aria-haspopup="menu" aria-expanded=${r?"true":"false"}
        title="The devices with nothing on them" @click=${()=>t()}>+${o.more.length} more${k("chevron")}</button>
      ${r?d`<div class="pop-menu pk-more-menu" role="menu" aria-label="The devices with nothing on them">
        ${o.more.map(a=>d`<button type="button" class="row" role="menuitem" style=${i(a.key)}
          @click=${()=>{t(!1),s(a.key)}}>
          <span class="pk-tab-glyph" aria-hidden="true">${k(S(a.kind))}</span>
          <span class="pk-tab-name">${a.label}</span><span class="pk-tab-count">${a.count}</span></button>`)}
      </div>`:u}
    </span>`}
    ${o.shelf===void 0?u:d`<span class="pk-vsep" aria-hidden="true"></span>${c(o.shelf,"chip")}`}
  </div>`}var $="not-on-a-device";function we(e){let n=[{key:"all",label:"All",kind:"all",count:e.total}];for(let r of e.devices)n.push({key:r.ownerId,label:r.name,kind:r.kind,count:e.countOf(r.ownerId)});return(e.shelved>0||e.current===$)&&n.push({key:$,label:p,kind:"library",count:e.shelved}),n}var b=new Set;function be(e){return b.has(e)}function me(e,n){n?b.add(e):b.delete(e)}var m=new Map;function xe(e,n){return n!==void 0&&m.get(e)===n}function ye(e,n){n===void 0?m.delete(e):m.set(e,n)}var E=class{constructor(n){this.host=n;this.open=!1;this.toggle=(n=!this.open)=>{n!==this.open&&(this.open=n,n?window.addEventListener("pointerdown",this.outside,{capture:!0}):window.removeEventListener("pointerdown",this.outside,{capture:!0}),this.host.requestUpdate())};this.outside=n=>{n.composedPath().some(r=>r instanceof HTMLElement&&r.dataset.menu==="tabs")||this.toggle(!1)};n.addController(this)}hostDisconnected(){window.removeEventListener("pointerdown",this.outside,{capture:!0}),this.open=!1}},ve=y`
  .pk-tabs {
    display: flex; align-items: stretch; flex-wrap: wrap; gap: 0 2px; flex: none;
    padding: 0 8px; border-bottom: 1px solid var(--wa-line);
  }
  /* A hairline between things of two kinds: the view from the preview in
     the head, the devices from Not on a device in the tabs. */
  .pk-vsep { width: 1px; height: 20px; flex: none; align-self: center; margin: 0 6px; background: var(--wa-line-strong); }
  /* Not on a device is a state, not a device, so it is a chip and no tab. */
  .pk-tab.chip {
    align-self: center; height: 28px; box-sizing: border-box; padding: 0 11px; margin: 4px 0; gap: 6px;
    border: 1px solid var(--wa-line-strong); border-radius: 999px; background: var(--wa-card); color: var(--wa-soft, var(--wa-ink));
  }
  .pk-tab.chip.on { border-color: var(--wa-ink); color: var(--wa-ink); }
  .pk-tab.chip:focus-visible { border-radius: 999px; }
  /* "+2 more": the devices holding nothing, a click away. */
  .pk-more { position: relative; display: inline-flex; align-items: center; flex: none; margin: 0 2px; }
  .pk-more-btn {
    display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 9px; cursor: pointer;
    font: inherit; font-size: 12.5px; font-weight: 500; color: var(--wa-muted);
    border: 1px dashed var(--wa-line-strong); border-radius: 999px; background: transparent;
  }
  .pk-more-btn:hover, .pk-more-btn[aria-expanded="true"] { color: var(--wa-ink); border-color: var(--wa-muted); }
  .pk-more-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pk-more-btn svg { width: 11px; height: 11px; }
  .pop-menu.pk-more-menu {
    position: absolute; top: calc(100% + 6px); left: 0; right: auto; width: max-content; min-width: 200px; max-width: min(320px, calc(100vw - 16px)); z-index: 6;
    background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
    border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 4px;
    display: flex; flex-direction: column; gap: 1px;
  }
  .pk-more-menu .row {
    display: flex; align-items: center; gap: 7px; width: 100%;
    font: inherit; font-size: 12.5px; font-weight: 600; text-align: left; white-space: nowrap;
    background: transparent; border: 0; color: inherit; padding: 6px 10px; border-radius: 7px; cursor: pointer;
  }
  .pk-more-menu .row:hover { background: var(--wa-panel); }
  .pk-more-menu .row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pk-more-menu .pk-tab-glyph svg { width: 14px; height: 14px; }
  .pk-more-menu .pk-tab-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* Every tab alike but for its device's color (--dc, device-colors.ts) on the
     glyph and the selected one's underline. */
  .pk-tab {
    display: inline-flex; align-items: center; gap: 7px; flex: none; cursor: pointer;
    font: inherit; font-size: 12.5px; font-weight: 500; color: var(--wa-muted); white-space: nowrap;
    padding: 10px 7px; border: 0; background: transparent;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
  }
  .pk-tab:hover { color: var(--wa-ink); }
  .pk-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 7px 7px 0 0; }
  .pk-tab.on { color: var(--wa-ink); font-weight: 600; border-bottom-color: var(--dc, var(--wa-ink)); }
  .pk-tab svg { width: 15px; height: 15px; }
  .pk-tab-glyph { display: inline-flex; flex: none; color: var(--dc, var(--wa-muted)); }
  .pk-tab-count { font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
`;export{I as a,C as b,G as c,L as d,H as e,j as f,R as g,P as h,z as i,p as j,U as k,Y as l,q as m,V as n,Q as o,Z as p,ee as q,ne as r,re as s,te as t,oe as u,ie as v,se as w,ae as x,ce as y,le as z,de as A,S as B,he as C,$ as D,we as E,be as F,me as G,xe as H,ye as I,E as J,ve as K};
