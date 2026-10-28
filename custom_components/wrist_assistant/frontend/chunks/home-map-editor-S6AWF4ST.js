import{$ as rn,A as jo,Aa as se,B as Bo,Ba as Fe,C as rt,Ca as ze,D as Uo,Da as Ne,E as Kt,Ea as bn,F as Vo,Fa as xe,G as Xo,Ga as yn,H as qo,Ha as le,I as Yo,Ia as ft,J as Me,Ja as wn,K as Oe,Ka as Mn,L as Zo,La as de,M as Jo,N as Qo,O as Wt,P as en,Q as tn,R as st,S as $e,T as on,U as nn,V as Gt,W as Z,X as lt,Y as dt,Z as an,_ as jt,a as ne,aa as pt,b as Lt,ba as Bt,c as Ft,ca as _e,d as ie,da as ht,e as zt,ea as sn,f as B,fa as ln,g as U,ga as dn,h as Ao,ha as Ut,i as it,ia as J,j as at,ja as ke,k as Nt,ka as pn,l as Lo,la as hn,m as Fo,ma as Vt,n as ae,na as Ae,o as ye,oa as mt,p as W,pa as Xt,q as we,qa as mn,r as re,ra as cn,s as zo,sa as un,t as No,ta as fn,u as Ko,ua as Le,v as Wo,va as qt,w as Ce,wa as ct,x as Re,xa as gn,y as Go,ya as vn,z as De,za as ut}from"./chunk-S3MT6EFB.js";import{c as et,j as So,k as Io,na as Oo,oa as _o}from"./chunk-5H6OWAXC.js";import"./chunk-7T6IEW6M.js";import"./chunk-J2WKPEGJ.js";import{b as At}from"./chunk-S3NOJWAC.js";import{B as Ie,C as Ye,D as x,G as L,H as D,I as Ze,J as te,K as oe,M as xo,O as Y,P as Ho,Q as Je,R as Qe,X as Po,Y as Eo,Z as z,da as Ot,ea as F,k as Mo,m as qe,n as $o,q as Se,r as ko}from"./chunk-FWB3FRJL.js";import{i as tt,l as Co,m as Ro,n as ot,r as nt,s as _t,t as Do}from"./chunk-CPEKF3CW.js";import{$g as Xe,Eh as ve,Mh as To,ah as yo,b as vo,d as c,e as b,g,hg as Dt,j as bo,k as q,l as O,vh as wo}from"./chunk-H2SVQBFU.js";import{db as be}from"./chunk-OM34V22N.js";import{a as I}from"./chunk-LO2NM3CE.js";var $n=["arrange","shape","devices","style"],Yt={arrange:"Arrange",shape:"Shape",devices:"Devices",style:"Style"};function He(l){return l===void 0||l.kind==="pin"||l.kind==="pins"?void 0:l.roomId}function kn(l,t){if(t===void 0)return!0;if(l===void 0)return!1;if(t.kind==="pin")return l.pins.some(o=>x(o.id,t.pinId));if(t.kind==="pins")return t.pinIds.every(o=>l.pins.some(n=>x(n.id,o)));let e=l.rooms.find(o=>x(o.id,t.roomId));if(e===void 0)return!1;switch(t.kind){case"room":return!0;case"wall":return W(e)[t.wall]!==void 0;case"corner":return e.outline[t.corner]!==void 0;case"opening":return e.openings[t.opening]!==void 0;case"object":return e.objects[t.object]!==void 0}}var xn=4,Hn=2400;function Pn(l,t){return[l.ox+t[0]*l.scale,l.oy+t[1]*l.scale]}function gt(l,t){return[(t[0]-l.ox)/l.scale,(t[1]-l.oy)/l.scale]}function Zt(l,t,e,o=56,n=96){let i=l===void 0||l.rooms.length===0&&l.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:Ze(l),r=Math.max(i.maxX-i.minX,1),s=Math.max(i.maxY-i.minY,1),d=Cn(Math.min(Math.max(t-o*2,40)/r,Math.max(e-n*2,40)/s),xn,Hn);return{scale:d,ox:t/2-(i.minX+i.maxX)/2*d,oy:e/2-(i.minY+i.maxY)/2*d}}function Jt(l,t,e){let o=Cn(l.scale*t,xn,Hn),n=o/l.scale;return{scale:o,ox:e[0]-(e[0]-l.ox)*n,oy:e[1]-(e[1]-l.oy)*n}}function En(l,t){return Math.round(l.scale/t.scale*100)}var Ke=1.25;function Tn(l){if(typeof l!="object"||l===null)return!1;let t=l;if(t.isContentEditable===!0)return!0;let e=typeof t.tagName=="string"?t.tagName.toUpperCase():"";if(e==="TEXTAREA"||e==="SELECT")return!0;if(e!=="INPUT")return!1;let o=typeof t.type=="string"?t.type.toLowerCase():"text";return!["button","checkbox","radio","range","color","submit","reset","file","image"].includes(o)}function Sn(l,t){if(typeof l!="object"||l===null)return!1;let e=l;return typeof e.tagName!="string"||e.tagName.toUpperCase()!=="INPUT"||typeof e.type!="string"||e.type.toLowerCase()!=="range"?!1:["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","PageUp","PageDown"].includes(t)}function Q(l,t){if(t)return;let e=l.metaKey===!0||l.ctrlKey===!0,o=l.key.length===1?l.key.toLowerCase():l.key;if(e)return o==="z"?l.shiftKey===!0?"redo":"undo":o==="y"?"redo":void 0;if(l.altKey===!0)return;switch(o){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit"}let n=l.shiftKey===!0?.1:.01;if(o==="ArrowLeft")return{nudge:[-n,0]};if(o==="ArrowRight")return{nudge:[n,0]};if(o==="ArrowUp")return{nudge:[0,-n]};if(o==="ArrowDown")return{nudge:[0,n]};if(/^[a-z]$/.test(o)&&l.shiftKey!==!0)return{letter:o}}function Qt(){let l=globalThis.navigator,t=`${typeof l?.platform=="string"?l.platform:""} ${typeof l?.userAgent=="string"?l.userAgent:""}`;return/Mac|iPhone|iPad/.test(t)}function In(){return Qt()?"\u2318Z":"Ctrl+Z"}var Cn=(l,t,e)=>Math.min(Math.max(l,t),e);function eo(l,t=2){return`${(Math.round(l*10**t)/10**t).toFixed(t)} m`}function to(l,t=2){let e=(Math.round(l*10**t)/10**t).toFixed(t);return/^-0(\.0*)?$/.test(e)?e.slice(1):e}function Rn(l){let t=l.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(t===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t))return;let e=Number(t);if(Number.isFinite(e))return/cm$/i.test(l.trim())?e/100:e}function vt(l){if(l.outline.length<3)return{width:0,depth:0,area:0};let{a0:t,a1:e,c0:o,c1:n}=Nt(l,Ft(l));return{width:e-t,depth:n-o,area:Math.abs(Lo(l.outline))}}function We(l){let{width:t,depth:e}=vt(l);return`${t.toFixed(1)} \xD7 ${e.toFixed(1)} m`}function Dn(l){if(l.outline.length<3)return l.outline.slice();let{a0:t,a1:e,c0:o,c1:n,point:a}=Nt(l,Ft(l));return[a(t,o),a(e,o),a(e,n),a(t,n)]}function di(l,t){let e=W(l)[t];if(e===void 0)return"inner";let o=Math.max(Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]),1e-9),n=-(e.b[1]-e.a[1])/o,a=(e.b[0]-e.a[0])/o,i=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],r=Math.max(e.t,.1)+.1,s=zt(l.outline,[i[0]+n*r,i[1]+a*r]),d=zt(l.outline,[i[0]-n*r,i[1]-a*r]);if(s&&d)return"inner";if(s)n=-n,a=-a;else if(!d){let h=B(l);h!==void 0&&(h[0]-i[0])*n+(h[1]-i[1])*a>0&&(n=-n,a=-a)}return Math.abs(n)>Math.abs(a)?n>0?"right":"left":a>0?"bottom":"top"}function oo(l,t,e){let o=di(l,t);return`${e}, ${o} wall`}function pe(l){return l.kind==="opening"?"Way through":l.kind==="window"?l.style==="sliding"?"Sliding window":"Window":l.style==="double"?"Double door":l.style==="sliding"?"Sliding door":"Door"}var pi={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function he(l){let t=pi[l];if(t!==void 0)return t;let e=l.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return e.charAt(0).toUpperCase()+e.slice(1)}function C(l,t,e=`${t}s`){return`${l} ${l===1?t:e}`}function H(l,t,e,o=""){return c`<section class="hme-card ${o}">
    <div class="hme-h">${l}${e===void 0?g:c`<span class="hme-h-end">${e}</span>`}</div>
    ${t}
  </section>`}function E(l,...t){return c`<div class="hme-r"><span class="hme-l">${l}</span>${t}</div>`}function K(l){return c`<p class="hme-hint">${l}</p>`}function _(l){let t=l.digits??2,e=l.value===void 0?"":to(l.value,t),o=n=>{let a=Rn(n.value);if(a===void 0||l.min!==void 0&&a<l.min||l.max!==void 0&&a>l.max||to(a,t)===e){n.value=e;return}l.set(a)};return c`<span class="hme-in hme-num" style=${l.width===void 0?g:`flex:0 0 ${l.width}`}>
    <input type="text" inputmode="decimal" aria-label=${l.label} .value=${F(e)} ?disabled=${l.disabled===!0}
      placeholder=${l.value===void 0?"Mixed":""}
      @change=${n=>o(n.target)}
      @keydown=${n=>{n.key==="Enter"&&n.target.blur(),n.key==="Escape"&&(n.target.value=e,n.target.blur())}} />${l.unit===void 0?g:c`<span class="hme-unit">${l.unit}</span>`}</span>`}function Ge(l){return c`<span class="hme-in"><input type="text" aria-label=${l.label} maxlength=${l.max??100} placeholder=${l.placeholder??""}
    .value=${F(l.value)}
    @change=${t=>{let e=t.target.value;e.trim()!==l.value.trim()&&l.set(e)}}
    @keydown=${t=>{t.key==="Enter"&&t.target.blur()}} /></span>`}function me(l){return c`<span class="hme-in hme-sel ${l.cls??""}"><select aria-label=${l.label} @change=${t=>l.set(t.target.value)}>
    ${l.options.map(t=>c`<option value=${t.value} ?disabled=${t.disabled===!0} .selected=${F(t.value===l.value)}>${t.label}</option>`)}
  </select></span>`}function no(l){return c`<span class="hme-menu ${l.cls??""}"><select aria-label=${l.label} @change=${t=>{let e=t.target,o=e.value;e.value="",o!==""&&l.pick(o)}}>
    <option value="" .selected=${F(!0)}>${l.label}</option>
    ${l.options.map(t=>c`<option value=${t.value} ?disabled=${t.disabled===!0}>${t.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function G(l){return c`<button type="button" class="hme-pic ${l.on?"on":""}" aria-pressed=${l.on?"true":"false"} title=${l.title??l.label}
    @click=${l.click}>${l.picture}<span>${l.label}</span></button>`}function je(l){return c`<button type="button" class="hme-chip ${l.on?"":"off"}" aria-pressed=${l.on?"true":"false"} aria-label=${l.label}
    @click=${l.click}>${l.on?l.onText:l.offText}</button>`}var hi={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},io={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function ao(l){return c`<span class="hme-sw" style=${`background:${hi[l]}`}></span>`}var On=l=>l.map(([t,e])=>`${Math.round(t*10)/10},${Math.round(e*10)/10}`).join(" ");function ro(l,t=34,e=24){let o=l?.rooms??[];if(o.length===0)return c`<svg class="hme-thumb" width=${t} height=${e} viewBox=${`0 0 ${t} ${e}`} aria-hidden="true">
      <rect x="1" y="1" width=${t-2} height=${e-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let n=Ze(l),a=4,i=Math.min((t-a*2)/Math.max(n.maxX-n.minX,.5),(e-a*2)/Math.max(n.maxY-n.minY,.5)),r=t/2-(n.minX+n.maxX)/2*i,s=e/2-(n.minY+n.maxY)/2*i;return c`<svg class="hme-thumb" width=${t} height=${e} viewBox=${`0 0 ${t} ${e}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${t-1} height=${e-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${o.map(d=>b`<polygon points=${On(d.outline.map(([h,p])=>[r+h*i,s+p*i]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function _n(l,t,e=76,o=54){let n=l.outline.map(v=>v[0]),a=l.outline.map(v=>v[1]),i=Math.min(...n),r=Math.max(...n),s=Math.min(...a),d=Math.max(...a),h=8,p=Math.min((e-h*2)/Math.max(r-i,.5),(o-h*2)/Math.max(d-s,.5)),m=e/2-(i+r)/2*p,u=o/2-(s+d)/2*p,f=On(l.outline.map(([v,w])=>[m+v*p,u+w*p]));return c`<svg class="hme-room-thumb" width=${e} height=${o} viewBox=${`0 0 ${e} ${o}`} aria-hidden="true">
    <rect width=${e} height=${o} rx="8" fill="#121010" />
    <polygon points=${f} fill=${io[it(l)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${t?b`<circle cx=${e*.58} cy=${o*.42} r=${Math.min(e,o)*.22} fill="#ffb648" opacity="0.35" />`:g}
  </svg>`}function Ln(l){return{get:()=>Xe(l),save:(t,e)=>yo(l,t,e)}}var Fn="The map had changed on another device. Your change was saved on top of it.",mi="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",ci="The map changed again while saving, so your change was not saved. Try it once more.";function ui(l){return{doc:Ye(l?.doc)??null,rev:typeof l?.rev=="number"?l.rev:0}}function An(l,t){let e=typeof t=="function"?t(l):Po(l,t);if(e===void 0)return;let o=Ie(e);return o.ok?{doc:o.doc}:{text:`Not saved. ${o.message}.`}}async function zn(l,t,e){if(t.doc===null)return{ok:!1,text:"There is no map to change yet."};let o=An(t.doc,e);if(o===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in o)return{ok:!1,text:o.text};try{let i=await l.save(o.doc,t.rev);return{ok:!0,read:{doc:o.doc,rev:i.rev},merged:!1}}catch(i){let{code:r,message:s}=be(i);if(r!=="conflict")return{ok:!1,text:`Not saved. ${s}`}}let n;try{n=ui(await l.get())}catch(i){return{ok:!1,text:`Not saved. The map changed on another device and could not be read again: ${be(i).message}`}}let a=n.doc===null?void 0:An(n.doc,e);if(a===void 0)return{ok:!1,text:mi,read:n};if("text"in a)return{ok:!1,text:a.text,read:n};try{let i=await l.save(a.doc,n.rev);return{ok:!0,read:{doc:a.doc,rev:i.rev},merged:!0}}catch(i){let{code:r,message:s}=be(i);return{ok:!1,text:r==="conflict"?ci:`Not saved. ${s}`,read:n}}}function bt(l){return Array.isArray(l)?`[${l.map(bt).join(",")}]`:typeof l=="object"&&l!==null?`{${Object.entries(l).filter(([,e])=>e!==void 0).sort(([e],[o])=>e<o?-1:e>o?1:0).map(([e,o])=>`${JSON.stringify(e)}:${bt(o)}`).join(",")}}`:JSON.stringify(l)}function fi(l,t){return l===t?!0:l==null||t==null?!1:bt(l)===bt(t)}function Nn(l,t){return e=>fi(e,l)?t:void 0}var yt=class{constructor(t,e,o=()=>{},n=()=>{},a){this.api=t;this.changed=o;this.saved=n;this.state={kind:"saved"};this.queue=[];this.confirmed=e,this.doc=e.doc,this.history=new vn(a)}get busy(){return this.queue.length>0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(t){return this.busy?!1:(this.confirmed=t,this.doc=t.doc,this.history.clear(),this.changed(),!0)}apply(t){let e=this.doc;if(e===null)return!1;let o=t(e);if(o===void 0)return!1;let n=Ie(o);return n.ok?(this.history.push(e),this.doc=n.doc,this.enqueue(t),!0):(this.note={kind:"err",text:`That cannot be saved. ${n.message}.`},this.changed(),!1)}undo(){let t=this.doc;if(t===null)return!1;let e=this.history.undo(t);return e===void 0?!1:(this.doc=e,this.enqueue(Nn(t,e)),!0)}redo(){let t=this.doc;if(t===null)return!1;let e=this.history.redo(t);return e===void 0?!1:(this.doc=e,this.enqueue(Nn(t,e)),!0)}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}enqueue(t){this.queue.push(t),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0?this.kick():this.changed()}))}async run(){for(;this.queue.length>0;){let t=this.queue.splice(0),e=t.length===1?t[0]:n=>t.reduce((a,i)=>a===void 0?void 0:i(a),n);this.state={kind:"saving"},this.changed();let o=await zn(this.api,this.confirmed,e);if(o.ok){this.confirmed=o.read,this.saved(o.read),o.merged?(this.note={kind:"warn",text:Fn},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=o.read.doc);continue}this.queue=[],this.history.clear(),o.read!==void 0&&(this.confirmed=o.read,this.saved(o.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:o.text},this.state={kind:"error",text:o.text},this.changed();return}this.state={kind:"saved"}}rebased(){let t=this.confirmed.doc;if(t===null)return null;let e=[];for(let o of this.queue){let n=o(t);if(n===void 0)continue;let a=Ie(n);a.ok&&(t=a.doc,e.push(o))}return this.queue=e,t}};var Kn=vo`
  :host {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    container-type: inline-size;
    color: var(--wa-ink);
    background: var(--wa-bg);
    font-size: 13px;
    --hme-sel: #5b8def;
    --hme-sel-bg: rgba(91, 141, 239, 0.16);
    --hme-amber: #ffb340;
    --hme-thumb-bg: var(--wa-input);
    --hme-mono: var(--wa-mono, "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace);
  }
  * { box-sizing: border-box; }
  h3, p { margin: 0; }
  .mono { font-family: var(--hme-mono); }
  .dim { color: var(--wa-faint); }

  /* ── the page ─────────────────────────────────────────────────────── */
  .hme { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; }
  .hme-body {
    flex: 1 1 auto;
    min-height: 600px;
    display: grid;
    grid-template-columns: minmax(220px, 264px) minmax(0, 1fr) minmax(300px, 440px);
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas: "rail stage insp";
    gap: 12px;
    padding: 12px;
  }
  .hme-rail { grid-area: rail; }
  .hme-insp { grid-area: insp; }
  .hme-stage-wrap { grid-area: stage; position: relative; min-width: 0; min-height: 520px; }
  .hme-rail, .hme-insp { display: flex; flex-direction: column; gap: 10px; min-width: 0; min-height: 0; overflow: auto; }

  @container (max-width: 1180px) {
    .hme-body {
      grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
      grid-template-rows: minmax(520px, 1fr) auto;
      grid-template-areas: "stage insp" "rail insp";
    }
    .hme-rail { overflow: visible; }
  }
  @container (max-width: 760px) {
    .hme-body { display: flex; flex-direction: column; min-height: 0; }
    .hme-stage-wrap { flex: none; height: max(420px, 64vh); }
    .hme-rail, .hme-insp { overflow: visible; }
    .hme-bar { gap: 10px; }
    .hme-hint { margin-left: 0; }
    .hme-row-end.indent { padding-left: 0; }
  }

  /* ── buttons ──────────────────────────────────────────────────────── */
  .hme-tb, .hme-menu {
    height: 30px;
    padding: 0 12px;
    border-radius: 8px;
    border: 1px solid var(--wa-line-strong);
    background: var(--wa-card);
    color: var(--wa-soft);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    white-space: nowrap;
    flex: none;
  }
  .hme-tb:hover:not(:disabled), .hme-menu:hover { background: var(--wa-hover); color: var(--wa-ink); }
  .hme-tb:focus-visible, .hme-menu:focus-within { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }
  .hme-tb.on { background: var(--wa-raise); color: var(--wa-ink); }
  .hme-tb:disabled { opacity: 0.42; cursor: default; }
  .hme-tb.danger { color: var(--wa-need); }
  .hme-tb.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }
  .hme-tb.primary.danger-fill { background: var(--wa-need); color: #fff; }
  .hme-tb.hme-icon { width: 30px; padding: 0; font-size: 15px; }
  .hme-tb.hme-wide { width: 100%; height: 36px; }
  .hme-tb.push { margin-left: auto; }
  .hme-menu { position: relative; padding: 0; }
  .hme-menu select {
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    height: 100%;
    padding: 0 28px 0 12px;
    cursor: pointer;
    outline: none;
  }
  .hme-menu-caret { position: absolute; right: 10px; pointer-events: none; color: var(--wa-faint); font-size: 11px; }
  .hme-link { border: 0; background: none; padding: 0; color: var(--hme-sel); font: inherit; font-size: 13px; cursor: pointer; white-space: nowrap; }
  .hme-link:hover { text-decoration: underline; }
  .hme-x { border: 0; background: none; color: var(--wa-faint); font-size: 16px; line-height: 1; width: 22px; height: 22px; border-radius: 6px; cursor: pointer; flex: none; }
  .hme-x:hover { background: var(--wa-hover); color: var(--wa-need); }

  .hme-seg { display: inline-flex; padding: 3px; gap: 2px; border-radius: 10px; background: var(--wa-card); border: 1px solid var(--wa-line); flex: none; }
  .hme-seg button {
    height: 28px; padding: 0 14px; border: 0; border-radius: 7px; background: transparent; color: var(--wa-muted);
    font: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
  }
  .hme-seg button:hover { color: var(--wa-ink); }
  .hme-seg button.on { background: var(--wa-raise); color: var(--wa-ink); }
  .hme-seg button:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }

  /* ── the bar ──────────────────────────────────────────────────────── */
  .hme-bar {
    min-height: 58px; display: flex; align-items: center; gap: 14px; padding: 8px 16px; flex-wrap: wrap;
    border-bottom: 1px solid var(--wa-line); background: var(--wa-raised);
  }
  .hme-back { border: 0; background: none; color: var(--wa-muted); font: inherit; font-size: 13px; cursor: pointer; padding: 0; }
  .hme-back:hover { color: var(--wa-ink); }
  .hme-vsep { width: 1px; height: 22px; background: var(--wa-line-strong); flex: none; }
  .hme-title { font-size: 15px; }
  .hme-beta { font-size: 10px; border: 1px solid var(--wa-line-strong); border-radius: 6px; padding: 1px 6px; color: var(--wa-muted); letter-spacing: 0.06em; }
  .hme-flex { flex: 1 1 0; min-width: 0; }
  .hme-floor-wrap { position: relative; }
  .hme-tb.hme-floor-btn { height: 38px; padding: 0 12px 0 8px; gap: 10px; }
  .hme-floor-t { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.2; text-align: left; }
  .hme-floor-t > span { color: var(--wa-ink); font-weight: 600; }
  .hme-floor-t > small { color: var(--wa-faint); font-size: 11px; }
  .hme-caret { color: var(--wa-muted); font-size: 11px; }
  .hme-status { color: var(--wa-faint); font-size: 12px; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  .hme-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #30d158; }
  .hme-status.saving .hme-status-dot { background: var(--hme-amber); }
  .hme-status.error { color: var(--wa-need); }
  .hme-status.error .hme-status-dot { background: var(--wa-need); }
  .hme-pop {
    position: absolute; top: calc(100% + 6px); left: 0; z-index: 30; min-width: 320px; padding: 6px;
    display: flex; flex-direction: column; gap: 2px;
    background: var(--wa-card); border: 1px solid var(--wa-line-strong); border-radius: 12px; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  }
  .hme-pop-row { display: flex; align-items: center; gap: 4px; border-radius: 9px; }
  .hme-pop-row.on { background: var(--hme-sel-bg); }
  .hme-pop-main { flex: 1; display: flex; align-items: center; gap: 10px; padding: 6px; border: 0; background: none; color: var(--wa-ink); font: inherit; cursor: pointer; border-radius: 8px; }
  .hme-pop-main:hover { background: var(--wa-hover); }
  .hme-pop-act { border: 0; background: none; color: var(--wa-muted); font: inherit; font-size: 12px; padding: 4px 8px; border-radius: 6px; cursor: pointer; }
  .hme-pop-act:hover:not(:disabled) { background: var(--wa-hover); color: var(--wa-ink); }
  .hme-pop-act.danger:hover:not(:disabled) { color: var(--wa-need); }
  .hme-pop-act:disabled { opacity: 0.4; cursor: default; }
  .hme-pop-add { margin-top: 4px; border: 1px dashed var(--wa-line-strong); background: none; color: var(--wa-soft); font: inherit; height: 34px; border-radius: 8px; cursor: pointer; }
  .hme-pop-add:hover { background: var(--wa-hover); color: var(--wa-ink); }
  svg.hme-thumb { display: block; flex: none; }

  .hme-note {
    display: flex; align-items: center; gap: 10px; margin: 10px 12px 0; padding: 10px 12px; font-size: 13px;
    border-radius: 12px; border: 1px solid var(--wa-line); background: var(--wa-card);
  }
  .hme-note > span { flex: 1; min-width: 0; }
  .hme-note.warn { border-color: var(--wa-amber-line, var(--hme-amber)); background: var(--wa-amber-bg, var(--wa-card)); }
  .hme-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }

  /* ── cards ────────────────────────────────────────────────────────── */
  .hme-card { background: var(--wa-card); border: 1px solid var(--wa-line); border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; flex: none; }
  .hme-h { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--wa-muted); display: flex; align-items: center; gap: 8px; }
  .hme-h-end { margin-left: auto; letter-spacing: 0; text-transform: none; font-weight: 500; color: var(--wa-faint); }
  .hme-amber { color: var(--hme-amber); font-weight: 600; }
  .hme-r { display: flex; align-items: center; gap: 10px; min-height: 32px; }
  .hme-r.tight { min-height: 28px; }
  .hme-l { flex: 0 0 92px; color: var(--wa-muted); font-size: 13px; }
  .hme-l.short { flex: 0 0 auto; }
  .hme-grow { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hme-val { color: var(--wa-soft); }
  .hme-val.strong { color: var(--wa-ink); }
  .hme-text { color: var(--wa-soft); line-height: 1.45; }
  .hme-text.dim { color: var(--wa-faint); font-size: 12px; }
  .hme-empty-line { color: var(--wa-faint); font-size: 12.5px; padding: 2px 10px; }
  .hme-hint { color: var(--wa-faint); font-size: 12px; line-height: 1.45; margin: 0 0 0 102px; }
  .hme-row-end { display: flex; gap: 8px; padding-top: 4px; flex-wrap: wrap; align-items: center; }
  .hme-row-end.indent { padding-left: 102px; }
  .hme-in {
    flex: 1; min-width: 0; height: 32px; border-radius: 8px; border: 1px solid var(--wa-line); background: var(--wa-input);
    color: var(--wa-ink); display: flex; align-items: center; padding: 0 10px; gap: 4px;
  }
  .hme-in:focus-within { border-color: var(--hme-sel); }
  .hme-in input, .hme-in select {
    flex: 1; min-width: 0; width: 100%; height: 100%; border: 0; background: transparent; color: inherit; font: inherit; font-size: 13px; outline: none; padding: 0;
  }
  .hme-in select { cursor: pointer; }
  .hme-num input { font-family: var(--hme-mono); }
  .hme-unit { color: var(--wa-faint); font-size: 12px; }
  .hme-in.hme-ro { color: var(--wa-soft); }
  .hme-pics { display: flex; gap: 10px; flex-wrap: wrap; }
  .hme-pic { display: flex; flex-direction: column; align-items: center; gap: 5px; font: inherit; font-size: 11px; color: var(--wa-muted); border: 0; background: none; padding: 0; cursor: pointer; max-width: 72px; text-align: center; }
  .hme-pic > svg { border-radius: 8px; border: 1px solid #3a3a3c; background: #1f1f21; display: block; }
  .hme-sw { width: 52px; height: 38px; border-radius: 8px; border: 1px solid var(--wa-line-strong); display: block; }
  .hme-pic:hover { color: var(--wa-ink); }
  .hme-pic.on { color: var(--wa-ink); }
  .hme-pic.on > svg, .hme-pic.on > .hme-sw { outline: 2px solid var(--hme-sel); outline-offset: 2px; }
  .hme-pic:focus-visible { outline: none; }
  .hme-pic:focus-visible > svg, .hme-pic:focus-visible > .hme-sw { outline: 2px solid var(--hme-sel); outline-offset: 2px; }
  .hme-chip {
    height: 26px; padding: 0 10px; border-radius: 13px; background: var(--wa-input); border: 1px solid var(--wa-line);
    color: var(--wa-soft); font: inherit; font-size: 12px; cursor: pointer; flex: none;
  }
  .hme-chip.off { color: var(--wa-faint); }
  .hme-head { flex-direction: row; align-items: center; gap: 14px; }
  .hme-head-t { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .hme-head-t strong { font-size: 17px; }
  .hme-head-t span { color: var(--wa-muted); font-size: 12px; }
  svg.hme-room-thumb { flex: none; display: block; }
  .hme-list-row {
    display: flex; align-items: center; gap: 10px; min-height: 32px; padding: 0 8px; border-radius: 8px; border: 0; background: none;
    color: var(--wa-soft); font: inherit; font-size: 13px; width: 100%; text-align: left; cursor: pointer;
  }
  .hme-list-row:hover { background: var(--wa-hover); }
  .hme-list-row.on { background: var(--hme-sel-bg); color: var(--wa-ink); }
  /* A device of several picked: its name picks it alone, × leaves it out. */
  .hme-pick-row { cursor: default; padding-right: 2px; }
  .hme-pick-row .hme-link { color: var(--wa-ink); text-align: left; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .hme-x {
    flex: none; width: 24px; height: 24px; border: 0; border-radius: 6px; background: none; color: var(--wa-faint);
    font: inherit; font-size: 16px; line-height: 1; cursor: pointer;
  }
  .hme-x:hover { background: var(--wa-hover); color: var(--wa-ink); }
  .hme-x:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }

  /* ── the rail ─────────────────────────────────────────────────────── */
  .hme-find { display: flex; align-items: center; gap: 8px; height: 34px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--wa-line); background: var(--wa-input); color: var(--wa-faint); flex: none; }
  .hme-find:focus-within { border-color: var(--hme-sel); }
  .hme-find input { flex: 1; min-width: 0; border: 0; background: transparent; color: var(--wa-ink); font: inherit; outline: none; }
  .hme-layers { padding: 10px 8px; gap: 2px; }
  .hme-layers > .hme-h { padding: 4px 10px 8px; }
  .hme-lay {
    display: flex; align-items: center; gap: 8px; min-height: 30px; padding: 0 10px; border-radius: 7px; border: 0; background: none;
    color: var(--wa-soft); font: inherit; font-size: 13px; width: 100%; text-align: left; cursor: pointer;
  }
  .hme-lay:hover { background: var(--wa-hover); }
  .hme-lay.on { background: var(--hme-sel-bg); color: var(--wa-ink); }
  .hme-lay.sub { padding-left: 30px; color: var(--wa-muted); font-size: 12px; min-height: 26px; }
  .hme-lay.subsub { padding-left: 44px; color: var(--wa-muted); font-size: 12px; min-height: 28px; justify-content: space-between; cursor: default; }
  button.hme-lay.subsub { cursor: pointer; }
  .hme-lay.dim { color: var(--wa-muted); }
  .hme-lay .n { margin-left: auto; color: var(--wa-faint); font-size: 12px; white-space: nowrap; }
  .hme-dot { width: 10px; height: 10px; border-radius: 3px; flex: none; }
  .hme-dot.dev { border-radius: 50%; background: var(--hme-amber); }
  .hme-sep { height: 1px; background: var(--wa-line); margin: 8px 6px; flex: none; }
  .hme-foot { color: var(--wa-faint); font-size: 12px; line-height: 1.45; margin: 2px 4px; }
  .hme-tools { padding: 10px 8px; gap: 2px; }
  .hme-tools > .hme-h { padding: 4px 10px 8px; }
  .hme-tool {
    display: flex; align-items: center; gap: 10px; height: 38px; padding: 0 10px; border-radius: 9px; border: 0; background: none;
    color: var(--wa-soft); font: inherit; font-size: 13px; font-weight: 500; width: 100%; text-align: left; cursor: pointer;
  }
  .hme-tool:hover { background: var(--wa-hover); }
  .hme-tool.on { background: var(--hme-sel-bg); color: var(--wa-ink); }
  .hme-tool > svg { flex: 0 0 18px; }
  .hme-tool kbd { margin-left: auto; font: 500 11px var(--hme-mono); color: var(--wa-faint); border: 1px solid var(--wa-line-strong); border-radius: 5px; padding: 1px 5px; }
  .hme-fix { display: flex; gap: 10px; align-items: flex-start; padding: 10px; border-radius: 10px; background: var(--wa-input); border: 1px solid var(--wa-line); }
  .hme-fix p { font-size: 12.5px; line-height: 1.4; color: var(--wa-soft); flex: 1; cursor: pointer; }
  .hme-fix b { color: var(--wa-ink); font-weight: 600; }
  .hme-fix-dot { width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; background: var(--hme-amber); flex: none; }
  .hme-fix-dot.gray { background: #8e8e93; }

  /* ── the stage ────────────────────────────────────────────────────── */
  .hme-stage { position: absolute; inset: 0; border-radius: 16px; border: 1px solid var(--wa-line); background: #11100f; overflow: hidden; }
  svg.hme-svg { display: block; position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; user-select: none; -webkit-user-select: none; }
  svg.hme-svg text { font-family: var(--wa-font, inherit); }
  .hme-tag text { font-size: 11px; font-weight: 600; }
  .hme-pill, .hme-dock {
    position: absolute; left: 50%; transform: translateX(-50%); z-index: 2;
    display: flex; gap: 4px; align-items: center; padding: 4px; border-radius: 12px;
    background: rgba(28, 28, 30, 0.92); border: 1px solid #3a3a3c; white-space: nowrap;
    max-width: calc(100% - 28px); overflow-x: auto; scrollbar-width: none;
    -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  }
  .hme-pill { top: 14px; }
  .hme-dock { bottom: 14px; gap: 6px; padding: 6px; }
  .hme-pill-name { padding: 0 10px; display: inline-flex; align-items: center; font-weight: 600; color: #fff; }
  .hme-pill .hme-tb, .hme-dock .hme-tb, .hme-pill .hme-menu, .hme-stage-empty .hme-tb { background: #161617; border-color: #2c2c2e; color: #d1d1d6; }
  .hme-pill .hme-tb:hover:not(:disabled), .hme-dock .hme-tb:hover:not(:disabled), .hme-pill .hme-menu:hover { background: #2c2c2e; color: #fff; }
  .hme-dock .hme-tb.on { background: #2c2c2e; color: #fff; border-color: #48484a; }
  .hme-pill .hme-tb.danger { color: #ff6961; }
  .hme-pill .hme-menu-caret { color: #98989d; }
  .hme-dock .hme-vsep { background: #3a3a3c; height: 20px; }
  .hme-zoom { width: 48px; text-align: center; color: #d1d1d6; font-size: 12px; }
  .hme-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #ffbf55; }
  .hme-tb:not(.on) > .hme-live-dot { background: #636366; }
  .hme-stage-empty {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 20px 24px; border-radius: 14px; background: rgba(28, 28, 30, 0.9); border: 1px solid #3a3a3c; color: #d1d1d6; text-align: center; max-width: 340px;
  }
  .hme-stage-empty b { color: #fff; font-size: 14px; }

  /* ── shared by Devices and Style ──────────────────────────────────── */
  .hme-pad { padding: 4px 6px; }
  .hme-chips { display: flex; flex-wrap: wrap; gap: 6px; min-width: 0; }
  .hme-chip.sel.on { background: var(--hme-sel-bg); border-color: var(--hme-sel); color: var(--wa-ink); }
  .hme-chip:disabled { opacity: 0.45; cursor: default; }
  .hme-r.top { align-items: flex-start; }
  .hme-r.top > .hme-l { padding-top: 6px; }
  .hme-w48 { flex: 0 0 52px; text-align: right; }
  /* The panel's own slider (form-styles.ts), its fill from --p. Mixed, for
     several picked things that differ: no fill and an empty dashed knob
     until it is moved. */
  .hme-range { flex: 1; min-width: 0; }
  .hme-range.mixed::-webkit-slider-thumb { background: transparent; border: 2px dashed var(--wa-faint); box-shadow: none; }
  .hme-range.mixed::-moz-range-thumb { background: transparent; border: 2px dashed var(--wa-faint); box-shadow: none; }
  .hme-range.mixed::-moz-range-progress { background: transparent; }

  /* ── Devices ──────────────────────────────────────────────────────── */
  .hme-tray { gap: 6px; }
  .hme-ar { font-size: 11px; font-weight: 600; color: var(--wa-muted); margin: 8px 2px 2px; display: flex; }
  .hme-ar.dim { color: var(--wa-faint); }
  .hme-ar > span { margin-left: auto; font-weight: 500; color: var(--wa-faint); }
  .hme-dv {
    display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 4px 8px; border-radius: 9px;
    background: var(--wa-input); border: 1px solid var(--wa-line); cursor: grab; flex: none; outline: none;
  }
  .hme-dv:hover { border-color: var(--wa-line-strong); }
  .hme-dv:focus-visible { border-color: var(--hme-sel); }
  .hme-dv.dragging { opacity: 0.45; border-style: dashed; }
  .hme-dv.placed { cursor: pointer; }
  .hme-dv-ic { width: 24px; height: 24px; border-radius: 50%; background: var(--wa-raise); color: var(--wa-soft); display: flex; align-items: center; justify-content: center; flex: 0 0 24px; }
  .hme-dv-nm { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.2; color: var(--wa-ink); overflow: hidden; }
  .hme-dv-nm small { color: var(--wa-faint); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hme-dv-grip { color: var(--wa-faint); font-size: 13px; }
  .hme-dot.gray { background: #8e8e93; }
  .hme-pin-big { width: 46px; height: 46px; border-radius: 50%; background: #2c2c2e; display: flex; align-items: center; justify-content: center; flex: none; }
  .hme-state { color: var(--wa-soft); font-weight: 600; white-space: nowrap; }
  .hme-state.lit { color: #e6a52e; }
  .hme-in.hme-icon-btn { font: inherit; font-size: 13px; text-align: left; cursor: pointer; gap: 8px; color: var(--wa-ink); }
  .hme-icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 4px; padding: 6px; border-radius: 10px; border: 1px solid var(--wa-line); background: var(--wa-input); }
  .hme-icon-cell {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 4px; border-radius: 8px; border: 1px solid transparent;
    background: none; color: var(--wa-soft); font: inherit; font-size: 10.5px; cursor: pointer; text-align: center;
  }
  .hme-icon-cell:hover { background: var(--wa-hover); color: var(--wa-ink); }
  .hme-icon-cell.on { border-color: var(--hme-sel); background: var(--hme-sel-bg); color: var(--wa-ink); }
  .hme-pick { position: relative; display: inline-flex; align-items: center; gap: 6px; }
  .hme-pick input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; border: 0; padding: 0; }
  .hme-swatch { width: 12px; height: 12px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.4); }
  .hme-side {
    position: absolute; left: 16px; bottom: 70px; z-index: 2; width: 300px; max-width: calc(100% - 32px); padding: 12px 14px; border-radius: 12px;
    background: rgba(22, 22, 23, 0.95); border: 1px solid #3a3a3c; display: flex; flex-direction: column; gap: 8px; color: #fff;
  }
  .hme-side .hme-h { color: #98989d; }
  .hme-side svg { width: 100%; height: auto; display: block; touch-action: none; user-select: none; -webkit-user-select: none; }
  .hme-side text { font-family: var(--wa-font, inherit); }
  .hme-side-hint { color: #8e8e93; font-size: 11.5px; }

  /* ── Style ────────────────────────────────────────────────────────── */
  .hme-looks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; flex: none; }
  .hme-look {
    display: flex; flex-direction: column; gap: 6px; border: 0; background: none; padding: 6px; border-radius: 12px; cursor: pointer;
    color: var(--wa-muted); font: inherit; font-size: 12px; font-weight: 500; text-align: left; min-width: 0;
  }
  .hme-look > svg { width: 100%; height: auto; aspect-ratio: 112 / 68; border-radius: 9px; border: 1px solid var(--wa-line); display: block; }
  .hme-look:hover { background: var(--wa-card); }
  .hme-look.on { background: var(--wa-raise); color: var(--wa-ink); }
  .hme-look.on > svg { outline: 2px solid var(--hme-sel); outline-offset: 2px; }
  .hme-look:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }
  .hme-style-col { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 12px; min-height: 0; }
  .hme-stage.hme-style-big { position: relative; inset: auto; flex: 1 1 auto; min-height: 320px; }
  .hme-stage.hme-style-big.turns { cursor: ew-resize; touch-action: none; }
  .hme-style-title { position: absolute; top: 14px; left: 16px; z-index: 1; display: flex; flex-direction: column; gap: 2px; pointer-events: none; }
  .hme-style-title strong { font-size: 20px; }
  .hme-style-title span { font-size: 12px; opacity: 0.7; }
  .hme-style-turn { position: absolute; right: 16px; bottom: 12px; z-index: 1; font-size: 12px; opacity: 0.7; pointer-events: none; }
  .hme-style-tiles { flex-direction: row; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: 24px; }
  .hme-fr { margin: 0; display: flex; flex-direction: column; gap: 6px; align-items: center; color: var(--wa-muted); font-size: 12px; }
  .hme-face { position: relative; overflow: hidden; border: 1px solid #3a3a3c; flex: none; }
  .hme-face > svg { position: absolute; display: block; }
  .hme-face-title, .hme-face-words { position: absolute; right: 8px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hme-use { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 10px; background: var(--wa-input); border: 1px solid var(--wa-line); }
  .hme-use > i { width: 40px; height: 40px; border-radius: 9px; flex: 0 0 40px; border: 1px solid #3a3a3c; }
  .hme-use > div { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.3; }
  .hme-use > div > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hme-use small { color: var(--wa-faint); font-size: 11.5px; }
  @container (max-width: 760px) {
    .hme-stage-wrap:has(.hme-style-col) { height: auto; }
    .hme-style-col { position: static; }
    .hme-stage.hme-style-big { min-height: 360px; }
  }

  /* ── dialogs and calm states ──────────────────────────────────────── */
  .hme-scrim { position: fixed; inset: 0; z-index: 100; background: rgba(0, 0, 0, 0.45); display: flex; align-items: center; justify-content: center; padding: 16px; }
  .hme-dialog {
    width: min(420px, 100%); padding: 20px; border-radius: 16px; background: var(--wa-card); border: 1px solid var(--wa-line-strong);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45); display: flex; flex-direction: column; gap: 10px;
  }
  .hme-dialog h3 { font-size: 16px; }
  .hme-dialog p { color: var(--wa-soft); font-size: 13.5px; line-height: 1.45; }
  .hme-dialog-field { display: flex; flex-direction: column; gap: 6px; color: var(--wa-muted); font-size: 12px; }
  .hme-dialog-field input {
    height: 36px; border-radius: 8px; border: 1px solid var(--wa-line-strong); background: var(--wa-input); color: var(--wa-ink); font: inherit; font-size: 14px; padding: 0 10px; outline: none;
  }
  .hme-dialog-field input:focus { border-color: var(--hme-sel); }
  .hme-dialog-row { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
  .hme-calm { flex: 1 1 auto; min-height: 280px; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .hme-empty {
    display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; max-width: 520px;
    padding: 28px 24px; border: 1px solid var(--wa-line); border-radius: 16px; background: var(--wa-card);
  }
  .hme-empty > b { font-size: 15px; }
`;function so(l,t,e,o={}){let n=(o.reach??10)/e,a,i=n;for(let d of[...l.rooms.flatMap(h=>h.outline),...o.corners??[]]){let h=Math.hypot(d[0]-t[0],d[1]-t[1]);h<=i&&(a=d,i=h)}if(a!==void 0)return[a[0],a[1]];let[r,s]=t;if(o.grid!==void 0&&o.grid>0&&(r=Math.round(r/o.grid)*o.grid,s=Math.round(s/o.grid)*o.grid),o.from!==void 0){let d=8/e;Math.abs(t[0]-o.from[0])<=d&&(r=o.from[0]),Math.abs(t[1]-o.from[1])<=d&&(s=o.from[1])}return[Math.round(r*100)/100,Math.round(s*100)/100]}var wt=.1,ce=.05,Pe=class{constructor(t){this.grid=t;this.active=!1;this.points=[]}start(t){this.active=!0,this.points=[],this.hoverAt=void 0,t.select(void 0),t.redraw()}stop(t){this.active=!1,this.points=[],this.hoverAt=void 0,t?.redraw()}snap(t,e){return so(t.floor,e,t.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...t.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(t,e){let o=this.points[0];return o!==void 0&&this.points.length>=3&&Math.hypot(e[0]-o[0],e[1]-o[1])*t.view.scale<=10}pointerDown(t,e,o){if(!this.active||e.button!==0)return!1;let n=this.snap(t,o);if(this.closes(t,n))return this.finish(t),!0;let a=this.points[this.points.length-1];return(a===void 0||Math.hypot(n[0]-a[0],n[1]-a[1])>=.05)&&this.points.push(n),t.redraw(),!0}hover(t,e){this.active&&(this.hoverAt=e===void 0?void 0:this.snap(t,e),t.redraw())}keyDown(t,e){return this.active?e.key==="Escape"?(this.stop(t),!0):e.key==="Enter"?(this.points.length>=3&&this.finish(t),!0):e.key==="Backspace"||e.key==="Delete"?(this.points.pop(),t.redraw(),!0):!1:!1}async finish(t){let e=this.points.slice();if(this.stop(t),e.length<3)return;let o=await t.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(o===void 0)return;let n=t.newId(),a=t.floor.id;t.apply(i=>tn(i,a,n,e,o),{select:{kind:"room",roomId:n}})||t.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(t){if(!this.active)return g;let e=this.points.map(s=>t.toScreen(s)),o=this.hoverAt===void 0?void 0:t.toScreen(this.hoverAt),n=this.hoverAt!==void 0&&this.closes(t,this.hoverAt),a=[...e,...o!==void 0?[o]:[]].map(([s,d])=>`${s.toFixed(1)},${d.toFixed(1)}`).join(" "),i=this.points[this.points.length-1],r=i!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-i[0],this.hoverAt[1]-i[1]):0;return b`<g class="hme-draw">
      ${e.length>=3?b`<polygon points=${e.map(([s,d])=>`${s},${d}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:g}
      <polyline points=${a} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${e.map(([s,d],h)=>b`<circle cx=${s} cy=${d} r=${h===0&&n?8:5} fill=${h===0&&n?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${o!==void 0&&!n?b`<circle cx=${o[0]} cy=${o[1]} r="4" fill="#5b8def" />`:g}
      ${o!==void 0&&r>.05?b`<g class="hme-tag"><rect x=${o[0]+10} y=${o[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${o[0]+39} y=${o[1]-13} fill="#fff" text-anchor="middle">${r.toFixed(2)} m</text></g>`:g}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};var Be={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},Wn=15,gi=[{a:0,c:0},{c:0},{a:1,c:0},{a:1},{a:1,c:1},{c:1},{a:0,c:1},{a:0}];function vi(l,t){let e=(Math.atan2(t,l)*180/Math.PI+180)%180;return["ew-resize","nwse-resize","ns-resize","nesw-resize"][Math.round(e/45)%4]}function bi(l,t){let e=t===0?"":` Its ${C(t,"device")} come${t===1?"s":""} off the map too.`;return`${D(l)} comes off the map.${e} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}var A=l=>l.toFixed(1),ee=l=>`${l[0].toFixed(1)},${l[1].toFixed(1)}`,Mt=class{constructor(){this.id="arrange";this.draw=new Pe(wt);this.query="";this.open=new Set;this.guides=[];this.dragging=!1;this.resizing=!1}focus(t){let e=He(t.selection);return e===void 0?void 0:t.floor.rooms.find(o=>x(o.id,e))}rail(t){let e=t.floor,o=this.query.trim().toLowerCase(),n=e.rooms.filter(s=>o===""||D(s).toLowerCase().includes(o)),a=o===""?[]:e.pins.filter(s=>z(s,t.hass).toLowerCase().includes(o)||s.entityId.includes(o)),i=t.doc.floors.filter(s=>!x(s.id,e.id)),r=this.focus(t);return c`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a room or device" aria-label="Find a room or device" .value=${F(this.query)}
          @input=${s=>{this.query=s.target.value,t.redraw()}} /></label>
      <section class="hme-card hme-layers">
        <div class="hme-h">${L(e)}<span class="hme-h-end">${C(e.rooms.length,"room")}</span></div>
        ${n.map(s=>this.layer(t,s,r!==void 0&&x(r.id,s.id)))}
        ${n.length===0?c`<p class="hme-empty-line">${o===""?"No rooms on this floor yet.":"No room by that name."}</p>`:g}
        ${a.length>0?c`<div class="hme-sep"></div>${a.map(s=>c`<button type="button" class="hme-lay"
            @click=${()=>t.setMode("devices",{kind:"pin",pinId:s.id})}><span class="hme-dot dev"></span>${z(s,t.hass)}<span class="n">Device</span></button>`)}`:g}
        ${i.length>0?c`<div class="hme-sep"></div>${i.map(s=>c`<button type="button" class="hme-lay dim"
            @click=${()=>t.setFloor(s.id)}>▸ ${L(s)}<span class="n">${C(s.rooms.length,"room")}</span></button>`)}`:g}
      </section>
      <button type="button" class="hme-tb hme-wide ${this.draw.active?"on":""}" @click=${()=>this.draw.active?this.draw.stop(t):this.draw.start(t)}>
        ${this.draw.active?"Stop drawing":"\uFF0B Draw a room by hand"}</button>
      <p class="hme-foot">Scanned rooms come from the iPhone. Rooms you draw here (a garden, a garage) need no scan.</p>`}layer(t,e,o){let n=c`<button type="button" class="hme-lay ${o?"on":""}" aria-pressed=${o?"true":"false"}
      @click=${()=>t.select({kind:"room",roomId:e.id})}>
      <span class="hme-dot" style=${`background:${io[it(e)]}`}></span>${D(e)}<span class="n">${We(e)}</span></button>`;if(!o)return n;let a=e.openings.map((h,p)=>({o:h,i:p})).filter(({o:h})=>h.kind!=="window"),i=e.openings.map((h,p)=>({o:h,i:p})).filter(({o:h})=>h.kind==="window"),r=ye(t.floor,e.id),s=h=>{this.open.has(h)?this.open.delete(h):this.open.add(h),t.redraw()},d=h=>t.setMode("shape",h===void 0?{kind:"room",roomId:e.id}:{kind:"opening",roomId:e.id,opening:h});return c`${n}
      <button type="button" class="hme-lay sub" @click=${()=>d(a[0]?.i)}>Doors and ways in<span class="n">${a.length}</span></button>
      <button type="button" class="hme-lay sub" @click=${()=>d(i[0]?.i)}>Windows<span class="n">${i.length}</span></button>
      <button type="button" class="hme-lay sub" aria-expanded=${this.open.has("things")?"true":"false"} @click=${()=>s("things")}>Things<span class="n">${e.objects.length}</span></button>
      ${this.open.has("things")?e.objects.map((h,p)=>c`<div class="hme-lay subsub">${he(h.kind)}
        ${je({on:h.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${he(h.kind)} shown`,click:()=>t.apply(m=>Wt(m,e.id,p,h.hidden!==!0))})}</div>`):g}
      <button type="button" class="hme-lay sub" aria-expanded=${this.open.has("devices")?"true":"false"} @click=${()=>s("devices")}>Devices<span class="n">${r.length}</span></button>
      ${this.open.has("devices")?r.map(h=>c`<button type="button" class="hme-lay subsub" @click=${()=>t.setMode("devices",{kind:"pin",pinId:h.id})}>${z(h,t.hass)}<span class="n">›</span></button>`):g}`}overlay(t){if(this.draw.active)return this.draw.overlay(t);let e=this.focus(t),o=[];for(let n of this.guides)o.push(this.guide(t,n));return e!==void 0&&e.outline.length>=3&&o.push(this.box(t,e)),o.length===0?g:b`${o}`}box(t,e){let o=Dn(e).map(f=>t.toScreen(f)),n=o.reduce((f,v)=>[f[0]+v[0]/4,f[1]+v[1]/4],[0,0]),a=f=>[(o[f][0]+o[(f+1)%4][0])/2,(o[f][1]+o[(f+1)%4][1])/2],i=f=>{let v=Math.max(Math.hypot(f[0]-n[0],f[1]-n[1]),1e-6);return[(f[0]-n[0])/v,(f[1]-n[1])/v]},r=[0,1,2,3].flatMap(f=>[o[f],a(f)]),s=[0,1,2,3].reduce((f,v)=>a(v)[1]<a(f)[1]?v:f,0),d=a(s),h=i(d),p=[d[0]+h[0]*28,d[1]+h[1]*28],m=vt(e),u=[];for(let f of[[0,2],[1,3]]){let[v,w]=f,M=Math.abs(o[(v+1)%4][0]-o[v][0])>=Math.abs(o[(v+1)%4][1]-o[v][1])?i(a(v))[1]<=i(a(w))[1]?v:w:i(a(v))[0]<=i(a(w))[0]?v:w,S=o[M],P=o[(M+1)%4],N=i(a(M)),j=[S[0]+N[0]*20,S[1]+N[1]*20],R=[P[0]+N[0]*20,P[1]+N[1]*20],V=[(j[0]+R[0])/2,(j[1]+R[1])/2],ge=M%2===0?m.width:m.depth,X=[N[0]*5,N[1]*5];u.push(b`<path d=${`M${ee(j)}L${ee(R)}M${ee([j[0]-X[0],j[1]-X[1]])}L${ee([j[0]+X[0],j[1]+X[1]])}M${ee([R[0]-X[0],R[1]-X[1]])}L${ee([R[0]+X[0],R[1]+X[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${A(V[0]-26)} y=${A(V[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${A(V[0])} y=${A(V[1]+4)} fill="#fff" text-anchor="middle">${ge.toFixed(2)} m</text></g>`)}return b`<g class="hme-box">
      <polygon points=${o.map(ee).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" />
      ${this.resizing?u:g}
      ${this.dragging?g:b`
        ${u}
        <line x1=${A(d[0])} y1=${A(d[1])} x2=${A(p[0])} y2=${A(p[1])} stroke="#5b8def" stroke-width="1.6" />
        ${r.map((f,v)=>b`<rect data-hme="resize" data-handle=${v} x=${A(f[0]-5)} y=${A(f[1]-5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${vi(f[0]-n[0],f[1]-n[1])}`}>
          <title>Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping.</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${ee(p)})`}>
          <title>Drag to turn the room. Hold Alt to turn it freely.</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(t,e){let o=t.toScreen(e.a),n=t.toScreen(e.b),a=Math.max(Math.hypot(n[0]-o[0],n[1]-o[1]),1e-6),i=[(n[0]-o[0])/a,(n[1]-o[1])/a],r=[o[0]-i[0]*40,o[1]-i[1]*40],s=[n[0]+i[0]*40,n[1]+i[1]*40],d=t.floor.rooms.find(m=>x(m.id,e.roomId)),h=`Lined up with ${d===void 0?"a":D(d)} wall`,p=h.length*6.2+20;return b`<g class="hme-guide" pointer-events="none">
      <line x1=${A(r[0])} y1=${A(r[1])} x2=${A(s[0])} y2=${A(s[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${A(s[0]+6)} y=${A(s[1]-10)} width=${A(p)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${A(s[0]+6+p/2)} y=${A(s[1]+4)} fill="#fff" text-anchor="middle">${h}</text></g>
    </g>`}pointerDown(t,e,o){if(this.draw.active)return this.draw.pointerDown(t,e,o);if(e.button!==0)return!1;let n=e.target?.closest?.("[data-hme]"),a=n?.getAttribute("data-hme"),i=this.focus(t);if(a==="turn"&&i!==void 0)return this.turnDrag(t,e,i,o),!0;let r=gi[Number(n?.getAttribute("data-handle"))];if(a==="resize"&&i!==void 0&&r!==void 0)return this.resizeDrag(t,e,i,r,o),!0;let s=U(t.floor,o);return s===void 0?!1:(t.select({kind:"room",roomId:s.id}),this.moveDrag(t,e,s,o),!0)}moveDrag(t,e,o,n){let a=t.doc,i=o.id,r=ie(o.outline),s=[0,0];t.drag(e,{move:(d,h)=>{let p=d[0]-n[0],m=d[1]-n[1];if(t.toggles.grid&&r!==void 0){let u=wt;p=Math.round((r.minX+p)/u)*u-r.minX,m=Math.round((r.minY+m)/u)*u-r.minY}if(this.guides=[],t.toggles.snap&&!h.altKey){let u=Ko(a,i,p,m);u!==void 0&&(p=u.dx,m=u.dy,this.guides=u.guides)}this.dragging=!0,s=[p,m],t.preview(u=>we(u,i,p,m))},end:(d,h,p)=>{this.guides=[],this.dragging=!1,t.preview(void 0);let[m,u]=s;p&&(Math.abs(m)>=.005||Math.abs(u)>=.005)&&t.apply(f=>we(f,i,m,u),{select:{kind:"room",roomId:i}})}})}resizeDrag(t,e,o,n,a){let i=Go(o);if(i===void 0)return;let r=t.doc,s=o.id,d=i.a1-i.a0,h=i.c1-i.c0;if(d<=1e-6||h<=1e-6)return;let p=v=>v[0]*i.u[0]+v[1]*i.u[1],m=v=>v[0]*i.v[0]+v[1]*i.v[1],u=v=>Math.min(Math.max(v,Ce),Re),f;t.drag(e,{move:(v,w)=>{let k=w.altKey?2:1,M=d,S=h;if(n.a!==void 0&&(M=d+(p(v)-p(a))*(n.a===1?1:-1)*k),n.c!==void 0&&(S=h+(m(v)-m(a))*(n.c===1?1:-1)*k),t.toggles.grid){let R=wt;n.a!==void 0&&(M=Math.round(M/R)*R),n.c!==void 0&&(S=Math.round(S/R)*R)}if(M=u(M),S=u(S),w.shiftKey){let R=M/d,V=S/h,ge=n.a===void 0?V:n.c===void 0||Math.abs(Math.log(R))>=Math.abs(Math.log(V))?R:V;ge=Math.min(Math.max(ge,Ce/Math.min(d,h)),Re/Math.max(d,h)),M=d*ge,S=h*ge}let P=[w.altKey||n.a===void 0?.5:1-n.a,w.altKey||n.c===void 0?.5:1-n.c],N={width:M,depth:S,anchor:P};if(this.guides=[],t.toggles.snap&&!w.altKey&&!w.ctrlKey&&!w.metaKey){let R=jo(r,s,N,n,{proportional:w.shiftKey});R!==void 0&&(N=R.resize,this.guides=R.guides)}this.dragging=!0,this.resizing=!0,f=N;let j=N;t.preview(R=>De(R,s,j))},end:(v,w,k)=>{this.guides=[],this.dragging=!1,this.resizing=!1,t.preview(void 0);let M=f;!k||M===void 0||Math.abs((M.width??d)-d)<.005&&Math.abs((M.depth??h)-h)<.005||t.apply(S=>De(S,s,M),{select:{kind:"room",roomId:s}})}})}turnDrag(t,e,o,n){let a=o.id,i=te(o),r=Math.atan2(n[1]-i[1],n[0]-i[0]),s=0;t.drag(e,{move:(d,h)=>{let p=(Math.atan2(d[1]-i[1],d[0]-i[0])-r)*180/Math.PI;p=(p+540)%360-180,h.altKey||(p=Math.round(p/Wn)*Wn),this.dragging=!0,s=p,t.preview(m=>re(m,a,p,i))},end:(d,h,p)=>{this.dragging=!1,t.preview(void 0),p&&Math.abs(s)>.01&&t.apply(m=>re(m,a,s,i),{select:{kind:"room",roomId:a}})}})}hover(t,e){this.draw.hover(t,e)}keyDown(t,e){if(this.draw.active)return this.draw.keyDown(t,e);let o=this.focus(t);if(o===void 0)return!1;let n=Q(e,!1);if(n==="delete")return this.askDelete(t,o),!0;if(typeof n=="object"&&"nudge"in n){let[a,i]=n.nudge;return t.apply(r=>we(r,o.id,a,i)),!0}return!1}cursor(){return this.draw.active?"crosshair":void 0}leave(t){this.draw.stop(t),this.guides=[],this.dragging=!1}dock(t){return c`<button type="button" class="hme-tb ${t.toggles.snap?"on":""}" aria-pressed=${t.toggles.snap?"true":"false"}
        title="A dragged room lines up with the walls round it. Hold Alt to move it freely." @click=${()=>t.setToggle("snap",!t.toggles.snap)}>Snap to walls</button>
      <button type="button" class="hme-tb ${t.toggles.grid?"on":""}" aria-pressed=${t.toggles.grid?"true":"false"}
        @click=${()=>t.setToggle("grid",!t.toggles.grid)}>Grid 10 cm</button>`}pill(t){if(this.draw.active)return c`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?c`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(t)}}>Close the room</button>`:g}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(t)}>Cancel</button>`;let e=this.focus(t);if(e===void 0||this.dragging)return g;let o=e.id;return c`<span class="hme-pill-name">${D(e)}</span>
      <button type="button" class="hme-tb" @click=${()=>t.apply(n=>re(n,o,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" @click=${()=>t.apply(n=>Z(n,o))}>Square the corners</button>
      <button type="button" class="hme-tb" title="Turn it to the floor's walls and slide it onto the nearest wall line, as the iPhone does"
        @click=${()=>t.apply(n=>Wo(n,o))}>Snap to walls</button>
      ${this.floorMenu(t,e,"Move to floor","hme-tb")}
      <button type="button" class="hme-tb danger" @click=${()=>{this.askDelete(t,e)}}>Delete</button>`}floorMenu(t,e,o,n){let a=t.doc.floors.filter(i=>!x(i.id,t.floor.id));return no({label:o,cls:n,options:[...a.map(i=>({value:i.id,label:L(i)})),{value:"new",label:"New floor\u2026"}],pick:i=>{this.moveToFloor(t,e,i)}})}async moveToFloor(t,e,o){let n=e.id,a={kind:"room",roomId:n};if(o!=="new"){t.apply(d=>Kt(d,n,{floorId:o}),{select:a,floorId:o});return}let i=Math.max(...t.doc.floors.map(d=>d.story))+1,r=await t.ask({title:"A new floor",label:"Name",value:i===1?"Upstairs":`Floor ${i+1}`,ok:"Move the room there"});if(r===void 0)return;let s=t.newId();t.apply(d=>Kt(d,n,{newFloor:{id:s,name:r,story:i}}),{select:a,floorId:s})}async askDelete(t,e){let o=ye(t.floor,e.id).length;await t.confirm({title:`Delete ${D(e)}?`,text:bi(e,o),ok:"Delete room",danger:!0})&&t.apply(a=>Vo(a,e.id),{select:null})}inspector(t){let e=this.focus(t);if(e===void 0)return this.floorCard(t,t.floor);let o=e.id,n=vt(e),a=Ho(t.floor,t.toggles.live?t.hass?.states:void 0).has(e.id),i=ye(t.floor,o),r=ie(e.outline)??{minX:0,minY:0,maxX:0,maxY:0},s=Math.round(-zo(e)*10)/10,d=e.areaId===void 0||t.areas.some(m=>m.id===e.areaId),h=e.pageId===void 0||t.pages.some(m=>x(m.id,e.pageId)),p=at(e);return c`
      <section class="hme-card hme-head">
        ${_n(e,a)}
        <div class="hme-head-t">
          <strong>${D(e)}</strong>
          <span>${L(t.floor)} · ${We(e)} · ${n.area.toFixed(1)} m²</span>
        </div>
      </section>

      ${H("Room",c`
        ${E("Name",Ge({value:e.name??"",label:"Name",placeholder:"Room",set:m=>t.apply(u=>Xo(u,o,m))}))}
        ${E("Area",me({label:"Area",value:e.areaId??"",options:[{value:"",label:"None"},...d?[]:[{value:e.areaId,label:`Not in Home Assistant (${e.areaId})`,disabled:!0}],...t.areas.map(m=>({value:m.id,label:m.name}))],set:m=>t.apply(u=>qo(u,o,m===""?void 0:m))}))}
        ${K("The Home Assistant area. Its devices show first in Devices.")}
        ${E("Tap opens",me({label:"Tap opens",value:e.pageId??"",options:[{value:"",label:"Nothing"},...h?[]:[{value:e.pageId,label:"A page not in your library",disabled:!0}],...t.pages.map(m=>({value:m.id,label:`Page: ${m.name}`}))],set:m=>t.apply(u=>Yo(u,o,m===""?void 0:m))}))}
        ${K("What a tap on this room does on the map tiles and the watch.")}`)}

      ${H("Place",c`
        ${E("Left, top",_({label:"Left",value:r.minX,unit:"m",set:m=>t.apply(u=>we(u,o,m-r.minX,0))}),_({label:"Top",value:r.minY,unit:"m",set:m=>t.apply(u=>we(u,o,0,m-r.minY))}))}
        ${E("Turn",_({label:"Turn",value:s,unit:"\xB0",digits:1,min:-180,max:180,width:"92px",set:m=>t.apply(u=>re(u,o,m-s))}),c`<button type="button" class="hme-tb" @click=${()=>t.apply(m=>re(m,o,-90))}>−90°</button>
            <button type="button" class="hme-tb" @click=${()=>t.apply(m=>re(m,o,90))}>+90°</button>
            <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>t.apply(m=>No(m,o))}>Level</button>`)}
        ${E("Width, depth",_({label:"Width",value:n.width,unit:"m",min:Ce,max:Re,set:m=>t.apply(u=>De(u,o,{width:m}))}),_({label:"Depth",value:n.depth,unit:"m",min:Ce,max:Re,set:m=>t.apply(u=>De(u,o,{depth:m}))}))}
        ${K("Along its own walls, about its middle; its doors, things and devices move with it. Drag a room on the plan to move it (Alt moves it freely), or a square handle on its box to resize it (Shift keeps its proportions, Alt resizes it about its middle).")}
        ${E("Floor",me({label:"Floor",value:t.floor.id,options:[...t.doc.floors.map(m=>({value:m.id,label:L(m)})),{value:"new",label:"New floor\u2026"}],set:m=>{this.moveToFloor(t,e,m)}}))}
        ${E("Wall height",_({label:"Wall height",value:e.height,unit:"m",min:.5,max:20,set:m=>t.apply(u=>Oe(u,o,m))}))}`)}

      ${H("Floor finish",c`<div class="hme-pics">
        ${G({label:`Auto: ${Be[p]}`,picture:ao(p),on:e.finish===void 0,title:"Picked from the room's name and furniture",click:()=>t.apply(m=>Me(m,o,void 0))})}
        ${qe.map(m=>G({label:Be[m],picture:ao(m),on:e.finish===m,click:()=>t.apply(u=>Me(u,o,m))}))}
      </div>`)}

      ${H("In this room",c`
        ${e.objects.length===0?c`<p class="hme-empty-line">No things. Add a sofa, a bed or stairs so the map reads.</p>`:g}
        ${e.objects.map((m,u)=>c`<div class="hme-r tight"><span class="hme-grow ${m.hidden===!0?"dim":""}">${he(m.kind)}</span>
          ${je({on:m.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${he(m.kind)} shown`,click:()=>t.apply(f=>Wt(f,o,u,m.hidden!==!0))})}
          <button type="button" class="hme-x" aria-label=${`Remove ${he(m.kind)}`} title="Remove" @click=${()=>t.apply(f=>en(f,o,u))}>×</button></div>`)}
        ${e.openings.length>0?c`<div class="hme-r tight"><span class="hme-grow">${[...new Set(e.openings.map(pe))].join(", ")}</span>
          <button type="button" class="hme-link" @click=${()=>t.setMode("shape",{kind:"room",roomId:o})}>Shape ›</button></div>`:g}
        <div class="hme-r tight"><span class="hme-grow">${i.length===0?"No devices":i.slice(0,3).map(m=>z(m,t.hass)).join(", ")+(i.length>3?"\u2026":"")}</span>
          <button type="button" class="hme-link" @click=${()=>t.setMode("devices",{kind:"room",roomId:o})}>${C(i.length,"device")} ›</button></div>
        <div class="hme-row-end">
          ${no({label:"\uFF0B Add a thing",cls:"hme-tb",options:Zo.map(m=>({value:m,label:he(m)})),pick:m=>{let u=B(e)??te(e);t.apply(f=>Jo(f,o,m,u))}})}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(t,e)}}>Delete room</button>
        </div>`)}`}floorCard(t,e){let o=Je(e,t.toggles.live?t.hass?.states:void 0);return c`${H("Floor",c`
        ${E("Name",Ge({value:e.name,label:"Floor name",placeholder:L(e),set:n=>t.apply(a=>rt(a,e.id,n))}))}
        ${E("On it",c`<span class="hme-val">${C(e.rooms.length,"room")} · ${C(e.pins.length,"device")} · ${Qe(o)}</span>`)}`)}
      ${H("Arrange",c`<p class="hme-text">Pick a room on the plan or in the list to move it, turn it, resize it, or change its name, area and floor.</p>
        <p class="hme-text dim">Drag a room to move it; it lines up with the walls of the rooms round it. Drag the round handle above it to turn it, or a square handle on its box to resize it. Undo with ${In()}.</p>`)}`}};var $t="application/x-wa-home-map-entity",yi=new Set(["light","switch","fan","climate","humidifier","water_heater","sensor","binary_sensor","media_player","lock","cover","valve","camera","vacuum","alarm_control_panel","siren","input_boolean","remote"]);function wi(l,t){let e=l?.entities?.[t];if(e===void 0)return;if(typeof e.area_id=="string"&&e.area_id!=="")return e.area_id;let o=e.device_id?l?.devices?.[e.device_id]:void 0;return typeof o?.area_id=="string"&&o.area_id!==""?o.area_id:void 0}function Gn(l){let t=[];for(let[e,o]of Object.entries(l?.states??{})){let n=l?.entities?.[e];if(n?.hidden===!0)continue;let a=o?.attributes?.friendly_name,i=wi(l,e),r=i===void 0?void 0:l?.areas?.[i]?.name?.trim()||i,s=o?.attributes?.device_class;t.push({entityId:e,name:typeof a=="string"&&a.trim()!==""?a.trim():e,domain:e.slice(0,e.indexOf(".")),areaId:i,areaName:r,deviceClass:typeof s=="string"?s:void 0,category:typeof n?.entity_category=="string"?n.entity_category:void 0})}return t.sort((e,o)=>e.name.localeCompare(o.name)||e.entityId.localeCompare(o.entityId))}function Mi(l){return new Set(l.floors.flatMap(t=>t.pins.map(e=>e.entityId)))}function jn(l,t,e){let o=Mi(l),n=new Map;for(let i of e){if(o.has(i.entityId)||i.areaId===void 0||i.category!==void 0||!yi.has(i.domain))continue;let r=n.get(i.areaId);r===void 0&&n.set(i.areaId,r={areaId:i.areaId,name:i.areaName??i.areaId,here:!1,devices:[]}),r.devices.push(i)}let a=t.rooms.map(i=>i.areaId).filter(i=>i!==void 0);for(let i of n.values())i.here=a.includes(i.areaId);return[...n.values()].sort((i,r)=>{let s=a.indexOf(i.areaId),d=a.indexOf(r.areaId);return s>=0||d>=0?(s<0?1/0:s)-(d<0?1/0:d):i.name.localeCompare(r.name)})}function Bn(l,t){let e=new Set(l.rooms.map(o=>o.areaId).filter(o=>o!==void 0));return t.filter(o=>e.has(o.areaId)).reduce((o,n)=>o+n.devices.length,0)}function Un(l,t,e=40){let o=t.toLowerCase().split(/\s+/).filter(r=>r!=="");if(o.length===0)return[];let n=r=>`${r.name} ${r.entityId} ${r.areaName??""}`.toLowerCase(),a=l.filter(r=>o.every(s=>n(r).includes(s))),i=t.trim().toLowerCase();return a.sort((r,s)=>+!r.name.toLowerCase().startsWith(i)-+!s.name.toLowerCase().startsWith(i)).slice(0,e)}var $i=[["lights","Lights"],["climate","Climate"],["sensors","Sensors"],["power","Power"],["media","Media"],["security","Security"],["covers","Covers"],["other","Other"]];function kt(l){switch(l.slice(0,l.indexOf("."))){case"light":return"lights";case"climate":case"fan":case"humidifier":case"water_heater":return"climate";case"sensor":case"binary_sensor":return"sensors";case"switch":case"input_boolean":return"power";case"media_player":case"remote":return"media";case"lock":case"camera":case"alarm_control_panel":case"siren":return"security";case"cover":case"valve":return"covers";default:return"other"}}function Vn(l){let t=new Map;for(let e of l.pins){let o=kt(e.entityId);t.set(o,(t.get(o)??0)+1)}return $i.filter(([e])=>t.has(e)).map(([e,o])=>({kind:e,label:o,count:t.get(e)}))}function Xn(l){return l.replace(/_/g," ")}function Ee(l,t){let e=t?.[l];if(e===void 0)return"gone";let o=String(e.state??""),n=l.slice(0,l.indexOf(".")),a=e.attributes??{};if(n==="light"&&o==="on"&&typeof a.brightness=="number")return`on \xB7 ${Math.round(a.brightness/255*100)}%`;if(n==="climate"&&typeof a.current_temperature=="number")return`${o} \xB7 ${a.current_temperature}\xB0`;let i=typeof a.unit_of_measurement=="string"?a.unit_of_measurement:"";return i!==""&&o!==""&&Number.isFinite(Number(o))?`${o} ${i}`.replace(" \xB0","\xB0").replace(" %","%"):o.replace(/_/g," ")}function lo(l){return["light","switch","fan","input_boolean","media_player","cover","humidifier","siren"].includes(l.slice(0,l.indexOf(".")))}function po(l,t){let e=String(t?.[l]?.state??"");return l.startsWith("cover.")?e==="open"||e==="opening"?"Close":"Open":e==="on"||e==="playing"||e==="paused"||e==="idle"?"Turn off":"Turn on"}var ho=[["Floor",.3],["Table",.8],["Wall",1.6],["Ceiling",2.5]],mo=[[void 0,"As the tile does"],["toggle","Turn on or off"],["details","Show details"],["page","Open a page"],["none","Nothing"]];function co(l,t){for(let e of l.floors){let o=e.pins.find(n=>n.entityId===t);if(o!==void 0)return{floorId:e.id,pinId:o.id}}}function qn(l,t){return t===void 0?void 0:l.rooms.find(e=>e.areaId!==void 0&&e.areaId===t)}function ue(l){return l?.kind==="pin"?[l.pinId]:l?.kind==="pins"?l.pinIds.slice():[]}function Ue(l){let t=[];for(let e of l)t.some(o=>x(o,e))||t.push(e);if(t.length!==0)return t.length===1?{kind:"pin",pinId:t[0]}:{kind:"pins",pinIds:t}}function xt(l,t){let e=ue(l);return e.some(o=>x(o,t))?Ue(e.filter(o=>!x(o,t))):Ue([...e,t])}function Yn(l,t){return Ue([...ue(l),...t])}function Zn(l,t,e){let[o,n]=[Math.min(t[0],e[0]),Math.max(t[0],e[0])],[a,i]=[Math.min(t[1],e[1]),Math.max(t[1],e[1])];return l.filter(r=>r.at[0]>=o&&r.at[0]<=n&&r.at[1]>=a&&r.at[1]<=i).map(r=>r.id)}function fe(l){if(l.length===0)return{mixed:!0};let t=JSON.stringify(l[0])??"undefined";return l.every(e=>(JSON.stringify(e)??"undefined")===t)?{mixed:!1,value:l[0]}:{mixed:!0}}function Jn(l,t){if(l.length===0||!l.every(lo))return;let e=l.every(n=>n.startsWith("cover.")),o=l.some(n=>{let a=po(n,t);return a==="Turn off"||a==="Close"});return e?o?{words:"Close",service:"turn_off"}:{words:"Open",service:"turn_on"}:o?{words:"Turn off",service:"turn_off"}:{words:"Turn on",service:"turn_on"}}var ki=15,Ht=Math.PI/4,uo=8,Pt="#ffbf55",$=l=>l.toFixed(1);function xi(l,t){return`${Xn(l.domain)} \xB7 ${Ee(l.entityId,t)}`}function Hi(l,t){let e=oe(l,t);if(e===void 0)return"Not in a room";let o=U(l,t.at);return o!==void 0&&x(o.id,e.id)?`${D(e)} (found by place)`:D(e)}function Pi(l,t,e){return l.icon!==void 0?ut[l.icon]:`Auto (${ut[Fe(l.entityId,t,e)].toLowerCase()})`}var Et=class{constructor(){this.id="devices";this.drawsPins=!0;this.query="";this.side=!0;this.names=!1;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1}states(t){return t.toggles.live?t.hass?.states:void 0}picked(t){let e=t.selection;return e?.kind==="pin"?t.floor.pins.find(o=>x(o.id,e.pinId)):void 0}picks(t){return ue(t.selection).flatMap(e=>t.floor.pins.filter(o=>x(o.id,e)))}deviceClass(t,e){let o=t.hass?.states?.[e]?.attributes?.device_class;return typeof o=="string"?o:void 0}friendly(t,e){let o=t.hass?.states?.[e]?.attributes?.friendly_name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0}place(t,e,o,n){let a=co(t.doc,e);if(a!==void 0)return x(a.floorId,t.floor.id)||t.setFloor(a.floorId),t.select({kind:"pin",pinId:a.pinId}),!1;let i=qn(t.floor,n),r=o??(i===void 0?gt(t.view,[t.stage.width/2,t.stage.height/2]):B(i)??te(i)),s=t.newId().toUpperCase(),d=t.floor.id,h=this.friendly(t,e),p=t.apply(m=>dn(m,d,{id:s,entityId:e,at:[r[0],r[1]],...h===void 0?{}:{name:h}}),{select:{kind:"pin",pinId:s}});return p||t.note("warn","That device could not be put on the map: the map holds at most 400 devices."),p}placeAll(t,e){let o=e.map(a=>({entityId:a.entityId,areaId:a.areaId,name:a.name,deviceClass:a.deviceClass})),n=t.floor.id;t.apply(a=>cn(a,n,o,()=>t.newId())?.doc,{select:null})}rail(t){let e=t.hass?.states,o=Gn(t.hass),n=jn(t.doc,t.floor,o),a=n.reduce((p,m)=>p+m.devices.length,0),i=Bn(t.floor,n),r=Un(o,this.query),s=Vn(t.floor),d=t.floor.pins.filter(p=>this.filter===void 0||kt(p.entityId)===this.filter),h=ue(t.selection);return c`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find any device" aria-label="Find any device" .value=${F(this.query)}
          @input=${p=>{this.query=p.target.value,t.redraw()}} /></label>
      ${this.query.trim()===""?g:H("Found",c`
        ${r.length===0?c`<p class="hme-empty-line">No device by that name.</p>`:g}
        ${r.map(p=>this.deviceRow(t,p,e))}`,r.length>=40?"40+":String(r.length),"hme-tray")}
      ${H("Not on the map",c`
        ${a===0?c`<p class="hme-empty-line">Every device with an area is on the map. Find any other above.</p>`:g}
        ${n.map(p=>c`<div class="hme-ar ${p.here?"":"dim"}">${p.name}<span>${p.devices.length}</span></div>
          ${p.devices.map(m=>this.deviceRow(t,m,e))}`)}
        ${a===0?g:c`<button type="button" class="hme-tb hme-wide" ?disabled=${i===0}
            title=${i===0?"Link this floor's rooms to Home Assistant areas in Arrange first":""}
            @click=${()=>this.placeAll(t,n.flatMap(p=>p.devices))}>Place all ${i} by area</button>
          <p class="hme-foot">Each goes into the room linked to its area, at a good height for its kind. Then drag to fine tune.</p>`}`,String(a),"hme-tray")}
      ${H("On the map",c`
        ${s.length===0?c`<p class="hme-empty-line">No devices on this floor yet. Drag one onto the plan.</p>`:c`<div class="hme-chips">
          ${s.map(p=>c`<button type="button" class="hme-chip sel ${this.filter===p.kind?"on":""}" aria-pressed=${this.filter===p.kind?"true":"false"}
            @click=${()=>{this.filter=this.filter===p.kind?void 0:p.kind,t.redraw()}}>${p.label} ${p.count}</button>`)}</div>`}
        ${d.slice(0,60).map(p=>{let m=h.some(u=>x(u,p.id));return c`<button type="button" class="hme-lay ${m?"on":""}" title="Shift, Cmd or Ctrl and a click picks several"
            @click=${u=>t.select(u.shiftKey||u.metaKey||u.ctrlKey?xt(t.selection,p.id):{kind:"pin",pinId:p.id})}>
            <span class="hme-dot dev ${Y(p.entityId,e).kind==="light"?"":"gray"}"></span>${z(p,t.hass)}
            <span class="n">${Ee(p.entityId,e)}</span></button>`})}`,String(t.floor.pins.length))}`}deviceRow(t,e,o){let n=co(t.doc,e.entityId),a=Fe(e.entityId,e.deviceClass,e.name);return c`<div class="hme-dv ${this.dragging===e.entityId?"dragging":""} ${n===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${n===void 0?"true":"false"} title=${n===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it"}
      @dragstart=${i=>{i.dataTransfer?.setData($t,e.entityId),i.dataTransfer?.setData("text/plain",e.entityId),i.dataTransfer&&(i.dataTransfer.effectAllowed="copy"),this.dragging=e.entityId,t.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,t.redraw()}}
      @click=${()=>this.place(t,e.entityId,void 0,e.areaId)}
      @keydown=${i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),this.place(t,e.entityId,void 0,e.areaId))}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${se(a,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${e.name}<small>${n===void 0?xi(e,o):"on the map"}</small></span>
      <span class="hme-dv-grip" aria-hidden="true">${n===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}dragOver(t,e,o){let n=this.dragging!==void 0||[...o.dataTransfer?.types??[]].includes($t),a=this.dropAt;return this.dropAt=n?e:void 0,a!==this.dropAt&&t.redraw(),n&&e!==void 0}drop(t,e,o){let n=this.dragging??o.dataTransfer?.getData($t)??"";this.dragging=void 0,this.dropAt=void 0,n!==""?this.place(t,n,e):t.redraw()}overlay(t){let e=this.states(t),o=this.picked(t),n=ue(t.selection),a=[];this.dropAt!==void 0&&a.push(this.dropMark(t,this.dropAt));let i=o===void 0?void 0:Y(o.entityId,e);o!==void 0&&i?.kind==="light"&&a.push(this.glowRing(t,o,i.on?i.brightness:void 0));for(let r of t.floor.pins){let s=n.some(h=>x(r.id,h)),d=this.filter!==void 0&&kt(r.entityId)!==this.filter;a.push(this.pinMark(t,r,s,d,e))}return this.box!==void 0&&a.push(this.boxMark(t,this.box)),b`${a}`}boxMark(t,e){let[o,n]=t.toScreen(e.a),[a,i]=t.toScreen(e.b);return b`<rect class="hme-box" x=${$(Math.min(o,a))} y=${$(Math.min(n,i))} width=${$(Math.abs(a-o))} height=${$(Math.abs(i-n))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`}pinMark(t,e,o,n,a){let[i,r]=t.toScreen(e.at),s=Y(e.entityId,a),d=s.kind==="light"&&s.on,h=d?Ne(e)??Pt:"rgba(36,36,40,0.92)",p=d?"#fff3d6":s.kind==="gone"?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.4)",m=d?"#3a2600":s.kind==="lock"?s.locked?"#30d158":"#ff9f0a":s.kind==="other"&&s.on?"#ffffff":s.kind==="gone"?"#8e8e93":"#d1d1d6",u=e.icon??Fe(e.entityId,this.deviceClass(t,e.entityId),this.friendly(t,e.entityId)),f=o?13:12,v=o||this.names?z(e,t.hass):bn(e,a),w=v===void 0?0:v.length*5.9+14;return b`<g class="hme-pin" data-hme="pin" data-pin=${e.id} transform=${`translate(${$(i)} ${$(r)})`} opacity=${n?.25:1} style="cursor:grab">
      ${o?b`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:g}
      ${d?b`<circle r=${f+7} fill=${h} opacity="0.22" />`:g}
      <circle r=${f} fill=${h} stroke=${p} stroke-width="1.2" />
      <g transform="translate(-7 -7)">${se(u,m,14,1.5)}</g>
      ${v===void 0||v===""?g:b`<g pointer-events="none"><rect x=${$(-w/2)} y=${f+4} width=${$(w)} height="16" rx="8" fill=${o?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text y=${f+15.5} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${v}</text></g>`}
    </g>`}glowRing(t,e,o){let[n,a]=t.toScreen(e.at),i=ze(e,o),r=t.px(i),s=[n+r*Math.cos(Ht),a+r*Math.sin(Ht)],d=`Glow ${i.toFixed(1)} m`,h=d.length*6.2+18,p=e.glowSpill===!0?void 0:oe(t.floor,e),m=p!==void 0&&p.outline.length>=3?p.outline.map(f=>t.toScreen(f).map($).join(",")).join(" "):void 0,u=f=>b`<circle cx=${$(n)} cy=${$(a)} r=${$(r)} fill="none" stroke=${Ne(e)??"#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${f} pointer-events="none" />`;return b`<g class="hme-glow-ring">
      ${m===void 0?u(1):b`<clipPath id="hme-glow-walls"><polygon points=${m} /></clipPath>
        ${u(.28)}<g clip-path="url(#hme-glow-walls)">${u(1)}</g>`}
      <circle data-hme="glow" cx=${$(s[0])} cy=${$(s[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${$(s[0]-h/2)} y=${$(s[1]+12)} width=${$(h)} height="18" rx="9" fill="#5b8def" />
        <text x=${$(s[0])} y=${$(s[1]+25)} fill="#fff" text-anchor="middle">${d}</text></g>
    </g>`}dropMark(t,e){let o=U(t.floor,e),[n,a]=t.toScreen(e),i=o===void 0?"Drop here, in no room":`Drop in ${D(o)}`,r=i.length*6.4+20;return b`<g class="hme-drop" pointer-events="none">
      ${o===void 0?g:b`<polygon points=${o.outline.map(s=>t.toScreen(s).map($).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${$(n)} cy=${$(a)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${$(n-r/2)} y=${$(a+20)} width=${$(r)} height="18" rx="9" fill="#5b8def" />
        <text x=${$(n)} y=${$(a+33)} fill="#fff" text-anchor="middle">${i}</text></g>
    </g>`}pinAt(t,e){let o,n=ki;for(let a of t.floor.pins){let i=t.toScreen(a.at),r=Math.hypot(i[0]-e[0],i[1]-e[1]);r<=n&&(o=a,n=r)}return o}pointerDown(t,e,o){if(e.button!==0)return!1;let n=t.toScreen(o),a=e.shiftKey||e.metaKey||e.ctrlKey,i=this.picked(t),r=i===void 0?void 0:Y(i.entityId,this.states(t));if(!a&&i!==void 0&&r?.kind==="light"){let[h,p]=t.toScreen(i.at),m=t.px(ze(i,r.on?r.brightness:void 0));if(Math.hypot(n[0]-(h+m*Math.cos(Ht)),n[1]-(p+m*Math.sin(Ht)))<=10)return this.glowDrag(t,e,i),!0}let s=this.pinAt(t,n);if(s===void 0)return e.shiftKey?(this.boxDrag(t,e,o),!0):!1;if(this.pickPage=!1,this.iconsOpen=!1,a)return t.select(xt(t.selection,s.id)),!0;let d=ue(t.selection);return d.length>1&&d.some(h=>x(h,s.id))?(this.groupDrag(t,e,d,s.id,o),!0):(t.select({kind:"pin",pinId:s.id}),this.moveDrag(t,e,s,o),!0)}groupDrag(t,e,o,n,a){let i=[0,0],r=Ue(o);t.drag(e,{move:s=>{this.moving=!0,i=[s[0]-a[0],s[1]-a[1]];let[d,h]=i;t.preview(p=>mt(p,o,d,h))},end:(s,d,h)=>{this.moving=!1,t.preview(void 0);let[p,m]=i;h?Math.hypot(p,m)>=.005&&t.apply(u=>mt(u,o,p,m),r===void 0?{}:{select:r}):t.select({kind:"pin",pinId:n})}})}boxDrag(t,e,o){let n=t.floor.pins,a=t.selection;t.drag(e,{move:i=>{this.box={a:o,b:i},t.redraw()},end:(i,r,s)=>{this.box=void 0,s?t.select(Yn(a,Zn(n,o,i))):t.redraw()}})}async removePicks(t,e){e.length!==0&&(e.length>1&&!await t.confirm({title:`Remove ${C(e.length,"device")} from the map?`,text:"They go back to Not on the map. Undo puts them back where they were.",ok:"Remove",danger:!0})||t.apply(o=>mn(o,e),{select:null}))}moveDrag(t,e,o,n){let a=o.id,i=[o.at[0],o.at[1]],r=i;t.drag(e,{move:s=>{this.moving=!0,r=[i[0]+s[0]-n[0],i[1]+s[1]-n[1]],t.preview(d=>Ut(d,a,r))},end:(s,d,h)=>{this.moving=!1,t.preview(void 0),h&&Math.hypot(r[0]-i[0],r[1]-i[1])>=.005&&t.apply(p=>Ut(p,a,r),{select:{kind:"pin",pinId:a}})}})}glowDrag(t,e,o){let n=o.id,a;t.drag(e,{move:i=>{this.moving=!0;let r=Math.hypot(i[0]-o.at[0],i[1]-o.at[1]);a=Math.min(Math.max(Math.round(r/.05)*.05,Se),ko);let s=a;t.preview(d=>Ae(d,n,{glow:s}))},end:()=>{this.moving=!1,t.preview(void 0);let i=a;i!==void 0&&t.apply(r=>Ae(r,n,{glow:i}))}})}keyDown(t,e){let o=this.picks(t).map(a=>a.id);if(o.length===0)return!1;let n=Q(e,!1);if(n==="delete")return this.removePicks(t,o),!0;if(typeof n=="object"&&"nudge"in n){let[a,i]=n.nudge;return t.apply(r=>mt(r,o,a,i)),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.box=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1}dock(t){let e=(o,n,a,i)=>c`<button type="button" class="hme-tb ${n?"on":""}"
      aria-pressed=${n?"true":"false"} title=${i} @click=${()=>{a(),t.redraw()}}>${o}</button>`;return c`${e("Side view",this.side,()=>{this.side=!this.side},"The picked device's room from the side, to set its height")}
      ${e("Names",this.names,()=>{this.names=!this.names},"Every device's name under its pin")}`}stageExtra(t){let e=this.picked(t);if(!this.side||e===void 0)return g;let o=oe(t.floor,e),n=o?.height??2.5,a=ie(o?.outline??t.floor.rooms.flatMap(P=>P.outline))??{minX:e.at[0]-1,maxX:e.at[0]+1,minY:0,maxY:0},i=18,r=118,s=(r-i)/Math.max(n,.5),d=30,h=262,p=(h-d)/Math.max(a.maxX-a.minX,.5),m=P=>d+(Math.min(Math.max(P,a.minX),a.maxX)-a.minX)*p,u=e.at[2],f=r-Math.min(Math.max(u,0),n)*s,v=m(e.at[0]),w=(()=>{let P=Y(e.entityId,this.states(t));return P.kind==="light"&&P.on})(),k=[];for(let P=0;P<=n+1e-9;P+=1)k.push(P);let M=o===void 0?[]:xo(o),S=o===void 0?"No room":D(o);return c`<div class="hme-side">
      <div class="hme-h">${S} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${z(e,t.hass)} at ${u.toFixed(2)} m, the wall ${n.toFixed(1)} m tall`}
        @pointerdown=${P=>this.heightDrag(t,P,e,n,r,s)}>
        <path d=${`M${d} ${$(i)}H${h}M${d} ${r}H${h}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${d} ${$(i)}V${r}M${h} ${$(i)}V${r}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${k.map(P=>b`<text x=${d-6} y=${$(r-P*s+3)}>${P===0?"0":`${P} m`}</text>
            <path d=${`M${d-4} ${$(r-P*s)}H${d}`} stroke="#8e8e93" />`)}
        </g>
        ${M.map(P=>{let N=m(P.c[0]-P.size[0]/2),j=m(P.c[0]+P.size[0]/2),R=Math.min(P.size[2],n)*s;return b`<rect x=${$(N)} y=${$(r-R)} width=${$(Math.max(j-N,2))} height=${$(R)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${$(v)} ${r}V${$(f)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${w?b`<circle cx=${$(v)} cy=${$(f)} r="20" fill="#ffb648" opacity="0.22" />`:g}
        <circle cx=${$(v)} cy=${$(f)} r="9" fill=${w?Pt:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${$(Math.min(v+14,222))} y=${$(f-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${$(Math.min(v+14,222)+22)} y=${$(f+3.5)} fill="#fff" font-size="10" text-anchor="middle">${u.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(t,e,o,n,a,i){if(e.button!==0)return;let r=e.currentTarget,s=o.id,d=u=>{let f=r.getBoundingClientRect(),v=(u.clientY-f.top)*130/Math.max(f.height,1);return Math.min(Math.max(Math.round((a-v)/i/.05)*.05,0),n)},h=d(e);try{r.setPointerCapture(e.pointerId)}catch{}this.moving=!0,t.preview(u=>J(u,s,h));let p=u=>{h=d(u);let f=h;t.preview(v=>J(v,s,f))},m=()=>{r.removeEventListener("pointermove",p),r.removeEventListener("pointerup",m),r.removeEventListener("pointercancel",m),this.moving=!1,t.preview(void 0);let u=h;Math.abs(u-o.at[2])>=.005&&t.apply(f=>J(f,s,u))};r.addEventListener("pointermove",p),r.addEventListener("pointerup",m),r.addEventListener("pointercancel",m)}pill(t){let e=this.picks(t);if(e.length>1&&!this.moving)return this.groupPill(t,e);let o=this.picked(t);if(o===void 0||this.moving)return g;let n=o.id,a=o.entityId.startsWith("light."),i=oe(t.floor,o)!==void 0;return c`<span class="hme-pill-name">${z(o,t.hass)}</span>
      ${lo(o.entityId)&&t.hass!==void 0?c`<button type="button" class="hme-tb" @click=${()=>this.toggle(t,o.entityId)}>${po(o.entityId,t.hass.states)}</button>`:g}
      ${a?c`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>t.apply(r=>pn(r,n))}>Same height for all lights</button>`:g}
      ${i?c`<button type="button" class="hme-tb" @click=${()=>t.apply(r=>hn(r,n))}>Center in room</button>`:g}
      <button type="button" class="hme-tb danger" @click=${()=>t.apply(r=>Vt(r,n),{select:null})}>Remove</button>`}groupPill(t,e){let o=e.map(s=>s.id),n=e[0],a=n.at[2],i=e.every(s=>Math.abs(s.at[2]-a)<.005),r=t.hass===void 0?void 0:Jn(e.map(s=>s.entityId),t.hass.states);return c`<span class="hme-pill-name">${C(e.length,"device")}</span>
      ${r===void 0?g:c`<button type="button" class="hme-tb" @click=${()=>this.turn(t,e.map(s=>s.entityId),r.service)}>${r.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${i} title=${i?"They are all at one height":`Every picked device at ${z(n,t.hass)}'s height, ${a.toFixed(2)} m`}
        @click=${()=>t.apply(s=>ke(s,o,a))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(t,o)}}>Remove</button>`}toggle(t,e){let o=t.hass;o!==void 0&&Dt(o,"homeassistant","toggle",{entity_id:e}).catch(n=>{t.note("err",`Could not turn it on or off: ${n instanceof Error?n.message:String(n)}`)})}turn(t,e,o){let n=t.hass;n!==void 0&&Dt(n,"homeassistant",o,{entity_id:[...e]}).catch(a=>{t.note("err",`Could not turn them ${o==="turn_on"?"on":"off"}: ${a instanceof Error?a.message:String(a)}`)})}inspector(t){let e=this.picks(t);if(e.length>1)return this.groupInspector(t,e);let o=this.picked(t);if(o===void 0)return this.overview(t);let n=t.hass?.states,a=o.id,i=Y(o.entityId,n),r=i.kind==="light"&&i.on,s=this.friendly(t,o.entityId),d=this.deviceClass(t,o.entityId),h=Fe(o.entityId,d,s),p=o.icon??h,u=oe(t.floor,o)?.height??2.5,f=k=>t.apply(M=>Ae(M,a,k,s)),w=Ne(o)??Pt;return c`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${r?"lit":""}" style=${r?`background:${w};box-shadow:0 0 24px ${w}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${se(p,r?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${z(o,t.hass)}</strong>
          <span class="mono">${o.entityId}</span>
        </div>
        <span class="hme-state ${r?"lit":""}">${Ee(o.entityId,n)}</span>
      </section>

      ${H("On the map",c`
        ${E("Name",Ge({value:o.name??"",label:"Name on the map",placeholder:s??o.entityId,set:k=>f({name:k.trim()===""?null:k})}))}
        ${E("Icon",c`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
          @click=${()=>{this.iconsOpen=!this.iconsOpen,t.redraw()}}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${se(p,"currentColor",24,2)}</svg>
          <span class="hme-grow">${Pi(o,d,s)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
        ${this.iconsOpen?this.iconMenu(t,o,h,f):g}
        ${E("Room",c`<span class="hme-in hme-ro">${Hi(t.floor,o)}</span>`)}
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${G({label:"None",picture:Te("none",w),on:o.reading==="none",click:()=>f({reading:"none"})})}
          ${G({label:"Pill",picture:Te("pill",w),on:o.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>f({reading:null})})}
          ${G({label:"Name",picture:Te("name",w),on:o.reading==="name",click:()=>f({reading:"name"})})}
        </div></div>`)}

      ${H("Height",c`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${u} step="0.05" .value=${F(String(o.at[2]))} aria-label="Height" style=${ve(o.at[2],0,u)}
            @input=${k=>{let M=Number(k.target.value);t.preview(S=>J(S,a,M))}}
            @change=${k=>{let M=Number(k.target.value);t.apply(S=>J(S,a,M))}} />
          ${_({label:"Height",value:o.at[2],unit:"m",min:0,max:100,width:"92px",set:k=>t.apply(M=>J(M,a,k))})}
        </div>
        <div class="hme-chips">${ho.map(([k,M])=>c`<button type="button" class="hme-chip sel ${Math.abs(o.at[2]-M)<.005?"on":""}"
          @click=${()=>t.apply(S=>J(S,a,M))}>${k} ${M}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${o.entityId.startsWith("light.")?this.lightCard(t,o,i.kind==="light"&&i.on?i.brightness:void 0,f):g}

      ${this.tapCard(t,o,f)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>t.apply(k=>Vt(k,a),{select:null})}>Remove from the map</button></div>`}iconMenu(t,e,o,n){let a=r=>{this.iconsOpen=!1,n({icon:r}),t.redraw()},i=(r,s,d,h)=>c`<button type="button" class="hme-icon-cell ${d?"on":""}"
      title=${s} aria-label=${s} aria-pressed=${d?"true":"false"} @click=${()=>a(h)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${se(r,"currentColor",24,1.9)}</svg><span>${s}</span></button>`;return c`<div class="hme-icons" role="group" aria-label="Icon">
      ${i(o,"Auto",e.icon===void 0,null)}
      ${$o.map(r=>i(r,ut[r],e.icon===r,r))}
    </div>`}lightCard(t,e,o,n){let a=e.id,i=ze(e,o),r=Ne(e),s=(d,h,p)=>c`<button type="button" class="hme-chip sel ${h?"on":""}" aria-pressed=${h?"true":"false"} @click=${p}>${d}</button>`;return H("Light",c`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${Se} max=${Math.max(uo,i)} step="0.05" .value=${F(String(i))} aria-label="Glow size"
          style=${ve(i,Se,Math.max(uo,i))}
          @input=${d=>{let h=Number(d.target.value);t.preview(p=>Ae(p,a,{glow:h}))}}
          @change=${d=>n({glow:Number(d.target.value)})} />
        <span class="hme-val mono hme-w48">${i.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${s("By its brightness",e.glow===void 0,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${s("Follow the light",e.glowColor===void 0,()=>n({glowColor:null}))}
        ${s("Warm",e.glowColor==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${r!==void 0?"on":""}">${r===void 0?g:c`<span class="hme-swatch" style=${`background:${r}`}></span>`}Pick
          <input type="color" .value=${F(r??"#ffb648")} aria-label="Pick the glow's color"
            @change=${d=>n({glowColor:d.target.value})} /></label>
      </div></div>
      ${Qn(e.glowSpill===!0?"off":"on",d=>n({glowSpill:d?null:!0}))}
      ${K("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`)}groupInspector(t,e){let o=t.hass?.states,n=e.map(p=>p.id),a=p=>{t.apply(m=>Xt(m,n,p))||t.note("warn","That could not be set on every picked device.")},i=Math.max(2.5,...e.map(p=>oe(t.floor,p)?.height??2.5)),r=fe(e.map(p=>p.at[2])),s=fe(e.map(p=>p.reading)),d=e.every(p=>p.entityId.startsWith("light.")),h=Pt;return c`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${se("bulb","#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${C(e.length,"device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${H("Picked",c`${e.map(p=>c`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${()=>t.select({kind:"pin",pinId:p.id})}>${z(p,t.hass)}</button>
          <span class="hme-val">${Ee(p.entityId,o)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${z(p,t.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>t.select(xt(t.selection,p.id))}>×</button></div>`)}`,String(e.length))}

      ${H("On the map",c`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${G({label:"None",picture:Te("none",h),on:!s.mixed&&s.value==="none",click:()=>a({reading:"none"})})}
          ${G({label:"Pill",picture:Te("pill",h),on:!s.mixed&&s.value===void 0,title:"Each one's reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>a({reading:null})})}
          ${G({label:"Name",picture:Te("name",h),on:!s.mixed&&s.value==="name",click:()=>a({reading:"name"})})}
        </div></div>
        ${s.mixed?K("Mixed: they show different things. Pick one to set them all."):g}`)}

      ${H("Height",c`
        <div class="hme-r">
          ${ei({label:"Height",value:r.mixed?void 0:r.value,min:0,max:i,step:.05,preview:p=>t.preview(m=>ke(m,n,p)),set:p=>t.apply(m=>ke(m,n,p))})}
          ${_({label:"Height",value:r.mixed?void 0:r.value,unit:"m",min:0,max:100,width:"92px",set:p=>t.apply(m=>ke(m,n,p))})}
        </div>
        <div class="hme-chips">${ho.map(([p,m])=>c`<button type="button" class="hme-chip sel ${e.every(u=>Math.abs(u.at[2]-m)<.005)?"on":""}"
          @click=${()=>t.apply(u=>ke(u,n,m))}>${p} ${m}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${d?this.groupLightCard(t,e,a):g}

      ${this.groupTapCard(t,e,a)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(t,n)}}>Remove ${C(e.length,"device")} from the map</button></div>`}groupLightCard(t,e,o){let n=e.map(f=>f.id),a=this.states(t),i=e.map(f=>{let v=Y(f.entityId,a);return Math.round(ze(f,v.kind==="light"&&v.on?v.brightness:void 0)*20)/20}),r=fe(i),s=Math.max(uo,...i),d=e.every(f=>f.glow===void 0),h=fe(e.map(f=>f.glowColor?.toLowerCase())),p=fe(e.map(f=>f.glowSpill===!0)),m=h.mixed||h.value===void 0||h.value==="warm"?void 0:h.value,u=(f,v,w)=>c`<button type="button" class="hme-chip sel ${v?"on":""}" aria-pressed=${v?"true":"false"} @click=${w}>${f}</button>`;return H("Light",c`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${ei({label:"Glow size",value:r.mixed?void 0:r.value,min:Se,max:s,step:.05,preview:f=>t.preview(v=>Xt(v,n,{glow:f})),set:f=>o({glow:f})})}
        <span class="hme-val mono hme-w48">${r.mixed?"Mixed":`${r.value.toFixed(1)} m`}</span></div>
      <div class="hme-row-end indent">${u("By its brightness",d,()=>o({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${u("Follow the light",!h.mixed&&h.value===void 0,()=>o({glowColor:null}))}
        ${u("Warm",!h.mixed&&h.value==="warm",()=>o({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${m!==void 0?"on":""}">${m===void 0?g:c`<span class="hme-swatch" style=${`background:${m}`}></span>`}Pick
          <input type="color" .value=${F(m??"#ffb648")} aria-label="Pick the glow's color for every picked light"
            @change=${f=>o({glowColor:f.target.value})} /></label>
      </div></div>
      ${h.mixed?K("Mixed: their colors differ. Pick one to set them all."):g}
      ${Qn(p.mixed?"mixed":p.value?"off":"on",f=>o({glowSpill:f?null:!0}))}`)}groupTapCard(t,e,o){let n=fe(e.map(d=>[d.tap,d.tap==="page"?d.pageId?.toLowerCase():void 0])),a=n.mixed?void 0:n.value,i=a?.[0]==="page"||this.pickPage,r=a?.[0]==="page"?e[0].pageId:void 0,s=d=>{if(d==="page"){t.pages.length===1?o({tap:"page",pageId:t.pages[0].id}):(this.pickPage=!0,t.redraw());return}this.pickPage=!1,o({tap:d??null})};return H("Tap on the map",c`
      <div class="hme-chips">${mo.map(([d,h])=>{let p=d==="page"?i:!this.pickPage&&a!==void 0&&a[0]===d;return c`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"}
          ?disabled=${d==="page"&&t.pages.length===0} title=${d==="page"&&t.pages.length===0?"Your library has no pages":""}
          @click=${()=>s(d)}>${h}</button>`})}</div>
      ${i?E("Page",me({label:"Page",value:r??"",options:[...r===void 0?[{value:"",label:"Pick a page\u2026",disabled:!0}]:[],...r===void 0||t.pages.some(d=>x(d.id,r))?[]:[{value:r,label:"A page not in your library",disabled:!0}],...t.pages.map(d=>({value:d.id,label:d.name}))],set:d=>{this.pickPage=!1,d!==""&&o({tap:"page",pageId:d})}})):g}
      <p class="hme-text dim">${n.mixed&&!this.pickPage?"Mixed: a tap does different things on them. Pick one to set them all.":"Set on every picked device."}</p>`)}tapCard(t,e,o){let n=e.tap==="page"||this.pickPage,a=e.pageId===void 0||t.pages.some(r=>x(r.id,e.pageId)),i=r=>{if(r==="page"){if(e.tap==="page")return;t.pages.length===1?o({tap:"page",pageId:t.pages[0].id}):(this.pickPage=!0,t.redraw());return}this.pickPage=!1,o({tap:r??null})};return H("Tap on the map",c`
      <div class="hme-chips">${mo.map(([r,s])=>{let d=r==="page"?n:!this.pickPage&&e.tap===r;return c`<button type="button" class="hme-chip sel ${d?"on":""}" aria-pressed=${d?"true":"false"}
          ?disabled=${r==="page"&&t.pages.length===0} title=${r==="page"&&t.pages.length===0?"Your library has no pages":""}
          @click=${()=>i(r)}>${s}</button>`})}</div>
      ${n?E("Page",me({label:"Page",value:e.tap==="page"?e.pageId??"":"",options:[...e.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...a?[]:[{value:e.pageId,label:"A page not in your library",disabled:!0}],...t.pages.map(r=>({value:r.id,label:r.name}))],set:r=>{this.pickPage=!1,r!==""&&o({tap:"page",pageId:r})}})):g}
      <p class="hme-text dim">${e.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":"Hold on the watch or iPhone: its controls."}</p>`)}overview(t){let e=He(t.selection),o=e===void 0?void 0:t.floor.rooms.find(i=>x(i.id,e)),n=o===void 0?t.floor.pins:ye(t.floor,o.id),a=t.hass?.states;return c`${H(o===void 0?"Devices":D(o),c`
        <p class="hme-text">${o===void 0?`${C(t.floor.pins.length,"device")} on this floor.`:`${C(n.length,"device")} in this room.`}</p>
        ${n.map(i=>c`<button type="button" class="hme-list-row" @click=${()=>t.select({kind:"pin",pinId:i.id})}>
          <span class="hme-grow">${z(i,t.hass)}</span><span class="hme-val">${Ee(i.entityId,a)}</span></button>`)}`)}
      ${H("Devices",c`<p class="hme-text">Pick a device on the plan to set its name, icon, height, glow and what a tap on it does.</p>
        <p class="hme-text dim">Drag a device from Not on the map onto the plan to place it. Drag a pin to move it; arrow keys nudge it, Delete takes it off the map.</p>
        <p class="hme-text dim">Shift, Cmd or Ctrl and a click picks several; Shift and a drag over empty space picks every device in the box. Then drag one to move them all, or set them together.</p>`)}`}};function Qn(l,t){let e=l==="on"?"walls stop the glow":l==="off"?"the glow spreads past the walls":"some stay in, some spread";return c`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${l==="mixed"?c`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${()=>t(!0)}>Mixed</button>`:je({on:l==="on",onText:"On",offText:"Off",label:"Stay in room",click:()=>t(l!=="on")})}
    <span class="hme-text dim">${e}</span></div>`}function ei(l){let t=l.value??(l.min+l.max)/2;return c`<input class="hme-range ${l.value===void 0?"mixed":""}" type="range" min=${l.min} max=${l.max} step=${l.step} .value=${F(String(t))}
    aria-label=${l.label} aria-valuetext=${l.value===void 0?"Mixed":g} style=${l.value===void 0?"--p:0%":ve(l.value,l.min,l.max)}
    @input=${e=>{let o=e.target;o.classList.remove("mixed"),l.preview(Number(o.value))}}
    @change=${e=>l.set(Number(e.target.value))} />`}function Te(l,t){return c`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${l==="none"?20:16} r="9" fill=${t} />
    ${l==="pill"?b`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:g}
    ${l==="name"?b`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:g}
  </svg>`}var ii=[{id:"select",label:"Walls and corners",key:"v"},{id:"draw",label:"Draw a room",key:"r"},{id:"split",label:"Split a room",key:"s"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"opening",label:"Way through (no door)",key:"o"},{id:"stairs",label:"Stairs",key:"t"}];function Ei(l){return ii.find(t=>t.key===l.toLowerCase())?.id}var Ti=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],Si=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function Ii(l){return l===2?"Fix both":`Fix all ${Si[l]??l}`}var Ci=9,ti=18,y=l=>l.toFixed(1),Ve=l=>`${l[0].toFixed(1)},${l[1].toFixed(1)}`,oi=new WeakMap;function Tt(l){let t=oi.get(l);return t===void 0&&oi.set(l,t=sn(l)),t}function fo(l,t,e,o){let n=e/l.view.scale,a=i=>{let r;for(let s of i)for(let[d,h]of W(s).entries()){let p=Ao(t,h);p<=n&&(r===void 0||p<r.d)&&(r={room:s,wall:d,seg:h,d:p})}return r};return(o===void 0?void 0:a([o]))??a(l.floor.rooms)}function ni(l,t){let e=Math.max(ne(t),1e-9),o=[-(t.b[1]-t.a[1])/e,(t.b[0]-t.a[0])/e],n=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],a=B(l)??te(l);return(a[0]-n[0])*o[0]+(a[1]-n[1])*o[1]>0&&(o=[-o[0],-o[1]]),o}var St=class{constructor(){this.id="shape";this.tool="select";this.draw=new Pe(ce);this.dragging=!1}setTool(t,e){this.first=void 0,e==="draw"?this.draw.start(t):this.draw.stop(),this.tool=e,t.redraw()}focus(t){let e=He(t.selection);return e===void 0?void 0:t.floor.rooms.find(o=>x(o.id,e))}pickedWall(t,e){let o=t.selection;if(!(e===void 0||o===void 0)){if(o.kind==="wall")return o.wall;if(o.kind==="opening"){let n=e.openings[o.opening],a=n===void 0?-1:st(e,n);return a>=0?a:void 0}}}rail(t){let e=Tt(t.floor),o=t.floor.id;return c`
      <section class="hme-card hme-tools">
        <div class="hme-h">Tools</div>
        ${ii.map((n,a)=>c`${a===4?c`<div class="hme-sep"></div>`:g}
          <button type="button" class="hme-tool ${this.tool===n.id?"on":""}" aria-pressed=${this.tool===n.id?"true":"false"}
            @click=${()=>this.setTool(t,n.id)}>${Ri[n.id]}${n.label}<kbd>${n.key.toUpperCase()}</kbd></button>`)}
      </section>
      ${H("Scan check",c`
        ${e.length===0?c`<p class="hme-text dim">Nothing to fix. The walls meet and every room has a way in.</p>`:g}
        ${e.map(n=>c`<div class="hme-fix">
          <span class="hme-fix-dot ${n.kind==="missingDoor"?"gray":""}"></span>
          <p @click=${()=>t.select({kind:"room",roomId:n.roomIds[0]})}><b>${n.title}</b> ${n.detail}</p>
          <button type="button" class="hme-tb" @click=${()=>t.apply(a=>n.fix(a))}>${n.fixLabel}</button></div>`)}
        ${e.length>1?c`<button type="button" class="hme-tb hme-wide" @click=${()=>t.apply(n=>ln(n,o))}>${Ii(e.length)}</button>`:g}`,e.length===0?void 0:c`<span class="hme-amber">${e.length} to fix</span>`)}`}overlay(t){if(this.tool==="draw")return this.draw.overlay(t);let e=this.focus(t),o=[];if(e!==void 0&&e.outline.length>=3){let n=e.outline.map(a=>Ve(t.toScreen(a))).join("L");o.push(b`<path d=${`M0 0H${t.stage.width}V${t.stage.height}H0ZM${n}Z`} fill="rgba(0,0,0,0.45)" fill-rule="evenodd" pointer-events="none" />`)}return o.push(...this.issueMarks(t)),e!==void 0&&o.push(this.roomHandles(t,e)),o.push(...this.toolGhost(t)),b`${o}`}issueMarks(t){return Tt(t.floor).map(e=>{let[o,n]=t.toScreen(e.where);if(e.kind==="offSquare"){let d=/(\d+)°/.exec(e.title)?.[1]??"";return b`<g class="hme-issue" data-hme=${`issue:${e.id}`} style="cursor:pointer"><title>${e.title} Click to square it.</title>
          <circle cx=${y(o)} cy=${y(n)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${y(o+12)} y=${y(n+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${y(o+34)} y=${y(n+20)} fill="#2a1a00" text-anchor="middle">${d}°</text></g></g>`}let a=`${Math.round(e.amount*100)} cm`,i=e.kind==="overlap"?`Overlap ${a} \xB7 ${e.fixLabel}`:e.kind==="gap"?`Gap ${a} \xB7 ${e.fixLabel}`:`No door \xB7 ${e.fixLabel}`,r=i.length*6.2+18,s=e.kind==="missingDoor";return b`<g class="hme-issue" data-hme=${`issue:${e.id}`} style="cursor:pointer"><title>${e.title} ${e.detail}</title>
        <circle cx=${y(o)} cy=${y(n)} r="4" fill=${s?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${y(o-r/2)} y=${y(n+8)} width=${y(r)} height="20" rx="10" fill=${s?"#8e8e93":"#ffb340"} />
        <text x=${y(o)} y=${y(n+22)} fill=${s?"#fff":"#2a1a00"} text-anchor="middle">${i}</text></g></g>`})}roomHandles(t,e){let o=W(e),n=t.selection,a=this.pickedWall(t,e),i=[];if(a!==void 0&&o[a]!==void 0){let s=o[a],d=t.toScreen(s.a),h=t.toScreen(s.b),p=ni(e,s);if(i.push(b`<line x1=${y(d[0])} y1=${y(d[1])} x2=${y(h[0])} y2=${y(h[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),n?.kind==="wall"&&!this.dragging){let m=[(d[0]+h[0])/2+p[0]*22,(d[1]+h[1])/2+p[1]*22];i.push(b`<g class="hme-tag" pointer-events="none"><rect x=${y(m[0]-27)} y=${y(m[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${y(m[0])} y=${y(m[1]+4)} fill="#fff" text-anchor="middle">${ne(s).toFixed(2)} m</text></g>`)}}for(let[s,d]of e.openings.entries()){let h=t.toScreen(d.a),p=t.toScreen(d.b),m=n?.kind==="opening"&&n.opening===s,u=d.kind==="window"?"#8bb8f0":d.kind==="door"?"#ece6da":"#98989d";i.push(b`<g data-hme=${`opening:${s}`} style="cursor:ew-resize">
        <line x1=${y(h[0])} y1=${y(h[1])} x2=${y(p[0])} y2=${y(p[1])} stroke=${m?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${y(h[0])} y1=${y(h[1])} x2=${y(p[0])} y2=${y(p[1])} stroke=${u} stroke-width="3" />
        ${m?b`<circle cx=${y(h[0])} cy=${y(h[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" /><circle cx=${y(p[0])} cy=${y(p[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" />`:g}
      </g>`)}let r=this.sliding!==void 0&&x(this.sliding.roomId,e.id)?this.sliding.index:n?.kind==="opening"?n.opening:void 0;if(r!==void 0&&e.openings[r]!==void 0&&i.push(this.distances(t,e,e.openings[r])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[s,d]of o.entries()){if(ne(d)*t.view.scale<40)continue;let h=t.toScreen([(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2]);i.push(b`<circle data-hme=${`mid:${s}`} cx=${y(h[0])} cy=${y(h[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[s,d]of e.outline.entries()){let[h,p]=t.toScreen(d),m=n?.kind==="corner"&&n.corner===s;i.push(b`<circle data-hme=${`corner:${s}`} cx=${y(h)} cy=${y(p)} r="7" fill=${m?"#5b8def":"#fff"} stroke=${m?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return b`<g class="hme-handles">${i}</g>`}distances(t,e,o){let n=st(e,o),a=n>=0?W(e)[n]:void 0;if(a===void 0)return b``;let i=ne(a),r=ae(o.a,a.a,a.b).along,s=ae(o.b,a.a,a.b).along,d=Math.max(0,Math.min(r,s)),h=Math.min(i,Math.max(r,s)),p=ni(e,a),m=[(a.b[0]-a.a[0])/i,(a.b[1]-a.a[1])/i],u=k=>{let M=t.toScreen([a.a[0]+m[0]*k,a.a[1]+m[1]*k]);return[M[0]+p[0]*26,M[1]+p[1]*26]},f=[0,d,h,i],v=k=>`M${Ve([k[0]-p[0]*5,k[1]-p[1]*5])}L${Ve([k[0]+p[0]*5,k[1]+p[1]*5])}`,w=[[0,d,!1],[d,h,!0],[h,i,!1]];return b`<g class="hme-dist" pointer-events="none">
      <path d=${`M${Ve(u(0))}L${Ve(u(i))}${f.map(k=>v(u(k))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${w.filter(([k,M])=>M-k>.02).map(([k,M,S])=>{let P=u((k+M)/2);return b`<g class="hme-tag"><rect x=${y(P[0]-25)} y=${y(P[1]-9)} width="50" height="18" rx="9" fill=${S?"#5b8def":"#2c2c2e"} />
          <text x=${y(P[0])} y=${y(P[1]+4)} fill="#fff" text-anchor="middle">${(M-k).toFixed(2)} m</text></g>`})}
    </g>`}toolGhost(t){let e=this.hoverAt;if(e===void 0)return[];let o=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let n=fo(t,e,ti,this.focus(t));if(n!==void 0){let a=this.tool==="window"?1.2:.9,i=ne(n.seg),r=Math.min(a,i),s=Math.min(Math.max(ae(e,n.seg.a,n.seg.b).along,r/2),i-r/2),d=[(n.seg.b[0]-n.seg.a[0])/i,(n.seg.b[1]-n.seg.a[1])/i],h=t.toScreen([n.seg.a[0]+d[0]*(s-r/2),n.seg.a[1]+d[1]*(s-r/2)]),p=t.toScreen([n.seg.a[0]+d[0]*(s+r/2),n.seg.a[1]+d[1]*(s+r/2)]);o.push(b`<line x1=${y(h[0])} y1=${y(h[1])} x2=${y(p[0])} y2=${y(p[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&U(t.floor,e)!==void 0){let[n,a]=t.toScreen(e),i=t.px(1),r=t.px(2.6);o.push(b`<g pointer-events="none" opacity="0.7"><rect x=${y(n-i/2)} y=${y(a-r/2)} width=${y(i)} height=${y(r)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(s=>b`<line x1=${y(n-i/2)} x2=${y(n+i/2)} y1=${y(a-r/2+r*s/8)} y2=${y(a-r/2+r*s/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let n=t.toScreen(this.first.a),a=t.toScreen(this.snap(t,e,this.first.a));if(this.tool==="split"){let i=Math.max(Math.hypot(a[0]-n[0],a[1]-n[1]),1e-6),r=[(a[0]-n[0])/i,(a[1]-n[1])/i],s=Math.hypot(t.stage.width,t.stage.height);o.push(b`<line x1=${y(n[0]-r[0]*s)} y1=${y(n[1]-r[1]*s)} x2=${y(n[0]+r[0]*s)} y2=${y(n[1]+r[1]*s)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else o.push(b`<line x1=${y(n[0])} y1=${y(n[1])} x2=${y(a[0])} y2=${y(a[1])} stroke="#ece6da" stroke-width=${y(Math.max(t.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);o.push(b`<circle cx=${y(n[0])} cy=${y(n[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return o}snap(t,e,o){return so(t.floor,e,t.view.scale,{...o===void 0?{}:{from:o},...t.toggles.grid?{grid:ce}:{}})}pointerDown(t,e,o){if(this.tool==="draw")return this.draw.pointerDown(t,e,o);if(e.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let n=fo(t,o,ti,this.focus(t));if(n===void 0)return!1;let a=this.tool,i=n.room.id,r=n.room.openings.length,s=n.wall;return t.apply(d=>pt(d,i,s,{kind:a,at:o}),{select:{kind:"opening",roomId:i,opening:r}})&&this.setTool(t,"select"),!0}case"stairs":{let n=U(t.floor,o);if(n===void 0)return!1;let a=n.id;return t.apply(i=>Qo(i,a,o),{select:{kind:"room",roomId:a}})&&this.setTool(t,"select"),!0}case"split":case"inner":return this.twoPoints(t,o);default:return this.pick(t,e,o)}}twoPoints(t,e){if(this.first===void 0){let i=U(t.floor,e)??this.focus(t);return i===void 0?!1:(this.first={roomId:i.id,a:this.snap(t,e)},t.select({kind:"room",roomId:i.id}),!0)}let{roomId:o,a:n}=this.first,a=this.snap(t,e,n);if(this.first=void 0,Math.hypot(a[0]-n[0],a[1]-n[1])<.1)return t.redraw(),!0;if(this.tool==="inner"){let i=t.doc.floors.flatMap(s=>s.rooms).find(s=>x(s.id,o)),r=i===void 0?0:Lt(i).length;return t.apply(s=>an(s,o,n,a),{select:{kind:"wall",roomId:o,wall:r}})?this.setTool(t,"select"):t.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(t,o,n,a),!0}async split(t,e,o,n){let a=t.floor.rooms.find(s=>x(s.id,e)),i=await t.ask({title:"Name the new room",label:"Name",value:a===void 0?"Room":`${D(a)} 2`,ok:"Split the room"});if(i===void 0)return;let r=t.newId();t.apply(s=>rn(s,e,o,n,r,i),{select:{kind:"room",roomId:r}})?this.setTool(t,"select"):t.note("err","That line does not cut the room in two. Draw it right across the room.")}pick(t,e,o){let n=this.focus(t),a=e.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[i,r]=a.split(/:(.*)/s);if(i==="issue"){let p=Tt(t.floor).find(m=>m.id===r);return p!==void 0&&t.apply(m=>p.fix(m)),!0}let s=Number(r);if(n!==void 0&&i==="corner"&&Number.isInteger(s))return this.cornerDrag(t,e,n,s),!0;if(n!==void 0&&i==="mid"&&Number.isInteger(s))return this.midDrag(t,e,n,s),!0;if(n!==void 0&&i==="opening"&&Number.isInteger(s))return this.openingDrag(t,e,n,s),!0;let d=fo(t,o,Ci,n);if(d!==void 0)return this.wallAt=ae(o,d.seg.a,d.seg.b).point,t.select({kind:"wall",roomId:d.room.id,wall:d.wall}),!0;let h=U(t.floor,o);return h===void 0?!1:(t.select({kind:"room",roomId:h.id}),!0)}cornerTo(t,e,o,n){let a=t.floor.rooms.filter(s=>!x(s.id,e.id)).flatMap(s=>s.outline),i=10/t.view.scale;for(let s of a)if(Math.hypot(s[0]-n[0],s[1]-n[1])<=i)return[s[0],s[1]];let r=n;if(t.toggles.grid&&(r=[Math.round(r[0]/ce)*ce,Math.round(r[1]/ce)*ce]),t.toggles.square){let s=Fo(t.floor.rooms.flatMap(w=>Lt(w))),d=Math.cos(s),h=Math.sin(s),p=w=>[w[0]*d+w[1]*h,-w[0]*h+w[1]*d],[m,u]=p(r),f=e.outline.length,v=8/t.view.scale;for(let w of[(o+f-1)%f,(o+1)%f]){let[k,M]=p(e.outline[w]);Math.abs(m-k)<=v&&(m=k),Math.abs(u-M)<=v&&(u=M)}r=[m*d-u*h,m*h+u*d]}return r}cornerDrag(t,e,o,n){let a=o.id,i;t.drag(e,{move:r=>{this.dragging=!0;let s=this.cornerTo(t,o,n,r);i=s,t.preview(d=>$e(d,a,n,s))},end:(r,s,d)=>{this.dragging=!1,t.preview(void 0);let h=i,p={kind:"corner",roomId:a,corner:n};d&&h!==void 0?t.apply(m=>$e(m,a,n,h),{select:p}):t.select(p)}})}midDrag(t,e,o,n){let a=o.id,i=W(o)[n],r=lt(t.doc,a,n),s=r?.floors.flatMap(u=>u.rooms).find(u=>x(u.id,a));if(i===void 0||r===void 0||s===void 0)return;let d=[(i.a[0]+i.b[0])/2,(i.a[1]+i.b[1])/2],h=s.outline.reduce((u,f,v)=>Math.hypot(f[0]-d[0],f[1]-d[1])<Math.hypot(s.outline[u][0]-d[0],s.outline[u][1]-d[1])?v:u,0),p=u=>f=>{let v=lt(f,a,n);return v===void 0||u===void 0?v:$e(v,a,h,u)},m;t.drag(e,{move:u=>{this.dragging=!0,m=this.cornerTo(t,s,h,u),t.preview(p(m))},end:(u,f,v)=>{this.dragging=!1,t.preview(void 0),t.apply(p(v?m:void 0),{select:{kind:"corner",roomId:a,corner:h}})}})}openingDrag(t,e,o,n){let a=o.id,i=o.openings[n];if(i===void 0)return;let r={kind:"opening",roomId:a,opening:n},s=[(i.a[0]+i.b[0])/2,(i.a[1]+i.b[1])/2],d,h;t.select(r),t.drag(e,{move:p=>{d??=p,this.dragging=!0,this.sliding={roomId:a,index:n};let m=[s[0]+p[0]-d[0],s[1]+p[1]-d[1]];h=m,t.preview(u=>Bt(u,a,n,m))},end:(p,m,u)=>{this.dragging=!1,this.sliding=void 0,t.preview(void 0);let f=h;u&&f!==void 0&&t.apply(v=>Bt(v,a,n,f),{select:r})}})}hover(t,e){if(this.tool==="draw"){this.draw.hover(t,e);return}this.tool!=="select"&&(this.hoverAt=e,t.redraw())}keyDown(t,e){if(this.tool==="draw"&&this.draw.active&&(e.key==="Enter"||e.key==="Backspace"||e.key==="Delete"))return this.draw.keyDown(t,e);let o=Q(e,!1);if(typeof o=="object"&&"letter"in o){let n=Ei(o.letter);return n===void 0?!1:(this.setTool(t,n),!0)}if(o==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(t,"select"),!0;if(o==="delete"){let n=t.selection;if(n?.kind==="corner")t.apply(a=>dt(a,n.roomId,n.corner),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="opening")t.apply(a=>ht(a,n.roomId,n.opening),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="wall")t.apply(a=>jt(a,n.roomId,n.wall),{select:{kind:"room",roomId:n.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(t){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.draw.stop(),this.tool="select",t.redraw()}dock(t){return c`<button type="button" class="hme-tb ${t.toggles.square?"on":""}" aria-pressed=${t.toggles.square?"true":"false"}
        title="A dragged corner lines up with the corners beside it" @click=${()=>t.setToggle("square",!t.toggles.square)}>Snap to 90°</button>
      <button type="button" class="hme-tb ${t.toggles.grid?"on":""}" aria-pressed=${t.toggles.grid?"true":"false"}
        @click=${()=>t.setToggle("grid",!t.toggles.grid)}>Grid 5 cm</button>`}pill(t){if(this.tool==="draw")return c`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?c`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(t)}}>Close the room</button>`:g}
        <button type="button" class="hme-tb" @click=${()=>this.setTool(t,"select")}>Cancel</button>`;if(this.tool!=="select"){let i={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in a room to put stairs there"};return c`<span class="hme-pill-name">${i[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(t,"select")}>Cancel</button>`}let e=this.focus(t),o=t.selection;if(e===void 0||o===void 0||this.dragging)return g;let n=e.id,a=D(e);if(o.kind==="wall"){let i=o.wall,r=this.wallAt,s=oo(e,i,a).replace(", "," \xB7 ");return c`<span class="hme-pill-name">${s}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(t,e,i,"window",r)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(t,e,i,"door",r)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(t,e,i,r)}>Add a corner</button>
        <button type="button" class="hme-tb" @click=${()=>t.apply(d=>Gt(d,n,i))}>Straighten</button>`}if(o.kind==="corner")return c`<span class="hme-pill-name">${a} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${e.outline.length<=3} @click=${()=>t.apply(i=>dt(i,n,o.corner),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>t.apply(i=>Z(i,n))}>Square the corners</button>`;if(o.kind==="opening"){let i=e.openings[o.opening];return i===void 0?g:c`<span class="hme-pill-name">${pe(i)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>t.apply(r=>ht(r,n,o.opening),{select:{kind:"room",roomId:n}})}>Remove</button>`}return c`<span class="hme-pill-name">${a}</span>
      <button type="button" class="hme-tb" @click=${()=>t.apply(i=>Z(i,n))}>Square the corners</button>`}addHere(t,e,o,n,a){let i=e.id,r=e.openings.length;t.apply(s=>pt(s,i,o,{kind:n,...a===void 0?{}:{at:a}}),{select:{kind:"opening",roomId:i,opening:r}})}cornerHere(t,e,o,n){let a=e.id,i=p=>lt(p,a,o,n),r=i(t.doc)?.floors.flatMap(p=>p.rooms).find(p=>x(p.id,a)),s=W(e)[o],d=n??(s===void 0?void 0:[(s.a[0]+s.b[0])/2,(s.a[1]+s.b[1])/2]),h=r===void 0||d===void 0?-1:r.outline.reduce((p,m,u)=>Math.hypot(m[0]-d[0],m[1]-d[1])<Math.hypot(r.outline[p][0]-d[0],r.outline[p][1]-d[1])?u:p,0);t.apply(i,{select:h<0?{kind:"room",roomId:a}:{kind:"corner",roomId:a,corner:h}})}inspector(t){let e=this.focus(t),o=t.selection;if(e===void 0||o===void 0){let p=Tt(t.floor);return H("Shape",c`<p class="hme-text">Pick a room, then a wall or a corner. Drag a corner to move it; a corner two rooms share moves for both.</p>
        <p class="hme-text dim">${p.length===0?"The scan check found nothing to fix on this floor.":`The scan check found ${C(p.length,"thing")} to fix. They are marked in amber.`}</p>`)}let n=e.id;if(o.kind==="corner")return this.cornerCard(t,e,o.corner);let a=this.pickedWall(t,e);if(a===void 0)return H(D(e),c`
        ${E("Corners",c`<span class="hme-val">${e.outline.length}</span>`)}
        ${E("Walls",c`<span class="hme-val">${W(e).length}</span>`)}
        ${E("Wall height",_({label:"Wall height",value:e.height,unit:"m",min:.5,max:20,set:p=>t.apply(m=>Oe(m,n,p))}))}
        ${K("Click a wall to change it or put a door or window in it. Drag a corner to move it, or the dot in a wall's middle to add a corner.")}
        <div class="hme-row-end"><button type="button" class="hme-tb" @click=${()=>t.apply(p=>Z(p,n))}>Square the corners</button></div>`);let i=W(e)[a],r=e.openings.map((p,m)=>({o:p,i:m})).filter(({o:p})=>st(e,p)===a),s=o.kind==="opening"?e.openings[o.opening]:void 0,d=ne(i),h=p=>{let m=e.openings.length;t.apply(u=>pt(u,n,a,{kind:p}),{select:{kind:"opening",roomId:n,opening:m}})};return c`
      ${H("Wall",c`
        ${E("Room",c`<span class="hme-val strong">${oo(e,a,D(e))}</span>`)}
        ${E("Length",_({label:"Length",value:d,unit:"m",min:.1,max:200,set:p=>t.apply(m=>on(m,n,a,p))}))}
        ${E("Thickness",_({label:"Thickness",value:i.t,unit:"m",min:.01,max:1,set:p=>t.apply(m=>nn(m,n,a,p))}))}
        ${E("Height",_({label:"Wall height",value:e.height,unit:"m",min:.5,max:20,set:p=>t.apply(m=>Oe(m,n,p))}))}
        ${K("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-row-end indent">
          <button type="button" class="hme-tb" @click=${()=>t.apply(p=>Gt(p,n,a))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>t.apply(p=>Z(p,n))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(t,e,a,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>t.apply(p=>jt(p,n,a),{select:{kind:"room",roomId:n}})}>Remove</button>
        </div>`)}
      ${H("On this wall",c`
        ${r.map(({o:p,i:m})=>{let u=ae(p.a,i.a,i.b).along,f=ae(p.b,i.a,i.b).along,v=o.kind==="opening"&&o.opening===m;return c`<button type="button" class="hme-list-row ${v?"on":""}" @click=${()=>t.select({kind:"opening",roomId:n,opening:m})}>
            <span class="hme-grow">${pe(p)}</span><span class="mono dim">${eo(Math.abs(f-u))} · ${eo(Math.max(0,Math.min(u,f)))} in</span></button>`})}
        ${r.length===0?c`<p class="hme-empty-line">Nothing on this wall.</p>`:g}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>h("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>h("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>h("opening")}>＋ Way through</button>
        </div>`)}
      ${s===void 0||o.kind!=="opening"?g:this.openingCard(t,e,o.opening,s)}`}openingCard(t,e,o,n){let a=e.id,i=Math.hypot(n.b[0]-n.a[0],n.b[1]-n.a[1]),r=n.z1-n.z0;return H(pe(n),c`
      <div class="hme-pics">${Ti.map(s=>G({label:s.label,picture:Di[s.label],on:n.kind===s.kind&&n.style===s.style,click:()=>t.apply(d=>_e(d,a,o,{kind:s.kind,style:s.style??null}))}))}</div>
      ${E("Width",_({label:"Width",value:i,unit:"m",min:.1,max:20,set:s=>t.apply(d=>_e(d,a,o,{width:s}))}))}
      ${E("From floor",_({label:"From floor",value:n.z0,unit:"m",min:0,max:20,set:s=>t.apply(d=>_e(d,a,o,{z0:s,z1:s+r}))}),c`<span class="hme-l short">Tall</span>`,_({label:"Tall",value:r,unit:"m",min:.05,max:20,set:s=>t.apply(d=>_e(d,a,o,{z1:n.z0+s}))}))}
      ${K("Drag it along the wall. The plan shows the space to each corner.")}
      <div class="hme-row-end indent"><button type="button" class="hme-tb danger" @click=${()=>t.apply(s=>ht(s,a,o),{select:{kind:"room",roomId:a}})}>Remove ${pe(n).toLowerCase()}</button></div>`)}cornerCard(t,e,o){let n=e.id,a=e.outline[o];if(a===void 0)return c``;let i=t.floor.rooms.filter(r=>!x(r.id,n)&&r.outline.some(s=>Math.hypot(s[0]-a[0],s[1]-a[1])<=.02));return H("Corner",c`
      ${E("Room",c`<span class="hme-val strong">${D(e)}</span>`)}
      ${E("Left, top",_({label:"Corner left",value:a[0],unit:"m",set:r=>t.apply(s=>$e(s,n,o,[r,a[1]]))}),_({label:"Corner top",value:a[1],unit:"m",set:r=>t.apply(s=>$e(s,n,o,[a[0],r]))}))}
      ${K(i.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${i.map(D).join(", ")}, which move${i.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${e.outline.length<=3} @click=${()=>t.apply(r=>dt(r,n,o),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>t.apply(r=>Z(r,n))}>Square the corners</button>
      </div>`)}},Ri={select:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,draw:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`,split:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},Di={Door:c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var It={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function Oi(l,t){if(!ct(l))return"Home style";let e=qt(l,t),o=a=>Object.hasOwn(l,un[a]),n=[];return o("look")&&n.push(It[e.look].title),o("turn")&&n.push(`turned ${e.turn}\xB0`),o("names")&&n.push(e.names?"room names":"no room names"),o("devices")&&n.push(e.devices==="all"?"every device":e.devices==="none"?"no devices":"lights only"),o("furniture")&&n.push(e.furniture?"furniture":"no furniture"),o("glow")&&n.push(e.glow?"glow":"no glow"),`Own look: ${n.join(", ")}`}var ai=(l,t)=>typeof l=="number"&&Number.isFinite(l)?l:t;function _i(l,t){let e=Ro(l);return Co(l).flatMap(o=>{if(_t(nt(o))!=="home_map")return[];let n=o,a=Do(nt(o)),i=t?.floors.find(m=>x(m.id,a)),r=typeof n.homeMapRoomId=="string"?n.homeMapRoomId:void 0,s=r===void 0?void 0:i?.rooms.find(m=>x(m.id,r)),d=`${ai(o.colSpan,1)}\xD7${ai(o.rowSpan,1)}`,p=(typeof o.customLabel=="string"&&o.customLabel.trim()!==""?o.customLabel.trim():void 0)??(s?.name?.trim()?`${s.name.trim()} only`:i===void 0||(t?.floors.length??0)<=1?"Home map":L(i));return[{pageId:e,pageName:ot(l),tileId:typeof o.id=="string"?o.id:"",what:p,size:d,own:ct(n),words:Oi(n,t),look:qt(n,t).look}]})}function ri(l,t){return Object.values(l?.pages??{}).map(o=>o?.item).filter(o=>tt(o)).sort((o,n)=>ot(o).localeCompare(ot(n))).flatMap(o=>_i(o,t))}function si(l){let t=!1;if(!Array.isArray(l.pages))return;let e=l.pages.map(o=>{if(!tt(o)||!Array.isArray(o.items))return o;let n=o.items.map(a=>!tt(a)||_t(nt(a))!=="home_map"||!ct(a)?a:(t=!0,gn(a)));return{...o,items:n}});return t?{...l,pages:e}:void 0}var Ct={width:112,height:68},Ai={width:94,height:94,radius:34},Li={width:188,height:94,radius:22},Fi={width:60,height:94,radius:18},zi=1.6,Rt=class{constructor(){this.id="style";this.usesState="idle";this.busy=!1}style(t){let e=Le(t.doc);return this.turnLive===void 0?e:{...e,turn:this.turnLive}}set(t,e){t.apply(o=>fn(o,e))}rail(t){let e=this.style(t),o=t.hass?.states;return c`<div class="hme-h hme-pad">Looks</div>
      <div class="hme-looks">
        ${Mo.map(n=>{let a=n===e.look,i=de({floor:t.floor,states:o,...e,look:n,names:!1,width:Ct.width,height:Ct.height});return c`<button type="button" class="hme-look ${a?"on":""}" aria-pressed=${a?"true":"false"} @click=${()=>this.set(t,{look:n})}>
            <svg viewBox=${`0 0 ${Ct.width} ${Ct.height}`} style=${`background:${le(n,.5)}`} aria-hidden="true">${i}</svg>
            <span>${It[n].title}</span></button>`})}
      </div>
      <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`}stage(t){let e=this.style(t),o=xe.includes(e.look),n=It[e.look],{width:a,height:i}=t.stage,r=Math.min(Math.max(a/760,1),2.6),s=Math.max(a/r,1),d=Math.max(i/r,1),h=a<=0?g:de({floor:t.floor,states:t.hass?.states,...e,width:Math.max(s-48,1),height:Math.max(d-96,1),tileHeight:d,icons:t.icons});return c`<div class="hme-style-col">
      <div class="hme-stage hme-style-big ${o?"turns":""}" style=${`background:${le(e.look,r)}`}
        @pointerdown=${p=>{o&&this.turnDrag(t,p,e.turn)}}>
        <div class="hme-style-title" style=${`color:${ft(e.look)}`}><strong>${n.title}</strong><span>${n.hint}</span></div>
        <svg class="hme-svg" viewBox=${`0 0 ${s.toFixed(1)} ${d.toFixed(1)}`} role="img" aria-label=${`The floor in the ${n.title} look`}>
          <g transform="translate(24 64)">${h}</g></svg>
        ${o?c`<span class="hme-style-turn" style=${`color:${ft(e.look)}`}>Drag to turn · ${e.turn}°</span>`:g}
      </div>
      <section class="hme-card hme-style-tiles">
        ${this.face(t,e,Ai,"Watch tile 2 \xD7 2",!0)}
        ${this.face(t,e,Li,"iPhone tile 4 \xD7 2",!0)}
        ${this.face(t,e,Fi,"iPhone full map",!1)}
      </section>
    </div>`}face(t,e,o,n,a){let i=Math.min(Math.max(t.stage.width/1100,zi),2.6),r=t.hass?.states,s=a?Mn(o.width,o.height):{x:4,y:4,width:o.width-8,height:o.height-8},d=de({floor:t.floor,states:r,...e,width:s.width,height:s.height,tileHeight:a?o.height:0,icons:t.icons}),h=Je(t.floor,r),p=6*i;return c`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${o.width*i}px;height:${o.height*i}px;border-radius:${o.radius}px;background:${le(e.look,i)}`}>
        <svg viewBox=${`0 0 ${s.width} ${s.height}`} aria-hidden="true"
          style=${`left:${s.x*i}px;top:${s.y*i}px;width:${s.width*i}px;height:${s.height*i}px`}>${d}</svg>
        ${a&&o.height>90?c`<span class="hme-face-title" style=${`left:${p}px;top:${p}px;font-size:${11*i}px;color:${ft(e.look)}`}>${Ni(t.floor)}</span>`:g}
        ${a?c`<span class="hme-face-words" style=${`left:${p}px;bottom:${p}px;font-size:${10*i}px;color:${wn(e.look,h>0)}`}>${Qe(h)}</span>`:g}
      </div>
      <figcaption>${n}</figcaption>
    </figure>`}turnDrag(t,e,o){if(e.button!==0)return;let n=e.currentTarget,a=e.clientX;try{n.setPointerCapture?.(e.pointerId)}catch{}let i=s=>{let h=o+(s.clientX-a)*.5;h=((h+180)%360+360)%360-180,this.turnLive=Math.round(h),t.redraw()},r=()=>{n.removeEventListener("pointermove",i),n.removeEventListener("pointerup",r),n.removeEventListener("pointercancel",r);let s=this.turnLive;this.turnLive=void 0,s!==void 0&&s!==o?this.set(t,{turn:s}):t.redraw()};n.addEventListener("pointermove",i),n.addEventListener("pointerup",r),n.addEventListener("pointercancel",r)}overlay(){return g}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}inspector(t){let e=this.style(t),o=xe.includes(e.look),n=(a,i,r)=>c`<button type="button" class="hme-chip sel ${i?"on":""}" aria-pressed=${i?"true":"false"} @click=${r}>${a}</button>`;return c`
      ${H("Home style",c`
        <p class="hme-text">Every Home map tile starts with this look. A tile can still pick its own in its Map card.</p>
        <div class="hme-r"><span class="hme-l">Turn</span>
          <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${F(String(e.turn))} ?disabled=${!o} aria-label="Turn the model"
            style=${ve(e.turn,-180,180)}
            @input=${a=>{this.turnLive=Number(a.target.value),t.redraw()}}
            @change=${a=>{this.turnLive=void 0,this.set(t,{turn:Number(a.target.value)})}} />
          <span class="hme-val mono hme-w48">${o?`${e.turn}\xB0`:"flat"}</span></div>
        <div class="hme-r"><span class="hme-l">Room names</span>${n(e.names?"Shown":"Hidden",e.names,()=>this.set(t,{names:!e.names}))}</div>
        <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
          ${n("Lights",e.devices==="lights",()=>this.set(t,{devices:"lights"}))}
          ${n("All",e.devices==="all",()=>this.set(t,{devices:"all"}))}
          ${n("None",e.devices==="none",()=>this.set(t,{devices:"none"}))}</div></div>
        <div class="hme-r"><span class="hme-l">Furniture</span>${n(e.furniture?"Shown":"Hidden",e.furniture,()=>this.set(t,{furniture:!e.furniture}))}</div>
        <div class="hme-r"><span class="hme-l">Light glow</span>${n(e.glow?"On":"Off",e.glow,()=>this.set(t,{glow:!e.glow}))}</div>`)}

      ${H("Floors",c`
        ${t.floor.rooms.length===0?c`<p class="hme-empty-line">No rooms on this floor yet.</p>`:g}
        ${t.floor.rooms.map(a=>{let i=at(a);return c`<div class="hme-r top"><span class="hme-l">${D(a)}</span><div class="hme-chips">
            ${n(`Auto: ${Be[i]}`,a.finish===void 0,()=>t.apply(r=>Me(r,a.id,void 0)))}
            ${qe.map(r=>n(Be[r],a.finish===r,()=>t.apply(s=>Me(s,a.id,r))))}
          </div></div>`})}`,"shows in Plan, Night and Warm")}

      ${this.usesCard(t)}`}loadUses(t){let e=t.hass;this.usesState!=="idle"||e===void 0||(this.usesState="loading",et(e).then(o=>{this.summary=o,this.usesState="done",t.redraw()},()=>{this.usesState="error",t.redraw()}))}usesCard(t){if(this.loadUses(t),this.usesState!=="done")return H("Used on",c`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let e=ri(this.summary,t.doc),o=e.filter(n=>n.own);return H(`Used on ${C(e.length,"tile")}`,c`
      ${e.length===0?c`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:g}
      ${e.map(n=>this.useRow(t,n))}
      ${o.length===0?g:c`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(t,o)}}>${this.busy?"Saving\u2026":`Use the home style on all ${o.length}`}</button>`}
      ${this.message===void 0?g:c`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(t,e){return c`<div class="hme-use">
      <i style=${`background:${le(e.look,.2)}`}></i>
      <div><span>${e.pageName} · ${e.what} ${e.size}</span><small>${e.words}</small></div>
      ${t.openPage===void 0?g:c`<button type="button" class="hme-tb" @click=${()=>t.openPage?.(e.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(t,e){let o=t.hass;if(o===void 0||this.busy)return;let n=[...new Set(e.map(r=>r.pageId))];if(!await t.confirm({title:`Use the home style on ${C(e.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${n.length===1?"The page is":`The ${n.length} pages are`} saved for every watch and iPhone that shows ${n.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,t.redraw();let i=0;for(let r of n)try{let s=await So(o,"pages",r),d=si(s.document);d!==void 0&&await Io(o,"pages",r,s.revision,d)}catch{i+=1}this.busy=!1,this.message=i===0?"Done: those tiles follow the home style now.":`${C(i,"page")} could not be saved. Try again, or open ${i===1?"it":"them"} to see why.`,this.usesState="idle",t.redraw()}};function Ni(l){return l.name.trim()===""?"Home map":l.name.trim()}var Ki="Update the Wrist Assistant integration to see the home map here.",Wi="No home map yet. Scan your rooms with the Wrist Assistant app on an iPhone or iPad with LiDAR (the Pro models). The map shows here once it is saved.",Gi=4,ji=140;function Bi(l){return l.kind==="saving"?"Saving\u2026":l.kind==="error"?"Not saved":"Saved"}var Ui={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},T=class extends bo{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.onHome=void 0;this.onOpenPage=void 0;this.unsupported=!1;this.loading=!1;this.mode="arrange";this.viewKind="flat";this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,square:!0,grid:!1,measure:!1,live:!0};this.measure={};this.floorMenu=!1;this.spaceHeld=!1;this.tick=0;this.modes={arrange:new Mt,shape:new St,devices:new Et,style:new Rt};this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=g;this.onKey=e=>{if(this.dialog!==void 0||this.session===void 0)return;let o=(typeof e.composedPath=="function"?e.composedPath()[0]:void 0)??e.target;if(Tn(o)||Sn(o,e.key))return;if(e.key===" "&&!e.repeat){this.spaceHeld=!0,e.preventDefault?.();return}let n=Q(e,!1);if(n==="undo"||n==="redo"){e.preventDefault?.(),n==="undo"?this.undo():this.redo();return}let a=this.context();if(a!==void 0&&this.viewKind==="flat"&&this.modes[this.mode].keyDown?.(a,e)===!0){e.preventDefault?.();return}switch(n){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.selection=void 0;return;case"zoomIn":this.zoomBy(Ke);return;case"zoomOut":this.zoomBy(1/Ke);return;case"fit":this.fit();return}};this.onKeyUp=e=>{e.key===" "&&(this.spaceHeld=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++}willUpdate(e){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load(),this.loadPages());let o=this.baseFloor();this.needFit&&o!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let e=this.renderRoot.querySelector?.(".hme-dialog");e instanceof Element&&e!==this.focusedDialog?(this.focusedDialog=e,(e.querySelector("input")??e.querySelector(".primary"))?.focus?.(),e.querySelector("input")?.select?.()):e===null&&(this.focusedDialog=void 0);let o=this.renderRoot.querySelector?.(".hme-stage");o instanceof Element&&o!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(n=>{let a=n[n.length-1]?.contentRect;a!==void 0&&this.resizeStage(a.width,a.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(o),this.observed=o),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},ji))}async load(e=!1){let o=this.hass;if(!o||!this.capable)return;let n=++this.loadSeq;e||(this.loading=this.session===void 0,this.loadError=void 0);try{let a=await Xe(o);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:Ye(a?.doc)??null,rev:typeof a?.rev=="number"?a.rev:0})}catch(a){if(n!==this.loadSeq)return;let{code:i,message:r}=be(a);i==="unknown_command"?this.unsupported=!0:(!e||this.session===void 0)&&(this.loadError=r)}this.loading=!1}async loadPages(){let e=this.hass;if(e)try{let o=Oo(await et(e));this.pages=_o(o,"pages").map(n=>({id:n.id,name:n.name}))}catch{this.pages=[]}}show(e){let o=this.hass;if(o&&Ot(o,e),this.session===void 0)this.session=new yt(Ln(this.hassOrThrow()),e,()=>this.afterChange(),n=>{this.hass&&Ot(this.hass,n)}),this.needFit=!0;else if(!this.session.load(e))return;this.afterChange()}hassOrThrow(){let e=this.hass;if(e===void 0)throw new Error("no hass");return e}afterChange(){let e=this.session?.doc?.floors??[];e.some(o=>x(o.id,this.floorId))||(this.floorId=e[0]?.id,this.needFit=!0),kn(this.baseFloor(),this.selection)||(this.selection=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let e=this.doc?.floors??[];return e.find(o=>x(o.id,this.floorId))??e[0]}shownFloor(){let e=this.baseFloor();return e===void 0||this.previewDoc===void 0?e:this.previewDoc.floors.find(o=>x(o.id,e.id))??e}apply(e,o={}){let n=this.session;return n===void 0?!1:(this.previewDoc=void 0,n.apply(e)?(o.floorId!==void 0&&(this.floorId=o.floorId),o.select!==void 0&&(this.selection=o.select??void 0),this.afterChange(),!0):(this.tick++,!1))}preview(e){let o=this.doc;this.previewDoc=e===void 0||o===null?void 0:e(o)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(e){this.selection=e}setMode(e,o){let n=this.context();n!==void 0&&e!==this.mode&&this.modes[this.mode].leave?.(n),this.mode=e,this.viewKind="flat",o!==void 0&&(this.selection=o)}setFloor(e){let o=this.context();o!==void 0&&this.modes[this.mode].leave?.(o),this.floorId=e,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(e,o){this.toggles={...this.toggles,[e]:o},e==="measure"&&(this.measure={})}confirm(e){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"confirm",...e,done:n=>{this.dialog=void 0,o(n)}}})}ask(e){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"ask",...e,done:n=>{this.dialog=void 0,o(n)}}})}resizeStage(e,o){let n=this.stageSize.width===0;this.stageSize={width:e,height:o},(n||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:e,height:o}=this.stageSize;e<=0||(this.view=Zt(this.baseFloor(),e,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}zoomBy(e,o){this.view!==void 0&&(this.view=Jt(this.view,e,o??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let e=this.doc,o=this.shownFloor();if(e===null||o===void 0)return;let n=this.view??{scale:40,ox:0,oy:0},a=this.session;return{hass:this.hass,icons:this.icons,doc:e,floor:o,selection:this.selection,mode:this.mode,view:n,stage:this.stageSize,toggles:this.toggles,pages:this.pages??[],areas:Eo(this.hass),canUndo:a?.canUndo??!1,canRedo:a?.canRedo??!1,toScreen:i=>Pn(n,i),px:i=>i*n.scale,toPlan:(i,r)=>this.toPlan(i,r),apply:(i,r)=>this.apply(i,r),preview:i=>this.preview(i),select:i=>this.select(i),setMode:(i,r)=>this.setMode(i,r),setFloor:i=>this.setFloor(i),setToggle:(i,r)=>this.setToggle(i,r),drag:(i,r)=>this.drag(i,r),undo:()=>this.undo(),redo:()=>this.redo(),confirm:i=>this.confirm(i),ask:i=>this.ask(i),newId:()=>At(),note:(i,r)=>{this.session!==void 0&&(this.session.note={kind:i,text:r}),this.tick++},redraw:()=>{this.tick++},openPage:this.onOpenPage}}toPlan(e,o){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return gt(this.view??{scale:40,ox:0,oy:0},[e-n.left,o-n.top])}stagePoint(e){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[e.clientX-o.left,e.clientY-o.top]}drag(e,o){let n=this.stageEl;if(n===void 0)return;this.endDrag?.();let a=e.clientX,i=e.clientY,r=!1,s,d=0,h=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,p=()=>{d=0,s!==void 0&&o.move(this.toPlan(s.clientX,s.clientY),s)};try{n.setPointerCapture?.(e.pointerId)}catch{}let m=v=>{let w=v;w.pointerId===e.pointerId&&(!r&&Math.hypot(w.clientX-a,w.clientY-i)<Gi||(r=!0,s=w,h===void 0?p():d===0&&(d=h(p))))},u=v=>{let w=v;w.pointerId===e.pointerId&&(f(),d!==0&&(cancelAnimationFrame(d),p()),o.end(this.toPlan(w.clientX,w.clientY),w,r))},f=()=>{n.removeEventListener("pointermove",m),n.removeEventListener("pointerup",u),n.removeEventListener("pointercancel",u);try{n.releasePointerCapture?.(e.pointerId)}catch{}this.endDrag===f&&(this.endDrag=void 0)};n.addEventListener("pointermove",m),n.addEventListener("pointerup",u),n.addEventListener("pointercancel",u),this.endDrag=f}onStageDown(e){if(this.stageEl=e.currentTarget,this.floorMenu=!1,this.dialog!==void 0)return;if(e.pointerType==="touch"&&(this.touches.set(e.pointerId,[e.clientX,e.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(e);return}if(e.button===1||this.spaceHeld){e.preventDefault?.(),this.pan(e,!1);return}if(e.button!==0)return;let o=this.context();if(o===void 0)return;if(this.toggles.measure){let a=this.toPlan(e.clientX,e.clientY),i=this.measure;this.measure=i.a===void 0||i.b!==void 0?{a}:{a:i.a,b:a};return}let n=this.toPlan(e.clientX,e.clientY);if(this.modes[this.mode].pointerDown?.(o,e,n)===!0){e.preventDefault?.();return}this.pan(e,!0)}onStageMove(e){if(this.stageEl=e.currentTarget,this.touches.has(e.pointerId)&&this.touches.set(e.pointerId,[e.clientX,e.clientY]),e.buttons!==0||this.viewKind==="model")return;let o=this.toPlan(e.clientX,e.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:o});let n=this.context();n!==void 0&&this.modes[this.mode].hover?.(n,o)}onStageLeave(){let e=this.context();e!==void 0&&this.modes[this.mode].hover?.(e,void 0)}onStageUp(e){this.touches.delete(e.pointerId)}onStageDrag(e){this.stageEl=e.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||this.dialog!==void 0||this.modes[this.mode].dragOver?.(o,this.toPlan(e.clientX,e.clientY),e)===!0&&(e.preventDefault?.(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy"))}onStageDragLeave(e){let o=e.relatedTarget,n=e.currentTarget;if(o!==null&&n!==null&&typeof n.contains=="function"&&n.contains(o))return;let a=this.context();a!==void 0&&this.modes[this.mode].dragOver?.(a,void 0,e)}onStageDrop(e){this.stageEl=e.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||(e.preventDefault?.(),this.modes[this.mode].drop?.(o,this.toPlan(e.clientX,e.clientY),e))}pan(e,o){let n=this.view;if(n===void 0)return;let a=e.clientX,i=e.clientY;this.drag(e,{move:(r,s)=>{this.view={...n,ox:n.ox+s.clientX-a,oy:n.oy+s.clientY-i},this.userMoved=!0},end:(r,s,d)=>{!d&&o&&(this.selection=void 0)}})}pinch(){let e=this.stageEl,o=this.view,n=[...this.touches.keys()];if(e===void 0||o===void 0||n.length<2)return;let a=()=>n.map(u=>this.touches.get(u)),[i,r]=a(),s=Math.max(Math.hypot(r[0]-i[0],r[1]-i[1]),1),d=e.getBoundingClientRect(),h=[(i[0]+r[0])/2-d.left,(i[1]+r[1])/2-d.top],p=u=>{let f=u;if(!this.touches.has(f.pointerId))return;this.touches.set(f.pointerId,[f.clientX,f.clientY]);let[v,w]=a(),k=Math.max(Math.hypot(w[0]-v[0],w[1]-v[1]),1),M=[(v[0]+w[0])/2-d.left,(v[1]+w[1])/2-d.top],S=Jt(o,k/s,h);this.view={...S,ox:S.ox+M[0]-h[0],oy:S.oy+M[1]-h[1]},this.userMoved=!0},m=u=>{this.touches.delete(u.pointerId),e.removeEventListener("pointermove",p),e.removeEventListener("pointerup",m),e.removeEventListener("pointercancel",m)};e.addEventListener("pointermove",p),e.addEventListener("pointerup",m),e.addEventListener("pointercancel",m)}turnModel(e){let o=this.modelTurnNow(),n=e.clientX;this.drag(e,{move:(a,i)=>{let r=o+(i.clientX-n)*.5;r=((r+180)%360+360)%360-180,this.modelTurn=Math.round(r)},end:()=>{}})}modelTurnNow(){return this.modelTurn??Le(this.doc).turn??yn}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let e=Le(this.doc).look;return xe.includes(e)?e:"night"}onWheel(e){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=e.currentTarget,e.preventDefault?.();let o=e.deltaMode===1?16:e.deltaMode===2?400:1;if(e.ctrlKey||e.metaKey){this.zoomBy(Math.exp(-e.deltaY*o*.0025),this.stagePoint(e));return}this.view={...this.view,ox:this.view.ox-e.deltaX*o,oy:this.view.oy-e.deltaY*o},this.userMoved=!0}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(c`<b>${Ki}</b>`);if(this.loadError!==void 0)return this.calm(c`<span>Could not read the home map: ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(c`Loading…`);let e=this.doc;if(e===null||e.floors.length===0)return this.calm(c`<b>${Wi}</b>`);let o=this.context(),n=this.modes[this.mode],a=this.session.note;return c`<div class="hme">
      ${this.renderBar(e,o)}
      ${a===void 0?g:c`<div class="hme-note ${a.kind}" role="status"><span>${a.text}</span>
        <button class="hme-link" @click=${()=>this.session?.dismissNote()}>Dismiss</button></div>`}
      <div class="hme-body">
        <aside class="hme-rail" aria-label="${Yt[this.mode]} tools">${n.rail(o)}</aside>
        <section class="hme-stage-wrap">${n.stage?.(o)??this.renderStage(o,n)}</section>
        <aside class="hme-insp" aria-label="Inspector">${n.inspector(o)}</aside>
      </div>
      ${this.renderDialog()}
    </div>`}calm(e){return c`<div class="hme-calm"><div class="hme-empty">${e}</div></div>`}renderBar(e,o){let n=this.baseFloor(),a=this.session?.state??{kind:"saved"},i=Qt();return c`<header class="hme-bar">
      ${this.onHome===void 0?g:c`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Home</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">BETA</span>
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${ro(n)}
          <span class="hme-floor-t"><span>${L(n)}</span><small>${C(n.rooms.length,"room")} · ${C(n.pins.length,"device")}</small></span>
          <span class="hme-caret" aria-hidden="true">▾</span>
        </button>
        ${this.floorMenu?this.renderFloorMenu(e,n):g}
      </div>
      <span class="hme-flex"></span>
      <div class="hme-seg" role="tablist" aria-label="Edit mode">
        ${$n.map(r=>c`<button type="button" role="tab" class=${r===this.mode?"on":""} aria-selected=${r===this.mode?"true":"false"}
          @click=${()=>this.setMode(r)}>${Yt[r]}</button>`)}
      </div>
      <span class="hme-flex"></span>
      ${this.modes[this.mode].stage!==void 0?g:c`<div class="hme-seg" role="group" aria-label="View">
        <button type="button" class=${this.viewKind==="flat"?"on":""} aria-pressed=${this.viewKind==="flat"?"true":"false"} @click=${()=>{this.viewKind="flat"}}>Flat</button>
        <button type="button" class=${this.viewKind==="model"?"on":""} aria-pressed=${this.viewKind==="model"?"true":"false"} @click=${()=>{this.viewKind="model"}}>Model</button>
      </div>`}
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${i?"\u2318Z":"Ctrl+Z"})`} ?disabled=${!o.canUndo} @click=${()=>this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${i?"\u21E7\u2318Z":"Ctrl+Shift+Z"})`} ?disabled=${!o.canRedo} @click=${()=>this.redo()}>↷</button>
      <span class="hme-status ${a.kind}" role="status" title=${a.kind==="error"?a.text:g}><span class="hme-status-dot"></span>${Bi(a)}</span>
    </header>`}renderFloorMenu(e,o){return c`<div class="hme-pop" role="menu" aria-label="Floors">
      ${e.floors.map(n=>c`<div class="hme-pop-row ${x(n.id,o.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(n.id)}>
          ${ro(n)}<span class="hme-floor-t"><span>${L(n)}</span><small>${C(n.rooms.length,"room")} · ${C(n.pins.length,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${L(n)}`} @click=${()=>{this.renameFloorAsk(n)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${e.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${L(n)}`}
          ?disabled=${e.floors.length===1} @click=${()=>{this.deleteFloorAsk(n)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let e=this.doc;if(e===null)return;let o=Math.max(...e.floors.map(i=>i.story))+1,n=await this.ask({title:"Add a floor",label:"Name",value:o===1?"Upstairs":`Floor ${o+1}`,ok:"Add floor"});if(n===void 0)return;let a=At();this.apply(i=>Bo(i,{id:a,name:n,story:o}),{floorId:a,select:null})&&(this.needFit=!0)}async renameFloorAsk(e){this.floorMenu=!1;let o=await this.ask({title:"Rename floor",label:"Name",value:e.name||L(e),ok:"Rename"});o!==void 0&&this.apply(n=>rt(n,e.id,o))}async deleteFloorAsk(e){this.floorMenu=!1,await this.confirm({title:`Delete ${L(e)}?`,text:`Its ${C(e.rooms.length,"room")} and ${C(e.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(n=>Uo(n,e.id),{select:null})}renderStage(e,o){let{width:n,height:a}=this.stageSize,i=this.viewKind==="model",r=i?g:o.pill?.(e)??g,s=this.spaceHeld?"grab":i?"ew-resize":this.toggles.measure?"crosshair":o.cursor?.(e)??"default",d=e.floor.rooms.length===0;return c`<div class="hme-stage ${i?"model":""}" style=${i?`background:${le(this.modelLookNow())}`:""}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(a,1)}`} style=${`cursor:${s}`}
        role="img" aria-label=${`Plan of ${L(e.floor)}`}
        @pointerdown=${h=>this.onStageDown(h)}
        @pointermove=${h=>this.onStageMove(h)}
        @pointerup=${h=>this.onStageUp(h)}
        @pointercancel=${h=>this.onStageUp(h)}
        @pointerleave=${()=>this.onStageLeave()}
        @wheel=${h=>this.onWheel(h)}
        @dragover=${h=>this.onStageDrag(h)}
        @dragleave=${h=>this.onStageDragLeave(h)}
        @drop=${h=>this.onStageDrop(h)}>
        ${i?this.renderModel(e,n,a):this.renderPlan(e,o,n,a)}
      </svg>
      ${r===g?g:c`<div class="hme-pill">${r}</div>`}
      ${i?g:o.stageExtra?.(e)??g}
      ${d&&!i?c`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{this.setMode("arrange");let h=this.context();h&&this.modes.arrange.draw.start(h)}}>＋ Draw a room by hand</button></div>`:g}
      ${this.renderDock(e,o)}
    </div>`}renderPlan(e,o,n,a){let i=this.view;if(i===void 0||n<=0)return g;let r=this.planArt(e.floor,n,a,o.drawsPins===!0?"none":"all"),s=i.scale/(this.artScale||i.scale);return b`${this.background(i,n,a)}
      <g class="hme-art" transform=${`translate(${i.ox.toFixed(2)} ${i.oy.toFixed(2)}) scale(${s.toFixed(5)})`} pointer-events="none">${r}</g>
      <g class="hme-labels" pointer-events="none">${this.labels(e)}</g>
      <g class="hme-overlay">${o.overlay(e)}</g>
      ${this.toggles.measure?this.measureMarks(e):g}`}planArt(e,o,n,a){let i=this.toggles.live?this.hass?.states:void 0,r=this.artScale||this.view.scale,s=`${Xi(e)}|${go(i)}|${r}|${o}|${n}|${this.iconsTick}|${go(this.icons)}|${a}`;return s!==this.artKey&&(this.artKey=s,this.artHeld=de({floor:e,states:i,look:"plan",names:!1,devices:a,furniture:!0,glow:!0,width:o,height:n,icons:this.icons,frame:{scale:r,ox:0,oy:0}})),this.artHeld}background(e,o,n){let a=this.mode==="shape"?.05:.1,i=20;if(this.toggles.grid)for(i=a*e.scale;i<8;)i*=10;let r=(e.ox%i+i)%i,s=(e.oy%i+i)%i;return b`<defs><pattern id="hme-bg" width=${i} height=${i} patternUnits="userSpaceOnUse" patternTransform=${`translate(${r.toFixed(1)} ${s.toFixed(1)})`}>
        ${this.toggles.grid?b`<path d=${`M${i} 0V${i}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:b`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${o} height=${n} fill="url(#hme-bg)" />`}labels(e){return e.floor.rooms.map(o=>{let n=B(o),a=ie(o.outline);if(n===void 0||a===void 0)return g;let i=D(o),r=We(o),s=(a.maxX-a.minX)*e.view.scale,d=(a.maxY-a.minY)*e.view.scale,h=i.length*7.4+22;if(h>s*.95||d<26)return g;let p=Math.max(h,r.length*5.8+22)<=s*.95&&d>=48,m=p?Math.max(h,r.length*5.8+22):h,u=p?36:22,[f,v]=e.toScreen(n);return b`<g class="hme-label"><rect x=${(f-m/2).toFixed(1)} y=${(v-u/2).toFixed(1)} width=${m.toFixed(1)} height=${u} rx=${p?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${f.toFixed(1)} y=${(v+(p?-3:4.5)).toFixed(1)} fill="#fff" font-size=${p?13:12} font-weight="600" text-anchor="middle">${i}</text>
        ${p?b`<text x=${f.toFixed(1)} y=${(v+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${r}</text>`:g}</g>`})}measureMarks(e){let o=this.measure;if(o.a===void 0)return b`<g class="hme-measure"></g>`;let n=o.b??o.hover,a=e.toScreen(o.a);if(n===void 0)return b`<g class="hme-measure" pointer-events="none"><circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" /></g>`;let i=e.toScreen(n),r=Math.hypot(n[0]-o.a[0],n[1]-o.a[1]),s=[(a[0]+i[0])/2,(a[1]+i[1])/2];return b`<g class="hme-measure" pointer-events="none">
      <line x1=${a[0]} y1=${a[1]} x2=${i[0]} y2=${i[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${o.b===void 0?"6 4":"none"} />
      <circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" /><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(s[0]-32).toFixed(1)} y=${(s[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${s[0].toFixed(1)} y=${(s[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${r.toFixed(2)} m</text></g></g>`}renderModel(e,o,n){return o<=0?g:de({floor:e.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:o,height:n})}renderDock(e,o){let n=c`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
      title="Draw what Home Assistant's devices are doing now" @click=${()=>this.setToggle("live",!this.toggles.live)}><span class="hme-live-dot"></span>Live states</button>`;if(this.viewKind==="model"){let r=this.modelLookNow();return c`<div class="hme-dock">
        ${xe.map(s=>c`<button type="button" class="hme-tb ${s===r?"on":""}" aria-pressed=${s===r?"true":"false"} @click=${()=>{this.modelLook=s}}>${Ui[s]}</button>`)}
        <span class="hme-vsep"></span>
        <button type="button" class="hme-tb" title="Back to the home style's turn" @click=${()=>{this.modelTurn=void 0}}>⟲ Turn back</button>
        <span class="hme-vsep"></span>${n}
      </div>`}let a=this.stageSize.width>0?Zt(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,i=this.view===void 0||a===void 0?100:En(this.view,a);return c`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" @click=${()=>this.zoomBy(1/Ke)}>−</button>
      <span class="hme-zoom mono">${i}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" @click=${()=>this.zoomBy(Ke)}>＋</button>
      <button type="button" class="hme-tb" @click=${()=>this.fit()}>Fit</button>
      <span class="hme-vsep"></span>
      ${o.dock?.(e)??g}
      <button type="button" class="hme-tb ${this.toggles.measure?"on":""}" aria-pressed=${this.toggles.measure?"true":"false"}
        title="Click two points to measure between them" @click=${()=>this.setToggle("measure",!this.toggles.measure)}>Measure</button>
      <span class="hme-vsep"></span>${n}
    </div>`}renderDialog(){let e=this.dialog;if(e===void 0)return g;let o=()=>e.kind==="confirm"?e.done(!1):e.done(void 0),n=a=>{e.kind==="confirm"?e.done(!0):e.done((a?.querySelector("input")?.value??e.value).trim()||e.value)};return c`<div class="hme-scrim" @pointerdown=${a=>{a.target===a.currentTarget&&o()}}>
      <div class="hme-dialog" role="dialog" aria-modal="true" aria-label=${e.title}
        @keydown=${a=>{a.key==="Escape"&&(a.stopPropagation(),o()),a.key==="Enter"&&(a.preventDefault(),n(a.currentTarget))}}>
        <h3>${e.title}</h3>
        ${e.kind==="confirm"?e.text===void 0?g:c`<p>${e.text}</p>`:c`<label class="hme-dialog-field"><span>${e.label}</span><input type="text" maxlength="100" .value=${e.value} autofocus /></label>`}
        <div class="hme-dialog-row">
          <button type="button" class="hme-tb" @click=${o}>Cancel</button>
          <button type="button" class="hme-tb primary ${e.kind==="confirm"&&e.danger===!0?"danger-fill":""}"
            @click=${a=>n(a.currentTarget.closest(".hme-dialog"))}>${e.ok}</button>
        </div>
      </div>
    </div>`}static{this.styles=[To,wo,Kn]}};I([q({attribute:!1})],T.prototype,"hass",2),I([q({type:Boolean,reflect:!0})],T.prototype,"narrow",2),I([q({attribute:!1})],T.prototype,"icons",2),I([q({attribute:!1})],T.prototype,"iconsTick",2),I([q({attribute:!1})],T.prototype,"capable",2),I([q({attribute:!1})],T.prototype,"onHome",2),I([q({attribute:!1})],T.prototype,"onOpenPage",2),I([O()],T.prototype,"unsupported",2),I([O()],T.prototype,"loading",2),I([O()],T.prototype,"loadError",2),I([O()],T.prototype,"floorId",2),I([O()],T.prototype,"selection",2),I([O()],T.prototype,"mode",2),I([O()],T.prototype,"viewKind",2),I([O()],T.prototype,"view",2),I([O()],T.prototype,"artScale",2),I([O()],T.prototype,"stageSize",2),I([O()],T.prototype,"toggles",2),I([O()],T.prototype,"measure",2),I([O()],T.prototype,"floorMenu",2),I([O()],T.prototype,"dialog",2),I([O()],T.prototype,"modelLook",2),I([O()],T.prototype,"modelTurn",2),I([O()],T.prototype,"pages",2),I([O()],T.prototype,"spaceHeld",2),I([O()],T.prototype,"tick",2);var li=new WeakMap,Vi=1;function go(l){if(l===void 0)return 0;let t=li.get(l);return t===void 0&&li.set(l,t=Vi++),t}var Xi=l=>go(l);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",T);export{Gi as HOME_MAP_DRAG_SLOP,Wi as HOME_MAP_EMPTY_TEXT,Ki as HOME_MAP_UPDATE_TEXT,T as WaHomeMapEditor,Bi as homeMapSaveWords};
