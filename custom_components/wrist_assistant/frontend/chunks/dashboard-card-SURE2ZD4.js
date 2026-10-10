import{b as te,c as ie,d as se}from"./chunk-JRCCGBND.js";import{b as Q,c as Z,f as W,h as ee}from"./chunk-RL3UY6MT.js";import{D as G,M as z,O as K,Q as U,S as B,T as Y,da as X,qa as J}from"./chunk-6ZZYZUUY.js";import{Mf as _,Mg as N,Nf as M,Ng as H,Og as q,Pg as V,Qg as O,Rg as j,Sg as D,Vc as L,fd as $,n as S,o as F,wb as I,xb as A,yd as P}from"./chunk-NDWIJB7T.js";import{b as C,c as d,f as v,i as k,j as y,k as p}from"./chunk-CLIPI7G6.js";import{a as l}from"./chunk-LO2NM3CE.js";var x="WA:",ae=6e4,ce=2e3;function de(a){if(typeof a=="number"&&Number.isFinite(a))return a;if(typeof a!="string"||a==="")return;let s=a.split(":").map(e=>Number(e));if(!(s.length===0||s.length>3||s.some(e=>Number.isNaN(e))))return s.reduce((e,i)=>e*60+i,0)}function ue(a,s,e){let i=a.states[s];if(!i)return;let t=i.attributes??{},n=s.split(".")[0]??"",o={entityId:s,state:i.state,unitOfMeasurement:typeof t.unit_of_measurement=="string"?t.unit_of_measurement:void 0,iconName:e,domain:n};if(n==="timer"){o.timerState=i.state,typeof t.finishes_at=="string"&&(o.finishesAt=t.finishes_at);let r=de(t.remaining);r!==void 0&&(o.remaining=r)}return typeof t.entity_picture=="string"&&(o.entityPicture=t.entity_picture),o}function le(a){if(typeof a!="object"||a===null)return;let s=a.result;if(typeof s!="string")return;let e=s.startsWith(x)?s.slice(x.length):s;return M(e.trim())}function ne(a,s){let e=a.supportedFamilies;if(s!==void 0&&e.includes(s))return s;let i=S.find(t=>e.includes(t));return i||(e.includes("inline")?"inline":void 0)}function oe(a,s=Date.now()){return(a.inline?.countdownEnd??0)>s?!0:S.some(e=>{let i=a[e];return i?(i.bezelCountdownEnd??0)>s?!0:i.elements.some(t=>t.kind==="text"&&(t.countdownEnd??0)>s):!1})}var b=class{constructor(s){this.host=s;this.templateResults=new Map;this.historySeries=new Map;this.listItems=new Map;this.entityIds=[];this.iconNames=new Map;this.seriesEntities=new Set;this.lastSeen=new Map;this.running=!1;this.templateRun=0;this.fetchRun=0}setDocument(s){let e=P(s);this.config=e;let i=_(e);this.entityIds=[...i.entities.keys()],this.iconNames=new Map([...i.entities].map(([n,o])=>[n,o.iconName??""])),this.seriesEntities=new Set([...I(e).map(n=>n.entityId),...A(e).map(n=>n.entityId)]),this.lastSeen=new Map,this.noteHass();let t=i.document;t!==this.doc&&(this.doc=t,this.templateResults=new Map,this.templateError=void 0,this.running&&this.subscribeTemplate()),this.running&&this.fetchSeriesAndLists()}noteHass(){let s=this.host.hass();if(!s)return!1;let e=!1,i=!1;for(let t of this.entityIds){let n=s.states[t],o=n?`${n.last_updated??""}|${n.state}`:"";this.lastSeen.get(t)!==o&&(this.lastSeen.has(t)&&this.seriesEntities.has(t)&&(i=!0),this.lastSeen.set(t,o),e=!0)}return i&&this.running&&this.fetchSeriesSoon(),e}start(){this.running||(this.running=!0,this.subscribeTemplate(),this.fetchSeriesAndLists(),this.seriesTimer=setInterval(()=>{this.fetchSeriesAndLists()},ae))}stop(){this.running=!1,this.templateRun++,this.fetchRun++;let s=this.unsubscribeTemplate;this.unsubscribeTemplate=void 0,s&&s().catch(()=>{}),this.seriesTimer!==void 0&&clearInterval(this.seriesTimer),this.seriesSoon!==void 0&&clearTimeout(this.seriesSoon),this.seriesTimer=void 0,this.seriesSoon=void 0}refresh(){this.running&&(this.subscribeTemplate(),this.fetchSeriesAndLists())}pageCount(){return this.config?Math.max(1,$(this.config).count):1}context(s){let e=this.host.hass(),i=new Map;if(e)for(let t of this.entityIds){let n=ue(e,t,this.iconNames.get(t)??"");n&&i.set(t,n)}return{entityStates:i,templateResults:this.templateResults,historySeries:this.historySeries,listItems:this.listItems,namedValues:this.config?.values??[],...s!==void 0&&s>1?{page:s}:{}}}layouts(s){if(this.config)return z(this.config,this.context(s))}async subscribeTemplate(){let s=++this.templateRun,e=this.unsubscribeTemplate;this.unsubscribeTemplate=void 0,e&&e().catch(()=>{});let i=this.host.hass(),t=this.doc;if(!(!i||t===void 0))try{let n=await i.connection.subscribeMessage(o=>{if(s!==this.templateRun)return;let r=o.error;if(typeof r=="string"){this.templateError=r,this.host.changed();return}let c=le(o);c&&(this.templateError=void 0,this.templateResults=c.values,this.host.changed())},{type:"render_template",template:`${x}${t}`,report_errors:!0});if(s!==this.templateRun){n().catch(()=>{});return}this.unsubscribeTemplate=n}catch(n){if(s!==this.templateRun)return;this.templateError=String(n?.message??n),this.host.changed()}}fetchSeriesSoon(){this.seriesSoon!==void 0&&clearTimeout(this.seriesSoon),this.seriesSoon=setTimeout(()=>{this.seriesSoon=void 0,this.fetchSeriesAndLists()},ce)}async fetchSeriesAndLists(){let s=this.host.hass(),e=this.config;if(!s||!e)return;let i=++this.fetchRun,t=D(e),n=O(e);if(Object.keys(t.history).length+Object.keys(t.statistics).length+Object.keys(n.requests).length===0)return;let[o,r]=await Promise.all([Promise.all([N(s,t.history).catch(()=>{}),q(s,t.statistics).catch(()=>({}))]),V(s,n.requests).catch(()=>{})]);if(i!==this.fetchRun||e!==this.config)return;let[c,h]=o;c!==void 0&&(this.historySeries=H({...c,...h}).series),r!==void 0&&(this.listItems=j(r)),this.host.changed()}};function re(a){return a!==void 0&&F(a)?a:void 0}var he=new Set(["openApp","openPage","openRoomPage","timerStartPause","timerCancel","addTodo","runHTTPAction"]),pe=4e3,u=class extends k{constructor(){super(...arguments);this.iconBase="";this.page=1;this.tick=0;this.live=new b({hass:()=>this.hass,changed:()=>this.requestUpdate()});this.loadRun=0;this.loadedFor=""}connectedCallback(){super.connectedCallback(),this.syncRunning()}disconnectedCallback(){super.disconnectedCallback(),this.teardown()}willUpdate(e){e.has("hass")&&this.hass&&(this.live.noteHass(),this.syncRunning()),e.has("config")&&(this.page=1,this.syncRunning())}syncRunning(){if(!(this.isConnected&&!!this.hass&&!!this.config)){this.teardown();return}this.icons||(this.icons=W(()=>this.requestUpdate(),this.iconBase||document.baseURI));let i=`${this.config.owner}|${this.config.complication}`;i!==this.loadedFor&&(this.teardown(),this.loadedFor=i,this.load(this.config.owner,this.config.complication))}teardown(){this.loadRun++,this.loadedFor="",this.live.stop();let e=this.unsubscribe;this.unsubscribe=void 0,e&&e().catch(()=>{}),this.countdown!==void 0&&clearInterval(this.countdown),this.countdown=void 0}async load(e,i){let t=++this.loadRun,n=this.hass;try{let o=await te(n,e,i);if(t!==this.loadRun)return;this.take(o),this.live.start();let r=await ie(n,e,i,c=>{t===this.loadRun&&this.onRecordEvent(c)});if(t!==this.loadRun){r().catch(()=>{});return}this.unsubscribe=r}catch(o){if(t!==this.loadRun)return;this.record=void 0;let r=se(o);this.problem=r==="not_found"?"This complication was deleted, or this card names one that never existed.":r==="unknown_command"?"Update the Wrist Assistant integration to show complications on dashboards.":`Could not load this complication: ${String(o?.message??o)}`,this.loadedFor=""}}onRecordEvent(e){if("deleted"in e){this.record=void 0,this.problem="This complication was deleted.";return}this.take(e)}take(e){this.problem=void 0,this.record=e,this.live.setDocument(e.document),this.page>this.live.pageCount()&&(this.page=1)}render(){let e=this.config,t=e?.background==="none"?"bare":"";if(this.problem)return d`<ha-card class=${t}><div class="message">${this.problem}</div></ha-card>`;let n=this.live.config;if(!n||!this.record)return d`<ha-card class=${t}><div class="message quiet">Loading…</div></ha-card>`;let o=ne(n,e?.shape);if(o===void 0)return d`<ha-card class=${t}><div class="message">${n.name||"This complication"} has no shape to draw.</div></ha-card>`;let r=this.live.layouts(this.page)??{};this.syncCountdown(r);let c=re(o),h=c===void 0?this.renderInline(r.inline):this.renderFace(n,c,r[c]);return d`<ha-card class=${t}>
      ${h}
      ${this.note?d`<div class="note" role="status">${this.note}</div>`:v}
    </ha-card>`}renderFace(e,i,t){if(!t||!this.icons)return d`<div class="message quiet">Nothing to draw yet.</div>`;let n=Y(J(i)?B:U,i),o=X(t,{icons:this.icons,slot:n,...ee(i,!1,void 0)}),r=this.config?.taps!==!1;return d`<div class="face ${i} ${r?"taps":""}"
      aria-label=${e.name||"Complication"}
      @pointerdown=${r?c=>{this.onPress(e,i,t,c)}:void 0}>${o}</div>`}renderInline(e){if(!e)return d`<div class="message quiet">Nothing to draw yet.</div>`;let i=Date.now(),t=e.countdownEnd!==void 0&&e.countdownEnd>i?G((e.countdownEnd-i)/1e3):e.text,n=L(`${e.label?`${e.label}: `:""}${t}`),o=e.symbol&&this.icons?this.icons.render(e.symbol,18,"#FFFFFF"):void 0;return d`<div class="inline">
      ${o?d`<span class="sym">${o}</span>`:v}
      <span>${n.map(r=>"text"in r?r.text:d`<span class="sym">${this.icons?.render(r.symbol,16,"#FFFFFF")??v}</span>`)}</span>
    </div>`}syncCountdown(e){let i=oe(e);i&&this.countdown===void 0?this.countdown=setInterval(()=>{this.tick++},1e3):!i&&this.countdown!==void 0&&(clearInterval(this.countdown),this.countdown=void 0)}async onPress(e,i,t,n){let o=n.currentTarget,r=o?.querySelector("svg.complication"),h=r?.querySelector("[data-design-box]")?.getScreenCTM(),g=K[i];if(!r||!h||g.width<=0||g.height<=0)return;let w=r.createSVGPoint();w.x=n.clientX,w.y=n.clientY;let E=w.matrixTransform(h.inverse()),{action:f}=Q(e,t,{x:E.x/g.width,y:E.y/g.height});if(f.type==="none"||he.has(f.type))return;if(n.preventDefault(),o?.classList.add("pressed"),setTimeout(()=>o?.classList.remove("pressed"),160),f.type==="openEntity"){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:f.entityId},bubbles:!0,composed:!0}));return}let m=this.live.pageCount(),T=await Z(f,{hass:this.hass,refresh:()=>this.live.refresh(),stepPage:R=>m<=1?!1:(this.page=(this.page-1+R+m)%m+1,!0),showPage:R=>m<=1?!1:(this.page=Math.min(Math.max(1,Math.trunc(R)),m),!0),playTour:()=>!1});T.kind==="failed"&&this.showNote(T.text)}showNote(e){this.note=e,this.noteTimer!==void 0&&clearTimeout(this.noteTimer),this.noteTimer=setTimeout(()=>{this.note=void 0},pe)}static{this.styles=C`
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
    .face svg.complication {
      display: block;
      width: 100%;
      height: 100%;
      max-height: 100%;
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
  `}};l([y({attribute:!1})],u.prototype,"hass",2),l([y({attribute:!1})],u.prototype,"config",2),l([y({attribute:!1})],u.prototype,"iconBase",2),l([p()],u.prototype,"record",2),l([p()],u.prototype,"problem",2),l([p()],u.prototype,"page",2),l([p()],u.prototype,"note",2),l([p()],u.prototype,"tick",2);customElements.get("wa-dashboard-card")||customElements.define("wa-dashboard-card",u);export{u as WaDashboardCard};
