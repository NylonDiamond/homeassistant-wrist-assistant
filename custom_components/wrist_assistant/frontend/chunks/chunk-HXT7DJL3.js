import{X as c}from"./chunk-IY2Z5G74.js";import{j as g}from"./chunk-XXIFNMFK.js";import{d as w}from"./chunk-RWBTFEBI.js";import{ph as b}from"./chunk-NPUC537M.js";import{b as m,f as a,i as y}from"./chunk-6ZDBXU6B.js";var f="These become two pages. A change to one never reaches the other.",E="Make a copy needs the page on two devices or more: one keeps it, the others get the copy.",x="dialog.lib-copy";function M(e,n){let t=n.filter(o=>e.some(i=>c(i,o.ownerId)));return[...t.filter(o=>o.kind==="watch"),...t.filter(o=>o.kind==="iphone")]}function v(e,n){let t=new Set(n.map(i=>i.kind)),o=t.size!==1?"copy":t.has("iphone")?"iPhone":"Watch";return`${e} (${o})`}function _(e,n,t,o=[]){let i=t.filter(s=>o.some(r=>c(r,s.ownerId))).map(s=>s.ownerId);return{itemId:e,name:n,owners:i,named:!1,busy:!1,copyName:v(n,t.filter(s=>i.includes(s.ownerId)))}}function O(e,n,t,o){let i=o?n.filter(l=>c(l.ownerId,t)||e.owners.some(d=>c(d,l.ownerId))).map(l=>l.ownerId):e.owners.filter(l=>!c(l,t)),{note:s,...r}=e,p=e.named?e.copyName:v(e.name,n.filter(l=>i.includes(l.ownerId)));return{...r,owners:i,copyName:p}}function k(e,n){if(e.owners.length===0)return"Tick the devices that get the copy.";if(n.length>0&&n.every(t=>e.owners.some(o=>c(o,t.ownerId))))return`Leave ${e.name} on at least one device. To change it everywhere, just edit it.`;if(e.copyName.trim()==="")return"Give the copy a name."}function h(e,n){return(e??[]).map(t=>{let o=n.find(i=>c(i.ownerId,t.owner_id))?.name;return o===void 0?t.what:`${o}: ${t.what}`})}function C(e,n){return`${e.name} is on ${w(e.devices)} now. ${n} stays on the other devices.`}async function P(e,n,t,o){let i=k(n,t);if(i!==void 0)return{...n,note:{kind:"warn",text:i}};let s=n.copyName.trim(),r=await e.forkPage(n.itemId,n.owners,s);if(!r.ok)return{...n,busy:!1,note:{kind:"err",text:`Not copied. ${r.text}`}};let p=r.reply,{note:l,...d}=n;return{...d,busy:!1,done:{itemId:p.item_id,name:s,devices:t.filter(u=>n.owners.some($=>c($,u.ownerId))).map(u=>u.name),rewritten:h(p.rewritten,o),kept:h(p.kept,o)}}}function D(e,n,t){let o=(i,s)=>{let r=n.filter(p=>p.kind===i);return r.length===0?y:a`<div class="lib-copy-group" role="group" aria-label=${s}>
      <span class="lib-copy-kind">${b(i==="iphone"?"phone":"watch")}<span>${s}</span></span>
      ${r.map(p=>{let l=e.owners.some(d=>c(d,p.ownerId));return a`<label class="lib-copy-dev">
          <input type="checkbox" .checked=${g(l)} ?disabled=${e.busy}
            @change=${d=>t.onTick(p.ownerId,d.target.checked)} />
          <span>${p.name}</span>
        </label>`})}
    </div>`};return a`${o("watch","Watches")}${o("iphone","iPhones")}`}function S(e,n,t){let o=e.done,i=k(e,n);return a`<dialog class="new-dialog lib-new lib-copy" aria-label="Make a copy" @close=${()=>t.onClose()}
    @cancel=${s=>{s.preventDefault(),e.busy||t.onClose()}}>
    <form class="lib-new-form" @submit=${s=>{s.preventDefault(),o===void 0&&i===void 0&&!e.busy&&t.onMake()}}>
      <div class="new-head">
        <h2>Make a copy of ${e.name}</h2>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Close" aria-label="Close" ?disabled=${e.busy} @click=${()=>t.onClose()}>${b("close")}</button>
      </div>
      ${o===void 0?a`<div class="new-body">
        <section class="new-step step-name">
          <div class="new-step-head"><span class="new-step-title">For which devices?</span>
            <span class="new-step-hint">They get the copy. The others keep ${e.name}.</span></div>
          ${D(e,n,t)}
        </section>
        <section class="new-step step-copy-name">
          <div class="new-step-head"><span class="new-step-title">Name of the copy</span></div>
          <input type="text" class="new-name" .value=${g(e.copyName)} maxlength="80" aria-label="Name of the copy"
            ?disabled=${e.busy} @input=${s=>t.onName(s.target.value)} />
        </section>
        <p class="lib-copy-warn">${f} Anything on those devices that opened ${e.name} (menu slots, complications, page links) opens the copy.</p>
        ${e.note===void 0?y:a`<p class="lt-line ${e.note.kind}" role="status">${e.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${i??`${e.copyName.trim()}, for ${e.owners.length===1?"1 device":`${e.owners.length} devices`}.`}</span>
        <button type="button" class="lib-new-btn" ?disabled=${e.busy} @click=${()=>t.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary lib-copy-make" ?disabled=${i!==void 0||e.busy}
          title=${i??"Make the copy"}>${e.busy?"Copying\u2026":"Make a copy"}</button>
      </div>`:a`<div class="new-body lib-copy-done" role="status">
        <p class="lib-copy-said">${C(o,e.name)}</p>
        ${o.rewritten.length===0?a`<p class="lib-copy-none">Nothing on those devices opened ${e.name}, so nothing else changed.</p>`:a`<p class="lib-copy-lead">Now open the copy:</p><ul class="lib-copy-list">${o.rewritten.map(s=>a`<li>${s}</li>`)}</ul>`}
        ${o.kept.length===0?y:a`<p class="lib-copy-lead">Still open ${e.name}, because another device shares the page they sit on:</p>
          <ul class="lib-copy-list">${o.kept.map(s=>a`<li>${s}</li>`)}</ul>`}
      </div>
      <div class="new-foot">
        <span class="new-count"></span>
        ${t.onOpen===void 0?y:a`<button type="button" class="lib-new-btn lib-copy-open" @click=${()=>t.onOpen?.(o.itemId)}>Open the copy</button>`}
        <button type="button" class="lib-new-btn primary lib-copy-done-btn" @click=${()=>t.onClose()}>Done</button>
      </div>`}
    </form>
  </dialog>`}var R=m`
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
`;function W(e){let n=e?.querySelector?.(x);n&&!n.open&&typeof n.showModal=="function"&&n.showModal()}export{E as a,M as b,_ as c,O as d,P as e,S as f,R as g,W as h};
