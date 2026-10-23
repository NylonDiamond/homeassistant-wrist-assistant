import{A as wt,B as bt,a as et,b as tt,c as it,d as g,e as M,f as nt,g as G,h as st,i as rt,j as at,k as Q,l as ot,m as dt,o as K,p as ct,q as pt,r as ht,s as lt,t as ut,u as Z,v as kt,w as ft,x as mt,y as gt,z as _}from"./chunk-3QFFEO65.js";import{a as Ge,b as Qe,d as Ze}from"./chunk-IDRIYP6B.js";import{a as Y,b as A,c as Ke,d as X,f as Ve}from"./chunk-LJMNIFXU.js";import{Aa as Ce,Ha as Re,la as Le,ma as Te,va as De,za as Pe}from"./chunk-UP2RXHXF.js";import{Ka as Ne}from"./chunk-DTPO6VPG.js";import{b as Ue}from"./chunk-3TRJTAGT.js";import{i as Be,l as Fe}from"./chunk-IRVQ6DIO.js";import{c as J,d as _e}from"./chunk-4LA5GLEP.js";import"./chunk-EZBAYVAE.js";import{b as Oe,c as Ae,e as Me,f as He,g as ze,h as We,i as je,j as qe,k as Ye,l as Xe,v as Je}from"./chunk-Y72Z32DK.js";import{E as ve,F as q,ea as N,f as W,ga as P,la as ye,ma as $e,na as xe,sa as Ie,ta as O,va as Ee}from"./chunk-Q7P4ZXXI.js";import"./chunk-AVBR4GPJ.js";import"./chunk-22W7NJDO.js";import"./chunk-MO3OAS73.js";import"./chunk-SF4C76H6.js";import{a as fe,b as me,c as D,e as ge,f as we,g as E}from"./chunk-P3S4W6I4.js";import"./chunk-ZOJGMATP.js";import{b as ue,c as ke}from"./chunk-RZEK6ZG7.js";import{b as Se}from"./chunk-DBIWFKAB.js";import{c as oe}from"./chunk-SV3BTW33.js";import{I as le,k as he}from"./chunk-F7MBUB5U.js";import{Eg as ae,Ge as z,b as se,d as h,g as y,j as re,k as I,l as b,nh as S}from"./chunk-BDP52PL7.js";import"./chunk-IAW54OVM.js";import{g as be,h as j}from"./chunk-VFWRBV7O.js";import{l as de,m as ce,r as pe}from"./chunk-Y7NZKWQC.js";import{Xa as F}from"./chunk-TGJNCNIU.js";import{a as u}from"./chunk-LO2NM3CE.js";function vt(d,p){let e=new Set(d);return e.has(p)?e.delete(p):e.add(p),e}function yt(d,p,e,t){let i=new Set(d),n=p.indexOf(t),s=e===void 0?-1:p.indexOf(e);if(n<0)return i;if(s<0)return i.add(t),i;for(let r=Math.min(s,n);r<=Math.max(s,n);r++)i.add(p[r]);return i}function $t(d,p){return new Set([...d,...p])}function xt(d,p){let e=new Set(p);return new Set([...d].filter(t=>!e.has(t)))}function It(d,p){let e=new Set(p);return new Set([...d].filter(t=>e.has(t)))}function $(d){return d.id.toUpperCase()}function ee(d,p,e){let i={kind:d[0]?.kind??"pages",items:[],kept:[],devices:[]},n=new Set;for(let s of d){let r=p.filter(a=>s.owners.some(c=>N(c,a.ownerId))).map(a=>a.ownerId),o=r.filter(a=>e(a,s.kind));if(o.length>0){i.kept.push({name:s.name,dirty:o});continue}i.items.push({id:s.id,name:s.name,owners:[...s.owners]});for(let a of r)n.add(a)}return i.devices=p.map(s=>s.ownerId).filter(s=>n.has(s)),i}var C=(d,p)=>d.find(e=>N(e.ownerId,p))?.name??"a device";function St(d,p){let e=d.items.length,t=e===1?"it":"them",i=`Delete ${e} ${g(d.kind,e)}?`,n=d.devices.map(o=>C(p,o)),s=d.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,r=[n.length===0?`${e===1?"It is":"They are"} on no device yet. This cannot be undone.`:`${e===1?"It comes":"They come"} off ${D(n)}, ${s}. This cannot be undone.`];for(let o of d.kept){let a=o.dirty.map(c=>C(p,c));r.push(`${o.name} stays: ${D(a)} ${a.length===1?"has":"have"} unsaved edits.`)}return{title:i,body:r.join(" ")}}async function Nt(d,p,e,t){let i={kind:p.kind,gone:[],kept:p.kept.map(s=>({...s,dirty:[...s.dirty]})),failed:[],stuck:[],taps:[]},n=new Map;for(let[s,r]of p.items.entries()){t?.(`Deleting ${r.name} (${s+1} of ${p.items.length})\u2026`);let o=await d.delete(p.kind,r.id);if(!o.ok){i.failed.push({name:r.name,text:o.text});continue}i.gone.push(r.name);for(let a of o.reply.link_failures??[]){let c=a.name??C(e,a.owner);i.stuck.includes(c)||i.stuck.push(c)}for(let a of r.owners)n.set(a,[...n.get(a)??[],r.id])}if(p.kind==="pages")for(let[s,r]of n){t?.(`Clearing complication taps on ${C(e,s)}\u2026`);let o=!1;try{o=await d.clearTaps(s,r)}catch{o=!1}o||i.taps.push(C(e,s))}return i}function Lt(d){let p=n=>`${n} ${g(d.kind,n)}`,e=[];d.gone.length>0&&e.push(`Deleted ${d.gone.length===1?d.gone[0]:p(d.gone.length)}.`);let t=e.length>0,i=!1;for(let n of d.kept)i=!0,e.push(`Kept ${n.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let n of d.failed)i=!0,e.push(`Not deleted: ${n.name}. ${n.text}`);return d.stuck.length>0&&(i=!0,e.push(`Could not take ${d.gone.length===1?"it":"them"} off ${D(d.stuck)}.`)),d.taps.length>0&&(i=!0,e.push(`Could not clear the complication taps that opened ${d.gone.length===1?"it":"them"} on ${D(d.taps)}. Change those by hand.`)),!t&&!i?{kind:"ok",text:"Nothing was deleted."}:{kind:i?t?"warn":"err":"ok",text:e.join(" ")}}var V=200,te=320,Tt=6,T=le.screen;function Bt(d,p,e,t=T){if(pe(d))return{top:0,height:t.height};let i=Le(Te(d,p),t),n=[...i.tiles,...Ce(d,t,{states:p})];if(n.length===0)return{top:0,height:t.height};let r=De(d,1,i.topInset,e)!==y?0:Math.max(0,i.topInset+Math.min(...n.map(a=>a.y))-Tt),o=i.topInset+Math.max(...n.map(a=>a.y+a.height))+Tt;return{top:r,height:Math.max(1,o-r)}}var Ft=2e3,Dt=44,Et=28,Ct={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"};function ie(d){return["watch","iphone"].filter(p=>d.some(e=>e.kind===p))}var ne=new Map;function Rt(d){let p=ne.get(d);if(p!==void 0)return p;let e={view:"board"};try{let t=window.localStorage.getItem(Ct[d]);(t?JSON.parse(t):{}).view==="cards"&&(e.view="cards")}catch{}return ne.set(d,e),e}function Ot(d,p){let e={...Rt(d),...p};ne.set(d,e);try{window.localStorage.setItem(Ct[d],JSON.stringify(e))}catch{}}var R=(d,p="pages")=>(p==="status_pages"?Ue(d)?.dirty:Ve(d)?.dirty)??!1,Pt=(d,p)=>`${d}|${p.toUpperCase()}`,l=class extends re{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.saved=!1;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new Ee(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.roomy=new We(this);this.colorsFor=ke();this.colorOf=e=>ue(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let i=Date.now();(t||i-this.hassDrawnAt>=Ft)&&(this.hassDrawnAt=i,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){if(e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged(),e.has("focusOwner")&&this.focusOwner!==void 0&&this.endSelect(!0),this.embedded&&e.has("searchText")&&(this.search=this.searchText),this.kind==="pages")for(let t of this.devices)this.freeAsked.has(t.ownerId)||this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return dt(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===ot?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.embedded||this.filterDevice()!==void 0?"board":Rt(this.kind).view}get devices(){return fe(this.owners,this.phones)}waiting(e){let t=new Map;for(let i of this.devices)t.set(i.ownerId,{held:$e(e,i.ownerId,this.kind),free:!1});return we(this.owners,t)}setFocus(e){e!==void 0&&this.endSelect(!0),this.picksNote=void 0,this.onFocus?.(e)}setView(e){Ot(this.kind,{view:e}),e==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},ze)}setSearch(e){this.search=e,this.pruneSelected()}async newPage(e){let t=this.hassNow,i=this.lib.store;if(t===void 0||i===void 0||this.picksBusy)return;this.newForm=void 0;let n=this.kind;if(R(e.ownerId,n)){this.picksNote={kind:"warn",text:A(n,e.name)};return}let s=z(),r=this.nextCardName(),o=n==="status_pages"?q(r,s):j(s,r);this.picksBusy=!0,this.picksNote=void 0;let a=!1;try{let c=await Y(X(t),e.ownerId,n,{add:o});a=c.ok&&c.changed,c.ok||(this.picksNote={kind:"err",text:`Not made on ${e.name}. ${c.message}`})}catch(c){this.picksNote={kind:"err",text:F(c).message}}await i.refresh(),this.picksBusy=!1,a&&this.onOpenLibrary?.(n,s,e.ownerId)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!this.newForm?.busy){if(this.newForm!==void 0){this.newForm=void 0;return}this.newForm={name:this.nextCardName(),busy:!1,preview:ie(this.devices)[0]},this.updateComplete.then(()=>tt(this.renderRoot))}}nextCardName(){let e=this.lib.library,t=e===void 0?[]:P(e,this.kind).map(i=>i.item);return this.kind==="status_pages"?ve({schemaVersion:1,statusPages:t}):be({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let i=e.name.trim();if(i===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${g(this.kind)} a name.`}};return}let{note:n,...s}=e;this.newForm={...s,busy:!0};let r=z(),o=this.kind==="status_pages"?{schemaVersion:1,statusPages:[q(i,r)]}:{schemaVersion:1,pages:[j(r,i)]},a=await t.createItem(this.kind,o);if(!a.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${a.text}`}};return}this.newForm=void 0,Je(e.preview??ie(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,a.reply.id)}open(e){this.onOpenLibrary?.(e.kind,e.id,this.focusOwner)}async tick(e,t,i){let n=this.lib.store;if(n===void 0)return;if(this.dropTickNote($(e)),this.untickAsk=void 0,!i){let k={item:e.name,device:this.devices.find(w=>w.ownerId===t)?.name??"the device"};this.untickAsk=await _e(this.hassNow,n,t,e.kind,e.id,k),this.untickAsk===void 0&&n.noteFor(e.kind,e.id)===void 0&&this.flashSaved();return}let s=$(e),r=await J(this.hassNow,n,t,e.kind,e.id,!0);if(r.ok&&this.flashSaved(),!r.ok||e.kind!=="pages")return;let o=await this.readFree(t),a=this.lib.library,c=this.devices.find(k=>k.ownerId===t)?.name;if(!o||a===void 0||c===void 0||O(a,t,"pages")<2)return;let f=E([c]);f!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(s,{kind:"warn",text:`Added to ${c}. ${f}`}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let i=await J(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names);i.ok&&this.flashSaved(),i.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set($({id:e.itemId}),i.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let n=(await ae(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==n&&(this.freeFacts=new Map(this.freeFacts).set(e,n)),n}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,i){let n=this.hassNow,s=this.lib.store;if(n===void 0||s===void 0||this.picksBusy)return;let r=this.kind;if(R(e.ownerId,r)){this.picksNote={kind:"warn",text:A(r,e.name)};return}let o=this.kindSeq,a="hidden"in t,c=Pt(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,a?this.hiddenAsked=new Map(this.hiddenAsked).set(c,t.hidden):i!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:r,ids:lt(i,t.id,t.before)});let f=this.orderAsked,k;try{let w=await Y(X(n),e.ownerId,r,t);w.ok&&this.flashSaved(),w.ok||(k={kind:"err",text:`${a?"Not changed":"Not moved"} on ${e.name}: ${w.message.replace(/\.$/,"")}.`})}catch(w){k={kind:"err",text:F(w).message}}if(await s.refresh(),this.picksBusy=!1,a){let w=new Map(this.hiddenAsked);w.delete(c),this.hiddenAsked=w}else this.orderAsked===f&&(this.orderAsked=void 0);o===this.kindSeq&&(this.picksNote=k)}shownNow(){let e=this.lib.library;return e===void 0?[]:K(e,this.kind,this.search)}pickedItems(){return this.shownNow().filter(e=>this.selected.has($(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=It(this.selected,this.shownNow().map($)))}startSelect(){this.selecting=!0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let i=$(e);this.selected=t?yt(this.selected,this.shownNow().map($),this.anchor,i):vt(this.selected,i),this.anchor=i,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map($);this.selected=e?$t(this.selected,t):xt(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}async runDelete(){let e=this.hassNow,t=this.lib.store;if(e===void 0||t===void 0||this.bulkBusy!==void 0)return;let i=this.pickedItems();if(i.length===0)return;let n=this.kindSeq,s=this.devices;this.asking=!1,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let r;try{let o=await Nt(Ke(e),ee(i,s,R),s,a=>{this.bulkBusy=a});r=Lt(o)}catch(o){r={kind:"err",text:F(o).message}}this.bulkBusy="Reading the library again\u2026";try{await t.refresh()}finally{this.bulkBusy=void 0}n===this.kindSeq&&(this.pruneSelected(),this.anchor=void 0,this.bulkNote=r)}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return h`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let t=this.kind,i=this.lib.library,n=this.lib.readState,s=this.filterDevice(),r=g(t,2),o=this.view,a=i===void 0?n==="unsupported"?W:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${r}\u2026`:st(P(i,t).length,t),c=i!==void 0&&n==="failed";return h`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${G(t)}</h1>
          <p class="ap-lead">${a}</p>
        </div>
        ${e.length===0?y:this.renderNew(s,e)}
      </div>
      ${this.newForm===void 0?y:this.renderNewDialog(this.newForm,e)}
      ${c?h`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:y}
      <div class="pk-surface pk-page" role="region" aria-label=${`Your ${r}`}>
        <div class="pk-pin">
          ${this.renderHead(i,s,o)}
          ${this.selecting&&s===void 0?this.renderBar(e):y}
        </div>
        <div class="pk-body">
          ${i===void 0?h`<p class="ap-empty">${a}</p>`:s!==void 0?this.renderFocus(i,ct(i,s,t,this.search),e):o==="board"?this.renderBoardAll(i,e):this.renderAll(i,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${at(t,s,this.selecting&&s===void 0,o)}</span></div>
      </div>
    </div></div>`}renderEmbedded(){let e=this.lib.library,t=this.devices,i=g(this.kind,2),n=this.lib.readState;if(e===void 0){let r=n==="unsupported"?W:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${i}\u2026`;return h`<p class="ap-empty">${r}</p>`}if(t.length===0)return h`<p class="ap-empty">No device can have ${i}.</p>`;let s=P(e,this.kind).length===0?h`<p class="ap-empty">No ${i} yet.</p>`:this.renderBoardAll(e,t);return h`${this.saved?h`<span class="bd-saved ap-embed-saved" role="status">${S("check")}<span>Saved</span></span>`:y}${s}`}renderAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;let n=K(e,this.kind,this.search);if(n.length===0)return h`<p class="ap-empty">${_(t,this.search,this.kind)}</p>`;let s=this.waiting(e);return h`<div class="ap-grid" role="list">${n.map(r=>this.renderCard(e,r,t,s))}</div>`}renderEmptyLibrary(e,t){if(t.length===0||P(e,this.kind).length>0)return;let i=this.mayMake;return h`<div class="ap-empty-lib">
      <p>${rt(this.kind,i)}</p>
      ${i?h`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
        ${S("plus")}<span>New ${g(this.kind)}</span></button>`:y}
    </div>`}renderHead(e,t,i){let n=this.selecting,s=this.bulkBusy!==void 0,r=g(this.kind,2);return h`<div class="pk-head">
      ${t===void 0?h`<button type="button" class="pk-pick-btn ${n?"on":""}" aria-pressed=${n?"true":"false"}
        title=${n?`Back to opening one ${g(this.kind)} at a time`:`Pick several ${r} to delete together`}
        ?disabled=${s||e===void 0} @click=${()=>n?this.endSelect():this.startSelect()}>
        ${S("checklist")}<span>Multi select</span></button>`:y}
      ${je(i,o=>this.setView(o),r)}
      ${this.saved?h`<span class="bd-saved" role="status">${S("check")}<span>Saved</span></span>`:y}
      <label class="pk-search">
        ${S("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${r}`}
          @input=${o=>this.setSearch(o.target.value)} />
      </label>
    </div>`}renderNew(e,t){let i=`New ${g(this.kind)}`;if(e!==void 0)return h`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${M(this.kind)} on ${e.name}`}
          ?disabled=${this.picksBusy} @click=${()=>{this.newPage(e)}}>
          ${S("plus")}<span>${i}</span></button>
      </div>`;let n=this.mayMake,s=this.newForm!==void 0;return h`<div class="ap-new">
      <button type="button" class="ap-new-btn ${s?"on":""}" aria-expanded=${s?"true":"false"}
        ?disabled=${!n||this.newForm?.busy===!0}
        title=${n?`Make ${M(this.kind)} no device has yet`:nt(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${S("plus")}<span>${i}</span></button>
    </div>`}renderNewDialog(e,t){return et(this.kind,e,ie(t),{onName:i=>{this.newForm={...e,name:i}},onPreview:i=>{this.newForm={...e,preview:i}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}})}ticksInput(e,t,i,n){let s=this.lib.store,r=$(t),o=s?.noteFor(t.kind,t.id),a=o===void 0?this.tickNotes.get(r):{kind:"warn",text:o},c=this.untickAsk,f=c!==void 0&&c.kind===t.kind&&N(c.itemId,t.id)?c:void 0,k=this.hassNow?.user?.is_admin,w=t.kind==="pages"?Ne(t.item):[];return{library:e,kind:t.kind,itemId:t.id,devices:i,colorOf:this.colorOf,skips:w,...s===void 0?{}:{pending:s.pending},...a===void 0?{}:{note:a.text,noteKind:a.kind},...f===void 0?{}:{ask:{ownerId:f.ownerId,text:f.text,onRemove:()=>{this.untickNow(f)},onCancel:()=>{this.untickAsk=void 0}}},...k===void 0?{}:{admin:k},locked:x=>{let L=ye(e,x,t.kind,t.id);if(L&&R(x,t.kind))return A(t.kind,i.find(m=>m.ownerId===x)?.name??"This device");if(!L&&n.has(x))return ge}}}renderCardTicks(e,t,i,n){return Ae(this.ticksInput(e,t,i,n),(s,r)=>{this.tick(t,s,r)})}renderCard(e,t,i,n){let s=this.selecting,r=$(t),o=s&&this.selected.has(r),a=ut(t,i),c=this.openTitle(t),f=k=>this.cardClick(k,t);return h`<div class="ap-card ${s?"picking":""} ${o?"picked":""}" role="listitem" data-card=${r}
      @click=${k=>{s&&f(k)}}>
      <div class="ap-top">
        ${s?h`<input type="checkbox" class="pk-card-pick" .checked=${he(o)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${c}
          @click=${k=>{k.stopPropagation(),this.pick(t,k.shiftKey)}} />`:y}
        <button type="button" class="ap-open" title=${c} tabindex=${s?"-1":"0"} @click=${f}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${Q(t)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${c} @click=${f}>
        ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumb(e,t,a)}
      </button>
      ${this.renderCardTicks(e,t,i,n)}
    </div>`}openTitle(e){if(this.selecting){let t=this.selected.has($(e));return`${t?"Let":"Pick"} ${e.name}${t?" go":""}`}return Z(e.name)}boardColumns(e,t){return t.map(i=>({device:i,color:this.colorOf(i.ownerId),count:O(e,i.ownerId,this.kind)}))}renderBoardAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;if(t.length===0)return h`<p class="ap-empty">${_(t,this.search,this.kind)}</p>`;let n=this.waiting(e),s=K(e,this.kind,this.search);return this.renderBoardOf(e,t,[{key:"all",rows:s.map(r=>this.boardRow(e,r,t,n)),empty:_(t,this.search,this.kind)}])}renderBoardOf(e,t,i,n){let s=g(this.kind),r=g(this.kind,2);return qe({label:`${G(this.kind)} on each device`,thing:s.charAt(0).toUpperCase()+s.slice(1),columns:this.boardColumns(e,t),...n===void 0?{}:{focus:n},onFocus:o=>this.setFocus(o),wide:this.roomy.wide,focusWord:"Order",focusTitle:o=>`Show ${o.name}'s ${r} first, in its order`,sections:i})}boardRow(e,t,i,n,s){let r=this.ticksInput(e,t,i,n),o=Oe(r),a=t.kind==="pages"?t.item:void 0,c=a===void 0?0:ce(a).length,f=a!==void 0&&c>0&&(r.skips?.length??0)>=c,k=o.map(m=>{let v={chip:m,onPick:U=>{this.tick(t,m.ownerId,U)}};m.on&&m.device==="watch"&&f?(v.note="shows nothing",v.noteWarn=!0,v.noteTitle=`Every tile on ${t.name} is iPhone only, so ${m.name} shows an empty page.`):m.skips!==void 0&&(v.note=m.skips.text,v.noteTitle=m.skips.title);let B=this.freeNote(e,t,m.ownerId,m.name,m.on);if(B!==void 0&&v.note===void 0&&Object.assign(v,B),s?.pick!==void 0&&N(m.ownerId,s.device.ownerId)&&t.kind==="pages"){let U=Pt(s.device.ownerId,t.id),H=this.hiddenAsked.get(U)??s.pick.hidden;v.eye={hidden:H,busy:this.picksBusy,title:H?`Show ${t.name} on ${s.device.name} again`:`Hide here: keep ${t.name} on ${s.device.name} without showing it`,onToggle:()=>{this.changePicks(s.device,{id:t.id,hidden:!H})}}}return v}),w=this.selecting&&s===void 0,x=$(t),L={key:x,name:t.name,detail:Q(t),picture:this.rowPicture(t,s?.pick!==void 0?s.device:void 0),openTitle:s?.pick!==void 0?`${Z(t.name)}. Alt+Up or Alt+Down moves it.`:this.openTitle(t),onOpen:m=>{if(s?.pick!==void 0&&!m.metaKey&&!m.ctrlKey){this.open(t);return}this.cardClick(m,t)},cells:k,...s!==void 0&&s.pick===void 0?{dim:!0}:{},...s?.drag===void 0?{}:{drag:s.drag},...r.ask===void 0?{}:{ask:r.ask},...r.note===void 0?{}:{note:{text:r.note,kind:r.noteKind??"warn"}}};return w&&(L.select={picked:this.selected.has(x),disabled:this.bulkBusy!==void 0,label:this.openTitle(t),onPick:m=>this.pick(t,m.shiftKey)}),L}freeNote(e,t,i,n,s){if(t.kind!=="pages"||!s||this.freeFacts.get(i)!==!0)return;let r=xe(e,i,"pages").filter(a=>!a.hidden);if(r.length<2)return;let o=E([n]);return N(r[0].id,t.id)?{note:"1st page",...o===void 0?{}:{noteTitle:o}}:{note:"free: not shown",noteWarn:!0,...o===void 0?{}:{noteTitle:o}}}rowPicture(e,t){return e.kind==="status_pages"?Qe({page:e.item,hass:this.hassNow,width:this.roomy.size(Dt),tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}}):Ge({page:e.item,width:this.roomy.size(t?.kind==="iphone"?Et:Dt),tick:this.iconsTick,iphone:t?.kind==="iphone",...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}})}renderFocus(e,t,i){let{device:n}=t,s=this.orderAsked,r=s!==void 0&&s.ownerId===n.ownerId&&s.kind===this.kind?s.ids:void 0,o=pt(t.picks,r),a=o.map(v=>v.id),c=O(e,n.ownerId,this.kind),f=this.search.trim()===""&&!this.picksBusy,k=this.kind==="pages"&&this.freeFacts.get(n.ownerId)===!0&&c>1?E([n.name]):void 0,w=this.waiting(e),x=g(this.kind,2),L=o.map((v,B)=>this.boardRow(e,v.entry,i,w,{device:n,pick:v,drag:this.rowDrag(v,B,a,n,f)})),m=t.rest.map(v=>this.boardRow(e,v,i,w,{device:n}));return h`${this.renderFocusHead(n,c)}
      ${this.picksNote===void 0?y:h`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${k===void 0?y:h`<p class="lt-line">${k}</p>`}
      ${this.renderBoardOf(e,i,[{key:"on",title:kt(n),count:c,hint:ft(n),rows:L,empty:gt(n,this.kind,this.search,t.rest.length,this.mayMake)},{key:"rest",title:mt(n),count:t.rest.length,hint:`Tick its box under ${n.name} to add it.`,rows:m,empty:this.search.trim()===""?`Every ${g(this.kind)} in your home is on ${n.name}.`:`No other ${g(this.kind)} has that name.`}],n.ownerId)}
      <p class="lt-line bd-foot-line">${c} ${c===1?g(this.kind):x} on ${n.name}.</p>`}renderFocusHead(e,t){let i=me(e.kind),n=g(this.kind,t),s=e.kind==="watch"?["settings","rooms","voice"]:["settings","rooms"],r=this.colorOf(e.ownerId);return h`<div class="bd-focus" style=${r===void 0?y:`--dc:${r}`}>
      <span class="bd-focus-glyph" aria-hidden="true">${S(e.kind==="iphone"?"phone":"watch")}</span>
      <span class="bd-focus-t"><b>${e.name}</b> <span>${t} ${n}, in the order the ${i} ${this.kind==="pages"?"shows":"keeps"} them</span></span>
      ${this.onOpenScreen===void 0?y:h`<span class="bd-focus-own">Also on this ${i}:
        ${s.map(o=>h`<button type="button" class="bd-link" @click=${()=>this.onOpenScreen?.(e.ownerId,e.kind,o)}>${He[o]}</button>`)}</span>`}
      <button type="button" class="bd-focus-all" @click=${()=>this.setFocus(void 0)}>${S("grid")}<span>All devices</span></button>
    </div>`}rowDrag(e,t,i,n,s){let r=this.overId!==void 0&&N(this.overId,e.id)&&this.dragId!==void 0&&!N(this.dragId,e.id),o=a=>{a!==void 0&&this.changePicks(n,{id:e.id,before:a},[...i])};return{on:s,dragging:this.dragId!==void 0&&N(this.dragId,e.id),over:r,below:r&&i.findIndex(a=>N(a,this.dragId))<t,onStart:a=>{s&&(this.dragId=e.id,a.dataTransfer?.setData("text/plain",e.id),a.dataTransfer&&(a.dataTransfer.effectAllowed="move"))},onOver:a=>{this.dragId!==void 0&&(a.preventDefault(),this.overId!==e.id&&(this.overId=e.id))},onDrop:a=>{a.preventDefault();let c=this.dragId;this.dragId=void 0,this.overId=void 0;let f=c===void 0?void 0:ht(i,c,e.id);f!==void 0&&this.changePicks(n,f,[...i])},onEnd:()=>{this.dragId=void 0,this.overId=void 0},onKey:a=>{!a.altKey||!s||a.key!=="ArrowUp"&&a.key!=="ArrowDown"||(a.preventDefault(),a.key==="ArrowUp"?o(t>0?i[t-1]:void 0):o(t<i.length-1?i[t+2]??null:void 0))}}}renderBar(e){let t=this.shownNow(),i=t.filter(k=>this.selected.has($(k))),n=i.length,s=this.bulkBusy!==void 0,r=n===0,o=t.length>0&&t.every(k=>this.selected.has($(k))),a=s?void 0:this.bulkNote,c=g(this.kind),f=g(this.kind,2);return h`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${f}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?`Pick ${M(this.kind)} to start.`:`${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${s||t.length===0}
        title=${o?`Let the ${f} on screen go`:`Pick every ${c} the search has left`}
        @click=${()=>this.selectShown(!o)}>${o?"None":"All shown"}</button>
      ${a===void 0?y:h`<span class="pk-bar-said ${a.kind}">${a.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!r?this.renderDeleteAsk(i,e):h`<button type="button" class="ghost danger small" ?disabled=${s||r}
            title=${`Delete these ${f} from every device they are on`}
            @click=${()=>this.toggleAsk()}>${S("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${s}
        title=${`Stop picking and go back to opening one ${c} at a time`}
        @click=${()=>this.endSelect()}>${S("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let i=ee(e,t,R),n=St(i,t);return h`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${i.items.length===0}
        @click=${()=>{this.runDelete()}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,i){let n=t.item,s=i===void 0?[]:de(Ie(e,i.ownerId)),r=s.length===0?[n]:s,o=this.hassNow?.states,a=this.icons,c=V/T.width,f=Bt(n,o,a),k=f.height*c,w=k>te,x=L=>`${Math.round(L*100)/100}px`;return h`<span class="ap-pic ${w?"cut":""}" style=${`width:${x(V)};height:${x(Math.min(k,te))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${x(-f.top*c)})`}>${Pe({page:n,pages:r,screen:T,scale:c,...o===void 0?{}:{states:o},...a===void 0?{}:{icons:a}})}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,i=V/T.width,n=o=>`${Math.round(o*100)/100}px`,r=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return h`<span class="ap-pic ap-pic-status ${r?"cut":""}" style=${`width:${n(V)};height:${n(Math.min(T.height*i,te))}`}>
      <span class="ap-pic-in">${t===void 0?y:Be({page:e.item,hass:t,icons:this.icons??oe,screen:T,scale:i})}</span>
    </span>`}static{this.styles=[Re,Se,Fe,bt,wt,Me,Ze,it,Ye,Xe,se`
    .ap-embed-saved { position: absolute; right: 0; top: -26px; }
    :host([embedded]) { position: relative; }
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
  `]}};u([I({attribute:!1})],l.prototype,"kind",2),u([I({attribute:!1})],l.prototype,"owners",2),u([I({attribute:!1})],l.prototype,"ownersReady",2),u([I({attribute:!1})],l.prototype,"phones",2),u([I({attribute:!1})],l.prototype,"icons",2),u([I({attribute:!1})],l.prototype,"iconsTick",2),u([I({attribute:!1})],l.prototype,"onOpenLibrary",2),u([I({attribute:!1})],l.prototype,"focusOwner",2),u([I({attribute:!1})],l.prototype,"onFocus",2),u([I({attribute:!1})],l.prototype,"onOpenScreen",2),u([I({type:Boolean,reflect:!0})],l.prototype,"embedded",2),u([I({attribute:!1})],l.prototype,"searchText",2),u([b()],l.prototype,"search",2),u([b()],l.prototype,"newForm",2),u([b()],l.prototype,"selecting",2),u([b()],l.prototype,"selected",2),u([b()],l.prototype,"asking",2),u([b()],l.prototype,"bulkBusy",2),u([b()],l.prototype,"bulkNote",2),u([b()],l.prototype,"tickNotes",2),u([b()],l.prototype,"untickAsk",2),u([b()],l.prototype,"picksBusy",2),u([b()],l.prototype,"picksNote",2),u([b()],l.prototype,"orderAsked",2),u([b()],l.prototype,"hiddenAsked",2),u([b()],l.prototype,"dragId",2),u([b()],l.prototype,"overId",2),u([b()],l.prototype,"freeFacts",2),u([b()],l.prototype,"saved",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",l);export{l as WaAllPages,Bt as pageCrop};
