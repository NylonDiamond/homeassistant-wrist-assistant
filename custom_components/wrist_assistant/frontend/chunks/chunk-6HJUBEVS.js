import{b as L}from"./chunk-VFPAPAIC.js";import{A as k,B as w,E,M as J,f as M,l as j,m as R,u as D,x as A}from"./chunk-QHA6VOTK.js";import{b as N,u as S,v as T}from"./chunk-CYVKJR6X.js";import{d as h}from"./chunk-UPANJPAF.js";import{j as O}from"./chunk-C5WTPD4K.js";import{j as c}from"./chunk-ESIOP3D4.js";import{Eg as g,Gg as m,Hg as P,b as x,d as p,g as l,jg as y,kh as $,qg as b}from"./chunk-IHFAZWMC.js";var q="navigateToPage",K="pageId";function W(n){let t=[{ref:A,where:"Anywhere menu"}],e=new Set;for(let i of D())e.has(i.slotKey)||(e.add(i.slotKey),t.push({ref:{list:"domain",domain:i.domain},where:`Entity quick menu, ${i.label}`}));let o=M(n,"entityRadial").entityOverrides;if(c(o))for(let i of Object.keys(o))t.push({ref:{list:"entity",entityId:i},where:`Entity quick menu for ${i}`});return t}function I(n,t){if(j(n)!==q)return!1;let e=R(n)[K];return t.some(o=>h(e,o))}function _(n,t){if(n===void 0)return[];let e=[];for(let{ref:o,where:i}of W(n))for(let r of k(n,o)){if(!I(r,[t]))continue;let a=typeof r.position=="string"?E(r.position):"";e.push({ref:o,slotId:w(r),where:i,position:a})}return e}function H(n,t){let e=n;for(let{ref:o}of W(n))for(let i of k(e,o))I(i,t)&&(e=J(e,o,w(i)));return e}function v(n,t){return t.some(e=>h(n.openPageId,e))}function Y(n){return(Array.isArray(n.elements)?n.elements:[]).filter(e=>c(e)&&e.kind==="tap"&&c(e.payload)).map(e=>e.payload)}function Z(n,t){let e=[];for(let o of n){let i=o.document;if(o.deleted||!c(i))continue;let r=v(i,[t]),a=Y(i).filter(d=>v(d,[t])).length;if(!r&&a===0)continue;let s=typeof i.name=="string"&&i.name.trim()!==""?i.name:"A complication";e.push({id:o.id,name:s,whole:r,layers:a})}return e}function C(n,t){let{openPageId:e,openPageName:o,...i}=n,r=i[t];return c(r)&&r.type==="openPage"&&(i[t]={type:"none"}),i}function z(n,t){let e=!1,o=n;if(v(n,t)&&(o=C(n,"tapAction"),e=!0),Array.isArray(n.elements)){let i=n.elements.map(r=>!c(r)||r.kind!=="tap"||!c(r.payload)||!v(r.payload,t)?r:(e=!0,{...r,payload:C(r.payload,"action")}));e&&(o={...o,elements:i})}return e?o:void 0}function ee(n,t){return n.map(e=>e.id).filter(e=>typeof e=="string"&&e!=="").filter(e=>!t.some(o=>h(o.id,e)))}function F(n,t,e){return`${n} ${n===1?t:e}`}async function G(n,t,e){let o=0,i=0,r=[];try{let s=await g(n,t,"menus");if(s.revision>0&&c(s.document)){let d=H(s.document,e);d!==s.document&&(o=e.reduce((u,f)=>u+_(s.document,f).length,0),await m(n,t,"menus",s.revision,d))}}catch{r.push("the menus"),o=0}try{let s=await y(n,t);for(let d of s.records){if(d.deleted||!c(d.document))continue;let u=z(d.document,e);if(u!==void 0)try{await b(n,t,u,d.revision),i++}catch{r.push(`"${typeof d.document.name=="string"?d.document.name:"a complication"}"`)}}}catch{r.push("the complications")}let a=[o>0?F(o,"menu slot","menu slots"):void 0,i>0?`the tap of ${F(i,"complication","complications")}`:void 0].filter(s=>s!==void 0);if(r.length>0)return{kind:"warn",text:`Saved. Could not clear the deleted page from ${r.join(", ")}: change ${r.length===1?"it":"them"} by hand.`};if(a.length!==0)return{kind:"ok",text:`Saved. Cleared the deleted page from ${a.join(" and ")}.`}}function se(n){return{link:(t,e,o)=>P(n,t,e,[o]),remove:(t,e)=>T({read:o=>g(n,o,"pages"),save:(o,i,r)=>m(n,o,"pages",i,r)},t,e),clearRefs:(t,e)=>G(n,t,e)}}async function de(n,t,e,o){if(!n)return`Not taken off ${o}.`;if(L(t)?.dirty??!1)return`Not taken off ${o}: its pages have unsaved edits. Save or discard them first.`;let i=await S({read:r=>g(n,r,"pages"),save:(r,a,s)=>m(n,r,"pages",a,s)},t,e);if(!i.ok)return`Not taken off ${o}: ${i.message}`;i.removed&&await G(n,t,[e])}var U="On means the page is on that device. An edit on one device shows on all of them. Each device keeps its own order and Hidden.";function ge(n){let{name:t,places:e,blocked:o,busy:i,note:r}=n;return p`<div class="pk-dup-menu pe-dev-menu ${n.className??""}" role="group" aria-label=${`Devices for ${t}`}>
    <div class="pk-dup-head">This page is on</div>
    ${o===void 0?l:p`<div class="pe-dev-note warn">${o}</div>`}
    ${e.map(a=>{let s=a.device.name,d=a.stuck!==void 0||o!==void 0||i,u=a.stuck??o??(a.on?`Take it off ${s}. Its own order and Hidden go with it.`:`Put it on ${s}. An edit on one device then shows on both.`),f=n.colorOf?.(a.device.ownerId);return p`<div class="pk-dup-row check ${d?"off":""} ${f===void 0?"":"tinted"}"
        style=${f===void 0?l:`--dc:${f}`}>
        <label class="pk-dup-pick" title=${u}>
          <input type="checkbox" role="switch" .checked=${O(a.on)} ?disabled=${d}
            aria-label=${`${t} on ${s}`}
            @change=${B=>{B.currentTarget.checked=a.on,n.onToggle(a)}}>
          ${$(a.device.kind==="iphone"?"phone":"watch")}
          <span class="pk-dup-name">${s}</span>
          ${a.here?p`<span class="pk-dup-full">this ${N(a.device.kind)}</span>`:a.tag===void 0?l:p`<span class="pk-dup-full">${a.tag}</span>`}
        </label>
      </div>`})}
    ${i?p`<div class="pe-dev-note">Saving…</div>`:l}
    ${r===void 0?l:p`<div class="pe-dev-note ${r.kind}" role="status">${r.text}</div>`}
    <div class="pk-dup-note">${U}</div>
    <button type="button" class="pk-dup-done" @click=${()=>n.onDone()}>Done</button>
  </div>`}var me=x`
  .pk-dup-menu {
    display: flex; flex-direction: column; gap: 4px; padding: 8px; cursor: default;
    border: 1px solid var(--wa-line-strong); border-radius: 10px;
    background: var(--wa-card); box-shadow: var(--wa-shadow-pop); text-align: left;
  }
  .pk-dup-row {
    display: flex; align-items: center; gap: 7px; width: 100%; text-align: left; cursor: pointer;
    font: inherit; font-size: 12px; color: var(--wa-ink);
    padding: 5px 7px; border: 1px solid var(--wa-line); border-radius: 7px; background: var(--wa-card);
  }
  .pk-dup-row svg { flex: none; width: 14px; height: 14px; }
  .pk-dup-row.check { padding: 0; gap: 0; cursor: default; }
  .pk-dup-pick { flex: 1; min-width: 0; display: flex; align-items: center; gap: 7px; padding: 5px 7px; cursor: pointer; }
  .pk-dup-pick svg { flex: none; width: 14px; height: 14px; }
  .pk-dup-row.check input { margin: 0; cursor: inherit; }
  .pk-dup-row.check.off .pk-dup-pick { opacity: .5; cursor: default; }
  .pk-dup-row.tinted { box-shadow: inset 3px 0 0 var(--dc); }
  .pk-dup-row.tinted .pk-dup-pick svg { color: var(--dc); }
  .pk-dup-row.check:hover:not(.off) { border-color: var(--wa-line-strong); }
  .pk-dup-head { font-size: 11.5px; font-weight: 700; color: var(--wa-muted); margin: 2px 0; }
  .pk-dup-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pk-dup-full { flex: none; font-size: 10px; color: var(--wa-muted); }
  .pk-dup-note { font-size: 10px; line-height: 1.4; color: var(--wa-muted); border-top: 1px solid var(--wa-line); padding-top: 6px; }
  .pk-dup-done {
    align-self: flex-end; margin-top: 2px; font: inherit; font-size: 11px; font-weight: 600;
    padding: 4px 12px; border-radius: 7px; cursor: pointer;
    border: 1px solid var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent);
  }
  .pk-dup-done:hover { filter: brightness(1.1); }
  .pk-dup-done:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pe-dev-note { font-size: 11px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  .pe-dev-note.ok { color: var(--wa-ok, var(--wa-ink)); }
  .pe-dev-note.warn, .pe-dev-note.err { color: var(--wa-need); }
`;export{_ as a,Z as b,ee as c,G as d,se as e,de as f,ge as g,me as h};
