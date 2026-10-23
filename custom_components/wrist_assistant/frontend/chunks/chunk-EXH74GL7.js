import{d as C,e as B,ea as h,ha as v,ia as m,ua as j}from"./chunk-Q7P4ZXXI.js";import{h as k}from"./chunk-7ZYX4JY6.js";import{b as M,c as H}from"./chunk-P3S4W6I4.js";import{b as K,c as O,e as A}from"./chunk-ZE5R4ZHO.js";import{b as g,d as a,e as $,g as d,nh as x}from"./chunk-BDP52PL7.js";var W=K(class extends O{constructor(){super(...arguments),this.key=d}render(e,n){return this.key=e,n}update(e,[n,t]){return n!==this.key&&(A(e),this.key=n),t}});var J=typeof HTMLElement>"u"?class{}:HTMLElement;function Q(e,n,t){return e.length===0?!1:e.reduce((r,o)=>r+o,0)+n*(e.length-1)>t}var R=class extends J{connectedCallback(){let n=this.closest(".lib-on");if(n===null||typeof ResizeObserver>"u"){this.hasAttribute("folded")&&this.removeAttribute("folded");return}let t=new ResizeObserver(()=>this.measure(n));t.observe(this),t.observe(n);let i=()=>{for(let r of this.chips())t.observe(r)};i(),this.kids=new MutationObserver(i),this.kids.observe(this,{childList:!0}),this.sizes=t}disconnectedCallback(){this.sizes?.disconnect(),this.kids?.disconnect(),this.sizes=void 0,this.kids=void 0}chips(){return Array.from(this.children).filter(n=>n.classList.contains("lt-chip"))}measure(n){let t=!1;if(this.querySelector(":scope > .lt-fold")!==null){this.gap??=parseFloat(getComputedStyle(this).columnGap)||0;let i=getComputedStyle(n),r=n.clientWidth-(parseFloat(i.paddingLeft)||0)-(parseFloat(i.paddingRight)||0);t=Q(this.chips().map(o=>o.offsetWidth),this.gap,r)}t!==this.hasAttribute("folded")&&this.toggleAttribute("folded",t)}};typeof customElements<"u"&&!customElements.get("wa-chip-row")&&customElements.define("wa-chip-row",R);var U="Only an administrator can put this on a device.";function Z(e,n){return`${e} uses this menu. To change that, pick another ${n} for it.`}function ee(e){return`skips ${e}`}function ne(e,n){let t=n.length<=4?H(n):`${n.slice(0,3).join(", ")} and ${n.length-3} more`;return`${e} skips ${t}: only an iPhone shows ${n.length===1?"it":"them"}.`}function te(e){let n=ie(e),t=e.kind==="pages"?e.skips??[]:[];return t.length===0?n:n.map(i=>{if(i.device!=="watch"||!i.on)return i;let r=ne(i.name,t);return{...i,title:`${i.title} ${r}`,skips:{text:ee(t.length),title:r}}})}function ie(e){let{library:n,kind:t,itemId:i,devices:r}=e,o=t==="menus",s=o?m(n,i):void 0,b=o?void 0:v(n,t,i),l=(o?s?.owners:b?.owners)??[],y=s?.unit==="entity"?"Entity quick menu":"Anywhere menu",T=c=>l.some(p=>h(p,c)),Y=c=>{if(o)return!1;let p=n.picks.get(c.toUpperCase())?.[t];return Array.isArray(p)&&p.some(u=>typeof u?.id=="string"&&h(u.id,i)&&u.isHidden===!0)};return(e.addFor===void 0?r:[...r.filter(c=>!h(c.ownerId,e.addFor)&&T(c.ownerId)),...r.filter(c=>h(c.ownerId,e.addFor))]).map(c=>{let p=c.ownerId,u=e.pending?.get(j(t,p,o?s?.unit??"":i)),L=u!==void 0&&(!o||"menuId"in u&&(h(u.menuId,i)||T(p))),f=T(p);u!==void 0&&(f="on"in u?u.on:h(u.menuId,i));let D=e.addFor!==void 0&&h(p,e.addFor)&&!f,P=f&&!L&&Y(p),X=e.colorOf(p),G=D?`Add to this ${M(c.kind)}`:c.name,_=e.viewing!==void 0&&h(p,e.viewing),w={ownerId:p,name:c.name,device:c.kind,color:X,shape:o?"round":"square",on:f,hidden:P,busy:L,add:D,label:G,..._?{viewing:_}:{}};if(L)return{...w,title:"Saving\u2026",next:void 0};let I=e.locked?.(p);if(I!==void 0)return{...w,title:I,next:void 0,stuck:I};if(!f&&l.length===0&&e.admin===!1)return{...w,title:U,next:void 0,stuck:U};if(o)return f?{...w,title:Z(c.name,y),next:void 0}:{...w,title:`Use this menu on ${c.name}.`,next:!0};let E=t==="status_pages"?"status page":"page";return f?{...w,title:P?`On ${c.name}, hidden there. Untick to take the ${E} off it.`:`On ${c.name}. Untick to take the ${E} off it.`,next:!1}:{...w,title:`Not on ${c.name}. Tick to put the ${E} there.`,next:!0}})}function Ae(e,n){let t=te(e),i=e.kind==="menus"&&e.hint!==!1?e.hint??"Used by":void 0;return re(t,{foldLabel:"Add to a device",...i===void 0?{}:{hint:i},...e.note===void 0?{}:{note:e.note},...e.noteKind===void 0?{}:{noteKind:e.noteKind},...e.ask===void 0?{}:{ask:e.ask}},n)}function re(e,n,t){let i=o=>a`<button type="button"
      class="lt-chip ${o.on?"on":"off"} ${o.shape==="round"?"rd":""} ${o.add?"add":""} ${o.busy?"busy":""} ${o.stuck===void 0?"":"stuck"} ${o.hidden?"dim":""} ${o.viewing===!0?"viewing":""}"
      style=${o.color===void 0?d:`--dc:${o.color}`} title=${o.viewing===!0?`${o.title} You came here from ${o.name}.`:o.title}
      aria-pressed=${o.on?"true":"false"} aria-disabled=${o.next===void 0?"true":"false"}
      @click=${s=>{s.stopPropagation(),o.next!==void 0&&t(o.ownerId,o.next)}}><span class="lt-box" aria-hidden="true"></span><span class="lt-name">${o.label}</span>${o.hidden?a`<em>hidden</em>`:o.tag===void 0?d:a`<em>${o.tag}</em>`}${o.skips===void 0?d:a`<em class="lt-skips" title=${o.skips.title}>${o.skips.text}</em>`}${o.viewing===!0?a`<em class="lt-viewing">viewing</em>`:d}</button>`,r=e.some(o=>!o.on&&!o.add);return a`<div class="lt-ticks" @click=${o=>o.stopPropagation()}>
    ${n.hint===void 0?d:a`<span class="lt-hint">${n.hint}</span>`}
    <wa-chip-row class="lt-chips" role="group" aria-label=${n.hint??"Devices"}>${e.map(i)}${r?a`<details class="lt-fold" @toggle=${oe}>
      <summary class="lt-chip add lt-fold-sum"><span class="lt-name">+ ${n.foldLabel}</span><svg class="lt-chev" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 4l2.5 2.5L7.5 4"/></svg></summary>
      <div class="lt-fold-pop" role="group" aria-label=${n.foldLabel}>${e.map(i)}</div>
    </details>`:d}</wa-chip-row>
    ${n.ask===void 0?d:z(n.ask)}
    ${n.note===void 0?d:n.noteKind==="ok"?a`<p class="lt-note ok" role="status">${n.note}</p>`:a`<p class="lt-note" role="alert">${n.note}</p>`}
  </div>`}function z(e){return a`<div class="lt-ask" role="alertdialog" aria-label=${e.text}>
    <span class="lt-ask-q">${e.text}</span>
    <span class="lt-ask-acts">
      <button type="button" class="lt-ask-btn danger" @click=${()=>e.onRemove()}>Remove</button>
      <button type="button" class="lt-ask-btn" @click=${()=>e.onCancel()}>Cancel</button>
    </span>
  </div>`}function oe(e){let n=e.currentTarget;if(!n.open)return;let t=n.ownerDocument,i=s=>{s.composedPath().includes(n)||(n.open=!1)},r=s=>{s.key==="Escape"&&(n.open=!1)},o=()=>{n.open||(t.removeEventListener("pointerdown",i,!0),t.removeEventListener("keydown",r,!0),n.removeEventListener("toggle",o))};t.addEventListener("pointerdown",i,!0),t.addEventListener("keydown",r,!0),n.addEventListener("toggle",o)}var Be=g`
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
    flex: none; width: 11px; height: 11px; border-radius: 3px; box-sizing: border-box;
    border: 1.5px solid var(--dc, var(--wa-muted));
  }
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
`;var Ue={settings:"Settings",rooms:"Rooms",voice:"Voice"},S=1800,ae=1500,de=2.2,se=900,le=1.5,F=class{constructor(n){this.host=n;this.wide=!1;this.scale=1;n.addController(this)}hostConnected(){typeof ResizeObserver>"u"||(this.seen=new ResizeObserver(n=>{let t=n[0]?.contentRect.width??0,i=t>=ae,r=i?de:t>=se?le:1;i===this.wide&&r===this.scale||(this.wide=i,this.scale=r,this.host.requestUpdate())}),this.seen.observe(this.host))}hostDisconnected(){this.seen?.disconnect(),this.seen=void 0}size(n){return Math.round(n*this.scale)}};function Fe(e,n,t){let i=(r,o,s)=>a`<button type="button" class="bd-view-opt ${e===r?"on":""}"
    aria-pressed=${e===r?"true":"false"} title=${s} @click=${()=>{e!==r&&n(r)}}>${x(r==="board"?"checklist":"grid")}<span>${o}</span></button>`;return a`<span class="bd-view" role="group" aria-label=${`How to show the ${t}`}>
    ${i("board","Board",`Every ${t.replace(/s$/,"")} as a row, every device as a column`)}${i("cards","Cards",`Every ${t.replace(/s$/,"")} as a card with its picture`)}
  </span>`}var V=(e,n)=>e!==void 0&&n!==void 0&&e.toUpperCase()===n.toUpperCase();function Ve(e){let n=e.columns.length+1,t=e.columns.findIndex(i=>V(i.device.ownerId,e.focus));return a`<div class="bd-scroll">
    <table class="bd ${t>=0?"focused":""} ${e.wide===!0?"wide":""}" aria-label=${e.label} style=${`--bd-n:${e.columns.length}`}>
      <thead><tr>
        <th scope="col" class="bd-thing">${e.thing}</th>
        ${e.columns.map(i=>ce(i,V(i.device.ownerId,e.focus),e))}
      </tr></thead>
      ${e.sections.map(i=>a`<tbody class="bd-sect-body" data-section=${i.key}>
        ${i.title===void 0?d:a`<tr class="bd-sect"><th colspan=${n} scope="colgroup">
          <span class="bd-sect-t">${i.title}${i.count===void 0?d:a` <small>${i.count}</small>`}</span>
          ${i.hint===void 0?d:a`<span class="bd-sect-r">${i.hint}</span>`}
        </th></tr>`}
        ${i.rows.length===0&&i.empty!==void 0?a`<tr class="bd-none"><td colspan=${n}>${i.empty}</td></tr>`:i.rows.map(r=>pe(r,e.columns,t,n))}
      </tbody>`)}
    </table>
  </div>`}function ce(e,n,t){let i=e.device;return a`<th scope="col" class="bd-col ${n?"on":""}" style=${e.color===void 0?d:`--dc:${e.color}`}>
    <button type="button" class="bd-col-btn" aria-pressed=${n?"true":"false"}
      title=${n?"Back to every device":t.focusTitle(i)}
      @click=${()=>t.onFocus(n?void 0:i.ownerId)}>
      <span class="bd-col-top">
        <span class="bd-col-glyph" aria-hidden="true">${x(i.kind==="iphone"?"phone":"watch")}</span>
        <span class="bd-col-name">${i.name}</span>
      </span>
      <span class="bd-col-sub"><span class="bd-col-n">${e.count}</span>
        <span class="bd-col-go">${n?"All":t.focusWord}<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 4l2.5 2.5L7.5 4"/></svg></span></span>
    </button>
  </th>`}function pe(e,n,t,i){let r=e.drag,o=`bd-row ${e.dim?"dim":""} ${e.select?.picked?"picked":""} ${r?.dragging?"dragging":""} ${r?.over?"drag-over":""} ${r?.below?"below":""}`,s=a`<tr class=${o} data-row=${e.key} draggable=${r?.on?"true":"false"}
    @dragstart=${l=>r?.onStart(l)}
    @dragover=${l=>r?.onOver(l)}
    @drop=${l=>r?.onDrop(l)}
    @dragend=${()=>r?.onEnd()}
    @keydown=${l=>r?.onKey(l)}>
    <th scope="row" class="bd-thing">
      <span class="bd-thing-in">
        ${r===void 0?d:a`<span class="bd-grip" aria-hidden="true" title=${r.on?"Drag to order":""}>${x("grip")}</span>`}
        ${e.select===void 0?d:a`<input type="checkbox" class="pk-card-pick" .checked=${e.select.picked}
          ?disabled=${e.select.disabled} aria-label=${e.select.label}
          @click=${l=>{l.stopPropagation(),e.select.onPick(l)}} />`}
        <button type="button" class="bd-open" title=${e.openTitle} @click=${l=>e.onOpen(l)}>
          ${e.picture??d}
          <span class="bd-nm"><span class="bd-n">${e.name}</span><span class="bd-m">${e.detail}</span></span>
        </button>
        ${e.actions??d}
      </span>
    </th>
    ${n.map((l,y)=>be(e.cells[y],l,y===t))}
  </tr>`;return e.ask!==void 0||e.note!==void 0||e.under!==void 0?a`${s}<tr class="bd-under ${e.dim?"dim":""}"><td colspan=${i}>
    ${e.ask===void 0?d:z(e.ask)}
    ${e.note===void 0?d:e.note.kind==="ok"?a`<p class="lt-note ok" role="status">${e.note.text}</p>`:a`<p class="lt-note" role="alert">${e.note.text}</p>`}
    ${e.under??d}
  </td></tr>`:s}function be(e,n,t){let i=n.color===void 0?d:`--dc:${n.color}`,r=e?.chip;if(r===void 0)return a`<td class="bd-cell ${t?"on":""}" style=${i}>
      <span class="bd-dash" role="img" aria-label=${e?.dashTitle??`Does not fit ${n.device.name}`} title=${e?.dashTitle??`Does not fit ${n.device.name}`}></span>
    </td>`;let o=r.shape==="round";return a`<td class="bd-cell ${t?"on":""}" style=${i}>
    <span class="bd-cell-in">
      <button type="button" class="bd-box ${r.on?"ticked":""} ${o?"rd":""} ${r.busy?"busy":""} ${r.stuck===void 0?"":"stuck"} ${r.hidden?"dim":""}"
        title=${r.title} aria-label=${`${r.name}: ${r.title}`}
        aria-pressed=${r.on?"true":"false"} aria-disabled=${r.next===void 0?"true":"false"}
        @click=${s=>{s.stopPropagation(),r.next!==void 0&&e?.onPick?.(r.next)}}><span class="bd-mark" aria-hidden="true"></span></button>
      ${e?.eye===void 0?d:a`<button type="button" class="bd-eye ${e.eye.hidden?"hid":""}" ?disabled=${e.eye.busy}
        title=${e.eye.title} aria-label=${e.eye.title} aria-pressed=${e.eye.hidden?"true":"false"}
        @click=${s=>{s.stopPropagation(),e.eye.onToggle()}}>${x(e.eye.hidden?"hide":"show")}</button>`}
    </span>
    ${r.hidden&&e?.note===void 0?a`<em class="bd-note">hidden</em>`:d}
    ${e?.note===void 0?d:a`<em class="bd-note ${e.noteWarn?"warn":""}" title=${e.noteTitle??d}>${e.note}</em>`}
  </td>`}var qe=g`
  .bd-scroll { overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch; }
  /* The device columns keep one narrow width (--bd-col-w) and the first
     column takes the rest, so a wide screen gives its room to the things'
     pictures, not to gaps between ticks (Jesse, 2026-10-23). */
  table.bd { --bd-col-w: 104px; border-collapse: separate; border-spacing: 0; width: 100%; min-width: max-content; font-size: 12.5px; }
  .bd th, .bd td { padding: 0; text-align: left; font-weight: inherit; }
  .bd thead th { position: sticky; top: 0; z-index: 2; background: var(--wa-card); border-bottom: 1px solid var(--wa-line); vertical-align: bottom; }
  .bd .bd-thing { position: sticky; left: 0; z-index: 1; background: var(--wa-card); min-width: 220px; }
  .bd thead .bd-thing { z-index: 3; padding: 8px 10px; font-size: 11.5px; color: var(--wa-muted); font-weight: 600; }
  .bd-col { width: var(--bd-col-w); min-width: var(--bd-col-w); max-width: var(--bd-col-w); text-align: center; }
  .bd td.bd-cell { width: var(--bd-col-w); }
  .bd-col.on { background: color-mix(in srgb, var(--dc, var(--wa-accent)) 14%, var(--wa-card)); }
  .bd-col-btn {
    display: flex; flex-direction: column; align-items: center; gap: 3px; width: 100%; padding: 8px 4px 7px; box-sizing: border-box;
    border: 0; background: none; font: inherit; color: var(--wa-ink); cursor: pointer; border-radius: 8px 8px 0 0;
    border-bottom: 3px solid color-mix(in srgb, var(--dc, var(--wa-muted)) 70%, transparent);
  }
  .bd-col-btn:hover { background: var(--wa-hover); }
  .bd-col-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* A long name takes two lines rather than widen its column. */
  .bd-col-top { display: inline-flex; align-items: flex-start; justify-content: center; gap: 4px; max-width: 100%; }
  .bd-col-glyph { display: inline-flex; flex: none; margin-top: 1px; color: var(--dc, var(--wa-muted)); }
  .bd-col-glyph svg { width: 14px; height: 14px; }
  .bd-col-name {
    min-width: 0; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
    overflow-wrap: anywhere; line-height: 1.25; font-weight: 600; font-size: 12.5px;
  }
  .bd-col-sub { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: var(--wa-muted); }
  .bd-col-n { font-variant-numeric: tabular-nums; }
  .bd-col-go { display: inline-flex; align-items: center; gap: 2px; padding: 1px 6px; border-radius: 999px; border: 1px solid var(--wa-line); }
  .bd-col-btn:hover .bd-col-go, .bd-col.on .bd-col-go { color: var(--wa-ink); border-color: var(--wa-line-strong); }
  .bd-col-go svg { width: 9px; height: 9px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

  .bd-sect th { padding: 14px 10px 6px; border-bottom: 1px solid var(--wa-line); background: var(--wa-card); }
  .bd-sect th > * { position: sticky; left: 10px; }
  .bd-sect-t { font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
  .bd-sect-t small { margin-left: 4px; font-size: 12px; font-weight: 500; color: var(--wa-muted); }
  .bd-sect-r { margin-left: 12px; font-size: 11.5px; color: var(--wa-muted); font-weight: 400; }
  .bd-none td { padding: 10px; font-size: 12.5px; color: var(--wa-muted); }

  .bd-row > * { border-bottom: 1px solid var(--wa-line); }
  .bd-row:hover > * { background: color-mix(in srgb, var(--wa-hover) 60%, var(--wa-card)); }
  .bd-row:hover > .bd-cell.on, .bd-cell.on { background: color-mix(in srgb, var(--dc, var(--wa-accent)) 8%, var(--wa-card)); }
  .bd-row.dim .bd-open { opacity: .6; }
  .bd-row.picked > .bd-thing { box-shadow: inset 3px 0 0 var(--wa-ink); }
  .bd-row.dragging { opacity: .5; }
  .bd-row.drag-over > * { box-shadow: inset 0 2px 0 var(--wa-accent); }
  .bd-row.drag-over.below > * { box-shadow: inset 0 -2px 0 var(--wa-accent); }
  .bd-thing-in { display: flex; align-items: center; gap: 6px; padding: 6px 10px; min-width: 0; }
  .bd-grip { display: inline-flex; flex: none; color: var(--wa-muted); cursor: grab; }
  .bd-grip svg { width: 14px; height: 14px; }
  .bd-open {
    display: flex; align-items: center; gap: 10px; flex: 1 1 auto; min-width: 0; padding: 2px; margin: 0;
    border: 0; border-radius: 8px; background: none; font: inherit; color: var(--wa-ink); text-align: left; cursor: pointer;
  }
  .bd-open:hover .bd-n { text-decoration: underline; text-underline-offset: 2px; }
  .bd-open:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-nm { display: flex; flex-direction: column; min-width: 0; }
  .bd-n { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bd-m { font-size: 11.5px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .bd .bd-cell { text-align: center; vertical-align: middle; padding: 6px 4px; }
  .bd-cell-in { display: inline-flex; align-items: center; gap: 4px; }
  .bd-box {
    display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0;
    border: 0; border-radius: 7px; background: none; cursor: pointer;
  }
  .bd-box:hover:not(.stuck):not(.busy) { background: var(--wa-hover); }
  .bd-box:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-mark {
    display: block; width: 16px; height: 16px; box-sizing: border-box; border-radius: 4px;
    border: 1.5px solid color-mix(in srgb, var(--dc, var(--wa-muted)) 70%, var(--wa-line-strong));
  }
  .bd-box.rd .bd-mark { border-radius: 50%; }
  .bd-box.ticked .bd-mark { background: var(--dc, var(--wa-accent)); border-color: var(--dc, var(--wa-accent)); position: relative; }
  .bd-box.ticked:not(.rd) .bd-mark::after {
    content: ""; position: absolute; top: 1px; left: 4.5px; width: 4px; height: 8px;
    border: solid var(--wa-card); border-width: 0 2px 2px 0; transform: rotate(45deg);
  }
  .bd-box.ticked.rd .bd-mark { box-shadow: inset 0 0 0 3px var(--wa-card); }
  .bd-box.ticked.rd { cursor: default; }
  .bd-box.dim .bd-mark { opacity: .5; }
  .bd-box.busy { opacity: .55; cursor: progress; }
  .bd-box.stuck { opacity: .4; cursor: not-allowed; }
  .bd-dash { display: inline-block; width: 12px; height: 2px; border-radius: 1px; background: var(--wa-line-strong); vertical-align: middle; }
  .bd-eye {
    display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0;
    border: 0; border-radius: 6px; background: none; color: var(--wa-muted); cursor: pointer;
  }
  .bd-eye svg { width: 15px; height: 15px; }
  .bd-eye:hover:not(:disabled) { background: var(--wa-hover); color: var(--wa-ink); }
  .bd-eye.hid { color: var(--wa-need); }
  .bd-eye:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-eye:disabled { opacity: .45; cursor: progress; }
  .bd-note { display: block; margin-top: 1px; font-style: normal; font-size: 10.5px; line-height: 1.2; color: var(--wa-muted); white-space: nowrap; }
  .bd-note.warn { color: var(--wa-need); }

  /* Board | Cards, in the head: the panel's segmented switch. */
  .bd-view { display: inline-flex; flex: none; padding: 2px; gap: 2px; border-radius: 8px; background: var(--wa-seg, var(--wa-field)); border: 1px solid var(--wa-line); }
  .bd-view-opt {
    display: inline-flex; align-items: center; gap: 5px; height: 24px; padding: 0 9px; border: 0; border-radius: 6px;
    background: none; font: inherit; font-size: 12px; font-weight: 600; color: var(--wa-muted); cursor: pointer;
  }
  .bd-view-opt svg { width: 13px; height: 13px; }
  .bd-view-opt.on { background: var(--wa-seg-on, var(--wa-card)); color: var(--wa-ink); }
  .bd-view-opt:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* "Saved" for a moment after a box's write, apart from any Save button. */
  .bd-saved { display: inline-flex; align-items: center; gap: 4px; flex: none; font-size: 12px; color: var(--wa-ok, var(--wa-muted)); }
  .bd-saved svg { width: 13px; height: 13px; }
  /* A focused device's head, over the board, in the device's color. */
  .bd-focus {
    display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; margin: 0 0 10px; padding: 10px 12px;
    border-radius: 10px; border: 1px solid color-mix(in srgb, var(--dc, var(--wa-accent)) 45%, var(--wa-line));
    background: color-mix(in srgb, var(--dc, var(--wa-accent)) 8%, var(--wa-card));
  }
  .bd-focus-glyph { display: inline-flex; color: var(--dc, var(--wa-muted)); }
  .bd-focus-glyph svg { width: 16px; height: 16px; }
  .bd-focus-t { flex: 1 1 260px; min-width: 0; font-size: 13px; color: var(--wa-muted); }
  .bd-focus-t b { font-weight: 600; color: var(--wa-ink); margin-right: 4px; }
  .bd-focus-own { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: 12px; color: var(--wa-muted); }
  .bd-link {
    padding: 0; border: 0; background: none; font: inherit; font-size: 12px; font-weight: 600; color: var(--wa-ink); cursor: pointer;
    text-decoration: underline; text-decoration-color: var(--wa-line-strong); text-underline-offset: 2px;
  }
  .bd-link:hover { text-decoration-color: currentColor; }
  .bd-link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 3px; }
  .bd-focus-all {
    display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 10px; border-radius: 7px;
    border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-ink);
    font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
  }
  .bd-focus-all svg { width: 13px; height: 13px; }
  .bd-focus-all:hover { background: var(--wa-hover); }
  .bd-focus-all:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-foot-line { margin-top: 8px; }

  .bd-under td { padding: 0 10px 8px; border-bottom: 1px solid var(--wa-line); }
  .bd-under td > * { position: sticky; left: 10px; max-width: min(560px, calc(100vw - 60px)); }
  .bd-under .lt-ask { margin-top: 2px; }
  .bd.wide { --bd-col-w: 124px; font-size: 13.5px; }
  .bd.wide .bd-thing { min-width: 320px; }
  .bd.wide .bd-thing-in { padding: 8px 14px; gap: 10px; }
  .bd.wide .bd-open { gap: 16px; }
  .bd.wide .bd-n { font-size: 15px; }
  .bd.wide .bd-m { font-size: 12.5px; }
  .bd.wide .bd-col-name { font-size: 13px; }
  /* A phone: the first column stays put and narrow while the device
     columns scroll sideways under it. */
  @media (max-width: 640px) {
    table.bd { --bd-col-w: 78px; }
    .bd .bd-thing, .bd.wide .bd-thing { min-width: 0; width: 150px; max-width: 150px; }
    .bd-thing-in, .bd.wide .bd-thing-in { padding: 6px; gap: 6px; }
    .bd-open, .bd.wide .bd-open { gap: 8px; }
    .bd-n, .bd.wide .bd-n { font-size: 13px; white-space: normal; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow-wrap: anywhere; }
    .bd-col-name, .bd.wide .bd-col-name { font-size: 11.5px; }
    .bd-col-glyph { display: none; }
  }
`,Ne=g`
  :host([embedded]) { display: block; }
  :host([embedded]) table.bd, .bd-fixed table.bd {
    --bd-col-w: var(--bd-stack-col-w, 112px);
    table-layout: fixed; min-width: calc(var(--bd-thing-min, 300px) + var(--bd-n, 0) * var(--bd-col-w));
  }
  @media (max-width: 640px) {
    :host([embedded]) table.bd, .bd-fixed table.bd { --bd-col-w: 78px; --bd-thing-min: 150px; }
  }
`;function nn(e){return`library:${e.kind}:${e.id}`}function tn(e,n){return e===void 0||n===void 0?e===n:e.kind===n.kind&&e.id.toUpperCase()===n.id.toUpperCase()}function ue(e,n){return{kind:e,revision:n.revision,document:n.document,hash:null,updated_at:null,updated_by:null,delivered_revision:0,delivered_at:null}}async function rn(e,n){let t=await C(e,n.kind,n.id);return{...ue(n.kind,t),...typeof t.name=="string"?{name:t.name}:{}}}function on(e,n,t){return{save:(i,r)=>n!==void 0?n.saveItem(t.kind,t.id,i,r):B(e,t.kind,t.id,i,r),fetch:async()=>{let i=await C(e,t.kind,t.id);return{revision:i.revision,document:i.document}}}}function an(e,n){if(e!==void 0)return n.kind==="menus"?m(e,n.id)?.revision:v(e,n.kind,n.id)?.revision}function dn(e){return`Delete "${e}"?`}var he="This device",fe="Every device";function sn(e,n){let t="with every tile and menu slot that opened it";return e<=0?`It is on no device yet. It is deleted for good, ${t}.`:e===1?`It is on 1 device. It is deleted for good, ${t}.`:n!==void 0?`It is on ${e} devices. ${he} takes it off ${n} only, and you can tick it again. ${fe} deletes it for good, ${t}.`:`It is on ${e} devices. Delete takes it off every device for good, ${t}. To take it off one device, untick it instead.`}var N="wrist-assistant-panel.library.preview-kind.v1";function we(){try{return globalThis.sessionStorage?.getItem(N)==="iphone"?"iphone":"watch"}catch{return"watch"}}function ge(e){try{globalThis.sessionStorage?.setItem(N,e)}catch{}}function ln(e,n,t=[]){let i=r=>k(e,r.owner_watch_id)===(n==="iphone");for(let r of t){if(r===void 0)continue;let o=e.find(s=>s.owner_watch_id.toUpperCase()===r.toUpperCase());if(o!==void 0&&i(o))return o.owner_watch_id}return e.find(i)?.owner_watch_id}function cn(e,n){if(e!==void 0)return(n.kind==="menus"?m(e,n.id)?.owners:v(e,n.kind,n.id)?.owners)??[]}function pn(e,n,t){let i=s=>{let b=e.find(l=>l.owner_watch_id.toUpperCase()===s.toUpperCase());return b===void 0?void 0:k(e,b.owner_watch_id)?"iphone":"watch"},r=n.from===void 0?void 0:i(n.from);if(r!==void 0)return r;let o=new Set((t??[]).map(i).filter(s=>s!==void 0));return o.size===1?[...o][0]:we()}function xe(e){return e==="watch"?$`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="6.5" y="1" width="7" height="3" rx="1"/><rect x="6.5" y="16" width="7" height="3" rx="1"/><rect x="4" y="3.5" width="12" height="13" rx="3.5"/></svg>`:$`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="1" width="10" height="18" rx="2.5"/><rect class="pv-notch" x="8" y="2.2" width="4" height="1.2" rx=".6"/></svg>`}function ve(){return $`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="1" y="5.5" width="7.5" height="9" rx="2.4"/><rect x="11" y="2" width="7.5" height="16" rx="2"/></svg>`}function bn(e,n,t){let i=t?.on===!0,r=(o,s)=>{let b=e===o&&!i;return a`<button type="button" class="lib-preview-thumb ${o} ${b?"on":""}"
      aria-pressed=${b?"true":"false"} title=${s} aria-label=${s}
      @click=${()=>{b||(ge(o),n(o))}}>${xe(o)}</button>`};return a`<span class="lib-preview" role="group" aria-label="Preview on" title="What this is drawn on. Nothing is changed on any device.">
    <span class="lib-preview-l">Preview on</span>
    ${r("watch","Preview on a watch")}
    ${r("iphone","Preview on an iPhone")}
    ${t===void 0?d:a`<button type="button" class="lib-preview-thumb duo ${i?"on":""}"
      aria-pressed=${i?"true":"false"} title="Side by side: a watch and an iPhone" aria-label="Side by side: a watch and an iPhone"
      @click=${()=>{i||t.pick()}}>${ve()}</button>`}
  </span>`}function un(e,n,t){return!t||new Set(e.map(o=>k(e,o.owner_watch_id))).size<2?!1:new Set((n??[]).flatMap(o=>{let s=e.find(b=>b.owner_watch_id.toUpperCase()===o.toUpperCase());return s===void 0?[]:[k(e,s.owner_watch_id)]})).size!==1}function hn(e){return e==="watch"?"iphone":"watch"}function fn(e,n){let t=e==="watch"?"Watch":"iPhone";return n.length===0?`${t} \xB7 on no ${e==="watch"?"watch":"iPhone"} yet`:`${t} \xB7 ${n.join(", ")}`}function wn(){return a`<span class="lib-mode-tag" title="One for every device that has it. A save reaches all of them.">Shared</span>`}function q(e){return e==="menus"?"Which devices should use this menu?":"Which devices do you want this on?"}function me(e,n){return n===0?"On no device yet":`On ${n} ${n===1?"device":"devices"}`}function gn(e,n,t,i){return a`<div class="lib-on over-stage ${n===0?"none":""}" role="group" aria-label=${q(e)}>
    <span class="lib-on-l">${q(e)}</span>${t}<span class="lib-on-n">${me(e,n)}</span>${ke(i)}
  </div>`}function ke(e,n=Date.now()){return e===void 0||n-e>=S?d:a`${W(e,a`<span class="lib-saved" role="status" style=${`animation-delay:${Math.max(0,S-400-(n-e))}ms`}>Saved</span>`)}`}var xn=g`
  /* Preview on, in the strip over the stage beside the watch's size and the
     zoom: the words, then the two thumbnails, the shown one filled in the
     accent. */
  .lib-preview { display: inline-flex; align-items: center; gap: 3px; padding-left: 6px; font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .lib-preview-l { margin-right: 3px; }
  .lib-preview-thumb {
    display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 24px; padding: 0;
    border: 1px solid transparent; border-radius: 6px; background: transparent; color: var(--wa-muted); cursor: pointer;
  }
  .lib-preview-thumb svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.4; }
  .lib-preview-thumb svg .pv-notch { fill: currentColor; stroke: none; }
  .lib-preview-thumb:hover { color: var(--wa-ink); background: var(--wa-hover); }
  .lib-preview-thumb:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lib-preview-thumb.on { color: var(--wa-accent, var(--wa-ink)); border-color: color-mix(in srgb, currentColor 45%, transparent); background: color-mix(in srgb, currentColor 14%, transparent); cursor: default; }
  .lib-preview-thumb.on svg { fill: color-mix(in srgb, currentColor 22%, transparent); }
  .lib-preview-thumb.on svg .pv-notch { fill: var(--wa-card); }
  .lib-preview-thumb.duo { width: 30px; }
  /* Side by side: the edited preview and the other kind's, each under its
     label and over its differences line, watch first. They wrap one under
     the other when the canvas is too narrow for both. */
  .lib-duo { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: 18px 28px; width: 100%; }
  .lib-duo-side { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 0; }
  .lib-duo-side.watch { order: 0; }
  .lib-duo-side.iphone { order: 1; }
  .lib-duo-l {
    display: inline-flex; align-items: center; gap: 6px; max-width: 100%; font-size: 12.5px; font-weight: 600; color: var(--wa-ink);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .lib-duo-l .lib-duo-tag { font-size: 11px; font-weight: 600; color: var(--wa-muted); }
  .lib-duo-other {
    position: relative; padding: 0; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; border-radius: 12px;
  }
  .lib-duo-other > * { pointer-events: none; }
  .lib-duo-other:hover { box-shadow: 0 0 0 2px color-mix(in srgb, var(--wa-accent, var(--wa-ink)) 45%, transparent); }
  .lib-duo-other:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* The differences line: only what this kind does otherwise. */
  .lib-diff { max-width: 340px; font-size: 12px; line-height: 1.4; color: var(--wa-muted); text-align: center; }
  .lib-mode-tag {
    display: inline-flex; align-items: center; min-height: 22px; padding: 0 8px; border-radius: 999px;
    border: 1px solid var(--wa-line); color: var(--wa-muted); font-size: 11.5px; font-weight: 600;
  }
  /* The device strip under the canvas head (renderBarDevices): framed in
     the accent, the question in bold, the chips a size up from the cards',
     then the count. It wraps when the canvas card is narrow: the chips take
     a line of their own under the question, and only when they cannot all
     fit even that line do the unticked ones fold into "+ Add to a device"
     (the chip row measures it, chip-row.ts). */
  .lib-on {
    display: flex; align-items: center; flex-wrap: wrap; gap: 6px 12px; min-width: 0; flex: 0 1 auto;
    margin-left: 6px; padding: 5px 12px; border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--wa-accent, var(--wa-ink)) 40%, transparent);
    background: color-mix(in srgb, var(--wa-accent, var(--wa-ink)) 9%, transparent);
  }
  .lib-on-l { font-size: 13px; font-weight: 700; color: var(--wa-ink); white-space: nowrap; }
  .lib-on-n { font-size: 12px; font-weight: 600; color: var(--wa-muted); white-space: nowrap; }
  .lib-on.none .lib-on-n { color: var(--wa-amber); }
  .lib-on .lt-ticks { flex-direction: row; align-items: center; flex-wrap: wrap; gap: 4px 10px; }
  .lib-on .lt-chips { gap: 6px; }
  .lib-on .lt-chip { height: 28px; padding: 0 11px 0 9px; font-size: 12.5px; border-color: color-mix(in srgb, var(--dc, var(--wa-muted)) 55%, transparent); }
  .lib-on .lt-chip.off { color: var(--wa-ink); }
  .lib-on .lt-box { width: 13px; height: 13px; }
  /* An untick's question (ticks.ts) takes a line of its own under the chips. */
  .lib-on .lt-ask { flex: 1 1 100%; max-width: none; }
  /* Its place under the canvas head, over the stage: the canvas card's
     width, one line when it fits, the question first. */
  .lib-on.over-stage { flex: none; margin: 6px 6px 0; padding: 7px 12px; box-sizing: border-box; }
  .lib-on.over-stage .lt-ticks { flex: 1 1 auto; }
  .lib-on.over-stage .lib-on-n { margin-left: auto; }
  /* "Saved" after the count, fading out once the flash is over. */
  .lib-saved {
    font-size: 12px; font-weight: 600; color: var(--wa-green); white-space: nowrap;
    animation: lib-saved-out .4s ease-in forwards;
  }
  @keyframes lib-saved-out { to { opacity: 0; } }
`;export{W as a,te as b,Ae as c,re as d,Be as e,Ue as f,S as g,F as h,Fe as i,Ve as j,qe as k,Ne as l,nn as m,tn as n,rn as o,on as p,an as q,dn as r,he as s,fe as t,sn as u,ge as v,ln as w,cn as x,pn as y,bn as z,un as A,hn as B,fn as C,wn as D,gn as E,xn as F};
