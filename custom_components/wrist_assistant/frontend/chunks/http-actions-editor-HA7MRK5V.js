import{a as Ee,c as Ce,d as Rt,e as Re,g as D,h as ze,l as Je,m as Fe,n as Ge,o as qe}from"./chunk-AGSP7PIK.js";import{a as je,b as Ke,d as Be,n as h}from"./chunk-ZIEG52KN.js";import{Ac as Ae,Bc as xe,Cc as ke,Ce as Ne,Ec as Te,Fc as $e,Jc as _e,Ob as Ct,Pb as be,Qb as ye,Qc as j,Uf as Le,a as $,ad as Oe,bd as Se,bg as L,c as bt,cg as Ie,d as c,dg as Q,eg as Ve,fd as De,g as b,gd as Pe,hg as Nt,hh as We,i as me,ig as Ue,ih as Ye,j as Z,jc as ve,k as R,rg as Me,sc as N,tc as w,ub as ge,xc as He,zc as we}from"./chunk-NHKIA2WF.js";var _="actions",E="globalVariables",Hi=1,Xe=256*1024,Ht=["GET","POST","PUT","PATCH","DELETE"],en=["POST","PUT","PATCH","DELETE"],It=["none","json","form","text","audio"],Vt=["statusCode","bodyText","jsonField","header","regex"],nn=["text","number"],wt=10,Ut=1,Mt=60,Ze=/^[A-Za-z0-9_]+$/,wi=/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g;function jt(){return{[_]:[],[E]:[],schemaVersion:Hi}}function sn(t){return h(t)?t:void 0}function Ai(t){return new TextEncoder().encode(JSON.stringify(t)).length}function At(t){let n=Ai(t);return{size:n,limit:Xe,near:n/Xe>.8}}function P(t,n){let e=t!==void 0&&Object.hasOwn(t,n)?t[n]:void 0;return Array.isArray(e)?e:[]}function I(t){return P(t,_).filter(h)}function et(t){return P(t,E).filter(h)}function F(t,n){return I(t).find(e=>e.id===n)}function Kt(t,n){return et(t).find(e=>e.id===n)}function k(t){return typeof t=="string"?t:void 0}function at(t,n){return typeof t=="string"&&n.includes(t)?t:void 0}function on(t){let n=h(t)?t:{};return{id:k(n.id)??"",name:k(n.name)??"",value:k(n.value)??""}}function yt(t){let n=h(t)?t:{},e=Array.isArray(n.presetValues)?n.presetValues.filter(i=>typeof i=="string"):[];return{id:k(n.id)??"",key:k(n.key)??"",prompt:k(n.prompt)??"",kind:at(n.kind,nn)??"text",presetValues:e,presetsOnly:n.presetsOnly===!0}}function nt(t){let n=h(t)?t:{};return{id:k(n.id)??"",key:k(n.key)??"",value:k(n.value)??""}}function xi(t){if(!h(t))return;let n=at(t.source,Vt);if(n===void 0)return;let e={source:n};for(let i of["jsonPath","headerName","pattern","unit"]){let s=k(t[i]);s!==void 0&&(e[i]=s)}return e}function V(t){let n=typeof t.timeout=="number"&&Number.isFinite(t.timeout)?t.timeout:void 0,e={id:k(t.id)??"",name:k(t.name)??"",method:k(t.method)??"POST",url:k(t.url)??"",headers:Array.isArray(t.headers)?t.headers.map(on):[],bodyContentType:at(t.bodyContentType,It)??"none",variables:Array.isArray(t.variables)?t.variables.map(yt):[],allowsUntrustedCertificate:t.allowsUntrustedCertificate===!0,presentsClientCertificate:t.presentsClientCertificate===!0},i=k(t.body);i!==void 0&&(e.body=i),n!==void 0&&(e.timeout=n);let s=xi(t.responseConfig);s!==void 0&&(e.reply=s);let o=k(t.icon),r=k(t.iconColor);return o!==void 0&&(e.icon=o),r!==void 0&&(e.iconColor=r),e}function G(t){return t.method.trim().toUpperCase()}function dt(t){return en.includes(G(t))}function Bt(t){return t.bodyContentType==="audio"&&dt(t)}function q(t){return t.url.trim()===""}function W(t){let n=t.name.trim();if(n!=="")return n;let e=t.url.trim();return e!==""?e:"Untitled action"}function Lt(t){let n=t.replaceAll("_"," ").replaceAll("-"," ");return n.trim()===""?"Value":n.split(" ").filter(e=>e!=="").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}function ki(t){return t.replace(/[^A-Za-z0-9_]/g,"")}function zt(t){let n=new Set,e=[];for(let i of t.presetValues){let s=i.trim();s===""||n.has(s)||(n.add(s),e.push(s))}return e}function rn(t){let n=new Set,e=[];for(let i of t)for(let s of i.matchAll(wi)){let o=s[1];n.has(o)||(n.add(o),e.push(o))}return e}function B(t){let n=new Set;for(let e of et(t)){let i=nt(e).key.trim();i!==""&&n.add(i)}return n}function an(t){let n=[t.url];for(let e of t.headers)n.push(e.name),Di(e)||n.push(e.value);return dt(t)&&t.bodyContentType!=="audio"&&t.body!==void 0&&n.push(t.body),n}function it(t,n){let e=rn(an(t));return{global:e.filter(i=>n.has(i)),asked:e.filter(i=>!n.has(i))}}function ct(t,n){let{asked:e}=it(t,n);return e.map(i=>t.variables.find(s=>s.key===i)).filter(i=>i!==void 0)}function rt(t,n,e){n==="__proto__"?Object.defineProperty(t,n,{value:e,enumerable:!0,writable:!0,configurable:!0}):t[n]=e}function m(t,n,e){if(Object.hasOwn(t,n)){if(D(t[n],e)&&typeof t[n]==typeof e)return t;let o={};for(let r of Object.keys(t))rt(o,r,r===n?e:t[r]);return o}let i={},s=!1;for(let o of Object.keys(t))!s&&o>n&&(rt(i,n,e),s=!0),rt(i,o,t[o]);return s||rt(i,n,e),i}function vt(t,n){if(!Object.hasOwn(t,n))return t;let e={};for(let i of Object.keys(t))i!==n&&rt(e,i,t[i]);return e}function st(t,n,e){return e===void 0?vt(t,n):m(t,n,e)}function xt(t,n,e){let i=t.findIndex(d=>h(d)&&d.id===n);if(i<0)return t;let s=t[i],o=e(s);if(o===s)return t;let r=t.slice();return r[i]=o,r}function z(t,n,e){return e===t[n]?t:m(t,n,e)}function A(t,n,e){let i=P(t,_),s=xt(i,n,e);return s===i?t:z(t,_,s)}function dn(t,n,e){let i=P(t,E),s=xt(i,n,e);return s===i?t:z(t,E,s)}function pt(){let t=globalThis.crypto;if(t!==void 0&&typeof t.randomUUID=="function")return t.randomUUID().toUpperCase();let n=e=>Array.from({length:e},()=>Math.floor(Math.random()*16).toString(16)).join("");return`${n(8)}-${n(4)}-4${n(3)}-${(8+Math.floor(Math.random()*4)).toString(16)}${n(3)}-${n(12)}`.toUpperCase()}function cn(t,n){return{bodyContentType:"none",headers:[],id:t,method:"POST",name:n,url:"",variables:[]}}function pn(t,n="New action"){let e=new Set(I(t).map(i=>V(i).name.trim().toLowerCase()));if(!e.has(n.toLowerCase()))return n;for(let i=2;;i++)if(!e.has(`${n} ${i}`.toLowerCase()))return`${n} ${i}`}function ln(t,n){return z(t,_,[...P(t,_),n])}function un(t,n,e=pt){let i=P(t,_),s=i.findIndex(g=>h(g)&&g.id===n);if(s<0)return{document:t};let o=i[s],r=e(),d=m(o,"id",r);d=m(d,"name",`${W(V(o))} Copy`);let a=g=>Array.isArray(g)?g.map(l=>h(l)?m(l,"id",e()):l):g;Array.isArray(o.headers)&&(d=m(d,"headers",a(o.headers))),Array.isArray(o.variables)&&(d=m(d,"variables",a(o.variables)));let p=i.slice();return p.splice(s+1,0,d),{document:z(t,_,p),id:r}}function hn(t,n){let e=P(t,_),i=e.filter(s=>!(h(s)&&s.id===n));return i.length===e.length?t:z(t,_,i)}function Jt(t,n,e){let i=P(t,_),s=i.findIndex(a=>h(a)&&a.id===n);if(s<0)return t;let o=Math.max(0,Math.min(e,i.length-1));if(s===o)return t;let r=i.slice(),[d]=r.splice(s,1);return r.splice(o,0,d),z(t,_,r)}function fn(t,n,e){return A(t,n,i=>m(i,"name",e))}function mn(t,n,e){let i=e.trim();return A(t,n,s=>st(s,"icon",i===""?void 0:i))}function gn(t,n,e){return e!==void 0&&!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e)?t:A(t,n,i=>st(i,"iconColor",e?.toUpperCase()))}function bn(t,n,e){let i=e.trim().toUpperCase();return Ht.includes(i)?A(t,n,s=>{let o=m(s,"method",i);return!en.includes(i)&&o.bodyContentType==="audio"&&(o=m(o,"bodyContentType","none")),o}):t}function yn(t,n,e){return A(t,n,i=>m(i,"url",e))}function vn(t,n,e){return It.includes(e)?A(t,n,i=>{let s=m(i,"bodyContentType",e);return e==="audio"?vt(s,"body"):s}):t}function Hn(t,n,e){return A(t,n,i=>st(i,"body",e.trim()===""?void 0:e))}function wn(t,n,e){return e!==void 0&&(!Number.isFinite(e)||e<=0)?t:A(t,n,i=>st(i,"timeout",e))}function An(t,n,e){return A(t,n,i=>st(i,"allowsUntrustedCertificate",e?!0:void 0))}function tt(t){return P(t,"headers")}function xn(t,n,e){return A(t,n,i=>m(i,"headers",[...tt(i),{id:e,name:"",value:""}]))}function kt(t,n,e,i){return A(t,n,s=>{let o=tt(s),r=xt(o,e,d=>{let a=d;return i.name!==void 0&&(a=m(a,"name",i.name)),i.value!==void 0&&(a=m(a,"value",i.value)),a});return r===o?s:m(s,"headers",r)})}function Ft(t,n,e){return A(t,n,i=>{let s=tt(i),o=s.filter(r=>!(h(r)&&r.id===e));return o.length===s.length?i:m(i,"headers",o)})}var Gt=[["none","None"],["bearer","Bearer token"],["basic","Username and password"],["apiKey","API key header"]],Ti="X-Api-Key",Qe="A07A0000-0000-0000-0000-0000000A0140",$i=new Set(["x-api-key","api-key","apikey","x-api-token","x-auth-token","x-access-token"]);function K(t="none"){return{kind:t,token:"",username:"",password:"",headerName:Ti,apiKeyValue:""}}function _i(t){let n=new TextEncoder().encode(t),e="";for(let i of n)e+=String.fromCharCode(i);return btoa(e)}function Oi(t){if(!(!/^[A-Za-z0-9+/]*={0,2}$/.test(t)||t.length%4!==0))try{let n=atob(t),e=Uint8Array.from(n,i=>i.charCodeAt(0));return new TextDecoder("utf-8",{fatal:!0}).decode(e)}catch{return}}function Si(t){switch(t.kind){case"bearer":{let n=t.token.trim();return n===""?void 0:{name:"Authorization",value:`Bearer ${n}`}}case"basic":return t.username===""&&t.password===""?void 0:{name:"Authorization",value:`Basic ${_i(`${t.username}:${t.password}`)}`};case"apiKey":{let n=t.headerName.trim(),e=t.apiKeyValue.trim();return n===""||e===""?void 0:{name:n,value:e}}default:return}}function Tt(t){let n=t.name.trim(),e=t.value.trim();if(n.toLowerCase()==="authorization"){if(e.length>7&&e.slice(0,7).toLowerCase()==="bearer ")return{...K("bearer"),token:e.slice(7).trim()};if(e.length>6&&e.slice(0,6).toLowerCase()==="basic "){let i=Oi(e.slice(6).trim()),s=i?.indexOf(":")??-1;return i===void 0||s<0?void 0:{...K("basic"),username:i.slice(0,s),password:i.slice(s+1)}}return}if($i.has(n.toLowerCase()))return e===""?void 0:{...K("apiKey"),headerName:n,apiKeyValue:e}}function Di(t){return Tt(t)?.kind==="basic"}function kn(t){for(let n of t){let e=Tt(n);if(e!==void 0)return{auth:e,headerId:n.id}}return{auth:K()}}function Tn(t,n,e,i){let s=Si(i),o=F(t,n);if(o===void 0)return{document:t};let r=tt(o);if((e===void 0?-1:r.findIndex(l=>h(l)&&l.id===e))>=0)return s===void 0?{document:Ft(t,n,e)}:{document:kt(t,n,e,s),headerId:e};if(s===void 0)return{document:t};let p=r.some(l=>h(l)&&l.id===Qe)?pt():Qe,g={id:p,name:s.name,value:s.value};return{document:A(t,n,l=>m(l,"headers",[g,...tt(l)])),headerId:p}}function tn(t,n){return{id:t,key:n,kind:"text",presetValues:[],presetsOnly:!1,prompt:Lt(n)}}function $n(t,n,e=pt){let i=F(t,n);if(i===void 0)return t;let s=V(i),o=it(s,B(t)).asked,r=P(i,"variables"),d=l=>yt(l).key,a=o.filter(l=>!r.some(f=>d(f)===l));if(a.length===0)return t;let p=r.map((l,f)=>[l,f]).filter(([l])=>!o.includes(d(l))),g;if(a.length===1&&p.length===1){let[l,f]=p[0],y=d(l),O=h(l)?m(l,"key",a[0]):tn(e(),a[0]),v=yt(l).prompt;h(l)&&(v===""||v===Lt(y))&&(O=m(O,"prompt",Lt(a[0]))),g=r.slice(),g[f]=O}else g=[...r,...a.map(l=>tn(e(),l))];return A(t,n,l=>m(l,"variables",g))}function _n(t,n,e,i){return A(t,n,s=>{let o=P(s,"variables"),r=xt(o,e,d=>{let a=d;return i.prompt!==void 0&&(a=m(a,"prompt",i.prompt)),i.kind!==void 0&&nn.includes(i.kind)&&(a=m(a,"kind",i.kind)),i.presetValues!==void 0&&(a=m(a,"presetValues",i.presetValues)),i.presetsOnly!==void 0&&(a=m(a,"presetsOnly",i.presetsOnly)),a});return r===o?s:m(s,"variables",r)})}function On(t,n,e){return A(t,n,i=>{let s=P(i,"variables"),o=s.filter(r=>!(h(r)&&r.id===e));return o.length===s.length?i:m(i,"variables",o)})}function Sn(t,n){let e=new Set(it(t,n).asked);return t.variables.filter(i=>!e.has(i.key))}function Dn(t,n){let e=B(t),i=new Map(I(n).map(o=>[o.id,o])),s=t;for(let o of I(t)){let r=k(o.id);if(r===void 0)continue;let d=i.get(r);d!==void 0&&D(d,o)||(s=A(s,r,a=>{let p=a,g=tt(a),l=g.filter(v=>!h(v)||on(v).name.trim()!=="");l.length!==g.length&&(p=m(p,"headers",l));let f=V(p),y=P(p,"variables"),O=it(f,e).asked.map(v=>y.find(x=>yt(x).key===v)).filter(v=>v!==void 0).map(v=>{if(!h(v)||!Array.isArray(v.presetValues))return v;let x=v.presetValues.map(C=>typeof C=="string"?C.trim():C).filter(C=>C!=="");return D(x,v.presetValues)&&x.length===v.presetValues.length?v:m(v,"presetValues",x)});return(O.length!==y.length||O.some((v,x)=>v!==y[x]))&&(p=m(p,"variables",O)),p}))}return s}var qt={statusCode:void 0,bodyText:void 0,jsonField:"jsonPath",header:"headerName",regex:"pattern"};function $t(t,n,e){return A(t,n,i=>{if(e===void 0)return vt(i,"responseConfig");if(!Vt.includes(e))return i;let s=h(i.responseConfig)?i.responseConfig:{},o=m(s,"source",e);for(let r of["jsonPath","headerName","pattern"])qt[e]!==r&&(o=vt(o,r));return m(i,"responseConfig",o)})}function Y(t,n,e,i){return A(t,n,s=>{if(!h(s.responseConfig))return s;let o=e==="unit"?i:i.trim();return m(s,"responseConfig",st(s.responseConfig,e,o===""?void 0:o))})}function Pn(t,n,e){return Y($t(t,n,"jsonField"),n,"jsonPath",e)}function En(t,n,e){return Y($t(t,n,"header"),n,"headerName",e)}function Cn(t,n="value"){let e=B(t);if(!e.has(n))return n;for(let i=2;;i++)if(!e.has(`${n}_${i}`))return`${n}_${i}`}function Rn(t,n,e){return z(t,E,[...P(t,E),{id:n,key:e,value:""}])}function Nn(t,n,e){return dn(t,n,i=>m(i,"key",ki(e)))}function Ln(t,n,e){return dn(t,n,i=>m(i,"value",e))}function In(t,n){let e=P(t,E),i=e.filter(s=>!(h(s)&&s.id===n));return i.length===e.length?t:z(t,E,i)}function Wt(t,n){return n===""?[]:I(t).map(V).filter(e=>rn(an(e)).includes(n)).map(W)}function Vn(t){if(!h(t))return["The library is not an object."];let n=[],e=Object.hasOwn(t,_)?t[_]:void 0,i=Object.hasOwn(t,E)?t[E]:void 0;Array.isArray(e)||n.push("The action list is missing."),i!==void 0&&!Array.isArray(i)&&n.push("The globals are not a list.");let s=new Set;(Array.isArray(e)?e:[]).forEach((r,d)=>{if(!h(r)){n.push(`Action ${d+1} is not an object.`);return}let a=typeof r.name=="string"&&r.name.trim()!==""?`"${r.name.trim()}"`:`Action ${d+1}`,p=r.id;typeof p!="string"||p===""?n.push(`${a} has no id.`):s.has(p)?n.push(`${a} has the id of another action.`):s.add(p);for(let f of["name","method","url"])Object.hasOwn(r,f)&&typeof r[f]!="string"&&n.push(`${a} has a ${f} that is not text.`);for(let f of["body","icon","iconColor"])Object.hasOwn(r,f)&&r[f]!==null&&typeof r[f]!="string"&&n.push(`${a} has a ${f} that is not text.`);typeof r.method=="string"&&!Ht.includes(r.method.trim().toUpperCase())&&n.push(`${a} uses ${r.method}, which is not GET, POST, PUT, PATCH or DELETE.`),Object.hasOwn(r,"bodyContentType")&&at(r.bodyContentType,It)===void 0&&n.push(`${a} has a body type Home Assistant does not know.`),Object.hasOwn(r,"timeout")&&r.timeout!==null&&(typeof r.timeout!="number"||!Number.isFinite(r.timeout))&&n.push(`${a} has a timeout that is not a number.`),h(r.responseConfig)&&at(r.responseConfig.source,Vt)===void 0&&n.push(`${a} reads its reply value from a source Home Assistant does not know.`);let g=r.headers;Object.hasOwn(r,"headers")&&!Array.isArray(g)&&n.push(`${a} has headers that are not a list.`);for(let f of Array.isArray(g)?g:[])if(!h(f)||Object.hasOwn(f,"name")&&typeof f.name!="string"||Object.hasOwn(f,"value")&&typeof f.value!="string"){n.push(`${a} has a header that is not text.`);break}let l=r.variables;Object.hasOwn(r,"variables")&&!Array.isArray(l)&&n.push(`${a} has values to ask for that are not a list.`);for(let f of Array.isArray(l)?l:[]){let y=h(f)?f.key:void 0;if(typeof y!="string"||!Ze.test(y)){n.push(`${a} asks for a value whose key is not letters, digits and underscores.`);break}}});let o=new Set;return(Array.isArray(i)?i:[]).forEach((r,d)=>{let a=h(r)&&typeof r.key=="string"?r.key.trim():"";if(!h(r)||Object.hasOwn(r,"value")&&typeof r.value!="string"){n.push(`Global ${d+1} is not text.`);return}a===""?n.push(`Global ${d+1} has no name.`):Ze.test(a)?o.has(a)?n.push(`Two globals are named {{${a}}}.`):o.add(a):n.push(`The global {{${a}}} has a name that is not letters, digits and underscores.`)}),n}var Yt="Shared by every watch.",Un="No HTTP actions yet.",Mn="Add an action",jn="Turning on Edit pages in Home Assistant in the iPhone app brings the phone's actions here.",Kn="Update the integration to edit HTTP actions here.",_t="Home Assistant does not send a client certificate.",Xt="Type {{key}} in the URL, a header or the body. A key that names a global is filled in from Globals. Any other key is asked for on the watch when the action runs. Keys are letters, digits and underscores.";function Bn(t){return j(t).code==="unknown_command"}var zn={list:"action",field:_,keyOf:t=>typeof t.id=="string"&&t.id!==""?t.id:void 0,nameOf:t=>typeof t.name=="string"?t.name.trim():""},Jn={list:"global",field:E,keyOf:t=>typeof t.key=="string"&&t.key.trim()!==""?t.key.trim():void 0,nameOf:t=>typeof t.key=="string"?`{{${t.key.trim()}}}`:""};function ot(t,n){return t!=null&&Object.hasOwn(t,n)?t[n]:void 0}function lt(t,n){if(!Array.isArray(t))return;let e=new Set,i=[];for(let s of t){if(!h(s))return;let o=n.keyOf(s);if(o===void 0||e.has(o))return;e.add(o),i.push([o,s])}return i}function Pi(t,n,e){let i=lt(t,e),s=lt(n,e);if(i===void 0||s===void 0)return t;let o=new Set(s.map(([r])=>r));return i.filter(([r])=>o.has(r)).map(([,r])=>r)}function Ei(t,n,e,i){let s=t===null?void 0:t,o=n===null?void 0:n,r=e===null?void 0:e,d=s===void 0?[]:lt(s,i),a=o===void 0?void 0:lt(o,i),p=r===void 0?void 0:lt(r,i);if(d===void 0||a===void 0||p===void 0)return{value:D(o,s)?r:o,clashes:[]};let g=new Map(d),l=new Map(a),f=new Map(p),y=[],O=(u,H)=>{let S=g.get(u);return S===void 0||!D(H,S)},v=(u,H,S)=>O(u,H)?(O(u,S)&&!D(H,S)&&y.push({list:i.list,key:u,name:i.nameOf(H)||i.nameOf(S)}),H):S,x=(u,H)=>g.has(u)&&!O(u,H)?void 0:H,C=a.map(([u])=>u).filter(u=>g.has(u)),he=d.map(([u])=>u).filter(u=>l.has(u)),vi=C.length!==he.length||C.some((u,H)=>u!==he[H]),mt=[],gt=u=>{u!==void 0&&mt.push(u)};if(vi){for(let[u,H]of a){let S=f.get(u);gt(S!==void 0?v(u,H,S):x(u,H))}for(let[u,H]of p)l.has(u)||gt(x(u,H))}else{for(let[u,H]of p){let S=l.get(u);gt(S!==void 0?v(u,S,H):x(u,H))}for(let[u,H]of a)f.has(u)||gt(x(u,H))}let fe=u=>Array.isArray(u)&&u.length===mt.length&&mt.every((H,S)=>H===u[S]);return fe(r)?{value:r,clashes:y}:fe(o)?{value:o,clashes:y}:{value:mt,clashes:y}}function Ci(t,n,e,i){return t==null?Pi(ot(e,i.field),ot(n,i.field),i):ot(t,i.field)}function Zt(t,n,e,i){return Ei(Ci(t,n,e,i),ot(n,i.field),ot(e,i.field),i)}function Fn(t,n,e){return[...Zt(t,n,e,zn).clashes,...Zt(t,n,e,Jn).clashes]}function Gn(t,n,e){let i=ze(t,n,e);for(let s of[zn,Jn]){let o=Zt(t,n,e,s).value,r=ot(i,s.field);if(o!==r){if(o===void 0){if(!Object.hasOwn(i,s.field))continue;let{[s.field]:d,...a}=i;i=a;continue}(i===e||i===n)&&(i={...i}),i[s.field]=o}}return i}var qn=100,Ri=3,Ot=class{constructor(n,e){this._undo=[];this._redo=[];this._kept=[];this._base=n,this._revision=e,this._document=n}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get kept(){return this._kept}get dirty(){let n=this._dirty;if(n!==void 0&&n.document===this._document&&n.base===this._base)return n.value;let e=this._document!==this._base&&!D(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(n,e){if(n===this._document||D(n,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let i=this._undo[this._undo.length-1];return D(n,i)?(this._undo.pop(),this._document=i,this._coalesceKey=void 0):this._document=n,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=n,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let n=this._undo.pop();return n===void 0?!1:(this._redo.push(this._document),this._document=n,!0)}redo(){this._coalesceKey=void 0;let n=this._redo.pop();return n===void 0?!1:(this.pushUndo(this._document),this._document=n,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(n,e){return e<this._revision?(this._kept=[],!1):this.mergeOnto(n,e)}restart(n,e){return this.mergeOnto(n,e)}mergeOnto(n,e){this._coalesceKey=void 0;let i=this._base;this._kept=this._document===i?[]:Fn(i,this._document,n);let s=new Map,o=l=>{let f=s.get(l);if(f!==void 0)return f;let y=l===i?n:Gn(i,l,n);return y!==n&&D(y,n)&&(y=n),s.set(l,y),y},r=this._document,d=[...this._undo,this._document,...this._redo.slice().reverse()].map(o),a=this._undo.length,p=[],g=0;return d.forEach((l,f)=>{let y=p[p.length-1];y!==void 0&&(y===l||D(y,l))?f===a&&(p[p.length-1]=l):p.push(l),f===a&&(g=p.length-1)}),this._undo=p.slice(0,g),this._document=p[g],this._redo=p.slice(g+1).reverse(),this._base=n,this._revision=e,this._document!==r&&!D(this._document,r)}saved(n,e){e<this._revision||(this._coalesceKey=void 0,this._base=n,this._revision=e)}get saving(){return ut.has(this)}get saveDone(){return ut.get(this)}pushUndo(n){this._undo.push(n),this._undo.length>qn&&this._undo.splice(0,this._undo.length-qn)}},ut=new WeakMap;function Wn(t,n){if(ut.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"The HTTP actions are being saved already."});let e=Li(t,n).finally(()=>ut.delete(t));return ut.set(t,e),e}function Ni(t){let n=At(t);return n.size<=n.limit?[]:[`The library is ${Math.ceil(n.size/1024)} KB, past the ${n.limit/1024} KB Home Assistant keeps.`]}async function Li(t,n){let e=!1,i=new Map,s=()=>i.size===0?{}:{kept:[...i.values()]},o=(r,d,a)=>({ok:!1,revision:t.revision,merged:e,code:r,message:d,...s(),...a===void 0?{}:{problems:a}});for(let r=1;;r++){let d=t.document,a=[...Vn(d),...Ni(d)];if(a.length>0)return o("invalid",a.join(" "),a);let p;try{({revision:p}=await n.save(t.revision,d))}catch(g){let{code:l="unknown",message:f}=j(g);if(l!=="conflict"||r>=Ri)return o(l,f);let y;try{y=await n.fetch()}catch(x){let C=j(x);return o(C.code??"unknown",C.message)}let O=h(y)&&typeof y.revision=="number"?y.revision:0,v=h(y)&&h(y.document)?y.document:jt();O<t.revision?t.restart(v,O):t.rebase(v,O);for(let x of t.kept)i.set(`${x.list}:${x.key}`,x);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0,...s()};continue}return t.saved(d,p),{ok:!0,revision:t.revision,merged:e,...s()}}}var X;function Qt(){return X}function Yn(t,n){let e=X;if(n<=0||t===void 0)return{...e===void 0?{}:{draft:e},mergedIntoEdits:!1,kept:[]};if(e===void 0||n<e.revision&&!e.dirty){let o=new Ot(t,n);return X=o,{draft:o,mergedIntoEdits:!1,kept:[]}}if(n===e.revision)return{draft:e,mergedIntoEdits:!1,kept:[]};let i=e.dirty,s=n<e.revision?e.restart(t,n):e.rebase(t,n);return{draft:e,mergedIntoEdits:i&&s,kept:i?e.kept:[]}}function Xn(){return X??=new Ot(jt(),0),X}function te(){return X?.dirty??!1}function Zn(){X=void 0}function Ii(t){return t.list==="global"?t.name.trim()===""?`{{${t.key}}}`:t.name:`"${t.name.trim()===""?"an untitled action":t.name}"`}function St(t){if(t.length===0)return"";let n=t.map(Ii);return`${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`} also changed somewhere else. ${n.length===1?"Your version was kept.":"Your versions were kept."}`}function Qn(t){if(t.ok){let e=t.kept??[];if(t.alreadySaved===!0){let i=e.length>0?` ${St(e)}`:"";return{kind:e.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.${i}`}}return e.length>0?{kind:"warn",text:`Saved. ${St(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The HTTP actions kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the HTTP actions${n===""?".":`: ${n}`}`}}case"busy":return{kind:"warn",text:"Already saving. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the HTTP actions just now. Your edits are kept, so try again in a moment."};case"unknown_command":return{kind:"err",text:"Not saved. Update the integration to edit HTTP actions here."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}var Pt="http-actions",ee="ha:sel",ne="ha:show:",ii="ha:auth:",si="ha:test:",ie="network",Vi="#CCD8E6",Ui="Web requests Home Assistant sends when a watch runs one, from a tile, a menu, a complication or a control. A save reaches every watch the next time it checks.",se="Fixed values any action can use as {{key}}, such as a server address or a token. Change one here and every action that uses it follows.",Mi="The watch records a voice clip of up to 30 seconds when the action runs and sends it as the body, as audio/mp4. Nothing to type here.",ji="This method sends no body. Pick POST, PUT, PATCH or DELETE to send one.",Ki=`Empty means ${wt} seconds. Home Assistant holds it between ${Ut} and ${Mt}.`,Bi="Sends the action as it is here, from Home Assistant, with the globals as they are here. Nothing is saved.",oi=[["none","None"],["json","JSON"],["form","Form"],["text","Text"],["audio","Voice clip"]],zi={none:void 0,json:"application/json",form:"application/x-www-form-urlencoded",text:"text/plain",audio:"audio/mp4"},Ji={none:"Request body",json:'{"key": "value"}',form:"key=value&other=123",text:"Plain text",audio:""},ri=[["none","None"],["statusCode","Status code"],["bodyText","Body text"],["jsonField","JSON field"],["header","Header"],["regex","Regex"]];function re(t,n,e){return`${t} ${t===1?n:e}`}function ti(t){if(q(t))return`${G(t)} \xB7 no URL yet`;let n=t.url.trim().replace(/^https?:\/\//i,"");return`${G(t)} \xB7 ${n}`}function ht(t){let n=t.uiState.get(ee);if(n?.kind==="action"&&F(t.document,n.id)!==void 0||n?.kind==="global"&&Kt(t.document,n.id)!==void 0)return n;let e=I(t.document)[0];return typeof e?.id=="string"?{kind:"action",id:e.id}:void 0}function ft(t,n){n===void 0?t.uiState.delete(ee):t.uiState.set(ee,n),t.requestUpdate()}function M(t,n,e,i){return t.edit(s=>$n(e(s),n,()=>t.newId()),i)}function Et(t){let n=t.newId();return t.edit(e=>ln(e,cn(n,pn(e)))),ft(t,{kind:"action",id:n}),n}function Fi(t){let n=t.newId();return t.edit(e=>Rn(e,n,Cn(e))),ft(t,{kind:"global",id:n}),n}function ai(t,n){return t.uiState.get(ne+n)===!0}function Gi(t,n){ai(t,n)?t.uiState.delete(ne+n):t.uiState.set(ne+n,!0),t.requestUpdate()}function di(t,n,e,i,s,o=""){let r=ai(t,s);return c`<span class="ha-secret">
    <input type=${r?"text":"password"} class="mono" .value=${e} placeholder=${o} aria-label=${n}
      autocomplete="off" spellcheck="false" data-secret=${s}
      @input=${d=>i(d.target.value)} />
    <button type="button" class="ha-show" aria-pressed=${r?"true":"false"} aria-label=${`${r?"Hide":"Show"} ${n}`}
      @click=${()=>Gi(t,s)}>${r?"Hide":"Show"}</button>
  </span>`}function Dt(t,n,e,i,s,o=""){return c`<div class="field ha-secret-field"><span>${n}</span>${di(t,n,e,i,s,o)}</div>`}function ae(t,n){let e=t.uiState.get(ii+n.id);if(e!==void 0){let i=e.headerId===void 0?void 0:n.headers.find(o=>o.id===e.headerId);if(i===void 0)return{auth:e.auth.kind===e.kind?e.auth:K(e.kind)};if(e.kind==="apiKey")return{auth:{...K("apiKey"),headerName:i.name,apiKeyValue:i.value},headerId:i.id};let s=Tt(i);return s!==void 0&&s.kind===e.kind?{auth:s,headerId:i.id}:{auth:K(e.kind),headerId:i.id}}return kn(n.headers)}function qi(t,n,e,i){let{headerId:s}=ae(t,n),o=s;M(t,n.id,r=>{let d=Tn(r,n.id,s,e);return o=d.headerId,d.document},i),t.uiState.set(ii+n.id,{kind:e.kind,auth:e,...o===void 0?{}:{headerId:o}}),t.requestUpdate()}function Wi(t,n){let{auth:e}=ae(t,n),i=(d,a)=>qi(t,n,{...e,...d},a),s=d=>`auth:${n.id}:${d}`,o=b;e.kind==="bearer"?o=Dt(t,"Token",e.token,d=>i({token:d},s("token")),s("token"),"Paste the token"):e.kind==="basic"?o=c`${L("Username",e.username,d=>i({username:d},s("user")))}
      ${Dt(t,"Password",e.password,d=>i({password:d},s("password")),s("password"))}`:e.kind==="apiKey"&&(o=c`${L("Header",e.headerName,d=>i({headerName:d},s("name")),{mono:!0,placeholder:"X-Api-Key"})}
      ${Dt(t,"Key",e.apiKeyValue,d=>i({apiKeyValue:d},s("key")),s("key"),"Paste the key")}`);let r=e.kind==="none"?"Add sign-in if the server asks for it. It is written as one header.":e.kind==="basic"?"Sent as an Authorization header, the username and password encoded together.":e.kind==="bearer"?"Sent as Authorization: Bearer and the token.":"Sent as a header with the key as its value.";return c`${Q("Sign-in",e.kind,Gt,d=>i({kind:d}),{snapBack:!0})}
    ${o}
    <p class="hint">${r}</p>`}function Yi(t,n,e,i){return t.icons.render(n,e,i)??c`<span class="ha-glyph-dot" style=${`background:${i}`}></span>`}function Xi(t,n){let e=n.iconColor??Vi;return c`<span class="thumb ha-thumb" style=${`--c:${e}`} aria-hidden="true"><span class="ha-thumb-glyph">${Yi(t,n.icon??ie,14,e)}</span></span>`}function Zi(t,n,e,i,s){let o=W(n),r=()=>ft(t,{kind:"action",id:n.id}),d=q(n);return c`<div class="layer ha-row ${s?"hl":""}" role="listitem" tabindex="0" data-action=${n.id}
    aria-current=${s?"true":"false"} aria-label=${o} title=${`${o} \xB7 ${ti(n)}`}
    @click=${a=>{a.target instanceof Element&&a.target.closest("button")||r()}}
    @keydown=${a=>{a.target!==a.currentTarget||a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),r())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Xi(t,n)}
    <span class="name"><b><span class="nm-t">${o}</span></b><small>${ti(n)}</small></span>
    <span class="right">
      <span class="badges">
        ${d?c`<span class="badge ha-need">needs setup</span>`:b}
        ${Bt(n)?c`<span class="badge">voice</span>`:b}
      </span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${t.busy||e===0} title="Move up" aria-label=${`Move ${o} up`}
          @click=${()=>t.edit(a=>Jt(a,n.id,e-1))}>${w("up")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||e===i-1} title="Move down" aria-label=${`Move ${o} down`}
          @click=${()=>t.edit(a=>Jt(a,n.id,e+1))}>${w("down")}</button>
      </span>
    </span>
  </div>`}function ci(t){let n=I(t.document).map(V),e=ht(t);return c`<section class="card lc ha-actions-card" aria-label="Actions" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 32px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${w("globe")}</span><span class="lc-title">Actions</span>
      <span class="lc-sub" title=${Ui}>${n.length}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri ha-add" aria-label="Add an action" ?disabled=${t.busy}
        title="A new action" @click=${()=>Et(t)}>${w("plus")}<span>Add</span></button>
    </div>
    ${n.length===0?c`<div class="lc-note">No actions yet. Add one to send a request from the watch.</div>`:c`<div class="layers ha-list" role="list">${n.map((i,s)=>Zi(t,i,s,n.length,e?.kind==="action"&&e.id===i.id))}</div>`}
  </section>`}function pi(t){let n=et(t.document).map(nt),e=ht(t);return c`<section class="card lc ha-globals-card" aria-label="Globals" style="--c: var(--wa-hue-green); --thumb-w: 0px">
    <div class="lc-head">
      <span class="swatch">${w("braces")}</span><span class="lc-title">Globals</span>
      <span class="lc-sub" title=${se}>${n.length}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri ha-add-global" aria-label="Add a global" ?disabled=${t.busy}
        title="A new global" @click=${()=>Fi(t)}>${w("plus")}<span>Add</span></button>
    </div>
    ${n.length===0?c`<div class="lc-note">${se}</div>`:c`<div class="layers ha-list" role="list">${n.map(i=>{let s=e?.kind==="global"&&e.id===i.id,o=Wt(t.document,i.key.trim()).length,r=i.key.trim()===""?"No name":`{{${i.key.trim()}}}`,d=()=>ft(t,{kind:"global",id:i.id});return c`<div class="layer ha-row ha-global-row ${s?"hl":""}" role="listitem" tabindex="0" data-global=${i.id}
            aria-current=${s?"true":"false"} aria-label=${r} @click=${d}
            @keydown=${a=>{a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),d())}}>
            <span class="grip" aria-hidden="true"></span><span aria-hidden="true"></span>
            <span class="name"><b><span class="nm-t mono">${r}</span></b><small>${o===0?"Not used yet":`Used by ${re(o,"action","actions")}`}</small></span>
          </div>`})}</div>`}
  </section>`}var Qi={action:{color:N.content,icon:"content"},request:{color:N.tap,icon:"globe"},auth:{color:N.states,icon:"lock"},headers:{color:N.place,icon:"list"},body:{color:N.numbers,icon:"braces"},options:{color:N.place,icon:"clock"},values:{color:N.position,icon:"text"},reply:{color:N.look,icon:"arrow"},test:{color:N.complication,icon:"tap"},global:{color:N.look,icon:"braces"}};function ts(t,n){return Je(t.uiState,Pt,n)}function U(t,n,e,i,s={}){let o=ts(t,n),r=Qi[n];return $e({color:r.color,icon:w(r.icon),title:e,open:o,onToggle:()=>{Fe(t.uiState,Pt,n,!o),t.requestUpdate()},...s.summary===void 0||s.summary===""?{}:{summary:s.summary},dot:s.dot===!0,id:`${Pt}:${n}`},o?i():c``)}function es(t){let n=ht(t);return(n===void 0?[]:n.kind==="global"?["global"]:["action","request","auth","headers","body","options","values","reply","test"]).map(i=>({module:Pt,section:i}))}function ns(t){let n=t.trim();if(n===""||n.startsWith("{"))return;let e=n.toLowerCase();return e.startsWith("http://")||e.startsWith("https://")?void 0:"Add http:// or https://. Without one the request will not send."}function is(t,n,e){let i=n.headers.filter(s=>s.id!==e);return c`<div class="ha-headers" role="list" aria-label="Headers">
      ${i.length===0?c`<p class="hint">No headers.</p>`:i.map(s=>c`<div class="ha-hrow" role="listitem">
        <input type="text" class="mono" .value=${s.name} placeholder="Name" aria-label="Header name"
          @input=${o=>M(t,n.id,r=>kt(r,n.id,s.id,{name:o.target.value}),`h:${s.id}:name`)} />
        ${di(t,`${s.name.trim()||"Header"} value`,s.value,o=>M(t,n.id,r=>kt(r,n.id,s.id,{value:o}),`h:${s.id}:value`),`header:${s.id}`,"Value")}
        <button type="button" class="icon ha-remove" title="Remove this header" aria-label=${`Remove ${s.name.trim()||"header"}`}
          @click=${()=>M(t,n.id,o=>Ft(o,n.id,s.id))}>${w("delete")}</button>
      </div>`)}
    </div>
    <div class="ha-acts">
      <button type="button" class="pe-btn" @click=${()=>M(t,n.id,s=>xn(s,n.id,t.newId()))}>${w("plus")}<span>Add a header</span></button>
    </div>
    <p class="hint">Header values stay hidden until shown.</p>`}function ss(t,n){if(!dt(n))return c`<p class="hint">${ji}</p>`;let e=n.bodyContentType,i=zi[e];return c`${Q("Type",e,oi,s=>M(t,n.id,o=>vn(o,n.id,s)),{snapBack:!0})}
    ${e==="audio"?c`<p class="hint ha-audio">${Mi}</p>`:c`<label class="field ha-body"><span>Body</span>
          <textarea class="mono" rows="7" spellcheck="false" .value=${n.body??""} placeholder=${Ji[e]}
            @input=${s=>M(t,n.id,o=>Hn(o,n.id,s.target.value),`a:${n.id}:body`)}></textarea></label>`}
    ${i===void 0?b:c`<p class="hint">Sends Content-Type: ${i}, unless a header sets one.</p>`}`}function os(t,n){let e=n.id,{headerId:i,auth:s}=ae(t,n),o=ns(n.url),r=n.headers.filter(a=>a.id!==i).length,d=dt(n)?oi.find(([a])=>a===n.bodyContentType)?.[1]??"None":"None";return c`
    ${U(t,"action","Action",()=>c`<fieldset class="ha-body-set" ?disabled=${t.busy}>
      ${L("Name",n.name,a=>t.edit(p=>fn(p,e,a),`a:${e}:name`),{placeholder:"My action"})}
      <div class="ha-stack">${Me({icons:t.icons,symbols:t.symbols},n.icon??ie,a=>t.edit(p=>mn(p,e,a===ie?"":a),`a:${e}:icon`),`ha:icon:${e}`,void 0,"Icon",!1)}</div>
      ${Ue("Color",n.iconColor,a=>t.edit(p=>gn(p,e,a),`a:${e}:color`),!0,null)}
      <p class="hint">The icon and color mark the action in lists.</p>
    </fieldset>`,{summary:W(n)})}
    ${U(t,"request","Request",()=>c`<fieldset class="ha-body-set" ?disabled=${t.busy}>
      ${Q("Method",G(n),Ht.map(a=>[a,a]),a=>M(t,e,p=>bn(p,e,a)),{snapBack:!0})}
      ${L("URL",n.url,a=>M(t,e,p=>yn(p,e,a),`a:${e}:url`),{mono:!0,placeholder:"https://example.com/api"})}
      ${o===void 0?b:c`<p class="hint ha-warn">${o}</p>`}
      ${q(n)?c`<p class="hint">With no URL the watch shows the action as needing setup.</p>`:b}
    </fieldset>`,{summary:`${G(n)}${q(n)?", no URL":""}`,dot:q(n)})}
    ${U(t,"auth","Sign-in",()=>c`<fieldset class="ha-body-set" ?disabled=${t.busy}>${Wi(t,n)}</fieldset>`,{summary:Gt.find(([a])=>a===s.kind)?.[1]??"None"})}
    ${U(t,"headers","Headers",()=>c`<fieldset class="ha-body-set" ?disabled=${t.busy}>${is(t,n,i)}</fieldset>`,{summary:r===0?"None":re(r,"header","headers")})}
    ${U(t,"body","Body",()=>c`<fieldset class="ha-body-set" ?disabled=${t.busy}>${ss(t,n)}</fieldset>`,{summary:d})}
    ${U(t,"options","Timeout and certificate",()=>c`<fieldset class="ha-body-set" ?disabled=${t.busy}>
      ${Ie("Timeout",n.timeout,a=>t.edit(p=>wn(p,e,a),`a:${e}:timeout`),{optional:!0,min:Ut,max:Mt,step:1,unit:"s",placeholder:String(wt),def:null})}
      <p class="hint">${Ki}</p>
      ${Nt("Accept a self-signed certificate",n.allowsUntrustedCertificate,a=>t.edit(p=>An(p,e,a)))}
      <p class="hint">Only for a server you run whose HTTPS certificate is not publicly trusted.</p>
      ${n.presentsClientCertificate?c`<p class="hint ha-warn">This action asks for a client certificate. ${_t}</p>`:b}
    </fieldset>`,{summary:`${n.timeout===void 0?wt:n.timeout} s${n.allowsUntrustedCertificate?", self-signed":""}`})}
    <div class="ha-acts">
      <button type="button" class="pe-btn" ?disabled=${t.busy} title="A copy with new ids, named Copy"
        @click=${()=>{let a;t.edit(p=>{let g=un(p,e,()=>t.newId());return a=g.id,g.document}),a!==void 0&&ft(t,{kind:"action",id:a})}}>${w("duplicate")}<span>Duplicate</span></button>
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy}
        title="Remove this action. Tiles and menu items that run it stop working."
        @click=${()=>t.edit(a=>hn(a,e))}>${w("delete")}<span>Remove</span></button>
    </div>`}function rs(t,n){let e=nt(n),i=Wt(t.document,e.key.trim()),s=et(t.document).map(nt).filter(o=>o.key.trim()!==""&&o.key.trim()===e.key.trim());return c`${U(t,"global","Global",()=>c`<fieldset class="ha-body-set" ?disabled=${t.busy}>
      ${L("Key",e.key,o=>t.edit(r=>Nn(r,e.id,o),`g:${e.id}:key`),{mono:!0,placeholder:"haurl"})}
      ${e.key.trim()===""?c`<p class="hint ha-warn">A global needs a key before it can be saved.</p>`:b}
      ${s.length>1?c`<p class="hint ha-warn">Another global has this key. Each key must be its own.</p>`:b}
      ${Dt(t,"Value",e.value,o=>t.edit(r=>Ln(r,e.id,o),`g:${e.id}:value`),`global:${e.id}`,"https://ha.local:8123")}
      <p class="hint">Type ${e.key.trim()===""?"{{key}}":`{{${e.key.trim()}}}`} in a URL, header or body. It is filled in as typed, before the values asked for on the watch.</p>
    </fieldset>`,{summary:e.key.trim()===""?"No key":`{{${e.key.trim()}}}`})}
    <div class="ha-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy}
        title=${i.length===0?"Remove this global":"Remove this global. The actions that use it send the {{key}} as typed."}
        @click=${()=>t.edit(o=>In(o,e.id))}>${w("delete")}<span>Remove</span></button>
    </div>
    <p class="ha-note">${i.length===0?"No action uses it yet.":`Used by ${i.join(", ")}.`}</p>`}function ei(t,n,e,i){let s=(r,d)=>t.edit(a=>_n(a,n.id,e.id,r),d),o=zt(e);return c`<div class="ha-var ${i?"unused":""}" data-key=${e.key}>
    <div class="ha-var-head"><code>{{${e.key}}}</code>
      ${i?c`<span class="badge">unused, left out when saved</span>
        <button type="button" class="icon ha-remove" title="Remove" aria-label=${`Remove {{${e.key}}}`}
          @click=${()=>t.edit(r=>On(r,n.id,e.id))}>${w("delete")}</button>`:b}
    </div>
    ${i?b:c`
      ${L("Prompt",e.prompt,r=>s({prompt:r},`v:${e.id}:prompt`),{placeholder:"Message"})}
      ${Ve("Kind",e.kind,[["text","Text"],["number","Number"]],r=>s({kind:r}))}
      <label class="field ha-quick"><span>Quick values</span>
        <textarea rows="3" .value=${e.presetValues.join(`
`)} placeholder="One per line"
          @input=${r=>s({presetValues:r.target.value.split(`
`)},`v:${e.id}:presets`)}></textarea></label>
      ${Nt("Only these",e.presetsOnly,r=>s({presetsOnly:r}),void 0,{disabled:o.length===0&&!e.presetsOnly})}
      <p class="hint">${o.length===0?"Quick values are offered as one tap choices on the watch. Add one to offer only these.":e.presetsOnly?"The watch shows only the quick values, with no typing.":"The watch offers the quick values and lets you type too."}</p>`}
  </div>`}function as(t,n){let e=B(t.document),i=it(n,e),s=Sn(n,e),o=i.asked.filter(r=>!n.variables.some(d=>d.key===r));return c`<p class="hint">${Xt}</p>
    ${i.global.length===0?b:c`<p class="ha-from-globals">${i.global.map(r=>c`<code>{{${r}}}</code>`)} <span>from Globals</span></p>`}
    ${i.asked.length===0&&s.length===0?c`<p class="ha-note">Nothing is asked for. The action runs at once.</p>`:b}
    ${ct(n,e).map(r=>ei(t,n,r,!1))}
    ${o.map(r=>c`<div class="ha-var" data-key=${r}><div class="ha-var-head"><code>{{${r}}}</code><span class="badge ha-need">not set up</span></div>
      <p class="hint">Sent as typed until it is set up.</p>
      <div class="ha-acts"><button type="button" class="pe-btn" @click=${()=>M(t,n.id,d=>d)}>Ask for it on the watch</button></div></div>`)}
    ${s.map(r=>ei(t,n,r,!0))}`}function ds(t,n){let e=n.id,i=n.reply,s=i?.source??"none",o=i===void 0?void 0:qt[i.source],r=o==="jsonPath"?c`${L("JSON path",i?.jsonPath??"",d=>t.edit(a=>Y(a,e,"jsonPath",d),`r:${e}:path`),{mono:!0,placeholder:"result.price"})}
      <p class="hint">Keys joined by dots, a number for an item of a list: data.0.temp. A test offers the paths it finds.</p>`:o==="headerName"?L("Header",i?.headerName??"",d=>t.edit(a=>Y(a,e,"headerName",d),`r:${e}:header`),{mono:!0,placeholder:"X-RateLimit-Remaining"}):o==="pattern"?c`${L("Pattern",i?.pattern??"",d=>t.edit(a=>Y(a,e,"pattern",d),`r:${e}:pattern`),{mono:!0,placeholder:"temperature=([0-9.]+)"})}
          <p class="hint">The first group in brackets, else the whole match.</p>`:b;return c`${Q("Read",s,ri,d=>t.edit(a=>$t(a,e,d==="none"?void 0:d)),{snapBack:!0})}
    ${r}
    ${i===void 0?c`<p class="hint">Pick what to take from the reply to show on the watch, as a tile's value or in the banner after it runs.</p>`:L("Unit",i.unit??"",d=>t.edit(a=>Y(a,e,"unit",d),`r:${e}:unit`),{placeholder:"\xB0, $, kWh"})}`}function J(t,n){return t.uiState.get(si+n)??{values:{},running:!1,run:0}}function oe(t,n,e){t.uiState.set(si+n,e),t.requestUpdate()}function cs(t,n,e){let i={};for(let s of ct(t,n)){let o=e[s.key];i[s.key]=o!==void 0?o:s.presetValues[0]??""}return i}async function ps(t,n){let e=F(t.document,n);if(e===void 0)return;let i=V(e),s=J(t,n);if(s.running)return;let o=s.run+1,r=cs(i,B(t.document),s.values);oe(t,n,{values:s.values,running:!0,run:o});let d=et(t.document),a;try{let p=await t.test(e,d,r);a={values:J(t,n).values,running:!1,reply:p,run:o}}catch(p){a={values:J(t,n).values,running:!1,error:ls(p),run:o}}J(t,n).run===o&&oe(t,n,a)}function ls(t){let n=t,e=typeof n?.code=="string"?n.code:typeof n?.error?.code=="string"?n.error.code:void 0,i=typeof n?.message=="string"?n.message:typeof n?.error?.message=="string"?n.error.message:"";return e==="unknown_command"?"This version of the integration cannot test an action. Update it to test here.":e==="invalid"?`Home Assistant could not build the request${i===""?".":`: ${i}`}`:i===""?"No answer from Home Assistant.":i}function us(t,n,e,i){let s=zt(e),o=i.values[e.key]??s[0]??"",r=a=>oe(t,n.id,{...J(t,n.id),values:{...J(t,n.id).values,[e.key]:a}}),d=e.prompt.trim()===""?e.key:e.prompt.trim();return e.presetsOnly&&s.length>0?Q(d,o,s.map(a=>[a,a]),r,{snapBack:!0}):c`<label class="field"><span>${d}</span>
    <input type="text" inputmode=${e.kind==="number"?"decimal":b} .value=${o}
      @input=${a=>r(a.target.value)} /></label>
    ${s.length===0?b:c`<div class="ha-chips" role="group" aria-label=${`Quick values for ${d}`}>
      ${s.map(a=>c`<button type="button" class="ha-chip ${a===o?"on":""}" aria-pressed=${a===o?"true":"false"} @click=${()=>r(a)}>${a}</button>`)}
    </div>`}`}function hs(t){return t.status===null?"err":t.status>=200&&t.status<300?"ok":"warn"}function fs(t,n,e){if(e.error!==void 0)return c`<p class="ha-test-err" role="status">${e.error}</p>`;let i=e.reply;if(i===void 0)return b;let s=hs(i),o=Object.keys(i.headers??{});return c`<div class="ha-result" role="status">
    <div class="ha-result-head">
      <span class="ha-status ${s}"><i class="ha-dot" aria-hidden="true"></i>${i.status===null?"No answer":`HTTP ${i.status}`}</span>
      <span class="ha-ms">${i.elapsed_ms} ms</span>
    </div>
    ${i.error?c`<p class="ha-test-err">${i.error}</p>`:b}
    ${n.reply===void 0?b:c`<div class="ha-kv"><b>Value</b>${i.value===null?c`<span class="ha-muted">Not found</span>`:c`<code>${i.value}</code>`}</div>`}
    ${i.snippet===""?b:c`<div class="ha-kv"><b>Reply</b><code class="ha-snippet">${i.snippet}</code></div>`}
    ${i.paths.length===0?b:c`<div class="ha-found">
      <b>JSON fields found</b>
      <div class="ha-chips">${i.paths.map(r=>c`<button type="button" class="ha-chip ha-path ${n.reply?.source==="jsonField"&&n.reply.jsonPath===r.path?"on":""}"
        title=${`${r.path} is ${r.value}. Read this field.`} ?disabled=${t.busy}
        @click=${()=>t.edit(d=>Pn(d,n.id,r.path))}><code>${r.path}</code><span>${r.value}</span></button>`)}</div>
    </div>`}
    ${o.length===0?b:c`<div class="ha-found">
      <b>Headers</b>
      <div class="ha-chips">${o.map(r=>c`<button type="button" class="ha-chip" title=${`Read the ${r} header`} ?disabled=${t.busy}
        @click=${()=>t.edit(d=>En(d,n.id,r))}><code>${r}</code></button>`)}</div>
    </div>`}
  </div>`}function ms(t,n){let e=J(t,n.id),i=ct(n,B(t.document)),s=q(n);return c`<p class="hint">${Bi}</p>
    ${i.map(o=>us(t,n,o,e))}
    ${Bt(n)?c`<p class="hint">A test sends no voice clip.</p>`:b}
    <div class="ha-acts">
      <button type="button" class="pe-btn pe-primary ha-send" ?disabled=${e.running||s}
        title=${s?"Add a URL first":"Send it now"} @click=${()=>{ps(t,n.id)}}>${e.running?"Sending\u2026":"Send"}</button>
    </div>
    ${fs(t,n,e)}`}function gs(t,n){let e=ct(n,B(t.document)).length,i=J(t,n.id).reply;return c`
    ${U(t,"values","Values asked for",()=>c`<fieldset class="ha-body-set" ?disabled=${t.busy}>${as(t,n)}</fieldset>`,{summary:e===0?"None":re(e,"value","values")})}
    ${U(t,"reply","Reply value",()=>c`<fieldset class="ha-body-set" ?disabled=${t.busy}>${ds(t,n)}</fieldset>`,{summary:ri.find(([s])=>s===(n.reply?.source??"none"))?.[1]??"None"})}
    ${U(t,"test","Test",()=>ms(t,n),{summary:i===void 0?"":i.status===null?"No answer":`HTTP ${i.status}`})}`}function ni(t,n){let e=es(t),i=Ge(t.uiState,e);return c`<div class="insp-head">${n}
    ${e.length===0?b:c`<button class="expand" @click=${()=>{qe(t.uiState,e,!i),t.requestUpdate()}}>${i?"Collapse all":"Expand all"}</button>`}
  </div>`}function li(t){let n=ht(t);if(n?.kind==="global"){let e=Kt(t.document,n.id),i=nt(e);return c`${ni(t,c`<div class="crumbs"><span class="kchip" style="--k:var(--wa-hue-green)">Global</span><span class="nm mono">${i.key.trim()===""?"No key":`{{${i.key.trim()}}}`}</span></div>`)}
      <div class="insp-body">${rs(t,e)}</div>`}if(n?.kind==="action"){let e=V(F(t.document,n.id));return c`${ni(t,c`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">${G(e)}</span><span class="nm" title=${W(e)}>${W(e)}</span></div>`)}
      <div class="insp-body">${os(t,e)}</div>`}return c`<div class="insp-head"><div class="crumbs"><span class="nm">HTTP actions</span></div></div>
    <div class="insp-body"><p class="ha-note">Add an action to start, or a global for a value several actions share.</p>
      <div class="ha-acts"><button type="button" class="pe-btn pe-primary" ?disabled=${t.busy} @click=${()=>Et(t)}>${w("plus")}<span>Add an action</span></button></div>
    </div>`}function ui(t){let n=ht(t);if(n?.kind==="action"){let e=V(F(t.document,n.id));return c`<div class="insp-head"><div class="crumbs"><span class="nm">When it runs</span></div></div>
      <div class="insp-body">${gs(t,e)}</div>`}return c`<div class="insp-head"><div class="crumbs"><span class="nm">${n?.kind==="global"?"Globals":"When it runs"}</span></div></div>
    <div class="insp-body"><p class="ha-note">${n?.kind==="global"?se:Xt}</p></div>`}var hi=bt`
  .ha-actions-card > .layers, .ha-globals-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .ha-actions-card > .lc-note, .ha-globals-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .layer .acts button.icon { display: inline-grid; place-items: center; padding: 0; }
  .layer .acts button.icon:disabled { opacity: .35; cursor: default; }
  .layer .thumb.ha-thumb { display: grid; place-items: center; background: color-mix(in srgb, var(--c, #888) 22%, #000); }
  .layer .thumb .ha-thumb-glyph { display: grid; place-items: center; width: 16px; height: 16px; }
  .layer .thumb .ha-thumb-glyph svg { width: 14px; height: 14px; display: block; }
  .ha-glyph-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
  .badge.ha-need { border-color: var(--wa-amber-line); color: var(--wa-amber); }
  .mono, .nm-t.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

  fieldset.ha-body-set { margin: 0; padding: 2px 0 0; border: 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; --wa-lab: 104px; }
  fieldset.ha-body-set .hint, .insp-body .hint { margin: 0 0 4px; }
  .ha-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .ha-note { margin: 10px 2px 2px; font-size: 12.5px; line-height: 1.45; color: var(--wa-muted); }
  .ha-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 0 2px; }
  .hint.ha-warn { color: var(--wa-amber); }
  .ha-muted { color: var(--wa-muted); }

  /* A secret: a password box with its own Show. */
  .ha-secret { display: flex; align-items: center; gap: 6px; min-width: 0; }
  .ha-secret > input { flex: 1; min-width: 0; }
  input[type=password] {
    font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); min-height: 28px; height: 28px;
    padding: 0 9px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-field);
  }
  input[type=password]:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .ha-secret > input[type=text] { height: 28px; min-height: 28px; padding: 0 9px; font-size: 12px; background: var(--wa-field); }
  button.ha-show {
    flex: none; height: 28px; padding: 0 9px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
    background: transparent; color: var(--wa-muted); font: inherit; font-size: 12px; cursor: pointer;
  }
  button.ha-show:hover { color: var(--wa-ink); background: var(--wa-hover); }
  button.ha-show:focus-visible { outline: none; box-shadow: var(--wa-ring); }

  .ha-headers { display: flex; flex-direction: column; gap: 6px; }
  .ha-hrow { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) auto; gap: 6px; align-items: center; }
  .ha-hrow > input[type=text] { height: 28px; min-height: 28px; padding: 0 9px; font-size: 12px; background: var(--wa-field); }
  button.icon.ha-remove {
    display: inline-grid; place-items: center; width: 28px; height: 28px; padding: 0; border-radius: 6px;
    border: 1px solid var(--wa-line); background: transparent; color: var(--wa-muted); cursor: pointer;
  }
  button.icon.ha-remove:hover { color: var(--wa-need); border-color: var(--wa-line-strong); }
  @container (max-width: 460px) {
    .ha-hrow { grid-template-columns: minmax(0, 1fr) auto; }
    .ha-hrow > .ha-secret { grid-column: 1 / -1; grid-row: 2; }
  }
  .field.ha-body, .field.ha-quick { grid-template-columns: minmax(0, 1fr); }
  .field.ha-body textarea { min-height: 120px; resize: vertical; }

  .ha-var { display: flex; flex-direction: column; gap: 2px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
  .ha-var.unused { opacity: .75; }
  .ha-var-head { display: flex; align-items: center; gap: 8px; min-height: 28px; }
  .ha-var-head code { font-size: 12.5px; }
  .ha-var-head .ha-remove { margin-left: auto; }
  .ha-from-globals { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 2px 0 6px; font-size: 12px; color: var(--wa-muted); }

  .ha-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 0; }
  button.ha-chip {
    display: inline-flex; align-items: center; gap: 6px; max-width: 100%; min-height: 26px; padding: 0 9px; border-radius: 13px;
    border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-ink); font: inherit; font-size: 12px; cursor: pointer;
  }
  button.ha-chip:hover:not(:disabled) { background: var(--wa-hover); }
  button.ha-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.ha-chip.on { border-color: var(--wa-accent); }
  button.ha-chip code { font-size: 11.5px; }
  button.ha-chip.ha-path span { color: var(--wa-muted); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .ha-result { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; padding: 10px; border: 1px solid var(--wa-line); border-radius: 8px; }
  .ha-result-head { display: flex; align-items: center; gap: 10px; }
  .ha-status { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; font-size: 13px; }
  .ha-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--wa-muted); }
  .ha-status.ok .ha-dot { background: var(--wa-green); }
  .ha-status.warn .ha-dot { background: var(--wa-amber); }
  .ha-status.err .ha-dot { background: var(--wa-need); }
  .ha-ms { font-size: 12px; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
  .ha-kv { display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 8px; align-items: baseline; font-size: 12.5px; }
  .ha-kv b, .ha-found b { font-weight: 500; color: var(--wa-muted); font-size: 12px; }
  .ha-kv code { overflow-wrap: anywhere; }
  .ha-snippet { white-space: pre-wrap; }
  .ha-found { display: flex; flex-direction: column; gap: 2px; }
  .ha-test-err { margin: 6px 0 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-need); }
