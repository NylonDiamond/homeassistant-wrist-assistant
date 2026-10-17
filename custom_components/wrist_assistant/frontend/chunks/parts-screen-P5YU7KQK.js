import{h as v,i as u,j as b,k as g,l as w}from"./chunk-OQX67SC5.js";import{b as p}from"./chunk-BNNCLRIG.js";import"./chunk-ZKYND2IQ.js";import{b as c,d as t,eg as m,g as d,gg as f,j as h,k as n,l as r,mh as o}from"./chunk-VWIMYR2L.js";import"./chunk-Q6MTLD6E.js";import{a}from"./chunk-LO2NM3CE.js";var i=class extends h{constructor(){super(...arguments);this.narrow=!1;this.parts=[];this.listState="loading";this.asked=!1;this.seq=0}connectedCallback(){super.connectedCallback(),this.asked=!1}willUpdate(){this.hass&&!this.asked&&(this.asked=!0,this.load())}async load(){let e=this.hass;if(!e)return;let l=++this.seq;try{let s=await m(e);if(l!==this.seq)return;this.parts=Array.isArray(s?.parts)?s.parts:[],this.listState="ready"}catch(s){if(l!==this.seq)return;this.listState=p(s).code==="unknown_command"?"none":"failed"}}async deleteOne(e){let l=this.hass;if(!(!l||this.deleting!==void 0)&&window.confirm(u(e.name))){this.deleting=e.id;try{await f(l,e.id),this.parts=this.parts.filter(s=>s.id!==e.id),this.note={kind:"ok",text:`Deleted "${e.name}".`},this.onDeleted?.(e.id)}catch(s){this.note={kind:"err",text:`Not deleted. ${p(s).message}`}}finally{this.deleting=void 0}}}render(){return t`<div class="lb-wrap">
      <div class="lb-head">
        <h2>Parts ${this.listState==="ready"?t`<span class="lb-count">${this.parts.length}</span>`:d}</h2>
        <p class="lb-lead">${b}</p>
      </div>
      ${this.note?t`<div class="lb-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
        <button class="lb-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:d}
      ${this.renderBody()}
    </div>`}renderBody(){return this.listState==="none"?t`<div class="lb-empty">Update the integration to see the home's parts here.</div>`:this.listState==="failed"?t`<div class="lb-empty"><span>Could not read the parts.</span>
        <button class="lb-btn" @click=${()=>{this.listState="loading",this.load()}}>Try again</button></div>`:this.listState==="loading"?t`<div class="lb-empty">Loading…</div>`:this.parts.length===0?t`<div class="lb-empty">${g}</div>`:t`<div class="lq-list" role="list">${this.parts.map(e=>t`<div class="lq-row" role="listitem">
      <span class="lq-ic" aria-hidden="true">${o("layers")}</span>
      <span class="lq-text"><b>${e.name}</b><small>${v(e)}</small></span>
      <button class="lb-btn danger" ?disabled=${this.deleting!==void 0} aria-label=${`Delete ${e.name}`}
        @click=${()=>{this.deleteOne(e)}}>${o("delete")}<span>${this.deleting===e.id?"Deleting\u2026":"Delete"}</span></button>
    </div>`)}</div>`}static{this.styles=[w,c`
    .lq-list { display: flex; flex-direction: column; border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-card); }
    .lq-row { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-top: 1px solid var(--wa-line); }
    .lq-row:first-child { border-top: 0; }
    .lq-ic {
      width: 32px; height: 32px; flex: none; display: grid; place-items: center; border-radius: 8px;
      color: var(--wa-hue-yellow); background: var(--wa-field); border: 1px solid var(--wa-line);
    }
    .lq-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .lq-text b { font-size: 13px; font-weight: 500; overflow-wrap: anywhere; }
    .lq-text small { font-size: 11.5px; color: var(--wa-muted); overflow-wrap: anywhere; }
  `]}};a([n({attribute:!1})],i.prototype,"hass",2),a([n({type:Boolean,reflect:!0})],i.prototype,"narrow",2),a([n({attribute:!1})],i.prototype,"onDeleted",2),a([r()],i.prototype,"parts",2),a([r()],i.prototype,"listState",2),a([r()],i.prototype,"deleting",2),a([r()],i.prototype,"note",2);customElements.get("wa-library-parts")||customElements.define("wa-library-parts",i);export{i as WaLibraryParts};
