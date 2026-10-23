import{b as o,d as i,g as n,nh as p}from"./chunk-BDP52PL7.js";var s="Hidden here",x="Not shared";function u(e){return i`<section class="hl-group" aria-label=${e.title} style=${`--h:${e.hue}`}>
    <div class="hl-head">
      <span class="hl-chip" aria-hidden="true">${p(e.icon)}</span>
      <h3 class="hl-title">${e.title}</h3>
      ${e.noCount===!0?n:i`<span class="hl-n">${e.lines.length}</span>`}
      ${e.sub===void 0?n:i`<span class="hl-sub">${e.sub}</span>`}
      ${e.change===void 0?n:i`<button type="button" class="hl-change" title=${e.change.title} @click=${e.change.onClick}>Change${p("right")}</button>`}
    </div>
    ${e.lines.length===0?i`<p class="hl-empty">${e.empty}</p>`:i`<ol class="hl-lines ${e.strip===!0?"strip":""}">${e.lines.map((l,r)=>h(l,r,e.strip===!0))}</ol>`}
  </section>`}function h(e,l,r){let t=e.action;return i`<li class="hl-line ${e.hidden===!0?"hid":""}" data-line=${e.key}>
    ${r?i`<span class="hl-i" aria-hidden="true">${l+1}</span>`:n}
    ${e.picture===void 0?n:i`<span class="hl-pic">${e.picture}</span>`}
    <span class="hl-t">
      <b class="hl-name">${e.name}</b>
      ${e.detail===void 0&&e.hidden!==!0&&e.tag===void 0?n:i`<small class="hl-detail">
        ${e.hidden===!0?i`<em class="hl-tag">${s}</em>`:n}
        ${e.tag===void 0?n:i`<em class="hl-tag own">${e.tag}</em>`}
        ${e.detail??n}</small>`}
    </span>
    ${t===void 0?n:t.href!==void 0?i`<a class="hl-edit" href=${t.href} title=${t.title}
          @click=${a=>{a.button!==0||a.metaKey||a.ctrlKey||a.shiftKey||a.altKey||(a.preventDefault(),t.onClick())}}>${t.label}</a>`:i`<button type="button" class="hl-edit" title=${t.title} @click=${t.onClick}>${t.label}</button>`}
  </li>`}var f=o`
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
  .hl-edit:hover { background: var(--wa-hover); }
  .hl-edit:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,g=o`
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
`;export{x as a,u as b,f as c,g as d};
