import{k as L,l as $}from"./chunk-DYHBMLHT.js";import{b as P,c as R,d as y,f as p}from"./chunk-F4HBQD4N.js";import{ha as w,ua as k}from"./chunk-RX7CVI6P.js";import{j as c}from"./chunk-ESIOP3D4.js";import{Eg as x,Gg as v,b,d as u,g,jg as f,qg as m}from"./chunk-PGBBLK6E.js";function j(e,n,r){return`${e} ${e===1?n:r}`}async function C(e,n,r,o=[],t=!1){let s=await x(e,n,"menus");if(s.revision<=0||!c(s.document))return 0;let i=s.document,a=t?R(i,r,o):P(i,r,o);return a===i?0:(await v(e,n,"menus",s.revision,a),y(i,r,t)-y(a,r,t))}async function K(e,n,r,o=[]){let t=0,s=0,i=[];try{t=await C(e,n,r,o)}catch{i.push("the menus"),t=0}try{let l=await f(e,n);for(let d of l.records){if(d.deleted||!c(d.document))continue;let h=p(d.document,r);if(h!==void 0)try{await m(e,n,h,d.revision),s++}catch{i.push(`"${typeof d.document.name=="string"?d.document.name:"a complication"}"`)}}}catch{i.push("the complications")}let a=[t>0?j(t,"menu slot","menu slots"):void 0,s>0?`the tap of ${j(s,"complication","complications")}`:void 0].filter(l=>l!==void 0);if(i.length>0)return{kind:"warn",text:`Saved. Could not clear the deleted page from ${i.join(", ")}: change ${i.length===1?"it":"them"} by hand.`};if(a.length!==0)return{kind:"ok",text:`Saved. Cleared the deleted page from ${a.join(" and ")}.`}}function F(e,n,r){return`${e} ${e===1?n:r}`}async function _(e,n,r){let o=0,t=[];for(let s of n)try{let i=await f(e,s);for(let a of i.records){if(a.deleted||!c(a.document))continue;let l=p(a.document,r);if(l!==void 0)try{await m(e,s,l,a.revision),o++}catch{t.push(`"${typeof a.document.name=="string"?a.document.name:"a complication"}"`)}}}catch{t.push("the complications")}if(t.length>0)return{kind:"warn",text:`Could not clear the deleted page from ${t.join(", ")}: change ${t.length===1?"it":"them"} by hand.`};if(o!==0)return{kind:"ok",text:`Cleared the deleted page from the tap of ${F(o,"complication","complications")}.`}}function B(e,n,r,o){let t=e?.library;return t===void 0?[]:o.filter(s=>{let i=w(t,n,s);return i.length>0&&i.every(a=>a.toUpperCase()===r.toUpperCase())})}async function E(e,n,r){if(e!==void 0)for(let o of r)await e.deleteItem(n,o)}function V(e){let{rows:n,here:r}=e;if(n.length===0)return g;let o=L(r.kind);return u`<div class="lb-rest ${e.standalone===!0?"standalone":""}" role="group" aria-label=${o}>
    <div class="lb-rest-h"><span class="lb-rest-t">${o}</span><small>${n.length}</small>
      <span class="lb-rest-sp"></span>${e.more??g}</div>
    <p class="lb-rest-hint">${$}</p>
    <ul class="lb-rest-list">${n.map(t=>u`<li class="lb-rest-row" data-item=${t.entry.id}>
      ${e.picture(t.entry)}
      <span class="lb-rest-name"><b title=${t.entry.name}>${t.entry.name}</b><small>${t.meta}</small></span>
      ${k({library:e.library,kind:e.kind,itemId:t.entry.id,devices:[r],addFor:r.ownerId,colorOf:e.colorOf,...e.pending===void 0?{}:{pending:e.pending},...e.noteFor(t.entry.id)===void 0?{}:{note:e.noteFor(t.entry.id)},...e.admin===void 0?{}:{admin:e.admin},...e.locked===void 0?{}:{locked:()=>e.locked}},(s,i)=>{i&&e.onAdd(t.entry.id)})}
    </li>`)}</ul>
  </div>`}var X=b`
  .lb-rest { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px 12px; border-top: 1px solid var(--wa-line); }
  .lb-rest.standalone { align-self: stretch; max-width: 460px; width: 100%; margin: 12px auto 0; border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px); }
  .lb-rest-h { display: flex; align-items: baseline; gap: 6px; font-size: 12px; font-weight: 650; color: var(--wa-ink); }
  .lb-rest-h small { font-size: 11px; font-weight: 500; color: var(--wa-muted); }
  .lb-rest-sp { flex: 1; }
  .lb-rest-h a { font-size: 12px; font-weight: 500; color: var(--wa-accent); text-decoration: none; }
  .lb-rest-h a:hover { text-decoration: underline; }
  .lb-rest-hint { margin: 0; font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
  .lb-rest-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
  .lb-rest-row { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 4px 0; opacity: .8; }
  .lb-rest-row:hover { opacity: 1; }
  .lb-rest-name { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
  .lb-rest-name b { font-size: 12.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lb-rest-name small { font-size: 11px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lb-rest-row .lt-ticks { flex: none; max-width: 50%; }
`;export{C as a,K as b,_ as c,B as d,E as e,V as f,X as g};
