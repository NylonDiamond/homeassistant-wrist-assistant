import{z as W}from"./chunk-CZ327BGS.js";import{b as I,d as g,g as f,qh as b}from"./chunk-KWDEJLUK.js";import{e as A,f as $,h as M}from"./chunk-UPANJPAF.js";import{k as L,l as S,n as w,o as y,q as O}from"./chunk-ESIOP3D4.js";import{R as T,U as E,Va as v,X as _,Y as P,g as R}from"./chunk-2ZMALKUC.js";var C="linkId";function ne(e,n){let o=T(e,n);return o.map(t=>({ownerId:t.owner_watch_id,name:E(t,o),kind:R(t)==="iphone"?"iphone":"watch"}))}function x(e){return e==="iphone"?"iPhone":"watch"}var k=e=>e.toUpperCase();function D(e){let n=e?.[C];return typeof n=="string"&&n!==""?n:void 0}function H(e,n,o){let t=D(e),i=t===void 0?[]:o?.pages[t]??[];return[n,...i.filter(r=>r!==n)]}var F="Delete takes it off this device.",N="A system page stays on its own device.";function te(e,n,o,t,i=new Set){let r=new Set(H(n,o,t)),a=O(n);return e.map(c=>{let s=c.ownerId===o,l=r.has(c.ownerId);if(!a&&!s&&!l&&i.has(c.ownerId))return{device:c,on:l,here:!1,stuck:j,tag:G};let p=a?N:s?F:void 0;return{device:c,on:l,here:s,...p===void 0?{}:{stuck:p}}})}function oe(e){return{held:e.revision>0,free:e.multiple_pages===!1}}var G="waiting for iPhone",j=`${P} Pages can go on this watch after that.`;function ie(e,n){return new Set(e.filter(o=>n.get(o.owner_watch_id)?.held===!1&&_(o)==="wait").map(o=>o.owner_watch_id))}function re(e){if(e.length!==0)return`On the free plan, ${h(e)} ${e.length===1?"shows only its":"show only their"} first page.`}function z(e,n,o){let t=e?.[C],i=typeof t=="string"&&t!==""?o?.status_pages[t]??[]:[];return[n,...i.filter(r=>r!==n)]}function se(e,n,o,t){let i=e.map(d=>z(d,n,o).filter(u=>u!==n)),r=i.filter(d=>d.length>0).length;if(r===0)return;let a=new Set(i.flat()),c=t.filter(d=>a.has(d.ownerId)).map(d=>d.name),s=[...a].filter(d=>!t.some(u=>u.ownerId===d)).length,l=s===0?c:[...c,s===1?"another device":`${s} other devices`];return`${r===e.length?r===1?"This status page is":"These status pages are":`${r} of these status pages ${r===1?"is":"are"}`} also on ${h(l)}. An edit here shows there too.`}function ae(e,n,o){let t=e.filter(i=>i!==n);if(t.length!==0){if(t.length===1){let i=o.find(r=>r.ownerId===t[0])?.name;return i===void 0?"On 2 devices":`Also on ${i}`}return`On ${e.length} devices`}}function de(e,n,o,t){let i=n===void 0?[]:S(n),r=new Set(i.map(s=>k(w(s)))),a=new Set(i.flatMap(s=>D(s)??[])),c=[];for(let s of o){if(s.ownerId===e)continue;let l=t.get(s.ownerId);if(l===void 0)continue;let p=[];for(let d of A(l)){let u=w(d);if(u===""||r.has(k(u)))continue;let m=D(d);if(m!==void 0){if(a.has(m))continue;a.add(m)}p.push({ownerId:s.ownerId,pageId:u,name:y(d),page:d,...m===void 0?{}:{linkId:m}})}p.length>0&&c.push({device:s,pages:p})}return c}function ce(e){return`Not on this ${x(e)}`}function pe(e){let n=e.reduce((o,t)=>o+t.pages.length,0);if(n!==0)return`${n} ${n===1?"page":"pages"} on other devices.`}function le(e,n){if(!(e.length<2))return{here:`Delete on this ${x(n)}`,all:`Delete on all ${e.length} devices`,count:e.length}}function h(e){return e.length<=1?e[0]??"":`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function ue(e,n,o,t){let i=e.targets?.[n];if(i===void 0)return;let r=new Set(o.map(k)),a=(i.pages??[]).filter(d=>!r.has(k(d))).map(d=>{let u=t===void 0?void 0:$(t,d);return u===void 0?"a page":y(u)}),c=(i.status_pages??[]).length,s=[...a];c>0&&s.push(c===1?"1 status page":`${c} status pages`);let l=(i.adopted_status_pages??[]).length,p=[];return s.length>0&&p.push(`Also added: ${h(s)}.`),l>0&&p.push(l===1?"Linked its own copy of 1 status page, which now matches.":`Linked its own copies of ${l} status pages, which now match.`),p.length===0?void 0:p.join(" ")}function ge(e,n){let o=[];for(let t of e){let i=t.now===void 0?[]:t.holders(t.now),r=t.restored===void 0?[]:t.holders(t.restored);if(t.now!==void 0&&t.restored===t.now){i.length>0&&o.push(`Also changes the ${t.name} on ${h(i)}.`);continue}if(i.length>0){let a=i.length===1?"which keeps its copy as it is":"which keep their copies as they are";o.push(`Unlinks the ${t.name} on this ${n} from ${h(i)}, ${a}.`)}r.length>0&&o.push(`Also changes the ${t.name} on ${h(r)}, which it was shared with in that save.`)}return o}function fe(e){let{code:n,message:o}=v(e);switch(n){case"unknown_device":return"That device is not paired with this Home Assistant any more.";case"not_found":return"That page is not saved there yet. Save first, then try again.";case"system_page":return N;case"id_taken":return"That device already has a page of its own with the same id, so it was not added.";case"unknown_command":return"This version of the integration cannot share pages between devices. Update it first.";case"awaiting_move":return`${P} Try again after that.`;default:return o}}var U={document:L,find:(e,n)=>{let o=$(e,n);return o===void 0?void 0:w(o)},remove:(e,n)=>M(e,n)},V=3;async function he(e,n,o){let t=await K(e,n,[o]);return t.ok?{ok:!0,removed:t.removed.length>0}:t}async function K(e,n,o){return X(e,n,o,U)}async function X(e,n,o,t){for(let i=1;;i++){let r;try{r=await e.read(n)}catch(l){let{code:p="unknown",message:d}=v(l);return{ok:!1,code:p,message:d}}let a=r.revision>0?t.document(r.document):void 0;if(a===void 0)return{ok:!0,removed:[]};let c=a,s=[];for(let l of o){let p=t.find(c,l);p!==void 0&&(s.push(p),c=t.remove(c,l))}if(s.length===0)return{ok:!0,removed:s};try{return await e.save(n,r.revision,c),{ok:!0,removed:s}}catch(l){let{code:p="unknown",message:d}=v(l);if(p!=="conflict"||i>=V)return{ok:!1,code:p,message:d}}}}var Y="On means the page is on that device. An edit on one device shows on all of them. Each device keeps its own order and Hidden.";function Pe(e){let{name:n,places:o,blocked:t,busy:i,note:r}=e;return g`<div class="pk-dup-menu pe-dev-menu ${e.className??""}" role="group" aria-label=${`Devices for ${n}`}>
    <div class="pk-dup-head">${e.head??"This page is on"}</div>
    ${t===void 0?f:g`<div class="pe-dev-note warn">${t}</div>`}
    ${o.map(a=>B({place:a,name:n,title:a.stuck??t??e.titleOf?.(a)??(a.on?`Take it off ${a.device.name}. Its own order and Hidden go with it.`:`Put it on ${a.device.name}. An edit on one device then shows on both.`),off:a.stuck!==void 0||t!==void 0||i,...e.colorOf===void 0?{}:{colorOf:e.colorOf},onToggle:e.onToggle}))}
    ${i?g`<div class="pe-dev-note">Saving…</div>`:f}
    ${r===void 0?f:g`<div class="pe-dev-note ${r.kind}" role="status">${r.text}</div>`}
    <div class="pk-dup-note">${e.foot??Y}</div>
    <button type="button" class="pk-dup-done" @click=${()=>e.onDone()}>Done</button>
  </div>`}function B(e){let{place:n,off:o}=e,t=n.device.name,i=e.colorOf?.(n.device.ownerId);return g`<div class="pk-dup-row check ${o?"off":""} ${i===void 0?"":"tinted"}"
    style=${i===void 0?f:`--dc:${i}`}>
    <label class="pk-dup-pick" title=${e.title}>
      <input type="checkbox" role="switch" .checked=${W(n.on)} ?disabled=${o}
        aria-label=${`${e.name} on ${t}`}
        @change=${r=>{r.currentTarget.checked=n.on,e.onToggle(n)}}>
      ${b(n.device.kind==="iphone"?"phone":"watch")}
      <span class="pk-dup-name">${t}</span>
      ${n.here?g`<span class="pk-dup-full">this ${x(n.device.kind)}</span>`:n.tag===void 0?f:g`<span class="pk-dup-full">${n.tag}</span>`}
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
`;export{C as a,ne as b,x as c,D as d,H as e,F as f,N as g,te as h,oe as i,G as j,j as k,ie as l,re as m,z as n,se as o,ae as p,de as q,ce as r,pe as s,le as t,h as u,ue as v,ge as w,fe as x,he as y,K as z,X as A,Pe as B,B as C,ye as D};
