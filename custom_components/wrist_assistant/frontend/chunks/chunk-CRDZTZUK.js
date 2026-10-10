import{I as y,J as u,K as g,L as $,M as C,N as R,O as k,Q as S,h as x}from"./chunk-5SC5KRPF.js";import{b as m,c as n,eh as f,f as l}from"./chunk-CQXHQEN6.js";function v(e){return e==="Control Center list"?"it":"them"}var N="The watch could not read this save";function z(e){let t=typeof e.rejected_reason=="string"?e.rejected_reason.trim():"";return t===""?N:`The watch could not use this save: ${t}`}function h(e,t=Math.round){return e<1024?`${e} bytes`:e<1024*1024?`${t(e*10/1024)/10} KB`:`${t(e*100/(1024*1024))/100} MB`}var D="Over the limit: Home Assistant will refuse this save.";function b(e,t){let o=e?Date.parse(e):NaN;return Number.isNaN(o)?"":x(Math.max(0,(t-o)/1e3))}function O(e){let{record:t}=e,o=b(t.updated_at,e.now??Date.now()),r=`Revision ${t.revision} \xB7 ${g(t.updated_by,e.device)}${o?` ${o}`:""}`,i=e.limit>0&&e.size>e.limit,s=!i&&e.limit>0&&e.size/e.limit>.8,c=i?Math.ceil:e.size<e.limit?Math.floor:Math.round,d=i?`. ${D}`:s?e.size===e.limit?". At the limit.":". Close to the limit.":"",a=`${h(e.size,c)} of the ${h(e.limit)} Home Assistant keeps${d}`;return u(t)?{tone:"err",revision:r,state:z(t),size:a,near:s,over:i,help:e.historyState==="unsupported"?`Change the ${e.noun} and save ${v(e.noun)} again.`:"Restore an earlier save from History."}:y(t)==="delivered"?{tone:"ok",revision:r,state:R,help:`The ${S(e.device??"watch")} has revision ${t.revision}.`,size:a,near:s,over:i}:{tone:"warn",revision:r,state:C,help:k(e.device??"watch"),size:a,near:s,over:i}}function _(e,t=Date.now()){if(e===void 0||e.revision<=0)return"";let o=b(e.updated_at,t);return o?`Saved ${o}`:"Saved"}function F(e,t=Date.now(),o="watch"){let r=_(e,t);if(e===void 0||r==="")return l;let i=e.updated_at?Date.parse(e.updated_at):NaN,s=Number.isNaN(i)?"":`, ${new Date(i).toLocaleString()}`;return n`<span class="cf-saved" title=${`Revision ${e.revision}, ${g(e.updated_by,o)}${s}`}>${r}</span>`}var E=3e4,T=class{constructor(t){this.host=t;this.wanted=!1;this.connected=!1;t.addController(this)}show(t){this.wanted=t,this.sync()}get running(){return this.timer!==void 0}hostConnected(){this.connected=!0,this.sync()}hostDisconnected(){this.connected=!1,this.sync()}sync(){let t=this.wanted&&this.connected;t&&this.timer===void 0?this.timer=setInterval(()=>this.host.requestUpdate(),E):!t&&this.timer!==void 0&&(clearInterval(this.timer),this.timer=void 0)}};function A(e){let t=e.status,o=`${t.revision}. ${t.state}. ${t.help} ${t.size}`;return n`<footer class="cf-bar" aria-label="Stored copy">
    <span class="cf-dot ${t.tone}" aria-hidden="true"></span>
    <span class="cf-text" title=${o}>
      <span class="cf-rev">${t.revision}</span>
      <span class="cf-sep" aria-hidden="true">·</span>
      <span class="cf-state ${t.tone}">${t.state}</span>
      ${t.tone==="err"?n`<span class="cf-help">${t.help}</span>`:l}
    </span>
    <span class="cf-size ${t.over?"over":t.near?"near":""}" title=${t.size}>${t.size}</span>
    ${e.historyState==="unsupported"?l:n`<button type="button" class="cf-btn cf-history-btn ${t.tone==="err"?"lit":""}"
      aria-haspopup="dialog" aria-expanded=${e.historyOpen?"true":"false"}
      title="Earlier saves, with Restore" @click=${e.onHistory}>History</button>`}
    <button type="button" class="cf-btn cf-raw-btn" aria-haspopup="dialog" aria-expanded=${e.rawOpen?"true":"false"}
      title="The document as JSON" @click=${e.onRaw}>Raw configuration</button>
  </footer>`}function P(e){let{record:t,entries:o,dirty:r}=e,i=e.now??Date.now(),s=u(t),c;if(e.historyState==="loading")c=n`<p class="pe-muted">Loading…</p>`;else if(e.historyState==="error")c=n`<p class="pe-muted">Could not load the earlier saves.</p>
      <button type="button" class="pe-btn" @click=${e.onRetry}>Try again</button>`;else if(o.length===0)c=n`<p class="pe-muted">No earlier saves yet.</p>`;else{let d=s?o.find(a=>a.revision<t.revision)?.revision:void 0;c=n`${r?n`<p class="pe-muted">Save or discard your edits first.</p>`:l}
      <ul class="pe-history cf-rows">
      ${o.map(a=>{let H=a.revision===t.revision,w=b(a.updated_at,i);return n`<li class=${a.revision===d?"offer":""}>
          <span class="pe-h-text">
            <b>Revision ${a.revision}</b>
            <span class="pe-muted">${$(a.updated_by,e.device)}${w?` ${w}`:""} · ${h(a.size)}</span>
          </span>
          ${H?n`<span class="pe-badge">Current</span>`:n`<button type="button" class="pe-btn ${a.revision===d?"pe-primary":""}" ?disabled=${e.restoring||r}
                title=${r?"Save or discard your edits first.":`Put revision ${a.revision} back as a new revision`}
                @click=${()=>e.onRestore(a)}>Restore</button>`}
        </li>`})}
    </ul>`}return n`<dialog class="cf-dialog cf-history" aria-labelledby="cf-history-title" @close=${e.onClosed}>
    <div class="cf-dialog-head">
      <div class="cf-dialog-title">
        <h3 id="cf-history-title">History of the ${e.noun}</h3>
        <span class="pe-muted">Revision ${t.revision} is the stored copy</span>
      </div>
      <button type="button" class="cf-close" title="Close" aria-label="Close" @click=${p}>${f("close")}</button>
    </div>
    ${s?n`<p class="pe-warn" role="note">${z(t)}. Restore the save before it.</p>`:l}
    <div class="cf-dialog-body">${c}</div>
    <p class="pe-muted">Restoring saves the earlier copy again as a new revision. The copy stored now stays in this list.</p>
    <div class="pe-ask-foot">
      <button type="button" class="pe-btn" @click=${p}>Close</button>
    </div>
  </dialog>`}function I(e){return JSON.stringify(e,null,2)??""}function B(e){let t=I(e.document);return n`<dialog class="cf-dialog cf-raw" aria-labelledby="cf-raw-title" @close=${e.onClosed}>
    <div class="cf-dialog-head">
      <div class="cf-dialog-title">
        <h3 id="cf-raw-title">Raw configuration</h3>
        <span class="pe-muted">${e.dirty?`The ${e.noun} as ${v(e.noun)==="it"?"it":"they"} would be saved, with your unsaved edits, over revision ${e.revision}`:`The ${e.noun} as Home Assistant holds ${v(e.noun)}, revision ${e.revision}`}</span>
      </div>
      <button type="button" class="cf-close" title="Close" aria-label="Close" @click=${p}>${f("close")}</button>
    </div>
    <pre class="cf-json" tabindex="0" aria-label="JSON">${t}</pre>
    <div class="pe-ask-foot">
      <span class="pe-muted cf-copied" aria-live="polite">${e.copied?"Copied":""}</span>
      <button type="button" class="pe-btn" @click=${()=>e.onCopy(t)}>Copy</button>
      <button type="button" class="pe-btn pe-primary" @click=${p}>Close</button>
    </div>
  </dialog>`}function p(e){e.currentTarget?.closest("dialog")?.close()}function J(e,t){for(let o of e.querySelectorAll("dialog.cf-dialog"))t.has(o)||(t.add(o),o.open||o.showModal())}async function X(e){try{return typeof navigator>"u"||navigator.clipboard===void 0?!1:(await navigator.clipboard.writeText(e),!0)}catch{return!1}}var q=m`
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
`;export{O as a,F as b,T as c,A as d,P as e,B as f,J as g,X as h,q as i};
