import{$ as pn,A as Xo,Aa as kn,B as qo,Ba as xn,C as rt,Ca as ut,D as Yo,Da as le,E as Kt,Ea as ze,F as Zo,Fa as Ne,G as Jo,Ga as Ke,H as Qo,Ha as Hn,I as en,Ia as He,J as Me,Ja as Pn,K as _e,Ka as de,L as tn,La as ft,M as on,Ma as En,N as nn,Na as Sn,O as Gt,Oa as pe,P as an,Q as rn,R as st,S as ke,T as sn,U as ln,V as Wt,W as Z,X as lt,Y as dt,Z as dn,_ as jt,a as ie,aa as pt,b as Lt,ba as Bt,c as Ft,ca as Ae,d as ae,da as ht,e as zt,ea as hn,f as B,fa as mn,g as V,ga as cn,h as No,ha as un,i as it,ia as fn,j as at,ja as gn,k as Nt,ka as Vt,l as Ko,la as J,m as Go,ma as xe,n as re,na as vn,o as we,oa as bn,p as G,pa as Ut,q as $e,qa as Le,r as se,ra as mt,s as Wo,sa as Xt,t as jo,ta as yn,u as Bo,ua as wn,v as Vo,va as $n,w as Re,wa as Mn,x as De,xa as Fe,y as Uo,ya as qt,z as Oe,za as ct}from"./chunk-LNM2QLLK.js";import{c as et,j as Do,k as Oo,na as Fo,oa as zo}from"./chunk-5H6OWAXC.js";import"./chunk-7T6IEW6M.js";import"./chunk-J2WKPEGJ.js";import{b as At}from"./chunk-S3NOJWAC.js";import{$ as Co,B as Ce,C as Ye,D as Po,E as x,H as L,I as D,J as Ze,K as oe,L as ne,N as Eo,P as Y,Q as So,R as Je,S as Qe,Y as To,Z as Io,_ as z,fa as Ot,ga as F,k as ko,m as qe,n as xo,q as Ie,r as Ho}from"./chunk-RKO7QDNI.js";import{i as tt,l as _o,m as Ao,n as ot,r as nt,s as _t,t as Lo}from"./chunk-CPEKF3CW.js";import{$g as Xe,Fh as ye,Nh as Ro,ah as $o,b as yo,d as c,e as y,g,hg as Dt,j as wo,k as q,l as O,wh as Mo}from"./chunk-7M7K7CM3.js";import{db as be}from"./chunk-OM34V22N.js";import{a as T}from"./chunk-LO2NM3CE.js";var Tn=["arrange","shape","devices","style"],Yt={arrange:"Arrange",shape:"Shape",devices:"Devices",style:"Style"};function Pe(s){return s===void 0||s.kind==="pin"||s.kind==="pins"?void 0:s.roomId}function In(s,t){if(t===void 0)return!0;if(s===void 0)return!1;if(t.kind==="pin")return s.pins.some(o=>x(o.id,t.pinId));if(t.kind==="pins")return t.pinIds.every(o=>s.pins.some(n=>x(n.id,o)));let e=s.rooms.find(o=>x(o.id,t.roomId));if(e===void 0)return!1;switch(t.kind){case"room":return!0;case"wall":return G(e)[t.wall]!==void 0;case"corner":return e.outline[t.corner]!==void 0;case"opening":return e.openings[t.opening]!==void 0;case"object":return e.objects[t.object]!==void 0}}var Cn=4,Rn=2400;function Dn(s,t){return[s.ox+t[0]*s.scale,s.oy+t[1]*s.scale]}function gt(s,t){return[(t[0]-s.ox)/s.scale,(t[1]-s.oy)/s.scale]}function Zt(s,t,e,o=56,n=96){let a=s===void 0||s.rooms.length===0&&s.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:Ze(s),r=Math.max(a.maxX-a.minX,1),l=Math.max(a.maxY-a.minY,1),d=zn(Math.min(Math.max(t-o*2,40)/r,Math.max(e-n*2,40)/l),Cn,Rn);return{scale:d,ox:t/2-(a.minX+a.maxX)/2*d,oy:e/2-(a.minY+a.maxY)/2*d}}function Jt(s,t,e){let o=zn(s.scale*t,Cn,Rn),n=o/s.scale;return{scale:o,ox:e[0]-(e[0]-s.ox)*n,oy:e[1]-(e[1]-s.oy)*n}}function On(s,t){return Math.round(s.scale/t.scale*100)}var Ge=1.25;function _n(s){if(typeof s!="object"||s===null)return;let t=s;return{tag:typeof t.tagName=="string"?t.tagName.toUpperCase():"",type:typeof t.type=="string"?t.type.toLowerCase():"text",editable:t.isContentEditable===!0}}var An=["button","submit","reset","image"],vi=["checkbox","radio","range","color","file"];function Qt(s){let t=_n(s);return t===void 0?!1:t.editable||t.tag==="TEXTAREA"?!0:t.tag==="INPUT"&&!An.includes(t.type)&&!vi.includes(t.type)}function Ln(s){let t=_n(s);return t===void 0?!1:Qt(s)||t.tag==="SELECT"?!0:t.tag==="INPUT"&&!An.includes(t.type)}function Q(s,t){if(t)return;let e=s.metaKey===!0||s.ctrlKey===!0,o=s.key.length===1?s.key.toLowerCase():s.key;if(e)return o==="z"?s.shiftKey===!0?"redo":"undo":o==="y"?"redo":void 0;if(s.altKey===!0)return;switch(o){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit"}let n=s.shiftKey===!0?.1:.01;if(o==="ArrowLeft")return{nudge:[-n,0]};if(o==="ArrowRight")return{nudge:[n,0]};if(o==="ArrowUp")return{nudge:[0,-n]};if(o==="ArrowDown")return{nudge:[0,n]};if(/^[a-z]$/.test(o)&&s.shiftKey!==!0)return{letter:o}}function eo(){let s=globalThis.navigator,t=`${typeof s?.platform=="string"?s.platform:""} ${typeof s?.userAgent=="string"?s.userAgent:""}`;return/Mac|iPhone|iPad/.test(t)}function Fn(){return eo()?"\u2318Z":"Ctrl+Z"}var zn=(s,t,e)=>Math.min(Math.max(s,t),e);function to(s,t=2){return`${(Math.round(s*10**t)/10**t).toFixed(t)} m`}function oo(s,t=2){let e=(Math.round(s*10**t)/10**t).toFixed(t);return/^-0(\.0*)?$/.test(e)?e.slice(1):e}function Nn(s){let t=s.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(t===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t))return;let e=Number(t);if(Number.isFinite(e))return/cm$/i.test(s.trim())?e/100:e}function vt(s){if(s.outline.length<3)return{width:0,depth:0,area:0};let{a0:t,a1:e,c0:o,c1:n}=Nt(s,Ft(s));return{width:e-t,depth:n-o,area:Math.abs(Ko(s.outline))}}function We(s){let{width:t,depth:e}=vt(s);return`${t.toFixed(1)} \xD7 ${e.toFixed(1)} m`}function Kn(s){if(s.outline.length<3)return s.outline.slice();let{a0:t,a1:e,c0:o,c1:n,point:i}=Nt(s,Ft(s));return[i(t,o),i(e,o),i(e,n),i(t,n)]}function bi(s,t){let e=G(s)[t];if(e===void 0)return"inner";let o=Math.max(Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]),1e-9),n=-(e.b[1]-e.a[1])/o,i=(e.b[0]-e.a[0])/o,a=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],r=Math.max(e.t,.1)+.1,l=zt(s.outline,[a[0]+n*r,a[1]+i*r]),d=zt(s.outline,[a[0]-n*r,a[1]-i*r]);if(l&&d)return"inner";if(l)n=-n,i=-i;else if(!d){let h=B(s);h!==void 0&&(h[0]-a[0])*n+(h[1]-a[1])*i>0&&(n=-n,i=-i)}return Math.abs(n)>Math.abs(i)?n>0?"right":"left":i>0?"bottom":"top"}function no(s,t,e){let o=bi(s,t);return`${e}, ${o} wall`}function he(s){return s.kind==="opening"?"Way through":s.kind==="window"?s.style==="sliding"?"Sliding window":"Window":s.style==="double"?"Double door":s.style==="sliding"?"Sliding door":"Door"}var yi={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function me(s){let t=yi[s];if(t!==void 0)return t;let e=s.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return e.charAt(0).toUpperCase()+e.slice(1)}function C(s,t,e=`${t}s`){return`${s} ${s===1?t:e}`}function H(s,t,e,o=""){return c`<section class="hme-card ${o}">
    <div class="hme-h">${s}${e===void 0?g:c`<span class="hme-h-end">${e}</span>`}</div>
    ${t}
  </section>`}function S(s,...t){return c`<div class="hme-r"><span class="hme-l">${s}</span>${t}</div>`}function K(s){return c`<p class="hme-hint">${s}</p>`}function _(s){let t=s.digits??2,e=s.value===void 0?"":oo(s.value,t),o=n=>{let i=Nn(n.value);if(i===void 0||s.min!==void 0&&i<s.min||s.max!==void 0&&i>s.max||oo(i,t)===e){n.value=e;return}s.set(i)};return c`<span class="hme-in hme-num" style=${s.width===void 0?g:`flex:0 0 ${s.width}`}>
    <input type="text" inputmode="decimal" aria-label=${s.label} .value=${F(e)} ?disabled=${s.disabled===!0}
      placeholder=${s.value===void 0?"Mixed":""}
      @change=${n=>o(n.target)}
      @keydown=${n=>{n.key==="Enter"&&n.target.blur(),n.key==="Escape"&&(n.target.value=e,n.target.blur())}} />${s.unit===void 0?g:c`<span class="hme-unit">${s.unit}</span>`}</span>`}function je(s){return c`<span class="hme-in"><input type="text" aria-label=${s.label} maxlength=${s.max??100} placeholder=${s.placeholder??""}
    .value=${F(s.value)}
    @change=${t=>{let e=t.target.value;e.trim()!==s.value.trim()&&s.set(e)}}
    @keydown=${t=>{t.key==="Enter"&&t.target.blur()}} /></span>`}function ce(s){return c`<span class="hme-in hme-sel ${s.cls??""}"><select aria-label=${s.label} @change=${t=>s.set(t.target.value)}>
    ${s.options.map(t=>c`<option value=${t.value} ?disabled=${t.disabled===!0} .selected=${F(t.value===s.value)}>${t.label}</option>`)}
  </select></span>`}function io(s){return c`<span class="hme-menu ${s.cls??""}"><select aria-label=${s.label} @change=${t=>{let e=t.target,o=e.value;e.value="",o!==""&&s.pick(o)}}>
    <option value="" .selected=${F(!0)}>${s.label}</option>
    ${s.options.map(t=>c`<option value=${t.value} ?disabled=${t.disabled===!0}>${t.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function W(s){return c`<button type="button" class="hme-pic ${s.on?"on":""}" aria-pressed=${s.on?"true":"false"} title=${s.title??s.label}
    @click=${s.click}>${s.picture}<span>${s.label}</span></button>`}function Be(s){return c`<button type="button" class="hme-chip ${s.on?"":"off"}" aria-pressed=${s.on?"true":"false"} aria-label=${s.label}
    @click=${s.click}>${s.on?s.onText:s.offText}</button>`}var wi={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},ao={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function ro(s){return c`<span class="hme-sw" style=${`background:${wi[s]}`}></span>`}var Gn=s=>s.map(([t,e])=>`${Math.round(t*10)/10},${Math.round(e*10)/10}`).join(" ");function so(s,t=34,e=24){let o=s?.rooms??[];if(o.length===0)return c`<svg class="hme-thumb" width=${t} height=${e} viewBox=${`0 0 ${t} ${e}`} aria-hidden="true">
      <rect x="1" y="1" width=${t-2} height=${e-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let n=Ze(s),i=4,a=Math.min((t-i*2)/Math.max(n.maxX-n.minX,.5),(e-i*2)/Math.max(n.maxY-n.minY,.5)),r=t/2-(n.minX+n.maxX)/2*a,l=e/2-(n.minY+n.maxY)/2*a;return c`<svg class="hme-thumb" width=${t} height=${e} viewBox=${`0 0 ${t} ${e}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${t-1} height=${e-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${o.map(d=>y`<polygon points=${Gn(d.outline.map(([h,p])=>[r+h*a,l+p*a]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function Wn(s,t,e=76,o=54){let n=s.outline.map(v=>v[0]),i=s.outline.map(v=>v[1]),a=Math.min(...n),r=Math.max(...n),l=Math.min(...i),d=Math.max(...i),h=8,p=Math.min((e-h*2)/Math.max(r-a,.5),(o-h*2)/Math.max(d-l,.5)),m=e/2-(a+r)/2*p,u=o/2-(l+d)/2*p,f=Gn(s.outline.map(([v,$])=>[m+v*p,u+$*p]));return c`<svg class="hme-room-thumb" width=${e} height=${o} viewBox=${`0 0 ${e} ${o}`} aria-hidden="true">
    <rect width=${e} height=${o} rx="8" fill="#121010" />
    <polygon points=${f} fill=${ao[it(s)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${t?y`<circle cx=${e*.58} cy=${o*.42} r=${Math.min(e,o)*.22} fill="#ffb648" opacity="0.35" />`:g}
  </svg>`}function Bn(s){return{get:()=>Xe(s),save:(t,e)=>$o(s,t,e)}}var Vn="The map had changed on another device. Your change was saved on top of it.",$i="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",Mi="The map changed again while saving, so your change was not saved. Try it once more.";function ki(s){return{doc:Ye(s?.doc)??null,rev:typeof s?.rev=="number"?s.rev:0}}function jn(s,t){let e=typeof t=="function"?t(s):To(s,t);if(e===void 0)return;let o=Ce(e);return o.ok?{doc:o.doc}:{text:`Not saved. ${o.message}.`}}async function Un(s,t,e){if(t.doc===null)return{ok:!1,text:"There is no map to change yet."};let o=jn(t.doc,e);if(o===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in o)return{ok:!1,text:o.text};try{let a=await s.save(o.doc,t.rev);return{ok:!0,read:{doc:o.doc,rev:a.rev},merged:!1}}catch(a){let{code:r,message:l}=be(a);if(r!=="conflict")return{ok:!1,text:`Not saved. ${l}`}}let n;try{n=ki(await s.get())}catch(a){return{ok:!1,text:`Not saved. The map changed on another device and could not be read again: ${be(a).message}`}}let i=n.doc===null?void 0:jn(n.doc,e);if(i===void 0)return{ok:!1,text:$i,read:n};if("text"in i)return{ok:!1,text:i.text,read:n};try{let a=await s.save(i.doc,n.rev);return{ok:!0,read:{doc:i.doc,rev:a.rev},merged:!0}}catch(a){let{code:r,message:l}=be(a);return{ok:!1,text:r==="conflict"?Mi:`Not saved. ${l}`,read:n}}}function bt(s){return Array.isArray(s)?`[${s.map(bt).join(",")}]`:typeof s=="object"&&s!==null?`{${Object.entries(s).filter(([,e])=>e!==void 0).sort(([e],[o])=>e<o?-1:e>o?1:0).map(([e,o])=>`${JSON.stringify(e)}:${bt(o)}`).join(",")}}`:JSON.stringify(s)}function xi(s,t){return s===t?!0:s==null||t==null?!1:bt(s)===bt(t)}function Xn(s,t){return e=>xi(e,s)?t:void 0}var yt=class{constructor(t,e,o=()=>{},n=()=>{},i){this.api=t;this.changed=o;this.saved=n;this.state={kind:"saved"};this.queue=[];this.confirmed=e,this.doc=e.doc,this.history=new xn(i)}get busy(){return this.queue.length>0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(t){return this.busy?!1:(this.confirmed=t,this.doc=t.doc,this.history.clear(),this.changed(),!0)}apply(t){let e=this.doc;if(e===null)return!1;let o=t(e);if(o===void 0)return!1;let n=Ce(o);return n.ok?(this.history.push(e),this.doc=n.doc,this.enqueue(t),!0):(this.note={kind:"err",text:`That cannot be saved. ${n.message}.`},this.changed(),!1)}undo(){let t=this.doc;if(t===null)return!1;let e=this.history.undo(t);return e===void 0?!1:(this.doc=e,this.enqueue(Xn(t,e)),!0)}redo(){let t=this.doc;if(t===null)return!1;let e=this.history.redo(t);return e===void 0?!1:(this.doc=e,this.enqueue(Xn(t,e)),!0)}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}enqueue(t){this.queue.push(t),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0?this.kick():this.changed()}))}async run(){for(;this.queue.length>0;){let t=this.queue.splice(0),e=t.length===1?t[0]:n=>t.reduce((i,a)=>i===void 0?void 0:a(i),n);this.state={kind:"saving"},this.changed();let o=await Un(this.api,this.confirmed,e);if(o.ok){this.confirmed=o.read,this.saved(o.read),o.merged?(this.note={kind:"warn",text:Vn},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=o.read.doc);continue}this.queue=[],this.history.clear(),o.read!==void 0&&(this.confirmed=o.read,this.saved(o.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:o.text},this.state={kind:"error",text:o.text},this.changed();return}this.state={kind:"saved"}}rebased(){let t=this.confirmed.doc;if(t===null)return null;let e=[];for(let o of this.queue){let n=o(t);if(n===void 0)continue;let i=Ce(n);i.ok&&(t=i.doc,e.push(o))}return this.queue=e,t}};var qn=yo`
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
`;function lo(s,t,e,o={}){let n=(o.reach??10)/e,i,a=n;for(let d of[...s.rooms.flatMap(h=>h.outline),...o.corners??[]]){let h=Math.hypot(d[0]-t[0],d[1]-t[1]);h<=a&&(i=d,a=h)}if(i!==void 0)return[i[0],i[1]];let[r,l]=t;if(o.grid!==void 0&&o.grid>0&&(r=Math.round(r/o.grid)*o.grid,l=Math.round(l/o.grid)*o.grid),o.from!==void 0){let d=8/e;Math.abs(t[0]-o.from[0])<=d&&(r=o.from[0]),Math.abs(t[1]-o.from[1])<=d&&(l=o.from[1])}return[Math.round(r*100)/100,Math.round(l*100)/100]}var wt=.1,ue=.05,Ee=class{constructor(t){this.grid=t;this.active=!1;this.points=[]}start(t){this.active=!0,this.points=[],this.hoverAt=void 0,t.select(void 0),t.redraw()}stop(t){this.active=!1,this.points=[],this.hoverAt=void 0,t?.redraw()}snap(t,e){return lo(t.floor,e,t.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...t.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(t,e){let o=this.points[0];return o!==void 0&&this.points.length>=3&&Math.hypot(e[0]-o[0],e[1]-o[1])*t.view.scale<=10}pointerDown(t,e,o){if(!this.active||e.button!==0)return!1;let n=this.snap(t,o);if(this.closes(t,n))return this.finish(t),!0;let i=this.points[this.points.length-1];return(i===void 0||Math.hypot(n[0]-i[0],n[1]-i[1])>=.05)&&this.points.push(n),t.redraw(),!0}hover(t,e){this.active&&(this.hoverAt=e===void 0?void 0:this.snap(t,e),t.redraw())}keyDown(t,e){return this.active?e.key==="Escape"?(this.stop(t),!0):e.key==="Enter"?(this.points.length>=3&&this.finish(t),!0):e.key==="Backspace"||e.key==="Delete"?(this.points.pop(),t.redraw(),!0):!1:!1}async finish(t){let e=this.points.slice();if(this.stop(t),e.length<3)return;let o=await t.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(o===void 0)return;let n=t.newId(),i=t.floor.id;t.apply(a=>rn(a,i,n,e,o),{select:{kind:"room",roomId:n}})||t.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(t){if(!this.active)return g;let e=this.points.map(l=>t.toScreen(l)),o=this.hoverAt===void 0?void 0:t.toScreen(this.hoverAt),n=this.hoverAt!==void 0&&this.closes(t,this.hoverAt),i=[...e,...o!==void 0?[o]:[]].map(([l,d])=>`${l.toFixed(1)},${d.toFixed(1)}`).join(" "),a=this.points[this.points.length-1],r=a!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-a[0],this.hoverAt[1]-a[1]):0;return y`<g class="hme-draw">
      ${e.length>=3?y`<polygon points=${e.map(([l,d])=>`${l},${d}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:g}
      <polyline points=${i} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${e.map(([l,d],h)=>y`<circle cx=${l} cy=${d} r=${h===0&&n?8:5} fill=${h===0&&n?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${o!==void 0&&!n?y`<circle cx=${o[0]} cy=${o[1]} r="4" fill="#5b8def" />`:g}
      ${o!==void 0&&r>.05?y`<g class="hme-tag"><rect x=${o[0]+10} y=${o[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${o[0]+39} y=${o[1]-13} fill="#fff" text-anchor="middle">${r.toFixed(2)} m</text></g>`:g}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};var Ve={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},Yn=15,Hi=[{a:0,c:0},{c:0},{a:1,c:0},{a:1},{a:1,c:1},{c:1},{a:0,c:1},{a:0}];function Pi(s,t){let e=(Math.atan2(t,s)*180/Math.PI+180)%180;return["ew-resize","nwse-resize","ns-resize","nesw-resize"][Math.round(e/45)%4]}function Ei(s,t){let e=t===0?"":` Its ${C(t,"device")} come${t===1?"s":""} off the map too.`;return`${D(s)} comes off the map.${e} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}var A=s=>s.toFixed(1),ee=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,$t=class{constructor(){this.id="arrange";this.draw=new Ee(wt);this.query="";this.open=new Set;this.guides=[];this.dragging=!1;this.resizing=!1}stopDrag(t){this.guides=[],this.dragging=!1,this.resizing=!1,t.preview(void 0)}focus(t){let e=Pe(t.selection);return e===void 0?void 0:t.floor.rooms.find(o=>x(o.id,e))}rail(t){let e=t.floor,o=this.query.trim().toLowerCase(),n=e.rooms.filter(l=>o===""||D(l).toLowerCase().includes(o)),i=o===""?[]:e.pins.filter(l=>z(l,t.hass).toLowerCase().includes(o)||l.entityId.includes(o)),a=t.doc.floors.filter(l=>!x(l.id,e.id)),r=this.focus(t);return c`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a room or device" aria-label="Find a room or device" .value=${F(this.query)}
          @input=${l=>{this.query=l.target.value,t.redraw()}} /></label>
      <section class="hme-card hme-layers">
        <div class="hme-h">${L(e)}<span class="hme-h-end">${C(e.rooms.length,"room")}</span></div>
        ${n.map(l=>this.layer(t,l,r!==void 0&&x(r.id,l.id)))}
        ${n.length===0?c`<p class="hme-empty-line">${o===""?"No rooms on this floor yet.":"No room by that name."}</p>`:g}
        ${i.length>0?c`<div class="hme-sep"></div>${i.map(l=>c`<button type="button" class="hme-lay"
            @click=${()=>t.setMode("devices",{kind:"pin",pinId:l.id})}><span class="hme-dot dev"></span>${z(l,t.hass)}<span class="n">Device</span></button>`)}`:g}
        ${a.length>0?c`<div class="hme-sep"></div>${a.map(l=>c`<button type="button" class="hme-lay dim"
            @click=${()=>t.setFloor(l.id)}>▸ ${L(l)}<span class="n">${C(l.rooms.length,"room")}</span></button>`)}`:g}
      </section>
      <button type="button" class="hme-tb hme-wide ${this.draw.active?"on":""}" @click=${()=>this.draw.active?this.draw.stop(t):this.draw.start(t)}>
        ${this.draw.active?"Stop drawing":"\uFF0B Draw a room by hand"}</button>
      <p class="hme-foot">Scanned rooms come from the iPhone. Rooms you draw here (a garden, a garage) need no scan.</p>`}layer(t,e,o){let n=c`<button type="button" class="hme-lay ${o?"on":""}" aria-pressed=${o?"true":"false"}
      @click=${()=>t.select({kind:"room",roomId:e.id})}>
      <span class="hme-dot" style=${`background:${ao[it(e)]}`}></span>${D(e)}<span class="n">${We(e)}</span></button>`;if(!o)return n;let i=e.openings.map((h,p)=>({o:h,i:p})).filter(({o:h})=>h.kind!=="window"),a=e.openings.map((h,p)=>({o:h,i:p})).filter(({o:h})=>h.kind==="window"),r=we(t.floor,e.id),l=h=>{this.open.has(h)?this.open.delete(h):this.open.add(h),t.redraw()},d=h=>t.setMode("shape",h===void 0?{kind:"room",roomId:e.id}:{kind:"opening",roomId:e.id,opening:h});return c`${n}
      <button type="button" class="hme-lay sub" @click=${()=>d(i[0]?.i)}>Doors and ways in<span class="n">${i.length}</span></button>
      <button type="button" class="hme-lay sub" @click=${()=>d(a[0]?.i)}>Windows<span class="n">${a.length}</span></button>
      <button type="button" class="hme-lay sub" aria-expanded=${this.open.has("things")?"true":"false"} @click=${()=>l("things")}>Things<span class="n">${e.objects.length}</span></button>
      ${this.open.has("things")?e.objects.map((h,p)=>c`<div class="hme-lay subsub">${me(h.kind)}
        ${Be({on:h.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${me(h.kind)} shown`,click:()=>t.apply(m=>Gt(m,e.id,p,h.hidden!==!0))})}</div>`):g}
      <button type="button" class="hme-lay sub" aria-expanded=${this.open.has("devices")?"true":"false"} @click=${()=>l("devices")}>Devices<span class="n">${r.length}</span></button>
      ${this.open.has("devices")?r.map(h=>c`<button type="button" class="hme-lay subsub" @click=${()=>t.setMode("devices",{kind:"pin",pinId:h.id})}>${z(h,t.hass)}<span class="n">›</span></button>`):g}`}overlay(t){if(this.draw.active)return this.draw.overlay(t);let e=this.focus(t),o=[];for(let n of this.guides)o.push(this.guide(t,n));return e!==void 0&&e.outline.length>=3&&o.push(this.box(t,e)),o.length===0?g:y`${o}`}box(t,e){let o=Kn(e).map(f=>t.toScreen(f)),n=o.reduce((f,v)=>[f[0]+v[0]/4,f[1]+v[1]/4],[0,0]),i=f=>[(o[f][0]+o[(f+1)%4][0])/2,(o[f][1]+o[(f+1)%4][1])/2],a=f=>{let v=Math.max(Math.hypot(f[0]-n[0],f[1]-n[1]),1e-6);return[(f[0]-n[0])/v,(f[1]-n[1])/v]},r=[0,1,2,3].flatMap(f=>[o[f],i(f)]),l=[0,1,2,3].reduce((f,v)=>i(v)[1]<i(f)[1]?v:f,0),d=i(l),h=a(d),p=[d[0]+h[0]*28,d[1]+h[1]*28],m=vt(e),u=[];for(let f of[[0,2],[1,3]]){let[v,$]=f,M=Math.abs(o[(v+1)%4][0]-o[v][0])>=Math.abs(o[(v+1)%4][1]-o[v][1])?a(i(v))[1]<=a(i($))[1]?v:$:a(i(v))[0]<=a(i($))[0]?v:$,I=o[M],P=o[(M+1)%4],N=a(i(M)),j=[I[0]+N[0]*20,I[1]+N[1]*20],R=[P[0]+N[0]*20,P[1]+N[1]*20],U=[(j[0]+R[0])/2,(j[1]+R[1])/2],ve=M%2===0?m.width:m.depth,X=[N[0]*5,N[1]*5];u.push(y`<path d=${`M${ee(j)}L${ee(R)}M${ee([j[0]-X[0],j[1]-X[1]])}L${ee([j[0]+X[0],j[1]+X[1]])}M${ee([R[0]-X[0],R[1]-X[1]])}L${ee([R[0]+X[0],R[1]+X[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${A(U[0]-26)} y=${A(U[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${A(U[0])} y=${A(U[1]+4)} fill="#fff" text-anchor="middle">${ve.toFixed(2)} m</text></g>`)}return y`<g class="hme-box">
      <polygon points=${o.map(ee).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" />
      ${this.resizing||!this.dragging?u:g}
      ${this.dragging?g:y`
        <line x1=${A(d[0])} y1=${A(d[1])} x2=${A(p[0])} y2=${A(p[1])} stroke="#5b8def" stroke-width="1.6" />
        ${r.map((f,v)=>y`<rect data-hme="resize" data-handle=${v} x=${A(f[0]-5)} y=${A(f[1]-5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${Pi(f[0]-n[0],f[1]-n[1])}`}>
          <title>Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping.</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${ee(p)})`}>
          <title>Drag to turn the room. Hold Alt to turn it freely.</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(t,e){let o=t.toScreen(e.a),n=t.toScreen(e.b),i=Math.max(Math.hypot(n[0]-o[0],n[1]-o[1]),1e-6),a=[(n[0]-o[0])/i,(n[1]-o[1])/i],r=[o[0]-a[0]*40,o[1]-a[1]*40],l=[n[0]+a[0]*40,n[1]+a[1]*40],d=t.floor.rooms.find(m=>x(m.id,e.roomId)),h=`Lined up with ${d===void 0?"a":D(d)} wall`,p=h.length*6.2+20;return y`<g class="hme-guide" pointer-events="none">
      <line x1=${A(r[0])} y1=${A(r[1])} x2=${A(l[0])} y2=${A(l[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${A(l[0]+6)} y=${A(l[1]-10)} width=${A(p)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${A(l[0]+6+p/2)} y=${A(l[1]+4)} fill="#fff" text-anchor="middle">${h}</text></g>
    </g>`}pointerDown(t,e,o){if(this.draw.active)return this.draw.pointerDown(t,e,o);if(e.button!==0)return!1;let n=e.target?.closest?.("[data-hme]"),i=n?.getAttribute("data-hme"),a=this.focus(t);if(i==="turn"&&a!==void 0)return this.turnDrag(t,e,a,o),!0;let r=Hi[Number(n?.getAttribute("data-handle"))];if(i==="resize"&&a!==void 0&&r!==void 0)return this.resizeDrag(t,e,a,r,o),!0;let l=V(t.floor,o);return l===void 0?!1:(t.select({kind:"room",roomId:l.id}),this.moveDrag(t,e,l,o),!0)}moveDrag(t,e,o,n){let i=t.doc,a=o.id,r=ae(o.outline),l=[0,0];t.drag(e,{move:(d,h)=>{let p=d[0]-n[0],m=d[1]-n[1];if(t.toggles.grid&&r!==void 0){let u=wt;p=Math.round((r.minX+p)/u)*u-r.minX,m=Math.round((r.minY+m)/u)*u-r.minY}if(this.guides=[],t.toggles.snap&&!h.altKey){let u=Bo(i,a,p,m);u!==void 0&&(p=u.dx,m=u.dy,this.guides=u.guides)}this.dragging=!0,l=[p,m],t.preview(u=>$e(u,a,p,m))},end:(d,h,p)=>{this.stopDrag(t);let[m,u]=l;p&&(Math.abs(m)>=.005||Math.abs(u)>=.005)&&t.apply(f=>$e(f,a,m,u),{select:{kind:"room",roomId:a}})},cancel:()=>this.stopDrag(t)})}resizeDrag(t,e,o,n,i){let a=Uo(o);if(a===void 0)return;let r=t.doc,l=o.id,d=a.a1-a.a0,h=a.c1-a.c0;if(d<=1e-6||h<=1e-6)return;let p=v=>v[0]*a.u[0]+v[1]*a.u[1],m=v=>v[0]*a.v[0]+v[1]*a.v[1],u=v=>Math.min(Math.max(v,Re),De),f;t.drag(e,{move:(v,$)=>{let w=$.altKey?2:1,M=d,I=h;if(n.a!==void 0&&(M=d+(p(v)-p(i))*(n.a===1?1:-1)*w),n.c!==void 0&&(I=h+(m(v)-m(i))*(n.c===1?1:-1)*w),t.toggles.grid){let R=wt;n.a!==void 0&&(M=Math.round(M/R)*R),n.c!==void 0&&(I=Math.round(I/R)*R)}if(M=u(M),I=u(I),$.shiftKey){let R=M/d,U=I/h,ve=n.a===void 0?U:n.c===void 0||Math.abs(Math.log(R))>=Math.abs(Math.log(U))?R:U;ve=Math.min(Math.max(ve,Re/Math.min(d,h)),De/Math.max(d,h)),M=d*ve,I=h*ve}let P=[$.altKey||n.a===void 0?.5:1-n.a,$.altKey||n.c===void 0?.5:1-n.c],N={width:M,depth:I,anchor:P};if(this.guides=[],t.toggles.snap&&!$.altKey&&!$.ctrlKey&&!$.metaKey){let R=Xo(r,l,N,n,{proportional:$.shiftKey});R!==void 0&&(N=R.resize,this.guides=R.guides)}this.dragging=!0,this.resizing=!0,f=N;let j=N;t.preview(R=>Oe(R,l,j))},end:(v,$,w)=>{this.stopDrag(t);let M=f;!w||M===void 0||Math.abs((M.width??d)-d)<.005&&Math.abs((M.depth??h)-h)<.005||t.apply(I=>Oe(I,l,M),{select:{kind:"room",roomId:l}})},cancel:()=>this.stopDrag(t)})}turnDrag(t,e,o,n){let i=o.id,a=oe(o),r=Math.atan2(n[1]-a[1],n[0]-a[0]),l=0;t.drag(e,{move:(d,h)=>{let p=(Math.atan2(d[1]-a[1],d[0]-a[0])-r)*180/Math.PI;p=(p+540)%360-180,h.altKey||(p=Math.round(p/Yn)*Yn),this.dragging=!0,l=p,t.preview(m=>se(m,i,p,a))},end:(d,h,p)=>{this.stopDrag(t),p&&Math.abs(l)>.01&&t.apply(m=>se(m,i,l,a),{select:{kind:"room",roomId:i}})},cancel:()=>this.stopDrag(t)})}hover(t,e){this.draw.hover(t,e)}keyDown(t,e){if(this.draw.active)return this.draw.keyDown(t,e);let o=this.focus(t);if(o===void 0)return!1;let n=Q(e,!1);if(n==="delete")return this.askDelete(t,o),!0;if(typeof n=="object"&&"nudge"in n){let[i,a]=n.nudge;return t.apply(r=>$e(r,o.id,i,a)),!0}return!1}cursor(){return this.draw.active?"crosshair":void 0}leave(t){this.draw.stop(t),this.guides=[],this.dragging=!1,this.resizing=!1}dock(t){return c`<button type="button" class="hme-tb ${t.toggles.snap?"on":""}" aria-pressed=${t.toggles.snap?"true":"false"}
        title="A dragged room lines up with the walls round it. Hold Alt to move it freely." @click=${()=>t.setToggle("snap",!t.toggles.snap)}>Snap to walls</button>
      <button type="button" class="hme-tb ${t.toggles.grid?"on":""}" aria-pressed=${t.toggles.grid?"true":"false"}
        @click=${()=>t.setToggle("grid",!t.toggles.grid)}>Grid 10 cm</button>`}pill(t){if(this.draw.active)return c`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?c`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(t)}}>Close the room</button>`:g}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(t)}>Cancel</button>`;let e=this.focus(t);if(e===void 0||this.dragging)return g;let o=e.id;return c`<span class="hme-pill-name">${D(e)}</span>
      <button type="button" class="hme-tb" @click=${()=>t.apply(n=>se(n,o,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" @click=${()=>t.apply(n=>Z(n,o))}>Square the corners</button>
      <button type="button" class="hme-tb" title="Turn it to the floor's walls and slide it onto the nearest wall line, as the iPhone does"
        @click=${()=>t.apply(n=>Vo(n,o))}>Snap to walls</button>
      ${this.floorMenu(t,e,"Move to floor","hme-tb")}
      <button type="button" class="hme-tb danger" @click=${()=>{this.askDelete(t,e)}}>Delete</button>`}floorMenu(t,e,o,n){let i=t.doc.floors.filter(a=>!x(a.id,t.floor.id));return io({label:o,cls:n,options:[...i.map(a=>({value:a.id,label:L(a)})),{value:"new",label:"New floor\u2026"}],pick:a=>{this.moveToFloor(t,e,a)}})}async moveToFloor(t,e,o){let n=e.id,i={kind:"room",roomId:n};if(o!=="new"){t.apply(d=>Kt(d,n,{floorId:o}),{select:i,floorId:o});return}let a=Math.max(...t.doc.floors.map(d=>d.story))+1,r=await t.ask({title:"A new floor",label:"Name",value:a===1?"Upstairs":`Floor ${a+1}`,ok:"Move the room there"});if(r===void 0)return;let l=t.newId();t.apply(d=>Kt(d,n,{newFloor:{id:l,name:r,story:a}}),{select:i,floorId:l})}async askDelete(t,e){let o=we(t.floor,e.id).length;await t.confirm({title:`Delete ${D(e)}?`,text:Ei(e,o),ok:"Delete room",danger:!0})&&t.apply(i=>Zo(i,e.id),{select:null})}inspector(t){let e=this.focus(t);if(e===void 0)return this.floorCard(t,t.floor);let o=e.id,n=vt(e),i=So(t.floor,t.toggles.live?t.hass?.states:void 0).has(e.id),a=we(t.floor,o),r=ae(e.outline)??{minX:0,minY:0,maxX:0,maxY:0},l=Math.round(-Wo(e)*10)/10,d=e.areaId===void 0||t.areas.some(m=>m.id===e.areaId),h=e.pageId===void 0||t.pages.some(m=>x(m.id,e.pageId)),p=at(e);return c`
      <section class="hme-card hme-head">
        ${Wn(e,i)}
        <div class="hme-head-t">
          <strong>${D(e)}</strong>
          <span>${L(t.floor)} · ${We(e)} · ${n.area.toFixed(1)} m²</span>
        </div>
      </section>

      ${H("Room",c`
        ${S("Name",je({value:e.name??"",label:"Name",placeholder:"Room",set:m=>t.apply(u=>Jo(u,o,m))}))}
        ${S("Area",ce({label:"Area",value:e.areaId??"",options:[{value:"",label:"None"},...d?[]:[{value:e.areaId,label:`Not in Home Assistant (${e.areaId})`,disabled:!0}],...t.areas.map(m=>({value:m.id,label:m.name}))],set:m=>t.apply(u=>Qo(u,o,m===""?void 0:m))}))}
        ${K("The Home Assistant area. Its devices show first in Devices.")}
        ${S("Tap opens",ce({label:"Tap opens",value:e.pageId??"",options:[{value:"",label:"Nothing"},...h?[]:[{value:e.pageId,label:"A page not in your library",disabled:!0}],...t.pages.map(m=>({value:m.id,label:`Page: ${m.name}`}))],set:m=>t.apply(u=>en(u,o,m===""?void 0:m))}))}
        ${K("What a tap on this room does on the map tiles and the watch.")}`)}

      ${H("Place",c`
        ${S("Left, top",_({label:"Left",value:r.minX,unit:"m",set:m=>t.apply(u=>$e(u,o,m-r.minX,0))}),_({label:"Top",value:r.minY,unit:"m",set:m=>t.apply(u=>$e(u,o,0,m-r.minY))}))}
        ${S("Turn",_({label:"Turn",value:l,unit:"\xB0",digits:1,min:-180,max:180,width:"92px",set:m=>t.apply(u=>se(u,o,m-l))}),c`<button type="button" class="hme-tb" @click=${()=>t.apply(m=>se(m,o,-90))}>−90°</button>
            <button type="button" class="hme-tb" @click=${()=>t.apply(m=>se(m,o,90))}>+90°</button>
            <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>t.apply(m=>jo(m,o))}>Level</button>`)}
        ${S("Width, depth",_({label:"Width",value:n.width,unit:"m",min:Re,max:De,set:m=>t.apply(u=>Oe(u,o,{width:m}))}),_({label:"Depth",value:n.depth,unit:"m",min:Re,max:De,set:m=>t.apply(u=>Oe(u,o,{depth:m}))}))}
        ${K("Along its own walls, about its middle; its doors, things and devices move with it. Drag a room on the plan to move it (Alt moves it freely), or a square handle on its box to resize it (Shift keeps its proportions, Alt resizes it about its middle).")}
        ${S("Floor",ce({label:"Floor",value:t.floor.id,options:[...t.doc.floors.map(m=>({value:m.id,label:L(m)})),{value:"new",label:"New floor\u2026"}],set:m=>{this.moveToFloor(t,e,m)}}))}
        ${S("Wall height",_({label:"Wall height",value:e.height,unit:"m",min:.5,max:20,set:m=>t.apply(u=>_e(u,o,m))}))}`)}

      ${H("Floor finish",c`<div class="hme-pics">
        ${W({label:`Auto: ${Ve[p]}`,picture:ro(p),on:e.finish===void 0,title:"Picked from the room's name and furniture",click:()=>t.apply(m=>Me(m,o,void 0))})}
        ${qe.map(m=>W({label:Ve[m],picture:ro(m),on:e.finish===m,click:()=>t.apply(u=>Me(u,o,m))}))}
      </div>`)}

      ${H("In this room",c`
        ${e.objects.length===0?c`<p class="hme-empty-line">No things. Add a sofa, a bed or stairs so the map reads.</p>`:g}
        ${e.objects.map((m,u)=>c`<div class="hme-r tight"><span class="hme-grow ${m.hidden===!0?"dim":""}">${me(m.kind)}</span>
          ${Be({on:m.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${me(m.kind)} shown`,click:()=>t.apply(f=>Gt(f,o,u,m.hidden!==!0))})}
          <button type="button" class="hme-x" aria-label=${`Remove ${me(m.kind)}`} title="Remove" @click=${()=>t.apply(f=>an(f,o,u))}>×</button></div>`)}
        ${e.openings.length>0?c`<div class="hme-r tight"><span class="hme-grow">${[...new Set(e.openings.map(he))].join(", ")}</span>
          <button type="button" class="hme-link" @click=${()=>t.setMode("shape",{kind:"room",roomId:o})}>Shape ›</button></div>`:g}
        <div class="hme-r tight"><span class="hme-grow">${a.length===0?"No devices":a.slice(0,3).map(m=>z(m,t.hass)).join(", ")+(a.length>3?"\u2026":"")}</span>
          <button type="button" class="hme-link" @click=${()=>t.setMode("devices",{kind:"room",roomId:o})}>${C(a.length,"device")} ›</button></div>
        <div class="hme-row-end">
          ${io({label:"\uFF0B Add a thing",cls:"hme-tb",options:tn.map(m=>({value:m,label:me(m)})),pick:m=>{let u=B(e)??oe(e);t.apply(f=>on(f,o,m,u))}})}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(t,e)}}>Delete room</button>
        </div>`)}`}floorCard(t,e){let o=Je(e,t.toggles.live?t.hass?.states:void 0);return c`${H("Floor",c`
        ${S("Name",je({value:e.name,label:"Floor name",placeholder:L(e),set:n=>t.apply(i=>rt(i,e.id,n))}))}
        ${S("On it",c`<span class="hme-val">${C(e.rooms.length,"room")} · ${C(e.pins.length,"device")} · ${Qe(o)}</span>`)}`)}
      ${H("Arrange",c`<p class="hme-text">Pick a room on the plan or in the list to move it, turn it, resize it, or change its name, area and floor.</p>
        <p class="hme-text dim">Drag a room to move it; it lines up with the walls of the rooms round it. Drag the round handle above it to turn it, or a square handle on its box to resize it. Undo with ${Fn()}.</p>`)}`}};var Mt="application/x-wa-home-map-entity",Si=new Set(["light","switch","fan","climate","humidifier","water_heater","sensor","binary_sensor","media_player","lock","cover","valve","camera","vacuum","alarm_control_panel","siren","input_boolean","remote"]);function Ti(s,t){let e=s?.entities?.[t];if(e===void 0)return;if(typeof e.area_id=="string"&&e.area_id!=="")return e.area_id;let o=e.device_id?s?.devices?.[e.device_id]:void 0;return typeof o?.area_id=="string"&&o.area_id!==""?o.area_id:void 0}function Zn(s){let t=[];for(let[e,o]of Object.entries(s?.states??{})){let n=s?.entities?.[e];if(n?.hidden===!0)continue;let i=o?.attributes?.friendly_name,a=Ti(s,e),r=a===void 0?void 0:s?.areas?.[a]?.name?.trim()||a,l=o?.attributes?.device_class;t.push({entityId:e,name:typeof i=="string"&&i.trim()!==""?i.trim():e,domain:e.slice(0,e.indexOf(".")),areaId:a,areaName:r,deviceClass:typeof l=="string"?l:void 0,category:typeof n?.entity_category=="string"?n.entity_category:void 0})}return t.sort((e,o)=>e.name.localeCompare(o.name)||e.entityId.localeCompare(o.entityId))}function Ii(s){return new Set(s.floors.flatMap(t=>t.pins.map(e=>e.entityId)))}function Jn(s,t,e){let o=Ii(s),n=new Map;for(let a of e){if(o.has(a.entityId)||a.areaId===void 0||a.category!==void 0||!Si.has(a.domain))continue;let r=n.get(a.areaId);r===void 0&&n.set(a.areaId,r={areaId:a.areaId,name:a.areaName??a.areaId,here:!1,devices:[]}),r.devices.push(a)}let i=t.rooms.map(a=>a.areaId).filter(a=>a!==void 0);for(let a of n.values())a.here=i.includes(a.areaId);return[...n.values()].sort((a,r)=>{let l=i.indexOf(a.areaId),d=i.indexOf(r.areaId);return l>=0||d>=0?(l<0?1/0:l)-(d<0?1/0:d):a.name.localeCompare(r.name)})}function Qn(s,t){let e=new Set(s.rooms.map(o=>o.areaId).filter(o=>o!==void 0));return t.filter(o=>e.has(o.areaId)).reduce((o,n)=>o+n.devices.length,0)}function ei(s,t,e=40){let o=t.toLowerCase().split(/\s+/).filter(r=>r!=="");if(o.length===0)return[];let n=r=>`${r.name} ${r.entityId} ${r.areaName??""}`.toLowerCase(),i=s.filter(r=>o.every(l=>n(r).includes(l))),a=t.trim().toLowerCase();return i.sort((r,l)=>+!r.name.toLowerCase().startsWith(a)-+!l.name.toLowerCase().startsWith(a)).slice(0,e)}var Ci=[["lights","Lights"],["climate","Climate"],["sensors","Sensors"],["power","Power"],["media","Media"],["security","Security"],["covers","Covers"],["other","Other"]];function kt(s){switch(s.slice(0,s.indexOf("."))){case"light":return"lights";case"climate":case"fan":case"humidifier":case"water_heater":return"climate";case"sensor":case"binary_sensor":return"sensors";case"switch":case"input_boolean":return"power";case"media_player":case"remote":return"media";case"lock":case"camera":case"alarm_control_panel":case"siren":return"security";case"cover":case"valve":return"covers";default:return"other"}}function ti(s){let t=new Map;for(let e of s.pins){let o=kt(e.entityId);t.set(o,(t.get(o)??0)+1)}return Ci.filter(([e])=>t.has(e)).map(([e,o])=>({kind:e,label:o,count:t.get(e)}))}function oi(s){return s.replace(/_/g," ")}function Se(s,t){let e=t?.[s];if(e===void 0)return"gone";let o=String(e.state??""),n=s.slice(0,s.indexOf(".")),i=e.attributes??{};if(n==="light"&&o==="on"&&typeof i.brightness=="number")return`on \xB7 ${Math.round(i.brightness/255*100)}%`;if(n==="climate"&&typeof i.current_temperature=="number")return`${o} \xB7 ${i.current_temperature}\xB0`;let a=typeof i.unit_of_measurement=="string"?i.unit_of_measurement:"";return a!==""&&o!==""&&Number.isFinite(Number(o))?`${o} ${a}`.replace(" \xB0","\xB0").replace(" %","%"):o.replace(/_/g," ")}function po(s){return["light","switch","fan","input_boolean","media_player","cover","humidifier","siren"].includes(s.slice(0,s.indexOf(".")))}function ho(s,t){let e=String(t?.[s]?.state??"");return s.startsWith("cover.")?e==="open"||e==="opening"?"Close":"Open":e==="on"||e==="playing"||e==="paused"||e==="idle"?"Turn off":"Turn on"}var mo=[["Floor",.3],["Table",.8],["Wall",1.6],["Ceiling",2.5]],co=[[void 0,"As the tile does"],["toggle","Turn on or off"],["details","Show details"],["page","Open a page"],["none","Nothing"]];function uo(s,t){for(let e of s.floors){let o=e.pins.find(n=>n.entityId===t);if(o!==void 0)return{floorId:e.id,pinId:o.id}}}function ni(s,t){return t===void 0?void 0:s.rooms.find(e=>e.areaId!==void 0&&e.areaId===t)}function fe(s){return s?.kind==="pin"?[s.pinId]:s?.kind==="pins"?s.pinIds.slice():[]}function Ue(s){let t=[];for(let e of s)t.some(o=>x(o,e))||t.push(e);if(t.length!==0)return t.length===1?{kind:"pin",pinId:t[0]}:{kind:"pins",pinIds:t}}function xt(s,t){let e=fe(s);return e.some(o=>x(o,t))?Ue(e.filter(o=>!x(o,t))):Ue([...e,t])}function ii(s,t){return Ue([...fe(s),...t])}function ai(s,t,e){let[o,n]=[Math.min(t[0],e[0]),Math.max(t[0],e[0])],[i,a]=[Math.min(t[1],e[1]),Math.max(t[1],e[1])];return s.filter(r=>r.at[0]>=o&&r.at[0]<=n&&r.at[1]>=i&&r.at[1]<=a).map(r=>r.id)}function ge(s){if(s.length===0)return{mixed:!0};let t=JSON.stringify(s[0])??"undefined";return s.every(e=>(JSON.stringify(e)??"undefined")===t)?{mixed:!1,value:s[0]}:{mixed:!0}}function ri(s,t){if(s.length===0||!s.every(po))return;let e=s.every(n=>n.startsWith("cover.")),o=s.some(n=>{let i=ho(n,t);return i==="Turn off"||i==="Close"});return e?o?{words:"Close",service:"turn_off"}:{words:"Open",service:"turn_on"}:o?{words:"Turn off",service:"turn_off"}:{words:"Turn on",service:"turn_on"}}var Ri=15,Ht=Math.PI/4,fo=8,Pt="#ffbf55",k=s=>s.toFixed(1);function Di(s,t){return`${oi(s.domain)} \xB7 ${Se(s.entityId,t)}`}function Oi(s,t){let e=ne(s,t);if(e===void 0)return"Not in a room";let o=V(s,t.at);return o!==void 0&&x(o.id,e.id)?`${D(e)} (found by place)`:D(e)}function _i(s,t,e){return s.icon!==void 0?ut[s.icon]:`Auto (${ut[ze(s.entityId,t,e)].toLowerCase()})`}var Et=class{constructor(){this.id="devices";this.drawsPins=!0;this.query="";this.side=!0;this.names=!1;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1}states(t){return t.toggles.live?t.hass?.states:void 0}picked(t){let e=t.selection;return e?.kind==="pin"?t.floor.pins.find(o=>x(o.id,e.pinId)):void 0}picks(t){return fe(t.selection).flatMap(e=>t.floor.pins.filter(o=>x(o.id,e)))}deviceClass(t,e){let o=t.hass?.states?.[e]?.attributes?.device_class;return typeof o=="string"?o:void 0}friendly(t,e){let o=t.hass?.states?.[e]?.attributes?.friendly_name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0}place(t,e,o,n){let i=uo(t.doc,e);if(i!==void 0)return x(i.floorId,t.floor.id)||t.setFloor(i.floorId),t.select({kind:"pin",pinId:i.pinId}),!1;let a=ni(t.floor,n),r=o??(a===void 0?gt(t.view,[t.stage.width/2,t.stage.height/2]):B(a)??oe(a)),l=t.newId().toUpperCase(),d=t.floor.id,h=this.friendly(t,e),p=t.apply(m=>gn(m,d,{id:l,entityId:e,at:[r[0],r[1]],...h===void 0?{}:{name:h}}),{select:{kind:"pin",pinId:l}});return p||t.note("warn","That device could not be put on the map: the map holds at most 400 devices."),p}placeAll(t,e){let o=e.map(i=>({entityId:i.entityId,areaId:i.areaId,name:i.name,deviceClass:i.deviceClass})),n=t.floor.id;t.apply(i=>wn(i,n,o,()=>t.newId())?.doc,{select:null})}rail(t){let e=t.hass?.states,o=Zn(t.hass),n=Jn(t.doc,t.floor,o),i=n.reduce((p,m)=>p+m.devices.length,0),a=Qn(t.floor,n),r=ei(o,this.query),l=ti(t.floor),d=t.floor.pins.filter(p=>this.filter===void 0||kt(p.entityId)===this.filter),h=fe(t.selection);return c`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find any device" aria-label="Find any device" .value=${F(this.query)}
          @input=${p=>{this.query=p.target.value,t.redraw()}} /></label>
      ${this.query.trim()===""?g:H("Found",c`
        ${r.length===0?c`<p class="hme-empty-line">No device by that name.</p>`:g}
        ${r.map(p=>this.deviceRow(t,p,e))}`,r.length>=40?"40+":String(r.length),"hme-tray")}
      ${H("Not on the map",c`
        ${i===0?c`<p class="hme-empty-line">Every device with an area is on the map. Find any other above.</p>`:g}
        ${n.map(p=>c`<div class="hme-ar ${p.here?"":"dim"}">${p.name}<span>${p.devices.length}</span></div>
          ${p.devices.map(m=>this.deviceRow(t,m,e))}`)}
        ${i===0?g:c`<button type="button" class="hme-tb hme-wide" ?disabled=${a===0}
            title=${a===0?"Link this floor's rooms to Home Assistant areas in Arrange first":""}
            @click=${()=>this.placeAll(t,n.flatMap(p=>p.devices))}>Place all ${a} by area</button>
          <p class="hme-foot">Each goes into the room linked to its area, at a good height for its kind. Then drag to fine tune.</p>`}`,String(i),"hme-tray")}
      ${H("On the map",c`
        ${l.length===0?c`<p class="hme-empty-line">No devices on this floor yet. Drag one onto the plan.</p>`:c`<div class="hme-chips">
          ${l.map(p=>c`<button type="button" class="hme-chip sel ${this.filter===p.kind?"on":""}" aria-pressed=${this.filter===p.kind?"true":"false"}
            @click=${()=>{this.filter=this.filter===p.kind?void 0:p.kind,t.redraw()}}>${p.label} ${p.count}</button>`)}</div>`}
        ${d.slice(0,60).map(p=>{let m=h.some(u=>x(u,p.id));return c`<button type="button" class="hme-lay ${m?"on":""}" title="Shift, Cmd or Ctrl and a click picks several"
            @click=${u=>t.select(u.shiftKey||u.metaKey||u.ctrlKey?xt(t.selection,p.id):{kind:"pin",pinId:p.id})}>
            <span class="hme-dot dev ${Y(p.entityId,e).kind==="light"?"":"gray"}"></span>${z(p,t.hass)}
            <span class="n">${Se(p.entityId,e)}</span></button>`})}`,String(t.floor.pins.length))}`}deviceRow(t,e,o){let n=uo(t.doc,e.entityId),i=ze(e.entityId,e.deviceClass,e.name);return c`<div class="hme-dv ${this.dragging===e.entityId?"dragging":""} ${n===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${n===void 0?"true":"false"} title=${n===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it"}
      @dragstart=${a=>{a.dataTransfer?.setData(Mt,e.entityId),a.dataTransfer?.setData("text/plain",e.entityId),a.dataTransfer&&(a.dataTransfer.effectAllowed="copy"),this.dragging=e.entityId,t.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,t.redraw()}}
      @click=${()=>this.place(t,e.entityId,void 0,e.areaId)}
      @keydown=${a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),this.place(t,e.entityId,void 0,e.areaId))}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${le(i,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${e.name}<small>${n===void 0?Di(e,o):"on the map"}</small></span>
      <span class="hme-dv-grip" aria-hidden="true">${n===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}dragOver(t,e,o){let n=this.dragging!==void 0||[...o.dataTransfer?.types??[]].includes(Mt),i=this.dropAt;return this.dropAt=n?e:void 0,i!==this.dropAt&&t.redraw(),n&&e!==void 0}drop(t,e,o){let n=this.dragging??o.dataTransfer?.getData(Mt)??"";this.dragging=void 0,this.dropAt=void 0,n!==""?this.place(t,n,e):t.redraw()}overlay(t){let e=this.states(t),o=this.picked(t),n=fe(t.selection),i=[];this.dropAt!==void 0&&i.push(this.dropMark(t,this.dropAt));let a=o===void 0?void 0:Y(o.entityId,e);o!==void 0&&a?.kind==="light"&&i.push(this.glowRing(t,o,a.on?a.brightness:void 0));for(let r of t.floor.pins){let l=n.some(h=>x(r.id,h)),d=this.filter!==void 0&&kt(r.entityId)!==this.filter;i.push(this.pinMark(t,r,l,d,e))}return this.box!==void 0&&i.push(this.boxMark(t,this.box)),y`${i}`}boxMark(t,e){let[o,n]=t.toScreen(e.a),[i,a]=t.toScreen(e.b);return y`<rect class="hme-box" x=${k(Math.min(o,i))} y=${k(Math.min(n,a))} width=${k(Math.abs(i-o))} height=${k(Math.abs(a-n))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`}pinMark(t,e,o,n,i){let[a,r]=t.toScreen(e.at),l=Y(e.entityId,i),d=l.kind==="light"&&l.on,h=d?Ke(e)??Pt:"rgba(36,36,40,0.92)",p=d?"#fff3d6":l.kind==="gone"?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.4)",m=d?"#3a2600":l.kind==="lock"?l.locked?"#30d158":"#ff9f0a":l.kind==="other"&&l.on?"#ffffff":l.kind==="gone"?"#8e8e93":"#d1d1d6",u=e.icon??ze(e.entityId,this.deviceClass(t,e.entityId),this.friendly(t,e.entityId)),f=o?13:12,v=o||this.names?z(e,t.hass):Hn(e,i),$=v===void 0?0:v.length*5.9+14;return y`<g class="hme-pin" data-hme="pin" data-pin=${e.id} transform=${`translate(${k(a)} ${k(r)})`} opacity=${n?.25:1} style="cursor:grab">
      ${o?y`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:g}
      ${d?y`<circle r=${f+7} fill=${h} opacity="0.22" />`:g}
      <circle r=${f} fill=${h} stroke=${p} stroke-width="1.2" />
      <g transform="translate(-7 -7)">${le(u,m,14,1.5)}</g>
      ${v===void 0||v===""?g:y`<g pointer-events="none"><rect x=${k(-$/2)} y=${f+4} width=${k($)} height="16" rx="8" fill=${o?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text y=${f+15.5} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${v}</text></g>`}
    </g>`}glowRing(t,e,o){let[n,i]=t.toScreen(e.at),a=Ne(e,o),r=t.px(a),l=[n+r*Math.cos(Ht),i+r*Math.sin(Ht)],d=`Glow ${a.toFixed(1)} m`,h=d.length*6.2+18,p=e.glowSpill===!0?void 0:ne(t.floor,e),m=p!==void 0&&p.outline.length>=3?p.outline.map(f=>t.toScreen(f).map(k).join(",")).join(" "):void 0,u=f=>y`<circle cx=${k(n)} cy=${k(i)} r=${k(r)} fill="none" stroke=${Ke(e)??"#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${f} pointer-events="none" />`;return y`<g class="hme-glow-ring">
      ${m===void 0?u(1):y`<clipPath id="hme-glow-walls"><polygon points=${m} /></clipPath>
        ${u(.28)}<g clip-path="url(#hme-glow-walls)">${u(1)}</g>`}
      <circle data-hme="glow" cx=${k(l[0])} cy=${k(l[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${k(l[0]-h/2)} y=${k(l[1]+12)} width=${k(h)} height="18" rx="9" fill="#5b8def" />
        <text x=${k(l[0])} y=${k(l[1]+25)} fill="#fff" text-anchor="middle">${d}</text></g>
    </g>`}dropMark(t,e){let o=V(t.floor,e),[n,i]=t.toScreen(e),a=o===void 0?"Drop here, in no room":`Drop in ${D(o)}`,r=a.length*6.4+20;return y`<g class="hme-drop" pointer-events="none">
      ${o===void 0?g:y`<polygon points=${o.outline.map(l=>t.toScreen(l).map(k).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${k(n)} cy=${k(i)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${k(n-r/2)} y=${k(i+20)} width=${k(r)} height="18" rx="9" fill="#5b8def" />
        <text x=${k(n)} y=${k(i+33)} fill="#fff" text-anchor="middle">${a}</text></g>
    </g>`}pinAt(t,e){let o,n=Ri;for(let i of t.floor.pins){let a=t.toScreen(i.at),r=Math.hypot(a[0]-e[0],a[1]-e[1]);r<=n&&(o=i,n=r)}return o}pointerDown(t,e,o){if(e.button!==0)return!1;let n=t.toScreen(o),i=e.shiftKey||e.metaKey||e.ctrlKey,a=this.picked(t),r=a===void 0?void 0:Y(a.entityId,this.states(t));if(!i&&a!==void 0&&r?.kind==="light"){let[h,p]=t.toScreen(a.at),m=t.px(Ne(a,r.on?r.brightness:void 0));if(Math.hypot(n[0]-(h+m*Math.cos(Ht)),n[1]-(p+m*Math.sin(Ht)))<=10)return this.glowDrag(t,e,a),!0}let l=this.pinAt(t,n);if(l===void 0)return e.shiftKey?(this.boxDrag(t,e,o),!0):!1;if(this.pickPage=!1,this.iconsOpen=!1,i)return t.select(xt(t.selection,l.id)),!0;let d=fe(t.selection);return d.length>1&&d.some(h=>x(h,l.id))?(this.groupDrag(t,e,d,l.id,o),!0):(t.select({kind:"pin",pinId:l.id}),this.moveDrag(t,e,l,o),!0)}groupDrag(t,e,o,n,i){let a=[0,0],r=Ue(o);t.drag(e,{move:l=>{this.moving=!0,a=[l[0]-i[0],l[1]-i[1]];let[d,h]=a;t.preview(p=>mt(p,o,d,h))},end:(l,d,h)=>{this.moving=!1,t.preview(void 0);let[p,m]=a;h?Math.hypot(p,m)>=.005&&t.apply(u=>mt(u,o,p,m),r===void 0?{}:{select:r}):t.select({kind:"pin",pinId:n})},cancel:()=>this.stopDrag(t)})}stopDrag(t){this.moving=!1,this.box=void 0,t.preview(void 0)}boxDrag(t,e,o){let n=t.floor.pins,i=t.selection;t.drag(e,{move:a=>{this.box={a:o,b:a},t.redraw()},end:(a,r,l)=>{this.box=void 0,l?t.select(ii(i,ai(n,o,a))):t.redraw()},cancel:()=>this.stopDrag(t)})}async removePicks(t,e){e.length!==0&&(e.length>1&&!await t.confirm({title:`Remove ${C(e.length,"device")} from the map?`,text:"They go back to Not on the map. Undo puts them back where they were.",ok:"Remove",danger:!0})||t.apply(o=>yn(o,e),{select:null}))}moveDrag(t,e,o,n){let i=o.id,a=[o.at[0],o.at[1]],r=a;t.drag(e,{move:l=>{this.moving=!0,r=[a[0]+l[0]-n[0],a[1]+l[1]-n[1]],t.preview(d=>Vt(d,i,r))},end:(l,d,h)=>{this.moving=!1,t.preview(void 0),h&&Math.hypot(r[0]-a[0],r[1]-a[1])>=.005&&t.apply(p=>Vt(p,i,r),{select:{kind:"pin",pinId:i}})},cancel:()=>this.stopDrag(t)})}glowDrag(t,e,o){let n=o.id,i;t.drag(e,{move:a=>{this.moving=!0;let r=Math.hypot(a[0]-o.at[0],a[1]-o.at[1]);i=Math.min(Math.max(Math.round(r/.05)*.05,Ie),Ho);let l=i;t.preview(d=>Le(d,n,{glow:l}))},end:()=>{this.moving=!1,t.preview(void 0);let a=i;a!==void 0&&t.apply(r=>Le(r,n,{glow:a}))},cancel:()=>this.stopDrag(t)})}keyDown(t,e){let o=this.picks(t).map(i=>i.id);if(o.length===0)return!1;let n=Q(e,!1);if(n==="delete")return this.removePicks(t,o),!0;if(typeof n=="object"&&"nudge"in n){let[i,a]=n.nudge;return t.apply(r=>mt(r,o,i,a)),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.box=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1}dock(t){let e=(o,n,i,a)=>c`<button type="button" class="hme-tb ${n?"on":""}"
      aria-pressed=${n?"true":"false"} title=${a} @click=${()=>{i(),t.redraw()}}>${o}</button>`;return c`${e("Side view",this.side,()=>{this.side=!this.side},"The picked device's room from the side, to set its height")}
      ${e("Names",this.names,()=>{this.names=!this.names},"Every device's name under its pin")}`}stageExtra(t){let e=this.picked(t);if(!this.side||e===void 0)return g;let o=ne(t.floor,e),n=o?.height??2.5,i=ae(o?.outline??t.floor.rooms.flatMap(P=>P.outline))??{minX:e.at[0]-1,maxX:e.at[0]+1,minY:0,maxY:0},a=18,r=118,l=(r-a)/Math.max(n,.5),d=30,h=262,p=(h-d)/Math.max(i.maxX-i.minX,.5),m=P=>d+(Math.min(Math.max(P,i.minX),i.maxX)-i.minX)*p,u=e.at[2],f=r-Math.min(Math.max(u,0),n)*l,v=m(e.at[0]),$=(()=>{let P=Y(e.entityId,this.states(t));return P.kind==="light"&&P.on})(),w=[];for(let P=0;P<=n+1e-9;P+=1)w.push(P);let M=o===void 0?[]:Eo(o),I=o===void 0?"No room":D(o);return c`<div class="hme-side">
      <div class="hme-h">${I} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${z(e,t.hass)} at ${u.toFixed(2)} m, the wall ${n.toFixed(1)} m tall`}
        @pointerdown=${P=>this.heightDrag(t,P,e,n,r,l)}>
        <path d=${`M${d} ${k(a)}H${h}M${d} ${r}H${h}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${d} ${k(a)}V${r}M${h} ${k(a)}V${r}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${w.map(P=>y`<text x=${d-6} y=${k(r-P*l+3)}>${P===0?"0":`${P} m`}</text>
            <path d=${`M${d-4} ${k(r-P*l)}H${d}`} stroke="#8e8e93" />`)}
        </g>
        ${M.map(P=>{let N=m(P.c[0]-P.size[0]/2),j=m(P.c[0]+P.size[0]/2),R=Math.min(P.size[2],n)*l;return y`<rect x=${k(N)} y=${k(r-R)} width=${k(Math.max(j-N,2))} height=${k(R)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${k(v)} ${r}V${k(f)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${$?y`<circle cx=${k(v)} cy=${k(f)} r="20" fill="#ffb648" opacity="0.22" />`:g}
        <circle cx=${k(v)} cy=${k(f)} r="9" fill=${$?Pt:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${k(Math.min(v+14,222))} y=${k(f-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${k(Math.min(v+14,222)+22)} y=${k(f+3.5)} fill="#fff" font-size="10" text-anchor="middle">${u.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(t,e,o,n,i,a){if(e.button!==0)return;let r=e.currentTarget,l=o.id,d=u=>{let f=r.getBoundingClientRect(),v=(u.clientY-f.top)*130/Math.max(f.height,1);return Math.min(Math.max(Math.round((i-v)/a/.05)*.05,0),n)},h=d(e);try{r.setPointerCapture(e.pointerId)}catch{}this.moving=!0,t.preview(u=>J(u,l,h));let p=u=>{h=d(u);let f=h;t.preview(v=>J(v,l,f))},m=()=>{r.removeEventListener("pointermove",p),r.removeEventListener("pointerup",m),r.removeEventListener("pointercancel",m),this.moving=!1,t.preview(void 0);let u=h;Math.abs(u-o.at[2])>=.005&&t.apply(f=>J(f,l,u))};r.addEventListener("pointermove",p),r.addEventListener("pointerup",m),r.addEventListener("pointercancel",m)}pill(t){let e=this.picks(t);if(e.length>1&&!this.moving)return this.groupPill(t,e);let o=this.picked(t);if(o===void 0||this.moving)return g;let n=o.id,i=o.entityId.startsWith("light."),a=ne(t.floor,o)!==void 0;return c`<span class="hme-pill-name">${z(o,t.hass)}</span>
      ${po(o.entityId)&&t.hass!==void 0?c`<button type="button" class="hme-tb" @click=${()=>this.toggle(t,o.entityId)}>${ho(o.entityId,t.hass.states)}</button>`:g}
      ${i?c`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>t.apply(r=>vn(r,n))}>Same height for all lights</button>`:g}
      ${a?c`<button type="button" class="hme-tb" @click=${()=>t.apply(r=>bn(r,n))}>Center in room</button>`:g}
      <button type="button" class="hme-tb danger" @click=${()=>t.apply(r=>Ut(r,n),{select:null})}>Remove</button>`}groupPill(t,e){let o=e.map(l=>l.id),n=e[0],i=n.at[2],a=e.every(l=>Math.abs(l.at[2]-i)<.005),r=t.hass===void 0?void 0:ri(e.map(l=>l.entityId),t.hass.states);return c`<span class="hme-pill-name">${C(e.length,"device")}</span>
      ${r===void 0?g:c`<button type="button" class="hme-tb" @click=${()=>this.turn(t,e.map(l=>l.entityId),r.service)}>${r.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${a} title=${a?"They are all at one height":`Every picked device at ${z(n,t.hass)}'s height, ${i.toFixed(2)} m`}
        @click=${()=>t.apply(l=>xe(l,o,i))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(t,o)}}>Remove</button>`}toggle(t,e){let o=t.hass;o!==void 0&&Dt(o,"homeassistant","toggle",{entity_id:e}).catch(n=>{t.note("err",`Could not turn it on or off: ${n instanceof Error?n.message:String(n)}`)})}turn(t,e,o){let n=t.hass;n!==void 0&&Dt(n,"homeassistant",o,{entity_id:[...e]}).catch(i=>{t.note("err",`Could not turn them ${o==="turn_on"?"on":"off"}: ${i instanceof Error?i.message:String(i)}`)})}inspector(t){let e=this.picks(t);if(e.length>1)return this.groupInspector(t,e);let o=this.picked(t);if(o===void 0)return this.overview(t);let n=t.hass?.states,i=o.id,a=Y(o.entityId,n),r=a.kind==="light"&&a.on,l=this.friendly(t,o.entityId),d=this.deviceClass(t,o.entityId),h=ze(o.entityId,d,l),p=o.icon??h,u=ne(t.floor,o)?.height??2.5,f=w=>t.apply(M=>Le(M,i,w,l)),$=Ke(o)??Pt;return c`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${r?"lit":""}" style=${r?`background:${$};box-shadow:0 0 24px ${$}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${le(p,r?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${z(o,t.hass)}</strong>
          <span class="mono">${o.entityId}</span>
        </div>
        <span class="hme-state ${r?"lit":""}">${Se(o.entityId,n)}</span>
      </section>

      ${H("On the map",c`
        ${S("Name",je({value:o.name??"",label:"Name on the map",placeholder:l??o.entityId,set:w=>f({name:w.trim()===""?null:w})}))}
        ${S("Icon",c`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
          @click=${()=>{this.iconsOpen=!this.iconsOpen,t.redraw()}}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${le(p,"currentColor",24,2)}</svg>
          <span class="hme-grow">${_i(o,d,l)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
        ${this.iconsOpen?this.iconMenu(t,o,h,f):g}
        ${S("Room",c`<span class="hme-in hme-ro">${Oi(t.floor,o)}</span>`)}
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${W({label:"None",picture:Te("none",$),on:o.reading==="none",click:()=>f({reading:"none"})})}
          ${W({label:"Pill",picture:Te("pill",$),on:o.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>f({reading:null})})}
          ${W({label:"Name",picture:Te("name",$),on:o.reading==="name",click:()=>f({reading:"name"})})}
        </div></div>`)}

      ${H("Height",c`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${u} step="0.05" .value=${F(String(o.at[2]))} aria-label="Height" style=${ye(o.at[2],0,u)}
            @input=${w=>{let M=Number(w.target.value);t.preview(I=>J(I,i,M))}}
            @change=${w=>{let M=Number(w.target.value);t.apply(I=>J(I,i,M))}} />
          ${_({label:"Height",value:o.at[2],unit:"m",min:0,max:100,width:"92px",set:w=>t.apply(M=>J(M,i,w))})}
        </div>
        <div class="hme-chips">${mo.map(([w,M])=>c`<button type="button" class="hme-chip sel ${Math.abs(o.at[2]-M)<.005?"on":""}"
          @click=${()=>t.apply(I=>J(I,i,M))}>${w} ${M}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${o.entityId.startsWith("light.")?this.lightCard(t,o,a.kind==="light"&&a.on?a.brightness:void 0,f):g}

      ${this.tapCard(t,o,f)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>t.apply(w=>Ut(w,i),{select:null})}>Remove from the map</button></div>`}iconMenu(t,e,o,n){let i=r=>{this.iconsOpen=!1,n({icon:r}),t.redraw()},a=(r,l,d,h)=>c`<button type="button" class="hme-icon-cell ${d?"on":""}"
      title=${l} aria-label=${l} aria-pressed=${d?"true":"false"} @click=${()=>i(h)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${le(r,"currentColor",24,1.9)}</svg><span>${l}</span></button>`;return c`<div class="hme-icons" role="group" aria-label="Icon">
      ${a(o,"Auto",e.icon===void 0,null)}
      ${xo.map(r=>a(r,ut[r],e.icon===r,r))}
    </div>`}lightCard(t,e,o,n){let i=e.id,a=Ne(e,o),r=Ke(e),l=(d,h,p)=>c`<button type="button" class="hme-chip sel ${h?"on":""}" aria-pressed=${h?"true":"false"} @click=${p}>${d}</button>`;return H("Light",c`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${Ie} max=${Math.max(fo,a)} step="0.05" .value=${F(String(a))} aria-label="Glow size"
          style=${ye(a,Ie,Math.max(fo,a))}
          @input=${d=>{let h=Number(d.target.value);t.preview(p=>Le(p,i,{glow:h}))}}
          @change=${d=>n({glow:Number(d.target.value)})} />
        <span class="hme-val mono hme-w48">${a.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${l("By its brightness",e.glow===void 0,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${l("Follow the light",e.glowColor===void 0,()=>n({glowColor:null}))}
        ${l("Warm",e.glowColor==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${r!==void 0?"on":""}">${r===void 0?g:c`<span class="hme-swatch" style=${`background:${r}`}></span>`}Pick
          <input type="color" .value=${F(r??"#ffb648")} aria-label="Pick the glow's color"
            @change=${d=>n({glowColor:d.target.value})} /></label>
      </div></div>
      ${si(e.glowSpill===!0?"off":"on",d=>n({glowSpill:d?null:!0}))}
      ${K("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`)}groupInspector(t,e){let o=t.hass?.states,n=e.map(p=>p.id),i=p=>{t.apply(m=>Xt(m,n,p))||t.note("warn","That could not be set on every picked device.")},a=Math.max(2.5,...e.map(p=>ne(t.floor,p)?.height??2.5)),r=ge(e.map(p=>p.at[2])),l=ge(e.map(p=>p.reading)),d=e.every(p=>p.entityId.startsWith("light.")),h=Pt;return c`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${le("bulb","#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${C(e.length,"device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${H("Picked",c`${e.map(p=>c`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${()=>t.select({kind:"pin",pinId:p.id})}>${z(p,t.hass)}</button>
          <span class="hme-val">${Se(p.entityId,o)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${z(p,t.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>t.select(xt(t.selection,p.id))}>×</button></div>`)}`,String(e.length))}

      ${H("On the map",c`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${W({label:"None",picture:Te("none",h),on:!l.mixed&&l.value==="none",click:()=>i({reading:"none"})})}
          ${W({label:"Pill",picture:Te("pill",h),on:!l.mixed&&l.value===void 0,title:"Each one's reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>i({reading:null})})}
          ${W({label:"Name",picture:Te("name",h),on:!l.mixed&&l.value==="name",click:()=>i({reading:"name"})})}
        </div></div>
        ${l.mixed?K("Mixed: they show different things. Pick one to set them all."):g}`)}

      ${H("Height",c`
        <div class="hme-r">
          ${li({label:"Height",value:r.mixed?void 0:r.value,min:0,max:a,step:.05,preview:p=>t.preview(m=>xe(m,n,p)),set:p=>t.apply(m=>xe(m,n,p))})}
          ${_({label:"Height",value:r.mixed?void 0:r.value,unit:"m",min:0,max:100,width:"92px",set:p=>t.apply(m=>xe(m,n,p))})}
        </div>
        <div class="hme-chips">${mo.map(([p,m])=>c`<button type="button" class="hme-chip sel ${e.every(u=>Math.abs(u.at[2]-m)<.005)?"on":""}"
          @click=${()=>t.apply(u=>xe(u,n,m))}>${p} ${m}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${d?this.groupLightCard(t,e,i):g}

      ${this.groupTapCard(t,e,i)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(t,n)}}>Remove ${C(e.length,"device")} from the map</button></div>`}groupLightCard(t,e,o){let n=e.map(f=>f.id),i=this.states(t),a=e.map(f=>{let v=Y(f.entityId,i);return Math.round(Ne(f,v.kind==="light"&&v.on?v.brightness:void 0)*20)/20}),r=ge(a),l=Math.max(fo,...a),d=e.every(f=>f.glow===void 0),h=ge(e.map(f=>f.glowColor?.toLowerCase())),p=ge(e.map(f=>f.glowSpill===!0)),m=h.mixed||h.value===void 0||h.value==="warm"?void 0:h.value,u=(f,v,$)=>c`<button type="button" class="hme-chip sel ${v?"on":""}" aria-pressed=${v?"true":"false"} @click=${$}>${f}</button>`;return H("Light",c`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${li({label:"Glow size",value:r.mixed?void 0:r.value,min:Ie,max:l,step:.05,preview:f=>t.preview(v=>Xt(v,n,{glow:f})),set:f=>o({glow:f})})}
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
      ${si(p.mixed?"mixed":p.value?"off":"on",f=>o({glowSpill:f?null:!0}))}`)}groupTapCard(t,e,o){let n=ge(e.map(d=>[d.tap,d.tap==="page"?d.pageId?.toLowerCase():void 0])),i=n.mixed?void 0:n.value,a=i?.[0]==="page"||this.pickPage,r=i?.[0]==="page"?e[0].pageId:void 0,l=d=>{if(d==="page"){t.pages.length===1?o({tap:"page",pageId:t.pages[0].id}):(this.pickPage=!0,t.redraw());return}this.pickPage=!1,o({tap:d??null})};return H("Tap on the map",c`
      <div class="hme-chips">${co.map(([d,h])=>{let p=d==="page"?a:!this.pickPage&&i!==void 0&&i[0]===d;return c`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"}
          ?disabled=${d==="page"&&t.pages.length===0} title=${d==="page"&&t.pages.length===0?"Your library has no pages":""}
          @click=${()=>l(d)}>${h}</button>`})}</div>
      ${a?S("Page",ce({label:"Page",value:r??"",options:[...r===void 0?[{value:"",label:"Pick a page\u2026",disabled:!0}]:[],...r===void 0||t.pages.some(d=>x(d.id,r))?[]:[{value:r,label:"A page not in your library",disabled:!0}],...t.pages.map(d=>({value:d.id,label:d.name}))],set:d=>{this.pickPage=!1,d!==""&&o({tap:"page",pageId:d})}})):g}
      <p class="hme-text dim">${n.mixed&&!this.pickPage?"Mixed: a tap does different things on them. Pick one to set them all.":"Set on every picked device."}</p>`)}tapCard(t,e,o){let n=e.tap==="page"||this.pickPage,i=e.pageId===void 0||t.pages.some(r=>x(r.id,e.pageId)),a=r=>{if(r==="page"){if(e.tap==="page")return;t.pages.length===1?o({tap:"page",pageId:t.pages[0].id}):(this.pickPage=!0,t.redraw());return}this.pickPage=!1,o({tap:r??null})};return H("Tap on the map",c`
      <div class="hme-chips">${co.map(([r,l])=>{let d=r==="page"?n:!this.pickPage&&e.tap===r;return c`<button type="button" class="hme-chip sel ${d?"on":""}" aria-pressed=${d?"true":"false"}
          ?disabled=${r==="page"&&t.pages.length===0} title=${r==="page"&&t.pages.length===0?"Your library has no pages":""}
          @click=${()=>a(r)}>${l}</button>`})}</div>
      ${n?S("Page",ce({label:"Page",value:e.tap==="page"?e.pageId??"":"",options:[...e.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...i?[]:[{value:e.pageId,label:"A page not in your library",disabled:!0}],...t.pages.map(r=>({value:r.id,label:r.name}))],set:r=>{this.pickPage=!1,r!==""&&o({tap:"page",pageId:r})}})):g}
      <p class="hme-text dim">${e.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":"Hold on the watch or iPhone: its controls."}</p>`)}overview(t){let e=Pe(t.selection),o=e===void 0?void 0:t.floor.rooms.find(a=>x(a.id,e)),n=o===void 0?t.floor.pins:we(t.floor,o.id),i=t.hass?.states;return c`${H(o===void 0?"Devices":D(o),c`
        <p class="hme-text">${o===void 0?`${C(t.floor.pins.length,"device")} on this floor.`:`${C(n.length,"device")} in this room.`}</p>
        ${n.map(a=>c`<button type="button" class="hme-list-row" @click=${()=>t.select({kind:"pin",pinId:a.id})}>
          <span class="hme-grow">${z(a,t.hass)}</span><span class="hme-val">${Se(a.entityId,i)}</span></button>`)}`)}
      ${H("Devices",c`<p class="hme-text">Pick a device on the plan to set its name, icon, height, glow and what a tap on it does.</p>
        <p class="hme-text dim">Drag a device from Not on the map onto the plan to place it. Drag a pin to move it; arrow keys nudge it, Delete takes it off the map.</p>
        <p class="hme-text dim">Shift, Cmd or Ctrl and a click picks several; Shift and a drag over empty space picks every device in the box. Then drag one to move them all, or set them together.</p>`)}`}};function si(s,t){let e=s==="on"?"walls stop the glow":s==="off"?"the glow spreads past the walls":"some stay in, some spread";return c`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${s==="mixed"?c`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${()=>t(!0)}>Mixed</button>`:Be({on:s==="on",onText:"On",offText:"Off",label:"Stay in room",click:()=>t(s!=="on")})}
    <span class="hme-text dim">${e}</span></div>`}function li(s){let t=s.value??(s.min+s.max)/2;return c`<input class="hme-range ${s.value===void 0?"mixed":""}" type="range" min=${s.min} max=${s.max} step=${s.step} .value=${F(String(t))}
    aria-label=${s.label} aria-valuetext=${s.value===void 0?"Mixed":g} style=${s.value===void 0?"--p:0%":ye(s.value,s.min,s.max)}
    @input=${e=>{let o=e.target;o.classList.remove("mixed"),s.preview(Number(o.value))}}
    @change=${e=>s.set(Number(e.target.value))} />`}function Te(s,t){return c`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${s==="none"?20:16} r="9" fill=${t} />
    ${s==="pill"?y`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:g}
    ${s==="name"?y`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:g}
  </svg>`}var mi=[{id:"select",label:"Walls and corners",key:"v"},{id:"draw",label:"Draw a room",key:"r"},{id:"split",label:"Split a room",key:"s"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"opening",label:"Way through (no door)",key:"o"},{id:"stairs",label:"Stairs",key:"t"}];function Ai(s){return mi.find(t=>t.key===s.toLowerCase())?.id}var Li=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],Fi=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function zi(s){return s===2?"Fix both":`Fix all ${Fi[s]??s}`}var Ni=9,di=18,go="#4fd6c2",Ki="Draw each room faint and dashed as the iPhone scanned it, or as first seen for a room scanned before scans were kept. A room drawn here has none.",Gi="Put this room's walls, doors, windows and furniture back as the iPhone scanned it. Its devices stay where they are.",b=s=>s.toFixed(1),te=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,pi=new WeakMap;function St(s){let t=pi.get(s);return t===void 0&&pi.set(s,t=hn(s)),t}function vo(s,t,e,o){let n=e/s.view.scale,i=a=>{let r;for(let l of a)for(let[d,h]of G(l).entries()){let p=No(t,h);p<=n&&(r===void 0||p<r.d)&&(r={room:l,wall:d,seg:h,d:p})}return r};return(o===void 0?void 0:i([o]))??i(s.floor.rooms)}function hi(s,t){let e=Math.max(ie(t),1e-9),o=[-(t.b[1]-t.a[1])/e,(t.b[0]-t.a[0])/e],n=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],i=B(s)??oe(s);return(i[0]-n[0])*o[0]+(i[1]-n[1])*o[1]>0&&(o=[-o[0],-o[1]]),o}var Tt=class{constructor(){this.id="shape";this.tool="select";this.draw=new Ee(ue);this.dragging=!1}setTool(t,e){this.first=void 0,e==="draw"?this.draw.start(t):this.draw.stop(),this.tool=e,t.redraw()}focus(t){let e=Pe(t.selection);return e===void 0?void 0:t.floor.rooms.find(o=>x(o.id,e))}pickedWall(t,e){let o=t.selection;if(!(e===void 0||o===void 0)){if(o.kind==="wall")return o.wall;if(o.kind==="opening"){let n=e.openings[o.opening],i=n===void 0?-1:st(e,n);return i>=0?i:void 0}}}rail(t){let e=St(t.floor),o=t.floor.id;return c`
      <section class="hme-card hme-tools">
        <div class="hme-h">Tools</div>
        ${mi.map((n,i)=>c`${i===4?c`<div class="hme-sep"></div>`:g}
          <button type="button" class="hme-tool ${this.tool===n.id?"on":""}" aria-pressed=${this.tool===n.id?"true":"false"}
            @click=${()=>this.setTool(t,n.id)}>${Wi[n.id]}${n.label}<kbd>${n.key.toUpperCase()}</kbd></button>`)}
      </section>
      ${H("Scan check",c`
        ${e.length===0?c`<p class="hme-text dim">Nothing to fix. The walls meet and every room has a way in.</p>`:g}
        ${e.map(n=>c`<div class="hme-fix">
          <span class="hme-fix-dot ${n.kind==="missingDoor"?"gray":""}"></span>
          <p @click=${()=>t.select({kind:"room",roomId:n.roomIds[0]})}><b>${n.title}</b> ${n.detail}</p>
          <button type="button" class="hme-tb" @click=${()=>t.apply(i=>n.fix(i))}>${n.fixLabel}</button></div>`)}
        ${e.length>1?c`<button type="button" class="hme-tb hme-wide" @click=${()=>t.apply(n=>mn(n,o))}>${zi(e.length)}</button>`:g}`,e.length===0?void 0:c`<span class="hme-amber">${e.length} to fix</span>`)}`}overlay(t){if(this.tool==="draw")return this.draw.overlay(t);let e=this.focus(t),o=[];if(e!==void 0&&e.outline.length>=3){let n=e.outline.map(i=>te(t.toScreen(i))).join("L");o.push(y`<path d=${`M0 0H${t.stage.width}V${t.stage.height}H0ZM${n}Z`} fill="rgba(0,0,0,0.45)" fill-rule="evenodd" pointer-events="none" />`)}return t.toggles.scan&&o.push(...this.scanMarks(t)),o.push(...this.issueMarks(t)),e!==void 0&&o.push(this.roomHandles(t,e)),o.push(...this.toolGhost(t)),y`${o}`}scanMarks(t){return fn(t.floor,t.scans).map(e=>{let o=e.outline.map(i=>te(t.toScreen(i))).join("L"),n=e.walls.map(i=>`M${te(t.toScreen(i.a))}L${te(t.toScreen(i.b))}`).join("");return y`<g class="hme-scan" data-room=${e.roomId} pointer-events="none">
        <path d=${`M${o}Z`} fill=${go} fill-opacity="0.06" stroke="none" />
        <path d=${n} fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="3.5" stroke-dasharray="7 5" />
        <path d=${n} fill="none" stroke=${go} stroke-width="1.6" stroke-dasharray="7 5" stroke-opacity="0.9" />
        ${e.openings.map(i=>{let a=t.toScreen(i.a),r=t.toScreen(i.b);return y`<line x1=${b(a[0])} y1=${b(a[1])} x2=${b(r[0])} y2=${b(r[1])} stroke=${go} stroke-width="4" stroke-opacity="0.85"
            stroke-dasharray=${i.kind==="window"?"2 3":"none"} />`})}
      </g>`})}issueMarks(t){return St(t.floor).map(e=>{let[o,n]=t.toScreen(e.where);if(e.kind==="offSquare"){let d=/(\d+)°/.exec(e.title)?.[1]??"";return y`<g class="hme-issue" data-hme=${`issue:${e.id}`} style="cursor:pointer"><title>${e.title} Click to square it.</title>
          <circle cx=${b(o)} cy=${b(n)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${b(o+12)} y=${b(n+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${b(o+34)} y=${b(n+20)} fill="#2a1a00" text-anchor="middle">${d}°</text></g></g>`}let i=`${Math.round(e.amount*100)} cm`,a=e.kind==="overlap"?`Overlap ${i} \xB7 ${e.fixLabel}`:e.kind==="gap"?`Gap ${i} \xB7 ${e.fixLabel}`:`No door \xB7 ${e.fixLabel}`,r=a.length*6.2+18,l=e.kind==="missingDoor";return y`<g class="hme-issue" data-hme=${`issue:${e.id}`} style="cursor:pointer"><title>${e.title} ${e.detail}</title>
        <circle cx=${b(o)} cy=${b(n)} r="4" fill=${l?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${b(o-r/2)} y=${b(n+8)} width=${b(r)} height="20" rx="10" fill=${l?"#8e8e93":"#ffb340"} />
        <text x=${b(o)} y=${b(n+22)} fill=${l?"#fff":"#2a1a00"} text-anchor="middle">${a}</text></g></g>`})}roomHandles(t,e){let o=G(e),n=t.selection,i=this.pickedWall(t,e),a=[];if(i!==void 0&&o[i]!==void 0){let l=o[i],d=t.toScreen(l.a),h=t.toScreen(l.b),p=hi(e,l);if(a.push(y`<line x1=${b(d[0])} y1=${b(d[1])} x2=${b(h[0])} y2=${b(h[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),n?.kind==="wall"&&!this.dragging){let m=[(d[0]+h[0])/2+p[0]*22,(d[1]+h[1])/2+p[1]*22];a.push(y`<g class="hme-tag" pointer-events="none"><rect x=${b(m[0]-27)} y=${b(m[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${b(m[0])} y=${b(m[1]+4)} fill="#fff" text-anchor="middle">${ie(l).toFixed(2)} m</text></g>`)}}for(let[l,d]of e.openings.entries()){let h=t.toScreen(d.a),p=t.toScreen(d.b),m=n?.kind==="opening"&&n.opening===l,u=d.kind==="window"?"#8bb8f0":d.kind==="door"?"#ece6da":"#98989d";a.push(y`<g data-hme=${`opening:${l}`} style="cursor:ew-resize">
        <line x1=${b(h[0])} y1=${b(h[1])} x2=${b(p[0])} y2=${b(p[1])} stroke=${m?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${b(h[0])} y1=${b(h[1])} x2=${b(p[0])} y2=${b(p[1])} stroke=${u} stroke-width="3" />
        ${m?y`<circle cx=${b(h[0])} cy=${b(h[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" /><circle cx=${b(p[0])} cy=${b(p[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" />`:g}
      </g>`)}let r=this.sliding!==void 0&&x(this.sliding.roomId,e.id)?this.sliding.index:n?.kind==="opening"?n.opening:void 0;if(r!==void 0&&e.openings[r]!==void 0&&a.push(this.distances(t,e,e.openings[r])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[l,d]of o.entries()){if(ie(d)*t.view.scale<40)continue;let h=t.toScreen([(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2]);a.push(y`<circle data-hme=${`mid:${l}`} cx=${b(h[0])} cy=${b(h[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[l,d]of e.outline.entries()){let[h,p]=t.toScreen(d),m=n?.kind==="corner"&&n.corner===l;a.push(y`<circle data-hme=${`corner:${l}`} cx=${b(h)} cy=${b(p)} r="7" fill=${m?"#5b8def":"#fff"} stroke=${m?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return y`<g class="hme-handles">${a}</g>`}distances(t,e,o){let n=st(e,o),i=n>=0?G(e)[n]:void 0;if(i===void 0)return y``;let a=ie(i),r=re(o.a,i.a,i.b).along,l=re(o.b,i.a,i.b).along,d=Math.max(0,Math.min(r,l)),h=Math.min(a,Math.max(r,l)),p=hi(e,i),m=[(i.b[0]-i.a[0])/a,(i.b[1]-i.a[1])/a],u=w=>{let M=t.toScreen([i.a[0]+m[0]*w,i.a[1]+m[1]*w]);return[M[0]+p[0]*26,M[1]+p[1]*26]},f=[0,d,h,a],v=w=>`M${te([w[0]-p[0]*5,w[1]-p[1]*5])}L${te([w[0]+p[0]*5,w[1]+p[1]*5])}`,$=[[0,d,!1],[d,h,!0],[h,a,!1]];return y`<g class="hme-dist" pointer-events="none">
      <path d=${`M${te(u(0))}L${te(u(a))}${f.map(w=>v(u(w))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${$.filter(([w,M])=>M-w>.02).map(([w,M,I])=>{let P=u((w+M)/2);return y`<g class="hme-tag"><rect x=${b(P[0]-25)} y=${b(P[1]-9)} width="50" height="18" rx="9" fill=${I?"#5b8def":"#2c2c2e"} />
          <text x=${b(P[0])} y=${b(P[1]+4)} fill="#fff" text-anchor="middle">${(M-w).toFixed(2)} m</text></g>`})}
    </g>`}toolGhost(t){let e=this.hoverAt;if(e===void 0)return[];let o=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let n=vo(t,e,di,this.focus(t));if(n!==void 0){let i=this.tool==="window"?1.2:.9,a=ie(n.seg),r=Math.min(i,a),l=Math.min(Math.max(re(e,n.seg.a,n.seg.b).along,r/2),a-r/2),d=[(n.seg.b[0]-n.seg.a[0])/a,(n.seg.b[1]-n.seg.a[1])/a],h=t.toScreen([n.seg.a[0]+d[0]*(l-r/2),n.seg.a[1]+d[1]*(l-r/2)]),p=t.toScreen([n.seg.a[0]+d[0]*(l+r/2),n.seg.a[1]+d[1]*(l+r/2)]);o.push(y`<line x1=${b(h[0])} y1=${b(h[1])} x2=${b(p[0])} y2=${b(p[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&V(t.floor,e)!==void 0){let[n,i]=t.toScreen(e),a=t.px(1),r=t.px(2.6);o.push(y`<g pointer-events="none" opacity="0.7"><rect x=${b(n-a/2)} y=${b(i-r/2)} width=${b(a)} height=${b(r)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(l=>y`<line x1=${b(n-a/2)} x2=${b(n+a/2)} y1=${b(i-r/2+r*l/8)} y2=${b(i-r/2+r*l/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let n=t.toScreen(this.first.a),i=t.toScreen(this.snap(t,e,this.first.a));if(this.tool==="split"){let a=Math.max(Math.hypot(i[0]-n[0],i[1]-n[1]),1e-6),r=[(i[0]-n[0])/a,(i[1]-n[1])/a],l=Math.hypot(t.stage.width,t.stage.height);o.push(y`<line x1=${b(n[0]-r[0]*l)} y1=${b(n[1]-r[1]*l)} x2=${b(n[0]+r[0]*l)} y2=${b(n[1]+r[1]*l)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else o.push(y`<line x1=${b(n[0])} y1=${b(n[1])} x2=${b(i[0])} y2=${b(i[1])} stroke="#ece6da" stroke-width=${b(Math.max(t.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);o.push(y`<circle cx=${b(n[0])} cy=${b(n[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return o}snap(t,e,o){return lo(t.floor,e,t.view.scale,{...o===void 0?{}:{from:o},...t.toggles.grid?{grid:ue}:{}})}pointerDown(t,e,o){if(this.tool==="draw")return this.draw.pointerDown(t,e,o);if(e.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let n=vo(t,o,di,this.focus(t));if(n===void 0)return!1;let i=this.tool,a=n.room.id,r=n.room.openings.length,l=n.wall;return t.apply(d=>pt(d,a,l,{kind:i,at:o}),{select:{kind:"opening",roomId:a,opening:r}})&&this.setTool(t,"select"),!0}case"stairs":{let n=V(t.floor,o);if(n===void 0)return!1;let i=n.id;return t.apply(a=>nn(a,i,o),{select:{kind:"room",roomId:i}})&&this.setTool(t,"select"),!0}case"split":case"inner":return this.twoPoints(t,o);default:return this.pick(t,e,o)}}twoPoints(t,e){if(this.first===void 0){let a=V(t.floor,e)??this.focus(t);return a===void 0?!1:(this.first={roomId:a.id,a:this.snap(t,e)},t.select({kind:"room",roomId:a.id}),!0)}let{roomId:o,a:n}=this.first,i=this.snap(t,e,n);if(this.first=void 0,Math.hypot(i[0]-n[0],i[1]-n[1])<.1)return t.redraw(),!0;if(this.tool==="inner"){let a=t.doc.floors.flatMap(l=>l.rooms).find(l=>x(l.id,o)),r=a===void 0?0:Lt(a).length;return t.apply(l=>dn(l,o,n,i),{select:{kind:"wall",roomId:o,wall:r}})?this.setTool(t,"select"):t.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(t,o,n,i),!0}async split(t,e,o,n){let i=t.floor.rooms.find(l=>x(l.id,e)),a=await t.ask({title:"Name the new room",label:"Name",value:i===void 0?"Room":`${D(i)} 2`,ok:"Split the room"});if(a===void 0)return;let r=t.newId();t.apply(l=>pn(l,e,o,n,r,a),{select:{kind:"room",roomId:r}})?this.setTool(t,"select"):t.note("err","That line does not cut the room in two. Draw it right across the room.")}pick(t,e,o){let n=this.focus(t),i=e.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[a,r]=i.split(/:(.*)/s);if(a==="issue"){let p=St(t.floor).find(m=>m.id===r);return p!==void 0&&t.apply(m=>p.fix(m)),!0}let l=Number(r);if(n!==void 0&&a==="corner"&&Number.isInteger(l))return this.cornerDrag(t,e,n,l),!0;if(n!==void 0&&a==="mid"&&Number.isInteger(l))return this.midDrag(t,e,n,l),!0;if(n!==void 0&&a==="opening"&&Number.isInteger(l))return this.openingDrag(t,e,n,l),!0;let d=vo(t,o,Ni,n);if(d!==void 0)return this.wallAt=re(o,d.seg.a,d.seg.b).point,t.select({kind:"wall",roomId:d.room.id,wall:d.wall}),!0;let h=V(t.floor,o);return h===void 0?!1:(t.select({kind:"room",roomId:h.id}),!0)}cornerTo(t,e,o,n){let i=t.floor.rooms.filter(l=>!x(l.id,e.id)).flatMap(l=>l.outline),a=10/t.view.scale;for(let l of i)if(Math.hypot(l[0]-n[0],l[1]-n[1])<=a)return[l[0],l[1]];let r=n;if(t.toggles.grid&&(r=[Math.round(r[0]/ue)*ue,Math.round(r[1]/ue)*ue]),t.toggles.square){let l=Go(t.floor.rooms.flatMap($=>Lt($))),d=Math.cos(l),h=Math.sin(l),p=$=>[$[0]*d+$[1]*h,-$[0]*h+$[1]*d],[m,u]=p(r),f=e.outline.length,v=8/t.view.scale;for(let $ of[(o+f-1)%f,(o+1)%f]){let[w,M]=p(e.outline[$]);Math.abs(m-w)<=v&&(m=w),Math.abs(u-M)<=v&&(u=M)}r=[m*d-u*h,m*h+u*d]}return r}cornerDrag(t,e,o,n){let i=o.id,a;t.drag(e,{move:r=>{this.dragging=!0;let l=this.cornerTo(t,o,n,r);a=l,t.preview(d=>ke(d,i,n,l))},end:(r,l,d)=>{this.dragging=!1,t.preview(void 0);let h=a,p={kind:"corner",roomId:i,corner:n};d&&h!==void 0?t.apply(m=>ke(m,i,n,h),{select:p}):t.select(p)},cancel:()=>this.stopDrag(t)})}midDrag(t,e,o,n){let i=o.id,a=G(o)[n],r=lt(t.doc,i,n),l=r?.floors.flatMap(u=>u.rooms).find(u=>x(u.id,i));if(a===void 0||r===void 0||l===void 0)return;let d=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],h=l.outline.reduce((u,f,v)=>Math.hypot(f[0]-d[0],f[1]-d[1])<Math.hypot(l.outline[u][0]-d[0],l.outline[u][1]-d[1])?v:u,0),p=u=>f=>{let v=lt(f,i,n);return v===void 0||u===void 0?v:ke(v,i,h,u)},m;t.drag(e,{move:u=>{this.dragging=!0,m=this.cornerTo(t,l,h,u),t.preview(p(m))},end:(u,f,v)=>{this.dragging=!1,t.preview(void 0),t.apply(p(v?m:void 0),{select:{kind:"corner",roomId:i,corner:h}})},cancel:()=>this.stopDrag(t)})}openingDrag(t,e,o,n){let i=o.id,a=o.openings[n];if(a===void 0)return;let r={kind:"opening",roomId:i,opening:n},l=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],d,h;t.select(r),t.drag(e,{move:p=>{d??=p,this.dragging=!0,this.sliding={roomId:i,index:n};let m=[l[0]+p[0]-d[0],l[1]+p[1]-d[1]];h=m,t.preview(u=>Bt(u,i,n,m))},end:(p,m,u)=>{this.dragging=!1,this.sliding=void 0,t.preview(void 0);let f=h;u&&f!==void 0&&t.apply(v=>Bt(v,i,n,f),{select:r})},cancel:()=>this.stopDrag(t)})}stopDrag(t){this.dragging=!1,this.sliding=void 0,t.preview(void 0)}hover(t,e){if(this.tool==="draw"){this.draw.hover(t,e);return}this.tool!=="select"&&(this.hoverAt=e,t.redraw())}keyDown(t,e){if(this.tool==="draw"&&this.draw.active&&(e.key==="Enter"||e.key==="Backspace"||e.key==="Delete"))return this.draw.keyDown(t,e);let o=Q(e,!1);if(typeof o=="object"&&"letter"in o){let n=Ai(o.letter);return n===void 0?!1:(this.setTool(t,n),!0)}if(o==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(t,"select"),!0;if(o==="delete"){let n=t.selection;if(n?.kind==="corner")t.apply(i=>dt(i,n.roomId,n.corner),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="opening")t.apply(i=>ht(i,n.roomId,n.opening),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="wall")t.apply(i=>jt(i,n.roomId,n.wall),{select:{kind:"room",roomId:n.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(t){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.draw.stop(),this.tool="select",t.redraw()}dock(t){return c`<button type="button" class="hme-tb ${t.toggles.square?"on":""}" aria-pressed=${t.toggles.square?"true":"false"}
        title="A dragged corner lines up with the corners beside it" @click=${()=>t.setToggle("square",!t.toggles.square)}>Snap to 90°</button>
      <button type="button" class="hme-tb ${t.toggles.grid?"on":""}" aria-pressed=${t.toggles.grid?"true":"false"}
        @click=${()=>t.setToggle("grid",!t.toggles.grid)}>Grid 5 cm</button>
      ${t.scans===void 0?g:c`<button type="button" class="hme-tb ${t.toggles.scan?"on":""}" aria-pressed=${t.toggles.scan?"true":"false"}
        title=${Ki} @click=${()=>t.setToggle("scan",!t.toggles.scan)}>Show scan as it was</button>`}`}pill(t){if(this.tool==="draw")return c`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?c`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(t)}}>Close the room</button>`:g}
        <button type="button" class="hme-tb" @click=${()=>this.setTool(t,"select")}>Cancel</button>`;if(this.tool!=="select"){let a={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in a room to put stairs there"};return c`<span class="hme-pill-name">${a[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(t,"select")}>Cancel</button>`}let e=this.focus(t),o=t.selection;if(e===void 0||o===void 0||this.dragging)return g;let n=e.id,i=D(e);if(o.kind==="wall"){let a=o.wall,r=this.wallAt,l=no(e,a,i).replace(", "," \xB7 ");return c`<span class="hme-pill-name">${l}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(t,e,a,"window",r)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(t,e,a,"door",r)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(t,e,a,r)}>Add a corner</button>
        <button type="button" class="hme-tb" @click=${()=>t.apply(d=>Wt(d,n,a))}>Straighten</button>`}if(o.kind==="corner")return c`<span class="hme-pill-name">${i} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${e.outline.length<=3} @click=${()=>t.apply(a=>dt(a,n,o.corner),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>t.apply(a=>Z(a,n))}>Square the corners</button>`;if(o.kind==="opening"){let a=e.openings[o.opening];return a===void 0?g:c`<span class="hme-pill-name">${he(a)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>t.apply(r=>ht(r,n,o.opening),{select:{kind:"room",roomId:n}})}>Remove</button>`}return c`<span class="hme-pill-name">${i}</span>
      <button type="button" class="hme-tb" @click=${()=>t.apply(a=>Z(a,n))}>Square the corners</button>`}addHere(t,e,o,n,i){let a=e.id,r=e.openings.length;t.apply(l=>pt(l,a,o,{kind:n,...i===void 0?{}:{at:i}}),{select:{kind:"opening",roomId:a,opening:r}})}cornerHere(t,e,o,n){let i=e.id,a=p=>lt(p,i,o,n),r=a(t.doc)?.floors.flatMap(p=>p.rooms).find(p=>x(p.id,i)),l=G(e)[o],d=n??(l===void 0?void 0:[(l.a[0]+l.b[0])/2,(l.a[1]+l.b[1])/2]),h=r===void 0||d===void 0?-1:r.outline.reduce((p,m,u)=>Math.hypot(m[0]-d[0],m[1]-d[1])<Math.hypot(r.outline[p][0]-d[0],r.outline[p][1]-d[1])?u:p,0);t.apply(a,{select:h<0?{kind:"room",roomId:i}:{kind:"corner",roomId:i,corner:h}})}inspector(t){let e=this.focus(t),o=t.selection;if(e===void 0||o===void 0){let p=St(t.floor);return H("Shape",c`<p class="hme-text">Pick a room, then a wall or a corner. Drag a corner to move it; a corner two rooms share moves for both.</p>
        <p class="hme-text dim">${p.length===0?"The scan check found nothing to fix on this floor.":`The scan check found ${C(p.length,"thing")} to fix. They are marked in amber.`}</p>`)}let n=e.id;if(o.kind==="corner")return this.cornerCard(t,e,o.corner);let i=this.pickedWall(t,e);if(i===void 0){let p=Po(t.scans,n),m=p!==void 0&&cn(e,p)?p:void 0;return H(D(e),c`
        ${S("Corners",c`<span class="hme-val">${e.outline.length}</span>`)}
        ${S("Walls",c`<span class="hme-val">${G(e).length}</span>`)}
        ${S("Wall height",_({label:"Wall height",value:e.height,unit:"m",min:.5,max:20,set:u=>t.apply(f=>_e(f,n,u))}))}
        ${K("Click a wall to change it or put a door or window in it. Drag a corner to move it, or the dot in a wall's middle to add a corner.")}
        ${m===void 0?g:K("Its shape has changed since the iPhone scanned it.")}
        <div class="hme-row-end">
          ${m===void 0?g:c`<button type="button" class="hme-tb" title=${Gi} @click=${()=>t.apply(u=>un(u,n,m))}>Back to the scan</button>`}
          <button type="button" class="hme-tb" @click=${()=>t.apply(u=>Z(u,n))}>Square the corners</button>
        </div>`)}let a=G(e)[i],r=e.openings.map((p,m)=>({o:p,i:m})).filter(({o:p})=>st(e,p)===i),l=o.kind==="opening"?e.openings[o.opening]:void 0,d=ie(a),h=p=>{let m=e.openings.length;t.apply(u=>pt(u,n,i,{kind:p}),{select:{kind:"opening",roomId:n,opening:m}})};return c`
      ${H("Wall",c`
        ${S("Room",c`<span class="hme-val strong">${no(e,i,D(e))}</span>`)}
        ${S("Length",_({label:"Length",value:d,unit:"m",min:.1,max:200,set:p=>t.apply(m=>sn(m,n,i,p))}))}
        ${S("Thickness",_({label:"Thickness",value:a.t,unit:"m",min:.01,max:1,set:p=>t.apply(m=>ln(m,n,i,p))}))}
        ${S("Height",_({label:"Wall height",value:e.height,unit:"m",min:.5,max:20,set:p=>t.apply(m=>_e(m,n,p))}))}
        ${K("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-row-end indent">
          <button type="button" class="hme-tb" @click=${()=>t.apply(p=>Wt(p,n,i))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>t.apply(p=>Z(p,n))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(t,e,i,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>t.apply(p=>jt(p,n,i),{select:{kind:"room",roomId:n}})}>Remove</button>
        </div>`)}
      ${H("On this wall",c`
        ${r.map(({o:p,i:m})=>{let u=re(p.a,a.a,a.b).along,f=re(p.b,a.a,a.b).along,v=o.kind==="opening"&&o.opening===m;return c`<button type="button" class="hme-list-row ${v?"on":""}" @click=${()=>t.select({kind:"opening",roomId:n,opening:m})}>
            <span class="hme-grow">${he(p)}</span><span class="mono dim">${to(Math.abs(f-u))} · ${to(Math.max(0,Math.min(u,f)))} in</span></button>`})}
        ${r.length===0?c`<p class="hme-empty-line">Nothing on this wall.</p>`:g}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>h("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>h("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>h("opening")}>＋ Way through</button>
        </div>`)}
      ${l===void 0||o.kind!=="opening"?g:this.openingCard(t,e,o.opening,l)}`}openingCard(t,e,o,n){let i=e.id,a=Math.hypot(n.b[0]-n.a[0],n.b[1]-n.a[1]),r=n.z1-n.z0;return H(he(n),c`
      <div class="hme-pics">${Li.map(l=>W({label:l.label,picture:ji[l.label],on:n.kind===l.kind&&n.style===l.style,click:()=>t.apply(d=>Ae(d,i,o,{kind:l.kind,style:l.style??null}))}))}</div>
      ${S("Width",_({label:"Width",value:a,unit:"m",min:.1,max:20,set:l=>t.apply(d=>Ae(d,i,o,{width:l}))}))}
      ${S("From floor",_({label:"From floor",value:n.z0,unit:"m",min:0,max:20,set:l=>t.apply(d=>Ae(d,i,o,{z0:l,z1:l+r}))}),c`<span class="hme-l short">Tall</span>`,_({label:"Tall",value:r,unit:"m",min:.05,max:20,set:l=>t.apply(d=>Ae(d,i,o,{z1:n.z0+l}))}))}
      ${K("Drag it along the wall. The plan shows the space to each corner.")}
      <div class="hme-row-end indent"><button type="button" class="hme-tb danger" @click=${()=>t.apply(l=>ht(l,i,o),{select:{kind:"room",roomId:i}})}>Remove ${he(n).toLowerCase()}</button></div>`)}cornerCard(t,e,o){let n=e.id,i=e.outline[o];if(i===void 0)return c``;let a=t.floor.rooms.filter(r=>!x(r.id,n)&&r.outline.some(l=>Math.hypot(l[0]-i[0],l[1]-i[1])<=.02));return H("Corner",c`
      ${S("Room",c`<span class="hme-val strong">${D(e)}</span>`)}
      ${S("Left, top",_({label:"Corner left",value:i[0],unit:"m",set:r=>t.apply(l=>ke(l,n,o,[r,i[1]]))}),_({label:"Corner top",value:i[1],unit:"m",set:r=>t.apply(l=>ke(l,n,o,[i[0],r]))}))}
      ${K(a.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${a.map(D).join(", ")}, which move${a.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${e.outline.length<=3} @click=${()=>t.apply(r=>dt(r,n,o),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>t.apply(r=>Z(r,n))}>Square the corners</button>
      </div>`)}},Wi={select:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,draw:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`,split:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},ji={Door:c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var It={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function Bi(s,t){if(!ct(s))return"Home style";let e=qt(s,t),o=i=>Object.hasOwn(s,$n[i]),n=[];return o("look")&&n.push(It[e.look].title),o("turn")&&n.push(`turned ${e.turn}\xB0`),o("names")&&n.push(e.names?"room names":"no room names"),o("devices")&&n.push(e.devices==="all"?"every device":e.devices==="none"?"no devices":"lights only"),o("furniture")&&n.push(e.furniture?"furniture":"no furniture"),o("glow")&&n.push(e.glow?"glow":"no glow"),`Own look: ${n.join(", ")}`}var ci=(s,t)=>typeof s=="number"&&Number.isFinite(s)?s:t;function Vi(s,t){let e=Ao(s);return _o(s).flatMap(o=>{if(_t(nt(o))!=="home_map")return[];let n=o,i=Lo(nt(o)),a=t?.floors.find(m=>x(m.id,i)),r=typeof n.homeMapRoomId=="string"?n.homeMapRoomId:void 0,l=r===void 0?void 0:a?.rooms.find(m=>x(m.id,r)),d=`${ci(o.colSpan,1)}\xD7${ci(o.rowSpan,1)}`,p=(typeof o.customLabel=="string"&&o.customLabel.trim()!==""?o.customLabel.trim():void 0)??(l?.name?.trim()?`${l.name.trim()} only`:a===void 0||(t?.floors.length??0)<=1?"Home map":L(a));return[{pageId:e,pageName:ot(s),tileId:typeof o.id=="string"?o.id:"",what:p,size:d,own:ct(n),words:Bi(n,t),look:qt(n,t).look}]})}function ui(s,t){return Object.values(s?.pages??{}).map(o=>o?.item).filter(o=>tt(o)).sort((o,n)=>ot(o).localeCompare(ot(n))).flatMap(o=>Vi(o,t))}function fi(s){let t=!1;if(!Array.isArray(s.pages))return;let e=s.pages.map(o=>{if(!tt(o)||!Array.isArray(o.items))return o;let n=o.items.map(i=>!tt(i)||_t(nt(i))!=="home_map"||!ct(i)?i:(t=!0,kn(i)));return{...o,items:n}});return t?{...s,pages:e}:void 0}var Ct={width:112,height:68},Ui={width:94,height:94,radius:34},Xi={width:188,height:94,radius:22},qi={width:60,height:94,radius:18},Yi=1.6,Rt=class{constructor(){this.id="style";this.usesState="idle";this.busy=!1}style(t){let e=Fe(t.doc);return this.turnLive===void 0?e:{...e,turn:this.turnLive}}set(t,e){t.apply(o=>Mn(o,e))}rail(t){let e=this.style(t),o=t.hass?.states;return c`<div class="hme-h hme-pad">Looks</div>
      <div class="hme-looks">
        ${ko.map(n=>{let i=n===e.look,a=pe({floor:t.floor,states:o,...e,look:n,names:!1,width:Ct.width,height:Ct.height});return c`<button type="button" class="hme-look ${i?"on":""}" aria-pressed=${i?"true":"false"} @click=${()=>this.set(t,{look:n})}>
            <svg viewBox=${`0 0 ${Ct.width} ${Ct.height}`} style=${`background:${de(n,.5)}`} aria-hidden="true">${a}</svg>
            <span>${It[n].title}</span></button>`})}
      </div>
      <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`}stage(t){let e=this.style(t),o=He.includes(e.look),n=It[e.look],{width:i,height:a}=t.stage,r=Math.min(Math.max(i/760,1),2.6),l=Math.max(i/r,1),d=Math.max(a/r,1),h=i<=0?g:pe({floor:t.floor,states:t.hass?.states,...e,width:Math.max(l-48,1),height:Math.max(d-96,1),tileHeight:d,icons:t.icons});return c`<div class="hme-style-col">
      <div class="hme-stage hme-style-big ${o?"turns":""}" style=${`background:${de(e.look,r)}`}
        @pointerdown=${p=>{o&&this.turnDrag(t,p,e.turn)}}>
        <div class="hme-style-title" style=${`color:${ft(e.look)}`}><strong>${n.title}</strong><span>${n.hint}</span></div>
        <svg class="hme-svg" viewBox=${`0 0 ${l.toFixed(1)} ${d.toFixed(1)}`} role="img" aria-label=${`The floor in the ${n.title} look`}>
          <g transform="translate(24 64)">${h}</g></svg>
        ${o?c`<span class="hme-style-turn" style=${`color:${ft(e.look)}`}>Drag to turn · ${e.turn}°</span>`:g}
      </div>
      <section class="hme-card hme-style-tiles">
        ${this.face(t,e,Ui,"Watch tile 2 \xD7 2",!0)}
        ${this.face(t,e,Xi,"iPhone tile 4 \xD7 2",!0)}
        ${this.face(t,e,qi,"iPhone full map",!1)}
      </section>
    </div>`}face(t,e,o,n,i){let a=Math.min(Math.max(t.stage.width/1100,Yi),2.6),r=t.hass?.states,l=i?Sn(o.width,o.height):{x:4,y:4,width:o.width-8,height:o.height-8},d=pe({floor:t.floor,states:r,...e,width:l.width,height:l.height,tileHeight:i?o.height:0,icons:t.icons}),h=Je(t.floor,r),p=6*a;return c`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${o.width*a}px;height:${o.height*a}px;border-radius:${o.radius}px;background:${de(e.look,a)}`}>
        <svg viewBox=${`0 0 ${l.width} ${l.height}`} aria-hidden="true"
          style=${`left:${l.x*a}px;top:${l.y*a}px;width:${l.width*a}px;height:${l.height*a}px`}>${d}</svg>
        ${i&&o.height>90?c`<span class="hme-face-title" style=${`left:${p}px;top:${p}px;font-size:${11*a}px;color:${ft(e.look)}`}>${Zi(t.floor)}</span>`:g}
        ${i?c`<span class="hme-face-words" style=${`left:${p}px;bottom:${p}px;font-size:${10*a}px;color:${En(e.look,h>0)}`}>${Qe(h)}</span>`:g}
      </div>
      <figcaption>${n}</figcaption>
    </figure>`}turnDrag(t,e,o){if(e.button!==0)return;let n=e.currentTarget,i=e.clientX;try{n.setPointerCapture?.(e.pointerId)}catch{}let a=l=>{let h=o+(l.clientX-i)*.5;h=((h+180)%360+360)%360-180,this.turnLive=Math.round(h),t.redraw()},r=()=>{n.removeEventListener("pointermove",a),n.removeEventListener("pointerup",r),n.removeEventListener("pointercancel",r);let l=this.turnLive;this.turnLive=void 0,l!==void 0&&l!==o?this.set(t,{turn:l}):t.redraw()};n.addEventListener("pointermove",a),n.addEventListener("pointerup",r),n.addEventListener("pointercancel",r)}overlay(){return g}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}inspector(t){let e=this.style(t),o=He.includes(e.look),n=(i,a,r)=>c`<button type="button" class="hme-chip sel ${a?"on":""}" aria-pressed=${a?"true":"false"} @click=${r}>${i}</button>`;return c`
      ${H("Home style",c`
        <p class="hme-text">Every Home map tile starts with this look. A tile can still pick its own in its Map card.</p>
        <div class="hme-r"><span class="hme-l">Turn</span>
          <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${F(String(e.turn))} ?disabled=${!o} aria-label="Turn the model"
            style=${ye(e.turn,-180,180)}
            @input=${i=>{this.turnLive=Number(i.target.value),t.redraw()}}
            @change=${i=>{this.turnLive=void 0,this.set(t,{turn:Number(i.target.value)})}} />
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
        ${t.floor.rooms.map(i=>{let a=at(i);return c`<div class="hme-r top"><span class="hme-l">${D(i)}</span><div class="hme-chips">
            ${n(`Auto: ${Ve[a]}`,i.finish===void 0,()=>t.apply(r=>Me(r,i.id,void 0)))}
            ${qe.map(r=>n(Ve[r],i.finish===r,()=>t.apply(l=>Me(l,i.id,r))))}
          </div></div>`})}`,"shows in Plan, Night and Warm")}

      ${this.usesCard(t)}`}loadUses(t){let e=t.hass;this.usesState!=="idle"||e===void 0||(this.usesState="loading",et(e).then(o=>{this.summary=o,this.usesState="done",t.redraw()},()=>{this.usesState="error",t.redraw()}))}usesCard(t){if(this.loadUses(t),this.usesState!=="done")return H("Used on",c`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let e=ui(this.summary,t.doc),o=e.filter(n=>n.own);return H(`Used on ${C(e.length,"tile")}`,c`
      ${e.length===0?c`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:g}
      ${e.map(n=>this.useRow(t,n))}
      ${o.length===0?g:c`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(t,o)}}>${this.busy?"Saving\u2026":`Use the home style on all ${o.length}`}</button>`}
      ${this.message===void 0?g:c`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(t,e){return c`<div class="hme-use">
      <i style=${`background:${de(e.look,.2)}`}></i>
      <div><span>${e.pageName} · ${e.what} ${e.size}</span><small>${e.words}</small></div>
      ${t.openPage===void 0?g:c`<button type="button" class="hme-tb" @click=${()=>t.openPage?.(e.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(t,e){let o=t.hass;if(o===void 0||this.busy)return;let n=[...new Set(e.map(r=>r.pageId))];if(!await t.confirm({title:`Use the home style on ${C(e.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${n.length===1?"The page is":`The ${n.length} pages are`} saved for every watch and iPhone that shows ${n.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,t.redraw();let a=0;for(let r of n)try{let l=await Do(o,"pages",r),d=fi(l.document);d!==void 0&&await Oo(o,"pages",r,l.revision,d)}catch{a+=1}this.busy=!1,this.message=a===0?"Done: those tiles follow the home style now.":`${C(a,"page")} could not be saved. Try again, or open ${a===1?"it":"them"} to see why.`,this.usesState="idle",t.redraw()}};function Zi(s){return s.name.trim()===""?"Home map":s.name.trim()}var Ji="Update the Wrist Assistant integration to see the home map here.",Qi="No home map yet. Scan your rooms with the Wrist Assistant app on an iPhone or iPad with LiDAR (the Pro models). The map shows here once it is saved.",ea=4,ta=140;function oa(s){return s.kind==="saving"?"Saving\u2026":s.kind==="error"?"Not saved":"Saved"}var na={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},E=class extends wo{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.onHome=void 0;this.onOpenPage=void 0;this.unsupported=!1;this.loading=!1;this.mode="arrange";this.viewKind="flat";this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,square:!0,grid:!1,measure:!1,live:!0,scan:!1};this.measure={};this.floorMenu=!1;this.spaceHeld=!1;this.tick=0;this.modes={arrange:new $t,shape:new Tt,devices:new Et,style:new Rt};this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=g;this.onKey=e=>{if(this.dialog!==void 0||this.session===void 0)return;let o=(typeof e.composedPath=="function"?e.composedPath()[0]:void 0)??e.target;if(Qt(o))return;let n=Q(e,!1);if(n==="undo"||n==="redo"){e.preventDefault?.(),n==="undo"?this.undo():this.redo();return}if(Ln(o))return;if(e.key===" "&&!e.repeat){this.spaceHeld=!0,e.preventDefault?.();return}let i=this.context();if(i!==void 0&&this.viewKind==="flat"&&this.modes[this.mode].keyDown?.(i,e)===!0){e.preventDefault?.();return}switch(n){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.selection=void 0;return;case"zoomIn":this.zoomBy(Ge);return;case"zoomOut":this.zoomBy(1/Ge);return;case"fit":this.fit();return}};this.onKeyUp=e=>{e.key===" "&&(this.spaceHeld=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++}willUpdate(e){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load(),this.loadPages());let o=this.baseFloor();this.needFit&&o!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let e=this.renderRoot.querySelector?.(".hme-dialog");e instanceof Element&&e!==this.focusedDialog?(this.focusedDialog=e,(e.querySelector("input")??e.querySelector(".primary"))?.focus?.(),e.querySelector("input")?.select?.()):e===null&&(this.focusedDialog=void 0);let o=this.renderRoot.querySelector?.(".hme-stage");o instanceof Element&&o!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(n=>{let i=n[n.length-1]?.contentRect;i!==void 0&&this.resizeStage(i.width,i.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(o),this.observed=o),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},ta))}async load(e=!1){let o=this.hass;if(!o||!this.capable)return;let n=++this.loadSeq;e||(this.loading=this.session===void 0,this.loadError=void 0);try{let i=await Xe(o);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:Ye(i?.doc)??null,rev:typeof i?.rev=="number"?i.rev:0}),this.loadScans()}catch(i){if(n!==this.loadSeq)return;let{code:a,message:r}=be(i);a==="unknown_command"?this.unsupported=!0:(!e||this.session===void 0)&&(this.loadError=r)}this.loading=!1}async loadScans(){let e=this.hass;if(e)try{this.scans=await Co(e)}catch{}}async loadPages(){let e=this.hass;if(e)try{let o=Fo(await et(e));this.pages=zo(o,"pages").map(n=>({id:n.id,name:n.name}))}catch{this.pages=[]}}show(e){let o=this.hass;if(o&&Ot(o,e),this.session===void 0)this.session=new yt(Bn(this.hassOrThrow()),e,()=>this.afterChange(),n=>{this.hass&&Ot(this.hass,n)}),this.needFit=!0;else if(!this.session.load(e))return;this.afterChange()}hassOrThrow(){let e=this.hass;if(e===void 0)throw new Error("no hass");return e}afterChange(){let e=this.session?.doc?.floors??[];e.some(o=>x(o.id,this.floorId))||(this.floorId=e[0]?.id,this.needFit=!0),In(this.baseFloor(),this.selection)||(this.selection=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let e=this.doc?.floors??[];return e.find(o=>x(o.id,this.floorId))??e[0]}shownFloor(){let e=this.baseFloor();return e===void 0||this.previewDoc===void 0?e:this.previewDoc.floors.find(o=>x(o.id,e.id))??e}apply(e,o={}){let n=this.session;return n===void 0?!1:(this.previewDoc=void 0,n.apply(e)?(o.floorId!==void 0&&(this.floorId=o.floorId),o.select!==void 0&&(this.selection=o.select??void 0),this.afterChange(),!0):(this.tick++,!1))}preview(e){let o=this.doc;this.previewDoc=e===void 0||o===null?void 0:e(o)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(e){this.selection=e}setMode(e,o){let n=this.context();n!==void 0&&e!==this.mode&&this.modes[this.mode].leave?.(n),this.mode=e,this.viewKind="flat",o!==void 0&&(this.selection=o)}setFloor(e){let o=this.context();o!==void 0&&this.modes[this.mode].leave?.(o),this.floorId=e,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(e,o){this.toggles={...this.toggles,[e]:o},e==="measure"&&(this.measure={}),e==="scan"&&o&&this.loadScans()}confirm(e){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"confirm",...e,done:n=>{this.dialog=void 0,o(n)}}})}ask(e){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"ask",...e,done:n=>{this.dialog=void 0,o(n)}}})}resizeStage(e,o){let n=this.stageSize.width===0;this.stageSize={width:e,height:o},(n||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:e,height:o}=this.stageSize;e<=0||(this.view=Zt(this.baseFloor(),e,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}zoomBy(e,o){this.view!==void 0&&(this.view=Jt(this.view,e,o??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let e=this.doc,o=this.shownFloor();if(e===null||o===void 0)return;let n=this.view??{scale:40,ox:0,oy:0},i=this.session;return{hass:this.hass,icons:this.icons,doc:e,floor:o,selection:this.selection,mode:this.mode,view:n,stage:this.stageSize,toggles:this.toggles,pages:this.pages??[],areas:Io(this.hass),scans:this.scans,canUndo:i?.canUndo??!1,canRedo:i?.canRedo??!1,toScreen:a=>Dn(n,a),px:a=>a*n.scale,toPlan:(a,r)=>this.toPlan(a,r),apply:(a,r)=>this.apply(a,r),preview:a=>this.preview(a),select:a=>this.select(a),setMode:(a,r)=>this.setMode(a,r),setFloor:a=>this.setFloor(a),setToggle:(a,r)=>this.setToggle(a,r),drag:(a,r)=>this.drag(a,r),undo:()=>this.undo(),redo:()=>this.redo(),confirm:a=>this.confirm(a),ask:a=>this.ask(a),newId:()=>At(),note:(a,r)=>{this.session!==void 0&&(this.session.note={kind:a,text:r}),this.tick++},redraw:()=>{this.tick++},openPage:this.onOpenPage}}toPlan(e,o){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return gt(this.view??{scale:40,ox:0,oy:0},[e-n.left,o-n.top])}stagePoint(e){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[e.clientX-o.left,e.clientY-o.top]}drag(e,o){let n=this.stageEl;if(n===void 0)return;this.endDrag?.();let i=e.clientX,a=e.clientY,r=!1,l,d=0,h=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,p=()=>{d=0,l!==void 0&&o.move(this.toPlan(l.clientX,l.clientY),l)};try{n.setPointerCapture?.(e.pointerId)}catch{}let m=$=>{let w=$;w.pointerId===e.pointerId&&(!r&&Math.hypot(w.clientX-i,w.clientY-a)<ea||(r=!0,l=w,h===void 0?p():d===0&&(d=h(p))))},u=$=>{let w=$;w.pointerId===e.pointerId&&(f(),d!==0&&(cancelAnimationFrame(d),p()),o.end(this.toPlan(w.clientX,w.clientY),w,r))},f=()=>{n.removeEventListener("pointermove",m),n.removeEventListener("pointerup",u),n.removeEventListener("pointercancel",u);try{n.releasePointerCapture?.(e.pointerId)}catch{}this.endDrag===v&&(this.endDrag=void 0)},v=()=>{f(),d!==0&&(cancelAnimationFrame(d),d=0),o.cancel?.()};n.addEventListener("pointermove",m),n.addEventListener("pointerup",u),n.addEventListener("pointercancel",u),this.endDrag=v}onStageDown(e){if(this.stageEl=e.currentTarget,this.floorMenu=!1,this.dialog!==void 0)return;if(e.pointerType==="touch"&&(this.touches.set(e.pointerId,[e.clientX,e.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(e);return}if(e.button===1||this.spaceHeld){e.preventDefault?.(),this.pan(e,!1);return}if(e.button!==0)return;let o=this.context();if(o===void 0)return;if(this.toggles.measure){let i=this.toPlan(e.clientX,e.clientY),a=this.measure;this.measure=a.a===void 0||a.b!==void 0?{a:i}:{a:a.a,b:i};return}let n=this.toPlan(e.clientX,e.clientY);if(this.modes[this.mode].pointerDown?.(o,e,n)===!0){e.preventDefault?.();return}this.pan(e,!0)}onStageMove(e){if(this.stageEl=e.currentTarget,this.touches.has(e.pointerId)&&this.touches.set(e.pointerId,[e.clientX,e.clientY]),e.buttons!==0||this.viewKind==="model")return;let o=this.toPlan(e.clientX,e.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:o});let n=this.context();n!==void 0&&this.modes[this.mode].hover?.(n,o)}onStageLeave(){let e=this.context();e!==void 0&&this.modes[this.mode].hover?.(e,void 0)}onStageUp(e){this.touches.delete(e.pointerId)}onStageDrag(e){this.stageEl=e.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||this.dialog!==void 0||this.modes[this.mode].dragOver?.(o,this.toPlan(e.clientX,e.clientY),e)===!0&&(e.preventDefault?.(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy"))}onStageDragLeave(e){let o=e.relatedTarget,n=e.currentTarget;if(o!==null&&n!==null&&typeof n.contains=="function"&&n.contains(o))return;let i=this.context();i!==void 0&&this.modes[this.mode].dragOver?.(i,void 0,e)}onStageDrop(e){this.stageEl=e.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||(e.preventDefault?.(),this.modes[this.mode].drop?.(o,this.toPlan(e.clientX,e.clientY),e))}pan(e,o){let n=this.view;if(n===void 0)return;let i=e.clientX,a=e.clientY;this.drag(e,{move:(r,l)=>{this.view={...n,ox:n.ox+l.clientX-i,oy:n.oy+l.clientY-a},this.userMoved=!0},end:(r,l,d)=>{!d&&o&&(this.selection=void 0)}})}pinch(){let e=this.stageEl,o=this.view,n=[...this.touches.keys()];if(e===void 0||o===void 0||n.length<2)return;let i=()=>n.map(u=>this.touches.get(u)),[a,r]=i(),l=Math.max(Math.hypot(r[0]-a[0],r[1]-a[1]),1),d=e.getBoundingClientRect(),h=[(a[0]+r[0])/2-d.left,(a[1]+r[1])/2-d.top],p=u=>{let f=u;if(!this.touches.has(f.pointerId))return;this.touches.set(f.pointerId,[f.clientX,f.clientY]);let[v,$]=i(),w=Math.max(Math.hypot($[0]-v[0],$[1]-v[1]),1),M=[(v[0]+$[0])/2-d.left,(v[1]+$[1])/2-d.top],I=Jt(o,w/l,h);this.view={...I,ox:I.ox+M[0]-h[0],oy:I.oy+M[1]-h[1]},this.userMoved=!0},m=u=>{this.touches.delete(u.pointerId),e.removeEventListener("pointermove",p),e.removeEventListener("pointerup",m),e.removeEventListener("pointercancel",m)};e.addEventListener("pointermove",p),e.addEventListener("pointerup",m),e.addEventListener("pointercancel",m)}turnModel(e){let o=this.modelTurnNow(),n=e.clientX;this.drag(e,{move:(i,a)=>{let r=o+(a.clientX-n)*.5;r=((r+180)%360+360)%360-180,this.modelTurn=Math.round(r)},end:()=>{}})}modelTurnNow(){return this.modelTurn??Fe(this.doc).turn??Pn}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let e=Fe(this.doc).look;return He.includes(e)?e:"night"}onWheel(e){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=e.currentTarget,e.preventDefault?.();let o=e.deltaMode===1?16:e.deltaMode===2?400:1;if(e.ctrlKey||e.metaKey){this.zoomBy(Math.exp(-e.deltaY*o*.0025),this.stagePoint(e));return}this.view={...this.view,ox:this.view.ox-e.deltaX*o,oy:this.view.oy-e.deltaY*o},this.userMoved=!0}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(c`<b>${Ji}</b>`);if(this.loadError!==void 0)return this.calm(c`<span>Could not read the home map: ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(c`Loading…`);let e=this.doc;if(e===null||e.floors.length===0)return this.calm(c`<b>${Qi}</b>`);let o=this.context(),n=this.modes[this.mode],i=this.session.note;return c`<div class="hme">
      ${this.renderBar(e,o)}
      ${i===void 0?g:c`<div class="hme-note ${i.kind}" role="status"><span>${i.text}</span>
        <button class="hme-link" @click=${()=>this.session?.dismissNote()}>Dismiss</button></div>`}
      <div class="hme-body">
        <aside class="hme-rail" aria-label="${Yt[this.mode]} tools">${n.rail(o)}</aside>
        <section class="hme-stage-wrap">${n.stage?.(o)??this.renderStage(o,n)}</section>
        <aside class="hme-insp" aria-label="Inspector">${n.inspector(o)}</aside>
      </div>
      ${this.renderDialog()}
    </div>`}calm(e){return c`<div class="hme-calm"><div class="hme-empty">${e}</div></div>`}renderBar(e,o){let n=this.baseFloor(),i=this.session?.state??{kind:"saved"},a=eo();return c`<header class="hme-bar">
      ${this.onHome===void 0?g:c`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Home</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">BETA</span>
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${so(n)}
          <span class="hme-floor-t"><span>${L(n)}</span><small>${C(n.rooms.length,"room")} · ${C(n.pins.length,"device")}</small></span>
          <span class="hme-caret" aria-hidden="true">▾</span>
        </button>
        ${this.floorMenu?this.renderFloorMenu(e,n):g}
      </div>
      <span class="hme-flex"></span>
      <div class="hme-seg" role="tablist" aria-label="Edit mode">
        ${Tn.map(r=>c`<button type="button" role="tab" class=${r===this.mode?"on":""} aria-selected=${r===this.mode?"true":"false"}
          @click=${()=>this.setMode(r)}>${Yt[r]}</button>`)}
      </div>
      <span class="hme-flex"></span>
      ${this.modes[this.mode].stage!==void 0?g:c`<div class="hme-seg" role="group" aria-label="View">
        <button type="button" class=${this.viewKind==="flat"?"on":""} aria-pressed=${this.viewKind==="flat"?"true":"false"} @click=${()=>{this.viewKind="flat"}}>Flat</button>
        <button type="button" class=${this.viewKind==="model"?"on":""} aria-pressed=${this.viewKind==="model"?"true":"false"} @click=${()=>{this.viewKind="model"}}>Model</button>
      </div>`}
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${a?"\u2318Z":"Ctrl+Z"})`} ?disabled=${!o.canUndo} @click=${()=>this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${a?"\u21E7\u2318Z":"Ctrl+Shift+Z"})`} ?disabled=${!o.canRedo} @click=${()=>this.redo()}>↷</button>
      <span class="hme-status ${i.kind}" role="status" title=${i.kind==="error"?i.text:g}><span class="hme-status-dot"></span>${oa(i)}</span>
    </header>`}renderFloorMenu(e,o){return c`<div class="hme-pop" role="menu" aria-label="Floors">
      ${e.floors.map(n=>c`<div class="hme-pop-row ${x(n.id,o.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(n.id)}>
          ${so(n)}<span class="hme-floor-t"><span>${L(n)}</span><small>${C(n.rooms.length,"room")} · ${C(n.pins.length,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${L(n)}`} @click=${()=>{this.renameFloorAsk(n)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${e.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${L(n)}`}
          ?disabled=${e.floors.length===1} @click=${()=>{this.deleteFloorAsk(n)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let e=this.doc;if(e===null)return;let o=Math.max(...e.floors.map(a=>a.story))+1,n=await this.ask({title:"Add a floor",label:"Name",value:o===1?"Upstairs":`Floor ${o+1}`,ok:"Add floor"});if(n===void 0)return;let i=At();this.apply(a=>qo(a,{id:i,name:n,story:o}),{floorId:i,select:null})&&(this.needFit=!0)}async renameFloorAsk(e){this.floorMenu=!1;let o=await this.ask({title:"Rename floor",label:"Name",value:e.name||L(e),ok:"Rename"});o!==void 0&&this.apply(n=>rt(n,e.id,o))}async deleteFloorAsk(e){this.floorMenu=!1,await this.confirm({title:`Delete ${L(e)}?`,text:`Its ${C(e.rooms.length,"room")} and ${C(e.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(n=>Yo(n,e.id),{select:null})}renderStage(e,o){let{width:n,height:i}=this.stageSize,a=this.viewKind==="model",r=a?g:o.pill?.(e)??g,l=this.spaceHeld?"grab":a?"ew-resize":this.toggles.measure?"crosshair":o.cursor?.(e)??"default",d=e.floor.rooms.length===0;return c`<div class="hme-stage ${a?"model":""}" style=${a?`background:${de(this.modelLookNow())}`:""}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style=${`cursor:${l}`}
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
        ${a?this.renderModel(e,n,i):this.renderPlan(e,o,n,i)}
      </svg>
      ${r===g?g:c`<div class="hme-pill">${r}</div>`}
      ${a?g:o.stageExtra?.(e)??g}
      ${d&&!a?c`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{this.setMode("arrange");let h=this.context();h&&this.modes.arrange.draw.start(h)}}>＋ Draw a room by hand</button></div>`:g}
      ${this.renderDock(e,o)}
    </div>`}renderPlan(e,o,n,i){let a=this.view;if(a===void 0||n<=0)return g;let r=this.planArt(e.floor,n,i,o.drawsPins===!0?"none":"all"),l=a.scale/(this.artScale||a.scale);return y`${this.background(a,n,i)}
      <g class="hme-art" transform=${`translate(${a.ox.toFixed(2)} ${a.oy.toFixed(2)}) scale(${l.toFixed(5)})`} pointer-events="none">${r}</g>
      <g class="hme-labels" pointer-events="none">${this.labels(e)}</g>
      <g class="hme-overlay">${o.overlay(e)}</g>
      ${this.toggles.measure?this.measureMarks(e):g}`}planArt(e,o,n,i){let a=this.toggles.live?this.hass?.states:void 0,r=this.artScale||this.view.scale,l=`${aa(e)}|${bo(a)}|${r}|${o}|${n}|${this.iconsTick}|${bo(this.icons)}|${i}`;return l!==this.artKey&&(this.artKey=l,this.artHeld=pe({floor:e,states:a,look:"plan",names:!1,devices:i,furniture:!0,glow:!0,width:o,height:n,icons:this.icons,frame:{scale:r,ox:0,oy:0}})),this.artHeld}background(e,o,n){let i=this.mode==="shape"?.05:.1,a=20;if(this.toggles.grid)for(a=i*e.scale;a<8;)a*=10;let r=(e.ox%a+a)%a,l=(e.oy%a+a)%a;return y`<defs><pattern id="hme-bg" width=${a} height=${a} patternUnits="userSpaceOnUse" patternTransform=${`translate(${r.toFixed(1)} ${l.toFixed(1)})`}>
        ${this.toggles.grid?y`<path d=${`M${a} 0V${a}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:y`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${o} height=${n} fill="url(#hme-bg)" />`}labels(e){return e.floor.rooms.map(o=>{let n=B(o),i=ae(o.outline);if(n===void 0||i===void 0)return g;let a=D(o),r=We(o),l=(i.maxX-i.minX)*e.view.scale,d=(i.maxY-i.minY)*e.view.scale,h=a.length*7.4+22;if(h>l*.95||d<26)return g;let p=Math.max(h,r.length*5.8+22)<=l*.95&&d>=48,m=p?Math.max(h,r.length*5.8+22):h,u=p?36:22,[f,v]=e.toScreen(n);return y`<g class="hme-label"><rect x=${(f-m/2).toFixed(1)} y=${(v-u/2).toFixed(1)} width=${m.toFixed(1)} height=${u} rx=${p?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${f.toFixed(1)} y=${(v+(p?-3:4.5)).toFixed(1)} fill="#fff" font-size=${p?13:12} font-weight="600" text-anchor="middle">${a}</text>
        ${p?y`<text x=${f.toFixed(1)} y=${(v+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${r}</text>`:g}</g>`})}measureMarks(e){let o=this.measure;if(o.a===void 0)return y`<g class="hme-measure"></g>`;let n=o.b??o.hover,i=e.toScreen(o.a);if(n===void 0)return y`<g class="hme-measure" pointer-events="none"><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /></g>`;let a=e.toScreen(n),r=Math.hypot(n[0]-o.a[0],n[1]-o.a[1]),l=[(i[0]+a[0])/2,(i[1]+a[1])/2];return y`<g class="hme-measure" pointer-events="none">
      <line x1=${i[0]} y1=${i[1]} x2=${a[0]} y2=${a[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${o.b===void 0?"6 4":"none"} />
      <circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /><circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(l[0]-32).toFixed(1)} y=${(l[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${l[0].toFixed(1)} y=${(l[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${r.toFixed(2)} m</text></g></g>`}renderModel(e,o,n){return o<=0?g:pe({floor:e.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:o,height:n})}renderDock(e,o){let n=c`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
      title="Draw what Home Assistant's devices are doing now" @click=${()=>this.setToggle("live",!this.toggles.live)}><span class="hme-live-dot"></span>Live states</button>`;if(this.viewKind==="model"){let r=this.modelLookNow();return c`<div class="hme-dock">
        ${He.map(l=>c`<button type="button" class="hme-tb ${l===r?"on":""}" aria-pressed=${l===r?"true":"false"} @click=${()=>{this.modelLook=l}}>${na[l]}</button>`)}
        <span class="hme-vsep"></span>
        <button type="button" class="hme-tb" title="Back to the home style's turn" @click=${()=>{this.modelTurn=void 0}}>⟲ Turn back</button>
        <span class="hme-vsep"></span>${n}
      </div>`}let i=this.stageSize.width>0?Zt(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,a=this.view===void 0||i===void 0?100:On(this.view,i);return c`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" @click=${()=>this.zoomBy(1/Ge)}>−</button>
      <span class="hme-zoom mono">${a}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" @click=${()=>this.zoomBy(Ge)}>＋</button>
      <button type="button" class="hme-tb" @click=${()=>this.fit()}>Fit</button>
      <span class="hme-vsep"></span>
      ${o.dock?.(e)??g}
      <button type="button" class="hme-tb ${this.toggles.measure?"on":""}" aria-pressed=${this.toggles.measure?"true":"false"}
        title="Click two points to measure between them" @click=${()=>this.setToggle("measure",!this.toggles.measure)}>Measure</button>
      <span class="hme-vsep"></span>${n}
    </div>`}renderDialog(){let e=this.dialog;if(e===void 0)return g;let o=()=>e.kind==="confirm"?e.done(!1):e.done(void 0),n=i=>{e.kind==="confirm"?e.done(!0):e.done((i?.querySelector("input")?.value??e.value).trim()||e.value)};return c`<div class="hme-scrim" @pointerdown=${i=>{i.target===i.currentTarget&&o()}}>
      <div class="hme-dialog" role="dialog" aria-modal="true" aria-label=${e.title}
        @keydown=${i=>{i.key==="Escape"&&(i.stopPropagation(),o()),i.key==="Enter"&&(i.preventDefault(),n(i.currentTarget))}}>
        <h3>${e.title}</h3>
        ${e.kind==="confirm"?e.text===void 0?g:c`<p>${e.text}</p>`:c`<label class="hme-dialog-field"><span>${e.label}</span><input type="text" maxlength="100" .value=${e.value} autofocus /></label>`}
        <div class="hme-dialog-row">
          <button type="button" class="hme-tb" @click=${o}>Cancel</button>
          <button type="button" class="hme-tb primary ${e.kind==="confirm"&&e.danger===!0?"danger-fill":""}"
            @click=${i=>n(i.currentTarget.closest(".hme-dialog"))}>${e.ok}</button>
        </div>
      </div>
    </div>`}static{this.styles=[Ro,Mo,qn]}};T([q({attribute:!1})],E.prototype,"hass",2),T([q({type:Boolean,reflect:!0})],E.prototype,"narrow",2),T([q({attribute:!1})],E.prototype,"icons",2),T([q({attribute:!1})],E.prototype,"iconsTick",2),T([q({attribute:!1})],E.prototype,"capable",2),T([q({attribute:!1})],E.prototype,"onHome",2),T([q({attribute:!1})],E.prototype,"onOpenPage",2),T([O()],E.prototype,"unsupported",2),T([O()],E.prototype,"loading",2),T([O()],E.prototype,"loadError",2),T([O()],E.prototype,"floorId",2),T([O()],E.prototype,"selection",2),T([O()],E.prototype,"mode",2),T([O()],E.prototype,"viewKind",2),T([O()],E.prototype,"view",2),T([O()],E.prototype,"artScale",2),T([O()],E.prototype,"stageSize",2),T([O()],E.prototype,"toggles",2),T([O()],E.prototype,"scans",2),T([O()],E.prototype,"measure",2),T([O()],E.prototype,"floorMenu",2),T([O()],E.prototype,"dialog",2),T([O()],E.prototype,"modelLook",2),T([O()],E.prototype,"modelTurn",2),T([O()],E.prototype,"pages",2),T([O()],E.prototype,"spaceHeld",2),T([O()],E.prototype,"tick",2);var gi=new WeakMap,ia=1;function bo(s){if(s===void 0)return 0;let t=gi.get(s);return t===void 0&&gi.set(s,t=ia++),t}var aa=s=>bo(s);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",E);export{ea as HOME_MAP_DRAG_SLOP,Qi as HOME_MAP_EMPTY_TEXT,Ji as HOME_MAP_UPDATE_TEXT,E as WaHomeMapEditor,oa as homeMapSaveWords};
