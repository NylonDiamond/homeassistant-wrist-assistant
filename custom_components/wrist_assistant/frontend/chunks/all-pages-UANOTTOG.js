import{d as me,f as xe,h as ye,n as S,o as $e,p as E,r as Pe,s as Se,t as Ie,u as De}from"./chunk-TMBWXA4W.js";import{b as O,d as be}from"./chunk-SPTKBBHW.js";import"./chunk-J23RLD45.js";import{s as z,y as Ne}from"./chunk-KZOKS2QV.js";import"./chunk-W6YU56LQ.js";import{a as Ce,b as Te,c as Le,h as Re}from"./chunk-3BJTPW4K.js";import"./chunk-GEU5IYGP.js";import{e as ke}from"./chunk-4I5F75IY.js";import{b as se,c as de,d as fe,e as ve,g as we}from"./chunk-QFOBYXGW.js";import{P as re,U as oe,j as ie}from"./chunk-DK2DZHWA.js";import{k as pe,l as M,m as le,n as m,o as ce,p as he,q as ue,r as ge}from"./chunk-YDWRUXOV.js";import{Eg as ee,Hg as te,Jg as ne,Ng as ae,b as Z,d as h,g as k,j as Q,k as I,kh as $,l as b}from"./chunk-D2VEH7YA.js";import{b as D}from"./chunk-5XITPOUG.js";import{a as v}from"./chunk-LO2NM3CE.js";var ot="A page on more than one device is the same page: an edit shows on all of them.";function Me(a){return`${a} ${a===1?"page":"pages"} on your watches and iPhones. ${ot}`}var st="This is its only device. Delete it in the page editor instead.",F="Save or discard the edits to these pages first. A page goes on another device as it is saved.",dt=a=>a.toUpperCase();function Oe(a,s){let e=[],t=new Map;for(let n of a){let o=s.get(n.ownerId);o!==void 0&&ke(o).forEach((r,i)=>{let d=m(r);if(d==="")return;let c=xe(r),l=c===void 0?`page:${n.ownerId}:${dt(d)}`:`link:${c}`,p={device:n,page:r,hidden:he(r),index:i},u=t.get(l);if(u!==void 0){u.copies.some(g=>g.device.ownerId===n.ownerId)||u.copies.push(p);return}let w=ge(r),x={key:l,pageId:d,name:ce(r),tiles:w?0:le(r).length,smart:w,copies:[p],...c===void 0?{}:{linkId:c}};t.set(l,x),e.push(x)})}return e}var C="all";function Ee(a,s,e=()=>{}){return[{id:C,label:"All",count:s.length},...a.map(t=>{let n=e(t.ownerId);return{id:t.ownerId,label:t.name,kind:t.kind,...n===void 0?{}:{color:n},count:s.filter(o=>y(o,t.ownerId)!==void 0).length}})]}function W(a,s){return a!==void 0&&s.some(e=>e.ownerId===a)?a:C}function y(a,s){return a.copies.find(e=>e.device.ownerId===s)}function _(a,s){return s==="all"||a.copies.some(e=>e.device.kind===s)}function q(a){return a.some(s=>s.kind==="watch")&&a.some(s=>s.kind==="iphone")}function Be(a,s){return a!==void 0&&a!=="all"&&q(s)?a:"all"}function Ke(a){return[{key:"all",label:"All",count:a.length},{key:"watch",label:"Watches",count:a.filter(s=>_(s,"watch")).length},{key:"iphone",label:"iPhones",count:a.filter(s=>_(s,"iphone")).length}]}function B(a,s,e="",t="all"){let n=e.trim().toLowerCase(),o=(n===""?[...a]:a.filter(r=>r.name.toLowerCase().includes(n))).filter(r=>_(r,t));return s===C?o:o.filter(r=>y(r,s)!==void 0).sort((r,i)=>y(r,s).index-y(i,s).index)}function H(a,s,e="all"){return(s===C?void 0:y(a,s))??(e==="all"?void 0:a.copies.find(t=>t.device.kind===e))??a.copies.find(t=>t.device.kind==="watch")??a.copies[0]}function Ae(a,s){let e=s.copies.some(n=>ue(n.page)),t=s.copies.length<=1;return a.map(n=>{let o=y(s,n.ownerId)!==void 0,r=e?ye:o&&t?st:void 0;return{device:n,on:o,here:!1,...r===void 0?{}:{stuck:r}}})}function T(a,s){return a.copies.find(e=>!s(e.device.ownerId))?.device.ownerId}function ze(a){return a.smart?"Smart page":`${a.tiles} ${a.tiles===1?"tile":"tiles"}`}function _e(a,s,e,t="all"){if(s.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";if(e.trim()!=="")return"No page has that name.";if(t!=="all")return`No page here is on ${t==="watch"?"a watch":"an iPhone"}.`;let n=s.find(o=>o.ownerId===a);return n!==void 0?`No pages on ${n.name} yet.`:"No device has pages yet. Open a device's Pages to make one."}var P=a=>a.toUpperCase();function We(a,s,e){return`${a} ${a===1?s:e}`}var K=a=>We(a,"page","pages");function V(a){return a.length<=3?S(a):`${a.slice(0,3).join(", ")} and ${a.length-3} more`}function qe(a,s){let e=new Set(a);return e.has(s)?e.delete(s):e.add(s),e}function He(a,s,e,t){let n=new Set(a),o=s.indexOf(t),r=e===void 0?-1:s.indexOf(e);if(o<0)return n;if(r<0)return n.add(t),n;for(let i=Math.min(r,o);i<=Math.max(r,o);i++)n.add(s[i]);return n}function Ve(a,s){return new Set([...a,...s])}function Ue(a,s){let e=new Set(s);return new Set([...a].filter(t=>!e.has(t)))}function j(a,s){let e=new Set(s);return new Set([...a].filter(t=>e.has(t)))}function je(a,s){let e=new Set(a.flatMap(t=>t.copies.map(n=>`${n.device.ownerId}|${P(m(n.page))}`)));return new Set(s.filter(t=>t.copies.some(n=>e.has(`${n.device.ownerId}|${P(m(n.page))}`))).map(t=>t.key))}function Ye(a,s,e){let t=a.find(n=>n.ownerId===s);t!==void 0?t.names.push(e):a.push({ownerId:s,names:[e]})}function Xe(a,s,e,t){let n={calls:[],already:0,taken:[],dirty:[],blocked:[]},o=s.filter(i=>t(i)?(n.dirty.push(i),!1):!0),r=new Map(o.map(i=>[i,new Set((e.get(i)===void 0?[]:M(e.get(i))).map(d=>P(m(d))))]));for(let i of a){let d=o.filter(p=>y(i,p)===void 0);if(n.already+=o.length-d.length,d.length===0)continue;let c=T(i,t);if(c===void 0){n.blocked.push(i.name);continue}let l=m(y(i,c).page);for(let p of d){let u=r.get(p);if(u.has(P(l))){Ye(n.taken,p,i.name);continue}u.add(P(l));let w=n.calls.find(x=>x.source===c&&x.target===p);w!==void 0?(w.pageIds.push(l),w.names.push(i.name)):n.calls.push({source:c,target:p,pageIds:[l],names:[i.name]})}}return n}function Ge(a,s,e){let t=a.find(n=>n.ownerId===s);t!==void 0?t.pageIds.push(e):a.push({ownerId:s,pageIds:[e]})}function Je(a,s){a.includes(s)||a.push(s)}function Ze(a,s,e){let t={work:[],lastOnly:[],dirty:[],notThere:0},n=new Set(s);for(let o of a){let r=o.copies.filter(i=>n.has(i.device.ownerId));if(r.length===0){t.notThere++;continue}if(r.length===o.copies.length){t.lastOnly.push(o.name);continue}for(let i of r){let d=i.device.ownerId;e(d)?Je(t.dirty,d):Ge(t.work,d,m(i.page))}}return t}function Y(a,s,e){let t={work:[],pages:[],devices:[],dirty:[]},n=new Set;for(let o of a){t.pages.push({name:o.name,copies:o.copies.map(r=>({ownerId:r.device.ownerId,pageId:m(r.page)}))});for(let r of o.copies){let i=r.device.ownerId;n.add(i),e(i)?Je(t.dirty,i):Ge(t.work,i,m(r.page))}}return t.devices=s.map(o=>o.ownerId).filter(o=>n.has(o)),t.work.sort((o,r)=>t.devices.indexOf(o.ownerId)-t.devices.indexOf(r.ownerId)),t}var L=(a,s)=>a.find(e=>e.ownerId===s)?.name??"a device";function Qe(a,s){let e=a.pages.length,t=a.devices.map(r=>L(s,r)),n=`Delete ${K(e)} from ${We(t.length,"device","devices")}?`,o=[`${e===1?"It comes":"They come"} off ${S(t)}, with the menu slots and complication taps there that open ${e===1?"it":"them"}. This cannot be undone.`];if(a.dirty.length>0){let r=a.dirty.map(i=>L(s,i));o.push(`${S(r)} ${r.length===1?"has":"have"} unsaved edits, so ${r.length===1?"its":"their"} copies stay.`)}return{title:n,body:o.join(" ")}}function X(a){return{action:a,done:[],gone:0,also:0,taken:[],dirty:[],blocked:[],lastOnly:[],failed:[],refs:[]}}function U(a,s,e){if(e===0)return;let t=a.done.find(n=>n.ownerId===s);t!==void 0?t.count+=e:a.done.push({ownerId:s,count:e})}function Fe(a,s,e){let t=a.targets?.[s];if(t===void 0)return 0;let n=new Set(e.map(P));return(t.pages??[]).filter(o=>!n.has(P(o))).length+(t.status_pages??[]).length}var pt=new Set(["id_taken","not_found","system_page"]);async function et(a,s,e,t){let n=X("add");n.taken=s.taken.map(r=>({ownerId:r.ownerId,names:[...r.names]})),n.dirty=[...s.dirty],n.blocked=[...s.blocked];let o=(r,i,d)=>{D(i).code==="id_taken"&&d!==void 0?Ye(n.taken,r,d):n.failed.push({ownerId:r,message:`${d===void 0?"":`${d}: `}${E(i)}`})};for(let[r,i]of s.calls.entries()){t?.(`Adding to ${L(e,i.target)} (${r+1} of ${s.calls.length})\u2026`);try{let d=await a.link(i.source,i.pageIds,i.target);U(n,i.target,i.pageIds.length),n.also+=Fe(d,i.target,i.pageIds)}catch(d){let c=D(d).code;if(i.pageIds.length===1){o(i.target,d,i.names[0]);continue}if(c===void 0||!pt.has(c)){o(i.target,d);continue}for(let[l,p]of i.pageIds.entries())try{let u=await a.link(i.source,[p],i.target);U(n,i.target,1),n.also+=Fe(u,i.target,[p])}catch(u){o(i.target,u,i.names[l])}}}return n}async function tt(a,s,e,t,n,o){let r=new Map;for(let[i,d]of s.entries()){o?.(`${n} ${L(t,d.ownerId)} (${i+1} of ${s.length})\u2026`);let c;try{c=await a.remove(d.ownerId,d.pageIds)}catch(l){c={ok:!1,code:"unknown",message:D(l).message}}if(!c.ok){e.failed.push({ownerId:d.ownerId,message:c.message});continue}if(r.set(d.ownerId,new Set(c.removed.map(P))),U(e,d.ownerId,c.removed.length),c.removed.length!==0)try{let l=await a.clearRefs(d.ownerId,c.removed);(l?.kind==="warn"||l?.kind==="err")&&e.refs.push(d.ownerId)}catch{e.refs.push(d.ownerId)}}return r}async function nt(a,s,e,t){let n=X("remove");return n.dirty=[...s.dirty],n.lastOnly=[...s.lastOnly],await tt(a,s.work,n,e,"Taking pages off",t),n}async function at(a,s,e,t){let n=X("delete");n.dirty=[...s.dirty];let o=await tt(a,s.work,n,e,"Deleting on",t);return n.gone=s.pages.filter(r=>r.copies.every(i=>o.get(i.ownerId)?.has(P(i.pageId))??!1)).length,n}var lt="Save or discard the edits in its page editor first.";function it(a,s){let e=i=>L(s,i),t=[],n=a.done.map(i=>`${K(i.count)} ${a.action==="add"?"to":a.action==="remove"?"off":"on"} ${e(i.ownerId)}`);a.action==="add"&&n.length>0?(t.push(`Added ${S(n)}.`),a.also>0&&t.push(`Their tiles brought ${K(a.also)} more.`)):a.action==="remove"&&n.length>0?t.push(`Took ${S(n)}.`):a.action==="delete"&&(a.gone>0||n.length>0)&&t.push(a.gone>0?`Deleted ${K(a.gone)}.`:`Deleted ${S(n)}.`);let o=t.length>0,r=!1;for(let i of a.taken)r=!0,t.push(`Not added to ${e(i.ownerId)}: ${V(i.names)}. It already has ${i.names.length===1?"a page":"pages"} of its own with the same id.`);a.blocked.length>0&&(r=!0,t.push(`Not added: ${V(a.blocked)}. Every device ${a.blocked.length===1?"it is":"they are"} on has unsaved edits.`)),a.lastOnly.length>0&&(r=!0,t.push(`Kept ${V(a.lastOnly)}: ${a.lastOnly.length===1?"it":"they"} would be left on no device. Use Delete for those.`));for(let i of a.dirty)r=!0,t.push(`Left ${e(i)} alone: its pages have unsaved edits. ${lt}`);for(let i of a.failed){r=!0;let d=a.action==="add"?`Not added to ${e(i.ownerId)}`:a.action==="remove"?`Not taken off ${e(i.ownerId)}`:`Not deleted on ${e(i.ownerId)}`;t.push(`${d}: ${i.message.replace(/\.$/,"")}.`)}return a.refs.length>0&&(r=!0,t.push(`Could not clear the menu slots or complication taps that opened them on ${S(a.refs.map(e))}. Change those by hand.`)),!o&&!r?{kind:"ok",text:a.action==="add"?"Those pages are on those devices already.":a.action==="remove"?"None of those pages are on those devices.":"Nothing was deleted."}:{kind:r?o?"warn":"err":"ok",text:t.join(" ")}}var G=92,ct=2e3,ht=250,rt="wrist-assistant-panel.all-pages.v1",N;function A(){if(N!==void 0)return N;let a={bare:!1,kind:"all"};try{let s=window.localStorage.getItem(rt),e=s?JSON.parse(s):{};typeof e.filter=="string"&&(a.filter=e.filter),typeof e.bare=="boolean"&&(a.bare=e.bare),(e.kind==="watch"||e.kind==="iphone")&&(a.kind=e.kind)}catch{}return N=a,a}function J(a){N={...A(),...a};try{window.localStorage.setItem(rt,JSON.stringify(N))}catch{}}var ut=(a,s)=>a.toUpperCase()===s.toUpperCase(),R=a=>O(a)?.dirty??!1,f=class extends Q{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.docs=new Map;this.failed=[];this.readState="idle";this.linksOn=!0;this.filter=A().filter;this.search="";this.bare=A().bare;this.kind=A().kind;this.linking=!1;this.selecting=!1;this.selected=new Set;this.hassDrawnAt=0;this.loadSeq=0;this.readSeq=new Map;this.reloadTimers=new Map;this.unsubscribers=[];this.subscribeSeq=0;this.colorsFor=de();this.colorOf=e=>se(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.bulkMenu!==void 0&&this.bulkBusy===void 0?(e.preventDefault(),this.closeBulkMenu()):this.menuAt!==void 0?(e.preventDefault(),this.closeDevices()):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))};this.onWindowPointerDown=e=>{let t=(this.bulkMenu==="add"||this.bulkMenu==="remove")&&this.bulkBusy===void 0;if(this.menuAt===void 0&&!t)return;let n=e.composedPath(),o=(...r)=>n.some(i=>i instanceof Element&&r.some(d=>i.classList.contains(d)));this.menuAt!==void 0&&!o("pe-dev-menu","ap-dev-open")&&this.closeDevices(),t&&!o("pk-bar-menu")&&this.closeBulkMenu()}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let n=Date.now();(t||n-this.hassDrawnAt>=ct)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.deviceSig=void 0,this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.endSubscriptions();for(let e of this.reloadTimers.values())window.clearTimeout(e);this.reloadTimers.clear(),this.loadSeq++,this.deviceSig=void 0}willUpdate(e){let t=this.devices,n=t.map(o=>o.ownerId).join(",");this.hassNow!==void 0&&this.isConnected&&n!==this.deviceSig&&(this.deviceSig=n,this.loadAll(),this.startSubscriptions(t))}get devices(){return me(this.owners,this.phones)}get cards(){let e=this.devices,t=this.cardsMemo;if(t!==void 0&&t.docs===this.docs&&t.devices.length===e.length&&t.devices.every((o,r)=>o.ownerId===e[r].ownerId&&o.name===e[r].name))return t.cards;let n=Oe(e,this.docs);return this.cardsMemo={docs:this.docs,devices:e,cards:n},n}async loadAll(){let e=this.hassNow;if(!e)return;let t=++this.loadSeq,n=this.devices;this.readState==="idle"&&(this.readState="loading");let o=ne(e).then(()=>!0,l=>D(l).code!=="unknown_command"),r=await Promise.all(n.map(l=>this.readOne(e,l.ownerId))),i=await o;if(t!==this.loadSeq)return;let d=new Map,c=[];for(let[l,p]of r)if(p==="failed"){c.push(l);let u=this.docs.get(l);u!==void 0&&d.set(l,u)}else p!==void 0&&d.set(l,p);this.docs=d,this.failed=c,this.linksOn=i,this.readState="ready"}async readOne(e,t){try{let n=await ee(e,t,"pages");return[t,n.revision>0?pe(n.document):void 0]}catch{return[t,"failed"]}}reloadOne(e){let t=this.reloadTimers.get(e);t!==void 0&&window.clearTimeout(t),this.reloadTimers.set(e,window.setTimeout(()=>{this.reloadTimers.delete(e);let n=this.hassNow;if(!n||!this.isConnected)return;let o=(this.readSeq.get(e)??0)+1;this.readSeq.set(e,o);let r=this.loadSeq;this.readOne(n,e).then(([,i])=>{if(o!==this.readSeq.get(e)||r!==this.loadSeq||i==="failed")return;let d=new Map(this.docs);i===void 0?d.delete(e):d.set(e,i),this.docs=d})},ht))}startSubscriptions(e){this.endSubscriptions();let t=this.hassNow;if(!t)return;let n=this.subscribeSeq;for(let o of e){let r=o.ownerId;ae(t,r,i=>{n===this.subscribeSeq&&i.kind==="pages"&&this.reloadOne(r)}).then(i=>{n===this.subscribeSeq?this.unsubscribers.push(i):Promise.resolve(i()).catch(()=>{})},()=>{})}}endSubscriptions(){this.subscribeSeq++;for(let e of this.unsubscribers)Promise.resolve(e()).catch(()=>{});this.unsubscribers=[]}setFilter(e){this.filter=e,J({filter:e}),this.closeDevices(),this.pruneSelected()}setSearch(e){this.search=e,this.pruneSelected()}setKind(e){this.kind=e,J({kind:e}),this.closeDevices(),this.pruneSelected()}setBare(e){this.bare=e,J({bare:e})}open(e,t){let n=H(e,t,this.kindNow());be(n.device.ownerId,{pageId:m(n.page)}),this.onOpen?.(n.device.ownerId,n.device.kind)}cardOfMenu(e){let t=this.menuAt;if(t!==void 0)return e.find(n=>{let o=y(n,t.ownerId);return o!==void 0&&ut(m(o.page),t.pageId)})}openDevices(e){let t=e.copies[0];this.menuAt={ownerId:t.device.ownerId,pageId:m(t.page)},this.devicesNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.menuAt=void 0,this.devicesNote=void 0}async toggle(e,t){let n=this.hassNow;if(!n||this.linking||t.stuck!==void 0)return;let o=t.device.ownerId,r=t.device.name,i=e.pageId,d;this.linking=!0,this.devicesNote=void 0;try{if(t.on){let l=await Se(n,o,m(y(e,o).page),r);d=l===void 0?{kind:"ok",text:`Taken off ${r}.`}:{kind:"err",text:l}}else{let l=T(e,p=>O(p)?.dirty??!1);if(l===void 0)d={kind:"warn",text:F};else{let p=m(y(e,l).page),u=await te(n,l,[p],[o]),w=$e(u,o,[p],this.docs.get(l));d={kind:"ok",text:`Added to ${r}.${w===void 0?"":` ${w}`}`}}}}catch(l){d={kind:"err",text:`Not added. ${E(l)}`}}finally{this.linking=!1}let c=t.on?e.copies.find(l=>l.device.ownerId!==o):e.copies[0];c!==void 0&&this.menuAt!==void 0&&(this.menuAt={ownerId:c.device.ownerId,pageId:i}),this.devicesNote=d,await this.loadAll()}kindNow(){return Be(this.kind,this.devices)}shownNow(){return B(this.cards,W(this.filter,this.devices),this.search,this.kindNow())}pickedCards(){return this.shownNow().filter(e=>this.selected.has(e.key))}pruneSelected(){this.selected.size!==0&&(this.selected=j(this.selected,this.shownNow().map(e=>e.key)))}startSelect(){this.selecting=!0,this.closeDevices(),this.bulkNote=void 0}endSelect(){this.bulkBusy===void 0&&(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.bulkMenu=void 0,this.bulkNote=void 0)}cardClick(e,t,n){let o=e.metaKey||e.ctrlKey;if(!this.selecting&&!o){this.open(t,n);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!o)}pick(e,t){this.bulkBusy===void 0&&(this.selecting||this.startSelect(),this.selected=t?He(this.selected,this.shownNow().map(n=>n.key),this.anchor,e.key):qe(this.selected,e.key),this.anchor=e.key,this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0))}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(n=>n.key);this.selected=e?Ve(this.selected,t):Ue(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0)}openBulkMenu(e){if(this.bulkBusy===void 0){if(this.bulkMenu===e){this.closeBulkMenu();return}this.bulkMenu=e,this.bulkNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar")?.querySelector(e==="delete"?".pk-bar-cancel":".pk-bar-row:not(:disabled)")?.focus()})}}closeBulkMenu(){this.bulkMenu=void 0}async runBulk(e,t=[]){let n=this.hassNow;if(!n||this.bulkBusy!==void 0)return;let o=this.devices,r=this.pickedCards();if(r.length===0)return;let i=o.map(p=>p.ownerId).filter(p=>t.includes(p));if(e!=="delete"&&i.length===0)return;let d=Pe(n),c=p=>{this.bulkBusy=p};this.bulkMenu=void 0,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let l;try{let p;e==="add"?p=await et(d,Xe(r,i,this.docs,R),o,c):e==="remove"?p=await nt(d,Ze(r,i,R),o,c):p=await at(d,Y(r,o,R),o,c),l=it(p,o)}catch(p){l={kind:"err",text:D(p).message}}this.bulkBusy="Reading the pages again\u2026";try{await this.loadAll()}finally{this.bulkBusy=void 0}this.selected=j(je(r,this.cards),this.shownNow().map(p=>p.key)),this.anchor=void 0,this.bulkNote=l}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return h`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let t=this.cards,n=W(this.filter,e),o=this.kindNow(),r=B(t,n,this.search,o),i=this.readState!=="ready"&&t.length===0,d=this.failed.map(p=>e.find(u=>u.ownerId===p)?.name).filter(p=>p!==void 0),c=e.length>1,l=this.selecting?"Click pages to pick them. Shift+click picks every page between two.":`Click a page to edit it.${this.linksOn&&e.length>1?" Devices on a card puts it on another watch or iPhone.":""}`;return h`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Pages</h1>
          <p class="ap-lead">${i?"Reading every device's pages\u2026":Me(t.length)}</p>
        </div>
      </div>
      ${d.length===0?k:h`<p class="ap-warn" role="status">Could not read the pages of ${d.join(", ")}. They show as last read.</p>`}
      <div class="pk-surface pk-page ${this.bare?"bare":""}" role="region" aria-label="Your pages">
        <div class="pk-pin">
          ${this.renderHead(t,n,e)}
          ${c?this.renderTabs(e,t,n):k}
          ${this.selecting?this.renderBar(r,e):k}
        </div>
        <div class="pk-body" role=${c?"tabpanel":k} aria-labelledby=${c?`ap-tab-${n}`:k}>
          ${i?h`<p class="ap-empty">Reading every device's pages…</p>`:r.length===0?h`<p class="ap-empty">${_e(n,e,this.search,o)}</p>`:h`<div class="ap-grid" role="list">${r.map(p=>this.renderCard(p,n,e,t))}</div>`}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${l}</span></div>
      </div>
    </div></div>`}renderHead(e,t,n){let o=this.bare,r=this.selecting,i=this.bulkBusy!==void 0;return h`<div class="pk-head">
      <div class="pk-seg" role="group" aria-label="How a card draws its page">
        <button type="button" class="pk-seg-btn ${o?"":"on"}" aria-pressed=${o?"false":"true"}
          title="Draw each page on the device it is on"
          @click=${()=>this.setBare(!1)}>${$("watch")}<span>On device</span></button>
        <button type="button" class="pk-seg-btn ${o?"on":""}" aria-pressed=${o?"true":"false"}
          title="Draw the page on its own, with no device round it"
          @click=${()=>this.setBare(!0)}>${$("pages")}<span>Page only</span></button>
      </div>
      <button type="button" class="pk-pick-btn ${r?"on":""}" aria-pressed=${r?"true":"false"}
        title=${r?"Back to opening one page at a time":"Pick several pages to add, remove or delete together"}
        ?disabled=${i} @click=${()=>r?this.endSelect():this.startSelect()}>
        ${$("checklist")}<span>Multi select</span></button>
      ${q(n)?this.renderKinds(e,t):k}
      <label class="pk-search">
        ${$("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label="Search pages"
          @input=${d=>this.setSearch(d.target.value)} />
      </label>
    </div>`}renderKinds(e,t){let n=this.kindNow(),o=Ke(B(e,t,this.search));return h`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label="Show the pages on one kind of device" .value=${n}
        @change=${r=>this.setKind(r.target.value)}>
        ${o.map(r=>h`<option value=${r.key} ?selected=${r.key===n}>${r.label} (${r.count})</option>`)}
      </select>
    </label>`}renderTabs(e,t,n){return h`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${Ee(e,t,this.colorOf).map(o=>h`<button type="button" role="tab" class="pk-tab ${o.id===n?"on":""}"
        style=${o.color===void 0?k:`--dc:${o.color}`} id=${`ap-tab-${o.id}`} aria-selected=${o.id===n?"true":"false"}
        title=${o.id===C?"Every page on every device":`The pages on ${o.label}`}
        @click=${()=>this.setFilter(o.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${$(o.kind===void 0?"grid":o.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${o.label}</span>
        <span class="pk-tab-count">${o.count}</span>
      </button>`)}
    </div>`}renderCard(e,t,n,o){let r=H(e,t,this.kindNow()),i=this.selecting,d=!i&&this.cardOfMenu(o)?.key===e.key,c=!i&&this.linksOn&&n.length>1,l=i&&this.selected.has(e.key),p=i?`${l?"Let":"Pick"} ${e.name}${l?" go":""}`:`Edit ${e.name} on ${r.device.name}`,u=g=>this.cardClick(g,e,t),w=g=>`--dc:${this.colorOf(g)??"var(--wa-line-strong)"}`,x=e.copies.length>1||this.bare;return h`<div class="ap-card ${d?"over":""} ${i?"picking":""} ${l?"picked":""}" role="listitem" data-card=${e.key}
      @click=${g=>{i&&u(g)}}>
      ${x?h`<span class="ap-strip" aria-hidden="true">${e.copies.map(g=>h`<i class=${g.hidden?"dim":""} style=${w(g.device.ownerId)}></i>`)}</span>`:k}
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${p} @click=${u}>
        ${this.renderThumb(r,this.colorOf(r.device.ownerId))}
      </button>
      <div class="ap-body">
        <div class="ap-top">
          ${i?h`<input type="checkbox" class="pk-card-pick" .checked=${ie(l)} ?disabled=${this.bulkBusy!==void 0}
            aria-label=${p}
            @click=${g=>{g.stopPropagation(),this.pick(e,g.shiftKey)}} />`:k}
          <button type="button" class="ap-open" title=${p} tabindex=${i?"-1":"0"} @click=${u}>
            <b class="ap-name">${e.name}</b>
            <small class="ap-detail">${ze(e)}</small>
          </button>
        </div>
        <span class="ap-devs">${e.copies.map(g=>h`<span class="ap-dev ${g.hidden?"dim":""}" style=${w(g.device.ownerId)}
          title=${g.hidden?`On ${g.device.name}, hidden there`:`On ${g.device.name}`}>
          ${$(g.device.kind==="iphone"?"phone":"watch")}<span class="ap-dev-n">${g.device.name}</span>${g.hidden?h`<em>hidden</em>`:k}
        </span>`)}</span>
        ${c?h`<button type="button" class="ap-dev-open ${d?"on":""}" aria-expanded=${d?"true":"false"}
          title="Pick the devices this page is on"
          @click=${()=>d?this.closeDevices():this.openDevices(e)}>${$("phone")}<span>Devices</span>${$("chevron")}</button>`:k}
      </div>
      ${d?this.renderMenu(e,n):k}
    </div>`}renderMenu(e,t){let n=T(e,o=>O(o)?.dirty??!1)===void 0;return Ie({name:e.name,places:Ae(t,e),...n?{blocked:F}:{},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",colorOf:o=>this.colorOf(o),onToggle:o=>{this.toggle(e,o)},onDone:()=>this.closeDevices()})}renderBar(e,t){let n=e.filter(p=>this.selected.has(p.key)),o=n.length,r=this.bulkBusy!==void 0,i=o===0,d=e.length>0&&e.every(p=>this.selected.has(p.key)),c=t.length>1,l=r?void 0:this.bulkNote;return h`<div class="pk-bar" role="group" aria-label="Act on the picked pages">
      <span class="pk-bar-count" role="status">${this.bulkBusy??(i?"Pick a page to start.":`${o} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${r||e.length===0}
        title=${d?"Let the pages on screen go":"Pick every page the tab, the search and the Device menu have left"}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${l===void 0?k:h`<span class="pk-bar-said ${l.kind}">${l.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.bulkMenu==="delete"&&!i?this.renderDeleteAsk(n,t):h`${c&&this.linksOn?this.renderBarMenu("add",n,t,r||i):k}
          ${c?this.renderBarMenu("remove",n,t,r||i):k}
          <button type="button" class="ghost danger small" ?disabled=${r||i}
            title="Delete these pages from every device they are on"
            @click=${()=>this.openBulkMenu("delete")}>${$("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${r}
        title="Stop picking and go back to opening one page at a time"
        @click=${()=>this.endSelect()}>${$("check")}<span>Done</span></button>
    </div>`}renderBarMenu(e,t,n,o){let r=e==="add",i=this.bulkMenu===e&&!o,d=t.length,c=`${d} ${d===1?"page":"pages"}`,l=r?`Add ${c} to`:`Remove ${c} from`;return h`<span class="pk-bar-menu">
      <button type="button" class="ghost small ${i?"on":""}" aria-expanded=${i?"true":"false"} ?disabled=${o}
        title=${r?"Put these pages on another device, linked":"Take these pages off a device"}
        @click=${()=>this.openBulkMenu(e)}>${$(r?"plus":"layers")}<span>${r?"Add to\u2026":"Remove from\u2026"}</span></button>
      ${i?h`<div class="pk-bar-list" role="group" aria-label=${l}>
        <div class="pk-bar-head">${l}</div>
        ${n.map(p=>{let u=t.filter(g=>y(g,p.ownerId)!==void 0).length,w=R(p.ownerId),x=w?"unsaved edits":r?u===d?"has them all":void 0:u===0?"has none":void 0;return h`<button type="button" class="pk-bar-row" ?disabled=${x!==void 0}
            style=${`--dc:${this.colorOf(p.ownerId)??"var(--wa-muted)"}`}
            title=${w?"Its pages have unsaved edits. Save or discard them first.":`${r?"Add to":"Remove from"} ${p.name}`}
            @click=${()=>{this.runBulk(e,[p.ownerId])}}>
            ${$(p.kind==="iphone"?"phone":"watch")}
            <span class="pk-dup-name">${p.name}</span>
            ${x===void 0?r?k:h`<span class="pk-bar-row-n">${u} of ${d}</span>`:h`<span class="pk-bar-row-n">${x}</span>`}
          </button>`})}
        <div class="pk-bar-note">${r?"They go on linked: an edit on one device shows on all of them.":"A page this would leave on no device stays. Use Delete for those."}</div>
      </div>`:k}
    </span>`}renderDeleteAsk(e,t){let n=Qe(Y(e,t,R),t);return h`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask"
        @click=${()=>{this.runBulk("delete")}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>this.closeBulkMenu()}>Cancel</button>`}renderThumb(e,t){let n=this.owners.find(w=>w.owner_watch_id===e.device.ownerId),o=this.docs.get(e.device.ownerId),r=o===void 0?[e.page]:M(o),i=this.hassNow?.states,d=this.icons,c=this.bare,l=c?"bare":"framed";if(e.device.kind==="iphone"){let w=Te(Ce(n?.screen_size)),x=Le(w),g=G/(c?x.height:w.model.screen.height);return h`<span class="ap-pic phone ${l}" style=${t===void 0?k:`--dc:${t}`}>${z({page:e.page,pages:r,screen:x,scale:g,phone:w,...i===void 0?{}:{states:i},...d===void 0?{}:{icons:d}})}</span>`}let p=(oe(n?.screen_size)??re).screen,u=G/(c?p.height:p.height+p.width*2*(fe+ve));return h`<span class="ap-pic watch ${l}" style=${`--ap-screen-h:${Math.round(p.height*u*100)/100}px${t===void 0?"":`;--dc:${t}`}`}>${z({page:e.page,pages:r,screen:p,scale:u,...i===void 0?{}:{states:i},...d===void 0?{}:{icons:d}})}</span>`}static{this.styles=[Ne,we,Re,De,Z`
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
      flex: none; display: grid; place-items: center; width: 84px; height: ${G+4}px; padding: 0; overflow: hidden;
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
  `]}};v([I({attribute:!1})],f.prototype,"owners",2),v([I({attribute:!1})],f.prototype,"ownersReady",2),v([I({attribute:!1})],f.prototype,"phones",2),v([I({attribute:!1})],f.prototype,"icons",2),v([I({attribute:!1})],f.prototype,"iconsTick",2),v([I({attribute:!1})],f.prototype,"onOpen",2),v([b()],f.prototype,"docs",2),v([b()],f.prototype,"failed",2),v([b()],f.prototype,"readState",2),v([b()],f.prototype,"linksOn",2),v([b()],f.prototype,"filter",2),v([b()],f.prototype,"search",2),v([b()],f.prototype,"bare",2),v([b()],f.prototype,"kind",2),v([b()],f.prototype,"menuAt",2),v([b()],f.prototype,"linking",2),v([b()],f.prototype,"devicesNote",2),v([b()],f.prototype,"selecting",2),v([b()],f.prototype,"selected",2),v([b()],f.prototype,"bulkMenu",2),v([b()],f.prototype,"bulkBusy",2),v([b()],f.prototype,"bulkNote",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",f);export{f as WaAllPages};
