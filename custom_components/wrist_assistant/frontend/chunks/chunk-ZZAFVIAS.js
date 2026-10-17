import{$ as rt,A as E,B as ue,C as Q,D as ge,G as Ke,H as Ge,I as Be,J as Ye,K as z,L as I,M as O,N as me,O as Ze,P as Xe,Q as ee,R as Qe,S as et,T as fe,U as tt,V as nt,W as we,X as st,Y as D,Z as at,_ as it,aa as ot,ba as lt,g as T,h as ze,i as Ue,j as je,k as We,l as _,m as Z,n as qe,o as Je,p as X,ta as dt,u as pe,v as x,w as A,y as F,z as V}from"./chunk-TK6EMFFT.js";import{f as gt,g as mt,k as ft,m as wt,r as bt}from"./chunk-NHJML2E3.js";import{b as ct,c as pt,g as ut}from"./chunk-GAZBOTEC.js";import{o as Le,w as Ne,x as _e,y as Fe,z as Ve}from"./chunk-PEI2F5V4.js";import{c as re}from"./chunk-ZOJGMATP.js";import{c as Oe}from"./chunk-GR4P77YP.js";import{Pb as oe,Sb as le,Tb as Ce,Ub as He,Vb as R,Wb as Ae,X as Ee,Yb as de,ec as ce,gc as Ie}from"./chunk-36K6KTYI.js";import{Q as Me,r as De}from"./chunk-ESIOP3D4.js";import{b as Y,d as r,g as b,mh as H,nh as v,zh as Te}from"./chunk-E5S2SHQS.js";function kt(e,t){e.deletePage!==void 0?e.deletePage(t):e.edit(n=>Ge(n,t))}var C="status-pages",ve="sp:page",M="sp:row",k="sp:add",U="sp:drag",W="sp:added",Pt="wrist-assistant-panel.status-pages.zoom.v1";function In(e=re()){try{let t=e?.getItem(Pt),n=t==null||t===""?NaN:Number(t);return Le.includes(n)?n:void 0}catch{return}}function On(e,t=re()){try{t?.setItem(Pt,e===void 0?"":String(e))}catch{}}var jt="Pages the watch opens from a tile, a menu slot or Siri. A save reaches the watch the next time it checks.",Dn="Drawn from Home Assistant's states now, as the watch draws the page. Tap a row to edit it.";function K(e,t,n){return`${e} ${e===1?t:n}`}function q(e,t){let n=e.states[t]?.attributes?.friendly_name;return typeof n=="string"&&n.trim()!==""?n:t}function Rt(e,t){let n=t.indexOf(".");return{entityId:t,displayName:t===""?"":q(e,t),domain:n<0?"":t.slice(0,n)}}function Wt(e){switch(e){case"battery_charging":return"charging";case"illuminance":return"light";case"occupancy":case"presence":return"occupancy";case"garage_door":case"garage":return"garage";case"carbon_monoxide":return"CO";default:return e.replaceAll("_"," ")}}function qt(e,t){if(t!==void 0&&t.length>0){let n=t.map(Wt),s=n.length===1?n[0]:n.slice(0,2).join("/");return e==="sensor"||e==="binary_sensor"?`${s} sensors`:e==="cover"?s.includes("garage")?"garage doors":`${s} covers`:`${s} ${e}s`}return e==="person"?"people":e==="binary_sensor"?"binary sensors":`${e}s`}function he(e){let t=T(e),n=s=>`${s} ${s===1?"entity":"entities"}`;switch(t.rowType){case"entity":return t.entityId;case"groupCount":return`${n(t.groupEntityIds?.length??0)} \xB7 group count`;case"dynamicList":return t.dynamicMode==="all"?`all ${qt(t.domain,t.deviceClassFilter)} \xB7 dynamic list`:`${n(t.groupEntityIds?.length??0)} \xB7 dynamic list`;case"sectionHeader":return"section header";default:return t.rowType}}function Tt(e){return X.labels.StatusRowType?.[e]??e}function P(e){let t=pe(e.document),n=e.uiState.get(ve);return(typeof n=="string"?t.find(s=>E(x(s),n)):void 0)??t[0]}function Et(e,t){e.uiState.set(ve,t),e.uiState.delete(M),e.uiState.delete(k),e.requestUpdate()}function G(e){let t=e.uiState.get(M);return typeof t=="string"?Q(P(e),t):void 0}function B(e,t){t===void 0?e.uiState.delete(M):e.uiState.set(M,t),e.uiState.delete(k),e.requestUpdate()}function Jt(e){return G(e)===void 0&&!e.uiState.has(k)?!1:(e.uiState.delete(M),e.uiState.delete(k),e.requestUpdate(),!0)}function J(e){let t=e.uiState.get(k);return typeof t=="object"&&t!==null?t:void 0}function ne(e,t){t===void 0?e.uiState.delete(k):(e.uiState.set(k,t),e.uiState.delete(M)),e.requestUpdate()}function Kt(e,t="entity"){e.uiState.delete(W),ne(e,{kind:t,mode:"all",picked:[]})}function te(e,t,n=!1){let s=P(e);if(s===void 0)return;let i=x(s),a;return e.edit(o=>{let l=tt(o,i,t);return a=l.id,l.document}),a!==void 0&&!n&&B(e,a),a}function Gt(e){let t;e.edit(n=>{let s=Ke(n);return t=s.id,s.document}),t!==void 0&&Et(e,t)}function Ct(e,t,n,s,i){return{start:a=>{e.uiState.set(U,{list:t,id:n}),a.dataTransfer?.setData("text/plain",n),a.dataTransfer&&(a.dataTransfer.effectAllowed="move")},over:a=>{e.uiState.get(U)?.list===t&&(a.preventDefault(),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))},drop:a=>{let o=e.uiState.get(U);e.uiState.delete(U),!(o?.list!==t||E(o.id,n))&&(a.preventDefault(),i(o.id,s))},end:()=>{e.uiState.delete(U)}}}function xe(e,t,n,s){return e.icons.render(t,n,s)??r`<span class="sp-glyph-dot" style=${`background:${s};width:${Math.max(4,n*.6)}px;height:${Math.max(4,n*.6)}px`}></span>`}function Ht(e,t,n){return r`<span class="thumb sp-thumb" style=${`--c:${n}`} aria-hidden="true"><span class="sp-thumb-glyph">${xe(e,t,14,n)}</span></span>`}function At(e,t){let n=T(t);return n.rowType==="sectionHeader"?_.secondary:n.rowType==="entity"?Z(n.domain,e.hass.states[n.entityId]?.state):Z(n.domain,"on")}function Bt(e,t,n,s,i){let a=x(t),o=A(t),l=i!==void 0&&E(a,x(i)),p=F(t).length,d=(m,f)=>e.edit(w=>Be(w,m,f)),u=Ct(e,"page",a,n,d),g=()=>{l||Et(e,a)},y=e.linkBadge?.(t),c=e.single===!0;return r`<div class="layer sp-page-row ${l?"hl":""}" data-page=${a} role="listitem" tabindex="0"
    draggable=${e.busy||c?"false":"true"} aria-current=${l?"true":"false"} aria-label=${o||"Untitled page"}
    @dragstart=${u.start} @dragover=${u.over} @drop=${u.drop} @dragend=${u.end}
    @click=${m=>{m.target instanceof Element&&m.target.closest("button")||g()}}
    @keydown=${m=>{m.target!==m.currentTarget||m.key!=="Enter"&&m.key!==" "||(m.preventDefault(),g())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Ht(e,"doc.text.fill","#5B8FD4")}
    <span class="name"><b><span class="nm-t">${o||"Untitled page"}</span></b><small>${K(p,"row","rows")}</small></span>
    <span class="right">
      <span class="badges">${y===void 0?b:r`<span class="badge sp-linked" title=${`${y}. An edit here shows there too.`}>${y}</span>`}${ge(t)?r`<span class="badge" title="One of the app's starter pages. It is edited and put on devices like any other.">starter</span>`:b}</span>
      <span class="acts">
        ${c?b:r`<button type="button" class="icon" ?disabled=${e.busy||n===0} title="Move up" aria-label=${`Move ${o} up`}
          @click=${()=>d(a,n-1)}>${v("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||n===s-1} title="Move down" aria-label=${`Move ${o} down`}
          @click=${()=>d(a,n+1)}>${v("down")}</button>`}
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Delete" aria-label=${`Delete ${o}`}
          @click=${()=>kt(e,a)}>${v("delete")}</button>
      </span>
    </span>
  </div>`}function Ln(e){let t=pe(e.document),n=P(e);return r`<section class="card lc sp-pages-card" aria-label="Status pages" style="--c: var(--wa-lc-pages, #26a69a); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${v("list")}</span><span class="lc-title">Status pages</span>
      <span class="lc-sub" title=${jt}>${K(t.length,"page","pages")}</span>
      <span class="spacer"></span>
      ${e.single===!0?b:r`<button type="button" class="lc-btn pri sp-add-page" aria-label="Add status page" ?disabled=${e.busy}
        title="Add a status page" @click=${()=>Gt(e)}>${v("plus")}<span>Add</span></button>`}
    </div>
    ${t.length===0?r`<div class="lc-note">No status pages. Add one to show the live state of entities you pick.</div>`:r`<div class="layers sp-page-list" role="list">${t.map((s,i)=>Bt(e,s,i,t.length,n))}</div>`}
    ${e.sharedLine===void 0||t.length===0?b:r`<div class="lc-note sp-shared-note" role="note">${e.sharedLine}</div>`}
    ${e.elsewhere??b}
  </section>`}function Yt(e,t,n,s,i,a){let o=V(n),l=T(n),p=a!==void 0&&E(o,V(a)),d=l.isHidden===!0,u=l.displayName===""?"Display Name":l.displayName,g=(f,w)=>e.edit($=>st($,t,f,w)),y=Ct(e,"row",o,s,g),c=()=>B(e,o),m=l.rowType==="sectionHeader"?"line.horizontal.3":l.iconName;return r`<div class="layer sp-row-row ${p?"hl":""} ${d?"dim":""}" data-row=${o} role="listitem" tabindex="0"
    draggable=${e.busy?"false":"true"} aria-current=${p?"true":"false"} aria-label=${u}
    title=${`${u} \xB7 ${he(n)}${d?", hidden":""}`}
    @dragstart=${y.start} @dragover=${y.over} @drop=${y.drop} @dragend=${y.end}
    @click=${f=>{f.target instanceof Element&&f.target.closest("button")||c()}}
    @keydown=${f=>{f.target!==f.currentTarget||f.key!=="Enter"&&f.key!==" "||(f.preventDefault(),c())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Ht(e,m,At(e,n))}
    <span class="name"><b><span class="nm-t">${u}</span></b><small>${he(n)}</small></span>
    <span class="right">
      <span class="badges">${d?r`<span class="badge">hidden</span>`:b}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${e.busy} title=${d?"Show":"Hide"} aria-label=${`${d?"Show":"Hide"} ${u}`}
          @click=${()=>e.edit(f=>D(f,t,o,"isHidden",!d))}>${v(d?"show":"hide")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||s===0} title="Move up" aria-label=${`Move ${u} up`}
          @click=${()=>g(o,s-1)}>${v("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||s===i-1} title="Move down" aria-label=${`Move ${u} down`}
          @click=${()=>g(o,s+1)}>${v("down")}</button>
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Remove" aria-label=${`Remove ${u}`}
          @click=${()=>e.edit(f=>we(f,t,o))}>${v("delete")}</button>
      </span>
    </span>
  </div>`}function Mn(e){let t=P(e),n=t===void 0?[]:F(t),s=G(e),i=t===void 0?"":x(t),a;t===void 0?a=r`<div class="lc-note">Add a status page to give it rows.</div>`:n.length===0?a=r`<div class="lc-note">No rows yet. Add entities to show in this status page.</div>`:a=r`<div class="layers sp-row-list" role="list">${n.map((l,p)=>Yt(e,i,l,p,n.length,s))}</div>
    <div class="lc-note sp-drag-note">Drag a row, or use its arrows, to reorder.</div>`;let o=J(e)!==void 0;return r`<section class="card lc sp-rows-card" aria-label="Rows" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${v("layers")}</span><span class="lc-title">Rows</span>
      ${t===void 0?b:r`<span class="lc-sub">${K(n.length,"row","rows")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-row ${o?"on":""}" aria-label="Add row" ?disabled=${e.busy||t===void 0}
        title="Add an entity, a group count, a dynamic list or a header" @click=${()=>Kt(e)}>${v("plus")}<span>Add</span></button>
    </div>
    ${a}
  </section>`}var se={small:{row:10,compact:9,icon:14},medium:{row:12,compact:10,icon:16},large:{row:14,compact:12,icon:18}},Se={regular:400,medium:500,semibold:600,bold:700},ae={default:"-apple-system, system-ui, 'SF Pro Text', 'Helvetica Neue', sans-serif",rounded:"ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, monospace",serif:"ui-serif, 'New York', Georgia, serif"},ht={ultraThin:.1,thin:.13,regular:.16,thick:.2,ultraThick:.24};function Zt(e){let t=n=>{let s=z().find(i=>i.key===n);return O(e,s)};return{rowStyle:String(t("rowStyle")),textSize:String(t("textSize")),fontWeight:String(t("fontWeight")),fontDesign:String(t("fontDesign")),rowSpacing:Number(t("rowSpacing")),backgroundMaterial:String(t("backgroundMaterial")),columnLayout:String(t("columnLayout")),showDividers:t("showDividers")===!0,iconPosition:String(t("iconPosition")),horizontalPadding:Number(t("horizontalPadding"))}}function ke(e){return _[e]??_.secondary}function It(e,t){return e.rowStyle==="pillFilled"?`background:color-mix(in srgb, ${t} 15%, transparent);`:e.rowStyle==="pillOutline"?`box-shadow:inset 0 0 0 0.75px color-mix(in srgb, ${t} 40%, transparent);`:""}function ie(e,t,n,s,i){let a=ke(n.color);return r`<span class="sp-w-icon" style=${`width:${s*i}px`}>${xe(e,n.icon,Math.round(s*.8*i),a)}</span>`}function yt(e,t,n,s){let i=e.scale,a=se[t.textSize]??se.medium,o=s!==void 0&&E(s,n.rowId),l=()=>B(e,n.rowId);if(n.kind==="sectionHeader")return r`<div class="sp-w-header ${o?"on":""}" style=${`font-size:${9*i}px;text-align:${n.align==="center"?"center":n.align==="trailing"?"right":"left"}`}
      @click=${l}>${n.label}</div>`;let p=ke(n.color),d=t.rowStyle==="plain";return r`<div class="sp-w-row ${o?"on":""}" title=${n.entityId??n.label}
    style=${`gap:${6*i}px;font-size:${a.row*i}px;font-weight:${Se[t.fontWeight]??400};padding:${d?0:4*i}px ${d?0:8*i}px;border-radius:${6*i}px;${It(t,p)}`}
    @click=${l}>
    ${t.iconPosition==="leading"?ie(e,t,n,a.icon,i):b}
    <span class="sp-w-label">${n.label}</span>
    <span class="sp-w-value" style=${`color:${p}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?ie(e,t,n,a.icon,i):b}
  </div>`}function $t(e,t,n,s){let i=e.scale,a=se[t.textSize]??se.medium,o=s!==void 0&&E(s,n.rowId),l=ke(n.color),p=t.rowStyle==="plain";return r`<div class="sp-w-cell ${o?"on":""}" title=${n.label}
    style=${`gap:${3*i}px;font-size:${a.compact*i}px;font-weight:${Se[t.fontWeight]??400};padding:${p?0:3*i}px ${p?0:6*i}px;border-radius:${6*i}px;${It(t,l)}`}
    @click=${()=>B(e,n.rowId)}>
    ${t.iconPosition==="leading"?ie(e,t,n,a.icon,i):b}
    <span class="sp-w-value" style=${`color:${l}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?ie(e,t,n,a.icon,i):b}
  </div>`}function vt(e){return r`<div class="sp-w-divider" style=${`height:${Math.max(1,.5*e)}px`}></div>`}function Nn(e){let t=e.phone===void 0?"Status page on the watch":"Status page on the iPhone";return ut(e.phone,e.screen,e.scale,Dt(e,t),t,e.icons)}function Ot(e){let t={hass:e.hass,icons:e.icons,screen:e.screen,scale:e.scale,uiState:new Map([[ve,x(e.page)]]),document:{statusPages:[e.page]},requestUpdate:()=>{}};return Dt(t,`${A(e.page)||"Untitled page"} on the watch`)}function Dt(e,t){let{width:n,height:s}=e.screen,i=e.scale,a=P(e),o=G(e),l=o===void 0?void 0:V(o),p;if(a===void 0)p=r`<p class="sp-w-empty">No status page.</p>`;else{let d=Zt(a),u=Je(a,e.hass.states),g=d.columnLayout==="twoColumn"?qe(u).map((c,m,f)=>r`${c.kind==="header"?yt(e,d,c.row,l):r`<div class="sp-w-pair" style=${`gap:${8*i}px`}>${$t(e,d,c.first,l)}${c.second===void 0?r`<span class="sp-w-cell sp-w-spacer"></span>`:$t(e,d,c.second,l)}</div>`}
          ${d.showDividers&&m<f.length-1?vt(i):b}`):u.map((c,m)=>r`${yt(e,d,c,l)}${d.showDividers&&m<u.length-1?vt(i):b}`),y=ht[d.backgroundMaterial]??ht.regular;p=r`<div class="sp-w-scroll" style=${`padding:${30*i}px ${6*i}px ${12*i}px;gap:${12*i}px`}>
      <div class="sp-w-card" style=${`padding:${8*i}px ${(6+d.horizontalPadding)*i}px;border-radius:${14*i}px;background:rgba(255,255,255,${y});font-family:${ae[d.fontDesign]??ae.default}`}>
        <div class="sp-w-rows" style=${`gap:${d.rowSpacing*i}px;padding:${4*i}px 0`}>
          ${u.length===0?r`<span class="sp-w-none" style=${`font-size:${11*i}px`}>${F(a).length===0?"Add entities":"Nothing to show now"}</span>`:g}
        </div>
      </div>
      <div class="sp-w-done" style=${`font-size:${15*i}px;padding:${12*i}px 0;border-radius:${20*i}px`}>Done</div>
    </div>`}return r`<div class="sp-screen" role="group" aria-label=${t}
    style=${`width:${Math.round(n*i)}px;min-height:${Math.round(s*i)}px`}>${p}</div>`}function _n(e){let t=P(e);if(t===void 0)return[];let n=F(t),s=n.filter(i=>i.isHidden===!0).length;return[K(n.length,"row","rows")+(s>0?`, ${s} hidden`:"")]}function Lt(e,t){return Ne(e.uiState,C,t)}function Xt(e,t){_e(e.uiState,C,t,!Lt(e,t)),e.requestUpdate()}var Qt={row:{color:H.content,icon:"content"},add:{color:H.content,icon:"plus"},page:{color:H.place,icon:"text"},rows:{color:"var(--wa-hue-yellow)",icon:"checklist"},text:{color:H.place,icon:"text"},more:{color:H.place,icon:"look"}},en=["look-rows","look-text","look-more"];function L(e,t,n,s,i,a={}){let o=Lt(e,n),l=Qt[t];return Te({color:l.color,icon:v(l.icon),title:s,open:o,onToggle:()=>Xt(e,n),...a.summary===void 0||a.summary===""?{}:{summary:a.summary},dot:a.dot===!0,id:`${C}:${n}`},o?i:r``)}function tn(e){if(J(e)!==void 0)return[{module:C,section:"add"}];let t=en.map(n=>({module:C,section:n}));return G(e)!==void 0?[{module:C,section:"row"},...t]:[{module:C,section:"page"},...t]}function Mt(e,t,n,s,i){let a=`${t}:q`,o=String(e.uiState.get(a)??"").trim().toLowerCase(),l=new Set(s),p=n.filter(g=>o===""||g.toLowerCase().includes(o)||q(e.hass,g).toLowerCase().includes(o)),d=[...p.filter(g=>l.has(g)),...p.filter(g=>!l.has(g))],u=d.slice(0,200);return r`<div class="sp-pick">
    <input type="search" class="sp-pick-q" placeholder="Search entities" aria-label="Search entities" .value=${String(e.uiState.get(a)??"")}
      @input=${g=>{e.uiState.set(a,g.target.value),e.requestUpdate()}} />
    <div class="sp-pick-list" role="group" aria-label="Entities">
      ${u.length===0?r`<div class="sp-pick-none">${n.length===0?"No entity of this kind in Home Assistant.":"No entity matches."}</div>`:b}
      ${u.map(g=>r`<label class="sp-pick-row">
        <input type="checkbox" .checked=${l.has(g)} ?disabled=${e.busy}
          @change=${y=>i(g,y.target.checked)} />
        <span class="sp-pick-name">${q(e.hass,g)}</span><code>${g}</code>
      </label>`)}
      ${d.length>u.length?r`<div class="sp-pick-none">${d.length-u.length} more. Search to narrow the list.</div>`:b}
    </div>
  </div>`}function nn(e,t,n){let s=x(t),i=V(n),a=T(n),o=(c,m,f)=>e.edit(w=>D(w,s,i,c,m),f),l=a.rowType==="sectionHeader",p=a.rowType==="groupCount"||a.rowType==="dynamicList",d=a.rowType==="dynamicList"&&a.dynamicMode==="all",u=a.rowType==="groupCount"||a.rowType==="dynamicList"&&!d,g=[];if(g.push(R("Visibility",a.isHidden===!0?"hidden":"visible",[["visible","Visible"],["hidden","Hidden"]],c=>o("isHidden",c==="hidden"))),g.push(le("Label",a.displayName,c=>o("displayName",c,`row:${i}:label`),{placeholder:"Display Name"})),l?g.push(R("Alignment",a.headerAlignment??"leading",I("HeaderAlignment"),c=>o("headerAlignment",c))):g.push(r`<div class="ts-stack">${Ie({icons:e.icons,symbols:e.symbols},a.iconName,c=>o("iconName",c,`row:${i}:icon`),`sp:icon:${i}`)}</div>`),a.rowType==="entity"&&g.push(r`<div class="ts-stack">${ce({hass:e.hass},"Entity",Rt(e.hass,a.entityId),c=>{let m=c.entityId.trim();m!==""&&e.edit(f=>{let w=D(f,s,i,"entityId",m),$=ee(m,e.hass.states);return w=D(w,s,i,"domain",$.domain),a.iconName===ee(a.entityId).iconName&&(w=D(w,s,i,"iconName",$.iconName)),w})},`sp:entity:${i}`,{clearable:!1})}</div>`),p&&a.domain!=="sensor"){let c=Ue(a.domain,a.deviceClassFilter);if(c.length>=2){let m=ze(a),f=c.map(w=>[w.value,w.label]);f.some(([w])=>w===m)||f.push([m,We(m)]),g.push(R("Show State",m,f,w=>o("filterState",w)))}}if(a.rowType==="dynamicList"&&(g.push(R("Entities",d?"all":"specific",I("DynamicMode"),c=>o("dynamicMode",c))),g.push(de("Show all states",a.showAllStates===!0,c=>o("showAllStates",c?!0:void 0),!1)),g.push(r`<div class="hint ts-under">On: every entity is listed whatever its state. Off: only those in the state above.</div>`)),a.domain==="sensor"&&(a.rowType==="groupCount"||d)&&(g.push(Ce(je(a.deviceClassFilter),a.maxNumericValue,c=>o("maxNumericValue",c,`row:${i}:max`),{optional:!0,placeholder:"No limit",def:null})),g.push(r`<div class="hint ts-under">Only states at or below it count. Empty is no limit.</div>`)),p){let c=a.deviceClassFilter??[],m=rt(a.domain,e.hass.states,c),f=w=>{let $=T(Q(ue(e.document,s),i)??n).deviceClassFilter??[],h=$.includes(w)?$.filter(S=>S!==w):[...$,w];o("deviceClassFilter",h.length===0?void 0:h)};g.push(r`<div class="field sp-classes"><span>Device classes</span>
      <div class="sp-chips" role="group" aria-label="Device classes">
        ${m.length===0?r`<span class="hint">None reported for ${a.domain===""?"this row":a.domain}.</span>`:b}
        ${m.map(w=>{let $=c.includes(w);return r`<button type="button" class="pe-chip ${$?"on":""}" aria-pressed=${$?"true":"false"} ?disabled=${e.busy}
            @click=${()=>f(w)}>${w.replaceAll("_"," ")}</button>`})}
      </div></div>
      <div class="hint ts-under">${c.length===0?"None picked: every class counts.":"Only entities of these classes count."}</div>`)}if(u){let c=a.groupEntityIds??[],m=at(n,e.hass.states);g.push(r`<div class="field sp-entities-field"><span>Edit Entities (${c.length})</span></div>
      ${Mt(e,`sp:ents:${i}`,m,c,(f,w)=>{let $=T(Q(ue(e.document,s),i)??n).groupEntityIds??[],h=w?$.includes(f)?$:[...$,f]:$.filter(S=>S!==f);o("groupEntityIds",h)})}`)}let y=r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Row">${g}</fieldset>`;return r`${L(e,"row","row",Tt(a.rowType),y,{summary:he(n)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this row from the page"
        @click=${()=>e.edit(c=>we(c,s,i))}>${v("delete")}<span>Remove</span></button>
    </div>`}function sn(e,t,n,s){let i=O(n,s),a=(o,l)=>e.edit(p=>me(p,t,s.key,o),l);switch(s.kind){case"switch":return r`${de(s.label,i===!0,o=>a(o),s.default)}
        ${s.help===void 0?b:r`<div class="hint ts-under">${s.help}</div>`}`;case"slider":return Ae(s.label,Number(i),o=>a(o,`style:${t}:${s.key}`),{min:s.min??0,max:s.max??1,step:s.step??1,def:Number(s.default),...s.unit===void 0?{}:{unit:s.unit}});default:{let o=X.types.page.keys[s.key]?.enum??"",l=I(o);return l.length<=4?R(s.label,String(i),l,p=>a(p),{def:String(s.default)}):He(s.label,String(i),l,p=>a(p),{def:String(s.default),snapBack:!0})}}}var ye=["rowStyle","columnLayout","iconPosition"],$e=["textSize","fontDesign","fontWeight"],xt=new Set([...ye,...$e]),an={small:12,medium:15,large:18};function rn(e,t,n){let s=z().find(d=>d.key===n);if(s===void 0)return;let i=x(t),a=String(O(t,s)),o=I(X.types.page.keys[n]?.enum??""),l=o.find(([d])=>d===a)?.[1]??a;return{field:s,value:a,choices:o,name:l,set:d=>{d!==String(O(P(e)??t,s))&&e.edit(u=>me(u,i,n,d))}}}function be(e,t){return z().some(n=>t(n.key)&&!Me(O(e,n),n.default))}function j(e,t,n,s=""){let i=a=>t.choices.find(([o])=>o===a)?.[1]??a;return r`<div class="sp-look">
    <div class="sp-look-title">${oe(e,t.value,String(t.field.default),a=>t.set(a),i)}</div>
    <div class="sp-pics ${s}" role="group" aria-label=${e} style=${`--n:${t.choices.length}`}>
      ${t.choices.map(([a,o])=>{let l=a===t.value;return r`<button type="button" class="sp-pic ${l?"on":""}" aria-pressed=${l?"true":"false"} aria-label=${`${e}: ${o}`}
          @click=${()=>t.set(a)}>${n(a,o)}</button>`})}
    </div>
  </div>`}function on(e,t){return r`<span class="sp-pic-well ${e}" aria-hidden="true"><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function ln(e,t){return r`<span class="sp-pic-grid ${e==="twoColumn"?"two":""}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function dn(e,t){let n=r`<i class="sp-pic-dot" aria-hidden="true"></i>`;return r`${e==="leading"?n:b}<span class="sp-pic-name">${t}</span>${e==="trailing"?n:b}`}function cn(e,t){return r`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:${an[e]??15}px`}>Aa</span><span class="sp-pic-name sub">${t}</span>`}function pn(e,t){return r`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:18px;font-family:${ae[e]??ae.default}`}>Ag</span><span class="sp-pic-name sub">${t}</span>`}function un(e){let t=n=>e.choices.find(([s])=>s===n)?.[1]??n;return r`<div class="field seg-field sp-weight-field">${oe("Weight",e.value,String(e.field.default),n=>e.set(n),t)}
    <div class="seg wide sp-weight" role="group" aria-label="Weight">
      ${e.choices.map(([n,s])=>{let i=n===e.value;return r`<button type="button" class=${i?"on":""} aria-pressed=${i?"true":"false"} aria-label=${`Weight: ${s}`}
          style=${`--w:${Se[n]??400}`} @click=${()=>e.set(n)}>${s}</button>`})}
    </div></div>`}function St(e,t){let n=x(t),s=h=>rn(e,t,h),[i,a,o]=ye.map(s),[l,p,d]=$e.map(s),u=h=>h.filter(S=>S!==void 0).map(S=>S.name).join(", "),g=be(t,h=>ye.includes(h)),y=be(t,h=>$e.includes(h)),c=be(t,h=>!xt.has(h)),m=Xe(t),f=L(e,"rows","look-rows","Rows",r`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Rows">
    ${i===void 0?b:j("Style",i,on)}
    ${a===void 0?b:j("Layout",a,ln,"across")}
    ${o===void 0?b:j("Icon",o,dn,"inline")}
  </fieldset>`,{summary:u([i,a]),dot:g}),w=L(e,"text","look-text","Text",r`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Text">
    ${l===void 0?b:j("Size",l,cn,"type")}
    ${p===void 0?b:j("Font",p,pn,"type")}
    ${d===void 0?b:un(d)}
  </fieldset>`,{summary:u([l,d,p]),dot:y}),$=L(e,"more","look-more","More",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="More">
    ${z().filter(h=>!xt.has(h.key)).map(h=>sn(e,n,t,h))}
  </fieldset>`,{summary:c?"Changed":"Defaults",dot:c});return r`${f}${w}${$}
    <div class="sp-acts">
      <button type="button" class="pe-btn" ?disabled=${e.busy||!m} title="Put the page's whole look back to the app's defaults"
        @click=${()=>e.edit(h=>Ze(h,n))}>${v("reset")}<span>Reset to Defaults</span></button>
    </div>`}function gn(e,t){let n=x(t),s=A(t);return L(e,"page","page","Page",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Page">
    ${le("Name",s,i=>e.edit(a=>Ye(a,n,i),`page:${n}:name`),{placeholder:"Page Name"})}
    ${ge(t)?r`<div class="hint ts-under">One of the app's starter pages. It is edited, put on devices and deleted like any other.</div>`:b}
    ${e.ticks?.(t)??b}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Delete this status page"
        @click=${()=>kt(e,n)}>${v("delete")}<span>Delete page</span></button>
    </div>
  </fieldset>`,{summary:s})}function mn(e,t,n,s){let i=Z(t.domain,"on");return r`<button type="button" class="sp-preset ${n?"on":""}" aria-pressed=${n?"true":"false"} ?disabled=${e.busy} @click=${s}>
    <span class="sp-preset-glyph">${xe(e,t.icon,18,i===_.secondary?"#5B8FD4":i)}</span>
    <span class="sp-preset-label">${t.label}</span>
  </button>`}function fn(e,t,n){let s=p=>ne(e,{...n,...p}),i=e.uiState.get(W),a=[["entity","Entity"],["groupCount","Group Count"],["dynamicList","Dynamic List"],["header","Header"]],o=R("Add",n.kind,a,p=>{if(p==="header"){te(e,Qe());return}e.uiState.delete(W),s({kind:p,preset:void 0,picked:[],mode:"all"})}),l;if(n.kind==="entity"){let p=Number(e.uiState.get(`${k}:n`)??0)||0;l=r`<div class="ts-stack">${ce({hass:e.hass},"Entity",Rt(e.hass,""),d=>{let u=d.entityId.trim();if(u==="")return;e.uiState.set(`${k}:n`,p+1);let g=P(e);if(g!==void 0&&nt(g,u)){e.uiState.set(W,`${q(e.hass,u)} is on this page already.`),e.requestUpdate();return}te(e,ee(u,e.hass.states),!0),e.uiState.set(W,`Added ${q(e.hass,u)}.`),e.requestUpdate()},`sp:add:entity:${p}`,{clearable:!1})}</div>
      <div class="hint">Each entity is one row. Pick another to add it too.</div>`}else{let p=n.kind==="groupCount"?ot():lt(),d=n.preset===void 0?void 0:p[n.preset],u=n.kind==="groupCount"||n.mode==="specific",g=n.kind==="groupCount"?"Counts how many of the entities you pick are in a state.":"Pick what to show. Each matching entity becomes its own row. You can switch to hand-picked entities after adding.",y=r`<div class="sp-presets" role="group" aria-label=${n.kind==="groupCount"?"Group Count":"Dynamic List"}>
      ${p.map((m,f)=>mn(e,m,n.preset===f,()=>{if(!u){te(e,fe(m));return}s({preset:f,picked:[]})}))}
    </div>`,c=b;if(u&&d!==void 0){let m=n.kind==="groupCount"?d.picker==="deviceClass"?d.deviceClassFilter:void 0:d.deviceClassFilter,f=it(d.domain,m,e.hass.states);c=r`<div class="field sp-entities-field"><span>${d.label}: ${K(n.picked.length,"entity","entities")} picked</span></div>
        ${Mt(e,`${k}:pick`,f,n.picked,(w,$)=>{let h=J(e)??n,S=h.picked.filter(Ut=>Ut!==w);ne(e,{...h,picked:$?[...S,w]:S})})}
        <div class="sp-acts">
          <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy}
            @click=${()=>{let w=(J(e)??n).picked;te(e,n.kind==="groupCount"?et(d,w):fe(d,w))}}>
            ${v("plus")}<span>Add ${n.kind==="groupCount"?"group count":"dynamic list"}</span></button>
        </div>`}l=r`<p class="hint">${g}</p>
      ${n.kind==="dynamicList"?R("Entities",n.mode,I("DynamicMode"),m=>s({mode:m,preset:void 0,picked:[]})):b}
      ${y}${c}`}return r`${L(e,"add","add","Add a row",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Add a row">
    ${o}${l}
    ${typeof i=="string"?r`<div class="hint sp-added" role="status">${i}</div>`:b}
  </fieldset>`,{summary:A(t)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn" @click=${()=>ne(e,void 0)}>Done</button>
    </div>`}function Fn(e){let t=P(e);if(t===void 0)return r`<div class="insp-head"><div class="crumbs"><span class="nm">No status page</span></div></div>
      <div class="insp-body"><p class="sp-note">Add a status page to edit it.</p></div>`;let n=A(t)||"Untitled page",s=G(e),i=J(e),a=tn(e),o=Fe(e.uiState,a),l,p;if(i!==void 0)l=r`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>Jt(e)}>${n}</button><span class="sep">›</span><span class="nm">Add a row</span></div>`,p=fn(e,t,i);else if(s!==void 0){let d=T(s),u=d.displayName===""?"Display Name":d.displayName;l=r`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>B(e,void 0)}>${n}</button><span class="sep">›</span><span class="kchip" style=${`--k:${At(e,s)}`}>${Tt(d.rowType)}</span><span class="nm" title=${u}>${u}</span></div>`,p=r`${nn(e,t,s)}${St(e,t)}`}else l=r`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">Page</span><span class="nm" title=${n}>${n}</span></div>`,p=r`${gn(e,t)}${St(e,t)}
      <p class="sp-note">Select a row to edit it, or add one.</p>`;return r`<div class="insp-head">
      ${l}
      <button class="expand" @click=${()=>{Ve(e.uiState,a,!o),e.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${p}</div>`}var Vn=Y`
  .sp-pages-card > .layers, .sp-rows-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .sp-pages-card > .lc-note, .sp-rows-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .sp-rows-card > .lc-note.sp-drag-note { margin-top: 0; font-size: 11.5px; }
  .sp-pages-card > .lc-note.sp-shared-note { margin-top: 0; font-size: 11.5px; }
  /* The badge of a status page other devices have too, the page editor's
     (\`.badge.pe-linked\`):
     cut short in a narrow list, its title holds the whole name. */
  .badge.sp-linked {
    max-width: 140px; overflow: hidden; text-overflow: ellipsis; display: inline-block; line-height: 20px; white-space: nowrap;
    color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
  }
  .lc-btn.on { box-shadow: var(--wa-ring); }
  /* A status page's tick row in its Page card (libraryTicksStyles). */
  .sp-lib { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
  .sp-lib-h { font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .sp-lib-hint { margin: 0; font-size: 12px; line-height: 1.4; color: var(--wa-muted); }
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
`;var Re=56,wn=40;var bn=56,Zn=76,N=Ee.screen;function Vt(e){return Math.round(e*N.height/N.width)}var Nt=new WeakMap;function zt(e,t,n,s){let i=Nt.get(e);i===void 0&&(i=new Map,Nt.set(e,i));let a=i.get(t);if(a!==void 0&&a.stamp.length===n.length&&a.stamp.every((l,p)=>l===n[p]))return a.picture;let o=s();return i.set(t,{stamp:n,picture:o}),o}function Xn(e){let t=e.iphone===!0,n=e.width??(t?wn:Re),s=[e.states,e.icons,e.tick,e.pages];return zt(e.page,`page:${t?"p":"w"}:${n}`,s,()=>hn(e,n,t))}function hn(e,t,n){let{page:s}=e,i=n?ct():void 0,a=i===void 0?N:pt(i),o=t/a.width,l=Math.min(Math.round(a.height*o),Vt(Math.max(t,Re))),p=`width:${t}px;height:${l}px`;if(De(s))return r`<span class="lr-pic lr-smart ${n?"ph":""}" style=${`${p};background:${ft(s)}`} aria-hidden="true">${v("states")}</span>`;let d={page:s,pages:e.pages??[s],screen:a,scale:o,stateMode:"live",...e.states===void 0?{}:{states:e.states},...e.icons===void 0?{}:{icons:e.icons},...i===void 0?{}:{phone:i}},u=mt(s,a,{sideInset:gt(d)}),g=u.tiles.filter(c=>(u.topInset+c.y)*o<l),y=wt(s,o,a,void 0);return r`<span class="lr-pic ${n?"ph":""}" style=${`${p};background:${y.background}`} aria-hidden="true">
    ${y.layers}
    ${g.map(c=>r`<span class="lr-tile"
      style=${`left:${c.x*o}px;top:${(u.topInset+c.y)*o}px;width:${c.width*o}px;height:${c.height*o}px`}>${bt(c.tile,{width:c.width,height:c.height},d,u.unit)}</span>`)}
  </span>`}function Qn(e){let t=e.width??Re,n=Vt(t),s=`width:${t}px;height:${n}px`,i=e.hass;return i===void 0?r`<span class="lr-pic lr-status" style=${s} aria-hidden="true"></span>`:zt(e.page,`status:${t}`,[i.states,e.icons,e.tick],()=>r`<span class="lr-pic lr-status" style=${s} aria-hidden="true">
    ${Ot({page:e.page,hass:i,icons:e.icons??Oe,screen:N,scale:t/N.width})}
  </span>`)}var _t,Pe=!1;function yn(e){return Pe||customElements.get("wa-menu-thumbs")!==void 0?(Pe=!0,!0):(_t??=import("./menu-thumbs-HPVPEPES.js").then(()=>{Pe=!0}),_t.then(e,()=>{}),!1)}var Ft=new WeakMap;function es(e){let t=e.height??bn,n=e.menu.unit;if(!yn(e.onReady)||e.hass===void 0||e.icons===void 0)return r`<span class="lr-ring" style=${`width:${t}px;height:${t}px`} aria-hidden="true"></span>`;let s=Ft.get(e.menu);return s===void 0&&(s=dt(e.menu),Ft.set(e.menu,s)),r`<wa-menu-thumbs class="lr-menu" .hass=${e.hass} .icons=${e.icons} .tick=${e.tick??0} .menus=${s}
    .pages=${e.pages} .screen=${N} .height=${t} menu=${n}></wa-menu-thumbs>`}var ts=Y`
  .lr-pic {
    position: relative; display: block; flex: none; overflow: hidden; line-height: 0; pointer-events: none;
    border-radius: 9px; box-shadow: 0 0 0 1px var(--wa-line-strong); background: #000;
  }
  .lr-pic.ph { border-radius: 6px; }
  .lr-tile { position: absolute; overflow: hidden; pointer-events: none; }
  .lr-smart { display: grid; place-items: center; color: rgba(255, 255, 255, .7); }
  .lr-smart svg { width: 16px; height: 16px; }
  .lr-status .wa-watch { padding: 0; margin: 0; background: none; box-shadow: none; border-radius: 0; }
  .lr-status .wa-watch::before, .lr-status .wa-watch::after { display: none; }
  .lr-ring { display: block; flex: none; border-radius: 50%; border: 1px dashed var(--wa-line-strong); box-sizing: border-box; }
  wa-menu-thumbs.lr-menu { flex: none; }
  .hid .lr-pic, .hid .lr-ring, .hid wa-menu-thumbs.lr-menu { opacity: .45; }
`;export{In as a,On as b,Dn as c,P as d,Et as e,Jt as f,Gt as g,Ln as h,Mn as i,Nn as j,Ot as k,_n as l,Fn as m,Vn as n,bn as o,Zn as p,Xn as q,Qn as r,es as s,ts as t};
