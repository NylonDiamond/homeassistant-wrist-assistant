import{a as kt,b as ft,c as mt,d as Et,e as Ot}from"./chunk-VYVF5HNR.js";import{A as Rt,B as A,a as ht,b as lt,d as ut,e as w,f as F,g as gt,h as J,i as wt,j as bt,k as vt,l as Q,m as yt,n as $t,p as M,q as xt,r as It,s as St,t as Dt,u as Lt,v as Z,w as Nt,x as Tt,y as Pt,z as Ct}from"./chunk-XONZNC74.js";import{b as qe,c as We,d as Ye}from"./chunk-6Q2G5XNI.js";import{a as Y,b as B,c as je,d as G,f as Xe,m as Je}from"./chunk-RKIDPZT4.js";import{$a as Ee,Db as Ae,cb as Oe,ob as Be,ub as Fe,wb as Me}from"./chunk-MI5HTX45.js";import{cb as Re}from"./chunk-UPJ243IZ.js";import"./chunk-HAHQWIJX.js";import"./chunk-YSP7TN3K.js";import"./chunk-X3HTP33H.js";import"./chunk-KUKMIXHV.js";import{b as Qe}from"./chunk-IHRMYW7N.js";import{i as _e,l as Ke}from"./chunk-53XQE6JJ.js";import{c as X,d as Ge}from"./chunk-ONFIIUVR.js";import"./chunk-UTHVPKKT.js";import"./chunk-2ICJ2IED.js";import{b as Ze,c as et,d as tt,e as it,f as nt,g as st,h as rt,i as at,j as ot,q as dt,r as ct,t as pt}from"./chunk-QY4TT7TB.js";import{a as W,b as Te,c as Pe,m as Ve,n as Ue,o as He,r as ze}from"./chunk-3K3CFRDD.js";import"./chunk-LWSVU6XZ.js";import{Aa as xe,Ba as O,L as ve,M as q,la as S,m as z,oa as C,ta as ye,ua as $e}from"./chunk-IZUWXV63.js";import{a as ce,b as pe,c as P,e as he,f as le,g as ue,h as ke,i as fe}from"./chunk-7J47EY3D.js";import"./chunk-ZOJGMATP.js";import"./chunk-HTSNVWE6.js";import{b as Le,c as Ne}from"./chunk-ZFOXVIFH.js";import"./chunk-45USHLDA.js";import{e as Ce}from"./chunk-XFJ2IPPI.js";import{f as be,g as j}from"./chunk-3OBV6BAV.js";import{c as Se}from"./chunk-4JVLJXHA.js";import{D as De}from"./chunk-L5KIXY7T.js";import{o as de,q as Ie}from"./chunk-TFWRCIKT.js";import{k as me,l as ge,q as we}from"./chunk-PPAEDG6P.js";import"./chunk-RDES6BO4.js";import"./chunk-DKSPQ66F.js";import{Ie as H,Ig as oe,b as re,d as h,g as b,j as ae,k as x,l as v,uh as I}from"./chunk-CHVZRGNE.js";import{db as E}from"./chunk-YL2NAPV5.js";import{a as k}from"./chunk-LO2NM3CE.js";function Wt(d,p,e){return`${d} ${d===1?p:e}`}function Bt(d,p){let e=new Set(d);return e.has(p)?e.delete(p):e.add(p),e}function Ft(d,p,e,t){let i=new Set(d),n=p.indexOf(t),s=e===void 0?-1:p.indexOf(e);if(n<0)return i;if(s<0)return i.add(t),i;for(let r=Math.min(s,n);r<=Math.max(s,n);r++)i.add(p[r]);return i}function Mt(d,p){return new Set([...d,...p])}function At(d,p){let e=new Set(p);return new Set([...d].filter(t=>!e.has(t)))}function _t(d,p){let e=new Set(p);return new Set([...d].filter(t=>e.has(t)))}function y(d){return d.id.toUpperCase()}function _(d,p,e){let i={kind:d[0]?.kind??"pages",items:[],kept:[],devices:[]},n=new Set;for(let s of d){let r=p.filter(a=>s.owners.some(c=>S(c,a.ownerId))).map(a=>a.ownerId),o=r.filter(a=>e(a,s.kind));if(o.length>0){i.kept.push({name:s.name,dirty:o});continue}i.items.push({id:s.id,name:s.name,owners:[...s.owners]});for(let a of r)n.add(a)}return i.devices=p.map(s=>s.ownerId).filter(s=>n.has(s)),i}var R=(d,p)=>d.find(e=>S(e.ownerId,p))?.name??"a device";function ee(d,p){let e=d.items.length,t=e===1?"it":"them",i=`Delete ${e} ${w(d.kind,e)}?`,n=d.devices.map(o=>R(p,o)),s=d.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,r=[n.length===0?`${e===1?"It is":"They are"} on no device yet. ${W}`:`${e===1?"It comes":"They come"} off ${P(n)}, ${s}. ${W}`];for(let o of d.kept){let a=o.dirty.map(c=>R(p,c));r.push(`${o.name} stays: ${P(a)} ${a.length===1?"has":"have"} unsaved edits.`)}return{title:i,body:r.join(" ")}}async function Kt(d,p,e,t){let i={kind:p.kind,gone:[],kept:p.kept.map(s=>({...s,dirty:[...s.dirty]})),failed:[],stuck:[],taps:[]},n=new Map;for(let[s,r]of p.items.entries()){t?.(`Deleting ${r.name} (${s+1} of ${p.items.length})\u2026`);let o=await d.delete(p.kind,r.id);if(!o.ok){i.failed.push({name:r.name,text:o.text});continue}i.gone.push(r.name);for(let a of o.reply.link_failures??[]){let c=a.name??R(e,a.owner);i.stuck.includes(c)||i.stuck.push(c)}for(let a of r.owners)n.set(a,[...n.get(a)??[],r.id])}if(p.kind==="pages")for(let[s,r]of n){t?.(`Clearing complication taps on ${R(e,s)}\u2026`);let o=!1;try{o=await d.clearTaps(s,r)}catch{o=!1}o||i.taps.push(R(e,s))}return i}function te(d){let p=n=>`${n} ${w(d.kind,n)}`,e=[];d.gone.length>0&&e.push(`Deleted ${d.gone.length===1?d.gone[0]:p(d.gone.length)}.`);let t=e.length>0,i=!1;for(let n of d.kept)i=!0,e.push(`Kept ${n.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let n of d.failed)i=!0,e.push(`Not deleted: ${n.name}. ${n.text}`);return d.stuck.length>0&&(i=!0,e.push(`Could not take ${d.gone.length===1?"it":"them"} off ${P(d.stuck)}.`)),d.taps.length>0&&(i=!0,e.push(`Could not clear the complication taps that opened ${d.gone.length===1?"it":"them"} on ${P(d.taps)}. Change those by hand.`)),!t&&!i?{kind:"ok",text:"Nothing was deleted."}:{kind:i?t?"warn":"err":"ok",text:e.join(" ")}}function Vt(d,p){return Wt(p,w(d),w(d,2))}var K=200,ie=320,Ut=6,T=De.screen;function Yt(d,p,e,t=T){if(we(d))return{top:0,height:t.height};let i=Ee(Oe(d,p),t),n=[...i.tiles,...Me(d,t,{states:p})];if(n.length===0)return{top:0,height:t.height};let r=Be(d,1,i.topInset,e)!==b?0:Math.max(0,i.topInset+Math.min(...n.map(a=>a.y))-Ut),o=i.topInset+Math.max(...n.map(a=>a.y+a.height))+Ut;return{top:r,height:Math.max(1,o-r)}}var Gt=2e3,Ht=44,Xt=28,jt={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"};function ne(d){return["watch","iphone"].filter(p=>d.some(e=>e.kind===p))}var se=new Map;function qt(d){let p=se.get(d);if(p!==void 0)return p;let e={view:"cards"};try{let t=window.localStorage.getItem(jt[d]);(t?JSON.parse(t):{}).view==="board"&&(e.view="board")}catch{}return se.set(d,e),e}function Jt(d,p){let e={...qt(d),...p};se.set(d,e);try{window.localStorage.setItem(jt[d],JSON.stringify(e))}catch{}}var N=(d,p="pages")=>(p==="status_pages"?Qe(d)?.dirty:Xe(d)?.dirty)??!1,zt=(d,p)=>`${d}|${p.toUpperCase()}`,u=class extends ae{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.saved=!1;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new Ve(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.photoTick=0;this.photos=new Je(()=>this.hassNow,()=>{this.photoTick+=1,this.requestUpdate()});this.photoUrl=e=>this.photos.url(e);this.photoSize=e=>this.photos.size(e);this.photoGlow=e=>this.photos.glow(e);this.photoOn=e=>this.photos.onUrl(e);this.photoOnMask=e=>this.photos.onMask(e);this.roomy=new nt(this);this.colorsFor=Ne();this.colorOf=e=>Le(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.itemAsk!==void 0?(e.preventDefault(),this.itemAsk=void 0):this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let i=Date.now();(t||i-this.hassDrawnAt>=Gt)&&(this.hassDrawnAt=i,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){if(e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged(),e.has("focusOwner")&&this.focusOwner!==void 0&&this.endSelect(!0),this.embedded&&e.has("searchText")&&(this.search=this.searchText),this.kind==="pages")for(let t of this.devices)this.freeAsked.has(t.ownerId)||this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return $t(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===yt?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.embedded||this.filterDevice()!==void 0?"board":Ze(this.kind,qt(this.kind).view)}get devices(){return ce(this.owners,this.phones)}waiting(e){let t=new Map;for(let i of this.devices)t.set(i.ownerId,{held:$e(e,i.ownerId,this.kind),free:!1});return ke(this.owners,t)}setFocus(e){e!==void 0&&this.endSelect(!0),this.picksNote=void 0,this.onFocus?.(e)}setView(e){et(this.kind,e),Jt(this.kind,{view:e}),e==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},it)}setSearch(e){this.search=e,this.pruneSelected()}async newPage(e){let t=this.hassNow,i=this.lib.store;if(t===void 0||i===void 0||this.picksBusy)return;this.newForm=void 0;let n=this.kind;if(N(e.ownerId,n)){this.picksNote={kind:"warn",text:B(n,e.name)};return}let s=H(),r=this.nextCardName(),o=n==="status_pages"?q(r,s):j(s,r);this.picksBusy=!0,this.picksNote=void 0;let a=!1;try{let c=await Y(G(t),e.ownerId,n,{add:o});a=c.ok&&c.changed,c.ok||(this.picksNote={kind:"err",text:`Not made on ${e.name}. ${c.message}`})}catch(c){this.picksNote={kind:"err",text:E(c).message}}await i.refresh(),this.picksBusy=!1,a&&this.onOpenLibrary?.(n,s,e.ownerId)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!this.newForm?.busy){if(this.newForm!==void 0){this.newForm=void 0;return}this.newForm={name:this.nextCardName(),busy:!1,preview:ne(this.devices)[0]},this.updateComplete.then(()=>ft(this.renderRoot))}}nextCardName(){let e=this.lib.library,t=e===void 0?[]:C(e,this.kind).map(i=>i.item);return this.kind==="status_pages"?ve({schemaVersion:1,statusPages:t}):be({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let i=e.name.trim();if(i===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${w(this.kind)} a name.`}};return}let{note:n,...s}=e;this.newForm={...s,busy:!0};let r=H(),o=e.mapPage===!0?qe(this.homeMapDoc()):void 0,a=this.kind==="status_pages"?{schemaVersion:1,statusPages:[q(i,r)]}:{schemaVersion:1,pages:[o===void 0?j(r,i):Ye(r,i,o)]},c=await t.createItem(this.kind,a);if(!c.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${c.text}`}};return}this.newForm=void 0,pt(e.preview??ne(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,c.reply.id)}open(e){this.onOpenLibrary?.(e.kind,e.id,this.focusOwner)}async tick(e,t,i){let n=this.lib.store;if(n===void 0)return;if(this.dropTickNote(y(e)),this.untickAsk=void 0,!i){let m={item:e.name,device:this.devices.find(g=>g.ownerId===t)?.name??"the device"};this.untickAsk=await Ge(this.hassNow,n,t,e.kind,e.id,m),this.untickAsk===void 0&&n.noteFor(e.kind,e.id)===void 0&&this.flashSaved();return}let s=y(e),r=await X(this.hassNow,n,t,e.kind,e.id,!0);if(r.ok&&this.flashSaved(),!r.ok||e.kind!=="pages")return;let o=await this.readFree(t),a=this.lib.library,c=this.devices.find(m=>m.ownerId===t)?.name;if(!o||a===void 0||c===void 0||O(a,t,"pages")<2)return;let l=fe([c]);l!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(s,{kind:"ok",text:l}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let i=await X(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names);i.ok&&this.flashSaved(),i.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(y({id:e.itemId}),i.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let n=(await oe(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==n&&(this.freeFacts=new Map(this.freeFacts).set(e,n)),n}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,i){let n=this.hassNow,s=this.lib.store;if(n===void 0||s===void 0||this.picksBusy)return;let r=this.kind;if(N(e.ownerId,r)){this.picksNote={kind:"warn",text:B(r,e.name)};return}let o=this.kindSeq,a="hidden"in t,c=zt(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,a?this.hiddenAsked=new Map(this.hiddenAsked).set(c,t.hidden):i!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:r,ids:Dt(i,t.id,t.before)});let l=this.orderAsked,m;try{let g=await Y(G(n),e.ownerId,r,t);g.ok&&this.flashSaved(),g.ok||(m={kind:"err",text:`${a?"Not changed":"Not moved"} on ${e.name}: ${g.message.replace(/\.$/,"")}.`})}catch(g){m={kind:"err",text:E(g).message}}if(await s.refresh(),this.picksBusy=!1,a){let g=new Map(this.hiddenAsked);g.delete(c),this.hiddenAsked=g}else this.orderAsked===l&&(this.orderAsked=void 0);o===this.kindSeq&&(this.picksNote=m)}shownNow(){let e=this.lib.library;return e===void 0?[]:M(e,this.kind,this.search)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(y(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=_t(this.selected,this.shownNow().map(y)))}startSelect(){this.selecting=!0,this.itemAsk=void 0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let i=y(e);this.selected=t?Ft(this.selected,this.shownNow().map(y),this.anchor,i):Bt(this.selected,i),this.anchor=i,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(y);this.selected=e?Mt(this.selected,t):At(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}runDelete(){let e=this.pickedItems();e.length!==0&&(this.asking=!1,this.anchor=void 0,this.deleteEntries(e),this.pruneSelected())}deleteEntries(e){let t=this.hassNow,i=this.lib.store;if(t===void 0||i===void 0||this.bulkBusy!==void 0)return;let n=this.devices,s=_(e,n,N),r=te({kind:s.kind,gone:[],kept:s.kept,failed:[],stuck:[],taps:[]});if(this.bulkNote=s.kept.length>0?r:void 0,s.items.length===0)return;let o=s.items.length;Pe({text:`Deleted ${o===1?s.items[0].name:Vt(s.kind,o)}.`,hide:s.items.map(a=>Te(s.kind,a.id)),send:async()=>{let a;try{a=te(await Kt(je(t),{...s,kept:[]},n))}catch(c){a={kind:"err",text:E(c).message}}return await i.refresh(),a.kind==="ok"?void 0:a.text}})}renderItemDelete(e,t){return h`<button type="button" class=${t} title=${`Delete ${e.name}`} aria-label=${`Delete ${e.name}`}
      ?disabled=${this.bulkBusy!==void 0}
      @click=${i=>{i.stopPropagation(),this.itemAsk=y(e)}}>${I("delete")}</button>`}renderItemAsk(e,t,i){let n=_([e],t,N),s=ee(n,t),r=()=>{this.itemAsk=void 0},o=()=>{r(),this.deleteEntries([e])},a=i!==void 0&&e.owners.some(l=>S(l,i.ownerId))&&e.owners.some(l=>!S(l,i.ownerId))?i:void 0,c=n.items.length>0;return h`<div class="ap-ask" role="alertdialog" aria-label=${`Delete ${e.name}?`} @click=${l=>l.stopPropagation()}>
      <span><b>Delete ${e.name}?</b> ${s.body}</span>
      <span class="ap-ask-acts">
        ${c?a===void 0?h`<button type="button" class="ap-ask-btn danger" @click=${o}>Really delete</button>`:h`<button type="button" class="ap-ask-btn danger" title=${`Take it off ${a.name} only`}
              @click=${()=>{r(),this.tick(e,a.ownerId,!1)}}>${dt}</button>
            <button type="button" class="ap-ask-btn danger" title="Delete it on every device" @click=${o}>${ct}</button>`:b}
        <button type="button" class="ap-ask-btn" @click=${r}>${c?"Cancel":"Close"}</button>
      </span>
    </div>`}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return h`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let t=this.kind,i=this.lib.library,n=this.lib.readState,s=this.filterDevice(),r=w(t,2),o=this.view,a=i===void 0?n==="unsupported"?z:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${r}\u2026`:wt(C(i,t).length,t),c=i!==void 0&&n==="failed";return h`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${J(t)}</h1>
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
          ${i===void 0?h`<p class="ap-empty">${a}</p>`:s!==void 0?this.renderFocus(i,xt(i,s,t,this.search),e):o==="board"?this.renderBoardAll(i,e):this.renderAll(i,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${vt(t,s,this.selecting&&s===void 0,o)}</span></div>
      </div>
    </div></div>`}renderEmbedded(){let e=this.lib.library,t=this.devices,i=w(this.kind,2),n=this.lib.readState;if(e===void 0){let r=n==="unsupported"?z:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${i}\u2026`;return h`<p class="ap-empty">${r}</p>`}if(t.length===0)return h`<p class="ap-empty">No device can have ${i}.</p>`;let s=C(e,this.kind).length===0?h`<p class="ap-empty">No ${i} yet.</p>`:this.renderBoardAll(e,t);return h`${this.saved?h`<span class="bd-saved ap-embed-saved" role="status">${I("check")}<span>Saved</span></span>`:b}${s}`}renderAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;let n=M(e,this.kind,this.search);if(n.length===0)return h`<p class="ap-empty">${A(t,this.search,this.kind)}</p>`;let s=this.waiting(e);return h`<div class="ap-grid" role="list">${n.map(r=>this.renderCard(e,r,t,s))}</div>`}renderEmptyLibrary(e,t){if(t.length===0||C(e,this.kind).length>0)return;let i=this.mayMake,n=this.waiting(e).size>0;return h`<div class="ap-empty-lib">
      <p>${bt(this.kind,i)}</p>
      ${n?h`<p class="ap-empty-wait">${ue(w(this.kind,2))}</p>`:b}
      ${i?h`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
        ${I("plus")}<span>New ${w(this.kind)}</span></button>`:b}
    </div>`}renderHead(e,t,i){let n=this.selecting,s=this.bulkBusy!==void 0,r=w(this.kind,2);return h`<div class="pk-head">
      ${t===void 0?h`<button type="button" class="pk-pick-btn ${n?"on":""}" aria-pressed=${n?"true":"false"}
        title=${n?`Back to opening one ${w(this.kind)} at a time`:`Pick several ${r} to delete together`}
        ?disabled=${s||e===void 0} @click=${()=>n?this.endSelect():this.startSelect()}>
        ${I("checklist")}<span>Multi select</span></button>`:b}
      ${st(i,o=>this.setView(o),r)}
      ${this.saved?h`<span class="bd-saved" role="status">${I("check")}<span>Saved</span></span>`:b}
      <label class="pk-search">
        ${I("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${r}`}
          @input=${o=>this.setSearch(o.target.value)} />
      </label>
    </div>`}renderNew(e,t){let i=`New ${w(this.kind)}`;if(e!==void 0)return h`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${F(this.kind)} on ${e.name}`}
          ?disabled=${this.picksBusy} @click=${()=>{this.newPage(e)}}>
          ${I("plus")}<span>${i}</span></button>
      </div>`;let n=this.mayMake,s=this.newForm!==void 0;return h`<div class="ap-new">
      <button type="button" class="ap-new-btn ${s?"on":""}" aria-expanded=${s?"true":"false"}
        ?disabled=${!n||this.newForm?.busy===!0}
        title=${n?`Make ${F(this.kind)} no device has yet`:gt(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${I("plus")}<span>${i}</span></button>
    </div>`}renderNewDialog(e,t){let i=We(this.homeMapDoc());return kt(this.kind,e,ne(t),{onName:n=>{this.newForm={...e,name:n}},onPreview:n=>{this.newForm={...e,preview:n}},onMapPage:n=>{this.newForm={...e,mapPage:n}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}},this.kind==="pages"?i===void 0?{}:{refusal:i}:void 0)}homeMapDoc(){return de(this.hassNow,()=>this.requestUpdate())?.doc}ticksInput(e,t,i,n){let s=this.lib.store,r=y(t),o=s?.noteFor(t.kind,t.id),a=o===void 0?this.tickNotes.get(r):{kind:"warn",text:o},c=this.untickAsk,l=c!==void 0&&c.kind===t.kind&&S(c.itemId,t.id)?c:void 0,m=this.hassNow?.user?.is_admin,g=t.kind==="pages"?Re(t.item):[];return{library:e,kind:t.kind,itemId:t.id,devices:i,colorOf:this.colorOf,skips:g,...s===void 0?{}:{pending:s.pending},...a===void 0?{}:{note:a.text,noteKind:a.kind},...l===void 0?{}:{ask:{ownerId:l.ownerId,text:l.text,onRemove:()=>{this.untickNow(l)},onCancel:()=>{this.untickAsk=void 0}}},...m===void 0?{}:{admin:m},locked:$=>{let D=ye(e,$,t.kind,t.id);if(D&&N($,t.kind))return B(t.kind,i.find(f=>f.ownerId===$)?.name??"This device");if(!D&&n.has($))return he}}}renderCardTicks(e,t,i,n){return He(this.ticksInput(e,t,i,n),(s,r)=>{this.tick(t,s,r)})}renderCard(e,t,i,n){let s=this.selecting,r=y(t),o=s&&this.selected.has(r),a=Lt(t,i),c=this.openTitle(t),l=g=>this.cardClick(g,t),m=!s&&this.itemAsk===r;return h`<div class="ap-card ${s?"picking":""} ${o?"picked":""} ${m?"asking":""}" role="listitem" data-card=${r}
      @click=${g=>{s&&l(g)}}>
      <div class="ap-top">
        ${s?h`<input type="checkbox" class="pk-card-pick" .checked=${Ie(o)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${c}
          @click=${g=>{g.stopPropagation(),this.pick(t,g.shiftKey)}} />`:b}
        <button type="button" class="ap-open" title=${c} tabindex=${s?"-1":"0"} @click=${l}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${Q(t)}</small>
        </button>
        ${s?b:this.renderItemDelete(t,"ap-del")}
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${c} @click=${l}>
        ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumb(e,t,a)}
      </button>
      ${this.renderCardTicks(e,t,i,n)}
      ${m?this.renderItemAsk(t,i):b}
    </div>`}openTitle(e){if(this.selecting){let t=this.selected.has(y(e));return`${t?"Let":"Pick"} ${e.name}${t?" go":""}`}return Z(e.name)}boardColumns(e,t){return t.map(i=>({device:i,color:this.colorOf(i.ownerId),count:O(e,i.ownerId,this.kind)}))}renderBoardAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;if(t.length===0)return h`<p class="ap-empty">${A(t,this.search,this.kind)}</p>`;let n=this.waiting(e),s=M(e,this.kind,this.search);return this.renderBoardOf(e,t,[{key:"all",rows:s.map(r=>this.boardRow(e,r,t,n)),empty:A(t,this.search,this.kind)}])}renderBoardOf(e,t,i,n){let s=w(this.kind),r=w(this.kind,2);return rt({label:`${J(this.kind)} on each device`,thing:s.charAt(0).toUpperCase()+s.slice(1),columns:this.boardColumns(e,t),...n===void 0?{}:{focus:n},onFocus:o=>this.setFocus(o),wide:this.roomy.wide,focusWord:"Order",focusTitle:o=>`Show ${o.name}'s ${r} first, in its order`,sections:i})}boardRow(e,t,i,n,s){let r=this.ticksInput(e,t,i,n),o=Ue(r),a=t.kind==="pages"?t.item:void 0,c=a===void 0?0:ge(a).length,l=a!==void 0&&c>0&&(r.skips?.length??0)>=c,m=o.map(f=>{let L={chip:f,onPick:V=>{this.tick(t,f.ownerId,V)}};if(f.on&&f.device==="watch"&&l?(L.note="shows nothing",L.noteWarn=!0,L.noteTitle=`Every tile on ${t.name} is iPhone only, so ${f.name} shows an empty page.`):f.skips!==void 0&&(L.note=f.skips.text,L.noteTitle=f.skips.title),s?.pick!==void 0&&S(f.ownerId,s.device.ownerId)&&t.kind==="pages"){let V=zt(s.device.ownerId,t.id),U=this.hiddenAsked.get(V)??s.pick.hidden;L.eye={hidden:U,busy:this.picksBusy,title:U?`Show ${t.name} on ${s.device.name} again`:`Hide here: keep ${t.name} on ${s.device.name} without showing it`,onToggle:()=>{this.changePicks(s.device,{id:t.id,hidden:!U})}}}return L}),g=this.selecting&&s===void 0,$=y(t),D={key:$,name:t.name,detail:Q(t),picture:this.rowPicture(t,s?.pick!==void 0?s.device:void 0),openTitle:s?.pick!==void 0?`${Z(t.name)}. Alt+Up or Alt+Down moves it.`:this.openTitle(t),onOpen:f=>{if(s?.pick!==void 0&&!f.metaKey&&!f.ctrlKey){this.open(t);return}this.cardClick(f,t)},cells:m,...s!==void 0&&s.pick===void 0?{dim:!0}:{},...s?.drag===void 0?{}:{drag:s.drag},...r.ask===void 0?{}:{ask:r.ask},...r.note===void 0?{}:{note:{text:r.note,kind:r.noteKind??"warn"}}};return g?D.select={picked:this.selected.has($),disabled:this.bulkBusy!==void 0,label:this.openTitle(t),onPick:f=>this.pick(t,f.shiftKey)}:(D.actions=this.renderItemDelete(t,"bd-act danger"),this.itemAsk===$&&(D.under=this.renderItemAsk(t,i,s?.device))),D}rowPicture(e,t){if(e.kind==="status_pages")return lt({page:e.item,hass:this.hassNow,width:this.roomy.size(Ht),tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}});let i=this.appVersionOf(t);return ht({page:e.item,width:this.roomy.size(t?.kind==="iphone"?Xt:Ht),tick:this.iconsTick,iphone:t?.kind==="iphone",...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...i===void 0?{}:{appVersion:i},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask,photoTick:this.photoTick,...t?.kind==="iphone"?{homeMap:this.homeMapDoc()}:{}})}appVersionOf(e){return e===void 0?void 0:this.owners.find(t=>S(t.owner_watch_id,e.ownerId))?.app_version}renderFocus(e,t,i){let{device:n}=t,s=this.orderAsked,r=s!==void 0&&s.ownerId===n.ownerId&&s.kind===this.kind?s.ids:void 0,o=It(t.picks,r),a=o.map(f=>f.id),c=O(e,n.ownerId,this.kind),l=this.search.trim()===""&&!this.picksBusy,m=this.waiting(e),g=w(this.kind,2),$=o.map((f,L)=>this.boardRow(e,f.entry,i,m,{device:n,pick:f,drag:this.rowDrag(f,L,a,n,l)})),D=t.rest.map(f=>this.boardRow(e,f,i,m,{device:n}));return h`${this.renderFocusHead(n,c)}
      ${this.picksNote===void 0?b:h`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${this.renderBoardOf(e,i,[{key:"on",title:Nt(n),count:c,hint:Tt(n),rows:$,empty:m.has(n.ownerId)&&this.search.trim()===""?le(g,n.name):Rt(n,this.kind,this.search,t.rest.length,this.mayMake)},...Ct(c,t.rest.length,this.search)?[{key:"rest",title:Pt(n),count:t.rest.length,hint:`Tick its box under ${n.name} to add it.`,rows:D,empty:this.search.trim()===""?`Every ${w(this.kind)} in your home is on ${n.name}.`:`No other ${w(this.kind)} has that name.`}]:[]],n.ownerId)}
      <p class="lt-line bd-foot-line">${c} ${c===1?w(this.kind):g} on ${n.name}.</p>`}renderFocusHead(e,t){let i=pe(e.kind),n=w(this.kind,t),s=e.kind==="watch"?["settings","rooms","voice"]:["settings","rooms"],r=this.colorOf(e.ownerId);return h`<div class="bd-focus" style=${r===void 0?b:`--dc:${r}`}>
      <span class="bd-focus-glyph" aria-hidden="true">${I(e.kind==="iphone"?"phone":"watch")}</span>
      <span class="bd-focus-t"><b>${e.name}</b> <span>${t} ${n}, in the order the ${i} ${this.kind==="pages"?"shows":"keeps"} them</span></span>
      ${this.onOpenScreen===void 0?b:h`<span class="bd-focus-own">Also on this ${i}:
        ${s.map(o=>h`<button type="button" class="bd-link" @click=${()=>this.onOpenScreen?.(e.ownerId,e.kind,o)}>${tt[o]}</button>`)}</span>`}
      <button type="button" class="bd-focus-all" @click=${()=>this.setFocus(void 0)}>${I("grid")}<span>All devices</span></button>
    </div>`}rowDrag(e,t,i,n,s){let r=this.overId!==void 0&&S(this.overId,e.id)&&this.dragId!==void 0&&!S(this.dragId,e.id),o=a=>{a!==void 0&&this.changePicks(n,{id:e.id,before:a},[...i])};return{on:s,dragging:this.dragId!==void 0&&S(this.dragId,e.id),over:r,below:r&&i.findIndex(a=>S(a,this.dragId))<t,onStart:a=>{s&&(this.dragId=e.id,a.dataTransfer?.setData("text/plain",e.id),a.dataTransfer&&(a.dataTransfer.effectAllowed="move"))},onOver:a=>{this.dragId!==void 0&&(a.preventDefault(),this.overId!==e.id&&(this.overId=e.id))},onDrop:a=>{a.preventDefault();let c=this.dragId;this.dragId=void 0,this.overId=void 0;let l=c===void 0?void 0:St(i,c,e.id);l!==void 0&&this.changePicks(n,l,[...i])},onEnd:()=>{this.dragId=void 0,this.overId=void 0},onKey:a=>{!a.altKey||!s||a.key!=="ArrowUp"&&a.key!=="ArrowDown"||(a.preventDefault(),a.key==="ArrowUp"?o(t>0?i[t-1]:void 0):o(t<i.length-1?i[t+2]??null:void 0))}}}renderBar(e){let t=this.shownNow(),i=t.filter(m=>this.selected.has(y(m))),n=i.length,s=this.bulkBusy!==void 0,r=n===0,o=t.length>0&&t.every(m=>this.selected.has(y(m))),a=s?void 0:this.bulkNote,c=w(this.kind),l=w(this.kind,2);return h`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${l}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?`Pick ${F(this.kind)} to start.`:`${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${s||t.length===0}
        title=${o?`Let the ${l} on screen go`:`Pick every ${c} the search has left`}
        @click=${()=>this.selectShown(!o)}>${o?"None":"All shown"}</button>
      ${a===void 0?b:h`<span class="pk-bar-said ${a.kind}">${a.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!r?this.renderDeleteAsk(i,e):h`<button type="button" class="ghost danger small" ?disabled=${s||r}
            title=${`Delete these ${l} from every device they are on`}
            @click=${()=>this.toggleAsk()}>${I("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${s}
        title=${`Stop picking and go back to opening one ${c} at a time`}
        @click=${()=>this.endSelect()}>${I("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let i=_(e,t,N),n=ee(i,t);return h`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${i.items.length===0}
        @click=${()=>this.runDelete()}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,i){let n=t.item,s=i===void 0?[]:me(xe(e,i.ownerId)),r=s.length===0?[n]:s,o=this.hassNow?.states,a=this.icons,c=K/T.width,l=Yt(n,o,a),m=l.height*c,g=m>ie,$=f=>`${Math.round(f*100)/100}px`,D=i?.kind==="watch"?this.appVersionOf(i):void 0;return h`<span class="ap-pic ${g?"cut":""}" style=${`width:${$(K)};height:${$(Math.min(m,ie))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${$(-l.top*c)})`}>${Fe({page:n,pages:r,screen:T,scale:c,...o===void 0?{}:{states:o},...a===void 0?{}:{icons:a},...D===void 0?{}:{appVersion:D}})}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,i=K/T.width,n=o=>`${Math.round(o*100)/100}px`,r=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return h`<span class="ap-pic ap-pic-status ${r?"cut":""}" style=${`width:${n(K)};height:${n(Math.min(T.height*i,ie))}`}>
      <span class="ap-pic-in">${t===void 0?b:_e({page:e.item,hass:t,icons:this.icons??Se,screen:T,scale:i})}</span>
    </span>`}static{this.styles=[Ae,Ce,Ke,Ot,Et,ze,ut,mt,at,ot,re`
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
  `]}};k([x({attribute:!1})],u.prototype,"kind",2),k([x({attribute:!1})],u.prototype,"owners",2),k([x({attribute:!1})],u.prototype,"ownersReady",2),k([x({attribute:!1})],u.prototype,"phones",2),k([x({attribute:!1})],u.prototype,"icons",2),k([x({attribute:!1})],u.prototype,"iconsTick",2),k([x({attribute:!1})],u.prototype,"onOpenLibrary",2),k([x({attribute:!1})],u.prototype,"focusOwner",2),k([x({attribute:!1})],u.prototype,"onFocus",2),k([x({attribute:!1})],u.prototype,"onOpenScreen",2),k([x({type:Boolean,reflect:!0})],u.prototype,"embedded",2),k([x({attribute:!1})],u.prototype,"searchText",2),k([v()],u.prototype,"search",2),k([v()],u.prototype,"newForm",2),k([v()],u.prototype,"selecting",2),k([v()],u.prototype,"selected",2),k([v()],u.prototype,"asking",2),k([v()],u.prototype,"bulkBusy",2),k([v()],u.prototype,"itemAsk",2),k([v()],u.prototype,"bulkNote",2),k([v()],u.prototype,"tickNotes",2),k([v()],u.prototype,"untickAsk",2),k([v()],u.prototype,"picksBusy",2),k([v()],u.prototype,"picksNote",2),k([v()],u.prototype,"orderAsked",2),k([v()],u.prototype,"hiddenAsked",2),k([v()],u.prototype,"dragId",2),k([v()],u.prototype,"overId",2),k([v()],u.prototype,"freeFacts",2),k([v()],u.prototype,"saved",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",u);export{u as WaAllPages,Yt as pageCrop};
