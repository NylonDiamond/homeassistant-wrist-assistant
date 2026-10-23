import"./chunk-BIEBO325.js";import{b as ye}from"./chunk-RUG3BLU6.js";import{e as ve}from"./chunk-45IUWTME.js";import{a as $e,b as xe,c as Te,d as Le,e as Me}from"./chunk-JZNSOGT3.js";import"./chunk-T4OUPI4D.js";import"./chunk-NHU2RDYQ.js";import"./chunk-SZFVGPGO.js";import{A as ce,B as O,I as _,J as le,L as ue,R as ge,S as ke,y as x,z as de}from"./chunk-LEB2RL37.js";import{n as oe}from"./chunk-6U6YWHFQ.js";import{Ba as ae,Ca as pe,Da as he,Ea as me,Fa as we,Ga as fe,Ha as be,b as k,c as Y,e as J,ha as y,ma as T,oa as Z,pa as ee,sa as L,ta as te,ua as E,va as R,xa as ie,ya as re,za as se}from"./chunk-O3NWHL3Q.js";import{b as ne}from"./chunk-CKIFX3N2.js";import"./chunk-N7GITRH7.js";import"./chunk-3XQHAZJT.js";import"./chunk-P7MRQTKD.js";import{a as W,b as D,c as G,g as Q}from"./chunk-XF6VR4HJ.js";import"./chunk-RQWXLJYE.js";import"./chunk-ZOJGMATP.js";import"./chunk-G2XMT6V4.js";import"./chunk-27VXOWKT.js";import"./chunk-CHKZKW42.js";import"./chunk-LUNUSFWQ.js";import"./chunk-7O325OCR.js";import{b as z,c as X}from"./chunk-KBXFS4SO.js";import"./chunk-SV3BTW33.js";import"./chunk-HYO6YZS2.js";import{U as q}from"./chunk-EABJ5TYD.js";import"./chunk-TUSU5T3G.js";import"./chunk-PGFAOWAG.js";import{b as H,d,g as m,j as K,k as w,l as v,nh as b}from"./chunk-BDP52PL7.js";import{_ as j}from"./chunk-TGJNCNIU.js";import{a as u}from"./chunk-LO2NM3CE.js";var Ke="Each device uses one Anywhere menu and one Entity quick menu.";function Ne(r){return`${r} ${r===1?"menu":"menus"} in your home. ${Ke}`}var De="Click a menu to edit it. Pick a device on a card and that device uses this menu from now on. New menu makes one no device uses yet.",Ee="Click a menu to edit it. Pick a dot and that device uses this menu from now on. Click a device's name to see its menus first.",Ie="Each device uses one of each kind. Pick a dot to switch.";function Se(r){return`Pick which menu this ${D(r.kind)} uses. Click a menu to edit it.`}var P={anywhere:"Anywhere menus",entity:"Entity quick menus"},Fe=`${j} Its menus can change after that.`;function Re(r){return`${r}'s menus have unsaved edits. Save or discard them first.`}function U(r){return ye({uiState:new Map,document:E(r),switcherPages:[]},r.unit)}function I(r,o,t){return O(r.name,o)?!0:t.some(e=>r.owners.some(n=>y(n,e.ownerId))&&O(e.name,o)&&o.trim()!=="")}function C(r,o="",t="all",e=[]){return T(r).filter(n=>I(n,o,e)&&ce(n.owners,t,e))}function A(r){return k.map(o=>({unit:o,menus:r.filter(t=>t.unit===o)}))}function B(r,o,t,e){let n=e.filter(s=>r.owners.some(i=>y(i,s.ownerId)));return(o===x?void 0:n.find(s=>s.ownerId===o))??(t==="all"?void 0:n.find(s=>s.kind===t))??n.find(s=>s.kind==="watch")??n[0]}function Oe(r,o,t,e){return k.flatMap(n=>te(r,o,n)).filter(n=>I(n,t,e))}function S(r,o){let t=o==="entity"?"New quick menu":"New menu",e=new Set((r===void 0?[]:T(r)).map(n=>n.name.trim().toLowerCase()));if(!e.has(t.toLowerCase()))return t;for(let n=2;;n++)if(!e.has(`${t} ${n}`.toLowerCase()))return`${t} ${n}`}function _e(r){return`Made ${r}. Tick a device on its card to use it there.`}var Pe="Only a Home Assistant administrator can make a new menu.";function Ue(r,o=ne()){return Object.fromEntries(Y[r].flatMap(t=>Object.hasOwn(o,t)?[[t,structuredClone(o[t])]]:[]))}function F(r,o,t="all"){return r.length===0?"No watch or iPhone has connected yet. Pair one on the Home tab.":o.trim()!==""?"No menu or device has that name.":t!=="all"?`No menu here is used on ${t==="watch"?"a watch":"an iPhone"}.`:"None yet."}function V(r,o){return`Duplicate ${r} for ${o}. The other devices keep this one.`}function Ce(r,o){return`${o} uses its own copy now, "${r}". Edits to it change only ${o}.`}var je=180,qe=q.screen,ze=2e3,Xe=38,Be="wrist-assistant-panel.all-menus.v1",M;function Ve(){if(M!==void 0)return M;let r={view:"board"};try{let o=window.localStorage.getItem(Be);(o?JSON.parse(o):{}).view==="cards"&&(r.view="cards")}catch{}return M=r,r}function Ye(r){M={...Ve(),...r};try{window.localStorage.setItem(Be,JSON.stringify(M))}catch{}}var Je=r=>ve(r)?.dirty??!1,Ae=new WeakMap,l=class extends K{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.search="";this.deleting=!1;this.saved=!1;this.hassDrawnAt=0;this.lib=new ie(this,()=>this.hassNow,()=>this.devices.map(t=>t.ownerId));this.roomy=new me(this);this.colorsFor=X();this.colorOf=t=>z(this.colorsFor(this.owners),t);this.onKeyDown=t=>{t.key==="Escape"&&(this.newForm!==void 0&&!this.newForm.busy?(t.preventDefault(),this.newForm=void 0):this.deleteAsk!==void 0&&!this.deleting&&(t.preventDefault(),this.deleteAsk=void 0))}}get hass(){return this.hassNow}set hass(t){let e=this.hassNow===void 0;this.hassNow=t;let n=Date.now();(e||n-this.hassDrawnAt>=ze)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}get devices(){return W(this.owners,this.phones)}get filter(){return de(this.focusOwner,this.devices)}filterDevice(){let t=this.filter;return t===x?void 0:this.devices.find(e=>e.ownerId===t)}get view(){return this.filterDevice()!==void 0?"board":Ve().view}waiting(t){let e=new Map;for(let n of this.devices)e.set(n.ownerId,{held:ee(t,n.ownerId,"menus"),free:!1});return Q(this.owners,e)}setFocus(t){this.newForm=void 0,this.deleteAsk=void 0,this.onFocus?.(t)}setView(t){Ye({view:t}),t==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},he)}open(t){this.onOpenLibrary?.(t.id,this.focusOwner)}async duplicate(t,e){let n=this.lib.store;if(n===void 0||this.copying!==void 0)return;let s=oe(e.name);this.copying=t.id,this.newNote=void 0;let i=await n.copyMenu(e.ownerId,t.unit,s);this.copying=void 0,this.newNote=i.ok?{kind:"ok",text:Ce(s,e.name)}:{kind:"err",text:`Not copied. ${i.text}`},i.ok&&this.flashSaved()}use(t,e){let n=this.lib.store;n!==void 0&&n.pickMenu(e,t.unit,t.id).then(s=>{s.ok&&this.flashSaved()})}get mayMake(){return this.hassNow?.user?.is_admin!==!1}toggleNew(){if(this.newForm?.busy)return;if(this.newForm!==void 0){this.newForm=void 0;return}let t="anywhere";this.newNote=void 0,this.newForm={unit:t,name:S(this.lib.library,t),busy:!1},this.updateComplete.then(()=>xe(this.renderRoot))}setNewUnit(t,e){let n=this.lib.library,s=t.name===S(n,t.unit)?S(n,e):t.name;this.newForm={...t,unit:e,name:s}}async makeMenu(){let t=this.newForm,e=this.lib.store;if(t===void 0||t.busy||e===void 0)return;let n=t.name.trim();if(n===""){this.newForm={...t,note:{kind:"warn",text:"Give the menu a name."}};return}let{note:s,...i}=t;this.newForm={...i,busy:!0};let a=await e.createMenu(t.unit,n,Ue(t.unit));if(!a.ok){this.newForm={...t,busy:!1,note:{kind:"err",text:`Not made. ${a.text}`}};return}this.newForm=void 0,this.onOpenLibrary!==void 0?this.onOpenLibrary(a.reply.id):this.newNote={kind:"ok",text:_e(n)}}async deleteMenu(t){let e=this.lib.store;e===void 0||this.deleting||(this.deleting=!0,await e.deleteItem("menus",t.id),this.deleting=!1,this.deleteAsk=void 0)}render(){let t=this.devices;if(t.length===0&&!this.ownersReady)return d`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let e=this.lib.library,n=this.lib.readState,s=this.filterDevice(),i=this.view,a=e===void 0?n==="unsupported"?J:n==="failed"?this.lib.store?.readError??"Could not read the library.":"Reading the menus\u2026":Ne(T(e).length),h=e!==void 0&&n==="failed";return d`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Menus</h1>
          <p class="ap-lead">${a}</p>
        </div>
        ${e===void 0?m:this.renderNewButton()}
      </div>
      ${this.newForm===void 0?m:this.renderNewDialog(this.newForm)}
      ${this.newNote===void 0?m:d`<p class="lt-line ${this.newNote.kind}" role="status">${this.newNote.text}</p>`}
      ${h?d`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:m}
      <div class="pk-surface pk-page" role="region" aria-label="Your menus">
        <div class="pk-pin">${this.renderHead(i)}</div>
        <div class="pk-body">
          ${e===void 0?d`<p class="ap-empty">${a}</p>`:t.length===0?d`<p class="ap-empty">${F(t,this.search)}</p>`:s!==void 0?this.renderFocus(e,s,t):i==="board"?this.renderBoardAll(e,t):this.renderSections(e,t)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${s===void 0?i==="board"?Ee:De:Se(s)}</span></div>
      </div>
    </div></div>`}renderSections(t,e){let n=C(t,this.search,"all",e),s=this.waiting(t);return d`${A(n).map(({unit:i,menus:a})=>d`<section class="am-section" aria-labelledby=${`am-section-${i}`}>
      <div class="am-section-head">
        <h2 class="am-section-title" id=${`am-section-${i}`}>${P[i]} <span class="am-section-n">${a.length}</span></h2>
      </div>
      ${a.length===0?d`<p class="ap-empty">${F(e,this.search)}</p>`:d`<div class="ap-grid" role="list">${a.map(h=>this.renderCard(t,h,e,s))}</div>`}
    </section>`)}`}renderNewButton(){let t=this.mayMake,e=this.newForm!==void 0;return d`<button type="button" class="am-new-btn ${e?"on":""}" aria-expanded=${e?"true":"false"}
      ?disabled=${!t||this.newForm?.busy===!0} title=${t?"Make a new menu no device uses yet":Pe}
      @click=${()=>this.toggleNew()}>${b("plus")}<span>New menu</span></button>`}renderNewDialog(t){return $e("menus",t,[],{onName:e=>{this.newForm={...t,name:e}},onUnit:e=>this.setNewUnit(t,e),onMake:()=>{this.makeMenu()},onClose:()=>{t.busy||(this.newForm=void 0)}})}renderHead(t){return d`<div class="pk-head">
      ${we(t,e=>this.setView(e),"menus")}
      ${this.saved?d`<span class="bd-saved" role="status">${b("check")}<span>Saved</span></span>`:m}
      <label class="pk-search">
        ${b("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by menu or device" aria-label="Search menus"
          @input=${e=>{this.search=e.target.value}} />
      </label>
    </div>`}ticksInput(t,e,n,s){let i=this.lib.store,a=i?.noteFor("menus",e.id),h=this.hassNow?.user?.is_admin;return{library:t,kind:"menus",itemId:e.id,devices:n,colorOf:this.colorOf,...i===void 0?{}:{pending:i.pending},...a===void 0?{}:{note:a},...h===void 0?{}:{admin:h},locked:f=>{if(!Z(t,f,"menus",e.id)){if(Je(f))return Re(n.find($=>$.ownerId===f)?.name??"This device");if(s.has(f))return Fe}}}}renderCardTicks(t,e,n,s){return se(this.ticksInput(t,e,n,s),i=>this.use(e,i))}renderCard(t,e,n,s){let i=B(e,x,"all",n),a=_(e.name);return d`<div class="ap-card" role="listitem" data-card=${e.id}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${a} @click=${()=>this.open(e)}>
          <b class="ap-name">${e.name}</b>
          <small class="ap-detail">${U(e)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${a} @click=${()=>this.open(e)}>
        ${this.renderThumb(t,e,i,je)}
      </button>
      ${this.renderCardTicks(t,e,n,s)}
      ${e.owners.length===0?this.renderDelete(e):m}
    </div>`}renderDelete(t){return this.deleteAsk===t.id?this.renderDeleteAsk(t):d`<button type="button" class="am-btn danger am-del" title=${`Delete ${t.name} from the library`}
      @click=${e=>{e.stopPropagation(),this.deleteAsk=t.id}}>${b("delete")}<span>Delete</span></button>`}renderDeleteAsk(t){return d`<div class="am-del-ask" role="alertdialog" aria-label=${`Delete ${t.name}?`}>
      <span><b>Delete ${t.name}?</b> No device uses it. This cannot be undone.</span>
      <span class="am-new-acts">
        <button type="button" class="am-btn danger" ?disabled=${this.deleting} @click=${()=>{this.deleteMenu(t)}}>Really delete</button>
        <button type="button" class="am-btn" ?disabled=${this.deleting} @click=${()=>{this.deleteAsk=void 0}}>Cancel</button>
      </span>
    </div>`}renderThumb(t,e,n,s){let i=this.hassNow;if(i===void 0||this.icons===void 0)return m;let a=Ae.get(e);a===void 0&&(a=E(e),Ae.set(e,a));let h=n===void 0?void 0:R(t,n.ownerId);return d`<wa-menu-thumbs .hass=${i} .icons=${this.icons} .tick=${this.iconsTick} .menus=${a}
      .pages=${h} .screen=${qe} .height=${s} menu=${e.unit}></wa-menu-thumbs>`}renderBoardOf(t,e,n,s){return fe({label:"Menus on each device",thing:"Menu",columns:e.map(i=>({device:i,color:this.colorOf(i.ownerId),count:k.filter(a=>L(t,i.ownerId,a)!==void 0).length})),...s===void 0?{}:{focus:s},onFocus:i=>this.setFocus(i),wide:this.roomy.wide,focusWord:"Its menus",focusTitle:i=>`Show the menus ${i.name} uses first`,sections:n})}renderBoardAll(t,e){let n=C(t,this.search,"all",e),s=this.waiting(t);return this.renderBoardOf(t,e,A(n).map(({unit:i,menus:a})=>({key:i,title:P[i],count:a.length,hint:Ie,rows:a.map(h=>this.boardRow(t,h,e,s)),empty:F(e,this.search)})))}boardRow(t,e,n,s,i){let a=this.ticksInput(t,e,n,s),h=re(a).map(c=>{let N=c.on?void 0:L(t,c.ownerId,e.unit),He=N===void 0||c.next===void 0?c.title:`${c.title.replace(/\.$/,"")}. Replaces ${N.name} there.`;return{chip:{...c,title:He},onPick:()=>this.use(e,c.ownerId)}}),f=i!==void 0&&e.owners.some(c=>y(c,i.ownerId))?i:B(e,x,"all",n),$=e.owners.length===0,g={key:e.id,name:e.name,detail:U(e),picture:ge({menu:e,hass:this.hassNow,icons:this.icons,tick:this.iconsTick,onReady:()=>this.requestUpdate(),height:this.roomy.size(Xe),...e.unit==="anywhere"&&f!==void 0?{pages:R(t,f.ownerId)}:{}}),openTitle:_(e.name),onOpen:()=>this.open(e),cells:h,...i!==void 0&&!e.owners.some(c=>y(c,i.ownerId))?{dim:!0}:{},...a.note===void 0?{}:{note:{text:a.note,kind:"warn"}}};if(i!==void 0&&e.owners.some(c=>y(c,i.ownerId))&&e.owners.some(c=>!y(c,i.ownerId))&&i!==void 0){let c=this.copying!==void 0;g.actions=d`<button type="button" class="bd-act" ?disabled=${c}
        title=${c?"Duplicating\u2026":V(e.name,i.name)} aria-label=${V(e.name,i.name)}
        @click=${N=>{N.stopPropagation(),this.duplicate(e,i)}}>${b("duplicate")}</button>`}return $&&(this.deleteAsk===e.id?g.under=this.renderDeleteAsk(e):g.actions=d`<button type="button" class="bd-act danger" title=${`Delete ${e.name} from the library. No device uses it.`}
        aria-label=${`Delete ${e.name}`} @click=${c=>{c.stopPropagation(),this.deleteAsk=e.id}}>${b("delete")}</button>`),g}renderFocus(t,e,n){let s=this.waiting(t),i=k.map(p=>L(t,e.ownerId,p)).filter(p=>p!==void 0&&I(p,this.search,n)),a=Oe(t,e.ownerId,this.search,n),h=D(e.kind),f=e.kind==="watch"?["settings","rooms","voice"]:["settings","rooms"],$=this.colorOf(e.ownerId),g=k.map(p=>L(t,e.ownerId,p)?.name).filter(p=>p!==void 0);return d`<div class="bd-focus" style=${$===void 0?m:`--dc:${$}`}>
        <span class="bd-focus-glyph" aria-hidden="true">${b(e.kind==="iphone"?"phone":"watch")}</span>
        <span class="bd-focus-t"><b>${e.name}</b> <span>${g.length===0?"uses no menu yet":`uses ${G(g)}`}</span></span>
        ${this.onOpenScreen===void 0?m:d`<span class="bd-focus-own">Also on this ${h}:
          ${f.map(p=>d`<button type="button" class="bd-link" @click=${()=>this.onOpenScreen?.(e.ownerId,e.kind,p)}>${pe[p]}</button>`)}</span>`}
        <button type="button" class="bd-focus-all" @click=${()=>this.setFocus(void 0)}>${b("grid")}<span>All devices</span></button>
      </div>
      ${this.renderBoardOf(t,n,[{key:"on",title:le(e),count:i.length,hint:"One of each kind. Pick a dot to switch.",rows:i.map(p=>this.boardRow(t,p,n,s,e)),empty:this.search.trim()===""?`${e.name} uses no menu yet.`:`No menu ${e.name} uses has that name.`},{key:"rest",title:ue(e),count:a.length,hint:`Pick its dot under ${e.name} to use it there.`,rows:a.map(p=>this.boardRow(t,p,n,s,e)),empty:this.search.trim()===""?`${e.name} uses every menu in your home.`:"No other menu has that name."}],e.ownerId)}`}static{this.styles=[Me,Le,ae,ke,Te,be,H`
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
  `]}};u([w({attribute:!1})],l.prototype,"owners",2),u([w({attribute:!1})],l.prototype,"ownersReady",2),u([w({attribute:!1})],l.prototype,"phones",2),u([w({attribute:!1})],l.prototype,"icons",2),u([w({attribute:!1})],l.prototype,"iconsTick",2),u([w({attribute:!1})],l.prototype,"onOpenLibrary",2),u([w({attribute:!1})],l.prototype,"focusOwner",2),u([w({attribute:!1})],l.prototype,"onFocus",2),u([w({attribute:!1})],l.prototype,"onOpenScreen",2),u([v()],l.prototype,"search",2),u([v()],l.prototype,"newForm",2),u([v()],l.prototype,"newNote",2),u([v()],l.prototype,"deleteAsk",2),u([v()],l.prototype,"deleting",2),u([v()],l.prototype,"saved",2),u([v()],l.prototype,"copying",2);customElements.get("wa-all-menus")||customElements.define("wa-all-menus",l);export{l as WaAllMenus};
