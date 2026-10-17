import{a as m,b as N,c as De,d as Ie,e as H,f as Ce,g as Re,h as Me,i as Ne,j as V,k as R,l as Oe,m as Te,n as Ke,o as W,p as U,q as Be,r as B,s as Le,t as Ee,u as Fe}from"./chunk-CC2LPHOF.js";import{g as je,h as Ye,p as Ge,t as Je,z as Xe}from"./chunk-GSL3QG3N.js";import"./chunk-QTSMRHHT.js";import"./chunk-QKO2AN2A.js";import{C as at,b as Qe,h as Ze,j as et,l as tt,m as nt,n as it,z as st}from"./chunk-T4PW2RBD.js";import{m as ke,o as ve,p as we}from"./chunk-OHKOYYEP.js";import{e as He,f as Ve,g as Ue}from"./chunk-K7D4T2ZF.js";import{A as We,B as ze,y as qe}from"./chunk-Y56GBJTG.js";import{B as _e,D as Ae,b as me,i as be,j as ye,k as $e,l as xe,m as F,u as C,v as Pe,x as q,z as Se}from"./chunk-OJUGNOOF.js";import"./chunk-PEI2F5V4.js";import"./chunk-ZOJGMATP.js";import"./chunk-LBSU7WWI.js";import"./chunk-SAWBVZMM.js";import"./chunk-4NI3O7TX.js";import{b as le,c as pe,e as fe}from"./chunk-K4UWPMSJ.js";import{c as he}from"./chunk-UYXASAN6.js";import{X as ce,z as de}from"./chunk-5FCCUCCW.js";import{Eg as ae,Hg as _,Lg as oe,Pg as re,b as ie,d as g,g as w,j as se,k as I,l as $,qh as P}from"./chunk-KWDEJLUK.js";import"./chunk-UPANJPAF.js";import{k as ue,l as A,n as x,r as ge}from"./chunk-ESIOP3D4.js";import{Va as M}from"./chunk-2ZMALKUC.js";import{a as k}from"./chunk-LO2NM3CE.js";var S=s=>s.toUpperCase();function rt(s,d,e){return`${s} ${s===1?d:e}`}var Rt=s=>rt(s,"page","pages");function j(s){return s.length<=3?C(s):`${s.slice(0,3).join(", ")} and ${s.length-3} more`}function dt(s,d){let e=new Set(s);return e.has(d)?e.delete(d):e.add(d),e}function ct(s,d,e,n){let t=new Set(s),i=d.indexOf(n),a=e===void 0?-1:d.indexOf(e);if(i<0)return t;if(a<0)return t.add(n),t;for(let o=Math.min(a,i);o<=Math.max(a,i);o++)t.add(d[o]);return t}function lt(s,d){return new Set([...s,...d])}function pt(s,d){let e=new Set(d);return new Set([...s].filter(n=>!e.has(n)))}function G(s,d){let e=new Set(d);return new Set([...s].filter(n=>e.has(n)))}function ht(s,d){let e=new Set(s.flatMap(n=>n.copies.map(t=>`${t.device.ownerId}|${S(x(t.page))}`)));return new Set(d.filter(n=>n.copies.some(t=>e.has(`${t.device.ownerId}|${S(x(t.page))}`))).map(n=>n.key))}function J(s){return s[0]?.kind??"pages"}function ut(s,d,e){let n=s.find(t=>t.ownerId===d);n!==void 0?n.names.push(e):s.push({ownerId:d,names:[e]})}function gt(s,d,e,n,t=new Map){let i=J(s),a={kind:i,calls:[],already:0,taken:[],dirty:[],blocked:[]},o=d.filter(r=>n(r,i)?(a.dirty.push(r),!1):!0),c=new Map,l=(r,p)=>{let h=`${p}|${r}`,v=c.get(h);if(v===void 0){let u=p==="status_pages"?ve(t.get(r)).map(we):(e.get(r)===void 0?[]:A(e.get(r))).map(x);v=new Set(u.map(S)),c.set(h,v)}return v};for(let r of s){let p=o.filter(u=>R(r,u)===void 0);if(a.already+=o.length-p.length,p.length===0)continue;let h=B(r,n);if(h===void 0){a.blocked.push(r.name);continue}let v=x(R(r,h).page);for(let u of p){let b=l(u,r.kind);if(b.has(S(v))){ut(a.taken,u,r.name);continue}b.add(S(v));let y=a.calls.find(D=>D.source===h&&D.target===u&&D.kind===r.kind);y!==void 0?(y.pageIds.push(v),y.names.push(r.name)):a.calls.push({source:h,target:u,kind:r.kind,pageIds:[v],names:[r.name]})}}return a}function ft(s,d,e,n){let t=s.find(i=>i.ownerId===d&&i.kind===e);t!==void 0?t.pageIds.push(n):s.push({ownerId:d,kind:e,pageIds:[n]})}function kt(s,d){s.includes(d)||s.push(d)}function vt(s,d,e){let n={kind:J(s),work:[],lastOnly:[],dirty:[],notThere:0},t=new Set(d);for(let i of s){let a=i.copies.filter(o=>t.has(o.device.ownerId));if(a.length===0){n.notThere++;continue}if(a.length===i.copies.length){n.lastOnly.push(i.name);continue}for(let o of a){let c=o.device.ownerId;e(c,i.kind)?kt(n.dirty,c):ft(n.work,c,i.kind,x(o.page))}}return n}function X(s,d,e){let n={kind:J(s),work:[],pages:[],devices:[],dirty:[]},t=new Set;for(let i of s){n.pages.push({name:i.name,kind:i.kind,copies:i.copies.map(a=>({ownerId:a.device.ownerId,pageId:x(a.page)}))});for(let a of i.copies){let o=a.device.ownerId;t.add(o),e(o,i.kind)?kt(n.dirty,o):ft(n.work,o,i.kind,x(a.page))}}return n.devices=d.map(i=>i.ownerId).filter(i=>t.has(i)),n.work.sort((i,a)=>n.devices.indexOf(i.ownerId)-n.devices.indexOf(a.ownerId)),n}var L=(s,d)=>s.find(e=>e.ownerId===d)?.name??"a device";function wt(s,d){let e=s.pages.length,n=s.devices.map(o=>L(d,o)),t=`Delete ${e} ${m(s.kind,e)} from ${rt(n.length,"device","devices")}?`,i=s.kind==="status_pages"?`, with the menu slots there that show ${e===1?"it":"them"}`:`, with the menu slots and complication taps there that open ${e===1?"it":"them"}`,a=[`${e===1?"It comes":"They come"} off ${C(n)}${i}. This cannot be undone.`];if(s.dirty.length>0){let o=s.dirty.map(c=>L(d,c));a.push(`${C(o)} ${o.length===1?"has":"have"} unsaved edits, so ${o.length===1?"its":"their"} copies stay.`)}return{title:t,body:a.join(" ")}}function Q(s,d){return{action:s,kind:d,done:[],gone:0,also:0,taken:[],dirty:[],blocked:[],lastOnly:[],failed:[],refs:[]}}function Y(s,d,e){if(e===0)return;let n=s.done.find(t=>t.ownerId===d);n!==void 0?n.count+=e:s.done.push({ownerId:d,count:e})}function ot(s,d,e,n){let t=s.targets?.[d];if(t===void 0)return 0;let i=new Set(e.map(S)),a=(o,c)=>(o??[]).filter(l=>c!==n||!i.has(S(l))).length;return a(t.pages,"pages")+a(t.status_pages,"status_pages")}var Mt=new Set(["id_taken","not_found","system_page"]);async function mt(s,d,e,n){let t=Q("add",d.kind);t.taken=d.taken.map(a=>({ownerId:a.ownerId,names:[...a.names]})),t.dirty=[...d.dirty],t.blocked=[...d.blocked];let i=(a,o,c)=>{M(o).code==="id_taken"&&c!==void 0?ut(t.taken,a,c):t.failed.push({ownerId:a,message:`${c===void 0?"":`${c}: `}${q(o)}`})};for(let[a,o]of d.calls.entries()){n?.(`Adding to ${L(e,o.target)} (${a+1} of ${d.calls.length})\u2026`);try{let c=await s.link(o.source,o.pageIds,o.target,o.kind);Y(t,o.target,o.pageIds.length),t.also+=ot(c,o.target,o.pageIds,o.kind)}catch(c){let l=M(c).code;if(o.pageIds.length===1){i(o.target,c,o.names[0]);continue}if(l===void 0||!Mt.has(l)){i(o.target,c);continue}for(let[r,p]of o.pageIds.entries())try{let h=await s.link(o.source,[p],o.target,o.kind);Y(t,o.target,1),t.also+=ot(h,o.target,[p],o.kind)}catch(h){i(o.target,h,o.names[r])}}}return t}var bt=(s,d)=>`${s}|${d}`;async function yt(s,d,e,n,t,i,a){let o=new Map;for(let[c,l]of d.entries()){a?.(`${t} ${L(n,l.ownerId)} (${c+1} of ${d.length})\u2026`);let r;try{r=await s.remove(l.ownerId,l.pageIds,l.kind)}catch(p){r={ok:!1,code:"unknown",message:M(p).message}}if(!r.ok){e.failed.push({ownerId:l.ownerId,message:r.message});continue}if(o.set(bt(l.kind,l.ownerId),new Set(r.removed.map(S))),Y(e,l.ownerId,r.removed.length),r.removed.length!==0)try{let p=await s.clearRefs(l.ownerId,r.removed,l.kind,i(r.removed));(p?.kind==="warn"||p?.kind==="err")&&e.refs.push(l.ownerId)}catch{e.refs.push(l.ownerId)}}return o}async function $t(s,d,e,n){let t=Q("remove",d.kind);return t.dirty=[...d.dirty],t.lastOnly=[...d.lastOnly],await yt(s,d.work,t,e,`Taking ${m(d.kind,2)} off`,i=>[...i],n),t}async function xt(s,d,e,n){let t=Q("delete",d.kind);t.dirty=[...d.dirty];let i=new Set(d.pages.flatMap(o=>o.copies.filter(c=>d.dirty.includes(c.ownerId)).map(c=>S(c.pageId)))),a=await yt(s,d.work,t,e,"Deleting on",o=>o.filter(c=>i.has(S(c))),n);return t.gone=d.pages.filter(o=>o.copies.every(c=>a.get(bt(o.kind,c.ownerId))?.has(S(c.pageId))??!1)).length,t}var Nt="Save or discard the edits in its page editor first.",Ot="Save or discard the edits in its status pages editor first.";function Pt(s,d,e=new Set){let n=r=>L(d,r),t=s.kind==="status_pages",i=r=>`${r} ${m(s.kind,r)}`,a=[],o=s.done.map(r=>`${i(r.count)} ${s.action==="add"?"to":s.action==="remove"?"off":"on"} ${n(r.ownerId)}`);if(s.action==="add"&&o.length>0){a.push(`Added ${C(o)}.`),s.also>0&&a.push(`Their tiles brought ${Rt(s.also)} more.`);let r=t?void 0:F(s.done.filter(p=>e.has(p.ownerId)).map(p=>n(p.ownerId)));r!==void 0&&a.push(r)}else s.action==="remove"&&o.length>0?a.push(`Took ${C(o)}.`):s.action==="delete"&&(s.gone>0||o.length>0)&&a.push(s.gone>0?`Deleted ${i(s.gone)}.`:`Deleted ${C(o)}.`);let c=a.length>0,l=!1;for(let r of s.taken){l=!0;let p=r.names.length===1?N(s.kind):m(s.kind,2);a.push(`Not added to ${n(r.ownerId)}: ${j(r.names)}. It already has ${p} of its own with the same id.`)}s.blocked.length>0&&(l=!0,a.push(`Not added: ${j(s.blocked)}. Every device ${s.blocked.length===1?"it is":"they are"} on has unsaved edits.`)),s.lastOnly.length>0&&(l=!0,a.push(`Kept ${j(s.lastOnly)}: ${s.lastOnly.length===1?"it":"they"} would be left on no device. Use Delete for those.`));for(let r of s.dirty)l=!0,a.push(t?`Left ${n(r)} alone: its status pages have unsaved edits. ${Ot}`:`Left ${n(r)} alone: its pages have unsaved edits. ${Nt}`);for(let r of s.failed){l=!0;let p=s.action==="add"?`Not added to ${n(r.ownerId)}`:s.action==="remove"?`Not taken off ${n(r.ownerId)}`:`Not deleted on ${n(r.ownerId)}`;a.push(`${p}: ${r.message.replace(/\.$/,"")}.`)}if(s.refs.length>0){l=!0;let r=t?"the menu slots that showed them":"the menu slots or complication taps that opened them";a.push(`Could not clear ${r} on ${C(s.refs.map(n))}. Change those by hand.`)}if(!c&&!l){let r=m(s.kind,2);return{kind:"ok",text:s.action==="add"?`Those ${r} are on those devices already.`:s.action==="remove"?`None of those ${r} are on those devices.`:"Nothing was deleted."}}return{kind:l?c?"warn":"err":"ok",text:a.join(" ")}}function St(s){return{link:(d,e,n,t)=>_(s,d,e,[n],t),remove:(d,e,n)=>n==="status_pages"?tt(s,d,e):Se(Ve(s),d,e),clearRefs:(d,e,n,t)=>n==="status_pages"?nt(s,d,e,t):He(s,d,e,t)}}var z=200,Z=320,Dt=6,K=ce.screen;function Tt(s,d,e,n=K){if(ge(s))return{top:0,height:n.height};let t=je(Ye(s,d),n);if(t.tiles.length===0)return{top:0,height:n.height};let a=Ge(s,1,t.topInset,e)!==w?0:Math.max(0,t.topInset+Math.min(...t.tiles.map(c=>c.y))-Dt),o=t.topInset+Math.max(...t.tiles.map(c=>c.y+c.height))+Dt;return{top:a,height:Math.max(1,o-a)}}var Kt=2e3,Bt=250,Ct={pages:"wrist-assistant-panel.all-pages.v1",status_pages:"wrist-assistant-panel.all-status-pages.v1"},ee=new Map;function te(s){let d=ee.get(s);if(d!==void 0)return d;let e={kind:"all"};try{let n=window.localStorage.getItem(Ct[s]),t=n?JSON.parse(n):{};typeof t.filter=="string"&&(e.filter=t.filter),(t.kind==="watch"||t.kind==="iphone")&&(e.kind=t.kind)}catch{}return ee.set(s,e),e}function It(s,d){let e={...te(s),...d};ee.set(s,e);try{window.localStorage.setItem(Ct[s],JSON.stringify(e))}catch{}}var Lt=(s,d)=>s.toUpperCase()===d.toUpperCase(),O=(s,d="pages")=>(d==="status_pages"?Qe(s)?.dirty:qe(s)?.dirty)??!1,f=class extends se{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.docs=new Map;this.statusDocs=new Map;this.facts=new Map;this.statusFacts=new Map;this.failed=[];this.readState="idle";this.linksOn=!0;this.search="";this.linking=!1;this.newOpen=!1;this.selecting=!1;this.selected=new Set;this.hassDrawnAt=0;this.loadSeq=0;this.kindSeq=0;this.readSeq=new Map;this.reloadTimers=new Map;this.unsubscribers=[];this.subscribeSeq=0;this.colorsFor=pe();this.colorOf=e=>le(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.bulkMenu!==void 0&&this.bulkBusy===void 0?(e.preventDefault(),this.closeBulkMenu()):this.menuAt!==void 0?(e.preventDefault(),this.closeDevices()):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))};this.onWindowPointerDown=e=>{let n=(this.bulkMenu==="add"||this.bulkMenu==="remove")&&this.bulkBusy===void 0;if(this.menuAt===void 0&&!n)return;let t=e.composedPath(),i=(...a)=>t.some(o=>o instanceof Element&&a.some(c=>o.classList.contains(c)));this.menuAt!==void 0&&!i("pe-dev-menu","ap-dev-open")&&this.closeDevices(),n&&!i("pk-bar-menu")&&this.closeBulkMenu()}}get hass(){return this.hassNow}set hass(e){let n=this.hassNow===void 0;this.hassNow=e;let t=Date.now();(n||t-this.hassDrawnAt>=Kt)&&(this.hassDrawnAt=t,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.deviceSig=void 0,this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.endSubscriptions();for(let e of this.reloadTimers.values())window.clearTimeout(e);this.reloadTimers.clear(),this.loadSeq++,this.deviceSig=void 0}willUpdate(e){e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged();let n=this.devices,t=n.map(i=>i.ownerId).join(",");this.hassNow!==void 0&&this.isConnected&&t!==this.deviceSig&&(this.deviceSig=t,this.loadAll(),this.startSubscriptions(n))}kindChanged(){this.endSubscriptions(),this.loadSeq++,this.kindSeq++,this.deviceSig=void 0,this.readState="idle",this.failed=[],this.search="",this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.bulkMenu=void 0,this.bulkNote=void 0,this.newOpen=!1,this.closeDevices()}get filter(){return te(this.kind).filter}get deviceKind(){return te(this.kind).kind}waitingDevices(e=this.kind){return xe(this.owners,e==="status_pages"?this.statusFacts:this.facts)}freeDevices(){return new Set([...this.facts].filter(([,e])=>e.free).map(([e])=>e))}get devices(){return me(this.owners,this.phones)}get cards(){let e=this.devices,n=this.cardsMemo;if(n!==void 0&&n.docs===this.docs&&n.statusDocs===this.statusDocs&&n.devices.length===e.length&&n.devices.every((i,a)=>i.ownerId===e[a].ownerId&&i.name===e[a].name))return n.cards;let t=Ce(e,this.docs,this.statusDocs);return this.cardsMemo={docs:this.docs,statusDocs:this.statusDocs,devices:e,cards:t},t}get kindCards(){return Re(this.cards,this.kind)}async loadAll(){let e=this.hassNow;if(!e)return;let n=++this.loadSeq,t=this.devices,i=this.kind;this.readState==="idle"&&(this.readState="loading");let a=oe(e).then(()=>!0,p=>M(p).code!=="unknown_command"),o=await Promise.all(t.map(p=>this.readOne(e,p.ownerId,i))),c=await a;if(n!==this.loadSeq||i!==this.kind)return;let l=new Set,r=(p,h,v)=>{let u=new Map,b=new Map;for(let[y,D,T]of p){if(D==="failed"){l.add(y);let E=h.get(y);E!==void 0&&u.set(y,E);let ne=v.get(y);ne!==void 0&&b.set(y,ne)}else D!==void 0&&u.set(y,D);T!==void 0&&b.set(y,T)}return{docs:u,facts:b}};if(i==="status_pages"){let p=r(o,this.statusDocs,this.statusFacts);this.statusDocs=p.docs,this.statusFacts=p.facts}else{let p=r(o,this.docs,this.facts);this.docs=p.docs,this.facts=p.facts}this.failed=t.map(p=>p.ownerId).filter(p=>l.has(p)),this.linksOn=c,this.readState="ready"}async readOne(e,n,t){try{let i=await ae(e,n,t),a=i.revision<=0?void 0:t==="status_pages"?ke(i.document):ue(i.document);return[n,a,be(i)]}catch{return[n,"failed"]}}reloadOne(e,n){let t=`${n}|${e}`,i=this.reloadTimers.get(t);i!==void 0&&window.clearTimeout(i),this.reloadTimers.set(t,window.setTimeout(()=>{this.reloadTimers.delete(t);let a=this.hassNow;if(!a||!this.isConnected)return;let o=(this.readSeq.get(t)??0)+1;this.readSeq.set(t,o);let c=this.loadSeq;this.readOne(a,e,n).then(([,l,r])=>{if(o!==this.readSeq.get(t)||c!==this.loadSeq||l==="failed")return;if(n==="status_pages"){let h=new Map(this.statusDocs);l===void 0?h.delete(e):h.set(e,l),this.statusDocs=h,r!==void 0&&(this.statusFacts=new Map(this.statusFacts).set(e,r));return}let p=new Map(this.docs);l===void 0?p.delete(e):p.set(e,l),this.docs=p,r!==void 0&&(this.facts=new Map(this.facts).set(e,r))})},Bt))}startSubscriptions(e){this.endSubscriptions();let n=this.hassNow;if(!n)return;let t=this.subscribeSeq,i=this.kind;for(let a of e){let o=a.ownerId;re(n,o,c=>{t===this.subscribeSeq&&c.kind===i&&this.reloadOne(o,i)}).then(c=>{t===this.subscribeSeq?this.unsubscribers.push(c):Promise.resolve(c()).catch(()=>{})},()=>{})}}endSubscriptions(){this.subscribeSeq++;for(let e of this.unsubscribers)Promise.resolve(e()).catch(()=>{});this.unsubscribers=[]}setFilter(e){It(this.kind,{filter:e}),this.requestUpdate(),this.closeDevices(),this.pruneSelected()}setSearch(e){this.search=e,this.pruneSelected()}setDeviceKind(e){It(this.kind,{kind:e}),this.requestUpdate(),this.closeDevices(),this.pruneSelected()}newPage(e){if(this.newOpen=!1,this.kind==="status_pages"){et(e.ownerId),this.onOpen?.(e.ownerId,e.kind,"status_pages");return}ze(e.ownerId),this.onOpen?.(e.ownerId,e.kind)}open(e,n){let t=U(e,n,this.deviceKindNow()),i=x(t.page);if(e.kind==="status_pages"){Ze(t.device.ownerId,i),this.onOpen?.(t.device.ownerId,t.device.kind,"status_pages");return}We(t.device.ownerId,{pageId:i}),this.onOpen?.(t.device.ownerId,t.device.kind)}cardOfMenu(e){let n=this.menuAt;if(n!==void 0)return e.find(t=>{let i=R(t,n.ownerId);return i!==void 0&&Lt(x(i.page),n.pageId)})}openDevices(e){let n=e.copies[0];this.menuAt={ownerId:n.device.ownerId,pageId:x(n.page)},this.devicesNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.menuAt=void 0,this.devicesNote=void 0}async toggle(e,n){let t=this.hassNow;if(!t||this.linking||n.stuck!==void 0)return;let i=n.device.ownerId,a=n.device.name,o=e.pageId,c=e.kind==="status_pages",l;this.linking=!0,this.devicesNote=void 0;try{if(n.on){let p=x(R(e,i).page),h=c?await it(t,i,p,a):await Ue(t,i,p,a);l=h===void 0?{kind:"ok",text:`Taken off ${a}.`}:{kind:"err",text:h}}else{let p=B(e,O);if(p===void 0)l={kind:"warn",text:H(e.kind)};else{let h=x(R(e,p).page),v=await _(t,p,[h],[i],e.kind),u=c?void 0:Pe(v,i,[h],this.docs.get(p)),b=!c&&this.facts.get(i)?.free===!0?F([a]):void 0;l={kind:"ok",text:[`Added to ${a}.`,u,b].filter(y=>y!==void 0).join(" ")}}}}catch(p){l={kind:"err",text:`Not added. ${q(p)}`}}finally{this.linking=!1}let r=n.on?e.copies.find(p=>p.device.ownerId!==i):e.copies[0];r!==void 0&&this.menuAt!==void 0&&(this.menuAt={ownerId:r.device.ownerId,pageId:o}),this.devicesNote=l,await this.loadAll()}deviceKindNow(){return Te(this.deviceKind,this.devices)}shownNow(){return W(this.kindCards,V(this.filter,this.devices),this.search,this.deviceKindNow())}pickedCards(){return this.shownNow().filter(e=>this.selected.has(e.key))}pruneSelected(){this.selected.size!==0&&(this.selected=G(this.selected,this.shownNow().map(e=>e.key)))}startSelect(){this.selecting=!0,this.closeDevices(),this.bulkNote=void 0}endSelect(){this.bulkBusy===void 0&&(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.bulkMenu=void 0,this.bulkNote=void 0)}cardClick(e,n,t){let i=e.metaKey||e.ctrlKey;if(!this.selecting&&!i){this.open(n,t);return}e.preventDefault(),e.stopPropagation(),this.pick(n,e.shiftKey&&this.selecting&&!i)}pick(e,n){this.bulkBusy===void 0&&(this.selecting||this.startSelect(),this.selected=n?ct(this.selected,this.shownNow().map(t=>t.key),this.anchor,e.key):dt(this.selected,e.key),this.anchor=e.key,this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0))}selectShown(e){if(this.bulkBusy!==void 0)return;let n=this.shownNow().map(t=>t.key);this.selected=e?lt(this.selected,n):pt(this.selected,n),this.bulkNote=void 0,this.selected.size===0&&(this.bulkMenu=void 0)}openBulkMenu(e){if(this.bulkBusy===void 0){if(this.bulkMenu===e){this.closeBulkMenu();return}this.bulkMenu=e,this.bulkNote=void 0,this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar")?.querySelector(e==="delete"?".pk-bar-cancel":".pk-bar-row:not(:disabled)")?.focus()})}}closeBulkMenu(){this.bulkMenu=void 0}async runBulk(e,n=[]){let t=this.hassNow;if(!t||this.bulkBusy!==void 0)return;let i=this.kindSeq,a=this.devices,o=this.pickedCards();if(o.length===0)return;let c=a.map(h=>h.ownerId).filter(h=>n.includes(h));if(e!=="delete"&&c.length===0)return;let l=St(t),r=h=>{this.bulkBusy=h};this.bulkMenu=void 0,this.bulkNote=void 0,this.bulkBusy="Working\u2026";let p;try{let h;e==="add"?h=await mt(l,gt(o,c,this.docs,O,this.statusDocs),a,r):e==="remove"?h=await $t(l,vt(o,c,O),a,r):h=await xt(l,X(o,a,O),a,r),p=Pt(h,a,this.freeDevices())}catch(h){p={kind:"err",text:M(h).message}}if(i!==this.kindSeq){this.bulkBusy=void 0;return}this.bulkBusy=`Reading the ${m(this.kind,2)} again\u2026`;try{await this.loadAll()}finally{this.bulkBusy=void 0}i===this.kindSeq&&(this.selected=G(ht(o,this.kindCards),this.shownNow().map(h=>h.key)),this.anchor=void 0,this.bulkNote=p)}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return g`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;let n=this.kind,t=this.kindCards,i=V(this.filter,e),a=this.deviceKindNow(),o=W(t,i,this.search,a),c=this.readState!=="ready"&&t.length===0,l=this.failed.map(b=>e.find(y=>y.ownerId===b)?.name).filter(b=>b!==void 0),r=e.length>1,p=m(n),h=m(n,2),v=this.selecting?`Click ${h} to pick them. Shift+click picks every ${p} between two.`:`Click ${N(n)} to edit it.${this.linksOn&&e.length>1?" Devices on a card puts it on another watch or iPhone.":""}`,u=`Reading every device's ${h}\u2026`;return g`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${De(n)}</h1>
          <p class="ap-lead">${c?u:Ie(t.length,n)}</p>
        </div>
        ${e.length===0?w:this.renderNew(i,e)}
      </div>
      ${l.length===0?w:g`<p class="ap-warn" role="status">Could not read the ${h} of ${l.join(", ")}. They show as last read.</p>`}
      <div class="pk-surface pk-page" role="region" aria-label=${`Your ${h}`}>
        <div class="pk-pin">
          ${this.renderHead(t,i,e)}
          ${r?this.renderTabs(e,t,i):w}
          ${this.selecting?this.renderBar(o,e):w}
        </div>
        <div class="pk-body" role=${r?"tabpanel":w} aria-labelledby=${r?`ap-tab-${i}`:w}>
          ${c?g`<p class="ap-empty">${u}</p>`:o.length===0?g`<p class="ap-empty">${Ee(i,e,this.search,a,n)}</p>`:g`<div class="ap-grid" role="list">${o.map(b=>this.renderCard(b,i,e,t))}</div>`}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${v}</span></div>
      </div>
    </div></div>`}renderHead(e,n,t){let i=this.selecting,a=this.bulkBusy!==void 0,o=m(this.kind,2);return g`<div class="pk-head">
      <button type="button" class="pk-pick-btn ${i?"on":""}" aria-pressed=${i?"true":"false"}
        title=${i?`Back to opening one ${m(this.kind)} at a time`:`Pick several ${o} to add, remove or delete together`}
        ?disabled=${a} @click=${()=>i?this.endSelect():this.startSelect()}>
        ${P("checklist")}<span>Multi select</span></button>
      ${Oe(t)?this.renderKinds(e,n):w}
      <label class="pk-search">
        ${P("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${o}`}
          @input=${c=>this.setSearch(c.target.value)} />
      </label>
    </div>`}renderNew(e,n){let t=n.find(l=>l.ownerId===e)??(n.length===1?n[0]:void 0),i=this.newOpen&&t===void 0,o=`New ${m(this.kind)}`,c=`Add ${N(this.kind)} on`;return g`<div class="ap-new" @keydown=${l=>{l.key==="Escape"&&i&&(l.stopPropagation(),this.newOpen=!1)}}
      @focusout=${l=>{let r=l.relatedTarget;i&&!(r instanceof Node&&l.currentTarget.contains(r))&&(this.newOpen=!1)}}>
      <button type="button" class="ap-new-btn" aria-haspopup=${t===void 0?"menu":w}
        aria-expanded=${t===void 0?i?"true":"false":w}
        title=${t===void 0?`Pick the device to add ${N(this.kind)} on`:`${c} ${t.name}`}
        @click=${()=>t===void 0?this.newOpen=!this.newOpen:this.newPage(t)}>
        ${P("plus")}<span>${o}</span></button>
      ${i?g`<div class="ap-new-menu" role="menu" aria-label=${c}>
        <div class="ap-new-h">${c}</div>
        ${n.map(l=>g`<button type="button" class="ap-new-row" role="menuitem"
          style=${`--dc:${this.colorOf(l.ownerId)??"var(--wa-line-strong)"}`} @click=${()=>this.newPage(l)}>
          ${P(l.kind==="iphone"?"phone":"watch")}<span>${l.name}</span></button>`)}
      </div>`:w}
    </div>`}renderKinds(e,n){let t=this.deviceKindNow(),i=Ke(W(e,n,this.search));return g`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label=${`Show the ${m(this.kind,2)} on one kind of device`} .value=${t}
        @change=${a=>this.setDeviceKind(a.target.value)}>
        ${i.map(a=>g`<option value=${a.key} ?selected=${a.key===t}>${a.label} (${a.count})</option>`)}
      </select>
    </label>`}renderTabs(e,n,t){return g`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${Ne(e,n,this.colorOf).map(i=>g`<button type="button" role="tab" class="pk-tab ${i.id===t?"on":""}"
        style=${i.color===void 0?w:`--dc:${i.color}`} id=${`ap-tab-${i.id}`} aria-selected=${i.id===t?"true":"false"}
        title=${i.id===Me?`Every ${m(this.kind)} on every device`:`The ${m(this.kind,2)} on ${i.label}`}
        @click=${()=>this.setFilter(i.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${P(i.kind===void 0?"grid":i.kind==="iphone"?"phone":"watch")}</span>
        <span class="pk-tab-name">${i.label}</span>
        <span class="pk-tab-count">${i.count}</span>
      </button>`)}
    </div>`}renderCard(e,n,t,i){let a=U(e,n,this.deviceKindNow()),o=this.selecting,c=!o&&this.cardOfMenu(i)?.key===e.key,l=!o&&this.linksOn&&t.length>1,r=o&&this.selected.has(e.key),p=o?`${r?"Let":"Pick"} ${e.name}${r?" go":""}`:`Edit ${e.name} on ${a.device.name}`,h=u=>this.cardClick(u,e,n),v=u=>`--dc:${this.colorOf(u)??"var(--wa-line-strong)"}`;return g`<div class="ap-card ${c?"over":""} ${o?"picking":""} ${r?"picked":""}" role="listitem" data-card=${e.key}
      @click=${u=>{o&&h(u)}}>
      <div class="ap-top">
        ${o?g`<input type="checkbox" class="pk-card-pick" .checked=${de(r)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${p}
          @click=${u=>{u.stopPropagation(),this.pick(e,u.shiftKey)}} />`:w}
        <button type="button" class="ap-open" title=${p} tabindex=${o?"-1":"0"} @click=${h}>
          <b class="ap-name">${e.name}</b>
          <small class="ap-detail">${Le(e)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${p} @click=${h}>
        ${e.kind==="status_pages"?this.renderStatusThumb(a):this.renderThumb(a)}
      </button>
      <div class="ap-foot">
        <span class="ap-devs">${e.copies.map(u=>g`<span class="ap-dev ${u.hidden?"dim":""}" style=${v(u.device.ownerId)}
          title=${u.hidden?`On ${u.device.name}, hidden there`:`On ${u.device.name}`}>
          ${P(u.device.kind==="iphone"?"phone":"watch")}<span class="ap-dev-n">${u.device.name}</span>${u.hidden?g`<em>hidden</em>`:w}
        </span>`)}</span>
        ${l?g`<button type="button" class="ap-dev-open ${c?"on":""}" aria-expanded=${c?"true":"false"}
          title=${`Pick the devices this ${m(e.kind)} is on`}
          @click=${()=>c?this.closeDevices():this.openDevices(e)}>${P("phone")}<span>Devices</span>${P("chevron")}</button>`:w}
      </div>
      ${c?this.renderMenu(e,t):w}
    </div>`}renderMenu(e,n){let t=B(e,O)===void 0;return _e({name:e.name,places:Be(n,e,this.waitingDevices(e.kind)),...t?{blocked:H(e.kind)}:{},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",colorOf:i=>this.colorOf(i),onToggle:i=>{this.toggle(e,i)},onDone:()=>this.closeDevices()})}renderBar(e,n){let t=e.filter(v=>this.selected.has(v.key)),i=t.length,a=this.bulkBusy!==void 0,o=i===0,c=e.length>0&&e.every(v=>this.selected.has(v.key)),l=n.length>1,r=a?void 0:this.bulkNote,p=m(this.kind),h=m(this.kind,2);return g`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${h}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(o?`Pick ${N(this.kind)} to start.`:`${i} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${a||e.length===0}
        title=${c?`Let the ${h} on screen go`:`Pick every ${p} the tab, the search and the Device menu have left`}
        @click=${()=>this.selectShown(!c)}>${c?"None":"All shown"}</button>
      ${r===void 0?w:g`<span class="pk-bar-said ${r.kind}">${r.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.bulkMenu==="delete"&&!o?this.renderDeleteAsk(t,n):g`${l&&this.linksOn?this.renderBarMenu("add",t,n,a||o):w}
          ${l?this.renderBarMenu("remove",t,n,a||o):w}
          <button type="button" class="ghost danger small" ?disabled=${a||o}
            title=${`Delete these ${h} from every device they are on`}
            @click=${()=>this.openBulkMenu("delete")}>${P("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${a}
        title=${`Stop picking and go back to opening one ${p} at a time`}
        @click=${()=>this.endSelect()}>${P("check")}<span>Done</span></button>
    </div>`}renderBarMenu(e,n,t,i){let a=e==="add",o=this.bulkMenu===e&&!i,c=n.length,l=this.kind,r=m(l,2),p=`${c} ${m(l,c)}`,h=a?`Add ${p} to`:`Remove ${p} from`,v=a?this.waitingDevices(l):new Set;return g`<span class="pk-bar-menu">
      <button type="button" class="ghost small ${o?"on":""}" aria-expanded=${o?"true":"false"} ?disabled=${i}
        title=${a?`Put these ${r} on another device, linked`:`Take these ${r} off a device`}
        @click=${()=>this.openBulkMenu(e)}>${P(a?"plus":"layers")}<span>${a?"Add to\u2026":"Remove from\u2026"}</span></button>
      ${o?g`<div class="pk-bar-list" role="group" aria-label=${h}>
        <div class="pk-bar-head">${h}</div>
        ${t.map(u=>{let b=n.filter(E=>R(E,u.ownerId)!==void 0).length,y=O(u.ownerId,l),D=v.has(u.ownerId),T=y?"unsaved edits":D?ye:a?b===c?"has them all":void 0:b===0?"has none":void 0;return g`<button type="button" class="pk-bar-row" ?disabled=${T!==void 0}
            style=${`--dc:${this.colorOf(u.ownerId)??"var(--wa-muted)"}`}
            title=${y?`Its ${l==="status_pages"?"status pages":"pages"} have unsaved edits. Save or discard them first.`:D?$e:`${a?"Add to":"Remove from"} ${u.name}`}
            @click=${()=>{this.runBulk(e,[u.ownerId])}}>
            ${P(u.kind==="iphone"?"phone":"watch")}
            <span class="pk-dup-name">${u.name}</span>
            ${T===void 0?a?w:g`<span class="pk-bar-row-n">${b} of ${c}</span>`:g`<span class="pk-bar-row-n">${T}</span>`}
          </button>`})}
        <div class="pk-bar-note">${a?"They go on linked: an edit on one device shows on all of them.":`${l==="status_pages"?"A status page":"A page"} this would leave on no device stays. Use Delete for those.`}</div>
      </div>`:w}
    </span>`}renderDeleteAsk(e,n){let t=wt(X(e,n,O),n);return g`<span class="pk-bar-ask" id="ap-del-ask"><b>${t.title}</b> ${t.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask"
        @click=${()=>{this.runBulk("delete")}}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>this.closeBulkMenu()}>Cancel</button>`}renderThumb(e){let n=this.docs.get(e.device.ownerId),t=n===void 0?[e.page]:A(n),i=this.hassNow?.states,a=this.icons,o=z/K.width,c=Tt(e.page,i,a),l=c.height*o,r=l>Z,p=h=>`${Math.round(h*100)/100}px`;return g`<span class="ap-pic ${r?"cut":""}" style=${`width:${p(z)};height:${p(Math.min(l,Z))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${p(-c.top*o)})`}>${Je({page:e.page,pages:t,screen:K,scale:o,...i===void 0?{}:{states:i},...a===void 0?{}:{icons:a}})}</span>
    </span>`}renderStatusThumb(e){let n=this.hassNow,t=z/K.width,i=c=>`${Math.round(c*100)/100}px`,o=(Array.isArray(e.page.rows)?e.page.rows.length:0)>5;return g`<span class="ap-pic ap-pic-status ${o?"cut":""}" style=${`width:${i(z)};height:${i(Math.min(K.height*t,Z))}`}>
      <span class="ap-pic-in">${n===void 0?w:st({page:e.page,hass:n,icons:this.icons??he,screen:K,scale:t})}</span>
    </span>`}static{this.styles=[Xe,fe,Ae,at,Fe,ie`
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

    /* The rest of the Complications surface's rules in panel.ts (\`.pk-*\`)
       this tab uses: the segments, Multi select and its bar. Keep the two
       in step. */
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
    /* A status page's picture: the watch's black screen, one screen tall. */
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
    /* Picking: every click on the card picks it, and a picked card wears
       the Complications card's ink ring. */
    .ap-card.picking { cursor: pointer; user-select: none; }
    .ap-card.picked { border-color: var(--wa-ink); box-shadow: 0 0 0 1px var(--wa-ink); }
    /* A phone: the bar folds with the head (\`listTabStyles\`). */
    @media (max-width: 640px) {
      .pk-bar { padding: 8px 10px; }
    }
  `]}};k([I({attribute:!1})],f.prototype,"kind",2),k([I({attribute:!1})],f.prototype,"owners",2),k([I({attribute:!1})],f.prototype,"ownersReady",2),k([I({attribute:!1})],f.prototype,"phones",2),k([I({attribute:!1})],f.prototype,"icons",2),k([I({attribute:!1})],f.prototype,"iconsTick",2),k([I({attribute:!1})],f.prototype,"onOpen",2),k([$()],f.prototype,"docs",2),k([$()],f.prototype,"statusDocs",2),k([$()],f.prototype,"facts",2),k([$()],f.prototype,"statusFacts",2),k([$()],f.prototype,"failed",2),k([$()],f.prototype,"readState",2),k([$()],f.prototype,"linksOn",2),k([$()],f.prototype,"search",2),k([$()],f.prototype,"menuAt",2),k([$()],f.prototype,"linking",2),k([$()],f.prototype,"devicesNote",2),k([$()],f.prototype,"newOpen",2),k([$()],f.prototype,"selecting",2),k([$()],f.prototype,"selected",2),k([$()],f.prototype,"bulkMenu",2),k([$()],f.prototype,"bulkBusy",2),k([$()],f.prototype,"bulkNote",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",f);export{f as WaAllPages,Tt as pageCrop};
