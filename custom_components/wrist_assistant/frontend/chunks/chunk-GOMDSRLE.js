import{y as A}from"./chunk-XUDOA2U6.js";import{$ as E,X as h,aa as L}from"./chunk-IY2Z5G74.js";import{c as C,d as I}from"./chunk-RWBTFEBI.js";import{b as $,f as a,i as c}from"./chunk-6ZDBXU6B.js";var D=typeof HTMLElement>"u"?class{}:HTMLElement;function P(e,n,t){return e.length===0?!1:e.reduce((r,o)=>r+o,0)+n*(e.length-1)>t}var v=class extends D{connectedCallback(){let n=this.closest(".lib-on");if(n===null||typeof ResizeObserver>"u"){this.hasAttribute("folded")&&this.removeAttribute("folded");return}let t=new ResizeObserver(()=>this.measure(n));t.observe(this),t.observe(n);let i=()=>{for(let r of this.chips())t.observe(r)};i(),this.kids=new MutationObserver(i),this.kids.observe(this,{childList:!0}),this.sizes=t}disconnectedCallback(){this.sizes?.disconnect(),this.kids?.disconnect(),this.sizes=void 0,this.kids=void 0}chips(){return Array.from(this.children).filter(n=>n.classList.contains("lt-chip"))}measure(n){let t=!1;if(this.querySelector(":scope > .lt-fold")!==null){this.gap??=parseFloat(getComputedStyle(this).columnGap)||0;let i=getComputedStyle(n),r=n.clientWidth-(parseFloat(i.paddingLeft)||0)-(parseFloat(i.paddingRight)||0);t=P(this.chips().map(o=>o.offsetWidth),this.gap,r)}t!==this.hasAttribute("folded")&&this.toggleAttribute("folded",t)}};typeof customElements<"u"&&!customElements.get("wa-chip-row")&&customElements.define("wa-chip-row",v);var _="Right-click to make a copy of the page for it.",ie="Shown on",oe="saves at once",O="Only an administrator can put this on a device.";function N(e,n){return`${e} uses this menu. To change that, pick another ${n} for it.`}function F(e){return`skips ${e}`}function q(e,n){let t=n.length<=4?I(n):`${n.slice(0,3).join(", ")} and ${n.length-3} more`;return`${e} skips ${t}: only an iPhone shows ${n.length===1?"it":"them"}.`}function z(e){let n=U(e),t=e.kind==="pages"?e.skips??[]:[];return t.length===0?n:n.map(i=>{if(i.device!=="watch"||!i.on)return i;let r=q(i.name,t);return{...i,title:`${i.title} ${r}`,skips:{text:F(t.length),title:r}}})}function U(e){let{library:n,kind:t,itemId:i,devices:r}=e,o=t==="menus",d=o?L(n,i):void 0,M=o?void 0:E(n,t,i),b=(o?d?.owners:M?.owners)??[],R=d?.unit==="entity"?"Entity quick menu":"Anywhere menu",g=s=>b.some(l=>h(l,s)),K=s=>{if(o)return!1;let l=n.picks.get(s.toUpperCase())?.[t];return Array.isArray(l)&&l.some(p=>typeof p?.id=="string"&&h(p.id,i)&&p.isHidden===!0)};return(e.addFor===void 0?r:[...r.filter(s=>!h(s.ownerId,e.addFor)&&g(s.ownerId)),...r.filter(s=>h(s.ownerId,e.addFor))]).map(s=>{let l=s.ownerId,p=e.pending?.get(A(t,l,o?d?.unit??"":i)),k=p!==void 0&&(!o||"menuId"in p&&(h(p.menuId,i)||g(l))),u=g(l);p!==void 0&&(u="on"in p?p.on:h(p.menuId,i));let x=e.addFor!==void 0&&h(l,e.addFor)&&!u,y=u&&!k&&K(l),H=e.colorOf(l),S=x?`Add to this ${C(s.kind)}`:s.name,T=e.viewing!==void 0&&h(l,e.viewing),f={ownerId:l,name:s.name,device:s.kind,color:H,shape:o?"round":"square",on:u,hidden:y,busy:k,add:x,label:S,...T?{viewing:T}:{}};if(k)return{...f,title:"Saving\u2026",next:void 0};let m=e.locked?.(l);if(m!==void 0)return{...f,title:m,next:void 0,stuck:m};if(!u&&b.length===0&&e.admin===!1)return{...f,title:O,next:void 0,stuck:O};if(o)return u?{...f,title:N(s.name,R),next:void 0}:{...f,title:`Use this menu on ${s.name}.`,next:!0};let w=t==="status_pages"?"status page":"page";return u?{...f,title:y?`On ${s.name}, hidden there. Untick to take the ${w} off it.`:`On ${s.name}. Untick to take the ${w} off it.`,next:!1}:{...f,title:`Not on ${s.name}. Tick to put the ${w} there.`,next:!0}})}function re(e,n){let t=e.kind==="pages"?e.onCopy:void 0,i=t===void 0?z(e):z(e).map(o=>o.on&&!o.busy?{...o,title:`${o.title} ${_}`}:o),r=e.kind==="menus"&&e.hint!==!1?e.hint??"Used by":void 0;return j(i,{foldLabel:"Add to a device",...r===void 0?{}:{hint:r},...e.note===void 0?{}:{note:e.note},...e.noteKind===void 0?{}:{noteKind:e.noteKind},...e.ask===void 0?{}:{ask:e.ask},...e.lead===void 0?{}:{lead:e.lead},...e.saves===void 0?{}:{saves:e.saves},...t===void 0?{}:{onCopy:t},...e.under===void 0?{}:{under:e.under}},n)}function j(e,n,t){let i=d=>W(d,t,n.onCopy),r=e.some(d=>!d.on&&!d.add),o=a`<wa-chip-row class="lt-chips" role="group" aria-label=${n.lead??n.hint??"Devices"}>${e.map(i)}${r?a`<details class="lt-fold" @toggle=${Y}>
      <summary class="lt-chip add lt-fold-sum"><span class="lt-name">+ ${n.foldLabel}</span><svg class="lt-chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 4l2.5 2.5L7.5 4"/></svg></summary>
      <div class="lt-fold-pop" role="group" aria-label=${n.foldLabel}>${e.map(i)}</div>
    </details>`:c}</wa-chip-row>`;return a`<div class="lt-ticks" @click=${d=>d.stopPropagation()}>
    ${n.hint===void 0?c:a`<span class="lt-hint">${n.hint}</span>`}
    ${n.lead===void 0&&n.saves===void 0?o:a`<div class="lt-chipline">
      ${n.lead===void 0?c:a`<span class="lt-lead">${n.lead}</span>`}${o}${n.saves===void 0?c:a`<span class="lt-saves">${n.saves}</span>`}
    </div>`}
    ${n.ask===void 0?c:X(n.ask)}
    ${n.note===void 0?c:n.noteKind==="ok"?a`<p class="lt-note ok" role="status">${n.note}</p>`:a`<p class="lt-note" role="alert">${n.note}</p>`}
    ${n.under??c}
  </div>`}function W(e,n,t){return a`<button type="button" role="checkbox"
      class="lt-chip ${e.on?"on":"off"} ${e.shape==="round"?"rd":""} ${e.add?"add":""} ${e.busy?"busy":""} ${e.stuck===void 0?"":"stuck"} ${e.hidden?"dim":""} ${e.viewing===!0?"viewing":""}"
      style=${e.color===void 0?c:`--dc:${e.color}`} title=${e.viewing===!0?`${e.title} You came here from ${e.name}.`:e.title}
      aria-checked=${e.on?"true":"false"} aria-disabled=${e.next===void 0?"true":"false"}
      @click=${i=>{i.stopPropagation(),e.next!==void 0&&n(e.ownerId,e.next)}}
      @contextmenu=${t===void 0||!e.on||e.busy?c:i=>{i.preventDefault(),i.stopPropagation(),t(e.ownerId)}}><span class="lt-box" aria-hidden="true">${e.on&&e.shape!=="round"?B:c}</span><span class="lt-name">${e.label}</span>${e.hidden?a`<em>hidden</em>`:e.tag===void 0?c:a`<em>${e.tag}</em>`}${e.skips===void 0?c:a`<em class="lt-skips" title=${e.skips.title}>${e.skips.text}</em>`}${e.viewing===!0?a`<em class="lt-viewing">viewing</em>`:c}</button>`}var B=a`<svg class="lt-tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.6 8.4l2.9 2.9 5.9-6.5"/></svg>`;function X(e){return a`<div class="lt-ask" role="alertdialog" aria-label=${e.text}>
    <span class="lt-ask-q">${e.text}</span>
    <span class="lt-ask-acts">
      <button type="button" class="lt-ask-btn danger" @click=${()=>e.onRemove()}>Remove</button>
      <button type="button" class="lt-ask-btn" @click=${()=>e.onCancel()}>Cancel</button>
    </span>
  </div>`}function Y(e){let n=e.currentTarget;if(!n.open)return;let t=n.ownerDocument,i=d=>{d.composedPath().includes(n)||(n.open=!1)},r=d=>{d.key==="Escape"&&(n.open=!1)},o=()=>{n.open||(t.removeEventListener("pointerdown",i,!0),t.removeEventListener("keydown",r,!0),n.removeEventListener("toggle",o))};t.addEventListener("pointerdown",i,!0),t.addEventListener("keydown",r,!0),n.addEventListener("toggle",o)}var se=$`
  .lt-ticks { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
  .lt-hint { font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
  wa-chip-row { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; min-width: 0; }
  .lt-chip {
    display: inline-flex; align-items: center; gap: 5px; max-width: 100%; height: 22px; padding: 0 8px 0 6px;
    border-radius: 999px; border: 1px solid var(--wa-line-strong); background: var(--wa-input, var(--wa-hover));
    font: inherit; font-size: 11px; color: var(--wa-ink); cursor: pointer;
    transition: border-color .12s ease-out, background-color .12s ease-out;
  }
  .lt-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lt-box {
    flex: none; display: inline-grid; place-items: center; width: 12px; height: 12px; border-radius: 3px; box-sizing: border-box;
    border: 1.5px solid var(--dc, var(--wa-muted));
  }
  /* The tick in a ticked box, in the card's color so it reads on the
     device's fill in either skin. */
  .lt-tick { display: block; width: 10px; height: 10px; fill: none; stroke: var(--wa-card); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
  /* "Shown on", the chips, then "saves at once", on one line. */
  .lt-chipline { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; min-width: 0; }
  .lt-lead { flex: none; font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .lt-saves { flex: none; font-size: 11.5px; color: var(--wa-muted); white-space: nowrap; }
  .lt-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lt-chip.on {
    border-color: color-mix(in srgb, var(--dc, var(--wa-muted)) 60%, transparent);
    background: color-mix(in srgb, var(--dc, var(--wa-muted)) 18%, var(--wa-card));
  }
  .lt-chip.on .lt-box { background: var(--dc, var(--wa-muted)); border-color: var(--dc, var(--wa-muted)); }
  .lt-chip.off { color: var(--wa-muted); }
  .lt-chip.off:hover:not(.stuck):not(.busy) { color: var(--wa-ink); border-color: color-mix(in srgb, var(--dc, var(--wa-ink)) 60%, transparent); }
  .lt-chip.rd .lt-box { border-radius: 50%; }
  .lt-chip.on.rd .lt-box { box-shadow: inset 0 0 0 2.5px var(--wa-card); }
  .lt-chip.on.rd { cursor: default; }
  .lt-chip.add { border-style: dashed; background: transparent; color: var(--wa-muted); }
  .lt-chip.dim { opacity: .55; }
  /* The device the editor was opened from: a ring in its color, never a
     grey chip, and "viewing" after its name. */
  .lt-chip.viewing { box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 3.5px var(--dc, var(--wa-ink)); }
  .lt-chip.viewing em.lt-viewing { color: var(--wa-ink); font-weight: 600; }
  /* The tags after the name never shrink or wrap: the name takes the
     ellipsis, so a narrow chip still says "skips 2" whole. */
  .lt-chip em { flex: none; white-space: nowrap; font-style: normal; font-size: 10px; color: var(--wa-muted); }
  .lt-chip.busy { opacity: .6; cursor: progress; }
  .lt-chip.stuck { opacity: .45; cursor: not-allowed; }
  .lt-note { margin: 0; font-size: 11.5px; line-height: 1.35; color: var(--wa-need); }
  .lt-note.ok { color: var(--wa-muted); }
  /* The untick's question (renderTickAsk): the words, then the two buttons
     in the form sheet's small and danger look, drawn here so a host
     without that sheet (the Pages tab) draws them the same. */
  .lt-ask {
    display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; max-width: 520px; padding: 8px 10px;
    border-radius: 8px; background: var(--wa-card); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
    font-size: 12px; line-height: 1.4; color: var(--wa-ink);
  }
  .lt-ask-q { flex: 1 1 220px; min-width: 0; }
  .lt-ask-acts { display: inline-flex; gap: 6px; flex: none; }
  .lt-ask .lt-ask-btn {
    font: inherit; font-size: 12.5px; font-weight: 600; padding: 0 9px; min-height: 26px; border-radius: 6px; cursor: pointer;
    border: 1px solid var(--wa-line-strong); background: var(--wa-field, var(--wa-input)); color: var(--wa-ink);
  }
  .lt-ask .lt-ask-btn:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); background: var(--wa-hover); }
  .lt-ask .lt-ask-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lt-ask .lt-ask-btn.danger {
    color: var(--error-color, #e5484d); border-color: color-mix(in srgb, var(--error-color, #e5484d) 45%, transparent);
    background: color-mix(in srgb, var(--error-color, #e5484d) 8%, transparent);
  }
  .lt-ask .lt-ask-btn.danger:hover { background: color-mix(in srgb, var(--error-color, #e5484d) 16%, transparent); border-color: var(--error-color, #e5484d); }
  /* The fold (renderTickChips): in the DOM whenever a chip is off, shown
     only when the row has marked itself folded (chip-row.ts: the chips do
     not fit the device strip), and then the inline off chips step aside for
     it. Hidden, not gone: they keep their full width (no max-width to clamp
     them to the folded row), so the next measurement still knows how wide
     every chip is. The dashed "Add to this watch" chip never folds. */
  .lt-fold { display: none; position: relative; min-width: 0; }
  wa-chip-row[folded] > .lt-chip.off:not(.add) { position: absolute; top: 0; left: 0; max-width: none; visibility: hidden; pointer-events: none; }
  wa-chip-row[folded] > .lt-fold { display: inline-flex; }
  .lt-fold-sum { list-style: none; user-select: none; }
  .lt-fold-sum::-webkit-details-marker { display: none; }
  .lt-fold-sum::marker { content: ""; }
  .lt-fold-sum:hover { color: var(--wa-ink); border-color: var(--wa-muted); }
  .lt-chev { flex: none; width: 10px; height: 10px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; transition: transform .12s ease-out; }
  .lt-fold[open] > .lt-fold-sum { color: var(--wa-ink); border-color: var(--wa-muted); }
  .lt-fold[open] .lt-chev { transform: rotate(180deg); }
  .lt-fold-pop {
    position: absolute; top: calc(100% + 6px); left: 0; z-index: 50;
    display: flex; flex-wrap: wrap; gap: 6px; min-width: 240px; max-width: 360px; padding: 8px; box-sizing: border-box;
    background: var(--wa-card); border: 1px solid var(--wa-line-strong); border-radius: 10px;
    box-shadow: var(--wa-shadow-pop, 0 8px 24px rgba(0, 0, 0, .28));
  }
  .lt-fold-pop .lt-chip.off { display: inline-flex; }
`;export{ie as a,oe as b,z as c,re as d,j as e,W as f,B as g,X as h,se as i};
