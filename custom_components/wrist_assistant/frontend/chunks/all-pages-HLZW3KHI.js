import{e as Se,f as De,g as Ce,h as Te}from"./chunk-6HJUBEVS.js";import{b as O,d as ke,e as me}from"./chunk-VFPAPAIC.js";import"./chunk-QHA6VOTK.js";import{g as Re,h as Ee,p as Ne,t as Me,z as Le}from"./chunk-4OXY65M4.js";import"./chunk-EPZTKMPK.js";import{a as be,c as xe,e as ye,g as $e,h as B,i as A,j as Pe,k as K,r as I,s as Ie,t as z}from"./chunk-CYVKJR6X.js";import"./chunk-XMMIDZNY.js";import"./chunk-NXR7NIET.js";import{e as we}from"./chunk-UPANJPAF.js";import{b as pe,c as le,e as ve}from"./chunk-VHOBROFB.js";import{P as de,j as se}from"./chunk-C5WTPD4K.js";import{k as ce,l as M,m as he,n as b,o as ue,p as ge,q as fe,r as L}from"./chunk-ESIOP3D4.js";import{Eg as ae,Hg as ie,Jg as oe,Ng as re,b as te,d as g,g as w,j as ne,k as S,kh as y,l as k}from"./chunk-IHFAZWMC.js";import{Va as D}from"./chunk-2ZMALKUC.js";import{a as v}from"./chunk-LO2NM3CE.js";var ut="A page on more than one device is the same page: an edit shows on all of them.";function Oe(a){return`${a} ${a===1?"page":"pages"} on your watches and iPhones. ${ut}`}var gt="This is its only device. Delete it in the page editor instead.",V="Save or discard the edits to these pages first. A page goes on another device as it is saved.",ft=a=>a.toUpperCase();function Be(a,s){let e=[],n=new Map;for(let t of a){let i=s.get(t.ownerId);i!==void 0&&we(i).forEach((o,r)=>{let d=b(o);if(d==="")return;let l=xe(o),c=l===void 0?`page:${t.ownerId}:${ft(d)}`:`link:${l}`,p={device:t,page:o,hidden:ge(o),index:r},h=n.get(c);if(h!==void 0){h.copies.some($=>$.device.ownerId===t.ownerId)||h.copies.push(p);return}let m=L(o),u={key:c,pageId:d,name:ue(o),tiles:m?0:he(o).length,smart:m,copies:[p],...l===void 0?{}:{linkId:l}};n.set(c,u),e.push(u)})}return e}var C="all";function Ae(a,s,e=()=>{}){return[{id:C,label:"All",count:s.length},...a.map(n=>{let t=e(n.ownerId);return{id:n.ownerId,label:n.name,kind:n.kind,...t===void 0?{}:{color:t},count:s.filter(i=>x(i,n.ownerId)!==void 0).length}})]}function H(a,s){return a!==void 0&&s.some(e=>e.ownerId===a)?a:C}function x(a,s){return a.copies.find(e=>e.device.ownerId===s)}function q(a,s){return s==="all"||a.copies.some(e=>e.device.kind===s)}function U(a){return a.some(s=>s.kind==="watch")&&a.some(s=>s.kind==="iphone")}function Ke(a,s){return a!==void 0&&a!=="all"&&U(s)?a:"all"}function ze(a){return[{key:"all",label:"All",count:a.length},{key:"watch",label:"Watches",count:a.filter(s=>q(s,"watch")).length},{key:"iphone",label:"iPhones",count:a.filter(s=>q(s,"iphone")).length}]}function _(a,s,e="",n="all"){let t=e.trim().toLowerCase(),i=(t===""?[...a]:a.filter(o=>o.name.toLowerCase().includes(t))).filter(o=>q(o,n));return s===C?i:i.filter(o=>x(o,s)!==void 0).sort((o,r)=>x(o,s).index-x(r,s).index)}function j(a,s,e="all"){return(s===C?void 0:x(a,s))??(e==="all"?void 0:a.copies.find(n=>n.device.kind===e))??a.copies.find(n=>n.device.kind==="watch")??a.copies[0]}function _e(a,s,e=new Set){let n=s.copies.some(i=>fe(i.page)),t=s.copies.length<=1;return a.map(i=>{let o=x(s,i.ownerId)!==void 0;if(!n&&!o&&e.has(i.ownerId))return{device:i,on:o,here:!1,stuck:A,tag:B};let r=n?ye:o&&t?gt:void 0;return{device:i,on:o,here:!1,...r===void 0?{}:{stuck:r}}})}function T(a,s){return a.copies.find(e=>!s(e.device.ownerId))?.device.ownerId}function Fe(a){return a.smart?"Smart page":`${a.tiles} ${a.tiles===1?"tile":"tiles"}`}function We(a,s,e,n="all"){if(s.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";if(e.trim()!=="")return"No page has that name.";if(n!=="all")return`No page here is on ${n==="watch"?"a watch":"an iPhone"}.`;let t=s.find(i=>i.ownerId===a);return t!==void 0?`No pages on ${t.name} yet.`:"No device has pages yet. Open a device's Pages to make one."}var P=a=>a.toUpperCase();function Ve(a,s,e){return`${a} ${a===1?s:e}`}var F=a=>Ve(a,"page","pages");function Y(a){return a.length<=3?I(a):`${a.slice(0,3).join(", ")} and ${a.length-3} more`}function He(a,s){let e=new Set(a);return e.has(s)?e.delete(s):e.add(s),e}function Ue(a,s,e,n){let t=new Set(a),i=s.indexOf(n),o=e===void 0?-1:s.indexOf(e);if(i<0)return t;if(o<0)return t.add(n),t;for(let r=Math.min(o,i);r<=Math.max(o,i);r++)t.add(s[r]);return t}function je(a,s){return new Set([...a,...s])}function Ye(a,s){let e=new Set(s);return new Set([...a].filter(n=>!e.has(n)))}function G(a,s){let e=new Set(s);return new Set([...a].filter(n=>e.has(n)))}function Xe(a,s){let e=new Set(a.flatMap(n=>n.copies.map(t=>`${t.device.ownerId}|${P(b(t.page))}`)));return new Set(s.filter(n=>n.copies.some(t=>e.has(`${t.device.ownerId}|${P(b(t.page))}`))).map(n=>n.key))}function Ge(a,s,e){let n=a.find(t=>t.ownerId===s);n!==void 0?n.names.push(e):a.push({ownerId:s,names:[e]})}function Je(a,s,e,n){let t={calls:[],already:0,taken:[],dirty:[],blocked:[]},i=s.filter(r=>n(r)?(t.dirty.push(r),!1):!0),o=new Map(i.map(r=>[r,new Set((e.get(r)===void 0?[]:M(e.get(r))).map(d=>P(b(d))))]));for(let r of a){let d=i.filter(p=>x(r,p)===void 0);if(t.already+=i.length-d.length,d.length===0)continue;let l=T(r,n);if(l===void 0){t.blocked.push(r.name);continue}let c=b(x(r,l).page);for(let p of d){let h=o.get(p);if(h.has(P(c))){Ge(t.taken,p,r.name);continue}h.add(P(c));let m=t.calls.find(u=>u.source===l&&u.target===p);m!==void 0?(m.pageIds.push(c),m.names.push(r.name)):t.calls.push({source:l,target:p,pageIds:[c],names:[r.name]})}}return t}function Qe(a,s,e){let n=a.find(t=>t.ownerId===s);n!==void 0?n.pageIds.push(e):a.push({ownerId:s,pageIds:[e]})}function Ze(a,s){a.includes(s)||a.push(s)}function et(a,s,e){let n={work:[],lastOnly:[],dirty:[],notThere:0},t=new Set(s);for(let i of a){let o=i.copies.filter(r=>t.has(r.device.ownerId));if(o.length===0){n.notThere++;continue}if(o.length===i.copies.length){n.lastOnly.push(i.name);continue}for(let r of o){let d=r.device.ownerId;e(d)?Ze(n.dirty,d):Qe(n.work,d,b(r.page))}}return n}function J(a,s,e){let n={work:[],pages:[],devices:[],dirty:[]},t=new Set;for(let i of a){n.pages.push({name:i.name,copies:i.copies.map(o=>({ownerId:o.device.ownerId,pageId:b(o.page)}))});for(let o of i.copies){let r=o.device.ownerId;t.add(r),e(r)?Ze(n.dirty,r):Qe(n.work,r,b(o.page))}}return n.devices=s.map(i=>i.ownerId).filter(i=>t.has(i)),n.work.sort((i,o)=>n.devices.indexOf(i.ownerId)-n.devices.indexOf(o.ownerId)),n}var R=(a,s)=>a.find(e=>e.ownerId===s)?.name??"a device";function tt(a,s){let e=a.pages.length,n=a.devices.map(o=>R(s,o)),t=`Delete ${F(e)} from ${Ve(n.length,"device","devices")}?`,i=[`${e===1?"It comes":"They come"} off ${I(n)}, with the menu slots and complication taps there that open ${e===1?"it":"them"}. This cannot be undone.`];if(a.dirty.length>0){let o=a.dirty.map(r=>R(s,r));i.push(`${I(o)} ${o.length===1?"has":"have"} unsaved edits, so ${o.length===1?"its":"their"} copies stay.`)}return{title:t,body:i.join(" ")}}function Q(a){return{action:a,done:[],gone:0,also:0,taken:[],dirty:[],blocked:[],lastOnly:[],failed:[],refs:[]}}function X(a,s,e){if(e===0)return;let n=a.done.find(t=>t.ownerId===s);n!==void 0?n.count+=e:a.done.push({ownerId:s,count:e})}function qe(a,s,e){let n=a.targets?.[s];if(n===void 0)return 0;let t=new Set(e.map(P));return(n.pages??[]).filter(i=>!t.has(P(i))).length+(n.status_pages??[]).length}var vt=new Set(["id_taken","not_found","system_page"]);async function nt(a,s,e,n){let t=Q("add");t.taken=s.taken.map(o=>({ownerId:o.ownerId,names:[...o.names]})),t.dirty=[...s.dirty],t.blocked=[...s.blocked];let i=(o,r,d)=>{D(r).code==="id_taken"&&d!==void 0?Ge(t.taken,o,d):t.failed.push({ownerId:o,message:`${d===void 0?"":`${d}: `}${z(r)}`})};for(let[o,r]of s.calls.entries()){n?.(`Adding to ${R(e,r.target)} (${o+1} of ${s.calls.length})\u2026`);try{let d=await a.link(r.source,r.pageIds,r.target);X(t,r.target,r.pageIds.length),t.also+=qe(d,r.target,r.pageIds)}catch(d){let l=D(d).code;if(r.pageIds.length===1){i(r.target,d,r.names[0]);continue}if(l===void 0||!vt.has(l)){i(r.target,d);continue}for(let[c,p]of r.pageIds.entries())try{let h=await a.link(r.source,[p],r.target);X(t,r.target,1),t.also+=qe(h,r.target,[p])}catch(h){i(r.target,h,r.names[c])}}}return t}async function at(a,s,e,n,t,i){let o=new Map;for(let[r,d]of s.entries()){i?.(`${t} ${R(n,d.ownerId)} (${r+1} of ${s.length})\u2026`);let l;try{l=await a.remove(d.ownerId,d.pageIds)}catch(c){l={ok:!1,code:"unknown",message:D(c).message}}if(!l.ok){e.failed.push({ownerId:d.ownerId,message:l.message});continue}if(o.set(d.ownerId,new Set(l.removed.map(P))),X(e,d.ownerId,l.removed.length),l.removed.length!==0)try{let c=await a.clearRefs(d.ownerId,l.removed);(c?.kind==="warn"||c?.kind==="err")&&e.refs.push(d.ownerId)}catch{e.refs.push(d.ownerId)}}return o}async function it(a,s,e,n){let t=Q("remove");return t.dirty=[...s.dirty],t.lastOnly=[...s.lastOnly],await at(a,s.work,t,e,"Taking pages off",n),t}async function ot(a,s,e,n){let t=Q("delete");t.dirty=[...s.dirty];let i=await at(a,s.work,t,e,"Deleting on",n);return t.gone=s.pages.filter(o=>o.copies.every(r=>i.get(r.ownerId)?.has(P(r.pageId))??!1)).length,t}var wt="Save or discard the edits in its page editor first.";function rt(a,s,e=new Set){let n=d=>R(s,d),t=[],i=a.done.map(d=>`${F(d.count)} ${a.action==="add"?"to":a.action==="remove"?"off":"on"} ${n(d.ownerId)}`);if(a.action==="add"&&i.length>0){t.push(`Added ${I(i)}.`),a.also>0&&t.push(`Their tiles brought ${F(a.also)} more.`);let d=K(a.done.filter(l=>e.has(l.ownerId)).map(l=>n(l.ownerId)));d!==void 0&&t.push(d)}else a.action==="remove"&&i.length>0?t.push(`Took ${I(i)}.`):a.action==="delete"&&(a.gone>0||i.length>0)&&t.push(a.gone>0?`Deleted ${F(a.gone)}.`:`Deleted ${I(i)}.`);let o=t.length>0,r=!1;for(let d of a.taken)r=!0,t.push(`Not added to ${n(d.ownerId)}: ${Y(d.names)}. It already has ${d.names.length===1?"a page":"pages"} of its own with the same id.`);a.blocked.length>0&&(r=!0,t.push(`Not added: ${Y(a.blocked)}. Every device ${a.blocked.length===1?"it is":"they are"} on has unsaved edits.`)),a.lastOnly.length>0&&(r=!0,t.push(`Kept ${Y(a.lastOnly)}: ${a.lastOnly.length===1?"it":"they"} would be left on no device. Use Delete for those.`));for(let d of a.dirty)r=!0,t.push(`Left ${n(d)} alone: its pages have unsaved edits. ${wt}`);for(let d of a.failed){r=!0;let l=a.action==="add"?`Not added to ${n(d.ownerId)}`:a.action==="remove"?`Not taken off ${n(d.ownerId)}`:`Not deleted on ${n(d.ownerId)}`;t.push(`${l}: ${d.message.replace(/\.$/,"")}.`)}return a.refs.length>0&&(r=!0,t.push(`Could not clear the menu slots or complication taps that opened them on ${I(a.refs.map(n))}. Change those by hand.`)),!o&&!r?{kind:"ok",text:a.action==="add"?"Those pages are on those devices already.":a.action==="remove"?"None of those pages are on those devices.":"Nothing was deleted."}:{kind:r?o?"warn":"err":"ok",text:t.join(" ")}}var st=200,dt=320,pt=6,Z=de.screen;function kt(a,s,e,n=Z){if(L(a))return{top:0,height:n.height};let t=Re(Ee(a,s),n);if(t.tiles.length===0)return{top:0,height:n.height};let o=Ne(a,1,t.topInset,e)!==w?0:Math.max(0,t.topInset+Math.min(...t.tiles.map(d=>d.y))-pt),r=t.topInset+Math.max(...t.tiles.map(d=>d.y+d.height))+pt;return{top:o,height:Math.max(1,r-o)}}var mt=2e3,bt=250,ct="wrist-assistant-panel.all-pages.v1",N;function ee(){if(N!==void 0)return N;let a={kind:"all"};try{let s=window.localStorage.getItem(ct),e=s?JSON.parse(s):{};typeof e.filter=="string"&&(a.filter=e.filter),(e.kind==="watch"||e.kind==="iphone")&&(a.kind=e.kind)}catch{}return N=a,a}function lt(a){N={...ee(),...a};try{window.localStorage.setItem(ct,JSON.stringify(N))}catch{}}var xt=(a,s)=>a.toUpperCase()===s.toUpperCase(),E=a=>O(a)?.dirty??!1,f=class extends ne{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.docs=new Map;this.facts=new Map;this.failed=[];this.readState="idle";this.linksOn=!0;this.filter=ee().filter;this.search="";this.kind=ee().kind;this.linking=!1;this.newOpen=!1;this.selecting=!1;this.selected=new Set;this.hassDrawnAt=0;this.loadSeq=0;this.readSeq=new Map;this.reloadTimers=new Map;this.unsubscribers=[];this.subscribeSeq=0;this.colorsFor=le();this.colorOf=e=>pe(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.bulkMenu!==void 0&&this.bulkBusy===void 0?(e.preventDefault(),this.closeBulkMenu()):this.menuAt!==void 0?(e.preventDefault(),this.closeDevices()):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))};this.onWindowPointerDown=e=>{let n=(this.bulkMenu==="add"||this.bulkMenu==="remove")&&this.bulkBusy===void 0;if(this.menuAt===void 0&&!n)return;let t=e.composedPath(),i=(...o)=>t.some(r=>r instanceof Element&&o.some(d=>r.classList.contains(d)));this.menuAt!==void 0&&!i("pe-dev-menu","ap-dev-open")&&this.closeDevices(),n&&!i("pk-bar-menu")&&this.closeBulkMenu()}}get hass(){return this.hassNow}set hass(e){let n=this.hassNow===void 0;this.hassNow=e;let t=Date.now();(n||t-this.hassDrawnAt>=mt)&&(this.hassDrawnAt=t,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.deviceSig=void 0,this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.endSubscriptions();for(let e of this.reloadTimers.values())window.clearTimeout(e);this.reloadTimers.clear(),this.loadSeq++,this.deviceSig=void 0}willUpdate(e){let n=this.devices,t=n.map(i=>i.ownerId).join(",");this.hassNow!==void 0&&this.isConnected&&t!==this.deviceSig&&(this.deviceSig=t,this.loadAll(),this.startSubscriptions(n))}waitingDevices(){return Pe(this.owners,this.facts)}freeDevices(){return new Set([...this.facts].filter(([,e])=>e.free).map(([e])=>e))}get devices(){return be(this.owners,this.phones)}get cards(){let e=this.devices,n=this.cardsMemo;if(n!==void 0&&n.docs===this.docs&&n.devices.length===e.length&&n.devices.every((i,o)=>i.ownerId===e[o].ownerId&&i.name===e[o].name))return n.cards;let t=Be(e,this.docs);return this.cardsMemo={docs:this.docs,devices:e,cards:t},t}async loadAll(){let e=this.hassNow;if(!e)return;let n=++this.loadSeq,t=this.devices;this.readState==="idle"&&(this.readState="loading");let i=oe(e).then(()=>!0,p=>D(p).code!=="unknown_command"),o=await Promise.all(t.map(p=>this.readOne(e,p.ownerId))),r=await i;if(n!==this.loadSeq)return;let d=new Map,l=new Map,c=[];for(let[p,h,m]of o){if(h==="failed"){c.push(p);let u=this.docs.get(p);u!==void 0&&d.set(p,u);let $=this.facts.get(p);$!==void 0&&l.set(p,$)}else h!==void 0&&d.set(p,h);m!==void 0&&l.set(p,m)}this.docs=d,this.facts=l,this.failed=c,this.linksOn=r,this.readState="ready"}async readOne(e,n){try{let t=await ae(e,n,"pages");return[n,t.revision>0?ce(t.document):void 0,$e(t)]}catch{return[n,"failed"]}}reloadOne(e){let n=this.reloadTimers.get(e);n!==void 0&&window.clearTimeout(n),this.reloadTimers.set(e,window.setTimeout(()=>{this.reloadTimers.delete(e);let t=this.hassNow;if(!t||!this.isConnected)return;let i=(this.readSeq.get(e)??0)+1;this.readSeq.set(e,i);let o=this.loadSeq;this.readOne(t,e).then(([,r,d])=>{if(i!==this.readSeq.get(e)||o!==this.loadSeq||r==="failed")return;let l=new Map(this.docs);r===void 0?l.delete(e):l.set(e,r),this.docs=l,d!==void 0&&(this.facts=new Map(this.facts).set(e,d))})},bt))}startSubscriptions(e){this.endSubscriptions();let n=this.hassNow;if(!n)return;let t=this.subscribeSeq;for(let i of e){let o=i.ownerId;re(n,o,r=>{t===this.subscribeSeq&&r.kind==="pages"&&this.reloadOne(o)}).then(r=>{t===this.subscribeSeq?this.unsubscribers.push(r):Promise.resolve(r()).catch(()=>{})},()=>{})}}endSubscriptions(){this.subscribeSeq++;for(let e of this.unsubscribers)Promise.resolve(e()).catch(()=>{});this.unsubscribers=[]}setFilter(e){this.filter=e,lt({filter:e}),this.closeDevices(),this.pruneSelected()}setSearch(e){this.search=e,this.pruneSelected()}setKind(e){this.kind=e,lt({kind:e}),this.closeDevices(),this.pruneSelected()}newPage(e){this.newOpen=!1,me(e.ownerId),this.onOpen?.(e.ownerId,e.kind)}open(e,n){let t=j(e,n,this.kindNow());ke(t.device.ownerId,{pageId:b(t.page)}),this.onOpen?.(t.device.ownerId,t.device.kind)}cardOfMenu(e){let n=this.menuAt;if(n!==void 0)return e.find(t=>{let i=x(t,n.ownerId);return i!==void 0&&xt(b(i.page),n.pageId)})}openDevices(e){let n=e.copies[0];this.menuAt={ownerId:n.device.ownerId,pageId:b(n.page)},this.devicesNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.menuAt=void 0,this.devicesNote=void 0}async toggle(e,n){let t=this.hassNow;if(!t||this.linking||n.stuck!==void 0)return;let i=n.device.ownerId,o=n.device.name,r=e.pageId,d;this.linking=!0,this.devicesNote=void 0;try{if(n.on){let c=await De(t,i,b(x(e,i).page),o);d=c===void 0?{kind:"ok",text:`Taken off ${o}.`}:{kind:"err",text:c}}else{let c=T(e,p=>O(p)?.dirty??!1);if(c===void 0)d={kind:"warn",text:V};else{let p=b(x(e,c).page),h=await ie(t,c,[p],[i]),m=Ie(h,i,[p],this.docs.get(c)),u=this.facts.get(i)?.free===!0?K([o]):void 0;d={kind:"ok",text:[`Added to ${o}.`,m,u].filter($=>$!==void 0).join(" ")}}}}catch(c){d={kind:"err",text:`Not added. ${z(c)}`}}finally{this.linking=!1}let l=n.on?e.copies.find(c=>c.device.ownerId!==i):e.copies[0];l!==void 0&&this.menuAt!==void 0&&(this.menuAt={ownerId:l.device.ownerId,pageId:r}),this.devicesNote=d,await this.loadAll()}kindNow(){return Ke(this.kind,this.devices)}shownNow(){return _(this.cards,H(this.filter,this.devices),this.search,this.kindNow())}pickedCards(){return this.shownNow().filter(e=>this.selected.has(e.key))}pruneSelected(){this.selected.size!==0&&(this.selected=G(this.selected,this.shownNow().map(e=>e.key)))}startSelect(){this.selecting=!0,this.closeDevices(),this.bulkNote=void 0}endSelect(){this.bulkBusy===void 0&&(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.bulkMenu=void 0,this.bulkNote=void 0)}cardClick(e,n,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(n,t);return}e.preventDefault(),e.stopPropagation(),this.pick(n,e.shiftKey&&this.selecting&&!i)}pick(e,n){this.bulkBusy===void 0&&(this.selecting||this.startSelect(),this.selected=n?Ue(this.selected,this.shownNow().map(t=>t.key),this.anchor,e.key):He(this.selected,e.key),this.anchor=e.key,this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0))}selectShown(e){if(this.bulkBusy!==void 0)return;let n=this.shownNow().map(t=>t.key);this.selected=e?je(this.selected,n):Ye(this.selected,n),this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0)}openBulkMenu(e){if(this.bulkBusy===void 0){if(this.bulkMenu===e){this.closeBulkMenu();return}this.bulkMenu=e,this.bulkNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar")?.querySelector(e==="delete"?".pk-bar-cancel":".pk-bar-row:not(:disabled)")?.focus()})}}closeBulkMenu(){this.bulkMenu=void 0}async runBulk(e,n=[]){let t=this.hassNow;if(!t||this.bulkBusy!==void 0)return;let i=this.devices,o=this.pickedCards();if(o.length===0)return;let r=i.map(p=>p.ownerId).filter(p=>n.includes(p));if(e!=="delete"&&r.length===0)return;let d=Se(t),l=p=>{this.bulkBusy=p};this.bulkMenu=void 0,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let c;try{let p;e==="add"?p=await nt(d,Je(o,r,this.docs,E),i,l):e==="remove"?p=await it(d,et(o,r,E),i,l):p=await ot(d,J(o,i,E),i,l),c=rt(p,i,this.freeDevices())}catch(p){c={kind:"err",text:D(p).message}}this.bulkBusy="Reading the pages again\u2026";try{await this.loadAll()}finally{this.bulkBusy=void 0}this.selected=G(Xe(o,this.cards),this.shownNow().map(p=>p.key)),this.anchor=void 0,this.bulkNote=c}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return g`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let n=this.cards,t=H(this.filter,e),i=this.kindNow(),o=_(n,t,this.search,i),r=this.readState!=="ready"&&n.length===0,d=this.failed.map(p=>e.find(h=>h.ownerId===p)?.name).filter(p=>p!==void 0),l=e.length>1,c=this.selecting?"Click pages to pick them. Shift+click picks every page between two.":`Click a page to edit it.${this.linksOn&&e.length>1?" Devices on a card puts it on another watch or iPhone.":""}`;return g`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Pages</h1>
          <p class="ap-lead">${r?"Reading every device's pages\u2026":Oe(n.length)}</p>
        </div>
        ${e.length===0?w:this.renderNew(t,e)}
      </div>
      ${d.length===0?w:g`<p class="ap-warn" role="status">Could not read the pages of ${d.join(", ")}. They show as last read.</p>`}
      <div class="pk-surface pk-page" role="region" aria-label="Your pages">
        <div class="pk-pin">
          ${this.renderHead(n,t,e)}
          ${l?this.renderTabs(e,n,t):w}
          ${this.selecting?this.renderBar(o,e):w}
        </div>
        <div class="pk-body" role=${l?"tabpanel":w} aria-labelledby=${l?`ap-tab-${t}`:w}>
          ${r?g`<p class="ap-empty">Reading every device's pages…</p>`:o.length===0?g`<p class="ap-empty">${We(t,e,this.search,i)}</p>`:g`<div class="ap-grid" role="list">${o.map(p=>this.renderCard(p,t,e,n))}</div>`}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${c}</span></div>
      </div>
    </div></div>`}renderHead(e,n,t){let i=this.selecting,o=this.bulkBusy!==void 0;return g`<div class="pk-head">
      <button type="button" class="pk-pick-btn ${i?"on":""}" aria-pressed=${i?"true":"false"}
        title=${i?"Back to opening one page at a time":"Pick several pages to add, remove or delete together"}
        ?disabled=${o} @click=${()=>i?this.endSelect():this.startSelect()}>
        ${y("checklist")}<span>Multi select</span></button>
      ${U(t)?this.renderKinds(e,n):w}
      <label class="pk-search">
        ${y("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label="Search pages"
          @input=${r=>this.setSearch(r.target.value)} />
      </label>
    </div>`}renderNew(e,n){let t=n.find(o=>o.ownerId===e)??(n.length===1?n[0]:void 0),i=this.newOpen&&t===void 0;return g`<div class="ap-new" @keydown=${o=>{o.key==="Escape"&&i&&(o.stopPropagation(),this.newOpen=!1)}}
      @focusout=${o=>{let r=o.relatedTarget;i&&!(r instanceof Node&&o.currentTarget.contains(r))&&(this.newOpen=!1)}}>
      <button type="button" class="ap-new-btn" aria-haspopup=${t===void 0?"menu":w}
        aria-expanded=${t===void 0?i?"true":"false":w}
        title=${t===void 0?"Pick the device to add a page on":`Add a page on ${t.name}`}
        @click=${()=>t===void 0?this.newOpen=!this.newOpen:this.newPage(t)}>
        ${y("plus")}<span>New page</span></button>
      ${i?g`<div class="ap-new-menu" role="menu" aria-label="Add a page on">
        <div class="ap-new-h">Add a page on</div>
        ${n.map(o=>g`<button type="button" class="ap-new-row" role="menuitem"
          style=${`--dc:${this.colorOf(o.ownerId)??"var(--wa-line-strong)"}`} @click=${()=>this.newPage(o)}>
          ${y(o.kind==="iphone"?"phone":"watch")}<span>${o.name}</span></button>`)}
      </div>`:w}
    </div>`}renderKinds(e,n){let t=this.kindNow(),i=ze(_(e,n,this.search));return g`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label="Show the pages on one kind of device" .value=${t}
        @change=${o=>this.setKind(o.target.value)}>
        ${i.map(o=>g`<option value=${o.key} ?selected=${o.key===t}>${o.label} (${o.count})</option>`)}
      </select>
    </label>`}renderTabs(e,n,t){return g`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${Ae(e,n,this.colorOf).map(i=>g`<button type="button" role="tab" class="pk-tab ${i.id===t?"on":""}"
        style=${i.color===void 0?w:`--dc:${i.color}`} id=${`ap-tab-${i.id}`} aria-selected=${i.id===t?"true":"false"}
        title=${i.id===C?"Every page on every device":`The pages on ${i.label}`}
        @click=${()=>this.setFilter(i.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${y(i.kind===void 0?"grid":i.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${i.label}</span>
        <span class="pk-tab-count">${i.count}</span>
      </button>`)}
    </div>`}renderCard(e,n,t,i){let o=j(e,n,this.kindNow()),r=this.selecting,d=!r&&this.cardOfMenu(i)?.key===e.key,l=!r&&this.linksOn&&t.length>1,c=r&&this.selected.has(e.key),p=r?`${c?"Let":"Pick"} ${e.name}${c?" go":""}`:`Edit ${e.name} on ${o.device.name}`,h=u=>this.cardClick(u,e,n),m=u=>`--dc:${this.colorOf(u)??"var(--wa-line-strong)"}`;return g`<div class="ap-card ${d?"over":""} ${r?"picking":""} ${c?"picked":""}" role="listitem" data-card=${e.key}
      @click=${u=>{r&&h(u)}}>
      <div class="ap-top">
        ${r?g`<input type="checkbox" class="pk-card-pick" .checked=${se(c)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${p}
          @click=${u=>{u.stopPropagation(),this.pick(e,u.shiftKey)}} />`:w}
        <button type="button" class="ap-open" title=${p} tabindex=${r?"-1":"0"} @click=${h}>
          <b class="ap-name">${e.name}</b>
          <small class="ap-detail">${Fe(e)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${p} @click=${h}>
        ${this.renderThumb(o)}
      </button>
      <div class="ap-foot">
        <span class="ap-devs">${e.copies.map(u=>g`<span class="ap-dev ${u.hidden?"dim":""}" style=${m(u.device.ownerId)}
          title=${u.hidden?`On ${u.device.name}, hidden there`:`On ${u.device.name}`}>
          ${y(u.device.kind==="iphone"?"phone":"watch")}<span class="ap-dev-n">${u.device.name}</span>${u.hidden?g`<em>hidden</em>`:w}
        </span>`)}</span>
        ${l?g`<button type="button" class="ap-dev-open ${d?"on":""}" aria-expanded=${d?"true":"false"}
          title="Pick the devices this page is on"
          @click=${()=>d?this.closeDevices():this.openDevices(e)}>${y("phone")}<span>Devices</span>${y("chevron")}</button>`:w}
      </div>
      ${d?this.renderMenu(e,t):w}
    </div>`}renderMenu(e,n){let t=T(e,i=>O(i)?.dirty??!1)===void 0;return Ce({name:e.name,places:_e(n,e,this.waitingDevices()),...t?{blocked:V}:{},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",colorOf:i=>this.colorOf(i),onToggle:i=>{this.toggle(e,i)},onDone:()=>this.closeDevices()})}renderBar(e,n){let t=e.filter(p=>this.selected.has(p.key)),i=t.length,o=this.bulkBusy!==void 0,r=i===0,d=e.length>0&&e.every(p=>this.selected.has(p.key)),l=n.length>1,c=o?void 0:this.bulkNote;return g`<div class="pk-bar" role="group" aria-label="Act on the picked pages">
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?"Pick a page to start.":`${i} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${o||e.length===0}
        title=${d?"Let the pages on screen go":"Pick every page the tab, the search and the Device menu have left"}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${c===void 0?w:g`<span class="pk-bar-said ${c.kind}">${c.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.bulkMenu==="delete"&&!r?this.renderDeleteAsk(t,n):g`${l&&this.linksOn?this.renderBarMenu("add",t,n,o||r):w}
          ${l?this.renderBarMenu("remove",t,n,o||r):w}
          <button type="button" class="ghost danger small" ?disabled=${o||r}
            title="Delete these pages from every device they are on"
            @click=${()=>this.openBulkMenu("delete")}>${y("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${o}
        title="Stop picking and go back to opening one page at a time"
        @click=${()=>this.endSelect()}>${y("check")}<span>Done</span></button>
    </div>`}renderBarMenu(e,n,t,i){let o=e==="add",r=this.bulkMenu===e&&!i,d=n.length,l=`${d} ${d===1?"page":"pages"}`,c=o?`Add ${l} to`:`Remove ${l} from`,p=o?this.waitingDevices():new Set;return g`<span class="pk-bar-menu">
      <button type="button" class="ghost small ${r?"on":""}" aria-expanded=${r?"true":"false"} ?disabled=${i}
        title=${o?"Put these pages on another device, linked":"Take these pages off a device"}
        @click=${()=>this.openBulkMenu(e)}>${y(o?"plus":"layers")}<span>${o?"Add to\u2026":"Remove from\u2026"}</span></button>
      ${r?g`<div class="pk-bar-list" role="group" aria-label=${c}>
        <div class="pk-bar-head">${c}</div>
        ${t.map(h=>{let m=n.filter(ht=>x(ht,h.ownerId)!==void 0).length,u=E(h.ownerId),$=p.has(h.ownerId),W=u?"unsaved edits":$?B:o?m===d?"has them all":void 0:m===0?"has none":void 0;return g`<button type="button" class="pk-bar-row" ?disabled=${W!==void 0}
            style=${`--dc:${this.colorOf(h.ownerId)??"var(--wa-muted)"}`}
            title=${u?"Its pages have unsaved edits. Save or discard them first.":$?A:`${o?"Add to":"Remove from"} ${h.name}`}
            @click=${()=>{this.runBulk(e,[h.ownerId])}}>
            ${y(h.kind==="iphone"?"phone":"watch")}
            <span class="pk-dup-name">${h.name}</span>
            ${W===void 0?o?w:g`<span class="pk-bar-row-n">${m} of ${d}</span>`:g`<span class="pk-bar-row-n">${W}</span>`}
          </button>`})}
        <div class="pk-bar-note">${o?"They go on linked: an edit on one device shows on all of them.":"A page this would leave on no device stays. Use Delete for those."}</div>
      </div>`:w}
    </span>`}renderDeleteAsk(e,n){let t=tt(J(e,n,E),n);return g`<span class="pk-bar-ask" id="ap-del-ask"><b>${t.title}</b> ${t.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask"
        @click=${()=>{this.runBulk("delete")}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>this.closeBulkMenu()}>Cancel</button>`}renderThumb(e){let n=this.docs.get(e.device.ownerId),t=n===void 0?[e.page]:M(n),i=this.hassNow?.states,o=this.icons,r=st/Z.width,d=kt(e.page,i,o),l=d.height*r,c=l>dt,p=h=>`${Math.round(h*100)/100}px`;return g`<span class="ap-pic ${c?"cut":""}" style=${`width:${p(st)};height:${p(Math.min(l,dt))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${p(-d.top*r)})`}>${Me({page:e.page,pages:t,screen:Z,scale:r,...i===void 0?{}:{states:i},...o===void 0?{}:{icons:o}})}</span>
    </span>`}static{this.styles=[Le,ve,Te,te`
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
    /* New page: filled, as New complication is, the one way to start a page
       from this tab. Its menu of devices opens under it, at its right edge. */
    .ap-new { position: relative; flex: none; }
    .ap-new-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px; font-weight: 600;
      height: 30px; padding: 0 11px; border-radius: 8px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink);
    }
    .ap-new-btn:hover { filter: brightness(1.1); }
    .ap-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-new-btn svg { width: 16px; height: 16px; }
    .ap-new-menu {
      position: absolute; right: 0; top: calc(100% + 6px); z-index: 9; width: min(260px, calc(100vw - 24px));
      display: flex; flex-direction: column; gap: 2px; padding: 6px;
      background: var(--wa-card); border: 1px solid var(--wa-line-strong); border-radius: 10px; box-shadow: var(--wa-shadow-pop);
    }
    .ap-new-h { padding: 6px 8px 4px; font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); }
    .ap-new-row {
      display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 0 10px; border-radius: 6px; cursor: pointer;
      font-size: 13px; text-align: left; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line);
      box-shadow: inset 3px 0 0 var(--dc);
    }
    .ap-new-row:hover { background: var(--wa-hover); border-color: var(--wa-line-strong); }
    .ap-new-row:focus-visible { outline: none; box-shadow: inset 3px 0 0 var(--dc), var(--wa-ring); }
    .ap-new-row svg { width: 14px; height: 14px; flex: none; color: var(--wa-muted); }
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

    /* The cards, the Complications cards' shape: the name on top, the page
       big under it, then the devices and Devices. Each card is as tall as
       its page. */
    .ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(232px, 1fr)); gap: 12px; align-items: start; }
    .ap-card {
      position: relative; z-index: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 9px 10px 10px;
      border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-card);
      transition: border-color .12s ease-out;
    }
    .ap-card:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .ap-card.over { z-index: 5; }
    .ap-thumb {
      display: grid; place-items: start center; width: 100%; padding: 10px; overflow: hidden;
      border: 0; border-radius: 6px; background: var(--wa-bg); cursor: pointer;
    }
    /* The page alone in a plain outline: no case, no clock, no page dots,
       no fold line. */
    .ap-pic {
      position: relative; display: block; max-width: 100%; overflow: hidden; line-height: 0; pointer-events: none;
      border-radius: 10px; box-shadow: 0 0 0 1px var(--wa-line-strong);
    }
    .ap-pic-in { display: block; }
    .ap-pic .wa-watch { padding: 0; margin: 0; background: none; box-shadow: none; border-radius: 0; }
    .ap-pic .wa-watch::before, .ap-pic .wa-watch::after { display: none; }
    .ap-pic .wa-watch > .wp-screen { border-radius: 0; }
    .ap-pic :is(.wp-clock, .wp-pages, .wp-fold) { display: none; }
    /* A page taller than the picture fades out at its foot. */
    .ap-pic.cut::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 36px;
      background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, .75));
    }
    .ap-top { display: flex; align-items: center; gap: 8px; max-width: 100%; padding-top: 2px; }
    .ap-open {
      display: flex; align-items: baseline; gap: 8px; min-width: 0; flex: 1;
      padding: 0; border: 0; background: none; cursor: pointer; text-align: left;
    }
    .ap-open .ap-detail { margin-left: auto; flex: none; }
    .ap-foot { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; min-width: 0; }
    .ap-foot > .ap-dev-open { margin-left: auto; }
    .ap-open:focus-visible, .ap-thumb:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .ap-name { min-width: 0; font-size: 13.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ap-card:not(.picking) .ap-open:hover .ap-name { text-decoration: underline; text-underline-offset: 2px; }
    .ap-detail { font-size: 11.5px; color: var(--wa-muted); }
    .ap-devs { display: flex; flex-wrap: wrap; gap: 4px; min-width: 0; }
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
      display: inline-flex; align-items: center; gap: 4px; padding: 3px 6px 3px 7px; border-radius: 6px; cursor: pointer;
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
  `]}};v([S({attribute:!1})],f.prototype,"owners",2),v([S({attribute:!1})],f.prototype,"ownersReady",2),v([S({attribute:!1})],f.prototype,"phones",2),v([S({attribute:!1})],f.prototype,"icons",2),v([S({attribute:!1})],f.prototype,"iconsTick",2),v([S({attribute:!1})],f.prototype,"onOpen",2),v([k()],f.prototype,"docs",2),v([k()],f.prototype,"facts",2),v([k()],f.prototype,"failed",2),v([k()],f.prototype,"readState",2),v([k()],f.prototype,"linksOn",2),v([k()],f.prototype,"filter",2),v([k()],f.prototype,"search",2),v([k()],f.prototype,"kind",2),v([k()],f.prototype,"menuAt",2),v([k()],f.prototype,"linking",2),v([k()],f.prototype,"devicesNote",2),v([k()],f.prototype,"newOpen",2),v([k()],f.prototype,"selecting",2),v([k()],f.prototype,"selected",2),v([k()],f.prototype,"bulkMenu",2),v([k()],f.prototype,"bulkBusy",2),v([k()],f.prototype,"bulkNote",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",f);export{f as WaAllPages,kt as pageCrop};
