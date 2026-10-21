import{$ as ct,A as C,B as fe,C as ee,D as we,G as Ze,H as Xe,I as Qe,J as et,K as U,L as A,M as L,N as be,O as tt,P as nt,Q as te,R as st,S as it,T as he,U as at,V as rt,W as ye,X as ot,Y as D,Z as lt,_ as dt,aa as pt,ba as ut,g as T,h as ge,i as Je,j as Ke,k as Be,l as F,m as X,n as Ge,o as Ye,p as Q,ta as gt,u as me,v as S,w as I,y as j,z}from"./chunk-RN3IJWYP.js";import{l as bt,m as ht,q as yt,s as $t,x as vt}from"./chunk-4RDHUBDM.js";import{h as mt,j as ft,n as wt}from"./chunk-5TBIPKR4.js";import{o as Fe,w as ze,x as Ue,y as We,z as qe}from"./chunk-UU5CO7CB.js";import{c as le}from"./chunk-ZOJGMATP.js";import{c as _e}from"./chunk-6QSC5GC5.js";import{A as Ie,Pb as de,Sb as ce,Tb as Le,Ub as De,Vb as R,Wb as Ne,X as Ae,Yb as pe,ec as ue,gc as Me,z as Oe}from"./chunk-JG2Y2OHJ.js";import{U as je,r as Ve}from"./chunk-5WHHORKF.js";import{b as H,d as r,g as f,mh as O,nh as v,zh as He}from"./chunk-42FCO4AZ.js";var Gt=3;function xt(e,t,n){if(e.length===0)return f;let s=e.slice(0,Gt),a=e.length-s.length;return r`<span class="badge lk-badge" title=${t} role="img" aria-label=${t}>${s.map(i=>{let o=n(i.ownerId);return r`<span class="lk-dev" style=${o===void 0?f:`--dc:${o}`} aria-hidden="true">${v(i.kind==="iphone"?"phone":"watch")}</span>`})}${a>0?r`<span class="lk-more" aria-hidden="true">+${a}</span>`:f}</span>`}var St=H`
  .badge.lk-badge {
    display: inline-flex; align-items: center; gap: 1px; height: 20px; line-height: 20px; padding: 0 5px;
    color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
  }
  .lk-badge .lk-dev { display: inline-flex; color: var(--dc, var(--wa-accent)); }
  .lk-badge .lk-dev svg.ui-icon { width: 13px; height: 13px; stroke-width: 2; }
  .lk-badge .lk-more { margin-left: 2px; font-size: 10.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
`;function Ht(e,t){e.deletePage!==void 0?e.deletePage(t):e.edit(n=>Xe(n,t))}var E="status-pages",ke="sp:page",M="sp:row",k="sp:add",W="sp:drag",J="sp:added",Ot="wrist-assistant-panel.status-pages.zoom.v1";function Kn(e=le()){try{let t=e?.getItem(Ot),n=t==null||t===""?NaN:Number(t);return Fe.includes(n)?n:void 0}catch{return}}function Bn(e,t=le()){try{t?.setItem(Ot,e===void 0?"":String(e))}catch{}}var Yt="Pages the watch opens from a tile, a menu slot or Siri. A save reaches the watch the next time it checks.",Gn="Drawn from Home Assistant's states now, as the watch draws the page. Tap a row to edit it.";function G(e,t,n){return`${e} ${e===1?t:n}`}function K(e,t){let n=e.states[t]?.attributes?.friendly_name;return typeof n=="string"&&n.trim()!==""?n:t}function It(e,t){let n=t.indexOf(".");return{entityId:t,displayName:t===""?"":K(e,t),domain:n<0?"":t.slice(0,n)}}function Zt(e){switch(e){case"battery_charging":return"charging";case"illuminance":return"light";case"occupancy":case"presence":return"occupancy";case"garage_door":case"garage":return"garage";case"carbon_monoxide":return"CO";default:return e.replaceAll("_"," ")}}function Xt(e,t){if(t!==void 0&&t.length>0){let n=t.map(Zt),s=n.length===1?n[0]:n.slice(0,2).join("/");return e==="sensor"||e==="binary_sensor"?`${s} sensors`:e==="cover"?s.includes("garage")?"garage doors":`${s} covers`:`${s} ${e}s`}return e==="person"?"people":e==="binary_sensor"?"binary sensors":`${e}s`}function ve(e){let t=T(e),n=s=>`${s} ${s===1?"entity":"entities"}`;switch(t.rowType){case"entity":return t.entityId;case"groupCount":return`${n(t.groupEntityIds?.length??0)} \xB7 group count`;case"dynamicList":return t.dynamicMode==="all"?`all ${Xt(t.domain,t.deviceClassFilter)} \xB7 dynamic list`:`${n(t.groupEntityIds?.length??0)} \xB7 dynamic list`;case"sectionHeader":return"section header";default:return t.rowType}}function At(e){return Q.labels.StatusRowType?.[e]??e}function P(e){let t=me(e.document),n=e.uiState.get(ke);return(typeof n=="string"?t.find(s=>C(S(s),n)):void 0)??t[0]}function Lt(e,t){e.uiState.set(ke,t),e.uiState.delete(M),e.uiState.delete(k),oe(e.uiState),e.requestUpdate()}function Y(e){let t=e.uiState.get(M);return typeof t=="string"?ee(P(e),t):void 0}function Z(e,t){t===void 0?e.uiState.delete(M):e.uiState.set(M,t),e.uiState.delete(k),oe(e.uiState),e.requestUpdate()}function Qt(e){return Y(e)===void 0&&!e.uiState.has(k)?!1:(e.uiState.delete(M),e.uiState.delete(k),oe(e.uiState),e.requestUpdate(),!0)}function B(e){let t=e.uiState.get(k);return typeof t=="object"&&t!==null?t:void 0}function se(e,t){t===void 0?e.uiState.delete(k):(e.uiState.set(k,t),e.uiState.delete(M)),e.requestUpdate()}function en(e,t="entity"){e.uiState.delete(J),oe(e.uiState),se(e,{kind:t,mode:"all",picked:[]})}function ne(e,t,n=!1){let s=P(e);if(s===void 0)return;let a=S(s),i;return e.edit(o=>{let l=at(o,a,t);return i=l.id,l.document}),i!==void 0&&!n&&Z(e,i),i}function tn(e){let t;e.edit(n=>{let s=Ze(n);return t=s.id,s.document}),t!==void 0&&Lt(e,t)}function Dt(e,t,n,s,a){return{start:i=>{e.uiState.set(W,{list:t,id:n}),i.dataTransfer?.setData("text/plain",n),i.dataTransfer&&(i.dataTransfer.effectAllowed="move")},over:i=>{e.uiState.get(W)?.list===t&&(i.preventDefault(),i.dataTransfer&&(i.dataTransfer.dropEffect="move"))},drop:i=>{let o=e.uiState.get(W);e.uiState.delete(W),!(o?.list!==t||C(o.id,n))&&(i.preventDefault(),a(o.id,s))},end:()=>{e.uiState.delete(W)}}}function Pe(e,t,n,s){return e.icons.render(t,n,s)??r`<span class="sp-glyph-dot" style=${`background:${s};width:${Math.max(4,n*.6)}px;height:${Math.max(4,n*.6)}px`}></span>`}function Nt(e,t,n){return r`<span class="thumb sp-thumb" style=${`--c:${n}`} aria-hidden="true"><span class="sp-thumb-glyph">${Pe(e,t,14,n)}</span></span>`}function Mt(e,t){let n=T(t);return n.rowType==="sectionHeader"?F.secondary:n.rowType==="entity"?X(n.domain,e.hass.states[n.entityId]?.state):X(n.domain,"on")}function nn(e,t){let n=e.linkDevices?.(t);if(n!==void 0)return xt(n.others,`${n.title}. An edit here shows there too.`,n.colorOf);let s=e.linkBadge?.(t);return s===void 0?f:r`<span class="badge sp-linked" title=${`${s}. An edit here shows there too.`}>${s}</span>`}function sn(e,t,n,s,a){let i=S(t),o=I(t),l=a!==void 0&&C(i,S(a)),c=j(t).length,d=(w,p)=>e.edit(g=>Qe(g,w,p)),u=Dt(e,"page",i,n,d),m=()=>{l||Lt(e,i)},y=e.single===!0;return r`<div class="layer sp-page-row ${l?"hl":""}" data-page=${i} role="listitem" tabindex="0"
    draggable=${e.busy||y?"false":"true"} aria-current=${l?"true":"false"} aria-label=${o||"Untitled page"}
    @dragstart=${u.start} @dragover=${u.over} @drop=${u.drop} @dragend=${u.end}
    @click=${w=>{w.target instanceof Element&&w.target.closest("button")||m()}}
    @keydown=${w=>{w.target!==w.currentTarget||w.key!=="Enter"&&w.key!==" "||(w.preventDefault(),m())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Nt(e,"doc.text.fill","#5B8FD4")}
    <span class="name"><b><span class="nm-t">${o||"Untitled page"}</span></b><small>${G(c,"row","rows")}</small></span>
    <span class="right">
      <span class="badges">${nn(e,t)}${we(t)?r`<span class="badge" title="One of the app's starter pages. It is edited and put on devices like any other.">starter</span>`:f}</span>
      <span class="acts">
        ${y?f:r`<button type="button" class="icon" ?disabled=${e.busy||n===0} title="Move up" aria-label=${`Move ${o} up`}
          @click=${()=>d(i,n-1)}>${v("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||n===s-1} title="Move down" aria-label=${`Move ${o} down`}
          @click=${()=>d(i,n+1)}>${v("down")}</button>`}
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Delete" aria-label=${`Delete ${o}`}
          @click=${()=>Ht(e,i)}>${v("delete")}</button>
      </span>
    </span>
  </div>`}function Yn(e){let t=me(e.document),n=P(e);return r`<section class="card lc sp-pages-card" aria-label="Status pages" style="--c: var(--wa-lc-pages, #26a69a); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${v("list")}</span><span class="lc-title">Status pages</span>
      <span class="lc-sub" title=${Yt}>${G(t.length,"page","pages")}</span>
      <span class="spacer"></span>
      ${e.single===!0?f:r`<button type="button" class="lc-btn pri sp-add-page" aria-label="Add status page" ?disabled=${e.busy}
        title="Add a status page" @click=${()=>tn(e)}>${v("plus")}<span>Add</span></button>`}
    </div>
    ${t.length===0?r`<div class="lc-note">No status pages. Add one to show the live state of entities you pick.</div>`:r`<div class="layers sp-page-list" role="list">${t.map((s,a)=>sn(e,s,a,t.length,n))}</div>`}
    ${e.sharedLine===void 0||t.length===0?f:r`<div class="lc-note sp-shared-note" role="note">${e.sharedLine}</div>`}
    ${e.elsewhere??f}
  </section>`}function an(e,t,n,s,a,i){let o=z(n),l=T(n),c=i!==void 0&&C(o,z(i)),d=l.isHidden===!0,u=l.displayName===""?"Display Name":l.displayName,m=(g,$)=>e.edit(h=>ot(h,t,g,$)),y=Dt(e,"row",o,s,m),w=()=>Z(e,o),p=l.rowType==="sectionHeader"?"line.horizontal.3":l.iconName;return r`<div class="layer sp-row-row ${c?"hl":""} ${d?"dim":""}" data-row=${o} role="listitem" tabindex="0"
    draggable=${e.busy?"false":"true"} aria-current=${c?"true":"false"} aria-label=${u}
    title=${`${u} \xB7 ${ve(n)}${d?", hidden":""}`}
    @dragstart=${y.start} @dragover=${y.over} @drop=${y.drop} @dragend=${y.end}
    @click=${g=>{g.target instanceof Element&&g.target.closest("button")||w()}}
    @keydown=${g=>{g.target!==g.currentTarget||g.key!=="Enter"&&g.key!==" "||(g.preventDefault(),w())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Nt(e,p,Mt(e,n))}
    <span class="name"><b><span class="nm-t">${u}</span></b><small>${ve(n)}</small></span>
    <span class="right">
      <span class="badges">${d?r`<span class="badge">hidden</span>`:f}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${e.busy} title=${d?"Show":"Hide"} aria-label=${`${d?"Show":"Hide"} ${u}`}
          @click=${()=>e.edit(g=>D(g,t,o,"isHidden",!d))}>${v(d?"show":"hide")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||s===0} title="Move up" aria-label=${`Move ${u} up`}
          @click=${()=>m(o,s-1)}>${v("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||s===a-1} title="Move down" aria-label=${`Move ${u} down`}
          @click=${()=>m(o,s+1)}>${v("down")}</button>
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Remove" aria-label=${`Remove ${u}`}
          @click=${()=>e.edit(g=>ye(g,t,o))}>${v("delete")}</button>
      </span>
    </span>
  </div>`}function Zn(e){let t=P(e),n=t===void 0?[]:j(t),s=Y(e),a=t===void 0?"":S(t),i;t===void 0?i=r`<div class="lc-note">Add a status page to give it rows.</div>`:n.length===0?i=r`<div class="lc-note">No rows yet. Add entities to show in this status page.</div>`:i=r`<div class="layers sp-row-list" role="list">${n.map((l,c)=>an(e,a,l,c,n.length,s))}</div>
    <div class="lc-note sp-drag-note">Drag a row, or use its arrows, to reorder.</div>`;let o=B(e)!==void 0;return r`<section class="card lc sp-rows-card" aria-label="Rows" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${v("layers")}</span><span class="lc-title">Rows</span>
      ${t===void 0?f:r`<span class="lc-sub">${G(n.length,"row","rows")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-row ${o?"on":""}" aria-label="Add row" ?disabled=${e.busy||t===void 0}
        title="Add an entity, a group count, a dynamic list or a header" @click=${()=>en(e)}>${v("plus")}<span>Add</span></button>
    </div>
    ${i}
  </section>`}var ie={small:{row:10,compact:9,icon:14},medium:{row:12,compact:10,icon:16},large:{row:14,compact:12,icon:18}},Re={regular:400,medium:500,semibold:600,bold:700},ae={default:"-apple-system, system-ui, 'SF Pro Text', 'Helvetica Neue', sans-serif",rounded:"ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, monospace",serif:"ui-serif, 'New York', Georgia, serif"},kt={ultraThin:.1,thin:.13,regular:.16,thick:.2,ultraThick:.24};function rn(e){let t=n=>{let s=U().find(a=>a.key===n);return L(e,s)};return{rowStyle:String(t("rowStyle")),textSize:String(t("textSize")),fontWeight:String(t("fontWeight")),fontDesign:String(t("fontDesign")),rowSpacing:Number(t("rowSpacing")),backgroundMaterial:String(t("backgroundMaterial")),columnLayout:String(t("columnLayout")),showDividers:t("showDividers")===!0,iconPosition:String(t("iconPosition")),horizontalPadding:Number(t("horizontalPadding"))}}function Te(e){return F[e]??F.secondary}function _t(e,t){return e.rowStyle==="pillFilled"?`background:color-mix(in srgb, ${t} 15%, transparent);`:e.rowStyle==="pillOutline"?`box-shadow:inset 0 0 0 0.75px color-mix(in srgb, ${t} 40%, transparent);`:""}function re(e,t,n,s,a){let i=Te(n.color);return r`<span class="sp-w-icon" style=${`width:${s*a}px`}>${Pe(e,n.icon,Math.round(s*.8*a),i)}</span>`}function Pt(e,t,n,s){let a=e.scale,i=ie[t.textSize]??ie.medium,o=s!==void 0&&C(s,n.rowId),l=()=>Z(e,n.rowId);if(n.kind==="sectionHeader")return r`<div class="sp-w-header ${o?"on":""}" style=${`font-size:${9*a}px;text-align:${n.align==="center"?"center":n.align==="trailing"?"right":"left"}`}
      @click=${l}>${n.label}</div>`;let c=Te(n.color),d=t.rowStyle==="plain";return r`<div class="sp-w-row ${o?"on":""}" title=${n.entityId??n.label}
    style=${`gap:${6*a}px;font-size:${i.row*a}px;font-weight:${Re[t.fontWeight]??400};padding:${d?0:4*a}px ${d?0:8*a}px;border-radius:${6*a}px;${_t(t,c)}`}
    @click=${l}>
    ${t.iconPosition==="leading"?re(e,t,n,i.icon,a):f}
    <span class="sp-w-label">${n.label}</span>
    <span class="sp-w-value" style=${`color:${c}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?re(e,t,n,i.icon,a):f}
  </div>`}function Rt(e,t,n,s){let a=e.scale,i=ie[t.textSize]??ie.medium,o=s!==void 0&&C(s,n.rowId),l=Te(n.color),c=t.rowStyle==="plain";return r`<div class="sp-w-cell ${o?"on":""}" title=${n.label}
    style=${`gap:${3*a}px;font-size:${i.compact*a}px;font-weight:${Re[t.fontWeight]??400};padding:${c?0:3*a}px ${c?0:6*a}px;border-radius:${6*a}px;${_t(t,l)}`}
    @click=${()=>Z(e,n.rowId)}>
    ${t.iconPosition==="leading"?re(e,t,n,i.icon,a):f}
    <span class="sp-w-value" style=${`color:${l}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?re(e,t,n,i.icon,a):f}
  </div>`}function Tt(e){return r`<div class="sp-w-divider" style=${`height:${Math.max(1,.5*e)}px`}></div>`}function Xn(e){let t=e.phone===void 0?"Status page on the watch":"Status page on the iPhone";return wt(e.phone,e.screen,e.scale,Ft(e,t),t,e.icons)}function Vt(e){let t={hass:e.hass,icons:e.icons,screen:e.screen,scale:e.scale,uiState:new Map([[ke,S(e.page)]]),document:{statusPages:[e.page]},requestUpdate:()=>{}};return Ft(t,`${I(e.page)||"Untitled page"} on the watch`)}function Ft(e,t){let{width:n,height:s}=e.screen,a=e.scale,i=P(e),o=Y(e),l=o===void 0?void 0:z(o),c;if(i===void 0)c=r`<p class="sp-w-empty">No status page.</p>`;else{let d=rn(i),u=Ye(i,e.hass.states),m=d.columnLayout==="twoColumn"?Ge(u).map((w,p,g)=>r`${w.kind==="header"?Pt(e,d,w.row,l):r`<div class="sp-w-pair" style=${`gap:${8*a}px`}>${Rt(e,d,w.first,l)}${w.second===void 0?r`<span class="sp-w-cell sp-w-spacer"></span>`:Rt(e,d,w.second,l)}</div>`}
          ${d.showDividers&&p<g.length-1?Tt(a):f}`):u.map((w,p)=>r`${Pt(e,d,w,l)}${d.showDividers&&p<u.length-1?Tt(a):f}`),y=kt[d.backgroundMaterial]??kt.regular;c=r`<div class="sp-w-scroll" style=${`padding:${30*a}px ${6*a}px ${12*a}px;gap:${12*a}px`}>
      <div class="sp-w-card" style=${`padding:${8*a}px ${(6+d.horizontalPadding)*a}px;border-radius:${14*a}px;background:rgba(255,255,255,${y});font-family:${ae[d.fontDesign]??ae.default}`}>
        <div class="sp-w-rows" style=${`gap:${d.rowSpacing*a}px;padding:${4*a}px 0`}>
          ${u.length===0?r`<span class="sp-w-none" style=${`font-size:${11*a}px`}>${j(i).length===0?"Add entities":"Nothing to show now"}</span>`:m}
        </div>
      </div>
      <div class="sp-w-done" style=${`font-size:${15*a}px;padding:${12*a}px 0;border-radius:${20*a}px`}>Done</div>
    </div>`}return r`<div class="sp-screen" role="group" aria-label=${t}
    style=${`width:${Math.round(n*a)}px;min-height:${Math.round(s*a)}px`}>${c}</div>`}function Qn(e){let t=P(e);if(t===void 0)return[];let n=j(t),s=n.filter(a=>a.isHidden===!0).length;return[G(n.length,"row","rows")+(s>0?`, ${s} hidden`:"")]}function jt(e,t){return ze(e.uiState,E,t)}function on(e,t){Ue(e.uiState,E,t,!jt(e,t)),e.requestUpdate()}var ln={row:{color:O.content,icon:"content"},add:{color:O.content,icon:"plus"},page:{color:O.place,icon:"text"},rows:{color:"var(--wa-hue-yellow)",icon:"checklist"},text:{color:O.place,icon:"text"},more:{color:O.place,icon:"look"}},dn=["look-rows","look-text","look-more"];function N(e,t,n,s,a,i={}){let o=jt(e,n),l=ln[t];return He({color:l.color,icon:v(l.icon),title:s,open:o,onToggle:()=>on(e,n),...i.summary===void 0||i.summary===""?{}:{summary:i.summary},dot:i.dot===!0,id:`${E}:${n}`},o?a:r``)}function cn(e){if(B(e)!==void 0)return[{module:E,section:"add"}];let t=dn.map(n=>({module:E,section:n}));return Y(e)!==void 0?[{module:E,section:"row"},...t]:[{module:E,section:"page"},...t]}var zt=":order";function pn(e,t,n,s){let a=n.trim().toLowerCase(),i=new Set(t),o=e.filter(l=>a===""||l.toLowerCase().includes(a)||s(l).toLowerCase().includes(a));return[...o.filter(l=>i.has(l)),...o.filter(l=>!i.has(l))]}function oe(e){for(let t of[...e.keys()])t.endsWith(zt)&&e.delete(t)}function Ut(e,t,n,s,a){let i=`${t}:q`,o=`${t}${zt}`,l=String(e.uiState.get(i)??"").trim().toLowerCase(),c=new Set(s),d=e.uiState.get(o);(d===void 0||d.query!==l)&&(d={query:l,first:[...s]},e.uiState.set(o,d));let u=pn(n,d.first,l,y=>K(e.hass,y)),m=u.slice(0,200);return r`<div class="sp-pick">
    <input type="search" class="sp-pick-q" placeholder="Search entities" aria-label="Search entities" .value=${String(e.uiState.get(i)??"")}
      @input=${y=>{e.uiState.set(i,y.target.value),e.requestUpdate()}} />
    <div class="sp-pick-list" role="group" aria-label="Entities">
      ${m.length===0?r`<div class="sp-pick-none">${n.length===0?"No entity of this kind in Home Assistant.":"No entity matches."}</div>`:f}
      ${Ie(m,y=>y,y=>r`<label class="sp-pick-row">
        <input type="checkbox" .checked=${Oe(c.has(y))} ?disabled=${e.busy}
          @change=${w=>a(y,w.target.checked)} />
        <span class="sp-pick-name">${K(e.hass,y)}</span><code>${y}</code>
      </label>`)}
      ${u.length>m.length?r`<div class="sp-pick-none">${u.length-m.length} more. Search to narrow the list.</div>`:f}
    </div>
  </div>`}function un(e,t,n){let s=S(t),a=z(n),i=T(n),o=(p,g,$)=>e.edit(h=>D(h,s,a,p,g),$),l=i.rowType==="sectionHeader",c=i.rowType==="groupCount"||i.rowType==="dynamicList",d=i.rowType==="dynamicList"&&i.dynamicMode==="all",u=i.rowType==="groupCount"||i.rowType==="dynamicList"&&!d,m=[];m.push(R("Visibility",i.isHidden===!0?"hidden":"visible",[["visible","Visible"],["hidden","Hidden"]],p=>o("isHidden",p==="hidden"))),m.push(ce("Label",i.displayName,p=>o("displayName",p,`row:${a}:label`),{placeholder:"Display Name"})),l?m.push(R("Alignment",i.headerAlignment??"leading",A("HeaderAlignment"),p=>o("headerAlignment",p))):m.push(r`<div class="ts-stack">${Me({icons:e.icons,symbols:e.symbols},i.iconName,p=>o("iconName",p,`row:${a}:icon`),`sp:icon:${a}`)}</div>`),i.rowType==="entity"&&m.push(r`<div class="ts-stack">${ue({hass:e.hass},"Entity",It(e.hass,i.entityId),p=>{let g=p.entityId.trim();g!==""&&e.edit($=>{let h=D($,s,a,"entityId",g),b=te(g,e.hass.states);return h=D(h,s,a,"domain",b.domain),i.iconName===te(i.entityId).iconName&&(h=D(h,s,a,"iconName",b.iconName)),h})},`sp:entity:${a}`,{clearable:!1})}</div>`);let y=!1;if(c&&i.domain!=="sensor"){let p=Je(i.domain,i.deviceClassFilter);if(p.length>=2){y=!0;let g=ge(i),$=p.map(h=>[h.value,h.label]);$.some(([h])=>h===g)||$.push([g,Be(g)]),m.push(R("Show State",g,$,h=>o("filterState",h)))}}if(i.rowType==="dynamicList"){m.push(R("Entities",d?"all":"specific",A("DynamicMode"),$=>o("dynamicMode",$))),m.push(pe("Show all states",i.showAllStates===!0,$=>o("showAllStates",$?!0:void 0),!1));let p=y?"only those in the state above":`only those whose state is \u201C${ge(i)}\u201D`,g=i.maxNumericValue===void 0?"":" Either way, the max value below still applies.";m.push(r`<div class="hint ts-under">On: every entity is listed whatever its state. Off: ${p}.${g}</div>`)}if((i.domain==="sensor"?c:i.rowType==="dynamicList"&&i.maxNumericValue!==void 0)&&(m.push(Le(Ke(i.deviceClassFilter),i.maxNumericValue,p=>o("maxNumericValue",p,`row:${a}:max`),{optional:!0,placeholder:"No limit",def:null})),m.push(r`<div class="hint ts-under">Only states at or below it count. Empty is no limit.</div>`)),c){let p=i.deviceClassFilter??[],g=ct(i.domain,e.hass.states,p),$=h=>{let b=T(ee(fe(e.document,s),a)??n).deviceClassFilter??[],x=b.includes(h)?b.filter(V=>V!==h):[...b,h];o("deviceClassFilter",x.length===0?void 0:x)};m.push(r`<div class="field sp-classes"><span>Device classes</span>
      <div class="sp-chips" role="group" aria-label="Device classes">
        ${g.length===0?r`<span class="hint">None reported for ${i.domain===""?"this row":i.domain}.</span>`:f}
        ${g.map(h=>{let b=p.includes(h);return r`<button type="button" class="pe-chip ${b?"on":""}" aria-pressed=${b?"true":"false"} ?disabled=${e.busy}
            @click=${()=>$(h)}>${h.replaceAll("_"," ")}</button>`})}
      </div></div>
      <div class="hint ts-under">${p.length===0?"None picked: every class counts.":"Only entities of these classes count."}</div>`)}if(u){let p=i.groupEntityIds??[],g=lt(n,e.hass.states);m.push(r`<div class="field sp-entities-field"><span>Edit Entities (${p.length})</span></div>
      ${Ut(e,`sp:ents:${a}`,g,p,($,h)=>{let b=T(ee(fe(e.document,s),a)??n).groupEntityIds??[],x=h?b.includes($)?b:[...b,$]:b.filter(V=>V!==$);o("groupEntityIds",x)})}`)}let w=r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Row">${m}</fieldset>`;return r`${N(e,"row","row",At(i.rowType),w,{summary:ve(n)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this row from the page"
        @click=${()=>e.edit(p=>ye(p,s,a))}>${v("delete")}<span>Remove</span></button>
    </div>`}function gn(e,t,n,s){let a=L(n,s),i=(o,l)=>e.edit(c=>be(c,t,s.key,o),l);switch(s.kind){case"switch":return r`${pe(s.label,a===!0,o=>i(o),s.default)}
        ${s.help===void 0?f:r`<div class="hint ts-under">${s.help}</div>`}`;case"slider":return Ne(s.label,Number(a),o=>i(o,`style:${t}:${s.key}`),{min:s.min??0,max:s.max??1,step:s.step??1,def:Number(s.default),...s.unit===void 0?{}:{unit:s.unit}});default:{let o=Q.types.page.keys[s.key]?.enum??"",l=A(o);return l.length<=4?R(s.label,String(a),l,c=>i(c),{def:String(s.default)}):De(s.label,String(a),l,c=>i(c),{def:String(s.default),snapBack:!0})}}}var xe=["rowStyle","columnLayout","iconPosition"],Se=["textSize","fontDesign","fontWeight"],Ct=new Set([...xe,...Se]),mn={small:12,medium:15,large:18};function fn(e,t,n){let s=U().find(d=>d.key===n);if(s===void 0)return;let a=S(t),i=String(L(t,s)),o=A(Q.types.page.keys[n]?.enum??""),l=o.find(([d])=>d===i)?.[1]??i;return{field:s,value:i,choices:o,name:l,set:d=>{d!==String(L(P(e)??t,s))&&e.edit(u=>be(u,a,n,d))}}}function $e(e,t){return U().some(n=>t(n.key)&&!je(L(e,n),n.default))}function q(e,t,n,s=""){let a=i=>t.choices.find(([o])=>o===i)?.[1]??i;return r`<div class="sp-look">
    <div class="sp-look-title">${de(e,t.value,String(t.field.default),i=>t.set(i),a)}</div>
    <div class="sp-pics ${s}" role="group" aria-label=${e} style=${`--n:${t.choices.length}`}>
      ${t.choices.map(([i,o])=>{let l=i===t.value;return r`<button type="button" class="sp-pic ${l?"on":""}" aria-pressed=${l?"true":"false"} aria-label=${`${e}: ${o}`}
          @click=${()=>t.set(i)}>${n(i,o)}</button>`})}
    </div>
  </div>`}function wn(e,t){return r`<span class="sp-pic-well ${e}" aria-hidden="true"><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function bn(e,t){return r`<span class="sp-pic-grid ${e==="twoColumn"?"two":""}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function hn(e,t){let n=r`<i class="sp-pic-dot" aria-hidden="true"></i>`;return r`${e==="leading"?n:f}<span class="sp-pic-name">${t}</span>${e==="trailing"?n:f}`}function yn(e,t){return r`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:${mn[e]??15}px`}>Aa</span><span class="sp-pic-name sub">${t}</span>`}function $n(e,t){return r`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:18px;font-family:${ae[e]??ae.default}`}>Ag</span><span class="sp-pic-name sub">${t}</span>`}function vn(e){let t=n=>e.choices.find(([s])=>s===n)?.[1]??n;return r`<div class="field seg-field sp-weight-field">${de("Weight",e.value,String(e.field.default),n=>e.set(n),t)}
    <div class="seg wide sp-weight" role="group" aria-label="Weight">
      ${e.choices.map(([n,s])=>{let a=n===e.value;return r`<button type="button" class=${a?"on":""} aria-pressed=${a?"true":"false"} aria-label=${`Weight: ${s}`}
          style=${`--w:${Re[n]??400}`} @click=${()=>e.set(n)}>${s}</button>`})}
    </div></div>`}function Et(e,t){let n=S(t),s=b=>fn(e,t,b),[a,i,o]=xe.map(s),[l,c,d]=Se.map(s),u=b=>b.filter(x=>x!==void 0).map(x=>x.name).join(", "),m=$e(t,b=>xe.includes(b)),y=$e(t,b=>Se.includes(b)),w=$e(t,b=>!Ct.has(b)),p=nt(t),g=N(e,"rows","look-rows","Rows",r`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Rows">
    ${a===void 0?f:q("Style",a,wn)}
    ${i===void 0?f:q("Layout",i,bn,"across")}
    ${o===void 0?f:q("Icon",o,hn,"inline")}
  </fieldset>`,{summary:u([a,i]),dot:m}),$=N(e,"text","look-text","Text",r`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Text">
    ${l===void 0?f:q("Size",l,yn,"type")}
    ${c===void 0?f:q("Font",c,$n,"type")}
    ${d===void 0?f:vn(d)}
  </fieldset>`,{summary:u([l,d,c]),dot:y}),h=N(e,"more","look-more","More",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="More">
    ${U().filter(b=>!Ct.has(b.key)).map(b=>gn(e,n,t,b))}
  </fieldset>`,{summary:w?"Changed":"Defaults",dot:w});return r`${g}${$}${h}
    <div class="sp-acts">
      <button type="button" class="pe-btn" ?disabled=${e.busy||!p} title="Put the page's whole look back to the app's defaults"
        @click=${()=>e.edit(b=>tt(b,n))}>${v("reset")}<span>Reset to Defaults</span></button>
    </div>`}function xn(e,t){let n=S(t),s=I(t);return N(e,"page","page","Page",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Page">
    ${ce("Name",s,a=>e.edit(i=>et(i,n,a),`page:${n}:name`),{placeholder:"Page Name"})}
    ${we(t)?r`<div class="hint ts-under">One of the app's starter pages. It is edited, put on devices and deleted like any other.</div>`:f}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Delete this status page"
        @click=${()=>Ht(e,n)}>${v("delete")}<span>Delete page</span></button>
    </div>
  </fieldset>`,{summary:s})}function Sn(e,t,n,s){let a=X(t.domain,"on");return r`<button type="button" class="sp-preset ${n?"on":""}" aria-pressed=${n?"true":"false"} ?disabled=${e.busy} @click=${s}>
    <span class="sp-preset-glyph">${Pe(e,t.icon,18,a===F.secondary?"#5B8FD4":a)}</span>
    <span class="sp-preset-label">${t.label}</span>
  </button>`}function kn(e,t,n){let s=c=>se(e,{...n,...c}),a=e.uiState.get(J),i=[["entity","Entity"],["groupCount","Group Count"],["dynamicList","Dynamic List"],["header","Header"]],o=R("Add",n.kind,i,c=>{if(c==="header"){ne(e,st());return}e.uiState.delete(J),s({kind:c,preset:void 0,picked:[],mode:"all"})}),l;if(n.kind==="entity"){let c=Number(e.uiState.get(`${k}:n`)??0)||0;l=r`<div class="ts-stack">${ue({hass:e.hass},"Entity",It(e.hass,""),d=>{let u=d.entityId.trim();if(u==="")return;e.uiState.set(`${k}:n`,c+1);let m=P(e);if(m!==void 0&&rt(m,u)){e.uiState.set(J,`${K(e.hass,u)} is on this page already.`),e.requestUpdate();return}ne(e,te(u,e.hass.states),!0),e.uiState.set(J,`Added ${K(e.hass,u)}.`),e.requestUpdate()},`sp:add:entity:${c}`,{clearable:!1})}</div>
      <div class="hint">Each entity is one row. Pick another to add it too.</div>`}else{let c=n.kind==="groupCount"?pt():ut(),d=n.preset===void 0?void 0:c[n.preset],u=n.kind==="groupCount"||n.mode==="specific",m=n.kind==="groupCount"?"Counts how many of the entities you pick are in a state.":"Pick what to show. Each matching entity becomes its own row. You can switch to hand-picked entities after adding.",y=r`<div class="sp-presets" role="group" aria-label=${n.kind==="groupCount"?"Group Count":"Dynamic List"}>
      ${c.map((p,g)=>Sn(e,p,n.preset===g,()=>{if(!u){ne(e,he(p));return}s({preset:g,picked:[]})}))}
    </div>`,w=f;if(u&&d!==void 0){let p=n.kind==="groupCount"?d.picker==="deviceClass"?d.deviceClassFilter:void 0:d.deviceClassFilter,g=dt(d.domain,p,e.hass.states);w=r`<div class="field sp-entities-field"><span>${d.label}: ${G(n.picked.length,"entity","entities")} picked</span></div>
        ${Ut(e,`${k}:pick`,g,n.picked,($,h)=>{let b=B(e)??n,x=b.picked.filter(V=>V!==$);se(e,{...b,picked:h?[...x,$]:x})})}
        <div class="sp-acts">
          <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy}
            @click=${()=>{let $=(B(e)??n).picked;ne(e,n.kind==="groupCount"?it(d,$):he(d,$))}}>
            ${v("plus")}<span>Add ${n.kind==="groupCount"?"group count":"dynamic list"}</span></button>
        </div>`}l=r`<p class="hint">${m}</p>
      ${n.kind==="dynamicList"?R("Entities",n.mode,A("DynamicMode"),p=>s({mode:p,preset:void 0,picked:[]})):f}
      ${y}${w}`}return r`${N(e,"add","add","Add a row",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Add a row">
    ${o}${l}
    ${typeof a=="string"?r`<div class="hint sp-added" role="status">${a}</div>`:f}
  </fieldset>`,{summary:I(t)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn" @click=${()=>se(e,void 0)}>Done</button>
    </div>`}function es(e){let t=P(e);if(t===void 0)return r`<div class="insp-head"><div class="crumbs"><span class="nm">No status page</span></div></div>
      <div class="insp-body"><p class="sp-note">Add a status page to edit it.</p></div>`;let n=I(t)||"Untitled page",s=Y(e),a=B(e),i=cn(e),o=We(e.uiState,i),l,c;if(a!==void 0)l=r`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>Qt(e)}>${n}</button><span class="sep">›</span><span class="nm">Add a row</span></div>`,c=kn(e,t,a);else if(s!==void 0){let d=T(s),u=d.displayName===""?"Display Name":d.displayName;l=r`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>Z(e,void 0)}>${n}</button><span class="sep">›</span><span class="kchip" style=${`--k:${Mt(e,s)}`}>${At(d.rowType)}</span><span class="nm" title=${u}>${u}</span></div>`,c=r`${un(e,t,s)}${Et(e,t)}`}else l=r`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">Page</span><span class="nm" title=${n}>${n}</span></div>`,c=r`${xn(e,t)}${Et(e,t)}
      <p class="sp-note">Select a row to edit it, or add one.</p>`;return r`<div class="insp-head">
      ${l}
      <button class="expand" @click=${()=>{qe(e.uiState,i,!o),e.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${c}</div>`}var ts=H`
  .sp-pages-card > .layers, .sp-rows-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .sp-pages-card > .lc-note, .sp-rows-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .sp-rows-card > .lc-note.sp-drag-note { margin-top: 0; font-size: 11.5px; }
  .sp-pages-card > .lc-note.sp-shared-note { margin-top: 0; font-size: 11.5px; }
  /* The badge of a status page other devices have too: the device icons
     (linkBadgeStyles, here because the editors take this sheet) for a host
     that gives \`linkDevices\`, else the sentence, cut short in a narrow
     list, its title holding the whole name. */
  ${St}
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
`;var Ee=56,Pn=40;var Rn=56,us=76,_=Ae.screen;function Kt(e){return Math.round(e*_.height/_.width)}var Wt=new WeakMap;function Bt(e,t,n,s){let a=Wt.get(e);a===void 0&&(a=new Map,Wt.set(e,a));let i=a.get(t);if(i!==void 0&&i.stamp.length===n.length&&i.stamp.every((l,c)=>l===n[c]))return i.picture;let o=s();return a.set(t,{stamp:n,picture:o}),o}function gs(e){let t=e.iphone===!0,n=e.width??(t?Pn:Ee),s=[e.states,e.icons,e.tick,e.pages],a=e.look??"iphone";return Bt(e.page,`page:${t?`p:${a}`:"w"}:${n}`,s,()=>Tn(e,n,t,a))}function Tn(e,t,n,s){let{page:a}=e,i=n?mt(void 0,{look:s}):void 0,o=i===void 0?_:ft(i),l=t/o.width,c=Math.min(Math.round(o.height*l),Kt(Math.max(t,Ee))),d=`width:${t}px;height:${c}px`;if(Ve(a))return r`<span class="lr-pic lr-smart ${n?"ph":""}" style=${`${d};background:${yt(a)}`} aria-hidden="true">${v("states")}</span>`;let u={page:a,pages:e.pages??[a],screen:o,scale:l,stateMode:"live",...e.states===void 0?{}:{states:e.states},...e.icons===void 0?{}:{icons:e.icons},...i===void 0?{}:{phone:i}},m=ht(a,o,{sideInset:bt(u)}),y=m.tiles.filter(p=>(m.topInset+p.y)*l<c),w=$t(u,a,l,o,void 0);return r`<span class="lr-pic ${n?"ph":""}" style=${`${d};background:${w.background}`} aria-hidden="true">
    ${w.layers}
    ${y.map(p=>r`<span class="lr-tile"
      style=${`left:${p.x*l}px;top:${(m.topInset+p.y)*l}px;width:${p.width*l}px;height:${p.height*l}px`}>${vt(p.tile,{width:p.width,height:p.height},u,m.unit)}</span>`)}
  </span>`}function ms(e){let t=e.width??Ee,n=Kt(t),s=`width:${t}px;height:${n}px`,a=e.hass;return a===void 0?r`<span class="lr-pic lr-status" style=${s} aria-hidden="true"></span>`:Bt(e.page,`status:${t}`,[a.states,e.icons,e.tick],()=>r`<span class="lr-pic lr-status" style=${s} aria-hidden="true">
    ${Vt({page:e.page,hass:a,icons:e.icons??_e,screen:_,scale:t/_.width})}
  </span>`)}var qt,Ce=!1;function Cn(e){return Ce||customElements.get("wa-menu-thumbs")!==void 0?(Ce=!0,!0):(qt??=import("./menu-thumbs-NP6WWQ2Z.js").then(()=>{Ce=!0}),qt.then(e,()=>{}),!1)}var Jt=new WeakMap;function fs(e){let t=e.height??Rn,n=e.menu.unit;if(!Cn(e.onReady)||e.hass===void 0||e.icons===void 0)return r`<span class="lr-ring" style=${`width:${t}px;height:${t}px`} aria-hidden="true"></span>`;let s=Jt.get(e.menu);return s===void 0&&(s=gt(e.menu),Jt.set(e.menu,s)),r`<wa-menu-thumbs class="lr-menu" .hass=${e.hass} .icons=${e.icons} .tick=${e.tick??0} .menus=${s}
    .pages=${e.pages} .screen=${_} .height=${t} menu=${n}></wa-menu-thumbs>`}var ws=H`
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
`;export{xt as a,St as b,Kn as c,Bn as d,Gn as e,P as f,Lt as g,Qt as h,tn as i,Yn as j,Zn as k,Xn as l,Vt as m,Qn as n,es as o,ts as p,Rn as q,us as r,gs as s,ms as t,fs as u,ws as v};
