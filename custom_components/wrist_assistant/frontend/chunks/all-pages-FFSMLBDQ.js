import{A as lt,B as pt,C as ht,a as v,b as E,c as qe,d as Je,e as Ye,f as W,g as N,h as Xe,i as Ge,j as Qe,k as Ze,m as et,o as O,p as tt,q as it,r as nt,s as st,t as _,u as at,v as q,w as rt,x as ot,y as dt,z as ct}from"./chunk-KYO6EJS3.js";import{b as Fe,d as He,e as je}from"./chunk-65EYTF2R.js";import{b as Ve,h as ze,j as Ue}from"./chunk-ILTYHARU.js";import{d as Be,i as Ae}from"./chunk-5EEWN6PV.js";import{k as Ke,n as Ee,p as V,q as z,r as U,t as We}from"./chunk-CY7IJ4BL.js";import{b as ge,c as ke,ca as $,d as me,e as be,ea as Ie,ja as Pe,ka as Se,qa as H,r as xe,ra as j,ta as De,ua as Oe,va as _e,wa as Me}from"./chunk-L7FZX4YY.js";import"./chunk-JFEP3FWP.js";import{g as Ne,h as Le,p as Te,t as Ce,z as Re}from"./chunk-5S6DYQOX.js";import"./chunk-L5EIEW65.js";import{a as ve,d as ye,e as $e,f as F,h as T}from"./chunk-PF5FVRKR.js";import"./chunk-PEI2F5V4.js";import"./chunk-ZOJGMATP.js";import"./chunk-NXR7NIET.js";import{k as we}from"./chunk-UPANJPAF.js";import{b as de,c as ce,e as fe}from"./chunk-23ND6PNG.js";import{c as le}from"./chunk-UYXASAN6.js";import{X as oe,z as re}from"./chunk-NFUDFSSY.js";import{j as K,k as pe,l as A,q as he,r as ue}from"./chunk-ESIOP3D4.js";import{Eg as R,Gg as ae,b as te,d as h,g as b,j as ie,jg as ne,k as P,l as w,nh as I,qg as se}from"./chunk-PGBBLK6E.js";import{Va as D}from"./chunk-2ZMALKUC.js";import{a as k}from"./chunk-LO2NM3CE.js";function ut(r,o){let e=new Set(r);return e.has(o)?e.delete(o):e.add(o),e}function ft(r,o,e,t){let i=new Set(r),n=o.indexOf(t),s=e===void 0?-1:o.indexOf(e);if(n<0)return i;if(s<0)return i.add(t),i;for(let d=Math.min(s,n);d<=Math.max(s,n);d++)i.add(o[d]);return i}function gt(r,o){return new Set([...r,...o])}function kt(r,o){let e=new Set(o);return new Set([...r].filter(t=>!e.has(t)))}function mt(r,o){let e=new Set(o);return new Set([...r].filter(t=>e.has(t)))}function y(r){return r.id.toUpperCase()}function J(r,o,e){let i={kind:r[0]?.kind??"pages",items:[],kept:[],devices:[]},n=new Set;for(let s of r){let d=o.filter(c=>s.owners.some(l=>$(l,c.ownerId))).map(c=>c.ownerId),a=d.filter(c=>e(c,s.kind));if(a.length>0){i.kept.push({name:s.name,dirty:a});continue}i.items.push({id:s.id,name:s.name,owners:[...s.owners]});for(let c of d)n.add(c)}return i.devices=o.map(s=>s.ownerId).filter(s=>n.has(s)),i}var C=(r,o)=>r.find(e=>$(e.ownerId,o))?.name??"a device";function bt(r,o){let e=r.items.length,t=e===1?"it":"them",i=`Delete ${e} ${v(r.kind,e)} from the library?`,n=r.devices.map(a=>C(o,a)),s=r.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,d=[n.length===0?`No device has ${t}. This cannot be undone.`:`${e===1?"It comes":"They come"} off ${T(n)}, ${s}. This cannot be undone.`];for(let a of r.kept){let c=a.dirty.map(l=>C(o,l));d.push(`${a.name} stays: ${T(c)} ${c.length===1?"has":"have"} unsaved edits.`)}return{title:i,body:d.join(" ")}}async function wt(r,o,e,t){let i={kind:o.kind,gone:[],kept:o.kept.map(s=>({...s,dirty:[...s.dirty]})),failed:[],stuck:[],taps:[]},n=new Map;for(let[s,d]of o.items.entries()){t?.(`Deleting ${d.name} (${s+1} of ${o.items.length})\u2026`);let a=await r.delete(o.kind,d.id);if(!a.ok){i.failed.push({name:d.name,text:a.text});continue}i.gone.push(d.name);for(let c of a.reply.link_failures??[]){let l=c.name??C(e,c.owner);i.stuck.includes(l)||i.stuck.push(l)}for(let c of d.owners)n.set(c,[...n.get(c)??[],d.id])}if(o.kind==="pages")for(let[s,d]of n){t?.(`Clearing complication taps on ${C(e,s)}\u2026`);let a=!1;try{a=await r.clearTaps(s,d)}catch{a=!1}a||i.taps.push(C(e,s))}return i}function vt(r){let o=n=>`${n} ${v(r.kind,n)}`,e=[];r.gone.length>0&&e.push(`Deleted ${r.gone.length===1?r.gone[0]:o(r.gone.length)}.`);let t=e.length>0,i=!1;for(let n of r.kept)i=!0,e.push(`Kept ${n.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let n of r.failed)i=!0,e.push(`Not deleted: ${n.name}. ${n.text}`);return r.stuck.length>0&&(i=!0,e.push(`Could not take ${r.gone.length===1?"it":"them"} off ${T(r.stuck)}.`)),r.taps.length>0&&(i=!0,e.push(`Could not clear the complication taps that opened ${r.gone.length===1?"it":"them"} on ${T(r.taps)}. Change those by hand.`)),!t&&!i?{kind:"ok",text:"Nothing was deleted."}:{kind:i?t?"warn":"err":"ok",text:e.join(" ")}}function yt(r){return r==="status_pages"?"statusPages":"pages"}function Lt(r,o){return!K(o)||typeof o.id!="string"?!1:r==="status_pages"?!0:!he(o)}function Tt(r,o,e){if("hidden"in e)return r==="status_pages"?o:we(o,e.id,e.hidden);let t=o[yt(r)];if(!Array.isArray(t))return o;let i=[];t.forEach((p,g)=>{Lt(r,p)&&i.push(g)});let n=i.map(p=>t[p]),s=n.findIndex(p=>$(p.id,e.id));if(s<0)return o;let d=n[s],a=n.filter((p,g)=>g!==s),c=e.before===null?-1:a.findIndex(p=>$(p.id,e.before));if(e.before!==null&&c<0)return o;let l=c<0?[...a,d]:[...a.slice(0,c),d,...a.slice(c)];if(l.every((p,g)=>p===n[g]))return o;let u=t.slice();return i.forEach((p,g)=>{u[p]=l[g]}),{...o,[yt(r)]:u}}var Ct=3;async function $t(r,o,e,t){for(let i=1;;i++){let n;try{n=await r.read(o,e)}catch(a){let{code:c="unknown",message:l}=D(a);return{ok:!1,code:c,message:l}}let s=n.revision>0?e==="status_pages"?xe(n.document):pe(n.document):void 0;if(s===void 0)return{ok:!0,changed:!1};let d=Tt(e,s,t);if(d===s)return{ok:!0,changed:!1};try{return await r.save(o,e,n.revision,d),{ok:!0,changed:!0}}catch(a){let{code:c="unknown",message:l}=D(a);if(c!=="conflict"||i>=Ct)return{ok:!1,code:c,message:l}}}}function Y(r,o){return r==="status_pages"?`${o}'s status pages have unsaved edits. Save or discard them first.`:`${o}'s pages have unsaved edits. Save or discard them first.`}async function Rt(r,o,e){let t=!0,i=await ne(r,o);for(let n of i.records){if(n.deleted||!K(n.document))continue;let s=Be(n.document,e);if(s!==void 0)try{await se(r,o,s,n.revision)}catch{t=!1}}return t}function xt(r){return{delete:async(o,e)=>{try{return{ok:!0,reply:await ge(r,o,e)}}catch(t){let i=be(t),n=me(t);return i===void 0?{ok:!1,text:n}:{ok:!1,code:i,text:n}}},clearTaps:(o,e)=>Rt(r,o,e)}}function It(r){return{read:(o,e)=>R(r,o,e),save:(o,e,t,i)=>ae(r,o,e,t,i)}}var M=200,X=320,Pt=6,L=oe.screen;function Kt(r,o,e,t=L){if(ue(r))return{top:0,height:t.height};let i=Ne(Le(r,o),t);if(i.tiles.length===0)return{top:0,height:t.height};let s=Te(r,1,i.topInset,e)!==b?0:Math.max(0,i.topInset+Math.min(...i.tiles.map(a=>a.y))-Pt),d=i.topInset+Math.max(...i.tiles.map(a=>a.y+a.height))+Pt;return{top:s,height:Math.max(1,d-s)}}var Et=2e3,Nt={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"},G=new Map;function Q(r){let o=G.get(r);if(o!==void 0)return o;let e={kind:"all"};try{let t=window.localStorage.getItem(Nt[r]),i=t?JSON.parse(t):{};typeof i.filter=="string"&&(e.filter=i.filter),(i.kind==="watch"||i.kind==="iphone")&&(e.kind=i.kind)}catch{}return G.set(r,e),e}function St(r,o){let e={...Q(r),...o};G.set(r,e);try{window.localStorage.setItem(Nt[r],JSON.stringify(e))}catch{}}var B=(r,o="pages")=>(o==="status_pages"?Ve(r)?.dirty:Fe(r)?.dirty)??!1,Dt=(r,o)=>`${r}|${o.toUpperCase()}`,f=class extends ie{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.search="";this.newOpen=!1;this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new Oe(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.colorsFor=ce();this.colorOf=e=>de(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let i=Date.now();(t||i-this.hassDrawnAt>=Et)&&(this.hassDrawnAt=i,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown)}willUpdate(e){e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged();let t=this.filterDevice();this.kind==="pages"&&t!==void 0&&!this.freeAsked.has(t.ownerId)&&this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newOpen=!1,this.openNote=void 0,this.picksNote=void 0,this.tickNotes=new Map}get filter(){return Ge(Q(this.kind).filter,this.devices)}filterDevice(){let e=this.filter;return e===N?void 0:this.devices.find(t=>t.ownerId===e)}get deviceKind(){return Ze(Q(this.kind).kind,this.devices)}get devices(){return ve(this.owners,this.phones)}waiting(e){let t=new Map;for(let i of this.devices)t.set(i.ownerId,{held:Se(e,i.ownerId,this.kind),free:!1});return $e(this.owners,t)}setFilter(e){St(this.kind,{filter:e}),e!==N&&this.endSelect(!0),this.picksNote=void 0,this.openNote=void 0,this.requestUpdate()}setSearch(e){this.search=e,this.pruneSelected()}setDeviceKind(e){St(this.kind,{kind:e}),this.requestUpdate(),this.pruneSelected()}newPage(e){if(this.newOpen=!1,this.kind==="status_pages"){Ue(e.ownerId),this.onOpen?.(e.ownerId,e.kind,"status_pages");return}je(e.ownerId),this.onOpen?.(e.ownerId,e.kind)}open(e,t){let i=t??_(e,this.filter,this.deviceKind,this.devices);if(i===void 0){this.openNote=y(e);return}if(this.openNote=void 0,e.kind==="status_pages"){ze(i.ownerId,e.id),this.onOpen?.(i.ownerId,i.kind,"status_pages");return}He(i.ownerId,{pageId:e.id}),this.onOpen?.(i.ownerId,i.kind)}async tick(e,t,i){let n=this.lib.store;if(n===void 0)return;let s=y(e);if(this.tickNotes.has(s)){let p=new Map(this.tickNotes);p.delete(s),this.tickNotes=p}if(this.openNote===s&&(this.openNote=void 0),!(await Ae(this.hassNow,n,t,e.kind,e.id,i)).ok||!i||e.kind!=="pages")return;let a=await this.readFree(t),c=this.lib.library,l=this.devices.find(p=>p.ownerId===t)?.name;if(!a||c===void 0||l===void 0||j(c,t,"pages")<2)return;let u=F([l]);u!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(s,`Added to ${l}. ${u}`))}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let n=(await R(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==n&&(this.freeFacts=new Map(this.freeFacts).set(e,n)),n}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,i){let n=this.hassNow,s=this.lib.store;if(n===void 0||s===void 0||this.picksBusy)return;let d=this.kind;if(B(e.ownerId,d)){this.picksNote={kind:"warn",text:Y(d,e.name)};return}let a=this.kindSeq,c="hidden"in t,l=Dt(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,c?this.hiddenAsked=new Map(this.hiddenAsked).set(l,t.hidden):i!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:d,ids:st(i,t.id,t.before)});let u=this.orderAsked,p;try{let g=await $t(It(n),e.ownerId,d,t);g.ok||(p={kind:"err",text:`${c?"Not changed":"Not moved"} on ${e.name}: ${g.message.replace(/\.$/,"")}.`})}catch(g){p={kind:"err",text:D(g).message}}if(await s.refresh(),this.picksBusy=!1,c){let g=new Map(this.hiddenAsked);g.delete(l),this.hiddenAsked=g}else this.orderAsked===u&&(this.orderAsked=void 0);a===this.kindSeq&&(this.picksNote=p)}shownNow(){let e=this.lib.library;return e===void 0?[]:O(e,this.kind,this.search,this.deviceKind,this.devices)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(y(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=mt(this.selected,this.shownNow().map(y)))}startSelect(){this.selecting=!0,this.bulkNote=void 0,this.openNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let i=y(e);this.selected=t?ft(this.selected,this.shownNow().map(y),this.anchor,i):ut(this.selected,i),this.anchor=i,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(y);this.selected=e?gt(this.selected,t):kt(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}async runDelete(){let e=this.hassNow,t=this.lib.store;if(e===void 0||t===void 0||this.bulkBusy!==void 0)return;let i=this.pickedItems();if(i.length===0)return;let n=this.kindSeq,s=this.devices;this.asking=!1,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let d;try{let a=await wt(xt(e),J(i,s,B),s,c=>{this.bulkBusy=c});d=vt(a)}catch(a){d={kind:"err",text:D(a).message}}this.bulkBusy="Reading the library again\u2026";try{await t.refresh()}finally{this.bulkBusy=void 0}n===this.kindSeq&&(this.pruneSelected(),this.anchor=void 0,this.bulkNote=d)}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return h`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let t=this.kind,i=this.lib.library,n=this.lib.readState,s=this.filterDevice(),d=v(t,2),a=e.length>1,c=this.filter,l=i===void 0?n==="unsupported"?ke:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${d}\u2026`:Je(Ie(i,t).length,t),u=i!==void 0&&n==="failed";return h`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${qe(t)}</h1>
          <p class="ap-lead">${l}</p>
        </div>
        ${e.length===0?b:this.renderNew(s,e)}
      </div>
      ${u?h`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:b}
      <div class="pk-surface pk-page" role="region" aria-label=${`Your ${d}`}>
        <div class="pk-pin">
          ${this.renderHead(i,s,e)}
          ${a?this.renderTabs(e,i,c):b}
          ${this.selecting&&s===void 0?this.renderBar(e):b}
        </div>
        <div class="pk-body" role=${a?"tabpanel":b} aria-labelledby=${a?`ap-tab-${c}`:b}>
          ${i===void 0?h`<p class="ap-empty">${l}</p>`:s===void 0?this.renderAll(i,e):this.renderDevice(i,tt(i,s,t,this.search),e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${Ye(t,s,this.selecting&&s===void 0)}</span></div>
      </div>
    </div></div>`}renderAll(e,t){let i=O(e,this.kind,this.search,this.deviceKind,t);if(i.length===0)return h`<p class="ap-empty">${lt(t,this.search,this.deviceKind,this.kind)}</p>`;let n=this.waiting(e);return h`<div class="ap-grid" role="list">${i.map(s=>this.renderCard(e,s,t,n))}</div>`}renderHead(e,t,i){let n=this.selecting,s=this.bulkBusy!==void 0,d=v(this.kind,2);return h`<div class="pk-head">
      ${t===void 0?h`<button type="button" class="pk-pick-btn ${n?"on":""}" aria-pressed=${n?"true":"false"}
        title=${n?`Back to opening one ${v(this.kind)} at a time`:`Pick several ${d} to delete together`}
        ?disabled=${s||e===void 0} @click=${()=>n?this.endSelect():this.startSelect()}>
        ${I("checklist")}<span>Multi select</span></button>`:b}
      ${t===void 0&&e!==void 0&&Qe(i)?this.renderKinds(e,i):b}
      <label class="pk-search">
        ${I("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${d}`}
          @input=${a=>this.setSearch(a.target.value)} />
      </label>
    </div>`}renderNew(e,t){let i=e??(t.length===1?t[0]:void 0),n=this.newOpen&&i===void 0,s=`New ${v(this.kind)}`,d=`Add ${E(this.kind)} on`;return h`<div class="ap-new" @keydown=${a=>{a.key==="Escape"&&n&&(a.stopPropagation(),this.newOpen=!1)}}
      @focusout=${a=>{let c=a.relatedTarget;n&&!(c instanceof Node&&a.currentTarget.contains(c))&&(this.newOpen=!1)}}>
      <button type="button" class="ap-new-btn" aria-haspopup=${i===void 0?"menu":b}
        aria-expanded=${i===void 0?n?"true":"false":b}
        title=${i===void 0?`Pick the device to add ${E(this.kind)} on`:`${d} ${i.name}`}
        @click=${()=>i===void 0?this.newOpen=!this.newOpen:this.newPage(i)}>
        ${I("plus")}<span>${s}</span></button>
      ${n?h`<div class="ap-new-menu" role="menu" aria-label=${d}>
        <div class="ap-new-h">${d}</div>
        ${t.map(a=>h`<button type="button" class="ap-new-row" role="menuitem"
          style=${`--dc:${this.colorOf(a.ownerId)??"var(--wa-line-strong)"}`} @click=${()=>this.newPage(a)}>
          ${I(a.kind==="iphone"?"phone":"watch")}<span>${a.name}</span></button>`)}
      </div>`:b}
    </div>`}renderKinds(e,t){let i=this.deviceKind,n=et(O(e,this.kind,this.search,"all",t),t);return h`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label=${`Show the ${v(this.kind,2)} on one kind of device`} .value=${i}
        @change=${s=>this.setDeviceKind(s.target.value)}>
        ${n.map(s=>h`<option value=${s.key} ?selected=${s.key===i}>${s.label} (${s.count})</option>`)}
      </select>
    </label>`}renderTabs(e,t,i){return h`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${Xe(e,t,this.kind,this.colorOf).map(n=>h`<button type="button" role="tab" class="pk-tab ${n.id===i?"on":""}"
        style=${n.color===void 0?b:`--dc:${n.color}`} id=${`ap-tab-${n.id}`} aria-selected=${n.id===i?"true":"false"}
        title=${n.id===N?`Every ${v(this.kind)} in your home`:`The ${v(this.kind,2)} on ${n.label}`}
        @click=${()=>this.setFilter(n.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${I(n.kind===void 0?"grid":n.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${n.label}</span>
        <span class="pk-tab-count">${n.count}</span>
      </button>`)}
    </div>`}renderCardTicks(e,t,i,n,s){let d=this.lib.store,a=y(t),c=d?.noteFor(t.kind,t.id)??this.tickNotes.get(a)??(this.openNote===a?at(t.kind):void 0),l=this.hassNow?.user?.is_admin;return _e({library:e,kind:t.kind,itemId:t.id,devices:i,colorOf:this.colorOf,...d===void 0?{}:{pending:d.pending},...c===void 0?{}:{note:c},...l===void 0?{}:{admin:l},...s===void 0?{}:{addFor:s},locked:u=>{let p=Pe(e,u,t.kind,t.id);if(p&&B(u,t.kind))return Y(t.kind,i.find(g=>g.ownerId===u)?.name??"This device");if(!p&&n.has(u))return ye}},(u,p)=>{this.tick(t,u,p)})}renderCard(e,t,i,n){let s=this.selecting,d=y(t),a=s&&this.selected.has(d),c=_(t,N,this.deviceKind,i),l=s?`${a?"Let":"Pick"} ${t.name}${a?" go":""}`:c===void 0?`${t.name} is on no device yet`:`Edit ${t.name} on ${c.name}`,u=p=>this.cardClick(p,t);return h`<div class="ap-card ${s?"picking":""} ${a?"picked":""}" role="listitem" data-card=${d}
      @click=${p=>{s&&u(p)}}>
      <div class="ap-top">
        ${s?h`<input type="checkbox" class="pk-card-pick" .checked=${re(a)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${l}
          @click=${p=>{p.stopPropagation(),this.pick(t,p.shiftKey)}} />`:b}
        <button type="button" class="ap-open" title=${l} tabindex=${s?"-1":"0"} @click=${u}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${W(t)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${l} @click=${u}>
        ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumb(e,t,c)}
      </button>
      ${this.renderCardTicks(e,t,i,n)}
    </div>`}renderDevice(e,t,i){let{device:n}=t,s=this.orderAsked,d=s!==void 0&&s.ownerId===n.ownerId&&s.kind===this.kind?s.ids:void 0,a=it(t.picks,d),c=a.map(x=>x.id),l=j(e,n.ownerId,this.kind),u=this.search.trim()===""&&!this.picksBusy,p=this.kind==="pages"&&this.freeFacts.get(n.ownerId)===!0&&l>1?F([n.name]):void 0,g=this.waiting(e),S=this.kind==="pages"?A(H(e,n.ownerId)):void 0;return h`<div class="lt-view">
      <div class="lt-sect"><span>${q(n)} <small>${l}</small></span><span class="lt-sect-r">${rt(n)}</span></div>
      ${this.picksNote===void 0?b:h`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${a.length===0?h`<div class="lt-list"><p class="lt-empty">${ct(n,this.kind,this.search)}</p></div>`:h`<div class="lt-list" role="list" aria-label=${q(n)}>${a.map((x,m)=>this.renderRow(x,m,c,n,i,u,S))}</div>`}
      ${p===void 0?b:h`<p class="lt-line">${p}</p>`}
      <div class="lt-sect"><span>${ot(n)} <small>${t.rest.length}</small></span><span class="lt-sect-r">${dt}</span></div>
      ${t.rest.length===0?h`<p class="lt-line">${this.search.trim()===""?`Every ${v(this.kind)} in your home is on ${n.name}.`:`No other ${v(this.kind)} has that name.`}</p>`:h`<div class="ap-grid" role="list">${t.rest.map(x=>this.renderRest(e,x,n,i,g))}</div>`}
    </div>`}renderRow(e,t,i,n,s,d,a){let c=Dt(n.ownerId,e.id),l=this.hiddenAsked.get(c)??e.hidden,u=this.kind==="status_pages",p=De({...e,hidden:l},n.ownerId,s),g=this.overId!==void 0&&$(this.overId,e.id)&&this.dragId!==void 0&&!$(this.dragId,e.id),S=g&&i.findIndex(m=>$(m,this.dragId))<t,x=m=>{m!==void 0&&this.changePicks(n,{id:e.id,before:m},[...i])};return h`<div class="lt-row ${l?"hid":""} ${g?"drag-over":""} ${S?"below":""} ${this.dragId!==void 0&&$(this.dragId,e.id)?"dragging":""}"
      role="listitem" data-id=${e.id} draggable=${d?"true":"false"} tabindex="-1"
      @dragstart=${m=>{d&&(this.dragId=e.id,m.dataTransfer?.setData("text/plain",e.id),m.dataTransfer&&(m.dataTransfer.effectAllowed="move"))}}
      @dragover=${m=>{this.dragId!==void 0&&(m.preventDefault(),this.overId!==e.id&&(this.overId=e.id))}}
      @drop=${m=>{m.preventDefault();let Z=this.dragId;this.dragId=void 0,this.overId=void 0;let ee=Z===void 0?void 0:nt(i,Z,e.id);ee!==void 0&&this.changePicks(n,ee,[...i])}}
      @dragend=${()=>{this.dragId=void 0,this.overId=void 0}}
      @keydown=${m=>{!m.altKey||!d||m.key!=="ArrowUp"&&m.key!=="ArrowDown"||(m.preventDefault(),m.key==="ArrowUp"?x(t>0?i[t-1]:void 0):x(t<i.length-1?i[t+2]??null:void 0))}}>
      <span class="lt-grip" aria-hidden="true" title=${d?"Drag to order":""}>${I("grip")}</span>
      <button type="button" class="lt-row-open" title=${`Edit ${e.entry.name} on ${n.name}. Alt+Up or Alt+Down moves it.`}
        @click=${()=>this.open(e.entry,n)}>
        ${u?U({page:e.entry.item,hass:this.hassNow,...this.icons===void 0?{}:{icons:this.icons},tick:this.iconsTick}):z({page:e.entry.item,iphone:n.kind==="iphone",tick:this.iconsTick,...a===void 0?{}:{pages:a},...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}})}
        <span class="lt-row-nm"><span class="lt-row-n">${e.entry.name}</span><span class="lt-row-m">${p}</span></span>
      </button>
      ${u?b:h`<button type="button" class="lt-eye" ?disabled=${this.picksBusy}
        title=${l?`Show ${e.entry.name} on ${n.name} again`:`Keep ${e.entry.name} on ${n.name} without showing it`}
        @click=${()=>{this.changePicks(n,{id:e.id,hidden:!l})}}>${l?"Show here":"Hide here"}</button>`}
    </div>`}renderRest(e,t,i,n,s){let d=_(t,N,"all",n),a=d===void 0?`${t.name} is on no device yet`:`Edit ${t.name} on ${d.name}`,c=t.kind==="status_pages"?U({page:t.item,hass:this.hassNow,width:V,tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}}):z({page:t.item,width:V,tick:this.iconsTick,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}});return h`<div class="ap-card lt-dim" role="listitem" data-card=${y(t)}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${a} @click=${()=>this.open(t)}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${W(t)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb lt-thumb-sm" tabindex="-1" aria-hidden="true" title=${a} @click=${()=>this.open(t)}>${c}</button>
      ${this.renderCardTicks(e,t,n,s,i.ownerId)}
    </div>`}renderBar(e){let t=this.shownNow(),i=t.filter(p=>this.selected.has(y(p))),n=i.length,s=this.bulkBusy!==void 0,d=n===0,a=t.length>0&&t.every(p=>this.selected.has(y(p))),c=s?void 0:this.bulkNote,l=v(this.kind),u=v(this.kind,2);return h`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${u}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(d?`Pick ${E(this.kind)} to start.`:`${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${s||t.length===0}
        title=${a?`Let the ${u} on screen go`:`Pick every ${l} the search and the Device menu have left`}
        @click=${()=>this.selectShown(!a)}>${a?"None":"All shown"}</button>
      ${c===void 0?b:h`<span class="pk-bar-said ${c.kind}">${c.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!d?this.renderDeleteAsk(i,e):h`<button type="button" class="ghost danger small" ?disabled=${s||d}
            title=${`Delete these ${u} from the library, and from every device they are on`}
            @click=${()=>this.toggleAsk()}>${I("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${s}
        title=${`Stop picking and go back to opening one ${l} at a time`}
        @click=${()=>this.endSelect()}>${I("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let i=J(e,t,B),n=bt(i,t);return h`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${i.items.length===0}
        @click=${()=>{this.runDelete()}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,i){let n=t.item,s=i===void 0?[]:A(H(e,i.ownerId)),d=s.length===0?[n]:s,a=this.hassNow?.states,c=this.icons,l=M/L.width,u=Kt(n,a,c),p=u.height*l,g=p>X,S=x=>`${Math.round(x*100)/100}px`;return h`<span class="ap-pic ${g?"cut":""}" style=${`width:${S(M)};height:${S(Math.min(p,X))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${S(-u.top*l)})`}>${Ce({page:n,pages:d,screen:L,scale:l,...a===void 0?{}:{states:a},...c===void 0?{}:{icons:c}})}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,i=M/L.width,n=a=>`${Math.round(a*100)/100}px`,d=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return h`<span class="ap-pic ap-pic-status ${d?"cut":""}" style=${`width:${n(M)};height:${n(Math.min(L.height*i,X))}`}>
      <span class="ap-pic-in">${t===void 0?b:Ke({page:e.item,hass:t,icons:this.icons??le,screen:L,scale:i})}</span>
    </span>`}static{this.styles=[Re,fe,Ee,ht,pt,Me,We,te`
    /* New page: filled, as New complication is, the one way to start a page
       from this tab. Its menu of devices opens under it, at its right edge. */
    .ap-new { position: relative; flex: none; }
    .ap-new-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px; font-weight: 600;
      height: 30px; padding: 0 11px; border-radius: 8px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink);
    }
    .ap-new-btn:hover { filter: brightness(1.1); }
    .ap-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-new-btn svg { width: 16px; height: 16px; }
    .ap-new-menu {
      position: absolute; right: 0; top: calc(100% + 6px); z-index: 9; width: min(260px, calc(100vw - 24px));
      display: flex; flex-direction: column; gap: 2px; padding: 6px;
      background: var(--wa-card); border: 1px solid var(--wa-line-strong); border-radius: 10px; box-shadow: var(--wa-shadow-pop);
    }
    .ap-new-h { padding: 6px 8px 4px; font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); }
    .ap-new-row {
      display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 0 10px; border-radius: 6px; cursor: pointer;
      font-size: 13px; text-align: left; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line);
      box-shadow: inset 3px 0 0 var(--dc);
    }
    .ap-new-row:hover { background: var(--wa-hover); border-color: var(--wa-line-strong); }
    .ap-new-row:focus-visible { outline: none; box-shadow: inset 3px 0 0 var(--dc), var(--wa-ring); }
    .ap-new-row svg { width: 14px; height: 14px; flex: none; color: var(--wa-muted); }

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
  `]}};k([P({attribute:!1})],f.prototype,"kind",2),k([P({attribute:!1})],f.prototype,"owners",2),k([P({attribute:!1})],f.prototype,"ownersReady",2),k([P({attribute:!1})],f.prototype,"phones",2),k([P({attribute:!1})],f.prototype,"icons",2),k([P({attribute:!1})],f.prototype,"iconsTick",2),k([P({attribute:!1})],f.prototype,"onOpen",2),k([w()],f.prototype,"search",2),k([w()],f.prototype,"newOpen",2),k([w()],f.prototype,"selecting",2),k([w()],f.prototype,"selected",2),k([w()],f.prototype,"asking",2),k([w()],f.prototype,"bulkBusy",2),k([w()],f.prototype,"bulkNote",2),k([w()],f.prototype,"openNote",2),k([w()],f.prototype,"tickNotes",2),k([w()],f.prototype,"picksBusy",2),k([w()],f.prototype,"picksNote",2),k([w()],f.prototype,"orderAsked",2),k([w()],f.prototype,"hiddenAsked",2),k([w()],f.prototype,"dragId",2),k([w()],f.prototype,"overId",2),k([w()],f.prototype,"freeFacts",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",f);export{f as WaAllPages,Kt as pageCrop};
