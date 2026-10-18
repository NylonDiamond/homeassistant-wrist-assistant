import{A as mt,B as bt,C as wt,D as vt,E as yt,F as $t,G as xt,a as tt,b as it,c as nt,d as v,e as E,f as st,g as rt,h as at,i as ot,j as z,k as N,l as dt,m as ct,n as lt,o as pt,q as ht,s as O,t as ut,u as ft,v as kt,w as gt,x as F,y as J,z as Y}from"./chunk-LTFTCPYU.js";import{b as ze,d as Je,e as Ye}from"./chunk-H456RES3.js";import{b as Xe,h as Ge,j as Qe}from"./chunk-YP4K26TY.js";import{d as He,i as qe}from"./chunk-3PMKDXAB.js";import{m as Ae,p as je,r as W,s as U,t as q,v as et}from"./chunk-RJXK5EQZ.js";import{Ba as Ue,E as Ce,F as Te,Ja as Ze,c as we,d as ve,e as ye,f as $e,ga as $,ia as j,na as Re,oa as Ke,s as Le,ua as H,va as V,xa as Ee,ya as Ve,za as We}from"./chunk-SJKXSITF.js";import"./chunk-XUVJULIU.js";import{g as Oe,h as Fe,p as _e,t as Me,z as Be}from"./chunk-5P4DU5DJ.js";import"./chunk-HSDL7EWS.js";import{a as xe,c as C,f as Ie,g as Pe,h as A}from"./chunk-TE5Q2R5V.js";import"./chunk-NRWCRSBY.js";import"./chunk-ZOJGMATP.js";import"./chunk-SNDQHZ2N.js";import{g as Se,h as De,m as Ne}from"./chunk-KEZSSOQI.js";import{b as he,c as ue,e as be}from"./chunk-J2AAPGUH.js";import{c as fe}from"./chunk-GR4P77YP.js";import{X as pe,z as le}from"./chunk-FZEJHA6E.js";import{j as K,k as ke,l as B,q as ge,r as me}from"./chunk-AM6RHXOL.js";import{Eg as R,Ge as ae,Gg as ce,b as se,d as h,g as b,j as re,jg as oe,k as I,l as w,nh as P,qg as de}from"./chunk-6CGEEXV6.js";import{Va as D}from"./chunk-PPFKQRTD.js";import{a as g}from"./chunk-LO2NM3CE.js";function It(r,a){let e=new Set(r);return e.has(a)?e.delete(a):e.add(a),e}function Pt(r,a,e,t){let i=new Set(r),n=a.indexOf(t),s=e===void 0?-1:a.indexOf(e);if(n<0)return i;if(s<0)return i.add(t),i;for(let d=Math.min(s,n);d<=Math.max(s,n);d++)i.add(a[d]);return i}function St(r,a){return new Set([...r,...a])}function Dt(r,a){let e=new Set(a);return new Set([...r].filter(t=>!e.has(t)))}function Nt(r,a){let e=new Set(a);return new Set([...r].filter(t=>e.has(t)))}function y(r){return r.id.toUpperCase()}function X(r,a,e){let i={kind:r[0]?.kind??"pages",items:[],kept:[],devices:[]},n=new Set;for(let s of r){let d=a.filter(c=>s.owners.some(l=>$(l,c.ownerId))).map(c=>c.ownerId),o=d.filter(c=>e(c,s.kind));if(o.length>0){i.kept.push({name:s.name,dirty:o});continue}i.items.push({id:s.id,name:s.name,owners:[...s.owners]});for(let c of d)n.add(c)}return i.devices=a.map(s=>s.ownerId).filter(s=>n.has(s)),i}var T=(r,a)=>r.find(e=>$(e.ownerId,a))?.name??"a device";function Lt(r,a){let e=r.items.length,t=e===1?"it":"them",i=`Delete ${e} ${v(r.kind,e)} from the library?`,n=r.devices.map(o=>T(a,o)),s=r.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,d=[n.length===0?`No device has ${t}. This cannot be undone.`:`${e===1?"It comes":"They come"} off ${C(n)}, ${s}. This cannot be undone.`];for(let o of r.kept){let c=o.dirty.map(l=>T(a,l));d.push(`${o.name} stays: ${C(c)} ${c.length===1?"has":"have"} unsaved edits.`)}return{title:i,body:d.join(" ")}}async function Ct(r,a,e,t){let i={kind:a.kind,gone:[],kept:a.kept.map(s=>({...s,dirty:[...s.dirty]})),failed:[],stuck:[],taps:[]},n=new Map;for(let[s,d]of a.items.entries()){t?.(`Deleting ${d.name} (${s+1} of ${a.items.length})\u2026`);let o=await r.delete(a.kind,d.id);if(!o.ok){i.failed.push({name:d.name,text:o.text});continue}i.gone.push(d.name);for(let c of o.reply.link_failures??[]){let l=c.name??T(e,c.owner);i.stuck.includes(l)||i.stuck.push(l)}for(let c of d.owners)n.set(c,[...n.get(c)??[],d.id])}if(a.kind==="pages")for(let[s,d]of n){t?.(`Clearing complication taps on ${T(e,s)}\u2026`);let o=!1;try{o=await r.clearTaps(s,d)}catch{o=!1}o||i.taps.push(T(e,s))}return i}function Tt(r){let a=n=>`${n} ${v(r.kind,n)}`,e=[];r.gone.length>0&&e.push(`Deleted ${r.gone.length===1?r.gone[0]:a(r.gone.length)}.`);let t=e.length>0,i=!1;for(let n of r.kept)i=!0,e.push(`Kept ${n.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let n of r.failed)i=!0,e.push(`Not deleted: ${n.name}. ${n.text}`);return r.stuck.length>0&&(i=!0,e.push(`Could not take ${r.gone.length===1?"it":"them"} off ${C(r.stuck)}.`)),r.taps.length>0&&(i=!0,e.push(`Could not clear the complication taps that opened ${r.gone.length===1?"it":"them"} on ${C(r.taps)}. Change those by hand.`)),!t&&!i?{kind:"ok",text:"Nothing was deleted."}:{kind:i?t?"warn":"err":"ok",text:e.join(" ")}}function Rt(r){return r==="status_pages"?"statusPages":"pages"}function At(r,a){return!K(a)||typeof a.id!="string"?!1:r==="status_pages"?!0:!ge(a)}function jt(r,a,e){if("hidden"in e)return r==="status_pages"?a:Ne(a,e.id,e.hidden);let t=a[Rt(r)];if(!Array.isArray(t))return a;let i=[];t.forEach((p,k)=>{At(r,p)&&i.push(k)});let n=i.map(p=>t[p]),s=n.findIndex(p=>$(p.id,e.id));if(s<0)return a;let d=n[s],o=n.filter((p,k)=>k!==s),c=e.before===null?-1:o.findIndex(p=>$(p.id,e.before));if(e.before!==null&&c<0)return a;let l=c<0?[...o,d]:[...o.slice(0,c),d,...o.slice(c)];if(l.every((p,k)=>p===n[k]))return a;let u=t.slice();return i.forEach((p,k)=>{u[p]=l[k]}),{...a,[Rt(r)]:u}}var Ht=3;async function Kt(r,a,e,t){for(let i=1;;i++){let n;try{n=await r.read(a,e)}catch(o){let{code:c="unknown",message:l}=D(o);return{ok:!1,code:c,message:l}}let s=n.revision>0?e==="status_pages"?Le(n.document):ke(n.document):void 0;if(s===void 0)return{ok:!0,changed:!1};let d=jt(e,s,t);if(d===s)return{ok:!0,changed:!1};try{return await r.save(a,e,n.revision,d),{ok:!0,changed:!0}}catch(o){let{code:c="unknown",message:l}=D(o);if(c!=="conflict"||i>=Ht)return{ok:!1,code:c,message:l}}}}function G(r,a){return r==="status_pages"?`${a}'s status pages have unsaved edits. Save or discard them first.`:`${a}'s pages have unsaved edits. Save or discard them first.`}async function Vt(r,a,e){let t=!0,i=await oe(r,a);for(let n of i.records){if(n.deleted||!K(n.document))continue;let s=He(n.document,e);if(s!==void 0)try{await de(r,a,s,n.revision)}catch{t=!1}}return t}function Et(r){return{delete:async(a,e)=>{try{return{ok:!0,reply:await we(r,a,e)}}catch(t){let i=$e(t),n=ye(t);return i===void 0?{ok:!1,text:n}:{ok:!1,code:i,text:n}}},clearTaps:(a,e)=>Vt(r,a,e)}}function Ot(r){return{read:(a,e)=>R(r,a,e),save:(a,e,t,i)=>ce(r,a,e,t,i)}}var _=200,Q=320,Ft=6,L=pe.screen;function Wt(r,a,e,t=L){if(me(r))return{top:0,height:t.height};let i=Oe(Fe(r,a),t);if(i.tiles.length===0)return{top:0,height:t.height};let s=_e(r,1,i.topInset,e)!==b?0:Math.max(0,i.topInset+Math.min(...i.tiles.map(o=>o.y))-Ft),d=i.topInset+Math.max(...i.tiles.map(o=>o.y+o.height))+Ft;return{top:s,height:Math.max(1,d-s)}}var Ut=2e3,Bt={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"};function Z(r){return["watch","iphone"].filter(a=>r.some(e=>e.kind===a))}var ee=new Map;function te(r){let a=ee.get(r);if(a!==void 0)return a;let e={kind:"all"};try{let t=window.localStorage.getItem(Bt[r]),i=t?JSON.parse(t):{};typeof i.filter=="string"&&(e.filter=i.filter),(i.kind==="watch"||i.kind==="iphone")&&(e.kind=i.kind)}catch{}return ee.set(r,e),e}function _t(r,a){let e={...te(r),...a};ee.set(r,e);try{window.localStorage.setItem(Bt[r],JSON.stringify(e))}catch{}}var M=(r,a="pages")=>(a==="status_pages"?Xe(r)?.dirty:ze(r)?.dirty)??!1,Mt=(r,a)=>`${r}|${a.toUpperCase()}`,f=class extends re{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.search="";this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new Ve(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.colorsFor=ue();this.colorOf=e=>he(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let i=Date.now();(t||i-this.hassDrawnAt>=Ut)&&(this.hassDrawnAt=i,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown)}willUpdate(e){e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged();let t=this.filterDevice();this.kind==="pages"&&t!==void 0&&!this.freeAsked.has(t.ownerId)&&this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.picksNote=void 0,this.tickNotes=new Map}get filter(){return ct(te(this.kind).filter,this.devices)}filterDevice(){let e=this.filter;return e===N?void 0:this.devices.find(t=>t.ownerId===e)}get deviceKind(){return pt(te(this.kind).kind,this.devices)}get devices(){return xe(this.owners,this.phones)}waiting(e){let t=new Map;for(let i of this.devices)t.set(i.ownerId,{held:Ke(e,i.ownerId,this.kind),free:!1});return Pe(this.owners,t)}setFilter(e){_t(this.kind,{filter:e}),e!==N&&this.endSelect(!0),this.picksNote=void 0,this.requestUpdate()}setSearch(e){this.search=e,this.pruneSelected()}setDeviceKind(e){_t(this.kind,{kind:e}),this.requestUpdate(),this.pruneSelected()}newPage(e){if(this.newForm=void 0,this.kind==="status_pages"){Qe(e.ownerId),this.onOpen?.(e.ownerId,e.kind,"status_pages");return}Ye(e.ownerId),this.onOpen?.(e.ownerId,e.kind)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!this.newForm?.busy){if(this.newForm!==void 0){this.newForm=void 0;return}this.newForm={name:this.nextCardName(),busy:!1,preview:Z(this.devices)[0]},this.updateComplete.then(()=>it(this.renderRoot))}}nextCardName(){let e=this.lib.library,t=e===void 0?[]:j(e,this.kind).map(i=>i.item);return this.kind==="status_pages"?Ce({schemaVersion:1,statusPages:t}):Se({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let i=e.name.trim();if(i===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${v(this.kind)} a name.`}};return}let{note:n,...s}=e;this.newForm={...s,busy:!0};let d=ae(),o=this.kind==="status_pages"?{schemaVersion:1,statusPages:[Te(i,d)]}:{schemaVersion:1,pages:[De(d,i)]},c=await t.createItem(this.kind,o);if(!c.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${c.text}`}};return}this.newForm=void 0,Ze(e.preview??Z(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,c.reply.id)}open(e,t){let i=t??F(e,this.filter,this.deviceKind,this.devices);if(i===void 0){this.onOpenLibrary?.(e.kind,e.id);return}if(e.kind==="status_pages"){Ge(i.ownerId,e.id),this.onOpen?.(i.ownerId,i.kind,"status_pages");return}Je(i.ownerId,{pageId:e.id}),this.onOpen?.(i.ownerId,i.kind)}async tick(e,t,i){let n=this.lib.store;if(n===void 0)return;let s=y(e);if(this.tickNotes.has(s)){let p=new Map(this.tickNotes);p.delete(s),this.tickNotes=p}if(!(await qe(this.hassNow,n,t,e.kind,e.id,i)).ok||!i||e.kind!=="pages")return;let o=await this.readFree(t),c=this.lib.library,l=this.devices.find(p=>p.ownerId===t)?.name;if(!o||c===void 0||l===void 0||V(c,t,"pages")<2)return;let u=A([l]);u!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(s,`Added to ${l}. ${u}`))}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let n=(await R(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==n&&(this.freeFacts=new Map(this.freeFacts).set(e,n)),n}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,i){let n=this.hassNow,s=this.lib.store;if(n===void 0||s===void 0||this.picksBusy)return;let d=this.kind;if(M(e.ownerId,d)){this.picksNote={kind:"warn",text:G(d,e.name)};return}let o=this.kindSeq,c="hidden"in t,l=Mt(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,c?this.hiddenAsked=new Map(this.hiddenAsked).set(l,t.hidden):i!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:d,ids:gt(i,t.id,t.before)});let u=this.orderAsked,p;try{let k=await Kt(Ot(n),e.ownerId,d,t);k.ok||(p={kind:"err",text:`${c?"Not changed":"Not moved"} on ${e.name}: ${k.message.replace(/\.$/,"")}.`})}catch(k){p={kind:"err",text:D(k).message}}if(await s.refresh(),this.picksBusy=!1,c){let k=new Map(this.hiddenAsked);k.delete(l),this.hiddenAsked=k}else this.orderAsked===u&&(this.orderAsked=void 0);o===this.kindSeq&&(this.picksNote=p)}shownNow(){let e=this.lib.library;return e===void 0?[]:O(e,this.kind,this.search,this.deviceKind,this.devices)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(y(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=Nt(this.selected,this.shownNow().map(y)))}startSelect(){this.selecting=!0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let i=y(e);this.selected=t?Pt(this.selected,this.shownNow().map(y),this.anchor,i):It(this.selected,i),this.anchor=i,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(y);this.selected=e?St(this.selected,t):Dt(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}async runDelete(){let e=this.hassNow,t=this.lib.store;if(e===void 0||t===void 0||this.bulkBusy!==void 0)return;let i=this.pickedItems();if(i.length===0)return;let n=this.kindSeq,s=this.devices;this.asking=!1,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let d;try{let o=await Ct(Et(e),X(i,s,M),s,c=>{this.bulkBusy=c});d=Tt(o)}catch(o){d={kind:"err",text:D(o).message}}this.bulkBusy="Reading the library again\u2026";try{await t.refresh()}finally{this.bulkBusy=void 0}n===this.kindSeq&&(this.pruneSelected(),this.anchor=void 0,this.bulkNote=d)}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return h`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let t=this.kind,i=this.lib.library,n=this.lib.readState,s=this.filterDevice(),d=v(t,2),o=e.length>1,c=this.filter,l=i===void 0?n==="unsupported"?ve:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${d}\u2026`:at(j(i,t).length,t),u=i!==void 0&&n==="failed";return h`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${rt(t)}</h1>
          <p class="ap-lead">${l}</p>
        </div>
        ${e.length===0?b:this.renderNew(s,e)}
      </div>
      ${this.newForm===void 0?b:this.renderNewDialog(this.newForm,e)}
      ${u?h`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:b}
      <div class="pk-surface pk-page" role="region" aria-label=${`Your ${d}`}>
        <div class="pk-pin">
          ${this.renderHead(i,s,e)}
          ${o?this.renderTabs(e,i,c):b}
          ${this.selecting&&s===void 0?this.renderBar(e):b}
        </div>
        <div class="pk-body" role=${o?"tabpanel":b} aria-labelledby=${o?`ap-tab-${c}`:b}>
          ${i===void 0?h`<p class="ap-empty">${l}</p>`:s===void 0?this.renderAll(i,e):this.renderDevice(i,ut(i,s,t,this.search),e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${ot(t,s,this.selecting&&s===void 0)}</span></div>
      </div>
    </div></div>`}renderAll(e,t){let i=O(e,this.kind,this.search,this.deviceKind,t);if(i.length===0)return h`<p class="ap-empty">${yt(t,this.search,this.deviceKind,this.kind)}</p>`;let n=this.waiting(e);return h`<div class="ap-grid" role="list">${i.map(s=>this.renderCard(e,s,t,n))}</div>`}renderHead(e,t,i){let n=this.selecting,s=this.bulkBusy!==void 0,d=v(this.kind,2);return h`<div class="pk-head">
      ${t===void 0?h`<button type="button" class="pk-pick-btn ${n?"on":""}" aria-pressed=${n?"true":"false"}
        title=${n?`Back to opening one ${v(this.kind)} at a time`:`Pick several ${d} to delete together`}
        ?disabled=${s||e===void 0} @click=${()=>n?this.endSelect():this.startSelect()}>
        ${P("checklist")}<span>Multi select</span></button>`:b}
      ${t===void 0&&e!==void 0&&lt(i)?this.renderKinds(e,i):b}
      <label class="pk-search">
        ${P("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${d}`}
          @input=${o=>this.setSearch(o.target.value)} />
      </label>
    </div>`}renderNew(e,t){let i=`New ${v(this.kind)}`;if(e!==void 0)return h`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${E(this.kind)} on ${e.name}`}
          @click=${()=>this.newPage(e)}>
          ${P("plus")}<span>${i}</span></button>
      </div>`;let n=this.mayMake,s=this.newForm!==void 0;return h`<div class="ap-new">
      <button type="button" class="ap-new-btn ${s?"on":""}" aria-expanded=${s?"true":"false"}
        ?disabled=${!n||this.newForm?.busy===!0}
        title=${n?`Make ${E(this.kind)} no device has yet`:st(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${P("plus")}<span>${i}</span></button>
    </div>`}renderNewDialog(e,t){return tt(this.kind,e,Z(t),{onName:i=>{this.newForm={...e,name:i}},onPreview:i=>{this.newForm={...e,preview:i}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}})}renderKinds(e,t){let i=this.deviceKind,n=ht(O(e,this.kind,this.search,"all",t),t);return h`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label=${`Show the ${v(this.kind,2)} on one kind of device`} .value=${i}
        @change=${s=>this.setDeviceKind(s.target.value)}>
        ${n.map(s=>h`<option value=${s.key} ?selected=${s.key===i}>${s.label} (${s.count})</option>`)}
      </select>
    </label>`}renderTabs(e,t,i){return h`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${dt(e,t,this.kind,this.colorOf).map(n=>h`<button type="button" role="tab" class="pk-tab ${n.id===i?"on":""}"
        style=${n.color===void 0?b:`--dc:${n.color}`} id=${`ap-tab-${n.id}`} aria-selected=${n.id===i?"true":"false"}
        title=${n.id===N?`Every ${v(this.kind)} in your home`:`The ${v(this.kind,2)} on ${n.label}`}
        @click=${()=>this.setFilter(n.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${P(n.kind===void 0?"grid":n.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${n.label}</span>
        <span class="pk-tab-count">${n.count}</span>
      </button>`)}
    </div>`}renderCardTicks(e,t,i,n,s){let d=this.lib.store,o=y(t),c=d?.noteFor(t.kind,t.id)??this.tickNotes.get(o),l=this.hassNow?.user?.is_admin;return We({library:e,kind:t.kind,itemId:t.id,devices:i,colorOf:this.colorOf,...d===void 0?{}:{pending:d.pending},...c===void 0?{}:{note:c},...l===void 0?{}:{admin:l},...s===void 0?{}:{addFor:s},locked:u=>{let p=Re(e,u,t.kind,t.id);if(p&&M(u,t.kind))return G(t.kind,i.find(k=>k.ownerId===u)?.name??"This device");if(!p&&n.has(u))return Ie}},(u,p)=>{this.tick(t,u,p)})}renderCard(e,t,i,n){let s=this.selecting,d=y(t),o=s&&this.selected.has(d),c=F(t,N,this.deviceKind,i),l=s?`${o?"Let":"Pick"} ${t.name}${o?" go":""}`:c===void 0?J(t.name):`Edit ${t.name} on ${c.name}`,u=p=>this.cardClick(p,t);return h`<div class="ap-card ${s?"picking":""} ${o?"picked":""}" role="listitem" data-card=${d}
      @click=${p=>{s&&u(p)}}>
      <div class="ap-top">
        ${s?h`<input type="checkbox" class="pk-card-pick" .checked=${le(o)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${l}
          @click=${p=>{p.stopPropagation(),this.pick(t,p.shiftKey)}} />`:b}
        <button type="button" class="ap-open" title=${l} tabindex=${s?"-1":"0"} @click=${u}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${z(t)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${l} @click=${u}>
        ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumb(e,t,c)}
      </button>
      ${this.renderCardTicks(e,t,i,n)}
    </div>`}renderDevice(e,t,i){let{device:n}=t,s=this.orderAsked,d=s!==void 0&&s.ownerId===n.ownerId&&s.kind===this.kind?s.ids:void 0,o=ft(t.picks,d),c=o.map(x=>x.id),l=V(e,n.ownerId,this.kind),u=this.search.trim()===""&&!this.picksBusy,p=this.kind==="pages"&&this.freeFacts.get(n.ownerId)===!0&&l>1?A([n.name]):void 0,k=this.waiting(e),S=this.kind==="pages"?B(H(e,n.ownerId)):void 0;return h`<div class="lt-view">
      <div class="lt-sect"><span>${Y(n)} <small>${l}</small></span><span class="lt-sect-r">${mt(n)}</span></div>
      ${this.picksNote===void 0?b:h`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${o.length===0?h`<div class="lt-list"><p class="lt-empty">${vt(n,this.kind,this.search)}</p></div>`:h`<div class="lt-list" role="list" aria-label=${Y(n)}>${o.map((x,m)=>this.renderRow(x,m,c,n,i,u,S))}</div>`}
      ${p===void 0?b:h`<p class="lt-line">${p}</p>`}
      <div class="lt-sect"><span>${bt(n)} <small>${t.rest.length}</small></span><span class="lt-sect-r">${wt}</span></div>
      ${t.rest.length===0?h`<p class="lt-line">${this.search.trim()===""?`Every ${v(this.kind)} in your home is on ${n.name}.`:`No other ${v(this.kind)} has that name.`}</p>`:h`<div class="ap-grid" role="list">${t.rest.map(x=>this.renderRest(e,x,n,i,k))}</div>`}
    </div>`}renderRow(e,t,i,n,s,d,o){let c=Mt(n.ownerId,e.id),l=this.hiddenAsked.get(c)??e.hidden,u=this.kind==="status_pages",p=Ee({...e,hidden:l},n.ownerId,s),k=this.overId!==void 0&&$(this.overId,e.id)&&this.dragId!==void 0&&!$(this.dragId,e.id),S=k&&i.findIndex(m=>$(m,this.dragId))<t,x=m=>{m!==void 0&&this.changePicks(n,{id:e.id,before:m},[...i])};return h`<div class="lt-row ${l?"hid":""} ${k?"drag-over":""} ${S?"below":""} ${this.dragId!==void 0&&$(this.dragId,e.id)?"dragging":""}"
      role="listitem" data-id=${e.id} draggable=${d?"true":"false"} tabindex="-1"
      @dragstart=${m=>{d&&(this.dragId=e.id,m.dataTransfer?.setData("text/plain",e.id),m.dataTransfer&&(m.dataTransfer.effectAllowed="move"))}}
      @dragover=${m=>{this.dragId!==void 0&&(m.preventDefault(),this.overId!==e.id&&(this.overId=e.id))}}
      @drop=${m=>{m.preventDefault();let ie=this.dragId;this.dragId=void 0,this.overId=void 0;let ne=ie===void 0?void 0:kt(i,ie,e.id);ne!==void 0&&this.changePicks(n,ne,[...i])}}
      @dragend=${()=>{this.dragId=void 0,this.overId=void 0}}
      @keydown=${m=>{!m.altKey||!d||m.key!=="ArrowUp"&&m.key!=="ArrowDown"||(m.preventDefault(),m.key==="ArrowUp"?x(t>0?i[t-1]:void 0):x(t<i.length-1?i[t+2]??null:void 0))}}>
      <span class="lt-grip" aria-hidden="true" title=${d?"Drag to order":""}>${P("grip")}</span>
      <button type="button" class="lt-row-open" title=${`Edit ${e.entry.name} on ${n.name}. Alt+Up or Alt+Down moves it.`}
        @click=${()=>this.open(e.entry,n)}>
        ${u?q({page:e.entry.item,hass:this.hassNow,...this.icons===void 0?{}:{icons:this.icons},tick:this.iconsTick}):U({page:e.entry.item,iphone:n.kind==="iphone",tick:this.iconsTick,...o===void 0?{}:{pages:o},...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}})}
        <span class="lt-row-nm"><span class="lt-row-n">${e.entry.name}</span><span class="lt-row-m">${p}</span></span>
      </button>
      ${u?b:h`<button type="button" class="lt-eye" ?disabled=${this.picksBusy}
        title=${l?`Show ${e.entry.name} on ${n.name} again`:`Keep ${e.entry.name} on ${n.name} without showing it`}
        @click=${()=>{this.changePicks(n,{id:e.id,hidden:!l})}}>${l?"Show here":"Hide here"}</button>`}
    </div>`}renderRest(e,t,i,n,s){let d=F(t,N,"all",n),o=d===void 0?J(t.name):`Edit ${t.name} on ${d.name}`,c=t.kind==="status_pages"?q({page:t.item,hass:this.hassNow,width:W,tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}}):U({page:t.item,width:W,tick:this.iconsTick,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}});return h`<div class="ap-card lt-dim" role="listitem" data-card=${y(t)}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${o} @click=${()=>this.open(t)}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${z(t)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb lt-thumb-sm" tabindex="-1" aria-hidden="true" title=${o} @click=${()=>this.open(t)}>${c}</button>
      ${this.renderCardTicks(e,t,n,s,i.ownerId)}
    </div>`}renderBar(e){let t=this.shownNow(),i=t.filter(p=>this.selected.has(y(p))),n=i.length,s=this.bulkBusy!==void 0,d=n===0,o=t.length>0&&t.every(p=>this.selected.has(y(p))),c=s?void 0:this.bulkNote,l=v(this.kind),u=v(this.kind,2);return h`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${u}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(d?`Pick ${E(this.kind)} to start.`:`${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${s||t.length===0}
        title=${o?`Let the ${u} on screen go`:`Pick every ${l} the search and the Device menu have left`}
        @click=${()=>this.selectShown(!o)}>${o?"None":"All shown"}</button>
      ${c===void 0?b:h`<span class="pk-bar-said ${c.kind}">${c.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!d?this.renderDeleteAsk(i,e):h`<button type="button" class="ghost danger small" ?disabled=${s||d}
            title=${`Delete these ${u} from the library, and from every device they are on`}
            @click=${()=>this.toggleAsk()}>${P("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${s}
        title=${`Stop picking and go back to opening one ${l} at a time`}
        @click=${()=>this.endSelect()}>${P("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let i=X(e,t,M),n=Lt(i,t);return h`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${i.items.length===0}
        @click=${()=>{this.runDelete()}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,i){let n=t.item,s=i===void 0?[]:B(H(e,i.ownerId)),d=s.length===0?[n]:s,o=this.hassNow?.states,c=this.icons,l=_/L.width,u=Wt(n,o,c),p=u.height*l,k=p>Q,S=x=>`${Math.round(x*100)/100}px`;return h`<span class="ap-pic ${k?"cut":""}" style=${`width:${S(_)};height:${S(Math.min(p,Q))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${S(-u.top*l)})`}>${Me({page:n,pages:d,screen:L,scale:l,...o===void 0?{}:{states:o},...c===void 0?{}:{icons:c}})}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,i=_/L.width,n=o=>`${Math.round(o*100)/100}px`,d=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return h`<span class="ap-pic ap-pic-status ${d?"cut":""}" style=${`width:${n(_)};height:${n(Math.min(L.height*i,Q))}`}>
      <span class="ap-pic-in">${t===void 0?b:Ae({page:e.item,hass:t,icons:this.icons??fe,screen:L,scale:i})}</span>
    </span>`}static{this.styles=[Be,be,je,xt,$t,Ue,et,nt,se`
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
  `]}};g([I({attribute:!1})],f.prototype,"kind",2),g([I({attribute:!1})],f.prototype,"owners",2),g([I({attribute:!1})],f.prototype,"ownersReady",2),g([I({attribute:!1})],f.prototype,"phones",2),g([I({attribute:!1})],f.prototype,"icons",2),g([I({attribute:!1})],f.prototype,"iconsTick",2),g([I({attribute:!1})],f.prototype,"onOpen",2),g([I({attribute:!1})],f.prototype,"onOpenLibrary",2),g([w()],f.prototype,"search",2),g([w()],f.prototype,"newForm",2),g([w()],f.prototype,"selecting",2),g([w()],f.prototype,"selected",2),g([w()],f.prototype,"asking",2),g([w()],f.prototype,"bulkBusy",2),g([w()],f.prototype,"bulkNote",2),g([w()],f.prototype,"tickNotes",2),g([w()],f.prototype,"picksBusy",2),g([w()],f.prototype,"picksNote",2),g([w()],f.prototype,"orderAsked",2),g([w()],f.prototype,"hiddenAsked",2),g([w()],f.prototype,"dragId",2),g([w()],f.prototype,"overId",2),g([w()],f.prototype,"freeFacts",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",f);export{f as WaAllPages,Wt as pageCrop};
