import{a as je,b as T,d as Fn,e as Hn,f as Q,g as x,i as se}from"./chunk-6ZDBXU6B.js";var gd=e=>(t,n)=>{n!==void 0?n.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};var ir={attribute:!0,type:String,converter:Fn,reflect:!1,hasChanged:Hn},rr=(e=ir,t,n)=>{let{kind:o,metadata:i}=n,r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),o==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(n.name,e),o==="accessor"){let{name:a}=n;return{set(l){let s=t.get.call(this);t.set.call(this,l),this.requestUpdate(a,s,e,!0,l)},init(l){return l!==void 0&&this.C(a,void 0,e,l),l}}}if(o==="setter"){let{name:a}=n;return function(l){let s=this[a];t.call(this,l),this.requestUpdate(a,s,e,!0,l)}}throw Error("Unsupported decorator location: "+o)};function Ln(e){return(t,n)=>typeof n=="object"?rr(e,t,n):((o,i,r)=>{let a=i.hasOwnProperty(r);return i.constructor.createProperty(r,o),a?Object.getOwnPropertyDescriptor(i,r):void 0})(e,t,n)}function vd(e){return Ln({...e,state:!0,attribute:!1})}var vt=/^(#{1,3})\s+/,Le=/^\s*\d{1,3}[.)]\s+/,_e=/^\s*[-*•]\s+/,ar="\\*_[]()#`";function kt(e){if(typeof e!="string")return;let t=e.replace(/\r\n?/g,`
`).trim();return t===""?void 0:t.slice(0,2e3)}var Ud=`What it shows.

# Set up
1. Point [Kitchen light] at your own light.
2. \u2026

Tap it to \u2026`;function _n(e){let t=e.trim();return/^https?:\/\/[^\s<>"']+$/i.test(t)?t:void 0}function me(e,t){let n=[],o=r=>{if(r==="")return;let a=n.at(-1);a?.kind==="text"?a.text+=r:n.push({kind:"text",text:r})},i=0;for(;i<e.length;){let r=e[i];if(r==="\\"&&i+1<e.length&&ar.includes(e[i+1])){o(e[i+1]),i+=2;continue}if(r==="*"&&e[i+1]==="*"){let a=e.indexOf("**",i+2);for(;a>0&&e[a+2]==="*";)a+=1;let l=a<0?"":e.slice(i+2,a);if(l.trim()!==""&&l===l.trim()){n.push({kind:"strong",spans:me(l,t)}),i=a+2;continue}}if((r==="*"||r==="_")&&e[i+1]!==r){let a=r==="*"||i===0||!/[\p{L}\p{N}]/u.test(e[i-1]),l=e.indexOf(r,i+1);for(;l>0&&r==="*"&&e[l+1]==="*";)l=e.indexOf(r,l+2);let s=l<0?"":e.slice(i+1,l),h=e[l+1],p=r==="*"||h===void 0||!/[\p{L}\p{N}]/u.test(h);if(a&&p&&s.trim()!==""&&s===s.trim()){n.push({kind:"em",spans:me(s,t)}),i=l+1;continue}}if(r==="["){let a=e.indexOf("]",i+1),l=a<0?"":e.slice(i+1,a);if(a>0&&l.length<=80&&!l.includes("["))if(e[a+1]==="("){let s=e.indexOf(")",a+2),h=s<0?void 0:_n(e.slice(a+2,s));if(h&&l.trim()!==""){n.push({kind:"url",text:l.trim(),href:h}),i=s+1;continue}}else{let s=l.trim()===""?void 0:t(l.trim());if(s){n.push({kind:"link",text:l.trim(),target:s}),i=a+1;continue}}}o(r),i+=1}return n}function Ct(e){return e.map(t=>t.kind==="strong"||t.kind==="em"?Ct(t.spans):t.text).join("")}function sr(e,t){let n=[],o=[],i,r=()=>{o.length!==0&&(n.push({kind:"para",spans:me(o.join(`
`),t)}),o=[])},a=()=>{i&&(n.push({kind:"list",ordered:i.ordered,items:i.items.map(l=>me(l,t))}),i=void 0)};for(let l of e.replace(/\r\n?/g,`
`).split(`
`)){let s=l.trim();if(s===""){r(),a();continue}let h=vt.exec(s);if(h){r(),a();let d=h[1].length;n.push({kind:"heading",level:d,spans:me(s.slice(h[0].length).replace(/\s+#+$/,""),t)});continue}let p=Le.test(s),c=!p&&_e.test(s);if(p||c){r(),i&&i.ordered!==p&&a(),i??={ordered:p,items:[]},i.items.push(s.replace(p?Le:_e,""));continue}if(i){i.items[i.items.length-1]+=` ${s}`;continue}o.push(s)}return r(),a(),n}function lr(e){let n=(e.split(`
`).map(o=>o.trim()).find(o=>o!=="")??"").replace(vt,"").replace(Le,"").replace(_e,"");return Ct(me(n,()=>{})).replace(/\[([^\[\]\n]{1,80})\]/g,"$1")}function jd(e,t){let n=sr(e,()=>{}).find(a=>a.kind==="para"),o=n?.kind==="para"?Ct(n.spans).replace(/\[([^\[\]\n]{1,80})\]/g,"$1").replace(/\s*\n\s*/g," ").trim():lr(e);if(o.length<=t)return o;let i=o.slice(0,t-1),r=i.lastIndexOf(" ");return`${(r>t/2?i.slice(0,r):i).trimEnd()}\u2026`}function Kd(e){return e.kind==="value"?"Open this shared value":e.kind==="group"?"Select this group":"Select this layer"}function Mn(e,t,n){let o=e.lastIndexOf(`
`,t-1)+1,i=n>t&&e[n-1]===`
`?n-1:n,r=e.indexOf(`
`,i);return[o,r<0?e.length:r]}function Je(e){return e.replace(vt,"").replace(Le,"").replace(_e,"").trimStart()}function Jd(e,t,n,o){let[i,r]=Mn(e,t,n),a=e.slice(i,r).split(`
`),l=o?Le:_e,s=a.filter(m=>m.trim()!==""),h=s.length>0&&s.every(m=>l.test(m)),p=e.slice(0,Math.max(0,i-1)).split(`
`).at(-1)??"",c=o?Number(/^\s*(\d{1,3})[.)]\s+/.exec(p)?.[1]??0):0,u=a.map(m=>m.trim()===""&&s.length>0?m:h?Je(m):(c+=1,`${o?`${c}. `:"- "}${Je(m)}`)).join(`
`),f=e.slice(0,i)+u+e.slice(r);return t===n&&a.length===1?{text:f,start:i+u.length,end:i+u.length}:{text:f,start:i,end:i+u.length}}function qd(e,t){let[n,o]=Mn(e,t,t),i=e.slice(n,o),r=/^#\s+/.test(i.trimStart())?Je(i):`# ${Je(i)}`;return{text:e.slice(0,n)+r+e.slice(o),start:n+r.length,end:n+r.length}}function Xd(e,t,n,o){let i=e.slice(0,t),r=e.slice(n),a=e.slice(t,n);if(i.endsWith(o)&&r.startsWith(o)&&(o==="**"||!(i.endsWith("**")&&r.startsWith("**"))||i.endsWith("***")))return{text:i.slice(0,-o.length)+a+r.slice(o.length),start:t-o.length,end:n-o.length};let s=a.length-a.trimStart().length,h=a.length-a.trimEnd().length,p=a.trim(),c=`${i}${a.slice(0,s)}${o}${p}${o}${a.slice(a.length-h)}${r}`,d=t+s+o.length;return{text:c,start:d,end:d+p.length}}function In(e,t,n,o){let i=e.slice(0,t),r=e.slice(n),a=i===""||/\s$/.test(i)?"":" ",l=r===""||/^[\s.,;:!?)]/.test(r)?"":" ",s=`${a}${o}${l}`,h=t+s.length;return{text:i+s+r,start:h,end:h}}function Yd(e,t,n,o){return In(e,t,n,`[${o}]`)}function Zd(e,t,n,o){let i=e.slice(t,n).replace(/[[\]\n]/g," ").trim()||o.replace(/^https?:\/\//i,"");return In(e,t,n,`[${i}](${o})`)}function Qd(e){let t=e.trim();if(t==="")return;let n=/^[a-z][a-z0-9+.-]*:/i.test(t)?t:/^[^\s/]+\.[^\s/]+/.test(t)?`https://${t}`:t;return _n(n)}var so=["rectangular","circular","corner"],zt=["small","medium","large","xlarge"],H=[...so,...zt];function $e(e){return H.includes(e)}var _={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34},small:{width:162.67,height:162.67},medium:{width:344.67,height:162.67},large:{width:344.67,height:360},xlarge:{width:344.67,height:557.33}},Ie=["rectangular","circular","corner","inline",...zt];var nc=64;function oc(e,t){let n=new Set(e);return t.filter(o=>o.kind!=="preset"||!n.has(o.slot))}function $t(e){return cr(e)?10:Bo(e)?9:dr(e)?8:zt.some(n=>e.supportedFamilies.includes(n))?7:so.some(n=>!e.supportedFamilies.includes(n))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}function dr(e){if(e.elements.some(n=>n.kind==="list"))return!0;let t=!1;return re(e,n=>{(n.kind.kind==="item"||n.kind.kind==="listStat")&&(t=!0)}),t}function cr(e){let t=!1;return re(e,n=>{n.kind.kind==="imageTime"&&(t=!0)}),t}function it(e){return e==="standard"||e==="condensed"||e==="compressed"||e==="expanded"?e:void 0}var ur=4,Oe=.5;function pr(e){return Number.isFinite(e)?Math.min(1,Math.max(Oe,e)):Oe}var hr=["none","dot","triangle"],fr=["straight","smooth","step"],mr=["light","medium","strong"],gr={light:.05,medium:.1,strong:.2};function Rn(e){return typeof e=="string"&&fr.includes(e)?e:"straight"}var yr=["flat","fade"],xr=["none","all","auto"],lo=4,rt="#FFFFFF33";function At(e){return typeof e=="string"&&yr.includes(e)?e:"flat"}function Et(e){return typeof e=="string"&&xr.includes(e)?e:"none"}function Ft(e){return typeof e!="number"||!Number.isFinite(e)?0:Math.max(0,Math.min(lo,Math.round(e)))}function Ce(e,t){return e.replace(/^#/,"").toUpperCase()===t.replace(/^#/,"").toUpperCase()}function ye(e){return typeof e=="string"&&e!==""?e:rt}var br=1,wr=12;function Pe(e){if(!(typeof e!="number"||!Number.isFinite(e)))return Math.max(br,Math.min(wr,e))}function co(e){return e==="all"?"all":"auto"}var Ot=1,Vt=3,vr=.25,kr=4;function uo(e){return typeof e!="number"||!Number.isFinite(e)?Vt:Math.max(1,Math.min(lo,Math.round(e)))}function po(e){return typeof e!="number"||!Number.isFinite(e)?Ot:Math.max(vr,Math.min(kr,e))}var Cr=["all","top"],Bt=1.2;function Ht(e){return typeof e!="number"||!Number.isFinite(e)?Bt:Math.max(0,e)}function Lt(e){return typeof e=="string"&&Cr.includes(e)?e:"all"}function _t(e){if(typeof e=="string")return mr.includes(e)?e:void 0;if(e===3||e===5)return"light";if(e===7)return"medium";if(e===9)return"strong"}function ic(e,t){if(t===void 0||e<2)return 0;let n=Math.max(3,Math.floor(e*gr[t]+.5));return n%2===0?n+1:n}var Sr=[["history","Recorded history"],["statistics","Long-term statistics"]],Tr=[["5minute","5 min"],["hour","Hour"],["day","Day"],["week","Week"],["month","Month"]],Ar=[["mean","Mean"],["min","Min"],["max","Max"],["change","Change"],["sum","Total"]],Gt="history",Wt="hour",Ut="mean",Er=[["latest","Newest reading"],["first","First reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["delta","Change"],["sum","Total"],["trend","Trend arrow"],["top","Top of the scale"],["bottom","Bottom of the scale"]],Fr=[["clock","Time"],["date","Date"],["weekday","Weekday"],["dateTime","Weekday and time"]];function rc(e){return e==="clock"||e==="dateTime"}var ac=[["count","Items shown"],["total","Items in total"]],ho={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},Hr=[["highest","Highest reading"],["lowest","Lowest reading"],["now","Now"],["first","First reading"],["latest","Newest reading"],["threshold","Threshold"],["zero","Zero"]];function sc(e){return e!=="threshold"&&e!=="zero"}var Lr=[["above","Above"],["on","On"],["below","Inside"],["bottom","At the bottom"],["through","Through"]];function _r(e){return Hr.some(([t])=>t===e)}function Mr(e){return Lr.some(([t])=>t===e)}function Ir(e){if(!g(e)||typeof e.layer!="string"||e.layer==="")return;let t={layer:e.layer.toUpperCase(),at:_r(e.at)?e.at:"highest",place:Mr(e.place)?e.place:"above"},n=v(e.dx,0),o=v(e.dy,0);return n!==0&&(t.dx=n),o!==0&&(t.dy=o),t}function qe(e,t){let n=Ir(e.chartAnchor);n!==void 0&&(t.chartAnchor=n)}function Xe(e,t){e.chartAnchor!==void 0&&(t.chartAnchor=Rr(e.chartAnchor))}function Rr(e){let t={layer:e.layer,at:e.at,place:e.place};return e.dx!==void 0&&e.dx!==0&&(t.dx=b(e.dx)),e.dy!==void 0&&e.dy!==0&&(t.dy=b(e.dy)),t}var lc=[["linear","Linear"],["radial","Radial"]],Pr=2,Nr=4;function Re(e){if(!g(e)||!Array.isArray(e.stops))return;let t=[];for(let i of e.stops){if(t.length===Nr)break;if(!g(i))continue;let r=A(i.colorHex);r===void 0||r===""||t.push({at:W(v(i.at,0)),colorHex:r})}if(t.length<Pr)return;let n={kind:e.kind==="radial"?"radial":"linear",stops:t},o=v(e.angle,0);return n.kind==="linear"&&o!==0&&(n.angle=o),n}function Ye(e){let t={kind:e.kind,stops:e.stops.map(n=>({at:b(n.at),colorHex:n.colorHex}))};return e.kind==="linear"&&e.angle!==void 0&&e.angle!==0&&(t.angle=b(e.angle)),t}function dc(e,t){let n=[...e.stops].sort((r,a)=>r.at-a.at),o=n[0],i=n[n.length-1];if(t<=o.at)return o.colorHex;if(t>=i.at)return i.colorHex;for(let r=1;r<n.length;r++){let a=n[r],l=n[r-1];if(t>a.at)continue;let s=a.at-l.at;return Dr(l.colorHex,a.colorHex,s<=0?0:(t-l.at)/s)}return i.colorHex}function Dr(e,t,n){let o=s=>{let h=s.replace(/^#/,""),p=h.length===6?`${h}FF`:h.padEnd(8,"F");return[0,2,4,6].map(c=>parseInt(p.slice(c,c+2),16)||0)},i=o(e),r=o(t),a=i.map((s,h)=>Math.round(s+(r[h]-s)*n)),l=a.map(s=>Math.max(0,Math.min(255,s)).toString(16).padStart(2,"0").toUpperCase());return a[3]===255?`#${l[0]}${l[1]}${l[2]}`:`#${l.join("")}`}function cc(e,t){let n=e.replace(/^#/,""),o=n.length>=6?n.slice(0,6).toUpperCase():"FFFFFF",i=n.length>=8?parseInt(n.slice(6,8),16):255,r=Math.min(255,Math.max(0,Math.round(i*t)));return r===255?`#${o}`:`#${o}${r.toString(16).padStart(2,"0").toUpperCase()}`}var zr=[["up","Up"],["down","Down"],["left","Left"],["right","Right"]],jt="up",Kt=0,Jt=100,uc=.25;function pc(e){return{value:e,minValue:Kt,maxValue:Jt,direction:jt}}function $r(e){if(!g(e))return;let t={value:g(e.value)?F(e.value):S("50"),minValue:v(e.minValue,Kt),maxValue:v(e.maxValue,Jt),direction:le(e.direction,zr.map(([o])=>o),jt)};g(e.minSource)&&(t.minSource=F(e.minSource)),g(e.maxSource)&&(t.maxSource=F(e.maxSource));let n=A(e.trackColorHex);return n!==void 0&&n!==""&&(t.trackColorHex=n),t}function Or(e){let t={value:E(e.value)};return e.minValue!==Kt&&(t.minValue=b(e.minValue)),e.maxValue!==Jt&&(t.maxValue=b(e.maxValue)),e.minSource!==void 0&&(t.minSource=E(e.minSource)),e.maxSource!==void 0&&(t.maxSource=E(e.maxSource)),e.direction!==jt&&(t.direction=e.direction),e.trackColorHex!==void 0&&(t.trackColorHex=e.trackColorHex),t}function Pn(e,t){let n=$r(e.level);n!==void 0&&(t.level=n)}function Nn(e,t){e.level!==void 0&&(t.level=Or(e.level))}var Vr=["circular","rectangular","corner","small","medium","large","xlarge"];function hc(e){return Vr.includes(e)}var Br=.1,Gr=3,fc=.5,Wr=10,Ur=360,Ze=120,jr=-2,Kr=20;function Jr(e){if(!g(e))return;let t=v(e.radius,NaN);if(!Number.isFinite(t))return;let n={radius:Math.min(Gr,Math.max(Br,t))},o=v(e.angle,0);o!==0&&(n.angle=o);let i=qr(v(e.sweep,Ze));i!==Ze&&(n.sweep=i);let r=Xr(v(e.spacing,0));return r!==0&&(n.spacing=r),e.flip===!0&&(n.flip=!0),n}function qr(e){if(!Number.isFinite(e)||e===0)return Ze;let t=Math.min(Ur,Math.max(Wr,Math.abs(e)));return e<0?-t:t}function Xr(e){return Number.isFinite(e)?Math.min(Kr,Math.max(jr,e)):0}function Yr(e){let t={radius:b(e.radius)};return e.angle!==void 0&&e.angle!==0&&(t.angle=b(e.angle)),e.sweep!==void 0&&e.sweep!==Ze&&(t.sweep=b(e.sweep)),e.spacing!==void 0&&e.spacing!==0&&(t.spacing=b(e.spacing)),e.flip===!0&&(t.flip=!0),t}var fo={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setFontDesign:"fontDesign",setFontWidth:"fontWidth",setItalic:"italic",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},Zr=12,Dn=12,mo="#000000",mc={colorHex:mo,radius:3,dx:0,dy:1};function Qr(e){return Number.isFinite(e)?Math.min(Zr,Math.max(0,e)):0}function zn(e){return Number.isFinite(e)?Math.min(Dn,Math.max(-Dn,e)):0}function ea(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):1}function gc(e){return e.countdown===!0?!1:e.coloring==="bands"&&(e.bands?.length??0)>0||e.highlight!==void 0&&e.highlight!=="none"}function go(e){return e.countdown!==!0&&(e.parts?.length??0)>0}function yo(e){if(e.kind.kind==="literal")return(e.format?.prefix??"")+e.kind.value+(e.format?.suffix??"")}function xo(e){let t=p=>p.icon===void 0&&p.value.kind.kind!=="literal",n=(p,c)=>e.slice(p,c).map(d=>d.icon===void 0?yo(d.value)??"":"").join(""),o=e.findIndex(t);if(o<0)return S(n(0,e.length));let i=e.findIndex((p,c)=>c>o&&t(p)),r=e[o].value,a={...r.format},l=n(0,o)+(a.prefix??""),s=(a.suffix??"")+n(o+1,i<0?e.length:i);delete a.prefix,delete a.suffix,l!==""&&(a.prefix=l),s!==""&&(a.suffix=s);let h={kind:structuredClone(r.kind)};return ve(a)||(h.format=a),h}function yc(e){go(e)&&(e.value=xo(e.parts))}var ta="svg:custom",na="0 0 24 24",$n=8*1024;function xc(e){return e.symbol.kind.kind==="literal"&&e.symbol.kind.value===ta}function qt(e){if(e===void 0)return;let t=e.trim();if(!(t===""||t===na))return t}function bc(e){let t={minX:0,minY:0,width:24,height:24};if(e===void 0)return t;let n=e.trim().split(/[\s,]+/).filter(s=>s!=="");if(n.length!==4)return t;let o=n.map(s=>Number(s));if(!o.every(s=>Number.isFinite(s)))return t;let[i,r,a,l]=o;return!(a>0)||!(l>0)?t:{minX:i,minY:r,width:a,height:l}}var oa=/^[MmLlHhVvCcSsQqTtAaZz0-9eE+\-.,\s]+$/;function wc(e){let t=e.trim();if(t==="")return{ok:!1,error:"Paste an SVG path or the whole <svg> markup."};let n=t.startsWith("<"),o=n?ia(t):t.replace(/\s+/g," ").trim();if(n&&o==="")return{ok:!1,error:"That markup has no <path> in it. Only paths can be drawn on a watch face."};if(!oa.test(o))return{ok:!1,error:"That is not an SVG path: it holds characters no path command uses."};if(!/[Mm]/.test(o))return{ok:!1,error:"An SVG path starts with a move command (M)."};let i=new TextEncoder().encode(o).length;if(i>$n)return{ok:!1,error:`That drawing is ${Math.ceil(i/1024)} KB of path and the limit is ${$n/1024} KB. Simplify it in a vector editor first.`};let r=n?qt(ra(t)):void 0;return r===void 0?{ok:!0,path:o}:{ok:!0,path:o,viewBox:r}}function ia(e){let t=[];for(let n of e.matchAll(/<path\b[^>]*>/gi)){let o=/\sd\s*=\s*("([^"]*)"|'([^']*)')/i.exec(n[0]),i=(o?.[2]??o?.[3]??"").replace(/\s+/g," ").trim();i!==""&&t.push(i)}return t.join(" ")}function ra(e){let t=/<svg\b[^>]*>/i.exec(e);if(!t)return;let n=/\sviewBox\s*=\s*("([^"]*)"|'([^']*)')/i.exec(t[0]),o=(n?.[2]??n?.[3]??"").replace(/\s+/g," ").trim();return o===""?void 0:o}var Xt="#FFFFFF",at="#FFFFFF80",st=3,aa=60,sa=8,lt="#FFFFFF",dt=8,la=4,da=20;function vc(e){if(!Number.isFinite(e))return"";let t=e.toFixed(2);return t.includes(".")&&(t=t.replace(/0+$/,"").replace(/\.$/,"")),t==="-0"?"0":t}function kc(){return{count:0,length:st,colorHex:at,majorEvery:0}}function Cc(){return{show:!1,size:dt,colorHex:lt}}function bo(e){return e.count===0&&e.length===st&&Ce(e.colorHex,at)&&e.majorEvery===0}function wo(e){return!e.show&&e.size===dt&&Ce(e.colorHex,lt)}function ca(e){if(!g(e))return;let t={count:Math.max(0,Math.min(aa,Math.round(v(e.count,0)))),length:Math.max(1,Math.min(sa,v(e.length,st))),colorHex:w(e.colorHex,at),majorEvery:Math.max(0,Math.round(v(e.majorEvery,0)))};return bo(t)?void 0:t}function ua(e){let t={};return e.count!==0&&(t.count=Math.round(e.count)),e.length!==st&&(t.length=b(e.length)),Ce(e.colorHex,at)||(t.colorHex=e.colorHex),e.majorEvery!==0&&(t.majorEvery=Math.round(e.majorEvery)),t}function pa(e){if(!g(e))return;let t={show:e.show===!0,size:Math.max(la,Math.min(da,v(e.size,dt))),colorHex:w(e.colorHex,lt)};return wo(t)?void 0:t}function ha(e){let t={};return e.show&&(t.show=!0),e.size!==dt&&(t.size=b(e.size)),Ce(e.colorHex,lt)||(t.colorHex=e.colorHex),t}function On(e){return typeof e=="string"&&hr.includes(e)}function fa(e){return e==="none"?{high:"none",low:"none"}:e==="pointer"?{high:"triangle",low:"dot"}:{high:"dot",low:"dot"}}function Mt(e){let t=fa(e.marker);return{high:e.highMarker??t.high,low:e.lowMarker??t.low}}function vo(e){return e.high==="triangle"?"pointer":e.high!=="none"||e.low!=="none"?"dot":"none"}function ko(e){return e.high==="none"&&e.low==="none"||e.high==="dot"&&e.low==="dot"||e.high==="triangle"&&e.low==="dot"}function ma(e,t){e.marker=vo(t),ko(t)?(delete e.highMarker,delete e.lowMarker):(e.highMarker=t.high,e.lowMarker=t.low)}var Sc=24,ga=6,Vn="#FFFFFF";function Tc(e){if(e.style!=="bars")return 0;let t=e.barBorderWidth;return typeof t!="number"||!Number.isFinite(t)?0:Math.min(Math.max(t,0),ga)}function Ac(e,t,n,o,i){if(i!==void 0)return{fill:i,border:i};if(!xa(e))return{fill:e.fillColorHex??o,border:e.barBorderColorHex??Vn};let r=n.find(l=>t<=l.upTo),a=r?{color:r.colorHex,fill:r.fillColorHex,border:r.borderColorHex}:{color:e.bandAboveColorHex,fill:e.bandAboveFillColorHex,border:e.bandAboveBorderColorHex};return{fill:a.fill??e.fillColorHex??a.color,border:a.border??e.barBorderColorHex??Vn}}var xe="#FF6B35",be="#32D74B",ya="#32D74B",G="#FF453A",Yt="#FF453A",Zt="#FFFFFF99";function Ec(e){return[...e.bands].sort((t,n)=>t.upTo-n.upTo)}function xa(e){return e.coloring==="bands"&&e.bands.length>0}function Fc(e,t,n){for(let o of t)if(e<=o.upTo)return o.colorHex;return n}function Hc(e,t){let n=Math.abs(t),o=n>=10?0:n>=1?1:2;return e.toFixed(o)}function Lc(e){return e>0?"\u2191":e<0?"\u2193":"\u2192"}var ba=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],wa=360,va=10080,_c=[...ba,{minutes:43200,label:"Last 30 days"},{minutes:129600,label:"Last 90 days"},{minutes:527040,label:"Last year"}],Mc=366*24*60,ka=2,Ca=120,Sa=0;function Qt(e){let t=Math.round(e.historyPoints);return Number.isFinite(t)?t<1?Sa:Math.max(ka,Math.min(Ca,t)):24}function Ta(e){return tn(e)!==void 0?!0:en(e)!==void 0&&Qt(e)>0}function en(e){if(e.source==="history")return Co(e)}function tn(e){if(e.source==="statistics")return Co(e)}function Co(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Aa(e){let t=en(e);if(t!==void 0)return`${t}|${Math.round(e.historyMinutes)}|${Qt(e)}${e.gaps===!0?"|gaps":""}`}function Ea(e){let t=tn(e);if(t!==void 0)return`${t}|${Math.round(e.historyMinutes)}|${e.statPeriod}|${e.statType}${e.gaps===!0?"|gaps":""}`}function Ic(e){return[...nn(e).map(n=>n.key),...on(e).map(n=>n.key)].sort().join(";")}function nn(e){let t=new Map,n=o=>{t.has(o.key)||t.set(o.key,o)};for(let o of e.elements)if(o.kind==="chart"){let i=Aa(o.payload),r=en(o.payload);if(i===void 0||r===void 0)continue;n({key:i,entityId:r,minutes:Math.round(o.payload.historyMinutes),points:Qt(o.payload),mode:"numeric",gaps:o.payload.gaps===!0})}else if(o.kind==="timeline"){let i=Oa(o.payload),r=Ho(o.payload);if(i===void 0||r===void 0||$a(o.payload))continue;let a=pt(o.payload);n({key:i,entityId:r,minutes:Fo(o.payload),points:Eo,mode:"states",gaps:!1,...a.length>0?{entities:a,combine:o.payload.aggregate?.combine??ct}:{}})}return[...t.values()]}function on(e){let t=new Map;for(let n of e.elements){if(n.kind!=="chart")continue;let o=Ea(n.payload),i=tn(n.payload);o===void 0||i===void 0||t.has(o)||t.set(o,{key:o,entityId:i,minutes:Math.round(n.payload.historyMinutes),period:n.payload.statPeriod,type:n.payload.statType,gaps:n.payload.gaps===!0})}return[...t.values()]}var Fa=2,Ha=20,ct="any",La="binary_sensor",Rc=[["any","Any"],["all","All"]];function Pc(e){return e==="all"?"On when all of them are active":"On when any of them is active"}var Nc=[["auto","Auto"],["h12","12 hour"],["h24","24 hour"]],Dc=[["auto","Auto"],["always","Always"],["never","Never"]];function St(e){return e==="h12"||e==="h24"?e:ue}function Tt(e){return e==="always"||e==="never"?e:pe}function _a(e){let t={},n=e.fontWeight;(n==="medium"||n==="semibold"||n==="bold")&&(t.fontWeight=n);let o=e.fontDesign;(o==="default"||o==="monospaced"||o==="serif")&&(t.fontDesign=o);let i=it(e.fontWidth);return i!==void 0&&i!=="standard"&&(t.fontWidth=i),e.italic===!0&&(t.italic=!0),e.monospacedDigits===!0&&(t.monospacedDigits=!0),t}function Ma(e){return e.timeLabelCount!==void 0?we(e.timeLabelCount):e.timeLabels==="ends"?2:e.timeLabels==="four"?4:ce}function we(e){let t=Number(e);return Number.isFinite(t)?Math.max(0,Math.min(Ao,Math.round(t))):ce}function zc(e){return e<=0?[]:e===1?[1]:Array.from({length:e},(t,n)=>n/(e-1))}var ut="#8E8E93",So=1,Ia="#000000",Ra=2,Pa=1440,rn=60,ce=0,X=9,Y="#8E8E93",ue="auto",pe="auto",To=4,Ao=12,Na=1,Da=20,za=4,Eo=120;function $c(e,t,n){let o=e.trim().toLowerCase();for(let i of t)if(i.match.trim().toLowerCase()===o)return i.colorHex;return n}function Fo(e){let t=Math.round(e.historyMinutes);return Number.isFinite(t)?Math.max(1,Math.min(va,t)):rn}function Ho(e){return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function pt(e){let t=e.aggregate?.entities??[],n=[];for(let o of t){let i=typeof o=="string"?o.trim():"";i!==""&&!n.includes(i)&&n.push(i)}return n}function Oc(e){let t=[...e.aggregate?.entities??[]];for(;t.length<Fa;)t.push("");return t}function $a(e){return pt(e).length>Ha}function Oa(e){let t=Ho(e);if(t===void 0)return;let n=`${t}|${Fo(e)}|${Eo}|states`,o=pt(e);return o.length===0?n:`${n}|${e.aggregate?.combine??ct}:${o.join(",")}`}var Va={on:"#FF9F0A",off:"#0A84FF",open:"#FF453A",closed:"#32D74B",opening:"#FFD60A",closing:"#FFD60A",home:"#32D74B",not_home:"#0A84FF",locked:"#32D74B",unlocked:"#FF453A",jammed:"#BF5AF2",playing:"#32D74B",paused:"#FF9F0A",idle:"#0A84FF",standby:"#5E5CE6",heat:"#FF9F0A",cool:"#64D2FF",heat_cool:"#BF5AF2",dry:"#FFD60A",fan_only:"#5E5CE6",auto:"#BF5AF2",cleaning:"#32D74B",docked:"#0A84FF",returning:"#64D2FF",error:"#FF453A",disarmed:"#32D74B",armed_home:"#0A84FF",armed_away:"#FF9F0A",armed_night:"#5E5CE6",arming:"#FFD60A",pending:"#FFD60A",triggered:"#FF453A",unavailable:"#48484A",unknown:"#48484A"},Ba={binary_sensor:["on","off"],switch:["on","off"],light:["on","off"],input_boolean:["on","off"],fan:["on","off"],humidifier:["on","off"],siren:["on","off"],cover:["open","closed","opening","closing"],lock:["locked","unlocked","jammed"],person:["home","not_home"],device_tracker:["home","not_home"],media_player:["playing","paused","idle","off"],climate:["heat","cool","heat_cool","dry","fan_only","auto","off"],vacuum:["cleaning","docked","returning","idle","error"],alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","arming","pending","triggered"]};function Bn(e){return Va[e.trim().toLowerCase()]??ut}var Ga=["door","garage_door","window","opening"];function Gn(e,t){let n=(t??"").trim().toLowerCase(),o=e==="binary_sensor"&&Ga.includes(n),i=a=>Bn(o&&a==="on"?"open":a);return[...Ba[e]??[],"unavailable","unknown"].map(a=>({id:M(),match:a,colorHex:i(a)}))}var Vc=48*1024,Lo=6,Wa=0,ht=9,Ua=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function ja(e){let t=e.trim();if(t==="")return 0;let n=t.endsWith("==")?2:t.endsWith("=")?1:0;return Math.max(0,Math.floor(t.length*3/4)-n)}function Bc(e){return e.source==="inline"&&e.data!==void 0?ja(e.data):0}function Gc(e){if(e.source!=="inline")return;let t=e.data;if(!(t===void 0||t===""))return`data:${e.format==="jpeg"?"image/jpeg":"image/png"};base64,${t}`}function _o(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function Ka(e,t){let n=t<=.5,o=e<=.5;return n?o?"topLeading":"topTrailing":o?"bottomLeading":"bottomTrailing"}function Wc(e){switch(e.type){case"refresh":case"refreshAll":case"toggleEntity":case"runScene":case"runScript":case"callService":case"runHTTPAction":case"timerStartPause":return!0;default:return!1}}function Uc(e,t){t?e.confirm=!0:delete e.confirm}var Ja={top:0,left:0,bottom:0,right:0};function Mo(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}function jc(e){return e.fontDesign??"rounded"}var Kc=[["down","Down"],["across","Across"]],qa=[["name","Name"],["state","State"],["lastChanged","Last changed"]],Xa=[["open","To do"],["done","Done"],["all","Everything"]],Ya=[["list","List order"],["due","Due"]],Za=[["hourly","Hourly"],["daily","Daily"],["twiceDaily","Twice daily"]],Jc=[["entities","Entities"],["attribute","Attribute"],["template","Template"],["calendar","Calendar"],["todo","To-do list"],["forecast","Forecast"]],Qa=1,es=12,an=4,ts=1,ns=4,sn=1,ln=2,os=12,is=8,qc=5,rs=1,Io=8784,Ro=24,Po=["list","chart","timeline","chartTimes","chartDots","chartGrid","imageTime"],Xc=["rectangular","small","medium","large","xlarge"];function Yc(e){let t=Se(e.rows);if(e.direction==="across")return{lines:1,columns:t};let n=Math.min(dn(e.columns),t);return{lines:Math.ceil(t/n),columns:n}}function Se(e){let t=typeof e=="number"&&Number.isFinite(e)?Math.round(e):an;return Math.min(es,Math.max(Qa,t))}function dn(e){let t=typeof e=="number"&&Number.isFinite(e)?Math.round(e):sn;return Math.min(ns,Math.max(ts,t))}function No(e){let t=typeof e=="number"&&Number.isFinite(e)?e:ln;return Math.min(os,Math.max(0,t))}function Te(e){let t=typeof e=="number"&&Number.isFinite(e)?Math.round(e):Ro;return Math.min(Io,Math.max(rs,t))}var Zc=["hours","days","weeks","months"],K={hours:1,days:24,weeks:168,months:720};function Qc(e){let t=Te(e);return t%K.months===0?{value:t/K.months,unit:"months"}:t%K.weeks===0?{value:t/K.weeks,unit:"weeks"}:t%K.days===0?{value:t/K.days,unit:"days"}:{value:t,unit:"hours"}}function eu(e,t){let n=Number.isFinite(e)?e:1;return Te(Math.round(n*K[t]))}function as(e){return Math.floor(Io/K[e])}function tu(e,t){let n=Math.ceil(Te(e)/K[t]);return Math.min(as(t),Math.max(1,n))}function nu(e,t){return Math.round(Te(e)/K[t]*100)/100}var ss=["toggleEntity","runScene","runScript","addTodo","runHTTPAction","openEntity"];function ou(e){return ss.includes(e)}function iu(e){let t=(e??"").trim();if(t==="")return!0;try{let n=JSON.parse(t);return typeof n=="object"&&n!==null&&!Array.isArray(n)}catch{return!1}}var ls=[["refresh","Refresh this complication"],["refreshAll","Refresh multiple complications"],["nextPage","Show next page"],["previousPage","Show previous page"],["showPage","Show one page"],["playTour","Play all pages"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["callService","Call a service"],["runHTTPAction","Run an HTTP action"],["addTodo","Add a to-do"],["openApp","Open the app"],["openPage","Open a watch app page"],["openEntity","Open an entity"],["openRoomPage","Open the room I'm in"],["timerStartPause","Start or pause a timer"],["timerCancel","Cancel a timer"],["none","Nothing"]],ru=[["Refresh",["refresh","refreshAll"]],["Pages",["nextPage","previousPage","showPage","playTour"]],["Home Assistant",["toggleEntity","runScene","runScript","callService","runHTTPAction","addTodo"]],["Open the app",["openApp","openPage","openEntity","openRoomPage"]],["Timer",["timerStartPause","timerCancel"]]],ds=["openPage","openEntity","openRoomPage","addTodo"];function au(e,t=!1){let o={refresh:"Fetches new data and redraws this complication.",refreshAll:"Fetches new data for this complication and the others you pick. The other tiles redraw only when watchOS allows it.",nextPage:"Shows the next page of this complication. Needs two or more pages.",previousPage:"Shows the page before this one. Needs two or more pages.",showPage:"Shows the page you pick, such as page 1. Needs two or more pages.",playTour:"Shows every page once, then goes back to page 1. Needs two or more pages.",toggleEntity:"Turns an entity on or off, such as a light or a switch.",runScene:"Turns on a Home Assistant scene.",runScript:"Runs a Home Assistant script.",callService:"Calls any Home Assistant service, with your own data.",runHTTPAction:"Runs an HTTP action kept in Home Assistant or the Wrist Assistant app.",addTodo:"Opens the watch app to add an item to a to-do list.",openApp:"Opens Wrist Assistant.",openPage:"Opens one page of your Wrist Assistant grid. You pick the page.",openEntity:"Opens the watch app on the controls of the entity you pick. The entity needs a tile on a watch app page.",openRoomPage:"Opens the app on the page for the room it finds you in.",timerStartPause:"Starts or pauses the first timer this complication shows. Three quick taps cancel it.",timerCancel:"Works the same as Start or pause a timer: three quick taps cancel it.",none:"Does nothing. On the whole complication the watch still opens the app."}[e];return t&&ds.includes(e)?`${o} On iPhone this only opens the app.`:o}function cs(e){return ls.find(([t])=>t===e.type)?.[1]??e.type}function su(e){let t=cs(e);if(e.type==="callService"){let o=[e.serviceDomain,e.serviceName].filter(i=>i!=="").join(".");return o===""?t:`${t}: ${o}`}if(e.type==="refreshAll"){if(e.allPlaced===!0)return`${t}: all placed`;let o=e.targets?.length??0,i=Object.keys(e.targetLayers??{}).length,r=o>0?`${t}: ${o} picked`:`${t}: none picked`;return i>0?`${r}, ${i} narrowed`:r}if(e.type==="showPage")return`${t}: ${e.page}`;if(e.type==="refresh"&&e.layerIds!==void 0){let o=e.layerIds.length;return o>0?`${t}: ${o} picked`:`${t}: none picked`}if(!("entityId"in e))return t;let n=e.displayName||e.entityId;return n?`${t}: ${n}`:t}function lu(e,t,n){if(e.allPlaced===!0)return{type:"refreshAll",allPlaced:!0};let o=t.trim().toUpperCase(),i=e.targets??[],r=n?o===""||i.includes(o)?[...i]:[...i,o]:i.filter(s=>s!==o),a={type:"refreshAll"};r.length>0&&(a.targets=r);let l=n?e.targetLayers:Do(e.targetLayers,o);return l!==void 0&&(a.targetLayers={...l}),a}function Do(e,t){if(e===void 0||!(t in e))return e;let n={...e};return delete n[t],Object.keys(n).length>0?n:void 0}function du(e,t,n){if(e.allPlaced===!0)return{type:"refreshAll",allPlaced:!0};let o=t.trim().toUpperCase();if(o==="")return e;let i={type:"refreshAll"};e.targets!==void 0&&e.targets.length>0&&(i.targets=[...e.targets]);let r=n?Do(e.targetLayers,o):{...e.targetLayers??{},[o]:[]};return r!==void 0&&(i.targetLayers={...r}),i}function cu(e,t,n,o){if(e.allPlaced===!0)return{type:"refreshAll",allPlaced:!0};let i=t.trim().toUpperCase(),r=n.trim();if(i==="")return e;let a=e.targetLayers?.[i]??[],l=o?r===""||a.includes(r)?[...a]:[...a,r]:a.filter(h=>h!==r),s={type:"refreshAll"};return e.targets!==void 0&&e.targets.length>0&&(s.targets=[...e.targets]),s.targetLayers={...e.targetLayers??{},[i]:l},s}function uu(e,t,n){let o=t.trim(),i=e.layerIds??[];return{type:"refresh",layerIds:n?o===""||i.includes(o)?[...i]:[...i,o]:i.filter(a=>a!==o)}}function pu(e,t=!1){if(It(e.type))return t?e.type==="nextPage"?"Each tap shows the next page. The page stays where it was left.":e.type==="previousPage"?"Each tap shows the page before. The page stays where it was left.":e.type==="showPage"?`Each tap shows page ${e.page}. A complication with fewer pages shows its last page.`:"Plays every page once from one tap, then returns to page 1.":"This complication has one page, so this does nothing yet. Add a page in the Pages card, on the left.";if(e.type==="timerStartPause")return"Uses the first timer entity this complication shows. One tap starts or pauses it, three quick taps cancel it. With no timer entity, a tap only refreshes.";if(e.type==="timerCancel")return"This works the same as Start or pause a timer: one tap starts or pauses, three quick taps cancel. Pick Start or pause a timer to say so.";if(e.type==="openEntity")return"The watch opens the page that has this entity's tile, then opens its controls. With no tile for it, the watch says Not on a page.";if(e.type==="none")return"The watch cannot do nothing on a tap: a complication with no action still opens the app. Pick Open the app to say so, or Refresh this complication to make the tap worth something.";if(e.type==="refresh"){if(e.layerIds===void 0)return"Refreshes every layer and every page of this complication, not just the layer the tap sits on.";let a=" On a watch running an older app this tap refreshes everything instead.";return e.layerIds.length===0?"Nothing is ticked, so this tap still refreshes the whole complication. Tick the layers you want it to fetch."+a:`Fetches only the ${e.layerIds.length} ticked below. Everything else keeps what it last read, and the whole tile is redrawn.`+a}if(e.type!=="refreshAll")return;let n=" On a watch running an older app this tap does nothing.";if(e.allPlaced===!0)return"Refreshes every Wrist Assistant complication placed on the watch, not just this one."+n;let o=e.targets?.length??0,i=Object.keys(e.targetLayers??{}).length,r=i===0?"":i===1?" One complication is narrowed to the layers ticked under its own box.":` ${i} complications are narrowed to the layers ticked under their own boxes.`;return o>0?`Refreshes this complication and the ${o} picked below.`+r+n:"Nothing is picked, so this tap only refreshes this complication. Pick all placed complications or some below."+r+n}var zo="\uE000",$o="\uE001";function hu(e){return`${zo}${e}${$o}`}function fu(e){let t=[],n="",o=e;for(;;){let i=o.indexOf(zo);if(i<0)break;let r=o.indexOf($o,i+1);if(n+=o.slice(0,i),r<0||r===i+1){n+=o.slice(i),o="";break}n!==""&&t.push({text:n}),n="",t.push({symbol:o.slice(i+1,r)}),o=o.slice(r+1)}return n+=o,n!==""&&t.push({text:n}),t}function mu(e){return(e.parts?.length??0)>0}var us=["toggleEntity","runScene","runScript","callService","runHTTPAction","openApp"],ps=["toggleEntity","callService"],hs=new Set(["on","open","unlocked","home","playing","heat","cool"]),Oo="switch.2";function fs(e){return us.includes(e)}function gu(e){return e.kind==="toggle"&&ps.includes(e.action.type)?"toggle":"button"}function yu(e){return e!==void 0&&hs.has(e.trim().toLowerCase())}var Vo=4,ft=2,Wn={min:1,max:10};function he(e){return Number.isFinite(e)?Math.min(Math.max(Math.trunc(e),1),Vo):1}function te(e){return Number.isFinite(e)?Math.min(Math.max(e,Wn.min),Wn.max):ft}function ms(e=2,t="tap"){return{count:he(e),mode:t,dwell:[]}}function Ae(e){return e!==void 0&&e.count>1}function mt(e){return Array.from({length:he(e.count)},(t,n)=>n+1)}function gs(e){if(!g(e))return;let t=he(v(e.count,1));if(t<=1)return;let n=(Array.isArray(e.dwell)?e.dwell:[]).slice(0,t).map(o=>te(v(o,ft)));return{count:t,mode:e.mode==="tour"?"tour":"tap",dwell:n}}function ys(e){if(!Ae(e))return;let t={count:he(e.count),mode:e.mode};return e.dwell.length>0&&(t.dwell=e.dwell.map(te)),t}function xs(e){if(typeof e!="number"||!Number.isFinite(e))return;let t=Math.trunc(e);return t>=1?t:void 0}function Bo(e){return Ae(e.pages)?!0:e.elements.some(t=>t.payload.page!==void 0)}function Go(e){let t=cn(e);if(Ae(e.pages))return{...e.pages,mode:t,dwell:[...e.pages.dwell]};let n=e.elements.map(a=>a.payload.page).filter(a=>a!==void 0),o=n.length>0?Math.max(...n):1,i=e.pages??ms(1),r={...i,mode:t,dwell:[...i.dwell]};return o<=1?r:{...r,count:he(o)}}function Wo(e,t){return t<1||t>e.dwell.length?ft:te(e.dwell[t-1])}function xu(e){return mt(e).reduce((t,n)=>t+Wo(e,n),0)}function bu(e,t){if(!Ae(e))return[];let n=[],o=0;for(let i of mt(e))n.push({atMs:t+o*1e3,page:i}),o+=Wo(e,i);return n.push({atMs:t+o*1e3,page:1}),n}function bs(e,t){let n=e.payload.page;return n===void 0||n===t}function wu(e,t,n){return Bo(e)?t.filter(o=>bs(o,n)):[...t]}function vu(e){return It(e.tapAction.type)?!0:e.elements.some(t=>t.kind==="tap"&&It(t.payload.action.type))}function It(e){return e==="nextPage"||e==="previousPage"||e==="showPage"||e==="playTour"}function ku(e,t,n){let o=N("tap"),i=o.payload,r=t==="nextPage";return i.name=r?"Next page tap area":"Prev page tap area",i.frame={x:r?.5:0,y:0,width:.5,height:1,rotationDegrees:0},i.action={type:t},n!==void 0&&(i.page=n),e.elements.unshift(o),i.id}function cn(e){return e.tapAction.type==="playTour"||e.elements.some(t=>t.kind==="tap"&&t.payload.action.type==="playTour")?"tour":"tap"}function un(e,t){let n=he(t);if(n<=1){delete e.pages;for(let i of e.elements)delete i.payload.page;return}for(let i of e.elements)i.payload.page!==void 0&&i.payload.page>n&&(i.payload.page=n);let o=e.pages;e.pages={count:n,mode:cn(e),dwell:(o?.dwell??[]).slice(0,n).map(te)}}function Cu(e){let t=Go(e).count;if(!(t>=Vo))return un(e,t+1),t+1}function Su(e){for(let t of e.elements)t.payload.page=1;return un(e,2),2}function Tu(e,t){let n=Go(e);if(t<1||t>n.count)return;for(let i of e.elements.filter(r=>r.payload.page===t).map(r=>r.payload.id))q(e,i);for(let i of e.elements){let r=i.payload.page;r!==void 0&&r>t&&(i.payload.page=r-1)}let o=[...n.dwell];t<=o.length&&o.splice(t-1,1),e.pages={count:n.count,mode:n.mode,dwell:o},un(e,n.count-1)}function Au(e,t,n){let o=e.pages;if(!Ae(o))return;let i=he(o.count),r=[];for(let a=0;a<i;a++)r.push(a<o.dwell.length?te(o.dwell[a]):void 0);for(t>=1&&t<=i&&(r[t-1]=n===void 0?void 0:te(n));r.length>0&&r[r.length-1]===void 0;)r.pop();o.dwell=r.map(a=>a??ft)}function ws(e,t){if(!(t<1||t>e.dwell.length))return te(e.dwell[t-1])}function Eu(e,t){let n=e.pages;Ae(n)&&(n.dwell=t===void 0?[]:mt(n).map(()=>te(t)))}function Fu(e){let t=mt(e).map(o=>ws(e,o)),n=t[0];return n!==void 0&&t.every(o=>o===n)?n:void 0}function Hu(e){return(e.tapAction.type==="playTour"?1:0)+e.elements.filter(n=>n.kind==="tap"&&n.payload.action.type==="playTour").length}function Lu(e,t,n,o){for(let i of e.elements)t.has(i.payload.id)&&(n?i.payload.page===void 0&&(i.payload.page=o):delete i.payload.page)}var _u="#30D158";function g(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function w(e,t=""){return typeof e=="string"?e:t}function v(e,t){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:t}function W(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function Ne(e){return e==null?void 0:v(e,0)}function A(e){return typeof e=="string"?e:void 0}function le(e,t,n){return typeof e=="string"&&t.includes(e)?e:n}function de(e,t,n){return t.some(([o])=>o===e)?e:n}var J=class extends Error{};function ee(e){if(typeof e.entityId!="string")throw new J("entityId is required");let t={entityId:e.entityId,displayName:w(e.displayName),domain:w(e.domain)};return typeof e.iconName=="string"&&(t.iconName=e.iconName),t}function Un(e){if(!g(e))return;let t={};return e.decimals!==void 0&&e.decimals!==null&&(t.decimals=v(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(t.multiply=v(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(t.offset=v(e.offset,0)),typeof e.prefix=="string"&&(t.prefix=e.prefix),typeof e.suffix=="string"&&(t.suffix=e.suffix),e.useEntityUnit===!0&&(t.useEntityUnit=!0),e.relativeTime===!0&&(t.relativeTime=!0),e.duration===!0&&(t.duration=!0),Fr.some(([n])=>n===e.timestamp)&&(t.timestamp=e.timestamp),e.hideMinutes===!0&&(t.hideMinutes=!0),e.hideDayPeriod===!0&&(t.hideDayPeriod=!0),e.showSeconds===!0&&(t.showSeconds=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(t.textCase=e.textCase),ve(t)?void 0:t}function ve(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&!e.duration&&e.timestamp===void 0&&!e.hideMinutes&&!e.hideDayPeriod&&!e.showSeconds&&e.textCase===void 0:!0}function Uo(e){let t=w(e.function,"count"),n=g(e.scope)?e.scope:{},o;if(n.kind==="entities")o={kind:"entities",entities:(Array.isArray(n.entities)?n.entities:[]).filter(g).map(ee)};else{let r=a=>Array.isArray(a)?a.filter(l=>typeof l=="string"):[];o={kind:"filter",domains:r(n.domains),areaIds:r(n.areaIds),labelIds:r(n.labelIds),floorIds:r(n.floorIds)}}let i={function:t,scope:o};if(g(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?i.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(i.stateFilter={kind:r,value:w(e.stateFilter.value)})}return typeof e.attribute=="string"&&(i.attribute=e.attribute),i}function jn(e){switch(e.kind){case"literal":return{kind:"literal",value:w(e.value)};case"entityState":return{kind:"entityState",...ee(e)};case"entityAttribute":return{kind:"entityAttribute",...ee(e),attribute:w(e.attribute)};case"entityAge":return{kind:"entityAge",...ee(e)};case"aggregate":return{kind:"aggregate",aggregate:Uo(g(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:A(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:w(e.value)};case"named":return{kind:"named",id:w(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:w(e.layer).toUpperCase(),stat:Er.some(([t])=>t===e.stat)?e.stat:"latest"};case"item":return{kind:"item",field:w(e.field)};case"listStat":return{kind:"listStat",layer:w(e.layer).toUpperCase(),stat:e.stat==="total"?"total":"count"};case"imageTime":return{kind:"imageTime",layer:w(e.layer).toUpperCase()};default:throw new J(`unknown value kind ${String(e.kind)}`)}}function F(e){if(!g(e))throw new J("value must be an object");if(g(e.kind)){let o={kind:jn(e.kind)},i=Un(e.format);return i&&(o.format=i),o}let t={kind:jn(e)},n=Un(e.format);return n&&(t.format=n),t}function jo(e){return g(e)?{x:v(e.x,.25),y:v(e.y,.25),width:v(e.width,.5),height:v(e.height,.5),rotationDegrees:v(e.rotationDegrees,0)}:{...ho}}function vs(e){if(!g(e))return{kind:"isOn"};let t=w(e.kind,"isOn"),n={kind:t};switch(t){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=g(e.value)?F(e.value):S("");break;case"between":case"timeBetween":n.value=g(e.value)?F(e.value):S(""),n.upper=g(e.upper)?F(e.upper):S("");break;case"matchesRegex":n.pattern=w(e.pattern);break;case"isOneOf":n.options=Array.isArray(e.options)?e.options.filter(o=>typeof o=="string"):[];break;default:break}return n}function Kn(e){if(!g(e))return{kind:"show"};let t=w(e.kind,"show"),n={kind:t};switch(t){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=g(e.value)?F(e.value):S(""),t==="setIcon"&&A(e.path)&&(n.path=A(e.path));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=v(e.number,0);break;case"setFontWeight":n.weight=A(e.weight)??"regular";break;case"setFontDesign":n.design=A(e.design)??"default";break;case"setFontWidth":n.width=it(A(e.width))??"standard";break;case"setItalic":n.italic=e.italic!==!1;break;default:break}return n}function Ko(e){return Array.isArray(e)?e.filter(g).map(t=>{let n={id:w(t.id).toUpperCase(),cases:(Array.isArray(t.cases)?t.cases:[]).filter(g).map(o=>{let i=g(o.when)?o.when:{};return{id:w(o.id).toUpperCase(),when:{join:i.join==="any"?"any":"all",tests:(Array.isArray(i.tests)?i.tests:[]).filter(g).map(r=>({id:w(r.id).toUpperCase(),value:g(r.value)?F(r.value):S(""),comparison:vs(r.comparison)}))},then:(Array.isArray(o.then)?o.then:[]).map(Kn)}})};return Array.isArray(t.otherwise)&&(n.otherwise=t.otherwise.map(Kn)),typeof t.partId=="string"&&t.partId!==""&&(n.partId=t.partId.toUpperCase()),n}):[]}function ks(e,t){return{baseColorHex:g(e)?w(e.baseColorHex,t):t}}var Jn=.5;function Cs(e){if(!(typeof e!="number"||!Number.isFinite(e)))return Math.min(Jn,Math.max(-Jn,e))}function Ve(e){return Array.isArray(e)?e.filter(g).map(t=>{let n={id:w(t.id,M()),upTo:v(t.upTo,0),colorHex:w(t.colorHex,"#FFFFFF")};return typeof t.fillColorHex=="string"&&(n.fillColorHex=t.fillColorHex),typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex),n}):[]}function De(e){let t={id:e.id,upTo:b(e.upTo),colorHex:e.colorHex};return e.fillColorHex!==void 0&&(t.fillColorHex=e.fillColorHex),e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t}function Ss(e){return Array.isArray(e)?e.filter(g).map(t=>{let n={id:w(t.id,M()).toUpperCase(),value:g(t.value)?F(t.value):S("")};if(g(t.icon)&&(n.icon=F(t.icon)),g(t.iconPaths)){let h=Object.entries(t.iconPaths).filter(p=>typeof p[1]=="string"&&p[1]!=="");h.length>0&&(n.iconPaths=Object.fromEntries(h))}typeof t.colorHex=="string"&&(n.colorHex=t.colorHex);let o=A(t.fontWeight);(o==="regular"||o==="medium"||o==="semibold"||o==="bold")&&(n.fontWeight=o),typeof t.fontSize=="number"&&(n.fontSize=t.fontSize);let i=A(t.fontDesign);(i==="default"||i==="rounded"||i==="monospaced"||i==="serif")&&(n.fontDesign=i);let r=it(A(t.fontWidth));r!==void 0&&(n.fontWidth=r),typeof t.italic=="boolean"&&(n.italic=t.italic);let a=Cs(t.tracking);a!==void 0&&a!==0&&(n.tracking=a),A(t.coloring)==="bands"&&(n.coloring="bands");let l=Ve(t.bands);l.length>0&&(n.bands=l);let s=w(t.bandAboveColorHex,G);return s!==G&&(n.bandAboveColorHex=s),n}):[]}function Ts(e){if(Array.isArray(e.bands))return Ve(e.bands);if(typeof e.bandLowerBound!="number")return[];let t=g(e.colorSlot)?w(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:M(),upTo:e.bandLowerBound,colorHex:w(e.bandLowColorHex,ya)},{id:M(),upTo:v(e.bandUpperBound,100),colorHex:t}]}function As(e){return Array.isArray(e)?e.filter(g).map(t=>({id:w(t.id,M()).toUpperCase(),match:w(t.match,""),colorHex:w(t.colorHex,ut)})):[]}function Es(e){if(!g(e))return;let t=[];for(let n of Array.isArray(e.entities)?e.entities:[]){let o=typeof n=="string"?n.trim():"";o!==""&&!t.includes(o)&&t.push(o)}if(t.length!==0)return{entities:t,combine:e.combine==="all"?"all":ct}}function Rt(e){let t=g(e)?e:{},n={entityId:w(t.entityId),displayName:w(t.displayName),domain:w(t.domain)};return typeof t.iconName=="string"&&(n.iconName=t.iconName),n}function qn(e){return Array.isArray(e)?e.map(Rt).filter(t=>t.entityId!==""):[]}function Fs(e){let t=g(e)?e:{},n=o=>Array.isArray(o)?o.filter(i=>typeof i=="string"):[];switch(t.kind){case"attribute":return{kind:"attribute",...Rt(t),attribute:w(t.attribute)};case"template":return{kind:"template",value:w(t.value)};case"calendar":return{kind:"calendar",entities:qn(t.entities),hours:Te(t.hours)};case"todo":return{kind:"todo",entities:qn(t.entities),status:de(A(t.status),Xa,"open"),sort:de(A(t.sort),Ya,"list")};case"forecast":return{kind:"forecast",...Rt(t),type:de(A(t.type),Za,"hourly")};default:{let o=Uo({scope:t.scope,stateFilter:t.stateFilter}),i={kind:"entities",scope:o.scope,sort:de(A(t.sort),qa,"name"),descending:t.descending===!0,attributes:n(t.attributes)},r=w(t.deviceClass).trim();return r!==""&&(i.deviceClass=r),o.stateFilter&&(i.stateFilter=o.stateFilter),i}}}function Hs(e){if(g(e))return{colorHex:w(e.colorHex,mo),radius:Qr(v(e.radius,0)),dx:zn(v(e.dx,0)),dy:zn(v(e.dy,0))}}function $(e,t){if(typeof e.id!="string")throw new J("element id is required");let n={id:e.id.toUpperCase(),colorSlot:ks(e.colorSlot,t),rules:Ko(e.rules),frame:jo(e.frame),isHidden:e.isHidden===!0},o=ea(v(e.opacity,1));o!==1&&(n.opacity=o);let i=Hs(e.shadow);return i!==void 0&&(n.shadow=i),n}function Ls(e){let t=Jo(e),n=xs(e.payload.page);return n!==void 0&&(t.payload.page=n),t}function Jo(e){let t=_s(e),n=e.payload;return typeof n.groupId=="string"&&n.groupId!==""&&(t.payload.groupId=n.groupId.toUpperCase()),typeof n.name=="string"&&n.name!==""&&(t.payload.name=n.name),n.accentGroup==="accent"&&(t.payload.accentGroup="accent"),t}function _s(e){if(!g(e)||!g(e.payload))throw new J("element must have a payload");let t=e.payload;switch(e.kind){case"text":{let n={...$(t,"#FFFFFF"),value:g(t.value)?F(t.value):S(""),fontSize:v(t.fontSize,14),fontWeight:A(t.fontWeight)??"regular"};t.countdown===!0&&(n.countdown=!0),t.monospacedDigits===!0&&(n.monospacedDigits=!0);let o=typeof t.lineLimit=="number"?Math.round(t.lineLimit):1,i=Math.min(ur,Math.max(1,o));i>1&&(n.lineLimit=i);let r=A(t.fontDesign);(r==="rounded"||r==="monospaced"||r==="serif")&&(n.fontDesign=r);let a=it(A(t.fontWidth));a!==void 0&&a!=="standard"&&(n.fontWidth=a),t.italic===!0&&(n.italic=!0);let l=pr(v(t.minimumScale,Oe));l!==Oe&&(n.minimumScale=l);let s=A(t.alignment);(s==="leading"||s==="trailing")&&(n.alignment=s),A(t.coloring)==="bands"&&(n.coloring="bands");let h=Ve(t.bands);h.length>0&&(n.bands=h);let p=w(t.bandAboveColorHex,G);p!==G&&(n.bandAboveColorHex=p);let c=A(t.highlight);(c==="highest"||c==="lowest"||c==="both")&&(n.highlight=c);let d=w(t.highColorHex,xe);d!==xe&&(n.highColorHex=d);let u=w(t.lowColorHex,be);u!==be&&(n.lowColorHex=u);let f=Ss(t.parts);f.length>0&&(n.parts=f);let m=Jr(t.arc);return m!==void 0&&(n.arc=m),qe(t,n),{kind:"text",payload:n}}case"icon":{let n={...$(t,"#FFFFFF"),symbol:g(t.symbol)?F(t.symbol):S("lightbulb"),size:v(t.size,14)},o=A(t.path);o!==void 0&&o!==""&&(n.path=o);let i=qt(A(t.viewBox));return i!==void 0&&(n.viewBox=i),Pn(t,n),qe(t,n),{kind:"icon",payload:n}}case"gauge":{let n={...$(t,"#FFFFFF"),value:g(t.value)?F(t.value):S("50"),minValue:v(t.minValue,0),maxValue:v(t.maxValue,100),style:A(t.style)??"arc",lineWidth:v(t.lineWidth,4),trackColorHex:w(t.trackColorHex,"#FFFFFF40"),coloring:A(t.coloring)??"uniform",bands:Ve(t.bands),bandAboveColorHex:w(t.bandAboveColorHex,G),thresholdColorHex:w(t.thresholdColorHex,Xt)},o=Ne(t.thresholdValue);o!==void 0&&(n.thresholdValue=o),g(t.total)&&(n.total=F(t.total)),g(t.minSource)&&(n.minSource=F(t.minSource)),g(t.maxSource)&&(n.maxSource=F(t.maxSource));let i=Re(t.fill);i!==void 0&&(n.fill=i);let r=ca(t.ticks);r!==void 0&&(n.ticks=r);let a=pa(t.labels);return a!==void 0&&(n.labels=a),{kind:"gauge",payload:n}}case"chart":return{kind:"chart",payload:{...$(t,"#FFFFFF"),value:g(t.value)?F(t.value):S("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(v(t.historyMinutes,0))),historyPoints:Math.round(v(t.historyPoints,24)),source:de(A(t.source),Sr,Gt),statPeriod:de(A(t.statPeriod),Tr,Wt),statType:de(A(t.statType),Ar,Ut),style:le(t.style,["bars","line","area"],"bars"),limit:Math.max(0,Math.round(v(t.limit,0))),takeFromEnd:t.takeFromEnd===!0,scale:le(t.scale,["auto","fixed"],"auto"),minValue:v(t.minValue,0),maxValue:v(t.maxValue,100),baseline:le(t.baseline,["lowest","zero"],"lowest"),barGap:v(t.barGap,1.5),lineWidth:v(t.lineWidth,2),highlight:le(t.highlight,["none","highest","lowest","both"],"none"),highColorHex:w(t.highColorHex,xe),lowColorHex:w(t.lowColorHex,be),marker:typeof t.marker=="string"?le(t.marker,["none","dot","pointer"],"dot"):"pointer",...On(t.highMarker)?{highMarker:t.highMarker}:{},...On(t.lowMarker)?{lowMarker:t.lowMarker}:{},coloring:le(t.coloring,["uniform","bands"],"uniform"),bands:Ts(t),bandAboveColorHex:w(t.bandHighColorHex,w(t.bandAboveColorHex,G)),fillBands:t.fillBands===!0,...Rn(t.curve)!=="straight"?{curve:Rn(t.curve)}:{},...At(t.fillStyle)!=="flat"?{fillStyle:At(t.fillStyle)}:{},...typeof t.fillColorHex=="string"?{fillColorHex:t.fillColorHex}:{},...Re(t.areaFill)!==void 0?{areaFill:Re(t.areaFill)}:{},...Ht(t.barRadius)!==Bt?{barRadius:Ht(t.barRadius)}:{},...Lt(t.barCorners)!=="all"?{barCorners:Lt(t.barCorners)}:{},...typeof t.barBorderWidth=="number"&&Number.isFinite(t.barBorderWidth)&&t.barBorderWidth!==0?{barBorderWidth:t.barBorderWidth}:{},...typeof t.barBorderColorHex=="string"?{barBorderColorHex:t.barBorderColorHex}:{},...t.barBorderOpenBase===!0?{barBorderOpenBase:!0}:{},...typeof t.bandAboveFillColorHex=="string"?{bandAboveFillColorHex:t.bandAboveFillColorHex}:{},...typeof t.bandAboveBorderColorHex=="string"?{bandAboveBorderColorHex:t.bandAboveBorderColorHex}:{},...Et(t.pointDots)!=="none"?{pointDots:Et(t.pointDots)}:{},...Pe(t.pointDotSize)!==void 0?{pointDotSize:Pe(t.pointDotSize)}:{},...typeof t.pointDotColorHex=="string"?{pointDotColorHex:t.pointDotColorHex}:{},...Ft(t.gridLines)!==0?{gridLines:Ft(t.gridLines)}:{},...Ce(ye(t.gridColorHex),rt)?{}:{gridColorHex:ye(t.gridColorHex)},...t.zeroLine===!0?{zeroLine:!0}:{},..._t(t.smoothing)!==void 0?{smoothing:_t(t.smoothing)}:{},...t.gaps===!0?{gaps:!0}:{},...typeof t.thresholdValue=="number"&&Number.isFinite(t.thresholdValue)?{thresholdValue:t.thresholdValue}:{},thresholdColorHex:w(t.thresholdColorHex,Yt),...g(t.nowIndex)?{nowIndex:F(t.nowIndex)}:{},nowColorHex:w(t.nowColorHex,Zt),...t.drawsThreshold===!1?{drawsThreshold:!1}:{},...t.drawsNowLine===!1?{drawsNowLine:!1}:{},...t.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{},...A(t.scaleFrom)!==void 0?{scaleFrom:A(t.scaleFrom)}:{},timeLabelCount:we(t.timeLabelCount),labelSize:v(t.labelSize,X),labelColorHex:w(t.labelColorHex,Y),labelsAbove:t.labelsAbove===!0,hourCycle:St(t.hourCycle),minutes:Tt(t.minutes)}};case"timeline":{let{colorSlot:n,...o}=$(t,"#FFFFFF"),i=Es(t.aggregate);return{kind:"timeline",payload:{...o,value:g(t.value)?F(t.value):S(""),...i!==void 0?{aggregate:i}:{},historyMinutes:Math.max(1,Math.round(v(t.historyMinutes,rn))),bands:As(t.bands),otherColorHex:w(t.otherColorHex,ut),gap:Math.min(za,Math.max(0,v(t.gap,0))),cornerRadius:Math.max(0,v(t.cornerRadius,So)),timeLabelCount:Ma(t),labelSize:v(t.labelSize,X),labelColorHex:w(t.labelColorHex,Y),labelsAbove:t.labelsAbove===!0,hourCycle:St(t.hourCycle),minutes:Tt(t.minutes),...t.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{}}}}case"shape":{let n={...$(t,"#FFFFFF33"),kind:A(t.kind)??"roundedRectangle",cornerRadius:v(t.cornerRadius,6),thickness:v(t.thickness,1),borderWidth:v(t.borderWidth,1)};typeof t.borderColorHex=="string"&&(n.borderColorHex=t.borderColorHex);let o=Re(t.fill);return o!==void 0&&(n.fill=o),Pn(t,n),qe(t,n),{kind:"shape",payload:n}}case"image":{let{colorSlot:n,...o}=$(t,"#FFFFFF"),i={...o,entity:g(t.entity)?ee(t.entity):{entityId:"",displayName:"",domain:""},source:t.source==="entityPicture"?"entityPicture":t.source==="inline"?"inline":"camera",contentMode:t.contentMode==="fit"?"fit":"fill",zoom:v(t.zoom,1),panX:v(t.panX,0),panY:v(t.panY,0),cornerRadius:v(t.cornerRadius,Lo),timestampCorner:Ua.includes(t.timestampCorner)?t.timestampCorner:"topLeading",timestampSize:v(t.timestampSize,ht)},r=A(t.data);r!==void 0&&r!==""&&(i.data=r),t.format==="jpeg"&&(i.format="jpeg"),t.timestamp===!0&&(i.timestamp=!0);let a=Ne(t.timestampX),l=Ne(t.timestampY);return a!==void 0&&l!==void 0&&Number.isFinite(a)&&Number.isFinite(l)&&(i.timestampX=W(a),i.timestampY=W(l)),qe(t,i),{kind:"image",payload:i}}case"tap":{let{colorSlot:n,...o}=$(t,"#FFFFFF"),i={...o,action:g(t.action)?pn(t.action):{type:"refresh"}};return typeof t.openPageId=="string"&&(i.openPageId=t.openPageId),typeof t.openPageName=="string"&&(i.openPageName=t.openPageName),typeof t.attachedTo=="string"&&(i.attachedTo=t.attachedTo.toUpperCase()),t.confirm===!0&&(i.confirm=!0),{kind:"tap",payload:i}}case"chartTimes":{let{colorSlot:n,...o}=$(t,"#FFFFFF");return{kind:"chartTimes",payload:{...o,chart:w(t.chart).toUpperCase(),timeLabelCount:we(t.timeLabelCount),labelSize:v(t.labelSize,X),labelColorHex:w(t.labelColorHex,Y),hourCycle:St(t.hourCycle),minutes:Tt(t.minutes),..._a(t)}}}case"imageTime":{let{colorSlot:n,...o}=$(t,"#FFFFFF");return{kind:"imageTime",payload:{...o,image:w(t.image).toUpperCase()}}}case"chartDots":{let{colorSlot:n,...o}=$(t,"#FFFFFF"),i=Pe(t.size);return{kind:"chartDots",payload:{...o,chart:w(t.chart).toUpperCase(),dots:co(t.dots),...i!==void 0?{size:i}:{},...typeof t.colorHex=="string"?{colorHex:t.colorHex}:{}}}}case"chartGrid":{let{colorSlot:n,...o}=$(t,"#FFFFFF");return{kind:"chartGrid",payload:{...o,chart:w(t.chart).toUpperCase(),lines:uo(t.lines),colorHex:ye(t.colorHex),thickness:po(t.thickness)}}}case"list":{let{colorSlot:n,...o}=$(t,"#FFFFFF"),i=(Array.isArray(t.template)?t.template:[]).filter(r=>g(r)&&!Po.includes(String(r.kind))).map(r=>Jo(r));return{kind:"list",payload:{...o,source:Fs(t.source),rows:Se(t.rows),direction:t.direction==="across"?"across":"down",columns:dn(t.columns),gap:No(t.gap),template:i}}}default:throw new J(`unknown element kind ${String(e.kind)}`)}}function Xn(e){let t=g(e)?e:{},n={};if(g(t.placements))for(let[r,a]of Object.entries(t.placements)){if(!g(a))continue;let l={frame:jo(a.frame),isHidden:a.isHidden===!0},s=Ne(a.size);s!==void 0&&(l.size=s),n[r.toUpperCase()]=l}let o={placements:n,cornerBodyShape:t.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:v(t.borderWidth,2),rules:Ko(t.rules)};if(g(t.bezelText)&&(o.bezelText=F(t.bezelText)),t.bezelCountdown===!0&&(o.bezelCountdown=!0),g(t.curvedText)&&(o.curvedText=F(t.curvedText)),typeof t.curvedColorHex=="string"&&(o.curvedColorHex=t.curvedColorHex),g(t.parkedCurvedText)&&(o.parkedCurvedText=F(t.parkedCurvedText)),typeof t.parkedCurvedColorHex=="string"&&(o.parkedCurvedColorHex=t.parkedCurvedColorHex),g(t.bezelGauge)){let r=t.bezelGauge,a={value:g(r.value)?F(r.value):S("50"),minValue:v(r.minValue,0),maxValue:v(r.maxValue,100),colorHexes:Array.isArray(r.colorHexes)&&r.colorHexes.length>0?r.colorHexes.filter(l=>typeof l=="string"):["#34C759","#FFCC00","#FF3B30"]};g(r.minLabel)&&(a.minLabel=F(r.minLabel)),g(r.maxLabel)&&(a.maxLabel=F(r.maxLabel)),o.bezelGauge=a}typeof t.backgroundColorHex=="string"&&(o.backgroundColorHex=t.backgroundColorHex);let i=Re(t.backgroundFill);return i!==void 0&&(o.backgroundFill=i),typeof t.borderColorHex=="string"&&(o.borderColorHex=t.borderColorHex),o}function Ms(e){let t={};if(Array.isArray(e))for(let n=0;n+1<e.length;n+=2){let o=e[n];typeof o=="string"&&(t[o]=Xn(e[n+1]))}else if(g(e))for(let[n,o]of Object.entries(e))t[n]=Xn(o);return t}function Is(e){let t={value:g(e.value)?F(e.value):S("")};if(typeof e.label=="string"&&(t.label=e.label),typeof e.symbol=="string"&&(t.symbol=e.symbol),e.countdown===!0&&(t.countdown=!0),Array.isArray(e.parts)){let n=e.parts.filter(g).map(o=>{let i={id:typeof o.id=="string"&&o.id!==""?o.id.toUpperCase():M(),value:g(o.value)?F(o.value):S("")};return typeof o.symbol=="string"&&o.symbol!==""&&(i.symbol=o.symbol),i});n.length>0&&(t.parts=n)}return t}function Rs(e){let t={kind:e.kind==="button"?"button":"toggle",title:g(e.title)?F(e.title):S(""),symbol:w(e.symbol,Oo),coloring:e.coloring==="bands"?"bands":"uniform",bands:Ve(e.bands),action:pn(e.action)};return g(e.valueLabel)&&(t.valueLabel=F(e.valueLabel)),g(e.state)&&(t.state=F(e.state)),typeof e.symbolOff=="string"&&(t.symbolOff=e.symbolOff),typeof e.tintColorHex=="string"&&(t.tintColorHex=e.tintColorHex),typeof e.bandAboveColorHex=="string"&&(t.bandAboveColorHex=e.bandAboveColorHex),g(e.status)&&(t.status=F(e.status)),t}function Pt(e){if(!Array.isArray(e))return[];let t=[];for(let n of e){if(typeof n!="string")continue;let o=n.trim().toUpperCase();o===""||t.includes(o)||t.push(o)}return t}function Ps(e){if(!g(e))return;let t={};for(let[n,o]of Object.entries(e)){if(!Array.isArray(o))continue;let i=n.trim().toUpperCase();i===""||i in t||(t[i]=Pt(o))}return Object.keys(t).length>0?t:void 0}function pn(e){if(!g(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":case"nextPage":case"previousPage":case"playTour":return{type:e.type};case"refresh":return Array.isArray(e.layerIds)?{type:"refresh",layerIds:Pt(e.layerIds)}:{type:"refresh"};case"refreshAll":{let t={type:"refreshAll"};if(e.allPlaced===!0)return t.allPlaced=!0,t;let n=Pt(e.targets);n.length>0&&(t.targets=n);let o=Ps(e.targetLayers);return o!==void 0&&(t.targetLayers=o),t}case"showPage":return{type:"showPage",page:typeof e.page=="number"&&Number.isInteger(e.page)&&e.page>=1?e.page:1};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":case"openEntity":return{type:e.type,...ee(e)};case"callService":{let t={type:"callService",serviceDomain:typeof e.serviceDomain=="string"?e.serviceDomain:"",serviceName:typeof e.serviceName=="string"?e.serviceName:""};return typeof e.serviceDataJSON=="string"&&e.serviceDataJSON.trim()!==""&&(t.serviceDataJSON=e.serviceDataJSON),typeof e.entityId=="string"&&e.entityId!==""&&(t.target=ee(e)),t}default:return{type:"none"}}}function Mu(e){if(!g(e))throw new J("config must be an object");for(let l of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(l in e))throw new J(`${l} is required`);let t=(Array.isArray(e.values)?e.values:[]).filter(g).map(l=>({id:w(l.id).toUpperCase(),name:w(l.name),value:g(l.value)?F(l.value):S("")})),n=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(g).map(l=>l.kind==="template"?{kind:"template",value:w(l.value)}:l.kind==="entity"?{kind:"entity",...ee(l)}:null).filter(l=>l!==null),o={schemaVersion:v(e.schemaVersion,1),id:w(e.id).toUpperCase(),name:w(e.name,"Custom"),values:t,slotIndex:v(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Ls),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(l=>typeof l=="string"),perFamily:Ms(e.perFamily),dataSources:n,tapAction:pn(e.tapAction)};g(e.inline)&&(o.inline=Is(e.inline)),g(e.control)&&(o.control=Rs(e.control));let i=Ne(e.refreshMinutes);i!==void 0&&(o.refreshMinutes=i),typeof e.openPageId=="string"&&(o.openPageId=e.openPageId),typeof e.openPageName=="string"&&(o.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(o.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(o.successFlashColorHex=e.successFlashColorHex),e.httpShowResult===!0&&(o.httpShowResult=!0),e.hidden===!0&&(o.hidden=!0),typeof e.linkId=="string"&&e.linkId!==""&&(o.linkId=e.linkId.toUpperCase()),typeof e.legacyControlEntityId=="string"&&e.legacyControlEntityId!==""&&(o.legacyControlEntityId=e.legacyControlEntityId);let r=gs(e.pages);if(r!==void 0&&(o.pages=r),Array.isArray(e.groups)){let l=e.groups.filter(g).filter(s=>typeof s.id=="string").map(s=>({id:w(s.id).toUpperCase(),name:w(s.name,"Group"),locked:s.locked!==!1,...typeof s.parentId=="string"&&s.parentId!==""?{parentId:s.parentId.toUpperCase()}:{}}));l.length>0&&(o.groups=l)}let a=kt(e.notes);return a!==void 0&&(o.notes=a),il(o,Array.isArray(e.elements)?e.elements:[]),B(o),o}function Ns(e,t){let n=t?.kind;if(!n||n.kind!=="chartStat")return;let o=e.elements.find(i=>i.payload.id===n.layer);return o?.kind==="chart"?o:void 0}function qo(e,t){return e.elements.filter(n=>n.kind==="text"&&n.payload.value.kind.kind==="chartStat"&&n.payload.value.kind.layer===t)}function oe(e,t,n){Xo(e,t,n);let o=yn(e,t.payload.id);if(o){wl(e,n,o.id);return}let i=ui(e,[t.payload.id,n]),r=e.groups?.find(a=>a.id===i);r&&(r.locked=!1)}function Xo(e,t,n){let o=e.elements.find(i=>i.payload.id===n);o&&(t.payload.page===void 0?delete o.payload.page:o.payload.page=t.payload.page)}var Yo={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1},trend:{x:.85,y:0},delta:{x:.5,y:0},sum:{x:.2,y:0},first:{x:.65,y:1}};function Zo(e,t,n,o){let i=_.rectangular,r=Math.min(1,(o*n*.62+4)/i.width),a=Math.min(1,n*1.3/i.height),l=e.x+t.x*e.width-t.x*r,s=e.y+t.y*e.height-t.y*a;return{x:Math.max(0,Math.min(1-r,l)),y:Math.max(0,Math.min(1-a,s)),width:r,height:a,rotationDegrees:0}}function Iu(e,t,n){let o=e.elements.find(h=>h.payload.id===t);if(!o||o.kind!=="chart")return;let i=N("text"),r=n==="latest"?10:8,a={kind:{kind:"chartStat",layer:t,stat:n}};(n==="latest"||n==="delta"||n==="sum")&&(a.format={useEntityUnit:!0}),i.payload.value=a,i.payload.fontSize=r,i.payload.fontWeight="medium",i.payload.colorSlot={baseColorHex:n==="latest"?"#FFFFFF":"#FFFFFF99"};let l=n==="trend"?2:a.format?.useEntityUnit?7:4;i.payload.frame=Zo(o.payload.frame,Yo[n],r,l);let s=e.elements.findIndex(h=>h.payload.id===t);return e.elements.splice(s+1,0,i),oe(e,o,i.payload.id),i.payload.id}var hn={highest:"arrowtriangle.up.fill",lowest:"circle.fill",now:"arrowtriangle.down.fill",first:"circle.fill",latest:"circle.fill",threshold:"circle.fill",zero:"circle.fill"},ze=6,Ds={"\u25B2":"arrowtriangle.up.fill","\u25BC":"arrowtriangle.down.fill","\u25CF":"circle.fill","\u25C6":"diamond.fill"};function Qo(e,t){let n=(o,i)=>o!==void 0&&o!==i?o:void 0;return t==="highest"?n(e.payload.highColorHex,xe)??"#FFD60A":t==="lowest"?n(e.payload.lowColorHex,be)??"#FF453A":"#FFFFFF"}function fn(e){e.nowIndex===void 0&&(e.nowIndex={kind:{kind:"time",timeField:"hour"}},e.drawsNowLine=!1)}function ke(e,t){return e.elements.filter(n=>n.payload.chartAnchor?.layer===t)}function zs(e,t,n,o="above"){let i=e.elements.find(l=>l.payload.id===t);if(!i||i.kind!=="chart")return;n==="now"&&fn(i.payload);let r=N("icon");r.payload.symbol=S(hn[n]),r.payload.size=ze,r.payload.colorSlot={baseColorHex:Qo(i,n)},r.payload.frame=Nt(ze),r.payload.chartAnchor={layer:t,at:n,place:o};let a=e.elements.findIndex(l=>l.payload.id===t);return e.elements.splice(a+1,0,r),oe(e,i,r.payload.id),r.payload.id}function Ru(e,t){let n=e.elements.findIndex(c=>c.payload.id===t),o=e.elements[n];if(!o||o.kind!=="text"||o.payload.chartAnchor===void 0)return;let i=o.payload,r=i.chartAnchor,a=c=>{let d=yo(c);return d===void 0?void 0:Ds[d.trim()]},l=new Set(ki.icon),s=c=>c.flatMap(d=>{if(d.kind==="setText"){let u=d.value===void 0?void 0:a(d.value);return u===void 0?[]:[{kind:"setIcon",value:S(u)}]}return l.has(fo[d.kind])?[d]:[]}),h=i.rules.filter(c=>c.partId===void 0).map(c=>({...c,cases:c.cases.map(d=>({...d,then:s(d.then)})),...c.otherwise!==void 0?{otherwise:s(c.otherwise)}:{}})),p=N("icon");p.payload={...p.payload,id:i.id,colorSlot:i.colorSlot,rules:h,frame:i.frame,isHidden:i.isHidden,...i.groupId!==void 0?{groupId:i.groupId}:{},...i.name!==void 0?{name:i.name}:{},chartAnchor:r,symbol:S(a(i.value)??hn[r.at]),size:i.fontSize},e.elements[n]=p}var $s=2;function Pu(e,t){let n=e.elements.findIndex(d=>d.payload.id===t),o=e.elements[n];if(!o||o.kind!=="text"&&o.kind!=="icon"||o.payload.chartAnchor===void 0)return;let i=o.payload,r=o.kind==="text"?o.payload.fontSize:o.payload.size,a=Math.max(12,r*$s),l=new Set(ki.image),s=d=>d.filter(u=>l.has(fo[u.kind])),h=i.rules.filter(d=>d.partId===void 0).map(d=>({...d,cases:d.cases.map(u=>({...u,then:s(u.then)})),...d.otherwise!==void 0?{otherwise:s(d.otherwise)}:{}})),p=(d,u)=>({...d,width:Math.min(1,a/u.width),height:Math.min(1,a/u.height)}),c=N("image");c.payload={...c.payload,id:i.id,rules:h,frame:p(i.frame,_.rectangular),isHidden:i.isHidden,...i.groupId!==void 0?{groupId:i.groupId}:{},...i.name!==void 0?{name:i.name}:{},...i.opacity!==void 0?{opacity:i.opacity}:{},...i.page!==void 0?{page:i.page}:{},chartAnchor:i.chartAnchor,entity:{entityId:"",displayName:"",domain:""},source:"inline",contentMode:"fit",cornerRadius:0},e.elements[n]=c;for(let d of H){let u=e.perFamily[d]?.placements[t];u&&(u.frame=p(u.frame,_[d]))}}function Nu(e,t){let n=e.elements.findIndex(h=>h.payload.id===t),o=e.elements[n];if(!o||o.kind!=="image"||o.payload.chartAnchor===void 0)return;let i=o.payload,r=i.chartAnchor,a=e.elements.find(h=>h.payload.id===r.layer),l=N("icon");l.payload={...l.payload,id:i.id,rules:i.rules.filter(h=>h.partId===void 0),frame:{...i.frame,...Nt(ze),x:i.frame.x,y:i.frame.y},isHidden:i.isHidden,...i.groupId!==void 0?{groupId:i.groupId}:{},...i.name!==void 0?{name:i.name}:{},...i.opacity!==void 0?{opacity:i.opacity}:{},...i.page!==void 0?{page:i.page}:{},chartAnchor:r,symbol:S(hn[r.at]),size:ze,...a?.kind==="chart"?{colorSlot:{baseColorHex:Qo(a,r.at)}}:{}},e.elements[n]=l;let s=Nt(ze);for(let h of H){let p=e.perFamily[h]?.placements[t];if(!p)continue;let c=_[h];p.frame={...p.frame,width:Math.min(1,s.width*_.rectangular.width/c.width),height:Math.min(1,s.height*_.rectangular.height/c.height)}}}function Nt(e){let t=_.rectangular;return{x:0,y:0,width:Math.min(1,e*1.2/t.width),height:Math.min(1,e*1.3/t.height),rotationDegrees:0}}function Qe(e,t,n){let o=e.elements.find(l=>l.payload.id===t);if(!o||o.kind!=="chart")return;let i=o.payload;n==="now"&&fn(i);let r=N("shape");r.payload.kind="line",r.payload.thickness=1,r.payload.borderWidth=0,r.payload.colorSlot={baseColorHex:n==="now"?i.nowColorHex:i.thresholdColorHex},r.payload.frame=ei(i.frame,n),r.payload.chartAnchor={layer:t,at:n,place:"through"};let a=e.elements.findIndex(l=>l.payload.id===t);return e.elements.splice(a+1,0,r),oe(e,o,r.payload.id),n==="now"?i.drawsNowLine=!1:i.drawsThreshold=!1,r.payload.id}function ei(e,t){let n=_.rectangular,o=3;return t==="now"?{...e,width:Math.min(e.width,o/n.width),rotationDegrees:0}:{...e,height:Math.min(e.height,o/n.height),rotationDegrees:0}}function Os(e,t){return e.elements.filter(n=>n.kind==="chartTimes"&&n.payload.chart===t)}function ti(e,t){let n=e.elements.find(a=>a.payload.id===t);if(!n||n.kind!=="chart"&&n.kind!=="timeline")return;let o=n.payload,i=N("chartTimes");i.payload.chart=t,i.payload.timeLabelCount=o.timeLabelCount>0?we(o.timeLabelCount):To,i.payload.labelSize=o.labelSize,i.payload.labelColorHex=o.labelColorHex,i.payload.hourCycle=o.hourCycle,i.payload.minutes=o.minutes,i.payload.frame=ol(o.frame,o.labelSize,o.labelsAbove);let r=e.elements.findIndex(a=>a.payload.id===t);return e.elements.splice(r+1,0,i),oe(e,n,i.payload.id),o.drawsTimeLabels=!1,i.payload.id}function Vs(e,t){return e.elements.filter(n=>n.kind==="imageTime"&&n.payload.image===t)}function Bs(e){let t=Math.min(40,Math.max(4,e));return{w:8*t*.578+t*.89,h:t*1.25}}function ni(e,t){return Math.max(0,Math.min(e/(8*.578+.89),t/1.25))}var mn="Timestamp",Gs="#0000008C";function et(e,t){let n=e?.kind;return n?.kind==="imageTime"&&(t===void 0||n.layer.toUpperCase()===t.toUpperCase())}function Ws(e,t){return e.elements.filter(n=>n.kind==="text"&&(et(n.payload.value,t)||(n.payload.parts??[]).some(o=>et(o.value,t))))}function Us(e,t){let n=new Set;for(let o of Vs(e,t))n.add(o.payload.id);for(let o of Ws(e,t))for(let i of oi(e,o))n.add(i);return e.elements.filter(o=>n.has(o.payload.id))}function oi(e,t){let n=t.payload.groupId;if(n===void 0)return[t.payload.id];let o=di(e,n);return o.every(r=>r.kind==="shape"||r.kind==="text"&&(et(r.payload.value)||(r.payload.parts??[]).some(a=>et(a.value))))?o.map(r=>r.payload.id):[t.payload.id]}function Du(e,t){let n=e.elements.find(i=>i.payload.id===t);if(!n)return;let o=n.kind==="text"?oi(e,n):[t];for(let i of o)q(e,i)}function ii(e,t,n){let o=N("shape");o.payload.kind="capsule",o.payload.colorSlot={baseColorHex:Gs},o.payload.borderWidth=0,o.payload.frame={...t};let i=N("text");return i.payload.value={kind:{kind:"imageTime",layer:e},format:{timestamp:"clock",showSeconds:!0,hideDayPeriod:!0}},i.payload.colorSlot={baseColorHex:"#FFFFFF"},i.payload.fontWeight="semibold",i.payload.fontDesign="rounded",i.payload.fontSize=Math.round(Math.max(4,n)*10)/10,i.payload.frame={...t},[o,i]}function js(e){let t=e.payload.name?.trim();if(t)return t;if(e.kind!=="image")return"Picture";let n=e.payload.entity,o=n.displayName.trim()||n.entityId.trim();return o!==""&&e.payload.source!=="inline"?o:e.payload.source==="camera"?"Camera":"Picture"}function ri(e,t){let n=P(e,t.payload.groupId);if(n)return n.id;let o={id:M(),name:js(t),locked:!1};return e.groups=[...e.groups??[],o],t.payload.groupId=o.id,o.id}function Dt(e,t,n,o=mn,i){if(e.elements.splice(n,0,...t),i!==void 0)for(let r of t)r.payload.groupId=i;return ui(e,t.map(r=>r.payload.id),o)}function ai(e,t,n,o){let i=ri(e,t);return Dt(e,n,e.elements.indexOf(t)+1,o,i)}function Ks(e){for(let t of[...e.groups??[]]){if(t.parentId!==void 0||t.name!==mn||!t.locked||yl(e,t.id).length>0)continue;let n=di(e,t.id);if(n.length!==2)continue;let o=n.find(m=>m.kind==="shape"&&m.payload.kind==="capsule"),i=n.find(m=>m.kind==="text"&&m.payload.value.kind.kind==="imageTime");if(!o||!i||i.kind!=="text"||i.payload.value.kind.kind!=="imageTime")continue;let r=i.payload.value.kind.layer.toUpperCase(),a=e.elements.find(m=>m.kind==="image"&&m.payload.id.toUpperCase()===r);if(!a)continue;let l=e.elements.filter(m=>!R(e,m)),s=m=>{let y=l.map((C,L)=>m.has(C.payload.id)?L:-1).filter(C=>C>=0);if(!(y.length===0||y[y.length-1]-y[0]+1!==y.length))return[y[0],y[y.length-1]]},h=V(e,a.payload.groupId),p=h[h.length-1],c=s(p?new Set(Z(e,p.id).map(m=>m.payload.id)):new Set([a.payload.id])),d=s(new Set(n.map(m=>m.payload.id)));if(!c||!d||d[0]!==c[1]+1&&c[0]!==d[1]+1)continue;let u=ri(e,a),f=e.elements.filter(m=>!n.includes(m));f.splice(f.indexOf(a)+1,0,...n),e.elements=f,t.parentId=u,B(e),ie(e)}}function Js(e,t,n=_.rectangular){let o=e.elements.find(m=>m.payload.id===t);if(!o||o.kind!=="image")return;let i=o.payload,r=Bs(i.timestampSize),a=i.frame.x*n.width,l=i.frame.y*n.height,s=i.frame.width*n.width,h=i.frame.height*n.height,p,c;if(_o(i)){let m=(y,C,L,D)=>D>=L?C+(L-D)/2:Math.min(C+L-D,Math.max(C,y-D/2));p=m(a+i.timestampX*s,a,s,r.w),c=m(l+i.timestampY*h,l,h,r.h)}else p=i.timestampCorner.endsWith("Leading")?a+4:a+s-4-r.w,c=i.timestampCorner.startsWith("top")?l+4:l+h-4-r.h;let d=m=>Math.round(m*1e3)/1e3,u={x:d(p/n.width),y:d(c/n.height),width:d(r.w/n.width),height:d(r.h/n.height),rotationDegrees:0},f=ii(t,u,ni(r.w,r.h));ai(e,o,f);for(let m of f)Xo(e,o,m.payload.id);return delete i.timestamp,delete i.timestampX,delete i.timestampY,i.timestampCorner="topLeading",i.timestampSize=ht,f[1].payload.id}function qs(e,t){let n=e.elements.find(m=>m.payload.id===t);if(!n||n.kind!=="imageTime")return;let o=n.payload,i=H.find(m=>e.perFamily[m]?.placements[t]!==void 0),a=(i===void 0?void 0:e.perFamily[i].placements[t])?.frame??o.frame,l=_[i??"rectangular"],s=ni(a.width*l.width,a.height*l.height),[h,p]=ii(o.image,o.frame,s);for(let m of[h,p])m.payload.isHidden=o.isHidden,o.opacity!==void 0&&(m.payload.opacity=o.opacity),o.page!==void 0&&(m.payload.page=o.page),o.accentGroup==="accent"&&(m.payload.accentGroup="accent");h.payload.rules=structuredClone(o.rules),p.payload.rules=structuredClone(o.rules),o.shadow!==void 0&&(h.payload.shadow=structuredClone(o.shadow));for(let m of H){let y=e.perFamily[m]?.placements[t];if(!y)continue;let C=e.perFamily[m];for(let L of[h,p])C.placements[L.payload.id]={frame:{...y.frame},isHidden:y.isHidden};delete C.placements[t]}for(let m of e.elements)m.kind==="tap"&&m.payload.attachedTo===t&&(m.payload.attachedTo=p.payload.id);let c=o.groupId,d=e.elements.indexOf(n);e.elements.splice(d,1);let u=o.name!==void 0&&o.name.trim()!==""?o.name:mn,f=e.elements.find(m=>m.kind==="image"&&m.payload.id===o.image);return f?c!==void 0&&f.payload.groupId===c?Dt(e,[h,p],d,u,c):ai(e,f,[h,p],u):Dt(e,[h,p],d,u),B(e),Fe(e),p.payload.id}function Xs(e,t){return e.elements.filter(n=>n.kind==="chartDots"&&n.payload.chart===t)}function Ys(e,t){return e.elements.filter(n=>n.kind==="chartGrid"&&n.payload.chart===t)}function Zs(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n||n.kind!=="chart")return;let o=N("chartDots");o.payload.chart=t,o.payload.dots=n.payload.pointDots==="all"?"all":"auto",o.payload.frame={...n.payload.frame};let i=e.elements.findIndex(r=>r.payload.id===t);return e.elements.splice(i+1,0,o),oe(e,n,o.payload.id),o.payload.id}function Qs(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n||n.kind!=="chart")return;let o=N("chartGrid");o.payload.chart=t,o.payload.frame={...n.payload.frame};let i=e.elements.findIndex(r=>r.payload.id===t);return e.elements.splice(i,0,o),oe(e,n,o.payload.id),o.payload.id}var el="#FFFFFF66";function tl(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n||n.kind!=="chart")return;let o=N("shape");o.payload.kind="line",o.payload.thickness=1,o.payload.borderWidth=0,o.payload.colorSlot={baseColorHex:el},o.payload.frame=ei(n.payload.frame,"threshold"),o.payload.chartAnchor={layer:t,at:"zero",place:"through"};let i=e.elements.findIndex(r=>r.payload.id===t);return e.elements.splice(i+1,0,o),oe(e,n,o.payload.id),o.payload.id}function zu(e,t,n){let o=e.elements.find(r=>r.payload.id===t);if(!o||o.kind!=="chart")return;let i=o.payload;if(n===void 0){delete i.thresholdValue,delete i.drawsThreshold;for(let r of ke(e,t))r.payload.chartAnchor?.at==="threshold"&&q(e,r.payload.id);return}i.thresholdValue=n,i.drawsThreshold=!1,ke(e,t).some(r=>r.payload.chartAnchor?.at==="threshold")||Qe(e,t,"threshold")}function $u(e,t,n){let o=e.elements.find(r=>r.payload.id===t);if(!o||o.kind!=="chart")return;let i=o.payload;if(!n){delete i.nowIndex,delete i.drawsNowLine;for(let r of ke(e,t))r.payload.chartAnchor?.at==="now"&&q(e,r.payload.id);return}fn(i),i.drawsNowLine=!1,ke(e,t).some(r=>r.payload.chartAnchor?.at==="now")||Qe(e,t,"now")}function Ou(e){let t=e.elements.filter(n=>n.kind==="chart"||n.kind==="timeline"||n.kind==="image");for(let n of t){let o=n.payload,i=new Set(e.elements.map(s=>s.payload.id)),r=H.find(s=>e.perFamily[s]?.placements[o.id]!==void 0),a=o.frame,l=r===void 0?void 0:e.perFamily[r].placements[o.id];if(l&&(o.frame={...l.frame}),n.kind==="chart"&&nl(e,n.payload),n.kind==="timeline"&&n.payload.drawsTimeLabels!==!1&&n.payload.timeLabelCount>0&&ti(e,o.id),n.kind==="image"&&n.payload.timestamp===!0&&Js(e,o.id,_[r??"rectangular"]),o.frame=a,!(r===void 0||l===void 0))for(let s of e.elements)i.has(s.payload.id)||(e.perFamily[r].placements[s.payload.id]={frame:{...s.payload.frame},isHidden:l.isHidden},s.payload.isHidden=!0)}for(let n of e.elements.filter(o=>o.kind==="imageTime"))qs(e,n.payload.id);Ks(e)}function nl(e,t){{if(t.highlight!==void 0&&t.highlight!=="none"){let i=Mt(t),r=[];(t.highlight==="highest"||t.highlight==="both")&&r.push(["highest",i.high]),(t.highlight==="lowest"||t.highlight==="both")&&r.push(["lowest",i.low]);for(let[a,l]of r){let s=zs(e,t.id,a),h=e.elements.find(p=>p.payload.id===s);h?.kind==="icon"&&l!=="none"&&(h.payload.symbol=S(l==="triangle"?"arrowtriangle.up.fill":"circle.fill"))}ma(t,{high:"none",low:"none"}),t.highlight="none"}t.thresholdValue!==void 0&&t.drawsThreshold!==!1&&Qe(e,t.id,"threshold"),t.nowIndex!==void 0&&t.drawsNowLine!==!1&&Qe(e,t.id,"now"),t.drawsTimeLabels!==!1&&Ta(t)&&t.timeLabelCount>0&&ti(e,t.id);let n=Et(t.pointDots);if(n!=="none"){let i=Zs(e,t.id),r=e.elements.find(a=>a.payload.id===i);if(r?.kind==="chartDots"){r.payload.dots=n;let a=Pe(t.pointDotSize);a!==void 0&&(r.payload.size=a),typeof t.pointDotColorHex=="string"&&(r.payload.colorHex=t.pointDotColorHex)}}let o=Ft(t.gridLines);if(o>0){let i=Qs(e,t.id),r=e.elements.find(a=>a.payload.id===i);r?.kind==="chartGrid"&&(r.payload.lines=o,r.payload.colorHex=ye(t.gridColorHex))}if(t.zeroLine===!0){let i=tl(e,t.id),r=e.elements.find(a=>a.payload.id===i);r?.kind==="shape"&&(r.payload.colorSlot={baseColorHex:ye(t.gridColorHex)})}delete t.pointDots,delete t.pointDotSize,delete t.pointDotColorHex,delete t.gridLines,delete t.gridColorHex,delete t.zeroLine}}function ol(e,t,n){let o=_.rectangular,i=Math.max(Na,Math.min(Da,t)),r=Math.min(1,i*1.2/o.height),a=Math.min(1,Math.max(0,e.width)),l=n?e.y-r:e.y+e.height;return{x:Math.max(0,Math.min(1-a,e.x)),y:Math.max(0,Math.min(1-r,l)),width:a,height:r,rotationDegrees:0}}function il(e,t){for(let n of t){if(!g(n)||n.kind!=="chart"||!g(n.payload))continue;let o=n.payload,i=w(o.id).toUpperCase(),r=e.elements.find(d=>d.payload.id===i);if(!r||r.kind!=="chart")continue;let a=w(o.scaleLabelColorHex,"#FFFFFF99"),l=d=>{let u=g(d)?d:{};return{fontSize:v(u.fontSize,8),colorHex:w(u.colorHex,a),pillColorHex:typeof u.pillColorHex=="string"?u.pillColorHex:void 0}},s=[],h=A(o.scaleLabels);(h==="top"||h==="range")&&s.push(["top",l(o.topLabelStyle)]),h==="range"&&s.push(["bottom",l(o.bottomLabelStyle)]);let p=A(o.latestLabel);if((p==="corner"||p==="end")&&s.push(["latest",l(o.latestLabelStyle)]),s.length===0)continue;let c=e.elements.findIndex(d=>d.payload.id===i)+1;for(let[d,u]of s){let f=Zo(r.payload.frame,Yo[d],u.fontSize,d==="latest"?5:4),m=[];if(u.pillColorHex!==void 0){let C=N("shape");C.payload.kind="capsule",C.payload.colorSlot={baseColorHex:u.pillColorHex},C.payload.frame={...f},m.push(C)}let y=N("text");y.payload.value={kind:{kind:"chartStat",layer:i,stat:d}},y.payload.fontSize=u.fontSize,y.payload.fontWeight="medium",y.payload.colorSlot={baseColorHex:u.colorHex},y.payload.frame=f,m.push(y),e.elements.splice(c,0,...m),c+=m.length;for(let C of m)oe(e,r,C.payload.id)}}}function b(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function O(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function rl(e){let t={};return e.decimals!==void 0&&(t.decimals=b(e.decimals)),e.multiply!==void 0&&(t.multiply=b(e.multiply)),e.offset!==void 0&&(t.offset=b(e.offset)),e.prefix&&(t.prefix=e.prefix),e.suffix&&(t.suffix=e.suffix),e.useEntityUnit&&(t.useEntityUnit=!0),e.relativeTime&&(t.relativeTime=!0),e.duration&&(t.duration=!0),e.timestamp!==void 0&&(t.timestamp=e.timestamp),e.hideMinutes&&(t.hideMinutes=!0),e.hideDayPeriod&&(t.hideDayPeriod=!0),e.showSeconds&&(t.showSeconds=!0),e.textCase!==void 0&&(t.textCase=e.textCase),t}function si(e){let t=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(O)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},n={function:e.function,scope:t};return e.stateFilter&&(n.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(n.attribute=e.attribute),n}function al(e){switch(e.kind){case"named":return e.id.trim()==="";case"chartStat":case"listStat":case"imageTime":return e.layer.trim()==="";default:return!1}}function sl(e){if(al(e))return{kind:"literal",value:""};switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...O(e)};case"entityAttribute":return{kind:"entityAttribute",...O(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...O(e)};case"aggregate":return{kind:"aggregate",aggregate:si(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat};case"item":return{kind:"item",field:e.field};case"listStat":return{kind:"listStat",layer:e.layer,stat:e.stat};case"imageTime":return{kind:"imageTime",layer:e.layer}}}function E(e){let t={kind:sl(e.kind)};return ve(e.format)||(t.format=rl(e.format)),t}function U(e){return{x:b(e.x),y:b(e.y),width:b(e.width),height:b(e.height),rotationDegrees:b(e.rotationDegrees)}}function ll(e){let t={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=E(e.value??S(""));break;case"between":case"timeBetween":t.value=E(e.value??S("")),t.upper=E(e.upper??S(""));break;case"matchesRegex":t.pattern=e.pattern??"";break;case"isOneOf":t.options=e.options??[];break;default:break}return t}function Yn(e){let t={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=E(e.value??S("")),e.kind==="setIcon"&&e.path&&(t.path=e.path);break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=b(e.number??0);break;case"setFontWeight":t.weight=e.weight??"regular";break;case"setFontDesign":t.design=e.design??"default";break;case"setFontWidth":t.width=e.width??"standard";break;case"setItalic":t.italic=e.italic!==!1;break;default:break}return t}function j(e){return e.map(t=>{let n={id:t.id,cases:t.cases.map(o=>({id:o.id,when:{join:o.when.join,tests:o.when.tests.map(i=>({id:i.id,value:E(i.value),comparison:ll(i.comparison)}))},then:o.then.map(Yn)}))};return t.otherwise&&(n.otherwise=t.otherwise.map(Yn)),t.partId!==void 0&&(n.partId=t.partId),n})}function dl(e){let t={id:e.id,value:E(e.value)};e.icon!==void 0&&(t.icon=E(e.icon));let n=Object.keys(e.iconPaths??{}).sort();return n.length>0&&(t.iconPaths=Object.fromEntries(n.map(o=>[o,e.iconPaths[o]]))),e.colorHex!==void 0&&(t.colorHex=e.colorHex),e.fontWeight!==void 0&&(t.fontWeight=e.fontWeight),e.fontSize!==void 0&&(t.fontSize=b(e.fontSize)),e.fontDesign!==void 0&&(t.fontDesign=e.fontDesign),e.fontWidth!==void 0&&(t.fontWidth=e.fontWidth),e.italic!==void 0&&(t.italic=e.italic),e.tracking!==void 0&&e.tracking!==0&&(t.tracking=b(e.tracking)),e.coloring!==void 0&&e.coloring!=="uniform"&&(t.coloring=e.coloring),e.bands!==void 0&&e.bands.length>0&&(t.bands=e.bands.map(De)),e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==G&&(t.bandAboveColorHex=e.bandAboveColorHex),t}function cl(e){let t=li(e);return e.payload.page!==void 0&&(t.payload.page=e.payload.page),t}function li(e){let t=ul(e);return e.payload.groupId!==void 0&&(t.payload.groupId=e.payload.groupId),e.payload.name!==void 0&&(t.payload.name=e.payload.name),e.payload.accentGroup==="accent"&&(t.payload.accentGroup="accent"),t}function ul(e){let t=n=>{let o={id:n.id,colorSlot:{baseColorHex:n.colorSlot.baseColorHex},rules:j(n.rules),frame:U(n.frame),isHidden:n.isHidden};return n.opacity!==void 0&&n.opacity!==1&&(o.opacity=b(n.opacity)),n.shadow!==void 0&&(o.shadow={colorHex:n.shadow.colorHex,radius:b(n.shadow.radius),dx:b(n.shadow.dx),dy:b(n.shadow.dy)}),o};switch(e.kind){case"text":{let n={...t(e.payload),value:E(e.payload.value),fontSize:b(e.payload.fontSize),fontWeight:e.payload.fontWeight};e.payload.countdown===!0&&(n.countdown=!0),e.payload.monospacedDigits===!0&&(n.monospacedDigits=!0),e.payload.lineLimit!==void 0&&e.payload.lineLimit>1&&(n.lineLimit=e.payload.lineLimit),e.payload.fontDesign!==void 0&&e.payload.fontDesign!=="default"&&(n.fontDesign=e.payload.fontDesign),e.payload.fontWidth!==void 0&&e.payload.fontWidth!=="standard"&&(n.fontWidth=e.payload.fontWidth),e.payload.italic===!0&&(n.italic=!0),e.payload.minimumScale!==void 0&&e.payload.minimumScale!==Oe&&(n.minimumScale=b(e.payload.minimumScale)),e.payload.alignment!==void 0&&e.payload.alignment!=="center"&&(n.alignment=e.payload.alignment);let o=e.payload;return o.coloring!==void 0&&o.coloring!=="uniform"&&(n.coloring=o.coloring),o.bands!==void 0&&o.bands.length>0&&(n.bands=o.bands.map(De)),o.bandAboveColorHex!==void 0&&o.bandAboveColorHex!==G&&(n.bandAboveColorHex=o.bandAboveColorHex),o.highlight!==void 0&&o.highlight!=="none"&&(n.highlight=o.highlight),o.highColorHex!==void 0&&o.highColorHex!==xe&&(n.highColorHex=o.highColorHex),o.lowColorHex!==void 0&&o.lowColorHex!==be&&(n.lowColorHex=o.lowColorHex),o.parts!==void 0&&o.parts.length>0&&(n.parts=o.parts.map(dl),go(o)&&(n.value=E(xo(o.parts)))),o.arc!==void 0&&(n.arc=Yr(o.arc)),Xe(o,n),{kind:"text",payload:n}}case"icon":{let n={...t(e.payload),symbol:E(e.payload.symbol)};e.payload.path!==void 0&&e.payload.path!==""&&(n.path=e.payload.path);let o=qt(e.payload.viewBox);return o!==void 0&&(n.viewBox=o),n.size=b(e.payload.size),Nn(e.payload,n),Xe(e.payload,n),{kind:"icon",payload:n}}case"gauge":{let n=e.payload,o={...t(n),value:E(n.value),minValue:b(n.minValue),maxValue:b(n.maxValue),style:n.style,lineWidth:b(n.lineWidth),trackColorHex:n.trackColorHex};return n.coloring!=="uniform"&&(o.coloring=n.coloring),n.bands.length>0&&(o.bands=n.bands.map(De)),n.bandAboveColorHex!==G&&(o.bandAboveColorHex=n.bandAboveColorHex),n.thresholdValue!==void 0&&(o.thresholdValue=b(n.thresholdValue)),n.thresholdColorHex!==Xt&&(o.thresholdColorHex=n.thresholdColorHex),n.total!==void 0&&(o.total=E(n.total)),n.minSource!==void 0&&(o.minSource=E(n.minSource)),n.maxSource!==void 0&&(o.maxSource=E(n.maxSource)),n.fill!==void 0&&(o.fill=Ye(n.fill)),n.ticks!==void 0&&!bo(n.ticks)&&(o.ticks=ua(n.ticks)),n.labels!==void 0&&!wo(n.labels)&&(o.labels=ha(n.labels)),{kind:"gauge",payload:o}}case"chart":{let n=e.payload,o={...t(n),value:E(n.value),historyMinutes:Math.max(0,Math.round(n.historyMinutes)),historyPoints:Math.round(n.historyPoints),style:n.style,limit:Math.max(0,Math.round(n.limit)),takeFromEnd:n.takeFromEnd,scale:n.scale,minValue:b(n.minValue),maxValue:b(n.maxValue),baseline:n.baseline,barGap:b(n.barGap),lineWidth:b(n.lineWidth),highlight:n.highlight,highColorHex:n.highColorHex,lowColorHex:n.lowColorHex,marker:vo(Mt(n)),coloring:n.coloring,bands:n.bands.map(De),bandAboveColorHex:n.bandAboveColorHex,fillBands:n.fillBands};n.source!==Gt&&(o.source=n.source),n.statPeriod!==Wt&&(o.statPeriod=n.statPeriod),n.statType!==Ut&&(o.statType=n.statType),n.thresholdValue!==void 0&&(o.thresholdValue=b(n.thresholdValue)),n.thresholdColorHex!==Yt&&(o.thresholdColorHex=n.thresholdColorHex),n.nowIndex!==void 0&&(o.nowIndex=E(n.nowIndex)),n.nowColorHex!==Zt&&(o.nowColorHex=n.nowColorHex),n.drawsThreshold===!1&&(o.drawsThreshold=!1),n.drawsNowLine===!1&&(o.drawsNowLine=!1),n.drawsTimeLabels===!1&&(o.drawsTimeLabels=!1),n.scaleFrom!==void 0&&(o.scaleFrom=n.scaleFrom),n.labelSize!==X&&(o.labelSize=b(n.labelSize)),n.labelColorHex!==Y&&(o.labelColorHex=n.labelColorHex),n.labelsAbove&&(o.labelsAbove=!0),n.timeLabelCount!==ce&&(o.timeLabelCount=we(n.timeLabelCount)),n.hourCycle!==ue&&(o.hourCycle=n.hourCycle),n.minutes!==pe&&(o.minutes=n.minutes);let i=Mt(n);ko(i)||(o.highMarker=i.high,o.lowMarker=i.low);let r=n.curve??"straight";r!=="straight"&&(o.curve=r);let a=At(n.fillStyle);a!=="flat"&&(o.fillStyle=a),n.fillColorHex!==void 0&&(o.fillColorHex=n.fillColorHex),n.areaFill!==void 0&&(o.areaFill=Ye(n.areaFill));let l=Ht(n.barRadius);l!==Bt&&(o.barRadius=b(l));let s=Lt(n.barCorners);s!=="all"&&(o.barCorners=s);let h=_t(n.smoothing);return h!==void 0&&(o.smoothing=h),n.gaps===!0&&(o.gaps=!0),n.barBorderWidth!==void 0&&n.barBorderWidth!==0&&(o.barBorderWidth=b(n.barBorderWidth)),n.barBorderColorHex!==void 0&&(o.barBorderColorHex=n.barBorderColorHex),n.bandAboveFillColorHex!==void 0&&(o.bandAboveFillColorHex=n.bandAboveFillColorHex),n.bandAboveBorderColorHex!==void 0&&(o.bandAboveBorderColorHex=n.bandAboveBorderColorHex),n.barBorderOpenBase===!0&&(o.barBorderOpenBase=!0),{kind:"chart",payload:o}}case"timeline":{let n=e.payload,o={id:n.id,rules:j(n.rules),frame:U(n.frame),isHidden:n.isHidden,value:E(n.value)},i=pt(n);return n.aggregate!==void 0&&i.length>0&&(o.aggregate={entities:i,...n.aggregate.combine!==ct?{combine:n.aggregate.combine}:{}}),n.historyMinutes!==rn&&(o.historyMinutes=Math.max(1,Math.round(n.historyMinutes))),n.bands.length>0&&(o.bands=n.bands.map(r=>({id:r.id,match:r.match,colorHex:r.colorHex}))),n.otherColorHex!==ut&&(o.otherColorHex=n.otherColorHex),n.gap!==0&&(o.gap=b(n.gap)),n.cornerRadius!==So&&(o.cornerRadius=b(n.cornerRadius)),n.labelSize!==X&&(o.labelSize=b(n.labelSize)),n.labelColorHex!==Y&&(o.labelColorHex=n.labelColorHex),n.labelsAbove&&(o.labelsAbove=!0),n.timeLabelCount!==ce&&(o.timeLabelCount=Math.max(0,Math.min(Ao,Math.round(n.timeLabelCount)))),n.hourCycle!==ue&&(o.hourCycle=n.hourCycle),n.minutes!==pe&&(o.minutes=n.minutes),n.drawsTimeLabels===!1&&(o.drawsTimeLabels=!1),{kind:"timeline",payload:o}}case"shape":{let n={...t(e.payload),kind:e.payload.kind,cornerRadius:b(e.payload.cornerRadius),borderWidth:b(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(n.borderColorHex=e.payload.borderColorHex),e.payload.thickness!==1&&(n.thickness=b(e.payload.thickness)),e.payload.fill!==void 0&&(n.fill=Ye(e.payload.fill)),Nn(e.payload,n),Xe(e.payload,n),{kind:"shape",payload:n}}case"image":{let n=e.payload,o={id:n.id};(n.source!=="inline"||n.entity.entityId!=="")&&(o.entity=O(n.entity)),o.rules=j(n.rules),o.frame=U(n.frame),o.isHidden=n.isHidden,n.source!=="camera"&&(o.source=n.source),n.data!==void 0&&n.data!==""&&(o.data=n.data),n.format==="jpeg"&&(o.format="jpeg"),n.timestamp===!0&&(o.timestamp=!0),n.contentMode!=="fill"&&(o.contentMode=n.contentMode),n.zoom!==1&&(o.zoom=b(n.zoom)),n.panX!==0&&(o.panX=b(n.panX)),n.panY!==0&&(o.panY=b(n.panY)),n.cornerRadius!==Lo&&(o.cornerRadius=b(n.cornerRadius));let i=_o(n),r=i?Ka(n.timestampX,n.timestampY):n.timestampCorner;return r!=="topLeading"&&(o.timestampCorner=r),n.timestampSize!==ht&&(o.timestampSize=b(n.timestampSize)),i&&(o.timestampX=b(n.timestampX),o.timestampY=b(n.timestampY)),Xe(n,o),{kind:"image",payload:o}}case"tap":{let n=e.payload,o={id:n.id,action:gn(n.action)};return n.openPageId!==void 0&&(o.openPageId=n.openPageId),n.openPageName!==void 0&&(o.openPageName=n.openPageName),n.attachedTo!==void 0&&(o.attachedTo=n.attachedTo),n.confirm===!0&&(o.confirm=!0),o.rules=j(n.rules),o.frame=U(n.frame),o.isHidden=n.isHidden,n.opacity!==void 0&&n.opacity!==1&&(o.opacity=b(n.opacity)),n.shadow!==void 0&&(o.shadow={colorHex:n.shadow.colorHex,radius:b(n.shadow.radius),dx:b(n.shadow.dx),dy:b(n.shadow.dy)}),{kind:"tap",payload:o}}case"chartTimes":{let n=e.payload,o={id:n.id,rules:j(n.rules),frame:U(n.frame),isHidden:n.isHidden,chart:n.chart};return n.labelSize!==X&&(o.labelSize=b(n.labelSize)),n.labelColorHex!==Y&&(o.labelColorHex=n.labelColorHex),n.timeLabelCount!==ce&&(o.timeLabelCount=we(n.timeLabelCount)),n.hourCycle!==ue&&(o.hourCycle=n.hourCycle),n.minutes!==pe&&(o.minutes=n.minutes),n.fontWeight!==void 0&&n.fontWeight!=="regular"&&(o.fontWeight=n.fontWeight),n.fontDesign!==void 0&&n.fontDesign!=="rounded"&&(o.fontDesign=n.fontDesign),n.fontWidth!==void 0&&n.fontWidth!=="standard"&&(o.fontWidth=n.fontWidth),n.italic===!0&&(o.italic=!0),n.monospacedDigits===!0&&(o.monospacedDigits=!0),{kind:"chartTimes",payload:o}}case"imageTime":{let n=e.payload,o={id:n.id,rules:j(n.rules),frame:U(n.frame),isHidden:n.isHidden};return n.image!==""&&(o.image=n.image),{kind:"imageTime",payload:o}}case"chartDots":{let n=e.payload,o={id:n.id,rules:j(n.rules),frame:U(n.frame),isHidden:n.isHidden,chart:n.chart};co(n.dots)!=="auto"&&(o.dots="all");let i=Pe(n.size);return i!==void 0&&(o.size=b(i)),n.colorHex!==void 0&&(o.colorHex=n.colorHex),{kind:"chartDots",payload:o}}case"chartGrid":{let n=e.payload,o={id:n.id,rules:j(n.rules),frame:U(n.frame),isHidden:n.isHidden,chart:n.chart},i=uo(n.lines);i!==Vt&&(o.lines=i);let r=ye(n.colorHex);Ce(r,rt)||(o.colorHex=r);let a=po(n.thickness);return a!==Ot&&(o.thickness=b(a)),{kind:"chartGrid",payload:o}}case"list":{let n=e.payload,o={id:n.id,rules:j(n.rules),frame:U(n.frame),isHidden:n.isHidden};n.opacity!==void 0&&n.opacity!==1&&(o.opacity=b(n.opacity)),n.shadow!==void 0&&(o.shadow={colorHex:n.shadow.colorHex,radius:b(n.shadow.radius),dx:b(n.shadow.dx),dy:b(n.shadow.dy)}),o.source=pl(n.source);let i=Se(n.rows);i!==an&&(o.rows=i),n.direction==="across"&&(o.direction="across");let r=dn(n.columns);r!==sn&&(o.columns=r);let a=No(n.gap);return a!==ln&&(o.gap=b(a)),n.template.length>0&&(o.template=n.template.map(li)),{kind:"list",payload:o}}}}function pl(e){switch(e.kind){case"entities":{let t={kind:"entities",scope:si({function:"count",scope:e.scope}).scope},n=(e.deviceClass??"").trim();return n!==""&&(t.deviceClass=n),e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.sort!=="name"&&(t.sort=e.sort),e.descending&&(t.descending=!0),e.attributes.length>0&&(t.attributes=[...e.attributes]),t}case"attribute":return{kind:"attribute",...O(e),attribute:e.attribute};case"template":return{kind:"template",value:e.value};case"calendar":{let t={kind:"calendar",entities:e.entities.map(O)},n=Te(e.hours);return n!==Ro&&(t.hours=n),t}case"todo":{let t={kind:"todo",entities:e.entities.map(O)};return e.status!=="open"&&(t.status=e.status),e.sort!=="list"&&(t.sort=e.sort),t}case"forecast":{let t={kind:"forecast",...O(e)};return e.type!=="hourly"&&(t.type=e.type),t}}}function hl(e){let t={},n=Object.keys(e.placements);if(n.length>0){let o={};for(let i of n){let r=e.placements[i],a={frame:U(r.frame)};r.isHidden&&(a.isHidden=!0),r.size!==void 0&&(a.size=b(r.size)),o[i]=a}t.placements=o}if(e.bezelText&&(t.bezelText=E(e.bezelText)),e.bezelCountdown===!0&&(t.bezelCountdown=!0),e.curvedText&&(t.curvedText=E(e.curvedText)),e.curvedColorHex!==void 0&&(t.curvedColorHex=e.curvedColorHex),e.parkedCurvedText&&(t.parkedCurvedText=E(e.parkedCurvedText)),e.parkedCurvedColorHex!==void 0&&(t.parkedCurvedColorHex=e.parkedCurvedColorHex),e.bezelGauge){let o=e.bezelGauge,i={value:E(o.value),minValue:b(o.minValue),maxValue:b(o.maxValue),colorHexes:o.colorHexes};o.minLabel&&(i.minLabel=E(o.minLabel)),o.maxLabel&&(i.maxLabel=E(o.maxLabel)),t.bezelGauge=i}return e.backgroundColorHex!==void 0&&(t.backgroundColorHex=e.backgroundColorHex),e.backgroundFill!==void 0&&(t.backgroundFill=Ye(e.backgroundFill)),t.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(t.borderColorHex=e.borderColorHex),t.borderWidth=b(e.borderWidth),e.rules.length>0&&(t.rules=j(e.rules)),t}function gn(e){if(e.type==="callService"){let t={type:e.type,serviceDomain:e.serviceDomain,serviceName:e.serviceName};return e.serviceDataJSON!==void 0&&e.serviceDataJSON.trim()!==""&&(t.serviceDataJSON=e.serviceDataJSON),e.target!==void 0&&e.target.entityId!==""&&Object.assign(t,O(e.target)),t}if(e.type==="refreshAll"){let t={type:e.type};if(e.allPlaced===!0)return t.allPlaced=!0,t;e.targets!==void 0&&e.targets.length>0&&(t.targets=[...e.targets]);let n=Object.entries(e.targetLayers??{});if(n.length>0){let o={};for(let[i,r]of n)o[i]=[...r];t.targetLayers=o}return t}if(e.type==="refresh"){let t={type:e.type};return e.layerIds!==void 0&&(t.layerIds=[...e.layerIds]),t}return e.type==="showPage"?{type:e.type,page:e.page}:"entityId"in e?{type:e.type,...O(e)}:{type:e.type}}function fl(e){if(e.kind==="template")return{kind:"template",value:e.value};if(e.kind==="entity")return{kind:"entity",...O(e)};let t={kind:"list",source:e.source};return e.entities!==void 0&&(t.entities=[...e.entities]),e.entity_id!==void 0&&(t.entity_id=e.entity_id),e.hours!==void 0&&(t.hours=e.hours),e.status!==void 0&&(t.status=e.status),e.sort!==void 0&&(t.sort=e.sort),e.type!==void 0&&(t.type=e.type),t.limit=e.limit,t}function ml(e){let t={};return e.label!==void 0&&(t.label=e.label),t.value=E(e.value),e.symbol!==void 0&&(t.symbol=e.symbol),e.countdown&&(t.countdown=!0),e.parts!==void 0&&e.parts.length>0&&(t.parts=e.parts.map(n=>{let o={id:n.id,value:E(n.value)};return n.symbol!==void 0&&(o.symbol=n.symbol),o})),t}function gl(e){let t={kind:e.kind,title:E(e.title)};return e.valueLabel!==void 0&&(t.valueLabel=E(e.valueLabel)),e.state!==void 0&&(t.state=E(e.state)),t.symbol=e.symbol,e.symbolOff!==void 0&&(t.symbolOff=e.symbolOff),e.tintColorHex!==void 0&&(t.tintColorHex=e.tintColorHex),e.coloring!=="uniform"&&(t.coloring=e.coloring),e.bands.length>0&&(t.bands=e.bands.map(De)),e.bandAboveColorHex!==void 0&&(t.bandAboveColorHex=e.bandAboveColorHex),e.status!==void 0&&(t.status=E(e.status)),t.action=gn(e.action),t}function Vu(e){let t=[];for(let r of H){let a=e.perFamily[r];a&&t.push(r,hl(a))}let n={schemaVersion:$t(e),id:e.id,name:e.name,values:e.values.map(r=>({id:r.id,name:r.name,value:E(r.value)})),slotIndex:e.slotIndex,elements:e.elements.map(cl),supportedFamilies:e.supportedFamilies,perFamily:t,dataSources:e.dataSources.map(fl),tapAction:gn(e.tapAction)};e.inline!==void 0&&(n.inline=ml(e.inline)),e.refreshMinutes!==void 0&&(n.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(n.openPageId=e.openPageId),e.openPageName!==void 0&&(n.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(n.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(n.successFlashColorHex=e.successFlashColorHex),e.httpShowResult===!0&&(n.httpShowResult=!0),e.groups!==void 0&&e.groups.length>0&&(n.groups=e.groups.map(r=>({id:r.id,name:r.name,locked:r.locked,...r.parentId!==void 0?{parentId:r.parentId}:{}})));let o=kt(e.notes);o!==void 0&&(n.notes=o),e.hidden===!0&&(n.hidden=!0),e.linkId!==void 0&&(n.linkId=e.linkId);let i=ys(e.pages===void 0?void 0:{...e.pages,mode:cn(e)});return i!==void 0&&(n.pages=i),e.control!==void 0&&(n.control=gl(e.control)),e.legacyControlEntityId!==void 0&&e.legacyControlEntityId!==""&&(n.legacyControlEntityId=e.legacyControlEntityId),n}function Bu(e){return e.tapAction.type==="runHTTPAction"||e.elements.some(t=>t.kind==="tap"&&t.payload.action.type==="runHTTPAction")}function Gu(e){return g(e)&&e.hidden===!0}function Wu(e,t){let n={...e};return t?n.hidden=!0:delete n.hidden,n}function P(e,t){return t===void 0?void 0:e.groups?.find(n=>n.id===t)}function yn(e,t){let n=e.elements.find(o=>o.payload.id===t);return P(e,n?.payload.groupId)}function V(e,t){let n=[],o=new Set,i=P(e,t);for(;i&&!o.has(i.id);)n.push(i),o.add(i.id),i=P(e,i.parentId);return n}function Uu(e,t){return V(e,t).slice(1)}function xn(e,t){let n=new Set([t]),o=!0;for(;o;){o=!1;for(let i of e.groups??[])i.parentId!==void 0&&n.has(i.parentId)&&!n.has(i.id)&&(n.add(i.id),o=!0)}return n}function yl(e,t){return(e.groups??[]).filter(n=>n.parentId===t)}function ju(e,t,n){return V(e,t.payload.groupId).some(o=>o.id===n)}function di(e,t){return e.elements.filter(n=>n.payload.groupId===t&&!R(e,n))}function Z(e,t){let n=xn(e,t);return e.elements.filter(o=>o.payload.groupId!==void 0&&n.has(o.payload.groupId)&&!R(e,o))}function bn(e,t){let n=V(e,t);for(let o=n.length-1;o>=0;o--)if(n[o].locked)return n[o]}function Ku(e,t){return bn(e,yn(e,t)?.id)}function Ju(e,t){return bn(e,t)??P(e,t)}function qu(e,t){let n=new Set;for(let o of t){let i=yn(e,o),r=i===void 0?void 0:bn(e,i.id);if(r)for(let a of Z(e,r.id))n.add(a.payload.id);else n.add(o)}return e.elements.filter(o=>n.has(o.payload.id)&&o.kind!=="chartDots"&&o.kind!=="chartGrid"&&o.payload.chartAnchor===void 0).map(o=>o.payload.id)}function ci(e){let t=e.groups??[],n=new Map(t.map(o=>[o.id,o]));for(let o of t){if(o.parentId===void 0)continue;if(o.parentId===o.id||!n.has(o.parentId)){delete o.parentId;continue}let i=new Set,r=n.get(o.parentId);for(;r!==void 0;){if(r.id===o.id){delete o.parentId;break}if(i.has(r.id))break;i.add(r.id),r=r.parentId===void 0?void 0:n.get(r.parentId)}}}function B(e){let t=new Set((e.groups??[]).map(i=>i.id));for(let i of e.elements)i.payload.groupId!==void 0&&!t.has(i.payload.groupId)&&delete i.payload.groupId;ci(e);let n=new Set;for(let i of e.elements)for(let r of V(e,i.payload.groupId))n.add(r.id);let o=(e.groups??[]).filter(i=>n.has(i.id));o.length===0?delete e.groups:e.groups=o}function ie(e){if(!e.groups?.length)return;ci(e);let t=e.elements.filter(p=>!R(e,p)),n=e.elements.filter(p=>R(e,p)),o=new Map;t.forEach((p,c)=>{for(let d of V(e,p.payload.groupId))o.set(d.id,Math.max(o.get(d.id)??-1,c))});let i=new Map,r=(p,c)=>{let d=i.get(p);d?d.push(c):i.set(p,[c])};t.forEach((p,c)=>r(P(e,p.payload.groupId)?.id,{at:c,el:p}));for(let p of e.groups){let c=o.get(p.id);c!==void 0&&r(P(e,p.parentId)?.id,{at:c,group:p})}let a=[],l=new Set,s=new Set,h=p=>{let c=(i.get(p)??[]).sort((d,u)=>d.at-u.at);for(let d of c)"el"in d?(a.push(d.el),l.add(d.el)):s.has(d.group.id)||(s.add(d.group.id),h(d.group.id))};h(void 0);for(let p of t)l.has(p)||a.push(p);e.elements=[...a,...n],Fe(e)}function xl(e){let t=new Set((e.groups??[]).map(o=>o.name.trim())),n=1;for(;t.has(`Group ${n}`);)n++;return`Group ${n}`}function ui(e,t,n=xl(e)){let o=e.elements.filter(p=>t.includes(p.payload.id)&&!R(e,p));if(o.length<2)return;let i=o.map(p=>V(e,p.payload.groupId)),r=i[0].find(p=>i.every(c=>c.includes(p))),a=new Set(o.map(p=>p.payload.id)),l=new Set,s=[];o.forEach((p,c)=>{let d=i[c],u=r===void 0?d:d.slice(0,d.indexOf(r)),f;for(let m=u.length-1;m>=0;m--)if(Z(e,u[m].id).every(y=>a.has(y.payload.id))){f=u[m];break}f?l.add(f):s.push(p)});let h={id:M(),name:n,locked:!0,...r!==void 0?{parentId:r.id}:{}};e.groups=[...e.groups??[],h];for(let p of l)p.parentId=h.id;for(let p of s)p.payload.groupId=h.id;return B(e),ie(e),h.id}function bl(e,t){let o=P(e,t)?.parentId;for(let i of e.elements)i.payload.groupId===t&&(o===void 0?delete i.payload.groupId:i.payload.groupId=o);for(let i of e.groups??[])i.parentId===t&&(o===void 0?delete i.parentId:i.parentId=o);e.groups&&(e.groups=e.groups.filter(i=>i.id!==t)),B(e)}function wl(e,t,n){let o=e.elements.find(i=>i.payload.id===t);!o||R(e,o)||(n===void 0?delete o.payload.groupId:o.payload.groupId=n,B(e),ie(e))}function Xu(e,t,n){let o=P(e,t);return!o||n!==void 0&&(!P(e,n)||xn(e,t).has(n))?!1:(n===void 0?delete o.parentId:o.parentId=n,B(e),ie(e),!0)}function Zn(e,t){return P(e,t)?new Set(Z(e,t).map(n=>n.payload.id)):new Set([t])}function tt(e,t,n,o){let i=e.filter(l=>t.has(l.payload.id)),r=e.filter(l=>!t.has(l.payload.id)),a=r.map((l,s)=>n.has(l.payload.id)?s:-1).filter(l=>l>=0);return i.length===0||a.length===0?e:(r.splice(o?a[a.length-1]+1:a[0],0,...i),r)}function Yu(e,t,n,o,i){if(t===n)return!1;let r=P(e,t);if(i!==void 0&&!P(e,i))return!1;if(r){let p=xn(e,t);if(i!==void 0&&p.has(i)||P(e,n)&&p.has(n))return!1}let a=Zn(e,t),l=Zn(e,n);for(let p of a)l.delete(p);let s=e.elements.filter(p=>!R(e,p)),h=e.elements.filter(p=>R(e,p));if(!s.some(p=>a.has(p.payload.id))||!s.some(p=>l.has(p.payload.id)))return!1;if(e.elements=[...tt(s,a,l,o),...h],r)i===void 0?delete r.parentId:r.parentId=i;else{let p=e.elements.find(c=>c.payload.id===t);i===void 0?delete p.payload.groupId:p.payload.groupId=i}return B(e),ie(e),!0}function Zu(e,t,n,o=()=>!0){let i=e.elements.filter(u=>!R(e,u)),r=e.elements.filter(u=>R(e,u)),a=i.findIndex(u=>u.payload.id===t);if(a<0)return;let l=a+n;for(;l>=0&&l<i.length&&!o(i[l]);)l+=n;if(l<0||l>=i.length)return;let s=i[a],h=i[l],p=P(e,s.payload.groupId),c=V(e,h.payload.groupId),d=i;if(p!==void 0&&!c.includes(p)){let u=new Set(Z(e,p.id).map(f=>f.payload.id));u.delete(t),u.size>0&&(d=tt(i,new Set([t]),u,n===1)),p.parentId===void 0?delete s.payload.groupId:s.payload.groupId=p.parentId}else if(c[0]!==p){let u=p===void 0?c.length:c.indexOf(p);s.payload.groupId=c[u-1].id}else d=[...i],d.splice(a,1),d.splice(l,0,s);e.elements=[...d,...r],B(e),ie(e)}function Qu(e,t,n,o=()=>!0){let i=P(e,t);if(!i)return;let r=e.elements.filter(f=>!R(e,f)),a=e.elements.filter(f=>R(e,f)),l=new Set(Z(e,t).map(f=>f.payload.id)),s=r.map((f,m)=>l.has(f.payload.id)?m:-1).filter(f=>f>=0);if(s.length===0)return;let h=n===1?s[s.length-1]+1:s[0]-1;for(;h>=0&&h<r.length&&!o(r[h]);)h+=n;if(h<0||h>=r.length)return;let p=r[h],c=P(e,i.parentId),d=V(e,p.payload.groupId),u;if(c!==void 0&&!d.includes(c)){let f=new Set(Z(e,c.id).map(m=>m.payload.id));for(let m of l)f.delete(m);u=tt(r,l,f,n===1),c.parentId===void 0?delete i.parentId:i.parentId=c.parentId}else{let f=c===void 0?d.length:d.indexOf(c),m=f>0?d[f-1]:void 0,y=m?new Set(Z(e,m.id).map(C=>C.payload.id)):new Set([p.payload.id]);u=tt(r,l,y,n===1)}e.elements=[...u,...a],B(e),ie(e)}var k={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","httpShowResult","groups","notes","hidden","linkId","control","legacyControlEntityId","pages"],group:["id","name","locked","parentId"],pages:["count","mode","dwell"],inline:["label","value","symbol","countdown","parts"],inlinePart:["id","value","symbol"],control:["kind","title","valueLabel","state","symbol","symbolOff","tintColorHex","coloring","bands","bandAboveColorHex","status","action"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","duration","timestamp","hideMinutes","hideDayPeriod","showSeconds","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],chartAnchor:["layer","at","place","dx","dy"],fill:["kind","stops","angle"],fillStop:["at","colorHex"],level:["value","minValue","maxValue","minSource","maxSource","direction","trackColorHex"],gaugeTicks:["count","length","colorHex","majorEvery"],gaugeLabels:["show","size","colorHex"],arc:["radius","angle","sweep","spacing","flip"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","opacity","shadow","groupId","name","accentGroup"],elementPage:["page"],shadow:["colorHex","radius","dx","dy"],text:["value","fontSize","fontWeight","countdown","monospacedDigits","lineLimit","fontDesign","fontWidth","italic","minimumScale","alignment","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex","parts","arc","chartAnchor"],textPart:["id","value","icon","iconPaths","colorHex","fontWeight","fontSize","fontDesign","fontWidth","italic","tracking","coloring","bands","bandAboveColorHex"],icon:["symbol","path","viewBox","size","level","chartAnchor"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","total","minSource","maxSource","fill","ticks","labels"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes","highMarker","lowMarker","curve","fillStyle","fillColorHex","areaFill","barRadius","barCorners","smoothing","gaps","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","pointDots","pointDotSize","pointDotColorHex","gridLines","gridColorHex","zeroLine","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],timeline:["value","aggregate","historyMinutes","bands","otherColorHex","gap","cornerRadius","timeLabels","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes","drawsTimeLabels"],timelineAggregate:["entities","combine"],shape:["kind","cornerRadius","thickness","borderColorHex","borderWidth","fill","level","chartAnchor"],image:["entity","source","data","format","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY","chartAnchor"],tap:["action","openPageId","openPageName","attachedTo","grow","confirm"],chartTimes:["chart","timeLabelCount","labelSize","labelColorHex","hourCycle","minutes","fontWeight","fontDesign","fontWidth","italic","monospacedDigits"],chartDots:["chart","dots","size","colorHex"],chartGrid:["chart","lines","colorHex","thickness"],imageTime:["image","size"],list:["source","rows","direction","columns","gap","template"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise","partId"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight","design","width","italic","path"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","parkedCurvedText","parkedCurvedColorHex","bezelGauge","backgroundColorHex","backgroundFill","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName","serviceDomain","serviceName","serviceDataJSON","targets","allPlaced","layerIds","targetLayers","page"]},Qn={literal:["kind","value"],entityState:["kind",...k.entityRef],entityAttribute:["kind",...k.entityRef,"attribute"],entityAge:["kind",...k.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"],item:["kind","field"],listStat:["kind","layer","stat"],imageTime:["kind","layer"]},vl={entities:["kind","scope","deviceClass","stateFilter","sort","descending","attributes"],attribute:["kind",...k.entityRef,"attribute"],template:["kind","value"],calendar:["kind","entities","hours"],todo:["kind","entities","status","sort"],forecast:["kind",...k.entityRef,"type"]};function ep(e){let t=[],n=(c,d,u)=>{if(g(c))for(let f of Object.keys(c))d.includes(f)||t.push(`${u}.${f}`)},o=(c,d)=>{if(!g(c))return;let u=typeof c.kind=="string"?c.kind:"";n(c,Qn[u]??["kind"],d),u==="aggregate"&&g(c.aggregate)&&(n(c.aggregate,k.aggregate,`${d}.aggregate`),n(c.aggregate.scope,k.scope,`${d}.aggregate.scope`),g(c.aggregate.scope)&&Array.isArray(c.aggregate.scope.entities)&&c.aggregate.scope.entities.forEach((f,m)=>n(f,k.entityRef,`${d}.aggregate.scope.entities[${m}]`)),n(c.aggregate.stateFilter,k.stateFilter,`${d}.aggregate.stateFilter`))},i=(c,d)=>{if(g(c)){if(g(c.kind))n(c,k.value,d),o(c.kind,`${d}.kind`);else{let u=typeof c.kind=="string"?c.kind:"";n(c,[...Qn[u]??["kind"],"format"],d),u==="aggregate"&&o(c,d)}n(c.format,k.format,`${d}.format`)}},r=(c,d)=>{g(c)&&(n(c,k.fill,d),Array.isArray(c.stops)&&c.stops.forEach((u,f)=>n(u,k.fillStop,`${d}.stops[${f}]`)))},a=(c,d)=>{Array.isArray(c)&&c.forEach((u,f)=>{n(u,k.styleChange,`${d}[${f}]`),g(u)&&i(u.value,`${d}[${f}].value`)})},l=(c,d)=>{Array.isArray(c)&&c.forEach((u,f)=>{let m=`${d}[${f}]`;n(u,k.rule,m),g(u)&&(Array.isArray(u.cases)&&u.cases.forEach((y,C)=>{let L=`${m}.cases[${C}]`;n(y,k.case,L),g(y)&&(n(y.when,k.condition,`${L}.when`),g(y.when)&&Array.isArray(y.when.tests)&&y.when.tests.forEach((D,or)=>{let He=`${L}.when.tests[${or}]`;n(D,k.test,He),g(D)&&(i(D.value,`${He}.value`),n(D.comparison,k.comparison,`${He}.comparison`),g(D.comparison)&&(i(D.comparison.value,`${He}.comparison.value`),i(D.comparison.upper,`${He}.comparison.upper`)))}),a(y.then,`${L}.then`))}),a(u.otherwise,`${m}.otherwise`))})};if(!g(e))return t;n(e,k.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((c,d)=>n(c,k.group,`$.groups[${d}]`)),Array.isArray(e.values)&&e.values.forEach((c,d)=>{n(c,k.named,`$.values[${d}]`),g(c)&&i(c.value,`$.values[${d}].value`)});let s=(c,d)=>{if(!g(c))return;let u=typeof c.kind=="string"?c.kind:"";n(c,vl[u]??["kind"],d),u==="entities"&&(n(c.scope,k.scope,`${d}.scope`),g(c.scope)&&Array.isArray(c.scope.entities)&&c.scope.entities.forEach((f,m)=>n(f,k.entityRef,`${d}.scope.entities[${m}]`)),n(c.stateFilter,k.stateFilter,`${d}.stateFilter`)),(u==="calendar"||u==="todo")&&Array.isArray(c.entities)&&c.entities.forEach((f,m)=>n(f,k.entityRef,`${d}.entities[${m}]`))},h=(c,d,u=!0)=>{if(n(c,k.elementEnvelope,d),!g(c)||!g(c.payload))return;let f=typeof c.kind=="string"?c.kind:"",m=k[f]??[];n(c.payload,[...k.elementBase,...u?k.elementPage:[],...m],`${d}.payload`),n(c.payload.colorSlot,k.colorSlot,`${d}.payload.colorSlot`),n(c.payload.frame,k.frame,`${d}.payload.frame`),"chartAnchor"in c.payload&&n(c.payload.chartAnchor,k.chartAnchor,`${d}.payload.chartAnchor`),"shadow"in c.payload&&n(c.payload.shadow,k.shadow,`${d}.payload.shadow`);for(let y of["fill","areaFill"])y in c.payload&&r(c.payload[y],`${d}.payload.${y}`);if("ticks"in c.payload&&n(c.payload.ticks,k.gaugeTicks,`${d}.payload.ticks`),"labels"in c.payload&&n(c.payload.labels,k.gaugeLabels,`${d}.payload.labels`),g(c.payload.level)){let y=`${d}.payload.level`;n(c.payload.level,k.level,y);for(let C of["value","minSource","maxSource"])C in c.payload.level&&i(c.payload.level[C],`${y}.${C}`)}l(c.payload.rules,`${d}.payload.rules`);for(let y of["value","symbol","nowIndex","total","minSource","maxSource"])y in c.payload&&i(c.payload[y],`${d}.payload.${y}`);if(f==="text"&&"arc"in c.payload&&n(c.payload.arc,k.arc,`${d}.payload.arc`),f==="timeline"&&"aggregate"in c.payload&&n(c.payload.aggregate,k.timelineAggregate,`${d}.payload.aggregate`),f==="text"&&Array.isArray(c.payload.parts)&&c.payload.parts.forEach((y,C)=>{n(y,k.textPart,`${d}.payload.parts[${C}]`),g(y)&&i(y.value,`${d}.payload.parts[${C}].value`),g(y)&&"icon"in y&&i(y.icon,`${d}.payload.parts[${C}].icon`)}),f==="image"&&n(c.payload.entity,k.entityRef,`${d}.payload.entity`),f==="tap"&&n(c.payload.action,k.tapAction,`${d}.payload.action`),f==="list"){s(c.payload.source,`${d}.payload.source`);let y=Array.isArray(c.payload.template)?c.payload.template:[];y.length>is&&t.push(`${d}.payload.template.length`),y.forEach((C,L)=>{let D=`${d}.payload.template[${L}]`;g(C)&&Po.includes(String(C.kind))?t.push(`${D}.kind`):h(C,D,!1)})}};Array.isArray(e.elements)&&e.elements.forEach((c,d)=>h(c,`$.elements[${d}]`));let p=[];if(Array.isArray(e.perFamily))for(let c=0;c+1<e.perFamily.length;c+=2)p.push([String(e.perFamily[c]),e.perFamily[c+1]]);else g(e.perFamily)&&p.push(...Object.entries(e.perFamily));for(let[c,d]of p){let u=`$.perFamily.${c}`;if(n(d,k.layout,u),!!g(d)){if(g(d.placements))for(let[f,m]of Object.entries(d.placements))n(m,k.placement,`${u}.placements.${f}`),g(m)&&n(m.frame,k.frame,`${u}.placements.${f}.frame`);if(i(d.bezelText,`${u}.bezelText`),i(d.curvedText,`${u}.curvedText`),i(d.parkedCurvedText,`${u}.parkedCurvedText`),"backgroundFill"in d&&r(d.backgroundFill,`${u}.backgroundFill`),g(d.bezelGauge)){let f=`${u}.bezelGauge`;n(d.bezelGauge,k.bezelGauge,f),i(d.bezelGauge.value,`${f}.value`),i(d.bezelGauge.minLabel,`${f}.minLabel`),i(d.bezelGauge.maxLabel,`${f}.maxLabel`)}l(d.rules,`${u}.rules`)}}if(g(e.inline)&&(n(e.inline,k.inline,"$.inline"),i(e.inline.value,"$.inline.value"),Array.isArray(e.inline.parts)&&e.inline.parts.forEach((c,d)=>{n(c,k.inlinePart,`$.inline.parts[${d}]`),g(c)&&i(c.value,`$.inline.parts[${d}].value`)})),g(e.pages)&&n(e.pages,k.pages,"$.pages"),g(e.control)){n(e.control,k.control,"$.control");for(let c of["title","valueLabel","state","status"])c in e.control&&i(e.control[c],`$.control.${c}`);n(e.control.action,k.tapAction,"$.control.action")}return n(e.tapAction,k.tapAction,"$.tapAction"),t}function M(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let t=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),n=(8+Math.floor(Math.random()*4)).toString(16)+t().slice(1);return`${t()}${t()}-${t()}-4${t().slice(1)}-${n}-${t()}${t()}${t()}`.toUpperCase()}function gt(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function pi(){return S("Text")}function tp(e){return e?.curvedText!==void 0?"curved":"canvas"}function np(e,t){t==="curved"?(e.curvedText===void 0&&(e.curvedText=e.parkedCurvedText??pi(),e.parkedCurvedColorHex!==void 0&&(e.curvedColorHex=e.parkedCurvedColorHex)),delete e.parkedCurvedText,delete e.parkedCurvedColorHex):e.curvedText!==void 0&&(e.parkedCurvedText=e.curvedText,e.curvedColorHex!==void 0?e.parkedCurvedColorHex=e.curvedColorHex:delete e.parkedCurvedColorHex,delete e.curvedText,delete e.curvedColorHex)}function op(e){return e!==void 0&&(e.curvedText!==void 0||e.bezelText!==void 0||e.bezelGauge!==void 0)}function kl(){return{value:S("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]}}function hi(e,t,n="rectangular"){let o=Cl(e,t,n===null?[]:[n]),i=o.perFamily.corner;return i&&(i.curvedText=pi(),i.bezelGauge=kl(),o.schemaVersion=$t(o)),o}function Cl(e,t,n){let o={};for(let r of H)n.includes(r)&&(o[r]=gt());let i={schemaVersion:4,id:M(),name:e,values:[],slotIndex:t,elements:[],supportedFamilies:Ie.filter(r=>n.includes(r)),perFamily:o,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return n.includes("inline")&&(i.inline={value:S("Text")}),i.schemaVersion=$t(i),i}function Sl(e){let t=fs(e.tapAction.type)?structuredClone(e.tapAction):{type:"toggleEntity",entityId:"",displayName:"",domain:""};return{kind:"toggle",title:S(e.name.trim()||"Control"),symbol:Oo,coloring:"uniform",bands:[],action:t}}function ip(e){return e.control===void 0}function Tl(e){return e.control!==void 0&&e.supportedFamilies.length===0}function Al(e,t){if(!t){if(Tl(e))return;delete e.control;return}e.control===void 0&&(e.control=Sl(e))}function rp(e,t,n){let o=hi(e,t,n??null);return Al(o,!0),o}function N(e){let t=n=>({id:M(),colorSlot:{baseColorHex:n},rules:[],frame:{...ho},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...t("#FFFFFF"),value:S("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...t("#FFFFFF"),symbol:S("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...t("#FFFFFF"),value:S("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40",coloring:"uniform",bands:[],bandAboveColorHex:G,thresholdColorHex:Xt}};case"chart":return{kind:e,payload:{...t("#FFFFFF"),value:S("13,14,16,17,19,22,24,28,30"),historyMinutes:wa,historyPoints:24,source:Gt,statPeriod:Wt,statType:Ut,style:"bars",curve:"smooth",fillStyle:"fade",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:xe,lowColorHex:be,marker:"none",coloring:"uniform",bands:[],bandAboveColorHex:G,fillBands:!1,thresholdColorHex:Yt,nowColorHex:Zt,timeLabelCount:ce,labelSize:X,labelColorHex:Y,labelsAbove:!1,hourCycle:ue,minutes:pe}};case"timeline":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,value:S(""),historyMinutes:Pa,bands:[],otherColorHex:Ia,gap:0,cornerRadius:Ra,timeLabelCount:To,labelSize:X,labelColorHex:Y,labelsAbove:!1,hourCycle:ue,minutes:pe}}}case"shape":return{kind:e,payload:{...t("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,thickness:1,borderWidth:1}};case"image":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,entity:{entityId:"",displayName:"",domain:"camera"},source:"camera",contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:Wa,timestampCorner:"topLeading",timestampSize:ht}}}case"tap":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,action:{type:"refresh"}}}}case"chartTimes":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,chart:"",timeLabelCount:ce,labelSize:X,labelColorHex:Y,hourCycle:ue,minutes:pe}}}case"imageTime":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,image:""}}}case"chartDots":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,chart:"",dots:"auto"}}}case"chartGrid":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,chart:"",lines:Vt,colorHex:rt,thickness:Ot}}}case"list":{let{colorSlot:n,...o}=t("#FFFFFF");return{kind:e,payload:{...o,source:{kind:"entities",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},sort:"name",descending:!1,attributes:[]},rows:an,direction:"down",columns:sn,gap:ln,template:[]}}}}}function S(e){return{kind:{kind:"literal",value:e}}}function fi(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"timeline":return;case"shape":return;case"image":return;case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return;case"list":return}}var eo=["circular","corner"],to=Math.SQRT1_2;function El(e){return e==="text"||e==="icon"?4:.5}function mi(e,t,n,o){let i=structuredClone(e),r=_[t],a=_[n];if(t===n||!r||!a)return i;let l=eo.includes(t),s=eo.includes(n),h=l===s?1:s?to:1/to,p=Math.min(a.width/r.width,a.height/r.height)*h;if(h!==1){let c=i.frame,d=c.x+c.width/2,u=c.y+c.height/2;i.frame={...c,width:c.width*h,height:c.height*h,x:.5+(d-.5)*h-c.width*h/2,y:.5+(u-.5)*h-c.height*h/2}}return i.size!==void 0&&(i.size=Math.max(El(o),Math.round(i.size*p*10)/10)),i}function Fl(e,t){if(!t)return e;let n={...e.payload,frame:t.frame,isHidden:t.isHidden};return t.size!==void 0&&(e.kind==="text"?n.fontSize=t.size:e.kind==="icon"?n.size=t.size:(e.kind==="gauge"||e.kind==="chart")&&(n.lineWidth=t.size)),{kind:e.kind,payload:n}}function ap(e,t){let n=e.perFamily[t];return!n||Object.keys(n.placements).length===0?e.elements:e.elements.map(o=>Fl(o,n.placements[o.payload.id]))}function Ee(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"timeline":return e.payload.value;case"shape":return;case"image":return e.payload.source==="inline"?void 0:{kind:{kind:"entityState",...e.payload.entity}};case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return;case"list":return}}function Be(e){let t=[],n=o=>{for(let i of o)i.value&&t.push(i.value)};for(let o of e){for(let i of o.cases){for(let r of i.when.tests)t.push(r.value),r.comparison.value&&t.push(r.comparison.value),r.comparison.upper&&t.push(r.comparison.upper);n(i.then)}o.otherwise&&n(o.otherwise)}return t}var Hl=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function nt(e,t){let n,o=t;for(let i=0;o!==void 0&&i<4;i++){let r=o.kind;if(r.kind==="chartStat"){o=Ns(e,o)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let a={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return n===void 0?{ref:a}:{ref:a,namedId:n}}if(r.kind!=="named")return;n=r.id.toUpperCase(),o=e.values.find(a=>a.id.toUpperCase()===n)?.value}}function Ll(e,t){return nt(e,Ee(t))?.ref}function _l(e,t){let n=Ll(e,t),o=n&&(n.domain||n.entityId.split(".")[0])||"";return n&&Hl.includes(o)?{type:"toggleEntity",...n,domain:o}:{type:"refresh"}}function no(e,t,n){if(Mo(t)||n.width<=0||n.height<=0)return{...e};let o=t,i=e.x-o.left/n.width,r=e.x+e.width+o.right/n.width,a=e.y-o.top/n.height,l=e.y+e.height+o.bottom/n.height;return r<i&&(i=r=(i+r)/2),l<a&&(a=l=(a+l)/2),i=W(i),r=W(r),a=W(a),l=W(l),{...e,x:i,y:a,width:Math.max(0,r-i),height:Math.max(0,l-a)}}function gi(e,t,n){let o=i=>Math.round(i*100)/100||0;return{left:o((e.x-t.x)*n.width),right:o((t.x+t.width-e.x-e.width)*n.width),top:o((e.y-t.y)*n.height),bottom:o((t.y+t.height-e.y-e.height)*n.height)}}function sp(e,t,n,o){let i=e.elements.find(d=>d.payload.id===t);if(!i||i.kind!=="tap"||i.payload.attachedTo===void 0)return;let r=e.elements.find(d=>d.payload.id===i.payload.attachedTo);if(!r)return;let a=e.perFamily[n]?.placements[r.payload.id]?.frame??r.payload.frame,l=W(o.x),s=W(o.y),h=W(o.x+o.width),p=W(o.y+o.height),c={...o,x:l,y:s,width:Math.max(0,h-l),height:Math.max(0,p-s)};i.payload.outset=gi(a,c,_[n])}function lp(e,t,n){let o=e.elements.find(l=>l.payload.id===t);if(!o)return;let i=e.perFamily[n];if(!i)return;let r=i.placements[t]?.frame??o.payload.frame,a=_[n];return{width:r.width*a.width,height:r.height*a.height}}function fe(e,t){return e.elements.filter(n=>n.kind==="tap"&&n.payload.attachedTo===t)}function R(e,t){return t.kind!=="tap"||t.payload.attachedTo===void 0?!1:e.elements.some(n=>n.payload.id===t.payload.attachedTo&&n.kind!=="tap")}function Ml(e,t){for(let n of e.elements)if(n.kind==="list"&&n.payload.template.some(o=>o.payload.id===t))return n}function dp(e,t){let n=e.elements.find(o=>o.payload.id===t);if(!n)return Ml(e,t)?.payload.id;if(n.kind==="tap"&&n.payload.attachedTo!==void 0){let o=e.elements.find(i=>i.payload.id===n.payload.attachedTo);if(o)return o.payload.id}return n.payload.id}function Fe(e){let t=new Map(e.elements.map(i=>[i.payload.id,i])),n=new Map;for(let i of e.elements){if(i.kind!=="tap")continue;let r=i.payload.attachedTo;if(r===void 0)continue;let a=t.get(r);if(!a||a.kind==="tap"||r===i.payload.id){delete i.payload.attachedTo;continue}let l=n.get(r);l?l.push(i):n.set(r,[i])}if(n.size===0)return;for(let[i,r]of n){let a=t.get(i);for(let l of r){let s=l.payload;s.outset===void 0&&(s.outset=gi(a.payload.frame,s.frame,_.rectangular));let h=s.outset,p=!Mo(h);l.payload.frame=no(a.payload.frame,h,_.rectangular),l.payload.isHidden=a.payload.isHidden,a.payload.page===void 0?delete l.payload.page:l.payload.page=a.payload.page;let c=zl(e,i);for(let d of H){let u=e.perFamily[d];if(!u)continue;let f=_[d],m=u.placements[i];d!==c||!m?delete u.placements[l.payload.id]:p?u.placements[l.payload.id]={frame:no(m.frame,h,f),isHidden:m.isHidden}:u.placements[l.payload.id]={frame:{...m.frame},isHidden:m.isHidden}}}}let o=[];for(let i of e.elements){if(i.kind==="tap"&&i.payload.attachedTo!==void 0)continue;o.push(i);let r=n.get(i.payload.id);r&&o.push(...r)}e.elements=o}function cp(e,t,n){let o=e.elements.find(l=>l.payload.id===t);if(!o||o.kind==="tap")return;let i=fe(e,t)[0];if(i)return i.payload;let r=N("tap"),a=r.payload;return a.attachedTo=t,a.outset={...Ja},a.action=n??_l(e,o),e.elements.push(r),Fe(e),a}function Il(e,t){let n=fe(e,t).map(o=>o.payload.id);if(n.length!==0){e.elements=e.elements.filter(o=>!n.includes(o.payload.id));for(let o of H)for(let i of n)delete e.perFamily[o]?.placements[i]}}function q(e,t){for(let r of qo(e,t))q(e,r.payload.id);for(let r of Os(e,t))q(e,r.payload.id);for(let r of Xs(e,t))q(e,r.payload.id);for(let r of Ys(e,t))q(e,r.payload.id);for(let r of Us(e,t))q(e,r.payload.id);for(let r of ke(e,t))delete r.payload.chartAnchor;let n=e.elements.find(r=>r.payload.id===t),o=n?V(e,n.payload.groupId).map(r=>r.id):[];Il(e,t),e.elements=e.elements.filter(r=>r.payload.id!==t);let i=n?.payload.chartAnchor;if(i&&(i.at==="threshold"||i.at==="now")&&!ke(e,i.layer).some(r=>r.payload.chartAnchor?.at===i.at)){let r=e.elements.find(a=>a.payload.id===i.layer);r?.kind==="chart"&&(i.at==="threshold"?(delete r.payload.thresholdValue,delete r.payload.drawsThreshold):(delete r.payload.nowIndex,delete r.payload.drawsNowLine))}for(let r of e.elements)r.kind==="chart"&&r.payload.scaleFrom===t&&delete r.payload.scaleFrom;for(let r of H)delete e.perFamily[r]?.placements[t];if(n?.kind==="list")for(let r of n.payload.template)for(let a of H)delete e.perFamily[a]?.placements[r.payload.id];Fe(e),B(e),n&&Pl(e,o.find(r=>P(e,r)!==void 0),Rl(n))}function Rl(e){if(e.payload.chartAnchor)return e.payload.chartAnchor.layer;switch(e.kind){case"text":{let t=e.payload.value.kind;return t.kind==="chartStat"||t.kind==="imageTime"?t.layer:void 0}case"chartTimes":return e.payload.chart;case"chartDots":return e.payload.chart;case"chartGrid":return e.payload.chart;case"imageTime":return e.payload.image;default:return}}function Pl(e,t,n){if(t===void 0||n===void 0||!e.groups?.some(i=>i.id===t))return;let o=Z(e,t);o.length===1&&o[0].payload.id===n&&bl(e,t)}function up(e,t){let n=e.elements.findIndex(s=>s.payload.id===t),o=e.elements[n];if(!o)return;let i=M(),r=structuredClone(o);r.payload.id=i,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let a=[r],l=[[t,i]];for(let s of fe(e,t)){let h=structuredClone(s);h.payload.id=M(),h.payload.attachedTo=i,a.push(h),l.push([s.payload.id,h.payload.id])}e.elements.splice(n+1,0,...a);for(let s of H){let h=e.perFamily[s];if(h)for(let[p,c]of l){let d=h.placements[p];d&&(h.placements[c]=structuredClone(d))}}return Fe(e),i}function Nl(e,t){let n=/^(.*\S) \d+$/.exec(e)?.[1]??e,o=new Set(t),i=2;for(;o.has(`${n} ${i}`);)i++;return`${n} ${i}`}function pp(e,t,n){let o=e.elements.findIndex(l=>l.payload.id===t),i=e.elements[o];if(!i||i.kind!=="chart")return;let r=M(),a=structuredClone(i);a.payload.id=r,a.payload.scaleFrom=t,n&&(a.payload.name=Nl(n(i),e.elements.map(n))),e.elements.splice(o+1,0,a);for(let l of H){let s=e.perFamily[l],h=s?.placements[t];s&&h&&(s.placements[r]=structuredClone(h))}return r}function yi(e,t,n){let o=new Set,i=p=>{o.add(p);for(let c of fe(e,p))o.add(c.payload.id)};for(let p of t){i(p);for(let c of qo(e,p))i(c.payload.id)}let r=e.elements.filter(p=>o.has(p.payload.id)).map(p=>structuredClone(p)),a=r.flatMap(p=>p.kind==="list"?[p.payload.id,...p.payload.template.map(c=>c.payload.id)]:[p.payload.id]),l={};for(let p of H){let c=e.perFamily[p];if(!c)continue;let d={};for(let u of a){let f=c.placements[u];f&&(d[u]=structuredClone(f))}Object.keys(d).length>0&&(l[p]=d)}let s=new Set;for(let p of r)for(let c of V(e,p.payload.groupId))s.add(c.id);let h=(e.groups??[]).filter(p=>s.has(p.id)).map(p=>structuredClone(p));return{elements:r,placements:l,groups:h,...n!==void 0?{family:n}:{}}}function hp(e,t,n){let o=t.family,i=o!==void 0&&o!==n&&$e(o);if(!$e(n))return ot(e,t);let r=ot(e,t,i?{nudge:!1}:{}),a=e.perFamily[n]??(e.perFamily[n]=gt());for(let l of r){let s=e.elements.find(d=>d.payload.id===l);if(!s)continue;let h=(o!==void 0?e.perFamily[o]?.placements[l]:void 0)??H.map(d=>e.perFamily[d]?.placements[l]).find(d=>d!==void 0),p=h?.size??fi(s),c={frame:{...h?.frame??s.payload.frame},isHidden:!1,...p!==void 0?{size:p}:{}};for(let d of H)d!==n&&delete e.perFamily[d]?.placements[l];a.placements[l]=i?mi(c,o,n,s.kind):c}return bi(e,n),r}function Dl(e,t){let n=new Map,o=new Set(e.map(a=>a.id)),i=new Set,r=a=>{if(i.has(a.id))return 0;i.add(a.id);let l=t.filter(s=>s.payload.groupId===a.id).length;for(let s of e)s.parentId===a.id&&(l+=r(s));return l>=2?(n.set(a.id,M()),1):l};for(let a of e)(a.parentId===void 0||!o.has(a.parentId))&&r(a);return n}function ot(e,t,n={}){let o=new Map;for(let u of t.elements)if(o.set(u.payload.id,M()),u.kind==="list")for(let f of u.payload.template)o.set(f.payload.id,M());let i=new Set(e.elements.map(u=>u.payload.id)),r=n.nudge!==!1&&t.elements.some(u=>i.has(u.payload.id)),a=u=>r?{...u,x:Math.min(.9,u.x+.05),y:Math.min(.9,u.y+.05)}:u,l=[];for(let u of t.elements){let f=structuredClone(u);if(f.payload.id=o.get(u.payload.id),f.kind==="tap"&&f.payload.attachedTo!==void 0){let m=o.get(f.payload.attachedTo);m?f.payload.attachedTo=m:delete f.payload.attachedTo}if(f.kind==="chart"&&f.payload.scaleFrom!==void 0){let m=o.get(f.payload.scaleFrom);m?f.payload.scaleFrom=m:i.has(f.payload.scaleFrom)||delete f.payload.scaleFrom}if(f.kind==="text")for(let m of f.payload.parts??[]){let y=m.value.kind,C=y.kind==="chartStat"?o.get(y.layer):void 0;y.kind==="chartStat"&&C&&(y.layer=C)}if(f.kind==="text"&&f.payload.value.kind.kind==="chartStat"){let m=o.get(f.payload.value.kind.layer);if(m)f.payload.value.kind.layer=m;else if(!i.has(f.payload.value.kind.layer))continue}if(f.kind==="chartTimes"||f.kind==="chartDots"||f.kind==="chartGrid"){let m=o.get(f.payload.chart);if(m)f.payload.chart=m;else if(!i.has(f.payload.chart))continue}if(f.kind==="imageTime"){let m=o.get(f.payload.image);if(m)f.payload.image=m;else if(!i.has(f.payload.image))continue}if(Kl(f,m=>{if(m.kind.kind!=="imageTime")return;let y=o.get(m.kind.layer);y&&(m.kind.layer=y)}),f.payload.chartAnchor!==void 0){let m=o.get(f.payload.chartAnchor.layer);m?f.payload.chartAnchor.layer=m:i.has(f.payload.chartAnchor.layer)||delete f.payload.chartAnchor}if(f.kind==="list")for(let m of f.payload.template){let y=o.get(m.payload.id);y&&(m.payload.id=y)}f.payload.frame=a(f.payload.frame),l.push(f)}let s=Dl(t.groups,l.filter(u=>!(u.kind==="tap"&&u.payload.attachedTo!==void 0))),h=new Map(t.groups.map(u=>[u.id,u])),p=u=>{let f=new Set,m=u===void 0?void 0:h.get(u);for(;m&&!f.has(m.id);){let y=s.get(m.id);if(y)return y;f.add(m.id),m=m.parentId===void 0?void 0:h.get(m.parentId)}};for(let u of t.groups){let f=s.get(u.id);if(!f)continue;let m={...structuredClone(u),id:f},y=p(u.parentId);y?m.parentId=y:delete m.parentId,(e.groups??=[]).push(m)}for(let u of l){if(u.payload.groupId===void 0)continue;let f=p(u.payload.groupId);f?u.payload.groupId=f:delete u.payload.groupId}e.elements.push(...l);let c=new Set(l.map(u=>u.payload.id)),d=new Set(l.flatMap(u=>u.kind==="list"?u.payload.template.map(f=>f.payload.id):[]));for(let u of H){let f=t.placements[u],m=e.perFamily[u];if(!(!f||!m))for(let[y,C]of Object.entries(f)){let L=o.get(y);L!==void 0&&(d.has(L)?m.placements[L]=structuredClone(C):c.has(L)&&(m.placements[L]={...structuredClone(C),frame:a(C.frame)}))}}return Fe(e),B(e),ie(e),l.filter(u=>!R(e,u)).map(u=>u.payload.id)}function xi(e,t,n){let o=e.perFamily[t],i=o?.placements[n.payload.id];return o&&Object.keys(o.placements).length>0&&i?!i.isHidden:!n.payload.isHidden}function zl(e,t){let n=e.elements.find(r=>r.payload.id===t),i=(n&&n.kind==="tap"?n.payload.attachedTo:void 0)??t;return H.find(r=>e.supportedFamilies.includes(r)&&e.perFamily[r]?.placements[i]!==void 0)}function wn(e,t){let n=e.perFamily[t];return n?e.elements.filter(o=>{let i=o.kind==="tap"?o.payload.attachedTo:void 0;return n.placements[i??o.payload.id]!==void 0}):[]}function fp(e,t){let n=e.perFamily[t];return n?wn(e,t).filter(o=>!R(e,o)&&!n.placements[o.payload.id]?.isHidden).length:0}function bi(e,t){let n=H.filter(l=>e.supportedFamilies.includes(l));if(n.length===0)return;let o=t!==void 0&&$e(t)&&n.includes(t)?t:n[0];for(let l of n)e.perFamily[l]||(e.perFamily[l]=gt());let i=()=>e.elements.filter(l=>!R(e,l)),r=new Map,a=new Set;if(t===void 0){let l=new Map(i().map(d=>[d.payload.id,n.filter(u=>xi(e,u,d))]));for(let[d,u]of l)u[0]&&r.set(d,u[0]);let s=new Map([...i().entries()].map(([d,u])=>[u.payload.id,d]));for(let d of n){let u=i().filter(y=>(l.get(y.payload.id)??[]).includes(d)&&r.get(y.payload.id)!==d).map(y=>y.payload.id);if(u.length===0)continue;let f=yi(e,u,d),m=ot(e,f,{nudge:!1});m.forEach((y,C)=>{r.set(y,d);let L=m.length===u.length?u[C]:void 0;s.set(y,L!==void 0?s.get(L)??0:s.size)})}for(let d of i())r.has(d.payload.id)||a.add(d.payload.id);let h=d=>n.indexOf(r.get(d)??o),p=i().sort((d,u)=>h(d.payload.id)-h(u.payload.id)||(s.get(d.payload.id)??0)-(s.get(u.payload.id)??0)),c=[];for(let d of p)c.push(d),c.push(...fe(e,d.payload.id));e.elements=c}for(let l of i()){let s=l.payload.id,h=n.filter(u=>e.perFamily[u].placements[s]!==void 0),p=r.get(s)??h.find(u=>!e.perFamily[u].placements[s].isHidden)??h[0]??o,c=e.perFamily[p]?.placements[s],d={frame:{...c?.frame??l.payload.frame},isHidden:a.has(s)||c?.isHidden===!0,...c?.size!==void 0?{size:c.size}:{}};l.payload.isHidden=!0;for(let u of H){let f=e.perFamily[u];f&&(u===p?f.placements[s]=d:delete f.placements[s])}}}function $l(e,t,n){let o=e.perFamily[n]??(e.perFamily[n]=gt()),i=wn(e,t).filter(s=>!R(e,s));if(i.length===0)return;let r=yi(e,i.map(s=>s.payload.id),t),a=ot(e,r,{nudge:!1}),l=e.perFamily[t];for(let s of a){let h=e.elements.find(u=>u.payload.id===s);if(!h)continue;let p=l?.placements[s],c=p?.size??fi(h),d={frame:{...p?.frame??h.payload.frame},isHidden:p?.isHidden??!1,...c!==void 0?{size:c}:{}};for(let u of H)u!==n&&delete e.perFamily[u]?.placements[s];o.placements[s]=mi(d,t,n,h.kind)}bi(e,n)}var Ol={small:"circular",medium:"rectangular"};function Vl(e,t){let n=H.filter(r=>r!==t&&r!=="corner"&&e.supportedFamilies.includes(r)&&wn(e,r).some(a=>!R(e,a))),o=$e(t)?Ol[t]:void 0;if(o!==void 0&&n.includes(o))return o;let i;for(let r of n)(i===void 0||_[r].width>_[i].width)&&(i=r);return i}function mp(e,t){if(!$e(t)||!e.supportedFamilies.includes(t))return;let n=e.perFamily[t];if(n&&Object.keys(n.placements).length>0)return;let o=Vl(e,t);if(o!==void 0)return $l(e,o,t),o}function Bl(e,t){let n=e.elements.find(r=>r.payload.id===t);if(!n)return[];let o=[],i=nt(e,Ee(n));if(i){let r=n.kind==="icon"?"symbol":n.kind==="image"?"camera":"value";o.push(i.namedId===void 0?{where:r,ref:i.ref}:{where:r,ref:i.ref,namedId:i.namedId})}for(let r of fe(e,t)){let a=r.payload.action;!("entityId"in a)||a.entityId===""||o.push({where:"tap",ref:{entityId:a.entityId,displayName:a.displayName,domain:a.domain},tapId:r.payload.id})}for(let r of n.payload.rules)for(let a of r.cases)for(let l of a.when.tests){let s=nt(e,l.value);if(!s)continue;let h={where:"test",ref:s.ref,ruleId:r.id,caseId:a.id,testId:l.id};s.namedId!==void 0&&(h.namedId=s.namedId),o.push(h)}return o}function Gl(e,t){return Bl(e,t)[0]?.ref}function Me(e,t,n){if(!e)return;let o=e.kind;switch(o.kind){case"entityState":return{...e,kind:{kind:"entityState",...t}};case"entityAge":return{...e,kind:{kind:"entityAge",...t}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...t,attribute:o.attribute}};case"literal":return n==="text"||n==="gauge"||n==="chart"||n==="timeline"?{...e,kind:{kind:"entityState",...t}}:void 0;default:return}}function gp(e,t,n,o){let i=e.elements.find(l=>l.payload.id===t);if(!i||n.entityId==="")return;let r={...n,domain:n.domain||n.entityId.split(".")[0]||""},a=Gl(e,t)?.entityId;if(a!==void 0&&a!==r.entityId){let l=new Set;for(let s of i.payload.rules)for(let h of s.cases)for(let p of h.when.tests){let c=p.value.kind;if(c.kind==="named"){nt(e,p.value)?.ref.entityId===a&&l.add(c.id);continue}if(!("entityId"in c)||c.entityId!==a)continue;let d=Me(p.value,r,"icon");d&&(p.value=d)}for(let s of l){let h=e.values.find(c=>c.id.toUpperCase()===s.toUpperCase()),p=h?Me(h.value,r,"icon"):void 0;p&&Jl(e,s,p)}}if(i.kind==="timeline"){let l=i.payload.value.kind.kind==="entityState"?i.payload.value.kind.entityId:void 0,s=Me(i.payload.value,r,i.kind);s&&(i.payload.value=s),(i.payload.bands.length===0||l!==r.entityId)&&(i.payload.bands=i.payload.aggregate!==void 0?Gn(La):Gn(r.domain,o)),i.payload.aggregate!==void 0&&(i.payload.aggregate={...i.payload.aggregate,entities:i.payload.aggregate.entities.map((h,p)=>p===0?r.entityId:h)})}else if(i.kind==="image")i.payload.entity=r;else if(i.kind==="text"||i.kind==="gauge"||i.kind==="chart"){let l=Me(i.payload.value,r,i.kind);l&&(i.payload.value=l)}else if(i.kind==="icon"){let l=Me(i.payload.symbol,r,i.kind);l&&(i.payload.symbol=l)}for(let l of fe(e,t)){let s=l.payload;"entityId"in s.action&&(s.action={type:s.action.type,...r})}}var Wl={text:"text",icon:"icon",gauge:"gauge",chart:"chart",timeline:"timeline",shape:"shape",image:"picture",tap:"tap area",chartTimes:"clock times",chartDots:"chart dots",chartGrid:"chart grid",imageTime:"timestamp",list:"list"};function oo(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function io(e){if(e.part==="template")return"Template text";if(e.part==="serviceData")return"Service data";let t=e.layerKind===void 0?"":Wl[e.layerKind],n=e.layerName?`${t} "${e.layerName}"`:t;if(e.part==="listSource")return`Items of ${n}`;if(e.part==="listRow")return n===""?"List row":`Row of ${n}`;switch(e.kind){case"named":return e.valueName?`Shared value "${e.valueName}"`:"Shared value";case"layer":case"image":return e.part==="total"?`Total on ${n}`:e.part==="gaugeMin"?`Min on ${n}`:e.part==="gaugeMax"?`Max on ${n}`:e.part==="nowIndex"?`Now marker on ${n}`:e.part==="level"?`Fill on ${n}`:e.part==="levelMin"?`Fill min on ${n}`:e.part==="levelMax"?`Fill max on ${n}`:e.part==="textPart"?`Part of ${n}`:e.part==="timelineGroup"?`Combined on ${n}`:`${oo(t)} layer${e.layerName?` "${e.layerName}"`:""}`;case"tap":return"Tap area";case"documentTap":return"Tap action";case"rule":return n===""?`Rule on the ${e.family??"shared"} shape`:`Rule on ${n}`;case"layout":{let o=oo(e.family??"");switch(e.part){case"curvedText":return`${o} curved text`;case"bezelGauge":return`${o} bezel gauge`;case"bezelGaugeMin":return`${o} bezel gauge low label`;case"bezelGaugeMax":return`${o} bezel gauge high label`;default:return`${o} bezel`}}case"inline":return"Inline";case"control":switch(e.part){case"controlValue":return"Control Center value line";case"controlState":return"Control Center state";case"controlStatus":return"Control Center status text";default:return"Control Center"}}}var wi=/(['"])([a-z0-9_]+\.[a-z0-9_]+)\1/g,Ul="{item.";function ro(e){return e.startsWith(Ul)}function vn(e){let t=[];for(let n of e.matchAll(wi))n[2]!==void 0&&t.push(n[2]);return t}function yp(e,t){return t.size===0?e:e.replace(wi,(n,o,i)=>{let r=t.get(i);return r===void 0?n:`${o}${r}${o}`})}function ge(e){let t={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(t.iconName=e.iconName),t}function jl(e,t){if(t.payload.name)return t.payload.name;if(t.kind==="shape")return t.payload.kind==="roundedRectangle"?"rounded rectangle":t.payload.kind;if(t.kind==="tap")return"";if(t.kind==="image")return t.payload.entity.displayName||t.payload.entity.entityId;let n=Ee(t)?.kind;if(n===void 0)return"";if(n.kind==="literal")return n.value;if("entityId"in n)return n.displayName||n.entityId;if(n.kind==="named"){let o=n.id.toUpperCase();return e.values.find(i=>i.id.toUpperCase()===o)?.name??""}return""}function ne(e,t){let n=(s,h)=>{t.value?.(s,h);let p=s.kind;if(p.kind==="jinja"){if(t.text){let d=t.text(p.value,{...h,part:"template"});d!==p.value&&(p.value=d)}return}if(p.kind==="aggregate"){let d=p.aggregate.scope;if(t.ref&&d.kind==="entities")for(let u=0;u<d.entities.length;u++){let f=t.ref(ge(d.entities[u]),h);f&&(d.entities[u]=f)}return}if(!t.ref||!("entityId"in p))return;let c=t.ref(ge(p),h);c&&(p.kind==="entityAttribute"?s.kind={kind:"entityAttribute",...c,attribute:p.attribute}:p.kind==="entityState"?s.kind={kind:"entityState",...c}:s.kind={kind:"entityAge",...c})},o=(s,h,p)=>{if(s.type==="callService"){if(t.ref&&s.target!==void 0&&!ro(s.target.entityId)&&s.target.entityId!==""){let d=t.ref(ge(s.target),h);d&&(s.target=d)}if(t.text&&s.serviceDataJSON!==void 0){let d=t.text(s.serviceDataJSON,{...h,part:"serviceData"});d!==s.serviceDataJSON&&(s.serviceDataJSON=d)}return}if(!t.ref||!("entityId"in s)||s.entityId===""||ro(s.entityId))return;let c=t.ref(ge(s),h);c&&p({type:s.type,...c})};for(let s of e.values)n(s.value,{kind:"named",valueId:s.id,valueName:s.name});let i=(s,h)=>{if(s.kind==="image"){if(t.ref){let c=t.ref(ge(s.payload.entity),{...h,kind:"image"});c&&(s.payload.entity=c)}}else if(s.kind==="tap"){let c=s.payload;o(c.action,{...h,kind:"tap"},d=>{c.action=d})}else{let c=Ee(s);if(c&&n(c,h),s.kind==="text")for(let d of s.payload.parts??[])n(d.value,{...h,part:"textPart"}),d.icon&&n(d.icon,{...h,part:"textPart"});if(s.kind==="gauge"&&s.payload.total&&n(s.payload.total,{...h,part:"total"}),s.kind==="gauge"&&s.payload.minSource&&n(s.payload.minSource,{...h,part:"gaugeMin"}),s.kind==="gauge"&&s.payload.maxSource&&n(s.payload.maxSource,{...h,part:"gaugeMax"}),s.kind==="chart"&&s.payload.nowIndex&&n(s.payload.nowIndex,{...h,part:"nowIndex"}),s.kind==="icon"||s.kind==="shape"){let d=s.payload.level;d&&(n(d.value,{...h,part:"level"}),d.minSource&&n(d.minSource,{...h,part:"levelMin"}),d.maxSource&&n(d.maxSource,{...h,part:"levelMax"}))}if(s.kind==="timeline"&&t.ref&&s.payload.aggregate!==void 0){let d=s.payload.aggregate.entities;for(let u=0;u<d.length;u++){let f=d[u]??"";if(f==="")continue;let m=t.ref({entityId:f,displayName:"",domain:f.split(".")[0]??""},{...h,part:"timelineGroup"});m&&(d[u]=m.entityId)}}if(s.kind==="list"){r(s.payload.source,{...h,part:"listSource"});let d={...h,part:"listRow"};for(let u of s.payload.template)i(u,d)}}let p={...h,kind:"rule"};for(let c of Be(s.payload.rules))n(c,p)},r=(s,h)=>{if(s.kind==="template"){if(t.text){let c=t.text(s.value,{...h,part:"template"});c!==s.value&&(s.value=c)}return}if(!t.ref)return;let p=(c,d)=>{if(c.entityId==="")return;let u=t.ref(ge(c),h);u&&d(u)};switch(s.kind){case"entities":if(s.scope.kind==="entities"){let c=s.scope.entities;for(let d=0;d<c.length;d++)p(c[d],u=>{c[d]=u})}return;case"calendar":case"todo":{let c=s.entities;for(let d=0;d<c.length;d++)p(c[d],u=>{c[d]=u});return}case"attribute":case"forecast":p(s,c=>{s.entityId=c.entityId,s.displayName=c.displayName,s.domain=c.domain,c.iconName!==void 0?s.iconName=c.iconName:delete s.iconName});return}};for(let s of e.elements)i(s,{kind:"layer",layerId:s.payload.id,layerKind:s.kind,layerName:jl(e,s)});let a=Object.keys(e.perFamily).sort((s,h)=>{let p=Ie.indexOf(s),c=Ie.indexOf(h);return(p<0?Ie.length:p)-(c<0?Ie.length:c)});for(let s of a){let h=e.perFamily[s];if(!h)continue;let p={kind:"layout",family:s};h.bezelText&&n(h.bezelText,{...p,part:"bezelText"}),h.curvedText&&n(h.curvedText,{...p,part:"curvedText"});let c=h.bezelGauge;c&&(n(c.value,{...p,part:"bezelGauge"}),c.minLabel&&n(c.minLabel,{...p,part:"bezelGaugeMin"}),c.maxLabel&&n(c.maxLabel,{...p,part:"bezelGaugeMax"}));let d={kind:"rule",family:s};for(let u of Be(h.rules))n(u,d)}if(e.inline){n(e.inline.value,{kind:"inline"});for(let s of e.inline.parts??[])n(s.value,{kind:"inline",part:"textPart"})}let l=e.control;if(l){let s={kind:"control"};n(l.title,s),l.valueLabel&&n(l.valueLabel,{...s,part:"controlValue"}),l.state&&n(l.state,{...s,part:"controlState"}),l.status&&n(l.status,{...s,part:"controlStatus"}),o(l.action,s,h=>{l.action=h})}o(e.tapAction,{kind:"documentTap"},s=>{e.tapAction=s})}function re(e,t){ne(e,{value:t})}function Kl(e,t){let n=hi("",0);n.elements=[e],ne(n,{value:t})}function yt(e,t){return e.kind.kind==="named"&&e.kind.id.toUpperCase()===t.toUpperCase()}function xp(e,t){let n=new Set;return re(e,(o,i)=>{yt(o,t)&&n.add(i.layerId??`${i.kind}:${i.valueId??""}:${i.family??""}:${i.part??""}`)}),n.size}function Jl(e,t,n){let o=e.values.find(d=>d.id.toUpperCase()===t.toUpperCase());if(!o)return;let r=(d=>"entityId"in d.kind&&d.kind.entityId!==""?d.kind.entityId:void 0)(o.value);o.value=n;let a="entityId"in n.kind?{entityId:n.kind.entityId,displayName:n.kind.displayName,domain:n.kind.domain}:void 0;if(r===void 0||a===void 0||a.entityId===""||a.entityId===r)return;let l=new Set;re(e,(d,u)=>{u.layerId!==void 0&&yt(d,t)&&l.add(u.layerId)});let s=new Map(e.elements.map(d=>[d.payload.id,d])),h=d=>{let u=s.get(d);if(!u)return;let f=u.kind==="tap"&&u.payload.attachedTo!==void 0?s.get(u.payload.attachedTo)??u:u;return V(e,f.payload.groupId).at(-1)?.id},p=new Set;for(let d of l){let u=h(d);u!==void 0&&p.add(u)}let c=d=>{if(l.has(d))return!0;let u=s.get(d);if(u?.kind==="tap"&&u.payload.attachedTo!==void 0&&l.has(u.payload.attachedTo))return!0;let f=h(d);return f!==void 0&&p.has(f)};Yl(e,(d,u)=>{if(!(d.entityId!==r||u.kind==="named"||u.layerId===void 0||!c(u.layerId)))return{...a,domain:a.domain||a.entityId.split(".")[0]||""}})}function bp(e,t){let n=new Set;return re(e,(o,i)=>{i.layerId!==void 0&&yt(o,t)&&n.add(i.layerId)}),e.elements.map(o=>o.payload.id).filter(o=>n.has(o))}function ql(e,t){let n=new Set(e.values.map(i=>i.name.trim().toLowerCase())),o=t.trim()||"Value";if(!n.has(o.toLowerCase()))return o;for(let i=2;;i++){let r=`${o} ${i}`;if(!n.has(r.toLowerCase()))return r}}function wp(e,t,n){let o={id:M(),name:ql(e,n),value:{kind:structuredClone(t.kind)}},i={kind:{kind:"named",id:o.id}};return t.format&&!ve(t.format)&&(i.format=structuredClone(t.format)),{named:o,ref:i}}function Xl(e,t){if(t.kind.kind!=="named")return;let n=t.kind.id,o=e.values.find(a=>a.id.toUpperCase()===n.toUpperCase());if(!o)return;let i=t.format&&!ve(t.format)?t.format:o.value.format,r={kind:structuredClone(o.value.kind)};return i&&!ve(i)&&(r.format=structuredClone(i)),r}function vp(e,t){re(e,n=>{if(!yt(n,t))return;let o=Xl(e,n);o&&(n.kind=o.kind,o.format?n.format=o.format:delete n.format)}),e.values=e.values.filter(n=>n.id.toUpperCase()!==t.toUpperCase())}function Yl(e,t){ne(e,{ref:t})}function kp(e,t){ne(e,{text:t})}function Cp(e,t){let n=[],o={ref:(i,r)=>{i.entityId!==""&&n.push({entityId:i.entityId,ref:i,where:io(r)})}};return t&&(o.text=(i,r)=>{for(let a of vn(i)){let l=a.split(".")[0]??"";t(a,l)&&n.push({entityId:a,ref:{entityId:a,displayName:"",domain:l},where:io(r)})}return i}),ne(e,o),n}function Sp(e,t,n){let o=d=>{switch(d.kind){case"control":return t.kind==="control";case"layer":case"image":case"tap":{if(t.kind!=="family")return!1;let u=e.elements.find(m=>m.payload.id===d.layerId);if(!u)return!1;let f=u.kind==="tap"&&u.payload.attachedTo!==void 0?e.elements.find(m=>m.payload.id===u.payload.attachedTo)??u:u;return xi(e,t.family,f)}case"layout":case"rule":return t.kind==="family"&&d.family===t.family;case"documentTap":case"inline":return t.kind==="family";case"named":return!1}},i=new Set,r={value:(d,u)=>{d.kind.kind==="named"&&(o(u)||u.kind==="named"&&u.valueId!==void 0&&i.has(u.valueId))&&i.add(d.kind.id)}},a=-1;for(let d=0;d<4&&a!==i.size;d++)a=i.size,ne(e,r);let l=d=>o(d)||d.kind==="named"&&d.valueId!==void 0&&i.has(d.valueId),s=[],h=new Set,p=d=>{d===""||h.has(d)||(h.add(d),s.push(d))},c={ref:(d,u)=>{l(u)&&p(d.entityId)}};return n&&(c.text=(d,u)=>{if(l(u))for(let f of vn(d))n(f,f.split(".")[0]??"")&&p(f);return d}),ne(e,c),{entityIds:s,namedIds:[...i]}}function Tp(e,t,n,o=!0){let i=new Set,r=new Set,a=s=>{s.kind==="named"&&s.valueId!==void 0?r.add(s.valueId.toUpperCase()):s.layerId!==void 0&&i.add(s.layerId)},l={ref:(s,h)=>{s.entityId===t&&a(h)}};n&&(l.text=(s,h)=>{for(let p of vn(s))p===t&&n(p,p.split(".")[0]??"")&&a(h);return s}),ne(e,l);for(let s=o&&r.size>0;s;)s=!1,re(e,(h,p)=>{if(!(h.kind.kind!=="named"||!r.has(h.kind.id.toUpperCase())))if(p.kind==="named"&&p.valueId!==void 0){let c=p.valueId.toUpperCase();r.has(c)||(r.add(c),s=!0)}else p.layerId!==void 0&&i.add(p.layerId)});return vi(e,i)}function Ap(e,t){let n=new Set([t.toUpperCase()]),o=new Set;for(let i=!0;i;)i=!1,re(e,(r,a)=>{if(!(r.kind.kind!=="named"||!n.has(r.kind.id.toUpperCase())))if(a.kind==="named"&&a.valueId!==void 0){let l=a.valueId.toUpperCase();n.has(l)||(n.add(l),i=!0)}else a.layerId!==void 0&&o.add(a.layerId)});return vi(e,o)}function vi(e,t){let n=new Set;for(let o of e.elements)t.has(o.payload.id)&&n.add(R(e,o)&&o.kind==="tap"?o.payload.attachedTo:o.payload.id);return e.elements.map(o=>o.payload.id).filter(o=>n.has(o))}var ki={text:["color","opacity","text","fontSize","fontWeight","fontDesign","fontWidth","italic","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],timeline:["opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],chartTimes:["opacity","rotation","visibility"],chartDots:["opacity","visibility"],chartGrid:["opacity","visibility"],imageTime:["opacity","rotation","visibility"],list:["opacity","rotation","visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]};function Zl(e){let t=e.trim();return/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(t)?t:void 0}function Ql(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"timeBetween":return"times";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function ed(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setFontDesign":return"design";case"setFontWidth":return"width";case"setItalic":return"italic";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function td(){return{id:M(),value:S(""),comparison:{kind:"isOn"}}}function nd(){return{id:M(),when:{join:"all",tests:[td()]},then:[]}}function Ep(){return{id:M(),cases:[nd()]}}function ao(e,t){return e&&(e.kind.kind!=="literal"||Zl(e.kind.value)!==void 0)?e:S(t)}function Fp(e,t){let n={kind:t};switch(Ql(t)){case"value":n.value=e.value??S("");break;case"between":n.value=e.value??S(""),n.upper=e.upper??S("");break;case"times":n.value=ao(e.value,"22:00"),n.upper=ao(e.upper,"06:00");break;case"pattern":n.pattern=e.pattern??"";break;case"options":n.options=e.options??[];break;case"none":break}return n}function Hp(e){let t={kind:e};switch(ed(e)){case"value":t.value=S(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":t.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":t.weight="bold";break;case"design":t.design="rounded";break;case"width":t.width="condensed";break;case"italic":t.italic=!0;break;case"none":break}return t}function xt(e){let t=new TextEncoder().encode(e),n=0xcbf29ce484222325n,o=0x100000001b3n,i=0xffffffffffffffffn;for(let r of t)n^=BigInt(r),n=n*o&i;return n.toString(16)}function Si(e){return new Map(e.map(t=>[t.id.toUpperCase(),t.value]))}function Ci(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function od(e,t,n=0){let o=t instanceof Map?t:Si(t),i=e.kind;if(i.kind==="named"){if(n>8)return;let a=o.get(i.id.toUpperCase());return a?a.kind.kind==="named"?od(a,o,n+1):Ci(a.kind)?"n_"+i.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!Ci(i))return;let r=kn(i);if(r!==void 0)return"e_"+xt(r)}function z(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Ti(e){let t;if(e.scope.kind==="entities")t=`expand([${e.scope.entities.map(n=>z(n.entityId)).join(", ")}])`;else{let{domains:n,areaIds:o,labelIds:i,floorIds:r}=e.scope;if(!(o.length+i.length+r.length>0))t=n.length===0?"[]":"("+n.map(l=>`(states.${l} | list)`).join(" + ")+")";else{let l=[];for(let s of o)l.push(`area_entities(${z(s)})`);for(let s of i)l.push(`label_entities(${z(s)})`);r.length>0&&l.push(`((${r.map(s=>`floor_areas(${z(s)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),t=`(expand(${l.join(" + ")})`,n.length>0&&(t+=` | selectattr('domain', 'in', [${n.map(z).join(", ")}])`),t+=")"}}return t}function Ai(e){return e?e.kind==="isOn"?" | selectattr('state', 'eq', 'on')":e.kind==="isOff"?" | selectattr('state', 'eq', 'off')":e.kind==="equals"?` | selectattr('state', 'eq', ${z(e.value)})`:` | rejectattr('state', 'eq', ${z(e.value)})`:""}function id(e){let t=Ti(e)+Ai(e.stateFilter);if(e.function==="count")return`(${t} | list | count)`;let n=e.attribute?`attributes.${e.attribute}`:"state",o=`${t} | map(attribute=${z(n)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${o} | sum)`;case"average":return`(${o} | average(0))`;case"min":return`(${o} | min(default=0))`;case"max":return`(${o} | max(default=0))`}}var rd=" | rejectattr('state', 'in', ['unavailable', 'unknown'])";function Ei(e,t){let n=Se(t);switch(e.kind){case"entities":{let o=e.stateFilter,i=o?.kind==="equals"&&(o.value==="unavailable"||o.value==="unknown"),r=(e.deviceClass??"").trim(),a=r===""?"":` | selectattr('attributes.device_class', 'eq', ${z(r)})`,l=`(${Ti(e)})${i?"":rd}${a}${Ai(o)}`,s=e.attributes.map(c=>`, 'attr.${c}': s.attributes.get(${z(c)})`).join(""),h=e.descending?"true":"false",p=e.sort==="state"?`((ns.items | rejectattr('n', 'none') | sort(attribute='n', reverse=${h}) | list) + (ns.items | selectattr('n', 'none') | sort(attribute='state', reverse=${h}) | list))`:`(ns.items | sort(attribute='${e.sort==="lastChanged"?"lastChanged":"name"}', reverse=${h}) | list)`;return`{% set ns = namespace(items=[]) %}{% for s in ${l} %}{% set ns.items = ns.items + [{'entityId': s.entity_id, 'name': s.name[:120], 'state': s.state[:120], 'unit': s.attributes.get('unit_of_measurement'), 'domain': s.domain, 'deviceClass': s.attributes.get('device_class'), 'area': area_name(s.entity_id), 'lastChanged': (as_timestamp(s.last_changed) | round(0)), 'n': (s.state | float(none))${s}}] %}{% endfor %}{% set sorted = ${p} %}{{ {'items': sorted[:${n}], 'total': (sorted | count)} | to_json }}`}case"attribute":return`{% set a = state_attr(${z(e.entityId)}, ${z(e.attribute)}) %}{% if a is string or a is mapping or a is not iterable %}{% set a = [] %}{% endif %}{% set a = a | list %}{{ {'items': a[:${n}], 'total': (a | count)} | to_json }}`;case"template":{let o=e.value.trim();return o.length===0?void 0:o}default:return}}function Mp(e,t){let n=Ei(e,t);return n===void 0?void 0:"e_"+xt(n)}function ad(e){let t=n=>n.map(o=>o.entityId).filter(o=>o!=="");switch(e.kind){case"calendar":{let n=t(e.entities);return n.length===0?void 0:`calendar|${n.join(",")}|${e.hours}`}case"todo":{let n=t(e.entities);return n.length===0?void 0:`todo|${n.join(",")}|${e.status}|${e.sort}`}case"forecast":return e.entityId===""?void 0:`forecast|${e.entityId}|${e.type}`;default:return}}function sd(e,t){let n=Se(t),o=i=>i.map(r=>r.entityId).filter(r=>r!=="");switch(e.kind){case"calendar":{let i=o(e.entities);return i.length===0?void 0:{source:"calendar",entities:i,hours:e.hours,limit:n}}case"todo":{let i=o(e.entities);return i.length===0?void 0:{source:"todo",entities:i,status:e.status,sort:e.sort,limit:n}}case"forecast":return e.entityId===""?void 0:{source:"forecast",entity_id:e.entityId,type:e.type,limit:n};default:return}}function ld(e){let t=[];for(let n of e.elements)n.kind==="list"&&t.push(n.payload);return t}function Cn(e){let t=new Map;for(let n of ld(e)){let o=ad(n.source),i=sd(n.source,n.rows);if(o===void 0||i===void 0)continue;let r=t.get(o);r===void 0?t.set(o,i):i.limit>r.limit&&t.set(o,{...r,limit:i.limit})}return new Map([...t.entries()].sort(([n],[o])=>n<o?-1:n>o?1:0))}function kn(e){switch(e.kind){case"entityAttribute":return`state_attr(${z(e.entityId)}, ${z(e.attribute)})`;case"entityAge":{let t=z(e.entityId);return`(((now() - states[${t}].last_changed).total_seconds() if states[${t}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return id(e.aggregate);default:return}}function Fi(e){let t=new Map,n=new Map,o=Si(e),i=(a,l=0)=>{let s=a.kind;switch(s.kind){case"literal":case"dataAge":case"chartStat":case"item":case"listStat":case"imageTime":return;case"entityState":t.set(s.entityId,s);return;case"named":{if(l>8)return;let h=o.get(s.id.toUpperCase());if(!h)return;if(h.kind.kind==="named"){i(h,l+1);return}if(h.kind.kind==="entityState"){t.set(h.kind.entityId,h.kind);return}let p=kn(h.kind);if(p===void 0)return;n.set("n_"+s.id.toLowerCase().replace(/-/g,""),p);return}default:{let h=kn(s);if(h===void 0)return;n.set("e_"+xt(h),h)}}},r=a=>{let l=Ee(a);if(l&&i(l),a.kind==="text")for(let s of a.payload.parts??[])i(s.value),s.icon&&i(s.icon);if(a.kind==="gauge"&&a.payload.total&&i(a.payload.total),a.kind==="gauge"&&a.payload.minSource&&i(a.payload.minSource),a.kind==="gauge"&&a.payload.maxSource&&i(a.payload.maxSource),a.kind==="chart"&&a.payload.nowIndex&&i(a.payload.nowIndex),a.kind==="icon"||a.kind==="shape"){let s=a.payload.level;s&&(i(s.value),s.minSource&&i(s.minSource),s.maxSource&&i(s.maxSource))}if(a.kind==="list"){let s=Ei(a.payload.source,a.payload.rows);s!==void 0&&n.set("e_"+xt(s),s);for(let h of a.payload.template)r(h)}for(let s of Be(a.payload.rules))i(s)};return{entities:t,expressions:n,visit:i,visitElement:r}}function Ip(e,t){let n=Fi(t);return n.visitElement(e),new Set(n.expressions.keys())}function dd(e){let{entities:t,expressions:n,visit:o,visitElement:i}=Fi(e.values);for(let l of e.values)o({kind:{kind:"named",id:l.id}});for(let l of e.elements)i(l);for(let l of H){if(!e.supportedFamilies.includes(l))continue;let s=e.perFamily[l];if(s){s.bezelText&&o(s.bezelText),s.curvedText&&o(s.curvedText),s.bezelGauge&&(o(s.bezelGauge.value),s.bezelGauge.minLabel&&o(s.bezelGauge.minLabel),s.bezelGauge.maxLabel&&o(s.bezelGauge.maxLabel));for(let h of Be(s.rules))o(h)}}e.supportedFamilies.includes("inline")&&e.inline&&o(e.inline.value);let r=e.control;r&&(o(r.title),r.valueLabel&&o(r.valueLabel),r.state&&o(r.state),r.status&&o(r.status));let a={entities:t,expressions:n};return n.size>0&&(a.document=Hi(n)),a}function Hi(e){let t=[...e.keys()].sort(),n=[];for(let i of t){let r=e.get(i);r.includes("{{")||r.includes("{%")?n.push(`{% set v_${i} %}${r}{% endset %}`):n.push(`{% set v_${i} = ${r} %}`)}let o=t.map(i=>`"${i}": v_${i}`).join(", ");return n.push(`{{ { ${o} } | to_json }}`),n.join(`
`)}function Rp(e){let t={};for(let[n,o]of e)t[n]=Hi(new Map([[n,o]]));return t}function Pp(e){let t=new Map,n=new Map;for(let o of Object.keys(e).sort()){let i=e[o];if(!i.ok){n.set(o,i.error);continue}let r=cd(i.value),a=r?.values.get(o);a!==void 0?t.set(o,a):r||n.set(o,"Did not render to a value")}return{values:t,errors:n}}function cd(e){let t;try{t=JSON.parse(e)}catch{return}if(typeof t!="object"||t===null||Array.isArray(t))return;let n=new Map,o=new Set;for(let[i,r]of Object.entries(t))r===null?o.add(i):n.set(i,ud(r));return{values:n,nullKeys:o}}function ud(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function Np(e){let t=dd(e),n=[...t.entities.entries()].sort(([o],[i])=>o<i?-1:o>i?1:0).map(([,o])=>({kind:"entity",entityId:o.entityId,displayName:o.displayName,domain:o.domain,...o.iconName!==void 0?{iconName:o.iconName}:{}}));t.document&&n.push({kind:"template",value:t.document});for(let o of Cn(e).values())n.push({kind:"list",...o});return n}var I="wrist_assistant/complications";async function Op(e){return e.connection.sendMessagePromise({type:"wrist_assistant/gallery_key"})}async function Vp(e){return e.connection.sendMessagePromise({type:`${I}/parts_list`})}async function Bp(e,t,n,o){let i={type:`${I}/parts_save`,name:t,text:n};return o!==void 0&&(i.part_id=o),e.connection.sendMessagePromise(i)}async function Gp(e,t){return e.connection.sendMessagePromise({type:`${I}/parts_delete`,part_id:t})}async function Wp(e,t,n,o={}){return e.connection.sendMessagePromise({type:"call_service",domain:t,service:n,service_data:o})}async function Up(e){return e.connection.sendMessagePromise({type:`${I}/owners`})}async function jp(e,t){return e.connection.sendMessagePromise({type:`${I}/list`,owner_watch_id:t})}async function Kp(e,t,n,o,i,r){return e.connection.sendMessagePromise({type:`${I}/preview_save`,owner_watch_id:t,complication_id:n,revision:o,png:i,meta:r})}async function Jp(e,t,n,o){return e.connection.sendMessagePromise({type:`${I}/preview_get`,owner_watch_id:t,complication_id:n,revision:o})}async function qp(e,t){return e.connection.sendMessagePromise({type:`${I}/nudge`,owner_watch_id:t})}async function Xp(e,t){return e.connection.sendMessagePromise({type:`${I}/watch_status`,owner_watch_id:t})}async function Yp(e,t,n){await e.connection.sendMessagePromise({type:"wrist_assistant/devices/rename",watch_id:t,name:n})}async function Zp(e,t){return e.connection.sendMessagePromise({type:"wrist_assistant/devices/addresses",watch_id:t})}async function Qp(e,t,n){return e.connection.sendMessagePromise({type:"wrist_assistant/devices/set_addresses",watch_id:t,...n})}async function eh(e,t){return e.connection.sendMessagePromise({type:"wrist_assistant/devices/forget",watch_id:t,force:!0})}async function th(e,t){return e.connection.sendMessagePromise({type:"wrist_assistant/devices/end_move_wait",watch_id:t})}async function nh(e,t,n,o){return e.connection.sendMessagePromise({type:`${I}/save`,owner_watch_id:t,document:n,base_revision:o})}async function oh(e,t,n,o){return e.connection.sendMessagePromise({type:`${I}/delete`,owner_watch_id:t,complication_id:n,base_revision:o})}async function ih(e,t,n){return e.connection.sendMessagePromise({type:`${I}/history`,owner_watch_id:t,complication_id:n})}async function rh(e,t,n,o){return e.connection.sendMessagePromise({type:`${I}/history_get`,owner_watch_id:t,complication_id:n,revision:o})}async function ah(e,t,n,o,i){return e.connection.sendMessagePromise({type:`${I}/history_restore`,owner_watch_id:t,complication_id:n,revision:o,base_revision:i})}var Ge="wrist_assistant/pair";async function sh(e){return e.connection.sendMessagePromise({type:"config/auth/list"})}async function lh(e,t){return e.connection.sendMessagePromise({type:`${Ge}/lookup`,code:t})}async function dh(e,t,n,o={}){return e.connection.sendMessagePromise({type:`${Ge}/confirm`,code:t,...n===void 0?{}:{user_id:n},...o.replace===!0?{replace:!0}:{},...o.allowRemote===!0?{allow_remote:!0}:{}})}async function ch(e,t,n=!1){return e.connection.sendMessagePromise({type:`${Ge}/offer`,...t===void 0?{}:{user_id:t},...n?{replace:!0}:{}})}async function uh(e,t){return e.connection.sendMessagePromise({type:`${Ge}/offer_status`,offer_id:t})}async function ph(e,t){return e.connection.sendMessagePromise({type:`${Ge}/offer_cancel`,offer_id:t})}var Sn="wrist_assistant/client_certificate";function Tn(e){return e===void 0?{}:{user_id:e}}async function hh(e,t){return e.connection.sendMessagePromise({type:`${Sn}/status`,...Tn(t)})}async function fh(e,t,n,o){return e.connection.sendMessagePromise({type:`${Sn}/put`,pkcs12:t,passphrase:n,...Tn(o)})}async function mh(e,t){return e.connection.sendMessagePromise({type:`${Sn}/delete`,...Tn(t)})}var ae="wrist_assistant/watch_config";async function gh(e,t,n){return e.connection.sendMessagePromise({type:`${ae}/get`,owner_watch_id:t,kind:n})}async function yh(e){return e.connection.sendMessagePromise({type:`${ae}/summary`})}async function xh(e,t,n,o,i){return e.connection.sendMessagePromise({type:`${ae}/save`,owner_watch_id:t,kind:n,base_revision:o,document:i})}var Li="wrist_assistant/watch_pages";async function bh(e,t,n,o,i,r=!1){return e.connection.sendMessagePromise({type:`${Li}/link`,source_id:n,targets:[...i],kind:t,units:[...o],replace:r})}async function wh(e){return e.connection.sendMessagePromise({type:`${Li}/places`})}async function vh(e,t,n){return e.connection.sendMessagePromise({type:`${ae}/history`,owner_watch_id:t,kind:n})}async function kh(e,t,n,o){return e.connection.sendMessagePromise({type:`${ae}/history_entry`,owner_watch_id:t,kind:n,revision:o})}async function Ch(e,t,n,o,i){return e.connection.sendMessagePromise({type:`${ae}/restore`,owner_watch_id:t,kind:n,revision:o,base_revision:i})}function Sh(e,t,n){return e.connection.subscribeMessage(n,{type:`${ae}/subscribe`,owner_watch_id:t})}function Th(e,t){return e.connection.subscribeMessage(t,{type:`${ae}/subscribe_delivery`})}var An="wrist_assistant/http_actions";async function Ah(e){return e.connection.sendMessagePromise({type:`${An}/get`})}async function Eh(e,t,n){return e.connection.sendMessagePromise({type:`${An}/save`,base_revision:t,document:n})}async function Fh(e,t,n,o){return e.connection.sendMessagePromise({type:`${An}/test`,action:t,global_variables:n,values:o})}var En="wrist_assistant/cameras";async function Hh(e){return e.connection.sendMessagePromise({type:`${En}/list`})}async function Lh(e,t){return e.connection.sendMessagePromise({type:`${En}/save`,...t})}async function _h(e,t,n,o,i){return e.connection.sendMessagePromise({type:`${En}/test`,camera:t,...n===void 0?{}:{title:n},...o===void 0?{}:{message:o},...i===void 0?{}:{devices:[...i]}})}async function Mh(e,t){return e.connection.sendMessagePromise({type:"wrist_assistant/watch_voices/get",watch_id:t})}var bt="wrist_assistant/page_images";async function Ih(e){return e.connection.sendMessagePromise({type:`${bt}/list`})}async function Rh(e,t){return e.connection.sendMessagePromise({type:`${bt}/get`,image_id:t})}async function Ph(e,t,n={}){return e.connection.sendMessagePromise({type:`${bt}/upload`,data:t,...n.kind===void 0?{}:{kind:n.kind},...n.label===void 0?{}:{label:n.label},...n.entity_id===void 0?{}:{entity_id:n.entity_id}})}async function Nh(e,t){return e.connection.sendMessagePromise({type:`${bt}/delete`,image_id:t})}var We="wrist_assistant/home_map";async function Dh(e){return e.connection.sendMessagePromise({type:`${We}/get`})}async function zh(e,t){let n=await e.connection.sendMessagePromise({type:`${We}/get`,rev:t});return n?.not_modified===!0?void 0:n}async function $h(e,t){return e.connection.subscribeMessage(n=>{typeof n?.rev=="number"&&t(n.rev)},{type:`${We}/subscribe`})}async function Oh(e,t,n){return e.connection.sendMessagePromise({type:`${We}/save`,doc:t,base_rev:n})}async function Vh(e){return e.connection.sendMessagePromise({type:`${We}/scans`})}async function Bh(e,t,n){return e.connection.sendMessagePromise({type:`${I}/move_owner`,source_owner_watch_id:t,target_owner_watch_id:n})}function Gh(e,t,n){let o={type:`${I}/subscribe`};return t&&(o.owner_watch_id=t),e.connection.subscribeMessage(n,o)}async function Wh(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${I}/render_values`,templates:t})).results}async function Uh(e,t){return e.connection.sendMessagePromise({type:"config_entries/get",domain:t})}async function jh(e){return e.connection.sendMessagePromise({type:"cloud/status"})}async function Kh(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${I}/history_series`,requests:t})).results}function pd(e){return{entity_id:e.entityId,minutes:e.minutes,points:e.points,...e.mode==="states"?{mode:"states"}:{},...e.gaps?{gaps:!0}:{},...e.entities!==void 0&&e.entities.length>0?{entities:[...e.entities],combine:e.combine??"any"}:{}}}function hd(e){return{entity_id:e.entityId,minutes:e.minutes,period:e.period,type:e.type,...e.gaps?{gaps:!0}:{}}}function Jh(e){let t=new Map,n=new Map;for(let[o,i]of Object.entries(e))i.ok&&(t.set(o,i.series),typeof i.readings=="number"&&n.set(o,{readings:i.readings,averaged:i.averaged===!0}));return{series:t,readings:n}}async function qh(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${I}/statistics_series`,requests:t})).results}async function Xh(e,t){return Object.keys(t).length===0?{}:(await e.connection.sendMessagePromise({type:`${I}/list_items`,requests:t})).results}function Yh(e){let t={};for(let[n,o]of Cn(e))t[n]=o;return{requests:t,signature:JSON.stringify(t)}}function Zh(e){let t=new Map;for(let[n,o]of Object.entries(e))o.ok&&t.set(n,JSON.stringify({items:o.items,total:o.total}));return t}function Qh(e,t=()=>!0){let n={};for(let i of nn(e))t(i.entityId)&&(n[i.key]=pd(i));let o={};for(let i of on(e))t(i.entityId)&&(o[i.key]=hd(i));return{history:n,statistics:o,signature:JSON.stringify([n,o])}}var tf={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",list:"#c0ca33",shape:"#43a047",image:"#00acc1",tap:"#ec407a",chartTimes:"#5e35b1",chartDots:"#5e35b1",chartGrid:"#5e35b1",imageTime:"#00838f"},nf={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",list:"List",shape:"Shape",image:"Picture",tap:"Tap zone",chartTimes:"Clock times",chartDots:"Chart dots",chartGrid:"Chart grid",imageTime:"Timestamp"},of=["text","icon","gauge","chart","timeline","list","shape","image","tap"],rf={content:"var(--wa-hue-blue)",look:"var(--wa-hue-green)",numbers:"var(--wa-hue-orange)",position:"var(--wa-hue-pink)",states:"var(--wa-hue-yellow)",tap:"var(--wa-hue-red)",visibility:"var(--wa-hue-purple)",home:"var(--wa-hue-blue)",place:"var(--wa-hue-grey)",complication:"var(--wa-hue-blue)",group:"var(--wa-hue-green)",locked:"var(--wa-hue-red)"},wt={pages:"var(--wa-hue-blue)",layers:"var(--wa-hue-green)",values:"var(--wa-hue-red)"};function fd(e){switch(e){case"text":return x`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return x`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return x`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return x`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return x`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return x`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return x`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return x`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return x`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return x`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"list":return x`<circle cx="5.5" cy="7" r="1.6" /><circle cx="5.5" cy="12" r="1.6" /><circle cx="5.5" cy="17" r="1.6" /><path d="M10 7H19M10 12H19M10 17H19" />`;case"chartDots":return x`<path d="M4 16L10 10L14 13L20 7" /><circle cx="4" cy="16" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="14" cy="13" r="1.8" /><circle cx="20" cy="7" r="1.8" />`;case"chartGrid":case"menu":return x`<path d="M4 7H20M4 12H20M4 17H20" />`;case"note":return x`<path d="M14 3.5H7A2 2 0 0 0 5 5.5V18.5A2 2 0 0 0 7 20.5H17A2 2 0 0 0 19 18.5V8.5Z" /><path d="M14 3.5V8.5H19" /><path d="M8.5 13H15.5M8.5 16.5H13" />`;case"chartTimes":case"imageTime":case"clock":return x`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return x`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return x`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return x`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"radial":return x`<circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="4.5" r="1.8" /><circle cx="19.5" cy="12" r="1.8" /><circle cx="12" cy="19.5" r="1.8" /><circle cx="4.5" cy="12" r="1.8" /><circle cx="17.3" cy="6.7" r="1.4" /><circle cx="6.7" cy="17.3" r="1.4" />`;case"pages":return x`<rect x="3" y="7" width="12" height="13" rx="2" /><path d="M8 4h11a2 2 0 0 1 2 2v11" />`;case"grip":return x`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return x`<path d="M6 9L12 15L18 9" />`;case"plus":return x`<path d="M12 5V19M5 12H19" />`;case"braces":return x`<path d="M9 4.5C6.9 4.5 6.3 5.55 6.3 7.5v2.4c0 1.2-.75 2.1-2.1 2.1 1.35 0 2.1.9 2.1 2.1v2.4c0 1.95.6 3 2.7 3" /><path d="M15 4.5c2.1 0 2.7 1.05 2.7 3v2.4c0 1.2.75 2.1 2.1 2.1-1.35 0-2.1.9-2.1 2.1v2.4c0 1.95-.6 3-2.7 3" />`;case"link":return x`<path d="M10.2 13.8L13.8 10.2" /><path d="M10.8 6.9l1.35-1.35a3.6 3.6 0 0 1 5.1 5.1l-1.35 1.35" /><path d="M13.2 17.1l-1.35 1.35a3.6 3.6 0 0 1-5.1-5.1l1.35-1.35" />`;case"info":return x`<circle cx="12" cy="12" r="8.5" /><path d="M12 11V16.5" /><path d="M12 7.6V7.8" />`;case"globe":return x`<circle cx="12" cy="12" r="8.5" /><path d="M3.5 12H20.5" /><path d="M12 3.5c2.5 3 2.5 14 0 17M12 3.5c-2.5 3-2.5 14 0 17" />`;case"download":return x`<path d="M12 4V15" /><path d="M7 10L12 15L17 10" /><path d="M5 20H19" />`;case"check":return x`<path d="M5 12.5L9.5 17L19 7.5" />`;case"arrow":return x`<path d="M5 12H19" /><path d="M13 6L19 12L13 18" />`;case"guides":return x`<path d="M12 3V21" /><rect x="4" y="6" width="8" height="4.5" rx="1.3" /><rect x="12" y="13.5" width="8" height="4.5" rx="1.3" />`;case"paste":return x`<rect x="6" y="4.5" width="12" height="16" rx="2" /><path d="M9 4.5V3.5H15V4.5" /><path d="M9 11H15M9 15H13" />`;case"watch":return x`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"phone":return x`<rect x="6" y="2.5" width="12" height="19" rx="3" /><path d="M10.5 5.5H13.5" />`;case"qr":return x`<rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14H16.5V16.5M20 14V14.01M14 20H14.01M17.5 20H20V17.5" />`;case"keyboard":return x`<rect x="2.5" y="6" width="19" height="12" rx="2.5" /><path d="M6.5 10H6.51M10 10H10.01M14 10H14.01M17.5 10H17.51M8 14.5H16" />`;case"foldAll":return x`<path d="M4 12H20M8.5 3.5L12 7L15.5 3.5M8.5 20.5L12 17L15.5 20.5" />`;case"unfoldAll":return x`<path d="M4 12H20M8.5 7L12 3.5L15.5 7M8.5 17L12 20.5L15.5 17" />`;case"compact":return x`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return x`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"grid":return x`<rect x="3.5" y="4" width="7.5" height="7" rx="1.6" /><rect x="13" y="4" width="7.5" height="7" rx="1.6" /><rect x="3.5" y="13" width="7.5" height="7" rx="1.6" /><rect x="13" y="13" width="7.5" height="7" rx="1.6" />`;case"lock":return x`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return x`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return x`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return x`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return x`<path d="M6 14L12 8L18 14" />`;case"down":return x`<path d="M6 10L12 16L18 10" />`;case"left":return x`<path d="M14 6L8 12L14 18" />`;case"right":return x`<path d="M10 6L16 12L10 18" />`;case"show":return x`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return x`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return x`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return x`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return x`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return x`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return x`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`;case"undo":return x`<path d="M9 14L4 9L9 4" /><path d="M4 9H15A5 5 0 0 1 15 19H12" />`;case"redo":return x`<path d="M15 14L20 9L15 4" /><path d="M20 9H9A5 5 0 0 0 9 19H12" />`;case"expand":return x`<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" />`;case"checklist":return x`<rect x="3" y="4" width="7" height="7" rx="1.8" /><path d="M4.9 7.4L6.3 8.8L8.4 6.4" />
        <rect x="3" y="13" width="7" height="7" rx="1.8" /><path d="M4.9 16.4L6.3 17.8L8.4 15.4" />
        <path d="M13.5 7.5H21M13.5 16.5H21" />`;case"home":return x`<path d="M4 11.5L12 4.5L20 11.5" /><path d="M6.5 9.5V19.5H17.5V9.5" /><path d="M10.2 19.5V14.8H13.8V19.5" />`;case"thumbSmall":return x`<rect x="3" y="9" width="6" height="6" rx="1.5" /><path d="M12.5 12H21" />`;case"thumbMedium":return x`<rect x="3" y="6.5" width="10" height="11" rx="2" /><path d="M16.5 12H21" />`;case"thumbLarge":return x`<rect x="3" y="4" width="14" height="16" rx="2.5" /><path d="M19.5 12H21" />`;case"alignLeft":return x`<path d="M4 3V21" /><rect x="8" y="6" width="11" height="4" rx="1" /><rect x="8" y="14" width="6" height="4" rx="1" />`;case"alignCenterX":return x`<path d="M12 3V6M12 10V14M12 18V21" /><rect x="5" y="6" width="14" height="4" rx="1" /><rect x="8" y="14" width="8" height="4" rx="1" />`;case"alignRight":return x`<path d="M20 3V21" /><rect x="5" y="6" width="11" height="4" rx="1" /><rect x="10" y="14" width="6" height="4" rx="1" />`;case"alignTop":return x`<path d="M3 4H21" /><rect x="6" y="8" width="4" height="11" rx="1" /><rect x="14" y="8" width="4" height="6" rx="1" />`;case"alignCenterY":return x`<path d="M3 12H6M10 12H14M18 12H21" /><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="8" width="4" height="8" rx="1" />`;case"alignBottom":return x`<path d="M3 20H21" /><rect x="6" y="5" width="4" height="11" rx="1" /><rect x="14" y="10" width="4" height="6" rx="1" />`;case"alignCenter":return x`<rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M12 3V7M12 17V21M3 12H7M17 12H21" />`;case"mic":return x`<rect x="9" y="3.5" width="6" height="11" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" /><path d="M12 18V20.5" />`;case"sliders":return x`<path d="M4 8H11M15 8H20M4 16H7M11 16H20" /><circle cx="13" cy="8" r="2" /><circle cx="9" cy="16" r="2" />`;case"share":return x`<path d="M12 15V3M7.5 7.5L12 3L16.5 7.5" /><path d="M5 12V19.5H19V12" />`;case"more":return x`<circle cx="6" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="18" cy="12" r="1.3" />`}}function _i(e){return Q`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${fd(e)}</svg>`}var Mi=T`
      background:
        linear-gradient(var(--lo-fill), var(--lo-fill)) padding-box,
        linear-gradient(140deg, var(--c) 0%, color-mix(in srgb, var(--c) 33%, transparent) 30%,
          var(--lo-mid) 62%, color-mix(in srgb, var(--c) 25%, transparent) 100%) border-box;
      border: 1.5px solid transparent;
`,Ue=T`
      background: var(--lo-fill);
      border: 1px solid color-mix(in srgb, var(--c) 60%, var(--wa-card));
`,Ii=T`
    /* The header is a bar of its own: a step darker than the cards, one
       hairline under it, and a small gap before the columns. */
    header, .wa-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
      min-height: 46px;
      background: var(--wa-top);
      color: var(--wa-ink);
      flex-wrap: wrap;
      position: relative;
      flex: none;
      z-index: 20;
    }
    header .spacer, .wa-bar .spacer { flex: 1; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    /* Top bar: the way back and what is open at the left, then the save
       status, Save, Share, ··· and the editor switches. */
    header, .wa-bar { gap: 6px; min-height: 46px; border-bottom: 1px solid var(--wa-line); margin-bottom: 6px; }
    .picker > button.tb-browse {
      --c: var(--wa-hue-blue); --lo-fill: var(--wa-card); --lo-mid: var(--wa-go-mid);
      min-width: 0; max-width: none; height: 28px; gap: 7px; padding: 0 9px 0 10px; font-size: 13px; font-weight: 600;
      border-radius: 6px; box-shadow: none;
      ${Ue}
    }
    .picker > button.tb-browse:hover { --lo-fill: var(--wa-hover); box-shadow: none; }
    .picker > button.tb-browse:focus-visible { box-shadow: var(--wa-ring); }
    .picker > button.tb-browse svg { width: 14px; height: 14px; }
    .tb-browse .tb-browse-l { color: var(--wa-ink); }
    /* The hairline between Browse and the buttons that make a new one. */
    .tb-div { width: 1px; height: 18px; margin: 0 4px; flex: none; background: var(--wa-line-strong); }
    .tb-name {
      display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 8px; min-width: 0;
      border-radius: 7px; border: 1px solid transparent; cursor: text;
    }
    .tb-name:hover { border-color: var(--wa-line); }
    .tb-name:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .tb-name > input.tb-name-input[type=text],
    .tb-name > input.tb-name-input[type=text]:hover,
    .tb-name > input.tb-name-input[type=text]:focus-visible {
      font: inherit; font-size: 14px; font-weight: 600; letter-spacing: -.01em; color: var(--wa-ink); min-height: 0; padding: 0;
      border: 0; background: transparent; box-shadow: none; outline: none;
      field-sizing: content; min-width: 7ch; max-width: 280px;
    }
    .tb-name > input.tb-name-input:disabled { opacity: 1; cursor: default; }
    .tb-pen { font-size: 11px; color: var(--wa-muted); opacity: .6; }
    .tb-pill {
      display: inline-flex; align-items: center; height: 22px; padding: 0 9px; border-radius: 999px; min-width: 0; max-width: 300px;
      font-size: 11.5px; font-weight: 500; color: var(--wa-muted); background: var(--wa-panel);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    header button.icon.tb-icon, .wa-bar button.icon.tb-icon { width: 30px; height: 30px; }
    header button.icon.tb-icon svg.ui-icon, .wa-bar button.icon.tb-icon svg.ui-icon { width: 16px; height: 16px; }
    /* Where the home has got to: a dot and its words in the dot's color,
       with no pill round them. */
    .tb-sync {
      display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 4px; min-width: 0; max-width: 380px;
      border-radius: 6px; font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; border: 0; background: none;
    }
    .tb-sync .tb-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: currentColor; }
    .tb-sync-l { overflow: hidden; text-overflow: ellipsis; }
    .tb-sync-n { flex: none; font-weight: 500; color: var(--wa-muted); }
    .tb-sync.ok { color: var(--wa-green); }
    .tb-sync.warn { color: var(--wa-amber); }
    .tb-sync.err { color: var(--wa-need, var(--error-color, #db4437)); }
    .tb-sync.quiet { color: var(--wa-muted); }
    .tb-sync.sending .tb-dot { animation: wa-pulse 1.2s ease-in-out infinite; }
    @keyframes wa-pulse { 50% { opacity: .3; } }
    @media (prefers-reduced-motion: reduce) { .tb-sync.sending .tb-dot { animation: none; } }
    button.tb-btn {
      font: inherit; font-size: 13px; font-weight: 600; height: 28px; padding: 0 11px; border-radius: 6px; cursor: pointer; flex: none;
      border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-ink); white-space: nowrap;
    }
    button.tb-btn:hover:not(:disabled) { background: var(--wa-hover); border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    button.tb-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tb-btn.tb-more { padding: 0 9px; letter-spacing: .08em; }
    /* Whether the work is saved, the one place it is said: muted once saved,
       amber with a dot while there are changes (or Save refuses them), red
       with a dot for an error. */
    .tb-saved {
      display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 300px;
      font-size: 12px; color: var(--wa-muted); white-space: nowrap; padding: 0 4px;
    }
    .tb-saved-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .tb-saved-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: currentColor; }
    .tb-saved.warn { color: var(--wa-amber); font-weight: 500; }
    .tb-saved.err { color: var(--error-color, #db4437); font-weight: 500; }
    /* After a save: where it has got to, one line. Amber when the reader has
       to do something (open the watch app). It stays when the bar stacks,
       on the second row, since on a phone it is the only place it is said. */
    .tb-after {
      font-size: 12px; color: var(--wa-muted); white-space: nowrap; padding: 0 4px;
      min-width: 0; max-width: 340px; overflow: hidden; text-overflow: ellipsis;
    }
    .tb-after.warn { color: var(--wa-amber); font-weight: 500; }
    header.stacked > .tb-after, .wa-bar.stacked > .tb-after { order: 2; }
    /* Stacked, "Saved 3 min ago" gives way, but changes and errors keep
       their line on the second row: it is the only place they are said. */
    header.stacked .tb-saved:not(.warn):not(.err), header.stacked .tb-pen, header.stacked > .tb-div,
    .wa-bar.stacked .tb-saved:not(.warn):not(.err), .wa-bar.stacked .tb-pen, .wa-bar.stacked > .tb-div { display: none; }
    header.stacked > .tb-saved, .wa-bar.stacked > .tb-saved { order: 2; }
    /* Stacked (a phone, or a narrow window), the bar is two tidy rows rather
       than three ragged ones: what is done to the draft on top (Browse, undo,
       redo, Save, help), and where it has got to underneath (the sync pill,
       Share, ···). The pill keeps its words whole. The empty ::after is the line break: a full
       width item of no height, so the rows carry their own margins instead
       of a row gap that would count it twice. */
    header.stacked, .wa-bar.stacked { row-gap: 0; padding-block: 4px; }
    /* A dialog drawn in the bar keeps the margin that centres it. */
    header.stacked > :not(dialog), .wa-bar.stacked > :not(dialog) { margin-block: 4px; }
    header.stacked::after, .wa-bar.stacked::after { content: ""; order: 1; flex: 0 0 100%; height: 0; margin: 0; }
    header.stacked > .tb-sync, header.stacked > button.tb-btn:not(.tb-more), header.stacked > .side-menu,
    .wa-bar.stacked > .tb-sync, .wa-bar.stacked > button.tb-btn:not(.tb-more) { order: 2; }
    /* A watch screen's bar keeps its buttons together on top (···, Save and
       the help) and puts the words under them: where the copy has got to, or
       why Save is grey, wrapping whole across the row rather than cut. Left
       on the lower row alone, ··· read as a stray. */
    .wa-bar.stacked > :is(.tb-why, .nw-why, .tb-after) {
      order: 2; flex: 1 1 100%; max-width: none; white-space: normal; overflow: visible; overflow-wrap: anywhere;
    }
    /* The pill never shrinks under its words: when the row is too full it
       takes a row of its own, and only past a whole row is its note cut. */
    header.stacked > .tb-sync, .wa-bar.stacked > .tb-sync { flex: 1 0 auto; max-width: 100%; }
    header.stacked .tb-sync-l, .wa-bar.stacked .tb-sync-l { flex: none; }
    header.stacked .tb-sync-n, .wa-bar.stacked .tb-sync-n { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    /* Home Assistant's own menu, which a phone hides behind this button. */
    header button.icon.tb-menu, .wa-bar button.icon.tb-menu { margin-left: -6px; }
    /* The buttons that move between the editors (Pages, Menus, Watch, and
       Back to complications): an icon and a word. The hooks that draw them
       carry the same two rules; these are here so an editor's own bar gets
       them without the hook's sheet. */
    button.tb-btn.tb-pages, button.tb-btn.tb-menus, button.tb-btn.tb-watch, button.tb-btn.tb-back {
      display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px;
    }
    button.tb-btn.tb-pages svg.ui-icon, button.tb-btn.tb-menus svg.ui-icon,
    button.tb-btn.tb-watch svg.ui-icon, button.tb-btn.tb-back svg.ui-icon { width: 14px; height: 14px; }
`,Ri=T`
    .picker { position: relative; }
    .picker > button {
      display: inline-flex; align-items: center; gap: 10px; font: inherit; font-size: 13px; font-weight: 700;
      height: 34px; padding: 0 10px 0 8px; border-radius: 9px; cursor: pointer; color: var(--wa-ink);
      border: 0; box-shadow: 0 0 0 1px var(--wa-line-strong); background: var(--wa-card); min-width: 250px; max-width: 380px;
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .picker > button:hover { box-shadow: 0 0 0 1px var(--wa-ink); }
    .picker > button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker > button svg { width: 16px; height: 16px; opacity: .7; }
`,Pi=T`
    button.help {
      font: inherit; font-size: 13px; font-weight: 600; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
      display: inline-grid; place-items: center; padding: 0;
      border: 0; background: var(--wa-card); color: var(--wa-ink);
      transition: background-color .12s ease-out, color .12s ease-out;
    }
    button.help:hover { background: var(--wa-hover); color: var(--wa-ink); }
    button.help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,Ni=T`
    /* Three columns with a draggable gutter between each pair. The side widths
       come in as custom properties already fitted to the measured panel width
       (see columnFit), and every track can shrink to zero here, so the grid
       itself can never be wider than the panel and clip a column. */
    .layout {
      display: grid;
      grid-template-columns: var(--wa-left, 300px) 8px minmax(0, 1fr) 8px var(--wa-right, 360px);
      /* The 8px drag gutters are the space between the columns, with no gap
         beside them: an 8px gap on each side as well left about 24px between
         cards, which read as three loose panels rather than one editor
         (Jesse, 2026-09-24). The cards stand on the page ground itself. */
      column-gap: 0;
      row-gap: 6px;
      padding: 0 6px;
      /* The editor is exactly one viewport tall: the grid takes whatever the
         header and the footer leave, and each column scrolls inside it. A long
         inspector used to stretch the page, which pushed the two lists under
         the canvas below the fold in every other column. */
      flex: 1 1 0;
      min-height: 0;
      overflow: hidden;
    }
    .gutter {
      align-self: stretch; cursor: col-resize; border-radius: 4px;
      background: transparent; position: relative; touch-action: none;
    }
    .gutter::after {
      content: ""; position: absolute; inset: 0 3px; border-radius: 2px;
      background: var(--wa-line); opacity: 0; transition: opacity .12s ease-out;
    }
    .gutter:hover::after, .gutter.dragging::after { background: var(--wa-accent); opacity: 1; }
    .layout.cols-2 {
      grid-template-columns: var(--wa-left, 300px) 8px minmax(0, 1fr);
      overflow: auto;
    }
    .layout.cols-2 > .column.inspector { grid-column: 1 / -1; }
    .layout.cols-2 > .gutter.right { display: none; }
    .layout.bare { grid-template-columns: minmax(0, 1fr); overflow: auto; }
    .layout.cols-1 { grid-template-columns: minmax(0, 1fr); overflow: auto; }
    .layout.cols-1 > .column { grid-column: auto; }
    .layout.cols-1 > .gutter { display: none; }
    .column { min-height: 0; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; scrollbar-gutter: stable; }
    /* A scroll box says when there is more behind its edges: a short fade in
       the box's own ground, drawn by a sticky pseudo-element that cancels its
       own height with a negative margin, so nothing shifts when it appears.
       The attributes are set by the ScrollFades helper on scroll and on
       resize; in the stacked modes the boxes never scroll, so they never
       arrive and the fades never draw. */
    .column.inspector { --wa-fade: var(--wa-bg); --wa-fade-gap: 0px; }
    /* The fade gap is the list's own row gap, so the two zero-height fade
       pieces take up no room at either end. At 2px against a 4px gap they
       left a 2px strip over the Background tray. */
    .layers { --wa-fade: var(--wa-card); --wa-fade-gap: 4px; }
    /* A corner with curved text on: the layers stay editable, but read as off. */
    .layers.skipped { opacity: .45; }
    /* A corner's Bezel and Curved text rows, over its layers: the bezel is the
       outermost part of the corner and the curved text sits in front. */
    .corner-set { flex: none; display: flex; flex-direction: column; gap: 4px; padding: 4px 10px 0; }
    .corner-set .layer .grip { cursor: default; }
    .corner-set .thumb svg, .corner-split .thumb svg { width: 100%; height: 100%; display: block; }
    /* What fills the inside of a corner, under a hairline below the Bezel row:
       Curved text on the left, Layers on the right, "or" on the line between.
       The watch shows one and never both; the side not picked is dimmed. */
    .corner-split {
      display: grid; grid-template-columns: minmax(0, 1fr) 22px minmax(0, 1fr);
      margin: 8px 10px 0; padding-top: 8px; border-top: 1px solid var(--wa-line); flex: 0 1 auto; min-height: 0;
    }
    .cs-why { grid-column: 1 / -1; margin: 0 4px 8px; font-size: 11px; line-height: 1.45; color: var(--wa-muted); }
    .cs-col { display: flex; flex-direction: column; gap: 4px; min-width: 0; min-height: 0; }
    .cs-col.off > :not(.cs-head) { opacity: .45; }
    .cs-col > .layers { padding: 0; }
    .cs-or { position: relative; display: flex; align-items: center; justify-content: center; }
    .cs-or::before { content: ""; position: absolute; top: 0; bottom: 0; left: 50%; border-left: 1px solid var(--wa-line); }
    .cs-or span { position: relative; padding: 3px 0; background: var(--wa-card); font-size: 10px; color: var(--wa-muted); }
    .cs-head {
      display: flex; align-items: center; gap: 6px; padding: 2px 4px 4px; border: 0; background: none;
      font: inherit; font-size: 12px; font-weight: 600; color: var(--wa-muted); text-align: left; cursor: pointer;
    }
    .cs-head:hover:not(:disabled):not(.on) { color: var(--wa-ink); }
    .cs-head:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .cs-head.on { color: var(--wa-ink); cursor: default; }
    .cs-dot { flex: none; box-sizing: border-box; width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid currentColor; }
    .cs-head.on .cs-dot { border-color: var(--wa-ink); background: radial-gradient(circle, var(--wa-ink) 0 2.5px, transparent 3px); }
    .cs-empty {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-height: 72px; padding: 8px;
      border: 1px dashed var(--wa-line-strong); border-radius: var(--wa-r-sm); background: none;
      font: inherit; font-size: 11px; color: var(--wa-muted); text-align: center; cursor: pointer;
    }
    .cs-empty:hover:not(:disabled) { color: var(--wa-ink); border-color: var(--wa-ink); }
    .cs-empty:disabled { cursor: default; }
    .cs-pic { display: block; width: 40px; height: 30px; }
    .cs-pic svg { display: block; width: 100%; height: 100%; }
    .cs-pic.bulb { width: 26px; height: 26px; }
    .column.canvas { --wa-fade: var(--wa-bg); --wa-fade-gap: 8px; }
    /* No scroll bar is ever drawn between the canvas and the inspector. The
       canvas column still scrolls (wheel, trackpad, keys) when a short window
       leaves it less room than its card's floor, and the edge fades above say
       so; the bar itself sat in the gap beside the inspector's own. The
       stage inside it gets the same treatment in the canvas sheet. */
    .column.canvas { scrollbar-width: none; }
    .column.canvas::-webkit-scrollbar { display: none; width: 0; height: 0; }
    .column.inspector::before, .column.inspector::after,
    .layers::before, .layers::after,
    .column.canvas::before, .column.canvas::after {
      content: ""; display: block; flex: none; height: 0; z-index: 4; pointer-events: none;
    }
    .column.inspector::before, .layers::before, .column.canvas::before {
      position: sticky; top: 0; margin-bottom: calc(-1 * var(--wa-fade-gap));
    }
    .column.inspector::after, .layers::after, .column.canvas::after {
      position: sticky; bottom: 0; margin-top: calc(-1 * var(--wa-fade-gap));
    }
    [data-more-above]::before {
      height: 28px; margin-bottom: calc(-28px - var(--wa-fade-gap));
      background: linear-gradient(to bottom, var(--wa-fade), transparent);
    }
    [data-more-below]::after {
      height: 28px; margin-top: calc(-28px - var(--wa-fade-gap));
      background: linear-gradient(to top, var(--wa-fade), transparent);
    }
    /* Stacked, the whole layout scrolls as one page again, so a column that
       owns its own scrollbar in three columns must give it up here. */
    .layout.cols-1 .column.left, .layout.cols-1 .column.canvas, .layout.cols-1 .column.inspector,
    .layout.cols-2 .column.inspector { overflow: visible; min-height: auto; }
    .layout.cols-1 .column.left .card.layers-card { flex: none; }
    .layout.cols-1 .layers { overflow: visible; }
    /* Stacked, the three columns become one page, and the page is read top to
       bottom rather than left to right. In column order that page opened with
       Add a layer, and the face the whole editor is about came 1730px down,
       past Pages, past every layer row: two and a half phone screens of
       scrolling before you could see what you were drawing. Reported by a
       user on Discord, "Layout on mobile", 2026-09-20.
       The order here is the order of the question being asked: what am I
       drawing and where does it land, what does the thing I just picked do,
       and only then the lists that feed it. */
    .layout.cols-1 > .column.canvas { order: 1; }
    .layout.cols-1 > .column.inspector { order: 2; }
    .layout.cols-1 > .column.left { order: 3; }
`,Di=T`
    /* One card shape everywhere: white paper, a 12px corner, and a hairline
       drawn as a ring rather than a border, so nothing inside has to account
       for a border box. */
    .card {
      background: var(--wa-card);
      border: 0;
      border-radius: var(--wa-r-md);
      box-shadow: 0 0 0 1px var(--wa-line);
      padding: 10px 12px 12px;
    }
`,zi=T`
    /* Layers: one row per layer, colored by kind, the shape pinned last.
       The picture size is a variable on the list, set by the S/M/L control in
       the card's title bar, so one change resizes every row's picture and the
       column that holds it. */
    /* Only as tall as its rows, so the shape row sits right under the last
       layer; it shrinks and scrolls once the card runs out of room. */
    .layers {
      display: flex; flex-direction: column; gap: 4px; flex: 0 1 auto; min-height: 0;
      overflow-y: auto; overflow-x: hidden; scrollbar-width: thin;
    }
    /* Every row is its own box: a field-grey ground one step off the card,
       with no edge. The gap between rows is what parts them, and the
       selection speaks louder, in its own blue. */
    .layer {
      display: grid; grid-template-columns: 0 var(--thumb-w) minmax(0, 1fr) auto; align-items: center; gap: 8px;
      min-height: 44px; padding: 0 6px 0 4px; border-radius: var(--wa-r-sm);
      /* The list is a scrolling flex column: without this, expanded rows
         shrink to their minimum and their lines pile on top of each other. */
      flex: none;
      border: 0 solid transparent; background-clip: padding-box;
      background: var(--wa-field);
      box-shadow: none;
      cursor: pointer; user-select: none; position: relative; font-size: 13px;
      /* Hover and selection change at once; only the drop slot animates. */
      transition: border-top-width .1s ease-out, border-bottom-width .1s ease-out;
    }
    /* A group's members wear the same ground as every other row: the group's
       box already says they are nested (Jesse, 2026-09-24). */
    .layer:hover { background: var(--wa-hover); box-shadow: none; }
    /* The row under the pointer, which the preview is showing: the picked
       outline only. The fill stays for the real selection below. */
    .layer.peek { box-shadow: inset 0 0 0 1px var(--wa-pick-line); }
    /* The face hover's row: one ring for the whole list, sliding from row to
       row and fading out where it stands when the hover ends. */
    .layers { position: relative; }
    .face-ring {
      position: absolute; top: 0; left: 0; z-index: 3; pointer-events: none; opacity: 0;
      box-shadow: inset 0 0 0 1.5px var(--wa-pick-line), 0 0 0 3px color-mix(in srgb, var(--wa-pick-line) 18%, transparent);
      transition: transform .16s cubic-bezier(.2, .8, .2, 1), width .16s cubic-bezier(.2, .8, .2, 1), height .16s cubic-bezier(.2, .8, .2, 1), opacity .22s ease-out;
    }
    .face-ring.on { opacity: 1; transition-duration: .16s, .16s, .16s, .1s; }
    .face-ring.jump { transition: none; }
    @media (prefers-reduced-motion: reduce) { .face-ring { transition: opacity .1s linear; } }
    /* The selected row: a deep blue ground, a thin blue edge, ink text and
       pale blue row buttons, the same wherever a row is selected, so the
       kinds' colors and the group boxes never fight the selection. */
    .layer.hl {
      background: var(--wa-pick-bg); color: var(--wa-ink);
      box-shadow: inset 0 0 0 1px var(--wa-pick-line);
    }
    .layer.hl .name b { font-weight: 700; }
    .layer.hl .name small { color: var(--wa-ink); }
    .layer.hl .acts button.icon { color: var(--wa-pick-ink); opacity: 1; }
    .layer:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.lit { background: var(--wa-sel-bg); box-shadow: inset 0 0 0 1px var(--wa-pick-line); }
    /* A member of the selected group: a faint wash of the selection, without
       its edge, so the group reads as one block. */
    .layer.held { background: color-mix(in srgb, var(--wa-pick-bg) 55%, var(--wa-field)); }
    /* The drag grips are gone: the whole row drags, and one line under the
       Layers header says so. The grip keeps a zero-width column so the rest
       of the row's grid stays as it was. */
    .layer .grip { visibility: hidden; overflow: hidden; width: 0; }
    /* The layer's own picture, cropped to it, on the black face. The rounded
       black well is the picture's frame, so an empty thumb still reads as a
       slot rather than a hole. */
    .layer .thumb {
      width: var(--thumb-w); height: var(--thumb-h); border-radius: 5px; overflow: hidden; flex: none;
      background: #000; border: 0; box-sizing: border-box; display: block;
    }
    .layer .thumb svg { display: block; width: 100%; height: 100%; }
    /* The whole-complication tap row draws nothing, so it keeps the column the
       other rows line up on and shows no black tile where a picture would be. */
    .layer .thumb.blank { background: none; }
    /* A see-through Background: the checkerboard design apps use for "no
       fill", so the row does not read as a picture that failed to draw. The
       picture on top leaves the face unpainted (clearFace) and draws only a
       border, if there is one. */
    .layer .thumb.clear {
      background: repeating-conic-gradient(var(--wa-dark-check-a, #d8d8de) 0% 25%, var(--wa-dark-check-b, #f2f2f5) 0% 50%) 0 0 / 10px 10px;
    }
    /* The picture inside is an <svg class="thumb">, so the black well above
       lands on it too and would cover the checkerboard. */
    .layer .thumb.clear > svg { background: none; }
    .layer.dim .thumb { opacity: .6; }
    .layer .name { display: flex; flex-direction: column; min-width: 0; gap: 1px; }
    .layer .name b { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
    .layer .name .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .layer .name .glyph svg { width: 16px; height: 16px; display: block; }
    .layer .name small { color: var(--wa-muted); font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .layer .name small .val-tok { color: var(--wa-val); }
    .layer .kind { font-size: 12px; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--wa-muted); }
    .layer.dim .name b { opacity: .55; }
    .layer .right { display: flex; align-items: center; gap: 2px; }
    .layer .badges { display: inline-flex; gap: 4px; }
    .badge {
      display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: 6px;
      font-size: 11px; font-weight: 600; letter-spacing: 0; white-space: nowrap;
      background: color-mix(in srgb, var(--wa-ink) 8%, transparent); color: var(--wa-muted);
    }
    .badge.tap { color: var(--wa-hue-red); background: color-mix(in srgb, var(--wa-hue-red) 14%, transparent); }
    /* A layer with rules: the Rules card's yellow as a quiet fill with yellow
       words and no outline, the same shape as the tap badge. */
    .badge.states { color: var(--wa-hue-yellow); background: color-mix(in srgb, var(--wa-hue-yellow) 14%, transparent); }
    .badge.template-error { color: #fff; background: var(--error-color, #db4437); }
    /* Outlined, so it never reads as one more filled tag beside tap and
       states: it is a job, and a click opens it. */
    .badge.need {
      font-family: inherit; line-height: 1; border: 1px solid var(--wa-need); color: var(--wa-need);
      background: color-mix(in srgb, var(--wa-need) 12%, transparent);
    }
    button.badge.need { cursor: pointer; }
    button.badge.need:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-need) 24%, transparent); }
    button.badge.need:disabled { cursor: default; }
`,$i=T`
    /* Beside the name rather than with the other badges, which give way to
       the buttons under the pointer: this one has to stay clickable there. */
    .layer .name b .nm-t { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .layer .name b .badge.need { flex: none; height: 16px; padding: 0 5px; }
    /* A layer's attached tap: the bottom part of the layer's own row, under
       a hairline. The row grows a little so the strip fits; the strip sits
       2px inside the row's edge so the row's ring (1px, 2px when selected)
       still shows around it. With the tap selected (tapsel) the strip wears
       the selection in pink and the top part goes back to rest. */
    .layer.with-tap {
      grid-template-rows: minmax(44px, auto) auto; row-gap: 0; padding-bottom: 0;
    }
    .tap-strip {
      --tp: var(--wa-hue-red);
      grid-column: 1 / -1; display: flex; align-items: center; gap: 8px; min-width: 0;
      height: 24px; margin: 0 -6px 0 -4px; padding: 0 6px 0 9px;
      border-top: 0;
      border-radius: 0 0 var(--wa-r-sm) var(--wa-r-sm);
      font-size: 13px; font-weight: 600; color: var(--tp);
      background: color-mix(in srgb, var(--tp) 9%, var(--wa-field));
    }
    /* The strip runs to the row's edges, so its hit area is the strip. */
    .tap-strip { position: relative; }
    .tap-strip::after { content: ""; position: absolute; inset: 0; }
    .tap-strip:hover { background: color-mix(in srgb, var(--tp) 16%, var(--wa-field)); }
    .tap-strip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.tapsel {
      background: var(--wa-field);
      box-shadow: none;
    }
    .layer.tapsel .tap-strip {
      background: var(--wa-pick-bg);
      box-shadow: inset 0 0 0 1px var(--wa-pick-line); border-top-color: transparent;
    }
    .layer.dim .tap-strip { opacity: .55; }
    /* The layer selected, not its tap: only the top part wears the selection.
       The row itself goes back to rest and a layer behind the content (the
       isolation keeps it above the row's own ground) draws the ground and
       edge down to the top of the strip, which is 24px tall. */
    .layer.with-tap { isolation: isolate; }
    .layer.with-tap.hl:not(.tapsel) {
      background: var(--wa-field);
      box-shadow: none;
    }
    .layer.with-tap.hl:not(.tapsel)::before {
      content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 24px; z-index: -1; pointer-events: none;
      border-radius: var(--wa-r-sm) var(--wa-r-sm) 0 0;
      background: var(--wa-pick-bg);
      box-shadow: inset 0 0 0 1px var(--wa-pick-line);
    }
    .tap-strip .tap-glyph { display: grid; place-items: center; flex: none; }
    .tap-strip .tap-glyph svg { width: 13px; height: 13px; }
    .tap-strip .tap-words { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tap-strip .tap-where { margin-left: auto; flex: none; white-space: nowrap; opacity: .85; }
    /* The strip's trash waits for the pointer, like the row's own buttons.
       Hidden rather than taken out, so the strip keeps its width. */
    /* Positioned so it paints above the strip's ::after hit area, which
       otherwise swallowed the trash's click and selected the tap instead. */
    .tap-strip .tap-del { position: relative; z-index: 1; margin-left: auto; width: 22px; height: 20px; flex: none; color: var(--tp); opacity: .7; visibility: hidden; }
    .tap-strip:hover .tap-del, .tap-strip:focus-visible .tap-del, .tap-strip .tap-del:focus-visible { visibility: visible; }
    .tap-strip .tap-where + .tap-del { margin-left: 4px; }
    .tap-strip .tap-del:hover { opacity: 1; }
    .tap-strip .tap-del svg.ui-icon { width: 14px; height: 14px; }
    /* The right end of a row holds one thing at a time: the badges at rest,
       the buttons under the pointer. They trade places rather than stand side
       by side, so the badges keep the right edge and the row keeps its width.
       The selected row used to keep its buttons out too, which put five icons
       over a long name for as long as the row was selected; now only the
       pointer brings them, and keyboard focus (focus-visible, so a click that
       focuses the row does not count).

       The :has(.acts) guard is what keeps the swap honest. A pinned row and a
       read-only document carry badges and no buttons, and without it hovering
       one hid the badge and put nothing in its place. */
    .layer .acts { display: none; gap: 0; }
    .layer:hover .acts, .layer:focus-visible .acts, .layer:has(.acts :focus-visible) .acts { display: inline-flex; }
    .layer:hover:has(.acts) .badges,
    .layer:focus-visible:has(.acts) .badges,
    .layer:has(.acts :focus-visible) .badges { display: none; }
    .layer .acts button.icon { width: 26px; height: 26px; border-radius: 50%; }
    .layer .acts svg.ui-icon { width: 15px; height: 15px; }
    /* The row being dragged leaves the list. The slot opening under the
       pointer already says where the layer is going, so a ghost of it left
       behind in its old place is one thing too many to read.

       Collapsed, not removed: taking the drag source out of the document
       cancels the drag. The negative margin eats the second of the two 6px
       gaps a zero-height row would otherwise sit between. */
    .layer.dragging, .group-kids.dragging, .group-box.dragging {
      height: 0; min-height: 0; margin-top: -1px; margin-bottom: -1px;
      padding-top: 0; padding-bottom: 0; border-top-width: 0; border-bottom-width: 0;
      opacity: 0; overflow: hidden;
    }
    /* The row that is not a layer: Background, the shape under everything and
       what a tap anywhere else does. It cannot be dragged, grouped or
       deleted, so it sits below one hairline, where nothing can be dropped
       past it. The row itself looks like every other row, tap strip and all:
       the darker full-bleed tray it used to sit in read as a different kind
       of thing from the layers (Jesse, 2026-09-24). */
    .pinned-set {
      flex: none; margin: 6px 10px 0; padding: 6px 0 10px; border-top: 1px solid var(--wa-line);
      display: flex; flex-direction: column; gap: 4px;
    }
    /* Inline has no stack above its rows, so they sit at the foot of the card,
       where a canvas shape's own rows end up. */
    .inline-layers .pinned-set { margin-top: auto; }
    .layer.pinned .grip { cursor: default; }
`,Oi=T`
    /* Left column cards: Pages, Layers and Shared values. Each wears its hue
       in three places only: the lit outline, the filled chip behind its title
       glyph, and nothing else in it. The fill is the plain card. */
    .card.lc {
      --c: var(--wa-accent); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
      padding: 0; border-radius: var(--wa-lc-r); box-shadow: none;
      ${Mi}
    }
    .card.pages-card { --c: var(--wa-lc-pages); }
    .card.layers-card { --c: var(--wa-lc-layers); }
    .card.sv-card { --c: var(--wa-lc-values); }
    .lc-head .swatch {
      width: 18px; height: 18px; border-radius: 5px; border: 0; flex: none; display: grid; place-items: center;
      background: var(--c); color: var(--wa-chip-ink);
    }
    .lc-head .swatch svg.ui-icon { width: 11px; height: 11px; stroke-width: 2.6; }
    .lc-head {
      display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; min-height: 40px; padding: 6px 8px 6px 10px;
    }
    .lc-head .spacer { flex: 1; }
    /* A card's title: small capitals, the same as the inspector's. */
    .lc-title { font-size: 12px; font-weight: 500; letter-spacing: .09em; text-transform: uppercase; color: var(--wa-ink); }
    .lc-sub { font-size: 12px; font-weight: 400; color: var(--wa-muted); white-space: nowrap; }
    .lc-sub b { color: var(--wa-ink); font-weight: 600; }
    /* The Pages line never wraps: the page buttons, + and ··· keep their row
       and the note beside the title gives way first. */
    .pages-card .lc-head { flex-wrap: nowrap; }
    .pages-card .lc-title { flex: none; }
    .pages-card .lc-sub { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .pages-card .lc-head .spacer { min-width: 0; }
    button.lc-btn, button.lc-ghost {
      font: inherit; font-size: 13px; font-weight: 600; line-height: 1; cursor: pointer; flex: none; white-space: nowrap;
      display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 9px; border-radius: 6px;
      border: 1px solid var(--wa-line); background: var(--wa-panel); color: var(--wa-ink);
    }
    button.lc-btn svg.ui-icon, button.lc-ghost svg.ui-icon { width: 13px; height: 13px; }
    /* A card's button (Add, Add a page, Done): the lit outline in green with
       no fill of color, on the field grey. The card's own hue stays on the
       card. */
    button.lc-btn, button.lc-btn.pri {
      --c: var(--wa-hue-green); --lo-fill: var(--wa-field); --lo-mid: var(--wa-go-mid);
      height: 24px; color: var(--wa-ink);
      ${Ue}
    }
    button.lc-btn:hover:not(:disabled) { --lo-fill: var(--wa-hover); ${Ue} }
    button.lc-ghost { background: transparent; border-color: var(--wa-line-strong); color: var(--wa-muted); padding: 0 7px; letter-spacing: .04em; }
    button.lc-ghost.sm { height: 24px; font-size: 11px; }
    /* The Rows and Pictures buttons: a glyph showing the view on, and the
       setting's name in small type under it. The word never changes, so the
       buttons keep their width as the views step round. */
    button.lc-ghost.lc-view { flex-direction: column; justify-content: center; gap: 2px; height: 32px; padding: 0 5px; }
    button.lc-ghost.lc-view svg.ui-icon { width: 14px; height: 14px; }
    button.lc-ghost.lc-view .lc-view-word { font-size: 9px; font-weight: 600; letter-spacing: .02em; line-height: 1; }
    /* A ghost that still reads as a button: Save to parts sits on a line of
       plain text, where a bare label was easy to miss. */
    button.lc-ghost.outline { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    button.lc-ghost:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    button.lc-ghost[aria-pressed="true"], button.lc-ghost[aria-expanded="true"] { color: var(--wa-ink); background: var(--wa-raise); }
    button.lc-btn:focus-visible, button.lc-ghost:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.lc-btn:disabled, button.lc-ghost:disabled { opacity: .45; cursor: default; }
    /* The page tiles under the Pages header: one per page, the one showing
       raised in neutral grey, each with its own trash can. */
    .page-tiles { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 10px 2px; }
    .page-tile {
      display: inline-flex; align-items: stretch; height: 40px; flex: 1 1 96px; min-width: 96px; max-width: 170px;
      border-radius: 7px; overflow: hidden; background: var(--wa-field); box-shadow: none;
    }
    .page-tile.on { background: var(--wa-raise); box-shadow: none; }
    .page-tile .page-pick {
      flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 1px;
      padding: 0 10px; border: 0; background: transparent; color: var(--wa-muted); font: inherit; cursor: pointer; text-align: left;
    }
    .page-tile .page-pick b { font-size: 12px; font-weight: 650; color: var(--wa-ink); white-space: nowrap; }
    .page-tile .page-pick span { font-size: 10.5px; white-space: nowrap; }
    .page-tile .page-pick:hover { background: color-mix(in srgb, var(--wa-ink) 5%, transparent); }
    .page-tile .page-pick:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .page-tile .page-trash {
      flex: none; width: 26px; border: 0; border-left: 1px solid color-mix(in srgb, var(--wa-line) 70%, transparent);
      background: transparent; color: var(--wa-muted); opacity: .7; cursor: pointer; display: grid; place-items: center; font: inherit;
    }
    .page-tile .page-trash svg.ui-icon { width: 13px; height: 13px; }
    .page-tile .page-trash:hover, .page-tile .page-trash:focus-visible { opacity: 1; color: #FF453A; background: color-mix(in srgb, #FF453A 14%, transparent); outline: none; }
    .page-tile .page-trash.armed { width: auto; padding: 0 8px; opacity: 1; font-size: 10.5px; font-weight: 700; background: #FF453A; color: #fff; }
    .page-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 4px; padding: 4px 8px 8px; }
    /* The ? beside a card's title: the help for that card. */
    button.lc-help {
      width: 18px; height: 18px; margin-left: -2px; padding: 0; border: 1px solid var(--wa-line); border-radius: 50%; cursor: pointer; flex: none;
      font: inherit; font-size: 10.5px; font-weight: 700; line-height: 1; background: transparent; color: var(--wa-muted);
    }
    button.lc-help:hover { color: var(--wa-ink); border-color: var(--wa-line-strong); background: var(--wa-panel); }
    button.lc-help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* The one line under the Pages header while nothing can turn a page. */
    .lc-note { display: flex; align-items: center; gap: 6px; margin: 0 10px 8px; padding: 5px 10px; border-radius: 7px; font-size: 11.5px; }
    .lc-note.warn { color: var(--wa-amber); background: var(--wa-amber-bg); box-shadow: inset 0 0 0 1px var(--wa-amber-line); }
    .lc-note button.link { margin-left: auto; font-weight: 700; color: inherit; text-decoration: underline; }
    .lc-note span { line-height: 1.4; }
    .lc-note b { font-weight: 700; }
    /* One page: a quiet line over the Layers card, not a card of its own. */
    .pages-slim {
      display: flex; align-items: center; gap: 6px; min-height: 28px; padding: 0 2px 0 10px;
      font-size: 12px; color: var(--wa-muted);
    }
    .pages-slim .spacer { flex: 1; }
    .pages-slim-ic { display: inline-grid; place-items: center; flex: none; }
    .pages-slim-ic svg.ui-icon { width: 13px; height: 13px; }
    .pages-slim button.lc-ghost { border-color: transparent; letter-spacing: 0; font-weight: 500; }
    .pages-slim button.lc-ghost:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    .pages-card .lc-note { margin: 8px 12px 0; }
    .pages-card .page-tour-bar { margin: 0 12px 10px; }
    /* The Layers card's filter line, and the rows under it. */
    .lc-filter { display: flex; align-items: center; gap: 6px; min-height: 30px; padding: 0 10px; }
    .lc-filter .lc-sub { white-space: normal; }
    .lc-filter button.lc-ghost { margin-left: auto; }
    .lc-filter button.lc-ghost + button.lc-ghost { margin-left: 0; }
`,Vi=T`
    .lc-filter .lc-drag { font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
    .lc-filter .lc-sub + .lc-drag::before { content: "·"; margin-right: 6px; }
    /* The card is a column whose list takes what is left. Its header and its
       count line keep their own height, however many rows they wrap to in a
       narrow column, or the list would squash them and draw over them. */
    .layers-card > :is(.lc-head, .lc-filter, .group-cta) { flex: none; }
    .lc-filter .lc-sub { white-space: nowrap; }
    /* A narrow column: the notes go, so the buttons keep one row longer. */
    @container layers (max-width: 380px) {
      .layers-card > .lc-head .lc-sub, .lc-filter .lc-drag { display: none; }
    }
    .layers-card > .group-cta { margin: 6px 10px 0; }
    .layers-card > .hint { margin: 6px 10px 0; }
    .layers-card > .lc-empty { margin: 0; padding: 24px 16px; text-align: center; font-size: 12px; line-height: 1.5; color: var(--wa-muted); }
    .layers-card > .layers { padding: 4px 10px 0; }
    .layers-sec {
      flex: none; margin: 6px 2px 0; font-size: 11px; font-weight: 500; letter-spacing: .09em; text-transform: uppercase; color: var(--wa-muted);
    }
    .layers-sec:first-child { margin-top: 0; }
`,Bi=T`
    /* Background: its caption where a layer's badges sit. */
    .layer.pinned .ground-cap { font-size: 11px; color: var(--wa-muted); white-space: nowrap; }
    .layer.pinned.ground .grip { visibility: hidden; }
`,Gi=T`
    /* Expanded rows say more: a third line about what the layer is made of,
       its meta free to wrap, and the badges kept beside the buttons rather
       than swapped for them. */
    .layer.rich .name small { white-space: normal; overflow: visible; text-overflow: clip; }
    .layer.rich .facts { display: flex; flex-wrap: wrap; gap: 2px 8px; margin-top: 2px; font-size: 11.5px; color: var(--wa-muted); }
    .layer.rich .facts .fact { white-space: nowrap; }
    .layer.rich .facts .fact b { font-weight: 600; color: var(--wa-ink); opacity: .75; }
    /* An expanded row swaps its badges for its buttons, the same as a compact
       one. It used to keep both, with the buttons held in the layout and only
       turned invisible, so that arriving they could not widen the right end
       and wrap the facts onto another line. That reserved width sat to the
       right of the badges and pushed them off the edge every other row lines
       up on, so at rest the badges read as crooked. The right end still never
       wraps. */
    .layer.rich .right { flex-wrap: nowrap; justify-content: flex-end; gap: 4px; }
`,Wi=T`
    /* The canvas column: one card holding the bar, the big preview and the
       strip of things about the whole complication. */
    /* The canvas column is three blocks stacked: what the whole complication
       is, the face itself, and the two lists of values under it. */
    /* No reserved scrollbar gutter: the canvas fills its column and almost
       never scrolls, and the 11px it kept free doubled the gap before the
       inspector. A window short enough to scroll it gets the bar then. */
    .column.canvas { display: flex; flex-direction: column; gap: 6px; scrollbar-gutter: auto; }
    /* The bar and the two lists keep their own height; the face takes what is
       left, so the lists under it are on screen without scrolling. The card
       is the canvas well: a step darker than the page's cards, with a faint
       dot grid, so the face reads as sitting on a drawing surface. */
    .column.canvas > .card.canvas-card {
      padding: 0; overflow: hidden; flex: 1 1 auto; min-height: 260px;
      display: flex; flex-direction: column;
      border-radius: var(--wa-lc-r);
      background: radial-gradient(var(--wa-well-dot) 1px, transparent 1.2px) 0 0 / 14px 14px, var(--wa-well);
      box-shadow: inset 0 0 0 1px var(--wa-well-line);
    }
`,Ui=T`
    /* The preview bar's own menus (grid size, Preview as), in place of native
       selects, whose closing menu made Chrome on macOS hold the next click. */
    .pop-menu {
      position: absolute; top: calc(100% + 6px); right: 0; z-index: 50; min-width: 84px; max-width: calc(100vw - 16px);
      background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
      border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 4px;
      display: flex; flex-direction: column; gap: 1px;
    }
    .pop-menu .row {
      font: inherit; font-size: 12.5px; font-weight: 600; text-align: left; font-variant-numeric: tabular-nums; white-space: nowrap;
      background: transparent; border: 0; color: inherit; padding: 6px 10px; border-radius: 7px; cursor: pointer;
    }
    .pop-menu .row:hover { background: var(--wa-panel); }
    .pop-menu .row[aria-selected="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .pop-menu .row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,ji=T`
    .tint-dot {
      display: inline-block; flex: none; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; vertical-align: -1px;
      background: var(--sw); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ink) 45%, transparent);
    }
    button.case-pick .tint-dot { margin-right: 0; }
    .tint-dot.full { background: conic-gradient(#FF453A 0 25%, #FFD60A 0 50%, #30D158 0 75%, #0A84FF 0); }
`,Ki=T`
    /* A row: a tile for the kind of source, the name over what it reads, the
       value it reads now, and how many layers read it. The same ground and
       hairline as a Layers row. */
    .values-list .datum.svr {
      display: grid; grid-template-columns: 22px minmax(0, 1fr) auto auto; align-items: center; gap: 10px;
      min-height: 40px; padding: 4px 6px 4px 10px; border-radius: var(--wa-r-sm);
      background: var(--wa-field); box-shadow: none;
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .values-list .datum.svr:hover { background: var(--wa-hover); box-shadow: none; }
    /* Open, and read by the selected layer: the picked row's blue, filled
       for the one read by the selection and an edge for the open one. Read
       by the layer the pointer rests on over the face: an edge only. */
    .values-list .datum.hl { box-shadow: inset 0 0 0 1px var(--wa-pick-line); background: var(--wa-field); }
    .values-list .datum.sel { background: var(--wa-pick-bg); box-shadow: inset 0 0 0 1px var(--wa-pick-line); }
    .values-list .datum.peek:not(.sel):not(.hl) { box-shadow: inset 0 0 0 1px var(--wa-pick-line); }
    .svr-ico {
      width: 22px; height: 28px; display: grid; place-items: center;
      background: none; color: var(--c);
    }
    .svr-ico svg { width: 18px; height: 18px; }
    .svr-ico.need { background: color-mix(in srgb, var(--wa-need) 14%, transparent); color: var(--wa-need); }
    .svr-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .svr-text .nm { font-size: 13px; font-weight: 600; color: var(--wa-ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .svr-src { display: flex; align-items: baseline; gap: 6px; min-width: 0; font-size: 11px; color: var(--wa-muted); overflow: hidden; white-space: nowrap; }
    .svr-src > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .svr-src .svr-ent { flex: 0 1 auto; color: color-mix(in srgb, var(--wa-ink) 75%, var(--wa-muted)); }
    .svr-src .svr-id { flex: 0 1000 auto; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10.5px; }
    .svr-src .svr-need { flex: none; color: var(--wa-need); font-weight: 600; }
    .svr-now {
      max-width: 120px; padding: 2px 0; overflow: hidden; text-overflow: ellipsis; white-space: pre;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; font-weight: 500;
      color: var(--wa-val); background: none;
    }
    .svr-now.none { font-family: inherit; font-weight: 500; font-style: italic; color: var(--wa-muted); background: transparent; }
    .svr-uses {
      min-width: 22px; height: 22px; padding: 0 6px; border-radius: 11px; display: grid; place-items: center;
      font-size: 12px; font-weight: 500; color: var(--wa-ink); background: var(--wa-raise);
    }
    .svr-end { display: grid; place-items: center; min-width: 28px; }
    .svr-end > * { grid-area: 1 / 1; }
    .values-list .datum.svr .svr-end button.icon { opacity: 0; pointer-events: none; }
    .values-list .datum.svr:is(:hover, :focus-within) .svr-end:has(button.icon) .svr-uses { opacity: 0; }
    .values-list .datum.svr:is(:hover, :focus-within) .svr-end button.icon { opacity: .7; pointer-events: auto; }
    .values-list .datum.svr .svr-end button.icon:hover:not(:disabled), .values-list .datum.svr .svr-end button.icon:focus-visible { opacity: 1; }
    /* The Shared values card: one line under the Layers card, the list
       unfolding under it. The list is as tall as its rows, up to a third
       of the window, and scrolls past that. A drag of the top edge sets its
       height until another complication opens. */
    .sv-card { position: relative; }
    .sv-card .lc-sub { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .sv-card button.lc-help.on { color: var(--wa-ink); border-color: var(--wa-line-strong); background: var(--wa-raise); }
    .sv-body {
      max-height: 33vh; overflow-y: auto; padding: 0 10px 10px; display: flex; flex-direction: column; gap: 6px;
      scrollbar-width: thin; scrollbar-color: var(--wa-line-strong) transparent;
    }
    .sv-none { font-size: 12px; color: var(--wa-muted); padding: 2px 4px; }
    /* The resize edge: the gap above the card. A short bar shows on hover. */
    .sv-grip { position: absolute; left: 0; right: 0; top: -7px; height: 10px; cursor: row-resize; z-index: 5; touch-action: none; }
    .sv-grip::after {
      content: ""; position: absolute; left: 50%; top: 3px; width: 36px; height: 4px; margin-left: -18px; border-radius: 2px;
      background: var(--wa-accent); opacity: 0; transition: opacity .12s ease-out;
    }
    .sv-grip:hover::after, .sv-grip.dragging::after { opacity: .8; }
    .layout.cols-1 .sv-body { max-height: none; overflow: visible; }
`,pf=T`
      /* A see-through Background's checkerboard (.layer .thumb.clear). */
      --wa-dark-check-a: #2a2a2e;
      --wa-dark-check-b: #1a1a1d;
`,hf=T`
    /* Canvas column: quiet header, tool strip, zoomable stage, values bar, first run. */
    /* The left cards' hues: Pages blue, Layers green, Shared values red
       (LEFT_CARD_COLOR in kinds.ts), from the palette the panel sets. */
    :host, .wa-chrome {
      --wa-lc-pages: ${je(wt.pages)};
      --wa-lc-layers: ${je(wt.layers)};
      --wa-lc-values: ${je(wt.values)};
    }
    .wa-chrome, .canvas-card {
      --wa-float-bg: var(--wa-card);
      --wa-float-line: var(--wa-line);
      --wa-float-shadow: none;
      --wa-float-sep: var(--wa-line-strong);
      --wa-hint: var(--wa-muted);
      --wa-live: var(--wa-hue-green);
      --wa-testing: var(--wa-hue-orange);
      /* On the black face, in either skin. */
      --wa-face-muted: #8e8e93;
    }
`,Ji=T`
    .column.canvas > .card.canvas-card { min-height: 440px; container: cvcard / inline-size; }
    /* The head wraps rather than squeezes. It used to be one fixed 48px line
       with every part allowed to shrink, so in a middling width the shape's
       name was cut to nothing with no sign anything was missing. Now each
       part (the name, the device part where an editor has one, the shape,
       the actions) keeps its natural width, and a part that does not fit
       moves down to a second line whole, slash and all. The actions keep to
       the right edge of whichever line they land on. */
    .cv-head {
      display: flex; flex-wrap: wrap; align-items: center; column-gap: 10px; row-gap: 6px;
      min-height: 44px; padding: 7px 10px; box-sizing: border-box; flex: none; min-width: 0;
      /* A container of its own, the same as the inspector's head. */
      margin: 6px 6px 0; background: var(--wa-card); border: 1px solid var(--wa-frame); border-radius: var(--wa-lc-r);
    }
    .cv-part { display: inline-flex; align-items: center; gap: 10px; flex: 0 1 auto; min-width: 0; }
    .cv-acts { display: inline-flex; align-items: center; gap: 6px; flex: none; margin-left: auto; }
    .cv-head .tb-name { flex: 0 1 auto; margin-left: -8px; }
    .cv-slash { flex: none; color: var(--wa-line-strong); }
    /* The whole-document actions: quiet buttons that read as one set. Delete
       goes red, and while it is armed the choices stand in its place. */
    button.cv-act {
      display: inline-flex; align-items: center; gap: 4px; flex: none; height: 26px; padding: 0 10px; border-radius: 6px; cursor: pointer;
      font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap;
      border: 0; background: var(--wa-card); color: var(--wa-ink);
    }
    button.cv-act:hover:not(:disabled), button.cv-act[aria-expanded="true"] { background: var(--wa-hover); }
    button.cv-act:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.cv-act:disabled { opacity: .45; cursor: default; }
    button.cv-act.danger { color: var(--wa-hue-red); }
    button.cv-act.danger:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-hue-red) 14%, var(--wa-card)); }
`,qi=T`
    button.cv-act.icon { width: 26px; padding: 0; justify-content: center; }
    button.cv-act.icon svg.ui-icon { width: 15px; height: 15px; }
    /* Undo and redo are ink while there is a step to take, and faint when
       there is none. */
    button.cv-act.undo:disabled { opacity: 1; color: var(--wa-faint); }
    .cv-del { display: inline-flex; align-items: center; gap: 6px; flex: none; }
    /* Hairlines part the head's groups: Undo and Redo, Duplicate, and
       Delete. */
    .cv-div { width: 1px; height: 20px; flex: none; background: var(--wa-line); }
    .cv-shape {
      display: inline-flex; align-items: center; gap: 6px; flex: 0 4 auto; min-width: 0;
      font-size: 12px; color: var(--wa-muted); white-space: nowrap;
    }
    .cv-shape .fam { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .cv-shape small { font-size: 11px; }
    .cv-shape .warn { display: inline-flex; color: var(--wa-val); }
    .cv-shape .warn svg { width: 14px; height: 14px; }
    .cv-head .shape-seg { padding: 2px; gap: 2px; border-radius: 9px; flex-wrap: nowrap; }
    .cv-head .shape-seg button.tab { height: 26px; padding: 0 10px; font-size: 12px; }
    /* A narrow canvas (a phone, or a column dragged in) cannot hold the head
       on one line: the parts were drawn over the shape's name and the
       Duplicate button. It folds instead: the name with the whole-document
       actions, then its shape, then the device part in the editors whose
       head has one. The ::after is the line break, a full width item of no
       height. */
    @container cvcard (max-width: 560px) {
      .cv-head { padding: 6px 12px 8px; column-gap: 8px; }
      .cv-head::after { content: ""; order: 3; flex: 0 0 100%; height: 0; }
      .cv-head .cv-slash { display: none; }
      /* The name keeps its own width (a zero basis let the typed name spill
         over the facts beside it), the actions stay at its right, and the
         facts take the next line. */
      .cv-head .tb-name { order: 0; flex: 1 1 auto; }
      .cv-head .tb-name > input.tb-name-input[type=text] { max-width: 100%; }
      .cv-head .cv-acts { order: 1; gap: 8px; }
      .cv-head .cv-what { order: 2; flex: 1 1 100%; }
      .cv-head .cv-what .cv-shape { white-space: normal; }
      .cv-head .cv-what .fam { overflow: visible; overflow-wrap: anywhere; }
      .cv-head .cv-where { order: 4; flex: 0 1 auto; }
    }
`,Xi=T`
    /* The stage: the dotted surface, the zoomable face on it, and the values
       bar at its foot. The face's Fit size comes from the stage-wrap's own
       box, through container units, so no script measures anything. */
    /* The dot grid is the canvas card's own, so the stage adds nothing. */
    .stage-area {
      flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column;
      background: none;
    }
    .stage-wrap { position: relative; flex: 1 1 auto; min-height: 300px; container-type: size; }
    .stage-wrap.first-run { min-height: 540px; }
    .stage-wrap > .stage {
      position: absolute; inset: 0; display: flex; flex-direction: column; align-items: stretch; gap: 12px;
      padding: 2px 24px 16px; overflow: auto; background: none; container-type: normal;
      /* A face zoomed past the stage still pans with the wheel and the
         trackpad, but no bar is drawn: the stage's right edge is the card's,
         and a bar there stood between the canvas and the inspector. At Fit
         the face no longer overruns the stage (stageReserve counts the hint's
         three lines and the gap over it). */
      scrollbar-width: none;
    }
    .stage-wrap > .stage::-webkit-scrollbar { display: none; width: 0; height: 0; }
    .stage-wrap > .stage.control-stage { align-items: center; justify-content: center; padding-top: 24px; }
    .stage-wrap .row-strip { align-self: center; flex: none; }
    /* Auto margins centre the face both ways and never push it past the
       stage's top or left edge, so a face zoomed past the stage scrolls from
       its own corner. */
    .stage-face { margin: auto; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .stage-face > .preview { width: auto; }
    .stage-wrap .stage-face > .preview > svg {
      width: calc(max(120px, min(100cqw - 48px, (100cqh - var(--wa-reserve, 124px)) * var(--wa-ratio, 1))) * var(--wa-zoom, 1));
      max-width: none;
    }
    /* What is selected, named just over the face's top left corner, the way a
       drawing app names a frame. Left, not centred, so it stays clear of the
       floating toolbar when the face reaches the top of the stage. */
    .face-label {
      position: absolute; left: 0; bottom: calc(100% + 6px); max-width: 100%; z-index: 2;
      display: flex; align-items: center; gap: 8px; font-size: 12px; line-height: 18px;
      color: var(--wa-hint); white-space: nowrap; overflow: hidden; pointer-events: none;
    }
    /* The kind as a neutral pill: what it is matters, not a color for it. */
    .face-label .fl-kind {
      flex: none; padding: 0 8px; border-radius: 6px; font-size: 11px; font-weight: 600;
      color: var(--wa-soft); background: var(--wa-field); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
    }
    .face-label .fl-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; color: var(--wa-ink); font-weight: 600; }
    .face-label .fl-group { min-width: 0; flex: 0 1 auto; display: inline-flex; align-items: center; gap: 3px; overflow: hidden; text-overflow: ellipsis; }
    .face-label .fl-sep { flex: none; opacity: .6; }
    .face-label .fl-lock { display: inline-flex; flex: none; font-size: 10px; }
    .face-label .fl-lock svg { width: 10px; height: 10px; }
    /* Three lines tall whatever it says, the most any hint wraps to, and read
       from the top. The face is centred together with the hint, so a hint that
       grew from one line to two when a layer was selected pushed the face up. */
    .stage-face > .under {
      max-width: 460px; font-size: 12px; font-weight: 400; color: var(--wa-label, var(--wa-muted));
      line-height: 15px; min-height: 45px; align-items: flex-start; align-content: flex-start;
    }
    .stage-page { position: absolute; top: 25px; left: 16px; z-index: 3; font-size: 11px; color: var(--wa-hint); pointer-events: none; }
    .stage-tools {
      /* It rides in the face's own column, just over the face. The margin
         keeps it clear of the selection's name over the face's corner. */
      position: sticky; top: 0; left: 0; right: 0; z-index: 5; flex: none; box-sizing: border-box; margin-bottom: 16px;
      display: flex; align-items: center; gap: 2px; height: 34px; padding: 0 4px; max-width: calc(100cqw - 24px);
      border-radius: 8px; background: var(--wa-float-bg); border: 1px solid var(--wa-line-strong); box-shadow: var(--wa-float-shadow);
    }
    button.tb {
      display: inline-flex; align-items: center; gap: 7px; flex: none; height: 26px; padding: 0 10px; border-radius: 6px;
      border: 1px solid transparent; background: transparent; color: var(--wa-ink); cursor: pointer;
      font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap;
    }
    button.tb:hover:not(:disabled) { background: var(--wa-hover); }
    button.tb:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tb:disabled { opacity: .4; cursor: default; }
    /* A tool that is on: ink on paper, the loudest thing in the strip. */
    button.tb.on, button.tb.on:hover:not(:disabled) { background: var(--wa-on-bg); color: var(--wa-on-ink); border-color: transparent; font-weight: 600; }
    button.tb.lit { color: var(--wa-ink); font-weight: 600; }
`,Yi=T`
    button.tb .tb-glyph { width: 13px; height: 13px; flex: none; }
    button.tb > svg.ui-icon { width: 14px; height: 14px; flex: none; }
    button.tb .caret { display: inline-flex; margin-left: -3px; color: var(--wa-hint); }
    button.tb .caret svg { width: 11px; height: 11px; }
    /* The Preview menu joins the case and the color on one button: the case
       size, then the color as a dot. The menu under it has the two lists
       under small headings. */
    button.tb .tint-dot { margin: 0 1px; }
    .pop-menu.preview-menu { min-width: 190px; }
    /* The canvas card clips, so a menu off the toolbar must fit the stage it
       hangs in (the stage wrap is a size container). On a phone the stage is
       half the screen and Preview as ran past it with its last tints cut
       off; it scrolls instead. */
    .stage-tools .pop-menu { max-height: calc(100cqh - 64px); overflow-y: auto; overscroll-behavior: contain; }
`,Zi=T`
    .pop-menu .pop-title { padding: 7px 10px 6px; margin-bottom: 3px; font-size: 12.5px; font-weight: 700; color: var(--wa-ink); border-bottom: 1px solid var(--wa-line); }
    .pop-menu .pop-head { padding: 6px 10px 3px; font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); }
    .preview-menu .row[aria-checked="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    button.tb .tint-dot { margin-right: 0; }
    .tb-dot { width: 5px; height: 5px; margin-left: -4px; border-radius: 50%; background: currentColor; flex: none; }
    button.tb.icon { padding: 0 7px; font-size: 14px; }
    button.tb.pct { min-width: 42px; padding: 0 4px; justify-content: center; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
    .tb-sep { width: 1px; height: 18px; margin: 0 6px; background: var(--wa-float-sep); flex: none; }
    .tb-zoom { display: inline-flex; align-items: center; }
    .stage-tools .case-tool .pop-menu { left: 0; }
    @container (max-width: 680px) {
      .stage-tools .word:not(.keep) { display: none; }
      .stage-tools button.tb { gap: 4px; padding: 0 6px; }
      .stage-tools .tb-sep { margin: 0 3px; }
    }
    /* A phone-width stage: the toolbar takes two rows rather than losing the
       zoom off its end, and the face starts under both. */
    @container (max-width: 460px) {
      .stage-tools { flex-wrap: wrap; justify-content: center; height: auto; padding: 4px; row-gap: 2px; width: max-content; }
      .stage-tools .tb-sep { display: none; }
      .stage-page { top: auto; bottom: 8px; }
    }
    .snap-menu { min-width: 220px; }
    .pop-menu .row.snap-row { display: flex; align-items: center; gap: 10px; }
    .snap-row .tog {
      position: relative; display: inline-block; flex: none; width: 26px; height: 14px; border-radius: 7px; background: var(--wa-switch-off);
    }
    .snap-row .tog.on { background: var(--wa-switch-on); }
    .snap-row .tog i { position: absolute; top: 2px; left: 2px; width: 10px; height: 10px; border-radius: 5px; background: #fff; transition: left .12s ease-out; }
    .snap-row .tog.on i { left: 14px; }
    .snap-steps { display: flex; gap: 2px; margin: 0 6px 4px 46px; padding: 2px; border-radius: 6px; background: var(--wa-field); }
    .snap-steps button {
      flex: 1; padding: 3px 6px; border: 0; border-radius: 5px; background: transparent; color: var(--wa-muted); cursor: pointer;
      font: inherit; font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums;
    }
    .snap-steps button.on { background: var(--wa-seg-on); color: var(--wa-ink); }
    .snap-steps button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`,md=T`
    /* A dark fall from the top to the foot, and a one pixel edge lit from
       the top left in the screen's hue. */
    .column.canvas > .card.canvas-card.lit {
      border-radius: 22px; border: 1px solid transparent;
      background:
        linear-gradient(180deg, var(--wa-stage-top) 0%, var(--wa-stage-bottom) 100%) padding-box,
        linear-gradient(140deg, var(--wa-stage-hue, var(--wa-line-strong)) 0%, color-mix(in srgb, var(--wa-stage-hue, var(--wa-line-strong)) 25%, transparent) 32%,
          var(--wa-card-mid, var(--wa-line)) 64%, color-mix(in srgb, var(--wa-stage-hue, var(--wa-line-strong)) 15%, transparent) 100%) border-box;
      box-shadow: inset 0 1px 0 color-mix(in srgb, var(--wa-ink) 7%, transparent);
    }
    .canvas-card.lit > .cv-head { border-radius: 16px; }
    /* The light falls on the watch from the top centre of the stage, under
       the head and the page's strip, and is a fixed depth, so a long page's
       stage is not lit all the way down. The floor: a faint band at the
       stage's foot under a hairline, where the hint and the tool pill sit.
       All drawn as the stage's background, so always under the watch. */
    .canvas-card.lit .stage-area {
      padding: 20px 12px 18px; gap: 10px;
      background:
        radial-gradient(48% 420px at 50% 0%, var(--wa-stage-light) 0%, transparent 80%) no-repeat,
        linear-gradient(color-mix(in srgb, var(--wa-ink) 5%, transparent), color-mix(in srgb, var(--wa-ink) 5%, transparent)) left 0 bottom 120px / 100% 1px no-repeat,
        linear-gradient(180deg, color-mix(in srgb, var(--wa-ink) 3%, transparent), transparent) left 0 bottom 0 / 100% 120px no-repeat;
    }
    /* The watch gives back a faint reflection of its lowest edge only, so a
       tall page's reflection is as short as a small one's. */
    .canvas-card.lit .stage-area .wa-watch {
      -webkit-box-reflect: below 6px linear-gradient(transparent calc(100% - 32px), var(--wa-stage-reflect));
    }
    /* Each editor's box round the watch scrolls sideways, so it clips: room
       in its foot for the reflection, the hint under it starting about where
       the reflection fades. */
    .canvas-card.lit .stage-area > :is(.pe-stage-body, .me-stage-body, .sp-stage-body, .ve-stage-body) {
      padding-bottom: 42px; margin-bottom: -10px;
    }
    /* The tools: a floating pill centred at the stage's foot, under the
       watch and its hint. It stays in the flow (moved last by order) rather
       than floating over the stage, so however it wraps on a narrow stage
       the stage grows to hold it and it never covers the watch. */
    .canvas-card.lit .stage-area > .stage-tools {
      order: 9; align-self: center; position: relative; top: auto; z-index: 8;
      margin: 8px 0 0; height: auto; min-height: 40px; width: max-content; max-width: calc(100% - 8px);
      display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 4px; row-gap: 4px; padding: 4px;
      border-radius: 12px; background: var(--wa-card); border: 1px solid var(--wa-line-strong);
      box-shadow: var(--wa-shadow-float, var(--wa-shadow-pop));
    }
    /* Neutral 30px controls, each with its own one pixel outline. */
    .canvas-card.lit .stage-tools button.tb {
      height: 30px; gap: 7px; padding: 0 10px; border-radius: 8px; font-size: 12px;
      color: var(--wa-label, var(--wa-ink)); background: transparent; border: 1px solid var(--wa-line-strong);
    }
    .canvas-card.lit .stage-tools button.tb.icon { width: 30px; padding: 0; justify-content: center; font-size: 15px; }
    .canvas-card.lit .stage-tools button.tb.pct { min-width: 52px; padding: 0 6px; color: var(--wa-label, var(--wa-ink)); }
    .canvas-card.lit .stage-tools button.tb:hover:not(:disabled) { background: var(--wa-hover); color: var(--wa-ink); }
    /* The watch's size is a fact, not a button. */
    .canvas-card.lit .stage-tools button.tb[aria-disabled="true"] { cursor: default; }
    .canvas-card.lit .stage-tools button.tb[aria-disabled="true"]:hover { background: transparent; color: var(--wa-label, var(--wa-ink)); }
    .canvas-card.lit .stage-tools button.tb.lit { color: var(--wa-ink); border-color: var(--wa-ink); }
    .canvas-card.lit .stage-tools .tb-zoom { gap: 4px; }
    .canvas-card.lit .stage-tools .tb-sep { height: 18px; margin: 0 2px; background: var(--wa-line-strong); }
`,Qi=T`
    /* The values bar, the same floating family as the toolbar. */
    .values-foot {
      display: flex; flex: none; min-width: 0; padding: 0 12px 12px; container: vfoot / inline-size;
    }
    /* A head row over one value per row: the name on the left, its control
       on the right. The head is Live (a green dot and the word) or Testing
       (an amber dot, the value tried, what the device still shows, and Reset
       to live at the far end), never both at once. */
    .values-bar {
      display: flex; flex: 1; flex-direction: column; gap: 6px; min-width: 0; padding: 8px 10px;
      border-radius: 9px; background: var(--wa-float-bg); border: 1px solid var(--wa-float-line); box-shadow: var(--wa-float-shadow);
    }
    .vb-head { display: flex; align-items: center; gap: 8px; min-width: 0; min-height: 24px; padding-left: 6px; }
    .vb-state {
      display: inline-flex; align-items: center; gap: 8px; flex: none; max-width: 60%; min-width: 0; white-space: nowrap;
      font-size: 12px; font-weight: 700; color: var(--wa-muted);
    }
    .vb-state .vb-words { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .vb-dot { flex: none; width: 8px; height: 8px; border-radius: 4px; background: var(--wa-live); }
    .values-bar.testing .vb-state { color: var(--wa-testing); }
    .values-bar.testing .vb-dot { background: var(--wa-testing); }
    .vb-note { flex: 1 1 auto; min-width: 0; font-size: 12px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .vb-head > button.vb-live { margin-left: auto; }
    .vb-empty { min-width: 0; padding: 0 6px; font-size: 11.5px; color: var(--wa-muted); }
    /* Past seven rows (30 px each, 4 px gaps), or 40% of the window, the rest
       scrolls down. */
    .vb-pills {
      display: flex; flex-direction: column; align-items: stretch; gap: 4px; min-width: 0;
      max-height: min(40vh, 236px); overflow-y: auto; scrollbar-width: thin;
    }
    .vchip.vpill {
      display: flex; align-items: center; gap: 8px; flex: none; width: auto; height: 28px; padding: 0 10px; border-radius: 6px;
      background: var(--wa-field); border: 1px solid var(--wa-line-strong); font-size: 13px; color: var(--wa-ink); cursor: default;
      /* The slider's knob ring is the row it sits on. */
      --wa-range-ring: var(--wa-field);
    }
    .vpill .vp-icon { display: inline-flex; flex: none; color: var(--k); }
    .vpill .vp-icon svg { width: 13px; height: 13px; }
    .vpill b { flex: 1; font-weight: 500; }
    /* Every control sits in one column of the same width, so the sliders,
       pickers and readings line up down the rows. */
    .vchip.vpill .test-ctl { flex: none; width: 260px; justify-content: flex-end; gap: 10px; }
    .vchip.vpill .test-ctl input[type=range] { flex: 1 1 auto; min-width: 64px; height: 18px; --wa-range-track: var(--wa-raise); }
    .vchip.vpill.testing .test-ctl input[type=range] { --wa-range-fill: var(--wa-testing); }
    .vpill .test-ctl .val, .vpill .test-ctl input[type=text] { order: -1; }
    .vchip.vpill button.val {
      flex: none; min-width: 64px; text-align: right; color: var(--wa-ink); font-family: inherit; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums;
    }
    .vchip.vpill.testing { box-shadow: none; border-color: var(--wa-testing); }
    .vchip.vpill.testing button.val { color: var(--wa-testing); }
    /* A picker drawn like the pill it sits in, not the black input well: a
       faint tint and hairline, brighter on hover. */
    .vchip.vpill .test-ctl select {
      width: 100%; height: 22px; min-height: 22px; padding: 0 24px 0 8px; font-size: 11.5px; font-weight: 600;
      border-color: color-mix(in srgb, var(--wa-ink) 12%, transparent); background-color: color-mix(in srgb, var(--wa-ink) 6%, transparent);
      background-position: right 6px center; background-size: 12px;
    }
    .vchip.vpill .test-ctl select:hover { background-color: color-mix(in srgb, var(--wa-ink) 11%, transparent); }
    .vchip.vpill .test-ctl select option { background: var(--wa-panel); color: var(--wa-ink); }
    .vchip.vpill.testing .test-ctl select { color: var(--wa-testing); border-color: color-mix(in srgb, var(--wa-testing) 45%, transparent); }
    .vchip.vpill input[type=text] { width: 80px; min-height: 22px; font-size: 11.5px; }
    .vchip.vpill .vtag { flex: none; background: transparent; border: 1px solid var(--wa-float-sep); font-size: 9.5px; line-height: 14px; padding: 0 4px; }
    .vpill button.live-reset { display: inline-flex; flex: none; padding: 0; border: 0; background: transparent; color: var(--wa-muted); cursor: pointer; }
    .vpill button.live-reset:hover { color: var(--wa-ink); }
    .vpill button.live-reset svg { width: 13px; height: 13px; }
    .vpill .live-reset-slot { flex: none; width: 13px; }
    button.vb-live {
      flex: none; height: 22px; padding: 0 9px; border: 1px solid var(--wa-line-strong); border-radius: 6px; cursor: pointer;
      font: inherit; font-size: 12px; font-weight: 600; white-space: nowrap; background: var(--wa-field); color: var(--wa-ink);
    }
    button.vb-live:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
    button.vb-live:disabled { opacity: .45; cursor: default; }
    button.vb-live:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* A phone-width stage has no room for a name beside a control: Live or
       Testing, the values and Reset to live share one row that scrolls
       sideways. The line about what the device still shows goes; the amber
       head and the amber values already say a value is being tried. */
    @container vfoot (max-width: 520px) {
      .values-bar { flex-direction: row; align-items: center; gap: 10px; padding: 4px 8px 4px 14px; }
      .vb-head { display: contents; }
      .vb-state { order: 0; }
      .vb-note { display: none; }
      .vb-pills, .vb-empty { order: 1; }
      button.vb-live { order: 2; }
      .vb-pills { flex: 1; flex-direction: row; max-height: none; padding: 2px 0; overflow-x: auto; overflow-y: hidden; }
      .vchip.vpill { height: 28px; }
      .vpill b { flex: none; max-width: 160px; }
      .vchip.vpill .test-ctl { width: auto; gap: 8px; }
      .vchip.vpill .test-ctl input[type=range] { flex: none; width: 64px; }
      .vchip.vpill button.val { min-width: 0; }
      .vchip.vpill .test-ctl select { width: auto; }
      .vpill .live-reset-slot { display: none; }
    }
`,er=T`
    /* The inspector: the head in a card of its own, then one card per
       section of the thing selected, each standing on the page ground. */
    /* The column is a flex column so the body can take what is left. It has
       no card of its own and no side padding: the cards are its edges. */
    .column.inspector { padding: 0; container: insp / inline-size; display: flex; flex-direction: column; }
    .column.inspector.card { background: none; box-shadow: none; border-radius: 0; }
    .column.inspector > .insp-body { flex: 1 0 auto; }
    /* The head: the breadcrumb, the kind and the name, and one quiet button,
       in a card with a grey edge. It sticks to the top of the column, and its
       outline in the page color covers the gap under it, so the cards scroll
       away under a clean edge. */
    .insp-head {
      display: flex; align-items: center; gap: 8px; min-height: 36px; margin: 0; padding: 4px 6px 4px 10px;
      position: sticky; top: 0; z-index: 5; font-size: 13px;
      background: var(--wa-card); border: 1px solid var(--wa-frame); border-radius: var(--wa-lc-r);
      outline: 6px solid var(--wa-bg);
    }
    /* The breadcrumb stays one line: the complication's name gives way first,
       then the layer's name, and the kind chip never does. */
    .crumbs { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--wa-muted); white-space: nowrap; }
    .crumbs button { font: inherit; font-size: 13px; font-weight: 400; background: transparent; border: 0; padding: 3px 4px; margin: 0 -2px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; min-width: 0; flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .crumbs .sep { opacity: .6; flex: none; }
    .crumbs .nm { min-width: 0; flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis; font-weight: 600; color: var(--wa-ink); }
    /* The kind as a neutral pill, the same one that names it over the face. */
    .crumbs .kchip {
      flex: none; display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 6px;
      font-size: 11px; font-weight: 600; letter-spacing: 0; text-transform: none;
      background: var(--wa-field); color: var(--wa-soft); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
    }
    .insp-head .expand {
      flex: none; margin-left: auto; font: inherit; font-size: 13px; font-weight: 400; color: var(--wa-muted); cursor: pointer;
      background: transparent; border: 0; padding: 0 6px; min-height: 24px; border-radius: 6px;
    }
    .insp-head .expand:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .insp-body { padding: 0 0 12px; }
`,tr=T`
    /* One card per subject, each wearing its section's hue in three places
       only: the lit outline, the filled chip behind the title glyph, and the
       changed dot. The fill is the plain card and everything in the body is
       neutral: the body sets --c back to the neutral accent, and keeps the
       hue under --wa-sec for the changed dots beside its rows. A 36px header,
       then a body of label-left rows. The header's hover runs to the box's
       edges while the rows keep the box's padding. */
    .sec {
      --c: var(--wa-accent); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
      --wa-sec: var(--c);
      margin: 6px 0 0; padding: 0 10px; border-radius: var(--wa-lc-r); overflow: hidden;
      ${Mi}
      box-shadow: none;
    }
    .sec-b { --c: var(--wa-accent); }
    /* A card lit for a moment: where the panel has just sent the eye. */
    .sec.lit { animation: wa-sec-lit 1.6s ease-out 2; }
    @keyframes wa-sec-lit {
      0%, 100% { box-shadow: 0 0 0 0 transparent; }
      30% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 35%, transparent); }
    }
    @media (prefers-reduced-motion: reduce) { .sec.lit { animation: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--c) 45%, transparent); } }
    .sec-h {
      display: flex; align-items: center; gap: 8px; height: 36px; margin: 0 -10px; padding: 0 6px 0 10px;
      cursor: pointer; user-select: none; transition: background-color .12s ease-out;
    }
    .sec-h:hover { background: color-mix(in srgb, var(--wa-ink) 4%, transparent); }
    .sec-h.pinned { cursor: default; }
    .sec-h.pinned:hover { background: transparent; }
    .sec-h:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
    :is(.sec-h, .xfer-callout) .swatch {
      width: 18px; height: 18px; border-radius: 5px; border: 0; flex: none; display: grid; place-items: center;
      background: var(--c); color: var(--wa-chip-ink);
    }
    :is(.sec-h, .xfer-callout) .swatch svg { width: 11px; height: 11px; stroke-width: 2.6; }
    /* Title and summary on one line: the summary is what the card says while
       it is shut, so it belongs beside the title, not under it. The title is
       set in small capitals. */
    .sec-h .tt { display: flex; flex-direction: row; align-items: center; gap: 8px; min-width: 0; flex: 1; }
    .sec-h h4 {
      margin: 0; flex: none; font-size: 12px; font-weight: 500; letter-spacing: .09em; text-transform: uppercase;
      display: flex; align-items: center; gap: 8px; white-space: nowrap;
    }
    .sec-h .sum { margin-left: auto; min-width: 0; color: var(--wa-muted); font-size: 12px; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* An open card shows its rows, so the summary would only repeat them. A
       pinned card is always open and keeps its summary as a subtitle. */
    .sec[data-open="true"] .sec-h:not(.pinned) .sum { display: none; }
    .sec-h .chev { color: var(--wa-muted); opacity: .6; flex: none; transition: transform .15s ease-out; }
    .sec-h .chev svg { width: 14px; height: 14px; }
    .sec[data-open="true"] .sec-h .chev { transform: rotate(180deg); }
    .sec-b { padding: 0 0 10px; }
    .sec-b > .hint { margin: 2px 0 6px; }
    /* Rows that belong together (a bar's border settings, its scale) sit in a
       hairline box. The box reaches 8px out into the card's padding, so its rows
       keep the same title and control edges as the rows outside it, and a
       changed-setting dot moves in so it stays inside the line. */
    .fgroup {
      margin: 6px -8px; padding: 3px 8px; border-radius: 8px;
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 3%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c, var(--wa-accent)) 20%, transparent);
    }
    /* A group that holds one row has nothing to hold together (a switch that
       is off, a choice set to None), so it draws no box and sits as a plain row. */
    .fgroup:not(:has(> * + *)) { margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; background: none; box-shadow: none; }
    .fgroup > .hint { margin: 2px 0 6px; }
    .fgroup > .hint:last-child { margin-bottom: 4px; }
    .fgroup button.reset-dot { left: -6px; }
    .sec-b > :is(.adders, .chart-numbers, details.sub),
    .src-editor > details.sub { margin-top: 6px; }
    .sec-b > :is(button.small, button.link) { margin: 4px 0; }
    /* Anything in a card that is not a row (help, a note, a strip of buttons)
       starts where the controls start, so the titles keep one clean edge down
       the left. Boxes that hold rows of their own keep the full width, and
       the Advanced editor's rule and case boxes keep their own left edge. */
    :is(.sec-b, .sec-b :is(.fgroup, .grid2, .grid4, .value-editor, .src-editor, .states, .rich-parts, .part-editor))
      > :is(.hint, .rich-note, .rich-confirm, .adders, .chips, .states-foot, .span-parts, button.small, button.link, details.sub):not(.value-pop *) {
      margin-left: var(--wa-col);
    }
    /* A row whose control is a list or a strip of buttons that can wrap: the
       title stays level with the first line. */
    .field.list-field { align-items: start; }
    .field.list-field > span:first-child { padding-top: 6px; }
    .field.list-field > :not(:first-child) { grid-column: 2; }
    .field.list-field > :is(.adders, .chart-numbers, .states-foot) { margin: 0; }
    .row-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
    /* A line to read rather than change, with a title like any other row:
       what a chart reads, how big a tap is, which layers a group holds. */
    .field.readout { align-items: start; }
    .field.readout > span:first-child { padding-top: 6px; }
    .readout-v { min-width: 0; padding: 6px 0 5px; font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
    .field.list-field > .readout-v { padding-bottom: 2px; }
    .readout-v.template-error { color: var(--error-color, #db4437); }
    .readout-v.template-error b { font-weight: 600; }
`,nr=T`
    /* The changed dot beside a card's title wears the card's hue: one of the
       three places it shows. */
    .sec-h h4 button.reset-dot { position: relative; left: auto; top: auto; width: 7px; height: 7px; background: var(--c); }
    /* The changed mark sectionCard() draws in a title: the reset dot's look,
       for a card that has no reset to offer. */
    .sec-h h4 .sec-dot { display: block; width: 7px; height: 7px; border-radius: 50%; background: var(--c); flex: none; }
    /* A layer's name: one header row with the input in place of the summary,
       in a plain card with a grey edge rather than a lit one, since a name
       is not a section. The title never wraps and the input takes what
       width is left, down to nothing, so the row stays one line in the
       narrowest column. */
    .sec.name-sec { background: var(--wa-card); border: 1px solid var(--wa-line); }
    .name-sec .sec-h { gap: 10px; height: 42px; }
    .name-sec .sec-h .swatch { display: none; }
    .name-sec .sec-h input[type=text] {
      flex: 1 1 auto; width: 0; min-width: 0; height: 28px; min-height: 28px; padding: 0 10px; font-size: 13px;
      border-radius: 6px; border-color: var(--wa-line-strong); background-color: var(--wa-field);
    }
    .name-sec .sec-h input[type=text]:focus-visible { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    /* An empty name shows the automatic title, which is the layer's real name
       until one is typed, so it reads as a name and not as a grey hint. */
    .name-sec .sec-h input[type=text]::placeholder { color: var(--wa-ink); opacity: 1; }
    /* Each card's "?": quiet until the header is hovered, lit while its help
       is showing. A touch screen has no hover, so there it always shows. */
    button.sec-help {
      flex: none; width: 20px; height: 20px; padding: 0; border-radius: 50%; cursor: pointer;
      font: inherit; font-size: 11px; font-weight: 700; line-height: 1; display: grid; place-items: center;
      border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-muted);
      opacity: 0; transition: opacity .12s ease-out, color .12s ease-out, border-color .12s ease-out;
    }
    .sec-h:hover button.sec-help, button.sec-help:focus-visible, button.sec-help.on { opacity: 1; }
    button.sec-help:hover { color: var(--wa-ink); border-color: var(--wa-muted); }
    button.sec-help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.sec-help.on { color: var(--wa-ink); background: var(--wa-raise); border-color: transparent; }
    @media (hover: none) { button.sec-help { opacity: 1; } }
    /* A card's ··· menu, for its rare actions. The card clips its corners,
       so it lets the menu out while the menu is open. */
    .sec.menu-open { overflow: visible; }
    .sec-menu { position: relative; flex: none; display: inline-flex; }
    button.sec-more {
      height: 20px; padding: 0 5px; border-radius: 6px; cursor: pointer;
      font: inherit; font-size: 12px; font-weight: 700; line-height: 1; letter-spacing: .04em;
      border: 1px solid transparent; background: transparent; color: var(--wa-muted);
    }
    button.sec-more:hover, button.sec-more.on { color: var(--wa-ink); border-color: var(--wa-line-strong); }
    button.sec-more:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .sec-menu .pop-menu { min-width: 160px; cursor: default; }
    .sec-menu .pop-menu .row:disabled { opacity: .45; cursor: default; background: transparent; }
    /* Help text waits behind that "?". A plain hint shows only while its
       card's help is on; a warning, an error, or a hint marked keep (a status,
       an empty state, a step that is required) always shows. A value popover
       keeps its hints, since it has no "?" of its own to ask with. */
    .sec[data-help="off"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) { display: none; }
    /* Shown help is quiet text, not a box: italic and muted, so a card with a
       sentence under every row still reads as one form (Jesse, 2026-09-16). */
    .sec[data-help="on"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) {
      padding: 0 2px; font-style: italic; color: var(--wa-muted);
    }
    /* An open card with no help text in it has nothing for its "?" to show. */
    .sec[data-open="true"][data-help="off"]:not(:has(> .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint))) button.sec-help { display: none; }
    /* Inspector: header Add, a card's less used rows, paired rows, how-to card, footer. */
    /* A shut card's Add, such as Rules': it makes something, so it wears the
       green lit outline every Add button does. */
    .sec-h button.sec-act {
      --c: var(--wa-hue-green); --lo-fill: var(--wa-card); --lo-mid: var(--wa-go-mid);
      flex: none; min-height: 22px; padding: 0 8px 0 6px; font-size: 12px; gap: 3px; border-radius: 6px;
      ${Ue}
    }
    .sec-h button.sec-act:hover:not(:disabled) { --lo-fill: var(--wa-hover); ${Ue} }
    .sec-h button.sec-act svg.ui-icon { width: 11px; height: 11px; }
    .more-fold { margin: 6px -10px 0; padding: 0 10px; border-top: 1px solid var(--wa-line); }
    .more-body { padding-top: 6px; }
    .more-body > .hint { margin: 2px 0 6px var(--wa-col); }
    /* The Position card's align buttons: a head line ("Align" at one end,
       what they line up to at the other) over one row of small glyph
       buttons, a thin rule between the across group and the up and down
       one. The buttons share the row evenly, so seven still fit a 328px
       inspector at about 34px each. */
    .align-field { display: flex; flex-direction: column; gap: 6px; padding: 3px 0; min-width: 0; }
    .align-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; font-size: 12px; color: var(--wa-label, var(--wa-muted)); }
    .align-head .align-to { color: var(--wa-muted); }
    .align-head .align-to { white-space: nowrap; }
    .align-row { display: flex; align-items: stretch; gap: 4px; min-width: 0; margin-left: var(--wa-col); }
    .align-row button.align {
      flex: 0 1 34px; min-width: 0; height: 28px; padding: 0; border: 1px solid var(--wa-line-strong); border-radius: 6px; cursor: pointer;
      display: grid; place-items: center; background: var(--wa-field); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out;
    }
    .align-row button.align:hover:not(:disabled) { background: var(--wa-hover); border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .align-row button.align:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .align-row button.align svg.ui-icon { width: 17px; height: 17px; }
    .align-row .align-sep { flex: none; width: 1px; margin: 4px 5px; background: var(--wa-line-strong); }
`,ff={topBar:Ii,picker:Ri,helpButton:Pi,columns:Ni,card:Di,rows:zi,rowsTail:$i,leftCards:Oi,leftCardsTail:Vi,groundCap:Bi,richRows:Gi,canvasColumn:Wi,popMenu:Ui,tintDot:ji,sharedValueRows:Ki,canvasHead:Ji,canvasHeadTail:qi,stage:Xi,stageTools:Yi,stageToolsTail:Zi,valuesFoot:Qi,inspectorHead:er,sectionCard:tr,sectionCardTail:nr},mf=T`${Ii}${Ri}${Pi}`,gf=T`${Ni}${Di}`,yf=T`${Oi}${Vi}${Ui}`,xf=T`${zi}${$i}${Bi}${Gi}${Ki}`,bf=T`${Wi}${ji}${Ji}${qi}${Xi}${Yi}${Zi}${Qi}${md}`,wf=T`${er}${tr}${nr}`;function vf(e,t){let{open:n,onToggle:o}=e;return Q`<section class="sec" data-sec=${e.id??se} data-open=${n?"true":"false"} data-help="on" style=${`--c:${e.color}`}>
    <div class="sec-h" role="button" tabindex="0" aria-expanded=${n?"true":"false"} @click=${o}
      @keydown=${i=>{i.target===i.currentTarget&&(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),o())}}>
      <span class="swatch">${e.icon}</span>
      <span class="tt"><h4>${e.title}${e.tag??se}${e.dot?Q`<span class="sec-dot" aria-hidden="true"></span>`:se}</h4>${e.summary?Q`<span class="sum">${e.summary}</span>`:se}</span>
      <span class="chev">${_i("chevron")}</span>
    </div>
    ${n?Q`<div class="sec-b">${e.help?Q`<p class="hint">${e.help}</p>`:se}${t}</div>`:se}
  </section>`}export{gd as a,Ln as b,vd as c,kt as d,Ud as e,sr as f,lr as g,jd as h,Kd as i,Jd as j,qd as k,Xd as l,Yd as m,Zd as n,Qd as o,zt as p,H as q,$e as r,_ as s,nc as t,oc as u,$t as v,ur as w,Oe as x,pr as y,rt as z,At as A,ye as B,Pe as C,co as D,Ot as E,Vt as F,vr as G,kr as H,uo as I,po as J,Bt as K,Ht as L,Lt as M,_t as N,ic as O,Tr as P,Ar as Q,Wt as R,Ut as S,Er as T,Fr as U,rc as V,ac as W,ho as X,Hr as Y,sc as Z,Lr as _,lc as $,Pr as aa,Nr as ba,dc as ca,cc as da,zr as ea,jt as fa,Kt as ga,Jt as ha,uc as ia,pc as ja,hc as ka,Br as la,Gr as ma,fc as na,Wr as oa,Ur as pa,Ze as qa,jr as ra,Kr as sa,qr as ta,Xr as ua,fo as va,Zr as wa,Dn as xa,mo as ya,mc as za,Qr as Aa,zn as Ba,ea as Ca,gc as Da,go as Ea,yo as Fa,xo as Ga,yc as Ha,ta as Ia,xc as Ja,bc as Ka,wc as La,Xt as Ma,at as Na,st as Oa,aa as Pa,sa as Qa,lt as Ra,dt as Sa,la as Ta,da as Ua,vc as Va,kc as Wa,Cc as Xa,bo as Ya,wo as Za,Mt as _a,Sc as $a,ga as ab,Vn as bb,Tc as cb,Ac as db,xe as eb,be as fb,ya as gb,G as hb,Ec as ib,xa as jb,Fc as kb,Hc as lb,Lc as mb,ba as nb,wa as ob,va as pb,_c as qb,Mc as rb,ka as sb,Ca as tb,Sa as ub,Ta as vb,Aa as wb,Ea as xb,Ic as yb,Fa as zb,Ha as Ab,ct as Bb,La as Cb,Rc as Db,Pc as Eb,Nc as Fb,Dc as Gb,we as Hb,zc as Ib,ut as Jb,X as Kb,Y as Lb,Ao as Mb,Na as Nb,Da as Ob,za as Pb,Eo as Qb,$c as Rb,Fo as Sb,pt as Tb,Oc as Ub,$a as Vb,Oa as Wb,Ba as Xb,Bn as Yb,Gn as Zb,Vc as _b,Wa as $b,ja as ac,Bc as bc,Gc as cc,_o as dc,Wc as ec,Uc as fc,Ja as gc,Mo as hc,jc as ic,Kc as jc,qa as kc,Xa as lc,Ya as mc,Za as nc,Jc as oc,Qa as pc,es as qc,an as rc,ts as sc,ns as tc,sn as uc,ln as vc,os as wc,is as xc,qc as yc,Ro as zc,Xc as Ac,Yc as Bc,Se as Cc,dn as Dc,No as Ec,Zc as Fc,Qc as Gc,eu as Hc,as as Ic,tu as Jc,nu as Kc,ou as Lc,iu as Mc,ls as Nc,ru as Oc,au as Pc,cs as Qc,su as Rc,lu as Sc,du as Tc,cu as Uc,uu as Vc,pu as Wc,hu as Xc,fu as Yc,mu as Zc,us as _c,Oo as $c,gu as ad,yu as bd,Vo as cd,ft as dd,Wn as ed,he as fd,mt as gd,Bo as hd,Go as id,xu as jd,bu as kd,bs as ld,wu as md,vu as nd,ku as od,Cu as pd,Su as qd,Tu as rd,Au as sd,ws as td,Eu as ud,Fu as vd,Hu as wd,Lu as xd,_u as yd,J as zd,ve as Ad,Mu as Bd,Ns as Cd,qo as Dd,Iu as Ed,ke as Fd,zs as Gd,Ru as Hd,Pu as Id,Nu as Jd,Qe as Kd,Os as Ld,ti as Md,ni as Nd,Gs as Od,Ws as Pd,Us as Qd,Du as Rd,Js as Sd,Xs as Td,Ys as Ud,Zs as Vd,Qs as Wd,tl as Xd,zu as Yd,$u as Zd,Ou as _d,E as $d,Vu as ae,Bu as be,Gu as ce,Wu as de,P as ee,yn as fe,V as ge,Uu as he,xn as ie,yl as je,ju as ke,di as le,Z as me,Ku as ne,Ju as oe,qu as pe,B as qe,ui as re,bl as se,wl as te,Xu as ue,Yu as ve,Zu as we,Qu as xe,ep as ye,M as ze,gt as Ae,tp as Be,np as Ce,op as De,kl as Ee,hi as Fe,ip as Ge,Tl as He,Al as Ie,rp as Je,N as Ke,S as Le,fi as Me,El as Ne,mi as Oe,Fl as Pe,ap as Qe,Hl as Re,Ll as Se,_l as Te,sp as Ue,lp as Ve,fe as We,R as Xe,Ml as Ye,dp as Ze,Fe as _e,cp as $e,Il as af,q as bf,up as cf,pp as df,yi as ef,hp as ff,ot as gf,wn as hf,fp as if,bi as jf,mp as kf,Bl as lf,gp as mf,io as nf,Ul as of,vn as pf,yp as qf,re as rf,xp as sf,Jl as tf,bp as uf,wp as vf,Xl as wf,vp as xf,Yl as yf,kp as zf,Cp as Af,Sp as Bf,Tp as Cf,Ap as Df,ki as Ef,Zl as Ff,Ql as Gf,ed as Hf,td as If,Ep as Jf,Fp as Kf,Hp as Lf,xt as Mf,od as Nf,Mp as Of,ad as Pf,kn as Qf,Ip as Rf,dd as Sf,Rp as Tf,Pp as Uf,cd as Vf,ud as Wf,Np as Xf,Op as Yf,Vp as Zf,Bp as _f,Gp as $f,Wp as ag,Up as bg,jp as cg,Kp as dg,Jp as eg,qp as fg,Xp as gg,Yp as hg,Zp as ig,Qp as jg,eh as kg,th as lg,nh as mg,oh as ng,ih as og,rh as pg,ah as qg,sh as rg,lh as sg,dh as tg,ch as ug,uh as vg,ph as wg,hh as xg,fh as yg,mh as zg,gh as Ag,yh as Bg,xh as Cg,bh as Dg,wh as Eg,vh as Fg,kh as Gg,Ch as Hg,Sh as Ig,Th as Jg,Ah as Kg,Eh as Lg,Fh as Mg,Hh as Ng,Lh as Og,_h as Pg,Mh as Qg,Ih as Rg,Rh as Sg,Ph as Tg,Nh as Ug,Dh as Vg,zh as Wg,$h as Xg,Oh as Yg,Vh as Zg,Bh as _g,Gh as $g,Wh as ah,Uh as bh,jh as ch,Kh as dh,Jh as eh,qh as fh,Xh as gh,Yh as hh,Zh as ih,Qh as jh,tf as kh,nf as lh,of as mh,rf as nh,_i as oh,Mi as ph,Ue as qh,pf as rh,hf as sh,ff as th,mf as uh,gf as vh,yf as wh,xf as xh,bf as yh,wf as zh,vf as Ah};
