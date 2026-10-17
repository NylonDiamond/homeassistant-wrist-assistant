import{z as _}from"./chunk-B2GPRRUP.js";import{e as A,f as y,h as M}from"./chunk-UPANJPAF.js";import{k as S,l as O,n as m,o as P,q as L}from"./chunk-ESIOP3D4.js";import{b as v}from"./chunk-NKLOQSX6.js";import{b as I,d as u,g as f,mh as b}from"./chunk-VWIMYR2L.js";import{R as T,U as E,X as W,Y as x,g as R}from"./chunk-Q6MTLD6E.js";var C="linkId";function ne(e,n){let o=T(e,n);return o.map(t=>({ownerId:t.owner_watch_id,name:E(t,o),kind:R(t)==="iphone"?"iphone":"watch"}))}function k(e){return e==="iphone"?"iPhone":"watch"}var w=e=>e.toUpperCase();function D(e){let n=e?.[C];return typeof n=="string"&&n!==""?n:void 0}function H(e,n,o){let t=D(e),r=t===void 0?[]:o?.pages[t]??[];return[n,...r.filter(i=>i!==n)]}var F="Delete takes it off this device.",N="A system page stays on its own device.";function te(e,n,o,t,r=new Set){let i=new Set(H(n,o,t)),s=L(n);return e.map(d=>{let a=d.ownerId===o,c=i.has(d.ownerId);if(!s&&!a&&!c&&r.has(d.ownerId))return{device:d,on:c,here:!1,stuck:z,tag:G};let p=s?N:a?F:void 0;return{device:d,on:c,here:a,...p===void 0?{}:{stuck:p}}})}function oe(e){return{held:e.revision>0,free:e.multiple_pages===!1}}var G="waiting for iPhone",z=`${x} Pages can go on this watch after that.`;function re(e,n){return new Set(e.filter(o=>n.get(o.owner_watch_id)?.held===!1&&W(o)==="wait").map(o=>o.owner_watch_id))}function ie(e){if(e.length!==0)return`On the free plan, ${$(e)} ${e.length===1?"shows only its":"show only their"} first page.`}function V(e,n,o){let t=e?.[C],r=typeof t=="string"&&t!==""?o?.status_pages[t]??[]:[];return[n,...r.filter(i=>i!==n)]}function ae(e,n,o,t){let r=e.map(l=>V(l,n,o).filter(g=>g!==n)),i=r.filter(l=>l.length>0).length;if(i===0)return;let s=new Set(r.flat()),d=t.filter(l=>s.has(l.ownerId)).map(l=>l.name),a=[...s].filter(l=>!t.some(g=>g.ownerId===l)).length,c=a===0?d:[...d,a===1?"another device":`${a} other devices`];return`${i===e.length?i===1?"This status page is":"These status pages are":`${i} of these status pages ${i===1?"is":"are"}`} also on ${$(c)}. An edit here shows there too.`}function se(e,n,o){let t=e.filter(r=>r!==n);if(t.length!==0){if(t.length===1){let r=o.find(i=>i.ownerId===t[0])?.name;return r===void 0?"On 2 devices":`Also on ${r}`}return`On ${e.length} devices`}}function de(e,n,o,t){let r=n===void 0?[]:O(n),i=new Set(r.map(a=>w(m(a)))),s=new Set(r.flatMap(a=>D(a)??[])),d=[];for(let a of o){if(a.ownerId===e)continue;let c=t.get(a.ownerId);if(c===void 0)continue;let p=[];for(let l of A(c)){let g=m(l);if(g===""||i.has(w(g)))continue;let h=D(l);if(h!==void 0){if(s.has(h))continue;s.add(h)}p.push({ownerId:a.ownerId,pageId:g,name:P(l),page:l,...h===void 0?{}:{linkId:h}})}p.length>0&&d.push({device:a,pages:p})}return d}function ce(e){return`Not on this ${k(e)}`}function pe(e){let n=e.reduce((o,t)=>o+t.pages.length,0);if(n!==0)return`${n} ${n===1?"page":"pages"} on other devices.`}function le(e,n){if(!(e.length<2))return{here:`Delete on this ${k(n)}`,all:`Delete on all ${e.length} devices`,count:e.length}}function $(e){return e.length<=1?e[0]??"":`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function ue(e,n,o,t){let r=e.targets?.[n];if(r===void 0)return;let i=new Set(o.map(w)),s=(r.pages??[]).filter(c=>!i.has(w(c))).map(c=>{let p=t===void 0?void 0:y(t,c);return p===void 0?"a page":P(p)}),d=(r.status_pages??[]).length,a=[...s];return d>0&&a.push(d===1?"1 status page":`${d} status pages`),a.length===0?void 0:`Also added: ${$(a)}.`}function ge(e){let{code:n,message:o}=v(e);switch(n){case"unknown_device":return"That device is not paired with this Home Assistant any more.";case"not_found":return"That page is not saved there yet. Save first, then try again.";case"system_page":return N;case"id_taken":return"That device already has a page of its own with the same id, so it was not added.";case"unknown_command":return"This version of the integration cannot share pages between devices. Update it first.";case"awaiting_move":return`${x} Try again after that.`;default:return o}}var j={document:S,find:(e,n)=>{let o=y(e,n);return o===void 0?void 0:m(o)},remove:(e,n)=>M(e,n)},K=3;async function fe(e,n,o){let t=await X(e,n,[o]);return t.ok?{ok:!0,removed:t.removed.length>0}:t}async function X(e,n,o){return U(e,n,o,j)}async function U(e,n,o,t){for(let r=1;;r++){let i;try{i=await e.read(n)}catch(c){let{code:p="unknown",message:l}=v(c);return{ok:!1,code:p,message:l}}let s=i.revision>0?t.document(i.document):void 0;if(s===void 0)return{ok:!0,removed:[]};let d=s,a=[];for(let c of o){let p=t.find(d,c);p!==void 0&&(a.push(p),d=t.remove(d,c))}if(a.length===0)return{ok:!0,removed:a};try{return await e.save(n,i.revision,d),{ok:!0,removed:a}}catch(c){let{code:p="unknown",message:l}=v(c);if(p!=="conflict"||r>=K)return{ok:!1,code:p,message:l}}}}var Y="On means the page is on that device. An edit on one device shows on all of them. Each device keeps its own order and Hidden.";function xe(e){let{name:n,places:o,blocked:t,busy:r,note:i}=e;return u`<div class="pk-dup-menu pe-dev-menu ${e.className??""}" role="group" aria-label=${`Devices for ${n}`}>
    <div class="pk-dup-head">${e.head??"This page is on"}</div>
    ${t===void 0?f:u`<div class="pe-dev-note warn">${t}</div>`}
    ${o.map(s=>B({place:s,name:n,title:s.stuck??t??e.titleOf?.(s)??(s.on?`Take it off ${s.device.name}. Its own order and Hidden go with it.`:`Put it on ${s.device.name}. An edit on one device then shows on both.`),off:s.stuck!==void 0||t!==void 0||r,...e.colorOf===void 0?{}:{colorOf:e.colorOf},onToggle:e.onToggle}))}
    ${r?u`<div class="pe-dev-note">Saving…</div>`:f}
    ${i===void 0?f:u`<div class="pe-dev-note ${i.kind}" role="status">${i.text}</div>`}
    <div class="pk-dup-note">${e.foot??Y}</div>
    <button type="button" class="pk-dup-done" @click=${()=>e.onDone()}>Done</button>
  </div>`}function B(e){let{place:n,off:o}=e,t=n.device.name,r=e.colorOf?.(n.device.ownerId);return u`<div class="pk-dup-row check ${o?"off":""} ${r===void 0?"":"tinted"}"
    style=${r===void 0?f:`--dc:${r}`}>
    <label class="pk-dup-pick" title=${e.title}>
      <input type="checkbox" role="switch" .checked=${_(n.on)} ?disabled=${o}
        aria-label=${`${e.name} on ${t}`}
        @change=${i=>{i.currentTarget.checked=n.on,e.onToggle(n)}}>
      ${b(n.device.kind==="iphone"?"phone":"watch")}
      <span class="pk-dup-name">${t}</span>
      ${n.here?u`<span class="pk-dup-full">this ${k(n.device.kind)}</span>`:n.tag===void 0?f:u`<span class="pk-dup-full">${n.tag}</span>`}
    </label>
  </div>`}var Pe=I`
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
`;export{C as a,ne as b,k as c,D as d,H as e,F as f,N as g,te as h,oe as i,G as j,z as k,re as l,ie as m,V as n,ae as o,se as p,de as q,ce as r,pe as s,le as t,$ as u,ue as v,ge as w,fe as x,X as y,U as z,xe as A,B,Pe as C};
