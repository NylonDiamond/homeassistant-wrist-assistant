import{a as f}from"./chunk-JRCCGBND.js";import{b as h,c as s,f as d,i as m,j as u,k as l}from"./chunk-CLIPI7G6.js";import{a as r}from"./chunk-LO2NM3CE.js";var v={rectangular:"Rectangular",circular:"Circular",corner:"Corner",inline:"Inline",small:"Small tile",medium:"Medium tile",large:"Large tile",xlarge:"Extra large tile"},o=class extends m{constructor(){super(...arguments);this.asked=!1}setConfig(e){this.config=e}updated(){this.hass&&!this.asked&&(this.asked=!0,f(this.hass).then(e=>{this.designs=e}).catch(e=>{this.loadError=String(e?.message??e)}))}emit(e){this.config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}chosen(){let e=this.config;if(!e||!this.designs)return;let i=(e.complication??"").toUpperCase();return this.designs.find(n=>n.owner_watch_id===e.owner&&n.complication_id===i)??this.designs.find(n=>n.complication_id===i)}pickDesign(e){let i=this.designs?.find(a=>`${a.owner_watch_id}|${a.complication_id}`===e);if(!i||!this.config)return;let n={...this.config,owner:i.owner_watch_id,complication:i.complication_id};(n.shape===void 0||!i.families.includes(n.shape))&&(i.families[0]!==void 0?n.shape=i.families[0]:delete n.shape),this.emit(n)}render(){if(this.loadError)return s`<p class="error">Could not list complications: ${this.loadError}</p>`;if(!this.designs||!this.config)return s`<p class="quiet">Loading complications…</p>`;if(this.designs.length===0)return s`<p class="quiet">No complications yet. Make one in the Wrist Assistant panel first.</p>`;let e=this.chosen(),i=new Map;for(let t of this.designs){let c=i.get(t.owner_name)??[];c.push(t),i.set(t.owner_name,c)}let n=e?`${e.owner_watch_id}|${e.complication_id}`:"",a=this.config;return s`
      <label>
        <span>Complication</span>
        <select @change=${t=>this.pickDesign(t.target.value)}>
          ${e?d:s`<option value="" selected disabled>Pick a complication</option>`}
          ${[...i].map(([t,c])=>s`<optgroup label=${t}>
            ${c.map(p=>{let g=`${p.owner_watch_id}|${p.complication_id}`;return s`<option value=${g} ?selected=${g===n}>${p.name||"Untitled"}</option>`})}
          </optgroup>`)}
        </select>
      </label>
      ${e&&e.families.length>1?s`<label>
            <span>Shape</span>
            <select @change=${t=>this.emit({...a,shape:t.target.value})}>
              ${e.families.map(t=>s`<option value=${t} ?selected=${t===a.shape}>${v[t]??t}</option>`)}
            </select>
          </label>`:d}
      <label class="check">
        <input type="checkbox" .checked=${a.taps!==!1}
          @change=${t=>this.emit({...a,taps:t.target.checked})} />
        <span>Taps run, the way they do on the watch</span>
      </label>
      <label class="check">
        <input type="checkbox" .checked=${a.background!=="none"}
          @change=${t=>this.emit({...a,background:t.target.checked?"card":"none"})} />
        <span>Card background</span>
      </label>
      <p class="quiet">Taps that only the watch can do, such as opening a page, do nothing here.</p>
    `}static{this.styles=h`
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
  `}};r([u({attribute:!1})],o.prototype,"hass",2),r([l()],o.prototype,"config",2),r([l()],o.prototype,"designs",2),r([l()],o.prototype,"loadError",2);customElements.get("wa-dashboard-card-editor")||customElements.define("wa-dashboard-card-editor",o);export{o as WaDashboardCardEditor};
