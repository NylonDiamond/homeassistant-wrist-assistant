import{c as yt}from"./chunk-HYO6YZS2.js";import{a as Nt,b as Mt,c as It}from"./chunk-J7COWO5F.js";import{a as jt,d as Ut,e as Le,f as Vt}from"./chunk-ZOJGMATP.js";import{c as Kt,d as Bt,f as Jt}from"./chunk-PXGVB47T.js";import{Ab as Ft,Eb as Wt,Nb as Gt,f as zt,vc as Yt,wb as U,xb as qt,yb as Ne}from"./chunk-TQKDK3W3.js";import"./chunk-X3ZLOB52.js";import{U as P,V as Lt,i as g}from"./chunk-CPEKF3CW.js";import"./chunk-EA53JFDQ.js";import"./chunk-ES6UTNDZ.js";import{Ah as Tt,Bh as At,Dh as $t,Nh as Ct,Qg as Ce,Rg as vt,Sg as xt,b as fe,d as p,g as f,ig as gt,j as bt,k as B,l as L,sh as $,wh as wt,yh as Ht,zh as kt}from"./chunk-7M7K7CM3.js";import{O as St,P as Ot,Q as Pt,Y as Et,aa as Dt,cb as Rt,db as M,o as _t}from"./chunk-OM34V22N.js";import{a as _}from"./chunk-LO2NM3CE.js";var S="actions",D="globalVariables",Ri=1,Xt=256*1024,ne=["GET","POST","PUT","PATCH","DELETE"],tn=["POST","PUT","PATCH","DELETE"],Ie=["none","json","form","text","audio"],je=["statusCode","bodyText","jsonField","header","regex"],nn=["text","number"],Ue=10,Ve=1,ze=60,Zt=/^[A-Za-z0-9_]+$/,Ci=/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g;function Ke(){return{[S]:[],[D]:[],schemaVersion:Ri}}function on(e){return g(e)?e:void 0}function Li(e){return new TextEncoder().encode(JSON.stringify(e)).length}function ge(e){let n=Li(e);return{size:n,limit:Xt,near:n/Xt>.8}}function E(e,n){let t=e!==void 0&&Object.hasOwn(e,n)?e[n]:void 0;return Array.isArray(t)?t:[]}function N(e){return E(e,S).filter(g)}function ie(e){return E(e,D).filter(g)}function W(e,n){return N(e).find(t=>t.id===n)}function T(e){return typeof e=="string"?e:void 0}function te(e,n){return typeof e=="string"&&n.includes(e)?e:void 0}function an(e){let n=g(e)?e:{};return{id:T(n.id)??"",name:T(n.name)??"",value:T(n.value)??""}}function me(e){let n=g(e)?e:{},t=Array.isArray(n.presetValues)?n.presetValues.filter(i=>typeof i=="string"):[];return{id:T(n.id)??"",key:T(n.key)??"",prompt:T(n.prompt)??"",kind:te(n.kind,nn)??"text",presetValues:t,presetsOnly:n.presetsOnly===!0}}function Be(e){let n=g(e)?e:{};return{id:T(n.id)??"",key:T(n.key)??"",value:T(n.value)??""}}function Ni(e){if(!g(e))return;let n=te(e.source,je);if(n===void 0)return;let t={source:n};for(let i of["jsonPath","headerName","pattern","unit"]){let o=T(e[i]);o!==void 0&&(t[i]=o)}return t}function I(e){let n=typeof e.timeout=="number"&&Number.isFinite(e.timeout)?e.timeout:void 0,t={id:T(e.id)??"",name:T(e.name)??"",method:T(e.method)??"POST",url:T(e.url)??"",headers:Array.isArray(e.headers)?e.headers.map(an):[],bodyContentType:te(e.bodyContentType,Ie)??"none",variables:Array.isArray(e.variables)?e.variables.map(me):[],allowsUntrustedCertificate:e.allowsUntrustedCertificate===!0,presentsClientCertificate:e.presentsClientCertificate===!0},i=T(e.body);i!==void 0&&(t.body=i),n!==void 0&&(t.timeout=n);let o=Ni(e.responseConfig);o!==void 0&&(t.reply=o);let s=T(e.icon),a=T(e.iconColor);return s!==void 0&&(t.icon=s),a!==void 0&&(t.iconColor=a),t}function G(e){return e.method.trim().toUpperCase()}function oe(e){return tn.includes(G(e))}function Je(e){return e.bodyContentType==="audio"&&oe(e)}function ae(e){return e.url.trim()===""}function ve(e){let n=e.name.trim();if(n!=="")return n;let t=e.url.trim();return t!==""?t:"Untitled action"}function Me(e){let n=e.replaceAll("_"," ").replaceAll("-"," ");return n.trim()===""?"Value":n.split(" ").filter(t=>t!=="").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function Mi(e){return e.replace(/[^A-Za-z0-9_]/g,"")}function qe(e){let n=new Set,t=[];for(let i of e.presetValues){let o=i.trim();o===""||n.has(o)||(n.add(o),t.push(o))}return t}function sn(e){let n=new Set,t=[];for(let i of e)for(let o of i.matchAll(Ci)){let s=o[1];n.has(s)||(n.add(s),t.push(s))}return t}function z(e){let n=new Set;for(let t of ie(e)){let i=Be(t).key.trim();i!==""&&n.add(i)}return n}function rn(e){let n=[e.url];for(let t of e.headers)n.push(t.name),Ki(t)||n.push(t.value);return oe(e)&&e.bodyContentType!=="audio"&&e.body!==void 0&&n.push(e.body),n}function Y(e,n){let t=sn(rn(e));return{global:t.filter(i=>n.has(i)),asked:t.filter(i=>!n.has(i))}}function se(e,n){let{asked:t}=Y(e,n);return t.map(i=>e.variables.find(o=>o.key===i)).filter(i=>i!==void 0)}function ee(e,n,t){n==="__proto__"?Object.defineProperty(e,n,{value:t,enumerable:!0,writable:!0,configurable:!0}):e[n]=t}function v(e,n,t){if(Object.hasOwn(e,n)){if(P(e[n],t)&&typeof e[n]==typeof t)return e;let s={};for(let a of Object.keys(e))ee(s,a,a===n?t:e[a]);return s}let i={},o=!1;for(let s of Object.keys(e))!o&&s>n&&(ee(i,n,t),o=!0),ee(i,s,e[s]);return o||ee(i,n,t),i}function be(e,n){if(!Object.hasOwn(e,n))return e;let t={};for(let i of Object.keys(e))i!==n&&ee(t,i,e[i]);return t}function X(e,n,t){return t===void 0?be(e,n):v(e,n,t)}function xe(e,n,t){let i=e.findIndex(r=>g(r)&&r.id===n);if(i<0)return e;let o=e[i],s=t(o);if(s===o)return e;let a=e.slice();return a[i]=s,a}function K(e,n,t){return t===e[n]?e:v(e,n,t)}function k(e,n,t){let i=E(e,S),o=xe(i,n,t);return o===i?e:K(e,S,o)}function dn(e,n,t){let i=E(e,D),o=xe(i,n,t);return o===i?e:K(e,D,o)}function re(){let e=globalThis.crypto;if(e!==void 0&&typeof e.randomUUID=="function")return e.randomUUID().toUpperCase();let n=t=>Array.from({length:t},()=>Math.floor(Math.random()*16).toString(16)).join("");return`${n(8)}-${n(4)}-4${n(3)}-${(8+Math.floor(Math.random()*4)).toString(16)}${n(3)}-${n(12)}`.toUpperCase()}function ln(e,n){return{bodyContentType:"none",headers:[],id:e,method:"POST",name:n,url:"",variables:[]}}function pn(e,n="New action"){let t=new Set(N(e).map(i=>I(i).name.trim().toLowerCase()));if(!t.has(n.toLowerCase()))return n;for(let i=2;;i++)if(!t.has(`${n} ${i}`.toLowerCase()))return`${n} ${i}`}function cn(e,n){return K(e,S,[...E(e,S),n])}function un(e,n,t=re){let i=E(e,S),o=i.findIndex(h=>g(h)&&h.id===n);if(o<0)return{document:e};let s=i[o],a=t(),r=v(s,"id",a);r=v(r,"name",`${ve(I(s))} Copy`);let d=h=>Array.isArray(h)?h.map(c=>g(c)?v(c,"id",t()):c):h;Array.isArray(s.headers)&&(r=v(r,"headers",d(s.headers))),Array.isArray(s.variables)&&(r=v(r,"variables",d(s.variables)));let l=i.slice();return l.splice(o+1,0,r),{document:K(e,S,l),id:a}}function hn(e,n){let t=E(e,S),i=t.filter(o=>!(g(o)&&o.id===n));return i.length===t.length?e:K(e,S,i)}function Fe(e,n,t){let i=E(e,S),o=i.findIndex(d=>g(d)&&d.id===n);if(o<0)return e;let s=Math.max(0,Math.min(t,i.length-1));if(o===s)return e;let a=i.slice(),[r]=a.splice(o,1);return a.splice(s,0,r),K(e,S,a)}function fn(e,n,t){return k(e,n,i=>v(i,"name",t))}function mn(e,n,t){let i=t.trim();return k(e,n,o=>X(o,"icon",i===""?void 0:i))}function bn(e,n,t){return t!==void 0&&!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(t)?e:k(e,n,i=>X(i,"iconColor",t?.toUpperCase()))}function gn(e,n,t){let i=t.trim().toUpperCase();return ne.includes(i)?k(e,n,o=>{let s=v(o,"method",i);return!tn.includes(i)&&s.bodyContentType==="audio"&&(s=v(s,"bodyContentType","none")),s}):e}function vn(e,n,t){return k(e,n,i=>v(i,"url",t))}function xn(e,n,t){return Ie.includes(t)?k(e,n,i=>{let o=v(i,"bodyContentType",t);return t==="audio"?be(o,"body"):o}):e}function We(e,n,t){return k(e,n,i=>X(i,"body",t.trim()===""?void 0:t))}function yn(e,n,t){return t!==void 0&&(!Number.isFinite(t)||t<=0)?e:k(e,n,i=>X(i,"timeout",t))}function wn(e,n,t){return k(e,n,i=>X(i,"allowsUntrustedCertificate",t?!0:void 0))}function F(e){return E(e,"headers")}function Hn(e,n,t){return k(e,n,i=>v(i,"headers",[...F(i),{id:t,name:"",value:""}]))}function ye(e,n,t,i){return k(e,n,o=>{let s=F(o),a=xe(s,t,r=>{let d=r;return i.name!==void 0&&(d=v(d,"name",i.name)),i.value!==void 0&&(d=v(d,"value",i.value)),d});return a===s?o:v(o,"headers",a)})}function Ge(e,n,t){return k(e,n,i=>{let o=F(i),s=o.filter(a=>!(g(a)&&a.id===t));return s.length===o.length?i:v(i,"headers",s)})}var kn=[["none","None"],["bearer","Bearer token"],["basic","Username and password"],["apiKey","API key header"]],Ii="X-Api-Key",Qt="A07A0000-0000-0000-0000-0000000A0140",ji=new Set(["x-api-key","api-key","apikey","x-api-token","x-auth-token","x-access-token"]);function V(e="none"){return{kind:e,token:"",username:"",password:"",headerName:Ii,apiKeyValue:""}}function Ui(e){let n=new TextEncoder().encode(e),t="";for(let i of n)t+=String.fromCharCode(i);return btoa(t)}function Vi(e){if(!(!/^[A-Za-z0-9+/]*={0,2}$/.test(e)||e.length%4!==0))try{let n=atob(e),t=Uint8Array.from(n,i=>i.charCodeAt(0));return new TextDecoder("utf-8",{fatal:!0}).decode(t)}catch{return}}function zi(e){switch(e.kind){case"bearer":{let n=e.token.trim();return n===""?void 0:{name:"Authorization",value:`Bearer ${n}`}}case"basic":return e.username===""&&e.password===""?void 0:{name:"Authorization",value:`Basic ${Ui(`${e.username}:${e.password}`)}`};case"apiKey":{let n=e.headerName.trim(),t=e.apiKeyValue.trim();return n===""||t===""?void 0:{name:n,value:t}}default:return}}function we(e){let n=e.name.trim(),t=e.value.trim();if(n.toLowerCase()==="authorization"){if(t.length>7&&t.slice(0,7).toLowerCase()==="bearer ")return{...V("bearer"),token:t.slice(7).trim()};if(t.length>6&&t.slice(0,6).toLowerCase()==="basic "){let i=Vi(t.slice(6).trim()),o=i?.indexOf(":")??-1;return i===void 0||o<0?void 0:{...V("basic"),username:i.slice(0,o),password:i.slice(o+1)}}return}if(ji.has(n.toLowerCase()))return t===""?void 0:{...V("apiKey"),headerName:n,apiKeyValue:t}}function Ki(e){return we(e)?.kind==="basic"}function Tn(e){for(let n of e){let t=we(n);if(t!==void 0)return{auth:t,headerId:n.id}}return{auth:V()}}function An(e,n,t,i){let o=zi(i),s=W(e,n);if(s===void 0)return{document:e};let a=F(s);if((t===void 0?-1:a.findIndex(c=>g(c)&&c.id===t))>=0)return o===void 0?{document:Ge(e,n,t)}:{document:ye(e,n,t,o),headerId:t};if(o===void 0)return{document:e};let l=a.some(c=>g(c)&&c.id===Qt)?re():Qt,h={id:l,name:o.name,value:o.value};return{document:k(e,n,c=>v(c,"headers",[h,...F(c)])),headerId:l}}function en(e,n){return{id:e,key:n,kind:"text",presetValues:[],presetsOnly:!1,prompt:Me(n)}}function $n(e,n,t=re){let i=W(e,n);if(i===void 0)return e;let o=I(i),s=Y(o,z(e)).asked,a=E(i,"variables"),r=c=>me(c).key,d=s.filter(c=>!a.some(u=>r(u)===c));if(d.length===0)return e;let l=a.map((c,u)=>[c,u]).filter(([c])=>!s.includes(r(c))),h;if(d.length===1&&l.length===1){let[c,u]=l[0],m=r(c),H=g(c)?v(c,"key",d[0]):en(t(),d[0]),x=me(c).prompt;g(c)&&(x===""||x===Me(m))&&(H=v(H,"prompt",Me(d[0]))),h=a.slice(),h[u]=H}else h=[...a,...d.map(c=>en(t(),c))];return k(e,n,c=>v(c,"variables",h))}function _n(e,n,t,i){return k(e,n,o=>{let s=E(o,"variables"),a=xe(s,t,r=>{let d=r;return i.prompt!==void 0&&(d=v(d,"prompt",i.prompt)),i.kind!==void 0&&nn.includes(i.kind)&&(d=v(d,"kind",i.kind)),i.presetValues!==void 0&&(d=v(d,"presetValues",i.presetValues)),i.presetsOnly!==void 0&&(d=v(d,"presetsOnly",i.presetsOnly)),d});return a===s?o:v(o,"variables",a)})}function Sn(e,n,t){return k(e,n,i=>{let o=E(i,"variables"),s=o.filter(a=>!(g(a)&&a.id===t));return s.length===o.length?i:v(i,"variables",s)})}function On(e,n){let t=new Set(Y(e,n).asked);return e.variables.filter(i=>!t.has(i.key))}function Pn(e,n){let t=z(e),i=new Map(N(n).map(s=>[s.id,s])),o=e;for(let s of N(e)){let a=T(s.id);if(a===void 0)continue;let r=i.get(a);r!==void 0&&P(r,s)||(o=k(o,a,d=>{let l=d,h=F(d),c=h.filter(x=>!g(x)||an(x).name.trim()!=="");c.length!==h.length&&(l=v(l,"headers",c));let u=I(l),m=E(l,"variables"),H=Y(u,t).asked.map(x=>m.find(w=>me(w).key===x)).filter(x=>x!==void 0).map(x=>{if(!g(x)||!Array.isArray(x.presetValues))return x;let w=x.presetValues.map(R=>typeof R=="string"?R.trim():R).filter(R=>R!=="");return P(w,x.presetValues)&&w.length===x.presetValues.length?x:v(x,"presetValues",w)});return(H.length!==m.length||H.some((x,w)=>x!==m[w]))&&(l=v(l,"variables",H)),l}))}return o}var Ye={statusCode:void 0,bodyText:void 0,jsonField:"jsonPath",header:"headerName",regex:"pattern"};function He(e,n,t){return k(e,n,i=>{if(t===void 0)return be(i,"responseConfig");if(!je.includes(t))return i;let o=g(i.responseConfig)?i.responseConfig:{},s=v(o,"source",t);for(let a of["jsonPath","headerName","pattern"])Ye[t]!==a&&(s=be(s,a));return v(i,"responseConfig",s)})}function J(e,n,t,i){return k(e,n,o=>{if(!g(o.responseConfig))return o;let s=t==="unit"?i:i.trim();return v(o,"responseConfig",X(o.responseConfig,t,s===""?void 0:s))})}function ke(e,n,t){return J(He(e,n,"jsonField"),n,"jsonPath",t)}function En(e,n,t){return J(He(e,n,"header"),n,"headerName",t)}function Dn(e,n="value"){let t=z(e);if(!t.has(n))return n;for(let i=2;;i++)if(!t.has(`${n}_${i}`))return`${n}_${i}`}function Rn(e,n,t){return K(e,D,[...E(e,D),{id:n,key:t,value:""}])}function Cn(e,n,t){return dn(e,n,i=>v(i,"key",Mi(t)))}function Ln(e,n,t){return dn(e,n,i=>v(i,"value",t))}function Nn(e,n){let t=E(e,D),i=t.filter(o=>!(g(o)&&o.id===n));return i.length===t.length?e:K(e,D,i)}function Mn(e,n){return n===""?[]:N(e).map(I).filter(t=>sn(rn(t)).includes(n)).map(ve)}function In(e){if(!g(e))return["The library is not an object."];let n=[],t=Object.hasOwn(e,S)?e[S]:void 0,i=Object.hasOwn(e,D)?e[D]:void 0;Array.isArray(t)||n.push("The action list is missing."),i!==void 0&&!Array.isArray(i)&&n.push("The globals are not a list.");let o=new Set;(Array.isArray(t)?t:[]).forEach((a,r)=>{if(!g(a)){n.push(`Action ${r+1} is not an object.`);return}let d=typeof a.name=="string"&&a.name.trim()!==""?`"${a.name.trim()}"`:`Action ${r+1}`,l=a.id;typeof l!="string"||l===""?n.push(`${d} has no id.`):o.has(l)?n.push(`${d} has the id of another action.`):o.add(l);for(let u of["name","method","url"])Object.hasOwn(a,u)&&typeof a[u]!="string"&&n.push(`${d} has a ${u} that is not text.`);for(let u of["body","icon","iconColor"])Object.hasOwn(a,u)&&a[u]!==null&&typeof a[u]!="string"&&n.push(`${d} has a ${u} that is not text.`);typeof a.method=="string"&&!ne.includes(a.method.trim().toUpperCase())&&n.push(`${d} uses ${a.method}, which is not GET, POST, PUT, PATCH or DELETE.`),Object.hasOwn(a,"bodyContentType")&&te(a.bodyContentType,Ie)===void 0&&n.push(`${d} has a body type Home Assistant does not know.`),Object.hasOwn(a,"timeout")&&a.timeout!==null&&(typeof a.timeout!="number"||!Number.isFinite(a.timeout))&&n.push(`${d} has a timeout that is not a number.`),g(a.responseConfig)&&te(a.responseConfig.source,je)===void 0&&n.push(`${d} reads its reply value from a source Home Assistant does not know.`);let h=a.headers;Object.hasOwn(a,"headers")&&!Array.isArray(h)&&n.push(`${d} has headers that are not a list.`);for(let u of Array.isArray(h)?h:[])if(!g(u)||Object.hasOwn(u,"name")&&typeof u.name!="string"||Object.hasOwn(u,"value")&&typeof u.value!="string"){n.push(`${d} has a header that is not text.`);break}let c=a.variables;Object.hasOwn(a,"variables")&&!Array.isArray(c)&&n.push(`${d} has values to ask for that are not a list.`);for(let u of Array.isArray(c)?c:[]){let m=g(u)?u.key:void 0;if(typeof m!="string"||!Zt.test(m)){n.push(`${d} asks for a value whose key is not letters, digits and underscores.`);break}}});let s=new Set;return(Array.isArray(i)?i:[]).forEach((a,r)=>{let d=g(a)&&typeof a.key=="string"?a.key.trim():"";if(!g(a)||Object.hasOwn(a,"value")&&typeof a.value!="string"){n.push(`Global ${r+1} is not text.`);return}d===""?n.push(`Global ${r+1} has no name.`):Zt.test(d)?s.has(d)?n.push(`Two globals are named {{${d}}}.`):s.add(d):n.push(`The global {{${d}}} has a name that is not letters, digits and underscores.`)}),n}var Te="Shared by every watch and iPhone.",Ae="No HTTP actions yet.",$e="Add an action",jn="Update Wrist Assistant on your iPhone and open it once. Its HTTP actions move here by themselves.",Un="Update the integration to edit HTTP actions here.",_e="Home Assistant sends the client certificate of the user whose device runs it, from the Client certificate card. A user with none cannot run it.",Vn="Type {{key}} in the URL, a header or the body. A key that names a global is filled in from Globals. Any other key is asked for on the watch when the action runs. Keys are letters, digits and underscores.";function zn(e){return M(e).code==="unknown_command"}var Kn={list:"action",field:S,keyOf:e=>typeof e.id=="string"&&e.id!==""?e.id:void 0,nameOf:e=>typeof e.name=="string"?e.name.trim():""},Bn={list:"global",field:D,keyOf:e=>typeof e.key=="string"&&e.key.trim()!==""?e.key.trim():void 0,nameOf:e=>typeof e.key=="string"?`{{${e.key.trim()}}}`:""};function Z(e,n){return e!=null&&Object.hasOwn(e,n)?e[n]:void 0}function de(e,n){if(!Array.isArray(e))return;let t=new Set,i=[];for(let o of e){if(!g(o))return;let s=n.keyOf(o);if(s===void 0||t.has(s))return;t.add(s),i.push([s,o])}return i}function Bi(e,n,t){let i=de(e,t),o=de(n,t);if(i===void 0||o===void 0)return e;let s=new Set(o.map(([a])=>a));return i.filter(([a])=>s.has(a)).map(([,a])=>a)}function Ji(e,n,t,i){let o=e===null?void 0:e,s=n===null?void 0:n,a=t===null?void 0:t,r=o===void 0?[]:de(o,i),d=s===void 0?void 0:de(s,i),l=a===void 0?void 0:de(a,i);if(r===void 0||d===void 0||l===void 0)return{value:P(s,o)?a:s,clashes:[]};let h=new Map(r),c=new Map(d),u=new Map(l),m=[],H=(b,y)=>{let O=h.get(b);return O===void 0||!P(y,O)},x=(b,y,O)=>H(b,y)?(H(b,O)&&!P(y,O)&&m.push({list:i.list,key:b,name:i.nameOf(y)||i.nameOf(O)}),y):O,w=(b,y)=>h.has(b)&&!H(b,y)?void 0:y,R=d.map(([b])=>b).filter(b=>h.has(b)),ft=r.map(([b])=>b).filter(b=>c.has(b)),Di=R.length!==ft.length||R.some((b,y)=>b!==ft[y]),ue=[],he=b=>{b!==void 0&&ue.push(b)};if(Di){for(let[b,y]of d){let O=u.get(b);he(O!==void 0?x(b,y,O):w(b,y))}for(let[b,y]of l)c.has(b)||he(w(b,y))}else{for(let[b,y]of l){let O=c.get(b);he(O!==void 0?x(b,O,y):w(b,y))}for(let[b,y]of d)u.has(b)||he(w(b,y))}let mt=b=>Array.isArray(b)&&b.length===ue.length&&ue.every((y,O)=>y===b[O]);return mt(a)?{value:a,clashes:m}:mt(s)?{value:s,clashes:m}:{value:ue,clashes:m}}function qi(e,n,t,i){return e==null?Bi(Z(t,i.field),Z(n,i.field),i):Z(e,i.field)}function Xe(e,n,t,i){return Ji(qi(e,n,t,i),Z(n,i.field),Z(t,i.field),i)}function Jn(e,n,t){return[...Xe(e,n,t,Kn).clashes,...Xe(e,n,t,Bn).clashes]}function qn(e,n,t){let i=Lt(e,n,t);for(let o of[Kn,Bn]){let s=Xe(e,n,t,o).value,a=Z(i,o.field);if(s!==a){if(s===void 0){if(!Object.hasOwn(i,o.field))continue;let{[o.field]:r,...d}=i;i=d;continue}(i===t||i===n)&&(i={...i}),i[o.field]=s}}return i}var Fn=100,Fi=3,Se=class{constructor(n,t){this._undo=[];this._redo=[];this._kept=[];this._base=n,this._revision=t,this._document=n}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get kept(){return this._kept}get dirty(){let n=this._dirty;if(n!==void 0&&n.document===this._document&&n.base===this._base)return n.value;let t=this._document!==this._base&&!P(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:t},t}apply(n,t){if(n===this._document||P(n,this._document))return(t===void 0||t!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(t!==void 0&&t===this._coalesceKey&&this._undo.length>0){let i=this._undo[this._undo.length-1];return P(n,i)?(this._undo.pop(),this._document=i,this._coalesceKey=void 0):this._document=n,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=n,this._coalesceKey=t,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let n=this._undo.pop();return n===void 0?!1:(this._redo.push(this._document),this._document=n,!0)}redo(){this._coalesceKey=void 0;let n=this._redo.pop();return n===void 0?!1:(this.pushUndo(this._document),this._document=n,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(n,t){return t<this._revision?(this._kept=[],!1):this.mergeOnto(n,t)}restart(n,t){return this.mergeOnto(n,t)}mergeOnto(n,t){this._coalesceKey=void 0;let i=this._base;this._kept=this._document===i?[]:Jn(i,this._document,n);let o=new Map,s=c=>{let u=o.get(c);if(u!==void 0)return u;let m=c===i?n:qn(i,c,n);return m!==n&&P(m,n)&&(m=n),o.set(c,m),m},a=this._document,r=[...this._undo,this._document,...this._redo.slice().reverse()].map(s),d=this._undo.length,l=[],h=0;return r.forEach((c,u)=>{let m=l[l.length-1];m!==void 0&&(m===c||P(m,c))?u===d&&(l[l.length-1]=c):l.push(c),u===d&&(h=l.length-1)}),this._undo=l.slice(0,h),this._document=l[h],this._redo=l.slice(h+1).reverse(),this._base=n,this._revision=t,this._document!==a&&!P(this._document,a)}saved(n,t){t<this._revision||(this._coalesceKey=void 0,this._base=n,this._revision=t)}get saving(){return le.has(this)}get saveDone(){return le.get(this)}pushUndo(n){this._undo.push(n),this._undo.length>Fn&&this._undo.splice(0,this._undo.length-Fn)}},le=new WeakMap;function Wn(e,n){if(le.has(e))return Promise.resolve({ok:!1,revision:e.revision,merged:!1,code:"busy",message:"The HTTP actions are being saved already."});let t=Gi(e,n).finally(()=>le.delete(e));return le.set(e,t),t}function Wi(e){let n=ge(e);return n.size<=n.limit?[]:[`The library is ${Math.ceil(n.size/1024)} KB, past the ${n.limit/1024} KB Home Assistant keeps.`]}async function Gi(e,n){let t=!1,i=new Map,o=()=>i.size===0?{}:{kept:[...i.values()]},s=(a,r,d)=>({ok:!1,revision:e.revision,merged:t,code:a,message:r,...o(),...d===void 0?{}:{problems:d}});for(let a=1;;a++){let r=e.document,d=[...In(r),...Wi(r)];if(d.length>0)return s("invalid",d.join(" "),d);let l;try{({revision:l}=await n.save(e.revision,r))}catch(h){let{code:c="unknown",message:u}=M(h);if(c!=="conflict"||a>=Fi)return s(c,u);let m;try{m=await n.fetch()}catch(w){let R=M(w);return s(R.code??"unknown",R.message)}let H=g(m)&&typeof m.revision=="number"?m.revision:0,x=g(m)&&g(m.document)?m.document:Ke();H<e.revision?e.restart(x,H):e.rebase(x,H);for(let w of e.kept)i.set(`${w.list}:${w.key}`,w);if(t=!0,!e.dirty)return{ok:!0,revision:e.revision,merged:t,alreadySaved:!0,...o()};continue}return e.saved(r,l),{ok:!0,revision:e.revision,merged:t,...o()}}}var q;function Ze(){return q}function Gn(e,n){let t=q;if(n<=0||e===void 0)return{...t===void 0?{}:{draft:t},mergedIntoEdits:!1,kept:[]};if(t===void 0||n<t.revision&&!t.dirty){let s=new Se(e,n);return q=s,{draft:s,mergedIntoEdits:!1,kept:[]}}if(n===t.revision)return{draft:t,mergedIntoEdits:!1,kept:[]};let i=t.dirty,o=n<t.revision?t.restart(e,n):t.rebase(e,n);return{draft:t,mergedIntoEdits:i&&o,kept:i?t.kept:[]}}function Yn(){return q??=new Se(Ke(),0),q}function Qe(){return q?.dirty??!1}function Xn(){q=void 0}function Yi(e){return e.list==="global"?e.name.trim()===""?`{{${e.key}}}`:e.name:`"${e.name.trim()===""?"an untitled action":e.name}"`}function Oe(e){if(e.length===0)return"";let n=e.map(Yi);return`${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`} also changed somewhere else. ${n.length===1?"Your version was kept.":"Your versions were kept."}`}function Zn(e){if(e.ok){let t=e.kept??[];if(e.alreadySaved===!0){let i=t.length>0?` ${Oe(t)}`:"";return{kind:t.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${e.revision}.${i}`}}return t.length>0?{kind:"warn",text:`Saved. ${Oe(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The HTTP actions kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the HTTP actions${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Rt}`};case"busy":return{kind:"warn",text:"Already saving. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the HTTP actions just now. Your edits are kept, so try again in a moment."};case"unknown_command":return{kind:"err",text:"Not saved. Update the integration to edit HTTP actions here."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}var Xi=/"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\],:]/g;function Qn(e,n=2){let t=e.trim();if(t!==""){try{JSON.parse(t)}catch{return}return ei(t.match(Xi)??[],n)}}function ei(e,n){let t=[],i=0,o=()=>t.push({kind:"ws",text:`
${" ".repeat(i*n)}`}),s=[],a=()=>s.map(d=>d.key??String(d.index??0)).join("."),r=(d,l)=>t.push(s.length===0?{kind:d,text:l}:{kind:d,text:l,path:a()});for(let d=0;d<e.length;d+=1){let l=e[d],h=e[d+1];if(l.startsWith("{{"))t.push({kind:"var",text:l});else if(l==="{"||l==="["){let c=l==="{"?"}":"]";h===c?(t.push({kind:"punct",text:l+c}),d+=1):(t.push({kind:"punct",text:l}),s.push(l==="["?{index:0}:{}),i+=1,o())}else if(l==="}"||l==="]")s.pop(),i=Math.max(0,i-1),o(),t.push({kind:"punct",text:l});else if(l===","){let c=s[s.length-1];c?.index!==void 0&&(c.index+=1),t.push({kind:"punct",text:l}),o()}else if(l===":")t.push({kind:"punct",text:": "});else if(l.startsWith('"'))if(h===":"){let c=s[s.length-1];if(c!==void 0)try{c.key=String(JSON.parse(l))}catch{c.key=l.slice(1,-1)}t.push({kind:"key",text:l})}else r("str",l);else r(l==="true"||l==="false"||l==="null"?"lit":"num",l)}return t}var Zi=/\{\{[A-Za-z0-9_]+\}\}/g,ti=/\{\{[A-Za-z0-9_]+\}\}|"(?:[^"\\\n]|\\.)*"?|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\btrue\b|\bfalse\b|\bnull\b|[{}[\],:]/g;function ni(e,n=2){let t=e.trim();if(t==="")return;let i=[],o="",s=0;for(let a of t.matchAll(ti)){if(t.slice(s,a.index).trim()!=="")return;i.push(a[0]),o+=a[0].startsWith("{{")?"0":a[0],s=a.index+a[0].length}if(t.slice(s).trim()===""){try{JSON.parse(o)}catch{return}return et(ei(i,n))}}function ii(e,n){let t=[],i=0,o=[...e.matchAll(n?ti:Zi)];return o.forEach((s,a)=>{s.index>i&&t.push({kind:"ws",text:e.slice(i,s.index)});let r=s[0];i=s.index+r.length;let d;if(r.startsWith("{{"))d="var";else if(r.startsWith('"')){let l=o[a+1];d=l!==void 0&&l[0]===":"&&e.slice(i,l.index).trim()===""?"key":"str"}else r==="true"||r==="false"||r==="null"?d="lit":/^[{}[\],:]$/.test(r)?d="punct":d="num";t.push({kind:d,text:r})}),i<e.length&&t.push({kind:"ws",text:e.slice(i)}),t}function et(e){return e.map(n=>n.text).join("")}function Pe(e){return e<1024?`${e} ${e===1?"byte":"bytes"}`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(2)} MB`}var at="ha:sel",ri="ha:tab",di="ha:rtab",li="ha:bmode",pi="ha:bwrap",tt="ha:bcopied",oi="ha:qwrap",nt="ha:qcopied",st="ha:show:",ci="ha:auth:",ui="ha:test:",Q="ha:look",rt="network",Qi="#CCD8E6",eo="Web requests Home Assistant sends when a watch runs one, from a tile, a menu, a complication or a control. A save reaches every watch the next time it checks.",hi="Fixed values any action can use as {{key}}, such as a server address or a token. Change one here and every action that uses it follows.",to="The watch records a voice clip of up to 30 seconds when the action runs and sends it as the body, as audio/mp4. Nothing to type here.",no="This method sends no body. Pick POST, PUT, PATCH or DELETE to send one.",io=`Empty means ${Ue} seconds. Home Assistant holds it between ${Ve} and ${ze}.`,oo="Only for a server you run whose HTTPS certificate is not publicly trusted.",fi="With no URL the watch shows the action as needing setup.",ao="Press Send to try this action. Home Assistant sends it. Nothing is saved.",so="For a value you choose on the watch each time, such as a brightness or a message. Type {{name}} in the URL, a header or the body, and the watch asks for it when you tap the action.",ro="This action asks for nothing. It runs as soon as you tap it.",lo="filled in from Globals, so the watch does not ask",po=[["none","None"],["json","JSON"],["form","Form"],["text","Text"],["audio","Voice clip"]],co={none:void 0,json:"application/json",form:"application/x-www-form-urlencoded",text:"text/plain",audio:"audio/mp4"},uo={none:"Request body",json:'{"key": "value"}',form:"key=value&other=123",text:"Plain text",audio:""},ho=[["none","None"],["statusCode","Status code"],["bodyText","Body text"],["jsonField","JSON field"],["header","Header"],["regex","Regex"]];function fo(e,n,t){return`${e} ${e===1?n:t}`}function mo(e){if(ae(e))return`${G(e)} \xB7 no URL yet`;let n=e.url.trim().replace(/^https?:\/\//i,"");return`${G(e)} \xB7 ${n}`}function mi(e){let n=e.trim().toUpperCase();switch(n){case"GET":return{text:"GET",tone:"get"};case"POST":return{text:"POST",tone:"post"};case"PUT":return{text:"PUT",tone:"put"};case"PATCH":return{text:"PATCH",tone:"patch"};case"DELETE":return{text:"DEL",tone:"del"};default:return{text:n===""?"?":n.slice(0,5),tone:"other"}}}function bo(e){let n=mi(e);return p`<span class="ha-mtag m-${n.tone}" title=${e.trim().toUpperCase()}>${n.text}</span>`}function bi(e){let n=e.uiState.get(at);if(n?.kind==="action"&&W(e.document,n.id)!==void 0||n?.kind==="globals")return n;let t=N(e.document)[0];return typeof t?.id=="string"?{kind:"action",id:t.id}:void 0}function pe(e,n){n===void 0?e.uiState.delete(at):e.uiState.set(at,n),e.uiState.delete(Q),e.requestUpdate()}var go=["headers","auth","body","prompts","reply","settings"],vo=["body","headers","paths"];function xo(e){let n=e.uiState.get(ri);return go.includes(n)?n:"headers"}function gi(e,n){e.uiState.set(ri,n),e.requestUpdate()}function yo(e){let n=e.uiState.get(di);return vo.includes(n)?n:"body"}function wo(e,n){e.uiState.set(di,n),e.requestUpdate()}function vi(e){return e.uiState.get(li)==="raw"?"raw":"pretty"}function Ho(e){return e.uiState.get(pi)!==!1}function ko(e,n){let t=n.body??n.snippet,i=Qn(t),o=i!==void 0&&vi(e)==="pretty";return{raw:t,isJson:i!==void 0,pieces:o?i:void 0,text:o?et(i):t}}function xi(e,n,t,i,o,s){return p`<div class="ha-tabs ${s}" role="tablist" aria-label=${e}
    @keydown=${a=>{if(a.key!=="ArrowRight"&&a.key!=="ArrowLeft"&&a.key!=="Home"&&a.key!=="End")return;let r=t.findIndex(h=>h.id===i),d=a.key==="Home"?0:a.key==="End"?t.length-1:(r+(a.key==="ArrowRight"?1:-1)+t.length)%t.length;a.preventDefault(),o(t[d].id),a.currentTarget.querySelectorAll("[role=tab]")[d]?.focus()}}>
    ${t.map(a=>p`<button type="button" role="tab" class="ha-tab ${a.id===i?"on":""}" id=${`${n}-${a.id}`}
      aria-selected=${a.id===i?"true":"false"} aria-controls=${`${n}-panel`} tabindex=${a.id===i?"0":"-1"}
      @click=${()=>o(a.id)}>${a.label}${a.extra??f}</button>`)}
  </div>`}var Ee=e=>e===0?f:p`<span class="ha-tab-n">${e}</span>`,it=e=>e?p`<i class="ha-tab-dot" aria-label="set"></i>`:f;function C(e,n,t,i){return e.edit(o=>$n(t(o),n,()=>e.newId()),i)}function De(e){let n=e.newId();return e.edit(t=>cn(t,ln(n,pn(t)))),pe(e,{kind:"action",id:n}),n}function To(e){let n=e.newId();return e.edit(t=>Rn(t,n,Dn(t))),pe(e,{kind:"globals"}),n}function Ao(e,n){let t;e.edit(i=>{let o=un(i,n,()=>e.newId());return t=o.id,o.document}),t!==void 0&&pe(e,{kind:"action",id:t})}function Re(e){return e.uiState.has(Q)?(e.uiState.delete(Q),e.requestUpdate(),!0):!1}function yi(e,n){return e.uiState.get(st+n)===!0}function $o(e,n){yi(e,n)?e.uiState.delete(st+n):e.uiState.set(st+n,!0),e.requestUpdate()}function lt(e,n,t,i,o,s=""){let a=yi(e,o);return p`<span class="ha-secret">
    <input type=${a?"text":"password"} class="mono" .value=${t} placeholder=${s} aria-label=${n}
      autocomplete="off" spellcheck="false" data-secret=${o}
      @input=${r=>i(r.target.value)} />
    <button type="button" class="ha-show" aria-pressed=${a?"true":"false"} aria-label=${`${a?"Hide":"Show"} ${n}`}
      @click=${()=>$o(e,o)}>${a?"Hide":"Show"}</button>
  </span>`}function ot(e,n,t,i,o,s=""){return p`<div class="field ha-secret-field"><span>${n}</span>${lt(e,n,t,i,o,s)}</div>`}function wi(e,n,t,i={}){return p`<label class="ha-switch"><input type="checkbox" .checked=${n} ?disabled=${i.disabled===!0}
    @change=${o=>t(o.target.checked)} /><span>${e}</span></label>`}function pt(e,n){let t=e.uiState.get(ci+n.id);if(t!==void 0){let i=t.headerId===void 0?void 0:n.headers.find(s=>s.id===t.headerId);if(i===void 0)return{auth:t.auth.kind===t.kind?t.auth:V(t.kind)};if(t.kind==="apiKey")return{auth:{...V("apiKey"),headerName:i.name,apiKeyValue:i.value},headerId:i.id};let o=we(i);return o!==void 0&&o.kind===t.kind?{auth:o,headerId:i.id}:{auth:V(t.kind),headerId:i.id}}return Tn(n.headers)}function _o(e,n,t,i){let{headerId:o}=pt(e,n),s=o;C(e,n.id,a=>{let r=An(a,n.id,o,t);return s=r.headerId,r.document},i),e.uiState.set(ci+n.id,{kind:t.kind,auth:t,...s===void 0?{}:{headerId:s}}),e.requestUpdate()}function So(e,n){let{auth:t}=pt(e,n),i=(r,d)=>_o(e,n,{...t,...r},d),o=r=>`auth:${n.id}:${r}`,s=f;t.kind==="bearer"?s=ot(e,"Token",t.token,r=>i({token:r},o("token")),o("token"),"Paste the token"):t.kind==="basic"?s=p`${U("Username",t.username,r=>i({username:r},o("user")))}
      ${ot(e,"Password",t.password,r=>i({password:r},o("password")),o("password"))}`:t.kind==="apiKey"&&(s=p`${U("Header",t.headerName,r=>i({headerName:r},o("name")),{mono:!0,placeholder:"X-Api-Key"})}
      ${ot(e,"Key",t.apiKeyValue,r=>i({apiKeyValue:r},o("key")),o("key"),"Paste the key")}`);let a=t.kind==="none"?"Add sign-in if the server asks for it. It is written as one header.":t.kind==="basic"?"Sent as an Authorization header, the username and password encoded together.":t.kind==="bearer"?"Sent as Authorization: Bearer and the token.":"Sent as a header with the key as its value.";return p`<p class="ha-line">${a}</p>
    <div class="ha-form">
      ${Ne("Type",t.kind,kn,r=>i({kind:r}),{snapBack:!0})}
      ${s}
    </div>`}function Oo(e,n,t,i){return e.icons.render(n,t,i)??p`<span class="ha-glyph-dot" style=${`background:${i}`}></span>`}function Hi(e){return n=>{n.target!==n.currentTarget||n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),e())}}function Po(e,n,t,i,o){let s=ve(n),a=()=>pe(e,{kind:"action",id:n.id}),r=ae(n);return p`<div class="ha-item ${o?"on":""}" role="listitem" tabindex="0" data-action=${n.id}
    aria-current=${o?"true":"false"} aria-label=${s} title=${`${s} \xB7 ${mo(n)}`}
    @click=${d=>{d.target instanceof Element&&d.target.closest("button")||a()}}
    @keydown=${Hi(a)}>
    ${bo(G(n))}
    <span class="ha-item-name">${s}</span>
    ${r?p`<span class="ha-need-mark" title=${fi}>needs setup</span>`:f}
    ${Je(n)?p`<span class="ha-mark">voice</span>`:f}
    <span class="ha-item-acts">
      <button type="button" class="icon" ?disabled=${e.busy||t===0} title="Move up" aria-label=${`Move ${s} up`}
        @click=${()=>e.edit(d=>Fe(d,n.id,t-1))}>${$("up")}</button>
      <button type="button" class="icon" ?disabled=${e.busy||t===i-1} title="Move down" aria-label=${`Move ${s} down`}
        @click=${()=>e.edit(d=>Fe(d,n.id,t+1))}>${$("down")}</button>
    </span>
  </div>`}function ki(e){let n=N(e.document).map(I),t=ie(e.document).length,i=bi(e),o=i?.kind==="globals",s=()=>pe(e,{kind:"globals"});return p`<section class="card lc ha-list-card" aria-label="Actions" style="--c: var(--wa-lc-layers, #4a7fe8)">
    <div class="lc-head">
      <span class="swatch">${$("globe")}</span><span class="lc-title">Actions</span>
      <span class="lc-sub" title=${eo}>${n.length}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri ha-add" aria-label="Add an action" ?disabled=${e.busy}
        title="A new action" @click=${()=>De(e)}>${$("plus")}<span>Add</span></button>
    </div>
    ${n.length===0?p`<div class="lc-note ha-list-note">No actions yet. Add one to send a request from the watch.</div>`:p`<div class="ha-items" role="list">${n.map((a,r)=>Po(e,a,r,n.length,i?.kind==="action"&&i.id===a.id))}</div>`}
    <div class="ha-list-foot">
      <div class="ha-item ha-globals-item ${o?"on":""}" role="button" tabindex="0" aria-pressed=${o?"true":"false"}
        title=${hi} @click=${s} @keydown=${Hi(s)}>
        <span class="ha-mtag ha-gtag" aria-hidden="true">{ }</span>
        <span class="ha-item-name">Globals</span>
        <span class="ha-count">${t}</span>
      </div>
    </div>
  </section>`}function Eo(e){let n=e.trim();if(n===""||n.startsWith("{"))return;let t=n.toLowerCase();return t.startsWith("http://")||t.startsWith("https://")?void 0:"Add http:// or https://. Without one the request will not send."}function Do(e,n){let t=n.id;return p`<div class="ha-look-pop" role="dialog" aria-label="Icon and color">
    <fieldset class="ha-set" ?disabled=${e.busy}>
      <div class="ha-stack">${Gt({icons:e.icons,symbols:e.symbols},n.icon??rt,i=>e.edit(o=>mn(o,t,i===rt?"":i),`a:${t}:icon`),`ha:icon:${t}`,{clearable:(n.icon??"")!=="",tint:n.iconColor})}</div>
      ${Wt("Color",n.iconColor,i=>e.edit(o=>bn(o,t,i),`a:${t}:color`),!0,null)}
    </fieldset>
    <div class="ha-pop-foot"><span class="ha-line">The icon and color the action wears on the watch.</span>
      <button type="button" class="pe-btn ha-sm" @click=${()=>Re(e)}>Done</button></div>
  </div>`}function Ro(e,n){let t=n.id,i=n.iconColor??Qi,o=e.uiState.get(Q)===t;return p`<div class="ha-titlerow">
    <span class="ha-look">
      <button type="button" class="ha-look-btn" style=${`--c:${i}`} aria-haspopup="dialog" aria-expanded=${o?"true":"false"}
        title="Icon and color" aria-label="Icon and color"
        @click=${()=>{o?e.uiState.delete(Q):e.uiState.set(Q,t),e.requestUpdate()}}>
        <span class="ha-look-glyph">${Oo(e,n.icon??rt,16,i)}</span>
      </button>
      ${o?Do(e,n):f}
    </span>
    <input type="text" class="ha-name" .value=${n.name} placeholder="My action" aria-label="Name" ?disabled=${e.busy}
      @input=${s=>e.edit(a=>fn(a,t,s.target.value),`a:${t}:name`)} />
    <span class="ha-title-acts">
      <button type="button" class="pe-btn ha-sm" ?disabled=${e.busy} title="A copy with new ids, named Copy"
        @click=${()=>Ao(e,t)}>${$("duplicate")}<span>Duplicate</span></button>
      <button type="button" class="pe-btn ha-sm pe-danger" ?disabled=${e.busy}
        title="Remove this action. Tiles and menu items that run it stop working."
        @click=${()=>e.edit(s=>hn(s,t))}>${$("delete")}<span>Remove</span></button>
    </span>
  </div>`}function Co(e,n){let t=n.id,i=j(e,t),o=ae(n),s=G(n),a=mi(s),r=ne.includes(s),d=Eo(n.url);return p`<div class="ha-reqbar">
      <div class="ha-reqbox">
        <select class="ha-method m-${a.tone}" aria-label="Method" ?disabled=${e.busy} .value=${s}
          @change=${l=>{C(e,t,h=>gn(h,t,l.target.value)),e.requestUpdate()}}>
          ${r?f:p`<option value=${s} selected>${s}</option>`}
          ${ne.map(l=>p`<option value=${l} ?selected=${l===s}>${l}</option>`)}
        </select>
        <input type="text" class="ha-url mono" .value=${n.url} placeholder="https://example.com/api" aria-label="URL"
          spellcheck="false" autocomplete="off" ?disabled=${e.busy}
          @input=${l=>C(e,t,h=>vn(h,t,l.target.value),`a:${t}:url`)}
          @keydown=${l=>{l.key!=="Enter"||l.isComposing||(l.preventDefault(),si(e,t))}} />
      </div>
      <button type="button" class="pe-btn pe-primary ha-send ${i.running?"busy":""}" ?disabled=${i.running||o}
        aria-busy=${i.running?"true":"false"} title=${o?"Add a URL first":"Send it now (Enter in the URL)"}
        @click=${()=>{si(e,t)}}>${i.running?"Sending\u2026":"Send"}</button>
    </div>
    ${d===void 0&&!o?f:p`<div class="ha-barnote">
      ${d===void 0?f:p`<p class="ha-warn">${d}</p>`}
      ${o?p`<p class="ha-warn">${fi}</p>`:f}
    </div>`}`}function Lo(e,n,t){let i=n.id,o=t===void 0?void 0:n.headers.find(a=>a.id===t),s=n.headers.filter(a=>a.id!==t);return p`<div class="ha-table ha-htable" role="table" aria-label="Headers">
    <div class="ha-tr ha-th" role="row"><span role="columnheader">Key</span><span role="columnheader">Value</span><span></span></div>
    ${o===void 0?f:p`<div class="ha-tr ha-auth-row" role="row">
      <span class="ha-td ha-ro mono" role="cell">${o.name}</span>
      <span class="ha-td ha-ro" role="cell"><span class="ha-dots" aria-label="Hidden">••••••••</span></span>
      <span class="ha-td ha-end" role="cell"><button type="button" class="ha-from-auth" title="Written by the Auth tab. Edit it there."
        @click=${()=>gi(e,"auth")}>Auth</button></span>
    </div>`}
    ${s.map(a=>p`<div class="ha-tr" role="row">
      <span class="ha-td" role="cell"><input type="text" class="mono" .value=${a.name} placeholder="Name" aria-label="Header name" spellcheck="false"
        @input=${r=>C(e,i,d=>ye(d,i,a.id,{name:r.target.value}),`h:${a.id}:name`)} /></span>
      <span class="ha-td" role="cell">${lt(e,`${a.name.trim()||"Header"} value`,a.value,r=>C(e,i,d=>ye(d,i,a.id,{value:r}),`h:${a.id}:value`),`header:${a.id}`,"Value")}</span>
      <span class="ha-td ha-end" role="cell"><button type="button" class="icon ha-remove" title="Remove this header" aria-label=${`Remove ${a.name.trim()||"header"}`}
        @click=${()=>C(e,i,r=>Ge(r,i,a.id))}>${$("delete")}</button></span>
    </div>`)}
    <div class="ha-tr ha-addrow" role="row"><button type="button" class="ha-add-row" @click=${()=>C(e,i,a=>Hn(a,i,e.newId()))}>${$("plus")}<span>Add header</span></button></div>
  </div>
  <p class="ha-line">Header values stay hidden until shown.</p>`}function No(e,n){if(!oe(n))return p`<p class="ha-line">${no}</p>`;let t=n.bodyContentType,i=co[t];return p`<div class="ha-body-head">
      <label class="ha-inline"><span>Type</span>
        <select .value=${t} @change=${o=>{C(e,n.id,s=>xn(s,n.id,o.target.value)),e.requestUpdate()}}>
          ${po.map(([o,s])=>p`<option value=${o} ?selected=${o===t}>${s}</option>`)}
        </select></label>
      ${i===void 0?f:p`<span class="ha-line">Sends Content-Type: ${i}, unless a header sets one.</span>`}
    </div>
    ${t==="audio"?p`<p class="ha-line ha-audio">${to}</p>`:Mo(e,n,t)}`}function Mo(e,n,t){let i=n.body??"",o=t==="json",s=o?ni(i):void 0,a=e.uiState.get(oi)!==!1,r=e.uiState.get(nt)===!0,d=(c,u)=>{e.uiState.set(c,u),e.requestUpdate()},l=async()=>{try{await navigator.clipboard.writeText(i),d(nt,!0),setTimeout(()=>d(nt,!1),1500)}catch{}},h=o&&i.trim()!==""&&s===void 0;return p`<div class="ha-bbar ha-qbar" role="toolbar" aria-label="Body options">
      ${o?p`<button type="button" class="ha-bopt" title=${h?"The body is not JSON":"Indent the JSON"}
        ?disabled=${e.busy||s===void 0||s===i}
        @click=${()=>{s!==void 0&&C(e,n.id,c=>We(c,n.id,s))}}>Format</button>`:f}
      <button type="button" class="ha-bopt ${a?"on":""}" aria-pressed=${a?"true":"false"} title="Wrap long lines" @click=${()=>d(oi,!a)}>Wrap</button>
      <button type="button" class="ha-bopt" title="Copy the body" ?disabled=${i===""} @click=${()=>{l()}}>${r?"Copied":"Copy"}</button>
      <span class="ha-bmeta">${h?p`<span class="ha-bad">Not JSON</span> · `:f}${Pe(new TextEncoder().encode(i).length)}</span>
    </div>
    <div class="ha-code ${a?"":"nowrap"}">
      <pre class="mono" aria-hidden="true">${ii(i,o).map(c=>c.kind==="ws"||c.kind==="punct"?c.text:p`<span class=${`j-${c.kind}`}>${c.text}</span>`)}${`
`}</pre>
      <textarea class="mono ha-body-text" spellcheck="false" autocapitalize="off" autocomplete="off" wrap=${a?"soft":"off"} aria-label="Body" .value=${i} placeholder=${uo[t]}
        @scroll=${c=>{let u=c.target,m=u.previousElementSibling;m!==null&&(m.scrollTop=u.scrollTop,m.scrollLeft=u.scrollLeft)}}
        @input=${c=>C(e,n.id,u=>We(u,n.id,c.target.value),`a:${n.id}:body`)}></textarea>
    </div>`}function ai(e,n,t,i){let o=(a,r)=>e.edit(d=>_n(d,n.id,t.id,a),r),s=qe(t);return p`<div class="ha-var ${i?"unused":""}" data-key=${t.key}>
    <div class="ha-var-head"><code>{{${t.key}}}</code>
      ${i?p`<span class="ha-mark">unused, left out when saved</span>
        <button type="button" class="icon ha-remove" title="Remove" aria-label=${`Remove {{${t.key}}}`}
          @click=${()=>e.edit(a=>Sn(a,n.id,t.id))}>${$("delete")}</button>`:f}
    </div>
    ${i?f:p`<div class="ha-var-grid">
      ${U("Prompt",t.prompt,a=>o({prompt:a},`v:${t.id}:prompt`),{placeholder:"Message"})}
      ${Ft("Kind",t.kind,[["text","Text"],["number","Number"]],a=>o({kind:a}))}
      <label class="field ha-quick"><span>Quick values</span>
        <textarea rows=${Math.max(2,Math.min(6,t.presetValues.length+1))} .value=${t.presetValues.join(`
`)} placeholder="One per line"
          @input=${a=>o({presetValues:a.target.value.split(`
`)},`v:${t.id}:presets`)}></textarea></label>
      <div class="ha-only">${wi("Only these",t.presetsOnly,a=>o({presetsOnly:a}),{disabled:s.length===0&&!t.presetsOnly})}
        <span class="ha-line">${s.length===0?"Add a quick value to offer only these.":t.presetsOnly?"The watch shows only the quick values, with no typing.":"The watch offers the quick values and lets you type too."}</span></div>
    </div>`}
  </div>`}function Io(e,n){let t=z(e.document),i=Y(n,t),o=On(n,t),s=i.asked.filter(a=>!n.variables.some(r=>r.key===a));return p`<p class="ha-line" title=${Vn}>${so}</p>
    ${i.global.length===0?f:p`<p class="ha-from-globals">${i.global.map(a=>p`<code>{{${a}}}</code>`)} <span>${lo}</span></p>`}
    ${i.asked.length===0&&o.length===0?p`<p class="ha-quiet">${ro}</p>`:f}
    ${se(n,t).map(a=>ai(e,n,a,!1))}
    ${s.map(a=>p`<div class="ha-var" data-key=${a}><div class="ha-var-head"><code>{{${a}}}</code><span class="ha-need-mark">not set up</span>
      <span class="ha-line">Sent as typed until it is set up.</span>
      <button type="button" class="pe-btn ha-sm" @click=${()=>C(e,n.id,r=>r)}>Ask for it on the watch</button></div></div>`)}
    ${o.map(a=>ai(e,n,a,!0))}`}function jo(e,n){let t=n.id,i=n.reply,o=i?.source??"none",s=j(e,t),a=i===void 0?void 0:Ye[i.source],r=a==="jsonPath"?U("JSON path",i?.jsonPath??"",l=>e.edit(h=>J(h,t,"jsonPath",l),`r:${t}:path`),{mono:!0,placeholder:"result.price"}):a==="headerName"?U("Header",i?.headerName??"",l=>e.edit(h=>J(h,t,"headerName",l),`r:${t}:header`),{mono:!0,placeholder:"X-RateLimit-Remaining"}):a==="pattern"?U("Pattern",i?.pattern??"",l=>e.edit(h=>J(h,t,"pattern",l),`r:${t}:pattern`),{mono:!0,placeholder:"temperature=([0-9.]+)"}):f,d=i===void 0?"Pick what to take from the reply to show on the watch, as a tile's value or in the banner after it runs.":a==="jsonPath"?"Or type the path: keys joined by dots, a number for an item of a list (data.0.temp).":a==="pattern"?"The first group in brackets, else the whole match.":"Shown on the watch, as a tile's value or in the banner after it runs.";return p`${a==="jsonPath"?p`<p class="ha-info">Press Send, then click a value in the response below to use it as the reply value.</p>`:f}
    <p class="ha-line">${d}</p>
    <div class="ha-form">
      ${Ne("Read",o,ho,l=>e.edit(h=>He(h,t,l==="none"?void 0:l)),{snapBack:!0})}
      ${r}
      ${i===void 0?f:U("Unit",i.unit??"",l=>e.edit(h=>J(h,t,"unit",l),`r:${t}:unit`),{placeholder:"\xB0, $, kWh"})}
    </div>
    ${i===void 0?f:p`<p class="ha-reply-now" role="status">${s.reply===void 0||s.running?p`<span class="ha-muted">Press Send to see the value the watch would show.</span>`:p`On the watch, from the last answer: ${Ti(n,s)}`}</p>`}`}function Uo(e,n){let t=n.id;return p`<div class="ha-form ha-settings">
      ${qt("Timeout",n.timeout,i=>e.edit(o=>yn(o,t,i),`a:${t}:timeout`),{optional:!0,min:Ve,max:ze,step:1,unit:"s",placeholder:String(Ue),def:null})}
      <p class="ha-line ha-under">${io}</p>
    </div>
    <div class="ha-setting">
      ${wi("Accept a self-signed certificate",n.allowsUntrustedCertificate,i=>e.edit(o=>wn(o,t,i)))}
      <p class="ha-line">${oo}</p>
    </div>
    ${n.presentsClientCertificate?p`<p class="ha-cert">This action asks for a client certificate. ${_e}</p>`:f}`}function Vo(e){return oe(e)?e.bodyContentType==="audio"||(e.body??"").trim()!=="":!1}function zo(e,n){let{headerId:t,auth:i}=pt(e,n),o=xo(e),s=se(n,z(e.document)).length,a=[{id:"headers",label:"Headers",extra:Ee(n.headers.length)},{id:"auth",label:"Auth",extra:it(i.kind!=="none")},{id:"body",label:"Body",extra:it(Vo(n))},{id:"prompts",label:"Ask on watch",extra:Ee(s)},{id:"reply",label:"Reply value",extra:it(n.reply!==void 0)},{id:"settings",label:"Settings"}],r=o==="headers"?Lo(e,n,t):o==="auth"?So(e,n):o==="body"?No(e,n):o==="prompts"?Io(e,n):o==="reply"?jo(e,n):Uo(e,n);return p`<div class="ha-req">
    ${xi("Request","ha-tab",a,o,d=>gi(e,d),"ha-req-tabs")}
    <div class="ha-tabbody tab-${o}" role="tabpanel" id="ha-tab-panel" aria-labelledby=${`ha-tab-${o}`}>
      <fieldset class="ha-set" ?disabled=${e.busy}>${r}</fieldset>
    </div>
  </div>`}function Ko(e,n){let t=n.reply;if(t===void 0||e.reply===void 0)return{found:!1,stale:!1};if(n.sent===JSON.stringify(e.reply))return t.value===null?{found:!1,stale:!1}:{value:t.value,found:!0,stale:!1};if(e.reply.source!=="jsonField"||t.leaves===void 0)return{found:!1,stale:!0};let i=(e.reply.jsonPath??"").trim(),o=t.leaves.find(a=>a.path===i);return o!==void 0?{value:`${o.value}${e.reply.unit??""}`,found:!0,stale:!1}:{found:!1,stale:i!==""&&t.leaves.some(a=>a.path.startsWith(`${i}.`))||t.leaves_cut===!0||i===""}}function j(e,n){return e.uiState.get(ui+n)??{values:{},running:!1,run:0}}function dt(e,n,t){e.uiState.set(ui+n,t),e.requestUpdate()}function Bo(e,n,t){let i={};for(let o of se(e,n)){let s=t[o.key];i[o.key]=s!==void 0?s:o.presetValues[0]??""}return i}async function si(e,n){let t=W(e.document,n);if(t===void 0)return;let i=I(t);if(ae(i))return;let o=j(e,n);if(o.running)return;let s=o.run+1,a=Bo(i,z(e.document),o.values);dt(e,n,{values:o.values,running:!0,run:s});let r=ie(e.document),d;try{let l=await e.test(t,r,a);d={values:j(e,n).values,running:!1,reply:l,sent:JSON.stringify(i.reply),run:s}}catch(l){d={values:j(e,n).values,running:!1,error:Jo(l),run:s}}j(e,n).run===s&&dt(e,n,d)}function Jo(e){let n=e,t=typeof n?.code=="string"?n.code:typeof n?.error?.code=="string"?n.error.code:void 0,i=typeof n?.message=="string"?n.message:typeof n?.error?.message=="string"?n.error.message:"";return t==="unknown_command"?"This version of the integration cannot test an action. Update it to test here.":t==="invalid"?`Home Assistant could not build the request${i===""?".":`: ${i}`}`:i===""?"No answer from Home Assistant.":i}function qo(e,n,t,i){let o=qe(t),s=i.values[t.key]??o[0]??"",a=l=>dt(e,n.id,{...j(e,n.id),values:{...j(e,n.id).values,[t.key]:l}}),r=t.prompt.trim()===""?t.key:t.prompt.trim();if(t.presetsOnly&&o.length>0)return p`<label class="ha-tv"><span>${r}</span>
      <select .value=${s} @change=${l=>a(l.target.value)}>
        ${o.map(l=>p`<option value=${l} ?selected=${l===s}>${l}</option>`)}
      </select></label>`;let d=`ha-q-${t.id}`;return p`<label class="ha-tv"><span>${r}</span>
    <input type="text" inputmode=${t.kind==="number"?"decimal":f} .value=${s} list=${o.length===0?f:d}
      placeholder=${t.key} @input=${l=>a(l.target.value)} />
    ${o.length===0?f:p`<datalist id=${d}>${o.map(l=>p`<option value=${l}></option>`)}</datalist>`}</label>`}function Fo(e){return e.status===null?"err":e.status>=200&&e.status<300?"ok":"warn"}function Ti(e,n){let t=Ko(e,n);return p`<span class="ha-val"><b>Value</b>${t.found?p`<code>${t.value}</code>`:p`<span class="ha-muted">${t.stale?"Send to see it":"Not found"}</span>`}</span>`}function Wo(e,n,t){if(t.body_binary===!0)return p`<p class="ha-quiet">The body is not text (${Pe(t.body_size??0)}).</p>`;let i=ko(e,t);if(i.raw==="")return p`<p class="ha-quiet">No body.</p>`;let o=i.isJson?vi(e):"raw",s=Ho(e),a=new Set((t.leaves??[]).map(u=>u.path)),r=n.reply?.source==="jsonField"?(n.reply.jsonPath??"").trim():void 0,d=e.uiState.get(tt)===!0,l=(u,m)=>{e.uiState.set(u,m),e.requestUpdate()},h=async()=>{try{await navigator.clipboard.writeText(i.text),l(tt,!0),setTimeout(()=>l(tt,!1),1500)}catch{}},c=(u,m)=>p`<button type="button" class="ha-bopt ${o===u?"on":""}" aria-pressed=${o===u?"true":"false"}
    ?disabled=${!i.isJson} title=${i.isJson?u==="pretty"?"Indented and colored":"As the server sent it":"The body is not JSON"}
    @click=${()=>l(li,u)}>${m}</button>`;return p`<div class="ha-bbar" role="toolbar" aria-label="Body options">
      <span class="ha-bseg">${c("pretty","Pretty")}${c("raw","Raw")}</span>
      <button type="button" class="ha-bopt ${s?"on":""}" aria-pressed=${s?"true":"false"} title="Wrap long lines" @click=${()=>l(pi,!s)}>Wrap</button>
      <button type="button" class="ha-bopt" title="Copy the body as shown" @click=${()=>{h()}}>${d?"Copied":"Copy"}</button>
      <span class="ha-bmeta">${i.isJson?"JSON":"Text"}${t.body_size===void 0?f:p` · ${Pe(t.body_size)}`}${t.body===void 0?p` · <span title="Update the integration to see the whole body.">first line only</span>`:f}${t.body_cut===!0?" \xB7 cut at the size limit":f}</span>
    </div>
    ${a.size===0||i.pieces===void 0?f:p`<p class="ha-info ha-pickline">Click a value to use it as the reply value.</p>`}
    <pre class="ha-snippet mono ${s?"":"nowrap"}">${i.pieces===void 0?i.text:i.pieces.map(u=>{if(u.kind==="ws"||u.kind==="punct")return u.text;if(u.path===void 0||!a.has(u.path))return p`<span class=${`j-${u.kind}`}>${u.text}</span>`;let m=u.path,H=r===m;return p`<span class=${`j-${u.kind} j-pick ${H?"on":""}`} role="button" tabindex="0" aria-pressed=${H?"true":"false"}
          title=${H?`The reply value: ${m}`:`Use ${m} as the reply value`}
          @click=${()=>{e.busy||e.edit(x=>ke(x,n.id,m))}}
          @keydown=${x=>{x.key!=="Enter"&&x.key!==" "||(x.preventDefault(),e.busy||e.edit(w=>ke(w,n.id,m)))}}>${u.text}</span>`})}</pre>`}function Go(e,n,t){let i=yo(e),o=Object.entries(t.headers??{}),s=[{id:"body",label:"Body"},{id:"headers",label:"Headers",extra:Ee(o.length)},{id:"paths",label:"Paths",extra:Ee(t.paths.length)}],a;return i==="body"?a=Wo(e,n,t):i==="headers"?a=o.length===0?p`<p class="ha-quiet">No headers.</p>`:p`<div class="ha-rlist" role="list" aria-label="Reply headers">
      ${o.map(([r,d])=>{let l=n.reply?.source==="header"&&n.reply.headerName===r;return p`<div class="ha-rrow ${l?"on":""}" role="listitem"><code>${r}</code><span class="mono ha-rval">${d}</span>
          <button type="button" class="ha-use" title=${`Read the ${r} header`} ?disabled=${e.busy}
            @click=${()=>e.edit(h=>En(h,n.id,r))}>${l?"Reply value":"Use"}</button></div>`})}</div>`:a=t.paths.length===0?p`<p class="ha-quiet">No JSON fields found.</p>`:p`<div class="ha-rlist" role="list" aria-label="JSON fields found">
      ${t.paths.map(r=>{let d=n.reply?.source==="jsonField"&&n.reply.jsonPath===r.path;return p`<button type="button" role="listitem" class="ha-rrow ha-path ${d?"on":""}" title=${`${r.path} is ${r.value}. Read this field.`} ?disabled=${e.busy}
          @click=${()=>e.edit(l=>ke(l,n.id,r.path))}><code>${r.path}</code><span class="mono ha-rval">${r.value}</span><span class="ha-use-word">${d?"Reply value":"Use"}</span></button>`})}</div>`,p`${xi("Response","ha-rtab",s,i,r=>wo(e,r),"ha-resp-tabs")}
    <div class="ha-resp-body" role="tabpanel" id="ha-rtab-panel" aria-labelledby=${`ha-rtab-${i}`}>${a}</div>`}function Yo(e,n){let t=j(e,n.id),i=se(n,z(e.document)),o=t.running?void 0:t.reply,s=o===void 0?void 0:Fo(o);return p`<section class="ha-resp" aria-label="Response">
    <div class="ha-resp-head" role="status">
      <span class="ha-cap">Response</span>
      ${o===void 0?f:p`
        <span class="ha-status ${s}">${o.status===null?"No answer":`HTTP ${o.status}`}</span>
        <span class="ha-ms">${o.elapsed_ms} ms</span>
        ${n.reply===void 0?f:Ti(n,t)}`}
    </div>
    ${i.length===0?f:p`<div class="ha-testvals" role="group" aria-label="Test values"><span class="ha-cap2">Test values</span>
      ${i.map(a=>qo(e,n,a,t))}</div>`}
    ${t.running?p`<p class="ha-quiet ha-pad">Sending…</p>`:t.error!==void 0?p`<p class="ha-test-err ha-pad" role="status">${t.error}</p>`:o===void 0?p`<p class="ha-quiet ha-pad">${ao}${Je(n)?" A test sends no voice clip.":""}</p>`:p`${o.error?p`<p class="ha-test-err ha-pad">${o.error}</p>`:f}${Go(e,n,o)}`}
  </section>`}function Xo(e,n){return p`<div class="ha-main-in" data-action=${n.id}>
    ${Ro(e,n)}
    ${Co(e,n)}
    ${zo(e,n)}
    ${Yo(e,n)}
  </div>`}function Zo(e){let n=ie(e.document).map(Be),t=new Map;for(let i of n)t.set(i.key.trim(),(t.get(i.key.trim())??0)+1);return p`<div class="ha-main-in ha-globals">
    <div class="ha-titlerow">
      <span class="ha-mtag ha-gtag big" aria-hidden="true">{ }</span>
      <h3 class="ha-h">Globals</h3><span class="ha-count">${n.length}</span>
      <span class="ha-title-acts"></span>
    </div>
    <div class="ha-scroll">
      <p class="ha-line ha-glead">${hi}</p>
      <fieldset class="ha-set" ?disabled=${e.busy}>
      <div class="ha-table ha-gtable" role="table" aria-label="Globals">
        <div class="ha-tr ha-th" role="row"><span role="columnheader">Key</span><span role="columnheader">Value</span><span role="columnheader">Used by</span><span></span></div>
        ${n.map(i=>{let o=i.key.trim(),s=Mn(e.document,o);return p`<div class="ha-tr" role="row" data-global=${i.id}>
            <span class="ha-td" role="cell"><input type="text" class="mono" .value=${i.key} placeholder="haurl"
              aria-label="Key" spellcheck="false" @input=${a=>e.edit(r=>Cn(r,i.id,a.target.value),`g:${i.id}:key`)} /></span>
            <span class="ha-td" role="cell">${lt(e,`${o===""?"Global":o} value`,i.value,a=>e.edit(r=>Ln(r,i.id,a),`g:${i.id}:value`),`global:${i.id}`,"https://ha.local:8123")}</span>
            <span class="ha-td ha-users" role="cell" title=${s.length===0?"No action uses it yet.":`Used by ${s.join(", ")}.`}>${s.length===0?p`<span class="ha-muted">Not used yet</span>`:fo(s.length,"action","actions")}</span>
            <span class="ha-td ha-end" role="cell"><button type="button" class="icon ha-remove" aria-label=${`Remove ${o===""?"this global":`{{${o}}}`}`}
              title=${s.length===0?"Remove this global":"Remove this global. The actions that use it send the {{key}} as typed."}
              @click=${()=>e.edit(a=>Nn(a,i.id))}>${$("delete")}</button></span>
            ${o===""?p`<p class="ha-warn ha-rowwarn">A global needs a key before it can be saved.</p>`:(t.get(o)??0)>1?p`<p class="ha-warn ha-rowwarn">Another global has this key. Each key must be its own.</p>`:f}
          </div>`})}
        <div class="ha-tr ha-addrow" role="row"><button type="button" class="ha-add-row ha-add-global" @click=${()=>To(e)}>${$("plus")}<span>Add global</span></button></div>
      </div>
      </fieldset>
      <p class="ha-line">Type {{key}} in a URL, header or body. It is filled in as typed, before the values asked for on the watch. Values stay hidden until shown.</p>
    </div>
  </div>`}function Ai(e){let n=bi(e);return n?.kind==="globals"?Zo(e):n?.kind==="action"?Xo(e,I(W(e.document,n.id))):p`<div class="ha-empty-main">
    <b>${Ae}</b>
    <span>An HTTP action is a web request a watch asks Home Assistant to send. Add one to start, or a global for a value several actions share.</span>
    <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy} @click=${()=>De(e)}>${$("plus")}<span>${$e}</span></button>
  </div>`}var $i=fe`
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
`;Yt({dirty:Qe,drop:Xn});typeof window<"u"&&window.addEventListener("beforeunload",e=>{Qe()&&(e.preventDefault(),e.returnValue="")});var Qo=15e3,Ei=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),ct=Ei?"\u2318":"Ctrl+",ce={min:200,max:520,middleMin:520},ut={left:280,right:0},ht="wrist-assistant-panel.http-actions.columns.v1",ea=8,_i=760;function ta(e,n){let t=jt(n,ce);return e<=0?t:Math.max(ce.min,Math.min(t,e-ce.middleMin))}function Si(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function na(e){let n=e?Date.parse(e):NaN;return Number.isNaN(n)?"":yt(Math.max(0,(Date.now()-n)/1e3))}function ia(e){return e instanceof HTMLElement?Bt(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function oa(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}function Oi(e,n){let t=[],i=[];if(e===void 0||e.revision<=0)return{collected:t,waiting:i};for(let o of n)((e.delivered?.[o.owner_watch_id]??0)>=e.revision?t:i).push(Dt(o,n));return{collected:t,waiting:i}}function aa(e,n){if(e.updated_by==="panel")return"saved here";let t=n.find(i=>i.owner_watch_id===e.updated_by);return t===void 0?"handed over by a phone":`handed over by ${t.paired_iphone_name??t.device_name??"a phone"}`}function sa(e){return e.some(n=>!n.is_orphan&&(_t(n)==="iphone"||(n.paired_iphone_name??"")!==""))}var A=class extends bt{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.barHost=void 0;this.headBar=new Nt(this);this.unsupported=!1;this.loading=!1;this.topMenuOpen=!1;this.columns={...ut};this.hostWidth=0;this.ownListAsked=!1;this.topHeight=0;this.symbols=new zt(()=>this.requestUpdate());this.uiState=new Map;this.reloadPending=!1;this.loadSeq=0;this.askedOnce=!1;this.onReconnect=()=>{this.isConnected&&this.load(!0)};this.onKeyDown=t=>{if(t.defaultPrevented)return;let i=t.composedPath();if(!i.includes(this)&&!this.headBar.holds(i)&&!oa()||this.renderRoot.querySelector("dialog[open]"))return;let o=t.metaKey||t.ctrlKey,s=t.key.toLowerCase();if(o&&!t.altKey&&s==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1;return}if(t.key==="Escape"&&Re(this.lookHost())){t.preventDefault();return}if(!ia(i[0])){if(o&&!t.altKey&&s==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}t.ctrlKey&&!t.metaKey&&!t.altKey&&s==="y"&&(t.preventDefault(),this.redo())}};this.onWindowPointerDown=t=>{let i=t.composedPath(),o=s=>i.some(a=>a instanceof HTMLElement&&a.classList.contains(s));this.topMenuOpen&&!o("pe-top-menu")&&(this.topMenuOpen=!1),o("ha-look")||Re(this.lookHost())};this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get allOwners(){return this.owners.length>0?this.owners:this.ownList??[]}get watches(){return Et(this.allOwners)}get draft(){if(!(this.record===void 0||this.unsupported))return Ze()}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Ut(ht,ut,ce),this.watchSize(),this.listenForReconnect(),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.stopPolling(),this.loadSeq++}willUpdate(t){this.hass&&(t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,gt(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]})),this.askedOnce||(this.askedOnce=!0,this.load())),this.followSave()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft)),this.observeTop()}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let i of t){if(i.target!==this){this.measureTop(i.target);continue}let o=i.contentRect;Math.abs(o.width-this.hostWidth)>=1&&(this.hostWidth=o.width)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&t.observe(i))}measureTop(t){let i=t.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=Ze()?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let i=()=>this.saveEnded();t.then(i,i)}saveEnded(){this.requestUpdate(),this.isConnected&&(this.reloadPending=!1,this.load(!0))}async load(t=!1){let i=this.hass;if(!i)return;if(t&&this.saving){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),t||(this.loading=this.record===void 0,this.loadError=void 0);try{let s=await Ce(i);if(o!==this.loadSeq)return;if(this.saving){this.reloadPending=!0;return}this.unsupported=!1,this.show(s),this.loadError=void 0}catch(s){if(o!==this.loadSeq)return;zn(s)?(this.unsupported=!0,this.loadError=void 0):(!t||this.record===void 0)&&(this.loadError=M(s).message)}this.loading=!1,this.unsupported||this.pollIfWaiting()}flushPending(){!this.reloadPending||this.saving||(this.reloadPending=!1,this.load(!0))}show(t){this.record=t;let i=t.revision>0?on(t.document):void 0,o=Gn(i,t.revision);o.kept.length>0?this.note={kind:"warn",text:Oe(o.kept)}:o.mergedIntoEdits&&(this.note={kind:"warn",text:"The HTTP actions changed somewhere else. Your edits are kept."}),this.requestUpdate()}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Oi(this.record,this.watches).waiting.length===0)&&(this.pollTimer=window.setTimeout(()=>{this.pollTimer=void 0,this.load(!0)},Qo))}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(t,i){let o=this.draft;if(!o||this.saving)return!1;let s=o.apply(t(o.document),i);return this.requestUpdate(),s}memoIcons(){let t=this.icons??Kt,i=this.iconMemo;if(i!==void 0&&i.provider===t&&i.tick===this.iconsTick)return i.icons;let o=Jt(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:o},o}viewHost(){let t=this.draft,i=this.hass;if(t===void 0||i===void 0)return;let o=this;return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,get document(){return t.document},get busy(){return o.saving},edit:(s,a)=>this.draft===t&&this.edit(s,a),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate(),test:(s,a,r)=>xt(i,s,a,r),newId:re}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}startLibrary(){if(this.record===void 0||this.unsupported)return;Yn();let t=this.viewHost();t!==void 0&&De(t),this.requestUpdate()}async save(){let t=this.hass,i=this.draft;if(!t||!i||this.saving||!i.dirty)return;this.note=void 0,i.apply(Pn(i.document,i.base));let o=Wn(i,{save:(a,r)=>vt(t,a,r).catch(d=>{throw Pi(d)}),fetch:async()=>{let a=await Ce(t).catch(r=>{throw Pi(r)});return a.document===void 0?{revision:a.revision}:{revision:a.revision,document:a.document}}});this.followedSave=i.saveDone,this.requestUpdate();let s=await o.catch(a=>{let{code:r,message:d}=M(a);return{ok:!1,revision:i.revision,merged:!1,code:r??"unknown",message:d}});this.saveEnded(),this.note=Zn(s),this.flushPending()}lookHost(){return{uiState:this.uiState,requestUpdate:()=>this.requestUpdate()}}render(){let t=this.draft;return p`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(t):f}
        ${this.note?p`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:f}
      </div>
      ${this.renderBody()}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=_i}renderTopBar(t){let i=t!==void 0,o=i&&this.dirty,s=this.barHost!==void 0;return p`<div class="wa-bar ${s?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="HTTP actions">
      ${s?p`<span class="tb-note">${Te}</span>`:p`<span class="ha-title"><b>HTTP actions</b><span class="ha-shared">${Te}</span></span>`}
      <span class="spacer"></span>
      ${s&&i?Mt({newWatch:!1,dirty:o,saved:this.renderSaved()}):f}
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
        <button class="cv-act icon undo" ?disabled=${!t.canUndo} title=${`Undo (${ct}Z)`} aria-label="Undo" @click=${()=>this.undo()}>${$("undo")}</button>
        <button class="cv-act icon undo" ?disabled=${!t.canRedo} title=${Ei?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo" @click=${()=>this.redo()}>${$("redo")}</button>
        <button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${ct}S). A save reaches every watch the next time it checks.`:`Nothing to save (${ct}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${s?f:p`<span class="tb-saved" title=${o?"Unsaved changes":""}>${this.renderSaved()}</span>`}`:f}
    </div>`}renderSaved(){let t=this.record,i=this.savedText();if(t===void 0||i==="")return f;let o=aa(t,this.allOwners);return p`<span title=${`Revision ${t.revision}, ${o}`}>${i}</span>`}savedText(){let t=this.record;if(t===void 0||t.revision<=0)return"";let i=na(t.updated_at);return i?`Saved ${i}`:"Saved"}renderSyncPill(){let t=this.record;if(t===void 0||t.revision<=0||this.unsupported)return f;let{collected:i,waiting:o}=Oi(t,this.watches);if(i.length===0&&o.length===0)return f;let s=[o.length>0?`Waiting: ${o.join(", ")}. ${Pt}`:"",i.length>0?`Synced: ${i.join(", ")}.`:""].filter(a=>a!=="").join(" ");return p`<span class="tb-sync ${o.length===0?"ok":"warn"}" title=${s}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.length===0?Ot:St}</span>
    </span>`}listWidth(){return this.hostWidth>0&&this.hostWidth<=_i?this.columns.left:ta(this.hostWidth-ea,this.columns.left)}renderGutter(){return p`<div class="gutter left" role="separator" aria-orientation="vertical" aria-label="Resize the list"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${t=>{Vt(t,{side:"left",base:this.listWidth(),limits:ce,onWidth:i=>{this.columns={...this.columns,left:i}},onEnd:()=>Le(ht,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,left:ut.left},Le(ht,this.columns)}}></div>`}renderBody(){if(this.unsupported)return p`<div class="ha-calm"><div class="pe-empty"><b>${Un}</b></div></div>`;if(this.loadError!==void 0)return p`<div class="ha-calm"><div class="pe-empty">
        <span>Could not read the HTTP actions: ${this.loadError}</span>
        <button class="pe-btn" @click=${()=>{this.load()}}>Try again</button>
      </div></div>`;let t=this.record;if(this.loading||t===void 0)return p`<div class="ha-calm"><div class="pe-empty">Loading…</div></div>`;let i=this.draft,o=this.viewHost();if(i===void 0||o===void 0)return p`<div class="ha-calm"><div class="pe-empty ha-empty"><b>${Ae}</b>
        <span>An HTTP action is a web request a watch asks Home Assistant to send. ${Te}</span>
        <span class="ha-start"><button class="pe-btn pe-primary" @click=${()=>this.startLibrary()}>${$("plus")}<span>${$e}</span></button></span>
        ${sa(this.allOwners)?p`<span class="pe-muted">${jn}</span>`:f}
      </div></div>`;let s=N(i.document).filter(a=>a.presentsClientCertificate===!0).length;return p`${s===0?f:p`<p class="ha-cert-line">${s===1?"An action asks":`${s} actions ask`} for a client certificate. ${_e}</p>`}
    <div class="layout pe-layout ha-two ${this.stacked?"cols-1":""}" style=${`--wa-left:${this.listWidth()}px`}>
      <div class="column left">
        ${ki(o)}
      </div>
      ${this.renderGutter()}
      <div class="column card ha-main">
        ${Ai(o)}
      </div>
    </div>
    ${this.renderFoot(t,i)}`}renderFoot(t,i){let o=ge(i.document);return p`<div class="ha-foot" role="status">
      ${t.revision<=0?p`<span>Not saved yet. The first save makes the library.</span>`:f}
      <span class="spacer"></span>
      <span class="pe-muted ${o.near?"ha-near":""}">${Si(o.size)} of ${Si(o.limit)}</span>
    </div>`}static{this.styles=[Ct,wt,Ht,kt,Tt,At,$t,fe`
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
  `,$i,It]}};_([B({attribute:!1})],A.prototype,"hass",2),_([B({attribute:!1})],A.prototype,"owners",2),_([B({type:Boolean,reflect:!0})],A.prototype,"narrow",2),_([B({attribute:!1})],A.prototype,"icons",2),_([B({attribute:!1})],A.prototype,"iconsTick",2),_([B({attribute:!1})],A.prototype,"barHost",2),_([L()],A.prototype,"record",2),_([L()],A.prototype,"unsupported",2),_([L()],A.prototype,"loading",2),_([L()],A.prototype,"loadError",2),_([L()],A.prototype,"note",2),_([L()],A.prototype,"ownList",2),_([L()],A.prototype,"topMenuOpen",2),_([L()],A.prototype,"columns",2),_([L()],A.prototype,"hostWidth",2);function Pi(e){let{code:n,message:t}=M(e);return Object.assign(new Error(t),n===void 0?{}:{code:n})}customElements.get("wa-http-actions-editor")||customElements.define("wa-http-actions-editor",A);export{ht as HA_COLUMNS_KEY,A as WaHttpActionsEditor,ta as fitHttpListWidth,sa as homeHasPhone,Oi as httpActionsDelivery,aa as httpActionsSavedBy};
