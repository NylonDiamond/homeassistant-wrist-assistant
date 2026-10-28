import{$ as kn,A as Ke,Aa as An,B as hn,Ba as ho,C as je,Ca as qe,D as mn,Da as Et,E as cn,Ea as mo,F as wt,Fa as Ln,G as un,Ga as Fn,H as no,Ha as zn,I as fn,Ia as Nn,J as gn,Ja as Ve,K as vn,Ka as co,L as bn,La as Tt,M as He,Ma as Kn,N as Ge,Na as jn,O as yn,Oa as St,P as wn,Pa as ue,Q as Mn,Qa as Ye,R as Pe,Ra as Ze,S as io,Sa as Je,T as We,Ta as Gn,U as Be,Ua as Ie,V as Ee,Va as Wn,W as Mt,Wa as ie,X as $n,Xa as It,Y as Ue,Ya as Bn,Z as ce,Za as Un,_ as ao,_a as fe,a as le,aa as xn,b as Jt,ba as $t,c as Qt,ca as Te,d as pe,da as Hn,e as ze,ea as Pn,f as q,fa as ro,g as V,ga as oe,h as eo,ha as kt,i as to,ia as xt,j as nn,ja as En,k as vt,ka as so,l as bt,la as Tn,m as oo,ma as Ht,n as yt,na as lo,o as an,oa as Xe,p as rn,pa as Pt,q as he,qa as Sn,r as ke,ra as In,s as B,sa as Cn,t as xe,ta as Rn,u as me,ua as Dn,v as sn,va as On,w as dn,wa as po,x as ln,xa as ne,y as pn,ya as Se,z as Ne,za as _n}from"./chunk-MWHNHDWH.js";import{c as ct,j as Yo,k as Zo,na as tn,oa as on}from"./chunk-5H6OWAXC.js";import"./chunk-7T6IEW6M.js";import"./chunk-J2WKPEGJ.js";import{b as Zt}from"./chunk-S3NOJWAC.js";import{$ as qo,B as Fe,C as lt,D as Go,E as x,H as z,I,J as pt,K as se,L as de,N as Wo,P as te,Q as Bo,R as ht,S as mt,Y as Uo,Z as Xo,_ as j,fa as Vt,ga as K,k as No,m as dt,n as Ko,q as Le,r as jo}from"./chunk-JVXAFTND.js";import{i as ut,l as Jo,m as Qo,n as ft,r as gt,s as Yt,t as en}from"./chunk-CPEKF3CW.js";import{$g as st,Fh as $e,Nh as Vo,ah as Fo,b as Ao,d as m,e as $,g as v,hg as qt,j as Lo,k as ee,l as L,wh as zo}from"./chunk-7M7K7CM3.js";import{db as Me}from"./chunk-OM34V22N.js";import{a as S}from"./chunk-LO2NM3CE.js";var Xn=["arrange","shape","devices","style"],uo={arrange:"Arrange",shape:"Shape",devices:"Devices",style:"Style"};function Ce(d){return d===void 0||d.kind==="pin"||d.kind==="pins"?void 0:d.roomId}function qn(d,e){if(e===void 0)return!0;if(d===void 0)return!1;if(e.kind==="pin")return d.pins.some(o=>x(o.id,e.pinId));if(e.kind==="pins")return e.pinIds.every(o=>d.pins.some(n=>x(n.id,o)));let t=d.rooms.find(o=>x(o.id,e.roomId));if(t===void 0)return!1;switch(e.kind){case"room":return!0;case"wall":return B(t)[e.wall]!==void 0;case"corner":return t.outline[e.corner]!==void 0;case"opening":return t.openings[e.opening]!==void 0;case"object":return t.objects[e.object]!==void 0}}var Vn=4,Yn=2400;function Zn(d,e){return[d.ox+e[0]*d.scale,d.oy+e[1]*d.scale]}function Ct(d,e){return[(e[0]-d.ox)/d.scale,(e[1]-d.oy)/d.scale]}function fo(d,e,t,o=56,n=96){let a=d===void 0||d.rooms.length===0&&d.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:pt(d),s=Math.max(a.maxX-a.minX,1),r=Math.max(a.maxY-a.minY,1),l=ni(Math.min(Math.max(e-o*2,40)/s,Math.max(t-n*2,40)/r),Vn,Yn);return{scale:l,ox:e/2-(a.minX+a.maxX)/2*l,oy:t/2-(a.minY+a.maxY)/2*l}}function go(d,e,t){let o=ni(d.scale*e,Vn,Yn),n=o/d.scale;return{scale:o,ox:t[0]-(t[0]-d.ox)*n,oy:t[1]-(t[1]-d.oy)*n}}function Jn(d,e){return Math.round(d.scale/e.scale*100)}var Qe=1.25;function Qn(d){if(typeof d!="object"||d===null)return;let e=d;return{tag:typeof e.tagName=="string"?e.tagName.toUpperCase():"",type:typeof e.type=="string"?e.type.toLowerCase():"text",editable:e.isContentEditable===!0}}var ei=["button","submit","reset","image"],_i=["checkbox","radio","range","color","file"];function vo(d){let e=Qn(d);return e===void 0?!1:e.editable||e.tag==="TEXTAREA"?!0:e.tag==="INPUT"&&!ei.includes(e.type)&&!_i.includes(e.type)}function ti(d){let e=Qn(d);return e===void 0?!1:vo(d)||e.tag==="SELECT"?!0:e.tag==="INPUT"&&!ei.includes(e.type)}function ae(d,e){if(e)return;let t=d.metaKey===!0||d.ctrlKey===!0,o=d.key.length===1?d.key.toLowerCase():d.key;if(t)return o==="z"?d.shiftKey===!0?"redo":"undo":o==="y"?"redo":void 0;if(d.altKey===!0)return;switch(o){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit"}let n=d.shiftKey===!0?.1:.01;if(o==="ArrowLeft")return{nudge:[-n,0]};if(o==="ArrowRight")return{nudge:[n,0]};if(o==="ArrowUp")return{nudge:[0,-n]};if(o==="ArrowDown")return{nudge:[0,n]};if(/^[a-z]$/.test(o)&&d.shiftKey!==!0)return{letter:o}}function bo(){let d=globalThis.navigator,e=`${typeof d?.platform=="string"?d.platform:""} ${typeof d?.userAgent=="string"?d.userAgent:""}`;return/Mac|iPhone|iPad/.test(e)}function oi(){return bo()?"\u2318Z":"Ctrl+Z"}var ni=(d,e,t)=>Math.min(Math.max(d,e),t);function yo(d,e=2){return`${(Math.round(d*10**e)/10**e).toFixed(e)} m`}function et(d,e=2){let t=(Math.round(d*10**e)/10**e).toFixed(e);return/^-0(\.0*)?$/.test(t)?t.slice(1):t}function wo(d){let e=d.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(e===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(e))return;let t=Number(e);if(Number.isFinite(t))return/cm$/i.test(d.trim())?t/100:t}function Rt(d){if(d.outline.length<3)return{width:0,depth:0,area:0};let{a0:e,a1:t,c0:o,c1:n}=oo(d,Qt(d));return{width:t-e,depth:n-o,area:Math.abs(yt(d.outline))}}function tt(d){let{width:e,depth:t}=Rt(d);return`${e.toFixed(1)} \xD7 ${t.toFixed(1)} m`}function ii(d){if(d.outline.length<3)return d.outline.slice();let{a0:e,a1:t,c0:o,c1:n,point:i}=oo(d,Qt(d));return[i(e,o),i(t,o),i(t,n),i(e,n)]}function Ai(d,e){let t=B(d)[e];if(t===void 0)return"inner";let o=Math.max(Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),1e-9),n=-(t.b[1]-t.a[1])/o,i=(t.b[0]-t.a[0])/o,a=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],s=Math.max(t.t,.1)+.1,r=ze(d.outline,[a[0]+n*s,a[1]+i*s]),l=ze(d.outline,[a[0]-n*s,a[1]-i*s]);if(r&&l)return"inner";if(r)n=-n,i=-i;else if(!l){let h=q(d);h!==void 0&&(h[0]-a[0])*n+(h[1]-a[1])*i>0&&(n=-n,i=-i)}return Math.abs(n)>Math.abs(i)?n>0?"right":"left":i>0?"bottom":"top"}function Mo(d,e,t){let o=Ai(d,e);return`${t}, ${o} wall`}function ge(d){return d.kind==="opening"?"Way through":d.kind==="window"?d.style==="sliding"?"Sliding window":"Window":d.style==="double"?"Double door":d.style==="sliding"?"Sliding door":"Door"}var Li={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function Z(d){let e=Li[d];if(e!==void 0)return e;let t=d.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}function C(d,e,t=`${e}s`){return`${d} ${d===1?e:t}`}function H(d,e,t,o=""){return m`<section class="hme-card ${o}">
    <div class="hme-h">${d}${t===void 0?v:m`<span class="hme-h-end">${t}</span>`}</div>
    ${e}
  </section>`}function O(d,...e){return m`<div class="hme-r"><span class="hme-l">${d}</span>${e}</div>`}function W(d){return m`<p class="hme-hint">${d}</p>`}var ai=3;function Fi(d,e){return d==="\xB0"?1:10**-e}function R(d){let e=d.digits??2,t=d.step??Fi(d.unit,e),o=d.value===void 0?"":et(d.value,e),n=r=>Math.min(Math.max(r,d.min??-1/0),d.max??1/0),i=r=>et(r,e)===o,a=r=>{let l=wo(r.value);if(l===void 0||d.min!==void 0&&l<d.min||d.max!==void 0&&l>d.max||i(l)){r.value=o;return}d.set(l)},s=r=>{let l=r.currentTarget,h=l.querySelector("input");if(h===null||d.disabled===!0||r.button!==0||h.matches(":focus"))return;r.preventDefault();let p=d.value,u=r.clientX,g=!1,c=p;try{l.setPointerCapture(r.pointerId)}catch{}let f=b=>{if(p===void 0)return;let w=b.clientX-u;if(!g&&Math.abs(w)<ai)return;g||l.classList.add("scrubbing"),g=!0;let P=b.shiftKey?10:b.altKey?.1:1;c=n(Number((p+(w-Math.sign(w)*ai)*t*P).toFixed(e+(b.altKey?1:0)))),h.value=et(c,e),d.preview?.(c)},y=b=>{if(l.removeEventListener("pointermove",f),l.removeEventListener("pointerup",y),l.removeEventListener("pointercancel",y),l.classList.remove("scrubbing"),!g){h.focus(),h.select();return}d.preview?.(void 0),b.type!=="pointercancel"&&c!==void 0&&!i(c)?d.set(c):h.value=o};l.addEventListener("pointermove",f),l.addEventListener("pointerup",y),l.addEventListener("pointercancel",y)};return m`<span class="hme-in hme-num ${d.disabled===!0?"off":""}" style=${d.width===void 0?v:`flex:0 0 ${d.width}`}
    title=${d.disabled===!0?v:"Drag sideways to change it, click to type"} @pointerdown=${s}>
    ${d.tag===void 0?v:m`<span class="hme-ntag" aria-hidden="true">${d.tag}</span>`}
    <input type="text" inputmode="decimal" aria-label=${d.label} .value=${K(o)} ?disabled=${d.disabled===!0}
      placeholder=${d.value===void 0?"Mixed":""}
      @change=${r=>a(r.target)}
      @keydown=${r=>{let l=r.target;if(r.key==="Enter"&&l.blur(),r.key==="Escape"&&(l.value=o,l.blur()),(r.key==="ArrowUp"||r.key==="ArrowDown")&&d.value!==void 0){r.preventDefault();let h=wo(l.value)??d.value,p=n(Number((h+(r.key==="ArrowUp"?1:-1)*t*(r.shiftKey?10:1)).toFixed(e)));l.value=et(p,e),i(p)||d.set(p)}}} />${d.unit===void 0?v:m`<span class="hme-unit">${d.unit}</span>`}</span>`}function ot(...d){return m`<div class="hme-fields" style=${`--n:${d.length}`}>${d}</div>`}function nt(d,...e){return m`<div class="hme-group"><div class="hme-gl">${d}</div>${e}</div>`}function it(d){return m`<span class="hme-in"><input type="text" aria-label=${d.label} maxlength=${d.max??100} placeholder=${d.placeholder??""}
    .value=${K(d.value)}
    @change=${e=>{let t=e.target.value;t.trim()!==d.value.trim()&&d.set(t)}}
    @keydown=${e=>{e.key==="Enter"&&e.target.blur()}} /></span>`}function ve(d){return m`<span class="hme-in hme-sel ${d.cls??""}"><select aria-label=${d.label} @change=${e=>d.set(e.target.value)}>
    ${d.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0} .selected=${K(e.value===d.value)}>${e.label}</option>`)}
  </select></span>`}function $o(d){return m`<span class="hme-menu ${d.cls??""}"><select aria-label=${d.label} @change=${e=>{let t=e.target,o=t.value;t.value="",o!==""&&d.pick(o)}}>
    <option value="" .selected=${K(!0)}>${d.label}</option>
    ${d.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0}>${e.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function U(d){return m`<button type="button" class="hme-pic ${d.on?"on":""}" aria-pressed=${d.on?"true":"false"} title=${d.title??d.label}
    @click=${d.click}>${d.picture}<span>${d.label}</span></button>`}function Re(d){return m`<button type="button" class="hme-chip ${d.on?"":"off"}" aria-pressed=${d.on?"true":"false"} aria-label=${d.label}
    @click=${d.click}>${d.on?d.onText:d.offText}</button>`}var zi={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},ko={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function xo(d){return m`<span class="hme-sw" style=${`background:${zi[d]}`}></span>`}var ri=d=>d.map(([e,t])=>`${Math.round(e*10)/10},${Math.round(t*10)/10}`).join(" ");function Ho(d,e=34,t=24){let o=d?.rooms??[];if(o.length===0)return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
      <rect x="1" y="1" width=${e-2} height=${t-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let n=pt(d),i=4,a=Math.min((e-i*2)/Math.max(n.maxX-n.minX,.5),(t-i*2)/Math.max(n.maxY-n.minY,.5)),s=e/2-(n.minX+n.maxX)/2*a,r=t/2-(n.minY+n.maxY)/2*a;return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${e-1} height=${t-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${o.map(l=>$`<polygon points=${ri(l.outline.map(([h,p])=>[s+h*a,r+p*a]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function si(d,e,t=76,o=54){let n=d.outline.map(f=>f[0]),i=d.outline.map(f=>f[1]),a=Math.min(...n),s=Math.max(...n),r=Math.min(...i),l=Math.max(...i),h=8,p=Math.min((t-h*2)/Math.max(s-a,.5),(o-h*2)/Math.max(l-r,.5)),u=t/2-(a+s)/2*p,g=o/2-(r+l)/2*p,c=ri(d.outline.map(([f,y])=>[u+f*p,g+y*p]));return m`<svg class="hme-room-thumb" width=${t} height=${o} viewBox=${`0 0 ${t} ${o}`} aria-hidden="true">
    <rect width=${t} height=${o} rx="8" fill="#121010" />
    <polygon points=${c} fill=${ko[vt(d)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${e?$`<circle cx=${t*.58} cy=${o*.42} r=${Math.min(t,o)*.22} fill="#ffb648" opacity="0.35" />`:v}
  </svg>`}function li(d){return{get:()=>st(d),save:(e,t)=>Fo(d,e,t)}}var pi="The map had changed on another device. Your change was saved on top of it.",Ni="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",Ki="The map changed again while saving, so your change was not saved. Try it once more.";function ji(d){return{doc:lt(d?.doc)??null,rev:typeof d?.rev=="number"?d.rev:0}}function di(d,e){let t=typeof e=="function"?e(d):Uo(d,e);if(t===void 0)return;let o=Fe(t);return o.ok?{doc:o.doc}:{text:`Not saved. ${o.message}.`}}async function hi(d,e,t){if(e.doc===null)return{ok:!1,text:"There is no map to change yet."};let o=di(e.doc,t);if(o===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in o)return{ok:!1,text:o.text};try{let a=await d.save(o.doc,e.rev);return{ok:!0,read:{doc:o.doc,rev:a.rev},merged:!1}}catch(a){let{code:s,message:r}=Me(a);if(s!=="conflict")return{ok:!1,text:`Not saved. ${r}`}}let n;try{n=ji(await d.get())}catch(a){return{ok:!1,text:`Not saved. The map changed on another device and could not be read again: ${Me(a).message}`}}let i=n.doc===null?void 0:di(n.doc,t);if(i===void 0)return{ok:!1,text:Ni,read:n};if("text"in i)return{ok:!1,text:i.text,read:n};try{let a=await d.save(i.doc,n.rev);return{ok:!0,read:{doc:i.doc,rev:a.rev},merged:!0}}catch(a){let{code:s,message:r}=Me(a);return{ok:!1,text:s==="conflict"?Ki:`Not saved. ${r}`,read:n}}}function Dt(d){return Array.isArray(d)?`[${d.map(Dt).join(",")}]`:typeof d=="object"&&d!==null?`{${Object.entries(d).filter(([,t])=>t!==void 0).sort(([t],[o])=>t<o?-1:t>o?1:0).map(([t,o])=>`${JSON.stringify(t)}:${Dt(o)}`).join(",")}}`:JSON.stringify(d)}function Gi(d,e){return d===e?!0:d==null||e==null?!1:Dt(d)===Dt(e)}function mi(d,e){return t=>Gi(t,d)?e:void 0}var Ot=class{constructor(e,t,o=()=>{},n=()=>{},i){this.api=e;this.changed=o;this.saved=n;this.state={kind:"saved"};this.queue=[];this.confirmed=t,this.doc=t.doc,this.history=new jn(i)}get busy(){return this.queue.length>0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(e){return this.busy?!1:(this.confirmed=e,this.doc=e.doc,this.history.clear(),this.changed(),!0)}apply(e){let t=this.doc;if(t===null)return!1;let o=e(t);if(o===void 0)return!1;let n=Fe(o);return n.ok?(this.history.push(t),this.doc=n.doc,this.enqueue(e),!0):(this.note={kind:"err",text:`That cannot be saved. ${n.message}.`},this.changed(),!1)}undo(){let e=this.doc;if(e===null)return!1;let t=this.history.undo(e);return t===void 0?!1:(this.doc=t,this.enqueue(mi(e,t)),!0)}redo(){let e=this.doc;if(e===null)return!1;let t=this.history.redo(e);return t===void 0?!1:(this.doc=t,this.enqueue(mi(e,t)),!0)}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}enqueue(e){this.queue.push(e),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0?this.kick():this.changed()}))}async run(){for(;this.queue.length>0;){let e=this.queue.splice(0),t=e.length===1?e[0]:n=>e.reduce((i,a)=>i===void 0?void 0:a(i),n);this.state={kind:"saving"},this.changed();let o=await hi(this.api,this.confirmed,t);if(o.ok){this.confirmed=o.read,this.saved(o.read),o.merged?(this.note={kind:"warn",text:pi},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=o.read.doc);continue}this.queue=[],this.history.clear(),o.read!==void 0&&(this.confirmed=o.read,this.saved(o.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:o.text},this.state={kind:"error",text:o.text},this.changed();return}this.state={kind:"saved"}}rebased(){let e=this.confirmed.doc;if(e===null)return null;let t=[];for(let o of this.queue){let n=o(e);if(n===void 0)continue;let i=Fe(n);i.ok&&(e=i.doc,t.push(o))}return this.queue=t,e}};var ci=Ao`
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
`;function Po(d,e,t,o={}){let n=(o.reach??10)/t,i,a=n;for(let l of[...d.rooms.flatMap(h=>h.outline),...o.corners??[]]){let h=Math.hypot(l[0]-e[0],l[1]-e[1]);h<=a&&(i=l,a=h)}if(i!==void 0)return[i[0],i[1]];let[s,r]=e;if(o.grid!==void 0&&o.grid>0&&(s=Math.round(s/o.grid)*o.grid,r=Math.round(r/o.grid)*o.grid),o.from!==void 0){let l=8/t;Math.abs(e[0]-o.from[0])<=l&&(s=o.from[0]),Math.abs(e[1]-o.from[1])<=l&&(r=o.from[1])}return[Math.round(s*100)/100,Math.round(r*100)/100]}var Oe=.1,be=.05,De=class{constructor(e){this.grid=e;this.active=!1;this.points=[]}start(e){this.active=!0,this.points=[],this.hoverAt=void 0,e.select(void 0),e.redraw()}stop(e){this.active=!1,this.points=[],this.hoverAt=void 0,e?.redraw()}snap(e,t){return Po(e.floor,t,e.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...e.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(e,t){let o=this.points[0];return o!==void 0&&this.points.length>=3&&Math.hypot(t[0]-o[0],t[1]-o[1])*e.view.scale<=10}pointerDown(e,t,o){if(!this.active||t.button!==0)return!1;let n=this.snap(e,o);if(this.closes(e,n))return this.finish(e),!0;let i=this.points[this.points.length-1];return(i===void 0||Math.hypot(n[0]-i[0],n[1]-i[1])>=.05)&&this.points.push(n),e.redraw(),!0}hover(e,t){this.active&&(this.hoverAt=t===void 0?void 0:this.snap(e,t),e.redraw())}keyDown(e,t){return this.active?t.key==="Escape"?(this.stop(e),!0):t.key==="Enter"?(this.points.length>=3&&this.finish(e),!0):t.key==="Backspace"||t.key==="Delete"?(this.points.pop(),e.redraw(),!0):!1:!1}async finish(e){let t=this.points.slice();if(this.stop(e),t.length<3)return;let o=await e.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(o===void 0)return;let n=e.newId(),i=e.floor.id;e.apply(a=>xn(a,i,n,t,o),{select:{kind:"room",roomId:n}})||e.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(e){if(!this.active)return v;let t=this.points.map(r=>e.toScreen(r)),o=this.hoverAt===void 0?void 0:e.toScreen(this.hoverAt),n=this.hoverAt!==void 0&&this.closes(e,this.hoverAt),i=[...t,...o!==void 0?[o]:[]].map(([r,l])=>`${r.toFixed(1)},${l.toFixed(1)}`).join(" "),a=this.points[this.points.length-1],s=a!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-a[0],this.hoverAt[1]-a[1]):0;return $`<g class="hme-draw">
      ${t.length>=3?$`<polygon points=${t.map(([r,l])=>`${r},${l}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:v}
      <polyline points=${i} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${t.map(([r,l],h)=>$`<circle cx=${r} cy=${l} r=${h===0&&n?8:5} fill=${h===0&&n?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${o!==void 0&&!n?$`<circle cx=${o[0]} cy=${o[1]} r="4" fill="#5b8def" />`:v}
      ${o!==void 0&&s>.05?$`<g class="hme-tag"><rect x=${o[0]+10} y=${o[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${o[0]+39} y=${o[1]-13} fill="#fff" text-anchor="middle">${s.toFixed(2)} m</text></g>`:v}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};var at={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},_t=15,Wi=[{a:0,c:0},{c:0},{a:1,c:0},{a:1},{a:1,c:1},{c:1},{a:0,c:1},{a:0}];function Bi(d,e){let t=(Math.atan2(e,d)*180/Math.PI+180)%180;return["ew-resize","nwse-resize","ns-resize","nesw-resize"][Math.round(t/45)%4]}function Ui(d,e){let t=e===0?"":` Its ${C(e,"device")} come${e===1?"s":""} off the map too.`;return`${I(d)} comes off the map.${t} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}function Xi(d){return Math.round(an(d.turn)*10)/10}var F=d=>d.toFixed(1),J=d=>`${d[0].toFixed(1)},${d[1].toFixed(1)}`,At=class{constructor(){this.id="arrange";this.draw=new De(Oe);this.query="";this.open=new Set;this.guides=[];this.dragging=!1;this.resizing=!1}stopDrag(e){this.guides=[],this.dragging=!1,this.resizing=!1,e.preview(void 0)}focus(e){let t=Ce(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>x(o.id,t))}picked(e){let t=e.selection;if(t?.kind!=="object")return;let o=this.focus(e),n=o?.objects[t.object];return o===void 0||n===void 0?void 0:{room:o,index:t.object,object:n}}thingUnder(e,t,o){let n;for(let i of o===void 0?e.floor.rooms:[o])i.objects.forEach((a,s)=>{if(a.hidden===!0)return;let r=to(eo(a));if(!ze(r,t))return;let l=Math.abs(yt(r));(n===void 0||l<n.area)&&(n={thing:{room:i,index:s,object:a},area:l})});return n?.thing}pickThing(e,t,o){e.select({kind:"object",roomId:t.id,object:o})}rail(e){let t=e.floor,o=this.query.trim().toLowerCase(),n=t.rooms.filter(r=>o===""||I(r).toLowerCase().includes(o)),i=o===""?[]:t.pins.filter(r=>j(r,e.hass).toLowerCase().includes(o)||r.entityId.includes(o)),a=e.doc.floors.filter(r=>!x(r.id,t.id)),s=this.focus(e);return m`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a room or device" aria-label="Find a room or device" .value=${K(this.query)}
          @input=${r=>{this.query=r.target.value,e.redraw()}} /></label>
      <section class="hme-card hme-layers">
        <div class="hme-h">${z(t)}<span class="hme-h-end">${C(t.rooms.length,"room")}</span></div>
        ${n.map(r=>this.layer(e,r,s!==void 0&&x(s.id,r.id)))}
        ${n.length===0?m`<p class="hme-empty-line">${o===""?"No rooms on this floor yet.":"No room by that name."}</p>`:v}
        ${i.length>0?m`<div class="hme-sep"></div>${i.map(r=>m`<button type="button" class="hme-lay"
            @click=${()=>e.setMode("devices",{kind:"pin",pinId:r.id})}><span class="hme-dot dev"></span>${j(r,e.hass)}<span class="n">Device</span></button>`)}`:v}
        ${a.length>0?m`<div class="hme-sep"></div>${a.map(r=>m`<button type="button" class="hme-lay dim"
            @click=${()=>e.setFloor(r.id)}>▸ ${z(r)}<span class="n">${C(r.rooms.length,"room")}</span></button>`)}`:v}
      </section>
      <button type="button" class="hme-tb hme-wide ${this.draw.active?"on":""}" @click=${()=>this.draw.active?this.draw.stop(e):this.draw.start(e)}>
        ${this.draw.active?"Stop drawing":"\uFF0B Draw a room by hand"}</button>
      <p class="hme-foot">Scanned rooms come from the iPhone. Rooms you draw here (a garden, a garage) need no scan.</p>`}layer(e,t,o){let n=m`<button type="button" class="hme-lay ${o?"on":""}" aria-pressed=${o?"true":"false"}
      @click=${()=>e.select({kind:"room",roomId:t.id})}>
      <span class="hme-dot" style=${`background:${ko[vt(t)]}`}></span>${I(t)}<span class="n">${tt(t)}</span></button>`;if(!o)return n;let i=t.openings.map((h,p)=>({o:h,i:p})).filter(({o:h})=>h.kind!=="window"),a=t.openings.map((h,p)=>({o:h,i:p})).filter(({o:h})=>h.kind==="window"),s=ke(e.floor,t.id),r=h=>{this.open.has(h)?this.open.delete(h):this.open.add(h),e.redraw()},l=h=>e.setMode("shape",h===void 0?{kind:"room",roomId:t.id}:{kind:"opening",roomId:t.id,opening:h});return m`${n}
      <button type="button" class="hme-lay sub" @click=${()=>l(i[0]?.i)}>Doors and ways in<span class="n">${i.length}</span></button>
      <button type="button" class="hme-lay sub" @click=${()=>l(a[0]?.i)}>Windows<span class="n">${a.length}</span></button>
      <button type="button" class="hme-lay sub" aria-expanded=${this.open.has("things")?"true":"false"} @click=${()=>r("things")}>Things<span class="n">${t.objects.length}</span></button>
      ${this.open.has("things")?t.objects.map((h,p)=>m`<div class="hme-lay subsub ${this.picked(e)?.index===p?"on":""}">
        <button type="button" class="hme-link" title="Pick it to move, resize or turn it" @click=${()=>this.pickThing(e,t,p)}>${Z(h.kind)}</button>
        ${Re({on:h.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${Z(h.kind)} shown`,click:()=>e.apply(u=>We(u,t.id,p,h.hidden!==!0))})}</div>`):v}
      <button type="button" class="hme-lay sub" aria-expanded=${this.open.has("devices")?"true":"false"} @click=${()=>r("devices")}>Devices<span class="n">${s.length}</span></button>
      ${this.open.has("devices")?s.map(h=>m`<button type="button" class="hme-lay subsub" @click=${()=>e.setMode("devices",{kind:"pin",pinId:h.id})}>${j(h,e.hass)}<span class="n">›</span></button>`):v}`}overlay(e){if(this.draw.active)return this.draw.overlay(e);let t=this.focus(e),o=this.picked(e),n=[];for(let i of this.guides)n.push(this.guide(e,i));if(o!==void 0){let i=o.room.outline.map(s=>J(e.toScreen(s))).join(" ");n.push($`<polygon points=${i} fill="none" stroke="#5b8def" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" pointer-events="none" />`);let a=o.object;n.push(this.box(e,to(eo(a)),{width:a.size[0],depth:a.size[1]},"thing",a.hidden===!0))}else t!==void 0&&t.outline.length>=3&&n.push(this.box(e,ii(t),Rt(t),"room",!1));return n.length===0?v:$`${n}`}box(e,t,o,n,i){let a=t.map(b=>e.toScreen(b)),s=a.reduce((b,w)=>[b[0]+w[0]/4,b[1]+w[1]/4],[0,0]),r=b=>[(a[b][0]+a[(b+1)%4][0])/2,(a[b][1]+a[(b+1)%4][1])/2],l=b=>{let w=Math.max(Math.hypot(b[0]-s[0],b[1]-s[1]),1e-6);return[(b[0]-s[0])/w,(b[1]-s[1])/w]},h=[0,1,2,3].flatMap(b=>[a[b],r(b)]),p=[0,1,2,3].reduce((b,w)=>r(w)[1]<r(b)[1]?w:b,0),u=r(p),g=l(u),c=[u[0]+g[0]*44,u[1]+g[1]*44],f=[];for(let b of[[0,2],[1,3]]){let[w,P]=b,D=Math.abs(a[(w+1)%4][0]-a[w][0])>=Math.abs(a[(w+1)%4][1]-a[w][1])?l(r(w))[1]<=l(r(P))[1]?w:P:l(r(w))[0]<=l(r(P))[0]?w:P,N=a[D],A=a[(D+1)%4],G=l(r(D)),_=[N[0]+G[0]*20,N[1]+G[1]*20],X=[A[0]+G[0]*20,A[1]+G[1]*20],Y=[(_[0]+X[0])/2,(_[1]+X[1])/2],Oi=D%2===0?o.width:o.depth,Q=[G[0]*5,G[1]*5];f.push($`<path d=${`M${J(_)}L${J(X)}M${J([_[0]-Q[0],_[1]-Q[1]])}L${J([_[0]+Q[0],_[1]+Q[1]])}M${J([X[0]-Q[0],X[1]-Q[1]])}L${J([X[0]+Q[0],X[1]+Q[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${F(Y[0]-26)} y=${F(Y[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${F(Y[0])} y=${F(Y[1]+4)} fill="#fff" text-anchor="middle">${Oi.toFixed(2)} m</text></g>`)}let y=n==="room"?"Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping.":"Drag to resize it. Shift keeps its proportions, Alt resizes it about its middle.";return $`<g class="hme-box">
      <polygon points=${a.map(J).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray=${i?"5 4":"none"} />
      ${this.resizing||!this.dragging?f:v}
      ${this.dragging?v:$`
        <line x1=${F(u[0])} y1=${F(u[1])} x2=${F(c[0])} y2=${F(c[1])} stroke="#5b8def" stroke-width="1.6" />
        ${h.map((b,w)=>$`<rect data-hme="resize" data-handle=${w} x=${F(b[0]-5)} y=${F(b[1]-5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${Bi(b[0]-s[0],b[1]-s[1])}`}>
          <title>${y}</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${J(c)})`}>
          <title>${n==="room"?"Drag to turn the room. Hold Alt to turn it freely.":"Drag to turn it. Hold Alt to turn it freely."}</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(e,t){let o=e.toScreen(t.a),n=e.toScreen(t.b),i=Math.max(Math.hypot(n[0]-o[0],n[1]-o[1]),1e-6),a=[(n[0]-o[0])/i,(n[1]-o[1])/i],s=[o[0]-a[0]*40,o[1]-a[1]*40],r=[n[0]+a[0]*40,n[1]+a[1]*40],l=e.floor.rooms.find(u=>x(u.id,t.roomId)),h=`Lined up with ${l===void 0?"a":I(l)} wall`,p=h.length*6.2+20;return $`<g class="hme-guide" pointer-events="none">
      <line x1=${F(s[0])} y1=${F(s[1])} x2=${F(r[0])} y2=${F(r[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${F(r[0]+6)} y=${F(r[1]-10)} width=${F(p)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${F(r[0]+6+p/2)} y=${F(r[1]+4)} fill="#fff" text-anchor="middle">${h}</text></g>
    </g>`}pointerDown(e,t,o){if(this.draw.active)return this.draw.pointerDown(e,t,o);if(t.button!==0)return!1;let n=t.target?.closest?.("[data-hme]"),i=n?.getAttribute("data-hme"),a=this.focus(e),s=this.picked(e),r=Wi[Number(n?.getAttribute("data-handle"))];if(s!==void 0){if(i==="turn")return this.thingTurnDrag(e,t,s,o),!0;if(i==="resize"&&r!==void 0)return this.thingResizeDrag(e,t,s,r,o),!0}else if(a!==void 0){if(i==="turn")return this.turnDrag(e,t,a,o),!0;if(i==="resize"&&r!==void 0)return this.resizeDrag(e,t,a,r,o),!0}let l=t.metaKey||t.ctrlKey,h=l||s!==void 0?this.thingUnder(e,o,l?void 0:s?.room):void 0;if(h!==void 0)return this.pickThing(e,h.room,h.index),this.thingMoveDrag(e,t,h,o),!0;let p=V(e.floor,o);if(p===void 0)return!1;let u=a!==void 0&&x(a.id,p.id)?this.thingUnder(e,o,p):void 0;return e.select({kind:"room",roomId:p.id}),this.moveDrag(e,t,p,o,u),!0}moveDrag(e,t,o,n,i){let a=e.doc,s=o.id,r=pe(o.outline),l=[0,0];e.drag(t,{move:(h,p)=>{let u=h[0]-n[0],g=h[1]-n[1];if(e.toggles.grid&&r!==void 0){let c=Oe;u=Math.round((r.minX+u)/c)*c-r.minX,g=Math.round((r.minY+g)/c)*c-r.minY}if(this.guides=[],e.toggles.snap&&!p.altKey){let c=ln(a,s,u,g);c!==void 0&&(u=c.dx,g=c.dy,this.guides=c.guides)}this.dragging=!0,l=[u,g],e.preview(c=>xe(c,s,u,g))},end:(h,p,u)=>{this.stopDrag(e);let[g,c]=l;u&&(Math.abs(g)>=.005||Math.abs(c)>=.005)?e.apply(f=>xe(f,s,g,c),{select:{kind:"room",roomId:s}}):!u&&i!==void 0&&this.pickThing(e,i.room,i.index)},cancel:()=>this.stopDrag(e)})}resizeDrag(e,t,o,n,i){let a=hn(o);if(a===void 0)return;let s=e.doc,r=o.id,l=a.a1-a.a0,h=a.c1-a.c0;if(l<=1e-6||h<=1e-6)return;let p=f=>f[0]*a.u[0]+f[1]*a.u[1],u=f=>f[0]*a.v[0]+f[1]*a.v[1],g=f=>Math.min(Math.max(f,Ne),Ke),c;e.drag(t,{move:(f,y)=>{let b=y.altKey?2:1,w=l,P=h;if(n.a!==void 0&&(w=l+(p(f)-p(i))*(n.a===1?1:-1)*b),n.c!==void 0&&(P=h+(u(f)-u(i))*(n.c===1?1:-1)*b),e.toggles.grid){let A=Oe;n.a!==void 0&&(w=Math.round(w/A)*A),n.c!==void 0&&(P=Math.round(P/A)*A)}if(w=g(w),P=g(P),y.shiftKey){let A=w/l,G=P/h,_=n.a===void 0?G:n.c===void 0||Math.abs(Math.log(A))>=Math.abs(Math.log(G))?A:G;_=Math.min(Math.max(_,Ne/Math.min(l,h)),Ke/Math.max(l,h)),w=l*_,P=h*_}let E=[y.altKey||n.a===void 0?.5:1-n.a,y.altKey||n.c===void 0?.5:1-n.c],D={width:w,depth:P,anchor:E};if(this.guides=[],e.toggles.snap&&!y.altKey&&!y.ctrlKey&&!y.metaKey){let A=mn(s,r,D,n,{proportional:y.shiftKey});A!==void 0&&(D=A.resize,this.guides=A.guides)}this.dragging=!0,this.resizing=!0,c=D;let N=D;e.preview(A=>je(A,r,N))},end:(f,y,b)=>{this.stopDrag(e);let w=c;!b||w===void 0||Math.abs((w.width??l)-l)<.005&&Math.abs((w.depth??h)-h)<.005||e.apply(P=>je(P,r,w),{select:{kind:"room",roomId:r}})},cancel:()=>this.stopDrag(e)})}turnDrag(e,t,o,n){let i=o.id,a=se(o),s=Math.atan2(n[1]-a[1],n[0]-a[0]),r=0;e.drag(t,{move:(l,h)=>{let p=(Math.atan2(l[1]-a[1],l[0]-a[0])-s)*180/Math.PI;p=(p+540)%360-180,h.altKey||(p=Math.round(p/_t)*_t),this.dragging=!0,r=p,e.preview(u=>me(u,i,p,a))},end:(l,h,p)=>{this.stopDrag(e),p&&Math.abs(r)>.01&&e.apply(u=>me(u,i,r,a),{select:{kind:"room",roomId:i}})},cancel:()=>this.stopDrag(e)})}thingMoveDrag(e,t,o,n){let{room:i,index:a,object:s}=o,r=i.id,l=s.c,h=l;e.drag(t,{move:(p,u)=>{let g=[l[0]+p[0]-n[0],l[1]+p[1]-n[1]];if(e.toggles.grid){let f=Oe;g=[Math.round(g[0]/f)*f,Math.round(g[1]/f)*f]}if(this.guides=[],e.toggles.snap&&!u.altKey){let f=kn(i,s,g);g=f.c,this.guides=f.guides}this.dragging=!0,h=g;let c=g;e.preview(f=>Pe(f,r,a,c))},end:(p,u,g)=>{if(this.stopDrag(e),g&&Math.hypot(h[0]-l[0],h[1]-l[1])>=.005){let c=h;e.apply(f=>Pe(f,r,a,c),{select:{kind:"object",roomId:r,object:a}})}},cancel:()=>this.stopDrag(e)})}thingResizeDrag(e,t,o,n,i){let{room:a,index:s,object:r}=o,l=a.id,{u:h,v:p}=$n(r),u=Math.max(r.size[0],Ee),g=Math.max(r.size[1],Ee),c=w=>w[0]*h[0]+w[1]*h[1],f=w=>w[0]*p[0]+w[1]*p[1],y=w=>Math.min(Math.max(w,Ee),Mt),b;e.drag(t,{move:(w,P)=>{let E=P.altKey?2:1,D=u,N=g;if(n.a!==void 0&&(D=u+(c(w)-c(i))*(n.a===1?1:-1)*E),n.c!==void 0&&(N=g+(f(w)-f(i))*(n.c===1?1:-1)*E),e.toggles.grid){let _=Oe;n.a!==void 0&&(D=Math.round(D/_)*_),n.c!==void 0&&(N=Math.round(N/_)*_)}if(D=y(D),N=y(N),P.shiftKey){let _=D/u,X=N/g,Y=n.a===void 0?X:n.c===void 0||Math.abs(Math.log(_))>=Math.abs(Math.log(X))?_:X;Y=Math.min(Math.max(Y,Ee/Math.min(u,g)),Mt/Math.max(u,g)),D=u*Y,N=g*Y}let A=[P.altKey||n.a===void 0?.5:1-n.a,P.altKey||n.c===void 0?.5:1-n.c];this.dragging=!0,this.resizing=!0;let G={width:D,depth:N,anchor:A};b=G,e.preview(_=>Ue(_,l,s,G))},end:(w,P,E)=>{this.stopDrag(e);let D=b;!E||D===void 0||Math.abs((D.width??u)-r.size[0])<.005&&Math.abs((D.depth??g)-r.size[1])<.005||e.apply(N=>Ue(N,l,s,D),{select:{kind:"object",roomId:l,object:s}})},cancel:()=>this.stopDrag(e)})}thingTurnDrag(e,t,o,n){let{room:i,index:a,object:s}=o,r=i.id,l=s.c,h=Math.atan2(n[1]-l[1],n[0]-l[0]),p=0;e.drag(t,{move:(u,g)=>{let c=(Math.atan2(u[1]-l[1],u[0]-l[0])-h)*180/Math.PI;c=(c+540)%360-180,g.altKey||(c=Math.round(c/_t)*_t),this.dragging=!0,p=-c;let f=p;e.preview(y=>ce(y,r,a,f))},end:(u,g,c)=>{this.stopDrag(e);let f=p;c&&Math.abs(f)>.01&&e.apply(y=>ce(y,r,a,f),{select:{kind:"object",roomId:r,object:a}})},cancel:()=>this.stopDrag(e)})}hover(e,t){this.draw.hover(e,t)}keyDown(e,t){if(this.draw.active)return this.draw.keyDown(e,t);let o=this.focus(e);if(o===void 0)return!1;let n=ae(t,!1),i=this.picked(e);if(i!==void 0){let{index:a,object:s}=i,r={kind:"room",roomId:o.id};if(n==="delete")return e.apply(l=>Be(l,o.id,a),{select:r}),!0;if(n==="cancel")return e.select(r),!0;if(typeof n=="object"&&"nudge"in n){let[l,h]=n.nudge;return e.apply(p=>Pe(p,o.id,a,[s.c[0]+l,s.c[1]+h])),!0}return!1}if(n==="delete")return this.askDelete(e,o),!0;if(typeof n=="object"&&"nudge"in n){let[a,s]=n.nudge;return e.apply(r=>xe(r,o.id,a,s)),!0}return!1}cursor(){return this.draw.active?"crosshair":void 0}leave(e){this.draw.stop(e),this.guides=[],this.dragging=!1,this.resizing=!1}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.snap?"on":""}" aria-pressed=${e.toggles.snap?"true":"false"}
        title="A dragged room lines up with the walls round it. Hold Alt to move it freely." @click=${()=>e.setToggle("snap",!e.toggles.snap)}>Snap to walls</button>
      <button type="button" class="hme-tb ${e.toggles.grid?"on":""}" aria-pressed=${e.toggles.grid?"true":"false"}
        @click=${()=>e.setToggle("grid",!e.toggles.grid)}>Grid 10 cm</button>`}pill(e){if(this.draw.active)return m`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?m`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(e)}}>Close the room</button>`:v}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(e)}>Cancel</button>`;let t=this.focus(e);if(t===void 0||this.dragging)return v;let o=t.id,n=this.picked(e);if(n!==void 0){let{index:i,object:a}=n;return m`<span class="hme-pill-name">${Z(a.kind)}</span>
        <button type="button" class="hme-tb" @click=${()=>e.apply(s=>ce(s,o,i,90))}>⟲ Turn 90°</button>
        <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(s=>ao(s,o,i))}>Line up</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(s=>We(s,o,i,a.hidden!==!0))}>${a.hidden===!0?"Show":"Hide"}</button>
        <button type="button" class="hme-tb" @click=${()=>e.select({kind:"room",roomId:o})}>${I(t)} ›</button>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(s=>Be(s,o,i),{select:{kind:"room",roomId:o}})}>Remove</button>`}return m`<span class="hme-pill-name">${I(t)}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(i=>me(i,o,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" @click=${()=>e.apply(i=>oe(i,o))}>Square the corners</button>
      <button type="button" class="hme-tb" title="Turn it to the floor's walls and slide it onto the nearest wall line, as the iPhone does"
        @click=${()=>e.apply(i=>pn(i,o))}>Snap to walls</button>
      ${this.floorMenu(e,t,"Move to floor","hme-tb")}
      <button type="button" class="hme-tb danger" @click=${()=>{this.askDelete(e,t)}}>Delete</button>`}floorMenu(e,t,o,n){let i=e.doc.floors.filter(a=>!x(a.id,e.floor.id));return $o({label:o,cls:n,options:[...i.map(a=>({value:a.id,label:z(a)})),{value:"new",label:"New floor\u2026"}],pick:a=>{this.moveToFloor(e,t,a)}})}async moveToFloor(e,t,o){let n=t.id,i={kind:"room",roomId:n};if(o!=="new"){e.apply(l=>no(l,n,{floorId:o}),{select:i,floorId:o});return}let a=Math.max(...e.doc.floors.map(l=>l.story))+1,s=await e.ask({title:"A new floor",label:"Name",value:a===1?"Upstairs":`Floor ${a+1}`,ok:"Move the room there"});if(s===void 0)return;let r=e.newId();e.apply(l=>no(l,n,{newFloor:{id:r,name:s,story:a}}),{select:i,floorId:r})}async askDelete(e,t){let o=ke(e.floor,t.id).length;await e.confirm({title:`Delete ${I(t)}?`,text:Ui(t,o),ok:"Delete room",danger:!0})&&e.apply(i=>fn(i,t.id),{select:null})}inspector(e){let t=this.focus(e);if(t===void 0)return this.floorCard(e,e.floor);let o=this.picked(e);if(o!==void 0)return this.thingInspector(e,o);let n=t.id,i=Rt(t),a=Bo(e.floor,e.toggles.live?e.hass?.states:void 0).has(t.id),s=ke(e.floor,n),r=pe(t.outline)??{minX:0,minY:0,maxX:0,maxY:0},l=Math.round(-sn(t)*10)/10,h=t.areaId===void 0||e.areas.some(c=>c.id===t.areaId),p=t.pageId===void 0||e.pages.some(c=>x(c.id,t.pageId)),u=bt(t),g=this.edits(e);return m`
      <section class="hme-card hme-head">
        ${si(t,a)}
        <div class="hme-head-t">
          <strong>${I(t)}</strong>
          <span>${z(e.floor)} · ${tt(t)} · ${i.area.toFixed(1)} m²</span>
        </div>
      </section>

      ${H("Room",m`
        ${O("Name",it({value:t.name??"",label:"Name",placeholder:"Room",set:c=>e.apply(f=>gn(f,n,c))}))}
        ${O("Area",ve({label:"Area",value:t.areaId??"",options:[{value:"",label:"None"},...h?[]:[{value:t.areaId,label:`Not in Home Assistant (${t.areaId})`,disabled:!0}],...e.areas.map(c=>({value:c.id,label:c.name}))],set:c=>e.apply(f=>vn(f,n,c===""?void 0:c))}))}
        ${W("The Home Assistant area. Its devices show first in Devices.")}
        ${O("Tap opens",ve({label:"Tap opens",value:t.pageId??"",options:[{value:"",label:"Nothing"},...p?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(c=>({value:c.id,label:`Page: ${c.name}`}))],set:c=>e.apply(f=>bn(f,n,c===""?void 0:c))}))}
        ${W("What a tap on this room does on the map tiles and the watch.")}`)}

      ${H("Size",m`
        ${ot(R({tag:"W",label:"Width",value:i.width,unit:"m",min:Ne,max:Ke,...g((c,f)=>je(c,n,{width:f}))}),R({tag:"D",label:"Depth",value:i.depth,unit:"m",min:Ne,max:Ke,...g((c,f)=>je(c,n,{depth:f}))}),R({tag:"H",label:"Wall height",value:t.height,unit:"m",min:.5,max:20,...g((c,f)=>Ge(c,n,f))}))}
        <p class="hme-foot-hint">Along its own walls, about its middle; its doors, things and devices move with it.</p>`)}

      ${H("Place",m`
        ${nt("Corner",ot(R({tag:"X",label:"Left",value:r.minX,unit:"m",...g((c,f)=>xe(c,n,f-r.minX,0))}),R({tag:"Y",label:"Top",value:r.minY,unit:"m",...g((c,f)=>xe(c,n,0,f-r.minY))})))}
        ${nt("Turn",m`<div class="hme-turn">
          ${R({label:"Turn",value:l,unit:"\xB0",digits:1,min:-180,max:180,...g((c,f)=>me(c,n,f-l))})}
          <button type="button" class="hme-tb" @click=${()=>e.apply(c=>me(c,n,-90))}>−90°</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(c=>me(c,n,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>e.apply(c=>dn(c,n))}>Level</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the room to move it, a square handle to resize it, the round one to turn it.</p>
        ${O("Floor",ve({label:"Floor",value:e.floor.id,options:[...e.doc.floors.map(c=>({value:c.id,label:z(c)})),{value:"new",label:"New floor\u2026"}],set:c=>{this.moveToFloor(e,t,c)}}))}`)}

      ${H("Floor finish",m`<div class="hme-pics">
        ${U({label:`Auto: ${at[u]}`,picture:xo(u),on:t.finish===void 0,title:"Picked from the room's name and furniture",click:()=>e.apply(c=>He(c,n,void 0))})}
        ${dt.map(c=>U({label:at[c],picture:xo(c),on:t.finish===c,click:()=>e.apply(f=>He(f,n,c))}))}
      </div>`)}

      ${H("In this room",m`
        ${t.objects.length===0?m`<p class="hme-empty-line">No things. Add a sofa, a bed or stairs so the map reads.</p>`:v}
        ${t.objects.map((c,f)=>m`<div class="hme-r tight"><span class="hme-grow ${c.hidden===!0?"dim":""}">
            <button type="button" class="hme-link" title="Pick it to move, resize or turn it" @click=${()=>this.pickThing(e,t,f)}>${Z(c.kind)}</button></span>
          ${Re({on:c.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${Z(c.kind)} shown`,click:()=>e.apply(y=>We(y,n,f,c.hidden!==!0))})}
          <button type="button" class="hme-x" aria-label=${`Remove ${Z(c.kind)}`} title="Remove" @click=${()=>e.apply(y=>Be(y,n,f))}>×</button></div>`)}
        ${t.openings.length>0?m`<div class="hme-r tight"><span class="hme-grow">${[...new Set(t.openings.map(ge))].join(", ")}</span>
          <button type="button" class="hme-link" @click=${()=>e.setMode("shape",{kind:"room",roomId:n})}>Shape ›</button></div>`:v}
        <div class="hme-r tight"><span class="hme-grow">${s.length===0?"No devices":s.slice(0,3).map(c=>j(c,e.hass)).join(", ")+(s.length>3?"\u2026":"")}</span>
          <button type="button" class="hme-link" @click=${()=>e.setMode("devices",{kind:"room",roomId:n})}>${C(s.length,"device")} ›</button></div>
        <div class="hme-row-end">
          ${$o({label:"\uFF0B Add a thing",cls:"hme-tb",options:yn.map(c=>({value:c,label:Z(c)})),pick:c=>{let f=q(t)??se(t);e.apply(y=>wn(y,n,c,f))}})}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(e,t)}}>Delete room</button>
        </div>`)}`}edits(e){return t=>({set:o=>e.apply(n=>t(n,o)),preview:o=>e.preview(o===void 0?void 0:n=>t(n,o))})}thingInspector(e,t){let{room:o,index:n,object:i}=t,a=o.id,s=Z(i.kind),[r,l,h]=i.size,p=Xi(i),u=this.edits(e),g={kind:"room",roomId:a},c={unit:"m",min:Ee,max:Mt};return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${s}</strong>
          <span>In ${I(o)} · ${r.toFixed(2)} × ${l.toFixed(2)} × ${h.toFixed(2)} m${(i.lift??0)>0?` \xB7 ${(i.lift??0).toFixed(2)} m up`:""}${i.hidden===!0?" \xB7 Hidden":""}</span>
        </div>
      </section>

      ${H("Size",m`
        ${ot(R({tag:"W",label:"Width",value:r,...c,...u((f,y)=>Ue(f,a,n,{width:y}))}),R({tag:"D",label:"Depth",value:l,...c,...u((f,y)=>Ue(f,a,n,{depth:y}))}),R({tag:"H",label:"Height",value:h,...c,min:.01,...u((f,y)=>io(f,a,n,{size:[r,l,y]}))}))}`)}

      ${H("Place",m`
        ${nt("Middle, and up off the floor",ot(R({tag:"X",label:"Middle across",value:i.c[0],unit:"m",...u((f,y)=>Pe(f,a,n,[y,i.c[1]]))}),R({tag:"Y",label:"Middle down",value:i.c[1],unit:"m",...u((f,y)=>Pe(f,a,n,[i.c[0],y]))}),R({tag:"Z",label:"Up off the floor",value:i.lift??0,unit:"m",min:0,max:100,...u((f,y)=>io(f,a,n,{lift:y}))})))}
        ${nt("Turn",m`<div class="hme-turn">
          ${R({label:"Turn",value:p,unit:"\xB0",digits:1,min:-180,max:180,...u((f,y)=>ce(f,a,n,y-p))})}
          <button type="button" class="hme-tb" title="Turn it a quarter one way" @click=${()=>e.apply(f=>ce(f,a,n,-90))}>−90°</button>
          <button type="button" class="hme-tb" title="Turn it a quarter the other way" @click=${()=>e.apply(f=>ce(f,a,n,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(f=>ao(f,a,n))}>Line up</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the thing to move it, a square handle to resize it, the round one to turn it.</p>`)}

      ${H("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${Re({on:i.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${s} shown`,click:()=>e.apply(f=>We(f,a,n,i.hidden!==!0))})}</div>
        <p class="hme-foot-hint">Scan Again on the iPhone puts the room's things back where the scan finds them. A hidden thing stays hidden.</p>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.select(g)}>‹ ${I(o)}</button>
          <button type="button" class="hme-tb danger push" @click=${()=>e.apply(f=>Be(f,a,n),{select:g})}>Remove</button>
        </div>`)}`}floorCard(e,t){let o=ht(t,e.toggles.live?e.hass?.states:void 0);return m`${H("Floor",m`
        ${O("Name",it({value:t.name,label:"Floor name",placeholder:z(t),set:n=>e.apply(i=>wt(i,t.id,n))}))}
        ${O("On it",m`<span class="hme-val">${C(t.rooms.length,"room")} · ${C(t.pins.length,"device")} · ${mt(o)}</span>`)}`)}
      ${H("Arrange",m`<p class="hme-text">Pick a room on the plan or in the list to move it, turn it, resize it, or change its name, area and floor.</p>
        <p class="hme-text dim">Drag a room to move it; it lines up with the walls of the rooms round it. Drag the round handle above it to turn it, or a square handle on its box to resize it. Undo with ${oi()}.</p>
        <p class="hme-text dim">To move a thing in a room (a sofa, a TV, a desk), pick the room, then click the thing. Cmd or Ctrl and a click picks a thing in any room.</p>`)}`}};var Lt="application/x-wa-home-map-entity",qi=new Set(["light","switch","fan","climate","humidifier","water_heater","sensor","binary_sensor","media_player","lock","cover","valve","camera","vacuum","alarm_control_panel","siren","input_boolean","remote"]);function Vi(d,e){let t=d?.entities?.[e];if(t===void 0)return;if(typeof t.area_id=="string"&&t.area_id!=="")return t.area_id;let o=t.device_id?d?.devices?.[t.device_id]:void 0;return typeof o?.area_id=="string"&&o.area_id!==""?o.area_id:void 0}function ui(d){let e=[];for(let[t,o]of Object.entries(d?.states??{})){let n=d?.entities?.[t];if(n?.hidden===!0)continue;let i=o?.attributes?.friendly_name,a=Vi(d,t),s=a===void 0?void 0:d?.areas?.[a]?.name?.trim()||a,r=o?.attributes?.device_class;e.push({entityId:t,name:typeof i=="string"&&i.trim()!==""?i.trim():t,domain:t.slice(0,t.indexOf(".")),areaId:a,areaName:s,deviceClass:typeof r=="string"?r:void 0,category:typeof n?.entity_category=="string"?n.entity_category:void 0})}return e.sort((t,o)=>t.name.localeCompare(o.name)||t.entityId.localeCompare(o.entityId))}function Yi(d){return new Set(d.floors.flatMap(e=>e.pins.map(t=>t.entityId)))}function fi(d,e,t){let o=Yi(d),n=new Map;for(let a of t){if(o.has(a.entityId)||a.areaId===void 0||a.category!==void 0||!qi.has(a.domain))continue;let s=n.get(a.areaId);s===void 0&&n.set(a.areaId,s={areaId:a.areaId,name:a.areaName??a.areaId,here:!1,devices:[]}),s.devices.push(a)}let i=e.rooms.map(a=>a.areaId).filter(a=>a!==void 0);for(let a of n.values())a.here=i.includes(a.areaId);return[...n.values()].sort((a,s)=>{let r=i.indexOf(a.areaId),l=i.indexOf(s.areaId);return r>=0||l>=0?(r<0?1/0:r)-(l<0?1/0:l):a.name.localeCompare(s.name)})}function gi(d,e){let t=new Set(d.rooms.map(o=>o.areaId).filter(o=>o!==void 0));return e.filter(o=>t.has(o.areaId)).reduce((o,n)=>o+n.devices.length,0)}function vi(d,e,t=40){let o=e.toLowerCase().split(/\s+/).filter(s=>s!=="");if(o.length===0)return[];let n=s=>`${s.name} ${s.entityId} ${s.areaName??""}`.toLowerCase(),i=d.filter(s=>o.every(r=>n(s).includes(r))),a=e.trim().toLowerCase();return i.sort((s,r)=>+!s.name.toLowerCase().startsWith(a)-+!r.name.toLowerCase().startsWith(a)).slice(0,t)}var Zi=[["lights","Lights"],["climate","Climate"],["sensors","Sensors"],["power","Power"],["media","Media"],["security","Security"],["covers","Covers"],["other","Other"]];function Ft(d){switch(d.slice(0,d.indexOf("."))){case"light":return"lights";case"climate":case"fan":case"humidifier":case"water_heater":return"climate";case"sensor":case"binary_sensor":return"sensors";case"switch":case"input_boolean":return"power";case"media_player":case"remote":return"media";case"lock":case"camera":case"alarm_control_panel":case"siren":return"security";case"cover":case"valve":return"covers";default:return"other"}}function bi(d){let e=new Map;for(let t of d.pins){let o=Ft(t.entityId);e.set(o,(e.get(o)??0)+1)}return Zi.filter(([t])=>e.has(t)).map(([t,o])=>({kind:t,label:o,count:e.get(t)}))}function yi(d){return d.replace(/_/g," ")}function _e(d,e){let t=e?.[d];if(t===void 0)return"gone";let o=String(t.state??""),n=d.slice(0,d.indexOf(".")),i=t.attributes??{};if(n==="light"&&o==="on"&&typeof i.brightness=="number")return`on \xB7 ${Math.round(i.brightness/255*100)}%`;if(n==="climate"&&typeof i.current_temperature=="number")return`${o} \xB7 ${i.current_temperature}\xB0`;let a=typeof i.unit_of_measurement=="string"?i.unit_of_measurement:"";return a!==""&&o!==""&&Number.isFinite(Number(o))?`${o} ${a}`.replace(" \xB0","\xB0").replace(" %","%"):o.replace(/_/g," ")}function Eo(d){return["light","switch","fan","input_boolean","media_player","cover","humidifier","siren"].includes(d.slice(0,d.indexOf(".")))}function To(d,e){let t=String(e?.[d]?.state??"");return d.startsWith("cover.")?t==="open"||t==="opening"?"Close":"Open":t==="on"||t==="playing"||t==="paused"||t==="idle"?"Turn off":"Turn on"}var So=[["Floor",.3],["Table",.8],["Wall",1.6],["Ceiling",2.5]],Io=[[void 0,"As the tile does"],["toggle","Turn on or off"],["details","Show details"],["page","Open a page"],["none","Nothing"]];function Co(d,e){for(let t of d.floors){let o=t.pins.find(n=>n.entityId===e);if(o!==void 0)return{floorId:t.id,pinId:o.id}}}function wi(d,e){return e===void 0?void 0:d.rooms.find(t=>t.areaId!==void 0&&t.areaId===e)}function ye(d){return d?.kind==="pin"?[d.pinId]:d?.kind==="pins"?d.pinIds.slice():[]}function rt(d){let e=[];for(let t of d)e.some(o=>x(o,t))||e.push(t);if(e.length!==0)return e.length===1?{kind:"pin",pinId:e[0]}:{kind:"pins",pinIds:e}}function zt(d,e){let t=ye(d);return t.some(o=>x(o,e))?rt(t.filter(o=>!x(o,e))):rt([...t,e])}function Mi(d,e){return rt([...ye(d),...e])}function $i(d,e,t){let[o,n]=[Math.min(e[0],t[0]),Math.max(e[0],t[0])],[i,a]=[Math.min(e[1],t[1]),Math.max(e[1],t[1])];return d.filter(s=>s.at[0]>=o&&s.at[0]<=n&&s.at[1]>=i&&s.at[1]<=a).map(s=>s.id)}function we(d){if(d.length===0)return{mixed:!0};let e=JSON.stringify(d[0])??"undefined";return d.every(t=>(JSON.stringify(t)??"undefined")===e)?{mixed:!1,value:d[0]}:{mixed:!0}}function ki(d,e){if(d.length===0||!d.every(Eo))return;let t=d.every(n=>n.startsWith("cover.")),o=d.some(n=>{let i=To(n,e);return i==="Turn off"||i==="Close"});return t?o?{words:"Close",service:"turn_off"}:{words:"Open",service:"turn_on"}:o?{words:"Turn off",service:"turn_off"}:{words:"Turn on",service:"turn_on"}}var Ji=15,Nt=Math.PI/4,Ro=8,Kt="#ffbf55",k=d=>d.toFixed(1);function Qi(d,e){return`${yi(d.domain)} \xB7 ${_e(d.entityId,e)}`}function ea(d,e){let t=de(d,e);if(t===void 0)return"Not in a room";let o=V(d,e.at);return o!==void 0&&x(o.id,t.id)?`${I(t)} (found by place)`:I(t)}function ta(d,e,t){return d.icon!==void 0?St[d.icon]:`Auto (${St[Ye(d.entityId,e,t)].toLowerCase()})`}var jt=class{constructor(){this.id="devices";this.drawsPins=!0;this.query="";this.side=!0;this.names=!1;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1}states(e){return e.toggles.live?e.hass?.states:void 0}picked(e){let t=e.selection;return t?.kind==="pin"?e.floor.pins.find(o=>x(o.id,t.pinId)):void 0}picks(e){return ye(e.selection).flatMap(t=>e.floor.pins.filter(o=>x(o.id,t)))}deviceClass(e,t){let o=e.hass?.states?.[t]?.attributes?.device_class;return typeof o=="string"?o:void 0}friendly(e,t){let o=e.hass?.states?.[t]?.attributes?.friendly_name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0}place(e,t,o,n){let i=Co(e.doc,t);if(i!==void 0)return x(i.floorId,e.floor.id)||e.setFloor(i.floorId),e.select({kind:"pin",pinId:i.pinId}),!1;let a=wi(e.floor,n),s=o??(a===void 0?Ct(e.view,[e.stage.width/2,e.stage.height/2]):q(a)??se(a)),r=e.newId().toUpperCase(),l=e.floor.id,h=this.friendly(e,t),p=e.apply(u=>On(u,l,{id:r,entityId:t,at:[s[0],s[1]],...h===void 0?{}:{name:h}}),{select:{kind:"pin",pinId:r}});return p||e.note("warn","That device could not be put on the map: the map holds at most 400 devices."),p}placeAll(e,t){let o=t.map(i=>({entityId:i.entityId,areaId:i.areaId,name:i.name,deviceClass:i.deviceClass})),n=e.floor.id;e.apply(i=>Fn(i,n,o,()=>e.newId())?.doc,{select:null})}rail(e){let t=e.hass?.states,o=ui(e.hass),n=fi(e.doc,e.floor,o),i=n.reduce((p,u)=>p+u.devices.length,0),a=gi(e.floor,n),s=vi(o,this.query),r=bi(e.floor),l=e.floor.pins.filter(p=>this.filter===void 0||Ft(p.entityId)===this.filter),h=ye(e.selection);return m`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find any device" aria-label="Find any device" .value=${K(this.query)}
          @input=${p=>{this.query=p.target.value,e.redraw()}} /></label>
      ${this.query.trim()===""?v:H("Found",m`
        ${s.length===0?m`<p class="hme-empty-line">No device by that name.</p>`:v}
        ${s.map(p=>this.deviceRow(e,p,t))}`,s.length>=40?"40+":String(s.length),"hme-tray")}
      ${H("Not on the map",m`
        ${i===0?m`<p class="hme-empty-line">Every device with an area is on the map. Find any other above.</p>`:v}
        ${n.map(p=>m`<div class="hme-ar ${p.here?"":"dim"}">${p.name}<span>${p.devices.length}</span></div>
          ${p.devices.map(u=>this.deviceRow(e,u,t))}`)}
        ${i===0?v:m`<button type="button" class="hme-tb hme-wide" ?disabled=${a===0}
            title=${a===0?"Link this floor's rooms to Home Assistant areas in Arrange first":""}
            @click=${()=>this.placeAll(e,n.flatMap(p=>p.devices))}>Place all ${a} by area</button>
          <p class="hme-foot">Each goes into the room linked to its area, at a good height for its kind. Then drag to fine tune.</p>`}`,String(i),"hme-tray")}
      ${H("On the map",m`
        ${r.length===0?m`<p class="hme-empty-line">No devices on this floor yet. Drag one onto the plan.</p>`:m`<div class="hme-chips">
          ${r.map(p=>m`<button type="button" class="hme-chip sel ${this.filter===p.kind?"on":""}" aria-pressed=${this.filter===p.kind?"true":"false"}
            @click=${()=>{this.filter=this.filter===p.kind?void 0:p.kind,e.redraw()}}>${p.label} ${p.count}</button>`)}</div>`}
        ${l.slice(0,60).map(p=>{let u=h.some(g=>x(g,p.id));return m`<button type="button" class="hme-lay ${u?"on":""}" title="Shift, Cmd or Ctrl and a click picks several"
            @click=${g=>e.select(g.shiftKey||g.metaKey||g.ctrlKey?zt(e.selection,p.id):{kind:"pin",pinId:p.id})}>
            <span class="hme-dot dev ${te(p.entityId,t).kind==="light"?"":"gray"}"></span>${j(p,e.hass)}
            <span class="n">${_e(p.entityId,t)}</span></button>`})}`,String(e.floor.pins.length))}`}deviceRow(e,t,o){let n=Co(e.doc,t.entityId),i=Ye(t.entityId,t.deviceClass,t.name);return m`<div class="hme-dv ${this.dragging===t.entityId?"dragging":""} ${n===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${n===void 0?"true":"false"} title=${n===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it"}
      @dragstart=${a=>{a.dataTransfer?.setData(Lt,t.entityId),a.dataTransfer?.setData("text/plain",t.entityId),a.dataTransfer&&(a.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,e.redraw()}}
      @click=${()=>this.place(e,t.entityId,void 0,t.areaId)}
      @keydown=${a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),this.place(e,t.entityId,void 0,t.areaId))}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${ue(i,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${n===void 0?Qi(t,o):"on the map"}</small></span>
      <span class="hme-dv-grip" aria-hidden="true">${n===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}dragOver(e,t,o){let n=this.dragging!==void 0||[...o.dataTransfer?.types??[]].includes(Lt),i=this.dropAt;return this.dropAt=n?t:void 0,i!==this.dropAt&&e.redraw(),n&&t!==void 0}drop(e,t,o){let n=this.dragging??o.dataTransfer?.getData(Lt)??"";this.dragging=void 0,this.dropAt=void 0,n!==""?this.place(e,n,t):e.redraw()}overlay(e){let t=this.states(e),o=this.picked(e),n=ye(e.selection),i=[];this.dropAt!==void 0&&i.push(this.dropMark(e,this.dropAt));let a=o===void 0?void 0:te(o.entityId,t);o!==void 0&&a?.kind==="light"&&i.push(this.glowRing(e,o,a.on?a.brightness:void 0));for(let s of e.floor.pins){let r=n.some(h=>x(s.id,h)),l=this.filter!==void 0&&Ft(s.entityId)!==this.filter;i.push(this.pinMark(e,s,r,l,t))}return this.box!==void 0&&i.push(this.boxMark(e,this.box)),$`${i}`}boxMark(e,t){let[o,n]=e.toScreen(t.a),[i,a]=e.toScreen(t.b);return $`<rect class="hme-box" x=${k(Math.min(o,i))} y=${k(Math.min(n,a))} width=${k(Math.abs(i-o))} height=${k(Math.abs(a-n))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`}pinMark(e,t,o,n,i){let[a,s]=e.toScreen(t.at),r=te(t.entityId,i),l=r.kind==="light"&&r.on,h=l?Je(t)??Kt:"rgba(36,36,40,0.92)",p=l?"#fff3d6":r.kind==="gone"?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.4)",u=l?"#3a2600":r.kind==="lock"?r.locked?"#30d158":"#ff9f0a":r.kind==="other"&&r.on?"#ffffff":r.kind==="gone"?"#8e8e93":"#d1d1d6",g=t.icon??Ye(t.entityId,this.deviceClass(e,t.entityId),this.friendly(e,t.entityId)),c=o?13:12,f=o||this.names?j(t,e.hass):Gn(t,i),y=f===void 0?0:f.length*5.9+14;return $`<g class="hme-pin" data-hme="pin" data-pin=${t.id} transform=${`translate(${k(a)} ${k(s)})`} opacity=${n?.25:1} style="cursor:grab">
      ${o?$`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:v}
      ${l?$`<circle r=${c+7} fill=${h} opacity="0.22" />`:v}
      <circle r=${c} fill=${h} stroke=${p} stroke-width="1.2" />
      <g transform="translate(-7 -7)">${ue(g,u,14,1.5)}</g>
      ${f===void 0||f===""?v:$`<g pointer-events="none"><rect x=${k(-y/2)} y=${c+4} width=${k(y)} height="16" rx="8" fill=${o?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text y=${c+15.5} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${f}</text></g>`}
    </g>`}glowRing(e,t,o){let[n,i]=e.toScreen(t.at),a=Ze(t,o),s=e.px(a),r=[n+s*Math.cos(Nt),i+s*Math.sin(Nt)],l=`Glow ${a.toFixed(1)} m`,h=l.length*6.2+18,p=t.glowSpill===!0?void 0:de(e.floor,t),u=p!==void 0&&p.outline.length>=3?p.outline.map(c=>e.toScreen(c).map(k).join(",")).join(" "):void 0,g=c=>$`<circle cx=${k(n)} cy=${k(i)} r=${k(s)} fill="none" stroke=${Je(t)??"#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${c} pointer-events="none" />`;return $`<g class="hme-glow-ring">
      ${u===void 0?g(1):$`<clipPath id="hme-glow-walls"><polygon points=${u} /></clipPath>
        ${g(.28)}<g clip-path="url(#hme-glow-walls)">${g(1)}</g>`}
      <circle data-hme="glow" cx=${k(r[0])} cy=${k(r[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${k(r[0]-h/2)} y=${k(r[1]+12)} width=${k(h)} height="18" rx="9" fill="#5b8def" />
        <text x=${k(r[0])} y=${k(r[1]+25)} fill="#fff" text-anchor="middle">${l}</text></g>
    </g>`}dropMark(e,t){let o=V(e.floor,t),[n,i]=e.toScreen(t),a=o===void 0?"Drop here, in no room":`Drop in ${I(o)}`,s=a.length*6.4+20;return $`<g class="hme-drop" pointer-events="none">
      ${o===void 0?v:$`<polygon points=${o.outline.map(r=>e.toScreen(r).map(k).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${k(n)} cy=${k(i)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${k(n-s/2)} y=${k(i+20)} width=${k(s)} height="18" rx="9" fill="#5b8def" />
        <text x=${k(n)} y=${k(i+33)} fill="#fff" text-anchor="middle">${a}</text></g>
    </g>`}pinAt(e,t){let o,n=Ji;for(let i of e.floor.pins){let a=e.toScreen(i.at),s=Math.hypot(a[0]-t[0],a[1]-t[1]);s<=n&&(o=i,n=s)}return o}pointerDown(e,t,o){if(t.button!==0)return!1;let n=e.toScreen(o),i=t.shiftKey||t.metaKey||t.ctrlKey,a=this.picked(e),s=a===void 0?void 0:te(a.entityId,this.states(e));if(!i&&a!==void 0&&s?.kind==="light"){let[h,p]=e.toScreen(a.at),u=e.px(Ze(a,s.on?s.brightness:void 0));if(Math.hypot(n[0]-(h+u*Math.cos(Nt)),n[1]-(p+u*Math.sin(Nt)))<=10)return this.glowDrag(e,t,a),!0}let r=this.pinAt(e,n);if(r===void 0)return t.shiftKey?(this.boxDrag(e,t,o),!0):!1;if(this.pickPage=!1,this.iconsOpen=!1,i)return e.select(zt(e.selection,r.id)),!0;let l=ye(e.selection);return l.length>1&&l.some(h=>x(h,r.id))?(this.groupDrag(e,t,l,r.id,o),!0):(e.select({kind:"pin",pinId:r.id}),this.moveDrag(e,t,r,o),!0)}groupDrag(e,t,o,n,i){let a=[0,0],s=rt(o);e.drag(t,{move:r=>{this.moving=!0,a=[r[0]-i[0],r[1]-i[1]];let[l,h]=a;e.preview(p=>Et(p,o,l,h))},end:(r,l,h)=>{this.moving=!1,e.preview(void 0);let[p,u]=a;h?Math.hypot(p,u)>=.005&&e.apply(g=>Et(g,o,p,u),s===void 0?{}:{select:s}):e.select({kind:"pin",pinId:n})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.moving=!1,this.box=void 0,e.preview(void 0)}boxDrag(e,t,o){let n=e.floor.pins,i=e.selection;e.drag(t,{move:a=>{this.box={a:o,b:a},e.redraw()},end:(a,s,r)=>{this.box=void 0,r?e.select(Mi(i,$i(n,o,a))):e.redraw()},cancel:()=>this.stopDrag(e)})}async removePicks(e,t){t.length!==0&&(t.length>1&&!await e.confirm({title:`Remove ${C(t.length,"device")} from the map?`,text:"They go back to Not on the map. Undo puts them back where they were.",ok:"Remove",danger:!0})||e.apply(o=>Ln(o,t),{select:null}))}moveDrag(e,t,o,n){let i=o.id,a=[o.at[0],o.at[1]],s=a;e.drag(t,{move:r=>{this.moving=!0,s=[a[0]+r[0]-n[0],a[1]+r[1]-n[1]],e.preview(l=>po(l,i,s))},end:(r,l,h)=>{this.moving=!1,e.preview(void 0),h&&Math.hypot(s[0]-a[0],s[1]-a[1])>=.005&&e.apply(p=>po(p,i,s),{select:{kind:"pin",pinId:i}})},cancel:()=>this.stopDrag(e)})}glowDrag(e,t,o){let n=o.id,i;e.drag(t,{move:a=>{this.moving=!0;let s=Math.hypot(a[0]-o.at[0],a[1]-o.at[1]);i=Math.min(Math.max(Math.round(s/.05)*.05,Le),jo);let r=i;e.preview(l=>qe(l,n,{glow:r}))},end:()=>{this.moving=!1,e.preview(void 0);let a=i;a!==void 0&&e.apply(s=>qe(s,n,{glow:a}))},cancel:()=>this.stopDrag(e)})}keyDown(e,t){let o=this.picks(e).map(i=>i.id);if(o.length===0)return!1;let n=ae(t,!1);if(n==="delete")return this.removePicks(e,o),!0;if(typeof n=="object"&&"nudge"in n){let[i,a]=n.nudge;return e.apply(s=>Et(s,o,i,a)),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.box=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1}dock(e){let t=(o,n,i,a)=>m`<button type="button" class="hme-tb ${n?"on":""}"
      aria-pressed=${n?"true":"false"} title=${a} @click=${()=>{i(),e.redraw()}}>${o}</button>`;return m`${t("Side view",this.side,()=>{this.side=!this.side},"The picked device's room from the side, to set its height")}
      ${t("Names",this.names,()=>{this.names=!this.names},"Every device's name under its pin")}`}stageExtra(e){let t=this.picked(e);if(!this.side||t===void 0)return v;let o=de(e.floor,t),n=o?.height??2.5,i=pe(o?.outline??e.floor.rooms.flatMap(E=>E.outline))??{minX:t.at[0]-1,maxX:t.at[0]+1,minY:0,maxY:0},a=18,s=118,r=(s-a)/Math.max(n,.5),l=30,h=262,p=(h-l)/Math.max(i.maxX-i.minX,.5),u=E=>l+(Math.min(Math.max(E,i.minX),i.maxX)-i.minX)*p,g=t.at[2],c=s-Math.min(Math.max(g,0),n)*r,f=u(t.at[0]),y=(()=>{let E=te(t.entityId,this.states(e));return E.kind==="light"&&E.on})(),b=[];for(let E=0;E<=n+1e-9;E+=1)b.push(E);let w=o===void 0?[]:Wo(o),P=o===void 0?"No room":I(o);return m`<div class="hme-side">
      <div class="hme-h">${P} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${j(t,e.hass)} at ${g.toFixed(2)} m, the wall ${n.toFixed(1)} m tall`}
        @pointerdown=${E=>this.heightDrag(e,E,t,n,s,r)}>
        <path d=${`M${l} ${k(a)}H${h}M${l} ${s}H${h}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${l} ${k(a)}V${s}M${h} ${k(a)}V${s}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${b.map(E=>$`<text x=${l-6} y=${k(s-E*r+3)}>${E===0?"0":`${E} m`}</text>
            <path d=${`M${l-4} ${k(s-E*r)}H${l}`} stroke="#8e8e93" />`)}
        </g>
        ${w.map(E=>{let D=u(E.c[0]-E.size[0]/2),N=u(E.c[0]+E.size[0]/2),A=Math.min(E.size[2],n)*r;return $`<rect x=${k(D)} y=${k(s-A)} width=${k(Math.max(N-D,2))} height=${k(A)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${k(f)} ${s}V${k(c)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${y?$`<circle cx=${k(f)} cy=${k(c)} r="20" fill="#ffb648" opacity="0.22" />`:v}
        <circle cx=${k(f)} cy=${k(c)} r="9" fill=${y?Kt:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${k(Math.min(f+14,222))} y=${k(c-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${k(Math.min(f+14,222)+22)} y=${k(c+3.5)} fill="#fff" font-size="10" text-anchor="middle">${g.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(e,t,o,n,i,a){if(t.button!==0)return;let s=t.currentTarget,r=o.id,l=g=>{let c=s.getBoundingClientRect(),f=(g.clientY-c.top)*130/Math.max(c.height,1);return Math.min(Math.max(Math.round((i-f)/a/.05)*.05,0),n)},h=l(t);try{s.setPointerCapture(t.pointerId)}catch{}this.moving=!0,e.preview(g=>ne(g,r,h));let p=g=>{h=l(g);let c=h;e.preview(f=>ne(f,r,c))},u=()=>{s.removeEventListener("pointermove",p),s.removeEventListener("pointerup",u),s.removeEventListener("pointercancel",u),this.moving=!1,e.preview(void 0);let g=h;Math.abs(g-o.at[2])>=.005&&e.apply(c=>ne(c,r,g))};s.addEventListener("pointermove",p),s.addEventListener("pointerup",u),s.addEventListener("pointercancel",u)}pill(e){let t=this.picks(e);if(t.length>1&&!this.moving)return this.groupPill(e,t);let o=this.picked(e);if(o===void 0||this.moving)return v;let n=o.id,i=o.entityId.startsWith("light."),a=de(e.floor,o)!==void 0;return m`<span class="hme-pill-name">${j(o,e.hass)}</span>
      ${Eo(o.entityId)&&e.hass!==void 0?m`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,o.entityId)}>${To(o.entityId,e.hass.states)}</button>`:v}
      ${i?m`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>e.apply(s=>_n(s,n))}>Same height for all lights</button>`:v}
      ${a?m`<button type="button" class="hme-tb" @click=${()=>e.apply(s=>An(s,n))}>Center in room</button>`:v}
      <button type="button" class="hme-tb danger" @click=${()=>e.apply(s=>ho(s,n),{select:null})}>Remove</button>`}groupPill(e,t){let o=t.map(r=>r.id),n=t[0],i=n.at[2],a=t.every(r=>Math.abs(r.at[2]-i)<.005),s=e.hass===void 0?void 0:ki(t.map(r=>r.entityId),e.hass.states);return m`<span class="hme-pill-name">${C(t.length,"device")}</span>
      ${s===void 0?v:m`<button type="button" class="hme-tb" @click=${()=>this.turn(e,t.map(r=>r.entityId),s.service)}>${s.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${a} title=${a?"They are all at one height":`Every picked device at ${j(n,e.hass)}'s height, ${i.toFixed(2)} m`}
        @click=${()=>e.apply(r=>Se(r,o,i))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,o)}}>Remove</button>`}toggle(e,t){let o=e.hass;o!==void 0&&qt(o,"homeassistant","toggle",{entity_id:t}).catch(n=>{e.note("err",`Could not turn it on or off: ${n instanceof Error?n.message:String(n)}`)})}turn(e,t,o){let n=e.hass;n!==void 0&&qt(n,"homeassistant",o,{entity_id:[...t]}).catch(i=>{e.note("err",`Could not turn them ${o==="turn_on"?"on":"off"}: ${i instanceof Error?i.message:String(i)}`)})}inspector(e){let t=this.picks(e);if(t.length>1)return this.groupInspector(e,t);let o=this.picked(e);if(o===void 0)return this.overview(e);let n=e.hass?.states,i=o.id,a=te(o.entityId,n),s=a.kind==="light"&&a.on,r=this.friendly(e,o.entityId),l=this.deviceClass(e,o.entityId),h=Ye(o.entityId,l,r),p=o.icon??h,g=de(e.floor,o)?.height??2.5,c=b=>e.apply(w=>qe(w,i,b,r)),y=Je(o)??Kt;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${s?"lit":""}" style=${s?`background:${y};box-shadow:0 0 24px ${y}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ue(p,s?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${j(o,e.hass)}</strong>
          <span class="mono">${o.entityId}</span>
        </div>
        <span class="hme-state ${s?"lit":""}">${_e(o.entityId,n)}</span>
      </section>

      ${H("On the map",m`
        ${O("Name",it({value:o.name??"",label:"Name on the map",placeholder:r??o.entityId,set:b=>c({name:b.trim()===""?null:b})}))}
        ${O("Icon",m`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
          @click=${()=>{this.iconsOpen=!this.iconsOpen,e.redraw()}}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${ue(p,"currentColor",24,2)}</svg>
          <span class="hme-grow">${ta(o,l,r)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
        ${this.iconsOpen?this.iconMenu(e,o,h,c):v}
        ${O("Room",m`<span class="hme-in hme-ro">${ea(e.floor,o)}</span>`)}
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${U({label:"None",picture:Ae("none",y),on:o.reading==="none",click:()=>c({reading:"none"})})}
          ${U({label:"Pill",picture:Ae("pill",y),on:o.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>c({reading:null})})}
          ${U({label:"Name",picture:Ae("name",y),on:o.reading==="name",click:()=>c({reading:"name"})})}
        </div></div>`)}

      ${H("Height",m`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${g} step="0.05" .value=${K(String(o.at[2]))} aria-label="Height" style=${$e(o.at[2],0,g)}
            @input=${b=>{let w=Number(b.target.value);e.preview(P=>ne(P,i,w))}}
            @change=${b=>{let w=Number(b.target.value);e.apply(P=>ne(P,i,w))}} />
          ${R({label:"Height",value:o.at[2],unit:"m",min:0,max:100,width:"92px",set:b=>e.apply(w=>ne(w,i,b))})}
        </div>
        <div class="hme-chips">${So.map(([b,w])=>m`<button type="button" class="hme-chip sel ${Math.abs(o.at[2]-w)<.005?"on":""}"
          @click=${()=>e.apply(P=>ne(P,i,w))}>${b} ${w}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${o.entityId.startsWith("light.")?this.lightCard(e,o,a.kind==="light"&&a.on?a.brightness:void 0,c):v}

      ${this.tapCard(e,o,c)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>e.apply(b=>ho(b,i),{select:null})}>Remove from the map</button></div>`}iconMenu(e,t,o,n){let i=s=>{this.iconsOpen=!1,n({icon:s}),e.redraw()},a=(s,r,l,h)=>m`<button type="button" class="hme-icon-cell ${l?"on":""}"
      title=${r} aria-label=${r} aria-pressed=${l?"true":"false"} @click=${()=>i(h)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${ue(s,"currentColor",24,1.9)}</svg><span>${r}</span></button>`;return m`<div class="hme-icons" role="group" aria-label="Icon">
      ${a(o,"Auto",t.icon===void 0,null)}
      ${Ko.map(s=>a(s,St[s],t.icon===s,s))}
    </div>`}lightCard(e,t,o,n){let i=t.id,a=Ze(t,o),s=Je(t),r=(l,h,p)=>m`<button type="button" class="hme-chip sel ${h?"on":""}" aria-pressed=${h?"true":"false"} @click=${p}>${l}</button>`;return H("Light",m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${Le} max=${Math.max(Ro,a)} step="0.05" .value=${K(String(a))} aria-label="Glow size"
          style=${$e(a,Le,Math.max(Ro,a))}
          @input=${l=>{let h=Number(l.target.value);e.preview(p=>qe(p,i,{glow:h}))}}
          @change=${l=>n({glow:Number(l.target.value)})} />
        <span class="hme-val mono hme-w48">${a.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${r("By its brightness",t.glow===void 0,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${r("Follow the light",t.glowColor===void 0,()=>n({glowColor:null}))}
        ${r("Warm",t.glowColor==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${s!==void 0?"on":""}">${s===void 0?v:m`<span class="hme-swatch" style=${`background:${s}`}></span>`}Pick
          <input type="color" .value=${K(s??"#ffb648")} aria-label="Pick the glow's color"
            @change=${l=>n({glowColor:l.target.value})} /></label>
      </div></div>
      ${xi(t.glowSpill===!0?"off":"on",l=>n({glowSpill:l?null:!0}))}
      ${W("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`)}groupInspector(e,t){let o=e.hass?.states,n=t.map(p=>p.id),i=p=>{e.apply(u=>mo(u,n,p))||e.note("warn","That could not be set on every picked device.")},a=Math.max(2.5,...t.map(p=>de(e.floor,p)?.height??2.5)),s=we(t.map(p=>p.at[2])),r=we(t.map(p=>p.reading)),l=t.every(p=>p.entityId.startsWith("light.")),h=Kt;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ue("bulb","#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${C(t.length,"device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${H("Picked",m`${t.map(p=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${()=>e.select({kind:"pin",pinId:p.id})}>${j(p,e.hass)}</button>
          <span class="hme-val">${_e(p.entityId,o)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${j(p,e.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(zt(e.selection,p.id))}>×</button></div>`)}`,String(t.length))}

      ${H("On the map",m`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${U({label:"None",picture:Ae("none",h),on:!r.mixed&&r.value==="none",click:()=>i({reading:"none"})})}
          ${U({label:"Pill",picture:Ae("pill",h),on:!r.mixed&&r.value===void 0,title:"Each one's reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>i({reading:null})})}
          ${U({label:"Name",picture:Ae("name",h),on:!r.mixed&&r.value==="name",click:()=>i({reading:"name"})})}
        </div></div>
        ${r.mixed?W("Mixed: they show different things. Pick one to set them all."):v}`)}

      ${H("Height",m`
        <div class="hme-r">
          ${Hi({label:"Height",value:s.mixed?void 0:s.value,min:0,max:a,step:.05,preview:p=>e.preview(u=>Se(u,n,p)),set:p=>e.apply(u=>Se(u,n,p))})}
          ${R({label:"Height",value:s.mixed?void 0:s.value,unit:"m",min:0,max:100,width:"92px",set:p=>e.apply(u=>Se(u,n,p))})}
        </div>
        <div class="hme-chips">${So.map(([p,u])=>m`<button type="button" class="hme-chip sel ${t.every(g=>Math.abs(g.at[2]-u)<.005)?"on":""}"
          @click=${()=>e.apply(g=>Se(g,n,u))}>${p} ${u}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${l?this.groupLightCard(e,t,i):v}

      ${this.groupTapCard(e,t,i)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,n)}}>Remove ${C(t.length,"device")} from the map</button></div>`}groupLightCard(e,t,o){let n=t.map(c=>c.id),i=this.states(e),a=t.map(c=>{let f=te(c.entityId,i);return Math.round(Ze(c,f.kind==="light"&&f.on?f.brightness:void 0)*20)/20}),s=we(a),r=Math.max(Ro,...a),l=t.every(c=>c.glow===void 0),h=we(t.map(c=>c.glowColor?.toLowerCase())),p=we(t.map(c=>c.glowSpill===!0)),u=h.mixed||h.value===void 0||h.value==="warm"?void 0:h.value,g=(c,f,y)=>m`<button type="button" class="hme-chip sel ${f?"on":""}" aria-pressed=${f?"true":"false"} @click=${y}>${c}</button>`;return H("Light",m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${Hi({label:"Glow size",value:s.mixed?void 0:s.value,min:Le,max:r,step:.05,preview:c=>e.preview(f=>mo(f,n,{glow:c})),set:c=>o({glow:c})})}
        <span class="hme-val mono hme-w48">${s.mixed?"Mixed":`${s.value.toFixed(1)} m`}</span></div>
      <div class="hme-row-end indent">${g("By its brightness",l,()=>o({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${g("Follow the light",!h.mixed&&h.value===void 0,()=>o({glowColor:null}))}
        ${g("Warm",!h.mixed&&h.value==="warm",()=>o({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${u!==void 0?"on":""}">${u===void 0?v:m`<span class="hme-swatch" style=${`background:${u}`}></span>`}Pick
          <input type="color" .value=${K(u??"#ffb648")} aria-label="Pick the glow's color for every picked light"
            @change=${c=>o({glowColor:c.target.value})} /></label>
      </div></div>
      ${h.mixed?W("Mixed: their colors differ. Pick one to set them all."):v}
      ${xi(p.mixed?"mixed":p.value?"off":"on",c=>o({glowSpill:c?null:!0}))}`)}groupTapCard(e,t,o){let n=we(t.map(l=>[l.tap,l.tap==="page"?l.pageId?.toLowerCase():void 0])),i=n.mixed?void 0:n.value,a=i?.[0]==="page"||this.pickPage,s=i?.[0]==="page"?t[0].pageId:void 0,r=l=>{if(l==="page"){e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:l??null})};return H("Tap on the map",m`
      <div class="hme-chips">${Io.map(([l,h])=>{let p=l==="page"?a:!this.pickPage&&i!==void 0&&i[0]===l;return m`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"}
          ?disabled=${l==="page"&&e.pages.length===0} title=${l==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>r(l)}>${h}</button>`})}</div>
      ${a?O("Page",ve({label:"Page",value:s??"",options:[...s===void 0?[{value:"",label:"Pick a page\u2026",disabled:!0}]:[],...s===void 0||e.pages.some(l=>x(l.id,s))?[]:[{value:s,label:"A page not in your library",disabled:!0}],...e.pages.map(l=>({value:l.id,label:l.name}))],set:l=>{this.pickPage=!1,l!==""&&o({tap:"page",pageId:l})}})):v}
      <p class="hme-text dim">${n.mixed&&!this.pickPage?"Mixed: a tap does different things on them. Pick one to set them all.":"Set on every picked device."}</p>`)}tapCard(e,t,o){let n=t.tap==="page"||this.pickPage,i=t.pageId===void 0||e.pages.some(s=>x(s.id,t.pageId)),a=s=>{if(s==="page"){if(t.tap==="page")return;e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:s??null})};return H("Tap on the map",m`
      <div class="hme-chips">${Io.map(([s,r])=>{let l=s==="page"?n:!this.pickPage&&t.tap===s;return m`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
          ?disabled=${s==="page"&&e.pages.length===0} title=${s==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>a(s)}>${r}</button>`})}</div>
      ${n?O("Page",ve({label:"Page",value:t.tap==="page"?t.pageId??"":"",options:[...t.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...i?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(s=>({value:s.id,label:s.name}))],set:s=>{this.pickPage=!1,s!==""&&o({tap:"page",pageId:s})}})):v}
      <p class="hme-text dim">${t.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":"Hold on the watch or iPhone: its controls."}</p>`)}overview(e){let t=Ce(e.selection),o=t===void 0?void 0:e.floor.rooms.find(a=>x(a.id,t)),n=o===void 0?e.floor.pins:ke(e.floor,o.id),i=e.hass?.states;return m`${H(o===void 0?"Devices":I(o),m`
        <p class="hme-text">${o===void 0?`${C(e.floor.pins.length,"device")} on this floor.`:`${C(n.length,"device")} in this room.`}</p>
        ${n.map(a=>m`<button type="button" class="hme-list-row" @click=${()=>e.select({kind:"pin",pinId:a.id})}>
          <span class="hme-grow">${j(a,e.hass)}</span><span class="hme-val">${_e(a.entityId,i)}</span></button>`)}`)}
      ${H("Devices",m`<p class="hme-text">Pick a device on the plan to set its name, icon, height, glow and what a tap on it does.</p>
        <p class="hme-text dim">Drag a device from Not on the map onto the plan to place it. Drag a pin to move it; arrow keys nudge it, Delete takes it off the map.</p>
        <p class="hme-text dim">Shift, Cmd or Ctrl and a click picks several; Shift and a drag over empty space picks every device in the box. Then drag one to move them all, or set them together.</p>`)}`}};function xi(d,e){let t=d==="on"?"walls stop the glow":d==="off"?"the glow spreads past the walls":"some stay in, some spread";return m`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${d==="mixed"?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${()=>e(!0)}>Mixed</button>`:Re({on:d==="on",onText:"On",offText:"Off",label:"Stay in room",click:()=>e(d!=="on")})}
    <span class="hme-text dim">${t}</span></div>`}function Hi(d){let e=d.value??(d.min+d.max)/2;return m`<input class="hme-range ${d.value===void 0?"mixed":""}" type="range" min=${d.min} max=${d.max} step=${d.step} .value=${K(String(e))}
    aria-label=${d.label} aria-valuetext=${d.value===void 0?"Mixed":v} style=${d.value===void 0?"--p:0%":$e(d.value,d.min,d.max)}
    @input=${t=>{let o=t.target;o.classList.remove("mixed"),d.preview(Number(o.value))}}
    @change=${t=>d.set(Number(t.target.value))} />`}function Ae(d,e){return m`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${d==="none"?20:16} r="9" fill=${e} />
    ${d==="pill"?$`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:v}
    ${d==="name"?$`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:v}
  </svg>`}var Si=[{id:"select",label:"Walls and corners",key:"v"},{id:"draw",label:"Draw a room",key:"r"},{id:"split",label:"Split a room",key:"s"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"opening",label:"Way through (no door)",key:"o"},{id:"stairs",label:"Stairs",key:"t"}];function oa(d){return Si.find(e=>e.key===d.toLowerCase())?.id}var na=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],ia=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function aa(d){return d===2?"Fix both":`Fix all ${ia[d]??d}`}var ra=9,Pi=18,Do="#4fd6c2",sa="Draw each room faint and dashed as the iPhone scanned it, or as first seen for a room scanned before scans were kept. A room drawn here has none.",da="Put this room's walls, doors, windows and furniture back as the iPhone scanned it. Its devices stay where they are.",M=d=>d.toFixed(1),re=d=>`${d[0].toFixed(1)},${d[1].toFixed(1)}`,Ei=new WeakMap;function Gt(d){let e=Ei.get(d);return e===void 0&&Ei.set(d,e=Sn(d)),e}function Oo(d,e,t,o){let n=t/d.view.scale,i=a=>{let s;for(let r of a)for(let[l,h]of B(r).entries()){let p=nn(e,h);p<=n&&(s===void 0||p<s.d)&&(s={room:r,wall:l,seg:h,d:p})}return s};return(o===void 0?void 0:i([o]))??i(d.floor.rooms)}function Ti(d,e){let t=Math.max(le(e),1e-9),o=[-(e.b[1]-e.a[1])/t,(e.b[0]-e.a[0])/t],n=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],i=q(d)??se(d);return(i[0]-n[0])*o[0]+(i[1]-n[1])*o[1]>0&&(o=[-o[0],-o[1]]),o}var Wt=class{constructor(){this.id="shape";this.tool="select";this.draw=new De(be);this.dragging=!1}setTool(e,t){this.first=void 0,t==="draw"?this.draw.start(e):this.draw.stop(),this.tool=t,e.redraw()}focus(e){let t=Ce(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>x(o.id,t))}pickedWall(e,t){let o=e.selection;if(!(t===void 0||o===void 0)){if(o.kind==="wall")return o.wall;if(o.kind==="opening"){let n=t.openings[o.opening],i=n===void 0?-1:$t(t,n);return i>=0?i:void 0}}}rail(e){let t=Gt(e.floor),o=e.floor.id;return m`
      <section class="hme-card hme-tools">
        <div class="hme-h">Tools</div>
        ${Si.map((n,i)=>m`${i===4?m`<div class="hme-sep"></div>`:v}
          <button type="button" class="hme-tool ${this.tool===n.id?"on":""}" aria-pressed=${this.tool===n.id?"true":"false"}
            @click=${()=>this.setTool(e,n.id)}>${la[n.id]}${n.label}<kbd>${n.key.toUpperCase()}</kbd></button>`)}
      </section>
      ${H("Scan check",m`
        ${t.length===0?m`<p class="hme-text dim">Nothing to fix. The walls meet and every room has a way in.</p>`:v}
        ${t.map(n=>m`<div class="hme-fix">
          <span class="hme-fix-dot ${n.kind==="missingDoor"?"gray":""}"></span>
          <p @click=${()=>e.select({kind:"room",roomId:n.roomIds[0]})}><b>${n.title}</b> ${n.detail}</p>
          <button type="button" class="hme-tb" @click=${()=>e.apply(i=>n.fix(i))}>${n.fixLabel}</button></div>`)}
        ${t.length>1?m`<button type="button" class="hme-tb hme-wide" @click=${()=>e.apply(n=>In(n,o))}>${aa(t.length)}</button>`:v}`,t.length===0?void 0:m`<span class="hme-amber">${t.length} to fix</span>`)}`}overlay(e){if(this.tool==="draw")return this.draw.overlay(e);let t=this.focus(e),o=[];if(t!==void 0&&t.outline.length>=3){let n=t.outline.map(i=>re(e.toScreen(i))).join("L");o.push($`<path d=${`M0 0H${e.stage.width}V${e.stage.height}H0ZM${n}Z`} fill="rgba(0,0,0,0.45)" fill-rule="evenodd" pointer-events="none" />`)}return e.toggles.scan&&o.push(...this.scanMarks(e)),o.push(...this.issueMarks(e)),t!==void 0&&o.push(this.roomHandles(e,t)),o.push(...this.toolGhost(e)),$`${o}`}scanMarks(e){return Dn(e.floor,e.scans).map(t=>{let o=t.outline.map(i=>re(e.toScreen(i))).join("L"),n=t.walls.map(i=>`M${re(e.toScreen(i.a))}L${re(e.toScreen(i.b))}`).join("");return $`<g class="hme-scan" data-room=${t.roomId} pointer-events="none">
        <path d=${`M${o}Z`} fill=${Do} fill-opacity="0.06" stroke="none" />
        <path d=${n} fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="3.5" stroke-dasharray="7 5" />
        <path d=${n} fill="none" stroke=${Do} stroke-width="1.6" stroke-dasharray="7 5" stroke-opacity="0.9" />
        ${t.openings.map(i=>{let a=e.toScreen(i.a),s=e.toScreen(i.b);return $`<line x1=${M(a[0])} y1=${M(a[1])} x2=${M(s[0])} y2=${M(s[1])} stroke=${Do} stroke-width="4" stroke-opacity="0.85"
            stroke-dasharray=${i.kind==="window"?"2 3":"none"} />`})}
      </g>`})}issueMarks(e){return Gt(e.floor).map(t=>{let[o,n]=e.toScreen(t.where);if(t.kind==="offSquare"){let l=/(\d+)°/.exec(t.title)?.[1]??"";return $`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} Click to square it.</title>
          <circle cx=${M(o)} cy=${M(n)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${M(o+12)} y=${M(n+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${M(o+34)} y=${M(n+20)} fill="#2a1a00" text-anchor="middle">${l}°</text></g></g>`}let i=`${Math.round(t.amount*100)} cm`,a=t.kind==="overlap"?`Overlap ${i} \xB7 ${t.fixLabel}`:t.kind==="gap"?`Gap ${i} \xB7 ${t.fixLabel}`:`No door \xB7 ${t.fixLabel}`,s=a.length*6.2+18,r=t.kind==="missingDoor";return $`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} ${t.detail}</title>
        <circle cx=${M(o)} cy=${M(n)} r="4" fill=${r?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${M(o-s/2)} y=${M(n+8)} width=${M(s)} height="20" rx="10" fill=${r?"#8e8e93":"#ffb340"} />
        <text x=${M(o)} y=${M(n+22)} fill=${r?"#fff":"#2a1a00"} text-anchor="middle">${a}</text></g></g>`})}roomHandles(e,t){let o=B(t),n=e.selection,i=this.pickedWall(e,t),a=[];if(i!==void 0&&o[i]!==void 0){let r=o[i],l=e.toScreen(r.a),h=e.toScreen(r.b),p=Ti(t,r);if(a.push($`<line x1=${M(l[0])} y1=${M(l[1])} x2=${M(h[0])} y2=${M(h[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),n?.kind==="wall"&&!this.dragging){let u=[(l[0]+h[0])/2+p[0]*22,(l[1]+h[1])/2+p[1]*22];a.push($`<g class="hme-tag" pointer-events="none"><rect x=${M(u[0]-27)} y=${M(u[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${M(u[0])} y=${M(u[1]+4)} fill="#fff" text-anchor="middle">${le(r).toFixed(2)} m</text></g>`)}}for(let[r,l]of t.openings.entries()){let h=e.toScreen(l.a),p=e.toScreen(l.b),u=n?.kind==="opening"&&n.opening===r,g=l.kind==="window"?"#8bb8f0":l.kind==="door"?"#ece6da":"#98989d";a.push($`<g data-hme=${`opening:${r}`} style="cursor:ew-resize">
        <line x1=${M(h[0])} y1=${M(h[1])} x2=${M(p[0])} y2=${M(p[1])} stroke=${u?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${M(h[0])} y1=${M(h[1])} x2=${M(p[0])} y2=${M(p[1])} stroke=${g} stroke-width="3" />
        ${u?$`<circle cx=${M(h[0])} cy=${M(h[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" /><circle cx=${M(p[0])} cy=${M(p[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" />`:v}
      </g>`)}let s=this.sliding!==void 0&&x(this.sliding.roomId,t.id)?this.sliding.index:n?.kind==="opening"?n.opening:void 0;if(s!==void 0&&t.openings[s]!==void 0&&a.push(this.distances(e,t,t.openings[s])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[r,l]of o.entries()){if(le(l)*e.view.scale<40)continue;let h=e.toScreen([(l.a[0]+l.b[0])/2,(l.a[1]+l.b[1])/2]);a.push($`<circle data-hme=${`mid:${r}`} cx=${M(h[0])} cy=${M(h[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[r,l]of t.outline.entries()){let[h,p]=e.toScreen(l),u=n?.kind==="corner"&&n.corner===r;a.push($`<circle data-hme=${`corner:${r}`} cx=${M(h)} cy=${M(p)} r="7" fill=${u?"#5b8def":"#fff"} stroke=${u?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return $`<g class="hme-handles">${a}</g>`}distances(e,t,o){let n=$t(t,o),i=n>=0?B(t)[n]:void 0;if(i===void 0)return $``;let a=le(i),s=he(o.a,i.a,i.b).along,r=he(o.b,i.a,i.b).along,l=Math.max(0,Math.min(s,r)),h=Math.min(a,Math.max(s,r)),p=Ti(t,i),u=[(i.b[0]-i.a[0])/a,(i.b[1]-i.a[1])/a],g=b=>{let w=e.toScreen([i.a[0]+u[0]*b,i.a[1]+u[1]*b]);return[w[0]+p[0]*26,w[1]+p[1]*26]},c=[0,l,h,a],f=b=>`M${re([b[0]-p[0]*5,b[1]-p[1]*5])}L${re([b[0]+p[0]*5,b[1]+p[1]*5])}`,y=[[0,l,!1],[l,h,!0],[h,a,!1]];return $`<g class="hme-dist" pointer-events="none">
      <path d=${`M${re(g(0))}L${re(g(a))}${c.map(b=>f(g(b))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${y.filter(([b,w])=>w-b>.02).map(([b,w,P])=>{let E=g((b+w)/2);return $`<g class="hme-tag"><rect x=${M(E[0]-25)} y=${M(E[1]-9)} width="50" height="18" rx="9" fill=${P?"#5b8def":"#2c2c2e"} />
          <text x=${M(E[0])} y=${M(E[1]+4)} fill="#fff" text-anchor="middle">${(w-b).toFixed(2)} m</text></g>`})}
    </g>`}toolGhost(e){let t=this.hoverAt;if(t===void 0)return[];let o=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let n=Oo(e,t,Pi,this.focus(e));if(n!==void 0){let i=this.tool==="window"?1.2:.9,a=le(n.seg),s=Math.min(i,a),r=Math.min(Math.max(he(t,n.seg.a,n.seg.b).along,s/2),a-s/2),l=[(n.seg.b[0]-n.seg.a[0])/a,(n.seg.b[1]-n.seg.a[1])/a],h=e.toScreen([n.seg.a[0]+l[0]*(r-s/2),n.seg.a[1]+l[1]*(r-s/2)]),p=e.toScreen([n.seg.a[0]+l[0]*(r+s/2),n.seg.a[1]+l[1]*(r+s/2)]);o.push($`<line x1=${M(h[0])} y1=${M(h[1])} x2=${M(p[0])} y2=${M(p[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&V(e.floor,t)!==void 0){let[n,i]=e.toScreen(t),a=e.px(1),s=e.px(2.6);o.push($`<g pointer-events="none" opacity="0.7"><rect x=${M(n-a/2)} y=${M(i-s/2)} width=${M(a)} height=${M(s)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(r=>$`<line x1=${M(n-a/2)} x2=${M(n+a/2)} y1=${M(i-s/2+s*r/8)} y2=${M(i-s/2+s*r/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let n=e.toScreen(this.first.a),i=e.toScreen(this.snap(e,t,this.first.a));if(this.tool==="split"){let a=Math.max(Math.hypot(i[0]-n[0],i[1]-n[1]),1e-6),s=[(i[0]-n[0])/a,(i[1]-n[1])/a],r=Math.hypot(e.stage.width,e.stage.height);o.push($`<line x1=${M(n[0]-s[0]*r)} y1=${M(n[1]-s[1]*r)} x2=${M(n[0]+s[0]*r)} y2=${M(n[1]+s[1]*r)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else o.push($`<line x1=${M(n[0])} y1=${M(n[1])} x2=${M(i[0])} y2=${M(i[1])} stroke="#ece6da" stroke-width=${M(Math.max(e.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);o.push($`<circle cx=${M(n[0])} cy=${M(n[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return o}snap(e,t,o){return Po(e.floor,t,e.view.scale,{...o===void 0?{}:{from:o},...e.toggles.grid?{grid:be}:{}})}pointerDown(e,t,o){if(this.tool==="draw")return this.draw.pointerDown(e,t,o);if(t.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let n=Oo(e,o,Pi,this.focus(e));if(n===void 0)return!1;let i=this.tool,a=n.room.id,s=n.room.openings.length,r=n.wall;return e.apply(l=>Ht(l,a,r,{kind:i,at:o}),{select:{kind:"opening",roomId:a,opening:s}})&&this.setTool(e,"select"),!0}case"stairs":{let n=V(e.floor,o);if(n===void 0)return!1;let i=n.id;return e.apply(a=>Mn(a,i,o),{select:{kind:"room",roomId:i}})&&this.setTool(e,"select"),!0}case"split":case"inner":return this.twoPoints(e,o);default:return this.pick(e,t,o)}}twoPoints(e,t){if(this.first===void 0){let a=V(e.floor,t)??this.focus(e);return a===void 0?!1:(this.first={roomId:a.id,a:this.snap(e,t)},e.select({kind:"room",roomId:a.id}),!0)}let{roomId:o,a:n}=this.first,i=this.snap(e,t,n);if(this.first=void 0,Math.hypot(i[0]-n[0],i[1]-n[1])<.1)return e.redraw(),!0;if(this.tool==="inner"){let a=e.doc.floors.flatMap(r=>r.rooms).find(r=>x(r.id,o)),s=a===void 0?0:Jt(a).length;return e.apply(r=>En(r,o,n,i),{select:{kind:"wall",roomId:o,wall:s}})?this.setTool(e,"select"):e.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(e,o,n,i),!0}async split(e,t,o,n){let i=e.floor.rooms.find(r=>x(r.id,t)),a=await e.ask({title:"Name the new room",label:"Name",value:i===void 0?"Room":`${I(i)} 2`,ok:"Split the room"});if(a===void 0)return;let s=e.newId();e.apply(r=>Tn(r,t,o,n,s,a),{select:{kind:"room",roomId:s}})?this.setTool(e,"select"):e.note("err","That line does not cut the room in two. Draw it right across the room.")}pick(e,t,o){let n=this.focus(e),i=t.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[a,s]=i.split(/:(.*)/s);if(a==="issue"){let p=Gt(e.floor).find(u=>u.id===s);return p!==void 0&&e.apply(u=>p.fix(u)),!0}let r=Number(s);if(n!==void 0&&a==="corner"&&Number.isInteger(r))return this.cornerDrag(e,t,n,r),!0;if(n!==void 0&&a==="mid"&&Number.isInteger(r))return this.midDrag(e,t,n,r),!0;if(n!==void 0&&a==="opening"&&Number.isInteger(r))return this.openingDrag(e,t,n,r),!0;let l=Oo(e,o,ra,n);if(l!==void 0)return this.wallAt=he(o,l.seg.a,l.seg.b).point,e.select({kind:"wall",roomId:l.room.id,wall:l.wall}),!0;let h=V(e.floor,o);return h===void 0?!1:(e.select({kind:"room",roomId:h.id}),!0)}cornerTo(e,t,o,n){let i=e.floor.rooms.filter(r=>!x(r.id,t.id)).flatMap(r=>r.outline),a=10/e.view.scale;for(let r of i)if(Math.hypot(r[0]-n[0],r[1]-n[1])<=a)return[r[0],r[1]];let s=n;if(e.toggles.grid&&(s=[Math.round(s[0]/be)*be,Math.round(s[1]/be)*be]),e.toggles.square){let r=rn(e.floor.rooms.flatMap(y=>Jt(y))),l=Math.cos(r),h=Math.sin(r),p=y=>[y[0]*l+y[1]*h,-y[0]*h+y[1]*l],[u,g]=p(s),c=t.outline.length,f=8/e.view.scale;for(let y of[(o+c-1)%c,(o+1)%c]){let[b,w]=p(t.outline[y]);Math.abs(u-b)<=f&&(u=b),Math.abs(g-w)<=f&&(g=w)}s=[u*l-g*h,u*h+g*l]}return s}cornerDrag(e,t,o,n){let i=o.id,a;e.drag(t,{move:s=>{this.dragging=!0;let r=this.cornerTo(e,o,n,s);a=r,e.preview(l=>Te(l,i,n,r))},end:(s,r,l)=>{this.dragging=!1,e.preview(void 0);let h=a,p={kind:"corner",roomId:i,corner:n};l&&h!==void 0?e.apply(u=>Te(u,i,n,h),{select:p}):e.select(p)},cancel:()=>this.stopDrag(e)})}midDrag(e,t,o,n){let i=o.id,a=B(o)[n],s=kt(e.doc,i,n),r=s?.floors.flatMap(g=>g.rooms).find(g=>x(g.id,i));if(a===void 0||s===void 0||r===void 0)return;let l=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],h=r.outline.reduce((g,c,f)=>Math.hypot(c[0]-l[0],c[1]-l[1])<Math.hypot(r.outline[g][0]-l[0],r.outline[g][1]-l[1])?f:g,0),p=g=>c=>{let f=kt(c,i,n);return f===void 0||g===void 0?f:Te(f,i,h,g)},u;e.drag(t,{move:g=>{this.dragging=!0,u=this.cornerTo(e,r,h,g),e.preview(p(u))},end:(g,c,f)=>{this.dragging=!1,e.preview(void 0),e.apply(p(f?u:void 0),{select:{kind:"corner",roomId:i,corner:h}})},cancel:()=>this.stopDrag(e)})}openingDrag(e,t,o,n){let i=o.id,a=o.openings[n];if(a===void 0)return;let s={kind:"opening",roomId:i,opening:n},r=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],l,h;e.select(s),e.drag(t,{move:p=>{l??=p,this.dragging=!0,this.sliding={roomId:i,index:n};let u=[r[0]+p[0]-l[0],r[1]+p[1]-l[1]];h=u,e.preview(g=>lo(g,i,n,u))},end:(p,u,g)=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let c=h;g&&c!==void 0&&e.apply(f=>lo(f,i,n,c),{select:s})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.dragging=!1,this.sliding=void 0,e.preview(void 0)}hover(e,t){if(this.tool==="draw"){this.draw.hover(e,t);return}this.tool!=="select"&&(this.hoverAt=t,e.redraw())}keyDown(e,t){if(this.tool==="draw"&&this.draw.active&&(t.key==="Enter"||t.key==="Backspace"||t.key==="Delete"))return this.draw.keyDown(e,t);let o=ae(t,!1);if(typeof o=="object"&&"letter"in o){let n=oa(o.letter);return n===void 0?!1:(this.setTool(e,n),!0)}if(o==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(e,"select"),!0;if(o==="delete"){let n=e.selection;if(n?.kind==="corner")e.apply(i=>xt(i,n.roomId,n.corner),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="opening")e.apply(i=>Pt(i,n.roomId,n.opening),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="wall")e.apply(i=>so(i,n.roomId,n.wall),{select:{kind:"room",roomId:n.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(e){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.draw.stop(),this.tool="select",e.redraw()}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.square?"on":""}" aria-pressed=${e.toggles.square?"true":"false"}
        title="A dragged corner lines up with the corners beside it" @click=${()=>e.setToggle("square",!e.toggles.square)}>Snap to 90°</button>
      <button type="button" class="hme-tb ${e.toggles.grid?"on":""}" aria-pressed=${e.toggles.grid?"true":"false"}
        @click=${()=>e.setToggle("grid",!e.toggles.grid)}>Grid 5 cm</button>
      ${e.scans===void 0?v:m`<button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"}
        title=${sa} @click=${()=>e.setToggle("scan",!e.toggles.scan)}>Show scan as it was</button>`}`}pill(e){if(this.tool==="draw")return m`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?m`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(e)}}>Close the room</button>`:v}
        <button type="button" class="hme-tb" @click=${()=>this.setTool(e,"select")}>Cancel</button>`;if(this.tool!=="select"){let a={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in a room to put stairs there"};return m`<span class="hme-pill-name">${a[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(e,"select")}>Cancel</button>`}let t=this.focus(e),o=e.selection;if(t===void 0||o===void 0||this.dragging)return v;let n=t.id,i=I(t);if(o.kind==="wall"){let a=o.wall,s=this.wallAt,r=Mo(t,a,i).replace(", "," \xB7 ");return m`<span class="hme-pill-name">${r}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,a,"window",s)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,a,"door",s)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,a,s)}>Add a corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(l=>ro(l,n,a))}>Straighten</button>`}if(o.kind==="corner")return m`<span class="hme-pill-name">${i} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(a=>xt(a,n,o.corner),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(a=>oe(a,n))}>Square the corners</button>`;if(o.kind==="opening"){let a=t.openings[o.opening];return a===void 0?v:m`<span class="hme-pill-name">${ge(a)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(s=>Pt(s,n,o.opening),{select:{kind:"room",roomId:n}})}>Remove</button>`}return m`<span class="hme-pill-name">${i}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(a=>oe(a,n))}>Square the corners</button>`}addHere(e,t,o,n,i){let a=t.id,s=t.openings.length;e.apply(r=>Ht(r,a,o,{kind:n,...i===void 0?{}:{at:i}}),{select:{kind:"opening",roomId:a,opening:s}})}cornerHere(e,t,o,n){let i=t.id,a=p=>kt(p,i,o,n),s=a(e.doc)?.floors.flatMap(p=>p.rooms).find(p=>x(p.id,i)),r=B(t)[o],l=n??(r===void 0?void 0:[(r.a[0]+r.b[0])/2,(r.a[1]+r.b[1])/2]),h=s===void 0||l===void 0?-1:s.outline.reduce((p,u,g)=>Math.hypot(u[0]-l[0],u[1]-l[1])<Math.hypot(s.outline[p][0]-l[0],s.outline[p][1]-l[1])?g:p,0);e.apply(a,{select:h<0?{kind:"room",roomId:i}:{kind:"corner",roomId:i,corner:h}})}inspector(e){let t=this.focus(e),o=e.selection;if(t===void 0||o===void 0){let p=Gt(e.floor);return H("Shape",m`<p class="hme-text">Pick a room, then a wall or a corner. Drag a corner to move it; a corner two rooms share moves for both.</p>
        <p class="hme-text dim">${p.length===0?"The scan check found nothing to fix on this floor.":`The scan check found ${C(p.length,"thing")} to fix. They are marked in amber.`}</p>`)}let n=t.id;if(o.kind==="corner")return this.cornerCard(e,t,o.corner);let i=this.pickedWall(e,t);if(i===void 0){let p=Go(e.scans,n),u=p!==void 0&&Cn(t,p)?p:void 0;return H(I(t),m`
        ${O("Corners",m`<span class="hme-val">${t.outline.length}</span>`)}
        ${O("Walls",m`<span class="hme-val">${B(t).length}</span>`)}
        ${O("Wall height",R({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:g=>e.apply(c=>Ge(c,n,g))}))}
        ${W("Click a wall to change it or put a door or window in it. Drag a corner to move it, or the dot in a wall's middle to add a corner.")}
        ${u===void 0?v:W("Its shape has changed since the iPhone scanned it.")}
        <div class="hme-row-end">
          ${u===void 0?v:m`<button type="button" class="hme-tb" title=${da} @click=${()=>e.apply(g=>Rn(g,n,u))}>Back to the scan</button>`}
          <button type="button" class="hme-tb" @click=${()=>e.apply(g=>oe(g,n))}>Square the corners</button>
        </div>`)}let a=B(t)[i],s=t.openings.map((p,u)=>({o:p,i:u})).filter(({o:p})=>$t(t,p)===i),r=o.kind==="opening"?t.openings[o.opening]:void 0,l=le(a),h=p=>{let u=t.openings.length;e.apply(g=>Ht(g,n,i,{kind:p}),{select:{kind:"opening",roomId:n,opening:u}})};return m`
      ${H("Wall",m`
        ${O("Room",m`<span class="hme-val strong">${Mo(t,i,I(t))}</span>`)}
        ${O("Length",R({label:"Length",value:l,unit:"m",min:.1,max:200,set:p=>e.apply(u=>Hn(u,n,i,p))}))}
        ${O("Thickness",R({label:"Thickness",value:a.t,unit:"m",min:.01,max:1,set:p=>e.apply(u=>Pn(u,n,i,p))}))}
        ${O("Height",R({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:p=>e.apply(u=>Ge(u,n,p))}))}
        ${W("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-row-end indent">
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>ro(p,n,i))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>oe(p,n))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,i,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>e.apply(p=>so(p,n,i),{select:{kind:"room",roomId:n}})}>Remove</button>
        </div>`)}
      ${H("On this wall",m`
        ${s.map(({o:p,i:u})=>{let g=he(p.a,a.a,a.b).along,c=he(p.b,a.a,a.b).along,f=o.kind==="opening"&&o.opening===u;return m`<button type="button" class="hme-list-row ${f?"on":""}" @click=${()=>e.select({kind:"opening",roomId:n,opening:u})}>
            <span class="hme-grow">${ge(p)}</span><span class="mono dim">${yo(Math.abs(c-g))} · ${yo(Math.max(0,Math.min(g,c)))} in</span></button>`})}
        ${s.length===0?m`<p class="hme-empty-line">Nothing on this wall.</p>`:v}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>h("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>h("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>h("opening")}>＋ Way through</button>
        </div>`)}
      ${r===void 0||o.kind!=="opening"?v:this.openingCard(e,t,o.opening,r)}`}openingCard(e,t,o,n){let i=t.id,a=Math.hypot(n.b[0]-n.a[0],n.b[1]-n.a[1]),s=n.z1-n.z0;return H(ge(n),m`
      <div class="hme-pics">${na.map(r=>U({label:r.label,picture:pa[r.label],on:n.kind===r.kind&&n.style===r.style,click:()=>e.apply(l=>Xe(l,i,o,{kind:r.kind,style:r.style??null}))}))}</div>
      ${O("Width",R({label:"Width",value:a,unit:"m",min:.1,max:20,set:r=>e.apply(l=>Xe(l,i,o,{width:r}))}))}
      ${O("From floor",R({label:"From floor",value:n.z0,unit:"m",min:0,max:20,set:r=>e.apply(l=>Xe(l,i,o,{z0:r,z1:r+s}))}),m`<span class="hme-l short">Tall</span>`,R({label:"Tall",value:s,unit:"m",min:.05,max:20,set:r=>e.apply(l=>Xe(l,i,o,{z1:n.z0+r}))}))}
      ${W("Drag it along the wall. The plan shows the space to each corner.")}
      <div class="hme-row-end indent"><button type="button" class="hme-tb danger" @click=${()=>e.apply(r=>Pt(r,i,o),{select:{kind:"room",roomId:i}})}>Remove ${ge(n).toLowerCase()}</button></div>`)}cornerCard(e,t,o){let n=t.id,i=t.outline[o];if(i===void 0)return m``;let a=e.floor.rooms.filter(s=>!x(s.id,n)&&s.outline.some(r=>Math.hypot(r[0]-i[0],r[1]-i[1])<=.02));return H("Corner",m`
      ${O("Room",m`<span class="hme-val strong">${I(t)}</span>`)}
      ${O("Left, top",R({label:"Corner left",value:i[0],unit:"m",set:s=>e.apply(r=>Te(r,n,o,[s,i[1]]))}),R({label:"Corner top",value:i[1],unit:"m",set:s=>e.apply(r=>Te(r,n,o,[i[0],s]))}))}
      ${W(a.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${a.map(I).join(", ")}, which move${a.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(s=>xt(s,n,o),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(s=>oe(s,n))}>Square the corners</button>
      </div>`)}},la={select:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,draw:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`,split:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},pa={Door:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var Bt={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function ha(d,e){if(!Tt(d))return"Home style";let t=co(d,e),o=i=>Object.hasOwn(d,zn[i]),n=[];return o("look")&&n.push(Bt[t.look].title),o("turn")&&n.push(`turned ${t.turn}\xB0`),o("names")&&n.push(t.names?"room names":"no room names"),o("devices")&&n.push(t.devices==="all"?"every device":t.devices==="none"?"no devices":"lights only"),o("furniture")&&n.push(t.furniture?"furniture":"no furniture"),o("glow")&&n.push(t.glow?"glow":"no glow"),`Own look: ${n.join(", ")}`}var Ii=(d,e)=>typeof d=="number"&&Number.isFinite(d)?d:e;function ma(d,e){let t=Qo(d);return Jo(d).flatMap(o=>{if(Yt(gt(o))!=="home_map")return[];let n=o,i=en(gt(o)),a=e?.floors.find(u=>x(u.id,i)),s=typeof n.homeMapRoomId=="string"?n.homeMapRoomId:void 0,r=s===void 0?void 0:a?.rooms.find(u=>x(u.id,s)),l=`${Ii(o.colSpan,1)}\xD7${Ii(o.rowSpan,1)}`,p=(typeof o.customLabel=="string"&&o.customLabel.trim()!==""?o.customLabel.trim():void 0)??(r?.name?.trim()?`${r.name.trim()} only`:a===void 0||(e?.floors.length??0)<=1?"Home map":z(a));return[{pageId:t,pageName:ft(d),tileId:typeof o.id=="string"?o.id:"",what:p,size:l,own:Tt(n),words:ha(n,e),look:co(n,e).look}]})}function Ci(d,e){return Object.values(d?.pages??{}).map(o=>o?.item).filter(o=>ut(o)).sort((o,n)=>ft(o).localeCompare(ft(n))).flatMap(o=>ma(o,e))}function Ri(d){let e=!1;if(!Array.isArray(d.pages))return;let t=d.pages.map(o=>{if(!ut(o)||!Array.isArray(o.items))return o;let n=o.items.map(i=>!ut(i)||Yt(gt(i))!=="home_map"||!Tt(i)?i:(e=!0,Kn(i)));return{...o,items:n}});return e?{...d,pages:t}:void 0}var Ut={width:112,height:68},ca={width:94,height:94,radius:34},ua={width:188,height:94,radius:22},fa={width:60,height:94,radius:18},ga=1.6,Xt=class{constructor(){this.id="style";this.usesState="idle";this.busy=!1}style(e){let t=Ve(e.doc);return this.turnLive===void 0?t:{...t,turn:this.turnLive}}set(e,t){e.apply(o=>Nn(o,t))}rail(e){let t=this.style(e),o=e.hass?.states;return m`<div class="hme-h hme-pad">Looks</div>
      <div class="hme-looks">
        ${No.map(n=>{let i=n===t.look,a=fe({floor:e.floor,states:o,...t,look:n,names:!1,width:Ut.width,height:Ut.height});return m`<button type="button" class="hme-look ${i?"on":""}" aria-pressed=${i?"true":"false"} @click=${()=>this.set(e,{look:n})}>
            <svg viewBox=${`0 0 ${Ut.width} ${Ut.height}`} style=${`background:${ie(n,.5)}`} aria-hidden="true">${a}</svg>
            <span>${Bt[n].title}</span></button>`})}
      </div>
      <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`}stage(e){let t=this.style(e),o=Ie.includes(t.look),n=Bt[t.look],{width:i,height:a}=e.stage,s=Math.min(Math.max(i/760,1),2.6),r=Math.max(i/s,1),l=Math.max(a/s,1),h=i<=0?v:fe({floor:e.floor,states:e.hass?.states,...t,width:Math.max(r-48,1),height:Math.max(l-96,1),tileHeight:l,icons:e.icons});return m`<div class="hme-style-col">
      <div class="hme-stage hme-style-big ${o?"turns":""}" style=${`background:${ie(t.look,s)}`}
        @pointerdown=${p=>{o&&this.turnDrag(e,p,t.turn)}}>
        <div class="hme-style-title" style=${`color:${It(t.look)}`}><strong>${n.title}</strong><span>${n.hint}</span></div>
        <svg class="hme-svg" viewBox=${`0 0 ${r.toFixed(1)} ${l.toFixed(1)}`} role="img" aria-label=${`The floor in the ${n.title} look`}>
          <g transform="translate(24 64)">${h}</g></svg>
        ${o?m`<span class="hme-style-turn" style=${`color:${It(t.look)}`}>Drag to turn · ${t.turn}°</span>`:v}
      </div>
      <section class="hme-card hme-style-tiles">
        ${this.face(e,t,ca,"Watch tile 2 \xD7 2",!0)}
        ${this.face(e,t,ua,"iPhone tile 4 \xD7 2",!0)}
        ${this.face(e,t,fa,"iPhone full map",!1)}
      </section>
    </div>`}face(e,t,o,n,i){let a=Math.min(Math.max(e.stage.width/1100,ga),2.6),s=e.hass?.states,r=i?Un(o.width,o.height):{x:4,y:4,width:o.width-8,height:o.height-8},l=fe({floor:e.floor,states:s,...t,width:r.width,height:r.height,tileHeight:i?o.height:0,icons:e.icons}),h=ht(e.floor,s),p=6*a;return m`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${o.width*a}px;height:${o.height*a}px;border-radius:${o.radius}px;background:${ie(t.look,a)}`}>
        <svg viewBox=${`0 0 ${r.width} ${r.height}`} aria-hidden="true"
          style=${`left:${r.x*a}px;top:${r.y*a}px;width:${r.width*a}px;height:${r.height*a}px`}>${l}</svg>
        ${i&&o.height>90?m`<span class="hme-face-title" style=${`left:${p}px;top:${p}px;font-size:${11*a}px;color:${It(t.look)}`}>${va(e.floor)}</span>`:v}
        ${i?m`<span class="hme-face-words" style=${`left:${p}px;bottom:${p}px;font-size:${10*a}px;color:${Bn(t.look,h>0)}`}>${mt(h)}</span>`:v}
      </div>
      <figcaption>${n}</figcaption>
    </figure>`}turnDrag(e,t,o){if(t.button!==0)return;let n=t.currentTarget,i=t.clientX;try{n.setPointerCapture?.(t.pointerId)}catch{}let a=r=>{let h=o+(r.clientX-i)*.5;h=((h+180)%360+360)%360-180,this.turnLive=Math.round(h),e.redraw()},s=()=>{n.removeEventListener("pointermove",a),n.removeEventListener("pointerup",s),n.removeEventListener("pointercancel",s);let r=this.turnLive;this.turnLive=void 0,r!==void 0&&r!==o?this.set(e,{turn:r}):e.redraw()};n.addEventListener("pointermove",a),n.addEventListener("pointerup",s),n.addEventListener("pointercancel",s)}overlay(){return v}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}inspector(e){let t=this.style(e),o=Ie.includes(t.look),n=(i,a,s)=>m`<button type="button" class="hme-chip sel ${a?"on":""}" aria-pressed=${a?"true":"false"} @click=${s}>${i}</button>`;return m`
      ${H("Home style",m`
        <p class="hme-text">Every Home map tile starts with this look. A tile can still pick its own in its Map card.</p>
        <div class="hme-r"><span class="hme-l">Turn</span>
          <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${K(String(t.turn))} ?disabled=${!o} aria-label="Turn the model"
            style=${$e(t.turn,-180,180)}
            @input=${i=>{this.turnLive=Number(i.target.value),e.redraw()}}
            @change=${i=>{this.turnLive=void 0,this.set(e,{turn:Number(i.target.value)})}} />
          <span class="hme-val mono hme-w48">${o?`${t.turn}\xB0`:"flat"}</span></div>
        <div class="hme-r"><span class="hme-l">Room names</span>${n(t.names?"Shown":"Hidden",t.names,()=>this.set(e,{names:!t.names}))}</div>
        <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
          ${n("Lights",t.devices==="lights",()=>this.set(e,{devices:"lights"}))}
          ${n("All",t.devices==="all",()=>this.set(e,{devices:"all"}))}
          ${n("None",t.devices==="none",()=>this.set(e,{devices:"none"}))}</div></div>
        <div class="hme-r"><span class="hme-l">Furniture</span>${n(t.furniture?"Shown":"Hidden",t.furniture,()=>this.set(e,{furniture:!t.furniture}))}</div>
        <div class="hme-r"><span class="hme-l">Light glow</span>${n(t.glow?"On":"Off",t.glow,()=>this.set(e,{glow:!t.glow}))}</div>`)}

      ${H("Floors",m`
        ${e.floor.rooms.length===0?m`<p class="hme-empty-line">No rooms on this floor yet.</p>`:v}
        ${e.floor.rooms.map(i=>{let a=bt(i);return m`<div class="hme-r top"><span class="hme-l">${I(i)}</span><div class="hme-chips">
            ${n(`Auto: ${at[a]}`,i.finish===void 0,()=>e.apply(s=>He(s,i.id,void 0)))}
            ${dt.map(s=>n(at[s],i.finish===s,()=>e.apply(r=>He(r,i.id,s))))}
          </div></div>`})}`,"shows in Plan, Night and Warm")}

      ${this.usesCard(e)}`}loadUses(e){let t=e.hass;this.usesState!=="idle"||t===void 0||(this.usesState="loading",ct(t).then(o=>{this.summary=o,this.usesState="done",e.redraw()},()=>{this.usesState="error",e.redraw()}))}usesCard(e){if(this.loadUses(e),this.usesState!=="done")return H("Used on",m`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let t=Ci(this.summary,e.doc),o=t.filter(n=>n.own);return H(`Used on ${C(t.length,"tile")}`,m`
      ${t.length===0?m`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:v}
      ${t.map(n=>this.useRow(e,n))}
      ${o.length===0?v:m`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(e,o)}}>${this.busy?"Saving\u2026":`Use the home style on all ${o.length}`}</button>`}
      ${this.message===void 0?v:m`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(e,t){return m`<div class="hme-use">
      <i style=${`background:${ie(t.look,.2)}`}></i>
      <div><span>${t.pageName} · ${t.what} ${t.size}</span><small>${t.words}</small></div>
      ${e.openPage===void 0?v:m`<button type="button" class="hme-tb" @click=${()=>e.openPage?.(t.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(e,t){let o=e.hass;if(o===void 0||this.busy)return;let n=[...new Set(t.map(s=>s.pageId))];if(!await e.confirm({title:`Use the home style on ${C(t.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${n.length===1?"The page is":`The ${n.length} pages are`} saved for every watch and iPhone that shows ${n.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,e.redraw();let a=0;for(let s of n)try{let r=await Yo(o,"pages",s),l=Ri(r.document);l!==void 0&&await Zo(o,"pages",s,r.revision,l)}catch{a+=1}this.busy=!1,this.message=a===0?"Done: those tiles follow the home style now.":`${C(a,"page")} could not be saved. Try again, or open ${a===1?"it":"them"} to see why.`,this.usesState="idle",e.redraw()}};function va(d){return d.name.trim()===""?"Home map":d.name.trim()}var ba="Update the Wrist Assistant integration to see the home map here.",ya="No home map yet. Scan your rooms with the Wrist Assistant app on an iPhone or iPad with LiDAR (the Pro models). The map shows here once it is saved.",wa=4,Ma=140;function $a(d){return d.kind==="saving"?"Saving\u2026":d.kind==="error"?"Not saved":"Saved"}var ka={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},T=class extends Lo{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.onHome=void 0;this.onOpenPage=void 0;this.unsupported=!1;this.loading=!1;this.mode="arrange";this.viewKind="flat";this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,square:!0,grid:!1,measure:!1,live:!0,scan:!1};this.measure={};this.floorMenu=!1;this.spaceHeld=!1;this.tick=0;this.modes={arrange:new At,shape:new Wt,devices:new jt,style:new Xt};this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=v;this.onKey=t=>{if(this.dialog!==void 0||this.session===void 0)return;let o=(typeof t.composedPath=="function"?t.composedPath()[0]:void 0)??t.target;if(vo(o))return;let n=ae(t,!1);if(n==="undo"||n==="redo"){t.preventDefault?.(),n==="undo"?this.undo():this.redo();return}if(ti(o))return;if(t.key===" "&&!t.repeat){this.spaceHeld=!0,t.preventDefault?.();return}let i=this.context();if(i!==void 0&&this.viewKind!=="model"&&this.modes[this.mode].keyDown?.(i,t)===!0){t.preventDefault?.();return}switch(n){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.selection=void 0;return;case"zoomIn":this.zoomBy(Qe);return;case"zoomOut":this.zoomBy(1/Qe);return;case"fit":this.fit();return}};this.onKeyUp=t=>{t.key===" "&&(this.spaceHeld=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++}willUpdate(t){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load(),this.loadPages());let o=this.baseFloor();this.needFit&&o!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let t=this.renderRoot.querySelector?.(".hme-dialog");t instanceof Element&&t!==this.focusedDialog?(this.focusedDialog=t,(t.querySelector("input")??t.querySelector(".primary"))?.focus?.(),t.querySelector("input")?.select?.()):t===null&&(this.focusedDialog=void 0);let o=this.renderRoot.querySelector?.(".hme-stage");o instanceof Element&&o!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(n=>{let i=n[n.length-1]?.contentRect;i!==void 0&&this.resizeStage(i.width,i.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(o),this.observed=o),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},Ma))}async load(t=!1){let o=this.hass;if(!o||!this.capable)return;let n=++this.loadSeq;t||(this.loading=this.session===void 0,this.loadError=void 0);try{let i=await st(o);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:lt(i?.doc)??null,rev:typeof i?.rev=="number"?i.rev:0}),this.loadScans()}catch(i){if(n!==this.loadSeq)return;let{code:a,message:s}=Me(i);a==="unknown_command"?this.unsupported=!0:(!t||this.session===void 0)&&(this.loadError=s)}this.loading=!1}async loadScans(){let t=this.hass;if(t)try{this.scans=await qo(t)}catch{}}async loadPages(){let t=this.hass;if(t)try{let o=tn(await ct(t));this.pages=on(o,"pages").map(n=>({id:n.id,name:n.name}))}catch{this.pages=[]}}show(t){let o=this.hass;if(o&&Vt(o,t),this.session===void 0)this.session=new Ot(li(this.hassOrThrow()),t,()=>this.afterChange(),n=>{this.hass&&Vt(this.hass,n)}),this.needFit=!0;else if(!this.session.load(t))return;this.afterChange()}hassOrThrow(){let t=this.hass;if(t===void 0)throw new Error("no hass");return t}afterChange(){let t=this.session?.doc?.floors??[];t.some(o=>x(o.id,this.floorId))||(this.floorId=t[0]?.id,this.needFit=!0),qn(this.baseFloor(),this.selection)||(this.selection=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let t=this.doc?.floors??[];return t.find(o=>x(o.id,this.floorId))??t[0]}shownFloor(){let t=this.baseFloor();return t===void 0||this.previewDoc===void 0?t:this.previewDoc.floors.find(o=>x(o.id,t.id))??t}apply(t,o={}){let n=this.session;return n===void 0?!1:(this.previewDoc=void 0,n.apply(t)?(o.floorId!==void 0&&(this.floorId=o.floorId),o.select!==void 0&&(this.selection=o.select??void 0),this.afterChange(),!0):(this.tick++,!1))}preview(t){let o=this.doc;this.previewDoc=t===void 0||o===null?void 0:t(o)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(t){this.selection=t}setMode(t,o){let n=this.context();n!==void 0&&t!==this.mode&&this.modes[this.mode].leave?.(n),this.mode=t,o!==void 0&&(this.selection=o)}setFloor(t){let o=this.context();o!==void 0&&this.modes[this.mode].leave?.(o),this.floorId=t,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(t,o){this.toggles={...this.toggles,[t]:o},t==="measure"&&(this.measure={}),t==="scan"&&o&&this.loadScans()}confirm(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"confirm",...t,done:n=>{this.dialog=void 0,o(n)}}})}ask(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"ask",...t,done:n=>{this.dialog=void 0,o(n)}}})}resizeStage(t,o){let n=this.stageSize.width===0;this.stageSize={width:t,height:o},(n||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:t,height:o}=this.stageSize;t<=0||(this.view=fo(this.baseFloor(),t,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}zoomBy(t,o){this.view!==void 0&&(this.view=go(this.view,t,o??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let t=this.doc,o=this.shownFloor();if(t===null||o===void 0)return;let n=this.view??{scale:40,ox:0,oy:0},i=this.session;return{hass:this.hass,icons:this.icons,doc:t,floor:o,selection:this.selection,mode:this.mode,view:n,stage:this.stageSize,toggles:this.toggles,pages:this.pages??[],areas:Xo(this.hass),scans:this.scans,canUndo:i?.canUndo??!1,canRedo:i?.canRedo??!1,toScreen:a=>Zn(n,a),px:a=>a*n.scale,toPlan:(a,s)=>this.toPlan(a,s),apply:(a,s)=>this.apply(a,s),preview:a=>this.preview(a),select:a=>this.select(a),setMode:(a,s)=>this.setMode(a,s),setFloor:a=>this.setFloor(a),setToggle:(a,s)=>this.setToggle(a,s),drag:(a,s)=>this.drag(a,s),undo:()=>this.undo(),redo:()=>this.redo(),confirm:a=>this.confirm(a),ask:a=>this.ask(a),newId:()=>Zt(),note:(a,s)=>{this.session!==void 0&&(this.session.note={kind:a,text:s}),this.tick++},redraw:()=>{this.tick++},openPage:this.onOpenPage}}toPlan(t,o){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return Ct(this.view??{scale:40,ox:0,oy:0},[t-n.left,o-n.top])}stagePoint(t){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[t.clientX-o.left,t.clientY-o.top]}drag(t,o){let n=this.stageEl;if(n===void 0)return;this.endDrag?.();let i=t.clientX,a=t.clientY,s=!1,r,l=0,h=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,p=()=>{l=0,r!==void 0&&o.move(this.toPlan(r.clientX,r.clientY),r)};try{n.setPointerCapture?.(t.pointerId)}catch{}let u=y=>{let b=y;b.pointerId===t.pointerId&&(!s&&Math.hypot(b.clientX-i,b.clientY-a)<wa||(s=!0,r=b,h===void 0?p():l===0&&(l=h(p))))},g=y=>{let b=y;b.pointerId===t.pointerId&&(c(),l!==0&&(cancelAnimationFrame(l),p()),o.end(this.toPlan(b.clientX,b.clientY),b,s))},c=()=>{n.removeEventListener("pointermove",u),n.removeEventListener("pointerup",g),n.removeEventListener("pointercancel",g);try{n.releasePointerCapture?.(t.pointerId)}catch{}this.endDrag===f&&(this.endDrag=void 0)},f=()=>{c(),l!==0&&(cancelAnimationFrame(l),l=0),o.cancel?.()};n.addEventListener("pointermove",u),n.addEventListener("pointerup",g),n.addEventListener("pointercancel",g),this.endDrag=f}onStageDown(t){if(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dialog!==void 0)return;if(t.pointerType==="touch"&&(this.touches.set(t.pointerId,[t.clientX,t.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(t);return}if(t.button===1||this.spaceHeld){t.preventDefault?.(),this.pan(t,!1);return}if(t.button!==0)return;let o=this.context();if(o===void 0)return;if(this.toggles.measure){let i=this.toPlan(t.clientX,t.clientY),a=this.measure;this.measure=a.a===void 0||a.b!==void 0?{a:i}:{a:a.a,b:i};return}let n=this.toPlan(t.clientX,t.clientY);if(this.modes[this.mode].pointerDown?.(o,t,n)===!0){t.preventDefault?.();return}this.pan(t,!0)}onStageMove(t){if(this.stageEl=t.currentTarget,this.touches.has(t.pointerId)&&this.touches.set(t.pointerId,[t.clientX,t.clientY]),t.buttons!==0||this.viewKind==="model")return;let o=this.toPlan(t.clientX,t.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:o});let n=this.context();n!==void 0&&this.modes[this.mode].hover?.(n,o)}onStageLeave(){let t=this.context();t!==void 0&&this.modes[this.mode].hover?.(t,void 0)}onStageUp(t){this.touches.delete(t.pointerId)}onStageDrag(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||this.dialog!==void 0||this.modes[this.mode].dragOver?.(o,this.toPlan(t.clientX,t.clientY),t)===!0&&(t.preventDefault?.(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))}onStageDragLeave(t){let o=t.relatedTarget,n=t.currentTarget;if(o!==null&&n!==null&&typeof n.contains=="function"&&n.contains(o))return;let i=this.context();i!==void 0&&this.modes[this.mode].dragOver?.(i,void 0,t)}onStageDrop(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||(t.preventDefault?.(),this.modes[this.mode].drop?.(o,this.toPlan(t.clientX,t.clientY),t))}pan(t,o){let n=this.view;if(n===void 0)return;let i=t.clientX,a=t.clientY;this.drag(t,{move:(s,r)=>{this.view={...n,ox:n.ox+r.clientX-i,oy:n.oy+r.clientY-a},this.userMoved=!0},end:(s,r,l)=>{!l&&o&&(this.selection=void 0)}})}pinch(){let t=this.stageEl,o=this.view,n=[...this.touches.keys()];if(t===void 0||o===void 0||n.length<2)return;let i=()=>n.map(g=>this.touches.get(g)),[a,s]=i(),r=Math.max(Math.hypot(s[0]-a[0],s[1]-a[1]),1),l=t.getBoundingClientRect(),h=[(a[0]+s[0])/2-l.left,(a[1]+s[1])/2-l.top],p=g=>{let c=g;if(!this.touches.has(c.pointerId))return;this.touches.set(c.pointerId,[c.clientX,c.clientY]);let[f,y]=i(),b=Math.max(Math.hypot(y[0]-f[0],y[1]-f[1]),1),w=[(f[0]+y[0])/2-l.left,(f[1]+y[1])/2-l.top],P=go(o,b/r,h);this.view={...P,ox:P.ox+w[0]-h[0],oy:P.oy+w[1]-h[1]},this.userMoved=!0},u=g=>{this.touches.delete(g.pointerId),t.removeEventListener("pointermove",p),t.removeEventListener("pointerup",u),t.removeEventListener("pointercancel",u)};t.addEventListener("pointermove",p),t.addEventListener("pointerup",u),t.addEventListener("pointercancel",u)}turnModel(t){let o=this.modelTurnNow(),n=t.clientX;this.drag(t,{move:(i,a)=>{let s=o+(a.clientX-n)*.5;s=((s+180)%360+360)%360-180,this.modelTurn=Math.round(s)},end:()=>{}})}modelTurnNow(){return this.modelTurn??Ve(this.doc).turn??Wn}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let t=Ve(this.doc).look;return Ie.includes(t)?t:"night"}onWheel(t){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=t.currentTarget,t.preventDefault?.();let o=t.deltaMode===1?16:t.deltaMode===2?400:1;if(t.ctrlKey||t.metaKey){this.zoomBy(Math.exp(-t.deltaY*o*.0025),this.stagePoint(t));return}this.view={...this.view,ox:this.view.ox-t.deltaX*o,oy:this.view.oy-t.deltaY*o},this.userMoved=!0}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(m`<b>${ba}</b>`);if(this.loadError!==void 0)return this.calm(m`<span>Could not read the home map: ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(m`Loading…`);let t=this.doc;if(t===null||t.floors.length===0)return this.calm(m`<b>${ya}</b>`);let o=this.context(),n=this.modes[this.mode],i=this.session.note;return m`<div class="hme">
      ${this.renderBar(t,o)}
      ${i===void 0?v:m`<div class="hme-note ${i.kind}" role="status"><span>${i.text}</span>
        <button class="hme-link" @click=${()=>this.session?.dismissNote()}>Dismiss</button></div>`}
      <div class="hme-body">
        <aside class="hme-rail" aria-label="${uo[this.mode]} tools">${n.rail(o)}</aside>
        <section class="hme-stage-wrap">${n.stage?.(o)??this.renderStage(o,n)}</section>
        <aside class="hme-insp" aria-label="Inspector">${n.inspector(o)}</aside>
      </div>
      ${this.renderDialog()}
    </div>`}calm(t){return m`<div class="hme-calm"><div class="hme-empty">${t}</div></div>`}renderBar(t,o){let n=this.baseFloor(),i=this.session?.state??{kind:"saved"},a=bo();return m`<header class="hme-bar">
      ${this.onHome===void 0?v:m`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Home</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">BETA</span>
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${Ho(n)}
          <span class="hme-floor-t"><span>${z(n)}</span><small>${C(n.rooms.length,"room")} · ${C(n.pins.length,"device")}</small></span>
          <span class="hme-caret" aria-hidden="true">▾</span>
        </button>
        ${this.floorMenu?this.renderFloorMenu(t,n):v}
      </div>
      <span class="hme-flex"></span>
      <div class="hme-seg" role="tablist" aria-label="Edit mode">
        ${Xn.map(s=>m`<button type="button" role="tab" class=${s===this.mode?"on":""} aria-selected=${s===this.mode?"true":"false"}
          @click=${()=>this.setMode(s)}>${uo[s]}</button>`)}
      </div>
      <span class="hme-flex"></span>
      ${this.modes[this.mode].stage!==void 0?v:m`<div class="hme-seg" role="group" aria-label="View">
        <button type="button" class=${this.viewKind==="flat"?"on":""} aria-pressed=${this.viewKind==="flat"?"true":"false"} @click=${()=>{this.viewKind="flat"}}>Flat</button>
        <button type="button" class=${this.viewKind==="model"?"on":""} aria-pressed=${this.viewKind==="model"?"true":"false"} @click=${()=>{this.viewKind="model"}}>Model</button>
        <button type="button" class=${this.viewKind==="both"?"on":""} aria-pressed=${this.viewKind==="both"?"true":"false"}
          title="The plan to edit on the left, the model following it on the right" @click=${()=>{this.viewKind="both"}}>Both</button>
      </div>`}
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${a?"\u2318Z":"Ctrl+Z"})`} ?disabled=${!o.canUndo} @click=${()=>this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${a?"\u21E7\u2318Z":"Ctrl+Shift+Z"})`} ?disabled=${!o.canRedo} @click=${()=>this.redo()}>↷</button>
      <span class="hme-status ${i.kind}" role="status" title=${i.kind==="error"?i.text:v}><span class="hme-status-dot"></span>${$a(i)}</span>
    </header>`}renderFloorMenu(t,o){return m`<div class="hme-pop" role="menu" aria-label="Floors">
      ${t.floors.map(n=>m`<div class="hme-pop-row ${x(n.id,o.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(n.id)}>
          ${Ho(n)}<span class="hme-floor-t"><span>${z(n)}</span><small>${C(n.rooms.length,"room")} · ${C(n.pins.length,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${z(n)}`} @click=${()=>{this.renameFloorAsk(n)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${t.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${z(n)}`}
          ?disabled=${t.floors.length===1} @click=${()=>{this.deleteFloorAsk(n)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let t=this.doc;if(t===null)return;let o=Math.max(...t.floors.map(a=>a.story))+1,n=await this.ask({title:"Add a floor",label:"Name",value:o===1?"Upstairs":`Floor ${o+1}`,ok:"Add floor"});if(n===void 0)return;let i=Zt();this.apply(a=>cn(a,{id:i,name:n,story:o}),{floorId:i,select:null})&&(this.needFit=!0)}async renameFloorAsk(t){this.floorMenu=!1;let o=await this.ask({title:"Rename floor",label:"Name",value:t.name||z(t),ok:"Rename"});o!==void 0&&this.apply(n=>wt(n,t.id,o))}async deleteFloorAsk(t){this.floorMenu=!1,await this.confirm({title:`Delete ${z(t)}?`,text:`Its ${C(t.rooms.length,"room")} and ${C(t.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(n=>un(n,t.id),{select:null})}renderStage(t,o){let{width:n,height:i}=this.stageSize,a=this.viewKind==="model",s=this.viewKind==="both",r=a?v:o.pill?.(t)??v,l=this.spaceHeld?"grab":a?"ew-resize":this.toggles.measure?"crosshair":o.cursor?.(t)??"default",h=t.floor.rooms.length===0,p=s?m`<div class="hme-stage model hme-split-r" style=${`background:${ie(this.modelLookNow())}`}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style="cursor:ew-resize"
        role="img" aria-label=${`Model of ${z(t.floor)}`}
        @pointerdown=${u=>this.onModelDown(u)}>
        ${this.renderModel(t,n,i)}
      </svg>
      ${this.renderModelDock(!1)}
    </div>`:v;return m`<div class="hme-stage ${a?"model":""} ${s?"hme-split-l":""}" style=${a?`background:${ie(this.modelLookNow())}`:""}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style=${`cursor:${l}`}
        role="img" aria-label=${`Plan of ${z(t.floor)}`}
        @pointerdown=${u=>this.onStageDown(u)}
        @pointermove=${u=>this.onStageMove(u)}
        @pointerup=${u=>this.onStageUp(u)}
        @pointercancel=${u=>this.onStageUp(u)}
        @pointerleave=${()=>this.onStageLeave()}
        @wheel=${u=>this.onWheel(u)}
        @dragover=${u=>this.onStageDrag(u)}
        @dragleave=${u=>this.onStageDragLeave(u)}
        @drop=${u=>this.onStageDrop(u)}>
        ${a?this.renderModel(t,n,i):this.renderPlan(t,o,n,i)}
      </svg>
      ${r===v?v:m`<div class="hme-pill">${r}</div>`}
      ${a?v:o.stageExtra?.(t)??v}
      ${h&&!a?m`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{this.setMode("arrange");let u=this.context();u&&this.modes.arrange.draw.start(u)}}>＋ Draw a room by hand</button></div>`:v}
      ${this.renderDock(t,o)}
    </div>${p}`}onModelDown(t){this.dialog!==void 0||t.button!==0||(this.stageEl=t.currentTarget,this.floorMenu=!1,this.turnModel(t))}renderPlan(t,o,n,i){let a=this.view;if(a===void 0||n<=0)return v;let s=this.planArt(t.floor,n,i,o.drawsPins===!0?"none":"all"),r=a.scale/(this.artScale||a.scale);return $`${this.background(a,n,i)}
      <g class="hme-art" transform=${`translate(${a.ox.toFixed(2)} ${a.oy.toFixed(2)}) scale(${r.toFixed(5)})`} pointer-events="none">${s}</g>
      <g class="hme-labels" pointer-events="none">${this.labels(t)}</g>
      <g class="hme-overlay">${o.overlay(t)}</g>
      ${this.toggles.measure?this.measureMarks(t):v}`}planArt(t,o,n,i){let a=this.toggles.live?this.hass?.states:void 0,s=this.artScale||this.view.scale,r=`${Ha(t)}|${_o(a)}|${s}|${o}|${n}|${this.iconsTick}|${_o(this.icons)}|${i}`;return r!==this.artKey&&(this.artKey=r,this.artHeld=fe({floor:t,states:a,look:"plan",names:!1,devices:i,furniture:!0,glow:!0,width:o,height:n,icons:this.icons,frame:{scale:s,ox:0,oy:0}})),this.artHeld}background(t,o,n){let i=this.mode==="shape"?.05:.1,a=20;if(this.toggles.grid)for(a=i*t.scale;a<8;)a*=10;let s=(t.ox%a+a)%a,r=(t.oy%a+a)%a;return $`<defs><pattern id="hme-bg" width=${a} height=${a} patternUnits="userSpaceOnUse" patternTransform=${`translate(${s.toFixed(1)} ${r.toFixed(1)})`}>
        ${this.toggles.grid?$`<path d=${`M${a} 0V${a}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:$`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${o} height=${n} fill="url(#hme-bg)" />`}labels(t){return t.floor.rooms.map(o=>{let n=q(o),i=pe(o.outline);if(n===void 0||i===void 0)return v;let a=I(o),s=tt(o),r=(i.maxX-i.minX)*t.view.scale,l=(i.maxY-i.minY)*t.view.scale,h=a.length*7.4+22;if(h>r*.95||l<26)return v;let p=Math.max(h,s.length*5.8+22)<=r*.95&&l>=48,u=p?Math.max(h,s.length*5.8+22):h,g=p?36:22,[c,f]=t.toScreen(n);return $`<g class="hme-label"><rect x=${(c-u/2).toFixed(1)} y=${(f-g/2).toFixed(1)} width=${u.toFixed(1)} height=${g} rx=${p?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${c.toFixed(1)} y=${(f+(p?-3:4.5)).toFixed(1)} fill="#fff" font-size=${p?13:12} font-weight="600" text-anchor="middle">${a}</text>
        ${p?$`<text x=${c.toFixed(1)} y=${(f+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${s}</text>`:v}</g>`})}measureMarks(t){let o=this.measure;if(o.a===void 0)return $`<g class="hme-measure"></g>`;let n=o.b??o.hover,i=t.toScreen(o.a);if(n===void 0)return $`<g class="hme-measure" pointer-events="none"><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /></g>`;let a=t.toScreen(n),s=Math.hypot(n[0]-o.a[0],n[1]-o.a[1]),r=[(i[0]+a[0])/2,(i[1]+a[1])/2];return $`<g class="hme-measure" pointer-events="none">
      <line x1=${i[0]} y1=${i[1]} x2=${a[0]} y2=${a[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${o.b===void 0?"6 4":"none"} />
      <circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /><circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(r[0]-32).toFixed(1)} y=${(r[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${r[0].toFixed(1)} y=${(r[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${s.toFixed(2)} m</text></g></g>`}renderModel(t,o,n){if(o<=0)return v;let i=this.selection,a=i===void 0||i.kind==="pin"||i.kind==="pins"?void 0:t.floor.rooms.find(l=>x(l.id,i.roomId)),s=i?.kind==="object"?a?.objects[i.object]:void 0,r=s!==void 0?{box:s}:a!==void 0?{outline:a.outline}:void 0;return fe({mark:r,floor:t.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:o,height:n})}renderModelDock(t,o){let n=this.modelLookNow();return m`<div class="hme-dock">
      ${Ie.map(i=>m`<button type="button" class="hme-tb ${i===n?"on":""}" aria-pressed=${i===n?"true":"false"} @click=${()=>{this.modelLook=i}}>${ka[i]}</button>`)}
      <span class="hme-vsep"></span>
      <button type="button" class="hme-tb" title="Back to the home style's turn" @click=${()=>{this.modelTurn=void 0}}>⟲ Turn back</button>
      ${t&&o!==void 0?m`<span class="hme-vsep"></span>${o}`:v}
    </div>`}renderDock(t,o){let n=m`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
      title="Draw what Home Assistant's devices are doing now" @click=${()=>this.setToggle("live",!this.toggles.live)}><span class="hme-live-dot"></span>Live states</button>`;if(this.viewKind==="model")return this.renderModelDock(!0,n);let i=this.stageSize.width>0?fo(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,a=this.view===void 0||i===void 0?100:Jn(this.view,i);return m`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" @click=${()=>this.zoomBy(1/Qe)}>−</button>
      <span class="hme-zoom mono">${a}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" @click=${()=>this.zoomBy(Qe)}>＋</button>
      <button type="button" class="hme-tb" @click=${()=>this.fit()}>Fit</button>
      <span class="hme-vsep"></span>
      ${o.dock?.(t)??v}
      <button type="button" class="hme-tb ${this.toggles.measure?"on":""}" aria-pressed=${this.toggles.measure?"true":"false"}
        title="Click two points to measure between them" @click=${()=>this.setToggle("measure",!this.toggles.measure)}>Measure</button>
      <span class="hme-vsep"></span>${n}
    </div>`}renderDialog(){let t=this.dialog;if(t===void 0)return v;let o=()=>t.kind==="confirm"?t.done(!1):t.done(void 0),n=i=>{t.kind==="confirm"?t.done(!0):t.done((i?.querySelector("input")?.value??t.value).trim()||t.value)};return m`<div class="hme-scrim" @pointerdown=${i=>{i.target===i.currentTarget&&o()}}>
      <div class="hme-dialog" role="dialog" aria-modal="true" aria-label=${t.title}
        @keydown=${i=>{i.key==="Escape"&&(i.stopPropagation(),o()),i.key==="Enter"&&(i.preventDefault(),n(i.currentTarget))}}>
        <h3>${t.title}</h3>
        ${t.kind==="confirm"?t.text===void 0?v:m`<p>${t.text}</p>`:m`<label class="hme-dialog-field"><span>${t.label}</span><input type="text" maxlength="100" .value=${t.value} autofocus /></label>`}
        <div class="hme-dialog-row">
          <button type="button" class="hme-tb" @click=${o}>Cancel</button>
          <button type="button" class="hme-tb primary ${t.kind==="confirm"&&t.danger===!0?"danger-fill":""}"
            @click=${i=>n(i.currentTarget.closest(".hme-dialog"))}>${t.ok}</button>
        </div>
      </div>
    </div>`}static{this.styles=[Vo,zo,ci]}};S([ee({attribute:!1})],T.prototype,"hass",2),S([ee({type:Boolean,reflect:!0})],T.prototype,"narrow",2),S([ee({attribute:!1})],T.prototype,"icons",2),S([ee({attribute:!1})],T.prototype,"iconsTick",2),S([ee({attribute:!1})],T.prototype,"capable",2),S([ee({attribute:!1})],T.prototype,"onHome",2),S([ee({attribute:!1})],T.prototype,"onOpenPage",2),S([L()],T.prototype,"unsupported",2),S([L()],T.prototype,"loading",2),S([L()],T.prototype,"loadError",2),S([L()],T.prototype,"floorId",2),S([L()],T.prototype,"selection",2),S([L()],T.prototype,"mode",2),S([L()],T.prototype,"viewKind",2),S([L()],T.prototype,"view",2),S([L()],T.prototype,"artScale",2),S([L()],T.prototype,"stageSize",2),S([L()],T.prototype,"toggles",2),S([L()],T.prototype,"scans",2),S([L()],T.prototype,"measure",2),S([L()],T.prototype,"floorMenu",2),S([L()],T.prototype,"dialog",2),S([L()],T.prototype,"modelLook",2),S([L()],T.prototype,"modelTurn",2),S([L()],T.prototype,"pages",2),S([L()],T.prototype,"spaceHeld",2),S([L()],T.prototype,"tick",2);var Di=new WeakMap,xa=1;function _o(d){if(d===void 0)return 0;let e=Di.get(d);return e===void 0&&Di.set(d,e=xa++),e}var Ha=d=>_o(d);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",T);export{wa as HOME_MAP_DRAG_SLOP,ya as HOME_MAP_EMPTY_TEXT,ba as HOME_MAP_UPDATE_TEXT,T as WaHomeMapEditor,$a as homeMapSaveWords};
