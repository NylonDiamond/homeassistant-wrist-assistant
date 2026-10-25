import{a as ft,b as C,c as j,d as vt,e as V,f as mt}from"./chunk-KEDLPQFY.js";import{a as Fe,b as Be,c as qe,d as Ze,e as je,f as Ve,g as Ge,h as q,j as Ye,k as We,l as Je}from"./chunk-BGLW2TC6.js";import{a as tt,b as it,c as st,d as nt,e as rt,f as ot,g as at,h as dt,i as lt}from"./chunk-TNLX2YOD.js";import{a as ut}from"./chunk-ED3SLVEX.js";import{c as Z,d as pt}from"./chunk-AVYVHTDE.js";import{a as ct,b as ht}from"./chunk-OIWBI3PA.js";import{A as W,B as Dt,C as Ct,D as Rt,k as G,l as Y,m as bt,n as wt,o as yt,p as kt,q as St,r as xt,s as $t,u as R,v as T,w as Tt,x as Pt,y as Lt,z as It}from"./chunk-76C55SA4.js";import{F as A,Ga as Xe,H as Ee,I as Oe,Ia as Qe,J as _e,La as et,N as H,g as Ce,pa as Ae,qa as S,sa as He,ta as $,wa as K}from"./chunk-VIOWL4IR.js";import"./chunk-KVNYZGCV.js";import{a as N,n as M,p as z,r as D,v as Ne}from"./chunk-I6LK6VTA.js";import{a as Me,b as ze,s as U,t as Ue,u as F,v as B}from"./chunk-SF4C76H6.js";import{a as Re}from"./chunk-RD75ZRWH.js";import{b as we,d as ye,e as _,f as ke}from"./chunk-ZOJGMATP.js";import{a as Ie,b as De}from"./chunk-KTTPO24X.js";import{b as Ke}from"./chunk-I4QLCOSH.js";import{c as xe,d as $e,f as Te}from"./chunk-NZ5XCUZ3.js";import{Ab as Le,I as L,N as I,cd as gt,j as Se,zb as Pe}from"./chunk-ABAW2X3F.js";import{Ah as pe,Bh as ue,Hg as ne,Kh as fe,b as te,d,g as u,ig as se,j as ie,k as f,l as h,oh as re,ph as k,th as oe,vh as ae,wh as de,xh as le,yh as ce,zh as he}from"./chunk-G4INOZ6Q.js";import"./chunk-IAW54OVM.js";import"./chunk-VFWRBV7O.js";import"./chunk-Y7NZKWQC.js";import{$a as O,V as ve,Y as me,_a as ge,bb as be}from"./chunk-632WXOQ6.js";import{a}from"./chunk-LO2NM3CE.js";function Ht(r){return r.name.trim()===""?"a status page":`"${r.name}"`}function E(r){if(r.length===0)return"";let p=r.map(Ht);return`Another save also changed ${p.length===1?p[0]:`${p.slice(0,-1).join(", ")} and ${p[p.length-1]}`}. ${p.length===1?"That save's version was kept.":"That save's versions were kept."}`}function Et(r){return r.ok?be(Kt(r),r.linkFailures,"status pages"):Nt(r)}function Kt(r){let p=r.kept??[];if(r.alreadySaved===!0){let e=p.length>0?` ${E(p)}`:"";return{kind:p.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${r.revision}.${e}`}}return p.length>0?{kind:"warn",text:`Saved. ${E(p)}`}:r.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}function Nt(r){let p=(r.message??"").trim();switch(r.code){case"conflict":return{kind:"warn",text:"Not saved. The status pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds status pages for this watch. Your edits are kept, so save again."};case"invalid":{let e=r.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the status pages is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the status pages${p===""?".":`: ${p}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${ge}`};case"busy":return{kind:"warn",text:"Already saving these status pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${p===""?".":`: ${p}`}`}}}gt({dirty:V,drop:mt});typeof window<"u"&&window.addEventListener("beforeunload",r=>{V()&&(r.preventDefault(),r.returnValue="")});var _t=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),J=_t?"\u2318":"Ctrl+",X={min:200,max:720,middleMin:320},Q={left:280,right:340},ee="wrist-assistant-panel.status-pages.columns.v1",Mt=24,Ot=820;function zt(r){return O(r).message}function Ut(r){return O(r).code}function Ft(r){return r instanceof HTMLElement?$e(r.tagName,r instanceof HTMLInputElement?r.type:void 0,r.isContentEditable):!1}function Bt(){let r=document.activeElement;for(;r?.shadowRoot?.activeElement;)r=r.shadowRoot.activeElement;return r===null||r===document.body||r===document.documentElement}var o=class extends ie{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=u;this.phones=!1;this.libraryItem=void 0;this.previewSettled=!1;this.loading=!1;this.lib=new Xe(this,()=>this.hass,()=>this.linkDevices.map(e=>e.ownerId));this.deletingAll=!1;this.topMenuOpen=!1;this.zoom=Fe();this.stageFit=new ut(this,".sp-stage-body",()=>this.stageScale);this.columns={...Q};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.symbols=new Se(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.previewKind="watch";this.sideBySide=!1;this.listFilter="all";this.configSummarySeq=0;this.onReconnect=()=>{let e=this.recordKey;!this.isConnected||e===void 0||(this.load(e,!0),this.readConfigSummary())};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let t=e.composedPath();if(!t.includes(this)&&!Bt()||this.renderRoot.querySelector("dialog[open]"))return;let i=e.metaKey||e.ctrlKey,s=e.key.toLowerCase();if(i&&!e.altKey&&s==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(!Ft(t[0])){if(i&&!e.altKey&&s==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&s==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!i&&!e.altKey){let n=this.viewHost();n!==void 0&&je(n)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen)return;let t=e.composedPath();(s=>t.some(n=>n instanceof HTMLElement&&n.classList.contains(s)))("pe-top-menu")||(this.topMenuOpen=!1)};this.addEventListener(Pe,this.onScrubStart),this.addEventListener(Le,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return ve(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get draft(){let e=this.recordKey,t=this.record;if(e===void 0||t===void 0||t.revision<=0)return;let i=C(e);if(i!==void 0)return i;let s=A(t.document);return s===void 0?void 0:j(e,s,t.revision).draft}get recordKey(){return this.libraryItem===void 0?void 0:G(this.libraryItem)}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=ye(ee,Q,X),this.watchSize(),this.listenForReconnect(),this.openedItem!==void 0&&this.openItem(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.stopDeliveries?.(),this.stopDeliveries=void 0,this.loadSeq++}willUpdate(e){this.hass&&(e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,se(this.hass).then(t=>{this.ownList=t.owners},()=>{this.ownList=[]})),this.libraryItem!==void 0&&this.followLibraryItem(this.libraryItem)),this.followSave()}updated(){let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),this.observeTop()}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let t of e){if(t.target!==this){this.measureTop(t.target);continue}let i=t.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width),Math.abs(i.height-this.hostHeight)>=1&&(this.hostHeight=i.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let t=this.renderRoot?.querySelector(".pe-top")??void 0;t!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=t,t!==void 0&&e.observe(t))}measureTop(e){let t=e.offsetHeight;t!==this.topHeight&&(this.topHeight=t,this.style.setProperty("--pe-top-h",`${t}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followLibraryItem(e){let t=T(this.lib.library,e);(!Y(e,this.openedItem)||!this.previewSettled)&&(this.previewKind=Tt(this.watches,e,t),this.sideBySide=Lt(this.watches,t,this.phones),this.previewSettled=t!==void 0);let i=R(this.watches,this.previewKind,[e.from,...t??[]]);if(i!==this.watchId&&(this.watchId=i),this.stopDeliveries===void 0&&this.hass!==void 0&&this.isConnected&&(this.stopDeliveries=it(this.hass,"status_pages",()=>{this.readConfigSummary()})),!Y(e,this.openedItem)){this.openedItem=e,this.openItem(),this.readConfigSummary();return}let s=yt(this.lib.library,e),n=this.record?.revision;s!==void 0&&n!==void 0&&s>n&&s!==this.followedRevision&&(this.followedRevision=s,this.load(G(e),!0))}async readConfigSummary(){let e=this.hass;if(e===void 0||this.libraryItem===void 0)return;let t=++this.configSummarySeq;try{let i=await ne(e);t===this.configSummarySeq&&(this.configSummary=i)}catch{t===this.configSummarySeq&&(this.configSummary=void 0)}}pickPreview(e,t=!1){this.sideBySide=t,e!==this.previewKind&&(this.previewKind=e,this.watchId=R(this.watches,e,[this.libraryItem?.from,...T(this.lib.library,this.libraryItem)??[]]))}openItem(e=!1){let t=this.recordKey;t!==void 0&&(e||(this.reloadPending=!1,this.note=void 0,this.endScrub(),this.uiState.clear(),this.closeDelete(),this.followedRevision=void 0),this.load(t,e))}followSave(){let e=this.recordKey;if(e===void 0)return;let t=C(e)?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let i=()=>this.saveEnded(e);t.then(i,i)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.recordKey?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}async load(e,t=!1){let i=this.hass,s=this.libraryItem;if(!i||s===void 0)return;if(t&&this.holdReload){this.reloadPending=!0;return}let n=++this.loadSeq;t||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let l=await bt(i,s);if(n!==this.loadSeq)return;if(t&&this.holdReload){this.reloadPending=!0;return}this.show(l),this.loadError=void 0}catch(l){if(n!==this.loadSeq)return;t||(this.loadError=Ce(l))}this.loading=!1}get linkDevices(){return Re(this.owners.length>0?this.owners:this.ownList??[],this.phones)}flushPending(){let e=this.recordKey;!this.reloadPending||this.holdReload||e===void 0||(this.reloadPending=!1,this.load(e,!0))}show(e){let t=this.recordKey;this.record=e;let i=e.revision>0?A(e.document):void 0;if(t===void 0||i===void 0)return;let s=j(t,i,e.revision);s.kept.length>0?this.note={kind:"warn",text:E(s.kept)}:s.mergedIntoEdits&&(this.note={kind:"warn",text:"The status pages changed somewhere else. Your edits are kept."}),this.requestUpdate()}edit(e,t){let i=this.draft;if(!i||this.saving)return!1;let s=i.apply(e(i.document),this.scrubKey??t);return this.requestUpdate(),s}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??xe,t=this.iconMemo;if(t!==void 0&&t.provider===e&&t.tick===this.iconsTick)return t.icons;let i=Te(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:i},i}screen(){let e=this.phoneLayout();if(e!==void 0)return z(e);let t=this.watches.find(i=>i.owner_watch_id===this.watchId);return(I(t?.screen_size)??L).screen}phoneLayout(){if(this.previewKind!=="iphone")return;let e=this.watches.find(t=>t.owner_watch_id===this.watchId);return M(N(e?.screen_size))}viewHost(){let e=this.draft,t=this.hass;if(e===void 0||t===void 0)return;let i=this;return{hass:t,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*D,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},get document(){return e.document},get busy(){return i.saving},...this.libraryHost(),edit:(s,n)=>this.draft===e&&this.edit(s,n),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}libraryHost(){return{single:!0,deletePage:e=>this.askDelete(e),listTools:at(this.listFilter,e=>{this.listFilter=e},"status page"),elsewhere:this.renderLibraryOthers()}}deviceName(e){return this.linkDevices.find(t=>S(t.ownerId,e))?.name??"the other device"}statusTickLocked(e,t){let i=this.lib.library;if(i!==void 0&&K(i,"status_pages",e).some(n=>S(n,t))&&(C(t)?.dirty??!1))return ct(this.deviceName(t))}renderStageDevices(e){let t=this.lib.library,i=this.libraryItem;if(t===void 0||e===void 0||i===void 0)return u;let s=$(t,"status_pages",i.id)?.owners.length??0;return Ct("status_pages",s,this.statusTicksBody(e),this.lib.store?.savedStamp("status_pages",i.id))}statusTicksBody(e){let t=this.lib.library,i=this.lib.store,s=t===void 0?void 0:$(t,"status_pages",Ee(e));if(t===void 0||i===void 0||s===void 0)return d`<p class="sp-lib-hint">${ht("status_pages")}</p>`;let n=i.noteFor("status_pages",s.id),l=this.hass?.user?.is_admin,c=this.untickAsk,v=c!==void 0&&c.kind==="status_pages"&&S(c.itemId,s.id)?c:void 0;return Qe({library:t,kind:"status_pages",itemId:s.id,devices:this.linkDevices,...this.libraryItem?.from===void 0?{}:{viewing:this.libraryItem.from},colorOf:m=>this.colorOf(m),pending:i.pending,...n===void 0?{}:{note:n},...l===void 0?{}:{admin:l},locked:m=>this.statusTickLocked(s.id,m),...v===void 0?{}:{ask:{ownerId:v.ownerId,text:v.text,onRemove:()=>{this.untickNow(v)},onCancel:()=>{this.untickAsk=void 0}}}},(m,g)=>this.tickStatusPage(s,m,g))}tickStatusPage(e,t,i){let s=this.lib.store;if(s===void 0)return;if(this.untickAsk=void 0,i){Z(this.hass,s,t,"status_pages",e.id,!0);return}let n={item:e.name,device:this.deviceName(t)};pt(this.hass,s,t,"status_pages",e.id,n).then(l=>{this.untickAsk=l})}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let i=await Z(this.hass,t,e.ownerId,e.kind,e.itemId,!1,e.names);i.note!==void 0&&(this.note=i.note)}askDelete(e){H(this.draft?.document,e)===void 0||this.saving||(this.deleteAsk={pageId:e})}closeDelete(){this.renderRoot?.querySelector("dialog.sp-del-ask")?.close(),this.deleteAsk=void 0}deleteFromLibrary(){let e=this.deleteAsk,t=this.lib.store,i=this.recordKey;if(!e||t===void 0||i===void 0||this.deletingAll)return;let s=t.library,n=(s===void 0?void 0:$(s,"status_pages",e.pageId)?.name)??"the status page";this.closeDelete(),t.deleteItemLater("status_pages",e.pageId,`Deleted ${n}.`,async()=>{vt(i)}),this.onBack?.()}renderDeleteAsk(e){let t=H(this.draft?.document,e.pageId),i=this.libraryItem?.from;if(t===void 0)return u;let s=this.deletingAll,n=this.lib.library===void 0?[]:K(this.lib.library,"status_pages",e.pageId),l=this.lib.library===void 0?void 0:$(this.lib.library,"status_pages",e.pageId),c=i!==void 0&&l!==void 0&&n.length>1&&n.some(v=>S(v,i))?i:void 0;return d`<dialog class="pe-ask sp-del-ask" aria-labelledby="sp-del-title"
      @cancel=${v=>{s&&v.preventDefault()}}
      @close=${()=>{this.deletingAll||(this.deleteAsk=void 0)}}>
      <h3 id="sp-del-title">${kt(_e(t))}</h3>
      <p>${$t(n.length,c===void 0?void 0:this.deviceName(c))}</p>
      <div class="pe-ask-foot sp-del-foot">
        <button class="pe-btn" ?disabled=${s} @click=${()=>this.closeDelete()}>Cancel</button>
        ${c===void 0||l===void 0?u:d`<button class="pe-btn pe-danger sp-del-here" ?disabled=${s||this.saving}
          title=${`Take it off ${this.deviceName(c)} only`}
          @click=${()=>{this.closeDelete(),this.tickStatusPage(l,c,!1)}}>${St}</button>`}
        <button class="pe-btn pe-primary pe-danger sp-del-all" ?disabled=${s||this.saving}
          @click=${()=>{this.deleteFromLibrary()}}>${s?"Deleting\u2026":n.length>1?xt:"Delete"}</button>
      </div>
    </dialog>`}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,t=this.recordKey,i=this.libraryItem;this.endScrub();let s=this.draft;if(!e||t===void 0||i===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let n=ft(s,wt(e,this.lib.store,i));this.followedSave=s.saveDone,this.requestUpdate();let l=await n.catch(c=>({ok:!1,revision:s.revision,merged:!1,code:Ut(c)??"unknown",message:zt(c)}));this.saveEnded(t),l.ok&&this.readConfigSummary(),t===this.recordKey&&(this.note=Et(l))}render(){let e=this.watches,t=this.draft;return d`
      <div class="pe-top">
        ${this.renderTopBar(t)}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:u}
      </div>
      ${this.renderBody(e)}
      ${this.deleteAsk?this.renderDeleteAsk(this.deleteAsk):u}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Ot}renderTopBar(e){let t=e!==void 0,i=t&&this.dirty;return d`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Status page in the library">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${k("menu")}</button>`:u}
      <button class="tb-btn tb-back" title="Back to the Status pages tab" @click=${()=>this.onBack?.()}>${k("left")}<span>Status pages</span></button>
      ${Dt()}
      <span class="spacer"></span>
      ${this.renderTopMenu(t?e:void 0)}
      ${t?d`<button class="primary save ${i?"dirty":""}" ?disabled=${!i||this.saving}
          title=${i?`Save (${J}S). A save reaches every device that has this status page.`:`Nothing to save (${J}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>`:u}
      ${this.barActions}
    </div>`}renderTopMenu(e){if(e===void 0)return u;let t=this.topMenuOpen,i=s=>()=>{this.topMenuOpen=!1,s()};return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${t?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!t}}>···</button>
      ${t?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        <button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${i(()=>this.discard())}>Discard edits</button>
      </div>`:u}
    </span>`}colorOf(e){return De(Ie(this.owners.length>0?this.owners:this.ownList??[]),e)}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Ot?this.columns:we(this.hostWidth-Mt,this.columns,X)}renderGutter(e){return d`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the pages and rows column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${t=>{let i=this.fittedColumns();ke(t,{side:e,base:e==="left"?i.left:i.right,limits:X,onWidth:s=>{this.columns={...this.columns,[e]:s}},onEnd:()=>_(ee,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:Q[e]},_(ee,this.columns)}}></div>`}get stageScale(){return this.zoom??this.stageFit.fit(U(this.narrow||this.stacked))}setZoom(e){this.zoom=e,Be(e)}renderStage(e,t){let i=t.find(y=>y.owner_watch_id===this.watchId),n=I(i?.screen_size)??L,l=e.phone!==void 0,c=e.phone===void 0?n.label:e.phone.model.label,v=[...Ye(e),c],m=y=>Ue(l?y*D:y),g=Ze(e),P=g===void 0?"Status pages":Oe(g)||"Untitled page",x=this.draft,b=this.stageScale,w=this.stageFit.fit(U(this.narrow||this.stacked));return d`<div class="card canvas-card lit sp-canvas" aria-label="Status page">
      <div class="cv-head">
        <span class="cv-title" title=${P}>${P}</span>
        ${i!==void 0?d`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${me(i,t)}</span></span>`:u}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${v.join(" \xB7 ")}><span class="fam">${v.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!x?.canUndo} title=${`Undo (${J}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${k("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!x?.canRedo} title=${_t?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${k("redo")}</button>
        </span>
      </div>
      ${this.renderStageDevices(g)}
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          ${Pt(this.previewKind,y=>this.pickPreview(y),this.phones?{on:this.sideBySide,pick:()=>{this.sideBySide=!0}}:void 0)}<span class="tb-sep" aria-hidden="true"></span>
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${b<=B(b)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(B(b))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${m(b)}. Back to fit`}
              title=${`The ${l?"iPhone":"watch"} at ${m(b)} of its own points. Click to fit it again (${m(w)}).`}
              @click=${()=>this.setZoom(void 0)}>${m(b)}</button>
            <button class="tb icon" ?disabled=${b>=F(b)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(F(b))}>+</button>
          </span>
        </div>
        <div class="sp-stage-body">${this.renderLibraryStage(e)}</div>
        <div class="under"><span class="tail">${qe}</span></div>
      </div>
    </div>`}libraryNamesOf(e){let t=this.libraryItem;if(t===void 0)return[];let i=T(this.lib.library,t)??[];return this.linkDevices.filter(s=>s.kind===e&&i.some(n=>S(n,s.ownerId))).map(s=>s.name)}renderLibraryStage(e){let t=this.previewKind,i=(w,y,At)=>d`<div class="lib-duo-side ${w}">
      <span class="lib-duo-l" title=${W(w,this.libraryNamesOf(w))}>${W(w,this.libraryNamesOf(w))}<span class="lib-duo-tag">${At}</span></span>
      ${y}
    </div>`,s=q(e);if(!this.sideBySide)return d`<div class="lib-duo">${i(t,s,"")}</div>`;let n=It(t),l=n==="watch"?"watch":"iPhone",c=this.libraryItem,v=R(this.watches,n,[c?.from,...c===void 0?[]:T(this.lib.library,c)??[]]),m=this.watches.find(w=>w.owner_watch_id===v),g=n==="iphone"?M(N(m?.screen_size)):void 0,P=g!==void 0?z(g):(I(m?.screen_size)??L).screen,x={...e,screen:P,scale:g===void 0?this.stageScale:this.stageScale*D},b=g===void 0?(({phone:w,...y})=>y)(x):{...x,phone:g};return d`<div class="lib-duo">
      ${i(t,s,"editing")}
      ${i(n,d`<button type="button" class="lib-duo-other" title=${`Click to edit on the ${l}`} aria-label=${`Edit on the ${l}`}
        @click=${()=>this.pickPreview(n,!0)}>${q(b)}</button>`,"preview")}
    </div>`}renderDevicesCard(){let e=this.libraryItem;if(e===void 0)return u;let t="status-pages",i="devices",s=Me(this.uiState,t,i),n=tt(this.lib.library,"status_pages",e.id,this.linkDevices,this.configSummary);return d`<div class="sp-devices">${ue({color:re.place,icon:k("layers"),title:"On each device",open:s,onToggle:()=>{ze(this.uiState,t,i,!s),this.requestUpdate()},...s?{}:{summary:n.length===0?"On no device yet":`${n.length} ${n.length===1?"device":"devices"}`},id:`${t}:${i}`},s?st({kind:"status_pages",lines:n,colorOf:l=>this.colorOf(l),busy:!1,onHide:()=>{},...this.onOpenBoard===void 0?{}:{onOpenBoard:this.onOpenBoard}}):d``)}</div>`}renderLibraryOthers(){let e=this.libraryItem,t=this.lib.library;if(e===void 0||t===void 0)return d``;let s=rt(He(t,"status_pages"),e.id,this.listFilter).filter(n=>!S(n.id,e.id));return d`${s.length===0?u:d`<div class="layers sp-page-list sp-lib-others" role="list">
      ${s.map(n=>d`<button type="button" class="layer lib-other-row ${n.owners.length===0?"nowhere":""}" role="listitem"
        data-lib-status=${n.id} title=${`Open ${n.name}`} @click=${()=>this.onOpenItem?.(n.id)}>
        <span class="grip" aria-hidden="true"></span>
        <span class="thumb sp-lib-thumb" aria-hidden="true">${k("list")}</span>
        <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${n.detail} · ${ot(n)}</small></span>
      </button>`)}
    </div>`}${dt(this.listFilter,s.length+1,"status page")}`}renderBody(e){if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let l=this.recordKey;return d`<div class="pe-empty">
        <span>Could not read this status page: ${this.loadError}</span>
        ${l===void 0?u:d`<button class="pe-btn" @click=${()=>{this.load(l)}}>Try again</button>`}
      </div>`}if(this.record===void 0)return d`<div class="pe-empty">Loading…</div>`;if(this.draft===void 0)return d`<div class="pe-empty"><b>${Ae}</b></div>`;let i=this.viewHost();if(i===void 0)return d`<div class="pe-empty">Loading…</div>`;let s=this.fittedColumns(),n=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"";return d`<div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${s.left}px;--wa-right:${s.right}px;${n}`}>
      <div class="column left">
        ${Ve(i)}
        ${Ge(i)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(i,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${this.renderDevicesCard()}
        ${We(i)}
      </div>
    </div>`}static{this.styles=[fe,oe,ae,de,le,ce,he,pe,Ke,Ne,te`
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
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    /* Stacked, the way back stays first on the first line, not under it. */
    .wa-bar.stacked > button.tb-btn.tb-back { order: 0; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
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
    /* One screen tall, as the page editor: the editor never scrolls as a
       whole, and each list, the stage and the inspector scroll in their own
       box, so every card stays on screen. */
    .layout.pe-layout { padding: 0; align-items: stretch; }
    .layout.pe-layout.cols-3 { flex: 1 1 0; min-height: 0; overflow: hidden; }
    .pe-layout > .column.left { display: flex; flex-direction: column; gap: 8px; scrollbar-gutter: auto; }
    .pe-layout.cols-3 > .column.left { overflow: hidden; }
    .pe-layout.cols-3 > .column.left > .card { display: flex; flex-direction: column; min-height: 120px; }
    .pe-layout.cols-3 > .column.left > .card:first-child { flex: 0 1 auto; max-height: 50%; }
    .pe-layout.cols-3 > .column.left > .card:last-child { flex: 1 1 0; }
    .pe-layout.cols-3 > .column.left > .card > :not(.layers) { flex: none; }
    .pe-layout.cols-3 > .column.left > .card > .layers { flex: 0 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
    /* The open status page's own row stays whole over the others, which
       scroll under it: one bar in the card, not two. */
    .pe-layout.cols-3 > .column.left > .sp-pages-card > .layers:has(+ .sp-lib-others) { flex: none; overflow: visible; }
    .pe-layout.cols-3 > .column.inspector { overflow-y: auto; overscroll-behavior: contain; }
    .pe-layout.cols-3 > .column.canvas { overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; overscroll-behavior: contain; }
    .pe-layout.cols-3 > .column.canvas > .card { flex: none; }
    .layout.pe-layout.cols-1 { flex: none; min-height: auto; overflow: visible; }
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
    .sp-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    @container (max-width: 460px) {
      .sp-stage-area { padding-top: 92px; }
    }
    /* "safe": a watch wider than the stage starts at its left edge, so all
       of it can be scrolled to, instead of hanging off both sides. */
    .sp-stage-body { display: flex; justify-content: safe center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
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
    /* On each device over the inspector's cards, and the other status pages
       under the open one, each with a list glyph. */
    .sp-devices { margin-bottom: 10px; }
    .sp-lib-others { margin-top: 2px; }
    .sp-lib-thumb { display: inline-flex; align-items: center; justify-content: center; color: var(--wa-muted); }
    .sp-lib-thumb svg.ui-icon { width: 16px; height: 16px; }
  `,Je,et,Rt,nt,lt]}};a([f({attribute:!1})],o.prototype,"hass",2),a([f({attribute:!1})],o.prototype,"owners",2),a([f({type:Boolean,reflect:!0})],o.prototype,"narrow",2),a([f({attribute:!1})],o.prototype,"icons",2),a([f({attribute:!1})],o.prototype,"iconsTick",2),a([f({attribute:!1})],o.prototype,"haMenu",2),a([f({attribute:!1})],o.prototype,"onHaMenu",2),a([f({attribute:!1})],o.prototype,"onBack",2),a([f({attribute:!1})],o.prototype,"barActions",2),a([f({attribute:!1})],o.prototype,"phones",2),a([f({attribute:!1})],o.prototype,"libraryItem",2),a([f({attribute:!1})],o.prototype,"onOpenItem",2),a([f({attribute:!1})],o.prototype,"onOpenBoard",2),a([h()],o.prototype,"watchId",2),a([h()],o.prototype,"record",2),a([h()],o.prototype,"loading",2),a([h()],o.prototype,"loadError",2),a([h()],o.prototype,"note",2),a([h()],o.prototype,"untickAsk",2),a([h()],o.prototype,"ownList",2),a([h()],o.prototype,"deleteAsk",2),a([h()],o.prototype,"deletingAll",2),a([h()],o.prototype,"topMenuOpen",2),a([h()],o.prototype,"zoom",2),a([h()],o.prototype,"columns",2),a([h()],o.prototype,"hostWidth",2),a([h()],o.prototype,"hostHeight",2),a([h()],o.prototype,"previewKind",2),a([h()],o.prototype,"sideBySide",2),a([h()],o.prototype,"listFilter",2),a([h()],o.prototype,"configSummary",2);customElements.get("wa-status-pages-editor")||customElements.define("wa-status-pages-editor",o);export{ee as SP_COLUMNS_KEY,o as WaStatusPagesEditor};
