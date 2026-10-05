import{a as De,d as Re,e as Rt,f as Ce,h as P,i as Be}from"./chunk-7JMKOI2L.js";import{a as je,b as Ke,d as ze,n as b}from"./chunk-ZIEG52KN.js";import{Ac as ke,Bc as Te,Cc as Ae,Ce as Le,Ec as $e,Jc as _e,Ob as Dt,Pb as ve,Qb as xe,Qc as M,Uf as Ne,a as O,ad as Se,bd as Oe,bg as U,c as ft,cg as Me,d as l,dg as Ct,eg as Ie,fd as Pe,g as f,gd as Ee,hh as Je,i as be,ig as Ue,ih as qe,j as q,jc as ye,k as L,rg as Ve,tc as T,ub as ge,xc as we,zc as He}from"./chunk-OAI4TPGQ.js";var $="actions",D="globalVariables",Oi=1,Fe=256*1024,nt=["GET","POST","PUT","PATCH","DELETE"],Xe=["POST","PUT","PATCH","DELETE"],Nt=["none","json","form","text","audio"],Mt=["statusCode","bodyText","jsonField","header","regex"],Ze=["text","number"],It=10,Ut=1,Vt=60,We=/^[A-Za-z0-9_]+$/,Pi=/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g;function jt(){return{[$]:[],[D]:[],schemaVersion:Oi}}function Qe(t){return b(t)?t:void 0}function Ei(t){return new TextEncoder().encode(JSON.stringify(t)).length}function gt(t){let n=Ei(t);return{size:n,limit:Fe,near:n/Fe>.8}}function E(t,n){let e=t!==void 0&&Object.hasOwn(t,n)?t[n]:void 0;return Array.isArray(e)?e:[]}function N(t){return E(t,$).filter(b)}function it(t){return E(t,D).filter(b)}function W(t,n){return N(t).find(e=>e.id===n)}function k(t){return typeof t=="string"?t:void 0}function et(t,n){return typeof t=="string"&&n.includes(t)?t:void 0}function tn(t){let n=b(t)?t:{};return{id:k(n.id)??"",name:k(n.name)??"",value:k(n.value)??""}}function mt(t){let n=b(t)?t:{},e=Array.isArray(n.presetValues)?n.presetValues.filter(i=>typeof i=="string"):[];return{id:k(n.id)??"",key:k(n.key)??"",prompt:k(n.prompt)??"",kind:et(n.kind,Ze)??"text",presetValues:e,presetsOnly:n.presetsOnly===!0}}function Kt(t){let n=b(t)?t:{};return{id:k(n.id)??"",key:k(n.key)??"",value:k(n.value)??""}}function Di(t){if(!b(t))return;let n=et(t.source,Mt);if(n===void 0)return;let e={source:n};for(let i of["jsonPath","headerName","pattern","unit"]){let o=k(t[i]);o!==void 0&&(e[i]=o)}return e}function I(t){let n=typeof t.timeout=="number"&&Number.isFinite(t.timeout)?t.timeout:void 0,e={id:k(t.id)??"",name:k(t.name)??"",method:k(t.method)??"POST",url:k(t.url)??"",headers:Array.isArray(t.headers)?t.headers.map(tn):[],bodyContentType:et(t.bodyContentType,Nt)??"none",variables:Array.isArray(t.variables)?t.variables.map(mt):[],allowsUntrustedCertificate:t.allowsUntrustedCertificate===!0,presentsClientCertificate:t.presentsClientCertificate===!0},i=k(t.body);i!==void 0&&(e.body=i),n!==void 0&&(e.timeout=n);let o=Di(t.responseConfig);o!==void 0&&(e.reply=o);let s=k(t.icon),a=k(t.iconColor);return s!==void 0&&(e.icon=s),a!==void 0&&(e.iconColor=a),e}function Y(t){return t.method.trim().toUpperCase()}function ot(t){return Xe.includes(Y(t))}function zt(t){return t.bodyContentType==="audio"&&ot(t)}function at(t){return t.url.trim()===""}function vt(t){let n=t.name.trim();if(n!=="")return n;let e=t.url.trim();return e!==""?e:"Untitled action"}function Lt(t){let n=t.replaceAll("_"," ").replaceAll("-"," ");return n.trim()===""?"Value":n.split(" ").filter(e=>e!=="").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}function Ri(t){return t.replace(/[^A-Za-z0-9_]/g,"")}function Bt(t){let n=new Set,e=[];for(let i of t.presetValues){let o=i.trim();o===""||n.has(o)||(n.add(o),e.push(o))}return e}function en(t){let n=new Set,e=[];for(let i of t)for(let o of i.matchAll(Pi)){let s=o[1];n.has(s)||(n.add(s),e.push(s))}return e}function j(t){let n=new Set;for(let e of it(t)){let i=Kt(e).key.trim();i!==""&&n.add(i)}return n}function nn(t){let n=[t.url];for(let e of t.headers)n.push(e.name),Ui(e)||n.push(e.value);return ot(t)&&t.bodyContentType!=="audio"&&t.body!==void 0&&n.push(t.body),n}function G(t,n){let e=en(nn(t));return{global:e.filter(i=>n.has(i)),asked:e.filter(i=>!n.has(i))}}function st(t,n){let{asked:e}=G(t,n);return e.map(i=>t.variables.find(o=>o.key===i)).filter(i=>i!==void 0)}function tt(t,n,e){n==="__proto__"?Object.defineProperty(t,n,{value:e,enumerable:!0,writable:!0,configurable:!0}):t[n]=e}function v(t,n,e){if(Object.hasOwn(t,n)){if(P(t[n],e)&&typeof t[n]==typeof e)return t;let s={};for(let a of Object.keys(t))tt(s,a,a===n?e:t[a]);return s}let i={},o=!1;for(let s of Object.keys(t))!o&&s>n&&(tt(i,n,e),o=!0),tt(i,s,t[s]);return o||tt(i,n,e),i}function bt(t,n){if(!Object.hasOwn(t,n))return t;let e={};for(let i of Object.keys(t))i!==n&&tt(e,i,t[i]);return e}function X(t,n,e){return e===void 0?bt(t,n):v(t,n,e)}function xt(t,n,e){let i=t.findIndex(r=>b(r)&&r.id===n);if(i<0)return t;let o=t[i],s=e(o);if(s===o)return t;let a=t.slice();return a[i]=s,a}function K(t,n,e){return e===t[n]?t:v(t,n,e)}function w(t,n,e){let i=E(t,$),o=xt(i,n,e);return o===i?t:K(t,$,o)}function on(t,n,e){let i=E(t,D),o=xt(i,n,e);return o===i?t:K(t,D,o)}function rt(){let t=globalThis.crypto;if(t!==void 0&&typeof t.randomUUID=="function")return t.randomUUID().toUpperCase();let n=e=>Array.from({length:e},()=>Math.floor(Math.random()*16).toString(16)).join("");return`${n(8)}-${n(4)}-4${n(3)}-${(8+Math.floor(Math.random()*4)).toString(16)}${n(3)}-${n(12)}`.toUpperCase()}function an(t,n){return{bodyContentType:"none",headers:[],id:t,method:"POST",name:n,url:"",variables:[]}}function sn(t,n="New action"){let e=new Set(N(t).map(i=>I(i).name.trim().toLowerCase()));if(!e.has(n.toLowerCase()))return n;for(let i=2;;i++)if(!e.has(`${n} ${i}`.toLowerCase()))return`${n} ${i}`}function rn(t,n){return K(t,$,[...E(t,$),n])}function dn(t,n,e=rt){let i=E(t,$),o=i.findIndex(u=>b(u)&&u.id===n);if(o<0)return{document:t};let s=i[o],a=e(),r=v(s,"id",a);r=v(r,"name",`${vt(I(s))} Copy`);let d=u=>Array.isArray(u)?u.map(c=>b(c)?v(c,"id",e()):c):u;Array.isArray(s.headers)&&(r=v(r,"headers",d(s.headers))),Array.isArray(s.variables)&&(r=v(r,"variables",d(s.variables)));let p=i.slice();return p.splice(o+1,0,r),{document:K(t,$,p),id:a}}function ln(t,n){let e=E(t,$),i=e.filter(o=>!(b(o)&&o.id===n));return i.length===e.length?t:K(t,$,i)}function Jt(t,n,e){let i=E(t,$),o=i.findIndex(d=>b(d)&&d.id===n);if(o<0)return t;let s=Math.max(0,Math.min(e,i.length-1));if(o===s)return t;let a=i.slice(),[r]=a.splice(o,1);return a.splice(s,0,r),K(t,$,a)}function pn(t,n,e){return w(t,n,i=>v(i,"name",e))}function cn(t,n,e){let i=e.trim();return w(t,n,o=>X(o,"icon",i===""?void 0:i))}function un(t,n,e){return e!==void 0&&!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e)?t:w(t,n,i=>X(i,"iconColor",e?.toUpperCase()))}function hn(t,n,e){let i=e.trim().toUpperCase();return nt.includes(i)?w(t,n,o=>{let s=v(o,"method",i);return!Xe.includes(i)&&s.bodyContentType==="audio"&&(s=v(s,"bodyContentType","none")),s}):t}function fn(t,n,e){return w(t,n,i=>v(i,"url",e))}function mn(t,n,e){return Nt.includes(e)?w(t,n,i=>{let o=v(i,"bodyContentType",e);return e==="audio"?bt(o,"body"):o}):t}function qt(t,n,e){return w(t,n,i=>X(i,"body",e.trim()===""?void 0:e))}function bn(t,n,e){return e!==void 0&&(!Number.isFinite(e)||e<=0)?t:w(t,n,i=>X(i,"timeout",e))}function gn(t,n,e){return w(t,n,i=>X(i,"allowsUntrustedCertificate",e?!0:void 0))}function F(t){return E(t,"headers")}function vn(t,n,e){return w(t,n,i=>v(i,"headers",[...F(i),{id:e,name:"",value:""}]))}function yt(t,n,e,i){return w(t,n,o=>{let s=F(o),a=xt(s,e,r=>{let d=r;return i.name!==void 0&&(d=v(d,"name",i.name)),i.value!==void 0&&(d=v(d,"value",i.value)),d});return a===s?o:v(o,"headers",a)})}function Ft(t,n,e){return w(t,n,i=>{let o=F(i),s=o.filter(a=>!(b(a)&&a.id===e));return s.length===o.length?i:v(i,"headers",s)})}var xn=[["none","None"],["bearer","Bearer token"],["basic","Username and password"],["apiKey","API key header"]],Ci="X-Api-Key",Ye="A07A0000-0000-0000-0000-0000000A0140",Li=new Set(["x-api-key","api-key","apikey","x-api-token","x-auth-token","x-access-token"]);function V(t="none"){return{kind:t,token:"",username:"",password:"",headerName:Ci,apiKeyValue:""}}function Ni(t){let n=new TextEncoder().encode(t),e="";for(let i of n)e+=String.fromCharCode(i);return btoa(e)}function Mi(t){if(!(!/^[A-Za-z0-9+/]*={0,2}$/.test(t)||t.length%4!==0))try{let n=atob(t),e=Uint8Array.from(n,i=>i.charCodeAt(0));return new TextDecoder("utf-8",{fatal:!0}).decode(e)}catch{return}}function Ii(t){switch(t.kind){case"bearer":{let n=t.token.trim();return n===""?void 0:{name:"Authorization",value:`Bearer ${n}`}}case"basic":return t.username===""&&t.password===""?void 0:{name:"Authorization",value:`Basic ${Ni(`${t.username}:${t.password}`)}`};case"apiKey":{let n=t.headerName.trim(),e=t.apiKeyValue.trim();return n===""||e===""?void 0:{name:n,value:e}}default:return}}function wt(t){let n=t.name.trim(),e=t.value.trim();if(n.toLowerCase()==="authorization"){if(e.length>7&&e.slice(0,7).toLowerCase()==="bearer ")return{...V("bearer"),token:e.slice(7).trim()};if(e.length>6&&e.slice(0,6).toLowerCase()==="basic "){let i=Mi(e.slice(6).trim()),o=i?.indexOf(":")??-1;return i===void 0||o<0?void 0:{...V("basic"),username:i.slice(0,o),password:i.slice(o+1)}}return}if(Li.has(n.toLowerCase()))return e===""?void 0:{...V("apiKey"),headerName:n,apiKeyValue:e}}function Ui(t){return wt(t)?.kind==="basic"}function yn(t){for(let n of t){let e=wt(n);if(e!==void 0)return{auth:e,headerId:n.id}}return{auth:V()}}function wn(t,n,e,i){let o=Ii(i),s=W(t,n);if(s===void 0)return{document:t};let a=F(s);if((e===void 0?-1:a.findIndex(c=>b(c)&&c.id===e))>=0)return o===void 0?{document:Ft(t,n,e)}:{document:yt(t,n,e,o),headerId:e};if(o===void 0)return{document:t};let p=a.some(c=>b(c)&&c.id===Ye)?rt():Ye,u={id:p,name:o.name,value:o.value};return{document:w(t,n,c=>v(c,"headers",[u,...F(c)])),headerId:p}}function Ge(t,n){return{id:t,key:n,kind:"text",presetValues:[],presetsOnly:!1,prompt:Lt(n)}}function Hn(t,n,e=rt){let i=W(t,n);if(i===void 0)return t;let o=I(i),s=G(o,j(t)).asked,a=E(i,"variables"),r=c=>mt(c).key,d=s.filter(c=>!a.some(h=>r(h)===c));if(d.length===0)return t;let p=a.map((c,h)=>[c,h]).filter(([c])=>!s.includes(r(c))),u;if(d.length===1&&p.length===1){let[c,h]=p[0],g=r(c),_=b(c)?v(c,"key",d[0]):Ge(e(),d[0]),x=mt(c).prompt;b(c)&&(x===""||x===Lt(g))&&(_=v(_,"prompt",Lt(d[0]))),u=a.slice(),u[h]=_}else u=[...a,...d.map(c=>Ge(e(),c))];return w(t,n,c=>v(c,"variables",u))}function kn(t,n,e,i){return w(t,n,o=>{let s=E(o,"variables"),a=xt(s,e,r=>{let d=r;return i.prompt!==void 0&&(d=v(d,"prompt",i.prompt)),i.kind!==void 0&&Ze.includes(i.kind)&&(d=v(d,"kind",i.kind)),i.presetValues!==void 0&&(d=v(d,"presetValues",i.presetValues)),i.presetsOnly!==void 0&&(d=v(d,"presetsOnly",i.presetsOnly)),d});return a===s?o:v(o,"variables",a)})}function Tn(t,n,e){return w(t,n,i=>{let o=E(i,"variables"),s=o.filter(a=>!(b(a)&&a.id===e));return s.length===o.length?i:v(i,"variables",s)})}function An(t,n){let e=new Set(G(t,n).asked);return t.variables.filter(i=>!e.has(i.key))}function $n(t,n){let e=j(t),i=new Map(N(n).map(s=>[s.id,s])),o=t;for(let s of N(t)){let a=k(s.id);if(a===void 0)continue;let r=i.get(a);r!==void 0&&P(r,s)||(o=w(o,a,d=>{let p=d,u=F(d),c=u.filter(x=>!b(x)||tn(x).name.trim()!=="");c.length!==u.length&&(p=v(p,"headers",c));let h=I(p),g=E(p,"variables"),_=G(h,e).asked.map(x=>g.find(H=>mt(H).key===x)).filter(x=>x!==void 0).map(x=>{if(!b(x)||!Array.isArray(x.presetValues))return x;let H=x.presetValues.map(R=>typeof R=="string"?R.trim():R).filter(R=>R!=="");return P(H,x.presetValues)&&H.length===x.presetValues.length?x:v(x,"presetValues",H)});return(_.length!==g.length||_.some((x,H)=>x!==g[H]))&&(p=v(p,"variables",_)),p}))}return o}var Wt={statusCode:void 0,bodyText:void 0,jsonField:"jsonPath",header:"headerName",regex:"pattern"};function Ht(t,n,e){return w(t,n,i=>{if(e===void 0)return bt(i,"responseConfig");if(!Mt.includes(e))return i;let o=b(i.responseConfig)?i.responseConfig:{},s=v(o,"source",e);for(let a of["jsonPath","headerName","pattern"])Wt[e]!==a&&(s=bt(s,a));return v(i,"responseConfig",s)})}function B(t,n,e,i){return w(t,n,o=>{if(!b(o.responseConfig))return o;let s=e==="unit"?i:i.trim();return v(o,"responseConfig",X(o.responseConfig,e,s===""?void 0:s))})}function _n(t,n,e){return B(Ht(t,n,"jsonField"),n,"jsonPath",e)}function Sn(t,n,e){return B(Ht(t,n,"header"),n,"headerName",e)}function On(t,n="value"){let e=j(t);if(!e.has(n))return n;for(let i=2;;i++)if(!e.has(`${n}_${i}`))return`${n}_${i}`}function Pn(t,n,e){return K(t,D,[...E(t,D),{id:n,key:e,value:""}])}function En(t,n,e){return on(t,n,i=>v(i,"key",Ri(e)))}function Dn(t,n,e){return on(t,n,i=>v(i,"value",e))}function Rn(t,n){let e=E(t,D),i=e.filter(o=>!(b(o)&&o.id===n));return i.length===e.length?t:K(t,D,i)}function Cn(t,n){return n===""?[]:N(t).map(I).filter(e=>en(nn(e)).includes(n)).map(vt)}function Ln(t){if(!b(t))return["The library is not an object."];let n=[],e=Object.hasOwn(t,$)?t[$]:void 0,i=Object.hasOwn(t,D)?t[D]:void 0;Array.isArray(e)||n.push("The action list is missing."),i!==void 0&&!Array.isArray(i)&&n.push("The globals are not a list.");let o=new Set;(Array.isArray(e)?e:[]).forEach((a,r)=>{if(!b(a)){n.push(`Action ${r+1} is not an object.`);return}let d=typeof a.name=="string"&&a.name.trim()!==""?`"${a.name.trim()}"`:`Action ${r+1}`,p=a.id;typeof p!="string"||p===""?n.push(`${d} has no id.`):o.has(p)?n.push(`${d} has the id of another action.`):o.add(p);for(let h of["name","method","url"])Object.hasOwn(a,h)&&typeof a[h]!="string"&&n.push(`${d} has a ${h} that is not text.`);for(let h of["body","icon","iconColor"])Object.hasOwn(a,h)&&a[h]!==null&&typeof a[h]!="string"&&n.push(`${d} has a ${h} that is not text.`);typeof a.method=="string"&&!nt.includes(a.method.trim().toUpperCase())&&n.push(`${d} uses ${a.method}, which is not GET, POST, PUT, PATCH or DELETE.`),Object.hasOwn(a,"bodyContentType")&&et(a.bodyContentType,Nt)===void 0&&n.push(`${d} has a body type Home Assistant does not know.`),Object.hasOwn(a,"timeout")&&a.timeout!==null&&(typeof a.timeout!="number"||!Number.isFinite(a.timeout))&&n.push(`${d} has a timeout that is not a number.`),b(a.responseConfig)&&et(a.responseConfig.source,Mt)===void 0&&n.push(`${d} reads its reply value from a source Home Assistant does not know.`);let u=a.headers;Object.hasOwn(a,"headers")&&!Array.isArray(u)&&n.push(`${d} has headers that are not a list.`);for(let h of Array.isArray(u)?u:[])if(!b(h)||Object.hasOwn(h,"name")&&typeof h.name!="string"||Object.hasOwn(h,"value")&&typeof h.value!="string"){n.push(`${d} has a header that is not text.`);break}let c=a.variables;Object.hasOwn(a,"variables")&&!Array.isArray(c)&&n.push(`${d} has values to ask for that are not a list.`);for(let h of Array.isArray(c)?c:[]){let g=b(h)?h.key:void 0;if(typeof g!="string"||!We.test(g)){n.push(`${d} asks for a value whose key is not letters, digits and underscores.`);break}}});let s=new Set;return(Array.isArray(i)?i:[]).forEach((a,r)=>{let d=b(a)&&typeof a.key=="string"?a.key.trim():"";if(!b(a)||Object.hasOwn(a,"value")&&typeof a.value!="string"){n.push(`Global ${r+1} is not text.`);return}d===""?n.push(`Global ${r+1} has no name.`):We.test(d)?s.has(d)?n.push(`Two globals are named {{${d}}}.`):s.add(d):n.push(`The global {{${d}}} has a name that is not letters, digits and underscores.`)}),n}var Yt="Shared by every watch.",kt="No HTTP actions yet.",Tt="Add an action",Nn="Turning on Edit pages in Home Assistant in the iPhone app brings the phone's actions here.",Mn="Update the integration to edit HTTP actions here.",At="Home Assistant does not send a client certificate.",In="Type {{key}} in the URL, a header or the body. A key that names a global is filled in from Globals. Any other key is asked for on the watch when the action runs. Keys are letters, digits and underscores.";function Un(t){return M(t).code==="unknown_command"}var Vn={list:"action",field:$,keyOf:t=>typeof t.id=="string"&&t.id!==""?t.id:void 0,nameOf:t=>typeof t.name=="string"?t.name.trim():""},jn={list:"global",field:D,keyOf:t=>typeof t.key=="string"&&t.key.trim()!==""?t.key.trim():void 0,nameOf:t=>typeof t.key=="string"?`{{${t.key.trim()}}}`:""};function Z(t,n){return t!=null&&Object.hasOwn(t,n)?t[n]:void 0}function dt(t,n){if(!Array.isArray(t))return;let e=new Set,i=[];for(let o of t){if(!b(o))return;let s=n.keyOf(o);if(s===void 0||e.has(s))return;e.add(s),i.push([s,o])}return i}function Vi(t,n,e){let i=dt(t,e),o=dt(n,e);if(i===void 0||o===void 0)return t;let s=new Set(o.map(([a])=>a));return i.filter(([a])=>s.has(a)).map(([,a])=>a)}function ji(t,n,e,i){let o=t===null?void 0:t,s=n===null?void 0:n,a=e===null?void 0:e,r=o===void 0?[]:dt(o,i),d=s===void 0?void 0:dt(s,i),p=a===void 0?void 0:dt(a,i);if(r===void 0||d===void 0||p===void 0)return{value:P(s,o)?a:s,clashes:[]};let u=new Map(r),c=new Map(d),h=new Map(p),g=[],_=(m,y)=>{let S=u.get(m);return S===void 0||!P(y,S)},x=(m,y,S)=>_(m,y)?(_(m,S)&&!P(y,S)&&g.push({list:i.list,key:m,name:i.nameOf(y)||i.nameOf(S)}),y):S,H=(m,y)=>u.has(m)&&!_(m,y)?void 0:y,R=d.map(([m])=>m).filter(m=>u.has(m)),fe=r.map(([m])=>m).filter(m=>c.has(m)),Si=R.length!==fe.length||R.some((m,y)=>m!==fe[y]),ut=[],ht=m=>{m!==void 0&&ut.push(m)};if(Si){for(let[m,y]of d){let S=h.get(m);ht(S!==void 0?x(m,y,S):H(m,y))}for(let[m,y]of p)c.has(m)||ht(H(m,y))}else{for(let[m,y]of p){let S=c.get(m);ht(S!==void 0?x(m,S,y):H(m,y))}for(let[m,y]of d)h.has(m)||ht(H(m,y))}let me=m=>Array.isArray(m)&&m.length===ut.length&&ut.every((y,S)=>y===m[S]);return me(a)?{value:a,clashes:g}:me(s)?{value:s,clashes:g}:{value:ut,clashes:g}}function Ki(t,n,e,i){return t==null?Vi(Z(e,i.field),Z(n,i.field),i):Z(t,i.field)}function Gt(t,n,e,i){return ji(Ki(t,n,e,i),Z(n,i.field),Z(e,i.field),i)}function Kn(t,n,e){return[...Gt(t,n,e,Vn).clashes,...Gt(t,n,e,jn).clashes]}function zn(t,n,e){let i=Be(t,n,e);for(let o of[Vn,jn]){let s=Gt(t,n,e,o).value,a=Z(i,o.field);if(s!==a){if(s===void 0){if(!Object.hasOwn(i,o.field))continue;let{[o.field]:r,...d}=i;i=d;continue}(i===e||i===n)&&(i={...i}),i[o.field]=s}}return i}var Bn=100,zi=3,$t=class{constructor(n,e){this._undo=[];this._redo=[];this._kept=[];this._base=n,this._revision=e,this._document=n}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get kept(){return this._kept}get dirty(){let n=this._dirty;if(n!==void 0&&n.document===this._document&&n.base===this._base)return n.value;let e=this._document!==this._base&&!P(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(n,e){if(n===this._document||P(n,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let i=this._undo[this._undo.length-1];return P(n,i)?(this._undo.pop(),this._document=i,this._coalesceKey=void 0):this._document=n,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=n,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let n=this._undo.pop();return n===void 0?!1:(this._redo.push(this._document),this._document=n,!0)}redo(){this._coalesceKey=void 0;let n=this._redo.pop();return n===void 0?!1:(this.pushUndo(this._document),this._document=n,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(n,e){return e<this._revision?(this._kept=[],!1):this.mergeOnto(n,e)}restart(n,e){return this.mergeOnto(n,e)}mergeOnto(n,e){this._coalesceKey=void 0;let i=this._base;this._kept=this._document===i?[]:Kn(i,this._document,n);let o=new Map,s=c=>{let h=o.get(c);if(h!==void 0)return h;let g=c===i?n:zn(i,c,n);return g!==n&&P(g,n)&&(g=n),o.set(c,g),g},a=this._document,r=[...this._undo,this._document,...this._redo.slice().reverse()].map(s),d=this._undo.length,p=[],u=0;return r.forEach((c,h)=>{let g=p[p.length-1];g!==void 0&&(g===c||P(g,c))?h===d&&(p[p.length-1]=c):p.push(c),h===d&&(u=p.length-1)}),this._undo=p.slice(0,u),this._document=p[u],this._redo=p.slice(u+1).reverse(),this._base=n,this._revision=e,this._document!==a&&!P(this._document,a)}saved(n,e){e<this._revision||(this._coalesceKey=void 0,this._base=n,this._revision=e)}get saving(){return lt.has(this)}get saveDone(){return lt.get(this)}pushUndo(n){this._undo.push(n),this._undo.length>Bn&&this._undo.splice(0,this._undo.length-Bn)}},lt=new WeakMap;function Jn(t,n){if(lt.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"The HTTP actions are being saved already."});let e=Ji(t,n).finally(()=>lt.delete(t));return lt.set(t,e),e}function Bi(t){let n=gt(t);return n.size<=n.limit?[]:[`The library is ${Math.ceil(n.size/1024)} KB, past the ${n.limit/1024} KB Home Assistant keeps.`]}async function Ji(t,n){let e=!1,i=new Map,o=()=>i.size===0?{}:{kept:[...i.values()]},s=(a,r,d)=>({ok:!1,revision:t.revision,merged:e,code:a,message:r,...o(),...d===void 0?{}:{problems:d}});for(let a=1;;a++){let r=t.document,d=[...Ln(r),...Bi(r)];if(d.length>0)return s("invalid",d.join(" "),d);let p;try{({revision:p}=await n.save(t.revision,r))}catch(u){let{code:c="unknown",message:h}=M(u);if(c!=="conflict"||a>=zi)return s(c,h);let g;try{g=await n.fetch()}catch(H){let R=M(H);return s(R.code??"unknown",R.message)}let _=b(g)&&typeof g.revision=="number"?g.revision:0,x=b(g)&&b(g.document)?g.document:jt();_<t.revision?t.restart(x,_):t.rebase(x,_);for(let H of t.kept)i.set(`${H.list}:${H.key}`,H);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0,...o()};continue}return t.saved(r,p),{ok:!0,revision:t.revision,merged:e,...o()}}}var J;function Xt(){return J}function qn(t,n){let e=J;if(n<=0||t===void 0)return{...e===void 0?{}:{draft:e},mergedIntoEdits:!1,kept:[]};if(e===void 0||n<e.revision&&!e.dirty){let s=new $t(t,n);return J=s,{draft:s,mergedIntoEdits:!1,kept:[]}}if(n===e.revision)return{draft:e,mergedIntoEdits:!1,kept:[]};let i=e.dirty,o=n<e.revision?e.restart(t,n):e.rebase(t,n);return{draft:e,mergedIntoEdits:i&&o,kept:i?e.kept:[]}}function Fn(){return J??=new $t(jt(),0),J}function Zt(){return J?.dirty??!1}function Wn(){J=void 0}function qi(t){return t.list==="global"?t.name.trim()===""?`{{${t.key}}}`:t.name:`"${t.name.trim()===""?"an untitled action":t.name}"`}function _t(t){if(t.length===0)return"";let n=t.map(qi);return`${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`} also changed somewhere else. ${n.length===1?"Your version was kept.":"Your versions were kept."}`}function Yn(t){if(t.ok){let e=t.kept??[];if(t.alreadySaved===!0){let i=e.length>0?` ${_t(e)}`:"";return{kind:e.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.${i}`}}return e.length>0?{kind:"warn",text:`Saved. ${_t(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The HTTP actions kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the HTTP actions${n===""?".":`: ${n}`}`}}case"busy":return{kind:"warn",text:"Already saving. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the HTTP actions just now. Your edits are kept, so try again in a moment."};case"unknown_command":return{kind:"err",text:"Not saved. Update the integration to edit HTTP actions here."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}var Fi=/"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\],:]/g;function Gn(t,n=2){let e=t.trim();if(e!==""){try{JSON.parse(e)}catch{return}return Xn(e.match(Fi)??[],n)}}function Xn(t,n){let e=[],i=0,o=()=>e.push({kind:"ws",text:`
${" ".repeat(i*n)}`});for(let s=0;s<t.length;s+=1){let a=t[s],r=t[s+1];if(a.startsWith("{{"))e.push({kind:"var",text:a});else if(a==="{"||a==="["){let d=a==="{"?"}":"]";r===d?(e.push({kind:"punct",text:a+d}),s+=1):(e.push({kind:"punct",text:a}),i+=1,o())}else a==="}"||a==="]"?(i=Math.max(0,i-1),o(),e.push({kind:"punct",text:a})):a===","?(e.push({kind:"punct",text:a}),o()):a===":"?e.push({kind:"punct",text:": "}):a.startsWith('"')?e.push({kind:r===":"?"key":"str",text:a}):a==="true"||a==="false"||a==="null"?e.push({kind:"lit",text:a}):e.push({kind:"num",text:a})}return e}var Wi=/\{\{[A-Za-z0-9_]+\}\}/g,Zn=/\{\{[A-Za-z0-9_]+\}\}|"(?:[^"\\\n]|\\.)*"?|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\btrue\b|\bfalse\b|\bnull\b|[{}[\],:]/g;function Qn(t,n=2){let e=t.trim();if(e==="")return;let i=[],o="",s=0;for(let a of e.matchAll(Zn)){if(e.slice(s,a.index).trim()!=="")return;i.push(a[0]),o+=a[0].startsWith("{{")?"0":a[0],s=a.index+a[0].length}if(e.slice(s).trim()===""){try{JSON.parse(o)}catch{return}return Qt(Xn(i,n))}}function ti(t,n){let e=[],i=0,o=[...t.matchAll(n?Zn:Wi)];return o.forEach((s,a)=>{s.index>i&&e.push({kind:"ws",text:t.slice(i,s.index)});let r=s[0];i=s.index+r.length;let d;if(r.startsWith("{{"))d="var";else if(r.startsWith('"')){let p=o[a+1];d=p!==void 0&&p[0]===":"&&t.slice(i,p.index).trim()===""?"key":"str"}else r==="true"||r==="false"||r==="null"?d="lit":/^[{}[\],:]$/.test(r)?d="punct":d="num";e.push({kind:d,text:r})}),i<t.length&&e.push({kind:"ws",text:t.slice(i)}),e}function Qt(t){return t.map(n=>n.text).join("")}function St(t){return t<1024?`${t} ${t===1?"byte":"bytes"}`:t<1024*1024?`${(t/1024).toFixed(1)} KB`:`${(t/(1024*1024)).toFixed(2)} MB`}var oe="ha:sel",oi="ha:tab",ai="ha:rtab",si="ha:bmode",ri="ha:bwrap",te="ha:bcopied",ei="ha:qwrap",ee="ha:qcopied",ae="ha:show:",di="ha:auth:",li="ha:test:",Q="ha:look",se="network",Yi="#CCD8E6",Gi="Web requests Home Assistant sends when a watch runs one, from a tile, a menu, a complication or a control. A save reaches every watch the next time it checks.",pi="Fixed values any action can use as {{key}}, such as a server address or a token. Change one here and every action that uses it follows.",Xi="The watch records a voice clip of up to 30 seconds when the action runs and sends it as the body, as audio/mp4. Nothing to type here.",Zi="This method sends no body. Pick POST, PUT, PATCH or DELETE to send one.",Qi=`Empty means ${It} seconds. Home Assistant holds it between ${Ut} and ${Vt}.`,to="Only for a server you run whose HTTPS certificate is not publicly trusted.",ci="With no URL the watch shows the action as needing setup.",eo="Press Send to try this action. Home Assistant sends it. Nothing is saved.",no="Each {{key}} that is not a global is asked for on the watch when the action runs. Keys are letters, digits and underscores.",io=[["none","None"],["json","JSON"],["form","Form"],["text","Text"],["audio","Voice clip"]],oo={none:void 0,json:"application/json",form:"application/x-www-form-urlencoded",text:"text/plain",audio:"audio/mp4"},ao={none:"Request body",json:'{"key": "value"}',form:"key=value&other=123",text:"Plain text",audio:""},so=[["none","None"],["statusCode","Status code"],["bodyText","Body text"],["jsonField","JSON field"],["header","Header"],["regex","Regex"]];function ro(t,n,e){return`${t} ${t===1?n:e}`}function lo(t){if(at(t))return`${Y(t)} \xB7 no URL yet`;let n=t.url.trim().replace(/^https?:\/\//i,"");return`${Y(t)} \xB7 ${n}`}function ui(t){let n=t.trim().toUpperCase();switch(n){case"GET":return{text:"GET",tone:"get"};case"POST":return{text:"POST",tone:"post"};case"PUT":return{text:"PUT",tone:"put"};case"PATCH":return{text:"PATCH",tone:"patch"};case"DELETE":return{text:"DEL",tone:"del"};default:return{text:n===""?"?":n.slice(0,5),tone:"other"}}}function po(t){let n=ui(t);return l`<span class="ha-mtag m-${n.tone}" title=${t.trim().toUpperCase()}>${n.text}</span>`}function hi(t){let n=t.uiState.get(oe);if(n?.kind==="action"&&W(t.document,n.id)!==void 0||n?.kind==="globals")return n;let e=N(t.document)[0];return typeof e?.id=="string"?{kind:"action",id:e.id}:void 0}function pt(t,n){n===void 0?t.uiState.delete(oe):t.uiState.set(oe,n),t.uiState.delete(Q),t.requestUpdate()}var co=["headers","auth","body","prompts","reply","settings"],uo=["body","headers","paths"];function ho(t){let n=t.uiState.get(oi);return co.includes(n)?n:"headers"}function fi(t,n){t.uiState.set(oi,n),t.requestUpdate()}function fo(t){let n=t.uiState.get(ai);return uo.includes(n)?n:"body"}function mo(t,n){t.uiState.set(ai,n),t.requestUpdate()}function mi(t){return t.uiState.get(si)==="raw"?"raw":"pretty"}function bo(t){return t.uiState.get(ri)!==!1}function go(t,n){let e=n.body??n.snippet,i=Gn(e),o=i!==void 0&&mi(t)==="pretty";return{raw:e,isJson:i!==void 0,pieces:o?i:void 0,text:o?Qt(i):e}}function bi(t,n,e,i,o,s){return l`<div class="ha-tabs ${s}" role="tablist" aria-label=${t}
    @keydown=${a=>{if(a.key!=="ArrowRight"&&a.key!=="ArrowLeft"&&a.key!=="Home"&&a.key!=="End")return;let r=e.findIndex(u=>u.id===i),d=a.key==="Home"?0:a.key==="End"?e.length-1:(r+(a.key==="ArrowRight"?1:-1)+e.length)%e.length;a.preventDefault(),o(e[d].id),a.currentTarget.querySelectorAll("[role=tab]")[d]?.focus()}}>
    ${e.map(a=>l`<button type="button" role="tab" class="ha-tab ${a.id===i?"on":""}" id=${`${n}-${a.id}`}
      aria-selected=${a.id===i?"true":"false"} aria-controls=${`${n}-panel`} tabindex=${a.id===i?"0":"-1"}
      @click=${()=>o(a.id)}>${a.label}${a.extra??f}</button>`)}
  </div>`}var Ot=t=>t===0?f:l`<span class="ha-tab-n">${t}</span>`,ne=t=>t?l`<i class="ha-tab-dot" aria-label="set"></i>`:f;function C(t,n,e,i){return t.edit(o=>Hn(e(o),n,()=>t.newId()),i)}function Pt(t){let n=t.newId();return t.edit(e=>rn(e,an(n,sn(e)))),pt(t,{kind:"action",id:n}),n}function vo(t){let n=t.newId();return t.edit(e=>Pn(e,n,On(e))),pt(t,{kind:"globals"}),n}function xo(t,n){let e;t.edit(i=>{let o=dn(i,n,()=>t.newId());return e=o.id,o.document}),e!==void 0&&pt(t,{kind:"action",id:e})}function Et(t){return t.uiState.has(Q)?(t.uiState.delete(Q),t.requestUpdate(),!0):!1}function gi(t,n){return t.uiState.get(ae+n)===!0}function yo(t,n){gi(t,n)?t.uiState.delete(ae+n):t.uiState.set(ae+n,!0),t.requestUpdate()}function de(t,n,e,i,o,s=""){let a=gi(t,o);return l`<span class="ha-secret">
    <input type=${a?"text":"password"} class="mono" .value=${e} placeholder=${s} aria-label=${n}
      autocomplete="off" spellcheck="false" data-secret=${o}
      @input=${r=>i(r.target.value)} />
    <button type="button" class="ha-show" aria-pressed=${a?"true":"false"} aria-label=${`${a?"Hide":"Show"} ${n}`}
      @click=${()=>yo(t,o)}>${a?"Hide":"Show"}</button>
  </span>`}function ie(t,n,e,i,o,s=""){return l`<div class="field ha-secret-field"><span>${n}</span>${de(t,n,e,i,o,s)}</div>`}function vi(t,n,e,i={}){return l`<label class="ha-switch"><input type="checkbox" .checked=${n} ?disabled=${i.disabled===!0}
    @change=${o=>e(o.target.checked)} /><span>${t}</span></label>`}function le(t,n){let e=t.uiState.get(di+n.id);if(e!==void 0){let i=e.headerId===void 0?void 0:n.headers.find(s=>s.id===e.headerId);if(i===void 0)return{auth:e.auth.kind===e.kind?e.auth:V(e.kind)};if(e.kind==="apiKey")return{auth:{...V("apiKey"),headerName:i.name,apiKeyValue:i.value},headerId:i.id};let o=wt(i);return o!==void 0&&o.kind===e.kind?{auth:o,headerId:i.id}:{auth:V(e.kind),headerId:i.id}}return yn(n.headers)}function wo(t,n,e,i){let{headerId:o}=le(t,n),s=o;C(t,n.id,a=>{let r=wn(a,n.id,o,e);return s=r.headerId,r.document},i),t.uiState.set(di+n.id,{kind:e.kind,auth:e,...s===void 0?{}:{headerId:s}}),t.requestUpdate()}function Ho(t,n){let{auth:e}=le(t,n),i=(r,d)=>wo(t,n,{...e,...r},d),o=r=>`auth:${n.id}:${r}`,s=f;e.kind==="bearer"?s=ie(t,"Token",e.token,r=>i({token:r},o("token")),o("token"),"Paste the token"):e.kind==="basic"?s=l`${U("Username",e.username,r=>i({username:r},o("user")))}
      ${ie(t,"Password",e.password,r=>i({password:r},o("password")),o("password"))}`:e.kind==="apiKey"&&(s=l`${U("Header",e.headerName,r=>i({headerName:r},o("name")),{mono:!0,placeholder:"X-Api-Key"})}
      ${ie(t,"Key",e.apiKeyValue,r=>i({apiKeyValue:r},o("key")),o("key"),"Paste the key")}`);let a=e.kind==="none"?"Add sign-in if the server asks for it. It is written as one header.":e.kind==="basic"?"Sent as an Authorization header, the username and password encoded together.":e.kind==="bearer"?"Sent as Authorization: Bearer and the token.":"Sent as a header with the key as its value.";return l`<p class="ha-line">${a}</p>
    <div class="ha-form">
      ${Ct("Type",e.kind,xn,r=>i({kind:r}),{snapBack:!0})}
      ${s}
    </div>`}function ko(t,n,e,i){return t.icons.render(n,e,i)??l`<span class="ha-glyph-dot" style=${`background:${i}`}></span>`}function xi(t){return n=>{n.target!==n.currentTarget||n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),t())}}function To(t,n,e,i,o){let s=vt(n),a=()=>pt(t,{kind:"action",id:n.id}),r=at(n);return l`<div class="ha-item ${o?"on":""}" role="listitem" tabindex="0" data-action=${n.id}
    aria-current=${o?"true":"false"} aria-label=${s} title=${`${s} \xB7 ${lo(n)}`}
    @click=${d=>{d.target instanceof Element&&d.target.closest("button")||a()}}
    @keydown=${xi(a)}>
    ${po(Y(n))}
    <span class="ha-item-name">${s}</span>
    ${r?l`<span class="ha-need-mark" title=${ci}>needs setup</span>`:f}
    ${zt(n)?l`<span class="ha-mark">voice</span>`:f}
    <span class="ha-item-acts">
      <button type="button" class="icon" ?disabled=${t.busy||e===0} title="Move up" aria-label=${`Move ${s} up`}
        @click=${()=>t.edit(d=>Jt(d,n.id,e-1))}>${T("up")}</button>
      <button type="button" class="icon" ?disabled=${t.busy||e===i-1} title="Move down" aria-label=${`Move ${s} down`}
        @click=${()=>t.edit(d=>Jt(d,n.id,e+1))}>${T("down")}</button>
    </span>
  </div>`}function yi(t){let n=N(t.document).map(I),e=it(t.document).length,i=hi(t),o=i?.kind==="globals",s=()=>pt(t,{kind:"globals"});return l`<section class="card lc ha-list-card" aria-label="Actions" style="--c: var(--wa-lc-layers, #4a7fe8)">
    <div class="lc-head">
      <span class="swatch">${T("globe")}</span><span class="lc-title">Actions</span>
      <span class="lc-sub" title=${Gi}>${n.length}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri ha-add" aria-label="Add an action" ?disabled=${t.busy}
        title="A new action" @click=${()=>Pt(t)}>${T("plus")}<span>Add</span></button>
    </div>
    ${n.length===0?l`<div class="lc-note ha-list-note">No actions yet. Add one to send a request from the watch.</div>`:l`<div class="ha-items" role="list">${n.map((a,r)=>To(t,a,r,n.length,i?.kind==="action"&&i.id===a.id))}</div>`}
    <div class="ha-list-foot">
      <div class="ha-item ha-globals-item ${o?"on":""}" role="button" tabindex="0" aria-pressed=${o?"true":"false"}
        title=${pi} @click=${s} @keydown=${xi(s)}>
        <span class="ha-mtag ha-gtag" aria-hidden="true">{ }</span>
        <span class="ha-item-name">Globals</span>
        <span class="ha-count">${e}</span>
      </div>
    </div>
  </section>`}function Ao(t){let n=t.trim();if(n===""||n.startsWith("{"))return;let e=n.toLowerCase();return e.startsWith("http://")||e.startsWith("https://")?void 0:"Add http:// or https://. Without one the request will not send."}function $o(t,n){let e=n.id;return l`<div class="ha-look-pop" role="dialog" aria-label="Icon and color">
    <fieldset class="ha-set" ?disabled=${t.busy}>
      <div class="ha-stack">${Ve({icons:t.icons,symbols:t.symbols},n.icon??se,i=>t.edit(o=>cn(o,e,i===se?"":i),`a:${e}:icon`),`ha:icon:${e}`,void 0,"Icon",!1)}</div>
      ${Ue("Color",n.iconColor,i=>t.edit(o=>un(o,e,i),`a:${e}:color`),!0,null)}
    </fieldset>
    <div class="ha-pop-foot"><span class="ha-line">The icon and color the action wears on the watch.</span>
      <button type="button" class="pe-btn ha-sm" @click=${()=>Et(t)}>Done</button></div>
  </div>`}function _o(t,n){let e=n.id,i=n.iconColor??Yi,o=t.uiState.get(Q)===e;return l`<div class="ha-titlerow">
    <span class="ha-look">
      <button type="button" class="ha-look-btn" style=${`--c:${i}`} aria-haspopup="dialog" aria-expanded=${o?"true":"false"}
        title="Icon and color" aria-label="Icon and color"
        @click=${()=>{o?t.uiState.delete(Q):t.uiState.set(Q,e),t.requestUpdate()}}>
        <span class="ha-look-glyph">${ko(t,n.icon??se,16,i)}</span>
      </button>
      ${o?$o(t,n):f}
    </span>
    <input type="text" class="ha-name" .value=${n.name} placeholder="My action" aria-label="Name" ?disabled=${t.busy}
      @input=${s=>t.edit(a=>pn(a,e,s.target.value),`a:${e}:name`)} />
    <span class="ha-title-acts">
      <button type="button" class="pe-btn ha-sm" ?disabled=${t.busy} title="A copy with new ids, named Copy"
        @click=${()=>xo(t,e)}>${T("duplicate")}<span>Duplicate</span></button>
      <button type="button" class="pe-btn ha-sm pe-danger" ?disabled=${t.busy}
        title="Remove this action. Tiles and menu items that run it stop working."
        @click=${()=>t.edit(s=>ln(s,e))}>${T("delete")}<span>Remove</span></button>
    </span>
  </div>`}function So(t,n){let e=n.id,i=z(t,e),o=at(n),s=Y(n),a=ui(s),r=nt.includes(s),d=Ao(n.url);return l`<div class="ha-reqbar">
      <div class="ha-reqbox">
        <select class="ha-method m-${a.tone}" aria-label="Method" ?disabled=${t.busy} .value=${s}
          @change=${p=>{C(t,e,u=>hn(u,e,p.target.value)),t.requestUpdate()}}>
          ${r?f:l`<option value=${s} selected>${s}</option>`}
          ${nt.map(p=>l`<option value=${p} ?selected=${p===s}>${p}</option>`)}
        </select>
        <input type="text" class="ha-url mono" .value=${n.url} placeholder="https://example.com/api" aria-label="URL"
          spellcheck="false" autocomplete="off" ?disabled=${t.busy}
          @input=${p=>C(t,e,u=>fn(u,e,p.target.value),`a:${e}:url`)}
          @keydown=${p=>{p.key!=="Enter"||p.isComposing||(p.preventDefault(),ii(t,e))}} />
      </div>
      <button type="button" class="pe-btn pe-primary ha-send ${i.running?"busy":""}" ?disabled=${i.running||o}
        aria-busy=${i.running?"true":"false"} title=${o?"Add a URL first":"Send it now (Enter in the URL)"}
        @click=${()=>{ii(t,e)}}>${i.running?"Sending\u2026":"Send"}</button>
    </div>
    ${d===void 0&&!o?f:l`<div class="ha-barnote">
      ${d===void 0?f:l`<p class="ha-warn">${d}</p>`}
      ${o?l`<p class="ha-warn">${ci}</p>`:f}
    </div>`}`}function Oo(t,n,e){let i=n.id,o=e===void 0?void 0:n.headers.find(a=>a.id===e),s=n.headers.filter(a=>a.id!==e);return l`<div class="ha-table ha-htable" role="table" aria-label="Headers">
    <div class="ha-tr ha-th" role="row"><span role="columnheader">Key</span><span role="columnheader">Value</span><span></span></div>
    ${o===void 0?f:l`<div class="ha-tr ha-auth-row" role="row">
      <span class="ha-td ha-ro mono" role="cell">${o.name}</span>
      <span class="ha-td ha-ro" role="cell"><span class="ha-dots" aria-label="Hidden">••••••••</span></span>
      <span class="ha-td ha-end" role="cell"><button type="button" class="ha-from-auth" title="Written by the Auth tab. Edit it there."
        @click=${()=>fi(t,"auth")}>Auth</button></span>
    </div>`}
    ${s.map(a=>l`<div class="ha-tr" role="row">
      <span class="ha-td" role="cell"><input type="text" class="mono" .value=${a.name} placeholder="Name" aria-label="Header name" spellcheck="false"
        @input=${r=>C(t,i,d=>yt(d,i,a.id,{name:r.target.value}),`h:${a.id}:name`)} /></span>
      <span class="ha-td" role="cell">${de(t,`${a.name.trim()||"Header"} value`,a.value,r=>C(t,i,d=>yt(d,i,a.id,{value:r}),`h:${a.id}:value`),`header:${a.id}`,"Value")}</span>
      <span class="ha-td ha-end" role="cell"><button type="button" class="icon ha-remove" title="Remove this header" aria-label=${`Remove ${a.name.trim()||"header"}`}
        @click=${()=>C(t,i,r=>Ft(r,i,a.id))}>${T("delete")}</button></span>
    </div>`)}
    <div class="ha-tr ha-addrow" role="row"><button type="button" class="ha-add-row" @click=${()=>C(t,i,a=>vn(a,i,t.newId()))}>${T("plus")}<span>Add header</span></button></div>
  </div>
  <p class="ha-line">Header values stay hidden until shown.</p>`}function Po(t,n){if(!ot(n))return l`<p class="ha-line">${Zi}</p>`;let e=n.bodyContentType,i=oo[e];return l`<div class="ha-body-head">
      <label class="ha-inline"><span>Type</span>
        <select .value=${e} @change=${o=>{C(t,n.id,s=>mn(s,n.id,o.target.value)),t.requestUpdate()}}>
          ${io.map(([o,s])=>l`<option value=${o} ?selected=${o===e}>${s}</option>`)}
        </select></label>
      ${i===void 0?f:l`<span class="ha-line">Sends Content-Type: ${i}, unless a header sets one.</span>`}
    </div>
    ${e==="audio"?l`<p class="ha-line ha-audio">${Xi}</p>`:Eo(t,n,e)}`}function Eo(t,n,e){let i=n.body??"",o=e==="json",s=o?Qn(i):void 0,a=t.uiState.get(ei)!==!1,r=t.uiState.get(ee)===!0,d=(c,h)=>{t.uiState.set(c,h),t.requestUpdate()},p=async()=>{try{await navigator.clipboard.writeText(i),d(ee,!0),setTimeout(()=>d(ee,!1),1500)}catch{}},u=o&&i.trim()!==""&&s===void 0;return l`<div class="ha-bbar ha-qbar" role="toolbar" aria-label="Body options">
      ${o?l`<button type="button" class="ha-bopt" title=${u?"The body is not JSON":"Indent the JSON"}
        ?disabled=${t.busy||s===void 0||s===i}
        @click=${()=>{s!==void 0&&C(t,n.id,c=>qt(c,n.id,s))}}>Format</button>`:f}
      <button type="button" class="ha-bopt ${a?"on":""}" aria-pressed=${a?"true":"false"} title="Wrap long lines" @click=${()=>d(ei,!a)}>Wrap</button>
      <button type="button" class="ha-bopt" title="Copy the body" ?disabled=${i===""} @click=${()=>{p()}}>${r?"Copied":"Copy"}</button>
      <span class="ha-bmeta">${u?l`<span class="ha-bad">Not JSON</span> · `:f}${St(new TextEncoder().encode(i).length)}</span>
    </div>
    <div class="ha-code ${a?"":"nowrap"}">
      <pre class="mono" aria-hidden="true">${ti(i,o).map(c=>c.kind==="ws"||c.kind==="punct"?c.text:l`<span class=${`j-${c.kind}`}>${c.text}</span>`)}${`
`}</pre>
      <textarea class="mono ha-body-text" spellcheck="false" autocapitalize="off" autocomplete="off" wrap=${a?"soft":"off"} aria-label="Body" .value=${i} placeholder=${ao[e]}
        @scroll=${c=>{let h=c.target,g=h.previousElementSibling;g!==null&&(g.scrollTop=h.scrollTop,g.scrollLeft=h.scrollLeft)}}
        @input=${c=>C(t,n.id,h=>qt(h,n.id,c.target.value),`a:${n.id}:body`)}></textarea>
    </div>`}function ni(t,n,e,i){let o=(a,r)=>t.edit(d=>kn(d,n.id,e.id,a),r),s=Bt(e);return l`<div class="ha-var ${i?"unused":""}" data-key=${e.key}>
    <div class="ha-var-head"><code>{{${e.key}}}</code>
      ${i?l`<span class="ha-mark">unused, left out when saved</span>
        <button type="button" class="icon ha-remove" title="Remove" aria-label=${`Remove {{${e.key}}}`}
          @click=${()=>t.edit(a=>Tn(a,n.id,e.id))}>${T("delete")}</button>`:f}
    </div>
    ${i?f:l`<div class="ha-var-grid">
      ${U("Prompt",e.prompt,a=>o({prompt:a},`v:${e.id}:prompt`),{placeholder:"Message"})}
      ${Ie("Kind",e.kind,[["text","Text"],["number","Number"]],a=>o({kind:a}))}
      <label class="field ha-quick"><span>Quick values</span>
        <textarea rows=${Math.max(2,Math.min(6,e.presetValues.length+1))} .value=${e.presetValues.join(`
`)} placeholder="One per line"
          @input=${a=>o({presetValues:a.target.value.split(`
`)},`v:${e.id}:presets`)}></textarea></label>
      <div class="ha-only">${vi("Only these",e.presetsOnly,a=>o({presetsOnly:a}),{disabled:s.length===0&&!e.presetsOnly})}
        <span class="ha-line">${s.length===0?"Add a quick value to offer only these.":e.presetsOnly?"The watch shows only the quick values, with no typing.":"The watch offers the quick values and lets you type too."}</span></div>
    </div>`}
  </div>`}function Do(t,n){let e=j(t.document),i=G(n,e),o=An(n,e),s=i.asked.filter(a=>!n.variables.some(r=>r.key===a));return l`<p class="ha-line" title=${In}>${no}</p>
    ${i.global.length===0?f:l`<p class="ha-from-globals">${i.global.map(a=>l`<code>{{${a}}}</code>`)} <span>from Globals</span></p>`}
    ${i.asked.length===0&&o.length===0?l`<p class="ha-quiet">Nothing is asked for. The action runs at once.</p>`:f}
    ${st(n,e).map(a=>ni(t,n,a,!1))}
    ${s.map(a=>l`<div class="ha-var" data-key=${a}><div class="ha-var-head"><code>{{${a}}}</code><span class="ha-need-mark">not set up</span>
      <span class="ha-line">Sent as typed until it is set up.</span>
      <button type="button" class="pe-btn ha-sm" @click=${()=>C(t,n.id,r=>r)}>Ask for it on the watch</button></div></div>`)}
    ${o.map(a=>ni(t,n,a,!0))}`}function Ro(t,n){let e=n.id,i=n.reply,o=i?.source??"none",s=i===void 0?void 0:Wt[i.source],a=s==="jsonPath"?U("JSON path",i?.jsonPath??"",d=>t.edit(p=>B(p,e,"jsonPath",d),`r:${e}:path`),{mono:!0,placeholder:"result.price"}):s==="headerName"?U("Header",i?.headerName??"",d=>t.edit(p=>B(p,e,"headerName",d),`r:${e}:header`),{mono:!0,placeholder:"X-RateLimit-Remaining"}):s==="pattern"?U("Pattern",i?.pattern??"",d=>t.edit(p=>B(p,e,"pattern",d),`r:${e}:pattern`),{mono:!0,placeholder:"temperature=([0-9.]+)"}):f;return l`<p class="ha-line">${i===void 0?"Pick what to take from the reply to show on the watch, as a tile's value or in the banner after it runs.":s==="jsonPath"?"Keys joined by dots, a number for an item of a list: data.0.temp. A send offers the paths it finds.":s==="pattern"?"The first group in brackets, else the whole match.":"Shown on the watch, as a tile's value or in the banner after it runs."}</p>
    <div class="ha-form">
      ${Ct("Read",o,so,d=>t.edit(p=>Ht(p,e,d==="none"?void 0:d)),{snapBack:!0})}
      ${a}
      ${i===void 0?f:U("Unit",i.unit??"",d=>t.edit(p=>B(p,e,"unit",d),`r:${e}:unit`),{placeholder:"\xB0, $, kWh"})}
    </div>`}function Co(t,n){let e=n.id;return l`<div class="ha-form ha-settings">
      ${Me("Timeout",n.timeout,i=>t.edit(o=>bn(o,e,i),`a:${e}:timeout`),{optional:!0,min:Ut,max:Vt,step:1,unit:"s",placeholder:String(It),def:null})}
      <p class="ha-line ha-under">${Qi}</p>
    </div>
    <div class="ha-setting">
      ${vi("Accept a self-signed certificate",n.allowsUntrustedCertificate,i=>t.edit(o=>gn(o,e,i)))}
      <p class="ha-line">${to}</p>
    </div>
    ${n.presentsClientCertificate?l`<p class="ha-warn ha-cert">This action asks for a client certificate. ${At}</p>`:f}`}function Lo(t){return ot(t)?t.bodyContentType==="audio"||(t.body??"").trim()!=="":!1}function No(t,n){let{headerId:e,auth:i}=le(t,n),o=ho(t),s=st(n,j(t.document)).length,a=[{id:"headers",label:"Headers",extra:Ot(n.headers.length)},{id:"auth",label:"Auth",extra:ne(i.kind!=="none")},{id:"body",label:"Body",extra:ne(Lo(n))},{id:"prompts",label:"Prompts",extra:Ot(s)},{id:"reply",label:"Reply value",extra:ne(n.reply!==void 0)},{id:"settings",label:"Settings"}],r=o==="headers"?Oo(t,n,e):o==="auth"?Ho(t,n):o==="body"?Po(t,n):o==="prompts"?Do(t,n):o==="reply"?Ro(t,n):Co(t,n);return l`<div class="ha-req">
    ${bi("Request","ha-tab",a,o,d=>fi(t,d),"ha-req-tabs")}
    <div class="ha-tabbody tab-${o}" role="tabpanel" id="ha-tab-panel" aria-labelledby=${`ha-tab-${o}`}>
      <fieldset class="ha-set" ?disabled=${t.busy}>${r}</fieldset>
    </div>
  </div>`}function z(t,n){return t.uiState.get(li+n)??{values:{},running:!1,run:0}}function re(t,n,e){t.uiState.set(li+n,e),t.requestUpdate()}function Mo(t,n,e){let i={};for(let o of st(t,n)){let s=e[o.key];i[o.key]=s!==void 0?s:o.presetValues[0]??""}return i}async function ii(t,n){let e=W(t.document,n);if(e===void 0)return;let i=I(e);if(at(i))return;let o=z(t,n);if(o.running)return;let s=o.run+1,a=Mo(i,j(t.document),o.values);re(t,n,{values:o.values,running:!0,run:s});let r=it(t.document),d;try{let p=await t.test(e,r,a);d={values:z(t,n).values,running:!1,reply:p,run:s}}catch(p){d={values:z(t,n).values,running:!1,error:Io(p),run:s}}z(t,n).run===s&&re(t,n,d)}function Io(t){let n=t,e=typeof n?.code=="string"?n.code:typeof n?.error?.code=="string"?n.error.code:void 0,i=typeof n?.message=="string"?n.message:typeof n?.error?.message=="string"?n.error.message:"";return e==="unknown_command"?"This version of the integration cannot test an action. Update it to test here.":e==="invalid"?`Home Assistant could not build the request${i===""?".":`: ${i}`}`:i===""?"No answer from Home Assistant.":i}function Uo(t,n,e,i){let o=Bt(e),s=i.values[e.key]??o[0]??"",a=p=>re(t,n.id,{...z(t,n.id),values:{...z(t,n.id).values,[e.key]:p}}),r=e.prompt.trim()===""?e.key:e.prompt.trim();if(e.presetsOnly&&o.length>0)return l`<label class="ha-tv"><span>${r}</span>
      <select .value=${s} @change=${p=>a(p.target.value)}>
        ${o.map(p=>l`<option value=${p} ?selected=${p===s}>${p}</option>`)}
      </select></label>`;let d=`ha-q-${e.id}`;return l`<label class="ha-tv"><span>${r}</span>
    <input type="text" inputmode=${e.kind==="number"?"decimal":f} .value=${s} list=${o.length===0?f:d}
      placeholder=${e.key} @input=${p=>a(p.target.value)} />
    ${o.length===0?f:l`<datalist id=${d}>${o.map(p=>l`<option value=${p}></option>`)}</datalist>`}</label>`}function Vo(t){return t.status===null?"err":t.status>=200&&t.status<300?"ok":"warn"}function jo(t,n){if(n.body_binary===!0)return l`<p class="ha-quiet">The body is not text (${St(n.body_size??0)}).</p>`;let e=go(t,n);if(e.raw==="")return l`<p class="ha-quiet">No body.</p>`;let i=e.isJson?mi(t):"raw",o=bo(t),s=t.uiState.get(te)===!0,a=(p,u)=>{t.uiState.set(p,u),t.requestUpdate()},r=async()=>{try{await navigator.clipboard.writeText(e.text),a(te,!0),setTimeout(()=>a(te,!1),1500)}catch{}},d=(p,u)=>l`<button type="button" class="ha-bopt ${i===p?"on":""}" aria-pressed=${i===p?"true":"false"}
    ?disabled=${!e.isJson} title=${e.isJson?p==="pretty"?"Indented and colored":"As the server sent it":"The body is not JSON"}
    @click=${()=>a(si,p)}>${u}</button>`;return l`<div class="ha-bbar" role="toolbar" aria-label="Body options">
      <span class="ha-bseg">${d("pretty","Pretty")}${d("raw","Raw")}</span>
      <button type="button" class="ha-bopt ${o?"on":""}" aria-pressed=${o?"true":"false"} title="Wrap long lines" @click=${()=>a(ri,!o)}>Wrap</button>
      <button type="button" class="ha-bopt" title="Copy the body as shown" @click=${()=>{r()}}>${s?"Copied":"Copy"}</button>
      <span class="ha-bmeta">${e.isJson?"JSON":"Text"}${n.body_size===void 0?f:l` · ${St(n.body_size)}`}${n.body===void 0?l` · <span title="Update the integration to see the whole body.">first line only</span>`:f}${n.body_cut===!0?" \xB7 cut at the size limit":f}</span>
    </div>
    <pre class="ha-snippet mono ${o?"":"nowrap"}">${e.pieces===void 0?e.text:e.pieces.map(p=>p.kind==="ws"||p.kind==="punct"?p.text:l`<span class=${`j-${p.kind}`}>${p.text}</span>`)}</pre>`}function Ko(t,n,e){let i=fo(t),o=Object.entries(e.headers??{}),s=[{id:"body",label:"Body"},{id:"headers",label:"Headers",extra:Ot(o.length)},{id:"paths",label:"Paths",extra:Ot(e.paths.length)}],a;return i==="body"?a=jo(t,e):i==="headers"?a=o.length===0?l`<p class="ha-quiet">No headers.</p>`:l`<div class="ha-rlist" role="list" aria-label="Reply headers">
      ${o.map(([r,d])=>{let p=n.reply?.source==="header"&&n.reply.headerName===r;return l`<div class="ha-rrow ${p?"on":""}" role="listitem"><code>${r}</code><span class="mono ha-rval">${d}</span>
          <button type="button" class="ha-use" title=${`Read the ${r} header`} ?disabled=${t.busy}
            @click=${()=>t.edit(u=>Sn(u,n.id,r))}>${p?"Reply value":"Use"}</button></div>`})}</div>`:a=e.paths.length===0?l`<p class="ha-quiet">No JSON fields found.</p>`:l`<div class="ha-rlist" role="list" aria-label="JSON fields found">
      ${e.paths.map(r=>{let d=n.reply?.source==="jsonField"&&n.reply.jsonPath===r.path;return l`<button type="button" role="listitem" class="ha-rrow ha-path ${d?"on":""}" title=${`${r.path} is ${r.value}. Read this field.`} ?disabled=${t.busy}
          @click=${()=>t.edit(p=>_n(p,n.id,r.path))}><code>${r.path}</code><span class="mono ha-rval">${r.value}</span><span class="ha-use-word">${d?"Reply value":"Use"}</span></button>`})}</div>`,l`${bi("Response","ha-rtab",s,i,r=>mo(t,r),"ha-resp-tabs")}
    <div class="ha-resp-body" role="tabpanel" id="ha-rtab-panel" aria-labelledby=${`ha-rtab-${i}`}>${a}</div>`}function zo(t,n){let e=z(t,n.id),i=st(n,j(t.document)),o=e.running?void 0:e.reply,s=o===void 0?void 0:Vo(o);return l`<section class="ha-resp" aria-label="Response">
    <div class="ha-resp-head" role="status">
      <span class="ha-cap">Response</span>
      ${o===void 0?f:l`
        <span class="ha-status ${s}">${o.status===null?"No answer":`HTTP ${o.status}`}</span>
        <span class="ha-ms">${o.elapsed_ms} ms</span>
        ${n.reply===void 0?f:l`<span class="ha-val"><b>Value</b>${o.value===null?l`<span class="ha-muted">Not found</span>`:l`<code>${o.value}</code>`}</span>`}`}
    </div>
    ${i.length===0?f:l`<div class="ha-testvals" role="group" aria-label="Test values"><span class="ha-cap2">Test values</span>
      ${i.map(a=>Uo(t,n,a,e))}</div>`}
    ${e.running?l`<p class="ha-quiet ha-pad">Sending…</p>`:e.error!==void 0?l`<p class="ha-test-err ha-pad" role="status">${e.error}</p>`:o===void 0?l`<p class="ha-quiet ha-pad">${eo}${zt(n)?" A test sends no voice clip.":""}</p>`:l`${o.error?l`<p class="ha-test-err ha-pad">${o.error}</p>`:f}${Ko(t,n,o)}`}
  </section>`}function Bo(t,n){return l`<div class="ha-main-in" data-action=${n.id}>
    ${_o(t,n)}
    ${So(t,n)}
    ${No(t,n)}
    ${zo(t,n)}
  </div>`}function Jo(t){let n=it(t.document).map(Kt),e=new Map;for(let i of n)e.set(i.key.trim(),(e.get(i.key.trim())??0)+1);return l`<div class="ha-main-in ha-globals">
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
        ${n.map(i=>{let o=i.key.trim(),s=Cn(t.document,o);return l`<div class="ha-tr" role="row" data-global=${i.id}>
            <span class="ha-td" role="cell"><input type="text" class="mono" .value=${i.key} placeholder="haurl"
              aria-label="Key" spellcheck="false" @input=${a=>t.edit(r=>En(r,i.id,a.target.value),`g:${i.id}:key`)} /></span>
            <span class="ha-td" role="cell">${de(t,`${o===""?"Global":o} value`,i.value,a=>t.edit(r=>Dn(r,i.id,a),`g:${i.id}:value`),`global:${i.id}`,"https://ha.local:8123")}</span>
            <span class="ha-td ha-users" role="cell" title=${s.length===0?"No action uses it yet.":`Used by ${s.join(", ")}.`}>${s.length===0?l`<span class="ha-muted">Not used yet</span>`:ro(s.length,"action","actions")}</span>
            <span class="ha-td ha-end" role="cell"><button type="button" class="icon ha-remove" aria-label=${`Remove ${o===""?"this global":`{{${o}}}`}`}
              title=${s.length===0?"Remove this global":"Remove this global. The actions that use it send the {{key}} as typed."}
              @click=${()=>t.edit(a=>Rn(a,i.id))}>${T("delete")}</button></span>
            ${o===""?l`<p class="ha-warn ha-rowwarn">A global needs a key before it can be saved.</p>`:(e.get(o)??0)>1?l`<p class="ha-warn ha-rowwarn">Another global has this key. Each key must be its own.</p>`:f}
          </div>`})}
        <div class="ha-tr ha-addrow" role="row"><button type="button" class="ha-add-row ha-add-global" @click=${()=>vo(t)}>${T("plus")}<span>Add global</span></button></div>
      </div>
      </fieldset>
      <p class="ha-line">Type {{key}} in a URL, header or body. It is filled in as typed, before the values asked for on the watch. Values stay hidden until shown.</p>
    </div>
  </div>`}function wi(t){let n=hi(t);return n?.kind==="globals"?Jo(t):n?.kind==="action"?Bo(t,I(W(t.document,n.id))):l`<div class="ha-empty-main">
    <b>${kt}</b>
    <span>An HTTP action is a web request a watch asks Home Assistant to send. Add one to start, or a global for a value several actions share.</span>
    <button type="button" class="pe-btn pe-primary" ?disabled=${t.busy} @click=${()=>Pt(t)}>${T("plus")}<span>${Tt}</span></button>
  </div>`}var Hi=ft`
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
`;qe({dirty:Zt,drop:Wn});typeof window<"u"&&window.addEventListener("beforeunload",t=>{Zt()&&(t.preventDefault(),t.returnValue="")});var qo=15e3,_i=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),pe=_i?"\u2318":"Ctrl+",ct={min:200,max:520,middleMin:520},ce={left:280,right:0},ue="wrist-assistant-panel.http-actions.columns.v1",Fo=8,ki=760;function Wo(t,n){let e=De(n,ct);return t<=0?e:Math.max(ct.min,Math.min(e,t-ct.middleMin))}function Ti(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function Ai(t){let n=t?Date.parse(t):NaN;return Number.isNaN(n)?"":ye(Math.max(0,(Date.now()-n)/1e3))}function Yo(t){return t instanceof HTMLElement?Ke(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function Go(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function he(t,n){let e=[],i=[];if(t===void 0||t.revision<=0)return{collected:e,waiting:i};for(let o of n)((t.delivered?.[o.owner_watch_id]??0)>=t.revision?e:i).push(Ee(o,n));return{collected:e,waiting:i}}function Xo(t,n){if(t.updated_by==="panel")return"saved here";let e=n.find(i=>i.owner_watch_id===t.updated_by);return e===void 0?"handed over by a phone":`handed over by ${e.paired_iphone_name??e.device_name??"a phone"}`}function Zo(t){return t.some(n=>!n.is_orphan&&(_e(n)==="iphone"||(n.paired_iphone_name??"")!==""))}var A=class extends be{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.unsupported=!1;this.loading=!1;this.topMenuOpen=!1;this.columns={...ce};this.hostWidth=0;this.ownListAsked=!1;this.topHeight=0;this.symbols=new Le(()=>this.requestUpdate());this.uiState=new Map;this.reloadPending=!1;this.loadSeq=0;this.askedOnce=!1;this.onReconnect=()=>{this.isConnected&&this.load(!0)};this.onKeyDown=e=>{if(e.defaultPrevented)return;let i=e.composedPath();if(!i.includes(this)&&!Go()||this.renderRoot.querySelector("dialog[open]"))return;let o=e.metaKey||e.ctrlKey,s=e.key.toLowerCase();if(o&&!e.altKey&&s==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&Et(this.lookHost())){e.preventDefault();return}if(!Yo(i[0])){if(o&&!e.altKey&&s==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}e.ctrlKey&&!e.metaKey&&!e.altKey&&s==="y"&&(e.preventDefault(),this.redo())}};this.onWindowPointerDown=e=>{let i=e.composedPath(),o=s=>i.some(a=>a instanceof HTMLElement&&a.classList.contains(s));this.topMenuOpen&&!o("pe-top-menu")&&(this.topMenuOpen=!1),o("ha-look")||Et(this.lookHost())};this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get allOwners(){return this.owners.length>0?this.owners:this.ownList??[]}get watches(){return Pe(this.allOwners)}get draft(){if(!(this.record===void 0||this.unsupported))return Xt()}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Re(ue,ce,ct),this.watchSize(),this.listenForReconnect(),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.stopPolling(),this.loadSeq++}willUpdate(e){this.hass&&(e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,ge(this.hass).then(i=>{this.ownList=i.owners},()=>{this.ownList=[]})),this.askedOnce||(this.askedOnce=!0,this.load())),this.followSave()}updated(){this.observeTop()}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let i of e){if(i.target!==this){this.measureTop(i.target);continue}let o=i.contentRect;Math.abs(o.width-this.hostWidth)>=1&&(this.hostWidth=o.width)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&e.observe(i))}measureTop(e){let i=e.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=Xt()?.saveDone;if(e===void 0||e===this.followedSave)return;this.followedSave=e;let i=()=>this.saveEnded();e.then(i,i)}saveEnded(){this.requestUpdate(),this.isConnected&&(this.reloadPending=!1,this.load(!0))}async load(e=!1){let i=this.hass;if(!i)return;if(e&&this.saving){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),e||(this.loading=this.record===void 0,this.loadError=void 0);try{let s=await Dt(i);if(o!==this.loadSeq)return;if(this.saving){this.reloadPending=!0;return}this.unsupported=!1,this.show(s),this.loadError=void 0}catch(s){if(o!==this.loadSeq)return;Un(s)?(this.unsupported=!0,this.loadError=void 0):(!e||this.record===void 0)&&(this.loadError=M(s).message)}this.loading=!1,this.unsupported||this.pollIfWaiting()}flushPending(){!this.reloadPending||this.saving||(this.reloadPending=!1,this.load(!0))}show(e){this.record=e;let i=e.revision>0?Qe(e.document):void 0,o=qn(i,e.revision);o.kept.length>0?this.note={kind:"warn",text:_t(o.kept)}:o.mergedIntoEdits&&(this.note={kind:"warn",text:"The HTTP actions changed somewhere else. Your edits are kept."}),this.requestUpdate()}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||he(this.record,this.watches).waiting.length===0)&&(this.pollTimer=window.setTimeout(()=>{this.pollTimer=void 0,this.load(!0)},qo))}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,i){let o=this.draft;if(!o||this.saving)return!1;let s=o.apply(e(o.document),i);return this.requestUpdate(),s}memoIcons(){let e=this.icons??je,i=this.iconMemo;if(i!==void 0&&i.provider===e&&i.tick===this.iconsTick)return i.icons;let o=ze(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:o},o}viewHost(){let e=this.draft,i=this.hass;if(e===void 0||i===void 0)return;let o=this;return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,get document(){return e.document},get busy(){return o.saving},edit:(s,a)=>this.draft===e&&this.edit(s,a),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate(),test:(s,a,r)=>xe(i,s,a,r),newId:rt}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}startLibrary(){if(this.record===void 0||this.unsupported)return;Fn();let e=this.viewHost();e!==void 0&&Pt(e),this.requestUpdate()}async save(){let e=this.hass,i=this.draft;if(!e||!i||this.saving||!i.dirty)return;this.note=void 0,i.apply($n(i.document,i.base));let o=Jn(i,{save:(a,r)=>ve(e,a,r).catch(d=>{throw $i(d)}),fetch:async()=>{let a=await Dt(e).catch(r=>{throw $i(r)});return a.document===void 0?{revision:a.revision}:{revision:a.revision,document:a.document}}});this.followedSave=i.saveDone,this.requestUpdate();let s=await o.catch(a=>{let{code:r,message:d}=M(a);return{ok:!1,revision:i.revision,merged:!1,code:r??"unknown",message:d}});this.saveEnded(),this.note=Yn(s),this.flushPending()}lookHost(){return{uiState:this.uiState,requestUpdate:()=>this.requestUpdate()}}render(){let e=this.draft;return l`
      <div class="pe-top">
        ${this.renderTopBar(e)}
        ${this.note?l`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:f}
      </div>
      ${this.renderBody()}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=ki}renderTopBar(e){let i=e!==void 0,o=i&&this.dirty;return l`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="HTTP actions">
      <span class="ha-title"><b>HTTP actions</b><span class="ha-shared">${Yt}</span></span>
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
        <button class="cv-act icon undo" ?disabled=${!e.canUndo} title=${`Undo (${pe}Z)`} aria-label="Undo" @click=${()=>this.undo()}>${T("undo")}</button>
        <button class="cv-act icon undo" ?disabled=${!e.canRedo} title=${_i?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo" @click=${()=>this.redo()}>${T("redo")}</button>
        <button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${pe}S). A save reaches every watch the next time it checks.`:`Nothing to save (${pe}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        <span class="tb-saved" title=${o?"Unsaved changes":""}>${this.savedText()}</span>`:f}
      <button class="help" title="Help: HTTP actions" aria-label="Help"
        @click=${()=>window.open(Je,"_blank","noopener")}>?</button>
    </div>`}savedText(){let e=this.record;if(e===void 0||e.revision<=0)return"";let i=Ai(e.updated_at);return i?`Saved ${i}`:"Saved"}renderSyncPill(){let e=this.record;if(e===void 0||e.revision<=0||this.unsupported)return f;let{collected:i,waiting:o}=he(e,this.watches);if(i.length===0&&o.length===0)return f;let s=[o.length>0?`Waiting: ${o.join(", ")}.`:"",i.length>0?`Collected: ${i.join(", ")}.`:""].filter(a=>a!=="").join(" ");return l`<span class="tb-sync ${o.length===0?"ok":"warn"}" title=${s}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.length===0?Oe:Se}</span>
    </span>`}listWidth(){return this.hostWidth>0&&this.hostWidth<=ki?this.columns.left:Wo(this.hostWidth-Fo,this.columns.left)}renderGutter(){return l`<div class="gutter left" role="separator" aria-orientation="vertical" aria-label="Resize the list"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${e=>{Ce(e,{side:"left",base:this.listWidth(),limits:ct,onWidth:i=>{this.columns={...this.columns,left:i}},onEnd:()=>Rt(ue,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,left:ce.left},Rt(ue,this.columns)}}></div>`}renderBody(){if(this.unsupported)return l`<div class="ha-calm"><div class="pe-empty"><b>${Mn}</b></div></div>`;if(this.loadError!==void 0)return l`<div class="ha-calm"><div class="pe-empty">
        <span>Could not read the HTTP actions: ${this.loadError}</span>
        <button class="pe-btn" @click=${()=>{this.load()}}>Try again</button>
      </div></div>`;let e=this.record;if(this.loading||e===void 0)return l`<div class="ha-calm"><div class="pe-empty">Loading…</div></div>`;let i=this.draft,o=this.viewHost();if(i===void 0||o===void 0)return l`<div class="ha-calm"><div class="pe-empty ha-empty"><b>${kt}</b>
        <span>An HTTP action is a web request a watch asks Home Assistant to send. ${Yt}</span>
        <span class="ha-start"><button class="pe-btn pe-primary" @click=${()=>this.startLibrary()}>${T("plus")}<span>${Tt}</span></button></span>
        ${Zo(this.allOwners)?l`<span class="pe-muted">${Nn}</span>`:f}
      </div></div>`;let s=N(i.document).filter(a=>a.presentsClientCertificate===!0).length;return l`${s===0?f:l`<p class="ha-cert-line">${s===1?"An action asks":`${s} actions ask`} for a client certificate. ${At}</p>`}
    <div class="layout pe-layout ha-two ${this.stacked?"cols-1":""}" style=${`--wa-left:${this.listWidth()}px`}>
      <div class="column left">
        ${yi(o)}
      </div>
      ${this.renderGutter()}
      <div class="column card ha-main">
        ${wi(o)}
      </div>
    </div>
    ${this.renderFoot(e,i)}`}renderFoot(e,i){let o=gt(i.document),s=Ai(e.updated_at),a=e.revision<=0?"Not saved yet. The first save makes the library.":`Revision ${e.revision} \xB7 ${Xo(e,this.allOwners)}${s?` ${s}`:""}`,{waiting:r}=he(e,this.watches);return l`<div class="ha-foot" role="status">
      <i class="ha-foot-dot ${e.revision<=0?"":r.length===0?"ok":"warn"}" aria-hidden="true"></i>
      <span>${a}</span>
      ${r.length===0?f:l`<span class="pe-muted">Waiting for ${r.join(", ")}.</span>`}
      <span class="spacer"></span>
      <span class="pe-muted ${o.near?"ha-near":""}">${Ti(o.size)} of ${Ti(o.limit)}</span>
    </div>`}static{this.styles=[Ne,we,He,ke,Te,Ae,$e,ft`
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
  `,Hi]}};O([q({attribute:!1})],A.prototype,"hass",2),O([q({attribute:!1})],A.prototype,"owners",2),O([q({type:Boolean,reflect:!0})],A.prototype,"narrow",2),O([q({attribute:!1})],A.prototype,"icons",2),O([q({attribute:!1})],A.prototype,"iconsTick",2),O([L()],A.prototype,"record",2),O([L()],A.prototype,"unsupported",2),O([L()],A.prototype,"loading",2),O([L()],A.prototype,"loadError",2),O([L()],A.prototype,"note",2),O([L()],A.prototype,"ownList",2),O([L()],A.prototype,"topMenuOpen",2),O([L()],A.prototype,"columns",2),O([L()],A.prototype,"hostWidth",2);function $i(t){let{code:n,message:e}=M(t);return Object.assign(new Error(e),n===void 0?{}:{code:n})}customElements.get("wa-http-actions-editor")||customElements.define("wa-http-actions-editor",A);export{ue as HA_COLUMNS_KEY,A as WaHttpActionsEditor,Wo as fitHttpListWidth,Zo as homeHasPhone,he as httpActionsDelivery,Xo as httpActionsSavedBy};
