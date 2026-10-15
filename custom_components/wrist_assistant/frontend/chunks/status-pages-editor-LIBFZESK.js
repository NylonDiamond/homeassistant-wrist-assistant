import{A as Ks,B as Ws,C as te,D as V,E as q,F as Qe,G as Vs,H as qs,I as Se,J as Bs,K as Js,L as et,M as Gs,N as Zs,O as tt,P as Ys,Q as B,R as Xs,S as Qs,T as en,U as tn,V as sn,W as nn,X as an,Y as st,Z as on,a as M,b as Ls,c as Ms,d as Ns,e as zs,f as X,g as we,h as Us,i as Fs,j as be,k as qe,m as O,n as Be,o as Je,p as Ge,q as H,r as U,s as Q,t as ee,u as F,v as Ze,w as ye,x as Ye,y as js,z as Xe}from"./chunk-KUXWD4GK.js";import{a as Ds,b as Os,c as Es,d as As,e as Ve,g as Hs,h as Is,p as vn}from"./chunk-57NWD3HT.js";import{o as $s,p as je,q as ks,r as Ke,s as We,w as Ts,x as _s,y as Rs,z as Cs}from"./chunk-PMZSPO3Y.js";import{b as Qt,c as Ee,d as es,e as Ae,f as ts}from"./chunk-ZOJGMATP.js";import{a as rn,b as dn,c as cn,d as ln,e as pn,f as un,g as hn}from"./chunk-MPP3SOED.js";import"./chunk-4I5F75IY.js";import{a as Ue,b as Fe,c as ps,d as us,e as hs,f as fs,g as gs,h as ms,i as vs}from"./chunk-SRQUOJMW.js";import{b as ls,g as Ss,k as xs}from"./chunk-IUAMZ5J7.js";import{a as ws,b as bs,d as ys}from"./chunk-QUOL6HJ4.js";import{E as Xt,Ja as ss,Md as fn,Nd as gn,Od as mn,cc as Le,dc as is,ec as as,fc as Me,gc as os,h as Dt,hc as rs,ic as L,jc as ds,ka as He,lc as Ne,pa as Ie,rb as ns,tc as ze,vc as cs}from"./chunk-IL5ONDCV.js";import{Q as C,R as Ps,j as Y}from"./chunk-YDWRUXOV.js";import{Ai as Wt,Bi as Vt,Ci as Oe,Dg as ge,Di as qt,Fg as Pt,Fh as zt,Gg as Tt,Hg as _t,Ig as Rt,Jg as Ct,b as fe,c as r,ei as Ut,f,hg as xt,hi as Ft,i as kt,j as _,jh as W,k as P,kh as $,oh as Ot,pi as jt,qh as Et,qi as me,rh as At,sh as Ht,th as It,uh as Lt,ui as Kt,vh as Mt,vj as Bt,wh as Nt,xi as ve,xj as Jt,yj as Gt,zj as Zt}from"./chunk-HKQBB55I.js";import{a as Yt,b as z}from"./chunk-5XITPOUG.js";import{a as y}from"./chunk-LO2NM3CE.js";function nt(t){return t===null?void 0:t}function J(t,n){return t!=null&&Object.hasOwn(t,n)?t[n]:void 0}function it(t){if(!Array.isArray(t))return;let n=new Set,e=[];for(let s of t){if(!Y(s)||typeof s.id!="string"||s.id==="")return;let a=s.id.toUpperCase();if(n.has(a))return;n.add(a),e.push([a,s])}return e}function ii(t,n){return t.length===n.length&&t.every((e,s)=>e===n[s])}function wn(t,n){return t===void 0&&n===void 0?{kind:"same"}:t!==void 0&&n!==void 0&&C(t,n)?{kind:"same"}:{kind:"changed",page:n}}function at(t){return t!==void 0&&typeof t.name=="string"?t.name:""}function bn(t,n,e){let s=nt(t),a=nt(n),i=nt(e),o=s===void 0?[]:it(s),d=a===void 0?void 0:it(a),l=i===void 0?void 0:it(i);if(o===void 0||d===void 0||l===void 0)return{pages:C(a,s)?i:a,clashes:[]};let c=new Map(o),p=new Map(d),h=new Map(l),v=[],u=x=>{let E=c.get(x),D=p.get(x),R=h.get(x),he=wn(E,D),si=wn(E,R);if(he.kind==="same")return R;if(si.kind==="same")return D;if(D!==void 0&&R!==void 0&&C(D,R))return R;if(D!==void 0||R!==void 0){let ni=at(R)||at(D)||at(E);v.push({id:R?.id??D?.id??E?.id,name:ni})}return R},g=d.map(([x])=>x).filter(x=>c.has(x)),m=o.map(([x])=>x).filter(x=>p.has(x)),w=!ii(g,m),[k,S]=w?[d,l]:[l,d],T=k.map(([x])=>x),pe=new Set(T);S.forEach(([x],E)=>{if(pe.has(x))return;let D=0;for(let R=E-1;R>=0;R--){let he=T.indexOf(S[R][0]);if(he>=0){D=he+1;break}}T.splice(D,0,x),pe.add(x)});let ue=[];for(let x of T){let E=u(x);E!==void 0&&ue.push(E)}let $t=x=>x.length===ue.length&&ue.every((E,D)=>E===x[D]);return $t(i)?{pages:i,clashes:v}:$t(a)?{pages:a,clashes:v}:{pages:ue,clashes:v}}function yn(t,n,e){return bn(t==null?[]:J(t,O),J(n,O),J(e,O)).clashes}function Sn(t,n,e){let s=Ps(t,n,e),a=bn(t==null?[]:J(t,O),J(n,O),J(e,O)).pages;if(a===void 0){if(!Object.hasOwn(s,O))return s;let i={};for(let o of Object.keys(s))o!==O&&(i[o]=s[o]);return i}if(s[O]===a)return s;if(s===e||s===n){let i={...s};return i[O]=a,$e(i,e)?e:$e(i,n)?n:i}return s[O]=a,$e(s,e)?e:$e(s,n)?n:s}function $e(t,n){let e=Object.keys(t);return e.length!==Object.keys(n).length?!1:e.every(s=>Object.hasOwn(n,s)&&n[s]===t[s])}var $n=100,ai=3,ke=class{constructor(n,e){this._undo=[];this._redo=[];this._kept=[];this._base=n,this._revision=e,this._document=n}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get kept(){return this._kept}get dirty(){let n=this._dirty;if(n!==void 0&&n.document===this._document&&n.base===this._base)return n.value;let e=this._document!==this._base&&!C(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(n,e){if(n===this._document||C(n,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let s=this._undo[this._undo.length-1];return C(n,s)?(this._undo.pop(),this._document=s,this._coalesceKey=void 0):this._document=n,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=n,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let n=this._undo.pop();return n===void 0?!1:(this._redo.push(this._document),this._document=n,!0)}redo(){this._coalesceKey=void 0;let n=this._redo.pop();return n===void 0?!1:(this.pushUndo(this._document),this._document=n,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(n,e){return e<this._revision?(this._kept=[],!1):this.mergeOnto(n,e)}restart(n,e){return this.mergeOnto(n,e)}mergeOnto(n,e){this._coalesceKey=void 0;let s=this._base;this._kept=this._document===s?[]:yn(s,this._document,n);let a=new Map,i=h=>{let v=a.get(h);if(v!==void 0)return v;let u=h===s?n:Sn(s,h,n);return u!==n&&C(u,n)&&(u=n),a.set(h,u),u},o=this._document,d=[...this._undo,this._document,...this._redo.slice().reverse()].map(i),l=this._undo.length,c=[],p=0;return d.forEach((h,v)=>{let u=c[c.length-1];u!==void 0&&(u===h||C(u,h))?v===l&&(c[c.length-1]=h):c.push(h),v===l&&(p=c.length-1)}),this._undo=c.slice(0,p),this._document=c[p],this._redo=c.slice(p+1).reverse(),this._base=n,this._revision=e,this._document!==o&&!C(this._document,o)}saved(n,e){e<this._revision||(this._coalesceKey=void 0,this._base=n,this._revision=e)}get saving(){return se.has(this)}get saveDone(){return se.get(this)}pushUndo(n){this._undo.push(n),this._undo.length>$n&&this._undo.splice(0,this._undo.length-$n)}},se=new WeakMap;function kn(t,n){if(se.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"These status pages are being saved already."});let e=oi(t,n).finally(()=>se.delete(t));return se.set(t,e),e}async function oi(t,n){let e=!1,s=new Map,a=()=>s.size===0?{}:{kept:[...s.values()]},i=(o,d,l)=>({ok:!1,revision:t.revision,merged:e,code:o,message:d,...a(),...l===void 0?{}:{problems:l}});for(let o=1;;o++){let d=t.document,l=nn(d);if(l.length>0)return i("invalid",l.join(" "),l);let c;try{({revision:c}=await n.save(t.revision,d))}catch(p){let{code:h="unknown",message:v}=z(p);if(h!=="conflict"||o>=ai)return i(h,v);let u;try{u=await n.fetch()}catch(g){let m=z(g);return i(m.code??"unknown",m.message)}if(!Y(u)||!(u.revision>0)||!Y(u.document))return i("no_record","Home Assistant holds no status pages for this watch.");u.revision<t.revision?t.restart(u.document,u.revision):t.rebase(u.document,u.revision);for(let g of t.kept)s.set(g.id.toUpperCase(),g);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0,...a()};continue}return t.saved(d,c),{ok:!0,revision:t.revision,merged:e,...a()}}}var N=new Map;function j(t){return N.get(t)}function ot(t,n,e){let s=N.get(t);if(s!==void 0&&e<=0)return{draft:s,mergedIntoEdits:!1,kept:[]};if(s===void 0||e<s.revision&&!s.dirty){let o=new ke(n,e);return N.set(t,o),{draft:o,mergedIntoEdits:!1,kept:[]}}if(e===s.revision)return{draft:s,mergedIntoEdits:!1,kept:[]};let a=s.dirty,i=e<s.revision?s.restart(n,e):s.rebase(n,e);return{draft:s,mergedIntoEdits:a&&i,kept:a?s.kept:[]}}function rt(t){let n=N.get(t);if(n===void 0){let e=new ke(qe(),0);return N.set(t,e),e}return n.revision>0&&!n.saving&&n.restart(qe(),0),n}function xe(t){N.delete(t)}function dt(){for(let t of N.values())if(t.dirty)return!0;return!1}function xn(){N.clear()}function ri(t){return t.name.trim()===""?"a status page":`"${t.name}"`}function Pe(t){if(t.length===0)return"";let n=t.map(ri);return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"That save's version was kept.":"That save's versions were kept."}`}function Pn(t){if(t.ok){let e=t.kept??[];if(t.alreadySaved===!0){let s=e.length>0?` ${Pe(e)}`:"";return{kind:e.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.${s}`}}return e.length>0?{kind:"warn",text:`Saved. ${Pe(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The status pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds status pages for this watch. Your edits are kept, so save again."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the status pages is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the status pages${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Yt}`};case"busy":return{kind:"warn",text:"Already saving these status pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}var K="status-pages",En="sp:page",Z="sp:row",I="sp:add",ne="sp:drag",ae="sp:added",An="wrist-assistant-panel.status-pages.zoom.v1";function Hn(t=Ee()){try{let n=t?.getItem(An),e=n==null||n===""?NaN:Number(n);return $s.includes(e)?e:void 0}catch{return}}function In(t,n=Ee()){try{n?.setItem(An,t===void 0?"":String(t))}catch{}}var di="Pages the watch opens from a tile, a menu slot or Siri. A save reaches the watch the next time it checks.",Ln="Drawn from Home Assistant's states now, as the watch draws the page. Tap a row to edit it.";function de(t,n,e){return`${t} ${t===1?n:e}`}function oe(t,n){let e=t.states[n]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:n}function Mn(t,n){let e=n.indexOf(".");return{entityId:n,displayName:n===""?"":oe(t,n),domain:e<0?"":n.slice(0,e)}}function ci(t){switch(t){case"battery_charging":return"charging";case"illuminance":return"light";case"occupancy":case"presence":return"occupancy";case"garage_door":case"garage":return"garage";case"carbon_monoxide":return"CO";default:return t.replaceAll("_"," ")}}function li(t,n){if(n!==void 0&&n.length>0){let e=n.map(ci),s=e.length===1?e[0]:e.slice(0,2).join("/");return t==="sensor"||t==="binary_sensor"?`${s} sensors`:t==="cover"?s.includes("garage")?"garage doors":`${s} covers`:`${s} ${t}s`}return t==="person"?"people":t==="binary_sensor"?"binary sensors":`${t}s`}function lt(t){let n=M(t),e=s=>`${s} ${s===1?"entity":"entities"}`;switch(n.rowType){case"entity":return n.entityId;case"groupCount":return`${e(n.groupEntityIds?.length??0)} \xB7 group count`;case"dynamicList":return n.dynamicMode==="all"?`all ${li(n.domain,n.deviceClassFilter)} \xB7 dynamic list`:`${e(n.groupEntityIds?.length??0)} \xB7 dynamic list`;case"sectionHeader":return"section header";default:return n.rowType}}function Nn(t){return be.labels.StatusRowType?.[t]??t}function A(t){let n=Ge(t.document),e=t.uiState.get(En);return(typeof e=="string"?n.find(s=>F(H(s),e)):void 0)??n[0]}function zn(t,n){t.uiState.set(En,n),t.uiState.delete(Z),t.uiState.delete(I),t.requestUpdate()}function ce(t){let n=t.uiState.get(Z);return typeof n=="string"?ye(A(t),n):void 0}function le(t,n){n===void 0?t.uiState.delete(Z):t.uiState.set(Z,n),t.uiState.delete(I),t.requestUpdate()}function ht(t){return ce(t)===void 0&&!t.uiState.has(I)?!1:(t.uiState.delete(Z),t.uiState.delete(I),t.requestUpdate(),!0)}function re(t){let n=t.uiState.get(I);return typeof n=="object"&&n!==null?n:void 0}function _e(t,n){n===void 0?t.uiState.delete(I):(t.uiState.set(I,n),t.uiState.delete(Z)),t.requestUpdate()}function pi(t,n="entity"){t.uiState.delete(ae),_e(t,{kind:n,mode:"all",picked:[]})}function Te(t,n,e=!1){let s=A(t);if(s===void 0)return;let a=H(s),i;return t.edit(o=>{let d=Gs(o,a,n);return i=d.id,d.document}),i!==void 0&&!e&&le(t,i),i}function ui(t){let n;t.edit(e=>{let s=js(e);return n=s.id,s.document}),n!==void 0&&zn(t,n)}function Un(t,n,e,s,a){return{start:i=>{t.uiState.set(ne,{list:n,id:e}),i.dataTransfer?.setData("text/plain",e),i.dataTransfer&&(i.dataTransfer.effectAllowed="move")},over:i=>{t.uiState.get(ne)?.list===n&&(i.preventDefault(),i.dataTransfer&&(i.dataTransfer.dropEffect="move"))},drop:i=>{let o=t.uiState.get(ne);t.uiState.delete(ne),!(o?.list!==n||F(o.id,e))&&(i.preventDefault(),a(o.id,s))},end:()=>{t.uiState.delete(ne)}}}function ft(t,n,e,s){return t.icons.render(n,e,s)??r`<span class="sp-glyph-dot" style=${`background:${s};width:${Math.max(4,e*.6)}px;height:${Math.max(4,e*.6)}px`}></span>`}function Fn(t,n,e){return r`<span class="thumb sp-thumb" style=${`--c:${e}`} aria-hidden="true"><span class="sp-thumb-glyph">${ft(t,n,14,e)}</span></span>`}function jn(t,n){let e=M(n);return e.rowType==="sectionHeader"?X.secondary:e.rowType==="entity"?we(e.domain,t.hass.states[e.entityId]?.state):we(e.domain,"on")}function hi(t,n,e,s,a){let i=H(n),o=U(n),d=a!==void 0&&F(i,H(a)),l=Q(n).length,c=(v,u)=>t.edit(g=>Ks(g,v,u)),p=Un(t,"page",i,e,c),h=()=>{d||zn(t,i)};return r`<div class="layer sp-page-row ${d?"hl":""}" data-page=${i} role="listitem" tabindex="0"
    draggable=${t.busy?"false":"true"} aria-current=${d?"true":"false"} aria-label=${o||"Untitled page"}
    @dragstart=${p.start} @dragover=${p.over} @drop=${p.drop} @dragend=${p.end}
    @click=${v=>{v.target instanceof Element&&v.target.closest("button")||h()}}
    @keydown=${v=>{v.target!==v.currentTarget||v.key!=="Enter"&&v.key!==" "||(v.preventDefault(),h())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Fn(t,"doc.text.fill","#5B8FD4")}
    <span class="name"><b><span class="nm-t">${o||"Untitled page"}</span></b><small>${de(l,"row","rows")}</small></span>
    <span class="right">
      <span class="badges">${Ye(n)?r`<span class="badge" title="One of the app's starter pages. The watch treats it as any other page.">starter</span>`:f}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${t.busy||e===0} title="Move up" aria-label=${`Move ${o} up`}
          @click=${()=>c(i,e-1)}>${$("up")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||e===s-1} title="Move down" aria-label=${`Move ${o} down`}
          @click=${()=>c(i,e+1)}>${$("down")}</button>
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Delete" aria-label=${`Delete ${o}`}
          @click=${()=>t.edit(v=>Xe(v,i))}>${$("delete")}</button>
      </span>
    </span>
  </div>`}function Kn(t){let n=Ge(t.document),e=A(t);return r`<section class="card lc sp-pages-card" aria-label="Status pages" style="--c: var(--wa-lc-pages, #26a69a); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${$("list")}</span><span class="lc-title">Status pages</span>
      <span class="lc-sub" title=${di}>${de(n.length,"page","pages")}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-page" aria-label="Add status page" ?disabled=${t.busy}
        title="Add a status page" @click=${()=>ui(t)}>${$("plus")}<span>Add</span></button>
    </div>
    ${n.length===0?r`<div class="lc-note">No status pages. Add one to show the live state of entities you pick.</div>`:r`<div class="layers sp-page-list" role="list">${n.map((s,a)=>hi(t,s,a,n.length,e))}</div>`}
  </section>`}function fi(t,n,e,s,a,i){let o=ee(e),d=M(e),l=i!==void 0&&F(o,ee(i)),c=d.isHidden===!0,p=d.displayName===""?"Display Name":d.displayName,h=(m,w)=>t.edit(k=>Ys(k,n,m,w)),v=Un(t,"row",o,s,h),u=()=>le(t,o),g=d.rowType==="sectionHeader"?"line.horizontal.3":d.iconName;return r`<div class="layer sp-row-row ${l?"hl":""} ${c?"dim":""}" data-row=${o} role="listitem" tabindex="0"
    draggable=${t.busy?"false":"true"} aria-current=${l?"true":"false"} aria-label=${p}
    title=${`${p} \xB7 ${lt(e)}${c?", hidden":""}`}
    @dragstart=${v.start} @dragover=${v.over} @drop=${v.drop} @dragend=${v.end}
    @click=${m=>{m.target instanceof Element&&m.target.closest("button")||u()}}
    @keydown=${m=>{m.target!==m.currentTarget||m.key!=="Enter"&&m.key!==" "||(m.preventDefault(),u())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Fn(t,g,jn(t,e))}
    <span class="name"><b><span class="nm-t">${p}</span></b><small>${lt(e)}</small></span>
    <span class="right">
      <span class="badges">${c?r`<span class="badge">hidden</span>`:f}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${t.busy} title=${c?"Show":"Hide"} aria-label=${`${c?"Show":"Hide"} ${p}`}
          @click=${()=>t.edit(m=>B(m,n,o,"isHidden",!c))}>${$(c?"show":"hide")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||s===0} title="Move up" aria-label=${`Move ${p} up`}
          @click=${()=>h(o,s-1)}>${$("up")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||s===a-1} title="Move down" aria-label=${`Move ${p} down`}
          @click=${()=>h(o,s+1)}>${$("down")}</button>
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Remove" aria-label=${`Remove ${p}`}
          @click=${()=>t.edit(m=>tt(m,n,o))}>${$("delete")}</button>
      </span>
    </span>
  </div>`}function Wn(t){let n=A(t),e=n===void 0?[]:Q(n),s=ce(t),a=n===void 0?"":H(n),i;n===void 0?i=r`<div class="lc-note">Add a status page to give it rows.</div>`:e.length===0?i=r`<div class="lc-note">No rows yet. Add entities to show in this status page.</div>`:i=r`<div class="layers sp-row-list" role="list">${e.map((d,l)=>fi(t,a,d,l,e.length,s))}</div>
    <div class="lc-note sp-drag-note">Drag a row, or use its arrows, to reorder.</div>`;let o=re(t)!==void 0;return r`<section class="card lc sp-rows-card" aria-label="Rows" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${$("layers")}</span><span class="lc-title">Rows</span>
      ${n===void 0?f:r`<span class="lc-sub">${de(e.length,"row","rows")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-row ${o?"on":""}" aria-label="Add row" ?disabled=${t.busy||n===void 0}
        title="Add an entity, a group count, a dynamic list or a header" @click=${()=>pi(t)}>${$("plus")}<span>Add</span></button>
    </div>
    ${i}
  </section>`}var Re={small:{row:10,compact:9,icon:14},medium:{row:12,compact:10,icon:16},large:{row:14,compact:12,icon:18}},gt={regular:400,medium:500,semibold:600,bold:700},Ce={default:"-apple-system, system-ui, 'SF Pro Text', 'Helvetica Neue', sans-serif",rounded:"ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, monospace",serif:"ui-serif, 'New York', Georgia, serif"},Tn={ultraThin:.1,thin:.13,regular:.16,thick:.2,ultraThick:.24};function gi(t){let n=e=>{let s=te().find(a=>a.key===e);return q(t,s)};return{rowStyle:String(n("rowStyle")),textSize:String(n("textSize")),fontWeight:String(n("fontWeight")),fontDesign:String(n("fontDesign")),rowSpacing:Number(n("rowSpacing")),backgroundMaterial:String(n("backgroundMaterial")),columnLayout:String(n("columnLayout")),showDividers:n("showDividers")===!0,iconPosition:String(n("iconPosition")),horizontalPadding:Number(n("horizontalPadding"))}}function mt(t){return X[t]??X.secondary}function Vn(t,n){return t.rowStyle==="pillFilled"?`background:color-mix(in srgb, ${n} 15%, transparent);`:t.rowStyle==="pillOutline"?`box-shadow:inset 0 0 0 0.75px color-mix(in srgb, ${n} 40%, transparent);`:""}function De(t,n,e,s,a){let i=mt(e.color);return r`<span class="sp-w-icon" style=${`width:${s*a}px`}>${ft(t,e.icon,Math.round(s*.8*a),i)}</span>`}function _n(t,n,e,s){let a=t.scale,i=Re[n.textSize]??Re.medium,o=s!==void 0&&F(s,e.rowId),d=()=>le(t,e.rowId);if(e.kind==="sectionHeader")return r`<div class="sp-w-header ${o?"on":""}" style=${`font-size:${9*a}px;text-align:${e.align==="center"?"center":e.align==="trailing"?"right":"left"}`}
      @click=${d}>${e.label}</div>`;let l=mt(e.color),c=n.rowStyle==="plain";return r`<div class="sp-w-row ${o?"on":""}" title=${e.entityId??e.label}
    style=${`gap:${6*a}px;font-size:${i.row*a}px;font-weight:${gt[n.fontWeight]??400};padding:${c?0:4*a}px ${c?0:8*a}px;border-radius:${6*a}px;${Vn(n,l)}`}
    @click=${d}>
    ${n.iconPosition==="leading"?De(t,n,e,i.icon,a):f}
    <span class="sp-w-label">${e.label}</span>
    <span class="sp-w-value" style=${`color:${l}`}>${e.value}</span>
    ${n.iconPosition==="trailing"?De(t,n,e,i.icon,a):f}
  </div>`}function Rn(t,n,e,s){let a=t.scale,i=Re[n.textSize]??Re.medium,o=s!==void 0&&F(s,e.rowId),d=mt(e.color),l=n.rowStyle==="plain";return r`<div class="sp-w-cell ${o?"on":""}" title=${e.label}
    style=${`gap:${3*a}px;font-size:${i.compact*a}px;font-weight:${gt[n.fontWeight]??400};padding:${l?0:3*a}px ${l?0:6*a}px;border-radius:${6*a}px;${Vn(n,d)}`}
    @click=${()=>le(t,e.rowId)}>
    ${n.iconPosition==="leading"?De(t,n,e,i.icon,a):f}
    <span class="sp-w-value" style=${`color:${d}`}>${e.value}</span>
    ${n.iconPosition==="trailing"?De(t,n,e,i.icon,a):f}
  </div>`}function Cn(t){return r`<div class="sp-w-divider" style=${`height:${Math.max(1,.5*t)}px`}></div>`}function qn(t){let{width:n,height:e}=t.screen,s=t.scale,a=A(t),i=ce(t),o=i===void 0?void 0:ee(i),d;if(a===void 0)d=r`<p class="sp-w-empty">No status page.</p>`;else{let p=gi(a),h=Fs(a,t.hass.states),v=p.columnLayout==="twoColumn"?Us(h).map((g,m,w)=>r`${g.kind==="header"?_n(t,p,g.row,o):r`<div class="sp-w-pair" style=${`gap:${8*s}px`}>${Rn(t,p,g.first,o)}${g.second===void 0?r`<span class="sp-w-cell sp-w-spacer"></span>`:Rn(t,p,g.second,o)}</div>`}
          ${p.showDividers&&m<w.length-1?Cn(s):f}`):h.map((g,m)=>r`${_n(t,p,g,o)}${p.showDividers&&m<h.length-1?Cn(s):f}`),u=Tn[p.backgroundMaterial]??Tn.regular;d=r`<div class="sp-w-scroll" style=${`padding:${30*s}px ${6*s}px ${12*s}px;gap:${12*s}px`}>
      <div class="sp-w-card" style=${`padding:${8*s}px ${(6+p.horizontalPadding)*s}px;border-radius:${14*s}px;background:rgba(255,255,255,${u});font-family:${Ce[p.fontDesign]??Ce.default}`}>
        <div class="sp-w-rows" style=${`gap:${p.rowSpacing*s}px;padding:${4*s}px 0`}>
          ${h.length===0?r`<span class="sp-w-none" style=${`font-size:${11*s}px`}>${Q(a).length===0?"Add entities":"Nothing to show now"}</span>`:v}
        </div>
      </div>
      <div class="sp-w-done" style=${`font-size:${15*s}px;padding:${12*s}px 0;border-radius:${20*s}px`}>Done</div>
    </div>`}let l=t.phone===void 0?"Status page on the watch":"Status page on the iPhone",c=r`<div class="sp-screen" role="group" aria-label=${l}
    style=${`width:${Math.round(n*s)}px;min-height:${Math.round(e*s)}px`}>${d}</div>`;return Hs(t.phone,{width:n,height:e},s,c,l,t.icons)}function Bn(t){let n=A(t);if(n===void 0)return[];let e=Q(n),s=e.filter(a=>a.isHidden===!0).length;return[de(e.length,"row","rows")+(s>0?`, ${s} hidden`:"")]}function Jn(t,n){return Ts(t.uiState,K,n)}function mi(t,n){_s(t.uiState,K,n,!Jn(t,n)),t.requestUpdate()}var vi={row:{color:W.content,icon:"content"},add:{color:W.content,icon:"plus"},page:{color:W.place,icon:"text"},rows:{color:"var(--wa-hue-yellow)",icon:"checklist"},text:{color:W.place,icon:"text"},more:{color:W.place,icon:"look"}},wi=["look-rows","look-text","look-more"];function G(t,n,e,s,a,i={}){let o=Jn(t,e),d=vi[n];return Nt({color:d.color,icon:$(d.icon),title:s,open:o,onToggle:()=>mi(t,e),...i.summary===void 0||i.summary===""?{}:{summary:i.summary},dot:i.dot===!0,id:`${K}:${e}`},o?a:r``)}function bi(t){if(re(t)!==void 0)return[{module:K,section:"add"}];let n=wi.map(e=>({module:K,section:e}));return ce(t)!==void 0?[{module:K,section:"row"},...n]:[{module:K,section:"page"},...n]}function Gn(t,n,e,s,a){let i=`${n}:q`,o=String(t.uiState.get(i)??"").trim().toLowerCase(),d=new Set(s),l=e.filter(h=>o===""||h.toLowerCase().includes(o)||oe(t.hass,h).toLowerCase().includes(o)),c=[...l.filter(h=>d.has(h)),...l.filter(h=>!d.has(h))],p=c.slice(0,200);return r`<div class="sp-pick">
    <input type="search" class="sp-pick-q" placeholder="Search entities" aria-label="Search entities" .value=${String(t.uiState.get(i)??"")}
      @input=${h=>{t.uiState.set(i,h.target.value),t.requestUpdate()}} />
    <div class="sp-pick-list" role="group" aria-label="Entities">
      ${p.length===0?r`<div class="sp-pick-none">${e.length===0?"No entity of this kind in Home Assistant.":"No entity matches."}</div>`:f}
      ${p.map(h=>r`<label class="sp-pick-row">
        <input type="checkbox" .checked=${d.has(h)} ?disabled=${t.busy}
          @change=${v=>a(h,v.target.checked)} />
        <span class="sp-pick-name">${oe(t.hass,h)}</span><code>${h}</code>
      </label>`)}
      ${c.length>p.length?r`<div class="sp-pick-none">${c.length-p.length} more. Search to narrow the list.</div>`:f}
    </div>
  </div>`}function yi(t,n,e){let s=H(n),a=ee(e),i=M(e),o=(u,g,m)=>t.edit(w=>B(w,s,a,u,g),m),d=i.rowType==="sectionHeader",l=i.rowType==="groupCount"||i.rowType==="dynamicList",c=i.rowType==="dynamicList"&&i.dynamicMode==="all",p=i.rowType==="groupCount"||i.rowType==="dynamicList"&&!c,h=[];if(h.push(L("Visibility",i.isHidden===!0?"hidden":"visible",[["visible","Visible"],["hidden","Hidden"]],u=>o("isHidden",u==="hidden"))),h.push(Me("Label",i.displayName,u=>o("displayName",u,`row:${a}:label`),{placeholder:"Display Name"})),d?h.push(L("Alignment",i.headerAlignment??"leading",V("HeaderAlignment"),u=>o("headerAlignment",u))):h.push(r`<div class="ts-stack">${cs({icons:t.icons,symbols:t.symbols},i.iconName,u=>o("iconName",u,`row:${a}:icon`),`sp:icon:${a}`)}</div>`),i.rowType==="entity"&&h.push(r`<div class="ts-stack">${ze({hass:t.hass},"Entity",Mn(t.hass,i.entityId),u=>{let g=u.entityId.trim();g!==""&&t.edit(m=>{let w=B(m,s,a,"entityId",g),k=Se(g,t.hass.states);return w=B(w,s,a,"domain",k.domain),i.iconName===Se(i.entityId).iconName&&(w=B(w,s,a,"iconName",k.iconName)),w})},`sp:entity:${a}`,{clearable:!1})}</div>`),l&&i.domain!=="sensor"){let u=Ms(i.domain,i.deviceClassFilter);if(u.length>=2){let g=Ls(i),m=u.map(w=>[w.value,w.label]);m.some(([w])=>w===g)||m.push([g,zs(g)]),h.push(L("Show State",g,m,w=>o("filterState",w)))}}if(i.rowType==="dynamicList"&&(h.push(L("Entities",c?"all":"specific",V("DynamicMode"),u=>o("dynamicMode",u))),h.push(Ne("Show all states",i.showAllStates===!0,u=>o("showAllStates",u?!0:void 0),!1)),h.push(r`<div class="hint ts-under">On: every entity is listed whatever its state. Off: only those in the state above.</div>`)),i.domain==="sensor"&&(i.rowType==="groupCount"||c)&&(h.push(os(Ns(i.deviceClassFilter),i.maxNumericValue,u=>o("maxNumericValue",u,`row:${a}:max`),{optional:!0,placeholder:"No limit",def:null})),h.push(r`<div class="hint ts-under">Only states at or below it count. Empty is no limit.</div>`)),l){let u=i.deviceClassFilter??[],g=en(i.domain,t.hass.states,u),m=w=>{let k=M(ye(Ze(t.document,s),a)??e).deviceClassFilter??[],S=k.includes(w)?k.filter(T=>T!==w):[...k,w];o("deviceClassFilter",S.length===0?void 0:S)};h.push(r`<div class="field sp-classes"><span>Device classes</span>
      <div class="sp-chips" role="group" aria-label="Device classes">
        ${g.length===0?r`<span class="hint">None reported for ${i.domain===""?"this row":i.domain}.</span>`:f}
        ${g.map(w=>{let k=u.includes(w);return r`<button type="button" class="pe-chip ${k?"on":""}" aria-pressed=${k?"true":"false"} ?disabled=${t.busy}
            @click=${()=>m(w)}>${w.replaceAll("_"," ")}</button>`})}
      </div></div>
      <div class="hint ts-under">${u.length===0?"None picked: every class counts.":"Only entities of these classes count."}</div>`)}if(p){let u=i.groupEntityIds??[],g=Xs(e,t.hass.states);h.push(r`<div class="field sp-entities-field"><span>Edit Entities (${u.length})</span></div>
      ${Gn(t,`sp:ents:${a}`,g,u,(m,w)=>{let k=M(ye(Ze(t.document,s),a)??e).groupEntityIds??[],S=w?k.includes(m)?k:[...k,m]:k.filter(T=>T!==m);o("groupEntityIds",S)})}`)}let v=r`<fieldset class="sp-body" ?disabled=${t.busy} aria-label="Row">${h}</fieldset>`;return r`${G(t,"row","row",Nn(i.rowType),v,{summary:lt(e)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Remove this row from the page"
        @click=${()=>t.edit(u=>tt(u,s,a))}>${$("delete")}<span>Remove</span></button>
    </div>`}function Si(t,n,e,s){let a=q(e,s),i=(o,d)=>t.edit(l=>Qe(l,n,s.key,o),d);switch(s.kind){case"switch":return r`${Ne(s.label,a===!0,o=>i(o),s.default)}
        ${s.help===void 0?f:r`<div class="hint ts-under">${s.help}</div>`}`;case"slider":return ds(s.label,Number(a),o=>i(o,`style:${n}:${s.key}`),{min:s.min??0,max:s.max??1,step:s.step??1,def:Number(s.default),...s.unit===void 0?{}:{unit:s.unit}});default:{let o=be.types.page.keys[s.key]?.enum??"",d=V(o);return d.length<=4?L(s.label,String(a),d,l=>i(l),{def:String(s.default)}):rs(s.label,String(a),d,l=>i(l),{def:String(s.default),snapBack:!0})}}}var pt=["rowStyle","columnLayout","iconPosition"],ut=["textSize","fontDesign","fontWeight"],Dn=new Set([...pt,...ut]),$i={small:12,medium:15,large:18};function ki(t,n,e){let s=te().find(c=>c.key===e);if(s===void 0)return;let a=H(n),i=String(q(n,s)),o=V(be.types.page.keys[e]?.enum??""),d=o.find(([c])=>c===i)?.[1]??i;return{field:s,value:i,choices:o,name:d,set:c=>{c!==String(q(A(t)??n,s))&&t.edit(p=>Qe(p,a,e,c))}}}function ct(t,n){return te().some(e=>n(e.key)&&!C(q(t,e),e.default))}function ie(t,n,e,s=""){let a=i=>n.choices.find(([o])=>o===i)?.[1]??i;return r`<div class="sp-look">
    <div class="sp-look-title">${Le(t,n.value,String(n.field.default),i=>n.set(i),a)}</div>
    <div class="sp-pics ${s}" role="group" aria-label=${t} style=${`--n:${n.choices.length}`}>
      ${n.choices.map(([i,o])=>{let d=i===n.value;return r`<button type="button" class="sp-pic ${d?"on":""}" aria-pressed=${d?"true":"false"} aria-label=${`${t}: ${o}`}
          @click=${()=>n.set(i)}>${e(i,o)}</button>`})}
    </div>
  </div>`}function xi(t,n){return r`<span class="sp-pic-well ${t}" aria-hidden="true"><i></i><i></i></span><span class="sp-pic-name">${n}</span>`}function Pi(t,n){return r`<span class="sp-pic-grid ${t==="twoColumn"?"two":""}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sp-pic-name">${n}</span>`}function Ti(t,n){let e=r`<i class="sp-pic-dot" aria-hidden="true"></i>`;return r`${t==="leading"?e:f}<span class="sp-pic-name">${n}</span>${t==="trailing"?e:f}`}function _i(t,n){return r`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:${$i[t]??15}px`}>Aa</span><span class="sp-pic-name sub">${n}</span>`}function Ri(t,n){return r`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:18px;font-family:${Ce[t]??Ce.default}`}>Ag</span><span class="sp-pic-name sub">${n}</span>`}function Ci(t){let n=e=>t.choices.find(([s])=>s===e)?.[1]??e;return r`<div class="field seg-field sp-weight-field">${Le("Weight",t.value,String(t.field.default),e=>t.set(e),n)}
    <div class="seg wide sp-weight" role="group" aria-label="Weight">
      ${t.choices.map(([e,s])=>{let a=e===t.value;return r`<button type="button" class=${a?"on":""} aria-pressed=${a?"true":"false"} aria-label=${`Weight: ${s}`}
          style=${`--w:${gt[e]??400}`} @click=${()=>t.set(e)}>${s}</button>`})}
    </div></div>`}function On(t,n){let e=H(n),s=S=>ki(t,n,S),[a,i,o]=pt.map(s),[d,l,c]=ut.map(s),p=S=>S.filter(T=>T!==void 0).map(T=>T.name).join(", "),h=ct(n,S=>pt.includes(S)),v=ct(n,S=>ut.includes(S)),u=ct(n,S=>!Dn.has(S)),g=qs(n),m=G(t,"rows","look-rows","Rows",r`<fieldset class="sp-body sp-looks" ?disabled=${t.busy} aria-label="Rows">
    ${a===void 0?f:ie("Style",a,xi)}
    ${i===void 0?f:ie("Layout",i,Pi,"across")}
    ${o===void 0?f:ie("Icon",o,Ti,"inline")}
  </fieldset>`,{summary:p([a,i]),dot:h}),w=G(t,"text","look-text","Text",r`<fieldset class="sp-body sp-looks" ?disabled=${t.busy} aria-label="Text">
    ${d===void 0?f:ie("Size",d,_i,"type")}
    ${l===void 0?f:ie("Font",l,Ri,"type")}
    ${c===void 0?f:Ci(c)}
  </fieldset>`,{summary:p([d,c,l]),dot:v}),k=G(t,"more","look-more","More",r`<fieldset class="sp-body" ?disabled=${t.busy} aria-label="More">
    ${te().filter(S=>!Dn.has(S.key)).map(S=>Si(t,e,n,S))}
  </fieldset>`,{summary:u?"Changed":"Defaults",dot:u});return r`${m}${w}${k}
    <div class="sp-acts">
      <button type="button" class="pe-btn" ?disabled=${t.busy||!g} title="Put the page's whole look back to the app's defaults"
        @click=${()=>t.edit(S=>Vs(S,e))}>${$("reset")}<span>Reset to Defaults</span></button>
    </div>`}function Di(t,n){let e=H(n),s=U(n);return G(t,"page","page","Page",r`<fieldset class="sp-body" ?disabled=${t.busy} aria-label="Page">
    ${Me("Name",s,a=>t.edit(i=>Ws(i,e,a),`page:${e}:name`),{placeholder:"Page Name"})}
    ${Ye(n)?r`<div class="hint ts-under">One of the app's starter pages. It is edited and deleted like any other.</div>`:f}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Delete this status page"
        @click=${()=>t.edit(a=>Xe(a,e))}>${$("delete")}<span>Delete page</span></button>
    </div>
  </fieldset>`,{summary:s})}function Oi(t,n,e,s){let a=we(n.domain,"on");return r`<button type="button" class="sp-preset ${e?"on":""}" aria-pressed=${e?"true":"false"} ?disabled=${t.busy} @click=${s}>
    <span class="sp-preset-glyph">${ft(t,n.icon,18,a===X.secondary?"#5B8FD4":a)}</span>
    <span class="sp-preset-label">${n.label}</span>
  </button>`}function Ei(t,n,e){let s=l=>_e(t,{...e,...l}),a=t.uiState.get(ae),i=[["entity","Entity"],["groupCount","Group Count"],["dynamicList","Dynamic List"],["header","Header"]],o=L("Add",e.kind,i,l=>{if(l==="header"){Te(t,Bs());return}t.uiState.delete(ae),s({kind:l,preset:void 0,picked:[],mode:"all"})}),d;if(e.kind==="entity"){let l=Number(t.uiState.get(`${I}:n`)??0)||0;d=r`<div class="ts-stack">${ze({hass:t.hass},"Entity",Mn(t.hass,""),c=>{let p=c.entityId.trim();if(p==="")return;t.uiState.set(`${I}:n`,l+1);let h=A(t);if(h!==void 0&&Zs(h,p)){t.uiState.set(ae,`${oe(t.hass,p)} is on this page already.`),t.requestUpdate();return}Te(t,Se(p,t.hass.states),!0),t.uiState.set(ae,`Added ${oe(t.hass,p)}.`),t.requestUpdate()},`sp:add:entity:${l}`,{clearable:!1})}</div>
      <div class="hint">Each entity is one row. Pick another to add it too.</div>`}else{let l=e.kind==="groupCount"?tn():sn(),c=e.preset===void 0?void 0:l[e.preset],p=e.kind==="groupCount"||e.mode==="specific",h=e.kind==="groupCount"?"Counts how many of the entities you pick are in a state.":"Pick what to show. Each matching entity becomes its own row. You can switch to hand-picked entities after adding.",v=r`<div class="sp-presets" role="group" aria-label=${e.kind==="groupCount"?"Group Count":"Dynamic List"}>
      ${l.map((g,m)=>Oi(t,g,e.preset===m,()=>{if(!p){Te(t,et(g));return}s({preset:m,picked:[]})}))}
    </div>`,u=f;if(p&&c!==void 0){let g=e.kind==="groupCount"?c.picker==="deviceClass"?c.deviceClassFilter:void 0:c.deviceClassFilter,m=Qs(c.domain,g,t.hass.states);u=r`<div class="field sp-entities-field"><span>${c.label}: ${de(e.picked.length,"entity","entities")} picked</span></div>
        ${Gn(t,`${I}:pick`,m,e.picked,(w,k)=>{let S=re(t)??e,T=S.picked.filter(pe=>pe!==w);_e(t,{...S,picked:k?[...T,w]:T})})}
        <div class="sp-acts">
          <button type="button" class="pe-btn pe-primary" ?disabled=${t.busy}
            @click=${()=>{let w=(re(t)??e).picked;Te(t,e.kind==="groupCount"?Js(c,w):et(c,w))}}>
            ${$("plus")}<span>Add ${e.kind==="groupCount"?"group count":"dynamic list"}</span></button>
        </div>`}d=r`<p class="hint">${h}</p>
      ${e.kind==="dynamicList"?L("Entities",e.mode,V("DynamicMode"),g=>s({mode:g,preset:void 0,picked:[]})):f}
      ${v}${u}`}return r`${G(t,"add","add","Add a row",r`<fieldset class="sp-body" ?disabled=${t.busy} aria-label="Add a row">
    ${o}${d}
    ${typeof a=="string"?r`<div class="hint sp-added" role="status">${a}</div>`:f}
  </fieldset>`,{summary:U(n)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn" @click=${()=>_e(t,void 0)}>Done</button>
    </div>`}function Zn(t){let n=A(t);if(n===void 0)return r`<div class="insp-head"><div class="crumbs"><span class="nm">No status page</span></div></div>
      <div class="insp-body"><p class="sp-note">Add a status page to edit it.</p></div>`;let e=U(n)||"Untitled page",s=ce(t),a=re(t),i=bi(t),o=Rs(t.uiState,i),d,l;if(a!==void 0)d=r`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>ht(t)}>${e}</button><span class="sep">›</span><span class="nm">Add a row</span></div>`,l=Ei(t,n,a);else if(s!==void 0){let c=M(s),p=c.displayName===""?"Display Name":c.displayName;d=r`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>le(t,void 0)}>${e}</button><span class="sep">›</span><span class="kchip" style=${`--k:${jn(t,s)}`}>${Nn(c.rowType)}</span><span class="nm" title=${p}>${p}</span></div>`,l=r`${yi(t,n,s)}${On(t,n)}`}else d=r`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">Page</span><span class="nm" title=${e}>${e}</span></div>`,l=r`${Di(t,n)}${On(t,n)}
      <p class="sp-note">Select a row to edit it, or add one.</p>`;return r`<div class="insp-head">
      ${d}
      <button class="expand" @click=${()=>{Cs(t.uiState,i,!o),t.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${l}</div>`}var Yn=fe`
  .sp-pages-card > .layers, .sp-rows-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .sp-pages-card > .lc-note, .sp-rows-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .sp-rows-card > .lc-note.sp-drag-note { margin-top: 0; font-size: 11.5px; }
  .lc-btn.on { box-shadow: var(--wa-ring); }
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
`;mn({dirty:dt,drop:xn});typeof window<"u"&&window.addEventListener("beforeunload",t=>{dt()&&(t.preventDefault(),t.returnValue="")});var Ai=15e3,ti=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),vt=ti?"\u2318":"Ctrl+",wt={min:200,max:720,middleMin:320},bt={left:280,right:340},yt="wrist-assistant-panel.status-pages.columns.v1",Hi=24,Xn=820;function Qn(t){return z(t).message}function St(t){return z(t).code}function ei(t){let{code:n,message:e}=z(t);return Object.assign(new Error(e),n===void 0?{}:{code:n})}function Ii(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function Li(t){let n=t?Date.parse(t):NaN;return Number.isNaN(n)?"":Dt(Math.max(0,(Date.now()-n)/1e3))}function Mi(t){return t instanceof HTMLElement?bs(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function Ni(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}var b=class extends kt{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=f;this.shellOwnsWatch=!1;this.phones=!1;this.barHost=void 0;this.headBar=new Jt(this);this.unsupported=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=Hn();this.columns={...bt};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new ps(this);this.symbols=new ss(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||this.load(e,!0)};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let s=e.composedPath();if(!s.includes(this)&&!this.headBar.holds(s)&&!Ni()||this.renderRoot.querySelector("dialog[open]"))return;let a=e.metaKey||e.ctrlKey,i=e.key.toLowerCase();if(a&&!e.altKey&&i==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(!Mi(s[0])){if(a&&!e.altKey&&i==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&i==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!a&&!e.altKey){let o=this.viewHost();o!==void 0&&ht(o)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let s=e.composedPath(),a=i=>s.some(o=>o instanceof HTMLElement&&o.classList.contains(i));this.topMenuOpen&&!a("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!a("sp-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(is,this.onScrubStart),this.addEventListener(as,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return Kt(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return vn(this.watches,this.watchId)?"iphone":"watch"}get draft(){let e=this.watchId,s=this.record;if(!(e===void 0||s===void 0)){if(s.revision>0){let a=j(e);if(a!==void 0)return a;let i=Be(s.document);return i===void 0?void 0:ot(e,i,s.revision).draft}if(!(this.unsupported||!this.opensReady()))return j(e)??rt(e)}}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=es(yt,bt,wt),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++}willUpdate(e){if(this.hass){e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,xt(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]}));let a=Bt(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));a!==void 0&&this.openWatch(a)}this.followSave();let s=this.restoreAsk;s!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(a=>a.revision===s.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),gs(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let s of e){if(s.target!==this){this.measureTop(s.target);continue}let a=s.contentRect;Math.abs(a.width-this.hostWidth)>=1&&(this.hostWidth=a.width),Math.abs(a.height-this.hostHeight)>=1&&(this.hostHeight=a.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let s=this.renderRoot?.querySelector(".pe-top")??void 0;s!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=s,s!==void 0&&e.observe(s))}measureTop(e){let s=e.offsetHeight;s!==this.topHeight&&(this.topHeight=s,this.style.setProperty("--pe-top-h",`${s}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let s=j(e)?.saveDone;if(s===void 0||s===this.followedSave)return;this.followedSave=s;let a=()=>this.saveEnded(e);s.then(a,a)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,s=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),s=!1),this.startSubscription(e),this.load(e,s)}async load(e,s=!1){let a=this.hass;if(!a)return;if(s&&this.holdReload){this.reloadPending=!0;return}let i=++this.loadSeq;this.stopPolling(),s||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let o=await ge(a,e,"status_pages");if(i!==this.loadSeq)return;if(s&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(o),this.loadError=void 0}catch(o){if(i!==this.loadSeq)return;on(o)?(this.unsupported=!0,this.loadError=void 0):s||(this.loadError=Qn(o)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let s=this.watchId;this.record=e,s!==void 0&&e.revision<=0&&rt(s);let a=e.revision>0?Be(e.document):void 0;if(s===void 0||a===void 0)return;let i=this.restartDraft;i!==void 0&&i.watchId===s&&e.revision>=i.revision&&(this.restartDraft=void 0,(j(s)?.dirty??!1)||xe(s));let o=ot(s,a,e.revision);o.kept.length>0?this.note={kind:"warn",text:Pe(o.kept)}:o.mergedIntoEdits&&(this.note={kind:"warn",text:"The status pages changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let s=this.hass;if(!s||this.historyState==="unsupported")return;let a=++this.historySeq;try{let i=await Tt(s,e,"status_pages");if(a!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(i?.entries)?i.entries:[],this.historyState="ready"}catch(i){if(a!==this.historySeq||e!==this.watchId)return;this.historyState=St(i)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let s=this.hass;if(this.endSubscription(),!s)return;let a=++this.subscribeSeq;Ct(s,e,i=>{a===this.subscribeSeq&&i.kind==="status_pages"&&i.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(i=>{a===this.subscribeSeq?this.unsubscribe=i:i().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Ut(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Ai))}async poll(){this.pollTimer=void 0;let e=this.hass,s=this.watchId,a=this.record;if(!(!e||s===void 0||a===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let i=await ge(e,s,"status_pages");if(s!==this.watchId||this.record!==a)return;i.revision===a.revision?this.record={...a,delivered_revision:i.delivered_revision,delivered_at:i.delivered_at,rejected_revision:i.rejected_revision,rejected_at:i.rejected_at,rejected_reason:i.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(i),this.loadHistory(s))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,s){let a=this.draft;if(!a||this.saving)return!1;let i=a.apply(e(a.document),this.scrubKey??s);return this.requestUpdate(),i}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??ws,s=this.iconMemo;if(s!==void 0&&s.provider===e&&s.tick===this.iconsTick)return s.icons;let a=ys(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:a},a}screen(){let e=this.phoneLayout();if(e!==void 0)return Es(e);let s=this.watches.find(a=>a.owner_watch_id===this.watchId);return(Ie(s?.screen_size)??He).screen}phoneLayout(){if(this.device!=="iphone")return;let e=this.watches.find(s=>s.owner_watch_id===this.watchId);return Os(Ds(e?.screen_size))}viewHost(){let e=this.draft,s=this.hass;if(e===void 0||s===void 0)return;let a=this;return{hass:s,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*Ve,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},get document(){return e.document},get busy(){return a.saving},edit:(i,o)=>this.draft===e&&this.edit(i,o),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,s=this.watchId;this.endScrub();let a=this.draft;if(!e||s===void 0||!a||this.saving||!a.dirty)return;this.note=void 0;let i=a.revision<=0,o=kn(a,{save:(l,c)=>Pt(e,s,"status_pages",l,c).catch(p=>{throw ei(p)}),fetch:async()=>{let l=await ge(e,s,"status_pages").catch(c=>{throw ei(c)});return{revision:l.revision,document:l.document}}});this.followedSave=a.saveDone,this.requestUpdate();let d=await o.catch(l=>({ok:!1,revision:a.revision,merged:!1,code:St(l)??"unknown",message:Qn(l)}));this.saveEnded(s),s===this.watchId&&(this.note=ln(i,d.code,Pn(d)))}startFresh(){let e=this.watchId;e===void 0||!qt(this.noRecordState())||(rn("status_pages",e),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let s=this.hass,a=this.watchId,i=this.record;if(!s||a===void 0||i===void 0||this.draft?.dirty)return;let o={entry:e,baseRevision:i.revision};this.restoreAsk=o,_t(s,a,"status_pages",e.revision).then(d=>{this.restoreAsk===o&&(this.restoreAsk={...o,summary:an(d.document)})},()=>{})}async restore(){let e=this.hass,s=this.watchId,a=this.restoreAsk;if(!e||s===void 0||a===void 0||this.restoring)return;this.restoring=!0;let i;try{let o=await Rt(e,s,"status_pages",a.entry.revision,a.baseRevision);i={kind:"ok",text:Ss(a.entry.updated_at)},s===this.watchId?this.restartDraft={watchId:s,revision:o.revision}:(j(s)?.dirty??!1)||xe(s)}catch(o){let d=St(o);d==="conflict"?i={kind:"warn",text:"Not restored. The status pages changed somewhere else, so the newest copy is shown."}:d==="no_record"?i={kind:"warn",text:`Not restored. Home Assistant no longer holds status pages for this ${me(this.device)}.`}:d==="not_found"?i={kind:"warn",text:"Not restored. That save is no longer kept."}:d==="unknown_command"?(this.historyState="unsupported",i={kind:"warn",text:"This version of the integration cannot restore status pages. Update it to restore an earlier save."}):i={kind:"err",text:`Could not restore: ${ns(o)}`}}finally{this.restoring=!1,this.restoreAsk===a&&this.closeAsk()}s===this.watchId&&(this.note=i,this.load(s,!0))}render(){let e=this.watches,s=this.draft;return r`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(s,e):f}
        ${this.note?r`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:f}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):f}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Xn}renderTopBar(e,s){let a=e!==void 0&&!this.unsupported,i=a&&this.dirty;return r`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch status pages">
      ${this.haMenu?r`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${$("menu")}</button>`:f}
      ${this.shellOwnsWatch?f:r`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():fn(void 0,!1)}>${$("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?f:this.renderWatchPicker(s)}
      ${this.barHost!==void 0&&a?Gt({newWatch:this.newWatch,dirty:i,saved:Fe(this.record,void 0,this.device),device:this.device}):f}
      ${this.renderSyncPill(a?e:void 0)}
      ${this.renderTopMenu(a?e:void 0)}
      ${a?r`<button class="primary save ${i?"dirty":""}" ?disabled=${!i||this.saving}
          title=${i?`Save (${vt}S). A save reaches the ${me(this.device)} the next time it checks.`:`Nothing to save (${vt}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?f:r`<span class="tb-saved" title=${i?"Unsaved changes":""}>${Fe(this.record,void 0,this.device)}</span>
        ${un(cn({newWatch:this.newWatch,dirty:i,saving:this.saving}))}`}`:f}
      ${this.barActions}
      <button class="help" title="Help with Status pages" aria-label="Help with Status pages"
        @click=${()=>window.open(gn,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(e){let s=this.record;if(s===void 0||s.revision<=0||this.unsupported)return f;let a=e===void 0?{size:0,limit:1}:Je(e.document),i=Ue({record:s,size:a.size,limit:a.limit,noun:"status pages",historyState:this.historyState,device:this.device});return r`<span class="tb-sync ${i.tone==="ok"?"ok":"warn"}" title=${`${i.state}. ${i.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${i.state}</span>
    </span>`}noRecordState(e=this.watches){return Wt(e.find(s=>s.owner_watch_id===this.watchId))}opensReady(e=this.watches){return dn(this.noRecordState(e),"status_pages",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let s=this.canStartFresh();if(e===void 0&&!s)return f;let a=this.topMenuOpen,i=o=>()=>{this.topMenuOpen=!1,o()};return r`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${a?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!a}}>···</button>
      ${a?r`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?r`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${i(()=>this.discard())}>Discard edits</button>`:f}
        ${s?r`<button class="row" role="menuitem"
          @click=${i(()=>this.startFresh())}>${Oe}</button>`:f}
      </div>`:f}
    </span>`}personColor(e){let s=ls(this.owners.length>0?this.owners:this.ownList??[]);return Xt(s.findIndex(a=>a.owners.some(i=>i.owner_watch_id===e)))}renderWatchPicker(e){if(e.length<2)return f;let s=e.find(o=>o.owner_watch_id===this.watchId),a=this.watchMenuOpen,i=o=>{let d=o===void 0?void 0:this.personColor(o);return r`<span class="pe-chip-glyph" style=${d?`--pe-person: ${d}`:f} aria-hidden="true">${$("watch")}</span>`};return r`<span class="picker sp-watch-picker">
      <button type="button" class="tb-browse sp-watch-btn" aria-haspopup="menu" aria-expanded=${a?"true":"false"}
        title="Choose the watch whose status pages are shown" @click=${()=>{this.watchMenuOpen=!a}}>
        ${i(s?.owner_watch_id)}<span class="tb-browse-l">${s?ve(s,e):"Choose a watch"}</span>
        <span class="sp-caret" aria-hidden="true">${$("chevron")}</span>
      </button>
      ${a?r`<div class="pop-menu sp-watch-menu" role="menu" aria-label="Watches">
        ${e.map(o=>{let d=o.owner_watch_id===this.watchId;return r`<button type="button" class="row sp-watch-row" role="menuitemradio" aria-checked=${d?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,d||this.openWatch(o.owner_watch_id)}}>
            ${i(o.owner_watch_id)}<span class="sp-watch-name">${ve(o,e)}</span>
            <span class="sp-watch-check" aria-hidden="true">${d?$("check"):f}</span>
          </button>`})}
      </div>`:f}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Xn?this.columns:Qt(this.hostWidth-Hi,this.columns,wt)}renderGutter(e){return r`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the pages and rows column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${s=>{let a=this.fittedColumns();ts(s,{side:e,base:e==="left"?a.left:a.right,limits:wt,onWidth:i=>{this.columns={...this.columns,[e]:i}},onEnd:()=>Ae(yt,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:bt[e]},Ae(yt,this.columns)}}></div>`}get stageScale(){return this.zoom??je(this.narrow||this.stacked)}setZoom(e){this.zoom=e,In(e)}renderStage(e,s){let a=s.find(w=>w.owner_watch_id===this.watchId),o=Ie(a?.screen_size)??He,d=e.phone!==void 0,l=e.phone===void 0?o.label:e.phone.model.label,c=[...Bn(e),l],p=w=>ks(d?w*Ve:w),h=A(e),v=h===void 0?"Status pages":U(h)||"Untitled page",u=this.draft,g=this.stageScale,m=je(this.narrow||this.stacked);return r`<div class="card canvas-card lit sp-canvas" aria-label="Status page">
      <div class="cv-head">
        <span class="cv-title" title=${v}>${v}</span>
        ${a!==void 0?r`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${ve(a,s)}</span></span>`:f}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${c.join(" \xB7 ")}><span class="fam">${c.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!u?.canUndo} title=${`Undo (${vt}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${$("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!u?.canRedo} title=${ti?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${$("redo")}</button>
        </span>
      </div>
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <button class="tb sp-case" aria-disabled="true" tabindex="-1" title=${d?As:`This watch's screen, ${o.label}.`}>
            ${$(d?"phone":"watch")}<span class="word keep">${l}</span></button>
          <span class="tb-sep" aria-hidden="true"></span>
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${g<=We(g)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(We(g))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${p(g)}. Back to fit`}
              title=${`The ${d?"iPhone":"watch"} at ${p(g)} of its own points. Click to fit it again (${p(m)}).`}
              @click=${()=>this.setZoom(void 0)}>${p(g)}</button>
            <button class="tb icon" ?disabled=${g>=Ke(g)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(Ke(g))}>+</button>
          </span>
        </div>
        <div class="sp-stage-body">${qn(e)}</div>
        <div class="under"><span class="tail">${Ln}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0){let c=this.owners.length===0&&this.ownList===void 0;return r`<div class="pe-empty">${c?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return r`<div class="pe-empty"><b>${st}</b></div>`;if(this.loading)return r`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let c=this.watchId;return r`<div class="pe-empty">
        <span>Could not read this ${me(this.device)}'s status pages: ${this.loadError}</span>
        ${c===void 0?f:r`<button class="pe-btn" @click=${()=>{this.load(c)}}>Try again</button>`}
      </div>`}let s=this.record;if(s===void 0)return r`<div class="pe-empty">Loading…</div>`;let a=this.draft;if(a===void 0&&s.revision>0)return r`<div class="pe-empty"><b>${st}</b></div>`;if(a===void 0){let c=this.watchId===void 0?void 0:j(this.watchId),p=this.watchId;return r`<div class="pe-empty"><b>${jt("status pages",this.device)}</b><span>${Vt}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${Oe}</button>
        ${c?.dirty&&p!==void 0?r`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when status pages are here again.</span>
          <button class="pe-btn" @click=${()=>{xe(p),this.requestUpdate()}}>Discard the kept edits</button>`:f}
      </div>`}let i=this.viewHost();if(i===void 0)return r`<div class="pe-empty">Loading…</div>`;let o=this.fittedColumns(),d=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",l=s.revision<=0;return r`${l&&this.barHost===void 0?pn(this.device):f}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${o.left}px;--wa-right:${o.right}px;${d}`}>
      <div class="column left">
        ${Kn(i)}
        ${Wn(i)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(i,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Zn(i)}
      </div>
    </div>
    ${l?f:this.renderFoot(s,a.document,a.dirty)}`}renderFoot(e,s,a){let i=Je(s),o=Ue({record:e,size:i.size,limit:i.limit,noun:"status pages",historyState:this.historyState,device:this.device}),d=this.watchId;return r`${us({status:o,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?hs({noun:"status pages",device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:a,restoring:this.restoring,onRetry:()=>{d!==void 0&&(this.historyState="loading",this.loadHistory(d))},onRestore:l=>{this.historyOpen=!1,this.askRestore(l)},onClosed:()=>{this.historyOpen=!1}}):f}
    ${this.rawOpen?fs({noun:"status pages",document:s,revision:e.revision,dirty:a,copied:this.rawCopied,onCopy:l=>{ms(l).then(c=>{this.rawCopied=c})},onClosed:()=>{this.rawOpen=!1}}):f}`}renderRestoreAsk(e){let s=this.record,a=Li(e.entry.updated_at);return r`<dialog class="pe-ask" aria-labelledby="sp-ask-title"
      @cancel=${i=>{this.restoring&&i.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="sp-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${Ft(e.entry.updated_by,this.device)}${a?` ${a}`:""}, ${Ii(e.entry.size)}.</p>
      ${e.summary?r`<p class="pe-muted">${e.summary}</p>`:f}
      <p>It is saved again as a new revision${s?`, after revision ${s.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[zt,Ot,Et,At,Ht,It,Lt,Mt,xs,Is,hn,fe`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
      scroll-padding-top: var(--pe-top-h, 0px);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }
    .pe-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 0;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .wa-bar .tb-saved .cf-saved { margin: 0; font-size: inherit; color: inherit; }
    .wa-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
    .wa-bar .pop-menu .row:disabled:hover { background: transparent; }
    .pe-top > .pe-note { margin: 10px var(--cf-pad, 16px) 0; }
    .pe-note {
      display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .pe-note > span { flex: 1; min-width: 0; }
    .pe-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
    .pe-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .pe-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .pe-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
    .pe-link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
    .pe-empty {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 560px;
      padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .layout.pe-layout { flex: none; min-height: auto; overflow: visible; align-items: start; padding: 0; margin-bottom: 14px; }
    .pe-layout > .column.left, .pe-layout > .column.inspector {
      --pe-under-top: max(0px, calc(var(--pe-top-h, 0px) - var(--cf-pad, 16px)));
      position: sticky; top: var(--pe-under-top);
      max-height: calc(var(--pe-view-h, calc(100dvh - 120px)) - 30px - var(--pe-under-top));
      overflow-y: auto; overflow-x: hidden;
    }
    .pe-layout > .column.left { display: flex; flex-direction: column; gap: 8px; scrollbar-gutter: auto; }
    .pe-layout > .column.left > .card { flex: none; }
    .pe-layout > .column.canvas { overflow: visible; min-height: auto; }
    @container (max-width: 820px) {
      .layout.pe-layout { grid-template-columns: minmax(0, 1fr); }
      .pe-layout > .gutter { display: none; }
      /* As strong as the sticky rule, so a stacked list or inspector stops
         sliding over the cards above it (the page editor's fix). */
      .pe-layout > .column.left, .pe-layout > .column.canvas, .pe-layout > .column.inspector { grid-column: auto; position: static; max-height: none; overflow: visible; }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
      .pe-layout > .column.left { order: 3; }
    }
    .column.canvas > .card.canvas-card.sp-canvas { min-height: 0; flex: none; }
    /* The lit stage's edge in Status pages' hue, Home's Status pages door. */
    .canvas-card.sp-canvas { --wa-stage-hue: var(--wa-hue-yellow); }
    .cv-head .cv-title { flex: 0 1 auto; min-width: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cv-head .cv-watch { min-width: 0; font-size: 12.5px; font-weight: 500; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.sp-watch-btn { max-width: 260px; }
    .sp-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sp-watch-btn .sp-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.sp-watch-btn .sp-caret svg { width: 11px; height: 11px; }
    .pop-menu.sp-watch-menu { left: 0; right: auto; min-width: 220px; }
    .sp-watch-menu .row.sp-watch-row { display: flex; align-items: center; gap: 8px; }
    .sp-watch-row .sp-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .sp-watch-row[aria-checked="true"] { font-weight: 700; }
    .sp-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .sp-watch-check svg.ui-icon { width: 14px; height: 14px; }
    .sp-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    @container (max-width: 460px) {
      .sp-stage-area { padding-top: 92px; }
    }
    .sp-stage-body { display: flex; justify-content: center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    .sp-stage-area > .under {
      display: flex; flex-direction: column; gap: 4px; align-self: center; max-width: 460px; text-align: center;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
    }
    .stage-tools button.tb.sp-case { cursor: default; }
    .stage-tools button.tb.sp-case:hover { background: transparent; }
    .stage-tools button.tb.sp-case > svg.ui-icon { width: 14px; height: 14px; }
    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-h-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .pe-h-text > .pe-muted { font-size: 12px; }
    .pe-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 32px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-btn:hover:not(:disabled) { background: var(--wa-panel); }
    .pe-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-btn:disabled { opacity: .55; cursor: default; }
    .pe-btn.pe-primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .pe-btn.pe-primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }
    .pe-btn.pe-danger { color: var(--wa-need); align-self: flex-start; }
    dialog.pe-ask {
      width: min(460px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    dialog.pe-ask p.pe-muted { font-size: 13px; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }
    :host([narrow]) { --cf-pad: 12px; }
  `,Yn,vs,Zt]}};y([_({attribute:!1})],b.prototype,"hass",2),y([_({attribute:!1})],b.prototype,"owners",2),y([_({attribute:!1})],b.prototype,"ownerId",2),y([_({type:Boolean,reflect:!0})],b.prototype,"narrow",2),y([_({attribute:!1})],b.prototype,"icons",2),y([_({attribute:!1})],b.prototype,"iconsTick",2),y([_({attribute:!1})],b.prototype,"haMenu",2),y([_({attribute:!1})],b.prototype,"onHaMenu",2),y([_({attribute:!1})],b.prototype,"onBack",2),y([_({attribute:!1})],b.prototype,"barActions",2),y([_({attribute:!1})],b.prototype,"shellOwnsWatch",2),y([_({attribute:!1})],b.prototype,"phones",2),y([_({attribute:!1})],b.prototype,"barHost",2),y([P()],b.prototype,"watchId",2),y([P()],b.prototype,"record",2),y([P()],b.prototype,"unsupported",2),y([P()],b.prototype,"loading",2),y([P()],b.prototype,"loadError",2),y([P()],b.prototype,"history",2),y([P()],b.prototype,"historyState",2),y([P()],b.prototype,"note",2),y([P()],b.prototype,"restoreAsk",2),y([P()],b.prototype,"restoring",2),y([P()],b.prototype,"historyOpen",2),y([P()],b.prototype,"rawOpen",2),y([P()],b.prototype,"rawCopied",2),y([P()],b.prototype,"ownList",2),y([P()],b.prototype,"topMenuOpen",2),y([P()],b.prototype,"watchMenuOpen",2),y([P()],b.prototype,"zoom",2),y([P()],b.prototype,"columns",2),y([P()],b.prototype,"hostWidth",2),y([P()],b.prototype,"hostHeight",2);customElements.get("wa-status-pages-editor")||customElements.define("wa-status-pages-editor",b);export{yt as SP_COLUMNS_KEY,b as WaStatusPagesEditor};
