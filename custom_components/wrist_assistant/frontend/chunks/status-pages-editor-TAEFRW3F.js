import{a as Rt,b as _,c as G,d as _t,e as Y,f as Et,g as Nt,h as At}from"./chunk-3F5BMLNN.js";import{a as Ze,b as Je,c as Ge,d as Ye,e as Xe,f as We,g as Qe,h as Z,i as et,j as tt,k as it,l as st}from"./chunk-GJSNIVUN.js";import{a as ct,b as ht,c as ut,d as ft,e as bt,f as yt,g as wt,h as kt,i as St,j as $t,k as xt,l as Pt,m as Tt,n as Ot,o as It,p as Lt,q as Dt}from"./chunk-7XHFEING.js";import{a as Ct}from"./chunk-RTPTWMWI.js";import{c as J,d as gt}from"./chunk-PPAI5DJY.js";import{a as vt,b as mt}from"./chunk-DOK7H7J7.js";import{A as Ve,B as j,C as V,a as qe,b as je,z as q}from"./chunk-43W2BEDP.js";import{B as E,C as O,D as jt,F as Vt,G as Zt,H as Q,J as Jt,L as Gt,M as Yt,r as X,s as W,t as Mt,u as Kt,v as Ft,w as Ut,x as Bt,y as zt,z as qt}from"./chunk-P23SS3RG.js";import{p as at,q as ot,r as dt,t as pt,y as lt}from"./chunk-7ZGLHFU7.js";import"./chunk-DTH6KV27.js";import{a as U,o as B,q as z,s as R,y as ze}from"./chunk-U4FQSLWM.js";import{a as Fe,b as Ue}from"./chunk-TGXPCNQ6.js";import{I as nt,K as rt,e as Be}from"./chunk-7I2PKYAI.js";import"./chunk-RYWHRF2L.js";import{q as we}from"./chunk-YSCV5IM3.js";import{c as De,e as Ce,f as F,g as Re}from"./chunk-C6K36PU4.js";import{d as Ee,e as Ne,g as Ae}from"./chunk-FABGRXEW.js";import{E as C,b as _e,c as He,qb as Me,rb as Ke,z as x}from"./chunk-ZYBUWHUS.js";import{M as Ht}from"./chunk-23RZUKO6.js";import{j as be}from"./chunk-TOKIRHDQ.js";import"./chunk-HM4DMQ4B.js";import"./chunk-4ILUENBV.js";import"./chunk-KPTLMLXT.js";import{i as ye}from"./chunk-PWVBP3GH.js";import{Ah as he,Bh as ue,Cg as ae,b as m,c as f,cg as re,oh as oe,ph as S,th as de,vh as pe,wh as le,zh as ce}from"./chunk-NPUC537M.js";import{$ as T,A as Ie,W as Le,X as w,_ as K,ca as D,l as M,n as I,o as $,p as $e,q as xe,t as L,w as Pe,x as Te,y as Oe}from"./chunk-5LB7PZLF.js";import{a as ke}from"./chunk-ATGCOJRY.js";import{b as Se}from"./chunk-KXNSKFVY.js";import"./chunk-TCVAOGAG.js";import{Gb as me,Hb as H,Kb as ge,fa as fe,ia as ve}from"./chunk-QHQZPGTZ.js";import{b as se,f as o,i as u,l as ne}from"./chunk-6ZDBXU6B.js";import{a as d}from"./chunk-LO2NM3CE.js";function ei(r){return r.name.trim()===""?"a status page":`"${r.name}"`}function N(r){if(r.length===0)return"";let v=r.map(ei);return`Another save also changed ${v.length===1?v[0]:`${v.slice(0,-1).join(", ")} and ${v[v.length-1]}`}. ${v.length===1?"That save's version was kept.":"That save's versions were kept."}`}function Xt(r){return r.ok?ge(ti(r),r.linkFailures,"status pages"):ii(r)}function ti(r){let v=r.kept??[];if(r.alreadySaved===!0){let e=v.length>0?` ${N(v)}`:"";return{kind:v.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${r.revision}.${e}`}}return v.length>0?{kind:"warn",text:`Saved. ${N(v)}`}:r.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}function ii(r){let v=(r.message??"").trim();switch(r.code){case"conflict":return{kind:"warn",text:"Not saved. The status pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds status pages for this watch. Your edits are kept, so save again."};case"invalid":{let e=r.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the status pages is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the status pages${v===""?".":`: ${v}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${me}`};case"busy":return{kind:"warn",text:"Already saving these status pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${v===""?".":`: ${v}`}`}}}Ht({dirty:Y,unsent:Et,savesDone:Nt,drop:At});typeof window<"u"&&window.addEventListener("beforeunload",r=>{Y()&&(r.preventDefault(),r.returnValue="")});var ee={min:280,max:720,middleMin:320},te={left:0,right:372},ie="wrist-assistant-panel.status-pages.columns.v2",si=12,Wt=820,ni=76;function ri(r){return H(r).message}function ai(r){return H(r).code}function oi(r){return r instanceof HTMLElement?Ne(r.tagName,r instanceof HTMLInputElement?r.type:void 0,r.isContentEditable):!1}function di(){let r=document.activeElement;for(;r?.shadowRoot?.activeElement;)r=r.shadowRoot.activeElement;return r===null||r===document.body||r===document.documentElement}var a=class extends ne{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=u;this.phones=!1;this.libraryItem=void 0;this.previewSettled=!1;this.loading=!1;this.lib=new at(this,()=>this.hass,()=>this.linkDevices.map(e=>e.ownerId));this.deletingAll=!1;this.topMenuOpen=!1;this.pickerOpen=!1;this.pickerFind="";this.pickerBusy=!1;this.helpOn=Tt();this.zoom=Ze();this.stageFit=new Ct(this,".sp-stage-body",()=>this.stageScale);this.columns={...te};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.symbols=new _e(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.previewKind="watch";this.sideBySide=!1;this.configSummarySeq=0;this.onReconnect=()=>{let e=this.recordKey;!this.isConnected||e===void 0||(this.load(e,!0),this.readConfigSummary())};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let t=e.composedPath();if(!t.includes(this)&&!di()||this.renderRoot.querySelector("dialog[open]"))return;let i=e.metaKey||e.ctrlKey,s=e.key.toLowerCase();if(i&&!e.altKey&&s==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.pickerOpen){e.preventDefault(),this.closePicker(!0);return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(!oi(t[0])){if(i&&!e.altKey&&s==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&s==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!i&&!e.altKey){let n=this.viewHost();n!==void 0&&Xe(n)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.pickerOpen)return;let t=e.composedPath(),i=s=>t.some(n=>n instanceof HTMLElement&&n.classList.contains(s));this.pickerOpen&&!i("pe-pp-wrap")&&this.closePicker(!1),this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1)};this.addEventListener(Me,this.onScrubStart),this.addEventListener(Ke,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return fe(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get draft(){let e=this.recordKey,t=this.record;if(e===void 0||t===void 0||t.revision<=0)return;let i=_(e);if(i!==void 0)return i;let s=M(t.document);return s===void 0?void 0:G(e,s,t.revision).draft}get recordKey(){return this.libraryItem===void 0?void 0:X(this.libraryItem)}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Ce(ie,te,ee),this.watchSize(),this.listenForReconnect(),this.openedItem!==void 0&&this.openItem(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.stopDeliveries?.(),this.stopDeliveries=void 0,this.loadSeq++}willUpdate(e){this.hass&&(e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,re(this.hass).then(t=>{this.ownList=t.owners},()=>{this.ownList=[]})),this.libraryItem!==void 0&&this.followLibraryItem(this.libraryItem)),this.followSave()}updated(){let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;if(e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),this.focusAfter!==void 0){let t=this.focusAfter;this.focusAfter=void 0,this.renderRoot.querySelector(t)?.focus()}this.observeTop()}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let t of e){if(t.target!==this){this.measureTop(t.target);continue}let i=t.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width),Math.abs(i.height-this.hostHeight)>=1&&(this.hostHeight=i.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let t=this.renderRoot?.querySelector(".pe-top")??void 0;t!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=t,t!==void 0&&e.observe(t))}measureTop(e){let t=e.offsetHeight;t!==this.topHeight&&(this.topHeight=t,this.style.setProperty("--pe-top-h",`${t}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followLibraryItem(e){let t=O(this.lib.library,e);(!W(e,this.openedItem)||!this.previewSettled)&&(this.previewKind=jt(this.watches,e,t),this.sideBySide=Vt(this.watches,t,this.phones),this.previewSettled=t!==void 0);let i=E(this.watches,this.previewKind,[e.from,...t??[]]);if(i!==this.watchId&&(this.watchId=i),this.stopDeliveries===void 0&&this.hass!==void 0&&this.isConnected&&(this.stopDeliveries=ht(this.hass,"status_pages",()=>{this.readConfigSummary()})),!W(e,this.openedItem)){this.openedItem=e,this.openItem(),this.readConfigSummary();return}let s=Ft(this.lib.library,e),n=this.record?.revision;s!==void 0&&n!==void 0&&s>n&&s!==this.followedRevision&&(this.followedRevision=s,this.load(X(e),!0))}async readConfigSummary(){let e=this.hass;if(e===void 0||this.libraryItem===void 0)return;let t=++this.configSummarySeq;try{let i=await ae(e);t===this.configSummarySeq&&(this.configSummary=i)}catch{t===this.configSummarySeq&&(this.configSummary=void 0)}}pickPreview(e,t=!1){this.sideBySide=t,e!==this.previewKind&&(this.previewKind=e,this.watchId=E(this.watches,e,[this.libraryItem?.from,...O(this.lib.library,this.libraryItem)??[]]))}openItem(e=!1){let t=this.recordKey;t!==void 0&&(e||(this.reloadPending=!1,this.note=void 0,this.endScrub(),this.uiState.clear(),this.closeDelete(),this.followedRevision=void 0,this.renaming=void 0,this.pickerOpen=!1,this.pickerFind=""),this.load(t,e))}followSave(){let e=this.recordKey;if(e===void 0)return;let t=_(e)?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let i=()=>this.saveEnded(e);t.then(i,i)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.recordKey?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}async load(e,t=!1){let i=this.hass,s=this.libraryItem;if(!i||s===void 0)return;if(t&&this.holdReload){this.reloadPending=!0;return}let n=++this.loadSeq;t||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let l=await Mt(i,s);if(n!==this.loadSeq)return;if(t&&this.holdReload){this.reloadPending=!0;return}this.show(l),this.loadError=void 0}catch(l){if(n!==this.loadSeq)return;t||(this.loadError=we(l))}this.loading=!1}get linkDevices(){return ke(this.owners.length>0?this.owners:this.ownList??[],this.phones)}flushPending(){let e=this.recordKey;!this.reloadPending||this.holdReload||e===void 0||(this.reloadPending=!1,this.load(e,!0))}show(e){let t=this.recordKey;this.record=e;let i=e.revision>0?M(e.document):void 0;if(t===void 0||i===void 0)return;let s=G(t,i,e.revision);s.kept.length>0?this.note={kind:"warn",text:N(s.kept)}:s.mergedIntoEdits&&(this.note={kind:"warn",text:"The status pages changed somewhere else. Your edits are kept."}),this.requestUpdate()}edit(e,t){let i=this.draft;if(!i||this.saving)return!1;let s=i.apply(e(i.document),this.scrubKey??t);return this.requestUpdate(),s}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??Ee,t=this.iconMemo;if(t!==void 0&&t.provider===e&&t.tick===this.iconsTick)return t.icons;let i=Ae(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:i},i}screen(){let e=this.phoneLayout();if(e!==void 0)return z(e);let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return(C(t?.screen_size)??x).screen}phoneLayout(){if(this.previewKind!=="iphone")return;let e=this.watches.find(t=>t.owner_watch_id===this.watchId);return B(U(e?.screen_size))}viewHost(){let e=this.draft,t=this.hass;if(e===void 0||t===void 0)return;let i=this;return{hass:t,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*R,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},get document(){return e.document},get busy(){return i.saving},helpOn:this.helpOn,deletePage:s=>this.askDelete(s),pageHead:this.renderPageHead(),edit:(s,n)=>this.draft===e&&this.edit(s,n),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}renderPageHead(){let e=this.draft===void 0?void 0:this.shownPage(),t=this.lib.library;return o`${e===void 0?u:yt(this.nameField(e))}${this.renderDevicesCard()}
      ${t===void 0?u:nt(this.hass,this.owners.length>0?this.owners:this.ownList??[],t,"status_pages")}`}shownPage(){let e=this.draft;return e===void 0?void 0:Ye({uiState:this.uiState,document:e.document})}nameField(e){let t=I(e),i=this.renaming!==void 0&&w(this.renaming.pageId,t)?this.renaming.value:void 0;return{name:$(e),typed:i,label:"Status page name",placeholder:"Page name",disabled:this.saving,onInput:s=>{this.renaming={pageId:t,value:s}},onCommit:()=>this.commitRename(),onCancel:()=>{this.renaming=void 0}}}leave(){let e=this.saving?this.draft?.saveDone:void 0;if(e===void 0){this.onBack?.();return}let t=()=>this.onBack?.();e.then(t,t)}writeTypedName(){let e=this.renaming;if(e===void 0)return!1;this.renaming=void 0;let t=e.value.trim(),i=L(this.draft?.document,e.pageId);return i===void 0||t===""||t===$(i)?!1:(this.draft?.endCoalesce(),this.edit(s=>Ie(s,e.pageId,t)))}commitRename(){let e=this.draft?.dirty===!1;this.writeTypedName()&&e&&this.save()}togglePicker(){if(this.pickerOpen){this.closePicker(!0);return}this.topMenuOpen=!1,this.pickerOpen=!0,this.pickerFind="",this.focusAfter=".pe-pp-find"}closePicker(e){this.pickerOpen&&(this.pickerOpen=!1,e&&(this.focusAfter=".pe-pp"))}openPickedPage(e){if(this.closePicker(!1),this.libraryItem!==void 0&&w(e,this.libraryItem.id)){this.focusAfter=".pe-pp";return}this.onOpenItem?.(e)}pickerMakeRefusal(){if(this.lib.store===void 0)return"The library is not read yet.";if(this.hass?.user?.is_admin!==!0)return"Only an administrator can make a status page.";if(this.pickerBusy)return"Making the status page\u2026"}async newPickedPage(){let e=this.lib.library,t=Pe({schemaVersion:1,statusPages:e===void 0?[]:K(e,"status_pages").map(i=>i.item)});await this.makeLibraryPage(Te(t,Se().toUpperCase()),"Not made")}async duplicatePage(){this.writeTypedName();let e=this.shownPage();e!==void 0&&await this.makeLibraryPage(Oe(e,`${$(e)} copy`),"Not copied")}async makeLibraryPage(e,t){let i=this.lib.store;if(i===void 0||this.pickerMakeRefusal()!==void 0)return;this.pickerBusy=!0;let s=await i.createItem("status_pages",{schemaVersion:1,statusPages:[e]});if(this.pickerBusy=!1,!s.ok){this.note={kind:"err",text:`${t}. ${s.text}`};return}this.pickerOpen=!1,this.onOpenItem?.(s.reply.id)}deviceName(e){return this.linkDevices.find(t=>w(t.ownerId,e))?.name??"the other device"}statusTickLocked(e,t){let i=this.lib.library;if(i!==void 0&&D(i,"status_pages",e).some(n=>w(n,t))&&(_(t)?.dirty??!1))return vt(this.deviceName(t))}renderBarTicks(e){let t=this.lib.library,i=this.libraryItem;if(t===void 0||e===void 0||i===void 0)return u;let s=T(t,"status_pages",i.id)?.owners.length??0;return o`<span class="pe-bar-div" aria-hidden="true"></span>
      <div class="pe-bar-on ${s===0?"none":""}" role="group" aria-label=${Jt("status_pages")}>
        ${this.statusTicksBody(e)}${Gt(this.lib.store?.savedStamp("status_pages",i.id))}
      </div>`}statusTicksBody(e){let t=this.lib.library,i=this.lib.store,s=t===void 0?void 0:T(t,"status_pages",I(e));if(t===void 0||i===void 0||s===void 0)return o`<p class="sp-lib-hint">${mt("status_pages")}</p>`;let n=i.noteFor("status_pages",s.id),l=this.hass?.user?.is_admin,c=this.untickAsk,h=c!==void 0&&c.kind==="status_pages"&&w(c.itemId,s.id)?c:void 0;return pt({library:t,kind:"status_pages",itemId:s.id,devices:this.linkDevices,lead:s.owners.length===0?wt:ot,saves:dt,...this.libraryItem?.from===void 0?{}:{viewing:this.libraryItem.from},colorOf:g=>this.colorOf(g),pending:i.pending,...n===void 0?{}:{note:n},...l===void 0?{}:{admin:l},locked:g=>this.statusTickLocked(s.id,g),...h===void 0?{}:{ask:{ownerId:h.ownerId,text:h.text,onRemove:()=>{this.untickNow(h)},onCancel:()=>{this.untickAsk=void 0}}}},(g,b)=>this.tickStatusPage(s,g,b))}tickStatusPage(e,t,i){let s=this.lib.store;if(s===void 0)return;this.untickAsk=void 0;let n={item:e.name,device:this.deviceName(t)};if(i){if(!rt(this.owners.length>0?this.owners:this.ownList??[],this.lib.library,t,"status_pages"))return;J(this.hass,s,t,"status_pages",e.id,!0,n);return}gt(this.hass,s,t,"status_pages",e.id,n).then(l=>{this.untickAsk=l})}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let i,s=await J(this.hass,t,e.ownerId,e.kind,e.itemId,!1,e.names,{onUndone:()=>{i!==void 0&&this.note===i&&(this.note=void 0)}});s.note!==void 0&&(i=s.note,this.note=i)}askDelete(e){L(this.draft?.document,e)===void 0||this.saving||(this.deleteAsk={pageId:e})}closeDelete(){this.renderRoot?.querySelector("dialog.sp-del-ask")?.close(),this.deleteAsk=void 0}deleteFromLibrary(){let e=this.deleteAsk,t=this.lib.store,i=this.recordKey;if(!e||t===void 0||i===void 0||this.deletingAll)return;let s=t.library,n=(s===void 0?void 0:T(s,"status_pages",e.pageId)?.name)??"the status page";this.closeDelete(),t.deleteItemLater("status_pages",e.pageId,`Deleted ${n}.`,async()=>{_t(i)}),this.onBack?.()}renderDeleteAsk(e){let t=L(this.draft?.document,e.pageId),i=this.libraryItem?.from;if(t===void 0)return u;let s=this.deletingAll,n=this.lib.library===void 0?[]:D(this.lib.library,"status_pages",e.pageId),l=this.lib.library===void 0?void 0:T(this.lib.library,"status_pages",e.pageId),c=i!==void 0&&l!==void 0&&n.length>1&&n.some(h=>w(h,i))?i:void 0;return o`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
      @cancel=${h=>{s&&h.preventDefault()}}
      @close=${()=>{this.deletingAll||(this.deleteAsk=void 0)}}>
      <h3 id="sp-del-title">${Ut($e(t))}</h3>
      <p>${qt(n.length,c===void 0?void 0:this.deviceName(c))}</p>
      <div class="pe-ask-foot sp-del-foot">
        <button class="pe-btn" ?disabled=${s} @click=${()=>this.closeDelete()}>Cancel</button>
        ${c===void 0||l===void 0?u:o`<button class="pe-btn pe-danger sp-del-here" ?disabled=${s||this.saving}
          title=${`Take it off ${this.deviceName(c)} only`}
          @click=${()=>{this.closeDelete(),this.tickStatusPage(l,c,!1)}}>${Bt}</button>`}
        <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${s||this.saving}
          @click=${()=>{this.deleteFromLibrary()}}>${s?"Deleting\u2026":n.length>1?zt:"Delete"}</button>
      </div>
    </dialog>`}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,t=this.recordKey,i=this.libraryItem;this.endScrub(),this.writeTypedName();let s=this.draft;if(!e||t===void 0||i===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let n=Rt(s,Kt(e,this.lib.store,i));this.followedSave=s.saveDone,this.requestUpdate();let l=await n.catch(c=>({ok:!1,revision:s.revision,merged:!1,code:ai(c)??"unknown",message:ri(c)}));this.saveEnded(t),l.ok&&this.readConfigSummary(),t===this.recordKey&&(this.note=Xt(l))}render(){let e=this.draft;return o`
      <div class="pe-top">
        ${this.renderTopBar(e)}
        ${this.note?o`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:u}
      </div>
      ${this.renderBody()}
      ${this.deleteAsk?this.renderDeleteAsk(this.deleteAsk):u}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Wt}renderTopBar(e){let t=e===void 0||this.loading||this.loadError!==void 0||this.record===void 0?void 0:this.shownPage();return o`<div class="wa-bar pe-bar" role="group" aria-label="Status page editor">
      ${this.haMenu?o`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${S("menu")}</button>`:u}
      <button type="button" class="tb-btn tb-back pe-bar-back" title="Back to the Status pages board" @click=${()=>this.leave()}>${S("left")}<span>All status pages</span></button>
      ${t===void 0?u:o`<span class="pe-bar-div" aria-hidden="true"></span>
        ${this.renderPagePicker(t)}
        ${this.renderBarTicks(t)}`}
      <span class="spacer"></span>
      <div class="pe-bar-right">
        <span class="pe-bar-div" aria-hidden="true"></span>
        ${e===void 0?u:o`${xt({canUndo:e.canUndo,canRedo:e.canRedo,onUndo:()=>this.undo(),onRedo:()=>this.redo()})}
          ${Pt({dirty:e.dirty,saving:this.saving,reach:"A save reaches every device that has this status page.",onSave:()=>{this.save()}})}`}
        ${this.renderTopMenu(e)}
        ${It(this.helpOn,()=>{this.helpOn=!this.helpOn,Ot(this.helpOn)})}
        ${this.barActions}
      </div>
    </div>`}renderPagePicker(e){let t=$(e)||"Untitled page",i=xe(e).length,s=this.pickerOpen;return o`<div class="pe-pp-wrap">
        ${St({open:s,title:"Pick a status page to edit, or make one",label:`Switch status page. Editing ${t}`,onClick:()=>this.togglePicker()})}
        ${s?this.renderPickerPopover(e):u}
      </div>
      ${bt(this.nameField(e))}
      ${$t(`${i} ${i===1?"row":"rows"}`,"One status page for every device that has it. A save reaches all of them.")}`}renderPickerPopover(e){let i=this.libraryItem?.id??I(e),s=this.lib.library,n=s===void 0?[]:K(s,"status_pages"),l=p=>kt(p.map(y=>this.deviceName(y))),c={id:i,page:e,name:$(e)||"Untitled page",sub:l(s===void 0?[]:D(s,"status_pages",i))},h=n.map(p=>w(p.id,i)?c:{id:p.id,page:p.item,name:p.name,sub:l(p.owners)});h.includes(c)||h.unshift(c);let g=this.pickerFind.trim().toLowerCase(),b=g===""?h:h.filter(p=>p.name.toLowerCase().includes(g)),k=this.pickerMakeRefusal(),P=this.hass,A=ni/x.screen.width;return o`<div class="pe-pp-pop" role="dialog" aria-label="Switch status page">
      <div class="pe-pp-top">
        <strong>Pick a status page to edit</strong>
        <span class="pe-pp-count">${h.length} ${h.length===1?"status page":"status pages"}</span>
        <input type="search" class="pe-pp-find" placeholder="Find a status page" aria-label="Find a status page" .value=${be(this.pickerFind)}
          @input=${p=>{this.pickerFind=p.target.value}} />
      </div>
      <div class="pe-pp-grid" role="group" aria-label="Status pages">
        ${He(b,p=>p.id.toUpperCase(),p=>{let y=w(p.id,i);return o`<button type="button" class="pe-pp-card ${y?"on":""}" data-pick-page=${p.id}
            aria-current=${y?"true":"false"} title=${y?`Editing ${p.name}`:`Open ${p.name}`}
            @click=${()=>this.openPickedPage(p.id)}>
            <span class="sp-pp-pic" aria-hidden="true">${P===void 0?u:et({page:p.page,hass:P,icons:this.memoIcons(),screen:x.screen,scale:A})}</span>
            <span class="pe-pp-card-name">${p.name}</span>
            <span class="pe-pp-card-sub">${p.sub}</span>
            ${y?o`<span class="pe-pp-tag">Editing</span>`:u}
          </button>`})}
        <button type="button" class="pe-pp-card pe-pp-new" ?disabled=${k!==void 0}
          title=${k??"An empty status page in the library, on no device yet"} @click=${()=>{this.newPickedPage()}}>
          <span class="pe-pp-plus" aria-hidden="true">${S("plus")}</span><span class="pe-pp-card-name">New status page</span>
        </button>
      </div>
      ${b.length===0?o`<p class="pe-pp-none">No status page's name has "${this.pickerFind.trim()}" in it.</p>`:u}
      <div class="pe-pp-foot">
        <button type="button" class="pe-btn pe-pp-dup" ?disabled=${k!==void 0}
          title=${k??"A copy of this status page as it is now, in the library, on no device yet"}
          @click=${()=>{this.duplicatePage()}}>${S("duplicate")}<span>Duplicate</span></button>
        <button type="button" class="pe-link pe-pp-board" @click=${()=>{this.closePicker(!1),this.onBack?.()}}>Open the Status pages board</button>
      </div>
    </div>`}renderTopMenu(e){if(e===void 0)return u;let t=this.topMenuOpen,i=h=>()=>{this.topMenuOpen=!1,h()},s=t?this.viewHost():void 0,n=this.watches.find(h=>h.owner_watch_id===this.watchId),l=s?.phone===void 0?(C(n?.screen_size)??x).label:s.phone.model.label,c=s===void 0?[]:[...tt(s),l];return o`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${t?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!t}}>···</button>
      ${t?o`<div class="pop-menu side-pop pe-menu" role="menu" aria-label="More actions">
        ${c.length===0?u:o`<div class="pe-menu-facts">
          ${n===void 0?u:o`<b class="pe-watch-crumb">${ve(n,this.watches)}</b>`}
          <span>${c.join(" \xB7 ")}</span>
        </div>`}
        <button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${i(()=>this.discard())}>Discard edits</button>
      </div>`:u}
    </span>`}colorOf(e){return Ue(Fe(this.owners.length>0?this.owners:this.ownList??[]),e)}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Wt?this.columns:{left:0,right:De(this.hostWidth-si,this.columns.right,ee)}}renderGutter(){return o`<div class="gutter right" role="separator" aria-orientation="vertical"
      aria-label="Resize the settings column"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${e=>{Re(e,{side:"right",base:this.fittedColumns().right,limits:ee,onWidth:t=>{this.columns={...this.columns,right:t}},onEnd:()=>F(ie,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,right:te.right},F(ie,this.columns)}}></div>`}get stageScale(){return this.zoom??this.stageFit.fit(q(this.narrow||this.stacked))}setZoom(e){this.zoom=e,Je(e)}renderStage(e){let t=e.phone!==void 0,i=t?"iPhone":"watch",s=h=>Ve(t?h*R:h),n=this.stageScale,l=this.zoom===void 0,c=this.stageFit.fit(q(this.narrow||this.stacked));return o`<div class="card canvas-card lit sp-canvas" aria-label="Status page">
      <div class="stage-area sp-stage-area">
        <div class="pe-stage-top">${We(e)}</div>
        ${this.helpOn?o`<div class="under"><span class="tail">${Ge}</span></div>`:u}
        <div class="sp-stage-body">${this.renderLibraryStage(e)}</div>
        ${Qe(e)}
        <div class="pe-dock-area">
          <div class="stage-tools pe-dock" role="toolbar" aria-label="Stage tools">
            <span class="tb-zoom" role="group" aria-label="Zoom">
              <button class="tb icon pe-zoom-out" ?disabled=${n<=V(n)} aria-label="Zoom out" title="Zoom out"
                @click=${()=>this.setZoom(V(n))}>−</button>
              <span class="pe-zoom-pct" role="status" title=${`The ${i} at ${s(n)} of its own points`}>${s(n)}</span>
              <button class="tb icon pe-zoom-in" ?disabled=${n>=j(n)} aria-label="Zoom in" title="Zoom in"
                @click=${()=>this.setZoom(j(n))}>+</button>
              <button class="tb pe-fit ${l?"lit":""}" aria-pressed=${l?"true":"false"}
                title=${l?`Fitting the ${i} to the stage (${s(c)})`:`Fit the ${i} to the stage again (${s(c)})`}
                @click=${()=>this.setZoom(void 0)}>Fit</button>
            </span>
            <span class="tb-sep" aria-hidden="true"></span>
            ${Lt({kind:this.previewKind,duo:this.sideBySide,phones:this.phones,onPick:h=>this.pickPreview(h),onBoth:()=>{this.sideBySide=!0}})}
          </div>
        </div>
      </div>
    </div>`}libraryNamesOf(e){let t=this.libraryItem;if(t===void 0)return[];let i=O(this.lib.library,t)??[];return this.linkDevices.filter(s=>s.kind===e&&i.some(n=>w(n,s.ownerId))).map(s=>s.name)}renderLibraryStage(e){let t=this.previewKind,i=(p,y,Qt)=>o`<div class="lib-duo-side ${p}">
      <span class="lib-duo-l" title=${Q(p,this.libraryNamesOf(p))}>${Q(p,this.libraryNamesOf(p))}<span class="lib-duo-tag">${Qt}</span></span>
      ${y}
    </div>`,s=Z(e);if(!this.sideBySide)return o`<div class="lib-duo">${i(t,s,"")}</div>`;let n=Zt(t),l=n==="watch"?"watch":"iPhone",c=this.libraryItem,h=E(this.watches,n,[c?.from,...c===void 0?[]:O(this.lib.library,c)??[]]),g=this.watches.find(p=>p.owner_watch_id===h),b=n==="iphone"?B(U(g?.screen_size)):void 0,k=b!==void 0?z(b):(C(g?.screen_size)??x).screen,P={...e,still:!0,screen:k,scale:b===void 0?this.stageScale:this.stageScale*R},A=b===void 0?(({phone:p,...y})=>y)(P):{...P,phone:b};return o`<div class="lib-duo">
      ${i(t,s,"editing")}
      ${i(n,o`<button type="button" class="lib-duo-other" title=${`Click to edit on the ${l}`} aria-label=${`Edit on the ${l}`}
        @click=${()=>this.pickPreview(n,!0)}>${Z(A)}</button>`,"preview")}
    </div>`}renderDevicesCard(){let e=this.libraryItem;if(e===void 0)return u;let t="status-pages",i="devices",s=qe(this.uiState,t,i),n=ct(this.lib.library,"status_pages",e.id,this.linkDevices,this.configSummary);return o`<div class="sp-devices">${ue({color:oe.place,icon:S("layers"),title:"On each device",open:s,onToggle:()=>{je(this.uiState,t,i,!s),this.requestUpdate()},...s?{}:{summary:n.length===0?"On no device yet":`${n.length} ${n.length===1?"device":"devices"}`},id:`${t}:${i}`},s?ut({kind:"status_pages",lines:n,colorOf:l=>this.colorOf(l),busy:!1,onHide:()=>{},...this.onOpenBoard===void 0?{}:{onOpenBoard:this.onOpenBoard}}):o``)}</div>`}renderBody(){if(this.loading)return o`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let n=this.recordKey;return o`<div class="pe-empty">
        <span>Could not read this status page: ${this.loadError}</span>
        ${n===void 0?u:o`<button class="pe-btn" @click=${()=>{this.load(n)}}>Try again</button>`}
      </div>`}if(this.record===void 0)return o`<div class="pe-empty">Loading…</div>`;if(this.draft===void 0)return o`<div class="pe-empty"><b>${Le}</b></div>`;let t=this.viewHost();if(t===void 0)return o`<div class="pe-empty">Loading…</div>`;let i=this.fittedColumns(),s=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"";return o`<div class="layout pe-layout ${this.stacked?"cols-1":"sp-wide"}" style=${`--wa-right:${i.right}px;${s}`}>
      <div class="column canvas">
        ${this.renderStage(t)}
      </div>
      ${this.renderGutter()}
      <div class="column inspector card">
        ${it(t)}
      </div>
    </div>`}static{this.styles=[ye,de,pe,le,ce,he,Be,ze,Dt,se`
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
    h3 { font-size: 13px; font-weight: 650; color: var(--wa-muted); }
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
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
    /* Two columns, the stage and the inspector, one screen tall, as the page
       editor: the editor never scrolls as a whole, and the stage and the
       inspector each scroll in their own box, so every card stays on screen. */
    .layout.pe-layout { padding: 0; align-items: stretch; }
    .layout.pe-layout.sp-wide {
      grid-template-columns: minmax(0, 1fr) 8px var(--wa-right, 372px); column-gap: 0;
      flex: 1 1 0; min-height: 0; overflow: hidden;
    }
    .pe-layout.sp-wide > .column.inspector { overflow-y: auto; overscroll-behavior: contain; }
    .pe-layout.sp-wide > .column.canvas { overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; overscroll-behavior: contain; }
    .pe-layout.sp-wide > .column.canvas > .card.canvas-card.sp-canvas { flex: 1 1 0; min-height: 420px; }
    .pe-layout.sp-wide .sp-canvas > .sp-stage-area { flex: 1 1 0; min-height: 0; }
    .pe-layout.sp-wide .sp-stage-body { flex: 1 1 0; min-height: 0; overflow-y: auto; scrollbar-width: thin; overscroll-behavior: contain; }
    .pe-layout.sp-wide .sp-stage-area > :not(.sp-stage-body) { flex: none; }
    .layout.pe-layout.cols-1 { flex: none; min-height: auto; overflow: visible; }
    @container (max-width: 820px) {
      .layout.pe-layout { grid-template-columns: minmax(0, 1fr); }
      .pe-layout > .gutter { display: none; }
      /* As strong as the wide rules, so a stacked inspector stops sliding over
         the stage above it (the page editor's fix). */
      .pe-layout > .column.canvas, .pe-layout > .column.inspector { grid-column: auto; position: static; max-height: none; overflow: visible; }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
    }
    .column.canvas > .card.canvas-card.sp-canvas { min-height: 0; flex: none; }
    /* The lit stage's edge in Status pages' hue, Home's Status pages door. */
    .canvas-card.sp-canvas { --wa-stage-hue: var(--wa-hue-yellow); }
    .canvas-card.lit .stage-area.sp-stage-area { position: relative; padding: 14px 12px 14px; gap: 8px; }
    /* "safe": a watch wider than the stage starts at its left edge, so all
       of it can be scrolled to, instead of hanging off both sides. */
    .sp-stage-body { display: flex; justify-content: safe center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    /* A status page's picture on a switcher card: its top, cut at the card. */
    .sp-pp-pic { position: relative; display: block; flex: none; width: 76px; height: 96px; overflow: hidden; border-radius: 12px; box-shadow: 0 0 0 1px var(--wa-line-strong); pointer-events: none; }
    .sp-stage-area > .under {
      display: flex; flex-direction: column; gap: 4px; align-self: center; max-width: 460px; text-align: center;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
    }
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
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }
    /* The delete question's two long answers wrap under each other. */
    .pe-ask-foot.sp-del-foot { flex-wrap: wrap; }
    :host([narrow]) { --cf-pad: 12px; }
    /* On each device under the Name. */
    .sp-devices { margin-bottom: 10px; }
    .pe-chip:disabled { opacity: .55; cursor: default; }
  `,st,lt,Yt,ft]}};d([m({attribute:!1})],a.prototype,"hass",2),d([m({attribute:!1})],a.prototype,"owners",2),d([m({type:Boolean,reflect:!0})],a.prototype,"narrow",2),d([m({attribute:!1})],a.prototype,"icons",2),d([m({attribute:!1})],a.prototype,"iconsTick",2),d([m({attribute:!1})],a.prototype,"haMenu",2),d([m({attribute:!1})],a.prototype,"onHaMenu",2),d([m({attribute:!1})],a.prototype,"onBack",2),d([m({attribute:!1})],a.prototype,"barActions",2),d([m({attribute:!1})],a.prototype,"phones",2),d([m({attribute:!1})],a.prototype,"libraryItem",2),d([m({attribute:!1})],a.prototype,"onOpenItem",2),d([m({attribute:!1})],a.prototype,"onOpenBoard",2),d([f()],a.prototype,"watchId",2),d([f()],a.prototype,"record",2),d([f()],a.prototype,"loading",2),d([f()],a.prototype,"loadError",2),d([f()],a.prototype,"note",2),d([f()],a.prototype,"untickAsk",2),d([f()],a.prototype,"ownList",2),d([f()],a.prototype,"deleteAsk",2),d([f()],a.prototype,"deletingAll",2),d([f()],a.prototype,"topMenuOpen",2),d([f()],a.prototype,"renaming",2),d([f()],a.prototype,"pickerOpen",2),d([f()],a.prototype,"pickerFind",2),d([f()],a.prototype,"pickerBusy",2),d([f()],a.prototype,"helpOn",2),d([f()],a.prototype,"zoom",2),d([f()],a.prototype,"columns",2),d([f()],a.prototype,"hostWidth",2),d([f()],a.prototype,"hostHeight",2),d([f()],a.prototype,"previewKind",2),d([f()],a.prototype,"sideBySide",2),d([f()],a.prototype,"configSummary",2);customElements.get("wa-status-pages-editor")||customElements.define("wa-status-pages-editor",a);export{ie as SP_COLUMNS_KEY,a as WaStatusPagesEditor};
