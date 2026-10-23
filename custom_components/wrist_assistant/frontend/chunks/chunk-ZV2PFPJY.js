import{$ as Je,A as Z,B as Fe,C as Me,D as X,G as ge,H as x,I as A,K as M,L as _,M as C,N as me,O as Q,P as fe,S as _e,T as ze,U as je,V as Ue,W as z,X as D,Y as O,Z as we,_ as qe,aa as ee,ba as Ke,ca as Be,da as be,ea as Ge,fa as We,ga as ye,ha as Ye,ia as L,ja as Ze,ka as Xe,la as Qe,ma as et,na as tt,u as R,v as ue,w as Ne,x as Ie,y as Ve,z as F}from"./chunk-KEUUWEUW.js";import{q as nt}from"./chunk-CNZ4KOQF.js";import{a as st,b as it,c as at,d as rt,r as ot}from"./chunk-SF4C76H6.js";import{c as oe}from"./chunk-ZOJGMATP.js";import{Bb as de,Cb as Ae,Db as De,Eb as T,Fb as Oe,Hb as ce,Pb as pe,Rb as Le,k as Ee,l as He,yb as le}from"./chunk-XDWWPROF.js";import{b as Y,d as r,g as m,mh as H,nh as v,zh as Re}from"./chunk-GAVJLCVX.js";import{U as Ce}from"./chunk-Y7NZKWQC.js";var Et=3;function lt(e,t,n){if(e.length===0)return m;let i=e.slice(0,Et),a=e.length-i.length;return r`<span class="badge lk-badge" title=${t} role="img" aria-label=${t}>${i.map(s=>{let o=n(s.ownerId);return r`<span class="lk-dev" style=${o===void 0?m:`--dc:${o}`} aria-hidden="true">${v(s.kind==="iphone"?"phone":"watch")}</span>`})}${a>0?r`<span class="lk-more" aria-hidden="true">+${a}</span>`:m}</span>`}var dt=Y`
  .badge.lk-badge {
    display: inline-flex; align-items: center; gap: 1px; height: 20px; line-height: 20px; padding: 0 5px;
    color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
  }
  .lk-badge .lk-dev { display: inline-flex; color: var(--dc, var(--wa-accent)); }
  .lk-badge .lk-dev svg.ui-icon { width: 13px; height: 13px; stroke-width: 2; }
  .lk-badge .lk-more { margin-left: 2px; font-size: 10.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
`;function wt(e,t){e.deletePage!==void 0?e.deletePage(t):e.edit(n=>ze(n,t))}var E="status-pages",xe="sp:page",I="sp:row",k="sp:add",j="sp:drag",q="sp:added",bt="wrist-assistant-panel.status-pages.zoom.v1";function xn(e=oe()){try{let t=e?.getItem(bt),n=t==null||t===""?NaN:Number(t);return ot.includes(n)?n:void 0}catch{return}}function kn(e,t=oe()){try{t?.setItem(bt,e===void 0?"":String(e))}catch{}}var Ht="Pages the watch opens from a tile, a menu slot or Siri. A save reaches the watch the next time it checks.",Pn="Drawn from Home Assistant's states now, as the watch draws the page. Tap a row to edit it.";function B(e,t,n){return`${e} ${e===1?t:n}`}function J(e,t){let n=e.states[t]?.attributes?.friendly_name;return typeof n=="string"&&n.trim()!==""?n:t}function yt(e,t){let n=t.indexOf(".");return{entityId:t,displayName:t===""?"":J(e,t),domain:n<0?"":t.slice(0,n)}}function At(e){switch(e){case"battery_charging":return"charging";case"illuminance":return"light";case"occupancy":case"presence":return"occupancy";case"garage_door":case"garage":return"garage";case"carbon_monoxide":return"CO";default:return e.replaceAll("_"," ")}}function Dt(e,t){if(t!==void 0&&t.length>0){let n=t.map(At),i=n.length===1?n[0]:n.slice(0,2).join("/");return e==="sensor"||e==="binary_sensor"?`${i} sensors`:e==="cover"?i.includes("garage")?"garage doors":`${i} covers`:`${i} ${e}s`}return e==="person"?"people":e==="binary_sensor"?"binary sensors":`${e}s`}function $e(e){let t=R(e),n=i=>`${i} ${i===1?"entity":"entities"}`;switch(t.rowType){case"entity":return t.entityId;case"groupCount":return`${n(t.groupEntityIds?.length??0)} \xB7 group count`;case"dynamicList":return t.dynamicMode==="all"?`all ${Dt(t.domain,t.deviceClassFilter)} \xB7 dynamic list`:`${n(t.groupEntityIds?.length??0)} \xB7 dynamic list`;case"sectionHeader":return"section header";default:return t.rowType}}function ht(e){return X.labels.StatusRowType?.[e]??e}function P(e){let t=ge(e.document),n=e.uiState.get(xe);return(typeof n=="string"?t.find(i=>C(x(i),n)):void 0)??t[0]}function $t(e,t){e.uiState.set(xe,t),e.uiState.delete(I),e.uiState.delete(k),re(e.uiState),e.requestUpdate()}function G(e){let t=e.uiState.get(I);return typeof t=="string"?Q(P(e),t):void 0}function W(e,t){t===void 0?e.uiState.delete(I):e.uiState.set(I,t),e.uiState.delete(k),re(e.uiState),e.requestUpdate()}function Ot(e){return G(e)===void 0&&!e.uiState.has(k)?!1:(e.uiState.delete(I),e.uiState.delete(k),re(e.uiState),e.requestUpdate(),!0)}function K(e){let t=e.uiState.get(k);return typeof t=="object"&&t!==null?t:void 0}function ne(e,t){t===void 0?e.uiState.delete(k):(e.uiState.set(k,t),e.uiState.delete(I)),e.requestUpdate()}function Lt(e,t="entity"){e.uiState.delete(q),re(e.uiState),ne(e,{kind:t,mode:"all",picked:[]})}function te(e,t,n=!1){let i=P(e);if(i===void 0)return;let a=x(i),s;return e.edit(o=>{let l=Ge(o,a,t);return s=l.id,l.document}),s!==void 0&&!n&&W(e,s),s}function Nt(e){let t;e.edit(n=>{let i=_e(n);return t=i.id,i.document}),t!==void 0&&$t(e,t)}function vt(e,t,n,i,a){return{start:s=>{e.uiState.set(j,{list:t,id:n}),s.dataTransfer?.setData("text/plain",n),s.dataTransfer&&(s.dataTransfer.effectAllowed="move")},over:s=>{e.uiState.get(j)?.list===t&&(s.preventDefault(),s.dataTransfer&&(s.dataTransfer.dropEffect="move"))},drop:s=>{let o=e.uiState.get(j);e.uiState.delete(j),!(o?.list!==t||C(o.id,n))&&(s.preventDefault(),a(o.id,i))},end:()=>{e.uiState.delete(j)}}}function ke(e,t,n,i){return e.icons.render(t,n,i)??r`<span class="sp-glyph-dot" style=${`background:${i};width:${Math.max(4,n*.6)}px;height:${Math.max(4,n*.6)}px`}></span>`}function St(e,t,n){return r`<span class="thumb sp-thumb" style=${`--c:${n}`} aria-hidden="true"><span class="sp-thumb-glyph">${ke(e,t,14,n)}</span></span>`}function xt(e,t){let n=R(t);return n.rowType==="sectionHeader"?F.secondary:n.rowType==="entity"?Z(n.domain,e.hass.states[n.entityId]?.state):Z(n.domain,"on")}function It(e,t){let n=e.linkDevices?.(t);if(n!==void 0)return lt(n.others,`${n.title}. An edit here shows there too.`,n.colorOf);let i=e.linkBadge?.(t);return i===void 0?m:r`<span class="badge sp-linked" title=${`${i}. An edit here shows there too.`}>${i}</span>`}function Vt(e,t,n,i,a){let s=x(t),o=A(t),l=a!==void 0&&C(s,x(a)),c=M(t).length,d=(b,p)=>e.edit(u=>je(u,b,p)),g=vt(e,"page",s,n,d),f=()=>{l||$t(e,s)},h=e.single===!0;return r`<div class="layer sp-page-row ${l?"hl":""}" data-page=${s} role="listitem" tabindex="0"
    draggable=${e.busy||h?"false":"true"} aria-current=${l?"true":"false"} aria-label=${o||"Untitled page"}
    @dragstart=${g.start} @dragover=${g.over} @drop=${g.drop} @dragend=${g.end}
    @click=${b=>{b.target instanceof Element&&b.target.closest("button")||f()}}
    @keydown=${b=>{b.target!==b.currentTarget||b.key!=="Enter"&&b.key!==" "||(b.preventDefault(),f())}}>
    <span class="grip" aria-hidden="true"></span>
    ${St(e,"doc.text.fill","#5B8FD4")}
    <span class="name"><b><span class="nm-t">${o||"Untitled page"}</span></b><small>${B(c,"row","rows")}</small></span>
    <span class="right">
      <span class="badges">${It(e,t)}${fe(t)?r`<span class="badge" title="One of the app's starter pages. It is edited and put on devices like any other.">starter</span>`:m}</span>
      <span class="acts">
        ${h?m:r`<button type="button" class="icon" ?disabled=${e.busy||n===0} title="Move up" aria-label=${`Move ${o} up`}
          @click=${()=>d(s,n-1)}>${v("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||n===i-1} title="Move down" aria-label=${`Move ${o} down`}
          @click=${()=>d(s,n+1)}>${v("down")}</button>`}
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Delete" aria-label=${`Delete ${o}`}
          @click=${()=>wt(e,s)}>${v("delete")}</button>
      </span>
    </span>
  </div>`}function Tn(e){let t=ge(e.document),n=P(e);return r`<section class="card lc sp-pages-card" aria-label="Status pages" style="--c: var(--wa-lc-pages, #26a69a); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${v("list")}</span><span class="lc-title">Status pages</span>
      ${e.single===!0?m:r`<span class="lc-sub" title=${Ht}>${B(t.length,"page","pages")}</span>`}
      <span class="spacer"></span>
      ${e.listTools??m}
      ${e.single===!0?m:r`<button type="button" class="lc-btn pri sp-add-page" aria-label="Add status page" ?disabled=${e.busy}
        title="Add a status page" @click=${()=>Nt(e)}>${v("plus")}<span>Add</span></button>`}
    </div>
    ${t.length===0?r`<div class="lc-note">No status pages. Add one to show the live state of entities you pick.</div>`:r`<div class="layers sp-page-list" role="list">${t.map((i,a)=>Vt(e,i,a,t.length,n))}</div>`}
    ${e.sharedLine===void 0||t.length===0?m:r`<div class="lc-note sp-shared-note" role="note">${e.sharedLine}</div>`}
    ${e.elsewhere??m}
  </section>`}function Ft(e,t,n,i,a,s){let o=_(n),l=R(n),c=s!==void 0&&C(o,_(s)),d=l.isHidden===!0,g=l.displayName===""?"Display Name":l.displayName,f=(u,$)=>e.edit(y=>Ye(y,t,u,$)),h=vt(e,"row",o,i,f),b=()=>W(e,o),p=l.rowType==="sectionHeader"?"line.horizontal.3":l.iconName;return r`<div class="layer sp-row-row ${c?"hl":""} ${d?"dim":""}" data-row=${o} role="listitem" tabindex="0"
    draggable=${e.busy?"false":"true"} aria-current=${c?"true":"false"} aria-label=${g}
    title=${`${g} \xB7 ${$e(n)}${d?", hidden":""}`}
    @dragstart=${h.start} @dragover=${h.over} @drop=${h.drop} @dragend=${h.end}
    @click=${u=>{u.target instanceof Element&&u.target.closest("button")||b()}}
    @keydown=${u=>{u.target!==u.currentTarget||u.key!=="Enter"&&u.key!==" "||(u.preventDefault(),b())}}>
    <span class="grip" aria-hidden="true"></span>
    ${St(e,p,xt(e,n))}
    <span class="name"><b><span class="nm-t">${g}</span></b><small>${$e(n)}</small></span>
    <span class="right">
      <span class="badges">${d?r`<span class="badge">hidden</span>`:m}</span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${e.busy} title=${d?"Show":"Hide"} aria-label=${`${d?"Show":"Hide"} ${g}`}
          @click=${()=>e.edit(u=>L(u,t,o,"isHidden",!d))}>${v(d?"show":"hide")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||i===0} title="Move up" aria-label=${`Move ${g} up`}
          @click=${()=>f(o,i-1)}>${v("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||i===a-1} title="Move down" aria-label=${`Move ${g} down`}
          @click=${()=>f(o,i+1)}>${v("down")}</button>
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Remove" aria-label=${`Remove ${g}`}
          @click=${()=>e.edit(u=>ye(u,t,o))}>${v("delete")}</button>
      </span>
    </span>
  </div>`}function Rn(e){let t=P(e),n=t===void 0?[]:M(t),i=G(e),a=t===void 0?"":x(t),s;t===void 0?s=r`<div class="lc-note">Add a status page to give it rows.</div>`:n.length===0?s=r`<div class="lc-note">No rows yet. Add entities to show in this status page.</div>`:s=r`<div class="layers sp-row-list" role="list">${n.map((l,c)=>Ft(e,a,l,c,n.length,i))}</div>
    <div class="lc-note sp-drag-note">Drag a row, or use its arrows, to reorder.</div>`;let o=K(e)!==void 0;return r`<section class="card lc sp-rows-card" aria-label="Rows" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${v("layers")}</span><span class="lc-title">Rows</span>
      ${t===void 0?m:r`<span class="lc-sub">${B(n.length,"row","rows")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri sp-add-row ${o?"on":""}" aria-label="Add row" ?disabled=${e.busy||t===void 0}
        title="Add an entity, a group count, a dynamic list or a header" @click=${()=>Lt(e)}>${v("plus")}<span>Add</span></button>
    </div>
    ${s}
  </section>`}var se={small:{row:10,compact:9,icon:14},medium:{row:12,compact:10,icon:16},large:{row:14,compact:12,icon:18}},Pe={regular:400,medium:500,semibold:600,bold:700},ie={default:"-apple-system, system-ui, 'SF Pro Text', 'Helvetica Neue', sans-serif",rounded:"ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, monospace",serif:"ui-serif, 'New York', Georgia, serif"},ct={ultraThin:.1,thin:.13,regular:.16,thick:.2,ultraThick:.24};function Mt(e){let t=n=>{let i=z().find(a=>a.key===n);return O(e,i)};return{rowStyle:String(t("rowStyle")),textSize:String(t("textSize")),fontWeight:String(t("fontWeight")),fontDesign:String(t("fontDesign")),rowSpacing:Number(t("rowSpacing")),backgroundMaterial:String(t("backgroundMaterial")),columnLayout:String(t("columnLayout")),showDividers:t("showDividers")===!0,iconPosition:String(t("iconPosition")),horizontalPadding:Number(t("horizontalPadding"))}}function Te(e){return F[e]??F.secondary}function kt(e,t){return e.rowStyle==="pillFilled"?`background:color-mix(in srgb, ${t} 15%, transparent);`:e.rowStyle==="pillOutline"?`box-shadow:inset 0 0 0 0.75px color-mix(in srgb, ${t} 40%, transparent);`:""}function ae(e,t,n,i,a){let s=Te(n.color);return r`<span class="sp-w-icon" style=${`width:${i*a}px`}>${ke(e,n.icon,Math.round(i*.8*a),s)}</span>`}function pt(e,t,n,i){let a=e.scale,s=se[t.textSize]??se.medium,o=i!==void 0&&C(i,n.rowId),l=()=>W(e,n.rowId);if(n.kind==="sectionHeader")return r`<div class="sp-w-header ${o?"on":""}" style=${`font-size:${9*a}px;text-align:${n.align==="center"?"center":n.align==="trailing"?"right":"left"}`}
      @click=${l}>${n.label}</div>`;let c=Te(n.color),d=t.rowStyle==="plain";return r`<div class="sp-w-row ${o?"on":""}" title=${n.entityId??n.label}
    style=${`gap:${6*a}px;font-size:${s.row*a}px;font-weight:${Pe[t.fontWeight]??400};padding:${d?0:4*a}px ${d?0:8*a}px;border-radius:${6*a}px;${kt(t,c)}`}
    @click=${l}>
    ${t.iconPosition==="leading"?ae(e,t,n,s.icon,a):m}
    <span class="sp-w-label">${n.label}</span>
    <span class="sp-w-value" style=${`color:${c}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?ae(e,t,n,s.icon,a):m}
  </div>`}function ut(e,t,n,i){let a=e.scale,s=se[t.textSize]??se.medium,o=i!==void 0&&C(i,n.rowId),l=Te(n.color),c=t.rowStyle==="plain";return r`<div class="sp-w-cell ${o?"on":""}" title=${n.label}
    style=${`gap:${3*a}px;font-size:${s.compact*a}px;font-weight:${Pe[t.fontWeight]??400};padding:${c?0:3*a}px ${c?0:6*a}px;border-radius:${6*a}px;${kt(t,l)}`}
    @click=${()=>W(e,n.rowId)}>
    ${t.iconPosition==="leading"?ae(e,t,n,s.icon,a):m}
    <span class="sp-w-value" style=${`color:${l}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?ae(e,t,n,s.icon,a):m}
  </div>`}function gt(e){return r`<div class="sp-w-divider" style=${`height:${Math.max(1,.5*e)}px`}></div>`}function Cn(e){let t=e.phone===void 0?"Status page on the watch":"Status page on the iPhone";return nt(e.phone,e.screen,e.scale,Pt(e,t),t,e.icons)}function En(e){let t={hass:e.hass,icons:e.icons,screen:e.screen,scale:e.scale,uiState:new Map([[xe,x(e.page)]]),document:{statusPages:[e.page]},requestUpdate:()=>{}};return Pt(t,`${A(e.page)||"Untitled page"} on the watch`)}function Pt(e,t){let{width:n,height:i}=e.screen,a=e.scale,s=P(e),o=G(e),l=o===void 0?void 0:_(o),c;if(s===void 0)c=r`<p class="sp-w-empty">No status page.</p>`;else{let d=Mt(s),g=Me(s,e.hass.states),f=d.columnLayout==="twoColumn"?Fe(g).map((b,p,u)=>r`${b.kind==="header"?pt(e,d,b.row,l):r`<div class="sp-w-pair" style=${`gap:${8*a}px`}>${ut(e,d,b.first,l)}${b.second===void 0?r`<span class="sp-w-cell sp-w-spacer"></span>`:ut(e,d,b.second,l)}</div>`}
          ${d.showDividers&&p<u.length-1?gt(a):m}`):g.map((b,p)=>r`${pt(e,d,b,l)}${d.showDividers&&p<g.length-1?gt(a):m}`),h=ct[d.backgroundMaterial]??ct.regular;c=r`<div class="sp-w-scroll" style=${`padding:${30*a}px ${6*a}px ${12*a}px;gap:${12*a}px`}>
      <div class="sp-w-card" style=${`padding:${8*a}px ${(6+d.horizontalPadding)*a}px;border-radius:${14*a}px;background:rgba(255,255,255,${h});font-family:${ie[d.fontDesign]??ie.default}`}>
        <div class="sp-w-rows" style=${`gap:${d.rowSpacing*a}px;padding:${4*a}px 0`}>
          ${g.length===0?r`<span class="sp-w-none" style=${`font-size:${11*a}px`}>${M(s).length===0?"Add entities":"Nothing to show now"}</span>`:f}
        </div>
      </div>
      <div class="sp-w-done" style=${`font-size:${15*a}px;padding:${12*a}px 0;border-radius:${20*a}px`}>Done</div>
    </div>`}return r`<div class="sp-screen" role="group" aria-label=${t}
    style=${`width:${Math.round(n*a)}px;min-height:${Math.round(i*a)}px`}>${c}</div>`}function Hn(e){let t=P(e);if(t===void 0)return[];let n=M(t),i=n.filter(a=>a.isHidden===!0).length;return[B(n.length,"row","rows")+(i>0?`, ${i} hidden`:"")]}function Tt(e,t){return st(e.uiState,E,t)}function _t(e,t){it(e.uiState,E,t,!Tt(e,t)),e.requestUpdate()}var zt={row:{color:H.content,icon:"content"},add:{color:H.content,icon:"plus"},page:{color:H.place,icon:"text"},rows:{color:"var(--wa-hue-yellow)",icon:"checklist"},text:{color:H.place,icon:"text"},more:{color:H.place,icon:"look"}},jt=["look-rows","look-text","look-more"];function N(e,t,n,i,a,s={}){let o=Tt(e,n),l=zt[t];return Re({color:l.color,icon:v(l.icon),title:i,open:o,onToggle:()=>_t(e,n),...s.summary===void 0||s.summary===""?{}:{summary:s.summary},dot:s.dot===!0,id:`${E}:${n}`},o?a:r``)}function Ut(e){if(K(e)!==void 0)return[{module:E,section:"add"}];let t=jt.map(n=>({module:E,section:n}));return G(e)!==void 0?[{module:E,section:"row"},...t]:[{module:E,section:"page"},...t]}var Rt=":order";function qt(e,t,n,i){let a=n.trim().toLowerCase(),s=new Set(t),o=e.filter(l=>a===""||l.toLowerCase().includes(a)||i(l).toLowerCase().includes(a));return[...o.filter(l=>s.has(l)),...o.filter(l=>!s.has(l))]}function re(e){for(let t of[...e.keys()])t.endsWith(Rt)&&e.delete(t)}function Ct(e,t,n,i,a){let s=`${t}:q`,o=`${t}${Rt}`,l=String(e.uiState.get(s)??"").trim().toLowerCase(),c=new Set(i),d=e.uiState.get(o);(d===void 0||d.query!==l)&&(d={query:l,first:[...i]},e.uiState.set(o,d));let g=qt(n,d.first,l,h=>J(e.hass,h)),f=g.slice(0,200);return r`<div class="sp-pick">
    <input type="search" class="sp-pick-q" placeholder="Search entities" aria-label="Search entities" .value=${String(e.uiState.get(s)??"")}
      @input=${h=>{e.uiState.set(s,h.target.value),e.requestUpdate()}} />
    <div class="sp-pick-list" role="group" aria-label="Entities">
      ${f.length===0?r`<div class="sp-pick-none">${n.length===0?"No entity of this kind in Home Assistant.":"No entity matches."}</div>`:m}
      ${He(f,h=>h,h=>r`<label class="sp-pick-row">
        <input type="checkbox" .checked=${Ee(c.has(h))} ?disabled=${e.busy}
          @change=${b=>a(h,b.target.checked)} />
        <span class="sp-pick-name">${J(e.hass,h)}</span><code>${h}</code>
      </label>`)}
      ${g.length>f.length?r`<div class="sp-pick-none">${g.length-f.length} more. Search to narrow the list.</div>`:m}
    </div>
  </div>`}function Jt(e,t,n){let i=x(t),a=_(n),s=R(n),o=(p,u,$)=>e.edit(y=>L(y,i,a,p,u),$),l=s.rowType==="sectionHeader",c=s.rowType==="groupCount"||s.rowType==="dynamicList",d=s.rowType==="dynamicList"&&s.dynamicMode==="all",g=s.rowType==="groupCount"||s.rowType==="dynamicList"&&!d,f=[];f.push(T("Visibility",s.isHidden===!0?"hidden":"visible",[["visible","Visible"],["hidden","Hidden"]],p=>o("isHidden",p==="hidden"))),f.push(de("Label",s.displayName,p=>o("displayName",p,`row:${a}:label`),{placeholder:"Display Name"})),l?f.push(T("Alignment",s.headerAlignment??"leading",D("HeaderAlignment"),p=>o("headerAlignment",p))):f.push(r`<div class="ts-stack">${Le({icons:e.icons,symbols:e.symbols},s.iconName,p=>o("iconName",p,`row:${a}:icon`),`sp:icon:${a}`)}</div>`),s.rowType==="entity"&&f.push(r`<div class="ts-stack">${pe({hass:e.hass},"Entity",yt(e.hass,s.entityId),p=>{let u=p.entityId.trim();u!==""&&e.edit($=>{let y=L($,i,a,"entityId",u),w=ee(u,e.hass.states);return y=L(y,i,a,"domain",w.domain),s.iconName===ee(s.entityId).iconName&&(y=L(y,i,a,"iconName",w.iconName)),y})},`sp:entity:${a}`,{clearable:!1})}</div>`);let h=!1;if(c&&s.domain!=="sensor"){let p=Ne(s.domain,s.deviceClassFilter);if(p.length>=2){h=!0;let u=ue(s),$=p.map(y=>[y.value,y.label]);$.some(([y])=>y===u)||$.push([u,Ve(u)]),f.push(T("Show State",u,$,y=>o("filterState",y)))}}if(s.rowType==="dynamicList"){f.push(T("Entities",d?"all":"specific",D("DynamicMode"),$=>o("dynamicMode",$))),f.push(ce("Show all states",s.showAllStates===!0,$=>o("showAllStates",$?!0:void 0),!1));let p=h?"only those in the state above":`only those whose state is \u201C${ue(s)}\u201D`,u=s.maxNumericValue===void 0?"":" Either way, the max value below still applies.";f.push(r`<div class="hint ts-under">On: every entity is listed whatever its state. Off: ${p}.${u}</div>`)}if((s.domain==="sensor"?c:s.rowType==="dynamicList"&&s.maxNumericValue!==void 0)&&(f.push(Ae(Ie(s.deviceClassFilter),s.maxNumericValue,p=>o("maxNumericValue",p,`row:${a}:max`),{optional:!0,placeholder:"No limit",def:null})),f.push(r`<div class="hint ts-under">Only states at or below it count. Empty is no limit.</div>`)),c){let p=s.deviceClassFilter??[],u=Qe(s.domain,e.hass.states,p),$=y=>{let w=R(Q(me(e.document,i),a)??n).deviceClassFilter??[],S=w.includes(y)?w.filter(V=>V!==y):[...w,y];o("deviceClassFilter",S.length===0?void 0:S)};f.push(r`<div class="field sp-classes"><span>Device classes</span>
      <div class="sp-chips" role="group" aria-label="Device classes">
        ${u.length===0?r`<span class="hint">None reported for ${s.domain===""?"this row":s.domain}.</span>`:m}
        ${u.map(y=>{let w=p.includes(y);return r`<button type="button" class="pe-chip ${w?"on":""}" aria-pressed=${w?"true":"false"} ?disabled=${e.busy}
            @click=${()=>$(y)}>${y.replaceAll("_"," ")}</button>`})}
      </div></div>
      <div class="hint ts-under">${p.length===0?"None picked: every class counts.":"Only entities of these classes count."}</div>`)}if(g){let p=s.groupEntityIds??[],u=Ze(n,e.hass.states);f.push(r`<div class="field sp-entities-field"><span>Edit Entities (${p.length})</span></div>
      ${Ct(e,`sp:ents:${a}`,u,p,($,y)=>{let w=R(Q(me(e.document,i),a)??n).groupEntityIds??[],S=y?w.includes($)?w:[...w,$]:w.filter(V=>V!==$);o("groupEntityIds",S)})}`)}let b=r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Row">${f}</fieldset>`;return r`${N(e,"row","row",ht(s.rowType),b,{summary:$e(n)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this row from the page"
        @click=${()=>e.edit(p=>ye(p,i,a))}>${v("delete")}<span>Remove</span></button>
    </div>`}function Kt(e,t,n,i){let a=O(n,i),s=(o,l)=>e.edit(c=>we(c,t,i.key,o),l);switch(i.kind){case"switch":return r`${ce(i.label,a===!0,o=>s(o),i.default)}
        ${i.help===void 0?m:r`<div class="hint ts-under">${i.help}</div>`}`;case"slider":return Oe(i.label,Number(a),o=>s(o,`style:${t}:${i.key}`),{min:i.min??0,max:i.max??1,step:i.step??1,def:Number(i.default),...i.unit===void 0?{}:{unit:i.unit}});default:{let o=X.types.page.keys[i.key]?.enum??"",l=D(o);return l.length<=4?T(i.label,String(a),l,c=>s(c),{def:String(i.default)}):De(i.label,String(a),l,c=>s(c),{def:String(i.default),snapBack:!0})}}}var ve=["rowStyle","columnLayout","iconPosition"],Se=["textSize","fontDesign","fontWeight"],mt=new Set([...ve,...Se]),Bt={small:12,medium:15,large:18};function Gt(e,t,n){let i=z().find(d=>d.key===n);if(i===void 0)return;let a=x(t),s=String(O(t,i)),o=D(X.types.page.keys[n]?.enum??""),l=o.find(([d])=>d===s)?.[1]??s;return{field:i,value:s,choices:o,name:l,set:d=>{d!==String(O(P(e)??t,i))&&e.edit(g=>we(g,a,n,d))}}}function he(e,t){return z().some(n=>t(n.key)&&!Ce(O(e,n),n.default))}function U(e,t,n,i=""){let a=s=>t.choices.find(([o])=>o===s)?.[1]??s;return r`<div class="sp-look">
    <div class="sp-look-title">${le(e,t.value,String(t.field.default),s=>t.set(s),a)}</div>
    <div class="sp-pics ${i}" role="group" aria-label=${e} style=${`--n:${t.choices.length}`}>
      ${t.choices.map(([s,o])=>{let l=s===t.value;return r`<button type="button" class="sp-pic ${l?"on":""}" aria-pressed=${l?"true":"false"} aria-label=${`${e}: ${o}`}
          @click=${()=>t.set(s)}>${n(s,o)}</button>`})}
    </div>
  </div>`}function Wt(e,t){return r`<span class="sp-pic-well ${e}" aria-hidden="true"><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function Yt(e,t){return r`<span class="sp-pic-grid ${e==="twoColumn"?"two":""}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function Zt(e,t){let n=r`<i class="sp-pic-dot" aria-hidden="true"></i>`;return r`${e==="leading"?n:m}<span class="sp-pic-name">${t}</span>${e==="trailing"?n:m}`}function Xt(e,t){return r`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:${Bt[e]??15}px`}>Aa</span><span class="sp-pic-name sub">${t}</span>`}function Qt(e,t){return r`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:18px;font-family:${ie[e]??ie.default}`}>Ag</span><span class="sp-pic-name sub">${t}</span>`}function en(e){let t=n=>e.choices.find(([i])=>i===n)?.[1]??n;return r`<div class="field seg-field sp-weight-field">${le("Weight",e.value,String(e.field.default),n=>e.set(n),t)}
    <div class="seg wide sp-weight" role="group" aria-label="Weight">
      ${e.choices.map(([n,i])=>{let a=n===e.value;return r`<button type="button" class=${a?"on":""} aria-pressed=${a?"true":"false"} aria-label=${`Weight: ${i}`}
          style=${`--w:${Pe[n]??400}`} @click=${()=>e.set(n)}>${i}</button>`})}
    </div></div>`}function ft(e,t){let n=x(t),i=w=>Gt(e,t,w),[a,s,o]=ve.map(i),[l,c,d]=Se.map(i),g=w=>w.filter(S=>S!==void 0).map(S=>S.name).join(", "),f=he(t,w=>ve.includes(w)),h=he(t,w=>Se.includes(w)),b=he(t,w=>!mt.has(w)),p=Je(t),u=N(e,"rows","look-rows","Rows",r`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Rows">
    ${a===void 0?m:U("Style",a,Wt)}
    ${s===void 0?m:U("Layout",s,Yt,"across")}
    ${o===void 0?m:U("Icon",o,Zt,"inline")}
  </fieldset>`,{summary:g([a,s]),dot:f}),$=N(e,"text","look-text","Text",r`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Text">
    ${l===void 0?m:U("Size",l,Xt,"type")}
    ${c===void 0?m:U("Font",c,Qt,"type")}
    ${d===void 0?m:en(d)}
  </fieldset>`,{summary:g([l,d,c]),dot:h}),y=N(e,"more","look-more","More",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="More">
    ${z().filter(w=>!mt.has(w.key)).map(w=>Kt(e,n,t,w))}
  </fieldset>`,{summary:b?"Changed":"Defaults",dot:b});return r`${u}${$}${y}
    <div class="sp-acts">
      <button type="button" class="pe-btn" ?disabled=${e.busy||!p} title="Put the page's whole look back to the app's defaults"
        @click=${()=>e.edit(w=>qe(w,n))}>${v("reset")}<span>Reset to Defaults</span></button>
    </div>`}function tn(e,t){let n=x(t),i=A(t);return N(e,"page","page","Page",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Page">
    ${de("Name",i,a=>e.edit(s=>Ue(s,n,a),`page:${n}:name`),{placeholder:"Page Name"})}
    ${fe(t)?r`<div class="hint ts-under">One of the app's starter pages. It is edited, put on devices and deleted like any other.</div>`:m}
    <div class="sp-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Delete this status page"
        @click=${()=>wt(e,n)}>${v("delete")}<span>Delete page</span></button>
    </div>
  </fieldset>`,{summary:i})}function nn(e,t,n,i){let a=Z(t.domain,"on");return r`<button type="button" class="sp-preset ${n?"on":""}" aria-pressed=${n?"true":"false"} ?disabled=${e.busy} @click=${i}>
    <span class="sp-preset-glyph">${ke(e,t.icon,18,a===F.secondary?"#5B8FD4":a)}</span>
    <span class="sp-preset-label">${t.label}</span>
  </button>`}function sn(e,t,n){let i=c=>ne(e,{...n,...c}),a=e.uiState.get(q),s=[["entity","Entity"],["groupCount","Group Count"],["dynamicList","Dynamic List"],["header","Header"]],o=T("Add",n.kind,s,c=>{if(c==="header"){te(e,Ke());return}e.uiState.delete(q),i({kind:c,preset:void 0,picked:[],mode:"all"})}),l;if(n.kind==="entity"){let c=Number(e.uiState.get(`${k}:n`)??0)||0;l=r`<div class="ts-stack">${pe({hass:e.hass},"Entity",yt(e.hass,""),d=>{let g=d.entityId.trim();if(g==="")return;e.uiState.set(`${k}:n`,c+1);let f=P(e);if(f!==void 0&&We(f,g)){e.uiState.set(q,`${J(e.hass,g)} is on this page already.`),e.requestUpdate();return}te(e,ee(g,e.hass.states),!0),e.uiState.set(q,`Added ${J(e.hass,g)}.`),e.requestUpdate()},`sp:add:entity:${c}`,{clearable:!1})}</div>
      <div class="hint">Each entity is one row. Pick another to add it too.</div>`}else{let c=n.kind==="groupCount"?et():tt(),d=n.preset===void 0?void 0:c[n.preset],g=n.kind==="groupCount"||n.mode==="specific",f=n.kind==="groupCount"?"Counts how many of the entities you pick are in a state.":"Pick what to show. Each matching entity becomes its own row. You can switch to hand-picked entities after adding.",h=r`<div class="sp-presets" role="group" aria-label=${n.kind==="groupCount"?"Group Count":"Dynamic List"}>
      ${c.map((p,u)=>nn(e,p,n.preset===u,()=>{if(!g){te(e,be(p));return}i({preset:u,picked:[]})}))}
    </div>`,b=m;if(g&&d!==void 0){let p=n.kind==="groupCount"?d.picker==="deviceClass"?d.deviceClassFilter:void 0:d.deviceClassFilter,u=Xe(d.domain,p,e.hass.states);b=r`<div class="field sp-entities-field"><span>${d.label}: ${B(n.picked.length,"entity","entities")} picked</span></div>
        ${Ct(e,`${k}:pick`,u,n.picked,($,y)=>{let w=K(e)??n,S=w.picked.filter(V=>V!==$);ne(e,{...w,picked:y?[...S,$]:S})})}
        <div class="sp-acts">
          <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy}
            @click=${()=>{let $=(K(e)??n).picked;te(e,n.kind==="groupCount"?Be(d,$):be(d,$))}}>
            ${v("plus")}<span>Add ${n.kind==="groupCount"?"group count":"dynamic list"}</span></button>
        </div>`}l=r`<p class="hint">${f}</p>
      ${n.kind==="dynamicList"?T("Entities",n.mode,D("DynamicMode"),p=>i({mode:p,preset:void 0,picked:[]})):m}
      ${h}${b}`}return r`${N(e,"add","add","Add a row",r`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Add a row">
    ${o}${l}
    ${typeof a=="string"?r`<div class="hint sp-added" role="status">${a}</div>`:m}
  </fieldset>`,{summary:A(t)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn" @click=${()=>ne(e,void 0)}>Done</button>
    </div>`}function An(e){let t=P(e);if(t===void 0)return r`<div class="insp-head"><div class="crumbs"><span class="nm">No status page</span></div></div>
      <div class="insp-body"><p class="sp-note">Add a status page to edit it.</p></div>`;let n=A(t)||"Untitled page",i=G(e),a=K(e),s=Ut(e),o=at(e.uiState,s),l,c;if(a!==void 0)l=r`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>Ot(e)}>${n}</button><span class="sep">›</span><span class="nm">Add a row</span></div>`,c=sn(e,t,a);else if(i!==void 0){let d=R(i),g=d.displayName===""?"Display Name":d.displayName;l=r`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>W(e,void 0)}>${n}</button><span class="sep">›</span><span class="kchip" style=${`--k:${xt(e,i)}`}>${ht(d.rowType)}</span><span class="nm" title=${g}>${g}</span></div>`,c=r`${Jt(e,t,i)}${ft(e,t)}`}else l=r`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">Page</span><span class="nm" title=${n}>${n}</span></div>`,c=r`${tn(e,t)}${ft(e,t)}
      <p class="sp-note">Select a row to edit it, or add one.</p>`;return r`<div class="insp-head">
      ${l}
      <button class="expand" @click=${()=>{rt(e.uiState,s,!o),e.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${c}</div>`}var Dn=Y`
  .sp-pages-card > .layers, .sp-rows-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .sp-pages-card > .lc-note, .sp-rows-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .sp-rows-card > .lc-note.sp-drag-note { margin-top: 0; font-size: 11.5px; }
  .sp-pages-card > .lc-note.sp-shared-note { margin-top: 0; font-size: 11.5px; }
  /* The badge of a status page other devices have too: the device icons
     (linkBadgeStyles, here because the editors take this sheet) for a host
     that gives \`linkDevices\`, else the sentence, cut short in a narrow
     list, its title holding the whole name. */
  ${dt}
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
`;export{xn as a,kn as b,Pn as c,P as d,Ot as e,Tn as f,Rn as g,Cn as h,En as i,Hn as j,An as k,Dn as l};
