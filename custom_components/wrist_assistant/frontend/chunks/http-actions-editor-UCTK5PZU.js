import{a as Ce,d as Le,e as Ct,f as Ne,h as O,i as Je}from"./chunk-XA5KLFXT.js";import{a as ze,b as Ke,d as Be,n as g}from"./chunk-7NNMY6Y2.js";import{Bd as Ve,M as Oe,N as Ee,R as De,S as Re,Tb as Me,h as we,ld as U,md as Ie,nd as Lt,od as je,r as Pe,re as qe,sd as Ue,se as Fe}from"./chunk-YVYBV27C.js";import{Ah as M,Fg as Rt,Gg as xe,Hg as ye,b as ft,c as p,cg as ve,eh as A,f,i as ge,ih as He,j as q,k as L,kh as ke,lh as Te,mh as Ae,nh as $e,ph as _e,zh as Se}from"./chunk-NDHBNB5A.js";import{a as P}from"./chunk-LO2NM3CE.js";var _="actions",D="globalVariables",Oi=1,We=256*1024,nt=["GET","POST","PUT","PATCH","DELETE"],Ze=["POST","PUT","PATCH","DELETE"],Mt=["none","json","form","text","audio"],It=["statusCode","bodyText","jsonField","header","regex"],Qe=["text","number"],jt=10,Ut=1,Vt=60,Ge=/^[A-Za-z0-9_]+$/,Ei=/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g;function zt(){return{[_]:[],[D]:[],schemaVersion:Oi}}function tn(t){return g(t)?t:void 0}function Di(t){return new TextEncoder().encode(JSON.stringify(t)).length}function gt(t){let n=Di(t);return{size:n,limit:We,near:n/We>.8}}function E(t,n){let e=t!==void 0&&Object.hasOwn(t,n)?t[n]:void 0;return Array.isArray(e)?e:[]}function N(t){return E(t,_).filter(g)}function it(t){return E(t,D).filter(g)}function W(t,n){return N(t).find(e=>e.id===n)}function T(t){return typeof t=="string"?t:void 0}function et(t,n){return typeof t=="string"&&n.includes(t)?t:void 0}function en(t){let n=g(t)?t:{};return{id:T(n.id)??"",name:T(n.name)??"",value:T(n.value)??""}}function mt(t){let n=g(t)?t:{},e=Array.isArray(n.presetValues)?n.presetValues.filter(i=>typeof i=="string"):[];return{id:T(n.id)??"",key:T(n.key)??"",prompt:T(n.prompt)??"",kind:et(n.kind,Qe)??"text",presetValues:e,presetsOnly:n.presetsOnly===!0}}function Kt(t){let n=g(t)?t:{};return{id:T(n.id)??"",key:T(n.key)??"",value:T(n.value)??""}}function Ri(t){if(!g(t))return;let n=et(t.source,It);if(n===void 0)return;let e={source:n};for(let i of["jsonPath","headerName","pattern","unit"]){let o=T(t[i]);o!==void 0&&(e[i]=o)}return e}function I(t){let n=typeof t.timeout=="number"&&Number.isFinite(t.timeout)?t.timeout:void 0,e={id:T(t.id)??"",name:T(t.name)??"",method:T(t.method)??"POST",url:T(t.url)??"",headers:Array.isArray(t.headers)?t.headers.map(en):[],bodyContentType:et(t.bodyContentType,Mt)??"none",variables:Array.isArray(t.variables)?t.variables.map(mt):[],allowsUntrustedCertificate:t.allowsUntrustedCertificate===!0,presentsClientCertificate:t.presentsClientCertificate===!0},i=T(t.body);i!==void 0&&(e.body=i),n!==void 0&&(e.timeout=n);let o=Ri(t.responseConfig);o!==void 0&&(e.reply=o);let s=T(t.icon),a=T(t.iconColor);return s!==void 0&&(e.icon=s),a!==void 0&&(e.iconColor=a),e}function G(t){return t.method.trim().toUpperCase()}function ot(t){return Ze.includes(G(t))}function Bt(t){return t.bodyContentType==="audio"&&ot(t)}function at(t){return t.url.trim()===""}function vt(t){let n=t.name.trim();if(n!=="")return n;let e=t.url.trim();return e!==""?e:"Untitled action"}function Nt(t){let n=t.replaceAll("_"," ").replaceAll("-"," ");return n.trim()===""?"Value":n.split(" ").filter(e=>e!=="").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}function Ci(t){return t.replace(/[^A-Za-z0-9_]/g,"")}function Jt(t){let n=new Set,e=[];for(let i of t.presetValues){let o=i.trim();o===""||n.has(o)||(n.add(o),e.push(o))}return e}function nn(t){let n=new Set,e=[];for(let i of t)for(let o of i.matchAll(Ei)){let s=o[1];n.has(s)||(n.add(s),e.push(s))}return e}function z(t){let n=new Set;for(let e of it(t)){let i=Kt(e).key.trim();i!==""&&n.add(i)}return n}function on(t){let n=[t.url];for(let e of t.headers)n.push(e.name),Ui(e)||n.push(e.value);return ot(t)&&t.bodyContentType!=="audio"&&t.body!==void 0&&n.push(t.body),n}function Y(t,n){let e=nn(on(t));return{global:e.filter(i=>n.has(i)),asked:e.filter(i=>!n.has(i))}}function st(t,n){let{asked:e}=Y(t,n);return e.map(i=>t.variables.find(o=>o.key===i)).filter(i=>i!==void 0)}function tt(t,n,e){n==="__proto__"?Object.defineProperty(t,n,{value:e,enumerable:!0,writable:!0,configurable:!0}):t[n]=e}function v(t,n,e){if(Object.hasOwn(t,n)){if(O(t[n],e)&&typeof t[n]==typeof e)return t;let s={};for(let a of Object.keys(t))tt(s,a,a===n?e:t[a]);return s}let i={},o=!1;for(let s of Object.keys(t))!o&&s>n&&(tt(i,n,e),o=!0),tt(i,s,t[s]);return o||tt(i,n,e),i}function bt(t,n){if(!Object.hasOwn(t,n))return t;let e={};for(let i of Object.keys(t))i!==n&&tt(e,i,t[i]);return e}function X(t,n,e){return e===void 0?bt(t,n):v(t,n,e)}function xt(t,n,e){let i=t.findIndex(r=>g(r)&&r.id===n);if(i<0)return t;let o=t[i],s=e(o);if(s===o)return t;let a=t.slice();return a[i]=s,a}function K(t,n,e){return e===t[n]?t:v(t,n,e)}function k(t,n,e){let i=E(t,_),o=xt(i,n,e);return o===i?t:K(t,_,o)}function an(t,n,e){let i=E(t,D),o=xt(i,n,e);return o===i?t:K(t,D,o)}function rt(){let t=globalThis.crypto;if(t!==void 0&&typeof t.randomUUID=="function")return t.randomUUID().toUpperCase();let n=e=>Array.from({length:e},()=>Math.floor(Math.random()*16).toString(16)).join("");return`${n(8)}-${n(4)}-4${n(3)}-${(8+Math.floor(Math.random()*4)).toString(16)}${n(3)}-${n(12)}`.toUpperCase()}function sn(t,n){return{bodyContentType:"none",headers:[],id:t,method:"POST",name:n,url:"",variables:[]}}function rn(t,n="New action"){let e=new Set(N(t).map(i=>I(i).name.trim().toLowerCase()));if(!e.has(n.toLowerCase()))return n;for(let i=2;;i++)if(!e.has(`${n} ${i}`.toLowerCase()))return`${n} ${i}`}function dn(t,n){return K(t,_,[...E(t,_),n])}function ln(t,n,e=rt){let i=E(t,_),o=i.findIndex(h=>g(h)&&h.id===n);if(o<0)return{document:t};let s=i[o],a=e(),r=v(s,"id",a);r=v(r,"name",`${vt(I(s))} Copy`);let d=h=>Array.isArray(h)?h.map(c=>g(c)?v(c,"id",e()):c):h;Array.isArray(s.headers)&&(r=v(r,"headers",d(s.headers))),Array.isArray(s.variables)&&(r=v(r,"variables",d(s.variables)));let l=i.slice();return l.splice(o+1,0,r),{document:K(t,_,l),id:a}}function pn(t,n){let e=E(t,_),i=e.filter(o=>!(g(o)&&o.id===n));return i.length===e.length?t:K(t,_,i)}function qt(t,n,e){let i=E(t,_),o=i.findIndex(d=>g(d)&&d.id===n);if(o<0)return t;let s=Math.max(0,Math.min(e,i.length-1));if(o===s)return t;let a=i.slice(),[r]=a.splice(o,1);return a.splice(s,0,r),K(t,_,a)}function cn(t,n,e){return k(t,n,i=>v(i,"name",e))}function un(t,n,e){let i=e.trim();return k(t,n,o=>X(o,"icon",i===""?void 0:i))}function hn(t,n,e){return e!==void 0&&!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e)?t:k(t,n,i=>X(i,"iconColor",e?.toUpperCase()))}function fn(t,n,e){let i=e.trim().toUpperCase();return nt.includes(i)?k(t,n,o=>{let s=v(o,"method",i);return!Ze.includes(i)&&s.bodyContentType==="audio"&&(s=v(s,"bodyContentType","none")),s}):t}function mn(t,n,e){return k(t,n,i=>v(i,"url",e))}function bn(t,n,e){return Mt.includes(e)?k(t,n,i=>{let o=v(i,"bodyContentType",e);return e==="audio"?bt(o,"body"):o}):t}function Ft(t,n,e){return k(t,n,i=>X(i,"body",e.trim()===""?void 0:e))}function gn(t,n,e){return e!==void 0&&(!Number.isFinite(e)||e<=0)?t:k(t,n,i=>X(i,"timeout",e))}function vn(t,n,e){return k(t,n,i=>X(i,"allowsUntrustedCertificate",e?!0:void 0))}function F(t){return E(t,"headers")}function xn(t,n,e){return k(t,n,i=>v(i,"headers",[...F(i),{id:e,name:"",value:""}]))}function yt(t,n,e,i){return k(t,n,o=>{let s=F(o),a=xt(s,e,r=>{let d=r;return i.name!==void 0&&(d=v(d,"name",i.name)),i.value!==void 0&&(d=v(d,"value",i.value)),d});return a===s?o:v(o,"headers",a)})}function Wt(t,n,e){return k(t,n,i=>{let o=F(i),s=o.filter(a=>!(g(a)&&a.id===e));return s.length===o.length?i:v(i,"headers",s)})}var yn=[["none","None"],["bearer","Bearer token"],["basic","Username and password"],["apiKey","API key header"]],Li="X-Api-Key",Ye="A07A0000-0000-0000-0000-0000000A0140",Ni=new Set(["x-api-key","api-key","apikey","x-api-token","x-auth-token","x-access-token"]);function V(t="none"){return{kind:t,token:"",username:"",password:"",headerName:Li,apiKeyValue:""}}function Mi(t){let n=new TextEncoder().encode(t),e="";for(let i of n)e+=String.fromCharCode(i);return btoa(e)}function Ii(t){if(!(!/^[A-Za-z0-9+/]*={0,2}$/.test(t)||t.length%4!==0))try{let n=atob(t),e=Uint8Array.from(n,i=>i.charCodeAt(0));return new TextDecoder("utf-8",{fatal:!0}).decode(e)}catch{return}}function ji(t){switch(t.kind){case"bearer":{let n=t.token.trim();return n===""?void 0:{name:"Authorization",value:`Bearer ${n}`}}case"basic":return t.username===""&&t.password===""?void 0:{name:"Authorization",value:`Basic ${Mi(`${t.username}:${t.password}`)}`};case"apiKey":{let n=t.headerName.trim(),e=t.apiKeyValue.trim();return n===""||e===""?void 0:{name:n,value:e}}default:return}}function wt(t){let n=t.name.trim(),e=t.value.trim();if(n.toLowerCase()==="authorization"){if(e.length>7&&e.slice(0,7).toLowerCase()==="bearer ")return{...V("bearer"),token:e.slice(7).trim()};if(e.length>6&&e.slice(0,6).toLowerCase()==="basic "){let i=Ii(e.slice(6).trim()),o=i?.indexOf(":")??-1;return i===void 0||o<0?void 0:{...V("basic"),username:i.slice(0,o),password:i.slice(o+1)}}return}if(Ni.has(n.toLowerCase()))return e===""?void 0:{...V("apiKey"),headerName:n,apiKeyValue:e}}function Ui(t){return wt(t)?.kind==="basic"}function wn(t){for(let n of t){let e=wt(n);if(e!==void 0)return{auth:e,headerId:n.id}}return{auth:V()}}function Hn(t,n,e,i){let o=ji(i),s=W(t,n);if(s===void 0)return{document:t};let a=F(s);if((e===void 0?-1:a.findIndex(c=>g(c)&&c.id===e))>=0)return o===void 0?{document:Wt(t,n,e)}:{document:yt(t,n,e,o),headerId:e};if(o===void 0)return{document:t};let l=a.some(c=>g(c)&&c.id===Ye)?rt():Ye,h={id:l,name:o.name,value:o.value};return{document:k(t,n,c=>v(c,"headers",[h,...F(c)])),headerId:l}}function Xe(t,n){return{id:t,key:n,kind:"text",presetValues:[],presetsOnly:!1,prompt:Nt(n)}}function kn(t,n,e=rt){let i=W(t,n);if(i===void 0)return t;let o=I(i),s=Y(o,z(t)).asked,a=E(i,"variables"),r=c=>mt(c).key,d=s.filter(c=>!a.some(u=>r(u)===c));if(d.length===0)return t;let l=a.map((c,u)=>[c,u]).filter(([c])=>!s.includes(r(c))),h;if(d.length===1&&l.length===1){let[c,u]=l[0],m=r(c),H=g(c)?v(c,"key",d[0]):Xe(e(),d[0]),x=mt(c).prompt;g(c)&&(x===""||x===Nt(m))&&(H=v(H,"prompt",Nt(d[0]))),h=a.slice(),h[u]=H}else h=[...a,...d.map(c=>Xe(e(),c))];return k(t,n,c=>v(c,"variables",h))}function Tn(t,n,e,i){return k(t,n,o=>{let s=E(o,"variables"),a=xt(s,e,r=>{let d=r;return i.prompt!==void 0&&(d=v(d,"prompt",i.prompt)),i.kind!==void 0&&Qe.includes(i.kind)&&(d=v(d,"kind",i.kind)),i.presetValues!==void 0&&(d=v(d,"presetValues",i.presetValues)),i.presetsOnly!==void 0&&(d=v(d,"presetsOnly",i.presetsOnly)),d});return a===s?o:v(o,"variables",a)})}function An(t,n,e){return k(t,n,i=>{let o=E(i,"variables"),s=o.filter(a=>!(g(a)&&a.id===e));return s.length===o.length?i:v(i,"variables",s)})}function $n(t,n){let e=new Set(Y(t,n).asked);return t.variables.filter(i=>!e.has(i.key))}function _n(t,n){let e=z(t),i=new Map(N(n).map(s=>[s.id,s])),o=t;for(let s of N(t)){let a=T(s.id);if(a===void 0)continue;let r=i.get(a);r!==void 0&&O(r,s)||(o=k(o,a,d=>{let l=d,h=F(d),c=h.filter(x=>!g(x)||en(x).name.trim()!=="");c.length!==h.length&&(l=v(l,"headers",c));let u=I(l),m=E(l,"variables"),H=Y(u,e).asked.map(x=>m.find(w=>mt(w).key===x)).filter(x=>x!==void 0).map(x=>{if(!g(x)||!Array.isArray(x.presetValues))return x;let w=x.presetValues.map(R=>typeof R=="string"?R.trim():R).filter(R=>R!=="");return O(w,x.presetValues)&&w.length===x.presetValues.length?x:v(x,"presetValues",w)});return(H.length!==m.length||H.some((x,w)=>x!==m[w]))&&(l=v(l,"variables",H)),l}))}return o}var Gt={statusCode:void 0,bodyText:void 0,jsonField:"jsonPath",header:"headerName",regex:"pattern"};function Ht(t,n,e){return k(t,n,i=>{if(e===void 0)return bt(i,"responseConfig");if(!It.includes(e))return i;let o=g(i.responseConfig)?i.responseConfig:{},s=v(o,"source",e);for(let a of["jsonPath","headerName","pattern"])Gt[e]!==a&&(s=bt(s,a));return v(i,"responseConfig",s)})}function B(t,n,e,i){return k(t,n,o=>{if(!g(o.responseConfig))return o;let s=e==="unit"?i:i.trim();return v(o,"responseConfig",X(o.responseConfig,e,s===""?void 0:s))})}function kt(t,n,e){return B(Ht(t,n,"jsonField"),n,"jsonPath",e)}function Sn(t,n,e){return B(Ht(t,n,"header"),n,"headerName",e)}function Pn(t,n="value"){let e=z(t);if(!e.has(n))return n;for(let i=2;;i++)if(!e.has(`${n}_${i}`))return`${n}_${i}`}function On(t,n,e){return K(t,D,[...E(t,D),{id:n,key:e,value:""}])}function En(t,n,e){return an(t,n,i=>v(i,"key",Ci(e)))}function Dn(t,n,e){return an(t,n,i=>v(i,"value",e))}function Rn(t,n){let e=E(t,D),i=e.filter(o=>!(g(o)&&o.id===n));return i.length===e.length?t:K(t,D,i)}function Cn(t,n){return n===""?[]:N(t).map(I).filter(e=>nn(on(e)).includes(n)).map(vt)}function Ln(t){if(!g(t))return["The library is not an object."];let n=[],e=Object.hasOwn(t,_)?t[_]:void 0,i=Object.hasOwn(t,D)?t[D]:void 0;Array.isArray(e)||n.push("The action list is missing."),i!==void 0&&!Array.isArray(i)&&n.push("The globals are not a list.");let o=new Set;(Array.isArray(e)?e:[]).forEach((a,r)=>{if(!g(a)){n.push(`Action ${r+1} is not an object.`);return}let d=typeof a.name=="string"&&a.name.trim()!==""?`"${a.name.trim()}"`:`Action ${r+1}`,l=a.id;typeof l!="string"||l===""?n.push(`${d} has no id.`):o.has(l)?n.push(`${d} has the id of another action.`):o.add(l);for(let u of["name","method","url"])Object.hasOwn(a,u)&&typeof a[u]!="string"&&n.push(`${d} has a ${u} that is not text.`);for(let u of["body","icon","iconColor"])Object.hasOwn(a,u)&&a[u]!==null&&typeof a[u]!="string"&&n.push(`${d} has a ${u} that is not text.`);typeof a.method=="string"&&!nt.includes(a.method.trim().toUpperCase())&&n.push(`${d} uses ${a.method}, which is not GET, POST, PUT, PATCH or DELETE.`),Object.hasOwn(a,"bodyContentType")&&et(a.bodyContentType,Mt)===void 0&&n.push(`${d} has a body type Home Assistant does not know.`),Object.hasOwn(a,"timeout")&&a.timeout!==null&&(typeof a.timeout!="number"||!Number.isFinite(a.timeout))&&n.push(`${d} has a timeout that is not a number.`),g(a.responseConfig)&&et(a.responseConfig.source,It)===void 0&&n.push(`${d} reads its reply value from a source Home Assistant does not know.`);let h=a.headers;Object.hasOwn(a,"headers")&&!Array.isArray(h)&&n.push(`${d} has headers that are not a list.`);for(let u of Array.isArray(h)?h:[])if(!g(u)||Object.hasOwn(u,"name")&&typeof u.name!="string"||Object.hasOwn(u,"value")&&typeof u.value!="string"){n.push(`${d} has a header that is not text.`);break}let c=a.variables;Object.hasOwn(a,"variables")&&!Array.isArray(c)&&n.push(`${d} has values to ask for that are not a list.`);for(let u of Array.isArray(c)?c:[]){let m=g(u)?u.key:void 0;if(typeof m!="string"||!Ge.test(m)){n.push(`${d} asks for a value whose key is not letters, digits and underscores.`);break}}});let s=new Set;return(Array.isArray(i)?i:[]).forEach((a,r)=>{let d=g(a)&&typeof a.key=="string"?a.key.trim():"";if(!g(a)||Object.hasOwn(a,"value")&&typeof a.value!="string"){n.push(`Global ${r+1} is not text.`);return}d===""?n.push(`Global ${r+1} has no name.`):Ge.test(d)?s.has(d)?n.push(`Two globals are named {{${d}}}.`):s.add(d):n.push(`The global {{${d}}} has a name that is not letters, digits and underscores.`)}),n}var Yt="Shared by every watch.",Tt="No HTTP actions yet.",At="Add an action",Nn="Update Wrist Assistant on your iPhone and open it once. Its HTTP actions move here by themselves.",Mn="Update the integration to edit HTTP actions here.",$t="Home Assistant does not send a client certificate.",In="Type {{key}} in the URL, a header or the body. A key that names a global is filled in from Globals. Any other key is asked for on the watch when the action runs. Keys are letters, digits and underscores.";function jn(t){return M(t).code==="unknown_command"}var Un={list:"action",field:_,keyOf:t=>typeof t.id=="string"&&t.id!==""?t.id:void 0,nameOf:t=>typeof t.name=="string"?t.name.trim():""},Vn={list:"global",field:D,keyOf:t=>typeof t.key=="string"&&t.key.trim()!==""?t.key.trim():void 0,nameOf:t=>typeof t.key=="string"?`{{${t.key.trim()}}}`:""};function Z(t,n){return t!=null&&Object.hasOwn(t,n)?t[n]:void 0}function dt(t,n){if(!Array.isArray(t))return;let e=new Set,i=[];for(let o of t){if(!g(o))return;let s=n.keyOf(o);if(s===void 0||e.has(s))return;e.add(s),i.push([s,o])}return i}function Vi(t,n,e){let i=dt(t,e),o=dt(n,e);if(i===void 0||o===void 0)return t;let s=new Set(o.map(([a])=>a));return i.filter(([a])=>s.has(a)).map(([,a])=>a)}function zi(t,n,e,i){let o=t===null?void 0:t,s=n===null?void 0:n,a=e===null?void 0:e,r=o===void 0?[]:dt(o,i),d=s===void 0?void 0:dt(s,i),l=a===void 0?void 0:dt(a,i);if(r===void 0||d===void 0||l===void 0)return{value:O(s,o)?a:s,clashes:[]};let h=new Map(r),c=new Map(d),u=new Map(l),m=[],H=(b,y)=>{let S=h.get(b);return S===void 0||!O(y,S)},x=(b,y,S)=>H(b,y)?(H(b,S)&&!O(y,S)&&m.push({list:i.list,key:b,name:i.nameOf(y)||i.nameOf(S)}),y):S,w=(b,y)=>h.has(b)&&!H(b,y)?void 0:y,R=d.map(([b])=>b).filter(b=>h.has(b)),me=r.map(([b])=>b).filter(b=>c.has(b)),Pi=R.length!==me.length||R.some((b,y)=>b!==me[y]),ut=[],ht=b=>{b!==void 0&&ut.push(b)};if(Pi){for(let[b,y]of d){let S=u.get(b);ht(S!==void 0?x(b,y,S):w(b,y))}for(let[b,y]of l)c.has(b)||ht(w(b,y))}else{for(let[b,y]of l){let S=c.get(b);ht(S!==void 0?x(b,S,y):w(b,y))}for(let[b,y]of d)u.has(b)||ht(w(b,y))}let be=b=>Array.isArray(b)&&b.length===ut.length&&ut.every((y,S)=>y===b[S]);return be(a)?{value:a,clashes:m}:be(s)?{value:s,clashes:m}:{value:ut,clashes:m}}function Ki(t,n,e,i){return t==null?Vi(Z(e,i.field),Z(n,i.field),i):Z(t,i.field)}function Xt(t,n,e,i){return zi(Ki(t,n,e,i),Z(n,i.field),Z(e,i.field),i)}function zn(t,n,e){return[...Xt(t,n,e,Un).clashes,...Xt(t,n,e,Vn).clashes]}function Kn(t,n,e){let i=Je(t,n,e);for(let o of[Un,Vn]){let s=Xt(t,n,e,o).value,a=Z(i,o.field);if(s!==a){if(s===void 0){if(!Object.hasOwn(i,o.field))continue;let{[o.field]:r,...d}=i;i=d;continue}(i===e||i===n)&&(i={...i}),i[o.field]=s}}return i}var Bn=100,Bi=3,_t=class{constructor(n,e){this._undo=[];this._redo=[];this._kept=[];this._base=n,this._revision=e,this._document=n}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get kept(){return this._kept}get dirty(){let n=this._dirty;if(n!==void 0&&n.document===this._document&&n.base===this._base)return n.value;let e=this._document!==this._base&&!O(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(n,e){if(n===this._document||O(n,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let i=this._undo[this._undo.length-1];return O(n,i)?(this._undo.pop(),this._document=i,this._coalesceKey=void 0):this._document=n,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=n,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let n=this._undo.pop();return n===void 0?!1:(this._redo.push(this._document),this._document=n,!0)}redo(){this._coalesceKey=void 0;let n=this._redo.pop();return n===void 0?!1:(this.pushUndo(this._document),this._document=n,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(n,e){return e<this._revision?(this._kept=[],!1):this.mergeOnto(n,e)}restart(n,e){return this.mergeOnto(n,e)}mergeOnto(n,e){this._coalesceKey=void 0;let i=this._base;this._kept=this._document===i?[]:zn(i,this._document,n);let o=new Map,s=c=>{let u=o.get(c);if(u!==void 0)return u;let m=c===i?n:Kn(i,c,n);return m!==n&&O(m,n)&&(m=n),o.set(c,m),m},a=this._document,r=[...this._undo,this._document,...this._redo.slice().reverse()].map(s),d=this._undo.length,l=[],h=0;return r.forEach((c,u)=>{let m=l[l.length-1];m!==void 0&&(m===c||O(m,c))?u===d&&(l[l.length-1]=c):l.push(c),u===d&&(h=l.length-1)}),this._undo=l.slice(0,h),this._document=l[h],this._redo=l.slice(h+1).reverse(),this._base=n,this._revision=e,this._document!==a&&!O(this._document,a)}saved(n,e){e<this._revision||(this._coalesceKey=void 0,this._base=n,this._revision=e)}get saving(){return lt.has(this)}get saveDone(){return lt.get(this)}pushUndo(n){this._undo.push(n),this._undo.length>Bn&&this._undo.splice(0,this._undo.length-Bn)}},lt=new WeakMap;function Jn(t,n){if(lt.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"The HTTP actions are being saved already."});let e=qi(t,n).finally(()=>lt.delete(t));return lt.set(t,e),e}function Ji(t){let n=gt(t);return n.size<=n.limit?[]:[`The library is ${Math.ceil(n.size/1024)} KB, past the ${n.limit/1024} KB Home Assistant keeps.`]}async function qi(t,n){let e=!1,i=new Map,o=()=>i.size===0?{}:{kept:[...i.values()]},s=(a,r,d)=>({ok:!1,revision:t.revision,merged:e,code:a,message:r,...o(),...d===void 0?{}:{problems:d}});for(let a=1;;a++){let r=t.document,d=[...Ln(r),...Ji(r)];if(d.length>0)return s("invalid",d.join(" "),d);let l;try{({revision:l}=await n.save(t.revision,r))}catch(h){let{code:c="unknown",message:u}=M(h);if(c!=="conflict"||a>=Bi)return s(c,u);let m;try{m=await n.fetch()}catch(w){let R=M(w);return s(R.code??"unknown",R.message)}let H=g(m)&&typeof m.revision=="number"?m.revision:0,x=g(m)&&g(m.document)?m.document:zt();H<t.revision?t.restart(x,H):t.rebase(x,H);for(let w of t.kept)i.set(`${w.list}:${w.key}`,w);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0,...o()};continue}return t.saved(r,l),{ok:!0,revision:t.revision,merged:e,...o()}}}var J;function Zt(){return J}function qn(t,n){let e=J;if(n<=0||t===void 0)return{...e===void 0?{}:{draft:e},mergedIntoEdits:!1,kept:[]};if(e===void 0||n<e.revision&&!e.dirty){let s=new _t(t,n);return J=s,{draft:s,mergedIntoEdits:!1,kept:[]}}if(n===e.revision)return{draft:e,mergedIntoEdits:!1,kept:[]};let i=e.dirty,o=n<e.revision?e.restart(t,n):e.rebase(t,n);return{draft:e,mergedIntoEdits:i&&o,kept:i?e.kept:[]}}function Fn(){return J??=new _t(zt(),0),J}function Qt(){return J?.dirty??!1}function Wn(){J=void 0}function Fi(t){return t.list==="global"?t.name.trim()===""?`{{${t.key}}}`:t.name:`"${t.name.trim()===""?"an untitled action":t.name}"`}function St(t){if(t.length===0)return"";let n=t.map(Fi);return`${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`} also changed somewhere else. ${n.length===1?"Your version was kept.":"Your versions were kept."}`}function Gn(t){if(t.ok){let e=t.kept??[];if(t.alreadySaved===!0){let i=e.length>0?` ${St(e)}`:"";return{kind:e.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.${i}`}}return e.length>0?{kind:"warn",text:`Saved. ${St(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The HTTP actions kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the HTTP actions${n===""?".":`: ${n}`}`}}case"busy":return{kind:"warn",text:"Already saving. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the HTTP actions just now. Your edits are kept, so try again in a moment."};case"unknown_command":return{kind:"err",text:"Not saved. Update the integration to edit HTTP actions here."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}var Wi=/"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\],:]/g;function Yn(t,n=2){let e=t.trim();if(e!==""){try{JSON.parse(e)}catch{return}return Xn(e.match(Wi)??[],n)}}function Xn(t,n){let e=[],i=0,o=()=>e.push({kind:"ws",text:`
${" ".repeat(i*n)}`}),s=[],a=()=>s.map(d=>d.key??String(d.index??0)).join("."),r=(d,l)=>e.push(s.length===0?{kind:d,text:l}:{kind:d,text:l,path:a()});for(let d=0;d<t.length;d+=1){let l=t[d],h=t[d+1];if(l.startsWith("{{"))e.push({kind:"var",text:l});else if(l==="{"||l==="["){let c=l==="{"?"}":"]";h===c?(e.push({kind:"punct",text:l+c}),d+=1):(e.push({kind:"punct",text:l}),s.push(l==="["?{index:0}:{}),i+=1,o())}else if(l==="}"||l==="]")s.pop(),i=Math.max(0,i-1),o(),e.push({kind:"punct",text:l});else if(l===","){let c=s[s.length-1];c?.index!==void 0&&(c.index+=1),e.push({kind:"punct",text:l}),o()}else if(l===":")e.push({kind:"punct",text:": "});else if(l.startsWith('"'))if(h===":"){let c=s[s.length-1];if(c!==void 0)try{c.key=String(JSON.parse(l))}catch{c.key=l.slice(1,-1)}e.push({kind:"key",text:l})}else r("str",l);else r(l==="true"||l==="false"||l==="null"?"lit":"num",l)}return e}var Gi=/\{\{[A-Za-z0-9_]+\}\}/g,Zn=/\{\{[A-Za-z0-9_]+\}\}|"(?:[^"\\\n]|\\.)*"?|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\btrue\b|\bfalse\b|\bnull\b|[{}[\],:]/g;function Qn(t,n=2){let e=t.trim();if(e==="")return;let i=[],o="",s=0;for(let a of e.matchAll(Zn)){if(e.slice(s,a.index).trim()!=="")return;i.push(a[0]),o+=a[0].startsWith("{{")?"0":a[0],s=a.index+a[0].length}if(e.slice(s).trim()===""){try{JSON.parse(o)}catch{return}return te(Xn(i,n))}}function ti(t,n){let e=[],i=0,o=[...t.matchAll(n?Zn:Gi)];return o.forEach((s,a)=>{s.index>i&&e.push({kind:"ws",text:t.slice(i,s.index)});let r=s[0];i=s.index+r.length;let d;if(r.startsWith("{{"))d="var";else if(r.startsWith('"')){let l=o[a+1];d=l!==void 0&&l[0]===":"&&t.slice(i,l.index).trim()===""?"key":"str"}else r==="true"||r==="false"||r==="null"?d="lit":/^[{}[\],:]$/.test(r)?d="punct":d="num";e.push({kind:d,text:r})}),i<t.length&&e.push({kind:"ws",text:t.slice(i)}),e}function te(t){return t.map(n=>n.text).join("")}function Pt(t){return t<1024?`${t} ${t===1?"byte":"bytes"}`:t<1024*1024?`${(t/1024).toFixed(1)} KB`:`${(t/(1024*1024)).toFixed(2)} MB`}var ae="ha:sel",oi="ha:tab",ai="ha:rtab",si="ha:bmode",ri="ha:bwrap",ee="ha:bcopied",ei="ha:qwrap",ne="ha:qcopied",se="ha:show:",di="ha:auth:",li="ha:test:",Q="ha:look",re="network",Yi="#CCD8E6",Xi="Web requests Home Assistant sends when a watch runs one, from a tile, a menu, a complication or a control. A save reaches every watch the next time it checks.",pi="Fixed values any action can use as {{key}}, such as a server address or a token. Change one here and every action that uses it follows.",Zi="The watch records a voice clip of up to 30 seconds when the action runs and sends it as the body, as audio/mp4. Nothing to type here.",Qi="This method sends no body. Pick POST, PUT, PATCH or DELETE to send one.",to=`Empty means ${jt} seconds. Home Assistant holds it between ${Ut} and ${Vt}.`,eo="Only for a server you run whose HTTPS certificate is not publicly trusted.",ci="With no URL the watch shows the action as needing setup.",no="Press Send to try this action. Home Assistant sends it. Nothing is saved.",io="For a value you choose on the watch each time, such as a brightness or a message. Type {{name}} in the URL, a header or the body, and the watch asks for it when you tap the action.",oo="This action asks for nothing. It runs as soon as you tap it.",ao="filled in from Globals, so the watch does not ask",so=[["none","None"],["json","JSON"],["form","Form"],["text","Text"],["audio","Voice clip"]],ro={none:void 0,json:"application/json",form:"application/x-www-form-urlencoded",text:"text/plain",audio:"audio/mp4"},lo={none:"Request body",json:'{"key": "value"}',form:"key=value&other=123",text:"Plain text",audio:""},po=[["none","None"],["statusCode","Status code"],["bodyText","Body text"],["jsonField","JSON field"],["header","Header"],["regex","Regex"]];function co(t,n,e){return`${t} ${t===1?n:e}`}function uo(t){if(at(t))return`${G(t)} \xB7 no URL yet`;let n=t.url.trim().replace(/^https?:\/\//i,"");return`${G(t)} \xB7 ${n}`}function ui(t){let n=t.trim().toUpperCase();switch(n){case"GET":return{text:"GET",tone:"get"};case"POST":return{text:"POST",tone:"post"};case"PUT":return{text:"PUT",tone:"put"};case"PATCH":return{text:"PATCH",tone:"patch"};case"DELETE":return{text:"DEL",tone:"del"};default:return{text:n===""?"?":n.slice(0,5),tone:"other"}}}function ho(t){let n=ui(t);return p`<span class="ha-mtag m-${n.tone}" title=${t.trim().toUpperCase()}>${n.text}</span>`}function hi(t){let n=t.uiState.get(ae);if(n?.kind==="action"&&W(t.document,n.id)!==void 0||n?.kind==="globals")return n;let e=N(t.document)[0];return typeof e?.id=="string"?{kind:"action",id:e.id}:void 0}function pt(t,n){n===void 0?t.uiState.delete(ae):t.uiState.set(ae,n),t.uiState.delete(Q),t.requestUpdate()}var fo=["headers","auth","body","prompts","reply","settings"],mo=["body","headers","paths"];function bo(t){let n=t.uiState.get(oi);return fo.includes(n)?n:"headers"}function fi(t,n){t.uiState.set(oi,n),t.requestUpdate()}function go(t){let n=t.uiState.get(ai);return mo.includes(n)?n:"body"}function vo(t,n){t.uiState.set(ai,n),t.requestUpdate()}function mi(t){return t.uiState.get(si)==="raw"?"raw":"pretty"}function xo(t){return t.uiState.get(ri)!==!1}function yo(t,n){let e=n.body??n.snippet,i=Yn(e),o=i!==void 0&&mi(t)==="pretty";return{raw:e,isJson:i!==void 0,pieces:o?i:void 0,text:o?te(i):e}}function bi(t,n,e,i,o,s){return p`<div class="ha-tabs ${s}" role="tablist" aria-label=${t}
    @keydown=${a=>{if(a.key!=="ArrowRight"&&a.key!=="ArrowLeft"&&a.key!=="Home"&&a.key!=="End")return;let r=e.findIndex(h=>h.id===i),d=a.key==="Home"?0:a.key==="End"?e.length-1:(r+(a.key==="ArrowRight"?1:-1)+e.length)%e.length;a.preventDefault(),o(e[d].id),a.currentTarget.querySelectorAll("[role=tab]")[d]?.focus()}}>
    ${e.map(a=>p`<button type="button" role="tab" class="ha-tab ${a.id===i?"on":""}" id=${`${n}-${a.id}`}
      aria-selected=${a.id===i?"true":"false"} aria-controls=${`${n}-panel`} tabindex=${a.id===i?"0":"-1"}
      @click=${()=>o(a.id)}>${a.label}${a.extra??f}</button>`)}
  </div>`}var Ot=t=>t===0?f:p`<span class="ha-tab-n">${t}</span>`,ie=t=>t?p`<i class="ha-tab-dot" aria-label="set"></i>`:f;function C(t,n,e,i){return t.edit(o=>kn(e(o),n,()=>t.newId()),i)}function Et(t){let n=t.newId();return t.edit(e=>dn(e,sn(n,rn(e)))),pt(t,{kind:"action",id:n}),n}function wo(t){let n=t.newId();return t.edit(e=>On(e,n,Pn(e))),pt(t,{kind:"globals"}),n}function Ho(t,n){let e;t.edit(i=>{let o=ln(i,n,()=>t.newId());return e=o.id,o.document}),e!==void 0&&pt(t,{kind:"action",id:e})}function Dt(t){return t.uiState.has(Q)?(t.uiState.delete(Q),t.requestUpdate(),!0):!1}function gi(t,n){return t.uiState.get(se+n)===!0}function ko(t,n){gi(t,n)?t.uiState.delete(se+n):t.uiState.set(se+n,!0),t.requestUpdate()}function le(t,n,e,i,o,s=""){let a=gi(t,o);return p`<span class="ha-secret">
    <input type=${a?"text":"password"} class="mono" .value=${e} placeholder=${s} aria-label=${n}
      autocomplete="off" spellcheck="false" data-secret=${o}
      @input=${r=>i(r.target.value)} />
    <button type="button" class="ha-show" aria-pressed=${a?"true":"false"} aria-label=${`${a?"Hide":"Show"} ${n}`}
      @click=${()=>ko(t,o)}>${a?"Hide":"Show"}</button>
  </span>`}function oe(t,n,e,i,o,s=""){return p`<div class="field ha-secret-field"><span>${n}</span>${le(t,n,e,i,o,s)}</div>`}function vi(t,n,e,i={}){return p`<label class="ha-switch"><input type="checkbox" .checked=${n} ?disabled=${i.disabled===!0}
    @change=${o=>e(o.target.checked)} /><span>${t}</span></label>`}function pe(t,n){let e=t.uiState.get(di+n.id);if(e!==void 0){let i=e.headerId===void 0?void 0:n.headers.find(s=>s.id===e.headerId);if(i===void 0)return{auth:e.auth.kind===e.kind?e.auth:V(e.kind)};if(e.kind==="apiKey")return{auth:{...V("apiKey"),headerName:i.name,apiKeyValue:i.value},headerId:i.id};let o=wt(i);return o!==void 0&&o.kind===e.kind?{auth:o,headerId:i.id}:{auth:V(e.kind),headerId:i.id}}return wn(n.headers)}function To(t,n,e,i){let{headerId:o}=pe(t,n),s=o;C(t,n.id,a=>{let r=Hn(a,n.id,o,e);return s=r.headerId,r.document},i),t.uiState.set(di+n.id,{kind:e.kind,auth:e,...s===void 0?{}:{headerId:s}}),t.requestUpdate()}function Ao(t,n){let{auth:e}=pe(t,n),i=(r,d)=>To(t,n,{...e,...r},d),o=r=>`auth:${n.id}:${r}`,s=f;e.kind==="bearer"?s=oe(t,"Token",e.token,r=>i({token:r},o("token")),o("token"),"Paste the token"):e.kind==="basic"?s=p`${U("Username",e.username,r=>i({username:r},o("user")))}
      ${oe(t,"Password",e.password,r=>i({password:r},o("password")),o("password"))}`:e.kind==="apiKey"&&(s=p`${U("Header",e.headerName,r=>i({headerName:r},o("name")),{mono:!0,placeholder:"X-Api-Key"})}
      ${oe(t,"Key",e.apiKeyValue,r=>i({apiKeyValue:r},o("key")),o("key"),"Paste the key")}`);let a=e.kind==="none"?"Add sign-in if the server asks for it. It is written as one header.":e.kind==="basic"?"Sent as an Authorization header, the username and password encoded together.":e.kind==="bearer"?"Sent as Authorization: Bearer and the token.":"Sent as a header with the key as its value.";return p`<p class="ha-line">${a}</p>
    <div class="ha-form">
      ${Lt("Type",e.kind,yn,r=>i({kind:r}),{snapBack:!0})}
      ${s}
    </div>`}function $o(t,n,e,i){return t.icons.render(n,e,i)??p`<span class="ha-glyph-dot" style=${`background:${i}`}></span>`}function xi(t){return n=>{n.target!==n.currentTarget||n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),t())}}function _o(t,n,e,i,o){let s=vt(n),a=()=>pt(t,{kind:"action",id:n.id}),r=at(n);return p`<div class="ha-item ${o?"on":""}" role="listitem" tabindex="0" data-action=${n.id}
    aria-current=${o?"true":"false"} aria-label=${s} title=${`${s} \xB7 ${uo(n)}`}
    @click=${d=>{d.target instanceof Element&&d.target.closest("button")||a()}}
    @keydown=${xi(a)}>
    ${ho(G(n))}
    <span class="ha-item-name">${s}</span>
    ${r?p`<span class="ha-need-mark" title=${ci}>needs setup</span>`:f}
    ${Bt(n)?p`<span class="ha-mark">voice</span>`:f}
    <span class="ha-item-acts">
      <button type="button" class="icon" ?disabled=${t.busy||e===0} title="Move up" aria-label=${`Move ${s} up`}
        @click=${()=>t.edit(d=>qt(d,n.id,e-1))}>${A("up")}</button>
      <button type="button" class="icon" ?disabled=${t.busy||e===i-1} title="Move down" aria-label=${`Move ${s} down`}
        @click=${()=>t.edit(d=>qt(d,n.id,e+1))}>${A("down")}</button>
    </span>
  </div>`}function yi(t){let n=N(t.document).map(I),e=it(t.document).length,i=hi(t),o=i?.kind==="globals",s=()=>pt(t,{kind:"globals"});return p`<section class="card lc ha-list-card" aria-label="Actions" style="--c: var(--wa-lc-layers, #4a7fe8)">
    <div class="lc-head">
      <span class="swatch">${A("globe")}</span><span class="lc-title">Actions</span>
      <span class="lc-sub" title=${Xi}>${n.length}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri ha-add" aria-label="Add an action" ?disabled=${t.busy}
        title="A new action" @click=${()=>Et(t)}>${A("plus")}<span>Add</span></button>
    </div>
    ${n.length===0?p`<div class="lc-note ha-list-note">No actions yet. Add one to send a request from the watch.</div>`:p`<div class="ha-items" role="list">${n.map((a,r)=>_o(t,a,r,n.length,i?.kind==="action"&&i.id===a.id))}</div>`}
    <div class="ha-list-foot">
      <div class="ha-item ha-globals-item ${o?"on":""}" role="button" tabindex="0" aria-pressed=${o?"true":"false"}
        title=${pi} @click=${s} @keydown=${xi(s)}>
        <span class="ha-mtag ha-gtag" aria-hidden="true">{ }</span>
        <span class="ha-item-name">Globals</span>
        <span class="ha-count">${e}</span>
      </div>
    </div>
  </section>`}function So(t){let n=t.trim();if(n===""||n.startsWith("{"))return;let e=n.toLowerCase();return e.startsWith("http://")||e.startsWith("https://")?void 0:"Add http:// or https://. Without one the request will not send."}function Po(t,n){let e=n.id;return p`<div class="ha-look-pop" role="dialog" aria-label="Icon and color">
    <fieldset class="ha-set" ?disabled=${t.busy}>
      <div class="ha-stack">${Ve({icons:t.icons,symbols:t.symbols},n.icon??re,i=>t.edit(o=>un(o,e,i===re?"":i),`a:${e}:icon`),`ha:icon:${e}`,void 0,"Icon",!1)}</div>
      ${Ue("Color",n.iconColor,i=>t.edit(o=>hn(o,e,i),`a:${e}:color`),!0,null)}
    </fieldset>
    <div class="ha-pop-foot"><span class="ha-line">The icon and color the action wears on the watch.</span>
      <button type="button" class="pe-btn ha-sm" @click=${()=>Dt(t)}>Done</button></div>
  </div>`}function Oo(t,n){let e=n.id,i=n.iconColor??Yi,o=t.uiState.get(Q)===e;return p`<div class="ha-titlerow">
    <span class="ha-look">
      <button type="button" class="ha-look-btn" style=${`--c:${i}`} aria-haspopup="dialog" aria-expanded=${o?"true":"false"}
        title="Icon and color" aria-label="Icon and color"
        @click=${()=>{o?t.uiState.delete(Q):t.uiState.set(Q,e),t.requestUpdate()}}>
        <span class="ha-look-glyph">${$o(t,n.icon??re,16,i)}</span>
      </button>
      ${o?Po(t,n):f}
    </span>
    <input type="text" class="ha-name" .value=${n.name} placeholder="My action" aria-label="Name" ?disabled=${t.busy}
      @input=${s=>t.edit(a=>cn(a,e,s.target.value),`a:${e}:name`)} />
    <span class="ha-title-acts">
      <button type="button" class="pe-btn ha-sm" ?disabled=${t.busy} title="A copy with new ids, named Copy"
        @click=${()=>Ho(t,e)}>${A("duplicate")}<span>Duplicate</span></button>
      <button type="button" class="pe-btn ha-sm pe-danger" ?disabled=${t.busy}
        title="Remove this action. Tiles and menu items that run it stop working."
        @click=${()=>t.edit(s=>pn(s,e))}>${A("delete")}<span>Remove</span></button>
    </span>
  </div>`}function Eo(t,n){let e=n.id,i=j(t,e),o=at(n),s=G(n),a=ui(s),r=nt.includes(s),d=So(n.url);return p`<div class="ha-reqbar">
      <div class="ha-reqbox">
        <select class="ha-method m-${a.tone}" aria-label="Method" ?disabled=${t.busy} .value=${s}
          @change=${l=>{C(t,e,h=>fn(h,e,l.target.value)),t.requestUpdate()}}>
          ${r?f:p`<option value=${s} selected>${s}</option>`}
          ${nt.map(l=>p`<option value=${l} ?selected=${l===s}>${l}</option>`)}
        </select>
        <input type="text" class="ha-url mono" .value=${n.url} placeholder="https://example.com/api" aria-label="URL"
          spellcheck="false" autocomplete="off" ?disabled=${t.busy}
          @input=${l=>C(t,e,h=>mn(h,e,l.target.value),`a:${e}:url`)}
          @keydown=${l=>{l.key!=="Enter"||l.isComposing||(l.preventDefault(),ii(t,e))}} />
      </div>
      <button type="button" class="pe-btn pe-primary ha-send ${i.running?"busy":""}" ?disabled=${i.running||o}
        aria-busy=${i.running?"true":"false"} title=${o?"Add a URL first":"Send it now (Enter in the URL)"}
        @click=${()=>{ii(t,e)}}>${i.running?"Sending\u2026":"Send"}</button>
    </div>
    ${d===void 0&&!o?f:p`<div class="ha-barnote">
      ${d===void 0?f:p`<p class="ha-warn">${d}</p>`}
      ${o?p`<p class="ha-warn">${ci}</p>`:f}
    </div>`}`}function Do(t,n,e){let i=n.id,o=e===void 0?void 0:n.headers.find(a=>a.id===e),s=n.headers.filter(a=>a.id!==e);return p`<div class="ha-table ha-htable" role="table" aria-label="Headers">
    <div class="ha-tr ha-th" role="row"><span role="columnheader">Key</span><span role="columnheader">Value</span><span></span></div>
    ${o===void 0?f:p`<div class="ha-tr ha-auth-row" role="row">
      <span class="ha-td ha-ro mono" role="cell">${o.name}</span>
      <span class="ha-td ha-ro" role="cell"><span class="ha-dots" aria-label="Hidden">••••••••</span></span>
      <span class="ha-td ha-end" role="cell"><button type="button" class="ha-from-auth" title="Written by the Auth tab. Edit it there."
        @click=${()=>fi(t,"auth")}>Auth</button></span>
    </div>`}
    ${s.map(a=>p`<div class="ha-tr" role="row">
      <span class="ha-td" role="cell"><input type="text" class="mono" .value=${a.name} placeholder="Name" aria-label="Header name" spellcheck="false"
        @input=${r=>C(t,i,d=>yt(d,i,a.id,{name:r.target.value}),`h:${a.id}:name`)} /></span>
      <span class="ha-td" role="cell">${le(t,`${a.name.trim()||"Header"} value`,a.value,r=>C(t,i,d=>yt(d,i,a.id,{value:r}),`h:${a.id}:value`),`header:${a.id}`,"Value")}</span>
      <span class="ha-td ha-end" role="cell"><button type="button" class="icon ha-remove" title="Remove this header" aria-label=${`Remove ${a.name.trim()||"header"}`}
        @click=${()=>C(t,i,r=>Wt(r,i,a.id))}>${A("delete")}</button></span>
    </div>`)}
    <div class="ha-tr ha-addrow" role="row"><button type="button" class="ha-add-row" @click=${()=>C(t,i,a=>xn(a,i,t.newId()))}>${A("plus")}<span>Add header</span></button></div>
  </div>
  <p class="ha-line">Header values stay hidden until shown.</p>`}function Ro(t,n){if(!ot(n))return p`<p class="ha-line">${Qi}</p>`;let e=n.bodyContentType,i=ro[e];return p`<div class="ha-body-head">
      <label class="ha-inline"><span>Type</span>
        <select .value=${e} @change=${o=>{C(t,n.id,s=>bn(s,n.id,o.target.value)),t.requestUpdate()}}>
          ${so.map(([o,s])=>p`<option value=${o} ?selected=${o===e}>${s}</option>`)}
        </select></label>
      ${i===void 0?f:p`<span class="ha-line">Sends Content-Type: ${i}, unless a header sets one.</span>`}
    </div>
    ${e==="audio"?p`<p class="ha-line ha-audio">${Zi}</p>`:Co(t,n,e)}`}function Co(t,n,e){let i=n.body??"",o=e==="json",s=o?Qn(i):void 0,a=t.uiState.get(ei)!==!1,r=t.uiState.get(ne)===!0,d=(c,u)=>{t.uiState.set(c,u),t.requestUpdate()},l=async()=>{try{await navigator.clipboard.writeText(i),d(ne,!0),setTimeout(()=>d(ne,!1),1500)}catch{}},h=o&&i.trim()!==""&&s===void 0;return p`<div class="ha-bbar ha-qbar" role="toolbar" aria-label="Body options">
      ${o?p`<button type="button" class="ha-bopt" title=${h?"The body is not JSON":"Indent the JSON"}
        ?disabled=${t.busy||s===void 0||s===i}
        @click=${()=>{s!==void 0&&C(t,n.id,c=>Ft(c,n.id,s))}}>Format</button>`:f}
      <button type="button" class="ha-bopt ${a?"on":""}" aria-pressed=${a?"true":"false"} title="Wrap long lines" @click=${()=>d(ei,!a)}>Wrap</button>
      <button type="button" class="ha-bopt" title="Copy the body" ?disabled=${i===""} @click=${()=>{l()}}>${r?"Copied":"Copy"}</button>
      <span class="ha-bmeta">${h?p`<span class="ha-bad">Not JSON</span> · `:f}${Pt(new TextEncoder().encode(i).length)}</span>
    </div>
    <div class="ha-code ${a?"":"nowrap"}">
      <pre class="mono" aria-hidden="true">${ti(i,o).map(c=>c.kind==="ws"||c.kind==="punct"?c.text:p`<span class=${`j-${c.kind}`}>${c.text}</span>`)}${`
`}</pre>
      <textarea class="mono ha-body-text" spellcheck="false" autocapitalize="off" autocomplete="off" wrap=${a?"soft":"off"} aria-label="Body" .value=${i} placeholder=${lo[e]}
        @scroll=${c=>{let u=c.target,m=u.previousElementSibling;m!==null&&(m.scrollTop=u.scrollTop,m.scrollLeft=u.scrollLeft)}}
        @input=${c=>C(t,n.id,u=>Ft(u,n.id,c.target.value),`a:${n.id}:body`)}></textarea>
    </div>`}function ni(t,n,e,i){let o=(a,r)=>t.edit(d=>Tn(d,n.id,e.id,a),r),s=Jt(e);return p`<div class="ha-var ${i?"unused":""}" data-key=${e.key}>
    <div class="ha-var-head"><code>{{${e.key}}}</code>
      ${i?p`<span class="ha-mark">unused, left out when saved</span>
        <button type="button" class="icon ha-remove" title="Remove" aria-label=${`Remove {{${e.key}}}`}
          @click=${()=>t.edit(a=>An(a,n.id,e.id))}>${A("delete")}</button>`:f}
    </div>
    ${i?f:p`<div class="ha-var-grid">
      ${U("Prompt",e.prompt,a=>o({prompt:a},`v:${e.id}:prompt`),{placeholder:"Message"})}
      ${je("Kind",e.kind,[["text","Text"],["number","Number"]],a=>o({kind:a}))}
      <label class="field ha-quick"><span>Quick values</span>
        <textarea rows=${Math.max(2,Math.min(6,e.presetValues.length+1))} .value=${e.presetValues.join(`
`)} placeholder="One per line"
          @input=${a=>o({presetValues:a.target.value.split(`
`)},`v:${e.id}:presets`)}></textarea></label>
      <div class="ha-only">${vi("Only these",e.presetsOnly,a=>o({presetsOnly:a}),{disabled:s.length===0&&!e.presetsOnly})}
        <span class="ha-line">${s.length===0?"Add a quick value to offer only these.":e.presetsOnly?"The watch shows only the quick values, with no typing.":"The watch offers the quick values and lets you type too."}</span></div>
    </div>`}
  </div>`}function Lo(t,n){let e=z(t.document),i=Y(n,e),o=$n(n,e),s=i.asked.filter(a=>!n.variables.some(r=>r.key===a));return p`<p class="ha-line" title=${In}>${io}</p>
    ${i.global.length===0?f:p`<p class="ha-from-globals">${i.global.map(a=>p`<code>{{${a}}}</code>`)} <span>${ao}</span></p>`}
    ${i.asked.length===0&&o.length===0?p`<p class="ha-quiet">${oo}</p>`:f}
    ${st(n,e).map(a=>ni(t,n,a,!1))}
    ${s.map(a=>p`<div class="ha-var" data-key=${a}><div class="ha-var-head"><code>{{${a}}}</code><span class="ha-need-mark">not set up</span>
      <span class="ha-line">Sent as typed until it is set up.</span>
      <button type="button" class="pe-btn ha-sm" @click=${()=>C(t,n.id,r=>r)}>Ask for it on the watch</button></div></div>`)}
    ${o.map(a=>ni(t,n,a,!0))}`}function No(t,n){let e=n.id,i=n.reply,o=i?.source??"none",s=j(t,e),a=i===void 0?void 0:Gt[i.source],r=a==="jsonPath"?U("JSON path",i?.jsonPath??"",l=>t.edit(h=>B(h,e,"jsonPath",l),`r:${e}:path`),{mono:!0,placeholder:"result.price"}):a==="headerName"?U("Header",i?.headerName??"",l=>t.edit(h=>B(h,e,"headerName",l),`r:${e}:header`),{mono:!0,placeholder:"X-RateLimit-Remaining"}):a==="pattern"?U("Pattern",i?.pattern??"",l=>t.edit(h=>B(h,e,"pattern",l),`r:${e}:pattern`),{mono:!0,placeholder:"temperature=([0-9.]+)"}):f,d=i===void 0?"Pick what to take from the reply to show on the watch, as a tile's value or in the banner after it runs.":a==="jsonPath"?"Or type the path: keys joined by dots, a number for an item of a list (data.0.temp).":a==="pattern"?"The first group in brackets, else the whole match.":"Shown on the watch, as a tile's value or in the banner after it runs.";return p`${a==="jsonPath"?p`<p class="ha-info">Press Send, then click a value in the response below to use it as the reply value.</p>`:f}
    <p class="ha-line">${d}</p>
    <div class="ha-form">
      ${Lt("Read",o,po,l=>t.edit(h=>Ht(h,e,l==="none"?void 0:l)),{snapBack:!0})}
      ${r}
      ${i===void 0?f:U("Unit",i.unit??"",l=>t.edit(h=>B(h,e,"unit",l),`r:${e}:unit`),{placeholder:"\xB0, $, kWh"})}
    </div>
    ${i===void 0?f:p`<p class="ha-reply-now" role="status">${s.reply===void 0||s.running?p`<span class="ha-muted">Press Send to see the value the watch would show.</span>`:p`On the watch, from the last answer: ${wi(n,s)}`}</p>`}`}function Mo(t,n){let e=n.id;return p`<div class="ha-form ha-settings">
      ${Ie("Timeout",n.timeout,i=>t.edit(o=>gn(o,e,i),`a:${e}:timeout`),{optional:!0,min:Ut,max:Vt,step:1,unit:"s",placeholder:String(jt),def:null})}
      <p class="ha-line ha-under">${to}</p>
    </div>
    <div class="ha-setting">
      ${vi("Accept a self-signed certificate",n.allowsUntrustedCertificate,i=>t.edit(o=>vn(o,e,i)))}
      <p class="ha-line">${eo}</p>
    </div>
    ${n.presentsClientCertificate?p`<p class="ha-warn ha-cert">This action asks for a client certificate. ${$t}</p>`:f}`}function Io(t){return ot(t)?t.bodyContentType==="audio"||(t.body??"").trim()!=="":!1}function jo(t,n){let{headerId:e,auth:i}=pe(t,n),o=bo(t),s=st(n,z(t.document)).length,a=[{id:"headers",label:"Headers",extra:Ot(n.headers.length)},{id:"auth",label:"Auth",extra:ie(i.kind!=="none")},{id:"body",label:"Body",extra:ie(Io(n))},{id:"prompts",label:"Ask on watch",extra:Ot(s)},{id:"reply",label:"Reply value",extra:ie(n.reply!==void 0)},{id:"settings",label:"Settings"}],r=o==="headers"?Do(t,n,e):o==="auth"?Ao(t,n):o==="body"?Ro(t,n):o==="prompts"?Lo(t,n):o==="reply"?No(t,n):Mo(t,n);return p`<div class="ha-req">
    ${bi("Request","ha-tab",a,o,d=>fi(t,d),"ha-req-tabs")}
    <div class="ha-tabbody tab-${o}" role="tabpanel" id="ha-tab-panel" aria-labelledby=${`ha-tab-${o}`}>
      <fieldset class="ha-set" ?disabled=${t.busy}>${r}</fieldset>
    </div>
  </div>`}function Uo(t,n){let e=n.reply;if(e===void 0||t.reply===void 0)return{found:!1,stale:!1};if(n.sent===JSON.stringify(t.reply))return e.value===null?{found:!1,stale:!1}:{value:e.value,found:!0,stale:!1};if(t.reply.source!=="jsonField"||e.leaves===void 0)return{found:!1,stale:!0};let i=(t.reply.jsonPath??"").trim(),o=e.leaves.find(a=>a.path===i);return o!==void 0?{value:`${o.value}${t.reply.unit??""}`,found:!0,stale:!1}:{found:!1,stale:i!==""&&e.leaves.some(a=>a.path.startsWith(`${i}.`))||e.leaves_cut===!0||i===""}}function j(t,n){return t.uiState.get(li+n)??{values:{},running:!1,run:0}}function de(t,n,e){t.uiState.set(li+n,e),t.requestUpdate()}function Vo(t,n,e){let i={};for(let o of st(t,n)){let s=e[o.key];i[o.key]=s!==void 0?s:o.presetValues[0]??""}return i}async function ii(t,n){let e=W(t.document,n);if(e===void 0)return;let i=I(e);if(at(i))return;let o=j(t,n);if(o.running)return;let s=o.run+1,a=Vo(i,z(t.document),o.values);de(t,n,{values:o.values,running:!0,run:s});let r=it(t.document),d;try{let l=await t.test(e,r,a);d={values:j(t,n).values,running:!1,reply:l,sent:JSON.stringify(i.reply),run:s}}catch(l){d={values:j(t,n).values,running:!1,error:zo(l),run:s}}j(t,n).run===s&&de(t,n,d)}function zo(t){let n=t,e=typeof n?.code=="string"?n.code:typeof n?.error?.code=="string"?n.error.code:void 0,i=typeof n?.message=="string"?n.message:typeof n?.error?.message=="string"?n.error.message:"";return e==="unknown_command"?"This version of the integration cannot test an action. Update it to test here.":e==="invalid"?`Home Assistant could not build the request${i===""?".":`: ${i}`}`:i===""?"No answer from Home Assistant.":i}function Ko(t,n,e,i){let o=Jt(e),s=i.values[e.key]??o[0]??"",a=l=>de(t,n.id,{...j(t,n.id),values:{...j(t,n.id).values,[e.key]:l}}),r=e.prompt.trim()===""?e.key:e.prompt.trim();if(e.presetsOnly&&o.length>0)return p`<label class="ha-tv"><span>${r}</span>
      <select .value=${s} @change=${l=>a(l.target.value)}>
        ${o.map(l=>p`<option value=${l} ?selected=${l===s}>${l}</option>`)}
      </select></label>`;let d=`ha-q-${e.id}`;return p`<label class="ha-tv"><span>${r}</span>
    <input type="text" inputmode=${e.kind==="number"?"decimal":f} .value=${s} list=${o.length===0?f:d}
      placeholder=${e.key} @input=${l=>a(l.target.value)} />
    ${o.length===0?f:p`<datalist id=${d}>${o.map(l=>p`<option value=${l}></option>`)}</datalist>`}</label>`}function Bo(t){return t.status===null?"err":t.status>=200&&t.status<300?"ok":"warn"}function wi(t,n){let e=Uo(t,n);return p`<span class="ha-val"><b>Value</b>${e.found?p`<code>${e.value}</code>`:p`<span class="ha-muted">${e.stale?"Send to see it":"Not found"}</span>`}</span>`}function Jo(t,n,e){if(e.body_binary===!0)return p`<p class="ha-quiet">The body is not text (${Pt(e.body_size??0)}).</p>`;let i=yo(t,e);if(i.raw==="")return p`<p class="ha-quiet">No body.</p>`;let o=i.isJson?mi(t):"raw",s=xo(t),a=new Set((e.leaves??[]).map(u=>u.path)),r=n.reply?.source==="jsonField"?(n.reply.jsonPath??"").trim():void 0,d=t.uiState.get(ee)===!0,l=(u,m)=>{t.uiState.set(u,m),t.requestUpdate()},h=async()=>{try{await navigator.clipboard.writeText(i.text),l(ee,!0),setTimeout(()=>l(ee,!1),1500)}catch{}},c=(u,m)=>p`<button type="button" class="ha-bopt ${o===u?"on":""}" aria-pressed=${o===u?"true":"false"}
    ?disabled=${!i.isJson} title=${i.isJson?u==="pretty"?"Indented and colored":"As the server sent it":"The body is not JSON"}
    @click=${()=>l(si,u)}>${m}</button>`;return p`<div class="ha-bbar" role="toolbar" aria-label="Body options">
      <span class="ha-bseg">${c("pretty","Pretty")}${c("raw","Raw")}</span>
      <button type="button" class="ha-bopt ${s?"on":""}" aria-pressed=${s?"true":"false"} title="Wrap long lines" @click=${()=>l(ri,!s)}>Wrap</button>
      <button type="button" class="ha-bopt" title="Copy the body as shown" @click=${()=>{h()}}>${d?"Copied":"Copy"}</button>
      <span class="ha-bmeta">${i.isJson?"JSON":"Text"}${e.body_size===void 0?f:p` · ${Pt(e.body_size)}`}${e.body===void 0?p` · <span title="Update the integration to see the whole body.">first line only</span>`:f}${e.body_cut===!0?" \xB7 cut at the size limit":f}</span>
    </div>
    ${a.size===0||i.pieces===void 0?f:p`<p class="ha-info ha-pickline">Click a value to use it as the reply value.</p>`}
    <pre class="ha-snippet mono ${s?"":"nowrap"}">${i.pieces===void 0?i.text:i.pieces.map(u=>{if(u.kind==="ws"||u.kind==="punct")return u.text;if(u.path===void 0||!a.has(u.path))return p`<span class=${`j-${u.kind}`}>${u.text}</span>`;let m=u.path,H=r===m;return p`<span class=${`j-${u.kind} j-pick ${H?"on":""}`} role="button" tabindex="0" aria-pressed=${H?"true":"false"}
          title=${H?`The reply value: ${m}`:`Use ${m} as the reply value`}
          @click=${()=>{t.busy||t.edit(x=>kt(x,n.id,m))}}
          @keydown=${x=>{x.key!=="Enter"&&x.key!==" "||(x.preventDefault(),t.busy||t.edit(w=>kt(w,n.id,m)))}}>${u.text}</span>`})}</pre>`}function qo(t,n,e){let i=go(t),o=Object.entries(e.headers??{}),s=[{id:"body",label:"Body"},{id:"headers",label:"Headers",extra:Ot(o.length)},{id:"paths",label:"Paths",extra:Ot(e.paths.length)}],a;return i==="body"?a=Jo(t,n,e):i==="headers"?a=o.length===0?p`<p class="ha-quiet">No headers.</p>`:p`<div class="ha-rlist" role="list" aria-label="Reply headers">
      ${o.map(([r,d])=>{let l=n.reply?.source==="header"&&n.reply.headerName===r;return p`<div class="ha-rrow ${l?"on":""}" role="listitem"><code>${r}</code><span class="mono ha-rval">${d}</span>
          <button type="button" class="ha-use" title=${`Read the ${r} header`} ?disabled=${t.busy}
            @click=${()=>t.edit(h=>Sn(h,n.id,r))}>${l?"Reply value":"Use"}</button></div>`})}</div>`:a=e.paths.length===0?p`<p class="ha-quiet">No JSON fields found.</p>`:p`<div class="ha-rlist" role="list" aria-label="JSON fields found">
      ${e.paths.map(r=>{let d=n.reply?.source==="jsonField"&&n.reply.jsonPath===r.path;return p`<button type="button" role="listitem" class="ha-rrow ha-path ${d?"on":""}" title=${`${r.path} is ${r.value}. Read this field.`} ?disabled=${t.busy}
          @click=${()=>t.edit(l=>kt(l,n.id,r.path))}><code>${r.path}</code><span class="mono ha-rval">${r.value}</span><span class="ha-use-word">${d?"Reply value":"Use"}</span></button>`})}</div>`,p`${bi("Response","ha-rtab",s,i,r=>vo(t,r),"ha-resp-tabs")}
    <div class="ha-resp-body" role="tabpanel" id="ha-rtab-panel" aria-labelledby=${`ha-rtab-${i}`}>${a}</div>`}function Fo(t,n){let e=j(t,n.id),i=st(n,z(t.document)),o=e.running?void 0:e.reply,s=o===void 0?void 0:Bo(o);return p`<section class="ha-resp" aria-label="Response">
    <div class="ha-resp-head" role="status">
      <span class="ha-cap">Response</span>
      ${o===void 0?f:p`
        <span class="ha-status ${s}">${o.status===null?"No answer":`HTTP ${o.status}`}</span>
        <span class="ha-ms">${o.elapsed_ms} ms</span>
        ${n.reply===void 0?f:wi(n,e)}`}
    </div>
    ${i.length===0?f:p`<div class="ha-testvals" role="group" aria-label="Test values"><span class="ha-cap2">Test values</span>
      ${i.map(a=>Ko(t,n,a,e))}</div>`}
    ${e.running?p`<p class="ha-quiet ha-pad">Sending…</p>`:e.error!==void 0?p`<p class="ha-test-err ha-pad" role="status">${e.error}</p>`:o===void 0?p`<p class="ha-quiet ha-pad">${no}${Bt(n)?" A test sends no voice clip.":""}</p>`:p`${o.error?p`<p class="ha-test-err ha-pad">${o.error}</p>`:f}${qo(t,n,o)}`}
  </section>`}function Wo(t,n){return p`<div class="ha-main-in" data-action=${n.id}>
    ${Oo(t,n)}
    ${Eo(t,n)}
    ${jo(t,n)}
    ${Fo(t,n)}
  </div>`}function Go(t){let n=it(t.document).map(Kt),e=new Map;for(let i of n)e.set(i.key.trim(),(e.get(i.key.trim())??0)+1);return p`<div class="ha-main-in ha-globals">
    <div class="ha-titlerow">
      <span class="ha-mtag ha-gtag big" aria-hidden="true">{ }</span>
      <h3 class="ha-h">Globals</h3><span class="ha-count">${n.length}</span>
      <span class="ha-title-acts"></span>
    </div>
    <div class="ha-scroll">
      <p class="ha-line ha-glead">${pi}</p>
      <fieldset class="ha-set" ?disabled=${t.busy}>
      <div class="ha-table ha-gtable" role="table" aria-label="Globals">
        <div class="ha-tr ha-th" role="row"><span role="columnheader">Key</span><span role="columnheader">Value</span><span role="columnheader">Used by</span><span></span></div>
        ${n.map(i=>{let o=i.key.trim(),s=Cn(t.document,o);return p`<div class="ha-tr" role="row" data-global=${i.id}>
            <span class="ha-td" role="cell"><input type="text" class="mono" .value=${i.key} placeholder="haurl"
              aria-label="Key" spellcheck="false" @input=${a=>t.edit(r=>En(r,i.id,a.target.value),`g:${i.id}:key`)} /></span>
            <span class="ha-td" role="cell">${le(t,`${o===""?"Global":o} value`,i.value,a=>t.edit(r=>Dn(r,i.id,a),`g:${i.id}:value`),`global:${i.id}`,"https://ha.local:8123")}</span>
            <span class="ha-td ha-users" role="cell" title=${s.length===0?"No action uses it yet.":`Used by ${s.join(", ")}.`}>${s.length===0?p`<span class="ha-muted">Not used yet</span>`:co(s.length,"action","actions")}</span>
            <span class="ha-td ha-end" role="cell"><button type="button" class="icon ha-remove" aria-label=${`Remove ${o===""?"this global":`{{${o}}}`}`}
              title=${s.length===0?"Remove this global":"Remove this global. The actions that use it send the {{key}} as typed."}
              @click=${()=>t.edit(a=>Rn(a,i.id))}>${A("delete")}</button></span>
            ${o===""?p`<p class="ha-warn ha-rowwarn">A global needs a key before it can be saved.</p>`:(e.get(o)??0)>1?p`<p class="ha-warn ha-rowwarn">Another global has this key. Each key must be its own.</p>`:f}
          </div>`})}
        <div class="ha-tr ha-addrow" role="row"><button type="button" class="ha-add-row ha-add-global" @click=${()=>wo(t)}>${A("plus")}<span>Add global</span></button></div>
      </div>
      </fieldset>
      <p class="ha-line">Type {{key}} in a URL, header or body. It is filled in as typed, before the values asked for on the watch. Values stay hidden until shown.</p>
    </div>
  </div>`}function Hi(t){let n=hi(t);return n?.kind==="globals"?Go(t):n?.kind==="action"?Wo(t,I(W(t.document,n.id))):p`<div class="ha-empty-main">
    <b>${Tt}</b>
    <span>An HTTP action is a web request a watch asks Home Assistant to send. Add one to start, or a global for a value several actions share.</span>
    <button type="button" class="pe-btn pe-primary" ?disabled=${t.busy} @click=${()=>Et(t)}>${A("plus")}<span>${At}</span></button>
  </div>`}var ki=ft`
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
`;Fe({dirty:Qt,drop:Wn});typeof window<"u"&&window.addEventListener("beforeunload",t=>{Qt()&&(t.preventDefault(),t.returnValue="")});var Yo=15e3,Si=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),ce=Si?"\u2318":"Ctrl+",ct={min:200,max:520,middleMin:520},ue={left:280,right:0},he="wrist-assistant-panel.http-actions.columns.v1",Xo=8,Ti=760;function Zo(t,n){let e=Ce(n,ct);return t<=0?e:Math.max(ct.min,Math.min(e,t-ct.middleMin))}function Ai(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function $i(t){let n=t?Date.parse(t):NaN;return Number.isNaN(n)?"":we(Math.max(0,(Date.now()-n)/1e3))}function Qo(t){return t instanceof HTMLElement?Ke(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function ta(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function fe(t,n){let e=[],i=[];if(t===void 0||t.revision<=0)return{collected:e,waiting:i};for(let o of n)((t.delivered?.[o.owner_watch_id]??0)>=t.revision?e:i).push(Re(o,n));return{collected:e,waiting:i}}function ea(t,n){if(t.updated_by==="panel")return"saved here";let e=n.find(i=>i.owner_watch_id===t.updated_by);return e===void 0?"handed over by a phone":`handed over by ${e.paired_iphone_name??e.device_name??"a phone"}`}function na(t){return t.some(n=>!n.is_orphan&&(Pe(n)==="iphone"||(n.paired_iphone_name??"")!==""))}var $=class extends ge{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.unsupported=!1;this.loading=!1;this.topMenuOpen=!1;this.columns={...ue};this.hostWidth=0;this.ownListAsked=!1;this.topHeight=0;this.symbols=new Me(()=>this.requestUpdate());this.uiState=new Map;this.reloadPending=!1;this.loadSeq=0;this.askedOnce=!1;this.onReconnect=()=>{this.isConnected&&this.load(!0)};this.onKeyDown=e=>{if(e.defaultPrevented)return;let i=e.composedPath();if(!i.includes(this)&&!ta()||this.renderRoot.querySelector("dialog[open]"))return;let o=e.metaKey||e.ctrlKey,s=e.key.toLowerCase();if(o&&!e.altKey&&s==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&Dt(this.lookHost())){e.preventDefault();return}if(!Qo(i[0])){if(o&&!e.altKey&&s==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}e.ctrlKey&&!e.metaKey&&!e.altKey&&s==="y"&&(e.preventDefault(),this.redo())}};this.onWindowPointerDown=e=>{let i=e.composedPath(),o=s=>i.some(a=>a instanceof HTMLElement&&a.classList.contains(s));this.topMenuOpen&&!o("pe-top-menu")&&(this.topMenuOpen=!1),o("ha-look")||Dt(this.lookHost())};this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get allOwners(){return this.owners.length>0?this.owners:this.ownList??[]}get watches(){return De(this.allOwners)}get draft(){if(!(this.record===void 0||this.unsupported))return Zt()}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Le(he,ue,ct),this.watchSize(),this.listenForReconnect(),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.stopPolling(),this.loadSeq++}willUpdate(e){this.hass&&(e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,ve(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]})),this.askedOnce||(this.askedOnce=!0,this.load())),this.followSave()}updated(){this.observeTop()}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let i of e){if(i.target!==this){this.measureTop(i.target);continue}let o=i.contentRect;Math.abs(o.width-this.hostWidth)>=1&&(this.hostWidth=o.width)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&e.observe(i))}measureTop(e){let i=e.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=Zt()?.saveDone;if(e===void 0||e===this.followedSave)return;this.followedSave=e;let i=()=>this.saveEnded();e.then(i,i)}saveEnded(){this.requestUpdate(),this.isConnected&&(this.reloadPending=!1,this.load(!0))}async load(e=!1){let i=this.hass;if(!i)return;if(e&&this.saving){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),e||(this.loading=this.record===void 0,this.loadError=void 0);try{let s=await Rt(i);if(o!==this.loadSeq)return;if(this.saving){this.reloadPending=!0;return}this.unsupported=!1,this.show(s),this.loadError=void 0}catch(s){if(o!==this.loadSeq)return;jn(s)?(this.unsupported=!0,this.loadError=void 0):(!e||this.record===void 0)&&(this.loadError=M(s).message)}this.loading=!1,this.unsupported||this.pollIfWaiting()}flushPending(){!this.reloadPending||this.saving||(this.reloadPending=!1,this.load(!0))}show(e){this.record=e;let i=e.revision>0?tn(e.document):void 0,o=qn(i,e.revision);o.kept.length>0?this.note={kind:"warn",text:St(o.kept)}:o.mergedIntoEdits&&(this.note={kind:"warn",text:"The HTTP actions changed somewhere else. Your edits are kept."}),this.requestUpdate()}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||fe(this.record,this.watches).waiting.length===0)&&(this.pollTimer=window.setTimeout(()=>{this.pollTimer=void 0,this.load(!0)},Yo))}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,i){let o=this.draft;if(!o||this.saving)return!1;let s=o.apply(e(o.document),i);return this.requestUpdate(),s}memoIcons(){let e=this.icons??ze,i=this.iconMemo;if(i!==void 0&&i.provider===e&&i.tick===this.iconsTick)return i.icons;let o=Be(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:o},o}viewHost(){let e=this.draft,i=this.hass;if(e===void 0||i===void 0)return;let o=this;return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,get document(){return e.document},get busy(){return o.saving},edit:(s,a)=>this.draft===e&&this.edit(s,a),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate(),test:(s,a,r)=>ye(i,s,a,r),newId:rt}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}startLibrary(){if(this.record===void 0||this.unsupported)return;Fn();let e=this.viewHost();e!==void 0&&Et(e),this.requestUpdate()}async save(){let e=this.hass,i=this.draft;if(!e||!i||this.saving||!i.dirty)return;this.note=void 0,i.apply(_n(i.document,i.base));let o=Jn(i,{save:(a,r)=>xe(e,a,r).catch(d=>{throw _i(d)}),fetch:async()=>{let a=await Rt(e).catch(r=>{throw _i(r)});return a.document===void 0?{revision:a.revision}:{revision:a.revision,document:a.document}}});this.followedSave=i.saveDone,this.requestUpdate();let s=await o.catch(a=>{let{code:r,message:d}=M(a);return{ok:!1,revision:i.revision,merged:!1,code:r??"unknown",message:d}});this.saveEnded(),this.note=Gn(s),this.flushPending()}lookHost(){return{uiState:this.uiState,requestUpdate:()=>this.requestUpdate()}}render(){let e=this.draft;return p`
      <div class="pe-top">
        ${this.renderTopBar(e)}
        ${this.note?p`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:f}
      </div>
      ${this.renderBody()}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Ti}renderTopBar(e){let i=e!==void 0,o=i&&this.dirty;return p`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="HTTP actions">
      <span class="ha-title"><b>HTTP actions</b><span class="ha-shared">${Yt}</span></span>
      <span class="spacer"></span>
      ${this.renderSyncPill()}
      ${i?p`<span class="side-menu pe-top-menu">
          <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${this.topMenuOpen?"true":"false"} aria-label="More actions" title="More"
            @click=${()=>{this.topMenuOpen=!this.topMenuOpen}}>···</button>
          ${this.topMenuOpen?p`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
            <button class="row" role="menuitem" ?disabled=${!o||this.saving}
              title="Go back to the copy Home Assistant holds. Undo brings the edits back."
              @click=${()=>{this.topMenuOpen=!1,this.discard()}}>Discard edits</button>
          </div>`:f}
        </span>
        <button class="cv-act icon undo" ?disabled=${!e.canUndo} title=${`Undo (${ce}Z)`} aria-label="Undo" @click=${()=>this.undo()}>${A("undo")}</button>
        <button class="cv-act icon undo" ?disabled=${!e.canRedo} title=${Si?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo" @click=${()=>this.redo()}>${A("redo")}</button>
        <button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${ce}S). A save reaches every watch the next time it checks.`:`Nothing to save (${ce}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        <span class="tb-saved" title=${o?"Unsaved changes":""}>${this.savedText()}</span>`:f}
      <button class="help" title="Help: HTTP actions" aria-label="Help"
        @click=${()=>window.open(qe,"_blank","noopener")}>?</button>
    </div>`}savedText(){let e=this.record;if(e===void 0||e.revision<=0)return"";let i=$i(e.updated_at);return i?`Saved ${i}`:"Saved"}renderSyncPill(){let e=this.record;if(e===void 0||e.revision<=0||this.unsupported)return f;let{collected:i,waiting:o}=fe(e,this.watches);if(i.length===0&&o.length===0)return f;let s=[o.length>0?`Waiting: ${o.join(", ")}.`:"",i.length>0?`Collected: ${i.join(", ")}.`:""].filter(a=>a!=="").join(" ");return p`<span class="tb-sync ${o.length===0?"ok":"warn"}" title=${s}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.length===0?Ee:Oe}</span>
    </span>`}listWidth(){return this.hostWidth>0&&this.hostWidth<=Ti?this.columns.left:Zo(this.hostWidth-Xo,this.columns.left)}renderGutter(){return p`<div class="gutter left" role="separator" aria-orientation="vertical" aria-label="Resize the list"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${e=>{Ne(e,{side:"left",base:this.listWidth(),limits:ct,onWidth:i=>{this.columns={...this.columns,left:i}},onEnd:()=>Ct(he,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,left:ue.left},Ct(he,this.columns)}}></div>`}renderBody(){if(this.unsupported)return p`<div class="ha-calm"><div class="pe-empty"><b>${Mn}</b></div></div>`;if(this.loadError!==void 0)return p`<div class="ha-calm"><div class="pe-empty">
        <span>Could not read the HTTP actions: ${this.loadError}</span>
        <button class="pe-btn" @click=${()=>{this.load()}}>Try again</button>
      </div></div>`;let e=this.record;if(this.loading||e===void 0)return p`<div class="ha-calm"><div class="pe-empty">Loading…</div></div>`;let i=this.draft,o=this.viewHost();if(i===void 0||o===void 0)return p`<div class="ha-calm"><div class="pe-empty ha-empty"><b>${Tt}</b>
        <span>An HTTP action is a web request a watch asks Home Assistant to send. ${Yt}</span>
        <span class="ha-start"><button class="pe-btn pe-primary" @click=${()=>this.startLibrary()}>${A("plus")}<span>${At}</span></button></span>
        ${na(this.allOwners)?p`<span class="pe-muted">${Nn}</span>`:f}
      </div></div>`;let s=N(i.document).filter(a=>a.presentsClientCertificate===!0).length;return p`${s===0?f:p`<p class="ha-cert-line">${s===1?"An action asks":`${s} actions ask`} for a client certificate. ${$t}</p>`}
    <div class="layout pe-layout ha-two ${this.stacked?"cols-1":""}" style=${`--wa-left:${this.listWidth()}px`}>
      <div class="column left">
        ${yi(o)}
      </div>
      ${this.renderGutter()}
      <div class="column card ha-main">
        ${Hi(o)}
      </div>
    </div>
    ${this.renderFoot(e,i)}`}renderFoot(e,i){let o=gt(i.document),s=$i(e.updated_at),a=e.revision<=0?"Not saved yet. The first save makes the library.":`Revision ${e.revision} \xB7 ${ea(e,this.allOwners)}${s?` ${s}`:""}`,{waiting:r}=fe(e,this.watches);return p`<div class="ha-foot" role="status">
      <i class="ha-foot-dot ${e.revision<=0?"":r.length===0?"ok":"warn"}" aria-hidden="true"></i>
      <span>${a}</span>
      ${r.length===0?f:p`<span class="pe-muted">Waiting for ${r.join(", ")}.</span>`}
      <span class="spacer"></span>
      <span class="pe-muted ${o.near?"ha-near":""}">${Ai(o.size)} of ${Ai(o.limit)}</span>
    </div>`}static{this.styles=[Se,He,ke,Te,Ae,$e,_e,ft`
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
  `,ki]}};P([q({attribute:!1})],$.prototype,"hass",2),P([q({attribute:!1})],$.prototype,"owners",2),P([q({type:Boolean,reflect:!0})],$.prototype,"narrow",2),P([q({attribute:!1})],$.prototype,"icons",2),P([q({attribute:!1})],$.prototype,"iconsTick",2),P([L()],$.prototype,"record",2),P([L()],$.prototype,"unsupported",2),P([L()],$.prototype,"loading",2),P([L()],$.prototype,"loadError",2),P([L()],$.prototype,"note",2),P([L()],$.prototype,"ownList",2),P([L()],$.prototype,"topMenuOpen",2),P([L()],$.prototype,"columns",2),P([L()],$.prototype,"hostWidth",2);function _i(t){let{code:n,message:e}=M(t);return Object.assign(new Error(e),n===void 0?{}:{code:n})}customElements.get("wa-http-actions-editor")||customElements.define("wa-http-actions-editor",$);export{he as HA_COLUMNS_KEY,$ as WaHttpActionsEditor,Zo as fitHttpListWidth,na as homeHasPhone,fe as httpActionsDelivery,ea as httpActionsSavedBy};
