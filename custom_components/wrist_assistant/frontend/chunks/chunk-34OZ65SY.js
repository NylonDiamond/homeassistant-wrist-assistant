import{$ as rt,A as E,B as ue,C as Q,D as ge,G as Ke,H as Be,I as Ge,J as Ye,K as z,L as D,M as O,N as me,O as Ze,P as Xe,Q as ee,R as Qe,S as et,T as fe,U as tt,V as nt,W as we,X as st,Y as L,Z as it,_ as at,aa as ot,ba as lt,g as T,h as je,i as ze,j as Ue,k as We,l as V,m as Z,n as Je,o as qe,p as X,ta as dt,u as pe,v as x,w as I,y as F,z as j}from"./chunk-VBS46WJB.js";import{f as gt,g as mt,k as ft,m as wt,r as bt}from"./chunk-DDWSL7LV.js";import{b as ct,c as pt,g as ut}from"./chunk-2T5YPKZG.js";import{o as Le,w as Me,x as _e,y as Ve,z as Fe}from"./chunk-PEI2F5V4.js";import{c as re}from"./chunk-ZOJGMATP.js";import{c as De}from"./chunk-GR4P77YP.js";import{Pb as oe,Sb as le,Tb as Ce,Ub as He,Vb as R,Wb as Ae,X as Ee,Yb as de,ec as ce,gc as Ie}from"./chunk-ASVG65TC.js";import{Q as Ne,r as Oe}from"./chunk-ESIOP3D4.js";import{b as H,d as r,g as f,mh as A,nh as y,zh as Te}from"./chunk-IYJKXEFM.js";var Jt=3;function ht(e,t,n){if(e.length===0)return f;let s=e.slice(0,Jt),a=e.length-s.length;return r`<span class="badge lk-badge" title=${t} role="img" aria-label=${t}>${s.map(i=>{let o=n(i.ownerId);return r`<span class="lk-dev" style=${o===void 0?f:`--dc:${o}`} aria-hidden="true">${y(i.kind==="iphone"?"phone":"watch")}</span>`})}${a>0?r`<span class="lk-more" aria-hidden="true">+${a}</span>`:f}</span>`}var yt=H`
  .badge.lk-badge {
    display: inline-flex; align-items: center; gap: 1px; height: 20px; line-height: 20px; padding: 0 5px;
    color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
  }
  .lk-badge .lk-dev { display: inline-flex; color: var(--dc, var(--wa-accent)); }
  .lk-badge .lk-dev svg.ui-icon { width: 13px; height: 13px; stroke-width: 2; }
  .lk-badge .lk-more { margin-left: 2px; font-size: 10.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
`;function Rt(e,t){e.deletePage!==void 0?e.deletePage(t):e.edit(n=>Be(n,t))}var C="status-pages",ve="sp:page",M="sp:row",k="sp:add",U="sp:drag",J="sp:added",Tt="wrist-assistant-panel.status-pages.zoom.v1";function Fn(e=re()){try{let t=e?.getItem(Tt),n=t==null||t===""?NaN:Number(t);return Le.includes(n)?n:void 0}catch{return}}function jn(e,t=re()){try{t?.setItem(Tt,e===void 0?"":String(e))}catch{}}var qt="Pages the watch opens from a tile, a menu slot or Siri. A save reaches the watch the next time it checks.",zn="Drawn from Home Assistant's states now, as the watch draws the page. Tap a row to edit it.";function B(e,t,n){return`${e} ${e===1?t:n}`}function q(e,t){let n=e.states[t]?.attributes?.friendly_name;return typeof n=="string"&&n.trim()!==""?n:t}function Et(e,t){let n=t.indexOf(".");return{entityId:t,displayName:t===""?"":q(e,t),domain:n<0?"":t.slice(0,n)}}function Kt(e){switch(e){case"battery_charging":return"charging";case"illuminance":return"light";case"occupancy":case"presence":return"occupancy";case"garage_door":case"garage":return"garage";case"carbon_monoxide":return"CO";default:return e.replaceAll("_"," ")}}function Bt(e,t){if(t!==void 0&&t.length>0){let n=t.map(Kt),s=n.length===1?n[0]:n.slice(0,2).join("/");return e==="sensor"||e==="binary_sensor"?`${s} sensors`:e==="cover"?s.includes("garage")?"garage doors":`${s} covers`:`${s} ${e}s`}return e==="person"?"people":e==="binary_sensor"?"binary sensors":`${e}s`}function he(e){let t=T(e),n=s=>`${s} ${s===1?"entity":"entities"}`;switch(t.rowType){case"entity":return t.entityId;case"groupCount":return`${n(t.groupEntityIds?.length??0)} \xB7 group count`;case"dynamicList":return t.dynamicMode==="all"?`all ${Bt(t.domain,t.deviceClassFilter)} \xB7 dynamic list`:`${n(t.groupEntityIds?.length??0)} \xB7 dynamic list`;case"sectionHeader":return"section header";default:return t.rowType}}function Ct(e){return X.labels.StatusRowType?.[e]??e}function P(e){let t=pe(e.document),n=e.uiState.get(ve);return(typeof n=="string"?t.find(s=>E(x(s),n)):void 0)??t[0]}function Ht(e,t){e.uiState.set(ve,t),e.uiState.delete(M),e.uiState.delete(k),e.requestUpdate()}function G(e){let t=e.uiState.get(M);return typeof t=="string"?Q(P(e),t):void 0}function Y(e,t){t===void 0?e.uiState.delete(M):e.uiState.set(M,t),e.uiState.delete(k),e.requestUpdate()}function Gt(e){return G(e)===void 0&&!e.uiState.has(k)?!1:(e.uiState.delete(M),e.uiState.delete(k),e.requestUpdate(),!0)}function K(e){let t=e.uiState.get(k);return typeof t=="object"&&t!==null?t:void 0}function ne(e,t){t===void 0?e.uiState.delete(k):(e.uiState.set(k,t),e.uiState.delete(M)),e.requestUpdate()}function Yt(e,t="entity"){e.uiState.delete(J),ne(e,{kind:t,mode:"all",picked:[]})}function te(e,t,n=!1){let s=P(e);if(s===void 0)return;let a=x(s),i;return e.edit(o=>{let d=tt(o,a,t);return i=d.id,d.document}),i!==void 0&&!n&&Y(e,i),i}function Zt(e){let t;e.edit(n=>{let s=Ke(n);return t=s.id,s.document}),t!==void 0&&Ht(e,t)}function At(e,t,n,s,a){return{start:i=>{e.uiState.set(U,{list:t,id:n}),i.dataTransfer?.setData("text/plain",n),i.dataTransfer&&(i.dataTransfer.effectAllowed="move")},over:i=>{e.uiState.get(U)?.list===t&&(i.preventDefault(),i.dataTransfer&&(i.dataTransfer.dropEffect="move"))},drop:i=>{let o=e.uiState.get(U);e.uiState.delete(U),!(o?.list!==t||E(o.id,n))&&(i.preventDefault(),a(o.id,s))},end:()=>{e.uiState.delete(U)}}}function xe(e,t,n,s){return e.icons.render(t,n,s)??r`<span class="sp-glyph-dot" style=${`background:${s};width:${Math.max(4,n*.6)}px;height:${Math.max(4,n*.6)}px`}></span>`}function It(e,t,n){return r`<span class="thumb sp-thumb" style=${`--c:${n}`} aria-hidden="true"><span class="sp-thumb-glyph">${xe(e,t,14,n)}</span></span>`}function Dt(e,t){let n=T(t);return n.rowType==="sectionHeader"?V.secondary:n.rowType==="entity"?Z(n.domain,e.hass.states[n.entityId]?.state):Z(n.domain,"on")}function Xt(e,t){let n=e.linkDevices?.(t);if(n!==void 0)return ht(n.others,`${n.title}. An edit here shows there too.`,n.colorOf);let s=e.linkBadge?.(t);return s===void 0?f:r`<span class="badge sp-linked" title=${`${s}. An edit here shows there too.`}>${s}</span>`}function Qt(e,t,n,s,a){let i=x(t),o=I(t),d=a!==void 0&&E(i,x(a)),p=F(t).length,c=(l,b)=>e.edit(m=>Ge(m,l,b)),u=At(e,"page",i,n,c),g=()=>{d||Ht(e,i)},$=e.single===!0;return r`<div class="layer sp-page-row ${d?"hl":""}" data-page=${i} role="listitem" tabindex="0"
    draggable=${e.busy||$?"false":"true"} aria-current=${d?"true":"false"} aria-label=${o||"Untitled page"}
    @dragstart=${u.start} @dragover=${u.over} @drop=${u.drop} @dragend=${u.end}
    @click=${l=>{l.target instanceof Element&&l.target.closest("button")||g()}}
    @keydown=${l=>{l.target!==l.currentTarget||l.key!=="Enter"&&l.key!==" "||(l.preventDefault(),g())}}>
    <span class="grip" aria-hidden="true"></span>
    ${It(e,"doc.text.fill","#5B8FD4")}
    <span class="name"><b><span class="nm-t">${o||"Untitled page"}</span></b><small>${B(p,"row","rows")}</small></span>
    <span class="right">
      <span class="badges">${Xt(e,t)}${ge(t)?r`<span class="badge" title="One of the app's starter pages. It is edited and put on devices like any other.">starter</span>`:f}</span>
      <span class="acts">
        ${$?f:r`<button type="button" class="icon" ?disabled=${e.busy||n===0} title="Move up" aria-label=${`Move ${o} up`}
          @click=${()=>c(i,n-1)}>${y("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||n===s-1} title="Move down" aria-label=${`Move ${o} down`}
          @click=${()=>c(i,n+1)}>${y("down")}</button>`}
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Delete" aria-label=${`Delete ${o}`}
          @click=${()=>Rt(e,i)}>${y("delete")}</button>
      </span>
    </span>
  </div>`}function Un(e){let t=pe(e.document),n=P(e);return r`<section class="card lc sp-pages-card" aria-label="Status pages" style="--c: var(--wa-lc-pages, #26a69a); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${y("list")}</span><span class="lc-title">Status pages</span>
      <span class="lc-sub" title=${qt}>${B(t.length,"page","pages")}</span>
      <span class="spacer"></span>
      ${e.single===!0?f:r`<button type="button" class="lc-btn pri sp-add-page" aria-label="Add status page" ?disabled=${e.busy}
        title="Add a status page" @click=${()=>Zt(e)}>${y("plus")}<span>Add</span></button>`}
    </div>
    ${t.length===0?r`<div class="lc-note">No status pages. Add one to show the live state of entities you pick.</div>`:r`<div class="layers sp-page-list" role="list">${t.map((s,a)=>Qt(e,s,a,t.length,n))}</div>`}
    ${e.sharedLine===void 0||t.length===0?f:r`<div class="lc-note sp-shared-note" role="note">${e.sharedLine}</div>`}
    ${e.elsewhere??f}
  </section>`}function en(e,t,n,s,a,i){let o=j(n),d=T(n),p=i!==void 0&&E(o,j(i)),c=d.isHidden===!0,u=d.displayName===""?"Display Name":d.displayName,g=(m,w)=>e.edit(v=>st(v,t,m,w)),$=At(e,"row",o,s,g),l=()=>Y(e,o),b=d.rowType==="sectionHeader"?"line.horizontal.3":d.iconName;return r`<div class="layer sp-row-row ${p?"hl":""} ${c?"dim":""}" data-row=${o} role="listitem" tabindex="0"
    draggable=${e.busy?"false":"true"} aria-current=${p?"true":"false"} aria-label=${u}
    title=${`${u} \xB7 ${he(n)}${c?", hidden":""}`}
    @dragstart=${$.start} @dragover=${$.over} @drop=${$.drop} @dragend=${$.end}
    @click=${m=>{m.target instanceof Element&&m.target.closest("button")||l()}}
    @keydown=${m=>{m.target!==m.currentTarget||m.key!=="Enter"&&m.key!==" "||(m.preventDefault(),l())}}>
    <span class="grip" aria-hidden="true"></span>
    ${It(e,b,Dt(e,n))}
    <span class="name"><b><span class="nm-t">${u}</span></b><small>${he(n)}</small></span>
    <span class="right">
      <span class="badges">${c?r`<span class="badge">hidden</span>`:f}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${e.busy} title=${c?"Show":"Hide"} aria-label=${`${c?"Show":"Hide"} ${u}`}
          @click=${()=>e.edit(m=>L(m,t,o,"isHidden",!c))}>${y(c?"show":"hide")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||s===0} title="Move up" aria-label=${`Move ${u} up`}
          @click=${()=>g(o,s-1)}>${y("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||s===a-1} title="Move down" aria-label=${`Move ${u} down`}
          @click=${()=>g(o,s+1)}>${y("down")}</button>
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Remove" aria-label=${`Remove ${u}`}
          @click=${()=>e.edit(m=>we(m,t,o))}>${y("delete")}</button>
      </span>
    </span>
  </div>`}function Wn(e){let t=P(e),n=t===void 0?[]:F(t),s=G(e),a=t===void 0?"":x(t),i;t===void 0?i=r`<div class="lc-note">Add a status page to give it rows.</div>`:n.length===0?i=r`<div class="lc-note">No rows yet. Add entities to show in this status page.</div>`:i=r`<div class="layers sp-row-list" role="list">${n.map((d,p)=>en(e,a,d,p,n.length,s))}</div>
    <div class="lc-note sp-drag-note">Drag a row, or use its arrows, to reorder.</div>`;let o=K(e)!==void 0;return r`<section class="card lc sp-rows-card" aria-label="Rows" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${y("layers")}</span><span class="lc-title">Rows</span>
      ${t===void 0?f:r`<span class="lc-sub">${B(n.length,"row","rows")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-row ${o?"on":""}" aria-label="Add row" ?disabled=${e.busy||t===void 0}
        title="Add an entity, a group count, a dynamic list or a header" @click=${()=>Yt(e)}>${y("plus")}<span>Add</span></button>
    </div>
    ${i}
  </section>`}var se={small:{row:10,compact:9,icon:14},medium:{row:12,compact:10,icon:16},large:{row:14,compact:12,icon:18}},Se={regular:400,medium:500,semibold:600,bold:700},ie={default:"-apple-system, system-ui, 'SF Pro Text', 'Helvetica Neue', sans-serif",rounded:"ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, monospace",serif:"ui-serif, 'New York', Georgia, serif"},$t={ultraThin:.1,thin:.13,regular:.16,thick:.2,ultraThick:.24};function tn(e){let t=n=>{let s=z().find(a=>a.key===n);return O(e,s)};return{rowStyle:String(t("rowStyle")),textSize:String(t("textSize")),fontWeight:String(t("fontWeight")),fontDesign:String(t("fontDesign")),rowSpacing:Number(t("rowSpacing")),backgroundMaterial:String(t("backgroundMaterial")),columnLayout:String(t("columnLayout")),showDividers:t("showDividers")===!0,iconPosition:String(t("iconPosition")),horizontalPadding:Number(t("horizontalPadding"))}}function ke(e){return V[e]??V.secondary}function Ot(e,t){return e.rowStyle==="pillFilled"?`background:color-mix(in srgb, ${t} 15%, transparent);`:e.rowStyle==="pillOutline"?`box-shadow:inset 0 0 0 0.75px color-mix(in srgb, ${t} 40%, transparent);`:""}function ae(e,t,n,s,a){let i=ke(n.color);return r`<span class="sp-w-icon" style=${`width:${s*a}px`}>${xe(e,n.icon,Math.round(s*.8*a),i)}</span>`}function vt(e,t,n,s){let a=e.scale,i=se[t.textSize]??se.medium,o=s!==void 0&&E(s,n.rowId),d=()=>Y(e,n.rowId);if(n.kind==="sectionHeader")return r`<div class="sp-w-header ${o?"on":""}" style=${`font-size:${9*a}px;text-align:${n.align==="center"?"center":n.align==="trailing"?"right":"left"}`}
      @click=${d}>${n.label}</div>`;let p=ke(n.color),c=t.rowStyle==="plain";return r`<div class="sp-w-row ${o?"on":""}" title=${n.entityId??n.label}
    style=${`gap:${6*a}px;font-size:${i.row*a}px;font-weight:${Se[t.fontWeight]??400};padding:${c?0:4*a}px ${c?0:8*a}px;border-radius:${6*a}px;${Ot(t,p)}`}
    @click=${d}>
    ${t.iconPosition==="leading"?ae(e,t,n,i.icon,a):f}
    <span class="sp-w-label">${n.label}</span>
    <span class="sp-w-value" style=${`color:${p}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?ae(e,t,n,i.icon,a):f}
  </div>`}function xt(e,t,n,s){let a=e.scale,i=se[t.textSize]??se.medium,o=s!==void 0&&E(s,n.rowId),d=ke(n.color),p=t.rowStyle==="plain";return r`<div class="sp-w-cell ${o?"on":""}" title=${n.label}
    style=${`gap:${3*a}px;font-size:${i.compact*a}px;font-weight:${Se[t.fontWeight]??400};padding:${p?0:3*a}px ${p?0:6*a}px;border-radius:${6*a}px;${Ot(t,d)}`}
    @click=${()=>Y(e,n.rowId)}>
    ${t.iconPosition==="leading"?ae(e,t,n,i.icon,a):f}
    <span class="sp-w-value" style=${`color:${d}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?ae(e,t,n,i.icon,a):f}
  </div>`}function St(e){return r`<div class="sp-w-divider" style=${`height:${Math.max(1,.5*e)}px`}></div>`}function Jn(e){let t=e.phone===void 0?"Status page on the watch":"Status page on the iPhone";return ut(e.phone,e.screen,e.scale,Nt(e,t),t,e.icons)}function Lt(e){let t={hass:e.hass,icons:e.icons,screen:e.screen,scale:e.scale,uiState:new Map([[ve,x(e.page)]]),document:{statusPages:[e.page]},requestUpdate:()=>{}};return Nt(t,`${I(e.page)||"Untitled page"} on the watch`)}function Nt(e,t){let{width:n,height:s}=e.screen,a=e.scale,i=P(e),o=G(e),d=o===void 0?void 0:j(o),p;if(i===void 0)p=r`<p class="sp-w-empty">No status page.</p>`;else{let c=tn(i),u=qe(i,e.hass.states),g=c.columnLayout==="twoColumn"?Je(u).map((l,b,m)=>r`${l.kind==="header"?vt(e,c,l.row,d):r`<div class="sp-w-pair" style=${`gap:${8*a}px`}>${xt(e,c,l.first,d)}${l.second===void 0?r`<span class="sp-w-cell sp-w-spacer"></span>`:xt(e,c,l.second,d)}</div>`}
          ${c.showDividers&&b<m.length-1?St(a):f}`):u.map((l,b)=>r`${vt(e,c,l,d)}${c.showDividers&&b<u.length-1?St(a):f}`),$=$t[c.backgroundMaterial]??$t.regular;p=r`<div class="sp-w-scroll" style=${`padding:${30*a}px ${6*a}px ${12*a}px;gap:${12*a}px`}>
      <div class="sp-w-card" style=${`padding:${8*a}px ${(6+c.horizontalPadding)*a}px;border-radius:${14*a}px;background:rgba(255,255,255,${$});font-family:${ie[c.fontDesign]??ie.default}`}>
        <div class="sp-w-rows" style=${`gap:${c.rowSpacing*a}px;padding:${4*a}px 0`}>
          ${u.length===0?r`<span class="sp-w-none" style=${`font-size:${11*a}px`}>${F(i).length===0?"Add entities":"Nothing to show now"}</span>`:g}
        </div>
      </div>
      <div class="sp-w-done" style=${`font-size:${15*a}px;padding:${12*a}px 0;border-radius:${20*a}px`}>Done</div>
    </div>`}return r`<div class="sp-screen" role="group" aria-label=${t}
    style=${`width:${Math.round(n*a)}px;min-height:${Math.round(s*a)}px`}>${p}</div>`}function qn(e){let t=P(e);if(t===void 0)return[];let n=F(t),s=n.filter(a=>a.isHidden===!0).length;return[B(n.length,"row","rows")+(s>0?`, ${s} hidden`:"")]}function Mt(e,t){return Me(e.uiState,C,t)}function nn(e,t){_e(e.uiState,C,t,!Mt(e,t)),e.requestUpdate()}var sn={row:{color:A.content,icon:"content"},add:{color:A.content,icon:"plus"},page:{color:A.place,icon:"text"},rows:{color:"var(--wa-hue-yellow)",icon:"checklist"},text:{color:A.place,icon:"text"},more:{color:A.place,icon:"look"}},an=["look-rows","look-text","look-more"];function N(e,t,n,s,a,i={}){let o=Mt(e,n),d=sn[t];return Te({color:d.color,icon:y(d.icon),title:s,open:o,onToggle:()=>nn(e,n),...i.summary===void 0||i.summary===""?{}:{summary:i.summary},dot:i.dot===!0,id:`${C}:${n}`},o?a:r``)}function rn(e){if(K(e)!==void 0)return[{module:C,section:"add"}];let t=an.map(n=>({module:C,section:n}));return G(e)!==void 0?[{module:C,section:"row"},...t]:[{module:C,section:"page"},...t]}function _t(e,t,n,s,a){let i=`${t}:q`,o=String(e.uiState.get(i)??"").trim().toLowerCase(),d=new Set(s),p=n.filter(g=>o===""||g.toLowerCase().includes(o)||q(e.hass,g).toLowerCase().includes(o)),c=[...p.filter(g=>d.has(g)),...p.filter(g=>!d.has(g))],u=c.slice(0,200);return r`<div class="sp-pick">
    <input type="search" class="sp-pick-q" placeholder="Search entities" aria-label="Search entities" .value=${String(e.uiState.get(i)??"")}
      @input=${g=>{e.uiState.set(i,g.target.value),e.requestUpdate()}} />
    <div class="sp-pick-list" role="group" aria-label="Entities">
      ${u.length===0?r`<div class="sp-pick-none">${n.length===0?"No entity of this kind in Home Assistant.":"No entity matches."}</div>`:f}
      ${u.map(g=>r`<label class="sp-pick-row">
        <input type="checkbox" .checked=${d.has(g)} ?disabled=${e.busy}
          @change=${$=>a(g,$.target.checked)} />
        <span class="sp-pick-name">${q(e.hass,g)}</span><code>${g}</code>
      </label>`)}
      ${c.length>u.length?r`<div class="sp-pick-none">${c.length-u.length} more. Search to narrow the list.</div>`:f}
    </div>
  </div>`}function on(e,t,n){let s=x(t),a=j(n),i=T(n),o=(l,b,m)=>e.edit(w=>L(w,s,a,l,b),m),d=i.rowType==="sectionHeader",p=i.rowType==="groupCount"||i.rowType==="dynamicList",c=i.rowType==="dynamicList"&&i.dynamicMode==="all",u=i.rowType==="groupCount"||i.rowType==="dynamicList"&&!c,g=[];if(g.push(R("Visibility",i.isHidden===!0?"hidden":"visible",[["visible","Visible"],["hidden","Hidden"]],l=>o("isHidden",l==="hidden"))),g.push(le("Label",i.displayName,l=>o("displayName",l,`row:${a}:label`),{placeholder:"Display Name"})),d?g.push(R("Alignment",i.headerAlignment??"leading",D("HeaderAlignment"),l=>o("headerAlignment",l))):g.push(r`<div class="ts-stack">${Ie({icons:e.icons,symbols:e.symbols},i.iconName,l=>o("iconName",l,`row:${a}:icon`),`sp:icon:${a}`)}</div>`),i.rowType==="entity"&&g.push(r`<div class="ts-stack">${ce({hass:e.hass},"Entity",Et(e.hass,i.entityId),l=>{let b=l.entityId.trim();b!==""&&e.edit(m=>{let w=L(m,s,a,"entityId",b),v=ee(b,e.hass.states);return w=L(w,s,a,"domain",v.domain),i.iconName===ee(i.entityId).iconName&&(w=L(w,s,a,"iconName",v.iconName)),w})},`sp:entity:${a}`,{clearable:!1})}</div>`),p&&i.domain!=="sensor"){let l=ze(i.domain,i.deviceClassFilter);if(l.length>=2){let b=je(i),m=l.map(w=>[w.value,w.label]);m.some(([w])=>w===b)||m.push([b,We(b)]),g.push(R("Show State",b,m,w=>o("filterState",w)))}}if(i.rowType==="dynamicList"&&(g.push(R("Entities",c?"all":"specific",D("DynamicMode"),l=>o("dynamicMode",l))),g.push(de("Show all states",i.showAllStates===!0,l=>o("showAllStates",l?!0:void 0),!1)),g.push(r`<div class="hint ts-under">On: every entity is listed whatever its state. Off: only those in the state above.</div>`)),i.domain==="sensor"&&(i.rowType==="groupCount"||c)&&(g.push(Ce(Ue(i.deviceClassFilter),i.maxNumericValue,l=>o("maxNumericValue",l,`row:${a}:max`),{optional:!0,placeholder:"No limit",def:null})),g.push(r`<div class="hint ts-under">Only states at or below it count. Empty is no limit.</div>`)),p){let l=i.deviceClassFilter??[],b=rt(i.domain,e.hass.states,l),m=w=>{let v=T(Q(ue(e.document,s),a)??n).deviceClassFilter??[],h=v.includes(w)?v.filter(S=>S!==w):[...v,w];o("deviceClassFilter",h.length===0?void 0:h)};g.push(r`<div class="field sp-classes"><span>Device classes</span>
      <div class="sp-chips" role="group" aria-label="Device classes">
        ${b.length===0?r`<span class="hint">None reported for ${i.domain===""?"this row":i.domain}.</span>`:f}
        ${b.map(w=>{let v=l.includes(w);return r`<button type="button" class="pe-chip ${v?"on":""}" aria-pressed=${v?"true":"false"} ?disabled=${e.busy}
            @click=${()=>m(w)}>${w.replaceAll("_"," ")}</button>`})}
      </div></div>
      <div class="hint ts-under">${l.length===0?"None picked: every class counts.":"Only entities of these classes count."}</div>`)}if(u){let l=i.groupEntityIds??[],b=it(n,e.hass.states);g.push(r`<div class="field sp-entities-field"><span>Edit Entities (${l.length})</span></div>
      ${_t(e,`sp:ents:${a}`,b,l,(m,w)=>{let v=T(Q(ue(e.document,s),a)??n).groupEntityIds??[],h=w?v.includes(m)?v:[...v,m]:v.filter(S=>S!==m);o("groupEntityIds",h)})}`)}let $=r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Row">${g}</fieldset>`;return r`${N(e,"row","row",Ct(i.rowType),$,{summary:he(n)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this row from the page"
        @click=${()=>e.edit(l=>we(l,s,a))}>${y("delete")}<span>Remove</span></button>
    </div>`}function ln(e,t,n,s){let a=O(n,s),i=(o,d)=>e.edit(p=>me(p,t,s.key,o),d);switch(s.kind){case"switch":return r`${de(s.label,a===!0,o=>i(o),s.default)}
        ${s.help===void 0?f:r`<div class="hint ts-under">${s.help}</div>`}`;case"slider":return Ae(s.label,Number(a),o=>i(o,`style:${t}:${s.key}`),{min:s.min??0,max:s.max??1,step:s.step??1,def:Number(s.default),...s.unit===void 0?{}:{unit:s.unit}});default:{let o=X.types.page.keys[s.key]?.enum??"",d=D(o);return d.length<=4?R(s.label,String(a),d,p=>i(p),{def:String(s.default)}):He(s.label,String(a),d,p=>i(p),{def:String(s.default),snapBack:!0})}}}var ye=["rowStyle","columnLayout","iconPosition"],$e=["textSize","fontDesign","fontWeight"],kt=new Set([...ye,...$e]),dn={small:12,medium:15,large:18};function cn(e,t,n){let s=z().find(c=>c.key===n);if(s===void 0)return;let a=x(t),i=String(O(t,s)),o=D(X.types.page.keys[n]?.enum??""),d=o.find(([c])=>c===i)?.[1]??i;return{field:s,value:i,choices:o,name:d,set:c=>{c!==String(O(P(e)??t,s))&&e.edit(u=>me(u,a,n,c))}}}function be(e,t){return z().some(n=>t(n.key)&&!Ne(O(e,n),n.default))}function W(e,t,n,s=""){let a=i=>t.choices.find(([o])=>o===i)?.[1]??i;return r`<div class="sp-look">
    <div class="sp-look-title">${oe(e,t.value,String(t.field.default),i=>t.set(i),a)}</div>
    <div class="sp-pics ${s}" role="group" aria-label=${e} style=${`--n:${t.choices.length}`}>
      ${t.choices.map(([i,o])=>{let d=i===t.value;return r`<button type="button" class="sp-pic ${d?"on":""}" aria-pressed=${d?"true":"false"} aria-label=${`${e}: ${o}`}
          @click=${()=>t.set(i)}>${n(i,o)}</button>`})}
    </div>
  </div>`}function pn(e,t){return r`<span class="sp-pic-well ${e}" aria-hidden="true"><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function un(e,t){return r`<span class="sp-pic-grid ${e==="twoColumn"?"two":""}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function gn(e,t){let n=r`<i class="sp-pic-dot" aria-hidden="true"></i>`;return r`${e==="leading"?n:f}<span class="sp-pic-name">${t}</span>${e==="trailing"?n:f}`}function mn(e,t){return r`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:${dn[e]??15}px`}>Aa</span><span class="sp-pic-name sub">${t}</span>`}function fn(e,t){return r`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:18px;font-family:${ie[e]??ie.default}`}>Ag</span><span class="sp-pic-name sub">${t}</span>`}function wn(e){let t=n=>e.choices.find(([s])=>s===n)?.[1]??n;return r`<div class="field seg-field sp-weight-field">${oe("Weight",e.value,String(e.field.default),n=>e.set(n),t)}
    <div class="seg wide sp-weight" role="group" aria-label="Weight">
      ${e.choices.map(([n,s])=>{let a=n===e.value;return r`<button type="button" class=${a?"on":""} aria-pressed=${a?"true":"false"} aria-label=${`Weight: ${s}`}
          style=${`--w:${Se[n]??400}`} @click=${()=>e.set(n)}>${s}</button>`})}
    </div></div>`}function Pt(e,t){let n=x(t),s=h=>cn(e,t,h),[a,i,o]=ye.map(s),[d,p,c]=$e.map(s),u=h=>h.filter(S=>S!==void 0).map(S=>S.name).join(", "),g=be(t,h=>ye.includes(h)),$=be(t,h=>$e.includes(h)),l=be(t,h=>!kt.has(h)),b=Xe(t),m=N(e,"rows","look-rows","Rows",r`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Rows">
    ${a===void 0?f:W("Style",a,pn)}
    ${i===void 0?f:W("Layout",i,un,"across")}
    ${o===void 0?f:W("Icon",o,gn,"inline")}
  </fieldset>`,{summary:u([a,i]),dot:g}),w=N(e,"text","look-text","Text",r`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Text">
    ${d===void 0?f:W("Size",d,mn,"type")}
    ${p===void 0?f:W("Font",p,fn,"type")}
    ${c===void 0?f:wn(c)}
  </fieldset>`,{summary:u([d,c,p]),dot:$}),v=N(e,"more","look-more","More",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="More">
    ${z().filter(h=>!kt.has(h.key)).map(h=>ln(e,n,t,h))}
  </fieldset>`,{summary:l?"Changed":"Defaults",dot:l});return r`${m}${w}${v}
    <div class="sp-acts">
      <button type="button" class="pe-btn" ?disabled=${e.busy||!b} title="Put the page's whole look back to the app's defaults"
        @click=${()=>e.edit(h=>Ze(h,n))}>${y("reset")}<span>Reset to Defaults</span></button>
    </div>`}function bn(e,t){let n=x(t),s=I(t);return N(e,"page","page","Page",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Page">
    ${le("Name",s,a=>e.edit(i=>Ye(i,n,a),`page:${n}:name`),{placeholder:"Page Name"})}
    ${ge(t)?r`<div class="hint ts-under">One of the app's starter pages. It is edited, put on devices and deleted like any other.</div>`:f}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Delete this status page"
        @click=${()=>Rt(e,n)}>${y("delete")}<span>Delete page</span></button>
    </div>
  </fieldset>`,{summary:s})}function hn(e,t,n,s){let a=Z(t.domain,"on");return r`<button type="button" class="sp-preset ${n?"on":""}" aria-pressed=${n?"true":"false"} ?disabled=${e.busy} @click=${s}>
    <span class="sp-preset-glyph">${xe(e,t.icon,18,a===V.secondary?"#5B8FD4":a)}</span>
    <span class="sp-preset-label">${t.label}</span>
  </button>`}function yn(e,t,n){let s=p=>ne(e,{...n,...p}),a=e.uiState.get(J),i=[["entity","Entity"],["groupCount","Group Count"],["dynamicList","Dynamic List"],["header","Header"]],o=R("Add",n.kind,i,p=>{if(p==="header"){te(e,Qe());return}e.uiState.delete(J),s({kind:p,preset:void 0,picked:[],mode:"all"})}),d;if(n.kind==="entity"){let p=Number(e.uiState.get(`${k}:n`)??0)||0;d=r`<div class="ts-stack">${ce({hass:e.hass},"Entity",Et(e.hass,""),c=>{let u=c.entityId.trim();if(u==="")return;e.uiState.set(`${k}:n`,p+1);let g=P(e);if(g!==void 0&&nt(g,u)){e.uiState.set(J,`${q(e.hass,u)} is on this page already.`),e.requestUpdate();return}te(e,ee(u,e.hass.states),!0),e.uiState.set(J,`Added ${q(e.hass,u)}.`),e.requestUpdate()},`sp:add:entity:${p}`,{clearable:!1})}</div>
      <div class="hint">Each entity is one row. Pick another to add it too.</div>`}else{let p=n.kind==="groupCount"?ot():lt(),c=n.preset===void 0?void 0:p[n.preset],u=n.kind==="groupCount"||n.mode==="specific",g=n.kind==="groupCount"?"Counts how many of the entities you pick are in a state.":"Pick what to show. Each matching entity becomes its own row. You can switch to hand-picked entities after adding.",$=r`<div class="sp-presets" role="group" aria-label=${n.kind==="groupCount"?"Group Count":"Dynamic List"}>
      ${p.map((b,m)=>hn(e,b,n.preset===m,()=>{if(!u){te(e,fe(b));return}s({preset:m,picked:[]})}))}
    </div>`,l=f;if(u&&c!==void 0){let b=n.kind==="groupCount"?c.picker==="deviceClass"?c.deviceClassFilter:void 0:c.deviceClassFilter,m=at(c.domain,b,e.hass.states);l=r`<div class="field sp-entities-field"><span>${c.label}: ${B(n.picked.length,"entity","entities")} picked</span></div>
        ${_t(e,`${k}:pick`,m,n.picked,(w,v)=>{let h=K(e)??n,S=h.picked.filter(Wt=>Wt!==w);ne(e,{...h,picked:v?[...S,w]:S})})}
        <div class="sp-acts">
          <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy}
            @click=${()=>{let w=(K(e)??n).picked;te(e,n.kind==="groupCount"?et(c,w):fe(c,w))}}>
            ${y("plus")}<span>Add ${n.kind==="groupCount"?"group count":"dynamic list"}</span></button>
        </div>`}d=r`<p class="hint">${g}</p>
      ${n.kind==="dynamicList"?R("Entities",n.mode,D("DynamicMode"),b=>s({mode:b,preset:void 0,picked:[]})):f}
      ${$}${l}`}return r`${N(e,"add","add","Add a row",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Add a row">
    ${o}${d}
    ${typeof a=="string"?r`<div class="hint sp-added" role="status">${a}</div>`:f}
  </fieldset>`,{summary:I(t)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn" @click=${()=>ne(e,void 0)}>Done</button>
    </div>`}function Kn(e){let t=P(e);if(t===void 0)return r`<div class="insp-head"><div class="crumbs"><span class="nm">No status page</span></div></div>
      <div class="insp-body"><p class="sp-note">Add a status page to edit it.</p></div>`;let n=I(t)||"Untitled page",s=G(e),a=K(e),i=rn(e),o=Ve(e.uiState,i),d,p;if(a!==void 0)d=r`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>Gt(e)}>${n}</button><span class="sep">›</span><span class="nm">Add a row</span></div>`,p=yn(e,t,a);else if(s!==void 0){let c=T(s),u=c.displayName===""?"Display Name":c.displayName;d=r`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>Y(e,void 0)}>${n}</button><span class="sep">›</span><span class="kchip" style=${`--k:${Dt(e,s)}`}>${Ct(c.rowType)}</span><span class="nm" title=${u}>${u}</span></div>`,p=r`${on(e,t,s)}${Pt(e,t)}`}else d=r`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">Page</span><span class="nm" title=${n}>${n}</span></div>`,p=r`${bn(e,t)}${Pt(e,t)}
      <p class="sp-note">Select a row to edit it, or add one.</p>`;return r`<div class="insp-head">
      ${d}
      <button class="expand" @click=${()=>{Fe(e.uiState,i,!o),e.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${p}</div>`}var Bn=H`
  .sp-pages-card > .layers, .sp-rows-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .sp-pages-card > .lc-note, .sp-rows-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .sp-rows-card > .lc-note.sp-drag-note { margin-top: 0; font-size: 11.5px; }
  .sp-pages-card > .lc-note.sp-shared-note { margin-top: 0; font-size: 11.5px; }
  /* The badge of a status page other devices have too: the device icons
     (linkBadgeStyles, here because the editors take this sheet) for a host
     that gives \`linkDevices\`, else the sentence, cut short in a narrow
     list, its title holding the whole name. */
  ${yt}
  .badge.sp-linked {
    max-width: 140px; overflow: hidden; text-overflow: ellipsis; display: inline-block; line-height: 20px; white-space: nowrap;
    color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
  }
  .lc-btn.on { box-shadow: var(--wa-ring); }
  /* The save-first line in place of a status page's ticks, in the strip
     under the canvas head (libraryTicksStyles has the ticks). */
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
`;var Re=56,$n=40;var vn=56,as=76,_=Ee.screen;function zt(e){return Math.round(e*_.height/_.width)}var Vt=new WeakMap;function Ut(e,t,n,s){let a=Vt.get(e);a===void 0&&(a=new Map,Vt.set(e,a));let i=a.get(t);if(i!==void 0&&i.stamp.length===n.length&&i.stamp.every((d,p)=>d===n[p]))return i.picture;let o=s();return a.set(t,{stamp:n,picture:o}),o}function rs(e){let t=e.iphone===!0,n=e.width??(t?$n:Re),s=[e.states,e.icons,e.tick,e.pages];return Ut(e.page,`page:${t?"p":"w"}:${n}`,s,()=>xn(e,n,t))}function xn(e,t,n){let{page:s}=e,a=n?ct():void 0,i=a===void 0?_:pt(a),o=t/i.width,d=Math.min(Math.round(i.height*o),zt(Math.max(t,Re))),p=`width:${t}px;height:${d}px`;if(Oe(s))return r`<span class="lr-pic lr-smart ${n?"ph":""}" style=${`${p};background:${ft(s)}`} aria-hidden="true">${y("states")}</span>`;let c={page:s,pages:e.pages??[s],screen:i,scale:o,stateMode:"live",...e.states===void 0?{}:{states:e.states},...e.icons===void 0?{}:{icons:e.icons},...a===void 0?{}:{phone:a}},u=mt(s,i,{sideInset:gt(c)}),g=u.tiles.filter(l=>(u.topInset+l.y)*o<d),$=wt(s,o,i,void 0);return r`<span class="lr-pic ${n?"ph":""}" style=${`${p};background:${$.background}`} aria-hidden="true">
    ${$.layers}
    ${g.map(l=>r`<span class="lr-tile"
      style=${`left:${l.x*o}px;top:${(u.topInset+l.y)*o}px;width:${l.width*o}px;height:${l.height*o}px`}>${bt(l.tile,{width:l.width,height:l.height},c,u.unit)}</span>`)}
  </span>`}function os(e){let t=e.width??Re,n=zt(t),s=`width:${t}px;height:${n}px`,a=e.hass;return a===void 0?r`<span class="lr-pic lr-status" style=${s} aria-hidden="true"></span>`:Ut(e.page,`status:${t}`,[a.states,e.icons,e.tick],()=>r`<span class="lr-pic lr-status" style=${s} aria-hidden="true">
    ${Lt({page:e.page,hass:a,icons:e.icons??De,screen:_,scale:t/_.width})}
  </span>`)}var Ft,Pe=!1;function Sn(e){return Pe||customElements.get("wa-menu-thumbs")!==void 0?(Pe=!0,!0):(Ft??=import("./menu-thumbs-RCVG3ZNZ.js").then(()=>{Pe=!0}),Ft.then(e,()=>{}),!1)}var jt=new WeakMap;function ls(e){let t=e.height??vn,n=e.menu.unit;if(!Sn(e.onReady)||e.hass===void 0||e.icons===void 0)return r`<span class="lr-ring" style=${`width:${t}px;height:${t}px`} aria-hidden="true"></span>`;let s=jt.get(e.menu);return s===void 0&&(s=dt(e.menu),jt.set(e.menu,s)),r`<wa-menu-thumbs class="lr-menu" .hass=${e.hass} .icons=${e.icons} .tick=${e.tick??0} .menus=${s}
    .pages=${e.pages} .screen=${_} .height=${t} menu=${n}></wa-menu-thumbs>`}var ds=H`
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
`;export{ht as a,yt as b,Fn as c,jn as d,zn as e,P as f,Ht as g,Gt as h,Zt as i,Un as j,Wn as k,Jn as l,Lt as m,qn as n,Kn as o,Bn as p,vn as q,as as r,rs as s,os as t,ls as u,ds as v};
