import{a as v}from"./chunk-JRCCGBND.js";import{c as d}from"./chunk-27EDJACI.js";import{b as u,c as n,f as c,i as m,j as f,k as l}from"./chunk-CLIPI7G6.js";import"./chunk-Y7BCKNLD.js";import{a as r}from"./chunk-LO2NM3CE.js";var $={rectangular:"Rectangular",circular:"Circular",corner:"Corner",inline:"Inline",small:"Small tile",medium:"Medium tile",large:"Large tile",xlarge:"Extra large tile",dashboard:"Dashboard card"},k="Made for dashboards";function w(p){let o=new Map,e=p.filter(i=>i.families.includes("dashboard"));e.length>0&&o.set(k,e);for(let i of p){if(i.families.includes("dashboard"))continue;let t=o.get(i.owner_name)??[];t.push(i),o.set(i.owner_name,t)}return[...o]}var a=class extends m{constructor(){super(...arguments);this.asked=!1}setConfig(e){this.config=e}updated(){this.hass&&!this.asked&&(this.asked=!0,v(this.hass).then(e=>{if(this.designs=e,this.config){let i=d(this.config,this.chosen());i!==this.config&&this.emit(i)}}).catch(e=>{this.loadError=String(e?.message??e)}))}emit(e){this.config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}chosen(){let e=this.config;if(!e||!this.designs)return;let i=(e.complication??"").toUpperCase();return this.designs.find(t=>t.owner_watch_id===e.owner&&t.complication_id===i)??this.designs.find(t=>t.complication_id===i)}pickDesign(e){let i=this.designs?.find(s=>`${s.owner_watch_id}|${s.complication_id}`===e);if(!i||!this.config)return;let t={...this.config,owner:i.owner_watch_id,complication:i.complication_id};(t.shape===void 0||!i.families.includes(t.shape))&&(i.families[0]!==void 0?t.shape=i.families[0]:delete t.shape),this.emit(d(t,i))}pickShape(e){this.config&&this.emit(d({...this.config,shape:e},this.chosen()))}render(){if(this.loadError)return n`<p class="error">Could not list complications: ${this.loadError}</p>`;if(!this.designs||!this.config)return n`<p class="quiet">Loading complications…</p>`;if(this.designs.length===0)return n`<p class="quiet">No complications yet. Make one in the Wrist Assistant panel first.</p>`;let e=this.chosen(),i=e?`${e.owner_watch_id}|${e.complication_id}`:"",t=this.config;return n`
      <label>
        <span>Complication</span>
        <select @change=${s=>this.pickDesign(s.target.value)}>
          ${e?c:n`<option value="" selected disabled>Pick a complication</option>`}
          ${w(this.designs).map(([s,b])=>n`<optgroup label=${s}>
            ${b.map(h=>{let g=`${h.owner_watch_id}|${h.complication_id}`;return n`<option value=${g} ?selected=${g===i}>${h.name||"Untitled"}</option>`})}
          </optgroup>`)}
        </select>
      </label>
      ${e&&e.families.length>1?n`<label>
            <span>Shape</span>
            <select @change=${s=>this.pickShape(s.target.value)}>
              ${e.families.map(s=>n`<option value=${s} ?selected=${s===t.shape}>${$[s]??s}</option>`)}
            </select>
          </label>`:c}
      <label class="check">
        <input type="checkbox" .checked=${t.taps!==!1}
          @change=${s=>this.emit({...t,taps:s.target.checked})} />
        <span>Taps run, the way they do on the watch</span>
      </label>
      <label class="check">
        <input type="checkbox" .checked=${t.background!=="none"}
          @change=${s=>this.emit({...t,background:s.target.checked?"card":"none"})} />
        <span>Card background</span>
      </label>
      ${t.shape==="dashboard"&&t.canvas?n`<p class="quiet">Sized ${Math.round(t.canvas.width)} × ${Math.round(t.canvas.height)} points in the panel. It starts at that size on a sections dashboard, and is drawn at its own proportions at any size.</p>`:c}
      <p class="quiet">Taps that only the watch can do, such as opening a page, do nothing here.</p>
    `}static{this.styles=u`
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
  `}};r([f({attribute:!1})],a.prototype,"hass",2),r([l()],a.prototype,"config",2),r([l()],a.prototype,"designs",2),r([l()],a.prototype,"loadError",2);customElements.get("wa-dashboard-card-editor")||customElements.define("wa-dashboard-card-editor",a);export{a as WaDashboardCardEditor,w as designGroups};
