import{$ as Gs,A as Os,B as Es,C as qe,D as X,E as We,F as As,G as Hs,H as Is,I as ve,J as Ls,K as Ms,L as Be,M as Ns,N as Us,O as Je,P as zs,Q as j,R as Fs,S as js,T as Vs,U as Ks,V as qs,W as Ws,X as Bs,Y as Js,Z as Ge,_ as Ze,a as N,aa as Zs,b as Ss,ba as Ys,c as $s,d as ks,e as xs,f as G,g as ge,h as Ps,i as _s,j as Ue,k as Ts,l as Rs,m as R,n as Cs,o as ze,p as Fe,q as I,r as z,s as Z,t as Y,u as F,v as je,w as me,x as Ve,y as Ds,z as Ke}from"./chunk-7EMPXNH7.js";import{a as gs,b as ms,c as vs,d as ws,e as Ne,g as bs,h as ys}from"./chunk-XJOARIJJ.js";import{h as tn}from"./chunk-SI6HAEKT.js";import"./chunk-RZRTGY27.js";import{A as hs,B as fs,o as rs,p as Ie,q as ds,r as Le,s as Me,x as cs,y as us,z as ps}from"./chunk-W6ZIVQ24.js";import{b as Nt,c as Te,d as Ut,e as Re,f as zt,h as O,i as ls}from"./chunk-QVYMVUW6.js";import{a as He,b as Zt,c as Yt,d as Xt,e as Qt,f as es,g as ts,h as ss,i as ns}from"./chunk-XYN2AXMK.js";import{b as Jt,p as Gt}from"./chunk-QV3AE5A5.js";import{a as is,b as as,d as os,o as J}from"./chunk-43HRUTRJ.js";import{$e as Xs,Bb as Ce,Gb as De,Gd as Ae,I as Dt,Id as Bt,L as Ot,P as Et,Q as pe,U as At,X as he,_ as Ht,_b as Ft,aa as It,af as Qs,ba as Lt,bb as Mt,bf as en,ca as fe,h as bt,qd as jt,rd as Vt,sd as Oe,td as Kt,ud as qt,vd as M,wd as Wt,yd as Ee}from"./chunk-RSNV3KLA.js";import{Ag as _e,Ah as Ct,Bg as gt,Bh as L,Cg as mt,Dg as vt,Eg as wt,b as le,c as d,cg as ft,dh as B,eh as S,f as w,i as ht,ih as yt,j as _,k,kh as St,lh as $t,mh as kt,nh as xt,oh as Pt,ph as _t,qh as Tt,yg as ue,zh as Rt}from"./chunk-CQXHQEN6.js";import{a as y}from"./chunk-LO2NM3CE.js";function Ye(t){return t===null?void 0:t}function V(t,n){return t!=null&&Object.hasOwn(t,n)?t[n]:void 0}function Xe(t){if(!Array.isArray(t))return;let n=new Set,e=[];for(let s of t){if(!J(s)||typeof s.id!="string"||s.id==="")return;let i=s.id.toUpperCase();if(n.has(i))return;n.add(i),e.push([i,s])}return e}function qn(t,n){return t.length===n.length&&t.every((e,s)=>e===n[s])}function sn(t,n){return t===void 0&&n===void 0?{kind:"same"}:t!==void 0&&n!==void 0&&O(t,n)?{kind:"same"}:{kind:"changed",page:n}}function Qe(t){return t!==void 0&&typeof t.name=="string"?t.name:""}function nn(t,n,e){let s=Ye(t),i=Ye(n),a=Ye(e),o=s===void 0?[]:Xe(s),r=i===void 0?void 0:Xe(i),c=a===void 0?void 0:Xe(a);if(o===void 0||r===void 0||c===void 0)return{pages:O(i,s)?a:i,clashes:[]};let l=new Map(o),h=new Map(r),p=new Map(c),m=[],u=$=>{let D=l.get($),T=h.get($),P=p.get($),ce=sn(D,T),Vn=sn(D,P);if(ce.kind==="same")return P;if(Vn.kind==="same")return T;if(T!==void 0&&P!==void 0&&O(T,P))return P;if(T!==void 0||P!==void 0){let Kn=Qe(P)||Qe(T)||Qe(D);m.push({id:P?.id??T?.id??D?.id,name:Kn})}return P},f=r.map(([$])=>$).filter($=>l.has($)),g=o.map(([$])=>$).filter($=>h.has($)),v=!qn(f,g),[x,E]=v?[r,c]:[c,r],C=x.map(([$])=>$),re=new Set(C);E.forEach(([$],D)=>{if(re.has($))return;let T=0;for(let P=D-1;P>=0;P--){let ce=C.indexOf(E[P][0]);if(ce>=0){T=ce+1;break}}C.splice(T,0,$),re.add($)});let de=[];for(let $ of C){let D=u($);D!==void 0&&de.push(D)}let pt=$=>$.length===de.length&&de.every((D,T)=>D===$[T]);return pt(a)?{pages:a,clashes:m}:pt(i)?{pages:i,clashes:m}:{pages:de,clashes:m}}function an(t,n,e){return nn(t==null?[]:V(t,R),V(n,R),V(e,R)).clashes}function on(t,n,e){let s=ls(t,n,e),i=nn(t==null?[]:V(t,R),V(n,R),V(e,R)).pages;if(i===void 0){if(!Object.hasOwn(s,R))return s;let a={};for(let o of Object.keys(s))o!==R&&(a[o]=s[o]);return a}if(s[R]===i)return s;if(s===e||s===n){let a={...s};return a[R]=i,we(a,e)?e:we(a,n)?n:a}return s[R]=i,we(s,e)?e:we(s,n)?n:s}function we(t,n){let e=Object.keys(t);return e.length!==Object.keys(n).length?!1:e.every(s=>Object.hasOwn(n,s)&&n[s]===t[s])}var rn=100,Wn=3,et=class{constructor(n,e){this._undo=[];this._redo=[];this._kept=[];this._base=n,this._revision=e,this._document=n}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get kept(){return this._kept}get dirty(){let n=this._dirty;if(n!==void 0&&n.document===this._document&&n.base===this._base)return n.value;let e=this._document!==this._base&&!O(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(n,e){if(n===this._document||O(n,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let s=this._undo[this._undo.length-1];return O(n,s)?(this._undo.pop(),this._document=s,this._coalesceKey=void 0):this._document=n,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=n,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let n=this._undo.pop();return n===void 0?!1:(this._redo.push(this._document),this._document=n,!0)}redo(){this._coalesceKey=void 0;let n=this._redo.pop();return n===void 0?!1:(this.pushUndo(this._document),this._document=n,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(n,e){return e<this._revision?(this._kept=[],!1):this.mergeOnto(n,e)}restart(n,e){return this.mergeOnto(n,e)}mergeOnto(n,e){this._coalesceKey=void 0;let s=this._base;this._kept=this._document===s?[]:an(s,this._document,n);let i=new Map,a=p=>{let m=i.get(p);if(m!==void 0)return m;let u=p===s?n:on(s,p,n);return u!==n&&O(u,n)&&(u=n),i.set(p,u),u},o=this._document,r=[...this._undo,this._document,...this._redo.slice().reverse()].map(a),c=this._undo.length,l=[],h=0;return r.forEach((p,m)=>{let u=l[l.length-1];u!==void 0&&(u===p||O(u,p))?m===c&&(l[l.length-1]=p):l.push(p),m===c&&(h=l.length-1)}),this._undo=l.slice(0,h),this._document=l[h],this._redo=l.slice(h+1).reverse(),this._base=n,this._revision=e,this._document!==o&&!O(this._document,o)}saved(n,e){e<this._revision||(this._coalesceKey=void 0,this._base=n,this._revision=e)}get saving(){return Q.has(this)}get saveDone(){return Q.get(this)}pushUndo(n){this._undo.push(n),this._undo.length>rn&&this._undo.splice(0,this._undo.length-rn)}},Q=new WeakMap;function dn(t,n){if(Q.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"These status pages are being saved already."});let e=Bn(t,n).finally(()=>Q.delete(t));return Q.set(t,e),e}async function Bn(t,n){let e=!1,s=new Map,i=()=>s.size===0?{}:{kept:[...s.values()]},a=(o,r,c)=>({ok:!1,revision:t.revision,merged:e,code:o,message:r,...i(),...c===void 0?{}:{problems:c}});for(let o=1;;o++){let r=t.document,c=Ws(r);if(c.length>0)return a("invalid",c.join(" "),c);let l;try{({revision:l}=await n.save(t.revision,r))}catch(h){let{code:p="unknown",message:m}=L(h);if(p!=="conflict"||o>=Wn)return a(p,m);let u;try{u=await n.fetch()}catch(f){let g=L(f);return a(g.code??"unknown",g.message)}if(!J(u)||!(u.revision>0)||!J(u.document))return a("no_record","Home Assistant holds no status pages for this watch.");u.revision<t.revision?t.restart(u.document,u.revision):t.rebase(u.document,u.revision);for(let f of t.kept)s.set(f.id.toUpperCase(),f);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0,...i()};continue}return t.saved(r,l),{ok:!0,revision:t.revision,merged:e,...i()}}}async function cn(t,n){try{let{revision:e}=await n(0,t);return{ok:!0,revision:e}}catch(e){let{code:s,message:i}=L(e);return s==="no_record"||s==="conflict"?{ok:!1,code:s,message:i}:s==="unknown_command"?{ok:!1,code:"unsupported",message:i}:{ok:!1,code:"error",message:i}}}var K=new Map;function q(t){return K.get(t)}function ln(t,n,e){let s=K.get(t);if(s!==void 0&&e<=0)return{draft:s,mergedIntoEdits:!1,kept:[]};if(s===void 0||e<s.revision&&!s.dirty){let o=new et(n,e);return K.set(t,o),{draft:o,mergedIntoEdits:!1,kept:[]}}if(e===s.revision)return{draft:s,mergedIntoEdits:!1,kept:[]};let i=s.dirty,a=e<s.revision?s.restart(n,e):s.rebase(n,e);return{draft:s,mergedIntoEdits:i&&a,kept:i?s.kept:[]}}function be(t){K.delete(t)}function tt(){for(let t of K.values())if(t.dirty)return!0;return!1}function un(){K.clear()}function Jn(t){return t.name.trim()===""?"a status page":`"${t.name}"`}function ye(t){if(t.length===0)return"";let n=t.map(Jn);return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"That save's version was kept.":"That save's versions were kept."}`}function pn(t){if(t.ok){let e=t.kept??[];if(t.alreadySaved===!0){let s=e.length>0?` ${ye(e)}`:"";return{kind:e.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.${s}`}}return e.length>0?{kind:"warn",text:`Saved. ${ye(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The status pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds status pages for this watch. Start with the defaults again."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the status pages is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the status pages${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Ct}`};case"busy":return{kind:"warn",text:"Already saving these status pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}var U="status-pages",bn="sp:page",W="sp:row",A="sp:add",ee="sp:drag",te="sp:added",yn="wrist-assistant-panel.status-pages.zoom.v1";function Sn(t=Te()){try{let n=t?.getItem(yn),e=n==null||n===""?NaN:Number(n);return rs.includes(e)?e:void 0}catch{return}}function $n(t,n=Te()){try{n?.setItem(yn,t===void 0?"":String(t))}catch{}}var Gn="Pages the watch opens from a tile, a menu slot or Siri. A save reaches the watch the next time it checks.",kn="Drawn from Home Assistant's states now, as the watch draws the page. Tap a row to edit it.";function ie(t,n,e){return`${t} ${t===1?n:e}`}function se(t,n){let e=t.states[n]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:n}function xn(t,n){let e=n.indexOf(".");return{entityId:n,displayName:n===""?"":se(t,n),domain:e<0?"":n.slice(0,e)}}function Zn(t){switch(t){case"battery_charging":return"charging";case"illuminance":return"light";case"occupancy":case"presence":return"occupancy";case"garage_door":case"garage":return"garage";case"carbon_monoxide":return"CO";default:return t.replaceAll("_"," ")}}function Yn(t,n){if(n!==void 0&&n.length>0){let e=n.map(Zn),s=e.length===1?e[0]:e.slice(0,2).join("/");return t==="sensor"||t==="binary_sensor"?`${s} sensors`:t==="cover"?s.includes("garage")?"garage doors":`${s} covers`:`${s} ${t}s`}return t==="person"?"people":t==="binary_sensor"?"binary sensors":`${t}s`}function st(t){let n=N(t),e=s=>`${s} ${s===1?"entity":"entities"}`;switch(n.rowType){case"entity":return n.entityId;case"groupCount":return`${e(n.groupEntityIds?.length??0)} \xB7 group count`;case"dynamicList":return n.dynamicMode==="all"?`all ${Yn(n.domain,n.deviceClassFilter)} \xB7 dynamic list`:`${e(n.groupEntityIds?.length??0)} \xB7 dynamic list`;case"sectionHeader":return"section header";default:return n.rowType}}function Pn(t){return Ue.labels.StatusRowType?.[t]??t}function H(t){let n=Fe(t.document),e=t.uiState.get(bn);return(typeof e=="string"?n.find(s=>F(I(s),e)):void 0)??n[0]}function _n(t,n){t.uiState.set(bn,n),t.uiState.delete(W),t.uiState.delete(A),t.requestUpdate()}function ae(t){let n=t.uiState.get(W);return typeof n=="string"?me(H(t),n):void 0}function oe(t,n){n===void 0?t.uiState.delete(W):t.uiState.set(W,n),t.uiState.delete(A),t.requestUpdate()}function nt(t){return ae(t)===void 0&&!t.uiState.has(A)?!1:(t.uiState.delete(W),t.uiState.delete(A),t.requestUpdate(),!0)}function ne(t){let n=t.uiState.get(A);return typeof n=="object"&&n!==null?n:void 0}function $e(t,n){n===void 0?t.uiState.delete(A):(t.uiState.set(A,n),t.uiState.delete(W)),t.requestUpdate()}function Xn(t,n="entity"){t.uiState.delete(te),$e(t,{kind:n,mode:"all",picked:[]})}function Se(t,n,e=!1){let s=H(t);if(s===void 0)return;let i=I(s),a;return t.edit(o=>{let r=Ns(o,i,n);return a=r.id,r.document}),a!==void 0&&!e&&oe(t,a),a}function Qn(t){let n;t.edit(e=>{let s=Ds(e);return n=s.id,s.document}),n!==void 0&&_n(t,n)}function Tn(t,n,e,s,i){return{start:a=>{t.uiState.set(ee,{list:n,id:e}),a.dataTransfer?.setData("text/plain",e),a.dataTransfer&&(a.dataTransfer.effectAllowed="move")},over:a=>{t.uiState.get(ee)?.list===n&&(a.preventDefault(),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))},drop:a=>{let o=t.uiState.get(ee);t.uiState.delete(ee),!(o?.list!==n||F(o.id,e))&&(a.preventDefault(),i(o.id,s))},end:()=>{t.uiState.delete(ee)}}}function it(t,n,e,s){return t.icons.render(n,e,s)??d`<span class="sp-glyph-dot" style=${`background:${s};width:${Math.max(4,e*.6)}px;height:${Math.max(4,e*.6)}px`}></span>`}function Rn(t,n,e){return d`<span class="thumb sp-thumb" style=${`--c:${e}`} aria-hidden="true"><span class="sp-thumb-glyph">${it(t,n,14,e)}</span></span>`}function Cn(t,n){let e=N(n);return e.rowType==="sectionHeader"?G.secondary:e.rowType==="entity"?ge(e.domain,t.hass.states[e.entityId]?.state):ge(e.domain,"on")}function ei(t,n,e,s,i){let a=I(n),o=z(n),r=i!==void 0&&F(a,I(i)),c=Z(n).length,l=(m,u)=>t.edit(f=>Os(f,m,u)),h=Tn(t,"page",a,e,l),p=()=>{r||_n(t,a)};return d`<div class="layer sp-page-row ${r?"hl":""}" data-page=${a} role="listitem" tabindex="0"
    draggable=${t.busy?"false":"true"} aria-current=${r?"true":"false"} aria-label=${o||"Untitled page"}
    @dragstart=${h.start} @dragover=${h.over} @drop=${h.drop} @dragend=${h.end}
    @click=${m=>{m.target instanceof Element&&m.target.closest("button")||p()}}
    @keydown=${m=>{m.target!==m.currentTarget||m.key!=="Enter"&&m.key!==" "||(m.preventDefault(),p())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Rn(t,"doc.text.fill","#5B8FD4")}
    <span class="name"><b><span class="nm-t">${o||"Untitled page"}</span></b><small>${ie(c,"row","rows")}</small></span>
    <span class="right">
      <span class="badges">${Ve(n)?d`<span class="badge" title="One of the app's starter pages. The watch treats it as any other page.">starter</span>`:w}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${t.busy||e===0} title="Move up" aria-label=${`Move ${o} up`}
          @click=${()=>l(a,e-1)}>${S("up")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||e===s-1} title="Move down" aria-label=${`Move ${o} down`}
          @click=${()=>l(a,e+1)}>${S("down")}</button>
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Delete" aria-label=${`Delete ${o}`}
          @click=${()=>t.edit(m=>Ke(m,a))}>${S("delete")}</button>
      </span>
    </span>
  </div>`}function Dn(t){let n=Fe(t.document),e=H(t);return d`<section class="card lc sp-pages-card" aria-label="Status pages" style="--c: var(--wa-lc-pages, #26a69a); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${S("list")}</span><span class="lc-title">Status pages</span>
      <span class="lc-sub" title=${Gn}>${ie(n.length,"page","pages")}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-page" aria-label="Add status page" ?disabled=${t.busy}
        title="Add a status page" @click=${()=>Qn(t)}>${S("plus")}<span>Add</span></button>
    </div>
    ${n.length===0?d`<div class="lc-note">No status pages. Add one to show the live state of entities you pick.</div>`:d`<div class="layers sp-page-list" role="list">${n.map((s,i)=>ei(t,s,i,n.length,e))}</div>`}
  </section>`}function ti(t,n,e,s,i,a){let o=Y(e),r=N(e),c=a!==void 0&&F(o,Y(a)),l=r.isHidden===!0,h=r.displayName===""?"Display Name":r.displayName,p=(g,v)=>t.edit(x=>zs(x,n,g,v)),m=Tn(t,"row",o,s,p),u=()=>oe(t,o),f=r.rowType==="sectionHeader"?"line.horizontal.3":r.iconName;return d`<div class="layer sp-row-row ${c?"hl":""} ${l?"dim":""}" data-row=${o} role="listitem" tabindex="0"
    draggable=${t.busy?"false":"true"} aria-current=${c?"true":"false"} aria-label=${h}
    title=${`${h} \xB7 ${st(e)}${l?", hidden":""}`}
    @dragstart=${m.start} @dragover=${m.over} @drop=${m.drop} @dragend=${m.end}
    @click=${g=>{g.target instanceof Element&&g.target.closest("button")||u()}}
    @keydown=${g=>{g.target!==g.currentTarget||g.key!=="Enter"&&g.key!==" "||(g.preventDefault(),u())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Rn(t,f,Cn(t,e))}
    <span class="name"><b><span class="nm-t">${h}</span></b><small>${st(e)}</small></span>
    <span class="right">
      <span class="badges">${l?d`<span class="badge">hidden</span>`:w}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${t.busy} title=${l?"Show":"Hide"} aria-label=${`${l?"Show":"Hide"} ${h}`}
          @click=${()=>t.edit(g=>j(g,n,o,"isHidden",!l))}>${S(l?"show":"hide")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||s===0} title="Move up" aria-label=${`Move ${h} up`}
          @click=${()=>p(o,s-1)}>${S("up")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||s===i-1} title="Move down" aria-label=${`Move ${h} down`}
          @click=${()=>p(o,s+1)}>${S("down")}</button>
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Remove" aria-label=${`Remove ${h}`}
          @click=${()=>t.edit(g=>Je(g,n,o))}>${S("delete")}</button>
      </span>
    </span>
  </div>`}function On(t){let n=H(t),e=n===void 0?[]:Z(n),s=ae(t),i=n===void 0?"":I(n),a;n===void 0?a=d`<div class="lc-note">Add a status page to give it rows.</div>`:e.length===0?a=d`<div class="lc-note">No rows yet. Add entities to show in this status page.</div>`:a=d`<div class="layers sp-row-list" role="list">${e.map((r,c)=>ti(t,i,r,c,e.length,s))}</div>
    <div class="lc-note sp-drag-note">Drag a row, or use its arrows, to reorder.</div>`;let o=ne(t)!==void 0;return d`<section class="card lc sp-rows-card" aria-label="Rows" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${S("layers")}</span><span class="lc-title">Rows</span>
      ${n===void 0?w:d`<span class="lc-sub">${ie(e.length,"row","rows")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-row ${o?"on":""}" aria-label="Add row" ?disabled=${t.busy||n===void 0}
        title="Add an entity, a group count, a dynamic list or a header" @click=${()=>Xn(t)}>${S("plus")}<span>Add</span></button>
    </div>
    ${a}
  </section>`}var ke={small:{row:10,compact:9,icon:14},medium:{row:12,compact:10,icon:16},large:{row:14,compact:12,icon:18}},En={regular:400,medium:500,semibold:600,bold:700},hn={default:"-apple-system, system-ui, 'SF Pro Text', 'Helvetica Neue', sans-serif",rounded:"ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, monospace",serif:"ui-serif, 'New York', Georgia, serif"},fn={ultraThin:.1,thin:.13,regular:.16,thick:.2,ultraThick:.24};function si(t){let n=e=>{let s=qe().find(i=>i.key===e);return We(t,s)};return{rowStyle:String(n("rowStyle")),textSize:String(n("textSize")),fontWeight:String(n("fontWeight")),fontDesign:String(n("fontDesign")),rowSpacing:Number(n("rowSpacing")),backgroundMaterial:String(n("backgroundMaterial")),columnLayout:String(n("columnLayout")),showDividers:n("showDividers")===!0,iconPosition:String(n("iconPosition")),horizontalPadding:Number(n("horizontalPadding"))}}function at(t){return G[t]??G.secondary}function An(t,n){return t.rowStyle==="pillFilled"?`background:color-mix(in srgb, ${n} 15%, transparent);`:t.rowStyle==="pillOutline"?`box-shadow:inset 0 0 0 0.75px color-mix(in srgb, ${n} 40%, transparent);`:""}function xe(t,n,e,s,i){let a=at(e.color);return d`<span class="sp-w-icon" style=${`width:${s*i}px`}>${it(t,e.icon,Math.round(s*.8*i),a)}</span>`}function gn(t,n,e,s){let i=t.scale,a=ke[n.textSize]??ke.medium,o=s!==void 0&&F(s,e.rowId),r=()=>oe(t,e.rowId);if(e.kind==="sectionHeader")return d`<div class="sp-w-header ${o?"on":""}" style=${`font-size:${9*i}px;text-align:${e.align==="center"?"center":e.align==="trailing"?"right":"left"}`}
      @click=${r}>${e.label}</div>`;let c=at(e.color),l=n.rowStyle==="plain";return d`<div class="sp-w-row ${o?"on":""}" title=${e.entityId??e.label}
    style=${`gap:${6*i}px;font-size:${a.row*i}px;font-weight:${En[n.fontWeight]??400};padding:${l?0:4*i}px ${l?0:8*i}px;border-radius:${6*i}px;${An(n,c)}`}
    @click=${r}>
    ${n.iconPosition==="leading"?xe(t,n,e,a.icon,i):w}
    <span class="sp-w-label">${e.label}</span>
    <span class="sp-w-value" style=${`color:${c}`}>${e.value}</span>
    ${n.iconPosition==="trailing"?xe(t,n,e,a.icon,i):w}
  </div>`}function mn(t,n,e,s){let i=t.scale,a=ke[n.textSize]??ke.medium,o=s!==void 0&&F(s,e.rowId),r=at(e.color),c=n.rowStyle==="plain";return d`<div class="sp-w-cell ${o?"on":""}" title=${e.label}
    style=${`gap:${3*i}px;font-size:${a.compact*i}px;font-weight:${En[n.fontWeight]??400};padding:${c?0:3*i}px ${c?0:6*i}px;border-radius:${6*i}px;${An(n,r)}`}
    @click=${()=>oe(t,e.rowId)}>
    ${n.iconPosition==="leading"?xe(t,n,e,a.icon,i):w}
    <span class="sp-w-value" style=${`color:${r}`}>${e.value}</span>
    ${n.iconPosition==="trailing"?xe(t,n,e,a.icon,i):w}
  </div>`}function vn(t){return d`<div class="sp-w-divider" style=${`height:${Math.max(1,.5*t)}px`}></div>`}function Hn(t){let{width:n,height:e}=t.screen,s=t.scale,i=H(t),a=ae(t),o=a===void 0?void 0:Y(a),r;if(i===void 0)r=d`<p class="sp-w-empty">No status page.</p>`;else{let h=si(i),p=_s(i,t.hass.states),m=h.columnLayout==="twoColumn"?Ps(p).map((f,g,v)=>d`${f.kind==="header"?gn(t,h,f.row,o):d`<div class="sp-w-pair" style=${`gap:${8*s}px`}>${mn(t,h,f.first,o)}${f.second===void 0?d`<span class="sp-w-cell sp-w-spacer"></span>`:mn(t,h,f.second,o)}</div>`}
          ${h.showDividers&&g<v.length-1?vn(s):w}`):p.map((f,g)=>d`${gn(t,h,f,o)}${h.showDividers&&g<p.length-1?vn(s):w}`),u=fn[h.backgroundMaterial]??fn.regular;r=d`<div class="sp-w-scroll" style=${`padding:${30*s}px ${6*s}px ${12*s}px;gap:${12*s}px`}>
      <div class="sp-w-card" style=${`padding:${8*s}px ${(6+h.horizontalPadding)*s}px;border-radius:${14*s}px;background:rgba(255,255,255,${u});font-family:${hn[h.fontDesign]??hn.default}`}>
        <div class="sp-w-rows" style=${`gap:${h.rowSpacing*s}px;padding:${4*s}px 0`}>
          ${p.length===0?d`<span class="sp-w-none" style=${`font-size:${11*s}px`}>${Z(i).length===0?"Add entities":"Nothing to show now"}</span>`:m}
        </div>
      </div>
      <div class="sp-w-done" style=${`font-size:${15*s}px;padding:${12*s}px 0;border-radius:${20*s}px`}>Done</div>
    </div>`}let c=t.phone===void 0?"Status page on the watch":"Status page on the iPhone",l=d`<div class="sp-screen" role="group" aria-label=${c}
    style=${`width:${Math.round(n*s)}px;min-height:${Math.round(e*s)}px`}>${r}</div>`;return bs(t.phone,{width:n,height:e},s,l,c,t.icons)}function In(t){let n=H(t);if(n===void 0)return[];let e=Z(n),s=e.filter(i=>i.isHidden===!0).length;return[ie(e.length,"row","rows")+(s>0?`, ${s} hidden`:"")]}function Ln(t,n){return us(t.uiState,U,n)}function ni(t,n){ps(t.uiState,U,n,!Ln(t,n)),t.requestUpdate()}var ii={row:{color:B.content,icon:"content"},add:{color:B.content,icon:"plus"},page:{color:B.place,icon:"text"},style:{color:B.look,icon:"look"}};function Pe(t,n,e,s,i,a={}){let o=Ln(t,e),r=ii[n];return Tt({color:r.color,icon:S(r.icon),title:s,open:o,onToggle:()=>ni(t,e),...a.summary===void 0||a.summary===""?{}:{summary:a.summary},dot:a.dot===!0,id:`${U}:${e}`},o?i:d``)}function ai(t){return ne(t)!==void 0?[{module:U,section:"add"}]:ae(t)!==void 0?[{module:U,section:"row"},{module:U,section:"style"}]:[{module:U,section:"page"},{module:U,section:"style"}]}function Mn(t,n,e,s,i){let a=`${n}:q`,o=String(t.uiState.get(a)??"").trim().toLowerCase(),r=new Set(s),c=e.filter(p=>o===""||p.toLowerCase().includes(o)||se(t.hass,p).toLowerCase().includes(o)),l=[...c.filter(p=>r.has(p)),...c.filter(p=>!r.has(p))],h=l.slice(0,200);return d`<div class="sp-pick">
    <input type="search" class="sp-pick-q" placeholder="Search entities" aria-label="Search entities" .value=${String(t.uiState.get(a)??"")}
      @input=${p=>{t.uiState.set(a,p.target.value),t.requestUpdate()}} />
    <div class="sp-pick-list" role="group" aria-label="Entities">
      ${h.length===0?d`<div class="sp-pick-none">${e.length===0?"No entity of this kind in Home Assistant.":"No entity matches."}</div>`:w}
      ${h.map(p=>d`<label class="sp-pick-row">
        <input type="checkbox" .checked=${r.has(p)} ?disabled=${t.busy}
          @change=${m=>i(p,m.target.checked)} />
        <span class="sp-pick-name">${se(t.hass,p)}</span><code>${p}</code>
      </label>`)}
      ${l.length>h.length?d`<div class="sp-pick-none">${l.length-h.length} more. Search to narrow the list.</div>`:w}
    </div>
  </div>`}function oi(t,n,e){let s=I(n),i=Y(e),a=N(e),o=(u,f,g)=>t.edit(v=>j(v,s,i,u,f),g),r=a.rowType==="sectionHeader",c=a.rowType==="groupCount"||a.rowType==="dynamicList",l=a.rowType==="dynamicList"&&a.dynamicMode==="all",h=a.rowType==="groupCount"||a.rowType==="dynamicList"&&!l,p=[];if(p.push(M("Visibility",a.isHidden===!0?"hidden":"visible",[["visible","Visible"],["hidden","Hidden"]],u=>o("isHidden",u==="hidden"))),p.push(Oe("Label",a.displayName,u=>o("displayName",u,`row:${i}:label`),{placeholder:"Display Name"})),r?p.push(M("Alignment",a.headerAlignment??"leading",X("HeaderAlignment"),u=>o("headerAlignment",u))):p.push(d`<div class="ts-stack">${Bt({icons:t.icons,symbols:t.symbols},a.iconName,u=>o("iconName",u,`row:${i}:icon`),`sp:icon:${i}`,void 0,"Icon",!1)}</div>`),a.rowType==="entity"&&p.push(d`<div class="ts-stack">${Ae({hass:t.hass},"Entity",xn(t.hass,a.entityId),u=>{let f=u.entityId.trim();f!==""&&t.edit(g=>{let v=j(g,s,i,"entityId",f),x=ve(f,t.hass.states);return v=j(v,s,i,"domain",x.domain),a.iconName===ve(a.entityId).iconName&&(v=j(v,s,i,"iconName",x.iconName)),v})},`sp:entity:${i}`,{clearable:!1})}</div>`),c&&a.domain!=="sensor"){let u=$s(a.domain,a.deviceClassFilter);if(u.length>=2){let f=Ss(a),g=u.map(v=>[v.value,v.label]);g.some(([v])=>v===f)||g.push([f,xs(f)]),p.push(M("Show State",f,g,v=>o("filterState",v)))}}if(a.rowType==="dynamicList"&&(p.push(M("Entities",l?"all":"specific",X("DynamicMode"),u=>o("dynamicMode",u))),p.push(Ee("Show all states",a.showAllStates===!0,u=>o("showAllStates",u?!0:void 0),!1)),p.push(d`<div class="hint ts-under">On: every entity is listed whatever its state. Off: only those in the state above.</div>`)),a.domain==="sensor"&&(a.rowType==="groupCount"||l)&&(p.push(Kt(ks(a.deviceClassFilter),a.maxNumericValue,u=>o("maxNumericValue",u,`row:${i}:max`),{optional:!0,placeholder:"No limit",def:null})),p.push(d`<div class="hint ts-under">Only states at or below it count. Empty is no limit.</div>`)),c){let u=a.deviceClassFilter??[],f=Vs(a.domain,t.hass.states,u),g=v=>{let x=N(me(je(t.document,s),i)??e).deviceClassFilter??[],E=x.includes(v)?x.filter(C=>C!==v):[...x,v];o("deviceClassFilter",E.length===0?void 0:E)};p.push(d`<div class="field sp-classes"><span>Device classes</span>
      <div class="sp-chips" role="group" aria-label="Device classes">
        ${f.length===0?d`<span class="hint">None reported for ${a.domain===""?"this row":a.domain}.</span>`:w}
        ${f.map(v=>{let x=u.includes(v);return d`<button type="button" class="pe-chip ${x?"on":""}" aria-pressed=${x?"true":"false"} ?disabled=${t.busy}
            @click=${()=>g(v)}>${v.replaceAll("_"," ")}</button>`})}
      </div></div>
      <div class="hint ts-under">${u.length===0?"None picked: every class counts.":"Only entities of these classes count."}</div>`)}if(h){let u=a.groupEntityIds??[],f=Fs(e,t.hass.states);p.push(d`<div class="field sp-entities-field"><span>Edit Entities (${u.length})</span></div>
      ${Mn(t,`sp:ents:${i}`,f,u,(g,v)=>{let x=N(me(je(t.document,s),i)??e).groupEntityIds??[],E=v?x.includes(g)?x:[...x,g]:x.filter(C=>C!==g);o("groupEntityIds",E)})}`)}let m=d`<fieldset class="sp-body" ?disabled=${t.busy} aria-label="Row">${p}</fieldset>`;return d`${Pe(t,"row","row",Pn(a.rowType),m,{summary:st(e)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Remove this row from the page"
        @click=${()=>t.edit(u=>Je(u,s,i))}>${S("delete")}<span>Remove</span></button>
    </div>`}function ri(t,n,e,s){let i=We(e,s),a=(o,r)=>t.edit(c=>As(c,n,s.key,o),r);switch(s.kind){case"switch":return d`${Ee(s.label,i===!0,o=>a(o),s.default)}
        ${s.help===void 0?w:d`<div class="hint ts-under">${s.help}</div>`}`;case"slider":return Wt(s.label,Number(i),o=>a(o,`style:${n}:${s.key}`),{min:s.min??0,max:s.max??1,step:s.step??1,def:Number(s.default),...s.unit===void 0?{}:{unit:s.unit}});default:{let o=Ue.types.page.keys[s.key]?.enum??"",r=X(o);return r.length<=4?M(s.label,String(i),r,c=>a(c),{def:String(s.default)}):qt(s.label,String(i),r,c=>a(c),{def:String(s.default),snapBack:!0})}}}function wn(t,n){let e=I(n),s=Is(n);return Pe(t,"style","style","Style",d`<fieldset class="sp-body" ?disabled=${t.busy} aria-label="Style">
    ${qe().map(i=>ri(t,e,n,i))}
    <div class="sp-acts">
      <button type="button" class="pe-btn" ?disabled=${t.busy||!s} @click=${()=>t.edit(i=>Hs(i,e))}>
        ${S("reset")}<span>Reset to Defaults</span></button>
    </div>
  </fieldset>`,{summary:s?"Changed":"Defaults",dot:s})}function di(t,n){let e=I(n),s=z(n);return Pe(t,"page","page","Page",d`<fieldset class="sp-body" ?disabled=${t.busy} aria-label="Page">
    ${Oe("Name",s,i=>t.edit(a=>Es(a,e,i),`page:${e}:name`),{placeholder:"Page Name"})}
    ${Ve(n)?d`<div class="hint ts-under">One of the app's starter pages. It is edited and deleted like any other.</div>`:w}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Delete this status page"
        @click=${()=>t.edit(i=>Ke(i,e))}>${S("delete")}<span>Delete page</span></button>
    </div>
  </fieldset>`,{summary:s})}function ci(t,n,e,s){let i=ge(n.domain,"on");return d`<button type="button" class="sp-preset ${e?"on":""}" aria-pressed=${e?"true":"false"} ?disabled=${t.busy} @click=${s}>
    <span class="sp-preset-glyph">${it(t,n.icon,18,i===G.secondary?"#5B8FD4":i)}</span>
    <span class="sp-preset-label">${n.label}</span>
  </button>`}function li(t,n,e){let s=c=>$e(t,{...e,...c}),i=t.uiState.get(te),a=[["entity","Entity"],["groupCount","Group Count"],["dynamicList","Dynamic List"],["header","Header"]],o=M("Add",e.kind,a,c=>{if(c==="header"){Se(t,Ls());return}t.uiState.delete(te),s({kind:c,preset:void 0,picked:[],mode:"all"})}),r;if(e.kind==="entity"){let c=Number(t.uiState.get(`${A}:n`)??0)||0;r=d`<div class="ts-stack">${Ae({hass:t.hass},"Entity",xn(t.hass,""),l=>{let h=l.entityId.trim();if(h==="")return;t.uiState.set(`${A}:n`,c+1);let p=H(t);if(p!==void 0&&Us(p,h)){t.uiState.set(te,`${se(t.hass,h)} is on this page already.`),t.requestUpdate();return}Se(t,ve(h,t.hass.states),!0),t.uiState.set(te,`Added ${se(t.hass,h)}.`),t.requestUpdate()},`sp:add:entity:${c}`,{clearable:!1})}</div>
      <div class="hint">Each entity is one row. Pick another to add it too.</div>`}else{let c=e.kind==="groupCount"?Ks():qs(),l=e.preset===void 0?void 0:c[e.preset],h=e.kind==="groupCount"||e.mode==="specific",p=e.kind==="groupCount"?"Counts how many of the entities you pick are in a state.":"Pick what to show. Each matching entity becomes its own row. You can switch to hand-picked entities after adding.",m=d`<div class="sp-presets" role="group" aria-label=${e.kind==="groupCount"?"Group Count":"Dynamic List"}>
      ${c.map((f,g)=>ci(t,f,e.preset===g,()=>{if(!h){Se(t,Be(f));return}s({preset:g,picked:[]})}))}
    </div>`,u=w;if(h&&l!==void 0){let f=e.kind==="groupCount"?l.picker==="deviceClass"?l.deviceClassFilter:void 0:l.deviceClassFilter,g=js(l.domain,f,t.hass.states);u=d`<div class="field sp-entities-field"><span>${l.label}: ${ie(e.picked.length,"entity","entities")} picked</span></div>
        ${Mn(t,`${A}:pick`,g,e.picked,(v,x)=>{let E=ne(t)??e,C=E.picked.filter(re=>re!==v);$e(t,{...E,picked:x?[...C,v]:C})})}
        <div class="sp-acts">
          <button type="button" class="pe-btn pe-primary" ?disabled=${t.busy}
            @click=${()=>{let v=(ne(t)??e).picked;Se(t,e.kind==="groupCount"?Ms(l,v):Be(l,v))}}>
            ${S("plus")}<span>Add ${e.kind==="groupCount"?"group count":"dynamic list"}</span></button>
        </div>`}r=d`<p class="hint">${p}</p>
      ${e.kind==="dynamicList"?M("Entities",e.mode,X("DynamicMode"),f=>s({mode:f,preset:void 0,picked:[]})):w}
      ${m}${u}`}return d`${Pe(t,"add","add","Add a row",d`<fieldset class="sp-body" ?disabled=${t.busy} aria-label="Add a row">
    ${o}${r}
    ${typeof i=="string"?d`<div class="hint sp-added" role="status">${i}</div>`:w}
  </fieldset>`,{summary:z(n)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn" @click=${()=>$e(t,void 0)}>Done</button>
    </div>`}function Nn(t){let n=H(t);if(n===void 0)return d`<div class="insp-head"><div class="crumbs"><span class="nm">No status page</span></div></div>
      <div class="insp-body"><p class="sp-note">Add a status page to edit it.</p></div>`;let e=z(n)||"Untitled page",s=ae(t),i=ne(t),a=ai(t),o=hs(t.uiState,a),r,c;if(i!==void 0)r=d`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>nt(t)}>${e}</button><span class="sep">›</span><span class="nm">Add a row</span></div>`,c=li(t,n,i);else if(s!==void 0){let l=N(s),h=l.displayName===""?"Display Name":l.displayName;r=d`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>oe(t,void 0)}>${e}</button><span class="sep">›</span><span class="kchip" style=${`--k:${Cn(t,s)}`}>${Pn(l.rowType)}</span><span class="nm" title=${h}>${h}</span></div>`,c=d`${oi(t,n,s)}${wn(t,n)}`}else r=d`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">Page</span><span class="nm" title=${e}>${e}</span></div>`,c=d`${di(t,n)}${wn(t,n)}
      <p class="sp-note">Select a row to edit it, or add one.</p>`;return d`<div class="insp-head">
      ${r}
      <button class="expand" @click=${()=>{fs(t.uiState,a,!o),t.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${c}</div>`}var Un=le`
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
`;en({dirty:tt,drop:un});typeof window<"u"&&window.addEventListener("beforeunload",t=>{tt()&&(t.preventDefault(),t.returnValue="")});var ui=15e3,jn=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),ot=jn?"\u2318":"Ctrl+",rt={min:200,max:720,middleMin:320},dt={left:280,right:340},ct="wrist-assistant-panel.status-pages.columns.v1",pi=24,zn=820;function lt(t){return L(t).message}function ut(t){return L(t).code}function Fn(t){let{code:n,message:e}=L(t);return Object.assign(new Error(e),n===void 0?{}:{code:n})}function hi(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function fi(t){let n=t?Date.parse(t):NaN;return Number.isNaN(n)?"":bt(Math.max(0,(Date.now()-n)/1e3))}function gi(t){return t instanceof HTMLElement?as(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function mi(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}var b=class extends ht{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=w;this.shellOwnsWatch=!1;this.phones=!1;this.unsupported=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.starting=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=Sn();this.columns={...dt};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Yt(this);this.symbols=new Ft(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||this.load(e,!0)};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let s=e.composedPath();if(!s.includes(this)&&!mi()||this.renderRoot.querySelector("dialog[open]"))return;let i=e.metaKey||e.ctrlKey,a=e.key.toLowerCase();if(i&&!e.altKey&&a==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(!gi(s[0])){if(i&&!e.altKey&&a==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&a==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!i&&!e.altKey){let o=this.viewHost();o!==void 0&&nt(o)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let s=e.composedPath(),i=a=>s.some(o=>o instanceof HTMLElement&&o.classList.contains(a));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("sp-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(jt,this.onScrubStart),this.addEventListener(Vt,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return At(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return tn(this.watches,this.watchId)?"iphone":"watch"}get draft(){if(!(this.watchId===void 0||this.record===void 0||this.record.revision<=0))return q(this.watchId)}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Ut(ct,dt,rt),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++}willUpdate(e){if(this.hass){e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,ft(this.hass).then(a=>{this.ownList=a.owners},()=>{this.ownList=[]}));let i=Mt(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));i!==void 0&&this.openWatch(i)}this.followSave();let s=this.restoreAsk;s!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===s.entry.revision)&&this.closeAsk()}updated(){let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),ts(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let s of e){if(s.target!==this){this.measureTop(s.target);continue}let i=s.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width),Math.abs(i.height-this.hostHeight)>=1&&(this.hostHeight=i.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let s=this.renderRoot?.querySelector(".pe-top")??void 0;s!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=s,s!==void 0&&e.observe(s))}measureTop(e){let s=e.offsetHeight;s!==this.topHeight&&(this.topHeight=s,this.style.setProperty("--pe-top-h",`${s}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let s=q(e)?.saveDone;if(s===void 0||s===this.followedSave)return;this.followedSave=s;let i=()=>this.saveEnded(e);s.then(i,i)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,s=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),s=!1),this.startSubscription(e),this.load(e,s)}async load(e,s=!1){let i=this.hass;if(!i)return;if(s&&this.holdReload){this.reloadPending=!0;return}let a=++this.loadSeq;this.stopPolling(),s||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let o=await ue(i,e,"status_pages");if(a!==this.loadSeq)return;if(s&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(o),this.loadError=void 0}catch(o){if(a!==this.loadSeq)return;Ys(o)?(this.unsupported=!0,this.loadError=void 0):s||(this.loadError=lt(o)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let s=this.watchId;this.record=e;let i=e.revision>0?Cs(e.document):void 0;if(s===void 0||i===void 0)return;let a=this.restartDraft;a!==void 0&&a.watchId===s&&e.revision>=a.revision&&(this.restartDraft=void 0,(q(s)?.dirty??!1)||be(s));let o=ln(s,i,e.revision);o.kept.length>0?this.note={kind:"warn",text:ye(o.kept)}:o.mergedIntoEdits&&(this.note={kind:"warn",text:"The status pages changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let s=this.hass;if(!s||this.historyState==="unsupported")return;let i=++this.historySeq;try{let a=await gt(s,e,"status_pages");if(i!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(a?.entries)?a.entries:[],this.historyState="ready"}catch(a){if(i!==this.historySeq||e!==this.watchId)return;this.historyState=ut(a)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let s=this.hass;if(this.endSubscription(),!s)return;let i=++this.subscribeSeq;wt(s,e,a=>{i===this.subscribeSeq&&a.kind==="status_pages"&&a.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(a=>{i===this.subscribeSeq?this.unsubscribe=a:a().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Dt(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},ui))}async poll(){this.pollTimer=void 0;let e=this.hass,s=this.watchId,i=this.record;if(!(!e||s===void 0||i===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let a=await ue(e,s,"status_pages");if(s!==this.watchId||this.record!==i)return;a.revision===i.revision?this.record={...i,delivered_revision:a.delivered_revision,delivered_at:a.delivered_at,rejected_revision:a.rejected_revision,rejected_at:a.rejected_at,rejected_reason:a.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(a),this.loadHistory(s))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,s){let i=this.draft;if(!i||this.saving)return!1;let a=i.apply(e(i.document),this.scrubKey??s);return this.requestUpdate(),a}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??is,s=this.iconMemo;if(s!==void 0&&s.provider===e&&s.tick===this.iconsTick)return s.icons;let i=os(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:i},i}screen(){let e=this.phoneLayout();if(e!==void 0)return vs(e);let s=this.watches.find(i=>i.owner_watch_id===this.watchId);return(De(s?.screen_size)??Ce).screen}phoneLayout(){if(this.device!=="iphone")return;let e=this.watches.find(s=>s.owner_watch_id===this.watchId);return ms(gs(e?.screen_size))}viewHost(){let e=this.draft,s=this.hass;if(e===void 0||s===void 0)return;let i=this;return{hass:s,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*Ne,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},get document(){return e.document},get busy(){return i.saving},edit:(a,o)=>this.draft===e&&this.edit(a,o),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,s=this.watchId;this.endScrub();let i=this.draft;if(!e||s===void 0||!i||this.saving||!i.dirty)return;this.note=void 0;let a=dn(i,{save:(r,c)=>_e(e,s,"status_pages",r,c).catch(l=>{throw Fn(l)}),fetch:async()=>{let r=await ue(e,s,"status_pages").catch(c=>{throw Fn(c)});return{revision:r.revision,document:r.document}}});this.followedSave=i.saveDone,this.requestUpdate();let o=await a.catch(r=>({ok:!1,revision:i.revision,merged:!1,code:ut(r)??"unknown",message:lt(r)}));this.saveEnded(s),s===this.watchId&&(this.note=pn(o))}async start(e){let s=this.hass,i=this.watchId;if(!s||i===void 0||this.starting)return;this.starting=!0,this.note=void 0;let a=await cn(e?Rs():Ts(),(o,r)=>_e(s,i,"status_pages",o,r));if(this.starting=!1,i===this.watchId){if(a.ok)this.note={kind:"ok",text:`${e?"Started with an empty list":"Started with the defaults"}. The watch picks them up the next time it checks.`};else if(a.code==="no_record"){this.note={kind:"warn",text:`${Gs} Go to Watch app, Settings, Pair a device.`};return}else if(a.code==="conflict")this.note={kind:"warn",text:"Status pages arrived meanwhile, so those are shown."};else if(a.code==="unsupported"){this.unsupported=!0;return}else{this.note={kind:"err",text:`Could not start: ${a.message}`};return}this.load(i,!0)}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let s=this.hass,i=this.watchId,a=this.record;if(!s||i===void 0||a===void 0||this.draft?.dirty)return;let o={entry:e,baseRevision:a.revision};this.restoreAsk=o,mt(s,i,"status_pages",e.revision).then(r=>{this.restoreAsk===o&&(this.restoreAsk={...o,summary:Bs(r.document)})},()=>{})}async restore(){let e=this.hass,s=this.watchId,i=this.restoreAsk;if(!e||s===void 0||i===void 0||this.restoring)return;this.restoring=!0;let a;try{let o=await vt(e,s,"status_pages",i.entry.revision,i.baseRevision);a={kind:"ok",text:`Revision ${i.entry.revision} is back.`},s===this.watchId?this.restartDraft={watchId:s,revision:o.revision}:(q(s)?.dirty??!1)||be(s)}catch(o){let r=ut(o);r==="conflict"?a={kind:"warn",text:"Not restored. The status pages changed somewhere else, so the newest copy is shown."}:r==="no_record"?a={kind:"warn",text:`Not restored. Home Assistant no longer holds status pages for this ${pe(this.device)}.`}:r==="not_found"?a={kind:"warn",text:"Not restored. That save is no longer kept."}:r==="unknown_command"?(this.historyState="unsupported",a={kind:"warn",text:"This version of the integration cannot restore status pages. Update it to restore an earlier save."}):a={kind:"err",text:`Could not restore: ${lt(o)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}s===this.watchId&&(this.note=a,this.load(s,!0))}render(){let e=this.watches,s=this.draft;return d`
      <div class="pe-top">
        ${this.renderTopBar(s,e)}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:w}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):w}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=zn}renderTopBar(e,s){let i=e!==void 0&&!this.unsupported,a=i&&this.dirty;return d`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Watch status pages">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${S("menu")}</button>`:w}
      ${this.shellOwnsWatch?w:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Xs(void 0,!1)}>${S("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?w:this.renderWatchPicker(s)}
      ${this.renderSyncPill(i?e:void 0)}
      ${this.renderTopMenu(i?e:void 0)}
      ${i?d`<button class="primary save ${a?"dirty":""}" ?disabled=${!a||this.saving}
          title=${a?`Save (${ot}S). A save reaches the ${pe(this.device)} the next time it checks.`:`Nothing to save (${ot}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        <span class="tb-saved" title=${a?"Unsaved changes":""}>${Zt(this.record,void 0,this.device)}</span>`:w}
      ${this.barActions}
      <button class="help" title="Help: status pages" aria-label="Help"
        @click=${()=>window.open(Qs,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(e){let s=this.record;if(s===void 0||s.revision<=0||this.unsupported)return w;let i=e===void 0?{size:0,limit:1}:ze(e.document),a=He({record:s,size:i.size,limit:i.limit,noun:"status pages",historyState:this.historyState,device:this.device});return d`<span class="tb-sync ${a.tone==="ok"?"ok":"warn"}" title=${`${a.state}. ${a.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${a.state}</span>
    </span>`}noRecordState(e=this.watches){return Ht(e.find(s=>s.owner_watch_id===this.watchId))}canStart(){let e=this.record;return this.watchId!==void 0&&e!==void 0&&e.revision<=0&&!this.unsupported}renderTopMenu(e){let s=this.canStart();if(e===void 0&&!s)return w;let i=this.topMenuOpen,a=o=>()=>{this.topMenuOpen=!1,o()};return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${i?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!i}}>···</button>
      ${i?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?d`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${a(()=>this.discard())}>Discard edits</button>`:w}
        ${s?d`<button class="row" role="menuitem" ?disabled=${this.starting}
          @click=${a(()=>{fe(this.noRecordState())&&this.start(!1)})}>${Ge}</button>
          <button class="row" role="menuitem" ?disabled=${this.starting}
          @click=${a(()=>{fe(this.noRecordState())&&this.start(!0)})}>${Ze}</button>`:w}
      </div>`:w}
    </span>`}personColor(e){let s=Jt(this.owners.length>0?this.owners:this.ownList??[]);return Gt(s.findIndex(i=>i.owners.some(a=>a.owner_watch_id===e)))}renderWatchPicker(e){if(e.length<2)return w;let s=e.find(o=>o.owner_watch_id===this.watchId),i=this.watchMenuOpen,a=o=>{let r=o===void 0?void 0:this.personColor(o);return d`<span class="pe-chip-glyph" style=${r?`--pe-person: ${r}`:w} aria-hidden="true">${S("watch")}</span>`};return d`<span class="picker sp-watch-picker">
      <button type="button" class="tb-browse sp-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose status pages are shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${a(s?.owner_watch_id)}<span class="tb-browse-l">${s?he(s,e):"Choose a watch"}</span>
        <span class="sp-caret" aria-hidden="true">${S("chevron")}</span>
      </button>
      ${i?d`<div class="pop-menu sp-watch-menu" role="menu" aria-label="Watches">
        ${e.map(o=>{let r=o.owner_watch_id===this.watchId;return d`<button type="button" class="row sp-watch-row" role="menuitemradio" aria-checked=${r?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,r||this.openWatch(o.owner_watch_id)}}>
            ${a(o.owner_watch_id)}<span class="sp-watch-name">${he(o,e)}</span>
            <span class="sp-watch-check" aria-hidden="true">${r?S("check"):w}</span>
          </button>`})}
      </div>`:w}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=zn?this.columns:Nt(this.hostWidth-pi,this.columns,rt)}renderGutter(e){return d`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the pages and rows column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${s=>{let i=this.fittedColumns();zt(s,{side:e,base:e==="left"?i.left:i.right,limits:rt,onWidth:a=>{this.columns={...this.columns,[e]:a}},onEnd:()=>Re(ct,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:dt[e]},Re(ct,this.columns)}}></div>`}get stageScale(){return this.zoom??Ie(this.narrow||this.stacked)}setZoom(e){this.zoom=e,$n(e)}renderStage(e,s){let i=s.find(v=>v.owner_watch_id===this.watchId),o=De(i?.screen_size)??Ce,r=e.phone!==void 0,c=e.phone===void 0?o.label:e.phone.model.label,l=[...In(e),c],h=v=>ds(r?v*Ne:v),p=H(e),m=p===void 0?"Status pages":z(p)||"Untitled page",u=this.draft,f=this.stageScale,g=Ie(this.narrow||this.stacked);return d`<div class="card canvas-card sp-canvas" aria-label="Status page">
      <div class="cv-head">
        <span class="cv-title" title=${m}>${m}</span>
        ${i!==void 0?d`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${he(i,s)}</span></span>`:w}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${l.join(" \xB7 ")}><span class="fam">${l.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!u?.canUndo} title=${`Undo (${ot}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${S("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!u?.canRedo} title=${jn?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${S("redo")}</button>
        </span>
      </div>
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <button class="tb sp-case" aria-disabled="true" tabindex="-1" title=${r?ws:`This watch's screen, ${o.label}.`}>
            ${S(r?"phone":"watch")}<span class="word keep">${c}</span></button>
          <span class="tb-sep" aria-hidden="true"></span>
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${f<=Me(f)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(Me(f))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${h(f)}. Back to fit`}
              title=${`The ${r?"iPhone":"watch"} at ${h(f)} of its own points. Click to fit it again (${h(g)}).`}
              @click=${()=>this.setZoom(void 0)}>${h(f)}</button>
            <button class="tb icon" ?disabled=${f>=Le(f)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(Le(f))}>+</button>
          </span>
        </div>
        <div class="sp-stage-body">${Hn(e)}</div>
        <div class="under"><span class="tail">${kn}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0){let c=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${c?"Loading\u2026":"No watch has connected to this Home Assistant yet."}</div>`}if(this.unsupported)return d`<div class="pe-empty"><b>${Zs}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let c=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this ${pe(this.device)}'s status pages: ${this.loadError}</span>
        ${c===void 0?w:d`<button class="pe-btn" @click=${()=>{this.load(c)}}>Try again</button>`}
      </div>`}let s=this.record;if(s===void 0)return d`<div class="pe-empty">Loading…</div>`;let i=this.draft,a=this.viewHost();if(s.revision<=0||i===void 0||a===void 0){let c=this.watchId===void 0?void 0:q(this.watchId),l=this.watchId,h=this.noRecordState(e);return d`<div class="pe-empty"><b>${Et("status pages",this.device)}</b><span>${Lt(h,Js)}</span>
        ${h==="wait"?d`<button class="link start-fresh" ?disabled=${this.starting} @click=${()=>{fe(h)&&this.start(!1)}}>${this.starting?"Starting\u2026":It}</button>`:d`<span class="sp-start">
              <button class="pe-btn pe-primary" ?disabled=${this.starting} @click=${()=>{this.start(!1)}}>${this.starting?"Starting\u2026":Ge}</button>
              <button class="pe-btn" ?disabled=${this.starting} @click=${()=>{this.start(!0)}}>${Ze}</button>
            </span>
            <span class="pe-muted">The defaults are the app's five pages: Lights, Who's Home, Room Temps, Doors & Windows and Low Battery.</span>`}
        ${c?.dirty&&l!==void 0?d`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when status pages are here again.</span>
          <button class="pe-btn" @click=${()=>{be(l),this.requestUpdate()}}>Discard the kept edits</button>`:w}
      </div>`}let o=this.fittedColumns(),r=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"";return d`<div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${o.left}px;--wa-right:${o.right}px;${r}`}>
      <div class="column left">
        ${Dn(a)}
        ${On(a)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(a,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Nn(a)}
      </div>
    </div>
    ${this.renderFoot(s,i.document,i.dirty)}`}renderFoot(e,s,i){let a=ze(s),o=He({record:e,size:a.size,limit:a.limit,noun:"status pages",historyState:this.historyState,device:this.device}),r=this.watchId;return d`${Xt({status:o,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Qt({noun:"status pages",device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:i,restoring:this.restoring,onRetry:()=>{r!==void 0&&(this.historyState="loading",this.loadHistory(r))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):w}
    ${this.rawOpen?es({noun:"status pages",document:s,revision:e.revision,dirty:i,copied:this.rawCopied,onCopy:c=>{ss(c).then(l=>{this.rawCopied=l})},onClosed:()=>{this.rawOpen=!1}}):w}`}renderRestoreAsk(e){let s=this.record,i=fi(e.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="sp-ask-title"
      @cancel=${a=>{this.restoring&&a.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="sp-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${Ot(e.entry.updated_by,this.device)}${i?` ${i}`:""}, ${hi(e.entry.size)}.</p>
      ${e.summary?d`<p class="pe-muted">${e.summary}</p>`:w}
      <p>It is saved again as a new revision${s?`, after revision ${s.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Rt,yt,St,$t,kt,xt,Pt,_t,cs,ys,le`
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
    .sp-start { display: flex; flex-wrap: wrap; gap: 8px; }
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
      .pe-layout > .column { grid-column: auto; position: static; max-height: none; overflow: visible; }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
      .pe-layout > .column.left { order: 3; }
    }
    .column.canvas > .card.canvas-card.sp-canvas { min-height: 0; flex: none; }
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
  `,Un,ns]}};y([_({attribute:!1})],b.prototype,"hass",2),y([_({attribute:!1})],b.prototype,"owners",2),y([_({attribute:!1})],b.prototype,"ownerId",2),y([_({type:Boolean,reflect:!0})],b.prototype,"narrow",2),y([_({attribute:!1})],b.prototype,"icons",2),y([_({attribute:!1})],b.prototype,"iconsTick",2),y([_({attribute:!1})],b.prototype,"haMenu",2),y([_({attribute:!1})],b.prototype,"onHaMenu",2),y([_({attribute:!1})],b.prototype,"onBack",2),y([_({attribute:!1})],b.prototype,"barActions",2),y([_({attribute:!1})],b.prototype,"shellOwnsWatch",2),y([_({attribute:!1})],b.prototype,"phones",2),y([k()],b.prototype,"watchId",2),y([k()],b.prototype,"record",2),y([k()],b.prototype,"unsupported",2),y([k()],b.prototype,"loading",2),y([k()],b.prototype,"loadError",2),y([k()],b.prototype,"history",2),y([k()],b.prototype,"historyState",2),y([k()],b.prototype,"note",2),y([k()],b.prototype,"restoreAsk",2),y([k()],b.prototype,"restoring",2),y([k()],b.prototype,"starting",2),y([k()],b.prototype,"historyOpen",2),y([k()],b.prototype,"rawOpen",2),y([k()],b.prototype,"rawCopied",2),y([k()],b.prototype,"ownList",2),y([k()],b.prototype,"topMenuOpen",2),y([k()],b.prototype,"watchMenuOpen",2),y([k()],b.prototype,"zoom",2),y([k()],b.prototype,"columns",2),y([k()],b.prototype,"hostWidth",2),y([k()],b.prototype,"hostHeight",2);customElements.get("wa-status-pages-editor")||customElements.define("wa-status-pages-editor",b);export{ct as SP_COLUMNS_KEY,b as WaStatusPagesEditor};
