import{b as oe,c as re,d as ae}from"./chunk-JRCCGBND.js";import{b as te,c as ie,f as se,h as ne}from"./chunk-L4QZBGE7.js";import{D as K,M as U,Q as Y,S as X,T as J,aa as Q,ba as Z,da as W,qa as ee}from"./chunk-NHBSDOHH.js";import{$g as G,Gb as L,Hb as P,Id as H,Xf as N,Xg as O,Yf as q,Yg as V,Zg as j,_g as z,ah as B,bh as D,dd as _,n as S,o as I,pd as M,u as A}from"./chunk-KJ3D23XB.js";import{b as k,c as d,d as $,f as g,i as F,j as y,k as p}from"./chunk-CLIPI7G6.js";import"./chunk-Y7BCKNLD.js";import{a as h}from"./chunk-LO2NM3CE.js";var E="WA:",he=6e4,le=2e3;function pe(a){if(typeof a=="number"&&Number.isFinite(a))return a;if(typeof a!="string"||a==="")return;let s=a.split(":").map(e=>Number(e));if(!(s.length===0||s.length>3||s.some(e=>Number.isNaN(e))))return s.reduce((e,t)=>e*60+t,0)}function fe(a,s,e){let t=a.states[s];if(!t)return;let i=t.attributes??{},n=s.split(".")[0]??"",o={entityId:s,state:t.state,unitOfMeasurement:typeof i.unit_of_measurement=="string"?i.unit_of_measurement:void 0,iconName:e,domain:n};if(n==="timer"){o.timerState=t.state,typeof i.finishes_at=="string"&&(o.finishesAt=i.finishes_at);let r=pe(i.remaining);r!==void 0&&(o.remaining=r)}return typeof i.entity_picture=="string"&&(o.entityPicture=i.entity_picture),o}function me(a){if(typeof a!="object"||a===null)return;let s=a.result;if(typeof s!="string")return;let e=s.startsWith(E)?s.slice(E.length):s;return q(e.trim())}function ce(a,s){let e=a.supportedFamilies;if(s!==void 0&&e.includes(s))return s;let t=S.find(i=>e.includes(i));return t||(e.includes("inline")?"inline":void 0)}function de(a,s=Date.now()){return(a.inline?.countdownEnd??0)>s?!0:S.some(e=>{let t=a[e];return t?(t.bezelCountdownEnd??0)>s?!0:t.elements.some(i=>i.kind==="text"&&(i.countdownEnd??0)>s):!1})}var b=class{constructor(s){this.host=s;this.templateResults=new Map;this.historySeries=new Map;this.listItems=new Map;this.entityIds=[];this.iconNames=new Map;this.seriesEntities=new Set;this.lastSeen=new Map;this.running=!1;this.templateRun=0;this.fetchRun=0}setDocument(s){let e=H(s);this.config=e;let t=N(e);this.entityIds=[...t.entities.keys()],this.iconNames=new Map([...t.entities].map(([n,o])=>[n,o.iconName??""])),this.seriesEntities=new Set([...L(e).map(n=>n.entityId),...P(e).map(n=>n.entityId)]),this.lastSeen=new Map,this.noteHass();let i=t.document;i!==this.doc&&(this.doc=i,this.templateResults=new Map,this.templateError=void 0,this.running&&this.subscribeTemplate()),this.running&&this.fetchSeriesAndLists()}noteHass(){let s=this.host.hass();if(!s)return!1;let e=!1,t=!1;for(let i of this.entityIds){let n=s.states[i],o=n?`${n.last_updated??""}|${n.state}`:"";this.lastSeen.get(i)!==o&&(this.lastSeen.has(i)&&this.seriesEntities.has(i)&&(t=!0),this.lastSeen.set(i,o),e=!0)}return t&&this.running&&this.fetchSeriesSoon(),e}start(){this.running||(this.running=!0,this.subscribeTemplate(),this.fetchSeriesAndLists(),this.seriesTimer=setInterval(()=>{this.fetchSeriesAndLists()},he))}stop(){this.running=!1,this.templateRun++,this.fetchRun++;let s=this.unsubscribeTemplate;this.unsubscribeTemplate=void 0,s&&s().catch(()=>{}),this.seriesTimer!==void 0&&clearInterval(this.seriesTimer),this.seriesSoon!==void 0&&clearTimeout(this.seriesSoon),this.seriesTimer=void 0,this.seriesSoon=void 0}refresh(){this.running&&(this.subscribeTemplate(),this.fetchSeriesAndLists())}pageCount(){return this.config?Math.max(1,M(this.config).count):1}context(s){let e=this.host.hass(),t=new Map;if(e)for(let i of this.entityIds){let n=fe(e,i,this.iconNames.get(i)??"");n&&t.set(i,n)}return{entityStates:t,templateResults:this.templateResults,historySeries:this.historySeries,listItems:this.listItems,namedValues:this.config?.values??[],...s!==void 0&&s>1?{page:s}:{}}}layouts(s){if(this.config)return U(this.config,this.context(s))}async subscribeTemplate(){let s=++this.templateRun,e=this.unsubscribeTemplate;this.unsubscribeTemplate=void 0,e&&e().catch(()=>{});let t=this.host.hass(),i=this.doc;if(!(!t||i===void 0))try{let n=await t.connection.subscribeMessage(o=>{if(s!==this.templateRun)return;let r=o.error;if(typeof r=="string"){this.templateError=r,this.host.changed();return}let c=me(o);c&&(this.templateError=void 0,this.templateResults=c.values,this.host.changed())},{type:"render_template",template:`${E}${i}`,report_errors:!0});if(s!==this.templateRun){n().catch(()=>{});return}this.unsubscribeTemplate=n}catch(n){if(s!==this.templateRun)return;this.templateError=String(n?.message??n),this.host.changed()}}fetchSeriesSoon(){this.seriesSoon!==void 0&&clearTimeout(this.seriesSoon),this.seriesSoon=setTimeout(()=>{this.seriesSoon=void 0,this.fetchSeriesAndLists()},le)}async fetchSeriesAndLists(){let s=this.host.hass(),e=this.config;if(!s||!e)return;let t=++this.fetchRun,i=D(e),n=G(e);if(Object.keys(i.history).length+Object.keys(i.statistics).length+Object.keys(n.requests).length===0)return;let[o,r]=await Promise.all([Promise.all([O(s,i.history).catch(()=>{}),j(s,i.statistics).catch(()=>({}))]),z(s,n.requests).catch(()=>{})]);if(t!==this.fetchRun||e!==this.config)return;let[c,l]=o;c!==void 0&&(this.historySeries=V({...c,...l}).series),r!==void 0&&(this.listItems=B(r)),this.host.changed()}};function ue(a){return a!==void 0&&I(a)?a:void 0}var ge=new Set(["openApp","openPage","openRoomPage","timerStartPause","timerCancel","addTodo","runHTTPAction"]),w=class extends Error{constructor(s){super(`This complication could not be read. Open it in the Wrist Assistant panel to fix it. (${s})`)}},ve=4e3,u=class extends F{constructor(){super(...arguments);this.iconBase="";this.page=1;this.tick=0;this.live=new b({hass:()=>this.hass,changed:()=>this.requestUpdate()});this.loadRun=0;this.loadedFor=""}connectedCallback(){super.connectedCallback(),this.syncRunning()}disconnectedCallback(){super.disconnectedCallback(),this.teardown()}willUpdate(e){e.has("hass")&&this.hass&&(this.live.noteHass(),this.syncRunning()),e.has("config")&&(this.page=1,this.syncRunning())}syncRunning(){if(!(this.isConnected&&!!this.hass&&!!this.config)){this.teardown();return}this.icons||(this.icons=se(()=>this.requestUpdate(),this.iconBase||document.baseURI));let t=`${this.config.owner}|${this.config.complication}`;t!==this.loadedFor&&(this.teardown(),this.loadedFor=t,this.load(this.config.owner,this.config.complication))}teardown(){this.loadRun++,this.loadedFor="",this.live.stop();let e=this.unsubscribe;this.unsubscribe=void 0,e&&e().catch(()=>{}),this.countdown!==void 0&&clearInterval(this.countdown),this.countdown=void 0}async load(e,t){let i=++this.loadRun,n=this.hass;try{let o=await oe(n,e,t);if(i!==this.loadRun)return;this.take(o),this.live.start();let r=await re(n,e,t,c=>{i===this.loadRun&&this.onRecordEvent(c)});if(i!==this.loadRun){r().catch(()=>{});return}this.unsubscribe=r}catch(o){if(i!==this.loadRun)return;if(this.record=void 0,o instanceof w){this.problem=o.message;return}let r=ae(o);this.problem=r==="not_found"?"This complication was deleted, or this card names one that never existed.":r==="unknown_command"?"Update the Wrist Assistant integration to show complications on dashboards.":`Could not load this complication: ${String(o?.message??o)}`,this.loadedFor=""}}onRecordEvent(e){if("deleted"in e){this.record=void 0,this.problem="This complication was deleted.";return}try{this.take(e)}catch(t){this.record=void 0,this.problem=t.message}}take(e){try{this.live.setDocument(e.document)}catch(t){throw new w(String(t?.message??t))}this.problem=void 0,this.record=e,this.page>this.live.pageCount()&&(this.page=1)}render(){let e=this.config,i=e?.background==="none"?"bare":"";if(this.problem)return d`<ha-card class=${i}><div class="message">${this.problem}</div></ha-card>`;let n=this.live.config;if(!n||!this.record)return d`<ha-card class=${i}><div class="message quiet">Loading…</div></ha-card>`;let o=ce(n,e?.shape);if(o===void 0)return d`<ha-card class=${i}><div class="message">${n.name||"This complication"} has no shape to draw.</div></ha-card>`;let r=this.live.layouts(this.page)??{};this.syncCountdown(r);let c=ue(o),l=c===void 0?this.renderInline(r.inline):this.renderFace(n,c,r[c]);return d`<ha-card class=${`${i} ${c==="dashboard"?"dashboard":""}`}>
      ${l}
      ${this.note?d`<div class="note" role="status">${this.note}</div>`:g}
    </ha-card>`}renderFace(e,t,i){if(!i||!this.icons)return d`<div class="message quiet">Nothing to draw yet.</div>`;let n=J(ee(t)?X:Y,t,i.canvas),o=W(i,{icons:this.icons,slot:n,...ne(t,!1,void 0)}),r=this.config?.taps!==!1,c=t==="dashboard"?`--wa-canvas-ratio:${n.width} / ${n.height}`:g;return d`<div class="face ${t} ${r?"taps":""}" style=${c}
      aria-label=${e.name||"Complication"}
      @pointerdown=${r?l=>{this.onPress(e,t,i,l)}:void 0}>${t==="corner"?this.cornerCrop(i,o):o}</div>`}cornerCrop(e,t){let i=!!e.bezelText||!!e.bezelGauge,n=Q(1,i),o;if(i){let r=n.quad.width*.78;o={x:0,y:0,w:r,h:r}}else{let r=Z(1,!1)*1.2;o={x:n.tile.cx-r/2,y:n.tile.cy-r/2,w:r,h:r}}return $`<svg class="crop" viewBox=${`${o.x} ${o.y} ${o.w} ${o.h}`} xmlns="http://www.w3.org/2000/svg">${t}</svg>`}renderInline(e){if(!e)return d`<div class="message quiet">Nothing to draw yet.</div>`;let t=Date.now(),i=e.countdownEnd!==void 0&&e.countdownEnd>t?K((e.countdownEnd-t)/1e3):e.text,n=_(`${e.label?`${e.label}: `:""}${i}`),o=e.symbol&&this.icons?this.icons.render(e.symbol,18,"#FFFFFF"):void 0;return d`<div class="inline">
      ${o?d`<span class="sym">${o}</span>`:g}
      <span>${n.map(r=>"text"in r?r.text:d`<span class="sym">${this.icons?.render(r.symbol,16,"#FFFFFF")??g}</span>`)}</span>
    </div>`}syncCountdown(e){let t=de(e);t&&this.countdown===void 0?this.countdown=setInterval(()=>{this.tick++},1e3):!t&&this.countdown!==void 0&&(clearInterval(this.countdown),this.countdown=void 0)}async onPress(e,t,i,n){let o=n.currentTarget,r=o?.querySelector("svg.complication"),l=r?.querySelector("[data-design-box]")?.getScreenCTM(),v=i.canvas??A(e,t);if(!r||!l||v.width<=0||v.height<=0)return;let R=r.createSVGPoint();R.x=n.clientX,R.y=n.clientY;let T=R.matrixTransform(l.inverse()),{action:f}=te(e,i,{x:T.x/v.width,y:T.y/v.height});if(f.type==="none"||ge.has(f.type))return;if(n.preventDefault(),o?.classList.add("pressed"),setTimeout(()=>o?.classList.remove("pressed"),160),f.type==="openEntity"){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:f.entityId},bubbles:!0,composed:!0}));return}let m=this.live.pageCount(),C=await ie(f,{hass:this.hass,refresh:()=>this.live.refresh(),stepPage:x=>m<=1?!1:(this.page=(this.page-1+x+m)%m+1,!0),showPage:x=>m<=1?!1:(this.page=Math.min(Math.max(1,Math.trunc(x)),m),!0),playTour:()=>!1});C.kind==="failed"&&this.showNote(C.text)}showNote(e){this.note=e,this.noteTimer!==void 0&&clearTimeout(this.noteTimer),this.noteTimer=setTimeout(()=>{this.note=void 0},ve)}static{this.styles=k`
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
  `}};h([y({attribute:!1})],u.prototype,"hass",2),h([y({attribute:!1})],u.prototype,"config",2),h([y({attribute:!1})],u.prototype,"iconBase",2),h([p()],u.prototype,"record",2),h([p()],u.prototype,"problem",2),h([p()],u.prototype,"page",2),h([p()],u.prototype,"note",2),h([p()],u.prototype,"tick",2);customElements.get("wa-dashboard-card")||customElements.define("wa-dashboard-card",u);export{u as WaDashboardCard};
