import{De as T,oh as g}from"./chunk-IBZGIRVS.js";import{p as h}from"./chunk-67Q3RFPP.js";import{b as v,f as l,i as f}from"./chunk-6ZDBXU6B.js";var L="all";function w(e,n){let t=e.findIndex(r=>r.ownerId===n);return t<0?e.length:t}function P(e,n){let t=e.toLocaleLowerCase(),r=n.toLocaleLowerCase();return t<r?-1:t>r?1:0}function A(e){return e.linkId!==void 0&&e.linkId!==""?`link:${e.linkId}`:`rec:${e.ownerId}\0${e.id}`}function j(e,n,t){let r=new Map;for(let i of e){let o=A(i),c=r.get(o);c?c.push(i):r.set(o,[i])}let s=[];for(let[i,o]of r){let c=[...o].sort((k,y)=>w(n,k.ownerId)-w(n,y.ownerId)||k.slot-y.slot),a=c[0];if(!a)continue;let d=c.find(k=>k.ownerId===t)??a;s.push({key:i,name:d.name,copies:c,open:d})}return s}function D(e,n){return e.filter(t=>t.copies.some(r=>r.ownerId===n))}function z(e,n,t){let r=[],s=new Set(n),i=new Set;for(let o of n){if(i.has(o))continue;let c=e.find(d=>t(d).includes(o)),a=c?[...t(c)]:[o];if(a.some(d=>!s.has(d)))return;for(let d of a)i.add(d);r.push(a)}return r}function U(e,n){return n?{deleteAsk:e===1?"Delete 1 design from every device it is on? Faces and widgets using it lose it.":`Delete ${e} designs from every device they are on? Faces and widgets using them lose them.`,deleteTitle:"Delete these designs from every device they are on",takeOff:"Take off everywhere",takeOffTitle:`Take these designs off every device they are on. Each one is kept, under ${p}.`}:{deleteAsk:`Delete ${e}? Faces and widgets using them lose them.`,deleteTitle:"Delete these complications",takeOff:"Take off",takeOffTitle:`Take each of these off the device its card is under. The last copy of a design is kept, under ${p}.`}}function R(e){return e.copies.length>0&&e.copies.every(n=>n.ownerId===h)}function N(e){let n;for(let t of e)for(let r of t.copies)if(n===void 0)n=r.ownerId;else if(n!==r.ownerId)return;return n}function I(e,n,t){let r=t??N(e),s=(i,o)=>i.copies.find(c=>c.ownerId===o)?.slot??Number.MAX_SAFE_INTEGER;return r!==void 0?[...e].sort((i,o)=>s(i,r)-s(o,r)||P(i.name,o.name)):[...e].sort((i,o)=>P(i.name,o.name)||w(n,i.copies[0]?.ownerId??"")-w(n,o.copies[0]?.ownerId??"")||i.open.slot-o.open.slot)}function Y(e,n,t){return t===L?I(e,n):I(D(e,t),n,t)}var p="Not on a device",q=`the ${p} list`;function b(e){return e.kind==="library"||e.ownerId===h}function O(e){return[...e.filter(n=>!b(n)),...e.filter(b)]}function W(e,n){let t=[{key:L,label:"All",kind:"all",count:e.length}];for(let r of O(n))t.push({key:r.ownerId,label:b(r)?p:r.label,kind:r.kind,count:D(e,r.ownerId).length});return t}function _(e){return e==="iphone"?"iPhone":"watch"}function V(e,n){let t=new Set(e),r=[];for(let s of n){let i=s.devices.filter(o=>t.has(o.ownerId));i.length!==0&&r.push(`${s.label} (${i.map(o=>_(o.kind)).join(", ")})`)}return r.length>0?r.join(" \xB7 "):t.has(h)?p:"On no device yet"}function X(e,n,t){let r=new Map;for(let i of e){let{key:o,label:c}=n(i),a=r.get(o);a?a.rows.push(i):r.set(o,{key:o,label:c,rows:[i]})}let s=i=>{let o=t.indexOf(i);return o<0?t.length:o};return[...r.values()].sort((i,o)=>s(i.key)-s(o.key))}var ee="Empty, no layers",ne="Search by name, person or entity";function te(e){if(e.elements.length>0||e.control!==void 0||e.values.length>0||e.dataSources.length>0||e.notes!==void 0&&e.notes.trim()!==""||e.tapAction.type!=="refresh"&&e.tapAction.type!=="openApp")return!1;for(let n of Object.values(e.perFamily))if(n!==void 0&&(T(n)||n.backgroundColorHex!==void 0||n.backgroundFill!==void 0||n.borderColorHex!==void 0||n.rules.length>0))return!1;return!e.supportedFamilies.includes("inline")}var F=new Set(["entityId","entity_id"]),M=new Set(["displayName"]),K=/\b[a-z_]+\.[a-z0-9_]+\b/g;function B(e){return e.includes("{{")||e.includes("{%")}function re(e){let n=new Set,t=new Set,r=(s,i)=>{if(typeof s=="string"){if(s==="")return;let o=s.toLocaleLowerCase();if(i!==void 0&&F.has(i))n.add(o);else if(i!==void 0&&M.has(i))t.add(o);else if(B(s)){t.add(o);for(let c of o.match(K)??[])n.add(c)}return}if(Array.isArray(s)){for(let o of s)r(o,i);return}if(s!==null&&typeof s=="object")for(let[o,c]of Object.entries(s))r(c,o)};return r(e,void 0),{entities:[...n],words:[...t]}}function oe(e,n,t){return n===""?!1:e.entities.some(r=>r.includes(n))||e.words.some(r=>r.includes(n))?!0:e.entities.some(r=>t(r)?.toLocaleLowerCase().includes(n)===!0)}function S(e,n){let t={all:void 0,shown:[],more:[],shelf:void 0};for(let r of e)r.kind==="all"?t.all=r:r.kind==="library"?t.shelf=r:r.count>0||r.key===n?t.shown.push(r):t.more.push(r);return t}function ie(e,n){let t=[],r=[],s=[];for(let i of e)R(i)?n(i)?s.push(i):r.push(i):t.push(i);return{placed:t,shelved:[...r,...s],empty:s}}function se(e,n){return n>0?`(${e}) \xB7 ${n} empty`:`(${e})`}function ae(e){return e===1?"Delete 1 empty design?":`Delete ${e} empty designs?`}function ce(e){return e===1?"Deleted 1 empty design.":`Deleted ${e} empty designs.`}function de(e,n,t,r){let s=new Map(e);return t===r?s.delete(n):s.set(n,t),s}function le(e){return[...e].sort(([,n],[,t])=>Number(t)-Number(n))}function pe(e,n){return new Map(e.slice(n))}function ue(e){return e.queued>0?e.queued===1?"1 change waits for Save":`${e.queued} changes wait for Save`:e.on===0?"On no device yet. Changes here apply at once":"Changes here apply at once"}function $(e){return e==="all"?"grid":e==="iphone"?"phone":e==="library"?"layers":"watch"}function be(e){let{current:n,open:t,onToggle:r,onPick:s,styleOf:i}=e,o=S(e.tabs,n),c=(a,d="")=>l`<button type="button" role="tab" class="pk-tab ${d} ${a.key===n?"on":""}"
      style=${i(a.key)} id=${`pk-tab-${a.key}`} aria-selected=${a.key===n?"true":"false"}
      aria-controls="pk-tabpanel" @click=${()=>s(a.key)}>
      <span class="pk-tab-glyph" aria-hidden="true">${g($(a.kind))}</span>
      <span class="pk-tab-name">${a.label}</span>
      <span class="pk-tab-count">${a.count}</span>
    </button>`;return l`<div class="pk-tabs" role="tablist" aria-label="Devices">
    ${o.all===void 0?f:c(o.all)}
    ${o.shown.map(a=>c(a))}
    ${o.more.length===0?f:l`<span class="pk-more" data-menu="tabs" role="presentation"
      @keydown=${a=>{a.key==="Escape"&&t&&(a.preventDefault(),a.stopPropagation(),r(!1))}}>
      <button type="button" class="pk-more-btn" aria-haspopup="menu" aria-expanded=${t?"true":"false"}
        title="The devices with nothing on them" @click=${()=>r()}>+${o.more.length} more${g("chevron")}</button>
      ${t?l`<div class="pop-menu pk-more-menu" role="menu" aria-label="The devices with nothing on them">
        ${o.more.map(a=>l`<button type="button" class="row" role="menuitem" style=${i(a.key)}
          @click=${()=>{r(!1),s(a.key)}}>
          <span class="pk-tab-glyph" aria-hidden="true">${g($(a.kind))}</span>
          <span class="pk-tab-name">${a.label}</span><span class="pk-tab-count">${a.count}</span></button>`)}
      </div>`:f}
    </span>`}
    ${o.shelf===void 0?f:l`<span class="pk-vsep" aria-hidden="true"></span>${c(o.shelf,"chip")}`}
  </div>`}var E="not-on-a-device";function me(e){let n=[{key:"all",label:"All",kind:"all",count:e.total}];for(let t of e.devices)n.push({key:t.ownerId,label:t.name,kind:t.kind,count:e.countOf(t.ownerId)});return(e.shelved>0||e.current===E)&&n.push({key:E,label:p,kind:"library",count:e.shelved}),n}var m=new Set;function xe(e){return m.has(e)}function ye(e,n){n?m.add(e):m.delete(e)}var x=new Map;function ve(e,n){return n!==void 0&&x.get(e)===n}function Te(e,n){n===void 0?x.delete(e):x.set(e,n)}var G=3e4,u;function Pe(e){u={ownerId:e,at:Date.now()}}function Ie(){return u!==void 0&&Date.now()-u.at>G&&(u=void 0),u?.ownerId}function Le(){u=void 0}var C=class{constructor(n){this.host=n;this.open=!1;this.toggle=(n=!this.open)=>{n!==this.open&&(this.open=n,n?window.addEventListener("pointerdown",this.outside,{capture:!0}):window.removeEventListener("pointerdown",this.outside,{capture:!0}),this.host.requestUpdate())};this.outside=n=>{n.composedPath().some(t=>t instanceof HTMLElement&&t.dataset.menu==="tabs")||this.toggle(!1)};n.addController(this)}hostDisconnected(){window.removeEventListener("pointerdown",this.outside,{capture:!0}),this.open=!1}},De=v`
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
`;export{L as a,A as b,j as c,D as d,z as e,U as f,R as g,I as h,Y as i,p as j,q as k,W as l,V as m,X as n,ee as o,ne as p,te as q,re as r,oe as s,ie as t,se as u,ae as v,ce as w,de as x,le as y,pe as z,ue as A,$ as B,be as C,E as D,me as E,xe as F,ye as G,ve as H,Te as I,Pe as J,Ie as K,Le as L,C as M,De as N};
