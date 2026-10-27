import{a as ie,b as se,c as ae,d as re}from"./chunk-YCUDCAUE.js";import{c as ee,na as ne,oa as oe}from"./chunk-4MWW2D5X.js";import"./chunk-PHH55XEF.js";import"./chunk-U6Q7O7OZ.js";import{b as te}from"./chunk-SIZDPFO7.js";import{E as J,F as x,f as G,g as E,h as p,k as I,kc as W,l as T,o as D,p as X,r as V,s as j,t as q,u as B,v as Y,w as U,x as K,y as Q}from"./chunk-CW2MFPI6.js";import"./chunk-JFV4YI4N.js";import{$g as R,Ch as z,Mh as Z,a as _,ah as C,b as O,d as a,g,j as N,k as $,l as u,qh as M,rh as y,vh as F}from"./chunk-RA6AEJS2.js";import{db as k}from"./chunk-RCA6FBW6.js";import{a as l}from"./chunk-LO2NM3CE.js";function le(c){return{get:()=>R(c),save:(v,t)=>C(c,v,t)}}var pe="The map had changed on another device. Your change was saved on top of it.",me="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",he="The map changed again while saving, so your change was not saved. Try it once more.";function ue(c){return{doc:E(c?.doc)??null,rev:typeof c?.rev=="number"?c.rev:0}}function de(c,v){let t=q(c,v);if(t===void 0)return;let e=G(t);return e.ok?{doc:e.doc}:{text:`Not saved. ${e.message}.`}}async function ce(c,v,t){if(v.doc===null)return{ok:!1,text:"There is no map to change yet."};let e=de(v.doc,t);if(e===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in e)return{ok:!1,text:e.text};try{let i=await c.save(e.doc,v.rev);return{ok:!0,read:{doc:e.doc,rev:i.rev},merged:!1}}catch(i){let{code:s,message:m}=k(i);if(s!=="conflict")return{ok:!1,text:`Not saved. ${m}`}}let n;try{n=ue(await c.get())}catch(i){return{ok:!1,text:`Not saved. The map changed on another device and could not be read again: ${k(i).message}`}}let o=n.doc===null?void 0:de(n.doc,t);if(o===void 0)return{ok:!1,text:me,read:n};if("text"in o)return{ok:!1,text:o.text,read:n};try{let i=await c.save(o.doc,n.rev);return{ok:!0,read:{doc:o.doc,rev:i.rev},merged:!0}}catch(i){let{code:s,message:m}=k(i);return{ok:!1,text:s==="conflict"?he:`Not saved. ${m}`,read:n}}}var fe="The plan of your home from the iPhone's scan. Drag a pin to move it; click a room to name it, link its area and the page it opens on the watch.",ve="Update the Wrist Assistant integration to see the home map here.",ge="No home map yet. Scan your rooms with the Wrist Assistant app on an iPhone or iPad with LiDAR (the Pro models). The map shows here once it is saved.",xe=4,d=class extends N{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.unsupported=!1;this.loading=!1;this.saving=!1;this.loadSeq=0;this.askedOnce=!1}connectedCallback(){super.connectedCallback(),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),this.endDrag?.(),this.loadSeq++}willUpdate(t){!this.hass||!this.capable||this.askedOnce||(this.askedOnce=!0,this.load(),this.loadPages())}async load(t=!1){let e=this.hass;if(!e||!this.capable)return;let n=++this.loadSeq;t||(this.loading=this.read===void 0,this.loadError=void 0);try{let o=await R(e);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:E(o?.doc)??null,rev:typeof o?.rev=="number"?o.rev:0})}catch(o){if(n!==this.loadSeq)return;let{code:i,message:s}=k(o);i==="unknown_command"?this.unsupported=!0:(!t||this.read===void 0)&&(this.loadError=s)}this.loading=!1}async loadPages(){let t=this.hass;if(t)try{let e=ne(await ee(t));this.pages=oe(e,"pages").map(n=>({id:n.id,name:n.name}))}catch{this.pages=[]}}show(t){this.read=t,this.hass&&J(this.hass,t);let e=t.doc?.floors??[];e.some(n=>p(n.id,this.floorId))||(this.floorId=e[0]?.id),this.dropStaleSelection()}dropStaleSelection(){let t=this.floor(),e=this.selected;if(e===void 0)return;t!==void 0&&(e.kind==="pin"?t.pins.some(o=>p(o.id,e.id)):t.rooms.some(o=>p(o.id,e.id)))||(this.selected=void 0)}floor(){return this.read?.doc?.floors.find(t=>p(t.id,this.floorId))}async run(t,e){let n=this.hass,o=this.read;if(!n||o===void 0||this.saving)return!1;this.saving=!0,this.note=void 0,this.loadSeq++;let i=await ce(le(n),o,t);return this.saving=!1,this.moving=void 0,i.ok?(this.show(i.read),i.merged&&(this.note={kind:"warn",text:pe}),e!==void 0&&(this.selected=e??void 0),this.dropStaleSelection(),!0):(i.read!==void 0&&this.show(i.read),this.note={kind:"err",text:i.text},!1)}planPoint(t,e){let n=t.getScreenCTM();if(n===null)return;let o=new DOMPoint(e.clientX,e.clientY).matrixTransform(n.inverse());return[o.x,o.y]}onPlanDown(t){if(t.button!==0)return;let e=t.currentTarget,n=t.target,o=n?.closest("[data-pin]"),i=n?.closest("[data-room]");if(o==null){let h=i?.getAttribute("data-room")??void 0;this.selected=h===void 0?void 0:{kind:"room",id:h};return}let s=o.getAttribute("data-pin")??"",f=this.floor()?.pins.find(h=>p(h.id,s));if(f===void 0||this.saving){this.selected={kind:"pin",id:s};return}t.preventDefault(),this.endDrag?.();let P=this.planPoint(e,t);if(P===void 0)return;let r=t.clientX,b=t.clientY,S=!1;try{e.setPointerCapture(t.pointerId)}catch{}let L=h=>{if(h.pointerId!==t.pointerId||!S&&Math.hypot(h.clientX-r,h.clientY-b)<xe)return;S=!0;let w=this.planPoint(e,h);w!==void 0&&(this.moving={pinId:f.id,at:[f.at[0]+w[0]-P[0],f.at[1]+w[1]-P[1]]})},H=h=>{if(h.pointerId!==t.pointerId)return;A();let w=this.moving;if(!S||w===void 0){this.moving=void 0,this.selected={kind:"pin",id:f.id};return}this.run({kind:"movePin",pinId:f.id,at:w.at},{kind:"pin",id:f.id})},A=()=>{e.removeEventListener("pointermove",L),e.removeEventListener("pointerup",H),e.removeEventListener("pointercancel",H);try{e.releasePointerCapture(t.pointerId)}catch{}this.endDrag===A&&(this.endDrag=void 0)};e.addEventListener("pointermove",L),e.addEventListener("pointerup",H),e.addEventListener("pointercancel",H),this.endDrag=A}addPin(t){let e=this.floor();if(e===void 0||t==="")return Promise.resolve(!1);let n=this.selected,o=n?.kind==="room"?e.rooms.find(s=>p(s.id,n.id)):n?.kind==="pin"?(()=>{let s=e.pins.find(m=>p(m.id,n.id));return s===void 0?void 0:D(e,s)})():void 0,i=B(e,t,o,te);return this.run({kind:"addPin",floorId:e.id,pin:i},{kind:"pin",id:i.id})}removePin(t){return this.run({kind:"removePin",pinId:t},null)}renameRoom(t,e){let n=this.floor()?.rooms.find(o=>p(o.id,t));return n!==void 0&&(n.name??"")===e.trim().slice(0,100)?Promise.resolve(!0):this.run({kind:"renameRoom",roomId:t,name:e})}setRoomArea(t,e){return this.run({kind:"setRoomArea",roomId:t,areaId:e})}setRoomPage(t,e){return this.run({kind:"setRoomPage",roomId:t,pageId:e})}deleteRoom(t,e){return window.confirm(Q(t,Y(e,t.id)))?this.run({kind:"deleteRoom",roomId:t.id},null):Promise.resolve(!1)}render(){return a`
      <div class="hm-top">
        <p class="hm-lead">${fe}</p>
        ${this.note?a`<div class="hm-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="hm-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:g}
      </div>
      ${this.renderBody()}`}renderBody(){if(!this.capable||this.unsupported)return this.calm(a`<b>${ve}</b>`);if(this.loadError!==void 0)return this.calm(a`<span>Could not read the home map: ${this.loadError}</span>
        <button class="hm-btn" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.read===void 0)return this.calm(a`Loading…`);let t=this.read.doc;if(t===null||t.floors.length===0)return this.calm(a`<b>${ge}</b>`);let e=this.floor()??t.floors[0];return a`<div class="hm-edit">
      <section class="hm-stage">
        ${t.floors.length>1?this.renderFloors(t.floors,e):g}
        ${this.renderPlan(e)}
        <div class="hm-foot">
          <span>${j(V(e,this.hass?.states))}</span>
          <span>${e.rooms.length===1?"1 room":`${e.rooms.length} rooms`}, ${e.pins.length===1?"1 pin":`${e.pins.length} pins`}${this.saving?a` · Saving…`:g}</span>
        </div>
      </section>
      <div class="hm-side">
        ${this.renderSelection(e)}
        ${this.renderAdd(e)}
      </div>
    </div>`}calm(t){return a`<div class="hm-calm"><div class="hm-empty">${t}</div></div>`}renderFloors(t,e){return a`<div class="hm-floors" role="tablist" aria-label="Floors">${t.map(n=>a`<button type="button" role="tab"
      class="hm-floor ${n===e?"on":""}" aria-selected=${n===e?"true":"false"}
      @click=${()=>{this.floorId=n.id,this.selected=void 0}}>${I(n)}</button>`)}</div>`}renderPlan(t){let e=se(t);return a`<div class="hm-plan-well">
      <svg class="hm-plan" viewBox=${ae(t)} preserveAspectRatio="xMidYMid meet" role="img"
        aria-label=${`Plan of ${I(t)}`} style=${`aspect-ratio:${Math.round(e.width/e.height*1e3)/1e3}`}
        @pointerdown=${n=>this.onPlanDown(n)}>
        ${re(t,{states:this.hass?.states,icons:this.icons,names:!0,pins:"buttons",...this.selected===void 0?{}:{selected:this.selected},...this.moving===void 0?{}:{moving:this.moving}})}
      </svg>
    </div>`}secHead(t,e,n){return a`<div class="sec-h pinned">
      <span class="swatch">${t}</span>
      <span class="tt"><h4>${e}</h4>${n?a`<span class="sum">${n}</span>`:g}</span>
    </div>`}renderSelection(t){let e=this.selected;if(e?.kind==="pin"){let n=t.pins.find(o=>p(o.id,e.id));if(n!==void 0)return this.renderPin(t,n)}if(e?.kind==="room"){let n=t.rooms.find(o=>p(o.id,e.id));if(n!==void 0)return this.renderRoom(t,n)}return a`<section class="sec" style=${`--c:${M.content}`}>
      ${this.secHead(y("home"),"Rooms and pins")}
      <div class="sec-b"><p class="hint keep">Click a room to change it, or a pin to see its device. Drag a pin to move it; it saves when you let go.</p></div>
    </section>`}renderRoom(t,e){let n=U(this.hass),o=this.pages??[],i=this.saving,s=e.areaId,m=e.pageId,f=s===void 0||n.some(r=>r.id===s),P=m===void 0||o.some(r=>p(r.id,m));return a`<section class="sec" style=${`--c:${M.content}`}>
      ${this.secHead(y("home"),T(e),"Room")}
      <div class="sec-b">
        <label class="field"><span>Name</span>
          <input type="text" maxlength="100" .value=${x(e.name??"")} placeholder="Room" ?disabled=${i}
            @change=${r=>{this.renameRoom(e.id,r.target.value)}} /></label>
        <label class="field"><span>Area</span>
          <select ?disabled=${i} @change=${r=>{let b=r.target.value;this.setRoomArea(e.id,b===""?void 0:b)}}>
            <option value="" .selected=${x(s===void 0)}>None</option>
            ${f?g:a`<option value=${s} .selected=${x(!0)} disabled>Not in Home Assistant (${s})</option>`}
            ${n.map(r=>a`<option value=${r.id} .selected=${x(r.id===s)}>${r.name}</option>`)}
          </select></label>
        <p class="hint keep">The Home Assistant area this room is. The iPhone lists its devices to place.</p>
        <label class="field"><span>Page</span>
          <select ?disabled=${i} @change=${r=>{let b=r.target.value;this.setRoomPage(e.id,b===""?void 0:b)}}>
            <option value="" .selected=${x(m===void 0)}>None</option>
            ${P?g:a`<option value=${m} .selected=${x(!0)} disabled>Not in your pages</option>`}
            ${o.map(r=>a`<option value=${r.id} .selected=${x(p(r.id,m))}>${r.name}</option>`)}
          </select></label>
        <p class="hint keep">The page a tap on this room opens on the watch.</p>
        <div class="hm-row">
          <button class="hm-btn danger" ?disabled=${i} @click=${()=>{this.deleteRoom(e,t)}}>${y("delete")}<span>Delete room</span></button>
        </div>
      </div>
    </section>`}renderPin(t,e){let n=X(e.entityId,this.hass?.states),o=D(t,e),i=this.hass?.states?.[e.entityId]?.state;return a`<section class="sec" style=${`--c:${M.tap}`}>
      ${this.secHead(y("place"),K(e,this.hass),"Pin")}
      <div class="sec-b">
        <dl class="hm-facts">
          <dt>Entity</dt><dd class="mono">${e.entityId}</dd>
          <dt>State</dt><dd>${n.kind==="gone"?a`<span class="hm-gone">Not in Home Assistant right now. The pin stays, drawn gray.</span>`:String(i??"")}</dd>
          <dt>Room</dt><dd>${o===void 0?"None":T(o)}</dd>
          <dt>Height</dt><dd>${e.at[2]} m</dd>
        </dl>
        <p class="hint keep">Drag the pin on the plan to move it. Its height is set on the iPhone.</p>
        <div class="hm-row">
          <button class="hm-btn danger" ?disabled=${this.saving} @click=${()=>{this.removePin(e.id)}}>${y("delete")}<span>Remove pin</span></button>
        </div>
      </div>
    </section>`}renderAdd(t){let e=this.selected,n=e?.kind==="room"?t.rooms.find(s=>p(s.id,e.id)):void 0,o={entityId:"",displayName:"",domain:""},i=this.hass;return a`<section class="sec" style=${`--c:${M.numbers}`}>
      ${this.secHead(y("plus"),"Add a pin")}
      <div class="sec-b">
        ${i===void 0?g:W({hass:i},"Entity",o,s=>{s.entityId!==""&&!this.saving&&this.addPin(s.entityId)},"home-map-add",{clearable:!1})}
        <p class="hint keep">${n===void 0?"The pin goes in the middle of the floor; drag it into place. Select a room first to put it there.":`The pin goes in the middle of ${T(n)}; drag it into place.`}</p>
      </div>
    </section>`}static{this.styles=[Z,F,z,O`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --hm-pad: 16px;
      padding: var(--hm-pad);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h4, p { margin: 0; }
    .hm-top { flex: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
    .hm-lead { font-size: 13px; color: var(--wa-muted); }
    .hm-note {
      display: flex; align-items: center; gap: 10px; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .hm-note > span { flex: 1; min-width: 0; }
    .hm-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .hm-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .hm-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
    .hm-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 30px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap;
    }
    .hm-btn:hover:not(:disabled) { background: var(--wa-hover); }
    .hm-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .hm-btn:disabled { opacity: .5; cursor: default; }
    .hm-btn.danger { color: var(--wa-need); }
    .hm-calm { flex: 1 1 auto; min-height: 280px; display: flex; align-items: center; justify-content: center; padding: 24px 0; }
    .hm-empty {
      display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; max-width: 520px;
      padding: 28px 24px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .hm-empty > b { font-size: 15px; }

    /* The plan on the left, the selection and the add beside it. */
    .hm-edit { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr); gap: 12px; align-items: start; }
    .hm-stage {
      display: flex; flex-direction: column; gap: 10px; min-width: 0; padding: 10px;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: ${_(ie.ground)};
    }
    .hm-floors { display: flex; flex-wrap: wrap; gap: 6px; }
    button.hm-floor {
      height: 28px; padding: 0 12px; border-radius: 6px; cursor: pointer; font: inherit; font-size: 13px; font-weight: 500;
      color: rgba(255, 255, 255, .7); background: transparent; border: 1px solid rgba(255, 255, 255, .22);
    }
    button.hm-floor.on { color: #fff; font-weight: 600; background: rgba(255, 255, 255, .12); }
    .hm-plan-well { display: flex; justify-content: center; min-width: 0; }
    svg.hm-plan { display: block; width: 100%; max-height: min(66vh, 680px); touch-action: none; user-select: none; }
    svg.hm-plan .hm-room { cursor: pointer; }
    svg.hm-plan .hm-pin { cursor: grab; }
    svg.hm-plan .hm-pin:active { cursor: grabbing; }
    svg.hm-plan text { font-family: inherit; font-weight: 600; }
    .hm-foot { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; font-size: 12.5px; color: rgba(255, 255, 255, .72); padding: 0 4px; }
    .hm-side { display: flex; flex-direction: column; min-width: 0; }
    .hm-side .sec { margin: 0 0 12px; }
    .hm-side .sec-b { display: flex; flex-direction: column; gap: 8px; }
    .hm-side .sec-b > .hint { margin: 0; font-size: 12.5px; color: var(--wa-muted); }
    .hm-row { display: flex; flex-wrap: wrap; gap: 8px; }
    dl.hm-facts { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 4px 12px; margin: 0; font-size: 13px; }
    dl.hm-facts dt { color: var(--wa-muted); }
    dl.hm-facts dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
    .hm-gone { color: var(--wa-need); }
    .mono { font-family: var(--wa-mono, ui-monospace, monospace); font-size: 12.5px; }

    @container (max-width: 820px) {
      .hm-edit { grid-template-columns: minmax(0, 1fr); }
    }
    :host([narrow]) { --hm-pad: 12px; }
  `]}};l([$({attribute:!1})],d.prototype,"hass",2),l([$({type:Boolean,reflect:!0})],d.prototype,"narrow",2),l([$({attribute:!1})],d.prototype,"icons",2),l([$({attribute:!1})],d.prototype,"iconsTick",2),l([$({attribute:!1})],d.prototype,"capable",2),l([u()],d.prototype,"read",2),l([u()],d.prototype,"unsupported",2),l([u()],d.prototype,"loading",2),l([u()],d.prototype,"loadError",2),l([u()],d.prototype,"note",2),l([u()],d.prototype,"saving",2),l([u()],d.prototype,"floorId",2),l([u()],d.prototype,"selected",2),l([u()],d.prototype,"moving",2),l([u()],d.prototype,"pages",2);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",d);export{ge as HOME_MAP_EMPTY_TEXT,fe as HOME_MAP_LEAD,ve as HOME_MAP_UPDATE_TEXT,d as WaHomeMapEditor};
