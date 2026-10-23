import{b as d,d as n,g as t,nh as l}from"./chunk-PGFG6NDE.js";var c="Hidden here",f="Not shared";function w(e){return n`<section class="hl-group" aria-label=${e.title} style=${`--h:${e.hue}`}>
    <div class="hl-head">
      <span class="hl-chip" aria-hidden="true">${l(e.icon)}</span>
      <h3 class="hl-title">${e.title}</h3>
      ${e.noCount===!0?t:n`<span class="hl-n">${e.lines.length}</span>`}
      ${e.sub===void 0?t:n`<span class="hl-sub">${e.sub}</span>`}
      ${e.change===void 0?t:n`<button type="button" class="hl-change" title=${e.change.title} @click=${e.change.onClick}>Change${l("right")}</button>`}
    </div>
    ${e.under??t}
    ${e.lines.length===0?n`<p class="hl-empty">${e.empty}</p>`:n`<ol class="hl-lines ${e.strip===!0?"strip":""}">${e.lines.map((p,s)=>x(p,s,e.strip===!0))}</ol>`}
  </section>`}function x(e,p,s){let a=e.action,r=e.drag,o=e.remove,h=["hl-line",e.hidden===!0?"hid":"",r?.on===!0?"drags":"",r?.dragging===!0?"dragging":"",r?.over===!0?r.after?"drop-after":"drop-before":""].filter(i=>i!=="").join(" ");return n`<li class=${h} data-line=${e.key} draggable=${r?.on===!0?"true":"false"}
    @dragstart=${i=>r?.onStart(i)} @dragover=${i=>r?.onOver(i)}
    @drop=${i=>r?.onDrop(i)} @dragend=${()=>r?.onEnd()}>
    ${s?n`<span class="hl-i" aria-hidden="true">${p+1}</span>`:t}
    ${r===void 0?t:n`<span class="hl-grip" tabindex=${r.on?"0":"-1"} role="button"
      aria-label=${`Move ${e.name}. Alt and the arrow keys move it.`} title=${r.on?"Drag to change the order":""}
      @keydown=${i=>r.onKey(i)}>${l("grip")}</span>`}
    ${o===void 0?t:n`<button type="button" class="hl-rm" title=${o.title} aria-label=${o.title} ?disabled=${o.busy===!0}
      @click=${i=>{i.stopPropagation(),o.onClick()}}>${l("close")}</button>`}
    ${e.picture===void 0?t:n`<span class="hl-pic">${e.picture}</span>`}
    <span class="hl-t">
      <b class="hl-name">${e.name}</b>
      ${e.detail===void 0&&e.hidden!==!0&&e.tag===void 0?t:n`<small class="hl-detail">
        ${e.hidden===!0?n`<em class="hl-tag">${c}</em>`:t}
        ${e.tag===void 0?t:n`<em class="hl-tag own">${e.tag}</em>`}
        ${e.detail??t}</small>`}
    </span>
    ${a===void 0?t:a.href!==void 0?n`<a class="hl-edit" href=${a.href} title=${a.title}
          @click=${i=>{i.button!==0||i.metaKey||i.ctrlKey||i.shiftKey||i.altKey||(i.preventDefault(),a.onClick())}}>${a.label}</a>`:n`<button type="button" class="hl-edit" title=${a.title} @click=${a.onClick}>${a.label}</button>`}
  </li>`}var m=d`
  .hl-groups { display: flex; flex-direction: column; gap: 18px; }
  .hl-group { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .hl-head { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .hl-chip {
    display: inline-flex; align-items: center; justify-content: center; flex: none; width: 24px; height: 24px; border-radius: 7px;
    border: 1px solid var(--h, var(--wa-line)); color: var(--wa-ink); background: var(--wa-card);
  }
  .hl-chip svg { width: 14px; height: 14px; }
  .hl-title { margin: 0; font-size: 14px; font-weight: 600; color: var(--wa-ink); }
  .hl-n { font-size: 12.5px; font-weight: 600; color: var(--wa-muted); }
  .hl-sub { font-size: 12px; color: var(--wa-muted); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hl-change {
    display: inline-flex; align-items: center; gap: 2px; margin-left: auto; flex: none; height: 26px; padding: 0 6px 0 10px;
    border-radius: 7px; border: 1px solid var(--wa-line); background: none; color: var(--wa-ink); font: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
  }
  .hl-change svg { width: 12px; height: 12px; }
  .hl-change:hover { background: var(--wa-hover); }
  .hl-change:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hl-empty { margin: 0; padding: 10px 12px; border-radius: 10px; border: 1px dashed var(--wa-line); font-size: 12.5px; color: var(--wa-muted); }
  .hl-lines { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 6px; }
  .hl-lines.strip { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
  .hl-line {
    display: flex; align-items: center; gap: 10px; min-width: 0; padding: 7px 8px 7px 10px; border-radius: 10px;
    border: 1px solid var(--wa-line); background: var(--wa-card);
  }
  .hl-lines.strip .hl-line { flex-direction: column; align-items: stretch; gap: 6px; padding: 8px; position: relative; }
  .hl-lines.strip .hl-pic { align-self: center; }
  .hl-line.hid .hl-pic, .hl-line.hid .hl-name { opacity: 0.5; }
  .hl-i { position: absolute; top: 6px; left: 8px; font-size: 11px; font-weight: 600; color: var(--wa-muted); }
  .hl-pic { display: inline-flex; flex: none; align-items: center; justify-content: center; }
  .hl-t { display: flex; flex-direction: column; gap: 1px; flex: 1 1 auto; min-width: 0; }
  .hl-name { font-size: 13px; font-weight: 600; color: var(--wa-ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hl-detail { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; font-size: 11.5px; color: var(--wa-muted); }
  .hl-tag { font-style: normal; font-size: 10.5px; font-weight: 600; padding: 0 5px; border-radius: 5px; border: 1px solid var(--wa-line); color: var(--wa-muted); }
  .hl-edit {
    flex: none; display: inline-flex; align-items: center; justify-content: center; height: 26px; padding: 0 10px; border-radius: 7px;
    border: 1px solid var(--wa-line); background: none; color: var(--wa-ink); font: inherit; font-size: 12px; font-weight: 600;
    text-decoration: none; cursor: pointer;
  }
  .hl-lines.strip .hl-edit { align-self: stretch; }
  /* Order and take off. The grip always shows; the remove button shows
     while the pointer or the focus is on the line, and always on a screen
     with no hover. The drop lands on the side the line is drawn on. */
  .hl-line { position: relative; }
  .hl-line.drags { cursor: grab; }
  .hl-line.dragging { opacity: .45; }
  .hl-line.drop-before { box-shadow: -3px 0 0 var(--wa-accent); }
  .hl-line.drop-after { box-shadow: 3px 0 0 var(--wa-accent); }
  .hl-lines:not(.strip) .hl-line.drop-before { box-shadow: 0 -3px 0 var(--wa-accent); }
  .hl-lines:not(.strip) .hl-line.drop-after { box-shadow: 0 3px 0 var(--wa-accent); }
  .hl-grip {
    display: inline-flex; align-items: center; justify-content: center; flex: none; width: 18px; height: 22px; border-radius: 5px;
    color: var(--wa-muted); cursor: grab;
  }
  .hl-grip svg { width: 14px; height: 14px; }
  .hl-grip:hover { color: var(--wa-ink); background: var(--wa-hover); }
  .hl-grip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* Under the number, in the card's left margin, clear of the picture. */
  .hl-lines.strip .hl-grip { position: absolute; top: 24px; left: 3px; z-index: 1; }
  .hl-rm {
    display: inline-flex; align-items: center; justify-content: center; flex: none; width: 24px; height: 24px; padding: 0;
    border-radius: 6px; border: 1px solid var(--wa-line); background: var(--wa-card); color: var(--wa-muted); cursor: pointer;
    opacity: 0; transition: opacity .12s ease;
  }
  .hl-rm svg { width: 13px; height: 13px; }
  .hl-line:hover .hl-rm, .hl-line:focus-within .hl-rm { opacity: 1; }
  .hl-rm:hover:not(:disabled) { color: var(--wa-need); border-color: color-mix(in srgb, var(--wa-need) 50%, var(--wa-line)); }
  .hl-rm:focus-visible { outline: none; box-shadow: var(--wa-ring); opacity: 1; }
  .hl-rm:disabled { cursor: progress; opacity: .5; }
  @media (hover: none) { .hl-rm { opacity: 1; } }
  .hl-lines.strip .hl-rm { position: absolute; top: 4px; right: 4px; z-index: 1; }
  .hl-lines:not(.strip) .hl-rm { order: 9; }
  .hl-note { margin: 0; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--wa-line); font-size: 12.5px; color: var(--wa-muted);
    display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; }
  .hl-note.warn { color: var(--wa-amber); border-color: var(--wa-amber-line, var(--wa-line)); }
  .hl-note.err { color: var(--wa-need); border-color: color-mix(in srgb, var(--wa-need) 40%, var(--wa-line)); }
  .hl-note button { padding: 0; border: 0; background: none; font: inherit; font-weight: 600; color: var(--wa-ink); cursor: pointer;
    text-decoration: underline; text-underline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .hl-rm { transition: none; } }
  .hl-edit:hover { background: var(--wa-hover); }
  .hl-edit:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,v=d`
  .ha { display: flex; flex-direction: column; gap: 22px; min-width: 0; }
  .ha-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px; }
  .ha-head-t { flex: 1 1 320px; min-width: 0; }
  .ha-head-t h2 { margin: 0; font-size: 20px; font-weight: 600; color: var(--wa-ink); }
  .ha-head-t p { margin: 4px 0 0; font-size: 13px; color: var(--wa-muted); }
  .ha-search { flex: 0 1 320px; }
  .ha-part { display: flex; flex-direction: column; gap: 8px; min-width: 0; position: relative; }
  .ha-part-head { display: flex; align-items: center; gap: 8px; }
  .ha-part-head h3 { margin: 0; font-size: 14px; font-weight: 600; color: var(--wa-ink); }
  .ha-col { display: inline-flex; align-items: center; gap: 6px; padding: 8px 6px; font-weight: 600; color: var(--wa-ink); }
  .ha-ic {
    display: inline-flex; align-items: center; justify-content: center; flex: none; width: 28px; height: 28px; border-radius: 8px;
    border: 1px solid var(--h, var(--wa-line)); color: var(--wa-ink);
  }
  .ha-ic svg { width: 15px; height: 15px; }
  .ha-still { cursor: default; }
  .ha-lock { display: inline-flex; color: var(--wa-muted); }
  .ha-lock svg { width: 14px; height: 14px; }
  .hb-lineup { margin-top: 4px; }
`;export{f as a,w as b,m as c,v as d};
