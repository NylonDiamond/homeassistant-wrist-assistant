import{a as f,b as v,c as n,d as b,e as g,f as w,g as x,l as y}from"./chunk-OQX67SC5.js";import{a as m}from"./chunk-QXUCCQBN.js";import"./chunk-M4YGM7CY.js";import"./chunk-H5K3BM3D.js";import"./chunk-4NI3O7TX.js";import"./chunk-UPANJPAF.js";import"./chunk-ESIOP3D4.js";import"./chunk-ZKYND2IQ.js";import{b as p,d as s,g as o,j as c,k as l,l as u,mh as h}from"./chunk-VWIMYR2L.js";import"./chunk-Q6MTLD6E.js";import{a}from"./chunk-LO2NM3CE.js";var i=class extends c{constructor(){super(...arguments);this.owners=[];this.narrow=!1;this.store=new m(()=>this.hass,()=>this.requestUpdate())}connectedCallback(){super.connectedCallback(),this.hass&&this.store.refreshList()}willUpdate(){this.hass&&this.store.ensureList()}async deleteOne(e){if(this.store.deleting||n(e)!==void 0||!window.confirm(b))return;let t=await this.store.remove(e.id);this.note=t?{kind:"ok",text:"Photo deleted."}:{kind:"err",text:`Not deleted. ${this.store.error??""}`.trim()}}render(){let e=this.store,t=e.list?.images??[];return s`<div class="lb-wrap">
      <div class="lb-head">
        <h2>Photos ${e.listState==="ready"?s`<span class="lb-count">${t.length}</span>`:o}</h2>
        <p class="lb-lead">${g}</p>
      </div>
      ${this.note?s`<div class="lb-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
        <button class="lb-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:o}
      ${this.renderBody(t)}
    </div>`}renderBody(e){let t=this.store.listState;return t==="none"?s`<div class="lb-empty">${x}</div>`:t==="failed"&&this.store.list===void 0?s`<div class="lb-empty"><span>Could not read the photos.</span>
        <button class="lb-btn" @click=${()=>{this.store.refreshList()}}>Try again</button></div>`:this.store.list===void 0?s`<div class="lb-empty">Loading…</div>`:e.length===0?s`<div class="lb-empty">${w}</div>`:s`<div class="lp-grid" role="list">${e.map(r=>this.renderPhoto(r))}</div>`}renderPhoto(e){let t=this.store.url(e.id),r=n(e),d=f(e,this.owners);return s`<div class="lp-card" role="listitem">
      <div class="lp-pic" style=${t===void 0?o:`background-image:url("${t}")`} aria-hidden="true"></div>
      <div class="lp-text">
        <span class="lp-use ${r===void 0?"":"on"}">${d}</span>
        <span class="lp-facts">${v(e)}</span>
      </div>
      <button class="lb-btn danger" ?disabled=${r!==void 0||this.store.deleting}
        title=${r??"Delete this photo"} aria-label=${`Delete the photo: ${d}`}
        @click=${()=>{this.deleteOne(e)}}>${h("delete")}<span>Delete</span></button>
    </div>`}static{this.styles=[y,p`
    .lp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
    .lp-card {
      display: flex; flex-direction: column; gap: 8px; padding: 8px; min-width: 0;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-card);
    }
    .lp-pic { aspect-ratio: 4 / 3; border-radius: 8px; background: var(--wa-field) center / cover no-repeat; border: 1px solid var(--wa-line); }
    .lp-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .lp-use { font-size: 13px; font-weight: 500; overflow-wrap: anywhere; }
    .lp-use:not(.on) { color: var(--wa-muted); }
    .lp-facts { font-size: 11.5px; color: var(--wa-muted); overflow-wrap: anywhere; }
    .lp-card > .lb-btn { align-self: flex-start; }
  `]}};a([l({attribute:!1})],i.prototype,"hass",2),a([l({attribute:!1})],i.prototype,"owners",2),a([l({type:Boolean,reflect:!0})],i.prototype,"narrow",2),a([u()],i.prototype,"note",2);customElements.get("wa-library-photos")||customElements.define("wa-library-photos",i);export{i as WaLibraryPhotos};
