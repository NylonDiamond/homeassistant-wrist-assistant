import{A as zt,C as ie,D as Ft,E as Ut,F as Wt,G as Bt,H as ne,I as Kt,J as jt,K as Zt,L as Gt,M as Vt,O as Yt,P as Xt,Q as Jt,a as _,b as V,c as Ct,d as Y,e as _t,g as Ht,h as H,j as X,k as Ot,l as J,m as Mt,o as Q,p as At,q as Nt,r as Lt,s as Et,t as b,u as ee,v as te,w as O,x as se,y as qt}from"./chunk-DXWNTJER.js";import{A as gt,C as wt,b as dt,c as C,i as ht,l as ct,n as $,o as lt,p as pt,r as ut,t as ft,u as vt,w as Z}from"./chunk-Z7YTC7Z2.js";import{p as B,q as rt,r as K,s as j}from"./chunk-PEI2F5V4.js";import{b as ze,d as Fe,e as E,f as Ue}from"./chunk-ZOJGMATP.js";import{a as St,b as $t,c as Pt,d as Tt,e as Dt,f as It,g as Rt}from"./chunk-6ETDLFV5.js";import{h as ts}from"./chunk-IXXLCEY3.js";import{a as mt,b as bt,c as yt,d as kt,e as G,h as xt}from"./chunk-V3JQMBXP.js";import{a as F,b as U,c as Ve,d as Ye,e as Xe,f as Je,g as Qe,h as et,i as tt}from"./chunk-5KH3AD3A.js";import{d as at}from"./chunk-AMGXZUWS.js";import{a as Ze,b as Ge,e as ot}from"./chunk-4C3X4OMP.js";import{c as st,d as it,f as nt}from"./chunk-QUDR47OK.js";import{Bd as es,Qb as Ke,Rb as je,X as q,aa as z,cb as Be,ua as We,zd as Qt}from"./chunk-B2GPRRUP.js";import{a as Ae,b as Ne,c as Le}from"./chunk-7E7TQLFM.js";import{h as be,j as ye,k as ke,l as xe,m as Se,n as $e,o as Pe,y as Te}from"./chunk-WDZJ6RME.js";import"./chunk-UPANJPAF.js";import{j as W}from"./chunk-ESIOP3D4.js";import{a as Ee,b as I,c as qe,d as R}from"./chunk-NKLOQSX6.js";import{c as me}from"./chunk-ZKYND2IQ.js";import{Eg as S,Gg as pe,Hg as N,Lg as ue,Mg as fe,Ng as ve,Og as ge,Pg as we,b as he,d as l,g as p,ig as le,j as ce,k as g,l as u,mh as m}from"./chunk-VWIMYR2L.js";import{B as De,E as Ie,M as Re,N as T,R as Ce,Sa as Me,U as D,X as _e,Y as He,Z as L,_ as Oe}from"./chunk-Q6MTLD6E.js";import{a as d}from"./chunk-LO2NM3CE.js";function ds(r){return r.name.trim()===""?"a status page":`"${r.name}"`}function M(r){if(r.length===0)return"";let f=r.map(ds);return`Another save also changed ${f.length===1?f[0]:`${f.slice(0,-1).join(", ")} and ${f[f.length-1]}`}. ${f.length===1?"That save's version was kept.":"That save's versions were kept."}`}function ss(r){return r.ok?R(hs(r),r.linkFailures,"status pages"):cs(r)}function hs(r){let f=r.kept??[];if(r.alreadySaved===!0){let e=f.length>0?` ${M(f)}`:"";return{kind:f.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${r.revision}.${e}`}}return f.length>0?{kind:"warn",text:`Saved. ${M(f)}`}:r.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}function cs(r){let f=(r.message??"").trim();switch(r.code){case"conflict":return{kind:"warn",text:"Not saved. The status pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds status pages for this watch. Your edits are kept, so save again."};case"invalid":{let e=r.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the status pages is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the status pages${f===""?".":`: ${f}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Ee}`};case"busy":return{kind:"warn",text:"Already saving these status pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${f===""?".":`: ${f}`}`}}}es({dirty:se,drop:qt});typeof window<"u"&&window.addEventListener("beforeunload",r=>{se()&&(r.preventDefault(),r.returnValue="")});var ls=15e3,rs=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),ae=rs?"\u2318":"Ctrl+",re={min:200,max:720,middleMin:320},oe={left:280,right:340},de="wrist-assistant-panel.status-pages.columns.v1",ps=24,is=820;function ns(r){return I(r).message}function A(r){return I(r).code}function as(r){let{code:f,message:e}=I(r);return Object.assign(new Error(e),f===void 0?{}:{code:f})}function us(r){return r<1e3?`${r} bytes`:`${Number((r/1e3).toFixed(1))} KB`}function fs(r){let f=r?Date.parse(r):NaN;return Number.isNaN(f)?"":me(Math.max(0,(Date.now()-f)/1e3))}function vs(r){return r instanceof HTMLElement?it(r.tagName,r instanceof HTMLInputElement?r.type:void 0,r.isContentEditable):!1}function gs(){let r=document.activeElement;for(;r?.shadowRoot?.activeElement;)r=r.shadowRoot.activeElement;return r===null||r===document.body||r===document.documentElement}var o=class extends ce{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=p;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.headBar=new Ae(this);this.unsupported=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.elsewhere=new Map;this.elsewhereFacts=new Map;this.linking=!1;this.deletingAll=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=Ft();this.columns={...oe};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Ve(this);this.symbols=new We(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.placesSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||this.load(e,!0)};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let t=e.composedPath();if(!t.includes(this)&&!this.headBar.holds(t)&&!gs()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,i=e.key.toLowerCase();if(s&&!e.altKey&&i==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(e.key==="Escape"&&this.devicesMenu!==void 0){e.preventDefault(),this.closeDevices();return}if(!vs(t[0])){if(s&&!e.altKey&&i==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&i==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!s&&!e.altKey){let n=this.viewHost();n!==void 0&&Kt(n)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen&&this.devicesMenu===void 0)return;let t=e.composedPath(),s=i=>t.some(n=>n instanceof HTMLElement&&n.classList.contains(i));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("sp-watch-picker")&&(this.watchMenuOpen=!1),this.devicesMenu!==void 0&&!s("pe-dev-menu")&&!s("sp-dev-open")&&this.closeDevices()};this.addEventListener(Ke,this.onScrubStart),this.addEventListener(je,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return Ce(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return ts(this.watches,this.watchId)?"iphone":"watch"}get draft(){let e=this.watchId,t=this.record;if(!(e===void 0||t===void 0)){if(t.revision>0){let s=b(e);if(s!==void 0)return s;let i=_(t.document);return i===void 0?void 0:ee(e,i,t.revision).draft}if(!(this.unsupported||!this.opensReady()))return b(e)??te(e)}}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Fe(de,oe,re),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++}willUpdate(e){if(this.hass){e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,le(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]}));let s=Me(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let t=this.restoreAsk;t!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===t.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),Qe(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let t of e){if(t.target!==this){this.measureTop(t.target);continue}let s=t.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let t=this.renderRoot?.querySelector(".pe-top")??void 0;t!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=t,t!==void 0&&e.observe(t))}measureTop(e){let t=e.offsetHeight;t!==this.topHeight&&(this.topHeight=t,this.style.setProperty("--pe-top-h",`${t}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let t=b(e)?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let s=()=>this.saveEnded(e);t.then(s,s)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,t=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),this.places=void 0,this.elsewhere=new Map,this.elsewhereFacts=new Map,this.closeDevices(),this.elsewhereNote=void 0,t=!1);let s=zt(e);s!==void 0&&ne({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},s),this.startSubscription(e),this.load(e,t)}async load(e,t=!1){let s=this.hass;if(!s)return;if(t&&this.holdReload){this.reloadPending=!0;return}let i=++this.loadSeq;this.stopPolling(),t||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let n=await S(s,e,"status_pages");if(i!==this.loadSeq)return;if(t&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(n),this.loadError=void 0}catch(n){if(i!==this.loadSeq)return;Mt(n)?(this.unsupported=!0,this.loadError=void 0):t||(this.loadError=ns(n)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e),this.loadPlaces(e))}async loadPlaces(e){let t=this.hass;if(!t)return;let s=++this.placesSeq;try{let a=await ue(t);if(s!==this.placesSeq||e!==this.watchId)return;this.places={pages:W(a?.pages)?a.pages:{},status_pages:W(a?.status_pages)?a.status_pages:{}}}catch(a){s===this.placesSeq&&A(a)==="unknown_command"&&(this.places=void 0);return}let i=this.linkDevices.filter(a=>a.ownerId!==e),n=await Promise.all(i.map(async a=>{try{let c=await S(t,a.ownerId,"status_pages"),h=c.revision>0?_(c.document):void 0;return{id:a.ownerId,facts:ht(c),...h===void 0?{}:{doc:h}}}catch{return{id:a.ownerId}}}));s!==this.placesSeq||e!==this.watchId||(this.elsewhere=new Map(n.flatMap(a=>a.doc===void 0?[]:[[a.id,a.doc]])),this.elsewhereFacts=new Map(n.flatMap(a=>a.facts===void 0?[]:[[a.id,a.facts]])))}get linkDevices(){return dt(this.owners.length>0?this.owners:this.ownList??[],this.phones)}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let t=this.watchId;this.record=e,t!==void 0&&e.revision<=0&&te(t);let s=e.revision>0?_(e.document):void 0;if(t===void 0||s===void 0)return;let i=this.restartDraft;i!==void 0&&i.watchId===t&&e.revision>=i.revision&&(this.restartDraft=void 0,(b(t)?.dirty??!1)||O(t));let n=ee(t,s,e.revision);n.kept.length>0?this.note={kind:"warn",text:M(n.kept)}:n.mergedIntoEdits&&(this.note={kind:"warn",text:"The status pages changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let t=this.hass;if(!t||this.historyState==="unsupported")return;let s=++this.historySeq;try{let i=await fe(t,e,"status_pages");if(s!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(i?.entries)?i.entries:[],this.historyState="ready"}catch(i){if(s!==this.historySeq||e!==this.watchId)return;this.historyState=A(i)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let t=this.hass;if(this.endSubscription(),!t)return;let s=++this.subscribeSeq;we(t,e,i=>{s===this.subscribeSeq&&i.kind==="status_pages"&&i.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(i=>{s===this.subscribeSeq?this.unsubscribe=i:i().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||De(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},ls))}async poll(){this.pollTimer=void 0;let e=this.hass,t=this.watchId,s=this.record;if(!(!e||t===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let i=await S(e,t,"status_pages");if(t!==this.watchId||this.record!==s)return;i.revision===s.revision?this.record={...s,delivered_revision:i.delivered_revision,delivered_at:i.delivered_at,rejected_revision:i.rejected_revision,rejected_at:i.rejected_at,rejected_reason:i.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(i),this.loadHistory(t))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,t){let s=this.draft;if(!s||this.saving)return!1;let i=s.apply(e(s.document),this.scrubKey??t);return this.requestUpdate(),i}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??st,t=this.iconMemo;if(t!==void 0&&t.provider===e&&t.tick===this.iconsTick)return t.icons;let s=nt(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}screen(){let e=this.phoneLayout();if(e!==void 0)return yt(e);let t=this.watches.find(s=>s.owner_watch_id===this.watchId);return(z(t?.screen_size)??q).screen}phoneLayout(){if(this.device!=="iphone")return;let e=this.watches.find(t=>t.owner_watch_id===this.watchId);return bt(mt(e?.screen_size))}viewHost(){let e=this.draft,t=this.hass;if(e===void 0||t===void 0)return;let s=this;return{hass:t,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*G,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},get document(){return e.document},get busy(){return s.saving},...this.linkHost(e),edit:(i,n)=>this.draft===e&&this.edit(i,n),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}linkHost(e){let t=this.places,s=this.watchId;if(t===void 0||s===void 0)return{};let i=this.linkDevices,n=lt(Ct(e.document),s,t,i),a=i.length>1,c=this.renderElsewhere(e.document);return{linkBadge:h=>pt($(h,s,t),s,i),...n===void 0?{}:{sharedLine:n},devices:h=>{if(!a||!At(h))return;let v=Y(h),k=this.devicesMenu,x=k!==void 0&&Ht(k.pageId,v)?k.where:void 0;return{...x===void 0?{}:{open:x},toggle:y=>x===y?this.closeDevices():this.openDevices(v,y),menu:y=>this.renderDevicesMenu(h,y)}},deletePage:h=>this.askDelete(h),...c===p?{}:{elsewhere:c}}}deviceName(e){return this.linkDevices.find(t=>t.ownerId===e)?.name??"the other device"}waitingDevices(){return ct(this.owners.length>0?this.owners:this.ownList??[],this.elsewhereFacts)}openDevices(e,t){this.devicesNote=void 0,this.devicesMenu={pageId:e,where:t},this.watchId!==void 0&&this.loadPlaces(this.watchId),this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.devicesMenu=void 0,this.devicesNote=void 0}linkBlocked(){if(this.saving)return"Saving. Try again once the save is done.";if(this.dirty)return`Save or discard your edits first. A status page goes on another device as it is saved on this ${C(this.device)}.`}renderDevicesMenu(e,t){let s=this.watchId??"",i=Y(e),n=this.linkBlocked();return gt({name:Q(e),places:Nt(this.linkDevices,e,s,this.places,this.waitingDevices()),...n===void 0?{}:{blocked:n},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:`at-${t}`,colorOf:a=>this.colorOf(a),onToggle:a=>{this.toggleDevice(i,a)},onDone:()=>this.closeDevices()})}async toggleDevice(e,t){let s=this.hass,i=this.watchId,n=t.device.ownerId;if(!s||i===void 0||n===i||this.linking||t.stuck!==void 0||this.linkBlocked()!==void 0)return;let a=t.device.name;this.linking=!0,this.devicesNote=void 0;let c;try{if(t.on){let h=await ie(s,n,e,a);c=h===void 0?{kind:"ok",text:`Taken off ${a}.`}:{kind:"err",text:h}}else await N(s,i,[e],[n],"status_pages"),c={kind:"ok",text:`Added to ${a}.`}}catch(h){c={kind:"err",text:`Not added. ${Z(h)}`}}finally{this.linking=!1}i===this.watchId&&(this.devicesNote=c,this.loadPlaces(i))}renderElsewhere(e){let t=this.watchId;if(t===void 0)return p;let s=Lt(t,e,this.linkDevices,this.elsewhere),i=this.linkBlocked();return Zt({title:ut(this.device),here:C(this.device),groups:s,colorOf:n=>this.colorOf(n),...i===void 0?{}:{blocked:i},busy:this.linking,...this.elsewhereNote===void 0?{}:{note:this.elsewhereNote},onAdd:n=>{this.addHere(n)}})}async addHere(e){let t=this.hass,s=this.watchId;if(!t||s===void 0||this.linking||this.linkBlocked()!==void 0)return;let i=this.deviceName(e.ownerId);if(b(e.ownerId)?.dirty??!1){this.elsewhereNote={kind:"warn",text:`Not added: ${i} has unsaved edits to its status pages. Save or discard them first.`};return}this.linking=!0,this.elsewhereNote=void 0;try{if(await N(t,e.ownerId,[e.pageId],[s],"status_pages"),s!==this.watchId)return;this.elsewhereNote={kind:"ok",text:`Added ${e.name} from ${i}.`},ne({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},e.pageId),this.load(s,!0)}catch(n){s===this.watchId&&(this.elsewhereNote={kind:"err",text:`Not added. ${Z(n)}`})}finally{this.linking=!1}}askDelete(e){let t=this.watchId,s=H(this.draft?.document,e);if(t===void 0||s===void 0||this.saving)return;let i=$(s,t,this.places);if(this.places===void 0||i.length<2){this.edit(n=>X(n,e));return}this.closeDevices(),this.deleteAsk={pageId:e}}closeDelete(){this.renderRoot?.querySelector("dialog.sp-del-ask")?.close(),this.deleteAsk=void 0}deleteHere(){let e=this.deleteAsk;this.closeDelete(),e!==void 0&&this.edit(t=>X(t,e.pageId))}async deleteEverywhere(){let e=this.deleteAsk,t=this.hass,s=this.watchId,i=e===void 0?void 0:H(this.draft?.document,e.pageId);if(!e||!t||s===void 0||i===void 0||this.deletingAll)return;let n=$(i,s,this.places).filter(h=>h!==s);this.deletingAll=!0;let a=[];for(let h of n){let v=await ie(t,h,e.pageId,this.deviceName(h));v!==void 0&&a.push(v)}if(this.deletingAll=!1,s!==this.watchId)return;this.deleteHere();let c=C(this.device);this.note=a.length>0?{kind:"warn",text:`Deleted here. ${a.join(" ")} Save to finish the delete on this ${c}.`}:{kind:"ok",text:`Deleted on the other devices. Save to finish the delete on this ${c}.`},this.loadPlaces(s)}renderDeleteAsk(e){let t=this.watchId,s=H(this.draft?.document,e.pageId);if(t===void 0||s===void 0)return p;let i=$(s,t,this.places),n=ft(i,this.device);if(n===void 0)return p;let a=i.filter(h=>h!==t).map(h=>this.deviceName(h)),c=this.deletingAll;return l`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
      @cancel=${h=>{c&&h.preventDefault()}}
      @close=${()=>{this.deletingAll||(this.deleteAsk=void 0)}}>
      <h3 id="sp-del-title">Delete "${Q(s)}"?</h3>
      <p>It is also on ${vt(a)}. You can undo the delete here until you leave this page.
        ${n.all} takes it off ${a.length===1?"that device":"those devices"} at once, which undo here does not bring back.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${c} @click=${()=>this.closeDelete()}>Cancel</button>
        <button class="pe-btn pe-danger sp-del-here" ?disabled=${c} @click=${()=>this.deleteHere()}>${n.here}</button>
        <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${c||this.saving}
          @click=${()=>{this.deleteEverywhere()}}>${c?"Deleting\u2026":n.all}</button>
      </div>
    </dialog>`}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,t=this.watchId;this.endScrub();let s=this.draft;if(!e||t===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let i=s.revision<=0,n=Et(s,{save:(c,h)=>pe(e,t,"status_pages",c,h).catch(v=>{throw as(v)}),fetch:async()=>{let c=await S(e,t,"status_pages").catch(h=>{throw as(h)});return{revision:c.revision,document:c.document}}});this.followedSave=s.saveDone,this.requestUpdate();let a=await n.catch(c=>({ok:!1,revision:s.revision,merged:!1,code:A(c)??"unknown",message:ns(c)}));this.saveEnded(t),t===this.watchId&&(this.note=Tt(i,a.code,ss(a)))}startFresh(){let e=this.watchId;e===void 0||!Oe(this.noRecordState())||(St("status_pages",e),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let t=this.hass,s=this.watchId,i=this.record;if(!t||s===void 0||i===void 0||this.draft?.dirty)return;let n={entry:e,baseRevision:i.revision};this.restoreAsk=n,ve(t,s,"status_pages",e.revision).then(a=>{this.restoreAsk===n&&(this.restoreAsk={...n,summary:Ot(a.document)})},()=>{})}async restore(){let e=this.hass,t=this.watchId,s=this.restoreAsk;if(!e||t===void 0||s===void 0||this.restoring)return;this.restoring=!0;let i;try{let n=await ge(e,t,"status_pages",s.entry.revision,s.baseRevision);i=R({kind:"ok",text:at(s.entry.updated_at)},qe(n),"status pages"),t===this.watchId?this.restartDraft={watchId:t,revision:n.revision}:(b(t)?.dirty??!1)||O(t)}catch(n){let a=A(n);a==="conflict"?i={kind:"warn",text:"Not restored. The status pages changed somewhere else, so the newest copy is shown."}:a==="no_record"?i={kind:"warn",text:`Not restored. Home Assistant no longer holds status pages for this ${T(this.device)}.`}:a==="not_found"?i={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",i={kind:"warn",text:"This version of the integration cannot restore status pages. Update it to restore an earlier save."}):i={kind:"err",text:`Could not restore: ${Be(n)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}t===this.watchId&&(this.note=i,this.load(t,!0))}render(){let e=this.watches,t=this.draft;return l`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(t,e):p}
        ${this.note?l`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:p}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):p}
      ${this.deleteAsk&&!this.restoreAsk?this.renderDeleteAsk(this.deleteAsk):p}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=is}renderTopBar(e,t){let s=e!==void 0&&!this.unsupported,i=s&&this.dirty;return l`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch status pages">
      ${this.haMenu?l`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${m("menu")}</button>`:p}
      ${this.shellOwnsWatch?p:l`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Qt(void 0,!1)}>${m("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?p:this.renderWatchPicker(t)}
      ${this.barHost!==void 0&&s?Ne({newWatch:this.newWatch,dirty:i,saved:U(this.record,void 0,this.device),device:this.device}):p}
      ${this.renderSyncPill(s?e:void 0)}
      ${this.renderTopMenu(s?e:void 0)}
      ${s?l`<button class="primary save ${i?"dirty":""}" ?disabled=${!i||this.saving}
          title=${i?`Save (${ae}S). A save reaches the ${T(this.device)} the next time it checks.`:`Nothing to save (${ae}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?p:l`<span class="tb-saved" title=${i?"Unsaved changes":""}>${U(this.record,void 0,this.device)}</span>
        ${It(Pt({newWatch:this.newWatch,dirty:i,saving:this.saving}))}`}`:p}
      ${this.barActions}
    </div>`}renderSyncPill(e){let t=this.record;if(t===void 0||t.revision<=0||this.unsupported)return p;let s=e===void 0?{size:0,limit:1}:V(e.document),i=F({record:t,size:s.size,limit:s.limit,noun:"status pages",historyState:this.historyState,device:this.device});return l`<span class="tb-sync ${i.tone==="ok"?"ok":"warn"}" title=${`${i.state}. ${i.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${i.state}</span>
    </span>`}noRecordState(e=this.watches){return _e(e.find(t=>t.owner_watch_id===this.watchId))}opensReady(e=this.watches){return $t(this.noRecordState(e),"status_pages",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let t=this.canStartFresh();if(e===void 0&&!t)return p;let s=this.topMenuOpen,i=n=>()=>{this.topMenuOpen=!1,n()};return l`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?l`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?l`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${i(()=>this.discard())}>Discard edits</button>`:p}
        ${t?l`<button class="row" role="menuitem"
          @click=${i(()=>this.startFresh())}>${L}</button>`:p}
      </div>`:p}
    </span>`}colorOf(e){return Ge(Ze(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return p;let t=e.find(n=>n.owner_watch_id===this.watchId),s=this.watchMenuOpen,i=n=>{let a=n===void 0?void 0:this.colorOf(n);return l`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:p} aria-hidden="true">${m("watch")}</span>`};return l`<span class="picker sp-watch-picker">
      <button type="button" class="tb-browse sp-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose status pages are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${i(t?.owner_watch_id)}<span class="tb-browse-l">${t?D(t,e):"Choose a watch"}</span>
        <span class="sp-caret" aria-hidden="true">${m("chevron")}</span>
      </button>
      ${s?l`<div class="pop-menu sp-watch-menu" role="menu" aria-label="Watches">
        ${e.map(n=>{let a=n.owner_watch_id===this.watchId;return l`<button type="button" class="row sp-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(n.owner_watch_id)}}>
            ${i(n.owner_watch_id)}<span class="sp-watch-name">${D(n,e)}</span>
            <span class="sp-watch-check" aria-hidden="true">${a?m("check"):p}</span>
          </button>`})}
      </div>`:p}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=is?this.columns:ze(this.hostWidth-ps,this.columns,re)}renderGutter(e){return l`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the pages and rows column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${t=>{let s=this.fittedColumns();Ue(t,{side:e,base:e==="left"?s.left:s.right,limits:re,onWidth:i=>{this.columns={...this.columns,[e]:i}},onEnd:()=>E(de,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:oe[e]},E(de,this.columns)}}></div>`}get stageScale(){return this.zoom??B(this.narrow||this.stacked)}setZoom(e){this.zoom=e,Ut(e)}renderStage(e,t){let s=t.find(P=>P.owner_watch_id===this.watchId),n=z(s?.screen_size)??q,a=e.phone!==void 0,c=e.phone===void 0?n.label:e.phone.model.label,h=[...Yt(e),c],v=P=>rt(a?P*G:P),k=Bt(e),x=k===void 0?"Status pages":_t(k)||"Untitled page",y=this.draft,w=this.stageScale,os=B(this.narrow||this.stacked);return l`<div class="card canvas-card lit sp-canvas" aria-label="Status page">
      <div class="cv-head">
        <span class="cv-title" title=${x}>${x}</span>
        ${s!==void 0?l`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${D(s,t)}</span></span>`:p}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${h.join(" \xB7 ")}><span class="fam">${h.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!y?.canUndo} title=${`Undo (${ae}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${m("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!y?.canRedo} title=${rs?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${m("redo")}</button>
        </span>
      </div>
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <button class="tb sp-case" aria-disabled="true" tabindex="-1" title=${a?kt:`This watch's screen, ${n.label}.`}>
            ${m(a?"phone":"watch")}<span class="word keep">${c}</span></button>
          <span class="tb-sep" aria-hidden="true"></span>
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${w<=j(w)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(j(w))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${v(w)}. Back to fit`}
              title=${`The ${a?"iPhone":"watch"} at ${v(w)} of its own points. Click to fit it again (${v(os)}).`}
              @click=${()=>this.setZoom(void 0)}>${v(w)}</button>
            <button class="tb icon" ?disabled=${w>=K(w)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(K(w))}>+</button>
          </span>
        </div>
        <div class="sp-stage-body">${Vt(e)}</div>
        <div class="under"><span class="tail">${Wt}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0){let h=this.owners.length===0&&this.ownList===void 0;return l`<div class="pe-empty">${h?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return l`<div class="pe-empty"><b>${J}</b></div>`;if(this.loading)return l`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let h=this.watchId;return l`<div class="pe-empty">
        <span>Could not read this ${T(this.device)}'s status pages: ${this.loadError}</span>
        ${h===void 0?p:l`<button class="pe-btn" @click=${()=>{this.load(h)}}>Try again</button>`}
      </div>`}let t=this.record;if(t===void 0)return l`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&t.revision>0)return l`<div class="pe-empty"><b>${J}</b></div>`;if(s===void 0){let h=this.watchId===void 0?void 0:b(this.watchId),v=this.watchId;return l`<div class="pe-empty"><b>${Re("status pages",this.device)}</b><span>${He}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${L}</button>
        ${h?.dirty&&v!==void 0?l`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when status pages are here again.</span>
          <button class="pe-btn" @click=${()=>{O(v),this.requestUpdate()}}>Discard the kept edits</button>`:p}
      </div>`}let i=this.viewHost();if(i===void 0)return l`<div class="pe-empty">Loading…</div>`;let n=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",c=t.revision<=0;return l`${c&&this.barHost===void 0?Dt(this.device):p}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${n.left}px;--wa-right:${n.right}px;${a}`}>
      <div class="column left">
        ${jt(i)}
        ${Gt(i)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(i,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Xt(i)}
      </div>
    </div>
    ${c?p:this.renderFoot(t,s.document,s.dirty)}`}renderFoot(e,t,s){let i=V(t),n=F({record:e,size:i.size,limit:i.limit,noun:"status pages",historyState:this.historyState,device:this.device}),a=this.watchId;return l`${Ye({status:n,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Xe({noun:"status pages",device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):p}
    ${this.rawOpen?Je({noun:"status pages",document:t,revision:e.revision,dirty:s,copied:this.rawCopied,onCopy:c=>{et(c).then(h=>{this.rawCopied=h})},onClosed:()=>{this.rawOpen=!1}}):p}`}renderRestoreAsk(e){let t=this.record,s=fs(e.entry.updated_at);return l`<dialog class="pe-ask" aria-labelledby="sp-ask-title"
      @cancel=${i=>{this.restoring&&i.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="sp-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${Ie(e.entry.updated_by,this.device)}${s?` ${s}`:""}, ${us(e.entry.size)}.</p>
      ${e.summary?l`<p class="pe-muted">${e.summary}</p>`:p}
      <p>It is saved again as a new revision${t?`, after revision ${t.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Te,be,ye,ke,xe,Se,$e,Pe,ot,xt,Rt,he`
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
    :host([narrow]) { --cf-pad: 12px; }
  `,Jt,wt,tt,Le]}};d([g({attribute:!1})],o.prototype,"hass",2),d([g({attribute:!1})],o.prototype,"owners",2),d([g({attribute:!1})],o.prototype,"ownerId",2),d([g({type:Boolean,reflect:!0})],o.prototype,"narrow",2),d([g({attribute:!1})],o.prototype,"icons",2),d([g({attribute:!1})],o.prototype,"iconsTick",2),d([g({attribute:!1})],o.prototype,"haMenu",2),d([g({attribute:!1})],o.prototype,"onHaMenu",2),d([g({attribute:!1})],o.prototype,"onBack",2),d([g({attribute:!1})],o.prototype,"barActions",2),d([g({attribute:!1})],o.prototype,"shellOwnsWatch",2),d([g({attribute:!1})],o.prototype,"phones",2),d([g({attribute:!1})],o.prototype,"barHost",2),d([u()],o.prototype,"watchId",2),d([u()],o.prototype,"record",2),d([u()],o.prototype,"unsupported",2),d([u()],o.prototype,"loading",2),d([u()],o.prototype,"loadError",2),d([u()],o.prototype,"history",2),d([u()],o.prototype,"historyState",2),d([u()],o.prototype,"note",2),d([u()],o.prototype,"restoreAsk",2),d([u()],o.prototype,"restoring",2),d([u()],o.prototype,"historyOpen",2),d([u()],o.prototype,"rawOpen",2),d([u()],o.prototype,"rawCopied",2),d([u()],o.prototype,"ownList",2),d([u()],o.prototype,"places",2),d([u()],o.prototype,"elsewhere",2),d([u()],o.prototype,"elsewhereFacts",2),d([u()],o.prototype,"devicesMenu",2),d([u()],o.prototype,"devicesNote",2),d([u()],o.prototype,"elsewhereNote",2),d([u()],o.prototype,"linking",2),d([u()],o.prototype,"deleteAsk",2),d([u()],o.prototype,"deletingAll",2),d([u()],o.prototype,"topMenuOpen",2),d([u()],o.prototype,"watchMenuOpen",2),d([u()],o.prototype,"zoom",2),d([u()],o.prototype,"columns",2),d([u()],o.prototype,"hostWidth",2),d([u()],o.prototype,"hostHeight",2);customElements.get("wa-status-pages-editor")||customElements.define("wa-status-pages-editor",o);export{de as SP_COLUMNS_KEY,o as WaStatusPagesEditor};
