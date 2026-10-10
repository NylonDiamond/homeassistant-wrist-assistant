import{a as x,d as $}from"./chunk-KKI2WHGP.js";import{d as w}from"./chunk-RXPR4G4B.js";import{c as u}from"./chunk-27EDJACI.js";import{b as f,c as a,f as h,i as v,j as b,k as g}from"./chunk-CLIPI7G6.js";import"./chunk-Y7BCKNLD.js";import{a as p}from"./chunk-LO2NM3CE.js";var k={rectangular:"Rectangular",circular:"Circular",corner:"Corner",inline:"Inline",small:"Small tile",medium:"Medium tile",large:"Large tile",xlarge:"Extra large tile",dashboard:"Dashboard card"},y="Made for dashboards",C=3,_=12;function m(o){return`${o.owner_watch_id}|${o.complication_id}|${o.revision}`}function T(o,d){let e=d.trim().toLocaleLowerCase();return e?o.filter(t=>(t.name||"Untitled").toLocaleLowerCase().includes(e)):[...o]}function R(o){let d=new Map,e=o.filter(t=>t.families.includes("dashboard"));e.length>0&&d.set(y,e);for(let t of o){if(t.families.includes("dashboard"))continue;let i=d.get(t.owner_name)??[];i.push(t),d.set(t.owner_name,i)}return[...d]}var l=class extends v{constructor(){super(...arguments);this.filter="";this.asked=!1;this.thumbs=new Map;this.thumbRun=0}connectedCallback(){super.connectedCallback(),this.designs&&this.loadThumbs(this.designs)}disconnectedCallback(){super.disconnectedCallback(),this.thumbRun++;for(let e of this.thumbs.values())URL.revokeObjectURL(e);this.thumbs.clear()}setConfig(e){this.config=e}updated(){this.hass&&!this.asked&&(this.asked=!0,x(this.hass).then(e=>{if(this.designs=e,this.loadThumbs(e),this.config){let t=u(this.config,this.chosen());t!==this.config&&this.emit(t)}}).catch(e=>{this.loadError=String(e?.message??e)}))}async loadThumbs(e){let t=this.hass;if(!t)return;let i=++this.thumbRun,r=e.filter(n=>n.preview&&!this.thumbs.has(m(n))),s=async()=>{for(let n=r.shift();n&&i===this.thumbRun;n=r.shift())try{let c=await $(t,n.owner_watch_id,n.complication_id,n.revision);if(i!==this.thumbRun)return;this.thumbs.set(m(n),URL.createObjectURL(w(c))),this.requestUpdate()}catch{}};await Promise.all(Array.from({length:C},s))}emit(e){this.config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}chosen(){let e=this.config;if(!e||!this.designs)return;let t=(e.complication??"").toUpperCase();return this.designs.find(i=>i.owner_watch_id===e.owner&&i.complication_id===t)??this.designs.find(i=>i.complication_id===t)}pickDesign(e){let t=this.designs?.find(r=>`${r.owner_watch_id}|${r.complication_id}`===e);if(!t||!this.config)return;let i={...this.config,owner:t.owner_watch_id,complication:t.complication_id};(i.shape===void 0||!t.families.includes(i.shape))&&(t.families[0]!==void 0?i.shape=t.families[0]:delete i.shape),this.emit(u(i,t))}pickShape(e){this.config&&this.emit(u({...this.config,shape:e},this.chosen()))}render(){if(this.loadError)return a`<p class="error">Could not list complications: ${this.loadError}</p>`;if(!this.designs||!this.config)return a`<p class="quiet">Loading complications…</p>`;if(this.designs.length===0)return a`<p class="quiet">No complications yet. Make one in the Wrist Assistant panel first.</p>`;let e=this.chosen(),t=e?`${e.owner_watch_id}|${e.complication_id}`:"",i=this.config,r=T(this.designs,this.filter);return a`
      <div class="pick" role="group" aria-label="Complication">
        <span>Complication</span>
        ${this.designs.length>_?a`<input class="filter" type="search" placeholder="Filter by name" .value=${this.filter}
              @input=${s=>{this.filter=s.target.value}} />`:h}
        ${r.length===0?a`<p class="quiet">No complication is named like that.</p>`:h}
        ${R(r).map(([s,n])=>a`<div class="group">
          <h4>${s}</h4>
          <div class="tiles">${n.map(c=>this.renderTile(c,t))}</div>
        </div>`)}
      </div>
      ${e&&e.families.length>1?a`<label>
            <span>Shape</span>
            <select @change=${s=>this.pickShape(s.target.value)}>
              ${e.families.map(s=>a`<option value=${s} ?selected=${s===i.shape}>${k[s]??s}</option>`)}
            </select>
          </label>`:h}
      <label class="check">
        <input type="checkbox" .checked=${i.taps!==!1}
          @change=${s=>this.emit({...i,taps:s.target.checked})} />
        <span>Taps run, the way they do on the watch</span>
      </label>
      <label class="check">
        <input type="checkbox" .checked=${i.background!=="none"}
          @change=${s=>this.emit({...i,background:s.target.checked?"card":"none"})} />
        <span>Card background</span>
      </label>
      ${i.shape==="dashboard"&&i.canvas?a`<p class="quiet">Sized ${Math.round(i.canvas.width)} × ${Math.round(i.canvas.height)} points in the panel. It starts at that size on a sections dashboard, and is drawn at its own proportions at any size.</p>`:h}
      <p class="quiet">Taps that only the watch can do, such as opening a page, starting a timer, adding a to-do or running an HTTP action, do nothing here.</p>
    `}renderTile(e,t){let i=`${e.owner_watch_id}|${e.complication_id}`,r=this.thumbs.get(m(e)),s=e.preview,n;if(r&&s?.focus){let c=s.focus;n=a`<svg class="pic" viewBox=${`${c.cx-c.diameter/2} ${c.cy-c.diameter/2} ${c.diameter} ${c.diameter}`}
        aria-hidden="true"><image href=${r} width=${s.width} height=${s.height} preserveAspectRatio="none"></image></svg>`}else r?n=a`<img class="pic" src=${r} alt="" />`:n=a`<span class="pic blank">${k[e.families[0]??""]??""}</span>`;return a`<button type="button" class="tile" aria-pressed=${i===t?"true":"false"}
      @click=${()=>this.pickDesign(i)}>${n}<span class="name">${e.name||"Untitled"}</span></button>`}static{this.styles=f`
    :host {
      display: grid;
      gap: 12px;
      color: var(--primary-text-color);
    }
    label {
      display: grid;
      gap: 4px;
      font-size: 14px;
    }
    label.check {
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 8px;
    }
    .pick {
      display: grid;
      gap: 4px;
      font-size: 14px;
    }
    .group h4 {
      margin: 8px 0 4px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
      gap: 8px;
    }
    .tile {
      display: grid;
      justify-items: center;
      gap: 6px;
      padding: 8px;
      font: inherit;
      font-size: 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .tile[aria-pressed="true"] {
      border-color: var(--primary-color, #03a9f4);
      box-shadow: 0 0 0 1px var(--primary-color, #03a9f4);
    }
    .tile .pic {
      width: 88px;
      height: 88px;
      object-fit: contain;
    }
    .tile .blank {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: var(--secondary-background-color, #eee);
      color: var(--secondary-text-color);
      text-align: center;
    }
    .tile .name {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .filter,
    select {
      font: inherit;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .quiet {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin: 0;
    }
    .error {
      color: var(--error-color, #db4437);
    }
  `}};p([b({attribute:!1})],l.prototype,"hass",2),p([g()],l.prototype,"config",2),p([g()],l.prototype,"designs",2),p([g()],l.prototype,"loadError",2),p([g()],l.prototype,"filter",2);customElements.get("wa-dashboard-card-editor")||customElements.define("wa-dashboard-card-editor",l);export{l as WaDashboardCardEditor,R as designGroups,T as filterDesigns};
