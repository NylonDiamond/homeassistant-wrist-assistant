import{a as Qt,b as y,c as ee,d as te,e as T,f as ie,g as ei,i as ti,k as ii}from"./chunk-T3PNGF4Z.js";import{a as qt,b as Wt}from"./chunk-5KK27F7K.js";import{b as Ht,c as At,d as Et,e as Mt,f as Nt,g as zt,i as Ft,j as Ut}from"./chunk-TTNHHVPY.js";import{a as Pt,e as _t,g as Bt,i as Kt}from"./chunk-RQJX2WO3.js";import{a as gt,b as bt,c as wt,d as yt,e as Q,f as kt,g as xt,h as St,i as $t,j as Tt,l as It,m as Rt,n as Dt,r as mi,t as gi}from"./chunk-VTX2BJJP.js";import{Aa as Ot,B as A,Ba as se,Ca as ai,Da as oi,Ea as di,Fa as hi,Ga as li,H as G,Ia as ci,Ja as pi,Ka as ui,La as fi,Ma as vi,da as lt,e as at,ea as V,fa as ct,ga as $,ja as Y,ma as J,s as O,t as j,u as S,v as H,w as ht,x as Z,ya as Ct,za as Lt}from"./chunk-4CBUJRLX.js";import"./chunk-AYDHV5MH.js";import"./chunk-JBFPJPUR.js";import{Xd as ri,a as pt,b as ut,c as ft,d as vt,e as X,h as mt}from"./chunk-3KYFON5O.js";import{a as ot,b as dt}from"./chunk-TE5Q2R5V.js";import{p as K,q as nt,r as q,s as W}from"./chunk-PEI2F5V4.js";import{b as Ne,d as ze,e as N,f as Fe}from"./chunk-ZOJGMATP.js";import{a as jt,b as Zt,c as Gt,d as Vt,e as Yt,f as Jt,g as Xt}from"./chunk-F32PSVAR.js";import"./chunk-FR3OKHYP.js";import"./chunk-TWGLBOZ3.js";import{a as U,b as B,c as Ze,d as Ge,e as Ve,f as Ye,g as Je,h as Xe,i as Qe}from"./chunk-CWTJRXV4.js";import{d as st}from"./chunk-AMGXZUWS.js";import{a as We,b as je,e as rt}from"./chunk-ZHPGRUAI.js";import{c as et,d as tt,f as it}from"./chunk-GR4P77YP.js";import{c as me}from"./chunk-ZKYND2IQ.js";import{Gd as si,Id as ni,Qb as Ke,Rb as qe,X as z,aa as F,cb as Be,ua as Ue}from"./chunk-7YM7HFT5.js";import"./chunk-ESIOP3D4.js";import{a as Oe,b as He,c as Ae}from"./chunk-X2QLAQLV.js";import{Eg as D,Gg as ce,Ih as $e,Jg as pe,Kg as ue,Lg as fe,Mg as ve,b as de,d as o,g as l,ig as le,j as he,k as g,l as u,nh as b,rh as ge,th as be,uh as we,vh as ye,wh as ke,xh as xe,yh as Se}from"./chunk-E5S2SHQS.js";import{B as Te,E as Ie,M as Re,N as P,R as De,Sa as Le,U as _,Ua as Ee,Va as C,Wa as Me,X as Pe,Xa as L,Y as _e,Z as M,_ as Ce}from"./chunk-PPFKQRTD.js";import{a as h}from"./chunk-LO2NM3CE.js";function $i(a){return a.name.trim()===""?"a status page":`"${a.name}"`}function E(a){if(a.length===0)return"";let p=a.map($i);return`Another save also changed ${p.length===1?p[0]:`${p.slice(0,-1).join(", ")} and ${p[p.length-1]}`}. ${p.length===1?"That save's version was kept.":"That save's versions were kept."}`}function bi(a){return a.ok?L(Ti(a),a.linkFailures,"status pages"):Ii(a)}function Ti(a){let p=a.kept??[];if(a.alreadySaved===!0){let e=p.length>0?` ${E(p)}`:"";return{kind:p.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${a.revision}.${e}`}}return p.length>0?{kind:"warn",text:`Saved. ${E(p)}`}:a.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}function Ii(a){let p=(a.message??"").trim();switch(a.code){case"conflict":return{kind:"warn",text:"Not saved. The status pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds status pages for this watch. Your edits are kept, so save again."};case"invalid":{let e=a.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the status pages is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the status pages${p===""?".":`: ${p}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Ee}`};case"busy":return{kind:"warn",text:"Already saving these status pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${p===""?".":`: ${p}`}`}}}ni({dirty:ie,drop:ei});typeof window<"u"&&window.addEventListener("beforeunload",a=>{ie()&&(a.preventDefault(),a.returnValue="")});var Ri=15e3,xi=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),I=xi?"\u2318":"Ctrl+",ne={min:200,max:720,middleMin:320},re={left:280,right:340},ae="wrist-assistant-panel.status-pages.columns.v1",Di=24,wi=820;function yi(a){return C(a).message}function oe(a){return C(a).code}function ki(a){let{code:p,message:e}=C(a);return Object.assign(new Error(e),p===void 0?{}:{code:p})}function Pi(a){return a<1e3?`${a} bytes`:`${Number((a/1e3).toFixed(1))} KB`}function _i(a){let p=a?Date.parse(a):NaN;return Number.isNaN(p)?"":me(Math.max(0,(Date.now()-p)/1e3))}function Ci(a){return a instanceof HTMLElement?tt(a.tagName,a instanceof HTMLInputElement?a.type:void 0,a.isContentEditable):!1}function Li(){let a=document.activeElement;for(;a?.shadowRoot?.activeElement;)a=a.shadowRoot.activeElement;return a===null||a===document.body||a===document.documentElement}var d=class extends he{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=l;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.libraryItem=void 0;this.headBar=new Oe(this);this.unsupported=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.lib=new Ct(this,()=>this.hass,()=>this.linkDevices.map(e=>e.ownerId));this.deletingAll=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=gt();this.columns={...re};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Ze(this);this.symbols=new Ue(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let e=this.recordKey;!this.isConnected||e===void 0||this.load(e,!0)};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let t=e.composedPath();if(!t.includes(this)&&!this.headBar.holds(t)&&!Li()||this.renderRoot.querySelector("dialog[open]"))return;let i=e.metaKey||e.ctrlKey,s=e.key.toLowerCase();if(i&&!e.altKey&&s==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(!Ci(t[0])){if(i&&!e.altKey&&s==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&s==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!i&&!e.altKey){let n=this.viewHost();n!==void 0&&kt(n)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let t=e.composedPath(),i=s=>t.some(n=>n instanceof HTMLElement&&n.classList.contains(s));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("sp-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(Ke,this.onScrubStart),this.addEventListener(qe,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return De(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return ri(this.watches,this.watchId)?"iphone":"watch"}get draft(){let e=this.recordKey,t=this.record;if(!(e===void 0||t===void 0)){if(t.revision>0){let i=y(e);if(i!==void 0)return i;let s=O(t.document);return s===void 0?void 0:ee(e,s,t.revision).draft}if(!(this.libraryItem!==void 0||this.unsupported||!this.opensReady()))return y(e)??te(e)}}get recordKey(){return this.libraryItem===void 0?this.watchId:se(this.libraryItem)}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=ze(ae,re,ne),this.watchSize(),this.listenForReconnect(),this.openedItem!==void 0?this.openItem(!0):this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++}willUpdate(e){if(this.hass)if(e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,le(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]})),this.libraryItem!==void 0)this.followLibraryItem(this.libraryItem);else{this.openedItem!==void 0&&(this.openedItem=void 0,this.watchId=void 0);let i=Le(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));i!==void 0&&this.openWatch(i)}this.followSave();let t=this.restoreAsk;t!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===t.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),Je(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let t of e){if(t.target!==this){this.measureTop(t.target);continue}let i=t.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width),Math.abs(i.height-this.hostHeight)>=1&&(this.hostHeight=i.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let t=this.renderRoot?.querySelector(".pe-top")??void 0;t!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=t,t!==void 0&&e.observe(t))}measureTop(e){let t=e.offsetHeight;t!==this.topHeight&&(this.topHeight=t,this.style.setProperty("--pe-top-h",`${t}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followLibraryItem(e){let t=ci(this.watches,this.watchId);if(t!==this.watchId&&(this.watchId=t),!ai(e,this.openedItem)){this.openedItem=e,this.openItem();return}let i=hi(this.lib.library,e),s=this.record?.revision;i!==void 0&&s!==void 0&&i>s&&i!==this.followedRevision&&(this.followedRevision=i,this.load(se(e),!0))}openItem(e=!1){let t=this.recordKey;t!==void 0&&(e||(this.reloadPending=!1,this.restartDraft=void 0,this.note=void 0,this.unsupported=!1,this.history=[],this.closeAsk(),this.endScrub(),this.uiState.clear(),this.deleteAsk=void 0,this.followedRevision=void 0),this.endSubscription(),this.stopPolling(),this.load(t,e))}followSave(){let e=this.recordKey;if(e===void 0)return;let t=y(e)?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let i=()=>this.saveEnded(e);t.then(i,i)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.recordKey?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,t=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),this.deleteAsk=void 0,t=!1);let i=ti(e);i!==void 0&&Q({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},i),this.startSubscription(e),this.load(e,t)}async load(e,t=!1){let i=this.hass;if(!i)return;if(t&&this.holdReload){this.reloadPending=!0;return}let s=++this.loadSeq;this.stopPolling(),t||(this.record=void 0,this.loading=!0,this.loadError=void 0);let n=this.libraryItem;try{let r=n!==void 0?await oi(i,n):await D(i,e,"status_pages");if(s!==this.loadSeq)return;if(t&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0,!t&&n===void 0&&ii(e)&&this.updateComplete.then(()=>{if(this.watchId!==e)return;let c=this.viewHost();c!==void 0&&xt(c)})}catch(r){if(s!==this.loadSeq)return;n!==void 0?t||(this.loadError=at(r)):ct(r)?(this.unsupported=!0,this.loadError=void 0):t||(this.loadError=yi(r)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!(this.unsupported||n!==void 0)&&(this.pollIfWaiting(),this.loadHistory(e))}get linkDevices(){return ot(this.owners.length>0?this.owners:this.ownList??[],this.phones)}flushPending(){let e=this.recordKey;!this.reloadPending||this.holdReload||e===void 0||(this.reloadPending=!1,this.load(e,!0))}show(e){let t=this.recordKey;this.record=e,t!==void 0&&e.revision<=0&&te(t);let i=e.revision>0?O(e.document):void 0;if(t===void 0||i===void 0)return;let s=this.restartDraft;s!==void 0&&s.watchId===t&&e.revision>=s.revision&&(this.restartDraft=void 0,(y(t)?.dirty??!1)||T(t));let n=ee(t,i,e.revision);n.kept.length>0?this.note={kind:"warn",text:E(n.kept)}:n.mergedIntoEdits&&(this.note={kind:"warn",text:"The status pages changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let t=this.hass;if(!t||this.historyState==="unsupported")return;let i=++this.historySeq;try{let s=await pe(t,e,"status_pages");if(i!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(s?.entries)?s.entries:[],this.historyState="ready"}catch(s){if(i!==this.historySeq||e!==this.watchId)return;this.historyState=oe(s)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let t=this.hass;if(this.endSubscription(),!t)return;let i=++this.subscribeSeq;ve(t,e,s=>{i===this.subscribeSeq&&s.kind==="status_pages"&&s.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(s=>{i===this.subscribeSeq?this.unsubscribe=s:s().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Te(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Ri))}async poll(){this.pollTimer=void 0;let e=this.hass,t=this.watchId,i=this.record;if(!(!e||t===void 0||i===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let s=await D(e,t,"status_pages");if(t!==this.watchId||this.record!==i)return;s.revision===i.revision?this.record={...i,delivered_revision:s.delivered_revision,delivered_at:s.delivered_at,rejected_revision:s.rejected_revision,rejected_at:s.rejected_at,rejected_reason:s.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(s),this.loadHistory(t))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,t){let i=this.draft;if(!i||this.saving)return!1;let s=i.apply(e(i.document),this.scrubKey??t);return this.requestUpdate(),s}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??et,t=this.iconMemo;if(t!==void 0&&t.provider===e&&t.tick===this.iconsTick)return t.icons;let i=it(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:i},i}screen(){let e=this.phoneLayout();if(e!==void 0)return ft(e);let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return(F(t?.screen_size)??z).screen}phoneLayout(){if(this.device!=="iphone")return;let e=this.watches.find(t=>t.owner_watch_id===this.watchId);return ut(pt(e?.screen_size))}viewHost(){let e=this.draft,t=this.hass;if(e===void 0||t===void 0)return;let i=this;return{hass:t,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*X,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},get document(){return e.document},get busy(){return i.saving},...this.libraryHost(e),edit:(s,n)=>this.draft===e&&this.edit(s,n),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}libraryHost(e){let t=this.lib.library;if(this.libraryItem!==void 0)return{single:!0,deletePage:c=>this.askDelete(c)};let i=this.watchId;if(t===void 0||i===void 0)return{};let s=this.linkDevices,n=Ft(t,i,S(e.document).map(H),s),r=this.renderElsewhere();return{linkBadge:c=>Ht(t,"status_pages",H(c),i,s),...n===void 0?{}:{sharedLine:n},...s.length>1?{ticks:c=>this.renderStatusTicks(c)}:{},deletePage:c=>this.askDelete(c),...r===l?{}:{elsewhere:r}}}deviceName(e){return this.linkDevices.find(t=>$(t.ownerId,e))?.name??"the other device"}get hereDevice(){let e=this.watchId;if(e!==void 0)return this.linkDevices.find(t=>$(t.ownerId,e))??{ownerId:e,name:`This ${dt(this.device)}`,kind:this.device}}statusTickLocked(e,t){if(this.libraryItem===void 0){let n=this.watchId;if(n===void 0)return;if($(t,n))return At("status_pages",this.device)}let i=this.lib.library;if(i!==void 0&&J(i,"status_pages",e).some(n=>$(n,t))&&(y(t)?.dirty??!1))return Et(this.deviceName(t))}renderStatusTicks(e){return o`<div class="sp-lib" role="group" aria-label="Devices"><span class="sp-lib-h">Devices</span>${this.statusTicksBody(e)}</div>`}statusTicksBody(e){let t=this.lib.library,i=this.lib.store,s=this.watchId,n=t===void 0?void 0:Y(t,"status_pages",H(e)),r=this.libraryItem!==void 0||s!==void 0&&n?.owners.some(f=>$(f,s))===!0;if(t===void 0||i===void 0||n===void 0||!r)return o`<p class="sp-lib-hint">${Mt("status_pages")}</p>`;let c=i.noteFor("status_pages",n.id),v=this.hass?.user?.is_admin;return Lt({library:t,kind:"status_pages",itemId:n.id,devices:this.linkDevices,colorOf:f=>this.colorOf(f),pending:i.pending,...c===void 0?{}:{note:c},...v===void 0?{}:{admin:v},locked:f=>this.statusTickLocked(n.id,f)},(f,m)=>{Kt(this.hass,i,f,"status_pages",n.id,m)})}renderBarDevices(e){let t=this.lib.library,i=this.libraryItem,s=e===void 0?void 0:S(e.document)[0];return t===void 0||i===void 0||s===void 0?l:fi("status_pages",Y(t,"status_pages",i.id)?.owners.length??0,this.statusTicksBody(s))}renderElsewhere(){let e=this.lib.library,t=this.lib.store,i=this.hereDevice;if(e===void 0||t===void 0||i===void 0)return l;let s=this.hass?.user?.is_admin,n=this.memoIcons();return qt({library:e,kind:"status_pages",here:i,rows:Ut(e,i.ownerId,"status_pages",this.linkDevices),colorOf:r=>this.colorOf(r),pending:t.pending,noteFor:r=>t.noteFor("status_pages",r),...s===void 0?{}:{admin:s},...this.saving?{locked:"Saving. Try again once the save is done."}:{},picture:r=>mi({page:r.item,hass:this.hass,icons:n,tick:this.iconsTick}),onAdd:r=>{this.addHere(r)}})}async addHere(e){let t=this.lib.store,i=this.watchId;t===void 0||i===void 0||this.saving||!(await t.pick(i,"status_pages",e,!0)).ok||i!==this.watchId||(await this.load(i,!0),i===this.watchId&&A(this.draft?.document,e)!==void 0&&Q({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},e))}deleteChoices(e){let t=this.watchId;if(t!==void 0)return Nt(this.lib.library,"status_pages",e,t,this.device,this.linkDevices)}askDelete(e){if(!(A(this.draft?.document,e)===void 0||this.saving)){if(this.libraryItem!==void 0){this.deleteAsk={pageId:e};return}if(this.watchId!==void 0){if(this.deleteChoices(e)===void 0){this.edit(i=>G(i,e));return}this.deleteAsk={pageId:e}}}}closeDelete(){this.renderRoot?.querySelector("dialog.sp-del-ask")?.close(),this.deleteAsk=void 0}deleteHere(){let e=this.deleteAsk;this.closeDelete(),e!==void 0&&this.edit(t=>G(t,e.pageId))}async deleteFromLibrary(){let e=this.deleteAsk,t=this.lib.store,i=this.recordKey;if(!e||t===void 0||i===void 0||this.deletingAll)return;this.deletingAll=!0;let s=await t.deleteItem("status_pages",e.pageId);if(this.deletingAll=!1,i!==this.recordKey)return;if(this.libraryItem!==void 0){if(this.closeDelete(),!s.ok){this.note={kind:"err",text:`Not deleted. ${s.text}`};return}T(i),this.onBack?.();return}if(!s.ok){this.closeDelete(),this.note={kind:"err",text:`Not deleted. ${s.text}`};return}this.dirty?this.deleteHere():(this.closeDelete(),this.load(i,!0));let n=s.reply.link_failures??[];this.note=n.length>0?{kind:"warn",text:`Deleted from the library. Could not update ${n.map(r=>r.name).join(", ")}.`}:{kind:"ok",text:"Deleted from the library and from every device."}}renderDeleteAsk(e){let t=A(this.draft?.document,e.pageId),i=this.deletingAll;if(t!==void 0&&this.libraryItem!==void 0){let n=this.lib.library===void 0?[]:J(this.lib.library,"status_pages",e.pageId);return o`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
        @cancel=${r=>{i&&r.preventDefault()}}
        @close=${()=>{this.deletingAll||(this.deleteAsk=void 0)}}>
        <h3 id="sp-del-title">Delete "${Z(t)}" from the library?</h3>
        <p>${li(n.length)}</p>
        <div class="pe-ask-foot sp-del-foot">
          <button class="pe-btn" ?disabled=${i} @click=${()=>this.closeDelete()}>Cancel</button>
          <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${i||this.saving}
            @click=${()=>{this.deleteFromLibrary()}}>${i?"Deleting\u2026":"Delete from the library"}</button>
        </div>
      </dialog>`}let s=this.deleteChoices(e.pageId);return t===void 0||s===void 0?l:o`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
      @cancel=${n=>{i&&n.preventDefault()}}
      @close=${()=>{this.deletingAll||(this.deleteAsk=void 0)}}>
      <h3 id="sp-del-title">Delete "${Z(t)}"?</h3>
      <p>${s.body} You can undo a remove here until you leave this page.</p>
      <div class="pe-ask-foot sp-del-foot">
        <button class="pe-btn" ?disabled=${i} @click=${()=>this.closeDelete()}>Cancel</button>
        <button class="pe-btn pe-danger sp-del-here" ?disabled=${i} @click=${()=>this.deleteHere()}>${s.remove}</button>
        <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${i||this.saving}
          @click=${()=>{this.deleteFromLibrary()}}>${i?"Deleting\u2026":s.library}</button>
      </div>
    </dialog>`}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,t=this.recordKey,i=this.libraryItem;this.endScrub();let s=this.draft;if(!e||t===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let n=s.revision<=0,r=_t(S(s.base),S(s.document)),c=Pt(this.lib.library,t,"status_pages"),v=Qt(s,i!==void 0?di(e,this.lib.store,i):{save:(m,k)=>ce(e,t,"status_pages",m,k).catch(R=>{throw ki(R)}),fetch:async()=>{let m=await D(e,t,"status_pages").catch(k=>{throw ki(k)});return{revision:m.revision,document:m.document}}});this.followedSave=s.saveDone,this.requestUpdate();let f=await v.catch(m=>({ok:!1,revision:s.revision,merged:!1,code:oe(m)??"unknown",message:yi(m)}));if(this.saveEnded(t),t===this.recordKey&&(this.note=Vt(n,f.code,bi(f))),f.ok&&r.length>0){let m=await Bt(e,t,r,c);m!==void 0&&t===this.recordKey&&this.note===void 0&&(this.note=m)}}startFresh(){let e=this.watchId;e===void 0||!Ce(this.noRecordState())||(jt("status_pages",e),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let t=this.hass,i=this.watchId,s=this.record;if(!t||i===void 0||s===void 0||this.draft?.dirty)return;let n={entry:e,baseRevision:s.revision};this.restoreAsk=n,ue(t,i,"status_pages",e.revision).then(r=>{if(this.restoreAsk!==n)return;let c=zt(this.lib.library,"status_pages",i,S(O(r.document)),this.linkDevices);this.restoreAsk={...n,summary:lt(r.document),...c===void 0?{}:{others:c}}},()=>{})}async restore(){let e=this.hass,t=this.watchId,i=this.restoreAsk;if(!e||t===void 0||i===void 0||this.restoring)return;this.restoring=!0;let s;try{let n=await fe(e,t,"status_pages",i.entry.revision,i.baseRevision);s=L({kind:"ok",text:st(i.entry.updated_at)},Me(n),"status pages"),t===this.watchId?this.restartDraft={watchId:t,revision:n.revision}:(y(t)?.dirty??!1)||T(t)}catch(n){let r=oe(n);r==="conflict"?s={kind:"warn",text:"Not restored. The status pages changed somewhere else, so the newest copy is shown."}:r==="no_record"?s={kind:"warn",text:`Not restored. Home Assistant no longer holds status pages for this ${P(this.device)}.`}:r==="not_found"?s={kind:"warn",text:"Not restored. That save is no longer kept."}:r==="unknown_command"?(this.historyState="unsupported",s={kind:"warn",text:"This version of the integration cannot restore status pages. Update it to restore an earlier save."}):s={kind:"err",text:`Could not restore: ${Be(n)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}t===this.watchId&&(this.note=s,this.load(t,!0))}render(){let e=this.watches,t=this.draft;return o`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(t,e):l}
        ${this.note?o`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:l}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):l}
      ${this.deleteAsk&&!this.restoreAsk?this.renderDeleteAsk(this.deleteAsk):l}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=wi}renderTopBar(e,t){if(this.libraryItem!==void 0)return this.renderLibraryBar(e,t);let i=e!==void 0&&!this.unsupported,s=i&&this.dirty;return o`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch status pages">
      ${this.haMenu?o`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${b("menu")}</button>`:l}
      ${this.shellOwnsWatch?l:o`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():si(void 0,!1)}>${b("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?l:this.renderWatchPicker(t)}
      ${this.barHost!==void 0&&i?He({newWatch:this.newWatch,dirty:s,saved:B(this.record,void 0,this.device),device:this.device}):l}
      ${this.renderSyncPill(i?e:void 0)}
      ${this.renderTopMenu(i?e:void 0)}
      ${i?o`<button class="primary save ${s?"dirty":""}" ?disabled=${!s||this.saving}
          title=${s?`Save (${I}S). A save reaches the ${P(this.device)} the next time it checks.`:`Nothing to save (${I}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?l:o`<span class="tb-saved" title=${s?"Unsaved changes":""}>${B(this.record,void 0,this.device)}</span>
        ${Jt(Gt({newWatch:this.newWatch,dirty:s,saving:this.saving}))}`}`:l}
      ${this.barActions}
    </div>`}renderLibraryBar(e,t){let i=e!==void 0,s=i&&this.dirty;return o`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Status page in the library">
      ${this.haMenu?o`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${b("menu")}</button>`:l}
      <button class="tb-btn tb-back" title="Back to the Status pages tab" @click=${()=>this.onBack?.()}>${b("left")}<span>Status pages</span></button>
      ${ui()}
      ${this.renderBarDevices(e)}
      <span class="spacer"></span>
      ${this.renderTopMenu(i?e:void 0)}
      ${i?o`<button class="primary save ${s?"dirty":""}" ?disabled=${!s||this.saving}
          title=${s?`Save (${I}S). A save reaches every device that has this status page.`:`Nothing to save (${I}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>`:l}
      ${this.barActions}
    </div>`}renderSyncPill(e){let t=this.record;if(t===void 0||t.revision<=0||this.unsupported)return l;let i=e===void 0?{size:0,limit:1}:j(e.document),s=U({record:t,size:i.size,limit:i.limit,noun:"status pages",historyState:this.historyState,device:this.device});return o`<span class="tb-sync ${s.tone==="ok"?"ok":"warn"}" title=${`${s.state}. ${s.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${s.state}</span>
    </span>`}noRecordState(e=this.watches){return Pe(e.find(t=>t.owner_watch_id===this.watchId))}opensReady(e=this.watches){return Zt(this.noRecordState(e),"status_pages",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let t=this.canStartFresh();if(e===void 0&&!t)return l;let i=this.topMenuOpen,s=n=>()=>{this.topMenuOpen=!1,n()};return o`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${i?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!i}}>···</button>
      ${i?o`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?o`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${s(()=>this.discard())}>Discard edits</button>`:l}
        ${t?o`<button class="row" role="menuitem"
          @click=${s(()=>this.startFresh())}>${M}</button>`:l}
      </div>`:l}
    </span>`}colorOf(e){return je(We(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return l;let t=e.find(n=>n.owner_watch_id===this.watchId),i=this.watchMenuOpen,s=n=>{let r=n===void 0?void 0:this.colorOf(n);return o`<span class="pe-chip-glyph" style=${r?`--pe-person: ${r}`:l} aria-hidden="true">${b("watch")}</span>`};return o`<span class="picker sp-watch-picker">
      <button type="button" class="tb-browse sp-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose status pages are shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${s(t?.owner_watch_id)}<span class="tb-browse-l">${t?_(t,e):"Choose a watch"}</span>
        <span class="sp-caret" aria-hidden="true">${b("chevron")}</span>
      </button>
      ${i?o`<div class="pop-menu sp-watch-menu" role="menu" aria-label="Watches">
        ${e.map(n=>{let r=n.owner_watch_id===this.watchId;return o`<button type="button" class="row sp-watch-row" role="menuitemradio" aria-checked=${r?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,r||this.openWatch(n.owner_watch_id)}}>
            ${s(n.owner_watch_id)}<span class="sp-watch-name">${_(n,e)}</span>
            <span class="sp-watch-check" aria-hidden="true">${r?b("check"):l}</span>
          </button>`})}
      </div>`:l}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=wi?this.columns:Ne(this.hostWidth-Di,this.columns,ne)}renderGutter(e){return o`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the pages and rows column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${t=>{let i=this.fittedColumns();Fe(t,{side:e,base:e==="left"?i.left:i.right,limits:ne,onWidth:s=>{this.columns={...this.columns,[e]:s}},onEnd:()=>N(ae,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:re[e]},N(ae,this.columns)}}></div>`}get stageScale(){return this.zoom??K(this.narrow||this.stacked)}setZoom(e){this.zoom=e,bt(e)}renderStage(e,t){let i=t.find(x=>x.owner_watch_id===this.watchId),n=F(i?.screen_size)??z,r=e.phone!==void 0,c=e.phone===void 0?n.label:e.phone.model.label,v=[...It(e),c],f=x=>nt(r?x*X:x),m=yt(e),k=m===void 0?"Status pages":ht(m)||"Untitled page",R=this.draft,w=this.stageScale,Si=K(this.narrow||this.stacked);return o`<div class="card canvas-card lit sp-canvas" aria-label="Status page">
      <div class="cv-head">
        <span class="cv-title" title=${k}>${k}</span>
        ${i!==void 0?o`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${_(i,t)}</span></span>`:l}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${v.join(" \xB7 ")}><span class="fam">${v.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!R?.canUndo} title=${`Undo (${I}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${b("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!R?.canRedo} title=${xi?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${b("redo")}</button>
        </span>
      </div>
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          ${this.libraryItem===void 0?l:o`${pi(t,this.watchId,x=>{this.watchId=x})}<span class="tb-sep" aria-hidden="true"></span>`}
          <button class="tb sp-case" aria-disabled="true" tabindex="-1" title=${r?vt:`This watch's screen, ${n.label}.`}>
            ${b(r?"phone":"watch")}<span class="word keep">${c}</span></button>
          <span class="tb-sep" aria-hidden="true"></span>
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${w<=W(w)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(W(w))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${f(w)}. Back to fit`}
              title=${`The ${r?"iPhone":"watch"} at ${f(w)} of its own points. Click to fit it again (${f(Si)}).`}
              @click=${()=>this.setZoom(void 0)}>${f(w)}</button>
            <button class="tb icon" ?disabled=${w>=q(w)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(q(w))}>+</button>
          </span>
        </div>
        <div class="sp-stage-body">${Tt(e)}</div>
        <div class="under"><span class="tail">${wt}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0&&this.libraryItem===void 0){let v=this.owners.length===0&&this.ownList===void 0;return o`<div class="pe-empty">${v?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return o`<div class="pe-empty"><b>${V}</b></div>`;if(this.loading)return o`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let v=this.recordKey;return o`<div class="pe-empty">
        <span>${this.libraryItem!==void 0?"Could not read this status page":`Could not read this ${P(this.device)}'s status pages`}: ${this.loadError}</span>
        ${v===void 0?l:o`<button class="pe-btn" @click=${()=>{this.load(v)}}>Try again</button>`}
      </div>`}let t=this.record;if(t===void 0)return o`<div class="pe-empty">Loading…</div>`;let i=this.draft;if(i===void 0&&t.revision>0)return o`<div class="pe-empty"><b>${V}</b></div>`;if(i===void 0){let v=this.watchId===void 0?void 0:y(this.watchId),f=this.watchId;return o`<div class="pe-empty"><b>${Re("status pages",this.device)}</b><span>${_e}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${M}</button>
        ${v?.dirty&&f!==void 0?o`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when status pages are here again.</span>
          <button class="pe-btn" @click=${()=>{T(f),this.requestUpdate()}}>Discard the kept edits</button>`:l}
      </div>`}let s=this.viewHost();if(s===void 0)return o`<div class="pe-empty">Loading…</div>`;let n=this.fittedColumns(),r=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",c=t.revision<=0;return o`${c&&this.barHost===void 0?Yt(this.device):l}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${n.left}px;--wa-right:${n.right}px;${r}`}>
      <div class="column left">
        ${St(s)}
        ${$t(s)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(s,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Rt(s)}
      </div>
    </div>
    ${c||this.libraryItem!==void 0?l:this.renderFoot(t,i.document,i.dirty)}`}renderFoot(e,t,i){let s=j(t),n=U({record:e,size:s.size,limit:s.limit,noun:"status pages",historyState:this.historyState,device:this.device}),r=this.watchId;return o`${Ge({status:n,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Ve({noun:"status pages",device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:i,restoring:this.restoring,onRetry:()=>{r!==void 0&&(this.historyState="loading",this.loadHistory(r))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):l}
    ${this.rawOpen?Ye({noun:"status pages",document:t,revision:e.revision,dirty:i,copied:this.rawCopied,onCopy:c=>{Xe(c).then(v=>{this.rawCopied=v})},onClosed:()=>{this.rawOpen=!1}}):l}`}renderRestoreAsk(e){let t=this.record,i=_i(e.entry.updated_at);return o`<dialog class="pe-ask" aria-labelledby="sp-ask-title"
      @cancel=${s=>{this.restoring&&s.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="sp-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${Ie(e.entry.updated_by,this.device)}${i?` ${i}`:""}, ${Pi(e.entry.size)}.</p>
      ${e.summary?o`<p class="pe-muted">${e.summary}</p>`:l}
      <p>It is saved again as a new revision${t?`, after revision ${t.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      ${e.others===void 0?l:o`<p class="sp-restore-others">${e.others}</p>`}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[$e,ge,be,we,ye,ke,xe,Se,rt,mt,Xt,de`
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
  `,Dt,Ot,gi,Wt,Qe,vi,Ae]}};h([g({attribute:!1})],d.prototype,"hass",2),h([g({attribute:!1})],d.prototype,"owners",2),h([g({attribute:!1})],d.prototype,"ownerId",2),h([g({type:Boolean,reflect:!0})],d.prototype,"narrow",2),h([g({attribute:!1})],d.prototype,"icons",2),h([g({attribute:!1})],d.prototype,"iconsTick",2),h([g({attribute:!1})],d.prototype,"haMenu",2),h([g({attribute:!1})],d.prototype,"onHaMenu",2),h([g({attribute:!1})],d.prototype,"onBack",2),h([g({attribute:!1})],d.prototype,"barActions",2),h([g({attribute:!1})],d.prototype,"shellOwnsWatch",2),h([g({attribute:!1})],d.prototype,"phones",2),h([g({attribute:!1})],d.prototype,"barHost",2),h([g({attribute:!1})],d.prototype,"libraryItem",2),h([u()],d.prototype,"watchId",2),h([u()],d.prototype,"record",2),h([u()],d.prototype,"unsupported",2),h([u()],d.prototype,"loading",2),h([u()],d.prototype,"loadError",2),h([u()],d.prototype,"history",2),h([u()],d.prototype,"historyState",2),h([u()],d.prototype,"note",2),h([u()],d.prototype,"restoreAsk",2),h([u()],d.prototype,"restoring",2),h([u()],d.prototype,"historyOpen",2),h([u()],d.prototype,"rawOpen",2),h([u()],d.prototype,"rawCopied",2),h([u()],d.prototype,"ownList",2),h([u()],d.prototype,"deleteAsk",2),h([u()],d.prototype,"deletingAll",2),h([u()],d.prototype,"topMenuOpen",2),h([u()],d.prototype,"watchMenuOpen",2),h([u()],d.prototype,"zoom",2),h([u()],d.prototype,"columns",2),h([u()],d.prototype,"hostWidth",2),h([u()],d.prototype,"hostHeight",2);customElements.get("wa-status-pages-editor")||customElements.define("wa-status-pages-editor",d);export{ae as SP_COLUMNS_KEY,d as WaStatusPagesEditor};
