import{c as y}from"./chunk-HYO6YZS2.js";import{b as f,d as n,g as c,rh as d}from"./chunk-RA6AEJS2.js";import{J as $,K as w,L as C,N as m,P as S,R as T,S as R,V as h,ha as k,ka as N,oa as _}from"./chunk-RCA6FBW6.js";function b(e){return e==="Control Center list"?"it":"them"}var I="The watch could not read this save";function H(e,t="watch"){let o=typeof e.rejected_reason=="string"?e.rejected_reason.trim():"",i=h(t);return o===""?t==="watch"?I:`The ${i} could not read this save`:`The ${i} could not use this save: ${o}`}function x(e,t=Math.round){return e<1024?`${e} bytes`:e<1024*1024?`${t(e*10/1024)/10} KB`:`${t(e*100/(1024*1024))/100} MB`}var j="Over the limit: Home Assistant will refuse this save.";function v(e,t){let o=e?Date.parse(e):NaN;return Number.isNaN(o)?"":y(Math.max(0,(t-o)/1e3))}function X(e){let{record:t}=e,o=v(t.updated_at,e.now??Date.now()),i=m(t.updated_by,o,e.device),l=`Revision ${t.revision}`,a=e.limit>0&&e.size>e.limit,s=!a&&e.limit>0&&e.size/e.limit>.8,u=a?Math.ceil:e.size<e.limit?Math.floor:Math.round,r=a?`. ${j}`:s?e.size===e.limit?". At the limit.":". Close to the limit.":"",p=`${x(e.size,u)} used of ${x(e.limit)}${r}`;return w(t)?{tone:"err",revision:i,stamp:l,state:H(t,e.device),size:p,near:s,over:a,help:e.historyState==="unsupported"?`Change the ${e.noun} and save ${b(e.noun)} again.`:"Restore an earlier save from History."}:$(t)==="delivered"?{tone:"ok",revision:i,stamp:l,state:S,help:`The ${h(e.device??"watch")} has the latest save.`,size:p,near:s,over:a}:{tone:"warn",revision:i,stamp:l,state:T(e.device??"watch"),help:R(e.device??"watch"),size:p,near:s,over:a}}function q(e,t){return t&&e.tone!=="err"?c:n`<span class="tb-sync ${e.tone}" title=${`${e.state}. ${e.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${e.state}</span>
    </span>`}var F="View as JSON";function U(e){return n`<button class="row cf-raw-item" role="menuitem" title="This document as JSON, read only, with Copy"
    @click=${e}>${F}</button>`}function G(e,t=Date.now()){let o=v(e.updated_at,t);return o===""?"Put back this earlier save?":o==="just now"?"Put back the save from just now?":`Put back the save from ${o}?`}function O(e,t=Date.now()){if(e===void 0||e.revision<=0)return"";let o=v(e.updated_at,t);return o?`Saved ${o}`:"Saved"}function Q(e,t=Date.now(),o="watch"){let i=O(e,t);if(e===void 0||i==="")return c;let l=e.updated_at?Date.parse(e.updated_at):NaN,a=Number.isNaN(l)?"":`, ${new Date(l).toLocaleString()}`;return n`<span class="cf-saved" title=${`Revision ${e.revision}, ${C(e.updated_by,o)}${a}`}>${i}</span>`}var M=3e4,D=class{constructor(t){this.host=t;this.wanted=!1;this.connected=!1;t.addController(this)}show(t){this.wanted=t,this.sync()}get running(){return this.timer!==void 0}hostConnected(){this.connected=!0,this.sync()}hostDisconnected(){this.connected=!1,this.sync()}sync(){let t=this.wanted&&this.connected;t&&this.timer===void 0?this.timer=setInterval(()=>this.host.requestUpdate(),M):!t&&this.timer!==void 0&&(clearInterval(this.timer),this.timer=void 0)}};function Y(e){let t=e.status;return t.tone!=="err"&&!t.near&&!t.over&&e.historyState==="unsupported"?n``:n`<footer class="cf-bar" aria-label="Stored copy">
    <span class="cf-text">
      ${t.tone==="err"?n`<span class="cf-help">${t.help}</span>`:c}
      ${t.near||t.over?n`<span class="cf-size ${t.over?"over":"near"}" title=${`${t.size}${t.size.endsWith(".")?"":"."} The second number is the most Home Assistant keeps for one ${h(e.device??"watch")}.`}>${t.size}</span>`:c}
    </span>
    ${e.historyState==="unsupported"?c:n`<button type="button" class="cf-btn cf-history-btn ${t.tone==="err"?"lit":""}"
      aria-haspopup="dialog" aria-expanded=${e.historyOpen?"true":"false"}
      title="Earlier saves, with Restore" @click=${e.onHistory}>History</button>`}
  </footer>`}function Z(e){let{record:t,entries:o,dirty:i}=e,l=e.now??Date.now(),a=w(t),s;if(e.historyState==="loading")s=n`<p class="pe-muted">Loading…</p>`;else if(e.historyState==="error")s=n`<p class="pe-muted">Could not load the earlier saves.</p>
      <button type="button" class="pe-btn" @click=${e.onRetry}>Try again</button>`;else if(o.length===0)s=n`<p class="pe-muted">No earlier saves yet.</p>`;else{let u=a?o.find(r=>r.revision<t.revision)?.revision:void 0;s=n`${i?n`<p class="pe-muted">Save or discard your edits first.</p>`:c}
      <ul class="pe-history cf-rows">
      ${o.map(r=>{let p=r.revision===t.revision,z=v(r.updated_at,l);return n`<li class=${r.revision===u?"offer":""}>
          <span class="pe-h-text" title=${`Revision ${r.revision}`}>
            <b>${m(r.updated_by,z,e.device)}</b>
            <span class="pe-muted">${x(r.size)}</span>
          </span>
          ${p?n`<span class="pe-badge">Current</span>`:n`<button type="button" class="pe-btn ${r.revision===u?"pe-primary":""}" ?disabled=${e.restoring||i}
                title=${i?"Save or discard your edits first.":"Put this save back. It is saved again as the newest save."}
                @click=${()=>e.onRestore(r)}>Restore</button>`}
        </li>`})}
    </ul>`}return n`<dialog class="cf-dialog cf-history" aria-labelledby="cf-history-title" @close=${e.onClosed}>
    <div class="cf-dialog-head">
      <div class="cf-dialog-title">
        <h3 id="cf-history-title">History of the ${e.noun}</h3>
        <span class="pe-muted" title=${`Revision ${t.revision}`}>Newest first. Current is the copy Home Assistant holds.</span>
      </div>
      <button type="button" class="cf-close" title="Close" aria-label="Close" @click=${g}>${d("close")}</button>
    </div>
    ${a?n`<p class="pe-warn" role="note">${H(t,e.device)}. Restore the save before it.</p>`:c}
    <div class="cf-dialog-body">${s}</div>
    <p class="pe-muted">Restoring saves the earlier copy again as the newest save. The copy stored now stays in this list.</p>
    <div class="pe-ask-foot">
      <button type="button" class="pe-btn" @click=${g}>Close</button>
    </div>
  </dialog>`}function L(e){return JSON.stringify(e,null,2)??""}function P(e){return`${e.charAt(0).toUpperCase()}${e.slice(1)} as JSON`}function ee(e){let t=L(e.document);return n`<dialog class="cf-dialog cf-raw" aria-labelledby="cf-raw-title" @close=${e.onClosed}>
    <div class="cf-dialog-head">
      <div class="cf-dialog-title">
        <h3 id="cf-raw-title">${P(e.noun)}</h3>
        <span class="pe-muted">${e.dirty?`The ${e.noun} as ${b(e.noun)==="it"?"it":"they"} would be saved, with your unsaved edits`:`The ${e.noun} as Home Assistant holds ${b(e.noun)}`}</span>
      </div>
      <button type="button" class="cf-close" title="Close" aria-label="Close" @click=${g}>${d("close")}</button>
    </div>
    <pre class="cf-json" tabindex="0" aria-label="JSON">${t}</pre>
    <div class="pe-ask-foot">
      <span class="pe-muted cf-copied" aria-live="polite">${e.copied?"Copied":""}</span>
      <button type="button" class="pe-btn" @click=${()=>e.onCopy(t)}>Copy</button>
      <button type="button" class="pe-btn pe-primary" @click=${g}>Close</button>
    </div>
  </dialog>`}function g(e){e.currentTarget?.closest("dialog")?.close()}function te(e,t){for(let o of e.querySelectorAll("dialog.cf-dialog"))t.has(o)||(t.add(o),o.open||o.showModal())}async function oe(e){try{return typeof navigator>"u"||navigator.clipboard===void 0?!1:(await navigator.clipboard.writeText(e),!0)}catch{return!1}}var ne=f`
  .cf-bar {
    flex: none; position: sticky; bottom: calc(-1 * var(--cf-pad, 16px)); z-index: 6;
    display: flex; align-items: center; gap: 8px; min-height: 36px;
    margin: auto calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px));
    padding: 0 calc(var(--cf-pad, 16px) - 8px) 0 var(--cf-pad, 16px);
    background: var(--wa-top, var(--wa-card)); border-top: 1px solid var(--wa-line);
    font-size: 12px; color: var(--wa-muted);
  }
  .cf-text { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cf-help { margin-right: 10px; color: var(--error-color, var(--wa-need, #db4437)); }
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
`;var E=new Set;function W(e,t){return`${e}\0${t}`}function ce(e,t){E.add(W(e,t))}function A(e,t){return E.has(W(e,t))}function le(e,t,o){return e==="start"?!0:o!==void 0&&A(t,o)}function de(e){return e.saving||e.dirty?"":e.newWatch?N:""}function pe(e,t,o){return e&&t==="no_record"?{kind:"warn",text:_}:o}function ue(e="watch"){return n`<div class="pe-note nw-banner" role="note">${d("info")}<span>${k(e)}</span></div>`}function fe(e){return e===""?c:n`<span class="nw-why" role="status">${d("info")}<span>${e}</span></span>`}var he=f`
  .pe-note.nw-banner {
    flex: none;
    border-color: color-mix(in srgb, var(--wa-accent) 35%, var(--wa-line));
    background: color-mix(in srgb, var(--wa-accent) 6%, var(--wa-card));
  }
  .pe-note.nw-banner > svg.ui-icon { width: 15px; height: 15px; color: var(--wa-accent); flex: none; }
  .nw-why {
    display: inline-flex; align-items: center; gap: 5px; min-width: 0;
    font-size: 12px; color: var(--wa-muted); padding: 0 4px;
  }
  .nw-why > svg.ui-icon { width: 13px; height: 13px; flex: none; }
  .wa-bar.stacked .nw-why { white-space: normal; }
`;export{X as a,q as b,U as c,G as d,Q as e,D as f,Y as g,Z as h,ee as i,te as j,oe as k,ne as l,ce as m,le as n,de as o,pe as p,ue as q,fe as r,he as s};
