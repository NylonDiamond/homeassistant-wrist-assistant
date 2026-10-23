import{$ as nr,A as M,B as Lt,C as It,D as zt,E as ie,F as Nt,G as Bt,H as oe,I as Ut,J as se,K as Wt,L as Ft,M as Kt,N as Vt,O as ae,P as qt,Q as de,R as jt,S as Zt,T as Gt,U as Xt,V as Yt,W as Jt,X as Qt,Y as er,Z as tr,_ as rr,a as j,aa as ir,b as x,c as Z,d as G,e as R,f as St,g as T,h as X,i as Y,j as Tt,k as J,l as C,m as Ot,n as Q,o as Ht,p as Et,q as _t,r as Pt,s as At,t as ee,u as Ct,v as te,w as re,x as Mt,y as ne,z as Dt}from"./chunk-UMGOUHEA.js";import{h as ur}from"./chunk-OA6DS6RJ.js";import{B as q,J as Rt,s as $t}from"./chunk-TZIWUID7.js";import"./chunk-3G6SC6DM.js";import{a as or,b as sr,c as ar,d as dr,e as cr,f as lr,g as pr}from"./chunk-G2XMT6V4.js";import"./chunk-27VXOWKT.js";import"./chunk-CHKZKW42.js";import{a as W,b as ot,c as st,d as at,e as F,f as dt,g as ct,h as lt,i as pt,j as ht,k as mt,l as ut}from"./chunk-LUNUSFWQ.js";import{d as vt}from"./chunk-7O325OCR.js";import{a as nt,b as it}from"./chunk-RZEK6ZG7.js";import{a as xt,b as kt}from"./chunk-DBIWFKAB.js";import{c as ft,d as gt,f as wt}from"./chunk-SV3BTW33.js";import{c as Ae}from"./chunk-HYO6YZS2.js";import{$a as tt,Pb as rt,U as Qe,Vb as U,Z as et,bc as A,qd as hr,sd as mr}from"./chunk-WKBCTV4W.js";import{k as K,l as V,n as yt,o as bt}from"./chunk-TUSU5T3G.js";import{a as Xe,b as Ye,c as Je}from"./chunk-PGFAOWAG.js";import{Eg as S,Gg as He,Ih as Ne,Jg as Ee,Lg as _e,Mg as Pe,b as _,d as a,e as z,g as l,ig as Oe,j as Te,k as b,l as g,nh as v,oh as Ce,rh as Me,th as De,vh as Le,xh as Ie,yh as ze}from"./chunk-BDP52PL7.js";import{$ as qe,D as Be,G as Ue,O as We,P as Fe,T as Ke,Ua as Ge,W as N,Xa as P,Z as B,_ as Ve,aa as je,ia as Ze}from"./chunk-TGJNCNIU.js";import{a as m}from"./chunk-LO2NM3CE.js";var Cr=100,D=class{constructor(n,e){this.edits=new Map;this.undoStack=[];this.redoStack=[];this.saving=!1;this.document=n,this.revision=e}get effective(){return Tt(this.document,this.edits)}get pending(){return this.edits}get dirty(){return C(this.document,this.edits).length>0}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}apply(n,e){if(this.saving)return!1;let r=J(this.document,this.edits,n);return Mr(r,this.edits)?!1:((e===void 0||e!==this.coalesceKey)&&(this.undoStack.push(new Map(this.edits)),this.undoStack.length>Cr&&this.undoStack.shift()),this.coalesceKey=e,this.redoStack=[],this.edits=r,!0)}endCoalesce(){this.coalesceKey=void 0}undo(){if(this.saving)return!1;let n=this.undoStack.pop();return n===void 0?!1:(this.redoStack.push(this.edits),this.edits=n,this.coalesceKey=void 0,!0)}redo(){if(this.saving)return!1;let n=this.redoStack.pop();return n===void 0?!1:(this.undoStack.push(this.edits),this.edits=n,this.coalesceKey=void 0,!0)}discard(){return this.edits.size===0||this.saving?!1:(this.undoStack.push(this.edits),this.redoStack=[],this.edits=new Map,this.coalesceKey=void 0,!0)}rebase(n,e){let r=Ot(this.document,n,this.edits);return this.document=n,this.revision=e,this.edits=J(n,new Map,r),this.undoStack=[],this.redoStack=[],this.coalesceKey=void 0,this.edits.size>0}};function Mr(t,n){if(t.size!==n.size)return!1;for(let[e,r]of t)if(!n.has(e)||JSON.stringify(r)!==JSON.stringify(n.get(e)))return!1;return!0}var $=new Map;function L(t){return $.get(t)}function fr(t){$.delete(t)}function ce(t,n,e){let r=$.get(t);if(r===void 0){let s=new D(n,e);return $.set(t,s),{draft:s,mergedIntoEdits:!1}}if(r.saving||e===r.revision)return{draft:r,mergedIntoEdits:!1};let i=r.dirty,o=r.rebase(n,e);return{draft:r,mergedIntoEdits:i&&o}}function le(t,n){let e=$.get(t);if(e===void 0){let r=new D(n,0);return $.set(t,r),r}return e.revision>0&&!e.saving&&e.rebase(n,0),e}function pe(){for(let t of $.values())if(t.dirty)return!0;return!1}function gr(){for(let[t,n]of $)n.saving||$.delete(t)}async function wr(t,n){if(t.saving)return{ok:!1,code:"busy",message:"A save is running."};let e=new Map(t.pending);t.saving=!0;let r=Ut(n,{revision:t.revision,document:t.document},e);t.saveDone=r;try{let i=await r;if(t.saving=!1,i.ok)t.rebase(i.document,i.revision);else if(i.fresh!==void 0&&i.fresh.revision>0){let o=i.fresh.document;o!==void 0&&typeof o=="object"&&!Array.isArray(o)&&t.rebase(o,i.fresh.revision)}return i}finally{t.saving=!1}}var vr="var(--wa-hue-pink)",fe={width:208,height:248};function me(t,n){let e=t.states[n]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:n}function ge(t,n){let e=n.indexOf(".");return{entityId:n,displayName:n===""?"":me(t,n),domain:e<0?"":n.slice(0,e)}}function we(t,n){return n.some(e=>t.dirty.has(e))}function ve(t){return t?a`<span class="sec-dot rm-dirty" title="Changed, not saved yet" aria-label="Changed"></span>`:l}function ye(t,n,e=!1){let r=t.uiState.get(n);return typeof r=="boolean"?r:e}function be(t,n,e){t.uiState.set(n,!e),t.requestUpdate()}function Dr(t,n){if(n==="")return{line:xr,tone:"none"};let e=t.states[n];if(e===void 0)return{line:"Home Assistant has no entity with this id now.",tone:"warn"};let r=St(n,e),i=typeof e.state=="string"?e.state:"";if(r===void 0)return{line:`Now "${i}", which the watch does not read as a room.`,tone:"warn"};let o=R(r);return{line:`Now in ${r}${o===""?", whose name has no letter or digit the watch can match":""}.`,tone:o===""?"warn":"ok"}}var ue="https://github.com/agittins/bermuda",xr="No room sensor picked. The watch looks for one by its name, such as a Bermuda area sensor. Pick one to be sure.",Lr="Bermuda uses Bluetooth to tell which room your watch is in. Rooms works best with its area sensor. Add Bermuda to Home Assistant, then pick its sensor here.";function Ir(t,n){if(n==="")return!1;let e=t.states[n];if((typeof e?.attributes?.device_class=="string"?e.attributes.device_class:"").toLowerCase().startsWith("bermuda"))return!0;let i=typeof e?.attributes?.friendly_name=="string"?e.attributes.friendly_name:"";return`${n} ${i}`.toLowerCase().includes("bermuda")}function zr(t){let n=t.indexOf("Bermuda");return n<0?t:a`${t.slice(0,n)}<a href=${ue} target="_blank" rel="noopener noreferrer">Bermuda</a>${t.slice(n+7)}`}function kr(t,n,e){let r=[...e,...t.map(i=>[i.id,i.name])];return n!==""&&!e.some(([i])=>i===n)&&M(t,n)===void 0&&r.push([n,"A page not on this watch"]),r}function $r(t,n){return M(t,n)?.id??n}function Nr(t,n){return n===""?"":M(t.pages,n)?.name??"A page not on this watch"}function Rr(t,n){let e=n.trim().toLowerCase();if(e!=="")return V(t.pagesDocument).find(r=>yt(r).toLowerCase()===e)}function xe(t,n,e,r,i,o=""){return a`<select class="rm-select ${o}" aria-label=${t} ?disabled=${i}
    @click=${s=>s.stopPropagation()}
    @change=${s=>{i||r(s.target.value)}}>
    ${e.map(([s,d])=>a`<option value=${s} .selected=${s===n}>${d}</option>`)}
  </select>`}function Br(t){return t.rooms.filter(n=>ne(t.view,n,t.added??[]))}function Ur(t){return t.rooms.filter(n=>n.area&&!ne(t.view,n,t.added??[]))}function Wr(t,n){let e=t.uiState.get("pick");return n.find(r=>r.key===e)??n[0]}function Fr(t,n=[]){let e=new Set(n.map(o=>o.id)),r=n.map(o=>({name:o.name,rooms:t.filter(s=>s.floorId===o.id)})).filter(o=>o.rooms.length>0),i=t.filter(o=>o.floorId===void 0||!e.has(o.floorId));return i.length>0&&r.push({name:r.length>0?"Other":"",rooms:i}),r}function O(t,n){t.uiState.set("pick",n),t.requestUpdate()}function Kr(t,n){let e=t.view.zones.ok?te(t.view.zones.rooms,n.key).length:0;return e===0?"":e===1?"1 thing to point at":`${e} things to point at`}function Sr(t,n){let e=R(n);e!==""&&(t.addRoom(n.trim()),O(t,e))}function Vr(t){return t.home===!0?Gt(t.document):t.view.switching}function yr(t){let{view:n}=t;return a`<div class="rm-stack rm-sensor-field" title=${n.sensor===""?"":"Clearing the sensor turns Switch pages by room off."}>${A({hass:t.hass},"Room sensor",ge(t.hass,n.sensor),e=>{t.busy||t.write(Ht(t.document,e.entityId))},"rooms:sensor",{clearable:!0})}</div>`}function br(t){let n=t.home===!0,e=Vr(t),r=n?ir:"Switch pages by room",i=d=>{t.busy||t.write(n?Xt(t.document,d):Et(t.document,d))},o=j.switching.triggers,s=o.find(d=>d.value===t.view.trigger)?.help??"";return a`<div class="rm-status-switch">${U(r,e,i)}</div>
    ${n?a`<p class="rm-help rm-status-wide rm-main-house">${t.phone===!0?er:Qt}</p>`:e?a`<div class="rm-when rm-status-wide">
        <span class="rm-when-l" id="rm-when-l">Switch</span>
        <div class="seg rm-seg" role="radiogroup" aria-labelledby="rm-when-l">
          ${o.map(d=>{let p=d.value===t.view.trigger;return a`<button type="button" role="radio" aria-checked=${p?"true":"false"} class=${p?"on":""} ?disabled=${t.busy}
              @click=${()=>{!t.busy&&!p&&t.write(_t(t.document,d.value))}}>${d.label}</button>`})}
        </div>
        <span class="rm-when-help">${s}</span>
      </div>`:l}`}var qr=[x.sensor,x.autoSwitch,x.legacyQuickJump,x.topSectionDoubleTap,x.handGesture];function jr(t){let{view:n}=t,e=ve(we(t,qr));if(n.sensor==="")return a`<section class="rm-card rm-lit rm-start" aria-label="Start here">
      <span class="rm-eyebrow">Start here${e}</span>
      <h3 class="rm-start-title">Tell the watch which room you are in</h3>
      <p class="rm-pitch">${Lr}</p>
      <div class="rm-start-row">
        ${yr(t)}
        <a class="rm-btn rm-bermuda-link" href=${ue} target="_blank" rel="noopener noreferrer">Get Bermuda</a>
      </div>
      <p class="rm-help">${zr(xr)}</p>
      <div class="rm-start-switch">${br(t)}</div>
    </section>`;let r=ye(t,"sensorOpen"),i=Ir(t.hass,n.sensor),o=Dr(t.hass,n.sensor);return a`<section class="rm-card rm-lit rm-status" aria-label="Switch pages by room">
    <span class="rm-ichip" aria-hidden="true">${v("home")}</span>
    <div class="rm-status-text">
      <p class="rm-now">The watch opens a room's page when the room sensor says you walked in.${e}</p>
      <div class="rm-sensor-line">
        ${i?a`<span class="rm-bermuda-ok">${v("check")}<span>${me(t.hass,n.sensor)}, a Bermuda sensor</span></span>`:a`<span class="rm-sensor-name">${me(t.hass,n.sensor)}.</span>
            <span class="rm-sensor-hint"><a href=${ue} target="_blank" rel="noopener noreferrer">Bermuda</a> works best.</span>`}
        <button type="button" class="rm-btn rm-small" aria-expanded=${r?"true":"false"}
          @click=${()=>be(t,"sensorOpen",r)}>${r?"Done":"Change"}</button>
      </div>
    </div>
    ${!r&&o.tone==="warn"?a`<div class="rm-reading rm-status-wide"><i class="rm-dot warn" aria-hidden="true"></i><span>${o.line}</span></div>`:l}
    ${r?a`<div class="rm-sensor-edit rm-status-wide">
      ${yr(t)}
      <div class="rm-reading"><i class="rm-dot ${o.tone}" aria-hidden="true"></i><span>${o.line}</span></div>
    </div>`:l}
    ${br(t)}
  </section>`}var he=.16;function Tr(t,n){return Math.round((t.screen??fe).height*n*100)/100}function Or(t,n){let e=Rr(t,n),r=t.screen??fe,i=`--rm-screen-h: ${Tr(t,he)}px; --rm-thumb-w: ${Math.round(r.width*he)}px`;return e===void 0?a`<span class="rm-thumb empty" aria-hidden="true" style=${i}></span>`:a`<span class="rm-thumb" aria-hidden="true" title=${bt(e)} style=${i}>${q({page:e,pages:[e],screen:r,states:t.hass.states,...t.icons?{icons:t.icons}:{},scale:he})}</span>`}function Zr(t,n,e){let r=ee(t.view,n.key),i=$r(t.pages,r),o=Mt(t.document,n.key),s=o.size>0||(t.added??[]).some(c=>R(c)===n.key),d=c=>{c.stopPropagation(),!t.busy&&(t.forgetRoom?.(n.key),o.size>0&&t.write(o),t.requestUpdate())},p=Kr(t,n);return a`<li class="rm-row ${e?"on":""}" @click=${()=>O(t,n.key)}>
    <span class="rm-row-room">
      <button type="button" class="rm-row-name" aria-pressed=${e?"true":"false"} title="Show this room on the watch"
        @click=${c=>{c.stopPropagation(),O(t,n.key)}}>${n.name}</button>
      ${p===""?l:a`<span class="rm-row-sub">${p}</span>`}
    </span>
    <span class="rm-arrow" aria-hidden="true">${v("arrow")}</span>
    <span class="rm-row-page">
      ${Or(t,r)}
      ${xe(`Page for ${n.name}`,i,kr(t.pages,i,[["","No page"]]),c=>{t.write(Ct(t.document,n.key,c)),O(t,n.key)},t.busy)}
    </span>
    <span class="rm-row-end">${s?a`<button type="button" class="rm-row-x" aria-label=${`Remove ${n.name}`} ?disabled=${t.busy}
      title="Take this room off: its page and its things to point at go. Undo brings them back." @click=${d}>${v("close")}</button>`:l}</span>
  </li>`}function Gr(t,n){let e=String(t.uiState.get("addRoom")??""),r=R(e),i=r!==""&&n.some(s=>s.key===r),o=()=>{r===""||i||(t.uiState.set("addRoom",""),Sr(t,e))};return a`<div class="rm-add-room">
    <input type="text" placeholder="Add a room by name" aria-label="Room name" .value=${e}
      @input=${s=>{t.uiState.set("addRoom",s.target.value),t.requestUpdate()}}
      @keydown=${s=>{s.key==="Enter"&&(s.preventDefault(),o())}} />
    <button type="button" class="rm-btn" ?disabled=${r===""||i} @click=${o}>${v("plus")}<span>Add</span></button>
  </div>
  ${e.trim()!==""&&r===""?a`<p class="rm-help warn">The watch matches room names by their letters a to z and digits, and this name has none.</p>`:l}
  ${i?a`<p class="rm-help">That room is in the list.</p>`:a`<p class="rm-help">For a name the sensor says that is not an area in Home Assistant.</p>`}`}function Xr(t){let n=de(t.view.fallback),e=n==="first"?"":n==="stay"?Z:$r(t.pages,t.view.fallback);return a`<div class="rm-row rm-else">
    <span class="rm-row-room">
      <b class="rm-else-name">Anywhere else</b>
      <span class="rm-row-sub">A room with no page, or when the room cannot be told</span>
    </span>
    <span class="rm-arrow" aria-hidden="true">${v("arrow")}</span>
    <span class="rm-row-page">
      ${Or(t,n==="page"?t.view.fallback:"")}
      ${xe("Page anywhere else",e,kr(t.pages,e,[[Z,ae.stay],["",ae.first]]),r=>t.write(Pt(r)),t.busy)}
    </span>
    <span class="rm-row-end"></span>
  </div>`}function Yr(t,n,e){let r=Ur(t),i=Fr(n,t.floors),o=ye(t,"moreOpen",n.length===0),s=r.length===0?"Add a room":`${r.length} more ${r.length===1?"area":"areas"} in Home Assistant`;return a`<section class="rm-card rm-rules" aria-label="Room pages">
    <div class="rm-rules-head">
      <span class="rm-cap">When I walk into${ve(we(t,[x.mappings,x.fallback]))}</span>
      <span class="rm-cap rm-cap-page">the watch opens</span>
    </div>
    ${n.length===0?a`<div class="rm-none">
          <b>${t.roomsState==="loading"?"Reading your rooms":"No rooms yet"}</b>
          <span>${t.roomsState==="loading"?"The areas and what the room sensor reported.":r.length>0?"Pick an area below, or type a name.":"Type a room's name below."}</span>
        </div>`:i.map(d=>a`<div class="rm-group" role="group" aria-label=${d.name===""?"Rooms":d.name}>
          ${d.name===""?l:a`<span class="rm-floor">${d.name}</span>`}
          <ul class="rm-rows">${d.rooms.map(p=>Zr(t,p,p.key===e?.key))}</ul>
        </div>`)}
    ${Xr(t)}
    <button type="button" class="rm-fold" aria-expanded=${o?"true":"false"} @click=${()=>be(t,"moreOpen",o)}>
      <span class="rm-chev" aria-hidden="true">${v("right")}</span>${s}
    </button>
    ${o?a`<div class="rm-more">
      ${r.length>0?a`<div class="rm-areas">
        ${r.map(d=>a`<button type="button" class="rm-area" title=${`Add ${d.name} to your rooms`} @click=${()=>Sr(t,d.name)}>+ ${d.name}</button>`)}
        <span class="rm-help rm-areas-help">Click one to give it a page.</span>
      </div>`:l}
      ${Gr(t,n)}
    </div>`:l}
  </section>`}function Jr(t,n,e,r){let i=Math.atan2(t-e,r-n)*180/Math.PI;return T(i)}function Qr(t,n,e,r,i){let o=n[e].centerHeading,s=26,d=32,p=(f,w)=>{let y=f*Math.PI/180;return{x:d+Math.sin(y)*w,y:d-Math.cos(y)*w}},c=p(o,s-3),u=f=>{if(t.busy||f.button!==0)return;let w=f.currentTarget,y=w.getBoundingClientRect(),Re=y.width/64,I=Se=>r(Jr((Se.clientX-y.left)/Re,(Se.clientY-y.top)/Re,d,d),i);I(f),w.setPointerCapture?.(f.pointerId);let E=()=>{w.removeEventListener("pointermove",I),w.removeEventListener("pointerup",E),w.removeEventListener("pointercancel",E),t.endCoalesce()};w.addEventListener("pointermove",I),w.addEventListener("pointerup",E),w.addEventListener("pointercancel",E)},k=f=>{let w=f.shiftKey?15:1;if(f.key==="ArrowRight"||f.key==="ArrowUp")r(T(o+w),i);else if(f.key==="ArrowLeft"||f.key==="ArrowDown")r(T(o-w),i);else return;f.preventDefault()};return a`<svg class="rm-dial" viewBox="0 0 64 64" role="slider" tabindex="0" aria-label="Heading"
    aria-valuemin="0" aria-valuemax="359" aria-valuenow=${Math.round(o)} aria-valuetext=${`${Math.round(o)} degrees, ${X(o)}`}
    @pointerdown=${u} @keydown=${k} @blur=${()=>t.endCoalesce()}>
    <circle class="rm-dial-face" cx=${d} cy=${d} r=${s}></circle>
    ${[0,90,180,270].map(f=>{let w=p(f,s-1),y=p(f,s-5);return z`<line class="rm-dial-tick" x1=${w.x} y1=${w.y} x2=${y.x} y2=${y.y}></line>`})}
    <text class="rm-dial-n" x=${d} y="13">N</text>
    ${n.map((f,w)=>{if(w===e)return l;let y=p(f.centerHeading,s-3);return z`<circle class="rm-dial-other" cx=${y.x} cy=${y.y} r="2"></circle>`})}
    <line class="rm-dial-needle" x1=${d} y1=${d} x2=${c.x} y2=${c.y}></line>
    <circle class="rm-dial-tip" cx=${c.x} cy=${c.y} r="3.2"></circle>
    <circle class="rm-dial-hub" cx=${d} cy=${d} r="2.2"></circle>
  </svg>`}function en(t,n,e,r){let i=e[r],o=(p,c)=>{if(t.busy)return;let u=e.flatMap((f,w)=>{if(w!==r)return[f];let y=p(f);return y===void 0?[]:[y]}),k=re(t.document,n,u);k!==void 0&&t.write(k,c)},s=(p,c)=>o(u=>({...u,centerHeading:T(p)}),c),d=`target:${n}:${r}`;return a`<div class="rm-target">
    ${Qr(t,e,r,s,`${d}:heading`)}
    <div class="rm-target-fields">
      <div class="rm-stack">${A({hass:t.hass},"Entity",ge(t.hass,i.entityId),p=>{let c=p.entityId.trim();c===""||c===i.entityId||o(u=>({...u,entityId:c}))},`rooms:${d}:entity`,{domain:G,clearable:!1})}</div>
      <label class="field num rm-heading">
        <span>Heading</span>
        <span class="rm-heading-box">
          <input type="number" min="0" max="359" step="1" .value=${String(Math.round(i.centerHeading))} ?disabled=${t.busy}
            aria-label="Heading in degrees"
            @change=${p=>{let c=p.target,u=Number(c.value);if(c.value.trim()===""||Number.isNaN(u)){c.value=String(Math.round(i.centerHeading));return}s(u,`${d}:typed`),t.endCoalesce()}} />
          <span class="rm-compass">° ${X(i.centerHeading)}</span>
        </span>
      </label>
      ${rt("Label",i.label??"",p=>o(c=>{let u={entityId:c.entityId,centerHeading:c.centerHeading};return p!==""&&(u.label=p),u},`${d}:label`),{placeholder:Y(i.entityId)})}
    </div>
    <button type="button" class="rm-remove" title="Remove this target" aria-label="Remove this target" ?disabled=${t.busy}
      @click=${()=>o(()=>{})}>${v("close")}</button>
  </div>`}var tn="To read a heading, stand where you point from, face the target and open Heading on the watch (in Connection Health, or on the point control of a room with no targets). Type the number it shows.";function rn(t,n){let{view:e}=t,r=t.uiState.get(`adding:${n.key}`)===!0,i=d=>a`<div class="rm-sub-h">
    <span>Things to point at</span>
    ${e.zones.ok?a`<button type="button" class="lc-btn rm-add-thing" ?disabled=${t.busy} aria-expanded=${r?"true":"false"}
      @click=${()=>{t.uiState.set(`adding:${n.key}`,!r),t.requestUpdate()}}>${r&&d>0?"Done":"+ Add a thing"}</button>`:l}
  </div>`;if(!e.zones.ok)return a`${i(0)}<p class="rm-help warn">${Vt}</p>`;let o=te(e.zones.rooms,n.key),s=`rooms:target-add:${n.key}`;return a`${i(o.length)}
    ${o.length===0&&!r?a`<p class="rm-help">None yet. Add a lamp or a switch you point the watch at in this room.</p>`:l}
    ${o.map((d,p)=>en(t,n.key,o,p))}
    ${r?a`<div class="rm-stack rm-add-target">${A({hass:t.hass},"Add a thing",ge(t.hass,""),d=>{let p=d.entityId.trim();if(p===""||t.busy||o.some(u=>u.entityId===p))return;let c=re(t.document,n.key,[...o,{entityId:p,centerHeading:0,label:Y(p)}]);c!==void 0&&t.write(c),t.uiState.set(`adding:${n.key}`,!1)},s,{domain:G,clearable:!1})}</div>`:l}
    ${o.length>0?a`<p class="rm-help" title=${tn}>Heading is degrees clockwise from north. Drag the dial or type it.</p>`:l}`}function nn(t,n,e,r){return a`<div class="rm-switch">${U(t,n,r)}<p class="rm-help">${e}</p></div>`}function on(t){let{view:n}=t,e={[x.tapToToggle]:n.tapToToggle,[x.liveTile]:n.liveTile};return a`<div class="rm-point-switches" title="One value for every point control tile on this watch.">
    <div class="rm-sub-h"><span>Every room</span></div>
    ${j.pointControl.switches.map(r=>{let i=e[r.key]??r.absent;return nn(r.label,i,i?r.onDetail:r.offDetail,o=>{t.busy||t.write(At(r.key,o))})})}
  </div>`}function sn(t){if(!t.zones.ok)return"The stored targets cannot be read.";let n=t.zones.rooms.map(([,r])=>r.length).filter(r=>r>0),e=n.reduce((r,i)=>r+i,0);return e===0?"Off in every room.":`${e} ${e===1?"thing":"things"} in ${n.length} ${n.length===1?"room":"rooms"}.`}function an(t,n,e){let r=ye(t,"pointOpen"),i=t.home===!0,o=i?[x.zones]:[x.zones,x.tapToToggle,x.liveTile];return a`<section class="rm-card rm-point" aria-label="Point control">
    <button type="button" class="rm-point-head" aria-expanded=${r?"true":"false"} @click=${()=>be(t,"pointOpen",r)}>
      <span class="rm-chev" aria-hidden="true">${v("right")}</span>
      <span class="rm-point-text">
        <span class="rm-point-title">Point control${ve(we(t,o))}</span>
        <span class="rm-point-sub">Point the watch at a lamp to control it. ${sn(t.view)}</span>
      </span>
    </button>
    ${r?a`<div class="rm-point-body">
      ${e===void 0?a`<p class="rm-help">Add a room first, then the things you point at in it.</p>`:a`<label class="rm-point-room">
            <span>Room</span>
            ${xe("Room for point control",e.key,n.map(s=>[s.key,s.name]),s=>O(t,s),!1)}
          </label>
          ${rn(t,e)}`}
      ${i?l:on(t)}
    </div>`:l}
  </section>`}var Hr=1.15;function dn(t,n,e){let r=t.screen??fe,i=t.narrow===!0?1:Hr,o=Rr(t,n);if(o!==void 0)return q({page:o,pages:V(t.pagesDocument),screen:r,states:t.hass.states,...t.icons?{icons:t.icons}:{},scale:i,...t.home===!0?{}:{behavior:t.document}});let s=Nr(t,n);return xt(r,i,a`<div class="wp-screen rm-screen ${s===""?"blank":""}"
    style=${`width:${r.width*i}px;height:${r.height*i}px;background:${$t({},i,r)}`}>
    <span>${s===""?e:s}</span>
  </div>`,s===""?"Watch":`Watch showing ${s}`)}function cn(t,n){let e=t.narrow===!0?1:Hr;if(n===void 0)return a`<div class="card canvas-card lit rm-canvas" aria-label="Preview">
      <div class="rm-stage-head"><span class="rm-eyebrow">Preview</span><b class="rm-stage-title">No rooms yet</b></div>
      <div class="stage-area rm-stage-area rm-empty">
        <div class="rm-empty-watch" aria-hidden="true">${v("home")}</div>
        <span class="rm-empty-text">Add a room and give it a page. When you walk in, the watch opens that page.</span>
      </div>
    </div>`;let r=ee(t.view,n.key),i=t.view.fallback,o=r!==""?r:de(i)==="page"?i:"",s=r!==""?"":o!==""?"No page for this room, so the watch opens Anywhere else.":"";return a`<div class="card canvas-card lit rm-canvas" aria-label=${`What the watch opens in ${n.name}`}>
    <div class="rm-stage-head">
      <span class="rm-eyebrow">Preview</span>
      <b class="rm-stage-title">${n.name}</b>
      ${s===""?l:a`<span class="rm-stage-note">${s}</span>`}
    </div>
    <div class="stage-area rm-stage-area">
      <div class="rm-stage-body" style=${`--rm-screen-h: ${Tr(t,e)}px`}>${dn(t,o,"No page for this room. The watch uses Anywhere else.")}</div>
    </div>
    <p class="rm-stage-foot">Click a room to see what the watch opens there.</p>
  </div>`}function ke(t){let n=Br(t),e=Wr(t,n);return a`<div class="rm-layout" style=${`--wa-stage-hue: ${vr}; --rm-hue: ${vr}`}>
    <div class="rm-cell rm-cell-status">${jr(t)}</div>
    <div class="rm-cell rm-cell-rules">${Yr(t,n,e)}</div>
    <aside class="rm-side column canvas" aria-label="Preview">${cn(t,e)}</aside>
    <div class="rm-cell rm-cell-point">${an(t,n,e)}</div>
  </div>`}var Er=_`
  /* A main column of rules and a sticky stage beside it, the page no wider
     than 1240px and centred. Under 1000px one column: the stage goes under
     the rules, before point control, and scrolls with the page. */
  .rm-layout {
    width: 100%; max-width: 1240px; margin: 0 auto 14px;
    display: grid; grid-template-columns: minmax(0, 1fr) 360px; grid-template-rows: auto auto 1fr;
    column-gap: 16px; row-gap: 14px; align-items: start;
  }
  .rm-cell { min-width: 0; }
  .rm-cell-status { grid-column: 1; grid-row: 1; }
  .rm-cell-rules { grid-column: 1; grid-row: 2; }
  .rm-cell-point { grid-column: 1; grid-row: 3; }
  .rm-side { grid-column: 2; grid-row: 1 / span 3; position: sticky; top: 12px; min-width: 0; }
  @container (max-width: 1000px) {
    .rm-layout { grid-template-columns: minmax(0, 1fr); grid-template-rows: none; }
    .rm-cell-status, .rm-cell-rules, .rm-cell-point, .rm-side { grid-column: 1; grid-row: auto; }
    .rm-side { position: static; }
  }

  /* Help is one plain line: muted, never italic. */
  .rm-help { margin: 2px 0 8px; font-size: 12px; line-height: 1.45; font-style: normal; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-help.warn { color: var(--wa-amber); }
  .rm-help a, .rm-sensor-hint a { color: var(--wa-ink); }
  .rm-help code, .rm-card code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .rm-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .rm-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .rm-card .field :is(input[type=text], input[type=number], select) {
    height: 30px; min-height: 30px; padding: 0 9px; font-size: 13px; border-radius: 7px;
    border-color: var(--wa-line-strong); background-color: var(--wa-field);
  }
  .rm-card .field.check { grid-template-columns: minmax(0, 1fr) auto; min-height: 30px; padding: 0; font-size: 13px; gap: 10px; }
  .rm-card .field.check > span { color: var(--wa-ink); font-size: 13px; }
  /* A picked entity wraps its name, id and state rather than cutting them
     short; the box grows a line instead. */
  .rm-card .ent-chosen { height: auto; min-height: 28px; }
  .rm-card button.ent-pick { flex-wrap: wrap; row-gap: 0; padding-top: 3px; padding-bottom: 3px; }
  .rm-card .ent-pick :is(.ent-name, .ent-id, .ent-state) { white-space: normal; overflow: visible; text-overflow: clip; overflow-wrap: anywhere; max-width: none; }
  .rm-card .ent-pick .ent-id { flex: 0 1 auto; }
  .rm-dirty { display: inline-block; width: 7px; height: 7px; margin-left: 7px; vertical-align: middle; border-radius: 50%; background: var(--rm-hue); }

  /* The cards: plain, the Rooms hue only on the lit outline of the card at
     the top, the icon chip and the picked row's edge. */
  .rm-card {
    border-radius: var(--wa-lc-r, 16px); background: var(--wa-card); border: 1px solid var(--wa-line); color: var(--wa-ink);
  }
  .rm-card.rm-lit { --c: var(--rm-hue); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid); ${Ce} }
  /* The hue stays on the outline: the controls inside are neutral. */
  .rm-card.rm-lit > * { --c: var(--wa-accent); }
  .rm-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-muted); }
  .rm-start .rm-eyebrow { color: var(--rm-hue); }
  .rm-cap { font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-soft); }
  /* Every button and link button: a visible one pixel outline, neutral. */
  .rm-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 5px; flex: none;
    height: 32px; padding: 0 12px; border-radius: 8px; font: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
    text-decoration: none; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  .rm-btn.rm-small { height: 24px; padding: 0 9px; border-radius: 6px; font-size: 12px; font-weight: 400; color: var(--wa-soft); }
  .rm-btn:hover:not(:disabled) { background: var(--wa-hover); }
  .rm-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-btn:disabled { opacity: .45; cursor: default; }
  .rm-btn svg.ui-icon { width: 13px; height: 13px; }
  select.rm-select {
    min-width: 0; max-width: 100%; height: 30px; padding: 0 8px; border-radius: 7px; font: inherit; font-size: 13px;
    color: var(--wa-ink); background-color: var(--wa-field); border: 1px solid var(--wa-line-strong); cursor: pointer;
  }
  select.rm-select:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  select.rm-select:disabled { opacity: .45; cursor: default; }

  /* Switching: the chip, the line and the sensor, the switch at the
     right end, When under a hairline. */
  .rm-status {
    display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center;
    column-gap: 16px; row-gap: 12px; padding: 16px 18px;
  }
  .rm-ichip {
    width: 38px; height: 38px; border-radius: 10px; display: grid; place-items: center;
    border: 1px solid var(--rm-hue); color: var(--rm-hue);
  }
  .rm-ichip svg.ui-icon { width: 18px; height: 18px; stroke-width: 2; }
  .rm-status-text { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
  .rm-now { margin: 0; font-size: 16px; line-height: 1.4; overflow-wrap: anywhere; }
  .rm-now b { font-weight: 600; }
  .rm-sensor-line { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: 12px; color: var(--wa-muted); }
  .rm-sensor-name, .rm-sensor-hint { overflow-wrap: anywhere; }
  .rm-bermuda-ok { display: inline-flex; align-items: center; gap: 6px; color: var(--wa-green); overflow-wrap: anywhere; }
  .rm-bermuda-ok svg.ui-icon { width: 13px; height: 13px; flex: none; stroke-width: 2.4; }
  .rm-status-switch { min-width: 0; }
  .rm-status > .rm-status-switch { grid-column: 3; grid-row: 1; }
  .rm-status-wide { grid-column: 1 / -1; }
  .rm-status > .rm-help.rm-main-house { margin: 0; }
  .rm-sensor-edit { display: flex; flex-direction: column; gap: 4px; padding-top: 10px; border-top: 1px solid var(--wa-line); }
  .rm-when { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; padding-top: 12px; border-top: 1px solid var(--wa-line); }
  .rm-when-l { font-size: 12px; color: var(--wa-muted); }
  .seg.rm-seg { flex: 0 1 auto; max-width: 100%; height: auto; min-height: 30px; flex-wrap: wrap; }
  .seg.rm-seg button { min-height: 26px; padding: 3px 11px; font-size: 12px; font-weight: 500; letter-spacing: 0; line-height: 1.2; white-space: normal; overflow-wrap: anywhere; text-align: center; }
  .seg.rm-seg button:disabled { opacity: .45; cursor: default; }
  .rm-when-help { flex: 1 1 220px; min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  @container (max-width: 560px) {
    .rm-status { grid-template-columns: auto minmax(0, 1fr); }
    .rm-status > .rm-status-switch { grid-column: 1 / -1; grid-row: auto; }
  }
  .rm-reading { display: flex; align-items: flex-start; gap: 8px; margin: 2px 0; font-size: 12.5px; line-height: 1.45; overflow-wrap: anywhere; }
  .rm-dot { flex: none; width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; background: var(--wa-line-strong); }
  .rm-dot.ok { background: var(--wa-green); }
  .rm-dot.warn { background: var(--wa-amber); }

  /* Start here: no sensor picked yet. */
  .rm-start { display: flex; flex-direction: column; gap: 10px; padding: 18px; }
  .rm-start-title { margin: 0; font-size: 18px; font-weight: 500; letter-spacing: -.015em; text-transform: none; color: var(--wa-ink); overflow-wrap: anywhere; }
  .rm-pitch { margin: 0; max-width: 640px; font-size: 13px; line-height: 1.5; color: var(--wa-soft); overflow-wrap: anywhere; }
  .rm-start-row { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 8px; }
  .rm-start-row > .rm-stack { flex: 1 1 280px; min-width: 0; }
  .rm-start-row > .rm-bermuda-link { margin-bottom: 2px; }
  .rm-start > .rm-help { margin: 0; }
  .rm-start-switch { display: flex; flex-direction: column; gap: 10px; padding-top: 12px; border-top: 1px solid var(--wa-line); }

  /* The rules: a head of two small capitals, the floors, a row per room. */
  .rm-rules { display: flex; flex-direction: column; overflow: hidden; }
  .rm-rules-head { display: flex; align-items: baseline; gap: 10px; padding: 14px 16px 8px; }
  .rm-rules-head > .rm-cap:first-child { flex: 1; }
  .rm-group { display: flex; flex-direction: column; }
  .rm-floor { padding: 8px 16px 4px; font-size: 11.5px; color: var(--wa-faint); overflow-wrap: anywhere; }
  ul.rm-rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
  .rm-row {
    display: flex; align-items: center; gap: 12px; padding: 8px 10px 8px 16px; cursor: pointer;
    transition: background-color .15s ease;
  }
  li.rm-row:hover { background: var(--wa-hover); }
  li.rm-row.on { background: var(--wa-raise); box-shadow: inset 2px 0 0 var(--rm-hue); }
  /* On the raised and hovered fills the controls' outline is lifted, so it
     stays visible. */
  li.rm-row:is(.on, :hover) :is(select.rm-select, button.rm-row-x) { border-color: color-mix(in srgb, var(--wa-ink) 26%, var(--wa-raise)); }
  .rm-row-room { flex: 1 1 auto; min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 3px 8px; }
  button.rm-row-name {
    padding: 0; border: 0; background: transparent; font: inherit; font-size: 14px; font-weight: 500; text-align: left;
    color: var(--wa-ink); cursor: pointer; overflow-wrap: anywhere; border-radius: 4px;
  }
  button.rm-row-name:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-row-sub { flex-basis: 100%; font-size: 12px; line-height: 1.35; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-arrow { flex: none; display: inline-flex; color: var(--wa-faint); }
  .rm-arrow svg.ui-icon { width: 16px; height: 16px; }
  .rm-row-page { flex: 0 0 260px; min-width: 0; display: flex; align-items: center; gap: 8px; }
  .rm-row-page > select.rm-select { flex: 1 1 auto; }
  .rm-row-end { flex: 0 0 26px; display: flex; justify-content: flex-end; }
  button.rm-row-x {
    width: 26px; height: 26px; padding: 0; display: grid; place-items: center; border-radius: 6px; cursor: pointer;
    color: var(--wa-muted); background: transparent; border: 1px solid var(--wa-line-strong); opacity: 0;
  }
  li.rm-row:hover button.rm-row-x, li.rm-row:focus-within button.rm-row-x, li.rm-row.on button.rm-row-x { opacity: 1; }
  @media (hover: none) { button.rm-row-x { opacity: 1; } }
  button.rm-row-x:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
  button.rm-row-x:focus-visible { outline: none; opacity: 1; box-shadow: var(--wa-ring); }
  button.rm-row-x:disabled { cursor: default; }
  button.rm-row-x svg.ui-icon { width: 12px; height: 12px; }
  .rm-else { margin-top: 6px; padding-top: 12px; padding-bottom: 12px; cursor: default; border-top: 1px solid var(--wa-line); background: var(--wa-panel); }
  .rm-else-name { font-size: 14px; font-weight: 500; }
  /* One screen of the page, small, beside each picker; an empty box when
     there is none. */
  .rm-thumb { flex: none; display: block; width: var(--rm-thumb-w); }
  .rm-thumb .wa-watch { margin: 0; }
  .rm-thumb.empty { height: var(--rm-screen-h); border-radius: 6px; border: 1px dashed var(--wa-line-strong); }
  :is(.rm-stage-body, .rm-thumb) .wa-watch > .wp-screen { max-height: var(--rm-screen-h); }
  :is(.rm-stage-body, .rm-thumb) .wp-fold { display: none; }
  @container (max-width: 640px) {
    .rm-row { flex-wrap: wrap; row-gap: 8px; }
    .rm-row-room { flex-basis: calc(100% - 40px); }
    .rm-arrow { display: none; }
    .rm-row-page { flex: 1 1 auto; }
    .rm-row-end { order: 0; }
    .rm-row > .rm-row-room { order: -1; }
  }
  .rm-none { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; }
  .rm-none b { font-size: 13px; font-weight: 600; }
  .rm-none span { font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
  /* The fold under the rules: the areas not listed yet and the name field. */
  button.rm-fold {
    display: flex; align-items: center; gap: 8px; width: 100%; padding: 12px 16px; font: inherit; font-size: 12.5px;
    text-align: left; cursor: pointer; color: var(--wa-muted); background: transparent; border: 0; border-top: 1px solid var(--wa-line);
  }
  button.rm-fold:hover { background: var(--wa-hover); color: var(--wa-ink); }
  button.rm-fold:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-chev { display: inline-flex; flex: none; transition: transform .15s ease; }
  .rm-chev svg.ui-icon { width: 12px; height: 12px; stroke-width: 2.2; }
  [aria-expanded="true"] > .rm-chev { transform: rotate(90deg); }
  .rm-more { display: flex; flex-direction: column; gap: 10px; padding: 0 16px 14px; }
  .rm-areas { display: flex; flex-wrap: wrap; gap: 6px; }
  .rm-areas-help { width: 100%; margin: 2px 0 0; }
  button.rm-area {
    min-height: 26px; padding: 2px 10px; border-radius: 999px; font: inherit; font-size: 12px; cursor: pointer;
    color: var(--wa-soft); background: transparent; border: 1px solid var(--wa-line-strong); overflow-wrap: anywhere; text-align: left;
  }
  button.rm-area:hover { background: var(--wa-hover); color: var(--wa-ink); }
  button.rm-area:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-add-room { display: flex; gap: 6px; max-width: 480px; }
  .rm-add-room input {
    flex: 1 1 auto; min-width: 0; height: 32px; padding: 0 10px; border-radius: 8px;
    border: 1px solid var(--wa-line-strong); background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px;
  }
  .rm-add-room input:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .rm-more > .rm-help { margin: -4px 0 0; }

  /* Point control, folded: one line, then the picked room's targets and the
     two switches. */
  button.rm-point-head {
    display: flex; align-items: center; gap: 10px; width: 100%; padding: 13px 16px; border-radius: var(--wa-lc-r, 16px);
    font: inherit; text-align: left; cursor: pointer; color: var(--wa-ink); background: transparent; border: 0;
  }
  button.rm-point-head:hover { background: var(--wa-hover); }
  button.rm-point-head:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.rm-point-head > .rm-chev { color: var(--wa-muted); }
  .rm-point-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .rm-point-title { font-size: 13.5px; font-weight: 500; }
  .rm-point-sub { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .rm-point-body { display: flex; flex-direction: column; padding: 2px 16px 14px 38px; }
  @container (max-width: 560px) { .rm-point-body { padding-left: 16px; } }
  .rm-point-room { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 12px; color: var(--wa-muted); }
  .rm-point-room > select.rm-select { flex: 0 1 260px; }
  .rm-sub-h { display: flex; align-items: center; gap: 8px; margin: 12px 0 4px; font-size: 12px; color: var(--wa-muted); }
  .rm-sub-h > span { flex: 1; }
  .rm-sub-h button.lc-btn { height: 26px; font-size: 12px; font-weight: 500; border: 1px solid var(--wa-line-strong); background: transparent; }
  .rm-switch { margin-top: 6px; }
  .rm-switch .rm-help { margin: 0 0 4px; }
  .rm-point-switches { margin-top: 8px; padding-top: 2px; border-top: 1px solid var(--wa-line); }
  .rm-target {
    display: grid; grid-template-columns: 64px minmax(0, 1fr) 28px; gap: 10px; align-items: start;
    margin: 8px 0; padding: 10px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-field);
  }
  .rm-target-fields { min-width: 0; }
  .rm-dial { width: 64px; height: 64px; touch-action: none; cursor: grab; display: block; border-radius: 50%; }
  .rm-dial:active { cursor: grabbing; }
  .rm-dial:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-dial-face { fill: var(--wa-card); stroke: var(--wa-line-strong); stroke-width: 1.2; }
  .rm-dial-tick { stroke: var(--wa-muted); stroke-width: 1.2; }
  .rm-dial-n { font-size: 7px; font-weight: 700; fill: var(--wa-muted); text-anchor: middle; }
  .rm-dial-other { fill: var(--wa-muted); opacity: .5; }
  .rm-dial-needle { stroke: var(--wa-ink); stroke-width: 2; stroke-linecap: round; }
  .rm-dial-tip { fill: var(--wa-ink); }
  .rm-dial-hub { fill: var(--wa-ink); }
  .rm-heading-box { display: inline-flex; align-items: center; gap: 6px; }
  .rm-card .rm-heading-box input { width: 72px; }
  .rm-compass { font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .rm-remove {
    width: 28px; height: 28px; padding: 0; display: grid; place-items: center; border-radius: 6px;
    border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-muted); cursor: pointer;
  }
  .rm-remove:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
  .rm-remove:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-remove svg.ui-icon { width: 13px; height: 13px; }
  .rm-add-target { margin: 4px 0 8px; }

  /* The stage: the lit card (the watch editors' recipe, its edge in the
     Rooms hue), the picked room over the watch, one line at its foot. */
  .column.canvas.rm-side { gap: 0; }
  .column.canvas > .card.canvas-card.rm-canvas { min-height: 0; flex: none; }
  .rm-stage-head { display: flex; flex-direction: column; gap: 2px; padding: 14px 16px 0; }
  .rm-stage-title { font-size: 16px; font-weight: 500; overflow-wrap: anywhere; }
  .rm-stage-note { font-size: 12px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  .canvas-card.lit .stage-area.rm-stage-area { flex: none; align-items: center; justify-content: center; padding: 18px 12px 24px; }
  .canvas-card.lit .stage-area > .rm-stage-body { display: flex; justify-content: center; max-width: 100%; padding-bottom: 32px; }
  .rm-stage-foot { margin: 0; padding: 0 16px 16px; font-size: 12px; line-height: 1.45; color: var(--wa-muted); overflow-wrap: anywhere; }
  /* A plain watch screen: the page's name, or why there is none, on the
     watch's black. */
  .wp-screen.rm-screen { display: grid; place-items: center; padding: 20px; text-align: center; }
  .wp-screen.rm-screen span { font-size: 15px; font-weight: 600; color: var(--wa-face-muted); overflow-wrap: anywhere; }
  .wp-screen.rm-screen.blank span { font-size: 13px; font-weight: 500; line-height: 1.4; }
  /* No rooms yet: a dashed watch and one line. */
  .canvas-card.lit .stage-area.rm-empty { flex-direction: column; gap: 18px; padding: 24px 20px 40px; text-align: center; }
  .rm-empty-watch {
    width: 180px; height: 218px; border-radius: 50px; display: grid; place-items: center;
    border: 1.5px dashed var(--wa-line-strong); color: var(--wa-stage-hue);
  }
  .rm-empty-watch svg.ui-icon { width: 42px; height: 42px; stroke-width: 1.6; }
  .rm-empty-text { max-width: 280px; font-size: 13px; line-height: 1.5; color: var(--wa-muted); }
`;mr({dirty:pe,drop:gr});typeof window<"u"&&window.addEventListener("beforeunload",t=>{pe()&&(t.preventDefault(),t.returnValue="")});var ln=15e3,pn="watch settings",hn="rooms";function mn(t){return`${t}\0rooms`}var Ar=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),$e=Ar?"\u2318":"Ctrl+",un=820;function fn(t){return P(t).message}function _r(t){return P(t).code}function Pr(t){let{code:n,message:e}=P(t);return Object.assign(new Error(e),n===void 0?{}:{code:n})}function gn(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function wn(t){let n=t?Date.parse(t):NaN;return Number.isNaN(n)?"":Ae(Math.max(0,(Date.now()-n)/1e3))}function vn(t){return t instanceof HTMLElement?gt(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function yn(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}var H=new Map,h=class extends Te{constructor(){super(...arguments);this.owners=[];this.narrow=!1;this.haMenu=!1;this.barActions=l;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.iconsTick=0;this.headBar=new Xe(this);this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.hostWidth=0;this.areas=[];this.areasRead=!1;this.floors=[];this.sensorHistory=[];this.unsupported=!1;this.shownFootDialogs=new WeakSet;this.ownListAsked=!1;this.savedTicker=new dt(this);this.uiState=new Map;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.sensorSeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||this.load(e,!0)};this.onKeyDown=e=>{if(e.defaultPrevented)return;let r=e.composedPath();if(!r.includes(this)&&!this.headBar.holds(r)&&!yn()||this.renderRoot.querySelector("dialog[open]"))return;let i=e.metaKey||e.ctrlKey,o=e.key.toLowerCase();if(i&&!e.altKey&&o==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&(this.topMenuOpen||this.watchMenuOpen)){e.preventDefault(),this.topMenuOpen=!1,this.watchMenuOpen=!1;return}if(!vn(r[0])){if(i&&!e.altKey&&o==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}e.ctrlKey&&!e.metaKey&&!e.altKey&&o==="y"&&(e.preventDefault(),this.redo())}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let r=e.composedPath(),i=o=>r.some(s=>s instanceof HTMLElement&&s.classList.contains(o));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("rm-watch-picker")&&(this.watchMenuOpen=!1)}}get watches(){return Ke(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return ur(this.watches,this.watchId)?"iphone":"watch"}get kind(){return this.kindOf(this.watchId)}kindOf(e,r=this.watches){return jt(e===void 0?void 0:r.find(i=>i.owner_watch_id===e))}get draftKey(){let e=this.watchId;if(e!==void 0)return this.kind==="rooms"?mn(e):e}get draft(){let e=this.record,r=this.draftKey;if(r===void 0||e===void 0)return;if(e.revision<=0)return this.kind==="rooms"&&this.unsupported||!this.opensReady()?void 0:L(r)??le(r,this.newWatchBase());let i=se(e);if(i!==void 0)return L(r)??ce(r,i,e.revision).draft}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!(this.kind==="rooms"&&this.unsupported)}newWatchBase(){return this.kind==="rooms"?Yt():Ze()}opensReady(e=this.watches){let r=this.watchId,i=B(e.find(o=>o.owner_watch_id===r));return sr(i,this.kindOf(r,e),r)}startFresh(){let e=this.watchId;e!==void 0&&je(B(this.watches.find(r=>r.owner_watch_id===e)))&&(or(this.kind,e),this.note=void 0,this.requestUpdate())}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.stopListeningForReconnect(),this.reloadPending=!1,this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++,this.sensorSeq++}willUpdate(e){if(this.hass){e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,Oe(this.hass).then(s=>{this.ownList=s.owners},()=>{this.ownList=[]}));let i=Ge(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));i!==void 0?this.openWatch(i):this.watchId!==void 0&&this.shownKind!==void 0&&this.kind!==this.shownKind&&this.openWatch(this.watchId),this.areasAsked!==this.hass.connection&&this.loadAreas();let o=this.currentSensor();o!==this.sensorHistoryFor&&this.loadSensorHistory(o)}let r=this.restoreAsk;r!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===r.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),ht(this.renderRoot,this.shownFootDialogs),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let r of e){let i=r.contentRect.width;Math.abs(i-this.hostWidth)>=1&&(this.hostWidth=i)}}),this.sizeObserver.observe(this))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}openWatch(e,r=!1){let i=this.kindOf(e);(e!==this.watchId||i!==this.shownKind)&&(this.reloadPending=!1,this.watchId=e,this.note=void 0,this.history=[],this.pagesRecord=void 0,this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.uiState.clear(),this.unsupported=!1,r=!1),this.shownKind=i,this.startSubscription(e),this.load(e,r),this.loadPages(e)}async load(e,r=!1){let i=this.hass;if(!i)return;if(r&&this.saving){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),r||(this.record=void 0,this.loading=!0,this.loadError=void 0);let s=this.kind;try{let d=await S(i,e,s);if(o!==this.loadSeq)return;if(r&&this.saving){this.reloadPending=!0;return}this.unsupported=!1,this.show(d),this.loadError=void 0}catch(d){if(o!==this.loadSeq)return;s==="rooms"&&Jt(d)?(this.unsupported=!0,this.loadError=void 0):r||(this.loadError=fn(d))}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}show(e){let r=this.draftKey;this.record=e,r!==void 0&&e.revision<=0&&le(r,this.newWatchBase());let i=se(e);if(r===void 0||i===void 0)return;ce(r,i,e.revision).mergedIntoEdits&&(this.note={kind:"warn",text:`${this.kind==="rooms"?"This home's rooms":"The watch's settings"} changed elsewhere. Your edits are kept on top.`}),this.requestUpdate()}async loadPages(e){let r=this.hass;if(r)try{let i=await S(r,e,"pages");e===this.watchId&&(this.pagesRecord=i)}catch{}}async loadHistory(e){let r=this.hass;if(!r||this.historyState==="unsupported")return;let i=++this.historySeq;try{let o=await Ee(r,e,this.kind);if(i!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(i!==this.historySeq||e!==this.watchId)return;this.historyState=_r(o)==="unknown_command"?"unsupported":"error"}}async loadAreas(){let e=this.hass;if(!e)return;this.areasAsked=e.connection;let[r,i]=await Promise.allSettled([e.connection.sendMessagePromise({type:"config/area_registry/list"}),e.connection.sendMessagePromise({type:"config/floor_registry/list"})]);this.areas=r.status==="fulfilled"?It(r.value):zt(e.areas);let o=i.status==="fulfilled"?ie(i.value):[];this.floors=o.length>0?o:ie(e.floors),this.areasRead=!0}async loadSensorHistory(e){let r=this.hass;this.sensorHistoryFor=e;let i=++this.sensorSeq;if(this.sensorHistory=[],!(!r||e===""))try{let o=await r.connection.sendMessagePromise({type:"history/history_during_period",start_time:new Date(Date.now()-Bt*36e5).toISOString(),entity_ids:[e],minimal_response:!0,no_attributes:!0,significant_changes_only:!1});if(i!==this.sensorSeq)return;this.sensorHistory=Nt(o,e)}catch{}}startSubscription(e){let r=this.hass;if(this.endSubscription(),!r)return;let i=++this.subscribeSeq;Pe(r,e,o=>{i===this.subscribeSeq&&(o.kind===this.kind&&o.revision!==(this.record?.revision??0)&&this.load(e,!0),o.kind==="pages"&&o.revision!==(this.pagesRecord?.revision??0)&&this.loadPages(e))}).then(o=>{i===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Be(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},ln))}async poll(){this.pollTimer=void 0;let e=this.hass,r=this.watchId,i=this.record;if(!(!e||r===void 0||i===void 0)){if(this.saving){this.pollIfWaiting();return}try{let o=await S(e,r,this.kind);if(r!==this.watchId||this.record!==i)return;o.revision===i.revision?this.record={...i,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.saving?this.reloadPending=!0:(this.show(o),this.loadHistory(r))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}currentSensor(){let e=this.draft;return e===void 0?"":Q(e.effective).sensor}memoIcons(){let e=this.icons??ft,r=this.iconMemo;if(r!==void 0&&r.provider===e&&r.tick===this.iconsTick)return r.icons;let i=wt(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:i},i}screen(){let e=this.watches.find(r=>r.owner_watch_id===this.watchId);return(et(e?.screen_size)??Qe).screen}viewHost(){let e=this.draft,r=this.hass,i=this.watchId;if(e===void 0||r===void 0||i===void 0)return;let o=e.effective,s=Q(o),d=H.get(i)??[],p=this.kind==="rooms",c=Lt({areas:this.areas,mappingKeys:Object.keys(s.mappings),zoneKeys:s.zones.ok?s.zones.rooms.map(([u])=>u):[],history:this.sensorHistory,added:d});return{hass:r,document:o,view:s,dirty:new Set(C(e.document,e.pending)),pages:Dt(K(this.pagesRecord?.document)),rooms:c,floors:this.floors,roomsState:this.areasRead?"ready":"loading",busy:e.saving,uiState:this.uiState,write:(u,k)=>{this.draft===e&&(e.apply(p?Zt(u):u,k),this.requestUpdate())},endCoalesce:()=>e.endCoalesce(),addRoom:u=>{let k=H.get(i)??[];k.includes(u)||H.set(i,[...k,u]),this.requestUpdate()},added:d,forgetRoom:u=>{let k=H.get(i)??[];H.set(i,k.filter(f=>R(f)!==u))},pagesDocument:K(this.pagesRecord?.document),screen:this.screen(),icons:this.memoIcons(),narrow:this.stacked,requestUpdate:()=>this.requestUpdate(),...p?{home:!0}:{},...this.watches.find(u=>u.owner_watch_id===i)?.device_kind==="iphone"?{phone:!0}:{}}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,r=this.watchId,i=this.draft,o=this.record;if(!e||r===void 0||!i||!o||i.saving||!i.dirty)return;this.note=void 0,i.endCoalesce();let s=this.kind,d=i.revision<=0,p=wr(i,{save:(u,k)=>He(e,r,s,u,k).catch(f=>{throw Pr(f)}),fetch:()=>S(e,r,s).catch(u=>{throw Pr(u)})});this.requestUpdate();let c=await p;if(r===this.watchId){if(c.ok){let u=c.fresh??o;this.record=c.alreadySaved?u:{...u,revision:c.revision,updated_at:new Date().toISOString(),updated_by:"panel",document:c.document}}else c.fresh!==void 0&&(this.record=c.fresh);this.note=dr(d,c.ok?void 0:c.code,qt(c,s)),this.reloadPending?(this.reloadPending=!1,this.load(r,!0)):(this.pollIfWaiting(),this.loadHistory(r)),this.requestUpdate()}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let r=this.record;this.watchId===void 0||r===void 0||this.dirty||(this.restoreAsk={entry:e,baseRevision:r.revision})}async restore(){let e=this.hass,r=this.watchId,i=this.restoreAsk;if(!e||r===void 0||i===void 0||this.restoring)return;this.restoring=!0;let o=this.kind==="rooms",s=this.draftKey??r,d;try{await _e(e,r,this.kind,i.entry.revision,i.baseRevision),d={kind:"ok",text:vt(i.entry.updated_at)},(L(s)?.dirty??!1)||fr(s)}catch(p){let c=_r(p);c==="conflict"?d={kind:"warn",text:`Not restored. ${o?"This home's rooms":"The watch's settings"} changed somewhere else, so the newest copy is shown.`}:c==="no_record"?d={kind:"warn",text:o?"Not restored. Home Assistant no longer holds rooms for this home.":"Not restored. Home Assistant no longer holds settings for this watch."}:c==="not_found"?d={kind:"warn",text:"Not restored. That save is no longer kept."}:c==="unknown_command"?(this.historyState="unsupported",d={kind:"warn",text:"This version of the integration cannot restore an earlier save. Update it to restore one."}):d={kind:"err",text:`Could not restore: ${tt(p)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}r===this.watchId&&(this.note=d,this.load(r,!0))}render(){let e=this.watches,r=this.draft;return a`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(r,e):l}
        ${this.note?a`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:l}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):l}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=un}renderTopBar(e,r){let i=e!==void 0,o=i&&this.dirty;return a`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch rooms">
      ${this.haMenu?a`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${v("menu")}</button>`:l}
      ${this.shellOwnsWatch?l:a`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():hr(void 0,!1)}>${v("left")}<span>Complications</span></button>`}
      ${this.barHost===void 0?a`<span class="rm-title">Rooms</span>`:l}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?l:this.renderWatchPicker(r)}
      ${this.barHost!==void 0&&i?Ye({newWatch:this.newWatch,dirty:o,saved:F(this.record,void 0,this.device),device:this.device}):l}
      ${this.renderSyncPill(e)}
      ${i?a`
        <button class="tb-btn icon rm-undo" ?disabled=${!e.canUndo||this.saving} title=${`Undo (${$e}Z)`} aria-label="Undo"
          @click=${()=>this.undo()}>${v("undo")}</button>
        <button class="tb-btn icon rm-undo" ?disabled=${!e.canRedo||this.saving} title=${Ar?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
          @click=${()=>this.redo()}>${v("redo")}</button>`:l}
      ${this.renderTopMenu(e)}
      ${i?a`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${$e}S). A save reaches the ${Fe(this.device)} the next time it checks.`:`Nothing to save (${$e}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?l:a`<span class="tb-saved" title=${o?"Unsaved changes":""}>${F(this.record,void 0,this.device)}</span>
        ${lr(ar({newWatch:this.newWatch,dirty:o,saving:this.saving}))}`}`:l}
      ${this.barActions}
    </div>`}get noun(){return this.kind==="rooms"?hn:pn}renderSyncPill(e){let r=this.record;if(r===void 0||r.revision<=0||e===void 0)return l;let i=oe(e.effective,this.kind),o=W({record:r,size:i.size,limit:i.limit,noun:this.noun,historyState:this.historyState,device:this.device});return ot(o,e.dirty)}renderTopMenu(e){if(e===void 0)return l;let r=this.topMenuOpen,i=o=>()=>{this.topMenuOpen=!1,o()};return a`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${r?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!r}}>···</button>
      ${r?a`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        <button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to how the screen opened. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${i(()=>this.discard())}>Discard edits</button>
        ${(this.record?.revision??0)>0?st(i(()=>{this.rawCopied=!1,this.rawOpen=!0})):l}
      </div>`:l}
    </span>`}colorOf(e){return it(nt(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return l;let r=e.find(s=>s.owner_watch_id===this.watchId),i=this.watchMenuOpen,o=s=>{let d=s===void 0?void 0:this.colorOf(s);return a`<span class="pe-chip-glyph" style=${d?`--pe-person: ${d}`:l} aria-hidden="true">${v("watch")}</span>`};return a`<span class="picker rm-watch-picker">
      <button type="button" class="tb-browse rm-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose rooms are shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${o(r?.owner_watch_id)}<span class="tb-browse-l">${r?N(r,e):"Choose a watch"}</span>
        <span class="rm-caret" aria-hidden="true">${v("chevron")}</span>
      </button>
      ${i?a`<div class="pop-menu rm-watch-menu" role="menu" aria-label="Watches">
        ${e.map(s=>{let d=s.owner_watch_id===this.watchId;return a`<button type="button" class="row rm-watch-row" role="menuitemradio" aria-checked=${d?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,d||this.openWatch(s.owner_watch_id)}}>
            ${o(s.owner_watch_id)}<span class="rm-watch-name">${N(s,e)}</span>
            <span class="rm-watch-check" aria-hidden="true">${d?v("check"):l}</span>
          </button>`})}
      </div>`:l}
    </span>`}renderBody(e){if(e.length===0){let d=this.owners.length===0&&this.ownList===void 0;return a`<div class="pe-empty">${d?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}let r=this.kindOf(this.watchId,e)==="rooms";if(r&&this.unsupported)return a`<div class="pe-empty"><b>${rr}</b></div>`;if(this.loading)return a`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let d=this.watchId;return a`<div class="pe-empty">
        <span>Could not read this ${r?"home's rooms":"watch's settings"}: ${this.loadError}</span>
        ${d===void 0?l:a`<button class="pe-btn" @click=${()=>{this.load(d)}}>Try again</button>`}
      </div>`}let i=this.record;if(i===void 0)return a`<div class="pe-empty">Loading…</div>`;if(i.revision<=0&&!this.opensReady(e))return a`<div class="pe-empty"><b>${this.device==="iphone"?We("rooms","iphone"):r?tr:Wt}</b>
        <span>${r?Ve:Ft}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${qe}</button>
      </div>`;let o=this.draft,s=this.viewHost();return o===void 0||s===void 0?a`<div class="pe-empty"><b>${r?nr:Kt}</b></div>`:i.revision<=0?a`${this.barHost===void 0?cr(this.device):l}${ke(s)}`:a`${ke(s)}${this.renderFoot(i,o)}`}renderFoot(e,r){let i=r.effective,o=oe(i,this.kind),s=this.noun,d=W({record:e,size:o.size,limit:o.limit,noun:s,historyState:this.historyState,device:this.device}),p=this.watchId;return a`${ct({status:d,historyState:this.historyState,historyOpen:this.historyOpen,onHistory:()=>{this.historyOpen=!0}})}
    ${this.historyOpen?lt({noun:s,device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:r.dirty,restoring:this.restoring,onRetry:()=>{p!==void 0&&(this.historyState="loading",this.loadHistory(p))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):l}
    ${this.rawOpen?pt({noun:s,document:i,revision:e.revision,dirty:r.dirty,copied:this.rawCopied,onCopy:c=>{mt(c).then(u=>{this.rawCopied=u})},onClosed:()=>{this.rawOpen=!1}}):l}`}renderRestoreAsk(e){let r=this.record,i=wn(e.entry.updated_at);return a`<dialog class="pe-ask" aria-labelledby="rm-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="rm-ask-title" title=${`Revision ${e.entry.revision}`}>${at(e.entry)}</h3>
      <p>${Ue(e.entry.updated_by,this.device)}${i?` ${i}`:""}, ${gn(e.entry.size)}.</p>
      <p>${this.kind==="rooms"?"This home's rooms come back as they were in that save.":"Every watch setting comes back as it was in that save, not only the rooms."} It is saved again as the newest save, and the copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Ne,Me,De,Le,Ie,ze,kt,Rt,pr,_`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }
    .pe-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 0;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }
    .rm-title { font-size: 14px; font-weight: 600; letter-spacing: -.01em; padding: 0 4px; white-space: nowrap; }
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn.icon { padding: 0 8px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .wa-bar .tb-saved .cf-saved { margin: 0; font-size: inherit; color: inherit; }
    .wa-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
    .wa-bar .pop-menu .row:disabled:hover { background: transparent; }
    .pe-top > .pe-note { margin: 10px var(--cf-pad, 16px) 0; }
    .pe-note {
      display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .pe-note > span { flex: 1; min-width: 0; }
    .pe-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
    .pe-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .pe-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .pe-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
    .pe-link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
    .pe-empty {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 560px;
      padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.rm-watch-btn { max-width: 260px; }
    .rm-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .rm-watch-btn .rm-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.rm-watch-btn .rm-caret svg { width: 11px; height: 11px; }
    .pop-menu.rm-watch-menu { left: 0; right: auto; min-width: 220px; }
    .rm-watch-menu .row.rm-watch-row { display: flex; align-items: center; gap: 8px; }
    .rm-watch-row .rm-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .rm-watch-row[aria-checked="true"] { font-weight: 700; }
    .rm-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .rm-watch-check svg.ui-icon { width: 14px; height: 14px; }
    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-h-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .pe-h-text > .pe-muted { font-size: 12px; }
    .pe-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 32px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-btn:hover:not(:disabled) { background: var(--wa-panel); }
    .pe-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-btn:disabled { opacity: .55; cursor: default; }
    .pe-btn.pe-primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .pe-btn.pe-primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }
    dialog.pe-ask {
      width: min(460px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }
    :host([narrow]) { --cf-pad: 12px; }
  `,Er,ut,Je]}};m([b({attribute:!1})],h.prototype,"hass",2),m([b({attribute:!1})],h.prototype,"owners",2),m([b({attribute:!1})],h.prototype,"ownerId",2),m([b({type:Boolean,reflect:!0})],h.prototype,"narrow",2),m([b({attribute:!1})],h.prototype,"haMenu",2),m([b({attribute:!1})],h.prototype,"onHaMenu",2),m([b({attribute:!1})],h.prototype,"onBack",2),m([b({attribute:!1})],h.prototype,"barActions",2),m([b({attribute:!1})],h.prototype,"shellOwnsWatch",2),m([b({attribute:!1})],h.prototype,"phones",2),m([b({attribute:!1})],h.prototype,"barHost",2),m([b({attribute:!1})],h.prototype,"icons",2),m([b({attribute:!1})],h.prototype,"iconsTick",2),m([g()],h.prototype,"watchId",2),m([g()],h.prototype,"record",2),m([g()],h.prototype,"pagesRecord",2),m([g()],h.prototype,"loading",2),m([g()],h.prototype,"loadError",2),m([g()],h.prototype,"history",2),m([g()],h.prototype,"historyState",2),m([g()],h.prototype,"note",2),m([g()],h.prototype,"restoreAsk",2),m([g()],h.prototype,"restoring",2),m([g()],h.prototype,"historyOpen",2),m([g()],h.prototype,"rawOpen",2),m([g()],h.prototype,"rawCopied",2),m([g()],h.prototype,"ownList",2),m([g()],h.prototype,"topMenuOpen",2),m([g()],h.prototype,"watchMenuOpen",2),m([g()],h.prototype,"hostWidth",2),m([g()],h.prototype,"areas",2),m([g()],h.prototype,"areasRead",2),m([g()],h.prototype,"floors",2),m([g()],h.prototype,"sensorHistory",2),m([g()],h.prototype,"sensorHistoryFor",2),m([g()],h.prototype,"unsupported",2);customElements.get("wa-rooms-editor")||customElements.define("wa-rooms-editor",h);export{h as WaRoomsEditor};
