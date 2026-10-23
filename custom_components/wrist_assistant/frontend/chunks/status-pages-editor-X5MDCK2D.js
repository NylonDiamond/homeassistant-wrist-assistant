import{a as ki,b as I,c as de,d as he,e as R,f as le,g as Si,h as $i,i as xi}from"./chunk-H4TEEFOW.js";import{a as Vt,b as Gt,c as Yt,d as Jt,e as Xt,f as Qt,g as ei,h as ti,i as ui,j as pi}from"./chunk-7NDEYYKJ.js";import{a as Ut,e as qt,g as li,i as oe,j as ci}from"./chunk-EYJGOJ6G.js";import"./chunk-TYNJMYQI.js";import{b as ii,c as si,d as ni,e as ri,h as ai,i as oi,k as di,l as hi}from"./chunk-MQGFQGUV.js";import{c as Ot,d as Lt,e as At,f as Ht,g as ae,h as Et,i as Nt,j as Mt,k as Kt,l as B,n as Ft,o as zt,p as Bt,r as Bi,t as Ui}from"./chunk-ACTBZLVE.js";import{A as Ni,B as Mi,C as pe,D as Ki,E as Fi,F as zi,c as jt,e as Zt,m as ce,n as ue,o as Ri,p as Pi,q as _i,r as Ci,s as Oi,t as Li,u as Ai,w as U,x as P,y as Hi,z as Ei}from"./chunk-MAXWCBGB.js";import{D as K,J as ee,fa as Rt,g as xt,ga as te,ha as Pt,ia as $,ka as _t,la as F,oa as ie,u as M,v as X,w as D,x as T,y as Dt,z as Q,za as Wt}from"./chunk-QVA5ET2S.js";import"./chunk-CKIFX3N2.js";import{h as Di}from"./chunk-OA6DS6RJ.js";import"./chunk-TZIWUID7.js";import{a as se,j as ne,l as re,n as z,r as Ct}from"./chunk-3G6SC6DM.js";import{a as It,b as Tt}from"./chunk-XF6VR4HJ.js";import{p as G,q as yt,r as Y,s as J,w as St,x as $t}from"./chunk-RQWXLJYE.js";import{b as Je,d as Xe,e as j,f as Qe}from"./chunk-ZOJGMATP.js";import{a as fi,b as vi,c as mi,d as gi,e as bi,f as wi,g as yi}from"./chunk-G2XMT6V4.js";import"./chunk-27VXOWKT.js";import"./chunk-CHKZKW42.js";import{a as Z,b as at,c as ot,d as dt,e as V,f as ht,g as lt,h as ct,i as ut,j as pt,k as ft,l as vt}from"./chunk-LUNUSFWQ.js";import{d as wt}from"./chunk-7O325OCR.js";import{a as nt,b as rt}from"./chunk-RZEK6ZG7.js";import{b as kt}from"./chunk-DBIWFKAB.js";import{c as mt,d as gt,f as bt}from"./chunk-SV3BTW33.js";import{c as De}from"./chunk-HYO6YZS2.js";import{$a as tt,Dd as Ii,Fd as Ti,Nb as it,Ob as st,U as E,Z as N,ra as et}from"./chunk-WKBCTV4W.js";import"./chunk-TUSU5T3G.js";import{a as je,b as Ze,c as Ve}from"./chunk-PGFAOWAG.js";import{Eg as C,Fg as ke,Gg as Se,Ih as Ne,Jg as $e,Kg as xe,Lg as Ie,Mg as Te,b as be,d as a,g as l,ig as ye,j as we,k as g,l as u,mh as Re,nh as w,rh as Pe,th as _e,uh as Ce,vh as Oe,wh as Le,xh as Ae,yh as He,zh as Ee}from"./chunk-BDP52PL7.js";import{$ as W,D as Me,G as Ke,O as Fe,P as O,T as ze,Ua as We,W as L,Wa as Ge,Xa as A,Ya as Ye,Z as Be,Za as H,_ as Ue,aa as qe}from"./chunk-TGJNCNIU.js";import{a as h}from"./chunk-LO2NM3CE.js";function Yi(o){return o.name.trim()===""?"a status page":`"${o.name}"`}function q(o){if(o.length===0)return"";let v=o.map(Yi);return`Another save also changed ${v.length===1?v[0]:`${v.slice(0,-1).join(", ")} and ${v[v.length-1]}`}. ${v.length===1?"That save's version was kept.":"That save's versions were kept."}`}function qi(o){return o.ok?H(Ji(o),o.linkFailures,"status pages"):Xi(o)}function Ji(o){let v=o.kept??[];if(o.alreadySaved===!0){let e=v.length>0?` ${q(v)}`:"";return{kind:v.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${o.revision}.${e}`}}return v.length>0?{kind:"warn",text:`Saved. ${q(v)}`}:o.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}function Xi(o){let v=(o.message??"").trim();switch(o.code){case"conflict":return{kind:"warn",text:"Not saved. The status pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds status pages for this watch. Your edits are kept, so save again."};case"invalid":{let e=o.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the status pages is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the status pages${v===""?".":`: ${v}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Ge}`};case"busy":return{kind:"warn",text:"Already saving these status pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${v===""?".":`: ${v}`}`}}}Ti({dirty:le,drop:Si});typeof window<"u"&&window.addEventListener("beforeunload",o=>{le()&&(o.preventDefault(),o.returnValue="")});var Qi=15e3,Vi=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),_=Vi?"\u2318":"Ctrl+",fe={min:200,max:720,middleMin:320},ve={left:280,right:340},me="wrist-assistant-panel.status-pages.columns.v1",es=24,Wi=820;function ji(o){return A(o).message}function ge(o){return A(o).code}function Zi(o){let{code:v,message:e}=A(o);return Object.assign(new Error(e),v===void 0?{}:{code:v})}function ts(o){return o<1e3?`${o} bytes`:`${Number((o/1e3).toFixed(1))} KB`}function is(o){let v=o?Date.parse(o):NaN;return Number.isNaN(v)?"":De(Math.max(0,(Date.now()-v)/1e3))}function ss(o){return o instanceof HTMLElement?gt(o.tagName,o instanceof HTMLInputElement?o.type:void 0,o.isContentEditable):!1}function ns(){let o=document.activeElement;for(;o?.shadowRoot?.activeElement;)o=o.shadowRoot.activeElement;return o===null||o===document.body||o===document.documentElement}var d=class extends we{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=l;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.libraryItem=void 0;this.headBar=new je(this);this.previewSettled=!1;this.unsupported=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.lib=new Wt(this,()=>this.hass,()=>this.linkDevices.map(e=>e.ownerId));this.deletingAll=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=Ot();this.columns={...ve};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new ht(this);this.symbols=new et(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.subscribeSeq=0;this.previewKind="watch";this.sideBySide=!1;this.listFilter="all";this.configSummarySeq=0;this.onReconnect=()=>{let e=this.recordKey;!this.isConnected||e===void 0||this.load(e,!0)};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let t=e.composedPath();if(!t.includes(this)&&!this.headBar.holds(t)&&!ns()||this.renderRoot.querySelector("dialog[open]"))return;let i=e.metaKey||e.ctrlKey,s=e.key.toLowerCase();if(i&&!e.altKey&&s==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(!ss(t[0])){if(i&&!e.altKey&&s==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&s==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!i&&!e.altKey){let n=this.viewHost();n!==void 0&&Et(n)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let t=e.composedPath(),i=s=>t.some(n=>n instanceof HTMLElement&&n.classList.contains(s));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("sp-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(it,this.onScrubStart),this.addEventListener(st,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return ze(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return this.libraryItem!==void 0?this.previewKind:Di(this.watches,this.watchId)?"iphone":"watch"}get draft(){let e=this.recordKey,t=this.record;if(!(e===void 0||t===void 0)){if(t.revision>0){let i=I(e);if(i!==void 0)return i;let s=M(t.document);return s===void 0?void 0:de(e,s,t.revision).draft}if(!(this.libraryItem!==void 0||this.unsupported||!this.opensReady()))return I(e)??he(e)}}get recordKey(){return this.libraryItem===void 0?this.watchId:ce(this.libraryItem)}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Xe(me,ve,fe),this.watchSize(),this.listenForReconnect(),this.openedItem!==void 0?this.openItem(!0):this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++}willUpdate(e){if(this.hass)if(e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,ye(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]})),this.libraryItem!==void 0)this.followLibraryItem(this.libraryItem);else{this.openedItem!==void 0&&(this.openedItem=void 0,this.watchId=void 0);let i=We(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));i!==void 0&&this.openWatch(i)}this.followSave();let t=this.restoreAsk;t!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===t.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),pt(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let t of e){if(t.target!==this){this.measureTop(t.target);continue}let i=t.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width),Math.abs(i.height-this.hostHeight)>=1&&(this.hostHeight=i.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let t=this.renderRoot?.querySelector(".pe-top")??void 0;t!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=t,t!==void 0&&e.observe(t))}measureTop(e){let t=e.offsetHeight;t!==this.topHeight&&(this.topHeight=t,this.style.setProperty("--pe-top-h",`${t}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followLibraryItem(e){let t=P(this.lib.library,e);(!ue(e,this.openedItem)||!this.previewSettled)&&(this.previewKind=Hi(this.watches,e,t),this.sideBySide=Ni(this.watches,t,this.phones),this.previewSettled=t!==void 0);let i=U(this.watches,this.previewKind,[e.from,...t??[]]);if(i!==this.watchId&&(this.watchId=i),!ue(e,this.openedItem)){this.openedItem=e,this.openItem(),this.readConfigSummary();return}let s=_i(this.lib.library,e),n=this.record?.revision;s!==void 0&&n!==void 0&&s>n&&s!==this.followedRevision&&(this.followedRevision=s,this.load(ce(e),!0))}async readConfigSummary(){let e=this.hass;if(e===void 0||this.libraryItem===void 0)return;let t=++this.configSummarySeq;try{let i=await ke(e);t===this.configSummarySeq&&(this.configSummary=i)}catch{t===this.configSummarySeq&&(this.configSummary=void 0)}}pickPreview(e,t=!1){this.sideBySide=t,e!==this.previewKind&&(this.previewKind=e,this.watchId=U(this.watches,e,[this.libraryItem?.from,...P(this.lib.library,this.libraryItem)??[]]))}openItem(e=!1){let t=this.recordKey;t!==void 0&&(e||(this.reloadPending=!1,this.restartDraft=void 0,this.note=void 0,this.unsupported=!1,this.history=[],this.closeAsk(),this.endScrub(),this.uiState.clear(),this.deleteAsk=void 0,this.followedRevision=void 0),this.endSubscription(),this.stopPolling(),this.load(t,e))}followSave(){let e=this.recordKey;if(e===void 0)return;let t=I(e)?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let i=()=>this.saveEnded(e);t.then(i,i)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.recordKey?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,t=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),this.deleteAsk=void 0,t=!1);let i=$i(e);i!==void 0&&ae({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},i),this.startSubscription(e),this.load(e,t)}async load(e,t=!1){let i=this.hass;if(!i)return;if(t&&this.holdReload){this.reloadPending=!0;return}let s=++this.loadSeq;this.stopPolling(),t||(this.record=void 0,this.loading=!0,this.loadError=void 0);let n=this.libraryItem;try{let r=n!==void 0?await Ri(i,n):await C(i,e,"status_pages");if(s!==this.loadSeq)return;if(t&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0,!t&&n===void 0&&xi(e)&&this.updateComplete.then(()=>{if(this.watchId!==e)return;let c=this.viewHost();c!==void 0&&Nt(c)})}catch(r){if(s!==this.loadSeq)return;n!==void 0?t||(this.loadError=xt(r)):Pt(r)?(this.unsupported=!0,this.loadError=void 0):t||(this.loadError=ji(r)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!(this.unsupported||n!==void 0)&&(this.pollIfWaiting(),this.loadHistory(e))}get linkDevices(){return It(this.owners.length>0?this.owners:this.ownList??[],this.phones)}flushPending(){let e=this.recordKey;!this.reloadPending||this.holdReload||e===void 0||(this.reloadPending=!1,this.load(e,!0))}show(e){let t=this.recordKey;this.record=e,t!==void 0&&e.revision<=0&&he(t);let i=e.revision>0?M(e.document):void 0;if(t===void 0||i===void 0)return;let s=this.restartDraft;s!==void 0&&s.watchId===t&&e.revision>=s.revision&&(this.restartDraft=void 0,(I(t)?.dirty??!1)||R(t));let n=de(t,i,e.revision);n.kept.length>0?this.note={kind:"warn",text:q(n.kept)}:n.mergedIntoEdits&&(this.note={kind:"warn",text:"The status pages changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let t=this.hass;if(!t||this.historyState==="unsupported")return;let i=++this.historySeq;try{let s=await $e(t,e,"status_pages");if(i!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(s?.entries)?s.entries:[],this.historyState="ready"}catch(s){if(i!==this.historySeq||e!==this.watchId)return;this.historyState=ge(s)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let t=this.hass;if(this.endSubscription(),!t)return;let i=++this.subscribeSeq;Te(t,e,s=>{i===this.subscribeSeq&&s.kind==="status_pages"&&s.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(s=>{i===this.subscribeSeq?this.unsubscribe=s:s().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Me(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Qi))}async poll(){this.pollTimer=void 0;let e=this.hass,t=this.watchId,i=this.record;if(!(!e||t===void 0||i===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let s=await C(e,t,"status_pages");if(t!==this.watchId||this.record!==i)return;s.revision===i.revision?this.record={...i,delivered_revision:s.delivered_revision,delivered_at:s.delivered_at,rejected_revision:s.rejected_revision,rejected_at:s.rejected_at,rejected_reason:s.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(s),this.loadHistory(t))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,t){let i=this.draft;if(!i||this.saving)return!1;let s=i.apply(e(i.document),this.scrubKey??t);return this.requestUpdate(),s}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??mt,t=this.iconMemo;if(t!==void 0&&t.provider===e&&t.tick===this.iconsTick)return t.icons;let i=bt(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:i},i}screen(){let e=this.phoneLayout();if(e!==void 0)return re(e);let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return(N(t?.screen_size)??E).screen}phoneLayout(){if(this.device!=="iphone")return;let e=this.watches.find(t=>t.owner_watch_id===this.watchId);return ne(se(e?.screen_size))}viewHost(){let e=this.draft,t=this.hass;if(e===void 0||t===void 0)return;let i=this;return{hass:t,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*z,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},get document(){return e.document},get busy(){return i.saving},...this.libraryHost(e),edit:(s,n)=>this.draft===e&&this.edit(s,n),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}libraryHost(e){let t=this.lib.library;if(this.libraryItem!==void 0)return{single:!0,deletePage:c=>this.askDelete(c),listTools:Qt(this.listFilter,c=>{this.listFilter=c},"status page"),elsewhere:this.renderLibraryOthers()};let i=this.watchId;if(t===void 0||i===void 0)return{};let s=this.linkDevices,n=di(t,i,D(e.document).map(T),s),r=this.renderElsewhere();return{linkDevices:c=>ii(t,"status_pages",T(c),i,s,p=>this.colorOf(p)),...n===void 0?{}:{sharedLine:n},deletePage:c=>this.askDelete(c),...r===l?{}:{elsewhere:r}}}deviceName(e){return this.linkDevices.find(t=>$(t.ownerId,e))?.name??"the other device"}get hereDevice(){let e=this.watchId;if(e!==void 0)return this.linkDevices.find(t=>$(t.ownerId,e))??{ownerId:e,name:`This ${Tt(this.device)}`,kind:this.device}}statusTickLocked(e,t){if(this.libraryItem===void 0){let n=this.watchId;if(n===void 0)return;if($(t,n))return si("status_pages",this.device)}let i=this.lib.library;if(i!==void 0&&ie(i,"status_pages",e).some(n=>$(n,t))&&(I(t)?.dirty??!1))return ni(this.deviceName(t))}renderStageDevices(e){let t=this.lib.library;if(t===void 0||e===void 0)return l;let i=this.libraryItem;if(i===void 0&&(this.watchId===void 0||this.linkDevices.length<=1))return l;let s=F(t,"status_pages",i?.id??T(e))?.owners.length??0;return Fi("status_pages",s,this.statusTicksBody(e),this.lib.store?.savedStamp("status_pages",i?.id??T(e)))}statusTicksBody(e){let t=this.lib.library,i=this.lib.store,s=this.watchId,n=t===void 0?void 0:F(t,"status_pages",T(e)),r=this.libraryItem!==void 0||s!==void 0&&n?.owners.some(b=>$(b,s))===!0;if(t===void 0||i===void 0||n===void 0||!r)return a`<p class="sp-lib-hint">${ri("status_pages")}</p>`;let c=i.noteFor("status_pages",n.id),p=this.hass?.user?.is_admin,m=this.untickAsk,f=m!==void 0&&m.kind==="status_pages"&&$(m.itemId,n.id)?m:void 0;return jt({library:t,kind:"status_pages",itemId:n.id,devices:this.linkDevices,...this.libraryItem?.from===void 0?{}:{viewing:this.libraryItem.from},colorOf:b=>this.colorOf(b),pending:i.pending,...c===void 0?{}:{note:c},...p===void 0?{}:{admin:p},locked:b=>this.statusTickLocked(n.id,b),...f===void 0?{}:{ask:{ownerId:f.ownerId,text:f.text,onRemove:()=>{this.untickNow(f)},onCancel:()=>{this.untickAsk=void 0}}}},(b,x)=>this.tickStatusPage(n,b,x))}tickStatusPage(e,t,i){let s=this.lib.store;if(s===void 0)return;if(this.untickAsk=void 0,i){oe(this.hass,s,t,"status_pages",e.id,!0);return}let n={item:e.name,device:this.deviceName(t)};ci(this.hass,s,t,"status_pages",e.id,n).then(r=>{this.untickAsk=r})}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let i=await oe(this.hass,t,e.ownerId,e.kind,e.itemId,!1,e.names);i.note!==void 0&&(this.note=i.note)}renderElsewhere(){let e=this.lib.library,t=this.lib.store,i=this.hereDevice;if(e===void 0||t===void 0||i===void 0)return l;let s=this.hass?.user?.is_admin,n=this.memoIcons();return ui({library:e,kind:"status_pages",here:i,rows:hi(e,i.ownerId,"status_pages",this.linkDevices),colorOf:r=>this.colorOf(r),pending:t.pending,noteFor:r=>t.noteFor("status_pages",r),...s===void 0?{}:{admin:s},...this.saving?{locked:"Saving. Try again once the save is done."}:{},picture:r=>Bi({page:r.item,hass:this.hass,icons:n,tick:this.iconsTick}),onAdd:r=>{this.addHere(r)}})}async addHere(e){let t=this.lib.store,i=this.watchId;t===void 0||i===void 0||this.saving||!(await t.pick(i,"status_pages",e,!0)).ok||i!==this.watchId||(await this.load(i,!0),i===this.watchId&&K(this.draft?.document,e)!==void 0&&ae({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},e))}deleteChoices(e){let t=this.watchId;if(t!==void 0)return ai(this.lib.library,"status_pages",e,t,this.device,this.linkDevices)}askDelete(e){if(!(K(this.draft?.document,e)===void 0||this.saving)){if(this.libraryItem!==void 0){this.deleteAsk={pageId:e};return}if(this.watchId!==void 0){if(this.deleteChoices(e)===void 0){this.edit(i=>ee(i,e));return}this.deleteAsk={pageId:e}}}}closeDelete(){this.renderRoot?.querySelector("dialog.sp-del-ask")?.close(),this.deleteAsk=void 0}deleteHere(){let e=this.deleteAsk;this.closeDelete(),e!==void 0&&this.edit(t=>ee(t,e.pageId))}async deleteFromLibrary(){let e=this.deleteAsk,t=this.lib.store,i=this.recordKey;if(!e||t===void 0||i===void 0||this.deletingAll)return;this.deletingAll=!0;let s=await t.deleteItem("status_pages",e.pageId);if(this.deletingAll=!1,i!==this.recordKey)return;if(this.libraryItem!==void 0){if(this.closeDelete(),!s.ok){this.note={kind:"err",text:`Not deleted. ${s.text}`};return}R(i),this.onBack?.();return}if(!s.ok){this.closeDelete(),this.note={kind:"err",text:`Not deleted. ${s.text}`};return}this.dirty?this.deleteHere():(this.closeDelete(),this.load(i,!0));let n=s.reply.link_failures??[];this.note=n.length>0?{kind:"warn",text:`Deleted. Could not update ${n.map(r=>r.name).join(", ")}.`}:{kind:"ok",text:"Deleted from every device."}}renderDeleteAsk(e){let t=K(this.draft?.document,e.pageId),i=this.deletingAll;if(t!==void 0&&this.libraryItem!==void 0){let n=this.lib.library===void 0?[]:ie(this.lib.library,"status_pages",e.pageId),r=this.libraryItem.from,c=this.lib.library===void 0?void 0:F(this.lib.library,"status_pages",e.pageId),p=r!==void 0&&c!==void 0&&n.length>1&&n.some(m=>$(m,r))?r:void 0;return a`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
        @cancel=${m=>{i&&m.preventDefault()}}
        @close=${()=>{this.deletingAll||(this.deleteAsk=void 0)}}>
        <h3 id="sp-del-title">${Ci(Q(t))}</h3>
        <p>${Ai(n.length,p===void 0?void 0:this.deviceName(p))}</p>
        <div class="pe-ask-foot sp-del-foot">
          <button class="pe-btn" ?disabled=${i} @click=${()=>this.closeDelete()}>Cancel</button>
          ${p===void 0||c===void 0?l:a`<button class="pe-btn pe-danger sp-del-here" ?disabled=${i||this.saving}
            title=${`Take it off ${this.deviceName(p)} only`}
            @click=${()=>{this.closeDelete(),this.tickStatusPage(c,p,!1)}}>${Oi}</button>`}
          <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${i||this.saving}
            @click=${()=>{this.deleteFromLibrary()}}>${i?"Deleting\u2026":n.length>1?Li:"Delete"}</button>
        </div>
      </dialog>`}let s=this.deleteChoices(e.pageId);return t===void 0||s===void 0?l:a`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
      @cancel=${n=>{i&&n.preventDefault()}}
      @close=${()=>{this.deletingAll||(this.deleteAsk=void 0)}}>
      <h3 id="sp-del-title">Delete "${Q(t)}"?</h3>
      <p>${s.body}</p>
      <div class="pe-ask-foot sp-del-foot">
        <button class="pe-btn" ?disabled=${i} @click=${()=>this.closeDelete()}>Cancel</button>
        <button class="pe-btn sp-del-here" ?disabled=${i} @click=${()=>this.deleteHere()}>${s.remove}</button>
        <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${i||this.saving}
          @click=${()=>{this.deleteFromLibrary()}}>${i?"Deleting\u2026":s.library}</button>
      </div>
    </dialog>`}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,t=this.recordKey,i=this.libraryItem;this.endScrub();let s=this.draft;if(!e||t===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let n=s.revision<=0,r=qt(D(s.base),D(s.document)),c=Ut(this.lib.library,t,"status_pages"),p=ki(s,i!==void 0?Pi(e,this.lib.store,i):{save:(f,b)=>Se(e,t,"status_pages",f,b).catch(x=>{throw Zi(x)}),fetch:async()=>{let f=await C(e,t,"status_pages").catch(b=>{throw Zi(b)});return{revision:f.revision,document:f.document}}});this.followedSave=s.saveDone,this.requestUpdate();let m=await p.catch(f=>({ok:!1,revision:s.revision,merged:!1,code:ge(f)??"unknown",message:ji(f)}));if(this.saveEnded(t),m.ok&&i!==void 0&&this.readConfigSummary(),t===this.recordKey&&(this.note=gi(n,m.code,qi(m))),m.ok&&r.length>0){let f=await li(e,t,r,c);f!==void 0&&t===this.recordKey&&this.note===void 0&&(this.note=f)}}startFresh(){let e=this.watchId;e===void 0||!qe(this.noRecordState())||(fi("status_pages",e),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let t=this.hass,i=this.watchId,s=this.record;if(!t||i===void 0||s===void 0||this.draft?.dirty)return;let n={entry:e,baseRevision:s.revision};this.restoreAsk=n,xe(t,i,"status_pages",e.revision).then(r=>{if(this.restoreAsk!==n)return;let c=oi(this.lib.library,"status_pages",i,D(M(r.document)),this.linkDevices);this.restoreAsk={...n,summary:Rt(r.document),...c===void 0?{}:{others:c}}},()=>{})}async restore(){let e=this.hass,t=this.watchId,i=this.restoreAsk;if(!e||t===void 0||i===void 0||this.restoring)return;this.restoring=!0;let s;try{let n=await Ie(e,t,"status_pages",i.entry.revision,i.baseRevision);s=H({kind:"ok",text:wt(i.entry.updated_at)},Ye(n),"status pages"),t===this.watchId?this.restartDraft={watchId:t,revision:n.revision}:(I(t)?.dirty??!1)||R(t)}catch(n){let r=ge(n);r==="conflict"?s={kind:"warn",text:"Not restored. The status pages changed somewhere else, so the newest copy is shown."}:r==="no_record"?s={kind:"warn",text:`Not restored. Home Assistant no longer holds status pages for this ${O(this.device)}.`}:r==="not_found"?s={kind:"warn",text:"Not restored. That save is no longer kept."}:r==="unknown_command"?(this.historyState="unsupported",s={kind:"warn",text:"This version of the integration cannot restore status pages. Update it to restore an earlier save."}):s={kind:"err",text:`Could not restore: ${tt(n)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}t===this.watchId&&(this.note=s,this.load(t,!0))}render(){let e=this.watches,t=this.draft;return a`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(t,e):l}
        ${this.note?a`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:l}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):l}
      ${this.deleteAsk&&!this.restoreAsk?this.renderDeleteAsk(this.deleteAsk):l}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Wi}renderTopBar(e,t){if(this.libraryItem!==void 0)return this.renderLibraryBar(e,t);let i=e!==void 0&&!this.unsupported,s=i&&this.dirty;return a`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch status pages">
      ${this.haMenu?a`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${w("menu")}</button>`:l}
      ${this.shellOwnsWatch?l:a`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Ii(void 0,!1)}>${w("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?l:this.renderWatchPicker(t)}
      ${this.barHost!==void 0&&i?Ze({newWatch:this.newWatch,dirty:s,saved:V(this.record,void 0,this.device),device:this.device}):l}
      ${this.renderSyncPill(i?e:void 0)}
      ${this.renderTopMenu(i?e:void 0)}
      ${i?a`<button class="primary save ${s?"dirty":""}" ?disabled=${!s||this.saving}
          title=${s?`Save (${_}S). A save reaches the ${O(this.device)} the next time it checks.`:`Nothing to save (${_}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?l:a`<span class="tb-saved" title=${s?"Unsaved changes":""}>${V(this.record,void 0,this.device)}</span>
        ${wi(mi({newWatch:this.newWatch,dirty:s,saving:this.saving}))}`}`:l}
      ${this.barActions}
    </div>`}renderLibraryBar(e,t){let i=e!==void 0,s=i&&this.dirty;return a`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Status page in the library">
      ${this.haMenu?a`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${w("menu")}</button>`:l}
      <button class="tb-btn tb-back" title="Back to the Status pages tab" @click=${()=>this.onBack?.()}>${w("left")}<span>Status pages</span></button>
      ${Ki()}
      <span class="spacer"></span>
      ${this.renderTopMenu(i?e:void 0)}
      ${i?a`<button class="primary save ${s?"dirty":""}" ?disabled=${!s||this.saving}
          title=${s?`Save (${_}S). A save reaches every device that has this status page.`:`Nothing to save (${_}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>`:l}
      ${this.barActions}
    </div>`}renderSyncPill(e){let t=this.record;if(t===void 0||t.revision<=0||this.unsupported)return l;let i=e===void 0?{size:0,limit:1}:X(e.document),s=Z({record:t,size:i.size,limit:i.limit,noun:"status pages",historyState:this.historyState,device:this.device});return at(s,e?.dirty??!1)}noRecordState(e=this.watches){return Be(e.find(t=>t.owner_watch_id===this.watchId))}opensReady(e=this.watches){return vi(this.noRecordState(e),"status_pages",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let t=this.canStartFresh();if(e===void 0&&!t)return l;let i=this.topMenuOpen,s=n=>()=>{this.topMenuOpen=!1,n()};return a`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${i?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!i}}>···</button>
      ${i?a`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?a`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${s(()=>this.discard())}>Discard edits</button>`:l}
        ${e&&this.libraryItem===void 0&&(this.record?.revision??0)>0?ot(s(()=>{this.rawCopied=!1,this.rawOpen=!0})):l}
        ${t?a`<button class="row" role="menuitem"
          @click=${s(()=>this.startFresh())}>${W}</button>`:l}
      </div>`:l}
    </span>`}colorOf(e){return rt(nt(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return l;let t=e.find(n=>n.owner_watch_id===this.watchId),i=this.watchMenuOpen,s=n=>{let r=n===void 0?void 0:this.colorOf(n);return a`<span class="pe-chip-glyph" style=${r?`--pe-person: ${r}`:l} aria-hidden="true">${w("watch")}</span>`};return a`<span class="picker sp-watch-picker">
      <button type="button" class="tb-browse sp-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose status pages are shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${s(t?.owner_watch_id)}<span class="tb-browse-l">${t?L(t,e):"Choose a watch"}</span>
        <span class="sp-caret" aria-hidden="true">${w("chevron")}</span>
      </button>
      ${i?a`<div class="pop-menu sp-watch-menu" role="menu" aria-label="Watches">
        ${e.map(n=>{let r=n.owner_watch_id===this.watchId;return a`<button type="button" class="row sp-watch-row" role="menuitemradio" aria-checked=${r?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,r||this.openWatch(n.owner_watch_id)}}>
            ${s(n.owner_watch_id)}<span class="sp-watch-name">${L(n,e)}</span>
            <span class="sp-watch-check" aria-hidden="true">${r?w("check"):l}</span>
          </button>`})}
      </div>`:l}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Wi?this.columns:Je(this.hostWidth-es,this.columns,fe)}renderGutter(e){return a`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the pages and rows column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${t=>{let i=this.fittedColumns();Qe(t,{side:e,base:e==="left"?i.left:i.right,limits:fe,onWidth:s=>{this.columns={...this.columns,[e]:s}},onEnd:()=>j(me,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:ve[e]},j(me,this.columns)}}></div>`}get stageScale(){return this.zoom??G(this.narrow||this.stacked)}setZoom(e){this.zoom=e,Lt(e)}renderStage(e,t){let i=t.find(S=>S.owner_watch_id===this.watchId),n=N(i?.screen_size)??E,r=e.phone!==void 0,c=e.phone===void 0?n.label:e.phone.model.label,p=[...Ft(e),c],m=S=>yt(r?S*z:S),f=Ht(e),b=f===void 0?"Status pages":Dt(f)||"Untitled page",x=this.draft,y=this.stageScale,k=G(this.narrow||this.stacked);return a`<div class="card canvas-card lit sp-canvas" aria-label="Status page">
      <div class="cv-head">
        <span class="cv-title" title=${b}>${b}</span>
        ${i!==void 0?a`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${L(i,t)}</span></span>`:l}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${p.join(" \xB7 ")}><span class="fam">${p.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!x?.canUndo} title=${`Undo (${_}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${w("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!x?.canRedo} title=${Vi?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${w("redo")}</button>
        </span>
      </div>
      ${this.renderStageDevices(f)}
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          ${this.libraryItem===void 0?l:a`${Ei(this.previewKind,S=>this.pickPreview(S),this.phones?{on:this.sideBySide,pick:()=>{this.sideBySide=!0}}:void 0)}<span class="tb-sep" aria-hidden="true"></span>`}
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${y<=J(y)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(J(y))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${m(y)}. Back to fit`}
              title=${`The ${r?"iPhone":"watch"} at ${m(y)} of its own points. Click to fit it again (${m(k)}).`}
              @click=${()=>this.setZoom(void 0)}>${m(y)}</button>
            <button class="tb icon" ?disabled=${y>=Y(y)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(Y(y))}>+</button>
          </span>
        </div>
        <div class="sp-stage-body">${this.libraryItem===void 0?B(e):this.renderLibraryStage(e)}</div>
        <div class="under"><span class="tail">${At}</span></div>
      </div>
    </div>`}libraryNamesOf(e){let t=this.libraryItem;if(t===void 0)return[];let i=P(this.lib.library,t)??[];return this.linkDevices.filter(s=>s.kind===e&&i.some(n=>$(n,s.ownerId))).map(s=>s.name)}renderLibraryStage(e){let t=this.previewKind,i=(k,S,Gi)=>a`<div class="lib-duo-side ${k}">
      <span class="lib-duo-l" title=${pe(k,this.libraryNamesOf(k))}>${pe(k,this.libraryNamesOf(k))}<span class="lib-duo-tag">${Gi}</span></span>
      ${S}
    </div>`,s=B(e);if(!this.sideBySide)return a`<div class="lib-duo">${i(t,s,"")}</div>`;let n=Mi(t),r=n==="watch"?"watch":"iPhone",c=this.libraryItem,p=U(this.watches,n,[c?.from,...c===void 0?[]:P(this.lib.library,c)??[]]),m=this.watches.find(k=>k.owner_watch_id===p),f=n==="iphone"?ne(se(m?.screen_size)):void 0,b=f!==void 0?re(f):(N(m?.screen_size)??E).screen,x={...e,screen:b,scale:f===void 0?this.stageScale:this.stageScale*z},y=f===void 0?(({phone:k,...S})=>S)(x):{...x,phone:f};return a`<div class="lib-duo">
      ${i(t,s,"editing")}
      ${i(n,a`<button type="button" class="lib-duo-other" title=${`Click to edit on the ${r}`} aria-label=${`Edit on the ${r}`}
        @click=${()=>this.pickPreview(n,!0)}>${B(y)}</button>`,"preview")}
    </div>`}renderDevicesCard(){let e=this.libraryItem;if(e===void 0)return l;let t="status-pages",i="devices",s=St(this.uiState,t,i),n=Vt(this.lib.library,"status_pages",e.id,this.linkDevices,this.configSummary);return a`<div class="sp-devices">${Ee({color:Re.place,icon:w("layers"),title:"On each device",open:s,onToggle:()=>{$t(this.uiState,t,i,!s),this.requestUpdate()},...s?{}:{summary:n.length===0?"On no device yet":`${n.length} ${n.length===1?"device":"devices"}`},id:`${t}:${i}`},s?Gt({kind:"status_pages",lines:n,colorOf:r=>this.colorOf(r),busy:!1,onHide:()=>{},...this.onOpenBoard===void 0?{}:{onOpenBoard:this.onOpenBoard}}):a``)}</div>`}renderLibraryOthers(){let e=this.libraryItem,t=this.lib.library;if(e===void 0||t===void 0)return a``;let s=Jt(_t(t,"status_pages"),e.id,this.listFilter).filter(n=>!$(n.id,e.id));return a`${s.length===0?l:a`<div class="layers sp-page-list sp-lib-others" role="list">
      ${s.map(n=>a`<button type="button" class="layer lib-other-row ${n.owners.length===0?"nowhere":""}" role="listitem"
        data-lib-status=${n.id} title=${`Open ${n.name}`} @click=${()=>this.onOpenItem?.(n.id)}>
        <span class="grip" aria-hidden="true"></span>
        <span class="thumb sp-lib-thumb" aria-hidden="true">${w("list")}</span>
        <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${n.detail} · ${Xt(n)}</small></span>
      </button>`)}
    </div>`}${ei(this.listFilter,s.length+1,"status page")}`}renderBody(e){if(e.length===0&&this.libraryItem===void 0){let p=this.owners.length===0&&this.ownList===void 0;return a`<div class="pe-empty">${p?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return a`<div class="pe-empty"><b>${te}</b></div>`;if(this.loading)return a`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let p=this.recordKey;return a`<div class="pe-empty">
        <span>${this.libraryItem!==void 0?"Could not read this status page":`Could not read this ${O(this.device)}'s status pages`}: ${this.loadError}</span>
        ${p===void 0?l:a`<button class="pe-btn" @click=${()=>{this.load(p)}}>Try again</button>`}
      </div>`}let t=this.record;if(t===void 0)return a`<div class="pe-empty">Loading…</div>`;let i=this.draft;if(i===void 0&&t.revision>0)return a`<div class="pe-empty"><b>${te}</b></div>`;if(i===void 0){let p=this.watchId===void 0?void 0:I(this.watchId),m=this.watchId;return a`<div class="pe-empty"><b>${Fe("status pages",this.device)}</b><span>${Ue}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${W}</button>
        ${p?.dirty&&m!==void 0?a`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when status pages are here again.</span>
          <button class="pe-btn" @click=${()=>{R(m),this.requestUpdate()}}>Discard the kept edits</button>`:l}
      </div>`}let s=this.viewHost();if(s===void 0)return a`<div class="pe-empty">Loading…</div>`;let n=this.fittedColumns(),r=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",c=t.revision<=0;return a`${c&&this.barHost===void 0?bi(this.device):l}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${n.left}px;--wa-right:${n.right}px;${r}`}>
      <div class="column left">
        ${Mt(s)}
        ${Kt(s)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(s,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${this.renderDevicesCard()}
        ${zt(s)}
      </div>
    </div>
    ${c||this.libraryItem!==void 0?l:this.renderFoot(t,i.document,i.dirty)}`}renderFoot(e,t,i){let s=X(t),n=Z({record:e,size:s.size,limit:s.limit,noun:"status pages",historyState:this.historyState,device:this.device}),r=this.watchId;return a`${lt({status:n,historyState:this.historyState,historyOpen:this.historyOpen,onHistory:()=>{this.historyOpen=!0}})}
    ${this.historyOpen?ct({noun:"status pages",device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:i,restoring:this.restoring,onRetry:()=>{r!==void 0&&(this.historyState="loading",this.loadHistory(r))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):l}
    ${this.rawOpen?ut({noun:"status pages",document:t,revision:e.revision,dirty:i,copied:this.rawCopied,onCopy:c=>{ft(c).then(p=>{this.rawCopied=p})},onClosed:()=>{this.rawOpen=!1}}):l}`}renderRestoreAsk(e){let t=this.record,i=is(e.entry.updated_at);return a`<dialog class="pe-ask" aria-labelledby="sp-ask-title"
      @cancel=${s=>{this.restoring&&s.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="sp-ask-title" title=${`Revision ${e.entry.revision}`}>${dt(e.entry)}</h3>
      <p>${Ke(e.entry.updated_by,this.device)}${i?` ${i}`:""}, ${ts(e.entry.size)}.</p>
      ${e.summary?a`<p class="pe-muted">${e.summary}</p>`:l}
      <p>It is saved again as the newest save. The copy shown now stays in the earlier saves.</p>
      ${e.others===void 0?l:a`<p class="sp-restore-others">${e.others}</p>`}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Ne,Pe,_e,Ce,Oe,Le,Ae,He,kt,Ct,yi,be`
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
    /* Library mode: On each device over the inspector's cards, and the
       other status pages under the open one, each with a list glyph. */
    .sp-devices { margin-bottom: 10px; }
    .sp-lib-others { margin-top: 2px; }
    .sp-lib-thumb { display: inline-flex; align-items: center; justify-content: center; color: var(--wa-muted); }
    .sp-lib-thumb svg.ui-icon { width: 16px; height: 16px; }
  `,Bt,Zt,Ui,pi,vt,zi,Yt,ti,Ve]}};h([g({attribute:!1})],d.prototype,"hass",2),h([g({attribute:!1})],d.prototype,"owners",2),h([g({attribute:!1})],d.prototype,"ownerId",2),h([g({type:Boolean,reflect:!0})],d.prototype,"narrow",2),h([g({attribute:!1})],d.prototype,"icons",2),h([g({attribute:!1})],d.prototype,"iconsTick",2),h([g({attribute:!1})],d.prototype,"haMenu",2),h([g({attribute:!1})],d.prototype,"onHaMenu",2),h([g({attribute:!1})],d.prototype,"onBack",2),h([g({attribute:!1})],d.prototype,"barActions",2),h([g({attribute:!1})],d.prototype,"shellOwnsWatch",2),h([g({attribute:!1})],d.prototype,"phones",2),h([g({attribute:!1})],d.prototype,"barHost",2),h([g({attribute:!1})],d.prototype,"libraryItem",2),h([g({attribute:!1})],d.prototype,"onOpenItem",2),h([g({attribute:!1})],d.prototype,"onOpenBoard",2),h([u()],d.prototype,"watchId",2),h([u()],d.prototype,"record",2),h([u()],d.prototype,"unsupported",2),h([u()],d.prototype,"loading",2),h([u()],d.prototype,"loadError",2),h([u()],d.prototype,"history",2),h([u()],d.prototype,"historyState",2),h([u()],d.prototype,"note",2),h([u()],d.prototype,"restoreAsk",2),h([u()],d.prototype,"restoring",2),h([u()],d.prototype,"untickAsk",2),h([u()],d.prototype,"historyOpen",2),h([u()],d.prototype,"rawOpen",2),h([u()],d.prototype,"rawCopied",2),h([u()],d.prototype,"ownList",2),h([u()],d.prototype,"deleteAsk",2),h([u()],d.prototype,"deletingAll",2),h([u()],d.prototype,"topMenuOpen",2),h([u()],d.prototype,"watchMenuOpen",2),h([u()],d.prototype,"zoom",2),h([u()],d.prototype,"columns",2),h([u()],d.prototype,"hostWidth",2),h([u()],d.prototype,"hostHeight",2),h([u()],d.prototype,"previewKind",2),h([u()],d.prototype,"sideBySide",2),h([u()],d.prototype,"listFilter",2),h([u()],d.prototype,"configSummary",2);customElements.get("wa-status-pages-editor")||customElements.define("wa-status-pages-editor",d);export{me as SP_COLUMNS_KEY,d as WaStatusPagesEditor};
