import{a as ft,b as mt,c as gt,d as wt,e as bt}from"./chunk-JZNSOGT3.js";import{a as Y,b as A,c as Ue,d as X}from"./chunk-M2HWUZXS.js";import{b as nt}from"./chunk-SZFVGPGO.js";import{b as st}from"./chunk-3BVM7DGC.js";import{i as J,j as He}from"./chunk-HMOC7TKP.js";import{C as _,D as Xe,E as Je,F as Ge,G as Qe,H as Z,I as ee,J as Ze,K as et,L as tt,N as it,O as V,P as ht,Q as ut,S as kt,m as Ee,p as Ae,q as g,r as M,s as ze,t as G,u as We,v as je,w as qe,x as Q,y as K,z as Ye}from"./chunk-LEB2RL37.js";import"./chunk-6U6YWHFQ.js";import{Ba as Ve,Ca as rt,Da as at,Ea as ot,F as Ie,Fa as dt,G as q,Ga as ct,Ha as pt,Oa as lt,e as we,ha as S,ja as O,oa as Ne,pa as Se,qa as Le,va as Te,wa as E,xa as Me,ya as Ke,za as _e}from"./chunk-O3NWHL3Q.js";import"./chunk-CKIFX3N2.js";import{B as Be,C as Fe,J as Oe,n as Pe,o as Ce,x as Re}from"./chunk-N7GITRH7.js";import{ab as De}from"./chunk-3XQHAZJT.js";import{a as be,b as ve,c as P,f as ye,g as $e,h as F}from"./chunk-XF6VR4HJ.js";import"./chunk-RQWXLJYE.js";import"./chunk-ZOJGMATP.js";import"./chunk-27VXOWKT.js";import{g as xe,h as j}from"./chunk-CHKZKW42.js";import{b as le,c as he,e as ge}from"./chunk-KBXFS4SO.js";import{c as ue}from"./chunk-SV3BTW33.js";import{U as pe,w as ce}from"./chunk-EABJ5TYD.js";import{l as ke,m as fe,r as me}from"./chunk-TUSU5T3G.js";import{Eg as de,Ge as W,b as ae,d as u,g as v,j as oe,k as I,l as b,nh as N}from"./chunk-BDP52PL7.js";import{Xa as B}from"./chunk-TGJNCNIU.js";import{a as k}from"./chunk-LO2NM3CE.js";function vt(d,p){let e=new Set(d);return e.has(p)?e.delete(p):e.add(p),e}function yt(d,p,e,t){let i=new Set(d),s=p.indexOf(t),n=e===void 0?-1:p.indexOf(e);if(s<0)return i;if(n<0)return i.add(t),i;for(let r=Math.min(n,s);r<=Math.max(n,s);r++)i.add(p[r]);return i}function $t(d,p){return new Set([...d,...p])}function xt(d,p){let e=new Set(p);return new Set([...d].filter(t=>!e.has(t)))}function It(d,p){let e=new Set(p);return new Set([...d].filter(t=>e.has(t)))}function y(d){return d.id.toUpperCase()}function te(d,p,e){let i={kind:d[0]?.kind??"pages",items:[],kept:[],devices:[]},s=new Set;for(let n of d){let r=p.filter(a=>n.owners.some(c=>S(c,a.ownerId))).map(a=>a.ownerId),o=r.filter(a=>e(a,n.kind));if(o.length>0){i.kept.push({name:n.name,dirty:o});continue}i.items.push({id:n.id,name:n.name,owners:[...n.owners]});for(let a of r)s.add(a)}return i.devices=p.map(n=>n.ownerId).filter(n=>s.has(n)),i}var C=(d,p)=>d.find(e=>S(e.ownerId,p))?.name??"a device";function Nt(d,p){let e=d.items.length,t=e===1?"it":"them",i=`Delete ${e} ${g(d.kind,e)} from the library?`,s=d.devices.map(o=>C(p,o)),n=d.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,r=[s.length===0?`No device has ${t}. This cannot be undone.`:`${e===1?"It comes":"They come"} off ${P(s)}, ${n}. This cannot be undone.`];for(let o of d.kept){let a=o.dirty.map(c=>C(p,c));r.push(`${o.name} stays: ${P(a)} ${a.length===1?"has":"have"} unsaved edits.`)}return{title:i,body:r.join(" ")}}async function St(d,p,e,t){let i={kind:p.kind,gone:[],kept:p.kept.map(n=>({...n,dirty:[...n.dirty]})),failed:[],stuck:[],taps:[]},s=new Map;for(let[n,r]of p.items.entries()){t?.(`Deleting ${r.name} (${n+1} of ${p.items.length})\u2026`);let o=await d.delete(p.kind,r.id);if(!o.ok){i.failed.push({name:r.name,text:o.text});continue}i.gone.push(r.name);for(let a of o.reply.link_failures??[]){let c=a.name??C(e,a.owner);i.stuck.includes(c)||i.stuck.push(c)}for(let a of r.owners)s.set(a,[...s.get(a)??[],r.id])}if(p.kind==="pages")for(let[n,r]of s){t?.(`Clearing complication taps on ${C(e,n)}\u2026`);let o=!1;try{o=await d.clearTaps(n,r)}catch{o=!1}o||i.taps.push(C(e,n))}return i}function Lt(d){let p=s=>`${s} ${g(d.kind,s)}`,e=[];d.gone.length>0&&e.push(`Deleted ${d.gone.length===1?d.gone[0]:p(d.gone.length)}.`);let t=e.length>0,i=!1;for(let s of d.kept)i=!0,e.push(`Kept ${s.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let s of d.failed)i=!0,e.push(`Not deleted: ${s.name}. ${s.text}`);return d.stuck.length>0&&(i=!0,e.push(`Could not take ${d.gone.length===1?"it":"them"} off ${P(d.stuck)}.`)),d.taps.length>0&&(i=!0,e.push(`Could not clear the complication taps that opened ${d.gone.length===1?"it":"them"} on ${P(d.taps)}. Change those by hand.`)),!t&&!i?{kind:"ok",text:"Nothing was deleted."}:{kind:i?t?"warn":"err":"ok",text:e.join(" ")}}var U=200,ie=320,Tt=6,D=pe.screen;function Bt(d,p,e,t=D){if(me(d))return{top:0,height:t.height};let i=Pe(Ce(d,p),t),s=[...i.tiles,...Fe(d,t,{states:p})];if(s.length===0)return{top:0,height:t.height};let r=Re(d,1,i.topInset,e)!==v?0:Math.max(0,i.topInset+Math.min(...s.map(a=>a.y))-Tt),o=i.topInset+Math.max(...s.map(a=>a.y+a.height))+Tt;return{top:r,height:Math.max(1,o-r)}}var Ft=2e3,Dt=34,Ot=22,Ct={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"};function ne(d){return["watch","iphone"].filter(p=>d.some(e=>e.kind===p))}var se=new Map;function Rt(d){let p=se.get(d);if(p!==void 0)return p;let e={view:"board"};try{let t=window.localStorage.getItem(Ct[d]);(t?JSON.parse(t):{}).view==="cards"&&(e.view="cards")}catch{}return se.set(d,e),e}function Et(d,p){let e={...Rt(d),...p};se.set(d,e);try{window.localStorage.setItem(Ct[d],JSON.stringify(e))}catch{}}var R=(d,p="pages")=>(p==="status_pages"?st(d)?.dirty:nt(d)?.dirty)??!1,Pt=(d,p)=>`${d}|${p.toUpperCase()}`,l=class extends oe{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.search="";this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.saved=!1;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new Me(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.roomy=new ot(this);this.colorsFor=he();this.colorOf=e=>le(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let i=Date.now();(t||i-this.hassDrawnAt>=Ft)&&(this.hassDrawnAt=i,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){if(e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged(),e.has("focusOwner")&&this.focusOwner!==void 0&&this.endSelect(!0),this.kind==="pages")for(let t of this.devices)this.freeAsked.has(t.ownerId)||this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return Ye(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===K?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.filterDevice()!==void 0?"board":Rt(this.kind).view}get devices(){return be(this.owners,this.phones)}waiting(e){let t=new Map;for(let i of this.devices)t.set(i.ownerId,{held:Se(e,i.ownerId,this.kind),free:!1});return $e(this.owners,t)}setFocus(e){e!==void 0&&this.endSelect(!0),this.picksNote=void 0,this.onFocus?.(e)}setView(e){Et(this.kind,{view:e}),e==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},at)}setSearch(e){this.search=e,this.pruneSelected()}async newPage(e){let t=this.hassNow,i=this.lib.store;if(t===void 0||i===void 0||this.picksBusy)return;this.newForm=void 0;let s=this.kind;if(R(e.ownerId,s)){this.picksNote={kind:"warn",text:A(s,e.name)};return}let n=W(),r=this.nextCardName(),o=s==="status_pages"?q(r,n):j(n,r);this.picksBusy=!0,this.picksNote=void 0;let a=!1;try{let c=await Y(X(t),e.ownerId,s,{add:o});a=c.ok&&c.changed,c.ok||(this.picksNote={kind:"err",text:`Not made on ${e.name}. ${c.message}`})}catch(c){this.picksNote={kind:"err",text:B(c).message}}await i.refresh(),this.picksBusy=!1,a&&this.onOpenLibrary?.(s,n,e.ownerId)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!this.newForm?.busy){if(this.newForm!==void 0){this.newForm=void 0;return}this.newForm={name:this.nextCardName(),busy:!1,preview:ne(this.devices)[0]},this.updateComplete.then(()=>mt(this.renderRoot))}}nextCardName(){let e=this.lib.library,t=e===void 0?[]:O(e,this.kind).map(i=>i.item);return this.kind==="status_pages"?Ie({schemaVersion:1,statusPages:t}):xe({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let i=e.name.trim();if(i===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${g(this.kind)} a name.`}};return}let{note:s,...n}=e;this.newForm={...n,busy:!0};let r=W(),o=this.kind==="status_pages"?{schemaVersion:1,statusPages:[q(i,r)]}:{schemaVersion:1,pages:[j(r,i)]},a=await t.createItem(this.kind,o);if(!a.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${a.text}`}};return}this.newForm=void 0,lt(e.preview??ne(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,a.reply.id)}open(e){this.onOpenLibrary?.(e.kind,e.id,this.focusOwner)}async tick(e,t,i){let s=this.lib.store;if(s===void 0)return;if(this.dropTickNote(y(e)),this.untickAsk=void 0,!i){let h={item:e.name,device:this.devices.find(w=>w.ownerId===t)?.name??"the device"};this.untickAsk=await He(this.hassNow,s,t,e.kind,e.id,h),this.untickAsk===void 0&&s.noteFor(e.kind,e.id)===void 0&&this.flashSaved();return}let n=y(e),r=await J(this.hassNow,s,t,e.kind,e.id,!0);if(r.ok&&this.flashSaved(),!r.ok||e.kind!=="pages")return;let o=await this.readFree(t),a=this.lib.library,c=this.devices.find(h=>h.ownerId===t)?.name;if(!o||a===void 0||c===void 0||E(a,t,"pages")<2)return;let f=F([c]);f!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(n,{kind:"warn",text:`Added to ${c}. ${f}`}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let i=await J(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names);i.ok&&this.flashSaved(),i.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(y({id:e.itemId}),i.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let s=(await de(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==s&&(this.freeFacts=new Map(this.freeFacts).set(e,s)),s}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,i){let s=this.hassNow,n=this.lib.store;if(s===void 0||n===void 0||this.picksBusy)return;let r=this.kind;if(R(e.ownerId,r)){this.picksNote={kind:"warn",text:A(r,e.name)};return}let o=this.kindSeq,a="hidden"in t,c=Pt(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,a?this.hiddenAsked=new Map(this.hiddenAsked).set(c,t.hidden):i!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:r,ids:Qe(i,t.id,t.before)});let f=this.orderAsked,h;try{let w=await Y(X(s),e.ownerId,r,t);w.ok&&this.flashSaved(),w.ok||(h={kind:"err",text:`${a?"Not changed":"Not moved"} on ${e.name}: ${w.message.replace(/\.$/,"")}.`})}catch(w){h={kind:"err",text:B(w).message}}if(await n.refresh(),this.picksBusy=!1,a){let w=new Map(this.hiddenAsked);w.delete(c),this.hiddenAsked=w}else this.orderAsked===f&&(this.orderAsked=void 0);o===this.kindSeq&&(this.picksNote=h)}shownNow(){let e=this.lib.library;return e===void 0?[]:_(e,this.kind,this.search,"all",this.devices)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(y(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=It(this.selected,this.shownNow().map(y)))}startSelect(){this.selecting=!0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let i=y(e);this.selected=t?yt(this.selected,this.shownNow().map(y),this.anchor,i):vt(this.selected,i),this.anchor=i,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(y);this.selected=e?$t(this.selected,t):xt(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}async runDelete(){let e=this.hassNow,t=this.lib.store;if(e===void 0||t===void 0||this.bulkBusy!==void 0)return;let i=this.pickedItems();if(i.length===0)return;let s=this.kindSeq,n=this.devices;this.asking=!1,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let r;try{let o=await St(Ue(e),te(i,n,R),n,a=>{this.bulkBusy=a});r=Lt(o)}catch(o){r={kind:"err",text:B(o).message}}this.bulkBusy="Reading the library again\u2026";try{await t.refresh()}finally{this.bulkBusy=void 0}s===this.kindSeq&&(this.pruneSelected(),this.anchor=void 0,this.bulkNote=r)}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return u`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let t=this.kind,i=this.lib.library,s=this.lib.readState,n=this.filterDevice(),r=g(t,2),o=this.view,a=i===void 0?s==="unsupported"?we:s==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${r}\u2026`:We(O(i,t).length,t),c=i!==void 0&&s==="failed";return u`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${G(t)}</h1>
          <p class="ap-lead">${a}</p>
        </div>
        ${e.length===0?v:this.renderNew(n,e)}
      </div>
      ${this.newForm===void 0?v:this.renderNewDialog(this.newForm,e)}
      ${c?u`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:v}
      <div class="pk-surface pk-page" role="region" aria-label=${`Your ${r}`}>
        <div class="pk-pin">
          ${this.renderHead(i,n,o)}
          ${this.selecting&&n===void 0?this.renderBar(e):v}
        </div>
        <div class="pk-body">
          ${i===void 0?u`<p class="ap-empty">${a}</p>`:n!==void 0?this.renderFocus(i,Xe(i,n,t,this.search),e):o==="board"?this.renderBoardAll(i,e):this.renderAll(i,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${qe(t,n,this.selecting&&n===void 0,o)}</span></div>
      </div>
    </div></div>`}renderAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;let s=_(e,this.kind,this.search,"all",t);if(s.length===0)return u`<p class="ap-empty">${V(t,this.search,"all",this.kind)}</p>`;let n=this.waiting(e);return u`<div class="ap-grid" role="list">${s.map(r=>this.renderCard(e,r,t,n))}</div>`}renderEmptyLibrary(e,t){if(t.length===0||O(e,this.kind).length>0)return;let i=this.mayMake;return u`<div class="ap-empty-lib">
      <p>${je(this.kind,i)}</p>
      ${i?u`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
        ${N("plus")}<span>New ${g(this.kind)}</span></button>`:v}
    </div>`}renderHead(e,t,i){let s=this.selecting,n=this.bulkBusy!==void 0,r=g(this.kind,2);return u`<div class="pk-head">
      ${t===void 0?u`<button type="button" class="pk-pick-btn ${s?"on":""}" aria-pressed=${s?"true":"false"}
        title=${s?`Back to opening one ${g(this.kind)} at a time`:`Pick several ${r} to delete together`}
        ?disabled=${n||e===void 0} @click=${()=>s?this.endSelect():this.startSelect()}>
        ${N("checklist")}<span>Multi select</span></button>`:v}
      ${dt(i,o=>this.setView(o),r)}
      ${this.saved?u`<span class="bd-saved" role="status">${N("check")}<span>Saved</span></span>`:v}
      <label class="pk-search">
        ${N("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${r}`}
          @input=${o=>this.setSearch(o.target.value)} />
      </label>
    </div>`}renderNew(e,t){let i=`New ${g(this.kind)}`;if(e!==void 0)return u`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${M(this.kind)} on ${e.name}`}
          ?disabled=${this.picksBusy} @click=${()=>{this.newPage(e)}}>
          ${N("plus")}<span>${i}</span></button>
      </div>`;let s=this.mayMake,n=this.newForm!==void 0;return u`<div class="ap-new">
      <button type="button" class="ap-new-btn ${n?"on":""}" aria-expanded=${n?"true":"false"}
        ?disabled=${!s||this.newForm?.busy===!0}
        title=${s?`Make ${M(this.kind)} no device has yet`:ze(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${N("plus")}<span>${i}</span></button>
    </div>`}renderNewDialog(e,t){return ft(this.kind,e,ne(t),{onName:i=>{this.newForm={...e,name:i}},onPreview:i=>{this.newForm={...e,preview:i}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}})}ticksInput(e,t,i,s){let n=this.lib.store,r=y(t),o=n?.noteFor(t.kind,t.id),a=o===void 0?this.tickNotes.get(r):{kind:"warn",text:o},c=this.untickAsk,f=c!==void 0&&c.kind===t.kind&&S(c.itemId,t.id)?c:void 0,h=this.hassNow?.user?.is_admin,w=t.kind==="pages"?De(t.item):[];return{library:e,kind:t.kind,itemId:t.id,devices:i,colorOf:this.colorOf,skips:w,...n===void 0?{}:{pending:n.pending},...a===void 0?{}:{note:a.text,noteKind:a.kind},...f===void 0?{}:{ask:{ownerId:f.ownerId,text:f.text,onRemove:()=>{this.untickNow(f)},onCancel:()=>{this.untickAsk=void 0}}},...h===void 0?{}:{admin:h},locked:$=>{let L=Ne(e,$,t.kind,t.id);if(L&&R($,t.kind))return A(t.kind,i.find(T=>T.ownerId===$)?.name??"This device");if(!L&&s.has($))return ye}}}renderCardTicks(e,t,i,s){return _e(this.ticksInput(e,t,i,s),(n,r)=>{this.tick(t,n,r)})}renderCard(e,t,i,s){let n=this.selecting,r=y(t),o=n&&this.selected.has(r),a=Z(t,K,"all",i),c=this.openTitle(t),f=h=>this.cardClick(h,t);return u`<div class="ap-card ${n?"picking":""} ${o?"picked":""}" role="listitem" data-card=${r}
      @click=${h=>{n&&f(h)}}>
      <div class="ap-top">
        ${n?u`<input type="checkbox" class="pk-card-pick" .checked=${ce(o)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${c}
          @click=${h=>{h.stopPropagation(),this.pick(t,h.shiftKey)}} />`:v}
        <button type="button" class="ap-open" title=${c} tabindex=${n?"-1":"0"} @click=${f}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${Q(t)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${c} @click=${f}>
        ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumb(e,t,a)}
      </button>
      ${this.renderCardTicks(e,t,i,s)}
    </div>`}openTitle(e){if(this.selecting){let t=this.selected.has(y(e));return`${t?"Let":"Pick"} ${e.name}${t?" go":""}`}return ee(e.name)}boardColumns(e,t){return t.map(i=>({device:i,color:this.colorOf(i.ownerId),count:E(e,i.ownerId,this.kind)}))}renderBoardAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;if(t.length===0)return u`<p class="ap-empty">${V(t,this.search,"all",this.kind)}</p>`;let s=this.waiting(e),n=_(e,this.kind,this.search,"all",t);return this.renderBoardOf(e,t,[{key:"all",rows:n.map(r=>this.boardRow(e,r,t,s)),empty:V(t,this.search,"all",this.kind)}])}renderBoardOf(e,t,i,s){let n=g(this.kind),r=g(this.kind,2);return ct({label:`${G(this.kind)} on each device`,thing:n.charAt(0).toUpperCase()+n.slice(1),columns:this.boardColumns(e,t),...s===void 0?{}:{focus:s},onFocus:o=>this.setFocus(o),wide:this.roomy.wide,focusWord:"Order",focusTitle:o=>`Show ${o.name}'s ${r} first, in its order`,sections:i})}boardRow(e,t,i,s,n){let r=this.ticksInput(e,t,i,s),o=Ke(r),a=t.kind==="pages"?t.item:void 0,c=a===void 0?0:fe(a).length,f=a!==void 0&&c>0&&(r.skips?.length??0)>=c,h=o.map(m=>{let x={chip:m,onPick:H=>{this.tick(t,m.ownerId,H)}};m.on&&m.device==="watch"&&f?(x.note="shows nothing",x.noteWarn=!0,x.noteTitle=`Every tile on ${t.name} is iPhone only, so ${m.name} shows an empty page.`):m.skips!==void 0&&(x.note=m.skips.text,x.noteTitle=m.skips.title);let re=this.freeNote(e,t,m.ownerId,m.name,m.on);if(re!==void 0&&x.note===void 0&&Object.assign(x,re),n?.pick!==void 0&&S(m.ownerId,n.device.ownerId)&&t.kind==="pages"){let H=Pt(n.device.ownerId,t.id),z=this.hiddenAsked.get(H)??n.pick.hidden;x.eye={hidden:z,busy:this.picksBusy,title:z?`Show ${t.name} on ${n.device.name} again`:`Hide here: keep ${t.name} on ${n.device.name} without showing it`,onToggle:()=>{this.changePicks(n.device,{id:t.id,hidden:!z})}}}return x}),w=n?.pick!==void 0?n.device:Z(t,K,"all",i),$=this.selecting&&n===void 0,L=y(t),T={key:L,name:t.name,detail:Q(t),picture:this.rowPicture(t,n?.pick!==void 0?n.device:void 0),openTitle:n?.pick!==void 0?`${ee(t.name)}. Alt+Up or Alt+Down moves it.`:this.openTitle(t),onOpen:m=>{if(n?.pick!==void 0&&!m.metaKey&&!m.ctrlKey){this.open(t);return}this.cardClick(m,t)},cells:h,...n!==void 0&&n.pick===void 0?{dim:!0}:{},...n?.drag===void 0?{}:{drag:n.drag},...r.ask===void 0?{}:{ask:r.ask},...r.note===void 0?{}:{note:{text:r.note,kind:r.noteKind??"warn"}}};return $&&(T.select={picked:this.selected.has(L),disabled:this.bulkBusy!==void 0,label:this.openTitle(t),onPick:m=>this.pick(t,m.shiftKey)}),T}freeNote(e,t,i,s,n){if(t.kind!=="pages"||!n||this.freeFacts.get(i)!==!0)return;let r=Le(e,i,"pages").filter(a=>!a.hidden);if(r.length<2)return;let o=F([s]);return S(r[0].id,t.id)?{note:"1st page",...o===void 0?{}:{noteTitle:o}}:{note:"free: not shown",noteWarn:!0,...o===void 0?{}:{noteTitle:o}}}rowPicture(e,t){return e.kind==="status_pages"?ut({page:e.item,hass:this.hassNow,width:this.roomy.size(Dt),tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}}):ht({page:e.item,width:this.roomy.size(t?.kind==="iphone"?Ot:Dt),tick:this.iconsTick,iphone:t?.kind==="iphone",...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}})}renderFocus(e,t,i){let{device:s}=t,n=this.orderAsked,r=n!==void 0&&n.ownerId===s.ownerId&&n.kind===this.kind?n.ids:void 0,o=Je(t.picks,r),a=o.map(m=>m.id),c=E(e,s.ownerId,this.kind),f=this.search.trim()===""&&!this.picksBusy,h=this.kind==="pages"&&this.freeFacts.get(s.ownerId)===!0&&c>1?F([s.name]):void 0,w=this.waiting(e),$=g(this.kind,2),L=o.map((m,x)=>this.boardRow(e,m.entry,i,w,{device:s,pick:m,drag:this.rowDrag(m,x,a,s,f)})),T=t.rest.map(m=>this.boardRow(e,m,i,w,{device:s}));return u`${this.renderFocusHead(s,c)}
      ${this.picksNote===void 0?v:u`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${h===void 0?v:u`<p class="lt-line">${h}</p>`}
      ${this.renderBoardOf(e,i,[{key:"on",title:Ze(s),count:c,hint:et(s),rows:L,empty:it(s,this.kind,this.search,t.rest.length,this.mayMake)},{key:"rest",title:tt(s),count:t.rest.length,hint:`Tick its box under ${s.name} to add it.`,rows:T,empty:this.search.trim()===""?`Every ${g(this.kind)} in your library is on ${s.name}.`:`No other ${g(this.kind)} has that name.`}],s.ownerId)}
      <p class="lt-line bd-foot-line">${c} ${c===1?g(this.kind):$} on ${s.name}.</p>`}renderFocusHead(e,t){let i=ve(e.kind),s=g(this.kind,t),n=e.kind==="watch"?["settings","rooms","voice"]:["settings","rooms"],r=this.colorOf(e.ownerId);return u`<div class="bd-focus" style=${r===void 0?v:`--dc:${r}`}>
      <span class="bd-focus-glyph" aria-hidden="true">${N(e.kind==="iphone"?"phone":"watch")}</span>
      <span class="bd-focus-t"><b>${e.name}</b> <span>${t} ${s}, in the order the ${i} ${this.kind==="pages"?"shows":"keeps"} them</span></span>
      ${this.onOpenScreen===void 0?v:u`<span class="bd-focus-own">Also on this ${i}:
        ${n.map(o=>u`<button type="button" class="bd-link" @click=${()=>this.onOpenScreen?.(e.ownerId,e.kind,o)}>${rt[o]}</button>`)}</span>`}
      <button type="button" class="bd-focus-all" @click=${()=>this.setFocus(void 0)}>${N("grid")}<span>All devices</span></button>
    </div>`}rowDrag(e,t,i,s,n){let r=this.overId!==void 0&&S(this.overId,e.id)&&this.dragId!==void 0&&!S(this.dragId,e.id),o=a=>{a!==void 0&&this.changePicks(s,{id:e.id,before:a},[...i])};return{on:n,dragging:this.dragId!==void 0&&S(this.dragId,e.id),over:r,below:r&&i.findIndex(a=>S(a,this.dragId))<t,onStart:a=>{n&&(this.dragId=e.id,a.dataTransfer?.setData("text/plain",e.id),a.dataTransfer&&(a.dataTransfer.effectAllowed="move"))},onOver:a=>{this.dragId!==void 0&&(a.preventDefault(),this.overId!==e.id&&(this.overId=e.id))},onDrop:a=>{a.preventDefault();let c=this.dragId;this.dragId=void 0,this.overId=void 0;let f=c===void 0?void 0:Ge(i,c,e.id);f!==void 0&&this.changePicks(s,f,[...i])},onEnd:()=>{this.dragId=void 0,this.overId=void 0},onKey:a=>{!a.altKey||!n||a.key!=="ArrowUp"&&a.key!=="ArrowDown"||(a.preventDefault(),a.key==="ArrowUp"?o(t>0?i[t-1]:void 0):o(t<i.length-1?i[t+2]??null:void 0))}}}renderBar(e){let t=this.shownNow(),i=t.filter(h=>this.selected.has(y(h))),s=i.length,n=this.bulkBusy!==void 0,r=s===0,o=t.length>0&&t.every(h=>this.selected.has(y(h))),a=n?void 0:this.bulkNote,c=g(this.kind),f=g(this.kind,2);return u`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${f}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?`Pick ${M(this.kind)} to start.`:`${s} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${n||t.length===0}
        title=${o?`Let the ${f} on screen go`:`Pick every ${c} the search has left`}
        @click=${()=>this.selectShown(!o)}>${o?"None":"All shown"}</button>
      ${a===void 0?v:u`<span class="pk-bar-said ${a.kind}">${a.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!r?this.renderDeleteAsk(i,e):u`<button type="button" class="ghost danger small" ?disabled=${n||r}
            title=${`Delete these ${f} from the library, and from every device they are on`}
            @click=${()=>this.toggleAsk()}>${N("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${n}
        title=${`Stop picking and go back to opening one ${c} at a time`}
        @click=${()=>this.endSelect()}>${N("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let i=te(e,t,R),s=Nt(i,t);return u`<span class="pk-bar-ask" id="ap-del-ask"><b>${s.title}</b> ${s.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${i.items.length===0}
        @click=${()=>{this.runDelete()}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,i){let s=t.item,n=i===void 0?[]:ke(Te(e,i.ownerId)),r=n.length===0?[s]:n,o=this.hassNow?.states,a=this.icons,c=U/D.width,f=Bt(s,o,a),h=f.height*c,w=h>ie,$=L=>`${Math.round(L*100)/100}px`;return u`<span class="ap-pic ${w?"cut":""}" style=${`width:${$(U)};height:${$(Math.min(h,ie))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${$(-f.top*c)})`}>${Be({page:s,pages:r,screen:D,scale:c,...o===void 0?{}:{states:o},...a===void 0?{}:{icons:a}})}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,i=U/D.width,s=o=>`${Math.round(o*100)/100}px`,r=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return u`<span class="ap-pic ap-pic-status ${r?"cut":""}" style=${`width:${s(U)};height:${s(Math.min(D.height*i,ie))}`}>
      <span class="ap-pic-in">${t===void 0?v:Ee({page:e.item,hass:t,icons:this.icons??ue,screen:D,scale:i})}</span>
    </span>`}static{this.styles=[Oe,ge,Ae,bt,wt,Ve,kt,gt,pt,ae`
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
  `]}};k([I({attribute:!1})],l.prototype,"kind",2),k([I({attribute:!1})],l.prototype,"owners",2),k([I({attribute:!1})],l.prototype,"ownersReady",2),k([I({attribute:!1})],l.prototype,"phones",2),k([I({attribute:!1})],l.prototype,"icons",2),k([I({attribute:!1})],l.prototype,"iconsTick",2),k([I({attribute:!1})],l.prototype,"onOpenLibrary",2),k([I({attribute:!1})],l.prototype,"focusOwner",2),k([I({attribute:!1})],l.prototype,"onFocus",2),k([I({attribute:!1})],l.prototype,"onOpenScreen",2),k([b()],l.prototype,"search",2),k([b()],l.prototype,"newForm",2),k([b()],l.prototype,"selecting",2),k([b()],l.prototype,"selected",2),k([b()],l.prototype,"asking",2),k([b()],l.prototype,"bulkBusy",2),k([b()],l.prototype,"bulkNote",2),k([b()],l.prototype,"tickNotes",2),k([b()],l.prototype,"untickAsk",2),k([b()],l.prototype,"picksBusy",2),k([b()],l.prototype,"picksNote",2),k([b()],l.prototype,"orderAsked",2),k([b()],l.prototype,"hiddenAsked",2),k([b()],l.prototype,"dragId",2),k([b()],l.prototype,"overId",2),k([b()],l.prototype,"freeFacts",2),k([b()],l.prototype,"saved",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",l);export{l as WaAllPages,Bt as pageCrop};
