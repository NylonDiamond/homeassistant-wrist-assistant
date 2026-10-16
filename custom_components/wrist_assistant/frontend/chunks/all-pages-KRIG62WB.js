import{d as B,f as J,h as Q,o as Z,p as ee,r as ie,s as ne,t as ae}from"./chunk-DPJXSD7E.js";import{b as D,d as G}from"./chunk-SPTKBBHW.js";import"./chunk-J23RLD45.js";import{s as $,y as de}from"./chunk-ARHTF3TR.js";import"./chunk-W6YU56LQ.js";import{a as te,b as se,c as re,h as oe}from"./chunk-J4ZOCZL3.js";import"./chunk-GEU5IYGP.js";import{e as j}from"./chunk-4I5F75IY.js";import{b as X}from"./chunk-EATDI57W.js";import{P as A,U as q}from"./chunk-DK2DZHWA.js";import{k as R,l as H,m as W,n as x,o as V,p as U,q as K,r as Y}from"./chunk-YDWRUXOV.js";import{Eg as M,Hg as N,Jg as O,Ng as _,b as L,d as g,g as w,j as F,k as b,kh as y,l as v}from"./chunk-D2VEH7YA.js";import{b as z}from"./chunk-5XITPOUG.js";import{a as h}from"./chunk-LO2NM3CE.js";var pe="Every page on your watches and iPhones. A page on more than one device is the same page: an edit shows on all of them.",xe="This is its only device. Delete it in the page editor instead.",S="Save or discard the edits to these pages first. A page goes on another device as it is saved.",be=r=>r.toUpperCase();function ce(r,o){let e=[],i=new Map;for(let n of r){let a=o.get(n.ownerId);a!==void 0&&j(a).forEach((t,d)=>{let p=x(t);if(p==="")return;let c=J(t),s=c===void 0?`page:${n.ownerId}:${be(p)}`:`link:${c}`,u={device:n,page:t,hidden:U(t),index:d},m=i.get(s);if(m!==void 0){m.copies.some(we=>we.device.ownerId===n.ownerId)||m.copies.push(u);return}let P=Y(t),E={key:s,pageId:p,name:V(t),tiles:P?0:W(t).length,smart:P,copies:[u],...c===void 0?{}:{linkId:c}};i.set(s,E),e.push(E)})}return e}var k="all";function le(r,o){return[{id:k,label:"All",count:o.length},...r.map(e=>({id:e.ownerId,label:e.name,kind:e.kind,count:o.filter(i=>f(i,e.ownerId)!==void 0).length}))]}function he(r,o){return r!==void 0&&o.some(e=>e.ownerId===r)?r:k}function f(r,o){return r.copies.find(e=>e.device.ownerId===o)}function ge(r,o,e=""){let i=e.trim().toLowerCase(),n=i===""?[...r]:r.filter(a=>a.name.toLowerCase().includes(i));return o===k?n:n.filter(a=>f(a,o)!==void 0).sort((a,t)=>f(a,o).index-f(t,o).index)}function T(r,o){return(o===k?void 0:f(r,o))??r.copies.find(e=>e.device.kind==="watch")??r.copies[0]}function ue(r,o){let e=o.copies.some(n=>K(n.page)),i=o.copies.length<=1;return r.map(n=>{let a=f(o,n.ownerId)!==void 0,t=e?Q:a&&i?xe:void 0;return{device:n,on:a,here:!1,...t===void 0?{}:{stuck:t}}})}function I(r,o){return r.copies.find(e=>!o(e.device.ownerId))?.device.ownerId}function ve(r){return r.smart?"Smart page":`${r.tiles} ${r.tiles===1?"tile":"tiles"}`}function fe(r,o,e){if(o.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";if(e.trim()!=="")return"No page has that name.";let i=o.find(n=>n.ownerId===r);return i!==void 0?`No pages on ${i.name} yet.`:"No device has pages yet. Open a device's Pages to make one."}var C=92,ye=2e3,ke=250,me,Pe=(r,o)=>r.toUpperCase()===o.toUpperCase(),l=class extends F{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.docs=new Map;this.failed=[];this.readState="idle";this.linksOn=!0;this.filter=me;this.search="";this.linking=!1;this.hassDrawnAt=0;this.loadSeq=0;this.readSeq=new Map;this.reloadTimers=new Map;this.unsubscribers=[];this.subscribeSeq=0;this.onKeyDown=e=>{e.key==="Escape"&&this.menuAt!==void 0&&(e.preventDefault(),this.closeDevices())};this.onWindowPointerDown=e=>{if(this.menuAt===void 0)return;e.composedPath().some(n=>n instanceof Element&&(n.classList.contains("pe-dev-menu")||n.classList.contains("ap-dev-open")))||this.closeDevices()}}get hass(){return this.hassNow}set hass(e){let i=this.hassNow===void 0;this.hassNow=e;let n=Date.now();(i||n-this.hassDrawnAt>=ye)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.deviceSig=void 0,this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.endSubscriptions();for(let e of this.reloadTimers.values())window.clearTimeout(e);this.reloadTimers.clear(),this.loadSeq++,this.deviceSig=void 0}willUpdate(e){let i=this.devices,n=i.map(a=>a.ownerId).join(",");this.hassNow!==void 0&&this.isConnected&&n!==this.deviceSig&&(this.deviceSig=n,this.loadAll(),this.startSubscriptions(i))}get devices(){return B(this.owners,this.phones)}get cards(){let e=this.devices,i=this.cardsMemo;if(i!==void 0&&i.docs===this.docs&&i.devices.length===e.length&&i.devices.every((a,t)=>a.ownerId===e[t].ownerId&&a.name===e[t].name))return i.cards;let n=ce(e,this.docs);return this.cardsMemo={docs:this.docs,devices:e,cards:n},n}async loadAll(){let e=this.hassNow;if(!e)return;let i=++this.loadSeq,n=this.devices;this.readState==="idle"&&(this.readState="loading");let a=O(e).then(()=>!0,s=>z(s).code!=="unknown_command"),t=await Promise.all(n.map(s=>this.readOne(e,s.ownerId))),d=await a;if(i!==this.loadSeq)return;let p=new Map,c=[];for(let[s,u]of t)if(u==="failed"){c.push(s);let m=this.docs.get(s);m!==void 0&&p.set(s,m)}else u!==void 0&&p.set(s,u);this.docs=p,this.failed=c,this.linksOn=d,this.readState="ready"}async readOne(e,i){try{let n=await M(e,i,"pages");return[i,n.revision>0?R(n.document):void 0]}catch{return[i,"failed"]}}reloadOne(e){let i=this.reloadTimers.get(e);i!==void 0&&window.clearTimeout(i),this.reloadTimers.set(e,window.setTimeout(()=>{this.reloadTimers.delete(e);let n=this.hassNow;if(!n||!this.isConnected)return;let a=(this.readSeq.get(e)??0)+1;this.readSeq.set(e,a);let t=this.loadSeq;this.readOne(n,e).then(([,d])=>{if(a!==this.readSeq.get(e)||t!==this.loadSeq||d==="failed")return;let p=new Map(this.docs);d===void 0?p.delete(e):p.set(e,d),this.docs=p})},ke))}startSubscriptions(e){this.endSubscriptions();let i=this.hassNow;if(!i)return;let n=this.subscribeSeq;for(let a of e){let t=a.ownerId;_(i,t,d=>{n===this.subscribeSeq&&d.kind==="pages"&&this.reloadOne(t)}).then(d=>{n===this.subscribeSeq?this.unsubscribers.push(d):Promise.resolve(d()).catch(()=>{})},()=>{})}}endSubscriptions(){this.subscribeSeq++;for(let e of this.unsubscribers)Promise.resolve(e()).catch(()=>{});this.unsubscribers=[]}setFilter(e){this.filter=e,me=e,this.closeDevices()}open(e,i){let n=T(e,i);G(n.device.ownerId,{pageId:x(n.page)}),this.onOpen?.(n.device.ownerId,n.device.kind)}cardOfMenu(e){let i=this.menuAt;if(i!==void 0)return e.find(n=>{let a=f(n,i.ownerId);return a!==void 0&&Pe(x(a.page),i.pageId)})}openDevices(e){let i=e.copies[0];this.menuAt={ownerId:i.device.ownerId,pageId:x(i.page)},this.devicesNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.menuAt=void 0,this.devicesNote=void 0}async toggle(e,i){let n=this.hassNow;if(!n||this.linking||i.stuck!==void 0)return;let a=i.device.ownerId,t=i.device.name,d=e.pageId,p;this.linking=!0,this.devicesNote=void 0;try{if(i.on){let s=await ie(n,a,x(f(e,a).page),t);p=s===void 0?{kind:"ok",text:`Taken off ${t}.`}:{kind:"err",text:s}}else{let s=I(e,u=>D(u)?.dirty??!1);if(s===void 0)p={kind:"warn",text:S};else{let u=x(f(e,s).page),m=await N(n,s,[u],[a]),P=Z(m,a,[u],this.docs.get(s));p={kind:"ok",text:`Added to ${t}.${P===void 0?"":` ${P}`}`}}}}catch(s){p={kind:"err",text:`Not added. ${ee(s)}`}}finally{this.linking=!1}let c=i.on?e.copies.find(s=>s.device.ownerId!==a):e.copies[0];c!==void 0&&this.menuAt!==void 0&&(this.menuAt={ownerId:c.device.ownerId,pageId:d}),this.devicesNote=p,await this.loadAll()}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return g`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let i=this.cards,n=he(this.filter,e),a=ge(i,n,this.search),t=e.find(c=>c.ownerId===n),d=this.readState!=="ready"&&i.length===0,p=this.failed.map(c=>e.find(s=>s.ownerId===c)?.name).filter(c=>c!==void 0);return g`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Pages</h1>
          <p class="ap-lead">${pe}</p>
        </div>
        ${i.length>0?g`<label class="ap-search">${y("search")}
          <input type="search" class="ap-search-input" placeholder="Find a page" aria-label="Find a page by name"
            .value=${this.search} @input=${c=>{this.search=c.target.value}} /></label>`:w}
      </div>
      ${e.length>1?this.renderChips(e,i,n):w}
      ${p.length===0?w:g`<p class="ap-warn" role="status">Could not read the pages of ${p.join(", ")}. They show as last read.</p>`}
      <section class="ap-sec" aria-label=${t===void 0?"Every page":`Pages on ${t.name}`}>
        <div class="ap-sec-top">
          <span class="ap-sec-chip" aria-hidden="true">${y(t===void 0?"pages":t.kind==="iphone"?"phone":"watch")}</span>
          <span class="ap-sec-t">
            <h2>${t===void 0?"Every page":`On ${t.name}`}</h2>
            <span class="ap-sec-note">Click a page to edit it.${this.linksOn&&e.length>1?" Devices puts it on another watch or iPhone.":""}</span>
          </span>
          <span class="ap-sec-count">${a.length}</span>
        </div>
        ${d?g`<p class="ap-empty">Reading every device's pages…</p>`:a.length===0?g`<p class="ap-empty">${fe(n,e,this.search)}</p>`:g`<div class="ap-grid" role="list">${a.map(c=>this.renderCard(c,n,e,i))}</div>`}
      </section>
    </div></div>`}renderChips(e,i,n){return g`<div class="ap-chips" role="group" aria-label="Show pages on">
      ${le(e,i).map(a=>g`<button type="button" class="ap-chip ${a.id===n?"on":""}"
        aria-pressed=${a.id===n?"true":"false"}
        title=${a.id===k?"Every page on every device":`The pages on ${a.label}`}
        @click=${()=>this.setFilter(a.id)}>
        ${a.kind===void 0?w:y(a.kind==="iphone"?"phone":"watch")}
        <span>${a.label}</span><span class="ap-chip-n">${a.count}</span>
      </button>`)}
    </div>`}renderCard(e,i,n,a){let t=T(e,i),d=this.cardOfMenu(a)?.key===e.key,p=this.linksOn&&n.length>1,c=`Edit ${e.name} on ${t.device.name}`;return g`<div class="ap-card ${d?"over":""}" role="listitem" data-card=${e.key}>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${c} @click=${()=>this.open(e,i)}>
        ${this.renderThumb(t)}
      </button>
      <div class="ap-body">
        <button type="button" class="ap-open" title=${c} @click=${()=>this.open(e,i)}>
          <b class="ap-name">${e.name}</b>
          <small class="ap-detail">${ve(e)}</small>
        </button>
        <span class="ap-devs">${e.copies.map(s=>g`<span class="ap-dev ${s.hidden?"dim":""}"
          title=${s.hidden?`On ${s.device.name}, hidden there`:`On ${s.device.name}`}>
          ${y(s.device.kind==="iphone"?"phone":"watch")}<span class="ap-dev-n">${s.device.name}</span>${s.hidden?g`<em>hidden</em>`:w}
        </span>`)}</span>
        ${p?g`<button type="button" class="ap-dev-open ${d?"on":""}" aria-expanded=${d?"true":"false"}
          title="Pick the devices this page is on"
          @click=${()=>d?this.closeDevices():this.openDevices(e)}>${y("phone")}<span>Devices</span>${y("chevron")}</button>`:w}
      </div>
      ${d?this.renderMenu(e,n):w}
    </div>`}renderMenu(e,i){let n=I(e,a=>D(a)?.dirty??!1)===void 0;return ne({name:e.name,places:ue(i,e),...n?{blocked:S}:{},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",onToggle:a=>{this.toggle(e,a)},onDone:()=>this.closeDevices()})}renderThumb(e){let i=this.owners.find(s=>s.owner_watch_id===e.device.ownerId),n=this.docs.get(e.device.ownerId),a=n===void 0?[e.page]:H(n),t=this.hassNow?.states,d=this.icons;if(e.device.kind==="iphone"){let s=se(te(i?.screen_size)),u=C/s.model.screen.height;return g`<span class="ap-pic phone">${$({page:e.page,pages:a,screen:re(s),scale:u,phone:s,...t===void 0?{}:{states:t},...d===void 0?{}:{icons:d}})}</span>`}let p=(q(i?.screen_size)??A).screen,c=C/p.height;return g`<span class="ap-pic watch" style=${`--ap-screen-h:${Math.round(C*100)/100}px`}>${$({page:e.page,pages:a,screen:p,scale:c,...t===void 0?{}:{states:t},...d===void 0?{}:{icons:d}})}</span>`}static{this.styles=[de,X,oe,ae,L`
    :host { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; color: var(--wa-ink); }
    * { box-sizing: border-box; }
    svg { display: block; }
    button { font: inherit; color: inherit; }
    .ap-page {
      flex: 1 1 auto; min-height: 0; overflow: auto;
      padding: 14px clamp(12px, 3vw, 28px) 40px;
      background: var(--wa-bg); color: var(--wa-ink);
    }
    .ap-wrap { width: min(1400px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
    /* The head, as the watch Complications screen's: the title and a line,
       and the search at the right. */
    .ap-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 16px; padding: 0 2px; }
    .ap-head-text { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
    .ap-head h1 { margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -.02em; }
    .ap-lead { margin: 0; font-size: 13px; color: var(--wa-muted); max-width: 720px; }
    .ap-search {
      display: flex; align-items: center; gap: 8px; flex: none; width: 240px; max-width: 100%;
      height: 30px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-field, var(--wa-card));
    }
    .ap-search:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .ap-search svg { width: 14px; height: 14px; flex: none; color: var(--wa-muted); }
    .ap-search-input { flex: 1; min-width: 0; font: inherit; font-size: 13px; color: var(--wa-ink); border: 0; background: transparent; outline: 0; padding: 0; }
    /* The filter: pills, the gallery's tags' look. */
    .ap-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .ap-chip {
      display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 500;
      padding: 5px 10px; border-radius: 999px; cursor: pointer; color: var(--wa-muted);
      border: 1px solid var(--wa-line); background: transparent; white-space: nowrap;
    }
    .ap-chip svg { width: 14px; height: 14px; }
    .ap-chip:hover { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .ap-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-chip.on { border-color: var(--wa-accent); color: var(--wa-ink); background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .ap-chip-n { font-size: 11.5px; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
    .ap-warn { margin: 0; font-size: 12.5px; color: var(--wa-need); }
    /* The list is a card with a lit outline, as on the watch Complications
       screen, in the Pages door's green. */
    .ap-sec {
      --c: var(--wa-hue-green);
      display: flex; flex-direction: column; gap: 10px; padding: 0 12px 12px;
      border-radius: var(--wa-r-lg);
      background:
        linear-gradient(var(--wa-card), var(--wa-card)) padding-box,
        linear-gradient(140deg, var(--c) 0%, color-mix(in srgb, var(--c) 45%, transparent) 30%,
          color-mix(in srgb, var(--c) 30%, var(--wa-line-strong)) 62%, color-mix(in srgb, var(--c) 35%, transparent) 100%) border-box;
      border: 2px solid transparent;
    }
    .ap-sec-top {
      display: flex; align-items: center; gap: 12px; margin: 0 -12px; padding: 12px 14px;
      border-radius: calc(var(--wa-r-lg) - 2px) calc(var(--wa-r-lg) - 2px) 0 0;
      background: linear-gradient(90deg, color-mix(in srgb, var(--c) 16%, transparent), transparent 70%);
      border-bottom: 1px solid color-mix(in srgb, var(--c) 28%, var(--wa-line));
    }
    .ap-sec-chip {
      flex: none; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 9px;
      color: var(--c); border: 1.5px solid var(--c); background: color-mix(in srgb, var(--c) 12%, transparent);
    }
    .ap-sec-chip svg { width: 17px; height: 17px; }
    .ap-sec-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .ap-sec-top h2 { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ap-sec-note { font-size: 12.5px; color: var(--wa-muted); }
    .ap-sec-count {
      flex: none; min-width: 30px; padding: 3px 10px; border-radius: 999px; text-align: center;
      font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums;
      color: var(--c); border: 1px solid color-mix(in srgb, var(--c) 60%, transparent);
    }
    .ap-empty { margin: 0; padding: 18px 4px; font-size: 13px; color: var(--wa-muted); }
    /* The cards: as many columns as fit, each the picture and, beside it,
       the name, the devices and Devices. */
    .ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 8px; }
    .ap-card {
      position: relative; display: flex; gap: 10px; min-width: 0; padding: 8px;
      border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-card);
    }
    .ap-card:hover, .ap-card.over { border-color: var(--wa-line-strong); }
    .ap-card.over { z-index: 5; }
    .ap-thumb {
      flex: none; display: grid; place-items: center; width: 84px; height: ${C+4}px; padding: 0; overflow: hidden;
      border: 0; border-radius: 8px; background: var(--wa-bg); cursor: pointer;
    }
    .ap-pic { display: block; line-height: 0; pointer-events: none; }
    /* A watch's screen alone, with its corners and no case, as Home's
       Pages door draws it. */
    .ap-pic.watch .wa-watch { padding: 0; margin: 0; background: none; box-shadow: 0 0 0 1px var(--wa-line-strong); border-radius: var(--wf-radius, 6px); }
    .ap-pic.watch .wa-watch::before, .ap-pic.watch .wa-watch::after { display: none; }
    .ap-pic.watch .wa-watch > .wp-screen { max-height: var(--ap-screen-h); }
    .ap-pic .wp-fold { display: none; }
    /* An iPhone in its case, without the side buttons. */
    .ap-pic.phone .wa-phone { margin: 0; box-shadow: 0 0 0 1px var(--wa-line-strong); }
    .ap-pic.phone .wa-phone::before, .ap-pic.phone .wa-phone::after { display: none; }
    .ap-body { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
    .ap-open {
      display: flex; flex-direction: column; align-items: flex-start; gap: 1px; max-width: 100%;
      padding: 0; border: 0; background: none; cursor: pointer; text-align: left;
    }
    .ap-open:focus-visible, .ap-thumb:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .ap-name { max-width: 100%; font-size: 13.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ap-open:hover .ap-name { text-decoration: underline; text-underline-offset: 2px; }
    .ap-detail { font-size: 11.5px; color: var(--wa-muted); }
    .ap-devs { display: flex; flex-wrap: wrap; gap: 4px; max-width: 100%; }
    .ap-dev {
      display: inline-flex; align-items: center; gap: 4px; max-width: 100%; padding: 2px 7px 2px 5px; border-radius: 999px;
      font-size: 11px; color: var(--wa-ink); background: var(--wa-hover); border: 1px solid var(--wa-line);
    }
    .ap-dev svg { flex: none; width: 12px; height: 12px; color: var(--wa-muted); }
    .ap-dev-n { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ap-dev.dim { opacity: .55; }
    .ap-dev em { font-style: normal; font-size: 10px; color: var(--wa-muted); }
    .ap-dev-open {
      display: inline-flex; align-items: center; gap: 4px; margin-top: auto; padding: 3px 6px 3px 7px; border-radius: 6px; cursor: pointer;
      font-size: 11.5px; font-weight: 600; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
    }
    .ap-dev-open svg { width: 13px; height: 13px; }
    .ap-dev-open:hover { background: var(--wa-hover); }
    .ap-dev-open:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-dev-open.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent); }
    /* The Devices menu hangs under its card, over the cards below. */
    .ap-card > .pe-dev-menu { position: absolute; top: calc(100% - 4px); left: 8px; width: 250px; max-width: calc(100vw - 32px); z-index: 6; }
    @media (max-width: 640px) {
      .ap-page { padding: 14px 12px 32px; }
      .ap-sec { padding: 0 10px 10px; }
      .ap-sec-top { margin: 0 -10px; padding: 10px 12px; }
      .ap-search { width: 100%; }
    }
  `]}};h([b({attribute:!1})],l.prototype,"owners",2),h([b({attribute:!1})],l.prototype,"ownersReady",2),h([b({attribute:!1})],l.prototype,"phones",2),h([b({attribute:!1})],l.prototype,"icons",2),h([b({attribute:!1})],l.prototype,"iconsTick",2),h([b({attribute:!1})],l.prototype,"onOpen",2),h([v()],l.prototype,"docs",2),h([v()],l.prototype,"failed",2),h([v()],l.prototype,"readState",2),h([v()],l.prototype,"linksOn",2),h([v()],l.prototype,"filter",2),h([v()],l.prototype,"search",2),h([v()],l.prototype,"menuAt",2),h([v()],l.prototype,"linking",2),h([v()],l.prototype,"devicesNote",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",l);export{l as WaAllPages};
