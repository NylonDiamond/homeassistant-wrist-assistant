import{b as d,c as b,d as o,g as r,i as s}from"./chunk-42FCO4AZ.js";import{ba as h,ca as u}from"./chunk-IMQFC3XQ.js";var l="New watch, not saved yet",p="New iPhone, not saved yet",w="Not saved yet",c=class{constructor(t){this.owner=t}get root(){return this.box?.shadowRoot??void 0}draw(t,e){if(t===void 0){this.clear();return}let a=this.box;if(a===void 0){a=document.createElement("div"),a.className="wa-head-bar";let i=a.attachShadow({mode:"open"});b(i,this.owner.constructor.elementStyles),this.box=a}a.parentNode!==t&&t.append(a),s(e(),a.shadowRoot,{host:this.owner})}clear(){let t=this.box;t!==void 0&&(this.box=void 0,t.shadowRoot&&s(r,t.shadowRoot,{host:this.owner}),t.remove())}holds(t){let e=this.root;return e!==void 0&&t.includes(e)}query(t,e){return(this.root??t).querySelector(e)}};function x(n){if(n.newWatch){let e=n.device??"watch",a=h(e),i=n.dirty?a:`${a} ${u}`;return o`<span class="tb-status new" role="status" title=${i}><i class="tb-status-dot" aria-hidden="true"></i><span class="tb-long">${e==="iphone"?p:l}</span><span class="tb-short" aria-hidden="true">${w}</span></span>`}if(n.dirty){let e=n.changes,a=e===void 0||e<=0?"Unsaved changes":`${e} ${e===1?"change":"changes"}`;return o`<span class="tb-status unsaved" role="status" title="Not saved yet"><i class="tb-status-dot" aria-hidden="true"></i><span>${a}</span></span>`}let t=n.saved;return t===void 0||t===r||t===""?r:o`<span class="tb-status" role="status">${t}</span>`}var g=d`
  .wa-bar.in-head {
    display: flex; align-items: center; justify-content: flex-end; flex-wrap: nowrap; gap: 8px;
    min-height: 0; padding: 0; margin: 0; border: 0; background: none; position: static; z-index: auto;
  }
  .wa-bar.in-head > .spacer { display: none; }
  .wa-bar.in-head > * { margin-block: 0; }
  .wa-bar.in-head :is(button.tb-btn, button.help, button.cv-act, button.cm-btn, button.primary.save, button.primary) {
    height: 32px; min-height: 32px; box-sizing: border-box; border-radius: 9px; flex: none;
    font: inherit; font-size: 12.5px; font-weight: 500; cursor: pointer;
    border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-ink); box-shadow: none;
  }
  .wa-bar.in-head :is(button.tb-btn, button.cm-btn) { padding: 0 11px; }
  .wa-bar.in-head :is(button.help, button.tb-btn.icon, button.cv-act.icon, button.tb-btn.tb-more) {
    width: 32px; padding: 0; display: inline-grid; place-items: center;
  }
  .wa-bar.in-head button.tb-btn.tb-more { letter-spacing: .04em; }
  .wa-bar.in-head :is(button.tb-btn, button.help, button.cv-act, button.cm-btn, button.primary):hover:not(:disabled) {
    background: var(--wa-hover); border-color: var(--wa-line-strong);
  }
  .wa-bar.in-head :is(button.tb-btn, button.help, button.cv-act, button.cm-btn, button.primary):focus-visible {
    outline: none; box-shadow: var(--wa-ring);
  }
  .wa-bar.in-head :is(button.tb-btn, button.cv-act, button.cm-btn):disabled { opacity: .45; cursor: default; }
  .wa-bar.in-head button.primary.save { padding: 0 16px; color: var(--wa-faint); opacity: 1; }
  .wa-bar.in-head button.primary.save:disabled { cursor: default; }
  .wa-bar.in-head button.primary.save.dirty:not(:disabled) {
    color: var(--wa-ink); background: var(--wa-card); border-color: var(--wa-hue-green); box-shadow: none;
  }
  .wa-bar.in-head button.primary.save.dirty:not(:disabled):hover { background: var(--wa-hover); }
  .wa-bar.in-head button.primary.save.dirty:not(:disabled):focus-visible { box-shadow: var(--wa-ring); }
  .wa-bar.in-head .tb-sync { height: 32px; font-size: 12px; font-weight: 500; max-width: none; }
  .wa-bar.in-head .tb-status {
    display: inline-flex; align-items: center; gap: 7px; min-width: 0;
    font-size: 12px; line-height: 1.3; color: var(--wa-muted); overflow-wrap: anywhere;
  }
  .wa-bar.in-head .tb-status .cf-saved { margin: 0; font-size: inherit; color: inherit; }
  .wa-bar.in-head .tb-status-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--wa-muted); }
  .wa-bar.in-head .tb-status:is(.new, .unsaved) { color: var(--wa-hue-orange); }
  .wa-bar.in-head .tb-status:is(.new, .unsaved) .tb-status-dot { background: var(--wa-hue-orange); }
  .wa-bar.in-head .tb-status > .tb-short { display: none; }
  .wa-bar.in-head .tb-note { font-size: 12px; color: var(--wa-muted); min-width: 0; overflow-wrap: anywhere; }
  .wa-bar.in-head .pop-menu { z-index: 60; }
  /* A phone: the bar sits beside the watch on the first line and may take
     two lines of its own, the buttons on top and the words under them. */
  @media (max-width: 640px) {
    .wa-bar.in-head { flex-wrap: wrap; gap: 4px 6px; }
    .wa-bar.in-head::before { content: ""; order: 1; flex: 0 0 100%; height: 0; }
    .wa-bar.in-head > :is(.tb-status, .tb-sync, .tb-note) { order: 2; flex: 0 1 auto; text-align: right; }
    .wa-bar.in-head .tb-sync { height: auto; }
    .wa-bar.in-head .tb-status { white-space: nowrap; }
    .wa-bar.in-head .tb-status > .tb-long { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    .wa-bar.in-head .tb-status > .tb-short { display: inline; }
  }
`;export{c as a,x as b,g as c};
