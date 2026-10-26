import"./chunk-TPMBQJ5P.js";import{b as ge}from"./chunk-NZBE6VT2.js";import{a as Te,b as Le,c as xe,d as Se,e as Ie}from"./chunk-PCG7DKSR.js";import{c as ke,d as $e,m as Me,n as De,o as F,v as U,w as Ne,y as Ee}from"./chunk-UPHMJ4SZ.js";import"./chunk-2NUYTH76.js";import"./chunk-KLPUKI4U.js";import"./chunk-6ZTYM4LQ.js";import"./chunk-JKCPF3YL.js";import"./chunk-OOYEHMRP.js";import"./chunk-ED3SLVEX.js";import{e as ce}from"./chunk-UGL4KIK3.js";import{b as ue,c as le,d as pe,e as he,f as me,g as we,h as fe,i as be,j as ve}from"./chunk-V44AZUQO.js";import{Ba as T,Ca as ie,Da as N,Ea as _,Ga as se,Ha as ae,Ia as oe,La as de,a as k,b as J,f as O,i as W,qa as y,va as $,xa as te,ya as ne}from"./chunk-AUWNQBKA.js";import"./chunk-CEE5U4GS.js";import"./chunk-EA2P32U3.js";import"./chunk-OUL6D5DT.js";import"./chunk-Q5HFO62T.js";import"./chunk-265ZBPVO.js";import{a as G,b as M,c as D,f as Q,g as Z,h as ee}from"./chunk-RKUGK5KY.js";import"./chunk-ZOJGMATP.js";import{b as z,c as Y}from"./chunk-7QS5JFTJ.js";import"./chunk-7OYNUVL2.js";import"./chunk-DMMRDKHH.js";import{I as X}from"./chunk-EJTNFT6K.js";import{b as K,d,g as m,j,k as w,l as g,ya as v}from"./chunk-FWBE2SQI.js";import{e as ye}from"./chunk-IFFJO4BE.js";import{b as re}from"./chunk-MFLXE3OI.js";import"./chunk-TR6YBPJQ.js";import"./chunk-VER6ZJU5.js";import{_g as q}from"./chunk-HFLDKMST.js";import{a as h}from"./chunk-LO2NM3CE.js";var We="Each device uses one Anywhere menu and one Entity quick menu.";function Re(r){return`${r} ${r===1?"menu":"menus"} in your home. ${We}`}var Oe="Click a menu to edit it. Tick a device on a card and that device uses this menu from now on. New menu starts on no device yet.",_e="Click a menu to edit it. Pick a dot and that device uses this menu from now on. Click a device's name to see its menus first.",Fe="Each device uses one of each kind. Pick a dot to switch.";function Ue(r){return`Pick which menu this ${M(r.kind)} uses. Click a menu to edit it.`}var C={anywhere:"Anywhere menus",entity:"Entity quick menus"},Ce=`${q} Its menus can change after that.`;function Pe(r){return`${r}'s menus have unsaved edits. Save or discard them first.`}function P(r){return ge({uiState:new Map,document:N(r),switcherPages:[]},r.unit)}function E(r,o,t){return F(r.name,o)?!0:t.some(e=>r.owners.some(n=>y(n,e.ownerId))&&F(e.name,o)&&o.trim()!=="")}function A(r,o="",t=[]){return $(r).filter(e=>E(e,o,t))}function B(r){return k.map(o=>({unit:o,menus:r.filter(t=>t.unit===o)}))}function V(r,o){let t=o.filter(e=>r.owners.some(n=>y(n,e.ownerId)));return t.find(e=>e.kind==="watch")??t[0]}function Ae(r,o,t,e){return k.flatMap(n=>ie(r,o,n)).filter(n=>E(n,t,e))}function S(r,o){let t=o==="entity"?"New quick menu":"New menu",e=new Set((r===void 0?[]:$(r)).map(n=>n.name.trim().toLowerCase()));if(!e.has(t.toLowerCase()))return t;for(let n=2;;n++)if(!e.has(`${t} ${n}`.toLowerCase()))return`${t} ${n}`}function Be(r){let o=r.length===1;return`${D(r)} ${o?"uses":"use"} it. To delete it, pick another menu for ${o?"that device":"each of them"} first.`}function Ve(r){return`Made ${r}, on no device yet. Pick a device for it any time.`}var He="Only a Home Assistant administrator can make a new menu.";function Ke(r,o=re()){return Object.fromEntries(J[r].flatMap(t=>Object.hasOwn(o,t)?[[t,structuredClone(o[t])]]:[]))}function I(r,o,t=!1){return r.length===0?"No watch or iPhone has connected yet. Pair one on the Home tab.":o.trim()!==""?"No menu or device has that name.":t?`None yet. ${Z("menus")}`:"None yet."}function je(r,o,t){return o.trim()!==""?`No menu ${r.name} uses has that name.`:t?Q("menus",r.name):`${r.name} uses no menu yet.`}function H(r,o){return`Duplicate ${r} for ${o}. The other devices keep this one.`}function qe(r,o){return`${o} uses its own copy now, "${r}". Edits to it change only ${o}.`}var Ge=180,Qe=X.screen,Ze=2e3,et=50,ze="wrist-assistant-panel.all-menus.v1",L;function Ye(){if(L!==void 0)return L;let r={view:"cards"};try{let o=window.localStorage.getItem(ze);(o?JSON.parse(o):{}).view==="board"&&(r.view="board")}catch{}return L=r,r}function tt(r){L={...Ye(),...r};try{window.localStorage.setItem(ze,JSON.stringify(L))}catch{}}var nt=r=>ye(r)?.dirty??!1,Xe=new WeakMap,c=class extends j{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.saved=!1;this.hassDrawnAt=0;this.lib=new se(this,()=>this.hassNow,()=>this.devices.map(t=>t.ownerId));this.roomy=new me(this);this.colorsFor=Y();this.colorOf=t=>z(this.colorsFor(this.owners),t);this.onKeyDown=t=>{t.key==="Escape"&&(this.newForm!==void 0&&!this.newForm.busy?(t.preventDefault(),this.newForm=void 0):this.deleteAsk!==void 0&&(t.preventDefault(),this.deleteAsk=void 0))}}get hass(){return this.hassNow}set hass(t){let e=this.hassNow===void 0;this.hassNow=t;let n=Date.now();(e||n-this.hassDrawnAt>=Ze)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(t){this.embedded&&t.has("searchText")&&(this.search=this.searchText)}get devices(){return G(this.owners,this.phones)}get filter(){return De(this.focusOwner,this.devices)}filterDevice(){let t=this.filter;return t===Me?void 0:this.devices.find(e=>e.ownerId===t)}get view(){return this.embedded||this.filterDevice()!==void 0?"board":ue("menus",Ye().view)}waiting(t){let e=new Map;for(let n of this.devices)e.set(n.ownerId,{held:ne(t,n.ownerId,"menus"),free:!1});return ee(this.owners,e)}setFocus(t){this.newForm=void 0,this.deleteAsk=void 0,this.onFocus?.(t)}setView(t){le("menus",t),tt({view:t}),t==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},he)}open(t){this.onOpenLibrary?.(t.id,this.focusOwner)}async duplicate(t,e){let n=this.lib.store;if(n===void 0||this.copying!==void 0)return;let s=ce(e.name);this.copying=t.id,this.newNote=void 0;let i=await n.copyMenu(e.ownerId,t.unit,s);this.copying=void 0,this.newNote=i.ok?{kind:"ok",text:qe(s,e.name)}:{kind:"err",text:`Not copied. ${i.text}`},i.ok&&this.flashSaved()}use(t,e){let n=this.lib.store;n!==void 0&&n.pickMenu(e,t.unit,t.id).then(s=>{s.ok&&this.flashSaved()})}get mayMake(){return this.hassNow?.user?.is_admin!==!1}toggleNew(){if(this.newForm?.busy)return;if(this.newForm!==void 0){this.newForm=void 0;return}let t="anywhere";this.newNote=void 0,this.newForm={unit:t,name:S(this.lib.library,t),busy:!1},this.updateComplete.then(()=>Le(this.renderRoot))}setNewUnit(t,e){let n=this.lib.library,s=t.name===S(n,t.unit)?S(n,e):t.name;this.newForm={...t,unit:e,name:s}}async makeMenu(){let t=this.newForm,e=this.lib.store;if(t===void 0||t.busy||e===void 0)return;let n=t.name.trim();if(n===""){this.newForm={...t,note:{kind:"warn",text:"Give the menu a name."}};return}let{note:s,...i}=t;this.newForm={...i,busy:!0};let a=await e.createMenu(t.unit,n,Ke(t.unit));if(!a.ok){this.newForm={...t,busy:!1,note:{kind:"err",text:`Not made. ${a.text}`}};return}this.newForm=void 0,this.onOpenLibrary!==void 0?this.onOpenLibrary(a.reply.id):this.newNote={kind:"ok",text:Ve(n)}}deleteMenu(t){let e=this.lib.store;e!==void 0&&(this.deleteAsk=void 0,e.deleteItemLater("menus",t.id,`Deleted ${t.name}.`))}render(){let t=this.devices;if(t.length===0&&!this.ownersReady)return d`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let e=this.lib.library,n=this.lib.readState,s=this.filterDevice(),i=this.view,a=e===void 0?n==="unsupported"?O:n==="failed"?this.lib.store?.readError??"Could not read the library.":"Reading the menus\u2026":Re($(e).length),u=e!==void 0&&n==="failed";return d`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Menus</h1>
          <p class="ap-lead">${a}</p>
        </div>
        ${e===void 0?m:this.renderNewButton()}
      </div>
      ${this.newForm===void 0?m:this.renderNewDialog(this.newForm)}
      ${this.newNote===void 0?m:d`<p class="lt-line ${this.newNote.kind}" role="status">${this.newNote.text}</p>`}
      ${u?d`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:m}
      <div class="pk-surface pk-page" role="region" aria-label="Your menus">
        <div class="pk-pin">${this.renderHead(i)}</div>
        <div class="pk-body">
          ${e===void 0?d`<p class="ap-empty">${a}</p>`:t.length===0?d`<p class="ap-empty">${I(t,this.search)}</p>`:s!==void 0?this.renderFocus(e,s,t):i==="board"?this.renderBoardAll(e,t):this.renderSections(e,t)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${s===void 0?i==="board"?_e:Oe:Ue(s)}</span></div>
      </div>
    </div></div>`}renderEmbedded(){let t=this.lib.library,e=this.devices,n=this.lib.readState;if(t===void 0){let s=n==="unsupported"?O:n==="failed"?this.lib.store?.readError??"Could not read the library.":"Reading the menus\u2026";return d`<p class="ap-empty">${s}</p>`}return e.length===0?d`<p class="ap-empty">No device can have menus.</p>`:d`${this.saved?d`<span class="bd-saved ap-embed-saved" role="status">${v("check")}<span>Saved</span></span>`:m}${this.renderBoardAll(t,e)}`}renderSections(t,e){let n=A(t,this.search,e),s=this.waiting(t);return d`${B(n).map(({unit:i,menus:a})=>d`<section class="am-section" aria-labelledby=${`am-section-${i}`}>
      <div class="am-section-head">
        <h2 class="am-section-title" id=${`am-section-${i}`}>${C[i]} <span class="am-section-n">${a.length}</span></h2>
      </div>
      ${a.length===0?d`<p class="ap-empty">${I(e,this.search,s.size>0)}</p>`:d`<div class="ap-grid" role="list">${a.map(u=>this.renderCard(t,u,e,s))}</div>`}
    </section>`)}`}renderNewButton(){let t=this.mayMake,e=this.newForm!==void 0;return d`<button type="button" class="am-new-btn ${e?"on":""}" aria-expanded=${e?"true":"false"}
      ?disabled=${!t||this.newForm?.busy===!0} title=${t?"Make a new menu no device uses yet":He}
      @click=${()=>this.toggleNew()}>${v("plus")}<span>New menu</span></button>`}renderNewDialog(t){return Te("menus",t,[],{onName:e=>{this.newForm={...t,name:e}},onUnit:e=>this.setNewUnit(t,e),onMake:()=>{this.makeMenu()},onClose:()=>{t.busy||(this.newForm=void 0)}})}renderHead(t){return d`<div class="pk-head">
      ${we(t,e=>this.setView(e),"menus")}
      ${this.saved?d`<span class="bd-saved" role="status">${v("check")}<span>Saved</span></span>`:m}
      <label class="pk-search">
        ${v("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by menu or device" aria-label="Search menus"
          @input=${e=>{this.search=e.target.value}} />
      </label>
    </div>`}ticksInput(t,e,n,s){let i=this.lib.store,a=i?.noteFor("menus",e.id),u=this.hassNow?.user?.is_admin;return{library:t,kind:"menus",itemId:e.id,devices:n,colorOf:this.colorOf,...i===void 0?{}:{pending:i.pending},...a===void 0?{}:{note:a},...u===void 0?{}:{admin:u},locked:b=>{if(!te(t,b,"menus",e.id)){if(nt(b))return Pe(n.find(f=>f.ownerId===b)?.name??"This device");if(s.has(b))return Ce}}}}renderCardTicks(t,e,n,s){return oe(this.ticksInput(t,e,n,s),i=>this.use(e,i))}renderCard(t,e,n,s){let i=V(e,n),a=U(e.name),u=this.deleteAsk===e.id;return d`<div class="ap-card ${u?"asking":""}" role="listitem" data-card=${e.id}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${a} @click=${()=>this.open(e)}>
          <b class="ap-name">${e.name}</b>
          <small class="ap-detail">${P(e)}</small>
        </button>
        ${this.renderDeleteButton(e,"ap-del")}
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${a} @click=${()=>this.open(e)}>
        ${this.renderThumb(t,e,i,Ge)}
      </button>
      ${this.renderCardTicks(t,e,n,s)}
      ${u?this.renderDeleteAsk(e,n):m}
    </div>`}renderDeleteButton(t,e){return d`<button type="button" class=${e} title=${`Delete ${t.name}`} aria-label=${`Delete ${t.name}`}
      @click=${n=>{n.stopPropagation(),this.deleteAsk=t.id}}>${v("delete")}</button>`}renderDeleteAsk(t,e){let n=()=>{this.deleteAsk=void 0},s=[...new Set(t.owners.map(a=>e.find(u=>y(u.ownerId,a))?.name??"A device"))],i=s.length===0;return d`<div class="ap-ask" role="alertdialog" aria-label=${`Delete ${t.name}?`} @click=${a=>a.stopPropagation()}>
      ${i?d`<span><b>Delete ${t.name}?</b> It is on no device yet. ${W}</span>`:d`<span><b>${t.name} is in use.</b> ${Be(s)}</span>`}
      <span class="ap-ask-acts">
        ${i?d`<button type="button" class="ap-ask-btn danger" @click=${()=>this.deleteMenu(t)}>Really delete</button>`:m}
        <button type="button" class="ap-ask-btn" @click=${n}>${i?"Cancel":"Close"}</button>
      </span>
    </div>`}renderThumb(t,e,n,s){let i=this.hassNow;if(i===void 0||this.icons===void 0)return m;let a=Xe.get(e);a===void 0&&(a=N(e),Xe.set(e,a));let u=n===void 0?void 0:_(t,n.ownerId);return d`<wa-menu-thumbs .hass=${i} .icons=${this.icons} .tick=${this.iconsTick} .menus=${a}
      .pages=${u} .screen=${Qe} .height=${s} menu=${e.unit}></wa-menu-thumbs>`}renderBoardOf(t,e,n,s){return fe({label:"Menus on each device",thing:"Menu",columns:e.map(i=>({device:i,color:this.colorOf(i.ownerId),count:k.filter(a=>T(t,i.ownerId,a)!==void 0).length})),...s===void 0?{}:{focus:s},onFocus:i=>this.setFocus(i),wide:this.roomy.wide,focusWord:"Its menus",focusTitle:i=>`Show the menus ${i.name} uses first`,sections:n})}renderBoardAll(t,e){let n=A(t,this.search,e),s=this.waiting(t);return this.renderBoardOf(t,e,B(n).map(({unit:i,menus:a})=>({key:i,title:C[i],count:a.length,hint:Fe,rows:a.map(u=>this.boardRow(t,u,e,s)),empty:I(e,this.search,s.size>0)})))}boardRow(t,e,n,s,i){let a=this.ticksInput(t,e,n,s),u=ae(a).map(p=>{let x=p.on?void 0:T(t,p.ownerId,e.unit),Je=x===void 0||p.next===void 0?p.title:`${p.title.replace(/\.$/,"")}. Replaces ${x.name} there.`;return{chip:{...p,title:Je},onPick:()=>this.use(e,p.ownerId)}}),b=i!==void 0&&e.owners.some(p=>y(p,i.ownerId))?i:V(e,n),f={key:e.id,name:e.name,detail:P(e),picture:ke({menu:e,hass:this.hassNow,icons:this.icons,tick:this.iconsTick,onReady:()=>this.requestUpdate(),height:this.roomy.size(et),...e.unit==="anywhere"&&b!==void 0?{pages:_(t,b.ownerId)}:{}}),openTitle:U(e.name),onOpen:()=>this.open(e),cells:u,...i!==void 0&&!e.owners.some(p=>y(p,i.ownerId))?{dim:!0}:{},...a.note===void 0?{}:{note:{text:a.note,kind:"warn"}}};if(i!==void 0&&e.owners.some(p=>y(p,i.ownerId))&&e.owners.some(p=>!y(p,i.ownerId))&&i!==void 0){let p=this.copying!==void 0;f.actions=d`<button type="button" class="bd-act" ?disabled=${p}
        title=${p?"Duplicating\u2026":H(e.name,i.name)} aria-label=${H(e.name,i.name)}
        @click=${x=>{x.stopPropagation(),this.duplicate(e,i)}}>${v("duplicate")}</button>`}let l=this.renderDeleteButton(e,"bd-act danger");return f.actions=f.actions===void 0?l:d`${f.actions}${l}`,this.deleteAsk===e.id&&(f.under=this.renderDeleteAsk(e,n)),f}renderFocus(t,e,n){let s=this.waiting(t),i=k.map(l=>T(t,e.ownerId,l)).filter(l=>l!==void 0&&E(l,this.search,n)),a=Ae(t,e.ownerId,this.search,n),u=M(e.kind),b=e.kind==="watch"?["settings","rooms","voice"]:["settings","rooms"],f=this.colorOf(e.ownerId),R=k.map(l=>T(t,e.ownerId,l)?.name).filter(l=>l!==void 0);return d`<div class="bd-focus" style=${f===void 0?m:`--dc:${f}`}>
        <span class="bd-focus-glyph" aria-hidden="true">${v(e.kind==="iphone"?"phone":"watch")}</span>
        <span class="bd-focus-t"><b>${e.name}</b> <span>${R.length===0?"uses no menu yet":`uses ${D(R)}`}</span></span>
        ${this.onOpenScreen===void 0?m:d`<span class="bd-focus-own">Also on this ${u}:
          ${b.map(l=>d`<button type="button" class="bd-link" @click=${()=>this.onOpenScreen?.(e.ownerId,e.kind,l)}>${pe[l]}</button>`)}</span>`}
        <button type="button" class="bd-focus-all" @click=${()=>this.setFocus(void 0)}>${v("grid")}<span>All devices</span></button>
      </div>
      ${this.renderBoardOf(t,n,[{key:"on",title:Ne(e),count:i.length,hint:"One of each kind. Pick a dot to switch.",rows:i.map(l=>this.boardRow(t,l,n,s,e)),empty:je(e,this.search,s.has(e.ownerId))},{key:"rest",title:Ee(e),count:a.length,hint:`Pick its dot under ${e.name} to use it there.`,rows:a.map(l=>this.boardRow(t,l,n,s,e)),empty:this.search.trim()===""?`${e.name} uses every menu in your home.`:"No other menu has that name."}],e.ownerId)}`}static{this.styles=[Ie,Se,de,$e,xe,be,ve,K`
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
