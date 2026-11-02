import{Y as g}from"./chunk-HVEEILID.js";import{vb as $}from"./chunk-VYGOGHFF.js";import{j as y}from"./chunk-UCO5DASE.js";import{b as f,d as r,e as h,g as l,xh as p}from"./chunk-G7AAB2LI.js";var I="dialog.lib-new";function x(e){return e==="menus"?"New menu":e==="status_pages"?"New status page":"New page"}function M(e){return e==="menus"?"menu":e==="status_pages"?"status page":"page"}function C(e,n){return e==="menus"?"Name it, pick its kind.":n.length>1?"Name it, pick where to preview it.":"Name it."}function z(e,n){let t=n.name.trim();if(t==="")return"Type a name to start.";if(e==="menus"){let s=n.unit??"anywhere";return`${t}, an ${g[s]} on no device yet. Tick a device any time.`}let i=e==="pages"&&n.mapPage===!0?"map page":M(e);return`${t}, a ${i} on no device yet. Tick a device any time.`}function k(e,n){return e?n?.refusal??"On the iPhone the whole page is your home's live map. The watch shows it as one tile.":"Tiles you place yourself."}function N(e){return r`<span class="lib-new-art lib-new-device">${p(e?"home":"grid")}</span>`}function L(e){return e==="entity"?"Opens on an entity. Its actions in a ring.":"Opens on any screen. Your shortcuts for the whole watch."}function D(e){return e==="iphone"?"Drawn on an iPhone's screen first.":"Drawn on a watch face first."}function E(e){let n=e==="entity"?6:8,t=Array.from({length:n},(i,s)=>{let o=s/n*Math.PI*2-Math.PI/2;return h`<circle cx=${(16+Math.cos(o)*10).toFixed(2)} cy=${(16+Math.sin(o)*10).toFixed(2)} r="2.4" />`});return r`<svg class="lib-new-art" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <circle cx="16" cy="16" r="14.5" fill="none" stroke="var(--wa-shape-outline, currentColor)" stroke-width="1" opacity=".45" />
    ${t}${e==="entity"?h`<circle cx="16" cy="16" r="3" />`:l}
  </svg>`}function K(e){return e?r`<span class="pick-tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg></span>`:r`<span class="pick-tick off" aria-hidden="true"></span>`}function c(e,n,t,i,s,o){return r`<button type="button" class="shape-card lib-new-card ${e?"on":""}" role="radio" aria-checked=${e?"true":"false"}
    title=${t} ?disabled=${o} @click=${s}>
    <span class="shape-arts">${i}</span>
    <span class="shape-card-name">${n}</span>
    <span class="shape-card-note">${t}</span>
    ${K(e)}
  </button>`}function d(e,n,t){return r`<div class="new-step-head">
    <span class="new-step-num" aria-hidden="true">${e}</span>
    <span class="new-step-title">${n}</span>
    <span class="new-step-hint">${t}</span>
  </div>`}function H(e,n,t,i,s){let o=n.name.trim()!=="",v=M(e),w=o?"":"waiting",u=e==="menus",b=e==="pages"&&s!==void 0,P=u||t.length>1,m=b&&n.mapPage===!0&&s.refusal===void 0,T=b?r`<section class="new-step step-shapes step-kind ${w}" aria-disabled=${o?"false":"true"}>
          ${d(2,"Which kind",o?"A page of tiles, or your home's map over the whole page.":"Waits for a name.")}
          <div class="shape-cards" role="radiogroup" aria-label="Kind of page">
            ${c(!m,"Page",k(!1),N(!1),()=>i.onMapPage?.(!1),n.busy)}
            ${c(m,r`Map page${$("ALPHA")}`,k(!0,s),N(!0),()=>i.onMapPage?.(!0),n.busy||s.refusal!==void 0)}
          </div>
        </section>`:l;return r`<dialog class="new-dialog lib-new" aria-label=${x(e)} @close=${()=>i.onClose()}
    @cancel=${a=>{a.preventDefault(),n.busy||i.onClose()}}>
    <form class="lib-new-form" @submit=${a=>{a.preventDefault(),o&&!n.busy&&i.onMake()}}>
      <div class="new-head">
        <h2>${x(e)}</h2>
        <span class="new-head-note">${C(e,t)}</span>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Cancel" aria-label="Cancel" ?disabled=${n.busy} @click=${()=>i.onClose()}>${p("close")}</button>
      </div>
      <div class="new-body">
        <section class="new-step step-name">
          ${d(1,"Name it",u?"The name the Menus tab and the editor show.":`The name the ${v}'s card and the ${e==="status_pages"?"watch":"device"} show.`)}
          <input type="text" class="new-name" .value=${y(n.name)} maxlength="80" autofocus aria-label=${`${x(e)} name`}
            ?disabled=${n.busy} @input=${a=>i.onName(a.target.value)} />
        </section>
        ${T}
        ${P?u?r`<section class="new-step step-shapes ${w}" aria-disabled=${o?"false":"true"}>
          ${d(2,"Which kind",o?"A device uses one of each. It starts as the app's own menu of that kind.":"Waits for a name.")}
          <div class="shape-cards" role="radiogroup" aria-label="Kind of menu">
            ${["anywhere","entity"].map(a=>c((n.unit??"anywhere")===a,g[a],L(a),E(a),()=>i.onUnit?.(a),n.busy))}
          </div>
        </section>`:r`<section class="new-step step-shapes ${w}" aria-disabled=${o?"false":"true"}>
          ${d(b?3:2,"Preview on",o?"Only the picture the editor opens with. Nothing is put on a device; the ticks do that.":"Waits for a name.")}
          <div class="shape-cards" role="radiogroup" aria-label="Preview on">
            ${t.map(a=>c((n.preview??t[0])===a,a==="iphone"?"iPhone":"Watch",D(a),r`<span class="lib-new-art lib-new-device">${p(a==="iphone"?"phone":"watch")}</span>`,()=>i.onPreview?.(a),n.busy))}
          </div>
        </section>`:l}
        ${n.note===void 0?l:r`<p class="lt-line ${n.note.kind}" role="status">${n.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${z(e,n)}</span>
        <button type="button" class="lib-new-btn" ?disabled=${n.busy} @click=${()=>i.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary" ?disabled=${!o||n.busy} title=${o?`Make the ${v}`:"Type a name to start."}>${n.busy?"Making\u2026":"Create"}</button>
      </div>
    </form>
  </dialog>`}function _(e){let n=e?.querySelector?.(I);n&&(!n.open&&typeof n.showModal=="function"&&n.showModal(),n.querySelector("input.new-name")?.select())}var S=f`
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
