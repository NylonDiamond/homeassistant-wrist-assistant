import{A as ke,B as be,C as me,D as E,E as q,F as xe,G as T,H as ye,I as $e,J as Pe,K as Se,d as le,m as P,n as ce,o as L,q as he,r as ue,s as ge,t as K,u as fe,v as C,w as ve,x as we,y as _,z as S}from"./chunk-463XBMIO.js";import{b as O,d as pe}from"./chunk-SPTKBBHW.js";import"./chunk-J23RLD45.js";import{s as F,y as Re}from"./chunk-74LZXTUW.js";import"./chunk-W6YU56LQ.js";import{a as Ie,b as De,c as Ce,h as Te}from"./chunk-J4YVMTJE.js";import"./chunk-GEU5IYGP.js";import"./chunk-4I5F75IY.js";import{a as se,b as oe,d as de}from"./chunk-VQV23OQO.js";import{P as ae,U as ie,j as ne}from"./chunk-DK2DZHWA.js";import{k as re,l as B,n as m}from"./chunk-YDWRUXOV.js";import{Eg as Z,Hg as Q,Jg as ee,Ng as te,b as G,d as h,g as w,j as X,k as I,kh as x,l as b}from"./chunk-D2VEH7YA.js";import{b as D}from"./chunk-5XITPOUG.js";import{a as v}from"./chunk-LO2NM3CE.js";var $=s=>s.toUpperCase();function Ne(s,d,e){return`${s} ${s===1?d:e}`}var z=s=>Ne(s,"page","pages");function H(s){return s.length<=3?P(s):`${s.slice(0,3).join(", ")} and ${s.length-3} more`}function Be(s,d){let e=new Set(s);return e.has(d)?e.delete(d):e.add(d),e}function Oe(s,d,e,t){let n=new Set(s),i=d.indexOf(t),r=e===void 0?-1:d.indexOf(e);if(i<0)return n;if(r<0)return n.add(t),n;for(let a=Math.min(r,i);a<=Math.max(r,i);a++)n.add(d[a]);return n}function Le(s,d){return new Set([...s,...d])}function Ee(s,d){let e=new Set(d);return new Set([...s].filter(t=>!e.has(t)))}function V(s,d){let e=new Set(d);return new Set([...s].filter(t=>e.has(t)))}function ze(s,d){let e=new Set(s.flatMap(t=>t.copies.map(n=>`${n.device.ownerId}|${$(m(n.page))}`)));return new Set(d.filter(t=>t.copies.some(n=>e.has(`${n.device.ownerId}|${$(m(n.page))}`))).map(t=>t.key))}function Ae(s,d,e){let t=s.find(n=>n.ownerId===d);t!==void 0?t.names.push(e):s.push({ownerId:d,names:[e]})}function Ke(s,d,e,t){let n={calls:[],already:0,taken:[],dirty:[],blocked:[]},i=d.filter(a=>t(a)?(n.dirty.push(a),!1):!0),r=new Map(i.map(a=>[a,new Set((e.get(a)===void 0?[]:B(e.get(a))).map(o=>$(m(o))))]));for(let a of s){let o=i.filter(p=>S(a,p)===void 0);if(n.already+=i.length-o.length,o.length===0)continue;let c=T(a,t);if(c===void 0){n.blocked.push(a.name);continue}let l=m(S(a,c).page);for(let p of o){let g=r.get(p);if(g.has($(l))){Ae(n.taken,p,a.name);continue}g.add($(l));let k=n.calls.find(y=>y.source===c&&y.target===p);k!==void 0?(k.pageIds.push(l),k.names.push(a.name)):n.calls.push({source:c,target:p,pageIds:[l],names:[a.name]})}}return n}function _e(s,d,e){let t=s.find(n=>n.ownerId===d);t!==void 0?t.pageIds.push(e):s.push({ownerId:d,pageIds:[e]})}function qe(s,d){s.includes(d)||s.push(d)}function Fe(s,d,e){let t={work:[],lastOnly:[],dirty:[],notThere:0},n=new Set(d);for(let i of s){let r=i.copies.filter(a=>n.has(a.device.ownerId));if(r.length===0){t.notThere++;continue}if(r.length===i.copies.length){t.lastOnly.push(i.name);continue}for(let a of r){let o=a.device.ownerId;e(o)?qe(t.dirty,o):_e(t.work,o,m(a.page))}}return t}function U(s,d,e){let t={work:[],pages:[],devices:[],dirty:[]},n=new Set;for(let i of s){t.pages.push({name:i.name,copies:i.copies.map(r=>({ownerId:r.device.ownerId,pageId:m(r.page)}))});for(let r of i.copies){let a=r.device.ownerId;n.add(a),e(a)?qe(t.dirty,a):_e(t.work,a,m(r.page))}}return t.devices=d.map(i=>i.ownerId).filter(i=>n.has(i)),t.work.sort((i,r)=>t.devices.indexOf(i.ownerId)-t.devices.indexOf(r.ownerId)),t}var R=(s,d)=>s.find(e=>e.ownerId===d)?.name??"a device";function He(s,d){let e=s.pages.length,t=s.devices.map(r=>R(d,r)),n=`Delete ${z(e)} from ${Ne(t.length,"device","devices")}?`,i=[`${e===1?"It comes":"They come"} off ${P(t)}, with the menu slots and complication taps there that open ${e===1?"it":"them"}. This cannot be undone.`];if(s.dirty.length>0){let r=s.dirty.map(a=>R(d,a));i.push(`${P(r)} ${r.length===1?"has":"have"} unsaved edits, so ${r.length===1?"its":"their"} copies stay.`)}return{title:n,body:i.join(" ")}}function j(s){return{action:s,done:[],gone:0,also:0,taken:[],dirty:[],blocked:[],lastOnly:[],failed:[],refs:[]}}function W(s,d,e){if(e===0)return;let t=s.done.find(n=>n.ownerId===d);t!==void 0?t.count+=e:s.done.push({ownerId:d,count:e})}function Me(s,d,e){let t=s.targets?.[d];if(t===void 0)return 0;let n=new Set(e.map($));return(t.pages??[]).filter(i=>!n.has($(i))).length+(t.status_pages??[]).length}var Ge=new Set(["id_taken","not_found","system_page"]);async function We(s,d,e,t){let n=j("add");n.taken=d.taken.map(r=>({ownerId:r.ownerId,names:[...r.names]})),n.dirty=[...d.dirty],n.blocked=[...d.blocked];let i=(r,a,o)=>{D(a).code==="id_taken"&&o!==void 0?Ae(n.taken,r,o):n.failed.push({ownerId:r,message:`${o===void 0?"":`${o}: `}${L(a)}`})};for(let[r,a]of d.calls.entries()){t?.(`Adding to ${R(e,a.target)} (${r+1} of ${d.calls.length})\u2026`);try{let o=await s.link(a.source,a.pageIds,a.target);W(n,a.target,a.pageIds.length),n.also+=Me(o,a.target,a.pageIds)}catch(o){let c=D(o).code;if(a.pageIds.length===1){i(a.target,o,a.names[0]);continue}if(c===void 0||!Ge.has(c)){i(a.target,o);continue}for(let[l,p]of a.pageIds.entries())try{let g=await s.link(a.source,[p],a.target);W(n,a.target,1),n.also+=Me(g,a.target,[p])}catch(g){i(a.target,g,a.names[l])}}}return n}async function Ve(s,d,e,t,n,i){let r=new Map;for(let[a,o]of d.entries()){i?.(`${n} ${R(t,o.ownerId)} (${a+1} of ${d.length})\u2026`);let c;try{c=await s.remove(o.ownerId,o.pageIds)}catch(l){c={ok:!1,code:"unknown",message:D(l).message}}if(!c.ok){e.failed.push({ownerId:o.ownerId,message:c.message});continue}if(r.set(o.ownerId,new Set(c.removed.map($))),W(e,o.ownerId,c.removed.length),c.removed.length!==0)try{let l=await s.clearRefs(o.ownerId,c.removed);(l?.kind==="warn"||l?.kind==="err")&&e.refs.push(o.ownerId)}catch{e.refs.push(o.ownerId)}}return r}async function Ue(s,d,e,t){let n=j("remove");return n.dirty=[...d.dirty],n.lastOnly=[...d.lastOnly],await Ve(s,d.work,n,e,"Taking pages off",t),n}async function je(s,d,e,t){let n=j("delete");n.dirty=[...d.dirty];let i=await Ve(s,d.work,n,e,"Deleting on",t);return n.gone=d.pages.filter(r=>r.copies.every(a=>i.get(a.ownerId)?.has($(a.pageId))??!1)).length,n}var Xe="Save or discard the edits in its page editor first.";function Ye(s,d){let e=a=>R(d,a),t=[],n=s.done.map(a=>`${z(a.count)} ${s.action==="add"?"to":s.action==="remove"?"off":"on"} ${e(a.ownerId)}`);s.action==="add"&&n.length>0?(t.push(`Added ${P(n)}.`),s.also>0&&t.push(`Their tiles brought ${z(s.also)} more.`)):s.action==="remove"&&n.length>0?t.push(`Took ${P(n)}.`):s.action==="delete"&&(s.gone>0||n.length>0)&&t.push(s.gone>0?`Deleted ${z(s.gone)}.`:`Deleted ${P(n)}.`);let i=t.length>0,r=!1;for(let a of s.taken)r=!0,t.push(`Not added to ${e(a.ownerId)}: ${H(a.names)}. It already has ${a.names.length===1?"a page":"pages"} of its own with the same id.`);s.blocked.length>0&&(r=!0,t.push(`Not added: ${H(s.blocked)}. Every device ${s.blocked.length===1?"it is":"they are"} on has unsaved edits.`)),s.lastOnly.length>0&&(r=!0,t.push(`Kept ${H(s.lastOnly)}: ${s.lastOnly.length===1?"it":"they"} would be left on no device. Use Delete for those.`));for(let a of s.dirty)r=!0,t.push(`Left ${e(a)} alone: its pages have unsaved edits. ${Xe}`);for(let a of s.failed){r=!0;let o=s.action==="add"?`Not added to ${e(a.ownerId)}`:s.action==="remove"?`Not taken off ${e(a.ownerId)}`:`Not deleted on ${e(a.ownerId)}`;t.push(`${o}: ${a.message.replace(/\.$/,"")}.`)}return s.refs.length>0&&(r=!0,t.push(`Could not clear the menu slots or complication taps that opened them on ${P(s.refs.map(e))}. Change those by hand.`)),!i&&!r?{kind:"ok",text:s.action==="add"?"Those pages are on those devices already.":s.action==="remove"?"None of those pages are on those devices.":"Nothing was deleted."}:{kind:r?i?"warn":"err":"ok",text:t.join(" ")}}var Y=92,Ze=2e3,Qe=250,Je="wrist-assistant-panel.all-pages.v1",N;function A(){if(N!==void 0)return N;let s={bare:!1,kind:"all"};try{let d=window.localStorage.getItem(Je),e=d?JSON.parse(d):{};typeof e.filter=="string"&&(s.filter=e.filter),typeof e.bare=="boolean"&&(s.bare=e.bare),(e.kind==="watch"||e.kind==="iphone")&&(s.kind=e.kind)}catch{}return N=s,s}function J(s){N={...A(),...s};try{window.localStorage.setItem(Je,JSON.stringify(N))}catch{}}var et=(s,d)=>s.toUpperCase()===d.toUpperCase(),M=s=>O(s)?.dirty??!1,u=class extends X{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.docs=new Map;this.failed=[];this.readState="idle";this.linksOn=!0;this.filter=A().filter;this.search="";this.bare=A().bare;this.kind=A().kind;this.linking=!1;this.selecting=!1;this.selected=new Set;this.hassDrawnAt=0;this.loadSeq=0;this.readSeq=new Map;this.reloadTimers=new Map;this.unsubscribers=[];this.subscribeSeq=0;this.onKeyDown=e=>{e.key==="Escape"&&(this.bulkMenu!==void 0&&this.bulkBusy===void 0?(e.preventDefault(),this.closeBulkMenu()):this.menuAt!==void 0?(e.preventDefault(),this.closeDevices()):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))};this.onWindowPointerDown=e=>{let t=(this.bulkMenu==="add"||this.bulkMenu==="remove")&&this.bulkBusy===void 0;if(this.menuAt===void 0&&!t)return;let n=e.composedPath(),i=(...r)=>n.some(a=>a instanceof Element&&r.some(o=>a.classList.contains(o)));this.menuAt!==void 0&&!i("pe-dev-menu","ap-dev-open")&&this.closeDevices(),t&&!i("pk-bar-menu")&&this.closeBulkMenu()}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let n=Date.now();(t||n-this.hassDrawnAt>=Ze)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.deviceSig=void 0,this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.endSubscriptions();for(let e of this.reloadTimers.values())window.clearTimeout(e);this.reloadTimers.clear(),this.loadSeq++,this.deviceSig=void 0}willUpdate(e){let t=this.devices,n=t.map(i=>i.ownerId).join(",");this.hassNow!==void 0&&this.isConnected&&n!==this.deviceSig&&(this.deviceSig=n,this.loadAll(),this.startSubscriptions(t))}get devices(){return le(this.owners,this.phones)}get cards(){let e=this.devices,t=this.cardsMemo;if(t!==void 0&&t.docs===this.docs&&t.devices.length===e.length&&t.devices.every((i,r)=>i.ownerId===e[r].ownerId&&i.name===e[r].name))return t.cards;let n=fe(e,this.docs);return this.cardsMemo={docs:this.docs,devices:e,cards:n},n}async loadAll(){let e=this.hassNow;if(!e)return;let t=++this.loadSeq,n=this.devices;this.readState==="idle"&&(this.readState="loading");let i=ee(e).then(()=>!0,l=>D(l).code!=="unknown_command"),r=await Promise.all(n.map(l=>this.readOne(e,l.ownerId))),a=await i;if(t!==this.loadSeq)return;let o=new Map,c=[];for(let[l,p]of r)if(p==="failed"){c.push(l);let g=this.docs.get(l);g!==void 0&&o.set(l,g)}else p!==void 0&&o.set(l,p);this.docs=o,this.failed=c,this.linksOn=a,this.readState="ready"}async readOne(e,t){try{let n=await Z(e,t,"pages");return[t,n.revision>0?re(n.document):void 0]}catch{return[t,"failed"]}}reloadOne(e){let t=this.reloadTimers.get(e);t!==void 0&&window.clearTimeout(t),this.reloadTimers.set(e,window.setTimeout(()=>{this.reloadTimers.delete(e);let n=this.hassNow;if(!n||!this.isConnected)return;let i=(this.readSeq.get(e)??0)+1;this.readSeq.set(e,i);let r=this.loadSeq;this.readOne(n,e).then(([,a])=>{if(i!==this.readSeq.get(e)||r!==this.loadSeq||a==="failed")return;let o=new Map(this.docs);a===void 0?o.delete(e):o.set(e,a),this.docs=o})},Qe))}startSubscriptions(e){this.endSubscriptions();let t=this.hassNow;if(!t)return;let n=this.subscribeSeq;for(let i of e){let r=i.ownerId;te(t,r,a=>{n===this.subscribeSeq&&a.kind==="pages"&&this.reloadOne(r)}).then(a=>{n===this.subscribeSeq?this.unsubscribers.push(a):Promise.resolve(a()).catch(()=>{})},()=>{})}}endSubscriptions(){this.subscribeSeq++;for(let e of this.unsubscribers)Promise.resolve(e()).catch(()=>{});this.unsubscribers=[]}setFilter(e){this.filter=e,J({filter:e}),this.closeDevices(),this.pruneSelected()}setSearch(e){this.search=e,this.pruneSelected()}setKind(e){this.kind=e,J({kind:e}),this.closeDevices(),this.pruneSelected()}setBare(e){this.bare=e,J({bare:e})}open(e,t){let n=q(e,t,this.kindNow());pe(n.device.ownerId,{pageId:m(n.page)}),this.onOpen?.(n.device.ownerId,n.device.kind)}cardOfMenu(e){let t=this.menuAt;if(t!==void 0)return e.find(n=>{let i=S(n,t.ownerId);return i!==void 0&&et(m(i.page),t.pageId)})}openDevices(e){let t=e.copies[0];this.menuAt={ownerId:t.device.ownerId,pageId:m(t.page)},this.devicesNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.menuAt=void 0,this.devicesNote=void 0}async toggle(e,t){let n=this.hassNow;if(!n||this.linking||t.stuck!==void 0)return;let i=t.device.ownerId,r=t.device.name,a=e.pageId,o;this.linking=!0,this.devicesNote=void 0;try{if(t.on){let l=await ue(n,i,m(S(e,i).page),r);o=l===void 0?{kind:"ok",text:`Taken off ${r}.`}:{kind:"err",text:l}}else{let l=T(e,p=>O(p)?.dirty??!1);if(l===void 0)o={kind:"warn",text:K};else{let p=m(S(e,l).page),g=await Q(n,l,[p],[i]),k=ce(g,i,[p],this.docs.get(l));o={kind:"ok",text:`Added to ${r}.${k===void 0?"":` ${k}`}`}}}}catch(l){o={kind:"err",text:`Not added. ${L(l)}`}}finally{this.linking=!1}let c=t.on?e.copies.find(l=>l.device.ownerId!==i):e.copies[0];c!==void 0&&this.menuAt!==void 0&&(this.menuAt={ownerId:c.device.ownerId,pageId:a}),this.devicesNote=o,await this.loadAll()}kindNow(){return be(this.kind,this.devices)}shownNow(){return E(this.cards,_(this.filter,this.devices),this.search,this.kindNow())}pickedCards(){return this.shownNow().filter(e=>this.selected.has(e.key))}pruneSelected(){this.selected.size!==0&&(this.selected=V(this.selected,this.shownNow().map(e=>e.key)))}startSelect(){this.selecting=!0,this.closeDevices(),this.bulkNote=void 0}endSelect(){this.bulkBusy===void 0&&(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.bulkMenu=void 0,this.bulkNote=void 0)}cardClick(e,t,n){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(t,n);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!i)}pick(e,t){this.bulkBusy===void 0&&(this.selecting||this.startSelect(),this.selected=t?Oe(this.selected,this.shownNow().map(n=>n.key),this.anchor,e.key):Be(this.selected,e.key),this.anchor=e.key,this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0))}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(n=>n.key);this.selected=e?Le(this.selected,t):Ee(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0)}openBulkMenu(e){if(this.bulkBusy===void 0){if(this.bulkMenu===e){this.closeBulkMenu();return}this.bulkMenu=e,this.bulkNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar")?.querySelector(e==="delete"?".pk-bar-cancel":".pk-bar-row:not(:disabled)")?.focus()})}}closeBulkMenu(){this.bulkMenu=void 0}async runBulk(e,t=[]){let n=this.hassNow;if(!n||this.bulkBusy!==void 0)return;let i=this.devices,r=this.pickedCards();if(r.length===0)return;let a=i.map(p=>p.ownerId).filter(p=>t.includes(p));if(e!=="delete"&&a.length===0)return;let o=he(n),c=p=>{this.bulkBusy=p};this.bulkMenu=void 0,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let l;try{let p;e==="add"?p=await We(o,Ke(r,a,this.docs,M),i,c):e==="remove"?p=await Ue(o,Fe(r,a,M),i,c):p=await je(o,U(r,i,M),i,c),l=Ye(p,i)}catch(p){l={kind:"err",text:D(p).message}}this.bulkBusy="Reading the pages again\u2026";try{await this.loadAll()}finally{this.bulkBusy=void 0}this.selected=V(ze(r,this.cards),this.shownNow().map(p=>p.key)),this.anchor=void 0,this.bulkNote=l}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return h`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let t=this.cards,n=_(this.filter,e),i=this.kindNow(),r=E(t,n,this.search,i),a=this.readState!=="ready"&&t.length===0,o=this.failed.map(p=>e.find(g=>g.ownerId===p)?.name).filter(p=>p!==void 0),c=e.length>1,l=this.selecting?"Click pages to pick them. Shift+click picks every page between two.":`Click a page to edit it.${this.linksOn&&e.length>1?" Devices on a card puts it on another watch or iPhone.":""}`;return h`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Pages</h1>
          <p class="ap-lead">${a?"Reading every device's pages\u2026":ge(t.length)}</p>
        </div>
      </div>
      ${o.length===0?w:h`<p class="ap-warn" role="status">Could not read the pages of ${o.join(", ")}. They show as last read.</p>`}
      <div class="pk-surface pk-page ${this.bare?"bare":""}" role="region" aria-label="Your pages">
        <div class="pk-pin">
          ${this.renderHead(t,n,e)}
          ${c?this.renderTabs(e,t,n):w}
          ${this.selecting?this.renderBar(r,e):w}
        </div>
        <div class="pk-body" role=${c?"tabpanel":w} aria-labelledby=${c?`ap-tab-${n}`:w}>
          ${a?h`<p class="ap-empty">Reading every device's pages…</p>`:r.length===0?h`<p class="ap-empty">${$e(n,e,this.search,i)}</p>`:h`<div class="ap-grid" role="list">${r.map(p=>this.renderCard(p,n,e,t))}</div>`}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${l}</span></div>
      </div>
    </div></div>`}renderHead(e,t,n){let i=this.bare,r=this.selecting,a=this.bulkBusy!==void 0;return h`<div class="pk-head">
      <div class="pk-seg" role="group" aria-label="How a card draws its page">
        <button type="button" class="pk-seg-btn ${i?"":"on"}" aria-pressed=${i?"false":"true"}
          title="Draw each page on the device it is on"
          @click=${()=>this.setBare(!1)}>${x("watch")}<span>On device</span></button>
        <button type="button" class="pk-seg-btn ${i?"on":""}" aria-pressed=${i?"true":"false"}
          title="Draw the page on its own, with no device round it"
          @click=${()=>this.setBare(!0)}>${x("pages")}<span>Page only</span></button>
      </div>
      <button type="button" class="pk-pick-btn ${r?"on":""}" aria-pressed=${r?"true":"false"}
        title=${r?"Back to opening one page at a time":"Pick several pages to add, remove or delete together"}
        ?disabled=${a} @click=${()=>r?this.endSelect():this.startSelect()}>
        ${x("checklist")}<span>Multi select</span></button>
      ${ke(n)?this.renderKinds(e,t):w}
      <label class="pk-search">
        ${x("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label="Search pages"
          @input=${o=>this.setSearch(o.target.value)} />
      </label>
    </div>`}renderKinds(e,t){let n=this.kindNow(),i=me(E(e,t,this.search));return h`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label="Show the pages on one kind of device" .value=${n}
        @change=${r=>this.setKind(r.target.value)}>
        ${i.map(r=>h`<option value=${r.key} ?selected=${r.key===n}>${r.label} (${r.count})</option>`)}
      </select>
    </label>`}renderTabs(e,t,n){return h`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${we(e,t).map(i=>h`<button type="button" role="tab" class="pk-tab ${i.id===n?"on":""}"
        style=${i.color===void 0?w:`--dc:${i.color}`} id=${`ap-tab-${i.id}`} aria-selected=${i.id===n?"true":"false"}
        title=${i.id===ve?"Every page on every device":`The pages on ${i.label}`}
        @click=${()=>this.setFilter(i.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${x(i.kind===void 0?"grid":i.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${i.label}</span>
        <span class="pk-tab-count">${i.count}</span>
      </button>`)}
    </div>`}renderCard(e,t,n,i){let r=q(e,t,this.kindNow()),a=this.selecting,o=!a&&this.cardOfMenu(i)?.key===e.key,c=!a&&this.linksOn&&n.length>1,l=a&&this.selected.has(e.key),p=a?`${l?"Let":"Pick"} ${e.name}${l?" go":""}`:`Edit ${e.name} on ${r.device.name}`,g=f=>this.cardClick(f,e,t),k=f=>`--dc:${C(n,f)??"var(--wa-line-strong)"}`,y=e.copies.length>1||this.bare;return h`<div class="ap-card ${o?"over":""} ${a?"picking":""} ${l?"picked":""}" role="listitem" data-card=${e.key}
      @click=${f=>{a&&g(f)}}>
      ${y?h`<span class="ap-strip" aria-hidden="true">${e.copies.map(f=>h`<i class=${f.hidden?"dim":""} style=${k(f.device.ownerId)}></i>`)}</span>`:w}
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${p} @click=${g}>
        ${this.renderThumb(r,C(n,r.device.ownerId))}
      </button>
      <div class="ap-body">
        <div class="ap-top">
          ${a?h`<input type="checkbox" class="pk-card-pick" .checked=${ne(l)} ?disabled=${this.bulkBusy!==void 0}
            aria-label=${p}
            @click=${f=>{f.stopPropagation(),this.pick(e,f.shiftKey)}} />`:w}
          <button type="button" class="ap-open" title=${p} tabindex=${a?"-1":"0"} @click=${g}>
            <b class="ap-name">${e.name}</b>
            <small class="ap-detail">${ye(e)}</small>
          </button>
        </div>
        <span class="ap-devs">${e.copies.map(f=>h`<span class="ap-dev ${f.hidden?"dim":""}" style=${k(f.device.ownerId)}
          title=${f.hidden?`On ${f.device.name}, hidden there`:`On ${f.device.name}`}>
          ${x(f.device.kind==="iphone"?"phone":"watch")}<span class="ap-dev-n">${f.device.name}</span>${f.hidden?h`<em>hidden</em>`:w}
        </span>`)}</span>
        ${c?h`<button type="button" class="ap-dev-open ${o?"on":""}" aria-expanded=${o?"true":"false"}
          title="Pick the devices this page is on"
          @click=${()=>o?this.closeDevices():this.openDevices(e)}>${x("phone")}<span>Devices</span>${x("chevron")}</button>`:w}
      </div>
      ${o?this.renderMenu(e,n):w}
    </div>`}renderMenu(e,t){let n=T(e,i=>O(i)?.dirty??!1)===void 0;return Pe({name:e.name,places:xe(t,e),...n?{blocked:K}:{},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",colorOf:i=>C(t,i),onToggle:i=>{this.toggle(e,i)},onDone:()=>this.closeDevices()})}renderBar(e,t){let n=e.filter(p=>this.selected.has(p.key)),i=n.length,r=this.bulkBusy!==void 0,a=i===0,o=e.length>0&&e.every(p=>this.selected.has(p.key)),c=t.length>1,l=r?void 0:this.bulkNote;return h`<div class="pk-bar" role="group" aria-label="Act on the picked pages">
      <span class="pk-bar-count" role="status">${this.bulkBusy??(a?"Pick a page to start.":`${i} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${r||e.length===0}
        title=${o?"Let the pages on screen go":"Pick every page the tab, the search and the Device menu have left"}
        @click=${()=>this.selectShown(!o)}>${o?"None":"All shown"}</button>
      ${l===void 0?w:h`<span class="pk-bar-said ${l.kind}">${l.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.bulkMenu==="delete"&&!a?this.renderDeleteAsk(n,t):h`${c&&this.linksOn?this.renderBarMenu("add",n,t,r||a):w}
          ${c?this.renderBarMenu("remove",n,t,r||a):w}
          <button type="button" class="ghost danger small" ?disabled=${r||a}
            title="Delete these pages from every device they are on"
            @click=${()=>this.openBulkMenu("delete")}>${x("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${r}
        title="Stop picking and go back to opening one page at a time"
        @click=${()=>this.endSelect()}>${x("check")}<span>Done</span></button>
    </div>`}renderBarMenu(e,t,n,i){let r=e==="add",a=this.bulkMenu===e&&!i,o=t.length,c=`${o} ${o===1?"page":"pages"}`,l=r?`Add ${c} to`:`Remove ${c} from`;return h`<span class="pk-bar-menu">
      <button type="button" class="ghost small ${a?"on":""}" aria-expanded=${a?"true":"false"} ?disabled=${i}
        title=${r?"Put these pages on another device, linked":"Take these pages off a device"}
        @click=${()=>this.openBulkMenu(e)}>${x(r?"plus":"layers")}<span>${r?"Add to\u2026":"Remove from\u2026"}</span></button>
      ${a?h`<div class="pk-bar-list" role="group" aria-label=${l}>
        <div class="pk-bar-head">${l}</div>
        ${n.map(p=>{let g=t.filter(f=>S(f,p.ownerId)!==void 0).length,k=M(p.ownerId),y=k?"unsaved edits":r?g===o?"has them all":void 0:g===0?"has none":void 0;return h`<button type="button" class="pk-bar-row" ?disabled=${y!==void 0}
            style=${`--dc:${C(n,p.ownerId)??"var(--wa-muted)"}`}
            title=${k?"Its pages have unsaved edits. Save or discard them first.":`${r?"Add to":"Remove from"} ${p.name}`}
            @click=${()=>{this.runBulk(e,[p.ownerId])}}>
            ${x(p.kind==="iphone"?"phone":"watch")}
            <span class="pk-dup-name">${p.name}</span>
            ${y===void 0?r?w:h`<span class="pk-bar-row-n">${g} of ${o}</span>`:h`<span class="pk-bar-row-n">${y}</span>`}
          </button>`})}
        <div class="pk-bar-note">${r?"They go on linked: an edit on one device shows on all of them.":"A page this would leave on no device stays. Use Delete for those."}</div>
      </div>`:w}
    </span>`}renderDeleteAsk(e,t){let n=He(U(e,t,M),t);return h`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask"
        @click=${()=>{this.runBulk("delete")}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>this.closeBulkMenu()}>Cancel</button>`}renderThumb(e,t){let n=this.owners.find(k=>k.owner_watch_id===e.device.ownerId),i=this.docs.get(e.device.ownerId),r=i===void 0?[e.page]:B(i),a=this.hassNow?.states,o=this.icons,c=this.bare,l=c?"bare":"framed";if(e.device.kind==="iphone"){let k=De(Ie(n?.screen_size)),y=Ce(k),f=Y/(c?y.height:k.model.screen.height);return h`<span class="ap-pic phone ${l}" style=${t===void 0?w:`--dc:${t}`}>${F({page:e.page,pages:r,screen:y,scale:f,phone:k,...a===void 0?{}:{states:a},...o===void 0?{}:{icons:o}})}</span>`}let p=(ie(n?.screen_size)??ae).screen,g=Y/(c?p.height:p.height+p.width*2*(se+oe));return h`<span class="ap-pic watch ${l}" style=${`--ap-screen-h:${Math.round(p.height*g*100)/100}px${t===void 0?"":`;--dc:${t}`}`}>${F({page:e.page,pages:r,screen:p,scale:g,...a===void 0?{}:{states:a},...o===void 0?{}:{icons:o}})}</span>`}static{this.styles=[Re,de,Te,Se,G`
    :host { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; color: var(--wa-ink); }
    * { box-sizing: border-box; }
    svg { display: block; }
    button { font: inherit; color: inherit; }
    /* The page, the Complications list page's (\`list-page.ts\`): the title
       and its line, then one outlined surface holding the head, the device
       tabs, the bar, the cards and the foot. */
    .ap-page {
      --ap-top: clamp(20px, 4vh, 40px);
      flex: 1 1 auto; min-height: 0; overflow: auto;
      padding: var(--ap-top) clamp(16px, 4vw, 40px) 48px;
      background: var(--wa-bg); color: var(--wa-ink);
    }
    .ap-wrap { width: min(1400px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
    .ap-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 16px; padding: 0 2px; }
    .ap-head-text { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
    .ap-head h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -.02em; }
    .ap-lead { margin: 0; font-size: 14px; color: var(--wa-muted); }
    .ap-warn { margin: 0; font-size: 12.5px; color: var(--wa-need); }
    .ap-empty { margin: 0; padding: 18px 4px; font-size: 13px; color: var(--wa-muted); }

    /* A copy of the Complications surface's rules in panel.ts (\`.pk-*\`,
       its page form in list-page.ts), so this tab's head, tabs and bar look
       the same. Keep the two in step. */
    .pk-surface.pk-page {
      display: flex; flex-direction: column; min-width: 0;
      border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-lg);
      background: var(--wa-card); color: var(--wa-ink);
    }
    .pk-page > :first-child { border-top-left-radius: calc(var(--wa-r-lg) - 1px); border-top-right-radius: calc(var(--wa-r-lg) - 1px); }
    .pk-page > :last-child { border-bottom-left-radius: calc(var(--wa-r-lg) - 1px); border-bottom-right-radius: calc(var(--wa-r-lg) - 1px); }
    .pk-page > .pk-pin { position: sticky; top: calc(-1 * var(--ap-top, 0px)); z-index: 7; background: var(--wa-card); }
    .pk-head { display: flex; align-items: center; gap: 12px; flex: none; padding: 12px 12px 12px 18px; border-bottom: 1px solid var(--wa-line); }
    .pk-head > .pk-search { margin-left: auto; }
    .pk-seg {
      display: inline-flex; flex: none; gap: 2px; padding: 2px; height: 28px;
      border: 1px solid var(--wa-line-strong); border-radius: 6px; background: var(--wa-field);
    }
    .pk-seg-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px;
      padding: 0 9px; border: 0; border-radius: 4px; font-weight: 600;
      background: transparent; color: var(--wa-muted); cursor: pointer;
      transition: background .12s ease, color .12s ease;
    }
    .pk-seg-btn svg { width: 14px; height: 14px; }
    .pk-seg-btn:hover { color: var(--wa-ink); }
    .pk-seg-btn.on { background: var(--wa-seg-on); color: var(--wa-ink); }
    .pk-seg-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-pick-btn {
      display: inline-flex; align-items: center; gap: 6px; flex: none; font: inherit; font-size: 12.5px;
      height: 28px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
      background: var(--wa-field); color: var(--wa-ink); cursor: pointer; font-weight: 600;
    }
    .pk-pick-btn:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .pk-pick-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-pick-btn:disabled { opacity: .45; cursor: default; }
    .pk-pick-btn svg { width: 14px; height: 14px; }
    .pk-pick-btn.on { border-color: transparent; background: var(--wa-seg-on); color: var(--wa-ink); }
    .pk-shape { display: inline-flex; align-items: center; gap: 6px; flex: none; }
    .pk-shape-lead { font-size: 12px; color: var(--wa-muted); }
    .pk-shape select {
      max-width: 180px; font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); cursor: pointer; height: 28px;
      padding: 0 26px 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background-color: var(--wa-input);
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8a8f' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 8px center; background-size: 12px;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .pk-shape select:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .pk-shape select:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .pk-search {
      display: flex; align-items: center; gap: 8px; flex: none; width: 260px; max-width: 45vw;
      height: 28px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-field);
    }
    .pk-search:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .pk-search:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .pk-search svg { width: 14px; height: 14px; flex: none; color: var(--wa-muted); }
    .pk-search-input {
      flex: 1; min-width: 0; font: inherit; font-size: 13px; color: var(--wa-ink);
      border: 0; background: transparent; outline: 0; padding: 0;
    }
    .pk-search-input::placeholder { color: color-mix(in srgb, var(--wa-muted) 70%, transparent); }
    .pk-tabs {
      display: flex; align-items: stretch; flex-wrap: wrap; gap: 2px; flex: none;
      padding: 0 12px; border-bottom: 1px solid var(--wa-line);
    }
    .pk-tab {
      display: inline-flex; align-items: center; gap: 7px; flex: none; cursor: pointer;
      font: inherit; font-size: 12.5px; font-weight: 500; color: var(--wa-muted); white-space: nowrap;
      padding: 9px 12px; border: 0; background: transparent;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
    }
    .pk-tab:hover { color: var(--wa-ink); }
    .pk-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 7px 7px 0 0; }
    .pk-tab.on { color: var(--wa-ink); font-weight: 600; border-bottom-color: var(--dc, var(--wa-ink)); }
    .pk-tab svg { width: 15px; height: 15px; }
    .pk-tab-glyph { display: inline-flex; flex: none; color: var(--dc, var(--wa-muted)); }
    .pk-tab-count { font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
    .pk-body { padding: 14px 18px; background: var(--wa-bg); min-height: 160px; }
    .pk-foot {
      display: flex; align-items: center; gap: 10px; flex: none; padding: 12px 18px;
      border-top: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .pk-foot-hint { flex: 1; min-width: 0; font-size: 12px; color: var(--wa-muted); }

    /* The panel's small buttons (form-styles.ts), for the bar. */
    button.small {
      display: inline-flex; align-items: center; gap: 5px;
      font: inherit; font-size: 13px; font-weight: 600; padding: 0 9px; min-height: 26px; border-radius: 6px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-field); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    button.small:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.small:disabled { opacity: .45; cursor: default; }
    button.small > svg { width: 13px; height: 13px; flex: none; }
    button.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }
    button.primary:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-primary-bg) 85%, var(--wa-muted)); }

    /* The bar under the tabs while pages are picked, the Complications
       list's. */
    .pk-bar {
      display: flex; align-items: center; flex-wrap: wrap; gap: 8px; flex: none;
      padding: 8px 18px; border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .pk-bar-count { font-size: 12px; color: var(--wa-muted); min-width: 90px; }
    .pk-bar-said { min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
    .pk-bar-said.ok { color: var(--wa-ok, var(--wa-ink)); }
    .pk-bar-said.warn, .pk-bar-said.err { color: var(--wa-need); }
    .pk-bar-ask { flex: 1 1 260px; min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
    .pk-bar-ask b { font-weight: 600; }
    .pk-bar-gap { flex: 1; min-width: 0; }
    .pk-bar button.ghost {
      font-size: 12.5px; min-height: 28px; padding: 0 10px; border-radius: 8px;
      border-color: var(--wa-line); background: var(--wa-panel); color: var(--wa-ink);
    }
    .pk-bar button.ghost:hover:not(:disabled), .pk-bar button.ghost.on { border-color: var(--wa-line-strong); background: var(--wa-card); }
    .pk-bar button.ghost.danger {
      color: var(--error-color, #b42318);
      border-color: color-mix(in srgb, var(--error-color, #b42318) 45%, var(--wa-line));
      background: color-mix(in srgb, var(--error-color, #b42318) 10%, var(--wa-panel));
    }
    .pk-bar button.ghost.danger:hover:not(:disabled) {
      background: color-mix(in srgb, var(--error-color, #b42318) 18%, var(--wa-panel));
    }
    .pk-bar button.ghost svg { width: 14px; height: 14px; color: var(--wa-muted); }
    .pk-bar button.ghost.danger svg { color: inherit; }
    .pk-bar-done { margin-left: 4px; }
    .pk-bar-done svg { width: 14px; height: 14px; }
    /* Add to and Remove from open downwards, over the cards. */
    .pk-bar-menu { position: relative; display: inline-flex; }
    .pk-bar-list {
      position: absolute; top: calc(100% + 6px); right: 0; z-index: 8; min-width: 220px; max-width: calc(100vw - 32px);
      display: flex; flex-direction: column; gap: 2px; padding: 6px;
      border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-card); box-shadow: 0 10px 30px rgba(0,0,0,.35);
    }
    .pk-bar-head { font-size: 11.5px; font-weight: 700; color: var(--wa-muted); margin: 2px 4px 4px; }
    .pk-bar-row {
      display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; border: 0; border-radius: 7px;
      font: inherit; font-size: 12.5px; color: var(--wa-ink); background: transparent; cursor: pointer; text-align: left;
    }
    .pk-bar-row:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-ink) 9%, transparent); }
    .pk-bar-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-bar-row:disabled { opacity: .5; cursor: default; }
    .pk-bar-row svg { width: 15px; height: 15px; flex: none; color: var(--dc, var(--wa-muted)); }
    .pk-bar-row { box-shadow: inset 3px 0 0 var(--dc, transparent); }
    .pk-bar-row-n { flex: none; font-size: 10.5px; color: var(--wa-muted); }
    .pk-bar-note { margin: 4px 4px 2px; padding-top: 6px; border-top: 1px solid var(--wa-line); font-size: 10.5px; line-height: 1.4; color: var(--wa-muted); }
    /* A card's tick while picking: a box, not the panel's switch. */
    input.pk-card-pick {
      appearance: none; -webkit-appearance: none; position: relative; flex: none; margin: 0; cursor: pointer;
      width: 17px; height: 17px; border-radius: 5px; border: 0;
      background: color-mix(in srgb, var(--wa-ink) 8%, transparent);
      box-shadow: inset 0 0 0 1.5px var(--wa-line-strong);
    }
    input.pk-card-pick::after {
      content: ""; position: absolute; top: 2px; left: 6px; width: 4px; height: 8.5px; opacity: 0;
      border: solid var(--wa-primary-ink, #fff); border-width: 0 2px 2px 0;
      transform: rotate(45deg); transition: opacity .1s ease-out;
    }
    input.pk-card-pick:checked { background: var(--wa-accent); box-shadow: inset 0 0 0 1.5px var(--wa-accent); }
    input.pk-card-pick:checked::after { opacity: 1; }
    input.pk-card-pick:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px var(--wa-accent); }
    input.pk-card-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    input.pk-card-pick:disabled { opacity: .45; cursor: default; }

    /* The cards: as many columns as fit, each the picture and, beside it,
       the name, the devices and Devices. The Complications card's edge. */
    .ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; }
    .pk-page.bare .ap-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
    .ap-card {
      position: relative; z-index: 1; display: flex; gap: 10px; min-width: 0; padding: 8px;
      border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-card);
      transition: border-color .12s ease-out;
    }
    .ap-card:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .ap-card.over { z-index: 5; }
    /* The devices a page is on, one segment each in its color, along the
       card's top edge. A device that hides the page is fainter. */
    .ap-strip {
      position: absolute; top: 0; left: 0; right: 0; height: 3px; display: flex; gap: 2px;
      border-radius: 7px 7px 0 0; overflow: hidden; pointer-events: none;
    }
    .ap-strip > i { flex: 1; background: var(--dc); }
    .ap-strip > i.dim { opacity: .4; }
    .ap-thumb {
      flex: none; display: grid; place-items: center; width: 84px; height: ${Y+4}px; padding: 0; overflow: hidden;
      border: 0; border-radius: 6px; background: var(--wa-bg); cursor: pointer;
    }
    .ap-pic { display: block; line-height: 0; pointer-events: none; }
    /* On device: a watch in its case, an iPhone in its, both without the
       crown and the side buttons, and without the case's drop shadow. */
    /* The frame's outer edge is the device's color. */
    .ap-pic.watch.framed .wa-watch {
      margin: calc(var(--wf-rim, 3px) + 1px);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04), 0 0 0 var(--wf-rim, 3px) var(--wa-art-case, #2b2f3d),
        0 0 0 calc(var(--wf-rim, 3px) + 1.5px) var(--dc, rgba(255, 255, 255, 0.1));
    }
    .ap-pic .wa-watch::before, .ap-pic .wa-watch::after { display: none; }
    .ap-pic.watch .wa-watch > .wp-screen { max-height: var(--ap-screen-h); }
    .ap-pic .wp-fold { display: none; }
    .ap-pic.phone.framed .wa-phone { margin: 0; box-shadow: 0 0 0 1.5px var(--dc, var(--wa-line-strong)); }
    .ap-pic .wa-phone::before, .ap-pic .wa-phone::after { display: none; }
    /* Page only: the page's own screen, with no case, no clock, no bars. */
    .ap-pic.watch.bare .wa-watch { padding: 0; margin: 0; background: none; box-shadow: none; border-radius: 6px; }
    .ap-pic.watch.bare .wa-watch > .wp-screen { border-radius: 6px; }
    .ap-pic.watch.bare .wp-clock, .ap-pic.watch.bare .wp-pages { display: none; }
    .ap-pic.phone.bare .wa-phone { padding: 0; margin: 0; background: none; box-shadow: none; border-radius: 6px; }
    .ap-pic.phone.bare .wa-phone-screen { width: auto !important; min-height: 0 !important; border-radius: 6px; }
    .ap-pic.phone.bare :is(.wa-phone-status, .wa-phone-switcher, .wa-phone-gap, .wa-phone-dots-bar, .wa-phone-tabs, .wa-phone-foot, .wa-phone-dots) { display: none; }
    .ap-pic.phone.bare .wa-phone-area { margin: 0 !important; min-height: 0 !important; }
    .ap-body { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
    .ap-top { display: flex; align-items: flex-start; gap: 8px; max-width: 100%; }
    .ap-top > .pk-card-pick { margin-top: 1px; }
    .ap-open {
      display: flex; flex-direction: column; align-items: flex-start; gap: 1px; min-width: 0; max-width: 100%;
      padding: 0; border: 0; background: none; cursor: pointer; text-align: left;
    }
    .ap-open:focus-visible, .ap-thumb:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .ap-name { max-width: 100%; font-size: 13.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ap-card:not(.picking) .ap-open:hover .ap-name { text-decoration: underline; text-underline-offset: 2px; }
    .ap-detail { font-size: 11.5px; color: var(--wa-muted); }
    .ap-devs { display: flex; flex-wrap: wrap; gap: 4px; max-width: 100%; }
    .ap-dev {
      display: inline-flex; align-items: center; gap: 4px; max-width: 100%; padding: 2px 7px 2px 5px; border-radius: 999px;
      font-size: 11px; color: var(--wa-ink); background: var(--wa-hover); border: 1px solid var(--wa-line);
    }
    .ap-dev { border-color: color-mix(in srgb, var(--dc, var(--wa-line)) 60%, transparent); }
    .ap-dev svg { flex: none; width: 12px; height: 12px; color: var(--dc, var(--wa-muted)); }
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
    /* Picking: every click on the card picks it, and a picked card wears
       the Complications card's ink ring. */
    .ap-card.picking { cursor: pointer; user-select: none; }
    .ap-card.picked { border-color: var(--wa-ink); box-shadow: 0 0 0 1px var(--wa-ink); }
    /* The Devices menu hangs under its card, over the cards below. */
    .ap-card > .pe-dev-menu { position: absolute; top: calc(100% - 4px); left: 8px; width: 250px; max-width: calc(100vw - 32px); z-index: 6; }
    /* A phone, as the Complications surface folds there: the head's
       controls wrap, the search and the Device menu share a line, the tabs
       wrap and the head stops being pinned. */
    @media (max-width: 640px) {
      .ap-page { padding: 14px 12px 32px; }
      .ap-head h1 { font-size: 22px; }
      .pk-page > .pk-pin { position: static; }
      .pk-head { flex-wrap: wrap; row-gap: 8px; column-gap: 8px; padding: 10px 10px 10px 14px; }
      .pk-head > .pk-search { order: 3; flex: 1 1 0; width: auto; max-width: none; min-width: 0; margin-left: 0; }
      .pk-head > .pk-shape { order: 3; }
      .pk-shape select { max-width: 130px; }
      .pk-tab { padding: 9px 10px; }
      .pk-bar { padding: 8px 10px; }
      .pk-body { padding: 10px; }
      .ap-grid { gap: 8px; }
    }
  `]}};v([I({attribute:!1})],u.prototype,"owners",2),v([I({attribute:!1})],u.prototype,"ownersReady",2),v([I({attribute:!1})],u.prototype,"phones",2),v([I({attribute:!1})],u.prototype,"icons",2),v([I({attribute:!1})],u.prototype,"iconsTick",2),v([I({attribute:!1})],u.prototype,"onOpen",2),v([b()],u.prototype,"docs",2),v([b()],u.prototype,"failed",2),v([b()],u.prototype,"readState",2),v([b()],u.prototype,"linksOn",2),v([b()],u.prototype,"filter",2),v([b()],u.prototype,"search",2),v([b()],u.prototype,"bare",2),v([b()],u.prototype,"kind",2),v([b()],u.prototype,"menuAt",2),v([b()],u.prototype,"linking",2),v([b()],u.prototype,"devicesNote",2),v([b()],u.prototype,"selecting",2),v([b()],u.prototype,"selected",2),v([b()],u.prototype,"bulkMenu",2),v([b()],u.prototype,"bulkBusy",2),v([b()],u.prototype,"bulkNote",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",u);export{u as WaAllPages};
