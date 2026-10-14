import{h as y}from"./chunk-WG7NZLOX.js";import{$h as g,_h as $,ai as w,b as f,bi as C,c as n,ci as T,di as R,eh as h,ei as k,f as d,fi as S}from"./chunk-RYLMRUWW.js";function v(e){return e==="Control Center list"?"it":"them"}var H="The watch could not read this save";function z(e){let t=typeof e.rejected_reason=="string"?e.rejected_reason.trim():"";return t===""?H:`The watch could not use this save: ${t}`}function b(e,t=Math.round){return e<1024?`${e} bytes`:e<1024*1024?`${t(e*10/1024)/10} KB`:`${t(e*100/(1024*1024))/100} MB`}var I="Over the limit: Home Assistant will refuse this save.";function m(e,t){let o=e?Date.parse(e):NaN;return Number.isNaN(o)?"":y(Math.max(0,(t-o)/1e3))}function E(e){let t=w(e);return t.charAt(0).toUpperCase()+t.slice(1)}function J(e){let{record:t}=e,o=m(t.updated_at,e.now??Date.now()),r=C(t.updated_by,o),i=`Revision ${t.revision}`,s=e.limit>0&&e.size>e.limit,c=!s&&e.limit>0&&e.size/e.limit>.8,l=s?Math.ceil:e.size<e.limit?Math.floor:Math.round,a=s?`. ${I}`:c?e.size===e.limit?". At the limit.":". Close to the limit.":"",p=`${b(e.size,l)} used of ${b(e.limit)}${a}`;return g(t)?{tone:"err",revision:r,stamp:i,state:z(t),size:p,near:c,over:s,help:e.historyState==="unsupported"?`Change the ${e.noun} and save ${v(e.noun)} again.`:"Restore an earlier save from History."}:$(t)==="delivered"?{tone:"ok",revision:r,stamp:i,state:R,help:"The watch has the latest save.",size:p,near:c,over:s}:{tone:"warn",revision:r,stamp:i,state:T,help:k,size:p,near:c,over:s}}function N(e,t=Date.now()){if(e===void 0||e.revision<=0)return"";let o=m(e.updated_at,t);return o?`Saved ${o}`:"Saved"}function G(e,t=Date.now()){let o=N(e,t);if(e===void 0||o==="")return d;let r=e.updated_at?Date.parse(e.updated_at):NaN,i=Number.isNaN(r)?"":`, ${new Date(r).toLocaleString()}`;return n`<span class="cf-saved" title=${`Revision ${e.revision}, ${w(e.updated_by)}${i}`}>${o}</span>`}var W=3e4,_=class{constructor(t){this.host=t;this.wanted=!1;this.connected=!1;t.addController(this)}show(t){this.wanted=t,this.sync()}get running(){return this.timer!==void 0}hostConnected(){this.connected=!0,this.sync()}hostDisconnected(){this.connected=!1,this.sync()}sync(){let t=this.wanted&&this.connected;t&&this.timer===void 0?this.timer=setInterval(()=>this.host.requestUpdate(),W):!t&&this.timer!==void 0&&(clearInterval(this.timer),this.timer=void 0)}};function U(e){let t=e.status,o=`${t.revision} (${t.stamp}). ${t.state}. ${t.help} ${t.size}`,r=t.tone==="warn"?S:t.state;return n`<footer class="cf-bar" aria-label="Stored copy">
    <span class="cf-dot ${t.tone}" aria-hidden="true"></span>
    <span class="cf-text" title=${o}>
      <span class="cf-rev">${t.revision}</span>
      <span class="cf-sep" aria-hidden="true">·</span>
      <span class="cf-state ${t.tone}">${r}</span>
      ${t.tone==="err"?n`<span class="cf-help">${t.help}</span>`:d}
    </span>
    <span class="cf-size ${t.over?"over":t.near?"near":""}" title=${`${t.size}${t.size.endsWith(".")?"":"."} The second number is the most Home Assistant keeps for one watch.`}>${t.size}</span>
    ${e.historyState==="unsupported"?d:n`<button type="button" class="cf-btn cf-history-btn ${t.tone==="err"?"lit":""}"
      aria-haspopup="dialog" aria-expanded=${e.historyOpen?"true":"false"}
      title="Earlier saves, with Restore" @click=${e.onHistory}>History</button>`}
    <button type="button" class="cf-btn cf-raw-btn" aria-haspopup="dialog" aria-expanded=${e.rawOpen?"true":"false"}
      title="The document as JSON" @click=${e.onRaw}>Raw configuration</button>
  </footer>`}function q(e){let{record:t,entries:o,dirty:r}=e,i=e.now??Date.now(),s=g(t),c;if(e.historyState==="loading")c=n`<p class="pe-muted">Loading…</p>`;else if(e.historyState==="error")c=n`<p class="pe-muted">Could not load the earlier saves.</p>
      <button type="button" class="pe-btn" @click=${e.onRetry}>Try again</button>`;else if(o.length===0)c=n`<p class="pe-muted">No earlier saves yet.</p>`;else{let l=s?o.find(a=>a.revision<t.revision)?.revision:void 0;c=n`${r?n`<p class="pe-muted">Save or discard your edits first.</p>`:d}
      <ul class="pe-history cf-rows">
      ${o.map(a=>{let p=a.revision===t.revision,x=m(a.updated_at,i);return n`<li class=${a.revision===l?"offer":""}>
          <span class="pe-h-text">
            <b>Revision ${a.revision}</b>
            <span class="pe-muted">${E(a.updated_by)}${x?` ${x}`:""} · ${b(a.size)}</span>
          </span>
          ${p?n`<span class="pe-badge">Current</span>`:n`<button type="button" class="pe-btn ${a.revision===l?"pe-primary":""}" ?disabled=${e.restoring||r}
                title=${r?"Save or discard your edits first.":`Put revision ${a.revision} back as a new revision`}
                @click=${()=>e.onRestore(a)}>Restore</button>`}
        </li>`})}
    </ul>`}return n`<dialog class="cf-dialog cf-history" aria-labelledby="cf-history-title" @close=${e.onClosed}>
    <div class="cf-dialog-head">
      <div class="cf-dialog-title">
        <h3 id="cf-history-title">History of the ${e.noun}</h3>
        <span class="pe-muted">Revision ${t.revision} is the stored copy</span>
      </div>
      <button type="button" class="cf-close" title="Close" aria-label="Close" @click=${u}>${h("close")}</button>
    </div>
    ${s?n`<p class="pe-warn" role="note">${z(t)}. Restore the save before it.</p>`:d}
    <div class="cf-dialog-body">${c}</div>
    <p class="pe-muted">Restoring saves the earlier copy again as a new revision. The copy stored now stays in this list.</p>
    <div class="pe-ask-foot">
      <button type="button" class="pe-btn" @click=${u}>Close</button>
    </div>
  </dialog>`}function M(e){return JSON.stringify(e,null,2)??""}function K(e){let t=M(e.document);return n`<dialog class="cf-dialog cf-raw" aria-labelledby="cf-raw-title" @close=${e.onClosed}>
    <div class="cf-dialog-head">
      <div class="cf-dialog-title">
        <h3 id="cf-raw-title">Raw configuration</h3>
        <span class="pe-muted">${e.dirty?`The ${e.noun} as ${v(e.noun)==="it"?"it":"they"} would be saved, with your unsaved edits, over revision ${e.revision}`:`The ${e.noun} as Home Assistant holds ${v(e.noun)}, revision ${e.revision}`}</span>
      </div>
      <button type="button" class="cf-close" title="Close" aria-label="Close" @click=${u}>${h("close")}</button>
    </div>
    <pre class="cf-json" tabindex="0" aria-label="JSON">${t}</pre>
    <div class="pe-ask-foot">
      <span class="pe-muted cf-copied" aria-live="polite">${e.copied?"Copied":""}</span>
      <button type="button" class="pe-btn" @click=${()=>e.onCopy(t)}>Copy</button>
      <button type="button" class="pe-btn pe-primary" @click=${u}>Close</button>
    </div>
  </dialog>`}function u(e){e.currentTarget?.closest("dialog")?.close()}function V(e,t){for(let o of e.querySelectorAll("dialog.cf-dialog"))t.has(o)||(t.add(o),o.open||o.showModal())}async function Z(e){try{return typeof navigator>"u"||navigator.clipboard===void 0?!1:(await navigator.clipboard.writeText(e),!0)}catch{return!1}}var Q=f`
  .cf-bar {
    flex: none; position: sticky; bottom: calc(-1 * var(--cf-pad, 16px)); z-index: 6;
    display: flex; align-items: center; gap: 8px; min-height: 36px;
    margin: auto calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px));
    padding: 0 calc(var(--cf-pad, 16px) - 8px) 0 var(--cf-pad, 16px);
    background: var(--wa-top, var(--wa-card)); border-top: 1px solid var(--wa-line);
    font-size: 12px; color: var(--wa-muted);
  }
  .cf-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--wa-muted); }
  .cf-dot.ok { background: var(--success-color, var(--wa-green, #3dd68c)); }
  .cf-dot.warn { background: var(--warning-color, var(--wa-amber, #ffa600)); }
  .cf-dot.err { background: var(--error-color, var(--wa-need, #db4437)); }
  .cf-text { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cf-sep { margin: 0 4px; }
  .cf-state.warn { color: var(--warning-color, var(--wa-amber, #ffa600)); }
  .cf-state.err { color: var(--error-color, var(--wa-need, #db4437)); font-weight: 600; }
  .cf-help { margin-left: 6px; }
  .cf-size { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cf-size.near { color: var(--warning-color, var(--wa-amber, #ffa600)); font-weight: 600; }
  .cf-size.over { color: var(--error-color, #db4437); font-weight: 600; }
  .cf-btn {
    flex: none; font: inherit; font-size: 12px; font-weight: 400; color: var(--wa-soft, var(--wa-muted)); cursor: pointer;
    background: transparent; border: 0; padding: 0 8px; min-height: 24px; border-radius: 6px;
  }
  .cf-btn:hover, .cf-btn[aria-expanded="true"] { background: var(--wa-panel); color: var(--wa-ink); }
  .cf-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .cf-btn.lit { color: var(--wa-ink); font-weight: 600; }
  @container (max-width: 560px) {
    .cf-size { display: none; }
  }
  /* The toolbar's "Saved 3 min ago", left of Discard. */
  .cf-saved { margin-right: 4px; color: var(--wa-muted); font-size: 13px; white-space: nowrap; }

  dialog.cf-dialog {
    width: min(560px, calc(100vw - 32px)); max-height: min(80vh, 720px); padding: 20px;
    border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
    background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
  }
  dialog.cf-dialog[open] { display: flex; flex-direction: column; gap: 10px; }
  dialog.cf-dialog::backdrop { background: rgba(0, 0, 0, .45); }
  dialog.cf-dialog h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
  .cf-dialog-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .cf-close {
    display: inline-flex; align-items: center; justify-content: center; flex: none; width: 28px; height: 28px;
    margin: -4px -6px 0 0; padding: 0; border: 0; border-radius: 6px; background: none; color: var(--wa-muted); cursor: pointer;
  }
  .cf-close:hover { background: var(--wa-panel); color: var(--wa-ink); }
  .cf-close:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .cf-close svg.ui-icon { width: 16px; height: 16px; }
  .cf-dialog-title { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .cf-dialog-body { min-height: 0; overflow: auto; display: flex; flex-direction: column; gap: 8px; }
  .cf-json {
    flex: 1 1 auto; min-height: 120px; margin: 0; padding: 10px 12px; overflow: auto;
    border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px); background: var(--wa-field);
    font: 12px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre; tab-size: 2;
  }
  .cf-json:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .cf-copied { margin-right: auto; align-self: center; }
`;var D=.145,A=.045,O=.018,L=.05;function j(e,t){let o=e*t;return{radius:Math.round(o*D),bezel:Math.round(o*A),rim:Math.max(2,Math.round(o*O)),crown:Math.round(o*L)}}function te(e,t,o,r){let i=j(e.width,t),s=[`--wf-radius:${i.radius}px`,`--wf-bezel:${i.bezel}px`,`--wf-rim:${i.rim}px`,`--wf-crown:${i.crown}px`];if(e.height!==void 0&&e.height>0){let c=e.height*t+i.bezel*2,l=a=>`${Math.round(c*a*100)/100}px`;s.push(`--wf-crown-top:${l(.19)}`,`--wf-crown-h:${l(.16)}`,`--wf-button-top:${l(.42)}`,`--wf-button-h:${l(.22)}`)}return n`<div class="wa-watch" aria-label=${r??"Watch"} style=${s.join(";")}>${o}</div>`}var oe=f`
  .wa-watch {
    position: relative;
    display: inline-block;
    flex: none;
    box-sizing: content-box;
    padding: var(--wf-bezel, 9px);
    /* The rim is drawn outside the box (a shadow), so the margins keep room
       for it, and on the right for the crown as well. */
    margin: var(--wf-rim, 3px) calc(var(--wf-rim, 3px) + var(--wf-crown, 10px)) var(--wf-rim, 3px) var(--wf-rim, 3px);
    border-radius: calc(var(--wf-radius, 28px) + var(--wf-bezel, 9px));
    /* The glass: black, with a faint sheen from the top left. */
    background:
      linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0) 40%),
      #07080c;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.04),
      0 0 0 var(--wf-rim, 3px) var(--wa-art-case, #2b2f3d),
      0 0 0 calc(var(--wf-rim, 3px) + 1px) rgba(255, 255, 255, 0.1),
      0 14px 34px rgba(0, 0, 0, 0.4);
  }
  .wa-watch::before,
  .wa-watch::after {
    content: "";
    position: absolute;
    left: calc(100% + var(--wf-rim, 3px));
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.25)),
      var(--wa-art-case, #2b2f3d);
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }
  /* Digital Crown: a fifth of the way down, a sixth of the case tall. */
  .wa-watch::before {
    top: var(--wf-crown-top, 19%);
    width: var(--wf-crown, 10px);
    height: var(--wf-crown-h, 16%);
    border-radius: 0 calc(var(--wf-crown, 10px) * 0.45) calc(var(--wf-crown, 10px) * 0.45) 0;
  }
  /* Side button: below the crown, thinner and longer. */
  .wa-watch::after {
    top: var(--wf-button-top, 42%);
    width: calc(var(--wf-crown, 10px) * 0.55);
    height: var(--wf-button-h, 22%);
    border-radius: 0 calc(var(--wf-crown, 10px) * 0.3) calc(var(--wf-crown, 10px) * 0.3) 0;
  }
  .wa-watch > * {
    border-radius: var(--wf-radius, 28px);
    box-shadow: none;
  }
`;export{J as a,G as b,_ as c,U as d,q as e,K as f,V as g,Z as h,Q as i,te as j,oe as k};
