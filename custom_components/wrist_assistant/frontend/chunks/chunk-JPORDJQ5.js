import{wb as $}from"./chunk-LUS3RQ6X.js";import{j as y}from"./chunk-TOKIRHDQ.js";import{ph as p}from"./chunk-NPUC537M.js";import{Y as c}from"./chunk-XYOM42CD.js";import{b as m,f as r,g,i as l}from"./chunk-6ZDBXU6B.js";var I="dialog.lib-new";function x(n){return n==="menus"?"New menu":n==="status_pages"?"New status page":"New page"}function M(n){return n==="menus"?"menu":n==="status_pages"?"status page":"page"}function C(n,e){return n==="menus"?"Name it, pick its kind.":e.length>1?"Name it, pick where to preview it.":"Name it."}function z(n,e){let t=e.name.trim();if(t==="")return"Type a name to start.";if(n==="menus"){let s=e.unit??"anywhere";return e.onDevice!==void 0?`${t}, an ${c[s]} on ${e.onDevice}.`:`${t}, an ${c[s]} on no device yet. Tick a device any time.`}let i=n==="pages"&&e.mapPage===!0?"map page":M(n);return`${t}, a ${i} on no device yet. Tick a device any time.`}function k(n,e){return n?e?.refusal??"On the iPhone the whole page is your home's live map. The watch shows it as one tile.":"Tiles you place yourself."}function N(n){return r`<span class="lib-new-art lib-new-device">${p(n?"home":"grid")}</span>`}function D(n){return n==="entity"?"Opens on an entity. Its actions in a ring.":"Opens on any screen. Your shortcuts for the whole watch."}function U(n){return n==="iphone"?"Drawn on an iPhone's screen first.":"Drawn on a watch face first."}function L(n){let e=n==="entity"?6:8,t=Array.from({length:e},(i,s)=>{let o=s/e*Math.PI*2-Math.PI/2;return g`<circle cx=${(16+Math.cos(o)*10).toFixed(2)} cy=${(16+Math.sin(o)*10).toFixed(2)} r="2.4" />`});return r`<svg class="lib-new-art" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <circle cx="16" cy="16" r="14.5" fill="none" stroke="var(--wa-shape-outline, currentColor)" stroke-width="1" opacity=".45" />
    ${t}${n==="entity"?g`<circle cx="16" cy="16" r="3" />`:l}
  </svg>`}function E(n){return n?r`<span class="pick-tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg></span>`:r`<span class="pick-tick off" aria-hidden="true"></span>`}function d(n,e,t,i,s,o){return r`<button type="button" class="shape-card lib-new-card ${n?"on":""}" role="radio" aria-checked=${n?"true":"false"}
    title=${t} ?disabled=${o} @click=${s}>
    <span class="shape-arts">${i}</span>
    <span class="shape-card-name">${e}</span>
    <span class="shape-card-note">${t}</span>
    ${E(n)}
  </button>`}function w(n,e,t){return r`<div class="new-step-head">
    <span class="new-step-num" aria-hidden="true">${n}</span>
    <span class="new-step-title">${e}</span>
    <span class="new-step-hint">${t}</span>
  </div>`}function H(n,e,t,i,s){let o=e.name.trim()!=="",v=M(n),u=o?"":"waiting",b=n==="menus",h=n==="pages"&&s!==void 0,P=b||t.length>1,f=h&&e.mapPage===!0&&s.refusal===void 0,T=h?r`<section class="new-step step-shapes step-kind ${u}" aria-disabled=${o?"false":"true"}>
          ${w(2,"Which kind",o?"A page of tiles, or your home's map over the whole page.":"Waits for a name.")}
          <div class="shape-cards" role="radiogroup" aria-label="Kind of page">
            ${d(!f,"Page",k(!1),N(!1),()=>i.onMapPage?.(!1),e.busy)}
            ${d(f,r`Map page${$("ALPHA")}`,k(!0,s),N(!0),()=>i.onMapPage?.(!0),e.busy||s.refusal!==void 0)}
          </div>
        </section>`:l;return r`<dialog class="new-dialog lib-new" aria-label=${x(n)} @close=${()=>i.onClose()}
    @cancel=${a=>{a.preventDefault(),e.busy||i.onClose()}}>
    <form class="lib-new-form" @submit=${a=>{a.preventDefault(),o&&!e.busy&&i.onMake()}}>
      <div class="new-head">
        <h2>${x(n)}</h2>
        <span class="new-head-note">${C(n,t)}</span>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Cancel" aria-label="Cancel" ?disabled=${e.busy} @click=${()=>i.onClose()}>${p("close")}</button>
      </div>
      <div class="new-body">
        <section class="new-step step-name">
          ${w(1,"Name it",b?"The name the Menus tab and the editor show.":`The name the ${v}'s card and the ${n==="status_pages"?"watch":"device"} show.`)}
          <input type="text" class="new-name" .value=${y(e.name)} maxlength="80" autofocus aria-label=${`${x(n)} name`}
            ?disabled=${e.busy} @input=${a=>i.onName(a.target.value)} />
        </section>
        ${T}
        ${P?b?r`<section class="new-step step-shapes ${u}" aria-disabled=${o?"false":"true"}>
          ${w(2,"Which kind",o?"A device uses one of each. It starts as the app's own menu of that kind.":"Waits for a name.")}
          <div class="shape-cards" role="radiogroup" aria-label="Kind of menu">
            ${["anywhere","entity"].map(a=>d((e.unit??"anywhere")===a,c[a],D(a),L(a),()=>i.onUnit?.(a),e.busy||e.usedUnits?.includes(a)===!0))}
          </div>
        </section>`:r`<section class="new-step step-shapes ${u}" aria-disabled=${o?"false":"true"}>
          ${w(h?3:2,"Preview on",o?"Only the picture the editor opens with. Nothing is put on a device; the ticks do that.":"Waits for a name.")}
          <div class="shape-cards" role="radiogroup" aria-label="Preview on">
            ${t.map(a=>d((e.preview??t[0])===a,a==="iphone"?"iPhone":"Watch",U(a),r`<span class="lib-new-art lib-new-device">${p(a==="iphone"?"phone":"watch")}</span>`,()=>i.onPreview?.(a),e.busy))}
          </div>
        </section>`:l}
        ${e.note===void 0?l:r`<p class="lt-line ${e.note.kind}" role="status">${e.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${z(n,e)}</span>
        <button type="button" class="lib-new-btn" ?disabled=${e.busy} @click=${()=>i.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary" ?disabled=${!o||e.busy} title=${o?`Make the ${v}`:"Type a name to start."}>${e.busy?"Making\u2026":"Create"}</button>
      </div>
    </form>
  </dialog>`}function _(n){let e=n?.querySelector?.(I);e&&(!e.open&&typeof e.showModal=="function"&&e.showModal(),e.querySelector("input.new-name")?.select())}var S=m`
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
`;export{H as a,_ as b,S as c};
