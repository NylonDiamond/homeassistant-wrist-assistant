import{a as ei,b as y,c as ee,d as te,e as T,f as ie,g as ti,i as ii,k as si}from"./chunk-5B7R3TM5.js";import{a as Wt,b as jt}from"./chunk-3PO6TFCV.js";import{b as Ht,c as Et,d as Mt,e as Nt,f as Kt,g as zt,i as Ft,j as Ut}from"./chunk-KON2BFNX.js";import{a as _t,e as Ct,g as qt,i as Bt}from"./chunk-LYMSLLAI.js";import{c as wt,d as bt,e as yt,f as kt,g as Q,h as St,i as xt,j as $t,k as It,l as Tt,n as Rt,o as Dt,p as Pt,t as mi,v as gi}from"./chunk-5JHYRMYP.js";import{B as H,Ba as At,Ca as se,Da as ne,Ea as ai,Fa as di,Ga as hi,H as G,Ha as li,Ia as ci,Ka as re,La as pi,Ma as ui,Na as fi,Oa as vi,da as pt,e as dt,ea as V,fa as ut,ga as x,ja as Y,ma as J,s as A,t as j,u as $,v as I,w as ct,x as Z,ya as Lt,za as Ot}from"./chunk-Z7ZKWEZW.js";import"./chunk-RO425FB3.js";import"./chunk-WAOHJGL7.js";import{Ze as oi,a as ft,h as vt,j as mt,l as X,o as gt}from"./chunk-A5YL5TQU.js";import{a as ht,b as lt}from"./chunk-BV772TRD.js";import{p as q,q as ot,r as B,s as W}from"./chunk-UWVUTXK4.js";import{b as ze,d as Fe,e as N,f as Ue}from"./chunk-ZOJGMATP.js";import{a as Zt,b as Gt,c as Vt,d as Yt,e as Jt,f as Xt,g as Qt}from"./chunk-S4D3XMKN.js";import"./chunk-HYIKUOND.js";import"./chunk-2Z2TZD2T.js";import{a as F,b as U,c as Ve,d as Ye,e as Je,f as Xe,g as Qe,h as et,i as tt}from"./chunk-R5CIFMR2.js";import{d as rt}from"./chunk-FHPYNI5F.js";import{a as Ze,b as Ge,e as at}from"./chunk-3DWW6NQ5.js";import{c as it,d as st,f as nt}from"./chunk-6QSC5GC5.js";import{c as we}from"./chunk-2QTMJXDV.js";import{Gd as ni,Id as ri,Qb as We,Rb as je,X as K,aa as z,cb as Be,ua as qe}from"./chunk-6BMHULMT.js";import"./chunk-AMMMXB4X.js";import{a as He,b as Ee,c as Me}from"./chunk-7DUE2J6Q.js";import{Eg as P,Gg as ue,Ih as Te,Jg as fe,Kg as ve,Lg as me,Mg as ge,b as le,d as a,g as l,ig as pe,j as ce,k as g,l as u,nh as w,rh as be,th as ye,uh as ke,vh as Se,wh as xe,xh as $e,yh as Ie}from"./chunk-42FCO4AZ.js";import{$ as M,D as Re,G as De,O as Pe,P as _,T as _e,Ua as Ae,W as C,Wa as Ne,Xa as L,Ya as Ke,Z as Ce,Za as O,_ as Le,aa as Oe}from"./chunk-IMQFC3XQ.js";import{a as h}from"./chunk-LO2NM3CE.js";function $i(r){return r.name.trim()===""?"a status page":`"${r.name}"`}function E(r){if(r.length===0)return"";let p=r.map($i);return`Another save also changed ${p.length===1?p[0]:`${p.slice(0,-1).join(", ")} and ${p[p.length-1]}`}. ${p.length===1?"That save's version was kept.":"That save's versions were kept."}`}function wi(r){return r.ok?O(Ii(r),r.linkFailures,"status pages"):Ti(r)}function Ii(r){let p=r.kept??[];if(r.alreadySaved===!0){let e=p.length>0?` ${E(p)}`:"";return{kind:p.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${r.revision}.${e}`}}return p.length>0?{kind:"warn",text:`Saved. ${E(p)}`}:r.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}function Ti(r){let p=(r.message??"").trim();switch(r.code){case"conflict":return{kind:"warn",text:"Not saved. The status pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds status pages for this watch. Your edits are kept, so save again."};case"invalid":{let e=r.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the status pages is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the status pages${p===""?".":`: ${p}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Ne}`};case"busy":return{kind:"warn",text:"Already saving these status pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${p===""?".":`: ${p}`}`}}}ri({dirty:ie,drop:ti});typeof window<"u"&&window.addEventListener("beforeunload",r=>{ie()&&(r.preventDefault(),r.returnValue="")});var Ri=15e3,Si=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),R=Si?"\u2318":"Ctrl+",oe={min:200,max:720,middleMin:320},ae={left:280,right:340},de="wrist-assistant-panel.status-pages.columns.v1",Di=24,bi=820;function yi(r){return L(r).message}function he(r){return L(r).code}function ki(r){let{code:p,message:e}=L(r);return Object.assign(new Error(e),p===void 0?{}:{code:p})}function Pi(r){return r<1e3?`${r} bytes`:`${Number((r/1e3).toFixed(1))} KB`}function _i(r){let p=r?Date.parse(r):NaN;return Number.isNaN(p)?"":we(Math.max(0,(Date.now()-p)/1e3))}function Ci(r){return r instanceof HTMLElement?st(r.tagName,r instanceof HTMLInputElement?r.type:void 0,r.isContentEditable):!1}function Li(){let r=document.activeElement;for(;r?.shadowRoot?.activeElement;)r=r.shadowRoot.activeElement;return r===null||r===document.body||r===document.documentElement}var d=class extends ce{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=l;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.libraryItem=void 0;this.headBar=new He(this);this.unsupported=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.lib=new Lt(this,()=>this.hass,()=>this.linkDevices.map(e=>e.ownerId));this.deletingAll=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=wt();this.columns={...ae};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Ve(this);this.symbols=new qe(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.subscribeSeq=0;this.previewKind="watch";this.onReconnect=()=>{let e=this.recordKey;!this.isConnected||e===void 0||this.load(e,!0)};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let t=e.composedPath();if(!t.includes(this)&&!this.headBar.holds(t)&&!Li()||this.renderRoot.querySelector("dialog[open]"))return;let i=e.metaKey||e.ctrlKey,s=e.key.toLowerCase();if(i&&!e.altKey&&s==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(!Ci(t[0])){if(i&&!e.altKey&&s==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&s==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!i&&!e.altKey){let n=this.viewHost();n!==void 0&&St(n)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let t=e.composedPath(),i=s=>t.some(n=>n instanceof HTMLElement&&n.classList.contains(s));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("sp-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(We,this.onScrubStart),this.addEventListener(je,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return _e(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return this.libraryItem!==void 0?this.previewKind:oi(this.watches,this.watchId)?"iphone":"watch"}get draft(){let e=this.recordKey,t=this.record;if(!(e===void 0||t===void 0)){if(t.revision>0){let i=y(e);if(i!==void 0)return i;let s=A(t.document);return s===void 0?void 0:ee(e,s,t.revision).draft}if(!(this.libraryItem!==void 0||this.unsupported||!this.opensReady()))return y(e)??te(e)}}get recordKey(){return this.libraryItem===void 0?this.watchId:se(this.libraryItem)}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Fe(de,ae,oe),this.watchSize(),this.listenForReconnect(),this.openedItem!==void 0?this.openItem(!0):this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++}willUpdate(e){if(this.hass)if(e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,pe(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]})),this.libraryItem!==void 0)this.followLibraryItem(this.libraryItem);else{this.openedItem!==void 0&&(this.openedItem=void 0,this.watchId=void 0);let i=Ae(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));i!==void 0&&this.openWatch(i)}this.followSave();let t=this.restoreAsk;t!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===t.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),Qe(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let t of e){if(t.target!==this){this.measureTop(t.target);continue}let i=t.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width),Math.abs(i.height-this.hostHeight)>=1&&(this.hostHeight=i.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let t=this.renderRoot?.querySelector(".pe-top")??void 0;t!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=t,t!==void 0&&e.observe(t))}measureTop(e){let t=e.offsetHeight;t!==this.topHeight&&(this.topHeight=t,this.style.setProperty("--pe-top-h",`${t}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followLibraryItem(e){ne(e,this.openedItem)||(this.previewKind=ci());let t=re(this.watches,this.previewKind);if(t!==this.watchId&&(this.watchId=t),!ne(e,this.openedItem)){this.openedItem=e,this.openItem();return}let i=hi(this.lib.library,e),s=this.record?.revision;i!==void 0&&s!==void 0&&i>s&&i!==this.followedRevision&&(this.followedRevision=i,this.load(se(e),!0))}openItem(e=!1){let t=this.recordKey;t!==void 0&&(e||(this.reloadPending=!1,this.restartDraft=void 0,this.note=void 0,this.unsupported=!1,this.history=[],this.closeAsk(),this.endScrub(),this.uiState.clear(),this.deleteAsk=void 0,this.followedRevision=void 0),this.endSubscription(),this.stopPolling(),this.load(t,e))}followSave(){let e=this.recordKey;if(e===void 0)return;let t=y(e)?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let i=()=>this.saveEnded(e);t.then(i,i)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.recordKey?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,t=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),this.deleteAsk=void 0,t=!1);let i=ii(e);i!==void 0&&Q({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},i),this.startSubscription(e),this.load(e,t)}async load(e,t=!1){let i=this.hass;if(!i)return;if(t&&this.holdReload){this.reloadPending=!0;return}let s=++this.loadSeq;this.stopPolling(),t||(this.record=void 0,this.loading=!0,this.loadError=void 0);let n=this.libraryItem;try{let o=n!==void 0?await ai(i,n):await P(i,e,"status_pages");if(s!==this.loadSeq)return;if(t&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(o),this.loadError=void 0,!t&&n===void 0&&si(e)&&this.updateComplete.then(()=>{if(this.watchId!==e)return;let c=this.viewHost();c!==void 0&&xt(c)})}catch(o){if(s!==this.loadSeq)return;n!==void 0?t||(this.loadError=dt(o)):ut(o)?(this.unsupported=!0,this.loadError=void 0):t||(this.loadError=yi(o)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!(this.unsupported||n!==void 0)&&(this.pollIfWaiting(),this.loadHistory(e))}get linkDevices(){return ht(this.owners.length>0?this.owners:this.ownList??[],this.phones)}flushPending(){let e=this.recordKey;!this.reloadPending||this.holdReload||e===void 0||(this.reloadPending=!1,this.load(e,!0))}show(e){let t=this.recordKey;this.record=e,t!==void 0&&e.revision<=0&&te(t);let i=e.revision>0?A(e.document):void 0;if(t===void 0||i===void 0)return;let s=this.restartDraft;s!==void 0&&s.watchId===t&&e.revision>=s.revision&&(this.restartDraft=void 0,(y(t)?.dirty??!1)||T(t));let n=ee(t,i,e.revision);n.kept.length>0?this.note={kind:"warn",text:E(n.kept)}:n.mergedIntoEdits&&(this.note={kind:"warn",text:"The status pages changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let t=this.hass;if(!t||this.historyState==="unsupported")return;let i=++this.historySeq;try{let s=await fe(t,e,"status_pages");if(i!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(s?.entries)?s.entries:[],this.historyState="ready"}catch(s){if(i!==this.historySeq||e!==this.watchId)return;this.historyState=he(s)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let t=this.hass;if(this.endSubscription(),!t)return;let i=++this.subscribeSeq;ge(t,e,s=>{i===this.subscribeSeq&&s.kind==="status_pages"&&s.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(s=>{i===this.subscribeSeq?this.unsubscribe=s:s().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Re(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Ri))}async poll(){this.pollTimer=void 0;let e=this.hass,t=this.watchId,i=this.record;if(!(!e||t===void 0||i===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let s=await P(e,t,"status_pages");if(t!==this.watchId||this.record!==i)return;s.revision===i.revision?this.record={...i,delivered_revision:s.delivered_revision,delivered_at:s.delivered_at,rejected_revision:s.rejected_revision,rejected_at:s.rejected_at,rejected_reason:s.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(s),this.loadHistory(t))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,t){let i=this.draft;if(!i||this.saving)return!1;let s=i.apply(e(i.document),this.scrubKey??t);return this.requestUpdate(),s}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??it,t=this.iconMemo;if(t!==void 0&&t.provider===e&&t.tick===this.iconsTick)return t.icons;let i=nt(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:i},i}screen(){let e=this.phoneLayout();if(e!==void 0)return mt(e);let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return(z(t?.screen_size)??K).screen}phoneLayout(){if(this.device!=="iphone")return;let e=this.watches.find(t=>t.owner_watch_id===this.watchId);return vt(ft(e?.screen_size))}viewHost(){let e=this.draft,t=this.hass;if(e===void 0||t===void 0)return;let i=this;return{hass:t,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*X,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},get document(){return e.document},get busy(){return i.saving},...this.libraryHost(e),edit:(s,n)=>this.draft===e&&this.edit(s,n),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}libraryHost(e){let t=this.lib.library;if(this.libraryItem!==void 0)return{single:!0,deletePage:c=>this.askDelete(c)};let i=this.watchId;if(t===void 0||i===void 0)return{};let s=this.linkDevices,n=Ft(t,i,$(e.document).map(I),s),o=this.renderElsewhere();return{linkDevices:c=>Ht(t,"status_pages",I(c),i,s,v=>this.colorOf(v)),...n===void 0?{}:{sharedLine:n},deletePage:c=>this.askDelete(c),...o===l?{}:{elsewhere:o}}}deviceName(e){return this.linkDevices.find(t=>x(t.ownerId,e))?.name??"the other device"}get hereDevice(){let e=this.watchId;if(e!==void 0)return this.linkDevices.find(t=>x(t.ownerId,e))??{ownerId:e,name:`This ${lt(this.device)}`,kind:this.device}}statusTickLocked(e,t){if(this.libraryItem===void 0){let n=this.watchId;if(n===void 0)return;if(x(t,n))return Et("status_pages",this.device)}let i=this.lib.library;if(i!==void 0&&J(i,"status_pages",e).some(n=>x(n,t))&&(y(t)?.dirty??!1))return Mt(this.deviceName(t))}renderStageDevices(e){let t=this.lib.library;if(t===void 0||e===void 0)return l;let i=this.libraryItem;if(i===void 0&&(this.watchId===void 0||this.linkDevices.length<=1))return l;let s=Y(t,"status_pages",i?.id??I(e))?.owners.length??0;return fi("status_pages",s,this.statusTicksBody(e),"stage")}statusTicksBody(e){let t=this.lib.library,i=this.lib.store,s=this.watchId,n=t===void 0?void 0:Y(t,"status_pages",I(e)),o=this.libraryItem!==void 0||s!==void 0&&n?.owners.some(f=>x(f,s))===!0;if(t===void 0||i===void 0||n===void 0||!o)return a`<p class="sp-lib-hint">${Nt("status_pages")}</p>`;let c=i.noteFor("status_pages",n.id),v=this.hass?.user?.is_admin;return Ot({library:t,kind:"status_pages",itemId:n.id,devices:this.linkDevices,colorOf:f=>this.colorOf(f),pending:i.pending,...c===void 0?{}:{note:c},...v===void 0?{}:{admin:v},locked:f=>this.statusTickLocked(n.id,f)},(f,m)=>{Bt(this.hass,i,f,"status_pages",n.id,m)})}renderElsewhere(){let e=this.lib.library,t=this.lib.store,i=this.hereDevice;if(e===void 0||t===void 0||i===void 0)return l;let s=this.hass?.user?.is_admin,n=this.memoIcons();return Wt({library:e,kind:"status_pages",here:i,rows:Ut(e,i.ownerId,"status_pages",this.linkDevices),colorOf:o=>this.colorOf(o),pending:t.pending,noteFor:o=>t.noteFor("status_pages",o),...s===void 0?{}:{admin:s},...this.saving?{locked:"Saving. Try again once the save is done."}:{},picture:o=>mi({page:o.item,hass:this.hass,icons:n,tick:this.iconsTick}),onAdd:o=>{this.addHere(o)}})}async addHere(e){let t=this.lib.store,i=this.watchId;t===void 0||i===void 0||this.saving||!(await t.pick(i,"status_pages",e,!0)).ok||i!==this.watchId||(await this.load(i,!0),i===this.watchId&&H(this.draft?.document,e)!==void 0&&Q({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},e))}deleteChoices(e){let t=this.watchId;if(t!==void 0)return Kt(this.lib.library,"status_pages",e,t,this.device,this.linkDevices)}askDelete(e){if(!(H(this.draft?.document,e)===void 0||this.saving)){if(this.libraryItem!==void 0){this.deleteAsk={pageId:e};return}if(this.watchId!==void 0){if(this.deleteChoices(e)===void 0){this.edit(i=>G(i,e));return}this.deleteAsk={pageId:e}}}}closeDelete(){this.renderRoot?.querySelector("dialog.sp-del-ask")?.close(),this.deleteAsk=void 0}deleteHere(){let e=this.deleteAsk;this.closeDelete(),e!==void 0&&this.edit(t=>G(t,e.pageId))}async deleteFromLibrary(){let e=this.deleteAsk,t=this.lib.store,i=this.recordKey;if(!e||t===void 0||i===void 0||this.deletingAll)return;this.deletingAll=!0;let s=await t.deleteItem("status_pages",e.pageId);if(this.deletingAll=!1,i!==this.recordKey)return;if(this.libraryItem!==void 0){if(this.closeDelete(),!s.ok){this.note={kind:"err",text:`Not deleted. ${s.text}`};return}T(i),this.onBack?.();return}if(!s.ok){this.closeDelete(),this.note={kind:"err",text:`Not deleted. ${s.text}`};return}this.dirty?this.deleteHere():(this.closeDelete(),this.load(i,!0));let n=s.reply.link_failures??[];this.note=n.length>0?{kind:"warn",text:`Deleted from the library. Could not update ${n.map(o=>o.name).join(", ")}.`}:{kind:"ok",text:"Deleted from the library and from every device."}}renderDeleteAsk(e){let t=H(this.draft?.document,e.pageId),i=this.deletingAll;if(t!==void 0&&this.libraryItem!==void 0){let n=this.lib.library===void 0?[]:J(this.lib.library,"status_pages",e.pageId);return a`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
        @cancel=${o=>{i&&o.preventDefault()}}
        @close=${()=>{this.deletingAll||(this.deleteAsk=void 0)}}>
        <h3 id="sp-del-title">Delete "${Z(t)}" from the library?</h3>
        <p>${li(n.length)}</p>
        <div class="pe-ask-foot sp-del-foot">
          <button class="pe-btn" ?disabled=${i} @click=${()=>this.closeDelete()}>Cancel</button>
          <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${i||this.saving}
            @click=${()=>{this.deleteFromLibrary()}}>${i?"Deleting\u2026":"Delete from the library"}</button>
        </div>
      </dialog>`}let s=this.deleteChoices(e.pageId);return t===void 0||s===void 0?l:a`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
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
    </dialog>`}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,t=this.recordKey,i=this.libraryItem;this.endScrub();let s=this.draft;if(!e||t===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let n=s.revision<=0,o=Ct($(s.base),$(s.document)),c=_t(this.lib.library,t,"status_pages"),v=ei(s,i!==void 0?di(e,this.lib.store,i):{save:(m,S)=>ue(e,t,"status_pages",m,S).catch(D=>{throw ki(D)}),fetch:async()=>{let m=await P(e,t,"status_pages").catch(S=>{throw ki(S)});return{revision:m.revision,document:m.document}}});this.followedSave=s.saveDone,this.requestUpdate();let f=await v.catch(m=>({ok:!1,revision:s.revision,merged:!1,code:he(m)??"unknown",message:yi(m)}));if(this.saveEnded(t),t===this.recordKey&&(this.note=Yt(n,f.code,wi(f))),f.ok&&o.length>0){let m=await qt(e,t,o,c);m!==void 0&&t===this.recordKey&&this.note===void 0&&(this.note=m)}}startFresh(){let e=this.watchId;e===void 0||!Oe(this.noRecordState())||(Zt("status_pages",e),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let t=this.hass,i=this.watchId,s=this.record;if(!t||i===void 0||s===void 0||this.draft?.dirty)return;let n={entry:e,baseRevision:s.revision};this.restoreAsk=n,ve(t,i,"status_pages",e.revision).then(o=>{if(this.restoreAsk!==n)return;let c=zt(this.lib.library,"status_pages",i,$(A(o.document)),this.linkDevices);this.restoreAsk={...n,summary:pt(o.document),...c===void 0?{}:{others:c}}},()=>{})}async restore(){let e=this.hass,t=this.watchId,i=this.restoreAsk;if(!e||t===void 0||i===void 0||this.restoring)return;this.restoring=!0;let s;try{let n=await me(e,t,"status_pages",i.entry.revision,i.baseRevision);s=O({kind:"ok",text:rt(i.entry.updated_at)},Ke(n),"status pages"),t===this.watchId?this.restartDraft={watchId:t,revision:n.revision}:(y(t)?.dirty??!1)||T(t)}catch(n){let o=he(n);o==="conflict"?s={kind:"warn",text:"Not restored. The status pages changed somewhere else, so the newest copy is shown."}:o==="no_record"?s={kind:"warn",text:`Not restored. Home Assistant no longer holds status pages for this ${_(this.device)}.`}:o==="not_found"?s={kind:"warn",text:"Not restored. That save is no longer kept."}:o==="unknown_command"?(this.historyState="unsupported",s={kind:"warn",text:"This version of the integration cannot restore status pages. Update it to restore an earlier save."}):s={kind:"err",text:`Could not restore: ${Be(n)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}t===this.watchId&&(this.note=s,this.load(t,!0))}render(){let e=this.watches,t=this.draft;return a`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(t,e):l}
        ${this.note?a`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:l}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):l}
      ${this.deleteAsk&&!this.restoreAsk?this.renderDeleteAsk(this.deleteAsk):l}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=bi}renderTopBar(e,t){if(this.libraryItem!==void 0)return this.renderLibraryBar(e,t);let i=e!==void 0&&!this.unsupported,s=i&&this.dirty;return a`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch status pages">
      ${this.haMenu?a`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${w("menu")}</button>`:l}
      ${this.shellOwnsWatch?l:a`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():ni(void 0,!1)}>${w("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?l:this.renderWatchPicker(t)}
      ${this.barHost!==void 0&&i?Ee({newWatch:this.newWatch,dirty:s,saved:U(this.record,void 0,this.device),device:this.device}):l}
      ${this.renderSyncPill(i?e:void 0)}
      ${this.renderTopMenu(i?e:void 0)}
      ${i?a`<button class="primary save ${s?"dirty":""}" ?disabled=${!s||this.saving}
          title=${s?`Save (${R}S). A save reaches the ${_(this.device)} the next time it checks.`:`Nothing to save (${R}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?l:a`<span class="tb-saved" title=${s?"Unsaved changes":""}>${U(this.record,void 0,this.device)}</span>
        ${Xt(Vt({newWatch:this.newWatch,dirty:s,saving:this.saving}))}`}`:l}
      ${this.barActions}
    </div>`}renderLibraryBar(e,t){let i=e!==void 0,s=i&&this.dirty;return a`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Status page in the library">
      ${this.haMenu?a`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${w("menu")}</button>`:l}
      <button class="tb-btn tb-back" title="Back to the Status pages tab" @click=${()=>this.onBack?.()}>${w("left")}<span>Status pages</span></button>
      ${ui()}
      <span class="spacer"></span>
      ${this.renderTopMenu(i?e:void 0)}
      ${i?a`<button class="primary save ${s?"dirty":""}" ?disabled=${!s||this.saving}
          title=${s?`Save (${R}S). A save reaches every device that has this status page.`:`Nothing to save (${R}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>`:l}
      ${this.barActions}
    </div>`}renderSyncPill(e){let t=this.record;if(t===void 0||t.revision<=0||this.unsupported)return l;let i=e===void 0?{size:0,limit:1}:j(e.document),s=F({record:t,size:i.size,limit:i.limit,noun:"status pages",historyState:this.historyState,device:this.device});return a`<span class="tb-sync ${s.tone==="ok"?"ok":"warn"}" title=${`${s.state}. ${s.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${s.state}</span>
    </span>`}noRecordState(e=this.watches){return Ce(e.find(t=>t.owner_watch_id===this.watchId))}opensReady(e=this.watches){return Gt(this.noRecordState(e),"status_pages",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let t=this.canStartFresh();if(e===void 0&&!t)return l;let i=this.topMenuOpen,s=n=>()=>{this.topMenuOpen=!1,n()};return a`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${i?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!i}}>···</button>
      ${i?a`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?a`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${s(()=>this.discard())}>Discard edits</button>`:l}
        ${t?a`<button class="row" role="menuitem"
          @click=${s(()=>this.startFresh())}>${M}</button>`:l}
      </div>`:l}
    </span>`}colorOf(e){return Ge(Ze(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return l;let t=e.find(n=>n.owner_watch_id===this.watchId),i=this.watchMenuOpen,s=n=>{let o=n===void 0?void 0:this.colorOf(n);return a`<span class="pe-chip-glyph" style=${o?`--pe-person: ${o}`:l} aria-hidden="true">${w("watch")}</span>`};return a`<span class="picker sp-watch-picker">
      <button type="button" class="tb-browse sp-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose status pages are shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${s(t?.owner_watch_id)}<span class="tb-browse-l">${t?C(t,e):"Choose a watch"}</span>
        <span class="sp-caret" aria-hidden="true">${w("chevron")}</span>
      </button>
      ${i?a`<div class="pop-menu sp-watch-menu" role="menu" aria-label="Watches">
        ${e.map(n=>{let o=n.owner_watch_id===this.watchId;return a`<button type="button" class="row sp-watch-row" role="menuitemradio" aria-checked=${o?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,o||this.openWatch(n.owner_watch_id)}}>
            ${s(n.owner_watch_id)}<span class="sp-watch-name">${C(n,e)}</span>
            <span class="sp-watch-check" aria-hidden="true">${o?w("check"):l}</span>
          </button>`})}
      </div>`:l}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=bi?this.columns:ze(this.hostWidth-Di,this.columns,oe)}renderGutter(e){return a`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the pages and rows column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${t=>{let i=this.fittedColumns();Ue(t,{side:e,base:e==="left"?i.left:i.right,limits:oe,onWidth:s=>{this.columns={...this.columns,[e]:s}},onEnd:()=>N(de,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:ae[e]},N(de,this.columns)}}></div>`}get stageScale(){return this.zoom??q(this.narrow||this.stacked)}setZoom(e){this.zoom=e,bt(e)}renderStage(e,t){let i=t.find(k=>k.owner_watch_id===this.watchId),n=z(i?.screen_size)??K,o=e.phone!==void 0,c=e.phone===void 0?n.label:e.phone.model.label,v=[...Rt(e),c],f=k=>ot(o?k*X:k),m=kt(e),S=m===void 0?"Status pages":ct(m)||"Untitled page",D=this.draft,b=this.stageScale,xi=q(this.narrow||this.stacked);return a`<div class="card canvas-card lit sp-canvas" aria-label="Status page">
      <div class="cv-head">
        <span class="cv-title" title=${S}>${S}</span>
        ${i!==void 0?a`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
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
      ${this.renderStageDevices(m)}
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          ${this.libraryItem===void 0?l:a`${pi(this.previewKind,k=>{this.previewKind=k,this.watchId=re(t,k)})}<span class="tb-sep" aria-hidden="true"></span>`}
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${b<=W(b)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(W(b))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${f(b)}. Back to fit`}
              title=${`The ${o?"iPhone":"watch"} at ${f(b)} of its own points. Click to fit it again (${f(xi)}).`}
              @click=${()=>this.setZoom(void 0)}>${f(b)}</button>
            <button class="tb icon" ?disabled=${b>=B(b)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(B(b))}>+</button>
          </span>
        </div>
        <div class="sp-stage-body">${Tt(e)}</div>
        <div class="under"><span class="tail">${yt}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0&&this.libraryItem===void 0){let v=this.owners.length===0&&this.ownList===void 0;return a`<div class="pe-empty">${v?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return a`<div class="pe-empty"><b>${V}</b></div>`;if(this.loading)return a`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let v=this.recordKey;return a`<div class="pe-empty">
        <span>${this.libraryItem!==void 0?"Could not read this status page":`Could not read this ${_(this.device)}'s status pages`}: ${this.loadError}</span>
        ${v===void 0?l:a`<button class="pe-btn" @click=${()=>{this.load(v)}}>Try again</button>`}
      </div>`}let t=this.record;if(t===void 0)return a`<div class="pe-empty">Loading…</div>`;let i=this.draft;if(i===void 0&&t.revision>0)return a`<div class="pe-empty"><b>${V}</b></div>`;if(i===void 0){let v=this.watchId===void 0?void 0:y(this.watchId),f=this.watchId;return a`<div class="pe-empty"><b>${Pe("status pages",this.device)}</b><span>${Le}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${M}</button>
        ${v?.dirty&&f!==void 0?a`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when status pages are here again.</span>
          <button class="pe-btn" @click=${()=>{T(f),this.requestUpdate()}}>Discard the kept edits</button>`:l}
      </div>`}let s=this.viewHost();if(s===void 0)return a`<div class="pe-empty">Loading…</div>`;let n=this.fittedColumns(),o=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",c=t.revision<=0;return a`${c&&this.barHost===void 0?Jt(this.device):l}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${n.left}px;--wa-right:${n.right}px;${o}`}>
      <div class="column left">
        ${$t(s)}
        ${It(s)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(s,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Dt(s)}
      </div>
    </div>
    ${c||this.libraryItem!==void 0?l:this.renderFoot(t,i.document,i.dirty)}`}renderFoot(e,t,i){let s=j(t),n=F({record:e,size:s.size,limit:s.limit,noun:"status pages",historyState:this.historyState,device:this.device}),o=this.watchId;return a`${Ye({status:n,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Je({noun:"status pages",device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:i,restoring:this.restoring,onRetry:()=>{o!==void 0&&(this.historyState="loading",this.loadHistory(o))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):l}
    ${this.rawOpen?Xe({noun:"status pages",document:t,revision:e.revision,dirty:i,copied:this.rawCopied,onCopy:c=>{et(c).then(v=>{this.rawCopied=v})},onClosed:()=>{this.rawOpen=!1}}):l}`}renderRestoreAsk(e){let t=this.record,i=_i(e.entry.updated_at);return a`<dialog class="pe-ask" aria-labelledby="sp-ask-title"
      @cancel=${s=>{this.restoring&&s.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="sp-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${De(e.entry.updated_by,this.device)}${i?` ${i}`:""}, ${Pi(e.entry.size)}.</p>
      ${e.summary?a`<p class="pe-muted">${e.summary}</p>`:l}
      <p>It is saved again as a new revision${t?`, after revision ${t.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      ${e.others===void 0?l:a`<p class="sp-restore-others">${e.others}</p>`}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Te,be,ye,ke,Se,xe,$e,Ie,at,gt,Qt,le`
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
  `,Pt,At,gi,jt,tt,vi,Me]}};h([g({attribute:!1})],d.prototype,"hass",2),h([g({attribute:!1})],d.prototype,"owners",2),h([g({attribute:!1})],d.prototype,"ownerId",2),h([g({type:Boolean,reflect:!0})],d.prototype,"narrow",2),h([g({attribute:!1})],d.prototype,"icons",2),h([g({attribute:!1})],d.prototype,"iconsTick",2),h([g({attribute:!1})],d.prototype,"haMenu",2),h([g({attribute:!1})],d.prototype,"onHaMenu",2),h([g({attribute:!1})],d.prototype,"onBack",2),h([g({attribute:!1})],d.prototype,"barActions",2),h([g({attribute:!1})],d.prototype,"shellOwnsWatch",2),h([g({attribute:!1})],d.prototype,"phones",2),h([g({attribute:!1})],d.prototype,"barHost",2),h([g({attribute:!1})],d.prototype,"libraryItem",2),h([u()],d.prototype,"watchId",2),h([u()],d.prototype,"record",2),h([u()],d.prototype,"unsupported",2),h([u()],d.prototype,"loading",2),h([u()],d.prototype,"loadError",2),h([u()],d.prototype,"history",2),h([u()],d.prototype,"historyState",2),h([u()],d.prototype,"note",2),h([u()],d.prototype,"restoreAsk",2),h([u()],d.prototype,"restoring",2),h([u()],d.prototype,"historyOpen",2),h([u()],d.prototype,"rawOpen",2),h([u()],d.prototype,"rawCopied",2),h([u()],d.prototype,"ownList",2),h([u()],d.prototype,"deleteAsk",2),h([u()],d.prototype,"deletingAll",2),h([u()],d.prototype,"topMenuOpen",2),h([u()],d.prototype,"watchMenuOpen",2),h([u()],d.prototype,"zoom",2),h([u()],d.prototype,"columns",2),h([u()],d.prototype,"hostWidth",2),h([u()],d.prototype,"hostHeight",2),h([u()],d.prototype,"previewKind",2);customElements.get("wa-status-pages-editor")||customElements.define("wa-status-pages-editor",d);export{de as SP_COLUMNS_KEY,d as WaStatusPagesEditor};
