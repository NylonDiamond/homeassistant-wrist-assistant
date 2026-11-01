import"./chunk-ZVHYMS4O.js";import{b as $e}from"./chunk-YR3H7VAE.js";import"./chunk-LSRNIBLL.js";import{e as ke}from"./chunk-PAU7QUOW.js";import{a as Le,b as Me,c as De,d as Re,e as Fe}from"./chunk-YXL3THLQ.js";import{c as Te,d as xe,m as Ne,n as Ee,o as _,v as U,w as Se,y as Ie}from"./chunk-IVPI67PH.js";import"./chunk-IVVUSXUS.js";import"./chunk-LA543C6T.js";import"./chunk-EEQP4S6P.js";import"./chunk-2T5D2TLW.js";import"./chunk-KDF3BH6P.js";import"./chunk-CDPFDVRX.js";import"./chunk-DNRTVSPA.js";import"./chunk-4Z22ZXCD.js";import"./chunk-QA23RMRL.js";import"./chunk-3X4WI5I2.js";import{e as le}from"./chunk-OIKGB4PG.js";import"./chunk-IT74FWXQ.js";import{b as pe,c as he,d as me,e as fe,f as we,g as be,h as ye,i as ve,j as ge}from"./chunk-Z5FETKAB.js";import{a as se,m as oe,n as de,o as ce,r as ue}from"./chunk-KSTYHU5F.js";import{b as ae}from"./chunk-35HHC646.js";import{Aa as O,a as k,b as X,la as v,m as F,ra as $,ta as Z,ua as ee,xa as T,ya as te,za as N}from"./chunk-UW54JOZ3.js";import"./chunk-ZOJGMATP.js";import{a as Y,b as M,c as D,f as J,g as W,h as G,i as Q}from"./chunk-S3OTPREC.js";import"./chunk-4FLCZXZ2.js";import{b as ie,c as re}from"./chunk-HEXDGDQL.js";import"./chunk-HT5ZHHKE.js";import"./chunk-BUXYEO27.js";import"./chunk-65FYUJAA.js";import"./chunk-XXO7UAGQ.js";import{D as ne}from"./chunk-QY7RT6O3.js";import"./chunk-FSHKVOQO.js";import"./chunk-NL2JPLO4.js";import"./chunk-FJIHFDLG.js";import"./chunk-5RFRJFAQ.js";import{b as j,d,g as f,j as q,k as w,l as g,wh as y}from"./chunk-JDOAQBIW.js";import{ka as z}from"./chunk-B4OHESSX.js";import{a as h}from"./chunk-LO2NM3CE.js";var Ge="Each device uses one Anywhere menu and one Entity quick menu.";function Oe(r){return`${r} ${r===1?"menu":"menus"} in your home. ${Ge}`}var _e="Click a menu to edit it. Tick a device on a card and that device uses this menu from now on. New menu starts on no device yet.",Ue="Click a menu to edit it. Pick a dot and that device uses this menu from now on. Click a device's name to see its menus first.",Ce="Each device uses one of each kind. Pick a dot to switch.";function Pe(r){return`Pick which menu this ${M(r.kind)} uses. Click a menu to edit it.`}var C={anywhere:"Anywhere menus",entity:"Entity quick menus"},pt=P(void 0);function P(r){return`${z(r)} Its menus can change after that.`}function Be(r){return`${r}'s menus have unsaved edits. Save or discard them first.`}function B(r){return $e({uiState:new Map,document:N(r),switcherPages:[]},r.unit)}function E(r,o,e){return _(r.name,o)?!0:e.some(t=>r.owners.some(n=>v(n,t.ownerId))&&_(t.name,o)&&o.trim()!=="")}function A(r,o="",e=[]){return $(r).filter(t=>E(t,o,e))}function V(r){return k.map(o=>({unit:o,menus:r.filter(e=>e.unit===o)}))}function H(r,o){let e=o.filter(t=>r.owners.some(n=>v(n,t.ownerId)));return e.find(t=>t.kind==="watch")??e[0]}function Ae(r,o,e,t){return k.flatMap(n=>te(r,o,n)).filter(n=>E(n,e,t))}function S(r,o){let e=o==="entity"?"New quick menu":"New menu",t=new Set((r===void 0?[]:$(r)).map(n=>n.name.trim().toLowerCase()));if(!t.has(e.toLowerCase()))return e;for(let n=2;;n++)if(!t.has(`${e} ${n}`.toLowerCase()))return`${e} ${n}`}function Ve(r){let o=r.length===1;return`${D(r)} ${o?"uses":"use"} it. To delete it, pick another menu for ${o?"that device":"each of them"} first.`}function He(r){return`Made ${r}, on no device yet. Pick a device for it any time.`}var Ke="Only a Home Assistant administrator can make a new menu.";function je(r,o=ae()){return Object.fromEntries(X[r].flatMap(e=>Object.hasOwn(o,e)?[[e,structuredClone(o[e])]]:[]))}function I(r,o,e=!1){if(r.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";if(o.trim()!=="")return"No menu or device has that name.";let t=typeof e=="boolean"?e:e.size>0,n=typeof e!="boolean"&&G(r,e);return t?`None yet. ${W("menus",n)}`:"None yet."}function qe(r,o,e){return o.trim()!==""?`No menu ${r.name} uses has that name.`:e?J("menus",r.name,r.appVersion):`${r.name} uses no menu yet.`}function K(r,o){return`Duplicate ${r} for ${o}. The other devices keep this one.`}function ze(r,o){return`${o} uses its own copy now, "${r}". Edits to it change only ${o}.`}var Qe=180,Ze=ne.screen,et=2e3,tt=50,Ye="wrist-assistant-panel.all-menus.v1",x;function Je(){if(x!==void 0)return x;let r={view:"cards"};try{let o=window.localStorage.getItem(Ye);(o?JSON.parse(o):{}).view==="board"&&(r.view="board")}catch{}return x=r,r}function nt(r){x={...Je(),...r};try{window.localStorage.setItem(Ye,JSON.stringify(x))}catch{}}var it=r=>ke(r)?.dirty??!1,Xe=new WeakMap,c=class extends q{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.saved=!1;this.hassDrawnAt=0;this.lib=new oe(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.roomy=new we(this);this.colorsFor=re();this.colorOf=e=>ie(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.newForm!==void 0&&!this.newForm.busy?(e.preventDefault(),this.newForm=void 0):this.deleteAsk!==void 0&&(e.preventDefault(),this.deleteAsk=void 0))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let n=Date.now();(t||n-this.hassDrawnAt>=et)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){this.embedded&&e.has("searchText")&&(this.search=this.searchText)}get devices(){return Y(this.owners,this.phones)}get filter(){return Ee(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===Ne?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.embedded||this.filterDevice()!==void 0?"board":pe("menus",Je().view)}waiting(e){let t=new Map;for(let n of this.devices)t.set(n.ownerId,{held:ee(e,n.ownerId,"menus"),free:!1});return Q(this.owners,t)}setFocus(e){this.newForm=void 0,this.deleteAsk=void 0,this.onFocus?.(e)}setView(e){he("menus",e),nt({view:e}),e==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},fe)}open(e){this.onOpenLibrary?.(e.id,this.focusOwner)}async duplicate(e,t){let n=this.lib.store;if(n===void 0||this.copying!==void 0)return;let s=le(t.name);this.copying=e.id,this.newNote=void 0;let i=await n.copyMenu(t.ownerId,e.unit,s);this.copying=void 0,this.newNote=i.ok?{kind:"ok",text:ze(s,t.name)}:{kind:"err",text:`Not copied. ${i.text}`},i.ok&&this.flashSaved()}use(e,t){let n=this.lib.store;n!==void 0&&n.pickMenu(t,e.unit,e.id).then(s=>{s.ok&&this.flashSaved()})}get mayMake(){return this.hassNow?.user?.is_admin!==!1}toggleNew(){if(this.newForm?.busy)return;if(this.newForm!==void 0){this.newForm=void 0;return}let e="anywhere";this.newNote=void 0,this.newForm={unit:e,name:S(this.lib.library,e),busy:!1},this.updateComplete.then(()=>Me(this.renderRoot))}setNewUnit(e,t){let n=this.lib.library,s=e.name===S(n,e.unit)?S(n,t):e.name;this.newForm={...e,unit:t,name:s}}async makeMenu(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=e.name.trim();if(n===""){this.newForm={...e,note:{kind:"warn",text:"Give the menu a name."}};return}let{note:s,...i}=e;this.newForm={...i,busy:!0};let a=await t.createMenu(e.unit,n,je(e.unit));if(!a.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${a.text}`}};return}this.newForm=void 0,this.onOpenLibrary!==void 0?this.onOpenLibrary(a.reply.id):this.newNote={kind:"ok",text:He(n)}}deleteMenu(e){let t=this.lib.store;t!==void 0&&(this.deleteAsk=void 0,t.deleteItemLater("menus",e.id,`Deleted ${e.name}.`))}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return d`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let t=this.lib.library,n=this.lib.readState,s=this.filterDevice(),i=this.view,a=t===void 0?n==="unsupported"?F:n==="failed"?this.lib.store?.readError??"Could not read the library.":"Reading the menus\u2026":Oe($(t).length),u=t!==void 0&&n==="failed";return d`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Menus</h1>
          <p class="ap-lead">${a}</p>
        </div>
        ${t===void 0?f:this.renderNewButton()}
      </div>
      ${this.newForm===void 0?f:this.renderNewDialog(this.newForm)}
      ${this.newNote===void 0?f:d`<p class="lt-line ${this.newNote.kind}" role="status">${this.newNote.text}</p>`}
      ${u?d`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:f}
      <div class="pk-surface pk-page" role="region" aria-label="Your menus">
        <div class="pk-pin">${this.renderHead(i)}</div>
        <div class="pk-body">
          ${t===void 0?d`<p class="ap-empty">${a}</p>`:e.length===0?d`<p class="ap-empty">${I(e,this.search)}</p>`:s!==void 0?this.renderFocus(t,s,e):i==="board"?this.renderBoardAll(t,e):this.renderSections(t,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${s===void 0?i==="board"?Ue:_e:Pe(s)}</span></div>
      </div>
    </div></div>`}renderEmbedded(){let e=this.lib.library,t=this.devices,n=this.lib.readState;if(e===void 0){let s=n==="unsupported"?F:n==="failed"?this.lib.store?.readError??"Could not read the library.":"Reading the menus\u2026";return d`<p class="ap-empty">${s}</p>`}return t.length===0?d`<p class="ap-empty">No device can have menus.</p>`:d`${this.saved?d`<span class="bd-saved ap-embed-saved" role="status">${y("check")}<span>Saved</span></span>`:f}${this.renderBoardAll(e,t)}`}renderSections(e,t){let n=A(e,this.search,t),s=this.waiting(e);return d`${V(n).map(({unit:i,menus:a})=>d`<section class="am-section" aria-labelledby=${`am-section-${i}`}>
      <div class="am-section-head">
        <h2 class="am-section-title" id=${`am-section-${i}`}>${C[i]} <span class="am-section-n">${a.length}</span></h2>
      </div>
      ${a.length===0?d`<p class="ap-empty">${I(t,this.search,s)}</p>`:d`<div class="ap-grid" role="list">${a.map(u=>this.renderCard(e,u,t,s))}</div>`}
    </section>`)}`}renderNewButton(){let e=this.mayMake,t=this.newForm!==void 0;return d`<button type="button" class="am-new-btn ${t?"on":""}" aria-expanded=${t?"true":"false"}
      ?disabled=${!e||this.newForm?.busy===!0} title=${e?"Make a new menu no device uses yet":Ke}
      @click=${()=>this.toggleNew()}>${y("plus")}<span>New menu</span></button>`}renderNewDialog(e){return Le("menus",e,[],{onName:t=>{this.newForm={...e,name:t}},onUnit:t=>this.setNewUnit(e,t),onMake:()=>{this.makeMenu()},onClose:()=>{e.busy||(this.newForm=void 0)}})}renderHead(e){return d`<div class="pk-head">
      ${be(e,t=>this.setView(t),"menus")}
      ${this.saved?d`<span class="bd-saved" role="status">${y("check")}<span>Saved</span></span>`:f}
      <label class="pk-search">
        ${y("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by menu or device" aria-label="Search menus"
          @input=${t=>{this.search=t.target.value}} />
      </label>
    </div>`}ticksInput(e,t,n,s){let i=this.lib.store,a=i?.noteFor("menus",t.id),u=this.hassNow?.user?.is_admin;return{library:e,kind:"menus",itemId:t.id,devices:n,colorOf:this.colorOf,...i===void 0?{}:{pending:i.pending},...a===void 0?{}:{note:a},...u===void 0?{}:{admin:u},locked:b=>{if(!Z(e,b,"menus",t.id)){if(it(b))return Be(n.find(m=>m.ownerId===b)?.name??"This device");if(s.has(b))return P(n.find(m=>m.ownerId===b)?.appVersion)}}}}renderCardTicks(e,t,n,s){return ce(this.ticksInput(e,t,n,s),i=>this.use(t,i))}renderCard(e,t,n,s){let i=H(t,n),a=U(t.name),u=this.deleteAsk===t.id;return d`<div class="ap-card ${u?"asking":""}" role="listitem" data-card=${t.id}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${a} @click=${()=>this.open(t)}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${B(t)}</small>
        </button>
        ${this.renderDeleteButton(t,"ap-del")}
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${a} @click=${()=>this.open(t)}>
        ${this.renderThumb(e,t,i,Qe)}
      </button>
      ${this.renderCardTicks(e,t,n,s)}
      ${u?this.renderDeleteAsk(t,n):f}
    </div>`}renderDeleteButton(e,t){return d`<button type="button" class=${t} title=${`Delete ${e.name}`} aria-label=${`Delete ${e.name}`}
      @click=${n=>{n.stopPropagation(),this.deleteAsk=e.id}}>${y("delete")}</button>`}renderDeleteAsk(e,t){let n=()=>{this.deleteAsk=void 0},s=[...new Set(e.owners.map(a=>t.find(u=>v(u.ownerId,a))?.name??"A device"))],i=s.length===0;return d`<div class="ap-ask" role="alertdialog" aria-label=${`Delete ${e.name}?`} @click=${a=>a.stopPropagation()}>
      ${i?d`<span><b>Delete ${e.name}?</b> It is on no device yet. ${se}</span>`:d`<span><b>${e.name} is in use.</b> ${Ve(s)}</span>`}
      <span class="ap-ask-acts">
        ${i?d`<button type="button" class="ap-ask-btn danger" @click=${()=>this.deleteMenu(e)}>Really delete</button>`:f}
        <button type="button" class="ap-ask-btn" @click=${n}>${i?"Cancel":"Close"}</button>
      </span>
    </div>`}renderThumb(e,t,n,s){let i=this.hassNow;if(i===void 0||this.icons===void 0)return f;let a=Xe.get(t);a===void 0&&(a=N(t),Xe.set(t,a));let u=n===void 0?void 0:O(e,n.ownerId);return d`<wa-menu-thumbs .hass=${i} .icons=${this.icons} .tick=${this.iconsTick} .menus=${a}
      .pages=${u} .screen=${Ze} .height=${s} menu=${t.unit}></wa-menu-thumbs>`}renderBoardOf(e,t,n,s){return ye({label:"Menus on each device",thing:"Menu",columns:t.map(i=>({device:i,color:this.colorOf(i.ownerId),count:k.filter(a=>T(e,i.ownerId,a)!==void 0).length})),...s===void 0?{}:{focus:s},onFocus:i=>this.setFocus(i),wide:this.roomy.wide,focusWord:"Its menus",focusTitle:i=>`Show the menus ${i.name} uses first`,sections:n})}renderBoardAll(e,t){let n=A(e,this.search,t),s=this.waiting(e);return this.renderBoardOf(e,t,V(n).map(({unit:i,menus:a})=>({key:i,title:C[i],count:a.length,hint:Ce,rows:a.map(u=>this.boardRow(e,u,t,s)),empty:I(t,this.search,s)})))}boardRow(e,t,n,s,i){let a=this.ticksInput(e,t,n,s),u=de(a).map(p=>{let L=p.on?void 0:T(e,p.ownerId,t.unit),We=L===void 0||p.next===void 0?p.title:`${p.title.replace(/\.$/,"")}. Replaces ${L.name} there.`;return{chip:{...p,title:We},onPick:()=>this.use(t,p.ownerId)}}),b=i!==void 0&&t.owners.some(p=>v(p,i.ownerId))?i:H(t,n),m={key:t.id,name:t.name,detail:B(t),picture:Te({menu:t,hass:this.hassNow,icons:this.icons,tick:this.iconsTick,onReady:()=>this.requestUpdate(),height:this.roomy.size(tt),...t.unit==="anywhere"&&b!==void 0?{pages:O(e,b.ownerId)}:{}}),openTitle:U(t.name),onOpen:()=>this.open(t),cells:u,...i!==void 0&&!t.owners.some(p=>v(p,i.ownerId))?{dim:!0}:{},...a.note===void 0?{}:{note:{text:a.note,kind:"warn"}}};if(i!==void 0&&t.owners.some(p=>v(p,i.ownerId))&&t.owners.some(p=>!v(p,i.ownerId))&&i!==void 0){let p=this.copying!==void 0;m.actions=d`<button type="button" class="bd-act" ?disabled=${p}
        title=${p?"Duplicating\u2026":K(t.name,i.name)} aria-label=${K(t.name,i.name)}
        @click=${L=>{L.stopPropagation(),this.duplicate(t,i)}}>${y("duplicate")}</button>`}let l=this.renderDeleteButton(t,"bd-act danger");return m.actions=m.actions===void 0?l:d`${m.actions}${l}`,this.deleteAsk===t.id&&(m.under=this.renderDeleteAsk(t,n)),m}renderFocus(e,t,n){let s=this.waiting(e),i=k.map(l=>T(e,t.ownerId,l)).filter(l=>l!==void 0&&E(l,this.search,n)),a=Ae(e,t.ownerId,this.search,n),u=M(t.kind),b=t.kind==="watch"?["settings","rooms","voice"]:["settings","rooms"],m=this.colorOf(t.ownerId),R=k.map(l=>T(e,t.ownerId,l)?.name).filter(l=>l!==void 0);return d`<div class="bd-focus" style=${m===void 0?f:`--dc:${m}`}>
        <span class="bd-focus-glyph" aria-hidden="true">${y(t.kind==="iphone"?"phone":"watch")}</span>
        <span class="bd-focus-t"><b>${t.name}</b> <span>${R.length===0?"uses no menu yet":`uses ${D(R)}`}</span></span>
        ${this.onOpenScreen===void 0?f:d`<span class="bd-focus-own">Also on this ${u}:
          ${b.map(l=>d`<button type="button" class="bd-link" @click=${()=>this.onOpenScreen?.(t.ownerId,t.kind,l)}>${me[l]}</button>`)}</span>`}
        <button type="button" class="bd-focus-all" @click=${()=>this.setFocus(void 0)}>${y("grid")}<span>All devices</span></button>
      </div>
      ${this.renderBoardOf(e,n,[{key:"on",title:Se(t),count:i.length,hint:"One of each kind. Pick a dot to switch.",rows:i.map(l=>this.boardRow(e,l,n,s,t)),empty:qe(t,this.search,s.has(t.ownerId))},{key:"rest",title:Ie(t),count:a.length,hint:`Pick its dot under ${t.name} to use it there.`,rows:a.map(l=>this.boardRow(e,l,n,s,t)),empty:this.search.trim()===""?`${t.name} uses every menu in your home.`:"No other menu has that name."}],t.ownerId)}`}static{this.styles=[Fe,Re,ue,xe,De,ve,ge,j`
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
  `]}};h([w({attribute:!1})],c.prototype,"owners",2),h([w({attribute:!1})],c.prototype,"ownersReady",2),h([w({attribute:!1})],c.prototype,"phones",2),h([w({attribute:!1})],c.prototype,"icons",2),h([w({attribute:!1})],c.prototype,"iconsTick",2),h([w({attribute:!1})],c.prototype,"onOpenLibrary",2),h([w({attribute:!1})],c.prototype,"focusOwner",2),h([w({attribute:!1})],c.prototype,"onFocus",2),h([w({attribute:!1})],c.prototype,"onOpenScreen",2),h([w({type:Boolean,reflect:!0})],c.prototype,"embedded",2),h([w({attribute:!1})],c.prototype,"searchText",2),h([g()],c.prototype,"search",2),h([g()],c.prototype,"newForm",2),h([g()],c.prototype,"newNote",2),h([g()],c.prototype,"deleteAsk",2),h([g()],c.prototype,"saved",2),h([g()],c.prototype,"copying",2);customElements.get("wa-all-menus")||customElements.define("wa-all-menus",c);export{c as WaAllMenus};
