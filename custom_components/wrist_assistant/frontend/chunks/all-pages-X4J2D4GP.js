import{A as gt,B as kt,C as mt,D as bt,E as wt,a as w,b as E,c as Ze,d as et,e as tt,f as it,g as nt,h as q,i as D,j as st,k as at,l as rt,m as ot,o as dt,q as O,r as lt,s as ct,t as pt,u as ht,v as F,w as J,x as Y,y as ut,z as ft}from"./chunk-RL35VFMD.js";import{b as Ue,d as qe,e as Je}from"./chunk-A3CA56EC.js";import{b as Ye,h as Xe,j as Ge}from"./chunk-V5EJSAVK.js";import{d as He,i as ze}from"./chunk-OJ6U45JK.js";import{k as Be,n as Ae,p as W,q as z,r as U,t as Qe}from"./chunk-6262JQOF.js";import{Aa as je,Ba as Ve,Ca as We,G as Ce,H as Le,c as be,f as we,g as ve,h as ye,ia as $,ka as H,pa as Te,qa as Re,u as De,wa as j,xa as V,za as Ke}from"./chunk-3H2GNM5L.js";import"./chunk-AYDHV5MH.js";import{g as Ee,h as Oe,p as Fe,t as _e,z as Me}from"./chunk-FOJ7MUUN.js";import"./chunk-SAN2W4YQ.js";import{a as $e,c as L,f as xe,g as Ie,h as A}from"./chunk-TE5Q2R5V.js";import"./chunk-PEI2F5V4.js";import"./chunk-ZOJGMATP.js";import"./chunk-FR3OKHYP.js";import{g as Pe,h as Se,m as Ne}from"./chunk-TWGLBOZ3.js";import{b as pe,c as he,e as me}from"./chunk-ZHPGRUAI.js";import{c as ue}from"./chunk-GR4P77YP.js";import{X as ce,z as le}from"./chunk-S6CMFJW2.js";import{j as K,k as fe,l as B,q as ge,r as ke}from"./chunk-ESIOP3D4.js";import{Eg as R,Ge as ae,Gg as de,b as ne,d as h,g as b,j as se,jg as re,k as I,l as v,nh as P,qg as oe}from"./chunk-E5S2SHQS.js";import{Va as N}from"./chunk-PPFKQRTD.js";import{a as k}from"./chunk-LO2NM3CE.js";function vt(a,r){let e=new Set(a);return e.has(r)?e.delete(r):e.add(r),e}function yt(a,r,e,t){let i=new Set(a),n=r.indexOf(t),s=e===void 0?-1:r.indexOf(e);if(n<0)return i;if(s<0)return i.add(t),i;for(let d=Math.min(s,n);d<=Math.max(s,n);d++)i.add(r[d]);return i}function $t(a,r){return new Set([...a,...r])}function xt(a,r){let e=new Set(r);return new Set([...a].filter(t=>!e.has(t)))}function It(a,r){let e=new Set(r);return new Set([...a].filter(t=>e.has(t)))}function y(a){return a.id.toUpperCase()}function X(a,r,e){let i={kind:a[0]?.kind??"pages",items:[],kept:[],devices:[]},n=new Set;for(let s of a){let d=r.filter(l=>s.owners.some(c=>$(c,l.ownerId))).map(l=>l.ownerId),o=d.filter(l=>e(l,s.kind));if(o.length>0){i.kept.push({name:s.name,dirty:o});continue}i.items.push({id:s.id,name:s.name,owners:[...s.owners]});for(let l of d)n.add(l)}return i.devices=r.map(s=>s.ownerId).filter(s=>n.has(s)),i}var T=(a,r)=>a.find(e=>$(e.ownerId,r))?.name??"a device";function Pt(a,r){let e=a.items.length,t=e===1?"it":"them",i=`Delete ${e} ${w(a.kind,e)} from the library?`,n=a.devices.map(o=>T(r,o)),s=a.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,d=[n.length===0?`No device has ${t}. This cannot be undone.`:`${e===1?"It comes":"They come"} off ${L(n)}, ${s}. This cannot be undone.`];for(let o of a.kept){let l=o.dirty.map(c=>T(r,c));d.push(`${o.name} stays: ${L(l)} ${l.length===1?"has":"have"} unsaved edits.`)}return{title:i,body:d.join(" ")}}async function St(a,r,e,t){let i={kind:r.kind,gone:[],kept:r.kept.map(s=>({...s,dirty:[...s.dirty]})),failed:[],stuck:[],taps:[]},n=new Map;for(let[s,d]of r.items.entries()){t?.(`Deleting ${d.name} (${s+1} of ${r.items.length})\u2026`);let o=await a.delete(r.kind,d.id);if(!o.ok){i.failed.push({name:d.name,text:o.text});continue}i.gone.push(d.name);for(let l of o.reply.link_failures??[]){let c=l.name??T(e,l.owner);i.stuck.includes(c)||i.stuck.push(c)}for(let l of d.owners)n.set(l,[...n.get(l)??[],d.id])}if(r.kind==="pages")for(let[s,d]of n){t?.(`Clearing complication taps on ${T(e,s)}\u2026`);let o=!1;try{o=await a.clearTaps(s,d)}catch{o=!1}o||i.taps.push(T(e,s))}return i}function Nt(a){let r=n=>`${n} ${w(a.kind,n)}`,e=[];a.gone.length>0&&e.push(`Deleted ${a.gone.length===1?a.gone[0]:r(a.gone.length)}.`);let t=e.length>0,i=!1;for(let n of a.kept)i=!0,e.push(`Kept ${n.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let n of a.failed)i=!0,e.push(`Not deleted: ${n.name}. ${n.text}`);return a.stuck.length>0&&(i=!0,e.push(`Could not take ${a.gone.length===1?"it":"them"} off ${L(a.stuck)}.`)),a.taps.length>0&&(i=!0,e.push(`Could not clear the complication taps that opened ${a.gone.length===1?"it":"them"} on ${L(a.taps)}. Change those by hand.`)),!t&&!i?{kind:"ok",text:"Nothing was deleted."}:{kind:i?t?"warn":"err":"ok",text:e.join(" ")}}function Dt(a){return a==="status_pages"?"statusPages":"pages"}function Ft(a,r){return!K(r)||typeof r.id!="string"?!1:a==="status_pages"?!0:!ge(r)}function _t(a,r,e){if("hidden"in e)return a==="status_pages"?r:Ne(r,e.id,e.hidden);let t=r[Dt(a)];if(!Array.isArray(t))return r;let i=[];t.forEach((p,g)=>{Ft(a,p)&&i.push(g)});let n=i.map(p=>t[p]),s=n.findIndex(p=>$(p.id,e.id));if(s<0)return r;let d=n[s],o=n.filter((p,g)=>g!==s),l=e.before===null?-1:o.findIndex(p=>$(p.id,e.before));if(e.before!==null&&l<0)return r;let c=l<0?[...o,d]:[...o.slice(0,l),d,...o.slice(l)];if(c.every((p,g)=>p===n[g]))return r;let u=t.slice();return i.forEach((p,g)=>{u[p]=c[g]}),{...r,[Dt(a)]:u}}var Mt=3;async function Ct(a,r,e,t){for(let i=1;;i++){let n;try{n=await a.read(r,e)}catch(o){let{code:l="unknown",message:c}=N(o);return{ok:!1,code:l,message:c}}let s=n.revision>0?e==="status_pages"?De(n.document):fe(n.document):void 0;if(s===void 0)return{ok:!0,changed:!1};let d=_t(e,s,t);if(d===s)return{ok:!0,changed:!1};try{return await a.save(r,e,n.revision,d),{ok:!0,changed:!0}}catch(o){let{code:l="unknown",message:c}=N(o);if(l!=="conflict"||i>=Mt)return{ok:!1,code:l,message:c}}}}function G(a,r){return a==="status_pages"?`${r}'s status pages have unsaved edits. Save or discard them first.`:`${r}'s pages have unsaved edits. Save or discard them first.`}async function Bt(a,r,e){let t=!0,i=await re(a,r);for(let n of i.records){if(n.deleted||!K(n.document))continue;let s=He(n.document,e);if(s!==void 0)try{await oe(a,r,s,n.revision)}catch{t=!1}}return t}function Lt(a){return{delete:async(r,e)=>{try{return{ok:!0,reply:await be(a,r,e)}}catch(t){let i=ye(t),n=ve(t);return i===void 0?{ok:!1,text:n}:{ok:!1,code:i,text:n}}},clearTaps:(r,e)=>Bt(a,r,e)}}function Tt(a){return{read:(r,e)=>R(a,r,e),save:(r,e,t,i)=>de(a,r,e,t,i)}}var _=200,Q=320,Rt=6,C=ce.screen;function At(a,r,e,t=C){if(ke(a))return{top:0,height:t.height};let i=Ee(Oe(a,r),t);if(i.tiles.length===0)return{top:0,height:t.height};let s=Fe(a,1,i.topInset,e)!==b?0:Math.max(0,i.topInset+Math.min(...i.tiles.map(o=>o.y))-Rt),d=i.topInset+Math.max(...i.tiles.map(o=>o.y+o.height))+Rt;return{top:s,height:Math.max(1,d-s)}}var Ht=2e3,Ot={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"},Z=new Map;function ee(a){let r=Z.get(a);if(r!==void 0)return r;let e={kind:"all"};try{let t=window.localStorage.getItem(Ot[a]),i=t?JSON.parse(t):{};typeof i.filter=="string"&&(e.filter=i.filter),(i.kind==="watch"||i.kind==="iphone")&&(e.kind=i.kind)}catch{}return Z.set(a,e),e}function Kt(a,r){let e={...ee(a),...r};Z.set(a,e);try{window.localStorage.setItem(Ot[a],JSON.stringify(e))}catch{}}var M=(a,r="pages")=>(r==="status_pages"?Ye(a)?.dirty:Ue(a)?.dirty)??!1,Et=(a,r)=>`${a}|${r.toUpperCase()}`,f=class extends se{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.search="";this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new je(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.colorsFor=he();this.colorOf=e=>pe(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let i=Date.now();(t||i-this.hassDrawnAt>=Ht)&&(this.hassDrawnAt=i,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown)}willUpdate(e){e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged();let t=this.filterDevice();this.kind==="pages"&&t!==void 0&&!this.freeAsked.has(t.ownerId)&&this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.picksNote=void 0,this.tickNotes=new Map}get filter(){return at(ee(this.kind).filter,this.devices)}filterDevice(){let e=this.filter;return e===D?void 0:this.devices.find(t=>t.ownerId===e)}get deviceKind(){return ot(ee(this.kind).kind,this.devices)}get devices(){return $e(this.owners,this.phones)}waiting(e){let t=new Map;for(let i of this.devices)t.set(i.ownerId,{held:Re(e,i.ownerId,this.kind),free:!1});return Ie(this.owners,t)}setFilter(e){Kt(this.kind,{filter:e}),e!==D&&this.endSelect(!0),this.picksNote=void 0,this.requestUpdate()}setSearch(e){this.search=e,this.pruneSelected()}setDeviceKind(e){Kt(this.kind,{kind:e}),this.requestUpdate(),this.pruneSelected()}newPage(e){if(this.newForm=void 0,this.kind==="status_pages"){Ge(e.ownerId),this.onOpen?.(e.ownerId,e.kind,"status_pages");return}Je(e.ownerId),this.onOpen?.(e.ownerId,e.kind)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!this.newForm?.busy){if(this.newForm!==void 0){this.newForm=void 0;return}this.newForm={name:this.nextCardName(),busy:!1}}}nextCardName(){let e=this.lib.library,t=e===void 0?[]:H(e,this.kind).map(i=>i.item);return this.kind==="status_pages"?Ce({schemaVersion:1,statusPages:t}):Pe({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let i=e.name.trim();if(i===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${w(this.kind)} a name.`}};return}let{note:n,...s}=e;this.newForm={...s,busy:!0};let d=ae(),o=this.kind==="status_pages"?{schemaVersion:1,statusPages:[Le(i,d)]}:{schemaVersion:1,pages:[Se(d,i)]},l=await t.createItem(this.kind,o);if(!l.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${l.text}`}};return}this.newForm=void 0,this.onOpenLibrary?.(this.kind,l.reply.id)}open(e,t){let i=t??F(e,this.filter,this.deviceKind,this.devices);if(i===void 0){this.onOpenLibrary?.(e.kind,e.id);return}if(e.kind==="status_pages"){Xe(i.ownerId,e.id),this.onOpen?.(i.ownerId,i.kind,"status_pages");return}qe(i.ownerId,{pageId:e.id}),this.onOpen?.(i.ownerId,i.kind)}async tick(e,t,i){let n=this.lib.store;if(n===void 0)return;let s=y(e);if(this.tickNotes.has(s)){let p=new Map(this.tickNotes);p.delete(s),this.tickNotes=p}if(!(await ze(this.hassNow,n,t,e.kind,e.id,i)).ok||!i||e.kind!=="pages")return;let o=await this.readFree(t),l=this.lib.library,c=this.devices.find(p=>p.ownerId===t)?.name;if(!o||l===void 0||c===void 0||V(l,t,"pages")<2)return;let u=A([c]);u!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(s,`Added to ${c}. ${u}`))}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let n=(await R(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==n&&(this.freeFacts=new Map(this.freeFacts).set(e,n)),n}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,i){let n=this.hassNow,s=this.lib.store;if(n===void 0||s===void 0||this.picksBusy)return;let d=this.kind;if(M(e.ownerId,d)){this.picksNote={kind:"warn",text:G(d,e.name)};return}let o=this.kindSeq,l="hidden"in t,c=Et(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,l?this.hiddenAsked=new Map(this.hiddenAsked).set(c,t.hidden):i!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:d,ids:ht(i,t.id,t.before)});let u=this.orderAsked,p;try{let g=await Ct(Tt(n),e.ownerId,d,t);g.ok||(p={kind:"err",text:`${l?"Not changed":"Not moved"} on ${e.name}: ${g.message.replace(/\.$/,"")}.`})}catch(g){p={kind:"err",text:N(g).message}}if(await s.refresh(),this.picksBusy=!1,l){let g=new Map(this.hiddenAsked);g.delete(c),this.hiddenAsked=g}else this.orderAsked===u&&(this.orderAsked=void 0);o===this.kindSeq&&(this.picksNote=p)}shownNow(){let e=this.lib.library;return e===void 0?[]:O(e,this.kind,this.search,this.deviceKind,this.devices)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(y(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=It(this.selected,this.shownNow().map(y)))}startSelect(){this.selecting=!0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let i=y(e);this.selected=t?yt(this.selected,this.shownNow().map(y),this.anchor,i):vt(this.selected,i),this.anchor=i,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(y);this.selected=e?$t(this.selected,t):xt(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}async runDelete(){let e=this.hassNow,t=this.lib.store;if(e===void 0||t===void 0||this.bulkBusy!==void 0)return;let i=this.pickedItems();if(i.length===0)return;let n=this.kindSeq,s=this.devices;this.asking=!1,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let d;try{let o=await St(Lt(e),X(i,s,M),s,l=>{this.bulkBusy=l});d=Nt(o)}catch(o){d={kind:"err",text:N(o).message}}this.bulkBusy="Reading the library again\u2026";try{await t.refresh()}finally{this.bulkBusy=void 0}n===this.kindSeq&&(this.pruneSelected(),this.anchor=void 0,this.bulkNote=d)}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return h`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let t=this.kind,i=this.lib.library,n=this.lib.readState,s=this.filterDevice(),d=w(t,2),o=e.length>1,l=this.filter,c=i===void 0?n==="unsupported"?we:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${d}\u2026`:it(H(i,t).length,t),u=i!==void 0&&n==="failed";return h`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${tt(t)}</h1>
          <p class="ap-lead">${c}</p>
        </div>
        ${e.length===0?b:this.renderNew(s,e)}
      </div>
      ${this.newForm===void 0?b:this.renderNewForm(this.newForm)}
      ${u?h`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:b}
      <div class="pk-surface pk-page" role="region" aria-label=${`Your ${d}`}>
        <div class="pk-pin">
          ${this.renderHead(i,s,e)}
          ${o?this.renderTabs(e,i,l):b}
          ${this.selecting&&s===void 0?this.renderBar(e):b}
        </div>
        <div class="pk-body" role=${o?"tabpanel":b} aria-labelledby=${o?`ap-tab-${l}`:b}>
          ${i===void 0?h`<p class="ap-empty">${c}</p>`:s===void 0?this.renderAll(i,e):this.renderDevice(i,lt(i,s,t,this.search),e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${nt(t,s,this.selecting&&s===void 0)}</span></div>
      </div>
    </div></div>`}renderAll(e,t){let i=O(e,this.kind,this.search,this.deviceKind,t);if(i.length===0)return h`<p class="ap-empty">${mt(t,this.search,this.deviceKind,this.kind)}</p>`;let n=this.waiting(e);return h`<div class="ap-grid" role="list">${i.map(s=>this.renderCard(e,s,t,n))}</div>`}renderHead(e,t,i){let n=this.selecting,s=this.bulkBusy!==void 0,d=w(this.kind,2);return h`<div class="pk-head">
      ${t===void 0?h`<button type="button" class="pk-pick-btn ${n?"on":""}" aria-pressed=${n?"true":"false"}
        title=${n?`Back to opening one ${w(this.kind)} at a time`:`Pick several ${d} to delete together`}
        ?disabled=${s||e===void 0} @click=${()=>n?this.endSelect():this.startSelect()}>
        ${P("checklist")}<span>Multi select</span></button>`:b}
      ${t===void 0&&e!==void 0&&rt(i)?this.renderKinds(e,i):b}
      <label class="pk-search">
        ${P("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${d}`}
          @input=${o=>this.setSearch(o.target.value)} />
      </label>
    </div>`}renderNew(e,t){let i=`New ${w(this.kind)}`;if(e!==void 0)return h`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${E(this.kind)} on ${e.name}`}
          @click=${()=>this.newPage(e)}>
          ${P("plus")}<span>${i}</span></button>
      </div>`;let n=this.mayMake,s=this.newForm!==void 0;return h`<div class="ap-new">
      <button type="button" class="ap-new-btn ${s?"on":""}" aria-expanded=${s?"true":"false"}
        ?disabled=${!n||this.newForm?.busy===!0}
        title=${n?`Make ${E(this.kind)} no device has yet`:et(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${P("plus")}<span>${i}</span></button>
    </div>`}renderNewForm(e){let t=w(this.kind);return h`<form class="ap-new-form" aria-label=${`New ${t}`} @submit=${i=>{i.preventDefault(),this.makeCard()}}>
      <label class="ap-new-field"><span>Name</span>
        <input type="text" .value=${e.name} ?disabled=${e.busy} maxlength="80"
          @input=${i=>{this.newForm={...e,name:i.target.value}}} /></label>
      <p class="ap-new-text">${Ze(this.kind)}</p>
      <span class="ap-new-acts">
        <button type="submit" class="ap-btn primary" ?disabled=${e.busy}>${e.busy?"Making\u2026":`Make ${t}`}</button>
        <button type="button" class="ap-btn" ?disabled=${e.busy} @click=${()=>{this.newForm=void 0}}>Cancel</button>
      </span>
      ${e.note===void 0?b:h`<p class="lt-line ${e.note.kind}" role="status">${e.note.text}</p>`}
    </form>`}renderKinds(e,t){let i=this.deviceKind,n=dt(O(e,this.kind,this.search,"all",t),t);return h`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label=${`Show the ${w(this.kind,2)} on one kind of device`} .value=${i}
        @change=${s=>this.setDeviceKind(s.target.value)}>
        ${n.map(s=>h`<option value=${s.key} ?selected=${s.key===i}>${s.label} (${s.count})</option>`)}
      </select>
    </label>`}renderTabs(e,t,i){return h`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${st(e,t,this.kind,this.colorOf).map(n=>h`<button type="button" role="tab" class="pk-tab ${n.id===i?"on":""}"
        style=${n.color===void 0?b:`--dc:${n.color}`} id=${`ap-tab-${n.id}`} aria-selected=${n.id===i?"true":"false"}
        title=${n.id===D?`Every ${w(this.kind)} in your home`:`The ${w(this.kind,2)} on ${n.label}`}
        @click=${()=>this.setFilter(n.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${P(n.kind===void 0?"grid":n.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${n.label}</span>
        <span class="pk-tab-count">${n.count}</span>
      </button>`)}
    </div>`}renderCardTicks(e,t,i,n,s){let d=this.lib.store,o=y(t),l=d?.noteFor(t.kind,t.id)??this.tickNotes.get(o),c=this.hassNow?.user?.is_admin;return Ve({library:e,kind:t.kind,itemId:t.id,devices:i,colorOf:this.colorOf,...d===void 0?{}:{pending:d.pending},...l===void 0?{}:{note:l},...c===void 0?{}:{admin:c},...s===void 0?{}:{addFor:s},locked:u=>{let p=Te(e,u,t.kind,t.id);if(p&&M(u,t.kind))return G(t.kind,i.find(g=>g.ownerId===u)?.name??"This device");if(!p&&n.has(u))return xe}},(u,p)=>{this.tick(t,u,p)})}renderCard(e,t,i,n){let s=this.selecting,d=y(t),o=s&&this.selected.has(d),l=F(t,D,this.deviceKind,i),c=s?`${o?"Let":"Pick"} ${t.name}${o?" go":""}`:l===void 0?J(t.name):`Edit ${t.name} on ${l.name}`,u=p=>this.cardClick(p,t);return h`<div class="ap-card ${s?"picking":""} ${o?"picked":""}" role="listitem" data-card=${d}
      @click=${p=>{s&&u(p)}}>
      <div class="ap-top">
        ${s?h`<input type="checkbox" class="pk-card-pick" .checked=${le(o)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${c}
          @click=${p=>{p.stopPropagation(),this.pick(t,p.shiftKey)}} />`:b}
        <button type="button" class="ap-open" title=${c} tabindex=${s?"-1":"0"} @click=${u}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${q(t)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${c} @click=${u}>
        ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumb(e,t,l)}
      </button>
      ${this.renderCardTicks(e,t,i,n)}
    </div>`}renderDevice(e,t,i){let{device:n}=t,s=this.orderAsked,d=s!==void 0&&s.ownerId===n.ownerId&&s.kind===this.kind?s.ids:void 0,o=ct(t.picks,d),l=o.map(x=>x.id),c=V(e,n.ownerId,this.kind),u=this.search.trim()===""&&!this.picksBusy,p=this.kind==="pages"&&this.freeFacts.get(n.ownerId)===!0&&c>1?A([n.name]):void 0,g=this.waiting(e),S=this.kind==="pages"?B(j(e,n.ownerId)):void 0;return h`<div class="lt-view">
      <div class="lt-sect"><span>${Y(n)} <small>${c}</small></span><span class="lt-sect-r">${ut(n)}</span></div>
      ${this.picksNote===void 0?b:h`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${o.length===0?h`<div class="lt-list"><p class="lt-empty">${kt(n,this.kind,this.search)}</p></div>`:h`<div class="lt-list" role="list" aria-label=${Y(n)}>${o.map((x,m)=>this.renderRow(x,m,l,n,i,u,S))}</div>`}
      ${p===void 0?b:h`<p class="lt-line">${p}</p>`}
      <div class="lt-sect"><span>${ft(n)} <small>${t.rest.length}</small></span><span class="lt-sect-r">${gt}</span></div>
      ${t.rest.length===0?h`<p class="lt-line">${this.search.trim()===""?`Every ${w(this.kind)} in your home is on ${n.name}.`:`No other ${w(this.kind)} has that name.`}</p>`:h`<div class="ap-grid" role="list">${t.rest.map(x=>this.renderRest(e,x,n,i,g))}</div>`}
    </div>`}renderRow(e,t,i,n,s,d,o){let l=Et(n.ownerId,e.id),c=this.hiddenAsked.get(l)??e.hidden,u=this.kind==="status_pages",p=Ke({...e,hidden:c},n.ownerId,s),g=this.overId!==void 0&&$(this.overId,e.id)&&this.dragId!==void 0&&!$(this.dragId,e.id),S=g&&i.findIndex(m=>$(m,this.dragId))<t,x=m=>{m!==void 0&&this.changePicks(n,{id:e.id,before:m},[...i])};return h`<div class="lt-row ${c?"hid":""} ${g?"drag-over":""} ${S?"below":""} ${this.dragId!==void 0&&$(this.dragId,e.id)?"dragging":""}"
      role="listitem" data-id=${e.id} draggable=${d?"true":"false"} tabindex="-1"
      @dragstart=${m=>{d&&(this.dragId=e.id,m.dataTransfer?.setData("text/plain",e.id),m.dataTransfer&&(m.dataTransfer.effectAllowed="move"))}}
      @dragover=${m=>{this.dragId!==void 0&&(m.preventDefault(),this.overId!==e.id&&(this.overId=e.id))}}
      @drop=${m=>{m.preventDefault();let te=this.dragId;this.dragId=void 0,this.overId=void 0;let ie=te===void 0?void 0:pt(i,te,e.id);ie!==void 0&&this.changePicks(n,ie,[...i])}}
      @dragend=${()=>{this.dragId=void 0,this.overId=void 0}}
      @keydown=${m=>{!m.altKey||!d||m.key!=="ArrowUp"&&m.key!=="ArrowDown"||(m.preventDefault(),m.key==="ArrowUp"?x(t>0?i[t-1]:void 0):x(t<i.length-1?i[t+2]??null:void 0))}}>
      <span class="lt-grip" aria-hidden="true" title=${d?"Drag to order":""}>${P("grip")}</span>
      <button type="button" class="lt-row-open" title=${`Edit ${e.entry.name} on ${n.name}. Alt+Up or Alt+Down moves it.`}
        @click=${()=>this.open(e.entry,n)}>
        ${u?U({page:e.entry.item,hass:this.hassNow,...this.icons===void 0?{}:{icons:this.icons},tick:this.iconsTick}):z({page:e.entry.item,iphone:n.kind==="iphone",tick:this.iconsTick,...o===void 0?{}:{pages:o},...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}})}
        <span class="lt-row-nm"><span class="lt-row-n">${e.entry.name}</span><span class="lt-row-m">${p}</span></span>
      </button>
      ${u?b:h`<button type="button" class="lt-eye" ?disabled=${this.picksBusy}
        title=${c?`Show ${e.entry.name} on ${n.name} again`:`Keep ${e.entry.name} on ${n.name} without showing it`}
        @click=${()=>{this.changePicks(n,{id:e.id,hidden:!c})}}>${c?"Show here":"Hide here"}</button>`}
    </div>`}renderRest(e,t,i,n,s){let d=F(t,D,"all",n),o=d===void 0?J(t.name):`Edit ${t.name} on ${d.name}`,l=t.kind==="status_pages"?U({page:t.item,hass:this.hassNow,width:W,tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}}):z({page:t.item,width:W,tick:this.iconsTick,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}});return h`<div class="ap-card lt-dim" role="listitem" data-card=${y(t)}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${o} @click=${()=>this.open(t)}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${q(t)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb lt-thumb-sm" tabindex="-1" aria-hidden="true" title=${o} @click=${()=>this.open(t)}>${l}</button>
      ${this.renderCardTicks(e,t,n,s,i.ownerId)}
    </div>`}renderBar(e){let t=this.shownNow(),i=t.filter(p=>this.selected.has(y(p))),n=i.length,s=this.bulkBusy!==void 0,d=n===0,o=t.length>0&&t.every(p=>this.selected.has(y(p))),l=s?void 0:this.bulkNote,c=w(this.kind),u=w(this.kind,2);return h`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${u}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(d?`Pick ${E(this.kind)} to start.`:`${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${s||t.length===0}
        title=${o?`Let the ${u} on screen go`:`Pick every ${c} the search and the Device menu have left`}
        @click=${()=>this.selectShown(!o)}>${o?"None":"All shown"}</button>
      ${l===void 0?b:h`<span class="pk-bar-said ${l.kind}">${l.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!d?this.renderDeleteAsk(i,e):h`<button type="button" class="ghost danger small" ?disabled=${s||d}
            title=${`Delete these ${u} from the library, and from every device they are on`}
            @click=${()=>this.toggleAsk()}>${P("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${s}
        title=${`Stop picking and go back to opening one ${c} at a time`}
        @click=${()=>this.endSelect()}>${P("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let i=X(e,t,M),n=Pt(i,t);return h`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${i.items.length===0}
        @click=${()=>{this.runDelete()}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,i){let n=t.item,s=i===void 0?[]:B(j(e,i.ownerId)),d=s.length===0?[n]:s,o=this.hassNow?.states,l=this.icons,c=_/C.width,u=At(n,o,l),p=u.height*c,g=p>Q,S=x=>`${Math.round(x*100)/100}px`;return h`<span class="ap-pic ${g?"cut":""}" style=${`width:${S(_)};height:${S(Math.min(p,Q))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${S(-u.top*c)})`}>${_e({page:n,pages:d,screen:C,scale:c,...o===void 0?{}:{states:o},...l===void 0?{}:{icons:l}})}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,i=_/C.width,n=o=>`${Math.round(o*100)/100}px`,d=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return h`<span class="ap-pic ap-pic-status ${d?"cut":""}" style=${`width:${n(_)};height:${n(Math.min(C.height*i,Q))}`}>
      <span class="ap-pic-in">${t===void 0?b:Be({page:e.item,hass:t,icons:this.icons??ue,screen:C,scale:i})}</span>
    </span>`}static{this.styles=[Me,me,Ae,wt,bt,We,Qe,ne`
    /* New page: filled, as New complication is, the one way to start a page
       from this tab. On All its form opens under the head, as New menu's. */
    .ap-new { position: relative; flex: none; }
    .ap-new-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px; font-weight: 600;
      height: 30px; padding: 0 11px; border-radius: 8px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink);
    }
    .ap-new-btn:hover:not(:disabled) { filter: brightness(1.1); }
    .ap-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-new-btn:disabled { opacity: .45; cursor: default; }
    .ap-new-btn svg { width: 16px; height: 16px; }
    .ap-new-form {
      display: flex; flex-wrap: wrap; align-items: flex-end; gap: 10px 14px; padding: 12px 14px; margin-bottom: 12px;
      border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-card);
    }
    .ap-new-field { display: flex; flex-direction: column; gap: 4px; font-size: 11.5px; color: var(--wa-muted); }
    .ap-new-field input {
      width: 220px; max-width: 70vw; height: 28px; padding: 0 9px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
      font: inherit; font-size: 13px; color: var(--wa-ink); background: var(--wa-input, var(--wa-field));
    }
    .ap-new-field input:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .ap-new-text { flex: 1 1 220px; margin: 0; font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
    .ap-new-acts { display: inline-flex; gap: 6px; flex: none; }
    .ap-new-form .lt-line { flex-basis: 100%; }
    .ap-btn {
      display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 10px; border-radius: 7px;
      border: 1px solid var(--wa-line-strong); background: var(--wa-panel, var(--wa-card)); color: var(--wa-ink);
      font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
    }
    .ap-btn:hover:not(:disabled) { background: var(--wa-hover); }
    .ap-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-btn:disabled { opacity: .45; cursor: default; }
    .ap-btn.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }

    /* A status page's picture: the watch's black screen, one screen tall. */
    .ap-pic-status .sp-screen { pointer-events: none; }
    .pk-pick-btn {
      display: inline-flex; align-items: center; gap: 6px; flex: none; font: inherit; font-size: 12.5px;
      height: 28px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
      background: var(--wa-field); color: var(--wa-ink); cursor: pointer; font-weight: 600;
    }
    .pk-pick-btn:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .pk-pick-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-pick-btn:disabled { opacity: .45; cursor: default; }
    .pk-pick-btn svg { width: 14px; height: 14px; }
    .pk-pick-btn.on { border-color: transparent; background: var(--wa-seg-on); color: var(--wa-ink); }

    /* The panel's small buttons (form-styles.ts), for the bar. */
    button.small {
      display: inline-flex; align-items: center; gap: 5px;
      font: inherit; font-size: 13px; font-weight: 600; padding: 0 9px; min-height: 26px; border-radius: 6px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-field); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    button.small:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.small:disabled { opacity: .45; cursor: default; }
    button.small > svg { width: 13px; height: 13px; flex: none; }
    button.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }
    button.primary:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-primary-bg) 85%, var(--wa-muted)); }

    /* The bar under the tabs while cards are picked, the Complications
       list's. */
    .pk-bar {
      display: flex; align-items: center; flex-wrap: wrap; gap: 8px; flex: none;
      padding: 8px 18px; border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .pk-bar-count { font-size: 12px; color: var(--wa-muted); min-width: 90px; }
    .pk-bar-said { min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
    .pk-bar-said.ok { color: var(--wa-ok, var(--wa-ink)); }
    .pk-bar-said.warn, .pk-bar-said.err { color: var(--wa-need); }
    .pk-bar-ask { flex: 1 1 260px; min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
    .pk-bar-ask b { font-weight: 600; }
    .pk-bar-gap { flex: 1; min-width: 0; }
    .pk-bar button.ghost {
      font-size: 12.5px; min-height: 28px; padding: 0 10px; border-radius: 8px;
      border-color: var(--wa-line); background: var(--wa-panel); color: var(--wa-ink);
    }
    .pk-bar button.ghost:hover:not(:disabled), .pk-bar button.ghost.on { border-color: var(--wa-line-strong); background: var(--wa-card); }
    .pk-bar button.ghost.danger {
      color: var(--error-color, #b42318);
      border-color: color-mix(in srgb, var(--error-color, #b42318) 45%, var(--wa-line));
      background: color-mix(in srgb, var(--error-color, #b42318) 10%, var(--wa-panel));
    }
    .pk-bar button.ghost.danger:hover:not(:disabled) {
      background: color-mix(in srgb, var(--error-color, #b42318) 18%, var(--wa-panel));
    }
    .pk-bar button.ghost svg { width: 14px; height: 14px; color: var(--wa-muted); }
    .pk-bar button.ghost.danger svg { color: inherit; }
    .pk-bar-done { margin-left: 4px; }
    .pk-bar-done svg { width: 14px; height: 14px; }
    /* A card's tick while picking: a box, not the panel's switch. */
    input.pk-card-pick {
      appearance: none; -webkit-appearance: none; position: relative; flex: none; margin: 0; cursor: pointer;
      width: 17px; height: 17px; border-radius: 5px; border: 0;
      background: color-mix(in srgb, var(--wa-ink) 8%, transparent);
      box-shadow: inset 0 0 0 1.5px var(--wa-line-strong);
    }
    input.pk-card-pick::after {
      content: ""; position: absolute; top: 2px; left: 6px; width: 4px; height: 8.5px; opacity: 0;
      border: solid var(--wa-primary-ink, #fff); border-width: 0 2px 2px 0;
      transform: rotate(45deg); transition: opacity .1s ease-out;
    }
    input.pk-card-pick:checked { background: var(--wa-accent); box-shadow: inset 0 0 0 1.5px var(--wa-accent); }
    input.pk-card-pick:checked::after { opacity: 1; }
    input.pk-card-pick:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px var(--wa-accent); }
    input.pk-card-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    input.pk-card-pick:disabled { opacity: .45; cursor: default; }

    /* The page alone in a plain outline: no case, no clock, no page dots,
       no fold line. */
    .ap-pic {
      position: relative; display: block; max-width: 100%; overflow: hidden; line-height: 0; pointer-events: none;
      border-radius: 10px; box-shadow: 0 0 0 1px var(--wa-line-strong);
    }
    .ap-pic-in { display: block; }
    .ap-pic .wa-watch { padding: 0; margin: 0; background: none; box-shadow: none; border-radius: 0; }
    .ap-pic .wa-watch::before, .ap-pic .wa-watch::after { display: none; }
    .ap-pic .wa-watch > .wp-screen { border-radius: 0; }
    .ap-pic :is(.wp-clock, .wp-pages, .wp-fold) { display: none; }
    /* A page taller than the picture fades out at its foot. */
    .ap-pic.cut::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 36px;
      background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, .75));
    }
    /* Picking: every click on the card picks it, and a picked card wears
       the Complications card's ink ring. */
    .ap-card.picking { cursor: pointer; user-select: none; }
    .ap-card.picked { border-color: var(--wa-ink); box-shadow: 0 0 0 1px var(--wa-ink); }
    /* A phone: the bar folds with the head (\`listTabStyles\`). */
    @media (max-width: 640px) {
      .pk-bar { padding: 8px 10px; }
    }
  `]}};k([I({attribute:!1})],f.prototype,"kind",2),k([I({attribute:!1})],f.prototype,"owners",2),k([I({attribute:!1})],f.prototype,"ownersReady",2),k([I({attribute:!1})],f.prototype,"phones",2),k([I({attribute:!1})],f.prototype,"icons",2),k([I({attribute:!1})],f.prototype,"iconsTick",2),k([I({attribute:!1})],f.prototype,"onOpen",2),k([I({attribute:!1})],f.prototype,"onOpenLibrary",2),k([v()],f.prototype,"search",2),k([v()],f.prototype,"newForm",2),k([v()],f.prototype,"selecting",2),k([v()],f.prototype,"selected",2),k([v()],f.prototype,"asking",2),k([v()],f.prototype,"bulkBusy",2),k([v()],f.prototype,"bulkNote",2),k([v()],f.prototype,"tickNotes",2),k([v()],f.prototype,"picksBusy",2),k([v()],f.prototype,"picksNote",2),k([v()],f.prototype,"orderAsked",2),k([v()],f.prototype,"hiddenAsked",2),k([v()],f.prototype,"dragId",2),k([v()],f.prototype,"overId",2),k([v()],f.prototype,"freeFacts",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",f);export{f as WaAllPages,At as pageCrop};
