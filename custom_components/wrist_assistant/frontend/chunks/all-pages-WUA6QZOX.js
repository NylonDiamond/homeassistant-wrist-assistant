import{B as st,C as rt,N as ot,Q as dt,a as Qe,c as j,d as X,f as Ze,i as et,n as tt,o as nt,t as at,z as it}from"./chunk-DXWNTJER.js";import{d as Ve,e as He,f as Ue}from"./chunk-CMEYX2YK.js";import{b as ze,d as We,e as qe}from"./chunk-4GPB7T7O.js";import{A as Ae,C as Fe,b as Ne,d as Oe,g as Me,i as Ee,j as q,k as V,l as Le,m as H,u as K,v as _e,w as U,y as Be}from"./chunk-Z7YTC7Z2.js";import"./chunk-4E5AKPPV.js";import"./chunk-PEI2F5V4.js";import"./chunk-ZOJGMATP.js";import{b as je,c as Xe,k as Ye,o as Ge,u as Je}from"./chunk-2ZNWBXEQ.js";import"./chunk-RCG7YNUP.js";import"./chunk-V3JQMBXP.js";import"./chunk-QKO2AN2A.js";import{b as ye,c as $e,e as Re}from"./chunk-4C3X4OMP.js";import{c as Pe}from"./chunk-QUDR47OK.js";import{X as xe,z as be}from"./chunk-B2GPRRUP.js";import"./chunk-WDZJ6RME.js";import"./chunk-M4YGM7CY.js";import"./chunk-H5K3BM3D.js";import"./chunk-4NI3O7TX.js";import{e as Te}from"./chunk-UPANJPAF.js";import{k as Ce,l as z,m as Se,n as y,o as De,p as Ie,q as Ke,r as W}from"./chunk-ESIOP3D4.js";import{b as T}from"./chunk-NKLOQSX6.js";import{Eg as ve,Hg as F,Lg as we,Pg as me,b as fe,d as f,g as w,j as ke,k as R,l as m,mh as C}from"./chunk-VWIMYR2L.js";import"./chunk-Q6MTLD6E.js";import{a as v}from"./chunk-LO2NM3CE.js";var Wt="A page on more than one device is the same page: an edit shows on all of them.",qt="An info page is a status page: a list of live states that a tile, a menu slot or Siri opens.";function b(t,o=1){let e=t==="status_pages"?"info page":"page";return o===1?e:`${e}s`}function L(t){return t==="status_pages"?"an info page":"a page"}function ct(t,o="pages"){return`${t} ${b(o,t)} on your watches and iPhones. ${o==="status_pages"?qt:Wt}`}var Vt="This is its only device. Delete it in the page editor instead.",Ht="This is its only device. Delete it in the status pages editor instead.",Ut="Save or discard the edits to these pages first. A page goes on another device as it is saved.",jt="Save or discard the edits to these info pages first. An info page goes on another device as it is saved.";function ee(t){return t==="status_pages"?jt:Ut}var pt=t=>t.toUpperCase();function lt(t,o,e=new Map){let n=[],a=new Map,s=(i,r,d)=>{let l=a.get(i);if(l!==void 0){l.copies.some(c=>c.device.ownerId===r.device.ownerId)||l.copies.push(r);return}let p={key:i,...d(),copies:[r]};a.set(i,p),n.push(p)};for(let i of t){let r=o.get(i.ownerId);r!==void 0&&Te(r).forEach((d,l)=>{let p=y(d);if(p==="")return;let c=Oe(d),u=c===void 0?`page:${i.ownerId}:${pt(p)}`:`link:${c}`;s(u,{device:i,page:d,hidden:Ie(d),index:l},()=>{let g=W(d);return{kind:"pages",pageId:p,name:De(d),tiles:g?0:Se(d).length,rows:0,smart:g,...c===void 0?{}:{linkId:c}}})})}for(let i of t){let r=e.get(i.ownerId);r!==void 0&&j(r).forEach((d,l)=>{let p=X(d);if(p===""||et(d))return;let c=tt(d),u=c===void 0?`status:${i.ownerId}:${pt(p)}`:`status-link:${c}`;s(u,{device:i,page:d,hidden:!1,index:l},()=>({kind:"status_pages",pageId:p,name:nt(d),tiles:0,rows:Ze(d).length,smart:!1,...c===void 0?{}:{linkId:c}}))})}return n}function Y(t,o){return t.filter(e=>e.kind===o)}function ut(t){return[{key:"pages",label:"Pages",count:Y(t,"pages").length},{key:"status_pages",label:"Info pages",count:Y(t,"status_pages").length}]}function ht(t){return t==="status_pages"?"status_pages":"pages"}var O="all";function gt(t,o,e=()=>{}){return[{id:O,label:"All",count:o.length},...t.map(n=>{let a=e(n.ownerId);return{id:n.ownerId,label:n.name,kind:n.kind,...a===void 0?{}:{color:a},count:o.filter(s=>P(s,n.ownerId)!==void 0).length}})]}function te(t,o){return t!==void 0&&o.some(e=>e.ownerId===t)?t:O}function P(t,o){return t.copies.find(e=>e.device.ownerId===o)}function Z(t,o){return o==="all"||t.copies.some(e=>e.device.kind===o)}function ne(t){return t.some(o=>o.kind==="watch")&&t.some(o=>o.kind==="iphone")}function ft(t,o){return t!==void 0&&t!=="all"&&ne(o)?t:"all"}function kt(t){return[{key:"all",label:"All",count:t.length},{key:"watch",label:"Watches",count:t.filter(o=>Z(o,"watch")).length},{key:"iphone",label:"iPhones",count:t.filter(o=>Z(o,"iphone")).length}]}function G(t,o,e="",n="all"){let a=e.trim().toLowerCase(),s=(a===""?[...t]:t.filter(i=>i.name.toLowerCase().includes(a))).filter(i=>Z(i,n));return o===O?s:s.filter(i=>P(i,o)!==void 0).sort((i,r)=>P(i,o).index-P(r,o).index)}function ae(t,o,e="all"){return(o===O?void 0:P(t,o))??(e==="all"?void 0:t.copies.find(n=>n.device.kind===e))??t.copies.find(n=>n.device.kind==="watch")??t.copies[0]}function vt(t,o,e=new Set){let n=o.kind==="status_pages",a=!n&&o.copies.some(i=>Ke(i.page)),s=o.copies.length<=1;return t.map(i=>{let r=P(o,i.ownerId)!==void 0;if(!a&&!r&&e.has(i.ownerId))return{device:i,on:r,here:!1,stuck:V,tag:q};let d=a?Me:r&&s?n?Ht:Vt:void 0;return{device:i,on:r,here:!1,...d===void 0?{}:{stuck:d}}})}function _(t,o){return t.copies.find(e=>!o(e.device.ownerId,t.kind))?.device.ownerId}function wt(t){return t.kind==="status_pages"?`${t.rows} ${t.rows===1?"row":"rows"}`:t.smart?"Smart page":`${t.tiles} ${t.tiles===1?"tile":"tiles"}`}function mt(t,o,e,n="all",a="pages"){if(o.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";let s=b(a);if(e.trim()!=="")return`No ${s} has that name.`;if(n!=="all")return`No ${s} here is on ${n==="watch"?"a watch":"an iPhone"}.`;let i=o.find(r=>r.ownerId===t);return a==="status_pages"?i!==void 0?`No info pages on ${i.name} yet. The five starter pages every device has are not listed here.`:"No device has info pages of its own yet. Open a device's Status pages to make one.":i!==void 0?`No pages on ${i.name} yet.`:"No device has pages yet. Open a device's Pages to make one."}var I=t=>t.toUpperCase();function xt(t,o,e){return`${t} ${t===1?o:e}`}var Xt=t=>xt(t,"page","pages");function ie(t){return t.length<=3?K(t):`${t.slice(0,3).join(", ")} and ${t.length-3} more`}function yt(t,o){let e=new Set(t);return e.has(o)?e.delete(o):e.add(o),e}function $t(t,o,e,n){let a=new Set(t),s=o.indexOf(n),i=e===void 0?-1:o.indexOf(e);if(s<0)return a;if(i<0)return a.add(n),a;for(let r=Math.min(i,s);r<=Math.max(i,s);r++)a.add(o[r]);return a}function Pt(t,o){return new Set([...t,...o])}function Ct(t,o){let e=new Set(o);return new Set([...t].filter(n=>!e.has(n)))}function re(t,o){let e=new Set(o);return new Set([...t].filter(n=>e.has(n)))}function St(t,o){let e=new Set(t.flatMap(n=>n.copies.map(a=>`${a.device.ownerId}|${I(y(a.page))}`)));return new Set(o.filter(n=>n.copies.some(a=>e.has(`${a.device.ownerId}|${I(y(a.page))}`))).map(n=>n.key))}function oe(t){return t[0]?.kind??"pages"}function Dt(t,o,e){let n=t.find(a=>a.ownerId===o);n!==void 0?n.names.push(e):t.push({ownerId:o,names:[e]})}function It(t,o,e,n,a=new Map){let s=oe(t),i={kind:s,calls:[],already:0,taken:[],dirty:[],blocked:[]},r=o.filter(p=>n(p,s)?(i.dirty.push(p),!1):!0),d=new Map,l=(p,c)=>{let u=`${c}|${p}`,g=d.get(u);if(g===void 0){let h=c==="status_pages"?j(a.get(p)).map(X):(e.get(p)===void 0?[]:z(e.get(p))).map(y);g=new Set(h.map(I)),d.set(u,g)}return g};for(let p of t){let c=r.filter(h=>P(p,h)===void 0);if(i.already+=r.length-c.length,c.length===0)continue;let u=_(p,n);if(u===void 0){i.blocked.push(p.name);continue}let g=y(P(p,u).page);for(let h of c){let x=l(h,p.kind);if(x.has(I(g))){Dt(i.taken,h,p.name);continue}x.add(I(g));let $=i.calls.find(D=>D.source===u&&D.target===h&&D.kind===p.kind);$!==void 0?($.pageIds.push(g),$.names.push(p.name)):i.calls.push({source:u,target:h,kind:p.kind,pageIds:[g],names:[p.name]})}}return i}function Kt(t,o,e,n){let a=t.find(s=>s.ownerId===o&&s.kind===e);a!==void 0?a.pageIds.push(n):t.push({ownerId:o,kind:e,pageIds:[n]})}function Rt(t,o){t.includes(o)||t.push(o)}function Tt(t,o,e){let n={kind:oe(t),work:[],lastOnly:[],dirty:[],notThere:0},a=new Set(o);for(let s of t){let i=s.copies.filter(r=>a.has(r.device.ownerId));if(i.length===0){n.notThere++;continue}if(i.length===s.copies.length){n.lastOnly.push(s.name);continue}for(let r of i){let d=r.device.ownerId;e(d,s.kind)?Rt(n.dirty,d):Kt(n.work,d,s.kind,y(r.page))}}return n}function de(t,o,e){let n={kind:oe(t),work:[],pages:[],devices:[],dirty:[]},a=new Set;for(let s of t){n.pages.push({name:s.name,kind:s.kind,copies:s.copies.map(i=>({ownerId:i.device.ownerId,pageId:y(i.page)}))});for(let i of s.copies){let r=i.device.ownerId;a.add(r),e(r,s.kind)?Rt(n.dirty,r):Kt(n.work,r,s.kind,y(i.page))}}return n.devices=o.map(s=>s.ownerId).filter(s=>a.has(s)),n.work.sort((s,i)=>n.devices.indexOf(s.ownerId)-n.devices.indexOf(i.ownerId)),n}var B=(t,o)=>t.find(e=>e.ownerId===o)?.name??"a device";function Nt(t,o){let e=t.pages.length,n=t.devices.map(r=>B(o,r)),a=`Delete ${e} ${b(t.kind,e)} from ${xt(n.length,"device","devices")}?`,s=t.kind==="status_pages"?"":`, with the menu slots and complication taps there that open ${e===1?"it":"them"}`,i=[`${e===1?"It comes":"They come"} off ${K(n)}${s}. This cannot be undone.`];if(t.dirty.length>0){let r=t.dirty.map(d=>B(o,d));i.push(`${K(r)} ${r.length===1?"has":"have"} unsaved edits, so ${r.length===1?"its":"their"} copies stay.`)}return{title:a,body:i.join(" ")}}function pe(t,o){return{action:t,kind:o,done:[],gone:0,also:0,taken:[],dirty:[],blocked:[],lastOnly:[],failed:[],refs:[]}}function se(t,o,e){if(e===0)return;let n=t.done.find(a=>a.ownerId===o);n!==void 0?n.count+=e:t.done.push({ownerId:o,count:e})}function bt(t,o,e,n){let a=t.targets?.[o];if(a===void 0)return 0;let s=new Set(e.map(I)),i=(r,d)=>(r??[]).filter(l=>d!==n||!s.has(I(l))).length;return i(a.pages,"pages")+i(a.status_pages,"status_pages")}var Yt=new Set(["id_taken","not_found","system_page"]);async function Ot(t,o,e,n){let a=pe("add",o.kind);a.taken=o.taken.map(i=>({ownerId:i.ownerId,names:[...i.names]})),a.dirty=[...o.dirty],a.blocked=[...o.blocked];let s=(i,r,d)=>{T(r).code==="id_taken"&&d!==void 0?Dt(a.taken,i,d):a.failed.push({ownerId:i,message:`${d===void 0?"":`${d}: `}${U(r)}`})};for(let[i,r]of o.calls.entries()){n?.(`Adding to ${B(e,r.target)} (${i+1} of ${o.calls.length})\u2026`);try{let d=await t.link(r.source,r.pageIds,r.target,r.kind);se(a,r.target,r.pageIds.length),a.also+=bt(d,r.target,r.pageIds,r.kind)}catch(d){let l=T(d).code;if(r.pageIds.length===1){s(r.target,d,r.names[0]);continue}if(l===void 0||!Yt.has(l)){s(r.target,d);continue}for(let[p,c]of r.pageIds.entries())try{let u=await t.link(r.source,[c],r.target,r.kind);se(a,r.target,1),a.also+=bt(u,r.target,[c],r.kind)}catch(u){s(r.target,u,r.names[p])}}}return a}var Mt=(t,o)=>`${t}|${o}`;async function Et(t,o,e,n,a,s){let i=new Map;for(let[r,d]of o.entries()){s?.(`${a} ${B(n,d.ownerId)} (${r+1} of ${o.length})\u2026`);let l;try{l=await t.remove(d.ownerId,d.pageIds,d.kind)}catch(p){l={ok:!1,code:"unknown",message:T(p).message}}if(!l.ok){e.failed.push({ownerId:d.ownerId,message:l.message});continue}if(i.set(Mt(d.kind,d.ownerId),new Set(l.removed.map(I))),se(e,d.ownerId,l.removed.length),l.removed.length!==0)try{let p=await t.clearRefs(d.ownerId,l.removed,d.kind);(p?.kind==="warn"||p?.kind==="err")&&e.refs.push(d.ownerId)}catch{e.refs.push(d.ownerId)}}return i}async function Lt(t,o,e,n){let a=pe("remove",o.kind);return a.dirty=[...o.dirty],a.lastOnly=[...o.lastOnly],await Et(t,o.work,a,e,`Taking ${b(o.kind,2)} off`,n),a}async function _t(t,o,e,n){let a=pe("delete",o.kind);a.dirty=[...o.dirty];let s=await Et(t,o.work,a,e,"Deleting on",n);return a.gone=o.pages.filter(i=>i.copies.every(r=>s.get(Mt(i.kind,r.ownerId))?.has(I(r.pageId))??!1)).length,a}var Gt="Save or discard the edits in its page editor first.",Jt="Save or discard the edits in its status pages editor first.";function Bt(t,o,e=new Set){let n=p=>B(o,p),a=t.kind==="status_pages",s=p=>`${p} ${b(t.kind,p)}`,i=[],r=t.done.map(p=>`${s(p.count)} ${t.action==="add"?"to":t.action==="remove"?"off":"on"} ${n(p.ownerId)}`);if(t.action==="add"&&r.length>0){i.push(`Added ${K(r)}.`),t.also>0&&i.push(`Their tiles brought ${Xt(t.also)} more.`);let p=a?void 0:H(t.done.filter(c=>e.has(c.ownerId)).map(c=>n(c.ownerId)));p!==void 0&&i.push(p)}else t.action==="remove"&&r.length>0?i.push(`Took ${K(r)}.`):t.action==="delete"&&(t.gone>0||r.length>0)&&i.push(t.gone>0?`Deleted ${s(t.gone)}.`:`Deleted ${K(r)}.`);let d=i.length>0,l=!1;for(let p of t.taken){l=!0;let c=p.names.length===1?L(t.kind):b(t.kind,2);i.push(`Not added to ${n(p.ownerId)}: ${ie(p.names)}. It already has ${c} of its own with the same id.`)}t.blocked.length>0&&(l=!0,i.push(`Not added: ${ie(t.blocked)}. Every device ${t.blocked.length===1?"it is":"they are"} on has unsaved edits.`)),t.lastOnly.length>0&&(l=!0,i.push(`Kept ${ie(t.lastOnly)}: ${t.lastOnly.length===1?"it":"they"} would be left on no device. Use Delete for those.`));for(let p of t.dirty)l=!0,i.push(a?`Left ${n(p)} alone: its status pages have unsaved edits. ${Jt}`:`Left ${n(p)} alone: its pages have unsaved edits. ${Gt}`);for(let p of t.failed){l=!0;let c=t.action==="add"?`Not added to ${n(p.ownerId)}`:t.action==="remove"?`Not taken off ${n(p.ownerId)}`:`Not deleted on ${n(p.ownerId)}`;i.push(`${c}: ${p.message.replace(/\.$/,"")}.`)}if(t.refs.length>0&&(l=!0,i.push(`Could not clear the menu slots or complication taps that opened them on ${K(t.refs.map(n))}. Change those by hand.`)),!d&&!l){let p=b(t.kind,2);return{kind:"ok",text:t.action==="add"?`Those ${p} are on those devices already.`:t.action==="remove"?`None of those ${p} are on those devices.`:"Nothing was deleted."}}return{kind:l?d?"warn":"err":"ok",text:i.join(" ")}}function At(t){return{link:(o,e,n,a)=>F(t,o,e,[n],a),remove:(o,e,n)=>n==="status_pages"?st(t,o,e):Be(He(t),o,e),clearRefs:(o,e,n)=>n==="status_pages"?Promise.resolve(void 0):Ve(t,o,e)}}var J=200,ce=320,Ft=6,M=xe.screen;function Qt(t,o,e,n=M){if(W(t))return{top:0,height:n.height};let a=je(Xe(t,o),n);if(a.tiles.length===0)return{top:0,height:n.height};let i=Ye(t,1,a.topInset,e)!==w?0:Math.max(0,a.topInset+Math.min(...a.tiles.map(d=>d.y))-Ft),r=a.topInset+Math.max(...a.tiles.map(d=>d.y+d.height))+Ft;return{top:i,height:Math.max(1,r-i)}}var Zt=2e3,en=250,zt="wrist-assistant-panel.all-pages.v1",A;function Q(){if(A!==void 0)return A;let t={kind:"all",cards:"pages"};try{let o=window.localStorage.getItem(zt),e=o?JSON.parse(o):{};typeof e.filter=="string"&&(t.filter=e.filter),(e.kind==="watch"||e.kind==="iphone")&&(t.kind=e.kind),t.cards=ht(e.cards)}catch{}return A=t,t}function le(t){A={...Q(),...t};try{window.localStorage.setItem(zt,JSON.stringify(A))}catch{}}var tn=(t,o)=>t.toUpperCase()===o.toUpperCase(),N=(t,o="pages")=>(o==="status_pages"?at(t)?.dirty:ze(t)?.dirty)??!1,nn=["pages","status_pages"],k=class extends ke{constructor(){super(...arguments);this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.docs=new Map;this.statusDocs=new Map;this.facts=new Map;this.statusFacts=new Map;this.cardKind=Q().cards;this.failed=[];this.readState="idle";this.linksOn=!0;this.filter=Q().filter;this.search="";this.kind=Q().kind;this.linking=!1;this.newOpen=!1;this.selecting=!1;this.selected=new Set;this.hassDrawnAt=0;this.loadSeq=0;this.readSeq=new Map;this.reloadTimers=new Map;this.unsubscribers=[];this.subscribeSeq=0;this.colorsFor=$e();this.colorOf=e=>ye(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.bulkMenu!==void 0&&this.bulkBusy===void 0?(e.preventDefault(),this.closeBulkMenu()):this.menuAt!==void 0?(e.preventDefault(),this.closeDevices()):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))};this.onWindowPointerDown=e=>{let n=(this.bulkMenu==="add"||this.bulkMenu==="remove")&&this.bulkBusy===void 0;if(this.menuAt===void 0&&!n)return;let a=e.composedPath(),s=(...i)=>a.some(r=>r instanceof Element&&i.some(d=>r.classList.contains(d)));this.menuAt!==void 0&&!s("pe-dev-menu","ap-dev-open")&&this.closeDevices(),n&&!s("pk-bar-menu")&&this.closeBulkMenu()}}get hass(){return this.hassNow}set hass(e){let n=this.hassNow===void 0;this.hassNow=e;let a=Date.now();(n||a-this.hassDrawnAt>=Zt)&&(this.hassDrawnAt=a,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.deviceSig=void 0,this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.endSubscriptions();for(let e of this.reloadTimers.values())window.clearTimeout(e);this.reloadTimers.clear(),this.loadSeq++,this.deviceSig=void 0}willUpdate(e){let n=this.devices,a=n.map(s=>s.ownerId).join(",");this.hassNow!==void 0&&this.isConnected&&a!==this.deviceSig&&(this.deviceSig=a,this.loadAll(),this.startSubscriptions(n))}waitingDevices(e=this.cardKind){return Le(this.owners,e==="status_pages"?this.statusFacts:this.facts)}freeDevices(){return new Set([...this.facts].filter(([,e])=>e.free).map(([e])=>e))}get devices(){return Ne(this.owners,this.phones)}get cards(){let e=this.devices,n=this.cardsMemo;if(n!==void 0&&n.docs===this.docs&&n.statusDocs===this.statusDocs&&n.devices.length===e.length&&n.devices.every((s,i)=>s.ownerId===e[i].ownerId&&s.name===e[i].name))return n.cards;let a=lt(e,this.docs,this.statusDocs);return this.cardsMemo={docs:this.docs,statusDocs:this.statusDocs,devices:e,cards:a},a}get kindCards(){return Y(this.cards,this.cardKind)}async loadAll(){let e=this.hassNow;if(!e)return;let n=++this.loadSeq,a=this.devices;this.readState==="idle"&&(this.readState="loading");let s=we(e).then(()=>!0,g=>T(g).code!=="unknown_command"),[i,r]=await Promise.all(nn.map(g=>Promise.all(a.map(h=>this.readOne(e,h.ownerId,g))))),d=await s;if(n!==this.loadSeq)return;let l=new Set,p=(g,h,x)=>{let $=new Map,D=new Map;for(let[S,E,ue]of g){if(E==="failed"){l.add(S);let he=h.get(S);he!==void 0&&$.set(S,he);let ge=x.get(S);ge!==void 0&&D.set(S,ge)}else E!==void 0&&$.set(S,E);ue!==void 0&&D.set(S,ue)}return{docs:$,facts:D}},c=p(i,this.docs,this.facts),u=p(r,this.statusDocs,this.statusFacts);this.docs=c.docs,this.facts=c.facts,this.statusDocs=u.docs,this.statusFacts=u.facts,this.failed=a.map(g=>g.ownerId).filter(g=>l.has(g)),this.linksOn=d,this.readState="ready"}async readOne(e,n,a){try{let s=await ve(e,n,a),i=s.revision<=0?void 0:a==="status_pages"?Qe(s.document):Ce(s.document);return[n,i,Ee(s)]}catch{return[n,"failed"]}}reloadOne(e,n){let a=`${n}|${e}`,s=this.reloadTimers.get(a);s!==void 0&&window.clearTimeout(s),this.reloadTimers.set(a,window.setTimeout(()=>{this.reloadTimers.delete(a);let i=this.hassNow;if(!i||!this.isConnected)return;let r=(this.readSeq.get(a)??0)+1;this.readSeq.set(a,r);let d=this.loadSeq;this.readOne(i,e,n).then(([,l,p])=>{if(r!==this.readSeq.get(a)||d!==this.loadSeq||l==="failed")return;if(n==="status_pages"){let u=new Map(this.statusDocs);l===void 0?u.delete(e):u.set(e,l),this.statusDocs=u,p!==void 0&&(this.statusFacts=new Map(this.statusFacts).set(e,p));return}let c=new Map(this.docs);l===void 0?c.delete(e):c.set(e,l),this.docs=c,p!==void 0&&(this.facts=new Map(this.facts).set(e,p))})},en))}startSubscriptions(e){this.endSubscriptions();let n=this.hassNow;if(!n)return;let a=this.subscribeSeq;for(let s of e){let i=s.ownerId;me(n,i,r=>{a===this.subscribeSeq&&(r.kind==="pages"||r.kind==="status_pages")&&this.reloadOne(i,r.kind)}).then(r=>{a===this.subscribeSeq?this.unsubscribers.push(r):Promise.resolve(r()).catch(()=>{})},()=>{})}}endSubscriptions(){this.subscribeSeq++;for(let e of this.unsubscribers)Promise.resolve(e()).catch(()=>{});this.unsubscribers=[]}setFilter(e){this.filter=e,le({filter:e}),this.closeDevices(),this.pruneSelected()}setSearch(e){this.search=e,this.pruneSelected()}setKind(e){this.kind=e,le({kind:e}),this.closeDevices(),this.pruneSelected()}setCardKind(e){e===this.cardKind||this.bulkBusy!==void 0||(this.cardKind=e,le({cards:e}),this.closeDevices(),this.selected=new Set,this.anchor=void 0,this.bulkMenu=void 0,this.bulkNote=void 0,this.newOpen=!1)}newPage(e){this.newOpen=!1,qe(e.ownerId),this.onOpen?.(e.ownerId,e.kind)}open(e,n){let a=ae(e,n,this.kindNow()),s=y(a.page);if(e.kind==="status_pages"){it(a.device.ownerId,s),this.onOpen?.(a.device.ownerId,a.device.kind,"status_pages");return}We(a.device.ownerId,{pageId:s}),this.onOpen?.(a.device.ownerId,a.device.kind)}cardOfMenu(e){let n=this.menuAt;if(n!==void 0)return e.find(a=>{let s=P(a,n.ownerId);return s!==void 0&&tn(y(s.page),n.pageId)})}openDevices(e){let n=e.copies[0];this.menuAt={ownerId:n.device.ownerId,pageId:y(n.page)},this.devicesNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.menuAt=void 0,this.devicesNote=void 0}async toggle(e,n){let a=this.hassNow;if(!a||this.linking||n.stuck!==void 0)return;let s=n.device.ownerId,i=n.device.name,r=e.pageId,d=e.kind==="status_pages",l;this.linking=!0,this.devicesNote=void 0;try{if(n.on){let c=y(P(e,s).page),u=d?await rt(a,s,c,i):await Ue(a,s,c,i);l=u===void 0?{kind:"ok",text:`Taken off ${i}.`}:{kind:"err",text:u}}else{let c=_(e,N);if(c===void 0)l={kind:"warn",text:ee(e.kind)};else{let u=y(P(e,c).page),g=await F(a,c,[u],[s],e.kind),h=d?void 0:_e(g,s,[u],this.docs.get(c)),x=!d&&this.facts.get(s)?.free===!0?H([i]):void 0;l={kind:"ok",text:[`Added to ${i}.`,h,x].filter($=>$!==void 0).join(" ")}}}}catch(c){l={kind:"err",text:`Not added. ${U(c)}`}}finally{this.linking=!1}let p=n.on?e.copies.find(c=>c.device.ownerId!==s):e.copies[0];p!==void 0&&this.menuAt!==void 0&&(this.menuAt={ownerId:p.device.ownerId,pageId:r}),this.devicesNote=l,await this.loadAll()}kindNow(){return ft(this.kind,this.devices)}shownNow(){return G(this.kindCards,te(this.filter,this.devices),this.search,this.kindNow())}pickedCards(){return this.shownNow().filter(e=>this.selected.has(e.key))}pruneSelected(){this.selected.size!==0&&(this.selected=re(this.selected,this.shownNow().map(e=>e.key)))}startSelect(){this.selecting=!0,this.closeDevices(),this.bulkNote=void 0}endSelect(){this.bulkBusy===void 0&&(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.bulkMenu=void 0,this.bulkNote=void 0)}cardClick(e,n,a){let s=e.metaKey||e.ctrlKey;if(!this.selecting&&!s){this.open(n,a);return}e.preventDefault(),e.stopPropagation(),this.pick(n,e.shiftKey&&this.selecting&&!s)}pick(e,n){this.bulkBusy===void 0&&(this.selecting||this.startSelect(),this.selected=n?$t(this.selected,this.shownNow().map(a=>a.key),this.anchor,e.key):yt(this.selected,e.key),this.anchor=e.key,this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0))}selectShown(e){if(this.bulkBusy!==void 0)return;let n=this.shownNow().map(a=>a.key);this.selected=e?Pt(this.selected,n):Ct(this.selected,n),this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0)}openBulkMenu(e){if(this.bulkBusy===void 0){if(this.bulkMenu===e){this.closeBulkMenu();return}this.bulkMenu=e,this.bulkNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar")?.querySelector(e==="delete"?".pk-bar-cancel":".pk-bar-row:not(:disabled)")?.focus()})}}closeBulkMenu(){this.bulkMenu=void 0}async runBulk(e,n=[]){let a=this.hassNow;if(!a||this.bulkBusy!==void 0)return;let s=this.devices,i=this.pickedCards();if(i.length===0)return;let r=s.map(c=>c.ownerId).filter(c=>n.includes(c));if(e!=="delete"&&r.length===0)return;let d=At(a),l=c=>{this.bulkBusy=c};this.bulkMenu=void 0,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let p;try{let c;e==="add"?c=await Ot(d,It(i,r,this.docs,N,this.statusDocs),s,l):e==="remove"?c=await Lt(d,Tt(i,r,N),s,l):c=await _t(d,de(i,s,N),s,l),p=Bt(c,s,this.freeDevices())}catch(c){p={kind:"err",text:T(c).message}}this.bulkBusy=`Reading the ${b(this.cardKind,2)} again\u2026`;try{await this.loadAll()}finally{this.bulkBusy=void 0}this.selected=re(St(i,this.kindCards),this.shownNow().map(c=>c.key)),this.anchor=void 0,this.bulkNote=p}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return f`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let n=this.cards,a=this.cardKind,s=this.kindCards,i=te(this.filter,e),r=this.kindNow(),d=G(s,i,this.search,r),l=this.readState!=="ready"&&n.length===0,p=this.failed.map(x=>e.find($=>$.ownerId===x)?.name).filter(x=>x!==void 0),c=e.length>1,u=b(a),g=b(a,2),h=this.selecting?`Click ${g} to pick them. Shift+click picks every ${u} between two.`:`Click ${L(a)} to edit it.${this.linksOn&&e.length>1?" Devices on a card puts it on another watch or iPhone.":""}`;return f`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Pages</h1>
          <p class="ap-lead">${l?"Reading every device's pages\u2026":ct(s.length,a)}</p>
        </div>
        ${e.length===0||a==="status_pages"?w:this.renderNew(i,e)}
      </div>
      ${p.length===0?w:f`<p class="ap-warn" role="status">Could not read the pages of ${p.join(", ")}. They show as last read.</p>`}
      <div class="pk-surface pk-page" role="region" aria-label="Your pages">
        <div class="pk-pin">
          ${this.renderHead(n,s,i,e)}
          ${c?this.renderTabs(e,s,i):w}
          ${this.selecting?this.renderBar(d,e):w}
        </div>
        <div class="pk-body" role=${c?"tabpanel":w} aria-labelledby=${c?`ap-tab-${i}`:w}>
          ${l?f`<p class="ap-empty">Reading every device's pages…</p>`:d.length===0?f`<p class="ap-empty">${mt(i,e,this.search,r,a)}</p>`:f`<div class="ap-grid" role="list">${d.map(x=>this.renderCard(x,i,e,s))}</div>`}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${h}</span></div>
      </div>
    </div></div>`}renderHead(e,n,a,s){let i=this.selecting,r=this.bulkBusy!==void 0,d=b(this.cardKind,2);return f`<div class="pk-head">
      ${this.renderCardKinds(e)}
      <button type="button" class="pk-pick-btn ${i?"on":""}" aria-pressed=${i?"true":"false"}
        title=${i?`Back to opening one ${b(this.cardKind)} at a time`:`Pick several ${d} to add, remove or delete together`}
        ?disabled=${r} @click=${()=>i?this.endSelect():this.startSelect()}>
        ${C("checklist")}<span>Multi select</span></button>
      ${ne(s)?this.renderKinds(n,a):w}
      <label class="pk-search">
        ${C("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${d}`}
          @input=${l=>this.setSearch(l.target.value)} />
      </label>
    </div>`}renderCardKinds(e){let n=this.bulkBusy!==void 0;return f`<span class="pk-seg ap-kinds" role="group" aria-label="Show pages or info pages">
      ${ut(e).map(a=>f`<button type="button" class="pk-seg-btn ${a.key===this.cardKind?"on":""}"
        aria-pressed=${a.key===this.cardKind?"true":"false"} ?disabled=${n}
        title=${a.key==="status_pages"?"Info pages are the status pages: lists of live states a tile, a menu slot or Siri opens":"The pages you swipe between"}
        @click=${()=>this.setCardKind(a.key)}>${a.label}<span class="ap-kind-n">${a.count}</span></button>`)}
    </span>`}renderNew(e,n){let a=n.find(i=>i.ownerId===e)??(n.length===1?n[0]:void 0),s=this.newOpen&&a===void 0;return f`<div class="ap-new" @keydown=${i=>{i.key==="Escape"&&s&&(i.stopPropagation(),this.newOpen=!1)}}
      @focusout=${i=>{let r=i.relatedTarget;s&&!(r instanceof Node&&i.currentTarget.contains(r))&&(this.newOpen=!1)}}>
      <button type="button" class="ap-new-btn" aria-haspopup=${a===void 0?"menu":w}
        aria-expanded=${a===void 0?s?"true":"false":w}
        title=${a===void 0?"Pick the device to add a page on":`Add a page on ${a.name}`}
        @click=${()=>a===void 0?this.newOpen=!this.newOpen:this.newPage(a)}>
        ${C("plus")}<span>New page</span></button>
      ${s?f`<div class="ap-new-menu" role="menu" aria-label="Add a page on">
        <div class="ap-new-h">Add a page on</div>
        ${n.map(i=>f`<button type="button" class="ap-new-row" role="menuitem"
          style=${`--dc:${this.colorOf(i.ownerId)??"var(--wa-line-strong)"}`} @click=${()=>this.newPage(i)}>
          ${C(i.kind==="iphone"?"phone":"watch")}<span>${i.name}</span></button>`)}
      </div>`:w}
    </div>`}renderKinds(e,n){let a=this.kindNow(),s=kt(G(e,n,this.search));return f`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label="Show the pages on one kind of device" .value=${a}
        @change=${i=>this.setKind(i.target.value)}>
        ${s.map(i=>f`<option value=${i.key} ?selected=${i.key===a}>${i.label} (${i.count})</option>`)}
      </select>
    </label>`}renderTabs(e,n,a){return f`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${gt(e,n,this.colorOf).map(s=>f`<button type="button" role="tab" class="pk-tab ${s.id===a?"on":""}"
        style=${s.color===void 0?w:`--dc:${s.color}`} id=${`ap-tab-${s.id}`} aria-selected=${s.id===a?"true":"false"}
        title=${s.id===O?`Every ${b(this.cardKind)} on every device`:`The ${b(this.cardKind,2)} on ${s.label}`}
        @click=${()=>this.setFilter(s.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${C(s.kind===void 0?"grid":s.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${s.label}</span>
        <span class="pk-tab-count">${s.count}</span>
      </button>`)}
    </div>`}renderCard(e,n,a,s){let i=ae(e,n,this.kindNow()),r=this.selecting,d=!r&&this.cardOfMenu(s)?.key===e.key,l=!r&&this.linksOn&&a.length>1,p=r&&this.selected.has(e.key),c=r?`${p?"Let":"Pick"} ${e.name}${p?" go":""}`:`Edit ${e.name} on ${i.device.name}`,u=h=>this.cardClick(h,e,n),g=h=>`--dc:${this.colorOf(h)??"var(--wa-line-strong)"}`;return f`<div class="ap-card ${d?"over":""} ${r?"picking":""} ${p?"picked":""}" role="listitem" data-card=${e.key}
      @click=${h=>{r&&u(h)}}>
      <div class="ap-top">
        ${r?f`<input type="checkbox" class="pk-card-pick" .checked=${be(p)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${c}
          @click=${h=>{h.stopPropagation(),this.pick(e,h.shiftKey)}} />`:w}
        <button type="button" class="ap-open" title=${c} tabindex=${r?"-1":"0"} @click=${u}>
          <b class="ap-name">${e.name}</b>
          <small class="ap-detail">${wt(e)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${c} @click=${u}>
        ${e.kind==="status_pages"?this.renderStatusThumb(i):this.renderThumb(i)}
      </button>
      <div class="ap-foot">
        <span class="ap-devs">${e.copies.map(h=>f`<span class="ap-dev ${h.hidden?"dim":""}" style=${g(h.device.ownerId)}
          title=${h.hidden?`On ${h.device.name}, hidden there`:`On ${h.device.name}`}>
          ${C(h.device.kind==="iphone"?"phone":"watch")}<span class="ap-dev-n">${h.device.name}</span>${h.hidden?f`<em>hidden</em>`:w}
        </span>`)}</span>
        ${l?f`<button type="button" class="ap-dev-open ${d?"on":""}" aria-expanded=${d?"true":"false"}
          title=${`Pick the devices this ${b(e.kind)} is on`}
          @click=${()=>d?this.closeDevices():this.openDevices(e)}>${C("phone")}<span>Devices</span>${C("chevron")}</button>`:w}
      </div>
      ${d?this.renderMenu(e,a):w}
    </div>`}renderMenu(e,n){let a=_(e,N)===void 0;return Ae({name:e.name,places:vt(n,e,this.waitingDevices(e.kind)),...a?{blocked:ee(e.kind)}:{},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",colorOf:s=>this.colorOf(s),onToggle:s=>{this.toggle(e,s)},onDone:()=>this.closeDevices()})}renderBar(e,n){let a=e.filter(g=>this.selected.has(g.key)),s=a.length,i=this.bulkBusy!==void 0,r=s===0,d=e.length>0&&e.every(g=>this.selected.has(g.key)),l=n.length>1,p=i?void 0:this.bulkNote,c=b(this.cardKind),u=b(this.cardKind,2);return f`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${u}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(r?`Pick ${L(this.cardKind)} to start.`:`${s} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${i||e.length===0}
        title=${d?`Let the ${u} on screen go`:`Pick every ${c} the tab, the search and the Device menu have left`}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${p===void 0?w:f`<span class="pk-bar-said ${p.kind}">${p.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.bulkMenu==="delete"&&!r?this.renderDeleteAsk(a,n):f`${l&&this.linksOn?this.renderBarMenu("add",a,n,i||r):w}
          ${l?this.renderBarMenu("remove",a,n,i||r):w}
          <button type="button" class="ghost danger small" ?disabled=${i||r}
            title=${`Delete these ${u} from every device they are on`}
            @click=${()=>this.openBulkMenu("delete")}>${C("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${i}
        title=${`Stop picking and go back to opening one ${c} at a time`}
        @click=${()=>this.endSelect()}>${C("check")}<span>Done</span></button>
    </div>`}renderBarMenu(e,n,a,s){let i=e==="add",r=this.bulkMenu===e&&!s,d=n.length,l=this.cardKind,p=b(l,2),c=`${d} ${b(l,d)}`,u=i?`Add ${c} to`:`Remove ${c} from`,g=i?this.waitingDevices(l):new Set;return f`<span class="pk-bar-menu">
      <button type="button" class="ghost small ${r?"on":""}" aria-expanded=${r?"true":"false"} ?disabled=${s}
        title=${i?`Put these ${p} on another device, linked`:`Take these ${p} off a device`}
        @click=${()=>this.openBulkMenu(e)}>${C(i?"plus":"layers")}<span>${i?"Add to\u2026":"Remove from\u2026"}</span></button>
      ${r?f`<div class="pk-bar-list" role="group" aria-label=${u}>
        <div class="pk-bar-head">${u}</div>
        ${a.map(h=>{let x=n.filter(E=>P(E,h.ownerId)!==void 0).length,$=N(h.ownerId,l),D=g.has(h.ownerId),S=$?"unsaved edits":D?q:i?x===d?"has them all":void 0:x===0?"has none":void 0;return f`<button type="button" class="pk-bar-row" ?disabled=${S!==void 0}
            style=${`--dc:${this.colorOf(h.ownerId)??"var(--wa-muted)"}`}
            title=${$?`Its ${l==="status_pages"?"status pages":"pages"} have unsaved edits. Save or discard them first.`:D?V:`${i?"Add to":"Remove from"} ${h.name}`}
            @click=${()=>{this.runBulk(e,[h.ownerId])}}>
            ${C(h.kind==="iphone"?"phone":"watch")}
            <span class="pk-dup-name">${h.name}</span>
            ${S===void 0?i?w:f`<span class="pk-bar-row-n">${x} of ${d}</span>`:f`<span class="pk-bar-row-n">${S}</span>`}
          </button>`})}
        <div class="pk-bar-note">${i?"They go on linked: an edit on one device shows on all of them.":`${l==="status_pages"?"An info page":"A page"} this would leave on no device stays. Use Delete for those.`}</div>
      </div>`:w}
    </span>`}renderDeleteAsk(e,n){let a=Nt(de(e,n,N),n);return f`<span class="pk-bar-ask" id="ap-del-ask"><b>${a.title}</b> ${a.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask"
        @click=${()=>{this.runBulk("delete")}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>this.closeBulkMenu()}>Cancel</button>`}renderThumb(e){let n=this.docs.get(e.device.ownerId),a=n===void 0?[e.page]:z(n),s=this.hassNow?.states,i=this.icons,r=J/M.width,d=Qt(e.page,s,i),l=d.height*r,p=l>ce,c=u=>`${Math.round(u*100)/100}px`;return f`<span class="ap-pic ${p?"cut":""}" style=${`width:${c(J)};height:${c(Math.min(l,ce))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${c(-d.top*r)})`}>${Ge({page:e.page,pages:a,screen:M,scale:r,...s===void 0?{}:{states:s},...i===void 0?{}:{icons:i}})}</span>
    </span>`}renderStatusThumb(e){let n=this.hassNow,a=J/M.width,s=d=>`${Math.round(d*100)/100}px`,r=(Array.isArray(e.page.rows)?e.page.rows.length:0)>5;return f`<span class="ap-pic ap-pic-status ${r?"cut":""}" style=${`width:${s(J)};height:${s(Math.min(M.height*a,ce))}`}>
      <span class="ap-pic-in">${n===void 0?w:ot({page:e.page,hass:n,icons:this.icons??Pe,screen:M,scale:a})}</span>
    </span>`}static{this.styles=[Je,Re,Fe,dt,fe`
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
    .pk-seg-btn:disabled { opacity: .45; cursor: default; }
    /* The kind chips' counts, as quiet as the device tabs'. */
    .ap-kind-n { font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
    /* An info page's picture: the watch's black screen, one screen tall. */
    .ap-pic-status .sp-screen { pointer-events: none; }
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
  `]}};v([R({attribute:!1})],k.prototype,"owners",2),v([R({attribute:!1})],k.prototype,"ownersReady",2),v([R({attribute:!1})],k.prototype,"phones",2),v([R({attribute:!1})],k.prototype,"icons",2),v([R({attribute:!1})],k.prototype,"iconsTick",2),v([R({attribute:!1})],k.prototype,"onOpen",2),v([m()],k.prototype,"docs",2),v([m()],k.prototype,"statusDocs",2),v([m()],k.prototype,"facts",2),v([m()],k.prototype,"statusFacts",2),v([m()],k.prototype,"cardKind",2),v([m()],k.prototype,"failed",2),v([m()],k.prototype,"readState",2),v([m()],k.prototype,"linksOn",2),v([m()],k.prototype,"filter",2),v([m()],k.prototype,"search",2),v([m()],k.prototype,"kind",2),v([m()],k.prototype,"menuAt",2),v([m()],k.prototype,"linking",2),v([m()],k.prototype,"devicesNote",2),v([m()],k.prototype,"newOpen",2),v([m()],k.prototype,"selecting",2),v([m()],k.prototype,"selected",2),v([m()],k.prototype,"bulkMenu",2),v([m()],k.prototype,"bulkBusy",2),v([m()],k.prototype,"bulkNote",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",k);export{k as WaAllPages,Qt as pageCrop};
