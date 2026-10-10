import{$ as _t,A as dt,B as ct,C as lt,E as ie,F as ht,G as ne,H as pt,I as ut,J as mt,K as ft,L as gt,M as _,N as vt,O as re,P as wt,R as yt,S as bt,T as kt,V as xt,W as $t,X as Rt,Y as St,Z as Ot,_ as Tt,a as N,aa as Ht,b,ba as Et,c as O,ca as Mt,d as j,da as Ct,e as X,ea as At,f as Ge,g as T,h as Z,i as Y,j as Je,k as G,l as z,m as Qe,n as J,o as et,p as tt,q as it,r as Q,s as nt,t as rt,u as st,v as ee,w as te,x as ot,y as K,z as at}from"./chunk-5IH3OOR2.js";import{h as Pt}from"./chunk-JODKBKYF.js";import{a as V,b as Ue,c as Be,d as qe,e as We,f as Fe,g as Ve,h as je,i as Xe}from"./chunk-CRDZTZUK.js";import{b as ze,p as Ke}from"./chunk-LUJBJ6NP.js";import{b as Ze,p as Ye}from"./chunk-43HRUTRJ.js";import{Gd as P,I as Te,L as _e,Le as Dt,Me as Lt,Ne as It,P as He,Q as Ee,U as Me,X as W,_ as F,aa as Ce,ba as Ae,bb as Ie,ca as De,h as A,ka as Le,sd as Pe,ud as L,vd as Ne,yd as I}from"./chunk-5SC5KRPF.js";import{Ag as q,Bg as ye,Bh as D,Dg as be,Eg as ke,b as C,c as d,cg as we,d as B,dh as S,eh as k,f as m,i as ve,ih as xe,j as x,k as f,kh as $e,ph as Re,qh as Se,yg as R,zh as Oe}from"./chunk-CQXHQEN6.js";import{a as p}from"./chunk-LO2NM3CE.js";var Zt=100,se=class{constructor(s,e){this.edits=new Map;this.undoStack=[];this.redoStack=[];this.saving=!1;this.document=s,this.revision=e}get effective(){return Je(this.document,this.edits)}get pending(){return this.edits}get dirty(){return z(this.document,this.edits).length>0}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}apply(s,e){if(this.saving)return!1;let i=G(this.document,this.edits,s);return Yt(i,this.edits)?!1:((e===void 0||e!==this.coalesceKey)&&(this.undoStack.push(new Map(this.edits)),this.undoStack.length>Zt&&this.undoStack.shift()),this.coalesceKey=e,this.redoStack=[],this.edits=i,!0)}endCoalesce(){this.coalesceKey=void 0}undo(){if(this.saving)return!1;let s=this.undoStack.pop();return s===void 0?!1:(this.redoStack.push(this.edits),this.edits=s,this.coalesceKey=void 0,!0)}redo(){if(this.saving)return!1;let s=this.redoStack.pop();return s===void 0?!1:(this.undoStack.push(this.edits),this.edits=s,this.coalesceKey=void 0,!0)}discard(){return this.edits.size===0||this.saving?!1:(this.undoStack.push(this.edits),this.redoStack=[],this.edits=new Map,this.coalesceKey=void 0,!0)}rebase(s,e){let i=Qe(this.document,s,this.edits);return this.document=s,this.revision=e,this.edits=G(s,new Map,i),this.undoStack=[],this.redoStack=[],this.coalesceKey=void 0,this.edits.size>0}};function Yt(t,s){if(t.size!==s.size)return!1;for(let[e,i]of t)if(!s.has(e)||JSON.stringify(i)!==JSON.stringify(s.get(e)))return!1;return!0}var $=new Map;function oe(t){return $.get(t)}function Nt(t){$.delete(t)}function ae(t,s,e){let i=$.get(t);if(i===void 0){let a=new se(s,e);return $.set(t,a),{draft:a,mergedIntoEdits:!1}}if(i.saving||e===i.revision)return{draft:i,mergedIntoEdits:!1};let n=i.dirty,r=i.rebase(s,e);return{draft:i,mergedIntoEdits:n&&r}}function de(){for(let t of $.values())if(t.dirty)return!0;return!1}function zt(){for(let[t,s]of $)s.saving||$.delete(t)}async function Kt(t,s){if(t.saving)return{ok:!1,code:"busy",message:"A save is running."};let e=new Map(t.pending);t.saving=!0;let i=ht(s,{revision:t.revision,document:t.document},e);t.saveDone=i;try{let n=await i;if(t.saving=!1,n.ok)t.rebase(n.document,n.revision);else if(n.fresh!==void 0&&n.fresh.revision>0){let r=n.fresh.document;r!==void 0&&typeof r=="object"&&!Array.isArray(r)&&t.rebase(r,n.fresh.revision)}return n}finally{t.saving=!1}}var Gt={sensor:{color:S.content,icon:"place"},switching:{color:S.numbers,icon:"pages"},point:{color:S.tap,icon:"tap"},rooms:{color:S.look,icon:"home"}};function Jt(t,s){return t.uiState.get(`fold:${s}`)!==!1}function H(t,s,e,i,n={}){let r=Jt(t,s),a=Gt[s];return Se({color:a.color,icon:k(a.icon),title:e,open:r,onToggle:()=>{t.uiState.set(`fold:${s}`,!r),t.requestUpdate()},...n.summary?{summary:n.summary}:{},dot:n.dot===!0,id:`rooms:${s}`},r?i():d``)}function qt(t,s){let e=t.states[s]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:s}function ce(t,s){let e=s.indexOf(".");return{entityId:s,displayName:s===""?"":qt(t,s),domain:e<0?"":s.slice(0,e)}}function E(t,s){return s.some(e=>t.dirty.has(e))}function Qt(t,s){if(s==="")return{line:"No room sensor. The watch guesses the room from its sensors, which works best with a Bermuda area sensor.",tone:"none"};let e=t.states[s];if(e===void 0)return{line:"Home Assistant has no entity with this id now.",tone:"warn"};let i=Ge(s,e),n=typeof e.state=="string"?e.state:"";if(i===void 0)return{line:`Now "${n}", which the watch does not read as a room.`,tone:"warn"};let r=X(i);return{line:`Now in ${i}${r===""?", whose name has no letter or digit the watch can match":""}.`,tone:r===""?"warn":"ok"}}function Ut(t){let{view:s}=t,e=Qt(t.hass,s.sensor);return H(t,"sensor","Room sensor",()=>d`
    <div class="rm-stack">${P({hass:t.hass},"Entity",ce(t.hass,s.sensor),i=>{t.busy||t.write(et(t.document,i.entityId))},"rooms:sensor",{clearable:!0})}</div>
    <div class="rm-reading"><i class="rm-dot ${e.tone}" aria-hidden="true"></i><span>${e.line}</span></div>
    ${s.sensor!==""?d`<div class="hint">Clearing the sensor turns Switch pages by room off.</div>`:m}`,{summary:s.sensor===""?"None":qt(t.hass,s.sensor),dot:E(t,[b.sensor])})}function le(t,s,e){let i=[...e,...t.map(n=>[n.id,n.name])];return s!==""&&!e.some(([n])=>n===s)&&K(t,s)===void 0&&i.push([s,"A page not on this watch"]),i}function he(t,s){return K(t,s)?.id??s}function ei(t){let{view:s}=t,e=N.switching.triggers,i=e.find(o=>o.value===s.trigger)?.help??"",n=re(s.fallback),r=n==="first"?"":n==="stay"?O:he(t.pages,s.fallback),a=[b.autoSwitch,b.legacyQuickJump,b.topSectionDoubleTap,b.handGesture,b.fallback];return H(t,"switching","Switch pages by room",()=>d`
    ${I("Switch pages by room",s.switching,o=>{t.busy||t.write(tt(t.document,o))})}
    <div class="hint">Jump to the page you give a room below.</div>
    ${s.switching?d`
      <div class="rm-stack">${Ne("When",s.trigger,e.map(o=>[o.value,o.label]),o=>{t.busy||t.write(it(t.document,o))})}</div>
      <div class="hint">${i}</div>
      ${L("Fallback page",r,le(t.pages,r,[[O,_.stay],["",_.first]]),o=>{t.busy||t.write(Q(o))},{snapBack:!0})}
      <div class="hint">When the room cannot be told, or has no page.</div>`:m}`,{summary:s.switching?s.trigger:"Off",dot:E(t,a)})}function ti(t){let{view:s}=t,e=bt(t.document),i=N.switching.triggers.find(o=>o.value==="Automatic")?.help??"",n=re(s.fallback),r=n==="first"?"":n==="stay"?O:he(t.pages,s.fallback),a=[b.autoSwitch,b.legacyQuickJump,b.fallback];return H(t,"switching","Switch pages by room",()=>d`
    ${I(At,e,o=>{t.busy||t.write(kt(t.document,o))})}
    <div class="hint">${i}</div>
    ${L("Fallback page",r,le(t.pages,r,[[O,_.stay],["",_.first]]),o=>{t.busy||t.write(Q(o))},{snapBack:!0})}
    <div class="hint">When the room cannot be told, or has no page.</div>`,{summary:e?"Automatic":"Not automatic",dot:E(t,a)})}function ii(t){let{view:s}=t,e={[b.tapToToggle]:s.tapToToggle,[b.liveTile]:s.liveTile},i=N.pointControl.switches;return H(t,"point","Point control",()=>d`
    ${i.map(n=>{let r=e[n.key]??n.absent;return d`${I(n.label,r,a=>{t.busy||t.write(nt(n.key,a))})}
        <div class="hint">${r?n.onDetail:n.offDetail}</div>`})}
    <div class="hint">One value for every point control tile on this watch.</div>`,{summary:i.filter(n=>e[n.key]).map(n=>n.label).join(", ")||"Off",dot:E(t,i.map(n=>n.key))})}function ni(t,s,e,i){let n=Math.atan2(t-e,i-s)*180/Math.PI;return T(n)}function ri(t,s,e,i,n){let r=s[e].centerHeading,a=26,o=32,c=(g,v)=>{let y=g*Math.PI/180;return{x:o+Math.sin(y)*v,y:o-Math.cos(y)*v}},l=c(r,a-3),u=g=>{if(t.busy||g.button!==0)return;let v=g.currentTarget,y=v.getBoundingClientRect(),fe=y.width/64,U=ge=>i(ni((ge.clientX-y.left)/fe,(ge.clientY-y.top)/fe,o,o),n);U(g),v.setPointerCapture?.(g.pointerId);let M=()=>{v.removeEventListener("pointermove",U),v.removeEventListener("pointerup",M),v.removeEventListener("pointercancel",M),t.endCoalesce()};v.addEventListener("pointermove",U),v.addEventListener("pointerup",M),v.addEventListener("pointercancel",M)},w=g=>{let v=g.shiftKey?15:1;if(g.key==="ArrowRight"||g.key==="ArrowUp")i(T(r+v),n);else if(g.key==="ArrowLeft"||g.key==="ArrowDown")i(T(r-v),n);else return;g.preventDefault()};return d`<svg class="rm-dial" viewBox="0 0 64 64" role="slider" tabindex="0" aria-label="Heading"
    aria-valuemin="0" aria-valuemax="359" aria-valuenow=${Math.round(r)} aria-valuetext=${`${Math.round(r)} degrees, ${Z(r)}`}
    @pointerdown=${u} @keydown=${w} @blur=${()=>t.endCoalesce()}>
    <circle class="rm-dial-face" cx=${o} cy=${o} r=${a}></circle>
    ${[0,90,180,270].map(g=>{let v=c(g,a-1),y=c(g,a-5);return B`<line class="rm-dial-tick" x1=${v.x} y1=${v.y} x2=${y.x} y2=${y.y}></line>`})}
    <text class="rm-dial-n" x=${o} y="13">N</text>
    ${s.map((g,v)=>{if(v===e)return m;let y=c(g.centerHeading,a-3);return B`<circle class="rm-dial-other" cx=${y.x} cy=${y.y} r="2"></circle>`})}
    <line class="rm-dial-needle" x1=${o} y1=${o} x2=${l.x} y2=${l.y}></line>
    <circle class="rm-dial-tip" cx=${l.x} cy=${l.y} r="3.2"></circle>
    <circle class="rm-dial-hub" cx=${o} cy=${o} r="2.2"></circle>
  </svg>`}function si(t){if(t!==void 0)return`Seen ${A(Math.max(0,(Date.now()-t)/1e3))}`}function oi(t,s,e,i){let n=e[i],r=(c,l)=>{if(t.busy)return;let u=e.flatMap((g,v)=>{if(v!==i)return[g];let y=c(g);return y===void 0?[]:[y]}),w=te(t.document,s,u);w!==void 0&&t.write(w,l)},a=(c,l)=>r(u=>({...u,centerHeading:T(c)}),l),o=`target:${s}:${i}`;return d`<div class="rm-target">
    ${ri(t,e,i,a,`${o}:heading`)}
    <div class="rm-target-fields">
      <div class="rm-stack">${P({hass:t.hass},"Entity",ce(t.hass,n.entityId),c=>{let l=c.entityId.trim();l===""||l===n.entityId||r(u=>({...u,entityId:l}))},`rooms:${o}:entity`,{domain:j,clearable:!1})}</div>
      <label class="field num rm-heading">
        <span>Heading</span>
        <span class="rm-heading-box">
          <input type="number" min="0" max="359" step="1" .value=${String(Math.round(n.centerHeading))} ?disabled=${t.busy}
            aria-label="Heading in degrees"
            @change=${c=>{let l=c.target,u=Number(l.value);if(l.value.trim()===""||Number.isNaN(u)){l.value=String(Math.round(n.centerHeading));return}a(u,`${o}:typed`),t.endCoalesce()}} />
          <span class="rm-compass">° ${Z(n.centerHeading)}</span>
        </span>
      </label>
      ${Pe("Label",n.label??"",c=>r(l=>{let u={entityId:l.entityId,centerHeading:l.centerHeading};return c!==""&&(u.label=c),u},`${o}:label`),{placeholder:Y(n.entityId)})}
    </div>
    <button type="button" class="rm-remove" title="Remove this target" aria-label="Remove this target" ?disabled=${t.busy}
      @click=${()=>r(()=>{})}>${k("close")}</button>
  </div>`}function ai(t,s){let{view:e}=t;if(!e.zones.ok)return d`<div class="hint warn">${gt}</div>`;let i=ee(e.zones.rooms,s.key),n=`rooms:target-add:${s.key}`;return d`<div class="rm-targets">
    <div class="rm-sub">Point control targets</div>
    ${i.length===0?d`<div class="hint">None yet. Add what you point at in this room, then set the direction it lies in from where you stand.</div>`:m}
    ${i.map((r,a)=>oi(t,s.key,i,a))}
    <div class="rm-stack rm-add-target">${P({hass:t.hass},"Add a target",ce(t.hass,""),r=>{let a=r.entityId.trim();if(a===""||t.busy||i.some(c=>c.entityId===a))return;let o=te(t.document,s.key,[...i,{entityId:a,centerHeading:0,label:Y(a)}]);o!==void 0&&t.write(o)},n,{domain:j,clearable:!1})}</div>
    <div class="hint">Heading is degrees clockwise from north. Drag the dial or type it. To read it, stand where you point from, face the target and open Heading on the watch (in Connection Health, or on the point control of a room with no targets). Type the number it shows.</div>
  </div>`}function di(t,s){let{view:e}=t,i=rt(e,s.key),n=he(t.pages,i),r=e.zones.ok?ee(e.zones.rooms,s.key).length:0,a=`room:${s.key}`,o=t.uiState.get(a)===!0,c=si(s.lastSeen),u=[i===""?void 0:K(t.pages,i)?.name??"A page not on this watch",r>0?`${r} ${r===1?"target":"targets"}`:void 0].filter(w=>w!==void 0);return d`<li class="rm-room ${o?"open":""}">
    <button type="button" class="rm-room-head" aria-expanded=${o?"true":"false"}
      @click=${()=>{t.uiState.set(a,!o),t.requestUpdate()}}>
      <i class="rm-dot ${s.lastSeen!==void 0?"ok":"none"}" aria-hidden="true"></i>
      <span class="rm-room-name">${s.name}</span>
      ${s.key!==s.name.toLowerCase()?d`<code class="rm-room-key" title="The name the watch matches">${s.key}</code>`:m}
      <span class="rm-room-facts">${u.join(" \xB7 ")||"Nothing set"}</span>
      ${c?d`<span class="rm-chip">${c}</span>`:m}
      <span class="rm-chev" aria-hidden="true">${k("chevron")}</span>
    </button>
    ${o?d`<div class="rm-room-body">
      ${L("Page",n,le(t.pages,n,[["","None"]]),w=>{t.busy||t.write(st(t.document,s.key,w))},{snapBack:!0})}
      ${ai(t,s)}
    </div>`:m}
  </li>`}function ci(t){let s=String(t.uiState.get("addRoom")??""),e=X(s),i=e!==""&&t.rooms.some(r=>r.key===e),n=()=>{e===""||i||(t.addRoom(s.trim()),t.uiState.set("addRoom",""),t.uiState.set(`room:${e}`,!0),t.requestUpdate())};return d`<div class="rm-add-room">
    <input type="text" placeholder="Add a room by name" aria-label="Room name" .value=${s}
      @input=${r=>{t.uiState.set("addRoom",r.target.value),t.requestUpdate()}}
      @keydown=${r=>{r.key==="Enter"&&(r.preventDefault(),n())}} />
    <button type="button" class="pe-btn" ?disabled=${e===""||i} @click=${n}>${k("plus")}<span>Add</span></button>
  </div>
  ${s.trim()!==""&&e===""?d`<div class="hint warn">The watch matches room names by their letters a to z and digits, and this name has none.</div>`:m}
  ${i?d`<div class="hint">That room is in the list.</div>`:m}`}function Bt(t){let{rooms:s}=t;return H(t,"rooms","Your rooms",()=>d`
    <div class="hint">Every area in Home Assistant, every room with a page or targets, and every room the sensor reported in the last day. A room is matched by its name, so the sensor's state has to name it.</div>
    ${ci(t)}
    ${s.length===0?d`<div class="hint">${t.roomsState==="loading"?"Reading the areas and the sensor's states\u2026":"No rooms yet. Add one by name."}</div>`:d`<ul class="rm-rooms">${s.map(e=>di(t,e))}</ul>`}`,{summary:`${s.length} ${s.length===1?"room":"rooms"}`,dot:E(t,[b.mappings,b.zones])})}function pe(t){return t.home===!0?d`<div class="rm-layout">
    <div class="rm-col rm-settings">
      <p class="hint rm-main-house">${t.phone===!0?St:Rt}</p>
      ${Ut(t)}
      ${ti(t)}
    </div>
    <div class="rm-col rm-rooms-col">${Bt(t)}</div>
  </div>`:d`<div class="rm-layout">
    <div class="rm-col rm-settings">
      ${Ut(t)}
      ${ei(t)}
      ${ii(t)}
    </div>
    <div class="rm-col rm-rooms-col">${Bt(t)}</div>
  </div>`}var Wt=C`
  .rm-layout { display: grid; grid-template-columns: minmax(280px, 380px) minmax(0, 1fr); gap: 14px; align-items: start; margin-bottom: 14px; }
  @container (max-width: 820px) { .rm-layout { grid-template-columns: minmax(0, 1fr); } }
  .rm-col { min-width: 0; display: flex; flex-direction: column; }
  .rm-col > .sec:first-child { margin-top: 0; }
  .rm-main-house { margin: 0 0 10px; }
  .rm-main-house + .sec { margin-top: 0; }
  .rm-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .rm-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .rm-reading { display: flex; align-items: flex-start; gap: 8px; margin: 6px 0 4px; font-size: 12.5px; line-height: 1.45; }
  .rm-dot { flex: none; width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; background: var(--wa-line-strong); }
  .rm-dot.ok { background: var(--wa-green); }
  .rm-dot.warn { background: var(--wa-amber); }
  .rm-room-head .rm-dot { margin-top: 0; }
  .rm-add-room { display: flex; gap: 8px; margin: 8px 0; }
  .rm-add-room input { flex: 1 1 auto; min-width: 0; height: 32px; padding: 0 10px; border-radius: var(--wa-r-sm, 8px);
    border: 1px solid var(--wa-line-strong); background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px; }
  .rm-add-room input:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .rm-add-room .pe-btn svg.ui-icon { width: 13px; height: 13px; }
  ul.rm-rooms { list-style: none; margin: 4px 0 10px; padding: 0; display: flex; flex-direction: column; }
  .rm-room { border-top: 1px solid var(--wa-line); }
  .rm-room:first-child { border-top: 0; }
  .rm-room-head {
    display: flex; align-items: center; gap: 8px; width: 100%; min-height: 40px; padding: 6px 2px; border: 0; background: none;
    color: var(--wa-ink); font: inherit; font-size: 13px; text-align: left; cursor: pointer; border-radius: 6px;
  }
  .rm-room-head:hover { background: color-mix(in srgb, var(--wa-ink) 4%, transparent); }
  .rm-room-head:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-room-name { flex: 0 1 auto; min-width: 0; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rm-room-key { flex: 0 1 auto; min-width: 0; font-size: 11px; color: var(--wa-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rm-room-facts { flex: 1 1 auto; min-width: 0; color: var(--wa-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; }
  .rm-chip {
    flex: none; display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 6px; font-size: 11px; font-weight: 600;
    color: var(--wa-ink); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-green) 55%, transparent);
  }
  .rm-chev { flex: none; display: inline-flex; color: var(--wa-muted); transition: transform .12s ease-out; }
  .rm-chev svg.ui-icon { width: 12px; height: 12px; }
  .rm-room.open .rm-chev { transform: rotate(90deg); }
  .rm-room-body { padding: 2px 4px 12px 18px; }
  .rm-sub { margin: 10px 0 2px; font-size: 11.5px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
  .rm-target {
    display: grid; grid-template-columns: 72px minmax(0, 1fr) 28px; gap: 10px; align-items: start;
    margin: 8px 0; padding: 10px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-field);
  }
  .rm-target-fields { min-width: 0; }
  .rm-dial { width: 72px; height: 72px; touch-action: none; cursor: grab; display: block; border-radius: 50%; }
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
  .rm-heading-box input { width: 72px; }
  .rm-compass { font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  .rm-remove {
    width: 28px; height: 28px; padding: 0; display: grid; place-items: center; border-radius: 6px; border: 0; background: none;
    color: var(--wa-muted); cursor: pointer;
  }
  .rm-remove:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
  .rm-remove:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .rm-remove svg.ui-icon { width: 13px; height: 13px; }
  .rm-add-target { margin-top: 6px; }
`;It({dirty:de,drop:zt});typeof window<"u"&&window.addEventListener("beforeunload",t=>{de()&&(t.preventDefault(),t.returnValue="")});var li=15e3,hi="watch settings",pi="rooms";function ui(t){return`${t}\0rooms`}var Xt=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),ue=Xt?"\u2318":"Ctrl+",mi=820;function Ft(t){return D(t).message}function Vt(t){return D(t).code}function jt(t){let{code:s,message:e}=D(t);return Object.assign(new Error(e),s===void 0?{}:{code:s})}function fi(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function gi(t){let s=t?Date.parse(t):NaN;return Number.isNaN(s)?"":A(Math.max(0,(Date.now()-s)/1e3))}function vi(t){return t instanceof HTMLElement?Ze(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function wi(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}var me=new Map,h=class extends ve{constructor(){super(...arguments);this.owners=[];this.narrow=!1;this.haMenu=!1;this.barActions=m;this.shellOwnsWatch=!1;this.phones=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.hostWidth=0;this.areas=[];this.areasRead=!1;this.sensorHistory=[];this.starting=!1;this.unsupported=!1;this.shownFootDialogs=new WeakSet;this.ownListAsked=!1;this.savedTicker=new Be(this);this.uiState=new Map;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.sensorSeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||this.load(e,!0)};this.onKeyDown=e=>{if(e.defaultPrevented)return;let i=e.composedPath();if(!i.includes(this)&&!wi()||this.renderRoot.querySelector("dialog[open]"))return;let n=e.metaKey||e.ctrlKey,r=e.key.toLowerCase();if(n&&!e.altKey&&r==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&(this.topMenuOpen||this.watchMenuOpen)){e.preventDefault(),this.topMenuOpen=!1,this.watchMenuOpen=!1;return}if(!vi(i[0])){if(n&&!e.altKey&&r==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}e.ctrlKey&&!e.metaKey&&!e.altKey&&r==="y"&&(e.preventDefault(),this.redo())}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let i=e.composedPath(),n=r=>i.some(a=>a instanceof HTMLElement&&a.classList.contains(r));this.topMenuOpen&&!n("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!n("rm-watch-picker")&&(this.watchMenuOpen=!1)}}get watches(){return Me(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return Pt(this.watches,this.watchId)?"iphone":"watch"}get kind(){return this.kindOf(this.watchId)}kindOf(e,i=this.watches){return wt(e===void 0?void 0:i.find(n=>n.owner_watch_id===e))}get draftKey(){let e=this.watchId;if(e!==void 0)return this.kind==="rooms"?ui(e):e}get draft(){let e=this.record,i=ne(e),n=this.draftKey;if(!(n===void 0||e===void 0||i===void 0))return oe(n)??ae(n,i,e.revision).draft}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.stopListeningForReconnect(),this.reloadPending=!1,this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++,this.sensorSeq++}willUpdate(e){if(this.hass){e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,we(this.hass).then(a=>{this.ownList=a.owners},()=>{this.ownList=[]}));let n=Ie(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));n!==void 0?this.openWatch(n):this.watchId!==void 0&&this.shownKind!==void 0&&this.kind!==this.shownKind&&this.openWatch(this.watchId),this.areasAsked!==this.hass.connection&&this.loadAreas();let r=this.currentSensor();r!==this.sensorHistoryFor&&this.loadSensorHistory(r)}let i=this.restoreAsk;i!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(n=>n.revision===i.entry.revision)&&this.closeAsk()}updated(){let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),Ve(this.renderRoot,this.shownFootDialogs),this.savedTicker.show(this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let i of e){let n=i.contentRect.width;Math.abs(n-this.hostWidth)>=1&&(this.hostWidth=n)}}),this.sizeObserver.observe(this))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}openWatch(e,i=!1){let n=this.kindOf(e);(e!==this.watchId||n!==this.shownKind)&&(this.reloadPending=!1,this.watchId=e,this.note=void 0,this.history=[],this.pagesRecord=void 0,this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.uiState.clear(),this.unsupported=!1,i=!1),this.shownKind=n,this.startSubscription(e),this.load(e,i),this.loadPages(e)}async load(e,i=!1){let n=this.hass;if(!n)return;if(i&&this.saving){this.reloadPending=!0;return}let r=++this.loadSeq;this.stopPolling(),i||(this.record=void 0,this.loading=!0,this.loadError=void 0);let a=this.kind;try{let o=await R(n,e,a);if(r!==this.loadSeq)return;if(i&&this.saving){this.reloadPending=!0;return}this.unsupported=!1,this.show(o),this.loadError=void 0}catch(o){if(r!==this.loadSeq)return;a==="rooms"&&$t(o)?(this.unsupported=!0,this.loadError=void 0):i||(this.loadError=Ft(o))}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}show(e){let i=this.draftKey;this.record=e;let n=ne(e);if(i===void 0||n===void 0)return;ae(i,n,e.revision).mergedIntoEdits&&(this.note={kind:"warn",text:`${this.kind==="rooms"?"This home's rooms":"The watch's settings"} changed elsewhere. Your edits are kept on top.`}),this.requestUpdate()}async loadPages(e){let i=this.hass;if(i)try{let n=await R(i,e,"pages");e===this.watchId&&(this.pagesRecord=n)}catch{}}async loadHistory(e){let i=this.hass;if(!i||this.historyState==="unsupported")return;let n=++this.historySeq;try{let r=await ye(i,e,this.kind);if(n!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(r?.entries)?r.entries:[],this.historyState="ready"}catch(r){if(n!==this.historySeq||e!==this.watchId)return;this.historyState=Vt(r)==="unknown_command"?"unsupported":"error"}}async loadAreas(){let e=this.hass;if(e){this.areasAsked=e.connection;try{let i=await e.connection.sendMessagePromise({type:"config/area_registry/list"});this.areas=dt(i)}catch{this.areas=Object.values(e.areas??{}).flatMap(i=>typeof i.name=="string"&&i.name.trim()!==""?[{name:i.name}]:[])}this.areasRead=!0}}async loadSensorHistory(e){let i=this.hass;this.sensorHistoryFor=e;let n=++this.sensorSeq;if(this.sensorHistory=[],!(!i||e===""))try{let r=await i.connection.sendMessagePromise({type:"history/history_during_period",start_time:new Date(Date.now()-lt*36e5).toISOString(),entity_ids:[e],minimal_response:!0,no_attributes:!0,significant_changes_only:!1});if(n!==this.sensorSeq)return;this.sensorHistory=ct(r,e)}catch{}}startSubscription(e){let i=this.hass;if(this.endSubscription(),!i)return;let n=++this.subscribeSeq;ke(i,e,r=>{n===this.subscribeSeq&&(r.kind===this.kind&&r.revision!==(this.record?.revision??0)&&this.load(e,!0),r.kind==="pages"&&r.revision!==(this.pagesRecord?.revision??0)&&this.loadPages(e))}).then(r=>{n===this.subscribeSeq?this.unsubscribe=r:r().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Te(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},li))}async poll(){this.pollTimer=void 0;let e=this.hass,i=this.watchId,n=this.record;if(!(!e||i===void 0||n===void 0)){if(this.saving){this.pollIfWaiting();return}try{let r=await R(e,i,this.kind);if(i!==this.watchId||this.record!==n)return;r.revision===n.revision?this.record={...n,delivered_revision:r.delivered_revision,delivered_at:r.delivered_at,rejected_revision:r.rejected_revision,rejected_at:r.rejected_at,rejected_reason:r.rejected_reason}:this.saving?this.reloadPending=!0:(this.show(r),this.loadHistory(i))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}currentSensor(){let e=this.draft;return e===void 0?"":J(e.effective).sensor}viewHost(){let e=this.draft,i=this.hass,n=this.watchId;if(e===void 0||i===void 0||n===void 0)return;let r=e.effective,a=J(r),o=me.get(n)??[],c=this.kind==="rooms",l=at({areas:this.areas,mappingKeys:Object.keys(a.mappings),zoneKeys:a.zones.ok?a.zones.rooms.map(([u])=>u):[],history:this.sensorHistory,added:o});return{hass:i,document:r,view:a,dirty:new Set(z(e.document,e.pending)),pages:ot(Ye(this.pagesRecord?.document)),rooms:l,roomsState:this.areasRead?"ready":"loading",busy:e.saving,uiState:this.uiState,write:(u,w)=>{this.draft===e&&(e.apply(c?yt(u):u,w),this.requestUpdate())},endCoalesce:()=>e.endCoalesce(),addRoom:u=>{let w=me.get(n)??[];w.includes(u)||me.set(n,[...w,u]),this.requestUpdate()},requestUpdate:()=>this.requestUpdate(),...c?{home:!0}:{},...this.watches.find(u=>u.owner_watch_id===n)?.device_kind==="iphone"?{phone:!0}:{}}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,i=this.watchId,n=this.draft,r=this.record;if(!e||i===void 0||!n||!r||n.saving||!n.dirty)return;this.note=void 0,n.endCoalesce();let a=this.kind,o=Kt(n,{save:(l,u)=>q(e,i,a,l,u).catch(w=>{throw jt(w)}),fetch:()=>R(e,i,a).catch(l=>{throw jt(l)})});this.requestUpdate();let c=await o;if(i===this.watchId){if(c.ok){let l=c.fresh??r;this.record=c.alreadySaved?l:{...l,revision:c.revision,updated_at:new Date().toISOString(),updated_by:"panel",document:c.document}}else c.fresh!==void 0&&(this.record=c.fresh);this.note=vt(c,a),this.reloadPending?(this.reloadPending=!1,this.load(i,!0)):(this.pollIfWaiting(),this.loadHistory(i)),this.requestUpdate()}}async start(){let e=this.hass,i=this.watchId;if(!e||i===void 0||this.starting||this.kind!=="rooms")return;this.starting=!0,this.note=void 0;let n=await xt((r,a)=>q(e,i,"rooms",r,a));if(this.starting=!1,i===this.watchId){if(n.ok)this.note={kind:"ok",text:Et};else if(n.code==="no_record"){this.note={kind:"warn",text:Le};return}else if(n.code==="conflict")this.note={kind:"warn",text:Ht};else if(n.code==="unsupported"){this.unsupported=!0;return}else{this.note={kind:"err",text:`Could not start: ${n.message}`};return}this.load(i,!0)}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let i=this.record;this.watchId===void 0||i===void 0||this.dirty||(this.restoreAsk={entry:e,baseRevision:i.revision})}async restore(){let e=this.hass,i=this.watchId,n=this.restoreAsk;if(!e||i===void 0||n===void 0||this.restoring)return;this.restoring=!0;let r=this.kind==="rooms",a=this.draftKey??i,o;try{await be(e,i,this.kind,n.entry.revision,n.baseRevision),o={kind:"ok",text:`Revision ${n.entry.revision} is back.`},(oe(a)?.dirty??!1)||Nt(a)}catch(c){let l=Vt(c);l==="conflict"?o={kind:"warn",text:`Not restored. ${r?"This home's rooms":"The watch's settings"} changed somewhere else, so the newest copy is shown.`}:l==="no_record"?o={kind:"warn",text:r?"Not restored. Home Assistant no longer holds rooms for this home.":"Not restored. Home Assistant no longer holds settings for this watch."}:l==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:l==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore an earlier save. Update it to restore one."}):o={kind:"err",text:`Could not restore: ${Ft(c)}`}}finally{this.restoring=!1,this.restoreAsk===n&&this.closeAsk()}i===this.watchId&&(this.note=o,this.load(i,!0))}render(){let e=this.watches,i=this.draft;return d`
      <div class="pe-top">
        ${this.renderTopBar(i,e)}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:m}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):m}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=mi}renderTopBar(e,i){let n=e!==void 0,r=n&&this.dirty;return d`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Watch rooms">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${k("menu")}</button>`:m}
      ${this.shellOwnsWatch?m:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Dt(void 0,!1)}>${k("left")}<span>Complications</span></button>`}
      <span class="rm-title">Rooms</span>
      <span class="spacer"></span>
      ${this.shellOwnsWatch?m:this.renderWatchPicker(i)}
      ${this.renderSyncPill(e)}
      ${n?d`
        <button class="tb-btn icon rm-undo" ?disabled=${!e.canUndo||this.saving} title=${`Undo (${ue}Z)`} aria-label="Undo"
          @click=${()=>this.undo()}>${k("undo")}</button>
        <button class="tb-btn icon rm-undo" ?disabled=${!e.canRedo||this.saving} title=${Xt?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
          @click=${()=>this.redo()}>${k("redo")}</button>`:m}
      ${this.renderTopMenu(e)}
      ${n?d`<button class="primary save ${r?"dirty":""}" ?disabled=${!r||this.saving}
          title=${r?`Save (${ue}S). A save reaches the ${Ee(this.device)} the next time it checks.`:`Nothing to save (${ue}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        <span class="tb-saved" title=${r?"Unsaved changes":""}>${Ue(this.record,void 0,this.device)}</span>`:m}
      ${this.barActions}
      <button class="help" title="Help: rooms" aria-label="Help"
        @click=${()=>window.open(Lt,"_blank","noopener")}>?</button>
    </div>`}get noun(){return this.kind==="rooms"?pi:hi}renderSyncPill(e){let i=this.record;if(i===void 0||e===void 0)return m;let n=ie(e.effective,this.kind),r=V({record:i,size:n.size,limit:n.limit,noun:this.noun,historyState:this.historyState,device:this.device});return d`<span class="tb-sync ${r.tone==="ok"?"ok":"warn"}" title=${`${r.state}. ${r.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${r.state}</span>
    </span>`}renderTopMenu(e){if(e===void 0)return m;let i=this.topMenuOpen,n=r=>()=>{this.topMenuOpen=!1,r()};return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${i?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!i}}>···</button>
      ${i?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        <button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${n(()=>this.discard())}>Discard edits</button>
      </div>`:m}
    </span>`}personColor(e){let i=ze(this.owners.length>0?this.owners:this.ownList??[]);return Ke(i.findIndex(n=>n.owners.some(r=>r.owner_watch_id===e)))}renderWatchPicker(e){if(e.length<2)return m;let i=e.find(a=>a.owner_watch_id===this.watchId),n=this.watchMenuOpen,r=a=>{let o=a===void 0?void 0:this.personColor(a);return d`<span class="pe-chip-glyph" style=${o?`--pe-person: ${o}`:m} aria-hidden="true">${k("watch")}</span>`};return d`<span class="picker rm-watch-picker">
      <button type="button" class="tb-browse rm-watch-btn" aria-haspopup="menu" aria-expanded=${n?"true":"false"}
        title="Choose the watch whose rooms are shown" @click=${()=>{this.watchMenuOpen=!n}}>
        ${r(i?.owner_watch_id)}<span class="tb-browse-l">${i?W(i,e):"Choose a watch"}</span>
        <span class="rm-caret" aria-hidden="true">${k("chevron")}</span>
      </button>
      ${n?d`<div class="pop-menu rm-watch-menu" role="menu" aria-label="Watches">
        ${e.map(a=>{let o=a.owner_watch_id===this.watchId;return d`<button type="button" class="row rm-watch-row" role="menuitemradio" aria-checked=${o?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,o||this.openWatch(a.owner_watch_id)}}>
            ${r(a.owner_watch_id)}<span class="rm-watch-name">${W(a,e)}</span>
            <span class="rm-watch-check" aria-hidden="true">${o?k("check"):m}</span>
          </button>`})}
      </div>`:m}
    </span>`}renderBody(e){if(e.length===0){let o=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${o?"Loading\u2026":"No watch has connected to this Home Assistant yet."}</div>`}let i=this.kindOf(this.watchId,e)==="rooms";if(i&&this.unsupported)return d`<div class="pe-empty"><b>${Mt}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let o=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this ${i?"home's rooms":"watch's settings"}: ${this.loadError}</span>
        ${o===void 0?m:d`<button class="pe-btn" @click=${()=>{this.load(o)}}>Try again</button>`}
      </div>`}let n=this.record;if(n===void 0)return d`<div class="pe-empty">Loading…</div>`;if(i)return this.renderHomeBody(n,e);if(n.revision<=0){let o=F(e.find(c=>c.owner_watch_id===this.watchId))==="wait";return d`<div class="pe-empty"><b>${pt}</b><span>${o?mt:ut}</span></div>`}let r=this.draft,a=this.viewHost();return r===void 0||a===void 0?d`<div class="pe-empty"><b>${ft}</b></div>`:d`${pe(a)}${this.renderFoot(n,r)}`}renderHomeBody(e,i){if(e.revision<=0){let a=F(i.find(o=>o.owner_watch_id===this.watchId));return d`<div class="pe-empty"><b>${this.device==="iphone"?He("rooms","iphone"):Ot}</b><span>${Ae(a,Tt)}</span>
        ${a==="wait"?d`<button class="link start-fresh" ?disabled=${this.starting} @click=${()=>{De(a)&&this.start()}}>${this.starting?"Starting\u2026":Ce}</button>`:d`<button class="pe-btn pe-primary" ?disabled=${this.starting} @click=${()=>{this.start()}}>${this.starting?"Starting\u2026":_t}</button>`}
      </div>`}let n=this.draft,r=this.viewHost();return n===void 0||r===void 0?d`<div class="pe-empty"><b>${Ct}</b></div>`:d`${pe(r)}${this.renderFoot(e,n)}`}renderFoot(e,i){let n=i.effective,r=ie(n,this.kind),a=this.noun,o=V({record:e,size:r.size,limit:r.limit,noun:a,historyState:this.historyState,device:this.device}),c=this.watchId;return d`${qe({status:o,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?We({noun:a,device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:i.dirty,restoring:this.restoring,onRetry:()=>{c!==void 0&&(this.historyState="loading",this.loadHistory(c))},onRestore:l=>{this.historyOpen=!1,this.askRestore(l)},onClosed:()=>{this.historyOpen=!1}}):m}
    ${this.rawOpen?Fe({noun:a,document:n,revision:e.revision,dirty:i.dirty,copied:this.rawCopied,onCopy:l=>{je(l).then(u=>{this.rawCopied=u})},onClosed:()=>{this.rawOpen=!1}}):m}`}renderRestoreAsk(e){let i=this.record,n=gi(e.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="rm-ask-title"
      @cancel=${r=>{this.restoring&&r.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="rm-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${_e(e.entry.updated_by,this.device)}${n?` ${n}`:""}, ${fi(e.entry.size)}.</p>
      <p>${this.kind==="rooms"?"This home's rooms come back as they were in that save.":"Every watch setting comes back as it was in that save, not only the rooms."} It is saved again as a new revision${i?`, after revision ${i.revision}`:""}, and the copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Oe,xe,$e,Re,C`
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
  `,Wt,Xe]}};p([x({attribute:!1})],h.prototype,"hass",2),p([x({attribute:!1})],h.prototype,"owners",2),p([x({attribute:!1})],h.prototype,"ownerId",2),p([x({type:Boolean,reflect:!0})],h.prototype,"narrow",2),p([x({attribute:!1})],h.prototype,"haMenu",2),p([x({attribute:!1})],h.prototype,"onHaMenu",2),p([x({attribute:!1})],h.prototype,"onBack",2),p([x({attribute:!1})],h.prototype,"barActions",2),p([x({attribute:!1})],h.prototype,"shellOwnsWatch",2),p([x({attribute:!1})],h.prototype,"phones",2),p([f()],h.prototype,"watchId",2),p([f()],h.prototype,"record",2),p([f()],h.prototype,"pagesRecord",2),p([f()],h.prototype,"loading",2),p([f()],h.prototype,"loadError",2),p([f()],h.prototype,"history",2),p([f()],h.prototype,"historyState",2),p([f()],h.prototype,"note",2),p([f()],h.prototype,"restoreAsk",2),p([f()],h.prototype,"restoring",2),p([f()],h.prototype,"historyOpen",2),p([f()],h.prototype,"rawOpen",2),p([f()],h.prototype,"rawCopied",2),p([f()],h.prototype,"ownList",2),p([f()],h.prototype,"topMenuOpen",2),p([f()],h.prototype,"watchMenuOpen",2),p([f()],h.prototype,"hostWidth",2),p([f()],h.prototype,"areas",2),p([f()],h.prototype,"areasRead",2),p([f()],h.prototype,"sensorHistory",2),p([f()],h.prototype,"sensorHistoryFor",2),p([f()],h.prototype,"starting",2),p([f()],h.prototype,"unsupported",2);customElements.get("wa-rooms-editor")||customElements.define("wa-rooms-editor",h);export{h as WaRoomsEditor};
