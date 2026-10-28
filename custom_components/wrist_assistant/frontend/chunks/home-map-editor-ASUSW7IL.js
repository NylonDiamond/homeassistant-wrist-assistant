import{a as ei}from"./chunk-ASRBOGLW.js";import{a as It,b as bn,c as yn,d as ti}from"./chunk-V5372P2E.js";import"./chunk-226RA3L7.js";import{$ as Ve,A as Ee,Aa as ue,B as ln,Ba as Ze,C as Ue,Ca as Je,D as Io,Da as Qe,E as Ro,Ea as ni,F as qe,Fa as Re,G as Te,Ga as wn,H as kt,Ha as ie,I as Do,Ia as Dt,J as Xe,Ja as oi,K as ce,Ka as ii,L as pn,La as fe,M as Oo,N as _o,O as xt,P as Se,Q as Ao,R as Fo,S as hn,T as ne,U as Ht,V as Pt,W as Lo,X as mn,Y as zo,Z as Et,_ as cn,a as xe,aa as Tt,b as W,ba as No,c as He,ca as jo,d as me,da as Ko,e as go,ea as Go,f as vo,fa as Bo,g as bo,ga as Wo,h as yo,ha as un,i as Ke,ia as oe,j as Ge,ja as Ce,k as wo,ka as Uo,l as Be,la as qo,m as $o,ma as fn,n as Mo,na as Ye,o as Mt,oa as St,p as ko,pa as gn,q as dn,qa as Xo,r as xo,ra as Vo,s as Ho,sa as Yo,t as Po,ta as Zo,u as Eo,ua as Ie,v as Pe,va as vn,w as We,wa as Ct,x as To,xa as Jo,y as So,ya as Qo,z as Co,za as Rt}from"./chunk-ZUNQZBTK.js";import"./chunk-7T6IEW6M.js";import{A as rn,D as $t,F as uo,H as fo,I as he,P as sn,a as le,e as tn,m as nn,n as pe,o as je,p as X,q as V,r as on,s as an,t as co,v as yt,w as wt}from"./chunk-E7P6Y7VD.js";import{c as ft,j as ao,k as ro,na as ho,oa as mo}from"./chunk-5H6OWAXC.js";import"./chunk-J2WKPEGJ.js";import{b as en}from"./chunk-S3NOJWAC.js";import{j as oo,p as Jt,q as j}from"./chunk-MW4O36NF.js";import{i as gt,l as so,m as lo,n as vt,r as bt,s as Qt,t as po}from"./chunk-CPEKF3CW.js";import{A as L,B as C,C as mt,D as J,E as de,G as Qn,I as te,J as eo,K as ct,L as ut,R as to,S as no,T as K,b as Vn,d as pt,e as Yn,h as ze,i as Zn,t as Ne,u as ht,w as Jn,x as k}from"./chunk-FXLBN2PU.js";import{$g as lt,Fh as ke,Nh as io,ah as qn,b as Wn,d as m,e as M,g as v,hg as Zt,j as Un,k as Z,l as A,wh as Xn}from"./chunk-7M7K7CM3.js";import{db as Me}from"./chunk-OM34V22N.js";import{a as S}from"./chunk-LO2NM3CE.js";var ai=["arrange","shape","devices","style"],$n={arrange:"Arrange",shape:"Shape",devices:"Devices",style:"Style"};function ge(d){return d===void 0||d.kind==="pin"||d.kind==="pins"?void 0:d.roomId}function ri(d,e){if(e===void 0)return!0;if(d===void 0)return!1;if(e.kind==="pin")return d.pins.some(n=>k(n.id,e.pinId));if(e.kind==="pins")return e.pinIds.every(n=>d.pins.some(o=>k(o.id,n)));let t=d.rooms.find(n=>k(n.id,e.roomId));if(t===void 0)return!1;switch(e.kind){case"room":return!0;case"wall":return W(t)[e.wall]!==void 0;case"corner":return t.outline[e.corner]!==void 0;case"opening":return t.openings[e.opening]!==void 0;case"object":return t.objects[e.object]!==void 0}}var si=4,di=2400;function li(d,e){return[d.ox+e[0]*d.scale,d.oy+e[1]*d.scale]}function De(d,e){return[(e[0]-d.ox)/d.scale,(e[1]-d.oy)/d.scale]}function Mn(d,e,t,n=56,o=96){let a=d===void 0||d.rooms.length===0&&d.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:mt(d),r=Math.max(a.maxX-a.minX,1),s=Math.max(a.maxY-a.minY,1),l=fi(Math.min(Math.max(e-n*2,40)/r,Math.max(t-o*2,40)/s),si,di);return{scale:l,ox:e/2-(a.minX+a.maxX)/2*l,oy:t/2-(a.minY+a.maxY)/2*l}}function kn(d,e,t){let n=fi(d.scale*e,si,di),o=n/d.scale;return{scale:n,ox:t[0]-(t[0]-d.ox)*o,oy:t[1]-(t[1]-d.oy)*o}}function pi(d,e){return Math.round(d.scale/e.scale*100)}var et=1.25;function hi(d){if(typeof d!="object"||d===null)return;let e=d;return{tag:typeof e.tagName=="string"?e.tagName.toUpperCase():"",type:typeof e.type=="string"?e.type.toLowerCase():"text",editable:e.isContentEditable===!0}}var mi=["button","submit","reset","image"],qi=["checkbox","radio","range","color","file"];function xn(d){let e=hi(d);return e===void 0?!1:e.editable||e.tag==="TEXTAREA"?!0:e.tag==="INPUT"&&!mi.includes(e.type)&&!qi.includes(e.type)}function ci(d){let e=hi(d);return e===void 0?!1:xn(d)||e.tag==="SELECT"?!0:e.tag==="INPUT"&&!mi.includes(e.type)}function ae(d,e){if(e)return;let t=d.metaKey===!0||d.ctrlKey===!0,n=d.key.length===1?d.key.toLowerCase():d.key;if(t)return n==="z"?d.shiftKey===!0?"redo":"undo":n==="y"?"redo":void 0;if(d.altKey===!0)return;switch(n){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit"}let o=d.shiftKey===!0?.1:.01;if(n==="ArrowLeft")return{nudge:[-o,0]};if(n==="ArrowRight")return{nudge:[o,0]};if(n==="ArrowUp")return{nudge:[0,-o]};if(n==="ArrowDown")return{nudge:[0,o]};if(/^[a-z]$/.test(n)&&d.shiftKey!==!0)return{letter:n}}function Hn(){let d=globalThis.navigator,e=`${typeof d?.platform=="string"?d.platform:""} ${typeof d?.userAgent=="string"?d.userAgent:""}`;return/Mac|iPhone|iPad/.test(e)}function ui(){return Hn()?"\u2318Z":"Ctrl+Z"}var fi=(d,e,t)=>Math.min(Math.max(d,e),t);function Pn(d,e=2){return`${(Math.round(d*10**e)/10**e).toFixed(e)} m`}function tt(d,e=2){let t=(Math.round(d*10**e)/10**e).toFixed(e);return/^-0(\.0*)?$/.test(t)?t.slice(1):t}function En(d){let e=d.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(e===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(e))return;let t=Number(e);if(Number.isFinite(t))return/cm$/i.test(d.trim())?t/100:t}function Ot(d){if(d.outline.length<3)return{width:0,depth:0,area:0};let{a0:e,a1:t,c0:n,c1:o}=rn(d,nn(d));return{width:t-e,depth:o-n,area:Math.abs($t(d.outline))}}function nt(d){let{width:e,depth:t}=Ot(d);return`${e.toFixed(1)} \xD7 ${t.toFixed(1)} m`}function gi(d){if(d.outline.length<3)return d.outline.slice();let{a0:e,a1:t,c0:n,c1:o,point:i}=rn(d,nn(d));return[i(e,n),i(t,n),i(t,o),i(e,o)]}function Xi(d,e){let t=W(d)[e];if(t===void 0)return"inner";let n=Math.max(Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),1e-9),o=-(t.b[1]-t.a[1])/n,i=(t.b[0]-t.a[0])/n,a=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],r=Math.max(t.t,.1)+.1,s=je(d.outline,[a[0]+o*r,a[1]+i*r]),l=je(d.outline,[a[0]-o*r,a[1]-i*r]);if(s&&l)return"inner";if(s)o=-o,i=-i;else if(!l){let h=X(d);h!==void 0&&(h[0]-a[0])*o+(h[1]-a[1])*i>0&&(o=-o,i=-i)}return Math.abs(o)>Math.abs(i)?o>0?"right":"left":i>0?"bottom":"top"}function Tn(d,e,t){let n=Xi(d,e);return`${t}, ${n} wall`}function ve(d){return d.kind==="opening"?"Way through":d.kind==="window"?d.style==="sliding"?"Sliding window":"Window":d.style==="double"?"Double door":d.style==="sliding"?"Sliding door":"Door"}var Vi={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function ot(d){let e=Vi[d];if(e!==void 0)return e;let t=d.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}function I(d,e,t=`${e}s`){return`${d} ${d===1?e:t}`}function H(d,e,t,n=""){return m`<section class="hme-card ${n}">
    <div class="hme-h">${d}${t===void 0?v:m`<span class="hme-h-end">${t}</span>`}</div>
    ${e}
  </section>`}function O(d,...e){return m`<div class="hme-r"><span class="hme-l">${d}</span>${e}</div>`}function B(d){return m`<p class="hme-hint">${d}</p>`}var vi=3;function Yi(d,e){return d==="\xB0"?1:10**-e}function R(d){let e=d.digits??2,t=d.step??Yi(d.unit,e),n=d.value===void 0?"":tt(d.value,e),o=s=>Math.min(Math.max(s,d.min??-1/0),d.max??1/0),i=s=>tt(s,e)===n,a=s=>{let l=En(s.value);if(l===void 0||d.min!==void 0&&l<d.min||d.max!==void 0&&l>d.max||i(l)){s.value=n;return}d.set(l)},r=s=>{let l=s.currentTarget,h=l.querySelector("input");if(h===null||d.disabled===!0||s.button!==0||h.matches(":focus"))return;s.preventDefault();let p=d.value,c=s.clientX,f=!1,u=p;try{l.setPointerCapture(s.pointerId)}catch{}let g=b=>{if(p===void 0)return;let w=b.clientX-c;if(!f&&Math.abs(w)<vi)return;f||l.classList.add("scrubbing"),f=!0;let P=b.shiftKey?10:b.altKey?.1:1;u=o(Number((p+(w-Math.sign(w)*vi)*t*P).toFixed(e+(b.altKey?1:0)))),h.value=tt(u,e),d.preview?.(u)},y=b=>{if(l.removeEventListener("pointermove",g),l.removeEventListener("pointerup",y),l.removeEventListener("pointercancel",y),l.classList.remove("scrubbing"),!f){h.focus(),h.select();return}d.preview?.(void 0),b.type!=="pointercancel"&&u!==void 0&&!i(u)?d.set(u):h.value=n};l.addEventListener("pointermove",g),l.addEventListener("pointerup",y),l.addEventListener("pointercancel",y)};return m`<span class="hme-in hme-num ${d.disabled===!0?"off":""}" style=${d.width===void 0?v:`flex:0 0 ${d.width}`}
    title=${d.disabled===!0?v:"Drag sideways to change it, click to type"} @pointerdown=${r}>
    ${d.tag===void 0?v:m`<span class="hme-ntag" aria-hidden="true">${d.tag}</span>`}
    <input type="text" inputmode="decimal" aria-label=${d.label} .value=${j(n)} ?disabled=${d.disabled===!0}
      placeholder=${d.value===void 0?"Mixed":""}
      @change=${s=>a(s.target)}
      @keydown=${s=>{let l=s.target;if(s.key==="Enter"&&l.blur(),s.key==="Escape"&&(l.value=n,l.blur()),(s.key==="ArrowUp"||s.key==="ArrowDown")&&d.value!==void 0){s.preventDefault();let h=En(l.value)??d.value,p=o(Number((h+(s.key==="ArrowUp"?1:-1)*t*(s.shiftKey?10:1)).toFixed(e)));l.value=tt(p,e),i(p)||d.set(p)}}} />${d.unit===void 0?v:m`<span class="hme-unit">${d.unit}</span>`}</span>`}function it(...d){return m`<div class="hme-fields" style=${`--n:${d.length}`}>${d}</div>`}function at(d,...e){return m`<div class="hme-group"><div class="hme-gl">${d}</div>${e}</div>`}function rt(d){return m`<span class="hme-in"><input type="text" aria-label=${d.label} maxlength=${d.max??100} placeholder=${d.placeholder??""}
    .value=${j(d.value)}
    @change=${e=>{let t=e.target.value;t.trim()!==d.value.trim()&&d.set(t)}}
    @keydown=${e=>{e.key==="Enter"&&e.target.blur()}} /></span>`}function be(d){return m`<span class="hme-in hme-sel ${d.cls??""}"><select aria-label=${d.label} @change=${e=>d.set(e.target.value)}>
    ${d.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0} .selected=${j(e.value===d.value)}>${e.label}</option>`)}
  </select></span>`}function Sn(d){return m`<span class="hme-menu ${d.cls??""}"><select aria-label=${d.label} @change=${e=>{let t=e.target,n=t.value;t.value="",n!==""&&d.pick(n)}}>
    <option value="" .selected=${j(!0)}>${d.label}</option>
    ${d.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0}>${e.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function U(d){return m`<button type="button" class="hme-pic ${d.on?"on":""}" aria-pressed=${d.on?"true":"false"} title=${d.title??d.label}
    @click=${d.click}>${d.picture}<span>${d.label}</span></button>`}function Oe(d){return m`<button type="button" class="hme-chip ${d.on?"":"off"}" aria-pressed=${d.on?"true":"false"} aria-label=${d.label}
    @click=${d.click}>${d.on?d.onText:d.offText}</button>`}var Zi={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},Cn={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function In(d){return m`<span class="hme-sw" style=${`background:${Zi[d]}`}></span>`}var bi=d=>d.map(([e,t])=>`${Math.round(e*10)/10},${Math.round(t*10)/10}`).join(" ");function Rn(d,e=34,t=24){let n=d?.rooms??[];if(n.length===0)return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
      <rect x="1" y="1" width=${e-2} height=${t-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let o=mt(d),i=4,a=Math.min((e-i*2)/Math.max(o.maxX-o.minX,.5),(t-i*2)/Math.max(o.maxY-o.minY,.5)),r=e/2-(o.minX+o.maxX)/2*a,s=t/2-(o.minY+o.maxY)/2*a;return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${e-1} height=${t-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${n.map(l=>M`<polygon points=${bi(l.outline.map(([h,p])=>[r+h*a,s+p*a]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function yi(d,e,t=76,n=54){let o=d.outline.map(g=>g[0]),i=d.outline.map(g=>g[1]),a=Math.min(...o),r=Math.max(...o),s=Math.min(...i),l=Math.max(...i),h=8,p=Math.min((t-h*2)/Math.max(r-a,.5),(n-h*2)/Math.max(l-s,.5)),c=t/2-(a+r)/2*p,f=n/2-(s+l)/2*p,u=bi(d.outline.map(([g,y])=>[c+g*p,f+y*p]));return m`<svg class="hme-room-thumb" width=${t} height=${n} viewBox=${`0 0 ${t} ${n}`} aria-hidden="true">
    <rect width=${t} height=${n} rx="8" fill="#121010" />
    <polygon points=${u} fill=${Cn[yt(d)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${e?M`<circle cx=${t*.58} cy=${n*.42} r=${Math.min(t,n)*.22} fill="#ffb648" opacity="0.35" />`:v}
  </svg>`}function $i(d){return{get:()=>lt(d),save:(e,t)=>qn(d,e,t)}}var Mi="The map had changed on another device. Your change was saved on top of it.",Ji="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",Qi="The map changed again while saving, so your change was not saved. Try it once more.";function ea(d){return{doc:ht(d?.doc)??null,rev:typeof d?.rev=="number"?d.rev:0}}function wi(d,e){let t=typeof e=="function"?e(d):to(d,e);if(t===void 0)return;let n=Ne(t);return n.ok?{doc:n.doc}:{text:`Not saved. ${n.message}.`}}async function ki(d,e,t){if(e.doc===null)return{ok:!1,text:"There is no map to change yet."};let n=wi(e.doc,t);if(n===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in n)return{ok:!1,text:n.text};try{let a=await d.save(n.doc,e.rev);return{ok:!0,read:{doc:n.doc,rev:a.rev},merged:!1}}catch(a){let{code:r,message:s}=Me(a);if(r!=="conflict")return{ok:!1,text:`Not saved. ${s}`}}let o;try{o=ea(await d.get())}catch(a){return{ok:!1,text:`Not saved. The map changed on another device and could not be read again: ${Me(a).message}`}}let i=o.doc===null?void 0:wi(o.doc,t);if(i===void 0)return{ok:!1,text:Ji,read:o};if("text"in i)return{ok:!1,text:i.text,read:o};try{let a=await d.save(i.doc,o.rev);return{ok:!0,read:{doc:i.doc,rev:a.rev},merged:!0}}catch(a){let{code:r,message:s}=Me(a);return{ok:!1,text:r==="conflict"?Qi:`Not saved. ${s}`,read:o}}}function _t(d){return Array.isArray(d)?`[${d.map(_t).join(",")}]`:typeof d=="object"&&d!==null?`{${Object.entries(d).filter(([,t])=>t!==void 0).sort(([t],[n])=>t<n?-1:t>n?1:0).map(([t,n])=>`${JSON.stringify(t)}:${_t(n)}`).join(",")}}`:JSON.stringify(d)}function ta(d,e){return d===e?!0:d==null||e==null?!1:_t(d)===_t(e)}function xi(d,e){return t=>ta(t,d)?e:void 0}var At=class{constructor(e,t,n=()=>{},o=()=>{},i){this.api=e;this.changed=n;this.saved=o;this.state={kind:"saved"};this.queue=[];this.confirmed=t,this.doc=t.doc,this.history=new Qo(i)}get busy(){return this.queue.length>0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(e){return this.busy?!1:(this.confirmed=e,this.doc=e.doc,this.history.clear(),this.changed(),!0)}apply(e){let t=this.doc;if(t===null)return!1;let n=e(t);if(n===void 0)return!1;let o=Ne(n);return o.ok?(this.history.push(t),this.doc=o.doc,this.enqueue(e),!0):(this.note={kind:"err",text:`That cannot be saved. ${o.message}.`},this.changed(),!1)}undo(){let e=this.doc;if(e===null)return!1;let t=this.history.undo(e);return t===void 0?!1:(this.doc=t,this.enqueue(xi(e,t)),!0)}redo(){let e=this.doc;if(e===null)return!1;let t=this.history.redo(e);return t===void 0?!1:(this.doc=t,this.enqueue(xi(e,t)),!0)}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}enqueue(e){this.queue.push(e),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0?this.kick():this.changed()}))}async run(){for(;this.queue.length>0;){let e=this.queue.splice(0),t=e.length===1?e[0]:o=>e.reduce((i,a)=>i===void 0?void 0:a(i),o);this.state={kind:"saving"},this.changed();let n=await ki(this.api,this.confirmed,t);if(n.ok){this.confirmed=n.read,this.saved(n.read),n.merged?(this.note={kind:"warn",text:Mi},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=n.read.doc);continue}this.queue=[],this.history.clear(),n.read!==void 0&&(this.confirmed=n.read,this.saved(n.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:n.text},this.state={kind:"error",text:n.text},this.changed();return}this.state={kind:"saved"}}rebased(){let e=this.confirmed.doc;if(e===null)return null;let t=[];for(let n of this.queue){let o=n(e);if(o===void 0)continue;let i=Ne(o);i.ok&&(e=i.doc,t.push(n))}return this.queue=t,e}};var Hi=Wn`
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
  /* A number field scrubs when dragged and types when clicked: until it has
     the typing, the press goes to the field, not its text. */
  .hme-num { cursor: ew-resize; transition: border-color 0.12s, background 0.12s; }
  .hme-num:not(:focus-within) input { pointer-events: none; cursor: ew-resize; }
  .hme-num:not(:focus-within):hover { border-color: var(--wa-line-strong); background: var(--wa-hover); }
  .hme-num:focus-within { cursor: text; }
  .hme-num.scrubbing { border-color: var(--hme-sel); background: var(--wa-hover); }
  .hme-num.off { cursor: default; opacity: 0.5; }
  .hme-ntag { color: var(--wa-faint); font-size: 11px; font-weight: 600; letter-spacing: 0.02em; min-width: 12px; user-select: none; }
  .hme-num.scrubbing .hme-ntag, .hme-num:hover .hme-ntag { color: var(--hme-sel); }
  .hme-fields { display: grid; grid-template-columns: repeat(var(--n, 2), minmax(0, 1fr)); gap: 8px; }
  .hme-group { display: flex; flex-direction: column; gap: 6px; }
  .hme-group + .hme-group { padding-top: 4px; }
  .hme-gl { color: var(--wa-muted); font-size: 12px; display: flex; align-items: center; gap: 8px; }
  .hme-turn { display: flex; gap: 6px; align-items: center; }
  .hme-turn .hme-num { flex: 1; }
  .hme-turn .hme-tb.hme-icon { width: 32px; padding: 0; justify-content: center; }
  .hme-foot-hint { color: var(--wa-faint); font-size: 11.5px; line-height: 1.4; margin: 2px 0 0; }
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
  .hme-stage.hme-split-l { right: calc(50% + 6px); }
  .hme-stage.hme-split-r { left: calc(50% + 6px); }
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
  /* The real 3D look: the canvas fills the stage, dragged to orbit. */
  .hme-stage.hme-3d { background: #0f0e0d; }
  .hme-3d-host { position: absolute; inset: 0; cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; }
  .hme-3d-host:active { cursor: grabbing; }
  .hme-3d-note {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); padding: 10px 16px; border-radius: 12px;
    background: rgba(28, 28, 30, 0.9); border: 1px solid #3a3a3c; color: #d1d1d6; font-size: 13px; pointer-events: none;
  }

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

  /* ── Arrange's furniture ──────────────────────────────────────────── */
  .hme-model { display: flex; align-items: center; gap: 12px; }
  .hme-model-pic, .hme-fcard-pic {
    display: flex; align-items: center; justify-content: center; flex: none; overflow: hidden;
    border-radius: 9px; border: 1px solid #2c2c2e; background: radial-gradient(circle at 50% 38%, #2a2826, #161514 75%);
  }
  .hme-model-pic { width: 76px; height: 57px; }
  .hme-model-pic img, .hme-fcard-pic img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .hme-model-pic.wait, .hme-fcard-pic.wait { background: linear-gradient(100deg, #1d1c1b 30%, #262423 50%, #1d1c1b 70%) 0 0/300% 100%; animation: hme-wait 1.4s linear infinite; }
  @keyframes hme-wait { to { background-position: -300% 0; } }
  .hme-model-t { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .hme-model-t strong { font-size: 14px; }
  .hme-model-t span { color: var(--wa-muted); font-size: 12px; line-height: 1.35; }
  .hme-sheet { z-index: 90; }
  .hme-fpick {
    width: min(1240px, 100%); height: min(860px, 100%); display: flex; flex-direction: column; overflow: hidden;
    border-radius: 18px; background: var(--wa-card); border: 1px solid var(--wa-line-strong); box-shadow: 0 24px 70px rgba(0, 0, 0, 0.5);
  }
  .hme-fpick-head { display: flex; align-items: center; gap: 16px; padding: 16px 18px; border-bottom: 1px solid var(--wa-line); }
  .hme-fpick-t { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
  .hme-fpick-t strong { font-size: 17px; }
  .hme-fpick-t span { color: var(--wa-muted); font-size: 12.5px; }
  .hme-fpick-find { width: min(360px, 40%); }
  .hme-x.hme-fpick-close { width: 32px; height: 32px; font-size: 20px; }
  .hme-fpick-main { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 196px minmax(0, 1fr); }
  .hme-fpick-groups { display: flex; flex-direction: column; gap: 2px; padding: 12px 10px; border-right: 1px solid var(--wa-line); overflow: auto; }
  .hme-fpick-groups .hme-tool { height: 34px; }
  .hme-fpick-groups .n { margin-left: auto; color: var(--wa-faint); font-size: 12px; font-weight: 500; }
  .hme-fpick-body { overflow: auto; padding: 14px 18px 22px; display: flex; flex-direction: column; gap: 18px; }
  .hme-fpick-sec { display: flex; flex-direction: column; gap: 10px; }
  .hme-fgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(168px, 1fr)); gap: 10px; }
  .hme-fcard {
    display: flex; flex-direction: column; align-items: stretch; gap: 3px; padding: 6px 6px 9px; text-align: left; cursor: pointer;
    border-radius: 12px; border: 1px solid var(--wa-line); background: var(--wa-input); color: var(--wa-ink); font: inherit;
  }
  .hme-fcard:hover { border-color: var(--wa-line-strong); background: var(--wa-hover); }
  .hme-fcard:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }
  .hme-fcard.on { border-color: var(--hme-sel); background: var(--hme-sel-bg); }
  .hme-fcard-pic { width: 100%; aspect-ratio: 4 / 3; margin-bottom: 5px; }
  .hme-fcard-name { font-size: 13px; font-weight: 500; padding: 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hme-fcard-size { font-size: 11px; color: var(--wa-faint); padding: 0 4px; }
  @container (max-width: 760px) {
    .hme-fpick-main { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); }
    .hme-fpick-groups { flex-direction: row; flex-wrap: wrap; border-right: 0; border-bottom: 1px solid var(--wa-line); }
    .hme-fpick-groups .hme-tool { width: auto; }
    .hme-fpick-head { flex-wrap: wrap; }
    .hme-fpick-find { width: 100%; order: 3; }
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
`;function Dn(d,e,t,n={}){let o=(n.reach??10)/t,i,a=o;for(let l of[...d.rooms.flatMap(h=>h.outline),...n.corners??[]]){let h=Math.hypot(l[0]-e[0],l[1]-e[1]);h<=a&&(i=l,a=h)}if(i!==void 0)return[i[0],i[1]];let[r,s]=e;if(n.grid!==void 0&&n.grid>0&&(r=Math.round(r/n.grid)*n.grid,s=Math.round(s/n.grid)*n.grid),n.from!==void 0){let l=8/t;Math.abs(e[0]-n.from[0])<=l&&(r=n.from[0]),Math.abs(e[1]-n.from[1])<=l&&(s=n.from[1])}return[Math.round(r*100)/100,Math.round(s*100)/100]}var Ae=.1,ye=.05,_e=class{constructor(e){this.grid=e;this.active=!1;this.points=[]}start(e){this.active=!0,this.points=[],this.hoverAt=void 0,e.select(void 0),e.redraw()}stop(e){this.active=!1,this.points=[],this.hoverAt=void 0,e?.redraw()}snap(e,t){return Dn(e.floor,t,e.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...e.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(e,t){let n=this.points[0];return n!==void 0&&this.points.length>=3&&Math.hypot(t[0]-n[0],t[1]-n[1])*e.view.scale<=10}pointerDown(e,t,n){if(!this.active||t.button!==0)return!1;let o=this.snap(e,n);if(this.closes(e,o))return this.finish(e),!0;let i=this.points[this.points.length-1];return(i===void 0||Math.hypot(o[0]-i[0],o[1]-i[1])>=.05)&&this.points.push(o),e.redraw(),!0}hover(e,t){this.active&&(this.hoverAt=t===void 0?void 0:this.snap(e,t),e.redraw())}keyDown(e,t){return this.active?t.key==="Escape"?(this.stop(e),!0):t.key==="Enter"?(this.points.length>=3&&this.finish(e),!0):t.key==="Backspace"||t.key==="Delete"?(this.points.pop(),e.redraw(),!0):!1:!1}async finish(e){let t=this.points.slice();if(this.stop(e),t.length<3)return;let n=await e.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(n===void 0)return;let o=e.newId(),i=e.floor.id;e.apply(a=>_o(a,i,o,t,n),{select:{kind:"room",roomId:o}})||e.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(e){if(!this.active)return v;let t=this.points.map(s=>e.toScreen(s)),n=this.hoverAt===void 0?void 0:e.toScreen(this.hoverAt),o=this.hoverAt!==void 0&&this.closes(e,this.hoverAt),i=[...t,...n!==void 0?[n]:[]].map(([s,l])=>`${s.toFixed(1)},${l.toFixed(1)}`).join(" "),a=this.points[this.points.length-1],r=a!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-a[0],this.hoverAt[1]-a[1]):0;return M`<g class="hme-draw">
      ${t.length>=3?M`<polygon points=${t.map(([s,l])=>`${s},${l}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:v}
      <polyline points=${i} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${t.map(([s,l],h)=>M`<circle cx=${s} cy=${l} r=${h===0&&o?8:5} fill=${h===0&&o?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${n!==void 0&&!o?M`<circle cx=${n[0]} cy=${n[1]} r="4" fill="#5b8def" />`:v}
      ${n!==void 0&&r>.05?M`<g class="hme-tag"><rect x=${n[0]+10} y=${n[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${n[0]+39} y=${n[1]-13} fill="#fff" text-anchor="middle">${r.toFixed(2)} m</text></g>`:v}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};var On;function Ft(){return On??=import("./scene3d-7SEBB7WF.js").catch(d=>{throw On=void 0,d}),On}function _n(d){return new URL("furniture/",d).href}var st={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},Lt=15,na=[{a:0,c:0},{c:0},{a:1,c:0},{a:1},{a:1,c:1},{c:1},{a:0,c:1},{a:0}];function oa(d,e){let t=(Math.atan2(e,d)*180/Math.PI+180)%180;return["ew-resize","nwse-resize","ns-resize","nesw-resize"][Math.round(t/45)%4]}function ia(d,e){let t=e===0?"":` Its ${I(e,"device")} come${e===1?"s":""} off the map too.`;return`${C(d)} comes off the map.${t} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}function re(d){return bn(d.model)?.name??ot(d.kind)}function aa(d){let e=ge(d.selection),t=e===void 0?void 0:d.floor.rooms.find(a=>k(a.id,e));if(t!==void 0)return t;let n=De(d.view,[d.stage.width/2,d.stage.height/2]),o=V(d.floor,n);if(o!==void 0)return o;let i;for(let a of d.floor.rooms){let r=J(a),s=Math.hypot(r[0]-n[0],r[1]-n[1]);(i===void 0||s<i.d)&&(i={room:a,d:s})}return i?.room}function ra(d,e,t){let n=ti(d,t).filter(a=>e===""||a.group===e);if(d.trim()!==""||e!=="")return[{title:e===""?"Found":e,pieces:n}];let o=[],i=t===void 0?[]:n.filter(a=>a.kind===t);i.length>0&&o.push({title:`${ot(t)} pieces`,pieces:i});for(let a of It.groups){let r=n.filter(s=>s.group===a&&!i.includes(s));r.length>0&&o.push({title:a,pieces:r})}return o}function sa(d){return Math.round(uo(d.turn)*10)/10}var z=d=>d.toFixed(1),Q=d=>`${d[0].toFixed(1)},${d[1].toFixed(1)}`,zt=class{constructor(){this.id="arrange";this.draw=new _e(Ae);this.query="";this.open=new Set;this.guides=[];this.dragging=!1;this.resizing=!1;this.pickerQuery="";this.pickerGroup="";this.pickerFocus=!1;this.thumbs=new Map;this.askedThumbs=new Set;this.thumbFrame=0}openPicker(e,t,n){this.picker=n===void 0?{roomId:t.id}:{roomId:t.id,index:n},this.pickerQuery="",this.pickerGroup="",this.pickerFocus=!0,e.redraw()}closePicker(e){this.picker=void 0,e.redraw()}get pickerOpen(){return this.picker!==void 0}thumb(e,t){let n=this.thumbs.get(t),o=e.furnitureBase;if(n!==void 0||o===void 0||this.askedThumbs.has(t))return n;this.askedThumbs.add(t),Ft().then(i=>i.homeMapPieceThumb(o,t)).then(i=>{if(i===void 0||(this.thumbs.set(t,i),this.thumbFrame!==0))return;let a=typeof requestAnimationFrame=="function"?requestAnimationFrame:r=>setTimeout(r,16);this.thumbFrame=a(()=>{this.thumbFrame=0,e.redraw()})},()=>{})}piecePic(e,t,n){let o=t===void 0?void 0:this.thumb(e,t.id);return m`<span class="${n} ${o===void 0?"wait":""}">${o===void 0?v:m`<img src=${o} alt="" draggable="false" />`}</span>`}pickPiece(e,t){let n=this.picker,o=n===void 0?void 0:e.floor.rooms.find(s=>k(s.id,n.roomId));if(this.picker=void 0,n===void 0||o===void 0){e.redraw();return}let i=o.id;if(n.index!==void 0){let s=n.index;e.apply(l=>Ro(l,i,s,t),{select:{kind:"object",roomId:i,object:s}})||e.redraw();return}let a=X(o)??J(o),r=o.objects.length;e.apply(s=>Io(s,i,t,a),{select:{kind:"object",roomId:i,object:r}})||e.redraw()}sheet(e){let t=this.picker;if(t===void 0)return v;let n=e.floor.rooms.find(c=>k(c.id,t.roomId)),o=t.index===void 0?void 0:n?.objects[t.index];if(n===void 0||t.index!==void 0&&o===void 0)return this.picker=void 0,v;let i=o===void 0?void 0:yn(o),a=ra(this.pickerQuery,this.pickerGroup,o?.kind),r=o===void 0?"Add furniture":"Change model",s=o===void 0?`To ${C(n)}, in its middle. Drag it into place once it is in.`:`${re(o)} in ${C(n)} keeps its place, size and turn.`,l=c=>It.pieces.filter(f=>c===""||f.group===c).length,h=["",...It.groups],p=this.pickerFocus;return this.pickerFocus=!1,m`<div class="hme-scrim hme-sheet"
      @pointerdown=${c=>{c.target===c.currentTarget&&this.closePicker(e)}}
      @keydown=${c=>{c.stopPropagation(),c.key==="Escape"&&this.closePicker(e)}}>
      <div class="hme-fpick" role="dialog" aria-modal="true" aria-label=${r}>
        <header class="hme-fpick-head">
          <div class="hme-fpick-t"><strong>${r}</strong><span>${s}</span></div>
          <label class="hme-find hme-fpick-find"><span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" .value=${j(this.pickerQuery)}
              ${ei(c=>{p&&c instanceof HTMLInputElement&&setTimeout(()=>c.focus(),0)})}
              @input=${c=>{this.pickerQuery=c.target.value,e.redraw()}} /></label>
          <button type="button" class="hme-x hme-fpick-close" aria-label="Close" title="Close (Esc)" @click=${()=>this.closePicker(e)}>×</button>
        </header>
        <div class="hme-fpick-main">
          <nav class="hme-fpick-groups" aria-label="Groups">
            ${h.map(c=>m`<button type="button" class="hme-tool ${c===this.pickerGroup?"on":""}" aria-pressed=${c===this.pickerGroup?"true":"false"}
              @click=${()=>{this.pickerGroup=c,e.redraw()}}>${c===""?"All":c}<span class="n">${l(c)}</span></button>`)}
          </nav>
          <div class="hme-fpick-body">
            ${a.every(c=>c.pieces.length===0)?m`<p class="hme-empty-line">No piece by that name${this.pickerGroup===""?"":` in ${this.pickerGroup}`}.</p>`:v}
            ${a.filter(c=>c.pieces.length>0).map(c=>m`<section class="hme-fpick-sec">
              <div class="hme-h">${c.title}<span class="hme-h-end">${I(c.pieces.length,"piece")}</span></div>
              <div class="hme-fgrid">${c.pieces.map(f=>{let u=i?.id===f.id;return m`<button type="button" class="hme-fcard ${u?"on":""}" aria-pressed=${u?"true":"false"}
                  title=${`${o===void 0?"Add":"Use"} ${f.name}, ${sn(f)}`} @click=${()=>this.pickPiece(e,f)}>
                  ${this.piecePic(e,f,"hme-fcard-pic")}
                  <span class="hme-fcard-name">${f.name}</span>
                  <span class="hme-fcard-size mono">${sn(f)}</span>
                </button>`})}</div>
            </section>`)}
          </div>
        </div>
      </div>
    </div>`}stopDrag(e){this.guides=[],this.dragging=!1,this.resizing=!1,e.preview(void 0)}focus(e){let t=ge(e.selection);return t===void 0?void 0:e.floor.rooms.find(n=>k(n.id,t))}picked(e){let t=e.selection;if(t?.kind!=="object")return;let n=this.focus(e),o=n?.objects[t.object];return n===void 0||o===void 0?void 0:{room:n,index:t.object,object:o}}thingUnder(e,t,n){let o;for(let i of n===void 0?e.floor.rooms:[n])i.objects.forEach((a,r)=>{if(a.hidden===!0)return;let s=an(on(a));if(!je(s,t))return;let l=Math.abs($t(s));(o===void 0||l<o.area)&&(o={thing:{room:i,index:r,object:a},area:l})});return o?.thing}pickThing(e,t,n){e.select({kind:"object",roomId:t.id,object:n})}rail(e){let t=e.floor,n=this.query.trim().toLowerCase(),o=t.rooms.filter(s=>n===""||C(s).toLowerCase().includes(n)),i=n===""?[]:t.pins.filter(s=>K(s,e.hass).toLowerCase().includes(n)||s.entityId.includes(n)),a=e.doc.floors.filter(s=>!k(s.id,t.id)),r=this.focus(e);return m`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a room or device" aria-label="Find a room or device" .value=${j(this.query)}
          @input=${s=>{this.query=s.target.value,e.redraw()}} /></label>
      <section class="hme-card hme-layers">
        <div class="hme-h">${L(t)}<span class="hme-h-end">${I(t.rooms.length,"room")}</span></div>
        ${o.map(s=>this.layer(e,s,r!==void 0&&k(r.id,s.id)))}
        ${o.length===0?m`<p class="hme-empty-line">${n===""?"No rooms on this floor yet.":"No room by that name."}</p>`:v}
        ${i.length>0?m`<div class="hme-sep"></div>${i.map(s=>m`<button type="button" class="hme-lay"
            @click=${()=>e.setMode("devices",{kind:"pin",pinId:s.id})}><span class="hme-dot dev"></span>${K(s,e.hass)}<span class="n">Device</span></button>`)}`:v}
        ${a.length>0?m`<div class="hme-sep"></div>${a.map(s=>m`<button type="button" class="hme-lay dim"
            @click=${()=>e.setFloor(s.id)}>▸ ${L(s)}<span class="n">${I(s.rooms.length,"room")}</span></button>`)}`:v}
      </section>
      <button type="button" class="hme-tb hme-wide ${this.draw.active?"on":""}" @click=${()=>this.draw.active?this.draw.stop(e):this.draw.start(e)}>
        ${this.draw.active?"Stop drawing":"\uFF0B Draw a room by hand"}</button>
      ${this.addFurnitureButton(e,aa(e),"hme-tb hme-wide")}
      <p class="hme-foot">Scanned rooms come from the iPhone. Rooms you draw here (a garden, a garage) need no scan.</p>`}addFurnitureButton(e,t,n){return m`<button type="button" class=${n} ?disabled=${t===void 0}
      title=${t===void 0?"Draw or scan a room first":`Pick a sofa, a bed, a lamp or more from the furniture catalog for ${C(t)}`}
      @click=${()=>{t!==void 0&&this.openPicker(e,t)}}>＋ Add furniture</button>`}layer(e,t,n){let o=m`<button type="button" class="hme-lay ${n?"on":""}" aria-pressed=${n?"true":"false"}
      @click=${()=>e.select({kind:"room",roomId:t.id})}>
      <span class="hme-dot" style=${`background:${Cn[yt(t)]}`}></span>${C(t)}<span class="n">${nt(t)}</span></button>`;if(!n)return o;let i=t.openings.map((h,p)=>({o:h,i:p})).filter(({o:h})=>h.kind!=="window"),a=t.openings.map((h,p)=>({o:h,i:p})).filter(({o:h})=>h.kind==="window"),r=xe(e.floor,t.id),s=h=>{this.open.has(h)?this.open.delete(h):this.open.add(h),e.redraw()},l=h=>e.setMode("shape",h===void 0?{kind:"room",roomId:t.id}:{kind:"opening",roomId:t.id,opening:h});return m`${o}
      <button type="button" class="hme-lay sub" @click=${()=>l(i[0]?.i)}>Doors and ways in<span class="n">${i.length}</span></button>
      <button type="button" class="hme-lay sub" @click=${()=>l(a[0]?.i)}>Windows<span class="n">${a.length}</span></button>
      <button type="button" class="hme-lay sub" aria-expanded=${this.open.has("things")?"true":"false"} @click=${()=>s("things")}>Things<span class="n">${t.objects.length}</span></button>
      ${this.open.has("things")?t.objects.map((h,p)=>m`<div class="hme-lay subsub ${this.picked(e)?.index===p?"on":""}">
        <button type="button" class="hme-link" title="Pick it to move, resize or turn it" @click=${()=>this.pickThing(e,t,p)}>${re(h)}</button>
        ${Oe({on:h.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${re(h)} shown`,click:()=>e.apply(c=>Ue(c,t.id,p,h.hidden!==!0))})}</div>`):v}
      <button type="button" class="hme-lay sub" aria-expanded=${this.open.has("devices")?"true":"false"} @click=${()=>s("devices")}>Devices<span class="n">${r.length}</span></button>
      ${this.open.has("devices")?r.map(h=>m`<button type="button" class="hme-lay subsub" @click=${()=>e.setMode("devices",{kind:"pin",pinId:h.id})}>${K(h,e.hass)}<span class="n">›</span></button>`):v}`}overlay(e){if(this.draw.active)return this.draw.overlay(e);let t=this.focus(e),n=this.picked(e),o=[];for(let i of this.guides)o.push(this.guide(e,i));if(n!==void 0){let i=n.room.outline.map(r=>Q(e.toScreen(r))).join(" ");o.push(M`<polygon points=${i} fill="none" stroke="#5b8def" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" pointer-events="none" />`);let a=n.object;o.push(this.box(e,an(on(a)),{width:a.size[0],depth:a.size[1]},"thing",a.hidden===!0))}else t!==void 0&&t.outline.length>=3&&o.push(this.box(e,gi(t),Ot(t),"room",!1));return o.length===0?v:M`${o}`}box(e,t,n,o,i){let a=t.map(b=>e.toScreen(b)),r=a.reduce((b,w)=>[b[0]+w[0]/4,b[1]+w[1]/4],[0,0]),s=b=>[(a[b][0]+a[(b+1)%4][0])/2,(a[b][1]+a[(b+1)%4][1])/2],l=b=>{let w=Math.max(Math.hypot(b[0]-r[0],b[1]-r[1]),1e-6);return[(b[0]-r[0])/w,(b[1]-r[1])/w]},h=[0,1,2,3].flatMap(b=>[a[b],s(b)]),p=[0,1,2,3].reduce((b,w)=>s(w)[1]<s(b)[1]?w:b,0),c=s(p),f=l(c),u=[c[0]+f[0]*44,c[1]+f[1]*44],g=[];for(let b of[[0,2],[1,3]]){let[w,P]=b,D=Math.abs(a[(w+1)%4][0]-a[w][0])>=Math.abs(a[(w+1)%4][1]-a[w][1])?l(s(w))[1]<=l(s(P))[1]?w:P:l(s(w))[0]<=l(s(P))[0]?w:P,N=a[D],F=a[(D+1)%4],G=l(s(D)),_=[N[0]+G[0]*20,N[1]+G[1]*20],q=[F[0]+G[0]*20,F[1]+G[1]*20],Y=[(_[0]+q[0])/2,(_[1]+q[1])/2],Ui=D%2===0?n.width:n.depth,ee=[G[0]*5,G[1]*5];g.push(M`<path d=${`M${Q(_)}L${Q(q)}M${Q([_[0]-ee[0],_[1]-ee[1]])}L${Q([_[0]+ee[0],_[1]+ee[1]])}M${Q([q[0]-ee[0],q[1]-ee[1]])}L${Q([q[0]+ee[0],q[1]+ee[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${z(Y[0]-26)} y=${z(Y[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${z(Y[0])} y=${z(Y[1]+4)} fill="#fff" text-anchor="middle">${Ui.toFixed(2)} m</text></g>`)}let y=o==="room"?"Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping.":"Drag to resize it. Shift keeps its proportions, Alt resizes it about its middle.";return M`<g class="hme-box">
      <polygon points=${a.map(Q).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray=${i?"5 4":"none"} />
      ${this.resizing||!this.dragging?g:v}
      ${this.dragging?v:M`
        <line x1=${z(c[0])} y1=${z(c[1])} x2=${z(u[0])} y2=${z(u[1])} stroke="#5b8def" stroke-width="1.6" />
        ${h.map((b,w)=>M`<rect data-hme="resize" data-handle=${w} x=${z(b[0]-5)} y=${z(b[1]-5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${oa(b[0]-r[0],b[1]-r[1])}`}>
          <title>${y}</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${Q(u)})`}>
          <title>${o==="room"?"Drag to turn the room. Hold Alt to turn it freely.":"Drag to turn it. Hold Alt to turn it freely."}</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(e,t){let n=e.toScreen(t.a),o=e.toScreen(t.b),i=Math.max(Math.hypot(o[0]-n[0],o[1]-n[1]),1e-6),a=[(o[0]-n[0])/i,(o[1]-n[1])/i],r=[n[0]-a[0]*40,n[1]-a[1]*40],s=[o[0]+a[0]*40,o[1]+a[1]*40],l=e.floor.rooms.find(c=>k(c.id,t.roomId)),h=`Lined up with ${l===void 0?"a":C(l)} wall`,p=h.length*6.2+20;return M`<g class="hme-guide" pointer-events="none">
      <line x1=${z(r[0])} y1=${z(r[1])} x2=${z(s[0])} y2=${z(s[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${z(s[0]+6)} y=${z(s[1]-10)} width=${z(p)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${z(s[0]+6+p/2)} y=${z(s[1]+4)} fill="#fff" text-anchor="middle">${h}</text></g>
    </g>`}pointerDown(e,t,n){if(this.draw.active)return this.draw.pointerDown(e,t,n);if(t.button!==0)return!1;let o=t.target?.closest?.("[data-hme]"),i=o?.getAttribute("data-hme"),a=this.focus(e),r=this.picked(e),s=na[Number(o?.getAttribute("data-handle"))];if(r!==void 0){if(i==="turn")return this.thingTurnDrag(e,t,r,n),!0;if(i==="resize"&&s!==void 0)return this.thingResizeDrag(e,t,r,s,n),!0}else if(a!==void 0){if(i==="turn")return this.turnDrag(e,t,a,n),!0;if(i==="resize"&&s!==void 0)return this.resizeDrag(e,t,a,s,n),!0}let l=t.metaKey||t.ctrlKey,h=l||r!==void 0?this.thingUnder(e,n,l?void 0:r?.room):void 0;if(h!==void 0)return this.pickThing(e,h.room,h.index),this.thingMoveDrag(e,t,h,n),!0;let p=V(e.floor,n);if(p===void 0)return!1;let c=a!==void 0&&k(a.id,p.id)?this.thingUnder(e,n,p):void 0;return e.select({kind:"room",roomId:p.id}),this.moveDrag(e,t,p,n,c),!0}moveDrag(e,t,n,o,i){let a=e.doc,r=n.id,s=pe(n.outline),l=[0,0];e.drag(t,{move:(h,p)=>{let c=h[0]-o[0],f=h[1]-o[1];if(e.toggles.grid&&s!==void 0){let u=Ae;c=Math.round((s.minX+c)/u)*u-s.minX,f=Math.round((s.minY+f)/u)*u-s.minY}if(this.guides=[],e.toggles.snap&&!p.altKey){let u=bo(a,r,c,f);u!==void 0&&(c=u.dx,f=u.dy,this.guides=u.guides)}this.dragging=!0,l=[c,f],e.preview(u=>He(u,r,c,f))},end:(h,p,c)=>{this.stopDrag(e);let[f,u]=l;c&&(Math.abs(f)>=.005||Math.abs(u)>=.005)?e.apply(g=>He(g,r,f,u),{select:{kind:"room",roomId:r}}):!c&&i!==void 0&&this.pickThing(e,i.room,i.index)},cancel:()=>this.stopDrag(e)})}resizeDrag(e,t,n,o,i){let a=wo(n);if(a===void 0)return;let r=e.doc,s=n.id,l=a.a1-a.a0,h=a.c1-a.c0;if(l<=1e-6||h<=1e-6)return;let p=g=>g[0]*a.u[0]+g[1]*a.u[1],c=g=>g[0]*a.v[0]+g[1]*a.v[1],f=g=>Math.min(Math.max(g,Ke),Ge),u;e.drag(t,{move:(g,y)=>{let b=y.altKey?2:1,w=l,P=h;if(o.a!==void 0&&(w=l+(p(g)-p(i))*(o.a===1?1:-1)*b),o.c!==void 0&&(P=h+(c(g)-c(i))*(o.c===1?1:-1)*b),e.toggles.grid){let F=Ae;o.a!==void 0&&(w=Math.round(w/F)*F),o.c!==void 0&&(P=Math.round(P/F)*F)}if(w=f(w),P=f(P),y.shiftKey){let F=w/l,G=P/h,_=o.a===void 0?G:o.c===void 0||Math.abs(Math.log(F))>=Math.abs(Math.log(G))?F:G;_=Math.min(Math.max(_,Ke/Math.min(l,h)),Ge/Math.max(l,h)),w=l*_,P=h*_}let E=[y.altKey||o.a===void 0?.5:1-o.a,y.altKey||o.c===void 0?.5:1-o.c],D={width:w,depth:P,anchor:E};if(this.guides=[],e.toggles.snap&&!y.altKey&&!y.ctrlKey&&!y.metaKey){let F=$o(r,s,D,o,{proportional:y.shiftKey});F!==void 0&&(D=F.resize,this.guides=F.guides)}this.dragging=!0,this.resizing=!0,u=D;let N=D;e.preview(F=>Be(F,s,N))},end:(g,y,b)=>{this.stopDrag(e);let w=u;!b||w===void 0||Math.abs((w.width??l)-l)<.005&&Math.abs((w.depth??h)-h)<.005||e.apply(P=>Be(P,s,w),{select:{kind:"room",roomId:s}})},cancel:()=>this.stopDrag(e)})}turnDrag(e,t,n,o){let i=n.id,a=J(n),r=Math.atan2(o[1]-a[1],o[0]-a[0]),s=0;e.drag(t,{move:(l,h)=>{let p=(Math.atan2(l[1]-a[1],l[0]-a[0])-r)*180/Math.PI;p=(p+540)%360-180,h.altKey||(p=Math.round(p/Lt)*Lt),this.dragging=!0,s=p,e.preview(c=>me(c,i,p,a))},end:(l,h,p)=>{this.stopDrag(e),p&&Math.abs(s)>.01&&e.apply(c=>me(c,i,s,a),{select:{kind:"room",roomId:i}})},cancel:()=>this.stopDrag(e)})}thingMoveDrag(e,t,n,o){let{room:i,index:a,object:r}=n,s=i.id,l=r.c,h=l;e.drag(t,{move:(p,c)=>{let f=[l[0]+p[0]-o[0],l[1]+p[1]-o[1]];if(e.toggles.grid){let g=Ae;f=[Math.round(f[0]/g)*g,Math.round(f[1]/g)*g]}if(this.guides=[],e.toggles.snap&&!c.altKey){let g=Oo(i,r,f);f=g.c,this.guides=g.guides}this.dragging=!0,h=f;let u=f;e.preview(g=>Ee(g,s,a,u))},end:(p,c,f)=>{if(this.stopDrag(e),f&&Math.hypot(h[0]-l[0],h[1]-l[1])>=.005){let u=h;e.apply(g=>Ee(g,s,a,u),{select:{kind:"object",roomId:s,object:a}})}},cancel:()=>this.stopDrag(e)})}thingResizeDrag(e,t,n,o,i){let{room:a,index:r,object:s}=n,l=a.id,{u:h,v:p}=Do(s),c=Math.max(s.size[0],Te),f=Math.max(s.size[1],Te),u=w=>w[0]*h[0]+w[1]*h[1],g=w=>w[0]*p[0]+w[1]*p[1],y=w=>Math.min(Math.max(w,Te),kt),b;e.drag(t,{move:(w,P)=>{let E=P.altKey?2:1,D=c,N=f;if(o.a!==void 0&&(D=c+(u(w)-u(i))*(o.a===1?1:-1)*E),o.c!==void 0&&(N=f+(g(w)-g(i))*(o.c===1?1:-1)*E),e.toggles.grid){let _=Ae;o.a!==void 0&&(D=Math.round(D/_)*_),o.c!==void 0&&(N=Math.round(N/_)*_)}if(D=y(D),N=y(N),P.shiftKey){let _=D/c,q=N/f,Y=o.a===void 0?q:o.c===void 0||Math.abs(Math.log(_))>=Math.abs(Math.log(q))?_:q;Y=Math.min(Math.max(Y,Te/Math.min(c,f)),kt/Math.max(c,f)),D=c*Y,N=f*Y}let F=[P.altKey||o.a===void 0?.5:1-o.a,P.altKey||o.c===void 0?.5:1-o.c];this.dragging=!0,this.resizing=!0;let G={width:D,depth:N,anchor:F};b=G,e.preview(_=>Xe(_,l,r,G))},end:(w,P,E)=>{this.stopDrag(e);let D=b;!E||D===void 0||Math.abs((D.width??c)-s.size[0])<.005&&Math.abs((D.depth??f)-s.size[1])<.005||e.apply(N=>Xe(N,l,r,D),{select:{kind:"object",roomId:l,object:r}})},cancel:()=>this.stopDrag(e)})}thingTurnDrag(e,t,n,o){let{room:i,index:a,object:r}=n,s=i.id,l=r.c,h=Math.atan2(o[1]-l[1],o[0]-l[0]),p=0;e.drag(t,{move:(c,f)=>{let u=(Math.atan2(c[1]-l[1],c[0]-l[0])-h)*180/Math.PI;u=(u+540)%360-180,f.altKey||(u=Math.round(u/Lt)*Lt),this.dragging=!0,p=-u;let g=p;e.preview(y=>ce(y,s,a,g))},end:(c,f,u)=>{this.stopDrag(e);let g=p;u&&Math.abs(g)>.01&&e.apply(y=>ce(y,s,a,g),{select:{kind:"object",roomId:s,object:a}})},cancel:()=>this.stopDrag(e)})}hover(e,t){this.draw.hover(e,t)}keyDown(e,t){if(this.draw.active)return this.draw.keyDown(e,t);let n=this.focus(e);if(n===void 0)return!1;let o=ae(t,!1),i=this.picked(e);if(i!==void 0){let{index:a,object:r}=i,s={kind:"room",roomId:n.id};if(o==="delete")return e.apply(l=>qe(l,n.id,a),{select:s}),!0;if(o==="cancel")return e.select(s),!0;if(typeof o=="object"&&"nudge"in o){let[l,h]=o.nudge;return e.apply(p=>Ee(p,n.id,a,[r.c[0]+l,r.c[1]+h])),!0}return!1}if(o==="delete")return this.askDelete(e,n),!0;if(typeof o=="object"&&"nudge"in o){let[a,r]=o.nudge;return e.apply(s=>He(s,n.id,a,r)),!0}return!1}cursor(){return this.draw.active?"crosshair":void 0}leave(e){this.draw.stop(e),this.picker=void 0,this.guides=[],this.dragging=!1,this.resizing=!1}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.snap?"on":""}" aria-pressed=${e.toggles.snap?"true":"false"}
        title="A dragged room lines up with the walls round it. Hold Alt to move it freely." @click=${()=>e.setToggle("snap",!e.toggles.snap)}>Snap to walls</button>
      <button type="button" class="hme-tb ${e.toggles.grid?"on":""}" aria-pressed=${e.toggles.grid?"true":"false"}
        @click=${()=>e.setToggle("grid",!e.toggles.grid)}>Grid 10 cm</button>`}pill(e){if(this.draw.active)return m`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?m`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(e)}}>Close the room</button>`:v}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(e)}>Cancel</button>`;let t=this.focus(e);if(t===void 0||this.dragging)return v;let n=t.id,o=this.picked(e);if(o!==void 0){let{index:i,object:a}=o;return m`<span class="hme-pill-name">${re(a)}</span>
        <button type="button" class="hme-tb" @click=${()=>e.apply(r=>ce(r,n,i,90))}>⟲ Turn 90°</button>
        <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(r=>pn(r,n,i))}>Line up</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(r=>Ue(r,n,i,a.hidden!==!0))}>${a.hidden===!0?"Show":"Hide"}</button>
        <button type="button" class="hme-tb" @click=${()=>e.select({kind:"room",roomId:n})}>${C(t)} ›</button>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(r=>qe(r,n,i),{select:{kind:"room",roomId:n}})}>Remove</button>`}return m`<span class="hme-pill-name">${C(t)}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(i=>me(i,n,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" @click=${()=>e.apply(i=>ne(i,n))}>Square the corners</button>
      <button type="button" class="hme-tb" title="Turn it to the floor's walls and slide it onto the nearest wall line, as the iPhone does"
        @click=${()=>e.apply(i=>yo(i,n))}>Snap to walls</button>
      ${this.floorMenu(e,t,"Move to floor","hme-tb")}
      <button type="button" class="hme-tb danger" @click=${()=>{this.askDelete(e,t)}}>Delete</button>`}floorMenu(e,t,n,o){let i=e.doc.floors.filter(a=>!k(a.id,e.floor.id));return Sn({label:n,cls:o,options:[...i.map(a=>({value:a.id,label:L(a)})),{value:"new",label:"New floor\u2026"}],pick:a=>{this.moveToFloor(e,t,a)}})}async moveToFloor(e,t,n){let o=t.id,i={kind:"room",roomId:o};if(n!=="new"){e.apply(l=>dn(l,o,{floorId:n}),{select:i,floorId:n});return}let a=Math.max(...e.doc.floors.map(l=>l.story))+1,r=await e.ask({title:"A new floor",label:"Name",value:a===1?"Upstairs":`Floor ${a+1}`,ok:"Move the room there"});if(r===void 0)return;let s=e.newId();e.apply(l=>dn(l,o,{newFloor:{id:s,name:r,story:a}}),{select:i,floorId:s})}async askDelete(e,t){let n=xe(e.floor,t.id).length;await e.confirm({title:`Delete ${C(t)}?`,text:ia(t,n),ok:"Delete room",danger:!0})&&e.apply(i=>xo(i,t.id),{select:null})}inspector(e){let t=this.focus(e);if(t===void 0)return this.floorCard(e,e.floor);let n=this.picked(e);if(n!==void 0)return this.thingInspector(e,n);let o=t.id,i=Ot(t),a=eo(e.floor,e.toggles.live?e.hass?.states:void 0).has(t.id),r=xe(e.floor,o),s=pe(t.outline)??{minX:0,minY:0,maxX:0,maxY:0},l=Math.round(-go(t)*10)/10,h=t.areaId===void 0||e.areas.some(u=>u.id===t.areaId),p=t.pageId===void 0||e.pages.some(u=>k(u.id,t.pageId)),c=wt(t),f=this.edits(e);return m`
      <section class="hme-card hme-head">
        ${yi(t,a)}
        <div class="hme-head-t">
          <strong>${C(t)}</strong>
          <span>${L(e.floor)} · ${nt(t)} · ${i.area.toFixed(1)} m²</span>
        </div>
      </section>

      ${H("Room",m`
        ${O("Name",rt({value:t.name??"",label:"Name",placeholder:"Room",set:u=>e.apply(g=>Ho(g,o,u))}))}
        ${O("Area",be({label:"Area",value:t.areaId??"",options:[{value:"",label:"None"},...h?[]:[{value:t.areaId,label:`Not in Home Assistant (${t.areaId})`,disabled:!0}],...e.areas.map(u=>({value:u.id,label:u.name}))],set:u=>e.apply(g=>Po(g,o,u===""?void 0:u))}))}
        ${B("The Home Assistant area. Its devices show first in Devices.")}
        ${O("Tap opens",be({label:"Tap opens",value:t.pageId??"",options:[{value:"",label:"Nothing"},...p?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(u=>({value:u.id,label:`Page: ${u.name}`}))],set:u=>e.apply(g=>Eo(g,o,u===""?void 0:u))}))}
        ${B("What a tap on this room does on the map tiles and the watch.")}`)}

      ${H("Size",m`
        ${it(R({tag:"W",label:"Width",value:i.width,unit:"m",min:Ke,max:Ge,...f((u,g)=>Be(u,o,{width:g}))}),R({tag:"D",label:"Depth",value:i.depth,unit:"m",min:Ke,max:Ge,...f((u,g)=>Be(u,o,{depth:g}))}),R({tag:"H",label:"Wall height",value:t.height,unit:"m",min:.5,max:20,...f((u,g)=>We(u,o,g))}))}
        <p class="hme-foot-hint">Along its own walls, about its middle; its doors, things and devices move with it.</p>`)}

      ${H("Place",m`
        ${at("Corner",it(R({tag:"X",label:"Left",value:s.minX,unit:"m",...f((u,g)=>He(u,o,g-s.minX,0))}),R({tag:"Y",label:"Top",value:s.minY,unit:"m",...f((u,g)=>He(u,o,0,g-s.minY))})))}
        ${at("Turn",m`<div class="hme-turn">
          ${R({label:"Turn",value:l,unit:"\xB0",digits:1,min:-180,max:180,...f((u,g)=>me(u,o,g-l))})}
          <button type="button" class="hme-tb" @click=${()=>e.apply(u=>me(u,o,-90))}>−90°</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(u=>me(u,o,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>e.apply(u=>vo(u,o))}>Level</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the room to move it, a square handle to resize it, the round one to turn it.</p>
        ${O("Floor",be({label:"Floor",value:e.floor.id,options:[...e.doc.floors.map(u=>({value:u.id,label:L(u)})),{value:"new",label:"New floor\u2026"}],set:u=>{this.moveToFloor(e,t,u)}}))}`)}

      ${H("Floor finish",m`<div class="hme-pics">
        ${U({label:`Auto: ${st[c]}`,picture:In(c),on:t.finish===void 0,title:"Picked from the room's name and furniture",click:()=>e.apply(u=>Pe(u,o,void 0))})}
        ${pt.map(u=>U({label:st[u],picture:In(u),on:t.finish===u,click:()=>e.apply(g=>Pe(g,o,u))}))}
      </div>`)}

      ${H("In this room",m`
        ${t.objects.length===0?m`<p class="hme-empty-line">No things. Add a sofa, a bed or stairs so the map reads.</p>`:v}
        ${t.objects.map((u,g)=>m`<div class="hme-r tight"><span class="hme-grow ${u.hidden===!0?"dim":""}">
            <button type="button" class="hme-link" title="Pick it to move, resize or turn it" @click=${()=>this.pickThing(e,t,g)}>${re(u)}</button></span>
          ${Oe({on:u.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${re(u)} shown`,click:()=>e.apply(y=>Ue(y,o,g,u.hidden!==!0))})}
          <button type="button" class="hme-x" aria-label=${`Remove ${re(u)}`} title="Remove" @click=${()=>e.apply(y=>qe(y,o,g))}>×</button></div>`)}
        ${t.openings.length>0?m`<div class="hme-r tight"><span class="hme-grow">${[...new Set(t.openings.map(ve))].join(", ")}</span>
          <button type="button" class="hme-link" @click=${()=>e.setMode("shape",{kind:"room",roomId:o})}>Shape ›</button></div>`:v}
        <div class="hme-r tight"><span class="hme-grow">${r.length===0?"No devices":r.slice(0,3).map(u=>K(u,e.hass)).join(", ")+(r.length>3?"\u2026":"")}</span>
          <button type="button" class="hme-link" @click=${()=>e.setMode("devices",{kind:"room",roomId:o})}>${I(r.length,"device")} ›</button></div>
        <div class="hme-row-end">
          ${Sn({label:"\uFF0B Add a thing",cls:"hme-tb",options:To.map(u=>({value:u,label:ot(u)})),pick:u=>{let g=X(t)??J(t);e.apply(y=>So(y,o,u,g))}})}
          ${this.addFurnitureButton(e,t,"hme-tb")}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(e,t)}}>Delete room</button>
        </div>`)}`}edits(e){return t=>({set:n=>e.apply(o=>t(o,n)),preview:n=>e.preview(n===void 0?void 0:o=>t(o,n))})}thingInspector(e,t){let{room:n,index:o,object:i}=t,a=n.id,r=re(i),[s,l,h]=i.size,p=sa(i),c=this.edits(e),f={kind:"room",roomId:a},u={unit:"m",min:Te,max:kt};return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${r}</strong>
          <span>In ${C(n)} · ${s.toFixed(2)} × ${l.toFixed(2)} × ${h.toFixed(2)} m${(i.lift??0)>0?` \xB7 ${(i.lift??0).toFixed(2)} m up`:""}${i.hidden===!0?" \xB7 Hidden":""}</span>
        </div>
      </section>

      ${this.modelCard(e,t)}

      ${H("Size",m`
        ${it(R({tag:"W",label:"Width",value:s,...u,...c((g,y)=>Xe(g,a,o,{width:y}))}),R({tag:"D",label:"Depth",value:l,...u,...c((g,y)=>Xe(g,a,o,{depth:y}))}),R({tag:"H",label:"Height",value:h,...u,min:.01,...c((g,y)=>ln(g,a,o,{size:[s,l,y]}))}))}`)}

      ${H("Place",m`
        ${at("Middle, and up off the floor",it(R({tag:"X",label:"Middle across",value:i.c[0],unit:"m",...c((g,y)=>Ee(g,a,o,[y,i.c[1]]))}),R({tag:"Y",label:"Middle down",value:i.c[1],unit:"m",...c((g,y)=>Ee(g,a,o,[i.c[0],y]))}),R({tag:"Z",label:"Up off the floor",value:i.lift??0,unit:"m",min:0,max:100,...c((g,y)=>ln(g,a,o,{lift:y}))})))}
        ${at("Turn",m`<div class="hme-turn">
          ${R({label:"Turn",value:p,unit:"\xB0",digits:1,min:-180,max:180,...c((g,y)=>ce(g,a,o,y-p))})}
          <button type="button" class="hme-tb" title="Turn it a quarter one way" @click=${()=>e.apply(g=>ce(g,a,o,-90))}>−90°</button>
          <button type="button" class="hme-tb" title="Turn it a quarter the other way" @click=${()=>e.apply(g=>ce(g,a,o,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(g=>pn(g,a,o))}>Line up</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the thing to move it, a square handle to resize it, the round one to turn it.</p>`)}

      ${H("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${Oe({on:i.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${r} shown`,click:()=>e.apply(g=>Ue(g,a,o,i.hidden!==!0))})}</div>
        <p class="hme-foot-hint">Scan Again on the iPhone puts the room's things back where the scan finds them. A hidden thing stays hidden.</p>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.select(f)}>‹ ${C(n)}</button>
          <button type="button" class="hme-tb danger push" @click=${()=>e.apply(g=>qe(g,a,o),{select:f})}>Remove</button>
        </div>`)}`}modelCard(e,t){let{room:n,index:o,object:i}=t,a=yn(i),r=bn(i.model),s=r!==void 0?`${r.group}, picked from the catalog`:i.model!==void 0?a===void 0?"A piece this panel does not know yet":`A piece this panel does not know yet, drawn as the ${a.name.toLowerCase()} meanwhile`:a!==void 0?`Picked by its kind: ${ot(i.kind)}`:"A plain box, as the scan found it";return H("Model",m`<div class="hme-model">
        ${this.piecePic(e,a,"hme-model-pic")}
        <div class="hme-model-t"><strong>${a?.name??"Plain box"}</strong><span>${s}</span></div>
        <button type="button" class="hme-tb push" title="Pick another piece from the furniture catalog; it keeps its place, size and turn"
          @click=${()=>this.openPicker(e,n,o)}>Change…</button>
      </div>
      <p class="hme-foot-hint">What it looks like in the 3D view and on the iPhone. The flat plan and the tiles draw it as before.</p>`)}floorCard(e,t){let n=ct(t,e.toggles.live?e.hass?.states:void 0);return m`${H("Floor",m`
        ${O("Name",rt({value:t.name,label:"Floor name",placeholder:L(t),set:o=>e.apply(i=>Mt(i,t.id,o))}))}
        ${O("On it",m`<span class="hme-val">${I(t.rooms.length,"room")} · ${I(t.pins.length,"device")} · ${ut(n)}</span>`)}`)}
      ${H("Arrange",m`<p class="hme-text">Pick a room on the plan or in the list to move it, turn it, resize it, or change its name, area and floor.</p>
        <p class="hme-text dim">Drag a room to move it; it lines up with the walls of the rooms round it. Drag the round handle above it to turn it, or a square handle on its box to resize it. Undo with ${ui()}.</p>
        <p class="hme-text dim">To move a thing in a room (a sofa, a TV, a desk), pick the room, then click the thing. Cmd or Ctrl and a click picks a thing in any room.</p>`)}`}};var Nt="application/x-wa-home-map-entity",da=new Set(["light","switch","fan","climate","humidifier","water_heater","sensor","binary_sensor","media_player","lock","cover","valve","camera","vacuum","alarm_control_panel","siren","input_boolean","remote"]);function la(d,e){let t=d?.entities?.[e];if(t===void 0)return;if(typeof t.area_id=="string"&&t.area_id!=="")return t.area_id;let n=t.device_id?d?.devices?.[t.device_id]:void 0;return typeof n?.area_id=="string"&&n.area_id!==""?n.area_id:void 0}function Pi(d){let e=[];for(let[t,n]of Object.entries(d?.states??{})){let o=d?.entities?.[t];if(o?.hidden===!0)continue;let i=n?.attributes?.friendly_name,a=la(d,t),r=a===void 0?void 0:d?.areas?.[a]?.name?.trim()||a,s=n?.attributes?.device_class;e.push({entityId:t,name:typeof i=="string"&&i.trim()!==""?i.trim():t,domain:t.slice(0,t.indexOf(".")),areaId:a,areaName:r,deviceClass:typeof s=="string"?s:void 0,category:typeof o?.entity_category=="string"?o.entity_category:void 0})}return e.sort((t,n)=>t.name.localeCompare(n.name)||t.entityId.localeCompare(n.entityId))}function pa(d){return new Set(d.floors.flatMap(e=>e.pins.map(t=>t.entityId)))}function Ei(d,e,t){let n=pa(d),o=new Map;for(let a of t){if(n.has(a.entityId)||a.areaId===void 0||a.category!==void 0||!da.has(a.domain))continue;let r=o.get(a.areaId);r===void 0&&o.set(a.areaId,r={areaId:a.areaId,name:a.areaName??a.areaId,here:!1,devices:[]}),r.devices.push(a)}let i=e.rooms.map(a=>a.areaId).filter(a=>a!==void 0);for(let a of o.values())a.here=i.includes(a.areaId);return[...o.values()].sort((a,r)=>{let s=i.indexOf(a.areaId),l=i.indexOf(r.areaId);return s>=0||l>=0?(s<0?1/0:s)-(l<0?1/0:l):a.name.localeCompare(r.name)})}function Ti(d,e){let t=new Set(d.rooms.map(n=>n.areaId).filter(n=>n!==void 0));return e.filter(n=>t.has(n.areaId)).reduce((n,o)=>n+o.devices.length,0)}function Si(d,e,t=40){let n=e.toLowerCase().split(/\s+/).filter(r=>r!=="");if(n.length===0)return[];let o=r=>`${r.name} ${r.entityId} ${r.areaName??""}`.toLowerCase(),i=d.filter(r=>n.every(s=>o(r).includes(s))),a=e.trim().toLowerCase();return i.sort((r,s)=>+!r.name.toLowerCase().startsWith(a)-+!s.name.toLowerCase().startsWith(a)).slice(0,t)}var ha=[["lights","Lights"],["climate","Climate"],["sensors","Sensors"],["power","Power"],["media","Media"],["security","Security"],["covers","Covers"],["other","Other"]];function jt(d){switch(d.slice(0,d.indexOf("."))){case"light":return"lights";case"climate":case"fan":case"humidifier":case"water_heater":return"climate";case"sensor":case"binary_sensor":return"sensors";case"switch":case"input_boolean":return"power";case"media_player":case"remote":return"media";case"lock":case"camera":case"alarm_control_panel":case"siren":return"security";case"cover":case"valve":return"covers";default:return"other"}}function Ci(d){let e=new Map;for(let t of d.pins){let n=jt(t.entityId);e.set(n,(e.get(n)??0)+1)}return ha.filter(([t])=>e.has(t)).map(([t,n])=>({kind:t,label:n,count:e.get(t)}))}function Ii(d){return d.replace(/_/g," ")}function Fe(d,e){let t=e?.[d];if(t===void 0)return"gone";let n=String(t.state??""),o=d.slice(0,d.indexOf(".")),i=t.attributes??{};if(o==="light"&&n==="on"&&typeof i.brightness=="number")return`on \xB7 ${Math.round(i.brightness/255*100)}%`;if(o==="climate"&&typeof i.current_temperature=="number")return`${n} \xB7 ${i.current_temperature}\xB0`;let a=typeof i.unit_of_measurement=="string"?i.unit_of_measurement:"";return a!==""&&n!==""&&Number.isFinite(Number(n))?`${n} ${a}`.replace(" \xB0","\xB0").replace(" %","%"):n.replace(/_/g," ")}function An(d){return["light","switch","fan","input_boolean","media_player","cover","humidifier","siren"].includes(d.slice(0,d.indexOf(".")))}function Fn(d,e){let t=String(e?.[d]?.state??"");return d.startsWith("cover.")?t==="open"||t==="opening"?"Close":"Open":t==="on"||t==="playing"||t==="paused"||t==="idle"?"Turn off":"Turn on"}var Ln=[["Floor",.3],["Table",.8],["Wall",1.6],["Ceiling",2.5]],zn=[[void 0,"As the tile does"],["toggle","Turn on or off"],["details","Show details"],["page","Open a page"],["none","Nothing"]];function Nn(d,e){for(let t of d.floors){let n=t.pins.find(o=>o.entityId===e);if(n!==void 0)return{floorId:t.id,pinId:n.id}}}function Ri(d,e){return e===void 0?void 0:d.rooms.find(t=>t.areaId!==void 0&&t.areaId===e)}function we(d){return d?.kind==="pin"?[d.pinId]:d?.kind==="pins"?d.pinIds.slice():[]}function dt(d){let e=[];for(let t of d)e.some(n=>k(n,t))||e.push(t);if(e.length!==0)return e.length===1?{kind:"pin",pinId:e[0]}:{kind:"pins",pinIds:e}}function Kt(d,e){let t=we(d);return t.some(n=>k(n,e))?dt(t.filter(n=>!k(n,e))):dt([...t,e])}function Di(d,e){return dt([...we(d),...e])}function Oi(d,e,t){let[n,o]=[Math.min(e[0],t[0]),Math.max(e[0],t[0])],[i,a]=[Math.min(e[1],t[1]),Math.max(e[1],t[1])];return d.filter(r=>r.at[0]>=n&&r.at[0]<=o&&r.at[1]>=i&&r.at[1]<=a).map(r=>r.id)}function $e(d){if(d.length===0)return{mixed:!0};let e=JSON.stringify(d[0])??"undefined";return d.every(t=>(JSON.stringify(t)??"undefined")===e)?{mixed:!1,value:d[0]}:{mixed:!0}}function _i(d,e){if(d.length===0||!d.every(An))return;let t=d.every(o=>o.startsWith("cover.")),n=d.some(o=>{let i=Fn(o,e);return i==="Turn off"||i==="Close"});return t?n?{words:"Close",service:"turn_off"}:{words:"Open",service:"turn_on"}:n?{words:"Turn off",service:"turn_off"}:{words:"Turn on",service:"turn_on"}}var ma=15,Gt=Math.PI/4,jn=8,Bt="#ffbf55",x=d=>d.toFixed(1);function ca(d,e){return`${Ii(d.domain)} \xB7 ${Fe(d.entityId,e)}`}function ua(d,e){let t=de(d,e);if(t===void 0)return"Not in a room";let n=V(d,e.at);return n!==void 0&&k(n.id,t.id)?`${C(t)} (found by place)`:C(t)}function fa(d,e,t){return d.icon!==void 0?Rt[d.icon]:`Auto (${Rt[Ze(d.entityId,e,t)].toLowerCase()})`}var Wt=class{constructor(){this.id="devices";this.drawsPins=!0;this.query="";this.side=!0;this.names=!1;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1}states(e){return e.toggles.live?e.hass?.states:void 0}picked(e){let t=e.selection;return t?.kind==="pin"?e.floor.pins.find(n=>k(n.id,t.pinId)):void 0}picks(e){return we(e.selection).flatMap(t=>e.floor.pins.filter(n=>k(n.id,t)))}deviceClass(e,t){let n=e.hass?.states?.[t]?.attributes?.device_class;return typeof n=="string"?n:void 0}friendly(e,t){let n=e.hass?.states?.[t]?.attributes?.friendly_name;return typeof n=="string"&&n.trim()!==""?n.trim():void 0}place(e,t,n,o){let i=Nn(e.doc,t);if(i!==void 0)return k(i.floorId,e.floor.id)||e.setFloor(i.floorId),e.select({kind:"pin",pinId:i.pinId}),!1;let a=Ri(e.floor,o),r=n??(a===void 0?De(e.view,[e.stage.width/2,e.stage.height/2]):X(a)??J(a)),s=e.newId().toUpperCase(),l=e.floor.id,h=this.friendly(e,t),p=e.apply(c=>Wo(c,l,{id:s,entityId:t,at:[r[0],r[1]],...h===void 0?{}:{name:h}}),{select:{kind:"pin",pinId:s}});return p||e.note("warn","That device could not be put on the map: the map holds at most 400 devices."),p}placeAll(e,t){let n=t.map(i=>({entityId:i.entityId,areaId:i.areaId,name:i.name,deviceClass:i.deviceClass})),o=e.floor.id;e.apply(i=>Vo(i,o,n,()=>e.newId())?.doc,{select:null})}rail(e){let t=e.hass?.states,n=Pi(e.hass),o=Ei(e.doc,e.floor,n),i=o.reduce((p,c)=>p+c.devices.length,0),a=Ti(e.floor,o),r=Si(n,this.query),s=Ci(e.floor),l=e.floor.pins.filter(p=>this.filter===void 0||jt(p.entityId)===this.filter),h=we(e.selection);return m`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find any device" aria-label="Find any device" .value=${j(this.query)}
          @input=${p=>{this.query=p.target.value,e.redraw()}} /></label>
      ${this.query.trim()===""?v:H("Found",m`
        ${r.length===0?m`<p class="hme-empty-line">No device by that name.</p>`:v}
        ${r.map(p=>this.deviceRow(e,p,t))}`,r.length>=40?"40+":String(r.length),"hme-tray")}
      ${H("Not on the map",m`
        ${i===0?m`<p class="hme-empty-line">Every device with an area is on the map. Find any other above.</p>`:v}
        ${o.map(p=>m`<div class="hme-ar ${p.here?"":"dim"}">${p.name}<span>${p.devices.length}</span></div>
          ${p.devices.map(c=>this.deviceRow(e,c,t))}`)}
        ${i===0?v:m`<button type="button" class="hme-tb hme-wide" ?disabled=${a===0}
            title=${a===0?"Link this floor's rooms to Home Assistant areas in Arrange first":""}
            @click=${()=>this.placeAll(e,o.flatMap(p=>p.devices))}>Place all ${a} by area</button>
          <p class="hme-foot">Each goes into the room linked to its area, at a good height for its kind. Then drag to fine tune.</p>`}`,String(i),"hme-tray")}
      ${H("On the map",m`
        ${s.length===0?m`<p class="hme-empty-line">No devices on this floor yet. Drag one onto the plan.</p>`:m`<div class="hme-chips">
          ${s.map(p=>m`<button type="button" class="hme-chip sel ${this.filter===p.kind?"on":""}" aria-pressed=${this.filter===p.kind?"true":"false"}
            @click=${()=>{this.filter=this.filter===p.kind?void 0:p.kind,e.redraw()}}>${p.label} ${p.count}</button>`)}</div>`}
        ${l.slice(0,60).map(p=>{let c=h.some(f=>k(f,p.id));return m`<button type="button" class="hme-lay ${c?"on":""}" title="Shift, Cmd or Ctrl and a click picks several"
            @click=${f=>e.select(f.shiftKey||f.metaKey||f.ctrlKey?Kt(e.selection,p.id):{kind:"pin",pinId:p.id})}>
            <span class="hme-dot dev ${te(p.entityId,t).kind==="light"?"":"gray"}"></span>${K(p,e.hass)}
            <span class="n">${Fe(p.entityId,t)}</span></button>`})}`,String(e.floor.pins.length))}`}deviceRow(e,t,n){let o=Nn(e.doc,t.entityId),i=Ze(t.entityId,t.deviceClass,t.name);return m`<div class="hme-dv ${this.dragging===t.entityId?"dragging":""} ${o===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${o===void 0?"true":"false"} title=${o===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it"}
      @dragstart=${a=>{a.dataTransfer?.setData(Nt,t.entityId),a.dataTransfer?.setData("text/plain",t.entityId),a.dataTransfer&&(a.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,e.redraw()}}
      @click=${()=>this.place(e,t.entityId,void 0,t.areaId)}
      @keydown=${a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),this.place(e,t.entityId,void 0,t.areaId))}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${ue(i,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${o===void 0?ca(t,n):"on the map"}</small></span>
      <span class="hme-dv-grip" aria-hidden="true">${o===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}dragOver(e,t,n){let o=this.dragging!==void 0||[...n.dataTransfer?.types??[]].includes(Nt),i=this.dropAt;return this.dropAt=o?t:void 0,i!==this.dropAt&&e.redraw(),o&&t!==void 0}drop(e,t,n){let o=this.dragging??n.dataTransfer?.getData(Nt)??"";this.dragging=void 0,this.dropAt=void 0,o!==""?this.place(e,o,t):e.redraw()}overlay(e){let t=this.states(e),n=this.picked(e),o=we(e.selection),i=[];this.dropAt!==void 0&&i.push(this.dropMark(e,this.dropAt));let a=n===void 0?void 0:te(n.entityId,t);n!==void 0&&a?.kind==="light"&&i.push(this.glowRing(e,n,a.on?a.brightness:void 0));for(let r of e.floor.pins){let s=o.some(h=>k(r.id,h)),l=this.filter!==void 0&&jt(r.entityId)!==this.filter;i.push(this.pinMark(e,r,s,l,t))}return this.box!==void 0&&i.push(this.boxMark(e,this.box)),M`${i}`}boxMark(e,t){let[n,o]=e.toScreen(t.a),[i,a]=e.toScreen(t.b);return M`<rect class="hme-box" x=${x(Math.min(n,i))} y=${x(Math.min(o,a))} width=${x(Math.abs(i-n))} height=${x(Math.abs(a-o))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`}pinMark(e,t,n,o,i){let[a,r]=e.toScreen(t.at),s=te(t.entityId,i),l=s.kind==="light"&&s.on,h=l?Qe(t)??Bt:"rgba(36,36,40,0.92)",p=l?"#fff3d6":s.kind==="gone"?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.4)",c=l?"#3a2600":s.kind==="lock"?s.locked?"#30d158":"#ff9f0a":s.kind==="other"&&s.on?"#ffffff":s.kind==="gone"?"#8e8e93":"#d1d1d6",f=t.icon??Ze(t.entityId,this.deviceClass(e,t.entityId),this.friendly(e,t.entityId)),u=n?13:12,g=n||this.names?K(t,e.hass):ni(t,i),y=g===void 0?0:g.length*5.9+14;return M`<g class="hme-pin" data-hme="pin" data-pin=${t.id} transform=${`translate(${x(a)} ${x(r)})`} opacity=${o?.25:1} style="cursor:grab">
      ${n?M`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:v}
      ${l?M`<circle r=${u+7} fill=${h} opacity="0.22" />`:v}
      <circle r=${u} fill=${h} stroke=${p} stroke-width="1.2" />
      <g transform="translate(-7 -7)">${ue(f,c,14,1.5)}</g>
      ${g===void 0||g===""?v:M`<g pointer-events="none"><rect x=${x(-y/2)} y=${u+4} width=${x(y)} height="16" rx="8" fill=${n?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text y=${u+15.5} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${g}</text></g>`}
    </g>`}glowRing(e,t,n){let[o,i]=e.toScreen(t.at),a=Je(t,n),r=e.px(a),s=[o+r*Math.cos(Gt),i+r*Math.sin(Gt)],l=`Glow ${a.toFixed(1)} m`,h=l.length*6.2+18,p=t.glowSpill===!0?void 0:de(e.floor,t),c=p!==void 0&&p.outline.length>=3?p.outline.map(u=>e.toScreen(u).map(x).join(",")).join(" "):void 0,f=u=>M`<circle cx=${x(o)} cy=${x(i)} r=${x(r)} fill="none" stroke=${Qe(t)??"#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${u} pointer-events="none" />`;return M`<g class="hme-glow-ring">
      ${c===void 0?f(1):M`<clipPath id="hme-glow-walls"><polygon points=${c} /></clipPath>
        ${f(.28)}<g clip-path="url(#hme-glow-walls)">${f(1)}</g>`}
      <circle data-hme="glow" cx=${x(s[0])} cy=${x(s[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${x(s[0]-h/2)} y=${x(s[1]+12)} width=${x(h)} height="18" rx="9" fill="#5b8def" />
        <text x=${x(s[0])} y=${x(s[1]+25)} fill="#fff" text-anchor="middle">${l}</text></g>
    </g>`}dropMark(e,t){let n=V(e.floor,t),[o,i]=e.toScreen(t),a=n===void 0?"Drop here, in no room":`Drop in ${C(n)}`,r=a.length*6.4+20;return M`<g class="hme-drop" pointer-events="none">
      ${n===void 0?v:M`<polygon points=${n.outline.map(s=>e.toScreen(s).map(x).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${x(o)} cy=${x(i)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${x(o-r/2)} y=${x(i+20)} width=${x(r)} height="18" rx="9" fill="#5b8def" />
        <text x=${x(o)} y=${x(i+33)} fill="#fff" text-anchor="middle">${a}</text></g>
    </g>`}pinAt(e,t){let n,o=ma;for(let i of e.floor.pins){let a=e.toScreen(i.at),r=Math.hypot(a[0]-t[0],a[1]-t[1]);r<=o&&(n=i,o=r)}return n}pointerDown(e,t,n){if(t.button!==0)return!1;let o=e.toScreen(n),i=t.shiftKey||t.metaKey||t.ctrlKey,a=this.picked(e),r=a===void 0?void 0:te(a.entityId,this.states(e));if(!i&&a!==void 0&&r?.kind==="light"){let[h,p]=e.toScreen(a.at),c=e.px(Je(a,r.on?r.brightness:void 0));if(Math.hypot(o[0]-(h+c*Math.cos(Gt)),o[1]-(p+c*Math.sin(Gt)))<=10)return this.glowDrag(e,t,a),!0}let s=this.pinAt(e,o);if(s===void 0)return t.shiftKey?(this.boxDrag(e,t,n),!0):!1;if(this.pickPage=!1,this.iconsOpen=!1,i)return e.select(Kt(e.selection,s.id)),!0;let l=we(e.selection);return l.length>1&&l.some(h=>k(h,s.id))?(this.groupDrag(e,t,l,s.id,n),!0):(e.select({kind:"pin",pinId:s.id}),this.moveDrag(e,t,s,n),!0)}groupDrag(e,t,n,o,i){let a=[0,0],r=dt(n);e.drag(t,{move:s=>{this.moving=!0,a=[s[0]-i[0],s[1]-i[1]];let[l,h]=a;e.preview(p=>St(p,n,l,h))},end:(s,l,h)=>{this.moving=!1,e.preview(void 0);let[p,c]=a;h?Math.hypot(p,c)>=.005&&e.apply(f=>St(f,n,p,c),r===void 0?{}:{select:r}):e.select({kind:"pin",pinId:o})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.moving=!1,this.box=void 0,e.preview(void 0)}boxDrag(e,t,n){let o=e.floor.pins,i=e.selection;e.drag(t,{move:a=>{this.box={a:n,b:a},e.redraw()},end:(a,r,s)=>{this.box=void 0,s?e.select(Di(i,Oi(o,n,a))):e.redraw()},cancel:()=>this.stopDrag(e)})}async removePicks(e,t){t.length!==0&&(t.length>1&&!await e.confirm({title:`Remove ${I(t.length,"device")} from the map?`,text:"They go back to Not on the map. Undo puts them back where they were.",ok:"Remove",danger:!0})||e.apply(n=>Xo(n,t),{select:null}))}moveDrag(e,t,n,o){let i=n.id,a=[n.at[0],n.at[1]],r=a;e.drag(t,{move:s=>{this.moving=!0,r=[a[0]+s[0]-o[0],a[1]+s[1]-o[1]],e.preview(l=>un(l,i,r))},end:(s,l,h)=>{this.moving=!1,e.preview(void 0),h&&Math.hypot(r[0]-a[0],r[1]-a[1])>=.005&&e.apply(p=>un(p,i,r),{select:{kind:"pin",pinId:i}})},cancel:()=>this.stopDrag(e)})}glowDrag(e,t,n){let o=n.id,i;e.drag(t,{move:a=>{this.moving=!0;let r=Math.hypot(a[0]-n.at[0],a[1]-n.at[1]);i=Math.min(Math.max(Math.round(r/.05)*.05,ze),Zn);let s=i;e.preview(l=>Ye(l,o,{glow:s}))},end:()=>{this.moving=!1,e.preview(void 0);let a=i;a!==void 0&&e.apply(r=>Ye(r,o,{glow:a}))},cancel:()=>this.stopDrag(e)})}keyDown(e,t){let n=this.picks(e).map(i=>i.id);if(n.length===0)return!1;let o=ae(t,!1);if(o==="delete")return this.removePicks(e,n),!0;if(typeof o=="object"&&"nudge"in o){let[i,a]=o.nudge;return e.apply(r=>St(r,n,i,a)),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.box=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1}dock(e){let t=(n,o,i,a)=>m`<button type="button" class="hme-tb ${o?"on":""}"
      aria-pressed=${o?"true":"false"} title=${a} @click=${()=>{i(),e.redraw()}}>${n}</button>`;return m`${t("Side view",this.side,()=>{this.side=!this.side},"The picked device's room from the side, to set its height")}
      ${t("Names",this.names,()=>{this.names=!this.names},"Every device's name under its pin")}`}stageExtra(e){let t=this.picked(e);if(!this.side||t===void 0)return v;let n=de(e.floor,t),o=n?.height??2.5,i=pe(n?.outline??e.floor.rooms.flatMap(E=>E.outline))??{minX:t.at[0]-1,maxX:t.at[0]+1,minY:0,maxY:0},a=18,r=118,s=(r-a)/Math.max(o,.5),l=30,h=262,p=(h-l)/Math.max(i.maxX-i.minX,.5),c=E=>l+(Math.min(Math.max(E,i.minX),i.maxX)-i.minX)*p,f=t.at[2],u=r-Math.min(Math.max(f,0),o)*s,g=c(t.at[0]),y=(()=>{let E=te(t.entityId,this.states(e));return E.kind==="light"&&E.on})(),b=[];for(let E=0;E<=o+1e-9;E+=1)b.push(E);let w=n===void 0?[]:Qn(n),P=n===void 0?"No room":C(n);return m`<div class="hme-side">
      <div class="hme-h">${P} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${K(t,e.hass)} at ${f.toFixed(2)} m, the wall ${o.toFixed(1)} m tall`}
        @pointerdown=${E=>this.heightDrag(e,E,t,o,r,s)}>
        <path d=${`M${l} ${x(a)}H${h}M${l} ${r}H${h}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${l} ${x(a)}V${r}M${h} ${x(a)}V${r}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${b.map(E=>M`<text x=${l-6} y=${x(r-E*s+3)}>${E===0?"0":`${E} m`}</text>
            <path d=${`M${l-4} ${x(r-E*s)}H${l}`} stroke="#8e8e93" />`)}
        </g>
        ${w.map(E=>{let D=c(E.c[0]-E.size[0]/2),N=c(E.c[0]+E.size[0]/2),F=Math.min(E.size[2],o)*s;return M`<rect x=${x(D)} y=${x(r-F)} width=${x(Math.max(N-D,2))} height=${x(F)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${x(g)} ${r}V${x(u)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${y?M`<circle cx=${x(g)} cy=${x(u)} r="20" fill="#ffb648" opacity="0.22" />`:v}
        <circle cx=${x(g)} cy=${x(u)} r="9" fill=${y?Bt:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${x(Math.min(g+14,222))} y=${x(u-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${x(Math.min(g+14,222)+22)} y=${x(u+3.5)} fill="#fff" font-size="10" text-anchor="middle">${f.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(e,t,n,o,i,a){if(t.button!==0)return;let r=t.currentTarget,s=n.id,l=f=>{let u=r.getBoundingClientRect(),g=(f.clientY-u.top)*130/Math.max(u.height,1);return Math.min(Math.max(Math.round((i-g)/a/.05)*.05,0),o)},h=l(t);try{r.setPointerCapture(t.pointerId)}catch{}this.moving=!0,e.preview(f=>oe(f,s,h));let p=f=>{h=l(f);let u=h;e.preview(g=>oe(g,s,u))},c=()=>{r.removeEventListener("pointermove",p),r.removeEventListener("pointerup",c),r.removeEventListener("pointercancel",c),this.moving=!1,e.preview(void 0);let f=h;Math.abs(f-n.at[2])>=.005&&e.apply(u=>oe(u,s,f))};r.addEventListener("pointermove",p),r.addEventListener("pointerup",c),r.addEventListener("pointercancel",c)}pill(e){let t=this.picks(e);if(t.length>1&&!this.moving)return this.groupPill(e,t);let n=this.picked(e);if(n===void 0||this.moving)return v;let o=n.id,i=n.entityId.startsWith("light."),a=de(e.floor,n)!==void 0;return m`<span class="hme-pill-name">${K(n,e.hass)}</span>
      ${An(n.entityId)&&e.hass!==void 0?m`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,n.entityId)}>${Fn(n.entityId,e.hass.states)}</button>`:v}
      ${i?m`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>e.apply(r=>Uo(r,o))}>Same height for all lights</button>`:v}
      ${a?m`<button type="button" class="hme-tb" @click=${()=>e.apply(r=>qo(r,o))}>Center in room</button>`:v}
      <button type="button" class="hme-tb danger" @click=${()=>e.apply(r=>fn(r,o),{select:null})}>Remove</button>`}groupPill(e,t){let n=t.map(s=>s.id),o=t[0],i=o.at[2],a=t.every(s=>Math.abs(s.at[2]-i)<.005),r=e.hass===void 0?void 0:_i(t.map(s=>s.entityId),e.hass.states);return m`<span class="hme-pill-name">${I(t.length,"device")}</span>
      ${r===void 0?v:m`<button type="button" class="hme-tb" @click=${()=>this.turn(e,t.map(s=>s.entityId),r.service)}>${r.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${a} title=${a?"They are all at one height":`Every picked device at ${K(o,e.hass)}'s height, ${i.toFixed(2)} m`}
        @click=${()=>e.apply(s=>Ce(s,n,i))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,n)}}>Remove</button>`}toggle(e,t){let n=e.hass;n!==void 0&&Zt(n,"homeassistant","toggle",{entity_id:t}).catch(o=>{e.note("err",`Could not turn it on or off: ${o instanceof Error?o.message:String(o)}`)})}turn(e,t,n){let o=e.hass;o!==void 0&&Zt(o,"homeassistant",n,{entity_id:[...t]}).catch(i=>{e.note("err",`Could not turn them ${n==="turn_on"?"on":"off"}: ${i instanceof Error?i.message:String(i)}`)})}inspector(e){let t=this.picks(e);if(t.length>1)return this.groupInspector(e,t);let n=this.picked(e);if(n===void 0)return this.overview(e);let o=e.hass?.states,i=n.id,a=te(n.entityId,o),r=a.kind==="light"&&a.on,s=this.friendly(e,n.entityId),l=this.deviceClass(e,n.entityId),h=Ze(n.entityId,l,s),p=n.icon??h,f=de(e.floor,n)?.height??2.5,u=b=>e.apply(w=>Ye(w,i,b,s)),y=Qe(n)??Bt;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${r?"lit":""}" style=${r?`background:${y};box-shadow:0 0 24px ${y}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ue(p,r?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${K(n,e.hass)}</strong>
          <span class="mono">${n.entityId}</span>
        </div>
        <span class="hme-state ${r?"lit":""}">${Fe(n.entityId,o)}</span>
      </section>

      ${H("On the map",m`
        ${O("Name",rt({value:n.name??"",label:"Name on the map",placeholder:s??n.entityId,set:b=>u({name:b.trim()===""?null:b})}))}
        ${O("Icon",m`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
          @click=${()=>{this.iconsOpen=!this.iconsOpen,e.redraw()}}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${ue(p,"currentColor",24,2)}</svg>
          <span class="hme-grow">${fa(n,l,s)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
        ${this.iconsOpen?this.iconMenu(e,n,h,u):v}
        ${O("Room",m`<span class="hme-in hme-ro">${ua(e.floor,n)}</span>`)}
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${U({label:"None",picture:Le("none",y),on:n.reading==="none",click:()=>u({reading:"none"})})}
          ${U({label:"Pill",picture:Le("pill",y),on:n.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>u({reading:null})})}
          ${U({label:"Name",picture:Le("name",y),on:n.reading==="name",click:()=>u({reading:"name"})})}
        </div></div>`)}

      ${H("Height",m`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${f} step="0.05" .value=${j(String(n.at[2]))} aria-label="Height" style=${ke(n.at[2],0,f)}
            @input=${b=>{let w=Number(b.target.value);e.preview(P=>oe(P,i,w))}}
            @change=${b=>{let w=Number(b.target.value);e.apply(P=>oe(P,i,w))}} />
          ${R({label:"Height",value:n.at[2],unit:"m",min:0,max:100,width:"92px",set:b=>e.apply(w=>oe(w,i,b))})}
        </div>
        <div class="hme-chips">${Ln.map(([b,w])=>m`<button type="button" class="hme-chip sel ${Math.abs(n.at[2]-w)<.005?"on":""}"
          @click=${()=>e.apply(P=>oe(P,i,w))}>${b} ${w}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${n.entityId.startsWith("light.")?this.lightCard(e,n,a.kind==="light"&&a.on?a.brightness:void 0,u):v}

      ${this.tapCard(e,n,u)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>e.apply(b=>fn(b,i),{select:null})}>Remove from the map</button></div>`}iconMenu(e,t,n,o){let i=r=>{this.iconsOpen=!1,o({icon:r}),e.redraw()},a=(r,s,l,h)=>m`<button type="button" class="hme-icon-cell ${l?"on":""}"
      title=${s} aria-label=${s} aria-pressed=${l?"true":"false"} @click=${()=>i(h)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${ue(r,"currentColor",24,1.9)}</svg><span>${s}</span></button>`;return m`<div class="hme-icons" role="group" aria-label="Icon">
      ${a(n,"Auto",t.icon===void 0,null)}
      ${Yn.map(r=>a(r,Rt[r],t.icon===r,r))}
    </div>`}lightCard(e,t,n,o){let i=t.id,a=Je(t,n),r=Qe(t),s=(l,h,p)=>m`<button type="button" class="hme-chip sel ${h?"on":""}" aria-pressed=${h?"true":"false"} @click=${p}>${l}</button>`;return H("Light",m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${ze} max=${Math.max(jn,a)} step="0.05" .value=${j(String(a))} aria-label="Glow size"
          style=${ke(a,ze,Math.max(jn,a))}
          @input=${l=>{let h=Number(l.target.value);e.preview(p=>Ye(p,i,{glow:h}))}}
          @change=${l=>o({glow:Number(l.target.value)})} />
        <span class="hme-val mono hme-w48">${a.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${s("By its brightness",t.glow===void 0,()=>o({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${s("Follow the light",t.glowColor===void 0,()=>o({glowColor:null}))}
        ${s("Warm",t.glowColor==="warm",()=>o({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${r!==void 0?"on":""}">${r===void 0?v:m`<span class="hme-swatch" style=${`background:${r}`}></span>`}Pick
          <input type="color" .value=${j(r??"#ffb648")} aria-label="Pick the glow's color"
            @change=${l=>o({glowColor:l.target.value})} /></label>
      </div></div>
      ${Ai(t.glowSpill===!0?"off":"on",l=>o({glowSpill:l?null:!0}))}
      ${B("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`)}groupInspector(e,t){let n=e.hass?.states,o=t.map(p=>p.id),i=p=>{e.apply(c=>gn(c,o,p))||e.note("warn","That could not be set on every picked device.")},a=Math.max(2.5,...t.map(p=>de(e.floor,p)?.height??2.5)),r=$e(t.map(p=>p.at[2])),s=$e(t.map(p=>p.reading)),l=t.every(p=>p.entityId.startsWith("light.")),h=Bt;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ue("bulb","#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${I(t.length,"device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${H("Picked",m`${t.map(p=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${()=>e.select({kind:"pin",pinId:p.id})}>${K(p,e.hass)}</button>
          <span class="hme-val">${Fe(p.entityId,n)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${K(p,e.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(Kt(e.selection,p.id))}>×</button></div>`)}`,String(t.length))}

      ${H("On the map",m`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${U({label:"None",picture:Le("none",h),on:!s.mixed&&s.value==="none",click:()=>i({reading:"none"})})}
          ${U({label:"Pill",picture:Le("pill",h),on:!s.mixed&&s.value===void 0,title:"Each one's reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>i({reading:null})})}
          ${U({label:"Name",picture:Le("name",h),on:!s.mixed&&s.value==="name",click:()=>i({reading:"name"})})}
        </div></div>
        ${s.mixed?B("Mixed: they show different things. Pick one to set them all."):v}`)}

      ${H("Height",m`
        <div class="hme-r">
          ${Fi({label:"Height",value:r.mixed?void 0:r.value,min:0,max:a,step:.05,preview:p=>e.preview(c=>Ce(c,o,p)),set:p=>e.apply(c=>Ce(c,o,p))})}
          ${R({label:"Height",value:r.mixed?void 0:r.value,unit:"m",min:0,max:100,width:"92px",set:p=>e.apply(c=>Ce(c,o,p))})}
        </div>
        <div class="hme-chips">${Ln.map(([p,c])=>m`<button type="button" class="hme-chip sel ${t.every(f=>Math.abs(f.at[2]-c)<.005)?"on":""}"
          @click=${()=>e.apply(f=>Ce(f,o,c))}>${p} ${c}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${l?this.groupLightCard(e,t,i):v}

      ${this.groupTapCard(e,t,i)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,o)}}>Remove ${I(t.length,"device")} from the map</button></div>`}groupLightCard(e,t,n){let o=t.map(u=>u.id),i=this.states(e),a=t.map(u=>{let g=te(u.entityId,i);return Math.round(Je(u,g.kind==="light"&&g.on?g.brightness:void 0)*20)/20}),r=$e(a),s=Math.max(jn,...a),l=t.every(u=>u.glow===void 0),h=$e(t.map(u=>u.glowColor?.toLowerCase())),p=$e(t.map(u=>u.glowSpill===!0)),c=h.mixed||h.value===void 0||h.value==="warm"?void 0:h.value,f=(u,g,y)=>m`<button type="button" class="hme-chip sel ${g?"on":""}" aria-pressed=${g?"true":"false"} @click=${y}>${u}</button>`;return H("Light",m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${Fi({label:"Glow size",value:r.mixed?void 0:r.value,min:ze,max:s,step:.05,preview:u=>e.preview(g=>gn(g,o,{glow:u})),set:u=>n({glow:u})})}
        <span class="hme-val mono hme-w48">${r.mixed?"Mixed":`${r.value.toFixed(1)} m`}</span></div>
      <div class="hme-row-end indent">${f("By its brightness",l,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${f("Follow the light",!h.mixed&&h.value===void 0,()=>n({glowColor:null}))}
        ${f("Warm",!h.mixed&&h.value==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${c!==void 0?"on":""}">${c===void 0?v:m`<span class="hme-swatch" style=${`background:${c}`}></span>`}Pick
          <input type="color" .value=${j(c??"#ffb648")} aria-label="Pick the glow's color for every picked light"
            @change=${u=>n({glowColor:u.target.value})} /></label>
      </div></div>
      ${h.mixed?B("Mixed: their colors differ. Pick one to set them all."):v}
      ${Ai(p.mixed?"mixed":p.value?"off":"on",u=>n({glowSpill:u?null:!0}))}`)}groupTapCard(e,t,n){let o=$e(t.map(l=>[l.tap,l.tap==="page"?l.pageId?.toLowerCase():void 0])),i=o.mixed?void 0:o.value,a=i?.[0]==="page"||this.pickPage,r=i?.[0]==="page"?t[0].pageId:void 0,s=l=>{if(l==="page"){e.pages.length===1?n({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,n({tap:l??null})};return H("Tap on the map",m`
      <div class="hme-chips">${zn.map(([l,h])=>{let p=l==="page"?a:!this.pickPage&&i!==void 0&&i[0]===l;return m`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"}
          ?disabled=${l==="page"&&e.pages.length===0} title=${l==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>s(l)}>${h}</button>`})}</div>
      ${a?O("Page",be({label:"Page",value:r??"",options:[...r===void 0?[{value:"",label:"Pick a page\u2026",disabled:!0}]:[],...r===void 0||e.pages.some(l=>k(l.id,r))?[]:[{value:r,label:"A page not in your library",disabled:!0}],...e.pages.map(l=>({value:l.id,label:l.name}))],set:l=>{this.pickPage=!1,l!==""&&n({tap:"page",pageId:l})}})):v}
      <p class="hme-text dim">${o.mixed&&!this.pickPage?"Mixed: a tap does different things on them. Pick one to set them all.":"Set on every picked device."}</p>`)}tapCard(e,t,n){let o=t.tap==="page"||this.pickPage,i=t.pageId===void 0||e.pages.some(r=>k(r.id,t.pageId)),a=r=>{if(r==="page"){if(t.tap==="page")return;e.pages.length===1?n({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,n({tap:r??null})};return H("Tap on the map",m`
      <div class="hme-chips">${zn.map(([r,s])=>{let l=r==="page"?o:!this.pickPage&&t.tap===r;return m`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
          ?disabled=${r==="page"&&e.pages.length===0} title=${r==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>a(r)}>${s}</button>`})}</div>
      ${o?O("Page",be({label:"Page",value:t.tap==="page"?t.pageId??"":"",options:[...t.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...i?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(r=>({value:r.id,label:r.name}))],set:r=>{this.pickPage=!1,r!==""&&n({tap:"page",pageId:r})}})):v}
      <p class="hme-text dim">${t.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":"Hold on the watch or iPhone: its controls."}</p>`)}overview(e){let t=ge(e.selection),n=t===void 0?void 0:e.floor.rooms.find(a=>k(a.id,t)),o=n===void 0?e.floor.pins:xe(e.floor,n.id),i=e.hass?.states;return m`${H(n===void 0?"Devices":C(n),m`
        <p class="hme-text">${n===void 0?`${I(e.floor.pins.length,"device")} on this floor.`:`${I(o.length,"device")} in this room.`}</p>
        ${o.map(a=>m`<button type="button" class="hme-list-row" @click=${()=>e.select({kind:"pin",pinId:a.id})}>
          <span class="hme-grow">${K(a,e.hass)}</span><span class="hme-val">${Fe(a.entityId,i)}</span></button>`)}`)}
      ${H("Devices",m`<p class="hme-text">Pick a device on the plan to set its name, icon, height, glow and what a tap on it does.</p>
        <p class="hme-text dim">Drag a device from Not on the map onto the plan to place it. Drag a pin to move it; arrow keys nudge it, Delete takes it off the map.</p>
        <p class="hme-text dim">Shift, Cmd or Ctrl and a click picks several; Shift and a drag over empty space picks every device in the box. Then drag one to move them all, or set them together.</p>`)}`}};function Ai(d,e){let t=d==="on"?"walls stop the glow":d==="off"?"the glow spreads past the walls":"some stay in, some spread";return m`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${d==="mixed"?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${()=>e(!0)}>Mixed</button>`:Oe({on:d==="on",onText:"On",offText:"Off",label:"Stay in room",click:()=>e(d!=="on")})}
    <span class="hme-text dim">${t}</span></div>`}function Fi(d){let e=d.value??(d.min+d.max)/2;return m`<input class="hme-range ${d.value===void 0?"mixed":""}" type="range" min=${d.min} max=${d.max} step=${d.step} .value=${j(String(e))}
    aria-label=${d.label} aria-valuetext=${d.value===void 0?"Mixed":v} style=${d.value===void 0?"--p:0%":ke(d.value,d.min,d.max)}
    @input=${t=>{let n=t.target;n.classList.remove("mixed"),d.preview(Number(n.value))}}
    @change=${t=>d.set(Number(t.target.value))} />`}function Le(d,e){return m`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${d==="none"?20:16} r="9" fill=${e} />
    ${d==="pill"?M`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:v}
    ${d==="name"?M`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:v}
  </svg>`}var ji=[{id:"select",label:"Walls and corners",key:"v"},{id:"draw",label:"Draw a room",key:"r"},{id:"split",label:"Split a room",key:"s"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"opening",label:"Way through (no door)",key:"o"},{id:"stairs",label:"Stairs",key:"t"}];function ga(d){return ji.find(e=>e.key===d.toLowerCase())?.id}var va=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],ba=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function ya(d){return d===2?"Fix both":`Fix all ${ba[d]??d}`}var wa=9,Li=18,Kn="#4fd6c2",$a="Draw each room faint and dashed as the iPhone scanned it, or as first seen for a room scanned before scans were kept. A room drawn here has none.",Ma="Put this room's walls, doors, windows and furniture back as the iPhone scanned it. Its devices stay where they are.",$=d=>d.toFixed(1),se=d=>`${d[0].toFixed(1)},${d[1].toFixed(1)}`,zi=new WeakMap;function Ut(d){let e=zi.get(d);return e===void 0&&zi.set(d,e=No(d)),e}function Gn(d,e,t,n){let o=t/d.view.scale,i=a=>{let r;for(let s of a)for(let[l,h]of W(s).entries()){let p=co(e,h);p<=o&&(r===void 0||p<r.d)&&(r={room:s,wall:l,seg:h,d:p})}return r};return(n===void 0?void 0:i([n]))??i(d.floor.rooms)}function Ni(d,e){let t=Math.max(le(e),1e-9),n=[-(e.b[1]-e.a[1])/t,(e.b[0]-e.a[0])/t],o=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],i=X(d)??J(d);return(i[0]-o[0])*n[0]+(i[1]-o[1])*n[1]>0&&(n=[-n[0],-n[1]]),n}var qt=class{constructor(){this.id="shape";this.tool="select";this.draw=new _e(ye);this.dragging=!1}setTool(e,t){this.first=void 0,t==="draw"?this.draw.start(e):this.draw.stop(),this.tool=t,e.redraw()}focus(e){let t=ge(e.selection);return t===void 0?void 0:e.floor.rooms.find(n=>k(n.id,t))}pickedWall(e,t){let n=e.selection;if(!(t===void 0||n===void 0)){if(n.kind==="wall")return n.wall;if(n.kind==="opening"){let o=t.openings[n.opening],i=o===void 0?-1:xt(t,o);return i>=0?i:void 0}}}rail(e){let t=Ut(e.floor),n=e.floor.id;return m`
      <section class="hme-card hme-tools">
        <div class="hme-h">Tools</div>
        ${ji.map((o,i)=>m`${i===4?m`<div class="hme-sep"></div>`:v}
          <button type="button" class="hme-tool ${this.tool===o.id?"on":""}" aria-pressed=${this.tool===o.id?"true":"false"}
            @click=${()=>this.setTool(e,o.id)}>${ka[o.id]}${o.label}<kbd>${o.key.toUpperCase()}</kbd></button>`)}
      </section>
      ${H("Scan check",m`
        ${t.length===0?m`<p class="hme-text dim">Nothing to fix. The walls meet and every room has a way in.</p>`:v}
        ${t.map(o=>m`<div class="hme-fix">
          <span class="hme-fix-dot ${o.kind==="missingDoor"?"gray":""}"></span>
          <p @click=${()=>e.select({kind:"room",roomId:o.roomIds[0]})}><b>${o.title}</b> ${o.detail}</p>
          <button type="button" class="hme-tb" @click=${()=>e.apply(i=>o.fix(i))}>${o.fixLabel}</button></div>`)}
        ${t.length>1?m`<button type="button" class="hme-tb hme-wide" @click=${()=>e.apply(o=>jo(o,n))}>${ya(t.length)}</button>`:v}`,t.length===0?void 0:m`<span class="hme-amber">${t.length} to fix</span>`)}`}overlay(e){if(this.tool==="draw")return this.draw.overlay(e);let t=this.focus(e),n=[];if(t!==void 0&&t.outline.length>=3){let o=t.outline.map(i=>se(e.toScreen(i))).join("L");n.push(M`<path d=${`M0 0H${e.stage.width}V${e.stage.height}H0ZM${o}Z`} fill="rgba(0,0,0,0.45)" fill-rule="evenodd" pointer-events="none" />`)}return e.toggles.scan&&n.push(...this.scanMarks(e)),n.push(...this.issueMarks(e)),t!==void 0&&n.push(this.roomHandles(e,t)),n.push(...this.toolGhost(e)),M`${n}`}scanMarks(e){return Bo(e.floor,e.scans).map(t=>{let n=t.outline.map(i=>se(e.toScreen(i))).join("L"),o=t.walls.map(i=>`M${se(e.toScreen(i.a))}L${se(e.toScreen(i.b))}`).join("");return M`<g class="hme-scan" data-room=${t.roomId} pointer-events="none">
        <path d=${`M${n}Z`} fill=${Kn} fill-opacity="0.06" stroke="none" />
        <path d=${o} fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="3.5" stroke-dasharray="7 5" />
        <path d=${o} fill="none" stroke=${Kn} stroke-width="1.6" stroke-dasharray="7 5" stroke-opacity="0.9" />
        ${t.openings.map(i=>{let a=e.toScreen(i.a),r=e.toScreen(i.b);return M`<line x1=${$(a[0])} y1=${$(a[1])} x2=${$(r[0])} y2=${$(r[1])} stroke=${Kn} stroke-width="4" stroke-opacity="0.85"
            stroke-dasharray=${i.kind==="window"?"2 3":"none"} />`})}
      </g>`})}issueMarks(e){return Ut(e.floor).map(t=>{let[n,o]=e.toScreen(t.where);if(t.kind==="offSquare"){let l=/(\d+)°/.exec(t.title)?.[1]??"";return M`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} Click to square it.</title>
          <circle cx=${$(n)} cy=${$(o)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${$(n+12)} y=${$(o+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${$(n+34)} y=${$(o+20)} fill="#2a1a00" text-anchor="middle">${l}°</text></g></g>`}let i=`${Math.round(t.amount*100)} cm`,a=t.kind==="overlap"?`Overlap ${i} \xB7 ${t.fixLabel}`:t.kind==="gap"?`Gap ${i} \xB7 ${t.fixLabel}`:`No door \xB7 ${t.fixLabel}`,r=a.length*6.2+18,s=t.kind==="missingDoor";return M`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} ${t.detail}</title>
        <circle cx=${$(n)} cy=${$(o)} r="4" fill=${s?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${$(n-r/2)} y=${$(o+8)} width=${$(r)} height="20" rx="10" fill=${s?"#8e8e93":"#ffb340"} />
        <text x=${$(n)} y=${$(o+22)} fill=${s?"#fff":"#2a1a00"} text-anchor="middle">${a}</text></g></g>`})}roomHandles(e,t){let n=W(t),o=e.selection,i=this.pickedWall(e,t),a=[];if(i!==void 0&&n[i]!==void 0){let s=n[i],l=e.toScreen(s.a),h=e.toScreen(s.b),p=Ni(t,s);if(a.push(M`<line x1=${$(l[0])} y1=${$(l[1])} x2=${$(h[0])} y2=${$(h[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),o?.kind==="wall"&&!this.dragging){let c=[(l[0]+h[0])/2+p[0]*22,(l[1]+h[1])/2+p[1]*22];a.push(M`<g class="hme-tag" pointer-events="none"><rect x=${$(c[0]-27)} y=${$(c[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${$(c[0])} y=${$(c[1]+4)} fill="#fff" text-anchor="middle">${le(s).toFixed(2)} m</text></g>`)}}for(let[s,l]of t.openings.entries()){let h=e.toScreen(l.a),p=e.toScreen(l.b),c=o?.kind==="opening"&&o.opening===s,f=l.kind==="window"?"#8bb8f0":l.kind==="door"?"#ece6da":"#98989d";a.push(M`<g data-hme=${`opening:${s}`} style="cursor:ew-resize">
        <line x1=${$(h[0])} y1=${$(h[1])} x2=${$(p[0])} y2=${$(p[1])} stroke=${c?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${$(h[0])} y1=${$(h[1])} x2=${$(p[0])} y2=${$(p[1])} stroke=${f} stroke-width="3" />
        ${c?M`<circle cx=${$(h[0])} cy=${$(h[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" /><circle cx=${$(p[0])} cy=${$(p[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" />`:v}
      </g>`)}let r=this.sliding!==void 0&&k(this.sliding.roomId,t.id)?this.sliding.index:o?.kind==="opening"?o.opening:void 0;if(r!==void 0&&t.openings[r]!==void 0&&a.push(this.distances(e,t,t.openings[r])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[s,l]of n.entries()){if(le(l)*e.view.scale<40)continue;let h=e.toScreen([(l.a[0]+l.b[0])/2,(l.a[1]+l.b[1])/2]);a.push(M`<circle data-hme=${`mid:${s}`} cx=${$(h[0])} cy=${$(h[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[s,l]of t.outline.entries()){let[h,p]=e.toScreen(l),c=o?.kind==="corner"&&o.corner===s;a.push(M`<circle data-hme=${`corner:${s}`} cx=${$(h)} cy=${$(p)} r="7" fill=${c?"#5b8def":"#fff"} stroke=${c?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return M`<g class="hme-handles">${a}</g>`}distances(e,t,n){let o=xt(t,n),i=o>=0?W(t)[o]:void 0;if(i===void 0)return M``;let a=le(i),r=he(n.a,i.a,i.b).along,s=he(n.b,i.a,i.b).along,l=Math.max(0,Math.min(r,s)),h=Math.min(a,Math.max(r,s)),p=Ni(t,i),c=[(i.b[0]-i.a[0])/a,(i.b[1]-i.a[1])/a],f=b=>{let w=e.toScreen([i.a[0]+c[0]*b,i.a[1]+c[1]*b]);return[w[0]+p[0]*26,w[1]+p[1]*26]},u=[0,l,h,a],g=b=>`M${se([b[0]-p[0]*5,b[1]-p[1]*5])}L${se([b[0]+p[0]*5,b[1]+p[1]*5])}`,y=[[0,l,!1],[l,h,!0],[h,a,!1]];return M`<g class="hme-dist" pointer-events="none">
      <path d=${`M${se(f(0))}L${se(f(a))}${u.map(b=>g(f(b))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${y.filter(([b,w])=>w-b>.02).map(([b,w,P])=>{let E=f((b+w)/2);return M`<g class="hme-tag"><rect x=${$(E[0]-25)} y=${$(E[1]-9)} width="50" height="18" rx="9" fill=${P?"#5b8def":"#2c2c2e"} />
          <text x=${$(E[0])} y=${$(E[1]+4)} fill="#fff" text-anchor="middle">${(w-b).toFixed(2)} m</text></g>`})}
    </g>`}toolGhost(e){let t=this.hoverAt;if(t===void 0)return[];let n=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let o=Gn(e,t,Li,this.focus(e));if(o!==void 0){let i=this.tool==="window"?1.2:.9,a=le(o.seg),r=Math.min(i,a),s=Math.min(Math.max(he(t,o.seg.a,o.seg.b).along,r/2),a-r/2),l=[(o.seg.b[0]-o.seg.a[0])/a,(o.seg.b[1]-o.seg.a[1])/a],h=e.toScreen([o.seg.a[0]+l[0]*(s-r/2),o.seg.a[1]+l[1]*(s-r/2)]),p=e.toScreen([o.seg.a[0]+l[0]*(s+r/2),o.seg.a[1]+l[1]*(s+r/2)]);n.push(M`<line x1=${$(h[0])} y1=${$(h[1])} x2=${$(p[0])} y2=${$(p[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&V(e.floor,t)!==void 0){let[o,i]=e.toScreen(t),a=e.px(1),r=e.px(2.6);n.push(M`<g pointer-events="none" opacity="0.7"><rect x=${$(o-a/2)} y=${$(i-r/2)} width=${$(a)} height=${$(r)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(s=>M`<line x1=${$(o-a/2)} x2=${$(o+a/2)} y1=${$(i-r/2+r*s/8)} y2=${$(i-r/2+r*s/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let o=e.toScreen(this.first.a),i=e.toScreen(this.snap(e,t,this.first.a));if(this.tool==="split"){let a=Math.max(Math.hypot(i[0]-o[0],i[1]-o[1]),1e-6),r=[(i[0]-o[0])/a,(i[1]-o[1])/a],s=Math.hypot(e.stage.width,e.stage.height);n.push(M`<line x1=${$(o[0]-r[0]*s)} y1=${$(o[1]-r[1]*s)} x2=${$(o[0]+r[0]*s)} y2=${$(o[1]+r[1]*s)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else n.push(M`<line x1=${$(o[0])} y1=${$(o[1])} x2=${$(i[0])} y2=${$(i[1])} stroke="#ece6da" stroke-width=${$(Math.max(e.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);n.push(M`<circle cx=${$(o[0])} cy=${$(o[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return n}snap(e,t,n){return Dn(e.floor,t,e.view.scale,{...n===void 0?{}:{from:n},...e.toggles.grid?{grid:ye}:{}})}pointerDown(e,t,n){if(this.tool==="draw")return this.draw.pointerDown(e,t,n);if(t.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let o=Gn(e,n,Li,this.focus(e));if(o===void 0)return!1;let i=this.tool,a=o.room.id,r=o.room.openings.length,s=o.wall;return e.apply(l=>Et(l,a,s,{kind:i,at:n}),{select:{kind:"opening",roomId:a,opening:r}})&&this.setTool(e,"select"),!0}case"stairs":{let o=V(e.floor,n);if(o===void 0)return!1;let i=o.id;return e.apply(a=>Co(a,i,n),{select:{kind:"room",roomId:i}})&&this.setTool(e,"select"),!0}case"split":case"inner":return this.twoPoints(e,n);default:return this.pick(e,t,n)}}twoPoints(e,t){if(this.first===void 0){let a=V(e.floor,t)??this.focus(e);return a===void 0?!1:(this.first={roomId:a.id,a:this.snap(e,t)},e.select({kind:"room",roomId:a.id}),!0)}let{roomId:n,a:o}=this.first,i=this.snap(e,t,o);if(this.first=void 0,Math.hypot(i[0]-o[0],i[1]-o[1])<.1)return e.redraw(),!0;if(this.tool==="inner"){let a=e.doc.floors.flatMap(s=>s.rooms).find(s=>k(s.id,n)),r=a===void 0?0:tn(a).length;return e.apply(s=>Lo(s,n,o,i),{select:{kind:"wall",roomId:n,wall:r}})?this.setTool(e,"select"):e.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(e,n,o,i),!0}async split(e,t,n,o){let i=e.floor.rooms.find(s=>k(s.id,t)),a=await e.ask({title:"Name the new room",label:"Name",value:i===void 0?"Room":`${C(i)} 2`,ok:"Split the room"});if(a===void 0)return;let r=e.newId();e.apply(s=>zo(s,t,n,o,r,a),{select:{kind:"room",roomId:r}})?this.setTool(e,"select"):e.note("err","That line does not cut the room in two. Draw it right across the room.")}pick(e,t,n){let o=this.focus(e),i=t.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[a,r]=i.split(/:(.*)/s);if(a==="issue"){let p=Ut(e.floor).find(c=>c.id===r);return p!==void 0&&e.apply(c=>p.fix(c)),!0}let s=Number(r);if(o!==void 0&&a==="corner"&&Number.isInteger(s))return this.cornerDrag(e,t,o,s),!0;if(o!==void 0&&a==="mid"&&Number.isInteger(s))return this.midDrag(e,t,o,s),!0;if(o!==void 0&&a==="opening"&&Number.isInteger(s))return this.openingDrag(e,t,o,s),!0;let l=Gn(e,n,wa,o);if(l!==void 0)return this.wallAt=he(n,l.seg.a,l.seg.b).point,e.select({kind:"wall",roomId:l.room.id,wall:l.wall}),!0;let h=V(e.floor,n);return h===void 0?!1:(e.select({kind:"room",roomId:h.id}),!0)}cornerTo(e,t,n,o){let i=e.floor.rooms.filter(s=>!k(s.id,t.id)).flatMap(s=>s.outline),a=10/e.view.scale;for(let s of i)if(Math.hypot(s[0]-o[0],s[1]-o[1])<=a)return[s[0],s[1]];let r=o;if(e.toggles.grid&&(r=[Math.round(r[0]/ye)*ye,Math.round(r[1]/ye)*ye]),e.toggles.square){let s=fo(e.floor.rooms.flatMap(y=>tn(y))),l=Math.cos(s),h=Math.sin(s),p=y=>[y[0]*l+y[1]*h,-y[0]*h+y[1]*l],[c,f]=p(r),u=t.outline.length,g=8/e.view.scale;for(let y of[(n+u-1)%u,(n+1)%u]){let[b,w]=p(t.outline[y]);Math.abs(c-b)<=g&&(c=b),Math.abs(f-w)<=g&&(f=w)}r=[c*l-f*h,c*h+f*l]}return r}cornerDrag(e,t,n,o){let i=n.id,a;e.drag(t,{move:r=>{this.dragging=!0;let s=this.cornerTo(e,n,o,r);a=s,e.preview(l=>Se(l,i,o,s))},end:(r,s,l)=>{this.dragging=!1,e.preview(void 0);let h=a,p={kind:"corner",roomId:i,corner:o};l&&h!==void 0?e.apply(c=>Se(c,i,o,h),{select:p}):e.select(p)},cancel:()=>this.stopDrag(e)})}midDrag(e,t,n,o){let i=n.id,a=W(n)[o],r=Ht(e.doc,i,o),s=r?.floors.flatMap(f=>f.rooms).find(f=>k(f.id,i));if(a===void 0||r===void 0||s===void 0)return;let l=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],h=s.outline.reduce((f,u,g)=>Math.hypot(u[0]-l[0],u[1]-l[1])<Math.hypot(s.outline[f][0]-l[0],s.outline[f][1]-l[1])?g:f,0),p=f=>u=>{let g=Ht(u,i,o);return g===void 0||f===void 0?g:Se(g,i,h,f)},c;e.drag(t,{move:f=>{this.dragging=!0,c=this.cornerTo(e,s,h,f),e.preview(p(c))},end:(f,u,g)=>{this.dragging=!1,e.preview(void 0),e.apply(p(g?c:void 0),{select:{kind:"corner",roomId:i,corner:h}})},cancel:()=>this.stopDrag(e)})}openingDrag(e,t,n,o){let i=n.id,a=n.openings[o];if(a===void 0)return;let r={kind:"opening",roomId:i,opening:o},s=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],l,h;e.select(r),e.drag(t,{move:p=>{l??=p,this.dragging=!0,this.sliding={roomId:i,index:o};let c=[s[0]+p[0]-l[0],s[1]+p[1]-l[1]];h=c,e.preview(f=>cn(f,i,o,c))},end:(p,c,f)=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let u=h;f&&u!==void 0&&e.apply(g=>cn(g,i,o,u),{select:r})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.dragging=!1,this.sliding=void 0,e.preview(void 0)}hover(e,t){if(this.tool==="draw"){this.draw.hover(e,t);return}this.tool!=="select"&&(this.hoverAt=t,e.redraw())}keyDown(e,t){if(this.tool==="draw"&&this.draw.active&&(t.key==="Enter"||t.key==="Backspace"||t.key==="Delete"))return this.draw.keyDown(e,t);let n=ae(t,!1);if(typeof n=="object"&&"letter"in n){let o=ga(n.letter);return o===void 0?!1:(this.setTool(e,o),!0)}if(n==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(e,"select"),!0;if(n==="delete"){let o=e.selection;if(o?.kind==="corner")e.apply(i=>Pt(i,o.roomId,o.corner),{select:{kind:"room",roomId:o.roomId}});else if(o?.kind==="opening")e.apply(i=>Tt(i,o.roomId,o.opening),{select:{kind:"room",roomId:o.roomId}});else if(o?.kind==="wall")e.apply(i=>mn(i,o.roomId,o.wall),{select:{kind:"room",roomId:o.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(e){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.draw.stop(),this.tool="select",e.redraw()}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.square?"on":""}" aria-pressed=${e.toggles.square?"true":"false"}
        title="A dragged corner lines up with the corners beside it" @click=${()=>e.setToggle("square",!e.toggles.square)}>Snap to 90°</button>
      <button type="button" class="hme-tb ${e.toggles.grid?"on":""}" aria-pressed=${e.toggles.grid?"true":"false"}
        @click=${()=>e.setToggle("grid",!e.toggles.grid)}>Grid 5 cm</button>
      ${e.scans===void 0?v:m`<button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"}
        title=${$a} @click=${()=>e.setToggle("scan",!e.toggles.scan)}>Show scan as it was</button>`}`}pill(e){if(this.tool==="draw")return m`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?m`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(e)}}>Close the room</button>`:v}
        <button type="button" class="hme-tb" @click=${()=>this.setTool(e,"select")}>Cancel</button>`;if(this.tool!=="select"){let a={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in a room to put stairs there"};return m`<span class="hme-pill-name">${a[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(e,"select")}>Cancel</button>`}let t=this.focus(e),n=e.selection;if(t===void 0||n===void 0||this.dragging)return v;let o=t.id,i=C(t);if(n.kind==="wall"){let a=n.wall,r=this.wallAt,s=Tn(t,a,i).replace(", "," \xB7 ");return m`<span class="hme-pill-name">${s}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,a,"window",r)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,a,"door",r)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,a,r)}>Add a corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(l=>hn(l,o,a))}>Straighten</button>`}if(n.kind==="corner")return m`<span class="hme-pill-name">${i} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(a=>Pt(a,o,n.corner),{select:{kind:"room",roomId:o}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(a=>ne(a,o))}>Square the corners</button>`;if(n.kind==="opening"){let a=t.openings[n.opening];return a===void 0?v:m`<span class="hme-pill-name">${ve(a)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(r=>Tt(r,o,n.opening),{select:{kind:"room",roomId:o}})}>Remove</button>`}return m`<span class="hme-pill-name">${i}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(a=>ne(a,o))}>Square the corners</button>`}addHere(e,t,n,o,i){let a=t.id,r=t.openings.length;e.apply(s=>Et(s,a,n,{kind:o,...i===void 0?{}:{at:i}}),{select:{kind:"opening",roomId:a,opening:r}})}cornerHere(e,t,n,o){let i=t.id,a=p=>Ht(p,i,n,o),r=a(e.doc)?.floors.flatMap(p=>p.rooms).find(p=>k(p.id,i)),s=W(t)[n],l=o??(s===void 0?void 0:[(s.a[0]+s.b[0])/2,(s.a[1]+s.b[1])/2]),h=r===void 0||l===void 0?-1:r.outline.reduce((p,c,f)=>Math.hypot(c[0]-l[0],c[1]-l[1])<Math.hypot(r.outline[p][0]-l[0],r.outline[p][1]-l[1])?f:p,0);e.apply(a,{select:h<0?{kind:"room",roomId:i}:{kind:"corner",roomId:i,corner:h}})}inspector(e){let t=this.focus(e),n=e.selection;if(t===void 0||n===void 0){let p=Ut(e.floor);return H("Shape",m`<p class="hme-text">Pick a room, then a wall or a corner. Drag a corner to move it; a corner two rooms share moves for both.</p>
        <p class="hme-text dim">${p.length===0?"The scan check found nothing to fix on this floor.":`The scan check found ${I(p.length,"thing")} to fix. They are marked in amber.`}</p>`)}let o=t.id;if(n.kind==="corner")return this.cornerCard(e,t,n.corner);let i=this.pickedWall(e,t);if(i===void 0){let p=Jn(e.scans,o),c=p!==void 0&&Ko(t,p)?p:void 0;return H(C(t),m`
        ${O("Corners",m`<span class="hme-val">${t.outline.length}</span>`)}
        ${O("Walls",m`<span class="hme-val">${W(t).length}</span>`)}
        ${O("Wall height",R({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:f=>e.apply(u=>We(u,o,f))}))}
        ${B("Click a wall to change it or put a door or window in it. Drag a corner to move it, or the dot in a wall's middle to add a corner.")}
        ${c===void 0?v:B("Its shape has changed since the iPhone scanned it.")}
        <div class="hme-row-end">
          ${c===void 0?v:m`<button type="button" class="hme-tb" title=${Ma} @click=${()=>e.apply(f=>Go(f,o,c))}>Back to the scan</button>`}
          <button type="button" class="hme-tb" @click=${()=>e.apply(f=>ne(f,o))}>Square the corners</button>
        </div>`)}let a=W(t)[i],r=t.openings.map((p,c)=>({o:p,i:c})).filter(({o:p})=>xt(t,p)===i),s=n.kind==="opening"?t.openings[n.opening]:void 0,l=le(a),h=p=>{let c=t.openings.length;e.apply(f=>Et(f,o,i,{kind:p}),{select:{kind:"opening",roomId:o,opening:c}})};return m`
      ${H("Wall",m`
        ${O("Room",m`<span class="hme-val strong">${Tn(t,i,C(t))}</span>`)}
        ${O("Length",R({label:"Length",value:l,unit:"m",min:.1,max:200,set:p=>e.apply(c=>Ao(c,o,i,p))}))}
        ${O("Thickness",R({label:"Thickness",value:a.t,unit:"m",min:.01,max:1,set:p=>e.apply(c=>Fo(c,o,i,p))}))}
        ${O("Height",R({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:p=>e.apply(c=>We(c,o,p))}))}
        ${B("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-row-end indent">
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>hn(p,o,i))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>ne(p,o))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,i,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>e.apply(p=>mn(p,o,i),{select:{kind:"room",roomId:o}})}>Remove</button>
        </div>`)}
      ${H("On this wall",m`
        ${r.map(({o:p,i:c})=>{let f=he(p.a,a.a,a.b).along,u=he(p.b,a.a,a.b).along,g=n.kind==="opening"&&n.opening===c;return m`<button type="button" class="hme-list-row ${g?"on":""}" @click=${()=>e.select({kind:"opening",roomId:o,opening:c})}>
            <span class="hme-grow">${ve(p)}</span><span class="mono dim">${Pn(Math.abs(u-f))} · ${Pn(Math.max(0,Math.min(f,u)))} in</span></button>`})}
        ${r.length===0?m`<p class="hme-empty-line">Nothing on this wall.</p>`:v}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>h("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>h("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>h("opening")}>＋ Way through</button>
        </div>`)}
      ${s===void 0||n.kind!=="opening"?v:this.openingCard(e,t,n.opening,s)}`}openingCard(e,t,n,o){let i=t.id,a=Math.hypot(o.b[0]-o.a[0],o.b[1]-o.a[1]),r=o.z1-o.z0;return H(ve(o),m`
      <div class="hme-pics">${va.map(s=>U({label:s.label,picture:xa[s.label],on:o.kind===s.kind&&o.style===s.style,click:()=>e.apply(l=>Ve(l,i,n,{kind:s.kind,style:s.style??null}))}))}</div>
      ${O("Width",R({label:"Width",value:a,unit:"m",min:.1,max:20,set:s=>e.apply(l=>Ve(l,i,n,{width:s}))}))}
      ${O("From floor",R({label:"From floor",value:o.z0,unit:"m",min:0,max:20,set:s=>e.apply(l=>Ve(l,i,n,{z0:s,z1:s+r}))}),m`<span class="hme-l short">Tall</span>`,R({label:"Tall",value:r,unit:"m",min:.05,max:20,set:s=>e.apply(l=>Ve(l,i,n,{z1:o.z0+s}))}))}
      ${B("Drag it along the wall. The plan shows the space to each corner.")}
      <div class="hme-row-end indent"><button type="button" class="hme-tb danger" @click=${()=>e.apply(s=>Tt(s,i,n),{select:{kind:"room",roomId:i}})}>Remove ${ve(o).toLowerCase()}</button></div>`)}cornerCard(e,t,n){let o=t.id,i=t.outline[n];if(i===void 0)return m``;let a=e.floor.rooms.filter(r=>!k(r.id,o)&&r.outline.some(s=>Math.hypot(s[0]-i[0],s[1]-i[1])<=.02));return H("Corner",m`
      ${O("Room",m`<span class="hme-val strong">${C(t)}</span>`)}
      ${O("Left, top",R({label:"Corner left",value:i[0],unit:"m",set:r=>e.apply(s=>Se(s,o,n,[r,i[1]]))}),R({label:"Corner top",value:i[1],unit:"m",set:r=>e.apply(s=>Se(s,o,n,[i[0],r]))}))}
      ${B(a.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${a.map(C).join(", ")}, which move${a.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(r=>Pt(r,o,n),{select:{kind:"room",roomId:o}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(r=>ne(r,o))}>Square the corners</button>
      </div>`)}},ka={select:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,draw:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`,split:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},xa={Door:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var Xt={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function Ha(d,e){if(!Ct(d))return"Home style";let t=vn(d,e),n=i=>Object.hasOwn(d,Yo[i]),o=[];return n("look")&&o.push(Xt[t.look].title),n("turn")&&o.push(`turned ${t.turn}\xB0`),n("names")&&o.push(t.names?"room names":"no room names"),n("devices")&&o.push(t.devices==="all"?"every device":t.devices==="none"?"no devices":"lights only"),n("furniture")&&o.push(t.furniture?"furniture":"no furniture"),n("glow")&&o.push(t.glow?"glow":"no glow"),`Own look: ${o.join(", ")}`}var Ki=(d,e)=>typeof d=="number"&&Number.isFinite(d)?d:e;function Pa(d,e){let t=lo(d);return so(d).flatMap(n=>{if(Qt(bt(n))!=="home_map")return[];let o=n,i=po(bt(n)),a=e?.floors.find(c=>k(c.id,i)),r=typeof o.homeMapRoomId=="string"?o.homeMapRoomId:void 0,s=r===void 0?void 0:a?.rooms.find(c=>k(c.id,r)),l=`${Ki(n.colSpan,1)}\xD7${Ki(n.rowSpan,1)}`,p=(typeof n.customLabel=="string"&&n.customLabel.trim()!==""?n.customLabel.trim():void 0)??(s?.name?.trim()?`${s.name.trim()} only`:a===void 0||(e?.floors.length??0)<=1?"Home map":L(a));return[{pageId:t,pageName:vt(d),tileId:typeof n.id=="string"?n.id:"",what:p,size:l,own:Ct(o),words:Ha(o,e),look:vn(o,e).look}]})}function Gi(d,e){return Object.values(d?.pages??{}).map(n=>n?.item).filter(n=>gt(n)).sort((n,o)=>vt(n).localeCompare(vt(o))).flatMap(n=>Pa(n,e))}function Bi(d){let e=!1;if(!Array.isArray(d.pages))return;let t=d.pages.map(n=>{if(!gt(n)||!Array.isArray(n.items))return n;let o=n.items.map(i=>!gt(i)||Qt(bt(i))!=="home_map"||!Ct(i)?i:(e=!0,Jo(i)));return{...n,items:o}});return e?{...d,pages:t}:void 0}var Vt={width:112,height:68},Ea={width:94,height:94,radius:34},Ta={width:188,height:94,radius:22},Sa={width:60,height:94,radius:18},Ca=1.6,Yt=class{constructor(){this.id="style";this.usesState="idle";this.busy=!1}style(e){let t=Ie(e.doc);return this.turnLive===void 0?t:{...t,turn:this.turnLive}}set(e,t){e.apply(n=>Zo(n,t))}rail(e){let t=this.style(e),n=e.hass?.states;return m`<div class="hme-h hme-pad">Looks</div>
      <div class="hme-looks">
        ${Vn.map(o=>{let i=o===t.look,a=fe({floor:e.floor,states:n,...t,look:o,names:!1,width:Vt.width,height:Vt.height});return m`<button type="button" class="hme-look ${i?"on":""}" aria-pressed=${i?"true":"false"} @click=${()=>this.set(e,{look:o})}>
            <svg viewBox=${`0 0 ${Vt.width} ${Vt.height}`} style=${`background:${ie(o,.5)}`} aria-hidden="true">${a}</svg>
            <span>${Xt[o].title}</span></button>`})}
      </div>
      <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`}stage(e){let t=this.style(e),n=Re.includes(t.look),o=Xt[t.look],{width:i,height:a}=e.stage,r=Math.min(Math.max(i/760,1),2.6),s=Math.max(i/r,1),l=Math.max(a/r,1),h=i<=0?v:fe({floor:e.floor,states:e.hass?.states,...t,width:Math.max(s-48,1),height:Math.max(l-96,1),tileHeight:l,icons:e.icons});return m`<div class="hme-style-col">
      <div class="hme-stage hme-style-big ${n?"turns":""}" style=${`background:${ie(t.look,r)}`}
        @pointerdown=${p=>{n&&this.turnDrag(e,p,t.turn)}}>
        <div class="hme-style-title" style=${`color:${Dt(t.look)}`}><strong>${o.title}</strong><span>${o.hint}</span></div>
        <svg class="hme-svg" viewBox=${`0 0 ${s.toFixed(1)} ${l.toFixed(1)}`} role="img" aria-label=${`The floor in the ${o.title} look`}>
          <g transform="translate(24 64)">${h}</g></svg>
        ${n?m`<span class="hme-style-turn" style=${`color:${Dt(t.look)}`}>Drag to turn · ${t.turn}°</span>`:v}
      </div>
      <section class="hme-card hme-style-tiles">
        ${this.face(e,t,Ea,"Watch tile 2 \xD7 2",!0)}
        ${this.face(e,t,Ta,"iPhone tile 4 \xD7 2",!0)}
        ${this.face(e,t,Sa,"iPhone full map",!1)}
      </section>
    </div>`}face(e,t,n,o,i){let a=Math.min(Math.max(e.stage.width/1100,Ca),2.6),r=e.hass?.states,s=i?ii(n.width,n.height):{x:4,y:4,width:n.width-8,height:n.height-8},l=fe({floor:e.floor,states:r,...t,width:s.width,height:s.height,tileHeight:i?n.height:0,icons:e.icons}),h=ct(e.floor,r),p=6*a;return m`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${n.width*a}px;height:${n.height*a}px;border-radius:${n.radius}px;background:${ie(t.look,a)}`}>
        <svg viewBox=${`0 0 ${s.width} ${s.height}`} aria-hidden="true"
          style=${`left:${s.x*a}px;top:${s.y*a}px;width:${s.width*a}px;height:${s.height*a}px`}>${l}</svg>
        ${i&&n.height>90?m`<span class="hme-face-title" style=${`left:${p}px;top:${p}px;font-size:${11*a}px;color:${Dt(t.look)}`}>${Ia(e.floor)}</span>`:v}
        ${i?m`<span class="hme-face-words" style=${`left:${p}px;bottom:${p}px;font-size:${10*a}px;color:${oi(t.look,h>0)}`}>${ut(h)}</span>`:v}
      </div>
      <figcaption>${o}</figcaption>
    </figure>`}turnDrag(e,t,n){if(t.button!==0)return;let o=t.currentTarget,i=t.clientX;try{o.setPointerCapture?.(t.pointerId)}catch{}let a=s=>{let h=n+(s.clientX-i)*.5;h=((h+180)%360+360)%360-180,this.turnLive=Math.round(h),e.redraw()},r=()=>{o.removeEventListener("pointermove",a),o.removeEventListener("pointerup",r),o.removeEventListener("pointercancel",r);let s=this.turnLive;this.turnLive=void 0,s!==void 0&&s!==n?this.set(e,{turn:s}):e.redraw()};o.addEventListener("pointermove",a),o.addEventListener("pointerup",r),o.addEventListener("pointercancel",r)}overlay(){return v}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}inspector(e){let t=this.style(e),n=Re.includes(t.look),o=(i,a,r)=>m`<button type="button" class="hme-chip sel ${a?"on":""}" aria-pressed=${a?"true":"false"} @click=${r}>${i}</button>`;return m`
      ${H("Home style",m`
        <p class="hme-text">Every Home map tile starts with this look. A tile can still pick its own in its Map card.</p>
        <div class="hme-r"><span class="hme-l">Turn</span>
          <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${j(String(t.turn))} ?disabled=${!n} aria-label="Turn the model"
            style=${ke(t.turn,-180,180)}
            @input=${i=>{this.turnLive=Number(i.target.value),e.redraw()}}
            @change=${i=>{this.turnLive=void 0,this.set(e,{turn:Number(i.target.value)})}} />
          <span class="hme-val mono hme-w48">${n?`${t.turn}\xB0`:"flat"}</span></div>
        <div class="hme-r"><span class="hme-l">Room names</span>${o(t.names?"Shown":"Hidden",t.names,()=>this.set(e,{names:!t.names}))}</div>
        <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
          ${o("Lights",t.devices==="lights",()=>this.set(e,{devices:"lights"}))}
          ${o("All",t.devices==="all",()=>this.set(e,{devices:"all"}))}
          ${o("None",t.devices==="none",()=>this.set(e,{devices:"none"}))}</div></div>
        <div class="hme-r"><span class="hme-l">Furniture</span>${o(t.furniture?"Shown":"Hidden",t.furniture,()=>this.set(e,{furniture:!t.furniture}))}</div>
        <div class="hme-r"><span class="hme-l">Light glow</span>${o(t.glow?"On":"Off",t.glow,()=>this.set(e,{glow:!t.glow}))}</div>`)}

      ${H("Floors",m`
        ${e.floor.rooms.length===0?m`<p class="hme-empty-line">No rooms on this floor yet.</p>`:v}
        ${e.floor.rooms.map(i=>{let a=wt(i);return m`<div class="hme-r top"><span class="hme-l">${C(i)}</span><div class="hme-chips">
            ${o(`Auto: ${st[a]}`,i.finish===void 0,()=>e.apply(r=>Pe(r,i.id,void 0)))}
            ${pt.map(r=>o(st[r],i.finish===r,()=>e.apply(s=>Pe(s,i.id,r))))}
          </div></div>`})}`,"shows in Plan, Night and Warm")}

      ${this.usesCard(e)}`}loadUses(e){let t=e.hass;this.usesState!=="idle"||t===void 0||(this.usesState="loading",ft(t).then(n=>{this.summary=n,this.usesState="done",e.redraw()},()=>{this.usesState="error",e.redraw()}))}usesCard(e){if(this.loadUses(e),this.usesState!=="done")return H("Used on",m`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let t=Gi(this.summary,e.doc),n=t.filter(o=>o.own);return H(`Used on ${I(t.length,"tile")}`,m`
      ${t.length===0?m`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:v}
      ${t.map(o=>this.useRow(e,o))}
      ${n.length===0?v:m`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(e,n)}}>${this.busy?"Saving\u2026":`Use the home style on all ${n.length}`}</button>`}
      ${this.message===void 0?v:m`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(e,t){return m`<div class="hme-use">
      <i style=${`background:${ie(t.look,.2)}`}></i>
      <div><span>${t.pageName} · ${t.what} ${t.size}</span><small>${t.words}</small></div>
      ${e.openPage===void 0?v:m`<button type="button" class="hme-tb" @click=${()=>e.openPage?.(t.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(e,t){let n=e.hass;if(n===void 0||this.busy)return;let o=[...new Set(t.map(r=>r.pageId))];if(!await e.confirm({title:`Use the home style on ${I(t.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${o.length===1?"The page is":`The ${o.length} pages are`} saved for every watch and iPhone that shows ${o.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,e.redraw();let a=0;for(let r of o)try{let s=await ao(n,"pages",r),l=Bi(s.document);l!==void 0&&await ro(n,"pages",r,s.revision,l)}catch{a+=1}this.busy=!1,this.message=a===0?"Done: those tiles follow the home style now.":`${I(a,"page")} could not be saved. Try again, or open ${a===1?"it":"them"} to see why.`,this.usesState="idle",e.redraw()}};function Ia(d){return d.name.trim()===""?"Home map":d.name.trim()}var Ra="Update the Wrist Assistant integration to see the home map here.",Da="No home map yet. Scan your rooms with the Wrist Assistant app on an iPhone or iPad with LiDAR (the Pro models). The map shows here once it is saved.",Oa=4,_a=140;function Aa(d){return d.kind==="saving"?"Saving\u2026":d.kind==="error"?"Not saved":"Saved"}var Fa={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},T=class extends Un{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.bundleUrl=void 0;this.onHome=void 0;this.onOpenPage=void 0;this.unsupported=!1;this.loading=!1;this.mode="arrange";this.viewKind="flat";this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,square:!0,grid:!1,measure:!1,live:!0,scan:!1};this.measure={};this.floorMenu=!1;this.model3d=!1;this.daylight=!1;this.spaceHeld=!1;this.tick=0;this.modes={arrange:new zt,shape:new qt,devices:new Wt,style:new Yt};this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=v;this.loading3d=!1;this.failed3d=!1;this.onKey=t=>{if(this.dialog!==void 0||this.session===void 0||this.renderRoot?.querySelector?.(".hme-sheet")!=null)return;let n=(typeof t.composedPath=="function"?t.composedPath()[0]:void 0)??t.target;if(xn(n))return;let o=ae(t,!1);if(o==="undo"||o==="redo"){t.preventDefault?.(),o==="undo"?this.undo():this.redo();return}if(ci(n))return;if(t.key===" "&&!t.repeat){this.spaceHeld=!0,t.preventDefault?.();return}let i=this.context();if(i!==void 0&&this.viewKind!=="model"&&this.modes[this.mode].keyDown?.(i,t)===!0){t.preventDefault?.();return}switch(o){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.selection=void 0;return;case"zoomIn":this.zoomBy(et);return;case"zoomOut":this.zoomBy(1/et);return;case"fit":this.fit();return}};this.onKeyUp=t=>{t.key===" "&&(this.spaceHeld=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++,this.drop3d()}willUpdate(t){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load(),this.loadPages());let n=this.baseFloor();this.needFit&&n!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let t=this.renderRoot.querySelector?.(".hme-dialog");t instanceof Element&&t!==this.focusedDialog?(this.focusedDialog=t,(t.querySelector("input")??t.querySelector(".primary"))?.focus?.(),t.querySelector("input")?.select?.()):t===null&&(this.focusedDialog=void 0);let n=this.renderRoot.querySelector?.(".hme-stage");n instanceof Element&&n!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(o=>{let i=o[o.length-1]?.contentRect;i!==void 0&&this.resizeStage(i.width,i.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(n),this.observed=n),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},_a)),this.sync3d()}input3d(){let t=this.shownFloor();if(t===void 0)return;let n=this.selection,o=n===void 0||n.kind==="pin"||n.kind==="pins"?void 0:n.kind==="object"?{roomId:n.roomId,object:n.object}:{roomId:n.roomId};return{floor:t,states:this.toggles.live?this.hass?.states:void 0,mark:o,daylight:this.daylight}}sync3d(){let t=this.renderRoot.querySelector?.(".hme-3d-host"),n=this.input3d();if(!(t instanceof HTMLElement)||n===void 0||this.bundleUrl===void 0){this.drop3d();return}if(this.scene3d!==void 0){this.scene3d.attach(t),this.scene3d.update(n,this.modelTurnNow());return}if(this.loading3d||this.failed3d)return;this.loading3d=!0;let o=_n(this.bundleUrl);Ft().then(i=>{if(this.loading3d=!1,!!this.isConnected){try{this.scene3d??=new i.HomeMapScene3D(o)}catch{this.failed3d=!0}this.tick++}},()=>{this.loading3d=!1,this.failed3d=!0,this.tick++})}drop3d(){this.scene3d?.dispose(),this.scene3d=void 0}turnBack(){this.modelTurn=void 0,this.scene3d?.frameFloor(Ie(this.doc).turn??wn)}async load(t=!1){let n=this.hass;if(!n||!this.capable)return;let o=++this.loadSeq;t||(this.loading=this.session===void 0,this.loadError=void 0);try{let i=await lt(n);if(o!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:ht(i?.doc)??null,rev:typeof i?.rev=="number"?i.rev:0}),this.loadScans()}catch(i){if(o!==this.loadSeq)return;let{code:a,message:r}=Me(i);a==="unknown_command"?this.unsupported=!0:(!t||this.session===void 0)&&(this.loadError=r)}this.loading=!1}async loadScans(){let t=this.hass;if(t)try{this.scans=await oo(t)}catch{}}async loadPages(){let t=this.hass;if(t)try{let n=ho(await ft(t));this.pages=mo(n,"pages").map(o=>({id:o.id,name:o.name}))}catch{this.pages=[]}}show(t){let n=this.hass;if(n&&Jt(n,t),this.session===void 0)this.session=new At($i(this.hassOrThrow()),t,()=>this.afterChange(),o=>{this.hass&&Jt(this.hass,o)}),this.needFit=!0;else if(!this.session.load(t))return;this.afterChange()}hassOrThrow(){let t=this.hass;if(t===void 0)throw new Error("no hass");return t}afterChange(){let t=this.session?.doc?.floors??[];t.some(n=>k(n.id,this.floorId))||(this.floorId=t[0]?.id,this.needFit=!0),ri(this.baseFloor(),this.selection)||(this.selection=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let t=this.doc?.floors??[];return t.find(n=>k(n.id,this.floorId))??t[0]}shownFloor(){let t=this.baseFloor();return t===void 0||this.previewDoc===void 0?t:this.previewDoc.floors.find(n=>k(n.id,t.id))??t}apply(t,n={}){let o=this.session;return o===void 0?!1:(this.previewDoc=void 0,o.apply(t)?(n.floorId!==void 0&&(this.floorId=n.floorId),n.select!==void 0&&(this.selection=n.select??void 0),this.afterChange(),!0):(this.tick++,!1))}preview(t){let n=this.doc;this.previewDoc=t===void 0||n===null?void 0:t(n)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(t){this.selection=t}setMode(t,n){let o=this.context();o!==void 0&&t!==this.mode&&this.modes[this.mode].leave?.(o),this.mode=t,n!==void 0&&(this.selection=n)}setFloor(t){let n=this.context();n!==void 0&&this.modes[this.mode].leave?.(n),this.floorId=t,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(t,n){this.toggles={...this.toggles,[t]:n},t==="measure"&&(this.measure={}),t==="scan"&&n&&this.loadScans()}confirm(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(n=>{this.dialog={kind:"confirm",...t,done:o=>{this.dialog=void 0,n(o)}}})}ask(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(n=>{this.dialog={kind:"ask",...t,done:o=>{this.dialog=void 0,n(o)}}})}resizeStage(t,n){let o=this.stageSize.width===0;this.stageSize={width:t,height:n},(o||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:t,height:n}=this.stageSize;t<=0||(this.view=Mn(this.baseFloor(),t,n),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}zoomBy(t,n){this.view!==void 0&&(this.view=kn(this.view,t,n??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let t=this.doc,n=this.shownFloor();if(t===null||n===void 0)return;let o=this.view??{scale:40,ox:0,oy:0},i=this.session;return{hass:this.hass,icons:this.icons,doc:t,floor:n,selection:this.selection,mode:this.mode,view:o,stage:this.stageSize,toggles:this.toggles,pages:this.pages??[],areas:no(this.hass),scans:this.scans,furnitureBase:this.bundleUrl===void 0?void 0:_n(this.bundleUrl),canUndo:i?.canUndo??!1,canRedo:i?.canRedo??!1,toScreen:a=>li(o,a),px:a=>a*o.scale,toPlan:(a,r)=>this.toPlan(a,r),apply:(a,r)=>this.apply(a,r),preview:a=>this.preview(a),select:a=>this.select(a),setMode:(a,r)=>this.setMode(a,r),setFloor:a=>this.setFloor(a),setToggle:(a,r)=>this.setToggle(a,r),drag:(a,r)=>this.drag(a,r),undo:()=>this.undo(),redo:()=>this.redo(),confirm:a=>this.confirm(a),ask:a=>this.ask(a),newId:()=>en(),note:(a,r)=>{this.session!==void 0&&(this.session.note={kind:a,text:r}),this.tick++},redraw:()=>{this.tick++},openPage:this.onOpenPage}}toPlan(t,n){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return De(this.view??{scale:40,ox:0,oy:0},[t-o.left,n-o.top])}stagePoint(t){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[t.clientX-n.left,t.clientY-n.top]}drag(t,n){let o=this.stageEl;if(o===void 0)return;this.endDrag?.();let i=t.clientX,a=t.clientY,r=!1,s,l=0,h=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,p=()=>{l=0,s!==void 0&&n.move(this.toPlan(s.clientX,s.clientY),s)};try{o.setPointerCapture?.(t.pointerId)}catch{}let c=y=>{let b=y;b.pointerId===t.pointerId&&(!r&&Math.hypot(b.clientX-i,b.clientY-a)<Oa||(r=!0,s=b,h===void 0?p():l===0&&(l=h(p))))},f=y=>{let b=y;b.pointerId===t.pointerId&&(u(),l!==0&&(cancelAnimationFrame(l),p()),n.end(this.toPlan(b.clientX,b.clientY),b,r))},u=()=>{o.removeEventListener("pointermove",c),o.removeEventListener("pointerup",f),o.removeEventListener("pointercancel",f);try{o.releasePointerCapture?.(t.pointerId)}catch{}this.endDrag===g&&(this.endDrag=void 0)},g=()=>{u(),l!==0&&(cancelAnimationFrame(l),l=0),n.cancel?.()};o.addEventListener("pointermove",c),o.addEventListener("pointerup",f),o.addEventListener("pointercancel",f),this.endDrag=g}onStageDown(t){if(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dialog!==void 0)return;if(t.pointerType==="touch"&&(this.touches.set(t.pointerId,[t.clientX,t.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(t);return}if(t.button===1||this.spaceHeld){t.preventDefault?.(),this.pan(t,!1);return}if(t.button!==0)return;let n=this.context();if(n===void 0)return;if(this.toggles.measure){let i=this.toPlan(t.clientX,t.clientY),a=this.measure;this.measure=a.a===void 0||a.b!==void 0?{a:i}:{a:a.a,b:i};return}let o=this.toPlan(t.clientX,t.clientY);if(this.modes[this.mode].pointerDown?.(n,t,o)===!0){t.preventDefault?.();return}this.pan(t,!0)}onStageMove(t){if(this.stageEl=t.currentTarget,this.touches.has(t.pointerId)&&this.touches.set(t.pointerId,[t.clientX,t.clientY]),t.buttons!==0||this.viewKind==="model")return;let n=this.toPlan(t.clientX,t.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:n});let o=this.context();o!==void 0&&this.modes[this.mode].hover?.(o,n)}onStageLeave(){let t=this.context();t!==void 0&&this.modes[this.mode].hover?.(t,void 0)}onStageUp(t){this.touches.delete(t.pointerId)}onStageDrag(t){this.stageEl=t.currentTarget;let n=this.context();n===void 0||this.viewKind==="model"||this.dialog!==void 0||this.modes[this.mode].dragOver?.(n,this.toPlan(t.clientX,t.clientY),t)===!0&&(t.preventDefault?.(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))}onStageDragLeave(t){let n=t.relatedTarget,o=t.currentTarget;if(n!==null&&o!==null&&typeof o.contains=="function"&&o.contains(n))return;let i=this.context();i!==void 0&&this.modes[this.mode].dragOver?.(i,void 0,t)}onStageDrop(t){this.stageEl=t.currentTarget;let n=this.context();n===void 0||this.viewKind==="model"||(t.preventDefault?.(),this.modes[this.mode].drop?.(n,this.toPlan(t.clientX,t.clientY),t))}pan(t,n){let o=this.view;if(o===void 0)return;let i=t.clientX,a=t.clientY;this.drag(t,{move:(r,s)=>{this.view={...o,ox:o.ox+s.clientX-i,oy:o.oy+s.clientY-a},this.userMoved=!0},end:(r,s,l)=>{!l&&n&&(this.selection=void 0)}})}pinch(){let t=this.stageEl,n=this.view,o=[...this.touches.keys()];if(t===void 0||n===void 0||o.length<2)return;let i=()=>o.map(f=>this.touches.get(f)),[a,r]=i(),s=Math.max(Math.hypot(r[0]-a[0],r[1]-a[1]),1),l=t.getBoundingClientRect(),h=[(a[0]+r[0])/2-l.left,(a[1]+r[1])/2-l.top],p=f=>{let u=f;if(!this.touches.has(u.pointerId))return;this.touches.set(u.pointerId,[u.clientX,u.clientY]);let[g,y]=i(),b=Math.max(Math.hypot(y[0]-g[0],y[1]-g[1]),1),w=[(g[0]+y[0])/2-l.left,(g[1]+y[1])/2-l.top],P=kn(n,b/s,h);this.view={...P,ox:P.ox+w[0]-h[0],oy:P.oy+w[1]-h[1]},this.userMoved=!0},c=f=>{this.touches.delete(f.pointerId),t.removeEventListener("pointermove",p),t.removeEventListener("pointerup",c),t.removeEventListener("pointercancel",c)};t.addEventListener("pointermove",p),t.addEventListener("pointerup",c),t.addEventListener("pointercancel",c)}turnModel(t){let n=this.modelTurnNow(),o=t.clientX;this.drag(t,{move:(i,a)=>{let r=n+(a.clientX-o)*.5;r=((r+180)%360+360)%360-180,this.modelTurn=Math.round(r)},end:()=>{}})}modelTurnNow(){return this.modelTurn??Ie(this.doc).turn??wn}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let t=Ie(this.doc).look;return Re.includes(t)?t:"night"}onWheel(t){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=t.currentTarget,t.preventDefault?.();let n=t.deltaMode===1?16:t.deltaMode===2?400:1;if(t.ctrlKey||t.metaKey){this.zoomBy(Math.exp(-t.deltaY*n*.0025),this.stagePoint(t));return}this.view={...this.view,ox:this.view.ox-t.deltaX*n,oy:this.view.oy-t.deltaY*n},this.userMoved=!0}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(m`<b>${Ra}</b>`);if(this.loadError!==void 0)return this.calm(m`<span>Could not read the home map: ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(m`Loading…`);let t=this.doc;if(t===null||t.floors.length===0)return this.calm(m`<b>${Da}</b>`);let n=this.context(),o=this.modes[this.mode],i=this.session.note;return m`<div class="hme">
      ${this.renderBar(t,n)}
      ${i===void 0?v:m`<div class="hme-note ${i.kind}" role="status"><span>${i.text}</span>
        <button class="hme-link" @click=${()=>this.session?.dismissNote()}>Dismiss</button></div>`}
      <div class="hme-body">
        <aside class="hme-rail" aria-label="${$n[this.mode]} tools">${o.rail(n)}</aside>
        <section class="hme-stage-wrap">${o.stage?.(n)??this.renderStage(n,o)}</section>
        <aside class="hme-insp" aria-label="Inspector">${o.inspector(n)}</aside>
      </div>
      ${o.sheet?.(n)??v}
      ${this.renderDialog()}
    </div>`}calm(t){return m`<div class="hme-calm"><div class="hme-empty">${t}</div></div>`}renderBar(t,n){let o=this.baseFloor(),i=this.session?.state??{kind:"saved"},a=Hn();return m`<header class="hme-bar">
      ${this.onHome===void 0?v:m`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Home</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">BETA</span>
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${Rn(o)}
          <span class="hme-floor-t"><span>${L(o)}</span><small>${I(o.rooms.length,"room")} · ${I(o.pins.length,"device")}</small></span>
          <span class="hme-caret" aria-hidden="true">▾</span>
        </button>
        ${this.floorMenu?this.renderFloorMenu(t,o):v}
      </div>
      <span class="hme-flex"></span>
      <div class="hme-seg" role="tablist" aria-label="Edit mode">
        ${ai.map(r=>m`<button type="button" role="tab" class=${r===this.mode?"on":""} aria-selected=${r===this.mode?"true":"false"}
          @click=${()=>this.setMode(r)}>${$n[r]}</button>`)}
      </div>
      <span class="hme-flex"></span>
      ${this.modes[this.mode].stage!==void 0?v:m`<div class="hme-seg" role="group" aria-label="View">
        <button type="button" class=${this.viewKind==="flat"?"on":""} aria-pressed=${this.viewKind==="flat"?"true":"false"} @click=${()=>{this.viewKind="flat"}}>Flat</button>
        <button type="button" class=${this.viewKind==="model"?"on":""} aria-pressed=${this.viewKind==="model"?"true":"false"} @click=${()=>{this.viewKind="model"}}>Model</button>
        <button type="button" class=${this.viewKind==="both"?"on":""} aria-pressed=${this.viewKind==="both"?"true":"false"}
          title="The plan to edit on the left, the model following it on the right" @click=${()=>{this.viewKind="both"}}>Both</button>
      </div>`}
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${a?"\u2318Z":"Ctrl+Z"})`} ?disabled=${!n.canUndo} @click=${()=>this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${a?"\u21E7\u2318Z":"Ctrl+Shift+Z"})`} ?disabled=${!n.canRedo} @click=${()=>this.redo()}>↷</button>
      <span class="hme-status ${i.kind}" role="status" title=${i.kind==="error"?i.text:v}><span class="hme-status-dot"></span>${Aa(i)}</span>
    </header>`}renderFloorMenu(t,n){return m`<div class="hme-pop" role="menu" aria-label="Floors">
      ${t.floors.map(o=>m`<div class="hme-pop-row ${k(o.id,n.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(o.id)}>
          ${Rn(o)}<span class="hme-floor-t"><span>${L(o)}</span><small>${I(o.rooms.length,"room")} · ${I(o.pins.length,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${L(o)}`} @click=${()=>{this.renameFloorAsk(o)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${t.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${L(o)}`}
          ?disabled=${t.floors.length===1} @click=${()=>{this.deleteFloorAsk(o)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let t=this.doc;if(t===null)return;let n=Math.max(...t.floors.map(a=>a.story))+1,o=await this.ask({title:"Add a floor",label:"Name",value:n===1?"Upstairs":`Floor ${n+1}`,ok:"Add floor"});if(o===void 0)return;let i=en();this.apply(a=>Mo(a,{id:i,name:o,story:n}),{floorId:i,select:null})&&(this.needFit=!0)}async renameFloorAsk(t){this.floorMenu=!1;let n=await this.ask({title:"Rename floor",label:"Name",value:t.name||L(t),ok:"Rename"});n!==void 0&&this.apply(o=>Mt(o,t.id,n))}async deleteFloorAsk(t){this.floorMenu=!1,await this.confirm({title:`Delete ${L(t)}?`,text:`Its ${I(t.rooms.length,"room")} and ${I(t.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(o=>ko(o,t.id),{select:null})}renderStage(t,n){let{width:o,height:i}=this.stageSize,a=this.viewKind==="model",r=this.viewKind==="both",s=a?v:n.pill?.(t)??v,l=this.spaceHeld?"grab":a?"ew-resize":this.toggles.measure?"crosshair":n.cursor?.(t)??"default",h=t.floor.rooms.length===0,p=this.model3d&&this.bundleUrl!==void 0,c=r?p?m`<div class="hme-stage model hme-split-r hme-3d">
      ${this.render3d(t)}
      ${this.renderModelDock(!1)}
    </div>`:m`<div class="hme-stage model hme-split-r" style=${`background:${ie(this.modelLookNow())}`}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(o,1)} ${Math.max(i,1)}`} style="cursor:ew-resize"
        role="img" aria-label=${`Model of ${L(t.floor)}`}
        @pointerdown=${f=>this.onModelDown(f)}>
        ${this.renderModel(t,o,i)}
      </svg>
      ${this.renderModelDock(!1)}
    </div>`:v;return a&&p?m`<div class="hme-stage model hme-3d">
        ${this.render3d(t)}
        ${this.renderDock(t,n)}
      </div>`:m`<div class="hme-stage ${a?"model":""} ${r?"hme-split-l":""}" style=${a?`background:${ie(this.modelLookNow())}`:""}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(o,1)} ${Math.max(i,1)}`} style=${`cursor:${l}`}
        role="img" aria-label=${`Plan of ${L(t.floor)}`}
        @pointerdown=${f=>this.onStageDown(f)}
        @pointermove=${f=>this.onStageMove(f)}
        @pointerup=${f=>this.onStageUp(f)}
        @pointercancel=${f=>this.onStageUp(f)}
        @pointerleave=${()=>this.onStageLeave()}
        @wheel=${f=>this.onWheel(f)}
        @dragover=${f=>this.onStageDrag(f)}
        @dragleave=${f=>this.onStageDragLeave(f)}
        @drop=${f=>this.onStageDrop(f)}>
        ${a?this.renderModel(t,o,i):this.renderPlan(t,n,o,i)}
      </svg>
      ${s===v?v:m`<div class="hme-pill">${s}</div>`}
      ${a?v:n.stageExtra?.(t)??v}
      ${h&&!a?m`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{this.setMode("arrange");let f=this.context();f&&this.modes.arrange.draw.start(f)}}>＋ Draw a room by hand</button></div>`:v}
      ${this.renderDock(t,n)}
    </div>${c}`}onModelDown(t){this.dialog!==void 0||t.button!==0||(this.stageEl=t.currentTarget,this.floorMenu=!1,this.turnModel(t))}renderPlan(t,n,o,i){let a=this.view;if(a===void 0||o<=0)return v;let r=this.planArt(t.floor,o,i,n.drawsPins===!0?"none":"all"),s=a.scale/(this.artScale||a.scale);return M`${this.background(a,o,i)}
      <g class="hme-art" transform=${`translate(${a.ox.toFixed(2)} ${a.oy.toFixed(2)}) scale(${s.toFixed(5)})`} pointer-events="none">${r}</g>
      <g class="hme-labels" pointer-events="none">${this.labels(t)}</g>
      <g class="hme-overlay">${n.overlay(t)}</g>
      ${this.toggles.measure?this.measureMarks(t):v}`}planArt(t,n,o,i){let a=this.toggles.live?this.hass?.states:void 0,r=this.artScale||this.view.scale,s=`${za(t)}|${Bn(a)}|${r}|${n}|${o}|${this.iconsTick}|${Bn(this.icons)}|${i}`;return s!==this.artKey&&(this.artKey=s,this.artHeld=fe({floor:t,states:a,look:"plan",names:!1,devices:i,furniture:!0,glow:!0,width:n,height:o,icons:this.icons,frame:{scale:r,ox:0,oy:0}})),this.artHeld}background(t,n,o){let i=this.mode==="shape"?.05:.1,a=20;if(this.toggles.grid)for(a=i*t.scale;a<8;)a*=10;let r=(t.ox%a+a)%a,s=(t.oy%a+a)%a;return M`<defs><pattern id="hme-bg" width=${a} height=${a} patternUnits="userSpaceOnUse" patternTransform=${`translate(${r.toFixed(1)} ${s.toFixed(1)})`}>
        ${this.toggles.grid?M`<path d=${`M${a} 0V${a}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:M`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${n} height=${o} fill="url(#hme-bg)" />`}labels(t){return t.floor.rooms.map(n=>{let o=X(n),i=pe(n.outline);if(o===void 0||i===void 0)return v;let a=C(n),r=nt(n),s=(i.maxX-i.minX)*t.view.scale,l=(i.maxY-i.minY)*t.view.scale,h=a.length*7.4+22;if(h>s*.95||l<26)return v;let p=Math.max(h,r.length*5.8+22)<=s*.95&&l>=48,c=p?Math.max(h,r.length*5.8+22):h,f=p?36:22,[u,g]=t.toScreen(o);return M`<g class="hme-label"><rect x=${(u-c/2).toFixed(1)} y=${(g-f/2).toFixed(1)} width=${c.toFixed(1)} height=${f} rx=${p?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${u.toFixed(1)} y=${(g+(p?-3:4.5)).toFixed(1)} fill="#fff" font-size=${p?13:12} font-weight="600" text-anchor="middle">${a}</text>
        ${p?M`<text x=${u.toFixed(1)} y=${(g+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${r}</text>`:v}</g>`})}measureMarks(t){let n=this.measure;if(n.a===void 0)return M`<g class="hme-measure"></g>`;let o=n.b??n.hover,i=t.toScreen(n.a);if(o===void 0)return M`<g class="hme-measure" pointer-events="none"><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /></g>`;let a=t.toScreen(o),r=Math.hypot(o[0]-n.a[0],o[1]-n.a[1]),s=[(i[0]+a[0])/2,(i[1]+a[1])/2];return M`<g class="hme-measure" pointer-events="none">
      <line x1=${i[0]} y1=${i[1]} x2=${a[0]} y2=${a[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${n.b===void 0?"6 4":"none"} />
      <circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /><circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(s[0]-32).toFixed(1)} y=${(s[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${s[0].toFixed(1)} y=${(s[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${r.toFixed(2)} m</text></g></g>`}renderModel(t,n,o){if(n<=0)return v;let i=this.selection,a=i===void 0||i.kind==="pin"||i.kind==="pins"?void 0:t.floor.rooms.find(l=>k(l.id,i.roomId)),r=i?.kind==="object"?a?.objects[i.object]:void 0,s=r!==void 0?{box:r}:a!==void 0?{outline:a.outline}:void 0;return fe({mark:s,floor:t.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:n,height:o})}render3d(t){let n=this.failed3d?"The 3D view needs WebGL, which this browser has turned off.":this.scene3d===void 0?"Loading the 3D view\u2026":void 0;return m`<div class="hme-3d-host" role="img" aria-label=${`3D model of ${L(t.floor)}. Drag to turn it, scroll to zoom.`}></div>
      ${n===void 0?v:m`<div class="hme-3d-note">${n}</div>`}`}renderModelDock(t,n){let o=this.model3d&&this.bundleUrl!==void 0,i=o?void 0:this.modelLookNow(),a=r=>r?"true":"false";return m`<div class="hme-dock">
      ${Re.map(r=>m`<button type="button" class="hme-tb ${r===i?"on":""}" aria-pressed=${a(r===i)} @click=${()=>{this.modelLook=r,this.model3d=!1}}>${Fa[r]}</button>`)}
      ${this.bundleUrl===void 0?v:m`<button type="button" class="hme-tb ${o?"on":""}" aria-pressed=${a(o)}
        title="The floor in real 3D, with its furniture and each light lit as it is now" @click=${()=>{this.model3d=!0}}>3D</button>`}
      ${o?m`<span class="hme-vsep"></span>
        <button type="button" class="hme-tb ${this.daylight?"":"on"}" aria-pressed=${a(!this.daylight)} title="Night: only the lights that are on light the rooms"
          @click=${()=>{this.daylight=!1}}>Lights</button>
        <button type="button" class="hme-tb ${this.daylight?"on":""}" aria-pressed=${a(this.daylight)} title="Day: the sun comes in through the windows"
          @click=${()=>{this.daylight=!0}}>Daylight</button>`:v}
      <span class="hme-vsep"></span>
      <button type="button" class="hme-tb" title=${o?"Show the whole floor from the home style's turn":"Back to the home style's turn"} @click=${()=>this.turnBack()}>⟲ Turn back</button>
      ${t&&n!==void 0?m`<span class="hme-vsep"></span>${n}`:v}
    </div>`}renderDock(t,n){let o=m`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
      title="Draw what Home Assistant's devices are doing now" @click=${()=>this.setToggle("live",!this.toggles.live)}><span class="hme-live-dot"></span>Live states</button>`;if(this.viewKind==="model")return this.renderModelDock(!0,o);let i=this.stageSize.width>0?Mn(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,a=this.view===void 0||i===void 0?100:pi(this.view,i);return m`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" @click=${()=>this.zoomBy(1/et)}>−</button>
      <span class="hme-zoom mono">${a}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" @click=${()=>this.zoomBy(et)}>＋</button>
      <button type="button" class="hme-tb" @click=${()=>this.fit()}>Fit</button>
      <span class="hme-vsep"></span>
      ${n.dock?.(t)??v}
      <button type="button" class="hme-tb ${this.toggles.measure?"on":""}" aria-pressed=${this.toggles.measure?"true":"false"}
        title="Click two points to measure between them" @click=${()=>this.setToggle("measure",!this.toggles.measure)}>Measure</button>
      <span class="hme-vsep"></span>${o}
    </div>`}renderDialog(){let t=this.dialog;if(t===void 0)return v;let n=()=>t.kind==="confirm"?t.done(!1):t.done(void 0),o=i=>{t.kind==="confirm"?t.done(!0):t.done((i?.querySelector("input")?.value??t.value).trim()||t.value)};return m`<div class="hme-scrim" @pointerdown=${i=>{i.target===i.currentTarget&&n()}}>
      <div class="hme-dialog" role="dialog" aria-modal="true" aria-label=${t.title}
        @keydown=${i=>{i.key==="Escape"&&(i.stopPropagation(),n()),i.key==="Enter"&&(i.preventDefault(),o(i.currentTarget))}}>
        <h3>${t.title}</h3>
        ${t.kind==="confirm"?t.text===void 0?v:m`<p>${t.text}</p>`:m`<label class="hme-dialog-field"><span>${t.label}</span><input type="text" maxlength="100" .value=${t.value} autofocus /></label>`}
        <div class="hme-dialog-row">
          <button type="button" class="hme-tb" @click=${n}>Cancel</button>
          <button type="button" class="hme-tb primary ${t.kind==="confirm"&&t.danger===!0?"danger-fill":""}"
            @click=${i=>o(i.currentTarget.closest(".hme-dialog"))}>${t.ok}</button>
        </div>
      </div>
    </div>`}static{this.styles=[io,Xn,Hi]}};S([Z({attribute:!1})],T.prototype,"hass",2),S([Z({type:Boolean,reflect:!0})],T.prototype,"narrow",2),S([Z({attribute:!1})],T.prototype,"icons",2),S([Z({attribute:!1})],T.prototype,"iconsTick",2),S([Z({attribute:!1})],T.prototype,"capable",2),S([Z({attribute:!1})],T.prototype,"bundleUrl",2),S([Z({attribute:!1})],T.prototype,"onHome",2),S([Z({attribute:!1})],T.prototype,"onOpenPage",2),S([A()],T.prototype,"unsupported",2),S([A()],T.prototype,"loading",2),S([A()],T.prototype,"loadError",2),S([A()],T.prototype,"floorId",2),S([A()],T.prototype,"selection",2),S([A()],T.prototype,"mode",2),S([A()],T.prototype,"viewKind",2),S([A()],T.prototype,"view",2),S([A()],T.prototype,"artScale",2),S([A()],T.prototype,"stageSize",2),S([A()],T.prototype,"toggles",2),S([A()],T.prototype,"scans",2),S([A()],T.prototype,"measure",2),S([A()],T.prototype,"floorMenu",2),S([A()],T.prototype,"dialog",2),S([A()],T.prototype,"modelLook",2),S([A()],T.prototype,"model3d",2),S([A()],T.prototype,"daylight",2),S([A()],T.prototype,"modelTurn",2),S([A()],T.prototype,"pages",2),S([A()],T.prototype,"spaceHeld",2),S([A()],T.prototype,"tick",2);var Wi=new WeakMap,La=1;function Bn(d){if(d===void 0)return 0;let e=Wi.get(d);return e===void 0&&Wi.set(d,e=La++),e}var za=d=>Bn(d);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",T);export{Oa as HOME_MAP_DRAG_SLOP,Da as HOME_MAP_EMPTY_TEXT,Ra as HOME_MAP_UPDATE_TEXT,T as WaHomeMapEditor,Aa as homeMapSaveWords};
