import{A as es,B as ts,C as ss,a as zt,b as k,c as te,d as se,e as M,f as ie,g as qt,i as Ft,k as Ut,m as Wt,n as ne,o as Bt,p as Kt,q as jt,r as Zt,s as ae,t as Gt,u as Vt,v as Yt,w as Xt,x as Jt,y as Qt}from"./chunk-IKBC5NHO.js";import{$ as kt,W as lt,X,Y as pt,_ as Q,aa as xt,ba as St,m as _,n as G,o as H,p as V,q as ht,t as ct,u as P,y as Y}from"./chunk-ZGLX37NK.js";import{c as Tt}from"./chunk-AYNPMDH5.js";import"./chunk-3QCGN5ON.js";import{B as $t,D as Pt,b as ut,c as O,i as ft,l as vt,n as S,o as gt,p as wt,r as mt,t as bt,u as yt,x as J}from"./chunk-ZZWBYO74.js";import{p as K,q as rt,r as j,s as Z}from"./chunk-PEI2F5V4.js";import{b as Fe,d as Ue,e as z,f as We}from"./chunk-ZOJGMATP.js";import"./chunk-LBSU7WWI.js";import{a as Ht,b as Ot,c as Mt,d as At,e as Nt,f as Lt,g as Et}from"./chunk-UJNCYNEK.js";import{h as as}from"./chunk-7IDMKRVA.js";import{Ha as Dt,Ia as It,Ja as Rt,Ka as Ct,La as ee,Oa as _t}from"./chunk-SAWBVZMM.js";import"./chunk-4NI3O7TX.js";import{a as U,b as W,c as Ye,d as Xe,e as Je,f as Qe,g as et,h as tt,i as st}from"./chunk-LFGPE6IC.js";import{d as ot}from"./chunk-AMGXZUWS.js";import{a as Ge,b as Ve,e as dt}from"./chunk-K4UWPMSJ.js";import{c as it,d as nt,f as at}from"./chunk-UYXASAN6.js";import{c as be}from"./chunk-ZKYND2IQ.js";import{Gd as is,Id as ns,Qb as je,Rb as Ze,X as q,aa as F,cb as Ke,ua as Be}from"./chunk-TXM3PI3S.js";import{a as Ne,b as Le,c as Ee}from"./chunk-OYAL4D6G.js";import{Ah as Pe,Bh as Te,Eg as $,Gg as ue,Hg as L,Lg as fe,Lh as De,Mg as ve,Ng as ge,Og as we,Pg as me,b as ce,d as c,g as l,ig as pe,j as le,k as g,l as u,qh as b,uh as ye,wh as ke,xh as xe,yh as Se,zh as $e}from"./chunk-KWDEJLUK.js";import"./chunk-UPANJPAF.js";import{j as B}from"./chunk-ESIOP3D4.js";import{B as Ie,E as Re,M as Ce,N as D,R as _e,Sa as Ae,U as I,Ua as ze,Va as R,Wa as qe,X as He,Xa as C,Y as Oe,Z as E,_ as Me}from"./chunk-2ZMALKUC.js";import{a as d}from"./chunk-LO2NM3CE.js";function ps(o){return o.name.trim()===""?"a status page":`"${o.name}"`}function A(o){if(o.length===0)return"";let v=o.map(ps);return`Another save also changed ${v.length===1?v[0]:`${v.slice(0,-1).join(", ")} and ${v[v.length-1]}`}. ${v.length===1?"That save's version was kept.":"That save's versions were kept."}`}function os(o){return o.ok?C(us(o),o.linkFailures,"status pages"):fs(o)}function us(o){let v=o.kept??[];if(o.alreadySaved===!0){let e=v.length>0?` ${A(v)}`:"";return{kind:v.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${o.revision}.${e}`}}return v.length>0?{kind:"warn",text:`Saved. ${A(v)}`}:o.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}function fs(o){let v=(o.message??"").trim();switch(o.code){case"conflict":return{kind:"warn",text:"Not saved. The status pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds status pages for this watch. Your edits are kept, so save again."};case"invalid":{let e=o.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the status pages is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the status pages${v===""?".":`: ${v}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${ze}`};case"busy":return{kind:"warn",text:"Already saving these status pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${v===""?".":`: ${v}`}`}}}ns({dirty:ie,drop:qt});typeof window<"u"&&window.addEventListener("beforeunload",o=>{ie()&&(o.preventDefault(),o.returnValue="")});var vs=15e3,cs=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),oe=cs?"\u2318":"Ctrl+",re={min:200,max:720,middleMin:320},de={left:280,right:340},he="wrist-assistant-panel.status-pages.columns.v1",gs=24,rs=820;function ds(o){return R(o).message}function N(o){return R(o).code}function hs(o){let{code:v,message:e}=R(o);return Object.assign(new Error(e),v===void 0?{}:{code:v})}function ws(o){return o<1e3?`${o} bytes`:`${Number((o/1e3).toFixed(1))} KB`}function ms(o){let v=o?Date.parse(o):NaN;return Number.isNaN(v)?"":be(Math.max(0,(Date.now()-v)/1e3))}function bs(o){return o instanceof HTMLElement?nt(o.tagName,o instanceof HTMLInputElement?o.type:void 0,o.isContentEditable):!1}function ys(){let o=document.activeElement;for(;o?.shadowRoot?.activeElement;)o=o.shadowRoot.activeElement;return o===null||o===document.body||o===document.documentElement}var r=class extends le{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=l;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.headBar=new Ne(this);this.unsupported=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.elsewhere=new Map;this.elsewhereFacts=new Map;this.linking=!1;this.deletingAll=!1;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=Bt();this.columns={...de};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Ye(this);this.symbols=new Be(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.placesSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||this.load(e,!0)};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let t=e.composedPath();if(!t.includes(this)&&!this.headBar.holds(t)&&!ys()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,i=e.key.toLowerCase();if(s&&!e.altKey&&i==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(e.key==="Escape"&&this.devicesMenu!==void 0){e.preventDefault(),this.closeDevices();return}if(!bs(t[0])){if(s&&!e.altKey&&i==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&i==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!s&&!e.altKey){let n=this.viewHost();n!==void 0&&Gt(n)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen&&this.devicesMenu===void 0)return;let t=e.composedPath(),s=i=>t.some(n=>n instanceof HTMLElement&&n.classList.contains(i));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("sp-watch-picker")&&(this.watchMenuOpen=!1),this.devicesMenu!==void 0&&!s("pe-dev-menu")&&!s("sp-dev-open")&&this.closeDevices()};this.addEventListener(je,this.onScrubStart),this.addEventListener(Ze,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return _e(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return as(this.watches,this.watchId)?"iphone":"watch"}get draft(){let e=this.watchId,t=this.record;if(!(e===void 0||t===void 0)){if(t.revision>0){let s=k(e);if(s!==void 0)return s;let i=_(t.document);return i===void 0?void 0:te(e,i,t.revision).draft}if(!(this.unsupported||!this.opensReady()))return k(e)??se(e)}}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Ue(he,de,re),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++}willUpdate(e){if(this.hass){e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,pe(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]}));let s=Ae(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let t=this.restoreAsk;t!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===t.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),et(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let t of e){if(t.target!==this){this.measureTop(t.target);continue}let s=t.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let t=this.renderRoot?.querySelector(".pe-top")??void 0;t!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=t,t!==void 0&&e.observe(t))}measureTop(e){let t=e.offsetHeight;t!==this.topHeight&&(this.topHeight=t,this.style.setProperty("--pe-top-h",`${t}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let t=k(e)?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let s=()=>this.saveEnded(e);t.then(s,s)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,t=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),this.places=void 0,this.elsewhere=new Map,this.elsewhereFacts=new Map,this.closeDevices(),this.elsewhereNote=void 0,t=!1);let s=Ft(e);s!==void 0&&ae({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},s),this.startSubscription(e),this.load(e,t)}async load(e,t=!1){let s=this.hass;if(!s)return;if(t&&this.holdReload){this.reloadPending=!0;return}let i=++this.loadSeq;this.stopPolling(),t||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let n=await $(s,e,"status_pages");if(i!==this.loadSeq)return;if(t&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(n),this.loadError=void 0,!t&&Ut(e)&&this.updateComplete.then(()=>{if(this.watchId!==e)return;let a=this.viewHost();a!==void 0&&Vt(a)})}catch(n){if(i!==this.loadSeq)return;pt(n)?(this.unsupported=!0,this.loadError=void 0):t||(this.loadError=ds(n)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e),this.loadPlaces(e))}async loadPlaces(e){let t=this.hass;if(!t)return;let s=++this.placesSeq;try{let a=await fe(t);if(s!==this.placesSeq||e!==this.watchId)return;this.places={pages:B(a?.pages)?a.pages:{},status_pages:B(a?.status_pages)?a.status_pages:{}}}catch(a){s===this.placesSeq&&N(a)==="unknown_command"&&(this.places=void 0);return}let i=this.linkDevices.filter(a=>a.ownerId!==e),n=await Promise.all(i.map(async a=>{try{let p=await $(t,a.ownerId,"status_pages"),h=p.revision>0?_(p.document):void 0;return{id:a.ownerId,facts:ft(p),...h===void 0?{}:{doc:h}}}catch{return{id:a.ownerId}}}));s!==this.placesSeq||e!==this.watchId||(this.elsewhere=new Map(n.flatMap(a=>a.doc===void 0?[]:[[a.id,a.doc]])),this.elsewhereFacts=new Map(n.flatMap(a=>a.facts===void 0?[]:[[a.id,a.facts]])))}get linkDevices(){return ut(this.owners.length>0?this.owners:this.ownList??[],this.phones)}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let t=this.watchId;this.record=e,t!==void 0&&e.revision<=0&&se(t);let s=e.revision>0?_(e.document):void 0;if(t===void 0||s===void 0)return;let i=this.restartDraft;i!==void 0&&i.watchId===t&&e.revision>=i.revision&&(this.restartDraft=void 0,(k(t)?.dirty??!1)||M(t));let n=te(t,s,e.revision);n.kept.length>0?this.note={kind:"warn",text:A(n.kept)}:n.mergedIntoEdits&&(this.note={kind:"warn",text:"The status pages changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let t=this.hass;if(!t||this.historyState==="unsupported")return;let s=++this.historySeq;try{let i=await ve(t,e,"status_pages");if(s!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(i?.entries)?i.entries:[],this.historyState="ready"}catch(i){if(s!==this.historySeq||e!==this.watchId)return;this.historyState=N(i)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let t=this.hass;if(this.endSubscription(),!t)return;let s=++this.subscribeSeq;me(t,e,i=>{s===this.subscribeSeq&&i.kind==="status_pages"&&i.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(i=>{s===this.subscribeSeq?this.unsubscribe=i:i().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Ie(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},vs))}async poll(){this.pollTimer=void 0;let e=this.hass,t=this.watchId,s=this.record;if(!(!e||t===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let i=await $(e,t,"status_pages");if(t!==this.watchId||this.record!==s)return;i.revision===s.revision?this.record={...s,delivered_revision:i.delivered_revision,delivered_at:i.delivered_at,rejected_revision:i.rejected_revision,rejected_at:i.rejected_at,rejected_reason:i.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(i),this.loadHistory(t))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,t){let s=this.draft;if(!s||this.saving)return!1;let i=s.apply(e(s.document),this.scrubKey??t);return this.requestUpdate(),i}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??it,t=this.iconMemo;if(t!==void 0&&t.provider===e&&t.tick===this.iconsTick)return t.icons;let s=at(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}screen(){let e=this.phoneLayout();if(e!==void 0)return Rt(e);let t=this.watches.find(s=>s.owner_watch_id===this.watchId);return(F(t?.screen_size)??q).screen}phoneLayout(){if(this.device!=="iphone")return;let e=this.watches.find(t=>t.owner_watch_id===this.watchId);return It(Dt(e?.screen_size))}viewHost(){let e=this.draft,t=this.hass;if(e===void 0||t===void 0)return;let s=this;return{hass:t,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*ee,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},get document(){return e.document},get busy(){return s.saving},...this.linkHost(e),edit:(i,n)=>this.draft===e&&this.edit(i,n),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}linkHost(e){let t=this.places,s=this.watchId;if(t===void 0||s===void 0)return{};let i=this.linkDevices,n=gt(H(e.document),s,t,i),a=i.length>1,p=this.renderElsewhere(e.document);return{linkBadge:h=>wt(S(h,s,t),s,i),...n===void 0?{}:{sharedLine:n},devices:h=>{if(!a||!kt(h))return;let f=V(h),w=this.devicesMenu,y=w!==void 0&&ct(w.pageId,f)?w.where:void 0;return{...y===void 0?{}:{open:y},toggle:x=>y===x?this.closeDevices():this.openDevices(f,x),menu:x=>this.renderDevicesMenu(h,x)}},deletePage:h=>this.askDelete(h),...p===l?{}:{elsewhere:p}}}deviceName(e){return this.linkDevices.find(t=>t.ownerId===e)?.name??"the other device"}waitingDevices(){return vt(this.owners.length>0?this.owners:this.ownList??[],this.elsewhereFacts)}openDevices(e,t){this.devicesNote=void 0,this.devicesMenu={pageId:e,where:t},this.watchId!==void 0&&this.loadPlaces(this.watchId),this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.devicesMenu=void 0,this.devicesNote=void 0}linkBlocked(){if(this.saving)return"Saving. Try again once the save is done.";if(this.dirty)return`Save or discard your edits first. A status page goes on another device as it is saved on this ${O(this.device)}.`}renderDevicesMenu(e,t){let s=this.watchId??"",i=V(e),n=this.linkBlocked();return $t({name:Q(e),places:xt(this.linkDevices,e,s,this.places,this.waitingDevices()),...n===void 0?{}:{blocked:n},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:`at-${t}`,colorOf:a=>this.colorOf(a),onToggle:a=>{this.toggleDevice(i,a)},onDone:()=>this.closeDevices()})}async toggleDevice(e,t){let s=this.hass,i=this.watchId,n=t.device.ownerId;if(!s||i===void 0||n===i||this.linking||t.stuck!==void 0||this.linkBlocked()!==void 0)return;let a=t.device.name;this.linking=!0,this.devicesNote=void 0;let p;try{if(t.on){let h=await ne(s,n,e,a);p=h===void 0?{kind:"ok",text:`Taken off ${a}.`}:{kind:"err",text:h}}else await L(s,i,[e],[n],"status_pages"),p={kind:"ok",text:`Added to ${a}.`}}catch(h){p={kind:"err",text:`Not added. ${J(h)}`}}finally{this.linking=!1}i===this.watchId&&(this.devicesNote=p,this.loadPlaces(i))}renderElsewhere(e){let t=this.watchId;if(t===void 0)return l;let s=St(t,e,this.linkDevices,this.elsewhere),i=this.linkBlocked();return Xt({title:mt(this.device),here:O(this.device),groups:s,colorOf:n=>this.colorOf(n),...i===void 0?{}:{blocked:i},busy:this.linking,...this.elsewhereNote===void 0?{}:{note:this.elsewhereNote},onAdd:n=>{this.addHere(n)}})}async addHere(e){let t=this.hass,s=this.watchId;if(!t||s===void 0||this.linking||this.linkBlocked()!==void 0)return;let i=this.deviceName(e.ownerId);if(k(e.ownerId)?.dirty??!1){this.elsewhereNote={kind:"warn",text:`Not added: ${i} has unsaved edits to its status pages. Save or discard them first.`};return}this.linking=!0,this.elsewhereNote=void 0;try{if(await L(t,e.ownerId,[e.pageId],[s],"status_pages"),s!==this.watchId)return;this.elsewhereNote={kind:"ok",text:`Added ${e.name} from ${i}.`},ae({uiState:this.uiState,requestUpdate:()=>this.requestUpdate()},e.pageId),this.load(s,!0)}catch(n){s===this.watchId&&(this.elsewhereNote={kind:"err",text:`Not added. ${J(n)}`})}finally{this.linking=!1}}askDelete(e){let t=this.watchId,s=P(this.draft?.document,e);if(t===void 0||s===void 0||this.saving)return;let i=S(s,t,this.places);if(this.places===void 0||i.length<2){this.edit(n=>Y(n,e));return}this.closeDevices(),this.deleteAsk={pageId:e}}closeDelete(){this.renderRoot?.querySelector("dialog.sp-del-ask")?.close(),this.deleteAsk=void 0}deleteHere(){let e=this.deleteAsk;this.closeDelete(),e!==void 0&&this.edit(t=>Y(t,e.pageId))}async deleteEverywhere(){let e=this.deleteAsk,t=this.hass,s=this.watchId,i=e===void 0?void 0:P(this.draft?.document,e.pageId);if(!e||!t||s===void 0||i===void 0||this.deletingAll)return;let n=S(i,s,this.places).filter(h=>h!==s);this.deletingAll=!0;let a=[];for(let h of n){let f=await ne(t,h,e.pageId,this.deviceName(h));f!==void 0&&a.push(f)}if(this.deletingAll=!1,s!==this.watchId)return;this.deleteHere();let p=O(this.device);this.note=a.length>0?{kind:"warn",text:`Deleted here. ${a.join(" ")} Save to finish the delete on this ${p}.`}:{kind:"ok",text:`Deleted on the other devices. Save to finish the delete on this ${p}.`},this.loadPlaces(s)}renderDeleteAsk(e){let t=this.watchId,s=P(this.draft?.document,e.pageId);if(t===void 0||s===void 0)return l;let i=S(s,t,this.places),n=bt(i,this.device);if(n===void 0)return l;let a=i.filter(h=>h!==t).map(h=>this.deviceName(h)),p=this.deletingAll;return c`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
      @cancel=${h=>{p&&h.preventDefault()}}
      @close=${()=>{this.deletingAll||(this.deleteAsk=void 0)}}>
      <h3 id="sp-del-title">Delete "${Q(s)}"?</h3>
      <p>It is also on ${yt(a)}. You can undo the delete here until you leave this page.
        ${n.all} takes it off ${a.length===1?"that device":"those devices"} at once, which undo here does not bring back.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${p} @click=${()=>this.closeDelete()}>Cancel</button>
        <button class="pe-btn pe-danger sp-del-here" ?disabled=${p} @click=${()=>this.deleteHere()}>${n.here}</button>
        <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${p||this.saving}
          @click=${()=>{this.deleteEverywhere()}}>${p?"Deleting\u2026":n.all}</button>
      </div>
    </dialog>`}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,t=this.watchId;this.endScrub();let s=this.draft;if(!e||t===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let i=s.revision<=0,n=Tt(H(s.base),H(s.document)),a=n.filter(f=>S(P(s.base,f),t,this.places).length>1),p=zt(s,{save:(f,w)=>ue(e,t,"status_pages",f,w).catch(y=>{throw hs(y)}),fetch:async()=>{let f=await $(e,t,"status_pages").catch(w=>{throw hs(w)});return{revision:f.revision,document:f.document}}});this.followedSave=s.saveDone,this.requestUpdate();let h=await p.catch(f=>({ok:!1,revision:s.revision,merged:!1,code:N(f)??"unknown",message:ds(f)}));if(this.saveEnded(t),t===this.watchId&&(this.note=At(i,h.code,os(h))),h.ok&&n.length>0){let f=await Wt(e,t,n,a);f!==void 0&&t===this.watchId&&this.note===void 0&&(this.note=f)}}startFresh(){let e=this.watchId;e===void 0||!Me(this.noRecordState())||(Ht("status_pages",e),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let t=this.hass,s=this.watchId,i=this.record;if(!t||s===void 0||i===void 0||this.draft?.dirty)return;let n={entry:e,baseRevision:i.revision};this.restoreAsk=n,ge(t,s,"status_pages",e.revision).then(a=>{this.restoreAsk===n&&(this.restoreAsk={...n,summary:lt(a.document)})},()=>{})}async restore(){let e=this.hass,t=this.watchId,s=this.restoreAsk;if(!e||t===void 0||s===void 0||this.restoring)return;this.restoring=!0;let i;try{let n=await we(e,t,"status_pages",s.entry.revision,s.baseRevision);i=C({kind:"ok",text:ot(s.entry.updated_at)},qe(n),"status pages"),t===this.watchId?this.restartDraft={watchId:t,revision:n.revision}:(k(t)?.dirty??!1)||M(t)}catch(n){let a=N(n);a==="conflict"?i={kind:"warn",text:"Not restored. The status pages changed somewhere else, so the newest copy is shown."}:a==="no_record"?i={kind:"warn",text:`Not restored. Home Assistant no longer holds status pages for this ${D(this.device)}.`}:a==="not_found"?i={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",i={kind:"warn",text:"This version of the integration cannot restore status pages. Update it to restore an earlier save."}):i={kind:"err",text:`Could not restore: ${Ke(n)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}t===this.watchId&&(this.note=i,this.load(t,!0))}render(){let e=this.watches,t=this.draft;return c`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(t,e):l}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:l}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):l}
      ${this.deleteAsk&&!this.restoreAsk?this.renderDeleteAsk(this.deleteAsk):l}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=rs}renderTopBar(e,t){let s=e!==void 0&&!this.unsupported,i=s&&this.dirty;return c`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch status pages">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${b("menu")}</button>`:l}
      ${this.shellOwnsWatch?l:c`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():is(void 0,!1)}>${b("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?l:this.renderWatchPicker(t)}
      ${this.barHost!==void 0&&s?Le({newWatch:this.newWatch,dirty:i,saved:W(this.record,void 0,this.device),device:this.device}):l}
      ${this.renderSyncPill(s?e:void 0)}
      ${this.renderTopMenu(s?e:void 0)}
      ${s?c`<button class="primary save ${i?"dirty":""}" ?disabled=${!i||this.saving}
          title=${i?`Save (${oe}S). A save reaches the ${D(this.device)} the next time it checks.`:`Nothing to save (${oe}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?l:c`<span class="tb-saved" title=${i?"Unsaved changes":""}>${W(this.record,void 0,this.device)}</span>
        ${Lt(Mt({newWatch:this.newWatch,dirty:i,saving:this.saving}))}`}`:l}
      ${this.barActions}
    </div>`}renderSyncPill(e){let t=this.record;if(t===void 0||t.revision<=0||this.unsupported)return l;let s=e===void 0?{size:0,limit:1}:G(e.document),i=U({record:t,size:s.size,limit:s.limit,noun:"status pages",historyState:this.historyState,device:this.device});return c`<span class="tb-sync ${i.tone==="ok"?"ok":"warn"}" title=${`${i.state}. ${i.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${i.state}</span>
    </span>`}noRecordState(e=this.watches){return He(e.find(t=>t.owner_watch_id===this.watchId))}opensReady(e=this.watches){return Ot(this.noRecordState(e),"status_pages",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let t=this.canStartFresh();if(e===void 0&&!t)return l;let s=this.topMenuOpen,i=n=>()=>{this.topMenuOpen=!1,n()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?c`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${i(()=>this.discard())}>Discard edits</button>`:l}
        ${t?c`<button class="row" role="menuitem"
          @click=${i(()=>this.startFresh())}>${E}</button>`:l}
      </div>`:l}
    </span>`}colorOf(e){return Ve(Ge(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return l;let t=e.find(n=>n.owner_watch_id===this.watchId),s=this.watchMenuOpen,i=n=>{let a=n===void 0?void 0:this.colorOf(n);return c`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:l} aria-hidden="true">${b("watch")}</span>`};return c`<span class="picker sp-watch-picker">
      <button type="button" class="tb-browse sp-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose status pages are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${i(t?.owner_watch_id)}<span class="tb-browse-l">${t?I(t,e):"Choose a watch"}</span>
        <span class="sp-caret" aria-hidden="true">${b("chevron")}</span>
      </button>
      ${s?c`<div class="pop-menu sp-watch-menu" role="menu" aria-label="Watches">
        ${e.map(n=>{let a=n.owner_watch_id===this.watchId;return c`<button type="button" class="row sp-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(n.owner_watch_id)}}>
            ${i(n.owner_watch_id)}<span class="sp-watch-name">${I(n,e)}</span>
            <span class="sp-watch-check" aria-hidden="true">${a?b("check"):l}</span>
          </button>`})}
      </div>`:l}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=rs?this.columns:Fe(this.hostWidth-gs,this.columns,re)}renderGutter(e){return c`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the pages and rows column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${t=>{let s=this.fittedColumns();We(t,{side:e,base:e==="left"?s.left:s.right,limits:re,onWidth:i=>{this.columns={...this.columns,[e]:i}},onEnd:()=>z(he,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:de[e]},z(he,this.columns)}}></div>`}get stageScale(){return this.zoom??K(this.narrow||this.stacked)}setZoom(e){this.zoom=e,Kt(e)}renderStage(e,t){let s=t.find(T=>T.owner_watch_id===this.watchId),n=F(s?.screen_size)??q,a=e.phone!==void 0,p=e.phone===void 0?n.label:e.phone.model.label,h=[...es(e),p],f=T=>rt(a?T*ee:T),w=Zt(e),y=w===void 0?"Status pages":ht(w)||"Untitled page",x=this.draft,m=this.stageScale,ls=K(this.narrow||this.stacked);return c`<div class="card canvas-card lit sp-canvas" aria-label="Status page">
      <div class="cv-head">
        <span class="cv-title" title=${y}>${y}</span>
        ${s!==void 0?c`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${I(s,t)}</span></span>`:l}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${h.join(" \xB7 ")}><span class="fam">${h.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!x?.canUndo} title=${`Undo (${oe}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${b("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!x?.canRedo} title=${cs?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${b("redo")}</button>
        </span>
      </div>
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <button class="tb sp-case" aria-disabled="true" tabindex="-1" title=${a?Ct:`This watch's screen, ${n.label}.`}>
            ${b(a?"phone":"watch")}<span class="word keep">${p}</span></button>
          <span class="tb-sep" aria-hidden="true"></span>
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${m<=Z(m)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(Z(m))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${f(m)}. Back to fit`}
              title=${`The ${a?"iPhone":"watch"} at ${f(m)} of its own points. Click to fit it again (${f(ls)}).`}
              @click=${()=>this.setZoom(void 0)}>${f(m)}</button>
            <button class="tb icon" ?disabled=${m>=j(m)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(j(m))}>+</button>
          </span>
        </div>
        <div class="sp-stage-body">${Qt(e)}</div>
        <div class="under"><span class="tail">${jt}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0){let h=this.owners.length===0&&this.ownList===void 0;return c`<div class="pe-empty">${h?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return c`<div class="pe-empty"><b>${X}</b></div>`;if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let h=this.watchId;return c`<div class="pe-empty">
        <span>Could not read this ${D(this.device)}'s status pages: ${this.loadError}</span>
        ${h===void 0?l:c`<button class="pe-btn" @click=${()=>{this.load(h)}}>Try again</button>`}
      </div>`}let t=this.record;if(t===void 0)return c`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&t.revision>0)return c`<div class="pe-empty"><b>${X}</b></div>`;if(s===void 0){let h=this.watchId===void 0?void 0:k(this.watchId),f=this.watchId;return c`<div class="pe-empty"><b>${Ce("status pages",this.device)}</b><span>${Oe}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${E}</button>
        ${h?.dirty&&f!==void 0?c`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when status pages are here again.</span>
          <button class="pe-btn" @click=${()=>{M(f),this.requestUpdate()}}>Discard the kept edits</button>`:l}
      </div>`}let i=this.viewHost();if(i===void 0)return c`<div class="pe-empty">Loading…</div>`;let n=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",p=t.revision<=0;return c`${p&&this.barHost===void 0?Nt(this.device):l}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${n.left}px;--wa-right:${n.right}px;${a}`}>
      <div class="column left">
        ${Yt(i)}
        ${Jt(i)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(i,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${ts(i)}
      </div>
    </div>
    ${p?l:this.renderFoot(t,s.document,s.dirty)}`}renderFoot(e,t,s){let i=G(t),n=U({record:e,size:i.size,limit:i.limit,noun:"status pages",historyState:this.historyState,device:this.device}),a=this.watchId;return c`${Xe({status:n,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Je({noun:"status pages",device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:p=>{this.historyOpen=!1,this.askRestore(p)},onClosed:()=>{this.historyOpen=!1}}):l}
    ${this.rawOpen?Qe({noun:"status pages",document:t,revision:e.revision,dirty:s,copied:this.rawCopied,onCopy:p=>{tt(p).then(h=>{this.rawCopied=h})},onClosed:()=>{this.rawOpen=!1}}):l}`}renderRestoreAsk(e){let t=this.record,s=ms(e.entry.updated_at);return c`<dialog class="pe-ask" aria-labelledby="sp-ask-title"
      @cancel=${i=>{this.restoring&&i.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="sp-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${Re(e.entry.updated_by,this.device)}${s?` ${s}`:""}, ${ws(e.entry.size)}.</p>
      ${e.summary?c`<p class="pe-muted">${e.summary}</p>`:l}
      <p>It is saved again as a new revision${t?`, after revision ${t.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[De,ye,ke,xe,Se,$e,Pe,Te,dt,_t,Et,ce`
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
  `,ss,Pt,st,Ee]}};d([g({attribute:!1})],r.prototype,"hass",2),d([g({attribute:!1})],r.prototype,"owners",2),d([g({attribute:!1})],r.prototype,"ownerId",2),d([g({type:Boolean,reflect:!0})],r.prototype,"narrow",2),d([g({attribute:!1})],r.prototype,"icons",2),d([g({attribute:!1})],r.prototype,"iconsTick",2),d([g({attribute:!1})],r.prototype,"haMenu",2),d([g({attribute:!1})],r.prototype,"onHaMenu",2),d([g({attribute:!1})],r.prototype,"onBack",2),d([g({attribute:!1})],r.prototype,"barActions",2),d([g({attribute:!1})],r.prototype,"shellOwnsWatch",2),d([g({attribute:!1})],r.prototype,"phones",2),d([g({attribute:!1})],r.prototype,"barHost",2),d([u()],r.prototype,"watchId",2),d([u()],r.prototype,"record",2),d([u()],r.prototype,"unsupported",2),d([u()],r.prototype,"loading",2),d([u()],r.prototype,"loadError",2),d([u()],r.prototype,"history",2),d([u()],r.prototype,"historyState",2),d([u()],r.prototype,"note",2),d([u()],r.prototype,"restoreAsk",2),d([u()],r.prototype,"restoring",2),d([u()],r.prototype,"historyOpen",2),d([u()],r.prototype,"rawOpen",2),d([u()],r.prototype,"rawCopied",2),d([u()],r.prototype,"ownList",2),d([u()],r.prototype,"places",2),d([u()],r.prototype,"elsewhere",2),d([u()],r.prototype,"elsewhereFacts",2),d([u()],r.prototype,"devicesMenu",2),d([u()],r.prototype,"devicesNote",2),d([u()],r.prototype,"elsewhereNote",2),d([u()],r.prototype,"linking",2),d([u()],r.prototype,"deleteAsk",2),d([u()],r.prototype,"deletingAll",2),d([u()],r.prototype,"topMenuOpen",2),d([u()],r.prototype,"watchMenuOpen",2),d([u()],r.prototype,"zoom",2),d([u()],r.prototype,"columns",2),d([u()],r.prototype,"hostWidth",2),d([u()],r.prototype,"hostHeight",2);customElements.get("wa-status-pages-editor")||customElements.define("wa-status-pages-editor",r);export{he as SP_COLUMNS_KEY,r as WaStatusPagesEditor};
