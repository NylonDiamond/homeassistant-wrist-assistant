import{a as Xe,b as Qe,c as et,d as tt,x as nt}from"./chunk-HBESCGPJ.js";import{w as Ze}from"./chunk-QTKSYQI4.js";import{d as ue}from"./chunk-C6K36PU4.js";import{Hb as me,Jb as Be,c as Ke,pb as ge,sb as Je,tb as Ge,ub as We,wb as H,xb as Ye,zb as fe}from"./chunk-EHMJGCEB.js";import{j as ke}from"./chunk-TOKIRHDQ.js";import{Bh as Se,oh as D,ph as S}from"./chunk-NPUC537M.js";import{B as F,C as I,D as L,E as ce,F as De,G as Ie,H as Z,I as Le,J as Ne,K as pe,L as Ve,M as Fe,N as Me,O as X,P as M,Q as _e,R as ze,S as Ue,T as je,U as qe,a as R,b as re,c as Te,d as Re,e as Ce,f as V,g as W,h as Ee,i as oe,j as Y,m as He,n as P,o as de,q as A,r as C,s as E,t as le,u as B,v as Ae,z as Oe}from"./chunk-E5KYK7XZ.js";import{ga as Pe}from"./chunk-2SPOQT2U.js";import{b as xe,f as o,i as f}from"./chunk-6ZDBXU6B.js";function xt(e,t){e.deletePage!==void 0?e.deletePage(t):e.edit(n=>Oe(n,t))}var O="status-pages",lt="sp:page",q="sp:row",T="sp:add",_="sp:drag",U="sp:added",ct="wrist-assistant-panel.status-pages.zoom.v1";function ln(e=ue()){try{let t=e?.getItem(ct),n=t==null||t===""?NaN:Number(t);return nt.includes(n)?n:void 0}catch{return}}function cn(e,t=ue()){try{t?.setItem(ct,e===void 0?"":String(e))}catch{}}var pn="Drawn from Home Assistant's states now, as the watch draws the page. Click a row to edit it, or drag it to reorder.";function pt(e,t,n){return`${e} ${e===1?t:n}`}function K(e,t){let n=e.states[t]?.attributes?.friendly_name;return typeof n=="string"&&n.trim()!==""?n:t}function ut(e,t){let n=t.indexOf(".");return{entityId:t,displayName:t===""?"":K(e,t),domain:n<0?"":t.slice(0,n)}}function St(e){switch(e){case"battery_charging":return"charging";case"illuminance":return"light";case"occupancy":case"presence":return"occupancy";case"garage_door":case"garage":return"garage";case"carbon_monoxide":return"CO";default:return e.replaceAll("_"," ")}}function kt(e,t){if(t!==void 0&&t.length>0){let n=t.map(St),a=n.length===1?n[0]:n.slice(0,2).join("/");return e==="sensor"||e==="binary_sensor"?`${a} sensors`:e==="cover"?a.includes("garage")?"garage doors":`${a} covers`:`${a} ${e}s`}return e==="person"?"people":e==="binary_sensor"?"binary sensors":`${e}s`}function gt(e){let t=R(e),n=a=>`${a} ${a===1?"entity":"entities"}`;switch(t.rowType){case"entity":return t.entityId;case"groupCount":return`${n(t.groupEntityIds?.length??0)} \xB7 group count`;case"dynamicList":return t.dynamicMode==="all"?`all ${kt(t.domain,t.deviceClassFilter)} \xB7 dynamic list`:`${n(t.groupEntityIds?.length??0)} \xB7 dynamic list`;case"sectionHeader":return"section header";default:return t.rowType}}function ft(e){return Y.labels.StatusRowType?.[e]??e}function k(e){let t=He(e.document),n=e.uiState.get(lt);return(typeof n=="string"?t.find(a=>E(P(a),n)):void 0)??t[0]}function J(e){let t=e.uiState.get(q);return typeof t=="string"?B(k(e),t):void 0}function N(e,t){t===void 0?e.uiState.delete(q):e.uiState.set(q,t),e.uiState.delete(T),$e(e.uiState),e.requestUpdate()}function Pt(e){return J(e)===void 0&&!e.uiState.has(T)?!1:(e.uiState.delete(q),e.uiState.delete(T),$e(e.uiState),e.requestUpdate(),!0)}function te(e){let t=e.uiState.get(T);return typeof t=="object"&&t!==null?t:void 0}function ee(e,t){t===void 0?e.uiState.delete(T):(e.uiState.set(T,t),e.uiState.delete(q)),e.requestUpdate()}function Tt(e,t="entity"){e.uiState.delete(U),$e(e.uiState),ee(e,{kind:t,mode:"all",picked:[]})}function Q(e,t,n=!1){let a=k(e);if(a===void 0)return;let i=P(a),s;return e.edit(r=>{let d=Ve(r,i,t);return s=d.id,d.document}),s!==void 0&&!n&&N(e,s),s}function Rt(e,t,n,a){let i=(s,r)=>{s.currentTarget instanceof HTMLElement&&s.currentTarget.classList.toggle("sp-drop",r)};return{start:s=>{e.uiState.set(_,t),s.dataTransfer?.setData("text/plain",t),s.dataTransfer&&(s.dataTransfer.effectAllowed="move")},over:s=>{typeof e.uiState.get(_)=="string"&&(s.preventDefault(),s.dataTransfer&&(s.dataTransfer.dropEffect="move"),i(s,!0))},leave:s=>i(s,!1),drop:s=>{let r=e.uiState.get(_);e.uiState.delete(_),i(s,!1),!(typeof r!="string"||E(r,t))&&(s.preventDefault(),a(r,n))},end:()=>{e.uiState.delete(_)}}}function mt(e,t,n,a){return e.icons.render(t,n,a)??o`<span class="sp-glyph-dot" style=${`background:${a};width:${Math.max(4,n*.6)}px;height:${Math.max(4,n*.6)}px`}></span>`}function Ct(e,t){let n=R(t);return n.rowType==="sectionHeader"?V.secondary:n.rowType==="entity"?W(n.domain,e.hass.states[n.entityId]?.state):W(n.domain,"on")}function un(e){let t=k(e);return o`<button type="button" class="pe-stage-add sp-add-row" aria-label="Add row" ?disabled=${e.busy||t===void 0}
    title="Add an entity, a group count, a dynamic list or a header" @click=${()=>Tt(e)}>${S("plus")}<span>Add row</span></button>`}function gn(e){let t=k(e);if(t===void 0)return f;let n=oe(t,e.hass.states).map(s=>s.rowId.toUpperCase()),a=A(t).filter(s=>!n.includes(C(s).toUpperCase()));if(a.length===0)return f;let i=J(e);return o`<div class="sp-undrawn" role="group" aria-label="Rows not on the screen now">
    <span class="sp-undrawn-l">Not on the screen now:</span>
    ${a.map(s=>{let r=R(s),d=C(s),l=i!==void 0&&E(d,C(i));return o`<button type="button" class="pe-chip ${l?"on":""}" aria-pressed=${l?"true":"false"} data-row=${d}
        title=${gt(s)} @click=${()=>N(e,d)}>${r.displayName===""?"Display Name":r.displayName}${r.isHidden===!0?" (hidden)":""}</button>`})}
  </div>`}var ne={small:{row:10,compact:9,icon:14},medium:{row:12,compact:10,icon:16},large:{row:14,compact:12,icon:18}},ve={regular:400,medium:500,semibold:600,bold:700},se={default:"-apple-system, system-ui, 'SF Pro Text', 'Helvetica Neue', sans-serif",rounded:"ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, monospace",serif:"ui-serif, 'New York', Georgia, serif"},st={ultraThin:.1,thin:.13,regular:.16,thick:.2,ultraThick:.24};function Et(e){let t=n=>{let a=F().find(i=>i.key===n);return L(e,a)};return{rowStyle:String(t("rowStyle")),textSize:String(t("textSize")),fontWeight:String(t("fontWeight")),fontDesign:String(t("fontDesign")),rowSpacing:Number(t("rowSpacing")),backgroundMaterial:String(t("backgroundMaterial")),columnLayout:String(t("columnLayout")),showDividers:t("showDividers")===!0,iconPosition:String(t("iconPosition")),horizontalPadding:Number(t("horizontalPadding"))}}function he(e){return V[e]??V.secondary}function wt(e,t){return e.rowStyle==="pillFilled"?`background:color-mix(in srgb, ${t} 15%, transparent);`:e.rowStyle==="pillOutline"?`box-shadow:inset 0 0 0 0.75px color-mix(in srgb, ${t} 40%, transparent);`:""}function bt(e,t){let n=e.edit,a=k(e),i=a===void 0?-1:A(a).findIndex(d=>E(C(d),t.rowId));if(n===void 0||e.still===!0||a===void 0||i<0)return{role:f,tabindex:f,draggable:f,key:void 0,start:void 0,over:void 0,leave:void 0,drop:void 0,end:void 0};let s=P(a),r=Rt(e,t.rowId,i,(d,l)=>n(c=>X(c,s,d,l)));return{role:"button",tabindex:"0",draggable:e.busy===!0?f:"true",key:d=>{d.key!=="Enter"&&d.key!==" "||(d.preventDefault(),N(e,t.rowId))},...r}}function ie(e,t,n,a,i){let s=he(n.color);return o`<span class="sp-w-icon" style=${`width:${a*i}px`}>${mt(e,n.icon,Math.round(a*.8*i),s)}</span>`}function it(e,t,n,a){let i=e.scale,s=ne[t.textSize]??ne.medium,r=a!==void 0&&E(a,n.rowId),d=()=>N(e,n.rowId),l=bt(e,n);if(n.kind==="sectionHeader")return o`<div class="sp-w-header ${r?"on":""}" style=${`font-size:${9*i}px;text-align:${n.align==="center"?"center":n.align==="trailing"?"right":"left"}`}
      role=${l.role} tabindex=${l.tabindex} draggable=${l.draggable}
      @dragstart=${l.start} @dragover=${l.over} @dragleave=${l.leave} @drop=${l.drop} @dragend=${l.end} @keydown=${l.key}
      @click=${d}>${n.label}</div>`;let c=he(n.color),w=t.rowStyle==="plain";return o`<div class="sp-w-row ${r?"on":""}" title=${n.entityId??n.label}
    style=${`gap:${6*i}px;font-size:${s.row*i}px;font-weight:${ve[t.fontWeight]??400};padding:${w?0:4*i}px ${w?0:8*i}px;border-radius:${6*i}px;${wt(t,c)}`}
    role=${l.role} tabindex=${l.tabindex} draggable=${l.draggable}
    @dragstart=${l.start} @dragover=${l.over} @dragleave=${l.leave} @drop=${l.drop} @dragend=${l.end} @keydown=${l.key}
    @click=${d}>
    ${t.iconPosition==="leading"?ie(e,t,n,s.icon,i):f}
    <span class="sp-w-label">${n.label}</span>
    <span class="sp-w-value" style=${`color:${c}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?ie(e,t,n,s.icon,i):f}
  </div>`}function at(e,t,n,a){let i=e.scale,s=ne[t.textSize]??ne.medium,r=a!==void 0&&E(a,n.rowId),d=he(n.color),l=t.rowStyle==="plain",c=bt(e,n);return o`<div class="sp-w-cell ${r?"on":""}" title=${n.label}
    style=${`gap:${3*i}px;font-size:${s.compact*i}px;font-weight:${ve[t.fontWeight]??400};padding:${l?0:3*i}px ${l?0:6*i}px;border-radius:${6*i}px;${wt(t,d)}`}
    role=${c.role} tabindex=${c.tabindex} draggable=${c.draggable}
    @dragstart=${c.start} @dragover=${c.over} @dragleave=${c.leave} @drop=${c.drop} @dragend=${c.end} @keydown=${c.key}
    @click=${()=>N(e,n.rowId)}>
    ${t.iconPosition==="leading"?ie(e,t,n,s.icon,i):f}
    <span class="sp-w-value" style=${`color:${d}`}>${n.value}</span>
    ${t.iconPosition==="trailing"?ie(e,t,n,s.icon,i):f}
  </div>`}function rt(e){return o`<div class="sp-w-divider" style=${`height:${Math.max(1,.5*e)}px`}></div>`}function fn(e){let t=e.phone===void 0?"Status page on the watch":"Status page on the iPhone";return Ze(e.phone,e.screen,e.scale,yt(e,t),t,e.icons)}function mn(e){let t={hass:e.hass,icons:e.icons,screen:e.screen,scale:e.scale,uiState:new Map([[lt,P(e.page)]]),document:{statusPages:[e.page]},requestUpdate:()=>{}};return yt(t,`${de(e.page)||"Untitled page"} on the watch`)}function yt(e,t){let{width:n,height:a}=e.screen,i=e.scale,s=k(e),r=J(e),d=r===void 0?void 0:C(r),l;if(s===void 0)l=o`<p class="sp-w-empty">No status page.</p>`;else{let c=Et(s),w=oe(s,e.hass.states),m=c.columnLayout==="twoColumn"?Ee(w).map((v,$,x)=>o`${v.kind==="header"?it(e,c,v.row,d):o`<div class="sp-w-pair" style=${`gap:${8*i}px`}>${at(e,c,v.first,d)}${v.second===void 0?o`<span class="sp-w-cell sp-w-spacer"></span>`:at(e,c,v.second,d)}</div>`}
          ${c.showDividers&&$<x.length-1?rt(i):f}`):w.map((v,$)=>o`${it(e,c,v,d)}${c.showDividers&&$<w.length-1?rt(i):f}`),y=st[c.backgroundMaterial]??st.regular;l=o`<div class="sp-w-scroll" style=${`padding:${30*i}px ${6*i}px ${12*i}px;gap:${12*i}px`}>
      <div class="sp-w-card" style=${`padding:${8*i}px ${(6+c.horizontalPadding)*i}px;border-radius:${14*i}px;background:rgba(255,255,255,${y});font-family:${se[c.fontDesign]??se.default}`}>
        <div class="sp-w-rows" style=${`gap:${c.rowSpacing*i}px;padding:${4*i}px 0`}>
          ${w.length===0?o`<span class="sp-w-none" style=${`font-size:${11*i}px`}>${A(s).length===0?"Add entities":"Nothing to show now"}</span>`:m}
        </div>
      </div>
      <div class="sp-w-done" style=${`font-size:${15*i}px;padding:${12*i}px 0;border-radius:${20*i}px`}>Done</div>
    </div>`}return o`<div class="sp-screen" role="group" aria-label=${t}
    style=${`width:${Math.round(n*i)}px;min-height:${Math.round(a*i)}px`}>${l}</div>`}function wn(e){let t=k(e);if(t===void 0)return[];let n=A(t),a=n.filter(i=>i.isHidden===!0).length;return[pt(n.length,"row","rows")+(a>0?`, ${a} hidden`:"")]}function vt(e,t){return Xe(e.uiState,O,t)}function Ht(e,t){Qe(e.uiState,O,t,!vt(e,t)),e.requestUpdate()}var At={row:{color:D.content,icon:"content"},add:{color:D.content,icon:"plus"},page:{color:D.place,icon:"text"},rows:{color:"var(--wa-hue-yellow)",icon:"checklist"},text:{color:D.place,icon:"text"},more:{color:D.place,icon:"look"}},Ot=["look-rows","look-text","look-more"];function j(e,t,n,a,i,s={}){let r=vt(e,n),d=At[t];return Se({color:d.color,icon:S(d.icon),title:a,open:r,onToggle:()=>Ht(e,n),...s.summary===void 0||s.summary===""?{}:{summary:s.summary},dot:s.dot===!0,id:`${O}:${n}`},r?i:o``)}function Dt(e){if(te(e)!==void 0)return[{module:O,section:"add"}];let t=Ot.map(n=>({module:O,section:n}));return J(e)!==void 0?[{module:O,section:"row"},...t]:[...t,{module:O,section:"devices"}]}var ht=":order";function It(e,t,n,a){let i=n.trim().toLowerCase(),s=new Set(t),r=e.filter(d=>i===""||d.toLowerCase().includes(i)||a(d).toLowerCase().includes(i));return[...r.filter(d=>s.has(d)),...r.filter(d=>!s.has(d))]}function $e(e){for(let t of[...e.keys()])t.endsWith(ht)&&e.delete(t)}function $t(e,t,n,a,i){let s=`${t}:q`,r=`${t}${ht}`,d=String(e.uiState.get(s)??"").trim().toLowerCase(),l=new Set(a),c=e.uiState.get(r);(c===void 0||c.query!==d)&&(c={query:d,first:[...a]},e.uiState.set(r,c));let w=It(n,c.first,d,y=>K(e.hass,y)),m=w.slice(0,200);return o`<div class="sp-pick">
    <input type="search" class="sp-pick-q" placeholder="Search entities" aria-label="Search entities" .value=${String(e.uiState.get(s)??"")}
      @input=${y=>{e.uiState.set(s,y.target.value),e.requestUpdate()}} />
    <div class="sp-pick-list" role="group" aria-label="Entities">
      ${m.length===0?o`<div class="sp-pick-none">${n.length===0?"No entity of this kind in Home Assistant.":"No entity matches."}</div>`:f}
      ${Ke(m,y=>y,y=>o`<label class="sp-pick-row">
        <input type="checkbox" .checked=${ke(l.has(y))} ?disabled=${e.busy}
          @change=${v=>i(y,v.target.checked)} />
        <span class="sp-pick-name">${K(e.hass,y)}</span><code>${y}</code>
      </label>`)}
      ${w.length>m.length?o`<div class="sp-pick-none">${w.length-m.length} more. Search to narrow the list.</div>`:f}
    </div>
  </div>`}function Lt(e,t,n){let a=P(t),i=C(n),s=R(n),r=(p,b,u)=>e.edit(g=>M(g,a,i,p,b),u),d=s.rowType==="sectionHeader",l=s.rowType==="groupCount"||s.rowType==="dynamicList",c=s.rowType==="dynamicList"&&s.dynamicMode==="all",w=s.rowType==="groupCount"||s.rowType==="dynamicList"&&!c,m=[];m.push(H("Visibility",s.isHidden===!0?"hidden":"visible",[["visible","Visible"],["hidden","Hidden"]],p=>r("isHidden",p==="hidden"))),m.push(Je("Label",s.displayName,p=>r("displayName",p,`row:${i}:label`),{placeholder:"Display Name"})),d?m.push(H("Alignment",s.headerAlignment??"leading",I("HeaderAlignment"),p=>r("headerAlignment",p))):m.push(o`<div class="ts-stack">${Be({icons:e.icons,symbols:e.symbols},s.iconName,p=>r("iconName",p,`row:${i}:icon`),`sp:icon:${i}`)}</div>`),s.rowType==="entity"&&m.push(o`<div class="ts-stack">${me({hass:e.hass},"Entity",ut(e.hass,s.entityId),p=>{let b=p.entityId.trim();b!==""&&e.edit(u=>{let g=M(u,a,i,"entityId",b),h=Z(b,e.hass.states);return g=M(g,a,i,"domain",h.domain),s.iconName===Z(s.entityId).iconName&&(g=M(g,a,i,"iconName",h.iconName)),g})},`sp:entity:${i}`,{clearable:!1})}</div>`);let y=!1;if(l&&s.domain!=="sensor"){let p=Te(s.domain,s.deviceClassFilter);if(p.length>=2){y=!0;let b=re(s),u=p.map(g=>[g.value,g.label]);u.some(([g])=>g===b)||u.push([b,Ce(b)]),m.push(H("Show State",b,u,g=>r("filterState",g)))}}if(s.rowType==="dynamicList"){m.push(H("Entities",c?"all":"specific",I("DynamicMode"),u=>r("dynamicMode",u))),m.push(fe("Show all states",s.showAllStates===!0,u=>r("showAllStates",u?!0:void 0),!1));let p=y?"only those in the state above":`only those whose state is \u201C${re(s)}\u201D`,b=s.maxNumericValue===void 0?"":" Either way, the max value below still applies.";m.push(o`<div class="hint ts-under">On: every entity is listed whatever its state. Off: ${p}.${b}</div>`)}if((s.domain==="sensor"?l:s.rowType==="dynamicList"&&s.maxNumericValue!==void 0)&&(m.push(Ge(Re(s.deviceClassFilter),s.maxNumericValue,p=>r("maxNumericValue",p,`row:${i}:max`),{optional:!0,placeholder:"No limit",def:null})),m.push(o`<div class="hint ts-under">Only states at or below it count. Empty is no limit.</div>`)),l){let p=s.deviceClassFilter??[],b=Ue(s.domain,e.hass.states,p),u=g=>{let h=R(B(le(e.document,a),i)??n).deviceClassFilter??[],G=h.includes(g)?h.filter(ae=>ae!==g):[...h,g];r("deviceClassFilter",G.length===0?void 0:G)};m.push(o`<div class="field sp-classes"><span>Device classes</span>
      <div class="sp-chips" role="group" aria-label="Device classes">
        ${b.length===0?o`<span class="hint">None reported for ${s.domain===""?"this row":s.domain}.</span>`:f}
        ${b.map(g=>{let h=p.includes(g);return o`<button type="button" class="pe-chip ${h?"on":""}" aria-pressed=${h?"true":"false"} ?disabled=${e.busy}
            @click=${()=>u(g)}>${g.replaceAll("_"," ")}</button>`})}
      </div></div>
      <div class="hint ts-under">${p.length===0?"None picked: every class counts.":"Only entities of these classes count."}</div>`)}if(w){let p=s.groupEntityIds??[],b=_e(n,e.hass.states);m.push(o`<div class="field sp-entities-field"><span>Edit Entities (${p.length})</span></div>
      ${$t(e,`sp:ents:${i}`,b,p,(u,g)=>{let h=R(B(le(e.document,a),i)??n).groupEntityIds??[],G=g?h.includes(u)?h:[...h,u]:h.filter(ae=>ae!==u);r("groupEntityIds",G)})}`)}let v=o`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Row">${m}</fieldset>`,$=A(t),x=$.findIndex(p=>E(C(p),i));return o`${j(e,"row","row",ft(s.rowType),v,{summary:gt(n)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn sp-row-up" ?disabled=${e.busy||x<=0} title="Move this row up the page"
        @click=${()=>e.edit(p=>X(p,a,i,x-1))}>${S("up")}<span>Move up</span></button>
      <button type="button" class="pe-btn sp-row-down" ?disabled=${e.busy||x<0||x>=$.length-1} title="Move this row down the page"
        @click=${()=>e.edit(p=>X(p,a,i,x+1))}>${S("down")}<span>Move down</span></button>
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this row from the page"
        @click=${()=>e.edit(p=>Me(p,a,i))}>${S("delete")}<span>Remove</span></button>
    </div>`}function Nt(e,t,n,a){let i=L(n,a),s=(r,d)=>e.edit(l=>ce(l,t,a.key,r),d);switch(a.kind){case"switch":return o`${fe(a.label,i===!0,r=>s(r),a.default)}
        ${a.help===void 0?f:o`<div class="hint ts-under">${a.help}</div>`}`;case"slider":return Ye(a.label,Number(i),r=>s(r,`style:${t}:${a.key}`),{min:a.min??0,max:a.max??1,step:a.step??1,def:Number(a.default),...a.unit===void 0?{}:{unit:a.unit}});default:{let r=Y.types.page.keys[a.key]?.enum??"",d=I(r);return d.length<=4?H(a.label,String(i),d,l=>s(l),{def:String(a.default)}):We(a.label,String(i),d,l=>s(l),{def:String(a.default),snapBack:!0})}}}var be=["rowStyle","columnLayout","iconPosition"],ye=["textSize","fontDesign","fontWeight"],ot=new Set([...be,...ye]),Vt={small:12,medium:15,large:18};function Ft(e,t,n){let a=F().find(c=>c.key===n);if(a===void 0)return;let i=P(t),s=String(L(t,a)),r=I(Y.types.page.keys[n]?.enum??""),d=r.find(([c])=>c===s)?.[1]??s;return{field:a,value:s,choices:r,name:d,set:c=>{c!==String(L(k(e)??t,a))&&e.edit(w=>ce(w,i,n,c))}}}function we(e,t){return F().some(n=>t(n.key)&&!Pe(L(e,n),n.default))}function z(e,t,n,a=""){let i=s=>t.choices.find(([r])=>r===s)?.[1]??s;return o`<div class="sp-look">
    <div class="sp-look-title">${ge(e,t.value,String(t.field.default),s=>t.set(s),i)}</div>
    <div class="sp-pics ${a}" role="group" aria-label=${e} style=${`--n:${t.choices.length}`}>
      ${t.choices.map(([s,r])=>{let d=s===t.value;return o`<button type="button" class="sp-pic ${d?"on":""}" aria-pressed=${d?"true":"false"} aria-label=${`${e}: ${r}`}
          @click=${()=>t.set(s)}>${n(s,r)}</button>`})}
    </div>
  </div>`}function Mt(e,t){return o`<span class="sp-pic-well ${e}" aria-hidden="true"><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function _t(e,t){return o`<span class="sp-pic-grid ${e==="twoColumn"?"two":""}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sp-pic-name">${t}</span>`}function zt(e,t){let n=o`<i class="sp-pic-dot" aria-hidden="true"></i>`;return o`${e==="leading"?n:f}<span class="sp-pic-name">${t}</span>${e==="trailing"?n:f}`}function Ut(e,t){return o`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:${Vt[e]??15}px`}>Aa</span><span class="sp-pic-name sub">${t}</span>`}function jt(e,t){return o`<span class="sp-pic-sample" aria-hidden="true" style=${`font-size:18px;font-family:${se[e]??se.default}`}>Ag</span><span class="sp-pic-name sub">${t}</span>`}function qt(e){let t=n=>e.choices.find(([a])=>a===n)?.[1]??n;return o`<div class="field seg-field sp-weight-field">${ge("Weight",e.value,String(e.field.default),n=>e.set(n),t)}
    <div class="seg wide sp-weight" role="group" aria-label="Weight">
      ${e.choices.map(([n,a])=>{let i=n===e.value;return o`<button type="button" class=${i?"on":""} aria-pressed=${i?"true":"false"} aria-label=${`Weight: ${a}`}
          style=${`--w:${ve[n]??400}`} @click=${()=>e.set(n)}>${a}</button>`})}
    </div></div>`}function dt(e,t){let n=P(t),a=u=>Ft(e,t,u),[i,s,r]=be.map(a),[d,l,c]=ye.map(a),w=u=>u.filter(g=>g!==void 0).map(g=>g.name).join(", "),m=we(t,u=>be.includes(u)),y=we(t,u=>ye.includes(u)),v=we(t,u=>!ot.has(u)),$=Ie(t),x=j(e,"rows","look-rows","Rows",o`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Rows">
    ${i===void 0?f:z("Style",i,Mt)}
    ${s===void 0?f:z("Layout",s,_t,"across")}
    ${r===void 0?f:z("Icon",r,zt,"inline")}
  </fieldset>`,{summary:w([i,s]),dot:m}),p=j(e,"text","look-text","Text",o`<fieldset class="sp-body sp-looks" ?disabled=${e.busy} aria-label="Text">
    ${d===void 0?f:z("Size",d,Ut,"type")}
    ${l===void 0?f:z("Font",l,jt,"type")}
    ${c===void 0?f:qt(c)}
  </fieldset>`,{summary:w([d,c,l]),dot:y}),b=j(e,"more","look-more","More",o`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="More">
    ${F().filter(u=>!ot.has(u.key)).map(u=>Nt(e,n,t,u))}
  </fieldset>`,{summary:v?"Changed":"Defaults",dot:v});return o`${x}${p}${b}
    <div class="sp-acts">
      <button type="button" class="pe-btn" ?disabled=${e.busy||!$} title="Put the page's whole look back to the app's defaults"
        @click=${()=>e.edit(u=>De(u,n))}>${S("reset")}<span>Reset to Defaults</span></button>
    </div>`}function Kt(e,t){let n=P(t);return o`${Ae(t)?o`<div class="hint keep sp-starter">One of the app's starter pages. It is edited, put on devices and deleted like any other.</div>`:f}
    <div class="pe-no-tile">
      <span class="pe-no-tile-ic" aria-hidden="true">${S("tap")}</span>
      <p>${A(t).length===0?"No rows yet. Add entities to show in this status page.":"Click a row on the stage to edit it, or drag it to reorder."}</p>
    </div>
    <div class="pe-page-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Delete this status page"
        @click=${()=>xt(e,n)}>${S("delete")}<span>Delete page</span></button>
    </div>`}function Jt(e,t,n,a){let i=W(t.domain,"on");return o`<button type="button" class="sp-preset ${n?"on":""}" aria-pressed=${n?"true":"false"} ?disabled=${e.busy} @click=${a}>
    <span class="sp-preset-glyph">${mt(e,t.icon,18,i===V.secondary?"#5B8FD4":i)}</span>
    <span class="sp-preset-label">${t.label}</span>
  </button>`}function Gt(e,t,n){let a=l=>ee(e,{...n,...l}),i=e.uiState.get(U),s=[["entity","Entity"],["groupCount","Group Count"],["dynamicList","Dynamic List"],["header","Header"]],r=H("Add",n.kind,s,l=>{if(l==="header"){Q(e,Le());return}e.uiState.delete(U),a({kind:l,preset:void 0,picked:[],mode:"all"})}),d;if(n.kind==="entity"){let l=Number(e.uiState.get(`${T}:n`)??0)||0;d=o`<div class="ts-stack">${me({hass:e.hass},"Entity",ut(e.hass,""),c=>{let w=c.entityId.trim();if(w==="")return;e.uiState.set(`${T}:n`,l+1);let m=k(e);if(m!==void 0&&Fe(m,w)){e.uiState.set(U,`${K(e.hass,w)} is on this page already.`),e.requestUpdate();return}Q(e,Z(w,e.hass.states),!0),e.uiState.set(U,`Added ${K(e.hass,w)}.`),e.requestUpdate()},`sp:add:entity:${l}`,{clearable:!1})}</div>
      <div class="hint">Each entity is one row. Pick another to add it too.</div>`}else{let l=n.kind==="groupCount"?je():qe(),c=n.preset===void 0?void 0:l[n.preset],w=n.kind==="groupCount"||n.mode==="specific",m=n.kind==="groupCount"?"Counts how many of the entities you pick are in a state.":"Pick what to show. Each matching entity becomes its own row. You can switch to hand-picked entities after adding.",y=o`<div class="sp-presets" role="group" aria-label=${n.kind==="groupCount"?"Group Count":"Dynamic List"}>
      ${l.map(($,x)=>Jt(e,$,n.preset===x,()=>{if(!w){Q(e,pe($));return}a({preset:x,picked:[]})}))}
    </div>`,v=f;if(w&&c!==void 0){let $=n.kind==="groupCount"?c.picker==="deviceClass"?c.deviceClassFilter:void 0:c.deviceClassFilter,x=ze(c.domain,$,e.hass.states);v=o`<div class="field sp-entities-field"><span>${c.label}: ${pt(n.picked.length,"entity","entities")} picked</span></div>
        ${$t(e,`${T}:pick`,x,n.picked,(p,b)=>{let u=te(e)??n,g=u.picked.filter(h=>h!==p);ee(e,{...u,picked:b?[...g,p]:g})})}
        <div class="sp-acts">
          <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy}
            @click=${()=>{let p=(te(e)??n).picked;Q(e,n.kind==="groupCount"?Ne(c,p):pe(c,p))}}>
            ${S("plus")}<span>Add ${n.kind==="groupCount"?"group count":"dynamic list"}</span></button>
        </div>`}d=o`<p class="hint">${m}</p>
      ${n.kind==="dynamicList"?H("Entities",n.mode,I("DynamicMode"),$=>a({mode:$,preset:void 0,picked:[]})):f}
      ${y}${v}`}return o`${j(e,"add","add","Add a row",o`<fieldset class="sp-body" ?disabled=${e.busy} aria-label="Add a row">
    ${r}${d}
    ${typeof i=="string"?o`<div class="hint sp-added" role="status">${i}</div>`:f}
  </fieldset>`,{summary:de(t)})}
    <div class="sp-acts">
      <button type="button" class="pe-btn" @click=${()=>ee(e,void 0)}>Done</button>
    </div>`}function bn(e){let t=k(e);if(t===void 0)return o`<div class="insp-head"><div class="crumbs"><span class="nm">No status page</span></div></div>
      <div class="insp-body"><p class="sp-note">Add a status page to edit it.</p></div>`;let n=J(e),a=te(e),i=Dt(e),s=et(e.uiState,i),r,d;if(a!==void 0)r=o`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>Pt(e)}>Page</button><span class="sep">›</span><span class="nm">Add a row</span></div>`,d=Gt(e,t,a);else if(n!==void 0){let l=R(n),c=l.displayName===""?"Display Name":l.displayName;r=o`<div class="crumbs"><button class="root" title="The page's own settings" @click=${()=>N(e,void 0)}>Page</button><span class="sep">›</span><span class="kchip" style=${`--k:${Ct(e,n)}`}>${ft(l.rowType)}</span><span class="nm" title=${c}>${c}</span></div>`,d=o`${Lt(e,t,n)}${dt(e,t)}`}else r=o`<div class="crumbs"><span class="nm pe-insp-t">Page</span></div>`,d=o`${e.pageHead??f}${dt(e,t)}${Kt(e,t)}`;return o`<div class="insp-head">
      ${r}
      <button class="expand" @click=${()=>{tt(e.uiState,i,!s),e.requestUpdate()}}>${s?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body pe-page-insp" data-help=${e.helpOn===!0?"on":"off"}>${d}</div>`}var yn=xe`
  /* The save-first line in place of a status page's ticks, in the bar
     (libraryTicksStyles has the ticks). */
  .sp-lib-hint { margin: 0; max-width: 280px; font-size: 12px; line-height: 1.3; color: var(--wa-muted); }
  .sp-glyph-dot { display: inline-block; border-radius: 50%; }
  /* The rows the screen does not draw now, under the stage: a press picks one. */
  .sp-undrawn { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 6px; max-width: 520px; align-self: center; }
  .sp-undrawn-l { font-size: 12px; color: var(--wa-muted); }
  .sp-starter { margin: 12px 0 0; }
  /* A row on the edited stage: its focus, and where a drag would land. */
  .sp-w-row[tabindex]:focus-visible, .sp-w-cell[tabindex]:focus-visible, .sp-w-header[tabindex]:focus-visible { outline: 2px solid var(--sp-mark); outline-offset: 2px; border-radius: 4px; }
  .sp-w-row[draggable="true"], .sp-w-cell[draggable="true"], .sp-w-header[draggable="true"] { cursor: grab; }
  .sp-w-row.sp-drop, .sp-w-cell.sp-drop, .sp-w-header.sp-drop { box-shadow: 0 -2px 0 0 var(--sp-mark); }

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
`;export{ln as a,cn as b,pn as c,k as d,Pt as e,un as f,gn as g,fn as h,mn as i,wn as j,bn as k,yn as l};
