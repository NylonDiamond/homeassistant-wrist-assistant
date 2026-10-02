import{Hf as le,Hh as be,Pg as ge,Rh as B,Sf as j,Sh as U,Th as q,Uf as de,Ug as fe,Vf as ce,Vh as ve,Wf as pe,Wh as G,Xf as he,Xh as xe,a as g,c as L,d as o,e as ae,g as u,ig as ue,j as oe,k,l as w,sh as me,uh as we}from"./chunk-BODACUH6.js";function $(t){return typeof t=="object"&&t!==null&&!Array.isArray(t)}function J(t){return $(t)?t:void 0}function C(t){let r=t?.pages;return Array.isArray(r)?r.filter($):[]}function S(t){let r=t?.items;return Array.isArray(r)?r.filter($):[]}function H(t){return typeof t.id=="string"?t.id:""}function y(t){let r=typeof t.name=="string"?t.name.trim():"";return r===""?"Untitled page":r}function K(t){return t.isHidden===!0}function ye(t){return t.isSystemPage===!0}function R(t){return $(t.dynamicConfig)}function ke(t){let r=t.dynamicConfig;if(!$(r)||!Array.isArray(r.rules))return[];let e=[];for(let i of r.rules){let n=$(i)&&typeof i.domain=="string"?i.domain:"";n!==""&&!e.includes(n)&&e.push(n)}return e}function P(t){return typeof t.entityId=="string"?t.entityId:""}function T(t){let r=t.indexOf(".");return r<0?t:t.slice(0,r)}function Ge(t){let r=t.indexOf(".");return r<0?"":t.slice(r+1)}var $e={page:"Go to page",show_page:"Peek page",status_page:"Status page",http_action:"HTTP action",macro:"Macro",template:"Template",spacer:"Spacer",multicam:"Multi camera",point_control:"Point control",music_hub:"Music hub",assist:"Assist",speak_message:"Speak message",webhook_inbox:"Webhook inbox",divider:"Header"},Se={alarm_control_panel:"Alarm",automation:"Automation",binary_sensor:"Binary sensor",button:"Button",calendar:"Calendar",camera:"Camera",climate:"Climate",counter:"Counter",cover:"Cover",device_tracker:"Device tracker",event:"Event",fan:"Fan",humidifier:"Humidifier",image:"Image",input_boolean:"Toggle",input_button:"Button",input_datetime:"Date and time",input_number:"Number",input_select:"Choice",input_text:"Text",lawn_mower:"Lawn mower",light:"Light",lock:"Lock",media_player:"Media player",number:"Number",person:"Person",remote:"Remote",scene:"Scene",script:"Script",select:"Choice",sensor:"Sensor",siren:"Siren",sun:"Sun",switch:"Switch",text:"Text",timer:"Timer",todo:"To-do list",update:"Update",vacuum:"Vacuum",valve:"Valve",water_heater:"Water heater",weather:"Weather",zone:"Zone"},Ve={light:"Lights",switch:"Switches",fan:"Fans",input_boolean:"Input booleans",automation:"Automations",cover:"Covers",valve:"Valves",lock:"Locks",climate:"Climate",media_player:"Media players",vacuum:"Vacuums",humidifier:"Humidifiers",water_heater:"Water heaters",remote:"Remotes",siren:"Sirens",binary_sensor:"Binary sensors",sensor:"Sensors",alarm_control_panel:"Alarm panels"};function Y(t){return Object.hasOwn($e,t)}function X(t){let r=t.replace(/_/g," ").trim();return r===""?"":r[0].toUpperCase()+r.slice(1)}function Z(t){return Y(t)?$e[t]:Se[t]??(X(t)||"Tile")}function Q(t){return Ve[t]??X(t)}function ee(t,r){let e=T(t);return e==="divider"?"divider":e==="spacer"?"spacer":Y(e)?"virtual":Object.hasOwn(Se,e)||r!==void 0&&Object.hasOwn(r,t)?"entity":"unknown"}function te(t){let r=t.split("."),e=r[1]==="label"?"label":"line",i=0;for(let n of r.slice(1)){let s=/^g(\d+)$/.exec(n);s&&(i=Math.min(1,Number(s[1])/100))}return{style:e,domain:r[2]??"",glow:i}}var Je={light:"lightbulb.fill",switch:"switch.2",fan:"fan.fill",input_boolean:"togglepower",automation:"gearshape.2.fill",cover:"blinds.vertical.open",valve:"spigot.fill",lock:"lock.fill",climate:"thermometer.medium",media_player:"hifispeaker.fill",vacuum:"fan.floor.fill",humidifier:"humidity.fill",water_heater:"flame.fill",remote:"av.remote.fill",siren:"speaker.wave.3.fill",binary_sensor:"sensor.fill",sensor:"chart.line.uptrend.xyaxis",alarm_control_panel:"shield.fill",camera:"video.fill",scene:"sparkles",script:"scroll.fill",person:"person.fill",weather:"cloud.sun.fill",page:"arrow.right.circle.fill",show_page:"eye.fill",status_page:"list.bullet.rectangle",http_action:"network",macro:"list.bullet",template:"curlybraces",multicam:"video.fill",point_control:"hand.point.up.left.fill",music_hub:"music.note.house.fill",assist:"microphone.fill",speak_message:"speaker.wave.2.fill",webhook_inbox:"tray.fill"};function Pe(t){let r=typeof t.icon=="string"?t.icon.trim():"";return r!==""?r:Je[T(P(t))]}function Te(t,r,e){let i=typeof t.customLabel=="string"?t.customLabel.trim():"";if(i!=="")return i;let n=P(t),s=T(n);if(s==="divider"){let{domain:l}=te(n);return l===""||l==="custom"?"":Q(l)}if(s==="page"||s==="show_page"){let l=Ge(n).toUpperCase(),d=e?.find(c=>H(c).toUpperCase()===l);if(d)return y(d)}if(Y(s))return Z(s);let a=r?.[n]?.attributes?.friendly_name;return typeof a=="string"&&a.trim()!==""?a.trim():n}function _e(t){return t.showLabel!==!1}function We(t,r){let e=P(t);if(ee(e,r)!=="entity")return;let i=r?.[e];if(i===void 0)return r===void 0?void 0:"Not found";let n=String(i.state??"");if(n==="unavailable")return"Unavailable";if(n==="unknown"||n==="")return"Unknown";let s=i.attributes?.unit_of_measurement;return typeof s=="string"&&s.trim()!==""?`${n} ${s.trim()}`:X(n)}var Ke={yellow:"#FFCC00",blue:"#007AFF",red:"#FF3B30",green:"#34C759",purple:"#AF52DE",orange:"#FF9500",white:"#FFFFFF"},Ye=/^#?([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/;function V(t){let r=Ye.exec(t.trim());if(r)return{kind:"solid",hex:`#${r[1].toUpperCase()}`,opacity:r[2]===void 0?1:parseInt(r[2],16)/255};let e=Ke[t.trim()];return e===void 0?void 0:{kind:"solid",hex:e,opacity:1}}function ne(t){if(typeof t=="string"){if(t.trim().toUpperCase()==="#RAINBOW")return{kind:"rainbow"};if(t.startsWith("GRADIENT|")){let[,r="",e=""]=t.split("|"),i=V(r),n=V(e);return i?.kind==="solid"&&n?.kind==="solid"?{kind:"gradient",from:i.hex,to:n.hex}:void 0}return V(t)}}function Ie(t,r="#FFFFFF"){return t===void 0||t.kind==="rainbow"?r:t.kind==="gradient"?t.from:t.hex}function M(t,r,e){return typeof t=="number"&&Number.isFinite(t)?Math.max(e,Math.trunc(t)):r}function Ce(t){return{col:M(t.gridCol,0,0),row:M(t.gridRow,0,0),colSpan:M(t.colSpan,1,1),rowSpan:M(t.rowSpan,1,1)}}function Re(t){let r=0;for(let e of S(t)){let i=Ce(e);r=Math.max(r,i.row+i.rowSpan)}return r}function Ae(t,r){let i=(r.width-22)/12,n=i+2,s=S(t),a=s.map(Ce),l=s.map(h=>T(P(h))==="divider"),d=[...new Set(a.filter((h,f)=>l[f]).map(h=>h.row))].sort((h,f)=>h-f),c=h=>h===0?0:i*.6+(h-1)*i*.4,b=h=>c(d.filter(f=>f<h).length),D=h=>c(d.filter(f=>f<=h).length),v=0,_=s.map((h,f)=>{let m=a[f],z=i*m.colSpan+2*(m.colSpan-1),I=i*m.rowSpan+2*(m.rowSpan-1);v=Math.max(v,m.row*n+I);let F=m.row*n-(l[f]?D(m.row):b(m.row));return{tile:h,index:f,x:m.col*n,y:F,width:z,height:I}}),W=(s.length===0?r.height:Math.max(v,r.height))-c(d.length),x=t.fullScreen===!0?0:34;return{unit:i,spacing:2,topInset:x,screen:{...r},tiles:_,contentHeight:W,height:Math.max(r.height,x+W)}}function Le(t){return new TextEncoder().encode(JSON.stringify(t)).length}function Me(t){return{loaded:t,document:t}}var He=16,Oe=6;function O(t,r){let e=parseInt(t.slice(1,7),16);return`rgba(${e>>16&255}, ${e>>8&255}, ${e&255}, ${Math.round(r*1e3)/1e3})`}function Xe(t){return t===void 0?"rgba(255, 255, 255, 0.12)":t.kind==="solid"?O(t.hex,.3*t.opacity):t.kind==="gradient"?`linear-gradient(135deg, ${O(t.from,.38)}, ${O(t.to,.38)})`:"linear-gradient(135deg, rgba(255,59,48,.35), rgba(255,149,0,.35), rgba(255,204,0,.35), rgba(52,199,89,.35), rgba(0,122,255,.35), rgba(175,82,222,.35))"}function Ne(t){let r=ne(t.backgroundColor);return r?.kind==="solid"?O(r.hex,r.opacity):"#000"}function Ze(t,r,e,i){let n=r===void 0?void 0:t?.render(r,e,i);return o`<svg class="wp-sym" width=${e} height=${e} viewBox=${`0 0 ${e} ${e}`} aria-hidden="true">${n??ae`<circle cx=${e/2} cy=${e/2} r=${e/5} fill=${i} fill-opacity="0.7" />`}</svg>`}function Qe(t,r,e,i,n){let{tile:s,x:a,y:l,width:d,height:c}=t,b=P(s),D=T(b),v=ee(b,r.states),_=`left:${a*n}px;top:${(i+l)*n}px;width:${d*n}px;height:${c*n}px;`,E=ne(s.color),W=Ie(E),x=Te(s,r.states,r.pages),h=Z(D),f=[x,h,b].filter((A,Ue,qe)=>A!==""&&qe.indexOf(A)===Ue).join(" \xB7 ");if(v==="divider"){let{style:A}=te(b);return o`<div class="wp-divider" style=${`${_}--ink:${W};font-size:${9*n}px`} title=${f}>
      ${A==="label"&&x!==""?o`<span class="wp-divider-label">${x}</span>`:u}
      <span class="wp-divider-line"></span>
    </div>`}if(v==="spacer")return o`<div class="wp-spacer" style=${`${_}border-radius:${Math.min(He,d/2,c/2)*n}px`} title=${f}></div>`;let m=v==="unknown",z=Math.min(He,d/2,c/2)*n,I=c<e*2.5,F=Math.max(9,Math.min(24,Math.min(d,c)*(I?.5:.3))),se=m||v==="virtual"?h:We(s,r.states),je=_e(s),Be=m?"rgba(255, 255, 255, 0.08)":Xe(E);return o`<div class="wp-tile ${I?"compact":""} ${m?"unknown":""}"
    style=${`${_}border-radius:${z}px;background:${Be};padding:${Math.min(Oe,c/4)*n}px ${Math.min(Oe+1,d/4)*n}px;gap:${3*n}px`}
    title=${f}>
    ${Ze(r.icons,m?void 0:Pe(s),F*n,m?"#8E8E93":W)}
    <span class="wp-words">
      ${je?o`<span class="wp-label" style=${`font-size:${10.5*n}px`}>${x}</span>`:u}
      ${se===void 0?u:o`<span class="wp-state" style=${`font-size:${9*n}px`}>${se}</span>`}
    </span>
  </div>`}function De(t){let r=t.scale??1.5,{page:e,screen:i}=t,n=i.width*r,s=y(e);if(R(e)){let d=ke(e).map(Q);return o`<div class="wp-screen" role="img" aria-label=${`${s}, a smart page`}
      style=${`width:${n}px;height:${i.height*r}px;background:${Ne(e)}`}>
      <div class="wp-smart">
        <b>Smart page</b>
        <span>${d.length>0?`The watch fills this page itself with: ${d.join(", ")}.`:"The watch fills this page itself."}</span>
      </div>
    </div>`}let a=Ae(e,i),l=a.height>i.height+.5;return o`<div class="wp-screen" role="group" aria-label=${`Preview of ${s}`}
    style=${`width:${n}px;height:${a.height*r}px;background:${Ne(e)}`}>
    ${a.topInset>0?o`<span class="wp-clock" style=${`font-size:${13*r}px;height:${a.topInset*r}px;padding-right:${12*r}px`}>10:09</span>`:u}
    ${a.tiles.length===0?o`<div class="wp-smart"><span>No tiles on this page.</span></div>`:u}
    ${a.tiles.map(d=>Qe(d,t,a.unit,a.topInset,r))}
    ${l?o`<div class="wp-fold" style=${`top:${i.height*r}px`}><span>End of the screen, the page scrolls on</span></div>`:u}
  </div>`}var Ee=L`
  .wp-screen {
    position: relative;
    flex: none;
    overflow: hidden;
    border-radius: 28px;
    box-shadow: 0 0 0 6px var(--wa-art-case, #2b2f3d);
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", Roboto, sans-serif;
    line-height: 1.15;
  }
  .wp-clock {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    font-variant-numeric: tabular-nums;
  }
  .wp-tile {
    position: absolute;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    overflow: hidden;
  }
  .wp-tile.compact { flex-direction: row; align-items: center; justify-content: flex-start; }
  .wp-tile.unknown { outline: 1px dashed rgba(255, 255, 255, 0.3); outline-offset: -1px; }
  .wp-sym { display: block; flex: none; }
  .wp-words { display: flex; flex-direction: column; min-width: 0; max-width: 100%; }
  .wp-label, .wp-state { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .wp-label { font-weight: 600; }
  .wp-state { color: rgba(255, 255, 255, 0.62); }
  .wp-spacer {
    position: absolute;
    box-sizing: border-box;
    border: 1px dashed rgba(255, 255, 255, 0.28);
  }
  .wp-divider {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--ink);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .wp-divider-label { flex: none; max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .wp-divider-line { flex: 1; height: 1px; background: var(--ink); opacity: 0.55; }
  .wp-fold {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed rgba(255, 255, 255, 0.55);
    pointer-events: none;
  }
  .wp-fold > span {
    position: absolute;
    right: 8px;
    top: 2px;
    padding: 1px 6px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.7);
    color: rgba(255, 255, 255, 0.8);
    font-size: 10px;
  }
  .wp-smart {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 24px;
    text-align: center;
    color: rgba(255, 255, 255, 0.75);
    font-size: 13px;
  }
  .wp-smart > b { color: #fff; font-size: 15px; }
`;var et=15e3,tt="Open the iPhone app once with Save pages to Home Assistant turned on.";function Fe(t){return String(t?.message??t)}function N(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function ie(t){let r=t?Date.parse(t):NaN;return Number.isNaN(r)?"":ue(Math.max(0,(Date.now()-r)/1e3))}function re(t){return t==="panel"?"Saved here":"From the iPhone"}var p=class extends oe{constructor(){super(...arguments);this.owners=[];this.narrow=!1;this.loading=!1;this.pageIndex=0;this.history=[];this.historyState="loading";this.restoring=!1;this.ownListAsked=!1;this.loadSeq=0;this.subscribeSeq=0}get watches(){return ve(this.owners.length>0?this.owners:this.ownList??[])}connectedCallback(){super.connectedCallback(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.endSubscription(),this.stopPolling(),this.iconTimer!==void 0&&window.clearInterval(this.iconTimer),this.iconTimer=void 0,this.loadSeq++}willUpdate(e){if(!this.hass)return;this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,le(this.hass).then(n=>{this.ownList=n.owners},()=>{this.ownList=[]}));let i=this.watches;if(this.watchId===void 0||!i.some(n=>n.owner_watch_id===this.watchId)){let n=xe(i,this.ownerId);n!==void 0&&n!==this.watchId&&this.openWatch(n)}e.has("icons")&&this.waitForSymbols()}updated(){let e=this.renderRoot.querySelector("dialog.pe-ask");e&&!e.open&&e.showModal()}waitForSymbols(){this.iconTimer!==void 0&&window.clearInterval(this.iconTimer),this.iconTimer=void 0;let e=this.icons;if(!e||e.names()!==void 0)return;let i=0;this.iconTimer=window.setInterval(()=>{i++,(e.names()!==void 0||i>60)&&(window.clearInterval(this.iconTimer),this.iconTimer=void 0,this.requestUpdate())},500)}openWatch(e,i=!1){e!==this.watchId&&(this.watchId=e,this.note=void 0,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),i=!1),this.startSubscription(e),this.load(e,i)}async load(e,i=!1){let n=this.hass;if(!n)return;let s=++this.loadSeq;this.stopPolling(),i||(this.record=void 0,this.model=void 0,this.loading=!0,this.loadError=void 0);try{let a=await j(n,e,"pages");if(s!==this.loadSeq)return;this.show(a),this.loadError=void 0}catch(a){if(s!==this.loadSeq)return;i||(this.loadError=Fe(a))}this.loading=!1,this.pollIfWaiting(),this.loadHistory(e)}show(e){let i=this.model?C(this.model.document)[this.pageIndex]:void 0,n=i?H(i):"";this.record=e;let s=J(e.document);this.model=s===void 0?void 0:Me(s);let a=C(this.model?.document),l=n===""?-1:a.findIndex(d=>H(d)===n);this.pageIndex=l>=0?l:Math.min(this.pageIndex,Math.max(0,a.length-1))}async loadHistory(e){let i=this.hass;if(!(!i||this.historyState==="unsupported"))try{let n=await de(i,e,"pages");if(e!==this.watchId)return;this.history=Array.isArray(n?.entries)?n.entries:[],this.historyState="ready"}catch(n){if(e!==this.watchId)return;this.historyState=q(n)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let i=this.hass;if(this.endSubscription(),!i)return;let n=++this.subscribeSeq;he(i,e,s=>{n!==this.subscribeSeq||s.kind!=="pages"||s.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(s=>{n===this.subscribeSeq?this.unsubscribe=s:s().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||B(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},et))}async poll(){this.pollTimer=void 0;let e=this.hass,i=this.watchId,n=this.record;if(!(!e||i===void 0||n===void 0)){try{let s=await j(e,i,"pages");if(i!==this.watchId||this.record!==n)return;s.revision===n.revision?this.record={...n,delivered_revision:s.delivered_revision,delivered_at:s.delivered_at,rejected_revision:s.rejected_revision,rejected_at:s.rejected_at}:(this.show(s),this.loadHistory(i))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}askRestore(e){let i=this.hass,n=this.watchId;if(!i||n===void 0)return;let s={entry:e};this.restoreAsk=s,ce(i,n,"pages",e.revision).then(a=>{if(this.restoreAsk!==s)return;let l=C(J(a.document)),d=l.reduce((c,b)=>c+S(b).length,0);this.restoreAsk={entry:e,summary:`${l.length} ${l.length===1?"page":"pages"}, ${d} ${d===1?"tile":"tiles"}: ${l.map(y).join(", ")}`}},()=>{})}closeAsk(){this.renderRoot.querySelector("dialog.pe-ask")?.close()}async restore(){let e=this.hass,i=this.watchId,n=this.record,s=this.restoreAsk;if(!(!e||i===void 0||n===void 0||s===void 0||this.restoring)){this.restoring=!0;try{let a=await pe(e,i,"pages",s.entry.revision,n.revision);this.note={kind:"ok",text:`Revision ${s.entry.revision} is back, saved as revision ${a.revision}. The iPhone picks it up the next time it checks.`}}catch(a){let l=q(a);l==="conflict"?this.note={kind:"warn",text:"Not restored. The pages changed somewhere else, so the newest copy is shown."}:l==="no_record"?this.note={kind:"warn",text:"Not restored. Home Assistant no longer holds pages for this watch."}:l==="not_found"?this.note={kind:"warn",text:"Not restored. That save is no longer kept."}:l==="unknown_command"?(this.historyState="unsupported",this.note={kind:"warn",text:"This version of the integration cannot restore pages. Update it to restore an earlier save."}):this.note={kind:"err",text:`Could not restore: ${Fe(a)}`}}finally{this.restoring=!1,this.closeAsk()}i===this.watchId&&this.load(i,!0)}}render(){let e=this.watches,i=e.length===1?e[0]:void 0;return o`
      <div class="pe-head">
        <div class="pe-title">
          <h2>Watch pages</h2>
          <span>${i?`${G(i,e)}. `:""}Shown as Home Assistant keeps them. Edit pages in the iPhone app for now.</span>
        </div>
        ${e.length>1?this.renderTabs(e):u}
      </div>
      ${this.note?o`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
        <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:u}
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderAsk(this.restoreAsk):u}
    `}renderTabs(e){let i=me(this.owners.length>0?this.owners:this.ownList??[]);return o`<div class="pe-tabs" role="tablist" aria-label="Watches">
      ${e.map(n=>{let s=i.findIndex(d=>d.owners.some(c=>c.owner_watch_id===n.owner_watch_id)),a=be(s),l=n.owner_watch_id===this.watchId;return o`<button type="button" role="tab" class="pe-tab ${l?"on":""}" aria-selected=${l?"true":"false"}
          style=${a?`--pe-person: ${a}`:u}
          @click=${()=>{l||this.openWatch(n.owner_watch_id)}}>
          <span class="pe-tab-glyph" aria-hidden="true">${we("watch")}</span>
          <span class="pe-tab-name">${G(n,e)}</span>
        </button>`})}
    </div>`}renderBody(e){if(e.length===0){let d=this.owners.length===0&&this.ownList===void 0;return o`<div class="pe-empty">${d?"Loading\u2026":"No watch has connected to this Home Assistant yet."}</div>`}if(this.loading)return o`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let d=this.watchId;return o`<div class="pe-empty">
        <span>Could not read this watch's pages: ${this.loadError}</span>
        ${d===void 0?u:o`<button class="pe-btn" @click=${()=>{this.load(d)}}>Try again</button>`}
      </div>`}let i=this.record,n=this.model;if(i===void 0)return o`<div class="pe-empty">Loading…</div>`;if(i.revision<=0||n===void 0)return o`<div class="pe-empty"><b>No pages from this watch yet.</b><span>${tt}</span></div>`;let s=C(n.document),a=s[this.pageIndex],l=e.find(d=>d.owner_watch_id===this.watchId);return o`<div class="pe-grid">
      <nav class="pe-card pe-pages" aria-label="Pages">
        <h3>Pages <span class="pe-count">${s.length}</span></h3>
        ${s.length===0?o`<p class="pe-muted">This watch has no pages.</p>`:u}
        ${s.map((d,c)=>this.renderPageRow(d,c))}
      </nav>
      <section class="pe-card pe-stage" aria-label="Page preview">
        ${a?this.renderStage(a,s,l):o`<p class="pe-muted">Pick a page.</p>`}
      </section>
      <aside class="pe-side">
        ${this.renderState(i,n)}
        ${this.renderHistory(i)}
      </aside>
    </div>`}renderPageRow(e,i){let n=i===this.pageIndex,s=R(e),a=S(e).length;return o`<button type="button" class="pe-page ${n?"on":""}" aria-current=${n?"true":"false"}
      @click=${()=>{this.pageIndex=i}}>
      <span class="pe-page-name">${y(e)}</span>
      <span class="pe-page-meta">
        ${s?o`<span class="pe-badge smart">Smart</span>`:o`<span>${a} ${a===1?"tile":"tiles"}</span>`}
        ${K(e)?o`<span class="pe-badge">Hidden</span>`:u}
        ${ye(e)?o`<span class="pe-badge">System</span>`:u}
      </span>
    </button>`}renderStage(e,i,n){let s=fe(n?.screen_size),a=s??ge,l=R(e),d=S(e).length,c=Re(e),b=[l?"Smart page":`${d} ${d===1?"tile":"tiles"}, ${c} ${c===1?"row":"rows"}`,s?a.label:`${a.label}, this watch's size is not known`];return K(e)&&b.push("hidden on the watch"),o`<div class="pe-stage-head">
        <h3>${y(e)}</h3>
        <span class="pe-muted">${b.join(" \xB7 ")}</span>
      </div>
      <div class="pe-stage-body">
        ${De({page:e,pages:i,screen:a.screen,states:this.hass?.states,icons:this.icons,scale:this.narrow?1.25:1.5})}
      </div>`}renderState(e,i){let n=B(e),s=U(e),a=Le(i.document),l=a/25e4,d=ie(e.updated_at);return o`<div class="pe-card pe-state">
      <h3>Stored copy</h3>
      <p><b>Revision ${e.revision}</b> · ${re(e.updated_by)}${d?` ${d}`:""}</p>
      ${s?o`<p class="pe-pill err"><i aria-hidden="true"></i>The iPhone could not read this save</p>
          <p class="pe-muted">${this.historyState==="unsupported"?"Save the pages again from the iPhone.":"Restore an earlier save below."}</p>`:n==="delivered"?o`<p class="pe-pill ok" title=${`The iPhone has revision ${e.revision} and passes it to the watch.`}><i aria-hidden="true"></i>On the iPhone</p>`:o`<p class="pe-pill warn"><i aria-hidden="true"></i>Waiting for the iPhone</p>
          <p class="pe-muted">The iPhone picks it up the next time Wrist Assistant opens or comes to the front.</p>`}
      <p class=${l>.8?"pe-warn":"pe-muted"}>${N(a)} of the ${N(25e4)} the watch takes${l>.8?". Close to the limit.":""}</p>
    </div>`}renderHistory(e){if(this.historyState==="unsupported")return u;let i=this.history,n=U(e),s;if(this.historyState==="loading")s=o`<p class="pe-muted">Loading…</p>`;else if(this.historyState==="error"){let a=this.watchId;s=o`<p class="pe-muted">Could not load the earlier saves.</p>
        ${a===void 0?u:o`<button class="pe-btn" @click=${()=>{this.historyState="loading",this.loadHistory(a)}}>Try again</button>`}`}else if(i.length===0)s=o`<p class="pe-muted">No earlier saves yet.</p>`;else{let a=n?i.find(l=>l.revision<e.revision)?.revision:void 0;s=o`<ul class="pe-history">
        ${i.map(l=>{let d=l.revision===e.revision,c=ie(l.updated_at);return o`<li class=${l.revision===a?"offer":""}>
            <span class="pe-h-text">
              <b>Revision ${l.revision}</b>
              <span class="pe-muted">${re(l.updated_by)}${c?` ${c}`:""} · ${N(l.size)}</span>
            </span>
            ${d?o`<span class="pe-badge">Current</span>`:o`<button class="pe-btn ${l.revision===a?"primary":""}" ?disabled=${this.restoring}
                  @click=${()=>this.askRestore(l)}>Restore</button>`}
          </li>`})}
      </ul>`}return o`<div class="pe-card pe-past"><h3>Earlier saves</h3>${s}</div>`}renderAsk(e){let i=this.record,n=ie(e.entry.updated_at);return o`<dialog class="pe-ask" aria-labelledby="pe-ask-title"
      @cancel=${s=>{this.restoring&&s.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="pe-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${re(e.entry.updated_by)}${n?` ${n}`:""}, ${N(e.entry.size)}.</p>
      ${e.summary?o`<p class="pe-muted">${e.summary}</p>`:u}
      <p>It is saved again as a new revision${i?`, after revision ${i.revision}`:""}. The copy shown now stays in the earlier saves. The iPhone picks it up the next time it checks and sends it to the watch.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Ee,L`
    :host {
      display: block;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      padding: 16px;
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; }
    h2, h3, p { margin: 0; }
    h2 { font-size: 20px; font-weight: 650; }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }

    .pe-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 24px; margin-bottom: 14px; }
    .pe-title { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1 1 280px; }
    .pe-title > span { color: var(--wa-muted); font-size: 13px; }

    .pe-tabs { display: flex; flex-wrap: wrap; gap: 6px; }
    .pe-tab {
      display: inline-flex; align-items: center; gap: 6px; min-height: 32px; padding: 0 12px;
      border: 1px solid var(--wa-line); border-radius: 999px; background: var(--wa-card);
      color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-tab:hover { border-color: var(--wa-line-strong); }
    .pe-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-tab.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
    .pe-tab-glyph { color: var(--pe-person, var(--wa-muted)); }

    .pe-note {
      display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .pe-note > span { flex: 1; min-width: 0; }
    .pe-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
    .pe-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .pe-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .pe-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; cursor: pointer; }

    .pe-empty {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 560px;
      padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }

    /* Three columns when there is room: the pages, the picture, the record.
       One column, in that order, when there is not. */
    .pe-grid {
      display: grid;
      grid-template-columns: minmax(180px, 240px) minmax(0, 1fr) minmax(240px, 300px);
      gap: 14px;
      align-items: start;
    }
    @container (max-width: 820px) {
      .pe-grid { grid-template-columns: minmax(0, 1fr); }
    }
    .pe-card {
      display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 14px;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .pe-side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
    .pe-count { margin-left: 4px; font-weight: 500; }

    .pe-page {
      display: flex; flex-direction: column; align-items: flex-start; gap: 3px; width: 100%; padding: 8px 10px;
      border: 1px solid transparent; border-radius: var(--wa-r-sm, 8px); background: none;
      color: var(--wa-ink); font: inherit; text-align: left; cursor: pointer;
    }
    .pe-page:hover { background: var(--wa-field); }
    .pe-page:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-page.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); }
    .pe-page-name { max-width: 100%; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pe-page-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; color: var(--wa-muted); font-size: 12px; }
    .pe-badge {
      display: inline-block; padding: 1px 7px; border-radius: 999px; font-size: 11px; font-weight: 600;
      color: var(--wa-muted); background: var(--wa-field); white-space: nowrap;
    }
    .pe-badge.smart { color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 14%, transparent); }

    .pe-stage { align-items: stretch; }
    .pe-stage-head { display: flex; flex-direction: column; gap: 2px; }
    .pe-stage-head h3 { font-size: 16px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); }
    /* The picture keeps its size and the card scrolls sideways under it on a
       screen narrower than the watch drawn at this scale. */
    .pe-stage-body { display: flex; justify-content: center; padding: 14px 8px 10px; overflow-x: auto; }

    .pe-state p { font-size: 13px; }
    .pe-pill {
      display: inline-flex; align-items: center; gap: 7px; align-self: flex-start;
      padding: 3px 10px; border-radius: 999px; font-weight: 600;
    }
    .pe-pill > i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
    .pe-pill.ok { color: var(--wa-green); background: color-mix(in srgb, var(--wa-green) 13%, transparent); }
    .pe-pill.warn { color: var(--wa-amber); background: var(--wa-amber-bg); }
    .pe-pill.err { color: var(--wa-need); background: color-mix(in srgb, var(--wa-need) 13%, transparent); }

    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-history > li.offer .pe-h-text > b { color: var(--wa-accent); }
    .pe-h-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .pe-h-text > .pe-muted { font-size: 12px; }

    .pe-btn {
      flex: none; min-height: 30px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-btn:hover:not(:disabled) { background: var(--wa-panel); }
    .pe-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-btn:disabled { opacity: .55; cursor: default; }
    .pe-btn.primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .pe-btn.primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }

    dialog.pe-ask {
      width: min(440px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }

    :host([narrow]) { padding: 12px; }
  `]}};g([k({attribute:!1})],p.prototype,"hass",2),g([k({attribute:!1})],p.prototype,"owners",2),g([k({attribute:!1})],p.prototype,"ownerId",2),g([k({type:Boolean,reflect:!0})],p.prototype,"narrow",2),g([k({attribute:!1})],p.prototype,"icons",2),g([w()],p.prototype,"watchId",2),g([w()],p.prototype,"record",2),g([w()],p.prototype,"model",2),g([w()],p.prototype,"loading",2),g([w()],p.prototype,"loadError",2),g([w()],p.prototype,"pageIndex",2),g([w()],p.prototype,"history",2),g([w()],p.prototype,"historyState",2),g([w()],p.prototype,"note",2),g([w()],p.prototype,"restoreAsk",2),g([w()],p.prototype,"restoring",2),g([w()],p.prototype,"ownList",2);customElements.get("wa-page-editor")||customElements.define("wa-page-editor",p);export{p as WaPageEditor};
