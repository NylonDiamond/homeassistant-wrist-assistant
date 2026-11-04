import{Ha as y}from"./chunk-BVCT4SXC.js";import{z as b}from"./chunk-GMCHCVFA.js";import{j as $}from"./chunk-TOKIRHDQ.js";import{C as T}from"./chunk-4ILUENBV.js";import{oh as k}from"./chunk-IBZGIRVS.js";import{X as u}from"./chunk-5LB7PZLF.js";import{d as M}from"./chunk-H4AUETPC.js";import{b as f,e as A,g as O}from"./chunk-KXNSKFVY.js";import{d as I,l as m,p as N,q as L,r as h,s as P,t as w}from"./chunk-TCVAOGAG.js";import{b as C,f as p,i as g}from"./chunk-6ZDBXU6B.js";var R={kind:"Map page",newNote:"The whole page is your home's live map on the iPhone.",plainNote:"Tiles you place yourself.",noMap:"Scan a room in the iPhone app first.",switchDetail:"On the iPhone the whole page is your home's live 3D map. The watch shows the Home map tile.",askTitle:"Make this a map page?",ask:e=>`This removes ${e===1?"1 tile":`${e} tiles`}. A map page holds only its Home map tile. Undo brings ${e===1?"it":"them"} back.`,askConfirm:"Make map page",addLabel:"Map page",addHint:"The whole page is your home's live 3D map on the iPhone",addQuestion:"Which floor should the map page show?",addAsk:e=>`A map page holds only its map, so this removes ${e===1?"the 1 tile":`the ${e} tiles`} on this page. Undo brings ${e===1?"it":"them"} back.`,stage:"A map page holds only its Home map tile. Its floor, room and look are in the Map card.",watchNote:"The watch, and an iPhone app before map pages, draw the Home map tile in this look.",phoneNote:"The iPhone draws this floor or room as a live 3D map over the whole page: tap a device to run it, hold it for its controls, tap a room for its devices, two fingers to move and turn.",watchDifference:"The watch shows the Home map tile.",phoneDifference:"The whole page is the live 3D map."};function S(e){return T(e)[0]?.id}function Q(e){return S(e)===void 0?R.noMap:void 0}function D(e){let t=e,n=(o,i)=>{t[o]!==i&&(t=y(t,o,i))};if(n("gridCol",0),n("gridRow",0),n("colSpan",I),Object.hasOwn(t,"groupId")){let{groupId:o,...i}=t;t=i}return t}function B(e,t,n,o){let i=b({id:n},{newId:o?.newId??f});return{...y(O(e,t),h,!0),items:[D(i)]}}function v(e,t){let n=A(e,t);return n===void 0||N(n)||L(n)?void 0:n}function V(e,t){let n=v(e,t);if(n===void 0||w(n))return;let o=P(n);return m(n).filter(i=>i!==o).length}function Z(e,t){let n=v(e,t);if(!(n===void 0||w(n)))return m(n).length}function ee(e,t,n,o){let i=v(e,t);if(i===void 0||w(i)||typeof n!="string"||n==="")return e;let a=D(b({id:n},{newId:o?.newId??f})),s={...i,items:[a]};return Array.isArray(i.groups)&&i.groups.length>0&&(s={...s,groups:[]}),s=y(s,h,!0),x(e,i,s)}function x(e,t,n){if(n===t||!Array.isArray(e.pages))return e;let o=e.pages.slice();return o[o.indexOf(t)]=n,{...e,pages:o}}function ne(e,t,n,o,i){let a=v(e,t);if(a===void 0||typeof n!="boolean")return e;if(!n){if(!Object.hasOwn(a,h))return e;let{[h]:W,...F}=a;return x(e,a,F)}let s=P(a);if(s===void 0&&(typeof o!="string"||o===""))return e;let c=s??b({id:o},{newId:i?.newId??f}),r=D(c),d=m(a),l=a;return d.length===1&&d[0]===r&&Array.isArray(a.items)&&a.items.length===1||(l={...l,items:[r]}),Array.isArray(a.groups)&&a.groups.length>0&&(l={...l,groups:[]}),l[h]!==!0&&(l=y(l,h,!0)),l===a?e:x(e,a,l)}var j="These become two pages. A change to one never reaches the other.",pe="Make a copy needs the page on two devices or more: one keeps it, the others get the copy.",z="dialog.lib-copy";function ce(e,t){let n=t.filter(o=>e.some(i=>u(i,o.ownerId)));return[...n.filter(o=>o.kind==="watch"),...n.filter(o=>o.kind==="iphone")]}function E(e,t){let n=new Set(t.map(i=>i.kind)),o=n.size!==1?"copy":n.has("iphone")?"iPhone":"Watch";return`${e} (${o})`}function le(e,t,n,o=[]){let i=n.filter(a=>o.some(s=>u(s,a.ownerId))).map(a=>a.ownerId);return{itemId:e,name:t,owners:i,named:!1,busy:!1,copyName:E(t,n.filter(a=>i.includes(a.ownerId)))}}function de(e,t,n,o){let i=o?t.filter(r=>u(r.ownerId,n)||e.owners.some(d=>u(d,r.ownerId))).map(r=>r.ownerId):e.owners.filter(r=>!u(r,n)),{note:a,...s}=e,c=e.named?e.copyName:E(e.name,t.filter(r=>i.includes(r.ownerId)));return{...s,owners:i,copyName:c}}function H(e,t){if(e.owners.length===0)return"Tick the devices that get the copy.";if(t.length>0&&t.every(n=>e.owners.some(o=>u(o,n.ownerId))))return`Leave ${e.name} on at least one device. To change it everywhere, just edit it.`;if(e.copyName.trim()==="")return"Give the copy a name."}function _(e,t){return(e??[]).map(n=>{let o=t.find(i=>u(i.ownerId,n.owner_id))?.name;return o===void 0?n.what:`${o}: ${n.what}`})}function G(e,t){return`${e.name} is on ${M(e.devices)} now. ${t} stays on the other devices.`}async function ue(e,t,n,o){let i=H(t,n);if(i!==void 0)return{...t,note:{kind:"warn",text:i}};let a=t.copyName.trim(),s=await e.forkPage(t.itemId,t.owners,a);if(!s.ok)return{...t,busy:!1,note:{kind:"err",text:`Not copied. ${s.text}`}};let c=s.reply,{note:r,...d}=t;return{...d,busy:!1,done:{itemId:c.item_id,name:a,devices:n.filter(l=>t.owners.some(W=>u(W,l.ownerId))).map(l=>l.name),rewritten:_(c.rewritten,o),kept:_(c.kept,o)}}}function Y(e,t,n){let o=(i,a)=>{let s=t.filter(c=>c.kind===i);return s.length===0?g:p`<div class="lib-copy-group" role="group" aria-label=${a}>
      <span class="lib-copy-kind">${k(i==="iphone"?"phone":"watch")}<span>${a}</span></span>
      ${s.map(c=>{let r=e.owners.some(d=>u(d,c.ownerId));return p`<label class="lib-copy-dev">
          <input type="checkbox" .checked=${$(r)} ?disabled=${e.busy}
            @change=${d=>n.onTick(c.ownerId,d.target.checked)} />
          <span>${c.name}</span>
        </label>`})}
    </div>`};return p`${o("watch","Watches")}${o("iphone","iPhones")}`}function he(e,t,n){let o=e.done,i=H(e,t);return p`<dialog class="new-dialog lib-new lib-copy" aria-label="Make a copy" @close=${()=>n.onClose()}
    @cancel=${a=>{a.preventDefault(),e.busy||n.onClose()}}>
    <form class="lib-new-form" @submit=${a=>{a.preventDefault(),o===void 0&&i===void 0&&!e.busy&&n.onMake()}}>
      <div class="new-head">
        <h2>Make a copy of ${e.name}</h2>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Close" aria-label="Close" ?disabled=${e.busy} @click=${()=>n.onClose()}>${k("close")}</button>
      </div>
      ${o===void 0?p`<div class="new-body">
        <section class="new-step step-name">
          <div class="new-step-head"><span class="new-step-title">For which devices?</span>
            <span class="new-step-hint">They get the copy. The others keep ${e.name}.</span></div>
          ${Y(e,t,n)}
        </section>
        <section class="new-step step-copy-name">
          <div class="new-step-head"><span class="new-step-title">Name of the copy</span></div>
          <input type="text" class="new-name" .value=${$(e.copyName)} maxlength="80" aria-label="Name of the copy"
            ?disabled=${e.busy} @input=${a=>n.onName(a.target.value)} />
        </section>
        <p class="lib-copy-warn">${j} Anything on those devices that opened ${e.name} (menu slots, complications, page links) opens the copy.</p>
        ${e.note===void 0?g:p`<p class="lt-line ${e.note.kind}" role="status">${e.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${i??`${e.copyName.trim()}, for ${e.owners.length===1?"1 device":`${e.owners.length} devices`}.`}</span>
        <button type="button" class="lib-new-btn" ?disabled=${e.busy} @click=${()=>n.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary lib-copy-make" ?disabled=${i!==void 0||e.busy}
          title=${i??"Make the copy"}>${e.busy?"Copying\u2026":"Make a copy"}</button>
      </div>`:p`<div class="new-body lib-copy-done" role="status">
        <p class="lib-copy-said">${G(o,e.name)}</p>
        ${o.rewritten.length===0?p`<p class="lib-copy-none">Nothing on those devices opened ${e.name}, so nothing else changed.</p>`:p`<p class="lib-copy-lead">Now open the copy:</p><ul class="lib-copy-list">${o.rewritten.map(a=>p`<li>${a}</li>`)}</ul>`}
        ${o.kept.length===0?g:p`<p class="lib-copy-lead">Still open ${e.name}, because another device shares the page they sit on:</p>
          <ul class="lib-copy-list">${o.kept.map(a=>p`<li>${a}</li>`)}</ul>`}
      </div>
      <div class="new-foot">
        <span class="new-count"></span>
        ${n.onOpen===void 0?g:p`<button type="button" class="lib-new-btn lib-copy-open" @click=${()=>n.onOpen?.(o.itemId)}>Open the copy</button>`}
        <button type="button" class="lib-new-btn primary lib-copy-done-btn" @click=${()=>n.onClose()}>Done</button>
      </div>`}
    </form>
  </dialog>`}var ge=C`
  .lib-copy .new-step.step-copy-name { background: none; }
  .lib-copy-group { display: flex; flex-direction: column; gap: 4px; }
  .lib-copy-kind { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .lib-copy-kind svg { width: 13px; height: 13px; }
  .lib-copy-dev { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 2px 0 2px 2px; cursor: pointer; }
  .lib-copy-dev input { margin: 0; accent-color: var(--wa-accent); }
  .lib-copy-warn { margin: 0; font-size: 12.5px; line-height: 1.45; color: var(--wa-ink); }
  .lib-copy-done p { margin: 0; font-size: 13px; line-height: 1.45; }
  .lib-copy-lead { color: var(--wa-muted); }
  .lib-copy-none { color: var(--wa-muted); }
  .lib-copy-list { margin: 0; padding-left: 18px; font-size: 12.5px; line-height: 1.5; }
`;function ye(e){let t=e?.querySelector?.(z);t&&!t.open&&typeof t.showModal=="function"&&t.showModal()}export{R as a,S as b,Q as c,B as d,V as e,Z as f,ee as g,ne as h,pe as i,ce as j,le as k,de as l,ue as m,he as n,ge as o,ye as p};
