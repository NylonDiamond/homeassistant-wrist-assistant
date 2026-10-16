import{d as le,f as pe,h as he,n as P,o as ue,p as E,r as ge,s as fe,t as ve,u as me}from"./chunk-FOD3NZT2.js";import{b as R,d as ce}from"./chunk-SPTKBBHW.js";import"./chunk-J23RLD45.js";import{s as A,y as xe}from"./chunk-ARHTF3TR.js";import"./chunk-W6YU56LQ.js";import{a as we,b as be,c as ke,h as ye}from"./chunk-J4ZOCZL3.js";import"./chunk-GEU5IYGP.js";import{e as de}from"./chunk-4I5F75IY.js";import{b as oe}from"./chunk-EATDI57W.js";import{P as Z,U as ee,j as O}from"./chunk-DK2DZHWA.js";import{k as te,l as M,m as ne,n as w,o as ie,p as ae,q as se,r as re}from"./chunk-YDWRUXOV.js";import{Eg as X,Hg as G,Jg as J,Ng as Q,b as V,d as g,g as b,j as Y,k as S,kh as $,l as m}from"./chunk-D2VEH7YA.js";import{b as D}from"./chunk-5XITPOUG.js";import{a as v}from"./chunk-LO2NM3CE.js";var $e="Every page on your watches and iPhones. A page on more than one device is the same page: an edit shows on all of them.",Xe="This is its only device. Delete it in the page editor instead.",z="Save or discard the edits to these pages first. A page goes on another device as it is saved.",Ge=i=>i.toUpperCase();function Pe(i,o){let e=[],t=new Map;for(let n of i){let s=o.get(n.ownerId);s!==void 0&&de(s).forEach((r,a)=>{let d=w(r);if(d==="")return;let l=pe(r),c=l===void 0?`page:${n.ownerId}:${Ge(d)}`:`link:${l}`,h={device:n,page:r,hidden:ae(r),index:a},p=t.get(c);if(p!==void 0){p.copies.some(Ye=>Ye.device.ownerId===n.ownerId)||p.copies.push(h);return}let u=re(r),y={key:c,pageId:d,name:ie(r),tiles:u?0:ne(r).length,smart:u,copies:[h],...l===void 0?{}:{linkId:l}};t.set(c,y),e.push(y)})}return e}var I="all";function Se(i,o){return[{id:I,label:"All",count:o.length},...i.map(e=>({id:e.ownerId,label:e.name,kind:e.kind,count:o.filter(t=>k(t,e.ownerId)!==void 0).length}))]}function F(i,o){return i!==void 0&&o.some(e=>e.ownerId===i)?i:I}function k(i,o){return i.copies.find(e=>e.device.ownerId===o)}function _(i,o,e=""){let t=e.trim().toLowerCase(),n=t===""?[...i]:i.filter(s=>s.name.toLowerCase().includes(t));return o===I?n:n.filter(s=>k(s,o)!==void 0).sort((s,r)=>k(s,o).index-k(r,o).index)}function W(i,o){return(o===I?void 0:k(i,o))??i.copies.find(e=>e.device.kind==="watch")??i.copies[0]}function De(i,o){let e=o.copies.some(n=>se(n.page)),t=o.copies.length<=1;return i.map(n=>{let s=k(o,n.ownerId)!==void 0,r=e?he:s&&t?Xe:void 0;return{device:n,on:s,here:!1,...r===void 0?{}:{stuck:r}}})}function C(i,o){return i.copies.find(e=>!o(e.device.ownerId))?.device.ownerId}function Ie(i){return i.smart?"Smart page":`${i.tiles} ${i.tiles===1?"tile":"tiles"}`}function Ce(i,o,e){if(o.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";if(e.trim()!=="")return"No page has that name.";let t=o.find(n=>n.ownerId===i);return t!==void 0?`No pages on ${t.name} yet.`:"No device has pages yet. Open a device's Pages to make one."}var x=i=>i.toUpperCase();function Le(i,o,e){return`${i} ${i===1?o:e}`}var N=i=>Le(i,"page","pages");function q(i){return i.length<=3?P(i):`${i.slice(0,3).join(", ")} and ${i.length-3} more`}function Me(i,o){let e=new Set(i);return e.has(o)?e.delete(o):e.add(o),e}function Re(i,o,e,t){let n=new Set(i),s=o.indexOf(t),r=e===void 0?-1:o.indexOf(e);if(s<0)return n;if(r<0)return n.add(t),n;for(let a=Math.min(r,s);a<=Math.max(r,s);a++)n.add(o[a]);return n}function Ee(i,o){return new Set([...i,...o])}function Ne(i,o){let e=new Set(o);return new Set([...i].filter(t=>!e.has(t)))}function K(i,o){let e=new Set(o);return new Set([...i].filter(t=>e.has(t)))}function Be(i,o){let e=new Set(i.flatMap(t=>t.copies.map(n=>`${n.device.ownerId}|${x(w(n.page))}`)));return new Set(o.filter(t=>t.copies.some(n=>e.has(`${n.device.ownerId}|${x(w(n.page))}`))).map(t=>t.key))}function Oe(i,o,e){let t=i.find(n=>n.ownerId===o);t!==void 0?t.names.push(e):i.push({ownerId:o,names:[e]})}function Ae(i,o,e,t){let n={calls:[],already:0,taken:[],dirty:[],blocked:[]},s=o.filter(a=>t(a)?(n.dirty.push(a),!1):!0),r=new Map(s.map(a=>[a,new Set((e.get(a)===void 0?[]:M(e.get(a))).map(d=>x(w(d))))]));for(let a of i){let d=s.filter(h=>k(a,h)===void 0);if(n.already+=s.length-d.length,d.length===0)continue;let l=C(a,t);if(l===void 0){n.blocked.push(a.name);continue}let c=w(k(a,l).page);for(let h of d){let p=r.get(h);if(p.has(x(c))){Oe(n.taken,h,a.name);continue}p.add(x(c));let u=n.calls.find(y=>y.source===l&&y.target===h);u!==void 0?(u.pageIds.push(c),u.names.push(a.name)):n.calls.push({source:l,target:h,pageIds:[c],names:[a.name]})}}return n}function ze(i,o,e){let t=i.find(n=>n.ownerId===o);t!==void 0?t.pageIds.push(e):i.push({ownerId:o,pageIds:[e]})}function Fe(i,o){i.includes(o)||i.push(o)}function _e(i,o,e){let t={work:[],lastOnly:[],dirty:[],notThere:0},n=new Set(o);for(let s of i){let r=s.copies.filter(a=>n.has(a.device.ownerId));if(r.length===0){t.notThere++;continue}if(r.length===s.copies.length){t.lastOnly.push(s.name);continue}for(let a of r){let d=a.device.ownerId;e(d)?Fe(t.dirty,d):ze(t.work,d,w(a.page))}}return t}function U(i,o,e){let t={work:[],pages:[],devices:[],dirty:[]},n=new Set;for(let s of i){t.pages.push({name:s.name,copies:s.copies.map(r=>({ownerId:r.device.ownerId,pageId:w(r.page)}))});for(let r of s.copies){let a=r.device.ownerId;n.add(a),e(a)?Fe(t.dirty,a):ze(t.work,a,w(r.page))}}return t.devices=o.map(s=>s.ownerId).filter(s=>n.has(s)),t.work.sort((s,r)=>t.devices.indexOf(s.ownerId)-t.devices.indexOf(r.ownerId)),t}var T=(i,o)=>i.find(e=>e.ownerId===o)?.name??"a device";function We(i,o){let e=i.pages.length,t=i.devices.map(r=>T(o,r)),n=`Delete ${N(e)} from ${Le(t.length,"device","devices")}?`,s=[`${e===1?"It comes":"They come"} off ${P(t)}, with the menu slots and complication taps there that open ${e===1?"it":"them"}. This cannot be undone.`];if(i.dirty.length>0){let r=i.dirty.map(a=>T(o,a));s.push(`${P(r)} ${r.length===1?"has":"have"} unsaved edits, so ${r.length===1?"its":"their"} copies stay.`)}return{title:n,body:s.join(" ")}}function j(i){return{action:i,done:[],gone:0,also:0,taken:[],dirty:[],blocked:[],lastOnly:[],failed:[],refs:[]}}function H(i,o,e){if(e===0)return;let t=i.done.find(n=>n.ownerId===o);t!==void 0?t.count+=e:i.done.push({ownerId:o,count:e})}function Te(i,o,e){let t=i.targets?.[o];if(t===void 0)return 0;let n=new Set(e.map(x));return(t.pages??[]).filter(s=>!n.has(x(s))).length+(t.status_pages??[]).length}var Je=new Set(["id_taken","not_found","system_page"]);async function qe(i,o,e,t){let n=j("add");n.taken=o.taken.map(r=>({ownerId:r.ownerId,names:[...r.names]})),n.dirty=[...o.dirty],n.blocked=[...o.blocked];let s=(r,a,d)=>{D(a).code==="id_taken"&&d!==void 0?Oe(n.taken,r,d):n.failed.push({ownerId:r,message:`${d===void 0?"":`${d}: `}${E(a)}`})};for(let[r,a]of o.calls.entries()){t?.(`Adding to ${T(e,a.target)} (${r+1} of ${o.calls.length})\u2026`);try{let d=await i.link(a.source,a.pageIds,a.target);H(n,a.target,a.pageIds.length),n.also+=Te(d,a.target,a.pageIds)}catch(d){let l=D(d).code;if(a.pageIds.length===1){s(a.target,d,a.names[0]);continue}if(l===void 0||!Je.has(l)){s(a.target,d);continue}for(let[c,h]of a.pageIds.entries())try{let p=await i.link(a.source,[h],a.target);H(n,a.target,1),n.also+=Te(p,a.target,[h])}catch(p){s(a.target,p,a.names[c])}}}return n}async function He(i,o,e,t,n,s){let r=new Map;for(let[a,d]of o.entries()){s?.(`${n} ${T(t,d.ownerId)} (${a+1} of ${o.length})\u2026`);let l;try{l=await i.remove(d.ownerId,d.pageIds)}catch(c){l={ok:!1,code:"unknown",message:D(c).message}}if(!l.ok){e.failed.push({ownerId:d.ownerId,message:l.message});continue}if(r.set(d.ownerId,new Set(l.removed.map(x))),H(e,d.ownerId,l.removed.length),l.removed.length!==0)try{let c=await i.clearRefs(d.ownerId,l.removed);(c?.kind==="warn"||c?.kind==="err")&&e.refs.push(d.ownerId)}catch{e.refs.push(d.ownerId)}}return r}async function Ke(i,o,e,t){let n=j("remove");return n.dirty=[...o.dirty],n.lastOnly=[...o.lastOnly],await He(i,o.work,n,e,"Taking pages off",t),n}async function Ue(i,o,e,t){let n=j("delete");n.dirty=[...o.dirty];let s=await He(i,o.work,n,e,"Deleting on",t);return n.gone=o.pages.filter(r=>r.copies.every(a=>s.get(a.ownerId)?.has(x(a.pageId))??!1)).length,n}var Qe="Save or discard the edits in its page editor first.";function je(i,o){let e=a=>T(o,a),t=[],n=i.done.map(a=>`${N(a.count)} ${i.action==="add"?"to":i.action==="remove"?"off":"on"} ${e(a.ownerId)}`);i.action==="add"&&n.length>0?(t.push(`Added ${P(n)}.`),i.also>0&&t.push(`Their tiles brought ${N(i.also)} more.`)):i.action==="remove"&&n.length>0?t.push(`Took ${P(n)}.`):i.action==="delete"&&(i.gone>0||n.length>0)&&t.push(i.gone>0?`Deleted ${N(i.gone)}.`:`Deleted ${P(n)}.`);let s=t.length>0,r=!1;for(let a of i.taken)r=!0,t.push(`Not added to ${e(a.ownerId)}: ${q(a.names)}. It already has ${a.names.length===1?"a page":"pages"} of its own with the same id.`);i.blocked.length>0&&(r=!0,t.push(`Not added: ${q(i.blocked)}. Every device ${i.blocked.length===1?"it is":"they are"} on has unsaved edits.`)),i.lastOnly.length>0&&(r=!0,t.push(`Kept ${q(i.lastOnly)}: ${i.lastOnly.length===1?"it":"they"} would be left on no device. Use Delete for those.`));for(let a of i.dirty)r=!0,t.push(`Left ${e(a)} alone: its pages have unsaved edits. ${Qe}`);for(let a of i.failed){r=!0;let d=i.action==="add"?`Not added to ${e(a.ownerId)}`:i.action==="remove"?`Not taken off ${e(a.ownerId)}`:`Not deleted on ${e(a.ownerId)}`;t.push(`${d}: ${a.message.replace(/\.$/,"")}.`)}return i.refs.length>0&&(r=!0,t.push(`Could not clear the menu slots or complication taps that opened them on ${P(i.refs.map(e))}. Change those by hand.`)),!s&&!r?{kind:"ok",text:i.action==="add"?"Those pages are on those devices already.":i.action==="remove"?"None of those pages are on those devices.":"Nothing was deleted."}:{kind:r?s?"warn":"err":"ok",text:t.join(" ")}}var B=92,Ze=2e3,et=250,Ve,tt=(i,o)=>i.toUpperCase()===o.toUpperCase(),L=i=>R(i)?.dirty??!1,f=class extends Y{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.docs=new Map;this.failed=[];this.readState="idle";this.linksOn=!0;this.filter=Ve;this.search="";this.linking=!1;this.selecting=!1;this.selected=new Set;this.bulkTicks=new Set;this.hassDrawnAt=0;this.loadSeq=0;this.readSeq=new Map;this.reloadTimers=new Map;this.unsubscribers=[];this.subscribeSeq=0;this.onKeyDown=e=>{e.key==="Escape"&&(this.bulkMenu!==void 0&&this.bulkBusy===void 0?(e.preventDefault(),this.closeBulkMenu()):this.menuAt!==void 0?(e.preventDefault(),this.closeDevices()):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))};this.onWindowPointerDown=e=>{if(this.menuAt===void 0&&(this.bulkMenu===void 0||this.bulkBusy!==void 0))return;let t=e.composedPath(),n=(...s)=>t.some(r=>r instanceof Element&&s.some(a=>r.classList.contains(a)));this.menuAt!==void 0&&!n("pe-dev-menu","ap-dev-open")&&this.closeDevices(),this.bulkMenu!==void 0&&this.bulkBusy===void 0&&!n("ap-bulk-menu","ap-bar-open")&&this.closeBulkMenu()}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let n=Date.now();(t||n-this.hassDrawnAt>=Ze)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.deviceSig=void 0,this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.endSubscriptions();for(let e of this.reloadTimers.values())window.clearTimeout(e);this.reloadTimers.clear(),this.loadSeq++,this.deviceSig=void 0}willUpdate(e){let t=this.devices,n=t.map(s=>s.ownerId).join(",");this.hassNow!==void 0&&this.isConnected&&n!==this.deviceSig&&(this.deviceSig=n,this.loadAll(),this.startSubscriptions(t))}get devices(){return le(this.owners,this.phones)}get cards(){let e=this.devices,t=this.cardsMemo;if(t!==void 0&&t.docs===this.docs&&t.devices.length===e.length&&t.devices.every((s,r)=>s.ownerId===e[r].ownerId&&s.name===e[r].name))return t.cards;let n=Pe(e,this.docs);return this.cardsMemo={docs:this.docs,devices:e,cards:n},n}async loadAll(){let e=this.hassNow;if(!e)return;let t=++this.loadSeq,n=this.devices;this.readState==="idle"&&(this.readState="loading");let s=J(e).then(()=>!0,c=>D(c).code!=="unknown_command"),r=await Promise.all(n.map(c=>this.readOne(e,c.ownerId))),a=await s;if(t!==this.loadSeq)return;let d=new Map,l=[];for(let[c,h]of r)if(h==="failed"){l.push(c);let p=this.docs.get(c);p!==void 0&&d.set(c,p)}else h!==void 0&&d.set(c,h);this.docs=d,this.failed=l,this.linksOn=a,this.readState="ready"}async readOne(e,t){try{let n=await X(e,t,"pages");return[t,n.revision>0?te(n.document):void 0]}catch{return[t,"failed"]}}reloadOne(e){let t=this.reloadTimers.get(e);t!==void 0&&window.clearTimeout(t),this.reloadTimers.set(e,window.setTimeout(()=>{this.reloadTimers.delete(e);let n=this.hassNow;if(!n||!this.isConnected)return;let s=(this.readSeq.get(e)??0)+1;this.readSeq.set(e,s);let r=this.loadSeq;this.readOne(n,e).then(([,a])=>{if(s!==this.readSeq.get(e)||r!==this.loadSeq||a==="failed")return;let d=new Map(this.docs);a===void 0?d.delete(e):d.set(e,a),this.docs=d})},et))}startSubscriptions(e){this.endSubscriptions();let t=this.hassNow;if(!t)return;let n=this.subscribeSeq;for(let s of e){let r=s.ownerId;Q(t,r,a=>{n===this.subscribeSeq&&a.kind==="pages"&&this.reloadOne(r)}).then(a=>{n===this.subscribeSeq?this.unsubscribers.push(a):Promise.resolve(a()).catch(()=>{})},()=>{})}}endSubscriptions(){this.subscribeSeq++;for(let e of this.unsubscribers)Promise.resolve(e()).catch(()=>{});this.unsubscribers=[]}setFilter(e){this.filter=e,Ve=e,this.closeDevices(),this.pruneSelected()}setSearch(e){this.search=e,this.pruneSelected()}open(e,t){let n=W(e,t);ce(n.device.ownerId,{pageId:w(n.page)}),this.onOpen?.(n.device.ownerId,n.device.kind)}cardOfMenu(e){let t=this.menuAt;if(t!==void 0)return e.find(n=>{let s=k(n,t.ownerId);return s!==void 0&&tt(w(s.page),t.pageId)})}openDevices(e){let t=e.copies[0];this.menuAt={ownerId:t.device.ownerId,pageId:w(t.page)},this.devicesNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.menuAt=void 0,this.devicesNote=void 0}async toggle(e,t){let n=this.hassNow;if(!n||this.linking||t.stuck!==void 0)return;let s=t.device.ownerId,r=t.device.name,a=e.pageId,d;this.linking=!0,this.devicesNote=void 0;try{if(t.on){let c=await fe(n,s,w(k(e,s).page),r);d=c===void 0?{kind:"ok",text:`Taken off ${r}.`}:{kind:"err",text:c}}else{let c=C(e,h=>R(h)?.dirty??!1);if(c===void 0)d={kind:"warn",text:z};else{let h=w(k(e,c).page),p=await G(n,c,[h],[s]),u=ue(p,s,[h],this.docs.get(c));d={kind:"ok",text:`Added to ${r}.${u===void 0?"":` ${u}`}`}}}}catch(c){d={kind:"err",text:`Not added. ${E(c)}`}}finally{this.linking=!1}let l=t.on?e.copies.find(c=>c.device.ownerId!==s):e.copies[0];l!==void 0&&this.menuAt!==void 0&&(this.menuAt={ownerId:l.device.ownerId,pageId:a}),this.devicesNote=d,await this.loadAll()}shownNow(){return _(this.cards,F(this.filter,this.devices),this.search)}pickedCards(){return this.shownNow().filter(e=>this.selected.has(e.key))}pruneSelected(){this.selected.size!==0&&(this.selected=K(this.selected,this.shownNow().map(e=>e.key)))}startSelect(){this.selecting=!0,this.closeDevices(),this.bulkNote=void 0}endSelect(){this.bulkBusy===void 0&&(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.bulkMenu=void 0,this.bulkNote=void 0)}cardClick(e,t,n){let s=e.metaKey||e.ctrlKey;if(!this.selecting&&!s){this.open(t,n);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!s)}pick(e,t){this.bulkBusy===void 0&&(this.selecting||this.startSelect(),this.selected=t?Re(this.selected,this.shownNow().map(n=>n.key),this.anchor,e.key):Me(this.selected,e.key),this.anchor=e.key,this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0))}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(n=>n.key);this.selected=e?Ee(this.selected,t):Ne(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0)}openBulkMenu(e){if(this.bulkBusy===void 0){if(this.bulkMenu===e){this.closeBulkMenu();return}this.bulkMenu=e,this.bulkTicks=new Set,this.bulkNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".ap-bulk-menu")?.querySelector(e==="delete"?".ap-bulk-cancel":"input:not(:disabled)")?.focus()})}}closeBulkMenu(){this.bulkMenu=void 0,this.bulkTicks=new Set}tickDevice(e,t){let n=new Set(this.bulkTicks);t?n.add(e):n.delete(e),this.bulkTicks=n}async runBulk(e){let t=this.hassNow;if(!t||this.bulkBusy!==void 0)return;let n=this.devices,s=this.pickedCards();if(s.length===0)return;let r=n.map(c=>c.ownerId).filter(c=>this.bulkTicks.has(c));if(e!=="delete"&&r.length===0)return;let a=ge(t),d=c=>{this.bulkBusy=c};this.bulkMenu=void 0,this.bulkTicks=new Set,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let l;try{let c;e==="add"?c=await qe(a,Ae(s,r,this.docs,L),n,d):e==="remove"?c=await Ke(a,_e(s,r,L),n,d):c=await Ue(a,U(s,n,L),n,d),l=je(c,n)}catch(c){l={kind:"err",text:D(c).message}}this.bulkBusy="Reading the pages again\u2026";try{await this.loadAll()}finally{this.bulkBusy=void 0}this.selected=K(Be(s,this.cards),this.shownNow().map(c=>c.key)),this.anchor=void 0,this.bulkNote=l}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return g`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let t=this.cards,n=F(this.filter,e),s=_(t,n,this.search),r=e.find(p=>p.ownerId===n),a=this.readState!=="ready"&&t.length===0,d=this.failed.map(p=>e.find(u=>u.ownerId===p)?.name).filter(p=>p!==void 0),l=s.filter(p=>this.selected.has(p.key)),c=this.bulkBusy!==void 0,h=this.selecting?"Click pages to pick them. Shift+click picks every page between two.":`Click a page to edit it.${this.linksOn&&e.length>1?" Devices puts it on another watch or iPhone.":""}`;return g`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Pages</h1>
          <p class="ap-lead">${$e}</p>
        </div>
        ${t.length>0?g`<div class="ap-tools">
          <label class="ap-search">${$("search")}
            <input type="search" class="ap-search-input" placeholder="Find a page" aria-label="Find a page by name"
              .value=${this.search} @input=${p=>this.setSearch(p.target.value)} /></label>
          ${this.selecting?g`
            <button type="button" class="ap-btn" ?disabled=${c||s.length===0} @click=${()=>this.selectShown(!0)}>Select all</button>
            <button type="button" class="ap-btn" ?disabled=${c||l.length===0} @click=${()=>this.selectShown(!1)}>Select none</button>`:b}
          <button type="button" class="ap-btn ap-select ${this.selecting?"on":""}" aria-pressed=${this.selecting?"true":"false"} ?disabled=${c}
            title=${this.selecting?"Stop picking pages":"Pick several pages to add, remove or delete together"}
            @click=${()=>this.selecting?this.endSelect():this.startSelect()}>${this.selecting?"Done":"Select"}</button>
        </div>`:b}
      </div>
      ${e.length>1?this.renderChips(e,t,n):b}
      ${d.length===0?b:g`<p class="ap-warn" role="status">Could not read the pages of ${d.join(", ")}. They show as last read.</p>`}
      <section class="ap-sec" aria-label=${r===void 0?"Every page":`Pages on ${r.name}`}>
        <div class="ap-sec-top">
          <span class="ap-sec-chip" aria-hidden="true">${$(r===void 0?"pages":r.kind==="iphone"?"phone":"watch")}</span>
          <span class="ap-sec-t">
            <h2>${r===void 0?"Every page":`On ${r.name}`}</h2>
            <span class="ap-sec-note">${h}</span>
          </span>
          <span class="ap-sec-count">${s.length}</span>
        </div>
        ${a?g`<p class="ap-empty">Reading every device's pages…</p>`:s.length===0?g`<p class="ap-empty">${Ce(n,e,this.search)}</p>`:g`<div class="ap-grid" role="list">${s.map(p=>this.renderCard(p,n,e,t))}</div>`}
      </section>
      ${this.selecting&&(l.length>0||c||this.bulkNote!==void 0)?this.renderBar(l,e):b}
    </div></div>`}renderChips(e,t,n){return g`<div class="ap-chips" role="group" aria-label="Show pages on">
      ${Se(e,t).map(s=>g`<button type="button" class="ap-chip ${s.id===n?"on":""}"
        aria-pressed=${s.id===n?"true":"false"}
        title=${s.id===I?"Every page on every device":`The pages on ${s.label}`}
        @click=${()=>this.setFilter(s.id)}>
        ${s.kind===void 0?b:$(s.kind==="iphone"?"phone":"watch")}
        <span>${s.label}</span><span class="ap-chip-n">${s.count}</span>
      </button>`)}
    </div>`}renderCard(e,t,n,s){let r=W(e,t),a=this.selecting,d=!a&&this.cardOfMenu(s)?.key===e.key,l=!a&&this.linksOn&&n.length>1,c=a&&this.selected.has(e.key),h=a?`${c?"Unpick":"Pick"} ${e.name}`:`Edit ${e.name} on ${r.device.name}`,p=u=>this.cardClick(u,e,t);return g`<div class="ap-card ${d?"over":""} ${a?"picking":""} ${c?"picked":""}" role="listitem" data-card=${e.key}
      @click=${u=>{a&&p(u)}}>
      ${a?g`<input type="checkbox" class="ap-pick" .checked=${O(c)} ?disabled=${this.bulkBusy!==void 0}
        aria-label=${`Pick ${e.name}`}
        @click=${u=>{u.stopPropagation(),this.pick(e,u.shiftKey)}} />`:b}
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${h} @click=${p}>
        ${this.renderThumb(r)}
      </button>
      <div class="ap-body">
        <button type="button" class="ap-open" title=${h} tabindex=${a?"-1":"0"} @click=${p}>
          <b class="ap-name">${e.name}</b>
          <small class="ap-detail">${Ie(e)}</small>
        </button>
        <span class="ap-devs">${e.copies.map(u=>g`<span class="ap-dev ${u.hidden?"dim":""}"
          title=${u.hidden?`On ${u.device.name}, hidden there`:`On ${u.device.name}`}>
          ${$(u.device.kind==="iphone"?"phone":"watch")}<span class="ap-dev-n">${u.device.name}</span>${u.hidden?g`<em>hidden</em>`:b}
        </span>`)}</span>
        ${l?g`<button type="button" class="ap-dev-open ${d?"on":""}" aria-expanded=${d?"true":"false"}
          title="Pick the devices this page is on"
          @click=${()=>d?this.closeDevices():this.openDevices(e)}>${$("phone")}<span>Devices</span>${$("chevron")}</button>`:b}
      </div>
      ${d?this.renderMenu(e,n):b}
    </div>`}renderMenu(e,t){let n=C(e,s=>R(s)?.dirty??!1)===void 0;return ve({name:e.name,places:De(t,e),...n?{blocked:z}:{},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",onToggle:s=>{this.toggle(e,s)},onDone:()=>this.closeDevices()})}renderBar(e,t){let n=this.bulkBusy!==void 0,s=e.length===0,r=t.length>1,a=(l,c,h="")=>g`<button type="button" class="ap-btn ap-bar-open ${h} ${this.bulkMenu===l?"on":""}"
      aria-expanded=${this.bulkMenu===l?"true":"false"} ?disabled=${n||s} @click=${()=>this.openBulkMenu(l)}>${c}</button>`,d=this.bulkBusy??this.bulkNote?.text;return g`<div class="ap-bar" role="region" aria-label="Picked pages">
      <span class="ap-bar-n">${e.length} selected</span>
      <span class="ap-bar-note ${n?"":this.bulkNote?.kind??""}" role="status">${d??""}</span>
      <span class="ap-bar-acts">
        ${r&&this.linksOn?a("add","Add to\u2026"):b}
        ${r?a("remove","Remove from\u2026"):b}
        ${a("delete","Delete\u2026","ap-danger")}
        <button type="button" class="ap-btn" ?disabled=${n} @click=${()=>this.endSelect()}>Cancel</button>
      </span>
      ${this.bulkMenu===void 0||s?b:this.bulkMenu==="delete"?this.renderDeleteMenu(e,t):this.renderDevicesPick(this.bulkMenu,e,t)}
    </div>`}renderDevicesPick(e,t,n){let s=e==="add",r=t.length,a=`${r} ${r===1?"page":"pages"}`;return g`<div class="pk-dup-menu ap-bulk-menu" role="group" aria-label=${s?`Add ${a} to`:`Remove ${a} from`}>
      <div class="pk-dup-head">${s?`Add ${a} to`:`Remove ${a} from`}</div>
      ${n.map(d=>{let l=t.filter(y=>k(y,d.ownerId)!==void 0).length,c=L(d.ownerId),h=c?"unsaved edits":s?l===r?"has them all":void 0:l===0?"has none":void 0,p=h!==void 0,u=!p&&this.bulkTicks.has(d.ownerId);return g`<div class="pk-dup-row check ${p?"off":""}">
          <label class="pk-dup-pick" title=${c?"Its pages have unsaved edits. Save or discard them first.":d.name}>
            <input type="checkbox" .checked=${O(u)} ?disabled=${p}
              @change=${y=>this.tickDevice(d.ownerId,y.currentTarget.checked)} />
            ${$(d.kind==="iphone"?"phone":"watch")}
            <span class="pk-dup-name">${d.name}</span>
            ${h===void 0?s?b:g`<span class="pk-dup-full">${l} of ${r}</span>`:g`<span class="pk-dup-full">${h}</span>`}
          </label>
        </div>`})}
      <div class="pk-dup-note">${s?"They go on linked: an edit on one device shows on all of them.":"A page these would leave on no device stays. Use Delete for those."}</div>
      <div class="ap-bulk-foot">
        <button type="button" class="ap-btn ap-bulk-cancel" @click=${()=>this.closeBulkMenu()}>Cancel</button>
        <button type="button" class="ap-btn ap-primary" ?disabled=${this.bulkTicks.size===0}
          @click=${()=>{this.runBulk(e)}}>${s?"Add":"Remove"}</button>
      </div>
    </div>`}renderDeleteMenu(e,t){let n=We(U(e,t,L),t);return g`<div class="pk-dup-menu ap-bulk-menu" role="alertdialog" aria-labelledby="ap-del-title" aria-describedby="ap-del-body">
      <div class="ap-bulk-title" id="ap-del-title">${n.title}</div>
      <p class="ap-bulk-body" id="ap-del-body">${n.body}</p>
      <div class="ap-bulk-foot">
        <button type="button" class="ap-btn ap-bulk-cancel" @click=${()=>this.closeBulkMenu()}>Cancel</button>
        <button type="button" class="ap-btn ap-primary ap-danger" @click=${()=>{this.runBulk("delete")}}>Delete</button>
      </div>
    </div>`}renderThumb(e){let t=this.owners.find(c=>c.owner_watch_id===e.device.ownerId),n=this.docs.get(e.device.ownerId),s=n===void 0?[e.page]:M(n),r=this.hassNow?.states,a=this.icons;if(e.device.kind==="iphone"){let c=be(we(t?.screen_size)),h=B/c.model.screen.height;return g`<span class="ap-pic phone">${A({page:e.page,pages:s,screen:ke(c),scale:h,phone:c,...r===void 0?{}:{states:r},...a===void 0?{}:{icons:a}})}</span>`}let d=(ee(t?.screen_size)??Z).screen,l=B/d.height;return g`<span class="ap-pic watch" style=${`--ap-screen-h:${Math.round(B*100)/100}px`}>${A({page:e.page,pages:s,screen:d,scale:l,...r===void 0?{}:{states:r},...a===void 0?{}:{icons:a}})}</span>`}static{this.styles=[xe,oe,ye,me,V`
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
    .ap-tools { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 6px; max-width: 100%; }
    .ap-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex: none;
      height: 30px; padding: 0 12px; border-radius: 6px; cursor: pointer; white-space: nowrap;
      font: inherit; font-size: 13px; color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
    }
    .ap-btn:hover:not(:disabled) { background: var(--wa-hover); }
    .ap-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-btn:disabled { opacity: .55; cursor: default; }
    .ap-btn.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent); }
    .ap-btn.ap-primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); font-weight: 600; }
    .ap-btn.ap-primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }
    .ap-btn.ap-danger { color: var(--wa-need); border-color: color-mix(in srgb, var(--wa-need) 55%, var(--wa-line-strong)); }
    .ap-btn.ap-danger.on { background: color-mix(in srgb, var(--wa-need) 10%, transparent); }
    .ap-btn.ap-primary.ap-danger { color: #fff; background: var(--wa-need); border-color: transparent; }
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
      flex: none; display: grid; place-items: center; width: 84px; height: ${B+4}px; padding: 0; overflow: hidden;
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
    /* Select mode: a box in the picture's corner, and a lit card when
       picked. Every click on the card picks it. */
    .ap-card.picking { cursor: pointer; user-select: none; }
    .ap-card.picked { border-color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 10%, var(--wa-card)); }
    .ap-pick {
      position: absolute; top: 12px; left: 12px; z-index: 2; width: 18px; height: 18px; margin: 0; cursor: pointer;
      accent-color: var(--wa-accent);
    }
    .ap-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
    /* The bar: held at the foot of the tab while pages are picked. */
    .ap-bar {
      position: sticky; bottom: 12px; z-index: 8; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px;
      padding: 8px 10px 8px 14px; border-radius: 10px;
      border: 1px solid var(--wa-line-strong); background: var(--wa-card); box-shadow: var(--wa-shadow-pop);
    }
    .ap-bar-n { flex: none; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; }
    .ap-bar-note { flex: 1 1 200px; min-width: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
    .ap-bar-note.ok { color: var(--wa-ok, var(--wa-ink)); }
    .ap-bar-note.warn, .ap-bar-note.err { color: var(--wa-need); }
    .ap-bar-acts { display: flex; flex-wrap: wrap; gap: 6px; margin-left: auto; }
    .ap-bar > .ap-bulk-menu { position: absolute; right: 8px; bottom: calc(100% + 6px); width: 280px; max-width: calc(100vw - 32px); }
    .ap-bulk-foot { display: flex; justify-content: flex-end; gap: 6px; margin-top: 4px; }
    .ap-bulk-title { font-size: 13.5px; font-weight: 600; }
    .ap-bulk-body { margin: 0; font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
    /* The Devices menu hangs under its card, over the cards below. */
    .ap-card > .pe-dev-menu { position: absolute; top: calc(100% - 4px); left: 8px; width: 250px; max-width: calc(100vw - 32px); z-index: 6; }
    @media (max-width: 640px) {
      .ap-page { padding: 14px 12px 32px; }
      .ap-sec { padding: 0 10px 10px; }
      .ap-sec-top { margin: 0 -10px; padding: 10px 12px; }
      .ap-search { width: 100%; }
      .ap-tools { width: 100%; justify-content: flex-start; }
      .ap-bar-acts { margin-left: 0; }
    }
  `]}};v([S({attribute:!1})],f.prototype,"owners",2),v([S({attribute:!1})],f.prototype,"ownersReady",2),v([S({attribute:!1})],f.prototype,"phones",2),v([S({attribute:!1})],f.prototype,"icons",2),v([S({attribute:!1})],f.prototype,"iconsTick",2),v([S({attribute:!1})],f.prototype,"onOpen",2),v([m()],f.prototype,"docs",2),v([m()],f.prototype,"failed",2),v([m()],f.prototype,"readState",2),v([m()],f.prototype,"linksOn",2),v([m()],f.prototype,"filter",2),v([m()],f.prototype,"search",2),v([m()],f.prototype,"menuAt",2),v([m()],f.prototype,"linking",2),v([m()],f.prototype,"devicesNote",2),v([m()],f.prototype,"selecting",2),v([m()],f.prototype,"selected",2),v([m()],f.prototype,"bulkMenu",2),v([m()],f.prototype,"bulkTicks",2),v([m()],f.prototype,"bulkBusy",2),v([m()],f.prototype,"bulkNote",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",f);export{f as WaAllPages};
