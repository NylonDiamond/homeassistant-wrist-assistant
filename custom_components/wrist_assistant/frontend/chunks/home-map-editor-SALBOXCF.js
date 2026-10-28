import{$ as Wo,A as So,Aa as en,B as Io,Ba as tn,C as Ro,Ca as re,D as Co,E as ce,F as ke,G as Do,H as Oo,I as _o,J as It,K as Ao,L as Lo,M as Ze,N as ue,O as Fo,P as No,Q as Rt,R as q,S as Je,T as Qe,U as zo,V as Ct,W as Ko,X as et,Y as Dt,Z as He,_ as tt,a as te,aa as Go,b as Ht,ba as jo,c as Et,ca as ot,d as oe,da as Y,e as Pt,ea as Bo,f as W,fa as Vo,g as G,ga as nt,h as wo,ha as Ee,i as Xe,ia as Uo,j as qe,ja as Xo,k as Tt,ka as qo,l as $o,la as Pe,m as Mo,ma as Ot,n as ne,na as it,o as he,oa as Yo,p as F,pa as Zo,q as me,qa as at,r as ie,ra as fe,s as xo,sa as Te,t as ko,ta as rt,u as Ho,ua as Se,v as Eo,va as Jo,w as Po,wa as ge,x as Ye,xa as Qo,y as To,ya as ae,z as St,za as st}from"./chunk-2HBZTO6W.js";import{c as je,j as co,k as uo,na as bo,oa as yo}from"./chunk-5H6OWAXC.js";import"./chunk-7T6IEW6M.js";import"./chunk-J2WKPEGJ.js";import{b as kt}from"./chunk-S3NOJWAC.js";import{B as $e,C as ze,D as x,G as O,H as I,I as Ke,J as Q,K as Me,M as so,O as ee,P as lo,Q as We,R as Ge,X as po,Y as ho,Z as L,da as Mt,ea as A,k as io,m as Fe,n as ao,q as Ne,r as ro}from"./chunk-QMJJS2F5.js";import{i as Be,l as fo,m as go,n as Ve,r as Ue,s as xt,t as vo}from"./chunk-CPEKF3CW.js";import{$g as Le,Eh as xe,Mh as mo,ah as oo,b as Qt,d as h,e as y,g as f,hg as to,j as eo,k as X,l as C,vh as no}from"./chunk-H2SVQBFU.js";import{db as pe}from"./chunk-OM34V22N.js";import{a as T}from"./chunk-LO2NM3CE.js";var on=["arrange","shape","devices","style"],_t={arrange:"Arrange",shape:"Shape",devices:"Devices",style:"Style"};function ve(l){return l===void 0||l.kind==="pin"?void 0:l.roomId}function nn(l,t){if(t===void 0)return!0;if(l===void 0)return!1;if(t.kind==="pin")return l.pins.some(o=>x(o.id,t.pinId));let e=l.rooms.find(o=>x(o.id,t.roomId));if(e===void 0)return!1;switch(t.kind){case"room":return!0;case"wall":return F(e)[t.wall]!==void 0;case"corner":return e.outline[t.corner]!==void 0;case"opening":return e.openings[t.opening]!==void 0;case"object":return e.objects[t.object]!==void 0}}var an=4,rn=2400;function sn(l,t){return[l.ox+t[0]*l.scale,l.oy+t[1]*l.scale]}function lt(l,t){return[(t[0]-l.ox)/l.scale,(t[1]-l.oy)/l.scale]}function At(l,t,e,o=56,n=96){let i=l===void 0||l.rooms.length===0&&l.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:Ke(l),r=Math.max(i.maxX-i.minX,1),s=Math.max(i.maxY-i.minY,1),d=hn(Math.min(Math.max(t-o*2,40)/r,Math.max(e-n*2,40)/s),an,rn);return{scale:d,ox:t/2-(i.minX+i.maxX)/2*d,oy:e/2-(i.minY+i.maxY)/2*d}}function Lt(l,t,e){let o=hn(l.scale*t,an,rn),n=o/l.scale;return{scale:o,ox:e[0]-(e[0]-l.ox)*n,oy:e[1]-(e[1]-l.oy)*n}}function ln(l,t){return Math.round(l.scale/t.scale*100)}var Ie=1.25;function dn(l){if(typeof l!="object"||l===null)return!1;let t=l;if(t.isContentEditable===!0)return!0;let e=typeof t.tagName=="string"?t.tagName.toUpperCase():"";if(e==="TEXTAREA"||e==="SELECT")return!0;if(e!=="INPUT")return!1;let o=typeof t.type=="string"?t.type.toLowerCase():"text";return!["button","checkbox","radio","range","color","submit","reset","file","image"].includes(o)}function Z(l,t){if(t)return;let e=l.metaKey===!0||l.ctrlKey===!0,o=l.key.length===1?l.key.toLowerCase():l.key;if(e)return o==="z"?l.shiftKey===!0?"redo":"undo":o==="y"?"redo":void 0;if(l.altKey===!0)return;switch(o){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit"}let n=l.shiftKey===!0?.1:.01;if(o==="ArrowLeft")return{nudge:[-n,0]};if(o==="ArrowRight")return{nudge:[n,0]};if(o==="ArrowUp")return{nudge:[0,-n]};if(o==="ArrowDown")return{nudge:[0,n]};if(/^[a-z]$/.test(o)&&l.shiftKey!==!0)return{letter:o}}function Ft(){let l=globalThis.navigator,t=`${typeof l?.platform=="string"?l.platform:""} ${typeof l?.userAgent=="string"?l.userAgent:""}`;return/Mac|iPhone|iPad/.test(t)}function pn(){return Ft()?"\u2318Z":"Ctrl+Z"}var hn=(l,t,e)=>Math.min(Math.max(l,t),e);function be(l,t=2){return`${(Math.round(l*10**t)/10**t).toFixed(t)} m`}function Nt(l,t=2){let e=(Math.round(l*10**t)/10**t).toFixed(t);return/^-0(\.0*)?$/.test(e)?e.slice(1):e}function mn(l){let t=l.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(t===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t))return;let e=Number(t);if(Number.isFinite(e))return/cm$/i.test(l.trim())?e/100:e}function dt(l){if(l.outline.length<3)return{width:0,depth:0,area:0};let{a0:t,a1:e,c0:o,c1:n}=Tt(l,Et(l));return{width:e-t,depth:n-o,area:Math.abs($o(l.outline))}}function Re(l){let{width:t,depth:e}=dt(l);return`${t.toFixed(1)} \xD7 ${e.toFixed(1)} m`}function cn(l){if(l.outline.length<3)return l.outline.slice();let{a0:t,a1:e,c0:o,c1:n,point:a}=Tt(l,Et(l));return[a(t,o),a(e,o),a(e,n),a(t,n)]}function jn(l,t){let e=F(l)[t];if(e===void 0)return"inner";let o=Math.max(Math.hypot(e.b[0]-e.a[0],e.b[1]-e.a[1]),1e-9),n=-(e.b[1]-e.a[1])/o,a=(e.b[0]-e.a[0])/o,i=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],r=Math.max(e.t,.1)+.1,s=Pt(l.outline,[i[0]+n*r,i[1]+a*r]),d=Pt(l.outline,[i[0]-n*r,i[1]-a*r]);if(s&&d)return"inner";if(s)n=-n,a=-a;else if(!d){let p=W(l);p!==void 0&&(p[0]-i[0])*n+(p[1]-i[1])*a>0&&(n=-n,a=-a)}return Math.abs(n)>Math.abs(a)?n>0?"right":"left":a>0?"bottom":"top"}function zt(l,t,e){let o=jn(l,t);return`${e}, ${o} wall`}function se(l){return l.kind==="opening"?"Way through":l.kind==="window"?l.style==="sliding"?"Sliding window":"Window":l.style==="double"?"Double door":l.style==="sliding"?"Sliding door":"Door"}var Bn={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function le(l){let t=Bn[l];if(t!==void 0)return t;let e=l.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return e.charAt(0).toUpperCase()+e.slice(1)}function R(l,t,e=`${t}s`){return`${l} ${l===1?t:e}`}function H(l,t,e,o=""){return h`<section class="hme-card ${o}">
    <div class="hme-h">${l}${e===void 0?f:h`<span class="hme-h-end">${e}</span>`}</div>
    ${t}
  </section>`}function P(l,...t){return h`<div class="hme-r"><span class="hme-l">${l}</span>${t}</div>`}function N(l){return h`<p class="hme-hint">${l}</p>`}function _(l){let t=l.digits??2,e=Nt(l.value,t),o=n=>{let a=mn(n.value);if(a===void 0||l.min!==void 0&&a<l.min||l.max!==void 0&&a>l.max||Nt(a,t)===e){n.value=e;return}l.set(a)};return h`<span class="hme-in hme-num" style=${l.width===void 0?f:`flex:0 0 ${l.width}`}>
    <input type="text" inputmode="decimal" aria-label=${l.label} .value=${A(e)} ?disabled=${l.disabled===!0}
      @change=${n=>o(n.target)}
      @keydown=${n=>{n.key==="Enter"&&n.target.blur(),n.key==="Escape"&&(n.target.value=e,n.target.blur())}} />${l.unit===void 0?f:h`<span class="hme-unit">${l.unit}</span>`}</span>`}function Ce(l){return h`<span class="hme-in"><input type="text" aria-label=${l.label} maxlength=${l.max??100} placeholder=${l.placeholder??""}
    .value=${A(l.value)}
    @change=${t=>{let e=t.target.value;e.trim()!==l.value.trim()&&l.set(e)}}
    @keydown=${t=>{t.key==="Enter"&&t.target.blur()}} /></span>`}function ye(l){return h`<span class="hme-in hme-sel ${l.cls??""}"><select aria-label=${l.label} @change=${t=>l.set(t.target.value)}>
    ${l.options.map(t=>h`<option value=${t.value} ?disabled=${t.disabled===!0} .selected=${A(t.value===l.value)}>${t.label}</option>`)}
  </select></span>`}function Kt(l){return h`<span class="hme-menu ${l.cls??""}"><select aria-label=${l.label} @change=${t=>{let e=t.target,o=e.value;e.value="",o!==""&&l.pick(o)}}>
    <option value="" .selected=${A(!0)}>${l.label}</option>
    ${l.options.map(t=>h`<option value=${t.value} ?disabled=${t.disabled===!0}>${t.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function V(l){return h`<button type="button" class="hme-pic ${l.on?"on":""}" aria-pressed=${l.on?"true":"false"} title=${l.title??l.label}
    @click=${l.click}>${l.picture}<span>${l.label}</span></button>`}function Wt(l){return h`<button type="button" class="hme-chip ${l.on?"":"off"}" aria-pressed=${l.on?"true":"false"} aria-label=${l.label}
    @click=${l.click}>${l.on?l.onText:l.offText}</button>`}var Vn={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},Gt={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function jt(l){return h`<span class="hme-sw" style=${`background:${Vn[l]}`}></span>`}var un=l=>l.map(([t,e])=>`${Math.round(t*10)/10},${Math.round(e*10)/10}`).join(" ");function Bt(l,t=34,e=24){let o=l?.rooms??[];if(o.length===0)return h`<svg class="hme-thumb" width=${t} height=${e} viewBox=${`0 0 ${t} ${e}`} aria-hidden="true">
      <rect x="1" y="1" width=${t-2} height=${e-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let n=Ke(l),a=4,i=Math.min((t-a*2)/Math.max(n.maxX-n.minX,.5),(e-a*2)/Math.max(n.maxY-n.minY,.5)),r=t/2-(n.minX+n.maxX)/2*i,s=e/2-(n.minY+n.maxY)/2*i;return h`<svg class="hme-thumb" width=${t} height=${e} viewBox=${`0 0 ${t} ${e}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${t-1} height=${e-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${o.map(d=>y`<polygon points=${un(d.outline.map(([p,m])=>[r+p*i,s+m*i]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function fn(l,t,e=76,o=54){let n=l.outline.map(v=>v[0]),a=l.outline.map(v=>v[1]),i=Math.min(...n),r=Math.max(...n),s=Math.min(...a),d=Math.max(...a),p=8,m=Math.min((e-p*2)/Math.max(r-i,.5),(o-p*2)/Math.max(d-s,.5)),c=e/2-(i+r)/2*m,u=o/2-(s+d)/2*m,g=un(l.outline.map(([v,w])=>[c+v*m,u+w*m]));return h`<svg class="hme-room-thumb" width=${e} height=${o} viewBox=${`0 0 ${e} ${o}`} aria-hidden="true">
    <rect width=${e} height=${o} rx="8" fill="#121010" />
    <polygon points=${g} fill=${Gt[Xe(l)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${t?y`<circle cx=${e*.58} cy=${o*.42} r=${Math.min(e,o)*.22} fill="#ffb648" opacity="0.35" />`:f}
  </svg>`}function vn(l){return{get:()=>Le(l),save:(t,e)=>oo(l,t,e)}}var bn="The map had changed on another device. Your change was saved on top of it.",Un="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",Xn="The map changed again while saving, so your change was not saved. Try it once more.";function qn(l){return{doc:ze(l?.doc)??null,rev:typeof l?.rev=="number"?l.rev:0}}function gn(l,t){let e=typeof t=="function"?t(l):po(l,t);if(e===void 0)return;let o=$e(e);return o.ok?{doc:o.doc}:{text:`Not saved. ${o.message}.`}}async function yn(l,t,e){if(t.doc===null)return{ok:!1,text:"There is no map to change yet."};let o=gn(t.doc,e);if(o===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in o)return{ok:!1,text:o.text};try{let i=await l.save(o.doc,t.rev);return{ok:!0,read:{doc:o.doc,rev:i.rev},merged:!1}}catch(i){let{code:r,message:s}=pe(i);if(r!=="conflict")return{ok:!1,text:`Not saved. ${s}`}}let n;try{n=qn(await l.get())}catch(i){return{ok:!1,text:`Not saved. The map changed on another device and could not be read again: ${pe(i).message}`}}let a=n.doc===null?void 0:gn(n.doc,e);if(a===void 0)return{ok:!1,text:Un,read:n};if("text"in a)return{ok:!1,text:a.text,read:n};try{let i=await l.save(a.doc,n.rev);return{ok:!0,read:{doc:a.doc,rev:i.rev},merged:!0}}catch(i){let{code:r,message:s}=pe(i);return{ok:!1,text:r==="conflict"?Xn:`Not saved. ${s}`,read:n}}}function pt(l){return Array.isArray(l)?`[${l.map(pt).join(",")}]`:typeof l=="object"&&l!==null?`{${Object.entries(l).filter(([,e])=>e!==void 0).sort(([e],[o])=>e<o?-1:e>o?1:0).map(([e,o])=>`${JSON.stringify(e)}:${pt(o)}`).join(",")}}`:JSON.stringify(l)}function Yn(l,t){return l===t?!0:l==null||t==null?!1:pt(l)===pt(t)}function wn(l,t){return e=>Yn(e,l)?t:void 0}var ht=class{constructor(t,e,o=()=>{},n=()=>{},a){this.api=t;this.changed=o;this.saved=n;this.state={kind:"saved"};this.queue=[];this.confirmed=e,this.doc=e.doc,this.history=new Zo(a)}get busy(){return this.queue.length>0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(t){return this.busy?!1:(this.confirmed=t,this.doc=t.doc,this.history.clear(),this.changed(),!0)}apply(t){let e=this.doc;if(e===null)return!1;let o=t(e);if(o===void 0)return!1;let n=$e(o);return n.ok?(this.history.push(e),this.doc=n.doc,this.enqueue(t),!0):(this.note={kind:"err",text:`That cannot be saved. ${n.message}.`},this.changed(),!1)}undo(){let t=this.doc;if(t===null)return!1;let e=this.history.undo(t);return e===void 0?!1:(this.doc=e,this.enqueue(wn(t,e)),!0)}redo(){let t=this.doc;if(t===null)return!1;let e=this.history.redo(t);return e===void 0?!1:(this.doc=e,this.enqueue(wn(t,e)),!0)}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}enqueue(t){this.queue.push(t),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0?this.kick():this.changed()}))}async run(){for(;this.queue.length>0;){let t=this.queue.splice(0),e=t.length===1?t[0]:n=>t.reduce((a,i)=>a===void 0?void 0:i(a),n);this.state={kind:"saving"},this.changed();let o=await yn(this.api,this.confirmed,e);if(o.ok){this.confirmed=o.read,this.saved(o.read),o.merged?(this.note={kind:"warn",text:bn},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=o.read.doc);continue}this.queue=[],this.history.clear(),o.read!==void 0&&(this.confirmed=o.read,this.saved(o.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:o.text},this.state={kind:"error",text:o.text},this.changed();return}this.state={kind:"saved"}}rebased(){let t=this.confirmed.doc;if(t===null)return null;let e=[];for(let o of this.queue){let n=o(t);if(n===void 0)continue;let a=$e(n);a.ok&&(t=a.doc,e.push(o))}return this.queue=e,t}};var $n=Qt`
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
  /* The panel's own slider (form-styles.ts), its fill from --p. */
  .hme-range { flex: 1; min-width: 0; }

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
`;function Vt(l,t,e,o={}){let n=(o.reach??10)/e,a,i=n;for(let d of[...l.rooms.flatMap(p=>p.outline),...o.corners??[]]){let p=Math.hypot(d[0]-t[0],d[1]-t[1]);p<=i&&(a=d,i=p)}if(a!==void 0)return[a[0],a[1]];let[r,s]=t;if(o.grid!==void 0&&o.grid>0&&(r=Math.round(r/o.grid)*o.grid,s=Math.round(s/o.grid)*o.grid),o.from!==void 0){let d=8/e;Math.abs(t[0]-o.from[0])<=d&&(r=o.from[0]),Math.abs(t[1]-o.from[1])<=d&&(s=o.from[1])}return[Math.round(r*100)/100,Math.round(s*100)/100]}var Ut=.1,de=.05,we=class{constructor(t){this.grid=t;this.active=!1;this.points=[]}start(t){this.active=!0,this.points=[],this.hoverAt=void 0,t.select(void 0),t.redraw()}stop(t){this.active=!1,this.points=[],this.hoverAt=void 0,t?.redraw()}snap(t,e){return Vt(t.floor,e,t.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...t.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(t,e){let o=this.points[0];return o!==void 0&&this.points.length>=3&&Math.hypot(e[0]-o[0],e[1]-o[1])*t.view.scale<=10}pointerDown(t,e,o){if(!this.active||e.button!==0)return!1;let n=this.snap(t,o);if(this.closes(t,n))return this.finish(t),!0;let a=this.points[this.points.length-1];return(a===void 0||Math.hypot(n[0]-a[0],n[1]-a[1])>=.05)&&this.points.push(n),t.redraw(),!0}hover(t,e){this.active&&(this.hoverAt=e===void 0?void 0:this.snap(t,e),t.redraw())}keyDown(t,e){return this.active?e.key==="Escape"?(this.stop(t),!0):e.key==="Enter"?(this.points.length>=3&&this.finish(t),!0):e.key==="Backspace"||e.key==="Delete"?(this.points.pop(),t.redraw(),!0):!1:!1}async finish(t){let e=this.points.slice();if(this.stop(t),e.length<3)return;let o=await t.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(o===void 0)return;let n=t.newId(),a=t.floor.id;t.apply(i=>Lo(i,a,n,e,o),{select:{kind:"room",roomId:n}})||t.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(t){if(!this.active)return f;let e=this.points.map(s=>t.toScreen(s)),o=this.hoverAt===void 0?void 0:t.toScreen(this.hoverAt),n=this.hoverAt!==void 0&&this.closes(t,this.hoverAt),a=[...e,...o!==void 0?[o]:[]].map(([s,d])=>`${s.toFixed(1)},${d.toFixed(1)}`).join(" "),i=this.points[this.points.length-1],r=i!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-i[0],this.hoverAt[1]-i[1]):0;return y`<g class="hme-draw">
      ${e.length>=3?y`<polygon points=${e.map(([s,d])=>`${s},${d}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:f}
      <polyline points=${a} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${e.map(([s,d],p)=>y`<circle cx=${s} cy=${d} r=${p===0&&n?8:5} fill=${p===0&&n?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${o!==void 0&&!n?y`<circle cx=${o[0]} cy=${o[1]} r="4" fill="#5b8def" />`:f}
      ${o!==void 0&&r>.05?y`<g class="hme-tag"><rect x=${o[0]+10} y=${o[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${o[0]+39} y=${o[1]-13} fill="#fff" text-anchor="middle">${r.toFixed(2)} m</text></g>`:f}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};var De={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},Mn=15;function Zn(l,t){let e=t===0?"":` Its ${R(t,"device")} come${t===1?"s":""} off the map too.`;return`${I(l)} comes off the map.${e} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}var D=l=>l.toFixed(1),J=l=>`${l[0].toFixed(1)},${l[1].toFixed(1)}`,mt=class{constructor(){this.id="arrange";this.draw=new we(Ut);this.query="";this.open=new Set;this.guides=[];this.dragging=!1}focus(t){let e=ve(t.selection);return e===void 0?void 0:t.floor.rooms.find(o=>x(o.id,e))}rail(t){let e=t.floor,o=this.query.trim().toLowerCase(),n=e.rooms.filter(s=>o===""||I(s).toLowerCase().includes(o)),a=o===""?[]:e.pins.filter(s=>L(s,t.hass).toLowerCase().includes(o)||s.entityId.includes(o)),i=t.doc.floors.filter(s=>!x(s.id,e.id)),r=this.focus(t);return h`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a room or device" aria-label="Find a room or device" .value=${A(this.query)}
          @input=${s=>{this.query=s.target.value,t.redraw()}} /></label>
      <section class="hme-card hme-layers">
        <div class="hme-h">${O(e)}<span class="hme-h-end">${R(e.rooms.length,"room")}</span></div>
        ${n.map(s=>this.layer(t,s,r!==void 0&&x(r.id,s.id)))}
        ${n.length===0?h`<p class="hme-empty-line">${o===""?"No rooms on this floor yet.":"No room by that name."}</p>`:f}
        ${a.length>0?h`<div class="hme-sep"></div>${a.map(s=>h`<button type="button" class="hme-lay"
            @click=${()=>t.setMode("devices",{kind:"pin",pinId:s.id})}><span class="hme-dot dev"></span>${L(s,t.hass)}<span class="n">Device</span></button>`)}`:f}
        ${i.length>0?h`<div class="hme-sep"></div>${i.map(s=>h`<button type="button" class="hme-lay dim"
            @click=${()=>t.setFloor(s.id)}>▸ ${O(s)}<span class="n">${R(s.rooms.length,"room")}</span></button>`)}`:f}
      </section>
      <button type="button" class="hme-tb hme-wide ${this.draw.active?"on":""}" @click=${()=>this.draw.active?this.draw.stop(t):this.draw.start(t)}>
        ${this.draw.active?"Stop drawing":"\uFF0B Draw a room by hand"}</button>
      <p class="hme-foot">Scanned rooms come from the iPhone. Rooms you draw here (a garden, a garage) need no scan.</p>`}layer(t,e,o){let n=h`<button type="button" class="hme-lay ${o?"on":""}" aria-pressed=${o?"true":"false"}
      @click=${()=>t.select({kind:"room",roomId:e.id})}>
      <span class="hme-dot" style=${`background:${Gt[Xe(e)]}`}></span>${I(e)}<span class="n">${Re(e)}</span></button>`;if(!o)return n;let a=e.openings.map((p,m)=>({o:p,i:m})).filter(({o:p})=>p.kind!=="window"),i=e.openings.map((p,m)=>({o:p,i:m})).filter(({o:p})=>p.kind==="window"),r=he(t.floor,e.id),s=p=>{this.open.has(p)?this.open.delete(p):this.open.add(p),t.redraw()},d=p=>t.setMode("shape",p===void 0?{kind:"room",roomId:e.id}:{kind:"opening",roomId:e.id,opening:p});return h`${n}
      <button type="button" class="hme-lay sub" @click=${()=>d(a[0]?.i)}>Doors and ways in<span class="n">${a.length}</span></button>
      <button type="button" class="hme-lay sub" @click=${()=>d(i[0]?.i)}>Windows<span class="n">${i.length}</span></button>
      <button type="button" class="hme-lay sub" aria-expanded=${this.open.has("things")?"true":"false"} @click=${()=>s("things")}>Things<span class="n">${e.objects.length}</span></button>
      ${this.open.has("things")?e.objects.map((p,m)=>h`<div class="hme-lay subsub">${le(p.kind)}
        ${Wt({on:p.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${le(p.kind)} shown`,click:()=>t.apply(c=>It(c,e.id,m,p.hidden!==!0))})}</div>`):f}
      <button type="button" class="hme-lay sub" aria-expanded=${this.open.has("devices")?"true":"false"} @click=${()=>s("devices")}>Devices<span class="n">${r.length}</span></button>
      ${this.open.has("devices")?r.map(p=>h`<button type="button" class="hme-lay subsub" @click=${()=>t.setMode("devices",{kind:"pin",pinId:p.id})}>${L(p,t.hass)}<span class="n">›</span></button>`):f}`}overlay(t){if(this.draw.active)return this.draw.overlay(t);let e=this.focus(t),o=[];for(let n of this.guides)o.push(this.guide(t,n));return e!==void 0&&e.outline.length>=3&&o.push(this.box(t,e)),o.length===0?f:y`${o}`}box(t,e){let o=cn(e).map(g=>t.toScreen(g)),n=o.reduce((g,v)=>[g[0]+v[0]/4,g[1]+v[1]/4],[0,0]),a=g=>[(o[g][0]+o[(g+1)%4][0])/2,(o[g][1]+o[(g+1)%4][1])/2],i=g=>{let v=Math.max(Math.hypot(g[0]-n[0],g[1]-n[1]),1e-6);return[(g[0]-n[0])/v,(g[1]-n[1])/v]},r=[0,1,2,3].flatMap(g=>[o[g],a(g)]),s=[0,1,2,3].reduce((g,v)=>a(v)[1]<a(g)[1]?v:g,0),d=a(s),p=i(d),m=[d[0]+p[0]*28,d[1]+p[1]*28],c=dt(e),u=[];for(let g of[[0,2],[1,3]]){let[v,w]=g,S=Math.abs(o[(v+1)%4][0]-o[v][0])>=Math.abs(o[(v+1)%4][1]-o[v][1])?i(a(v))[1]<=i(a(w))[1]?v:w:i(a(v))[0]<=i(a(w))[0]?v:w,z=o[S],k=o[(S+1)%4],j=i(a(S)),B=[z[0]+j[0]*20,z[1]+j[1]*20],K=[k[0]+j[0]*20,k[1]+j[1]*20],Ae=[(B[0]+K[0])/2,(B[1]+K[1])/2],Gn=S%2===0?c.width:c.depth,U=[j[0]*5,j[1]*5];u.push(y`<path d=${`M${J(B)}L${J(K)}M${J([B[0]-U[0],B[1]-U[1]])}L${J([B[0]+U[0],B[1]+U[1]])}M${J([K[0]-U[0],K[1]-U[1]])}L${J([K[0]+U[0],K[1]+U[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${D(Ae[0]-26)} y=${D(Ae[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${D(Ae[0])} y=${D(Ae[1]+4)} fill="#fff" text-anchor="middle">${Gn.toFixed(2)} m</text></g>`)}return y`<g class="hme-box">
      <polygon points=${o.map(J).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" />
      ${this.dragging?f:y`
        ${u}
        <line x1=${D(d[0])} y1=${D(d[1])} x2=${D(m[0])} y2=${D(m[1])} stroke="#5b8def" stroke-width="1.6" />
        ${r.map(g=>y`<rect data-hme="move" x=${D(g[0]-5)} y=${D(g[1]-5)} width="10" height="10" fill="#fff" stroke="#5b8def" stroke-width="1.6" style="cursor:move" />`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${J(m)})`}>
          <title>Drag to turn the room. Hold Alt to turn it freely.</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(t,e){let o=t.toScreen(e.a),n=t.toScreen(e.b),a=Math.max(Math.hypot(n[0]-o[0],n[1]-o[1]),1e-6),i=[(n[0]-o[0])/a,(n[1]-o[1])/a],r=[o[0]-i[0]*40,o[1]-i[1]*40],s=[n[0]+i[0]*40,n[1]+i[1]*40],d=t.floor.rooms.find(c=>x(c.id,e.roomId)),p=`Lined up with ${d===void 0?"a":I(d)} wall`,m=p.length*6.2+20;return y`<g class="hme-guide" pointer-events="none">
      <line x1=${D(r[0])} y1=${D(r[1])} x2=${D(s[0])} y2=${D(s[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${D(s[0]+6)} y=${D(s[1]-10)} width=${D(m)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${D(s[0]+6+m/2)} y=${D(s[1]+4)} fill="#fff" text-anchor="middle">${p}</text></g>
    </g>`}pointerDown(t,e,o){if(this.draw.active)return this.draw.pointerDown(t,e,o);if(e.button!==0)return!1;let n=e.target?.closest?.("[data-hme]")?.getAttribute("data-hme"),a=this.focus(t);if(n==="turn"&&a!==void 0)return this.turnDrag(t,e,a,o),!0;let i=n==="move"&&a!==void 0?a:G(t.floor,o);return i===void 0?!1:(t.select({kind:"room",roomId:i.id}),this.moveDrag(t,e,i,o),!0)}moveDrag(t,e,o,n){let a=t.doc,i=o.id,r=oe(o.outline),s=[0,0];t.drag(e,{move:(d,p)=>{let m=d[0]-n[0],c=d[1]-n[1];if(t.toggles.grid&&r!==void 0){let u=Ut;m=Math.round((r.minX+m)/u)*u-r.minX,c=Math.round((r.minY+c)/u)*u-r.minY}if(this.guides=[],t.toggles.snap&&!p.altKey){let u=Ho(a,i,m,c);u!==void 0&&(m=u.dx,c=u.dy,this.guides=u.guides)}this.dragging=!0,s=[m,c],t.preview(u=>me(u,i,m,c))},end:(d,p,m)=>{this.guides=[],this.dragging=!1,t.preview(void 0);let[c,u]=s;m&&(Math.abs(c)>=.005||Math.abs(u)>=.005)&&t.apply(g=>me(g,i,c,u),{select:{kind:"room",roomId:i}})}})}turnDrag(t,e,o,n){let a=o.id,i=Q(o),r=Math.atan2(n[1]-i[1],n[0]-i[0]),s=0;t.drag(e,{move:(d,p)=>{let m=(Math.atan2(d[1]-i[1],d[0]-i[0])-r)*180/Math.PI;m=(m+540)%360-180,p.altKey||(m=Math.round(m/Mn)*Mn),this.dragging=!0,s=m,t.preview(c=>ie(c,a,m,i))},end:(d,p,m)=>{this.dragging=!1,t.preview(void 0),m&&Math.abs(s)>.01&&t.apply(c=>ie(c,a,s,i),{select:{kind:"room",roomId:a}})}})}hover(t,e){this.draw.hover(t,e)}keyDown(t,e){if(this.draw.active)return this.draw.keyDown(t,e);let o=this.focus(t);if(o===void 0)return!1;let n=Z(e,!1);if(n==="delete")return this.askDelete(t,o),!0;if(typeof n=="object"&&"nudge"in n){let[a,i]=n.nudge;return t.apply(r=>me(r,o.id,a,i)),!0}return!1}cursor(){return this.draw.active?"crosshair":void 0}leave(t){this.draw.stop(t),this.guides=[],this.dragging=!1}dock(t){return h`<button type="button" class="hme-tb ${t.toggles.snap?"on":""}" aria-pressed=${t.toggles.snap?"true":"false"}
        title="A dragged room lines up with the walls round it. Hold Alt to move it freely." @click=${()=>t.setToggle("snap",!t.toggles.snap)}>Snap to walls</button>
      <button type="button" class="hme-tb ${t.toggles.grid?"on":""}" aria-pressed=${t.toggles.grid?"true":"false"}
        @click=${()=>t.setToggle("grid",!t.toggles.grid)}>Grid 10 cm</button>`}pill(t){if(this.draw.active)return h`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?h`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(t)}}>Close the room</button>`:f}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(t)}>Cancel</button>`;let e=this.focus(t);if(e===void 0||this.dragging)return f;let o=e.id;return h`<span class="hme-pill-name">${I(e)}</span>
      <button type="button" class="hme-tb" @click=${()=>t.apply(n=>ie(n,o,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" @click=${()=>t.apply(n=>q(n,o))}>Square the corners</button>
      <button type="button" class="hme-tb" title="Turn it to the floor's walls and slide it onto the nearest wall line, as the iPhone does"
        @click=${()=>t.apply(n=>Eo(n,o))}>Snap to walls</button>
      ${this.floorMenu(t,e,"Move to floor","hme-tb")}
      <button type="button" class="hme-tb danger" @click=${()=>{this.askDelete(t,e)}}>Delete</button>`}floorMenu(t,e,o,n){let a=t.doc.floors.filter(i=>!x(i.id,t.floor.id));return Kt({label:o,cls:n,options:[...a.map(i=>({value:i.id,label:O(i)})),{value:"new",label:"New floor\u2026"}],pick:i=>{this.moveToFloor(t,e,i)}})}async moveToFloor(t,e,o){let n=e.id,a={kind:"room",roomId:n};if(o!=="new"){t.apply(d=>St(d,n,{floorId:o}),{select:a,floorId:o});return}let i=Math.max(...t.doc.floors.map(d=>d.story))+1,r=await t.ask({title:"A new floor",label:"Name",value:i===1?"Upstairs":`Floor ${i+1}`,ok:"Move the room there"});if(r===void 0)return;let s=t.newId();t.apply(d=>St(d,n,{newFloor:{id:s,name:r,story:i}}),{select:a,floorId:s})}async askDelete(t,e){let o=he(t.floor,e.id).length;await t.confirm({title:`Delete ${I(e)}?`,text:Zn(e,o),ok:"Delete room",danger:!0})&&t.apply(a=>So(a,e.id),{select:null})}inspector(t){let e=this.focus(t);if(e===void 0)return this.floorCard(t,t.floor);let o=e.id,n=dt(e),a=lo(t.floor,t.toggles.live?t.hass?.states:void 0).has(e.id),i=he(t.floor,o),r=oe(e.outline)??{minX:0,minY:0,maxX:0,maxY:0},s=Math.round(-xo(e)*10)/10,d=e.areaId===void 0||t.areas.some(c=>c.id===e.areaId),p=e.pageId===void 0||t.pages.some(c=>x(c.id,e.pageId)),m=qe(e);return h`
      <section class="hme-card hme-head">
        ${fn(e,a)}
        <div class="hme-head-t">
          <strong>${I(e)}</strong>
          <span>${O(t.floor)} · ${Re(e)} · ${n.area.toFixed(1)} m²</span>
        </div>
      </section>

      ${H("Room",h`
        ${P("Name",Ce({value:e.name??"",label:"Name",placeholder:"Room",set:c=>t.apply(u=>Io(u,o,c))}))}
        ${P("Area",ye({label:"Area",value:e.areaId??"",options:[{value:"",label:"None"},...d?[]:[{value:e.areaId,label:`Not in Home Assistant (${e.areaId})`,disabled:!0}],...t.areas.map(c=>({value:c.id,label:c.name}))],set:c=>t.apply(u=>Ro(u,o,c===""?void 0:c))}))}
        ${N("The Home Assistant area. Its devices show first in Devices.")}
        ${P("Tap opens",ye({label:"Tap opens",value:e.pageId??"",options:[{value:"",label:"Nothing"},...p?[]:[{value:e.pageId,label:"A page not in your library",disabled:!0}],...t.pages.map(c=>({value:c.id,label:`Page: ${c.name}`}))],set:c=>t.apply(u=>Co(u,o,c===""?void 0:c))}))}
        ${N("What a tap on this room does on the map tiles and the watch.")}`)}

      ${H("Place",h`
        ${P("Left, top",_({label:"Left",value:r.minX,unit:"m",set:c=>t.apply(u=>me(u,o,c-r.minX,0))}),_({label:"Top",value:r.minY,unit:"m",set:c=>t.apply(u=>me(u,o,0,c-r.minY))}))}
        ${P("Turn",_({label:"Turn",value:s,unit:"\xB0",digits:1,min:-180,max:180,width:"92px",set:c=>t.apply(u=>ie(u,o,c-s))}),h`<button type="button" class="hme-tb" @click=${()=>t.apply(c=>ie(c,o,-90))}>−90°</button>
            <button type="button" class="hme-tb" @click=${()=>t.apply(c=>ie(c,o,90))}>+90°</button>
            <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>t.apply(c=>ko(c,o))}>Level</button>`)}
        ${P("Size",h`<span class="hme-in hme-ro mono">${be(n.width)}</span><span class="hme-in hme-ro mono">${be(n.depth)}</span>`)}
        ${N("Drag a room on the plan. It snaps to the walls of the rooms around it. Hold Alt to move it freely.")}
        ${P("Floor",ye({label:"Floor",value:t.floor.id,options:[...t.doc.floors.map(c=>({value:c.id,label:O(c)})),{value:"new",label:"New floor\u2026"}],set:c=>{this.moveToFloor(t,e,c)}}))}
        ${P("Wall height",_({label:"Wall height",value:e.height,unit:"m",min:.5,max:20,set:c=>t.apply(u=>ke(u,o,c))}))}`)}

      ${H("Floor finish",h`<div class="hme-pics">
        ${V({label:`Auto: ${De[m]}`,picture:jt(m),on:e.finish===void 0,title:"Picked from the room's name and furniture",click:()=>t.apply(c=>ce(c,o,void 0))})}
        ${Fe.map(c=>V({label:De[c],picture:jt(c),on:e.finish===c,click:()=>t.apply(u=>ce(u,o,c))}))}
      </div>`)}

      ${H("In this room",h`
        ${e.objects.length===0?h`<p class="hme-empty-line">No things. Add a sofa, a bed or stairs so the map reads.</p>`:f}
        ${e.objects.map((c,u)=>h`<div class="hme-r tight"><span class="hme-grow ${c.hidden===!0?"dim":""}">${le(c.kind)}</span>
          ${Wt({on:c.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${le(c.kind)} shown`,click:()=>t.apply(g=>It(g,o,u,c.hidden!==!0))})}
          <button type="button" class="hme-x" aria-label=${`Remove ${le(c.kind)}`} title="Remove" @click=${()=>t.apply(g=>Ao(g,o,u))}>×</button></div>`)}
        ${e.openings.length>0?h`<div class="hme-r tight"><span class="hme-grow">${[...new Set(e.openings.map(se))].join(", ")}</span>
          <button type="button" class="hme-link" @click=${()=>t.setMode("shape",{kind:"room",roomId:o})}>Shape ›</button></div>`:f}
        <div class="hme-r tight"><span class="hme-grow">${i.length===0?"No devices":i.slice(0,3).map(c=>L(c,t.hass)).join(", ")+(i.length>3?"\u2026":"")}</span>
          <button type="button" class="hme-link" @click=${()=>t.setMode("devices",{kind:"room",roomId:o})}>${R(i.length,"device")} ›</button></div>
        <div class="hme-row-end">
          ${Kt({label:"\uFF0B Add a thing",cls:"hme-tb",options:Do.map(c=>({value:c,label:le(c)})),pick:c=>{let u=W(e)??Q(e);t.apply(g=>Oo(g,o,c,u))}})}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(t,e)}}>Delete room</button>
        </div>`)}`}floorCard(t,e){let o=We(e,t.toggles.live?t.hass?.states:void 0);return h`${H("Floor",h`
        ${P("Name",Ce({value:e.name,label:"Floor name",placeholder:O(e),set:n=>t.apply(a=>Ye(a,e.id,n))}))}
        ${P("On it",h`<span class="hme-val">${R(e.rooms.length,"room")} · ${R(e.pins.length,"device")} · ${Ge(o)}</span>`)}`)}
      ${H("Arrange",h`<p class="hme-text">Pick a room on the plan or in the list to move it, turn it, or change its name, area and floor.</p>
        <p class="hme-text dim">Drag a room to move it; it lines up with the walls of the rooms round it. Drag the round handle above it to turn it. Undo with ${pn()}.</p>`)}`}};var ct="application/x-wa-home-map-entity",Jn=new Set(["light","switch","fan","climate","humidifier","water_heater","sensor","binary_sensor","media_player","lock","cover","valve","camera","vacuum","alarm_control_panel","siren","input_boolean","remote"]);function Qn(l,t){let e=l?.entities?.[t];if(e===void 0)return;if(typeof e.area_id=="string"&&e.area_id!=="")return e.area_id;let o=e.device_id?l?.devices?.[e.device_id]:void 0;return typeof o?.area_id=="string"&&o.area_id!==""?o.area_id:void 0}function xn(l){let t=[];for(let[e,o]of Object.entries(l?.states??{})){let n=l?.entities?.[e];if(n?.hidden===!0)continue;let a=o?.attributes?.friendly_name,i=Qn(l,e),r=i===void 0?void 0:l?.areas?.[i]?.name?.trim()||i,s=o?.attributes?.device_class;t.push({entityId:e,name:typeof a=="string"&&a.trim()!==""?a.trim():e,domain:e.slice(0,e.indexOf(".")),areaId:i,areaName:r,deviceClass:typeof s=="string"?s:void 0,category:typeof n?.entity_category=="string"?n.entity_category:void 0})}return t.sort((e,o)=>e.name.localeCompare(o.name)||e.entityId.localeCompare(o.entityId))}function ei(l){return new Set(l.floors.flatMap(t=>t.pins.map(e=>e.entityId)))}function kn(l,t,e){let o=ei(l),n=new Map;for(let i of e){if(o.has(i.entityId)||i.areaId===void 0||i.category!==void 0||!Jn.has(i.domain))continue;let r=n.get(i.areaId);r===void 0&&n.set(i.areaId,r={areaId:i.areaId,name:i.areaName??i.areaId,here:!1,devices:[]}),r.devices.push(i)}let a=t.rooms.map(i=>i.areaId).filter(i=>i!==void 0);for(let i of n.values())i.here=a.includes(i.areaId);return[...n.values()].sort((i,r)=>{let s=a.indexOf(i.areaId),d=a.indexOf(r.areaId);return s>=0||d>=0?(s<0?1/0:s)-(d<0?1/0:d):i.name.localeCompare(r.name)})}function Hn(l,t){let e=new Set(l.rooms.map(o=>o.areaId).filter(o=>o!==void 0));return t.filter(o=>e.has(o.areaId)).reduce((o,n)=>o+n.devices.length,0)}function En(l,t,e=40){let o=t.toLowerCase().split(/\s+/).filter(r=>r!=="");if(o.length===0)return[];let n=r=>`${r.name} ${r.entityId} ${r.areaName??""}`.toLowerCase(),a=l.filter(r=>o.every(s=>n(r).includes(s))),i=t.trim().toLowerCase();return a.sort((r,s)=>+!r.name.toLowerCase().startsWith(i)-+!s.name.toLowerCase().startsWith(i)).slice(0,e)}var ti=[["lights","Lights"],["climate","Climate"],["sensors","Sensors"],["power","Power"],["media","Media"],["security","Security"],["covers","Covers"],["other","Other"]];function ut(l){switch(l.slice(0,l.indexOf("."))){case"light":return"lights";case"climate":case"fan":case"humidifier":case"water_heater":return"climate";case"sensor":case"binary_sensor":return"sensors";case"switch":case"input_boolean":return"power";case"media_player":case"remote":return"media";case"lock":case"camera":case"alarm_control_panel":case"siren":return"security";case"cover":case"valve":return"covers";default:return"other"}}function Pn(l){let t=new Map;for(let e of l.pins){let o=ut(e.entityId);t.set(o,(t.get(o)??0)+1)}return ti.filter(([e])=>t.has(e)).map(([e,o])=>({kind:e,label:o,count:t.get(e)}))}function Tn(l){return l.replace(/_/g," ")}function Oe(l,t){let e=t?.[l];if(e===void 0)return"gone";let o=String(e.state??""),n=l.slice(0,l.indexOf(".")),a=e.attributes??{};if(n==="light"&&o==="on"&&typeof a.brightness=="number")return`on \xB7 ${Math.round(a.brightness/255*100)}%`;if(n==="climate"&&typeof a.current_temperature=="number")return`${o} \xB7 ${a.current_temperature}\xB0`;let i=typeof a.unit_of_measurement=="string"?a.unit_of_measurement:"";return i!==""&&o!==""&&Number.isFinite(Number(o))?`${o} ${i}`.replace(" \xB0","\xB0").replace(" %","%"):o.replace(/_/g," ")}function Sn(l){return["light","switch","fan","input_boolean","media_player","cover","humidifier","siren"].includes(l.slice(0,l.indexOf(".")))}function In(l,t){let e=String(t?.[l]?.state??"");return l.startsWith("cover.")?e==="open"||e==="opening"?"Close":"Open":e==="on"||e==="playing"||e==="paused"||e==="idle"?"Turn off":"Turn on"}var Rn=[["Floor",.3],["Table",.8],["Wall",1.6],["Ceiling",2.5]],Cn=[[void 0,"As the tile does"],["toggle","Turn on or off"],["details","Show details"],["page","Open a page"],["none","Nothing"]];function Xt(l,t){for(let e of l.floors){let o=e.pins.find(n=>n.entityId===t);if(o!==void 0)return{floorId:e.id,pinId:o.id}}}function Dn(l,t){return t===void 0?void 0:l.rooms.find(e=>e.areaId!==void 0&&e.areaId===t)}var oi=15,ft=Math.PI/4,On=8,qt="#ffbf55",$=l=>l.toFixed(1);function ni(l,t){return`${Tn(l.domain)} \xB7 ${Oe(l.entityId,t)}`}function ii(l,t){let e=Me(l,t);if(e===void 0)return"Not in a room";let o=G(l,t.at);return o!==void 0&&x(o.id,e.id)?`${I(e)} (found by place)`:I(e)}function ai(l,t,e){return l.icon!==void 0?at[l.icon]:`Auto (${at[Te(l.entityId,t,e)].toLowerCase()})`}var gt=class{constructor(){this.id="devices";this.drawsPins=!0;this.query="";this.side=!0;this.names=!1;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1}states(t){return t.toggles.live?t.hass?.states:void 0}picked(t){let e=t.selection;return e?.kind==="pin"?t.floor.pins.find(o=>x(o.id,e.pinId)):void 0}deviceClass(t,e){let o=t.hass?.states?.[e]?.attributes?.device_class;return typeof o=="string"?o:void 0}friendly(t,e){let o=t.hass?.states?.[e]?.attributes?.friendly_name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0}place(t,e,o,n){let a=Xt(t.doc,e);if(a!==void 0)return x(a.floorId,t.floor.id)||t.setFloor(a.floorId),t.select({kind:"pin",pinId:a.pinId}),!1;let i=Dn(t.floor,n),r=o??(i===void 0?lt(t.view,[t.stage.width/2,t.stage.height/2]):W(i)??Q(i)),s=t.newId().toUpperCase(),d=t.floor.id,p=this.friendly(t,e),m=t.apply(c=>jo(c,d,{id:s,entityId:e,at:[r[0],r[1]],...p===void 0?{}:{name:p}}),{select:{kind:"pin",pinId:s}});return m||t.note("warn","That device could not be put on the map: the map holds at most 400 devices."),m}placeAll(t,e){let o=e.map(a=>({entityId:a.entityId,areaId:a.areaId,name:a.name,deviceClass:a.deviceClass})),n=t.floor.id;t.apply(a=>Uo(a,n,o,()=>t.newId())?.doc,{select:null})}rail(t){let e=t.hass?.states,o=xn(t.hass),n=kn(t.doc,t.floor,o),a=n.reduce((p,m)=>p+m.devices.length,0),i=Hn(t.floor,n),r=En(o,this.query),s=Pn(t.floor),d=t.floor.pins.filter(p=>this.filter===void 0||ut(p.entityId)===this.filter);return h`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find any device" aria-label="Find any device" .value=${A(this.query)}
          @input=${p=>{this.query=p.target.value,t.redraw()}} /></label>
      ${this.query.trim()===""?f:H("Found",h`
        ${r.length===0?h`<p class="hme-empty-line">No device by that name.</p>`:f}
        ${r.map(p=>this.deviceRow(t,p,e))}`,r.length>=40?"40+":String(r.length),"hme-tray")}
      ${H("Not on the map",h`
        ${a===0?h`<p class="hme-empty-line">Every device with an area is on the map. Find any other above.</p>`:f}
        ${n.map(p=>h`<div class="hme-ar ${p.here?"":"dim"}">${p.name}<span>${p.devices.length}</span></div>
          ${p.devices.map(m=>this.deviceRow(t,m,e))}`)}
        ${a===0?f:h`<button type="button" class="hme-tb hme-wide" ?disabled=${i===0}
            title=${i===0?"Link this floor's rooms to Home Assistant areas in Arrange first":""}
            @click=${()=>this.placeAll(t,n.flatMap(p=>p.devices))}>Place all ${i} by area</button>
          <p class="hme-foot">Each goes into the room linked to its area, at a good height for its kind. Then drag to fine tune.</p>`}`,String(a),"hme-tray")}
      ${H("On the map",h`
        ${s.length===0?h`<p class="hme-empty-line">No devices on this floor yet. Drag one onto the plan.</p>`:h`<div class="hme-chips">
          ${s.map(p=>h`<button type="button" class="hme-chip sel ${this.filter===p.kind?"on":""}" aria-pressed=${this.filter===p.kind?"true":"false"}
            @click=${()=>{this.filter=this.filter===p.kind?void 0:p.kind,t.redraw()}}>${p.label} ${p.count}</button>`)}</div>`}
        ${d.slice(0,60).map(p=>{let m=t.selection?.kind==="pin"&&x(t.selection.pinId,p.id);return h`<button type="button" class="hme-lay ${m?"on":""}" @click=${()=>t.select({kind:"pin",pinId:p.id})}>
            <span class="hme-dot dev ${ee(p.entityId,e).kind==="light"?"":"gray"}"></span>${L(p,t.hass)}
            <span class="n">${Oe(p.entityId,e)}</span></button>`})}`,String(t.floor.pins.length))}`}deviceRow(t,e,o){let n=Xt(t.doc,e.entityId),a=Te(e.entityId,e.deviceClass,e.name);return h`<div class="hme-dv ${this.dragging===e.entityId?"dragging":""} ${n===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${n===void 0?"true":"false"} title=${n===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it"}
      @dragstart=${i=>{i.dataTransfer?.setData(ct,e.entityId),i.dataTransfer?.setData("text/plain",e.entityId),i.dataTransfer&&(i.dataTransfer.effectAllowed="copy"),this.dragging=e.entityId,t.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,t.redraw()}}
      @click=${()=>this.place(t,e.entityId,void 0,e.areaId)}
      @keydown=${i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),this.place(t,e.entityId,void 0,e.areaId))}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${fe(a,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${e.name}<small>${n===void 0?ni(e,o):"on the map"}</small></span>
      <span class="hme-dv-grip" aria-hidden="true">${n===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}dragOver(t,e,o){let n=this.dragging!==void 0||[...o.dataTransfer?.types??[]].includes(ct),a=this.dropAt;return this.dropAt=n?e:void 0,a!==this.dropAt&&t.redraw(),n&&e!==void 0}drop(t,e,o){let n=this.dragging??o.dataTransfer?.getData(ct)??"";this.dragging=void 0,this.dropAt=void 0,n!==""?this.place(t,n,e):t.redraw()}overlay(t){let e=this.states(t),o=this.picked(t),n=[];this.dropAt!==void 0&&n.push(this.dropMark(t,this.dropAt));let a=o===void 0?void 0:ee(o.entityId,e);o!==void 0&&a?.kind==="light"&&n.push(this.glowRing(t,o,a.on?a.brightness:void 0));for(let i of t.floor.pins){let r=o!==void 0&&x(i.id,o.id),s=this.filter!==void 0&&ut(i.entityId)!==this.filter;n.push(this.pinMark(t,i,r,s,e))}return y`${n}`}pinMark(t,e,o,n,a){let[i,r]=t.toScreen(e.at),s=ee(e.entityId,a),d=s.kind==="light"&&s.on,p=d?Se(e)??qt:"rgba(36,36,40,0.92)",m=d?"#fff3d6":s.kind==="gone"?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.4)",c=d?"#3a2600":s.kind==="lock"?s.locked?"#30d158":"#ff9f0a":s.kind==="other"&&s.on?"#ffffff":s.kind==="gone"?"#8e8e93":"#d1d1d6",u=e.icon??Te(e.entityId,this.deviceClass(t,e.entityId),this.friendly(t,e.entityId)),g=o?13:12,v=o||this.names?L(e,t.hass):Jo(e,a),w=v===void 0?0:v.length*5.9+14;return y`<g class="hme-pin" data-hme="pin" data-pin=${e.id} transform=${`translate(${$(i)} ${$(r)})`} opacity=${n?.25:1} style="cursor:grab">
      ${o?y`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:f}
      ${d?y`<circle r=${g+7} fill=${p} opacity="0.22" />`:f}
      <circle r=${g} fill=${p} stroke=${m} stroke-width="1.2" />
      <g transform="translate(-7 -7)">${fe(u,c,14,1.5)}</g>
      ${v===void 0||v===""?f:y`<g pointer-events="none"><rect x=${$(-w/2)} y=${g+4} width=${$(w)} height="16" rx="8" fill=${o?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text y=${g+15.5} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${v}</text></g>`}
    </g>`}glowRing(t,e,o){let[n,a]=t.toScreen(e.at),i=rt(e,o),r=t.px(i),s=[n+r*Math.cos(ft),a+r*Math.sin(ft)],d=`Glow ${i.toFixed(1)} m`,p=d.length*6.2+18;return y`<g class="hme-glow-ring">
      <circle cx=${$(n)} cy=${$(a)} r=${$(r)} fill="none" stroke=${Se(e)??"#5b8def"} stroke-width="1.4" stroke-dasharray="5 5" pointer-events="none" />
      <circle data-hme="glow" cx=${$(s[0])} cy=${$(s[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${$(s[0]-p/2)} y=${$(s[1]+12)} width=${$(p)} height="18" rx="9" fill="#5b8def" />
        <text x=${$(s[0])} y=${$(s[1]+25)} fill="#fff" text-anchor="middle">${d}</text></g>
    </g>`}dropMark(t,e){let o=G(t.floor,e),[n,a]=t.toScreen(e),i=o===void 0?"Drop here, in no room":`Drop in ${I(o)}`,r=i.length*6.4+20;return y`<g class="hme-drop" pointer-events="none">
      ${o===void 0?f:y`<polygon points=${o.outline.map(s=>t.toScreen(s).map($).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${$(n)} cy=${$(a)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${$(n-r/2)} y=${$(a+20)} width=${$(r)} height="18" rx="9" fill="#5b8def" />
        <text x=${$(n)} y=${$(a+33)} fill="#fff" text-anchor="middle">${i}</text></g>
    </g>`}pinAt(t,e){let o,n=oi;for(let a of t.floor.pins){let i=t.toScreen(a.at),r=Math.hypot(i[0]-e[0],i[1]-e[1]);r<=n&&(o=a,n=r)}return o}pointerDown(t,e,o){if(e.button!==0)return!1;let n=t.toScreen(o),a=this.picked(t),i=a===void 0?void 0:ee(a.entityId,this.states(t));if(a!==void 0&&i?.kind==="light"){let[s,d]=t.toScreen(a.at),p=t.px(rt(a,i.on?i.brightness:void 0));if(Math.hypot(n[0]-(s+p*Math.cos(ft)),n[1]-(d+p*Math.sin(ft)))<=10)return this.glowDrag(t,e,a),!0}let r=this.pinAt(t,n);return r===void 0?!1:(t.select({kind:"pin",pinId:r.id}),this.pickPage=!1,this.iconsOpen=!1,this.moveDrag(t,e,r,o),!0)}moveDrag(t,e,o,n){let a=o.id,i=[o.at[0],o.at[1]],r=i;t.drag(e,{move:s=>{this.moving=!0,r=[i[0]+s[0]-n[0],i[1]+s[1]-n[1]],t.preview(d=>ot(d,a,r))},end:(s,d,p)=>{this.moving=!1,t.preview(void 0),p&&Math.hypot(r[0]-i[0],r[1]-i[1])>=.005&&t.apply(m=>ot(m,a,r),{select:{kind:"pin",pinId:a}})}})}glowDrag(t,e,o){let n=o.id,a;t.drag(e,{move:i=>{this.moving=!0;let r=Math.hypot(i[0]-o.at[0],i[1]-o.at[1]);a=Math.min(Math.max(Math.round(r/.05)*.05,Ne),ro);let s=a;t.preview(d=>Ee(d,n,{glow:s}))},end:()=>{this.moving=!1,t.preview(void 0);let i=a;i!==void 0&&t.apply(r=>Ee(r,n,{glow:i}))}})}keyDown(t,e){let o=this.picked(t);if(o===void 0)return!1;let n=Z(e,!1);if(n==="delete")return t.apply(a=>nt(a,o.id),{select:null}),!0;if(typeof n=="object"&&"nudge"in n){let[a,i]=n.nudge;return t.apply(r=>ot(r,o.id,[o.at[0]+a,o.at[1]+i])),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1}dock(t){let e=(o,n,a,i)=>h`<button type="button" class="hme-tb ${n?"on":""}"
      aria-pressed=${n?"true":"false"} title=${i} @click=${()=>{a(),t.redraw()}}>${o}</button>`;return h`${e("Side view",this.side,()=>{this.side=!this.side},"The picked device's room from the side, to set its height")}
      ${e("Names",this.names,()=>{this.names=!this.names},"Every device's name under its pin")}`}stageExtra(t){let e=this.picked(t);if(!this.side||e===void 0)return f;let o=Me(t.floor,e),n=o?.height??2.5,a=oe(o?.outline??t.floor.rooms.flatMap(k=>k.outline))??{minX:e.at[0]-1,maxX:e.at[0]+1,minY:0,maxY:0},i=18,r=118,s=(r-i)/Math.max(n,.5),d=30,p=262,m=(p-d)/Math.max(a.maxX-a.minX,.5),c=k=>d+(Math.min(Math.max(k,a.minX),a.maxX)-a.minX)*m,u=e.at[2],g=r-Math.min(Math.max(u,0),n)*s,v=c(e.at[0]),w=(()=>{let k=ee(e.entityId,this.states(t));return k.kind==="light"&&k.on})(),M=[];for(let k=0;k<=n+1e-9;k+=1)M.push(k);let S=o===void 0?[]:so(o),z=o===void 0?"No room":I(o);return h`<div class="hme-side">
      <div class="hme-h">${z} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${L(e,t.hass)} at ${u.toFixed(2)} m, the wall ${n.toFixed(1)} m tall`}
        @pointerdown=${k=>this.heightDrag(t,k,e,n,r,s)}>
        <path d=${`M${d} ${$(i)}H${p}M${d} ${r}H${p}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${d} ${$(i)}V${r}M${p} ${$(i)}V${r}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${M.map(k=>y`<text x=${d-6} y=${$(r-k*s+3)}>${k===0?"0":`${k} m`}</text>
            <path d=${`M${d-4} ${$(r-k*s)}H${d}`} stroke="#8e8e93" />`)}
        </g>
        ${S.map(k=>{let j=c(k.c[0]-k.size[0]/2),B=c(k.c[0]+k.size[0]/2),K=Math.min(k.size[2],n)*s;return y`<rect x=${$(j)} y=${$(r-K)} width=${$(Math.max(B-j,2))} height=${$(K)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${$(v)} ${r}V${$(g)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${w?y`<circle cx=${$(v)} cy=${$(g)} r="20" fill="#ffb648" opacity="0.22" />`:f}
        <circle cx=${$(v)} cy=${$(g)} r="9" fill=${w?qt:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${$(Math.min(v+14,222))} y=${$(g-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${$(Math.min(v+14,222)+22)} y=${$(g+3.5)} fill="#fff" font-size="10" text-anchor="middle">${u.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(t,e,o,n,a,i){if(e.button!==0)return;let r=e.currentTarget,s=o.id,d=u=>{let g=r.getBoundingClientRect(),v=(u.clientY-g.top)*130/Math.max(g.height,1);return Math.min(Math.max(Math.round((a-v)/i/.05)*.05,0),n)},p=d(e);try{r.setPointerCapture(e.pointerId)}catch{}this.moving=!0,t.preview(u=>Y(u,s,p));let m=u=>{p=d(u);let g=p;t.preview(v=>Y(v,s,g))},c=()=>{r.removeEventListener("pointermove",m),r.removeEventListener("pointerup",c),r.removeEventListener("pointercancel",c),this.moving=!1,t.preview(void 0);let u=p;Math.abs(u-o.at[2])>=.005&&t.apply(g=>Y(g,s,u))};r.addEventListener("pointermove",m),r.addEventListener("pointerup",c),r.addEventListener("pointercancel",c)}pill(t){let e=this.picked(t);if(e===void 0||this.moving)return f;let o=e.id,n=e.entityId.startsWith("light."),a=Me(t.floor,e)!==void 0;return h`<span class="hme-pill-name">${L(e,t.hass)}</span>
      ${Sn(e.entityId)&&t.hass!==void 0?h`<button type="button" class="hme-tb" @click=${()=>this.toggle(t,e.entityId)}>${In(e.entityId,t.hass.states)}</button>`:f}
      ${n?h`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>t.apply(i=>Bo(i,o))}>Same height for all lights</button>`:f}
      ${a?h`<button type="button" class="hme-tb" @click=${()=>t.apply(i=>Vo(i,o))}>Center in room</button>`:f}
      <button type="button" class="hme-tb danger" @click=${()=>t.apply(i=>nt(i,o),{select:null})}>Remove</button>`}toggle(t,e){let o=t.hass;o!==void 0&&to(o,"homeassistant","toggle",{entity_id:e}).catch(n=>{t.note("err",`Could not turn it on or off: ${n instanceof Error?n.message:String(n)}`)})}inspector(t){let e=this.picked(t);if(e===void 0)return this.overview(t);let o=t.hass?.states,n=e.id,a=ee(e.entityId,o),i=a.kind==="light"&&a.on,r=this.friendly(t,e.entityId),s=this.deviceClass(t,e.entityId),d=Te(e.entityId,s,r),p=e.icon??d,c=Me(t.floor,e)?.height??2.5,u=w=>t.apply(M=>Ee(M,n,w,r)),v=Se(e)??qt;return h`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${i?"lit":""}" style=${i?`background:${v};box-shadow:0 0 24px ${v}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${fe(p,i?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${L(e,t.hass)}</strong>
          <span class="mono">${e.entityId}</span>
        </div>
        <span class="hme-state ${i?"lit":""}">${Oe(e.entityId,o)}</span>
      </section>

      ${H("On the map",h`
        ${P("Name",Ce({value:e.name??"",label:"Name on the map",placeholder:r??e.entityId,set:w=>u({name:w.trim()===""?null:w})}))}
        ${P("Icon",h`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
          @click=${()=>{this.iconsOpen=!this.iconsOpen,t.redraw()}}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${fe(p,"currentColor",24,2)}</svg>
          <span class="hme-grow">${ai(e,s,r)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
        ${this.iconsOpen?this.iconMenu(t,e,d,u):f}
        ${P("Room",h`<span class="hme-in hme-ro">${ii(t.floor,e)}</span>`)}
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${V({label:"None",picture:Yt("none",v),on:e.reading==="none",click:()=>u({reading:"none"})})}
          ${V({label:"Pill",picture:Yt("pill",v),on:e.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>u({reading:null})})}
          ${V({label:"Name",picture:Yt("name",v),on:e.reading==="name",click:()=>u({reading:"name"})})}
        </div></div>`)}

      ${H("Height",h`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${c} step="0.05" .value=${A(String(e.at[2]))} aria-label="Height" style=${xe(e.at[2],0,c)}
            @input=${w=>{let M=Number(w.target.value);t.preview(S=>Y(S,n,M))}}
            @change=${w=>{let M=Number(w.target.value);t.apply(S=>Y(S,n,M))}} />
          ${_({label:"Height",value:e.at[2],unit:"m",min:0,max:100,width:"92px",set:w=>t.apply(M=>Y(M,n,w))})}
        </div>
        <div class="hme-chips">${Rn.map(([w,M])=>h`<button type="button" class="hme-chip sel ${Math.abs(e.at[2]-M)<.005?"on":""}"
          @click=${()=>t.apply(S=>Y(S,n,M))}>${w} ${M}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${e.entityId.startsWith("light.")?this.lightCard(t,e,a.kind==="light"&&a.on?a.brightness:void 0,u):f}

      ${this.tapCard(t,e,u)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>t.apply(w=>nt(w,n),{select:null})}>Remove from the map</button></div>`}iconMenu(t,e,o,n){let a=r=>{this.iconsOpen=!1,n({icon:r}),t.redraw()},i=(r,s,d,p)=>h`<button type="button" class="hme-icon-cell ${d?"on":""}"
      title=${s} aria-label=${s} aria-pressed=${d?"true":"false"} @click=${()=>a(p)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${fe(r,"currentColor",24,1.9)}</svg><span>${s}</span></button>`;return h`<div class="hme-icons" role="group" aria-label="Icon">
      ${i(o,"Auto",e.icon===void 0,null)}
      ${ao.map(r=>i(r,at[r],e.icon===r,r))}
    </div>`}lightCard(t,e,o,n){let a=e.id,i=rt(e,o),r=Se(e),s=(d,p,m)=>h`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"} @click=${m}>${d}</button>`;return H("Light",h`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${Ne} max=${Math.max(On,i)} step="0.05" .value=${A(String(i))} aria-label="Glow size"
          style=${xe(i,Ne,Math.max(On,i))}
          @input=${d=>{let p=Number(d.target.value);t.preview(m=>Ee(m,a,{glow:p}))}}
          @change=${d=>n({glow:Number(d.target.value)})} />
        <span class="hme-val mono hme-w48">${i.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${s("By its brightness",e.glow===void 0,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${s("Follow the light",e.glowColor===void 0,()=>n({glowColor:null}))}
        ${s("Warm",e.glowColor==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${r!==void 0?"on":""}">${r===void 0?f:h`<span class="hme-swatch" style=${`background:${r}`}></span>`}Pick
          <input type="color" .value=${A(r??"#ffb648")} aria-label="Pick the glow's color"
            @change=${d=>n({glowColor:d.target.value})} /></label>
      </div></div>
      ${N("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`)}tapCard(t,e,o){let n=e.tap==="page"||this.pickPage,a=e.pageId===void 0||t.pages.some(r=>x(r.id,e.pageId)),i=r=>{if(r==="page"){if(e.tap==="page")return;t.pages.length===1?o({tap:"page",pageId:t.pages[0].id}):(this.pickPage=!0,t.redraw());return}this.pickPage=!1,o({tap:r??null})};return H("Tap on the map",h`
      <div class="hme-chips">${Cn.map(([r,s])=>{let d=r==="page"?n:!this.pickPage&&e.tap===r;return h`<button type="button" class="hme-chip sel ${d?"on":""}" aria-pressed=${d?"true":"false"}
          ?disabled=${r==="page"&&t.pages.length===0} title=${r==="page"&&t.pages.length===0?"Your library has no pages":""}
          @click=${()=>i(r)}>${s}</button>`})}</div>
      ${n?P("Page",ye({label:"Page",value:e.tap==="page"?e.pageId??"":"",options:[...e.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...a?[]:[{value:e.pageId,label:"A page not in your library",disabled:!0}],...t.pages.map(r=>({value:r.id,label:r.name}))],set:r=>{this.pickPage=!1,r!==""&&o({tap:"page",pageId:r})}})):f}
      <p class="hme-text dim">${e.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":"Hold on the watch or iPhone: its controls."}</p>`)}overview(t){let e=ve(t.selection),o=e===void 0?void 0:t.floor.rooms.find(i=>x(i.id,e)),n=o===void 0?t.floor.pins:he(t.floor,o.id),a=t.hass?.states;return h`${H(o===void 0?"Devices":I(o),h`
        <p class="hme-text">${o===void 0?`${R(t.floor.pins.length,"device")} on this floor.`:`${R(n.length,"device")} in this room.`}</p>
        ${n.map(i=>h`<button type="button" class="hme-list-row" @click=${()=>t.select({kind:"pin",pinId:i.id})}>
          <span class="hme-grow">${L(i,t.hass)}</span><span class="hme-val">${Oe(i.entityId,a)}</span></button>`)}`)}
      ${H("Devices",h`<p class="hme-text">Pick a device on the plan to set its name, icon, height, glow and what a tap on it does.</p>
        <p class="hme-text dim">Drag a device from Not on the map onto the plan to place it. Drag a pin to move it; arrow keys nudge it, Delete takes it off the map.</p>`)}`}};function Yt(l,t){return h`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${l==="none"?20:16} r="9" fill=${t} />
    ${l==="pill"?y`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:f}
    ${l==="name"?y`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:f}
  </svg>`}var Fn=[{id:"select",label:"Walls and corners",key:"v"},{id:"draw",label:"Draw a room",key:"r"},{id:"split",label:"Split a room",key:"s"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"opening",label:"Way through (no door)",key:"o"},{id:"stairs",label:"Stairs",key:"t"}];function ri(l){return Fn.find(t=>t.key===l.toLowerCase())?.id}var si=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],li=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function di(l){return l===2?"Fix both":`Fix all ${li[l]??l}`}var pi=9,_n=18,b=l=>l.toFixed(1),_e=l=>`${l[0].toFixed(1)},${l[1].toFixed(1)}`,An=new WeakMap;function vt(l){let t=An.get(l);return t===void 0&&An.set(l,t=Wo(l)),t}function Zt(l,t,e,o){let n=e/l.view.scale,a=i=>{let r;for(let s of i)for(let[d,p]of F(s).entries()){let m=wo(t,p);m<=n&&(r===void 0||m<r.d)&&(r={room:s,wall:d,seg:p,d:m})}return r};return(o===void 0?void 0:a([o]))??a(l.floor.rooms)}function Ln(l,t){let e=Math.max(te(t),1e-9),o=[-(t.b[1]-t.a[1])/e,(t.b[0]-t.a[0])/e],n=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],a=W(l)??Q(l);return(a[0]-n[0])*o[0]+(a[1]-n[1])*o[1]>0&&(o=[-o[0],-o[1]]),o}var bt=class{constructor(){this.id="shape";this.tool="select";this.draw=new we(de);this.dragging=!1}setTool(t,e){this.first=void 0,e==="draw"?this.draw.start(t):this.draw.stop(),this.tool=e,t.redraw()}focus(t){let e=ve(t.selection);return e===void 0?void 0:t.floor.rooms.find(o=>x(o.id,e))}pickedWall(t,e){let o=t.selection;if(!(e===void 0||o===void 0)){if(o.kind==="wall")return o.wall;if(o.kind==="opening"){let n=e.openings[o.opening],a=n===void 0?-1:Ze(e,n);return a>=0?a:void 0}}}rail(t){let e=vt(t.floor),o=t.floor.id;return h`
      <section class="hme-card hme-tools">
        <div class="hme-h">Tools</div>
        ${Fn.map((n,a)=>h`${a===4?h`<div class="hme-sep"></div>`:f}
          <button type="button" class="hme-tool ${this.tool===n.id?"on":""}" aria-pressed=${this.tool===n.id?"true":"false"}
            @click=${()=>this.setTool(t,n.id)}>${hi[n.id]}${n.label}<kbd>${n.key.toUpperCase()}</kbd></button>`)}
      </section>
      ${H("Scan check",h`
        ${e.length===0?h`<p class="hme-text dim">Nothing to fix. The walls meet and every room has a way in.</p>`:f}
        ${e.map(n=>h`<div class="hme-fix">
          <span class="hme-fix-dot ${n.kind==="missingDoor"?"gray":""}"></span>
          <p @click=${()=>t.select({kind:"room",roomId:n.roomIds[0]})}><b>${n.title}</b> ${n.detail}</p>
          <button type="button" class="hme-tb" @click=${()=>t.apply(a=>n.fix(a))}>${n.fixLabel}</button></div>`)}
        ${e.length>1?h`<button type="button" class="hme-tb hme-wide" @click=${()=>t.apply(n=>Go(n,o))}>${di(e.length)}</button>`:f}`,e.length===0?void 0:h`<span class="hme-amber">${e.length} to fix</span>`)}`}overlay(t){if(this.tool==="draw")return this.draw.overlay(t);let e=this.focus(t),o=[];if(e!==void 0&&e.outline.length>=3){let n=e.outline.map(a=>_e(t.toScreen(a))).join("L");o.push(y`<path d=${`M0 0H${t.stage.width}V${t.stage.height}H0ZM${n}Z`} fill="rgba(0,0,0,0.45)" fill-rule="evenodd" pointer-events="none" />`)}return o.push(...this.issueMarks(t)),e!==void 0&&o.push(this.roomHandles(t,e)),o.push(...this.toolGhost(t)),y`${o}`}issueMarks(t){return vt(t.floor).map(e=>{let[o,n]=t.toScreen(e.where);if(e.kind==="offSquare"){let d=/(\d+)°/.exec(e.title)?.[1]??"";return y`<g class="hme-issue" data-hme=${`issue:${e.id}`} style="cursor:pointer"><title>${e.title} Click to square it.</title>
          <circle cx=${b(o)} cy=${b(n)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${b(o+12)} y=${b(n+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${b(o+34)} y=${b(n+20)} fill="#2a1a00" text-anchor="middle">${d}°</text></g></g>`}let a=`${Math.round(e.amount*100)} cm`,i=e.kind==="overlap"?`Overlap ${a} \xB7 ${e.fixLabel}`:e.kind==="gap"?`Gap ${a} \xB7 ${e.fixLabel}`:`No door \xB7 ${e.fixLabel}`,r=i.length*6.2+18,s=e.kind==="missingDoor";return y`<g class="hme-issue" data-hme=${`issue:${e.id}`} style="cursor:pointer"><title>${e.title} ${e.detail}</title>
        <circle cx=${b(o)} cy=${b(n)} r="4" fill=${s?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${b(o-r/2)} y=${b(n+8)} width=${b(r)} height="20" rx="10" fill=${s?"#8e8e93":"#ffb340"} />
        <text x=${b(o)} y=${b(n+22)} fill=${s?"#fff":"#2a1a00"} text-anchor="middle">${i}</text></g></g>`})}roomHandles(t,e){let o=F(e),n=t.selection,a=this.pickedWall(t,e),i=[];if(a!==void 0&&o[a]!==void 0){let s=o[a],d=t.toScreen(s.a),p=t.toScreen(s.b),m=Ln(e,s);if(i.push(y`<line x1=${b(d[0])} y1=${b(d[1])} x2=${b(p[0])} y2=${b(p[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),n?.kind==="wall"&&!this.dragging){let c=[(d[0]+p[0])/2+m[0]*22,(d[1]+p[1])/2+m[1]*22];i.push(y`<g class="hme-tag" pointer-events="none"><rect x=${b(c[0]-27)} y=${b(c[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${b(c[0])} y=${b(c[1]+4)} fill="#fff" text-anchor="middle">${te(s).toFixed(2)} m</text></g>`)}}for(let[s,d]of e.openings.entries()){let p=t.toScreen(d.a),m=t.toScreen(d.b),c=n?.kind==="opening"&&n.opening===s,u=d.kind==="window"?"#8bb8f0":d.kind==="door"?"#ece6da":"#98989d";i.push(y`<g data-hme=${`opening:${s}`} style="cursor:ew-resize">
        <line x1=${b(p[0])} y1=${b(p[1])} x2=${b(m[0])} y2=${b(m[1])} stroke=${c?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${b(p[0])} y1=${b(p[1])} x2=${b(m[0])} y2=${b(m[1])} stroke=${u} stroke-width="3" />
        ${c?y`<circle cx=${b(p[0])} cy=${b(p[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" /><circle cx=${b(m[0])} cy=${b(m[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" />`:f}
      </g>`)}let r=this.sliding!==void 0&&x(this.sliding.roomId,e.id)?this.sliding.index:n?.kind==="opening"?n.opening:void 0;if(r!==void 0&&e.openings[r]!==void 0&&i.push(this.distances(t,e,e.openings[r])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[s,d]of o.entries()){if(te(d)*t.view.scale<40)continue;let p=t.toScreen([(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2]);i.push(y`<circle data-hme=${`mid:${s}`} cx=${b(p[0])} cy=${b(p[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[s,d]of e.outline.entries()){let[p,m]=t.toScreen(d),c=n?.kind==="corner"&&n.corner===s;i.push(y`<circle data-hme=${`corner:${s}`} cx=${b(p)} cy=${b(m)} r="7" fill=${c?"#5b8def":"#fff"} stroke=${c?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return y`<g class="hme-handles">${i}</g>`}distances(t,e,o){let n=Ze(e,o),a=n>=0?F(e)[n]:void 0;if(a===void 0)return y``;let i=te(a),r=ne(o.a,a.a,a.b).along,s=ne(o.b,a.a,a.b).along,d=Math.max(0,Math.min(r,s)),p=Math.min(i,Math.max(r,s)),m=Ln(e,a),c=[(a.b[0]-a.a[0])/i,(a.b[1]-a.a[1])/i],u=M=>{let S=t.toScreen([a.a[0]+c[0]*M,a.a[1]+c[1]*M]);return[S[0]+m[0]*26,S[1]+m[1]*26]},g=[0,d,p,i],v=M=>`M${_e([M[0]-m[0]*5,M[1]-m[1]*5])}L${_e([M[0]+m[0]*5,M[1]+m[1]*5])}`,w=[[0,d,!1],[d,p,!0],[p,i,!1]];return y`<g class="hme-dist" pointer-events="none">
      <path d=${`M${_e(u(0))}L${_e(u(i))}${g.map(M=>v(u(M))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${w.filter(([M,S])=>S-M>.02).map(([M,S,z])=>{let k=u((M+S)/2);return y`<g class="hme-tag"><rect x=${b(k[0]-25)} y=${b(k[1]-9)} width="50" height="18" rx="9" fill=${z?"#5b8def":"#2c2c2e"} />
          <text x=${b(k[0])} y=${b(k[1]+4)} fill="#fff" text-anchor="middle">${(S-M).toFixed(2)} m</text></g>`})}
    </g>`}toolGhost(t){let e=this.hoverAt;if(e===void 0)return[];let o=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let n=Zt(t,e,_n,this.focus(t));if(n!==void 0){let a=this.tool==="window"?1.2:.9,i=te(n.seg),r=Math.min(a,i),s=Math.min(Math.max(ne(e,n.seg.a,n.seg.b).along,r/2),i-r/2),d=[(n.seg.b[0]-n.seg.a[0])/i,(n.seg.b[1]-n.seg.a[1])/i],p=t.toScreen([n.seg.a[0]+d[0]*(s-r/2),n.seg.a[1]+d[1]*(s-r/2)]),m=t.toScreen([n.seg.a[0]+d[0]*(s+r/2),n.seg.a[1]+d[1]*(s+r/2)]);o.push(y`<line x1=${b(p[0])} y1=${b(p[1])} x2=${b(m[0])} y2=${b(m[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&G(t.floor,e)!==void 0){let[n,a]=t.toScreen(e),i=t.px(1),r=t.px(2.6);o.push(y`<g pointer-events="none" opacity="0.7"><rect x=${b(n-i/2)} y=${b(a-r/2)} width=${b(i)} height=${b(r)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(s=>y`<line x1=${b(n-i/2)} x2=${b(n+i/2)} y1=${b(a-r/2+r*s/8)} y2=${b(a-r/2+r*s/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let n=t.toScreen(this.first.a),a=t.toScreen(this.snap(t,e,this.first.a));if(this.tool==="split"){let i=Math.max(Math.hypot(a[0]-n[0],a[1]-n[1]),1e-6),r=[(a[0]-n[0])/i,(a[1]-n[1])/i],s=Math.hypot(t.stage.width,t.stage.height);o.push(y`<line x1=${b(n[0]-r[0]*s)} y1=${b(n[1]-r[1]*s)} x2=${b(n[0]+r[0]*s)} y2=${b(n[1]+r[1]*s)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else o.push(y`<line x1=${b(n[0])} y1=${b(n[1])} x2=${b(a[0])} y2=${b(a[1])} stroke="#ece6da" stroke-width=${b(Math.max(t.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);o.push(y`<circle cx=${b(n[0])} cy=${b(n[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return o}snap(t,e,o){return Vt(t.floor,e,t.view.scale,{...o===void 0?{}:{from:o},...t.toggles.grid?{grid:de}:{}})}pointerDown(t,e,o){if(this.tool==="draw")return this.draw.pointerDown(t,e,o);if(e.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let n=Zt(t,o,_n,this.focus(t));if(n===void 0)return!1;let a=this.tool,i=n.room.id,r=n.room.openings.length,s=n.wall;return t.apply(d=>et(d,i,s,{kind:a,at:o}),{select:{kind:"opening",roomId:i,opening:r}})&&this.setTool(t,"select"),!0}case"stairs":{let n=G(t.floor,o);if(n===void 0)return!1;let a=n.id;return t.apply(i=>_o(i,a,o),{select:{kind:"room",roomId:a}})&&this.setTool(t,"select"),!0}case"split":case"inner":return this.twoPoints(t,o);default:return this.pick(t,e,o)}}twoPoints(t,e){if(this.first===void 0){let i=G(t.floor,e)??this.focus(t);return i===void 0?!1:(this.first={roomId:i.id,a:this.snap(t,e)},t.select({kind:"room",roomId:i.id}),!0)}let{roomId:o,a:n}=this.first,a=this.snap(t,e,n);if(this.first=void 0,Math.hypot(a[0]-n[0],a[1]-n[1])<.1)return t.redraw(),!0;if(this.tool==="inner"){let i=t.doc.floors.flatMap(s=>s.rooms).find(s=>x(s.id,o)),r=i===void 0?0:Ht(i).length;return t.apply(s=>zo(s,o,n,a),{select:{kind:"wall",roomId:o,wall:r}})?this.setTool(t,"select"):t.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(t,o,n,a),!0}async split(t,e,o,n){let a=t.floor.rooms.find(s=>x(s.id,e)),i=await t.ask({title:"Name the new room",label:"Name",value:a===void 0?"Room":`${I(a)} 2`,ok:"Split the room"});if(i===void 0)return;let r=t.newId();t.apply(s=>Ko(s,e,o,n,r,i),{select:{kind:"room",roomId:r}})?this.setTool(t,"select"):t.note("err","That line does not cut the room in two. Draw it right across the room.")}pick(t,e,o){let n=this.focus(t),a=e.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[i,r]=a.split(/:(.*)/s);if(i==="issue"){let m=vt(t.floor).find(c=>c.id===r);return m!==void 0&&t.apply(c=>m.fix(c)),!0}let s=Number(r);if(n!==void 0&&i==="corner"&&Number.isInteger(s))return this.cornerDrag(t,e,n,s),!0;if(n!==void 0&&i==="mid"&&Number.isInteger(s))return this.midDrag(t,e,n,s),!0;if(n!==void 0&&i==="opening"&&Number.isInteger(s))return this.openingDrag(t,e,n,s),!0;let d=Zt(t,o,pi,n);if(d!==void 0)return this.wallAt=ne(o,d.seg.a,d.seg.b).point,t.select({kind:"wall",roomId:d.room.id,wall:d.wall}),!0;let p=G(t.floor,o);return p===void 0?!1:(t.select({kind:"room",roomId:p.id}),!0)}cornerTo(t,e,o,n){let a=t.floor.rooms.filter(s=>!x(s.id,e.id)).flatMap(s=>s.outline),i=10/t.view.scale;for(let s of a)if(Math.hypot(s[0]-n[0],s[1]-n[1])<=i)return[s[0],s[1]];let r=n;if(t.toggles.grid&&(r=[Math.round(r[0]/de)*de,Math.round(r[1]/de)*de]),t.toggles.square){let s=Mo(t.floor.rooms.flatMap(w=>Ht(w))),d=Math.cos(s),p=Math.sin(s),m=w=>[w[0]*d+w[1]*p,-w[0]*p+w[1]*d],[c,u]=m(r),g=e.outline.length,v=8/t.view.scale;for(let w of[(o+g-1)%g,(o+1)%g]){let[M,S]=m(e.outline[w]);Math.abs(c-M)<=v&&(c=M),Math.abs(u-S)<=v&&(u=S)}r=[c*d-u*p,c*p+u*d]}return r}cornerDrag(t,e,o,n){let a=o.id,i;t.drag(e,{move:r=>{this.dragging=!0;let s=this.cornerTo(t,o,n,r);i=s,t.preview(d=>ue(d,a,n,s))},end:(r,s,d)=>{this.dragging=!1,t.preview(void 0);let p=i,m={kind:"corner",roomId:a,corner:n};d&&p!==void 0?t.apply(c=>ue(c,a,n,p),{select:m}):t.select(m)}})}midDrag(t,e,o,n){let a=o.id,i=F(o)[n],r=Je(t.doc,a,n),s=r?.floors.flatMap(u=>u.rooms).find(u=>x(u.id,a));if(i===void 0||r===void 0||s===void 0)return;let d=[(i.a[0]+i.b[0])/2,(i.a[1]+i.b[1])/2],p=s.outline.reduce((u,g,v)=>Math.hypot(g[0]-d[0],g[1]-d[1])<Math.hypot(s.outline[u][0]-d[0],s.outline[u][1]-d[1])?v:u,0),m=u=>g=>{let v=Je(g,a,n);return v===void 0||u===void 0?v:ue(v,a,p,u)},c;t.drag(e,{move:u=>{this.dragging=!0,c=this.cornerTo(t,s,p,u),t.preview(m(c))},end:(u,g,v)=>{this.dragging=!1,t.preview(void 0),t.apply(m(v?c:void 0),{select:{kind:"corner",roomId:a,corner:p}})}})}openingDrag(t,e,o,n){let a=o.id,i=o.openings[n];if(i===void 0)return;let r={kind:"opening",roomId:a,opening:n},s=[(i.a[0]+i.b[0])/2,(i.a[1]+i.b[1])/2],d,p;t.select(r),t.drag(e,{move:m=>{d??=m,this.dragging=!0,this.sliding={roomId:a,index:n};let c=[s[0]+m[0]-d[0],s[1]+m[1]-d[1]];p=c,t.preview(u=>Dt(u,a,n,c))},end:(m,c,u)=>{this.dragging=!1,this.sliding=void 0,t.preview(void 0);let g=p;u&&g!==void 0&&t.apply(v=>Dt(v,a,n,g),{select:r})}})}hover(t,e){if(this.tool==="draw"){this.draw.hover(t,e);return}this.tool!=="select"&&(this.hoverAt=e,t.redraw())}keyDown(t,e){if(this.tool==="draw"&&this.draw.active&&(e.key==="Enter"||e.key==="Backspace"||e.key==="Delete"))return this.draw.keyDown(t,e);let o=Z(e,!1);if(typeof o=="object"&&"letter"in o){let n=ri(o.letter);return n===void 0?!1:(this.setTool(t,n),!0)}if(o==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(t,"select"),!0;if(o==="delete"){let n=t.selection;if(n?.kind==="corner")t.apply(a=>Qe(a,n.roomId,n.corner),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="opening")t.apply(a=>tt(a,n.roomId,n.opening),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="wall")t.apply(a=>Ct(a,n.roomId,n.wall),{select:{kind:"room",roomId:n.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(t){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.draw.stop(),this.tool="select",t.redraw()}dock(t){return h`<button type="button" class="hme-tb ${t.toggles.square?"on":""}" aria-pressed=${t.toggles.square?"true":"false"}
        title="A dragged corner lines up with the corners beside it" @click=${()=>t.setToggle("square",!t.toggles.square)}>Snap to 90°</button>
      <button type="button" class="hme-tb ${t.toggles.grid?"on":""}" aria-pressed=${t.toggles.grid?"true":"false"}
        @click=${()=>t.setToggle("grid",!t.toggles.grid)}>Grid 5 cm</button>`}pill(t){if(this.tool==="draw")return h`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?h`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(t)}}>Close the room</button>`:f}
        <button type="button" class="hme-tb" @click=${()=>this.setTool(t,"select")}>Cancel</button>`;if(this.tool!=="select"){let i={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in a room to put stairs there"};return h`<span class="hme-pill-name">${i[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(t,"select")}>Cancel</button>`}let e=this.focus(t),o=t.selection;if(e===void 0||o===void 0||this.dragging)return f;let n=e.id,a=I(e);if(o.kind==="wall"){let i=o.wall,r=this.wallAt,s=zt(e,i,a).replace(", "," \xB7 ");return h`<span class="hme-pill-name">${s}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(t,e,i,"window",r)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(t,e,i,"door",r)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(t,e,i,r)}>Add a corner</button>
        <button type="button" class="hme-tb" @click=${()=>t.apply(d=>Rt(d,n,i))}>Straighten</button>`}if(o.kind==="corner")return h`<span class="hme-pill-name">${a} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${e.outline.length<=3} @click=${()=>t.apply(i=>Qe(i,n,o.corner),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>t.apply(i=>q(i,n))}>Square the corners</button>`;if(o.kind==="opening"){let i=e.openings[o.opening];return i===void 0?f:h`<span class="hme-pill-name">${se(i)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>t.apply(r=>tt(r,n,o.opening),{select:{kind:"room",roomId:n}})}>Remove</button>`}return h`<span class="hme-pill-name">${a}</span>
      <button type="button" class="hme-tb" @click=${()=>t.apply(i=>q(i,n))}>Square the corners</button>`}addHere(t,e,o,n,a){let i=e.id,r=e.openings.length;t.apply(s=>et(s,i,o,{kind:n,...a===void 0?{}:{at:a}}),{select:{kind:"opening",roomId:i,opening:r}})}cornerHere(t,e,o,n){let a=e.id,i=m=>Je(m,a,o,n),r=i(t.doc)?.floors.flatMap(m=>m.rooms).find(m=>x(m.id,a)),s=F(e)[o],d=n??(s===void 0?void 0:[(s.a[0]+s.b[0])/2,(s.a[1]+s.b[1])/2]),p=r===void 0||d===void 0?-1:r.outline.reduce((m,c,u)=>Math.hypot(c[0]-d[0],c[1]-d[1])<Math.hypot(r.outline[m][0]-d[0],r.outline[m][1]-d[1])?u:m,0);t.apply(i,{select:p<0?{kind:"room",roomId:a}:{kind:"corner",roomId:a,corner:p}})}inspector(t){let e=this.focus(t),o=t.selection;if(e===void 0||o===void 0){let m=vt(t.floor);return H("Shape",h`<p class="hme-text">Pick a room, then a wall or a corner. Drag a corner to move it; a corner two rooms share moves for both.</p>
        <p class="hme-text dim">${m.length===0?"The scan check found nothing to fix on this floor.":`The scan check found ${R(m.length,"thing")} to fix. They are marked in amber.`}</p>`)}let n=e.id;if(o.kind==="corner")return this.cornerCard(t,e,o.corner);let a=this.pickedWall(t,e);if(a===void 0)return H(I(e),h`
        ${P("Corners",h`<span class="hme-val">${e.outline.length}</span>`)}
        ${P("Walls",h`<span class="hme-val">${F(e).length}</span>`)}
        ${P("Wall height",_({label:"Wall height",value:e.height,unit:"m",min:.5,max:20,set:m=>t.apply(c=>ke(c,n,m))}))}
        ${N("Click a wall to change it or put a door or window in it. Drag a corner to move it, or the dot in a wall's middle to add a corner.")}
        <div class="hme-row-end"><button type="button" class="hme-tb" @click=${()=>t.apply(m=>q(m,n))}>Square the corners</button></div>`);let i=F(e)[a],r=e.openings.map((m,c)=>({o:m,i:c})).filter(({o:m})=>Ze(e,m)===a),s=o.kind==="opening"?e.openings[o.opening]:void 0,d=te(i),p=m=>{let c=e.openings.length;t.apply(u=>et(u,n,a,{kind:m}),{select:{kind:"opening",roomId:n,opening:c}})};return h`
      ${H("Wall",h`
        ${P("Room",h`<span class="hme-val strong">${zt(e,a,I(e))}</span>`)}
        ${P("Length",_({label:"Length",value:d,unit:"m",min:.1,max:200,set:m=>t.apply(c=>Fo(c,n,a,m))}))}
        ${P("Thickness",_({label:"Thickness",value:i.t,unit:"m",min:.01,max:1,set:m=>t.apply(c=>No(c,n,a,m))}))}
        ${P("Height",_({label:"Wall height",value:e.height,unit:"m",min:.5,max:20,set:m=>t.apply(c=>ke(c,n,m))}))}
        ${N("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-row-end indent">
          <button type="button" class="hme-tb" @click=${()=>t.apply(m=>Rt(m,n,a))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>t.apply(m=>q(m,n))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(t,e,a,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>t.apply(m=>Ct(m,n,a),{select:{kind:"room",roomId:n}})}>Remove</button>
        </div>`)}
      ${H("On this wall",h`
        ${r.map(({o:m,i:c})=>{let u=ne(m.a,i.a,i.b).along,g=ne(m.b,i.a,i.b).along,v=o.kind==="opening"&&o.opening===c;return h`<button type="button" class="hme-list-row ${v?"on":""}" @click=${()=>t.select({kind:"opening",roomId:n,opening:c})}>
            <span class="hme-grow">${se(m)}</span><span class="mono dim">${be(Math.abs(g-u))} · ${be(Math.max(0,Math.min(u,g)))} in</span></button>`})}
        ${r.length===0?h`<p class="hme-empty-line">Nothing on this wall.</p>`:f}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>p("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>p("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>p("opening")}>＋ Way through</button>
        </div>`)}
      ${s===void 0||o.kind!=="opening"?f:this.openingCard(t,e,o.opening,s)}`}openingCard(t,e,o,n){let a=e.id,i=Math.hypot(n.b[0]-n.a[0],n.b[1]-n.a[1]),r=n.z1-n.z0;return H(se(n),h`
      <div class="hme-pics">${si.map(s=>V({label:s.label,picture:mi[s.label],on:n.kind===s.kind&&n.style===s.style,click:()=>t.apply(d=>He(d,a,o,{kind:s.kind,style:s.style??null}))}))}</div>
      ${P("Width",_({label:"Width",value:i,unit:"m",min:.1,max:20,set:s=>t.apply(d=>He(d,a,o,{width:s}))}))}
      ${P("From floor",_({label:"From floor",value:n.z0,unit:"m",min:0,max:20,set:s=>t.apply(d=>He(d,a,o,{z0:s,z1:s+r}))}),h`<span class="hme-l short">Tall</span>`,_({label:"Tall",value:r,unit:"m",min:.05,max:20,set:s=>t.apply(d=>He(d,a,o,{z1:n.z0+s}))}))}
      ${N("Drag it along the wall. The plan shows the space to each corner.")}
      <div class="hme-row-end indent"><button type="button" class="hme-tb danger" @click=${()=>t.apply(s=>tt(s,a,o),{select:{kind:"room",roomId:a}})}>Remove ${se(n).toLowerCase()}</button></div>`)}cornerCard(t,e,o){let n=e.id,a=e.outline[o];if(a===void 0)return h``;let i=t.floor.rooms.filter(r=>!x(r.id,n)&&r.outline.some(s=>Math.hypot(s[0]-a[0],s[1]-a[1])<=.02));return H("Corner",h`
      ${P("Room",h`<span class="hme-val strong">${I(e)}</span>`)}
      ${P("Left, top",_({label:"Corner left",value:a[0],unit:"m",set:r=>t.apply(s=>ue(s,n,o,[r,a[1]]))}),_({label:"Corner top",value:a[1],unit:"m",set:r=>t.apply(s=>ue(s,n,o,[a[0],r]))}))}
      ${N(i.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${i.map(I).join(", ")}, which move${i.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${e.outline.length<=3} @click=${()=>t.apply(r=>Qe(r,n,o),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>t.apply(r=>q(r,n))}>Square the corners</button>
      </div>`)}},hi={select:h`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,draw:h`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`,split:h`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:h`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:h`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:h`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:h`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:h`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},mi={Door:h`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":h`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":h`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:h`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":h`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":h`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var yt={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function ci(l,t){if(!it(l))return"Home style";let e=Ot(l,t),o=a=>Object.hasOwn(l,Xo[a]),n=[];return o("look")&&n.push(yt[e.look].title),o("turn")&&n.push(`turned ${e.turn}\xB0`),o("names")&&n.push(e.names?"room names":"no room names"),o("devices")&&n.push(e.devices==="all"?"every device":e.devices==="none"?"no devices":"lights only"),o("furniture")&&n.push(e.furniture?"furniture":"no furniture"),o("glow")&&n.push(e.glow?"glow":"no glow"),`Own look: ${n.join(", ")}`}var Nn=(l,t)=>typeof l=="number"&&Number.isFinite(l)?l:t;function ui(l,t){let e=go(l);return fo(l).flatMap(o=>{if(xt(Ue(o))!=="home_map")return[];let n=o,a=vo(Ue(o)),i=t?.floors.find(c=>x(c.id,a)),r=typeof n.homeMapRoomId=="string"?n.homeMapRoomId:void 0,s=r===void 0?void 0:i?.rooms.find(c=>x(c.id,r)),d=`${Nn(o.colSpan,1)}\xD7${Nn(o.rowSpan,1)}`,m=(typeof o.customLabel=="string"&&o.customLabel.trim()!==""?o.customLabel.trim():void 0)??(s?.name?.trim()?`${s.name.trim()} only`:i===void 0||(t?.floors.length??0)<=1?"Home map":O(i));return[{pageId:e,pageName:Ve(l),tileId:typeof o.id=="string"?o.id:"",what:m,size:d,own:it(n),words:ci(n,t),look:Ot(n,t).look}]})}function zn(l,t){return Object.values(l?.pages??{}).map(o=>o?.item).filter(o=>Be(o)).sort((o,n)=>Ve(o).localeCompare(Ve(n))).flatMap(o=>ui(o,t))}function Kn(l){let t=!1;if(!Array.isArray(l.pages))return;let e=l.pages.map(o=>{if(!Be(o)||!Array.isArray(o.items))return o;let n=o.items.map(a=>!Be(a)||xt(Ue(a))!=="home_map"||!it(a)?a:(t=!0,Yo(a)));return{...o,items:n}});return t?{...l,pages:e}:void 0}var wt={width:112,height:68},fi={width:94,height:94,radius:34},gi={width:188,height:94,radius:22},vi={width:60,height:94,radius:18},bi=1.6,$t=class{constructor(){this.id="style";this.usesState="idle";this.busy=!1}style(t){let e=Pe(t.doc);return this.turnLive===void 0?e:{...e,turn:this.turnLive}}set(t,e){t.apply(o=>qo(o,e))}rail(t){let e=this.style(t),o=t.hass?.states;return h`<div class="hme-h hme-pad">Looks</div>
      <div class="hme-looks">
        ${io.map(n=>{let a=n===e.look,i=re({floor:t.floor,states:o,...e,look:n,names:!1,width:wt.width,height:wt.height});return h`<button type="button" class="hme-look ${a?"on":""}" aria-pressed=${a?"true":"false"} @click=${()=>this.set(t,{look:n})}>
            <svg viewBox=${`0 0 ${wt.width} ${wt.height}`} style=${`background:${ae(n,.5)}`} aria-hidden="true">${i}</svg>
            <span>${yt[n].title}</span></button>`})}
      </div>
      <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`}stage(t){let e=this.style(t),o=ge.includes(e.look),n=yt[e.look],{width:a,height:i}=t.stage,r=Math.min(Math.max(a/760,1),2.6),s=Math.max(a/r,1),d=Math.max(i/r,1),p=a<=0?f:re({floor:t.floor,states:t.hass?.states,...e,width:Math.max(s-48,1),height:Math.max(d-96,1),tileHeight:d,icons:t.icons});return h`<div class="hme-style-col">
      <div class="hme-stage hme-style-big ${o?"turns":""}" style=${`background:${ae(e.look,r)}`}
        @pointerdown=${m=>{o&&this.turnDrag(t,m,e.turn)}}>
        <div class="hme-style-title" style=${`color:${st(e.look)}`}><strong>${n.title}</strong><span>${n.hint}</span></div>
        <svg class="hme-svg" viewBox=${`0 0 ${s.toFixed(1)} ${d.toFixed(1)}`} role="img" aria-label=${`The floor in the ${n.title} look`}>
          <g transform="translate(24 64)">${p}</g></svg>
        ${o?h`<span class="hme-style-turn" style=${`color:${st(e.look)}`}>Drag to turn · ${e.turn}°</span>`:f}
      </div>
      <section class="hme-card hme-style-tiles">
        ${this.face(t,e,fi,"Watch tile 2 \xD7 2",!0)}
        ${this.face(t,e,gi,"iPhone tile 4 \xD7 2",!0)}
        ${this.face(t,e,vi,"iPhone full map",!1)}
      </section>
    </div>`}face(t,e,o,n,a){let i=Math.min(Math.max(t.stage.width/1100,bi),2.6),r=t.hass?.states,s=a?tn(o.width,o.height):{x:4,y:4,width:o.width-8,height:o.height-8},d=re({floor:t.floor,states:r,...e,width:s.width,height:s.height,tileHeight:a?o.height:0,icons:t.icons}),p=We(t.floor,r),m=6*i;return h`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${o.width*i}px;height:${o.height*i}px;border-radius:${o.radius}px;background:${ae(e.look,i)}`}>
        <svg viewBox=${`0 0 ${s.width} ${s.height}`} aria-hidden="true"
          style=${`left:${s.x*i}px;top:${s.y*i}px;width:${s.width*i}px;height:${s.height*i}px`}>${d}</svg>
        ${a&&o.height>90?h`<span class="hme-face-title" style=${`left:${m}px;top:${m}px;font-size:${11*i}px;color:${st(e.look)}`}>${yi(t.floor)}</span>`:f}
        ${a?h`<span class="hme-face-words" style=${`left:${m}px;bottom:${m}px;font-size:${10*i}px;color:${en(e.look,p>0)}`}>${Ge(p)}</span>`:f}
      </div>
      <figcaption>${n}</figcaption>
    </figure>`}turnDrag(t,e,o){if(e.button!==0)return;let n=e.currentTarget,a=e.clientX;try{n.setPointerCapture?.(e.pointerId)}catch{}let i=s=>{let p=o+(s.clientX-a)*.5;p=((p+180)%360+360)%360-180,this.turnLive=Math.round(p),t.redraw()},r=()=>{n.removeEventListener("pointermove",i),n.removeEventListener("pointerup",r),n.removeEventListener("pointercancel",r);let s=this.turnLive;this.turnLive=void 0,s!==void 0&&s!==o?this.set(t,{turn:s}):t.redraw()};n.addEventListener("pointermove",i),n.addEventListener("pointerup",r),n.addEventListener("pointercancel",r)}overlay(){return f}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}inspector(t){let e=this.style(t),o=ge.includes(e.look),n=(a,i,r)=>h`<button type="button" class="hme-chip sel ${i?"on":""}" aria-pressed=${i?"true":"false"} @click=${r}>${a}</button>`;return h`
      ${H("Home style",h`
        <p class="hme-text">Every Home map tile starts with this look. A tile can still pick its own in its Map card.</p>
        <div class="hme-r"><span class="hme-l">Turn</span>
          <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${A(String(e.turn))} ?disabled=${!o} aria-label="Turn the model"
            style=${xe(e.turn,-180,180)}
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

      ${H("Floors",h`
        ${t.floor.rooms.length===0?h`<p class="hme-empty-line">No rooms on this floor yet.</p>`:f}
        ${t.floor.rooms.map(a=>{let i=qe(a);return h`<div class="hme-r top"><span class="hme-l">${I(a)}</span><div class="hme-chips">
            ${n(`Auto: ${De[i]}`,a.finish===void 0,()=>t.apply(r=>ce(r,a.id,void 0)))}
            ${Fe.map(r=>n(De[r],a.finish===r,()=>t.apply(s=>ce(s,a.id,r))))}
          </div></div>`})}`,"shows in Plan, Night and Warm")}

      ${this.usesCard(t)}`}loadUses(t){let e=t.hass;this.usesState!=="idle"||e===void 0||(this.usesState="loading",je(e).then(o=>{this.summary=o,this.usesState="done",t.redraw()},()=>{this.usesState="error",t.redraw()}))}usesCard(t){if(this.loadUses(t),this.usesState!=="done")return H("Used on",h`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let e=zn(this.summary,t.doc),o=e.filter(n=>n.own);return H(`Used on ${R(e.length,"tile")}`,h`
      ${e.length===0?h`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:f}
      ${e.map(n=>this.useRow(t,n))}
      ${o.length===0?f:h`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(t,o)}}>${this.busy?"Saving\u2026":`Use the home style on all ${o.length}`}</button>`}
      ${this.message===void 0?f:h`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(t,e){return h`<div class="hme-use">
      <i style=${`background:${ae(e.look,.2)}`}></i>
      <div><span>${e.pageName} · ${e.what} ${e.size}</span><small>${e.words}</small></div>
      ${t.openPage===void 0?f:h`<button type="button" class="hme-tb" @click=${()=>t.openPage?.(e.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(t,e){let o=t.hass;if(o===void 0||this.busy)return;let n=[...new Set(e.map(r=>r.pageId))];if(!await t.confirm({title:`Use the home style on ${R(e.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${n.length===1?"The page is":`The ${n.length} pages are`} saved for every watch and iPhone that shows ${n.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,t.redraw();let i=0;for(let r of n)try{let s=await co(o,"pages",r),d=Kn(s.document);d!==void 0&&await uo(o,"pages",r,s.revision,d)}catch{i+=1}this.busy=!1,this.message=i===0?"Done: those tiles follow the home style now.":`${R(i,"page")} could not be saved. Try again, or open ${i===1?"it":"them"} to see why.`,this.usesState="idle",t.redraw()}};function yi(l){return l.name.trim()===""?"Home map":l.name.trim()}var wi="Update the Wrist Assistant integration to see the home map here.",$i="No home map yet. Scan your rooms with the Wrist Assistant app on an iPhone or iPad with LiDAR (the Pro models). The map shows here once it is saved.",Mi=4,xi=140;function ki(l){return l.kind==="saving"?"Saving\u2026":l.kind==="error"?"Not saved":"Saved"}var Hi={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},E=class extends eo{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.onHome=void 0;this.onOpenPage=void 0;this.unsupported=!1;this.loading=!1;this.mode="arrange";this.viewKind="flat";this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,square:!0,grid:!1,measure:!1,live:!0};this.measure={};this.floorMenu=!1;this.spaceHeld=!1;this.tick=0;this.modes={arrange:new mt,shape:new bt,devices:new gt,style:new $t};this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=f;this.onKey=e=>{if(this.dialog!==void 0||this.session===void 0)return;let o=(typeof e.composedPath=="function"?e.composedPath()[0]:void 0)??e.target;if(dn(o))return;if(e.key===" "&&!e.repeat){this.spaceHeld=!0,e.preventDefault?.();return}let n=Z(e,!1);if(n==="undo"||n==="redo"){e.preventDefault?.(),n==="undo"?this.undo():this.redo();return}let a=this.context();if(a!==void 0&&this.viewKind==="flat"&&this.modes[this.mode].keyDown?.(a,e)===!0){e.preventDefault?.();return}switch(n){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.selection=void 0;return;case"zoomIn":this.zoomBy(Ie);return;case"zoomOut":this.zoomBy(1/Ie);return;case"fit":this.fit();return}};this.onKeyUp=e=>{e.key===" "&&(this.spaceHeld=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++}willUpdate(e){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load(),this.loadPages());let o=this.baseFloor();this.needFit&&o!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let e=this.renderRoot.querySelector?.(".hme-dialog");e instanceof Element&&e!==this.focusedDialog?(this.focusedDialog=e,(e.querySelector("input")??e.querySelector(".primary"))?.focus?.(),e.querySelector("input")?.select?.()):e===null&&(this.focusedDialog=void 0);let o=this.renderRoot.querySelector?.(".hme-stage");o instanceof Element&&o!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(n=>{let a=n[n.length-1]?.contentRect;a!==void 0&&this.resizeStage(a.width,a.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(o),this.observed=o),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},xi))}async load(e=!1){let o=this.hass;if(!o||!this.capable)return;let n=++this.loadSeq;e||(this.loading=this.session===void 0,this.loadError=void 0);try{let a=await Le(o);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:ze(a?.doc)??null,rev:typeof a?.rev=="number"?a.rev:0})}catch(a){if(n!==this.loadSeq)return;let{code:i,message:r}=pe(a);i==="unknown_command"?this.unsupported=!0:(!e||this.session===void 0)&&(this.loadError=r)}this.loading=!1}async loadPages(){let e=this.hass;if(e)try{let o=bo(await je(e));this.pages=yo(o,"pages").map(n=>({id:n.id,name:n.name}))}catch{this.pages=[]}}show(e){let o=this.hass;if(o&&Mt(o,e),this.session===void 0)this.session=new ht(vn(this.hassOrThrow()),e,()=>this.afterChange(),n=>{this.hass&&Mt(this.hass,n)}),this.needFit=!0;else if(!this.session.load(e))return;this.afterChange()}hassOrThrow(){let e=this.hass;if(e===void 0)throw new Error("no hass");return e}afterChange(){let e=this.session?.doc?.floors??[];e.some(o=>x(o.id,this.floorId))||(this.floorId=e[0]?.id,this.needFit=!0),nn(this.baseFloor(),this.selection)||(this.selection=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let e=this.doc?.floors??[];return e.find(o=>x(o.id,this.floorId))??e[0]}shownFloor(){let e=this.baseFloor();return e===void 0||this.previewDoc===void 0?e:this.previewDoc.floors.find(o=>x(o.id,e.id))??e}apply(e,o={}){let n=this.session;return n===void 0?!1:(this.previewDoc=void 0,n.apply(e)?(o.floorId!==void 0&&(this.floorId=o.floorId),o.select!==void 0&&(this.selection=o.select??void 0),this.afterChange(),!0):(this.tick++,!1))}preview(e){let o=this.doc;this.previewDoc=e===void 0||o===null?void 0:e(o)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(e){this.selection=e}setMode(e,o){let n=this.context();n!==void 0&&e!==this.mode&&this.modes[this.mode].leave?.(n),this.mode=e,this.viewKind="flat",o!==void 0&&(this.selection=o)}setFloor(e){let o=this.context();o!==void 0&&this.modes[this.mode].leave?.(o),this.floorId=e,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(e,o){this.toggles={...this.toggles,[e]:o},e==="measure"&&(this.measure={})}confirm(e){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"confirm",...e,done:n=>{this.dialog=void 0,o(n)}}})}ask(e){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"ask",...e,done:n=>{this.dialog=void 0,o(n)}}})}resizeStage(e,o){let n=this.stageSize.width===0;this.stageSize={width:e,height:o},(n||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:e,height:o}=this.stageSize;e<=0||(this.view=At(this.baseFloor(),e,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}zoomBy(e,o){this.view!==void 0&&(this.view=Lt(this.view,e,o??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let e=this.doc,o=this.shownFloor();if(e===null||o===void 0)return;let n=this.view??{scale:40,ox:0,oy:0},a=this.session;return{hass:this.hass,icons:this.icons,doc:e,floor:o,selection:this.selection,mode:this.mode,view:n,stage:this.stageSize,toggles:this.toggles,pages:this.pages??[],areas:ho(this.hass),canUndo:a?.canUndo??!1,canRedo:a?.canRedo??!1,toScreen:i=>sn(n,i),px:i=>i*n.scale,toPlan:(i,r)=>this.toPlan(i,r),apply:(i,r)=>this.apply(i,r),preview:i=>this.preview(i),select:i=>this.select(i),setMode:(i,r)=>this.setMode(i,r),setFloor:i=>this.setFloor(i),setToggle:(i,r)=>this.setToggle(i,r),drag:(i,r)=>this.drag(i,r),undo:()=>this.undo(),redo:()=>this.redo(),confirm:i=>this.confirm(i),ask:i=>this.ask(i),newId:()=>kt(),note:(i,r)=>{this.session!==void 0&&(this.session.note={kind:i,text:r}),this.tick++},redraw:()=>{this.tick++},openPage:this.onOpenPage}}toPlan(e,o){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return lt(this.view??{scale:40,ox:0,oy:0},[e-n.left,o-n.top])}stagePoint(e){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[e.clientX-o.left,e.clientY-o.top]}drag(e,o){let n=this.stageEl;if(n===void 0)return;this.endDrag?.();let a=e.clientX,i=e.clientY,r=!1,s,d=0,p=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,m=()=>{d=0,s!==void 0&&o.move(this.toPlan(s.clientX,s.clientY),s)};try{n.setPointerCapture?.(e.pointerId)}catch{}let c=v=>{let w=v;w.pointerId===e.pointerId&&(!r&&Math.hypot(w.clientX-a,w.clientY-i)<Mi||(r=!0,s=w,p===void 0?m():d===0&&(d=p(m))))},u=v=>{let w=v;w.pointerId===e.pointerId&&(g(),d!==0&&(cancelAnimationFrame(d),m()),o.end(this.toPlan(w.clientX,w.clientY),w,r))},g=()=>{n.removeEventListener("pointermove",c),n.removeEventListener("pointerup",u),n.removeEventListener("pointercancel",u);try{n.releasePointerCapture?.(e.pointerId)}catch{}this.endDrag===g&&(this.endDrag=void 0)};n.addEventListener("pointermove",c),n.addEventListener("pointerup",u),n.addEventListener("pointercancel",u),this.endDrag=g}onStageDown(e){if(this.stageEl=e.currentTarget,this.floorMenu=!1,this.dialog!==void 0)return;if(e.pointerType==="touch"&&(this.touches.set(e.pointerId,[e.clientX,e.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(e);return}if(e.button===1||this.spaceHeld){e.preventDefault?.(),this.pan(e,!1);return}if(e.button!==0)return;let o=this.context();if(o===void 0)return;if(this.toggles.measure){let a=this.toPlan(e.clientX,e.clientY),i=this.measure;this.measure=i.a===void 0||i.b!==void 0?{a}:{a:i.a,b:a};return}let n=this.toPlan(e.clientX,e.clientY);if(this.modes[this.mode].pointerDown?.(o,e,n)===!0){e.preventDefault?.();return}this.pan(e,!0)}onStageMove(e){if(this.stageEl=e.currentTarget,this.touches.has(e.pointerId)&&this.touches.set(e.pointerId,[e.clientX,e.clientY]),e.buttons!==0||this.viewKind==="model")return;let o=this.toPlan(e.clientX,e.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:o});let n=this.context();n!==void 0&&this.modes[this.mode].hover?.(n,o)}onStageLeave(){let e=this.context();e!==void 0&&this.modes[this.mode].hover?.(e,void 0)}onStageUp(e){this.touches.delete(e.pointerId)}onStageDrag(e){this.stageEl=e.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||this.dialog!==void 0||this.modes[this.mode].dragOver?.(o,this.toPlan(e.clientX,e.clientY),e)===!0&&(e.preventDefault?.(),e.dataTransfer&&(e.dataTransfer.dropEffect="copy"))}onStageDragLeave(e){let o=e.relatedTarget,n=e.currentTarget;if(o!==null&&n!==null&&typeof n.contains=="function"&&n.contains(o))return;let a=this.context();a!==void 0&&this.modes[this.mode].dragOver?.(a,void 0,e)}onStageDrop(e){this.stageEl=e.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||(e.preventDefault?.(),this.modes[this.mode].drop?.(o,this.toPlan(e.clientX,e.clientY),e))}pan(e,o){let n=this.view;if(n===void 0)return;let a=e.clientX,i=e.clientY;this.drag(e,{move:(r,s)=>{this.view={...n,ox:n.ox+s.clientX-a,oy:n.oy+s.clientY-i},this.userMoved=!0},end:(r,s,d)=>{!d&&o&&(this.selection=void 0)}})}pinch(){let e=this.stageEl,o=this.view,n=[...this.touches.keys()];if(e===void 0||o===void 0||n.length<2)return;let a=()=>n.map(u=>this.touches.get(u)),[i,r]=a(),s=Math.max(Math.hypot(r[0]-i[0],r[1]-i[1]),1),d=e.getBoundingClientRect(),p=[(i[0]+r[0])/2-d.left,(i[1]+r[1])/2-d.top],m=u=>{let g=u;if(!this.touches.has(g.pointerId))return;this.touches.set(g.pointerId,[g.clientX,g.clientY]);let[v,w]=a(),M=Math.max(Math.hypot(w[0]-v[0],w[1]-v[1]),1),S=[(v[0]+w[0])/2-d.left,(v[1]+w[1])/2-d.top],z=Lt(o,M/s,p);this.view={...z,ox:z.ox+S[0]-p[0],oy:z.oy+S[1]-p[1]},this.userMoved=!0},c=u=>{this.touches.delete(u.pointerId),e.removeEventListener("pointermove",m),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c)};e.addEventListener("pointermove",m),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c)}turnModel(e){let o=this.modelTurnNow(),n=e.clientX;this.drag(e,{move:(a,i)=>{let r=o+(i.clientX-n)*.5;r=((r+180)%360+360)%360-180,this.modelTurn=Math.round(r)},end:()=>{}})}modelTurnNow(){return this.modelTurn??Pe(this.doc).turn??Qo}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let e=Pe(this.doc).look;return ge.includes(e)?e:"night"}onWheel(e){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=e.currentTarget,e.preventDefault?.();let o=e.deltaMode===1?16:e.deltaMode===2?400:1;if(e.ctrlKey||e.metaKey){this.zoomBy(Math.exp(-e.deltaY*o*.0025),this.stagePoint(e));return}this.view={...this.view,ox:this.view.ox-e.deltaX*o,oy:this.view.oy-e.deltaY*o},this.userMoved=!0}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(h`<b>${wi}</b>`);if(this.loadError!==void 0)return this.calm(h`<span>Could not read the home map: ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(h`Loading…`);let e=this.doc;if(e===null||e.floors.length===0)return this.calm(h`<b>${$i}</b>`);let o=this.context(),n=this.modes[this.mode],a=this.session.note;return h`<div class="hme">
      ${this.renderBar(e,o)}
      ${a===void 0?f:h`<div class="hme-note ${a.kind}" role="status"><span>${a.text}</span>
        <button class="hme-link" @click=${()=>this.session?.dismissNote()}>Dismiss</button></div>`}
      <div class="hme-body">
        <aside class="hme-rail" aria-label="${_t[this.mode]} tools">${n.rail(o)}</aside>
        <section class="hme-stage-wrap">${n.stage?.(o)??this.renderStage(o,n)}</section>
        <aside class="hme-insp" aria-label="Inspector">${n.inspector(o)}</aside>
      </div>
      ${this.renderDialog()}
    </div>`}calm(e){return h`<div class="hme-calm"><div class="hme-empty">${e}</div></div>`}renderBar(e,o){let n=this.baseFloor(),a=this.session?.state??{kind:"saved"},i=Ft();return h`<header class="hme-bar">
      ${this.onHome===void 0?f:h`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Home</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">BETA</span>
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${Bt(n)}
          <span class="hme-floor-t"><span>${O(n)}</span><small>${R(n.rooms.length,"room")} · ${R(n.pins.length,"device")}</small></span>
          <span class="hme-caret" aria-hidden="true">▾</span>
        </button>
        ${this.floorMenu?this.renderFloorMenu(e,n):f}
      </div>
      <span class="hme-flex"></span>
      <div class="hme-seg" role="tablist" aria-label="Edit mode">
        ${on.map(r=>h`<button type="button" role="tab" class=${r===this.mode?"on":""} aria-selected=${r===this.mode?"true":"false"}
          @click=${()=>this.setMode(r)}>${_t[r]}</button>`)}
      </div>
      <span class="hme-flex"></span>
      ${this.modes[this.mode].stage!==void 0?f:h`<div class="hme-seg" role="group" aria-label="View">
        <button type="button" class=${this.viewKind==="flat"?"on":""} aria-pressed=${this.viewKind==="flat"?"true":"false"} @click=${()=>{this.viewKind="flat"}}>Flat</button>
        <button type="button" class=${this.viewKind==="model"?"on":""} aria-pressed=${this.viewKind==="model"?"true":"false"} @click=${()=>{this.viewKind="model"}}>Model</button>
      </div>`}
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${i?"\u2318Z":"Ctrl+Z"})`} ?disabled=${!o.canUndo} @click=${()=>this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${i?"\u21E7\u2318Z":"Ctrl+Shift+Z"})`} ?disabled=${!o.canRedo} @click=${()=>this.redo()}>↷</button>
      <span class="hme-status ${a.kind}" role="status" title=${a.kind==="error"?a.text:f}><span class="hme-status-dot"></span>${ki(a)}</span>
    </header>`}renderFloorMenu(e,o){return h`<div class="hme-pop" role="menu" aria-label="Floors">
      ${e.floors.map(n=>h`<div class="hme-pop-row ${x(n.id,o.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(n.id)}>
          ${Bt(n)}<span class="hme-floor-t"><span>${O(n)}</span><small>${R(n.rooms.length,"room")} · ${R(n.pins.length,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${O(n)}`} @click=${()=>{this.renameFloorAsk(n)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${e.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${O(n)}`}
          ?disabled=${e.floors.length===1} @click=${()=>{this.deleteFloorAsk(n)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let e=this.doc;if(e===null)return;let o=Math.max(...e.floors.map(i=>i.story))+1,n=await this.ask({title:"Add a floor",label:"Name",value:o===1?"Upstairs":`Floor ${o+1}`,ok:"Add floor"});if(n===void 0)return;let a=kt();this.apply(i=>Po(i,{id:a,name:n,story:o}),{floorId:a,select:null})&&(this.needFit=!0)}async renameFloorAsk(e){this.floorMenu=!1;let o=await this.ask({title:"Rename floor",label:"Name",value:e.name||O(e),ok:"Rename"});o!==void 0&&this.apply(n=>Ye(n,e.id,o))}async deleteFloorAsk(e){this.floorMenu=!1,await this.confirm({title:`Delete ${O(e)}?`,text:`Its ${R(e.rooms.length,"room")} and ${R(e.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(n=>To(n,e.id),{select:null})}renderStage(e,o){let{width:n,height:a}=this.stageSize,i=this.viewKind==="model",r=i?f:o.pill?.(e)??f,s=this.spaceHeld?"grab":i?"ew-resize":this.toggles.measure?"crosshair":o.cursor?.(e)??"default",d=e.floor.rooms.length===0;return h`<div class="hme-stage ${i?"model":""}" style=${i?`background:${ae(this.modelLookNow())}`:""}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(a,1)}`} style=${`cursor:${s}`}
        role="img" aria-label=${`Plan of ${O(e.floor)}`}
        @pointerdown=${p=>this.onStageDown(p)}
        @pointermove=${p=>this.onStageMove(p)}
        @pointerup=${p=>this.onStageUp(p)}
        @pointercancel=${p=>this.onStageUp(p)}
        @pointerleave=${()=>this.onStageLeave()}
        @wheel=${p=>this.onWheel(p)}
        @dragover=${p=>this.onStageDrag(p)}
        @dragleave=${p=>this.onStageDragLeave(p)}
        @drop=${p=>this.onStageDrop(p)}>
        ${i?this.renderModel(e,n,a):this.renderPlan(e,o,n,a)}
      </svg>
      ${r===f?f:h`<div class="hme-pill">${r}</div>`}
      ${i?f:o.stageExtra?.(e)??f}
      ${d&&!i?h`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{this.setMode("arrange");let p=this.context();p&&this.modes.arrange.draw.start(p)}}>＋ Draw a room by hand</button></div>`:f}
      ${this.renderDock(e,o)}
    </div>`}renderPlan(e,o,n,a){let i=this.view;if(i===void 0||n<=0)return f;let r=this.planArt(e.floor,n,a,o.drawsPins===!0?"none":"all"),s=i.scale/(this.artScale||i.scale);return y`${this.background(i,n,a)}
      <g class="hme-art" transform=${`translate(${i.ox.toFixed(2)} ${i.oy.toFixed(2)}) scale(${s.toFixed(5)})`} pointer-events="none">${r}</g>
      <g class="hme-labels" pointer-events="none">${this.labels(e)}</g>
      <g class="hme-overlay">${o.overlay(e)}</g>
      ${this.toggles.measure?this.measureMarks(e):f}`}planArt(e,o,n,a){let i=this.toggles.live?this.hass?.states:void 0,r=this.artScale||this.view.scale,s=`${Pi(e)}|${Jt(i)}|${r}|${o}|${n}|${this.iconsTick}|${Jt(this.icons)}|${a}`;return s!==this.artKey&&(this.artKey=s,this.artHeld=re({floor:e,states:i,look:"plan",names:!1,devices:a,furniture:!0,glow:!0,width:o,height:n,icons:this.icons,frame:{scale:r,ox:0,oy:0}})),this.artHeld}background(e,o,n){let a=this.mode==="shape"?.05:.1,i=20;if(this.toggles.grid)for(i=a*e.scale;i<8;)i*=10;let r=(e.ox%i+i)%i,s=(e.oy%i+i)%i;return y`<defs><pattern id="hme-bg" width=${i} height=${i} patternUnits="userSpaceOnUse" patternTransform=${`translate(${r.toFixed(1)} ${s.toFixed(1)})`}>
        ${this.toggles.grid?y`<path d=${`M${i} 0V${i}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:y`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${o} height=${n} fill="url(#hme-bg)" />`}labels(e){return e.floor.rooms.map(o=>{let n=W(o),a=oe(o.outline);if(n===void 0||a===void 0)return f;let i=I(o),r=Re(o),s=(a.maxX-a.minX)*e.view.scale,d=(a.maxY-a.minY)*e.view.scale,p=i.length*7.4+22;if(p>s*.95||d<26)return f;let m=Math.max(p,r.length*5.8+22)<=s*.95&&d>=48,c=m?Math.max(p,r.length*5.8+22):p,u=m?36:22,[g,v]=e.toScreen(n);return y`<g class="hme-label"><rect x=${(g-c/2).toFixed(1)} y=${(v-u/2).toFixed(1)} width=${c.toFixed(1)} height=${u} rx=${m?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${g.toFixed(1)} y=${(v+(m?-3:4.5)).toFixed(1)} fill="#fff" font-size=${m?13:12} font-weight="600" text-anchor="middle">${i}</text>
        ${m?y`<text x=${g.toFixed(1)} y=${(v+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${r}</text>`:f}</g>`})}measureMarks(e){let o=this.measure;if(o.a===void 0)return y`<g class="hme-measure"></g>`;let n=o.b??o.hover,a=e.toScreen(o.a);if(n===void 0)return y`<g class="hme-measure" pointer-events="none"><circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" /></g>`;let i=e.toScreen(n),r=Math.hypot(n[0]-o.a[0],n[1]-o.a[1]),s=[(a[0]+i[0])/2,(a[1]+i[1])/2];return y`<g class="hme-measure" pointer-events="none">
      <line x1=${a[0]} y1=${a[1]} x2=${i[0]} y2=${i[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${o.b===void 0?"6 4":"none"} />
      <circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" /><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(s[0]-32).toFixed(1)} y=${(s[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${s[0].toFixed(1)} y=${(s[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${r.toFixed(2)} m</text></g></g>`}renderModel(e,o,n){return o<=0?f:re({floor:e.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:o,height:n})}renderDock(e,o){let n=h`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
      title="Draw what Home Assistant's devices are doing now" @click=${()=>this.setToggle("live",!this.toggles.live)}><span class="hme-live-dot"></span>Live states</button>`;if(this.viewKind==="model"){let r=this.modelLookNow();return h`<div class="hme-dock">
        ${ge.map(s=>h`<button type="button" class="hme-tb ${s===r?"on":""}" aria-pressed=${s===r?"true":"false"} @click=${()=>{this.modelLook=s}}>${Hi[s]}</button>`)}
        <span class="hme-vsep"></span>
        <button type="button" class="hme-tb" title="Back to the home style's turn" @click=${()=>{this.modelTurn=void 0}}>⟲ Turn back</button>
        <span class="hme-vsep"></span>${n}
      </div>`}let a=this.stageSize.width>0?At(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,i=this.view===void 0||a===void 0?100:ln(this.view,a);return h`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" @click=${()=>this.zoomBy(1/Ie)}>−</button>
      <span class="hme-zoom mono">${i}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" @click=${()=>this.zoomBy(Ie)}>＋</button>
      <button type="button" class="hme-tb" @click=${()=>this.fit()}>Fit</button>
      <span class="hme-vsep"></span>
      ${o.dock?.(e)??f}
      <button type="button" class="hme-tb ${this.toggles.measure?"on":""}" aria-pressed=${this.toggles.measure?"true":"false"}
        title="Click two points to measure between them" @click=${()=>this.setToggle("measure",!this.toggles.measure)}>Measure</button>
      <span class="hme-vsep"></span>${n}
    </div>`}renderDialog(){let e=this.dialog;if(e===void 0)return f;let o=()=>e.kind==="confirm"?e.done(!1):e.done(void 0),n=a=>{e.kind==="confirm"?e.done(!0):e.done((a?.querySelector("input")?.value??e.value).trim()||e.value)};return h`<div class="hme-scrim" @pointerdown=${a=>{a.target===a.currentTarget&&o()}}>
      <div class="hme-dialog" role="dialog" aria-modal="true" aria-label=${e.title}
        @keydown=${a=>{a.key==="Escape"&&(a.stopPropagation(),o()),a.key==="Enter"&&(a.preventDefault(),n(a.currentTarget))}}>
        <h3>${e.title}</h3>
        ${e.kind==="confirm"?e.text===void 0?f:h`<p>${e.text}</p>`:h`<label class="hme-dialog-field"><span>${e.label}</span><input type="text" maxlength="100" .value=${e.value} autofocus /></label>`}
        <div class="hme-dialog-row">
          <button type="button" class="hme-tb" @click=${o}>Cancel</button>
          <button type="button" class="hme-tb primary ${e.kind==="confirm"&&e.danger===!0?"danger-fill":""}"
            @click=${a=>n(a.currentTarget.closest(".hme-dialog"))}>${e.ok}</button>
        </div>
      </div>
    </div>`}static{this.styles=[mo,no,$n]}};T([X({attribute:!1})],E.prototype,"hass",2),T([X({type:Boolean,reflect:!0})],E.prototype,"narrow",2),T([X({attribute:!1})],E.prototype,"icons",2),T([X({attribute:!1})],E.prototype,"iconsTick",2),T([X({attribute:!1})],E.prototype,"capable",2),T([X({attribute:!1})],E.prototype,"onHome",2),T([X({attribute:!1})],E.prototype,"onOpenPage",2),T([C()],E.prototype,"unsupported",2),T([C()],E.prototype,"loading",2),T([C()],E.prototype,"loadError",2),T([C()],E.prototype,"floorId",2),T([C()],E.prototype,"selection",2),T([C()],E.prototype,"mode",2),T([C()],E.prototype,"viewKind",2),T([C()],E.prototype,"view",2),T([C()],E.prototype,"artScale",2),T([C()],E.prototype,"stageSize",2),T([C()],E.prototype,"toggles",2),T([C()],E.prototype,"measure",2),T([C()],E.prototype,"floorMenu",2),T([C()],E.prototype,"dialog",2),T([C()],E.prototype,"modelLook",2),T([C()],E.prototype,"modelTurn",2),T([C()],E.prototype,"pages",2),T([C()],E.prototype,"spaceHeld",2),T([C()],E.prototype,"tick",2);var Wn=new WeakMap,Ei=1;function Jt(l){if(l===void 0)return 0;let t=Wn.get(l);return t===void 0&&Wn.set(l,t=Ei++),t}var Pi=l=>Jt(l);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",E);export{Mi as HOME_MAP_DRAG_SLOP,$i as HOME_MAP_EMPTY_TEXT,wi as HOME_MAP_UPDATE_TEXT,E as WaHomeMapEditor,ki as homeMapSaveWords};
