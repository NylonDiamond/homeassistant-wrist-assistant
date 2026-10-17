import{a as Yt,b as y,c as Y,d as J,e as H,f as X,g as Jt,i as Xt,k as Qt}from"./chunk-ILTYHARU.js";import{a as Ft,b as Wt}from"./chunk-BXAW6JOL.js";import{b as Dt,c as _t,d as Ct,e as Lt,f as Ot,g as Et,i as Ht,j as At}from"./chunk-CJ4ITORF.js";import{a as Mt,e as Nt,g as Ut,i as zt}from"./chunk-5EEWN6PV.js";import{a as ft,b as vt,c as gt,d as mt,e as V,f as wt,g as bt,h as yt,i as kt,j as St,l as xt,m as $t,n as Tt,r as is,t as ns}from"./chunk-CY7IJ4BL.js";import{$ as rt,D as E,aa as Z,ba as ot,ca as S,fa as at,ia as dt,r as x,s as K,t as k,u as $,ua as Pt,v as O,va as It,wa as Rt,z as T}from"./chunk-L7FZX4YY.js";import"./chunk-JFEP3FWP.js";import{h as ss}from"./chunk-2DVAWBT3.js";import"./chunk-5S6DYQOX.js";import{a as ct,b as ht,c as lt,d as pt,e as G,h as ut}from"./chunk-L5EIEW65.js";import{a as it,b as nt}from"./chunk-PF5FVRKR.js";import{p as q,q as tt,r as B,s as j}from"./chunk-PEI2F5V4.js";import{b as He,d as Ae,e as N,f as Me}from"./chunk-ZOJGMATP.js";import{a as qt,b as Bt,c as jt,d as Kt,e as Zt,f as Gt,g as Vt}from"./chunk-R3E32QPV.js";import"./chunk-NXR7NIET.js";import"./chunk-UPANJPAF.js";import{a as F,b as W,c as Be,d as je,e as Ke,f as Ze,g as Ge,h as Ve,i as Ye}from"./chunk-LO75GSH6.js";import{d as et}from"./chunk-AMGXZUWS.js";import{a as We,b as qe,e as st}from"./chunk-23ND6PNG.js";import{c as Je,d as Xe,f as Qe}from"./chunk-UYXASAN6.js";import{c as ue}from"./chunk-ZKYND2IQ.js";import{Gd as es,Id as ts,Qb as ze,Rb as Fe,X as U,aa as z,cb as Ue,ua as Ne}from"./chunk-NFUDFSSY.js";import"./chunk-ESIOP3D4.js";import{a as _e,b as Ce,c as Le}from"./chunk-A7XDUFM5.js";import{Eg as R,Gg as de,Ih as ke,Jg as ce,Kg as he,Lg as le,Mg as pe,b as re,d as a,g as h,ig as ae,j as oe,k as g,l as f,nh as w,rh as fe,th as ve,uh as ge,vh as me,wh as we,xh as be,yh as ye}from"./chunk-PGBBLK6E.js";import{B as Se,E as xe,M as $e,N as D,R as Te,Sa as De,U as _,Ua as Oe,Va as C,Wa as Ee,X as Pe,Xa as L,Y as Ie,Z as M,_ as Re}from"./chunk-2ZMALKUC.js";import{a as c}from"./chunk-LO2NM3CE.js";function rs(r){return O(r)||"Untitled page"}function ps(r){return r.name.trim()===""?"a status page":`"${r.name}"`}function A(r){if(r.length===0)return"";let p=r.map(ps);return`Another save also changed ${p.length===1?p[0]:`${p.slice(0,-1).join(", ")} and ${p[p.length-1]}`}. ${p.length===1?"That save's version was kept.":"That save's versions were kept."}`}function os(r){return r.ok?L(us(r),r.linkFailures,"status pages"):fs(r)}function us(r){let p=r.kept??[];if(r.alreadySaved===!0){let e=p.length>0?` ${A(p)}`:"";return{kind:p.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${r.revision}.${e}`}}return p.length>0?{kind:"warn",text:`Saved. ${A(p)}`}:r.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}function fs(r){let p=(r.message??"").trim();switch(r.code){case"conflict":return{kind:"warn",text:"Not saved. The status pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds status pages for this watch. Your edits are kept, so save again."};case"invalid":{let e=r.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the status pages is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the status pages${p===""?".":`: ${p}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Oe}`};case"busy":return{kind:"warn",text:"Already saving these status pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${p===""?".":`: ${p}`}`}}}ts({dirty:X,drop:Jt});typeof window<"u"&&window.addEventListener("beforeunload",r=>{X()&&(r.preventDefault(),r.returnValue="")});var vs=15e3,hs=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Q=hs?"\u2318":"Ctrl+",ee={min:200,max:720,middleMin:320},te={left:280,right:340},se="wrist-assistant-panel.status-pages.columns.v1",gs=24,as=820;function ds(r){return C(r).message}function ie(r){return C(r).code}function cs(r){let{code:p,message:e}=C(r);return Object.assign(new Error(e),p===void 0?{}:{code:p})}function ms(r){return r<1e3?`${r} bytes`:`${Number((r/1e3).toFixed(1))} KB`}function ws(r){let p=r?Date.parse(r):NaN;return Number.isNaN(p)?"":ue(Math.max(0,(Date.now()-p)/1e3))}function bs(r){return r instanceof HTMLElement?Xe(r.tagName,r instanceof HTMLInputElement?r.type:void 0,r.isContentEditable):!1}function ys(){let r=document.activeElement;for(;r?.shadowRoot?.activeElement;)r=r.shadowRoot.activeElement;return r===null||r===document.body||r===document.documentElement}var d=class extends oe{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=h;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.headBar=new _e(this);this.unsupported=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.lib=new Pt(this,()=>this.hass,()=>this.linkDevices.map(e=>e.ownerId));this.deletingAll=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=ft();this.columns={...te};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Be(this);this.symbols=new Ne(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||this.load(e,!0)};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let t=e.composedPath();if(!t.includes(this)&&!this.headBar.holds(t)&&!ys()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,i=e.key.toLowerCase();if(s&&!e.altKey&&i==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(!bs(t[0])){if(s&&!e.altKey&&i==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&i==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!s&&!e.altKey){let n=this.viewHost();n!==void 0&&wt(n)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let t=e.composedPath(),s=i=>t.some(n=>n instanceof HTMLElement&&n.classList.contains(i));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("sp-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(ze,this.onScrubStart),this.addEventListener(Fe,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return Te(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return ss(this.watches,this.watchId)?"iphone":"watch"}get draft(){let e=this.watchId,t=this.record;if(!(e===void 0||t===void 0)){if(t.revision>0){let s=y(e);if(s!==void 0)return s;let i=x(t.document);return i===void 0?void 0:Y(e,i,t.revision).draft}if(!(this.unsupported||!this.opensReady()))return y(e)??J(e)}}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Ae(se,te,ee),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++}willUpdate(e){if(this.hass){e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,ae(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]}));let s=De(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let t=this.restoreAsk;t!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===t.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),Ge(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let t of e){if(t.target!==this){this.measureTop(t.target);continue}let s=t.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let t=this.renderRoot?.querySelector(".pe-top")??void 0;t!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=t,t!==void 0&&e.observe(t))}measureTop(e){let t=e.offsetHeight;t!==this.topHeight&&(this.topHeight=t,this.style.setProperty("--pe-top-h",`${t}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let t=y(e)?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let s=()=>this.saveEnded(e);t.then(s,s)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,t=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),this.deleteAsk=void 0,t=!1);let s=Xt(e);s!==void 0&&V({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},s),this.startSubscription(e),this.load(e,t)}async load(e,t=!1){let s=this.hass;if(!s)return;if(t&&this.holdReload){this.reloadPending=!0;return}let i=++this.loadSeq;this.stopPolling(),t||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let n=await R(s,e,"status_pages");if(i!==this.loadSeq)return;if(t&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(n),this.loadError=void 0,!t&&Qt(e)&&this.updateComplete.then(()=>{if(this.watchId!==e)return;let o=this.viewHost();o!==void 0&&bt(o)})}catch(n){if(i!==this.loadSeq)return;ot(n)?(this.unsupported=!0,this.loadError=void 0):t||(this.loadError=ds(n)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}get linkDevices(){return it(this.owners.length>0?this.owners:this.ownList??[],this.phones)}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let t=this.watchId;this.record=e,t!==void 0&&e.revision<=0&&J(t);let s=e.revision>0?x(e.document):void 0;if(t===void 0||s===void 0)return;let i=this.restartDraft;i!==void 0&&i.watchId===t&&e.revision>=i.revision&&(this.restartDraft=void 0,(y(t)?.dirty??!1)||H(t));let n=Y(t,s,e.revision);n.kept.length>0?this.note={kind:"warn",text:A(n.kept)}:n.mergedIntoEdits&&(this.note={kind:"warn",text:"The status pages changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let t=this.hass;if(!t||this.historyState==="unsupported")return;let s=++this.historySeq;try{let i=await ce(t,e,"status_pages");if(s!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(i?.entries)?i.entries:[],this.historyState="ready"}catch(i){if(s!==this.historySeq||e!==this.watchId)return;this.historyState=ie(i)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let t=this.hass;if(this.endSubscription(),!t)return;let s=++this.subscribeSeq;pe(t,e,i=>{s===this.subscribeSeq&&i.kind==="status_pages"&&i.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(i=>{s===this.subscribeSeq?this.unsubscribe=i:i().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Se(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},vs))}async poll(){this.pollTimer=void 0;let e=this.hass,t=this.watchId,s=this.record;if(!(!e||t===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let i=await R(e,t,"status_pages");if(t!==this.watchId||this.record!==s)return;i.revision===s.revision?this.record={...s,delivered_revision:i.delivered_revision,delivered_at:i.delivered_at,rejected_revision:i.rejected_revision,rejected_at:i.rejected_at,rejected_reason:i.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(i),this.loadHistory(t))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,t){let s=this.draft;if(!s||this.saving)return!1;let i=s.apply(e(s.document),this.scrubKey??t);return this.requestUpdate(),i}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??Je,t=this.iconMemo;if(t!==void 0&&t.provider===e&&t.tick===this.iconsTick)return t.icons;let s=Qe(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}screen(){let e=this.phoneLayout();if(e!==void 0)return lt(e);let t=this.watches.find(s=>s.owner_watch_id===this.watchId);return(z(t?.screen_size)??U).screen}phoneLayout(){if(this.device!=="iphone")return;let e=this.watches.find(t=>t.owner_watch_id===this.watchId);return ht(ct(e?.screen_size))}viewHost(){let e=this.draft,t=this.hass;if(e===void 0||t===void 0)return;let s=this;return{hass:t,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*G,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},get document(){return e.document},get busy(){return s.saving},...this.libraryHost(e),edit:(i,n)=>this.draft===e&&this.edit(i,n),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}libraryHost(e){let t=this.lib.library,s=this.watchId;if(t===void 0||s===void 0)return{};let i=this.linkDevices,n=Ht(t,s,k(e.document).map($),i),o=this.renderElsewhere();return{linkBadge:l=>Dt(t,"status_pages",$(l),s,i),...n===void 0?{}:{sharedLine:n},...i.length>1?{ticks:l=>this.renderStatusTicks(l)}:{},deletePage:l=>this.askDelete(l),...o===h?{}:{elsewhere:o}}}deviceName(e){return this.linkDevices.find(t=>S(t.ownerId,e))?.name??"the other device"}get hereDevice(){let e=this.watchId;if(e!==void 0)return this.linkDevices.find(t=>S(t.ownerId,e))??{ownerId:e,name:`This ${nt(this.device)}`,kind:this.device}}statusTickLocked(e,t){let s=this.watchId;if(s===void 0)return;if(S(t,s))return _t("status_pages",this.device);let i=this.lib.library;if(i!==void 0&&dt(i,"status_pages",e).some(o=>S(o,t))&&(y(t)?.dirty??!1))return Ct(this.deviceName(t))}renderStatusTicks(e){let t=this.lib.library,s=this.lib.store,i=this.watchId,n=t===void 0?void 0:at(t,"status_pages",$(e)),o;if(t===void 0||s===void 0||i===void 0||n===void 0||!n.owners.some(l=>S(l,i)))o=a`<p class="sp-lib-hint">${Lt("status_pages")}</p>`;else{let l=s.noteFor("status_pages",n.id),v=this.hass?.user?.is_admin;o=It({library:t,kind:"status_pages",itemId:n.id,devices:this.linkDevices,colorOf:u=>this.colorOf(u),pending:s.pending,...l===void 0?{}:{note:l},...v===void 0?{}:{admin:v},locked:u=>this.statusTickLocked(n.id,u)},(u,b)=>{zt(this.hass,s,u,"status_pages",n.id,b)})}return a`<div class="sp-lib" role="group" aria-label="Devices"><span class="sp-lib-h">Devices</span>${o}</div>`}renderElsewhere(){let e=this.lib.library,t=this.lib.store,s=this.hereDevice;if(e===void 0||t===void 0||s===void 0)return h;let i=this.hass?.user?.is_admin,n=this.memoIcons();return Ft({library:e,kind:"status_pages",here:s,rows:At(e,s.ownerId,"status_pages",this.linkDevices),colorOf:o=>this.colorOf(o),pending:t.pending,noteFor:o=>t.noteFor("status_pages",o),...i===void 0?{}:{admin:i},...this.saving?{locked:"Saving. Try again once the save is done."}:{},picture:o=>is({page:o.item,hass:this.hass,icons:n,tick:this.iconsTick}),onAdd:o=>{this.addHere(o)}})}async addHere(e){let t=this.lib.store,s=this.watchId;t===void 0||s===void 0||this.saving||!(await t.pick(s,"status_pages",e,!0)).ok||s!==this.watchId||(await this.load(s,!0),s===this.watchId&&T(this.draft?.document,e)!==void 0&&V({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},e))}deleteChoices(e){let t=this.watchId;if(t!==void 0)return Ot(this.lib.library,"status_pages",e,t,this.device,this.linkDevices)}askDelete(e){let t=T(this.draft?.document,e);if(!(this.watchId===void 0||t===void 0||this.saving)){if(this.deleteChoices(e)===void 0){this.edit(s=>E(s,e));return}this.deleteAsk={pageId:e}}}closeDelete(){this.renderRoot?.querySelector("dialog.sp-del-ask")?.close(),this.deleteAsk=void 0}deleteHere(){let e=this.deleteAsk;this.closeDelete(),e!==void 0&&this.edit(t=>E(t,e.pageId))}async deleteFromLibrary(){let e=this.deleteAsk,t=this.lib.store,s=this.watchId;if(!e||t===void 0||s===void 0||this.deletingAll)return;this.deletingAll=!0;let i=await t.deleteItem("status_pages",e.pageId);if(this.deletingAll=!1,s!==this.watchId)return;if(!i.ok){this.closeDelete(),this.note={kind:"err",text:`Not deleted. ${i.text}`};return}this.dirty?this.deleteHere():(this.closeDelete(),this.load(s,!0));let n=i.reply.link_failures??[];this.note=n.length>0?{kind:"warn",text:`Deleted from the library. Could not update ${n.map(o=>o.name).join(", ")}.`}:{kind:"ok",text:"Deleted from the library and from every device."}}renderDeleteAsk(e){let t=T(this.draft?.document,e.pageId),s=this.deleteChoices(e.pageId);if(t===void 0||s===void 0)return h;let i=this.deletingAll;return a`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
      @cancel=${n=>{i&&n.preventDefault()}}
      @close=${()=>{this.deletingAll||(this.deleteAsk=void 0)}}>
      <h3 id="sp-del-title">Delete "${rs(t)}"?</h3>
      <p>${s.body} You can undo a remove here until you leave this page.</p>
      <div class="pe-ask-foot sp-del-foot">
        <button class="pe-btn" ?disabled=${i} @click=${()=>this.closeDelete()}>Cancel</button>
        <button class="pe-btn pe-danger sp-del-here" ?disabled=${i} @click=${()=>this.deleteHere()}>${s.remove}</button>
        <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${i||this.saving}
          @click=${()=>{this.deleteFromLibrary()}}>${i?"Deleting\u2026":s.library}</button>
      </div>
    </dialog>`}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,t=this.watchId;this.endScrub();let s=this.draft;if(!e||t===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let i=s.revision<=0,n=Nt(k(s.base),k(s.document)),o=Mt(this.lib.library,t,"status_pages"),l=Yt(s,{save:(u,b)=>de(e,t,"status_pages",u,b).catch(P=>{throw cs(P)}),fetch:async()=>{let u=await R(e,t,"status_pages").catch(b=>{throw cs(b)});return{revision:u.revision,document:u.document}}});this.followedSave=s.saveDone,this.requestUpdate();let v=await l.catch(u=>({ok:!1,revision:s.revision,merged:!1,code:ie(u)??"unknown",message:ds(u)}));if(this.saveEnded(t),t===this.watchId&&(this.note=Kt(i,v.code,os(v))),v.ok&&n.length>0){let u=await Ut(e,t,n,o);u!==void 0&&t===this.watchId&&this.note===void 0&&(this.note=u)}}startFresh(){let e=this.watchId;e===void 0||!Re(this.noRecordState())||(qt("status_pages",e),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let t=this.hass,s=this.watchId,i=this.record;if(!t||s===void 0||i===void 0||this.draft?.dirty)return;let n={entry:e,baseRevision:i.revision};this.restoreAsk=n,he(t,s,"status_pages",e.revision).then(o=>{if(this.restoreAsk!==n)return;let l=Et(this.lib.library,"status_pages",s,k(x(o.document)),this.linkDevices);this.restoreAsk={...n,summary:rt(o.document),...l===void 0?{}:{others:l}}},()=>{})}async restore(){let e=this.hass,t=this.watchId,s=this.restoreAsk;if(!e||t===void 0||s===void 0||this.restoring)return;this.restoring=!0;let i;try{let n=await le(e,t,"status_pages",s.entry.revision,s.baseRevision);i=L({kind:"ok",text:et(s.entry.updated_at)},Ee(n),"status pages"),t===this.watchId?this.restartDraft={watchId:t,revision:n.revision}:(y(t)?.dirty??!1)||H(t)}catch(n){let o=ie(n);o==="conflict"?i={kind:"warn",text:"Not restored. The status pages changed somewhere else, so the newest copy is shown."}:o==="no_record"?i={kind:"warn",text:`Not restored. Home Assistant no longer holds status pages for this ${D(this.device)}.`}:o==="not_found"?i={kind:"warn",text:"Not restored. That save is no longer kept."}:o==="unknown_command"?(this.historyState="unsupported",i={kind:"warn",text:"This version of the integration cannot restore status pages. Update it to restore an earlier save."}):i={kind:"err",text:`Could not restore: ${Ue(n)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}t===this.watchId&&(this.note=i,this.load(t,!0))}render(){let e=this.watches,t=this.draft;return a`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(t,e):h}
        ${this.note?a`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:h}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):h}
      ${this.deleteAsk&&!this.restoreAsk?this.renderDeleteAsk(this.deleteAsk):h}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=as}renderTopBar(e,t){let s=e!==void 0&&!this.unsupported,i=s&&this.dirty;return a`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch status pages">
      ${this.haMenu?a`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${w("menu")}</button>`:h}
      ${this.shellOwnsWatch?h:a`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():es(void 0,!1)}>${w("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?h:this.renderWatchPicker(t)}
      ${this.barHost!==void 0&&s?Ce({newWatch:this.newWatch,dirty:i,saved:W(this.record,void 0,this.device),device:this.device}):h}
      ${this.renderSyncPill(s?e:void 0)}
      ${this.renderTopMenu(s?e:void 0)}
      ${s?a`<button class="primary save ${i?"dirty":""}" ?disabled=${!i||this.saving}
          title=${i?`Save (${Q}S). A save reaches the ${D(this.device)} the next time it checks.`:`Nothing to save (${Q}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?h:a`<span class="tb-saved" title=${i?"Unsaved changes":""}>${W(this.record,void 0,this.device)}</span>
        ${Gt(jt({newWatch:this.newWatch,dirty:i,saving:this.saving}))}`}`:h}
      ${this.barActions}
    </div>`}renderSyncPill(e){let t=this.record;if(t===void 0||t.revision<=0||this.unsupported)return h;let s=e===void 0?{size:0,limit:1}:K(e.document),i=F({record:t,size:s.size,limit:s.limit,noun:"status pages",historyState:this.historyState,device:this.device});return a`<span class="tb-sync ${i.tone==="ok"?"ok":"warn"}" title=${`${i.state}. ${i.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${i.state}</span>
    </span>`}noRecordState(e=this.watches){return Pe(e.find(t=>t.owner_watch_id===this.watchId))}opensReady(e=this.watches){return Bt(this.noRecordState(e),"status_pages",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let t=this.canStartFresh();if(e===void 0&&!t)return h;let s=this.topMenuOpen,i=n=>()=>{this.topMenuOpen=!1,n()};return a`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?a`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?a`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${i(()=>this.discard())}>Discard edits</button>`:h}
        ${t?a`<button class="row" role="menuitem"
          @click=${i(()=>this.startFresh())}>${M}</button>`:h}
      </div>`:h}
    </span>`}colorOf(e){return qe(We(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return h;let t=e.find(n=>n.owner_watch_id===this.watchId),s=this.watchMenuOpen,i=n=>{let o=n===void 0?void 0:this.colorOf(n);return a`<span class="pe-chip-glyph" style=${o?`--pe-person: ${o}`:h} aria-hidden="true">${w("watch")}</span>`};return a`<span class="picker sp-watch-picker">
      <button type="button" class="tb-browse sp-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose status pages are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${i(t?.owner_watch_id)}<span class="tb-browse-l">${t?_(t,e):"Choose a watch"}</span>
        <span class="sp-caret" aria-hidden="true">${w("chevron")}</span>
      </button>
      ${s?a`<div class="pop-menu sp-watch-menu" role="menu" aria-label="Watches">
        ${e.map(n=>{let o=n.owner_watch_id===this.watchId;return a`<button type="button" class="row sp-watch-row" role="menuitemradio" aria-checked=${o?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,o||this.openWatch(n.owner_watch_id)}}>
            ${i(n.owner_watch_id)}<span class="sp-watch-name">${_(n,e)}</span>
            <span class="sp-watch-check" aria-hidden="true">${o?w("check"):h}</span>
          </button>`})}
      </div>`:h}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=as?this.columns:He(this.hostWidth-gs,this.columns,ee)}renderGutter(e){return a`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the pages and rows column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${t=>{let s=this.fittedColumns();Me(t,{side:e,base:e==="left"?s.left:s.right,limits:ee,onWidth:i=>{this.columns={...this.columns,[e]:i}},onEnd:()=>N(se,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:te[e]},N(se,this.columns)}}></div>`}get stageScale(){return this.zoom??q(this.narrow||this.stacked)}setZoom(e){this.zoom=e,vt(e)}renderStage(e,t){let s=t.find(I=>I.owner_watch_id===this.watchId),n=z(s?.screen_size)??U,o=e.phone!==void 0,l=e.phone===void 0?n.label:e.phone.model.label,v=[...xt(e),l],u=I=>tt(o?I*G:I),b=mt(e),P=b===void 0?"Status pages":O(b)||"Untitled page",ne=this.draft,m=this.stageScale,ls=q(this.narrow||this.stacked);return a`<div class="card canvas-card lit sp-canvas" aria-label="Status page">
      <div class="cv-head">
        <span class="cv-title" title=${P}>${P}</span>
        ${s!==void 0?a`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${_(s,t)}</span></span>`:h}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${v.join(" \xB7 ")}><span class="fam">${v.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!ne?.canUndo} title=${`Undo (${Q}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${w("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!ne?.canRedo} title=${hs?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${w("redo")}</button>
        </span>
      </div>
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <button class="tb sp-case" aria-disabled="true" tabindex="-1" title=${o?pt:`This watch's screen, ${n.label}.`}>
            ${w(o?"phone":"watch")}<span class="word keep">${l}</span></button>
          <span class="tb-sep" aria-hidden="true"></span>
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${m<=j(m)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(j(m))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${u(m)}. Back to fit`}
              title=${`The ${o?"iPhone":"watch"} at ${u(m)} of its own points. Click to fit it again (${u(ls)}).`}
              @click=${()=>this.setZoom(void 0)}>${u(m)}</button>
            <button class="tb icon" ?disabled=${m>=B(m)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(B(m))}>+</button>
          </span>
        </div>
        <div class="sp-stage-body">${St(e)}</div>
        <div class="under"><span class="tail">${gt}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0){let v=this.owners.length===0&&this.ownList===void 0;return a`<div class="pe-empty">${v?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return a`<div class="pe-empty"><b>${Z}</b></div>`;if(this.loading)return a`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let v=this.watchId;return a`<div class="pe-empty">
        <span>Could not read this ${D(this.device)}'s status pages: ${this.loadError}</span>
        ${v===void 0?h:a`<button class="pe-btn" @click=${()=>{this.load(v)}}>Try again</button>`}
      </div>`}let t=this.record;if(t===void 0)return a`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&t.revision>0)return a`<div class="pe-empty"><b>${Z}</b></div>`;if(s===void 0){let v=this.watchId===void 0?void 0:y(this.watchId),u=this.watchId;return a`<div class="pe-empty"><b>${$e("status pages",this.device)}</b><span>${Ie}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${M}</button>
        ${v?.dirty&&u!==void 0?a`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when status pages are here again.</span>
          <button class="pe-btn" @click=${()=>{H(u),this.requestUpdate()}}>Discard the kept edits</button>`:h}
      </div>`}let i=this.viewHost();if(i===void 0)return a`<div class="pe-empty">Loading…</div>`;let n=this.fittedColumns(),o=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",l=t.revision<=0;return a`${l&&this.barHost===void 0?Zt(this.device):h}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${n.left}px;--wa-right:${n.right}px;${o}`}>
      <div class="column left">
        ${yt(i)}
        ${kt(i)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(i,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${$t(i)}
      </div>
    </div>
    ${l?h:this.renderFoot(t,s.document,s.dirty)}`}renderFoot(e,t,s){let i=K(t),n=F({record:e,size:i.size,limit:i.limit,noun:"status pages",historyState:this.historyState,device:this.device}),o=this.watchId;return a`${je({status:n,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Ke({noun:"status pages",device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{o!==void 0&&(this.historyState="loading",this.loadHistory(o))},onRestore:l=>{this.historyOpen=!1,this.askRestore(l)},onClosed:()=>{this.historyOpen=!1}}):h}
    ${this.rawOpen?Ze({noun:"status pages",document:t,revision:e.revision,dirty:s,copied:this.rawCopied,onCopy:l=>{Ve(l).then(v=>{this.rawCopied=v})},onClosed:()=>{this.rawOpen=!1}}):h}`}renderRestoreAsk(e){let t=this.record,s=ws(e.entry.updated_at);return a`<dialog class="pe-ask" aria-labelledby="sp-ask-title"
      @cancel=${i=>{this.restoring&&i.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="sp-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${xe(e.entry.updated_by,this.device)}${s?` ${s}`:""}, ${ms(e.entry.size)}.</p>
      ${e.summary?a`<p class="pe-muted">${e.summary}</p>`:h}
      <p>It is saved again as a new revision${t?`, after revision ${t.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      ${e.others===void 0?h:a`<p class="sp-restore-others">${e.others}</p>`}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[ke,fe,ve,ge,me,we,be,ye,st,ut,Vt,re`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
      scroll-padding-top: var(--pe-top-h, 0px);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }
    .pe-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 0;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .wa-bar .tb-saved .cf-saved { margin: 0; font-size: inherit; color: inherit; }
    .wa-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
    .wa-bar .pop-menu .row:disabled:hover { background: transparent; }
    .pe-top > .pe-note { margin: 10px var(--cf-pad, 16px) 0; }
    .pe-note {
      display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .pe-note > span { flex: 1; min-width: 0; }
    .pe-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
    .pe-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .pe-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .pe-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
    .pe-link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
    .pe-empty {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 560px;
      padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .layout.pe-layout { flex: none; min-height: auto; overflow: visible; align-items: start; padding: 0; margin-bottom: 14px; }
    .pe-layout > .column.left, .pe-layout > .column.inspector {
      --pe-under-top: max(0px, calc(var(--pe-top-h, 0px) - var(--cf-pad, 16px)));
      position: sticky; top: var(--pe-under-top);
      max-height: calc(var(--pe-view-h, calc(100dvh - 120px)) - 30px - var(--pe-under-top));
      overflow-y: auto; overflow-x: hidden;
    }
    .pe-layout > .column.left { display: flex; flex-direction: column; gap: 8px; scrollbar-gutter: auto; }
    .pe-layout > .column.left > .card { flex: none; }
    .pe-layout > .column.canvas { overflow: visible; min-height: auto; }
    @container (max-width: 820px) {
      .layout.pe-layout { grid-template-columns: minmax(0, 1fr); }
      .pe-layout > .gutter { display: none; }
      /* As strong as the sticky rule, so a stacked list or inspector stops
         sliding over the cards above it (the page editor's fix). */
      .pe-layout > .column.left, .pe-layout > .column.canvas, .pe-layout > .column.inspector { grid-column: auto; position: static; max-height: none; overflow: visible; }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
      .pe-layout > .column.left { order: 3; }
    }
    .column.canvas > .card.canvas-card.sp-canvas { min-height: 0; flex: none; }
    /* The lit stage's edge in Status pages' hue, Home's Status pages door. */
    .canvas-card.sp-canvas { --wa-stage-hue: var(--wa-hue-yellow); }
    .cv-head .cv-title { flex: 0 1 auto; min-width: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cv-head .cv-watch { min-width: 0; font-size: 12.5px; font-weight: 500; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.sp-watch-btn { max-width: 260px; }
    .sp-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sp-watch-btn .sp-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.sp-watch-btn .sp-caret svg { width: 11px; height: 11px; }
    .pop-menu.sp-watch-menu { left: 0; right: auto; min-width: 220px; }
    .sp-watch-menu .row.sp-watch-row { display: flex; align-items: center; gap: 8px; }
    .sp-watch-row .sp-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .sp-watch-row[aria-checked="true"] { font-weight: 700; }
    .sp-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .sp-watch-check svg.ui-icon { width: 14px; height: 14px; }
    .sp-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    @container (max-width: 460px) {
      .sp-stage-area { padding-top: 92px; }
    }
    .sp-stage-body { display: flex; justify-content: center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    .sp-stage-area > .under {
      display: flex; flex-direction: column; gap: 4px; align-self: center; max-width: 460px; text-align: center;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
    }
    .stage-tools button.tb.sp-case { cursor: default; }
    .stage-tools button.tb.sp-case:hover { background: transparent; }
    .stage-tools button.tb.sp-case > svg.ui-icon { width: 14px; height: 14px; }
    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-h-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .pe-h-text > .pe-muted { font-size: 12px; }
    .pe-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 32px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-btn:hover:not(:disabled) { background: var(--wa-panel); }
    .pe-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-btn:disabled { opacity: .55; cursor: default; }
    .pe-btn.pe-primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .pe-btn.pe-primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }
    .pe-btn.pe-danger { color: var(--wa-need); align-self: flex-start; }
    dialog.pe-ask {
      width: min(460px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    dialog.pe-ask p.pe-muted { font-size: 13px; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }
    /* The delete question's two long answers wrap under each other. */
    .pe-ask-foot.sp-del-foot { flex-wrap: wrap; }
    .sp-restore-others { color: var(--wa-amber); }
    :host([narrow]) { --cf-pad: 12px; }
  `,Tt,Rt,ns,Wt,Ye,Le]}};c([g({attribute:!1})],d.prototype,"hass",2),c([g({attribute:!1})],d.prototype,"owners",2),c([g({attribute:!1})],d.prototype,"ownerId",2),c([g({type:Boolean,reflect:!0})],d.prototype,"narrow",2),c([g({attribute:!1})],d.prototype,"icons",2),c([g({attribute:!1})],d.prototype,"iconsTick",2),c([g({attribute:!1})],d.prototype,"haMenu",2),c([g({attribute:!1})],d.prototype,"onHaMenu",2),c([g({attribute:!1})],d.prototype,"onBack",2),c([g({attribute:!1})],d.prototype,"barActions",2),c([g({attribute:!1})],d.prototype,"shellOwnsWatch",2),c([g({attribute:!1})],d.prototype,"phones",2),c([g({attribute:!1})],d.prototype,"barHost",2),c([f()],d.prototype,"watchId",2),c([f()],d.prototype,"record",2),c([f()],d.prototype,"unsupported",2),c([f()],d.prototype,"loading",2),c([f()],d.prototype,"loadError",2),c([f()],d.prototype,"history",2),c([f()],d.prototype,"historyState",2),c([f()],d.prototype,"note",2),c([f()],d.prototype,"restoreAsk",2),c([f()],d.prototype,"restoring",2),c([f()],d.prototype,"historyOpen",2),c([f()],d.prototype,"rawOpen",2),c([f()],d.prototype,"rawCopied",2),c([f()],d.prototype,"ownList",2),c([f()],d.prototype,"deleteAsk",2),c([f()],d.prototype,"deletingAll",2),c([f()],d.prototype,"topMenuOpen",2),c([f()],d.prototype,"watchMenuOpen",2),c([f()],d.prototype,"zoom",2),c([f()],d.prototype,"columns",2),c([f()],d.prototype,"hostWidth",2),c([f()],d.prototype,"hostHeight",2);customElements.get("wa-status-pages-editor")||customElements.define("wa-status-pages-editor",d);export{se as SP_COLUMNS_KEY,d as WaStatusPagesEditor};
