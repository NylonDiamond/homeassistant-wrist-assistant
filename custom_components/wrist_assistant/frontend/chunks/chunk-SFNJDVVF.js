import{a as v,w as S,x as H}from"./chunk-OFV7VVZW.js";import{h as y}from"./chunk-HMGUBJ4E.js";import{k as E,l as K}from"./chunk-SEPUIJSR.js";import{b as M,c as I,g as _}from"./chunk-TOKIRHDQ.js";import{ph as u}from"./chunk-NPUC537M.js";import{$ as R,aa as L}from"./chunk-HCRUIACR.js";import{B as A}from"./chunk-A3CWY7SV.js";import{a as D,b as x,f as a,g as h,i as s,k as T}from"./chunk-6ZDBXU6B.js";var N=M(class extends I{constructor(){super(...arguments),this.key=s}render(e,t){return this.key=e,t}update(e,[t,n]){return t!==this.key&&(_(e),this.key=t),n}});var Ve=32,V="wrist-assistant-panel.board-density.v1",g;function U(e=()=>window.localStorage){if(g!==void 0)return g;try{g=e().getItem(V)==="compact"?"compact":"large"}catch{g="large"}return g}function Ue(e,t=()=>window.localStorage){g=e;try{t().setItem(V,e)}catch{}}var F="(max-width: 640px)",P=new Set;function Fe(e,t,n=J()){return t==="board"&&n&&!P.has(e)?"cards":t}function qe(e,t){t==="board"?P.add(e):P.delete(e)}function J(){try{return window.matchMedia(F).matches}catch{return!1}}var Z={settings:"Settings",rooms:"Rooms",voice:"Voice"},C=1800,ee=1500,te=2.2,ne=1900,oe=3.2,ie=900,re=1.5,ae=560,de=.8,W=class{constructor(t){this.host=t;this.wide=!1;this.scale=1;t.addController(this)}hostConnected(){typeof ResizeObserver>"u"||(this.seen=new ResizeObserver(t=>{let n=t[0]?.contentRect.width??0,o=n>=ee,i=n>=ne?oe:o?te:n>=ie?re:n>0&&n<ae?de:1;o===this.wide&&i===this.scale||(this.wide=o,this.scale=i,this.host.requestUpdate())}),this.seen.observe(this.host))}hostDisconnected(){this.seen?.disconnect(),this.seen=void 0}size(t){return Math.round(t*this.scale)}};function Xe(e,t,n){let o=(i,r,l)=>a`<button type="button" class="bd-view-opt ${e===i?"on":""}"
    aria-pressed=${e===i?"true":"false"} title=${l} @click=${()=>{e!==i&&t(i)}}>${u(i==="board"?"checklist":"grid")}<span>${r}</span></button>`;return a`<span class="bd-view" role="group" aria-label=${`How to show the ${n}`}>
    ${o("board","Board",`Every ${n.replace(/s$/,"")} as a row, every device as a column`)}${o("cards","Cards",`Every ${n.replace(/s$/,"")} as a card with its picture`)}
  </span>`}function Ye(e,t){let n=(o,i,r,l)=>a`<button type="button" class="bd-view-opt ${e===o?"on":""}"
    aria-pressed=${e===o?"true":"false"} title=${r} @click=${()=>{e!==o&&t(o)}}>${l}<span>${i}</span></button>`;return a`<span class="bd-view bd-density" role="group" aria-label="How big the rows are">
    ${n("compact","Compact","Small rows, so more fit on one screen. Hover a picture to see it big.",se)}${n("large","Large","Big rows with big pictures",le)}
  </span>`}var m=e=>a`<svg class="bd-i" viewBox="0 0 16 16" aria-hidden="true">${e}</svg>`,se=m(h`<path d="M2.5 3.5h11M2.5 6.5h11M2.5 9.5h11M2.5 12.5h11"/>`),le=m(h`<rect x="2.5" y="2.5" width="11" height="4.6" rx="1.2"/><rect x="2.5" y="9" width="11" height="4.6" rx="1.2"/>`),q=m(h`<circle cx="8" cy="8" r="4.6"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3"/><circle class="bd-i-dot" cx="8" cy="8" r="1"/>`),ce=m(h`<path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/>`),X=m(h`<path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5"/>`),pe=m(h`<path d="M1.6 8s2.4-4.3 6.4-4.3S14.4 8 14.4 8s-2.4 4.3-6.4 4.3S1.6 8 1.6 8z"/><circle cx="8" cy="8" r="1.9"/>`);function Ge(e,t){return{badge:A(e)?"Update app":"Waiting",text:t}}function Qe(e){if(e.next===void 0||e.shape==="round")return e.title;let t=`${e.next?"Put on":"Take off"} ${e.name}`,n=[...e.hidden?["It is hidden there."]:[],...e.skips===void 0?[]:[e.skips.title]];return n.length===0?t:`${t}. ${n.join(" ")}`}var j=(e,t)=>e!==void 0&&t!==void 0&&e.toUpperCase()===t.toUpperCase();function Je(e){let t=e.columns.length+1,n=e.columns.findIndex(r=>j(r.device.ownerId,e.focus)),o=e.density??U(),i=e.wide===!0&&o==="large";return a`<wa-board-frame class="bd-frame ${o} ${n>=0?"focused":""} ${i?"wide":""}" style=${`--bd-n:${e.columns.length}`} data-n=${e.columns.length}>
    <div class="bd-pin">
      ${e.pinned??s}
      <div class="bd-head-scroll">
        <div class="bd-head" role="group" aria-label="Devices">
          <div class="bd-hthing">${e.thing}</div>
          ${e.columns.map(r=>ue(r,j(r.device.ownerId,e.focus),e))}
        </div>
      </div>
      <button type="button" class="bd-more" hidden><span class="bd-more-t"></span>${X}</button>
    </div>
    ${e.legend===void 0?s:be(e.legend)}
    <div class="bd-scroll">
      <table class="bd ${o} ${n>=0?"focused":""} ${i?"wide":""}" aria-label=${e.label}>
        <thead class="bd-thead"><tr>
          <th scope="col" class="bd-thing"><span class="bd-sr">${e.thing}</span></th>
          ${e.columns.map((r,l)=>a`<th scope="col" class="bd-col ${l===n?"on":""}"><span class="bd-sr">${r.device.name}</span></th>`)}
        </tr></thead>
        ${e.sections.map(r=>a`<tbody class="bd-sect-body" data-section=${r.key}>
          ${r.title===void 0?s:a`<tr class="bd-sect"><th colspan=${t} scope="colgroup">
            <span class="bd-sect-t">${r.title}${r.count===void 0?s:a` <small>${r.count}</small>`}</span>
            ${r.hint===void 0?s:a`<span class="bd-sect-r">${r.hint}</span>`}
            ${r.note===void 0?s:a`<span class="bd-sect-note">${u("info")}<span>${r.note}</span></span>`}
          </th></tr>`}
          ${r.rows.length===0&&r.empty!==void 0?a`<tr class="bd-none"><td colspan=${t}>${r.empty}</td></tr>`:r.rows.map((l,d)=>a`${l.group!==void 0&&l.group!==r.rows[d-1]?.group?he(l.group,r.rows.slice(d).findIndex(p=>p.group!==l.group),r.rows.length-d,t):s}${fe(l,e,n,t,o)}`)}
        </tbody>`)}
      </table>
    </div>
    <div class="bd-peek" hidden aria-hidden="true"></div>
    <div class="bd-pop" hidden></div>
  </wa-board-frame>`}function Ze(e){let t=U();return a`<wa-board-frame class="bd-frame ${t}" style=${`--bd-n:${e.columns.length}`} data-n=${e.columns.length}>
    <div class="bd-pin">
      <div class="bd-head-scroll">
        <div class="bd-head" role="group" aria-label="Devices">
          <div class="bd-hthing">${e.thing}</div>
          ${e.columns.map(n=>a`<div class="bd-hcol" style=${n.color===void 0?s:`--dc:${n.color}`}>${Y(n.device)}</div>`)}
        </div>
      </div>
      <button type="button" class="bd-more" hidden><span class="bd-more-t"></span>${X}</button>
    </div>
    <div class="bd-scroll">
      <table class="bd ${t}" aria-label=${e.label}>
        <thead class="bd-thead"><tr>
          <th scope="col" class="bd-thing"><span class="bd-sr">${e.thing}</span></th>
          ${e.columns.map(n=>a`<th scope="col" class="bd-col"><span class="bd-sr">${n.device.name}</span></th>`)}
        </tr></thead>
        ${e.body}
      </table>
    </div>
    <div class="bd-peek" hidden aria-hidden="true"></div>
    <div class="bd-pop" hidden></div>
  </wa-board-frame>`}function Y(e){return a`<span class="bd-col-top" title=${e.name}>
    <span class="bd-col-glyph" aria-hidden="true">${u(e.kind==="iphone"?"phone":"watch")}</span>
    <span class="bd-col-name">${e.name}</span>
  </span>`}function be(e){let t=a`<i aria-hidden="true">·</i>`;return a`<div class="bd-legend">
    <span><span class="bd-legend-box ${e.round===!0?"rd":""}" aria-hidden="true">${e.round===!0?s:S}</span> ${e.tick}</span>${t}
    <span>${q} <b>Focus</b> ${e.focus}</span>${t}
    ${e.eye===void 0?s:a`<span>${pe} ${e.eye}</span>${t}`}
    <span>${e.saves}</span>
  </div>`}function et(e){let{device:t}=e,n=t.kind==="watch"?["settings","rooms","voice"]:["settings","rooms"],o=e.onOwn;return a`<div class="bd-focus" style=${e.color===void 0?s:`--dc:${e.color}`}>
    <span class="bd-focus-glyph" aria-hidden="true">${u(t.kind==="iphone"?"phone":"watch")}</span>
    <span class="bd-focus-t"><b>Showing ${t.name} first</b><span class="bd-focus-sep" aria-hidden="true">·</span><span>${e.text}</span></span>
    ${o===void 0?s:a`<span class="bd-focus-own">Also on this ${t.kind==="iphone"?"iPhone":"watch"}:
      ${n.map(i=>a`<button type="button" class="bd-link" @click=${()=>o(i)}>${Z[i]}</button>`)}</span>`}
    <button type="button" class="bd-focus-all" @click=${()=>e.onAll()}>${u("grid")}<span>Show every device</span></button>
  </div>`}function he(e,t,n,o){return a`<tr class="bd-group"><th colspan=${o} scope="rowgroup">
    <span class="bd-group-t">${e} <small>${t<0?n:t}</small></span>
  </th></tr>`}function ue(e,t,n){let o=e.device,i=e.blocked;return a`<div class="bd-hcol ${t?"on":""}" style=${e.color===void 0?s:`--dc:${e.color}`}>
    ${Y(o)}
    ${i===void 0?s:a`<button type="button" class="bd-upd" title=${i.text} aria-label=${`${i.badge}. ${i.text}`}
      @click=${r=>k(r)?.openNote(r.currentTarget,i.text)}>${i.badge}${u("info")}</button>`}
    <span class="bd-col-sub"><span class="bd-col-n">${e.count}</span>
      <button type="button" class="bd-focus-pill ${t?"on":""}" aria-pressed=${t?"true":"false"}
        aria-label=${t?`Stop focusing ${o.name}`:`Focus ${o.name}`}
        title=${t?"Show every device":n.focusTitle(o)}
        @click=${()=>n.onFocus(t?void 0:o.ownerId)}>${t?a`<span>Focused</span>${ce}`:a`${q}<span>Focus</span>`}</button></span>
  </div>`}function fe(e,t,n,o,i){let r=t.columns,l=t.ordered===!0&&n>=0,d=e.drag,p=`bd-row ${e.dim?"dim":""} ${e.select?.picked?"picked":""} ${d?.dragging?"dragging":""} ${d?.over?"drag-over":""} ${d?.below?"below":""}`,b=i==="compact"?e.peek:void 0,f=c=>{b!==void 0&&k({currentTarget:c})?.showPeek(c,()=>ge(e,b()))},z=c=>{b!==void 0&&k(c)?.hidePeek()},$=e.more,O=a`<tr class=${p} data-row=${e.key} draggable=${d?.on?"true":"false"}
    @dragstart=${c=>d?.onStart(c)}
    @dragover=${c=>d?.onOver(c)}
    @drop=${c=>d?.onDrop(c)}
    @dragend=${()=>d?.onEnd()}
    @keydown=${c=>d?.onKey(c)}>
    <th scope="row" class="bd-thing">
      <span class="bd-thing-in">
        ${d===void 0?l?a`<span class="bd-grip none" aria-hidden="true">${u("grip")}</span>`:s:a`<span class="bd-grip" aria-hidden="true" title=${d.on?"Drag to order":""}>${u("grip")}</span>`}
        ${e.select===void 0?s:a`<input type="checkbox" class="pk-card-pick" .checked=${e.select.picked}
          ?disabled=${e.select.disabled} aria-label=${e.select.label}
          @click=${c=>{c.stopPropagation(),e.select.onPick(c)}} />`}
        <button type="button" class="bd-open" title=${e.openTitle} @click=${c=>e.onOpen(c)}
          @focusin=${c=>{let w=c.currentTarget;w.matches(":focus-visible")&&f(w.querySelector(".bd-pic")??w)}}
          @focusout=${z}>
          ${e.picture===void 0?s:a`<span class="bd-pic"
            @pointerenter=${c=>{c.pointerType!=="touch"&&f(c.currentTarget)}}
            @pointerleave=${z}>${e.picture}</span>`}
          <span class="bd-nm"><span class="bd-n">${e.name}</span><span class="bd-m">${e.detail}</span></span>
        </button>
        ${e.actions===void 0&&$===void 0?s:a`<span class="bd-row-acts">
          ${e.actions??s}
          ${$===void 0?s:a`<button type="button" class="bd-act" title="More" aria-label=${`More for ${e.name}`} aria-haspopup="menu"
            @click=${c=>{c.stopPropagation(),k(c)?.openMenu(c.currentTarget,`More for ${e.name}`,$)}}>${u("more")}</button>`}
        </span>`}
      </span>
    </th>
    ${r.map((c,w)=>we(e,e.cells[w],c,w===n,l,t.legend?.eye!==void 0))}
  </tr>`;return e.ask!==void 0||e.note!==void 0||e.under!==void 0?a`${O}<tr class="bd-under ${e.dim?"dim":""}"><td colspan=${o}>
    ${e.ask===void 0?s:H(e.ask)}
    ${e.note===void 0?s:e.note.kind==="ok"?a`<p class="lt-note ok" role="status">${e.note.text}</p>`:a`<p class="lt-note" role="alert">${e.note.text}</p>`}
    ${e.under??s}
  </td></tr>`:O}function we(e,t,n,o,i,r){let l=n.color===void 0?s:`--dc:${n.color}`,d=t?.chip;if(d===void 0){let f=t?.dashTitle??`Does not fit ${n.device.name}`;return a`<td class="bd-cell ${o?"on":""} ${t?.grey?"grey":""}" style=${l}>
      <span class=${t?.grey?"bd-grey":"bd-dash"} role="img" aria-label=${f} title=${f}></span>
    </td>`}let p=d.shape==="round",b=o&&i;return a`<td class="bd-cell ${o?"on":""}" style=${l}>
    <span class="bd-cell-in ${b?"slots":""}">
      <button type="button" role="checkbox" class="bd-box ${d.on?"ticked":""} ${p?"rd":""} ${d.busy?"busy":""} ${d.stuck===void 0?"":"stuck"} ${d.hidden?"dim":""}"
        title=${d.title} aria-label=${`${e.name} on ${d.name}`}
        aria-checked=${d.on?"true":"false"} aria-disabled=${d.next===void 0?"true":"false"}
        @click=${f=>{f.stopPropagation(),d.next!==void 0&&t?.onPick?.(d.next)}}><span class="bd-mark" aria-hidden="true">${d.on&&!p?S:s}</span></button>
      ${b?a`<span class="bd-ord" title=${t?.order===void 0?s:`Number ${t.order} on ${d.name}`}>${t?.order??s}</span>`:s}
      ${t?.eye===void 0?b&&r?a`<span class="bd-no-eye" aria-hidden="true"></span>`:s:a`<button type="button" class="bd-eye ${t.eye.hidden?"hid":""}" ?disabled=${t.eye.busy}
        title=${t.eye.title} aria-label=${t.eye.title} aria-pressed=${t.eye.hidden?"true":"false"}
        @click=${f=>{f.stopPropagation(),t.eye.onToggle()}}>${u(t.eye.hidden?"hide":"show")}</button>`}
    </span>
    ${d.hidden&&t?.note===void 0?a`<em class="bd-note">hidden</em>`:s}
    ${t?.note===void 0?s:a`<em class="bd-note ${t.noteWarn?"warn":""}" title=${t.noteTitle??s}>${t.note}</em>`}
  </td>`}function ge(e,t){return a`<div class="bd-peek-h"><b>${e.name}</b><span>${e.detail}</span></div>
    <div class="bd-peek-pic">${t.picture}</div>
    ${t.where===void 0?s:a`<div class="bd-peek-w">${t.where}</div>`}
    <div class="bd-peek-k">Click the row to open the editor</div>`}function me(e,t){return e.filter(n=>n.right-t>(n.right-n.left)/2).length}function xe(e){return`+${e} ${e===1?"device":"devices"}`}var ve=180,ye=380,ke=typeof HTMLElement>"u"?class{}:HTMLElement;function k(e){return e.currentTarget?.closest?.("wa-board-frame")??null}var B=class extends ke{constructor(){super(...arguments);this.pushed=0;this.onInnerScroll=n=>{let o=this.child(".bd-head-scroll"),i=this.child(".bd-scroll");if(o===null||i===null||n.target!==i&&n.target!==o)return;let r=n.target===i?i:o,l=n.target===i?o:i;Math.abs(r.scrollLeft-this.pushed)>=1&&(this.pushed=r.scrollLeft,l.scrollLeft=r.scrollLeft),this.measure(),this.onOuterScroll()};this.onOuterScroll=()=>{this.hidePeek(),this.closePop(!1)};this.onClick=n=>{let o=this.child(".bd-more");o!==null&&n.composedPath().includes(o)&&this.showMore()};this.onKey=n=>{if(n.key==="Escape"){this.popAnchor!==void 0&&(n.stopPropagation(),this.closePop(!0)),this.hidePeek();return}if(this.popAnchor===void 0||n.key!=="ArrowDown"&&n.key!=="ArrowUp")return;let o=[...this.child(".bd-pop")?.querySelectorAll("[role=menuitem]:not(:disabled)")??[]];if(o.length===0)return;n.preventDefault();let i=o.indexOf(n.composedPath()[0]);o[(i+(n.key==="ArrowDown"?1:-1)+o.length)%o.length]?.focus()};this.onOutside=n=>{let o=this.child(".bd-pop"),i=n.composedPath();o===null||i.includes(o)||this.popAnchor!==void 0&&i.includes(this.popAnchor)||this.closePop(!1)}}static get observedAttributes(){return["class","data-n"]}child(n){return this.querySelector(n)}connectedCallback(){this.addEventListener("scroll",this.onInnerScroll,{capture:!0,passive:!0}),this.addEventListener("click",this.onClick),this.addEventListener("keydown",this.onKey),this.addEventListener("dragstart",this.onOuterScroll),typeof ResizeObserver<"u"&&(this.sized=new ResizeObserver(()=>this.measure()),this.sized.observe(this)),queueMicrotask(()=>this.measure())}disconnectedCallback(){this.removeEventListener("scroll",this.onInnerScroll,{capture:!0}),this.removeEventListener("click",this.onClick),this.removeEventListener("keydown",this.onKey),this.removeEventListener("dragstart",this.onOuterScroll),this.sized?.disconnect(),this.sized=void 0,this.hidePeek(),this.closePop(!1)}attributeChangedCallback(){this.isConnected&&requestAnimationFrame(()=>this.measure())}measure(){let n=this.child(".bd-head-scroll"),o=this.child(".bd-scroll"),i=this.child(".bd-more");if(n===null||o===null||i===null)return;let r=n.getBoundingClientRect().right,l=[...n.querySelectorAll(".bd-hcol")].map(b=>b.getBoundingClientRect()).filter(b=>b.width>0),d=me(l,r);this.toggleAttribute("fades",o.scrollLeft+o.clientWidth<o.scrollWidth-1),i.hidden=d===0;let p=i.querySelector(".bd-more-t");p!==null&&(p.textContent=xe(d))}showMore(){let n=this.child(".bd-scroll");if(n===null)return;let o=this.child(".bd-hthing")?.offsetWidth??0,i=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches===!0;n.scrollBy({left:Math.max(96,n.clientWidth-o),behavior:i?"auto":"smooth"})}watchOuterScroll(n){let o=this.getRootNode();n&&this.watchedRoot===void 0?(this.watchedRoot=o,o.addEventListener("scroll",this.onOuterScroll,{capture:!0,passive:!0}),window.addEventListener("scroll",this.onOuterScroll,{capture:!0,passive:!0})):!n&&this.watchedRoot!==void 0&&this.popAnchor===void 0&&this.child(".bd-peek")?.hidden!==!1&&(this.watchedRoot.removeEventListener("scroll",this.onOuterScroll,{capture:!0}),window.removeEventListener("scroll",this.onOuterScroll,{capture:!0}),this.watchedRoot=void 0)}showPeek(n,o){clearTimeout(this.peekTimer),this.peekTimer=setTimeout(()=>{let i=this.child(".bd-peek");if(i===null||!n.isConnected)return;let r=n.getBoundingClientRect();T(o(),i),i.style.left=`${Math.max(8,Math.min(r.left,window.innerWidth-250))}px`,window.innerHeight-r.bottom>=ye?(i.style.top=`${r.bottom+8}px`,i.style.bottom=""):(i.style.top="",i.style.bottom=`${Math.max(8,window.innerHeight-r.top+8)}px`),i.hidden=!1,this.watchOuterScroll(!0)},ve)}hidePeek(){clearTimeout(this.peekTimer);let n=this.child(".bd-peek");n!==null&&(n.hidden=!0),this.watchOuterScroll(!1)}openMenu(n,o,i){if(this.popAnchor===n){this.closePop(!0);return}this.openPop(n,a`<div role="menu" aria-label=${o}>${i.map(r=>a`<button type="button" role="menuitem" class="bd-pop-item"
      ?disabled=${r.disabled===!0} title=${r.title??s}
      @click=${()=>{this.closePop(!0),r.onPick()}}>${r.label}</button>`)}</div>`),this.child(".bd-pop")?.querySelector("[role=menuitem]:not(:disabled)")?.focus()}openNote(n,o){if(this.popAnchor===n){this.closePop(!0);return}this.openPop(n,a`<p class="bd-pop-note" role="status">${o}</p>`)}openPop(n,o){let i=this.child(".bd-pop");if(i===null)return;this.closePop(!1),T(o,i),i.hidden=!1;let r=n.getBoundingClientRect(),l=i.offsetWidth,d=i.offsetHeight;i.style.left=`${Math.max(8,Math.min(r.left,window.innerWidth-l-8))}px`,i.style.top=`${r.bottom+d+12>window.innerHeight?Math.max(8,r.top-d-4):r.bottom+4}px`,this.popAnchor=n,n.setAttribute("aria-expanded","true"),n.closest(".bd-row")?.classList.add("pop-open"),this.popRoot=this.getRootNode(),this.popRoot.addEventListener("pointerdown",this.onOutside,!0),this.watchOuterScroll(!0)}closePop(n){let o=this.popAnchor;if(o===void 0)return;this.popAnchor=void 0;let i=this.child(".bd-pop");i!==null&&(i.hidden=!0),o.removeAttribute("aria-expanded"),o.closest(".bd-row")?.classList.remove("pop-open"),this.popRoot?.removeEventListener("pointerdown",this.onOutside,!0),this.popRoot=void 0,this.watchOuterScroll(!1),n&&o.focus()}};typeof customElements<"u"&&!customElements.get("wa-board-frame")&&customElements.define("wa-board-frame",B);var tt=x`
  /* One set of column tracks for the heads and the table, so a head stands
     over its boxes whichever way they scroll. Large: the device columns keep
     one narrow width (--bd-col-w) and the first column takes the rest, so a
     wide screen gives its room to the things' pictures, not to gaps between
     ticks (Jesse, 2026-10-23). Compact: the first column stops at 320 px and
     the device columns share the rest, so a row's box is beside its name. */
  wa-board-frame { display: block; position: relative; min-width: 0; }
  .bd-frame {
    --bd-ground: var(--wa-bg); --bd-col-w: 104px; --bd-min-first: 220px;
    --bd-first-track: minmax(0, 1fr); --bd-col-track: var(--bd-col-w);
    --bd-first-w: auto; --bd-cell-w: var(--bd-col-w);
    --bd-width-min: calc(var(--bd-min-first) + var(--bd-n, 0) * var(--bd-col-w));
    --bd-width-max: none;
  }
  .bd-frame.compact {
    --bd-col-w: 96px; --bd-min-first: 320px;
    --bd-first-track: 320px; --bd-col-track: minmax(var(--bd-col-w), 1fr);
    --bd-first-w: 320px; --bd-cell-w: auto;
  }
  @media (max-width: 1100px) {
    .bd-frame.compact { --bd-min-first: 240px; --bd-first-track: 240px; --bd-first-w: 240px; }
  }
  .bd-frame.wide { --bd-col-w: 124px; --bd-min-first: 320px; }

  /* The heads stay on screen while the page scrolls, under the tab bar. */
  .bd-pin { position: sticky; top: var(--bd-pin-top, 0px); z-index: 6; background: var(--bd-ground); box-shadow: 0 6px 8px -6px rgba(0, 0, 0, .45); }
  .bd-head-scroll { overflow-x: auto; scrollbar-width: none; }
  .bd-head-scroll::-webkit-scrollbar { display: none; }
  .bd-head {
    display: grid; grid-template-columns: var(--bd-first-track) repeat(var(--bd-n, 0), var(--bd-col-track));
    width: 100%; min-width: var(--bd-width-min); max-width: var(--bd-width-max); box-sizing: border-box;
    border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
  }
  .bd-hthing {
    position: sticky; left: 0; z-index: 2; display: flex; align-items: flex-end; padding: 8px 10px 10px;
    background: var(--wa-card); font-size: 12px; font-weight: 600; color: var(--wa-muted);
  }
  .bd-hcol {
    display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 5px; min-width: 0;
    padding: 8px 4px 8px; box-sizing: border-box; margin-bottom: -1px; text-align: center; color: var(--wa-ink);
    border-bottom: 3px solid color-mix(in srgb, var(--dc, var(--wa-muted)) 70%, transparent);
  }
  .bd-hcol.on { background: color-mix(in srgb, var(--dc, var(--wa-accent)) 14%, var(--wa-card)); border-bottom-color: var(--dc, var(--wa-muted)); }
  .bd-i { display: block; width: 13px; height: 13px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  .bd-i .bd-i-dot { fill: currentColor; stroke: none; }
  /* One action on every column: bring this device to the front. */
  .bd-focus-pill {
    display: inline-flex; align-items: center; gap: 4px; height: 21px; padding: 0 8px 0 6px; box-sizing: border-box; flex: none;
    border-radius: 11px; border: 1px solid var(--wa-line-strong); background: none; font: inherit; font-size: 11.5px; font-weight: 600;
    color: var(--wa-ink); cursor: pointer; white-space: nowrap;
  }
  .bd-focus-pill .bd-i { width: 12px; height: 12px; }
  .bd-focus-pill:hover { background: var(--wa-hover); }
  .bd-focus-pill:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-focus-pill.on { padding: 0 6px 0 9px; border-color: var(--dc, var(--wa-ink)); background: var(--dc, var(--wa-ink)); color: var(--wa-card); }
  .bd-focus-pill.on:hover { filter: brightness(1.08); }
  .bd-upd {
    display: inline-flex; align-items: center; gap: 4px; height: 18px; padding: 0 6px; box-sizing: border-box; flex: none;
    border-radius: 5px; font: inherit; font-size: 10.5px; font-weight: 600; white-space: nowrap; cursor: pointer;
    color: var(--wa-amber); background: color-mix(in srgb, var(--wa-amber) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--wa-amber) 40%, transparent);
  }
  .bd-upd svg { width: 11px; height: 11px; flex: none; }
  .bd-upd:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* A narrow board: what is cut off fades at the right, and a button says how
     many devices are past it and goes there. */
  .bd-more {
    position: absolute; right: 4px; bottom: 11px; z-index: 3; display: inline-flex; align-items: center; gap: 4px; height: 23px; padding: 0 8px;
    border-radius: 12px; border: 1px solid var(--wa-line-strong); background: var(--wa-panel, var(--wa-card)); color: var(--wa-ink);
    font: inherit; font-size: 11.5px; font-weight: 600; white-space: nowrap; cursor: pointer;
    box-shadow: -12px 0 12px var(--wa-card);
  }
  .bd-more[hidden] { display: none; }
  .bd-more:hover { background: var(--wa-hover); }
  .bd-more:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  wa-board-frame[fades] .bd-head-scroll, wa-board-frame[fades] .bd-scroll {
    -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 56px), transparent);
    mask-image: linear-gradient(to right, #000 calc(100% - 56px), transparent);
  }
  /* What a box, Focus and the eye do, once, under the heads. */
  .bd-legend {
    display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; min-height: 30px; padding: 4px 8px; box-sizing: border-box;
    border-bottom: 1px solid var(--wa-line); font-size: 12px; color: var(--wa-muted);
  }
  .bd-legend span { display: inline-flex; align-items: center; gap: 6px; }
  .bd-legend i { font-style: normal; color: var(--wa-muted); opacity: .6; }
  .bd-legend b { font-weight: 600; color: var(--wa-ink); }
  .bd-legend .bd-i { color: var(--wa-ink); }
  .bd-legend-box {
    display: inline-grid; place-items: center; width: 14px; height: 14px; box-sizing: border-box; flex: none; border-radius: 4px;
    background: var(--wa-muted); color: var(--wa-card);
  }
  .bd-legend-box.rd { border-radius: 50%; box-shadow: inset 0 0 0 3px var(--wa-card), 0 0 0 1.5px var(--wa-muted); }
  .bd-legend-box .lt-tick { display: block; width: 11px; height: 11px; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }

  .bd-scroll { overflow-x: auto; overflow-y: hidden; max-width: 100%; -webkit-overflow-scrolling: touch; }
  table.bd {
    table-layout: fixed; border-collapse: separate; border-spacing: 0; width: 100%;
    min-width: var(--bd-width-min); max-width: var(--bd-width-max); font-size: 12.5px;
  }
  .bd th, .bd td { padding: 0; text-align: left; font-weight: inherit; }
  /* The column names stay in the table for a screen reader; the strip above
     it is what shows. They hold the columns' widths. */
  .bd-thead th { height: 0; overflow: hidden; border: 0; line-height: 0; }
  .bd-thead .bd-thing { width: var(--bd-first-w); }
  .bd-col { width: var(--bd-cell-w); }
  .bd-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  /* The rows stand on the page's own ground, the first column too, so the
     board reads as one surface under a raised head. */
  .bd .bd-thing { position: sticky; left: 0; z-index: 1; background: var(--bd-ground); }
  /* A long name takes two lines rather than widen its column. */
  .bd-col-top { display: inline-flex; align-items: flex-start; justify-content: center; gap: 4px; max-width: 100%; }
  .bd-col-glyph { display: inline-flex; flex: none; margin-top: 1px; color: var(--dc, var(--wa-muted)); }
  .bd-col-glyph svg { width: 14px; height: 14px; }
  .bd-col-name {
    min-width: 0; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
    overflow-wrap: anywhere; line-height: 1.25; font-weight: 600; font-size: 12.5px;
  }
  .bd-col-sub { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .bd-col-n { font-variant-numeric: tabular-nums; }

  .bd-sect th { padding: 14px 10px 6px; border-bottom: 1px solid var(--wa-line); background: var(--bd-ground); }
  .compact .bd-sect th { padding: 9px 8px 6px; }
  .bd-sect th > * { position: sticky; left: 10px; }
  .bd-sect-t { font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
  .bd-sect-t small { margin-left: 4px; font-size: 12px; font-weight: 500; color: var(--wa-muted); }
  .bd-sect-r { margin-left: 12px; font-size: 11.5px; color: var(--wa-muted); font-weight: 400; }
  /* What every row of a section shares, once, in place of a column of dashes. */
  .bd-sect-note { display: flex; align-items: center; gap: 6px; margin-top: 4px; width: fit-content; font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
  .bd-sect-note svg { width: 13px; height: 13px; flex: none; }
  .bd-sect-note b { font-weight: 600; color: var(--wa-ink); }
  .bd-none td { padding: 10px; font-size: 12.5px; color: var(--wa-muted); }
  /* A run of rows of one kind inside a section (a shape): a band in small
     capitals with room above it, so one kind ends before the next begins. */
  /* A phone shows a board only when it is focused on one device (else it
     shows Cards, \`phoneView\`): then only that device's column, so the board
     never scrolls sideways. */
  @media ${D(F)} {
    /* No width, not gone: a section's heading still spans every column, and a
       fixed table would hand a gone column's share of the room back to it. */
    table.bd.focused .bd-col:not(.on), table.bd.focused td.bd-cell:not(.on) { width: 0; padding: 0; overflow: hidden; visibility: hidden; border: 0; }
    wa-board-frame.bd-frame.focused {
      --bd-n: 1 !important; --bd-col-w: 112px; --bd-min-first: 150px;
      --bd-first-track: minmax(0, 1fr); --bd-col-track: var(--bd-col-w); --bd-first-w: auto; --bd-cell-w: var(--bd-col-w);
    }
    .bd-frame.focused .bd-hcol:not(.on) { display: none; }
    /* With every column in a narrow first column, a row keeps its room for
       its name. Delete is on the card, a phone's first view. */
    .bd-frame:not(.focused) .bd-row-acts { display: none; }
  }
  .bd-group th {
    padding: 9px 10px; background: color-mix(in srgb, var(--wa-ink) 5%, var(--bd-ground));
    border-top: 14px solid var(--bd-ground); border-bottom: 1px solid var(--wa-line-strong);
    box-shadow: inset 0 1px 0 var(--wa-line-strong);
  }
  .bd-group th > * { position: sticky; left: 10px; }
  .bd-group-t { font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--wa-ink); }
  .bd-group-t small { margin-left: 6px; font-size: 12px; font-weight: 500; letter-spacing: 0; color: var(--wa-muted); }
  .bd-sect + .bd-group th { border-top-width: 0; }

  .bd-row > * { border-bottom: 1px solid var(--wa-line); }
  .bd-row:hover > * { background: color-mix(in srgb, var(--wa-hover) 60%, var(--bd-ground)); }
  .bd-row:hover > .bd-cell.on, .bd-cell.on { background: color-mix(in srgb, var(--dc, var(--wa-accent)) 8%, var(--bd-ground)); }
  .bd-row.picked > .bd-thing { box-shadow: inset 3px 0 0 var(--wa-ink); }
  .bd-row.dragging { opacity: .5; }
  .bd-row.drag-over > * { box-shadow: inset 0 2px 0 var(--wa-accent); }
  .bd-row.drag-over.below > * { box-shadow: inset 0 -2px 0 var(--wa-accent); }
  .bd-thing-in { display: flex; align-items: center; gap: 6px; padding: 6px 10px; min-width: 0; }
  .bd-grip { display: inline-flex; flex: none; color: var(--wa-muted); cursor: grab; }
  .bd-grip.none { visibility: hidden; }
  .bd-grip svg { width: 14px; height: 14px; }
  /* Trash and "...": out only on the row under the pointer or the keyboard. */
  .bd-row-acts { display: inline-flex; flex: none; align-items: center; gap: 2px; margin-left: auto; opacity: 0; transition: opacity .12s ease-out; }
  .bd-row:hover .bd-row-acts, .bd-row:focus-within .bd-row-acts, .bd-row.pop-open .bd-row-acts { opacity: 1; }
  @media (hover: none) { .bd-row-acts { opacity: 1; } }
  .bd-pic { display: inline-flex; flex: none; }
  /* Compact: 46 px rows, 32 px pictures, a box beside each name. */
  .compact .bd-row { height: 46px; }
  .compact .bd-thing-in { padding: 0 4px 0 2px; gap: 8px; }
  .compact .bd-open { gap: 10px; }
  .compact .bd-pic { align-items: flex-start; justify-content: center; height: 32px; min-width: 32px; max-width: 76px; overflow: hidden; border-radius: 7px; }
  .compact .bd-pic .lr-ring { width: 32px !important; height: 32px !important; }
  .compact.bd .bd-cell { padding: 2px 4px; }
  .compact .bd-box { width: 24px; height: 24px; }
  .compact .bd-note { margin-top: 0; font-size: 10px; line-height: 1.1; }
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
  .bd-cell-in.slots { display: inline-grid; grid-auto-flow: column; grid-template-columns: auto 16px; grid-auto-columns: 24px; }
  /* The focused column's order, beside each tick. */
  .bd-ord { font-size: 12.5px; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--dc, var(--wa-ink)); }
  .bd-box {
    display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0;
    border: 0; border-radius: 7px; background: none; cursor: pointer;
  }
  .bd-box:hover:not(.stuck):not(.busy) { background: var(--wa-hover); }
  .bd-box:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-mark {
    display: grid; place-items: center; width: 17px; height: 17px; box-sizing: border-box; border-radius: 4.5px;
    border: 1.6px solid color-mix(in srgb, var(--dc, var(--wa-muted)) 72%, transparent);
  }
  .bd-box.rd .bd-mark { border-radius: 50%; }
  .bd-box.ticked .bd-mark { background: var(--dc, var(--wa-accent)); border-color: var(--dc, var(--wa-accent)); }
  /* The tick in the card's color, so it reads on the device's fill in either
     skin, as a chip's does (\`.lt-tick\`). */
  .bd-mark .lt-tick { display: block; width: 13px; height: 13px; fill: none; stroke: var(--wa-card); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
  .bd-box.ticked.rd .bd-mark { box-shadow: inset 0 0 0 3px var(--wa-card); }
  .bd-box.ticked.rd { cursor: default; }
  .bd-box.dim .bd-mark { opacity: .5; }
  .bd-box.busy { opacity: .55; cursor: progress; }
  .bd-box.stuck { opacity: .4; cursor: not-allowed; }
  .bd-dash { display: inline-block; width: 12px; height: 2px; border-radius: 1px; background: var(--wa-line-strong); vertical-align: middle; }
  /* A kind of device this kind of thing never goes on: greyed, not 120 bare
     dashes. The section's note says why. */
  .bd .bd-cell.grey {
    padding: 0;
    background: repeating-linear-gradient(135deg, transparent 0 5px, color-mix(in srgb, var(--wa-ink) 6%, transparent) 5px 6px);
  }
  .bd-grey { display: block; width: 100%; height: 100%; min-height: 28px; }
  .bd-no-eye { display: block; width: 24px; }
  .bd-eye {
    display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0;
    border: 0; border-radius: 6px; background: none; color: var(--wa-muted); cursor: pointer;
  }
  .bd-eye svg { width: 15px; height: 15px; }
  .bd-eye:hover:not(:disabled) { background: var(--wa-hover); color: var(--wa-ink); }
  .bd-eye.hid { color: var(--wa-ink); }
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
  .bd-focus-t b { font-weight: 600; color: var(--wa-ink); }
  .bd-focus-sep { margin: 0 7px; opacity: .6; }
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
  /* A Compact row's big picture, and the small lists, over the page. Outside
     both scrollers, or they would cut these off. */
  .bd-peek {
    position: fixed; z-index: 40; width: 226px; padding: 12px; box-sizing: border-box; pointer-events: none;
    border-radius: 12px; border: 1px solid var(--wa-line-strong); background: var(--wa-card);
    box-shadow: var(--wa-shadow-pop, 0 18px 44px rgba(0, 0, 0, .5));
  }
  .bd-peek[hidden], .bd-pop[hidden] { display: none; }
  .bd-peek-h { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 9px; font-size: 13px; color: var(--wa-ink); }
  .bd-peek-h b { font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bd-peek-h span { flex: none; font-size: 12px; color: var(--wa-muted); }
  .bd-peek-pic { display: grid; place-items: center; }
  .bd-peek-w { margin-top: 9px; font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); }
  .bd-peek-k { margin-top: 3px; font-size: 11px; color: var(--wa-muted); opacity: .75; }
  .bd-pop {
    position: fixed; z-index: 40; min-width: 150px; max-width: 280px; padding: 4px; box-sizing: border-box;
    border-radius: 9px; border: 1px solid var(--wa-line-strong); background: var(--wa-card);
    box-shadow: var(--wa-shadow-pop, 0 8px 24px rgba(0, 0, 0, .35));
  }
  .bd-pop-item {
    display: block; width: 100%; padding: 6px 9px; border: 0; border-radius: 6px; background: none;
    font: inherit; font-size: 12.5px; color: var(--wa-ink); text-align: left; cursor: pointer;
  }
  .bd-pop-item:hover:not(:disabled), .bd-pop-item:focus-visible { outline: none; background: var(--wa-hover); }
  .bd-pop-item:disabled { opacity: .45; cursor: default; }
  .bd-pop-note { margin: 0; padding: 6px 8px; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
  .bd.wide { font-size: 13.5px; }
  .bd.wide .bd-thing-in { padding: 8px 14px; gap: 10px; }
  .bd.wide .bd-open { gap: 16px; }
  .bd.wide .bd-n { font-size: 15px; }
  .bd.wide .bd-m { font-size: 12.5px; }
  .bd.wide .bd-col-name { font-size: 13px; }
  /* A phone: the first column stays put and narrow while the device
     columns scroll sideways under it. */
  @media (max-width: 640px) {
    .bd-frame, .bd-frame.compact, .bd-frame.wide {
      --bd-col-w: 78px; --bd-min-first: 150px; --bd-first-track: 150px; --bd-col-track: minmax(var(--bd-col-w), 1fr);
      --bd-first-w: 150px; --bd-cell-w: auto;
    }
    .bd-hthing { padding: 8px 6px 10px; }
    .bd-thing-in, .bd.wide .bd-thing-in { padding: 6px; gap: 6px; }
    .bd-open, .bd.wide .bd-open { gap: 8px; }
    .bd-n, .bd.wide .bd-n { font-size: 13px; white-space: normal; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow-wrap: break-word; }
    .bd-col-name, .bd.wide .bd-col-name { font-size: 11.5px; }
    .bd-col-glyph { display: none; }
    .bd-col-sub { gap: 4px; font-size: 10.5px; }
    .bd-focus-pill { padding: 0 6px 0 4px; font-size: 10.5px; }
    .bd-focus-pill.on { padding: 0 4px 0 6px; }
  }
`,nt=x`
  :host([embedded]) { display: block; }
  :host([embedded]) .bd-frame, .bd-fixed .bd-frame.bd-frame {
    --bd-col-w: var(--bd-stack-col-w, 112px); --bd-min-first: var(--bd-thing-min, 300px);
    --bd-first-track: minmax(0, 1fr); --bd-col-track: var(--bd-col-w);
    --bd-first-w: auto; --bd-cell-w: var(--bd-col-w); --bd-width-max: none;
  }
  @media (max-width: 640px) {
    :host([embedded]) .bd-frame, .bd-fixed .bd-frame.bd-frame { --bd-col-w: 78px; --bd-min-first: 150px; --bd-first-track: 150px; --bd-col-track: minmax(78px, 1fr); --bd-first-w: 150px; --bd-cell-w: auto; }
  }
`;function bt(e){return`library:${e.kind}:${e.id}`}function ht(e,t){return e===void 0||t===void 0?e===t:e.kind===t.kind&&e.id.toUpperCase()===t.id.toUpperCase()}function $e(e,t){return{kind:e,revision:t.revision,document:t.document,hash:null,updated_at:null,updated_by:null,delivered_revision:0,delivered_at:null}}async function ut(e,t){let n=await E(e,t.kind,t.id);return{...$e(t.kind,n),...typeof n.name=="string"?{name:n.name}:{}}}function ft(e,t,n){return{save:(o,i)=>t!==void 0?t.saveItem(n.kind,n.id,o,i):K(e,n.kind,n.id,o,i),fetch:async()=>{let o=await E(e,n.kind,n.id);return{revision:o.revision,document:o.document}}}}function wt(e,t){if(e!==void 0)return t.kind==="menus"?L(e,t.id)?.revision:R(e,t.kind,t.id)?.revision}function gt(e){return`Delete "${e}"?`}var Te="This device",Ee="Every device";function mt(e,t){let n="with every tile and menu slot that opened it";return e<=0?`It is on no device yet. It is deleted, ${n}. ${v}`:e===1?`It is on 1 device. It is deleted, ${n}. ${v}`:t!==void 0?`It is on ${e} devices. ${Te} takes it off ${t} only, and you can tick it again. ${Ee} deletes it, ${n}. ${v}`:`It is on ${e} devices. Delete takes it off every device, ${n}. ${v} To take it off one device, untick it instead.`}var Q="wrist-assistant-panel.library.preview-kind.v1";function Re(){try{return globalThis.sessionStorage?.getItem(Q)==="iphone"?"iphone":"watch"}catch{return"watch"}}function Le(e){try{globalThis.sessionStorage?.setItem(Q,e)}catch{}}function xt(e,t,n=[]){let o=i=>y(e,i.owner_watch_id)===(t==="iphone");for(let i of n){if(i===void 0)continue;let r=e.find(l=>l.owner_watch_id.toUpperCase()===i.toUpperCase());if(r!==void 0&&o(r))return r.owner_watch_id}return e.find(o)?.owner_watch_id}function vt(e,t){if(e!==void 0)return(t.kind==="menus"?L(e,t.id)?.owners:R(e,t.kind,t.id)?.owners)??[]}function yt(e,t,n){let o=l=>{let d=e.find(p=>p.owner_watch_id.toUpperCase()===l.toUpperCase());return d===void 0?void 0:y(e,d.owner_watch_id)?"iphone":"watch"},i=t.from===void 0?void 0:o(t.from);if(i!==void 0)return i;let r=new Set((n??[]).map(o).filter(l=>l!==void 0));return r.size===1?[...r][0]:Re()}function Se(e){return e==="watch"?h`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="6.5" y="1" width="7" height="3" rx="1"/><rect x="6.5" y="16" width="7" height="3" rx="1"/><rect x="4" y="3.5" width="12" height="13" rx="3.5"/></svg>`:h`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="1" width="10" height="18" rx="2.5"/><rect class="pv-notch" x="8" y="2.2" width="4" height="1.2" rx=".6"/></svg>`}function Pe(){return h`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="1" y="5.5" width="7.5" height="9" rx="2.4"/><rect x="11" y="2" width="7.5" height="16" rx="2"/></svg>`}function kt(e,t,n){let o=n?.on===!0,i=(r,l)=>{let d=e===r&&!o;return a`<button type="button" class="lib-preview-thumb ${r} ${d?"on":""}"
      aria-pressed=${d?"true":"false"} title=${l} aria-label=${l}
      @click=${()=>{d||(Le(r),t(r))}}>${Se(r)}</button>`};return a`<span class="lib-preview" role="group" aria-label="Preview on" title="What this is drawn on. Nothing is changed on any device.">
    <span class="lib-preview-l">Preview on</span>
    ${i("watch","Preview on a watch")}
    ${i("iphone","Preview on an iPhone")}
    ${n===void 0?s:a`<button type="button" class="lib-preview-thumb duo ${o?"on":""}"
      aria-pressed=${o?"true":"false"} title="Side by side: a watch and an iPhone" aria-label="Side by side: a watch and an iPhone"
      @click=${()=>{o||n.pick()}}>${Pe()}</button>`}
  </span>`}function $t(e,t,n){return!n||new Set(e.map(r=>y(e,r.owner_watch_id))).size<2?!1:new Set((t??[]).flatMap(r=>{let l=e.find(d=>d.owner_watch_id.toUpperCase()===r.toUpperCase());return l===void 0?[]:[y(e,l.owner_watch_id)]})).size!==1}function Tt(e){return e==="watch"?"iphone":"watch"}function Et(e,t){let n=e==="watch"?"Watch":"iPhone";return t.length===0?`${n} \xB7 on no ${e==="watch"?"watch":"iPhone"} yet`:`${n} \xB7 ${t.join(", ")}`}function Rt(){return a`<span class="lib-mode-tag" title="One for every device that has it. A save reaches all of them.">Shared</span>`}function G(e){return e==="menus"?"Which devices should use this menu?":"Which devices do you want this on?"}function Be(e,t){return t===0?"On no device yet":`On ${t} ${t===1?"device":"devices"}`}function Lt(e,t,n,o){return a`<div class="lib-on over-stage ${t===0?"none":""}" role="group" aria-label=${G(e)}>
    <span class="lib-on-l">${G(e)}</span>${n}<span class="lib-on-n">${Be(e,t)}</span>${Ce(o)}
  </div>`}function Ce(e,t=Date.now()){return e===void 0||t-e>=C?s:a`${N(e,a`<span class="lib-saved" role="status" style=${`animation-delay:${Math.max(0,C-400-(t-e))}ms`}>Saved</span>`)}`}var St=x`
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
`;export{N as a,Ve as b,U as c,Ue as d,Fe as e,qe as f,C as g,W as h,Xe as i,Ye as j,Ge as k,Qe as l,Je as m,Ze as n,et as o,tt as p,nt as q,bt as r,ht as s,ut as t,ft as u,wt as v,gt as w,Te as x,Ee as y,mt as z,Le as A,xt as B,vt as C,yt as D,kt as E,$t as F,Tt as G,Et as H,Rt as I,G as J,Lt as K,Ce as L,St as M};
