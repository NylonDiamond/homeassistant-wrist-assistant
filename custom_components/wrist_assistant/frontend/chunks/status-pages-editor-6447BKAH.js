import{a as ti,b as y,c as ee,d as te,e as I,f as ie,g as ii,i as si,k as ni}from"./chunk-FHBM2DA3.js";import{a as jt,b as Zt}from"./chunk-H2NDFNUO.js";import{b as Et,c as Mt,d as Nt,e as Kt,f as zt,g as Ft,i as Ut,j as Bt}from"./chunk-UYUBLA6R.js";import{a as Ct,e as Lt,g as qt,i as Wt}from"./chunk-4SIAJEWW.js";import{a as bt,b as yt,c as kt,d as St,e as Q,f as xt,g as $t,h as Tt,i as It,j as Rt,l as Dt,m as Pt,n as _t,r as mi,t as gi}from"./chunk-ZZAFVIAS.js";import{Aa as Ht,B as H,Ba as se,Ca as ne,Da as di,Ea as hi,Fa as li,Ga as ci,H as V,Ha as pi,Ja as re,Ka as ui,La as fi,Ma as ae,Na as vi,da as ut,e as ht,ea as Y,fa as ft,ga as $,ja as E,ma as J,s as A,t as Z,u as x,v as T,w as pt,x as G,ya as Ot,za as At}from"./chunk-TK6EMFFT.js";import"./chunk-AYDHV5MH.js";import"./chunk-NHJML2E3.js";import{Xd as oi,a as vt,b as mt,c as gt,e as X,h as wt}from"./chunk-GAZBOTEC.js";import{a as lt,b as ct}from"./chunk-TE5Q2R5V.js";import{p as q,q as ot,r as W,s as j}from"./chunk-PEI2F5V4.js";import{b as Fe,d as Ue,e as K,f as Be}from"./chunk-ZOJGMATP.js";import{a as Gt,b as Vt,c as Yt,d as Jt,e as Xt,f as Qt,g as ei}from"./chunk-F32PSVAR.js";import"./chunk-FR3OKHYP.js";import"./chunk-TWGLBOZ3.js";import{a as U,b as B,c as Ye,d as Je,e as Xe,f as Qe,g as et,h as tt,i as it}from"./chunk-CWTJRXV4.js";import{d as at}from"./chunk-AMGXZUWS.js";import{a as Ge,b as Ve,e as dt}from"./chunk-ZHPGRUAI.js";import{c as st,d as nt,f as rt}from"./chunk-GR4P77YP.js";import{c as be}from"./chunk-ZKYND2IQ.js";import{Gd as ri,Id as ai,Qb as je,Rb as Ze,X as z,aa as F,cb as We,ua as qe}from"./chunk-36K6KTYI.js";import"./chunk-ESIOP3D4.js";import{a as Ee,b as Me,c as Ne}from"./chunk-X2QLAQLV.js";import{Eg as P,Gg as fe,Ih as Re,Jg as ve,Kg as me,Lg as ge,Mg as we,b as ce,d as o,g as l,ig as ue,j as pe,k as g,l as u,nh as w,rh as ye,th as ke,uh as Se,vh as xe,wh as $e,xh as Te,yh as Ie}from"./chunk-E5S2SHQS.js";import{B as De,E as Pe,M as _e,N as _,R as Ce,Sa as He,U as C,Ua as Ke,Va as L,Wa as ze,X as Le,Xa as O,Y as Oe,Z as N,_ as Ae}from"./chunk-PPFKQRTD.js";import{a as h}from"./chunk-LO2NM3CE.js";function $i(r){return r.name.trim()===""?"a status page":`"${r.name}"`}function M(r){if(r.length===0)return"";let p=r.map($i);return`Another save also changed ${p.length===1?p[0]:`${p.slice(0,-1).join(", ")} and ${p[p.length-1]}`}. ${p.length===1?"That save's version was kept.":"That save's versions were kept."}`}function wi(r){return r.ok?O(Ti(r),r.linkFailures,"status pages"):Ii(r)}function Ti(r){let p=r.kept??[];if(r.alreadySaved===!0){let e=p.length>0?` ${M(p)}`:"";return{kind:p.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${r.revision}.${e}`}}return p.length>0?{kind:"warn",text:`Saved. ${M(p)}`}:r.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}function Ii(r){let p=(r.message??"").trim();switch(r.code){case"conflict":return{kind:"warn",text:"Not saved. The status pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds status pages for this watch. Your edits are kept, so save again."};case"invalid":{let e=r.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the status pages is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the status pages${p===""?".":`: ${p}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Ke}`};case"busy":return{kind:"warn",text:"Already saving these status pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${p===""?".":`: ${p}`}`}}}ai({dirty:ie,drop:ii});typeof window<"u"&&window.addEventListener("beforeunload",r=>{ie()&&(r.preventDefault(),r.returnValue="")});var Ri=15e3,Si=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),R=Si?"\u2318":"Ctrl+",oe={min:200,max:720,middleMin:320},de={left:280,right:340},he="wrist-assistant-panel.status-pages.columns.v1",Di=24,bi=820;function yi(r){return L(r).message}function le(r){return L(r).code}function ki(r){let{code:p,message:e}=L(r);return Object.assign(new Error(e),p===void 0?{}:{code:p})}function Pi(r){return r<1e3?`${r} bytes`:`${Number((r/1e3).toFixed(1))} KB`}function _i(r){let p=r?Date.parse(r):NaN;return Number.isNaN(p)?"":be(Math.max(0,(Date.now()-p)/1e3))}function Ci(r){return r instanceof HTMLElement?nt(r.tagName,r instanceof HTMLInputElement?r.type:void 0,r.isContentEditable):!1}function Li(){let r=document.activeElement;for(;r?.shadowRoot?.activeElement;)r=r.shadowRoot.activeElement;return r===null||r===document.body||r===document.documentElement}var d=class extends pe{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=l;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.libraryItem=void 0;this.headBar=new Ee(this);this.unsupported=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.lib=new Ot(this,()=>this.hass,()=>this.linkDevices.map(e=>e.ownerId));this.deletingAll=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=bt();this.columns={...de};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Ye(this);this.symbols=new qe(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.subscribeSeq=0;this.previewKind="watch";this.onReconnect=()=>{let e=this.recordKey;!this.isConnected||e===void 0||this.load(e,!0)};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let t=e.composedPath();if(!t.includes(this)&&!this.headBar.holds(t)&&!Li()||this.renderRoot.querySelector("dialog[open]"))return;let i=e.metaKey||e.ctrlKey,s=e.key.toLowerCase();if(i&&!e.altKey&&s==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(!Ci(t[0])){if(i&&!e.altKey&&s==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&s==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!i&&!e.altKey){let n=this.viewHost();n!==void 0&&xt(n)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let t=e.composedPath(),i=s=>t.some(n=>n instanceof HTMLElement&&n.classList.contains(s));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("sp-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(je,this.onScrubStart),this.addEventListener(Ze,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return Ce(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return this.libraryItem!==void 0?this.previewKind:oi(this.watches,this.watchId)?"iphone":"watch"}get draft(){let e=this.recordKey,t=this.record;if(!(e===void 0||t===void 0)){if(t.revision>0){let i=y(e);if(i!==void 0)return i;let s=A(t.document);return s===void 0?void 0:ee(e,s,t.revision).draft}if(!(this.libraryItem!==void 0||this.unsupported||!this.opensReady()))return y(e)??te(e)}}get recordKey(){return this.libraryItem===void 0?this.watchId:se(this.libraryItem)}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Ue(he,de,oe),this.watchSize(),this.listenForReconnect(),this.openedItem!==void 0?this.openItem(!0):this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++}willUpdate(e){if(this.hass)if(e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,ue(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]})),this.libraryItem!==void 0)this.followLibraryItem(this.libraryItem);else{this.openedItem!==void 0&&(this.openedItem=void 0,this.watchId=void 0);let i=He(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));i!==void 0&&this.openWatch(i)}this.followSave();let t=this.restoreAsk;t!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===t.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),et(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let t of e){if(t.target!==this){this.measureTop(t.target);continue}let i=t.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width),Math.abs(i.height-this.hostHeight)>=1&&(this.hostHeight=i.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let t=this.renderRoot?.querySelector(".pe-top")??void 0;t!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=t,t!==void 0&&e.observe(t))}measureTop(e){let t=e.offsetHeight;t!==this.topHeight&&(this.topHeight=t,this.style.setProperty("--pe-top-h",`${t}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followLibraryItem(e){ne(e,this.openedItem)||(this.previewKind=pi());let t=re(this.watches,this.previewKind);if(t!==this.watchId&&(this.watchId=t),!ne(e,this.openedItem)){this.openedItem=e,this.openItem();return}let i=li(this.lib.library,e),s=this.record?.revision;i!==void 0&&s!==void 0&&i>s&&i!==this.followedRevision&&(this.followedRevision=i,this.load(se(e),!0))}openItem(e=!1){let t=this.recordKey;t!==void 0&&(e||(this.reloadPending=!1,this.restartDraft=void 0,this.note=void 0,this.unsupported=!1,this.history=[],this.closeAsk(),this.endScrub(),this.uiState.clear(),this.deleteAsk=void 0,this.followedRevision=void 0),this.endSubscription(),this.stopPolling(),this.load(t,e))}followSave(){let e=this.recordKey;if(e===void 0)return;let t=y(e)?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let i=()=>this.saveEnded(e);t.then(i,i)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.recordKey?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,t=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),this.deleteAsk=void 0,t=!1);let i=si(e);i!==void 0&&Q({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},i),this.startSubscription(e),this.load(e,t)}async load(e,t=!1){let i=this.hass;if(!i)return;if(t&&this.holdReload){this.reloadPending=!0;return}let s=++this.loadSeq;this.stopPolling(),t||(this.record=void 0,this.loading=!0,this.loadError=void 0);let n=this.libraryItem;try{let a=n!==void 0?await di(i,n):await P(i,e,"status_pages");if(s!==this.loadSeq)return;if(t&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(a),this.loadError=void 0,!t&&n===void 0&&ni(e)&&this.updateComplete.then(()=>{if(this.watchId!==e)return;let c=this.viewHost();c!==void 0&&$t(c)})}catch(a){if(s!==this.loadSeq)return;n!==void 0?t||(this.loadError=ht(a)):ft(a)?(this.unsupported=!0,this.loadError=void 0):t||(this.loadError=yi(a)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!(this.unsupported||n!==void 0)&&(this.pollIfWaiting(),this.loadHistory(e))}get linkDevices(){return lt(this.owners.length>0?this.owners:this.ownList??[],this.phones)}flushPending(){let e=this.recordKey;!this.reloadPending||this.holdReload||e===void 0||(this.reloadPending=!1,this.load(e,!0))}show(e){let t=this.recordKey;this.record=e,t!==void 0&&e.revision<=0&&te(t);let i=e.revision>0?A(e.document):void 0;if(t===void 0||i===void 0)return;let s=this.restartDraft;s!==void 0&&s.watchId===t&&e.revision>=s.revision&&(this.restartDraft=void 0,(y(t)?.dirty??!1)||I(t));let n=ee(t,i,e.revision);n.kept.length>0?this.note={kind:"warn",text:M(n.kept)}:n.mergedIntoEdits&&(this.note={kind:"warn",text:"The status pages changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let t=this.hass;if(!t||this.historyState==="unsupported")return;let i=++this.historySeq;try{let s=await ve(t,e,"status_pages");if(i!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(s?.entries)?s.entries:[],this.historyState="ready"}catch(s){if(i!==this.historySeq||e!==this.watchId)return;this.historyState=le(s)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let t=this.hass;if(this.endSubscription(),!t)return;let i=++this.subscribeSeq;we(t,e,s=>{i===this.subscribeSeq&&s.kind==="status_pages"&&s.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(s=>{i===this.subscribeSeq?this.unsubscribe=s:s().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||De(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Ri))}async poll(){this.pollTimer=void 0;let e=this.hass,t=this.watchId,i=this.record;if(!(!e||t===void 0||i===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let s=await P(e,t,"status_pages");if(t!==this.watchId||this.record!==i)return;s.revision===i.revision?this.record={...i,delivered_revision:s.delivered_revision,delivered_at:s.delivered_at,rejected_revision:s.rejected_revision,rejected_at:s.rejected_at,rejected_reason:s.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(s),this.loadHistory(t))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,t){let i=this.draft;if(!i||this.saving)return!1;let s=i.apply(e(i.document),this.scrubKey??t);return this.requestUpdate(),s}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??st,t=this.iconMemo;if(t!==void 0&&t.provider===e&&t.tick===this.iconsTick)return t.icons;let i=rt(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:i},i}screen(){let e=this.phoneLayout();if(e!==void 0)return gt(e);let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return(F(t?.screen_size)??z).screen}phoneLayout(){if(this.device!=="iphone")return;let e=this.watches.find(t=>t.owner_watch_id===this.watchId);return mt(vt(e?.screen_size))}viewHost(){let e=this.draft,t=this.hass;if(e===void 0||t===void 0)return;let i=this;return{hass:t,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*X,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},get document(){return e.document},get busy(){return i.saving},...this.libraryHost(e),edit:(s,n)=>this.draft===e&&this.edit(s,n),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}libraryHost(e){let t=this.lib.library;if(this.libraryItem!==void 0)return{single:!0,deletePage:c=>this.askDelete(c)};let i=this.watchId;if(t===void 0||i===void 0)return{};let s=this.linkDevices,n=Ut(t,i,x(e.document).map(T),s),a=this.renderElsewhere();return{linkBadge:c=>Et(t,"status_pages",T(c),i,s),...n===void 0?{}:{sharedLine:n},...s.length>1?{ticks:c=>this.renderStatusTicks(c)}:{},deletePage:c=>this.askDelete(c),...a===l?{}:{elsewhere:a}}}deviceName(e){return this.linkDevices.find(t=>$(t.ownerId,e))?.name??"the other device"}get hereDevice(){let e=this.watchId;if(e!==void 0)return this.linkDevices.find(t=>$(t.ownerId,e))??{ownerId:e,name:`This ${ct(this.device)}`,kind:this.device}}statusTickLocked(e,t){if(this.libraryItem===void 0){let n=this.watchId;if(n===void 0)return;if($(t,n))return Mt("status_pages",this.device)}let i=this.lib.library;if(i!==void 0&&J(i,"status_pages",e).some(n=>$(n,t))&&(y(t)?.dirty??!1))return Nt(this.deviceName(t))}renderStatusTicks(e){let t=this.lib.library,i=t===void 0?0:E(t,"status_pages",T(e))?.owners.length??0;return o`<div class="sp-lib">${ae("status_pages",i,this.statusTicksBody(e),"card")}</div>`}statusTicksBody(e){let t=this.lib.library,i=this.lib.store,s=this.watchId,n=t===void 0?void 0:E(t,"status_pages",T(e)),a=this.libraryItem!==void 0||s!==void 0&&n?.owners.some(f=>$(f,s))===!0;if(t===void 0||i===void 0||n===void 0||!a)return o`<p class="sp-lib-hint">${Kt("status_pages")}</p>`;let c=i.noteFor("status_pages",n.id),v=this.hass?.user?.is_admin;return At({library:t,kind:"status_pages",itemId:n.id,devices:this.linkDevices,colorOf:f=>this.colorOf(f),pending:i.pending,...c===void 0?{}:{note:c},...v===void 0?{}:{admin:v},locked:f=>this.statusTickLocked(n.id,f)},(f,m)=>{Wt(this.hass,i,f,"status_pages",n.id,m)})}renderBarDevices(e){let t=this.lib.library,i=this.libraryItem,s=e===void 0?void 0:x(e.document)[0];return t===void 0||i===void 0||s===void 0?l:ae("status_pages",E(t,"status_pages",i.id)?.owners.length??0,this.statusTicksBody(s))}renderElsewhere(){let e=this.lib.library,t=this.lib.store,i=this.hereDevice;if(e===void 0||t===void 0||i===void 0)return l;let s=this.hass?.user?.is_admin,n=this.memoIcons();return jt({library:e,kind:"status_pages",here:i,rows:Bt(e,i.ownerId,"status_pages",this.linkDevices),colorOf:a=>this.colorOf(a),pending:t.pending,noteFor:a=>t.noteFor("status_pages",a),...s===void 0?{}:{admin:s},...this.saving?{locked:"Saving. Try again once the save is done."}:{},picture:a=>mi({page:a.item,hass:this.hass,icons:n,tick:this.iconsTick}),onAdd:a=>{this.addHere(a)}})}async addHere(e){let t=this.lib.store,i=this.watchId;t===void 0||i===void 0||this.saving||!(await t.pick(i,"status_pages",e,!0)).ok||i!==this.watchId||(await this.load(i,!0),i===this.watchId&&H(this.draft?.document,e)!==void 0&&Q({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},e))}deleteChoices(e){let t=this.watchId;if(t!==void 0)return zt(this.lib.library,"status_pages",e,t,this.device,this.linkDevices)}askDelete(e){if(!(H(this.draft?.document,e)===void 0||this.saving)){if(this.libraryItem!==void 0){this.deleteAsk={pageId:e};return}if(this.watchId!==void 0){if(this.deleteChoices(e)===void 0){this.edit(i=>V(i,e));return}this.deleteAsk={pageId:e}}}}closeDelete(){this.renderRoot?.querySelector("dialog.sp-del-ask")?.close(),this.deleteAsk=void 0}deleteHere(){let e=this.deleteAsk;this.closeDelete(),e!==void 0&&this.edit(t=>V(t,e.pageId))}async deleteFromLibrary(){let e=this.deleteAsk,t=this.lib.store,i=this.recordKey;if(!e||t===void 0||i===void 0||this.deletingAll)return;this.deletingAll=!0;let s=await t.deleteItem("status_pages",e.pageId);if(this.deletingAll=!1,i!==this.recordKey)return;if(this.libraryItem!==void 0){if(this.closeDelete(),!s.ok){this.note={kind:"err",text:`Not deleted. ${s.text}`};return}I(i),this.onBack?.();return}if(!s.ok){this.closeDelete(),this.note={kind:"err",text:`Not deleted. ${s.text}`};return}this.dirty?this.deleteHere():(this.closeDelete(),this.load(i,!0));let n=s.reply.link_failures??[];this.note=n.length>0?{kind:"warn",text:`Deleted from the library. Could not update ${n.map(a=>a.name).join(", ")}.`}:{kind:"ok",text:"Deleted from the library and from every device."}}renderDeleteAsk(e){let t=H(this.draft?.document,e.pageId),i=this.deletingAll;if(t!==void 0&&this.libraryItem!==void 0){let n=this.lib.library===void 0?[]:J(this.lib.library,"status_pages",e.pageId);return o`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
        @cancel=${a=>{i&&a.preventDefault()}}
        @close=${()=>{this.deletingAll||(this.deleteAsk=void 0)}}>
        <h3 id="sp-del-title">Delete "${G(t)}" from the library?</h3>
        <p>${ci(n.length)}</p>
        <div class="pe-ask-foot sp-del-foot">
          <button class="pe-btn" ?disabled=${i} @click=${()=>this.closeDelete()}>Cancel</button>
          <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${i||this.saving}
            @click=${()=>{this.deleteFromLibrary()}}>${i?"Deleting\u2026":"Delete from the library"}</button>
        </div>
      </dialog>`}let s=this.deleteChoices(e.pageId);return t===void 0||s===void 0?l:o`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
      @cancel=${n=>{i&&n.preventDefault()}}
      @close=${()=>{this.deletingAll||(this.deleteAsk=void 0)}}>
      <h3 id="sp-del-title">Delete "${G(t)}"?</h3>
      <p>${s.body} You can undo a remove here until you leave this page.</p>
      <div class="pe-ask-foot sp-del-foot">
        <button class="pe-btn" ?disabled=${i} @click=${()=>this.closeDelete()}>Cancel</button>
        <button class="pe-btn pe-danger sp-del-here" ?disabled=${i} @click=${()=>this.deleteHere()}>${s.remove}</button>
        <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${i||this.saving}
          @click=${()=>{this.deleteFromLibrary()}}>${i?"Deleting\u2026":s.library}</button>
      </div>
    </dialog>`}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,t=this.recordKey,i=this.libraryItem;this.endScrub();let s=this.draft;if(!e||t===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let n=s.revision<=0,a=Lt(x(s.base),x(s.document)),c=Ct(this.lib.library,t,"status_pages"),v=ti(s,i!==void 0?hi(e,this.lib.store,i):{save:(m,S)=>fe(e,t,"status_pages",m,S).catch(D=>{throw ki(D)}),fetch:async()=>{let m=await P(e,t,"status_pages").catch(S=>{throw ki(S)});return{revision:m.revision,document:m.document}}});this.followedSave=s.saveDone,this.requestUpdate();let f=await v.catch(m=>({ok:!1,revision:s.revision,merged:!1,code:le(m)??"unknown",message:yi(m)}));if(this.saveEnded(t),t===this.recordKey&&(this.note=Jt(n,f.code,wi(f))),f.ok&&a.length>0){let m=await qt(e,t,a,c);m!==void 0&&t===this.recordKey&&this.note===void 0&&(this.note=m)}}startFresh(){let e=this.watchId;e===void 0||!Ae(this.noRecordState())||(Gt("status_pages",e),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let t=this.hass,i=this.watchId,s=this.record;if(!t||i===void 0||s===void 0||this.draft?.dirty)return;let n={entry:e,baseRevision:s.revision};this.restoreAsk=n,me(t,i,"status_pages",e.revision).then(a=>{if(this.restoreAsk!==n)return;let c=Ft(this.lib.library,"status_pages",i,x(A(a.document)),this.linkDevices);this.restoreAsk={...n,summary:ut(a.document),...c===void 0?{}:{others:c}}},()=>{})}async restore(){let e=this.hass,t=this.watchId,i=this.restoreAsk;if(!e||t===void 0||i===void 0||this.restoring)return;this.restoring=!0;let s;try{let n=await ge(e,t,"status_pages",i.entry.revision,i.baseRevision);s=O({kind:"ok",text:at(i.entry.updated_at)},ze(n),"status pages"),t===this.watchId?this.restartDraft={watchId:t,revision:n.revision}:(y(t)?.dirty??!1)||I(t)}catch(n){let a=le(n);a==="conflict"?s={kind:"warn",text:"Not restored. The status pages changed somewhere else, so the newest copy is shown."}:a==="no_record"?s={kind:"warn",text:`Not restored. Home Assistant no longer holds status pages for this ${_(this.device)}.`}:a==="not_found"?s={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",s={kind:"warn",text:"This version of the integration cannot restore status pages. Update it to restore an earlier save."}):s={kind:"err",text:`Could not restore: ${We(n)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}t===this.watchId&&(this.note=s,this.load(t,!0))}render(){let e=this.watches,t=this.draft;return o`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(t,e):l}
        ${this.note?o`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:l}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):l}
      ${this.deleteAsk&&!this.restoreAsk?this.renderDeleteAsk(this.deleteAsk):l}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=bi}renderTopBar(e,t){if(this.libraryItem!==void 0)return this.renderLibraryBar(e,t);let i=e!==void 0&&!this.unsupported,s=i&&this.dirty;return o`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch status pages">
      ${this.haMenu?o`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${w("menu")}</button>`:l}
      ${this.shellOwnsWatch?l:o`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():ri(void 0,!1)}>${w("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?l:this.renderWatchPicker(t)}
      ${this.barHost!==void 0&&i?Me({newWatch:this.newWatch,dirty:s,saved:B(this.record,void 0,this.device),device:this.device}):l}
      ${this.renderSyncPill(i?e:void 0)}
      ${this.renderTopMenu(i?e:void 0)}
      ${i?o`<button class="primary save ${s?"dirty":""}" ?disabled=${!s||this.saving}
          title=${s?`Save (${R}S). A save reaches the ${_(this.device)} the next time it checks.`:`Nothing to save (${R}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?l:o`<span class="tb-saved" title=${s?"Unsaved changes":""}>${B(this.record,void 0,this.device)}</span>
        ${Qt(Yt({newWatch:this.newWatch,dirty:s,saving:this.saving}))}`}`:l}
      ${this.barActions}
    </div>`}renderLibraryBar(e,t){let i=e!==void 0,s=i&&this.dirty;return o`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Status page in the library">
      ${this.haMenu?o`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${w("menu")}</button>`:l}
      <button class="tb-btn tb-back" title="Back to the Status pages tab" @click=${()=>this.onBack?.()}>${w("left")}<span>Status pages</span></button>
      ${fi()}
      ${this.renderBarDevices(e)}
      <span class="spacer"></span>
      ${this.renderTopMenu(i?e:void 0)}
      ${i?o`<button class="primary save ${s?"dirty":""}" ?disabled=${!s||this.saving}
          title=${s?`Save (${R}S). A save reaches every device that has this status page.`:`Nothing to save (${R}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>`:l}
      ${this.barActions}
    </div>`}renderSyncPill(e){let t=this.record;if(t===void 0||t.revision<=0||this.unsupported)return l;let i=e===void 0?{size:0,limit:1}:Z(e.document),s=U({record:t,size:i.size,limit:i.limit,noun:"status pages",historyState:this.historyState,device:this.device});return o`<span class="tb-sync ${s.tone==="ok"?"ok":"warn"}" title=${`${s.state}. ${s.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${s.state}</span>
    </span>`}noRecordState(e=this.watches){return Le(e.find(t=>t.owner_watch_id===this.watchId))}opensReady(e=this.watches){return Vt(this.noRecordState(e),"status_pages",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let t=this.canStartFresh();if(e===void 0&&!t)return l;let i=this.topMenuOpen,s=n=>()=>{this.topMenuOpen=!1,n()};return o`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${i?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!i}}>···</button>
      ${i?o`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?o`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${s(()=>this.discard())}>Discard edits</button>`:l}
        ${t?o`<button class="row" role="menuitem"
          @click=${s(()=>this.startFresh())}>${N}</button>`:l}
      </div>`:l}
    </span>`}colorOf(e){return Ve(Ge(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return l;let t=e.find(n=>n.owner_watch_id===this.watchId),i=this.watchMenuOpen,s=n=>{let a=n===void 0?void 0:this.colorOf(n);return o`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:l} aria-hidden="true">${w("watch")}</span>`};return o`<span class="picker sp-watch-picker">
      <button type="button" class="tb-browse sp-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose status pages are shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${s(t?.owner_watch_id)}<span class="tb-browse-l">${t?C(t,e):"Choose a watch"}</span>
        <span class="sp-caret" aria-hidden="true">${w("chevron")}</span>
      </button>
      ${i?o`<div class="pop-menu sp-watch-menu" role="menu" aria-label="Watches">
        ${e.map(n=>{let a=n.owner_watch_id===this.watchId;return o`<button type="button" class="row sp-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(n.owner_watch_id)}}>
            ${s(n.owner_watch_id)}<span class="sp-watch-name">${C(n,e)}</span>
            <span class="sp-watch-check" aria-hidden="true">${a?w("check"):l}</span>
          </button>`})}
      </div>`:l}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=bi?this.columns:Fe(this.hostWidth-Di,this.columns,oe)}renderGutter(e){return o`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the pages and rows column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${t=>{let i=this.fittedColumns();Be(t,{side:e,base:e==="left"?i.left:i.right,limits:oe,onWidth:s=>{this.columns={...this.columns,[e]:s}},onEnd:()=>K(he,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:de[e]},K(he,this.columns)}}></div>`}get stageScale(){return this.zoom??q(this.narrow||this.stacked)}setZoom(e){this.zoom=e,yt(e)}renderStage(e,t){let i=t.find(k=>k.owner_watch_id===this.watchId),n=F(i?.screen_size)??z,a=e.phone!==void 0,c=e.phone===void 0?n.label:e.phone.model.label,v=[...Dt(e),c],f=k=>ot(a?k*X:k),m=St(e),S=m===void 0?"Status pages":pt(m)||"Untitled page",D=this.draft,b=this.stageScale,xi=q(this.narrow||this.stacked);return o`<div class="card canvas-card lit sp-canvas" aria-label="Status page">
      <div class="cv-head">
        <span class="cv-title" title=${S}>${S}</span>
        ${i!==void 0?o`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${C(i,t)}</span></span>`:l}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${v.join(" \xB7 ")}><span class="fam">${v.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!D?.canUndo} title=${`Undo (${R}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${w("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!D?.canRedo} title=${Si?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${w("redo")}</button>
        </span>
      </div>
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          ${this.libraryItem===void 0?l:o`${ui(this.previewKind,k=>{this.previewKind=k,this.watchId=re(t,k)})}<span class="tb-sep" aria-hidden="true"></span>`}
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${b<=j(b)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(j(b))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${f(b)}. Back to fit`}
              title=${`The ${a?"iPhone":"watch"} at ${f(b)} of its own points. Click to fit it again (${f(xi)}).`}
              @click=${()=>this.setZoom(void 0)}>${f(b)}</button>
            <button class="tb icon" ?disabled=${b>=W(b)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(W(b))}>+</button>
          </span>
        </div>
        <div class="sp-stage-body">${Rt(e)}</div>
        <div class="under"><span class="tail">${kt}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0&&this.libraryItem===void 0){let v=this.owners.length===0&&this.ownList===void 0;return o`<div class="pe-empty">${v?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return o`<div class="pe-empty"><b>${Y}</b></div>`;if(this.loading)return o`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let v=this.recordKey;return o`<div class="pe-empty">
        <span>${this.libraryItem!==void 0?"Could not read this status page":`Could not read this ${_(this.device)}'s status pages`}: ${this.loadError}</span>
        ${v===void 0?l:o`<button class="pe-btn" @click=${()=>{this.load(v)}}>Try again</button>`}
      </div>`}let t=this.record;if(t===void 0)return o`<div class="pe-empty">Loading…</div>`;let i=this.draft;if(i===void 0&&t.revision>0)return o`<div class="pe-empty"><b>${Y}</b></div>`;if(i===void 0){let v=this.watchId===void 0?void 0:y(this.watchId),f=this.watchId;return o`<div class="pe-empty"><b>${_e("status pages",this.device)}</b><span>${Oe}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${N}</button>
        ${v?.dirty&&f!==void 0?o`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when status pages are here again.</span>
          <button class="pe-btn" @click=${()=>{I(f),this.requestUpdate()}}>Discard the kept edits</button>`:l}
      </div>`}let s=this.viewHost();if(s===void 0)return o`<div class="pe-empty">Loading…</div>`;let n=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",c=t.revision<=0;return o`${c&&this.barHost===void 0?Xt(this.device):l}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${n.left}px;--wa-right:${n.right}px;${a}`}>
      <div class="column left">
        ${Tt(s)}
        ${It(s)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(s,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Pt(s)}
      </div>
    </div>
    ${c||this.libraryItem!==void 0?l:this.renderFoot(t,i.document,i.dirty)}`}renderFoot(e,t,i){let s=Z(t),n=U({record:e,size:s.size,limit:s.limit,noun:"status pages",historyState:this.historyState,device:this.device}),a=this.watchId;return o`${Je({status:n,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Xe({noun:"status pages",device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:i,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):l}
    ${this.rawOpen?Qe({noun:"status pages",document:t,revision:e.revision,dirty:i,copied:this.rawCopied,onCopy:c=>{tt(c).then(v=>{this.rawCopied=v})},onClosed:()=>{this.rawOpen=!1}}):l}`}renderRestoreAsk(e){let t=this.record,i=_i(e.entry.updated_at);return o`<dialog class="pe-ask" aria-labelledby="sp-ask-title"
      @cancel=${s=>{this.restoring&&s.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="sp-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${Pe(e.entry.updated_by,this.device)}${i?` ${i}`:""}, ${Pi(e.entry.size)}.</p>
      ${e.summary?o`<p class="pe-muted">${e.summary}</p>`:l}
      <p>It is saved again as a new revision${t?`, after revision ${t.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      ${e.others===void 0?l:o`<p class="sp-restore-others">${e.others}</p>`}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Re,ye,ke,Se,xe,$e,Te,Ie,dt,wt,ei,ce`
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
  `,_t,Ht,gi,Zt,it,vi,Ne]}};h([g({attribute:!1})],d.prototype,"hass",2),h([g({attribute:!1})],d.prototype,"owners",2),h([g({attribute:!1})],d.prototype,"ownerId",2),h([g({type:Boolean,reflect:!0})],d.prototype,"narrow",2),h([g({attribute:!1})],d.prototype,"icons",2),h([g({attribute:!1})],d.prototype,"iconsTick",2),h([g({attribute:!1})],d.prototype,"haMenu",2),h([g({attribute:!1})],d.prototype,"onHaMenu",2),h([g({attribute:!1})],d.prototype,"onBack",2),h([g({attribute:!1})],d.prototype,"barActions",2),h([g({attribute:!1})],d.prototype,"shellOwnsWatch",2),h([g({attribute:!1})],d.prototype,"phones",2),h([g({attribute:!1})],d.prototype,"barHost",2),h([g({attribute:!1})],d.prototype,"libraryItem",2),h([u()],d.prototype,"watchId",2),h([u()],d.prototype,"record",2),h([u()],d.prototype,"unsupported",2),h([u()],d.prototype,"loading",2),h([u()],d.prototype,"loadError",2),h([u()],d.prototype,"history",2),h([u()],d.prototype,"historyState",2),h([u()],d.prototype,"note",2),h([u()],d.prototype,"restoreAsk",2),h([u()],d.prototype,"restoring",2),h([u()],d.prototype,"historyOpen",2),h([u()],d.prototype,"rawOpen",2),h([u()],d.prototype,"rawCopied",2),h([u()],d.prototype,"ownList",2),h([u()],d.prototype,"deleteAsk",2),h([u()],d.prototype,"deletingAll",2),h([u()],d.prototype,"topMenuOpen",2),h([u()],d.prototype,"watchMenuOpen",2),h([u()],d.prototype,"zoom",2),h([u()],d.prototype,"columns",2),h([u()],d.prototype,"hostWidth",2),h([u()],d.prototype,"hostHeight",2),h([u()],d.prototype,"previewKind",2);customElements.get("wa-status-pages-editor")||customElements.define("wa-status-pages-editor",d);export{he as SP_COLUMNS_KEY,d as WaStatusPagesEditor};