`;Ye({dirty:te,drop:Zn});typeof window<"u"&&window.addEventListener("beforeunload",t=>{te()&&(t.preventDefault(),t.returnValue="")});var bs=15e3,yi=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),de=yi?"\u2318":"Ctrl+",ce={min:220,max:720,middleMin:340},pe={left:280,right:360},le="wrist-assistant-panel.http-actions.columns.v1",ys=24,fi=900;function mi(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function gi(t){let n=t?Date.parse(t):NaN;return Number.isNaN(n)?"":ve(Math.max(0,(Date.now()-n)/1e3))}function vs(t){return t instanceof HTMLElement?Ke(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function Hs(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function ue(t,n){let e=[],i=[];if(t===void 0||t.revision<=0)return{collected:e,waiting:i};for(let s of n)((t.delivered?.[s.owner_watch_id]??0)>=t.revision?e:i).push(Pe(s,n));return{collected:e,waiting:i}}function ws(t,n){if(t.updated_by==="panel")return"saved here";let e=n.find(i=>i.owner_watch_id===t.updated_by);return e===void 0?"handed over by a phone":`handed over by ${e.paired_iphone_name??e.device_name??"a phone"}`}function As(t){return t.some(n=>!n.is_orphan&&(_e(n)==="iphone"||(n.paired_iphone_name??"")!==""))}var T=class extends me{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.unsupported=!1;this.loading=!1;this.topMenuOpen=!1;this.columns={...pe};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.symbols=new Ne(()=>this.requestUpdate());this.uiState=new Map;this.reloadPending=!1;this.loadSeq=0;this.askedOnce=!1;this.onReconnect=()=>{this.isConnected&&this.load(!0)};this.onKeyDown=e=>{if(e.defaultPrevented)return;let i=e.composedPath();if(!i.includes(this)&&!Hs()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,o=e.key.toLowerCase();if(s&&!e.altKey&&o==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(!vs(i[0])){if(s&&!e.altKey&&o==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}e.ctrlKey&&!e.metaKey&&!e.altKey&&o==="y"&&(e.preventDefault(),this.redo())}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen)return;e.composedPath().some(s=>s instanceof HTMLElement&&s.classList.contains("pe-top-menu"))||(this.topMenuOpen=!1)};this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get allOwners(){return this.owners.length>0?this.owners:this.ownList??[]}get watches(){return De(this.allOwners)}get draft(){if(!(this.record===void 0||this.unsupported))return Qt()}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Ce(le,pe,ce),this.watchSize(),this.listenForReconnect(),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.stopPolling(),this.loadSeq++}willUpdate(e){this.hass&&(e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,ge(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]})),this.askedOnce||(this.askedOnce=!0,this.load())),this.followSave()}updated(){this.observeTop()}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let i of e){if(i.target!==this){this.measureTop(i.target);continue}let s=i.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&e.observe(i))}measureTop(e){let i=e.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=Qt()?.saveDone;if(e===void 0||e===this.followedSave)return;this.followedSave=e;let i=()=>this.saveEnded();e.then(i,i)}saveEnded(){this.requestUpdate(),this.isConnected&&(this.reloadPending=!1,this.load(!0))}async load(e=!1){let i=this.hass;if(!i)return;if(e&&this.saving){this.reloadPending=!0;return}let s=++this.loadSeq;this.stopPolling(),e||(this.loading=this.record===void 0,this.loadError=void 0);try{let o=await Ct(i);if(s!==this.loadSeq)return;if(this.saving){this.reloadPending=!0;return}this.unsupported=!1,this.show(o),this.loadError=void 0}catch(o){if(s!==this.loadSeq)return;Bn(o)?(this.unsupported=!0,this.loadError=void 0):(!e||this.record===void 0)&&(this.loadError=j(o).message)}this.loading=!1,this.unsupported||this.pollIfWaiting()}flushPending(){!this.reloadPending||this.saving||(this.reloadPending=!1,this.load(!0))}show(e){this.record=e;let i=e.revision>0?sn(e.document):void 0,s=Yn(i,e.revision);s.kept.length>0?this.note={kind:"warn",text:St(s.kept)}:s.mergedIntoEdits&&(this.note={kind:"warn",text:"The HTTP actions changed somewhere else. Your edits are kept."}),this.requestUpdate()}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||ue(this.record,this.watches).waiting.length===0)&&(this.pollTimer=window.setTimeout(()=>{this.pollTimer=void 0,this.load(!0)},bs))}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,i){let s=this.draft;if(!s||this.saving)return!1;let o=s.apply(e(s.document),i);return this.requestUpdate(),o}memoIcons(){let e=this.icons??je,i=this.iconMemo;if(i!==void 0&&i.provider===e&&i.tick===this.iconsTick)return i.icons;let s=Be(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}viewHost(){let e=this.draft,i=this.hass;if(e===void 0||i===void 0)return;let s=this;return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,get document(){return e.document},get busy(){return s.saving},edit:(o,r)=>this.draft===e&&this.edit(o,r),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate(),test:(o,r,d)=>ye(i,o,r,d),newId:pt}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}startLibrary(){if(this.record===void 0||this.unsupported)return;Xn();let e=this.viewHost();e!==void 0&&Et(e),this.requestUpdate()}async save(){let e=this.hass,i=this.draft;if(!e||!i||this.saving||!i.dirty)return;this.note=void 0,i.apply(Dn(i.document,i.base));let s=Wn(i,{save:(r,d)=>be(e,r,d).catch(a=>{throw bi(a)}),fetch:async()=>{let r=await Ct(e).catch(d=>{throw bi(d)});return r.document===void 0?{revision:r.revision}:{revision:r.revision,document:r.document}}});this.followedSave=i.saveDone,this.requestUpdate();let o=await s.catch(r=>{let{code:d,message:a}=j(r);return{ok:!1,revision:i.revision,merged:!1,code:d??"unknown",message:a}});this.saveEnded(),this.note=Qn(o),this.flushPending()}render(){let e=this.draft;return c`
      <div class="pe-top">
        ${this.renderTopBar(e)}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:b}
      </div>
      ${this.renderBody()}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=fi}renderTopBar(e){let i=e!==void 0,s=i&&this.dirty;return c`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="HTTP actions">
      <span class="ha-title"><b>HTTP actions</b><span class="ha-shared">${Yt}</span></span>
      <span class="spacer"></span>
      ${this.renderSyncPill()}
      ${i?c`<span class="side-menu pe-top-menu">
          <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${this.topMenuOpen?"true":"false"} aria-label="More actions" title="More"
            @click=${()=>{this.topMenuOpen=!this.topMenuOpen}}>···</button>
          ${this.topMenuOpen?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
            <button class="row" role="menuitem" ?disabled=${!s||this.saving}
              title="Go back to the copy Home Assistant holds. Undo brings the edits back."
              @click=${()=>{this.topMenuOpen=!1,this.discard()}}>Discard edits</button>
          </div>`:b}
        </span>
        <button class="cv-act icon undo" ?disabled=${!e.canUndo} title=${`Undo (${de}Z)`} aria-label="Undo" @click=${()=>this.undo()}>${w("undo")}</button>
        <button class="cv-act icon undo" ?disabled=${!e.canRedo} title=${yi?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo" @click=${()=>this.redo()}>${w("redo")}</button>
        <button class="primary save ${s?"dirty":""}" ?disabled=${!s||this.saving}
          title=${s?`Save (${de}S). A save reaches every watch the next time it checks.`:`Nothing to save (${de}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        <span class="tb-saved" title=${s?"Unsaved changes":""}>${this.savedText()}</span>`:b}
      <button class="help" title="Help: HTTP actions" aria-label="Help"
        @click=${()=>window.open(We,"_blank","noopener")}>?</button>
    </div>`}savedText(){let e=this.record;if(e===void 0||e.revision<=0)return"";let i=gi(e.updated_at);return i?`Saved ${i}`:"Saved"}renderSyncPill(){let e=this.record;if(e===void 0||e.revision<=0||this.unsupported)return b;let{collected:i,waiting:s}=ue(e,this.watches);if(i.length===0&&s.length===0)return b;let o=[s.length>0?`Waiting: ${s.join(", ")}.`:"",i.length>0?`Collected: ${i.join(", ")}.`:""].filter(r=>r!=="").join(" ");return c`<span class="tb-sync ${s.length===0?"ok":"warn"}" title=${o}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${s.length===0?Se:Oe}</span>
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=fi?this.columns:Ee(this.hostWidth-ys,this.columns,ce)}renderGutter(e){return c`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the list column":"Resize the right column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>{let s=this.fittedColumns();Re(i,{side:e,base:e==="left"?s.left:s.right,limits:ce,onWidth:o=>{this.columns={...this.columns,[e]:o}},onEnd:()=>Rt(le,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:pe[e]},Rt(le,this.columns)}}></div>`}renderBody(){if(this.unsupported)return c`<div class="pe-empty"><b>${Kn}</b></div>`;if(this.loadError!==void 0)return c`<div class="pe-empty">
        <span>Could not read the HTTP actions: ${this.loadError}</span>
        <button class="pe-btn" @click=${()=>{this.load()}}>Try again</button>
      </div>`;let e=this.record;if(this.loading||e===void 0)return c`<div class="pe-empty">Loading…</div>`;let i=this.draft,s=this.viewHost();if(i===void 0||s===void 0)return c`<div class="pe-empty ha-empty"><b>${Un}</b>
        <span>An HTTP action is a web request a watch asks Home Assistant to send. ${Yt}</span>
        <span class="ha-start"><button class="pe-btn pe-primary" @click=${()=>this.startLibrary()}>${w("plus")}<span>${Mn}</span></button></span>
        ${As(this.allOwners)?c`<span class="pe-muted">${jn}</span>`:b}
      </div>`;let o=this.fittedColumns(),r=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",d=I(i.document).filter(a=>a.presentsClientCertificate===!0).length;return c`${d===0?b:c`<p class="ha-cert-line">${d===1?"An action asks":`${d} actions ask`} for a client certificate. ${_t}</p>`}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${o.left}px;--wa-right:${o.right}px;${r}`}>
      <div class="column left">
        ${ci(s)}
        ${pi(s)}
      </div>
      ${this.renderGutter("left")}
      <div class="column inspector card ha-middle">
        ${li(s)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card ha-right">
        ${ui(s)}
      </div>
    </div>
    ${this.renderFoot(e,i)}`}renderFoot(e,i){let s=At(i.document),o=gi(e.updated_at),r=e.revision<=0?"Not saved yet. The first save makes the library.":`Revision ${e.revision} \xB7 ${ws(e,this.allOwners)}${o?` ${o}`:""}`,{waiting:d}=ue(e,this.watches);return c`<div class="ha-foot" role="status">
      <i class="ha-foot-dot ${e.revision<=0?"":d.length===0?"ok":"warn"}" aria-hidden="true"></i>
      <span>${r}</span>
      ${d.length===0?b:c`<span class="pe-muted">Waiting for ${d.join(", ")}.</span>`}
      <span class="spacer"></span>
      <span class="pe-muted ${s.near?"ha-near":""}">${mi(s.size)} of ${mi(s.limit)}</span>
    </div>`}static{this.styles=[Le,He,we,Ae,xe,ke,Te,bt`
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
    .pe-empty {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 560px;
      padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .ha-start { display: flex; flex-wrap: wrap; gap: 8px; }
    .ha-cert-line {
      flex: none; margin: 0 0 10px; padding: 8px 12px; font-size: 13px;
      border: 1px solid var(--wa-amber-line); border-radius: var(--wa-r-md, 12px);
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
    @container (max-width: 900px) {
      .layout.pe-layout { grid-template-columns: minmax(0, 1fr); }
      .pe-layout > .gutter { display: none; }
      .pe-layout > .column { grid-column: auto; position: static; max-height: none; overflow: visible; }
    }
    /* Stacked, the lists come first: pick an action, then edit it. */
    .layout.pe-layout.cols-1 > .column.left { order: 1; }
    .layout.pe-layout.cols-1 > .column.ha-middle { order: 2; }
    .layout.pe-layout.cols-1 > .column.ha-right { order: 3; }
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
    .ha-foot-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--wa-muted); flex: none; }
    .ha-foot-dot.ok { background: var(--wa-green); }
    .ha-foot-dot.warn { background: var(--wa-amber); }
    .ha-near { color: var(--wa-amber); }
    :host([narrow]) { --cf-pad: 12px; }
  `,hi]}};$([Z({attribute:!1})],T.prototype,"hass",2),$([Z({attribute:!1})],T.prototype,"owners",2),$([Z({type:Boolean,reflect:!0})],T.prototype,"narrow",2),$([Z({attribute:!1})],T.prototype,"icons",2),$([Z({attribute:!1})],T.prototype,"iconsTick",2),$([R()],T.prototype,"record",2),$([R()],T.prototype,"unsupported",2),$([R()],T.prototype,"loading",2),$([R()],T.prototype,"loadError",2),$([R()],T.prototype,"note",2),$([R()],T.prototype,"ownList",2),$([R()],T.prototype,"topMenuOpen",2),$([R()],T.prototype,"columns",2),$([R()],T.prototype,"hostWidth",2),$([R()],T.prototype,"hostHeight",2);function bi(t){let{code:n,message:e}=j(t);return Object.assign(new Error(e),n===void 0?{}:{code:n})}customElements.get("wa-http-actions-editor")||customElements.define("wa-http-actions-editor",T);export{le as HA_COLUMNS_KEY,T as WaHttpActionsEditor,As as homeHasPhone,ue as httpActionsDelivery,ws as httpActionsSavedBy};
