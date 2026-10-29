import{a as mt,b as gt,c as wt,d as Ot,e as Bt}from"./chunk-5MYEPPKN.js";import{A as Ft,B as K,a as ut,b as kt,d as ft,e as w,f as M,g as bt,h as Z,i as vt,j as yt,k as $t,l as ee,m as xt,n as It,p as _,q as St,r as Dt,s as Lt,t as Nt,u as Tt,v as te,w as Pt,x as Ct,y as Rt,z as Et}from"./chunk-XOT77MJF.js";import{b as Ye,c as Ge,d as Xe}from"./chunk-UP3BWE4U.js";import{a as X,b as A,c as We,d as J,f as Qe,m as Ze}from"./chunk-A4CR2N2P.js";import{Cb as Ke,_a as Oe,bb as Be,nb as Ae,tb as Me,vb as _e}from"./chunk-DCHML7NN.js";import{cb as Fe}from"./chunk-L52ARLK5.js";import"./chunk-TRDMM2EO.js";import"./chunk-E657SR7H.js";import"./chunk-T55T6XQ2.js";import"./chunk-HJBHFQVL.js";import{b as et}from"./chunk-FJL63CNO.js";import{i as Ve,l as Ue}from"./chunk-YW4RFKOC.js";import{c as Q,d as Je}from"./chunk-6HJNTRM5.js";import"./chunk-Z4DPBZWT.js";import"./chunk-SFHJCCXR.js";import{b as tt,c as it,d as nt,e as st,f as rt,g as at,h as ot,i as dt,j as ct,q as pt,r as ht,t as lt}from"./chunk-JFQGPW4I.js";import{a as G,b as Ce,c as Re,m as He,n as ze,o as je,r as qe}from"./chunk-X3ZDULYI.js";import"./chunk-5ZDSCJMV.js";import{Aa as Se,Ba as B,L as ye,M as Y,la as I,m as q,oa as C,ta as $e,ua as xe,va as Ie}from"./chunk-4LPPD545.js";import{a as he,b as le,c as P,e as ue,f as ke,g as fe,h as me,i as O}from"./chunk-J2WKPEGJ.js";import"./chunk-ZOJGMATP.js";import"./chunk-722JN4KR.js";import{b as Te,c as Pe}from"./chunk-IY3QJX33.js";import"./chunk-JQOWE2OL.js";import{e as Ee}from"./chunk-ISWPREDT.js";import{f as ve,g as W}from"./chunk-IKXCDEYM.js";import{c as Le}from"./chunk-PXGVB47T.js";import{D as Ne}from"./chunk-DIXOCES3.js";import{o as pe,q as De}from"./chunk-KOIVGARS.js";import{k as ge,l as we,q as be}from"./chunk-HXO6JN4O.js";import"./chunk-V5M5YEMY.js";import"./chunk-ES6UTNDZ.js";import{Ge as j,Gg as ce,b as oe,d as h,g as b,j as de,k as S,l as v,sh as D}from"./chunk-7M7K7CM3.js";import{db as F}from"./chunk-OM34V22N.js";import{a as k}from"./chunk-LO2NM3CE.js";function Gt(d,p,e){return`${d} ${d===1?p:e}`}function At(d,p){let e=new Set(d);return e.has(p)?e.delete(p):e.add(p),e}function Mt(d,p,e,t){let i=new Set(d),n=p.indexOf(t),s=e===void 0?-1:p.indexOf(e);if(n<0)return i;if(s<0)return i.add(t),i;for(let r=Math.min(s,n);r<=Math.max(s,n);r++)i.add(p[r]);return i}function _t(d,p){return new Set([...d,...p])}function Kt(d,p){let e=new Set(p);return new Set([...d].filter(t=>!e.has(t)))}function Vt(d,p){let e=new Set(p);return new Set([...d].filter(t=>e.has(t)))}function $(d){return d.id.toUpperCase()}function V(d,p,e){let i={kind:d[0]?.kind??"pages",items:[],kept:[],devices:[]},n=new Set;for(let s of d){let r=p.filter(a=>s.owners.some(c=>I(c,a.ownerId))).map(a=>a.ownerId),o=r.filter(a=>e(a,s.kind));if(o.length>0){i.kept.push({name:s.name,dirty:o});continue}i.items.push({id:s.id,name:s.name,owners:[...s.owners]});for(let a of r)n.add(a)}return i.devices=p.map(s=>s.ownerId).filter(s=>n.has(s)),i}var R=(d,p)=>d.find(e=>I(e.ownerId,p))?.name??"a device";function ie(d,p){let e=d.items.length,t=e===1?"it":"them",i=`Delete ${e} ${w(d.kind,e)}?`,n=d.devices.map(o=>R(p,o)),s=d.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,r=[n.length===0?`${e===1?"It is":"They are"} on no device yet. ${G}`:`${e===1?"It comes":"They come"} off ${P(n)}, ${s}. ${G}`];for(let o of d.kept){let a=o.dirty.map(c=>R(p,c));r.push(`${o.name} stays: ${P(a)} ${a.length===1?"has":"have"} unsaved edits.`)}return{title:i,body:r.join(" ")}}async function Ut(d,p,e,t){let i={kind:p.kind,gone:[],kept:p.kept.map(s=>({...s,dirty:[...s.dirty]})),failed:[],stuck:[],taps:[]},n=new Map;for(let[s,r]of p.items.entries()){t?.(`Deleting ${r.name} (${s+1} of ${p.items.length})\u2026`);let o=await d.delete(p.kind,r.id);if(!o.ok){i.failed.push({name:r.name,text:o.text});continue}i.gone.push(r.name);for(let a of o.reply.link_failures??[]){let c=a.name??R(e,a.owner);i.stuck.includes(c)||i.stuck.push(c)}for(let a of r.owners)n.set(a,[...n.get(a)??[],r.id])}if(p.kind==="pages")for(let[s,r]of n){t?.(`Clearing complication taps on ${R(e,s)}\u2026`);let o=!1;try{o=await d.clearTaps(s,r)}catch{o=!1}o||i.taps.push(R(e,s))}return i}function ne(d){let p=n=>`${n} ${w(d.kind,n)}`,e=[];d.gone.length>0&&e.push(`Deleted ${d.gone.length===1?d.gone[0]:p(d.gone.length)}.`);let t=e.length>0,i=!1;for(let n of d.kept)i=!0,e.push(`Kept ${n.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let n of d.failed)i=!0,e.push(`Not deleted: ${n.name}. ${n.text}`);return d.stuck.length>0&&(i=!0,e.push(`Could not take ${d.gone.length===1?"it":"them"} off ${P(d.stuck)}.`)),d.taps.length>0&&(i=!0,e.push(`Could not clear the complication taps that opened ${d.gone.length===1?"it":"them"} on ${P(d.taps)}. Change those by hand.`)),!t&&!i?{kind:"ok",text:"Nothing was deleted."}:{kind:i?t?"warn":"err":"ok",text:e.join(" ")}}function Ht(d,p){return Gt(p,w(d),w(d,2))}var U=200,se=320,zt=6,T=Ne.screen;function Xt(d,p,e,t=T){if(be(d))return{top:0,height:t.height};let i=Oe(Be(d,p),t),n=[...i.tiles,..._e(d,t,{states:p})];if(n.length===0)return{top:0,height:t.height};let r=Ae(d,1,i.topInset,e)!==b?0:Math.max(0,i.topInset+Math.min(...n.map(a=>a.y))-zt),o=i.topInset+Math.max(...n.map(a=>a.y+a.height))+zt;return{top:r,height:Math.max(1,o-r)}}var Jt=2e3,jt=44,Qt=28,Wt={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"};function re(d){return["watch","iphone"].filter(p=>d.some(e=>e.kind===p))}var ae=new Map;function Yt(d){let p=ae.get(d);if(p!==void 0)return p;let e={view:"cards"};try{let t=window.localStorage.getItem(Wt[d]);(t?JSON.parse(t):{}).view==="board"&&(e.view="board")}catch{}return ae.set(d,e),e}function Zt(d,p){let e={...Yt(d),...p};ae.set(d,e);try{window.localStorage.setItem(Wt[d],JSON.stringify(e))}catch{}}var N=(d,p="pages")=>(p==="status_pages"?et(d)?.dirty:Qe(d)?.dirty)??!1,qt=(d,p)=>`${d}|${p.toUpperCase()}`,u=class extends de{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.saved=!1;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new He(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.photoTick=0;this.photos=new Ze(()=>this.hassNow,()=>{this.photoTick+=1,this.requestUpdate()});this.photoUrl=e=>this.photos.url(e);this.photoSize=e=>this.photos.size(e);this.photoGlow=e=>this.photos.glow(e);this.photoOn=e=>this.photos.onUrl(e);this.roomy=new rt(this);this.colorsFor=Pe();this.colorOf=e=>Te(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.itemAsk!==void 0?(e.preventDefault(),this.itemAsk=void 0):this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let i=Date.now();(t||i-this.hassDrawnAt>=Jt)&&(this.hassDrawnAt=i,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){if(e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged(),e.has("focusOwner")&&this.focusOwner!==void 0&&this.endSelect(!0),this.embedded&&e.has("searchText")&&(this.search=this.searchText),this.kind==="pages")for(let t of this.devices)this.freeAsked.has(t.ownerId)||this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return It(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===xt?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.embedded||this.filterDevice()!==void 0?"board":tt(this.kind,Yt(this.kind).view)}get devices(){return he(this.owners,this.phones)}waiting(e){let t=new Map;for(let i of this.devices)t.set(i.ownerId,{held:xe(e,i.ownerId,this.kind),free:!1});return me(this.owners,t)}setFocus(e){e!==void 0&&this.endSelect(!0),this.picksNote=void 0,this.onFocus?.(e)}setView(e){it(this.kind,e),Zt(this.kind,{view:e}),e==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},st)}setSearch(e){this.search=e,this.pruneSelected()}async newPage(e){let t=this.hassNow,i=this.lib.store;if(t===void 0||i===void 0||this.picksBusy)return;this.newForm=void 0;let n=this.kind;if(N(e.ownerId,n)){this.picksNote={kind:"warn",text:A(n,e.name)};return}let s=j(),r=this.nextCardName(),o=n==="status_pages"?Y(r,s):W(s,r);this.picksBusy=!0,this.picksNote=void 0;let a=!1;try{let c=await X(J(t),e.ownerId,n,{add:o});a=c.ok&&c.changed,c.ok||(this.picksNote={kind:"err",text:`Not made on ${e.name}. ${c.message}`})}catch(c){this.picksNote={kind:"err",text:F(c).message}}await i.refresh(),this.picksBusy=!1,a&&this.onOpenLibrary?.(n,s,e.ownerId)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!this.newForm?.busy){if(this.newForm!==void 0){this.newForm=void 0;return}this.newForm={name:this.nextCardName(),busy:!1,preview:re(this.devices)[0]},this.updateComplete.then(()=>gt(this.renderRoot))}}nextCardName(){let e=this.lib.library,t=e===void 0?[]:C(e,this.kind).map(i=>i.item);return this.kind==="status_pages"?ye({schemaVersion:1,statusPages:t}):ve({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let i=e.name.trim();if(i===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${w(this.kind)} a name.`}};return}let{note:n,...s}=e;this.newForm={...s,busy:!0};let r=j(),o=e.mapPage===!0?Ye(this.homeMapDoc()):void 0,a=this.kind==="status_pages"?{schemaVersion:1,statusPages:[Y(i,r)]}:{schemaVersion:1,pages:[o===void 0?W(r,i):Xe(r,i,o)]},c=await t.createItem(this.kind,a);if(!c.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${c.text}`}};return}this.newForm=void 0,lt(e.preview??re(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,c.reply.id)}open(e){this.onOpenLibrary?.(e.kind,e.id,this.focusOwner)}async tick(e,t,i){let n=this.lib.store;if(n===void 0)return;if(this.dropTickNote($(e)),this.untickAsk=void 0,!i){let m={item:e.name,device:this.devices.find(f=>f.ownerId===t)?.name??"the device"};this.untickAsk=await Je(this.hassNow,n,t,e.kind,e.id,m),this.untickAsk===void 0&&n.noteFor(e.kind,e.id)===void 0&&this.flashSaved();return}let s=$(e),r=await Q(this.hassNow,n,t,e.kind,e.id,!0);if(r.ok&&this.flashSaved(),!r.ok||e.kind!=="pages")return;let o=await this.readFree(t),a=this.lib.library,c=this.devices.find(m=>m.ownerId===t)?.name;if(!o||a===void 0||c===void 0||B(a,t,"pages")<2)return;let l=O([c]);l!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(s,{kind:"warn",text:`Added to ${c}. ${l}`}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let i=await Q(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names);i.ok&&this.flashSaved(),i.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set($({id:e.itemId}),i.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let n=(await ce(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==n&&(this.freeFacts=new Map(this.freeFacts).set(e,n)),n}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,i){let n=this.hassNow,s=this.lib.store;if(n===void 0||s===void 0||this.picksBusy)return;let r=this.kind;if(N(e.ownerId,r)){this.picksNote={kind:"warn",text:A(r,e.name)};return}let o=this.kindSeq,a="hidden"in t,c=qt(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,a?this.hiddenAsked=new Map(this.hiddenAsked).set(c,t.hidden):i!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:r,ids:Nt(i,t.id,t.before)});let l=this.orderAsked,m;try{let f=await X(J(n),e.ownerId,r,t);f.ok&&this.flashSaved(),f.ok||(m={kind:"err",text:`${a?"Not changed":"Not moved"} on ${e.name}: ${f.message.replace(/\.$/,"")}.`})}catch(f){m={kind:"err",text:F(f).message}}if(await s.refresh(),this.picksBusy=!1,a){let f=new Map(this.hiddenAsked);f.delete(c),this.hiddenAsked=f}else this.orderAsked===l&&(this.orderAsked=void 0);o===this.kindSeq&&(this.picksNote=m)}shownNow(){let e=this.lib.library;return e===void 0?[]:_(e,this.kind,this.search)}pickedItems(){return this.shownNow().filter(e=>this.selected.has($(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=Vt(this.selected,this.shownNow().map($)))}startSelect(){this.selecting=!0,this.itemAsk=void 0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let i=$(e);this.selected=t?Mt(this.selected,this.shownNow().map($),this.anchor,i):At(this.selected,i),this.anchor=i,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map($);this.selected=e?_t(this.selected,t):Kt(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}runDelete(){let e=this.pickedItems();e.length!==0&&(this.asking=!1,this.anchor=void 0,this.deleteEntries(e),this.pruneSelected())}deleteEntries(e){let t=this.hassNow,i=this.lib.store;if(t===void 0||i===void 0||this.bulkBusy!==void 0)return;let n=this.devices,s=V(e,n,N),r=ne({kind:s.kind,gone:[],kept:s.kept,failed:[],stuck:[],taps:[]});if(this.bulkNote=s.kept.length>0?r:void 0,s.items.length===0)return;let o=s.items.length;Re({text:`Deleted ${o===1?s.items[0].name:Ht(s.kind,o)}.`,hide:s.items.map(a=>Ce(s.kind,a.id)),send:async()=>{let a;try{a=ne(await Ut(We(t),{...s,kept:[]},n))}catch(c){a={kind:"err",text:F(c).message}}return await i.refresh(),a.kind==="ok"?void 0:a.text}})}renderItemDelete(e,t){return h`<button type="button" class=${t} title=${`Delete ${e.name}`} aria-label=${`Delete ${e.name}`}
      ?disabled=${this.bulkBusy!==void 0}
      @click=${i=>{i.stopPropagation(),this.itemAsk=$(e)}}>${D("delete")}</button>`}renderItemAsk(e,t,i){let n=V([e],t,N),s=ie(n,t),r=()=>{this.itemAsk=void 0},o=()=>{r(),this.deleteEntries([e])},a=i!==void 0&&e.owners.some(l=>I(l,i.ownerId))&&e.owners.some(l=>!I(l,i.ownerId))?i:void 0,c=n.items.length>0;return h`<div class="ap-ask" role="alertdialog" aria-label=${`Delete ${e.name}?`} @click=${l=>l.stopPropagation()}>
      <span><b>Delete ${e.name}?</b> ${s.body}</span>
      <span class="ap-ask-acts">
        ${c?a===void 0?h`<button type="button" class="ap-ask-btn danger" @click=${o}>Really delete</button>`:h`<button type="button" class="ap-ask-btn danger" title=${`Take it off ${a.name} only`}
              @click=${()=>{r(),this.tick(e,a.ownerId,!1)}}>${pt}</button>
            <button type="button" class="ap-ask-btn danger" title="Delete it on every device" @click=${o}>${ht}</button>`:b}
        <button type="button" class="ap-ask-btn" @click=${r}>${c?"Cancel":"Close"}</button>
      </span>
    </div>`}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return h`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let t=this.kind,i=this.lib.library,n=this.lib.readState,s=this.filterDevice(),r=w(t,2),o=this.view,a=i===void 0?n==="unsupported"?q:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${r}\u2026`:vt(C(i,t).length,t),c=i!==void 0&&n==="failed";return h`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${Z(t)}</h1>
          <p class="ap-lead">${a}</p>
        </div>
        ${e.length===0?b:this.renderNew(s,e)}
      </div>
      ${this.newForm===void 0?b:this.renderNewDialog(this.newForm,e)}
      ${c?h`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:b}
      <div class="pk-surface pk-page" role="region" aria-label=${`Your ${r}`}>
        <div class="pk-pin">
          ${this.renderHead(i,s,o)}
          ${this.selecting&&s===void 0?this.renderBar(e):b}
        </div>
        <div class="pk-body">
          ${i===void 0?h`<p class="ap-empty">${a}</p>`:s!==void 0?this.renderFocus(i,St(i,s,t,this.search),e):o==="board"?this.renderBoardAll(i,e):this.renderAll(i,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${$t(t,s,this.selecting&&s===void 0,o)}</span></div>
      </div>
    </div></div>`}renderEmbedded(){let e=this.lib.library,t=this.devices,i=w(this.kind,2),n=this.lib.readState;if(e===void 0){let r=n==="unsupported"?q:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${i}\u2026`;return h`<p class="ap-empty">${r}</p>`}if(t.length===0)return h`<p class="ap-empty">No device can have ${i}.</p>`;let s=C(e,this.kind).length===0?h`<p class="ap-empty">No ${i} yet.</p>`:this.renderBoardAll(e,t);return h`${this.saved?h`<span class="bd-saved ap-embed-saved" role="status">${D("check")}<span>Saved</span></span>`:b}${s}`}renderAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;let n=_(e,this.kind,this.search);if(n.length===0)return h`<p class="ap-empty">${K(t,this.search,this.kind)}</p>`;let s=this.waiting(e);return h`<div class="ap-grid" role="list">${n.map(r=>this.renderCard(e,r,t,s))}</div>`}renderEmptyLibrary(e,t){if(t.length===0||C(e,this.kind).length>0)return;let i=this.mayMake,n=this.waiting(e).size>0;return h`<div class="ap-empty-lib">
      <p>${yt(this.kind,i)}</p>
      ${n?h`<p class="ap-empty-wait">${fe(w(this.kind,2))}</p>`:b}
      ${i?h`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
        ${D("plus")}<span>New ${w(this.kind)}</span></button>`:b}
    </div>`}renderHead(e,t,i){let n=this.selecting,s=this.bulkBusy!==void 0,r=w(this.kind,2);return h`<div class="pk-head">
      ${t===void 0?h`<button type="button" class="pk-pick-btn ${n?"on":""}" aria-pressed=${n?"true":"false"}
        title=${n?`Back to opening one ${w(this.kind)} at a time`:`Pick several ${r} to delete together`}
        ?disabled=${s||e===void 0} @click=${()=>n?this.endSelect():this.startSelect()}>
        ${D("checklist")}<span>Multi select</span></button>`:b}
      ${at(i,o=>this.setView(o),r)}
      ${this.saved?h`<span class="bd-saved" role="status">${D("check")}<span>Saved</span></span>`:b}
      <label class="pk-search">
        ${D("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${r}`}
          @input=${o=>this.setSearch(o.target.value)} />
      </label>
    </div>`}renderNew(e,t){let i=`New ${w(this.kind)}`;if(e!==void 0)return h`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${M(this.kind)} on ${e.name}`}
          ?disabled=${this.picksBusy} @click=${()=>{this.newPage(e)}}>
          ${D("plus")}<span>${i}</span></button>
      </div>`;let n=this.mayMake,s=this.newForm!==void 0;return h`<div class="ap-new">
      <button type="button" class="ap-new-btn ${s?"on":""}" aria-expanded=${s?"true":"false"}
        ?disabled=${!n||this.newForm?.busy===!0}
        title=${n?`Make ${M(this.kind)} no device has yet`:bt(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${D("plus")}<span>${i}</span></button>
    </div>`}renderNewDialog(e,t){let i=Ge(this.homeMapDoc());return mt(this.kind,e,re(t),{onName:n=>{this.newForm={...e,name:n}},onPreview:n=>{this.newForm={...e,preview:n}},onMapPage:n=>{this.newForm={...e,mapPage:n}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}},this.kind==="pages"?i===void 0?{}:{refusal:i}:void 0)}homeMapDoc(){return pe(this.hassNow,()=>this.requestUpdate())?.doc}ticksInput(e,t,i,n){let s=this.lib.store,r=$(t),o=s?.noteFor(t.kind,t.id),a=o===void 0?this.tickNotes.get(r):{kind:"warn",text:o},c=this.untickAsk,l=c!==void 0&&c.kind===t.kind&&I(c.itemId,t.id)?c:void 0,m=this.hassNow?.user?.is_admin,f=t.kind==="pages"?Fe(t.item):[];return{library:e,kind:t.kind,itemId:t.id,devices:i,colorOf:this.colorOf,skips:f,...s===void 0?{}:{pending:s.pending},...a===void 0?{}:{note:a.text,noteKind:a.kind},...l===void 0?{}:{ask:{ownerId:l.ownerId,text:l.text,onRemove:()=>{this.untickNow(l)},onCancel:()=>{this.untickAsk=void 0}}},...m===void 0?{}:{admin:m},locked:x=>{let L=$e(e,x,t.kind,t.id);if(L&&N(x,t.kind))return A(t.kind,i.find(g=>g.ownerId===x)?.name??"This device");if(!L&&n.has(x))return ue}}}renderCardTicks(e,t,i,n){return je(this.ticksInput(e,t,i,n),(s,r)=>{this.tick(t,s,r)})}renderCard(e,t,i,n){let s=this.selecting,r=$(t),o=s&&this.selected.has(r),a=Tt(t,i),c=this.openTitle(t),l=f=>this.cardClick(f,t),m=!s&&this.itemAsk===r;return h`<div class="ap-card ${s?"picking":""} ${o?"picked":""} ${m?"asking":""}" role="listitem" data-card=${r}
      @click=${f=>{s&&l(f)}}>
      <div class="ap-top">
        ${s?h`<input type="checkbox" class="pk-card-pick" .checked=${De(o)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${c}
          @click=${f=>{f.stopPropagation(),this.pick(t,f.shiftKey)}} />`:b}
        <button type="button" class="ap-open" title=${c} tabindex=${s?"-1":"0"} @click=${l}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${ee(t)}</small>
        </button>
        ${s?b:this.renderItemDelete(t,"ap-del")}
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${c} @click=${l}>
        ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumb(e,t,a)}
      </button>
      ${this.renderCardTicks(e,t,i,n)}
      ${m?this.renderItemAsk(t,i):b}
    </div>`}openTitle(e){if(this.selecting){let t=this.selected.has($(e));return`${t?"Let":"Pick"} ${e.name}${t?" go":""}`}return te(e.name)}boardColumns(e,t){return t.map(i=>({device:i,color:this.colorOf(i.ownerId),count:B(e,i.ownerId,this.kind)}))}renderBoardAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;if(t.length===0)return h`<p class="ap-empty">${K(t,this.search,this.kind)}</p>`;let n=this.waiting(e),s=_(e,this.kind,this.search);return this.renderBoardOf(e,t,[{key:"all",rows:s.map(r=>this.boardRow(e,r,t,n)),empty:K(t,this.search,this.kind)}])}renderBoardOf(e,t,i,n){let s=w(this.kind),r=w(this.kind,2);return ot({label:`${Z(this.kind)} on each device`,thing:s.charAt(0).toUpperCase()+s.slice(1),columns:this.boardColumns(e,t),...n===void 0?{}:{focus:n},onFocus:o=>this.setFocus(o),wide:this.roomy.wide,focusWord:"Order",focusTitle:o=>`Show ${o.name}'s ${r} first, in its order`,sections:i})}boardRow(e,t,i,n,s){let r=this.ticksInput(e,t,i,n),o=ze(r),a=t.kind==="pages"?t.item:void 0,c=a===void 0?0:we(a).length,l=a!==void 0&&c>0&&(r.skips?.length??0)>=c,m=o.map(g=>{let y={chip:g,onPick:H=>{this.tick(t,g.ownerId,H)}};g.on&&g.device==="watch"&&l?(y.note="shows nothing",y.noteWarn=!0,y.noteTitle=`Every tile on ${t.name} is iPhone only, so ${g.name} shows an empty page.`):g.skips!==void 0&&(y.note=g.skips.text,y.noteTitle=g.skips.title);let E=this.freeNote(e,t,g.ownerId,g.name,g.on);if(E!==void 0&&y.note===void 0&&Object.assign(y,E),s?.pick!==void 0&&I(g.ownerId,s.device.ownerId)&&t.kind==="pages"){let H=qt(s.device.ownerId,t.id),z=this.hiddenAsked.get(H)??s.pick.hidden;y.eye={hidden:z,busy:this.picksBusy,title:z?`Show ${t.name} on ${s.device.name} again`:`Hide here: keep ${t.name} on ${s.device.name} without showing it`,onToggle:()=>{this.changePicks(s.device,{id:t.id,hidden:!z})}}}return y}),f=this.selecting&&s===void 0,x=$(t),L={key:x,name:t.name,detail:ee(t),picture:this.rowPicture(t,s?.pick!==void 0?s.device:void 0),openTitle:s?.pick!==void 0?`${te(t.name)}. Alt+Up or Alt+Down moves it.`:this.openTitle(t),onOpen:g=>{if(s?.pick!==void 0&&!g.metaKey&&!g.ctrlKey){this.open(t);return}this.cardClick(g,t)},cells:m,...s!==void 0&&s.pick===void 0?{dim:!0}:{},...s?.drag===void 0?{}:{drag:s.drag},...r.ask===void 0?{}:{ask:r.ask},...r.note===void 0?{}:{note:{text:r.note,kind:r.noteKind??"warn"}}};return f?L.select={picked:this.selected.has(x),disabled:this.bulkBusy!==void 0,label:this.openTitle(t),onPick:g=>this.pick(t,g.shiftKey)}:(L.actions=this.renderItemDelete(t,"bd-act danger"),this.itemAsk===x&&(L.under=this.renderItemAsk(t,i,s?.device))),L}freeNote(e,t,i,n,s){if(t.kind!=="pages"||!s||this.freeFacts.get(i)!==!0)return;let r=Ie(e,i,"pages").filter(a=>!a.hidden);if(r.length<2)return;let o=O([n]);return I(r[0].id,t.id)?{note:"1st page",...o===void 0?{}:{noteTitle:o}}:{note:"free: not shown",noteWarn:!0,...o===void 0?{}:{noteTitle:o}}}rowPicture(e,t){if(e.kind==="status_pages")return kt({page:e.item,hass:this.hassNow,width:this.roomy.size(jt),tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}});let i=this.appVersionOf(t);return ut({page:e.item,width:this.roomy.size(t?.kind==="iphone"?Qt:jt),tick:this.iconsTick,iphone:t?.kind==="iphone",...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...i===void 0?{}:{appVersion:i},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoTick:this.photoTick,...t?.kind==="iphone"?{homeMap:this.homeMapDoc()}:{}})}appVersionOf(e){return e===void 0?void 0:this.owners.find(t=>I(t.owner_watch_id,e.ownerId))?.app_version}renderFocus(e,t,i){let{device:n}=t,s=this.orderAsked,r=s!==void 0&&s.ownerId===n.ownerId&&s.kind===this.kind?s.ids:void 0,o=Dt(t.picks,r),a=o.map(y=>y.id),c=B(e,n.ownerId,this.kind),l=this.search.trim()===""&&!this.picksBusy,m=this.kind==="pages"&&this.freeFacts.get(n.ownerId)===!0&&c>1?O([n.name]):void 0,f=this.waiting(e),x=w(this.kind,2),L=o.map((y,E)=>this.boardRow(e,y.entry,i,f,{device:n,pick:y,drag:this.rowDrag(y,E,a,n,l)})),g=t.rest.map(y=>this.boardRow(e,y,i,f,{device:n}));return h`${this.renderFocusHead(n,c)}
      ${this.picksNote===void 0?b:h`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${m===void 0?b:h`<p class="lt-line">${m}</p>`}
      ${this.renderBoardOf(e,i,[{key:"on",title:Pt(n),count:c,hint:Ct(n),rows:L,empty:f.has(n.ownerId)&&this.search.trim()===""?ke(x,n.name):Ft(n,this.kind,this.search,t.rest.length,this.mayMake)},...Et(c,t.rest.length,this.search)?[{key:"rest",title:Rt(n),count:t.rest.length,hint:`Tick its box under ${n.name} to add it.`,rows:g,empty:this.search.trim()===""?`Every ${w(this.kind)} in your home is on ${n.name}.`:`No other ${w(this.kind)} has that name.`}]:[]],n.ownerId)}
      <p class="lt-line bd-foot-line">${c} ${c===1?w(this.kind):x} on ${n.name}.</p>`}renderFocusHead(e,t){let i=le(e.kind),n=w(this.kind,t),s=e.kind==="watch"?["settings","rooms","voice"]:["settings","rooms"],r=this.colorOf(e.ownerId);return h`<div class="bd-focus" style=${r===void 0?b:`--dc:${r}`}>
      <span class="bd-focus-glyph" aria-hidden="true">${D(e.kind==="iphone"?"phone":"watch")}</span>
      <span class="bd-focus-t"><b>${e.name}</b> <span>${t} ${n}, in the order the ${i} ${this.kind==="pages"?"shows":"keeps"} them</span></span>
      ${this.onOpenScreen===void 0?b:h`<span class="bd-focus-own">Also on this ${i}:
        ${s.map(o=>h`<button type="button" class="bd-link" @click=${()=>this.onOpenScreen?.(e.ownerId,e.kind,o)}>${nt[o]}</button>`)}</span>`}
      <button type="button" class="bd-focus-all" @click=${()=>this.setFocus(void 0)}>${D("grid")}<span>All devices</span></button>
    </div>`}rowDrag(e,t,i,n,s){let r=this.overId!==void 0&&I(this.overId,e.id)&&this.dragId!==void 0&&!I(this.dragId,e.id),o=a=>{a!==void 0&&this.changePicks(n,{id:e.id,before:a},[...i])};return{on:s,dragging:this.dragId!==void 0&&I(this.dragId,e.id),over:r,below:r&&i.findIndex(a=>I(a,this.dragId))<t,onStart:a=>{s&&(this.dragId=e.id,a.dataTransfer?.setData("text/plain",e.id),a.dataTransfer&&(a.dataTransfer.effectAllowed="move"))},onOver:a=>{this.dragId!==void 0&&(a.preventDefault(),this.overId!==e.id&&(this.overId=e.id))},onDrop:a=>{a.preventDefault();let c=this.dragId;this.dragId=void 0,this.overId=void 0;let l=c===void 0?void 0:Lt(i,c,e.id);l!==void 0&&this.changePicks(n,l,[...i])},onEnd:()=>{this.dragId=void 0,this.overId=void 0},onKey:a=>{!a.altKey||!s||a.key!=="ArrowUp"&&a.key!=="ArrowDown"||(a.preventDefault(),a.key==="ArrowUp"?o(t>0?i[t-1]:void 0):o(t<i.length-1?i[t+2]??null:void 0))}}}renderBar(e){let t=this.shownNow(),i=t.filter(m=>this.selected.has($(m))),n=i.length,s=this.bulkBusy!==void 0,r=n===0,o=t.length>0&&t.every(m=>this.selected.has($(m))),a=s?void 0:this.bulkNote,c=w(this.kind),l=w(this.kind,2);return h`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${l}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?`Pick ${M(this.kind)} to start.`:`${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${s||t.length===0}
        title=${o?`Let the ${l} on screen go`:`Pick every ${c} the search has left`}
        @click=${()=>this.selectShown(!o)}>${o?"None":"All shown"}</button>
      ${a===void 0?b:h`<span class="pk-bar-said ${a.kind}">${a.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!r?this.renderDeleteAsk(i,e):h`<button type="button" class="ghost danger small" ?disabled=${s||r}
            title=${`Delete these ${l} from every device they are on`}
            @click=${()=>this.toggleAsk()}>${D("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${s}
        title=${`Stop picking and go back to opening one ${c} at a time`}
        @click=${()=>this.endSelect()}>${D("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let i=V(e,t,N),n=ie(i,t);return h`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${i.items.length===0}
        @click=${()=>this.runDelete()}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,i){let n=t.item,s=i===void 0?[]:ge(Se(e,i.ownerId)),r=s.length===0?[n]:s,o=this.hassNow?.states,a=this.icons,c=U/T.width,l=Xt(n,o,a),m=l.height*c,f=m>se,x=g=>`${Math.round(g*100)/100}px`,L=i?.kind==="watch"?this.appVersionOf(i):void 0;return h`<span class="ap-pic ${f?"cut":""}" style=${`width:${x(U)};height:${x(Math.min(m,se))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${x(-l.top*c)})`}>${Me({page:n,pages:r,screen:T,scale:c,...o===void 0?{}:{states:o},...a===void 0?{}:{icons:a},...L===void 0?{}:{appVersion:L}})}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,i=U/T.width,n=o=>`${Math.round(o*100)/100}px`,r=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return h`<span class="ap-pic ap-pic-status ${r?"cut":""}" style=${`width:${n(U)};height:${n(Math.min(T.height*i,se))}`}>
      <span class="ap-pic-in">${t===void 0?b:Ve({page:e.item,hass:t,icons:this.icons??Le,screen:T,scale:i})}</span>
    </span>`}static{this.styles=[Ke,Ee,Ue,Bt,Ot,qe,ft,wt,dt,ct,oe`
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
  `]}};k([S({attribute:!1})],u.prototype,"kind",2),k([S({attribute:!1})],u.prototype,"owners",2),k([S({attribute:!1})],u.prototype,"ownersReady",2),k([S({attribute:!1})],u.prototype,"phones",2),k([S({attribute:!1})],u.prototype,"icons",2),k([S({attribute:!1})],u.prototype,"iconsTick",2),k([S({attribute:!1})],u.prototype,"onOpenLibrary",2),k([S({attribute:!1})],u.prototype,"focusOwner",2),k([S({attribute:!1})],u.prototype,"onFocus",2),k([S({attribute:!1})],u.prototype,"onOpenScreen",2),k([S({type:Boolean,reflect:!0})],u.prototype,"embedded",2),k([S({attribute:!1})],u.prototype,"searchText",2),k([v()],u.prototype,"search",2),k([v()],u.prototype,"newForm",2),k([v()],u.prototype,"selecting",2),k([v()],u.prototype,"selected",2),k([v()],u.prototype,"asking",2),k([v()],u.prototype,"bulkBusy",2),k([v()],u.prototype,"itemAsk",2),k([v()],u.prototype,"bulkNote",2),k([v()],u.prototype,"tickNotes",2),k([v()],u.prototype,"untickAsk",2),k([v()],u.prototype,"picksBusy",2),k([v()],u.prototype,"picksNote",2),k([v()],u.prototype,"orderAsked",2),k([v()],u.prototype,"hiddenAsked",2),k([v()],u.prototype,"dragId",2),k([v()],u.prototype,"overId",2),k([v()],u.prototype,"freeFacts",2),k([v()],u.prototype,"saved",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",u);export{u as WaAllPages,Xt as pageCrop};
