import{b as ce,c as de,e as E}from"./chunk-KKI2WHGP.js";import{a as Y,c as ne,d as oe,g as re,i as ae}from"./chunk-6IYIHKWW.js";import{D as X,M as J,Q,S as Z,T as W,aa as ee,ba as te,da as ie,qa as se}from"./chunk-NHBSDOHH.js";import{$g as D,Gb as _,Hb as M,Id as O,Xf as q,Xg as j,Yf as V,Yg as z,Zg as G,_g as B,ah as K,bh as U,dd as H,n as T,o as L,od as N,pd as g,u as P}from"./chunk-KJ3D23XB.js";import{b as F,c as d,d as I,f as v,i as A,j as b,k as p}from"./chunk-CLIPI7G6.js";import"./chunk-Y7BCKNLD.js";import{a as h}from"./chunk-LO2NM3CE.js";var C="WA:",pe=6e4,fe=2e3;function me(a){if(typeof a=="number"&&Number.isFinite(a))return a;if(typeof a!="string"||a==="")return;let s=a.split(":").map(e=>Number(e));if(!(s.length===0||s.length>3||s.some(e=>Number.isNaN(e))))return s.reduce((e,t)=>e*60+t,0)}function ve(a,s,e){let t=a.states[s];if(!t)return;let i=t.attributes??{},o=s.split(".")[0]??"",n={entityId:s,state:t.state,unitOfMeasurement:typeof i.unit_of_measurement=="string"?i.unit_of_measurement:void 0,iconName:e,domain:o};if(o==="timer"){n.timerState=t.state,typeof i.finishes_at=="string"&&(n.finishesAt=i.finishes_at);let r=me(i.remaining);r!==void 0&&(n.remaining=r)}return typeof i.entity_picture=="string"&&(n.entityPicture=i.entity_picture),n}function ge(a){if(typeof a!="object"||a===null)return;let s=a.result;if(typeof s!="string")return;let e=s.startsWith(C)?s.slice(C.length):s;return V(e.trim())}function ue(a,s){let e=a.supportedFamilies;if(s!==void 0&&e.includes(s))return s;let t=T.find(i=>e.includes(i));return t||(e.includes("inline")?"inline":void 0)}function he(a,s=Date.now()){return(a.inline?.countdownEnd??0)>s?!0:T.some(e=>{let t=a[e];return t?(t.bezelCountdownEnd??0)>s?!0:t.elements.some(i=>i.kind==="text"&&(i.countdownEnd??0)>s):!1})}var w=class{constructor(s){this.host=s;this.templateResults=new Map;this.historySeries=new Map;this.listItems=new Map;this.entityIds=[];this.iconNames=new Map;this.seriesEntities=new Set;this.lastSeen=new Map;this.running=!1;this.templateRun=0;this.fetchRun=0}setDocument(s){let e=O(s),t=q(e),i=new Set([..._(e).map(n=>n.entityId),...M(e).map(n=>n.entityId)]);this.config=e,this.entityIds=[...t.entities.keys()],this.iconNames=new Map([...t.entities].map(([n,r])=>[n,r.iconName??""])),this.seriesEntities=i,this.lastSeen=new Map,this.noteHass();let o=t.document;o!==this.doc&&(this.doc=o,this.templateResults=new Map,this.templateError=void 0,this.running&&this.subscribeTemplate()),this.running&&this.fetchSeriesAndLists()}noteHass(){let s=this.host.hass();if(!s)return!1;let e=!1,t=!1;for(let i of this.entityIds){let o=s.states[i],n=o?`${o.last_updated??""}|${o.state}`:"";this.lastSeen.get(i)!==n&&(this.lastSeen.has(i)&&this.seriesEntities.has(i)&&(t=!0),this.lastSeen.set(i,n),e=!0)}return t&&this.running&&this.fetchSeriesSoon(),e}start(){this.running||(this.running=!0,this.subscribeTemplate(),this.fetchSeriesAndLists(),this.seriesTimer=setInterval(()=>{this.fetchSeriesAndLists()},pe))}stop(){this.running=!1,this.templateRun++,this.fetchRun++;let s=this.unsubscribeTemplate;this.unsubscribeTemplate=void 0,s&&s().catch(()=>{}),this.seriesTimer!==void 0&&clearInterval(this.seriesTimer),this.seriesSoon!==void 0&&clearTimeout(this.seriesSoon),this.seriesTimer=void 0,this.seriesSoon=void 0}refresh(){this.running&&(this.subscribeTemplate(),this.fetchSeriesAndLists())}pageCount(){return this.config?Math.max(1,g(this.config).count):1}context(s){let e=this.host.hass(),t=new Map;if(e)for(let i of this.entityIds){let o=ve(e,i,this.iconNames.get(i)??"");o&&t.set(i,o)}return{entityStates:t,templateResults:this.templateResults,historySeries:this.historySeries,listItems:this.listItems,namedValues:this.config?.values??[],...s!==void 0&&s>1?{page:s}:{}}}layouts(s){if(this.config)return J(this.config,this.context(s))}async subscribeTemplate(){let s=++this.templateRun,e=this.unsubscribeTemplate;this.unsubscribeTemplate=void 0,e&&e().catch(()=>{});let t=this.host.hass(),i=this.doc;if(!(!t||i===void 0))try{let o=await t.connection.subscribeMessage(n=>{if(s!==this.templateRun)return;let r=n.error;if(typeof r=="string"){this.templateError=r,this.host.changed();return}let c=ge(n);c&&(this.templateError=void 0,this.templateResults=c.values,this.host.changed())},{type:"render_template",template:`${C}${i}`,report_errors:!0});if(s!==this.templateRun){o().catch(()=>{});return}this.unsubscribeTemplate=o}catch(o){if(s!==this.templateRun)return;this.templateError=String(o?.message??o),this.host.changed()}}fetchSeriesSoon(){this.seriesSoon!==void 0&&clearTimeout(this.seriesSoon),this.seriesSoon=setTimeout(()=>{this.seriesSoon=void 0,this.fetchSeriesAndLists()},fe)}async fetchSeriesAndLists(){let s=this.host.hass(),e=this.config;if(!s||!e)return;let t=++this.fetchRun,i=U(e),o=D(e);if(Object.keys(i.history).length+Object.keys(i.statistics).length+Object.keys(o.requests).length===0)return;let[n,r]=await Promise.all([Promise.all([j(s,i.history).catch(()=>{}),G(s,i.statistics).catch(()=>({}))]),B(s,o.requests).catch(()=>{})]);if(t!==this.fetchRun||e!==this.config)return;let[c,l]=n;c!==void 0&&(this.historySeries=z({...c,...l}).series),r!==void 0&&(this.listItems=K(r)),this.host.changed()}};function le(a){return a!==void 0&&L(a)?a:void 0}var ye=new Set(["openApp","openPage","openRoomPage","timerStartPause","timerCancel","addTodo","runHTTPAction"]),R=class extends Error{constructor(s){super(`This complication could not be read. Open it in the Wrist Assistant panel to fix it. (${s})`)}},be=4e3,u=class extends A{constructor(){super(...arguments);this.iconBase="";this.page=1;this.tick=0;this.live=new w({hass:()=>this.hass,changed:()=>this.requestUpdate()});this.tour=new Y({show:e=>{this.page=e}});this.loadRun=0;this.loadedFor=""}connectedCallback(){super.connectedCallback(),this.syncRunning()}disconnectedCallback(){super.disconnectedCallback(),this.teardown()}willUpdate(e){e.has("hass")&&this.hass&&(this.live.noteHass(),this.syncRunning()),e.has("config")&&(this.tour.stop(),this.page=1,this.syncRunning())}syncRunning(){if(!(this.isConnected&&!!this.hass&&!!this.config)){this.teardown();return}this.icons||(this.icons=re(()=>this.requestUpdate(),this.iconBase||document.baseURI));let t=`${this.config.owner}|${this.config.complication}`;t!==this.loadedFor&&(this.teardown(),this.loadedFor=t,this.load(this.config.owner,this.config.complication))}teardown(){this.loadRun++,this.loadedFor="",this.live.stop(),this.tour.stop();let e=this.unsubscribe;this.unsubscribe=void 0,e&&e().catch(()=>{}),this.countdown!==void 0&&clearInterval(this.countdown),this.countdown=void 0}async load(e,t){let i=++this.loadRun,o=this.hass;try{let n;try{n=await ce(o,e,t)}catch(c){if(E(c)!=="not_found")throw c}if(i!==this.loadRun)return;n?this.takeOrShow(n):(this.record=void 0,this.problem="This complication was deleted, or this card names one that never existed.");let r=await de(o,e,t,c=>{i===this.loadRun&&this.onRecordEvent(c)});if(i!==this.loadRun){r().catch(()=>{});return}this.unsubscribe=r}catch(n){if(i!==this.loadRun)return;this.record=void 0,this.live.stop();let r=E(n);this.problem=r==="unknown_command"?"Update the Wrist Assistant integration to show complications on dashboards.":`Could not load this complication: ${String(n?.message??n)}`,this.loadedFor=""}}onRecordEvent(e){if("deleted"in e){this.record=void 0,this.problem="This complication was deleted.",this.live.stop(),this.tour.stop();return}this.takeOrShow(e)}takeOrShow(e){try{this.take(e)}catch(t){if(!(t instanceof R))throw t;return this.record=void 0,this.problem=t.message,this.live.stop(),!1}return this.live.start(),!0}take(e){this.tour.stop();try{this.live.setDocument(e.document)}catch(t){throw new R(String(t?.message??t))}this.problem=void 0,this.record=e,this.page>this.live.pageCount()&&(this.page=1)}render(){let e=this.config,i=e?.background==="none"?"bare":"";if(this.problem)return d`<ha-card class=${i}><div class="message">${this.problem}</div></ha-card>`;let o=this.live.config;if(!o||!this.record)return d`<ha-card class=${i}><div class="message quiet">Loading…</div></ha-card>`;let n=ue(o,e?.shape);if(n===void 0)return d`<ha-card class=${i}><div class="message">${o.name||"This complication"} has no shape to draw.</div></ha-card>`;let r=this.live.layouts(this.page)??{};this.syncCountdown(r);let c=le(n),l=c===void 0?this.renderInline(r.inline):this.renderFace(o,c,r[c]);return d`<ha-card class=${`${i} ${c==="dashboard"?"dashboard":""}`}>
      ${l}
      ${this.note?d`<div class="note" role="status">${this.note}</div>`:v}
    </ha-card>`}renderFace(e,t,i){if(!i||!this.icons)return d`<div class="message quiet">Nothing to draw yet.</div>`;let o=W(se(t)?Z:Q,t,i.canvas),n=ie(i,{icons:this.icons,slot:o,...ae(t,!1,void 0)}),r=this.config?.taps!==!1,c=t==="dashboard"?`--wa-canvas-ratio:${o.width} / ${o.height}`:v;return d`<div class="face ${t} ${r?"taps":""}" style=${c}
      aria-label=${e.name||"Complication"}
      @pointerdown=${r?l=>{this.onPress(e,t,i,l)}:void 0}>${t==="corner"?this.cornerCrop(i,n):n}</div>`}cornerCrop(e,t){let i=!!e.bezelText||!!e.bezelGauge,o=ee(1,i),n;if(i){let r=o.quad.width*.78;n={x:0,y:0,w:r,h:r}}else{let r=te(1,!1)*1.2;n={x:o.tile.cx-r/2,y:o.tile.cy-r/2,w:r,h:r}}return I`<svg class="crop" viewBox=${`${n.x} ${n.y} ${n.w} ${n.h}`} xmlns="http://www.w3.org/2000/svg">${t}</svg>`}renderInline(e){if(!e)return d`<div class="message quiet">Nothing to draw yet.</div>`;let t=Date.now(),i=e.countdownEnd!==void 0&&e.countdownEnd>t?X((e.countdownEnd-t)/1e3):e.text,o=H(`${e.label?`${e.label}: `:""}${i}`),n=e.symbol&&this.icons?this.icons.render(e.symbol,18,"#FFFFFF"):void 0;return d`<div class="inline">
      ${n?d`<span class="sym">${n}</span>`:v}
      <span>${o.map(r=>"text"in r?r.text:d`<span class="sym">${this.icons?.render(r.symbol,16,"#FFFFFF")??v}</span>`)}</span>
    </div>`}syncCountdown(e){let t=he(e);t&&this.countdown===void 0?this.countdown=setInterval(()=>{this.tick++},1e3):!t&&this.countdown!==void 0&&(clearInterval(this.countdown),this.countdown=void 0)}async onPress(e,t,i,o){let n=o.currentTarget,r=n?.querySelector("svg.complication"),l=r?.querySelector("[data-design-box]")?.getScreenCTM(),y=i.canvas??P(e,t);if(!r||!l||y.width<=0||y.height<=0)return;let x=r.createSVGPoint();x.x=o.clientX,x.y=o.clientY;let k=x.matrixTransform(l.inverse()),{action:f}=ne(e,i,{x:k.x/y.width,y:k.y/y.height});if(f.type==="none"||(this.tour.stop(),ye.has(f.type)))return;if(o.preventDefault(),n?.classList.add("pressed"),setTimeout(()=>n?.classList.remove("pressed"),160),f.type==="openEntity"){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:f.entityId},bubbles:!0,composed:!0}));return}let m=this.live.pageCount(),$=await oe(f,{hass:this.hass,refresh:()=>this.live.refresh(),stepPage:S=>m<=1?!1:(this.page=(this.page-1+S+m)%m+1,!0),showPage:S=>m<=1?!1:(this.page=Math.min(Math.max(1,Math.trunc(S)),m),!0),playTour:()=>this.playTour(e)});$.kind==="failed"&&this.showNote($.text)}playTour(e){return!N(e)||g(e).mode!=="tour"?!1:(this.tour.play(g(e)),!0)}showNote(e){this.note=e,this.noteTimer!==void 0&&clearTimeout(this.noteTimer),this.noteTimer=setTimeout(()=>{this.note=void 0},be)}static{this.styles=F`
    :host {
      display: block;
      height: 100%;
    }
    ha-card {
      height: 100%;
      box-sizing: border-box;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    ha-card.bare {
      background: none;
      border: none;
      box-shadow: none;
      padding: 0;
    }
    .face {
      flex: 1 1 auto;
      width: 100%;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;
      transition: opacity 120ms ease;
    }
    .face.taps {
      cursor: pointer;
    }
    .face.pressed {
      opacity: 0.6;
    }
    .face > svg {
      display: block;
      width: 100%;
      height: 100%;
      max-height: 100%;
    }
    ha-card.dashboard {
      padding: 0;
    }
    /* The canvas's own proportions: what gives the face a height in a
       masonry column, where the card has none of its own. On a sections
       grid the card's height wins and the drawing, which keeps its viewBox,
       is fitted inside it, letterboxed rather than stretched. */
    .face.dashboard {
      aspect-ratio: var(--wa-canvas-ratio, auto);
    }
    .inline {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 16px;
      font-weight: 600;
      padding: 4px 8px;
      background: #000;
      color: #fff;
      border-radius: 10px;
    }
    .inline .sym {
      display: inline-flex;
      vertical-align: middle;
    }
    .inline .sym svg {
      display: block;
    }
    .message {
      padding: 8px 12px;
      color: var(--primary-text-color);
      font-size: 14px;
      text-align: center;
    }
    .message.quiet {
      color: var(--secondary-text-color);
    }
    .note {
      position: absolute;
      left: 8px;
      right: 8px;
      bottom: 8px;
      padding: 6px 10px;
      border-radius: 8px;
      background: var(--error-color, #db4437);
      color: #fff;
      font-size: 12px;
      text-align: center;
    }
  `}};h([b({attribute:!1})],u.prototype,"hass",2),h([b({attribute:!1})],u.prototype,"config",2),h([b({attribute:!1})],u.prototype,"iconBase",2),h([p()],u.prototype,"record",2),h([p()],u.prototype,"problem",2),h([p()],u.prototype,"page",2),h([p()],u.prototype,"note",2),h([p()],u.prototype,"tick",2);customElements.get("wa-dashboard-card")||customElements.define("wa-dashboard-card",u);export{u as WaDashboardCard};
