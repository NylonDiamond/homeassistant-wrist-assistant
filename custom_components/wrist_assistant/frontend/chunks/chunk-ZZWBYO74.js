import{z as _}from"./chunk-TXM3PI3S.js";import{b as I,d as u,g as f,qh as b}from"./chunk-KWDEJLUK.js";import{e as A,f as $,h as M}from"./chunk-UPANJPAF.js";import{k as S,l as L,n as w,o as y,q as O}from"./chunk-ESIOP3D4.js";import{R as T,U as E,Va as v,X as W,Y as P,g as R}from"./chunk-2ZMALKUC.js";var C="linkId";function ne(e,n){let o=T(e,n);return o.map(t=>({ownerId:t.owner_watch_id,name:E(t,o),kind:R(t)==="iphone"?"iphone":"watch"}))}function x(e){return e==="iphone"?"iPhone":"watch"}var k=e=>e.toUpperCase();function D(e){let n=e?.[C];return typeof n=="string"&&n!==""?n:void 0}function H(e,n,o){let t=D(e),r=t===void 0?[]:o?.pages[t]??[];return[n,...r.filter(i=>i!==n)]}var F="Delete takes it off this device.",N="A system page stays on its own device.";function te(e,n,o,t,r=new Set){let i=new Set(H(n,o,t)),a=O(n);return e.map(d=>{let s=d.ownerId===o,c=i.has(d.ownerId);if(!a&&!s&&!c&&r.has(d.ownerId))return{device:d,on:c,here:!1,stuck:z,tag:G};let l=a?N:s?F:void 0;return{device:d,on:c,here:s,...l===void 0?{}:{stuck:l}}})}function oe(e){return{held:e.revision>0,free:e.multiple_pages===!1}}var G="waiting for iPhone",z=`${P} Pages can go on this watch after that.`;function re(e,n){return new Set(e.filter(o=>n.get(o.owner_watch_id)?.held===!1&&W(o)==="wait").map(o=>o.owner_watch_id))}function ie(e){if(e.length!==0)return`On the free plan, ${h(e)} ${e.length===1?"shows only its":"show only their"} first page.`}function U(e,n,o){let t=e?.[C],r=typeof t=="string"&&t!==""?o?.status_pages[t]??[]:[];return[n,...r.filter(i=>i!==n)]}function se(e,n,o,t){let r=e.map(p=>U(p,n,o).filter(g=>g!==n)),i=r.filter(p=>p.length>0).length;if(i===0)return;let a=new Set(r.flat()),d=t.filter(p=>a.has(p.ownerId)).map(p=>p.name),s=[...a].filter(p=>!t.some(g=>g.ownerId===p)).length,c=s===0?d:[...d,s===1?"another device":`${s} other devices`];return`${i===e.length?i===1?"This status page is":"These status pages are":`${i} of these status pages ${i===1?"is":"are"}`} also on ${h(c)}. An edit here shows there too.`}function ae(e,n,o){let t=e.filter(r=>r!==n);if(t.length!==0){if(t.length===1){let r=o.find(i=>i.ownerId===t[0])?.name;return r===void 0?"On 2 devices":`Also on ${r}`}return`On ${e.length} devices`}}function de(e,n,o,t){let r=n===void 0?[]:L(n),i=new Set(r.map(s=>k(w(s)))),a=new Set(r.flatMap(s=>D(s)??[])),d=[];for(let s of o){if(s.ownerId===e)continue;let c=t.get(s.ownerId);if(c===void 0)continue;let l=[];for(let p of A(c)){let g=w(p);if(g===""||i.has(k(g)))continue;let m=D(p);if(m!==void 0){if(a.has(m))continue;a.add(m)}l.push({ownerId:s.ownerId,pageId:g,name:y(p),page:p,...m===void 0?{}:{linkId:m}})}l.length>0&&d.push({device:s,pages:l})}return d}function ce(e){return`Not on this ${x(e)}`}function le(e){let n=e.reduce((o,t)=>o+t.pages.length,0);if(n!==0)return`${n} ${n===1?"page":"pages"} on other devices.`}function pe(e,n){if(!(e.length<2))return{here:`Delete on this ${x(n)}`,all:`Delete on all ${e.length} devices`,count:e.length}}function h(e){return e.length<=1?e[0]??"":`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function ue(e,n,o,t){let r=e.targets?.[n];if(r===void 0)return;let i=new Set(o.map(k)),a=(r.pages??[]).filter(c=>!i.has(k(c))).map(c=>{let l=t===void 0?void 0:$(t,c);return l===void 0?"a page":y(l)}),d=(r.status_pages??[]).length,s=[...a];return d>0&&s.push(d===1?"1 status page":`${d} status pages`),s.length===0?void 0:`Also added: ${h(s)}.`}function ge(e,n){let o=[];for(let t of e){let r=t.now===void 0?[]:t.holders(t.now),i=t.restored===void 0?[]:t.holders(t.restored);if(t.now!==void 0&&t.restored===t.now){r.length>0&&o.push(`Also changes the ${t.name} on ${h(r)}.`);continue}if(r.length>0){let a=r.length===1?"which keeps its copy as it is":"which keep their copies as they are";o.push(`Unlinks the ${t.name} on this ${n} from ${h(r)}, ${a}.`)}i.length>0&&o.push(`Also changes the ${t.name} on ${h(i)}, which it was shared with in that save.`)}return o}function fe(e){let{code:n,message:o}=v(e);switch(n){case"unknown_device":return"That device is not paired with this Home Assistant any more.";case"not_found":return"That page is not saved there yet. Save first, then try again.";case"system_page":return N;case"id_taken":return"That device already has a page of its own with the same id, so it was not added.";case"unknown_command":return"This version of the integration cannot share pages between devices. Update it first.";case"awaiting_move":return`${P} Try again after that.`;default:return o}}var V={document:S,find:(e,n)=>{let o=$(e,n);return o===void 0?void 0:w(o)},remove:(e,n)=>M(e,n)},j=3;async function he(e,n,o){let t=await K(e,n,[o]);return t.ok?{ok:!0,removed:t.removed.length>0}:t}async function K(e,n,o){return X(e,n,o,V)}async function X(e,n,o,t){for(let r=1;;r++){let i;try{i=await e.read(n)}catch(c){let{code:l="unknown",message:p}=v(c);return{ok:!1,code:l,message:p}}let a=i.revision>0?t.document(i.document):void 0;if(a===void 0)return{ok:!0,removed:[]};let d=a,s=[];for(let c of o){let l=t.find(d,c);l!==void 0&&(s.push(l),d=t.remove(d,c))}if(s.length===0)return{ok:!0,removed:s};try{return await e.save(n,i.revision,d),{ok:!0,removed:s}}catch(c){let{code:l="unknown",message:p}=v(c);if(l!=="conflict"||r>=j)return{ok:!1,code:l,message:p}}}}var Y="On means the page is on that device. An edit on one device shows on all of them. Each device keeps its own order and Hidden.";function Pe(e){let{name:n,places:o,blocked:t,busy:r,note:i}=e;return u`<div class="pk-dup-menu pe-dev-menu ${e.className??""}" role="group" aria-label=${`Devices for ${n}`}>
    <div class="pk-dup-head">${e.head??"This page is on"}</div>
    ${t===void 0?f:u`<div class="pe-dev-note warn">${t}</div>`}
    ${o.map(a=>B({place:a,name:n,title:a.stuck??t??e.titleOf?.(a)??(a.on?`Take it off ${a.device.name}. Its own order and Hidden go with it.`:`Put it on ${a.device.name}. An edit on one device then shows on both.`),off:a.stuck!==void 0||t!==void 0||r,...e.colorOf===void 0?{}:{colorOf:e.colorOf},onToggle:e.onToggle}))}
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
      ${n.here?u`<span class="pk-dup-full">this ${x(n.device.kind)}</span>`:n.tag===void 0?f:u`<span class="pk-dup-full">${n.tag}</span>`}
    </label>
  </div>`}var ye=I`
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
`;export{C as a,ne as b,x as c,D as d,H as e,F as f,N as g,te as h,oe as i,G as j,z as k,re as l,ie as m,U as n,se as o,ae as p,de as q,ce as r,le as s,pe as t,h as u,ue as v,ge as w,fe as x,he as y,K as z,X as A,Pe as B,B as C,ye as D};
