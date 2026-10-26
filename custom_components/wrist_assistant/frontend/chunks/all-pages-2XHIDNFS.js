import{a as lt,b as ht,c as ut,d as Pt,e as Ct}from"./chunk-F26UCH5H.js";import{A as Tt,B as K,a as dt,b as ct,d as pt,e as w,f as _,g as kt,h as Z,i as ft,j as mt,k as gt,l as ee,m as wt,n as bt,p as M,q as vt,r as yt,s as $t,t as xt,u as It,v as te,w as St,x as Nt,y as Dt,z as Lt}from"./chunk-Q4PM5A3W.js";import{a as J,b as O,c as We,d as G,f as Ye}from"./chunk-USIIPJ43.js";import{Ra as Be,Sa as Fe,ab as Ae,fb as Oe,gb as _e,nb as Me}from"./chunk-DQCNUAHK.js";import{cb as Ee}from"./chunk-5K3T7NIR.js";import{b as Xe}from"./chunk-C5BQSOQN.js";import{i as Ke,l as Ve}from"./chunk-RQFEMNCS.js";import{c as Q,d as qe}from"./chunk-LXBK5VDL.js";import"./chunk-CK3MMQEO.js";import{b as Je,c as Ge,d as Qe,e as Ze,f as et,g as tt,h as it,i as nt,j as st,q as rt,r as at,t as ot}from"./chunk-DBBNPB7C.js";import{Ea as Ce,Fa as A,Ga as Ue,Ha as He,Ia as ze,La as je,Q as De,R as X,f as W,i as q,j as we,k as be,qa as I,sa as C,xa as Le,ya as Te,za as Pe}from"./chunk-NSI6AUIG.js";import"./chunk-GVXAM55F.js";import"./chunk-ELEYTNLU.js";import"./chunk-ZI4T7IBE.js";import"./chunk-I7QDV4VJ.js";import{a as ve,b as ye,c as P,e as $e,f as xe,g as Ie,h as Se,i as F}from"./chunk-MMGKQOH7.js";import"./chunk-ZOJGMATP.js";import{b as me,c as ge}from"./chunk-JA3JXSBK.js";import{b as Re}from"./chunk-I4HMLGWJ.js";import{c as pe}from"./chunk-45BTIC3O.js";import{I as fe,k as ke}from"./chunk-REMFYDIQ.js";import{P as ce,b as oe,d as l,g as b,j as de,k as S,l as v,ya as N}from"./chunk-WG6SQUIV.js";import"./chunk-5DBZUIZX.js";import{g as Ne,h as Y}from"./chunk-XNPNVIPX.js";import{l as le,m as he,r as ue}from"./chunk-W7ZOHFHI.js";import{Zh as B,ye as j}from"./chunk-I2G7HGGS.js";import{a as k}from"./chunk-LO2NM3CE.js";function zt(d,p,e){return`${d} ${d===1?p:e}`}function Rt(d,p){let e=new Set(d);return e.has(p)?e.delete(p):e.add(p),e}function Et(d,p,e,t){let i=new Set(d),s=p.indexOf(t),n=e===void 0?-1:p.indexOf(e);if(s<0)return i;if(n<0)return i.add(t),i;for(let r=Math.min(n,s);r<=Math.max(n,s);r++)i.add(p[r]);return i}function Bt(d,p){return new Set([...d,...p])}function Ft(d,p){let e=new Set(p);return new Set([...d].filter(t=>!e.has(t)))}function At(d,p){let e=new Set(p);return new Set([...d].filter(t=>e.has(t)))}function $(d){return d.id.toUpperCase()}function V(d,p,e){let i={kind:d[0]?.kind??"pages",items:[],kept:[],devices:[]},s=new Set;for(let n of d){let r=p.filter(a=>n.owners.some(c=>I(c,a.ownerId))).map(a=>a.ownerId),o=r.filter(a=>e(a,n.kind));if(o.length>0){i.kept.push({name:n.name,dirty:o});continue}i.items.push({id:n.id,name:n.name,owners:[...n.owners]});for(let a of r)s.add(a)}return i.devices=p.map(n=>n.ownerId).filter(n=>s.has(n)),i}var R=(d,p)=>d.find(e=>I(e.ownerId,p))?.name??"a device";function ie(d,p){let e=d.items.length,t=e===1?"it":"them",i=`Delete ${e} ${w(d.kind,e)}?`,s=d.devices.map(o=>R(p,o)),n=d.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,r=[s.length===0?`${e===1?"It is":"They are"} on no device yet. ${q}`:`${e===1?"It comes":"They come"} off ${P(s)}, ${n}. ${q}`];for(let o of d.kept){let a=o.dirty.map(c=>R(p,c));r.push(`${o.name} stays: ${P(a)} ${a.length===1?"has":"have"} unsaved edits.`)}return{title:i,body:r.join(" ")}}async function Ot(d,p,e,t){let i={kind:p.kind,gone:[],kept:p.kept.map(n=>({...n,dirty:[...n.dirty]})),failed:[],stuck:[],taps:[]},s=new Map;for(let[n,r]of p.items.entries()){t?.(`Deleting ${r.name} (${n+1} of ${p.items.length})\u2026`);let o=await d.delete(p.kind,r.id);if(!o.ok){i.failed.push({name:r.name,text:o.text});continue}i.gone.push(r.name);for(let a of o.reply.link_failures??[]){let c=a.name??R(e,a.owner);i.stuck.includes(c)||i.stuck.push(c)}for(let a of r.owners)s.set(a,[...s.get(a)??[],r.id])}if(p.kind==="pages")for(let[n,r]of s){t?.(`Clearing complication taps on ${R(e,n)}\u2026`);let o=!1;try{o=await d.clearTaps(n,r)}catch{o=!1}o||i.taps.push(R(e,n))}return i}function ne(d){let p=s=>`${s} ${w(d.kind,s)}`,e=[];d.gone.length>0&&e.push(`Deleted ${d.gone.length===1?d.gone[0]:p(d.gone.length)}.`);let t=e.length>0,i=!1;for(let s of d.kept)i=!0,e.push(`Kept ${s.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let s of d.failed)i=!0,e.push(`Not deleted: ${s.name}. ${s.text}`);return d.stuck.length>0&&(i=!0,e.push(`Could not take ${d.gone.length===1?"it":"them"} off ${P(d.stuck)}.`)),d.taps.length>0&&(i=!0,e.push(`Could not clear the complication taps that opened ${d.gone.length===1?"it":"them"} on ${P(d.taps)}. Change those by hand.`)),!t&&!i?{kind:"ok",text:"Nothing was deleted."}:{kind:i?t?"warn":"err":"ok",text:e.join(" ")}}function _t(d,p){return zt(p,w(d),w(d,2))}var U=200,se=320,Mt=6,T=fe.screen;function jt(d,p,e,t=T){if(ue(d))return{top:0,height:t.height};let i=Be(Fe(d,p),t),s=[...i.tiles,..._e(d,t,{states:p})];if(s.length===0)return{top:0,height:t.height};let r=Ae(d,1,i.topInset,e)!==b?0:Math.max(0,i.topInset+Math.min(...s.map(a=>a.y))-Mt),o=i.topInset+Math.max(...s.map(a=>a.y+a.height))+Mt;return{top:r,height:Math.max(1,o-r)}}var Wt=2e3,Kt=44,qt=28,Ut={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"};function re(d){return["watch","iphone"].filter(p=>d.some(e=>e.kind===p))}var ae=new Map;function Ht(d){let p=ae.get(d);if(p!==void 0)return p;let e={view:"cards"};try{let t=window.localStorage.getItem(Ut[d]);(t?JSON.parse(t):{}).view==="board"&&(e.view="board")}catch{}return ae.set(d,e),e}function Yt(d,p){let e={...Ht(d),...p};ae.set(d,e);try{window.localStorage.setItem(Ut[d],JSON.stringify(e))}catch{}}var L=(d,p="pages")=>(p==="status_pages"?Xe(d)?.dirty:Ye(d)?.dirty)??!1,Vt=(d,p)=>`${d}|${p.toUpperCase()}`,u=class extends de{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.saved=!1;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new Ue(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.roomy=new et(this);this.colorsFor=ge();this.colorOf=e=>me(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.itemAsk!==void 0?(e.preventDefault(),this.itemAsk=void 0):this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let i=Date.now();(t||i-this.hassDrawnAt>=Wt)&&(this.hassDrawnAt=i,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){if(e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged(),e.has("focusOwner")&&this.focusOwner!==void 0&&this.endSelect(!0),this.embedded&&e.has("searchText")&&(this.search=this.searchText),this.kind==="pages")for(let t of this.devices)this.freeAsked.has(t.ownerId)||this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return bt(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===wt?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.embedded||this.filterDevice()!==void 0?"board":Je(this.kind,Ht(this.kind).view)}get devices(){return ve(this.owners,this.phones)}waiting(e){let t=new Map;for(let i of this.devices)t.set(i.ownerId,{held:Te(e,i.ownerId,this.kind),free:!1});return Se(this.owners,t)}setFocus(e){e!==void 0&&this.endSelect(!0),this.picksNote=void 0,this.onFocus?.(e)}setView(e){Ge(this.kind,e),Yt(this.kind,{view:e}),e==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},Ze)}setSearch(e){this.search=e,this.pruneSelected()}async newPage(e){let t=this.hassNow,i=this.lib.store;if(t===void 0||i===void 0||this.picksBusy)return;this.newForm=void 0;let s=this.kind;if(L(e.ownerId,s)){this.picksNote={kind:"warn",text:O(s,e.name)};return}let n=j(),r=this.nextCardName(),o=s==="status_pages"?X(r,n):Y(n,r);this.picksBusy=!0,this.picksNote=void 0;let a=!1;try{let c=await J(G(t),e.ownerId,s,{add:o});a=c.ok&&c.changed,c.ok||(this.picksNote={kind:"err",text:`Not made on ${e.name}. ${c.message}`})}catch(c){this.picksNote={kind:"err",text:B(c).message}}await i.refresh(),this.picksBusy=!1,a&&this.onOpenLibrary?.(s,n,e.ownerId)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!this.newForm?.busy){if(this.newForm!==void 0){this.newForm=void 0;return}this.newForm={name:this.nextCardName(),busy:!1,preview:re(this.devices)[0]},this.updateComplete.then(()=>ht(this.renderRoot))}}nextCardName(){let e=this.lib.library,t=e===void 0?[]:C(e,this.kind).map(i=>i.item);return this.kind==="status_pages"?De({schemaVersion:1,statusPages:t}):Ne({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let i=e.name.trim();if(i===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${w(this.kind)} a name.`}};return}let{note:s,...n}=e;this.newForm={...n,busy:!0};let r=j(),o=this.kind==="status_pages"?{schemaVersion:1,statusPages:[X(i,r)]}:{schemaVersion:1,pages:[Y(r,i)]},a=await t.createItem(this.kind,o);if(!a.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${a.text}`}};return}this.newForm=void 0,ot(e.preview??re(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,a.reply.id)}open(e){this.onOpenLibrary?.(e.kind,e.id,this.focusOwner)}async tick(e,t,i){let s=this.lib.store;if(s===void 0)return;if(this.dropTickNote($(e)),this.untickAsk=void 0,!i){let m={item:e.name,device:this.devices.find(f=>f.ownerId===t)?.name??"the device"};this.untickAsk=await qe(this.hassNow,s,t,e.kind,e.id,m),this.untickAsk===void 0&&s.noteFor(e.kind,e.id)===void 0&&this.flashSaved();return}let n=$(e),r=await Q(this.hassNow,s,t,e.kind,e.id,!0);if(r.ok&&this.flashSaved(),!r.ok||e.kind!=="pages")return;let o=await this.readFree(t),a=this.lib.library,c=this.devices.find(m=>m.ownerId===t)?.name;if(!o||a===void 0||c===void 0||A(a,t,"pages")<2)return;let h=F([c]);h!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(n,{kind:"warn",text:`Added to ${c}. ${h}`}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let i=await Q(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names);i.ok&&this.flashSaved(),i.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set($({id:e.itemId}),i.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let s=(await ce(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==s&&(this.freeFacts=new Map(this.freeFacts).set(e,s)),s}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,i){let s=this.hassNow,n=this.lib.store;if(s===void 0||n===void 0||this.picksBusy)return;let r=this.kind;if(L(e.ownerId,r)){this.picksNote={kind:"warn",text:O(r,e.name)};return}let o=this.kindSeq,a="hidden"in t,c=Vt(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,a?this.hiddenAsked=new Map(this.hiddenAsked).set(c,t.hidden):i!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:r,ids:xt(i,t.id,t.before)});let h=this.orderAsked,m;try{let f=await J(G(s),e.ownerId,r,t);f.ok&&this.flashSaved(),f.ok||(m={kind:"err",text:`${a?"Not changed":"Not moved"} on ${e.name}: ${f.message.replace(/\.$/,"")}.`})}catch(f){m={kind:"err",text:B(f).message}}if(await n.refresh(),this.picksBusy=!1,a){let f=new Map(this.hiddenAsked);f.delete(c),this.hiddenAsked=f}else this.orderAsked===h&&(this.orderAsked=void 0);o===this.kindSeq&&(this.picksNote=m)}shownNow(){let e=this.lib.library;return e===void 0?[]:M(e,this.kind,this.search)}pickedItems(){return this.shownNow().filter(e=>this.selected.has($(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=At(this.selected,this.shownNow().map($)))}startSelect(){this.selecting=!0,this.itemAsk=void 0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let i=$(e);this.selected=t?Et(this.selected,this.shownNow().map($),this.anchor,i):Rt(this.selected,i),this.anchor=i,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map($);this.selected=e?Bt(this.selected,t):Ft(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}runDelete(){let e=this.pickedItems();e.length!==0&&(this.asking=!1,this.anchor=void 0,this.deleteEntries(e),this.pruneSelected())}deleteEntries(e){let t=this.hassNow,i=this.lib.store;if(t===void 0||i===void 0||this.bulkBusy!==void 0)return;let s=this.devices,n=V(e,s,L),r=ne({kind:n.kind,gone:[],kept:n.kept,failed:[],stuck:[],taps:[]});if(this.bulkNote=n.kept.length>0?r:void 0,n.items.length===0)return;let o=n.items.length;be({text:`Deleted ${o===1?n.items[0].name:_t(n.kind,o)}.`,hide:n.items.map(a=>we(n.kind,a.id)),send:async()=>{let a;try{a=ne(await Ot(We(t),{...n,kept:[]},s))}catch(c){a={kind:"err",text:B(c).message}}return await i.refresh(),a.kind==="ok"?void 0:a.text}})}renderItemDelete(e,t){return l`<button type="button" class=${t} title=${`Delete ${e.name}`} aria-label=${`Delete ${e.name}`}
      ?disabled=${this.bulkBusy!==void 0}
      @click=${i=>{i.stopPropagation(),this.itemAsk=$(e)}}>${N("delete")}</button>`}renderItemAsk(e,t,i){let s=V([e],t,L),n=ie(s,t),r=()=>{this.itemAsk=void 0},o=()=>{r(),this.deleteEntries([e])},a=i!==void 0&&e.owners.some(h=>I(h,i.ownerId))&&e.owners.some(h=>!I(h,i.ownerId))?i:void 0,c=s.items.length>0;return l`<div class="ap-ask" role="alertdialog" aria-label=${`Delete ${e.name}?`} @click=${h=>h.stopPropagation()}>
      <span><b>Delete ${e.name}?</b> ${n.body}</span>
      <span class="ap-ask-acts">
        ${c?a===void 0?l`<button type="button" class="ap-ask-btn danger" @click=${o}>Really delete</button>`:l`<button type="button" class="ap-ask-btn danger" title=${`Take it off ${a.name} only`}
              @click=${()=>{r(),this.tick(e,a.ownerId,!1)}}>${rt}</button>
            <button type="button" class="ap-ask-btn danger" title="Delete it on every device" @click=${o}>${at}</button>`:b}
        <button type="button" class="ap-ask-btn" @click=${r}>${c?"Cancel":"Close"}</button>
      </span>
    </div>`}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return l`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let t=this.kind,i=this.lib.library,s=this.lib.readState,n=this.filterDevice(),r=w(t,2),o=this.view,a=i===void 0?s==="unsupported"?W:s==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${r}\u2026`:ft(C(i,t).length,t),c=i!==void 0&&s==="failed";return l`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${Z(t)}</h1>
          <p class="ap-lead">${a}</p>
        </div>
        ${e.length===0?b:this.renderNew(n,e)}
      </div>
      ${this.newForm===void 0?b:this.renderNewDialog(this.newForm,e)}
      ${c?l`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:b}
      <div class="pk-surface pk-page" role="region" aria-label=${`Your ${r}`}>
        <div class="pk-pin">
          ${this.renderHead(i,n,o)}
          ${this.selecting&&n===void 0?this.renderBar(e):b}
        </div>
        <div class="pk-body">
          ${i===void 0?l`<p class="ap-empty">${a}</p>`:n!==void 0?this.renderFocus(i,vt(i,n,t,this.search),e):o==="board"?this.renderBoardAll(i,e):this.renderAll(i,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${gt(t,n,this.selecting&&n===void 0,o)}</span></div>
      </div>
    </div></div>`}renderEmbedded(){let e=this.lib.library,t=this.devices,i=w(this.kind,2),s=this.lib.readState;if(e===void 0){let r=s==="unsupported"?W:s==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${i}\u2026`;return l`<p class="ap-empty">${r}</p>`}if(t.length===0)return l`<p class="ap-empty">No device can have ${i}.</p>`;let n=C(e,this.kind).length===0?l`<p class="ap-empty">No ${i} yet.</p>`:this.renderBoardAll(e,t);return l`${this.saved?l`<span class="bd-saved ap-embed-saved" role="status">${N("check")}<span>Saved</span></span>`:b}${n}`}renderAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;let s=M(e,this.kind,this.search);if(s.length===0)return l`<p class="ap-empty">${K(t,this.search,this.kind)}</p>`;let n=this.waiting(e);return l`<div class="ap-grid" role="list">${s.map(r=>this.renderCard(e,r,t,n))}</div>`}renderEmptyLibrary(e,t){if(t.length===0||C(e,this.kind).length>0)return;let i=this.mayMake,s=this.waiting(e).size>0;return l`<div class="ap-empty-lib">
      <p>${mt(this.kind,i)}</p>
      ${s?l`<p class="ap-empty-wait">${Ie(w(this.kind,2))}</p>`:b}
      ${i?l`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
        ${N("plus")}<span>New ${w(this.kind)}</span></button>`:b}
    </div>`}renderHead(e,t,i){let s=this.selecting,n=this.bulkBusy!==void 0,r=w(this.kind,2);return l`<div class="pk-head">
      ${t===void 0?l`<button type="button" class="pk-pick-btn ${s?"on":""}" aria-pressed=${s?"true":"false"}
        title=${s?`Back to opening one ${w(this.kind)} at a time`:`Pick several ${r} to delete together`}
        ?disabled=${n||e===void 0} @click=${()=>s?this.endSelect():this.startSelect()}>
        ${N("checklist")}<span>Multi select</span></button>`:b}
      ${tt(i,o=>this.setView(o),r)}
      ${this.saved?l`<span class="bd-saved" role="status">${N("check")}<span>Saved</span></span>`:b}
      <label class="pk-search">
        ${N("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${r}`}
          @input=${o=>this.setSearch(o.target.value)} />
      </label>
    </div>`}renderNew(e,t){let i=`New ${w(this.kind)}`;if(e!==void 0)return l`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${_(this.kind)} on ${e.name}`}
          ?disabled=${this.picksBusy} @click=${()=>{this.newPage(e)}}>
          ${N("plus")}<span>${i}</span></button>
      </div>`;let s=this.mayMake,n=this.newForm!==void 0;return l`<div class="ap-new">
      <button type="button" class="ap-new-btn ${n?"on":""}" aria-expanded=${n?"true":"false"}
        ?disabled=${!s||this.newForm?.busy===!0}
        title=${s?`Make ${_(this.kind)} no device has yet`:kt(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${N("plus")}<span>${i}</span></button>
    </div>`}renderNewDialog(e,t){return lt(this.kind,e,re(t),{onName:i=>{this.newForm={...e,name:i}},onPreview:i=>{this.newForm={...e,preview:i}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}})}ticksInput(e,t,i,s){let n=this.lib.store,r=$(t),o=n?.noteFor(t.kind,t.id),a=o===void 0?this.tickNotes.get(r):{kind:"warn",text:o},c=this.untickAsk,h=c!==void 0&&c.kind===t.kind&&I(c.itemId,t.id)?c:void 0,m=this.hassNow?.user?.is_admin,f=t.kind==="pages"?Ee(t.item):[];return{library:e,kind:t.kind,itemId:t.id,devices:i,colorOf:this.colorOf,skips:f,...n===void 0?{}:{pending:n.pending},...a===void 0?{}:{note:a.text,noteKind:a.kind},...h===void 0?{}:{ask:{ownerId:h.ownerId,text:h.text,onRemove:()=>{this.untickNow(h)},onCancel:()=>{this.untickAsk=void 0}}},...m===void 0?{}:{admin:m},locked:x=>{let D=Le(e,x,t.kind,t.id);if(D&&L(x,t.kind))return O(t.kind,i.find(g=>g.ownerId===x)?.name??"This device");if(!D&&s.has(x))return $e}}}renderCardTicks(e,t,i,s){return ze(this.ticksInput(e,t,i,s),(n,r)=>{this.tick(t,n,r)})}renderCard(e,t,i,s){let n=this.selecting,r=$(t),o=n&&this.selected.has(r),a=It(t,i),c=this.openTitle(t),h=f=>this.cardClick(f,t),m=!n&&this.itemAsk===r;return l`<div class="ap-card ${n?"picking":""} ${o?"picked":""} ${m?"asking":""}" role="listitem" data-card=${r}
      @click=${f=>{n&&h(f)}}>
      <div class="ap-top">
        ${n?l`<input type="checkbox" class="pk-card-pick" .checked=${ke(o)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${c}
          @click=${f=>{f.stopPropagation(),this.pick(t,f.shiftKey)}} />`:b}
        <button type="button" class="ap-open" title=${c} tabindex=${n?"-1":"0"} @click=${h}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${ee(t)}</small>
        </button>
        ${n?b:this.renderItemDelete(t,"ap-del")}
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${c} @click=${h}>
        ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumb(e,t,a)}
      </button>
      ${this.renderCardTicks(e,t,i,s)}
      ${m?this.renderItemAsk(t,i):b}
    </div>`}openTitle(e){if(this.selecting){let t=this.selected.has($(e));return`${t?"Let":"Pick"} ${e.name}${t?" go":""}`}return te(e.name)}boardColumns(e,t){return t.map(i=>({device:i,color:this.colorOf(i.ownerId),count:A(e,i.ownerId,this.kind)}))}renderBoardAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;if(t.length===0)return l`<p class="ap-empty">${K(t,this.search,this.kind)}</p>`;let s=this.waiting(e),n=M(e,this.kind,this.search);return this.renderBoardOf(e,t,[{key:"all",rows:n.map(r=>this.boardRow(e,r,t,s)),empty:K(t,this.search,this.kind)}])}renderBoardOf(e,t,i,s){let n=w(this.kind),r=w(this.kind,2);return it({label:`${Z(this.kind)} on each device`,thing:n.charAt(0).toUpperCase()+n.slice(1),columns:this.boardColumns(e,t),...s===void 0?{}:{focus:s},onFocus:o=>this.setFocus(o),wide:this.roomy.wide,focusWord:"Order",focusTitle:o=>`Show ${o.name}'s ${r} first, in its order`,sections:i})}boardRow(e,t,i,s,n){let r=this.ticksInput(e,t,i,s),o=He(r),a=t.kind==="pages"?t.item:void 0,c=a===void 0?0:he(a).length,h=a!==void 0&&c>0&&(r.skips?.length??0)>=c,m=o.map(g=>{let y={chip:g,onPick:H=>{this.tick(t,g.ownerId,H)}};g.on&&g.device==="watch"&&h?(y.note="shows nothing",y.noteWarn=!0,y.noteTitle=`Every tile on ${t.name} is iPhone only, so ${g.name} shows an empty page.`):g.skips!==void 0&&(y.note=g.skips.text,y.noteTitle=g.skips.title);let E=this.freeNote(e,t,g.ownerId,g.name,g.on);if(E!==void 0&&y.note===void 0&&Object.assign(y,E),n?.pick!==void 0&&I(g.ownerId,n.device.ownerId)&&t.kind==="pages"){let H=Vt(n.device.ownerId,t.id),z=this.hiddenAsked.get(H)??n.pick.hidden;y.eye={hidden:z,busy:this.picksBusy,title:z?`Show ${t.name} on ${n.device.name} again`:`Hide here: keep ${t.name} on ${n.device.name} without showing it`,onToggle:()=>{this.changePicks(n.device,{id:t.id,hidden:!z})}}}return y}),f=this.selecting&&n===void 0,x=$(t),D={key:x,name:t.name,detail:ee(t),picture:this.rowPicture(t,n?.pick!==void 0?n.device:void 0),openTitle:n?.pick!==void 0?`${te(t.name)}. Alt+Up or Alt+Down moves it.`:this.openTitle(t),onOpen:g=>{if(n?.pick!==void 0&&!g.metaKey&&!g.ctrlKey){this.open(t);return}this.cardClick(g,t)},cells:m,...n!==void 0&&n.pick===void 0?{dim:!0}:{},...n?.drag===void 0?{}:{drag:n.drag},...r.ask===void 0?{}:{ask:r.ask},...r.note===void 0?{}:{note:{text:r.note,kind:r.noteKind??"warn"}}};return f?D.select={picked:this.selected.has(x),disabled:this.bulkBusy!==void 0,label:this.openTitle(t),onPick:g=>this.pick(t,g.shiftKey)}:(D.actions=this.renderItemDelete(t,"bd-act danger"),this.itemAsk===x&&(D.under=this.renderItemAsk(t,i,n?.device))),D}freeNote(e,t,i,s,n){if(t.kind!=="pages"||!n||this.freeFacts.get(i)!==!0)return;let r=Pe(e,i,"pages").filter(a=>!a.hidden);if(r.length<2)return;let o=F([s]);return I(r[0].id,t.id)?{note:"1st page",...o===void 0?{}:{noteTitle:o}}:{note:"free: not shown",noteWarn:!0,...o===void 0?{}:{noteTitle:o}}}rowPicture(e,t){if(e.kind==="status_pages")return ct({page:e.item,hass:this.hassNow,width:this.roomy.size(Kt),tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}});let i=this.appVersionOf(t);return dt({page:e.item,width:this.roomy.size(t?.kind==="iphone"?qt:Kt),tick:this.iconsTick,iphone:t?.kind==="iphone",...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...i===void 0?{}:{appVersion:i}})}appVersionOf(e){return e===void 0?void 0:this.owners.find(t=>I(t.owner_watch_id,e.ownerId))?.app_version}renderFocus(e,t,i){let{device:s}=t,n=this.orderAsked,r=n!==void 0&&n.ownerId===s.ownerId&&n.kind===this.kind?n.ids:void 0,o=yt(t.picks,r),a=o.map(y=>y.id),c=A(e,s.ownerId,this.kind),h=this.search.trim()===""&&!this.picksBusy,m=this.kind==="pages"&&this.freeFacts.get(s.ownerId)===!0&&c>1?F([s.name]):void 0,f=this.waiting(e),x=w(this.kind,2),D=o.map((y,E)=>this.boardRow(e,y.entry,i,f,{device:s,pick:y,drag:this.rowDrag(y,E,a,s,h)})),g=t.rest.map(y=>this.boardRow(e,y,i,f,{device:s}));return l`${this.renderFocusHead(s,c)}
      ${this.picksNote===void 0?b:l`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${m===void 0?b:l`<p class="lt-line">${m}</p>`}
      ${this.renderBoardOf(e,i,[{key:"on",title:St(s),count:c,hint:Nt(s),rows:D,empty:f.has(s.ownerId)&&this.search.trim()===""?xe(x,s.name):Tt(s,this.kind,this.search,t.rest.length,this.mayMake)},...Lt(c,t.rest.length,this.search)?[{key:"rest",title:Dt(s),count:t.rest.length,hint:`Tick its box under ${s.name} to add it.`,rows:g,empty:this.search.trim()===""?`Every ${w(this.kind)} in your home is on ${s.name}.`:`No other ${w(this.kind)} has that name.`}]:[]],s.ownerId)}
      <p class="lt-line bd-foot-line">${c} ${c===1?w(this.kind):x} on ${s.name}.</p>`}renderFocusHead(e,t){let i=ye(e.kind),s=w(this.kind,t),n=e.kind==="watch"?["settings","rooms","voice"]:["settings","rooms"],r=this.colorOf(e.ownerId);return l`<div class="bd-focus" style=${r===void 0?b:`--dc:${r}`}>
      <span class="bd-focus-glyph" aria-hidden="true">${N(e.kind==="iphone"?"phone":"watch")}</span>
      <span class="bd-focus-t"><b>${e.name}</b> <span>${t} ${s}, in the order the ${i} ${this.kind==="pages"?"shows":"keeps"} them</span></span>
      ${this.onOpenScreen===void 0?b:l`<span class="bd-focus-own">Also on this ${i}:
        ${n.map(o=>l`<button type="button" class="bd-link" @click=${()=>this.onOpenScreen?.(e.ownerId,e.kind,o)}>${Qe[o]}</button>`)}</span>`}
      <button type="button" class="bd-focus-all" @click=${()=>this.setFocus(void 0)}>${N("grid")}<span>All devices</span></button>
    </div>`}rowDrag(e,t,i,s,n){let r=this.overId!==void 0&&I(this.overId,e.id)&&this.dragId!==void 0&&!I(this.dragId,e.id),o=a=>{a!==void 0&&this.changePicks(s,{id:e.id,before:a},[...i])};return{on:n,dragging:this.dragId!==void 0&&I(this.dragId,e.id),over:r,below:r&&i.findIndex(a=>I(a,this.dragId))<t,onStart:a=>{n&&(this.dragId=e.id,a.dataTransfer?.setData("text/plain",e.id),a.dataTransfer&&(a.dataTransfer.effectAllowed="move"))},onOver:a=>{this.dragId!==void 0&&(a.preventDefault(),this.overId!==e.id&&(this.overId=e.id))},onDrop:a=>{a.preventDefault();let c=this.dragId;this.dragId=void 0,this.overId=void 0;let h=c===void 0?void 0:$t(i,c,e.id);h!==void 0&&this.changePicks(s,h,[...i])},onEnd:()=>{this.dragId=void 0,this.overId=void 0},onKey:a=>{!a.altKey||!n||a.key!=="ArrowUp"&&a.key!=="ArrowDown"||(a.preventDefault(),a.key==="ArrowUp"?o(t>0?i[t-1]:void 0):o(t<i.length-1?i[t+2]??null:void 0))}}}renderBar(e){let t=this.shownNow(),i=t.filter(m=>this.selected.has($(m))),s=i.length,n=this.bulkBusy!==void 0,r=s===0,o=t.length>0&&t.every(m=>this.selected.has($(m))),a=n?void 0:this.bulkNote,c=w(this.kind),h=w(this.kind,2);return l`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${h}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?`Pick ${_(this.kind)} to start.`:`${s} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${n||t.length===0}
        title=${o?`Let the ${h} on screen go`:`Pick every ${c} the search has left`}
        @click=${()=>this.selectShown(!o)}>${o?"None":"All shown"}</button>
      ${a===void 0?b:l`<span class="pk-bar-said ${a.kind}">${a.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!r?this.renderDeleteAsk(i,e):l`<button type="button" class="ghost danger small" ?disabled=${n||r}
            title=${`Delete these ${h} from every device they are on`}
            @click=${()=>this.toggleAsk()}>${N("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${n}
        title=${`Stop picking and go back to opening one ${c} at a time`}
        @click=${()=>this.endSelect()}>${N("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let i=V(e,t,L),s=ie(i,t);return l`<span class="pk-bar-ask" id="ap-del-ask"><b>${s.title}</b> ${s.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${i.items.length===0}
        @click=${()=>this.runDelete()}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,i){let s=t.item,n=i===void 0?[]:le(Ce(e,i.ownerId)),r=n.length===0?[s]:n,o=this.hassNow?.states,a=this.icons,c=U/T.width,h=jt(s,o,a),m=h.height*c,f=m>se,x=g=>`${Math.round(g*100)/100}px`,D=i?.kind==="watch"?this.appVersionOf(i):void 0;return l`<span class="ap-pic ${f?"cut":""}" style=${`width:${x(U)};height:${x(Math.min(m,se))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${x(-h.top*c)})`}>${Oe({page:s,pages:r,screen:T,scale:c,...o===void 0?{}:{states:o},...a===void 0?{}:{icons:a},...D===void 0?{}:{appVersion:D}})}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,i=U/T.width,s=o=>`${Math.round(o*100)/100}px`,r=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return l`<span class="ap-pic ap-pic-status ${r?"cut":""}" style=${`width:${s(U)};height:${s(Math.min(T.height*i,se))}`}>
      <span class="ap-pic-in">${t===void 0?b:Ke({page:e.item,hass:t,icons:this.icons??pe,screen:T,scale:i})}</span>
    </span>`}static{this.styles=[Me,Re,Ve,Ct,Pt,je,pt,ut,nt,st,oe`
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
  `]}};k([S({attribute:!1})],u.prototype,"kind",2),k([S({attribute:!1})],u.prototype,"owners",2),k([S({attribute:!1})],u.prototype,"ownersReady",2),k([S({attribute:!1})],u.prototype,"phones",2),k([S({attribute:!1})],u.prototype,"icons",2),k([S({attribute:!1})],u.prototype,"iconsTick",2),k([S({attribute:!1})],u.prototype,"onOpenLibrary",2),k([S({attribute:!1})],u.prototype,"focusOwner",2),k([S({attribute:!1})],u.prototype,"onFocus",2),k([S({attribute:!1})],u.prototype,"onOpenScreen",2),k([S({type:Boolean,reflect:!0})],u.prototype,"embedded",2),k([S({attribute:!1})],u.prototype,"searchText",2),k([v()],u.prototype,"search",2),k([v()],u.prototype,"newForm",2),k([v()],u.prototype,"selecting",2),k([v()],u.prototype,"selected",2),k([v()],u.prototype,"asking",2),k([v()],u.prototype,"bulkBusy",2),k([v()],u.prototype,"itemAsk",2),k([v()],u.prototype,"bulkNote",2),k([v()],u.prototype,"tickNotes",2),k([v()],u.prototype,"untickAsk",2),k([v()],u.prototype,"picksBusy",2),k([v()],u.prototype,"picksNote",2),k([v()],u.prototype,"orderAsked",2),k([v()],u.prototype,"hiddenAsked",2),k([v()],u.prototype,"dragId",2),k([v()],u.prototype,"overId",2),k([v()],u.prototype,"freeFacts",2),k([v()],u.prototype,"saved",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",u);export{u as WaAllPages,jt as pageCrop};
