import{e as Ie,f as Se,g as De,h as Ce}from"./chunk-CEMIXNDF.js";import{b as O,d as we}from"./chunk-ZFH7ROQH.js";import"./chunk-QHA6VOTK.js";import{g as Te,h as Re,p as Ee,t as Me,z as Le}from"./chunk-4OXY65M4.js";import"./chunk-EPZTKMPK.js";import{a as me,c as be,e as xe,g as ye,h as B,i as A,j as Pe,k as K,r as I,s as $e,t as _}from"./chunk-CYVKJR6X.js";import"./chunk-XMMIDZNY.js";import"./chunk-NXR7NIET.js";import{e as ke}from"./chunk-UPANJPAF.js";import{b as pe,c as le,e as ve}from"./chunk-VHOBROFB.js";import{P as de,j as se}from"./chunk-C5WTPD4K.js";import{k as ce,l as L,m as he,n as b,o as ue,p as ge,q as fe,r as N}from"./chunk-ESIOP3D4.js";import{Eg as ie,Hg as ae,Jg as oe,Ng as re,b as te,d as g,g as k,j as ne,k as S,kh as y,l as m}from"./chunk-IHFAZWMC.js";import{Va as D}from"./chunk-2ZMALKUC.js";import{a as v}from"./chunk-LO2NM3CE.js";var ht="A page on more than one device is the same page: an edit shows on all of them.";function Ne(i){return`${i} ${i===1?"page":"pages"} on your watches and iPhones. ${ht}`}var ut="This is its only device. Delete it in the page editor instead.",V="Save or discard the edits to these pages first. A page goes on another device as it is saved.",gt=i=>i.toUpperCase();function Oe(i,s){let e=[],t=new Map;for(let n of i){let a=s.get(n.ownerId);a!==void 0&&ke(a).forEach((r,o)=>{let d=b(r);if(d==="")return;let l=be(r),c=l===void 0?`page:${n.ownerId}:${gt(d)}`:`link:${l}`,p={device:n,page:r,hidden:ge(r),index:o},h=t.get(c);if(h!==void 0){h.copies.some(P=>P.device.ownerId===n.ownerId)||h.copies.push(p);return}let w=N(r),u={key:c,pageId:d,name:ue(r),tiles:w?0:he(r).length,smart:w,copies:[p],...l===void 0?{}:{linkId:l}};t.set(c,u),e.push(u)})}return e}var C="all";function Be(i,s,e=()=>{}){return[{id:C,label:"All",count:s.length},...i.map(t=>{let n=e(t.ownerId);return{id:t.ownerId,label:t.name,kind:t.kind,...n===void 0?{}:{color:n},count:s.filter(a=>x(a,t.ownerId)!==void 0).length}})]}function H(i,s){return i!==void 0&&s.some(e=>e.ownerId===i)?i:C}function x(i,s){return i.copies.find(e=>e.device.ownerId===s)}function q(i,s){return s==="all"||i.copies.some(e=>e.device.kind===s)}function U(i){return i.some(s=>s.kind==="watch")&&i.some(s=>s.kind==="iphone")}function Ae(i,s){return i!==void 0&&i!=="all"&&U(s)?i:"all"}function Ke(i){return[{key:"all",label:"All",count:i.length},{key:"watch",label:"Watches",count:i.filter(s=>q(s,"watch")).length},{key:"iphone",label:"iPhones",count:i.filter(s=>q(s,"iphone")).length}]}function z(i,s,e="",t="all"){let n=e.trim().toLowerCase(),a=(n===""?[...i]:i.filter(r=>r.name.toLowerCase().includes(n))).filter(r=>q(r,t));return s===C?a:a.filter(r=>x(r,s)!==void 0).sort((r,o)=>x(r,s).index-x(o,s).index)}function j(i,s,e="all"){return(s===C?void 0:x(i,s))??(e==="all"?void 0:i.copies.find(t=>t.device.kind===e))??i.copies.find(t=>t.device.kind==="watch")??i.copies[0]}function _e(i,s,e=new Set){let t=s.copies.some(a=>fe(a.page)),n=s.copies.length<=1;return i.map(a=>{let r=x(s,a.ownerId)!==void 0;if(!t&&!r&&e.has(a.ownerId))return{device:a,on:r,here:!1,stuck:A,tag:B};let o=t?xe:r&&n?ut:void 0;return{device:a,on:r,here:!1,...o===void 0?{}:{stuck:o}}})}function T(i,s){return i.copies.find(e=>!s(e.device.ownerId))?.device.ownerId}function ze(i){return i.smart?"Smart page":`${i.tiles} ${i.tiles===1?"tile":"tiles"}`}function Fe(i,s,e,t="all"){if(s.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";if(e.trim()!=="")return"No page has that name.";if(t!=="all")return`No page here is on ${t==="watch"?"a watch":"an iPhone"}.`;let n=s.find(a=>a.ownerId===i);return n!==void 0?`No pages on ${n.name} yet.`:"No device has pages yet. Open a device's Pages to make one."}var $=i=>i.toUpperCase();function qe(i,s,e){return`${i} ${i===1?s:e}`}var F=i=>qe(i,"page","pages");function Y(i){return i.length<=3?I(i):`${i.slice(0,3).join(", ")} and ${i.length-3} more`}function Ve(i,s){let e=new Set(i);return e.has(s)?e.delete(s):e.add(s),e}function He(i,s,e,t){let n=new Set(i),a=s.indexOf(t),r=e===void 0?-1:s.indexOf(e);if(a<0)return n;if(r<0)return n.add(t),n;for(let o=Math.min(r,a);o<=Math.max(r,a);o++)n.add(s[o]);return n}function Ue(i,s){return new Set([...i,...s])}function je(i,s){let e=new Set(s);return new Set([...i].filter(t=>!e.has(t)))}function G(i,s){let e=new Set(s);return new Set([...i].filter(t=>e.has(t)))}function Ye(i,s){let e=new Set(i.flatMap(t=>t.copies.map(n=>`${n.device.ownerId}|${$(b(n.page))}`)));return new Set(s.filter(t=>t.copies.some(n=>e.has(`${n.device.ownerId}|${$(b(n.page))}`))).map(t=>t.key))}function Xe(i,s,e){let t=i.find(n=>n.ownerId===s);t!==void 0?t.names.push(e):i.push({ownerId:s,names:[e]})}function Ge(i,s,e,t){let n={calls:[],already:0,taken:[],dirty:[],blocked:[]},a=s.filter(o=>t(o)?(n.dirty.push(o),!1):!0),r=new Map(a.map(o=>[o,new Set((e.get(o)===void 0?[]:L(e.get(o))).map(d=>$(b(d))))]));for(let o of i){let d=a.filter(p=>x(o,p)===void 0);if(n.already+=a.length-d.length,d.length===0)continue;let l=T(o,t);if(l===void 0){n.blocked.push(o.name);continue}let c=b(x(o,l).page);for(let p of d){let h=r.get(p);if(h.has($(c))){Xe(n.taken,p,o.name);continue}h.add($(c));let w=n.calls.find(u=>u.source===l&&u.target===p);w!==void 0?(w.pageIds.push(c),w.names.push(o.name)):n.calls.push({source:l,target:p,pageIds:[c],names:[o.name]})}}return n}function Je(i,s,e){let t=i.find(n=>n.ownerId===s);t!==void 0?t.pageIds.push(e):i.push({ownerId:s,pageIds:[e]})}function Qe(i,s){i.includes(s)||i.push(s)}function Ze(i,s,e){let t={work:[],lastOnly:[],dirty:[],notThere:0},n=new Set(s);for(let a of i){let r=a.copies.filter(o=>n.has(o.device.ownerId));if(r.length===0){t.notThere++;continue}if(r.length===a.copies.length){t.lastOnly.push(a.name);continue}for(let o of r){let d=o.device.ownerId;e(d)?Qe(t.dirty,d):Je(t.work,d,b(o.page))}}return t}function J(i,s,e){let t={work:[],pages:[],devices:[],dirty:[]},n=new Set;for(let a of i){t.pages.push({name:a.name,copies:a.copies.map(r=>({ownerId:r.device.ownerId,pageId:b(r.page)}))});for(let r of a.copies){let o=r.device.ownerId;n.add(o),e(o)?Qe(t.dirty,o):Je(t.work,o,b(r.page))}}return t.devices=s.map(a=>a.ownerId).filter(a=>n.has(a)),t.work.sort((a,r)=>t.devices.indexOf(a.ownerId)-t.devices.indexOf(r.ownerId)),t}var R=(i,s)=>i.find(e=>e.ownerId===s)?.name??"a device";function et(i,s){let e=i.pages.length,t=i.devices.map(r=>R(s,r)),n=`Delete ${F(e)} from ${qe(t.length,"device","devices")}?`,a=[`${e===1?"It comes":"They come"} off ${I(t)}, with the menu slots and complication taps there that open ${e===1?"it":"them"}. This cannot be undone.`];if(i.dirty.length>0){let r=i.dirty.map(o=>R(s,o));a.push(`${I(r)} ${r.length===1?"has":"have"} unsaved edits, so ${r.length===1?"its":"their"} copies stay.`)}return{title:n,body:a.join(" ")}}function Q(i){return{action:i,done:[],gone:0,also:0,taken:[],dirty:[],blocked:[],lastOnly:[],failed:[],refs:[]}}function X(i,s,e){if(e===0)return;let t=i.done.find(n=>n.ownerId===s);t!==void 0?t.count+=e:i.done.push({ownerId:s,count:e})}function We(i,s,e){let t=i.targets?.[s];if(t===void 0)return 0;let n=new Set(e.map($));return(t.pages??[]).filter(a=>!n.has($(a))).length+(t.status_pages??[]).length}var ft=new Set(["id_taken","not_found","system_page"]);async function tt(i,s,e,t){let n=Q("add");n.taken=s.taken.map(r=>({ownerId:r.ownerId,names:[...r.names]})),n.dirty=[...s.dirty],n.blocked=[...s.blocked];let a=(r,o,d)=>{D(o).code==="id_taken"&&d!==void 0?Xe(n.taken,r,d):n.failed.push({ownerId:r,message:`${d===void 0?"":`${d}: `}${_(o)}`})};for(let[r,o]of s.calls.entries()){t?.(`Adding to ${R(e,o.target)} (${r+1} of ${s.calls.length})\u2026`);try{let d=await i.link(o.source,o.pageIds,o.target);X(n,o.target,o.pageIds.length),n.also+=We(d,o.target,o.pageIds)}catch(d){let l=D(d).code;if(o.pageIds.length===1){a(o.target,d,o.names[0]);continue}if(l===void 0||!ft.has(l)){a(o.target,d);continue}for(let[c,p]of o.pageIds.entries())try{let h=await i.link(o.source,[p],o.target);X(n,o.target,1),n.also+=We(h,o.target,[p])}catch(h){a(o.target,h,o.names[c])}}}return n}async function nt(i,s,e,t,n,a){let r=new Map;for(let[o,d]of s.entries()){a?.(`${n} ${R(t,d.ownerId)} (${o+1} of ${s.length})\u2026`);let l;try{l=await i.remove(d.ownerId,d.pageIds)}catch(c){l={ok:!1,code:"unknown",message:D(c).message}}if(!l.ok){e.failed.push({ownerId:d.ownerId,message:l.message});continue}if(r.set(d.ownerId,new Set(l.removed.map($))),X(e,d.ownerId,l.removed.length),l.removed.length!==0)try{let c=await i.clearRefs(d.ownerId,l.removed);(c?.kind==="warn"||c?.kind==="err")&&e.refs.push(d.ownerId)}catch{e.refs.push(d.ownerId)}}return r}async function it(i,s,e,t){let n=Q("remove");return n.dirty=[...s.dirty],n.lastOnly=[...s.lastOnly],await nt(i,s.work,n,e,"Taking pages off",t),n}async function at(i,s,e,t){let n=Q("delete");n.dirty=[...s.dirty];let a=await nt(i,s.work,n,e,"Deleting on",t);return n.gone=s.pages.filter(r=>r.copies.every(o=>a.get(o.ownerId)?.has($(o.pageId))??!1)).length,n}var vt="Save or discard the edits in its page editor first.";function ot(i,s,e=new Set){let t=d=>R(s,d),n=[],a=i.done.map(d=>`${F(d.count)} ${i.action==="add"?"to":i.action==="remove"?"off":"on"} ${t(d.ownerId)}`);if(i.action==="add"&&a.length>0){n.push(`Added ${I(a)}.`),i.also>0&&n.push(`Their tiles brought ${F(i.also)} more.`);let d=K(i.done.filter(l=>e.has(l.ownerId)).map(l=>t(l.ownerId)));d!==void 0&&n.push(d)}else i.action==="remove"&&a.length>0?n.push(`Took ${I(a)}.`):i.action==="delete"&&(i.gone>0||a.length>0)&&n.push(i.gone>0?`Deleted ${F(i.gone)}.`:`Deleted ${I(a)}.`);let r=n.length>0,o=!1;for(let d of i.taken)o=!0,n.push(`Not added to ${t(d.ownerId)}: ${Y(d.names)}. It already has ${d.names.length===1?"a page":"pages"} of its own with the same id.`);i.blocked.length>0&&(o=!0,n.push(`Not added: ${Y(i.blocked)}. Every device ${i.blocked.length===1?"it is":"they are"} on has unsaved edits.`)),i.lastOnly.length>0&&(o=!0,n.push(`Kept ${Y(i.lastOnly)}: ${i.lastOnly.length===1?"it":"they"} would be left on no device. Use Delete for those.`));for(let d of i.dirty)o=!0,n.push(`Left ${t(d)} alone: its pages have unsaved edits. ${vt}`);for(let d of i.failed){o=!0;let l=i.action==="add"?`Not added to ${t(d.ownerId)}`:i.action==="remove"?`Not taken off ${t(d.ownerId)}`:`Not deleted on ${t(d.ownerId)}`;n.push(`${l}: ${d.message.replace(/\.$/,"")}.`)}return i.refs.length>0&&(o=!0,n.push(`Could not clear the menu slots or complication taps that opened them on ${I(i.refs.map(t))}. Change those by hand.`)),!r&&!o?{kind:"ok",text:i.action==="add"?"Those pages are on those devices already.":i.action==="remove"?"None of those pages are on those devices.":"Nothing was deleted."}:{kind:o?r?"warn":"err":"ok",text:n.join(" ")}}var rt=200,st=320,dt=6,Z=de.screen;function kt(i,s,e,t=Z){if(N(i))return{top:0,height:t.height};let n=Te(Re(i,s),t);if(n.tiles.length===0)return{top:0,height:t.height};let r=Ee(i,1,n.topInset,e)!==k?0:Math.max(0,n.topInset+Math.min(...n.tiles.map(d=>d.y))-dt),o=n.topInset+Math.max(...n.tiles.map(d=>d.y+d.height))+dt;return{top:r,height:Math.max(1,o-r)}}var wt=2e3,mt=250,lt="wrist-assistant-panel.all-pages.v1",M;function ee(){if(M!==void 0)return M;let i={kind:"all"};try{let s=window.localStorage.getItem(lt),e=s?JSON.parse(s):{};typeof e.filter=="string"&&(i.filter=e.filter),(e.kind==="watch"||e.kind==="iphone")&&(i.kind=e.kind)}catch{}return M=i,i}function pt(i){M={...ee(),...i};try{window.localStorage.setItem(lt,JSON.stringify(M))}catch{}}var bt=(i,s)=>i.toUpperCase()===s.toUpperCase(),E=i=>O(i)?.dirty??!1,f=class extends ne{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.docs=new Map;this.facts=new Map;this.failed=[];this.readState="idle";this.linksOn=!0;this.filter=ee().filter;this.search="";this.kind=ee().kind;this.linking=!1;this.selecting=!1;this.selected=new Set;this.hassDrawnAt=0;this.loadSeq=0;this.readSeq=new Map;this.reloadTimers=new Map;this.unsubscribers=[];this.subscribeSeq=0;this.colorsFor=le();this.colorOf=e=>pe(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.bulkMenu!==void 0&&this.bulkBusy===void 0?(e.preventDefault(),this.closeBulkMenu()):this.menuAt!==void 0?(e.preventDefault(),this.closeDevices()):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))};this.onWindowPointerDown=e=>{let t=(this.bulkMenu==="add"||this.bulkMenu==="remove")&&this.bulkBusy===void 0;if(this.menuAt===void 0&&!t)return;let n=e.composedPath(),a=(...r)=>n.some(o=>o instanceof Element&&r.some(d=>o.classList.contains(d)));this.menuAt!==void 0&&!a("pe-dev-menu","ap-dev-open")&&this.closeDevices(),t&&!a("pk-bar-menu")&&this.closeBulkMenu()}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let n=Date.now();(t||n-this.hassDrawnAt>=wt)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.deviceSig=void 0,this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.endSubscriptions();for(let e of this.reloadTimers.values())window.clearTimeout(e);this.reloadTimers.clear(),this.loadSeq++,this.deviceSig=void 0}willUpdate(e){let t=this.devices,n=t.map(a=>a.ownerId).join(",");this.hassNow!==void 0&&this.isConnected&&n!==this.deviceSig&&(this.deviceSig=n,this.loadAll(),this.startSubscriptions(t))}waitingDevices(){return Pe(this.owners,this.facts)}freeDevices(){return new Set([...this.facts].filter(([,e])=>e.free).map(([e])=>e))}get devices(){return me(this.owners,this.phones)}get cards(){let e=this.devices,t=this.cardsMemo;if(t!==void 0&&t.docs===this.docs&&t.devices.length===e.length&&t.devices.every((a,r)=>a.ownerId===e[r].ownerId&&a.name===e[r].name))return t.cards;let n=Oe(e,this.docs);return this.cardsMemo={docs:this.docs,devices:e,cards:n},n}async loadAll(){let e=this.hassNow;if(!e)return;let t=++this.loadSeq,n=this.devices;this.readState==="idle"&&(this.readState="loading");let a=oe(e).then(()=>!0,p=>D(p).code!=="unknown_command"),r=await Promise.all(n.map(p=>this.readOne(e,p.ownerId))),o=await a;if(t!==this.loadSeq)return;let d=new Map,l=new Map,c=[];for(let[p,h,w]of r){if(h==="failed"){c.push(p);let u=this.docs.get(p);u!==void 0&&d.set(p,u);let P=this.facts.get(p);P!==void 0&&l.set(p,P)}else h!==void 0&&d.set(p,h);w!==void 0&&l.set(p,w)}this.docs=d,this.facts=l,this.failed=c,this.linksOn=o,this.readState="ready"}async readOne(e,t){try{let n=await ie(e,t,"pages");return[t,n.revision>0?ce(n.document):void 0,ye(n)]}catch{return[t,"failed"]}}reloadOne(e){let t=this.reloadTimers.get(e);t!==void 0&&window.clearTimeout(t),this.reloadTimers.set(e,window.setTimeout(()=>{this.reloadTimers.delete(e);let n=this.hassNow;if(!n||!this.isConnected)return;let a=(this.readSeq.get(e)??0)+1;this.readSeq.set(e,a);let r=this.loadSeq;this.readOne(n,e).then(([,o,d])=>{if(a!==this.readSeq.get(e)||r!==this.loadSeq||o==="failed")return;let l=new Map(this.docs);o===void 0?l.delete(e):l.set(e,o),this.docs=l,d!==void 0&&(this.facts=new Map(this.facts).set(e,d))})},mt))}startSubscriptions(e){this.endSubscriptions();let t=this.hassNow;if(!t)return;let n=this.subscribeSeq;for(let a of e){let r=a.ownerId;re(t,r,o=>{n===this.subscribeSeq&&o.kind==="pages"&&this.reloadOne(r)}).then(o=>{n===this.subscribeSeq?this.unsubscribers.push(o):Promise.resolve(o()).catch(()=>{})},()=>{})}}endSubscriptions(){this.subscribeSeq++;for(let e of this.unsubscribers)Promise.resolve(e()).catch(()=>{});this.unsubscribers=[]}setFilter(e){this.filter=e,pt({filter:e}),this.closeDevices(),this.pruneSelected()}setSearch(e){this.search=e,this.pruneSelected()}setKind(e){this.kind=e,pt({kind:e}),this.closeDevices(),this.pruneSelected()}open(e,t){let n=j(e,t,this.kindNow());we(n.device.ownerId,{pageId:b(n.page)}),this.onOpen?.(n.device.ownerId,n.device.kind)}cardOfMenu(e){let t=this.menuAt;if(t!==void 0)return e.find(n=>{let a=x(n,t.ownerId);return a!==void 0&&bt(b(a.page),t.pageId)})}openDevices(e){let t=e.copies[0];this.menuAt={ownerId:t.device.ownerId,pageId:b(t.page)},this.devicesNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.menuAt=void 0,this.devicesNote=void 0}async toggle(e,t){let n=this.hassNow;if(!n||this.linking||t.stuck!==void 0)return;let a=t.device.ownerId,r=t.device.name,o=e.pageId,d;this.linking=!0,this.devicesNote=void 0;try{if(t.on){let c=await Se(n,a,b(x(e,a).page),r);d=c===void 0?{kind:"ok",text:`Taken off ${r}.`}:{kind:"err",text:c}}else{let c=T(e,p=>O(p)?.dirty??!1);if(c===void 0)d={kind:"warn",text:V};else{let p=b(x(e,c).page),h=await ae(n,c,[p],[a]),w=$e(h,a,[p],this.docs.get(c)),u=this.facts.get(a)?.free===!0?K([r]):void 0;d={kind:"ok",text:[`Added to ${r}.`,w,u].filter(P=>P!==void 0).join(" ")}}}}catch(c){d={kind:"err",text:`Not added. ${_(c)}`}}finally{this.linking=!1}let l=t.on?e.copies.find(c=>c.device.ownerId!==a):e.copies[0];l!==void 0&&this.menuAt!==void 0&&(this.menuAt={ownerId:l.device.ownerId,pageId:o}),this.devicesNote=d,await this.loadAll()}kindNow(){return Ae(this.kind,this.devices)}shownNow(){return z(this.cards,H(this.filter,this.devices),this.search,this.kindNow())}pickedCards(){return this.shownNow().filter(e=>this.selected.has(e.key))}pruneSelected(){this.selected.size!==0&&(this.selected=G(this.selected,this.shownNow().map(e=>e.key)))}startSelect(){this.selecting=!0,this.closeDevices(),this.bulkNote=void 0}endSelect(){this.bulkBusy===void 0&&(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.bulkMenu=void 0,this.bulkNote=void 0)}cardClick(e,t,n){let a=e.metaKey||e.ctrlKey;if(!this.selecting&&!a){this.open(t,n);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!a)}pick(e,t){this.bulkBusy===void 0&&(this.selecting||this.startSelect(),this.selected=t?He(this.selected,this.shownNow().map(n=>n.key),this.anchor,e.key):Ve(this.selected,e.key),this.anchor=e.key,this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0))}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(n=>n.key);this.selected=e?Ue(this.selected,t):je(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0)}openBulkMenu(e){if(this.bulkBusy===void 0){if(this.bulkMenu===e){this.closeBulkMenu();return}this.bulkMenu=e,this.bulkNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar")?.querySelector(e==="delete"?".pk-bar-cancel":".pk-bar-row:not(:disabled)")?.focus()})}}closeBulkMenu(){this.bulkMenu=void 0}async runBulk(e,t=[]){let n=this.hassNow;if(!n||this.bulkBusy!==void 0)return;let a=this.devices,r=this.pickedCards();if(r.length===0)return;let o=a.map(p=>p.ownerId).filter(p=>t.includes(p));if(e!=="delete"&&o.length===0)return;let d=Ie(n),l=p=>{this.bulkBusy=p};this.bulkMenu=void 0,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let c;try{let p;e==="add"?p=await tt(d,Ge(r,o,this.docs,E),a,l):e==="remove"?p=await it(d,Ze(r,o,E),a,l):p=await at(d,J(r,a,E),a,l),c=ot(p,a,this.freeDevices())}catch(p){c={kind:"err",text:D(p).message}}this.bulkBusy="Reading the pages again\u2026";try{await this.loadAll()}finally{this.bulkBusy=void 0}this.selected=G(Ye(r,this.cards),this.shownNow().map(p=>p.key)),this.anchor=void 0,this.bulkNote=c}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return g`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let t=this.cards,n=H(this.filter,e),a=this.kindNow(),r=z(t,n,this.search,a),o=this.readState!=="ready"&&t.length===0,d=this.failed.map(p=>e.find(h=>h.ownerId===p)?.name).filter(p=>p!==void 0),l=e.length>1,c=this.selecting?"Click pages to pick them. Shift+click picks every page between two.":`Click a page to edit it.${this.linksOn&&e.length>1?" Devices on a card puts it on another watch or iPhone.":""}`;return g`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Pages</h1>
          <p class="ap-lead">${o?"Reading every device's pages\u2026":Ne(t.length)}</p>
        </div>
      </div>
      ${d.length===0?k:g`<p class="ap-warn" role="status">Could not read the pages of ${d.join(", ")}. They show as last read.</p>`}
      <div class="pk-surface pk-page" role="region" aria-label="Your pages">
        <div class="pk-pin">
          ${this.renderHead(t,n,e)}
          ${l?this.renderTabs(e,t,n):k}
          ${this.selecting?this.renderBar(r,e):k}
        </div>
        <div class="pk-body" role=${l?"tabpanel":k} aria-labelledby=${l?`ap-tab-${n}`:k}>
          ${o?g`<p class="ap-empty">Reading every device's pages…</p>`:r.length===0?g`<p class="ap-empty">${Fe(n,e,this.search,a)}</p>`:g`<div class="ap-grid" role="list">${r.map(p=>this.renderCard(p,n,e,t))}</div>`}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${c}</span></div>
      </div>
    </div></div>`}renderHead(e,t,n){let a=this.selecting,r=this.bulkBusy!==void 0;return g`<div class="pk-head">
      <button type="button" class="pk-pick-btn ${a?"on":""}" aria-pressed=${a?"true":"false"}
        title=${a?"Back to opening one page at a time":"Pick several pages to add, remove or delete together"}
        ?disabled=${r} @click=${()=>a?this.endSelect():this.startSelect()}>
        ${y("checklist")}<span>Multi select</span></button>
      ${U(n)?this.renderKinds(e,t):k}
      <label class="pk-search">
        ${y("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label="Search pages"
          @input=${o=>this.setSearch(o.target.value)} />
      </label>
    </div>`}renderKinds(e,t){let n=this.kindNow(),a=Ke(z(e,t,this.search));return g`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label="Show the pages on one kind of device" .value=${n}
        @change=${r=>this.setKind(r.target.value)}>
        ${a.map(r=>g`<option value=${r.key} ?selected=${r.key===n}>${r.label} (${r.count})</option>`)}
      </select>
    </label>`}renderTabs(e,t,n){return g`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${Be(e,t,this.colorOf).map(a=>g`<button type="button" role="tab" class="pk-tab ${a.id===n?"on":""}"
        style=${a.color===void 0?k:`--dc:${a.color}`} id=${`ap-tab-${a.id}`} aria-selected=${a.id===n?"true":"false"}
        title=${a.id===C?"Every page on every device":`The pages on ${a.label}`}
        @click=${()=>this.setFilter(a.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${y(a.kind===void 0?"grid":a.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${a.label}</span>
        <span class="pk-tab-count">${a.count}</span>
      </button>`)}
    </div>`}renderCard(e,t,n,a){let r=j(e,t,this.kindNow()),o=this.selecting,d=!o&&this.cardOfMenu(a)?.key===e.key,l=!o&&this.linksOn&&n.length>1,c=o&&this.selected.has(e.key),p=o?`${c?"Let":"Pick"} ${e.name}${c?" go":""}`:`Edit ${e.name} on ${r.device.name}`,h=u=>this.cardClick(u,e,t),w=u=>`--dc:${this.colorOf(u)??"var(--wa-line-strong)"}`;return g`<div class="ap-card ${d?"over":""} ${o?"picking":""} ${c?"picked":""}" role="listitem" data-card=${e.key}
      @click=${u=>{o&&h(u)}}>
      <div class="ap-top">
        ${o?g`<input type="checkbox" class="pk-card-pick" .checked=${se(c)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${p}
          @click=${u=>{u.stopPropagation(),this.pick(e,u.shiftKey)}} />`:k}
        <button type="button" class="ap-open" title=${p} tabindex=${o?"-1":"0"} @click=${h}>
          <b class="ap-name">${e.name}</b>
          <small class="ap-detail">${ze(e)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${p} @click=${h}>
        ${this.renderThumb(r)}
      </button>
      <div class="ap-foot">
        <span class="ap-devs">${e.copies.map(u=>g`<span class="ap-dev ${u.hidden?"dim":""}" style=${w(u.device.ownerId)}
          title=${u.hidden?`On ${u.device.name}, hidden there`:`On ${u.device.name}`}>
          ${y(u.device.kind==="iphone"?"phone":"watch")}<span class="ap-dev-n">${u.device.name}</span>${u.hidden?g`<em>hidden</em>`:k}
        </span>`)}</span>
        ${l?g`<button type="button" class="ap-dev-open ${d?"on":""}" aria-expanded=${d?"true":"false"}
          title="Pick the devices this page is on"
          @click=${()=>d?this.closeDevices():this.openDevices(e)}>${y("phone")}<span>Devices</span>${y("chevron")}</button>`:k}
      </div>
      ${d?this.renderMenu(e,n):k}
    </div>`}renderMenu(e,t){let n=T(e,a=>O(a)?.dirty??!1)===void 0;return De({name:e.name,places:_e(t,e,this.waitingDevices()),...n?{blocked:V}:{},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",colorOf:a=>this.colorOf(a),onToggle:a=>{this.toggle(e,a)},onDone:()=>this.closeDevices()})}renderBar(e,t){let n=e.filter(p=>this.selected.has(p.key)),a=n.length,r=this.bulkBusy!==void 0,o=a===0,d=e.length>0&&e.every(p=>this.selected.has(p.key)),l=t.length>1,c=r?void 0:this.bulkNote;return g`<div class="pk-bar" role="group" aria-label="Act on the picked pages">
      <span class="pk-bar-count" role="status">${this.bulkBusy??(o?"Pick a page to start.":`${a} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${r||e.length===0}
        title=${d?"Let the pages on screen go":"Pick every page the tab, the search and the Device menu have left"}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${c===void 0?k:g`<span class="pk-bar-said ${c.kind}">${c.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.bulkMenu==="delete"&&!o?this.renderDeleteAsk(n,t):g`${l&&this.linksOn?this.renderBarMenu("add",n,t,r||o):k}
          ${l?this.renderBarMenu("remove",n,t,r||o):k}
          <button type="button" class="ghost danger small" ?disabled=${r||o}
            title="Delete these pages from every device they are on"
            @click=${()=>this.openBulkMenu("delete")}>${y("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${r}
        title="Stop picking and go back to opening one page at a time"
        @click=${()=>this.endSelect()}>${y("check")}<span>Done</span></button>
    </div>`}renderBarMenu(e,t,n,a){let r=e==="add",o=this.bulkMenu===e&&!a,d=t.length,l=`${d} ${d===1?"page":"pages"}`,c=r?`Add ${l} to`:`Remove ${l} from`,p=r?this.waitingDevices():new Set;return g`<span class="pk-bar-menu">
      <button type="button" class="ghost small ${o?"on":""}" aria-expanded=${o?"true":"false"} ?disabled=${a}
        title=${r?"Put these pages on another device, linked":"Take these pages off a device"}
        @click=${()=>this.openBulkMenu(e)}>${y(r?"plus":"layers")}<span>${r?"Add to\u2026":"Remove from\u2026"}</span></button>
      ${o?g`<div class="pk-bar-list" role="group" aria-label=${c}>
        <div class="pk-bar-head">${c}</div>
        ${n.map(h=>{let w=t.filter(ct=>x(ct,h.ownerId)!==void 0).length,u=E(h.ownerId),P=p.has(h.ownerId),W=u?"unsaved edits":P?B:r?w===d?"has them all":void 0:w===0?"has none":void 0;return g`<button type="button" class="pk-bar-row" ?disabled=${W!==void 0}
            style=${`--dc:${this.colorOf(h.ownerId)??"var(--wa-muted)"}`}
            title=${u?"Its pages have unsaved edits. Save or discard them first.":P?A:`${r?"Add to":"Remove from"} ${h.name}`}
            @click=${()=>{this.runBulk(e,[h.ownerId])}}>
            ${y(h.kind==="iphone"?"phone":"watch")}
            <span class="pk-dup-name">${h.name}</span>
            ${W===void 0?r?k:g`<span class="pk-bar-row-n">${w} of ${d}</span>`:g`<span class="pk-bar-row-n">${W}</span>`}
          </button>`})}
        <div class="pk-bar-note">${r?"They go on linked: an edit on one device shows on all of them.":"A page this would leave on no device stays. Use Delete for those."}</div>
      </div>`:k}
    </span>`}renderDeleteAsk(e,t){let n=et(J(e,t,E),t);return g`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask"
        @click=${()=>{this.runBulk("delete")}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>this.closeBulkMenu()}>Cancel</button>`}renderThumb(e){let t=this.docs.get(e.device.ownerId),n=t===void 0?[e.page]:L(t),a=this.hassNow?.states,r=this.icons,o=rt/Z.width,d=kt(e.page,a,r),l=d.height*o,c=l>st,p=h=>`${Math.round(h*100)/100}px`;return g`<span class="ap-pic ${c?"cut":""}" style=${`width:${p(rt)};height:${p(Math.min(l,st))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${p(-d.top*o)})`}>${Me({page:e.page,pages:n,screen:Z,scale:o,...a===void 0?{}:{states:a},...r===void 0?{}:{icons:r}})}</span>
    </span>`}static{this.styles=[Le,ve,Ce,te`
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
  `]}};v([S({attribute:!1})],f.prototype,"owners",2),v([S({attribute:!1})],f.prototype,"ownersReady",2),v([S({attribute:!1})],f.prototype,"phones",2),v([S({attribute:!1})],f.prototype,"icons",2),v([S({attribute:!1})],f.prototype,"iconsTick",2),v([S({attribute:!1})],f.prototype,"onOpen",2),v([m()],f.prototype,"docs",2),v([m()],f.prototype,"facts",2),v([m()],f.prototype,"failed",2),v([m()],f.prototype,"readState",2),v([m()],f.prototype,"linksOn",2),v([m()],f.prototype,"filter",2),v([m()],f.prototype,"search",2),v([m()],f.prototype,"kind",2),v([m()],f.prototype,"menuAt",2),v([m()],f.prototype,"linking",2),v([m()],f.prototype,"devicesNote",2),v([m()],f.prototype,"selecting",2),v([m()],f.prototype,"selected",2),v([m()],f.prototype,"bulkMenu",2),v([m()],f.prototype,"bulkBusy",2),v([m()],f.prototype,"bulkNote",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",f);export{f as WaAllPages,kt as pageCrop};
