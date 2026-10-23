import{Ka as T,d as g,e as S,i as u,ta as x,ua as f}from"./chunk-KEUUWEUW.js";import{h}from"./chunk-CZFNDMQT.js";import{b as $,c as R,e as L}from"./chunk-XDWWPROF.js";import{a as k,b as p,d as o,e as w,g as d,nh as b}from"./chunk-GAVJLCVX.js";var _=$(class extends R{constructor(){super(...arguments),this.key=d}render(e,n){return this.key=e,n}update(e,[n,t]){return n!==this.key&&(L(e),this.key=n),t}});var z="(max-width: 640px)",v=new Set;function be(e,n,t=I()){return n==="board"&&t&&!v.has(e)?"cards":n}function ue(e,n){n==="board"?v.add(e):v.delete(e)}function I(){try{return window.matchMedia(z).matches}catch{return!1}}var he={settings:"Settings",rooms:"Rooms",voice:"Voice"},m=1800,B=1500,O=2.2,A=1900,K=3.2,V=900,M=1.5,j=560,H=.8,D=class{constructor(n){this.host=n;this.wide=!1;this.scale=1;n.addController(this)}hostConnected(){typeof ResizeObserver>"u"||(this.seen=new ResizeObserver(n=>{let t=n[0]?.contentRect.width??0,i=t>=B,r=t>=A?K:i?O:t>=V?M:t>0&&t<j?H:1;i===this.wide&&r===this.scale||(this.wide=i,this.scale=r,this.host.requestUpdate())}),this.seen.observe(this.host))}hostDisconnected(){this.seen?.disconnect(),this.seen=void 0}size(n){return Math.round(n*this.scale)}};function we(e,n,t){let i=(r,a,s)=>o`<button type="button" class="bd-view-opt ${e===r?"on":""}"
    aria-pressed=${e===r?"true":"false"} title=${s} @click=${()=>{e!==r&&n(r)}}>${b(r==="board"?"checklist":"grid")}<span>${a}</span></button>`;return o`<span class="bd-view" role="group" aria-label=${`How to show the ${t}`}>
    ${i("board","Board",`Every ${t.replace(/s$/,"")} as a row, every device as a column`)}${i("cards","Cards",`Every ${t.replace(/s$/,"")} as a card with its picture`)}
  </span>`}var E=(e,n)=>e!==void 0&&n!==void 0&&e.toUpperCase()===n.toUpperCase();function ge(e){let n=e.columns.length+1,t=e.columns.findIndex(i=>E(i.device.ownerId,e.focus));return o`<div class="bd-scroll">
    <table class="bd ${t>=0?"focused":""} ${e.wide===!0?"wide":""}" aria-label=${e.label} style=${`--bd-n:${e.columns.length}`}>
      <thead><tr>
        <th scope="col" class="bd-thing">${e.thing}</th>
        ${e.columns.map(i=>W(i,E(i.device.ownerId,e.focus),e))}
      </tr></thead>
      ${e.sections.map(i=>o`<tbody class="bd-sect-body" data-section=${i.key}>
        ${i.title===void 0?d:o`<tr class="bd-sect"><th colspan=${n} scope="colgroup">
          <span class="bd-sect-t">${i.title}${i.count===void 0?d:o` <small>${i.count}</small>`}</span>
          ${i.hint===void 0?d:o`<span class="bd-sect-r">${i.hint}</span>`}
        </th></tr>`}
        ${i.rows.length===0&&i.empty!==void 0?o`<tr class="bd-none"><td colspan=${n}>${i.empty}</td></tr>`:i.rows.map((r,a)=>o`${r.group!==void 0&&r.group!==i.rows[a-1]?.group?U(r.group,i.rows.slice(a).findIndex(s=>s.group!==r.group),i.rows.length-a,n):d}${N(r,e.columns,t,n)}`)}
      </tbody>`)}
    </table>
  </div>`}function U(e,n,t,i){return o`<tr class="bd-group"><th colspan=${i} scope="rowgroup">
    <span class="bd-group-t">${e} <small>${n<0?t:n}</small></span>
  </th></tr>`}function W(e,n,t){let i=e.device;return o`<th scope="col" class="bd-col ${n?"on":""}" style=${e.color===void 0?d:`--dc:${e.color}`}>
    <button type="button" class="bd-col-btn" aria-pressed=${n?"true":"false"}
      title=${n?"Back to every device":t.focusTitle(i)}
      @click=${()=>t.onFocus(n?void 0:i.ownerId)}>
      <span class="bd-col-top">
        <span class="bd-col-glyph" aria-hidden="true">${b(i.kind==="iphone"?"phone":"watch")}</span>
        <span class="bd-col-name">${i.name}</span>
      </span>
      <span class="bd-col-sub"><span class="bd-col-n">${e.count}</span>
        <span class="bd-col-go">${n?"All":t.focusWord}<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 4l2.5 2.5L7.5 4"/></svg></span></span>
    </button>
  </th>`}function N(e,n,t,i){let r=e.drag,a=`bd-row ${e.dim?"dim":""} ${e.select?.picked?"picked":""} ${r?.dragging?"dragging":""} ${r?.over?"drag-over":""} ${r?.below?"below":""}`,s=o`<tr class=${a} data-row=${e.key} draggable=${r?.on?"true":"false"}
    @dragstart=${l=>r?.onStart(l)}
    @dragover=${l=>r?.onOver(l)}
    @drop=${l=>r?.onDrop(l)}
    @dragend=${()=>r?.onEnd()}
    @keydown=${l=>r?.onKey(l)}>
    <th scope="row" class="bd-thing">
      <span class="bd-thing-in">
        ${r===void 0?d:o`<span class="bd-grip" aria-hidden="true" title=${r.on?"Drag to order":""}>${b("grip")}</span>`}
        ${e.select===void 0?d:o`<input type="checkbox" class="pk-card-pick" .checked=${e.select.picked}
          ?disabled=${e.select.disabled} aria-label=${e.select.label}
          @click=${l=>{l.stopPropagation(),e.select.onPick(l)}} />`}
        <button type="button" class="bd-open" title=${e.openTitle} @click=${l=>e.onOpen(l)}>
          ${e.picture??d}
          <span class="bd-nm"><span class="bd-n">${e.name}</span><span class="bd-m">${e.detail}</span></span>
        </button>
        ${e.actions??d}
      </span>
    </th>
    ${n.map((l,y)=>q(e.cells[y],l,y===t))}
  </tr>`;return e.ask!==void 0||e.note!==void 0||e.under!==void 0?o`${s}<tr class="bd-under ${e.dim?"dim":""}"><td colspan=${i}>
    ${e.ask===void 0?d:T(e.ask)}
    ${e.note===void 0?d:e.note.kind==="ok"?o`<p class="lt-note ok" role="status">${e.note.text}</p>`:o`<p class="lt-note" role="alert">${e.note.text}</p>`}
    ${e.under??d}
  </td></tr>`:s}function q(e,n,t){let i=n.color===void 0?d:`--dc:${n.color}`,r=e?.chip;if(r===void 0)return o`<td class="bd-cell ${t?"on":""}" style=${i}>
      <span class="bd-dash" role="img" aria-label=${e?.dashTitle??`Does not fit ${n.device.name}`} title=${e?.dashTitle??`Does not fit ${n.device.name}`}></span>
    </td>`;let a=r.shape==="round";return o`<td class="bd-cell ${t?"on":""}" style=${i}>
    <span class="bd-cell-in">
      <button type="button" class="bd-box ${r.on?"ticked":""} ${a?"rd":""} ${r.busy?"busy":""} ${r.stuck===void 0?"":"stuck"} ${r.hidden?"dim":""}"
        title=${r.title} aria-label=${`${r.name}: ${r.title}`}
        aria-pressed=${r.on?"true":"false"} aria-disabled=${r.next===void 0?"true":"false"}
        @click=${s=>{s.stopPropagation(),r.next!==void 0&&e?.onPick?.(r.next)}}><span class="bd-mark" aria-hidden="true"></span></button>
      ${e?.eye===void 0?d:o`<button type="button" class="bd-eye ${e.eye.hidden?"hid":""}" ?disabled=${e.eye.busy}
        title=${e.eye.title} aria-label=${e.eye.title} aria-pressed=${e.eye.hidden?"true":"false"}
        @click=${s=>{s.stopPropagation(),e.eye.onToggle()}}>${b(e.eye.hidden?"hide":"show")}</button>`}
    </span>
    ${r.hidden&&e?.note===void 0?o`<em class="bd-note">hidden</em>`:d}
    ${e?.note===void 0?d:o`<em class="bd-note ${e.noteWarn?"warn":""}" title=${e.noteTitle??d}>${e.note}</em>`}
  </td>`}var xe=p`
  .bd-scroll { overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch; }
  /* The device columns keep one narrow width (--bd-col-w) and the first
     column takes the rest, so a wide screen gives its room to the things'
     pictures, not to gaps between ticks (Jesse, 2026-10-23). */
  table.bd { --bd-col-w: 104px; --bd-ground: var(--wa-bg); border-collapse: separate; border-spacing: 0; width: 100%; min-width: max-content; font-size: 12.5px; }
  .bd th, .bd td { padding: 0; text-align: left; font-weight: inherit; }
  .bd thead th { position: sticky; top: 0; z-index: 2; background: var(--wa-card); border-bottom: 1px solid var(--wa-line); vertical-align: bottom; }
  /* The rows stand on the page's own ground, the first column too, so the
     board reads as one surface under a raised head. */
  .bd .bd-thing { position: sticky; left: 0; z-index: 1; background: var(--bd-ground); min-width: 220px; }
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
  .bd-col-sub { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: var(--wa-muted); white-space: nowrap; }
  .bd-col-n { font-variant-numeric: tabular-nums; }
  .bd-col-go { display: inline-flex; align-items: center; gap: 2px; padding: 1px 6px; border-radius: 999px; border: 1px solid var(--wa-line); }
  .bd-col-btn:hover .bd-col-go, .bd-col.on .bd-col-go { color: var(--wa-ink); border-color: var(--wa-line-strong); }
  .bd-col-go svg { width: 9px; height: 9px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }

  .bd-sect th { padding: 14px 10px 6px; border-bottom: 1px solid var(--wa-line); background: var(--bd-ground); }
  .bd-sect th > * { position: sticky; left: 10px; }
  .bd-sect-t { font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
  .bd-sect-t small { margin-left: 4px; font-size: 12px; font-weight: 500; color: var(--wa-muted); }
  .bd-sect-r { margin-left: 12px; font-size: 11.5px; color: var(--wa-muted); font-weight: 400; }
  .bd-none td { padding: 10px; font-size: 12.5px; color: var(--wa-muted); }
  /* A run of rows of one kind inside a section (a shape): a band in small
     capitals with room above it, so one kind ends before the next begins. */
  /* A phone shows a board only when it is focused on one device (else it
     shows Cards, \`phoneView\`): then only that device's column, so the board
     never scrolls sideways. */
  @media ${k(z)} {
    table.bd.focused .bd-col:not(.on), table.bd.focused td.bd-cell:not(.on) { display: none; }
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
    .bd-n, .bd.wide .bd-n { font-size: 13px; white-space: normal; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow-wrap: break-word; }
    .bd-col-name, .bd.wide .bd-col-name { font-size: 11.5px; }
    .bd-col-glyph { display: none; }
    .bd-col-sub { gap: 4px; font-size: 10.5px; }
    .bd-col-go { padding: 1px 4px; }
  }
`,fe=p`
  :host([embedded]) { display: block; }
  :host([embedded]) table.bd, .bd-fixed table.bd {
    --bd-col-w: var(--bd-stack-col-w, 112px);
    table-layout: fixed; min-width: calc(var(--bd-thing-min, 300px) + var(--bd-n, 0) * var(--bd-col-w));
  }
  @media (max-width: 640px) {
    :host([embedded]) table.bd, .bd-fixed table.bd { --bd-col-w: 78px; --bd-thing-min: 150px; }
  }
`;function Te(e){return`library:${e.kind}:${e.id}`}function _e(e,n){return e===void 0||n===void 0?e===n:e.kind===n.kind&&e.id.toUpperCase()===n.id.toUpperCase()}function F(e,n){return{kind:e,revision:n.revision,document:n.document,hash:null,updated_at:null,updated_by:null,delivered_revision:0,delivered_at:null}}async function De(e,n){let t=await g(e,n.kind,n.id);return{...F(n.kind,t),...typeof t.name=="string"?{name:t.name}:{}}}function Ee(e,n,t){return{save:(i,r)=>n!==void 0?n.saveItem(t.kind,t.id,i,r):S(e,t.kind,t.id,i,r),fetch:async()=>{let i=await g(e,t.kind,t.id);return{revision:i.revision,document:i.document}}}}function ze(e,n){if(e!==void 0)return n.kind==="menus"?f(e,n.id)?.revision:x(e,n.kind,n.id)?.revision}function Pe(e){return`Delete "${e}"?`}var X="This device",Y="Every device";function Ce(e,n){let t="with every tile and menu slot that opened it";return e<=0?`It is on no device yet. It is deleted, ${t}. ${u}`:e===1?`It is on 1 device. It is deleted, ${t}. ${u}`:n!==void 0?`It is on ${e} devices. ${X} takes it off ${n} only, and you can tick it again. ${Y} deletes it, ${t}. ${u}`:`It is on ${e} devices. Delete takes it off every device, ${t}. ${u} To take it off one device, untick it instead.`}var C="wrist-assistant-panel.library.preview-kind.v1";function G(){try{return globalThis.sessionStorage?.getItem(C)==="iphone"?"iphone":"watch"}catch{return"watch"}}function Q(e){try{globalThis.sessionStorage?.setItem(C,e)}catch{}}function Ie(e,n,t=[]){let i=r=>h(e,r.owner_watch_id)===(n==="iphone");for(let r of t){if(r===void 0)continue;let a=e.find(s=>s.owner_watch_id.toUpperCase()===r.toUpperCase());if(a!==void 0&&i(a))return a.owner_watch_id}return e.find(i)?.owner_watch_id}function Be(e,n){if(e!==void 0)return(n.kind==="menus"?f(e,n.id)?.owners:x(e,n.kind,n.id)?.owners)??[]}function Oe(e,n,t){let i=s=>{let c=e.find(l=>l.owner_watch_id.toUpperCase()===s.toUpperCase());return c===void 0?void 0:h(e,c.owner_watch_id)?"iphone":"watch"},r=n.from===void 0?void 0:i(n.from);if(r!==void 0)return r;let a=new Set((t??[]).map(i).filter(s=>s!==void 0));return a.size===1?[...a][0]:G()}function J(e){return e==="watch"?w`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="6.5" y="1" width="7" height="3" rx="1"/><rect x="6.5" y="16" width="7" height="3" rx="1"/><rect x="4" y="3.5" width="12" height="13" rx="3.5"/></svg>`:w`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="1" width="10" height="18" rx="2.5"/><rect class="pv-notch" x="8" y="2.2" width="4" height="1.2" rx=".6"/></svg>`}function Z(){return w`<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="1" y="5.5" width="7.5" height="9" rx="2.4"/><rect x="11" y="2" width="7.5" height="16" rx="2"/></svg>`}function Ae(e,n,t){let i=t?.on===!0,r=(a,s)=>{let c=e===a&&!i;return o`<button type="button" class="lib-preview-thumb ${a} ${c?"on":""}"
      aria-pressed=${c?"true":"false"} title=${s} aria-label=${s}
      @click=${()=>{c||(Q(a),n(a))}}>${J(a)}</button>`};return o`<span class="lib-preview" role="group" aria-label="Preview on" title="What this is drawn on. Nothing is changed on any device.">
    <span class="lib-preview-l">Preview on</span>
    ${r("watch","Preview on a watch")}
    ${r("iphone","Preview on an iPhone")}
    ${t===void 0?d:o`<button type="button" class="lib-preview-thumb duo ${i?"on":""}"
      aria-pressed=${i?"true":"false"} title="Side by side: a watch and an iPhone" aria-label="Side by side: a watch and an iPhone"
      @click=${()=>{i||t.pick()}}>${Z()}</button>`}
  </span>`}function Ke(e,n,t){return!t||new Set(e.map(a=>h(e,a.owner_watch_id))).size<2?!1:new Set((n??[]).flatMap(a=>{let s=e.find(c=>c.owner_watch_id.toUpperCase()===a.toUpperCase());return s===void 0?[]:[h(e,s.owner_watch_id)]})).size!==1}function Ve(e){return e==="watch"?"iphone":"watch"}function Me(e,n){let t=e==="watch"?"Watch":"iPhone";return n.length===0?`${t} \xB7 on no ${e==="watch"?"watch":"iPhone"} yet`:`${t} \xB7 ${n.join(", ")}`}function je(){return o`<span class="lib-mode-tag" title="One for every device that has it. A save reaches all of them.">Shared</span>`}function P(e){return e==="menus"?"Which devices should use this menu?":"Which devices do you want this on?"}function ee(e,n){return n===0?"On no device yet":`On ${n} ${n===1?"device":"devices"}`}function He(e,n,t,i){return o`<div class="lib-on over-stage ${n===0?"none":""}" role="group" aria-label=${P(e)}>
    <span class="lib-on-l">${P(e)}</span>${t}<span class="lib-on-n">${ee(e,n)}</span>${ne(i)}
  </div>`}function ne(e,n=Date.now()){return e===void 0||n-e>=m?d:o`${_(e,o`<span class="lib-saved" role="status" style=${`animation-delay:${Math.max(0,m-400-(n-e))}ms`}>Saved</span>`)}`}var Ue=p`
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
`;export{_ as a,be as b,ue as c,he as d,m as e,D as f,we as g,ge as h,xe as i,fe as j,Te as k,_e as l,De as m,Ee as n,ze as o,Pe as p,X as q,Y as r,Ce as s,Q as t,Ie as u,Be as v,Oe as w,Ae as x,Ke as y,Ve as z,Me as A,je as B,He as C,Ue as D};
