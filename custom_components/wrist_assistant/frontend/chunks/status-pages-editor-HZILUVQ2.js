import{$ as Ge,A as $s,B as ks,C as Ke,D as Q,E as qe,F as xs,G as Ps,H as Ts,I as ve,J as _s,K as Rs,L as We,M as Cs,N as Ds,O as Be,P as Os,Q as j,R as Es,S as As,T as Hs,U as Is,V as Ls,W as Ms,X as Ns,Y as Us,Z as zs,_ as Je,a as N,aa as Fs,b as ps,ba as js,c as hs,ca as Vs,d as fs,e as gs,f as Z,g as ge,h as ms,i as vs,j as Ne,k as ws,l as bs,m as R,n as ys,o as Ue,p as ze,q as I,r as z,s as Y,t as X,u as F,v as Fe,w as me,x as je,y as Ss,z as Ve}from"./chunk-E435B3A2.js";import"./chunk-RZRTGY27.js";import{A as ls,B as us,o as is,p as Ie,q as G,r as Le,s as Me,w as as,x as rs,y as ds,z as cs}from"./chunk-VHJ4NLHF.js";import{b as It,c as _e,d as Lt,e as Re,f as Mt,h as O,i as os}from"./chunk-QVYMVUW6.js";import{a as He,b as Bt,c as Jt,d as Gt,e as Zt,f as Yt,g as Xt,h as Qt,i as es}from"./chunk-LPINYJFC.js";import{b as qt,p as Wt}from"./chunk-VJOF2OAN.js";import{a as ts,b as ss,d as ns,o as J}from"./chunk-43HRUTRJ.js";import{$ as fe,Db as De,Dd as Ae,Fd as Kt,I as Ct,R as Dt,U as he,X as Ot,Xb as Nt,Z as Et,_ as At,_a as Ht,h as wt,lf as Ks,mf as qs,nd as Ut,nf as Ws,od as zt,pd as Oe,qd as Ft,rd as jt,sd as M,td as Vt,vd as Ee,yb as Ce}from"./chunk-K62QG5HJ.js";import{Ag as Te,Ah as Rt,Bg as ft,Bh as L,Cg as gt,Dg as mt,Eg as vt,b as ue,c as o,cg as ht,dh as B,eh as S,f,i as pt,ih as bt,j as T,k,kh as yt,lh as St,mh as $t,nh as kt,oh as xt,ph as Pt,qh as Tt,yg as pe,zh as _t}from"./chunk-CQXHQEN6.js";import{a as y}from"./chunk-LO2NM3CE.js";function Ze(t){return t===null?void 0:t}function V(t,n){return t!=null&&Object.hasOwn(t,n)?t[n]:void 0}function Ye(t){if(!Array.isArray(t))return;let n=new Set,e=[];for(let s of t){if(!J(s)||typeof s.id!="string"||s.id==="")return;let i=s.id.toUpperCase();if(n.has(i))return;n.add(i),e.push([i,s])}return e}function Ln(t,n){return t.length===n.length&&t.every((e,s)=>e===n[s])}function Bs(t,n){return t===void 0&&n===void 0?{kind:"same"}:t!==void 0&&n!==void 0&&O(t,n)?{kind:"same"}:{kind:"changed",page:n}}function Xe(t){return t!==void 0&&typeof t.name=="string"?t.name:""}function Js(t,n,e){let s=Ze(t),i=Ze(n),a=Ze(e),r=s===void 0?[]:Ye(s),d=i===void 0?void 0:Ye(i),c=a===void 0?void 0:Ye(a);if(r===void 0||d===void 0||c===void 0)return{pages:O(i,s)?a:i,clashes:[]};let l=new Map(r),h=new Map(d),p=new Map(c),g=[],u=$=>{let D=l.get($),_=h.get($),P=p.get($),le=Bs(D,_),Hn=Bs(D,P);if(le.kind==="same")return P;if(Hn.kind==="same")return _;if(_!==void 0&&P!==void 0&&O(_,P))return P;if(_!==void 0||P!==void 0){let In=Xe(P)||Xe(_)||Xe(D);g.push({id:P?.id??_?.id??D?.id,name:In})}return P},v=d.map(([$])=>$).filter($=>l.has($)),m=r.map(([$])=>$).filter($=>h.has($)),b=!Ln(v,m),[x,E]=b?[d,c]:[c,d],C=x.map(([$])=>$),de=new Set(C);E.forEach(([$],D)=>{if(de.has($))return;let _=0;for(let P=D-1;P>=0;P--){let le=C.indexOf(E[P][0]);if(le>=0){_=le+1;break}}C.splice(_,0,$),de.add($)});let ce=[];for(let $ of C){let D=u($);D!==void 0&&ce.push(D)}let ut=$=>$.length===ce.length&&ce.every((D,_)=>D===$[_]);return ut(a)?{pages:a,clashes:g}:ut(i)?{pages:i,clashes:g}:{pages:ce,clashes:g}}function Gs(t,n,e){return Js(t==null?[]:V(t,R),V(n,R),V(e,R)).clashes}function Zs(t,n,e){let s=os(t,n,e),i=Js(t==null?[]:V(t,R),V(n,R),V(e,R)).pages;if(i===void 0){if(!Object.hasOwn(s,R))return s;let a={};for(let r of Object.keys(s))r!==R&&(a[r]=s[r]);return a}if(s[R]===i)return s;if(s===e||s===n){let a={...s};return a[R]=i,we(a,e)?e:we(a,n)?n:a}return s[R]=i,we(s,e)?e:we(s,n)?n:s}function we(t,n){let e=Object.keys(t);return e.length!==Object.keys(n).length?!1:e.every(s=>Object.hasOwn(n,s)&&n[s]===t[s])}var Ys=100,Mn=3,Qe=class{constructor(n,e){this._undo=[];this._redo=[];this._kept=[];this._base=n,this._revision=e,this._document=n}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get kept(){return this._kept}get dirty(){let n=this._dirty;if(n!==void 0&&n.document===this._document&&n.base===this._base)return n.value;let e=this._document!==this._base&&!O(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(n,e){if(n===this._document||O(n,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let s=this._undo[this._undo.length-1];return O(n,s)?(this._undo.pop(),this._document=s,this._coalesceKey=void 0):this._document=n,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=n,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let n=this._undo.pop();return n===void 0?!1:(this._redo.push(this._document),this._document=n,!0)}redo(){this._coalesceKey=void 0;let n=this._redo.pop();return n===void 0?!1:(this.pushUndo(this._document),this._document=n,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(n,e){return e<this._revision?(this._kept=[],!1):this.mergeOnto(n,e)}restart(n,e){return this.mergeOnto(n,e)}mergeOnto(n,e){this._coalesceKey=void 0;let s=this._base;this._kept=this._document===s?[]:Gs(s,this._document,n);let i=new Map,a=p=>{let g=i.get(p);if(g!==void 0)return g;let u=p===s?n:Zs(s,p,n);return u!==n&&O(u,n)&&(u=n),i.set(p,u),u},r=this._document,d=[...this._undo,this._document,...this._redo.slice().reverse()].map(a),c=this._undo.length,l=[],h=0;return d.forEach((p,g)=>{let u=l[l.length-1];u!==void 0&&(u===p||O(u,p))?g===c&&(l[l.length-1]=p):l.push(p),g===c&&(h=l.length-1)}),this._undo=l.slice(0,h),this._document=l[h],this._redo=l.slice(h+1).reverse(),this._base=n,this._revision=e,this._document!==r&&!O(this._document,r)}saved(n,e){e<this._revision||(this._coalesceKey=void 0,this._base=n,this._revision=e)}get saving(){return ee.has(this)}get saveDone(){return ee.get(this)}pushUndo(n){this._undo.push(n),this._undo.length>Ys&&this._undo.splice(0,this._undo.length-Ys)}},ee=new WeakMap;function Xs(t,n){if(ee.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"These status pages are being saved already."});let e=Nn(t,n).finally(()=>ee.delete(t));return ee.set(t,e),e}async function Nn(t,n){let e=!1,s=new Map,i=()=>s.size===0?{}:{kept:[...s.values()]},a=(r,d,c)=>({ok:!1,revision:t.revision,merged:e,code:r,message:d,...i(),...c===void 0?{}:{problems:c}});for(let r=1;;r++){let d=t.document,c=Ms(d);if(c.length>0)return a("invalid",c.join(" "),c);let l;try{({revision:l}=await n.save(t.revision,d))}catch(h){let{code:p="unknown",message:g}=L(h);if(p!=="conflict"||r>=Mn)return a(p,g);let u;try{u=await n.fetch()}catch(v){let m=L(v);return a(m.code??"unknown",m.message)}if(!J(u)||!(u.revision>0)||!J(u.document))return a("no_record","Home Assistant holds no status pages for this watch.");u.revision<t.revision?t.restart(u.document,u.revision):t.rebase(u.document,u.revision);for(let v of t.kept)s.set(v.id.toUpperCase(),v);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0,...i()};continue}return t.saved(d,l),{ok:!0,revision:t.revision,merged:e,...i()}}}async function Qs(t,n){try{let{revision:e}=await n(0,t);return{ok:!0,revision:e}}catch(e){let{code:s,message:i}=L(e);return s==="no_record"||s==="conflict"?{ok:!1,code:s,message:i}:s==="unknown_command"?{ok:!1,code:"unsupported",message:i}:{ok:!1,code:"error",message:i}}}var K=new Map;function q(t){return K.get(t)}function en(t,n,e){let s=K.get(t);if(s!==void 0&&e<=0)return{draft:s,mergedIntoEdits:!1,kept:[]};if(s===void 0||e<s.revision&&!s.dirty){let r=new Qe(n,e);return K.set(t,r),{draft:r,mergedIntoEdits:!1,kept:[]}}if(e===s.revision)return{draft:s,mergedIntoEdits:!1,kept:[]};let i=s.dirty,a=e<s.revision?s.restart(n,e):s.rebase(n,e);return{draft:s,mergedIntoEdits:i&&a,kept:i?s.kept:[]}}function be(t){K.delete(t)}function et(){for(let t of K.values())if(t.dirty)return!0;return!1}function tn(){K.clear()}function Un(t){return t.name.trim()===""?"a status page":`"${t.name}"`}function ye(t){if(t.length===0)return"";let n=t.map(Un);return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"That save's version was kept.":"That save's versions were kept."}`}function sn(t){if(t.ok){let e=t.kept??[];if(t.alreadySaved===!0){let s=e.length>0?` ${ye(e)}`:"";return{kind:e.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.${s}`}}return e.length>0?{kind:"warn",text:`Saved. ${ye(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The status pages kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds status pages for this watch. Start with the defaults again."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the status pages is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the status pages${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Rt}`};case"busy":return{kind:"warn",text:"Already saving these status pages. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the status pages just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}var U="status-pages",ln="sp:page",W="sp:row",A="sp:add",te="sp:drag",se="sp:added",un="wrist-assistant-panel.status-pages.zoom.v1";function pn(t=_e()){try{let n=t?.getItem(un),e=n==null||n===""?NaN:Number(n);return is.includes(e)?e:void 0}catch{return}}function hn(t,n=_e()){try{n?.setItem(un,t===void 0?"":String(t))}catch{}}var zn="Pages the watch opens from a tile, a menu slot or Siri. A save reaches the watch the next time it checks.",fn="Drawn from Home Assistant's states now, as the watch draws the page. Tap a row to edit it.";function ae(t,n,e){return`${t} ${t===1?n:e}`}function ne(t,n){let e=t.states[n]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:n}function gn(t,n){let e=n.indexOf(".");return{entityId:n,displayName:n===""?"":ne(t,n),domain:e<0?"":n.slice(0,e)}}function Fn(t){switch(t){case"battery_charging":return"charging";case"illuminance":return"light";case"occupancy":case"presence":return"occupancy";case"garage_door":case"garage":return"garage";case"carbon_monoxide":return"CO";default:return t.replaceAll("_"," ")}}function jn(t,n){if(n!==void 0&&n.length>0){let e=n.map(Fn),s=e.length===1?e[0]:e.slice(0,2).join("/");return t==="sensor"||t==="binary_sensor"?`${s} sensors`:t==="cover"?s.includes("garage")?"garage doors":`${s} covers`:`${s} ${t}s`}return t==="person"?"people":t==="binary_sensor"?"binary sensors":`${t}s`}function tt(t){let n=N(t),e=s=>`${s} ${s===1?"entity":"entities"}`;switch(n.rowType){case"entity":return n.entityId;case"groupCount":return`${e(n.groupEntityIds?.length??0)} \xB7 group count`;case"dynamicList":return n.dynamicMode==="all"?`all ${jn(n.domain,n.deviceClassFilter)} \xB7 dynamic list`:`${e(n.groupEntityIds?.length??0)} \xB7 dynamic list`;case"sectionHeader":return"section header";default:return n.rowType}}function mn(t){return Ne.labels.StatusRowType?.[t]??t}function H(t){let n=ze(t.document),e=t.uiState.get(ln);return(typeof e=="string"?n.find(s=>F(I(s),e)):void 0)??n[0]}function vn(t,n){t.uiState.set(ln,n),t.uiState.delete(W),t.uiState.delete(A),t.requestUpdate()}function re(t){let n=t.uiState.get(W);return typeof n=="string"?me(H(t),n):void 0}function oe(t,n){n===void 0?t.uiState.delete(W):t.uiState.set(W,n),t.uiState.delete(A),t.requestUpdate()}function st(t){return re(t)===void 0&&!t.uiState.has(A)?!1:(t.uiState.delete(W),t.uiState.delete(A),t.requestUpdate(),!0)}function ie(t){let n=t.uiState.get(A);return typeof n=="object"&&n!==null?n:void 0}function $e(t,n){n===void 0?t.uiState.delete(A):(t.uiState.set(A,n),t.uiState.delete(W)),t.requestUpdate()}function Vn(t,n="entity"){t.uiState.delete(se),$e(t,{kind:n,mode:"all",picked:[]})}function Se(t,n,e=!1){let s=H(t);if(s===void 0)return;let i=I(s),a;return t.edit(r=>{let d=Cs(r,i,n);return a=d.id,d.document}),a!==void 0&&!e&&oe(t,a),a}function Kn(t){let n;t.edit(e=>{let s=Ss(e);return n=s.id,s.document}),n!==void 0&&vn(t,n)}function wn(t,n,e,s,i){return{start:a=>{t.uiState.set(te,{list:n,id:e}),a.dataTransfer?.setData("text/plain",e),a.dataTransfer&&(a.dataTransfer.effectAllowed="move")},over:a=>{t.uiState.get(te)?.list===n&&(a.preventDefault(),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))},drop:a=>{let r=t.uiState.get(te);t.uiState.delete(te),!(r?.list!==n||F(r.id,e))&&(a.preventDefault(),i(r.id,s))},end:()=>{t.uiState.delete(te)}}}function nt(t,n,e,s){return t.icons.render(n,e,s)??o`<span class="sp-glyph-dot" style=${`background:${s};width:${Math.max(4,e*.6)}px;height:${Math.max(4,e*.6)}px`}></span>`}function bn(t,n,e){return o`<span class="thumb sp-thumb" style=${`--c:${e}`} aria-hidden="true"><span class="sp-thumb-glyph">${nt(t,n,14,e)}</span></span>`}function yn(t,n){let e=N(n);return e.rowType==="sectionHeader"?Z.secondary:e.rowType==="entity"?ge(e.domain,t.hass.states[e.entityId]?.state):ge(e.domain,"on")}function qn(t,n,e,s,i){let a=I(n),r=z(n),d=i!==void 0&&F(a,I(i)),c=Y(n).length,l=(g,u)=>t.edit(v=>$s(v,g,u)),h=wn(t,"page",a,e,l),p=()=>{d||vn(t,a)};return o`<div class="layer sp-page-row ${d?"hl":""}" data-page=${a} role="listitem" tabindex="0"
    draggable=${t.busy?"false":"true"} aria-current=${d?"true":"false"} aria-label=${r||"Untitled page"}
    @dragstart=${h.start} @dragover=${h.over} @drop=${h.drop} @dragend=${h.end}
    @click=${g=>{g.target instanceof Element&&g.target.closest("button")||p()}}
    @keydown=${g=>{g.target!==g.currentTarget||g.key!=="Enter"&&g.key!==" "||(g.preventDefault(),p())}}>
    <span class="grip" aria-hidden="true"></span>
    ${bn(t,"doc.text.fill","#5B8FD4")}
    <span class="name"><b><span class="nm-t">${r||"Untitled page"}</span></b><small>${ae(c,"row","rows")}</small></span>
    <span class="right">
      <span class="badges">${je(n)?o`<span class="badge" title="One of the app's starter pages. The watch treats it as any other page.">starter</span>`:f}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${t.busy||e===0} title="Move up" aria-label=${`Move ${r} up`}
          @click=${()=>l(a,e-1)}>${S("up")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||e===s-1} title="Move down" aria-label=${`Move ${r} down`}
          @click=${()=>l(a,e+1)}>${S("down")}</button>
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Delete" aria-label=${`Delete ${r}`}
          @click=${()=>t.edit(g=>Ve(g,a))}>${S("delete")}</button>
      </span>
    </span>
  </div>`}function Sn(t){let n=ze(t.document),e=H(t);return o`<section class="card lc sp-pages-card" aria-label="Status pages" style="--c: var(--wa-lc-pages, #26a69a); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${S("list")}</span><span class="lc-title">Status pages</span>
      <span class="lc-sub" title=${zn}>${ae(n.length,"page","pages")}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-page" aria-label="Add status page" ?disabled=${t.busy}
        title="Add a status page" @click=${()=>Kn(t)}>${S("plus")}<span>Add</span></button>
    </div>
    ${n.length===0?o`<div class="lc-note">No status pages. Add one to show the live state of entities you pick.</div>`:o`<div class="layers sp-page-list" role="list">${n.map((s,i)=>qn(t,s,i,n.length,e))}</div>`}
  </section>`}function Wn(t,n,e,s,i,a){let r=X(e),d=N(e),c=a!==void 0&&F(r,X(a)),l=d.isHidden===!0,h=d.displayName===""?"Display Name":d.displayName,p=(m,b)=>t.edit(x=>Os(x,n,m,b)),g=wn(t,"row",r,s,p),u=()=>oe(t,r),v=d.rowType==="sectionHeader"?"line.horizontal.3":d.iconName;return o`<div class="layer sp-row-row ${c?"hl":""} ${l?"dim":""}" data-row=${r} role="listitem" tabindex="0"
    draggable=${t.busy?"false":"true"} aria-current=${c?"true":"false"} aria-label=${h}
    title=${`${h} \xB7 ${tt(e)}${l?", hidden":""}`}
    @dragstart=${g.start} @dragover=${g.over} @drop=${g.drop} @dragend=${g.end}
    @click=${m=>{m.target instanceof Element&&m.target.closest("button")||u()}}
    @keydown=${m=>{m.target!==m.currentTarget||m.key!=="Enter"&&m.key!==" "||(m.preventDefault(),u())}}>
    <span class="grip" aria-hidden="true"></span>
    ${bn(t,v,yn(t,e))}
    <span class="name"><b><span class="nm-t">${h}</span></b><small>${tt(e)}</small></span>
    <span class="right">
      <span class="badges">${l?o`<span class="badge">hidden</span>`:f}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${t.busy} title=${l?"Show":"Hide"} aria-label=${`${l?"Show":"Hide"} ${h}`}
          @click=${()=>t.edit(m=>j(m,n,r,"isHidden",!l))}>${S(l?"show":"hide")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||s===0} title="Move up" aria-label=${`Move ${h} up`}
          @click=${()=>p(r,s-1)}>${S("up")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||s===i-1} title="Move down" aria-label=${`Move ${h} down`}
          @click=${()=>p(r,s+1)}>${S("down")}</button>
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Remove" aria-label=${`Remove ${h}`}
          @click=${()=>t.edit(m=>Be(m,n,r))}>${S("delete")}</button>
      </span>
    </span>
  </div>`}function $n(t){let n=H(t),e=n===void 0?[]:Y(n),s=re(t),i=n===void 0?"":I(n),a;n===void 0?a=o`<div class="lc-note">Add a status page to give it rows.</div>`:e.length===0?a=o`<div class="lc-note">No rows yet. Add entities to show in this status page.</div>`:a=o`<div class="layers sp-row-list" role="list">${e.map((d,c)=>Wn(t,i,d,c,e.length,s))}</div>
    <div class="lc-note sp-drag-note">Drag a row, or use its arrows, to reorder.</div>`;let r=ie(t)!==void 0;return o`<section class="card lc sp-rows-card" aria-label="Rows" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${S("layers")}</span><span class="lc-title">Rows</span>
      ${n===void 0?f:o`<span class="lc-sub">${ae(e.length,"row","rows")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-row ${r?"on":""}" aria-label="Add row" ?disabled=${t.busy||n===void 0}
        title="Add an entity, a group count, a dynamic list or a header" @click=${()=>Vn(t)}>${S("plus")}<span>Add</span></button>
    </div>
    ${a}
  </section>`}var ke={small:{row:10,compact:9,icon:14},medium:{row:12,compact:10,icon:16},large:{row:14,compact:12,icon:18}},kn={regular:400,medium:500,semibold:600,bold:700},nn={default:"-apple-system, system-ui, 'SF Pro Text', 'Helvetica Neue', sans-serif",rounded:"ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, monospace",serif:"ui-serif, 'New York', Georgia, serif"},an={ultraThin:.1,thin:.13,regular:.16,thick:.2,ultraThick:.24};function Bn(t){let n=e=>{let s=Ke().find(i=>i.key===e);return qe(t,s)};return{rowStyle:String(n("rowStyle")),textSize:String(n("textSize")),fontWeight:String(n("fontWeight")),fontDesign:String(n("fontDesign")),rowSpacing:Number(n("rowSpacing")),backgroundMaterial:String(n("backgroundMaterial")),columnLayout:String(n("columnLayout")),showDividers:n("showDividers")===!0,iconPosition:String(n("iconPosition")),horizontalPadding:Number(n("horizontalPadding"))}}function it(t){return Z[t]??Z.secondary}function xn(t,n){return t.rowStyle==="pillFilled"?`background:color-mix(in srgb, ${n} 15%, transparent);`:t.rowStyle==="pillOutline"?`box-shadow:inset 0 0 0 0.75px color-mix(in srgb, ${n} 40%, transparent);`:""}function xe(t,n,e,s,i){let a=it(e.color);return o`<span class="sp-w-icon" style=${`width:${s*i}px`}>${nt(t,e.icon,Math.round(s*.8*i),a)}</span>`}function rn(t,n,e,s){let i=t.scale,a=ke[n.textSize]??ke.medium,r=s!==void 0&&F(s,e.rowId),d=()=>oe(t,e.rowId);if(e.kind==="sectionHeader")return o`<div class="sp-w-header ${r?"on":""}" style=${`font-size:${9*i}px;text-align:${e.align==="center"?"center":e.align==="trailing"?"right":"left"}`}
      @click=${d}>${e.label}</div>`;let c=it(e.color),l=n.rowStyle==="plain";return o`<div class="sp-w-row ${r?"on":""}" title=${e.entityId??e.label}
    style=${`gap:${6*i}px;font-size:${a.row*i}px;font-weight:${kn[n.fontWeight]??400};padding:${l?0:4*i}px ${l?0:8*i}px;border-radius:${6*i}px;${xn(n,c)}`}
    @click=${d}>
    ${n.iconPosition==="leading"?xe(t,n,e,a.icon,i):f}
    <span class="sp-w-label">${e.label}</span>
    <span class="sp-w-value" style=${`color:${c}`}>${e.value}</span>
    ${n.iconPosition==="trailing"?xe(t,n,e,a.icon,i):f}
  </div>`}function on(t,n,e,s){let i=t.scale,a=ke[n.textSize]??ke.medium,r=s!==void 0&&F(s,e.rowId),d=it(e.color),c=n.rowStyle==="plain";return o`<div class="sp-w-cell ${r?"on":""}" title=${e.label}
    style=${`gap:${3*i}px;font-size:${a.compact*i}px;font-weight:${kn[n.fontWeight]??400};padding:${c?0:3*i}px ${c?0:6*i}px;border-radius:${6*i}px;${xn(n,d)}`}
    @click=${()=>oe(t,e.rowId)}>
    ${n.iconPosition==="leading"?xe(t,n,e,a.icon,i):f}
    <span class="sp-w-value" style=${`color:${d}`}>${e.value}</span>
    ${n.iconPosition==="trailing"?xe(t,n,e,a.icon,i):f}
  </div>`}function dn(t){return o`<div class="sp-w-divider" style=${`height:${Math.max(1,.5*t)}px`}></div>`}function Pn(t){let{width:n,height:e}=t.screen,s=t.scale,i=H(t),a=re(t),r=a===void 0?void 0:X(a),d;if(i===void 0)d=o`<p class="sp-w-empty">No status page.</p>`;else{let l=Bn(i),h=vs(i,t.hass.states),p=l.columnLayout==="twoColumn"?ms(h).map((u,v,m)=>o`${u.kind==="header"?rn(t,l,u.row,r):o`<div class="sp-w-pair" style=${`gap:${8*s}px`}>${on(t,l,u.first,r)}${u.second===void 0?o`<span class="sp-w-cell sp-w-spacer"></span>`:on(t,l,u.second,r)}</div>`}
          ${l.showDividers&&v<m.length-1?dn(s):f}`):h.map((u,v)=>o`${rn(t,l,u,r)}${l.showDividers&&v<h.length-1?dn(s):f}`),g=an[l.backgroundMaterial]??an.regular;d=o`<div class="sp-w-scroll" style=${`padding:${30*s}px ${6*s}px ${12*s}px;gap:${12*s}px`}>
      <div class="sp-w-card" style=${`padding:${8*s}px ${(6+l.horizontalPadding)*s}px;border-radius:${14*s}px;background:rgba(255,255,255,${g});font-family:${nn[l.fontDesign]??nn.default}`}>
        <div class="sp-w-rows" style=${`gap:${l.rowSpacing*s}px;padding:${4*s}px 0`}>
          ${h.length===0?o`<span class="sp-w-none" style=${`font-size:${11*s}px`}>${Y(i).length===0?"Add entities":"Nothing to show now"}</span>`:p}
        </div>
      </div>
      <div class="sp-w-done" style=${`font-size:${15*s}px;padding:${12*s}px 0;border-radius:${20*s}px`}>Done</div>
    </div>`}let c=o`<div class="sp-screen" role="group" aria-label="Status page on the watch"
    style=${`width:${Math.round(n*s)}px;min-height:${Math.round(e*s)}px`}>${d}</div>`;return as({width:n,height:e},s,c,"Status page on the watch")}function Tn(t){let n=H(t);if(n===void 0)return[];let e=Y(n),s=e.filter(i=>i.isHidden===!0).length;return[ae(e.length,"row","rows")+(s>0?`, ${s} hidden`:"")]}function _n(t,n){return ds(t.uiState,U,n)}function Jn(t,n){cs(t.uiState,U,n,!_n(t,n)),t.requestUpdate()}var Gn={row:{color:B.content,icon:"content"},add:{color:B.content,icon:"plus"},page:{color:B.place,icon:"text"},style:{color:B.look,icon:"look"}};function Pe(t,n,e,s,i,a={}){let r=_n(t,e),d=Gn[n];return Tt({color:d.color,icon:S(d.icon),title:s,open:r,onToggle:()=>Jn(t,e),...a.summary===void 0||a.summary===""?{}:{summary:a.summary},dot:a.dot===!0,id:`${U}:${e}`},r?i:o``)}function Zn(t){return ie(t)!==void 0?[{module:U,section:"add"}]:re(t)!==void 0?[{module:U,section:"row"},{module:U,section:"style"}]:[{module:U,section:"page"},{module:U,section:"style"}]}function Rn(t,n,e,s,i){let a=`${n}:q`,r=String(t.uiState.get(a)??"").trim().toLowerCase(),d=new Set(s),c=e.filter(p=>r===""||p.toLowerCase().includes(r)||ne(t.hass,p).toLowerCase().includes(r)),l=[...c.filter(p=>d.has(p)),...c.filter(p=>!d.has(p))],h=l.slice(0,200);return o`<div class="sp-pick">
    <input type="search" class="sp-pick-q" placeholder="Search entities" aria-label="Search entities" .value=${String(t.uiState.get(a)??"")}
      @input=${p=>{t.uiState.set(a,p.target.value),t.requestUpdate()}} />
    <div class="sp-pick-list" role="group" aria-label="Entities">
      ${h.length===0?o`<div class="sp-pick-none">${e.length===0?"No entity of this kind in Home Assistant.":"No entity matches."}</div>`:f}
      ${h.map(p=>o`<label class="sp-pick-row">
        <input type="checkbox" .checked=${d.has(p)} ?disabled=${t.busy}
          @change=${g=>i(p,g.target.checked)} />
        <span class="sp-pick-name">${ne(t.hass,p)}</span><code>${p}</code>
      </label>`)}
      ${l.length>h.length?o`<div class="sp-pick-none">${l.length-h.length} more. Search to narrow the list.</div>`:f}
    </div>
  </div>`}function Yn(t,n,e){let s=I(n),i=X(e),a=N(e),r=(u,v,m)=>t.edit(b=>j(b,s,i,u,v),m),d=a.rowType==="sectionHeader",c=a.rowType==="groupCount"||a.rowType==="dynamicList",l=a.rowType==="dynamicList"&&a.dynamicMode==="all",h=a.rowType==="groupCount"||a.rowType==="dynamicList"&&!l,p=[];if(p.push(M("Visibility",a.isHidden===!0?"hidden":"visible",[["visible","Visible"],["hidden","Hidden"]],u=>r("isHidden",u==="hidden"))),p.push(Oe("Label",a.displayName,u=>r("displayName",u,`row:${i}:label`),{placeholder:"Display Name"})),d?p.push(M("Alignment",a.headerAlignment??"leading",Q("HeaderAlignment"),u=>r("headerAlignment",u))):p.push(o`<div class="ts-stack">${Kt({icons:t.icons,symbols:t.symbols},a.iconName,u=>r("iconName",u,`row:${i}:icon`),`sp:icon:${i}`,void 0,"Icon",!1)}</div>`),a.rowType==="entity"&&p.push(o`<div class="ts-stack">${Ae({hass:t.hass},"Entity",gn(t.hass,a.entityId),u=>{let v=u.entityId.trim();v!==""&&t.edit(m=>{let b=j(m,s,i,"entityId",v),x=ve(v,t.hass.states);return b=j(b,s,i,"domain",x.domain),a.iconName===ve(a.entityId).iconName&&(b=j(b,s,i,"iconName",x.iconName)),b})},`sp:entity:${i}`,{clearable:!1})}</div>`),c&&a.domain!=="sensor"){let u=hs(a.domain,a.deviceClassFilter);if(u.length>=2){let v=ps(a),m=u.map(b=>[b.value,b.label]);m.some(([b])=>b===v)||m.push([v,gs(v)]),p.push(M("Show State",v,m,b=>r("filterState",b)))}}if(a.rowType==="dynamicList"&&(p.push(M("Entities",l?"all":"specific",Q("DynamicMode"),u=>r("dynamicMode",u))),p.push(Ee("Show all states",a.showAllStates===!0,u=>r("showAllStates",u?!0:void 0),!1)),p.push(o`<div class="hint ts-under">On: every entity is listed whatever its state. Off: only those in the state above.</div>`)),a.domain==="sensor"&&(a.rowType==="groupCount"||l)&&(p.push(Ft(fs(a.deviceClassFilter),a.maxNumericValue,u=>r("maxNumericValue",u,`row:${i}:max`),{optional:!0,placeholder:"No limit",def:null})),p.push(o`<div class="hint ts-under">Only states at or below it count. Empty is no limit.</div>`)),c){let u=a.deviceClassFilter??[],v=Hs(a.domain,t.hass.states,u),m=b=>{let x=N(me(Fe(t.document,s),i)??e).deviceClassFilter??[],E=x.includes(b)?x.filter(C=>C!==b):[...x,b];r("deviceClassFilter",E.length===0?void 0:E)};p.push(o`<div class="field sp-classes"><span>Device classes</span>
      <div class="sp-chips" role="group" aria-label="Device classes">
        ${v.length===0?o`<span class="hint">None reported for ${a.domain===""?"this row":a.domain}.</span>`:f}
        ${v.map(b=>{let x=u.includes(b);return o`<button type="button" class="pe-chip ${x?"on":""}" aria-pressed=${x?"true":"false"} ?disabled=${t.busy}
            @click=${()=>m(b)}>${b.replaceAll("_"," ")}</button>`})}
      </div></div>
      <div class="hint ts-under">${u.length===0?"None picked: every class counts.":"Only entities of these classes count."}</div>`)}if(h){let u=a.groupEntityIds??[],v=Es(e,t.hass.states);p.push(o`<div class="field sp-entities-field"><span>Edit Entities (${u.length})</span></div>
      ${Rn(t,`sp:ents:${i}`,v,u,(m,b)=>{let x=N(me(Fe(t.document,s),i)??e).groupEntityIds??[],E=b?x.includes(m)?x:[...x,m]:x.filter(C=>C!==m);r("groupEntityIds",E)})}`)}let g=o`<fieldset class="sp-body" ?disabled=${t.busy} aria-label="Row">${p}</fieldset>`;return o`${Pe(t,"row","row",mn(a.rowType),g,{summary:tt(e)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Remove this row from the page"
        @click=${()=>t.edit(u=>Be(u,s,i))}>${S("delete")}<span>Remove</span></button>
    </div>`}function Xn(t,n,e,s){let i=qe(e,s),a=(r,d)=>t.edit(c=>xs(c,n,s.key,r),d);switch(s.kind){case"switch":return o`${Ee(s.label,i===!0,r=>a(r),s.default)}
        ${s.help===void 0?f:o`<div class="hint ts-under">${s.help}</div>`}`;case"slider":return Vt(s.label,Number(i),r=>a(r,`style:${n}:${s.key}`),{min:s.min??0,max:s.max??1,step:s.step??1,def:Number(s.default),...s.unit===void 0?{}:{unit:s.unit}});default:{let r=Ne.types.page.keys[s.key]?.enum??"",d=Q(r);return d.length<=4?M(s.label,String(i),d,c=>a(c),{def:String(s.default)}):jt(s.label,String(i),d,c=>a(c),{def:String(s.default),snapBack:!0})}}}function cn(t,n){let e=I(n),s=Ts(n);return Pe(t,"style","style","Style",o`<fieldset class="sp-body" ?disabled=${t.busy} aria-label="Style">
    ${Ke().map(i=>Xn(t,e,n,i))}
    <div class="sp-acts">
      <button type="button" class="pe-btn" ?disabled=${t.busy||!s} @click=${()=>t.edit(i=>Ps(i,e))}>
        ${S("reset")}<span>Reset to Defaults</span></button>
    </div>
  </fieldset>`,{summary:s?"Changed":"Defaults",dot:s})}function Qn(t,n){let e=I(n),s=z(n);return Pe(t,"page","page","Page",o`<fieldset class="sp-body" ?disabled=${t.busy} aria-label="Page">
    ${Oe("Name",s,i=>t.edit(a=>ks(a,e,i),`page:${e}:name`),{placeholder:"Page Name"})}
    ${je(n)?o`<div class="hint ts-under">One of the app's starter pages. It is edited and deleted like any other.</div>`:f}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Delete this status page"
        @click=${()=>t.edit(i=>Ve(i,e))}>${S("delete")}<span>Delete page</span></button>
    </div>
  </fieldset>`,{summary:s})}function ei(t,n,e,s){let i=ge(n.domain,"on");return o`<button type="button" class="sp-preset ${e?"on":""}" aria-pressed=${e?"true":"false"} ?disabled=${t.busy} @click=${s}>
    <span class="sp-preset-glyph">${nt(t,n.icon,18,i===Z.secondary?"#5B8FD4":i)}</span>
    <span class="sp-preset-label">${n.label}</span>
  </button>`}function ti(t,n,e){let s=c=>$e(t,{...e,...c}),i=t.uiState.get(se),a=[["entity","Entity"],["groupCount","Group Count"],["dynamicList","Dynamic List"],["header","Header"]],r=M("Add",e.kind,a,c=>{if(c==="header"){Se(t,_s());return}t.uiState.delete(se),s({kind:c,preset:void 0,picked:[],mode:"all"})}),d;if(e.kind==="entity"){let c=Number(t.uiState.get(`${A}:n`)??0)||0;d=o`<div class="ts-stack">${Ae({hass:t.hass},"Entity",gn(t.hass,""),l=>{let h=l.entityId.trim();if(h==="")return;t.uiState.set(`${A}:n`,c+1);let p=H(t);if(p!==void 0&&Ds(p,h)){t.uiState.set(se,`${ne(t.hass,h)} is on this page already.`),t.requestUpdate();return}Se(t,ve(h,t.hass.states),!0),t.uiState.set(se,`Added ${ne(t.hass,h)}.`),t.requestUpdate()},`sp:add:entity:${c}`,{clearable:!1})}</div>
      <div class="hint">Each entity is one row. Pick another to add it too.</div>`}else{let c=e.kind==="groupCount"?Is():Ls(),l=e.preset===void 0?void 0:c[e.preset],h=e.kind==="groupCount"||e.mode==="specific",p=e.kind==="groupCount"?"Counts how many of the entities you pick are in a state.":"Pick what to show. Each matching entity becomes its own row. You can switch to hand-picked entities after adding.",g=o`<div class="sp-presets" role="group" aria-label=${e.kind==="groupCount"?"Group Count":"Dynamic List"}>
      ${c.map((v,m)=>ei(t,v,e.preset===m,()=>{if(!h){Se(t,We(v));return}s({preset:m,picked:[]})}))}
    </div>`,u=f;if(h&&l!==void 0){let v=e.kind==="groupCount"?l.picker==="deviceClass"?l.deviceClassFilter:void 0:l.deviceClassFilter,m=As(l.domain,v,t.hass.states);u=o`<div class="field sp-entities-field"><span>${l.label}: ${ae(e.picked.length,"entity","entities")} picked</span></div>
        ${Rn(t,`${A}:pick`,m,e.picked,(b,x)=>{let E=ie(t)??e,C=E.picked.filter(de=>de!==b);$e(t,{...E,picked:x?[...C,b]:C})})}
        <div class="sp-acts">
          <button type="button" class="pe-btn pe-primary" ?disabled=${t.busy}
            @click=${()=>{let b=(ie(t)??e).picked;Se(t,e.kind==="groupCount"?Rs(l,b):We(l,b))}}>
            ${S("plus")}<span>Add ${e.kind==="groupCount"?"group count":"dynamic list"}</span></button>
        </div>`}d=o`<p class="hint">${p}</p>
      ${e.kind==="dynamicList"?M("Entities",e.mode,Q("DynamicMode"),v=>s({mode:v,preset:void 0,picked:[]})):f}
      ${g}${u}`}return o`${Pe(t,"add","add","Add a row",o`<fieldset class="sp-body" ?disabled=${t.busy} aria-label="Add a row">
    ${r}${d}
    ${typeof i=="string"?o`<div class="hint sp-added" role="status">${i}</div>`:f}
  </fieldset>`,{summary:z(n)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn" @click=${()=>$e(t,void 0)}>Done</button>
    </div>`}function Cn(t){let n=H(t);if(n===void 0)return o`<div class="insp-head"><div class="crumbs"><span class="nm">No status page</span></div></div>
      <div class="insp-body"><p class="sp-note">Add a status page to edit it.</p></div>`;let e=z(n)||"Untitled page",s=re(t),i=ie(t),a=Zn(t),r=ls(t.uiState,a),d,c;if(i!==void 0)d=o`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>st(t)}>${e}</button><span class="sep">›</span><span class="nm">Add a row</span></div>`,c=ti(t,n,i);else if(s!==void 0){let l=N(s),h=l.displayName===""?"Display Name":l.displayName;d=o`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>oe(t,void 0)}>${e}</button><span class="sep">›</span><span class="kchip" style=${`--k:${yn(t,s)}`}>${mn(l.rowType)}</span><span class="nm" title=${h}>${h}</span></div>`,c=o`${Yn(t,n,s)}${cn(t,n)}`}else d=o`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">Page</span><span class="nm" title=${e}>${e}</span></div>`,c=o`${Qn(t,n)}${cn(t,n)}
      <p class="sp-note">Select a row to edit it, or add one.</p>`;return o`<div class="insp-head">
      ${d}
      <button class="expand" @click=${()=>{us(t.uiState,a,!r),t.requestUpdate()}}>${r?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${c}</div>`}var Dn=ue`
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
`;Ws({dirty:et,drop:tn});typeof window<"u"&&window.addEventListener("beforeunload",t=>{et()&&(t.preventDefault(),t.returnValue="")});var si=15e3,An=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),at=An?"\u2318":"Ctrl+",rt={min:200,max:720,middleMin:320},ot={left:280,right:340},dt="wrist-assistant-panel.status-pages.columns.v1",ni=24,On=820;function ct(t){return L(t).message}function lt(t){return L(t).code}function En(t){let{code:n,message:e}=L(t);return Object.assign(new Error(e),n===void 0?{}:{code:n})}function ii(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function ai(t){let n=t?Date.parse(t):NaN;return Number.isNaN(n)?"":wt(Math.max(0,(Date.now()-n)/1e3))}function ri(t){return t==="panel"?"Saved here":"From the watch"}function oi(t){return t instanceof HTMLElement?ss(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function di(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}var w=class extends pt{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=f;this.shellOwnsWatch=!1;this.phones=!1;this.unsupported=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.starting=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=pn();this.columns={...ot};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Jt(this);this.symbols=new Nt(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||this.load(e,!0)};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let s=e.composedPath();if(!s.includes(this)&&!di()||this.renderRoot.querySelector("dialog[open]"))return;let i=e.metaKey||e.ctrlKey,a=e.key.toLowerCase();if(i&&!e.altKey&&a==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(!oi(s[0])){if(i&&!e.altKey&&a==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&a==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!i&&!e.altKey){let r=this.viewHost();r!==void 0&&st(r)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let s=e.composedPath(),i=a=>s.some(r=>r instanceof HTMLElement&&r.classList.contains(a));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("sp-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(Ut,this.onScrubStart),this.addEventListener(zt,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return Dt(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get draft(){if(!(this.watchId===void 0||this.record===void 0||this.record.revision<=0))return q(this.watchId)}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Lt(dt,ot,rt),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++}willUpdate(e){if(this.hass){e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,ht(this.hass).then(a=>{this.ownList=a.owners},()=>{this.ownList=[]}));let i=Ht(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));i!==void 0&&this.openWatch(i)}this.followSave();let s=this.restoreAsk;s!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===s.entry.revision)&&this.closeAsk()}updated(){let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),Xt(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let s of e){if(s.target!==this){this.measureTop(s.target);continue}let i=s.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width),Math.abs(i.height-this.hostHeight)>=1&&(this.hostHeight=i.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let s=this.renderRoot?.querySelector(".pe-top")??void 0;s!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=s,s!==void 0&&e.observe(s))}measureTop(e){let s=e.offsetHeight;s!==this.topHeight&&(this.topHeight=s,this.style.setProperty("--pe-top-h",`${s}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let s=q(e)?.saveDone;if(s===void 0||s===this.followedSave)return;this.followedSave=s;let i=()=>this.saveEnded(e);s.then(i,i)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,s=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),s=!1),this.startSubscription(e),this.load(e,s)}async load(e,s=!1){let i=this.hass;if(!i)return;if(s&&this.holdReload){this.reloadPending=!0;return}let a=++this.loadSeq;this.stopPolling(),s||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let r=await pe(i,e,"status_pages");if(a!==this.loadSeq)return;if(s&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0}catch(r){if(a!==this.loadSeq)return;Vs(r)?(this.unsupported=!0,this.loadError=void 0):s||(this.loadError=ct(r)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let s=this.watchId;this.record=e;let i=e.revision>0?ys(e.document):void 0;if(s===void 0||i===void 0)return;let a=this.restartDraft;a!==void 0&&a.watchId===s&&e.revision>=a.revision&&(this.restartDraft=void 0,(q(s)?.dirty??!1)||be(s));let r=en(s,i,e.revision);r.kept.length>0?this.note={kind:"warn",text:ye(r.kept)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The status pages changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let s=this.hass;if(!s||this.historyState==="unsupported")return;let i=++this.historySeq;try{let a=await ft(s,e,"status_pages");if(i!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(a?.entries)?a.entries:[],this.historyState="ready"}catch(a){if(i!==this.historySeq||e!==this.watchId)return;this.historyState=lt(a)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let s=this.hass;if(this.endSubscription(),!s)return;let i=++this.subscribeSeq;vt(s,e,a=>{i===this.subscribeSeq&&a.kind==="status_pages"&&a.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(a=>{i===this.subscribeSeq?this.unsubscribe=a:a().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Ct(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},si))}async poll(){this.pollTimer=void 0;let e=this.hass,s=this.watchId,i=this.record;if(!(!e||s===void 0||i===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let a=await pe(e,s,"status_pages");if(s!==this.watchId||this.record!==i)return;a.revision===i.revision?this.record={...i,delivered_revision:a.delivered_revision,delivered_at:a.delivered_at,rejected_revision:a.rejected_revision,rejected_at:a.rejected_at,rejected_reason:a.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(a),this.loadHistory(s))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,s){let i=this.draft;if(!i||this.saving)return!1;let a=i.apply(e(i.document),this.scrubKey??s);return this.requestUpdate(),a}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??ts,s=this.iconMemo;if(s!==void 0&&s.provider===e&&s.tick===this.iconsTick)return s.icons;let i=ns(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:i},i}screen(){let e=this.watches.find(s=>s.owner_watch_id===this.watchId);return(De(e?.screen_size)??Ce).screen}viewHost(){let e=this.draft,s=this.hass;if(e===void 0||s===void 0)return;let i=this;return{hass:s,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,get document(){return e.document},get busy(){return i.saving},edit:(a,r)=>this.draft===e&&this.edit(a,r),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,s=this.watchId;this.endScrub();let i=this.draft;if(!e||s===void 0||!i||this.saving||!i.dirty)return;this.note=void 0;let a=Xs(i,{save:(d,c)=>Te(e,s,"status_pages",d,c).catch(l=>{throw En(l)}),fetch:async()=>{let d=await pe(e,s,"status_pages").catch(c=>{throw En(c)});return{revision:d.revision,document:d.document}}});this.followedSave=i.saveDone,this.requestUpdate();let r=await a.catch(d=>({ok:!1,revision:i.revision,merged:!1,code:lt(d)??"unknown",message:ct(d)}));this.saveEnded(s),s===this.watchId&&(this.note=sn(r))}async start(e){let s=this.hass,i=this.watchId;if(!s||i===void 0||this.starting)return;this.starting=!0,this.note=void 0;let a=await Qs(e?bs():ws(),(r,d)=>Te(s,i,"status_pages",r,d));if(this.starting=!1,i===this.watchId){if(a.ok)this.note={kind:"ok",text:`${e?"Started with an empty list":"Started with the defaults"}. The watch picks them up the next time it checks.`};else if(a.code==="no_record"){this.note={kind:"warn",text:`${Fs} Go to Watch app, Settings, Pair a device.`};return}else if(a.code==="conflict")this.note={kind:"warn",text:"Status pages arrived meanwhile, so those are shown."};else if(a.code==="unsupported"){this.unsupported=!0;return}else{this.note={kind:"err",text:`Could not start: ${a.message}`};return}this.load(i,!0)}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let s=this.hass,i=this.watchId,a=this.record;if(!s||i===void 0||a===void 0||this.draft?.dirty)return;let r={entry:e,baseRevision:a.revision};this.restoreAsk=r,gt(s,i,"status_pages",e.revision).then(d=>{this.restoreAsk===r&&(this.restoreAsk={...r,summary:Ns(d.document)})},()=>{})}async restore(){let e=this.hass,s=this.watchId,i=this.restoreAsk;if(!e||s===void 0||i===void 0||this.restoring)return;this.restoring=!0;let a;try{let r=await mt(e,s,"status_pages",i.entry.revision,i.baseRevision);a={kind:"ok",text:`Revision ${i.entry.revision} is back.`},s===this.watchId?this.restartDraft={watchId:s,revision:r.revision}:(q(s)?.dirty??!1)||be(s)}catch(r){let d=lt(r);d==="conflict"?a={kind:"warn",text:"Not restored. The status pages changed somewhere else, so the newest copy is shown."}:d==="no_record"?a={kind:"warn",text:"Not restored. Home Assistant no longer holds status pages for this watch."}:d==="not_found"?a={kind:"warn",text:"Not restored. That save is no longer kept."}:d==="unknown_command"?(this.historyState="unsupported",a={kind:"warn",text:"This version of the integration cannot restore status pages. Update it to restore an earlier save."}):a={kind:"err",text:`Could not restore: ${ct(r)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}s===this.watchId&&(this.note=a,this.load(s,!0))}render(){let e=this.watches,s=this.draft;return o`
      <div class="pe-top">
        ${this.renderTopBar(s,e)}
        ${this.note?o`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:f}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):f}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=On}renderTopBar(e,s){let i=e!==void 0&&!this.unsupported,a=i&&this.dirty;return o`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Watch status pages">
      ${this.haMenu?o`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${S("menu")}</button>`:f}
      ${this.shellOwnsWatch?f:o`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Ks(void 0,!1)}>${S("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?f:this.renderWatchPicker(s)}
      ${this.renderSyncPill(i?e:void 0)}
      ${this.renderTopMenu(i?e:void 0)}
      ${i?o`<button class="primary save ${a?"dirty":""}" ?disabled=${!a||this.saving}
          title=${a?`Save (${at}S). A save reaches the watch the next time it checks.`:`Nothing to save (${at}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        <span class="tb-saved" title=${a?"Unsaved changes":""}>${Bt(this.record)}</span>`:f}
      ${this.barActions}
      <button class="help" title="Help: status pages" aria-label="Help"
        @click=${()=>window.open(qs,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(e){let s=this.record;if(s===void 0||s.revision<=0||this.unsupported)return f;let i=e===void 0?{size:0,limit:1}:Ue(e.document),a=He({record:s,size:i.size,limit:i.limit,noun:"status pages",historyState:this.historyState});return o`<span class="tb-sync ${a.tone==="ok"?"ok":"warn"}" title=${`${a.state}. ${a.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${a.state}</span>
    </span>`}noRecordState(e=this.watches){return Ot(e.find(s=>s.owner_watch_id===this.watchId))}canStart(){let e=this.record;return this.watchId!==void 0&&e!==void 0&&e.revision<=0&&!this.unsupported}renderTopMenu(e){let s=this.canStart();if(e===void 0&&!s)return f;let i=this.topMenuOpen,a=r=>()=>{this.topMenuOpen=!1,r()};return o`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${i?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!i}}>···</button>
      ${i?o`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?o`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${a(()=>this.discard())}>Discard edits</button>`:f}
        ${s?o`<button class="row" role="menuitem" ?disabled=${this.starting}
          @click=${a(()=>{fe(this.noRecordState())&&this.start(!1)})}>${Je}</button>
          <button class="row" role="menuitem" ?disabled=${this.starting}
          @click=${a(()=>{fe(this.noRecordState())&&this.start(!0)})}>${Ge}</button>`:f}
      </div>`:f}
    </span>`}personColor(e){let s=qt(this.owners.length>0?this.owners:this.ownList??[]);return Wt(s.findIndex(i=>i.owners.some(a=>a.owner_watch_id===e)))}renderWatchPicker(e){if(e.length<2)return f;let s=e.find(r=>r.owner_watch_id===this.watchId),i=this.watchMenuOpen,a=r=>{let d=r===void 0?void 0:this.personColor(r);return o`<span class="pe-chip-glyph" style=${d?`--pe-person: ${d}`:f} aria-hidden="true">${S("watch")}</span>`};return o`<span class="picker sp-watch-picker">
      <button type="button" class="tb-browse sp-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose status pages are shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${a(s?.owner_watch_id)}<span class="tb-browse-l">${s?he(s,e):"Choose a watch"}</span>
        <span class="sp-caret" aria-hidden="true">${S("chevron")}</span>
      </button>
      ${i?o`<div class="pop-menu sp-watch-menu" role="menu" aria-label="Watches">
        ${e.map(r=>{let d=r.owner_watch_id===this.watchId;return o`<button type="button" class="row sp-watch-row" role="menuitemradio" aria-checked=${d?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,d||this.openWatch(r.owner_watch_id)}}>
            ${a(r.owner_watch_id)}<span class="sp-watch-name">${he(r,e)}</span>
            <span class="sp-watch-check" aria-hidden="true">${d?S("check"):f}</span>
          </button>`})}
      </div>`:f}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=On?this.columns:It(this.hostWidth-ni,this.columns,rt)}renderGutter(e){return o`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the pages and rows column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${s=>{let i=this.fittedColumns();Mt(s,{side:e,base:e==="left"?i.left:i.right,limits:rt,onWidth:a=>{this.columns={...this.columns,[e]:a}},onEnd:()=>Re(dt,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:ot[e]},Re(dt,this.columns)}}></div>`}get stageScale(){return this.zoom??Ie(this.narrow||this.stacked)}setZoom(e){this.zoom=e,hn(e)}renderStage(e,s){let i=s.find(u=>u.owner_watch_id===this.watchId),r=De(i?.screen_size)??Ce,d=[...Tn(e),r.label],c=H(e),l=c===void 0?"Status pages":z(c)||"Untitled page",h=this.draft,p=this.stageScale,g=Ie(this.narrow||this.stacked);return o`<div class="card canvas-card sp-canvas" aria-label="Status page">
      <div class="cv-head">
        <span class="cv-title" title=${l}>${l}</span>
        ${i!==void 0?o`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${he(i,s)}</span></span>`:f}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${d.join(" \xB7 ")}><span class="fam">${d.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!h?.canUndo} title=${`Undo (${at}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${S("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!h?.canRedo} title=${An?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${S("redo")}</button>
        </span>
      </div>
      <div class="stage-area sp-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <button class="tb sp-case" aria-disabled="true" tabindex="-1" title=${`This watch's screen, ${r.label}.`}>
            ${S("watch")}<span class="word keep">${r.label}</span></button>
          <span class="tb-sep" aria-hidden="true"></span>
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${p<=Me(p)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(Me(p))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${G(p)}. Back to fit`}
              title=${`The watch at ${G(p)} of its own points. Click to fit it again (${G(g)}).`}
              @click=${()=>this.setZoom(void 0)}>${G(p)}</button>
            <button class="tb icon" ?disabled=${p>=Le(p)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(Le(p))}>+</button>
          </span>
        </div>
        <div class="sp-stage-body">${Pn(e)}</div>
        <div class="under"><span class="tail">${fn}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0){let c=this.owners.length===0&&this.ownList===void 0;return o`<div class="pe-empty">${c?"Loading\u2026":"No watch has connected to this Home Assistant yet."}</div>`}if(this.unsupported)return o`<div class="pe-empty"><b>${js}</b></div>`;if(this.loading)return o`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let c=this.watchId;return o`<div class="pe-empty">
        <span>Could not read this watch's status pages: ${this.loadError}</span>
        ${c===void 0?f:o`<button class="pe-btn" @click=${()=>{this.load(c)}}>Try again</button>`}
      </div>`}let s=this.record;if(s===void 0)return o`<div class="pe-empty">Loading…</div>`;let i=this.draft,a=this.viewHost();if(s.revision<=0||i===void 0||a===void 0){let c=this.watchId===void 0?void 0:q(this.watchId),l=this.watchId,h=this.noRecordState(e);return o`<div class="pe-empty"><b>${Us}</b><span>${At(h,zs)}</span>
        ${h==="wait"?o`<button class="link start-fresh" ?disabled=${this.starting} @click=${()=>{fe(h)&&this.start(!1)}}>${this.starting?"Starting\u2026":Et}</button>`:o`<span class="sp-start">
              <button class="pe-btn pe-primary" ?disabled=${this.starting} @click=${()=>{this.start(!1)}}>${this.starting?"Starting\u2026":Je}</button>
              <button class="pe-btn" ?disabled=${this.starting} @click=${()=>{this.start(!0)}}>${Ge}</button>
            </span>
            <span class="pe-muted">The defaults are the app's five pages: Lights, Who's Home, Room Temps, Doors & Windows and Low Battery.</span>`}
        ${c?.dirty&&l!==void 0?o`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when status pages are here again.</span>
          <button class="pe-btn" @click=${()=>{be(l),this.requestUpdate()}}>Discard the kept edits</button>`:f}
      </div>`}let r=this.fittedColumns(),d=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"";return o`<div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${r.left}px;--wa-right:${r.right}px;${d}`}>
      <div class="column left">
        ${Sn(a)}
        ${$n(a)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(a,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Cn(a)}
      </div>
    </div>
    ${this.renderFoot(s,i.document,i.dirty)}`}renderFoot(e,s,i){let a=Ue(s),r=He({record:e,size:a.size,limit:a.limit,noun:"status pages",historyState:this.historyState}),d=this.watchId;return o`${Gt({status:r,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Zt({noun:"status pages",record:e,entries:this.history,historyState:this.historyState,dirty:i,restoring:this.restoring,onRetry:()=>{d!==void 0&&(this.historyState="loading",this.loadHistory(d))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):f}
    ${this.rawOpen?Yt({noun:"status pages",document:s,revision:e.revision,dirty:i,copied:this.rawCopied,onCopy:c=>{Qt(c).then(l=>{this.rawCopied=l})},onClosed:()=>{this.rawOpen=!1}}):f}`}renderRestoreAsk(e){let s=this.record,i=ai(e.entry.updated_at);return o`<dialog class="pe-ask" aria-labelledby="sp-ask-title"
      @cancel=${a=>{this.restoring&&a.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="sp-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${ri(e.entry.updated_by)}${i?` ${i}`:""}, ${ii(e.entry.size)}.</p>
      ${e.summary?o`<p class="pe-muted">${e.summary}</p>`:f}
      <p>It is saved again as a new revision${s?`, after revision ${s.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[_t,bt,yt,St,$t,kt,xt,Pt,rs,ue`
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
  `,Dn,es]}};y([T({attribute:!1})],w.prototype,"hass",2),y([T({attribute:!1})],w.prototype,"owners",2),y([T({attribute:!1})],w.prototype,"ownerId",2),y([T({type:Boolean,reflect:!0})],w.prototype,"narrow",2),y([T({attribute:!1})],w.prototype,"icons",2),y([T({attribute:!1})],w.prototype,"iconsTick",2),y([T({attribute:!1})],w.prototype,"haMenu",2),y([T({attribute:!1})],w.prototype,"onHaMenu",2),y([T({attribute:!1})],w.prototype,"onBack",2),y([T({attribute:!1})],w.prototype,"barActions",2),y([T({attribute:!1})],w.prototype,"shellOwnsWatch",2),y([T({attribute:!1})],w.prototype,"phones",2),y([k()],w.prototype,"watchId",2),y([k()],w.prototype,"record",2),y([k()],w.prototype,"unsupported",2),y([k()],w.prototype,"loading",2),y([k()],w.prototype,"loadError",2),y([k()],w.prototype,"history",2),y([k()],w.prototype,"historyState",2),y([k()],w.prototype,"note",2),y([k()],w.prototype,"restoreAsk",2),y([k()],w.prototype,"restoring",2),y([k()],w.prototype,"starting",2),y([k()],w.prototype,"historyOpen",2),y([k()],w.prototype,"rawOpen",2),y([k()],w.prototype,"rawCopied",2),y([k()],w.prototype,"ownList",2),y([k()],w.prototype,"topMenuOpen",2),y([k()],w.prototype,"watchMenuOpen",2),y([k()],w.prototype,"zoom",2),y([k()],w.prototype,"columns",2),y([k()],w.prototype,"hostWidth",2),y([k()],w.prototype,"hostHeight",2);customElements.get("wa-status-pages-editor")||customElements.define("wa-status-pages-editor",w);export{dt as SP_COLUMNS_KEY,w as WaStatusPagesEditor};
