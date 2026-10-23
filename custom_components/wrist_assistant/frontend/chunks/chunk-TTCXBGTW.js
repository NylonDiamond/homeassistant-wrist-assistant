import{$ as ht,A as D,B as be,C as se,D as ye,G as it,H as at,I as rt,J as ot,K as W,L as O,M as N,N as $e,O as dt,P as lt,Q as ie,R as ct,S as pt,T as ve,U as ut,V as gt,W as xe,X as mt,Y as _,Z as ft,_ as wt,aa as bt,ba as yt,g as L,ga as R,h as we,i as Qe,ia as ke,j as et,k as tt,l as U,m as te,n as nt,o as st,p as ne,pa as $t,qa as vt,ta as xt,u as he,v as S,va as kt,w as H,y as j,z}from"./chunk-R3YNEDKQ.js";import{l as Tt,m as Ct,q as Lt,s as Dt,x as Et}from"./chunk-F3NLV24L.js";import{h as St,j as Pt,n as Rt}from"./chunk-Q552DFFW.js";import{b as ee}from"./chunk-XF6VR4HJ.js";import{o as Je,w as Ge,x as Ye,y as Ze,z as Xe}from"./chunk-2YTAGEKK.js";import{c as pe}from"./chunk-ZOJGMATP.js";import{c as We}from"./chunk-SV3BTW33.js";import{A as Fe,Pb as ue,Sb as ge,Tb as Ke,Ub as Ue,Vb as C,Wb as je,X as Ve,Yb as me,ec as fe,gc as ze,z as Me}from"./chunk-EIDH5KF4.js";import{V as Be,r as qe}from"./chunk-VWJCPW77.js";import{b as I,d as o,g as f,mh as A,nh as v,zh as _e}from"./chunk-BDP52PL7.js";var rn=3;function It(e,t,n){if(e.length===0)return f;let s=e.slice(0,rn),i=e.length-s.length;return o`<span class="badge lk-badge" title=${t} role="img" aria-label=${t}>${s.map(a=>{let r=n(a.ownerId);return o`<span class="lk-dev" style=${r===void 0?f:`--dc:${r}`} aria-hidden="true">${v(a.kind==="iphone"?"phone":"watch")}</span>`})}${i>0?o`<span class="lk-more" aria-hidden="true">+${i}</span>`:f}</span>`}var At=I`
  .badge.lk-badge {
    display: inline-flex; align-items: center; gap: 1px; height: 20px; line-height: 20px; padding: 0 5px;
    color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
  }
  .lk-badge .lk-dev { display: inline-flex; color: var(--dc, var(--wa-accent)); }
  .lk-badge .lk-dev svg.ui-icon { width: 13px; height: 13px; stroke-width: 2; }
  .lk-badge .lk-more { margin-left: 2px; font-size: 10.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
`;function Vt(e,t){e.deletePage!==void 0?e.deletePage(t):e.edit(n=>at(n,t))}var E="status-pages",Ce="sp:page",F="sp:row",P="sp:add",q="sp:drag",B="sp:added",Kt="wrist-assistant-panel.status-pages.zoom.v1";function ls(e=pe()){try{let t=e?.getItem(Kt),n=t==null||t===""?NaN:Number(t);return Je.includes(n)?n:void 0}catch{return}}function cs(e,t=pe()){try{t?.setItem(Kt,e===void 0?"":String(e))}catch{}}var on="Pages the watch opens from a tile, a menu slot or Siri. A save reaches the watch the next time it checks.",ps="Drawn from Home Assistant's states now, as the watch draws the page. Tap a row to edit it.";function Z(e,t,n){return`${e} ${e===1?t:n}`}function G(e,t){let n=e.states[t]?.attributes?.friendly_name;return typeof n=="string"&&n.trim()!==""?n:t}function Ut(e,t){let n=t.indexOf(".");return{entityId:t,displayName:t===""?"":G(e,t),domain:n<0?"":t.slice(0,n)}}function dn(e){switch(e){case"battery_charging":return"charging";case"illuminance":return"light";case"occupancy":case"presence":return"occupancy";case"garage_door":case"garage":return"garage";case"carbon_monoxide":return"CO";default:return e.replaceAll("_"," ")}}function ln(e,t){if(t!==void 0&&t.length>0){let n=t.map(dn),s=n.length===1?n[0]:n.slice(0,2).join("/");return e==="sensor"||e==="binary_sensor"?`${s} sensors`:e==="cover"?s.includes("garage")?"garage doors":`${s} covers`:`${s} ${e}s`}return e==="person"?"people":e==="binary_sensor"?"binary sensors":`${e}s`}function Pe(e){let t=L(e),n=s=>`${s} ${s===1?"entity":"entities"}`;switch(t.rowType){case"entity":return t.entityId;case"groupCount":return`${n(t.groupEntityIds?.length??0)} \xB7 group count`;case"dynamicList":return t.dynamicMode==="all"?`all ${ln(t.domain,t.deviceClassFilter)} \xB7 dynamic list`:`${n(t.groupEntityIds?.length??0)} \xB7 dynamic list`;case"sectionHeader":return"section header";default:return t.rowType}}function jt(e){return ne.labels.StatusRowType?.[e]??e}function T(e){let t=he(e.document),n=e.uiState.get(Ce);return(typeof n=="string"?t.find(s=>D(S(s),n)):void 0)??t[0]}function zt(e,t){e.uiState.set(Ce,t),e.uiState.delete(F),e.uiState.delete(P),ce(e.uiState),e.requestUpdate()}function X(e){let t=e.uiState.get(F);return typeof t=="string"?se(T(e),t):void 0}function Q(e,t){t===void 0?e.uiState.delete(F):e.uiState.set(F,t),e.uiState.delete(P),ce(e.uiState),e.requestUpdate()}function cn(e){return X(e)===void 0&&!e.uiState.has(P)?!1:(e.uiState.delete(F),e.uiState.delete(P),ce(e.uiState),e.requestUpdate(),!0)}function Y(e){let t=e.uiState.get(P);return typeof t=="object"&&t!==null?t:void 0}function re(e,t){t===void 0?e.uiState.delete(P):(e.uiState.set(P,t),e.uiState.delete(F)),e.requestUpdate()}function pn(e,t="entity"){e.uiState.delete(B),ce(e.uiState),re(e,{kind:t,mode:"all",picked:[]})}function ae(e,t,n=!1){let s=T(e);if(s===void 0)return;let i=S(s),a;return e.edit(r=>{let d=ut(r,i,t);return a=d.id,d.document}),a!==void 0&&!n&&Q(e,a),a}function un(e){let t;e.edit(n=>{let s=it(n);return t=s.id,s.document}),t!==void 0&&zt(e,t)}function Wt(e,t,n,s,i){return{start:a=>{e.uiState.set(q,{list:t,id:n}),a.dataTransfer?.setData("text/plain",n),a.dataTransfer&&(a.dataTransfer.effectAllowed="move")},over:a=>{e.uiState.get(q)?.list===t&&(a.preventDefault(),a.dataTransfer&&(a.dataTransfer.dropEffect="move"))},drop:a=>{let r=e.uiState.get(q);e.uiState.delete(q),!(r?.list!==t||D(r.id,n))&&(a.preventDefault(),i(r.id,s))},end:()=>{e.uiState.delete(q)}}}function Le(e,t,n,s){return e.icons.render(t,n,s)??o`<span class="sp-glyph-dot" style=${`background:${s};width:${Math.max(4,n*.6)}px;height:${Math.max(4,n*.6)}px`}></span>`}function qt(e,t,n){return o`<span class="thumb sp-thumb" style=${`--c:${n}`} aria-hidden="true"><span class="sp-thumb-glyph">${Le(e,t,14,n)}</span></span>`}function Jt(e,t){let n=L(t);return n.rowType==="sectionHeader"?U.secondary:n.rowType==="entity"?te(n.domain,e.hass.states[n.entityId]?.state):te(n.domain,"on")}function gn(e,t){let n=e.linkDevices?.(t);if(n!==void 0)return It(n.others,`${n.title}. An edit here shows there too.`,n.colorOf);let s=e.linkBadge?.(t);return s===void 0?f:o`<span class="badge sp-linked" title=${`${s}. An edit here shows there too.`}>${s}</span>`}function mn(e,t,n,s,i){let a=S(t),r=H(t),d=i!==void 0&&D(a,S(i)),c=j(t).length,l=(w,p)=>e.edit(g=>rt(g,w,p)),u=Wt(e,"page",a,n,l),m=()=>{d||zt(e,a)},y=e.single===!0;return o`<div class="layer sp-page-row ${d?"hl":""}" data-page=${a} role="listitem" tabindex="0"
    draggable=${e.busy||y?"false":"true"} aria-current=${d?"true":"false"} aria-label=${r||"Untitled page"}
    @dragstart=${u.start} @dragover=${u.over} @drop=${u.drop} @dragend=${u.end}
    @click=${w=>{w.target instanceof Element&&w.target.closest("button")||m()}}
    @keydown=${w=>{w.target!==w.currentTarget||w.key!=="Enter"&&w.key!==" "||(w.preventDefault(),m())}}>
    <span class="grip" aria-hidden="true"></span>
    ${qt(e,"doc.text.fill","#5B8FD4")}
    <span class="name"><b><span class="nm-t">${r||"Untitled page"}</span></b><small>${Z(c,"row","rows")}</small></span>
    <span class="right">
      <span class="badges">${gn(e,t)}${ye(t)?o`<span class="badge" title="One of the app's starter pages. It is edited and put on devices like any other.">starter</span>`:f}</span>
      <span class="acts">
        ${y?f:o`<button type="button" class="icon" ?disabled=${e.busy||n===0} title="Move up" aria-label=${`Move ${r} up`}
          @click=${()=>l(a,n-1)}>${v("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||n===s-1} title="Move down" aria-label=${`Move ${r} down`}
          @click=${()=>l(a,n+1)}>${v("down")}</button>`}
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Delete" aria-label=${`Delete ${r}`}
          @click=${()=>Vt(e,a)}>${v("delete")}</button>
      </span>
    </span>
  </div>`}function us(e){let t=he(e.document),n=T(e);return o`<section class="card lc sp-pages-card" aria-label="Status pages" style="--c: var(--wa-lc-pages, #26a69a); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${v("list")}</span><span class="lc-title">Status pages</span>
      <span class="lc-sub" title=${on}>${Z(t.length,"page","pages")}</span>
      <span class="spacer"></span>
      ${e.single===!0?f:o`<button type="button" class="lc-btn pri sp-add-page" aria-label="Add status page" ?disabled=${e.busy}
        title="Add a status page" @click=${()=>un(e)}>${v("plus")}<span>Add</span></button>`}
    </div>
    ${t.length===0?o`<div class="lc-note">No status pages. Add one to show the live state of entities you pick.</div>`:o`<div class="layers sp-page-list" role="list">${t.map((s,i)=>mn(e,s,i,t.length,n))}</div>`}
    ${e.sharedLine===void 0||t.length===0?f:o`<div class="lc-note sp-shared-note" role="note">${e.sharedLine}</div>`}
    ${e.elsewhere??f}
  </section>`}function fn(e,t,n,s,i,a){let r=z(n),d=L(n),c=a!==void 0&&D(r,z(a)),l=d.isHidden===!0,u=d.displayName===""?"Display Name":d.displayName,m=(g,$)=>e.edit(b=>mt(b,t,g,$)),y=Wt(e,"row",r,s,m),w=()=>Q(e,r),p=d.rowType==="sectionHeader"?"line.horizontal.3":d.iconName;return o`<div class="layer sp-row-row ${c?"hl":""} ${l?"dim":""}" data-row=${r} role="listitem" tabindex="0"
    draggable=${e.busy?"false":"true"} aria-current=${c?"true":"false"} aria-label=${u}
    title=${`${u} \xB7 ${Pe(n)}${l?", hidden":""}`}
    @dragstart=${y.start} @dragover=${y.over} @drop=${y.drop} @dragend=${y.end}
    @click=${g=>{g.target instanceof Element&&g.target.closest("button")||w()}}
    @keydown=${g=>{g.target!==g.currentTarget||g.key!=="Enter"&&g.key!==" "||(g.preventDefault(),w())}}>
    <span class="grip" aria-hidden="true"></span>
    ${qt(e,p,Jt(e,n))}
    <span class="name"><b><span class="nm-t">${u}</span></b><small>${Pe(n)}</small></span>
    <span class="right">
      <span class="badges">${l?o`<span class="badge">hidden</span>`:f}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${e.busy} title=${l?"Show":"Hide"} aria-label=${`${l?"Show":"Hide"} ${u}`}
          @click=${()=>e.edit(g=>_(g,t,r,"isHidden",!l))}>${v(l?"show":"hide")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||s===0} title="Move up" aria-label=${`Move ${u} up`}
          @click=${()=>m(r,s-1)}>${v("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||s===i-1} title="Move down" aria-label=${`Move ${u} down`}
          @click=${()=>m(r,s+1)}>${v("down")}</button>
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Remove" aria-label=${`Remove ${u}`}
          @click=${()=>e.edit(g=>xe(g,t,r))}>${v("delete")}</button>
      </span>
    </span>
  </div>`}function gs(e){let t=T(e),n=t===void 0?[]:j(t),s=X(e),i=t===void 0?"":S(t),a;t===void 0?a=o`<div class="lc-note">Add a status page to give it rows.</div>`:n.length===0?a=o`<div class="lc-note">No rows yet. Add entities to show in this status page.</div>`:a=o`<div class="layers sp-row-list" role="list">${n.map((d,c)=>fn(e,i,d,c,n.length,s))}</div>
    <div class="lc-note sp-drag-note">Drag a row, or use its arrows, to reorder.</div>`;let r=Y(e)!==void 0;return o`<section class="card lc sp-rows-card" aria-label="Rows" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${v("layers")}</span><span class="lc-title">Rows</span>
      ${t===void 0?f:o`<span class="lc-sub">${Z(n.length,"row","rows")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-row ${r?"on":""}" aria-label="Add row" ?disabled=${e.busy||t===void 0}
        title="Add an entity, a group count, a dynamic list or a header" @click=${()=>pn(e)}>${v("plus")}<span>Add</span></button>
    </div>
    ${a}
  </section>`}var oe={small:{row:10,compact:9,icon:14},medium:{row:12,compact:10,icon:16},large:{row:14,compact:12,icon:18}},De={regular:400,medium:500,semibold:600,bold:700},de={default:"-apple-system, system-ui, 'SF Pro Text', 'Helvetica Neue', sans-serif",rounded:"ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, monospace",serif:"ui-serif, 'New York', Georgia, serif"},Ht={ultraThin:.1,thin:.13,regular:.16,thick:.2,ultraThick:.24};function wn(e){let t=n=>{let s=W().find(i=>i.key===n);return N(e,s)};return{rowStyle:String(t("rowStyle")),textSize:String(t("textSize")),fontWeight:String(t("fontWeight")),fontDesign:String(t("fontDesign")),rowSpacing:Number(t("rowSpacing")),backgroundMaterial:String(t("backgroundMaterial")),columnLayout:String(t("columnLayout")),showDividers:t("showDividers")===!0,iconPosition:String(t("iconPosition")),horizontalPadding:Number(t("horizontalPadding"))}}function Ee(e){return U[e]??U.secondary}function Bt(e,t){return e.rowStyle==="pillFilled"?`background:color-mix(in srgb, ${t} 15%, transparent);`:e.rowStyle==="pillOutline"?`box-shadow:inset 0 0 0 0.75px color-mix(in srgb, ${t} 40%, transparent);`:""}function le(e,t,n,s,i){let a=Ee(n.color);return o`<span class="sp-w-icon" style=${`width:${s*i}px`}>${Le(e,n.icon,Math.round(s*.8*i),a)}</span>`}function Ot(e,t,n,s){let i=e.scale,a=oe[t.textSize]??oe.medium,r=s!==void 0&&D(s,n.rowId),d=()=>Q(e,n.rowId);if(n.kind==="sectionHeader")return o`<div class="sp-w-header ${r?"on":""}" style=${`font-size:${9*i}px;text-align:${n.align==="center"?"center":n.align==="trailing"?"right":"left"}`}
      @click=${d}>${n.label}</div>`;let c=Ee(n.color),l=t.rowStyle==="plain";return o`<div class="sp-w-row ${r?"on":""}" title=${n.entityId??n.label}
    style=${`gap:${6*i}px;font-size:${a.row*i}px;font-weight:${De[t.fontWeight]??400};padding:${l?0:4*i}px ${l?0:8*i}px;border-radius:${6*i}px;${Bt(t,c)}`}
    @click=${d}>
    ${t.iconPosition==="leading"?le(e,t,n,a.icon,i):f}
    <span class="sp-w-label">${n.label}</span>
    <span class="sp-w-value" style=${`color:${c}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?le(e,t,n,a.icon,i):f}
  </div>`}function Nt(e,t,n,s){let i=e.scale,a=oe[t.textSize]??oe.medium,r=s!==void 0&&D(s,n.rowId),d=Ee(n.color),c=t.rowStyle==="plain";return o`<div class="sp-w-cell ${r?"on":""}" title=${n.label}
    style=${`gap:${3*i}px;font-size:${a.compact*i}px;font-weight:${De[t.fontWeight]??400};padding:${c?0:3*i}px ${c?0:6*i}px;border-radius:${6*i}px;${Bt(t,d)}`}
    @click=${()=>Q(e,n.rowId)}>
    ${t.iconPosition==="leading"?le(e,t,n,a.icon,i):f}
    <span class="sp-w-value" style=${`color:${d}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?le(e,t,n,a.icon,i):f}
  </div>`}function _t(e){return o`<div class="sp-w-divider" style=${`height:${Math.max(1,.5*e)}px`}></div>`}function ms(e){let t=e.phone===void 0?"Status page on the watch":"Status page on the iPhone";return Rt(e.phone,e.screen,e.scale,Yt(e,t),t,e.icons)}function Gt(e){let t={hass:e.hass,icons:e.icons,screen:e.screen,scale:e.scale,uiState:new Map([[Ce,S(e.page)]]),document:{statusPages:[e.page]},requestUpdate:()=>{}};return Yt(t,`${H(e.page)||"Untitled page"} on the watch`)}function Yt(e,t){let{width:n,height:s}=e.screen,i=e.scale,a=T(e),r=X(e),d=r===void 0?void 0:z(r),c;if(a===void 0)c=o`<p class="sp-w-empty">No status page.</p>`;else{let l=wn(a),u=st(a,e.hass.states),m=l.columnLayout==="twoColumn"?nt(u).map((w,p,g)=>o`${w.kind==="header"?Ot(e,l,w.row,d):o`<div class="sp-w-pair" style=${`gap:${8*i}px`}>${Nt(e,l,w.first,d)}${w.second===void 0?o`<span class="sp-w-cell sp-w-spacer"></span>`:Nt(e,l,w.second,d)}</div>`}
          ${l.showDividers&&p<g.length-1?_t(i):f}`):u.map((w,p)=>o`${Ot(e,l,w,d)}${l.showDividers&&p<u.length-1?_t(i):f}`),y=Ht[l.backgroundMaterial]??Ht.regular;c=o`<div class="sp-w-scroll" style=${`padding:${30*i}px ${6*i}px ${12*i}px;gap:${12*i}px`}>
      <div class="sp-w-card" style=${`padding:${8*i}px ${(6+l.horizontalPadding)*i}px;border-radius:${14*i}px;background:rgba(255,255,255,${y});font-family:${de[l.fontDesign]??de.default}`}>
        <div class="sp-w-rows" style=${`gap:${l.rowSpacing*i}px;padding:${4*i}px 0`}>
          ${u.length===0?o`<span class="sp-w-none" style=${`font-size:${11*i}px`}>${j(a).length===0?"Add entities":"Nothing to show now"}</span>`:m}
        </div>
      </div>
      <div class="sp-w-done" style=${`font-size:${15*i}px;padding:${12*i}px 0;border-radius:${20*i}px`}>Done</div>
    </div>`}return o`<div class="sp-screen" role="group" aria-label=${t}
    style=${`width:${Math.round(n*i)}px;min-height:${Math.round(s*i)}px`}>${c}</div>`}function fs(e){let t=T(e);if(t===void 0)return[];let n=j(t),s=n.filter(i=>i.isHidden===!0).length;return[Z(n.length,"row","rows")+(s>0?`, ${s} hidden`:"")]}function Zt(e,t){return Ge(e.uiState,E,t)}function hn(e,t){Ye(e.uiState,E,t,!Zt(e,t)),e.requestUpdate()}var bn={row:{color:A.content,icon:"content"},add:{color:A.content,icon:"plus"},page:{color:A.place,icon:"text"},rows:{color:"var(--wa-hue-yellow)",icon:"checklist"},text:{color:A.place,icon:"text"},more:{color:A.place,icon:"look"}},yn=["look-rows","look-text","look-more"];function M(e,t,n,s,i,a={}){let r=Zt(e,n),d=bn[t];return _e({color:d.color,icon:v(d.icon),title:s,open:r,onToggle:()=>hn(e,n),...a.summary===void 0||a.summary===""?{}:{summary:a.summary},dot:a.dot===!0,id:`${E}:${n}`},r?i:o``)}function $n(e){if(Y(e)!==void 0)return[{module:E,section:"add"}];let t=yn.map(n=>({module:E,section:n}));return X(e)!==void 0?[{module:E,section:"row"},...t]:[{module:E,section:"page"},...t]}var Xt=":order";function vn(e,t,n,s){let i=n.trim().toLowerCase(),a=new Set(t),r=e.filter(d=>i===""||d.toLowerCase().includes(i)||s(d).toLowerCase().includes(i));return[...r.filter(d=>a.has(d)),...r.filter(d=>!a.has(d))]}function ce(e){for(let t of[...e.keys()])t.endsWith(Xt)&&e.delete(t)}function Qt(e,t,n,s,i){let a=`${t}:q`,r=`${t}${Xt}`,d=String(e.uiState.get(a)??"").trim().toLowerCase(),c=new Set(s),l=e.uiState.get(r);(l===void 0||l.query!==d)&&(l={query:d,first:[...s]},e.uiState.set(r,l));let u=vn(n,l.first,d,y=>G(e.hass,y)),m=u.slice(0,200);return o`<div class="sp-pick">
    <input type="search" class="sp-pick-q" placeholder="Search entities" aria-label="Search entities" .value=${String(e.uiState.get(a)??"")}
      @input=${y=>{e.uiState.set(a,y.target.value),e.requestUpdate()}} />
    <div class="sp-pick-list" role="group" aria-label="Entities">
      ${m.length===0?o`<div class="sp-pick-none">${n.length===0?"No entity of this kind in Home Assistant.":"No entity matches."}</div>`:f}
      ${Fe(m,y=>y,y=>o`<label class="sp-pick-row">
        <input type="checkbox" .checked=${Me(c.has(y))} ?disabled=${e.busy}
          @change=${w=>i(y,w.target.checked)} />
        <span class="sp-pick-name">${G(e.hass,y)}</span><code>${y}</code>
      </label>`)}
      ${u.length>m.length?o`<div class="sp-pick-none">${u.length-m.length} more. Search to narrow the list.</div>`:f}
    </div>
  </div>`}function xn(e,t,n){let s=S(t),i=z(n),a=L(n),r=(p,g,$)=>e.edit(b=>_(b,s,i,p,g),$),d=a.rowType==="sectionHeader",c=a.rowType==="groupCount"||a.rowType==="dynamicList",l=a.rowType==="dynamicList"&&a.dynamicMode==="all",u=a.rowType==="groupCount"||a.rowType==="dynamicList"&&!l,m=[];m.push(C("Visibility",a.isHidden===!0?"hidden":"visible",[["visible","Visible"],["hidden","Hidden"]],p=>r("isHidden",p==="hidden"))),m.push(ge("Label",a.displayName,p=>r("displayName",p,`row:${i}:label`),{placeholder:"Display Name"})),d?m.push(C("Alignment",a.headerAlignment??"leading",O("HeaderAlignment"),p=>r("headerAlignment",p))):m.push(o`<div class="ts-stack">${ze({icons:e.icons,symbols:e.symbols},a.iconName,p=>r("iconName",p,`row:${i}:icon`),`sp:icon:${i}`)}</div>`),a.rowType==="entity"&&m.push(o`<div class="ts-stack">${fe({hass:e.hass},"Entity",Ut(e.hass,a.entityId),p=>{let g=p.entityId.trim();g!==""&&e.edit($=>{let b=_($,s,i,"entityId",g),h=ie(g,e.hass.states);return b=_(b,s,i,"domain",h.domain),a.iconName===ie(a.entityId).iconName&&(b=_(b,s,i,"iconName",h.iconName)),b})},`sp:entity:${i}`,{clearable:!1})}</div>`);let y=!1;if(c&&a.domain!=="sensor"){let p=Qe(a.domain,a.deviceClassFilter);if(p.length>=2){y=!0;let g=we(a),$=p.map(b=>[b.value,b.label]);$.some(([b])=>b===g)||$.push([g,tt(g)]),m.push(C("Show State",g,$,b=>r("filterState",b)))}}if(a.rowType==="dynamicList"){m.push(C("Entities",l?"all":"specific",O("DynamicMode"),$=>r("dynamicMode",$))),m.push(me("Show all states",a.showAllStates===!0,$=>r("showAllStates",$?!0:void 0),!1));let p=y?"only those in the state above":`only those whose state is \u201C${we(a)}\u201D`,g=a.maxNumericValue===void 0?"":" Either way, the max value below still applies.";m.push(o`<div class="hint ts-under">On: every entity is listed whatever its state. Off: ${p}.${g}</div>`)}if((a.domain==="sensor"?c:a.rowType==="dynamicList"&&a.maxNumericValue!==void 0)&&(m.push(Ke(et(a.deviceClassFilter),a.maxNumericValue,p=>r("maxNumericValue",p,`row:${i}:max`),{optional:!0,placeholder:"No limit",def:null})),m.push(o`<div class="hint ts-under">Only states at or below it count. Empty is no limit.</div>`)),c){let p=a.deviceClassFilter??[],g=ht(a.domain,e.hass.states,p),$=b=>{let h=L(se(be(e.document,s),i)??n).deviceClassFilter??[],k=h.includes(b)?h.filter(K=>K!==b):[...h,b];r("deviceClassFilter",k.length===0?void 0:k)};m.push(o`<div class="field sp-classes"><span>Device classes</span>
      <div class="sp-chips" role="group" aria-label="Device classes">
        ${g.length===0?o`<span class="hint">None reported for ${a.domain===""?"this row":a.domain}.</span>`:f}
        ${g.map(b=>{let h=p.includes(b);return o`<button type="button" class="pe-chip ${h?"on":""}" aria-pressed=${h?"true":"false"} ?disabled=${e.busy}
            @click=${()=>$(b)}>${b.replaceAll("_"," ")}</button>`})}
      </div></div>
      <div class="hint ts-under">${p.length===0?"None picked: every class counts.":"Only entities of these classes count."}</div>`)}if(u){let p=a.groupEntityIds??[],g=ft(n,e.hass.states);m.push(o`<div class="field sp-entities-field"><span>Edit Entities (${p.length})</span></div>
      ${Qt(e,`sp:ents:${i}`,g,p,($,b)=>{let h=L(se(be(e.document,s),i)??n).groupEntityIds??[],k=b?h.includes($)?h:[...h,$]:h.filter(K=>K!==$);r("groupEntityIds",k)})}`)}let w=o`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Row">${m}</fieldset>`;return o`${M(e,"row","row",jt(a.rowType),w,{summary:Pe(n)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this row from the page"
        @click=${()=>e.edit(p=>xe(p,s,i))}>${v("delete")}<span>Remove</span></button>
    </div>`}function kn(e,t,n,s){let i=N(n,s),a=(r,d)=>e.edit(c=>$e(c,t,s.key,r),d);switch(s.kind){case"switch":return o`${me(s.label,i===!0,r=>a(r),s.default)}
        ${s.help===void 0?f:o`<div class="hint ts-under">${s.help}</div>`}`;case"slider":return je(s.label,Number(i),r=>a(r,`style:${t}:${s.key}`),{min:s.min??0,max:s.max??1,step:s.step??1,def:Number(s.default),...s.unit===void 0?{}:{unit:s.unit}});default:{let r=ne.types.page.keys[s.key]?.enum??"",d=O(r);return d.length<=4?C(s.label,String(i),d,c=>a(c),{def:String(s.default)}):Ue(s.label,String(i),d,c=>a(c),{def:String(s.default),snapBack:!0})}}}var Re=["rowStyle","columnLayout","iconPosition"],Te=["textSize","fontDesign","fontWeight"],Mt=new Set([...Re,...Te]),Sn={small:12,medium:15,large:18};function Pn(e,t,n){let s=W().find(l=>l.key===n);if(s===void 0)return;let i=S(t),a=String(N(t,s)),r=O(ne.types.page.keys[n]?.enum??""),d=r.find(([l])=>l===a)?.[1]??a;return{field:s,value:a,choices:r,name:d,set:l=>{l!==String(N(T(e)??t,s))&&e.edit(u=>$e(u,i,n,l))}}}function Se(e,t){return W().some(n=>t(n.key)&&!Be(N(e,n),n.default))}function J(e,t,n,s=""){let i=a=>t.choices.find(([r])=>r===a)?.[1]??a;return o`<div class="sp-look">
    <div class="sp-look-title">${ue(e,t.value,String(t.field.default),a=>t.set(a),i)}</div>
    <div class="sp-pics ${s}" role="group" aria-label=${e} style=${`--n:${t.choices.length}`}>
      ${t.choices.map(([a,r])=>{let d=a===t.value;return o`<button type="button" class="sp-pic ${d?"on":""}" aria-pressed=${d?"true":"false"} aria-label=${`${e}: ${r}`}
          @click=${()=>t.set(a)}>${n(a,r)}</button>`})}
    </div>
  </div>`}function Rn(e,t){return o`<span class="sp-pic-well ${e}" aria-hidden="true"><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function Tn(e,t){return o`<span class="sp-pic-grid ${e==="twoColumn"?"two":""}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function Cn(e,t){let n=o`<i class="sp-pic-dot" aria-hidden="true"></i>`;return o`${e==="leading"?n:f}<span class="sp-pic-name">${t}</span>${e==="trailing"?n:f}`}function Ln(e,t){return o`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:${Sn[e]??15}px`}>Aa</span><span class="sp-pic-name sub">${t}</span>`}function Dn(e,t){return o`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:18px;font-family:${de[e]??de.default}`}>Ag</span><span class="sp-pic-name sub">${t}</span>`}function En(e){let t=n=>e.choices.find(([s])=>s===n)?.[1]??n;return o`<div class="field seg-field sp-weight-field">${ue("Weight",e.value,String(e.field.default),n=>e.set(n),t)}
    <div class="seg wide sp-weight" role="group" aria-label="Weight">
      ${e.choices.map(([n,s])=>{let i=n===e.value;return o`<button type="button" class=${i?"on":""} aria-pressed=${i?"true":"false"} aria-label=${`Weight: ${s}`}
          style=${`--w:${De[n]??400}`} @click=${()=>e.set(n)}>${s}</button>`})}
    </div></div>`}function Ft(e,t){let n=S(t),s=h=>Pn(e,t,h),[i,a,r]=Re.map(s),[d,c,l]=Te.map(s),u=h=>h.filter(k=>k!==void 0).map(k=>k.name).join(", "),m=Se(t,h=>Re.includes(h)),y=Se(t,h=>Te.includes(h)),w=Se(t,h=>!Mt.has(h)),p=lt(t),g=M(e,"rows","look-rows","Rows",o`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Rows">
    ${i===void 0?f:J("Style",i,Rn)}
    ${a===void 0?f:J("Layout",a,Tn,"across")}
    ${r===void 0?f:J("Icon",r,Cn,"inline")}
  </fieldset>`,{summary:u([i,a]),dot:m}),$=M(e,"text","look-text","Text",o`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Text">
    ${d===void 0?f:J("Size",d,Ln,"type")}
    ${c===void 0?f:J("Font",c,Dn,"type")}
    ${l===void 0?f:En(l)}
  </fieldset>`,{summary:u([d,l,c]),dot:y}),b=M(e,"more","look-more","More",o`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="More">
    ${W().filter(h=>!Mt.has(h.key)).map(h=>kn(e,n,t,h))}
  </fieldset>`,{summary:w?"Changed":"Defaults",dot:w});return o`${g}${$}${b}
    <div class="sp-acts">
      <button type="button" class="pe-btn" ?disabled=${e.busy||!p} title="Put the page's whole look back to the app's defaults"
        @click=${()=>e.edit(h=>dt(h,n))}>${v("reset")}<span>Reset to Defaults</span></button>
    </div>`}function In(e,t){let n=S(t),s=H(t);return M(e,"page","page","Page",o`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Page">
    ${ge("Name",s,i=>e.edit(a=>ot(a,n,i),`page:${n}:name`),{placeholder:"Page Name"})}
    ${ye(t)?o`<div class="hint ts-under">One of the app's starter pages. It is edited, put on devices and deleted like any other.</div>`:f}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Delete this status page"
        @click=${()=>Vt(e,n)}>${v("delete")}<span>Delete page</span></button>
    </div>
  </fieldset>`,{summary:s})}function An(e,t,n,s){let i=te(t.domain,"on");return o`<button type="button" class="sp-preset ${n?"on":""}" aria-pressed=${n?"true":"false"} ?disabled=${e.busy} @click=${s}>
    <span class="sp-preset-glyph">${Le(e,t.icon,18,i===U.secondary?"#5B8FD4":i)}</span>
    <span class="sp-preset-label">${t.label}</span>
  </button>`}function Hn(e,t,n){let s=c=>re(e,{...n,...c}),i=e.uiState.get(B),a=[["entity","Entity"],["groupCount","Group Count"],["dynamicList","Dynamic List"],["header","Header"]],r=C("Add",n.kind,a,c=>{if(c==="header"){ae(e,ct());return}e.uiState.delete(B),s({kind:c,preset:void 0,picked:[],mode:"all"})}),d;if(n.kind==="entity"){let c=Number(e.uiState.get(`${P}:n`)??0)||0;d=o`<div class="ts-stack">${fe({hass:e.hass},"Entity",Ut(e.hass,""),l=>{let u=l.entityId.trim();if(u==="")return;e.uiState.set(`${P}:n`,c+1);let m=T(e);if(m!==void 0&&gt(m,u)){e.uiState.set(B,`${G(e.hass,u)} is on this page already.`),e.requestUpdate();return}ae(e,ie(u,e.hass.states),!0),e.uiState.set(B,`Added ${G(e.hass,u)}.`),e.requestUpdate()},`sp:add:entity:${c}`,{clearable:!1})}</div>
      <div class="hint">Each entity is one row. Pick another to add it too.</div>`}else{let c=n.kind==="groupCount"?bt():yt(),l=n.preset===void 0?void 0:c[n.preset],u=n.kind==="groupCount"||n.mode==="specific",m=n.kind==="groupCount"?"Counts how many of the entities you pick are in a state.":"Pick what to show. Each matching entity becomes its own row. You can switch to hand-picked entities after adding.",y=o`<div class="sp-presets" role="group" aria-label=${n.kind==="groupCount"?"Group Count":"Dynamic List"}>
      ${c.map((p,g)=>An(e,p,n.preset===g,()=>{if(!u){ae(e,ve(p));return}s({preset:g,picked:[]})}))}
    </div>`,w=f;if(u&&l!==void 0){let p=n.kind==="groupCount"?l.picker==="deviceClass"?l.deviceClassFilter:void 0:l.deviceClassFilter,g=wt(l.domain,p,e.hass.states);w=o`<div class="field sp-entities-field"><span>${l.label}: ${Z(n.picked.length,"entity","entities")} picked</span></div>
        ${Qt(e,`${P}:pick`,g,n.picked,($,b)=>{let h=Y(e)??n,k=h.picked.filter(K=>K!==$);re(e,{...h,picked:b?[...k,$]:k})})}
        <div class="sp-acts">
          <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy}
            @click=${()=>{let $=(Y(e)??n).picked;ae(e,n.kind==="groupCount"?pt(l,$):ve(l,$))}}>
            ${v("plus")}<span>Add ${n.kind==="groupCount"?"group count":"dynamic list"}</span></button>
        </div>`}d=o`<p class="hint">${m}</p>
      ${n.kind==="dynamicList"?C("Entities",n.mode,O("DynamicMode"),p=>s({mode:p,preset:void 0,picked:[]})):f}
      ${y}${w}`}return o`${M(e,"add","add","Add a row",o`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Add a row">
    ${r}${d}
    ${typeof i=="string"?o`<div class="hint sp-added" role="status">${i}</div>`:f}
  </fieldset>`,{summary:H(t)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn" @click=${()=>re(e,void 0)}>Done</button>
    </div>`}function ws(e){let t=T(e);if(t===void 0)return o`<div class="insp-head"><div class="crumbs"><span class="nm">No status page</span></div></div>
      <div class="insp-body"><p class="sp-note">Add a status page to edit it.</p></div>`;let n=H(t)||"Untitled page",s=X(e),i=Y(e),a=$n(e),r=Ze(e.uiState,a),d,c;if(i!==void 0)d=o`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>cn(e)}>${n}</button><span class="sep">›</span><span class="nm">Add a row</span></div>`,c=Hn(e,t,i);else if(s!==void 0){let l=L(s),u=l.displayName===""?"Display Name":l.displayName;d=o`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>Q(e,void 0)}>${n}</button><span class="sep">›</span><span class="kchip" style=${`--k:${Jt(e,s)}`}>${jt(l.rowType)}</span><span class="nm" title=${u}>${u}</span></div>`,c=o`${xn(e,t,s)}${Ft(e,t)}`}else d=o`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">Page</span><span class="nm" title=${n}>${n}</span></div>`,c=o`${In(e,t)}${Ft(e,t)}
      <p class="sp-note">Select a row to edit it, or add one.</p>`;return o`<div class="insp-head">
      ${d}
      <button class="expand" @click=${()=>{Xe(e.uiState,a,!r),e.requestUpdate()}}>${r?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${c}</div>`}var hs=I`
  .sp-pages-card > .layers, .sp-rows-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .sp-pages-card > .lc-note, .sp-rows-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .sp-rows-card > .lc-note.sp-drag-note { margin-top: 0; font-size: 11.5px; }
  .sp-pages-card > .lc-note.sp-shared-note { margin-top: 0; font-size: 11.5px; }
  /* The badge of a status page other devices have too: the device icons
     (linkBadgeStyles, here because the editors take this sheet) for a host
     that gives \`linkDevices\`, else the sentence, cut short in a narrow
     list, its title holding the whole name. */
  ${At}
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
`;var On="Each watch and iPhone shows the pages ticked for it, and an edit shows everywhere.",Nn="A status page is a read-only screen of rows that a tile or a menu slot opens.";function x(e,t=1){let n=e==="status_pages"?"status page":"page";return t===1?n:`${n}s`}function _n(e){return e==="status_pages"?"a status page":"a page"}function vs(e){return`Only a Home Assistant administrator can make a new ${x(e)}.`}function xs(e){return e==="status_pages"?"Status pages":"Pages"}function ks(e,t="pages"){return e===0?`Your ${x(t)} library is empty.`:`Your ${x(t)} library: ${e} ${x(t,e)}. ${t==="status_pages"?Nn:On}`}function Ss(e,t){return t?`Make ${_n(e)} once, then tick each watch or iPhone that should show it.`:`Ask a Home Assistant administrator to make the first ${x(e)}.`}function Ps(e,t,n=!1){let s=x(e);if(n)return`Click ${x(e,2)} to pick them. Shift+click picks every ${s} between two.`;if(t!==void 0){let i=ee(t.kind);return e==="status_pages"?`Click a status page to edit it. Drag to order. The order is this ${i}'s own.`:`Click a page to edit it. Drag to order, and Hide here keeps a page on this ${i} without showing it.`}return e==="status_pages"?"Click a status page to edit it. Tick a device to put it there.":"Click a page to edit it. Tick a device to show the page there. One page, the same everywhere."}function Rs(e){return e.starter?`${e.detail} \xB7 starter`:e.detail}var He="all";function Ts(e,t,n,s=()=>{}){return[{id:He,label:"All",count:t===void 0?0:ke(t,n).length},...e.map(i=>{let a=s(i.ownerId);return{id:i.ownerId,label:i.name,kind:i.kind,...a===void 0?{}:{color:a},count:t===void 0?0:kt(t,i.ownerId,n)}})]}function Cs(e,t){return e!==void 0&&t.some(n=>n.ownerId===e)?e:He}function Mn(e){return e.some(t=>t.kind==="watch")&&e.some(t=>t.kind==="iphone")}function Ls(e,t){return e!==void 0&&e!=="all"&&Mn(t)?e:"all"}function Ie(e,t,n){return t==="all"||n.some(s=>s.kind===t&&e.some(i=>R(i,s.ownerId)))}function Ds(e,t){return[{key:"all",label:"All",count:e.length},{key:"watch",label:"Watches",count:e.filter(n=>Ie(n.owners,"watch",t)).length},{key:"iphone",label:"iPhones",count:e.filter(n=>Ie(n.owners,"iphone",t)).length}]}function Ae(e,t){let n=t.trim().toLowerCase();return n===""||e.toLowerCase().includes(n)}function Es(e,t,n="",s="all",i=[]){return ke(e,t).filter(a=>Ae(a.name,n)&&Ie(a.owners,s,i))}function Is(e,t,n,s=""){return{device:t,picks:$t(e,t.ownerId,n).filter(i=>Ae(i.entry.name,s)),rest:vt(e,t.ownerId,n).filter(i=>Ae(i.name,s))}}function As(e,t){if(t===void 0)return[...e];let n=t.flatMap(s=>e.filter(i=>R(i.id,s)));return[...n,...e.filter(s=>!n.includes(s))]}function Fn(e,t,n){let s=e.findIndex(a=>R(a,t)),i=e.findIndex(a=>R(a,n));if(!(s<0||i<0||s===i))return i<s?e[i]:i+1<e.length?e[i+1]:null}function Hs(e,t,n){let s=Fn(e,t,n);return s===void 0?void 0:{id:t,before:s}}function Os(e,t,n){let s=e.filter(r=>!R(r,t)),i=n===null?-1:s.findIndex(r=>R(r,n)),a=e.find(r=>R(r,t))??t;return i<0?[...s,a]:[...s.slice(0,i),a,...s.slice(i)]}function Ns(e,t,n,s){let i=s.filter(a=>e.owners.some(r=>R(r,a.ownerId)));return(t===He?void 0:i.find(a=>a.ownerId===t))??(n==="all"?void 0:i.find(a=>a.kind===n))??i.find(a=>a.kind==="watch")??i[0]}function _s(e){return`Edit ${e} in the library`}function Ms(e){return`On ${e.name}`}function Fs(e){return`Drag to order. The order is this ${ee(e.kind)}'s own.`}function Vs(e){return`Not on this ${ee(e.kind)}`}function Vn(e){return`${e.charAt(0).toUpperCase()}${e.slice(1)} on your other devices, or on none yet. Add one here with its Add chip.`}var Ks=Vn("pages");function Us(e,t,n,s,i=!0){return n.trim()!==""?`No ${x(t)} on ${e.name} has that name.`:s===0?i?`No ${x(t,2)} on ${e.name} yet. Use New ${x(t)} to make one.`:`No ${x(t,2)} on ${e.name} yet. Ask a Home Assistant administrator to make the first one.`:i?`No ${x(t,2)} on ${e.name} yet. Tick one below, or make a new one.`:`No ${x(t,2)} on ${e.name} yet. Tick one below.`}function js(e,t,n="all",s="pages"){if(e.length===0)return"No watch or iPhone has connected yet. Pair one on the Home tab.";let i=x(s);return t.trim()!==""?`No ${i} has that name.`:n!=="all"?`No ${i} here is on ${n==="watch"?"a watch":"an iPhone"}.`:s==="status_pages"?"Your home has no status pages yet. Use New status page to make one.":"Your home has no pages yet. Use New page to make one."}var Ne=56,Kn=40;var Un=56,ei=76,V=Ve.screen;function sn(e){return Math.round(e*V.height/V.width)}var en=new WeakMap;function an(e,t,n,s){let i=en.get(e);i===void 0&&(i=new Map,en.set(e,i));let a=i.get(t);if(a!==void 0&&a.stamp.length===n.length&&a.stamp.every((d,c)=>d===n[c]))return a.picture;let r=s();return i.set(t,{stamp:n,picture:r}),r}function ti(e){let t=e.iphone===!0,n=e.width??(t?Kn:Ne),s=[e.states,e.icons,e.tick,e.pages],i=e.look??"iphone";return an(e.page,`page:${t?`p:${i}`:"w"}:${n}`,s,()=>jn(e,n,t,i))}function jn(e,t,n,s){let{page:i}=e,a=n?St(void 0,{look:s}):void 0,r=a===void 0?V:Pt(a),d=t/r.width,c=Math.min(Math.round(r.height*d),sn(Math.max(t,Ne))),l=`width:${t}px;height:${c}px`;if(qe(i))return o`<span class="lr-pic lr-smart ${n?"ph":""}" style=${`${l};background:${Lt(i)}`} aria-hidden="true">${v("states")}</span>`;let u={page:i,pages:e.pages??[i],screen:r,scale:d,stateMode:"live",...e.states===void 0?{}:{states:e.states},...e.icons===void 0?{}:{icons:e.icons},...a===void 0?{}:{phone:a}},m=Ct(i,r,{sideInset:Tt(u)}),y=m.tiles.filter(p=>(m.topInset+p.y)*d<c),w=Dt(u,i,d,r,void 0);return o`<span class="lr-pic ${n?"ph":""}" style=${`${l};background:${w.background}`} aria-hidden="true">
    ${w.layers}
    ${y.map(p=>o`<span class="lr-tile"
      style=${`left:${p.x*d}px;top:${(m.topInset+p.y)*d}px;width:${p.width*d}px;height:${p.height*d}px`}>${Et(p.tile,{width:p.width,height:p.height},u,m.unit)}</span>`)}
  </span>`}function ni(e){let t=e.width??Ne,n=sn(t),s=`width:${t}px;height:${n}px`,i=e.hass;return i===void 0?o`<span class="lr-pic lr-status" style=${s} aria-hidden="true"></span>`:an(e.page,`status:${t}`,[i.states,e.icons,e.tick],()=>o`<span class="lr-pic lr-status" style=${s} aria-hidden="true">
    ${Gt({page:e.page,hass:i,icons:e.icons??We,screen:V,scale:t/V.width})}
  </span>`)}var tn,Oe=!1;function zn(e){return Oe||customElements.get("wa-menu-thumbs")!==void 0?(Oe=!0,!0):(tn??=import("./menu-thumbs-KMSIITSI.js").then(()=>{Oe=!0}),tn.then(e,()=>{}),!1)}var nn=new WeakMap;function si(e){let t=e.height??Un,n=e.menu.unit;if(!zn(e.onReady)||e.hass===void 0||e.icons===void 0)return o`<span class="lr-ring" style=${`width:${t}px;height:${t}px`} aria-hidden="true"></span>`;let s=nn.get(e.menu);return s===void 0&&(s=xt(e.menu),nn.set(e.menu,s)),o`<wa-menu-thumbs class="lr-menu" .hass=${e.hass} .icons=${e.icons} .tick=${e.tick??0} .menus=${s}
    .pages=${e.pages} .screen=${V} .height=${t} menu=${n}></wa-menu-thumbs>`}var ii=I`
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
`;export{It as a,At as b,ls as c,cs as d,ps as e,T as f,zt as g,cn as h,un as i,us as j,gs as k,ms as l,Gt as m,fs as n,ws as o,hs as p,x as q,_n as r,vs as s,xs as t,ks as u,Ss as v,Ps as w,Rs as x,He as y,Ts as z,Cs as A,Mn as B,Ls as C,Ie as D,Ds as E,Ae as F,Es as G,Is as H,As as I,Hs as J,Os as K,Ns as L,_s as M,Ms as N,Fs as O,Vs as P,Vn as Q,Us as R,js as S,Un as T,ei as U,ti as V,ni as W,si as X,ii as Y};
