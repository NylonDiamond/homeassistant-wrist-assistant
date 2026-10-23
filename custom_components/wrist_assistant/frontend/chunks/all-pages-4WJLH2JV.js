import{a as xt,b as It,c as Pt,d as Nt,e as St}from"./chunk-5D7BL2RK.js";import{b as kt,d as gt,e as mt}from"./chunk-Q7K2QZP4.js";import{b as bt,h as wt,j as vt}from"./chunk-DCCJWEHN.js";import{d as We,i as W,j as Ye}from"./chunk-GCPJTNFE.js";import{A as it,B as nt,C as st,E as at,G as M,H as rt,I as ot,J as dt,K as ct,L as _,M as q,N as J,O as lt,P as pt,Q as ht,R as ut,S as ft,U as Y,V as X,W as G,Y as $t,m as Ve,p as Ue,q as w,r as F,s as Xe,t as Ge,u as Qe,v as Ze,w as et,x as z,y as D,z as tt}from"./chunk-IPB4U3W3.js";import"./chunk-VFC54RRP.js";import{Ba as Je,E as Te,F as Re,Ja as yt,c as ve,d as ye,e as $e,f as xe,ga as x,ia as O,na as Ke,oa as Ee,s as Ce,ua as V,va as U,xa as Oe,ya as ze,za as qe}from"./chunk-5KIMV2C3.js";import"./chunk-CKIFX3N2.js";import{A as je,H as He,m as Me,n as _e,v as Ae,z as Be}from"./chunk-BYMVRJDG.js";import{_a as Fe}from"./chunk-22CN6A74.js";import{a as Ie,c as C,f as Pe,g as Ne,h as H}from"./chunk-XF6VR4HJ.js";import"./chunk-RQWXLJYE.js";import"./chunk-ZOJGMATP.js";import"./chunk-5VYGCGX2.js";import{g as Se,h as De,m as Le}from"./chunk-CHKZKW42.js";import{b as ue,c as fe,e as we}from"./chunk-KBXFS4SO.js";import{c as ke}from"./chunk-SV3BTW33.js";import{X as he,z as pe}from"./chunk-VPFZE74S.js";import{j as E,k as ge,l as j,q as me,r as be}from"./chunk-TUSU5T3G.js";import{Eg as K,Ge as oe,Gg as le,b as ae,d as h,g as b,j as re,jg as de,k as N,l as y,nh as I,qg as ce}from"./chunk-BDP52PL7.js";import{Xa as S}from"./chunk-TGJNCNIU.js";import{a as m}from"./chunk-LO2NM3CE.js";function Dt(a,r){let e=new Set(a);return e.has(r)?e.delete(r):e.add(r),e}function Lt(a,r,e,t){let i=new Set(a),n=r.indexOf(t),s=e===void 0?-1:r.indexOf(e);if(n<0)return i;if(s<0)return i.add(t),i;for(let o=Math.min(s,n);o<=Math.max(s,n);o++)i.add(r[o]);return i}function Ct(a,r){return new Set([...a,...r])}function Tt(a,r){let e=new Set(r);return new Set([...a].filter(t=>!e.has(t)))}function Rt(a,r){let e=new Set(r);return new Set([...a].filter(t=>e.has(t)))}function $(a){return a.id.toUpperCase()}function Q(a,r,e){let i={kind:a[0]?.kind??"pages",items:[],kept:[],devices:[]},n=new Set;for(let s of a){let o=r.filter(c=>s.owners.some(l=>x(l,c.ownerId))).map(c=>c.ownerId),d=o.filter(c=>e(c,s.kind));if(d.length>0){i.kept.push({name:s.name,dirty:d});continue}i.items.push({id:s.id,name:s.name,owners:[...s.owners]});for(let c of o)n.add(c)}return i.devices=r.map(s=>s.ownerId).filter(s=>n.has(s)),i}var T=(a,r)=>a.find(e=>x(e.ownerId,r))?.name??"a device";function Kt(a,r){let e=a.items.length,t=e===1?"it":"them",i=`Delete ${e} ${w(a.kind,e)} from the library?`,n=a.devices.map(d=>T(r,d)),s=a.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,o=[n.length===0?`No device has ${t}. This cannot be undone.`:`${e===1?"It comes":"They come"} off ${C(n)}, ${s}. This cannot be undone.`];for(let d of a.kept){let c=d.dirty.map(l=>T(r,l));o.push(`${d.name} stays: ${C(c)} ${c.length===1?"has":"have"} unsaved edits.`)}return{title:i,body:o.join(" ")}}async function Et(a,r,e,t){let i={kind:r.kind,gone:[],kept:r.kept.map(s=>({...s,dirty:[...s.dirty]})),failed:[],stuck:[],taps:[]},n=new Map;for(let[s,o]of r.items.entries()){t?.(`Deleting ${o.name} (${s+1} of ${r.items.length})\u2026`);let d=await a.delete(r.kind,o.id);if(!d.ok){i.failed.push({name:o.name,text:d.text});continue}i.gone.push(o.name);for(let c of d.reply.link_failures??[]){let l=c.name??T(e,c.owner);i.stuck.includes(l)||i.stuck.push(l)}for(let c of o.owners)n.set(c,[...n.get(c)??[],o.id])}if(r.kind==="pages")for(let[s,o]of n){t?.(`Clearing complication taps on ${T(e,s)}\u2026`);let d=!1;try{d=await a.clearTaps(s,o)}catch{d=!1}d||i.taps.push(T(e,s))}return i}function Ot(a){let r=n=>`${n} ${w(a.kind,n)}`,e=[];a.gone.length>0&&e.push(`Deleted ${a.gone.length===1?a.gone[0]:r(a.gone.length)}.`);let t=e.length>0,i=!1;for(let n of a.kept)i=!0,e.push(`Kept ${n.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let n of a.failed)i=!0,e.push(`Not deleted: ${n.name}. ${n.text}`);return a.stuck.length>0&&(i=!0,e.push(`Could not take ${a.gone.length===1?"it":"them"} off ${C(a.stuck)}.`)),a.taps.length>0&&(i=!0,e.push(`Could not clear the complication taps that opened ${a.gone.length===1?"it":"them"} on ${C(a.taps)}. Change those by hand.`)),!t&&!i?{kind:"ok",text:"Nothing was deleted."}:{kind:i?t?"warn":"err":"ok",text:e.join(" ")}}function Ft(a){return a==="status_pages"?"statusPages":"pages"}function Ut(a,r){return!E(r)||typeof r.id!="string"?!1:a==="status_pages"?!0:!me(r)}function Wt(a,r,e){if("hidden"in e)return a==="status_pages"?r:Le(r,e.id,e.hidden);let t=r[Ft(a)];if(!Array.isArray(t))return r;let i=[];t.forEach((p,f)=>{Ut(a,p)&&i.push(f)});let n=i.map(p=>t[p]),s=n.findIndex(p=>x(p.id,e.id));if(s<0)return r;let o=n[s],d=n.filter((p,f)=>f!==s),c=e.before===null?-1:d.findIndex(p=>x(p.id,e.before));if(e.before!==null&&c<0)return r;let l=c<0?[...d,o]:[...d.slice(0,c),o,...d.slice(c)];if(l.every((p,f)=>p===n[f]))return r;let u=t.slice();return i.forEach((p,f)=>{u[p]=l[f]}),{...r,[Ft(a)]:u}}var zt=3;async function Mt(a,r,e,t){for(let i=1;;i++){let n;try{n=await a.read(r,e)}catch(d){let{code:c="unknown",message:l}=S(d);return{ok:!1,code:c,message:l}}let s=n.revision>0?e==="status_pages"?Ce(n.document):ge(n.document):void 0;if(s===void 0)return{ok:!0,changed:!1};let o=Wt(e,s,t);if(o===s)return{ok:!0,changed:!1};try{return await a.save(r,e,n.revision,o),{ok:!0,changed:!0}}catch(d){let{code:c="unknown",message:l}=S(d);if(c!=="conflict"||i>=zt)return{ok:!1,code:c,message:l}}}}function Z(a,r){return a==="status_pages"?`${r}'s status pages have unsaved edits. Save or discard them first.`:`${r}'s pages have unsaved edits. Save or discard them first.`}async function qt(a,r,e){let t=!0,i=await de(a,r);for(let n of i.records){if(n.deleted||!E(n.document))continue;let s=We(n.document,e);if(s!==void 0)try{await ce(a,r,s,n.revision)}catch{t=!1}}return t}function _t(a){return{delete:async(r,e)=>{try{return{ok:!0,reply:await ve(a,r,e)}}catch(t){let i=xe(t),n=$e(t);return i===void 0?{ok:!1,text:n}:{ok:!1,code:i,text:n}}},clearTaps:(r,e)=>qt(a,r,e)}}function At(a){return{read:(r,e)=>K(a,r,e),save:(r,e,t,i)=>le(a,r,e,t,i)}}var A=200,ee=320,Bt=6,L=he.screen;function Jt(a,r,e,t=L){if(be(a))return{top:0,height:t.height};let i=Me(_e(a,r),t),n=[...i.tiles,...je(a,t,{states:r})];if(n.length===0)return{top:0,height:t.height};let o=Ae(a,1,i.topInset,e)!==b?0:Math.max(0,i.topInset+Math.min(...n.map(c=>c.y))-Bt),d=i.topInset+Math.max(...n.map(c=>c.y+c.height))+Bt;return{top:o,height:Math.max(1,d-o)}}var Yt=2e3,Vt={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"};function te(a){return["watch","iphone"].filter(r=>a.some(e=>e.kind===r))}var ie=new Map;function ne(a){let r=ie.get(a);if(r!==void 0)return r;let e={kind:"all"};try{let t=window.localStorage.getItem(Vt[a]),i=t?JSON.parse(t):{};typeof i.filter=="string"&&(e.filter=i.filter),(i.kind==="watch"||i.kind==="iphone")&&(e.kind=i.kind)}catch{}return ie.set(a,e),e}function jt(a,r){let e={...ne(a),...r};ie.set(a,e);try{window.localStorage.setItem(Vt[a],JSON.stringify(e))}catch{}}var B=(a,r="pages")=>(r==="status_pages"?bt(a)?.dirty:kt(a)?.dirty)??!1,Ht=(a,r)=>`${a}|${r.toUpperCase()}`,k=class extends re{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.search="";this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new ze(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.colorsFor=fe();this.colorOf=e=>ue(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let i=Date.now();(t||i-this.hassDrawnAt>=Yt)&&(this.hassDrawnAt=i,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown)}willUpdate(e){e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged();let t=this.filterDevice();this.kind==="pages"&&t!==void 0&&!this.freeAsked.has(t.ownerId)&&this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return it(ne(this.kind).filter,this.devices)}filterDevice(){let e=this.filter;return e===D?void 0:this.devices.find(t=>t.ownerId===e)}get deviceKind(){return st(ne(this.kind).kind,this.devices)}get devices(){return Ie(this.owners,this.phones)}waiting(e){let t=new Map;for(let i of this.devices)t.set(i.ownerId,{held:Ee(e,i.ownerId,this.kind),free:!1});return Ne(this.owners,t)}setFilter(e){jt(this.kind,{filter:e}),e!==D&&this.endSelect(!0),this.picksNote=void 0,this.requestUpdate()}setSearch(e){this.search=e,this.pruneSelected()}setDeviceKind(e){jt(this.kind,{kind:e}),this.requestUpdate(),this.pruneSelected()}newPage(e){if(this.newForm=void 0,this.kind==="status_pages"){vt(e.ownerId),this.onOpen?.(e.ownerId,e.kind,"status_pages");return}mt(e.ownerId),this.onOpen?.(e.ownerId,e.kind)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!this.newForm?.busy){if(this.newForm!==void 0){this.newForm=void 0;return}this.newForm={name:this.nextCardName(),busy:!1,preview:te(this.devices)[0]},this.updateComplete.then(()=>It(this.renderRoot))}}nextCardName(){let e=this.lib.library,t=e===void 0?[]:O(e,this.kind).map(i=>i.item);return this.kind==="status_pages"?Te({schemaVersion:1,statusPages:t}):Se({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let i=e.name.trim();if(i===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${w(this.kind)} a name.`}};return}let{note:n,...s}=e;this.newForm={...s,busy:!0};let o=oe(),d=this.kind==="status_pages"?{schemaVersion:1,statusPages:[Re(i,o)]}:{schemaVersion:1,pages:[De(o,i)]},c=await t.createItem(this.kind,d);if(!c.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${c.text}`}};return}this.newForm=void 0,yt(e.preview??te(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,c.reply.id)}open(e,t){let i=t??_(e,this.filter,this.deviceKind,this.devices);if(i===void 0){this.onOpenLibrary?.(e.kind,e.id);return}if(e.kind==="status_pages"){wt(i.ownerId,e.id),this.onOpen?.(i.ownerId,i.kind,"status_pages");return}gt(i.ownerId,{pageId:e.id}),this.onOpen?.(i.ownerId,i.kind)}async tick(e,t,i){let n=this.lib.store;if(n===void 0)return;if(this.dropTickNote($(e)),this.untickAsk=void 0,!i){let p={item:e.name,device:this.devices.find(f=>f.ownerId===t)?.name??"the device"};this.untickAsk=await Ye(this.hassNow,n,t,e.kind,e.id,p);return}let s=$(e);if(!(await W(this.hassNow,n,t,e.kind,e.id,!0)).ok||e.kind!=="pages")return;let d=await this.readFree(t),c=this.lib.library,l=this.devices.find(p=>p.ownerId===t)?.name;if(!d||c===void 0||l===void 0||U(c,t,"pages")<2)return;let u=H([l]);u!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(s,{kind:"warn",text:`Added to ${l}. ${u}`}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let i=await W(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names);i.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set($({id:e.itemId}),i.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let n=(await K(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==n&&(this.freeFacts=new Map(this.freeFacts).set(e,n)),n}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,i){let n=this.hassNow,s=this.lib.store;if(n===void 0||s===void 0||this.picksBusy)return;let o=this.kind;if(B(e.ownerId,o)){this.picksNote={kind:"warn",text:Z(o,e.name)};return}let d=this.kindSeq,c="hidden"in t,l=Ht(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,c?this.hiddenAsked=new Map(this.hiddenAsked).set(l,t.hidden):i!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:o,ids:ct(i,t.id,t.before)});let u=this.orderAsked,p;try{let f=await Mt(At(n),e.ownerId,o,t);f.ok||(p={kind:"err",text:`${c?"Not changed":"Not moved"} on ${e.name}: ${f.message.replace(/\.$/,"")}.`})}catch(f){p={kind:"err",text:S(f).message}}if(await s.refresh(),this.picksBusy=!1,c){let f=new Map(this.hiddenAsked);f.delete(l),this.hiddenAsked=f}else this.orderAsked===u&&(this.orderAsked=void 0);d===this.kindSeq&&(this.picksNote=p)}shownNow(){let e=this.lib.library;return e===void 0?[]:M(e,this.kind,this.search,this.deviceKind,this.devices)}pickedItems(){return this.shownNow().filter(e=>this.selected.has($(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=Rt(this.selected,this.shownNow().map($)))}startSelect(){this.selecting=!0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let i=$(e);this.selected=t?Lt(this.selected,this.shownNow().map($),this.anchor,i):Dt(this.selected,i),this.anchor=i,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map($);this.selected=e?Ct(this.selected,t):Tt(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}async runDelete(){let e=this.hassNow,t=this.lib.store;if(e===void 0||t===void 0||this.bulkBusy!==void 0)return;let i=this.pickedItems();if(i.length===0)return;let n=this.kindSeq,s=this.devices;this.asking=!1,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let o;try{let d=await Et(_t(e),Q(i,s,B),s,c=>{this.bulkBusy=c});o=Ot(d)}catch(d){o={kind:"err",text:S(d).message}}this.bulkBusy="Reading the library again\u2026";try{await t.refresh()}finally{this.bulkBusy=void 0}n===this.kindSeq&&(this.pruneSelected(),this.anchor=void 0,this.bulkNote=o)}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return h`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let t=this.kind,i=this.lib.library,n=this.lib.readState,s=this.filterDevice(),o=w(t,2),d=e.length>1,c=this.filter,l=i===void 0?n==="unsupported"?ye:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${o}\u2026`:Qe(O(i,t).length,t),u=i!==void 0&&n==="failed";return h`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${Ge(t)}</h1>
          <p class="ap-lead">${l}</p>
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
          ${i===void 0?h`<p class="ap-empty">${l}</p>`:s===void 0?this.renderAll(i,e):this.renderDevice(i,rt(i,s,t,this.search),e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${et(t,s,this.selecting&&s===void 0)}</span></div>
      </div>
    </div></div>`}renderAll(e,t){if(t.length>0&&O(e,this.kind).length===0){let s=this.mayMake;return h`<div class="ap-empty-lib">
        <p>${Ze(this.kind,s)}</p>
        ${s?h`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
          ${I("plus")}<span>New ${w(this.kind)}</span></button>`:b}
      </div>`}let i=M(e,this.kind,this.search,this.deviceKind,t);if(i.length===0)return h`<p class="ap-empty">${ft(t,this.search,this.deviceKind,this.kind)}</p>`;let n=this.waiting(e);return h`<div class="ap-grid" role="list">${i.map(s=>this.renderCard(e,s,t,n))}</div>`}renderHead(e,t,i){let n=this.selecting,s=this.bulkBusy!==void 0,o=w(this.kind,2);return h`<div class="pk-head">
      ${t===void 0?h`<button type="button" class="pk-pick-btn ${n?"on":""}" aria-pressed=${n?"true":"false"}
        title=${n?`Back to opening one ${w(this.kind)} at a time`:`Pick several ${o} to delete together`}
        ?disabled=${s||e===void 0} @click=${()=>n?this.endSelect():this.startSelect()}>
        ${I("checklist")}<span>Multi select</span></button>`:b}
      ${t===void 0&&e!==void 0&&nt(i)?this.renderKinds(e,i):b}
      <label class="pk-search">
        ${I("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${o}`}
          @input=${d=>this.setSearch(d.target.value)} />
      </label>
    </div>`}renderNew(e,t){let i=`New ${w(this.kind)}`;if(e!==void 0)return h`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${F(this.kind)} on ${e.name}`}
          @click=${()=>this.newPage(e)}>
          ${I("plus")}<span>${i}</span></button>
      </div>`;let n=this.mayMake,s=this.newForm!==void 0;return h`<div class="ap-new">
      <button type="button" class="ap-new-btn ${s?"on":""}" aria-expanded=${s?"true":"false"}
        ?disabled=${!n||this.newForm?.busy===!0}
        title=${n?`Make ${F(this.kind)} no device has yet`:Xe(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${I("plus")}<span>${i}</span></button>
    </div>`}renderNewDialog(e,t){return xt(this.kind,e,te(t),{onName:i=>{this.newForm={...e,name:i}},onPreview:i=>{this.newForm={...e,preview:i}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}})}renderKinds(e,t){let i=this.deviceKind,n=at(M(e,this.kind,this.search,"all",t),t);return h`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label=${`Show the ${w(this.kind,2)} on one kind of device`} .value=${i}
        @change=${s=>this.setDeviceKind(s.target.value)}>
        ${n.map(s=>h`<option value=${s.key} ?selected=${s.key===i}>${s.label} (${s.count})</option>`)}
      </select>
    </label>`}renderTabs(e,t,i){return h`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${tt(e,t,this.kind,this.colorOf).map(n=>h`<button type="button" role="tab" class="pk-tab ${n.id===i?"on":""}"
        style=${n.color===void 0?b:`--dc:${n.color}`} id=${`ap-tab-${n.id}`} aria-selected=${n.id===i?"true":"false"}
        title=${n.id===D?`Every ${w(this.kind)} in your home`:`The ${w(this.kind,2)} on ${n.label}`}
        @click=${()=>this.setFilter(n.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${I(n.kind===void 0?"grid":n.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${n.label}</span>
        <span class="pk-tab-count">${n.count}</span>
      </button>`)}
    </div>`}renderCardTicks(e,t,i,n,s){let o=this.lib.store,d=$(t),c=o?.noteFor(t.kind,t.id),l=c===void 0?this.tickNotes.get(d):{kind:"warn",text:c},u=this.untickAsk,p=u!==void 0&&u.kind===t.kind&&x(u.itemId,t.id)?u:void 0,f=this.hassNow?.user?.is_admin,P=t.kind==="pages"?Fe(t.item):[];return qe({library:e,kind:t.kind,itemId:t.id,devices:i,colorOf:this.colorOf,skips:P,...o===void 0?{}:{pending:o.pending},...l===void 0?{}:{note:l.text,noteKind:l.kind},...p===void 0?{}:{ask:{ownerId:p.ownerId,text:p.text,onRemove:()=>{this.untickNow(p)},onCancel:()=>{this.untickAsk=void 0}}},...f===void 0?{}:{admin:f},...s===void 0?{}:{addFor:s},locked:v=>{let g=Ke(e,v,t.kind,t.id);if(g&&B(v,t.kind))return Z(t.kind,i.find(R=>R.ownerId===v)?.name??"This device");if(!g&&n.has(v))return Pe}},(v,g)=>{this.tick(t,v,g)})}renderCard(e,t,i,n){let s=this.selecting,o=$(t),d=s&&this.selected.has(o),c=_(t,D,this.deviceKind,i),l=s?`${d?"Let":"Pick"} ${t.name}${d?" go":""}`:c===void 0?q(t.name):`Edit ${t.name} on ${c.name}`,u=p=>this.cardClick(p,t);return h`<div class="ap-card ${s?"picking":""} ${d?"picked":""}" role="listitem" data-card=${o}
      @click=${p=>{s&&u(p)}}>
      <div class="ap-top">
        ${s?h`<input type="checkbox" class="pk-card-pick" .checked=${pe(d)} ?disabled=${this.bulkBusy!==void 0}
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
    </div>`}renderDevice(e,t,i){let{device:n}=t,s=this.orderAsked,o=s!==void 0&&s.ownerId===n.ownerId&&s.kind===this.kind?s.ids:void 0,d=ot(t.picks,o),c=d.map(v=>v.id),l=U(e,n.ownerId,this.kind),u=this.search.trim()===""&&!this.picksBusy,p=this.kind==="pages"&&this.freeFacts.get(n.ownerId)===!0&&l>1?H([n.name]):void 0,f=this.waiting(e),P=this.kind==="pages"?j(V(e,n.ownerId)):void 0;return h`<div class="lt-view">
      <div class="lt-sect"><span>${J(n)} <small>${l}</small></span><span class="lt-sect-r">${lt(n)}</span></div>
      ${this.picksNote===void 0?b:h`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${d.length===0?h`<div class="lt-list"><p class="lt-empty">${ut(n,this.kind,this.search,t.rest.length,this.mayMake)}</p></div>`:h`<div class="lt-list" role="list" aria-label=${J(n)}>${d.map((v,g)=>this.renderRow(v,g,c,n,i,u,P))}</div>`}
      ${p===void 0?b:h`<p class="lt-line">${p}</p>`}
      <div class="lt-sect"><span>${pt(n)} <small>${t.rest.length}</small></span><span class="lt-sect-r">${ht(w(this.kind,2))}</span></div>
      ${t.rest.length===0?h`<p class="lt-line">${this.search.trim()===""?`Every ${w(this.kind)} in your library is on ${n.name}.`:`No other ${w(this.kind)} has that name.`}</p>`:h`<div class="ap-grid" role="list">${t.rest.map(v=>this.renderRest(e,v,n,i,f))}</div>`}
    </div>`}renderRow(e,t,i,n,s,o,d){let c=Ht(n.ownerId,e.id),l=this.hiddenAsked.get(c)??e.hidden,u=this.kind==="status_pages",p=Oe({...e,hidden:l},n.ownerId,s),f=this.overId!==void 0&&x(this.overId,e.id)&&this.dragId!==void 0&&!x(this.dragId,e.id),P=f&&i.findIndex(g=>x(g,this.dragId))<t,v=g=>{g!==void 0&&this.changePicks(n,{id:e.id,before:g},[...i])};return h`<div class="lt-row ${l?"hid":""} ${f?"drag-over":""} ${P?"below":""} ${this.dragId!==void 0&&x(this.dragId,e.id)?"dragging":""}"
      role="listitem" data-id=${e.id} draggable=${o?"true":"false"} tabindex="-1"
      @dragstart=${g=>{o&&(this.dragId=e.id,g.dataTransfer?.setData("text/plain",e.id),g.dataTransfer&&(g.dataTransfer.effectAllowed="move"))}}
      @dragover=${g=>{this.dragId!==void 0&&(g.preventDefault(),this.overId!==e.id&&(this.overId=e.id))}}
      @drop=${g=>{g.preventDefault();let R=this.dragId;this.dragId=void 0,this.overId=void 0;let se=R===void 0?void 0:dt(i,R,e.id);se!==void 0&&this.changePicks(n,se,[...i])}}
      @dragend=${()=>{this.dragId=void 0,this.overId=void 0}}
      @keydown=${g=>{!g.altKey||!o||g.key!=="ArrowUp"&&g.key!=="ArrowDown"||(g.preventDefault(),g.key==="ArrowUp"?v(t>0?i[t-1]:void 0):v(t<i.length-1?i[t+2]??null:void 0))}}>
      <span class="lt-grip" aria-hidden="true" title=${o?"Drag to order":""}>${I("grip")}</span>
      <button type="button" class="lt-row-open" title=${`Edit ${e.entry.name} on ${n.name}. Alt+Up or Alt+Down moves it.`}
        @click=${()=>this.open(e.entry,n)}>
        ${u?G({page:e.entry.item,hass:this.hassNow,...this.icons===void 0?{}:{icons:this.icons},tick:this.iconsTick}):X({page:e.entry.item,iphone:n.kind==="iphone",tick:this.iconsTick,...d===void 0?{}:{pages:d},...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}})}
        <span class="lt-row-nm"><span class="lt-row-n">${e.entry.name}</span><span class="lt-row-m">${p}</span></span>
      </button>
      ${u?b:h`<button type="button" class="lt-eye" ?disabled=${this.picksBusy}
        title=${l?`Show ${e.entry.name} on ${n.name} again`:`Keep ${e.entry.name} on ${n.name} without showing it`}
        @click=${()=>{this.changePicks(n,{id:e.id,hidden:!l})}}>${l?"Show here":"Hide here"}</button>`}
    </div>`}renderRest(e,t,i,n,s){let o=_(t,D,"all",n),d=o===void 0?q(t.name):`Edit ${t.name} on ${o.name}`,c=t.kind==="status_pages"?G({page:t.item,hass:this.hassNow,width:Y,tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}}):X({page:t.item,width:Y,tick:this.iconsTick,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}});return h`<div class="ap-card lt-dim" role="listitem" data-card=${$(t)}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${d} @click=${()=>this.open(t)}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${z(t)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb lt-thumb-sm" tabindex="-1" aria-hidden="true" title=${d} @click=${()=>this.open(t)}>${c}</button>
      ${this.renderCardTicks(e,t,n,s,i.ownerId)}
    </div>`}renderBar(e){let t=this.shownNow(),i=t.filter(p=>this.selected.has($(p))),n=i.length,s=this.bulkBusy!==void 0,o=n===0,d=t.length>0&&t.every(p=>this.selected.has($(p))),c=s?void 0:this.bulkNote,l=w(this.kind),u=w(this.kind,2);return h`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${u}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(o?`Pick ${F(this.kind)} to start.`:`${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${s||t.length===0}
        title=${d?`Let the ${u} on screen go`:`Pick every ${l} the search and the Device menu have left`}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${c===void 0?b:h`<span class="pk-bar-said ${c.kind}">${c.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!o?this.renderDeleteAsk(i,e):h`<button type="button" class="ghost danger small" ?disabled=${s||o}
            title=${`Delete these ${u} from the library, and from every device they are on`}
            @click=${()=>this.toggleAsk()}>${I("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${s}
        title=${`Stop picking and go back to opening one ${l} at a time`}
        @click=${()=>this.endSelect()}>${I("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let i=Q(e,t,B),n=Kt(i,t);return h`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${i.items.length===0}
        @click=${()=>{this.runDelete()}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,i){let n=t.item,s=i===void 0?[]:j(V(e,i.ownerId)),o=s.length===0?[n]:s,d=this.hassNow?.states,c=this.icons,l=A/L.width,u=Jt(n,d,c),p=u.height*l,f=p>ee,P=v=>`${Math.round(v*100)/100}px`;return h`<span class="ap-pic ${f?"cut":""}" style=${`width:${P(A)};height:${P(Math.min(p,ee))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${P(-u.top*l)})`}>${Be({page:n,pages:o,screen:L,scale:l,...d===void 0?{}:{states:d},...c===void 0?{}:{icons:c}})}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,i=A/L.width,n=d=>`${Math.round(d*100)/100}px`,o=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return h`<span class="ap-pic ap-pic-status ${o?"cut":""}" style=${`width:${n(A)};height:${n(Math.min(L.height*i,ee))}`}>
      <span class="ap-pic-in">${t===void 0?b:Ve({page:e.item,hass:t,icons:this.icons??ke,screen:L,scale:i})}</span>
    </span>`}static{this.styles=[He,we,Ue,St,Nt,Je,$t,Pt,ae`
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
  `]}};m([N({attribute:!1})],k.prototype,"kind",2),m([N({attribute:!1})],k.prototype,"owners",2),m([N({attribute:!1})],k.prototype,"ownersReady",2),m([N({attribute:!1})],k.prototype,"phones",2),m([N({attribute:!1})],k.prototype,"icons",2),m([N({attribute:!1})],k.prototype,"iconsTick",2),m([N({attribute:!1})],k.prototype,"onOpen",2),m([N({attribute:!1})],k.prototype,"onOpenLibrary",2),m([y()],k.prototype,"search",2),m([y()],k.prototype,"newForm",2),m([y()],k.prototype,"selecting",2),m([y()],k.prototype,"selected",2),m([y()],k.prototype,"asking",2),m([y()],k.prototype,"bulkBusy",2),m([y()],k.prototype,"bulkNote",2),m([y()],k.prototype,"tickNotes",2),m([y()],k.prototype,"untickAsk",2),m([y()],k.prototype,"picksBusy",2),m([y()],k.prototype,"picksNote",2),m([y()],k.prototype,"orderAsked",2),m([y()],k.prototype,"hiddenAsked",2),m([y()],k.prototype,"dragId",2),m([y()],k.prototype,"overId",2),m([y()],k.prototype,"freeFacts",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",k);export{k as WaAllPages,Jt as pageCrop};
