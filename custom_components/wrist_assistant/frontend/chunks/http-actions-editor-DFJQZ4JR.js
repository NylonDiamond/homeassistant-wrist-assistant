import{a as _e,d as Se,e as Dt,f as Oe,h as P,i as Ue}from"./chunk-7JMKOI2L.js";import{a as Ne,b as Ie,d as Me,n as m}from"./chunk-ZIEG52KN.js";import{Ac as ve,Bc as xe,Cc as ye,Ce as Pe,Ec as we,Jc as He,Ob as Et,Pb as he,Qb as fe,Qc as I,Uf as Ee,a as O,ad as Ae,bd as Te,bg as U,c as ft,cg as De,d as l,dg as Rt,eg as Re,fd as ke,g as f,gd as $e,hh as Ve,i as ce,ig as Ce,ih as je,j as J,jc as me,k as C,rg as Le,tc as T,ub as ue,xc as be,zc as ge}from"./chunk-F5DPM3RG.js";var $="actions",D="globalVariables",bi=1,Ke=256*1024,nt=["GET","POST","PUT","PATCH","DELETE"],Je=["POST","PUT","PATCH","DELETE"],Lt=["none","json","form","text","audio"],Nt=["statusCode","bodyText","jsonField","header","regex"],Fe=["text","number"],It=10,Mt=1,Ut=60,ze=/^[A-Za-z0-9_]+$/,gi=/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g;function Vt(){return{[$]:[],[D]:[],schemaVersion:bi}}function Ge(t){return m(t)?t:void 0}function vi(t){return new TextEncoder().encode(JSON.stringify(t)).length}function gt(t){let n=vi(t);return{size:n,limit:Ke,near:n/Ke>.8}}function E(t,n){let e=t!==void 0&&Object.hasOwn(t,n)?t[n]:void 0;return Array.isArray(e)?e:[]}function L(t){return E(t,$).filter(m)}function it(t){return E(t,D).filter(m)}function G(t,n){return L(t).find(e=>e.id===n)}function A(t){return typeof t=="string"?t:void 0}function et(t,n){return typeof t=="string"&&n.includes(t)?t:void 0}function Ye(t){let n=m(t)?t:{};return{id:A(n.id)??"",name:A(n.name)??"",value:A(n.value)??""}}function mt(t){let n=m(t)?t:{},e=Array.isArray(n.presetValues)?n.presetValues.filter(i=>typeof i=="string"):[];return{id:A(n.id)??"",key:A(n.key)??"",prompt:A(n.prompt)??"",kind:et(n.kind,Fe)??"text",presetValues:e,presetsOnly:n.presetsOnly===!0}}function jt(t){let n=m(t)?t:{};return{id:A(n.id)??"",key:A(n.key)??"",value:A(n.value)??""}}function xi(t){if(!m(t))return;let n=et(t.source,Nt);if(n===void 0)return;let e={source:n};for(let i of["jsonPath","headerName","pattern","unit"]){let o=A(t[i]);o!==void 0&&(e[i]=o)}return e}function M(t){let n=typeof t.timeout=="number"&&Number.isFinite(t.timeout)?t.timeout:void 0,e={id:A(t.id)??"",name:A(t.name)??"",method:A(t.method)??"POST",url:A(t.url)??"",headers:Array.isArray(t.headers)?t.headers.map(Ye):[],bodyContentType:et(t.bodyContentType,Lt)??"none",variables:Array.isArray(t.variables)?t.variables.map(mt):[],allowsUntrustedCertificate:t.allowsUntrustedCertificate===!0,presentsClientCertificate:t.presentsClientCertificate===!0},i=A(t.body);i!==void 0&&(e.body=i),n!==void 0&&(e.timeout=n);let o=xi(t.responseConfig);o!==void 0&&(e.reply=o);let a=A(t.icon),s=A(t.iconColor);return a!==void 0&&(e.icon=a),s!==void 0&&(e.iconColor=s),e}function Y(t){return t.method.trim().toUpperCase()}function ot(t){return Je.includes(Y(t))}function Kt(t){return t.bodyContentType==="audio"&&ot(t)}function st(t){return t.url.trim()===""}function vt(t){let n=t.name.trim();if(n!=="")return n;let e=t.url.trim();return e!==""?e:"Untitled action"}function Ct(t){let n=t.replaceAll("_"," ").replaceAll("-"," ");return n.trim()===""?"Value":n.split(" ").filter(e=>e!=="").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}function yi(t){return t.replace(/[^A-Za-z0-9_]/g,"")}function zt(t){let n=new Set,e=[];for(let i of t.presetValues){let o=i.trim();o===""||n.has(o)||(n.add(o),e.push(o))}return e}function We(t){let n=new Set,e=[];for(let i of t)for(let o of i.matchAll(gi)){let a=o[1];n.has(a)||(n.add(a),e.push(a))}return e}function j(t){let n=new Set;for(let e of it(t)){let i=jt(e).key.trim();i!==""&&n.add(i)}return n}function Xe(t){let n=[t.url];for(let e of t.headers)n.push(e.name),$i(e)||n.push(e.value);return ot(t)&&t.bodyContentType!=="audio"&&t.body!==void 0&&n.push(t.body),n}function W(t,n){let e=We(Xe(t));return{global:e.filter(i=>n.has(i)),asked:e.filter(i=>!n.has(i))}}function at(t,n){let{asked:e}=W(t,n);return e.map(i=>t.variables.find(o=>o.key===i)).filter(i=>i!==void 0)}function tt(t,n,e){n==="__proto__"?Object.defineProperty(t,n,{value:e,enumerable:!0,writable:!0,configurable:!0}):t[n]=e}function g(t,n,e){if(Object.hasOwn(t,n)){if(P(t[n],e)&&typeof t[n]==typeof e)return t;let a={};for(let s of Object.keys(t))tt(a,s,s===n?e:t[s]);return a}let i={},o=!1;for(let a of Object.keys(t))!o&&a>n&&(tt(i,n,e),o=!0),tt(i,a,t[a]);return o||tt(i,n,e),i}function bt(t,n){if(!Object.hasOwn(t,n))return t;let e={};for(let i of Object.keys(t))i!==n&&tt(e,i,t[i]);return e}function X(t,n,e){return e===void 0?bt(t,n):g(t,n,e)}function xt(t,n,e){let i=t.findIndex(r=>m(r)&&r.id===n);if(i<0)return t;let o=t[i],a=e(o);if(a===o)return t;let s=t.slice();return s[i]=a,s}function K(t,n,e){return e===t[n]?t:g(t,n,e)}function w(t,n,e){let i=E(t,$),o=xt(i,n,e);return o===i?t:K(t,$,o)}function Ze(t,n,e){let i=E(t,D),o=xt(i,n,e);return o===i?t:K(t,D,o)}function rt(){let t=globalThis.crypto;if(t!==void 0&&typeof t.randomUUID=="function")return t.randomUUID().toUpperCase();let n=e=>Array.from({length:e},()=>Math.floor(Math.random()*16).toString(16)).join("");return`${n(8)}-${n(4)}-4${n(3)}-${(8+Math.floor(Math.random()*4)).toString(16)}${n(3)}-${n(12)}`.toUpperCase()}function Qe(t,n){return{bodyContentType:"none",headers:[],id:t,method:"POST",name:n,url:"",variables:[]}}function tn(t,n="New action"){let e=new Set(L(t).map(i=>M(i).name.trim().toLowerCase()));if(!e.has(n.toLowerCase()))return n;for(let i=2;;i++)if(!e.has(`${n} ${i}`.toLowerCase()))return`${n} ${i}`}function en(t,n){return K(t,$,[...E(t,$),n])}function nn(t,n,e=rt){let i=E(t,$),o=i.findIndex(u=>m(u)&&u.id===n);if(o<0)return{document:t};let a=i[o],s=e(),r=g(a,"id",s);r=g(r,"name",`${vt(M(a))} Copy`);let d=u=>Array.isArray(u)?u.map(c=>m(c)?g(c,"id",e()):c):u;Array.isArray(a.headers)&&(r=g(r,"headers",d(a.headers))),Array.isArray(a.variables)&&(r=g(r,"variables",d(a.variables)));let p=i.slice();return p.splice(o+1,0,r),{document:K(t,$,p),id:s}}function on(t,n){let e=E(t,$),i=e.filter(o=>!(m(o)&&o.id===n));return i.length===e.length?t:K(t,$,i)}function qt(t,n,e){let i=E(t,$),o=i.findIndex(d=>m(d)&&d.id===n);if(o<0)return t;let a=Math.max(0,Math.min(e,i.length-1));if(o===a)return t;let s=i.slice(),[r]=s.splice(o,1);return s.splice(a,0,r),K(t,$,s)}function sn(t,n,e){return w(t,n,i=>g(i,"name",e))}function an(t,n,e){let i=e.trim();return w(t,n,o=>X(o,"icon",i===""?void 0:i))}function rn(t,n,e){return e!==void 0&&!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e)?t:w(t,n,i=>X(i,"iconColor",e?.toUpperCase()))}function dn(t,n,e){let i=e.trim().toUpperCase();return nt.includes(i)?w(t,n,o=>{let a=g(o,"method",i);return!Je.includes(i)&&a.bodyContentType==="audio"&&(a=g(a,"bodyContentType","none")),a}):t}function ln(t,n,e){return w(t,n,i=>g(i,"url",e))}function pn(t,n,e){return Lt.includes(e)?w(t,n,i=>{let o=g(i,"bodyContentType",e);return e==="audio"?bt(o,"body"):o}):t}function cn(t,n,e){return w(t,n,i=>X(i,"body",e.trim()===""?void 0:e))}function un(t,n,e){return e!==void 0&&(!Number.isFinite(e)||e<=0)?t:w(t,n,i=>X(i,"timeout",e))}function hn(t,n,e){return w(t,n,i=>X(i,"allowsUntrustedCertificate",e?!0:void 0))}function F(t){return E(t,"headers")}function fn(t,n,e){return w(t,n,i=>g(i,"headers",[...F(i),{id:e,name:"",value:""}]))}function yt(t,n,e,i){return w(t,n,o=>{let a=F(o),s=xt(a,e,r=>{let d=r;return i.name!==void 0&&(d=g(d,"name",i.name)),i.value!==void 0&&(d=g(d,"value",i.value)),d});return s===a?o:g(o,"headers",s)})}function Bt(t,n,e){return w(t,n,i=>{let o=F(i),a=o.filter(s=>!(m(s)&&s.id===e));return a.length===o.length?i:g(i,"headers",a)})}var mn=[["none","None"],["bearer","Bearer token"],["basic","Username and password"],["apiKey","API key header"]],wi="X-Api-Key",qe="A07A0000-0000-0000-0000-0000000A0140",Hi=new Set(["x-api-key","api-key","apikey","x-api-token","x-auth-token","x-access-token"]);function V(t="none"){return{kind:t,token:"",username:"",password:"",headerName:wi,apiKeyValue:""}}function Ai(t){let n=new TextEncoder().encode(t),e="";for(let i of n)e+=String.fromCharCode(i);return btoa(e)}function Ti(t){if(!(!/^[A-Za-z0-9+/]*={0,2}$/.test(t)||t.length%4!==0))try{let n=atob(t),e=Uint8Array.from(n,i=>i.charCodeAt(0));return new TextDecoder("utf-8",{fatal:!0}).decode(e)}catch{return}}function ki(t){switch(t.kind){case"bearer":{let n=t.token.trim();return n===""?void 0:{name:"Authorization",value:`Bearer ${n}`}}case"basic":return t.username===""&&t.password===""?void 0:{name:"Authorization",value:`Basic ${Ai(`${t.username}:${t.password}`)}`};case"apiKey":{let n=t.headerName.trim(),e=t.apiKeyValue.trim();return n===""||e===""?void 0:{name:n,value:e}}default:return}}function wt(t){let n=t.name.trim(),e=t.value.trim();if(n.toLowerCase()==="authorization"){if(e.length>7&&e.slice(0,7).toLowerCase()==="bearer ")return{...V("bearer"),token:e.slice(7).trim()};if(e.length>6&&e.slice(0,6).toLowerCase()==="basic "){let i=Ti(e.slice(6).trim()),o=i?.indexOf(":")??-1;return i===void 0||o<0?void 0:{...V("basic"),username:i.slice(0,o),password:i.slice(o+1)}}return}if(Hi.has(n.toLowerCase()))return e===""?void 0:{...V("apiKey"),headerName:n,apiKeyValue:e}}function $i(t){return wt(t)?.kind==="basic"}function bn(t){for(let n of t){let e=wt(n);if(e!==void 0)return{auth:e,headerId:n.id}}return{auth:V()}}function gn(t,n,e,i){let o=ki(i),a=G(t,n);if(a===void 0)return{document:t};let s=F(a);if((e===void 0?-1:s.findIndex(c=>m(c)&&c.id===e))>=0)return o===void 0?{document:Bt(t,n,e)}:{document:yt(t,n,e,o),headerId:e};if(o===void 0)return{document:t};let p=s.some(c=>m(c)&&c.id===qe)?rt():qe,u={id:p,name:o.name,value:o.value};return{document:w(t,n,c=>g(c,"headers",[u,...F(c)])),headerId:p}}function Be(t,n){return{id:t,key:n,kind:"text",presetValues:[],presetsOnly:!1,prompt:Ct(n)}}function vn(t,n,e=rt){let i=G(t,n);if(i===void 0)return t;let o=M(i),a=W(o,j(t)).asked,s=E(i,"variables"),r=c=>mt(c).key,d=a.filter(c=>!s.some(b=>r(b)===c));if(d.length===0)return t;let p=s.map((c,b)=>[c,b]).filter(([c])=>!a.includes(r(c))),u;if(d.length===1&&p.length===1){let[c,b]=p[0],v=r(c),_=m(c)?g(c,"key",d[0]):Be(e(),d[0]),x=mt(c).prompt;m(c)&&(x===""||x===Ct(v))&&(_=g(_,"prompt",Ct(d[0]))),u=s.slice(),u[b]=_}else u=[...s,...d.map(c=>Be(e(),c))];return w(t,n,c=>g(c,"variables",u))}function xn(t,n,e,i){return w(t,n,o=>{let a=E(o,"variables"),s=xt(a,e,r=>{let d=r;return i.prompt!==void 0&&(d=g(d,"prompt",i.prompt)),i.kind!==void 0&&Fe.includes(i.kind)&&(d=g(d,"kind",i.kind)),i.presetValues!==void 0&&(d=g(d,"presetValues",i.presetValues)),i.presetsOnly!==void 0&&(d=g(d,"presetsOnly",i.presetsOnly)),d});return s===a?o:g(o,"variables",s)})}function yn(t,n,e){return w(t,n,i=>{let o=E(i,"variables"),a=o.filter(s=>!(m(s)&&s.id===e));return a.length===o.length?i:g(i,"variables",a)})}function wn(t,n){let e=new Set(W(t,n).asked);return t.variables.filter(i=>!e.has(i.key))}function Hn(t,n){let e=j(t),i=new Map(L(n).map(a=>[a.id,a])),o=t;for(let a of L(t)){let s=A(a.id);if(s===void 0)continue;let r=i.get(s);r!==void 0&&P(r,a)||(o=w(o,s,d=>{let p=d,u=F(d),c=u.filter(x=>!m(x)||Ye(x).name.trim()!=="");c.length!==u.length&&(p=g(p,"headers",c));let b=M(p),v=E(p,"variables"),_=W(b,e).asked.map(x=>v.find(H=>mt(H).key===x)).filter(x=>x!==void 0).map(x=>{if(!m(x)||!Array.isArray(x.presetValues))return x;let H=x.presetValues.map(R=>typeof R=="string"?R.trim():R).filter(R=>R!=="");return P(H,x.presetValues)&&H.length===x.presetValues.length?x:g(x,"presetValues",H)});return(_.length!==v.length||_.some((x,H)=>x!==v[H]))&&(p=g(p,"variables",_)),p}))}return o}var Jt={statusCode:void 0,bodyText:void 0,jsonField:"jsonPath",header:"headerName",regex:"pattern"};function Ht(t,n,e){return w(t,n,i=>{if(e===void 0)return bt(i,"responseConfig");if(!Nt.includes(e))return i;let o=m(i.responseConfig)?i.responseConfig:{},a=g(o,"source",e);for(let s of["jsonPath","headerName","pattern"])Jt[e]!==s&&(a=bt(a,s));return g(i,"responseConfig",a)})}function q(t,n,e,i){return w(t,n,o=>{if(!m(o.responseConfig))return o;let a=e==="unit"?i:i.trim();return g(o,"responseConfig",X(o.responseConfig,e,a===""?void 0:a))})}function An(t,n,e){return q(Ht(t,n,"jsonField"),n,"jsonPath",e)}function Tn(t,n,e){return q(Ht(t,n,"header"),n,"headerName",e)}function kn(t,n="value"){let e=j(t);if(!e.has(n))return n;for(let i=2;;i++)if(!e.has(`${n}_${i}`))return`${n}_${i}`}function $n(t,n,e){return K(t,D,[...E(t,D),{id:n,key:e,value:""}])}function _n(t,n,e){return Ze(t,n,i=>g(i,"key",yi(e)))}function Sn(t,n,e){return Ze(t,n,i=>g(i,"value",e))}function On(t,n){let e=E(t,D),i=e.filter(o=>!(m(o)&&o.id===n));return i.length===e.length?t:K(t,D,i)}function Pn(t,n){return n===""?[]:L(t).map(M).filter(e=>We(Xe(e)).includes(n)).map(vt)}function En(t){if(!m(t))return["The library is not an object."];let n=[],e=Object.hasOwn(t,$)?t[$]:void 0,i=Object.hasOwn(t,D)?t[D]:void 0;Array.isArray(e)||n.push("The action list is missing."),i!==void 0&&!Array.isArray(i)&&n.push("The globals are not a list.");let o=new Set;(Array.isArray(e)?e:[]).forEach((s,r)=>{if(!m(s)){n.push(`Action ${r+1} is not an object.`);return}let d=typeof s.name=="string"&&s.name.trim()!==""?`"${s.name.trim()}"`:`Action ${r+1}`,p=s.id;typeof p!="string"||p===""?n.push(`${d} has no id.`):o.has(p)?n.push(`${d} has the id of another action.`):o.add(p);for(let b of["name","method","url"])Object.hasOwn(s,b)&&typeof s[b]!="string"&&n.push(`${d} has a ${b} that is not text.`);for(let b of["body","icon","iconColor"])Object.hasOwn(s,b)&&s[b]!==null&&typeof s[b]!="string"&&n.push(`${d} has a ${b} that is not text.`);typeof s.method=="string"&&!nt.includes(s.method.trim().toUpperCase())&&n.push(`${d} uses ${s.method}, which is not GET, POST, PUT, PATCH or DELETE.`),Object.hasOwn(s,"bodyContentType")&&et(s.bodyContentType,Lt)===void 0&&n.push(`${d} has a body type Home Assistant does not know.`),Object.hasOwn(s,"timeout")&&s.timeout!==null&&(typeof s.timeout!="number"||!Number.isFinite(s.timeout))&&n.push(`${d} has a timeout that is not a number.`),m(s.responseConfig)&&et(s.responseConfig.source,Nt)===void 0&&n.push(`${d} reads its reply value from a source Home Assistant does not know.`);let u=s.headers;Object.hasOwn(s,"headers")&&!Array.isArray(u)&&n.push(`${d} has headers that are not a list.`);for(let b of Array.isArray(u)?u:[])if(!m(b)||Object.hasOwn(b,"name")&&typeof b.name!="string"||Object.hasOwn(b,"value")&&typeof b.value!="string"){n.push(`${d} has a header that is not text.`);break}let c=s.variables;Object.hasOwn(s,"variables")&&!Array.isArray(c)&&n.push(`${d} has values to ask for that are not a list.`);for(let b of Array.isArray(c)?c:[]){let v=m(b)?b.key:void 0;if(typeof v!="string"||!ze.test(v)){n.push(`${d} asks for a value whose key is not letters, digits and underscores.`);break}}});let a=new Set;return(Array.isArray(i)?i:[]).forEach((s,r)=>{let d=m(s)&&typeof s.key=="string"?s.key.trim():"";if(!m(s)||Object.hasOwn(s,"value")&&typeof s.value!="string"){n.push(`Global ${r+1} is not text.`);return}d===""?n.push(`Global ${r+1} has no name.`):ze.test(d)?a.has(d)?n.push(`Two globals are named {{${d}}}.`):a.add(d):n.push(`The global {{${d}}} has a name that is not letters, digits and underscores.`)}),n}var Ft="Shared by every watch.",At="No HTTP actions yet.",Tt="Add an action",Dn="Turning on Edit pages in Home Assistant in the iPhone app brings the phone's actions here.",Rn="Update the integration to edit HTTP actions here.",kt="Home Assistant does not send a client certificate.",Cn="Type {{key}} in the URL, a header or the body. A key that names a global is filled in from Globals. Any other key is asked for on the watch when the action runs. Keys are letters, digits and underscores.";function Ln(t){return I(t).code==="unknown_command"}var Nn={list:"action",field:$,keyOf:t=>typeof t.id=="string"&&t.id!==""?t.id:void 0,nameOf:t=>typeof t.name=="string"?t.name.trim():""},In={list:"global",field:D,keyOf:t=>typeof t.key=="string"&&t.key.trim()!==""?t.key.trim():void 0,nameOf:t=>typeof t.key=="string"?`{{${t.key.trim()}}}`:""};function Z(t,n){return t!=null&&Object.hasOwn(t,n)?t[n]:void 0}function dt(t,n){if(!Array.isArray(t))return;let e=new Set,i=[];for(let o of t){if(!m(o))return;let a=n.keyOf(o);if(a===void 0||e.has(a))return;e.add(a),i.push([a,o])}return i}function _i(t,n,e){let i=dt(t,e),o=dt(n,e);if(i===void 0||o===void 0)return t;let a=new Set(o.map(([s])=>s));return i.filter(([s])=>a.has(s)).map(([,s])=>s)}function Si(t,n,e,i){let o=t===null?void 0:t,a=n===null?void 0:n,s=e===null?void 0:e,r=o===void 0?[]:dt(o,i),d=a===void 0?void 0:dt(a,i),p=s===void 0?void 0:dt(s,i);if(r===void 0||d===void 0||p===void 0)return{value:P(a,o)?s:a,clashes:[]};let u=new Map(r),c=new Map(d),b=new Map(p),v=[],_=(h,y)=>{let S=u.get(h);return S===void 0||!P(y,S)},x=(h,y,S)=>_(h,y)?(_(h,S)&&!P(y,S)&&v.push({list:i.list,key:h,name:i.nameOf(y)||i.nameOf(S)}),y):S,H=(h,y)=>u.has(h)&&!_(h,y)?void 0:y,R=d.map(([h])=>h).filter(h=>u.has(h)),le=r.map(([h])=>h).filter(h=>c.has(h)),mi=R.length!==le.length||R.some((h,y)=>h!==le[y]),ut=[],ht=h=>{h!==void 0&&ut.push(h)};if(mi){for(let[h,y]of d){let S=b.get(h);ht(S!==void 0?x(h,y,S):H(h,y))}for(let[h,y]of p)c.has(h)||ht(H(h,y))}else{for(let[h,y]of p){let S=c.get(h);ht(S!==void 0?x(h,S,y):H(h,y))}for(let[h,y]of d)b.has(h)||ht(H(h,y))}let pe=h=>Array.isArray(h)&&h.length===ut.length&&ut.every((y,S)=>y===h[S]);return pe(s)?{value:s,clashes:v}:pe(a)?{value:a,clashes:v}:{value:ut,clashes:v}}function Oi(t,n,e,i){return t==null?_i(Z(e,i.field),Z(n,i.field),i):Z(t,i.field)}function Gt(t,n,e,i){return Si(Oi(t,n,e,i),Z(n,i.field),Z(e,i.field),i)}function Mn(t,n,e){return[...Gt(t,n,e,Nn).clashes,...Gt(t,n,e,In).clashes]}function Un(t,n,e){let i=Ue(t,n,e);for(let o of[Nn,In]){let a=Gt(t,n,e,o).value,s=Z(i,o.field);if(a!==s){if(a===void 0){if(!Object.hasOwn(i,o.field))continue;let{[o.field]:r,...d}=i;i=d;continue}(i===e||i===n)&&(i={...i}),i[o.field]=a}}return i}var Vn=100,Pi=3,$t=class{constructor(n,e){this._undo=[];this._redo=[];this._kept=[];this._base=n,this._revision=e,this._document=n}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get kept(){return this._kept}get dirty(){let n=this._dirty;if(n!==void 0&&n.document===this._document&&n.base===this._base)return n.value;let e=this._document!==this._base&&!P(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(n,e){if(n===this._document||P(n,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let i=this._undo[this._undo.length-1];return P(n,i)?(this._undo.pop(),this._document=i,this._coalesceKey=void 0):this._document=n,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=n,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let n=this._undo.pop();return n===void 0?!1:(this._redo.push(this._document),this._document=n,!0)}redo(){this._coalesceKey=void 0;let n=this._redo.pop();return n===void 0?!1:(this.pushUndo(this._document),this._document=n,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(n,e){return e<this._revision?(this._kept=[],!1):this.mergeOnto(n,e)}restart(n,e){return this.mergeOnto(n,e)}mergeOnto(n,e){this._coalesceKey=void 0;let i=this._base;this._kept=this._document===i?[]:Mn(i,this._document,n);let o=new Map,a=c=>{let b=o.get(c);if(b!==void 0)return b;let v=c===i?n:Un(i,c,n);return v!==n&&P(v,n)&&(v=n),o.set(c,v),v},s=this._document,r=[...this._undo,this._document,...this._redo.slice().reverse()].map(a),d=this._undo.length,p=[],u=0;return r.forEach((c,b)=>{let v=p[p.length-1];v!==void 0&&(v===c||P(v,c))?b===d&&(p[p.length-1]=c):p.push(c),b===d&&(u=p.length-1)}),this._undo=p.slice(0,u),this._document=p[u],this._redo=p.slice(u+1).reverse(),this._base=n,this._revision=e,this._document!==s&&!P(this._document,s)}saved(n,e){e<this._revision||(this._coalesceKey=void 0,this._base=n,this._revision=e)}get saving(){return lt.has(this)}get saveDone(){return lt.get(this)}pushUndo(n){this._undo.push(n),this._undo.length>Vn&&this._undo.splice(0,this._undo.length-Vn)}},lt=new WeakMap;function jn(t,n){if(lt.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"The HTTP actions are being saved already."});let e=Di(t,n).finally(()=>lt.delete(t));return lt.set(t,e),e}function Ei(t){let n=gt(t);return n.size<=n.limit?[]:[`The library is ${Math.ceil(n.size/1024)} KB, past the ${n.limit/1024} KB Home Assistant keeps.`]}async function Di(t,n){let e=!1,i=new Map,o=()=>i.size===0?{}:{kept:[...i.values()]},a=(s,r,d)=>({ok:!1,revision:t.revision,merged:e,code:s,message:r,...o(),...d===void 0?{}:{problems:d}});for(let s=1;;s++){let r=t.document,d=[...En(r),...Ei(r)];if(d.length>0)return a("invalid",d.join(" "),d);let p;try{({revision:p}=await n.save(t.revision,r))}catch(u){let{code:c="unknown",message:b}=I(u);if(c!=="conflict"||s>=Pi)return a(c,b);let v;try{v=await n.fetch()}catch(H){let R=I(H);return a(R.code??"unknown",R.message)}let _=m(v)&&typeof v.revision=="number"?v.revision:0,x=m(v)&&m(v.document)?v.document:Vt();_<t.revision?t.restart(x,_):t.rebase(x,_);for(let H of t.kept)i.set(`${H.list}:${H.key}`,H);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0,...o()};continue}return t.saved(r,p),{ok:!0,revision:t.revision,merged:e,...o()}}}var B;function Yt(){return B}function Kn(t,n){let e=B;if(n<=0||t===void 0)return{...e===void 0?{}:{draft:e},mergedIntoEdits:!1,kept:[]};if(e===void 0||n<e.revision&&!e.dirty){let a=new $t(t,n);return B=a,{draft:a,mergedIntoEdits:!1,kept:[]}}if(n===e.revision)return{draft:e,mergedIntoEdits:!1,kept:[]};let i=e.dirty,o=n<e.revision?e.restart(t,n):e.rebase(t,n);return{draft:e,mergedIntoEdits:i&&o,kept:i?e.kept:[]}}function zn(){return B??=new $t(Vt(),0),B}function Wt(){return B?.dirty??!1}function qn(){B=void 0}function Ri(t){return t.list==="global"?t.name.trim()===""?`{{${t.key}}}`:t.name:`"${t.name.trim()===""?"an untitled action":t.name}"`}function _t(t){if(t.length===0)return"";let n=t.map(Ri);return`${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`} also changed somewhere else. ${n.length===1?"Your version was kept.":"Your versions were kept."}`}function Bn(t){if(t.ok){let e=t.kept??[];if(t.alreadySaved===!0){let i=e.length>0?` ${_t(e)}`:"";return{kind:e.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.${i}`}}return e.length>0?{kind:"warn",text:`Saved. ${_t(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The HTTP actions kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the HTTP actions${n===""?".":`: ${n}`}`}}case"busy":return{kind:"warn",text:"Already saving. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the HTTP actions just now. Your edits are kept, so try again in a moment."};case"unknown_command":return{kind:"err",text:"Not saved. Update the integration to edit HTTP actions here."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}var Qt="ha:sel",Gn="ha:tab",Yn="ha:rtab",te="ha:show:",Wn="ha:auth:",Xn="ha:test:",Q="ha:look",ee="network",Ci="#CCD8E6",Li="Web requests Home Assistant sends when a watch runs one, from a tile, a menu, a complication or a control. A save reaches every watch the next time it checks.",Zn="Fixed values any action can use as {{key}}, such as a server address or a token. Change one here and every action that uses it follows.",Ni="The watch records a voice clip of up to 30 seconds when the action runs and sends it as the body, as audio/mp4. Nothing to type here.",Ii="This method sends no body. Pick POST, PUT, PATCH or DELETE to send one.",Mi=`Empty means ${It} seconds. Home Assistant holds it between ${Mt} and ${Ut}.`,Ui="Only for a server you run whose HTTPS certificate is not publicly trusted.",Qn="With no URL the watch shows the action as needing setup.",Vi="Press Send to try this action. Home Assistant sends it. Nothing is saved.",ji="Each {{key}} that is not a global is asked for on the watch when the action runs. Keys are letters, digits and underscores.",Ki=[["none","None"],["json","JSON"],["form","Form"],["text","Text"],["audio","Voice clip"]],zi={none:void 0,json:"application/json",form:"application/x-www-form-urlencoded",text:"text/plain",audio:"audio/mp4"},qi={none:"Request body",json:'{"key": "value"}',form:"key=value&other=123",text:"Plain text",audio:""},Bi=[["none","None"],["statusCode","Status code"],["bodyText","Body text"],["jsonField","JSON field"],["header","Header"],["regex","Regex"]];function Ji(t,n,e){return`${t} ${t===1?n:e}`}function Fi(t){if(st(t))return`${Y(t)} \xB7 no URL yet`;let n=t.url.trim().replace(/^https?:\/\//i,"");return`${Y(t)} \xB7 ${n}`}function ti(t){let n=t.trim().toUpperCase();switch(n){case"GET":return{text:"GET",tone:"get"};case"POST":return{text:"POST",tone:"post"};case"PUT":return{text:"PUT",tone:"put"};case"PATCH":return{text:"PATCH",tone:"patch"};case"DELETE":return{text:"DEL",tone:"del"};default:return{text:n===""?"?":n.slice(0,5),tone:"other"}}}function Gi(t){let n=ti(t);return l`<span class="ha-mtag m-${n.tone}" title=${t.trim().toUpperCase()}>${n.text}</span>`}function ei(t){let n=t.uiState.get(Qt);if(n?.kind==="action"&&G(t.document,n.id)!==void 0||n?.kind==="globals")return n;let e=L(t.document)[0];return typeof e?.id=="string"?{kind:"action",id:e.id}:void 0}function pt(t,n){n===void 0?t.uiState.delete(Qt):t.uiState.set(Qt,n),t.uiState.delete(Q),t.requestUpdate()}var Yi=["headers","auth","body","prompts","reply","settings"],Wi=["body","headers","paths"];function Xi(t){let n=t.uiState.get(Gn);return Yi.includes(n)?n:"headers"}function ni(t,n){t.uiState.set(Gn,n),t.requestUpdate()}function Zi(t){let n=t.uiState.get(Yn);return Wi.includes(n)?n:"body"}function Qi(t,n){t.uiState.set(Yn,n),t.requestUpdate()}function ii(t,n,e,i,o,a){return l`<div class="ha-tabs ${a}" role="tablist" aria-label=${t}
    @keydown=${s=>{if(s.key!=="ArrowRight"&&s.key!=="ArrowLeft"&&s.key!=="Home"&&s.key!=="End")return;let r=e.findIndex(u=>u.id===i),d=s.key==="Home"?0:s.key==="End"?e.length-1:(r+(s.key==="ArrowRight"?1:-1)+e.length)%e.length;s.preventDefault(),o(e[d].id),s.currentTarget.querySelectorAll("[role=tab]")[d]?.focus()}}>
    ${e.map(s=>l`<button type="button" role="tab" class="ha-tab ${s.id===i?"on":""}" id=${`${n}-${s.id}`}
      aria-selected=${s.id===i?"true":"false"} aria-controls=${`${n}-panel`} tabindex=${s.id===i?"0":"-1"}
      @click=${()=>o(s.id)}>${s.label}${s.extra??f}</button>`)}
  </div>`}var St=t=>t===0?f:l`<span class="ha-tab-n">${t}</span>`,Xt=t=>t?l`<i class="ha-tab-dot" aria-label="set"></i>`:f;function N(t,n,e,i){return t.edit(o=>vn(e(o),n,()=>t.newId()),i)}function Ot(t){let n=t.newId();return t.edit(e=>en(e,Qe(n,tn(e)))),pt(t,{kind:"action",id:n}),n}function to(t){let n=t.newId();return t.edit(e=>$n(e,n,kn(e))),pt(t,{kind:"globals"}),n}function eo(t,n){let e;t.edit(i=>{let o=nn(i,n,()=>t.newId());return e=o.id,o.document}),e!==void 0&&pt(t,{kind:"action",id:e})}function Pt(t){return t.uiState.has(Q)?(t.uiState.delete(Q),t.requestUpdate(),!0):!1}function oi(t,n){return t.uiState.get(te+n)===!0}function no(t,n){oi(t,n)?t.uiState.delete(te+n):t.uiState.set(te+n,!0),t.requestUpdate()}function ie(t,n,e,i,o,a=""){let s=oi(t,o);return l`<span class="ha-secret">
    <input type=${s?"text":"password"} class="mono" .value=${e} placeholder=${a} aria-label=${n}
      autocomplete="off" spellcheck="false" data-secret=${o}
      @input=${r=>i(r.target.value)} />
    <button type="button" class="ha-show" aria-pressed=${s?"true":"false"} aria-label=${`${s?"Hide":"Show"} ${n}`}
      @click=${()=>no(t,o)}>${s?"Hide":"Show"}</button>
  </span>`}function Zt(t,n,e,i,o,a=""){return l`<div class="field ha-secret-field"><span>${n}</span>${ie(t,n,e,i,o,a)}</div>`}function si(t,n,e,i={}){return l`<label class="ha-switch"><input type="checkbox" .checked=${n} ?disabled=${i.disabled===!0}
    @change=${o=>e(o.target.checked)} /><span>${t}</span></label>`}function oe(t,n){let e=t.uiState.get(Wn+n.id);if(e!==void 0){let i=e.headerId===void 0?void 0:n.headers.find(a=>a.id===e.headerId);if(i===void 0)return{auth:e.auth.kind===e.kind?e.auth:V(e.kind)};if(e.kind==="apiKey")return{auth:{...V("apiKey"),headerName:i.name,apiKeyValue:i.value},headerId:i.id};let o=wt(i);return o!==void 0&&o.kind===e.kind?{auth:o,headerId:i.id}:{auth:V(e.kind),headerId:i.id}}return bn(n.headers)}function io(t,n,e,i){let{headerId:o}=oe(t,n),a=o;N(t,n.id,s=>{let r=gn(s,n.id,o,e);return a=r.headerId,r.document},i),t.uiState.set(Wn+n.id,{kind:e.kind,auth:e,...a===void 0?{}:{headerId:a}}),t.requestUpdate()}function oo(t,n){let{auth:e}=oe(t,n),i=(r,d)=>io(t,n,{...e,...r},d),o=r=>`auth:${n.id}:${r}`,a=f;e.kind==="bearer"?a=Zt(t,"Token",e.token,r=>i({token:r},o("token")),o("token"),"Paste the token"):e.kind==="basic"?a=l`${U("Username",e.username,r=>i({username:r},o("user")))}
      ${Zt(t,"Password",e.password,r=>i({password:r},o("password")),o("password"))}`:e.kind==="apiKey"&&(a=l`${U("Header",e.headerName,r=>i({headerName:r},o("name")),{mono:!0,placeholder:"X-Api-Key"})}
      ${Zt(t,"Key",e.apiKeyValue,r=>i({apiKeyValue:r},o("key")),o("key"),"Paste the key")}`);let s=e.kind==="none"?"Add sign-in if the server asks for it. It is written as one header.":e.kind==="basic"?"Sent as an Authorization header, the username and password encoded together.":e.kind==="bearer"?"Sent as Authorization: Bearer and the token.":"Sent as a header with the key as its value.";return l`<p class="ha-line">${s}</p>
    <div class="ha-form">
      ${Rt("Type",e.kind,mn,r=>i({kind:r}),{snapBack:!0})}
      ${a}
    </div>`}function so(t,n,e,i){return t.icons.render(n,e,i)??l`<span class="ha-glyph-dot" style=${`background:${i}`}></span>`}function ai(t){return n=>{n.target!==n.currentTarget||n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),t())}}function ao(t,n,e,i,o){let a=vt(n),s=()=>pt(t,{kind:"action",id:n.id}),r=st(n);return l`<div class="ha-item ${o?"on":""}" role="listitem" tabindex="0" data-action=${n.id}
    aria-current=${o?"true":"false"} aria-label=${a} title=${`${a} \xB7 ${Fi(n)}`}
    @click=${d=>{d.target instanceof Element&&d.target.closest("button")||s()}}
    @keydown=${ai(s)}>
    ${Gi(Y(n))}
    <span class="ha-item-name">${a}</span>
    ${r?l`<span class="ha-need-mark" title=${Qn}>needs setup</span>`:f}
    ${Kt(n)?l`<span class="ha-mark">voice</span>`:f}
    <span class="ha-item-acts">
      <button type="button" class="icon" ?disabled=${t.busy||e===0} title="Move up" aria-label=${`Move ${a} up`}
        @click=${()=>t.edit(d=>qt(d,n.id,e-1))}>${T("up")}</button>
      <button type="button" class="icon" ?disabled=${t.busy||e===i-1} title="Move down" aria-label=${`Move ${a} down`}
        @click=${()=>t.edit(d=>qt(d,n.id,e+1))}>${T("down")}</button>
    </span>
  </div>`}function ri(t){let n=L(t.document).map(M),e=it(t.document).length,i=ei(t),o=i?.kind==="globals",a=()=>pt(t,{kind:"globals"});return l`<section class="card lc ha-list-card" aria-label="Actions" style="--c: var(--wa-lc-layers, #4a7fe8)">
    <div class="lc-head">
      <span class="swatch">${T("globe")}</span><span class="lc-title">Actions</span>
      <span class="lc-sub" title=${Li}>${n.length}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri ha-add" aria-label="Add an action" ?disabled=${t.busy}
        title="A new action" @click=${()=>Ot(t)}>${T("plus")}<span>Add</span></button>
    </div>
    ${n.length===0?l`<div class="lc-note ha-list-note">No actions yet. Add one to send a request from the watch.</div>`:l`<div class="ha-items" role="list">${n.map((s,r)=>ao(t,s,r,n.length,i?.kind==="action"&&i.id===s.id))}</div>`}
    <div class="ha-list-foot">
      <div class="ha-item ha-globals-item ${o?"on":""}" role="button" tabindex="0" aria-pressed=${o?"true":"false"}
        title=${Zn} @click=${a} @keydown=${ai(a)}>
        <span class="ha-mtag ha-gtag" aria-hidden="true">{ }</span>
        <span class="ha-item-name">Globals</span>
        <span class="ha-count">${e}</span>
      </div>
    </div>
  </section>`}function ro(t){let n=t.trim();if(n===""||n.startsWith("{"))return;let e=n.toLowerCase();return e.startsWith("http://")||e.startsWith("https://")?void 0:"Add http:// or https://. Without one the request will not send."}function lo(t,n){let e=n.id;return l`<div class="ha-look-pop" role="dialog" aria-label="Icon and color">
    <fieldset class="ha-set" ?disabled=${t.busy}>
      <div class="ha-stack">${Le({icons:t.icons,symbols:t.symbols},n.icon??ee,i=>t.edit(o=>an(o,e,i===ee?"":i),`a:${e}:icon`),`ha:icon:${e}`,void 0,"Icon",!1)}</div>
      ${Ce("Color",n.iconColor,i=>t.edit(o=>rn(o,e,i),`a:${e}:color`),!0,null)}
    </fieldset>
    <div class="ha-pop-foot"><span class="ha-line">The icon and color the action wears on the watch.</span>
      <button type="button" class="pe-btn ha-sm" @click=${()=>Pt(t)}>Done</button></div>
  </div>`}function po(t,n){let e=n.id,i=n.iconColor??Ci,o=t.uiState.get(Q)===e;return l`<div class="ha-titlerow">
    <span class="ha-look">
      <button type="button" class="ha-look-btn" style=${`--c:${i}`} aria-haspopup="dialog" aria-expanded=${o?"true":"false"}
        title="Icon and color" aria-label="Icon and color"
        @click=${()=>{o?t.uiState.delete(Q):t.uiState.set(Q,e),t.requestUpdate()}}>
        <span class="ha-look-glyph">${so(t,n.icon??ee,16,i)}</span>
      </button>
      ${o?lo(t,n):f}
    </span>
    <input type="text" class="ha-name" .value=${n.name} placeholder="My action" aria-label="Name" ?disabled=${t.busy}
      @input=${a=>t.edit(s=>sn(s,e,a.target.value),`a:${e}:name`)} />
    <span class="ha-title-acts">
      <button type="button" class="pe-btn ha-sm" ?disabled=${t.busy} title="A copy with new ids, named Copy"
        @click=${()=>eo(t,e)}>${T("duplicate")}<span>Duplicate</span></button>
      <button type="button" class="pe-btn ha-sm pe-danger" ?disabled=${t.busy}
        title="Remove this action. Tiles and menu items that run it stop working."
        @click=${()=>t.edit(a=>on(a,e))}>${T("delete")}<span>Remove</span></button>
    </span>
  </div>`}function co(t,n){let e=n.id,i=z(t,e),o=st(n),a=Y(n),s=ti(a),r=nt.includes(a),d=ro(n.url);return l`<div class="ha-reqbar">
      <div class="ha-reqbox">
        <select class="ha-method m-${s.tone}" aria-label="Method" ?disabled=${t.busy} .value=${a}
          @change=${p=>{N(t,e,u=>dn(u,e,p.target.value)),t.requestUpdate()}}>
          ${r?f:l`<option value=${a} selected>${a}</option>`}
          ${nt.map(p=>l`<option value=${p} ?selected=${p===a}>${p}</option>`)}
        </select>
        <input type="text" class="ha-url mono" .value=${n.url} placeholder="https://example.com/api" aria-label="URL"
          spellcheck="false" autocomplete="off" ?disabled=${t.busy}
          @input=${p=>N(t,e,u=>ln(u,e,p.target.value),`a:${e}:url`)}
          @keydown=${p=>{p.key!=="Enter"||p.isComposing||(p.preventDefault(),Fn(t,e))}} />
      </div>
      <button type="button" class="pe-btn pe-primary ha-send ${i.running?"busy":""}" ?disabled=${i.running||o}
        aria-busy=${i.running?"true":"false"} title=${o?"Add a URL first":"Send it now (Enter in the URL)"}
        @click=${()=>{Fn(t,e)}}>${i.running?"Sending\u2026":"Send"}</button>
    </div>
    ${d===void 0&&!o?f:l`<div class="ha-barnote">
      ${d===void 0?f:l`<p class="ha-warn">${d}</p>`}
      ${o?l`<p class="ha-warn">${Qn}</p>`:f}
    </div>`}`}function uo(t,n,e){let i=n.id,o=e===void 0?void 0:n.headers.find(s=>s.id===e),a=n.headers.filter(s=>s.id!==e);return l`<div class="ha-table ha-htable" role="table" aria-label="Headers">
    <div class="ha-tr ha-th" role="row"><span role="columnheader">Key</span><span role="columnheader">Value</span><span></span></div>
    ${o===void 0?f:l`<div class="ha-tr ha-auth-row" role="row">
      <span class="ha-td ha-ro mono" role="cell">${o.name}</span>
      <span class="ha-td ha-ro" role="cell"><span class="ha-dots" aria-label="Hidden">••••••••</span></span>
      <span class="ha-td ha-end" role="cell"><button type="button" class="ha-from-auth" title="Written by the Auth tab. Edit it there."
        @click=${()=>ni(t,"auth")}>Auth</button></span>
    </div>`}
    ${a.map(s=>l`<div class="ha-tr" role="row">
      <span class="ha-td" role="cell"><input type="text" class="mono" .value=${s.name} placeholder="Name" aria-label="Header name" spellcheck="false"
        @input=${r=>N(t,i,d=>yt(d,i,s.id,{name:r.target.value}),`h:${s.id}:name`)} /></span>
      <span class="ha-td" role="cell">${ie(t,`${s.name.trim()||"Header"} value`,s.value,r=>N(t,i,d=>yt(d,i,s.id,{value:r}),`h:${s.id}:value`),`header:${s.id}`,"Value")}</span>
      <span class="ha-td ha-end" role="cell"><button type="button" class="icon ha-remove" title="Remove this header" aria-label=${`Remove ${s.name.trim()||"header"}`}
        @click=${()=>N(t,i,r=>Bt(r,i,s.id))}>${T("delete")}</button></span>
    </div>`)}
    <div class="ha-tr ha-addrow" role="row"><button type="button" class="ha-add-row" @click=${()=>N(t,i,s=>fn(s,i,t.newId()))}>${T("plus")}<span>Add header</span></button></div>
  </div>
  <p class="ha-line">Header values stay hidden until shown.</p>`}function ho(t,n){if(!ot(n))return l`<p class="ha-line">${Ii}</p>`;let e=n.bodyContentType,i=zi[e];return l`<div class="ha-body-head">
      <label class="ha-inline"><span>Type</span>
        <select .value=${e} @change=${o=>{N(t,n.id,a=>pn(a,n.id,o.target.value)),t.requestUpdate()}}>
          ${Ki.map(([o,a])=>l`<option value=${o} ?selected=${o===e}>${a}</option>`)}
        </select></label>
      ${i===void 0?f:l`<span class="ha-line">Sends Content-Type: ${i}, unless a header sets one.</span>`}
    </div>
    ${e==="audio"?l`<p class="ha-line ha-audio">${Ni}</p>`:l`<textarea class="mono ha-body-text" rows="8" spellcheck="false" aria-label="Body" .value=${n.body??""} placeholder=${qi[e]}
          @input=${o=>N(t,n.id,a=>cn(a,n.id,o.target.value),`a:${n.id}:body`)}></textarea>`}`}function Jn(t,n,e,i){let o=(s,r)=>t.edit(d=>xn(d,n.id,e.id,s),r),a=zt(e);return l`<div class="ha-var ${i?"unused":""}" data-key=${e.key}>
    <div class="ha-var-head"><code>{{${e.key}}}</code>
      ${i?l`<span class="ha-mark">unused, left out when saved</span>
        <button type="button" class="icon ha-remove" title="Remove" aria-label=${`Remove {{${e.key}}}`}
          @click=${()=>t.edit(s=>yn(s,n.id,e.id))}>${T("delete")}</button>`:f}
    </div>
    ${i?f:l`<div class="ha-var-grid">
      ${U("Prompt",e.prompt,s=>o({prompt:s},`v:${e.id}:prompt`),{placeholder:"Message"})}
      ${Re("Kind",e.kind,[["text","Text"],["number","Number"]],s=>o({kind:s}))}
      <label class="field ha-quick"><span>Quick values</span>
        <textarea rows=${Math.max(2,Math.min(6,e.presetValues.length+1))} .value=${e.presetValues.join(`
`)} placeholder="One per line"
          @input=${s=>o({presetValues:s.target.value.split(`
`)},`v:${e.id}:presets`)}></textarea></label>
      <div class="ha-only">${si("Only these",e.presetsOnly,s=>o({presetsOnly:s}),{disabled:a.length===0&&!e.presetsOnly})}
        <span class="ha-line">${a.length===0?"Add a quick value to offer only these.":e.presetsOnly?"The watch shows only the quick values, with no typing.":"The watch offers the quick values and lets you type too."}</span></div>
    </div>`}
  </div>`}function fo(t,n){let e=j(t.document),i=W(n,e),o=wn(n,e),a=i.asked.filter(s=>!n.variables.some(r=>r.key===s));return l`<p class="ha-line" title=${Cn}>${ji}</p>
    ${i.global.length===0?f:l`<p class="ha-from-globals">${i.global.map(s=>l`<code>{{${s}}}</code>`)} <span>from Globals</span></p>`}
    ${i.asked.length===0&&o.length===0?l`<p class="ha-quiet">Nothing is asked for. The action runs at once.</p>`:f}
    ${at(n,e).map(s=>Jn(t,n,s,!1))}
    ${a.map(s=>l`<div class="ha-var" data-key=${s}><div class="ha-var-head"><code>{{${s}}}</code><span class="ha-need-mark">not set up</span>
      <span class="ha-line">Sent as typed until it is set up.</span>
      <button type="button" class="pe-btn ha-sm" @click=${()=>N(t,n.id,r=>r)}>Ask for it on the watch</button></div></div>`)}
    ${o.map(s=>Jn(t,n,s,!0))}`}function mo(t,n){let e=n.id,i=n.reply,o=i?.source??"none",a=i===void 0?void 0:Jt[i.source],s=a==="jsonPath"?U("JSON path",i?.jsonPath??"",d=>t.edit(p=>q(p,e,"jsonPath",d),`r:${e}:path`),{mono:!0,placeholder:"result.price"}):a==="headerName"?U("Header",i?.headerName??"",d=>t.edit(p=>q(p,e,"headerName",d),`r:${e}:header`),{mono:!0,placeholder:"X-RateLimit-Remaining"}):a==="pattern"?U("Pattern",i?.pattern??"",d=>t.edit(p=>q(p,e,"pattern",d),`r:${e}:pattern`),{mono:!0,placeholder:"temperature=([0-9.]+)"}):f;return l`<p class="ha-line">${i===void 0?"Pick what to take from the reply to show on the watch, as a tile's value or in the banner after it runs.":a==="jsonPath"?"Keys joined by dots, a number for an item of a list: data.0.temp. A send offers the paths it finds.":a==="pattern"?"The first group in brackets, else the whole match.":"Shown on the watch, as a tile's value or in the banner after it runs."}</p>
    <div class="ha-form">
      ${Rt("Read",o,Bi,d=>t.edit(p=>Ht(p,e,d==="none"?void 0:d)),{snapBack:!0})}
      ${s}
      ${i===void 0?f:U("Unit",i.unit??"",d=>t.edit(p=>q(p,e,"unit",d),`r:${e}:unit`),{placeholder:"\xB0, $, kWh"})}
    </div>`}function bo(t,n){let e=n.id;return l`<div class="ha-form ha-settings">
      ${De("Timeout",n.timeout,i=>t.edit(o=>un(o,e,i),`a:${e}:timeout`),{optional:!0,min:Mt,max:Ut,step:1,unit:"s",placeholder:String(It),def:null})}
      <p class="ha-line ha-under">${Mi}</p>
    </div>
    <div class="ha-setting">
      ${si("Accept a self-signed certificate",n.allowsUntrustedCertificate,i=>t.edit(o=>hn(o,e,i)))}
      <p class="ha-line">${Ui}</p>
    </div>
    ${n.presentsClientCertificate?l`<p class="ha-warn ha-cert">This action asks for a client certificate. ${kt}</p>`:f}`}function go(t){return ot(t)?t.bodyContentType==="audio"||(t.body??"").trim()!=="":!1}function vo(t,n){let{headerId:e,auth:i}=oe(t,n),o=Xi(t),a=at(n,j(t.document)).length,s=[{id:"headers",label:"Headers",extra:St(n.headers.length)},{id:"auth",label:"Auth",extra:Xt(i.kind!=="none")},{id:"body",label:"Body",extra:Xt(go(n))},{id:"prompts",label:"Prompts",extra:St(a)},{id:"reply",label:"Reply value",extra:Xt(n.reply!==void 0)},{id:"settings",label:"Settings"}],r=o==="headers"?uo(t,n,e):o==="auth"?oo(t,n):o==="body"?ho(t,n):o==="prompts"?fo(t,n):o==="reply"?mo(t,n):bo(t,n);return l`<div class="ha-req">
    ${ii("Request","ha-tab",s,o,d=>ni(t,d),"ha-req-tabs")}
    <div class="ha-tabbody tab-${o}" role="tabpanel" id="ha-tab-panel" aria-labelledby=${`ha-tab-${o}`}>
      <fieldset class="ha-set" ?disabled=${t.busy}>${r}</fieldset>
    </div>
  </div>`}function z(t,n){return t.uiState.get(Xn+n)??{values:{},running:!1,run:0}}function ne(t,n,e){t.uiState.set(Xn+n,e),t.requestUpdate()}function xo(t,n,e){let i={};for(let o of at(t,n)){let a=e[o.key];i[o.key]=a!==void 0?a:o.presetValues[0]??""}return i}async function Fn(t,n){let e=G(t.document,n);if(e===void 0)return;let i=M(e);if(st(i))return;let o=z(t,n);if(o.running)return;let a=o.run+1,s=xo(i,j(t.document),o.values);ne(t,n,{values:o.values,running:!0,run:a});let r=it(t.document),d;try{let p=await t.test(e,r,s);d={values:z(t,n).values,running:!1,reply:p,run:a}}catch(p){d={values:z(t,n).values,running:!1,error:yo(p),run:a}}z(t,n).run===a&&ne(t,n,d)}function yo(t){let n=t,e=typeof n?.code=="string"?n.code:typeof n?.error?.code=="string"?n.error.code:void 0,i=typeof n?.message=="string"?n.message:typeof n?.error?.message=="string"?n.error.message:"";return e==="unknown_command"?"This version of the integration cannot test an action. Update it to test here.":e==="invalid"?`Home Assistant could not build the request${i===""?".":`: ${i}`}`:i===""?"No answer from Home Assistant.":i}function wo(t,n,e,i){let o=zt(e),a=i.values[e.key]??o[0]??"",s=p=>ne(t,n.id,{...z(t,n.id),values:{...z(t,n.id).values,[e.key]:p}}),r=e.prompt.trim()===""?e.key:e.prompt.trim();if(e.presetsOnly&&o.length>0)return l`<label class="ha-tv"><span>${r}</span>
      <select .value=${a} @change=${p=>s(p.target.value)}>
        ${o.map(p=>l`<option value=${p} ?selected=${p===a}>${p}</option>`)}
      </select></label>`;let d=`ha-q-${e.id}`;return l`<label class="ha-tv"><span>${r}</span>
    <input type="text" inputmode=${e.kind==="number"?"decimal":f} .value=${a} list=${o.length===0?f:d}
      placeholder=${e.key} @input=${p=>s(p.target.value)} />
    ${o.length===0?f:l`<datalist id=${d}>${o.map(p=>l`<option value=${p}></option>`)}</datalist>`}</label>`}function Ho(t){return t.status===null?"err":t.status>=200&&t.status<300?"ok":"warn"}function Ao(t,n,e){let i=Zi(t),o=Object.entries(e.headers??{}),a=[{id:"body",label:"Body"},{id:"headers",label:"Headers",extra:St(o.length)},{id:"paths",label:"Paths",extra:St(e.paths.length)}],s;return i==="body"?s=e.snippet===""?l`<p class="ha-quiet">No body.</p>`:l`<pre class="ha-snippet mono">${e.snippet}</pre>`:i==="headers"?s=o.length===0?l`<p class="ha-quiet">No headers.</p>`:l`<div class="ha-rlist" role="list" aria-label="Reply headers">
      ${o.map(([r,d])=>{let p=n.reply?.source==="header"&&n.reply.headerName===r;return l`<div class="ha-rrow ${p?"on":""}" role="listitem"><code>${r}</code><span class="mono ha-rval">${d}</span>
          <button type="button" class="ha-use" title=${`Read the ${r} header`} ?disabled=${t.busy}
            @click=${()=>t.edit(u=>Tn(u,n.id,r))}>${p?"Reply value":"Use"}</button></div>`})}</div>`:s=e.paths.length===0?l`<p class="ha-quiet">No JSON fields found.</p>`:l`<div class="ha-rlist" role="list" aria-label="JSON fields found">
      ${e.paths.map(r=>{let d=n.reply?.source==="jsonField"&&n.reply.jsonPath===r.path;return l`<button type="button" role="listitem" class="ha-rrow ha-path ${d?"on":""}" title=${`${r.path} is ${r.value}. Read this field.`} ?disabled=${t.busy}
          @click=${()=>t.edit(p=>An(p,n.id,r.path))}><code>${r.path}</code><span class="mono ha-rval">${r.value}</span><span class="ha-use-word">${d?"Reply value":"Use"}</span></button>`})}</div>`,l`${ii("Response","ha-rtab",a,i,r=>Qi(t,r),"ha-resp-tabs")}
    <div class="ha-resp-body" role="tabpanel" id="ha-rtab-panel" aria-labelledby=${`ha-rtab-${i}`}>${s}</div>`}function To(t,n){let e=z(t,n.id),i=at(n,j(t.document)),o=e.running?void 0:e.reply,a=o===void 0?void 0:Ho(o);return l`<section class="ha-resp" aria-label="Response">
    <div class="ha-resp-head" role="status">
      <span class="ha-cap">Response</span>
      ${o===void 0?f:l`
        <span class="ha-status ${a}">${o.status===null?"No answer":`HTTP ${o.status}`}</span>
        <span class="ha-ms">${o.elapsed_ms} ms</span>
        ${n.reply===void 0?f:l`<span class="ha-val"><b>Value</b>${o.value===null?l`<span class="ha-muted">Not found</span>`:l`<code>${o.value}</code>`}</span>`}`}
    </div>
    ${i.length===0?f:l`<div class="ha-testvals" role="group" aria-label="Test values"><span class="ha-cap2">Test values</span>
      ${i.map(s=>wo(t,n,s,e))}</div>`}
    ${e.running?l`<p class="ha-quiet ha-pad">Sending…</p>`:e.error!==void 0?l`<p class="ha-test-err ha-pad" role="status">${e.error}</p>`:o===void 0?l`<p class="ha-quiet ha-pad">${Vi}${Kt(n)?" A test sends no voice clip.":""}</p>`:l`${o.error?l`<p class="ha-test-err ha-pad">${o.error}</p>`:f}${Ao(t,n,o)}`}
  </section>`}function ko(t,n){return l`<div class="ha-main-in" data-action=${n.id}>
    ${po(t,n)}
    ${co(t,n)}
    ${vo(t,n)}
    ${To(t,n)}
  </div>`}function $o(t){let n=it(t.document).map(jt),e=new Map;for(let i of n)e.set(i.key.trim(),(e.get(i.key.trim())??0)+1);return l`<div class="ha-main-in ha-globals">
    <div class="ha-titlerow">
      <span class="ha-mtag ha-gtag big" aria-hidden="true">{ }</span>
      <h3 class="ha-h">Globals</h3><span class="ha-count">${n.length}</span>
      <span class="ha-title-acts"></span>
    </div>
    <div class="ha-scroll">
      <p class="ha-line ha-glead">${Zn}</p>
      <fieldset class="ha-set" ?disabled=${t.busy}>
      <div class="ha-table ha-gtable" role="table" aria-label="Globals">
        <div class="ha-tr ha-th" role="row"><span role="columnheader">Key</span><span role="columnheader">Value</span><span role="columnheader">Used by</span><span></span></div>
        ${n.map(i=>{let o=i.key.trim(),a=Pn(t.document,o);return l`<div class="ha-tr" role="row" data-global=${i.id}>
            <span class="ha-td" role="cell"><input type="text" class="mono" .value=${i.key} placeholder="haurl"
              aria-label="Key" spellcheck="false" @input=${s=>t.edit(r=>_n(r,i.id,s.target.value),`g:${i.id}:key`)} /></span>
            <span class="ha-td" role="cell">${ie(t,`${o===""?"Global":o} value`,i.value,s=>t.edit(r=>Sn(r,i.id,s),`g:${i.id}:value`),`global:${i.id}`,"https://ha.local:8123")}</span>
            <span class="ha-td ha-users" role="cell" title=${a.length===0?"No action uses it yet.":`Used by ${a.join(", ")}.`}>${a.length===0?l`<span class="ha-muted">Not used yet</span>`:Ji(a.length,"action","actions")}</span>
            <span class="ha-td ha-end" role="cell"><button type="button" class="icon ha-remove" aria-label=${`Remove ${o===""?"this global":`{{${o}}}`}`}
              title=${a.length===0?"Remove this global":"Remove this global. The actions that use it send the {{key}} as typed."}
              @click=${()=>t.edit(s=>On(s,i.id))}>${T("delete")}</button></span>
            ${o===""?l`<p class="ha-warn ha-rowwarn">A global needs a key before it can be saved.</p>`:(e.get(o)??0)>1?l`<p class="ha-warn ha-rowwarn">Another global has this key. Each key must be its own.</p>`:f}
          </div>`})}
        <div class="ha-tr ha-addrow" role="row"><button type="button" class="ha-add-row ha-add-global" @click=${()=>to(t)}>${T("plus")}<span>Add global</span></button></div>
      </div>
      </fieldset>
      <p class="ha-line">Type {{key}} in a URL, header or body. It is filled in as typed, before the values asked for on the watch. Values stay hidden until shown.</p>
    </div>
  </div>`}function di(t){let n=ei(t);return n?.kind==="globals"?$o(t):n?.kind==="action"?ko(t,M(G(t.document,n.id))):l`<div class="ha-empty-main">
    <b>${At}</b>
    <span>An HTTP action is a web request a watch asks Home Assistant to send. Add one to start, or a global for a value several actions share.</span>
    <button type="button" class="pe-btn pe-primary" ?disabled=${t.busy} @click=${()=>Ot(t)}>${T("plus")}<span>${Tt}</span></button>
  </div>`}var li=ft`
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
  textarea.ha-body-text { width: 100%; flex: 1 1 auto; min-height: 140px; resize: vertical; font-size: 12.5px; line-height: 1.5; padding: 8px 10px; }

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
`;je({dirty:Wt,drop:qn});typeof window<"u"&&window.addEventListener("beforeunload",t=>{Wt()&&(t.preventDefault(),t.returnValue="")});var _o=15e3,fi=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),se=fi?"\u2318":"Ctrl+",ct={min:200,max:520,middleMin:520},ae={left:280,right:0},re="wrist-assistant-panel.http-actions.columns.v1",So=8,pi=760;function Oo(t,n){let e=_e(n,ct);return t<=0?e:Math.max(ct.min,Math.min(e,t-ct.middleMin))}function ci(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function ui(t){let n=t?Date.parse(t):NaN;return Number.isNaN(n)?"":me(Math.max(0,(Date.now()-n)/1e3))}function Po(t){return t instanceof HTMLElement?Ie(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function Eo(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function de(t,n){let e=[],i=[];if(t===void 0||t.revision<=0)return{collected:e,waiting:i};for(let o of n)((t.delivered?.[o.owner_watch_id]??0)>=t.revision?e:i).push($e(o,n));return{collected:e,waiting:i}}function Do(t,n){if(t.updated_by==="panel")return"saved here";let e=n.find(i=>i.owner_watch_id===t.updated_by);return e===void 0?"handed over by a phone":`handed over by ${e.paired_iphone_name??e.device_name??"a phone"}`}function Ro(t){return t.some(n=>!n.is_orphan&&(He(n)==="iphone"||(n.paired_iphone_name??"")!==""))}var k=class extends ce{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.unsupported=!1;this.loading=!1;this.topMenuOpen=!1;this.columns={...ae};this.hostWidth=0;this.ownListAsked=!1;this.topHeight=0;this.symbols=new Pe(()=>this.requestUpdate());this.uiState=new Map;this.reloadPending=!1;this.loadSeq=0;this.askedOnce=!1;this.onReconnect=()=>{this.isConnected&&this.load(!0)};this.onKeyDown=e=>{if(e.defaultPrevented)return;let i=e.composedPath();if(!i.includes(this)&&!Eo()||this.renderRoot.querySelector("dialog[open]"))return;let o=e.metaKey||e.ctrlKey,a=e.key.toLowerCase();if(o&&!e.altKey&&a==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&Pt(this.lookHost())){e.preventDefault();return}if(!Po(i[0])){if(o&&!e.altKey&&a==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}e.ctrlKey&&!e.metaKey&&!e.altKey&&a==="y"&&(e.preventDefault(),this.redo())}};this.onWindowPointerDown=e=>{let i=e.composedPath(),o=a=>i.some(s=>s instanceof HTMLElement&&s.classList.contains(a));this.topMenuOpen&&!o("pe-top-menu")&&(this.topMenuOpen=!1),o("ha-look")||Pt(this.lookHost())};this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get allOwners(){return this.owners.length>0?this.owners:this.ownList??[]}get watches(){return ke(this.allOwners)}get draft(){if(!(this.record===void 0||this.unsupported))return Yt()}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Se(re,ae,ct),this.watchSize(),this.listenForReconnect(),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.stopPolling(),this.loadSeq++}willUpdate(e){this.hass&&(e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,ue(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]})),this.askedOnce||(this.askedOnce=!0,this.load())),this.followSave()}updated(){this.observeTop()}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let i of e){if(i.target!==this){this.measureTop(i.target);continue}let o=i.contentRect;Math.abs(o.width-this.hostWidth)>=1&&(this.hostWidth=o.width)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&e.observe(i))}measureTop(e){let i=e.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=Yt()?.saveDone;if(e===void 0||e===this.followedSave)return;this.followedSave=e;let i=()=>this.saveEnded();e.then(i,i)}saveEnded(){this.requestUpdate(),this.isConnected&&(this.reloadPending=!1,this.load(!0))}async load(e=!1){let i=this.hass;if(!i)return;if(e&&this.saving){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),e||(this.loading=this.record===void 0,this.loadError=void 0);try{let a=await Et(i);if(o!==this.loadSeq)return;if(this.saving){this.reloadPending=!0;return}this.unsupported=!1,this.show(a),this.loadError=void 0}catch(a){if(o!==this.loadSeq)return;Ln(a)?(this.unsupported=!0,this.loadError=void 0):(!e||this.record===void 0)&&(this.loadError=I(a).message)}this.loading=!1,this.unsupported||this.pollIfWaiting()}flushPending(){!this.reloadPending||this.saving||(this.reloadPending=!1,this.load(!0))}show(e){this.record=e;let i=e.revision>0?Ge(e.document):void 0,o=Kn(i,e.revision);o.kept.length>0?this.note={kind:"warn",text:_t(o.kept)}:o.mergedIntoEdits&&(this.note={kind:"warn",text:"The HTTP actions changed somewhere else. Your edits are kept."}),this.requestUpdate()}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||de(this.record,this.watches).waiting.length===0)&&(this.pollTimer=window.setTimeout(()=>{this.pollTimer=void 0,this.load(!0)},_o))}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,i){let o=this.draft;if(!o||this.saving)return!1;let a=o.apply(e(o.document),i);return this.requestUpdate(),a}memoIcons(){let e=this.icons??Ne,i=this.iconMemo;if(i!==void 0&&i.provider===e&&i.tick===this.iconsTick)return i.icons;let o=Me(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:o},o}viewHost(){let e=this.draft,i=this.hass;if(e===void 0||i===void 0)return;let o=this;return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,get document(){return e.document},get busy(){return o.saving},edit:(a,s)=>this.draft===e&&this.edit(a,s),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate(),test:(a,s,r)=>fe(i,a,s,r),newId:rt}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}startLibrary(){if(this.record===void 0||this.unsupported)return;zn();let e=this.viewHost();e!==void 0&&Ot(e),this.requestUpdate()}async save(){let e=this.hass,i=this.draft;if(!e||!i||this.saving||!i.dirty)return;this.note=void 0,i.apply(Hn(i.document,i.base));let o=jn(i,{save:(s,r)=>he(e,s,r).catch(d=>{throw hi(d)}),fetch:async()=>{let s=await Et(e).catch(r=>{throw hi(r)});return s.document===void 0?{revision:s.revision}:{revision:s.revision,document:s.document}}});this.followedSave=i.saveDone,this.requestUpdate();let a=await o.catch(s=>{let{code:r,message:d}=I(s);return{ok:!1,revision:i.revision,merged:!1,code:r??"unknown",message:d}});this.saveEnded(),this.note=Bn(a),this.flushPending()}lookHost(){return{uiState:this.uiState,requestUpdate:()=>this.requestUpdate()}}render(){let e=this.draft;return l`
      <div class="pe-top">
        ${this.renderTopBar(e)}
        ${this.note?l`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:f}
      </div>
      ${this.renderBody()}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=pi}renderTopBar(e){let i=e!==void 0,o=i&&this.dirty;return l`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="HTTP actions">
      <span class="ha-title"><b>HTTP actions</b><span class="ha-shared">${Ft}</span></span>
      <span class="spacer"></span>
      ${this.renderSyncPill()}
      ${i?l`<span class="side-menu pe-top-menu">
          <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${this.topMenuOpen?"true":"false"} aria-label="More actions" title="More"
            @click=${()=>{this.topMenuOpen=!this.topMenuOpen}}>···</button>
          ${this.topMenuOpen?l`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
            <button class="row" role="menuitem" ?disabled=${!o||this.saving}
              title="Go back to the copy Home Assistant holds. Undo brings the edits back."
              @click=${()=>{this.topMenuOpen=!1,this.discard()}}>Discard edits</button>
          </div>`:f}
        </span>
        <button class="cv-act icon undo" ?disabled=${!e.canUndo} title=${`Undo (${se}Z)`} aria-label="Undo" @click=${()=>this.undo()}>${T("undo")}</button>
        <button class="cv-act icon undo" ?disabled=${!e.canRedo} title=${fi?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo" @click=${()=>this.redo()}>${T("redo")}</button>
        <button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${se}S). A save reaches every watch the next time it checks.`:`Nothing to save (${se}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        <span class="tb-saved" title=${o?"Unsaved changes":""}>${this.savedText()}</span>`:f}
      <button class="help" title="Help: HTTP actions" aria-label="Help"
        @click=${()=>window.open(Ve,"_blank","noopener")}>?</button>
    </div>`}savedText(){let e=this.record;if(e===void 0||e.revision<=0)return"";let i=ui(e.updated_at);return i?`Saved ${i}`:"Saved"}renderSyncPill(){let e=this.record;if(e===void 0||e.revision<=0||this.unsupported)return f;let{collected:i,waiting:o}=de(e,this.watches);if(i.length===0&&o.length===0)return f;let a=[o.length>0?`Waiting: ${o.join(", ")}.`:"",i.length>0?`Collected: ${i.join(", ")}.`:""].filter(s=>s!=="").join(" ");return l`<span class="tb-sync ${o.length===0?"ok":"warn"}" title=${a}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.length===0?Te:Ae}</span>
    </span>`}listWidth(){return this.hostWidth>0&&this.hostWidth<=pi?this.columns.left:Oo(this.hostWidth-So,this.columns.left)}renderGutter(){return l`<div class="gutter left" role="separator" aria-orientation="vertical" aria-label="Resize the list"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${e=>{Oe(e,{side:"left",base:this.listWidth(),limits:ct,onWidth:i=>{this.columns={...this.columns,left:i}},onEnd:()=>Dt(re,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,left:ae.left},Dt(re,this.columns)}}></div>`}renderBody(){if(this.unsupported)return l`<div class="ha-calm"><div class="pe-empty"><b>${Rn}</b></div></div>`;if(this.loadError!==void 0)return l`<div class="ha-calm"><div class="pe-empty">
        <span>Could not read the HTTP actions: ${this.loadError}</span>
        <button class="pe-btn" @click=${()=>{this.load()}}>Try again</button>
      </div></div>`;let e=this.record;if(this.loading||e===void 0)return l`<div class="ha-calm"><div class="pe-empty">Loading…</div></div>`;let i=this.draft,o=this.viewHost();if(i===void 0||o===void 0)return l`<div class="ha-calm"><div class="pe-empty ha-empty"><b>${At}</b>
        <span>An HTTP action is a web request a watch asks Home Assistant to send. ${Ft}</span>
        <span class="ha-start"><button class="pe-btn pe-primary" @click=${()=>this.startLibrary()}>${T("plus")}<span>${Tt}</span></button></span>
        ${Ro(this.allOwners)?l`<span class="pe-muted">${Dn}</span>`:f}
      </div></div>`;let a=L(i.document).filter(s=>s.presentsClientCertificate===!0).length;return l`${a===0?f:l`<p class="ha-cert-line">${a===1?"An action asks":`${a} actions ask`} for a client certificate. ${kt}</p>`}
    <div class="layout pe-layout ha-two ${this.stacked?"cols-1":""}" style=${`--wa-left:${this.listWidth()}px`}>
      <div class="column left">
        ${ri(o)}
      </div>
      ${this.renderGutter()}
      <div class="column card ha-main">
        ${di(o)}
      </div>
    </div>
    ${this.renderFoot(e,i)}`}renderFoot(e,i){let o=gt(i.document),a=ui(e.updated_at),s=e.revision<=0?"Not saved yet. The first save makes the library.":`Revision ${e.revision} \xB7 ${Do(e,this.allOwners)}${a?` ${a}`:""}`,{waiting:r}=de(e,this.watches);return l`<div class="ha-foot" role="status">
      <i class="ha-foot-dot ${e.revision<=0?"":r.length===0?"ok":"warn"}" aria-hidden="true"></i>
      <span>${s}</span>
      ${r.length===0?f:l`<span class="pe-muted">Waiting for ${r.join(", ")}.</span>`}
      <span class="spacer"></span>
      <span class="pe-muted ${o.near?"ha-near":""}">${ci(o.size)} of ${ci(o.limit)}</span>
    </div>`}static{this.styles=[Ee,be,ge,ve,xe,ye,we,ft`
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
    .ha-foot-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--wa-muted); flex: none; }
    .ha-foot-dot.ok { background: var(--wa-green); }
    .ha-foot-dot.warn { background: var(--wa-amber); }
    .ha-near { color: var(--wa-amber); }
    :host([narrow]) { --cf-pad: 12px; }
  `,li]}};O([J({attribute:!1})],k.prototype,"hass",2),O([J({attribute:!1})],k.prototype,"owners",2),O([J({type:Boolean,reflect:!0})],k.prototype,"narrow",2),O([J({attribute:!1})],k.prototype,"icons",2),O([J({attribute:!1})],k.prototype,"iconsTick",2),O([C()],k.prototype,"record",2),O([C()],k.prototype,"unsupported",2),O([C()],k.prototype,"loading",2),O([C()],k.prototype,"loadError",2),O([C()],k.prototype,"note",2),O([C()],k.prototype,"ownList",2),O([C()],k.prototype,"topMenuOpen",2),O([C()],k.prototype,"columns",2),O([C()],k.prototype,"hostWidth",2);function hi(t){let{code:n,message:e}=I(t);return Object.assign(new Error(e),n===void 0?{}:{code:n})}customElements.get("wa-http-actions-editor")||customElements.define("wa-http-actions-editor",k);export{re as HA_COLUMNS_KEY,k as WaHttpActionsEditor,Oo as fitHttpListWidth,Ro as homeHasPhone,de as httpActionsDelivery,Do as httpActionsSavedBy};
