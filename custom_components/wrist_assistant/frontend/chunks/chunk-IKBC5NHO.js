import{A as ht,B,C as M,D as F,E as Oe,F as bt,G as wt,H as ue,I as yt,J as vt,K as Ce,L as St,M as $t,N as Ee,O as kt,P as V,Q as xt,R as Pt,S as _t,T as Rt,U as Tt,V as Dt,a as A,b as rt,c as dt,ca as Ot,d as lt,e as ct,f as W,g as de,h as ut,i as pt,j as le,k as _e,l as R,o as Re,p as D,q as I,r as q,s as G,t as L,u as Te,v as ce,w as De,x as gt,y as ft,z as mt}from"./chunk-ZGLX37NK.js";import{d as Ct}from"./chunk-AYNPMDH5.js";import{o as tt,w as st,x as at,y as it,z as ot}from"./chunk-PEI2F5V4.js";import{c as Se}from"./chunk-ZOJGMATP.js";import{Na as Et}from"./chunk-SAWBVZMM.js";import{Pb as $e,Sb as ke,Tb as Ze,Ub as Xe,Vb as E,Wb as Qe,Yb as xe,ec as Pe,gc as et}from"./chunk-TXM3PI3S.js";import{Ch as Be,Eg as qe,Gg as Ge,b as We,d as r,g as b,ph as j,qh as $}from"./chunk-KWDEJLUK.js";import{Q as P,R as nt,j as K}from"./chunk-ESIOP3D4.js";import{Va as ve,Wa as Ye}from"./chunk-2ZMALKUC.js";function Ae(e){return e===null?void 0:e}function z(e,t){return e!=null&&Object.hasOwn(e,t)?e[t]:void 0}function He(e){if(!Array.isArray(e))return;let t=new Set,n=[];for(let s of e){if(!K(s)||typeof s.id!="string"||s.id==="")return;let i=s.id.toUpperCase();if(t.has(i))return;t.add(i),n.push([i,s])}return n}function on(e,t){return e.length===t.length&&e.every((n,s)=>n===t[s])}function At(e,t){return e===void 0&&t===void 0?{kind:"same"}:e!==void 0&&t!==void 0&&P(e,t)?{kind:"same"}:{kind:"changed",page:t}}function Le(e){return e!==void 0&&typeof e.name=="string"?e.name:""}function Ht(e,t,n){let s=Ae(e),i=Ae(t),a=Ae(n),o=s===void 0?[]:He(s),d=i===void 0?void 0:He(i),u=a===void 0?void 0:He(a);if(o===void 0||d===void 0||u===void 0)return{pages:P(i,s)?a:i,clashes:[]};let l=new Map(o),f=new Map(d),p=new Map(u),w=[],c=S=>{let T=l.get(S),_=f.get(S),x=p.get(S),re=At(T,_),sn=At(T,x);if(re.kind==="same")return x;if(sn.kind==="same")return _;if(_!==void 0&&x!==void 0&&P(_,x))return x;if(_!==void 0||x!==void 0){let an=Le(x)||Le(_)||Le(T);w.push({id:x?.id??_?.id??T?.id,name:an})}return x},m=d.map(([S])=>S).filter(S=>l.has(S)),g=o.map(([S])=>S).filter(S=>f.has(S)),h=!on(m,g),[v,y]=h?[d,u]:[u,d],k=v.map(([S])=>S),ie=new Set(k);y.forEach(([S],T)=>{if(ie.has(S))return;let _=0;for(let x=T-1;x>=0;x--){let re=k.indexOf(y[x][0]);if(re>=0){_=re+1;break}}k.splice(_,0,S),ie.add(S)});let oe=[];for(let S of k){let T=c(S);T!==void 0&&oe.push(T)}let Ke=S=>S.length===oe.length&&oe.every((T,_)=>T===S[_]);return Ke(a)?{pages:a,clashes:w}:Ke(i)?{pages:i,clashes:w}:{pages:oe,clashes:w}}function Lt(e,t,n){return Ht(e==null?[]:z(e,R),z(t,R),z(n,R)).clashes}function Nt(e,t,n){let s=nt(e,t,n),i=Ht(e==null?[]:z(e,R),z(t,R),z(n,R)).pages;if(i===void 0){if(!Object.hasOwn(s,R))return s;let a={};for(let o of Object.keys(s))o!==R&&(a[o]=s[o]);return a}if(s[R]===i)return s;if(s===n||s===t){let a={...s};return a[R]=i,pe(a,n)?n:pe(a,t)?t:a}return s[R]=i,pe(s,n)?n:pe(s,t)?t:s}function pe(e,t){let n=Object.keys(e);return n.length!==Object.keys(t).length?!1:n.every(s=>Object.hasOwn(t,s)&&t[s]===e[s])}var jt=100,rn=3,ge=class{constructor(t,n){this._undo=[];this._redo=[];this._kept=[];this._base=t,this._revision=n,this._document=t}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get kept(){return this._kept}get dirty(){let t=this._dirty;if(t!==void 0&&t.document===this._document&&t.base===this._base)return t.value;let n=this._document!==this._base&&!P(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:n},n}apply(t,n){if(t===this._document||P(t,this._document))return(n===void 0||n!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(n!==void 0&&n===this._coalesceKey&&this._undo.length>0){let s=this._undo[this._undo.length-1];return P(t,s)?(this._undo.pop(),this._document=s,this._coalesceKey=void 0):this._document=t,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=t,this._coalesceKey=n,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let t=this._undo.pop();return t===void 0?!1:(this._redo.push(this._document),this._document=t,!0)}redo(){this._coalesceKey=void 0;let t=this._redo.pop();return t===void 0?!1:(this.pushUndo(this._document),this._document=t,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(t,n){return n<this._revision?(this._kept=[],!1):this.mergeOnto(t,n)}restart(t,n){return this.mergeOnto(t,n)}mergeOnto(t,n){this._coalesceKey=void 0;let s=this._base;this._kept=this._document===s?[]:Lt(s,this._document,t);let i=new Map,a=p=>{let w=i.get(p);if(w!==void 0)return w;let c=p===s?t:Nt(s,p,t);return c!==t&&P(c,t)&&(c=t),i.set(p,c),c},o=this._document,d=[...this._undo,this._document,...this._redo.slice().reverse()].map(a),u=this._undo.length,l=[],f=0;return d.forEach((p,w)=>{let c=l[l.length-1];c!==void 0&&(c===p||P(c,p))?w===u&&(l[l.length-1]=p):l.push(p),w===u&&(f=l.length-1)}),this._undo=l.slice(0,f),this._document=l[f],this._redo=l.slice(f+1).reverse(),this._base=t,this._revision=n,this._document!==o&&!P(this._document,o)}saved(t,n){n<this._revision||(this._coalesceKey=void 0,this._base=t,this._revision=n)}get saving(){return Y.has(this)}get saveDone(){return Y.get(this)}pushUndo(t){this._undo.push(t),this._undo.length>jt&&this._undo.splice(0,this._undo.length-jt)}},Y=new WeakMap;function qn(e,t){if(Y.has(e))return Promise.resolve({ok:!1,revision:e.revision,merged:!1,code:"busy",message:"These status pages are being saved already."});let n=dn(e,t).finally(()=>Y.delete(e));return Y.set(e,n),n}async function dn(e,t){let n=!1,s=new Map,i=()=>s.size===0?{}:{kept:[...s.values()]},a=(o,d,u)=>({ok:!1,revision:e.revision,merged:n,code:o,message:d,...i(),...u===void 0?{}:{problems:u}});for(let o=1;;o++){let d=e.document,u=Dt(d);if(u.length>0)return a("invalid",u.join(" "),u);let l,f;try{let p=await t.save(e.revision,d);l=p.revision,f=Ye(p)}catch(p){let{code:w="unknown",message:c}=ve(p);if(w!=="conflict"||o>=rn)return a(w,c);let m;try{m=await t.fetch()}catch(g){let h=ve(g);return a(h.code??"unknown",h.message)}if(!K(m)||!(m.revision>0)||!K(m.document))return a("no_record","Home Assistant holds no status pages for this watch.");m.revision<e.revision?e.restart(m.document,m.revision):e.rebase(m.document,m.revision);for(let g of e.kept)s.set(g.id.toUpperCase(),g);if(n=!0,!e.dirty)return{ok:!0,revision:e.revision,merged:n,alreadySaved:!0,...i()};continue}return e.saved(d,l),{ok:!0,revision:e.revision,merged:n,...i(),...f.length===0?{}:{linkFailures:f}}}}var H=new Map;function It(e){return H.get(e)}function Gn(e,t,n){let s=H.get(e);if(s!==void 0&&n<=0)return{draft:s,mergedIntoEdits:!1,kept:[]};if(s===void 0||n<s.revision&&!s.dirty){let o=new ge(t,n);return H.set(e,o),{draft:o,mergedIntoEdits:!1,kept:[]}}if(n===s.revision)return{draft:s,mergedIntoEdits:!1,kept:[]};let i=s.dirty,a=n<s.revision?s.restart(t,n):s.rebase(t,n);return{draft:s,mergedIntoEdits:i&&a,kept:i?s.kept:[]}}function Bn(e){let t=H.get(e);if(t===void 0){let n=new ge(_e(),0);return H.set(e,n),n}return t.revision>0&&!t.saving&&t.restart(_e(),0),t}function Yn(e){H.delete(e)}function Zn(){for(let e of H.values())if(e.dirty)return!0;return!1}function Xn(){H.clear(),fe.clear(),Ne.clear()}var fe=new Map;function Qn(e,t){fe.set(e,t)}function es(e){let t=fe.get(e);return fe.delete(e),t}var Ne=new Set;function ts(e){Ne.add(e)}function ns(e){return Ne.delete(e)}function ln(e){return{read:t=>qe(e,t,"status_pages"),save:(t,n,s)=>Ge(e,t,"status_pages",n,s)}}function cn(e,t,n){return Ot(ln(e),t,n)}async function un(e,t,n,s=[]){let i;try{i=await Ct(e,t,n,s,!0)}catch{return{kind:"warn",text:"Saved. Could not clear the deleted status page from the menus: change them by hand."}}if(i!==0)return{kind:"ok",text:`Saved. Cleared the deleted status page from ${i} menu ${i===1?"slot":"slots"}.`}}async function ds(e,t,n,s){if(!e)return`Not taken off ${s}.`;if(It(t)?.dirty??!1)return`Not taken off ${s}: its status pages have unsaved edits. Save or discard them first.`;let i=await cn(e,t,[n]);if(!i.ok)return`Not taken off ${s}: ${i.message}`;i.removed.length>0&&await un(e,t,[n],[n])}function Kt(e,t){e.deletePage!==void 0?e.deletePage(t):e.edit(n=>ft(n,t))}var N="status-pages",Ve="sp:page",U="sp:row",O="sp:add",Z="sp:drag",Q="sp:added",Wt="wrist-assistant-panel.status-pages.zoom.v1";function $s(e=Se()){try{let t=e?.getItem(Wt),n=t==null||t===""?NaN:Number(t);return tt.includes(n)?n:void 0}catch{return}}function ks(e,t=Se()){try{t?.setItem(Wt,e===void 0?"":String(e))}catch{}}var pn="Pages the watch opens from a tile, a menu slot or Siri. A save reaches the watch the next time it checks.",xs="Drawn from Home Assistant's states now, as the watch draws the page. Tap a row to edit it.";function ne(e,t,n){return`${e} ${e===1?t:n}`}function ee(e,t){let n=e.states[t]?.attributes?.friendly_name;return typeof n=="string"&&n.trim()!==""?n:t}function qt(e,t){let n=t.indexOf(".");return{entityId:t,displayName:t===""?"":ee(e,t),domain:n<0?"":t.slice(0,n)}}function gn(e){switch(e){case"battery_charging":return"charging";case"illuminance":return"light";case"occupancy":case"presence":return"occupancy";case"garage_door":case"garage":return"garage";case"carbon_monoxide":return"CO";default:return e.replaceAll("_"," ")}}function fn(e,t){if(t!==void 0&&t.length>0){let n=t.map(gn),s=n.length===1?n[0]:n.slice(0,2).join("/");return e==="sensor"||e==="binary_sensor"?`${s} sensors`:e==="cover"?s.includes("garage")?"garage doors":`${s} covers`:`${s} ${e}s`}return e==="person"?"people":e==="binary_sensor"?"binary sensors":`${e}s`}function Ie(e){let t=A(e),n=s=>`${s} ${s===1?"entity":"entities"}`;switch(t.rowType){case"entity":return t.entityId;case"groupCount":return`${n(t.groupEntityIds?.length??0)} \xB7 group count`;case"dynamicList":return t.dynamicMode==="all"?`all ${fn(t.domain,t.deviceClassFilter)} \xB7 dynamic list`:`${n(t.groupEntityIds?.length??0)} \xB7 dynamic list`;case"sectionHeader":return"section header";default:return t.rowType}}function Gt(e){return le.labels.StatusRowType?.[e]??e}function C(e){let t=Re(e.document),n=e.uiState.get(Ve);return(typeof n=="string"?t.find(s=>L(D(s),n)):void 0)??t[0]}function Bt(e,t){e.uiState.set(Ve,t),e.uiState.delete(U),e.uiState.delete(O),e.requestUpdate()}function se(e){let t=e.uiState.get(U);return typeof t=="string"?ce(C(e),t):void 0}function ae(e,t){t===void 0?e.uiState.delete(U):e.uiState.set(U,t),e.uiState.delete(O),e.requestUpdate()}function mn(e){return se(e)===void 0&&!e.uiState.has(O)?!1:(e.uiState.delete(U),e.uiState.delete(O),e.requestUpdate(),!0)}function te(e){let t=e.uiState.get(O);return typeof t=="object"&&t!==null?t:void 0}function he(e,t){t===void 0?e.uiState.delete(O):(e.uiState.set(O,t),e.uiState.delete(U)),e.requestUpdate()}function hn(e,t="entity"){e.uiState.delete(Q),he(e,{kind:t,mode:"all",picked:[]})}function me(e,t,n=!1){let s=C(e);if(s===void 0)return;let i=D(s),a;return e.edit(o=>{let d=St(o,i,t);return a=d.id,d.document}),a!==void 0&&!n&&ae(e,a),a}function bn(e){let t;e.edit(n=>{let s=gt(n);return t=s.id,s.document}),t!==void 0&&Bt(e,t)}function Yt(e,t,n,s,i){return{start:a=>{e.uiState.set(Z,{list:t,id:n}),a.dataTransfer?.setData("text/plain",n),a.dataTransfer&&(a.dataTransfer.effectAllowed="move")},over:a=>{e.uiState.get(Z)?.list===t&&(a.preventDefault(),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))},drop:a=>{let o=e.uiState.get(Z);e.uiState.delete(Z),!(o?.list!==t||L(o.id,n))&&(a.preventDefault(),i(o.id,s))},end:()=>{e.uiState.delete(Z)}}}function ze(e,t,n,s){return e.icons.render(t,n,s)??r`<span class="sp-glyph-dot" style=${`background:${s};width:${Math.max(4,n*.6)}px;height:${Math.max(4,n*.6)}px`}></span>`}function Zt(e,t,n){return r`<span class="thumb sp-thumb" style=${`--c:${n}`} aria-hidden="true"><span class="sp-thumb-glyph">${ze(e,t,14,n)}</span></span>`}function Xt(e,t){let n=A(t);return n.rowType==="sectionHeader"?W.secondary:n.rowType==="entity"?de(n.domain,e.hass.states[n.entityId]?.state):de(n.domain,"on")}function wn(e,t,n,s,i){let a=D(t),o=I(t),d=i!==void 0&&L(a,D(i)),u=q(t).length,l=(g,h)=>e.edit(v=>mt(v,g,h)),f=Yt(e,"page",a,n,l),p=()=>{d||Bt(e,a)},w=e.linkBadge?.(t),c=e.devices?.(t),m=c?.open==="row";return r`<div class="layer sp-page-row ${d?"hl":""} ${m?"menu-open":""}" data-page=${a} role="listitem" tabindex="0"
    draggable=${e.busy||m?"false":"true"} aria-current=${d?"true":"false"} aria-label=${o||"Untitled page"}
    @dragstart=${f.start} @dragover=${f.over} @drop=${f.drop} @dragend=${f.end}
    @click=${g=>{g.target instanceof Element&&g.target.closest("button, .pe-dev-menu")||p()}}
    @keydown=${g=>{g.target!==g.currentTarget||g.key!=="Enter"&&g.key!==" "||(g.preventDefault(),p())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Zt(e,"doc.text.fill","#5B8FD4")}
    <span class="name"><b><span class="nm-t">${o||"Untitled page"}</span></b><small>${ne(u,"row","rows")}</small></span>
    <span class="right">
      <span class="badges">${w===void 0?b:r`<span class="badge sp-linked" title=${`${w}. An edit here shows there too.`}>${w}</span>`}${De(t)?r`<span class="badge" title="One of the app's starter pages. The watch treats it as any other page.">starter</span>`:b}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${e.busy||n===0} title="Move up" aria-label=${`Move ${o} up`}
          @click=${()=>l(a,n-1)}>${$("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||n===s-1} title="Move down" aria-label=${`Move ${o} down`}
          @click=${()=>l(a,n+1)}>${$("down")}</button>
        ${c===void 0?b:r`<button type="button" class="icon sp-dev-open ${m?"on":""}"
          title="Pick the devices this status page is on" aria-label=${`Devices for ${o}`} aria-expanded=${m?"true":"false"}
          @click=${()=>c.toggle("row")}>${$("phone")}</button>`}
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Delete" aria-label=${`Delete ${o}`}
          @click=${()=>Kt(e,a)}>${$("delete")}</button>
      </span>
    </span>
    ${m?c.menu("row"):b}
  </div>`}function Ps(e){let t=Re(e.document),n=C(e);return r`<section class="card lc sp-pages-card" aria-label="Status pages" style="--c: var(--wa-lc-pages, #26a69a); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${$("list")}</span><span class="lc-title">Status pages</span>
      <span class="lc-sub" title=${pn}>${ne(t.length,"page","pages")}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-page" aria-label="Add status page" ?disabled=${e.busy}
        title="Add a status page" @click=${()=>bn(e)}>${$("plus")}<span>Add</span></button>
    </div>
    ${t.length===0?r`<div class="lc-note">No status pages. Add one to show the live state of entities you pick.</div>`:r`<div class="layers sp-page-list" role="list">${t.map((s,i)=>wn(e,s,i,t.length,n))}</div>`}
    ${e.sharedLine===void 0||t.length===0?b:r`<div class="lc-note sp-shared-note" role="note">${e.sharedLine}</div>`}
    ${e.elsewhere??b}
  </section>`}function _s(e){let{groups:t,blocked:n,busy:s,note:i}=e;return t.length===0&&i===void 0?b:r`<div class="sp-else" role="group" aria-label=${e.title}>
    <div class="sp-else-h">${e.title}</div>
    ${t.map(a=>{let o=e.colorOf?.(a.device.ownerId);return r`<div class="sp-else-dev" style=${o===void 0?b:`--dc:${o}`}>
          ${$(a.device.kind==="iphone"?"phone":"watch")}<span>${a.device.name}</span></div>
        ${a.pages.map(d=>r`<div class="sp-else-row">
          <span class="sp-else-name" title=${d.name}>${d.name}</span>
          <button type="button" class="icon" ?disabled=${s||n!==void 0}
            title=${n??`Put ${d.name} on this ${e.here} too, linked: an edit on one device then shows on both.`}
            aria-label=${`Add ${d.name} here`} @click=${()=>e.onAdd(d)}>${$("plus")}</button>
        </div>`)}`})}
    ${s?r`<div class="sp-else-note">Adding…</div>`:b}
    ${n===void 0||t.length===0?b:r`<div class="sp-else-note warn">${n}</div>`}
    ${i===void 0?b:r`<div class="sp-else-note ${i.kind}" role="status">${i.text}</div>`}
  </div>`}function yn(e,t,n,s,i,a){let o=G(n),d=A(n),u=a!==void 0&&L(o,G(a)),l=d.isHidden===!0,f=d.displayName===""?"Display Name":d.displayName,p=(g,h)=>e.edit(v=>kt(v,t,g,h)),w=Yt(e,"row",o,s,p),c=()=>ae(e,o),m=d.rowType==="sectionHeader"?"line.horizontal.3":d.iconName;return r`<div class="layer sp-row-row ${u?"hl":""} ${l?"dim":""}" data-row=${o} role="listitem" tabindex="0"
    draggable=${e.busy?"false":"true"} aria-current=${u?"true":"false"} aria-label=${f}
    title=${`${f} \xB7 ${Ie(n)}${l?", hidden":""}`}
    @dragstart=${w.start} @dragover=${w.over} @drop=${w.drop} @dragend=${w.end}
    @click=${g=>{g.target instanceof Element&&g.target.closest("button")||c()}}
    @keydown=${g=>{g.target!==g.currentTarget||g.key!=="Enter"&&g.key!==" "||(g.preventDefault(),c())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Zt(e,m,Xt(e,n))}
    <span class="name"><b><span class="nm-t">${f}</span></b><small>${Ie(n)}</small></span>
    <span class="right">
      <span class="badges">${l?r`<span class="badge">hidden</span>`:b}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${e.busy} title=${l?"Show":"Hide"} aria-label=${`${l?"Show":"Hide"} ${f}`}
          @click=${()=>e.edit(g=>V(g,t,o,"isHidden",!l))}>${$(l?"show":"hide")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||s===0} title="Move up" aria-label=${`Move ${f} up`}
          @click=${()=>p(o,s-1)}>${$("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||s===i-1} title="Move down" aria-label=${`Move ${f} down`}
          @click=${()=>p(o,s+1)}>${$("down")}</button>
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Remove" aria-label=${`Remove ${f}`}
          @click=${()=>e.edit(g=>Ee(g,t,o))}>${$("delete")}</button>
      </span>
    </span>
  </div>`}function Rs(e){let t=C(e),n=t===void 0?[]:q(t),s=se(e),i=t===void 0?"":D(t),a;t===void 0?a=r`<div class="lc-note">Add a status page to give it rows.</div>`:n.length===0?a=r`<div class="lc-note">No rows yet. Add entities to show in this status page.</div>`:a=r`<div class="layers sp-row-list" role="list">${n.map((d,u)=>yn(e,i,d,u,n.length,s))}</div>
    <div class="lc-note sp-drag-note">Drag a row, or use its arrows, to reorder.</div>`;let o=te(e)!==void 0;return r`<section class="card lc sp-rows-card" aria-label="Rows" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${$("layers")}</span><span class="lc-title">Rows</span>
      ${t===void 0?b:r`<span class="lc-sub">${ne(n.length,"row","rows")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-row ${o?"on":""}" aria-label="Add row" ?disabled=${e.busy||t===void 0}
        title="Add an entity, a group count, a dynamic list or a header" @click=${()=>hn(e)}>${$("plus")}<span>Add</span></button>
    </div>
    ${a}
  </section>`}var be={small:{row:10,compact:9,icon:14},medium:{row:12,compact:10,icon:16},large:{row:14,compact:12,icon:18}},Je={regular:400,medium:500,semibold:600,bold:700},we={default:"-apple-system, system-ui, 'SF Pro Text', 'Helvetica Neue', sans-serif",rounded:"ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, monospace",serif:"ui-serif, 'New York', Georgia, serif"},Mt={ultraThin:.1,thin:.13,regular:.16,thick:.2,ultraThick:.24};function vn(e){let t=n=>{let s=B().find(i=>i.key===n);return F(e,s)};return{rowStyle:String(t("rowStyle")),textSize:String(t("textSize")),fontWeight:String(t("fontWeight")),fontDesign:String(t("fontDesign")),rowSpacing:Number(t("rowSpacing")),backgroundMaterial:String(t("backgroundMaterial")),columnLayout:String(t("columnLayout")),showDividers:t("showDividers")===!0,iconPosition:String(t("iconPosition")),horizontalPadding:Number(t("horizontalPadding"))}}function Ue(e){return W[e]??W.secondary}function Qt(e,t){return e.rowStyle==="pillFilled"?`background:color-mix(in srgb, ${t} 15%, transparent);`:e.rowStyle==="pillOutline"?`box-shadow:inset 0 0 0 0.75px color-mix(in srgb, ${t} 40%, transparent);`:""}function ye(e,t,n,s,i){let a=Ue(n.color);return r`<span class="sp-w-icon" style=${`width:${s*i}px`}>${ze(e,n.icon,Math.round(s*.8*i),a)}</span>`}function Ft(e,t,n,s){let i=e.scale,a=be[t.textSize]??be.medium,o=s!==void 0&&L(s,n.rowId),d=()=>ae(e,n.rowId);if(n.kind==="sectionHeader")return r`<div class="sp-w-header ${o?"on":""}" style=${`font-size:${9*i}px;text-align:${n.align==="center"?"center":n.align==="trailing"?"right":"left"}`}
      @click=${d}>${n.label}</div>`;let u=Ue(n.color),l=t.rowStyle==="plain";return r`<div class="sp-w-row ${o?"on":""}" title=${n.entityId??n.label}
    style=${`gap:${6*i}px;font-size:${a.row*i}px;font-weight:${Je[t.fontWeight]??400};padding:${l?0:4*i}px ${l?0:8*i}px;border-radius:${6*i}px;${Qt(t,u)}`}
    @click=${d}>
    ${t.iconPosition==="leading"?ye(e,t,n,a.icon,i):b}
    <span class="sp-w-label">${n.label}</span>
    <span class="sp-w-value" style=${`color:${u}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?ye(e,t,n,a.icon,i):b}
  </div>`}function Vt(e,t,n,s){let i=e.scale,a=be[t.textSize]??be.medium,o=s!==void 0&&L(s,n.rowId),d=Ue(n.color),u=t.rowStyle==="plain";return r`<div class="sp-w-cell ${o?"on":""}" title=${n.label}
    style=${`gap:${3*i}px;font-size:${a.compact*i}px;font-weight:${Je[t.fontWeight]??400};padding:${u?0:3*i}px ${u?0:6*i}px;border-radius:${6*i}px;${Qt(t,d)}`}
    @click=${()=>ae(e,n.rowId)}>
    ${t.iconPosition==="leading"?ye(e,t,n,a.icon,i):b}
    <span class="sp-w-value" style=${`color:${d}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?ye(e,t,n,a.icon,i):b}
  </div>`}function zt(e){return r`<div class="sp-w-divider" style=${`height:${Math.max(1,.5*e)}px`}></div>`}function Ts(e){let t=e.phone===void 0?"Status page on the watch":"Status page on the iPhone";return Et(e.phone,e.screen,e.scale,en(e,t),t,e.icons)}function Ds(e){let t={hass:e.hass,icons:e.icons,screen:e.screen,scale:e.scale,uiState:new Map([[Ve,D(e.page)]]),document:{statusPages:[e.page]},requestUpdate:()=>{}};return en(t,`${I(e.page)||"Untitled page"} on the watch`)}function en(e,t){let{width:n,height:s}=e.screen,i=e.scale,a=C(e),o=se(e),d=o===void 0?void 0:G(o),u;if(a===void 0)u=r`<p class="sp-w-empty">No status page.</p>`;else{let l=vn(a),f=pt(a,e.hass.states),p=l.columnLayout==="twoColumn"?ut(f).map((c,m,g)=>r`${c.kind==="header"?Ft(e,l,c.row,d):r`<div class="sp-w-pair" style=${`gap:${8*i}px`}>${Vt(e,l,c.first,d)}${c.second===void 0?r`<span class="sp-w-cell sp-w-spacer"></span>`:Vt(e,l,c.second,d)}</div>`}
          ${l.showDividers&&m<g.length-1?zt(i):b}`):f.map((c,m)=>r`${Ft(e,l,c,d)}${l.showDividers&&m<f.length-1?zt(i):b}`),w=Mt[l.backgroundMaterial]??Mt.regular;u=r`<div class="sp-w-scroll" style=${`padding:${30*i}px ${6*i}px ${12*i}px;gap:${12*i}px`}>
      <div class="sp-w-card" style=${`padding:${8*i}px ${(6+l.horizontalPadding)*i}px;border-radius:${14*i}px;background:rgba(255,255,255,${w});font-family:${we[l.fontDesign]??we.default}`}>
        <div class="sp-w-rows" style=${`gap:${l.rowSpacing*i}px;padding:${4*i}px 0`}>
          ${f.length===0?r`<span class="sp-w-none" style=${`font-size:${11*i}px`}>${q(a).length===0?"Add entities":"Nothing to show now"}</span>`:p}
        </div>
      </div>
      <div class="sp-w-done" style=${`font-size:${15*i}px;padding:${12*i}px 0;border-radius:${20*i}px`}>Done</div>
    </div>`}return r`<div class="sp-screen" role="group" aria-label=${t}
    style=${`width:${Math.round(n*i)}px;min-height:${Math.round(s*i)}px`}>${u}</div>`}function Os(e){let t=C(e);if(t===void 0)return[];let n=q(t),s=n.filter(i=>i.isHidden===!0).length;return[ne(n.length,"row","rows")+(s>0?`, ${s} hidden`:"")]}function tn(e,t){return st(e.uiState,N,t)}function Sn(e,t){at(e.uiState,N,t,!tn(e,t)),e.requestUpdate()}var $n={row:{color:j.content,icon:"content"},add:{color:j.content,icon:"plus"},page:{color:j.place,icon:"text"},rows:{color:"var(--wa-hue-yellow)",icon:"checklist"},text:{color:j.place,icon:"text"},more:{color:j.place,icon:"look"}},kn=["look-rows","look-text","look-more"];function J(e,t,n,s,i,a={}){let o=tn(e,n),d=$n[t];return Be({color:d.color,icon:$(d.icon),title:s,open:o,onToggle:()=>Sn(e,n),...a.summary===void 0||a.summary===""?{}:{summary:a.summary},dot:a.dot===!0,id:`${N}:${n}`},o?i:r``)}function xn(e){if(te(e)!==void 0)return[{module:N,section:"add"}];let t=kn.map(n=>({module:N,section:n}));return se(e)!==void 0?[{module:N,section:"row"},...t]:[{module:N,section:"page"},...t]}function nn(e,t,n,s,i){let a=`${t}:q`,o=String(e.uiState.get(a)??"").trim().toLowerCase(),d=new Set(s),u=n.filter(p=>o===""||p.toLowerCase().includes(o)||ee(e.hass,p).toLowerCase().includes(o)),l=[...u.filter(p=>d.has(p)),...u.filter(p=>!d.has(p))],f=l.slice(0,200);return r`<div class="sp-pick">
    <input type="search" class="sp-pick-q" placeholder="Search entities" aria-label="Search entities" .value=${String(e.uiState.get(a)??"")}
      @input=${p=>{e.uiState.set(a,p.target.value),e.requestUpdate()}} />
    <div class="sp-pick-list" role="group" aria-label="Entities">
      ${f.length===0?r`<div class="sp-pick-none">${n.length===0?"No entity of this kind in Home Assistant.":"No entity matches."}</div>`:b}
      ${f.map(p=>r`<label class="sp-pick-row">
        <input type="checkbox" .checked=${d.has(p)} ?disabled=${e.busy}
          @change=${w=>i(p,w.target.checked)} />
        <span class="sp-pick-name">${ee(e.hass,p)}</span><code>${p}</code>
      </label>`)}
      ${l.length>f.length?r`<div class="sp-pick-none">${l.length-f.length} more. Search to narrow the list.</div>`:b}
    </div>
  </div>`}function Pn(e,t,n){let s=D(t),i=G(n),a=A(n),o=(c,m,g)=>e.edit(h=>V(h,s,i,c,m),g),d=a.rowType==="sectionHeader",u=a.rowType==="groupCount"||a.rowType==="dynamicList",l=a.rowType==="dynamicList"&&a.dynamicMode==="all",f=a.rowType==="groupCount"||a.rowType==="dynamicList"&&!l,p=[];if(p.push(E("Visibility",a.isHidden===!0?"hidden":"visible",[["visible","Visible"],["hidden","Hidden"]],c=>o("isHidden",c==="hidden"))),p.push(ke("Label",a.displayName,c=>o("displayName",c,`row:${i}:label`),{placeholder:"Display Name"})),d?p.push(E("Alignment",a.headerAlignment??"leading",M("HeaderAlignment"),c=>o("headerAlignment",c))):p.push(r`<div class="ts-stack">${et({icons:e.icons,symbols:e.symbols},a.iconName,c=>o("iconName",c,`row:${i}:icon`),`sp:icon:${i}`)}</div>`),a.rowType==="entity"&&p.push(r`<div class="ts-stack">${Pe({hass:e.hass},"Entity",qt(e.hass,a.entityId),c=>{let m=c.entityId.trim();m!==""&&e.edit(g=>{let h=V(g,s,i,"entityId",m),v=ue(m,e.hass.states);return h=V(h,s,i,"domain",v.domain),a.iconName===ue(a.entityId).iconName&&(h=V(h,s,i,"iconName",v.iconName)),h})},`sp:entity:${i}`,{clearable:!1})}</div>`),u&&a.domain!=="sensor"){let c=dt(a.domain,a.deviceClassFilter);if(c.length>=2){let m=rt(a),g=c.map(h=>[h.value,h.label]);g.some(([h])=>h===m)||g.push([m,ct(m)]),p.push(E("Show State",m,g,h=>o("filterState",h)))}}if(a.rowType==="dynamicList"&&(p.push(E("Entities",l?"all":"specific",M("DynamicMode"),c=>o("dynamicMode",c))),p.push(xe("Show all states",a.showAllStates===!0,c=>o("showAllStates",c?!0:void 0),!1)),p.push(r`<div class="hint ts-under">On: every entity is listed whatever its state. Off: only those in the state above.</div>`)),a.domain==="sensor"&&(a.rowType==="groupCount"||l)&&(p.push(Ze(lt(a.deviceClassFilter),a.maxNumericValue,c=>o("maxNumericValue",c,`row:${i}:max`),{optional:!0,placeholder:"No limit",def:null})),p.push(r`<div class="hint ts-under">Only states at or below it count. Empty is no limit.</div>`)),u){let c=a.deviceClassFilter??[],m=_t(a.domain,e.hass.states,c),g=h=>{let v=A(ce(Te(e.document,s),i)??n).deviceClassFilter??[],y=v.includes(h)?v.filter(k=>k!==h):[...v,h];o("deviceClassFilter",y.length===0?void 0:y)};p.push(r`<div class="field sp-classes"><span>Device classes</span>
      <div class="sp-chips" role="group" aria-label="Device classes">
        ${m.length===0?r`<span class="hint">None reported for ${a.domain===""?"this row":a.domain}.</span>`:b}
        ${m.map(h=>{let v=c.includes(h);return r`<button type="button" class="pe-chip ${v?"on":""}" aria-pressed=${v?"true":"false"} ?disabled=${e.busy}
            @click=${()=>g(h)}>${h.replaceAll("_"," ")}</button>`})}
      </div></div>
      <div class="hint ts-under">${c.length===0?"None picked: every class counts.":"Only entities of these classes count."}</div>`)}if(f){let c=a.groupEntityIds??[],m=xt(n,e.hass.states);p.push(r`<div class="field sp-entities-field"><span>Edit Entities (${c.length})</span></div>
      ${nn(e,`sp:ents:${i}`,m,c,(g,h)=>{let v=A(ce(Te(e.document,s),i)??n).groupEntityIds??[],y=h?v.includes(g)?v:[...v,g]:v.filter(k=>k!==g);o("groupEntityIds",y)})}`)}let w=r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Row">${p}</fieldset>`;return r`${J(e,"row","row",Gt(a.rowType),w,{summary:Ie(n)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this row from the page"
        @click=${()=>e.edit(c=>Ee(c,s,i))}>${$("delete")}<span>Remove</span></button>
    </div>`}function _n(e,t,n,s){let i=F(n,s),a=(o,d)=>e.edit(u=>Oe(u,t,s.key,o),d);switch(s.kind){case"switch":return r`${xe(s.label,i===!0,o=>a(o),s.default)}
        ${s.help===void 0?b:r`<div class="hint ts-under">${s.help}</div>`}`;case"slider":return Qe(s.label,Number(i),o=>a(o,`style:${t}:${s.key}`),{min:s.min??0,max:s.max??1,step:s.step??1,def:Number(s.default),...s.unit===void 0?{}:{unit:s.unit}});default:{let o=le.types.page.keys[s.key]?.enum??"",d=M(o);return d.length<=4?E(s.label,String(i),d,u=>a(u),{def:String(s.default)}):Xe(s.label,String(i),d,u=>a(u),{def:String(s.default),snapBack:!0})}}}var Me=["rowStyle","columnLayout","iconPosition"],Fe=["textSize","fontDesign","fontWeight"],Jt=new Set([...Me,...Fe]),Rn={small:12,medium:15,large:18};function Tn(e,t,n){let s=B().find(l=>l.key===n);if(s===void 0)return;let i=D(t),a=String(F(t,s)),o=M(le.types.page.keys[n]?.enum??""),d=o.find(([l])=>l===a)?.[1]??a;return{field:s,value:a,choices:o,name:d,set:l=>{l!==String(F(C(e)??t,s))&&e.edit(f=>Oe(f,i,n,l))}}}function je(e,t){return B().some(n=>t(n.key)&&!P(F(e,n),n.default))}function X(e,t,n,s=""){let i=a=>t.choices.find(([o])=>o===a)?.[1]??a;return r`<div class="sp-look">
    <div class="sp-look-title">${$e(e,t.value,String(t.field.default),a=>t.set(a),i)}</div>
    <div class="sp-pics ${s}" role="group" aria-label=${e} style=${`--n:${t.choices.length}`}>
      ${t.choices.map(([a,o])=>{let d=a===t.value;return r`<button type="button" class="sp-pic ${d?"on":""}" aria-pressed=${d?"true":"false"} aria-label=${`${e}: ${o}`}
          @click=${()=>t.set(a)}>${n(a,o)}</button>`})}
    </div>
  </div>`}function Dn(e,t){return r`<span class="sp-pic-well ${e}" aria-hidden="true"><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function On(e,t){return r`<span class="sp-pic-grid ${e==="twoColumn"?"two":""}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function Cn(e,t){let n=r`<i class="sp-pic-dot" aria-hidden="true"></i>`;return r`${e==="leading"?n:b}<span class="sp-pic-name">${t}</span>${e==="trailing"?n:b}`}function En(e,t){return r`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:${Rn[e]??15}px`}>Aa</span><span class="sp-pic-name sub">${t}</span>`}function An(e,t){return r`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:18px;font-family:${we[e]??we.default}`}>Ag</span><span class="sp-pic-name sub">${t}</span>`}function Hn(e){let t=n=>e.choices.find(([s])=>s===n)?.[1]??n;return r`<div class="field seg-field sp-weight-field">${$e("Weight",e.value,String(e.field.default),n=>e.set(n),t)}
    <div class="seg wide sp-weight" role="group" aria-label="Weight">
      ${e.choices.map(([n,s])=>{let i=n===e.value;return r`<button type="button" class=${i?"on":""} aria-pressed=${i?"true":"false"} aria-label=${`Weight: ${s}`}
          style=${`--w:${Je[n]??400}`} @click=${()=>e.set(n)}>${s}</button>`})}
    </div></div>`}function Ut(e,t){let n=D(t),s=y=>Tn(e,t,y),[i,a,o]=Me.map(s),[d,u,l]=Fe.map(s),f=y=>y.filter(k=>k!==void 0).map(k=>k.name).join(", "),p=je(t,y=>Me.includes(y)),w=je(t,y=>Fe.includes(y)),c=je(t,y=>!Jt.has(y)),m=wt(t),g=J(e,"rows","look-rows","Rows",r`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Rows">
    ${i===void 0?b:X("Style",i,Dn)}
    ${a===void 0?b:X("Layout",a,On,"across")}
    ${o===void 0?b:X("Icon",o,Cn,"inline")}
  </fieldset>`,{summary:f([i,a]),dot:p}),h=J(e,"text","look-text","Text",r`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Text">
    ${d===void 0?b:X("Size",d,En,"type")}
    ${u===void 0?b:X("Font",u,An,"type")}
    ${l===void 0?b:Hn(l)}
  </fieldset>`,{summary:f([d,l,u]),dot:w}),v=J(e,"more","look-more","More",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="More">
    ${B().filter(y=>!Jt.has(y.key)).map(y=>_n(e,n,t,y))}
  </fieldset>`,{summary:c?"Changed":"Defaults",dot:c});return r`${g}${h}${v}
    <div class="sp-acts">
      <button type="button" class="pe-btn" ?disabled=${e.busy||!m} title="Put the page's whole look back to the app's defaults"
        @click=${()=>e.edit(y=>bt(y,n))}>${$("reset")}<span>Reset to Defaults</span></button>
    </div>`}function Ln(e,t){let n=D(t),s=I(t),i=e.devices?.(t),a=i?.open==="card";return J(e,"page","page","Page",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Page">
    ${ke("Name",s,o=>e.edit(d=>ht(d,n,o),`page:${n}:name`),{placeholder:"Page Name"})}
    ${De(t)?r`<div class="hint ts-under">One of the app's starter pages. It is edited and deleted like any other. Every device has its own.</div>`:b}
    <div class="sp-acts">
      ${i===void 0?b:r`<button type="button" class="pe-btn sp-dev-open ${a?"on":""}" aria-expanded=${a?"true":"false"}
        title="Pick the devices this status page is on"
        @click=${()=>i.toggle("card")}>${$("phone")}<span>Devices</span></button>`}
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Delete this status page"
        @click=${()=>Kt(e,n)}>${$("delete")}<span>Delete page</span></button>
    </div>
  </fieldset>
  ${a?i.menu("card"):b}`,{summary:s})}function Nn(e,t,n,s){let i=de(t.domain,"on");return r`<button type="button" class="sp-preset ${n?"on":""}" aria-pressed=${n?"true":"false"} ?disabled=${e.busy} @click=${s}>
    <span class="sp-preset-glyph">${ze(e,t.icon,18,i===W.secondary?"#5B8FD4":i)}</span>
    <span class="sp-preset-label">${t.label}</span>
  </button>`}function jn(e,t,n){let s=u=>he(e,{...n,...u}),i=e.uiState.get(Q),a=[["entity","Entity"],["groupCount","Group Count"],["dynamicList","Dynamic List"],["header","Header"]],o=E("Add",n.kind,a,u=>{if(u==="header"){me(e,yt());return}e.uiState.delete(Q),s({kind:u,preset:void 0,picked:[],mode:"all"})}),d;if(n.kind==="entity"){let u=Number(e.uiState.get(`${O}:n`)??0)||0;d=r`<div class="ts-stack">${Pe({hass:e.hass},"Entity",qt(e.hass,""),l=>{let f=l.entityId.trim();if(f==="")return;e.uiState.set(`${O}:n`,u+1);let p=C(e);if(p!==void 0&&$t(p,f)){e.uiState.set(Q,`${ee(e.hass,f)} is on this page already.`),e.requestUpdate();return}me(e,ue(f,e.hass.states),!0),e.uiState.set(Q,`Added ${ee(e.hass,f)}.`),e.requestUpdate()},`sp:add:entity:${u}`,{clearable:!1})}</div>
      <div class="hint">Each entity is one row. Pick another to add it too.</div>`}else{let u=n.kind==="groupCount"?Rt():Tt(),l=n.preset===void 0?void 0:u[n.preset],f=n.kind==="groupCount"||n.mode==="specific",p=n.kind==="groupCount"?"Counts how many of the entities you pick are in a state.":"Pick what to show. Each matching entity becomes its own row. You can switch to hand-picked entities after adding.",w=r`<div class="sp-presets" role="group" aria-label=${n.kind==="groupCount"?"Group Count":"Dynamic List"}>
      ${u.map((m,g)=>Nn(e,m,n.preset===g,()=>{if(!f){me(e,Ce(m));return}s({preset:g,picked:[]})}))}
    </div>`,c=b;if(f&&l!==void 0){let m=n.kind==="groupCount"?l.picker==="deviceClass"?l.deviceClassFilter:void 0:l.deviceClassFilter,g=Pt(l.domain,m,e.hass.states);c=r`<div class="field sp-entities-field"><span>${l.label}: ${ne(n.picked.length,"entity","entities")} picked</span></div>
        ${nn(e,`${O}:pick`,g,n.picked,(h,v)=>{let y=te(e)??n,k=y.picked.filter(ie=>ie!==h);he(e,{...y,picked:v?[...k,h]:k})})}
        <div class="sp-acts">
          <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy}
            @click=${()=>{let h=(te(e)??n).picked;me(e,n.kind==="groupCount"?vt(l,h):Ce(l,h))}}>
            ${$("plus")}<span>Add ${n.kind==="groupCount"?"group count":"dynamic list"}</span></button>
        </div>`}d=r`<p class="hint">${p}</p>
      ${n.kind==="dynamicList"?E("Entities",n.mode,M("DynamicMode"),m=>s({mode:m,preset:void 0,picked:[]})):b}
      ${w}${c}`}return r`${J(e,"add","add","Add a row",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Add a row">
    ${o}${d}
    ${typeof i=="string"?r`<div class="hint sp-added" role="status">${i}</div>`:b}
  </fieldset>`,{summary:I(t)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn" @click=${()=>he(e,void 0)}>Done</button>
    </div>`}function Cs(e){let t=C(e);if(t===void 0)return r`<div class="insp-head"><div class="crumbs"><span class="nm">No status page</span></div></div>
      <div class="insp-body"><p class="sp-note">Add a status page to edit it.</p></div>`;let n=I(t)||"Untitled page",s=se(e),i=te(e),a=xn(e),o=it(e.uiState,a),d,u;if(i!==void 0)d=r`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>mn(e)}>${n}</button><span class="sep">›</span><span class="nm">Add a row</span></div>`,u=jn(e,t,i);else if(s!==void 0){let l=A(s),f=l.displayName===""?"Display Name":l.displayName;d=r`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>ae(e,void 0)}>${n}</button><span class="sep">›</span><span class="kchip" style=${`--k:${Xt(e,s)}`}>${Gt(l.rowType)}</span><span class="nm" title=${f}>${f}</span></div>`,u=r`${Pn(e,t,s)}${Ut(e,t)}`}else d=r`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">Page</span><span class="nm" title=${n}>${n}</span></div>`,u=r`${Ln(e,t)}${Ut(e,t)}
      <p class="sp-note">Select a row to edit it, or add one.</p>`;return r`<div class="insp-head">
      ${d}
      <button class="expand" @click=${()=>{ot(e.uiState,a,!o),e.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${u}</div>`}var Es=We`
  .sp-pages-card > .layers, .sp-rows-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .sp-pages-card > .lc-note, .sp-rows-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .sp-rows-card > .lc-note.sp-drag-note { margin-top: 0; font-size: 11.5px; }
  .sp-pages-card > .lc-note.sp-shared-note { margin-top: 0; font-size: 11.5px; }
  /* A linked status page's badge, the page editor's (\`.badge.pe-linked\`):
     cut short in a narrow list, its title holds the whole name. */
  .badge.sp-linked {
    max-width: 140px; overflow: hidden; text-overflow: ellipsis; display: inline-block; line-height: 20px; white-space: nowrap;
    color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
  }
  .lc-btn.on { box-shadow: var(--wa-ring); }
  /* A page's Devices menu, the page editor's: under its row, over the rows
     below, or in the Page card. */
  .layer.sp-page-row { position: relative; }
  .layer.sp-page-row.menu-open { z-index: 31; }
  .layer > .pe-dev-menu.at-row { position: absolute; top: calc(100% - 4px); left: 6px; right: 6px; z-index: 31; }
  .pe-dev-menu.at-card { margin-top: 8px; box-shadow: none; }
  .layer .acts button.icon.sp-dev-open.on, .pe-btn.sp-dev-open.on { color: var(--wa-accent); }
  /* The Not on this list, under the page list. */
  .sp-else { display: flex; flex-direction: column; gap: 4px; padding: 8px 12px 10px; border-top: 1px solid var(--wa-line); }
  .sp-else-h { font-size: 11.5px; font-weight: 700; color: var(--wa-muted); }
  .sp-else-dev { display: flex; align-items: center; gap: 6px; margin-top: 4px; font-size: 11.5px; color: var(--wa-muted); }
  .sp-else-dev svg { width: 12px; height: 12px; color: var(--dc, var(--wa-muted)); }
  .sp-else-row { display: flex; align-items: center; gap: 8px; min-height: 28px; padding: 2px 4px 2px 8px; border-radius: 6px; font-size: 12.5px; }
  .sp-else-row:hover { background: var(--wa-hover); }
  .sp-else-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sp-else-row button.icon { display: inline-grid; place-items: center; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--wa-ink); cursor: pointer; }
  .sp-else-row button.icon:hover:not(:disabled) { background: var(--wa-field); }
  .sp-else-row button.icon:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .sp-else-row button.icon:disabled { opacity: .4; cursor: default; }
  .sp-else-note { font-size: 11px; line-height: 1.4; color: var(--wa-muted); }
  .sp-else-note.ok { color: var(--wa-ok, var(--wa-ink)); }
  .sp-else-note.warn, .sp-else-note.err { color: var(--wa-need); }
  .layer .acts button.icon { display: inline-grid; place-items: center; padding: 0; }
  .layer .acts button.icon:disabled { opacity: .35; cursor: default; }
  .layer .thumb.sp-thumb { display: grid; place-items: center; background: color-mix(in srgb, var(--c, #888) 22%, #000); }
  .layer .thumb .sp-thumb-glyph { display: grid; place-items: center; width: 16px; height: 16px; }
  .layer .thumb .sp-thumb-glyph svg { width: 14px; height: 14px; display: block; }
  .sp-glyph-dot { display: inline-block; border-radius: 50%; }

  /* The watch screen on the stage: black, as tall as the page needs. */
  .sp-screen { position: relative; flex: none; background: #000; color: #fff; overflow: hidden; }
  .sp-w-scroll { display: flex; flex-direction: column; }
  .sp-w-card { display: flex; flex-direction: column; }
  .sp-w-rows { display: flex; flex-direction: column; }
  .sp-w-row, .sp-w-cell { display: flex; align-items: center; min-width: 0; cursor: pointer; line-height: 1.25; }
  .sp-w-row .sp-w-label { flex: 1 1 auto; min-width: 0; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sp-w-row .sp-w-value, .sp-w-cell .sp-w-value { flex: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%; }
  .sp-w-cell { flex: 1 1 0; justify-content: center; }
  .sp-w-cell .sp-w-value { max-width: 100%; }
  .sp-w-cell.sp-w-spacer { cursor: default; }
  .sp-w-pair { display: flex; align-items: center; }
  .sp-w-icon { display: inline-grid; place-items: center; flex: none; }
  .sp-w-icon svg { display: block; }
  .sp-w-header { font-weight: 600; color: rgba(235, 235, 245, .6); cursor: pointer; letter-spacing: .02em; }
  .sp-w-divider { background: rgba(255, 255, 255, .3); opacity: .3; }
  .sp-w-none { color: rgba(235, 235, 245, .6); text-align: center; }
  .sp-w-done { text-align: center; font-weight: 600; background: rgba(255, 255, 255, .14); color: #fff; }
  .sp-w-empty { margin: 40% 12px 0; text-align: center; color: rgba(255, 255, 255, .6); font-size: 12px; }
  .sp-screen { --sp-mark: color-mix(in srgb, var(--wa-accent) 55%, #fff); }
  .sp-w-row.on, .sp-w-cell.on, .sp-w-header.on { outline: 1.5px solid var(--sp-mark); outline-offset: 2px; border-radius: 4px; }

  /* The inspector's cards. A fieldset only to switch every control off at
     once while a save is out; it draws nothing of its own. */
  fieldset.sp-body { margin: 0; padding: 2px 0 0; border: 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; --wa-lab: 104px; }
  .sp-body .hint { margin: 0 0 4px; }
  .sp-note { margin: 10px 2px 2px; font-size: 12px; line-height: 1.4; color: var(--wa-muted); }
  .sp-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 0 2px; }
  .sp-added { color: var(--wa-green, inherit); }
  .hint.ts-under { padding-left: calc(var(--wa-lab) + 8px); margin-top: -2px; }
  .ts-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .ts-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .sp-classes .sp-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0; }
  .pe-chip {
    padding: 3px 10px; border: 1px solid var(--wa-line); border-radius: 999px; background: var(--wa-card); color: var(--wa-ink);
    font: inherit; font-size: 12px; cursor: pointer;
  }
  .pe-chip.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
  .pe-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .sp-entities-field > span { font-weight: 600; }

  /* A searchable checklist of entities. */
  .sp-pick { display: flex; flex-direction: column; gap: 6px; margin: 2px 0 6px; }
  .sp-pick-q {
    width: 100%; min-height: 30px; padding: 0 10px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
    background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px;
  }
  .sp-pick-list { display: flex; flex-direction: column; max-height: 260px; overflow: auto; border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px); }
  .sp-pick-row { display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 8px; align-items: center; padding: 5px 8px; border-top: 1px solid var(--wa-line); cursor: pointer; }
  .sp-pick-row:first-child { border-top: 0; }
  .sp-pick-row > code { grid-column: 2; color: var(--wa-muted); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sp-pick-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
  .sp-pick-none { padding: 8px; color: var(--wa-muted); font-size: 12px; }

  /* The page's look as pictures: a titled group of buttons, each a small
     drawing with its name. A pick is the neutral raised fill and a brighter
     line, the rest a plain grey outline; the mini drawings sit on the
     watch's black and use the panel's own watch art tokens. */
  fieldset.sp-looks { gap: 10px; padding-top: 4px; }
  .sp-look { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .sp-look-title > span { position: relative; display: inline-block; font-size: 12px; color: var(--wa-muted); }
  .sp-look-title > span.changed { color: var(--wa-ink); }
  .sp-look-title button.reset-dot { top: 50%; margin-top: -2.5px; }
  .sp-pics { display: grid; grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr)); gap: 6px; }
  .sp-pic {
    display: flex; flex-direction: column; align-items: stretch; justify-content: center; gap: 6px; min-width: 0;
    padding: 7px 6px 6px; border: 1px solid var(--wa-line-strong); border-radius: 9px; background: transparent;
    color: var(--wa-label); font: inherit; font-size: 11.5px; line-height: 1.2; cursor: pointer;
    transition: background-color .12s ease-out, border-color .12s ease-out;
  }
  .sp-pic:hover:not(:disabled):not(.on) { background: color-mix(in srgb, var(--wa-ink) 4%, transparent); color: var(--wa-ink); }
  .sp-pic.on { background: var(--wa-panel); border-color: var(--wa-accent); color: var(--wa-ink); }
  .sp-pic:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .sp-pic:disabled { opacity: .45; cursor: default; }
  .sp-pic-name { text-align: center; overflow-wrap: anywhere; }
  .sp-pic-name.sub { font-size: 10.5px; color: var(--wa-muted); }
  .sp-pic.on .sp-pic-name.sub { color: var(--wa-label); }
  /* Row style: two mini rows in the style on the watch's black. */
  .sp-pic-well { display: flex; flex-direction: column; gap: 3px; padding: 5px; border-radius: 6px; background: var(--wa-art-screen); }
  .sp-pic-well > i { display: block; height: 9px; }
  .sp-pic-well.plain > i { border-radius: 3px; background: var(--wa-art-dim); }
  .sp-pic-well.pillOutline > i { border-radius: 999px; box-shadow: inset 0 0 0 1px var(--wa-faint); }
  .sp-pic-well.pillFilled > i { border-radius: 999px; background: var(--wa-art-case); }
  /* Layout: the picture beside its name. */
  .sp-pics.across .sp-pic { flex-direction: row; align-items: center; gap: 8px; padding: 6px 8px; }
  .sp-pics.across .sp-pic-name { text-align: left; }
  .sp-pic-grid { flex: none; width: 34px; display: grid; grid-template-columns: 1fr; gap: 2px; padding: 4px; border-radius: 5px; background: var(--wa-art-screen); }
  .sp-pic-grid.two { grid-template-columns: 1fr 1fr; }
  .sp-pic-grid > i { display: block; height: 5px; border-radius: 2px; background: var(--wa-art-clock); }
  /* Icon: the name with a dot on the icon's side. */
  .sp-pics.inline .sp-pic { flex-direction: row; align-items: center; gap: 6px; min-height: 32px; padding: 4px 8px; }
  .sp-pic-dot { flex: none; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
  /* Text size and font: a sample set as the watch would set it. */
  .sp-pics.type .sp-pic { align-items: center; gap: 3px; min-height: 50px; padding: 6px 4px; }
  .sp-pic-sample { line-height: 1; color: inherit; }
  /* Weight: each choice set in its own weight, the pick included. */
  .seg.wide.sp-weight button, .seg.wide.sp-weight button.on { font-weight: var(--w, 400); }

  /* The phone's add lists as a grid of buttons. */
  .sp-presets { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 6px; margin: 4px 0 8px; }
  .sp-preset {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 4px;
    border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px); background: var(--wa-card); color: var(--wa-ink);
    font: inherit; font-size: 12px; cursor: pointer;
  }
  .sp-preset:hover:not(:disabled) { background: var(--wa-panel); }
  .sp-preset.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); }
  .sp-preset:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .sp-preset-glyph { display: grid; place-items: center; width: 22px; height: 22px; }
  .sp-preset-glyph svg { display: block; }
  .sp-preset-label { text-align: center; line-height: 1.2; }
`;export{qn as a,It as b,Gn as c,Bn as d,Yn as e,Zn as f,Xn as g,Qn as h,es as i,ts as j,ns as k,cn as l,un as m,ds as n,$s as o,ks as p,xs as q,C as r,Bt as s,mn as t,bn as u,Ps as v,_s as w,Rs as x,Ts as y,Ds as z,Os as A,Cs as B,Es as C};
