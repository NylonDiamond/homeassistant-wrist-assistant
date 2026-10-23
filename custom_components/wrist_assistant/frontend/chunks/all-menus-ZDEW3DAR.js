import"./chunk-4YTW2XJZ.js";import{b as ue}from"./chunk-GZTLZEKF.js";import{e as ce,k as le}from"./chunk-45IUWTME.js";import{a as me,b as we,c as fe,d as be,e as ve,f as ye,g as ge,h as ke,i as $e,j as Le}from"./chunk-ZQQLIYOH.js";import"./chunk-T4OUPI4D.js";import"./chunk-V5IXDGZM.js";import"./chunk-M2SOREAJ.js";import{A as ae,B as O,I as R,J as oe,L as de,R as pe,S as he,y as $,z as se}from"./chunk-IUT3EZFJ.js";import"./chunk-DY6QLTIA.js";import{Ba as re,a as v,b as X,d as z,ga as k,la as L,na as W,oa as Q,ra as x,sa as Z,ta as N,ua as F,wa as te,xa as ne,ya as ie}from"./chunk-32BWDOCI.js";import{b as ee}from"./chunk-CKIFX3N2.js";import"./chunk-X7Y5C27T.js";import"./chunk-O6AELNK3.js";import"./chunk-P7MRQTKD.js";import{a as Y,b as M,c as J,g as G}from"./chunk-XF6VR4HJ.js";import"./chunk-RQWXLJYE.js";import"./chunk-ZOJGMATP.js";import"./chunk-G2XMT6V4.js";import"./chunk-27VXOWKT.js";import"./chunk-CHKZKW42.js";import"./chunk-LUNUSFWQ.js";import"./chunk-7O325OCR.js";import{b as j,c as q}from"./chunk-KBXFS4SO.js";import"./chunk-SV3BTW33.js";import"./chunk-HYO6YZS2.js";import{X as K}from"./chunk-N6KTKCSE.js";import"./chunk-TUSU5T3G.js";import"./chunk-PGFAOWAG.js";import{b as B,d as c,g as w,j as V,k as m,l as b,nh as f}from"./chunk-BDP52PL7.js";import{_ as H}from"./chunk-TGJNCNIU.js";import{a as u}from"./chunk-LO2NM3CE.js";var Ae="Each device uses one Anywhere menu and one Entity quick menu.";function xe(r){return`${r} ${r===1?"menu":"menus"} in your home. ${Ae}`}var Te="Click a menu to edit it. Pick a device on a card and that device uses this menu from now on. New menu makes one no device uses yet.",Me="Click a menu to edit it. Pick a dot and that device uses this menu from now on. Click a device's name to see its menus first.",Ne="Each device uses one of each kind. Pick a dot to switch.";function De(r){return`Pick which menu this ${M(r.kind)} uses. Click a menu to edit it.`}var _={anywhere:"Anywhere menus",entity:"Entity quick menus"},Ee=`${H} Its menus can change after that.`;function Ie(r){return`${r}'s menus have unsaved edits. Save or discard them first.`}function P(r){return ue({uiState:new Map,document:N(r),switcherPages:[]},r.unit)}function D(r,d,t){return O(r.name,d)?!0:t.some(e=>r.owners.some(n=>k(n,e.ownerId))&&O(e.name,d)&&d.trim()!=="")}function U(r,d="",t="all",e=[]){return L(r).filter(n=>D(n,d,e)&&ae(n.owners,t,e))}function C(r){return v.map(d=>({unit:d,menus:r.filter(t=>t.unit===d)}))}function E(r,d,t,e){let n=e.filter(s=>r.owners.some(i=>k(i,s.ownerId)));return(d===$?void 0:n.find(s=>s.ownerId===d))??(t==="all"?void 0:n.find(s=>s.kind===t))??n.find(s=>s.kind==="watch")??n[0]}function Se(r,d,t,e){return v.flatMap(n=>Z(r,d,n)).filter(n=>D(n,t,e))}function I(r,d){let t=d==="entity"?"New quick menu":"New menu",e=new Set((r===void 0?[]:L(r)).map(n=>n.name.trim().toLowerCase()));if(!e.has(t.toLowerCase()))return t;for(let n=2;;n++)if(!e.has(`${t} ${n}`.toLowerCase()))return`${t} ${n}`}function Fe(r){return`Made ${r}. Tick a device on its card to use it there.`}var Oe="Only a Home Assistant administrator can make a new menu.";function Re(r,d=ee()){return Object.fromEntries(X[r].flatMap(t=>Object.hasOwn(d,t)?[[t,structuredClone(d[t])]]:[]))}function S(r,d,t="all"){return r.length===0?"No watch or iPhone has connected yet. Pair one on the Home tab.":d.trim()!==""?"No menu or device has that name.":t!=="all"?`No menu here is used on ${t==="watch"?"a watch":"an iPhone"}.`:"None yet."}var Be=180,Ve=K.screen,He=2e3,Ke=38,Pe="wrist-assistant-panel.all-menus.v1",T;function Ue(){if(T!==void 0)return T;let r={view:"board"};try{let d=window.localStorage.getItem(Pe);(d?JSON.parse(d):{}).view==="cards"&&(r.view="cards")}catch{}return T=r,r}function je(r){T={...Ue(),...r};try{window.localStorage.setItem(Pe,JSON.stringify(T))}catch{}}var qe=r=>ce(r)?.dirty??!1,_e=new WeakMap,l=class extends V{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.search="";this.deleting=!1;this.saved=!1;this.hassDrawnAt=0;this.lib=new te(this,()=>this.hassNow,()=>this.devices.map(t=>t.ownerId));this.colorsFor=q();this.colorOf=t=>j(this.colorsFor(this.owners),t);this.onKeyDown=t=>{t.key==="Escape"&&(this.newForm!==void 0&&!this.newForm.busy?(t.preventDefault(),this.newForm=void 0):this.deleteAsk!==void 0&&!this.deleting&&(t.preventDefault(),this.deleteAsk=void 0))}}get hass(){return this.hassNow}set hass(t){let e=this.hassNow===void 0;this.hassNow=t;let n=Date.now();(e||n-this.hassDrawnAt>=He)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}get devices(){return Y(this.owners,this.phones)}get filter(){return se(this.focusOwner,this.devices)}filterDevice(){let t=this.filter;return t===$?void 0:this.devices.find(e=>e.ownerId===t)}get view(){return this.filterDevice()!==void 0?"board":Ue().view}waiting(t){let e=new Map;for(let n of this.devices)e.set(n.ownerId,{held:Q(t,n.ownerId,"menus"),free:!1});return G(this.owners,e)}setFocus(t){this.newForm=void 0,this.deleteAsk=void 0,this.onFocus?.(t)}setView(t){je({view:t}),t==="cards"&&this.filterDevice()!==void 0&&this.setFocus(void 0),this.requestUpdate()}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},ve)}open(t,e){let n=e??E(t,this.filter,"all",this.devices);if(n===void 0){this.onOpenLibrary?.(t.id);return}le(n.ownerId,t.unit),this.onOpen?.(n.ownerId,n.kind)}use(t,e){let n=this.lib.store;n!==void 0&&n.pickMenu(e,t.unit,t.id).then(s=>{s.ok&&this.flashSaved()})}get mayMake(){return this.hassNow?.user?.is_admin!==!1}toggleNew(){if(this.newForm?.busy)return;if(this.newForm!==void 0){this.newForm=void 0;return}let t="anywhere";this.newNote=void 0,this.newForm={unit:t,name:I(this.lib.library,t),busy:!1},this.updateComplete.then(()=>we(this.renderRoot))}setNewUnit(t,e){let n=this.lib.library,s=t.name===I(n,t.unit)?I(n,e):t.name;this.newForm={...t,unit:e,name:s}}async makeMenu(){let t=this.newForm,e=this.lib.store;if(t===void 0||t.busy||e===void 0)return;let n=t.name.trim();if(n===""){this.newForm={...t,note:{kind:"warn",text:"Give the menu a name."}};return}let{note:s,...i}=t;this.newForm={...i,busy:!0};let a=await e.createMenu(t.unit,n,Re(t.unit));if(!a.ok){this.newForm={...t,busy:!1,note:{kind:"err",text:`Not made. ${a.text}`}};return}this.newForm=void 0,this.onOpenLibrary!==void 0?this.onOpenLibrary(a.reply.id):this.newNote={kind:"ok",text:Fe(n)}}async deleteMenu(t){let e=this.lib.store;e===void 0||this.deleting||(this.deleting=!0,await e.deleteItem("menus",t.id),this.deleting=!1,this.deleteAsk=void 0)}render(){let t=this.devices;if(t.length===0&&!this.ownersReady)return c`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let e=this.lib.library,n=this.lib.readState,s=this.filterDevice(),i=this.view,a=e===void 0?n==="unsupported"?z:n==="failed"?this.lib.store?.readError??"Could not read the library.":"Reading the menus\u2026":xe(L(e).length),p=e!==void 0&&n==="failed";return c`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Menus</h1>
          <p class="ap-lead">${a}</p>
        </div>
        ${e===void 0?w:this.renderNewButton()}
      </div>
      ${this.newForm===void 0?w:this.renderNewDialog(this.newForm)}
      ${this.newNote===void 0?w:c`<p class="lt-line ${this.newNote.kind}" role="status">${this.newNote.text}</p>`}
      ${p?c`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:w}
      <div class="pk-surface pk-page" role="region" aria-label="Your menus">
        <div class="pk-pin">${this.renderHead(i)}</div>
        <div class="pk-body">
          ${e===void 0?c`<p class="ap-empty">${a}</p>`:t.length===0?c`<p class="ap-empty">${S(t,this.search)}</p>`:s!==void 0?this.renderFocus(e,s,t):i==="board"?this.renderBoardAll(e,t):this.renderSections(e,t)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${s===void 0?i==="board"?Me:Te:De(s)}</span></div>
      </div>
    </div></div>`}renderSections(t,e){let n=U(t,this.search,"all",e),s=this.waiting(t);return c`${C(n).map(({unit:i,menus:a})=>c`<section class="am-section" aria-labelledby=${`am-section-${i}`}>
      <div class="am-section-head">
        <h2 class="am-section-title" id=${`am-section-${i}`}>${_[i]} <span class="am-section-n">${a.length}</span></h2>
      </div>
      ${a.length===0?c`<p class="ap-empty">${S(e,this.search)}</p>`:c`<div class="ap-grid" role="list">${a.map(p=>this.renderCard(t,p,e,s))}</div>`}
    </section>`)}`}renderNewButton(){let t=this.mayMake,e=this.newForm!==void 0;return c`<button type="button" class="am-new-btn ${e?"on":""}" aria-expanded=${e?"true":"false"}
      ?disabled=${!t||this.newForm?.busy===!0} title=${t?"Make a new menu no device uses yet":Oe}
      @click=${()=>this.toggleNew()}>${f("plus")}<span>New menu</span></button>`}renderNewDialog(t){return me("menus",t,[],{onName:e=>{this.newForm={...t,name:e}},onUnit:e=>this.setNewUnit(t,e),onMake:()=>{this.makeMenu()},onClose:()=>{t.busy||(this.newForm=void 0)}})}renderHead(t){return c`<div class="pk-head">
      ${ye(t,e=>this.setView(e),"menus")}
      ${this.saved?c`<span class="bd-saved" role="status">${f("check")}<span>Saved</span></span>`:w}
      <label class="pk-search">
        ${f("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by menu or device" aria-label="Search menus"
          @input=${e=>{this.search=e.target.value}} />
      </label>
    </div>`}ticksInput(t,e,n,s){let i=this.lib.store,a=i?.noteFor("menus",e.id),p=this.hassNow?.user?.is_admin;return{library:t,kind:"menus",itemId:e.id,devices:n,colorOf:this.colorOf,...i===void 0?{}:{pending:i.pending},...a===void 0?{}:{note:a},...p===void 0?{}:{admin:p},locked:h=>{if(!W(t,h,"menus",e.id)){if(qe(h))return Ie(n.find(y=>y.ownerId===h)?.name??"This device");if(s.has(h))return Ee}}}}renderCardTicks(t,e,n,s){return ie(this.ticksInput(t,e,n,s),i=>this.use(e,i))}renderCard(t,e,n,s){let i=E(e,$,"all",n),a=i===void 0?R(e.name):`Edit ${e.name} on ${i.name}`;return c`<div class="ap-card" role="listitem" data-card=${e.id}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${a} @click=${()=>this.open(e)}>
          <b class="ap-name">${e.name}</b>
          <small class="ap-detail">${P(e)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${a} @click=${()=>this.open(e)}>
        ${this.renderThumb(t,e,i,Be)}
      </button>
      ${this.renderCardTicks(t,e,n,s)}
      ${e.owners.length===0?this.renderDelete(e):w}
    </div>`}renderDelete(t){return this.deleteAsk===t.id?this.renderDeleteAsk(t):c`<button type="button" class="am-btn danger am-del" title=${`Delete ${t.name} from the library`}
      @click=${e=>{e.stopPropagation(),this.deleteAsk=t.id}}>${f("delete")}<span>Delete</span></button>`}renderDeleteAsk(t){return c`<div class="am-del-ask" role="alertdialog" aria-label=${`Delete ${t.name}?`}>
      <span><b>Delete ${t.name}?</b> No device uses it. This cannot be undone.</span>
      <span class="am-new-acts">
        <button type="button" class="am-btn danger" ?disabled=${this.deleting} @click=${()=>{this.deleteMenu(t)}}>Really delete</button>
        <button type="button" class="am-btn" ?disabled=${this.deleting} @click=${()=>{this.deleteAsk=void 0}}>Cancel</button>
      </span>
    </div>`}renderThumb(t,e,n,s){let i=this.hassNow;if(i===void 0||this.icons===void 0)return w;let a=_e.get(e);a===void 0&&(a=N(e),_e.set(e,a));let p=n===void 0?void 0:F(t,n.ownerId);return c`<wa-menu-thumbs .hass=${i} .icons=${this.icons} .tick=${this.iconsTick} .menus=${a}
      .pages=${p} .screen=${Ve} .height=${s} menu=${e.unit}></wa-menu-thumbs>`}renderBoardOf(t,e,n,s){return ge({label:"Menus on each device",thing:"Menu",columns:e.map(i=>({device:i,color:this.colorOf(i.ownerId),count:v.filter(a=>x(t,i.ownerId,a)!==void 0).length})),...s===void 0?{}:{focus:s},onFocus:i=>this.setFocus(i),focusWord:"Its menus",focusTitle:i=>`Show the menus ${i.name} uses first`,sections:n})}renderBoardAll(t,e){let n=U(t,this.search,"all",e),s=this.waiting(t);return this.renderBoardOf(t,e,C(n).map(({unit:i,menus:a})=>({key:i,title:_[i],count:a.length,hint:Ne,rows:a.map(p=>this.boardRow(t,p,e,s)),empty:S(e,this.search)})))}boardRow(t,e,n,s,i){let a=this.ticksInput(t,e,n,s),p=ne(a).map(o=>{let A=o.on?void 0:x(t,o.ownerId,e.unit),Ce=A===void 0||o.next===void 0?o.title:`${o.title.replace(/\.$/,"")}. Replaces ${A.name} there.`;return{chip:{...o,title:Ce},onPick:()=>this.use(e,o.ownerId)}}),h=i!==void 0&&e.owners.some(o=>k(o,i.ownerId))?i:E(e,$,"all",n),y=e.owners.length===0,g={key:e.id,name:e.name,detail:P(e),picture:pe({menu:e,hass:this.hassNow,icons:this.icons,tick:this.iconsTick,onReady:()=>this.requestUpdate(),height:Ke,...e.unit==="anywhere"&&h!==void 0?{pages:F(t,h.ownerId)}:{}}),openTitle:h===void 0?R(e.name):`Edit ${e.name} on ${h.name}`,onOpen:()=>this.open(e,h),cells:p,...i!==void 0&&!e.owners.some(o=>k(o,i.ownerId))?{dim:!0}:{},...a.note===void 0?{}:{note:{text:a.note,kind:"warn"}}};return y&&(this.deleteAsk===e.id?g.under=this.renderDeleteAsk(e):g.actions=c`<button type="button" class="bd-act danger" title=${`Delete ${e.name} from the library. No device uses it.`}
        aria-label=${`Delete ${e.name}`} @click=${o=>{o.stopPropagation(),this.deleteAsk=e.id}}>${f("delete")}</button>`),g}renderFocus(t,e,n){let s=this.waiting(t),i=v.map(o=>x(t,e.ownerId,o)).filter(o=>o!==void 0&&D(o,this.search,n)),a=Se(t,e.ownerId,this.search,n),p=M(e.kind),h=e.kind==="watch"?["settings","rooms","voice"]:["settings","rooms"],y=this.colorOf(e.ownerId),g=v.map(o=>x(t,e.ownerId,o)?.name).filter(o=>o!==void 0);return c`<div class="bd-focus" style=${y===void 0?w:`--dc:${y}`}>
        <span class="bd-focus-glyph" aria-hidden="true">${f(e.kind==="iphone"?"phone":"watch")}</span>
        <span class="bd-focus-t"><b>${e.name}</b> <span>${g.length===0?"uses no menu yet":`uses ${J(g)}`}</span></span>
        ${this.onOpenScreen===void 0?w:c`<span class="bd-focus-own">Also on this ${p}:
          ${h.map(o=>c`<button type="button" class="bd-link" @click=${()=>this.onOpenScreen?.(e.ownerId,e.kind,o)}>${be[o]}</button>`)}</span>`}
        <button type="button" class="bd-focus-all" @click=${()=>this.setFocus(void 0)}>${f("grid")}<span>All devices</span></button>
      </div>
      ${this.renderBoardOf(t,n,[{key:"on",title:oe(e),count:i.length,hint:"One of each kind. Pick a dot to switch.",rows:i.map(o=>this.boardRow(t,o,n,s,e)),empty:this.search.trim()===""?`${e.name} uses no menu yet.`:`No menu ${e.name} uses has that name.`},{key:"rest",title:de(e),count:a.length,hint:`Pick its dot under ${e.name} to use it there.`,rows:a.map(o=>this.boardRow(t,o,n,s,e)),empty:this.search.trim()===""?`${e.name} uses every menu in your home.`:"No other menu has that name."}],e.ownerId)}`}static{this.styles=[Le,$e,re,he,fe,ke,B`
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
  `]}};u([m({attribute:!1})],l.prototype,"owners",2),u([m({attribute:!1})],l.prototype,"ownersReady",2),u([m({attribute:!1})],l.prototype,"phones",2),u([m({attribute:!1})],l.prototype,"icons",2),u([m({attribute:!1})],l.prototype,"iconsTick",2),u([m({attribute:!1})],l.prototype,"onOpen",2),u([m({attribute:!1})],l.prototype,"onOpenLibrary",2),u([m({attribute:!1})],l.prototype,"focusOwner",2),u([m({attribute:!1})],l.prototype,"onFocus",2),u([m({attribute:!1})],l.prototype,"onOpenScreen",2),u([b()],l.prototype,"search",2),u([b()],l.prototype,"newForm",2),u([b()],l.prototype,"newNote",2),u([b()],l.prototype,"deleteAsk",2),u([b()],l.prototype,"deleting",2),u([b()],l.prototype,"saved",2);customElements.get("wa-all-menus")||customElements.define("wa-all-menus",l);export{l as WaAllMenus};
