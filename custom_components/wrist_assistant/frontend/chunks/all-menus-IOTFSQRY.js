import"./chunk-FNZ4JPCY.js";import{b as be}from"./chunk-PBO2VSA5.js";import{e as ve,k as _}from"./chunk-3FKM2HF4.js";import{a as ke,b as $e,c as Le,d as Me,e as xe}from"./chunk-DUFZ34MX.js";import"./chunk-T4OUPI4D.js";import"./chunk-EHM2EFDL.js";import"./chunk-3NK7IBVG.js";import"./chunk-AXK2NURG.js";import{A as ce,B as pe,C as he,D as x,F,M as me,N as R,P as fe,Q as we,T as P,X as ge,Y as ye,y as v}from"./chunk-QU67EN36.js";import{Ba as ue,a as $,b as Q,d as Z,ga as D,ha as ie,la as g,na as se,oa as re,ra as E,sa as I,ta as M,ua as S,wa as ae,ya as de,za as le}from"./chunk-APPWBUJI.js";import{b as oe}from"./chunk-UBQEHBFG.js";import"./chunk-OZTORW2H.js";import"./chunk-FGYNXXNV.js";import"./chunk-4TAKWJ7N.js";import{a as ee,b as ne,g as te}from"./chunk-XF6VR4HJ.js";import"./chunk-2YTAGEKK.js";import"./chunk-ZOJGMATP.js";import"./chunk-G2XMT6V4.js";import"./chunk-TQT7CA7X.js";import"./chunk-4B2APRC6.js";import"./chunk-2XTCQYGT.js";import"./chunk-FHPYNI5F.js";import{b as J,c as G}from"./chunk-KBXFS4SO.js";import"./chunk-SV3BTW33.js";import"./chunk-2QTMJXDV.js";import{X as W,z as Y}from"./chunk-BL4HQVLU.js";import"./chunk-VWJCPW77.js";import"./chunk-PGFAOWAG.js";import{b as j,d,g as p,j as z,k as w,l as b,nh as k}from"./chunk-BDP52PL7.js";import{_ as B}from"./chunk-TGJNCNIU.js";import{a as h}from"./chunk-LO2NM3CE.js";var je="Each device uses one Anywhere menu and one Entity quick menu.";function Te(i){return`${i} ${i===1?"menu":"menus"} in your home. ${je}`}var Ne="Click a menu to edit it. Pick a device on a card and that device uses this menu from now on. New menu makes one no device uses yet.";function U(i){return`Pick which menu this ${ne(i.kind)} uses. Click a menu to edit it.`}var De={anywhere:"Anywhere menus",entity:"Entity quick menus"},O=`${B} Its menus can change after that.`;function C(i){return`${i}'s menus have unsaved edits. Save or discard them first.`}function K(i){return be({uiState:new Map,document:M(i),switcherPages:[]},i.unit)}function Ee(i,r,e=()=>{}){return[{id:v,label:"All",count:r===void 0?0:g(r).length},...i.map(n=>{let t=e(n.ownerId);return{id:n.ownerId,label:n.name,kind:n.kind,...t===void 0?{}:{color:t},count:r===void 0?0:$.filter(s=>E(r,n.ownerId,s)!==void 0).length}})]}function Ie(i,r){return[{key:"all",label:"All",count:i.length},{key:"watch",label:"Watches",count:i.filter(e=>x(e.owners,"watch",r)).length},{key:"iphone",label:"iPhones",count:i.filter(e=>x(e.owners,"iphone",r)).length}]}function Se(i,r,e){return F(i.name,r)?!0:e.some(n=>i.owners.some(t=>D(t,n.ownerId))&&F(n.name,r)&&r.trim()!=="")}function A(i,r="",e="all",n=[]){return g(i).filter(t=>Se(t,r,n)&&x(t.owners,e,n))}function Fe(i){return $.map(r=>({unit:r,menus:i.filter(e=>e.unit===r)}))}function H(i,r,e,n){let t=n.filter(s=>i.owners.some(o=>D(o,s.ownerId)));return(r===v?void 0:t.find(s=>s.ownerId===r))??(e==="all"?void 0:t.find(s=>s.kind===e))??t.find(s=>s.kind==="watch")??t[0]}function Re(i,r){return $.map(e=>({unit:e,title:ie[e],menu:E(i,r,e),others:I(i,r,e)}))}function _e(i,r,e){return`${i.name} \xB7 ${K(i)} \xB7 ${ae(i.owners,r,e)}`}function Pe(i,r,e,n){return $.flatMap(t=>I(i,r,t)).filter(t=>Se(t,e,n))}function T(i,r){let e=r==="entity"?"New quick menu":"New menu",n=new Set((i===void 0?[]:g(i)).map(t=>t.name.trim().toLowerCase()));if(!n.has(e.toLowerCase()))return e;for(let t=2;;t++)if(!n.has(`${e} ${t}`.toLowerCase()))return`${e} ${t}`}function Ue(i){return`Made ${i}. Tick a device on its card to use it there.`}var Oe="Only a Home Assistant administrator can make a new menu.";function Ce(i,r=oe()){return Object.fromEntries(Q[i].flatMap(e=>Object.hasOwn(r,e)?[[e,structuredClone(r[e])]]:[]))}function V(i,r,e="all"){return i.length===0?"No watch or iPhone has connected yet. Pair one on the Home tab.":r.trim()!==""?"No menu or device has that name.":e!=="all"?`No menu here is used on ${e==="watch"?"a watch":"an iPhone"}.`:"None yet."}var ze=180,Be=W.screen,Ye=2e3,Ve="wrist-assistant-panel.all-menus.v1",L;function q(){if(L!==void 0)return L;let i={kind:"all"};try{let r=window.localStorage.getItem(Ve),e=r?JSON.parse(r):{};typeof e.filter=="string"&&(i.filter=e.filter),(e.kind==="watch"||e.kind==="iphone")&&(i.kind=e.kind)}catch{}return L=i,i}function Ke(i){L={...q(),...i};try{window.localStorage.setItem(Ve,JSON.stringify(L))}catch{}}var Ae=i=>ve(i)?.dirty??!1,He=new WeakMap,c=class extends z{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.search="";this.deleting=!1;this.hassDrawnAt=0;this.lib=new de(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.colorsFor=G();this.colorOf=e=>J(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.newForm!==void 0&&!this.newForm.busy?(e.preventDefault(),this.newForm=void 0):this.deleteAsk!==void 0&&!this.deleting&&(e.preventDefault(),this.deleteAsk=void 0))}}get hass(){return this.hassNow}set hass(e){let n=this.hassNow===void 0;this.hassNow=e;let t=Date.now();(n||t-this.hassDrawnAt>=Ye)&&(this.hassDrawnAt=t,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown)}get devices(){return ee(this.owners,this.phones)}get filter(){return ce(q().filter,this.devices)}filterDevice(){let e=this.filter;return e===v?void 0:this.devices.find(n=>n.ownerId===e)}get deviceKind(){return he(q().kind,this.devices)}waiting(e){let n=new Map;for(let t of this.devices)n.set(t.ownerId,{held:re(e,t.ownerId,"menus"),free:!1});return te(this.owners,n)}setFilter(e){Ke({filter:e}),this.newForm=void 0,this.deleteAsk=void 0,this.requestUpdate()}setDeviceKind(e){Ke({kind:e}),this.requestUpdate()}open(e,n){let t=n??H(e,this.filter,this.deviceKind,this.devices);if(t===void 0){this.onOpenLibrary?.(e.id);return}_(t.ownerId,e.unit),this.onOpen?.(t.ownerId,t.kind)}openUnit(e,n){_(e.ownerId,n),this.onOpen?.(e.ownerId,e.kind)}use(e,n){let t=this.lib.store;t!==void 0&&t.pickMenu(n,e.unit,e.id)}get mayMake(){return this.hassNow?.user?.is_admin!==!1}toggleNew(){if(this.newForm?.busy)return;if(this.newForm!==void 0){this.newForm=void 0;return}let e="anywhere";this.newNote=void 0,this.newForm={unit:e,name:T(this.lib.library,e),busy:!1},this.updateComplete.then(()=>$e(this.renderRoot))}setNewUnit(e,n){let t=this.lib.library,s=e.name===T(t,e.unit)?T(t,n):e.name;this.newForm={...e,unit:n,name:s}}async makeMenu(){let e=this.newForm,n=this.lib.store;if(e===void 0||e.busy||n===void 0)return;let t=e.name.trim();if(t===""){this.newForm={...e,note:{kind:"warn",text:"Give the menu a name."}};return}let{note:s,...o}=e;this.newForm={...o,busy:!0};let l=await n.createMenu(e.unit,t,Ce(e.unit));if(!l.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${l.text}`}};return}this.newForm=void 0,this.onOpenLibrary!==void 0?this.onOpenLibrary(l.reply.id):this.newNote={kind:"ok",text:Ue(t)}}async deleteMenu(e){let n=this.lib.store;n===void 0||this.deleting||(this.deleting=!0,await n.deleteItem("menus",e.id),this.deleting=!1,this.deleteAsk=void 0)}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return d`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let n=this.lib.library,t=this.lib.readState,s=this.filterDevice(),o=this.filter,l=e.length>1,u=n===void 0?t==="unsupported"?Z:t==="failed"?this.lib.store?.readError??"Could not read the library.":"Reading the menus\u2026":Te(g(n).length),f=n!==void 0&&t==="failed";return d`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Menus</h1>
          <p class="ap-lead">${u}</p>
        </div>
        ${n===void 0?p:this.renderNewButton()}
      </div>
      ${this.newForm===void 0?p:this.renderNewDialog(this.newForm)}
      ${this.newNote===void 0?p:d`<p class="lt-line ${this.newNote.kind}" role="status">${this.newNote.text}</p>`}
      ${f?d`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:p}
      <div class="pk-surface pk-page" role="region" aria-label="Your menus">
        <div class="pk-pin">
          ${this.renderHead(n,s,e)}
          ${l?this.renderTabs(e,n,o):p}
        </div>
        <div class="pk-body" role=${l?"tabpanel":p} aria-labelledby=${l?`am-tab-${o}`:p}>
          ${n===void 0?d`<p class="ap-empty">${u}</p>`:e.length===0?d`<p class="ap-empty">${V(e,this.search)}</p>`:s===void 0?this.renderSections(n,e):this.renderDevice(n,s,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${s===void 0?Ne:U(s)}</span></div>
      </div>
    </div></div>`}renderSections(e,n){let t=A(e,this.search,this.deviceKind,n),s=this.waiting(e);return d`${Fe(t).map(({unit:o,menus:l})=>d`<section class="am-section" aria-labelledby=${`am-section-${o}`}>
      <div class="am-section-head">
        <h2 class="am-section-title" id=${`am-section-${o}`}>${De[o]} <span class="am-section-n">${l.length}</span></h2>
      </div>
      ${l.length===0?d`<p class="ap-empty">${V(n,this.search,this.deviceKind)}</p>`:d`<div class="ap-grid" role="list">${l.map(u=>this.renderCard(e,u,n,s))}</div>`}
    </section>`)}`}renderNewButton(){let e=this.mayMake,n=this.newForm!==void 0;return d`<button type="button" class="am-new-btn ${n?"on":""}" aria-expanded=${n?"true":"false"}
      ?disabled=${!e||this.newForm?.busy===!0} title=${e?"Make a new menu no device uses yet":Oe}
      @click=${()=>this.toggleNew()}>${k("plus")}<span>New menu</span></button>`}renderNewDialog(e){return ke("menus",e,[],{onName:n=>{this.newForm={...e,name:n}},onUnit:n=>this.setNewUnit(e,n),onMake:()=>{this.makeMenu()},onClose:()=>{e.busy||(this.newForm=void 0)}})}renderHead(e,n,t){return d`<div class="pk-head">
      ${n===void 0&&e!==void 0&&pe(t)?this.renderKinds(e,t):p}
      <label class="pk-search">
        ${k("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by menu or device" aria-label="Search menus"
          @input=${s=>{this.search=s.target.value}} />
      </label>
    </div>`}renderKinds(e,n){let t=this.deviceKind,s=Ie(A(e,this.search,"all",n),n);return d`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label="Show the menus used on one kind of device" .value=${t}
        @change=${o=>this.setDeviceKind(o.target.value)}>
        ${s.map(o=>d`<option value=${o.key} ?selected=${o.key===t}>${o.label} (${o.count})</option>`)}
      </select>
    </label>`}renderTabs(e,n,t){return d`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${Ee(e,n,this.colorOf).map(s=>d`<button type="button" role="tab" class="pk-tab ${s.id===t?"on":""}"
        style=${s.color===void 0?p:`--dc:${s.color}`} id=${`am-tab-${s.id}`} aria-selected=${s.id===t?"true":"false"}
        title=${s.id===v?"Every menu in your home":`The menus ${s.label} uses`}
        @click=${()=>this.setFilter(s.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${k(s.kind===void 0?"grid":s.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${s.label}</span>
        <span class="pk-tab-count">${s.count}</span>
      </button>`)}
    </div>`}renderCardTicks(e,n,t,s,o){let l=this.lib.store,u=l?.noteFor("menus",n.id),f=this.hassNow?.user?.is_admin;return le({library:e,kind:"menus",itemId:n.id,devices:t,colorOf:this.colorOf,...l===void 0?{}:{pending:l.pending},...u===void 0?{}:{note:u},...f===void 0?{}:{admin:f},...o===void 0?{}:{addFor:o},locked:m=>{if(!se(e,m,"menus",n.id)){if(Ae(m))return C(t.find(N=>N.ownerId===m)?.name??"This device");if(s.has(m))return O}}},m=>this.use(n,m))}renderCard(e,n,t,s,o){let l=H(n,o===void 0?this.filter:v,this.deviceKind,t),u=l===void 0?me(n.name):`Edit ${n.name} on ${l.name}`,f=n.owners.length===0,m=this.deleteAsk===n.id;return d`<div class="ap-card ${o===void 0?"":"lt-dim"}" role="listitem" data-card=${n.id}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${u} @click=${()=>this.open(n)}>
          <b class="ap-name">${n.name}</b>
          <small class="ap-detail">${K(n)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${u} @click=${()=>this.open(n)}>
        ${this.renderThumb(e,n,l,o===void 0?ze:92)}
      </button>
      ${this.renderCardTicks(e,n,t,s,o)}
      ${f?m?d`<div class="am-del-ask" role="alertdialog" aria-label=${`Delete ${n.name}?`}>
          <span><b>Delete ${n.name}?</b> No device uses it. This cannot be undone.</span>
          <span class="am-new-acts">
            <button type="button" class="am-btn danger" ?disabled=${this.deleting} @click=${()=>{this.deleteMenu(n)}}>Really delete</button>
            <button type="button" class="am-btn" ?disabled=${this.deleting} @click=${()=>{this.deleteAsk=void 0}}>Cancel</button>
          </span>
        </div>`:d`<button type="button" class="am-btn danger am-del" title=${`Delete ${n.name} from the library`}
          @click=${()=>{this.deleteAsk=n.id}}>${k("delete")}<span>Delete</span></button>`:p}
    </div>`}renderThumb(e,n,t,s){let o=this.hassNow;if(o===void 0||this.icons===void 0)return p;let l=He.get(n);l===void 0&&(l=M(n),He.set(n,l));let u=t===void 0?void 0:S(e,t.ownerId);return d`<wa-menu-thumbs .hass=${o} .icons=${this.icons} .tick=${this.iconsTick} .menus=${l}
      .pages=${u} .screen=${Be} .height=${s} menu=${n.unit}></wa-menu-thumbs>`}renderDevice(e,n,t){let s=Re(e,n.ownerId),o=Pe(e,n.ownerId,this.search,t),l=this.waiting(e),u=this.lib.store,f=S(e,n.ownerId),m=Ae(n.ownerId)?C(n.name):l.has(n.ownerId)?O:void 0,N=s.flatMap(a=>[a.menu,...a.others]).map(a=>a===void 0?void 0:u?.noteFor("menus",a.id)).filter(a=>a!==void 0);return d`<div class="lt-view">
      <div class="lt-sect"><span>${R(n)} <small>${s.filter(a=>a.menu!==void 0).length}</small></span>
        <span class="lt-sect-r">${U(n)}</span></div>
      <div class="lt-list" role="list" aria-label=${R(n)}>${s.map(a=>d`<div class="lt-row" role="listitem" data-unit=${a.unit}>
        <button type="button" class="lt-row-open" title=${`Edit the ${a.title} on ${n.name}`} @click=${()=>this.openUnit(n,a.unit)}>
          ${a.menu===void 0?d`<span class="lr-ring" style=${`width:${P}px;height:${P}px`} aria-hidden="true"></span>`:ge({menu:a.menu,hass:this.hassNow,icons:this.icons,tick:this.iconsTick,onReady:()=>this.requestUpdate(),...a.unit==="anywhere"?{pages:f}:{}})}
          <span class="lt-row-nm"><span class="lt-row-n">${a.title}</span>
            <span class="lt-row-m">${a.menu===void 0?"None yet. Open it to set it up.":_e(a.menu,n.ownerId,t)}</span></span>
        </button>
        ${a.menu===void 0&&a.others.length===0?p:d`<select class="lt-pick-sel" aria-label=${`The ${a.title} ${n.name} uses`}
          .value=${Y(a.menu?.id??"")}
          ?disabled=${m!==void 0||u===void 0} title=${m??`Pick the ${a.title} ${n.name} uses`}
          @change=${y=>{let qe=y.target.value,X=a.others.find(Xe=>Xe.id===qe);X!==void 0&&this.use(X,n.ownerId)}}>
          ${a.menu===void 0?d`<option value="" selected disabled>Pick a menu</option>`:p}
          ${[...a.menu===void 0?[]:[a.menu],...a.others].map(y=>d`<option value=${y.id} ?selected=${y===a.menu}>${y.name}</option>`)}
        </select>`}
      </div>`)}</div>
      ${N.map(a=>d`<p class="lt-line warn" role="alert">${a}</p>`)}
      <div class="lt-sect"><span>${fe(n)} <small>${o.length}</small></span><span class="lt-sect-r">${we("menus")}</span></div>
      ${o.length===0?d`<p class="lt-line">${this.search.trim()===""?`${n.name} uses every menu in your home.`:"No other menu has that name."}</p>`:d`<div class="ap-grid" role="list">${o.map(a=>this.renderCard(e,a,t,l,n.ownerId))}</div>`}
    </div>`}static{this.styles=[xe,Me,ue,ye,Le,j`
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
  `]}};h([w({attribute:!1})],c.prototype,"owners",2),h([w({attribute:!1})],c.prototype,"ownersReady",2),h([w({attribute:!1})],c.prototype,"phones",2),h([w({attribute:!1})],c.prototype,"icons",2),h([w({attribute:!1})],c.prototype,"iconsTick",2),h([w({attribute:!1})],c.prototype,"onOpen",2),h([w({attribute:!1})],c.prototype,"onOpenLibrary",2),h([b()],c.prototype,"search",2),h([b()],c.prototype,"newForm",2),h([b()],c.prototype,"newNote",2),h([b()],c.prototype,"deleteAsk",2),h([b()],c.prototype,"deleting",2);customElements.get("wa-all-menus")||customElements.define("wa-all-menus",c);export{c as WaAllMenus};
