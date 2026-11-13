import{$ as Qt,A as Et,B as Rt,C as Ot,D as Lt,E as Dt,F as Te,G as Ct,H as Nt,I as Mt,J as It,K as zt,L as Ut,M as Ae,N as qt,O as Vt,P as Bt,Q as Se,R as Kt,S as jt,T as te,U as Jt,V as Wt,W as Ft,X as Yt,Y as Gt,Z as Xt,_ as Zt,a as $t,aa as en,b as Ht,ba as tn,ca as V,d as ge,da as ne,e as ve,ea as nn,f as we,fa as an,g as xe,ga as on,h as ye,ha as sn,i as Tt,ia as rn,ja as dn,k as X,ka as ln,l as M,la as pn,m as Z,ma as ae,n as Q,na as ie,o as At,oa as oe,p as ee,pa as cn,q as I,qa as un,r as ke,ra as se,s as $e,sa as hn,t as z,ta as fn,u as St,v as He,w as U,x as _t,y as q,z as Pt}from"./chunk-ODVXE4QJ.js";import{c as Ze}from"./chunk-K2Z4YFL6.js";import{a as bt,e as gt,f as be,g as vt}from"./chunk-C6K36PU4.js";import{d as xt,e as yt,g as kt}from"./chunk-WUQ5FLEQ.js";import{Ib as vn,b as wt,rb as P,sb as mn,tb as _e,vb as bn,zb as gn}from"./chunk-SA3VJERW.js";import{f as wn}from"./chunk-I7MZRQ23.js";import"./chunk-JI22H6BI.js";import"./chunk-47GMAK7Q.js";import"./chunk-4ILUENBV.js";import"./chunk-AVSKWNTE.js";import"./chunk-QLXAPXSU.js";import{ga as T,ha as ut,i as L}from"./chunk-BHQ73QDG.js";import{a as ht,b as ft,c as mt}from"./chunk-TTUA2CDN.js";import"./chunk-RFPOQ2YA.js";import{i as ct}from"./chunk-PWVBP3GH.js";import{Ah as it,Lg as he,Mg as Ge,Ng as Xe,b as E,c as S,cg as Ye,ph as w,th as Qe,vh as et,wh as tt,xh as nt,yh as at}from"./chunk-NPUC537M.js";import{H as me,Mb as pt,Nb as R,aa as ot,ba as st,c as fe,ca as rt,ka as dt,oa as lt,x as G}from"./chunk-3SSFMIM7.js";import{b as Y,f as r,i as c,l as Fe}from"./chunk-6ZDBXU6B.js";import{a as x}from"./chunk-LO2NM3CE.js";var xn={list:"action",field:$t,keyOf:e=>typeof e.id=="string"&&e.id!==""?e.id:void 0,nameOf:e=>typeof e.name=="string"?e.name.trim():""},yn={list:"global",field:Ht,keyOf:e=>typeof e.key=="string"&&e.key.trim()!==""?e.key.trim():void 0,nameOf:e=>typeof e.key=="string"?`{{${e.key.trim()}}}`:""};function D(e,n){return e!=null&&Object.hasOwn(e,n)?e[n]:void 0}function B(e,n){if(!Array.isArray(e))return;let t=new Set,a=[];for(let i of e){if(!L(i))return;let s=n.keyOf(i);if(s===void 0||t.has(s))return;t.add(s),a.push([s,i])}return a}function pa(e,n,t){let a=B(e,t),i=B(n,t);if(a===void 0||i===void 0)return e;let s=new Set(i.map(([o])=>o));return a.filter(([o])=>s.has(o)).map(([,o])=>o)}function ca(e,n,t,a){let i=e===null?void 0:e,s=n===null?void 0:n,o=t===null?void 0:t,d=i===void 0?[]:B(i,a),p=s===void 0?void 0:B(s,a),l=o===void 0?void 0:B(o,a);if(d===void 0||p===void 0||l===void 0)return{value:T(s,i)?o:s,clashes:[]};let m=new Map(d),u=new Map(p),f=new Map(l),b=[],$=(h,g)=>{let y=m.get(h);return y===void 0||!T(g,y)},H=(h,g,y)=>$(h,g)?($(h,y)&&!T(g,y)&&b.push({list:a.list,key:h,name:a.nameOf(g)||a.nameOf(y)}),g):y,k=(h,g)=>m.has(h)&&!$(h,g)?void 0:g,N=p.map(([h])=>h).filter(h=>m.has(h)),Je=d.map(([h])=>h).filter(h=>u.has(h)),la=N.length!==Je.length||N.some((h,g)=>h!==Je[g]),W=[],F=h=>{h!==void 0&&W.push(h)};if(la){for(let[h,g]of p){let y=f.get(h);F(y!==void 0?H(h,g,y):k(h,g))}for(let[h,g]of l)u.has(h)||F(k(h,g))}else{for(let[h,g]of l){let y=u.get(h);F(y!==void 0?H(h,y,g):k(h,g))}for(let[h,g]of p)f.has(h)||F(k(h,g))}let We=h=>Array.isArray(h)&&h.length===W.length&&W.every((g,y)=>g===h[y]);return We(o)?{value:o,clashes:b}:We(s)?{value:s,clashes:b}:{value:W,clashes:b}}function ua(e,n,t,a){return e==null?pa(D(t,a.field),D(n,a.field),a):D(e,a.field)}function Pe(e,n,t,a){return ca(ua(e,n,t,a),D(n,a.field),D(t,a.field),a)}function kn(e,n,t){return[...Pe(e,n,t,xn).clashes,...Pe(e,n,t,yn).clashes]}function $n(e,n,t){let a=ut(e,n,t);for(let i of[xn,yn]){let s=Pe(e,n,t,i).value,o=D(a,i.field);if(s!==o){if(s===void 0){if(!Object.hasOwn(a,i.field))continue;let{[i.field]:d,...p}=a;a=p;continue}(a===t||a===n)&&(a={...a}),a[i.field]=s}}return a}var Hn=100,ha=3,re=class{constructor(n,t){this._undo=[];this._redo=[];this._kept=[];this._base=n,this._revision=t,this._document=n}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get kept(){return this._kept}get dirty(){let n=this._dirty;if(n!==void 0&&n.document===this._document&&n.base===this._base)return n.value;let t=this._document!==this._base&&!T(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:t},t}apply(n,t){if(n===this._document||T(n,this._document))return(t===void 0||t!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(t!==void 0&&t===this._coalesceKey&&this._undo.length>0){let a=this._undo[this._undo.length-1];return T(n,a)?(this._undo.pop(),this._document=a,this._coalesceKey=void 0):this._document=n,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=n,this._coalesceKey=t,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let n=this._undo.pop();return n===void 0?!1:(this._redo.push(this._document),this._document=n,!0)}redo(){this._coalesceKey=void 0;let n=this._redo.pop();return n===void 0?!1:(this.pushUndo(this._document),this._document=n,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(n,t){return t<this._revision?(this._kept=[],!1):this.mergeOnto(n,t)}restart(n,t){return this.mergeOnto(n,t)}mergeOnto(n,t){this._coalesceKey=void 0;let a=this._base;this._kept=this._document===a?[]:kn(a,this._document,n);let i=new Map,s=u=>{let f=i.get(u);if(f!==void 0)return f;let b=u===a?n:$n(a,u,n);return b!==n&&T(b,n)&&(b=n),i.set(u,b),b},o=this._document,d=[...this._undo,this._document,...this._redo.slice().reverse()].map(s),p=this._undo.length,l=[],m=0;return d.forEach((u,f)=>{let b=l[l.length-1];b!==void 0&&(b===u||T(b,u))?f===p&&(l[l.length-1]=u):l.push(u),f===p&&(m=l.length-1)}),this._undo=l.slice(0,m),this._document=l[m],this._redo=l.slice(m+1).reverse(),this._base=n,this._revision=t,this._document!==o&&!T(this._document,o)}saved(n,t){t<this._revision||(this._coalesceKey=void 0,this._base=n,this._revision=t)}get saving(){return K.has(this)}get saveDone(){return K.get(this)}pushUndo(n){this._undo.push(n),this._undo.length>Hn&&this._undo.splice(0,this._undo.length-Hn)}},K=new WeakMap;function Tn(e,n){if(K.has(e))return Promise.resolve({ok:!1,revision:e.revision,merged:!1,code:"busy",message:"The HTTP actions are being saved already."});let t=ma(e,n).finally(()=>K.delete(e));return K.set(e,t),t}function fa(e){let n=X(e);return n.size<=n.limit?[]:[`The library is ${Math.ceil(n.size/1024)} KB, past the ${n.limit/1024} KB Home Assistant keeps.`]}async function ma(e,n){let t=!1,a=new Map,i=()=>a.size===0?{}:{kept:[...a.values()]},s=(o,d,p)=>({ok:!1,revision:e.revision,merged:t,code:o,message:d,...i(),...p===void 0?{}:{problems:p}});for(let o=1;;o++){let d=e.document,p=[...pn(d),...fa(d)];if(p.length>0)return s("invalid",p.join(" "),p);let l;try{({revision:l}=await n.save(e.revision,d))}catch(m){let{code:u="unknown",message:f}=R(m);if(u!=="conflict"||o>=ha)return s(u,f);let b;try{b=await n.fetch()}catch(k){let N=R(k);return s(N.code??"unknown",N.message)}let $=L(b)&&typeof b.revision=="number"?b.revision:0,H=L(b)&&L(b.document)?b.document:ye();$<e.revision?e.restart(H,$):e.rebase(H,$);for(let k of e.kept)a.set(`${k.list}:${k.key}`,k);if(t=!0,!e.dirty)return{ok:!0,revision:e.revision,merged:t,alreadySaved:!0,...i()};continue}return e.saved(d,l),{ok:!0,revision:e.revision,merged:t,...i()}}}var O;function Ee(){return O}function An(e,n){let t=O;if(n<=0||e===void 0)return{...t===void 0?{}:{draft:t},mergedIntoEdits:!1,kept:[]};if(t===void 0||n<t.revision&&!t.dirty){let s=new re(e,n);return O=s,{draft:s,mergedIntoEdits:!1,kept:[]}}if(n===t.revision)return{draft:t,mergedIntoEdits:!1,kept:[]};let a=t.dirty,i=n<t.revision?t.restart(e,n):t.rebase(e,n);return{draft:t,mergedIntoEdits:a&&i,kept:a?t.kept:[]}}function Sn(){return O??=new re(ye(),0),O}function Re(){return O?.dirty??!1}function _n(){O=void 0}function ba(e){return e.list==="global"?e.name.trim()===""?`{{${e.key}}}`:e.name:`"${e.name.trim()===""?"an untitled action":e.name}"`}function de(e){if(e.length===0)return"";let n=e.map(ba);return`${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`} also changed somewhere else. ${n.length===1?"Your version was kept.":"Your versions were kept."}`}function Pn(e){if(e.ok){let t=e.kept??[];if(e.alreadySaved===!0){let a=t.length>0?` ${de(t)}`:"";return{kind:t.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${e.revision}.${a}`}}return t.length>0?{kind:"warn",text:`Saved. ${de(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The HTTP actions kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the HTTP actions${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${pt}`};case"busy":return{kind:"warn",text:"Already saving. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the HTTP actions just now. Your edits are kept, so try again in a moment."};case"unknown_command":return{kind:"err",text:"Not saved. Update the integration to edit HTTP actions here."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}var ga=/"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\],:]/g;function En(e,n=2){let t=e.trim();if(t!==""){try{JSON.parse(t)}catch{return}return Rn(t.match(ga)??[],n)}}function Rn(e,n){let t=[],a=0,i=()=>t.push({kind:"ws",text:`
${" ".repeat(a*n)}`}),s=[],o=()=>s.map(p=>p.key??String(p.index??0)).join("."),d=(p,l)=>t.push(s.length===0?{kind:p,text:l}:{kind:p,text:l,path:o()});for(let p=0;p<e.length;p+=1){let l=e[p],m=e[p+1];if(l.startsWith("{{"))t.push({kind:"var",text:l});else if(l==="{"||l==="["){let u=l==="{"?"}":"]";m===u?(t.push({kind:"punct",text:l+u}),p+=1):(t.push({kind:"punct",text:l}),s.push(l==="["?{index:0}:{}),a+=1,i())}else if(l==="}"||l==="]")s.pop(),a=Math.max(0,a-1),i(),t.push({kind:"punct",text:l});else if(l===","){let u=s[s.length-1];u?.index!==void 0&&(u.index+=1),t.push({kind:"punct",text:l}),i()}else if(l===":")t.push({kind:"punct",text:": "});else if(l.startsWith('"'))if(m===":"){let u=s[s.length-1];if(u!==void 0)try{u.key=String(JSON.parse(l))}catch{u.key=l.slice(1,-1)}t.push({kind:"key",text:l})}else d("str",l);else d(l==="true"||l==="false"||l==="null"?"lit":"num",l)}return t}var va=/\{\{[A-Za-z0-9_]+\}\}/g,On=/\{\{[A-Za-z0-9_]+\}\}|"(?:[^"\\\n]|\\.)*"?|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\btrue\b|\bfalse\b|\bnull\b|[{}[\],:]/g;function Ln(e,n=2){let t=e.trim();if(t==="")return;let a=[],i="",s=0;for(let o of t.matchAll(On)){if(t.slice(s,o.index).trim()!=="")return;a.push(o[0]),i+=o[0].startsWith("{{")?"0":o[0],s=o.index+o[0].length}if(t.slice(s).trim()===""){try{JSON.parse(i)}catch{return}return Oe(Rn(a,n))}}function Dn(e,n){let t=[],a=0,i=[...e.matchAll(n?On:va)];return i.forEach((s,o)=>{s.index>a&&t.push({kind:"ws",text:e.slice(a,s.index)});let d=s[0];a=s.index+d.length;let p;if(d.startsWith("{{"))p="var";else if(d.startsWith('"')){let l=i[o+1];p=l!==void 0&&l[0]===":"&&e.slice(a,l.index).trim()===""?"key":"str"}else d==="true"||d==="false"||d==="null"?p="lit":/^[{}[\],:]$/.test(d)?p="punct":p="num";t.push({kind:p,text:d})}),a<e.length&&t.push({kind:"ws",text:e.slice(a)}),t}function Oe(e){return e.map(n=>n.text).join("")}function le(e){return e<1024?`${e} ${e===1?"byte":"bytes"}`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(2)} MB`}var Me="ha:sel",In="ha:tab",zn="ha:rtab",Un="ha:bmode",qn="ha:bwrap",Le="ha:bcopied",Cn="ha:qwrap",De="ha:qcopied",Ie="ha:show:",Vn="ha:auth:",Bn="ha:test:",C="ha:look",ze="network",wa="#CCD8E6",xa="Web requests Home Assistant sends when a watch runs one, from a tile, a menu, a complication or a control. A save reaches every watch the next time it checks.",Kn="Fixed values any action can use as {{key}}, such as a server address or a token. Change one here and every action that uses it follows.",ya="The watch records a voice clip of up to 30 seconds when the action runs and sends it as the body, as audio/mp4. Nothing to type here.",ka="This method sends no body. Pick POST, PUT, PATCH or DELETE to send one.",$a=`Empty means ${ve} seconds. Home Assistant holds it between ${we} and ${xe}.`,Ha="Only for a server you run whose HTTPS certificate is not publicly trusted.",jn="With no URL the watch shows the action as needing setup.",Ta="Press Send to try this action. Home Assistant sends it. Nothing is saved.",Aa="For a value you choose on the watch each time, such as a brightness or a message. Type {{name}} in the URL, a header or the body, and the watch asks for it when you tap the action.",Sa="This action asks for nothing. It runs as soon as you tap it.",_a="filled in from Globals, so the watch does not ask",Pa=[["none","None"],["json","JSON"],["form","Form"],["text","Text"],["audio","Voice clip"]],Ea={none:void 0,json:"application/json",form:"application/x-www-form-urlencoded",text:"text/plain",audio:"audio/mp4"},Ra={none:"Request body",json:'{"key": "value"}',form:"key=value&other=123",text:"Plain text",audio:""},Oa=[["none","None"],["statusCode","Status code"],["bodyText","Body text"],["jsonField","JSON field"],["header","Header"],["regex","Regex"]];function La(e,n,t){return`${e} ${e===1?n:t}`}function Da(e){if(z(e))return`${I(e)} \xB7 no URL yet`;let n=e.url.trim().replace(/^https?:\/\//i,"");return`${I(e)} \xB7 ${n}`}function Jn(e){let n=e.trim().toUpperCase();switch(n){case"GET":return{text:"GET",tone:"get"};case"POST":return{text:"POST",tone:"post"};case"PUT":return{text:"PUT",tone:"put"};case"PATCH":return{text:"PATCH",tone:"patch"};case"DELETE":return{text:"DEL",tone:"del"};default:return{text:n===""?"?":n.slice(0,5),tone:"other"}}}function Ca(e){let n=Jn(e);return r`<span class="ha-mtag m-${n.tone}" title=${e.trim().toUpperCase()}>${n.text}</span>`}function Wn(e){let n=e.uiState.get(Me);if(n?.kind==="action"&&Q(e.document,n.id)!==void 0||n?.kind==="globals")return n;let t=M(e.document)[0];return typeof t?.id=="string"?{kind:"action",id:t.id}:void 0}function j(e,n){n===void 0?e.uiState.delete(Me):e.uiState.set(Me,n),e.uiState.delete(C),e.requestUpdate()}var Na=["headers","auth","body","prompts","reply","settings"],Ma=["body","headers","paths"];function Ia(e){let n=e.uiState.get(In);return Na.includes(n)?n:"headers"}function Fn(e,n){e.uiState.set(In,n),e.requestUpdate()}function za(e){let n=e.uiState.get(zn);return Ma.includes(n)?n:"body"}function Ua(e,n){e.uiState.set(zn,n),e.requestUpdate()}function Yn(e){return e.uiState.get(Un)==="raw"?"raw":"pretty"}function qa(e){return e.uiState.get(qn)!==!1}function Va(e,n){let t=n.body??n.snippet,a=En(t),i=a!==void 0&&Yn(e)==="pretty";return{raw:t,isJson:a!==void 0,pieces:i?a:void 0,text:i?Oe(a):t}}function Gn(e,n,t,a,i,s){return r`<div class="ha-tabs ${s}" role="tablist" aria-label=${e}
    @keydown=${o=>{if(o.key!=="ArrowRight"&&o.key!=="ArrowLeft"&&o.key!=="Home"&&o.key!=="End")return;let d=t.findIndex(m=>m.id===a),p=o.key==="Home"?0:o.key==="End"?t.length-1:(d+(o.key==="ArrowRight"?1:-1)+t.length)%t.length;o.preventDefault(),i(t[p].id),o.currentTarget.querySelectorAll("[role=tab]")[p]?.focus()}}>
    ${t.map(o=>r`<button type="button" role="tab" class="ha-tab ${o.id===a?"on":""}" id=${`${n}-${o.id}`}
      aria-selected=${o.id===a?"true":"false"} aria-controls=${`${n}-panel`} tabindex=${o.id===a?"0":"-1"}
      @click=${()=>i(o.id)}>${o.label}${o.extra??c}</button>`)}
  </div>`}var pe=e=>e===0?c:r`<span class="ha-tab-n">${e}</span>`,Ce=e=>e?r`<i class="ha-tab-dot" aria-label="set"></i>`:c;function A(e,n,t,a){return e.edit(i=>Yt(t(i),n,()=>e.newId()),a)}function ce(e){let n=e.newId();return e.edit(t=>Ot(t,Et(n,Rt(t)))),j(e,{kind:"action",id:n}),n}function Ba(e){let n=e.newId();return e.edit(t=>on(t,n,an(t))),j(e,{kind:"globals"}),n}function Ka(e,n){let t;e.edit(a=>{let i=Lt(a,n,()=>e.newId());return t=i.id,i.document}),t!==void 0&&j(e,{kind:"action",id:t})}function ue(e){return e.uiState.has(C)?(e.uiState.delete(C),e.requestUpdate(),!0):!1}function Xn(e,n){return e.uiState.get(Ie+n)===!0}function ja(e,n){Xn(e,n)?e.uiState.delete(Ie+n):e.uiState.set(Ie+n,!0),e.requestUpdate()}function qe(e,n,t,a,i,s=""){let o=Xn(e,i);return r`<span class="ha-secret">
    <input type=${o?"text":"password"} class="mono" .value=${t} placeholder=${s} aria-label=${n}
      autocomplete="off" spellcheck="false" data-secret=${i}
      @input=${d=>a(d.target.value)} />
    <button type="button" class="ha-show" aria-pressed=${o?"true":"false"} aria-label=${`${o?"Hide":"Show"} ${n}`}
      @click=${()=>ja(e,i)}>${o?"Hide":"Show"}</button>
  </span>`}function Ne(e,n,t,a,i,s=""){return r`<div class="field ha-secret-field"><span>${n}</span>${qe(e,n,t,a,i,s)}</div>`}function Zn(e,n,t,a={}){return r`<label class="ha-switch"><input type="checkbox" .checked=${n} ?disabled=${a.disabled===!0}
    @change=${i=>t(i.target.checked)} /><span>${e}</span></label>`}function Ve(e,n){let t=e.uiState.get(Vn+n.id);if(t!==void 0){let a=t.headerId===void 0?void 0:n.headers.find(s=>s.id===t.headerId);if(a===void 0)return{auth:t.auth.kind===t.kind?t.auth:te(t.kind)};if(t.kind==="apiKey")return{auth:{...te("apiKey"),headerName:a.name,apiKeyValue:a.value},headerId:a.id};let i=Jt(a);return i!==void 0&&i.kind===t.kind?{auth:i,headerId:a.id}:{auth:te(t.kind),headerId:a.id}}return Wt(n.headers)}function Ja(e,n,t,a){let{headerId:i}=Ve(e,n),s=i;A(e,n.id,o=>{let d=Ft(o,n.id,i,t);return s=d.headerId,d.document},a),e.uiState.set(Vn+n.id,{kind:t.kind,auth:t,...s===void 0?{}:{headerId:s}}),e.requestUpdate()}function Wa(e,n){let{auth:t}=Ve(e,n),a=(d,p)=>Ja(e,n,{...t,...d},p),i=d=>`auth:${n.id}:${d}`,s=c;t.kind==="bearer"?s=Ne(e,"Token",t.token,d=>a({token:d},i("token")),i("token"),"Paste the token"):t.kind==="basic"?s=r`${P("Username",t.username,d=>a({username:d},i("user")))}
      ${Ne(e,"Password",t.password,d=>a({password:d},i("password")),i("password"))}`:t.kind==="apiKey"&&(s=r`${P("Header",t.headerName,d=>a({headerName:d},i("name")),{mono:!0,placeholder:"X-Api-Key"})}
      ${Ne(e,"Key",t.apiKeyValue,d=>a({apiKeyValue:d},i("key")),i("key"),"Paste the key")}`);let o=t.kind==="none"?"Add sign-in if the server asks for it. It is written as one header.":t.kind==="basic"?"Sent as an Authorization header, the username and password encoded together.":t.kind==="bearer"?"Sent as Authorization: Bearer and the token.":"Sent as a header with the key as its value.";return r`<p class="ha-line">${o}</p>
    <div class="ha-form">
      ${_e("Type",t.kind,jt,d=>a({kind:d}),{snapBack:!0})}
      ${s}
    </div>`}function Fa(e,n,t,a){return e.icons.render(n,t,a)??r`<span class="ha-glyph-dot" style=${`background:${a}`}></span>`}function Qn(e){return n=>{n.target!==n.currentTarget||n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),e())}}function Ya(e,n,t,a,i){let s=St(n),o=()=>j(e,{kind:"action",id:n.id}),d=z(n);return r`<div class="ha-item ${i?"on":""}" role="listitem" tabindex="0" data-action=${n.id}
    aria-current=${i?"true":"false"} aria-label=${s} title=${`${s} \xB7 ${Da(n)}`}
    @click=${p=>{p.target instanceof Element&&p.target.closest("button")||o()}}
    @keydown=${Qn(o)}>
    ${Ca(I(n))}
    <span class="ha-item-name">${s}</span>
    ${d?r`<span class="ha-need-mark" title=${jn}>needs setup</span>`:c}
    ${$e(n)?r`<span class="ha-mark">voice</span>`:c}
    <span class="ha-item-acts">
      <button type="button" class="icon" ?disabled=${e.busy||t===0} title="Move up" aria-label=${`Move ${s} up`}
        @click=${()=>e.edit(p=>Te(p,n.id,t-1))}>${w("up")}</button>
      <button type="button" class="icon" ?disabled=${e.busy||t===a-1} title="Move down" aria-label=${`Move ${s} down`}
        @click=${()=>e.edit(p=>Te(p,n.id,t+1))}>${w("down")}</button>
    </span>
  </div>`}function ea(e){let n=M(e.document).map(ee),t=Z(e.document).length,a=Wn(e),i=a?.kind==="globals",s=()=>j(e,{kind:"globals"});return r`<section class="card lc ha-list-card" aria-label="Actions" style="--c: var(--wa-lc-layers, #4a7fe8)">
    <div class="lc-head">
      <span class="swatch">${w("globe")}</span><span class="lc-title">Actions</span>
      <span class="lc-sub" title=${xa}>${n.length}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri ha-add" aria-label="Add an action" ?disabled=${e.busy}
        title="A new action" @click=${()=>ce(e)}>${w("plus")}<span>Add</span></button>
    </div>
    ${n.length===0?r`<div class="lc-note ha-list-note">No actions yet. Add one to send a request from the watch.</div>`:r`<div class="ha-items" role="list">${n.map((o,d)=>Ya(e,o,d,n.length,a?.kind==="action"&&a.id===o.id))}</div>`}
    <div class="ha-list-foot">
      <div class="ha-item ha-globals-item ${i?"on":""}" role="button" tabindex="0" aria-pressed=${i?"true":"false"}
        title=${Kn} @click=${s} @keydown=${Qn(s)}>
        <span class="ha-mtag ha-gtag" aria-hidden="true">{ }</span>
        <span class="ha-item-name">Globals</span>
        <span class="ha-count">${t}</span>
      </div>
    </div>
  </section>`}function Ga(e){let n=e.trim();if(n===""||n.startsWith("{"))return;let t=n.toLowerCase();return t.startsWith("http://")||t.startsWith("https://")?void 0:"Add http:// or https://. Without one the request will not send."}function Xa(e,n){let t=n.id;return r`<div class="ha-look-pop" role="dialog" aria-label="Icon and color">
    <fieldset class="ha-set" ?disabled=${e.busy}>
      <div class="ha-stack">${vn({icons:e.icons,symbols:e.symbols},n.icon??ze,a=>e.edit(i=>Nt(i,t,a===ze?"":a),`a:${t}:icon`),`ha:icon:${t}`,{clearable:(n.icon??"")!=="",tint:n.iconColor})}</div>
      ${gn("Color",n.iconColor,a=>e.edit(i=>Mt(i,t,a),`a:${t}:color`),!0,null)}
    </fieldset>
    <div class="ha-pop-foot"><span class="ha-line">The icon and color the action wears on the watch.</span>
      <button type="button" class="pe-btn ha-sm" @click=${()=>ue(e)}>Done</button></div>
  </div>`}function Za(e,n){let t=n.id,a=n.iconColor??wa,i=e.uiState.get(C)===t;return r`<div class="ha-titlerow">
    <span class="ha-look">
      <button type="button" class="ha-look-btn" style=${`--c:${a}`} aria-haspopup="dialog" aria-expanded=${i?"true":"false"}
        title="Icon and color" aria-label="Icon and color"
        @click=${()=>{i?e.uiState.delete(C):e.uiState.set(C,t),e.requestUpdate()}}>
        <span class="ha-look-glyph">${Fa(e,n.icon??ze,16,a)}</span>
      </button>
      ${i?Xa(e,n):c}
    </span>
    <input type="text" class="ha-name" .value=${n.name} placeholder="My action" aria-label="Name" ?disabled=${e.busy}
      @input=${s=>e.edit(o=>Ct(o,t,s.target.value),`a:${t}:name`)} />
    <span class="ha-title-acts">
      <button type="button" class="pe-btn ha-sm" ?disabled=${e.busy} title="A copy with new ids, named Copy"
        @click=${()=>Ka(e,t)}>${w("duplicate")}<span>Duplicate</span></button>
      <button type="button" class="pe-btn ha-sm pe-danger" ?disabled=${e.busy}
        title="Remove this action. Tiles and menu items that run it stop working."
        @click=${()=>e.edit(s=>Dt(s,t))}>${w("delete")}<span>Remove</span></button>
    </span>
  </div>`}function Qa(e,n){let t=n.id,a=_(e,t),i=z(n),s=I(n),o=Jn(s),d=ge.includes(s),p=Ga(n.url);return r`<div class="ha-reqbar">
      <div class="ha-reqbox">
        <select class="ha-method m-${o.tone}" aria-label="Method" ?disabled=${e.busy} .value=${s}
          @change=${l=>{A(e,t,m=>It(m,t,l.target.value)),e.requestUpdate()}}>
          ${d?c:r`<option value=${s} selected>${s}</option>`}
          ${ge.map(l=>r`<option value=${l} ?selected=${l===s}>${l}</option>`)}
        </select>
        <input type="text" class="ha-url mono" .value=${n.url} placeholder="https://example.com/api" aria-label="URL"
          spellcheck="false" autocomplete="off" ?disabled=${e.busy}
          @input=${l=>A(e,t,m=>zt(m,t,l.target.value),`a:${t}:url`)}
          @keydown=${l=>{l.key!=="Enter"||l.isComposing||(l.preventDefault(),Mn(e,t))}} />
      </div>
      <button type="button" class="pe-btn pe-primary ha-send ${a.running?"busy":""}" ?disabled=${a.running||i}
        aria-busy=${a.running?"true":"false"} title=${i?"Add a URL first":"Send it now (Enter in the URL)"}
        @click=${()=>{Mn(e,t)}}>${a.running?"Sending\u2026":"Send"}</button>
    </div>
    ${p===void 0&&!i?c:r`<div class="ha-barnote">
      ${p===void 0?c:r`<p class="ha-warn">${p}</p>`}
      ${i?r`<p class="ha-warn">${jn}</p>`:c}
    </div>`}`}function ei(e,n,t){let a=n.id,i=t===void 0?void 0:n.headers.find(o=>o.id===t),s=n.headers.filter(o=>o.id!==t);return r`<div class="ha-table ha-htable" role="table" aria-label="Headers">
    <div class="ha-tr ha-th" role="row"><span role="columnheader">Key</span><span role="columnheader">Value</span><span></span></div>
    ${i===void 0?c:r`<div class="ha-tr ha-auth-row" role="row">
      <span class="ha-td ha-ro mono" role="cell">${i.name}</span>
      <span class="ha-td ha-ro" role="cell"><span class="ha-dots" aria-label="Hidden">••••••••</span></span>
      <span class="ha-td ha-end" role="cell"><button type="button" class="ha-from-auth" title="Written by the Auth tab. Edit it there."
        @click=${()=>Fn(e,"auth")}>Auth</button></span>
    </div>`}
    ${s.map(o=>r`<div class="ha-tr" role="row">
      <span class="ha-td" role="cell"><input type="text" class="mono" .value=${o.name} placeholder="Name" aria-label="Header name" spellcheck="false"
        @input=${d=>A(e,a,p=>Se(p,a,o.id,{name:d.target.value}),`h:${o.id}:name`)} /></span>
      <span class="ha-td" role="cell">${qe(e,`${o.name.trim()||"Header"} value`,o.value,d=>A(e,a,p=>Se(p,a,o.id,{value:d}),`h:${o.id}:value`),`header:${o.id}`,"Value")}</span>
      <span class="ha-td ha-end" role="cell"><button type="button" class="icon ha-remove" title="Remove this header" aria-label=${`Remove ${o.name.trim()||"header"}`}
        @click=${()=>A(e,a,d=>Kt(d,a,o.id))}>${w("delete")}</button></span>
    </div>`)}
    <div class="ha-tr ha-addrow" role="row"><button type="button" class="ha-add-row" @click=${()=>A(e,a,o=>Bt(o,a,e.newId()))}>${w("plus")}<span>Add header</span></button></div>
  </div>
  <p class="ha-line">Header values stay hidden until shown.</p>`}function ti(e,n){if(!ke(n))return r`<p class="ha-line">${ka}</p>`;let t=n.bodyContentType,a=Ea[t];return r`<div class="ha-body-head">
      <label class="ha-inline"><span>Type</span>
        <select .value=${t} @change=${i=>{A(e,n.id,s=>Ut(s,n.id,i.target.value)),e.requestUpdate()}}>
          ${Pa.map(([i,s])=>r`<option value=${i} ?selected=${i===t}>${s}</option>`)}
        </select></label>
      ${a===void 0?c:r`<span class="ha-line">Sends Content-Type: ${a}, unless a header sets one.</span>`}
    </div>
    ${t==="audio"?r`<p class="ha-line ha-audio">${ya}</p>`:ni(e,n,t)}`}function ni(e,n,t){let a=n.body??"",i=t==="json",s=i?Ln(a):void 0,o=e.uiState.get(Cn)!==!1,d=e.uiState.get(De)===!0,p=(u,f)=>{e.uiState.set(u,f),e.requestUpdate()},l=async()=>{try{await navigator.clipboard.writeText(a),p(De,!0),setTimeout(()=>p(De,!1),1500)}catch{}},m=i&&a.trim()!==""&&s===void 0;return r`<div class="ha-bbar ha-qbar" role="toolbar" aria-label="Body options">
      ${i?r`<button type="button" class="ha-bopt" title=${m?"The body is not JSON":"Indent the JSON"}
        ?disabled=${e.busy||s===void 0||s===a}
        @click=${()=>{s!==void 0&&A(e,n.id,u=>Ae(u,n.id,s))}}>Format</button>`:c}
      <button type="button" class="ha-bopt ${o?"on":""}" aria-pressed=${o?"true":"false"} title="Wrap long lines" @click=${()=>p(Cn,!o)}>Wrap</button>
      <button type="button" class="ha-bopt" title="Copy the body" ?disabled=${a===""} @click=${()=>{l()}}>${d?"Copied":"Copy"}</button>
      <span class="ha-bmeta">${m?r`<span class="ha-bad">Not JSON</span> · `:c}${le(new TextEncoder().encode(a).length)}</span>
    </div>
    <div class="ha-code ${o?"":"nowrap"}">
      <pre class="mono" aria-hidden="true">${Dn(a,i).map(u=>u.kind==="ws"||u.kind==="punct"?u.text:r`<span class=${`j-${u.kind}`}>${u.text}</span>`)}${`
`}</pre>
      <textarea class="mono ha-body-text" spellcheck="false" autocapitalize="off" autocomplete="off" wrap=${o?"soft":"off"} aria-label="Body" .value=${a} placeholder=${Ra[t]}
        @scroll=${u=>{let f=u.target,b=f.previousElementSibling;b!==null&&(b.scrollTop=f.scrollTop,b.scrollLeft=f.scrollLeft)}}
        @input=${u=>A(e,n.id,f=>Ae(f,n.id,u.target.value),`a:${n.id}:body`)}></textarea>
    </div>`}function Nn(e,n,t,a){let i=(o,d)=>e.edit(p=>Gt(p,n.id,t.id,o),d),s=He(t);return r`<div class="ha-var ${a?"unused":""}" data-key=${t.key}>
    <div class="ha-var-head"><code>{{${t.key}}}</code>
      ${a?r`<span class="ha-mark">unused, left out when saved</span>
        <button type="button" class="icon ha-remove" title="Remove" aria-label=${`Remove {{${t.key}}}`}
          @click=${()=>e.edit(o=>Xt(o,n.id,t.id))}>${w("delete")}</button>`:c}
    </div>
    ${a?c:r`<div class="ha-var-grid">
      ${P("Prompt",t.prompt,o=>i({prompt:o},`v:${t.id}:prompt`),{placeholder:"Message"})}
      ${bn("Kind",t.kind,[["text","Text"],["number","Number"]],o=>i({kind:o}))}
      <label class="field ha-quick"><span>Quick values</span>
        <textarea rows=${Math.max(2,Math.min(6,t.presetValues.length+1))} .value=${t.presetValues.join(`
`)} placeholder="One per line"
          @input=${o=>i({presetValues:o.target.value.split(`
`)},`v:${t.id}:presets`)}></textarea></label>
      <div class="ha-only">${Zn("Only these",t.presetsOnly,o=>i({presetsOnly:o}),{disabled:s.length===0&&!t.presetsOnly})}
        <span class="ha-line">${s.length===0?"Add a quick value to offer only these.":t.presetsOnly?"The watch shows only the quick values, with no typing.":"The watch offers the quick values and lets you type too."}</span></div>
    </div>`}
  </div>`}function ai(e,n){let t=U(e.document),a=_t(n,t),i=Zt(n,t),s=a.asked.filter(o=>!n.variables.some(d=>d.key===o));return r`<p class="ha-line" title=${hn}>${Aa}</p>
    ${a.global.length===0?c:r`<p class="ha-from-globals">${a.global.map(o=>r`<code>{{${o}}}</code>`)} <span>${_a}</span></p>`}
    ${a.asked.length===0&&i.length===0?r`<p class="ha-quiet">${Sa}</p>`:c}
    ${q(n,t).map(o=>Nn(e,n,o,!1))}
    ${s.map(o=>r`<div class="ha-var" data-key=${o}><div class="ha-var-head"><code>{{${o}}}</code><span class="ha-need-mark">not set up</span>
      <span class="ha-line">Sent as typed until it is set up.</span>
      <button type="button" class="pe-btn ha-sm" @click=${()=>A(e,n.id,d=>d)}>Ask for it on the watch</button></div></div>`)}
    ${i.map(o=>Nn(e,n,o,!0))}`}function ii(e,n){let t=n.id,a=n.reply,i=a?.source??"none",s=_(e,t),o=a===void 0?void 0:en[a.source],d=o==="jsonPath"?P("JSON path",a?.jsonPath??"",l=>e.edit(m=>V(m,t,"jsonPath",l),`r:${t}:path`),{mono:!0,placeholder:"result.price"}):o==="headerName"?P("Header",a?.headerName??"",l=>e.edit(m=>V(m,t,"headerName",l),`r:${t}:header`),{mono:!0,placeholder:"X-RateLimit-Remaining"}):o==="pattern"?P("Pattern",a?.pattern??"",l=>e.edit(m=>V(m,t,"pattern",l),`r:${t}:pattern`),{mono:!0,placeholder:"temperature=([0-9.]+)"}):c,p=a===void 0?"Pick what to take from the reply to show on the watch, as a tile's value or in the banner after it runs.":o==="jsonPath"?"Or type the path: keys joined by dots, a number for an item of a list (data.0.temp).":o==="pattern"?"The first group in brackets, else the whole match.":"Shown on the watch, as a tile's value or in the banner after it runs.";return r`${o==="jsonPath"?r`<p class="ha-info">Press Send, then click a value in the response below to use it as the reply value.</p>`:c}
    <p class="ha-line">${p}</p>
    <div class="ha-form">
      ${_e("Read",i,Oa,l=>e.edit(m=>tn(m,t,l==="none"?void 0:l)),{snapBack:!0})}
      ${d}
      ${a===void 0?c:P("Unit",a.unit??"",l=>e.edit(m=>V(m,t,"unit",l),`r:${t}:unit`),{placeholder:"\xB0, $, kWh"})}
    </div>
    ${a===void 0?c:r`<p class="ha-reply-now" role="status">${s.reply===void 0||s.running?r`<span class="ha-muted">Press Send to see the value the watch would show.</span>`:r`On the watch, from the last answer: ${ta(n,s)}`}</p>`}`}function oi(e,n){let t=n.id;return r`<div class="ha-form ha-settings">
      ${mn("Timeout",n.timeout,a=>e.edit(i=>qt(i,t,a),`a:${t}:timeout`),{optional:!0,min:we,max:xe,step:1,unit:"s",placeholder:String(ve),def:null})}
      <p class="ha-line ha-under">${$a}</p>
    </div>
    <div class="ha-setting">
      ${Zn("Accept a self-signed certificate",n.allowsUntrustedCertificate,a=>e.edit(i=>Vt(i,t,a)))}
      <p class="ha-line">${Ha}</p>
    </div>
    ${n.presentsClientCertificate?r`<p class="ha-cert">This action asks for a client certificate. ${se}</p>`:c}`}function si(e){return ke(e)?e.bodyContentType==="audio"||(e.body??"").trim()!=="":!1}function ri(e,n){let{headerId:t,auth:a}=Ve(e,n),i=Ia(e),s=q(n,U(e.document)).length,o=[{id:"headers",label:"Headers",extra:pe(n.headers.length)},{id:"auth",label:"Auth",extra:Ce(a.kind!=="none")},{id:"body",label:"Body",extra:Ce(si(n))},{id:"prompts",label:"Ask on watch",extra:pe(s)},{id:"reply",label:"Reply value",extra:Ce(n.reply!==void 0)},{id:"settings",label:"Settings"}],d=i==="headers"?ei(e,n,t):i==="auth"?Wa(e,n):i==="body"?ti(e,n):i==="prompts"?ai(e,n):i==="reply"?ii(e,n):oi(e,n);return r`<div class="ha-req">
    ${Gn("Request","ha-tab",o,i,p=>Fn(e,p),"ha-req-tabs")}
    <div class="ha-tabbody tab-${i}" role="tabpanel" id="ha-tab-panel" aria-labelledby=${`ha-tab-${i}`}>
      <fieldset class="ha-set" ?disabled=${e.busy}>${d}</fieldset>
    </div>
  </div>`}function di(e,n){let t=n.reply;if(t===void 0||e.reply===void 0)return{found:!1,stale:!1};if(n.sent===JSON.stringify(e.reply))return t.value===null?{found:!1,stale:!1}:{value:t.value,found:!0,stale:!1};if(e.reply.source!=="jsonField"||t.leaves===void 0)return{found:!1,stale:!0};let a=(e.reply.jsonPath??"").trim(),i=t.leaves.find(o=>o.path===a);return i!==void 0?{value:`${i.value}${e.reply.unit??""}`,found:!0,stale:!1}:{found:!1,stale:a!==""&&t.leaves.some(o=>o.path.startsWith(`${a}.`))||t.leaves_cut===!0||a===""}}function _(e,n){return e.uiState.get(Bn+n)??{values:{},running:!1,run:0}}function Ue(e,n,t){e.uiState.set(Bn+n,t),e.requestUpdate()}function li(e,n,t){let a={};for(let i of q(e,n)){let s=t[i.key];a[i.key]=s!==void 0?s:i.presetValues[0]??""}return a}async function Mn(e,n){let t=Q(e.document,n);if(t===void 0)return;let a=ee(t);if(z(a))return;let i=_(e,n);if(i.running)return;let s=i.run+1,o=li(a,U(e.document),i.values);Ue(e,n,{values:i.values,running:!0,run:s});let d=Z(e.document),p;try{let l=await e.test(t,d,o);p={values:_(e,n).values,running:!1,reply:l,sent:JSON.stringify(a.reply),run:s}}catch(l){p={values:_(e,n).values,running:!1,error:pi(l),run:s}}_(e,n).run===s&&Ue(e,n,p)}function pi(e){let n=e,t=typeof n?.code=="string"?n.code:typeof n?.error?.code=="string"?n.error.code:void 0,a=typeof n?.message=="string"?n.message:typeof n?.error?.message=="string"?n.error.message:"";return t==="unknown_command"?"This version of the integration cannot test an action. Update it to test here.":t==="invalid"?`Home Assistant could not build the request${a===""?".":`: ${a}`}`:a===""?"No answer from Home Assistant.":a}function ci(e,n,t,a){let i=He(t),s=a.values[t.key]??i[0]??"",o=l=>Ue(e,n.id,{..._(e,n.id),values:{..._(e,n.id).values,[t.key]:l}}),d=t.prompt.trim()===""?t.key:t.prompt.trim();if(t.presetsOnly&&i.length>0)return r`<label class="ha-tv"><span>${d}</span>
      <select .value=${s} @change=${l=>o(l.target.value)}>
        ${i.map(l=>r`<option value=${l} ?selected=${l===s}>${l}</option>`)}
      </select></label>`;let p=`ha-q-${t.id}`;return r`<label class="ha-tv"><span>${d}</span>
    <input type="text" inputmode=${t.kind==="number"?"decimal":c} .value=${s} list=${i.length===0?c:p}
      placeholder=${t.key} @input=${l=>o(l.target.value)} />
    ${i.length===0?c:r`<datalist id=${p}>${i.map(l=>r`<option value=${l}></option>`)}</datalist>`}</label>`}function ui(e){return e.status===null?"err":e.status>=200&&e.status<300?"ok":"warn"}function ta(e,n){let t=di(e,n);return r`<span class="ha-val"><b>Value</b>${t.found?r`<code>${t.value}</code>`:r`<span class="ha-muted">${t.stale?"Send to see it":"Not found"}</span>`}</span>`}function hi(e,n,t){if(t.body_binary===!0)return r`<p class="ha-quiet">The body is not text (${le(t.body_size??0)}).</p>`;let a=Va(e,t);if(a.raw==="")return r`<p class="ha-quiet">No body.</p>`;let i=a.isJson?Yn(e):"raw",s=qa(e),o=new Set((t.leaves??[]).map(f=>f.path)),d=n.reply?.source==="jsonField"?(n.reply.jsonPath??"").trim():void 0,p=e.uiState.get(Le)===!0,l=(f,b)=>{e.uiState.set(f,b),e.requestUpdate()},m=async()=>{try{await navigator.clipboard.writeText(a.text),l(Le,!0),setTimeout(()=>l(Le,!1),1500)}catch{}},u=(f,b)=>r`<button type="button" class="ha-bopt ${i===f?"on":""}" aria-pressed=${i===f?"true":"false"}
    ?disabled=${!a.isJson} title=${a.isJson?f==="pretty"?"Indented and colored":"As the server sent it":"The body is not JSON"}
    @click=${()=>l(Un,f)}>${b}</button>`;return r`<div class="ha-bbar" role="toolbar" aria-label="Body options">
      <span class="ha-bseg">${u("pretty","Pretty")}${u("raw","Raw")}</span>
      <button type="button" class="ha-bopt ${s?"on":""}" aria-pressed=${s?"true":"false"} title="Wrap long lines" @click=${()=>l(qn,!s)}>Wrap</button>
      <button type="button" class="ha-bopt" title="Copy the body as shown" @click=${()=>{m()}}>${p?"Copied":"Copy"}</button>
      <span class="ha-bmeta">${a.isJson?"JSON":"Text"}${t.body_size===void 0?c:r` · ${le(t.body_size)}`}${t.body===void 0?r` · <span title="Update the integration to see the whole body.">first line only</span>`:c}${t.body_cut===!0?" \xB7 cut at the size limit":c}</span>
    </div>
    ${o.size===0||a.pieces===void 0?c:r`<p class="ha-info ha-pickline">Click a value to use it as the reply value.</p>`}
    <pre class="ha-snippet mono ${s?"":"nowrap"}">${a.pieces===void 0?a.text:a.pieces.map(f=>{if(f.kind==="ws"||f.kind==="punct")return f.text;if(f.path===void 0||!o.has(f.path))return r`<span class=${`j-${f.kind}`}>${f.text}</span>`;let b=f.path,$=d===b;return r`<span class=${`j-${f.kind} j-pick ${$?"on":""}`} role="button" tabindex="0" aria-pressed=${$?"true":"false"}
          title=${$?`The reply value: ${b}`:`Use ${b} as the reply value`}
          @click=${()=>{e.busy||e.edit(H=>ne(H,n.id,b))}}
          @keydown=${H=>{H.key!=="Enter"&&H.key!==" "||(H.preventDefault(),e.busy||e.edit(k=>ne(k,n.id,b)))}}>${f.text}</span>`})}</pre>`}function fi(e,n,t){let a=za(e),i=Object.entries(t.headers??{}),s=[{id:"body",label:"Body"},{id:"headers",label:"Headers",extra:pe(i.length)},{id:"paths",label:"Paths",extra:pe(t.paths.length)}],o;return a==="body"?o=hi(e,n,t):a==="headers"?o=i.length===0?r`<p class="ha-quiet">No headers.</p>`:r`<div class="ha-rlist" role="list" aria-label="Reply headers">
      ${i.map(([d,p])=>{let l=n.reply?.source==="header"&&n.reply.headerName===d;return r`<div class="ha-rrow ${l?"on":""}" role="listitem"><code>${d}</code><span class="mono ha-rval">${p}</span>
          <button type="button" class="ha-use" title=${`Read the ${d} header`} ?disabled=${e.busy}
            @click=${()=>e.edit(m=>nn(m,n.id,d))}>${l?"Reply value":"Use"}</button></div>`})}</div>`:o=t.paths.length===0?r`<p class="ha-quiet">No JSON fields found.</p>`:r`<div class="ha-rlist" role="list" aria-label="JSON fields found">
      ${t.paths.map(d=>{let p=n.reply?.source==="jsonField"&&n.reply.jsonPath===d.path;return r`<button type="button" role="listitem" class="ha-rrow ha-path ${p?"on":""}" title=${`${d.path} is ${d.value}. Read this field.`} ?disabled=${e.busy}
          @click=${()=>e.edit(l=>ne(l,n.id,d.path))}><code>${d.path}</code><span class="mono ha-rval">${d.value}</span><span class="ha-use-word">${p?"Reply value":"Use"}</span></button>`})}</div>`,r`${Gn("Response","ha-rtab",s,a,d=>Ua(e,d),"ha-resp-tabs")}
    <div class="ha-resp-body" role="tabpanel" id="ha-rtab-panel" aria-labelledby=${`ha-rtab-${a}`}>${o}</div>`}function mi(e,n){let t=_(e,n.id),a=q(n,U(e.document)),i=t.running?void 0:t.reply,s=i===void 0?void 0:ui(i);return r`<section class="ha-resp" aria-label="Response">
    <div class="ha-resp-head" role="status">
      <span class="ha-cap">Response</span>
      ${i===void 0?c:r`
        <span class="ha-status ${s}">${i.status===null?"No answer":`HTTP ${i.status}`}</span>
        <span class="ha-ms">${i.elapsed_ms} ms</span>
        ${n.reply===void 0?c:ta(n,t)}`}
    </div>
    ${a.length===0?c:r`<div class="ha-testvals" role="group" aria-label="Test values"><span class="ha-cap2">Test values</span>
      ${a.map(o=>ci(e,n,o,t))}</div>`}
    ${t.running?r`<p class="ha-quiet ha-pad">Sending…</p>`:t.error!==void 0?r`<p class="ha-test-err ha-pad" role="status">${t.error}</p>`:i===void 0?r`<p class="ha-quiet ha-pad">${Ta}${$e(n)?" A test sends no voice clip.":""}</p>`:r`${i.error?r`<p class="ha-test-err ha-pad">${i.error}</p>`:c}${fi(e,n,i)}`}
  </section>`}function bi(e,n){return r`<div class="ha-main-in" data-action=${n.id}>
    ${Za(e,n)}
    ${Qa(e,n)}
    ${ri(e,n)}
    ${mi(e,n)}
  </div>`}function gi(e){let n=Z(e.document).map(At),t=new Map;for(let a of n)t.set(a.key.trim(),(t.get(a.key.trim())??0)+1);return r`<div class="ha-main-in ha-globals">
    <div class="ha-titlerow">
      <span class="ha-mtag ha-gtag big" aria-hidden="true">{ }</span>
      <h3 class="ha-h">Globals</h3><span class="ha-count">${n.length}</span>
      <span class="ha-title-acts"></span>
    </div>
    <div class="ha-scroll">
      <p class="ha-line ha-glead">${Kn}</p>
      <fieldset class="ha-set" ?disabled=${e.busy}>
      <div class="ha-table ha-gtable" role="table" aria-label="Globals">
        <div class="ha-tr ha-th" role="row"><span role="columnheader">Key</span><span role="columnheader">Value</span><span role="columnheader">Used by</span><span></span></div>
        ${n.map(a=>{let i=a.key.trim(),s=ln(e.document,i);return r`<div class="ha-tr" role="row" data-global=${a.id}>
            <span class="ha-td" role="cell"><input type="text" class="mono" .value=${a.key} placeholder="haurl"
              aria-label="Key" spellcheck="false" @input=${o=>e.edit(d=>sn(d,a.id,o.target.value),`g:${a.id}:key`)} /></span>
            <span class="ha-td" role="cell">${qe(e,`${i===""?"Global":i} value`,a.value,o=>e.edit(d=>rn(d,a.id,o),`g:${a.id}:value`),`global:${a.id}`,"https://ha.local:8123")}</span>
            <span class="ha-td ha-users" role="cell" title=${s.length===0?"No action uses it yet.":`Used by ${s.join(", ")}.`}>${s.length===0?r`<span class="ha-muted">Not used yet</span>`:La(s.length,"action","actions")}</span>
            <span class="ha-td ha-end" role="cell"><button type="button" class="icon ha-remove" aria-label=${`Remove ${i===""?"this global":`{{${i}}}`}`}
              title=${s.length===0?"Remove this global":"Remove this global. The actions that use it send the {{key}} as typed."}
              @click=${()=>e.edit(o=>dn(o,a.id))}>${w("delete")}</button></span>
            ${i===""?r`<p class="ha-warn ha-rowwarn">A global needs a key before it can be saved.</p>`:(t.get(i)??0)>1?r`<p class="ha-warn ha-rowwarn">Another global has this key. Each key must be its own.</p>`:c}
          </div>`})}
        <div class="ha-tr ha-addrow" role="row"><button type="button" class="ha-add-row ha-add-global" @click=${()=>Ba(e)}>${w("plus")}<span>Add global</span></button></div>
      </div>
      </fieldset>
      <p class="ha-line">Type {{key}} in a URL, header or body. It is filled in as typed, before the values asked for on the watch. Values stay hidden until shown.</p>
    </div>
  </div>`}function na(e){let n=Wn(e);return n?.kind==="globals"?gi(e):n?.kind==="action"?bi(e,ee(Q(e.document,n.id))):r`<div class="ha-empty-main">
    <b>${ie}</b>
    <span>An HTTP action is a web request a watch asks Home Assistant to send. Add one to start, or a global for a value several actions share.</span>
    <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy} @click=${()=>ce(e)}>${w("plus")}<span>${oe}</span></button>
  </div>`}var aa=Y`
  .mono, input[type].mono, textarea.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .ha-glyph-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
  .ha-muted { color: var(--wa-muted); }
  .ha-line { margin: 0; font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
  .ha-quiet { margin: 0; font-size: 12.5px; color: var(--wa-muted); }
  .ha-warn { margin: 0; font-size: 12px; line-height: 1.45; color: var(--wa-amber); }
  .ha-test-err { margin: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-need); }
  fieldset.ha-set { margin: 0; padding: 0; border: 0; min-width: 0; display: contents; }

  /* ── the collection ── */
  .ha-list-card { display: flex; flex-direction: column; min-height: 0; max-height: 100%; }
  .ha-list-card > .lc-head { flex: none; }
  .ha-list-note { flex: none; margin: 4px 10px 8px; color: var(--wa-muted); }
  .ha-items { display: flex; flex-direction: column; gap: 1px; padding: 0 6px 6px; overflow-y: auto; min-height: 0; flex: 0 1 auto; scrollbar-width: thin; }
  .ha-item {
    position: relative; display: flex; align-items: center; gap: 8px; min-height: 32px; padding: 0 8px; border-radius: 6px;
    cursor: pointer; user-select: none; font-size: 13px; color: var(--wa-ink); flex: none; background: var(--wa-card);
  }
  .ha-item:hover { background: var(--wa-hover); }
  .ha-item.on { background: var(--wa-pick-bg); box-shadow: inset 0 0 0 1px var(--wa-pick-line); }
  .ha-item:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .ha-item-name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ha-item.on .ha-item-name { font-weight: 600; }
  .ha-mtag {
    flex: none; width: 40px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 10.5px; font-weight: 700; letter-spacing: .02em; color: var(--wa-muted);
  }
  .m-get { color: var(--wa-hue-green); }
  .m-post { color: var(--wa-hue-orange); }
  .m-put { color: var(--wa-hue-blue); }
  .m-patch { color: var(--wa-hue-yellow); }
  .m-del { color: var(--wa-hue-red); }
  .m-other { color: var(--wa-muted); }
  .ha-gtag { color: var(--wa-hue-green); }
  .ha-need-mark { flex: none; font-size: 10.5px; font-weight: 600; color: var(--wa-amber); white-space: nowrap; }
  .ha-mark { flex: none; font-size: 10.5px; font-weight: 500; color: var(--wa-muted); white-space: nowrap; }
  /* The move buttons sit over the row's right end, on its own ground, only
     while the row is under the pointer or holds the focus, so at rest the
     name has the whole width. */
  .ha-item-acts {
    position: absolute; right: 2px; top: 50%; transform: translateY(-50%); display: inline-flex; gap: 0;
    padding-left: 6px; border-radius: 6px; background: inherit; opacity: 0; pointer-events: none;
  }
  .ha-item:is(:hover, :focus-within) .ha-item-acts { opacity: 1; pointer-events: auto; }
  .ha-item-acts button.icon { width: 22px; height: 22px; }
  .ha-item-acts button.icon svg.ui-icon { width: 12px; height: 12px; }
  .ha-item-acts button.icon:disabled { opacity: .3; }
  @media (hover: none) { .ha-item-acts { position: static; transform: none; opacity: 1; pointer-events: auto; } }
  .ha-list-foot { flex: none; padding: 6px; border-top: 1px solid var(--wa-line); }
  .ha-count {
    flex: none; min-width: 20px; height: 18px; padding: 0 6px; border-radius: 9px; display: inline-grid; place-items: center;
    font-size: 11px; font-weight: 600; color: var(--wa-muted); background: var(--wa-field); font-variant-numeric: tabular-nums;
  }

  /* ── the main pane ── */
  .ha-main-in { display: flex; flex-direction: column; min-height: 0; min-width: 0; flex: 1 1 auto; container: hamain / inline-size; }
  .ha-req, .ha-resp, .ha-tabbody, .ha-tabs, .ha-scroll { min-width: 0; }
  .ha-titlerow { flex: none; display: flex; align-items: center; gap: 10px; min-height: 50px; padding: 8px 12px 4px 12px; }
  .ha-title-acts { margin-left: auto; display: inline-flex; gap: 6px; flex: none; }
  .ha-h { margin: 0; font-size: 15px; font-weight: 600; }
  .ha-gtag.big { width: auto; font-size: 13px; }
  .pe-btn.ha-sm { min-height: 28px; padding: 0 10px; font-size: 12.5px; }
  .pe-btn.ha-sm svg.ui-icon { width: 13px; height: 13px; }
  .ha-look { position: relative; flex: none; }
  button.ha-look-btn {
    display: grid; place-items: center; width: 32px; height: 32px; padding: 0; border-radius: 8px; cursor: pointer;
    border: 1px solid var(--wa-line-strong); background: color-mix(in srgb, var(--c, #888) 22%, #000);
  }
  button.ha-look-btn:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
  button.ha-look-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.ha-look-btn[aria-expanded="true"] { border-color: var(--wa-accent); }
  .ha-look-glyph { display: grid; place-items: center; width: 18px; height: 18px; }
  .ha-look-glyph svg { width: 16px; height: 16px; display: block; }
  .ha-look-pop {
    position: absolute; top: calc(100% + 6px); left: 0; z-index: 40; width: 360px; max-width: calc(100cqw - 24px);
    max-height: 420px; overflow: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
    background: var(--wa-card); border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop);
    --wa-lab: 52px;
  }
  .ha-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .ha-pop-foot { display: flex; align-items: center; gap: 8px; padding-top: 6px; }
  .ha-pop-foot .ha-line { flex: 1; }
  input.ha-name {
    flex: 1 1 auto; min-width: 0; max-width: 520px; height: 32px; padding: 0 8px; margin-left: -4px;
    font-size: 15px; font-weight: 600; border-color: transparent; background: transparent;
  }
  input.ha-name:hover:not(:disabled) { border-color: var(--wa-line-strong); }

  .ha-reqbar { flex: none; display: flex; align-items: stretch; gap: 8px; padding: 4px 12px 8px; }
  .ha-reqbox {
    flex: 1 1 auto; min-width: 0; display: flex; align-items: stretch; height: 36px;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-input); overflow: hidden;
  }
  .ha-reqbox:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .ha-reqbox select.ha-method {
    flex: none; width: 104px; height: 100%; border: 0; border-right: 1px solid var(--wa-line-strong); border-radius: 0;
    background-color: transparent; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; font-weight: 700;
    padding-left: 12px;
  }
  .ha-reqbox select.ha-method option { color: var(--wa-ink); }
  .ha-reqbox select.ha-method:focus-visible { box-shadow: none; }
  .ha-reqbox input.ha-url {
    flex: 1 1 auto; min-width: 0; height: 100%; border: 0; border-radius: 0; background: transparent; font-size: 13px; padding: 0 12px;
  }
  .ha-reqbox input.ha-url:focus-visible { box-shadow: none; }
  .pe-btn.ha-send { flex: none; min-width: 92px; min-height: 36px; font-weight: 600; }
  .pe-btn.ha-send.busy { opacity: .75; cursor: progress; }
  .ha-barnote { flex: none; padding: 0 12px 8px; display: flex; flex-direction: column; gap: 2px; }
  @container hamain (max-width: 520px) {
    .ha-reqbar { flex-wrap: wrap; }
    .ha-reqbox { flex-basis: 100%; }
    .pe-btn.ha-send { flex: 1 1 auto; }
    .ha-titlerow { flex-wrap: wrap; }
    .ha-tabs { flex-wrap: wrap; }
    button.ha-tab { padding: 0 8px; }
  }

  .ha-tabs { flex: none; display: flex; align-items: stretch; gap: 2px; padding: 0 8px; border-bottom: 1px solid var(--wa-line); overflow-x: auto; scrollbar-width: none; }
  button.ha-tab {
    flex: none; display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 10px; margin-bottom: -1px;
    border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--wa-muted);
    font: inherit; font-size: 12.5px; font-weight: 500; cursor: pointer; white-space: nowrap;
  }
  button.ha-tab:hover { color: var(--wa-ink); }
  button.ha-tab.on { color: var(--wa-ink); border-bottom-color: var(--wa-ink); font-weight: 600; }
  button.ha-tab:focus-visible { outline: none; box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--wa-accent) 60%, transparent); border-radius: 6px 6px 0 0; }
  .ha-tab-n { font-size: 11px; font-weight: 600; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
  .ha-tab-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--wa-hue-green); }

  .ha-req { display: flex; flex-direction: column; min-height: 0; flex: 1 1 0; }
  .ha-tabbody { flex: 1 1 auto; min-height: 0; overflow: auto; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; scrollbar-width: thin; }
  .ha-tabbody > .ha-line:first-child { margin-top: -2px; }

  /* A form in a tab: titles in a short column, controls at their own width. */
  .ha-form { --wa-lab: 92px; display: flex; flex-direction: column; gap: 4px; max-width: 520px; }
  .ha-form .field select { width: auto; min-width: 200px; max-width: 100%; justify-self: start; }
  .ha-form .field.num > :last-child { width: 110px; justify-self: start; }
  .ha-form .ha-under { margin-left: calc(var(--wa-lab) + 8px); }
  .ha-setting { display: flex; flex-direction: column; gap: 4px; }
  .ha-setting > .ha-line { margin-left: 40px; }
  .ha-cert { padding: 8px 10px; border: 1px solid var(--wa-amber-line); border-radius: 8px; max-width: 620px; }
  label.ha-switch { display: inline-flex; align-items: center; gap: 8px; min-height: 28px; font-size: 13px; cursor: pointer; }
  label.ha-switch:has(input:disabled) { cursor: default; color: var(--wa-muted); }

  /* A secret: a password box with its own Show. */
  .ha-secret { display: flex; align-items: center; gap: 6px; min-width: 0; }
  .ha-secret > input { flex: 1; min-width: 0; }
  input[type=password] {
    font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); min-height: 28px; height: 28px;
    padding: 0 9px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-input);
  }
  input[type=password]:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .ha-secret > input[type=text] { height: 28px; min-height: 28px; padding: 0 9px; font-size: 12px; }
  .ha-secret > input[type=password] { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
  button.ha-show {
    flex: none; height: 24px; padding: 0 8px; border-radius: 6px; border: 1px solid var(--wa-line);
    background: transparent; color: var(--wa-muted); font: inherit; font-size: 11.5px; cursor: pointer;
  }
  button.ha-show:hover { color: var(--wa-ink); background: var(--wa-hover); }
  button.ha-show:focus-visible { outline: none; box-shadow: var(--wa-ring); }

  /* A key and value table: hairlines between rows and cells, the boxes flat
     in their cells, as an HTTP client draws one. */
  .ha-table { --cols: minmax(0, 2fr) minmax(0, 3fr) 48px; max-width: 1100px; border: 1px solid var(--wa-line); border-radius: 8px; overflow: hidden; }
  .ha-gtable { --cols: minmax(0, 2fr) minmax(0, 3fr) 110px 48px; }
  .ha-tr { display: grid; grid-template-columns: var(--cols); align-items: stretch; border-top: 1px solid var(--wa-line); }
  .ha-tr:first-child { border-top: 0; }
  .ha-th { background: var(--wa-field); }
  .ha-th > span { padding: 6px 10px; font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--wa-muted); }
  .ha-td { display: flex; align-items: center; min-width: 0; min-height: 34px; border-left: 1px solid var(--wa-line); }
  .ha-td:first-child { border-left: 0; }
  .ha-td > input[type=text], .ha-td .ha-secret > input {
    width: 100%; height: 34px; min-height: 34px; border: 0; border-radius: 0; background: transparent; font-size: 12.5px; padding: 0 10px;
  }
  .ha-td > input[type=text]:focus-visible, .ha-td .ha-secret > input:focus-visible { box-shadow: inset 0 0 0 1px var(--wa-accent); }
  .ha-td .ha-secret { flex: 1; gap: 4px; padding-right: 6px; }
  .ha-td.ha-end { justify-content: center; }
  .ha-td.ha-ro { padding: 0 10px; font-size: 12.5px; color: var(--wa-muted); }
  .ha-dots { letter-spacing: .1em; }
  .ha-td.ha-users { padding: 0 10px; font-size: 12px; white-space: nowrap; }
  .ha-rowwarn { grid-column: 1 / -1; padding: 0 10px 6px; }
  button.ha-from-auth {
    height: 20px; padding: 0 7px; border-radius: 5px; border: 1px solid var(--wa-line-strong); background: transparent;
    font: inherit; font-size: 10.5px; font-weight: 600; color: var(--wa-muted); cursor: pointer;
  }
  button.ha-from-auth:hover { color: var(--wa-ink); }
  button.icon.ha-remove { width: 26px; height: 26px; }
  button.icon.ha-remove:hover:not(:disabled) { color: var(--wa-need); }
  .ha-addrow { display: block; }
  button.ha-add-row {
    display: flex; align-items: center; gap: 6px; width: 100%; height: 34px; padding: 0 10px; border: 0; background: transparent;
    font: inherit; font-size: 12.5px; color: var(--wa-muted); cursor: pointer; text-align: left;
  }
  button.ha-add-row svg.ui-icon { width: 13px; height: 13px; }
  button.ha-add-row:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
  button.ha-add-row:focus-visible { outline: none; box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--wa-accent) 60%, transparent); }
  @container hamain (max-width: 560px) {
    .ha-gtable { --cols: minmax(0, 1fr) minmax(0, 1.4fr) 40px; }
    .ha-gtable .ha-users, .ha-gtable .ha-th > span:nth-child(3) { display: none; }
  }

  .ha-body-head { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; }
  label.ha-inline { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; color: var(--wa-label, var(--wa-muted)); }
  label.ha-inline select { min-width: 130px; }
  .ha-qbar { position: static; margin: 0; padding: 0; background: none; }
  .ha-bad { color: var(--wa-amber); font-weight: 600; }
  .ha-code { position: relative; flex: 1 1 auto; min-height: 140px; border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-input); overflow: hidden; }
  .ha-code:focus-within { border-color: color-mix(in srgb, var(--wa-accent) 60%, var(--wa-line-strong)); }
  .ha-code pre, .ha-code textarea.ha-body-text {
    position: absolute; inset: 0; width: 100%; height: 100%; min-height: 0; margin: 0; box-sizing: border-box; border: 0; border-radius: 0; outline: none; box-shadow: none;
    padding: 8px 10px; font-size: 12.5px; line-height: 1.5; letter-spacing: 0; tab-size: 2;
    white-space: pre-wrap; overflow-wrap: anywhere; word-break: normal; scrollbar-width: thin; scrollbar-gutter: stable;
  }
  .ha-code.nowrap pre, .ha-code.nowrap textarea.ha-body-text { white-space: pre; overflow-wrap: normal; }
  .ha-code pre { overflow: hidden; color: var(--wa-ink); pointer-events: none; }
  .ha-code textarea.ha-body-text { overflow: auto; resize: none; background: transparent; color: transparent; caret-color: var(--wa-ink); }
  .ha-code textarea.ha-body-text::placeholder { color: var(--wa-muted); }
  .ha-code .j-key { color: var(--wa-hue-blue); }
  .ha-code .j-str { color: var(--wa-hue-green); }
  .ha-code .j-num { color: var(--wa-hue-orange); }
  .ha-code .j-lit { color: var(--wa-hue-pink); }
  .ha-code .j-var, pre.ha-snippet .j-var { color: var(--wa-val); }

  .ha-from-globals { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 0; font-size: 12px; color: var(--wa-muted); }
  .ha-var { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; max-width: 760px; border: 1px solid var(--wa-line); border-radius: 8px; }
  .ha-var.unused { opacity: .75; }
  .ha-var-head { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-height: 24px; }
  .ha-var-head code { font-size: 12.5px; font-weight: 600; }
  .ha-var-head .ha-remove, .ha-var-head .pe-btn { margin-left: auto; }
  .ha-var-grid { --wa-lab: 88px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 4px 20px; align-items: start; }
  .ha-var-grid .seg.wide { max-width: 200px; }
  .ha-var-grid .field.ha-quick textarea { min-height: 50px; resize: vertical; }
  .ha-only { display: flex; flex-direction: column; gap: 2px; padding-top: 1px; }

  /* ── the response ── */
  .ha-resp { flex: 1.15 1 0; min-height: 0; display: flex; flex-direction: column; border-top: 1px solid var(--wa-line-strong); background: var(--wa-raised, var(--wa-card)); }
  .ha-resp-head { flex: none; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; min-height: 38px; padding: 6px 14px; }
  .ha-cap { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); }
  .ha-cap2 { font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .ha-status {
    display: inline-flex; align-items: center; height: 22px; padding: 0 8px; border-radius: 6px; font-size: 12px; font-weight: 700;
    font-variant-numeric: tabular-nums; border: 1px solid var(--wa-line-strong); color: var(--wa-ink);
  }
  .ha-status.ok { color: var(--wa-green); border-color: color-mix(in srgb, var(--wa-green) 55%, transparent); }
  .ha-status.warn { color: var(--wa-amber); border-color: color-mix(in srgb, var(--wa-amber) 55%, transparent); }
  .ha-status.err { color: var(--wa-need); border-color: color-mix(in srgb, var(--wa-need) 55%, transparent); }
  .ha-ms { font-size: 12px; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
  .ha-val { display: inline-flex; align-items: baseline; gap: 6px; font-size: 12.5px; min-width: 0; }
  .ha-val b { font-weight: 500; color: var(--wa-muted); font-size: 12px; }
  .ha-val code { color: var(--wa-val); overflow-wrap: anywhere; }
  .ha-testvals { flex: none; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 0 14px 8px; }
  label.ha-tv { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--wa-label, var(--wa-muted)); }
  label.ha-tv input, label.ha-tv select { width: 150px; height: 28px; min-height: 28px; font-size: 12.5px; padding-top: 0; padding-bottom: 0; }
  .ha-pad { padding: 4px 14px 12px; }
  .ha-resp-tabs { padding: 0 8px; }
  .ha-resp-body { flex: 1 1 auto; min-height: 0; overflow: auto; padding: 10px 14px 12px; scrollbar-width: thin; }
  pre.ha-snippet { margin: 0; font-size: 12px; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere; color: var(--wa-ink); }
  pre.ha-snippet.nowrap { white-space: pre; overflow-wrap: normal; }
  pre.ha-snippet .j-pick { cursor: pointer; border-radius: 3px; }
  pre.ha-snippet .j-pick:hover { background: var(--wa-hover); box-shadow: 0 0 0 1px var(--wa-line-strong); }
  pre.ha-snippet .j-pick:focus-visible { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--wa-accent) 60%, transparent); }
  pre.ha-snippet .j-pick.on { box-shadow: 0 0 0 1px var(--wa-green); background: color-mix(in srgb, var(--wa-green) 14%, transparent); }
  .ha-pickline { margin: 0 0 6px; }
  .ha-info { margin: 0; font-size: 12.5px; color: var(--wa-amber); }
  .ha-reply-now { margin: 4px 0 0; font-size: 12.5px; color: var(--wa-muted); display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px; }
  pre.ha-snippet .j-key { color: var(--wa-hue-blue); }
  pre.ha-snippet .j-str { color: var(--wa-hue-green); }
  pre.ha-snippet .j-num { color: var(--wa-hue-orange); }
  pre.ha-snippet .j-lit { color: var(--wa-hue-pink); }
  .ha-bbar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 0 0 8px; position: sticky; top: -10px; padding: 4px 0; background: var(--wa-raised, var(--wa-card)); z-index: 1; }
  .ha-bseg { display: inline-flex; }
  .ha-bseg button.ha-bopt { border-radius: 0; margin-left: -1px; }
  .ha-bseg button.ha-bopt:first-child { border-radius: 5px 0 0 5px; margin-left: 0; }
  .ha-bseg button.ha-bopt:last-child { border-radius: 0 5px 5px 0; }
  button.ha-bopt { font: inherit; font-size: 11.5px; height: 24px; padding: 0 9px; border-radius: 5px; border: 1px solid var(--wa-line); background: transparent; color: var(--wa-muted); cursor: pointer; }
  button.ha-bopt:hover:not(:disabled) { color: var(--wa-ink); border-color: var(--wa-line-strong); }
  button.ha-bopt.on { color: var(--wa-ink); border-color: var(--wa-line-strong); background: var(--wa-hover); font-weight: 600; position: relative; }
  button.ha-bopt:disabled { opacity: 0.45; cursor: default; }
  button.ha-bopt:focus-visible { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--wa-accent) 60%, transparent); }
  .ha-bmeta { margin-left: auto; font-size: 11.5px; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
  .ha-rlist { display: flex; flex-direction: column; max-width: 1100px; }
  .ha-rrow {
    display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) 84px; align-items: center; gap: 12px;
    min-height: 30px; padding: 0 8px; border-radius: 6px; border: 0; background: transparent; color: var(--wa-ink);
    font: inherit; font-size: 12.5px; text-align: left;
  }
  .ha-rrow + .ha-rrow { border-top: 1px solid var(--wa-line); border-radius: 0; }
  button.ha-rrow { cursor: pointer; }
  button.ha-rrow:hover:not(:disabled), div.ha-rrow:hover { background: var(--wa-hover); }
  button.ha-rrow:focus-visible { outline: none; box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--wa-accent) 60%, transparent); }
  .ha-rrow code { font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ha-rval { font-size: 12px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ha-use-word, button.ha-use { font-size: 11.5px; color: var(--wa-muted); justify-self: end; white-space: nowrap; }
  button.ha-use { font: inherit; font-size: 11.5px; height: 22px; padding: 0 8px; border-radius: 5px; border: 1px solid var(--wa-line); background: transparent; cursor: pointer; }
  button.ha-use:hover:not(:disabled) { color: var(--wa-ink); border-color: var(--wa-line-strong); }
  .ha-rrow.on .ha-use-word, .ha-rrow.on button.ha-use { color: var(--wa-green); font-weight: 600; }

  /* ── the globals ── */
  .ha-scroll { flex: 1 1 auto; min-height: 0; overflow: auto; padding: 4px 12px 14px; display: flex; flex-direction: column; gap: 10px; }
  .ha-glead { max-width: 760px; }

  /* ── nothing picked ── */
  .ha-empty-main {
    margin: auto; display: flex; flex-direction: column; align-items: center; gap: 10px; max-width: 420px; padding: 32px 20px; text-align: center;
    font-size: 13px; color: var(--wa-muted);
  }
  .ha-empty-main b { font-size: 15px; color: var(--wa-ink); }
  .ha-empty-main .pe-btn { margin-top: 4px; }
`;wn({dirty:Re,drop:_n});typeof window<"u"&&window.addEventListener("beforeunload",e=>{Re()&&(e.preventDefault(),e.returnValue="")});var vi=15e3,da=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Be=da?"\u2318":"Ctrl+",J={min:200,max:520,middleMin:520},Ke={left:280,right:0},je="wrist-assistant-panel.http-actions.columns.v1",wi=8,ia=760;function xi(e,n){let t=bt(n,J);return e<=0?t:Math.max(J.min,Math.min(t,e-J.middleMin))}function oa(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function yi(e){let n=e?Date.parse(e):NaN;return Number.isNaN(n)?"":Ze(Math.max(0,(Date.now()-n)/1e3))}function ki(e){return e instanceof HTMLElement?yt(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function $i(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}function sa(e,n){let t=[],a=[];if(e===void 0||e.revision<=0)return{collected:t,waiting:a};for(let i of n)((e.delivered?.[i.owner_watch_id]??0)>=e.revision?t:a).push(lt(i,n));return{collected:t,waiting:a}}function Hi(e,n){if(e.updated_by==="panel")return"saved here";let t=n.find(a=>a.owner_watch_id===e.updated_by);return t===void 0?"handed over by a phone":`handed over by ${t.paired_iphone_name??t.device_name??"a phone"}`}function Ti(e){return e.some(n=>!n.is_orphan&&(G(n)==="iphone"&&me(fe(n))||G(n)==="watch"&&n.has_iphone===!0&&n.holds_old_setup!==!1&&n.owner_iphone_moves!==!0&&n.another_iphone_moves!==!0))}function Ai(e){return e.some(n=>!n.is_orphan&&G(n)!=="library"&&me(fe(n)))}var v=class extends Fe{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.barHost=void 0;this.headBar=new ht(this);this.unsupported=!1;this.loading=!1;this.topMenuOpen=!1;this.columns={...Ke};this.hostWidth=0;this.ownListAsked=!1;this.topHeight=0;this.symbols=new wt(()=>this.requestUpdate());this.uiState=new Map;this.reloadPending=!1;this.loadSeq=0;this.askedOnce=!1;this.onReconnect=()=>{this.isConnected&&this.load(!0)};this.onKeyDown=t=>{if(t.defaultPrevented)return;let a=t.composedPath();if(!a.includes(this)&&!this.headBar.holds(a)&&!$i()||this.renderRoot.querySelector("dialog[open]"))return;let i=t.metaKey||t.ctrlKey,s=t.key.toLowerCase();if(i&&!t.altKey&&s==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1;return}if(t.key==="Escape"&&ue(this.lookHost())){t.preventDefault();return}if(!ki(a[0])){if(i&&!t.altKey&&s==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}t.ctrlKey&&!t.metaKey&&!t.altKey&&s==="y"&&(t.preventDefault(),this.redo())}};this.onWindowPointerDown=t=>{let a=t.composedPath(),i=s=>a.some(o=>o instanceof HTMLElement&&o.classList.contains(s));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),i("ha-look")||ue(this.lookHost())};this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get allOwners(){return this.owners.length>0?this.owners:this.ownList??[]}get watches(){return dt(this.allOwners)}get draft(){if(!(this.record===void 0||this.unsupported))return Ee()}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=gt(je,Ke,J),this.watchSize(),this.listenForReconnect(),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.stopPolling(),this.loadSeq++}willUpdate(t){this.hass&&(t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,Ye(this.hass).then(a=>{this.ownList=a.owners},()=>{this.ownList=[]})),this.askedOnce||(this.askedOnce=!0,this.load())),this.followSave()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft)),this.observeTop()}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let a of t){if(a.target!==this){this.measureTop(a.target);continue}let i=a.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let a=this.renderRoot?.querySelector(".pe-top")??void 0;a!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=a,a!==void 0&&t.observe(a))}measureTop(t){let a=t.offsetHeight;a!==this.topHeight&&(this.topHeight=a,this.style.setProperty("--pe-top-h",`${a}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=Ee()?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let a=()=>this.saveEnded();t.then(a,a)}saveEnded(){this.requestUpdate(),this.isConnected&&(this.reloadPending=!1,this.load(!0))}async load(t=!1){let a=this.hass;if(!a)return;if(t&&this.saving){this.reloadPending=!0;return}let i=++this.loadSeq;this.stopPolling(),t||(this.loading=this.record===void 0,this.loadError=void 0);try{let s=await he(a);if(i!==this.loadSeq)return;if(this.saving){this.reloadPending=!0;return}this.unsupported=!1,this.show(s),this.loadError=void 0}catch(s){if(i!==this.loadSeq)return;fn(s)?(this.unsupported=!0,this.loadError=void 0):(!t||this.record===void 0)&&(this.loadError=R(s).message)}this.loading=!1,this.unsupported||this.pollIfWaiting()}flushPending(){!this.reloadPending||this.saving||(this.reloadPending=!1,this.load(!0))}show(t){this.record=t;let a=t.revision>0?Tt(t.document):void 0,i=An(a,t.revision);i.kept.length>0?this.note={kind:"warn",text:de(i.kept)}:i.mergedIntoEdits&&(this.note={kind:"warn",text:"The HTTP actions changed somewhere else. Your edits are kept."}),this.requestUpdate()}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||sa(this.record,this.watches).waiting.length===0)&&(this.pollTimer=window.setTimeout(()=>{this.pollTimer=void 0,this.load(!0)},vi))}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(t,a){let i=this.draft;if(!i||this.saving)return!1;let s=i.apply(t(i.document),a);return this.requestUpdate(),s}memoIcons(){let t=this.icons??xt,a=this.iconMemo;if(a!==void 0&&a.provider===t&&a.tick===this.iconsTick)return a.icons;let i=kt(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:i},i}viewHost(){let t=this.draft,a=this.hass;if(t===void 0||a===void 0)return;let i=this;return{hass:a,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,get document(){return t.document},get busy(){return i.saving},edit:(s,o)=>this.draft===t&&this.edit(s,o),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate(),test:(s,o,d)=>Xe(a,s,o,d),newId:Pt}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}startLibrary(){if(this.record===void 0||this.unsupported)return;Sn();let t=this.viewHost();t!==void 0&&ce(t),this.requestUpdate()}async save(){let t=this.hass,a=this.draft;if(!t||!a||this.saving||!a.dirty)return;this.note=void 0,a.apply(Qt(a.document,a.base));let i=Tn(a,{save:(o,d)=>Ge(t,o,d).catch(p=>{throw ra(p)}),fetch:async()=>{let o=await he(t).catch(d=>{throw ra(d)});return o.document===void 0?{revision:o.revision}:{revision:o.revision,document:o.document}}});this.followedSave=a.saveDone,this.requestUpdate();let s=await i.catch(o=>{let{code:d,message:p}=R(o);return{ok:!1,revision:a.revision,merged:!1,code:d??"unknown",message:p}});this.saveEnded(),this.note=Pn(s),this.flushPending()}lookHost(){return{uiState:this.uiState,requestUpdate:()=>this.requestUpdate()}}render(){let t=this.draft;return r`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(t):c}
        ${this.note?r`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:c}
      </div>
      ${this.renderBody()}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=ia}renderTopBar(t){let a=t!==void 0,i=a&&this.dirty,s=this.barHost!==void 0;return r`<div class="wa-bar ${s?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="HTTP actions">
      ${s?r`<span class="tb-note">${ae}</span>`:r`<span class="ha-title"><b>HTTP actions</b><span class="ha-shared">${ae}</span></span>`}
      <span class="spacer"></span>
      ${s&&a?ft({newWatch:!1,dirty:i,saved:this.renderSaved()}):c}
      ${this.renderSyncPill()}
      ${a?r`<span class="side-menu pe-top-menu">
          <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${this.topMenuOpen?"true":"false"} aria-label="More actions" title="More"
            @click=${()=>{this.topMenuOpen=!this.topMenuOpen}}>···</button>
          ${this.topMenuOpen?r`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
            <button class="row" role="menuitem" ?disabled=${!i||this.saving}
              title="Go back to the copy Home Assistant holds. Undo brings the edits back."
              @click=${()=>{this.topMenuOpen=!1,this.discard()}}>Discard edits</button>
          </div>`:c}
        </span>
        <button class="cv-act icon undo" ?disabled=${!t.canUndo} title=${`Undo (${Be}Z)`} aria-label="Undo" @click=${()=>this.undo()}>${w("undo")}</button>
        <button class="cv-act icon undo" ?disabled=${!t.canRedo} title=${da?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo" @click=${()=>this.redo()}>${w("redo")}</button>
        <button class="primary save ${i?"dirty":""}" ?disabled=${!i||this.saving}
          title=${i?`Save (${Be}S). A save reaches every watch the next time it checks.`:`Nothing to save (${Be}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${s?c:r`<span class="tb-saved" title=${i?"Unsaved changes":""}>${this.renderSaved()}</span>`}`:c}
    </div>`}renderSaved(){let t=this.record,a=this.savedText();if(t===void 0||a==="")return c;let i=Hi(t,this.allOwners);return r`<span title=${`Revision ${t.revision}, ${i}`}>${a}</span>`}savedText(){let t=this.record;if(t===void 0||t.revision<=0)return"";let a=yi(t.updated_at);return a?`Saved ${a}`:"Saved"}renderSyncPill(){let t=this.record;if(t===void 0||t.revision<=0||this.unsupported)return c;let{collected:a,waiting:i}=sa(t,this.watches);if(a.length===0&&i.length===0)return c;let s=[i.length>0?`Waiting: ${i.join(", ")}. ${rt}`:"",a.length>0?`Synced: ${a.join(", ")}.`:""].filter(o=>o!=="").join(" ");return r`<span class="tb-sync ${i.length===0?"ok":"warn"}" title=${s}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${i.length===0?st:ot}</span>
    </span>`}listWidth(){return this.hostWidth>0&&this.hostWidth<=ia?this.columns.left:xi(this.hostWidth-wi,this.columns.left)}renderGutter(){return r`<div class="gutter left" role="separator" aria-orientation="vertical" aria-label="Resize the list"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${t=>{vt(t,{side:"left",base:this.listWidth(),limits:J,onWidth:a=>{this.columns={...this.columns,left:a}},onEnd:()=>be(je,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,left:Ke.left},be(je,this.columns)}}></div>`}renderBody(){if(this.unsupported)return r`<div class="ha-calm"><div class="pe-empty"><b>${un}</b></div></div>`;if(this.loadError!==void 0)return r`<div class="ha-calm"><div class="pe-empty">
        <span>Could not read the HTTP actions: ${this.loadError}</span>
        <button class="pe-btn" @click=${()=>{this.load()}}>Try again</button>
      </div></div>`;let t=this.record;if(this.loading||t===void 0)return r`<div class="ha-calm"><div class="pe-empty">Loading…</div></div>`;let a=this.draft,i=this.viewHost();if(a===void 0||i===void 0)return r`<div class="ha-calm"><div class="pe-empty ha-empty"><b>${ie}</b>
        <span>An HTTP action is a web request a watch asks Home Assistant to send. ${ae}</span>
        <span class="ha-start"><button class="pe-btn pe-primary" @click=${()=>this.startLibrary()}>${w("plus")}<span>${oe}</span></button></span>
        ${Ti(this.allOwners)?r`<span class="pe-muted">${cn(Ai(this.allOwners))}</span>`:c}
      </div></div>`;let s=M(a.document).filter(o=>o.presentsClientCertificate===!0).length;return r`${s===0?c:r`<p class="ha-cert-line">${s===1?"An action asks":`${s} actions ask`} for a client certificate. ${se}</p>`}
    <div class="layout pe-layout ha-two ${this.stacked?"cols-1":""}" style=${`--wa-left:${this.listWidth()}px`}>
      <div class="column left">
        ${ea(i)}
      </div>
      ${this.renderGutter()}
      <div class="column card ha-main">
        ${na(i)}
      </div>
    </div>
    ${this.renderFoot(t,a)}`}renderFoot(t,a){let i=X(a.document);return r`<div class="ha-foot" role="status">
      ${t.revision<=0?r`<span>Not saved yet. The first save makes the library.</span>`:c}
      <span class="spacer"></span>
      <span class="pe-muted ${i.near?"ha-near":""}">${oa(i.size)} of ${oa(i.limit)}</span>
    </div>`}static{this.styles=[ct,Qe,et,tt,nt,at,it,Y`
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
    .ha-title { display: inline-flex; align-items: baseline; gap: 10px; min-width: 0; padding-left: 4px; }
    .ha-title b { font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); white-space: nowrap; }
    .ha-shared { font-size: 13px; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .wa-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
    .wa-bar .pop-menu .row:disabled:hover { background: transparent; }
    .wa-bar button.cv-act {
      display: inline-grid; place-items: center; width: 30px; height: 30px; padding: 0; border-radius: 6px;
      border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-ink); cursor: pointer;
    }
    .wa-bar button.cv-act:disabled { opacity: .4; cursor: default; }
    .wa-bar button.cv-act:hover:not(:disabled) { background: var(--wa-hover); }
    .wa-bar .tb-saved { font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
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
    /* A screen with nothing to edit yet: one calm card in the middle. */
    .ha-calm { flex: 1 1 auto; min-height: 280px; display: flex; align-items: center; justify-content: center; padding: 24px 0; }
    .pe-empty {
      display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; max-width: 520px;
      padding: 28px 24px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .pe-empty > b { font-size: 15px; }
    .ha-start { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
    .ha-cert-line {
      flex: none; margin: 0 0 10px; padding: 8px 12px; font-size: 13px;
      border: 1px solid var(--wa-amber-line); border-radius: var(--wa-r-md, 12px);
    }
    /* Two panes, as a desktop HTTP client lays itself out: the collection
       on the left and the request over its response on the right, together
       exactly as tall as the screen leaves them, each scrolling inside. */
    .layout.pe-layout.ha-two {
      grid-template-columns: var(--wa-left, 260px) 8px minmax(0, 1fr);
      flex: 1 1 0; min-height: 460px; overflow: hidden; padding: 0; margin-bottom: 10px;
    }
    .ha-two > .column { min-width: 0; }
    .ha-two > .column.left { display: flex; flex-direction: column; min-height: 0; overflow: hidden; scrollbar-gutter: auto; }
    .ha-two > .column.ha-main {
      display: flex; flex-direction: column; min-height: 0; overflow: hidden; padding: 0; scrollbar-gutter: auto;
      border-radius: var(--wa-lc-r, 10px);
    }
    /* Stacked: the list first, then the main pane full width, and the page
       scrolls as one. */
    .layout.pe-layout.ha-two.cols-1 {
      grid-template-columns: minmax(0, 1fr); flex: none; min-height: auto; overflow: visible; row-gap: 10px;
    }
    .ha-two.cols-1 > .gutter { display: none; }
    .ha-two.cols-1 > .column { overflow: visible; }
    .layout.ha-two.cols-1 > .column.left { order: 1; }
    .layout.ha-two.cols-1 > .column.ha-main { order: 2; }
    .ha-two.cols-1 .ha-list-card { max-height: none; }
    .ha-two.cols-1 .ha-items { overflow: visible; }
    .ha-two.cols-1 .ha-req, .ha-two.cols-1 .ha-resp { flex: none; }
    .ha-two.cols-1 .ha-tabbody, .ha-two.cols-1 .ha-scroll { overflow: visible; }
    .ha-two.cols-1 .ha-resp-body { overflow: visible; }
    .ha-two.cols-1 pre.ha-snippet { max-height: 320px; overflow: auto; }
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
    .pe-btn.pe-danger { color: var(--wa-need); }
    .ha-foot {
      flex: none; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; padding: 8px 12px; font-size: 12.5px;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-card);
    }
    .ha-foot .spacer { flex: 1; }
    .ha-near { color: var(--wa-amber); }
    :host([narrow]) { --cf-pad: 12px; }
  `,aa,mt]}};x([E({attribute:!1})],v.prototype,"hass",2),x([E({attribute:!1})],v.prototype,"owners",2),x([E({type:Boolean,reflect:!0})],v.prototype,"narrow",2),x([E({attribute:!1})],v.prototype,"icons",2),x([E({attribute:!1})],v.prototype,"iconsTick",2),x([E({attribute:!1})],v.prototype,"barHost",2),x([S()],v.prototype,"record",2),x([S()],v.prototype,"unsupported",2),x([S()],v.prototype,"loading",2),x([S()],v.prototype,"loadError",2),x([S()],v.prototype,"note",2),x([S()],v.prototype,"ownList",2),x([S()],v.prototype,"topMenuOpen",2),x([S()],v.prototype,"columns",2),x([S()],v.prototype,"hostWidth",2);function ra(e){let{code:n,message:t}=R(e);return Object.assign(new Error(t),n===void 0?{}:{code:n})}customElements.get("wa-http-actions-editor")||customElements.define("wa-http-actions-editor",v);export{je as HA_COLUMNS_KEY,v as WaHttpActionsEditor,xi as fitHttpListWidth,Ai as homeNeedsUpdate,Ti as homeOwesHttpActions,sa as httpActionsDelivery,Hi as httpActionsSavedBy};
