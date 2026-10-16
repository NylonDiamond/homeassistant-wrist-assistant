import{d as fe,f as ve,h as ke,n as P,o as we,p as O,r as me,s as be,t as xe,u as ye}from"./chunk-LF55F5FW.js";import{b as E,d as ge}from"./chunk-T6XUMK27.js";import"./chunk-SUT6NIQS.js";import{g as $e,h as Pe,p as Ie,t as Se,z as De}from"./chunk-NKSF44KP.js";import"./chunk-NIHNEBNT.js";import"./chunk-4EBXPM3X.js";import"./chunk-NXR7NIET.js";import{e as ue}from"./chunk-UPANJPAF.js";import{b as oe,c as re,e as he}from"./chunk-6SLUA7OT.js";import{P as ae,j as ie}from"./chunk-C5WTPD4K.js";import{k as se,l as N,m as de,n as m,o as pe,p as le,q as ce,r as M}from"./chunk-ESIOP3D4.js";import{Eg as Z,Hg as ee,Jg as te,Ng as ne,b as J,d as u,g as k,j as Q,k as I,kh as y,l as w}from"./chunk-IHFAZWMC.js";import{Ua as S}from"./chunk-RXIM2BXJ.js";import{a as v}from"./chunk-LO2NM3CE.js";var ot="A page on more than one device is the same page: an edit shows on all of them.";function Ce(i){return`${i} ${i===1?"page":"pages"} on your watches and iPhones. ${ot}`}var rt="This is its only device. Delete it in the page editor instead.",_="Save or discard the edits to these pages first. A page goes on another device as it is saved.",st=i=>i.toUpperCase();function Te(i,s){let e=[],t=new Map;for(let n of i){let o=s.get(n.ownerId);o!==void 0&&ue(o).forEach((r,a)=>{let d=m(r);if(d==="")return;let c=ve(r),l=c===void 0?`page:${n.ownerId}:${st(d)}`:`link:${c}`,p={device:n,page:r,hidden:le(r),index:a},g=t.get(l);if(g!==void 0){g.copies.some(A=>A.device.ownerId===n.ownerId)||g.copies.push(p);return}let b=M(r),h={key:l,pageId:d,name:pe(r),tiles:b?0:de(r).length,smart:b,copies:[p],...c===void 0?{}:{linkId:c}};t.set(l,h),e.push(h)})}return e}var D="all";function Re(i,s,e=()=>{}){return[{id:D,label:"All",count:s.length},...i.map(t=>{let n=e(t.ownerId);return{id:t.ownerId,label:t.name,kind:t.kind,...n===void 0?{}:{color:n},count:s.filter(o=>x(o,t.ownerId)!==void 0).length}})]}function W(i,s){return i!==void 0&&s.some(e=>e.ownerId===i)?i:D}function x(i,s){return i.copies.find(e=>e.device.ownerId===s)}function z(i,s){return s==="all"||i.copies.some(e=>e.device.kind===s)}function F(i){return i.some(s=>s.kind==="watch")&&i.some(s=>s.kind==="iphone")}function Le(i,s){return i!==void 0&&i!=="all"&&F(s)?i:"all"}function Ne(i){return[{key:"all",label:"All",count:i.length},{key:"watch",label:"Watches",count:i.filter(s=>z(s,"watch")).length},{key:"iphone",label:"iPhones",count:i.filter(s=>z(s,"iphone")).length}]}function B(i,s,e="",t="all"){let n=e.trim().toLowerCase(),o=(n===""?[...i]:i.filter(r=>r.name.toLowerCase().includes(n))).filter(r=>z(r,t));return s===D?o:o.filter(r=>x(r,s)!==void 0).sort((r,a)=>x(r,s).index-x(a,s).index)}function q(i,s,e="all"){return(s===D?void 0:x(i,s))??(e==="all"?void 0:i.copies.find(t=>t.device.kind===e))??i.copies.find(t=>t.device.kind==="watch")??i.copies[0]}function Me(i,s){let e=s.copies.some(n=>ce(n.page)),t=s.copies.length<=1;return i.map(n=>{let o=x(s,n.ownerId)!==void 0,r=e?ke:o&&t?rt:void 0;return{device:n,on:o,here:!1,...r===void 0?{}:{stuck:r}}})}function C(i,s){return i.copies.find(e=>!s(e.device.ownerId))?.device.ownerId}function Ee(i){return i.smart?"Smart page":`${i.tiles} ${i.tiles===1?"tile":"tiles"}`}function Oe(i,s,e,t="all"){if(s.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";if(e.trim()!=="")return"No page has that name.";if(t!=="all")return`No page here is on ${t==="watch"?"a watch":"an iPhone"}.`;let n=s.find(o=>o.ownerId===i);return n!==void 0?`No pages on ${n.name} yet.`:"No device has pages yet. Open a device's Pages to make one."}var $=i=>i.toUpperCase();function Ke(i,s,e){return`${i} ${i===1?s:e}`}var K=i=>Ke(i,"page","pages");function H(i){return i.length<=3?P(i):`${i.slice(0,3).join(", ")} and ${i.length-3} more`}function Ae(i,s){let e=new Set(i);return e.has(s)?e.delete(s):e.add(s),e}function ze(i,s,e,t){let n=new Set(i),o=s.indexOf(t),r=e===void 0?-1:s.indexOf(e);if(o<0)return n;if(r<0)return n.add(t),n;for(let a=Math.min(r,o);a<=Math.max(r,o);a++)n.add(s[a]);return n}function _e(i,s){return new Set([...i,...s])}function We(i,s){let e=new Set(s);return new Set([...i].filter(t=>!e.has(t)))}function U(i,s){let e=new Set(s);return new Set([...i].filter(t=>e.has(t)))}function Fe(i,s){let e=new Set(i.flatMap(t=>t.copies.map(n=>`${n.device.ownerId}|${$(m(n.page))}`)));return new Set(s.filter(t=>t.copies.some(n=>e.has(`${n.device.ownerId}|${$(m(n.page))}`))).map(t=>t.key))}function qe(i,s,e){let t=i.find(n=>n.ownerId===s);t!==void 0?t.names.push(e):i.push({ownerId:s,names:[e]})}function He(i,s,e,t){let n={calls:[],already:0,taken:[],dirty:[],blocked:[]},o=s.filter(a=>t(a)?(n.dirty.push(a),!1):!0),r=new Map(o.map(a=>[a,new Set((e.get(a)===void 0?[]:N(e.get(a))).map(d=>$(m(d))))]));for(let a of i){let d=o.filter(p=>x(a,p)===void 0);if(n.already+=o.length-d.length,d.length===0)continue;let c=C(a,t);if(c===void 0){n.blocked.push(a.name);continue}let l=m(x(a,c).page);for(let p of d){let g=r.get(p);if(g.has($(l))){qe(n.taken,p,a.name);continue}g.add($(l));let b=n.calls.find(h=>h.source===c&&h.target===p);b!==void 0?(b.pageIds.push(l),b.names.push(a.name)):n.calls.push({source:c,target:p,pageIds:[l],names:[a.name]})}}return n}function Ve(i,s,e){let t=i.find(n=>n.ownerId===s);t!==void 0?t.pageIds.push(e):i.push({ownerId:s,pageIds:[e]})}function Ue(i,s){i.includes(s)||i.push(s)}function je(i,s,e){let t={work:[],lastOnly:[],dirty:[],notThere:0},n=new Set(s);for(let o of i){let r=o.copies.filter(a=>n.has(a.device.ownerId));if(r.length===0){t.notThere++;continue}if(r.length===o.copies.length){t.lastOnly.push(o.name);continue}for(let a of r){let d=a.device.ownerId;e(d)?Ue(t.dirty,d):Ve(t.work,d,m(a.page))}}return t}function j(i,s,e){let t={work:[],pages:[],devices:[],dirty:[]},n=new Set;for(let o of i){t.pages.push({name:o.name,copies:o.copies.map(r=>({ownerId:r.device.ownerId,pageId:m(r.page)}))});for(let r of o.copies){let a=r.device.ownerId;n.add(a),e(a)?Ue(t.dirty,a):Ve(t.work,a,m(r.page))}}return t.devices=s.map(o=>o.ownerId).filter(o=>n.has(o)),t.work.sort((o,r)=>t.devices.indexOf(o.ownerId)-t.devices.indexOf(r.ownerId)),t}var T=(i,s)=>i.find(e=>e.ownerId===s)?.name??"a device";function Ye(i,s){let e=i.pages.length,t=i.devices.map(r=>T(s,r)),n=`Delete ${K(e)} from ${Ke(t.length,"device","devices")}?`,o=[`${e===1?"It comes":"They come"} off ${P(t)}, with the menu slots and complication taps there that open ${e===1?"it":"them"}. This cannot be undone.`];if(i.dirty.length>0){let r=i.dirty.map(a=>T(s,a));o.push(`${P(r)} ${r.length===1?"has":"have"} unsaved edits, so ${r.length===1?"its":"their"} copies stay.`)}return{title:n,body:o.join(" ")}}function Y(i){return{action:i,done:[],gone:0,also:0,taken:[],dirty:[],blocked:[],lastOnly:[],failed:[],refs:[]}}function V(i,s,e){if(e===0)return;let t=i.done.find(n=>n.ownerId===s);t!==void 0?t.count+=e:i.done.push({ownerId:s,count:e})}function Be(i,s,e){let t=i.targets?.[s];if(t===void 0)return 0;let n=new Set(e.map($));return(t.pages??[]).filter(o=>!n.has($(o))).length+(t.status_pages??[]).length}var dt=new Set(["id_taken","not_found","system_page"]);async function Xe(i,s,e,t){let n=Y("add");n.taken=s.taken.map(r=>({ownerId:r.ownerId,names:[...r.names]})),n.dirty=[...s.dirty],n.blocked=[...s.blocked];let o=(r,a,d)=>{S(a).code==="id_taken"&&d!==void 0?qe(n.taken,r,d):n.failed.push({ownerId:r,message:`${d===void 0?"":`${d}: `}${O(a)}`})};for(let[r,a]of s.calls.entries()){t?.(`Adding to ${T(e,a.target)} (${r+1} of ${s.calls.length})\u2026`);try{let d=await i.link(a.source,a.pageIds,a.target);V(n,a.target,a.pageIds.length),n.also+=Be(d,a.target,a.pageIds)}catch(d){let c=S(d).code;if(a.pageIds.length===1){o(a.target,d,a.names[0]);continue}if(c===void 0||!dt.has(c)){o(a.target,d);continue}for(let[l,p]of a.pageIds.entries())try{let g=await i.link(a.source,[p],a.target);V(n,a.target,1),n.also+=Be(g,a.target,[p])}catch(g){o(a.target,g,a.names[l])}}}return n}async function Ge(i,s,e,t,n,o){let r=new Map;for(let[a,d]of s.entries()){o?.(`${n} ${T(t,d.ownerId)} (${a+1} of ${s.length})\u2026`);let c;try{c=await i.remove(d.ownerId,d.pageIds)}catch(l){c={ok:!1,code:"unknown",message:S(l).message}}if(!c.ok){e.failed.push({ownerId:d.ownerId,message:c.message});continue}if(r.set(d.ownerId,new Set(c.removed.map($))),V(e,d.ownerId,c.removed.length),c.removed.length!==0)try{let l=await i.clearRefs(d.ownerId,c.removed);(l?.kind==="warn"||l?.kind==="err")&&e.refs.push(d.ownerId)}catch{e.refs.push(d.ownerId)}}return r}async function Je(i,s,e,t){let n=Y("remove");return n.dirty=[...s.dirty],n.lastOnly=[...s.lastOnly],await Ge(i,s.work,n,e,"Taking pages off",t),n}async function Qe(i,s,e,t){let n=Y("delete");n.dirty=[...s.dirty];let o=await Ge(i,s.work,n,e,"Deleting on",t);return n.gone=s.pages.filter(r=>r.copies.every(a=>o.get(a.ownerId)?.has($(a.pageId))??!1)).length,n}var pt="Save or discard the edits in its page editor first.";function Ze(i,s){let e=a=>T(s,a),t=[],n=i.done.map(a=>`${K(a.count)} ${i.action==="add"?"to":i.action==="remove"?"off":"on"} ${e(a.ownerId)}`);i.action==="add"&&n.length>0?(t.push(`Added ${P(n)}.`),i.also>0&&t.push(`Their tiles brought ${K(i.also)} more.`)):i.action==="remove"&&n.length>0?t.push(`Took ${P(n)}.`):i.action==="delete"&&(i.gone>0||n.length>0)&&t.push(i.gone>0?`Deleted ${K(i.gone)}.`:`Deleted ${P(n)}.`);let o=t.length>0,r=!1;for(let a of i.taken)r=!0,t.push(`Not added to ${e(a.ownerId)}: ${H(a.names)}. It already has ${a.names.length===1?"a page":"pages"} of its own with the same id.`);i.blocked.length>0&&(r=!0,t.push(`Not added: ${H(i.blocked)}. Every device ${i.blocked.length===1?"it is":"they are"} on has unsaved edits.`)),i.lastOnly.length>0&&(r=!0,t.push(`Kept ${H(i.lastOnly)}: ${i.lastOnly.length===1?"it":"they"} would be left on no device. Use Delete for those.`));for(let a of i.dirty)r=!0,t.push(`Left ${e(a)} alone: its pages have unsaved edits. ${pt}`);for(let a of i.failed){r=!0;let d=i.action==="add"?`Not added to ${e(a.ownerId)}`:i.action==="remove"?`Not taken off ${e(a.ownerId)}`:`Not deleted on ${e(a.ownerId)}`;t.push(`${d}: ${a.message.replace(/\.$/,"")}.`)}return i.refs.length>0&&(r=!0,t.push(`Could not clear the menu slots or complication taps that opened them on ${P(i.refs.map(e))}. Change those by hand.`)),!o&&!r?{kind:"ok",text:i.action==="add"?"Those pages are on those devices already.":i.action==="remove"?"None of those pages are on those devices.":"Nothing was deleted."}:{kind:r?o?"warn":"err":"ok",text:t.join(" ")}}var et=200,tt=320,nt=6,X=ae.screen;function lt(i,s,e,t=X){if(M(i))return{top:0,height:t.height};let n=$e(Pe(i,s),t);if(n.tiles.length===0)return{top:0,height:t.height};let r=Ie(i,1,n.topInset,e)!==k?0:Math.max(0,n.topInset+Math.min(...n.tiles.map(d=>d.y))-nt),a=n.topInset+Math.max(...n.tiles.map(d=>d.y+d.height))+nt;return{top:r,height:Math.max(1,a-r)}}var ct=2e3,ht=250,at="wrist-assistant-panel.all-pages.v1",L;function G(){if(L!==void 0)return L;let i={kind:"all"};try{let s=window.localStorage.getItem(at),e=s?JSON.parse(s):{};typeof e.filter=="string"&&(i.filter=e.filter),(e.kind==="watch"||e.kind==="iphone")&&(i.kind=e.kind)}catch{}return L=i,i}function it(i){L={...G(),...i};try{window.localStorage.setItem(at,JSON.stringify(L))}catch{}}var ut=(i,s)=>i.toUpperCase()===s.toUpperCase(),R=i=>E(i)?.dirty??!1,f=class extends Q{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.docs=new Map;this.failed=[];this.readState="idle";this.linksOn=!0;this.filter=G().filter;this.search="";this.kind=G().kind;this.linking=!1;this.selecting=!1;this.selected=new Set;this.hassDrawnAt=0;this.loadSeq=0;this.readSeq=new Map;this.reloadTimers=new Map;this.unsubscribers=[];this.subscribeSeq=0;this.colorsFor=re();this.colorOf=e=>oe(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.bulkMenu!==void 0&&this.bulkBusy===void 0?(e.preventDefault(),this.closeBulkMenu()):this.menuAt!==void 0?(e.preventDefault(),this.closeDevices()):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))};this.onWindowPointerDown=e=>{let t=(this.bulkMenu==="add"||this.bulkMenu==="remove")&&this.bulkBusy===void 0;if(this.menuAt===void 0&&!t)return;let n=e.composedPath(),o=(...r)=>n.some(a=>a instanceof Element&&r.some(d=>a.classList.contains(d)));this.menuAt!==void 0&&!o("pe-dev-menu","ap-dev-open")&&this.closeDevices(),t&&!o("pk-bar-menu")&&this.closeBulkMenu()}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let n=Date.now();(t||n-this.hassDrawnAt>=ct)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.deviceSig=void 0,this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.endSubscriptions();for(let e of this.reloadTimers.values())window.clearTimeout(e);this.reloadTimers.clear(),this.loadSeq++,this.deviceSig=void 0}willUpdate(e){let t=this.devices,n=t.map(o=>o.ownerId).join(",");this.hassNow!==void 0&&this.isConnected&&n!==this.deviceSig&&(this.deviceSig=n,this.loadAll(),this.startSubscriptions(t))}get devices(){return fe(this.owners,this.phones)}get cards(){let e=this.devices,t=this.cardsMemo;if(t!==void 0&&t.docs===this.docs&&t.devices.length===e.length&&t.devices.every((o,r)=>o.ownerId===e[r].ownerId&&o.name===e[r].name))return t.cards;let n=Te(e,this.docs);return this.cardsMemo={docs:this.docs,devices:e,cards:n},n}async loadAll(){let e=this.hassNow;if(!e)return;let t=++this.loadSeq,n=this.devices;this.readState==="idle"&&(this.readState="loading");let o=te(e).then(()=>!0,l=>S(l).code!=="unknown_command"),r=await Promise.all(n.map(l=>this.readOne(e,l.ownerId))),a=await o;if(t!==this.loadSeq)return;let d=new Map,c=[];for(let[l,p]of r)if(p==="failed"){c.push(l);let g=this.docs.get(l);g!==void 0&&d.set(l,g)}else p!==void 0&&d.set(l,p);this.docs=d,this.failed=c,this.linksOn=a,this.readState="ready"}async readOne(e,t){try{let n=await Z(e,t,"pages");return[t,n.revision>0?se(n.document):void 0]}catch{return[t,"failed"]}}reloadOne(e){let t=this.reloadTimers.get(e);t!==void 0&&window.clearTimeout(t),this.reloadTimers.set(e,window.setTimeout(()=>{this.reloadTimers.delete(e);let n=this.hassNow;if(!n||!this.isConnected)return;let o=(this.readSeq.get(e)??0)+1;this.readSeq.set(e,o);let r=this.loadSeq;this.readOne(n,e).then(([,a])=>{if(o!==this.readSeq.get(e)||r!==this.loadSeq||a==="failed")return;let d=new Map(this.docs);a===void 0?d.delete(e):d.set(e,a),this.docs=d})},ht))}startSubscriptions(e){this.endSubscriptions();let t=this.hassNow;if(!t)return;let n=this.subscribeSeq;for(let o of e){let r=o.ownerId;ne(t,r,a=>{n===this.subscribeSeq&&a.kind==="pages"&&this.reloadOne(r)}).then(a=>{n===this.subscribeSeq?this.unsubscribers.push(a):Promise.resolve(a()).catch(()=>{})},()=>{})}}endSubscriptions(){this.subscribeSeq++;for(let e of this.unsubscribers)Promise.resolve(e()).catch(()=>{});this.unsubscribers=[]}setFilter(e){this.filter=e,it({filter:e}),this.closeDevices(),this.pruneSelected()}setSearch(e){this.search=e,this.pruneSelected()}setKind(e){this.kind=e,it({kind:e}),this.closeDevices(),this.pruneSelected()}open(e,t){let n=q(e,t,this.kindNow());ge(n.device.ownerId,{pageId:m(n.page)}),this.onOpen?.(n.device.ownerId,n.device.kind)}cardOfMenu(e){let t=this.menuAt;if(t!==void 0)return e.find(n=>{let o=x(n,t.ownerId);return o!==void 0&&ut(m(o.page),t.pageId)})}openDevices(e){let t=e.copies[0];this.menuAt={ownerId:t.device.ownerId,pageId:m(t.page)},this.devicesNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.menuAt=void 0,this.devicesNote=void 0}async toggle(e,t){let n=this.hassNow;if(!n||this.linking||t.stuck!==void 0)return;let o=t.device.ownerId,r=t.device.name,a=e.pageId,d;this.linking=!0,this.devicesNote=void 0;try{if(t.on){let l=await be(n,o,m(x(e,o).page),r);d=l===void 0?{kind:"ok",text:`Taken off ${r}.`}:{kind:"err",text:l}}else{let l=C(e,p=>E(p)?.dirty??!1);if(l===void 0)d={kind:"warn",text:_};else{let p=m(x(e,l).page),g=await ee(n,l,[p],[o]),b=we(g,o,[p],this.docs.get(l));d={kind:"ok",text:`Added to ${r}.${b===void 0?"":` ${b}`}`}}}}catch(l){d={kind:"err",text:`Not added. ${O(l)}`}}finally{this.linking=!1}let c=t.on?e.copies.find(l=>l.device.ownerId!==o):e.copies[0];c!==void 0&&this.menuAt!==void 0&&(this.menuAt={ownerId:c.device.ownerId,pageId:a}),this.devicesNote=d,await this.loadAll()}kindNow(){return Le(this.kind,this.devices)}shownNow(){return B(this.cards,W(this.filter,this.devices),this.search,this.kindNow())}pickedCards(){return this.shownNow().filter(e=>this.selected.has(e.key))}pruneSelected(){this.selected.size!==0&&(this.selected=U(this.selected,this.shownNow().map(e=>e.key)))}startSelect(){this.selecting=!0,this.closeDevices(),this.bulkNote=void 0}endSelect(){this.bulkBusy===void 0&&(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.bulkMenu=void 0,this.bulkNote=void 0)}cardClick(e,t,n){let o=e.metaKey||e.ctrlKey;if(!this.selecting&&!o){this.open(t,n);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!o)}pick(e,t){this.bulkBusy===void 0&&(this.selecting||this.startSelect(),this.selected=t?ze(this.selected,this.shownNow().map(n=>n.key),this.anchor,e.key):Ae(this.selected,e.key),this.anchor=e.key,this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0))}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(n=>n.key);this.selected=e?_e(this.selected,t):We(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0)}openBulkMenu(e){if(this.bulkBusy===void 0){if(this.bulkMenu===e){this.closeBulkMenu();return}this.bulkMenu=e,this.bulkNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar")?.querySelector(e==="delete"?".pk-bar-cancel":".pk-bar-row:not(:disabled)")?.focus()})}}closeBulkMenu(){this.bulkMenu=void 0}async runBulk(e,t=[]){let n=this.hassNow;if(!n||this.bulkBusy!==void 0)return;let o=this.devices,r=this.pickedCards();if(r.length===0)return;let a=o.map(p=>p.ownerId).filter(p=>t.includes(p));if(e!=="delete"&&a.length===0)return;let d=me(n),c=p=>{this.bulkBusy=p};this.bulkMenu=void 0,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let l;try{let p;e==="add"?p=await Xe(d,He(r,a,this.docs,R),o,c):e==="remove"?p=await Je(d,je(r,a,R),o,c):p=await Qe(d,j(r,o,R),o,c),l=Ze(p,o)}catch(p){l={kind:"err",text:S(p).message}}this.bulkBusy="Reading the pages again\u2026";try{await this.loadAll()}finally{this.bulkBusy=void 0}this.selected=U(Fe(r,this.cards),this.shownNow().map(p=>p.key)),this.anchor=void 0,this.bulkNote=l}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return u`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let t=this.cards,n=W(this.filter,e),o=this.kindNow(),r=B(t,n,this.search,o),a=this.readState!=="ready"&&t.length===0,d=this.failed.map(p=>e.find(g=>g.ownerId===p)?.name).filter(p=>p!==void 0),c=e.length>1,l=this.selecting?"Click pages to pick them. Shift+click picks every page between two.":`Click a page to edit it.${this.linksOn&&e.length>1?" Devices on a card puts it on another watch or iPhone.":""}`;return u`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Pages</h1>
          <p class="ap-lead">${a?"Reading every device's pages\u2026":Ce(t.length)}</p>
        </div>
      </div>
      ${d.length===0?k:u`<p class="ap-warn" role="status">Could not read the pages of ${d.join(", ")}. They show as last read.</p>`}
      <div class="pk-surface pk-page" role="region" aria-label="Your pages">
        <div class="pk-pin">
          ${this.renderHead(t,n,e)}
          ${c?this.renderTabs(e,t,n):k}
          ${this.selecting?this.renderBar(r,e):k}
        </div>
        <div class="pk-body" role=${c?"tabpanel":k} aria-labelledby=${c?`ap-tab-${n}`:k}>
          ${a?u`<p class="ap-empty">Reading every device's pages…</p>`:r.length===0?u`<p class="ap-empty">${Oe(n,e,this.search,o)}</p>`:u`<div class="ap-grid" role="list">${r.map(p=>this.renderCard(p,n,e,t))}</div>`}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${l}</span></div>
      </div>
    </div></div>`}renderHead(e,t,n){let o=this.selecting,r=this.bulkBusy!==void 0;return u`<div class="pk-head">
      <button type="button" class="pk-pick-btn ${o?"on":""}" aria-pressed=${o?"true":"false"}
        title=${o?"Back to opening one page at a time":"Pick several pages to add, remove or delete together"}
        ?disabled=${r} @click=${()=>o?this.endSelect():this.startSelect()}>
        ${y("checklist")}<span>Multi select</span></button>
      ${F(n)?this.renderKinds(e,t):k}
      <label class="pk-search">
        ${y("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label="Search pages"
          @input=${a=>this.setSearch(a.target.value)} />
      </label>
    </div>`}renderKinds(e,t){let n=this.kindNow(),o=Ne(B(e,t,this.search));return u`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label="Show the pages on one kind of device" .value=${n}
        @change=${r=>this.setKind(r.target.value)}>
        ${o.map(r=>u`<option value=${r.key} ?selected=${r.key===n}>${r.label} (${r.count})</option>`)}
      </select>
    </label>`}renderTabs(e,t,n){return u`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${Re(e,t,this.colorOf).map(o=>u`<button type="button" role="tab" class="pk-tab ${o.id===n?"on":""}"
        style=${o.color===void 0?k:`--dc:${o.color}`} id=${`ap-tab-${o.id}`} aria-selected=${o.id===n?"true":"false"}
        title=${o.id===D?"Every page on every device":`The pages on ${o.label}`}
        @click=${()=>this.setFilter(o.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${y(o.kind===void 0?"grid":o.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${o.label}</span>
        <span class="pk-tab-count">${o.count}</span>
      </button>`)}
    </div>`}renderCard(e,t,n,o){let r=q(e,t,this.kindNow()),a=this.selecting,d=!a&&this.cardOfMenu(o)?.key===e.key,c=!a&&this.linksOn&&n.length>1,l=a&&this.selected.has(e.key),p=a?`${l?"Let":"Pick"} ${e.name}${l?" go":""}`:`Edit ${e.name} on ${r.device.name}`,g=h=>this.cardClick(h,e,t),b=h=>`--dc:${this.colorOf(h)??"var(--wa-line-strong)"}`;return u`<div class="ap-card ${d?"over":""} ${a?"picking":""} ${l?"picked":""}" role="listitem" data-card=${e.key}
      @click=${h=>{a&&g(h)}}>
      <span class="ap-strip" aria-hidden="true">${e.copies.map(h=>u`<i class=${h.hidden?"dim":""} style=${b(h.device.ownerId)}></i>`)}</span>
      <div class="ap-top">
        ${a?u`<input type="checkbox" class="pk-card-pick" .checked=${ie(l)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${p}
          @click=${h=>{h.stopPropagation(),this.pick(e,h.shiftKey)}} />`:k}
        <button type="button" class="ap-open" title=${p} tabindex=${a?"-1":"0"} @click=${g}>
          <b class="ap-name">${e.name}</b>
          <small class="ap-detail">${Ee(e)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${p} @click=${g}>
        ${this.renderThumb(r)}
      </button>
      <div class="ap-foot">
        <span class="ap-devs">${e.copies.map(h=>u`<span class="ap-dev ${h.hidden?"dim":""}" style=${b(h.device.ownerId)}
          title=${h.hidden?`On ${h.device.name}, hidden there`:`On ${h.device.name}`}>
          ${y(h.device.kind==="iphone"?"phone":"watch")}<span class="ap-dev-n">${h.device.name}</span>${h.hidden?u`<em>hidden</em>`:k}
        </span>`)}</span>
        ${c?u`<button type="button" class="ap-dev-open ${d?"on":""}" aria-expanded=${d?"true":"false"}
          title="Pick the devices this page is on"
          @click=${()=>d?this.closeDevices():this.openDevices(e)}>${y("phone")}<span>Devices</span>${y("chevron")}</button>`:k}
      </div>
      ${d?this.renderMenu(e,n):k}
    </div>`}renderMenu(e,t){let n=C(e,o=>E(o)?.dirty??!1)===void 0;return xe({name:e.name,places:Me(t,e),...n?{blocked:_}:{},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",colorOf:o=>this.colorOf(o),onToggle:o=>{this.toggle(e,o)},onDone:()=>this.closeDevices()})}renderBar(e,t){let n=e.filter(p=>this.selected.has(p.key)),o=n.length,r=this.bulkBusy!==void 0,a=o===0,d=e.length>0&&e.every(p=>this.selected.has(p.key)),c=t.length>1,l=r?void 0:this.bulkNote;return u`<div class="pk-bar" role="group" aria-label="Act on the picked pages">
      <span class="pk-bar-count" role="status">${this.bulkBusy??(a?"Pick a page to start.":`${o} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${r||e.length===0}
        title=${d?"Let the pages on screen go":"Pick every page the tab, the search and the Device menu have left"}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${l===void 0?k:u`<span class="pk-bar-said ${l.kind}">${l.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.bulkMenu==="delete"&&!a?this.renderDeleteAsk(n,t):u`${c&&this.linksOn?this.renderBarMenu("add",n,t,r||a):k}
          ${c?this.renderBarMenu("remove",n,t,r||a):k}
          <button type="button" class="ghost danger small" ?disabled=${r||a}
            title="Delete these pages from every device they are on"
            @click=${()=>this.openBulkMenu("delete")}>${y("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${r}
        title="Stop picking and go back to opening one page at a time"
        @click=${()=>this.endSelect()}>${y("check")}<span>Done</span></button>
    </div>`}renderBarMenu(e,t,n,o){let r=e==="add",a=this.bulkMenu===e&&!o,d=t.length,c=`${d} ${d===1?"page":"pages"}`,l=r?`Add ${c} to`:`Remove ${c} from`;return u`<span class="pk-bar-menu">
      <button type="button" class="ghost small ${a?"on":""}" aria-expanded=${a?"true":"false"} ?disabled=${o}
        title=${r?"Put these pages on another device, linked":"Take these pages off a device"}
        @click=${()=>this.openBulkMenu(e)}>${y(r?"plus":"layers")}<span>${r?"Add to\u2026":"Remove from\u2026"}</span></button>
      ${a?u`<div class="pk-bar-list" role="group" aria-label=${l}>
        <div class="pk-bar-head">${l}</div>
        ${n.map(p=>{let g=t.filter(A=>x(A,p.ownerId)!==void 0).length,b=R(p.ownerId),h=b?"unsaved edits":r?g===d?"has them all":void 0:g===0?"has none":void 0;return u`<button type="button" class="pk-bar-row" ?disabled=${h!==void 0}
            style=${`--dc:${this.colorOf(p.ownerId)??"var(--wa-muted)"}`}
            title=${b?"Its pages have unsaved edits. Save or discard them first.":`${r?"Add to":"Remove from"} ${p.name}`}
            @click=${()=>{this.runBulk(e,[p.ownerId])}}>
            ${y(p.kind==="iphone"?"phone":"watch")}
            <span class="pk-dup-name">${p.name}</span>
            ${h===void 0?r?k:u`<span class="pk-bar-row-n">${g} of ${d}</span>`:u`<span class="pk-bar-row-n">${h}</span>`}
          </button>`})}
        <div class="pk-bar-note">${r?"They go on linked: an edit on one device shows on all of them.":"A page this would leave on no device stays. Use Delete for those."}</div>
      </div>`:k}
    </span>`}renderDeleteAsk(e,t){let n=Ye(j(e,t,R),t);return u`<span class="pk-bar-ask" id="ap-del-ask"><b>${n.title}</b> ${n.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask"
        @click=${()=>{this.runBulk("delete")}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>this.closeBulkMenu()}>Cancel</button>`}renderThumb(e){let t=this.docs.get(e.device.ownerId),n=t===void 0?[e.page]:N(t),o=this.hassNow?.states,r=this.icons,a=et/X.width,d=lt(e.page,o,r),c=d.height*a,l=c>tt,p=g=>`${Math.round(g*100)/100}px`;return u`<span class="ap-pic ${l?"cut":""}" style=${`width:${p(et)};height:${p(Math.min(c,tt))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${p(-d.top*a)})`}>${Se({page:e.page,pages:n,screen:X,scale:a,...o===void 0?{}:{states:o},...r===void 0?{}:{icons:r}})}</span>
    </span>`}static{this.styles=[De,he,ye,J`
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
    /* The devices a page is on, one segment each in its color, along the
       card's top edge. A device that hides the page is fainter. */
    .ap-strip {
      position: absolute; top: 0; left: 0; right: 0; height: 3px; display: flex; gap: 2px;
      border-radius: 7px 7px 0 0; overflow: hidden; pointer-events: none;
    }
    .ap-strip > i { flex: 1; background: var(--dc); }
    .ap-strip > i.dim { opacity: .4; }
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
  `]}};v([I({attribute:!1})],f.prototype,"owners",2),v([I({attribute:!1})],f.prototype,"ownersReady",2),v([I({attribute:!1})],f.prototype,"phones",2),v([I({attribute:!1})],f.prototype,"icons",2),v([I({attribute:!1})],f.prototype,"iconsTick",2),v([I({attribute:!1})],f.prototype,"onOpen",2),v([w()],f.prototype,"docs",2),v([w()],f.prototype,"failed",2),v([w()],f.prototype,"readState",2),v([w()],f.prototype,"linksOn",2),v([w()],f.prototype,"filter",2),v([w()],f.prototype,"search",2),v([w()],f.prototype,"kind",2),v([w()],f.prototype,"menuAt",2),v([w()],f.prototype,"linking",2),v([w()],f.prototype,"devicesNote",2),v([w()],f.prototype,"selecting",2),v([w()],f.prototype,"selected",2),v([w()],f.prototype,"bulkMenu",2),v([w()],f.prototype,"bulkBusy",2),v([w()],f.prototype,"bulkNote",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",f);export{f as WaAllPages,lt as pageCrop};
