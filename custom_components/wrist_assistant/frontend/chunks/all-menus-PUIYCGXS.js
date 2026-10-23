import"./chunk-E7BHRXEU.js";import{b as we}from"./chunk-JSIDCVK7.js";import{A as Le,B as Me,a as ve,b as ye,c as ge,l as ke,m as $e,n as F,u as _,v as xe,x as Te}from"./chunk-O7FXA3UR.js";import{c as fe,d as be}from"./chunk-CCRYPAWV.js";import"./chunk-G3WQHSTC.js";import"./chunk-2NHLQQGT.js";import"./chunk-KW27Q7DP.js";import"./chunk-DTPO6VPG.js";import"./chunk-CVZDGMTF.js";import"./chunk-WJVW5XFC.js";import{e as ae}from"./chunk-EZBAYVAE.js";import{b as ie,c as re,e as se,f as oe,g as de,h as ce,i as le,j as ue,k as pe,l as he}from"./chunk-YJOOA2QA.js";import{a as k,b as Y,ea as y,f as R,ja as x,la as W,ma as Z,pa as T,qa as ee,ra as N,sa as O,va as ne}from"./chunk-ZUAREVPI.js";import"./chunk-YSHCHB5F.js";import"./chunk-FMUKGUCP.js";import"./chunk-XGPZV73A.js";import"./chunk-MO3OAS73.js";import"./chunk-SF4C76H6.js";import{a as J,b as D,c as G,f as Q}from"./chunk-P3S4W6I4.js";import"./chunk-ZOJGMATP.js";import{b as z,c as X}from"./chunk-RZEK6ZG7.js";import"./chunk-JJAUFBBU.js";import"./chunk-SV3BTW33.js";import{I as q}from"./chunk-KPVSZBW2.js";import{b as H,d,g as w,j as K,k as m,l as v,nh as f}from"./chunk-PGFG6NDE.js";import{e as me}from"./chunk-YEUXJYOZ.js";import{b as te}from"./chunk-IAW54OVM.js";import"./chunk-VFWRBV7O.js";import"./chunk-Y7NZKWQC.js";import{_ as j}from"./chunk-TGJNCNIU.js";import{a as u}from"./chunk-LO2NM3CE.js";var Ke="Each device uses one Anywhere menu and one Entity quick menu.";function De(r){return`${r} ${r===1?"menu":"menus"} in your home. ${Ke}`}var Ne="Click a menu to edit it. Tick a device on a card and that device uses this menu from now on. New menu starts on no device yet.",Ee="Click a menu to edit it. Pick a dot and that device uses this menu from now on. Click a device's name to see its menus first.",Se="Each device uses one of each kind. Pick a dot to switch.";function Ie(r){return`Pick which menu this ${D(r.kind)} uses. Click a menu to edit it.`}var U={anywhere:"Anywhere menus",entity:"Entity quick menus"},Re=`${j} Its menus can change after that.`;function Oe(r){return`${r}'s menus have unsaved edits. Save or discard them first.`}function C(r){return we({uiState:new Map,document:N(r),switcherPages:[]},r.unit)}function E(r,o,t){return F(r.name,o)?!0:t.some(e=>r.owners.some(n=>y(n,e.ownerId))&&F(e.name,o)&&o.trim()!=="")}function P(r,o="",t=[]){return x(r).filter(e=>E(e,o,t))}function A(r){return k.map(o=>({unit:o,menus:r.filter(t=>t.unit===o)}))}function B(r,o){let t=o.filter(e=>r.owners.some(n=>y(n,e.ownerId)));return t.find(e=>e.kind==="watch")??t[0]}function Fe(r,o,t,e){return k.flatMap(n=>ee(r,o,n)).filter(n=>E(n,t,e))}function S(r,o){let t=o==="entity"?"New quick menu":"New menu",e=new Set((r===void 0?[]:x(r)).map(n=>n.name.trim().toLowerCase()));if(!e.has(t.toLowerCase()))return t;for(let n=2;;n++)if(!e.has(`${t} ${n}`.toLowerCase()))return`${t} ${n}`}function _e(r){return`Made ${r}, on no device yet. Pick a device for it any time.`}var Ue="Only a Home Assistant administrator can make a new menu.";function Ce(r,o=te()){return Object.fromEntries(Y[r].flatMap(t=>Object.hasOwn(o,t)?[[t,structuredClone(o[t])]]:[]))}function I(r,o){return r.length===0?"No watch or iPhone has connected yet. Pair one on the Home tab.":o.trim()!==""?"No menu or device has that name.":"None yet."}function V(r,o){return`Duplicate ${r} for ${o}. The other devices keep this one.`}function Pe(r,o){return`${o} uses its own copy now, "${r}". Edits to it change only ${o}.`}var je=180,qe=q.screen,ze=2e3,Xe=50,Be="wrist-assistant-panel.all-menus.v1",L;function Ve(){if(L!==void 0)return L;let r={view:"board"};try{let o=window.localStorage.getItem(Be);(o?JSON.parse(o):{}).view==="cards"&&(r.view="cards")}catch{}return L=r,r}function Ye(r){L={...Ve(),...r};try{window.localStorage.setItem(Be,JSON.stringify(L))}catch{}}var Je=r=>me(r)?.dirty??!1,Ae=new WeakMap,c=class extends K{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.deleting=!1;this.saved=!1;this.hassDrawnAt=0;this.lib=new ne(this,()=>this.hassNow,()=>this.devices.map(t=>t.ownerId));this.roomy=new ce(this);this.colorsFor=X();this.colorOf=t=>z(this.colorsFor(this.owners),t);this.onKeyDown=t=>{t.key==="Escape"&&(this.newForm!==void 0&&!this.newForm.busy?(t.preventDefault(),this.newForm=void 0):this.deleteAsk!==void 0&&!this.deleting&&(t.preventDefault(),this.deleteAsk=void 0))}}get hass(){return this.hassNow}set hass(t){let e=this.hassNow===void 0;this.hassNow=t;let n=Date.now();(e||n-this.hassDrawnAt>=ze)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(t){this.embedded&&t.has("searchText")&&(this.search=this.searchText)}get devices(){return J(this.owners,this.phones)}get filter(){return $e(this.focusOwner,this.devices)}filterDevice(){let t=this.filter;return t===ke?void 0:this.devices.find(e=>e.ownerId===t)}get view(){return this.embedded||this.filterDevice()!==void 0?"board":Ve().view}waiting(t){let e=new Map;for(let n of this.devices)e.set(n.ownerId,{held:Z(t,n.ownerId,"menus"),free:!1});return Q(this.owners,e)}setFocus(t){this.newForm=void 0,this.deleteAsk=void 0,this.onFocus?.(t)}setView(t){Ye({view:t}),t==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},de)}open(t){this.onOpenLibrary?.(t.id,this.focusOwner)}async duplicate(t,e){let n=this.lib.store;if(n===void 0||this.copying!==void 0)return;let s=ae(e.name);this.copying=t.id,this.newNote=void 0;let i=await n.copyMenu(e.ownerId,t.unit,s);this.copying=void 0,this.newNote=i.ok?{kind:"ok",text:Pe(s,e.name)}:{kind:"err",text:`Not copied. ${i.text}`},i.ok&&this.flashSaved()}use(t,e){let n=this.lib.store;n!==void 0&&n.pickMenu(e,t.unit,t.id).then(s=>{s.ok&&this.flashSaved()})}get mayMake(){return this.hassNow?.user?.is_admin!==!1}toggleNew(){if(this.newForm?.busy)return;if(this.newForm!==void 0){this.newForm=void 0;return}let t="anywhere";this.newNote=void 0,this.newForm={unit:t,name:S(this.lib.library,t),busy:!1},this.updateComplete.then(()=>ye(this.renderRoot))}setNewUnit(t,e){let n=this.lib.library,s=t.name===S(n,t.unit)?S(n,e):t.name;this.newForm={...t,unit:e,name:s}}async makeMenu(){let t=this.newForm,e=this.lib.store;if(t===void 0||t.busy||e===void 0)return;let n=t.name.trim();if(n===""){this.newForm={...t,note:{kind:"warn",text:"Give the menu a name."}};return}let{note:s,...i}=t;this.newForm={...i,busy:!0};let a=await e.createMenu(t.unit,n,Ce(t.unit));if(!a.ok){this.newForm={...t,busy:!1,note:{kind:"err",text:`Not made. ${a.text}`}};return}this.newForm=void 0,this.onOpenLibrary!==void 0?this.onOpenLibrary(a.reply.id):this.newNote={kind:"ok",text:_e(n)}}async deleteMenu(t){let e=this.lib.store;e===void 0||this.deleting||(this.deleting=!0,await e.deleteItem("menus",t.id),this.deleting=!1,this.deleteAsk=void 0)}render(){let t=this.devices;if(t.length===0&&!this.ownersReady)return d`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let e=this.lib.library,n=this.lib.readState,s=this.filterDevice(),i=this.view,a=e===void 0?n==="unsupported"?R:n==="failed"?this.lib.store?.readError??"Could not read the library.":"Reading the menus\u2026":De(x(e).length),h=e!==void 0&&n==="failed";return d`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Menus</h1>
          <p class="ap-lead">${a}</p>
        </div>
        ${e===void 0?w:this.renderNewButton()}
      </div>
      ${this.newForm===void 0?w:this.renderNewDialog(this.newForm)}
      ${this.newNote===void 0?w:d`<p class="lt-line ${this.newNote.kind}" role="status">${this.newNote.text}</p>`}
      ${h?d`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:w}
      <div class="pk-surface pk-page" role="region" aria-label="Your menus">
        <div class="pk-pin">${this.renderHead(i)}</div>
        <div class="pk-body">
          ${e===void 0?d`<p class="ap-empty">${a}</p>`:t.length===0?d`<p class="ap-empty">${I(t,this.search)}</p>`:s!==void 0?this.renderFocus(e,s,t):i==="board"?this.renderBoardAll(e,t):this.renderSections(e,t)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${s===void 0?i==="board"?Ee:Ne:Ie(s)}</span></div>
      </div>
    </div></div>`}renderEmbedded(){let t=this.lib.library,e=this.devices,n=this.lib.readState;if(t===void 0){let s=n==="unsupported"?R:n==="failed"?this.lib.store?.readError??"Could not read the library.":"Reading the menus\u2026";return d`<p class="ap-empty">${s}</p>`}return e.length===0?d`<p class="ap-empty">No device can have menus.</p>`:d`${this.saved?d`<span class="bd-saved ap-embed-saved" role="status">${f("check")}<span>Saved</span></span>`:w}${this.renderBoardAll(t,e)}`}renderSections(t,e){let n=P(t,this.search,e),s=this.waiting(t);return d`${A(n).map(({unit:i,menus:a})=>d`<section class="am-section" aria-labelledby=${`am-section-${i}`}>
      <div class="am-section-head">
        <h2 class="am-section-title" id=${`am-section-${i}`}>${U[i]} <span class="am-section-n">${a.length}</span></h2>
      </div>
      ${a.length===0?d`<p class="ap-empty">${I(e,this.search)}</p>`:d`<div class="ap-grid" role="list">${a.map(h=>this.renderCard(t,h,e,s))}</div>`}
    </section>`)}`}renderNewButton(){let t=this.mayMake,e=this.newForm!==void 0;return d`<button type="button" class="am-new-btn ${e?"on":""}" aria-expanded=${e?"true":"false"}
      ?disabled=${!t||this.newForm?.busy===!0} title=${t?"Make a new menu no device uses yet":Ue}
      @click=${()=>this.toggleNew()}>${f("plus")}<span>New menu</span></button>`}renderNewDialog(t){return ve("menus",t,[],{onName:e=>{this.newForm={...t,name:e}},onUnit:e=>this.setNewUnit(t,e),onMake:()=>{this.makeMenu()},onClose:()=>{t.busy||(this.newForm=void 0)}})}renderHead(t){return d`<div class="pk-head">
      ${le(t,e=>this.setView(e),"menus")}
      ${this.saved?d`<span class="bd-saved" role="status">${f("check")}<span>Saved</span></span>`:w}
      <label class="pk-search">
        ${f("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by menu or device" aria-label="Search menus"
          @input=${e=>{this.search=e.target.value}} />
      </label>
    </div>`}ticksInput(t,e,n,s){let i=this.lib.store,a=i?.noteFor("menus",e.id),h=this.hassNow?.user?.is_admin;return{library:t,kind:"menus",itemId:e.id,devices:n,colorOf:this.colorOf,...i===void 0?{}:{pending:i.pending},...a===void 0?{}:{note:a},...h===void 0?{}:{admin:h},locked:b=>{if(!W(t,b,"menus",e.id)){if(Je(b))return Oe(n.find($=>$.ownerId===b)?.name??"This device");if(s.has(b))return Re}}}}renderCardTicks(t,e,n,s){return re(this.ticksInput(t,e,n,s),i=>this.use(e,i))}renderCard(t,e,n,s){let i=B(e,n),a=_(e.name);return d`<div class="ap-card" role="listitem" data-card=${e.id}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${a} @click=${()=>this.open(e)}>
          <b class="ap-name">${e.name}</b>
          <small class="ap-detail">${C(e)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${a} @click=${()=>this.open(e)}>
        ${this.renderThumb(t,e,i,je)}
      </button>
      ${this.renderCardTicks(t,e,n,s)}
      ${e.owners.length===0?this.renderDelete(e):w}
    </div>`}renderDelete(t){return this.deleteAsk===t.id?this.renderDeleteAsk(t):d`<button type="button" class="am-btn danger am-del" title=${`Delete ${t.name}. It is on no device yet.`}
      @click=${e=>{e.stopPropagation(),this.deleteAsk=t.id}}>${f("delete")}<span>Delete</span></button>`}renderDeleteAsk(t){return d`<div class="am-del-ask" role="alertdialog" aria-label=${`Delete ${t.name}?`}>
      <span><b>Delete ${t.name}?</b> It is on no device yet. This cannot be undone.</span>
      <span class="am-new-acts">
        <button type="button" class="am-btn danger" ?disabled=${this.deleting} @click=${()=>{this.deleteMenu(t)}}>Really delete</button>
        <button type="button" class="am-btn" ?disabled=${this.deleting} @click=${()=>{this.deleteAsk=void 0}}>Cancel</button>
      </span>
    </div>`}renderThumb(t,e,n,s){let i=this.hassNow;if(i===void 0||this.icons===void 0)return w;let a=Ae.get(e);a===void 0&&(a=N(e),Ae.set(e,a));let h=n===void 0?void 0:O(t,n.ownerId);return d`<wa-menu-thumbs .hass=${i} .icons=${this.icons} .tick=${this.iconsTick} .menus=${a}
      .pages=${h} .screen=${qe} .height=${s} menu=${e.unit}></wa-menu-thumbs>`}renderBoardOf(t,e,n,s){return ue({label:"Menus on each device",thing:"Menu",columns:e.map(i=>({device:i,color:this.colorOf(i.ownerId),count:k.filter(a=>T(t,i.ownerId,a)!==void 0).length})),...s===void 0?{}:{focus:s},onFocus:i=>this.setFocus(i),wide:this.roomy.wide,focusWord:"Its menus",focusTitle:i=>`Show the menus ${i.name} uses first`,sections:n})}renderBoardAll(t,e){let n=P(t,this.search,e),s=this.waiting(t);return this.renderBoardOf(t,e,A(n).map(({unit:i,menus:a})=>({key:i,title:U[i],count:a.length,hint:Se,rows:a.map(h=>this.boardRow(t,h,e,s)),empty:I(e,this.search)})))}boardRow(t,e,n,s,i){let a=this.ticksInput(t,e,n,s),h=ie(a).map(l=>{let M=l.on?void 0:T(t,l.ownerId,e.unit),He=M===void 0||l.next===void 0?l.title:`${l.title.replace(/\.$/,"")}. Replaces ${M.name} there.`;return{chip:{...l,title:He},onPick:()=>this.use(e,l.ownerId)}}),b=i!==void 0&&e.owners.some(l=>y(l,i.ownerId))?i:B(e,n),$=e.owners.length===0,g={key:e.id,name:e.name,detail:C(e),picture:fe({menu:e,hass:this.hassNow,icons:this.icons,tick:this.iconsTick,onReady:()=>this.requestUpdate(),height:this.roomy.size(Xe),...e.unit==="anywhere"&&b!==void 0?{pages:O(t,b.ownerId)}:{}}),openTitle:_(e.name),onOpen:()=>this.open(e),cells:h,...i!==void 0&&!e.owners.some(l=>y(l,i.ownerId))?{dim:!0}:{},...a.note===void 0?{}:{note:{text:a.note,kind:"warn"}}};if(i!==void 0&&e.owners.some(l=>y(l,i.ownerId))&&e.owners.some(l=>!y(l,i.ownerId))&&i!==void 0){let l=this.copying!==void 0;g.actions=d`<button type="button" class="bd-act" ?disabled=${l}
        title=${l?"Duplicating\u2026":V(e.name,i.name)} aria-label=${V(e.name,i.name)}
        @click=${M=>{M.stopPropagation(),this.duplicate(e,i)}}>${f("duplicate")}</button>`}return $&&(this.deleteAsk===e.id?g.under=this.renderDeleteAsk(e):g.actions=d`<button type="button" class="bd-act danger" title=${`Delete ${e.name}. It is on no device yet.`}
        aria-label=${`Delete ${e.name}`} @click=${l=>{l.stopPropagation(),this.deleteAsk=e.id}}>${f("delete")}</button>`),g}renderFocus(t,e,n){let s=this.waiting(t),i=k.map(p=>T(t,e.ownerId,p)).filter(p=>p!==void 0&&E(p,this.search,n)),a=Fe(t,e.ownerId,this.search,n),h=D(e.kind),b=e.kind==="watch"?["settings","rooms","voice"]:["settings","rooms"],$=this.colorOf(e.ownerId),g=k.map(p=>T(t,e.ownerId,p)?.name).filter(p=>p!==void 0);return d`<div class="bd-focus" style=${$===void 0?w:`--dc:${$}`}>
        <span class="bd-focus-glyph" aria-hidden="true">${f(e.kind==="iphone"?"phone":"watch")}</span>
        <span class="bd-focus-t"><b>${e.name}</b> <span>${g.length===0?"uses no menu yet":`uses ${G(g)}`}</span></span>
        ${this.onOpenScreen===void 0?w:d`<span class="bd-focus-own">Also on this ${h}:
          ${b.map(p=>d`<button type="button" class="bd-link" @click=${()=>this.onOpenScreen?.(e.ownerId,e.kind,p)}>${oe[p]}</button>`)}</span>`}
        <button type="button" class="bd-focus-all" @click=${()=>this.setFocus(void 0)}>${f("grid")}<span>All devices</span></button>
      </div>
      ${this.renderBoardOf(t,n,[{key:"on",title:xe(e),count:i.length,hint:"One of each kind. Pick a dot to switch.",rows:i.map(p=>this.boardRow(t,p,n,s,e)),empty:this.search.trim()===""?`${e.name} uses no menu yet.`:`No menu ${e.name} uses has that name.`},{key:"rest",title:Te(e),count:a.length,hint:`Pick its dot under ${e.name} to use it there.`,rows:a.map(p=>this.boardRow(t,p,n,s,e)),empty:this.search.trim()===""?`${e.name} uses every menu in your home.`:"No other menu has that name."}],e.ownerId)}`}static{this.styles=[Me,Le,se,be,ge,pe,he,H`
    .ap-embed-saved { position: absolute; right: 0; top: -26px; }
    :host([embedded]) { position: relative; }
    /* The menu's picture: the watch screen alone, as the Pages tab's cards
       draw a page. */
    .ap-thumb wa-menu-thumbs { flex: none; width: 100%; }
    /* The two sections, Anywhere menus and Entity quick menus, each under
       a small heading with its count. */
    .am-section { display: flex; flex-direction: column; gap: 10px; }
    .am-section + .am-section { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--wa-line); }
    .am-section-head { display: flex; align-items: center; gap: 10px; padding: 0 2px; }
    .am-section-title { margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .01em; color: var(--wa-text); }
    .am-section-n { margin-left: 4px; font-weight: 500; color: var(--wa-muted); }
    /* "+ New menu", at the right of the tab's head, beside the lead. */
    .am-new-btn {
      display: inline-flex; align-items: center; gap: 5px; margin-left: auto; height: 30px; padding: 0 11px; border-radius: 8px;
      border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-ink);
      font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; flex: none;
    }
    .am-new-btn svg { width: 13px; height: 13px; }
    .am-new-btn:hover:not(:disabled), .am-new-btn.on { background: var(--wa-hover); }
    .am-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .am-new-btn:disabled { opacity: .45; cursor: default; }
    .am-new-acts { display: inline-flex; gap: 6px; flex: none; }
    .am-btn {
      display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 10px; border-radius: 7px;
      border: 1px solid var(--wa-line-strong); background: var(--wa-panel, var(--wa-card)); color: var(--wa-ink);
      font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
    }
    .am-btn svg { width: 13px; height: 13px; }
    .am-btn:hover:not(:disabled) { background: var(--wa-hover); }
    .am-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .am-btn:disabled { opacity: .45; cursor: default; }
    .am-btn.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }
    .am-btn.danger {
      color: var(--error-color, #b42318);
      border-color: color-mix(in srgb, var(--error-color, #b42318) 45%, var(--wa-line));
      background: color-mix(in srgb, var(--error-color, #b42318) 10%, var(--wa-panel, var(--wa-card)));
    }
    .am-del { align-self: flex-start; height: 24px; font-size: 11.5px; }
    .am-del-ask { display: flex; flex-direction: column; gap: 6px; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
    .am-del-ask b { font-weight: 600; }
    /* Delete on a board row of a menu no device uses: an icon button after
       its name. */
    .bd-act {
      display: inline-flex; align-items: center; justify-content: center; flex: none; width: 26px; height: 26px; padding: 0;
      border-radius: 6px; border: 1px solid transparent; background: none; color: var(--wa-muted); cursor: pointer;
    }
    .bd-act svg { width: 14px; height: 14px; }
    .bd-act.danger:hover { color: var(--error-color, #b42318); border-color: color-mix(in srgb, var(--error-color, #b42318) 45%, var(--wa-line)); }
    .bd-act:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  `]}};u([m({attribute:!1})],c.prototype,"owners",2),u([m({attribute:!1})],c.prototype,"ownersReady",2),u([m({attribute:!1})],c.prototype,"phones",2),u([m({attribute:!1})],c.prototype,"icons",2),u([m({attribute:!1})],c.prototype,"iconsTick",2),u([m({attribute:!1})],c.prototype,"onOpenLibrary",2),u([m({attribute:!1})],c.prototype,"focusOwner",2),u([m({attribute:!1})],c.prototype,"onFocus",2),u([m({attribute:!1})],c.prototype,"onOpenScreen",2),u([m({type:Boolean,reflect:!0})],c.prototype,"embedded",2),u([m({attribute:!1})],c.prototype,"searchText",2),u([v()],c.prototype,"search",2),u([v()],c.prototype,"newForm",2),u([v()],c.prototype,"newNote",2),u([v()],c.prototype,"deleteAsk",2),u([v()],c.prototype,"deleting",2),u([v()],c.prototype,"saved",2),u([v()],c.prototype,"copying",2);customElements.get("wa-all-menus")||customElements.define("wa-all-menus",c);export{c as WaAllMenus};
