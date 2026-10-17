import"./chunk-26N64JXJ.js";import{b as pe}from"./chunk-T4E4TTAR.js";import{e as ce,k as _}from"./chunk-FQKLXJAU.js";import{B as ke,C as $e,g as v,i as fe,j as we,k as be,l as T,n as U,u as ve,v as P,x as ge,y as ye}from"./chunk-MKWHY2GZ.js";import"./chunk-7QMILJZ6.js";import"./chunk-LX6LATG3.js";import"./chunk-6XZO4JVD.js";import"./chunk-VHO6GDGA.js";import{o as R,s as he,t as me}from"./chunk-GAVABFF2.js";import{Aa as ue,a as b,b as Z,f as ee,ga as D,ha as x,la as y,na as se,oa as ae,ra as I,sa as S,ta as L,ua as F,wa as re,ya as de,za as le}from"./chunk-KFS3CZW3.js";import{b as oe}from"./chunk-FYR2VWO6.js";import"./chunk-LESPJWE4.js";import"./chunk-7EB7VJ2Y.js";import"./chunk-KWW4YU3S.js";import"./chunk-QYWKU5Q3.js";import{a as ne,b as te,g as ie}from"./chunk-TE5Q2R5V.js";import"./chunk-PEI2F5V4.js";import"./chunk-ZOJGMATP.js";import"./chunk-F32PSVAR.js";import"./chunk-NXR7NIET.js";import"./chunk-UPANJPAF.js";import"./chunk-CWTJRXV4.js";import"./chunk-AMGXZUWS.js";import{b as G,c as Q}from"./chunk-ZHPGRUAI.js";import"./chunk-GR4P77YP.js";import"./chunk-ZKYND2IQ.js";import{X as J,z as W}from"./chunk-TSLSRAEH.js";import"./chunk-ESIOP3D4.js";import"./chunk-X2QLAQLV.js";import{b as j,d as o,g as c,j as B,k as w,l as g,nh as $}from"./chunk-E5S2SHQS.js";import{Y}from"./chunk-PPFKQRTD.js";import{a as h}from"./chunk-LO2NM3CE.js";var Ve="Each device uses one Anywhere menu and one Entity quick menu.";function xe(i){return`${i} ${i===1?"menu":"menus"} in your home. ${Ve}`}var Me="Click a menu to edit it. Pick a device on a card and that device uses this menu from now on. New menu makes one no device uses yet.";function O(i){return`Pick which menu this ${te(i.kind)} uses. Click a menu to edit it.`}var Le={anywhere:"Anywhere menus",entity:"Entity quick menus"},C=`${Y} Its menus can change after that.`;function K(i){return`${i}'s menus have unsaved edits. Save or discard them first.`}function H(i){return pe({uiState:new Map,document:L(i),switcherPages:[]},i.unit)}function Te(i,a,e=()=>{}){return[{id:v,label:"All",count:a===void 0?0:y(a).length},...i.map(n=>{let t=e(n.ownerId);return{id:n.ownerId,label:n.name,kind:n.kind,...t===void 0?{}:{color:t},count:a===void 0?0:b.filter(s=>I(a,n.ownerId,s)!==void 0).length}})]}function Ne(i,a){return[{key:"all",label:"All",count:i.length},{key:"watch",label:"Watches",count:i.filter(e=>T(e.owners,"watch",a)).length},{key:"iphone",label:"iPhones",count:i.filter(e=>T(e.owners,"iphone",a)).length}]}function Ee(i,a,e){return U(i.name,a)?!0:e.some(n=>i.owners.some(t=>D(t,n.ownerId))&&U(n.name,a)&&a.trim()!=="")}function A(i,a="",e="all",n=[]){return y(i).filter(t=>Ee(t,a,n)&&T(t.owners,e,n))}function De(i){return b.map(a=>({unit:a,menus:i.filter(e=>e.unit===a)}))}function q(i,a,e,n){let t=n.filter(s=>i.owners.some(d=>D(d,s.ownerId)));return(a===v?void 0:t.find(s=>s.ownerId===a))??(e==="all"?void 0:t.find(s=>s.kind===e))??t.find(s=>s.kind==="watch")??t[0]}function Ie(i,a){return b.map(e=>({unit:e,title:x[e],menu:I(i,a,e),others:S(i,a,e)}))}function Se(i,a,e){return`${i.name} \xB7 ${H(i)} \xB7 ${re(i.owners,a,e)}`}function Fe(i,a,e,n){return b.flatMap(t=>S(i,a,t)).filter(t=>Ee(t,e,n))}function N(i,a){let e=a==="entity"?"New quick menu":"New menu",n=new Set((i===void 0?[]:y(i)).map(t=>t.name.trim().toLowerCase()));if(!n.has(e.toLowerCase()))return e;for(let t=2;;t++)if(!n.has(`${e} ${t}`.toLowerCase()))return`${e} ${t}`}function _e(i){return`It starts as the app's own ${x[i]}. No device uses it until you tick one on its card.`}function Re(i){return`Made ${i}. Tick a device on its card to use it there.`}var Ue="Only a Home Assistant administrator can make a new menu.";function Pe(i,a=oe()){return Object.fromEntries(Z[i].flatMap(e=>Object.hasOwn(a,e)?[[e,structuredClone(a[e])]]:[]))}function V(i,a,e="all"){return i.length===0?"No watch or iPhone has connected yet. Pair one on the Home tab.":a.trim()!==""?"No menu or device has that name.":e!=="all"?`No menu here is used on ${e==="watch"?"a watch":"an iPhone"}.`:"None yet."}var ze=180,Xe=J.screen,je=2e3,He="wrist-assistant-panel.all-menus.v1",M;function z(){if(M!==void 0)return M;let i={kind:"all"};try{let a=window.localStorage.getItem(He),e=a?JSON.parse(a):{};typeof e.filter=="string"&&(i.filter=e.filter),(e.kind==="watch"||e.kind==="iphone")&&(i.kind=e.kind)}catch{}return M=i,i}function Oe(i){M={...z(),...i};try{window.localStorage.setItem(He,JSON.stringify(M))}catch{}}var Ce=i=>ce(i)?.dirty??!1,Ke=new WeakMap,p=class extends B{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.search="";this.deleting=!1;this.hassDrawnAt=0;this.lib=new de(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.colorsFor=Q();this.colorOf=e=>G(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.newForm!==void 0&&!this.newForm.busy?(e.preventDefault(),this.newForm=void 0):this.deleteAsk!==void 0&&!this.deleting&&(e.preventDefault(),this.deleteAsk=void 0))}}get hass(){return this.hassNow}set hass(e){let n=this.hassNow===void 0;this.hassNow=e;let t=Date.now();(n||t-this.hassDrawnAt>=je)&&(this.hassDrawnAt=t,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown)}get devices(){return ne(this.owners,this.phones)}get filter(){return fe(z().filter,this.devices)}filterDevice(){let e=this.filter;return e===v?void 0:this.devices.find(n=>n.ownerId===e)}get deviceKind(){return be(z().kind,this.devices)}waiting(e){let n=new Map;for(let t of this.devices)n.set(t.ownerId,{held:ae(e,t.ownerId,"menus"),free:!1});return ie(this.owners,n)}setFilter(e){Oe({filter:e}),this.newForm=void 0,this.deleteAsk=void 0,this.requestUpdate()}setDeviceKind(e){Oe({kind:e}),this.requestUpdate()}open(e,n){let t=n??q(e,this.filter,this.deviceKind,this.devices);if(t===void 0){this.onOpenLibrary?.(e.id);return}_(t.ownerId,e.unit),this.onOpen?.(t.ownerId,t.kind)}openUnit(e,n){_(e.ownerId,n),this.onOpen?.(e.ownerId,e.kind)}use(e,n){let t=this.lib.store;t!==void 0&&t.pickMenu(n,e.unit,e.id)}get mayMake(){return this.hassNow?.user?.is_admin!==!1}toggleNew(){if(this.newForm?.busy)return;if(this.newForm!==void 0){this.newForm=void 0;return}let e="anywhere";this.newNote=void 0,this.newForm={unit:e,name:N(this.lib.library,e),busy:!1},this.updateComplete.then(()=>this.renderRoot.querySelector?.(".am-new input")?.select())}setNewUnit(e,n){let t=this.lib.library,s=e.name===N(t,e.unit)?N(t,n):e.name;this.newForm={...e,unit:n,name:s}}async makeMenu(){let e=this.newForm,n=this.lib.store;if(e===void 0||e.busy||n===void 0)return;let t=e.name.trim();if(t===""){this.newForm={...e,note:{kind:"warn",text:"Give the menu a name."}};return}let{note:s,...d}=e;this.newForm={...d,busy:!0};let l=await n.createMenu(e.unit,t,Pe(e.unit));if(!l.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${l.text}`}};return}this.newForm=void 0,this.onOpenLibrary!==void 0?this.onOpenLibrary(l.reply.id):this.newNote={kind:"ok",text:Re(t)}}async deleteMenu(e){let n=this.lib.store;n===void 0||this.deleting||(this.deleting=!0,await n.deleteItem("menus",e.id),this.deleting=!1,this.deleteAsk=void 0)}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return o`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let n=this.lib.library,t=this.lib.readState,s=this.filterDevice(),d=this.filter,l=e.length>1,u=n===void 0?t==="unsupported"?ee:t==="failed"?this.lib.store?.readError??"Could not read the library.":"Reading the menus\u2026":xe(y(n).length),f=n!==void 0&&t==="failed";return o`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Menus</h1>
          <p class="ap-lead">${u}</p>
        </div>
        ${n===void 0?c:this.renderNewButton()}
      </div>
      ${this.newForm===void 0?c:this.renderNewForm(this.newForm)}
      ${this.newNote===void 0?c:o`<p class="lt-line ${this.newNote.kind}" role="status">${this.newNote.text}</p>`}
      ${f?o`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:c}
      <div class="pk-surface pk-page" role="region" aria-label="Your menus">
        <div class="pk-pin">
          ${this.renderHead(n,s,e)}
          ${l?this.renderTabs(e,n,d):c}
        </div>
        <div class="pk-body" role=${l?"tabpanel":c} aria-labelledby=${l?`am-tab-${d}`:c}>
          ${n===void 0?o`<p class="ap-empty">${u}</p>`:e.length===0?o`<p class="ap-empty">${V(e,this.search)}</p>`:s===void 0?this.renderSections(n,e):this.renderDevice(n,s,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${s===void 0?Me:O(s)}</span></div>
      </div>
    </div></div>`}renderSections(e,n){let t=A(e,this.search,this.deviceKind,n),s=this.waiting(e);return o`${De(t).map(({unit:d,menus:l})=>o`<section class="am-section" aria-labelledby=${`am-section-${d}`}>
      <div class="am-section-head">
        <h2 class="am-section-title" id=${`am-section-${d}`}>${Le[d]} <span class="am-section-n">${l.length}</span></h2>
      </div>
      ${l.length===0?o`<p class="ap-empty">${V(n,this.search,this.deviceKind)}</p>`:o`<div class="ap-grid" role="list">${l.map(u=>this.renderCard(e,u,n,s))}</div>`}
    </section>`)}`}renderNewButton(){let e=this.mayMake,n=this.newForm!==void 0;return o`<button type="button" class="am-new-btn ${n?"on":""}" aria-expanded=${n?"true":"false"}
      ?disabled=${!e||this.newForm?.busy===!0} title=${e?"Make a new menu no device uses yet":Ue}
      @click=${()=>this.toggleNew()}>${$("plus")}<span>New menu</span></button>`}renderNewForm(e){return o`<form class="am-new" aria-label="New menu" @submit=${n=>{n.preventDefault(),this.makeMenu()}}>
      <label class="am-new-field"><span>Name</span>
        <input type="text" .value=${e.name} ?disabled=${e.busy} maxlength="80"
          @input=${n=>{this.newForm={...e,name:n.target.value}}} /></label>
      <label class="am-new-field"><span>For</span>
        <select class="lt-pick-sel" ?disabled=${e.busy}
          @change=${n=>this.setNewUnit(e,n.target.value)}>
          ${b.map(n=>o`<option value=${n} ?selected=${n===e.unit}>${x[n]}</option>`)}
        </select></label>
      <p class="am-new-text">${_e(e.unit)}</p>
      <span class="am-new-acts">
        <button type="submit" class="am-btn primary" ?disabled=${e.busy}>${e.busy?"Making\u2026":"Make menu"}</button>
        <button type="button" class="am-btn" ?disabled=${e.busy} @click=${()=>{this.newForm=void 0}}>Cancel</button>
      </span>
      ${e.note===void 0?c:o`<p class="lt-line ${e.note.kind}" role="status">${e.note.text}</p>`}
    </form>`}renderHead(e,n,t){return o`<div class="pk-head">
      ${n===void 0&&e!==void 0&&we(t)?this.renderKinds(e,t):c}
      <label class="pk-search">
        ${$("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by menu or device" aria-label="Search menus"
          @input=${s=>{this.search=s.target.value}} />
      </label>
    </div>`}renderKinds(e,n){let t=this.deviceKind,s=Ne(A(e,this.search,"all",n),n);return o`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label="Show the menus used on one kind of device" .value=${t}
        @change=${d=>this.setDeviceKind(d.target.value)}>
        ${s.map(d=>o`<option value=${d.key} ?selected=${d.key===t}>${d.label} (${d.count})</option>`)}
      </select>
    </label>`}renderTabs(e,n,t){return o`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${Te(e,n,this.colorOf).map(s=>o`<button type="button" role="tab" class="pk-tab ${s.id===t?"on":""}"
        style=${s.color===void 0?c:`--dc:${s.color}`} id=${`am-tab-${s.id}`} aria-selected=${s.id===t?"true":"false"}
        title=${s.id===v?"Every menu in your home":`The menus ${s.label} uses`}
        @click=${()=>this.setFilter(s.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${$(s.kind===void 0?"grid":s.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${s.label}</span>
        <span class="pk-tab-count">${s.count}</span>
      </button>`)}
    </div>`}renderCardTicks(e,n,t,s,d){let l=this.lib.store,u=l?.noteFor("menus",n.id),f=this.hassNow?.user?.is_admin;return le({library:e,kind:"menus",itemId:n.id,devices:t,colorOf:this.colorOf,...l===void 0?{}:{pending:l.pending},...u===void 0?{}:{note:u},...f===void 0?{}:{admin:f},...d===void 0?{}:{addFor:d},locked:m=>{if(!se(e,m,"menus",n.id)){if(Ce(m))return K(t.find(E=>E.ownerId===m)?.name??"This device");if(s.has(m))return C}}},m=>this.use(n,m))}renderCard(e,n,t,s,d){let l=q(n,d===void 0?this.filter:v,this.deviceKind,t),u=l===void 0?ve(n.name):`Edit ${n.name} on ${l.name}`,f=n.owners.length===0,m=this.deleteAsk===n.id;return o`<div class="ap-card ${d===void 0?"":"lt-dim"}" role="listitem" data-card=${n.id}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${u} @click=${()=>this.open(n)}>
          <b class="ap-name">${n.name}</b>
          <small class="ap-detail">${H(n)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${u} @click=${()=>this.open(n)}>
        ${this.renderThumb(e,n,l,d===void 0?ze:92)}
      </button>
      ${this.renderCardTicks(e,n,t,s,d)}
      ${f?m?o`<div class="am-del-ask" role="alertdialog" aria-label=${`Delete ${n.name}?`}>
          <span><b>Delete ${n.name}?</b> No device uses it. This cannot be undone.</span>
          <span class="am-new-acts">
            <button type="button" class="am-btn danger" ?disabled=${this.deleting} @click=${()=>{this.deleteMenu(n)}}>Really delete</button>
            <button type="button" class="am-btn" ?disabled=${this.deleting} @click=${()=>{this.deleteAsk=void 0}}>Cancel</button>
          </span>
        </div>`:o`<button type="button" class="am-btn danger am-del" title=${`Delete ${n.name} from the library`}
          @click=${()=>{this.deleteAsk=n.id}}>${$("delete")}<span>Delete</span></button>`:c}
    </div>`}renderThumb(e,n,t,s){let d=this.hassNow;if(d===void 0||this.icons===void 0)return c;let l=Ke.get(n);l===void 0&&(l=L(n),Ke.set(n,l));let u=t===void 0?void 0:F(e,t.ownerId);return o`<wa-menu-thumbs .hass=${d} .icons=${this.icons} .tick=${this.iconsTick} .menus=${l}
      .pages=${u} .screen=${Xe} .height=${s} menu=${n.unit}></wa-menu-thumbs>`}renderDevice(e,n,t){let s=Ie(e,n.ownerId),d=Fe(e,n.ownerId,this.search,t),l=this.waiting(e),u=this.lib.store,f=F(e,n.ownerId),m=Ce(n.ownerId)?K(n.name):l.has(n.ownerId)?C:void 0,E=s.flatMap(r=>[r.menu,...r.others]).map(r=>r===void 0?void 0:u?.noteFor("menus",r.id)).filter(r=>r!==void 0);return o`<div class="lt-view">
      <div class="lt-sect"><span>${P(n)} <small>${s.filter(r=>r.menu!==void 0).length}</small></span>
        <span class="lt-sect-r">${O(n)}</span></div>
      <div class="lt-list" role="list" aria-label=${P(n)}>${s.map(r=>o`<div class="lt-row" role="listitem" data-unit=${r.unit}>
        <button type="button" class="lt-row-open" title=${`Edit the ${r.title} on ${n.name}`} @click=${()=>this.openUnit(n,r.unit)}>
          ${r.menu===void 0?o`<span class="lr-ring" style=${`width:${R}px;height:${R}px`} aria-hidden="true"></span>`:he({menu:r.menu,hass:this.hassNow,icons:this.icons,tick:this.iconsTick,onReady:()=>this.requestUpdate(),...r.unit==="anywhere"?{pages:f}:{}})}
          <span class="lt-row-nm"><span class="lt-row-n">${r.title}</span>
            <span class="lt-row-m">${r.menu===void 0?"None yet. Open it to set it up.":Se(r.menu,n.ownerId,t)}</span></span>
        </button>
        ${r.menu===void 0&&r.others.length===0?c:o`<select class="lt-pick-sel" aria-label=${`The ${r.title} ${n.name} uses`}
          .value=${W(r.menu?.id??"")}
          ?disabled=${m!==void 0||u===void 0} title=${m??`Pick the ${r.title} ${n.name} uses`}
          @change=${k=>{let Ae=k.target.value,X=r.others.find(qe=>qe.id===Ae);X!==void 0&&this.use(X,n.ownerId)}}>
          ${r.menu===void 0?o`<option value="" selected disabled>Pick a menu</option>`:c}
          ${[...r.menu===void 0?[]:[r.menu],...r.others].map(k=>o`<option value=${k.id} ?selected=${k===r.menu}>${k.name}</option>`)}
        </select>`}
      </div>`)}</div>
      ${E.map(r=>o`<p class="lt-line warn" role="alert">${r}</p>`)}
      <div class="lt-sect"><span>${ge(n)} <small>${d.length}</small></span><span class="lt-sect-r">${ye}</span></div>
      ${d.length===0?o`<p class="lt-line">${this.search.trim()===""?`${n.name} uses every menu in your home.`:"No other menu has that name."}</p>`:o`<div class="ap-grid" role="list">${d.map(r=>this.renderCard(e,r,t,l,n.ownerId))}</div>`}
    </div>`}static{this.styles=[$e,ke,ue,me,j`
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
    /* New menu's form, under the tab's head. */
    .am-new {
      display: flex; flex-wrap: wrap; align-items: flex-end; gap: 10px 14px; padding: 12px 14px;
      border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-card);
    }
    .am-new-field { display: flex; flex-direction: column; gap: 4px; font-size: 11.5px; color: var(--wa-muted); }
    .am-new-field input {
      width: 220px; max-width: 70vw; height: 28px; padding: 0 9px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
      font: inherit; font-size: 13px; color: var(--wa-ink); background: var(--wa-input, var(--wa-field));
    }
    .am-new-field input:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .am-new-text { flex: 1 1 220px; margin: 0; font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
    .am-new-acts { display: inline-flex; gap: 6px; flex: none; }
    .am-new .lt-line { flex-basis: 100%; }
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
  `]}};h([w({attribute:!1})],p.prototype,"owners",2),h([w({attribute:!1})],p.prototype,"ownersReady",2),h([w({attribute:!1})],p.prototype,"phones",2),h([w({attribute:!1})],p.prototype,"icons",2),h([w({attribute:!1})],p.prototype,"iconsTick",2),h([w({attribute:!1})],p.prototype,"onOpen",2),h([w({attribute:!1})],p.prototype,"onOpenLibrary",2),h([g()],p.prototype,"search",2),h([g()],p.prototype,"newForm",2),h([g()],p.prototype,"newNote",2),h([g()],p.prototype,"deleteAsk",2),h([g()],p.prototype,"deleting",2);customElements.get("wa-all-menus")||customElements.define("wa-all-menus",p);export{p as WaAllMenus};
