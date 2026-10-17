import"./chunk-VP7SLK2H.js";import{b as ve}from"./chunk-FYHJOJ2D.js";import{e as we,k as _}from"./chunk-XGP7LB35.js";import{B as Le,C as Te,g as k,i as ye,j as ke,k as $e,l as D,n as C,v as O,x as xe,y as Me}from"./chunk-HBH77Y4K.js";import"./chunk-VSEGYYJX.js";import"./chunk-Q56HR3OI.js";import"./chunk-DYHBMLHT.js";import{r as be,s as ge}from"./chunk-SK266QC4.js";import{a as M,c as se,ca as y,da as S,ga as $,ia as de,ja as le,ma as E,na as P,oa as N,pa as U,ra as ue,ta as ce,ua as pe,va as me}from"./chunk-RX7CVI6P.js";import{b as he,d as fe}from"./chunk-JFEP3FWP.js";import"./chunk-RA4FPVJ2.js";import"./chunk-5S6DYQOX.js";import"./chunk-L5EIEW65.js";import"./chunk-GWWN5AK2.js";import{a as re,b as ae,e as oe}from"./chunk-PF5FVRKR.js";import"./chunk-PEI2F5V4.js";import"./chunk-ZOJGMATP.js";import"./chunk-R3E32QPV.js";import"./chunk-NXR7NIET.js";import"./chunk-UPANJPAF.js";import"./chunk-LO75GSH6.js";import"./chunk-AMGXZUWS.js";import{b as te,c as ie}from"./chunk-23ND6PNG.js";import"./chunk-UYXASAN6.js";import"./chunk-ZKYND2IQ.js";import{X as ne,z as ee}from"./chunk-35RHOCYM.js";import"./chunk-ESIOP3D4.js";import"./chunk-A7XDUFM5.js";import{Eg as J,Gg as Q,b as B,d as l,g as m,j as G,k as b,l as g,nh as x}from"./chunk-PGBBLK6E.js";import{Va as F,Y as Z}from"./chunk-2ZMALKUC.js";import{a as w}from"./chunk-LO2NM3CE.js";var ze="Each device uses one Anywhere menu and one Entity quick menu.";function Ee(s){return`${s} ${s===1?"menu":"menus"} in your home. ${ze}`}var Ne="Click a menu to edit it. Pick a device on a card and that device uses this menu from now on. Give a menu a name so you can tell them apart.";function K(s){return`Pick which menu this ${ae(s.kind)} uses. Click a menu to edit it.`}var De={anywhere:"Anywhere menus",entity:"Entity quick menus"},A=`${Z} Its menus can change after that.`;function I(s){return`${s}'s menus have unsaved edits. Save or discard them first.`}function H(s){return ve({uiState:new Map,document:N(s),switcherPages:[]},s.unit)}function Ie(s,a,e=()=>{}){return[{id:k,label:"All",count:a===void 0?0:$(a).length},...s.map(n=>{let t=e(n.ownerId);return{id:n.ownerId,label:n.name,kind:n.kind,...t===void 0?{}:{color:t},count:a===void 0?0:M.filter(i=>E(a,n.ownerId,i)!==void 0).length}})]}function Re(s,a){return[{key:"all",label:"All",count:s.length},{key:"watch",label:"Watches",count:s.filter(e=>D(e.owners,"watch",a)).length},{key:"iphone",label:"iPhones",count:s.filter(e=>D(e.owners,"iphone",a)).length}]}function Fe(s,a,e){return C(s.name,a)?!0:e.some(n=>s.owners.some(t=>y(t,n.ownerId))&&C(n.name,a)&&a.trim()!=="")}function q(s,a="",e="all",n=[]){return $(s).filter(t=>Fe(t,a,n)&&D(t.owners,e,n))}function Se(s){return M.map(a=>({unit:a,menus:s.filter(e=>e.unit===a)}))}function V(s,a,e,n){let t=n.filter(i=>s.owners.some(r=>y(r,i.ownerId)));return(a===k?void 0:t.find(i=>i.ownerId===a))??(e==="all"?void 0:t.find(i=>i.kind===e))??t.find(i=>i.kind==="watch")??t[0]}var Pe="No device uses this menu. Pick one to edit it there.";function Ue(s,a){return M.map(e=>({unit:e,title:S[e],menu:E(s,a,e),others:P(s,a,e)}))}function _e(s,a,e){return`${s.name} \xB7 ${H(s)} \xB7 ${ue(s.owners,a,e)}`}function Ce(s,a,e,n){return M.flatMap(t=>P(s,a,t)).filter(t=>Fe(t,e,n))}function Oe(s,a){let e=a==="entity"?"New quick menu":"New menu",n=new Set((s===void 0?[]:$(s)).map(t=>t.name.trim().toLowerCase()));if(!n.has(e.toLowerCase()))return e;for(let t=2;;t++)if(!n.has(`${e} ${t}`.toLowerCase()))return`${e} ${t}`}function j(s,a,e){return s===void 0?[]:e.filter(n=>E(s,n.ownerId,a)!==void 0)}function Ke(s,a){let e=`It starts as the app's own ${S[s]}`;return a===void 0?`${e}.`:`${e}, and ${a.name} uses it from now on.`}var z="No device has its menus in Home Assistant yet. Open a device's Menus first.";function W(s,a,e="all"){return s.length===0?"No watch or iPhone has connected yet. Pair one on the Home tab.":a.trim()!==""?"No menu or device has that name.":e!=="all"?`No menu here is used on ${e==="watch"?"a watch":"an iPhone"}.`:"None yet."}var We={anywhere:["quickAction","pageSwitcher"],entity:["entityRadial"]};function Xe(s,a,e=he()){let n={...s};for(let t of We[a])Object.hasOwn(e,t)?n[t]=structuredClone(e[t]):delete n[t];return n}function Ye(s,a){let e=s.linkIds;if(typeof e!="object"||e===null||Array.isArray(e))return;let n=e[a];return typeof n=="string"&&n!==""?n:void 0}var Be=3;async function Ae(s,a,e,n,t=0){for(let i=1;;i++){let r;try{r=await s.read(a)}catch(p){let{code:c="unknown",message:v}=F(p);return{ok:!1,code:c,message:v}}let o=r.revision>0?fe(r.document):void 0;if(o===void 0||r.revision<t)return{ok:!1,code:"stale",message:"The device's menus were not read after the copy."};let u=Ye(o,e);if(u!==void 0&&!y(u,n))return{ok:!1,code:"moved",message:"The device uses another menu now."};try{return await s.save(a,r.revision,Xe(o,e)),{ok:!0}}catch(p){let{code:c="unknown",message:v}=F(p);if(c!=="conflict"||i>=Be)return{ok:!1,code:c,message:v}}}}var Ge=180,Je=ne.screen,Qe=2e3,Ve="wrist-assistant-panel.all-menus.v1",L;function Y(){if(L!==void 0)return L;let s={kind:"all"};try{let a=window.localStorage.getItem(Ve),e=a?JSON.parse(a):{};typeof e.filter=="string"&&(s.filter=e.filter),(e.kind==="watch"||e.kind==="iphone")&&(s.kind=e.kind)}catch{}return L=s,s}function He(s){L={...Y(),...s};try{window.localStorage.setItem(Ve,JSON.stringify(L))}catch{}}var X=s=>we(s)?.dirty??!1,qe=new WeakMap,h=class extends G{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.search="";this.deleting=!1;this.hassDrawnAt=0;this.lib=new ce(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.colorsFor=ie();this.colorOf=e=>te(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.newForm!==void 0&&!this.newForm.busy?(e.preventDefault(),this.newForm=void 0):this.deleteAsk!==void 0&&!this.deleting&&(e.preventDefault(),this.deleteAsk=void 0))}}get hass(){return this.hassNow}set hass(e){let n=this.hassNow===void 0;this.hassNow=e;let t=Date.now();(n||t-this.hassDrawnAt>=Qe)&&(this.hassDrawnAt=t,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown)}get devices(){return re(this.owners,this.phones)}get filter(){return ye(Y().filter,this.devices)}filterDevice(){let e=this.filter;return e===k?void 0:this.devices.find(n=>n.ownerId===e)}get deviceKind(){return $e(Y().kind,this.devices)}waiting(e){let n=new Map;for(let t of this.devices)n.set(t.ownerId,{held:le(e,t.ownerId,"menus"),free:!1});return oe(this.owners,n)}setFilter(e){He({filter:e}),this.openNote=void 0,this.newForm=void 0,this.deleteAsk=void 0,this.requestUpdate()}setDeviceKind(e){He({kind:e}),this.requestUpdate()}open(e,n){let t=n??V(e,this.filter,this.deviceKind,this.devices);if(t===void 0){this.openNote=e.id;return}this.openNote=void 0,_(t.ownerId,e.unit),this.onOpen?.(t.ownerId,t.kind)}openUnit(e,n){_(e.ownerId,n),this.onOpen?.(e.ownerId,e.kind)}use(e,n){let t=this.lib.store;t!==void 0&&(this.openNote===e.id&&(this.openNote=void 0),t.pickMenu(n,e.unit,e.id))}toggleNew(e){if(this.newForm?.busy)return;if(this.newForm?.unit===e){this.newForm=void 0;return}let n=this.lib.library,t=this.filterDevice(),i=j(n,e,this.devices),r=(t!==void 0&&i.some(o=>o.ownerId===t.ownerId)?t.ownerId:void 0)??i[0]?.ownerId;this.sectionNote=void 0,this.newForm={unit:e,name:Oe(n,e),busy:!1,...r===void 0?{}:{ownerId:r}},this.updateComplete.then(()=>this.renderRoot.querySelector?.(".am-new input")?.select())}async makeMenu(){let e=this.newForm,n=this.lib.store,t=this.hassNow;if(e===void 0||e.busy||n===void 0||t===void 0)return;let i=e.name.trim(),r=this.devices.find(f=>f.ownerId===e.ownerId);if(i===""){this.newForm={...e,note:{kind:"warn",text:"Give the menu a name."}};return}if(r===void 0){this.newForm={...e,note:{kind:"warn",text:z}};return}if(X(r.ownerId)){this.newForm={...e,note:{kind:"warn",text:I(r.name)}};return}let{note:o,...u}=e;this.newForm={...u,busy:!0};let p=await n.copyMenu(r.ownerId,e.unit,i);if(!p.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${p.text}`}};return}let c=p.reply.revisions??{},v=Object.entries(c).find(([f])=>y(f,r.ownerId))?.[1],d=await Ae({read:f=>J(t,f,"menus"),save:(f,R,T)=>Q(t,f,"menus",R,T)},r.ownerId,e.unit,p.reply.id,v?.menus??0);await n.refresh(),this.newForm=void 0,this.sectionNote={unit:e.unit,note:d.ok?{kind:"ok",text:`Made ${i}. ${r.name} uses it from now on.`}:{kind:"warn",text:`Made ${i} as a copy of the menu ${r.name} used, and ${r.name} uses it from now on. It could not be set back to the app's own (${d.message.replace(/\.$/,"")}), so change it in the menu editor.`}}}async deleteMenu(e){let n=this.lib.store;n===void 0||this.deleting||(this.deleting=!0,await n.deleteItem("menus",e.id),this.deleting=!1,this.deleteAsk=void 0)}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return l`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let n=this.lib.library,t=this.lib.readState,i=this.filterDevice(),r=this.filter,o=e.length>1,u=n===void 0?t==="unsupported"?se:t==="failed"?this.lib.store?.readError??"Could not read the library.":"Reading the menus\u2026":Ee($(n).length);return l`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Menus</h1>
          <p class="ap-lead">${u}</p>
        </div>
      </div>
      ${n!==void 0&&t==="failed"?l`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:m}
      <div class="pk-surface pk-page" role="region" aria-label="Your menus">
        <div class="pk-pin">
          ${this.renderHead(n,i,e)}
          ${o?this.renderTabs(e,n,r):m}
        </div>
        <div class="pk-body" role=${o?"tabpanel":m} aria-labelledby=${o?`am-tab-${r}`:m}>
          ${n===void 0?l`<p class="ap-empty">${u}</p>`:e.length===0?l`<p class="ap-empty">${W(e,this.search)}</p>`:i===void 0?this.renderSections(n,e):this.renderDevice(n,i,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${i===void 0?Ne:K(i)}</span></div>
      </div>
    </div></div>`}renderSections(e,n){let t=q(e,this.search,this.deviceKind,n),i=this.waiting(e);return l`${Se(t).map(({unit:r,menus:o})=>l`<section class="am-section" aria-labelledby=${`am-section-${r}`}>
      <div class="am-section-head">
        <h2 class="am-section-title" id=${`am-section-${r}`}>${De[r]} <span class="am-section-n">${o.length}</span></h2>
        <button type="button" class="am-new-btn ${this.newForm?.unit===r?"on":""}" aria-expanded=${this.newForm?.unit===r?"true":"false"}
          ?disabled=${this.newForm?.busy===!0} title=${`Make a new ${r==="entity"?"Entity quick menu":"Anywhere menu"}`}
          @click=${()=>this.toggleNew(r)}>${x("plus")}<span>New menu</span></button>
      </div>
      ${this.newForm?.unit===r?this.renderNewForm(e,this.newForm,n):m}
      ${this.sectionNote?.unit===r?l`<p class="lt-line ${this.sectionNote.note.kind}" role="status">${this.sectionNote.note.text}</p>`:m}
      ${o.length===0?l`<p class="ap-empty">${W(n,this.search,this.deviceKind)}</p>`:l`<div class="ap-grid" role="list">${o.map(u=>this.renderCard(e,u,n,i))}</div>`}
    </section>`)}`}renderNewForm(e,n,t){let i=j(e,n.unit,t),r=i.find(o=>o.ownerId===n.ownerId);return l`<form class="am-new" aria-label="New menu" @submit=${o=>{o.preventDefault(),this.makeMenu()}}>
      <label class="am-new-field"><span>Name</span>
        <input type="text" .value=${n.name} ?disabled=${n.busy} maxlength="80"
          @input=${o=>{this.newForm={...n,name:o.target.value}}} /></label>
      ${i.length===0?m:l`<label class="am-new-field"><span>For</span>
        <select class="lt-pick-sel" ?disabled=${n.busy||i.length<2}
          @change=${o=>{this.newForm={...n,ownerId:o.target.value}}}>
          ${i.map(o=>l`<option value=${o.ownerId} ?selected=${o.ownerId===n.ownerId}>${o.name}</option>`)}
        </select></label>`}
      <p class="am-new-text">${i.length===0?z:Ke(n.unit,r)}</p>
      <span class="am-new-acts">
        <button type="submit" class="am-btn primary" ?disabled=${n.busy||r===void 0}>${n.busy?"Making\u2026":"Make menu"}</button>
        <button type="button" class="am-btn" ?disabled=${n.busy} @click=${()=>{this.newForm=void 0}}>Cancel</button>
      </span>
      ${n.note===void 0?m:l`<p class="lt-line ${n.note.kind}" role="status">${n.note.text}</p>`}
    </form>`}renderHead(e,n,t){return l`<div class="pk-head">
      ${n===void 0&&e!==void 0&&ke(t)?this.renderKinds(e,t):m}
      <label class="pk-search">
        ${x("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by menu or device" aria-label="Search menus"
          @input=${i=>{this.search=i.target.value}} />
      </label>
    </div>`}renderKinds(e,n){let t=this.deviceKind,i=Re(q(e,this.search,"all",n),n);return l`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label="Show the menus used on one kind of device" .value=${t}
        @change=${r=>this.setDeviceKind(r.target.value)}>
        ${i.map(r=>l`<option value=${r.key} ?selected=${r.key===t}>${r.label} (${r.count})</option>`)}
      </select>
    </label>`}renderTabs(e,n,t){return l`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${Ie(e,n,this.colorOf).map(i=>l`<button type="button" role="tab" class="pk-tab ${i.id===t?"on":""}"
        style=${i.color===void 0?m:`--dc:${i.color}`} id=${`am-tab-${i.id}`} aria-selected=${i.id===t?"true":"false"}
        title=${i.id===k?"Every menu in your home":`The menus ${i.label} uses`}
        @click=${()=>this.setFilter(i.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${x(i.kind===void 0?"grid":i.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${i.label}</span>
        <span class="pk-tab-count">${i.count}</span>
      </button>`)}
    </div>`}renderCardTicks(e,n,t,i,r){let o=this.lib.store,u=o?.noteFor("menus",n.id)??(this.openNote===n.id?Pe:void 0),p=this.hassNow?.user?.is_admin;return pe({library:e,kind:"menus",itemId:n.id,devices:t,colorOf:this.colorOf,...o===void 0?{}:{pending:o.pending},...u===void 0?{}:{note:u},...p===void 0?{}:{admin:p},...r===void 0?{}:{addFor:r},locked:c=>{if(!de(e,c,"menus",n.id)){if(X(c))return I(t.find(v=>v.ownerId===c)?.name??"This device");if(i.has(c))return A}}},c=>this.use(n,c))}renderCard(e,n,t,i,r){let o=V(n,r===void 0?this.filter:k,this.deviceKind,t),u=o===void 0?`No device uses ${n.name} yet`:`Edit ${n.name} on ${o.name}`,p=n.owners.length===0,c=this.deleteAsk===n.id;return l`<div class="ap-card ${r===void 0?"":"lt-dim"}" role="listitem" data-card=${n.id}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${u} @click=${()=>this.open(n)}>
          <b class="ap-name">${n.name}</b>
          <small class="ap-detail">${H(n)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${u} @click=${()=>this.open(n)}>
        ${this.renderThumb(e,n,o,r===void 0?Ge:92)}
      </button>
      ${this.renderCardTicks(e,n,t,i,r)}
      ${p?c?l`<div class="am-del-ask" role="alertdialog" aria-label=${`Delete ${n.name}?`}>
          <span><b>Delete ${n.name}?</b> No device uses it. This cannot be undone.</span>
          <span class="am-new-acts">
            <button type="button" class="am-btn danger" ?disabled=${this.deleting} @click=${()=>{this.deleteMenu(n)}}>Really delete</button>
            <button type="button" class="am-btn" ?disabled=${this.deleting} @click=${()=>{this.deleteAsk=void 0}}>Cancel</button>
          </span>
        </div>`:l`<button type="button" class="am-btn danger am-del" title=${`Delete ${n.name} from the library`}
          @click=${()=>{this.deleteAsk=n.id}}>${x("delete")}<span>Delete</span></button>`:m}
    </div>`}renderThumb(e,n,t,i){let r=this.hassNow;if(r===void 0||this.icons===void 0)return m;let o=qe.get(n);o===void 0&&(o=N(n),qe.set(n,o));let u=t===void 0?void 0:U(e,t.ownerId);return l`<wa-menu-thumbs .hass=${r} .icons=${this.icons} .tick=${this.iconsTick} .menus=${o}
      .pages=${u} .screen=${Je} .height=${i} menu=${n.unit}></wa-menu-thumbs>`}renderDevice(e,n,t){let i=Ue(e,n.ownerId),r=Ce(e,n.ownerId,this.search,t),o=this.waiting(e),u=this.lib.store,p=U(e,n.ownerId),c=X(n.ownerId)?I(n.name):o.has(n.ownerId)?A:void 0,v=i.flatMap(d=>[d.menu,...d.others]).map(d=>d===void 0?void 0:u?.noteFor("menus",d.id)).filter(d=>d!==void 0);return l`<div class="lt-view">
      <div class="lt-sect"><span>${O(n)} <small>${i.filter(d=>d.menu!==void 0).length}</small></span>
        <span class="lt-sect-r">${K(n)}</span></div>
      <div class="lt-list" role="list" aria-label=${O(n)}>${i.map(d=>l`<div class="lt-row" role="listitem" data-unit=${d.unit}>
        <button type="button" class="lt-row-open" title=${`Edit the ${d.title} on ${n.name}`} @click=${()=>this.openUnit(n,d.unit)}>
          ${d.menu===void 0?l`<span class="lr-ring" style="width:40px;height:40px" aria-hidden="true"></span>`:be({menu:d.menu,hass:this.hassNow,icons:this.icons,tick:this.iconsTick,onReady:()=>this.requestUpdate(),...d.unit==="anywhere"?{pages:p}:{}})}
          <span class="lt-row-nm"><span class="lt-row-n">${d.title}</span>
            <span class="lt-row-m">${d.menu===void 0?"None yet. Open it to set it up.":_e(d.menu,n.ownerId,t)}</span></span>
        </button>
        ${d.menu===void 0&&d.others.length===0?m:l`<select class="lt-pick-sel" aria-label=${`The ${d.title} ${n.name} uses`}
          .value=${ee(d.menu?.id??"")}
          ?disabled=${c!==void 0||u===void 0} title=${c??`Pick the ${d.title} ${n.name} uses`}
          @change=${f=>{let R=f.target.value,T=d.others.find(je=>je.id===R);T!==void 0&&this.use(T,n.ownerId)}}>
          ${d.menu===void 0?l`<option value="" selected disabled>Pick a menu</option>`:m}
          ${[...d.menu===void 0?[]:[d.menu],...d.others].map(f=>l`<option value=${f.id} ?selected=${f===d.menu}>${f.name}</option>`)}
        </select>`}
      </div>`)}</div>
      ${v.map(d=>l`<p class="lt-line warn" role="alert">${d}</p>`)}
      <div class="lt-sect"><span>${xe(n)} <small>${r.length}</small></span><span class="lt-sect-r">${Me}</span></div>
      ${r.length===0?l`<p class="lt-line">${this.search.trim()===""?`${n.name} uses every menu in your home.`:"No other menu has that name."}</p>`:l`<div class="ap-grid" role="list">${r.map(d=>this.renderCard(e,d,t,o,n.ownerId))}</div>`}
    </div>`}static{this.styles=[Te,Le,me,ge,B`
    /* The menu's picture: the watch screen alone, as the Pages tab's cards
       draw a page. */
    .ap-thumb wa-menu-thumbs { flex: none; width: 100%; }
    /* The two sections, Anywhere menus and Entity quick menus, each under
       a small heading with its count and New menu. */
    .am-section { display: flex; flex-direction: column; gap: 10px; }
    .am-section + .am-section { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--wa-line); }
    .am-section-head { display: flex; align-items: center; gap: 10px; padding: 0 2px; }
    .am-section-title { margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .01em; color: var(--wa-text); }
    .am-section-n { margin-left: 4px; font-weight: 500; color: var(--wa-muted); }
    .am-new-btn {
      display: inline-flex; align-items: center; gap: 5px; margin-left: auto; height: 26px; padding: 0 9px; border-radius: 7px;
      border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-ink);
      font: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
    }
    .am-new-btn svg { width: 13px; height: 13px; }
    .am-new-btn:hover:not(:disabled), .am-new-btn.on { background: var(--wa-hover); }
    .am-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .am-new-btn:disabled { opacity: .45; cursor: default; }
    /* New menu's form, under its section's heading. */
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
  `]}};w([b({attribute:!1})],h.prototype,"owners",2),w([b({attribute:!1})],h.prototype,"ownersReady",2),w([b({attribute:!1})],h.prototype,"phones",2),w([b({attribute:!1})],h.prototype,"icons",2),w([b({attribute:!1})],h.prototype,"iconsTick",2),w([b({attribute:!1})],h.prototype,"onOpen",2),w([g()],h.prototype,"search",2),w([g()],h.prototype,"openNote",2),w([g()],h.prototype,"newForm",2),w([g()],h.prototype,"sectionNote",2),w([g()],h.prototype,"deleteAsk",2),w([g()],h.prototype,"deleting",2);customElements.get("wa-all-menus")||customElements.define("wa-all-menus",h);export{h as WaAllMenus};
