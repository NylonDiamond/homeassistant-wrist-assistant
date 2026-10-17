import{ga as l,ha as b,ia as f,pa as C,qa as z,va as I}from"./chunk-4CBUJRLX.js";import{b as x}from"./chunk-TE5Q2R5V.js";import{z as L}from"./chunk-7YM7HFT5.js";import{b as c,d as s,e as g,g as w,nh as h}from"./chunk-E5S2SHQS.js";var D="dialog.lib-new";function m(e){return e==="menus"?"New menu":e==="status_pages"?"New status page":"New page"}function N(e){return e==="menus"?"menu":e==="status_pages"?"status page":"page"}function K(e,n){return e==="menus"?"Name it, pick its kind.":n.length>1?"Name it, pick where to preview it.":"Name it."}function E(e,n){let a=n.name.trim();if(a==="")return"Type a name to start.";if(e==="menus"){let r=n.unit??"anywhere";return`${a}, an ${b[r]} no device uses yet. Tick a device any time.`}return`${a}, a ${N(e)} no device has yet. Tick a device any time.`}function M(e){return e==="entity"?"Opens on an entity. Its actions in a ring.":"Opens on any screen. Your shortcuts for the whole watch."}function _(e){return e==="iphone"?"Drawn on an iPhone's screen first.":"Drawn on a watch face first."}function A(e){let n=e==="entity"?6:8,a=Array.from({length:n},(r,t)=>{let i=t/n*Math.PI*2-Math.PI/2;return g`<circle cx=${(16+Math.cos(i)*10).toFixed(2)} cy=${(16+Math.sin(i)*10).toFixed(2)} r="2.4" />`});return s`<svg class="lib-new-art" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <circle cx="16" cy="16" r="14.5" fill="none" stroke="var(--wa-shape-outline, currentColor)" stroke-width="1" opacity=".45" />
    ${a}${e==="entity"?g`<circle cx="16" cy="16" r="3" />`:w}
  </svg>`}function F(e){return e?s`<span class="pick-tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg></span>`:s`<span class="pick-tick off" aria-hidden="true"></span>`}function T(e,n,a,r,t,i){return s`<button type="button" class="shape-card lib-new-card ${e?"on":""}" role="radio" aria-checked=${e?"true":"false"}
    title=${a} ?disabled=${i} @click=${t}>
    <span class="shape-arts">${r}</span>
    <span class="shape-card-name">${n}</span>
    <span class="shape-card-note">${a}</span>
    ${F(e)}
  </button>`}function v(e,n,a){return s`<div class="new-step-head">
    <span class="new-step-num" aria-hidden="true">${e}</span>
    <span class="new-step-title">${n}</span>
    <span class="new-step-hint">${a}</span>
  </div>`}function q(e,n,a,r){let t=n.name.trim()!=="",i=N(e),p=t?"":"waiting",u=e==="menus",P=u||a.length>1;return s`<dialog class="new-dialog lib-new" aria-label=${m(e)} @close=${()=>r.onClose()}
    @cancel=${o=>{o.preventDefault(),n.busy||r.onClose()}}>
    <form class="lib-new-form" @submit=${o=>{o.preventDefault(),t&&!n.busy&&r.onMake()}}>
      <div class="new-head">
        <h2>${m(e)}</h2>
        <span class="new-head-note">${K(e,a)}</span>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Cancel" aria-label="Cancel" ?disabled=${n.busy} @click=${()=>r.onClose()}>${h("close")}</button>
      </div>
      <div class="new-body">
        <section class="new-step step-name">
          ${v(1,"Name it",u?"The name the Menus tab and the editor show.":`The name the ${i}'s card and the ${e==="status_pages"?"watch":"device"} show.`)}
          <input type="text" class="new-name" .value=${L(n.name)} maxlength="80" autofocus aria-label=${`${m(e)} name`}
            ?disabled=${n.busy} @input=${o=>r.onName(o.target.value)} />
        </section>
        ${P?u?s`<section class="new-step step-shapes ${p}" aria-disabled=${t?"false":"true"}>
          ${v(2,"Which kind",t?"A device uses one of each. It starts as the app's own menu of that kind.":"Waits for a name.")}
          <div class="shape-cards" role="radiogroup" aria-label="Kind of menu">
            ${["anywhere","entity"].map(o=>T((n.unit??"anywhere")===o,b[o],M(o),A(o),()=>r.onUnit?.(o),n.busy))}
          </div>
        </section>`:s`<section class="new-step step-shapes ${p}" aria-disabled=${t?"false":"true"}>
          ${v(2,"Preview on",t?"Only the picture the editor opens with. Nothing is put on a device; the ticks do that.":"Waits for a name.")}
          <div class="shape-cards" role="radiogroup" aria-label="Preview on">
            ${a.map(o=>T((n.preview??a[0])===o,o==="iphone"?"iPhone":"Watch",_(o),s`<span class="lib-new-art lib-new-device">${h(o==="iphone"?"phone":"watch")}</span>`,()=>r.onPreview?.(o),n.busy))}
          </div>
        </section>`:w}
        ${n.note===void 0?w:s`<p class="lt-line ${n.note.kind}" role="status">${n.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${E(e,n)}</span>
        <button type="button" class="lib-new-btn" ?disabled=${n.busy} @click=${()=>r.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary" ?disabled=${!t||n.busy} title=${t?`Make the ${i}`:"Type a name to start."}>${n.busy?"Making\u2026":"Create"}</button>
      </div>
    </form>
  </dialog>`}function G(e){let n=e?.querySelector?.(D);n&&(!n.open&&typeof n.showModal=="function"&&n.showModal(),n.querySelector("input.new-name")?.select())}var V=c`
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
`;var S="Tick a device and the page is on it.",O="A status page is a read-only screen of rows that a tile or a menu slot opens.";function d(e,n=1){let a=e==="status_pages"?"status page":"page";return n===1?a:`${a}s`}function X(e){return e==="status_pages"?"a status page":"a page"}function Z(e){return`Only a Home Assistant administrator can make a new ${d(e)}.`}function ee(e){return e==="status_pages"?"Status pages":"Pages"}function ne(e,n="pages"){return`${e} ${d(n,e)} in your home. ${n==="status_pages"?O:S}`}function ae(e,n,a=!1){let r=d(e);if(a)return`Click ${d(e,2)} to pick them. Shift+click picks every ${r} between two.`;if(n!==void 0){let t=x(n.kind);return e==="status_pages"?`Click a status page to edit it. Drag to order. The order is this ${t}'s own.`:`Click a page to edit it. Drag to order, and Hide here keeps a page on this ${t} without showing it.`}return e==="status_pages"?"Click a status page to edit it. Tick a device to put it there.":"Click a page to edit it. Tick a device to show the page there. One page, the same everywhere."}function te(e){return e.starter?`${e.detail} \xB7 starter`:e.detail}var $="all";function re(e,n,a,r=()=>{}){return[{id:$,label:"All",count:n===void 0?0:f(n,a).length},...e.map(t=>{let i=r(t.ownerId);return{id:t.ownerId,label:t.name,kind:t.kind,...i===void 0?{}:{color:i},count:n===void 0?0:I(n,t.ownerId,a)}})]}function ie(e,n){return e!==void 0&&n.some(a=>a.ownerId===e)?e:$}function U(e){return e.some(n=>n.kind==="watch")&&e.some(n=>n.kind==="iphone")}function oe(e,n){return e!==void 0&&e!=="all"&&U(n)?e:"all"}function k(e,n,a){return n==="all"||a.some(r=>r.kind===n&&e.some(t=>l(t,r.ownerId)))}function se(e,n){return[{key:"all",label:"All",count:e.length},{key:"watch",label:"Watches",count:e.filter(a=>k(a.owners,"watch",n)).length},{key:"iphone",label:"iPhones",count:e.filter(a=>k(a.owners,"iphone",n)).length}]}function y(e,n){let a=n.trim().toLowerCase();return a===""||e.toLowerCase().includes(a)}function pe(e,n,a="",r="all",t=[]){return f(e,n).filter(i=>y(i.name,a)&&k(i.owners,r,t))}function le(e,n,a,r=""){return{device:n,picks:C(e,n.ownerId,a).filter(t=>y(t.entry.name,r)),rest:z(e,n.ownerId,a).filter(t=>y(t.name,r))}}function de(e,n){if(n===void 0)return[...e];let a=n.flatMap(r=>e.filter(t=>l(t.id,r)));return[...a,...e.filter(r=>!a.includes(r))]}function H(e,n,a){let r=e.findIndex(i=>l(i,n)),t=e.findIndex(i=>l(i,a));if(!(r<0||t<0||r===t))return t<r?e[t]:t+1<e.length?e[t+1]:null}function ce(e,n,a){let r=H(e,n,a);return r===void 0?void 0:{id:n,before:r}}function we(e,n,a){let r=e.filter(p=>!l(p,n)),t=a===null?-1:r.findIndex(p=>l(p,a)),i=e.find(p=>l(p,n))??n;return t<0?[...r,i]:[...r.slice(0,t),i,...r.slice(t)]}function xe(e,n,a,r){let t=r.filter(i=>e.owners.some(p=>l(p,i.ownerId)));return(n===$?void 0:t.find(i=>i.ownerId===n))??(a==="all"?void 0:t.find(i=>i.kind===a))??t.find(i=>i.kind==="watch")??t[0]}function ue(e){return`Edit ${e} in the library`}function ge(e){return`On ${e.name}`}function he(e){return`Drag to order. The order is this ${x(e.kind)}'s own.`}function be(e){return`Not on this ${x(e.kind)}`}var fe="The rest of your home. Add one here with a tick.";function me(e,n,a){return a.trim()!==""?`No ${d(n)} on ${e.name} has that name.`:`No ${d(n,2)} on ${e.name} yet. Tick one below, or make a new one.`}function ve(e,n,a="all",r="pages"){if(e.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";let t=d(r);return n.trim()!==""?`No ${t} has that name.`:a!=="all"?`No ${t} here is on ${a==="watch"?"a watch":"an iPhone"}.`:r==="status_pages"?"Your home has no status pages yet. Use New status page to make one.":"Your home has no pages yet. Use New page to make one."}var $e=c`
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
`;var ze=c`
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
`;export{q as a,G as b,V as c,d,X as e,Z as f,ee as g,ne as h,ae as i,te as j,$ as k,re as l,ie as m,U as n,oe as o,k as p,se as q,y as r,pe as s,le as t,de as u,ce as v,we as w,xe as x,ue as y,ge as z,he as A,be as B,fe as C,me as D,ve as E,$e as F,ze as G};
