import{a as $t,b as xt,c as It,d as Pt,e as St}from"./chunk-2SH6SHP2.js";import{b as ft,d as kt,e as gt}from"./chunk-WN3G6X5M.js";import{b as mt,h as bt,j as wt}from"./chunk-G5K2S4KO.js";import{d as We,i as Je}from"./chunk-RAUEZUDT.js";import{A as tt,B as it,C as nt,E as st,G as F,H as rt,I as at,J as ot,K as dt,L as M,M as U,N as z,O as ct,P as lt,Q as pt,R as ht,S as ut,U as q,V as J,W as Y,Y as yt,m as He,p as Ve,q as w,r as O,s as Ye,t as Xe,u as Ge,v as Qe,w as Ze,x as W,y as D,z as et}from"./chunk-AITT3GZ3.js";import{Ba as qe,E as Ce,F as Te,Ja as vt,c as we,d as ve,e as ye,f as $e,ga as $,ia as E,na as Re,oa as Ke,s as Le,ua as H,va as V,xa as Ee,ya as Ue,za as ze}from"./chunk-RYIWSF72.js";import"./chunk-Y6B2LSOK.js";import{A as Ae,H as je,m as Fe,n as Me,v as _e,z as Be}from"./chunk-YW4TPIGA.js";import{Za as Oe}from"./chunk-H4LINNFM.js";import{a as xe,c as C,f as Ie,g as Pe,h as j}from"./chunk-XF6VR4HJ.js";import"./chunk-I3PRR7YI.js";import"./chunk-ZOJGMATP.js";import"./chunk-EP5G2YR6.js";import{g as Se,h as Ne,m as De}from"./chunk-N7OCRJ4I.js";import{b as he,c as ue,e as be}from"./chunk-KBXFS4SO.js";import{c as fe}from"./chunk-SV3BTW33.js";import{X as pe,z as le}from"./chunk-MWEKV7XW.js";import{j as K,k as ke,l as A,q as ge,r as me}from"./chunk-EU2Q2T22.js";import{Eg as R,Ge as ae,Gg as ce,b as se,d as h,g as b,j as re,jg as oe,k as S,l as v,nh as I,qg as de}from"./chunk-BDP52PL7.js";import{Xa as N}from"./chunk-TGJNCNIU.js";import{a as g}from"./chunk-LO2NM3CE.js";function Nt(r,a){let e=new Set(r);return e.has(a)?e.delete(a):e.add(a),e}function Dt(r,a,e,t){let i=new Set(r),n=a.indexOf(t),s=e===void 0?-1:a.indexOf(e);if(n<0)return i;if(s<0)return i.add(t),i;for(let o=Math.min(s,n);o<=Math.max(s,n);o++)i.add(a[o]);return i}function Lt(r,a){return new Set([...r,...a])}function Ct(r,a){let e=new Set(a);return new Set([...r].filter(t=>!e.has(t)))}function Tt(r,a){let e=new Set(a);return new Set([...r].filter(t=>e.has(t)))}function y(r){return r.id.toUpperCase()}function X(r,a,e){let i={kind:r[0]?.kind??"pages",items:[],kept:[],devices:[]},n=new Set;for(let s of r){let o=a.filter(c=>s.owners.some(p=>$(p,c.ownerId))).map(c=>c.ownerId),d=o.filter(c=>e(c,s.kind));if(d.length>0){i.kept.push({name:s.name,dirty:d});continue}i.items.push({id:s.id,name:s.name,owners:[...s.owners]});for(let c of o)n.add(c)}return i.devices=a.map(s=>s.ownerId).filter(s=>n.has(s)),i}var T=(r,a)=>r.find(e=>$(e.ownerId,a))?.name??"a device";function Rt(r,a){let e=r.items.length,t=e===1?"it":"them",i=`Delete ${e} ${w(r.kind,e)} from the library?`,n=r.devices.map(d=>T(a,d)),s=r.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,o=[n.length===0?`No device has ${t}. This cannot be undone.`:`${e===1?"It comes":"They come"} off ${C(n)}, ${s}. This cannot be undone.`];for(let d of r.kept){let c=d.dirty.map(p=>T(a,p));o.push(`${d.name} stays: ${C(c)} ${c.length===1?"has":"have"} unsaved edits.`)}return{title:i,body:o.join(" ")}}async function Kt(r,a,e,t){let i={kind:a.kind,gone:[],kept:a.kept.map(s=>({...s,dirty:[...s.dirty]})),failed:[],stuck:[],taps:[]},n=new Map;for(let[s,o]of a.items.entries()){t?.(`Deleting ${o.name} (${s+1} of ${a.items.length})\u2026`);let d=await r.delete(a.kind,o.id);if(!d.ok){i.failed.push({name:o.name,text:d.text});continue}i.gone.push(o.name);for(let c of d.reply.link_failures??[]){let p=c.name??T(e,c.owner);i.stuck.includes(p)||i.stuck.push(p)}for(let c of o.owners)n.set(c,[...n.get(c)??[],o.id])}if(a.kind==="pages")for(let[s,o]of n){t?.(`Clearing complication taps on ${T(e,s)}\u2026`);let d=!1;try{d=await r.clearTaps(s,o)}catch{d=!1}d||i.taps.push(T(e,s))}return i}function Et(r){let a=n=>`${n} ${w(r.kind,n)}`,e=[];r.gone.length>0&&e.push(`Deleted ${r.gone.length===1?r.gone[0]:a(r.gone.length)}.`);let t=e.length>0,i=!1;for(let n of r.kept)i=!0,e.push(`Kept ${n.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let n of r.failed)i=!0,e.push(`Not deleted: ${n.name}. ${n.text}`);return r.stuck.length>0&&(i=!0,e.push(`Could not take ${r.gone.length===1?"it":"them"} off ${C(r.stuck)}.`)),r.taps.length>0&&(i=!0,e.push(`Could not clear the complication taps that opened ${r.gone.length===1?"it":"them"} on ${C(r.taps)}. Change those by hand.`)),!t&&!i?{kind:"ok",text:"Nothing was deleted."}:{kind:i?t?"warn":"err":"ok",text:e.join(" ")}}function Ot(r){return r==="status_pages"?"statusPages":"pages"}function Vt(r,a){return!K(a)||typeof a.id!="string"?!1:r==="status_pages"?!0:!ge(a)}function Wt(r,a,e){if("hidden"in e)return r==="status_pages"?a:De(a,e.id,e.hidden);let t=a[Ot(r)];if(!Array.isArray(t))return a;let i=[];t.forEach((l,f)=>{Vt(r,l)&&i.push(f)});let n=i.map(l=>t[l]),s=n.findIndex(l=>$(l.id,e.id));if(s<0)return a;let o=n[s],d=n.filter((l,f)=>f!==s),c=e.before===null?-1:d.findIndex(l=>$(l.id,e.before));if(e.before!==null&&c<0)return a;let p=c<0?[...d,o]:[...d.slice(0,c),o,...d.slice(c)];if(p.every((l,f)=>l===n[f]))return a;let u=t.slice();return i.forEach((l,f)=>{u[l]=p[f]}),{...a,[Ot(r)]:u}}var Ut=3;async function Ft(r,a,e,t){for(let i=1;;i++){let n;try{n=await r.read(a,e)}catch(d){let{code:c="unknown",message:p}=N(d);return{ok:!1,code:c,message:p}}let s=n.revision>0?e==="status_pages"?Le(n.document):ke(n.document):void 0;if(s===void 0)return{ok:!0,changed:!1};let o=Wt(e,s,t);if(o===s)return{ok:!0,changed:!1};try{return await r.save(a,e,n.revision,o),{ok:!0,changed:!0}}catch(d){let{code:c="unknown",message:p}=N(d);if(c!=="conflict"||i>=Ut)return{ok:!1,code:c,message:p}}}}function G(r,a){return r==="status_pages"?`${a}'s status pages have unsaved edits. Save or discard them first.`:`${a}'s pages have unsaved edits. Save or discard them first.`}async function zt(r,a,e){let t=!0,i=await oe(r,a);for(let n of i.records){if(n.deleted||!K(n.document))continue;let s=We(n.document,e);if(s!==void 0)try{await de(r,a,s,n.revision)}catch{t=!1}}return t}function Mt(r){return{delete:async(a,e)=>{try{return{ok:!0,reply:await we(r,a,e)}}catch(t){let i=$e(t),n=ye(t);return i===void 0?{ok:!1,text:n}:{ok:!1,code:i,text:n}}},clearTaps:(a,e)=>zt(r,a,e)}}function _t(r){return{read:(a,e)=>R(r,a,e),save:(a,e,t,i)=>ce(r,a,e,t,i)}}var _=200,Q=320,Bt=6,L=pe.screen;function qt(r,a,e,t=L){if(me(r))return{top:0,height:t.height};let i=Fe(Me(r,a),t),n=[...i.tiles,...Ae(r,t,{states:a})];if(n.length===0)return{top:0,height:t.height};let o=_e(r,1,i.topInset,e)!==b?0:Math.max(0,i.topInset+Math.min(...n.map(c=>c.y))-Bt),d=i.topInset+Math.max(...n.map(c=>c.y+c.height))+Bt;return{top:o,height:Math.max(1,d-o)}}var Jt=2e3,Ht={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"};function Z(r){return["watch","iphone"].filter(a=>r.some(e=>e.kind===a))}var ee=new Map;function te(r){let a=ee.get(r);if(a!==void 0)return a;let e={kind:"all"};try{let t=window.localStorage.getItem(Ht[r]),i=t?JSON.parse(t):{};typeof i.filter=="string"&&(e.filter=i.filter),(i.kind==="watch"||i.kind==="iphone")&&(e.kind=i.kind)}catch{}return ee.set(r,e),e}function At(r,a){let e={...te(r),...a};ee.set(r,e);try{window.localStorage.setItem(Ht[r],JSON.stringify(e))}catch{}}var B=(r,a="pages")=>(a==="status_pages"?mt(r)?.dirty:ft(r)?.dirty)??!1,jt=(r,a)=>`${r}|${a.toUpperCase()}`,k=class extends re{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.search="";this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new Ue(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.colorsFor=ue();this.colorOf=e=>he(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let i=Date.now();(t||i-this.hassDrawnAt>=Jt)&&(this.hassDrawnAt=i,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown)}willUpdate(e){e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged();let t=this.filterDevice();this.kind==="pages"&&t!==void 0&&!this.freeAsked.has(t.ownerId)&&this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.picksNote=void 0,this.tickNotes=new Map}get filter(){return tt(te(this.kind).filter,this.devices)}filterDevice(){let e=this.filter;return e===D?void 0:this.devices.find(t=>t.ownerId===e)}get deviceKind(){return nt(te(this.kind).kind,this.devices)}get devices(){return xe(this.owners,this.phones)}waiting(e){let t=new Map;for(let i of this.devices)t.set(i.ownerId,{held:Ke(e,i.ownerId,this.kind),free:!1});return Pe(this.owners,t)}setFilter(e){At(this.kind,{filter:e}),e!==D&&this.endSelect(!0),this.picksNote=void 0,this.requestUpdate()}setSearch(e){this.search=e,this.pruneSelected()}setDeviceKind(e){At(this.kind,{kind:e}),this.requestUpdate(),this.pruneSelected()}newPage(e){if(this.newForm=void 0,this.kind==="status_pages"){wt(e.ownerId),this.onOpen?.(e.ownerId,e.kind,"status_pages");return}gt(e.ownerId),this.onOpen?.(e.ownerId,e.kind)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!this.newForm?.busy){if(this.newForm!==void 0){this.newForm=void 0;return}this.newForm={name:this.nextCardName(),busy:!1,preview:Z(this.devices)[0]},this.updateComplete.then(()=>xt(this.renderRoot))}}nextCardName(){let e=this.lib.library,t=e===void 0?[]:E(e,this.kind).map(i=>i.item);return this.kind==="status_pages"?Ce({schemaVersion:1,statusPages:t}):Se({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let i=e.name.trim();if(i===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${w(this.kind)} a name.`}};return}let{note:n,...s}=e;this.newForm={...s,busy:!0};let o=ae(),d=this.kind==="status_pages"?{schemaVersion:1,statusPages:[Te(i,o)]}:{schemaVersion:1,pages:[Ne(o,i)]},c=await t.createItem(this.kind,d);if(!c.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${c.text}`}};return}this.newForm=void 0,vt(e.preview??Z(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,c.reply.id)}open(e,t){let i=t??M(e,this.filter,this.deviceKind,this.devices);if(i===void 0){this.onOpenLibrary?.(e.kind,e.id);return}if(e.kind==="status_pages"){bt(i.ownerId,e.id),this.onOpen?.(i.ownerId,i.kind,"status_pages");return}kt(i.ownerId,{pageId:e.id}),this.onOpen?.(i.ownerId,i.kind)}async tick(e,t,i){let n=this.lib.store;if(n===void 0)return;let s=y(e);if(this.tickNotes.has(s)){let l=new Map(this.tickNotes);l.delete(s),this.tickNotes=l}if(!(await Je(this.hassNow,n,t,e.kind,e.id,i)).ok||!i||e.kind!=="pages")return;let d=await this.readFree(t),c=this.lib.library,p=this.devices.find(l=>l.ownerId===t)?.name;if(!d||c===void 0||p===void 0||V(c,t,"pages")<2)return;let u=j([p]);u!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(s,`Added to ${p}. ${u}`))}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let n=(await R(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==n&&(this.freeFacts=new Map(this.freeFacts).set(e,n)),n}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,i){let n=this.hassNow,s=this.lib.store;if(n===void 0||s===void 0||this.picksBusy)return;let o=this.kind;if(B(e.ownerId,o)){this.picksNote={kind:"warn",text:G(o,e.name)};return}let d=this.kindSeq,c="hidden"in t,p=jt(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,c?this.hiddenAsked=new Map(this.hiddenAsked).set(p,t.hidden):i!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:o,ids:dt(i,t.id,t.before)});let u=this.orderAsked,l;try{let f=await Ft(_t(n),e.ownerId,o,t);f.ok||(l={kind:"err",text:`${c?"Not changed":"Not moved"} on ${e.name}: ${f.message.replace(/\.$/,"")}.`})}catch(f){l={kind:"err",text:N(f).message}}if(await s.refresh(),this.picksBusy=!1,c){let f=new Map(this.hiddenAsked);f.delete(p),this.hiddenAsked=f}else this.orderAsked===u&&(this.orderAsked=void 0);d===this.kindSeq&&(this.picksNote=l)}shownNow(){let e=this.lib.library;return e===void 0?[]:F(e,this.kind,this.search,this.deviceKind,this.devices)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(y(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=Tt(this.selected,this.shownNow().map(y)))}startSelect(){this.selecting=!0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let i=y(e);this.selected=t?Dt(this.selected,this.shownNow().map(y),this.anchor,i):Nt(this.selected,i),this.anchor=i,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(y);this.selected=e?Lt(this.selected,t):Ct(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}async runDelete(){let e=this.hassNow,t=this.lib.store;if(e===void 0||t===void 0||this.bulkBusy!==void 0)return;let i=this.pickedItems();if(i.length===0)return;let n=this.kindSeq,s=this.devices;this.asking=!1,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let o;try{let d=await Kt(Mt(e),X(i,s,B),s,c=>{this.bulkBusy=c});o=Et(d)}catch(d){o={kind:"err",text:N(d).message}}this.bulkBusy="Reading the library again\u2026";try{await t.refresh()}finally{this.bulkBusy=void 0}n===this.kindSeq&&(this.pruneSelected(),this.anchor=void 0,this.bulkNote=o)}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return h`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let t=this.kind,i=this.lib.library,n=this.lib.readState,s=this.filterDevice(),o=w(t,2),d=e.length>1,c=this.filter,p=i===void 0?n==="unsupported"?ve:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${o}\u2026`:Ge(E(i,t).length,t),u=i!==void 0&&n==="failed";return h`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${Xe(t)}</h1>
          <p class="ap-lead">${p}</p>
        </div>
        ${e.length===0?b:this.renderNew(s,e)}
      </div>
      ${this.newForm===void 0?b:this.renderNewDialog(this.newForm,e)}
      ${u?h`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:b}
      <div class="pk-surface pk-page" role="region" aria-label=${`Your ${o}`}>
        <div class="pk-pin">
          ${this.renderHead(i,s,e)}
          ${d?this.renderTabs(e,i,c):b}
          ${this.selecting&&s===void 0?this.renderBar(e):b}
        </div>
        <div class="pk-body" role=${d?"tabpanel":b} aria-labelledby=${d?`ap-tab-${c}`:b}>
          ${i===void 0?h`<p class="ap-empty">${p}</p>`:s===void 0?this.renderAll(i,e):this.renderDevice(i,rt(i,s,t,this.search),e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${Ze(t,s,this.selecting&&s===void 0)}</span></div>
      </div>
    </div></div>`}renderAll(e,t){if(t.length>0&&E(e,this.kind).length===0){let s=this.mayMake;return h`<div class="ap-empty-lib">
        <p>${Qe(this.kind,s)}</p>
        ${s?h`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
          ${I("plus")}<span>New ${w(this.kind)}</span></button>`:b}
      </div>`}let i=F(e,this.kind,this.search,this.deviceKind,t);if(i.length===0)return h`<p class="ap-empty">${ut(t,this.search,this.deviceKind,this.kind)}</p>`;let n=this.waiting(e);return h`<div class="ap-grid" role="list">${i.map(s=>this.renderCard(e,s,t,n))}</div>`}renderHead(e,t,i){let n=this.selecting,s=this.bulkBusy!==void 0,o=w(this.kind,2);return h`<div class="pk-head">
      ${t===void 0?h`<button type="button" class="pk-pick-btn ${n?"on":""}" aria-pressed=${n?"true":"false"}
        title=${n?`Back to opening one ${w(this.kind)} at a time`:`Pick several ${o} to delete together`}
        ?disabled=${s||e===void 0} @click=${()=>n?this.endSelect():this.startSelect()}>
        ${I("checklist")}<span>Multi select</span></button>`:b}
      ${t===void 0&&e!==void 0&&it(i)?this.renderKinds(e,i):b}
      <label class="pk-search">
        ${I("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${o}`}
          @input=${d=>this.setSearch(d.target.value)} />
      </label>
    </div>`}renderNew(e,t){let i=`New ${w(this.kind)}`;if(e!==void 0)return h`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${O(this.kind)} on ${e.name}`}
          @click=${()=>this.newPage(e)}>
          ${I("plus")}<span>${i}</span></button>
      </div>`;let n=this.mayMake,s=this.newForm!==void 0;return h`<div class="ap-new">
      <button type="button" class="ap-new-btn ${s?"on":""}" aria-expanded=${s?"true":"false"}
        ?disabled=${!n||this.newForm?.busy===!0}
        title=${n?`Make ${O(this.kind)} no device has yet`:Ye(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${I("plus")}<span>${i}</span></button>
    </div>`}renderNewDialog(e,t){return $t(this.kind,e,Z(t),{onName:i=>{this.newForm={...e,name:i}},onPreview:i=>{this.newForm={...e,preview:i}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}})}renderKinds(e,t){let i=this.deviceKind,n=st(F(e,this.kind,this.search,"all",t),t);return h`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label=${`Show the ${w(this.kind,2)} on one kind of device`} .value=${i}
        @change=${s=>this.setDeviceKind(s.target.value)}>
        ${n.map(s=>h`<option value=${s.key} ?selected=${s.key===i}>${s.label} (${s.count})</option>`)}
      </select>
    </label>`}renderTabs(e,t,i){return h`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${et(e,t,this.kind,this.colorOf).map(n=>h`<button type="button" role="tab" class="pk-tab ${n.id===i?"on":""}"
        style=${n.color===void 0?b:`--dc:${n.color}`} id=${`ap-tab-${n.id}`} aria-selected=${n.id===i?"true":"false"}
        title=${n.id===D?`Every ${w(this.kind)} in your home`:`The ${w(this.kind,2)} on ${n.label}`}
        @click=${()=>this.setFilter(n.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${I(n.kind===void 0?"grid":n.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${n.label}</span>
        <span class="pk-tab-count">${n.count}</span>
      </button>`)}
    </div>`}renderCardTicks(e,t,i,n,s){let o=this.lib.store,d=y(t),c=o?.noteFor(t.kind,t.id)??this.tickNotes.get(d),p=this.hassNow?.user?.is_admin,u=t.kind==="pages"?Oe(t.item):[];return ze({library:e,kind:t.kind,itemId:t.id,devices:i,colorOf:this.colorOf,skips:u,...o===void 0?{}:{pending:o.pending},...c===void 0?{}:{note:c},...p===void 0?{}:{admin:p},...s===void 0?{}:{addFor:s},locked:l=>{let f=Re(e,l,t.kind,t.id);if(f&&B(l,t.kind))return G(t.kind,i.find(P=>P.ownerId===l)?.name??"This device");if(!f&&n.has(l))return Ie}},(l,f)=>{this.tick(t,l,f)})}renderCard(e,t,i,n){let s=this.selecting,o=y(t),d=s&&this.selected.has(o),c=M(t,D,this.deviceKind,i),p=s?`${d?"Let":"Pick"} ${t.name}${d?" go":""}`:c===void 0?U(t.name):`Edit ${t.name} on ${c.name}`,u=l=>this.cardClick(l,t);return h`<div class="ap-card ${s?"picking":""} ${d?"picked":""}" role="listitem" data-card=${o}
      @click=${l=>{s&&u(l)}}>
      <div class="ap-top">
        ${s?h`<input type="checkbox" class="pk-card-pick" .checked=${le(d)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${p}
          @click=${l=>{l.stopPropagation(),this.pick(t,l.shiftKey)}} />`:b}
        <button type="button" class="ap-open" title=${p} tabindex=${s?"-1":"0"} @click=${u}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${W(t)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${p} @click=${u}>
        ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumb(e,t,c)}
      </button>
      ${this.renderCardTicks(e,t,i,n)}
    </div>`}renderDevice(e,t,i){let{device:n}=t,s=this.orderAsked,o=s!==void 0&&s.ownerId===n.ownerId&&s.kind===this.kind?s.ids:void 0,d=at(t.picks,o),c=d.map(x=>x.id),p=V(e,n.ownerId,this.kind),u=this.search.trim()===""&&!this.picksBusy,l=this.kind==="pages"&&this.freeFacts.get(n.ownerId)===!0&&p>1?j([n.name]):void 0,f=this.waiting(e),P=this.kind==="pages"?A(H(e,n.ownerId)):void 0;return h`<div class="lt-view">
      <div class="lt-sect"><span>${z(n)} <small>${p}</small></span><span class="lt-sect-r">${ct(n)}</span></div>
      ${this.picksNote===void 0?b:h`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${d.length===0?h`<div class="lt-list"><p class="lt-empty">${ht(n,this.kind,this.search,t.rest.length,this.mayMake)}</p></div>`:h`<div class="lt-list" role="list" aria-label=${z(n)}>${d.map((x,m)=>this.renderRow(x,m,c,n,i,u,P))}</div>`}
      ${l===void 0?b:h`<p class="lt-line">${l}</p>`}
      <div class="lt-sect"><span>${lt(n)} <small>${t.rest.length}</small></span><span class="lt-sect-r">${pt(w(this.kind,2))}</span></div>
      ${t.rest.length===0?h`<p class="lt-line">${this.search.trim()===""?`Every ${w(this.kind)} in your library is on ${n.name}.`:`No other ${w(this.kind)} has that name.`}</p>`:h`<div class="ap-grid" role="list">${t.rest.map(x=>this.renderRest(e,x,n,i,f))}</div>`}
    </div>`}renderRow(e,t,i,n,s,o,d){let c=jt(n.ownerId,e.id),p=this.hiddenAsked.get(c)??e.hidden,u=this.kind==="status_pages",l=Ee({...e,hidden:p},n.ownerId,s),f=this.overId!==void 0&&$(this.overId,e.id)&&this.dragId!==void 0&&!$(this.dragId,e.id),P=f&&i.findIndex(m=>$(m,this.dragId))<t,x=m=>{m!==void 0&&this.changePicks(n,{id:e.id,before:m},[...i])};return h`<div class="lt-row ${p?"hid":""} ${f?"drag-over":""} ${P?"below":""} ${this.dragId!==void 0&&$(this.dragId,e.id)?"dragging":""}"
      role="listitem" data-id=${e.id} draggable=${o?"true":"false"} tabindex="-1"
      @dragstart=${m=>{o&&(this.dragId=e.id,m.dataTransfer?.setData("text/plain",e.id),m.dataTransfer&&(m.dataTransfer.effectAllowed="move"))}}
      @dragover=${m=>{this.dragId!==void 0&&(m.preventDefault(),this.overId!==e.id&&(this.overId=e.id))}}
      @drop=${m=>{m.preventDefault();let ie=this.dragId;this.dragId=void 0,this.overId=void 0;let ne=ie===void 0?void 0:ot(i,ie,e.id);ne!==void 0&&this.changePicks(n,ne,[...i])}}
      @dragend=${()=>{this.dragId=void 0,this.overId=void 0}}
      @keydown=${m=>{!m.altKey||!o||m.key!=="ArrowUp"&&m.key!=="ArrowDown"||(m.preventDefault(),m.key==="ArrowUp"?x(t>0?i[t-1]:void 0):x(t<i.length-1?i[t+2]??null:void 0))}}>
      <span class="lt-grip" aria-hidden="true" title=${o?"Drag to order":""}>${I("grip")}</span>
      <button type="button" class="lt-row-open" title=${`Edit ${e.entry.name} on ${n.name}. Alt+Up or Alt+Down moves it.`}
        @click=${()=>this.open(e.entry,n)}>
        ${u?Y({page:e.entry.item,hass:this.hassNow,...this.icons===void 0?{}:{icons:this.icons},tick:this.iconsTick}):J({page:e.entry.item,iphone:n.kind==="iphone",tick:this.iconsTick,...d===void 0?{}:{pages:d},...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}})}
        <span class="lt-row-nm"><span class="lt-row-n">${e.entry.name}</span><span class="lt-row-m">${l}</span></span>
      </button>
      ${u?b:h`<button type="button" class="lt-eye" ?disabled=${this.picksBusy}
        title=${p?`Show ${e.entry.name} on ${n.name} again`:`Keep ${e.entry.name} on ${n.name} without showing it`}
        @click=${()=>{this.changePicks(n,{id:e.id,hidden:!p})}}>${p?"Show here":"Hide here"}</button>`}
    </div>`}renderRest(e,t,i,n,s){let o=M(t,D,"all",n),d=o===void 0?U(t.name):`Edit ${t.name} on ${o.name}`,c=t.kind==="status_pages"?Y({page:t.item,hass:this.hassNow,width:q,tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}}):J({page:t.item,width:q,tick:this.iconsTick,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}});return h`<div class="ap-card lt-dim" role="listitem" data-card=${y(t)}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${d} @click=${()=>this.open(t)}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${W(t)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb lt-thumb-sm" tabindex="-1" aria-hidden="true" title=${d} @click=${()=>this.open(t)}>${c}</button>
      ${this.renderCardTicks(e,t,n,s,i.ownerId)}
    </div>`}renderBar(e){let t=this.shownNow(),i=t.filter(l=>this.selected.has(y(l))),n=i.length,s=this.bulkBusy!==void 0,o=n===0,d=t.length>0&&t.every(l=>this.selected.has(y(l))),c=s?void 0:this.bulkNote,p=w(this.kind),u=w(this.kind,2);return h`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${u}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(o?`Pick ${O(this.kind)} to start.`:`${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${s||t.length===0}
        title=${d?`Let the ${u} on screen go`:`Pick every ${p} the search and the Device menu have left`}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${c===void 0?b:h`<span class="pk-bar-said ${c.kind}">${c.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!o?this.renderDeleteAsk(i,e):h`<button type="button" class="ghost danger small" ?disabled=${s||o}
            title=${`Delete these ${u} from the library, and from every device they are on`}
            @click=${()=>this.toggleAsk()}>${I("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${s}
        title=${`Stop picking and go back to opening one ${p} at a time`}
        @click=${()=>this.endSelect()}>${I("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let i=X(e,t,B),n=Rt(i,t);return h`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${i.items.length===0}
        @click=${()=>{this.runDelete()}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,i){let n=t.item,s=i===void 0?[]:A(H(e,i.ownerId)),o=s.length===0?[n]:s,d=this.hassNow?.states,c=this.icons,p=_/L.width,u=qt(n,d,c),l=u.height*p,f=l>Q,P=x=>`${Math.round(x*100)/100}px`;return h`<span class="ap-pic ${f?"cut":""}" style=${`width:${P(_)};height:${P(Math.min(l,Q))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${P(-u.top*p)})`}>${Be({page:n,pages:o,screen:L,scale:p,...d===void 0?{}:{states:d},...c===void 0?{}:{icons:c}})}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,i=_/L.width,n=d=>`${Math.round(d*100)/100}px`,o=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return h`<span class="ap-pic ap-pic-status ${o?"cut":""}" style=${`width:${n(_)};height:${n(Math.min(L.height*i,Q))}`}>
      <span class="ap-pic-in">${t===void 0?b:He({page:e.item,hass:t,icons:this.icons??fe,screen:L,scale:i})}</span>
    </span>`}static{this.styles=[je,be,Ve,St,Pt,qe,yt,It,se`
    /* New page: filled, as New complication is, the one way to start a page
       from this tab. On All it opens the New dialog (new-dialog.ts). */
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
    /* An empty library: how a page works, centered, with New page. */
    .ap-empty-lib { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px 16px; text-align: center; }
    .ap-empty-lib p { margin: 0; max-width: 40ch; font-size: 14px; line-height: 1.45; color: var(--wa-muted); }

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
  `]}};g([S({attribute:!1})],k.prototype,"kind",2),g([S({attribute:!1})],k.prototype,"owners",2),g([S({attribute:!1})],k.prototype,"ownersReady",2),g([S({attribute:!1})],k.prototype,"phones",2),g([S({attribute:!1})],k.prototype,"icons",2),g([S({attribute:!1})],k.prototype,"iconsTick",2),g([S({attribute:!1})],k.prototype,"onOpen",2),g([S({attribute:!1})],k.prototype,"onOpenLibrary",2),g([v()],k.prototype,"search",2),g([v()],k.prototype,"newForm",2),g([v()],k.prototype,"selecting",2),g([v()],k.prototype,"selected",2),g([v()],k.prototype,"asking",2),g([v()],k.prototype,"bulkBusy",2),g([v()],k.prototype,"bulkNote",2),g([v()],k.prototype,"tickNotes",2),g([v()],k.prototype,"picksBusy",2),g([v()],k.prototype,"picksNote",2),g([v()],k.prototype,"orderAsked",2),g([v()],k.prototype,"hiddenAsked",2),g([v()],k.prototype,"dragId",2),g([v()],k.prototype,"overId",2),g([v()],k.prototype,"freeFacts",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",k);export{k as WaAllPages,qt as pageCrop};
