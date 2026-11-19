import{X as c}from"./chunk-BTZO3S4P.js";import{j as g}from"./chunk-UJEOSPM7.js";import{d as h}from"./chunk-Y354TWPI.js";import{ph as b}from"./chunk-GFNODYNE.js";import{l as w}from"./chunk-NLJVSYDV.js";import{b as m,f as a,i as y}from"./chunk-6ZDBXU6B.js";var x="These become two pages. A change to one never reaches the other.",P="Make a copy needs the page on two devices or more: one keeps it, the others get the copy.",C="dialog.lib-copy";function _(e,n){let t=n.filter(o=>e.some(s=>c(s,o.ownerId)));return[...t.filter(o=>o.kind==="watch"),...t.filter(o=>o.kind==="iphone")]}function $(e,n){let t=new Set(n.map(i=>i.kind)),o=n.every(i=>i.platform==="android"),s=t.size!==1?"copy":t.has("iphone")?o?"Phone":"iPhone":"Watch";return`${e} (${s})`}function O(e,n,t,o=[]){let s=t.filter(i=>o.some(l=>c(l,i.ownerId))).map(i=>i.ownerId);return{itemId:e,name:n,owners:s,named:!1,busy:!1,copyName:$(n,t.filter(i=>s.includes(i.ownerId)))}}function S(e,n,t,o){let s=o?n.filter(r=>c(r.ownerId,t)||e.owners.some(d=>c(d,r.ownerId))).map(r=>r.ownerId):e.owners.filter(r=>!c(r,t)),{note:i,...l}=e,p=e.named?e.copyName:$(e.name,n.filter(r=>s.includes(r.ownerId)));return{...l,owners:s,copyName:p}}function k(e,n){if(e.owners.length===0)return"Tick the devices that get the copy.";if(n.length>0&&n.every(t=>e.owners.some(o=>c(o,t.ownerId))))return`Leave ${e.name} on at least one device. To change it everywhere, just edit it.`;if(e.copyName.trim()==="")return"Give the copy a name."}function v(e,n){return(e??[]).map(t=>{let o=n.find(s=>c(s.ownerId,t.owner_id))?.name;return o===void 0?t.what:`${o}: ${t.what}`})}function D(e,n){return`${e.name} is on ${h(e.devices)} now. ${n} stays on the other devices.`}async function R(e,n,t,o){let s=k(n,t);if(s!==void 0)return{...n,note:{kind:"warn",text:s}};let i=n.copyName.trim(),l=await e.forkPage(n.itemId,n.owners,i);if(!l.ok)return{...n,busy:!1,note:{kind:"err",text:`Not copied. ${l.text}`}};let p=l.reply,{note:r,...d}=n;return{...d,busy:!1,done:{itemId:p.item_id,name:i,devices:t.filter(u=>n.owners.some(f=>c(f,u.ownerId))).map(u=>u.name),rewritten:v(p.rewritten,o),kept:v(p.kept,o)}}}function I(e,n,t){let o=(s,i)=>{let l=n.filter(p=>p.kind===s);return l.length===0?y:a`<div class="lib-copy-group" role="group" aria-label=${i}>
      <span class="lib-copy-kind">${b(s==="iphone"?"phone":"watch")}<span>${i}</span></span>
      ${l.map(p=>{let r=e.owners.some(d=>c(d,p.ownerId));return a`<label class="lib-copy-dev">
          <input type="checkbox" .checked=${g(r)} ?disabled=${e.busy}
            @change=${d=>t.onTick(p.ownerId,d.target.checked)} />
          <span>${p.name}</span>
        </label>`})}
    </div>`};return a`${o("watch","Watches")}${o("iphone",w("iPhones","Phones"))}`}function W(e,n,t){let o=e.done,s=k(e,n);return a`<dialog class="new-dialog lib-new lib-copy" aria-label="Make a copy" @close=${()=>t.onClose()}
    @cancel=${i=>{i.preventDefault(),e.busy||t.onClose()}}>
    <form class="lib-new-form" @submit=${i=>{i.preventDefault(),o===void 0&&s===void 0&&!e.busy&&t.onMake()}}>
      <div class="new-head">
        <h2>Make a copy of ${e.name}</h2>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Close" aria-label="Close" ?disabled=${e.busy} @click=${()=>t.onClose()}>${b("close")}</button>
      </div>
      ${o===void 0?a`<div class="new-body">
        <section class="new-step step-name">
          <div class="new-step-head"><span class="new-step-title">For which devices?</span>
            <span class="new-step-hint">They get the copy. The others keep ${e.name}.</span></div>
          ${I(e,n,t)}
        </section>
        <section class="new-step step-copy-name">
          <div class="new-step-head"><span class="new-step-title">Name of the copy</span></div>
          <input type="text" class="new-name" .value=${g(e.copyName)} maxlength="80" aria-label="Name of the copy"
            ?disabled=${e.busy} @input=${i=>t.onName(i.target.value)} />
        </section>
        <p class="lib-copy-warn">${x} Anything on those devices that opened ${e.name} (menu slots, complications, page links) opens the copy.</p>
        ${e.note===void 0?y:a`<p class="lt-line ${e.note.kind}" role="status">${e.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${s??`${e.copyName.trim()}, for ${e.owners.length===1?"1 device":`${e.owners.length} devices`}.`}</span>
        <button type="button" class="lib-new-btn" ?disabled=${e.busy} @click=${()=>t.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary lib-copy-make" ?disabled=${s!==void 0||e.busy}
          title=${s??"Make the copy"}>${e.busy?"Copying\u2026":"Make a copy"}</button>
      </div>`:a`<div class="new-body lib-copy-done" role="status">
        <p class="lib-copy-said">${D(o,e.name)}</p>
        ${o.rewritten.length===0?a`<p class="lib-copy-none">Nothing on those devices opened ${e.name}, so nothing else changed.</p>`:a`<p class="lib-copy-lead">Now open the copy:</p><ul class="lib-copy-list">${o.rewritten.map(i=>a`<li>${i}</li>`)}</ul>`}
        ${o.kept.length===0?y:a`<p class="lib-copy-lead">Still open ${e.name}, because another device shares the page they sit on:</p>
          <ul class="lib-copy-list">${o.kept.map(i=>a`<li>${i}</li>`)}</ul>`}
      </div>
      <div class="new-foot">
        <span class="new-count"></span>
        ${t.onOpen===void 0?y:a`<button type="button" class="lib-new-btn lib-copy-open" @click=${()=>t.onOpen?.(o.itemId)}>Open the copy</button>`}
        <button type="button" class="lib-new-btn primary lib-copy-done-btn" @click=${()=>t.onClose()}>Done</button>
      </div>`}
    </form>
  </dialog>`}var z=m`
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
`;function H(e){let n=e?.querySelector?.(C);n&&!n.open&&typeof n.showModal=="function"&&n.showModal()}export{P as a,_ as b,O as c,S as d,R as e,W as f,z as g,H as h};
