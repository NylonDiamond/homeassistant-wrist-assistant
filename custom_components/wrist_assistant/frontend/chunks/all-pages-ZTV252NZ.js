import{b as un}from"./chunk-DFNAYX7B.js";import{a as ti,b as ni}from"./chunk-AB3EFZNH.js";import{A as Xn,B as Qn,C as Zn,D as ei,E as ze,b as Oe,c as Dn,e as Ln,f as v,g as re,h as Bn,i as _e,j as Wn,k as Vn,l as zn,m as oe,n as de,o as Kn,q as He,r as Be,s as Un,t as jn,u as Gn,v as We,w as Ve,x as qn,y as Yn,z as Jn}from"./chunk-SQTDJNZV.js";import{i as qt,l as Yt}from"./chunk-J3NLTRPY.js";import{C as ii}from"./chunk-BMDX7IKZ.js";import{F as Cn,G as se,H as Rn,I as ae,J as On,K as Mn,L as Me,N as An,O as Ae,P as _n,Q as Hn,b as Fn,c as En}from"./chunk-44B3NFXE.js";import"./chunk-VPRFDQT5.js";import{d as xe}from"./chunk-ZSWWR6FS.js";import"./chunk-XK4RPKXH.js";import{a as Fe,b as Ee,c as tn,d as nn,e as sn,f as an,g as rn,h as on}from"./chunk-EMG2OTWQ.js";import{a as Zt,b as De,d as ln,m as hn}from"./chunk-PCLG5EXR.js";import{c as Le,d as en}from"./chunk-SV3ZECZ5.js";import{a as dn,b as pn,c as cn}from"./chunk-U5A75W52.js";import"./chunk-CH6MHUGG.js";import"./chunk-R57JT7CT.js";import{Eb as jt,Jb as Gt,O as Ne,fb as Vt,ib as zt,ub as Kt,zb as Ut}from"./chunk-BCXMRZW3.js";import{eb as Wt}from"./chunk-QNUCXFZT.js";import{A as Re,b as ie,c as Ce,d as gn,e as mn,f as fn,g as wn,h as kn,i as bn,j as vn,k as yn,l as xn,m as $n,o as Pn,p as Sn,q as In,x as Tn,y as Nn}from"./chunk-ZWKREHAZ.js";import{c as Jt,d as Xt,i as Qt}from"./chunk-3H5Q7NN2.js";import"./chunk-23HGMPRT.js";import"./chunk-HLU6UW7V.js";import"./chunk-KYRHNZC6.js";import{b as _t,c as Ht}from"./chunk-YPF4V5RM.js";import{e as Bt}from"./chunk-6SB6XCX5.js";import{d as Se,e as ee}from"./chunk-WRQZ74MG.js";import{b as Ie,c as Te,d as ne}from"./chunk-2AOECEX3.js";import"./chunk-ICKPXI3D.js";import{g as $e,j as Pe,k as Tt,l as Nt,z as Dt}from"./chunk-MTMG3FZL.js";import{C as It,q as St}from"./chunk-PLX3QK4N.js";import{c as te,d as Lt,e as Ft,f as Et}from"./chunk-66LFWA7H.js";import"./chunk-QODROZPB.js";import"./chunk-JPYTFTZX.js";import{X as f,_ as L,da as xt,ea as $t,la as Pt,ma as U,w as yt,x as ye}from"./chunk-MTUTXLNK.js";import"./chunk-C6K36PU4.js";import{e as Ct}from"./chunk-I7GJR7UG.js";import{A as Rt,Ja as Ot,Na as Mt,wb as At}from"./chunk-YXAT6AVX.js";import"./chunk-444RQRAM.js";import{j as _}from"./chunk-IK6XNRNA.js";import{f as dt}from"./chunk-HQUNKMJR.js";import"./chunk-FG3PHEWQ.js";import{a as pt,c as ct,d as W,f as Z,g as we,h as lt,i as ht,j as ut,k as gt,l as mt}from"./chunk-A57SRIFP.js";import{H as ve,f as vt,g as K}from"./chunk-BZA4I5PG.js";import{$ as ke,A as wt,J as kt,Z as bt,aa as be,i as D,k as ft,l as C,m as V,n as E,q as z}from"./chunk-HOTMV2GM.js";import"./chunk-AOFSYXYC.js";import"./chunk-PWVBP3GH.js";import{Ae as X,Bg as ot,b as I,c as y,ph as x,qf as st,rf as at}from"./chunk-FEBFQRVD.js";import{Tb as Q,e as rt,l as T}from"./chunk-3XA74UYB.js";import"./chunk-CLMBAHSL.js";import{b as A,f as c,i as u,l as it}from"./chunk-6ZDBXU6B.js";import{a as m}from"./chunk-LO2NM3CE.js";function ns(s,r,e){return`${s} ${s===1?r:e}`}function si(s,r){let e=new Set(s);return e.has(r)?e.delete(r):e.add(r),e}function ai(s,r,e,t){let n=new Set(s),i=r.indexOf(t),a=e===void 0?-1:r.indexOf(e);if(i<0)return n;if(a<0)return n.add(t),n;for(let o=Math.min(a,i);o<=Math.max(a,i);o++)n.add(r[o]);return n}function ri(s,r){return new Set([...s,...r])}function oi(s,r){let e=new Set(r);return new Set([...s].filter(t=>!e.has(t)))}function di(s,r){let e=new Set(r);return new Set([...s].filter(t=>e.has(t)))}function P(s){return s.id.toUpperCase()}function pe(s,r,e){let n={kind:s[0]?.kind??"pages",items:[],kept:[],devices:[]},i=new Set;for(let a of s){let o=r.filter(p=>a.owners.some(l=>f(l,p.ownerId))).map(p=>p.ownerId),d=o.filter(p=>e(p,a.kind));if(d.length>0){n.kept.push({name:a.name,dirty:d});continue}n.items.push({id:a.id,name:a.name,owners:[...a.owners]});for(let p of o)i.add(p)}return n.devices=r.map(a=>a.ownerId).filter(a=>i.has(a)),n}var j=(s,r)=>s.find(e=>f(e.ownerId,r))?.name??"a device";function Ke(s,r){let e=s.items.length,t=e===1?"it":"them",n=`Delete ${e} ${v(s.kind,e)}?`,i=s.devices.map(d=>j(r,d)),a=s.kind==="status_pages"?`with the tiles and menu slots that open ${t}`:`with the tiles, menu slots and complication taps that open ${t}`,o=[i.length===0?`${e===1?"It is":"They are"} on no device yet. ${Pe}`:`${e===1?"It comes":"They come"} off ${W(i)}, ${a}. ${Pe}`];for(let d of s.kept){let p=d.dirty.map(l=>j(r,l));o.push(`${d.name} stays: ${W(p)} ${p.length===1?"has":"have"} unsaved edits.`)}return{title:n,body:o.join(" ")}}async function pi(s,r,e,t){let n={kind:r.kind,gone:[],kept:r.kept.map(a=>({...a,dirty:[...a.dirty]})),failed:[],stuck:[],taps:[]},i=new Map;for(let[a,o]of r.items.entries()){t?.(`Deleting ${o.name} (${a+1} of ${r.items.length})\u2026`);let d=await s.delete(r.kind,o.id);if(!d.ok){n.failed.push({name:o.name,text:d.text});continue}n.gone.push(o.name);for(let p of d.reply.link_failures??[]){let l=p.name??j(e,p.owner);n.stuck.includes(l)||n.stuck.push(l)}for(let p of o.owners)i.set(p,[...i.get(p)??[],o.id])}if(r.kind==="pages")for(let[a,o]of i){t?.(`Clearing complication taps on ${j(e,a)}\u2026`);let d=!1;try{d=await s.clearTaps(a,o)}catch{d=!1}d||n.taps.push(j(e,a))}return n}function Ue(s){let r=i=>`${i} ${v(s.kind,i)}`,e=[];s.gone.length>0&&e.push(`Deleted ${s.gone.length===1?s.gone[0]:r(s.gone.length)}.`);let t=e.length>0,n=!1;for(let i of s.kept)n=!0,e.push(`Kept ${i.name}: a device that has it has unsaved edits. Save or discard them first.`);for(let i of s.failed)n=!0,e.push(`Not deleted: ${i.name}. ${i.text}`);return s.stuck.length>0&&(n=!0,e.push(`Could not take ${s.gone.length===1?"it":"them"} off ${W(s.stuck)}.`)),s.taps.length>0&&(n=!0,e.push(`Could not clear the complication taps that opened ${s.gone.length===1?"it":"them"} on ${W(s.taps)}. Change those by hand.`)),!t&&!n?{kind:"ok",text:"Nothing was deleted."}:{kind:n?t?"warn":"err":"ok",text:e.join(" ")}}function ci(s,r){return ns(r,v(s),v(s,2))}function ce(s,r){return C(s).filter(e=>wt(e,r)&&!bt(s,e,r)).length}function is(s){return z(s)?!1:!ke(s)||ce(s,"watch")>0||ce(s,"iphone")>0}function le(s,r){let e=n=>["watch","iphone"].filter(i=>n.some(a=>a.kind===i)),t=e(r.filter(n=>s.some(i=>f(i,n.ownerId))));return t.length>0?t:e(r)}function je(s,r){return r!==void 0&&s.includes(r)?r:s[0]??"watch"}var li=s=>`${s} ${s===1?"tile":"tiles"}`;function hi(s,r,e){let t=new Set(e.map(o=>o.kind)),n=new Set(e.filter(o=>r.some(d=>f(d,o.ownerId))).map(o=>o.kind));if(t.size>1&&n.size===1)return n.has("watch")?"Watch only":T("iPhone only","Phone only");if(z(s))return;let i=ce(s,"watch");if(i>0)return`${li(i)} off on the watch`;let a=ce(s,"iphone");return a>0?`${li(a)} off on the ${T("iPhone","phone")}`:ke(s)?void 0:T("iPhone arranged differently","Phone arranged differently")}var ui="Screens differ";function gi(s,r){return s==="all"||is(r)}function mi(){return`Every page is arranged the same on the watch and the ${T("iPhone","phone")}.`}function fi(){return`Watch and ${T("iPhone","phone")} can now be arranged apart. Nothing has changed on your devices.`}var wi="wa-pages-two-screens-card-dismissed";function ki(s){if(s!==void 0)return s;try{return globalThis.localStorage}catch{return}}var bi=!1;function vi(s){if(bi)return!0;try{return ki(s)?.getItem(wi)==="1"}catch{return!1}}function yi(s){bi=!0;try{ki(s)?.setItem(wi,"1")}catch{}}var Ge="houselitPage",$i=1,ss=2*1024*1024,Je=/^[a-z0-9_]+\.[a-z0-9_]+$/,Pi=new Set(["id"]);function Si(s,r){let e=s[r];if(!D(e))return"";let t=e.attributes;return D(t)&&typeof t.friendly_name=="string"?t.friendly_name:""}function qe(s,r,e,t=0){if(!(t>64)){if(typeof s=="string"){r(s,e);return}if(Array.isArray(s)){for(let n of s)qe(n,r,e,t+1);return}if(D(s))for(let[n,i]of Object.entries(s))qe(i,r,n,t+1)}}function Ye(s,r,e,t=0){if(t>64)return s;if(typeof s=="string")return e!==void 0&&Pi.has(e)?s:r(s);if(Array.isArray(s))return s.map(n=>Ye(n,r,e,t+1));if(D(s)){let n={};for(let[i,a]of Object.entries(s))n[i]=Ye(a,r,i,t+1);return n}return s}function ue(s,r){let e=new Set,t=[],n=i=>{e.has(i)||!r(i)||(e.add(i),t.push(i))};return qe(s,(i,a)=>{if(!(a!==void 0&&Pi.has(a)))if(Je.test(i))n(i);else for(let o of st(i))n(o)}),t}function Ii(s,r){let e={};for(let t of ue(s,n=>Object.hasOwn(r,n)))e[t]=Si(r,t);return Ot({[Ge]:$i,name:E(s),page:s,entities:e})}function Ti(s){let r=E(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40);return`houselit-page-${r===""?"page":r}.json`}var xi="This is not a shared page. In Pages, open a page's \xB7\xB7\xB7 and pick Share page, then copy all of the text.";function he(s){if(D(s)&&!(!Array.isArray(s.items)&&!D(s.dynamicConfig)))return s}function R(s){let r=s.trim();if(r==="")return{ok:!1,error:"Paste the text of a shared page."};if(new TextEncoder().encode(r).length>ss)return{ok:!1,error:"This text is too big for one page."};let e;try{e=JSON.parse(r)}catch{return{ok:!1,error:"This text is cut short or changed. Copy all of it again."}}if(!D(e))return{ok:!1,error:xi};let t,n={};if(Ge in e){let i=e[Ge];if(typeof i!="number"||i>$i)return{ok:!1,error:"This page was shared from a newer version. Update the integration, then paste it again."};if(t=he(e.page),D(e.entities))for(let[a,o]of Object.entries(e.entities))Je.test(a)&&(n[a]=typeof o=="string"?o:"")}else if(Array.isArray(e.pages)){let i=e.pages.filter(a=>he(a)!==void 0);if(i.length>1)return{ok:!1,error:"This text has more than one page. Share one page at a time."};t=he(i[0])}else t=he(e);if(t===void 0)return{ok:!1,error:xi};if(Mt(t))return{ok:!1,error:"This page has a color in it that is not a color, so it was not read."};if(Object.keys(n).length===0)for(let i of ue(t,a=>kt(a)==="entity"))n[i]="";return{ok:!0,share:{page:t,entities:n}}}function G(s,r){let e=new Map;for(let t of Object.keys(r)){let n=t.split(".")[0]??"",i=e.get(n)??[];i.push({entityId:t,name:Si(r,t)||t}),e.set(n,i)}for(let t of e.values())t.sort((n,i)=>n.name.localeCompare(i.name));return Object.entries(s.entities).filter(([t])=>!Object.hasOwn(r,t)).map(([t,n])=>{let i=t.split(".")[0]??"";return{entityId:t,domain:i,name:n,choices:e.get(i)??[]}})}function Ni(s){let r={};for(let e of s){if(e.name==="")continue;let t=e.choices.filter(n=>n.name.toLowerCase()===e.name.toLowerCase());t.length===1&&(r[e.entityId]=t[0].entityId)}return r}function as(s){let r=0,e=s.backgroundImageId;typeof e=="string"&&e.trim()!==""&&!Ne(e)&&(r+=1);for(let t of C(s))typeof t.iconPhotoId=="string"&&t.iconPhotoId.trim()!==""&&(r+=1);return r}function Xe(s,r){return{name:E(s.page),tiles:C(s.page).length,entities:Object.keys(s.entities).length,missing:G(s,r).length,photos:as(s.page)}}function Di(s){let r=(t,n,i=`${n}s`)=>`${t} ${t===1?n:i}`,e=`${s.name}: ${r(s.tiles,"tile")}, ${r(s.entities,"entity","entities")}.`;return s.missing>0&&(e+=` ${s.missing} ${s.missing===1?"is":"are"} not in this home. Pick yours below, or leave ${s.missing===1?"it":"them"}.`),s.photos>0&&(e+=` ${r(s.photos,"photo")} stay${s.photos===1?"s":""} behind.`),e}function Li(s,r){let e=new Map;for(let[i,a]of Object.entries(r))a!==""&&a!==i&&Je.test(a)&&e.set(i,a);let t=e.size===0?structuredClone(s.page):Ye(s.page,i=>e.get(i)??at(i,e)),n=t.backgroundImageId;if(typeof n=="string"&&n.trim()!==""&&!Ne(n)&&delete t.backgroundImageId,Array.isArray(t.items))for(let i of t.items)D(i)&&(delete i.iconPhotoId,delete i.iconPhotoLook);return t}var rs="dialog.lib-new-page",os=new Set(["light","switch","input_boolean","fan","cover","lock","climate","media_player","scene","script"]);function ds(s){let r=new Set;for(let e of Object.keys(s?.states??{})){if(!Ei(s,e))continue;let t=xe(s,e);t!==void 0&&r.add(t)}return Object.entries(s?.areas??{}).filter(([e])=>r.has(e)).map(([e,t])=>({id:e,name:typeof t?.name=="string"&&t.name.trim()!==""?t.name.trim():e})).sort((e,t)=>e.name.localeCompare(t.name))}function Ei(s,r){let e=s?.entities?.[r];return e?.hidden!==!0&&(e?.entity_category??null)===null}function H(s,r){let e={controls:[],more:[]};if(r===void 0)return e;for(let[n,i]of Object.entries(s?.states??{})){if(!Ei(s,n)||xe(s,n)!==r)continue;let a=i?.attributes?.friendly_name,o=typeof a=="string"&&a.trim()!==""?a.trim():n,d=n.slice(0,n.indexOf("."));(os.has(d)?e.controls:e.more).push({entityId:n,name:o})}let t=(n,i)=>n.name.localeCompare(i.name)||n.entityId.localeCompare(i.entityId);return e.controls.sort(t),e.more.sort(t),e}function q(s,r){let e=[...r.controls,...r.more].map(t=>t.entityId);return s.picked===void 0?r.controls.map(t=>t.entityId):e.filter(t=>s.picked.includes(t))}function Ci(s,r,e,t){let n=q(s,r),i=t?[...n.filter(d=>d!==e),e]:n.filter(d=>d!==e),{note:a,...o}=s;return{...o,picked:i}}var Ri="wa-new-page-devices",Qe;function Oi(s){try{let r=(s??globalThis.localStorage)?.getItem(Ri),e=r?JSON.parse(r):void 0;if(Array.isArray(e))return e.filter(t=>typeof t=="string")}catch{}return Qe===void 0?void 0:[...Qe]}function Mi(s,r){Qe=[...s];try{(r??globalThis.localStorage)?.setItem(Ri,JSON.stringify(s))}catch{}}function Ai(s,r,e){let t=s.filter(n=>e?.(n.ownerId)!==!0);return r===void 0?t.map(n=>n.ownerId):t.filter(n=>r.some(i=>f(i,n.ownerId))).map(n=>n.ownerId)}var _i="Ticked like your last new page.",Hi="Ticked for the watch you just paired.";function Ze(s,r,e){return{name:s,busy:!1,owners:r,start:"empty",...e===void 0?{}:{ticksHint:e}}}function Bi(s,r,e,t){let n=t?r.filter(i=>f(i.ownerId,e)||s.owners.some(a=>f(a,i.ownerId))).map(i=>i.ownerId):s.owners.filter(i=>!f(i,e));return{...s,owners:n}}function Y(s,r){if(s.name.trim()==="")return"Type a name to start.";if(s.start==="room"){if(s.areaId===void 0)return"Pick a room.";if(q(s,H(r.hass,s.areaId)).length===0)return"Tick something in the room."}if(s.start==="page"&&(s.fromPage===void 0||!r.pages.some(e=>f(V(e),s.fromPage))))return"Pick a page to start from.";if(s.start==="map"&&r.mapFloorId===void 0)return r.mapRefusal??"Scan a room in the iPhone app first.";if(s.start==="shared"){let e=R(s.shared??"");if(!e.ok)return e.error}}function Wi(s,r,e){if(Y(s,r)!==void 0)return;let t=s.name.trim(),n=e.toUpperCase();if(s.start==="map")return{schemaVersion:1,pages:[ne(n,t,r.mapFloorId)]};if(s.start==="shared"){let o=R(s.shared??"");return o.ok?{schemaVersion:1,pages:[ve(Li(o.share,s.sharedPicks??{}),n,t)]}:void 0}if(s.start==="page"){let o=r.pages.find(d=>f(V(d),s.fromPage));return{schemaVersion:1,pages:[ve(o,n,t)]}}let i={schemaVersion:1,pages:[K(n,t)]};if(s.start!=="room")return i;let a={states:r.hass?.states??{},...r.hass?.entities===void 0?{}:{entities:r.hass.entities}};for(let o of q(s,H(r.hass,s.areaId)))i=It(i,n,{kind:"entity",...St(a,o)},{last:!0}).document;return i}function ps(s,r,e){let t=Y(s,r);if(t!==void 0)return t;let n=s.name.trim(),i=e.filter(o=>s.owners.some(d=>f(d,o.ownerId))),a=i.length===0?"on no device yet. Tick a device any time.":i.length===1?`on ${i[0].name}.`:`on ${i.length} devices.`;if(s.start==="room"){let o=q(s,H(r.hass,s.areaId)).length;return`${n}, ${o} ${o===1?"tile":"tiles"}, ${a}`}if(s.start==="shared"){let o=R(s.shared??""),d=o.ok?Xe(o.share,r.hass?.states??{}).tiles:0;return`${n}, ${d} ${d===1?"tile":"tiles"}, ${a}`}return`${n}, ${s.start==="map"?"a map page":"a page"} ${a}`}var cs={empty:"Empty",room:"From a room",page:"From a page",map:"Home map",shared:"Paste a page"};function Fi(s,r){switch(s){case"empty":return"Add tiles yourself.";case"room":return"A tile for each thing in a room you tick.";case"page":return"A copy of a page's tiles, to change on its own.";case"map":return r??"On the iPhone the whole page is your home's live map. The watch shows it as one tile.";case"shared":return"A page someone shared with you."}}function ls(s){return s==="room"?"home":s==="page"?"duplicate":s==="map"?"place":s==="shared"?"paste":"grid"}function Vi(s,r,e,t,n){return c`<label class="np-check" title=${n??u}>
    <input type="checkbox" .checked=${_(s)} ?disabled=${e} @change=${i=>t(i.target.checked)} />
    <span>${r}</span>
  </label>`}function hs(s,r,e){let t=(n,i)=>{let a=r.devices.filter(o=>o.kind===n);return a.length===0?u:c`<div class="np-group" role="group" aria-label=${i}>
      <span class="np-kind">${x(n==="iphone"?"phone":"watch")}<span>${i}</span></span>
      ${a.map(o=>{let d=r.locked?.(o.ownerId);return Vi(s.owners.some(p=>f(p,o.ownerId)),o.name,s.busy||d!==void 0,p=>e.onDevice(o.ownerId,p),d)})}
    </div>`};return c`<div class="np-devices">${t("watch","Watches")}${t("iphone",T("iPhones","Phones"))}</div>`}function us(s,r,e){let t=ds(r.hass);if(t.length===0)return c`<p class="np-none">No room in Home Assistant has anything in it yet. Give your devices an area there first.</p>`;let n=H(r.hass,s.areaId),i=new Set(q(s,n)),a=o=>o.map(d=>Vi(i.has(d.entityId),d.name,s.busy,p=>e.onEntity(d.entityId,p),d.entityId));return c`<label class="np-area"><span>Room</span>
      <select ?disabled=${s.busy} @change=${o=>e.onArea(o.target.value)}>
        <option value="" ?selected=${s.areaId===void 0} disabled>Pick a room</option>
        ${t.map(o=>c`<option value=${o.id} ?selected=${o.id===s.areaId}>${o.name}</option>`)}
      </select></label>
    ${s.areaId===void 0?u:c`<div class="np-room">
      ${n.controls.length===0?c`<p class="np-none">Nothing to tap in this room.</p>`:a(n.controls)}
      ${n.more.length===0?u:c`<p class="np-more">More in this room</p>${a(n.more)}`}
    </div>`}`}function gs(s,r,e){return r.pages.length===0?c`<p class="np-none">Your home has no page to start from yet.</p>`:c`<label class="np-area"><span>Page</span>
    <select ?disabled=${s.busy} @change=${t=>e.onFromPage(t.target.value)}>
      <option value="" ?selected=${s.fromPage===void 0} disabled>Pick a page</option>
      ${r.pages.map(t=>c`<option value=${V(t)} ?selected=${s.fromPage!==void 0&&f(s.fromPage,V(t))}>${E(t)}</option>`)}
    </select></label>`}function ms(s,r,e,t){let n=s.name===""?s.entityId:`${s.name} (${s.entityId})`;return c`<label class="np-miss" title=${s.entityId}>
    <span class="np-miss-n">${n}</span>
    <select ?disabled=${e.busy} aria-label=${`Use for ${n}`} @change=${i=>t.onSharedPick(s.entityId,i.target.value)}>
      <option value="" ?selected=${r===""}>Leave it (shows as missing)</option>
      ${s.choices.map(i=>c`<option value=${i.entityId} ?selected=${i.entityId===r}>${i.name}</option>`)}
    </select>
  </label>`}function fs(s,r,e){let t=s.shared??"",n=t.trim()===""?void 0:R(t),i=r.hass?.states??{},a=n?.ok===!0?G(n.share,i):[],o=d=>{let p=d.target,l=p.files?.[0];p.value="",l!==void 0&&l.text().then(h=>e.onShared(h))};return c`<textarea class="np-paste" spellcheck="false" placeholder="Paste the shared page here" aria-label="Shared page text"
      .value=${_(t)} ?disabled=${s.busy} @input=${d=>e.onShared(d.target.value)}></textarea>
    <div class="np-paste-row">
      <label class="lib-new-btn np-file">Open a file…<input type="file" accept=".json,application/json,text/plain" hidden ?disabled=${s.busy} @change=${o} /></label>
      ${n===void 0?c`<span class="np-none">In Pages, a page's ··· has Share page.</span>`:n.ok?c`<span class="np-none">${Di(Xe(n.share,i))}</span>`:c`<span class="np-none np-bad">${n.error}</span>`}
    </div>
    ${a.length===0?u:c`<div class="np-room np-misses">
      ${a.map(d=>ms(d,s.sharedPicks?.[d.entityId]??"",s,e))}
    </div>`}`}function zi(s,r,e){let t=Y(s,r),n=["empty","room","page","shared","map"];return c`<dialog class="new-dialog lib-new lib-new-page" aria-label="New page" @close=${()=>e.onClose()}
    @cancel=${i=>{i.preventDefault(),s.busy||e.onClose()}}>
    <form class="lib-new-form" @submit=${i=>{i.preventDefault(),t===void 0&&!s.busy&&e.onMake()}}>
      <div class="new-head">
        <h2>New page</h2>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Cancel" aria-label="Cancel" ?disabled=${s.busy} @click=${()=>e.onClose()}>${x("close")}</button>
      </div>
      <div class="new-body">
        <section class="new-step step-name">
          <div class="new-step-head"><span class="new-step-title">Name</span></div>
          <input type="text" class="new-name" .value=${_(s.name)} maxlength="80" autofocus aria-label="New page name"
            ?disabled=${s.busy} @input=${i=>e.onName(i.target.value)} />
        </section>
        ${r.devices.length===0?u:c`<section class="new-step np-step">
          <div class="new-step-head"><span class="new-step-title">Show on</span>${s.ticksHint===void 0?u:c`<span class="new-step-hint">${s.ticksHint}</span>`}</div>
          ${hs(s,r,e)}
          ${r.waitOuts??u}
        </section>`}
        <section class="new-step np-step">
          <div class="new-step-head"><span class="new-step-title">Start</span></div>
          <div class="np-starts" role="radiogroup" aria-label="Start">
            ${n.map(i=>{let a=s.start===i,o=i==="map"&&r.mapFloorId===void 0;return c`<button type="button" class="np-start ${a?"on":""}" role="radio" aria-checked=${a?"true":"false"}
                data-start=${i} ?disabled=${s.busy||o} title=${Fi(i,r.mapRefusal)} @click=${()=>e.onStart(i)}>
                ${x(ls(i))}<span class="np-start-t">${cs[i]}${i==="map"?At("ALPHA"):u}</span>
                <span class="np-start-n">${Fi(i,i==="map"?r.mapRefusal:void 0)}</span>
              </button>`})}
          </div>
          ${s.start==="room"?us(s,r,e):s.start==="page"?gs(s,r,e):s.start==="shared"?fs(s,r,e):u}
        </section>
        ${s.note===void 0?u:c`<p class="lt-line ${s.note.kind}" role="status">${s.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${ps(s,r,r.devices)}</span>
        <button type="button" class="lib-new-btn" ?disabled=${s.busy} @click=${()=>e.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary" ?disabled=${t!==void 0||s.busy} title=${t??"Make the page"}>${s.busy?"Making\u2026":"Create"}</button>
      </div>
    </form>
  </dialog>`}function et(s){let r=s?.querySelector?.(rs);r&&(!r.open&&typeof r.showModal=="function"&&r.showModal(),r.querySelector("input.new-name")?.select())}var Ki=A`
  .lib-new .new-step.np-step { background: none; }
  .np-devices { display: flex; flex-wrap: wrap; gap: 6px 24px; }
  .np-group { display: flex; flex-direction: column; gap: 3px; min-width: 160px; }
  .np-kind { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .np-kind svg { width: 13px; height: 13px; }
  .np-check { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 2px 0 2px 2px; cursor: pointer; }
  .np-check input { margin: 0; accent-color: var(--wa-accent); }
  .np-starts { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 6px; }
  .np-start {
    display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding: 8px 9px; text-align: left; cursor: pointer;
    font: inherit; border-radius: 9px; border: 1px solid var(--wa-line); background: var(--wa-raised, var(--wa-card)); color: var(--wa-muted);
  }
  .np-start svg { width: 18px; height: 18px; }
  .np-start:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
  .np-start:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .np-start.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); box-shadow: 0 0 0 2px var(--wa-sel-ring); color: var(--wa-ink); }
  .np-start:disabled { opacity: .5; cursor: default; }
  .np-start-t { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
  .np-start-n { font-size: 10.5px; line-height: 1.3; }
  .np-area { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--wa-muted); }
  .np-area select {
    flex: 1; min-width: 0; height: 30px; padding: 0 8px; border-radius: 7px; border: 1px solid var(--wa-line-strong);
    font: inherit; font-size: 13px; color: var(--wa-ink); background: var(--wa-input, var(--wa-field));
  }
  .np-room { display: flex; flex-direction: column; gap: 1px; max-height: 240px; overflow-y: auto; padding-right: 4px; }
  .np-more { margin: 8px 0 2px; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .np-none { margin: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
  .np-bad { color: var(--wa-danger, #d33); }
  .np-paste {
    width: 100%; box-sizing: border-box; min-height: 96px; max-height: 200px; resize: vertical; padding: 8px; border-radius: 7px;
    border: 1px solid var(--wa-line-strong); font: 11.5px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--wa-ink);
    background: var(--wa-input, var(--wa-field));
  }
  .np-paste-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .np-file { cursor: pointer; display: inline-flex; align-items: center; }
  .np-misses { gap: 6px; }
  .np-miss { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: 8px; font-size: 12.5px; }
  .np-miss-n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .np-miss select {
    min-width: 0; height: 28px; padding: 0 6px; border-radius: 7px; border: 1px solid var(--wa-line-strong);
    font: inherit; font-size: 12.5px; color: var(--wa-ink); background: var(--wa-input, var(--wa-field));
  }
`;var ws="dialog.lib-share-page";function ks(s,r){try{let e=URL.createObjectURL(new Blob([s],{type:"application/json"})),t=document.createElement("a");return t.href=e,t.download=r,document.body.append(t),t.click(),t.remove(),setTimeout(()=>URL.revokeObjectURL(e),1e4),!0}catch{return!1}}function Ui(s,r){let e=async()=>{let i=await ii(s.text);r.onSaid(i?{kind:"ok",text:"Copied. Send it to them."}:{kind:"err",text:"The browser did not copy it. Use Download instead."})},t=()=>{let i=ks(s.text,s.fileName);r.onSaid(i?{kind:"ok",text:`Saved as ${s.fileName}.`}:{kind:"err",text:"The browser did not save it. Use Copy instead."})},n=s.entities===1?"1 entity":`${s.entities} entities`;return c`<dialog class="new-dialog lib-new lib-share-page" aria-label="Share page" @close=${()=>r.onClose()}
    @cancel=${i=>{i.preventDefault(),r.onClose()}}>
    <div class="lib-new-form">
      <div class="new-head">
        <h2>Share ${s.name}</h2>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Close" aria-label="Close" @click=${()=>r.onClose()}>${x("close")}</button>
      </div>
      <div class="new-body">
        <p class="sp-lead">Send this text or file to the other person. In Pages they pick New page, then Paste a page.</p>
        <textarea class="sp-text" readonly spellcheck="false" aria-label="Shared page text" .value=${s.text}
          @focus=${i=>i.target.select()}></textarea>
        <p class="sp-note">It has the page's tiles and the ids and names of its ${n}. It has no states, no photos and nothing else from your home.</p>
        ${s.said===void 0?u:c`<p class="lt-line ${s.said.kind==="ok"?"ok":"err"}" role="status">${s.said.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count"></span>
        <button type="button" class="lib-new-btn" @click=${t}>${x("download")} Download</button>
        <button type="button" class="lib-new-btn primary" @click=${()=>{e()}}>Copy text</button>
      </div>
    </div>
  </dialog>`}function ji(s){let r=s?.querySelector?.(ws);r&&!r.open&&typeof r.showModal=="function"&&r.showModal()}var Gi=A`
  .lib-share-page .sp-lead, .lib-share-page .sp-note { margin: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
  .lib-share-page .sp-text {
    width: 100%; box-sizing: border-box; height: 180px; resize: vertical; padding: 8px; border-radius: 7px;
    border: 1px solid var(--wa-line-strong); font: 11.5px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--wa-ink);
    background: var(--wa-input, var(--wa-field));
  }
  .lib-share-page .lib-new-btn svg { width: 14px; height: 14px; vertical-align: -2px; }
`;var J=200,ge=320,bs=120,vs=80,ys=172,xs=116,qi=190,Yi=320,Ji=6,M=Rt.screen;function Xi(s,r,e,t=M){if(z(s))return{top:0,height:t.height};let n=Vt(zt(s,r),t),i=[...n.tiles,...jt(s,t,{states:r})];if(i.length===0)return{top:0,height:t.height};let o=Kt(s,1,n.topInset,e)!==u?0:Math.max(0,n.topInset+Math.min(...i.map(p=>p.y))-Ji),d=n.topInset+Math.max(...i.map(p=>p.y+p.height))+Ji;return{top:o,height:Math.max(1,d-o)}}var $s=2e3,tt=44,Qi=28,es={pages:"wrist-assistant-panel.all-pages.v2",status_pages:"wrist-assistant-panel.all-status-pages.v2"};function O(s){return["watch","iphone"].filter(r=>s.some(e=>e.kind===r))}var nt=new Map;function ts(s){let r=nt.get(s);if(r!==void 0)return r;let e={view:"cards"};try{let t=window.localStorage.getItem(es[s]);(t?JSON.parse(t):{}).view==="board"&&(e.view="board")}catch{}return nt.set(s,e),e}function Ps(s,r){let e={...ts(s),...r};nt.set(s,e);try{window.localStorage.setItem(es[s],JSON.stringify(e))}catch{}}var B=(s,r="pages")=>(r==="status_pages"?un(s)?.dirty:ln(s)?.dirty)??!1,Zi=(s,r)=>`${s}|${r.toUpperCase()}`,g=class extends it{constructor(){super(...arguments);this.kind="pages";this.owners=[];this.ownersReady=!1;this.phones=!1;this.iconsTick=0;this.embedded=!1;this.searchText="";this.search="";this.screensFilter="all";this.cardPicks=new Map;this.selecting=!1;this.selected=new Set;this.asking=!1;this.tickNotes=new Map;this.picksBusy=!1;this.hiddenAsked=new Map;this.freeFacts=new Map;this.saved=!1;this.hassDrawnAt=0;this.kindSeq=0;this.freeAsked=new Set;this.lib=new Dt(this,()=>this.hassNow,()=>this.devices.map(e=>e.ownerId));this.photoTick=0;this.photos=new hn(()=>this.hassNow,()=>{this.photoTick+=1,this.requestUpdate()});this.photoUrl=e=>this.photos.url(e);this.photoSize=e=>this.photos.size(e);this.photoGlow=e=>this.photos.glow(e);this.photoOn=e=>this.photos.onUrl(e);this.photoOnMask=e=>this.photos.onMask(e);this.roomy=new kn(this);this.tabsMenu=new _n(this);this.colorsFor=Ht();this.colorOf=e=>_t(this.colorsFor(this.owners),e);this.onKeyDown=e=>{e.key==="Escape"&&(this.itemAsk!==void 0?(e.preventDefault(),this.itemAsk=void 0):this.asking&&this.bulkBusy===void 0?(e.preventDefault(),this.asking=!1):this.selecting&&this.bulkBusy===void 0&&(e.preventDefault(),this.endSelect()))}}get hass(){return this.hassNow}set hass(e){let t=this.hassNow===void 0;this.hassNow=e;let n=Date.now();(t||n-this.hassDrawnAt>=$s)&&(this.hassDrawnAt=n,this.requestUpdate())}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),clearTimeout(this.savedTimer)}willUpdate(e){if(e.has("kind")&&e.get("kind")!==void 0&&this.kindChanged(),e.has("focusOwner")&&(this.view==="board"&&this.focusOwner!==void 0?this.endSelect(!0):this.pruneSelected()),this.embedded&&e.has("searchText")&&(this.search=this.searchText),this.kind==="pages")for(let t of this.devices)this.freeAsked.has(t.ownerId)||this.readFree(t.ownerId);this.openNewPageAsked()}openNewPageAsked(){if(this.embedded||this.kind!=="pages")return;let e=An();if(e===void 0)return;let t=this.lib.readState;if(t==="failed"||t==="unsupported"){Ae();return}let n=this.lib.library,i=this.devices.find(a=>f(a.ownerId,e));if(!(n===void 0||i===void 0)){if(Ae(),!this.mayMake||this.waiting(n).has(i.ownerId)){this.newPage(i);return}this.pageForm=Ze(this.nextCardName(),[i.ownerId],Hi),this.updateComplete.then(()=>et(this.renderRoot))}}kindChanged(){this.kindSeq++,this.search="",this.endSelect(!0),this.newForm=void 0,this.pageForm=void 0,this.copyForm=void 0,this.screensFilter="all",this.tabsMenu.toggle(!1),this.picksNote=void 0,this.tickNotes=new Map,this.untickAsk=void 0}get filter(){return Kn(this.focusOwner,this.devices)}filterDevice(){let e=this.filter;return e===de?void 0:this.devices.find(t=>t.ownerId===e)}get view(){return this.embedded||Mn(this.kind,this.filterDevice()?.ownerId)?"board":mn(this.kind,ts(this.kind).view)}get devices(){return pt(this.owners,this.phones)}waiting(e){let t=new Map;for(let n of this.devices)t.set(n.ownerId,{held:$t(e,n.ownerId,this.kind),free:!1});return gt(this.owners,t)}setFocus(e){e!==void 0&&this.endSelect(!0),this.picksNote=void 0,Me(this.kind,e),this.onFocus?.(e)}setView(e){fn(this.kind,e),Ps(this.kind,{view:e}),e==="cards"&&Me(this.kind,void 0),this.requestUpdate()}pickTab(e){On(this.kind,e===se),this.onFocus?.(e===de||e===se?void 0:e),this.pruneSelected(),this.requestUpdate()}currentTab(){return this.filterDevice()?.ownerId??(ae(this.kind)?se:de)}renderTabs(e,t){let n=this.currentTab(),i=L(e,this.kind);return Cn({tabs:Rn({devices:t,current:n,total:i.length,countOf:a=>U(e,a,this.kind),shelved:i.filter(a=>a.owners.length===0).length}),current:n,open:this.tabsMenu.open,onToggle:this.tabsMenu.toggle,onPick:a=>this.pickTab(a),styleOf:a=>{let o=this.colorOf(a);return o===void 0?u:`--dc:${o}`}})}flashSaved(){clearTimeout(this.savedTimer),this.saved=!0,this.savedTimer=setTimeout(()=>{this.saved=!1},wn)}setSearch(e){this.search=e,this.pruneSelected()}async newPage(e){let t=this.hassNow,n=this.lib.store;if(t===void 0||n===void 0||this.picksBusy)return;this.newForm=void 0;let i=this.kind;if(B(e.ownerId,i)){this.picksNote={kind:"warn",text:ee(i,e.name)};return}let a=Et(this.owners,this.lib.library,e.ownerId,i);if(!a.go){this.picksNote=a.note===void 0?void 0:{kind:"warn",text:`Not made on ${e.name}. ${a.note}`};return}let o=X(),d=this.nextCardName(),p=i==="status_pages"?ye(d,o):K(o,d);this.picksBusy=!0,this.picksNote=void 0;let l=!1;try{let h=await Se(De(t),e.ownerId,i,{add:p});l=h.ok&&h.changed,h.ok||(this.picksNote={kind:"err",text:`Not made on ${e.name}. ${h.message}`})}catch(h){this.picksNote={kind:"err",text:Q(h).message}}await n.refresh(),this.picksBusy=!1,l&&this.onOpenLibrary?.(i,o,e.ownerId)}get mayMake(){return this.hassNow?.user?.is_admin===!0}toggleNew(){if(!(this.newForm?.busy||this.pageForm?.busy)){if(this.newForm!==void 0||this.pageForm!==void 0){this.newForm=void 0,this.pageForm=void 0;return}if(this.kind==="pages"){let e=this.lib.library,t=e===void 0?new Set:this.waiting(e),n=Oi();this.pageForm=Ze(this.nextCardName(),Ai(this.devices,n,i=>t.has(i)),n===void 0?void 0:_i),this.updateComplete.then(()=>et(this.renderRoot));return}this.newForm={name:this.nextCardName(),busy:!1,preview:O(this.devices)[0]},this.updateComplete.then(()=>pn(this.renderRoot))}}pageSheetContext(){let e=this.lib.library,t=this.homeMapDoc(),n=Ie(t),i=Te(t),a=e===void 0?[]:L(e,"pages").map(o=>o.item);return{...this.hassNow===void 0?{}:{hass:this.hassNow},pages:a,...n===void 0?{}:{mapFloorId:n},...i===void 0?{}:{mapRefusal:i}}}async makePage(){let e=this.pageForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=this.pageSheetContext(),i=Y(e,n);if(i!==void 0){this.pageForm={...e,note:{kind:"warn",text:e.name.trim()===""?`Give the ${v(this.kind)} a name.`:i}};return}let a=Wi(e,n,X());if(a===void 0||!Lt(this.owners,this.lib.library,e.owners,"pages"))return;let{note:o,...d}=e;this.pageForm={...d,busy:!0};let p=await t.createItem("pages",a);if(!p.ok){this.pageForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${p.text}`}};return}Mi(e.owners);for(let h of e.owners)await t.pick(h,"pages",p.reply.id,!0);this.pageForm=void 0;let l=this.devices.find(h=>e.owners.some(b=>f(b,h.ownerId)));Re(l?.kind??O(this.devices)[0]??"watch"),this.onOpenLibrary?.("pages",p.reply.id)}openCopy(e,t=[]){e.kind==="pages"&&(this.copyForm=tn(e.id,e.name,Ee(e.owners,this.devices),t),this.updateComplete.then(()=>on(this.renderRoot)))}openShare(e){if(e.kind!=="pages")return;let t=e.item,n=this.hassNow?.states??{};this.shareForm={name:e.name,text:Ii(t,n),fileName:Ti(t),entities:ue(t,i=>Object.hasOwn(n,i)).length},this.updateComplete.then(()=>ji(this.renderRoot))}pastedPage(e,t){let n=R(t);if(!n.ok)return{...e,shared:t};let i=this.hassNow?.states??{},a={...Ni(G(n.share,i)),...e.sharedPicks??{}},o=e.name.trim()===""||e.name===this.nextCardName()?E(n.share.page):e.name;return{...e,shared:t,sharedPicks:a,name:o}}copyHolders(e){let t=this.lib.library,n=t===void 0?void 0:L(t,"pages").find(i=>f(i.id,e.itemId));return Ee(n?.owners??[],this.devices)}async makeCopy(){let e=this.copyForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=this.copyHolders(e);this.copyForm={...e,busy:!0};let i=await sn(t,e,n,this.devices);this.copyForm?.itemId===e.itemId&&(this.copyForm=i)}renderCopy(e){let t=this.copyHolders(e);return an(e,t,{onTick:(n,i)=>{this.copyForm!==void 0&&(this.copyForm=nn(this.copyForm,t,n,i))},onName:n=>{this.copyForm!==void 0&&(this.copyForm={...this.copyForm,copyName:n,named:!0})},onMake:()=>{this.makeCopy()},onOpen:n=>{this.copyForm=void 0,this.onOpenLibrary?.("pages",n)},onClose:()=>{this.copyForm?.busy||(this.copyForm=void 0)}})}renderPageSheet(e,t){let n=this.lib.library,i=n===void 0?new Set:this.waiting(n),a=d=>{this.pageForm=d},o=this.pageSheetContext();return zi(e,{...o,devices:t,locked:d=>{if(!i.has(d))return;let p=t.find(l=>l.ownerId===d);return Z(p?.appVersion,p?.phoneMoves)},waitOuts:n===void 0?u:te(this.hassNow,this.owners,n,"pages")},{onName:d=>a({...e,name:d}),onDevice:(d,p)=>a(Bi(e,t,d,p)),onStart:d=>a({...e,start:d}),onArea:d=>{let{picked:p,...l}=e;a({...l,areaId:d})},onEntity:(d,p)=>a(Ci(e,H(o.hass,e.areaId),d,p)),onFromPage:d=>a({...e,fromPage:d}),onShared:d=>a(this.pastedPage(e,d)),onSharedPick:(d,p)=>a({...e,sharedPicks:{...e.sharedPicks??{},[d]:p}}),onMake:()=>{this.makePage()},onClose:()=>{e.busy||(this.pageForm=void 0)}})}nextCardName(){let e=this.lib.library,t=e===void 0?[]:L(e,this.kind).map(n=>n.item);return this.kind==="status_pages"?yt({schemaVersion:1,statusPages:t}):vt({schemaVersion:1,pages:t})}async makeCard(){let e=this.newForm,t=this.lib.store;if(e===void 0||e.busy||t===void 0)return;let n=e.name.trim();if(n===""){this.newForm={...e,note:{kind:"warn",text:`Give the ${v(this.kind)} a name.`}};return}let{note:i,...a}=e;this.newForm={...a,busy:!0};let o=X(),d=e.mapPage===!0?Ie(this.homeMapDoc()):void 0,p=this.kind==="status_pages"?{schemaVersion:1,statusPages:[ye(n,o)]}:{schemaVersion:1,pages:[d===void 0?K(o,n):ne(o,n,d)]},l=await t.createItem(this.kind,p);if(!l.ok){this.newForm={...e,busy:!1,note:{kind:"err",text:`Not made. ${l.text}`}};return}this.newForm=void 0,Re(e.preview??O(this.devices)[0]??"watch"),this.onOpenLibrary?.(this.kind,l.reply.id)}open(e){this.onOpenLibrary?.(e.kind,e.id,this.focusOwner)}async tick(e,t,n){let i=this.lib.store;if(i===void 0||n&&!Ft(this.owners,this.lib.library,t,e.kind))return;this.dropTickNote(P(e)),this.untickAsk=void 0;let a={item:e.name,device:this.devices.find(k=>k.ownerId===t)?.name??"the device"};if(!n){this.untickAsk=await en(this.hassNow,i,t,e.kind,e.id,a);return}let o=P(e);if(!(await Le(this.hassNow,i,t,e.kind,e.id,!0,a,{onUndone:()=>this.dropTickNote(o)})).ok||e.kind!=="pages")return;let p=await this.readFree(t),l=this.lib.library,h=this.devices.find(k=>k.ownerId===t)?.name;if(!p||l===void 0||h===void 0||U(l,t,"pages")<2)return;let b=mt([h]);b!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(o,{kind:"ok",text:b}))}async untickNow(e){let t=this.lib.store;if(this.untickAsk=void 0,t===void 0)return;let n=P({id:e.itemId}),i=await Le(this.hassNow,t,e.ownerId,e.kind,e.itemId,!1,e.names,{onUndone:()=>this.dropTickNote(n)});i.note!==void 0&&(this.tickNotes=new Map(this.tickNotes).set(n,i.note))}dropTickNote(e){if(!this.tickNotes.has(e))return;let t=new Map(this.tickNotes);t.delete(e),this.tickNotes=t}async readFree(e){let t=this.hassNow;if(t===void 0)return!1;this.freeAsked.add(e);try{let i=(await ot(t,e,"pages")).multiple_pages===!1;return this.freeFacts.get(e)!==i&&(this.freeFacts=new Map(this.freeFacts).set(e,i)),i}catch{return this.freeFacts.get(e)??!1}}async changePicks(e,t,n){let i=this.hassNow,a=this.lib.store;if(i===void 0||a===void 0||this.picksBusy)return;let o=this.kind;if(B(e.ownerId,o)){this.picksNote={kind:"warn",text:ee(o,e.name)};return}let d=this.kindSeq,p="hidden"in t,l=Zi(e.ownerId,t.id);this.picksBusy=!0,this.picksNote=void 0,p?this.hiddenAsked=new Map(this.hiddenAsked).set(l,t.hidden):n!==void 0&&(this.orderAsked={ownerId:e.ownerId,kind:o,ids:Gn(n,t.id,t.before)});let h=this.orderAsked,b;try{let k=await Se(De(i),e.ownerId,o,t);k.ok&&this.flashSaved(),k.ok||(b={kind:"err",text:`${p?"Not changed":"Not moved"} on ${e.name}: ${k.message.replace(/\.$/,"")}.`})}catch(k){b={kind:"err",text:Q(k).message}}if(await a.refresh(),this.picksBusy=!1,p){let k=new Map(this.hiddenAsked);k.delete(l),this.hiddenAsked=k}else this.orderAsked===h&&(this.orderAsked=void 0);d===this.kindSeq&&(this.picksNote=b)}shownNow(){let e=this.lib.library;return e===void 0?[]:this.shownOf(e)}onTab(e){if(this.view==="cards"){let t=this.filterDevice();if(t!==void 0)return Be(e,t,this.kind,this.search).picks.map(n=>n.entry);if(ae(this.kind))return He(e,this.kind,this.search).filter(n=>n.owners.length===0)}return He(e,this.kind,this.search)}shownOf(e){let t=this.onTab(e);return this.kind!=="pages"||this.screensFilter==="all"?t:t.filter(n=>gi(this.screensFilter,n.item))}emptyHere(e){if(this.kind==="pages"&&this.screensFilter!=="all"&&this.search.trim()==="")return mi();if(this.view==="cards"&&this.search.trim()===""){let t=this.filterDevice(),n=v(this.kind,2),i=this.lib.library;if(t!==void 0)return i!==void 0&&this.waiting(i).has(t.ownerId)?we(n,t.name,t.appVersion,t.phoneMoves):`No ${n} on ${t.name} yet.`;if(ae(this.kind))return`Every ${v(this.kind)} is on a device.`}return ze(e,this.search,this.kind)}pickedItems(){return this.shownNow().filter(e=>this.selected.has(P(e)))}pruneSelected(){this.selected.size!==0&&(this.selected=di(this.selected,this.shownNow().map(P)))}startSelect(){this.selecting=!0,this.itemAsk=void 0,this.bulkNote=void 0}endSelect(e=!1){this.bulkBusy!==void 0&&!e||(this.selecting=!1,this.selected=new Set,this.anchor=void 0,this.asking=!1,this.bulkNote=void 0)}cardClick(e,t){let n=e.metaKey||e.ctrlKey;if(!this.selecting&&!n){this.open(t);return}e.preventDefault(),e.stopPropagation(),this.pick(t,e.shiftKey&&this.selecting&&!n)}pick(e,t){if(this.bulkBusy!==void 0)return;this.selecting||this.startSelect();let n=P(e);this.selected=t?ai(this.selected,this.shownNow().map(P),this.anchor,n):si(this.selected,n),this.anchor=n,this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}selectShown(e){if(this.bulkBusy!==void 0)return;let t=this.shownNow().map(P);this.selected=e?ri(this.selected,t):oi(this.selected,t),this.bulkNote=void 0,this.selected.size===0&&(this.asking=!1)}toggleAsk(){this.bulkBusy===void 0&&(this.asking=!this.asking,this.bulkNote=void 0,this.asking&&this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".pk-bar .pk-bar-cancel")?.focus()}))}runDelete(){let e=this.pickedItems();e.length!==0&&(this.asking=!1,this.anchor=void 0,this.deleteEntries(e),this.pruneSelected())}deleteEntries(e){let t=this.hassNow,n=this.lib.store;if(t===void 0||n===void 0||this.bulkBusy!==void 0)return;let i=this.devices,a=pe(e,i,B),o=Ue({kind:a.kind,gone:[],kept:a.kept,failed:[],stuck:[],taps:[]});if(this.bulkNote=a.kept.length>0?o:void 0,a.items.length===0)return;let d=a.items.length;Nt({text:`Deleted ${d===1?a.items[0].name:ci(a.kind,d)}.`,hide:a.items.map(p=>Tt(a.kind,p.id)),send:async()=>{let p;try{p=Ue(await pi(Zt(t),{...a,kept:[]},i))}catch(l){p={kind:"err",text:Q(l).message}}return await n.refresh(),p.kind==="ok"?void 0:p.text}})}renderItemDelete(e,t){return c`<button type="button" class=${t} title=${`Delete ${e.name}`} aria-label=${`Delete ${e.name}`}
      ?disabled=${this.bulkBusy!==void 0}
      @click=${n=>{n.stopPropagation(),this.itemAsk=P(e)}}>${x("delete")}</button>`}renderItemAsk(e,t,n){let i=pe([e],t,B),a=Ke(i,t),o=()=>{this.itemAsk=void 0},d=()=>{o(),this.deleteEntries([e])},p=n!==void 0&&e.owners.some(h=>f(h,n.ownerId))&&e.owners.some(h=>!f(h,n.ownerId))?n:void 0,l=i.items.length>0;return c`<div class="ap-ask" role="alertdialog" aria-label=${`Delete ${e.name}?`} @click=${h=>h.stopPropagation()}>
      <span><b>Delete ${e.name}?</b> ${a.body}</span>
      <span class="ap-ask-acts">
        ${l?p===void 0?c`<button type="button" class="ap-ask-btn danger" @click=${d}>Really delete</button>`:c`<button type="button" class="ap-ask-btn danger" title=${`Take it off ${p.name} only`}
              @click=${()=>{o(),this.tick(e,p.ownerId,!1)}}>${Tn}</button>
            <button type="button" class="ap-ask-btn danger" title="Delete it on every device" @click=${d}>${Nn}</button>`:u}
        <button type="button" class="ap-ask-btn" @click=${o}>${l?"Cancel":"Close"}</button>
      </span>
    </div>`}render(){let e=this.devices;if(e.length===0&&!this.ownersReady)return c`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;if(this.embedded)return this.renderEmbedded();let t=this.kind,n=this.lib.library,i=this.lib.readState,a=this.filterDevice(),o=v(t,2),d=this.view,p=n===void 0?i==="unsupported"?$e:i==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${o}\u2026`:Wn(L(n,t).length,t),l=n!==void 0&&i==="failed";return c`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${_e(t)}</h1>
          <p class="ap-lead">${p}</p>
        </div>
        ${e.length===0?u:this.renderNew(a,e)}
      </div>
      ${this.newForm===void 0?u:this.renderNewDialog(this.newForm,e)}
      ${this.pageForm===void 0?u:this.renderPageSheet(this.pageForm,e)}
      ${this.copyForm===void 0?u:this.renderCopy(this.copyForm)}
      ${this.shareForm===void 0?u:Ui(this.shareForm,{onSaid:h=>{this.shareForm!==void 0&&(this.shareForm={...this.shareForm,...h===void 0?{}:{said:h}})},onClose:()=>{this.shareForm=void 0}})}
      ${l?c`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError??""} It shows as last read.</p>`:u}
      ${this.renderTwoScreensCard(n)}
      ${n===void 0?u:te(this.hassNow,this.owners,n,t)}
      <div class="pk-surface pk-page ${d==="board"?"on-board":""}" role="region" aria-label=${`Your ${o}`}>
        <div class="pk-pin">
          ${this.renderHead(n,a,d)}
          ${d==="cards"&&n!==void 0&&e.length>0?this.renderTabs(n,e):u}
          ${this.selecting&&d!=="board"?this.renderBar(e):u}
        </div>
        <div class="pk-body" id=${d==="cards"?"pk-tabpanel":u} role=${d==="cards"?"tabpanel":u}>
          ${n===void 0?c`<p class="ap-empty">${p}</p>`:d==="cards"?c`${this.renderPicksNote()}${this.renderAll(n,e)}`:a!==void 0?this.renderFocus(n,Be(n,a,t,this.search),e):this.renderBoardAll(n,e)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${zn(t,a,this.selecting&&(a===void 0||d==="cards"),d)}</span></div>
      </div>
    </div></div>`}renderTwoScreensCard(e){return this.kind!=="pages"||e===void 0||L(e,"pages").length===0||vi()?u:c`<div class="ap-upgrade" role="note">
      ${x("info")}<span>${fi()}</span>
      <button type="button" class="ap-upgrade-x" title="Dismiss" aria-label="Dismiss"
        @click=${()=>{yi(),this.requestUpdate()}}>${x("close")}</button>
    </div>`}renderEmbedded(){let e=this.lib.library,t=this.devices,n=v(this.kind,2),i=this.lib.readState;if(e===void 0){let o=i==="unsupported"?$e:i==="failed"?this.lib.store?.readError??"Could not read the library.":`Reading the ${n}\u2026`;return c`<p class="ap-empty">${o}</p>`}if(t.length===0)return c`<p class="ap-empty">No device can have ${n}.</p>`;let a=L(e,this.kind).length===0?c`<p class="ap-empty">No ${n} yet.</p>`:this.renderBoardAll(e,t);return c`${this.saved?c`<span class="bd-saved ap-embed-saved" role="status">${x("check")}<span>Saved</span></span>`:u}${te(this.hassNow,this.owners,e,this.kind)}${a}`}renderAll(e,t){let n=this.renderEmptyLibrary(e,t);if(n!==void 0)return n;let i=this.shownOf(e);if(i.length===0)return c`<p class="ap-empty">${this.emptyHere(t)}</p>`;let a=this.waiting(e);return c`<div class="ap-grid ${this.comparingScreens()?"differ":""}" role="list">${i.map(o=>this.renderCard(e,o,t,a))}</div>`}renderEmptyLibrary(e,t){if(t.length===0||L(e,this.kind).length>0)return;let n=this.mayMake,i=this.waiting(e),a=i.size>0;return c`<div class="ap-empty-lib">${Fn(this.kind==="pages"?"pages":"status-pages",{note:c`<p class="ap-empty-note">${Vn(this.kind,n)}</p>
        ${a?c`<p class="ap-empty-wait">${lt(v(this.kind,2),ht(t,i),ut(t,i))}</p>`:u}`,actions:n?c`<button type="button" class="ap-new-btn" ?disabled=${this.newForm?.busy===!0} @click=${()=>this.toggleNew()}>
        ${x("plus")}<span>New ${v(this.kind)}</span></button>`:u})}</div>`}renderHead(e,t,n){let i=this.selecting,a=this.bulkBusy!==void 0,o=v(this.kind,2);return c`<div class="pk-head">
      ${bn(n,d=>this.setView(d),o)}
      ${n==="board"?vn(Ce(),d=>{gn(d),this.requestUpdate()}):u}
      ${t===void 0||n==="cards"?c`<button type="button" class="pk-pick-btn ${i?"on":""}" aria-pressed=${i?"true":"false"}
        title=${i?`Back to opening one ${v(this.kind)} at a time`:`Pick several ${o} to delete together`}
        ?disabled=${a||e===void 0} @click=${()=>i?this.endSelect():this.startSelect()}>
        ${x("checklist")}<span>Multi select</span></button>`:u}
      ${this.saved?c`<span class="bd-saved" role="status">${x("check")}<span>Saved</span></span>`:u}
      ${this.kind==="pages"&&(t===void 0||n==="cards")?this.renderScreensFilter():u}
      <label class="pk-search">
        ${x("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${o}`}
          @input=${d=>this.setSearch(d.target.value)} />
      </label>
    </div>`}renderScreensFilter(){let e=(t,n,i)=>c`<button type="button" class="ap-filter-opt ${this.screensFilter===t?"on":""}"
      role="radio" aria-checked=${this.screensFilter===t?"true":"false"} data-filter=${t} title=${i}
      @click=${()=>{this.screensFilter=t,this.pruneSelected()}}>${n}</button>`;return c`<span class="ap-filter" role="radiogroup" aria-label="Show">
      ${e("all","All","Every page")}${e("differ",ui,`The pages the watch and the ${T("iPhone","phone")} arrange apart, or with a tile off on one`)}
    </span>`}renderNew(e,t){let n=`New ${v(this.kind)}`;if(e!==void 0)return c`<div class="ap-new">
        <button type="button" class="ap-new-btn" title=${`Add ${re(this.kind)} on ${e.name}`}
          ?disabled=${this.picksBusy||this.lib.library===void 0} @click=${()=>{this.newPage(e)}}>
          ${x("plus")}<span>${n}</span></button>
      </div>`;let i=this.mayMake,a=this.newForm!==void 0||this.pageForm!==void 0;return c`<div class="ap-new">
      <button type="button" class="ap-new-btn ${a?"on":""}" aria-expanded=${a?"true":"false"}
        ?disabled=${!i||this.newForm?.busy===!0||this.pageForm?.busy===!0}
        title=${i?`Make ${re(this.kind)} no device has yet`:Bn(this.kind)}
        @click=${()=>this.toggleNew()}>
        ${x("plus")}<span>${n}</span></button>
    </div>`}renderNewDialog(e,t){let n=Te(this.homeMapDoc());return dn(this.kind,e,O(t),{onName:i=>{this.newForm={...e,name:i}},onPreview:i=>{this.newForm={...e,preview:i}},onMapPage:i=>{this.newForm={...e,mapPage:i}},onMake:()=>{this.makeCard()},onClose:()=>{e.busy||(this.newForm=void 0)}},this.kind==="pages"?n===void 0?{}:{refusal:n}:void 0)}homeMapDoc(){return dt(this.hassNow,()=>this.requestUpdate())?.doc}ticksInput(e,t,n,i){let a=this.lib.store,o=P(t),d=a?.noteFor(t.kind,t.id),p=d===void 0?this.tickNotes.get(o):{kind:"warn",text:d},l=this.untickAsk,h=l!==void 0&&l.kind===t.kind&&f(l.itemId,t.id)?l:void 0,b=this.hassNow?.user?.is_admin,k=t.kind==="pages"?Wt(t.item):[];return{library:e,kind:t.kind,itemId:t.id,devices:n,colorOf:this.colorOf,skips:k,...a===void 0?{}:{pending:a.pending},...p===void 0?{}:{note:p.text,noteKind:p.kind},...h===void 0?{}:{ask:{ownerId:h.ownerId,text:h.text,onRemove:()=>{this.untickNow(h)},onCancel:()=>{this.untickAsk=void 0}}},...b===void 0?{}:{admin:b},locked:S=>{let N=xt(e,S,t.kind,t.id);if(N&&B(S,t.kind))return ee(t.kind,n.find($=>$.ownerId===S)?.name??"This device");if(!N&&i.has(S)){let $=n.find(w=>w.ownerId===S);return Z($?.appVersion,$?.phoneMoves)}}}}renderCardTicks(e,t,n,i){return Xt(this.ticksInput(e,t,n,i),(a,o)=>{this.tick(t,a,o)})}renderCard(e,t,n,i){let a=this.selecting,o=P(t),d=a&&this.selected.has(o),p=this.filterDevice()??We(t,n),l=this.openTitle(t),h=k=>this.cardClick(k,t),b=!a&&this.itemAsk===o;return c`<div class="ap-card ${a?"picking":""} ${d?"picked":""} ${b?"asking":""}" role="listitem" data-card=${o}
      @click=${k=>{a&&h(k)}}>
      <div class="ap-top">
        ${a?c`<input type="checkbox" class="pk-card-pick" .checked=${_(d)} ?disabled=${this.bulkBusy!==void 0}
          aria-label=${l}
          @click=${k=>{k.stopPropagation(),this.pick(t,k.shiftKey)}} />`:u}
        <button type="button" class="ap-open" title=${l} tabindex=${a?"-1":"0"} @click=${h}>
          <b class="ap-name">${t.name}</b>
          <small class="ap-detail">${oe(t)}</small>
        </button>
        ${a||t.kind!=="pages"?u:this.renderCopyButton(t)}
        ${a?u:this.renderItemDelete(t,"ap-del")}
      </div>
      ${this.screensLineOf(t,n)===void 0?u:c`<small class="ap-screens">${this.screensLineOf(t,n)}</small>`}
      <div class="ap-thumb-wrap">
        <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${l} style=${this.thumbWellStyle(t,n)} @click=${h}>
          ${t.kind==="status_pages"?this.renderStatusThumb(t):this.renderCardPictures(e,t,p,n)}
        </button>
        ${t.kind==="status_pages"?u:this.renderCardScreenIcons(t,n)}
      </div>
      ${this.renderCardTicks(e,t,n,i)}
      ${b?this.renderItemAsk(t,n):u}
    </div>`}screensLineOf(e,t){return e.kind==="pages"?hi(e.item,e.owners,t):void 0}renderCopyButton(e){return c`<button type="button" class="ap-del ap-copy" title=${e.owners.length<2?Fe:`Make a copy of ${e.name} for some devices`} aria-label=${`Make a copy of ${e.name}`}
      ?disabled=${e.owners.length<2}
      @click=${t=>{t.stopPropagation(),this.openCopy(e)}}>${x("duplicate")}</button>`}openTitle(e){if(this.selecting){let t=this.selected.has(P(e));return`${t?"Let":"Pick"} ${e.name}${t?" go":""}`}return Ve(e.name)}boardColumns(e,t){let n=this.waiting(e);return t.map(i=>({device:i,color:this.colorOf(i.ownerId),count:U(e,i.ownerId,this.kind),...n.has(i.ownerId)?{blocked:yn(i.appVersion,Z(i.appVersion,i.phoneMoves))}:{}}))}renderBoardAll(e,t){let n=this.renderEmptyLibrary(e,t);if(n!==void 0)return n;if(t.length===0)return c`<p class="ap-empty">${ze(t,this.search,this.kind)}</p>`;let i=this.waiting(e),a=this.shownOf(e);return this.renderBoardOf(e,t,[{key:"all",rows:a.map(o=>this.boardRow(e,o,t,i)),empty:this.emptyHere(t)}])}renderBoardOf(e,t,n,i){let a=v(this.kind),o=v(this.kind,2);return $n({label:`${_e(this.kind)} on each device`,thing:a.charAt(0).toUpperCase()+a.slice(1),columns:this.boardColumns(e,t),...i===void 0?{}:{focus:i},onFocus:d=>this.setFocus(d),wide:this.roomy.wide,ordered:!0,focusTitle:d=>`See ${d.name}'s ${o} in its order, and drag to change it`,sections:n,...this.embedded?{}:{legend:{tick:"on that device",focus:"in a device's header to see and drag its order",saves:"Ticks save at once, with Undo",...this.kind==="pages"?{eye:"hide but keep its place"}:{}}},...this.selecting&&i===void 0?{pinned:this.renderBar(t)}:{}})}boardRow(e,t,n,i,a){let o=this.ticksInput(e,t,n,i),d=Jt(o),p=t.kind==="pages"?t.item:void 0,l=p===void 0?0:C(p).length,h=p!==void 0&&l>0&&(o.skips?.length??0)>=l,b=d.map(w=>{if(!w.on&&!w.busy&&i.has(w.ownerId))return{dashTitle:w.title};let F={chip:{...w,title:xn(w)},onPick:me=>{this.tick(t,w.ownerId,me)}};if(a?.order!==void 0&&w.on&&f(w.ownerId,a.device.ownerId)&&(F.order=a.order.at+1),w.on&&w.device==="watch"&&h?(F.note="shows nothing",F.noteWarn=!0,F.noteTitle=`Every tile on ${t.name} is ${T("iPhone","phone")} only, so ${w.name} shows an empty page.`):w.skips!==void 0&&(F.note=w.skips.text,F.noteTitle=w.skips.title),a?.pick!==void 0&&f(w.ownerId,a.device.ownerId)&&t.kind==="pages"){let me=Zi(a.device.ownerId,t.id),fe=this.hiddenAsked.get(me)??a.pick.hidden;F.eye={hidden:fe,busy:this.picksBusy,title:fe?`Show ${t.name} on ${a.device.name} again`:`Hide here: keep ${t.name} on ${a.device.name} without showing it`,onToggle:()=>{this.changePicks(a.device,{id:t.id,hidden:!fe})}}}return F}),k=this.selecting&&a===void 0,S=P(t),N=this.screensLineOf(t,n),$={key:S,name:t.name,detail:N===void 0?oe(t):`${oe(t)} \xB7 ${N}`,picture:this.rowPictures(t,n,a?.pick!==void 0?a.device:void 0),openTitle:a?.pick!==void 0?`${Ve(t.name)}. Alt+Up or Alt+Down moves it.`:this.openTitle(t),onOpen:w=>{if(a?.pick!==void 0&&!w.metaKey&&!w.ctrlKey){this.open(t);return}this.cardClick(w,t)},cells:b,...a!==void 0&&a.pick===void 0?{dim:!0}:{},...a?.drag===void 0?{}:{drag:a.drag},...o.ask===void 0?{}:{ask:o.ask},...o.note===void 0?{}:{note:{text:o.note,kind:o.noteKind??"warn"}},peek:()=>({picture:t.kind==="status_pages"?this.renderStatusThumb(t):this.renderThumbs(e,t,We(t,n),n),where:Qn(t,n,a?.order===void 0?void 0:{device:a.device,at:a.order.at})})};return k?$.select={picked:this.selected.has(S),disabled:this.bulkBusy!==void 0,label:this.openTitle(t),onPick:w=>this.pick(t,w.shiftKey)}:($.actions=this.renderItemDelete(t,"bd-act danger"),$.more=this.rowMore(t,a),this.itemAsk===S&&($.under=this.renderItemAsk(t,n,a?.device))),$}rowMore(e,t){let n=[{label:"Open",onPick:()=>this.open(e)}];e.kind==="pages"&&(n.push({label:"Make a copy\u2026",disabled:e.owners.length<2,title:e.owners.length<2?Fe:`Make a copy of ${e.name} for some of its devices`,onPick:()=>this.openCopy(e,t===void 0?[]:[t.device.ownerId])}),n.push({label:"Share page\u2026",title:`${e.name} as text, to send to someone else`,onPick:()=>this.openShare(e)}));let i=t?.order;if(t!==void 0&&i!==void 0){let a=i.ids[0],o=d=>{this.changePicks(t.device,{id:e.id,before:d},[...i.ids])};i.at>0&&a!==void 0&&n.push({label:"Move to top",onPick:()=>o(a)}),i.at<i.ids.length-1&&n.push({label:"Move to bottom",onPick:()=>o(null)})}else t===void 0&&n.push({label:"Pick several",title:`Pick several ${v(this.kind,2)} to delete together`,onPick:()=>this.pick(e,!1)});return n}rowPictures(e,t,n){if(e.kind==="status_pages")return this.rowPicture(e,n);let i=O(t),a=i.length===0?["watch"]:i,o=d=>n?.kind===d?n:t.find(p=>p.kind===d&&e.owners.some(l=>f(l,p.ownerId)));return c`<span class="ap-pics">${a.map(d=>this.rowPicture(e,o(d),d))}</span>`}rowPicture(e,t,n){let i=Ce()==="compact";if(e.kind==="status_pages")return Dn({page:e.item,hass:this.hassNow,width:i?ie:this.roomy.size(tt),tick:this.iconsTick,...this.icons===void 0?{}:{icons:this.icons}});let a=this.appVersionOf(t),o=(n??t?.kind)==="iphone",d=i?o?Math.round(ie*Qi/tt):ie:this.roomy.size(o?Qi:tt);return Oe({page:e.item,width:d,tick:this.iconsTick,iphone:o,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...a===void 0?{}:{appVersion:a},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask,photoTick:this.photoTick,...o?{homeMap:this.homeMapDoc()}:{}})}appVersionOf(e){return e===void 0?void 0:rt(this.owners.find(t=>f(t.owner_watch_id,e.ownerId)))}renderFocus(e,t,n){let{device:i}=t,a=this.orderAsked,o=a!==void 0&&a.ownerId===i.ownerId&&a.kind===this.kind?a.ids:void 0,d=Un(t.picks,o),p=d.map($=>$.id),l=U(e,i.ownerId,this.kind),h=this.search.trim()===""&&!this.picksBusy,b=this.waiting(e),k=v(this.kind,2),S=d.map(($,w)=>this.boardRow(e,$.entry,n,b,{device:i,pick:$,drag:this.rowDrag($,w,p,i,h),order:{at:w,ids:h?p:[]}})),N=t.rest.map($=>this.boardRow(e,$,n,b,{device:i}));return c`${this.renderFocusHead(i,l)}
      ${this.renderPicksNote()}
      ${this.renderBoardOf(e,n,[{key:"on",title:qn(i),count:l,hint:Yn(i),rows:S,empty:b.has(i.ownerId)&&this.search.trim()===""?we(k,i.name,i.appVersion,i.phoneMoves):ei(i,this.kind,this.search,t.rest.length)},...Zn(l,t.rest.length,this.search)?[{key:"rest",title:Jn(i),count:t.rest.length,hint:Xn(i),rows:N,empty:this.search.trim()===""?`Every ${v(this.kind)} in your home is on ${i.name}.`:`No other ${v(this.kind)} has that name.`}]:[]],i.ownerId)}
      <p class="lt-line bd-foot-line">${l} ${l===1?v(this.kind):k} on ${i.name}.</p>`}renderPicksNote(){return this.picksNote===void 0?u:c`<p class="lt-line ${this.picksNote.kind}" role="status">${this.picksNote.text}</p>`}renderFocusHead(e,t){let n=ct(e.kind,e.platform),i=v(this.kind,t);return Pn({device:e,color:this.colorOf(e.ownerId),text:`${t} ${i}, in the order the ${n} ${this.kind==="pages"?"shows":"keeps"} them`,...this.onOpenScreen===void 0?{}:{onOwn:a=>this.onOpenScreen?.(e.ownerId,e.kind,a)},onAll:()=>this.setFocus(void 0)})}rowDrag(e,t,n,i,a){let o=this.overId!==void 0&&f(this.overId,e.id)&&this.dragId!==void 0&&!f(this.dragId,e.id),d=p=>{p!==void 0&&this.changePicks(i,{id:e.id,before:p},[...n])};return{on:a,dragging:this.dragId!==void 0&&f(this.dragId,e.id),over:o,below:o&&n.findIndex(p=>f(p,this.dragId))<t,onStart:p=>{a&&(this.dragId=e.id,p.dataTransfer?.setData("text/plain",e.id),p.dataTransfer&&(p.dataTransfer.effectAllowed="move"))},onOver:p=>{this.dragId!==void 0&&(p.preventDefault(),this.overId!==e.id&&(this.overId=e.id))},onDrop:p=>{p.preventDefault();let l=this.dragId;this.dragId=void 0,this.overId=void 0;let h=l===void 0?void 0:jn(n,l,e.id);h!==void 0&&this.changePicks(i,h,[...n])},onEnd:()=>{this.dragId=void 0,this.overId=void 0},onKey:p=>{!p.altKey||!a||p.key!=="ArrowUp"&&p.key!=="ArrowDown"||(p.preventDefault(),p.key==="ArrowUp"?d(t>0?n[t-1]:void 0):d(t<n.length-1?n[t+2]??null:void 0))}}}renderBar(e){let t=this.shownNow(),n=t.filter(b=>this.selected.has(P(b))),i=n.length,a=this.bulkBusy!==void 0,o=i===0,d=t.length>0&&t.every(b=>this.selected.has(P(b))),p=a?void 0:this.bulkNote,l=v(this.kind),h=v(this.kind,2);return c`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${h}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy??(o?`Pick ${re(this.kind)} to start.`:`${i} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${a||t.length===0}
        title=${d?`Let the ${h} on screen go`:`Pick every ${l} the search has left`}
        @click=${()=>this.selectShown(!d)}>${d?"None":"All shown"}</button>
      ${p===void 0?u:c`<span class="pk-bar-said ${p.kind}">${p.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.asking&&!o?this.renderDeleteAsk(n,e):c`<button type="button" class="ghost danger small" ?disabled=${a||o}
            title=${`Delete these ${h} from every device they are on`}
            @click=${()=>this.toggleAsk()}>${x("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${a}
        title=${`Stop picking and go back to opening one ${l} at a time`}
        @click=${()=>this.endSelect()}>${x("check")}<span>Done</span></button>
    </div>`}renderDeleteAsk(e,t){let n=pe(e,t,B),i=Ke(n,t);return c`<span class="pk-bar-ask" id="ap-del-ask"><b>${i.title}</b> ${i.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask" ?disabled=${n.items.length===0}
        @click=${()=>this.runDelete()}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${()=>{this.asking=!1}}>Cancel</button>`}renderThumb(e,t,n,i=J){let a=be(t.item,"watch"),o=n===void 0?[]:ft(Pt(e,n.ownerId)),d=o.length===0?[a]:o,p=this.hassNow?.states,l=this.icons,h=i/M.width,b=this.thumbHeight(a,i),k=b>ge,S=Xi(a,p,l),N=w=>`${Math.round(w*100)/100}px`,$=n?.kind==="watch"?this.appVersionOf(n):void 0;return c`<span class="ap-pic ${k?"cut":""}" style=${`width:${N(i)};height:${N(Math.min(b,ge))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${N(-S.top*h)})`}>${Ut({page:a,pages:d,screen:M,scale:h,...p===void 0?{}:{states:p},...l===void 0?{}:{icons:l},...$===void 0?{}:{appVersion:$},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask})}</span>
    </span>`}thumbHeight(e,t){return Xi(e,this.hassNow?.states,this.icons).height*(t/M.width)}comparingScreens(){return this.kind==="pages"&&this.screensFilter==="differ"}cardDrawsBoth(e){return e.length===2&&this.comparingScreens()}cardWatchHeight(e,t){return Math.min(this.thumbHeight(be(e.item,"watch"),t),ge)}thumbWellStyle(e,t){if(e.kind==="status_pages")return u;let n=le(e.owners,t);return n.length===2&&!this.cardDrawsBoth(n)?`min-height:${Math.round(this.cardWatchHeight(e,J))+20}px`:u}renderCardPictures(e,t,n,i){let a=le(t.owners,i);if(this.cardDrawsBoth(a))return this.renderThumbs(e,t,n,i,!0);if(je(a,this.cardPick(t))==="watch")return this.renderThumb(e,t,n?.kind==="watch"?n:void 0);let o=a.includes("watch")?this.cardWatchHeight(t,J):Yi;return c`<span class="ap-pic ap-pic-phone">${this.renderPhoneThumb(t,i,qi,o)}</span>`}cardPick(e){return this.cardPicks.get(P(e))??this.filterDevice()?.kind}renderCardScreenIcons(e,t){let n=le(e.owners,t);if(O(t).length<2||this.cardDrawsBoth(n))return u;let i=P(e),a=je(n,this.cardPick(e)),o=p=>x(p==="watch"?"watch":"phone"),d=p=>p==="watch"?"watch":T("iPhone","phone");if(n.length<2){let p=a==="watch"?"a":T("an","a");return c`<span class="ap-screen-icons"><span class="ap-screen-icon on ${a}" data-card-screen=${a} title=${`On ${p} ${d(a)} only`}>${o(a)}</span></span>`}return c`<span class="ap-screen-icons" role="group" aria-label="Show this page on">${n.map(p=>c`<button type="button"
      class="ap-screen-icon ${p} ${p===a?"on":""}" data-card-screen=${p} aria-pressed=${p===a?"true":"false"}
      title=${`Show it on the ${d(p)}`} aria-label=${`Show it on the ${d(p)}`}
      @click=${l=>{l.stopPropagation(),this.cardPicks=new Map(this.cardPicks).set(i,p)}}>${o(p)}</button>`)}</span>`}renderPhoneThumb(e,t,n,i){let a=t.find(d=>d.kind==="iphone"&&e.owners.some(p=>f(p,d.ownerId))),o=this.appVersionOf(a);return Oe({page:e.item,width:n,maxHeight:Math.max(1,Math.round(i)),tick:this.iconsTick,iphone:!0,...this.hassNow===void 0?{}:{states:this.hassNow.states},...this.icons===void 0?{}:{icons:this.icons},...o===void 0?{}:{appVersion:o},photo:this.photoUrl,photoSize:this.photoSize,photoGlow:this.photoGlow,photoOn:this.photoOn,photoOnMask:this.photoOnMask,photoTick:this.photoTick,homeMap:this.homeMapDoc()})}renderThumbs(e,t,n,i,a=!1){let o=O(i);if(!o.includes("iphone"))return this.renderThumb(e,t,n);let d=o.includes("watch"),p=a?ys:bs,l=d?a?xs:vs:qi,h=d?this.cardWatchHeight(t,p):Yi;return c`<span class="ap-pics ap-card-pics ${a?"large":""}">
      ${d?this.renderThumb(e,t,n?.kind==="watch"?n:void 0,p):u}
      <span class="ap-pic ap-pic-phone">${this.renderPhoneThumb(t,i,l,h)}</span>
    </span>`}renderStatusThumb(e){let t=this.hassNow,n=J/M.width,i=d=>`${Math.round(d*100)/100}px`,o=(Array.isArray(e.item.rows)?e.item.rows.length:0)>5;return c`<span class="ap-pic ap-pic-status ${o?"cut":""}" style=${`width:${i(J)};height:${i(Math.min(M.height*n,ge))}`}>
      <span class="ap-pic-in">${t===void 0?u:qt({page:e.item,hass:t,icons:this.icons??Ct,screen:M,scale:n})}</span>
    </span>`}static{this.styles=[Gt,Bt,Yt,ni,ti,Qt,Ln,cn,Ki,Gi,rn,Sn,In,Hn,En,A`
    .ap-embed-saved { position: absolute; right: 0; top: -26px; }
    /* A page's two pictures, the watch's and the iPhone's, side by side. */
    .ap-pics { display: inline-flex; align-items: flex-start; gap: 4px; }
    .ap-card-pics { gap: 8px; }
    .ap-pic.ap-pic-phone { box-shadow: none; border-radius: 0; }
    /* Screens differ: cards wide enough for both pictures at a size to read,
       and on a screen narrower than that, one under the other. */
    .ap-grid.differ { grid-template-columns: repeat(auto-fill, minmax(min(336px, 100%), 1fr)); }
    .ap-card-pics.large { flex-wrap: wrap; justify-content: center; max-width: 100%; }
    /* The icons in the corner of a card's picture: which screen it draws. */
    .ap-thumb-wrap { position: relative; }
    .ap-screen-icons {
      position: absolute; top: 6px; right: 6px; z-index: 2; display: inline-flex; gap: 2px; padding: 2px; border-radius: 8px;
      background: color-mix(in srgb, var(--wa-card) 88%, transparent); border: 1px solid var(--wa-line-strong);
    }
    .ap-screen-icon {
      display: inline-grid; place-items: center; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 6px;
      background: none; color: var(--wa-muted);
    }
    button.ap-screen-icon { cursor: pointer; }
    button.ap-screen-icon:hover { color: var(--wa-ink); }
    button.ap-screen-icon:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-screen-icon.on { background: var(--wa-field); }
    .ap-screen-icon.on.watch { color: var(--wa-hue-purple); }
    .ap-screen-icon.on.iphone { color: var(--wa-hue-pink); }
    .ap-screen-icon svg.ui-icon { width: 14px; height: 14px; }
    /* The one line about a page's two screens, under its name. */
    .ap-screens { display: block; margin: -2px 0 6px; font-size: 11.5px; color: var(--wa-muted); }
    /* All, or Screens differ. */
    .ap-filter { display: inline-flex; flex: none; padding: 2px; gap: 2px; border-radius: 8px; background: var(--wa-field); border: 1px solid var(--wa-line); }
    .ap-filter-opt {
      font: inherit; font-size: 12px; font-weight: 600; height: 24px; padding: 0 9px; border-radius: 6px; cursor: pointer;
      border: 0; background: transparent; color: var(--wa-muted);
    }
    .ap-filter-opt.on { background: var(--wa-seg-on); color: var(--wa-ink); }
    .ap-filter-opt:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* The one card after the update, over the list until dismissed. */
    .ap-upgrade {
      display: flex; align-items: center; gap: 10px; margin: 0 0 12px; padding: 10px 12px; border-radius: 10px;
      font-size: 13px; line-height: 1.4; color: var(--wa-ink);
      background: color-mix(in srgb, var(--wa-accent) 12%, var(--wa-card));
      border: 1px solid color-mix(in srgb, var(--wa-accent) 32%, var(--wa-line));
    }
    .ap-upgrade > svg { width: 16px; height: 16px; flex: none; color: var(--wa-accent); }
    .ap-upgrade > span { flex: 1; min-width: 0; }
    .ap-upgrade-x {
      display: inline-flex; align-items: center; justify-content: center; flex: none; width: 26px; height: 26px; border-radius: 7px;
      border: 1px solid transparent; background: transparent; color: var(--wa-muted); cursor: pointer;
    }
    .ap-upgrade-x:hover { background: var(--wa-hover); color: var(--wa-ink); }
    .ap-upgrade-x:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-upgrade-x svg { width: 13px; height: 13px; }
    /* Make a copy, beside Delete: the same small button, not red. */
    .ap-del.ap-copy:hover:not(:disabled) { color: var(--wa-ink); border-color: var(--wa-line-strong); }
    .ap-card .ap-del.ap-copy:disabled { opacity: .35; }
    :host([embedded]) { position: relative; }
    /* On the board the device heads are what stays on screen, right under
       the tab bar, so the toolbar scrolls away (\`.bd-pin\`). */
    .ap-page { --bd-pin-top: calc(-1 * var(--ap-top, 0px)); }
    .pk-surface.pk-page.on-board > .pk-pin { position: static; }
    /* New page: filled, as New complication is, the one way to start a page
       from this tab. On All it opens the New dialog (new-dialog.ts). */
    .ap-new { position: relative; flex: none; }
    .ap-new-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px; font-weight: 600;
      height: 30px; padding: 0 11px; border-radius: 8px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink);
    }
    .ap-new-btn:hover:not(:disabled) { filter: brightness(1.1); }
    .ap-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-new-btn:disabled { opacity: .45; cursor: default; }
    .ap-new-btn svg { width: 16px; height: 16px; }
    /* An empty library: how a page works, centered, with New page. */
    .ap-empty-lib { padding: 24px 16px 32px; }
    .ap-empty-lib .ap-empty-note, .ap-empty-lib .ap-empty-wait { margin: 0 0 6px; font-size: 12.5px; line-height: 1.45; color: var(--wa-muted); }

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

    /* The bar under the tabs while cards are picked, the Complications
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
  `]}};m([I({attribute:!1})],g.prototype,"kind",2),m([I({attribute:!1})],g.prototype,"owners",2),m([I({attribute:!1})],g.prototype,"ownersReady",2),m([I({attribute:!1})],g.prototype,"phones",2),m([I({attribute:!1})],g.prototype,"icons",2),m([I({attribute:!1})],g.prototype,"iconsTick",2),m([I({attribute:!1})],g.prototype,"onOpenLibrary",2),m([I({attribute:!1})],g.prototype,"focusOwner",2),m([I({attribute:!1})],g.prototype,"onFocus",2),m([I({attribute:!1})],g.prototype,"onOpenScreen",2),m([I({type:Boolean,reflect:!0})],g.prototype,"embedded",2),m([I({attribute:!1})],g.prototype,"searchText",2),m([y()],g.prototype,"search",2),m([y()],g.prototype,"newForm",2),m([y()],g.prototype,"pageForm",2),m([y()],g.prototype,"copyForm",2),m([y()],g.prototype,"shareForm",2),m([y()],g.prototype,"screensFilter",2),m([y()],g.prototype,"cardPicks",2),m([y()],g.prototype,"selecting",2),m([y()],g.prototype,"selected",2),m([y()],g.prototype,"asking",2),m([y()],g.prototype,"bulkBusy",2),m([y()],g.prototype,"itemAsk",2),m([y()],g.prototype,"bulkNote",2),m([y()],g.prototype,"tickNotes",2),m([y()],g.prototype,"untickAsk",2),m([y()],g.prototype,"picksBusy",2),m([y()],g.prototype,"picksNote",2),m([y()],g.prototype,"orderAsked",2),m([y()],g.prototype,"hiddenAsked",2),m([y()],g.prototype,"dragId",2),m([y()],g.prototype,"overId",2),m([y()],g.prototype,"freeFacts",2),m([y()],g.prototype,"saved",2);customElements.get("wa-all-pages")||customElements.define("wa-all-pages",g);export{g as WaAllPages,Xi as pageCrop};
