import{Aa as f,ha as g}from"./chunk-32BWDOCI.js";import{z as v}from"./chunk-N6KTKCSE.js";import{b as c,d as t,e as w,g as r,nh as x}from"./chunk-BDP52PL7.js";var $="dialog.lib-new";function u(e){return e==="menus"?"New menu":e==="status_pages"?"New status page":"New page"}function k(e){return e==="menus"?"menu":e==="status_pages"?"status page":"page"}function z(e,a){return e==="menus"?"Name it, pick its kind.":a.length>1?"Name it, pick where to preview it.":"Name it."}function T(e,a){let i=a.name.trim();if(i==="")return"Type a name to start.";if(e==="menus"){let o=a.unit??"anywhere";return`${i}, an ${g[o]} no device uses yet. Tick a device any time.`}return`${i}, a ${k(e)} no device has yet. Tick a device any time.`}function C(e){return e==="entity"?"Opens on an entity. Its actions in a ring.":"Opens on any screen. Your shortcuts for the whole watch."}function E(e){return e==="iphone"?"Drawn on an iPhone's screen first.":"Drawn on a watch face first."}function N(e){let a=e==="entity"?6:8,i=Array.from({length:a},(o,n)=>{let l=n/a*Math.PI*2-Math.PI/2;return w`<circle cx=${(16+Math.cos(l)*10).toFixed(2)} cy=${(16+Math.sin(l)*10).toFixed(2)} r="2.4" />`});return t`<svg class="lib-new-art" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <circle cx="16" cy="16" r="14.5" fill="none" stroke="var(--wa-shape-outline, currentColor)" stroke-width="1" opacity=".45" />
    ${i}${e==="entity"?w`<circle cx="16" cy="16" r="3" />`:r}
  </svg>`}function D(e){return e?t`<span class="pick-tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg></span>`:t`<span class="pick-tick off" aria-hidden="true"></span>`}function m(e,a,i,o,n,l){return t`<button type="button" class="shape-card lib-new-card ${e?"on":""}" role="radio" aria-checked=${e?"true":"false"}
    title=${i} ?disabled=${l} @click=${n}>
    <span class="shape-arts">${o}</span>
    <span class="shape-card-name">${a}</span>
    <span class="shape-card-note">${i}</span>
    ${D(e)}
  </button>`}function h(e,a,i){return t`<div class="new-step-head">
    <span class="new-step-num" aria-hidden="true">${e}</span>
    <span class="new-step-title">${a}</span>
    <span class="new-step-hint">${i}</span>
  </div>`}function A(e,a,i,o){let n=a.name.trim()!=="",l=k(e),p=n?"":"waiting",b=e==="menus",s=b||i.length>1;return t`<dialog class="new-dialog lib-new" aria-label=${u(e)} @close=${()=>o.onClose()}
    @cancel=${d=>{d.preventDefault(),a.busy||o.onClose()}}>
    <form class="lib-new-form" @submit=${d=>{d.preventDefault(),n&&!a.busy&&o.onMake()}}>
      <div class="new-head">
        <h2>${u(e)}</h2>
        <span class="new-head-note">${z(e,i)}</span>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Cancel" aria-label="Cancel" ?disabled=${a.busy} @click=${()=>o.onClose()}>${x("close")}</button>
      </div>
      <div class="new-body">
        <section class="new-step step-name">
          ${h(1,"Name it",b?"The name the Menus tab and the editor show.":`The name the ${l}'s card and the ${e==="status_pages"?"watch":"device"} show.`)}
          <input type="text" class="new-name" .value=${v(a.name)} maxlength="80" autofocus aria-label=${`${u(e)} name`}
            ?disabled=${a.busy} @input=${d=>o.onName(d.target.value)} />
        </section>
        ${s?b?t`<section class="new-step step-shapes ${p}" aria-disabled=${n?"false":"true"}>
          ${h(2,"Which kind",n?"A device uses one of each. It starts as the app's own menu of that kind.":"Waits for a name.")}
          <div class="shape-cards" role="radiogroup" aria-label="Kind of menu">
            ${["anywhere","entity"].map(d=>m((a.unit??"anywhere")===d,g[d],C(d),N(d),()=>o.onUnit?.(d),a.busy))}
          </div>
        </section>`:t`<section class="new-step step-shapes ${p}" aria-disabled=${n?"false":"true"}>
          ${h(2,"Preview on",n?"Only the picture the editor opens with. Nothing is put on a device; the ticks do that.":"Waits for a name.")}
          <div class="shape-cards" role="radiogroup" aria-label="Preview on">
            ${i.map(d=>m((a.preview??i[0])===d,d==="iphone"?"iPhone":"Watch",E(d),t`<span class="lib-new-art lib-new-device">${x(d==="iphone"?"phone":"watch")}</span>`,()=>o.onPreview?.(d),a.busy))}
          </div>
        </section>`:r}
        ${a.note===void 0?r:t`<p class="lt-line ${a.note.kind}" role="status">${a.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${T(e,a)}</span>
        <button type="button" class="lib-new-btn" ?disabled=${a.busy} @click=${()=>o.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary" ?disabled=${!n||a.busy} title=${n?`Make the ${l}`:"Type a name to start."}>${a.busy?"Making\u2026":"Create"}</button>
      </div>
    </form>
  </dialog>`}function j(e){let a=e?.querySelector?.($);a&&(!a.open&&typeof a.showModal=="function"&&a.showModal(),a.querySelector("input.new-name")?.select())}var K=c`
  dialog.lib-new {
    width: min(560px, calc(100vw - 32px)); padding: 0;
    border: 1px solid var(--wa-line); border-radius: 12px;
    background: var(--wa-card); color: var(--wa-ink);
    box-shadow: 0 12px 40px rgba(0,0,0,.4);
  }
  dialog.lib-new::backdrop { background: rgba(0,0,0,.45); }
  dialog.lib-new[open] { display: flex; flex-direction: column; max-height: calc(100dvh - 32px); }
  .lib-new-form { display: flex; flex-direction: column; min-height: 0; }
  .lib-new .new-head { display: flex; align-items: center; gap: 8px; padding: 12px 12px 12px 18px; border-bottom: 1px solid var(--wa-line); flex: none; }
  .lib-new .new-head h2 { margin: 0; font-size: 15px; font-weight: 500; }
  .lib-new .new-head .spacer { flex: 1; }
  .lib-new .new-head-note { font-size: 11.5px; color: var(--wa-muted); }
  .lib-new-x {
    display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px;
    border: 1px solid transparent; background: transparent; color: var(--wa-muted); cursor: pointer;
  }
  .lib-new-x:hover:not(:disabled) { background: var(--wa-hover); color: var(--wa-ink); }
  .lib-new-x:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lib-new-x svg { width: 14px; height: 14px; }
  .lib-new .new-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 10px; flex: 1 1 auto; min-height: 0; overflow-y: auto; }
  .lib-new .new-step {
    display: flex; flex-direction: column; gap: 9px; padding: 12px 14px;
    border-radius: var(--wa-r-md, 10px); border: 1px solid var(--wa-line);
    transition: opacity .14s ease-out;
  }
  .lib-new .new-step.step-name {
    background: color-mix(in srgb, var(--wa-accent) 12%, var(--wa-card));
    border-color: color-mix(in srgb, var(--wa-accent) 32%, var(--wa-line));
  }
  .lib-new .new-step.step-shapes {
    background: color-mix(in srgb, var(--success-color, #3dd68c) 12%, var(--wa-card));
    border-color: color-mix(in srgb, var(--success-color, #3dd68c) 32%, var(--wa-line));
  }
  .lib-new .new-step.waiting { opacity: .45; pointer-events: none; }
  .lib-new .new-step-head { display: flex; align-items: baseline; gap: 9px; flex-wrap: wrap; }
  .lib-new .new-step-num {
    flex: none; width: 21px; height: 21px; align-self: center; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 11.5px; font-weight: 700; color: var(--wa-accent-ink); background: var(--wa-accent);
  }
  .lib-new .step-shapes .new-step-num { background: var(--success-color, #3dd68c); }
  .lib-new .new-step-title { font-size: 13px; font-weight: 700; color: var(--wa-ink); }
  .lib-new .new-step-hint { font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); }
  .lib-new input.new-name {
    width: 100%; box-sizing: border-box; height: 32px; padding: 0 10px; border-radius: 7px; border: 1px solid var(--wa-line-strong);
    font: inherit; font-size: 14px; color: var(--wa-ink); background: var(--wa-input, var(--wa-field));
  }
  .lib-new input.new-name:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .lib-new .shape-cards { display: flex; flex-wrap: wrap; gap: 8px; }
  .lib-new .shape-card {
    position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;
    width: 150px; box-sizing: border-box; text-align: center;
    font: inherit; font-size: 11.5px; padding: 22px 8px 8px; color: var(--wa-muted);
    border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-raised, var(--wa-card));
    transition: border-color .12s ease-out, background-color .12s ease-out, color .12s ease-out;
  }
  .lib-new .shape-card:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
  .lib-new .shape-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lib-new .shape-card.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); box-shadow: 0 0 0 2px var(--wa-sel-ring); color: var(--wa-ink); }
  .lib-new .shape-card:disabled { cursor: default; }
  .lib-new .shape-arts { height: 40px; display: flex; align-items: center; justify-content: center; --wa-shape-outline: var(--wa-muted); }
  .lib-new .shape-card.on .shape-arts { color: var(--wa-accent); }
  .lib-new .lib-new-art { width: 36px; height: 36px; display: block; }
  .lib-new .lib-new-device svg { width: 30px; height: 30px; }
  .lib-new .shape-card-name { font-weight: 600; font-size: 12px; }
  .lib-new .shape-card-note { font-size: 10.5px; font-weight: 500; line-height: 1.3; opacity: .85; }
  .lib-new .pick-tick {
    position: absolute; top: 4px; right: 4px; width: 15px; height: 15px; box-sizing: border-box;
    display: flex; align-items: center; justify-content: center; border-radius: 50%;
    background: var(--wa-accent); color: var(--wa-accent-ink);
  }
  .lib-new .pick-tick svg { width: 10px; height: 10px; }
  .lib-new .pick-tick.off { background: transparent; border: 1px solid var(--wa-line-strong); }
  .lib-new .new-foot { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 12px 18px 14px; border-top: 1px solid var(--wa-line); flex: none; }
  .lib-new .new-count { flex: 1; font-size: 12.5px; color: var(--wa-muted); }
  .lib-new-btn {
    display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 10px; border-radius: 7px;
    border: 1px solid var(--wa-line-strong); background: var(--wa-panel, var(--wa-card)); color: var(--wa-ink);
    font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
  }
  .lib-new-btn:hover:not(:disabled) { background: var(--wa-hover); }
  .lib-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lib-new-btn:disabled { opacity: .45; cursor: default; }
  .lib-new-btn.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }
  @media (max-width: 640px) {
    .lib-new .new-head { flex-wrap: wrap; row-gap: 2px; padding: 10px 10px 10px 14px; }
    .lib-new .new-head-note { order: 3; flex: 1 1 100%; }
    .lib-new .new-head .spacer { display: none; }
    .lib-new .new-body { padding: 12px; }
  }
`;var H={settings:"Settings",rooms:"Rooms",voice:"Voice"},F=1800;function V(e,a,i){let o=(n,l,p)=>t`<button type="button" class="bd-view-opt ${e===n?"on":""}"
    aria-pressed=${e===n?"true":"false"} title=${p} @click=${()=>{e!==n&&a(n)}}>${x(n==="board"?"checklist":"grid")}<span>${l}</span></button>`;return t`<span class="bd-view" role="group" aria-label=${`How to show the ${i}`}>
    ${o("board","Board",`Every ${i.replace(/s$/,"")} as a row, every device as a column`)}${o("cards","Cards",`Every ${i.replace(/s$/,"")} as a card with its picture`)}
  </span>`}var y=(e,a)=>e!==void 0&&a!==void 0&&e.toUpperCase()===a.toUpperCase();function q(e){let a=e.columns.length+1,i=e.columns.findIndex(o=>y(o.device.ownerId,e.focus));return t`<div class="bd-scroll">
    <table class="bd ${i>=0?"focused":""}" aria-label=${e.label}>
      <thead><tr>
        <th scope="col" class="bd-thing">${e.thing}</th>
        ${e.columns.map(o=>I(o,y(o.device.ownerId,e.focus),e))}
      </tr></thead>
      ${e.sections.map(o=>t`<tbody class="bd-sect-body" data-section=${o.key}>
        ${o.title===void 0?r:t`<tr class="bd-sect"><th colspan=${a} scope="colgroup">
          <span class="bd-sect-t">${o.title}${o.count===void 0?r:t` <small>${o.count}</small>`}</span>
          ${o.hint===void 0?r:t`<span class="bd-sect-r">${o.hint}</span>`}
        </th></tr>`}
        ${o.rows.length===0&&o.empty!==void 0?t`<tr class="bd-none"><td colspan=${a}>${o.empty}</td></tr>`:o.rows.map(n=>M(n,e.columns,i,a))}
      </tbody>`)}
    </table>
  </div>`}function I(e,a,i){let o=e.device;return t`<th scope="col" class="bd-col ${a?"on":""}" style=${e.color===void 0?r:`--dc:${e.color}`}>
    <button type="button" class="bd-col-btn" aria-pressed=${a?"true":"false"}
      title=${a?"Back to every device":i.focusTitle(o)}
      @click=${()=>i.onFocus(a?void 0:o.ownerId)}>
      <span class="bd-col-top">
        <span class="bd-col-glyph" aria-hidden="true">${x(o.kind==="iphone"?"phone":"watch")}</span>
        <span class="bd-col-name">${o.name}</span>
      </span>
      <span class="bd-col-sub"><span class="bd-col-n">${e.count}</span>
        <span class="bd-col-go">${a?"All":i.focusWord}<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 4l2.5 2.5L7.5 4"/></svg></span></span>
    </button>
  </th>`}function M(e,a,i,o){let n=e.drag,l=`bd-row ${e.dim?"dim":""} ${e.select?.picked?"picked":""} ${n?.dragging?"dragging":""} ${n?.over?"drag-over":""} ${n?.below?"below":""}`,p=t`<tr class=${l} data-row=${e.key} draggable=${n?.on?"true":"false"}
    @dragstart=${s=>n?.onStart(s)}
    @dragover=${s=>n?.onOver(s)}
    @drop=${s=>n?.onDrop(s)}
    @dragend=${()=>n?.onEnd()}
    @keydown=${s=>n?.onKey(s)}>
    <th scope="row" class="bd-thing">
      <span class="bd-thing-in">
        ${n===void 0?r:t`<span class="bd-grip" aria-hidden="true" title=${n.on?"Drag to order":""}>${x("grip")}</span>`}
        ${e.select===void 0?r:t`<input type="checkbox" class="pk-card-pick" .checked=${e.select.picked}
          ?disabled=${e.select.disabled} aria-label=${e.select.label}
          @click=${s=>{s.stopPropagation(),e.select.onPick(s)}} />`}
        <button type="button" class="bd-open" title=${e.openTitle} @click=${s=>e.onOpen(s)}>
          ${e.picture??r}
          <span class="bd-nm"><span class="bd-n">${e.name}</span><span class="bd-m">${e.detail}</span></span>
        </button>
        ${e.actions??r}
      </span>
    </th>
    ${a.map((s,d)=>B(e.cells[d],s,d===i))}
  </tr>`;return e.ask!==void 0||e.note!==void 0||e.under!==void 0?t`${p}<tr class="bd-under ${e.dim?"dim":""}"><td colspan=${o}>
    ${e.ask===void 0?r:f(e.ask)}
    ${e.note===void 0?r:e.note.kind==="ok"?t`<p class="lt-note ok" role="status">${e.note.text}</p>`:t`<p class="lt-note" role="alert">${e.note.text}</p>`}
    ${e.under??r}
  </td></tr>`:p}function B(e,a,i){let o=a.color===void 0?r:`--dc:${a.color}`,n=e?.chip;if(n===void 0)return t`<td class="bd-cell ${i?"on":""}" style=${o}>
      <span class="bd-dash" role="img" aria-label=${e?.dashTitle??`Does not fit ${a.device.name}`} title=${e?.dashTitle??`Does not fit ${a.device.name}`}></span>
    </td>`;let l=n.shape==="round";return t`<td class="bd-cell ${i?"on":""}" style=${o}>
    <span class="bd-cell-in">
      <button type="button" class="bd-box ${n.on?"ticked":""} ${l?"rd":""} ${n.busy?"busy":""} ${n.stuck===void 0?"":"stuck"} ${n.hidden?"dim":""}"
        title=${n.title} aria-label=${`${n.name}: ${n.title}`}
        aria-pressed=${n.on?"true":"false"} aria-disabled=${n.next===void 0?"true":"false"}
        @click=${p=>{p.stopPropagation(),n.next!==void 0&&e?.onPick?.(n.next)}}><span class="bd-mark" aria-hidden="true"></span></button>
      ${e?.eye===void 0?r:t`<button type="button" class="bd-eye ${e.eye.hidden?"hid":""}" ?disabled=${e.eye.busy}
        title=${e.eye.title} aria-label=${e.eye.title} aria-pressed=${e.eye.hidden?"true":"false"}
        @click=${p=>{p.stopPropagation(),e.eye.onToggle()}}>${x(e.eye.hidden?"hide":"show")}</button>`}
    </span>
    ${n.hidden&&e?.note===void 0?t`<em class="bd-note">hidden</em>`:r}
    ${e?.note===void 0?r:t`<em class="bd-note ${e.noteWarn?"warn":""}" title=${e.noteTitle??r}>${e.note}</em>`}
  </td>`}var G=c`
  .bd-scroll { overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch; }
  table.bd { border-collapse: separate; border-spacing: 0; width: 100%; min-width: max-content; font-size: 12.5px; }
  .bd th, .bd td { padding: 0; text-align: left; font-weight: inherit; }
  .bd thead th { position: sticky; top: 0; z-index: 2; background: var(--wa-card); border-bottom: 1px solid var(--wa-line); vertical-align: bottom; }
  .bd .bd-thing { position: sticky; left: 0; z-index: 1; background: var(--wa-card); min-width: 220px; max-width: 320px; }
  .bd thead .bd-thing { z-index: 3; padding: 8px 10px; font-size: 11.5px; color: var(--wa-muted); font-weight: 600; }
  .bd-col { min-width: 96px; text-align: center; }
  .bd-col.on { background: color-mix(in srgb, var(--dc, var(--wa-accent)) 14%, var(--wa-card)); }
  .bd-col-btn {
    display: flex; flex-direction: column; align-items: center; gap: 3px; width: 100%; padding: 8px 8px 7px; box-sizing: border-box;
    border: 0; background: none; font: inherit; color: var(--wa-ink); cursor: pointer; border-radius: 8px 8px 0 0;
    border-bottom: 3px solid color-mix(in srgb, var(--dc, var(--wa-muted)) 70%, transparent);
  }
  .bd-col-btn:hover { background: var(--wa-hover); }
  .bd-col-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .bd-col-top { display: inline-flex; align-items: center; gap: 5px; max-width: 150px; }
  .bd-col-glyph { display: inline-flex; color: var(--dc, var(--wa-muted)); }
  .bd-col-glyph svg { width: 14px; height: 14px; }
  .bd-col-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; font-size: 12.5px; }
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
  @media (max-width: 640px) {
    .bd .bd-thing { min-width: 150px; max-width: 200px; }
    .bd-thing-in { padding: 6px; }
    .bd-col { min-width: 76px; }
  }
`;var Q=c`
  .lt-view { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  .lt-sect { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 8px; padding: 0 2px; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); }
  .lt-sect small { font-size: 12px; font-weight: 500; color: color-mix(in srgb, var(--wa-muted) 75%, transparent); }
  .lt-sect-r { margin-left: auto; font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
  .lt-list { display: flex; flex-direction: column; min-width: 0; border: 1px solid var(--wa-line-strong); border-radius: 8px; overflow: hidden; background: var(--wa-card); }
  .lt-row {
    display: flex; align-items: center; gap: 10px; min-width: 0; padding: 7px 12px 7px 8px;
    border-top: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
  }
  .lt-row:first-child { border-top: 0; }
  .lt-row.drag-over { box-shadow: inset 0 2px 0 var(--wa-accent); }
  .lt-row.drag-over.below { box-shadow: inset 0 -2px 0 var(--wa-accent); }
  .lt-row.dragging { opacity: .5; }
  .lt-row:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
  .lt-grip { display: inline-flex; flex: none; width: 14px; color: var(--wa-muted); cursor: grab; }
  .lt-grip svg { width: 14px; height: 14px; }
  .lt-row[draggable="false"] .lt-grip { opacity: .35; cursor: default; }
  .lt-row-open {
    display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; padding: 0; border: 0; background: none;
    font: inherit; color: inherit; text-align: left; cursor: pointer;
  }
  .lt-row-open:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
  .lt-row-nm { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
  .lt-row-n { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
  .lt-row-open:hover .lt-row-n { text-decoration: underline; text-underline-offset: 2px; }
  .lt-row-m { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--wa-muted); }
  .lt-row.hid { color: var(--wa-muted); }
  .lt-row.hid .lt-row-n { text-decoration: line-through; text-decoration-color: var(--wa-line-strong); }
  .lt-eye {
    flex: none; padding: 2px 7px; border-radius: 5px; border: 1px solid var(--wa-line-strong); background: transparent;
    font: inherit; font-size: 11px; color: var(--wa-muted); cursor: pointer;
  }
  .lt-eye:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
  .lt-eye:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lt-eye:disabled { opacity: .5; cursor: progress; }
  .lt-pick-sel {
    flex: none; max-width: 190px; height: 26px; padding: 0 24px 0 9px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
    font: inherit; font-size: 12.5px; color: var(--wa-ink); background-color: var(--wa-input, var(--wa-field)); cursor: pointer;
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8a8f' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 7px center; background-size: 11px;
  }
  .lt-pick-sel:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .lt-pick-sel:disabled { opacity: .5; cursor: progress; }
  .lt-line { margin: 0; padding: 0 2px; font-size: 12px; line-height: 1.5; color: var(--wa-muted); }
  .lt-line.warn, .lt-line.err { color: var(--wa-need); }
  .lt-line.ok { color: var(--wa-ok, var(--wa-ink)); }
  .lt-empty { margin: 0; padding: 12px 14px; font-size: 12.5px; color: var(--wa-muted); }
  /* "Not on this watch": the rest of the home, dimmed until hovered, each
     card with a small picture and its ticks. */
  .ap-card.lt-dim { opacity: .62; transition: opacity .12s ease-out, border-color .12s ease-out; }
  .ap-card.lt-dim:hover, .ap-card.lt-dim:focus-within { opacity: 1; }
  .ap-thumb.lt-thumb-sm { padding: 6px; }
  .lt-card-note { margin: 0; font-size: 11.5px; line-height: 1.35; color: var(--wa-need); }
  @media (max-width: 640px) {
    .lt-sect-r { margin-left: 0; flex-basis: 100%; }
    .lt-row { padding: 7px 10px 7px 6px; gap: 8px; }
    .lt-pick-sel { max-width: 130px; }
  }
`;var ee=c`
  :host { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; color: var(--wa-ink); }
  * { box-sizing: border-box; }
  svg { display: block; }
  button { font: inherit; color: inherit; }
  /* The page, the Complications list page's (\`list-page.ts\`): the title
     and its line, then one outlined surface holding the head, the device
     tabs, the bar, the cards and the foot. */
  .ap-page {
    --ap-top: clamp(20px, 4vh, 40px);
    flex: 1 1 auto; min-height: 0; overflow: auto;
    padding: var(--ap-top) clamp(16px, 4vw, 40px) 48px;
    background: var(--wa-bg); color: var(--wa-ink);
  }
  .ap-wrap { width: min(1400px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
  .ap-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 16px; padding: 0 2px; }
  .ap-head-text { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .ap-head h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -.02em; }
  .ap-lead { margin: 0; font-size: 14px; color: var(--wa-muted); }
  .ap-warn { margin: 0; font-size: 12.5px; color: var(--wa-need); }
  .ap-empty { margin: 0; padding: 18px 4px; font-size: 13px; color: var(--wa-muted); }

  /* A copy of the Complications surface's rules in panel.ts (\`.pk-*\`,
     its page form in list-page.ts), so these tabs' head and tabs look the
     same. Keep the two in step. */
  .pk-surface.pk-page {
    display: flex; flex-direction: column; min-width: 0;
    border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-lg);
    background: var(--wa-card); color: var(--wa-ink);
  }
  .pk-page > :first-child { border-top-left-radius: calc(var(--wa-r-lg) - 1px); border-top-right-radius: calc(var(--wa-r-lg) - 1px); }
  .pk-page > :last-child { border-bottom-left-radius: calc(var(--wa-r-lg) - 1px); border-bottom-right-radius: calc(var(--wa-r-lg) - 1px); }
  .pk-page > .pk-pin { position: sticky; top: calc(-1 * var(--ap-top, 0px)); z-index: 7; background: var(--wa-card); }
  .pk-head { display: flex; align-items: center; gap: 12px; flex: none; padding: 12px 12px 12px 18px; border-bottom: 1px solid var(--wa-line); }
  .pk-head > .pk-search { margin-left: auto; }
  .pk-shape { display: inline-flex; align-items: center; gap: 6px; flex: none; }
  .pk-shape-lead { font-size: 12px; color: var(--wa-muted); }
  .pk-shape select {
    max-width: 180px; font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); cursor: pointer; height: 28px;
    padding: 0 26px 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background-color: var(--wa-input);
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8a8f' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 8px center; background-size: 12px;
    transition: border-color .12s ease-out, box-shadow .12s ease-out;
  }
  .pk-shape select:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
  .pk-shape select:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .pk-search {
    display: flex; align-items: center; gap: 8px; flex: none; width: 260px; max-width: 45vw;
    height: 28px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-field);
  }
  .pk-search:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
  .pk-search:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .pk-search svg { width: 14px; height: 14px; flex: none; color: var(--wa-muted); }
  .pk-search-input {
    flex: 1; min-width: 0; font: inherit; font-size: 13px; color: var(--wa-ink);
    border: 0; background: transparent; outline: 0; padding: 0;
  }
  .pk-search-input::placeholder { color: color-mix(in srgb, var(--wa-muted) 70%, transparent); }
  .pk-tabs {
    display: flex; align-items: stretch; flex-wrap: wrap; gap: 2px; flex: none;
    padding: 0 12px; border-bottom: 1px solid var(--wa-line);
  }
  .pk-tab {
    display: inline-flex; align-items: center; gap: 7px; flex: none; cursor: pointer;
    font: inherit; font-size: 12.5px; font-weight: 500; color: var(--wa-muted); white-space: nowrap;
    padding: 9px 12px; border: 0; background: transparent;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
  }
  .pk-tab:hover { color: var(--wa-ink); }
  .pk-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 7px 7px 0 0; }
  .pk-tab.on { color: var(--wa-ink); font-weight: 600; border-bottom-color: var(--dc, var(--wa-ink)); }
  .pk-tab svg { width: 15px; height: 15px; }
  .pk-tab-glyph { display: inline-flex; flex: none; color: var(--dc, var(--wa-muted)); }
  .pk-tab-count { font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
  .pk-body { padding: 14px 18px; background: var(--wa-bg); min-height: 160px; }
  .pk-foot {
    display: flex; align-items: center; gap: 10px; flex: none; padding: 12px 18px;
    border-top: 1px solid var(--wa-line); background: var(--wa-card);
  }
  .pk-foot-hint { flex: 1; min-width: 0; font-size: 12px; color: var(--wa-muted); }

  /* The cards, the Complications cards' shape: the name on top, the picture
     big under it, then the devices and Devices. Each card is as tall as
     its picture. */
  .ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(232px, 1fr)); gap: 12px; align-items: start; }
  .ap-card {
    position: relative; z-index: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 9px 10px 10px;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-card);
    transition: border-color .12s ease-out;
  }
  .ap-card:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
  .ap-card.over { z-index: 5; }
  .ap-thumb {
    display: grid; place-items: start center; width: 100%; padding: 10px; overflow: hidden;
    border: 0; border-radius: 6px; background: var(--wa-bg); cursor: pointer;
  }
  .ap-top { display: flex; align-items: center; gap: 8px; max-width: 100%; padding-top: 2px; }
  .ap-open {
    display: flex; align-items: baseline; gap: 8px; min-width: 0; flex: 1;
    padding: 0; border: 0; background: none; cursor: pointer; text-align: left;
  }
  .ap-open .ap-detail { margin-left: auto; flex: none; }
  .ap-foot { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; min-width: 0; }
  .ap-open:focus-visible, .ap-thumb:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
  .ap-name { min-width: 0; font-size: 13.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ap-card:not(.picking) .ap-open:hover .ap-name { text-decoration: underline; text-underline-offset: 2px; }
  .ap-detail { font-size: 11.5px; color: var(--wa-muted); }
  .ap-devs { display: flex; flex-wrap: wrap; gap: 4px; min-width: 0; }
  .ap-dev {
    display: inline-flex; align-items: center; gap: 4px; max-width: 100%; padding: 2px 7px 2px 5px; border-radius: 999px;
    font-size: 11px; color: var(--wa-ink); background: var(--wa-hover); border: 1px solid var(--wa-line);
  }
  .ap-dev { border-color: color-mix(in srgb, var(--dc, var(--wa-line)) 60%, transparent); }
  .ap-dev svg { flex: none; width: 12px; height: 12px; color: var(--dc, var(--wa-muted)); }
  .ap-dev-n { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ap-dev.dim { opacity: .55; }
  .ap-dev em { font-style: normal; font-size: 10px; color: var(--wa-muted); }
  /* A phone, as the Complications surface folds there: the head's
     controls wrap, the search and the Device menu share a line, the tabs
     wrap and the head stops being pinned. */
  @media (max-width: 640px) {
    .ap-page { padding: 14px 12px 32px; }
    .ap-head h1 { font-size: 22px; }
    .pk-page > .pk-pin { position: static; }
    .pk-head { flex-wrap: wrap; row-gap: 8px; column-gap: 8px; padding: 10px 10px 10px 14px; }
    .pk-head > .pk-search { order: 3; flex: 1 1 0; width: auto; max-width: none; min-width: 0; margin-left: 0; }
    .pk-head > .pk-shape { order: 3; }
    .pk-shape select { max-width: 130px; }
    .pk-tab { padding: 9px 10px; }
    .pk-body { padding: 10px; }
    .ap-grid { gap: 8px; }
  }
`;export{A as a,j as b,K as c,H as d,F as e,V as f,q as g,G as h,Q as i,ee as j};
