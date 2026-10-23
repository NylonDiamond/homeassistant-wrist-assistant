import{a as $t,b as xt,c as It,d as St,e as Lt,f as Pt,g as Nt,h as Tt,i as Dt,j as Ct}from"./chunk-HVXALXGI.js";import{b as ht,d as ut,e as ft}from"./chunk-BS7EQPQV.js";import{b as kt,h as mt,j as gt}from"./chunk-334XU6PT.js";import{d as ze,i as J,j as Ge}from"./chunk-SDQQ5ZYQ.js";import{C as M,D as nt,E as st,F as rt,G as at,H as V,I as ot,J as dt,K as ct,L as pt,N as lt,O as j,P as bt,Q as vt,S as yt,m as We,p as Ue,q as w,r as A,s as Qe,t as q,u as Ze,v as et,w as tt,x as Y,y as _,z as it}from"./chunk-TII47Z4B.js";import"./chunk-WWKDSKNH.js";import{Ba as Xe,E as Ce,F as Re,Ja as wt,c as be,d as ve,e as ye,f as $e,ga as $,ia as E,na as Oe,oa as Be,pa as Fe,s as De,ua as Ee,va as K,wa as Je,xa as qe,ya as Ye}from"./chunk-7ECLFNJH.js";import"./chunk-CKIFX3N2.js";import{B as Ve,C as je,J as He,n as Ae,o as _e,x as Me}from"./chunk-U64E4D6P.js";import{ab as Ke}from"./chunk-JWHXHFXQ.js";import{a as xe,b as Ie,c as C,f as Se,g as Le,h as F}from"./chunk-XF6VR4HJ.js";import"./chunk-RQWXLJYE.js";import"./chunk-ZOJGMATP.js";import"./chunk-27VXOWKT.js";import{g as Pe,h as Ne,m as Te}from"./chunk-CHKZKW42.js";import{b as pe,c as le,e as we}from"./chunk-KBXFS4SO.js";import{c as he}from"./chunk-SV3BTW33.js";import{X as ce,z as de}from"./chunk-2WZUP5YJ.js";import{j as B,k as ue,l as fe,m as ke,q as me,r as ge}from"./chunk-TUSU5T3G.js";import{Eg as O,Ge as se,Gg as oe,b as ie,d as k,g as v,j as ne,jg as re,k as I,l as b,nh as L,qg as ae}from"./chunk-BDP52PL7.js";import{Xa as T}from"./chunk-TGJNCNIU.js";import{a as f}from"./chunk-LO2NM3CE.js";function Rt(o,c){let e=new Set(o);return e.has(c)?e.delete(c):e.add(c),e}function Ot(o,c,e,t){let i=new Set(o),n=c.indexOf(t),s=e===void 0?-1:c.indexOf(e);if(n<0)return i;if(s<0)return i.add(t),i;for(let r=Math.min(s,n);r<=Math.max(s,n);r++)i.add(c[r]);return i}function Bt(o,c){return new Set([...o,...c])}function Ft(o,c){let e=new Set(c);return new Set([...o].filter(t=>!e.has(t)))}function Et(o,c){let e=new Set(c);return new Set([...o].filter(t=>e.has(t)))}function y(o){return o.id.toUpperCase()}function X(o,c,e){let i={kind:o[0]?.kind??"pages",items:[],kept:[],devices:[]},n=new Set;for(let s of o){let r=c.filter(a=>s.owners.some(p=>$(p,a.ownerId))).map(a=>a.ownerId),d=r.filter(a=>e(a,s.kind));if(d.length>0){i.kept.push({name:s.name,dirty:d});continue}i.items.push({id:s.id,name:s.name,owners:[...s.owners]});for(let a of r)n.add(a)}return i.devices=c.map(s=>s.ownerId).filter(s=>n.has(s)),i}var R=(o,c)=>o.find(e=>$(e.ownerId,c))?.name??"a device";function Kt(o,c){let e=o.items.length,t=e===1?"it":"them",i=`Delete ${e} ${w(o.kind,e)} from the library?`,n=o.devices.map(d=>R(c,d)),s=o.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,r=[n.length===0?`No device has ${t}. This cannot be undone.`:`${e===1?"It comes":"They come"} off ${C(n)}, ${s}. This cannot be undone.`];for(let d of o.kept){let a=d.dirty.map(p=>R(c,p));r.push(`${d.name} stays: ${C(a)} ${a.length===1?"has":"have"} unsaved edits.`)}return{title:i,body:r.join(" ")}}async function At(o,c,e,t){let i={kind:c.kind,gone:[],kept:c.kept.map(s=>({...s,dirty:[...s.dirty]})),failed:[],stuck:[],taps:[]},n=new Map;for(let[s,r]of c.items.entries()){t?.(`Deleting ${r.name} (${s+1} of ${c.items.length})\u2026`);let d=await o.delete(c.kind,r.id);if(!d.ok){i.failed.push({name:r.name,text:d.text});continue}i.gone.push(r.name);for(let a of d.reply.link_failures??[]){let p=a.name??R(e,a.owner);i.stuck.includes(p)||i.stuck.push(p)}for(let a of r.owners)n.set(a,[...n.get(a)??[],r.id])}if(c.kind==="pages")for(let[s,r]of n){t?.(`Clearing complication taps on ${R(e,s)}\u2026`);let d=!1;try{d=await o.clearTaps(s,r)}catch{d=!1}d||i.taps.push(R(e,s))}return i}function _t(o){let c=n=>`${n} ${w(o.kind,n)}`,e=[];o.gone.length>0&&e.push(`Deleted ${o.gone.length===1?o.gone[0]:c(o.gone.length)}.`);let t=e.length>0,i=!1;for(let n of o.kept)i=!0,e.push(`Kept ${n.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let n of o.failed)i=!0,e.push(`Not deleted: ${n.name}. ${n.text}`);return o.stuck.length>0&&(i=!0,e.push(`Could not take ${o.gone.length===1?"it":"them"} off ${C(o.stuck)}.`)),o.taps.length>0&&(i=!0,e.push(`Could not clear the complication taps that opened ${o.gone.length===1?"it":"them"} on ${C(o.taps)}. Change those by hand.`)),!t&&!i?{kind:"ok",text:"Nothing was deleted."}:{kind:i?t?"warn":"err":"ok",text:e.join(" ")}}function Mt(o){return o==="status_pages"?"statusPages":"pages"}function Yt(o,c){return!B(c)||typeof c.id!="string"?!1:o==="status_pages"?!0:!me(c)}function Xt(o,c,e){if("hidden"in e)return o==="status_pages"?c:Te(c,e.id,e.hidden);let t=c[Mt(o)];if(!Array.isArray(t))return c;let i=[];t.forEach((l,m)=>{Yt(o,l)&&i.push(m)});let n=i.map(l=>t[l]),s=n.findIndex(l=>$(l.id,e.id));if(s<0)return c;let r=n[s],d=n.filter((l,m)=>m!==s),a=e.before===null?-1:d.findIndex(l=>$(l.id,e.before));if(e.before!==null&&a<0)return c;let p=a<0?[...d,r]:[...d.slice(0,a),r,...d.slice(a)];if(p.every((l,m)=>l===n[m]))return c;let u=t.slice();return i.forEach((l,m)=>{u[l]=p[m]}),{...c,[Mt(o)]:u}}var Gt=3;async function Vt(o,c,e,t){for(let i=1;;i++){let n;try{n=await o.read(c,e)}catch(d){let{code:a="unknown",message:p}=T(d);return{ok:!1,code:a,message:p}}let s=n.revision>0?e==="status_pages"?De(n.document):ue(n.document):void 0;if(s===void 0)return{ok:!0,changed:!1};let r=Xt(e,s,t);if(r===s)return{ok:!0,changed:!1};try{return await o.save(c,e,n.revision,r),{ok:!0,changed:!0}}catch(d){let{code:a="unknown",message:p}=T(d);if(a!=="conflict"||i>=Gt)return{ok:!1,code:a,message:p}}}}function G(o,c){return o==="status_pages"?`${c}'s status pages have unsaved edits. Save or discard them first.`:`${c}'s pages have unsaved edits. Save or discard them first.`}async function Qt(o,c,e){let t=!0,i=await re(o,c);for(let n of i.records){if(n.deleted||!B(n.document))continue;let s=ze(n.document,e);if(s!==void 0)try{await ae(o,c,s,n.revision)}catch{t=!1}}return t}function jt(o){return{delete:async(c,e)=>{try{return{ok:!0,reply:await be(o,c,e)}}catch(t){let i=$e(t),n=ye(t);return i===void 0?{ok:!1,text:n}:{ok:!1,code:i,text:n}}},clearTaps:(c,e)=>Qt(o,c,e)}}function Ht(o){return{read:(c,e)=>O(o,c,e),save:(c,e,t,i)=>oe(o,c,e,t,i)}}var H=200,Q=320,Wt=6,D=ce.screen;function Zt(o,c,e,t=D){if(ge(o))return{top:0,height:t.height};let i=Ae(_e(o,c),t),n=[...i.tiles,...je(o,t,{states:c})];if(n.length===0)return{top:0,height:t.height};let r=Me(o,1,i.topInset,e)!==v?0:Math.max(0,i.topInset+Math.min(...n.map(a=>a.y))-Wt),d=i.topInset+Math.max(...n.map(a=>a.y+a.height))+Wt;return{top:r,height:Math.max(1,d-r)}}var ei=2e3,Ut=34,Jt={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"};function Z(o){return["watch","iphone"].filter(c=>o.some(e=>e.kind===c))}var ee=new Map;function qt(o){let c=ee.get(o);if(c!==void 0)return c;let e={view:"board"};try{let t=window.localStorage.getItem(Jt[o]);(t?JSON.parse(t):{}).view==="cards"&&(e.view="cards")}catch{}return ee.set(o,e),e}function ti(o,c){let e={...qt(o),...c};ee.set(o,e);try{window.localStorage.setItem(Jt[o],JSON.stringify(e))}catch{}}var W=(o,c="pages")=>(c==="status_pages"?kt(o)?.dirty:ht(o)?.dirty)??!1,zt=(o,c)=>`${o}|${c.toUpperCase()}`,h=class extends ne{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.search="";this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.saved=!1;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new Je(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.colorsFor=le();this.colorOf=e=>pe(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let i=Date.now();(t||i-this.hassDrawnAt>=ei)&&(this.hassDrawnAt=i,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){if(e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged(),e.has("focusOwner")&&this.focusOwner!==void 0&&this.endSelect(!0),this.kind==="pages")for(let t of this.devices)this.freeAsked.has(t.ownerId)||this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return it(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===_?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.filterDevice()!==void 0?"board":qt(this.kind).view}get devices(){return xe(this.owners,this.phones)}waiting(e){let t=new Map;for(let i of this.devices)t.set(i.ownerId,{held:Be(e,i.ownerId,this.kind),free:!1});return Le(this.owners,t)}setFocus(e){e!==void 0&&this.endSelect(!0),this.picksNote=void 0,this.onFocus?.(e)}setView(e){ti(this.kind,{view:e}),e==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},Lt)}setSearch(e){this.search=e,this.pruneSelected()}newPage(e){if(this.newForm=void 0,this.kind==="status_pages"){gt(e.ownerId),this.onOpen?.(e.ownerId,e.kind,"status_pages");return}ft(e.ownerId),this.onOpen?.(e.ownerId,e.kind)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!this.newForm?.busy){if(this.newForm!==void 0){this.newForm=void 0;return}this.newForm={name:this.nextCardName(),busy:!1,preview:Z(this.devices)[0]},this.updateComplete.then(()=>xt(this.renderRoot))}}nextCardName(){let e=this.lib.library,t=e===void 0?[]:E(e,this.kind).map(i=>i.item);return this.kind==="status_pages"?Ce({schemaVersion:1,statusPages:t}):Pe({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let i=e.name.trim();if(i===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${w(this.kind)} a name.`}};return}let{note:n,...s}=e;this.newForm={...s,busy:!0};let r=se(),d=this.kind==="status_pages"?{schemaVersion:1,statusPages:[Re(i,r)]}:{schemaVersion:1,pages:[Ne(r,i)]},a=await t.createItem(this.kind,d);if(!a.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${a.text}`}};return}this.newForm=void 0,wt(e.preview??Z(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,a.reply.id)}open(e,t){let i=t??V(e,this.filter,"all",this.devices);if(i===void 0){this.onOpenLibrary?.(e.kind,e.id);return}if(e.kind==="status_pages"){mt(i.ownerId,e.id),this.onOpen?.(i.ownerId,i.kind,"status_pages");return}ut(i.ownerId,{pageId:e.id}),this.onOpen?.(i.ownerId,i.kind)}async tick(e,t,i){let n=this.lib.store;if(n===void 0)return;if(this.dropTickNote(y(e)),this.untickAsk=void 0,!i){let l={item:e.name,device:this.devices.find(m=>m.ownerId===t)?.name??"the device"};this.untickAsk=await Ge(this.hassNow,n,t,e.kind,e.id,l),this.untickAsk===void 0&&n.noteFor(e.kind,e.id)===void 0&&this.flashSaved();return}let s=y(e),r=await J(this.hassNow,n,t,e.kind,e.id,!0);if(r.ok&&this.flashSaved(),!r.ok||e.kind!=="pages")return;let d=await this.readFree(t),a=this.lib.library,p=this.devices.find(l=>l.ownerId===t)?.name;if(!d||a===void 0||p===void 0||K(a,t,"pages")<2)return;let u=F([p]);u!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(s,{kind:"warn",text:`Added to ${p}. ${u}`}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let i=await J(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names);i.ok&&this.flashSaved(),i.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(y({id:e.itemId}),i.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let n=(await O(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==n&&(this.freeFacts=new Map(this.freeFacts).set(e,n)),n}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,i){let n=this.hassNow,s=this.lib.store;if(n===void 0||s===void 0||this.picksBusy)return;let r=this.kind;if(W(e.ownerId,r)){this.picksNote={kind:"warn",text:G(r,e.name)};return}let d=this.kindSeq,a="hidden"in t,p=zt(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,a?this.hiddenAsked=new Map(this.hiddenAsked).set(p,t.hidden):i!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:r,ids:at(i,t.id,t.before)});let u=this.orderAsked,l;try{let m=await Vt(Ht(n),e.ownerId,r,t);m.ok&&this.flashSaved(),m.ok||(l={kind:"err",text:`${a?"Not changed":"Not moved"} on ${e.name}: ${m.message.replace(/\.$/,"")}.`})}catch(m){l={kind:"err",text:T(m).message}}if(await s.refresh(),this.picksBusy=!1,a){let m=new Map(this.hiddenAsked);m.delete(p),this.hiddenAsked=m}else this.orderAsked===u&&(this.orderAsked=void 0);d===this.kindSeq&&(this.picksNote=l)}shownNow(){let e=this.lib.library;return e===void 0?[]:M(e,this.kind,this.search,"all",this.devices)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(y(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=Et(this.selected,this.shownNow().map(y)))}startSelect(){this.selecting=!0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let i=y(e);this.selected=t?Ot(this.selected,this.shownNow().map(y),this.anchor,i):Rt(this.selected,i),this.anchor=i,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(y);this.selected=e?Bt(this.selected,t):Ft(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}async runDelete(){let e=this.hassNow,t=this.lib.store;if(e===void 0||t===void 0||this.bulkBusy!==void 0)return;let i=this.pickedItems();if(i.length===0)return;let n=this.kindSeq,s=this.devices;this.asking=!1,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let r;try{let d=await At(jt(e),X(i,s,W),s,a=>{this.bulkBusy=a});r=_t(d)}catch(d){r={kind:"err",text:T(d).message}}this.bulkBusy="Reading the library again\u2026";try{await t.refresh()}finally{this.bulkBusy=void 0}n===this.kindSeq&&(this.pruneSelected(),this.anchor=void 0,this.bulkNote=r)}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return k`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let t=this.kind,i=this.lib.library,n=this.lib.readState,s=this.filterDevice(),r=w(t,2),d=this.view,a=i===void 0?n==="unsupported"?ve:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${r}\u2026`:Ze(E(i,t).length,t),p=i!==void 0&&n==="failed";return k`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${q(t)}</h1>
          <p class="ap-lead">${a}</p>
        </div>
        ${e.length===0?v:this.renderNew(s,e)}
      </div>
      ${this.newForm===void 0?v:this.renderNewDialog(this.newForm,e)}
      ${p?k`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:v}
      <div class="pk-surface pk-page" role="region" aria-label=${`Your ${r}`}>
        <div class="pk-pin">
          ${this.renderHead(i,s,d)}
          ${this.selecting&&s===void 0?this.renderBar(e):v}
        </div>
        <div class="pk-body">
          ${i===void 0?k`<p class="ap-empty">${a}</p>`:s!==void 0?this.renderFocus(i,nt(i,s,t,this.search),e):d==="board"?this.renderBoardAll(i,e):this.renderAll(i,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${tt(t,s,this.selecting&&s===void 0,d)}</span></div>
      </div>
    </div></div>`}renderAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;let n=M(e,this.kind,this.search,"all",t);if(n.length===0)return k`<p class="ap-empty">${j(t,this.search,"all",this.kind)}</p>`;let s=this.waiting(e);return k`<div class="ap-grid" role="list">${n.map(r=>this.renderCard(e,r,t,s))}</div>`}renderEmptyLibrary(e,t){if(t.length===0||E(e,this.kind).length>0)return;let i=this.mayMake;return k`<div class="ap-empty-lib">
      <p>${et(this.kind,i)}</p>
      ${i?k`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
        ${L("plus")}<span>New ${w(this.kind)}</span></button>`:v}
    </div>`}renderHead(e,t,i){let n=this.selecting,s=this.bulkBusy!==void 0,r=w(this.kind,2);return k`<div class="pk-head">
      ${t===void 0?k`<button type="button" class="pk-pick-btn ${n?"on":""}" aria-pressed=${n?"true":"false"}
        title=${n?`Back to opening one ${w(this.kind)} at a time`:`Pick several ${r} to delete together`}
        ?disabled=${s||e===void 0} @click=${()=>n?this.endSelect():this.startSelect()}>
        ${L("checklist")}<span>Multi select</span></button>`:v}
      ${Pt(i,d=>this.setView(d),r)}
      ${this.saved?k`<span class="bd-saved" role="status">${L("check")}<span>Saved</span></span>`:v}
      <label class="pk-search">
        ${L("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${r}`}
          @input=${d=>this.setSearch(d.target.value)} />
      </label>
    </div>`}renderNew(e,t){let i=`New ${w(this.kind)}`;if(e!==void 0)return k`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${A(this.kind)} on ${e.name}`}
          @click=${()=>this.newPage(e)}>
          ${L("plus")}<span>${i}</span></button>
      </div>`;let n=this.mayMake,s=this.newForm!==void 0;return k`<div class="ap-new">
      <button type="button" class="ap-new-btn ${s?"on":""}" aria-expanded=${s?"true":"false"}
        ?disabled=${!n||this.newForm?.busy===!0}
        title=${n?`Make ${A(this.kind)} no device has yet`:Qe(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${L("plus")}<span>${i}</span></button>
    </div>`}renderNewDialog(e,t){return $t(this.kind,e,Z(t),{onName:i=>{this.newForm={...e,name:i}},onPreview:i=>{this.newForm={...e,preview:i}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}})}ticksInput(e,t,i,n){let s=this.lib.store,r=y(t),d=s?.noteFor(t.kind,t.id),a=d===void 0?this.tickNotes.get(r):{kind:"warn",text:d},p=this.untickAsk,u=p!==void 0&&p.kind===t.kind&&$(p.itemId,t.id)?p:void 0,l=this.hassNow?.user?.is_admin,m=t.kind==="pages"?Ke(t.item):[];return{library:e,kind:t.kind,itemId:t.id,devices:i,colorOf:this.colorOf,skips:m,...s===void 0?{}:{pending:s.pending},...a===void 0?{}:{note:a.text,noteKind:a.kind},...u===void 0?{}:{ask:{ownerId:u.ownerId,text:u.text,onRemove:()=>{this.untickNow(u)},onCancel:()=>{this.untickAsk=void 0}}},...l===void 0?{}:{admin:l},locked:x=>{let P=Oe(e,x,t.kind,t.id);if(P&&W(x,t.kind))return G(t.kind,i.find(N=>N.ownerId===x)?.name??"This device");if(!P&&n.has(x))return Se}}}renderCardTicks(e,t,i,n){return Ye(this.ticksInput(e,t,i,n),(s,r)=>{this.tick(t,s,r)})}renderCard(e,t,i,n){let s=this.selecting,r=y(t),d=s&&this.selected.has(r),a=V(t,_,"all",i),p=this.openTitle(t,a),u=l=>this.cardClick(l,t);return k`<div class="ap-card ${s?"picking":""} ${d?"picked":""}" role="listitem" data-card=${r}
      @click=${l=>{s&&u(l)}}>
      <div class="ap-top">
        ${s?k`<input type="checkbox" class="pk-card-pick" .checked=${de(d)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${p}
          @click=${l=>{l.stopPropagation(),this.pick(t,l.shiftKey)}} />`:v}
        <button type="button" class="ap-open" title=${p} tabindex=${s?"-1":"0"} @click=${u}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${Y(t)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${p} @click=${u}>
        ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumb(e,t,a)}
      </button>
      ${this.renderCardTicks(e,t,i,n)}
    </div>`}openTitle(e,t){if(this.selecting){let i=this.selected.has(y(e));return`${i?"Let":"Pick"} ${e.name}${i?" go":""}`}return t===void 0?ot(e.name):`Edit ${e.name} on ${t.name}`}boardColumns(e,t){return t.map(i=>({device:i,color:this.colorOf(i.ownerId),count:K(e,i.ownerId,this.kind)}))}renderBoardAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;if(t.length===0)return k`<p class="ap-empty">${j(t,this.search,"all",this.kind)}</p>`;let n=this.waiting(e),s=M(e,this.kind,this.search,"all",t);return this.renderBoardOf(e,t,[{key:"all",rows:s.map(r=>this.boardRow(e,r,t,n)),empty:j(t,this.search,"all",this.kind)}])}renderBoardOf(e,t,i,n){let s=w(this.kind),r=w(this.kind,2);return Nt({label:`${q(this.kind)} on each device`,thing:s.charAt(0).toUpperCase()+s.slice(1),columns:this.boardColumns(e,t),...n===void 0?{}:{focus:n},onFocus:d=>this.setFocus(d),focusWord:"Order",focusTitle:d=>`Show ${d.name}'s ${r} first, in its order`,sections:i})}boardRow(e,t,i,n,s){let r=this.ticksInput(e,t,i,n),d=qe(r),a=t.kind==="pages"?t.item:void 0,p=a===void 0?0:ke(a).length,u=a!==void 0&&p>0&&(r.skips?.length??0)>=p,l=d.map(g=>{let S={chip:g,onPick:U=>{this.tick(t,g.ownerId,U)}};g.on&&g.device==="watch"&&u?(S.note="shows nothing",S.noteWarn=!0,S.noteTitle=`Every tile on ${t.name} is iPhone only, so ${g.name} shows an empty page.`):g.skips!==void 0&&(S.note=g.skips.text,S.noteTitle=g.skips.title);let te=this.freeNote(e,t,g.ownerId,g.name,g.on);if(te!==void 0&&S.note===void 0&&Object.assign(S,te),s?.pick!==void 0&&$(g.ownerId,s.device.ownerId)&&t.kind==="pages"){let U=zt(s.device.ownerId,t.id),z=this.hiddenAsked.get(U)??s.pick.hidden;S.eye={hidden:z,busy:this.picksBusy,title:z?`Show ${t.name} on ${s.device.name} again`:`Hide here: keep ${t.name} on ${s.device.name} without showing it`,onToggle:()=>{this.changePicks(s.device,{id:t.id,hidden:!z})}}}return S}),m=s?.pick!==void 0?s.device:V(t,_,"all",i),x=this.selecting&&s===void 0,P=y(t),N={key:P,name:t.name,detail:Y(t),picture:this.rowPicture(t,s?.pick!==void 0?s.device:void 0),openTitle:s?.pick!==void 0?`Edit ${t.name} on ${s.device.name}. Alt+Up or Alt+Down moves it.`:this.openTitle(t,m),onOpen:g=>{if(s?.pick!==void 0&&!g.metaKey&&!g.ctrlKey){this.open(t,s.device);return}this.cardClick(g,t)},cells:l,...s!==void 0&&s.pick===void 0?{dim:!0}:{},...s?.drag===void 0?{}:{drag:s.drag},...r.ask===void 0?{}:{ask:r.ask},...r.note===void 0?{}:{note:{text:r.note,kind:r.noteKind??"warn"}}};return x&&(N.select={picked:this.selected.has(P),disabled:this.bulkBusy!==void 0,label:this.openTitle(t,m),onPick:g=>this.pick(t,g.shiftKey)}),N}freeNote(e,t,i,n,s){if(t.kind!=="pages"||!s||this.freeFacts.get(i)!==!0)return;let r=Fe(e,i,"pages").filter(a=>!a.hidden);if(r.length<2)return;let d=F([n]);return $(r[0].id,t.id)?{note:"1st page",...d===void 0?{}:{noteTitle:d}}:{note:"free: not shown",noteWarn:!0,...d===void 0?{}:{noteTitle:d}}}rowPicture(e,t){return e.kind==="status_pages"?vt({page:e.item,hass:this.hassNow,width:Ut,tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}}):bt({page:e.item,width:Ut,tick:this.iconsTick,iphone:t?.kind==="iphone",...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons}})}renderFocus(e,t,i){let{device:n}=t,s=this.orderAsked,r=s!==void 0&&s.ownerId===n.ownerId&&s.kind===this.kind?s.ids:void 0,d=st(t.picks,r),a=d.map(g=>g.id),p=K(e,n.ownerId,this.kind),u=this.search.trim()===""&&!this.picksBusy,l=this.kind==="pages"&&this.freeFacts.get(n.ownerId)===!0&&p>1?F([n.name]):void 0,m=this.waiting(e),x=w(this.kind,2),P=d.map((g,S)=>this.boardRow(e,g.entry,i,m,{device:n,pick:g,drag:this.rowDrag(g,S,a,n,u)})),N=t.rest.map(g=>this.boardRow(e,g,i,m,{device:n}));return k`${this.renderFocusHead(n,p)}
      ${this.picksNote===void 0?v:k`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${l===void 0?v:k`<p class="lt-line">${l}</p>`}
      ${this.renderBoardOf(e,i,[{key:"on",title:dt(n),count:p,hint:ct(n),rows:P,empty:lt(n,this.kind,this.search,t.rest.length,this.mayMake)},{key:"rest",title:pt(n),count:t.rest.length,hint:`Tick its box under ${n.name} to add it.`,rows:N,empty:this.search.trim()===""?`Every ${w(this.kind)} in your library is on ${n.name}.`:`No other ${w(this.kind)} has that name.`}],n.ownerId)}
      <p class="lt-line bd-foot-line">${p} ${p===1?w(this.kind):x} on ${n.name}.</p>`}renderFocusHead(e,t){let i=Ie(e.kind),n=w(this.kind,t),s=e.kind==="watch"?["settings","rooms","voice"]:["settings","rooms"],r=this.colorOf(e.ownerId);return k`<div class="bd-focus" style=${r===void 0?v:`--dc:${r}`}>
      <span class="bd-focus-glyph" aria-hidden="true">${L(e.kind==="iphone"?"phone":"watch")}</span>
      <span class="bd-focus-t"><b>${e.name}</b> <span>${t} ${n}, in the order the ${i} ${this.kind==="pages"?"shows":"keeps"} them</span></span>
      ${this.onOpenScreen===void 0?v:k`<span class="bd-focus-own">Also on this ${i}:
        ${s.map(d=>k`<button type="button" class="bd-link" @click=${()=>this.onOpenScreen?.(e.ownerId,e.kind,d)}>${St[d]}</button>`)}</span>`}
      <button type="button" class="bd-focus-all" @click=${()=>this.setFocus(void 0)}>${L("grid")}<span>All devices</span></button>
    </div>`}rowDrag(e,t,i,n,s){let r=this.overId!==void 0&&$(this.overId,e.id)&&this.dragId!==void 0&&!$(this.dragId,e.id),d=a=>{a!==void 0&&this.changePicks(n,{id:e.id,before:a},[...i])};return{on:s,dragging:this.dragId!==void 0&&$(this.dragId,e.id),over:r,below:r&&i.findIndex(a=>$(a,this.dragId))<t,onStart:a=>{s&&(this.dragId=e.id,a.dataTransfer?.setData("text/plain",e.id),a.dataTransfer&&(a.dataTransfer.effectAllowed="move"))},onOver:a=>{this.dragId!==void 0&&(a.preventDefault(),this.overId!==e.id&&(this.overId=e.id))},onDrop:a=>{a.preventDefault();let p=this.dragId;this.dragId=void 0,this.overId=void 0;let u=p===void 0?void 0:rt(i,p,e.id);u!==void 0&&this.changePicks(n,u,[...i])},onEnd:()=>{this.dragId=void 0,this.overId=void 0},onKey:a=>{!a.altKey||!s||a.key!=="ArrowUp"&&a.key!=="ArrowDown"||(a.preventDefault(),a.key==="ArrowUp"?d(t>0?i[t-1]:void 0):d(t<i.length-1?i[t+2]??null:void 0))}}}renderBar(e){let t=this.shownNow(),i=t.filter(l=>this.selected.has(y(l))),n=i.length,s=this.bulkBusy!==void 0,r=n===0,d=t.length>0&&t.every(l=>this.selected.has(y(l))),a=s?void 0:this.bulkNote,p=w(this.kind),u=w(this.kind,2);return k`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${u}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?`Pick ${A(this.kind)} to start.`:`${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${s||t.length===0}
        title=${d?`Let the ${u} on screen go`:`Pick every ${p} the search has left`}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${a===void 0?v:k`<span class="pk-bar-said ${a.kind}">${a.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!r?this.renderDeleteAsk(i,e):k`<button type="button" class="ghost danger small" ?disabled=${s||r}
            title=${`Delete these ${u} from the library, and from every device they are on`}
            @click=${()=>this.toggleAsk()}>${L("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${s}
        title=${`Stop picking and go back to opening one ${p} at a time`}
        @click=${()=>this.endSelect()}>${L("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let i=X(e,t,W),n=Kt(i,t);return k`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${i.items.length===0}
        @click=${()=>{this.runDelete()}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,i){let n=t.item,s=i===void 0?[]:fe(Ee(e,i.ownerId)),r=s.length===0?[n]:s,d=this.hassNow?.states,a=this.icons,p=H/D.width,u=Zt(n,d,a),l=u.height*p,m=l>Q,x=P=>`${Math.round(P*100)/100}px`;return k`<span class="ap-pic ${m?"cut":""}" style=${`width:${x(H)};height:${x(Math.min(l,Q))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${x(-u.top*p)})`}>${Ve({page:n,pages:r,screen:D,scale:p,...d===void 0?{}:{states:d},...a===void 0?{}:{icons:a}})}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,i=H/D.width,n=d=>`${Math.round(d*100)/100}px`,r=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return k`<span class="ap-pic ap-pic-status ${r?"cut":""}" style=${`width:${n(H)};height:${n(Math.min(D.height*i,Q))}`}>
      <span class="ap-pic-in">${t===void 0?v:We({page:e.item,hass:t,icons:this.icons??he,screen:D,scale:i})}</span>
    </span>`}static{this.styles=[He,we,Ue,Ct,Dt,Xe,yt,It,Tt,ie`
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
  `]}};f([I({attribute:!1})],h.prototype,"kind",2),f([I({attribute:!1})],h.prototype,"owners",2),f([I({attribute:!1})],h.prototype,"ownersReady",2),f([I({attribute:!1})],h.prototype,"phones",2),f([I({attribute:!1})],h.prototype,"icons",2),f([I({attribute:!1})],h.prototype,"iconsTick",2),f([I({attribute:!1})],h.prototype,"onOpen",2),f([I({attribute:!1})],h.prototype,"onOpenLibrary",2),f([I({attribute:!1})],h.prototype,"focusOwner",2),f([I({attribute:!1})],h.prototype,"onFocus",2),f([I({attribute:!1})],h.prototype,"onOpenScreen",2),f([b()],h.prototype,"search",2),f([b()],h.prototype,"newForm",2),f([b()],h.prototype,"selecting",2),f([b()],h.prototype,"selected",2),f([b()],h.prototype,"asking",2),f([b()],h.prototype,"bulkBusy",2),f([b()],h.prototype,"bulkNote",2),f([b()],h.prototype,"tickNotes",2),f([b()],h.prototype,"untickAsk",2),f([b()],h.prototype,"picksBusy",2),f([b()],h.prototype,"picksNote",2),f([b()],h.prototype,"orderAsked",2),f([b()],h.prototype,"hiddenAsked",2),f([b()],h.prototype,"dragId",2),f([b()],h.prototype,"overId",2),f([b()],h.prototype,"freeFacts",2),f([b()],h.prototype,"saved",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",h);export{h as WaAllPages,Zt as pageCrop};
