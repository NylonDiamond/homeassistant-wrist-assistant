import{b as it}from"./chunk-XQ4J7UCX.js";import{a as $t,b as xt,c as It,d as Ut,e as Ht}from"./chunk-PXQDFNUC.js";import{A as At,B as _t,C as Kt,D as Vt,E as A,b as bt,c as vt,e as yt,f as w,g as O,h as Dt,i as ee,j as Tt,k as St,l as Nt,m as te,n as Lt,o as Pt,q as F,r as Ct,s as Rt,t as Et,u as Mt,v as ie,w as ne,x as Bt,y as Ot,z as Ft}from"./chunk-Y2UI7JI2.js";import{i as He,l as ze}from"./chunk-LZLJ3LGR.js";import{b as Xe,c as Je,d as Qe}from"./chunk-TJZB5QD5.js";import{a as Ge,b as X,d as et,m as tt}from"./chunk-O5NFL45G.js";import{c as J,d as Ze}from"./chunk-ZGBP5UQI.js";import"./chunk-TEDDXK5U.js";import"./chunk-XKHHYV2T.js";import{A as wt,b as Q,c as Z,d as nt,e as st,f as rt,g as at,h as ot,i as dt,j as pt,k as ct,l as ht,m as lt,o as ut,p as kt,q as ft,x as mt,y as gt}from"./chunk-EU2SUCCD.js";import{a as Y,b as Ee,c as Me,p as qe,s as je,t as We,x as Ye}from"./chunk-BNMOS5DN.js";import"./chunk-35HHC646.js";import{n as z}from"./chunk-NZ3VRBIT.js";import"./chunk-C6K36PU4.js";import{d as G,e as B}from"./chunk-KFLNPYHZ.js";import{X as x,_ as C,da as De,ea as Te,la as Se,ma as M,w as Ie,x as W}from"./chunk-X2S7BEPN.js";import{a as ue,b as ke,c as P,e as q,f as fe,g as me,h as ge,i as we,j as be}from"./chunk-OVXNK2D3.js";import{$a as Fe,Db as Ue,cb as Ae,ob as _e,ub as Ke,wb as Ve}from"./chunk-5JXZZ6CG.js";import{db as Oe}from"./chunk-TYIZWFAF.js";import"./chunk-65JOHDGE.js";import"./chunk-QZUQL2HQ.js";import"./chunk-KDF3BH6P.js";import{b as Ce,c as Re}from"./chunk-YXICIVY5.js";import{e as Be}from"./chunk-FUHON6NJ.js";import"./chunk-PTVOUCHK.js";import"./chunk-DNRTVSPA.js";import"./chunk-4Z22ZXCD.js";import{c as Le}from"./chunk-Q366457P.js";import{z as Pe}from"./chunk-PKYX74YH.js";import"./chunk-R7W246QA.js";import{j as Ne}from"./chunk-UCO5DASE.js";import{g as le}from"./chunk-3WGQT6J2.js";import"./chunk-FJIHFDLG.js";import"./chunk-ZKXA3G3T.js";import"./chunk-Y3MKANRL.js";import{Je as H,Jg as he,b as pe,d as l,g as b,j as ce,l as D,m as v,xh as S}from"./chunk-G7AAB2LI.js";import{f as xe,g as j}from"./chunk-65FYUJAA.js";import{k as ve,l as ye,q as $e}from"./chunk-NL2JPLO4.js";import{kb as E}from"./chunk-4T3N2GVV.js";import{a as f}from"./chunk-LO2NM3CE.js";function ii(d,c,e){return`${d} ${d===1?c:e}`}function zt(d,c){let e=new Set(d);return e.has(c)?e.delete(c):e.add(c),e}function qt(d,c,e,t){let i=new Set(d),n=c.indexOf(t),s=e===void 0?-1:c.indexOf(e);if(n<0)return i;if(s<0)return i.add(t),i;for(let r=Math.min(s,n);r<=Math.max(s,n);r++)i.add(c[r]);return i}function jt(d,c){return new Set([...d,...c])}function Wt(d,c){let e=new Set(c);return new Set([...d].filter(t=>!e.has(t)))}function Yt(d,c){let e=new Set(c);return new Set([...d].filter(t=>e.has(t)))}function y(d){return d.id.toUpperCase()}function _(d,c,e){let i={kind:d[0]?.kind??"pages",items:[],kept:[],devices:[]},n=new Set;for(let s of d){let r=c.filter(a=>s.owners.some(p=>x(p,a.ownerId))).map(a=>a.ownerId),o=r.filter(a=>e(a,s.kind));if(o.length>0){i.kept.push({name:s.name,dirty:o});continue}i.items.push({id:s.id,name:s.name,owners:[...s.owners]});for(let a of r)n.add(a)}return i.devices=c.map(s=>s.ownerId).filter(s=>n.has(s)),i}var R=(d,c)=>d.find(e=>x(e.ownerId,c))?.name??"a device";function se(d,c){let e=d.items.length,t=e===1?"it":"them",i=`Delete ${e} ${w(d.kind,e)}?`,n=d.devices.map(o=>R(c,o)),s=d.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,r=[n.length===0?`${e===1?"It is":"They are"} on no device yet. ${Y}`:`${e===1?"It comes":"They come"} off ${P(n)}, ${s}. ${Y}`];for(let o of d.kept){let a=o.dirty.map(p=>R(c,p));r.push(`${o.name} stays: ${P(a)} ${a.length===1?"has":"have"} unsaved edits.`)}return{title:i,body:r.join(" ")}}async function Gt(d,c,e,t){let i={kind:c.kind,gone:[],kept:c.kept.map(s=>({...s,dirty:[...s.dirty]})),failed:[],stuck:[],taps:[]},n=new Map;for(let[s,r]of c.items.entries()){t?.(`Deleting ${r.name} (${s+1} of ${c.items.length})\u2026`);let o=await d.delete(c.kind,r.id);if(!o.ok){i.failed.push({name:r.name,text:o.text});continue}i.gone.push(r.name);for(let a of o.reply.link_failures??[]){let p=a.name??R(e,a.owner);i.stuck.includes(p)||i.stuck.push(p)}for(let a of r.owners)n.set(a,[...n.get(a)??[],r.id])}if(c.kind==="pages")for(let[s,r]of n){t?.(`Clearing complication taps on ${R(e,s)}\u2026`);let o=!1;try{o=await d.clearTaps(s,r)}catch{o=!1}o||i.taps.push(R(e,s))}return i}function re(d){let c=n=>`${n} ${w(d.kind,n)}`,e=[];d.gone.length>0&&e.push(`Deleted ${d.gone.length===1?d.gone[0]:c(d.gone.length)}.`);let t=e.length>0,i=!1;for(let n of d.kept)i=!0,e.push(`Kept ${n.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let n of d.failed)i=!0,e.push(`Not deleted: ${n.name}. ${n.text}`);return d.stuck.length>0&&(i=!0,e.push(`Could not take ${d.gone.length===1?"it":"them"} off ${P(d.stuck)}.`)),d.taps.length>0&&(i=!0,e.push(`Could not clear the complication taps that opened ${d.gone.length===1?"it":"them"} on ${P(d.taps)}. Change those by hand.`)),!t&&!i?{kind:"ok",text:"Nothing was deleted."}:{kind:i?t?"warn":"err":"ok",text:e.join(" ")}}function Xt(d,c){return ii(c,w(d),w(d,2))}var K=200,ae=320,Jt=6,L=Pe.screen;function ni(d,c,e,t=L){if($e(d))return{top:0,height:t.height};let i=Fe(Ae(d,c),t),n=[...i.tiles,...Ve(d,t,{states:c})];if(n.length===0)return{top:0,height:t.height};let r=_e(d,1,i.topInset,e)!==b?0:Math.max(0,i.topInset+Math.min(...n.map(a=>a.y))-Jt),o=i.topInset+Math.max(...n.map(a=>a.y+a.height))+Jt;return{top:r,height:Math.max(1,o-r)}}var si=2e3,Qt=44,ri=28,ei={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"};function oe(d){return["watch","iphone"].filter(c=>d.some(e=>e.kind===c))}var de=new Map;function ti(d){let c=de.get(d);if(c!==void 0)return c;let e={view:"cards"};try{let t=window.localStorage.getItem(ei[d]);(t?JSON.parse(t):{}).view==="board"&&(e.view="board")}catch{}return de.set(d,e),e}function ai(d,c){let e={...ti(d),...c};de.set(d,e);try{window.localStorage.setItem(ei[d],JSON.stringify(e))}catch{}}var N=(d,c="pages")=>(c==="status_pages"?it(d)?.dirty:et(d)?.dirty)??!1,Zt=(d,c)=>`${d}|${c.toUpperCase()}`,k=class extends ce{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.saved=!1;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new qe(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.photoTick=0;this.photos=new tt(()=>this.hassNow,()=>{this.photoTick+=1,this.requestUpdate()});this.photoUrl=e=>this.photos.url(e);this.photoSize=e=>this.photos.size(e);this.photoGlow=e=>this.photos.glow(e);this.photoOn=e=>this.photos.onUrl(e);this.photoOnMask=e=>this.photos.onMask(e);this.roomy=new ot(this);this.colorsFor=Re();this.colorOf=e=>Ce(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.itemAsk!==void 0?(e.preventDefault(),this.itemAsk=void 0):this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let i=Date.now();(t||i-this.hassDrawnAt>=si)&&(this.hassDrawnAt=i,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){if(e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged(),e.has("focusOwner")&&this.focusOwner!==void 0&&this.endSelect(!0),this.embedded&&e.has("searchText")&&(this.search=this.searchText),this.kind==="pages")for(let t of this.devices)this.freeAsked.has(t.ownerId)||this.readFree(t.ownerId)}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return Pt(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===Lt?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.embedded||this.filterDevice()!==void 0?"board":st(this.kind,ti(this.kind).view)}get devices(){return ue(this.owners,this.phones)}waiting(e){let t=new Map;for(let i of this.devices)t.set(i.ownerId,{held:Te(e,i.ownerId,this.kind),free:!1});return we(this.owners,t)}setFocus(e){e!==void 0&&this.endSelect(!0),this.picksNote=void 0,this.onFocus?.(e)}setView(e){rt(this.kind,e),ai(this.kind,{view:e}),e==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},at)}setSearch(e){this.search=e,this.pruneSelected()}async newPage(e){let t=this.hassNow,i=this.lib.store;if(t===void 0||i===void 0||this.picksBusy)return;this.newForm=void 0;let n=this.kind;if(N(e.ownerId,n)){this.picksNote={kind:"warn",text:B(n,e.name)};return}let s=H(),r=this.nextCardName(),o=n==="status_pages"?W(r,s):j(s,r);this.picksBusy=!0,this.picksNote=void 0;let a=!1;try{let p=await G(X(t),e.ownerId,n,{add:o});a=p.ok&&p.changed,p.ok||(this.picksNote={kind:"err",text:`Not made on ${e.name}. ${p.message}`})}catch(p){this.picksNote={kind:"err",text:E(p).message}}await i.refresh(),this.picksBusy=!1,a&&this.onOpenLibrary?.(n,s,e.ownerId)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!this.newForm?.busy){if(this.newForm!==void 0){this.newForm=void 0;return}this.newForm={name:this.nextCardName(),busy:!1,preview:oe(this.devices)[0]},this.updateComplete.then(()=>xt(this.renderRoot))}}nextCardName(){let e=this.lib.library,t=e===void 0?[]:C(e,this.kind).map(i=>i.item);return this.kind==="status_pages"?Ie({schemaVersion:1,statusPages:t}):xe({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let i=e.name.trim();if(i===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${w(this.kind)} a name.`}};return}let{note:n,...s}=e;this.newForm={...s,busy:!0};let r=H(),o=e.mapPage===!0?Xe(this.homeMapDoc()):void 0,a=this.kind==="status_pages"?{schemaVersion:1,statusPages:[W(i,r)]}:{schemaVersion:1,pages:[o===void 0?j(r,i):Qe(r,i,o)]},p=await t.createItem(this.kind,a);if(!p.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${p.text}`}};return}this.newForm=void 0,wt(e.preview??oe(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,p.reply.id)}open(e){this.onOpenLibrary?.(e.kind,e.id,this.focusOwner)}async tick(e,t,i){let n=this.lib.store;if(n===void 0)return;this.dropTickNote(y(e)),this.untickAsk=void 0;let s={item:e.name,device:this.devices.find(m=>m.ownerId===t)?.name??"the device"};if(!i){this.untickAsk=await Ze(this.hassNow,n,t,e.kind,e.id,s);return}let r=y(e);if(!(await J(this.hassNow,n,t,e.kind,e.id,!0,s,{onUndone:()=>this.dropTickNote(r)})).ok||e.kind!=="pages")return;let a=await this.readFree(t),p=this.lib.library,u=this.devices.find(m=>m.ownerId===t)?.name;if(!a||p===void 0||u===void 0||M(p,t,"pages")<2)return;let g=be([u]);g!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(r,{kind:"ok",text:g}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let i=y({id:e.itemId}),n=await J(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names,{onUndone:()=>this.dropTickNote(i)});n.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(i,n.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let n=(await he(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==n&&(this.freeFacts=new Map(this.freeFacts).set(e,n)),n}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,i){let n=this.hassNow,s=this.lib.store;if(n===void 0||s===void 0||this.picksBusy)return;let r=this.kind;if(N(e.ownerId,r)){this.picksNote={kind:"warn",text:B(r,e.name)};return}let o=this.kindSeq,a="hidden"in t,p=Zt(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,a?this.hiddenAsked=new Map(this.hiddenAsked).set(p,t.hidden):i!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:r,ids:Mt(i,t.id,t.before)});let u=this.orderAsked,g;try{let m=await G(X(n),e.ownerId,r,t);m.ok&&this.flashSaved(),m.ok||(g={kind:"err",text:`${a?"Not changed":"Not moved"} on ${e.name}: ${m.message.replace(/\.$/,"")}.`})}catch(m){g={kind:"err",text:E(m).message}}if(await s.refresh(),this.picksBusy=!1,a){let m=new Map(this.hiddenAsked);m.delete(p),this.hiddenAsked=m}else this.orderAsked===u&&(this.orderAsked=void 0);o===this.kindSeq&&(this.picksNote=g)}shownNow(){let e=this.lib.library;return e===void 0?[]:F(e,this.kind,this.search)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(y(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=Yt(this.selected,this.shownNow().map(y)))}startSelect(){this.selecting=!0,this.itemAsk=void 0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let i=y(e);this.selected=t?qt(this.selected,this.shownNow().map(y),this.anchor,i):zt(this.selected,i),this.anchor=i,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(y);this.selected=e?jt(this.selected,t):Wt(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}runDelete(){let e=this.pickedItems();e.length!==0&&(this.asking=!1,this.anchor=void 0,this.deleteEntries(e),this.pruneSelected())}deleteEntries(e){let t=this.hassNow,i=this.lib.store;if(t===void 0||i===void 0||this.bulkBusy!==void 0)return;let n=this.devices,s=_(e,n,N),r=re({kind:s.kind,gone:[],kept:s.kept,failed:[],stuck:[],taps:[]});if(this.bulkNote=s.kept.length>0?r:void 0,s.items.length===0)return;let o=s.items.length;Me({text:`Deleted ${o===1?s.items[0].name:Xt(s.kind,o)}.`,hide:s.items.map(a=>Ee(s.kind,a.id)),send:async()=>{let a;try{a=re(await Gt(Ge(t),{...s,kept:[]},n))}catch(p){a={kind:"err",text:E(p).message}}return await i.refresh(),a.kind==="ok"?void 0:a.text}})}renderItemDelete(e,t){return l`<button type="button" class=${t} title=${`Delete ${e.name}`} aria-label=${`Delete ${e.name}`}
      ?disabled=${this.bulkBusy!==void 0}
      @click=${i=>{i.stopPropagation(),this.itemAsk=y(e)}}>${S("delete")}</button>`}renderItemAsk(e,t,i){let n=_([e],t,N),s=se(n,t),r=()=>{this.itemAsk=void 0},o=()=>{r(),this.deleteEntries([e])},a=i!==void 0&&e.owners.some(u=>x(u,i.ownerId))&&e.owners.some(u=>!x(u,i.ownerId))?i:void 0,p=n.items.length>0;return l`<div class="ap-ask" role="alertdialog" aria-label=${`Delete ${e.name}?`} @click=${u=>u.stopPropagation()}>
      <span><b>Delete ${e.name}?</b> ${s.body}</span>
      <span class="ap-ask-acts">
        ${p?a===void 0?l`<button type="button" class="ap-ask-btn danger" @click=${o}>Really delete</button>`:l`<button type="button" class="ap-ask-btn danger" title=${`Take it off ${a.name} only`}
              @click=${()=>{r(),this.tick(e,a.ownerId,!1)}}>${mt}</button>
            <button type="button" class="ap-ask-btn danger" title="Delete it on every device" @click=${o}>${gt}</button>`:b}
        <button type="button" class="ap-ask-btn" @click=${r}>${p?"Cancel":"Close"}</button>
      </span>
    </div>`}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return l`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let t=this.kind,i=this.lib.library,n=this.lib.readState,s=this.filterDevice(),r=w(t,2),o=this.view,a=i===void 0?n==="unsupported"?z:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${r}\u2026`:Tt(C(i,t).length,t),p=i!==void 0&&n==="failed";return l`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${ee(t)}</h1>
          <p class="ap-lead">${a}</p>
        </div>
        ${e.length===0?b:this.renderNew(s,e)}
      </div>
      ${this.newForm===void 0?b:this.renderNewDialog(this.newForm,e)}
      ${p?l`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:b}
      <div class="pk-surface pk-page ${o==="board"?"on-board":""}" role="region" aria-label=${`Your ${r}`}>
        <div class="pk-pin">
          ${this.renderHead(i,s,o)}
          ${this.selecting&&s===void 0&&o!=="board"?this.renderBar(e):b}
        </div>
        <div class="pk-body">
          ${i===void 0?l`<p class="ap-empty">${a}</p>`:s!==void 0?this.renderFocus(i,Ct(i,s,t,this.search),e):o==="board"?this.renderBoardAll(i,e):this.renderAll(i,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${Nt(t,s,this.selecting&&s===void 0,o)}</span></div>
      </div>
    </div></div>`}renderEmbedded(){let e=this.lib.library,t=this.devices,i=w(this.kind,2),n=this.lib.readState;if(e===void 0){let r=n==="unsupported"?z:n==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${i}\u2026`;return l`<p class="ap-empty">${r}</p>`}if(t.length===0)return l`<p class="ap-empty">No device can have ${i}.</p>`;let s=C(e,this.kind).length===0?l`<p class="ap-empty">No ${i} yet.</p>`:this.renderBoardAll(e,t);return l`${this.saved?l`<span class="bd-saved ap-embed-saved" role="status">${S("check")}<span>Saved</span></span>`:b}${s}`}renderAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;let n=F(e,this.kind,this.search);if(n.length===0)return l`<p class="ap-empty">${A(t,this.search,this.kind)}</p>`;let s=this.waiting(e);return l`<div class="ap-grid" role="list">${n.map(r=>this.renderCard(e,r,t,s))}</div>`}renderEmptyLibrary(e,t){if(t.length===0||C(e,this.kind).length>0)return;let i=this.mayMake,n=this.waiting(e),s=n.size>0;return l`<div class="ap-empty-lib">
      <p>${St(this.kind,i)}</p>
      ${s?l`<p class="ap-empty-wait">${me(w(this.kind,2),ge(t,n))}</p>`:b}
      ${i?l`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
        ${S("plus")}<span>New ${w(this.kind)}</span></button>`:b}
    </div>`}renderHead(e,t,i){let n=this.selecting,s=this.bulkBusy!==void 0,r=w(this.kind,2);return l`<div class="pk-head">
      ${dt(i,o=>this.setView(o),r)}
      ${i==="board"?pt(Z(),o=>{nt(o),this.requestUpdate()}):b}
      ${t===void 0?l`<button type="button" class="pk-pick-btn ${n?"on":""}" aria-pressed=${n?"true":"false"}
        title=${n?`Back to opening one ${w(this.kind)} at a time`:`Pick several ${r} to delete together`}
        ?disabled=${s||e===void 0} @click=${()=>n?this.endSelect():this.startSelect()}>
        ${S("checklist")}<span>Multi select</span></button>`:b}
      ${this.saved?l`<span class="bd-saved" role="status">${S("check")}<span>Saved</span></span>`:b}
      <label class="pk-search">
        ${S("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${r}`}
          @input=${o=>this.setSearch(o.target.value)} />
      </label>
    </div>`}renderNew(e,t){let i=`New ${w(this.kind)}`;if(e!==void 0)return l`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${O(this.kind)} on ${e.name}`}
          ?disabled=${this.picksBusy} @click=${()=>{this.newPage(e)}}>
          ${S("plus")}<span>${i}</span></button>
      </div>`;let n=this.mayMake,s=this.newForm!==void 0;return l`<div class="ap-new">
      <button type="button" class="ap-new-btn ${s?"on":""}" aria-expanded=${s?"true":"false"}
        ?disabled=${!n||this.newForm?.busy===!0}
        title=${n?`Make ${O(this.kind)} no device has yet`:Dt(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${S("plus")}<span>${i}</span></button>
    </div>`}renderNewDialog(e,t){let i=Je(this.homeMapDoc());return $t(this.kind,e,oe(t),{onName:n=>{this.newForm={...e,name:n}},onPreview:n=>{this.newForm={...e,preview:n}},onMapPage:n=>{this.newForm={...e,mapPage:n}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}},this.kind==="pages"?i===void 0?{}:{refusal:i}:void 0)}homeMapDoc(){return le(this.hassNow,()=>this.requestUpdate())?.doc}ticksInput(e,t,i,n){let s=this.lib.store,r=y(t),o=s?.noteFor(t.kind,t.id),a=o===void 0?this.tickNotes.get(r):{kind:"warn",text:o},p=this.untickAsk,u=p!==void 0&&p.kind===t.kind&&x(p.itemId,t.id)?p:void 0,g=this.hassNow?.user?.is_admin,m=t.kind==="pages"?Oe(t.item):[];return{library:e,kind:t.kind,itemId:t.id,devices:i,colorOf:this.colorOf,skips:m,...s===void 0?{}:{pending:s.pending},...a===void 0?{}:{note:a.text,noteKind:a.kind},...u===void 0?{}:{ask:{ownerId:u.ownerId,text:u.text,onRemove:()=>{this.untickNow(u)},onCancel:()=>{this.untickAsk=void 0}}},...g===void 0?{}:{admin:g},locked:$=>{let I=De(e,$,t.kind,t.id);if(I&&N($,t.kind))return B(t.kind,i.find(h=>h.ownerId===$)?.name??"This device");if(!I&&n.has($))return q(i.find(h=>h.ownerId===$)?.appVersion)}}}renderCardTicks(e,t,i,n){return We(this.ticksInput(e,t,i,n),(s,r)=>{this.tick(t,s,r)})}renderCard(e,t,i,n){let s=this.selecting,r=y(t),o=s&&this.selected.has(r),a=ie(t,i),p=this.openTitle(t),u=m=>this.cardClick(m,t),g=!s&&this.itemAsk===r;return l`<div class="ap-card ${s?"picking":""} ${o?"picked":""} ${g?"asking":""}" role="listitem" data-card=${r}
      @click=${m=>{s&&u(m)}}>
      <div class="ap-top">
        ${s?l`<input type="checkbox" class="pk-card-pick" .checked=${Ne(o)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${p}
          @click=${m=>{m.stopPropagation(),this.pick(t,m.shiftKey)}} />`:b}
        <button type="button" class="ap-open" title=${p} tabindex=${s?"-1":"0"} @click=${u}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${te(t)}</small>
        </button>
        ${s?b:this.renderItemDelete(t,"ap-del")}
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${p} @click=${u}>
        ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumb(e,t,a)}
      </button>
      ${this.renderCardTicks(e,t,i,n)}
      ${g?this.renderItemAsk(t,i):b}
    </div>`}openTitle(e){if(this.selecting){let t=this.selected.has(y(e));return`${t?"Let":"Pick"} ${e.name}${t?" go":""}`}return ne(e.name)}boardColumns(e,t){let i=this.waiting(e);return t.map(n=>({device:n,color:this.colorOf(n.ownerId),count:M(e,n.ownerId,this.kind),...i.has(n.ownerId)?{blocked:ct(n.appVersion,q(n.appVersion))}:{}}))}renderBoardAll(e,t){let i=this.renderEmptyLibrary(e,t);if(i!==void 0)return i;if(t.length===0)return l`<p class="ap-empty">${A(t,this.search,this.kind)}</p>`;let n=this.waiting(e),s=F(e,this.kind,this.search);return this.renderBoardOf(e,t,[{key:"all",rows:s.map(r=>this.boardRow(e,r,t,n)),empty:A(t,this.search,this.kind)}])}renderBoardOf(e,t,i,n){let s=w(this.kind),r=w(this.kind,2);return lt({label:`${ee(this.kind)} on each device`,thing:s.charAt(0).toUpperCase()+s.slice(1),columns:this.boardColumns(e,t),...n===void 0?{}:{focus:n},onFocus:o=>this.setFocus(o),wide:this.roomy.wide,ordered:!0,focusTitle:o=>`Show ${o.name}'s ${r} first, in its order`,sections:i,...this.embedded?{}:{legend:{tick:"on that device",focus:`a device to order its ${r}`,saves:"Ticks save at once, with Undo",...this.kind==="pages"?{eye:"hide but keep its place"}:{}}},...this.selecting&&n===void 0?{pinned:this.renderBar(t)}:{}})}boardRow(e,t,i,n,s){let r=this.ticksInput(e,t,i,n),o=je(r),a=t.kind==="pages"?t.item:void 0,p=a===void 0?0:ye(a).length,u=a!==void 0&&p>0&&(r.skips?.length??0)>=p,g=o.map(h=>{if(!h.on&&!h.busy&&n.has(h.ownerId))return{dashTitle:h.title};let T={chip:{...h,title:ht(h)},onPick:V=>{this.tick(t,h.ownerId,V)}};if(s?.order!==void 0&&h.on&&x(h.ownerId,s.device.ownerId)&&(T.order=s.order.at+1),h.on&&h.device==="watch"&&u?(T.note="shows nothing",T.noteWarn=!0,T.noteTitle=`Every tile on ${t.name} is iPhone only, so ${h.name} shows an empty page.`):h.skips!==void 0&&(T.note=h.skips.text,T.noteTitle=h.skips.title),s?.pick!==void 0&&x(h.ownerId,s.device.ownerId)&&t.kind==="pages"){let V=Zt(s.device.ownerId,t.id),U=this.hiddenAsked.get(V)??s.pick.hidden;T.eye={hidden:U,busy:this.picksBusy,title:U?`Show ${t.name} on ${s.device.name} again`:`Hide here: keep ${t.name} on ${s.device.name} without showing it`,onToggle:()=>{this.changePicks(s.device,{id:t.id,hidden:!U})}}}return T}),m=this.selecting&&s===void 0,$=y(t),I={key:$,name:t.name,detail:te(t),picture:this.rowPicture(t,s?.pick!==void 0?s.device:void 0),openTitle:s?.pick!==void 0?`${ne(t.name)}. Alt+Up or Alt+Down moves it.`:this.openTitle(t),onOpen:h=>{if(s?.pick!==void 0&&!h.metaKey&&!h.ctrlKey){this.open(t);return}this.cardClick(h,t)},cells:g,...s!==void 0&&s.pick===void 0?{dim:!0}:{},...s?.drag===void 0?{}:{drag:s.drag},...r.ask===void 0?{}:{ask:r.ask},...r.note===void 0?{}:{note:{text:r.note,kind:r.noteKind??"warn"}},peek:()=>({picture:t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumb(e,t,ie(t,i)),where:_t(t,i,s?.order===void 0?void 0:{device:s.device,at:s.order.at})})};return m?I.select={picked:this.selected.has($),disabled:this.bulkBusy!==void 0,label:this.openTitle(t),onPick:h=>this.pick(t,h.shiftKey)}:(I.actions=this.renderItemDelete(t,"bd-act danger"),I.more=this.rowMore(t,s),this.itemAsk===$&&(I.under=this.renderItemAsk(t,i,s?.device))),I}rowMore(e,t){let i=[{label:"Open",onPick:()=>this.open(e)}],n=t?.order;if(t!==void 0&&n!==void 0){let s=n.ids[0],r=o=>{this.changePicks(t.device,{id:e.id,before:o},[...n.ids])};n.at>0&&s!==void 0&&i.push({label:"Move to top",onPick:()=>r(s)}),n.at<n.ids.length-1&&i.push({label:"Move to bottom",onPick:()=>r(null)})}else t===void 0&&i.push({label:"Pick several",title:`Pick several ${w(this.kind,2)} to delete together`,onPick:()=>this.pick(e,!1)});return i}rowPicture(e,t){let i=Z()==="compact";if(e.kind==="status_pages")return vt({page:e.item,hass:this.hassNow,width:i?Q:this.roomy.size(Qt),tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}});let n=this.appVersionOf(t);return bt({page:e.item,width:i?Q:this.roomy.size(t?.kind==="iphone"?ri:Qt),tick:this.iconsTick,iphone:t?.kind==="iphone",...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...n===void 0?{}:{appVersion:n},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask,photoTick:this.photoTick,...t?.kind==="iphone"?{homeMap:this.homeMapDoc()}:{}})}appVersionOf(e){return e===void 0?void 0:this.owners.find(t=>x(t.owner_watch_id,e.ownerId))?.app_version}renderFocus(e,t,i){let{device:n}=t,s=this.orderAsked,r=s!==void 0&&s.ownerId===n.ownerId&&s.kind===this.kind?s.ids:void 0,o=Rt(t.picks,r),a=o.map(h=>h.id),p=M(e,n.ownerId,this.kind),u=this.search.trim()===""&&!this.picksBusy,g=this.waiting(e),m=w(this.kind,2),$=o.map((h,T)=>this.boardRow(e,h.entry,i,g,{device:n,pick:h,drag:this.rowDrag(h,T,a,n,u),order:{at:T,ids:u?a:[]}})),I=t.rest.map(h=>this.boardRow(e,h,i,g,{device:n}));return l`${this.renderFocusHead(n,p)}
      ${this.picksNote===void 0?b:l`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}
      ${this.renderBoardOf(e,i,[{key:"on",title:Bt(n),count:p,hint:Ot(n),rows:$,empty:g.has(n.ownerId)&&this.search.trim()===""?fe(m,n.name,n.appVersion):Vt(n,this.kind,this.search,t.rest.length,this.mayMake)},...Kt(p,t.rest.length,this.search)?[{key:"rest",title:Ft(n),count:t.rest.length,hint:At(n),rows:I,empty:this.search.trim()===""?`Every ${w(this.kind)} in your home is on ${n.name}.`:`No other ${w(this.kind)} has that name.`}]:[]],n.ownerId)}
      <p class="lt-line bd-foot-line">${p} ${p===1?w(this.kind):m} on ${n.name}.</p>`}renderFocusHead(e,t){let i=ke(e.kind),n=w(this.kind,t);return ut({device:e,color:this.colorOf(e.ownerId),text:`${t} ${n}, in the order the ${i} ${this.kind==="pages"?"shows":"keeps"} them`,...this.onOpenScreen===void 0?{}:{onOwn:s=>this.onOpenScreen?.(e.ownerId,e.kind,s)},onAll:()=>this.setFocus(void 0)})}rowDrag(e,t,i,n,s){let r=this.overId!==void 0&&x(this.overId,e.id)&&this.dragId!==void 0&&!x(this.dragId,e.id),o=a=>{a!==void 0&&this.changePicks(n,{id:e.id,before:a},[...i])};return{on:s,dragging:this.dragId!==void 0&&x(this.dragId,e.id),over:r,below:r&&i.findIndex(a=>x(a,this.dragId))<t,onStart:a=>{s&&(this.dragId=e.id,a.dataTransfer?.setData("text/plain",e.id),a.dataTransfer&&(a.dataTransfer.effectAllowed="move"))},onOver:a=>{this.dragId!==void 0&&(a.preventDefault(),this.overId!==e.id&&(this.overId=e.id))},onDrop:a=>{a.preventDefault();let p=this.dragId;this.dragId=void 0,this.overId=void 0;let u=p===void 0?void 0:Et(i,p,e.id);u!==void 0&&this.changePicks(n,u,[...i])},onEnd:()=>{this.dragId=void 0,this.overId=void 0},onKey:a=>{!a.altKey||!s||a.key!=="ArrowUp"&&a.key!=="ArrowDown"||(a.preventDefault(),a.key==="ArrowUp"?o(t>0?i[t-1]:void 0):o(t<i.length-1?i[t+2]??null:void 0))}}}renderBar(e){let t=this.shownNow(),i=t.filter(g=>this.selected.has(y(g))),n=i.length,s=this.bulkBusy!==void 0,r=n===0,o=t.length>0&&t.every(g=>this.selected.has(y(g))),a=s?void 0:this.bulkNote,p=w(this.kind),u=w(this.kind,2);return l`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${u}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?`Pick ${O(this.kind)} to start.`:`${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${s||t.length===0}
        title=${o?`Let the ${u} on screen go`:`Pick every ${p} the search has left`}
        @click=${()=>this.selectShown(!o)}>${o?"None":"All shown"}</button>
      ${a===void 0?b:l`<span class="pk-bar-said ${a.kind}">${a.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!r?this.renderDeleteAsk(i,e):l`<button type="button" class="ghost danger small" ?disabled=${s||r}
            title=${`Delete these ${u} from every device they are on`}
            @click=${()=>this.toggleAsk()}>${S("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${s}
        title=${`Stop picking and go back to opening one ${p} at a time`}
        @click=${()=>this.endSelect()}>${S("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let i=_(e,t,N),n=se(i,t);return l`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${i.items.length===0}
        @click=${()=>this.runDelete()}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,i){let n=t.item,s=i===void 0?[]:ve(Se(e,i.ownerId)),r=s.length===0?[n]:s,o=this.hassNow?.states,a=this.icons,p=K/L.width,u=ni(n,o,a),g=u.height*p,m=g>ae,$=h=>`${Math.round(h*100)/100}px`,I=i?.kind==="watch"?this.appVersionOf(i):void 0;return l`<span class="ap-pic ${m?"cut":""}" style=${`width:${$(K)};height:${$(Math.min(g,ae))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${$(-u.top*p)})`}>${Ke({page:n,pages:r,screen:L,scale:p,...o===void 0?{}:{states:o},...a===void 0?{}:{icons:a},...I===void 0?{}:{appVersion:I}})}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,i=K/L.width,n=o=>`${Math.round(o*100)/100}px`,r=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return l`<span class="ap-pic ap-pic-status ${r?"cut":""}" style=${`width:${n(K)};height:${n(Math.min(L.height*i,ae))}`}>
      <span class="ap-pic-in">${t===void 0?b:He({page:e.item,hass:t,icons:this.icons??Le,screen:L,scale:i})}</span>
    </span>`}static{this.styles=[Ue,Be,ze,Ht,Ut,Ye,yt,It,kt,ft,pe`
    .ap-embed-saved { position: absolute; right: 0; top: -26px; }
    :host([embedded]) { position: relative; }
    /* On the board the device heads are what stays on screen, right under
       the tab bar, so the toolbar scrolls away (\`.bd-pin\`). */
    .ap-page { --bd-pin-top: calc(-1 * var(--ap-top, 0px)); }
    .pk-surface.pk-page.on-board > .pk-pin { position: static; }
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
  `]}};f([D({attribute:!1})],k.prototype,"kind",2),f([D({attribute:!1})],k.prototype,"owners",2),f([D({attribute:!1})],k.prototype,"ownersReady",2),f([D({attribute:!1})],k.prototype,"phones",2),f([D({attribute:!1})],k.prototype,"icons",2),f([D({attribute:!1})],k.prototype,"iconsTick",2),f([D({attribute:!1})],k.prototype,"onOpenLibrary",2),f([D({attribute:!1})],k.prototype,"focusOwner",2),f([D({attribute:!1})],k.prototype,"onFocus",2),f([D({attribute:!1})],k.prototype,"onOpenScreen",2),f([D({type:Boolean,reflect:!0})],k.prototype,"embedded",2),f([D({attribute:!1})],k.prototype,"searchText",2),f([v()],k.prototype,"search",2),f([v()],k.prototype,"newForm",2),f([v()],k.prototype,"selecting",2),f([v()],k.prototype,"selected",2),f([v()],k.prototype,"asking",2),f([v()],k.prototype,"bulkBusy",2),f([v()],k.prototype,"itemAsk",2),f([v()],k.prototype,"bulkNote",2),f([v()],k.prototype,"tickNotes",2),f([v()],k.prototype,"untickAsk",2),f([v()],k.prototype,"picksBusy",2),f([v()],k.prototype,"picksNote",2),f([v()],k.prototype,"orderAsked",2),f([v()],k.prototype,"hiddenAsked",2),f([v()],k.prototype,"dragId",2),f([v()],k.prototype,"overId",2),f([v()],k.prototype,"freeFacts",2),f([v()],k.prototype,"saved",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",k);export{k as WaAllPages,ni as pageCrop};
