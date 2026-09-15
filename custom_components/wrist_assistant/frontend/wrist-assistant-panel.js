var Sy=Object.defineProperty;var Ty=Object.getOwnPropertyDescriptor;var A=(e,n,t,i)=>{for(var a=i>1?void 0:i?Ty(n,t):n,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(n,t,a):o(a))||a);return i&&a&&Sy(n,t,a),a};var Hr=globalThis,Ar=Hr.ShadowRoot&&(Hr.ShadyCSS===void 0||Hr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ws=Symbol(),lu=new WeakMap,ca=class{constructor(n,t,i){if(this._$cssResult$=!0,i!==Ws)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=t}get styleSheet(){let n=this.o,t=this.t;if(Ar&&n===void 0){let i=t!==void 0&&t.length===1;i&&(n=lu.get(t)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&lu.set(t,n))}return n}toString(){return this.cssText}},De=e=>new ca(typeof e=="string"?e:e+"",void 0,Ws),Ks=(e,...n)=>{let t=e.length===1?e[0]:n.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new ca(t,e,Ws)},du=(e,n)=>{if(Ar)e.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of n){let i=document.createElement("style"),a=Hr.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=t.cssText,e.appendChild(i)}},js=Ar?e=>e:e=>e instanceof CSSStyleSheet?(n=>{let t="";for(let i of n.cssRules)t+=i.cssText;return De(t)})(e):e;var{is:Ey,defineProperty:Fy,getOwnPropertyDescriptor:My,getOwnPropertyNames:Ry,getOwnPropertySymbols:Hy,getPrototypeOf:Ay}=Object,Lr=globalThis,cu=Lr.trustedTypes,Ly=cu?cu.emptyScript:"",Iy=Lr.reactiveElementPolyfillSupport,ua=(e,n)=>e,pa={toAttribute(e,n){switch(n){case Boolean:e=e?Ly:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,n){let t=e;switch(n){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},Ir=(e,n)=>!Ey(e,n),uu={attribute:!0,type:String,converter:pa,reflect:!1,useDefault:!1,hasChanged:Ir};Symbol.metadata??=Symbol("metadata"),Lr.litPropertyMetadata??=new WeakMap;var jt=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,t=uu){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(n,t),!t.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(n,i,t);a!==void 0&&Fy(this.prototype,n,a)}}static getPropertyDescriptor(n,t,i){let{get:a,set:r}=My(this.prototype,n)??{get(){return this[t]},set(o){this[t]=o}};return{get:a,set(o){let s=a?.call(this);r?.call(this,o),this.requestUpdate(n,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??uu}static _$Ei(){if(this.hasOwnProperty(ua("elementProperties")))return;let n=Ay(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(ua("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ua("properties"))){let t=this.properties,i=[...Ry(t),...Hy(t)];for(let a of i)this.createProperty(a,t[a])}let n=this[Symbol.metadata];if(n!==null){let t=litPropertyMetadata.get(n);if(t!==void 0)for(let[i,a]of t)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let a=this._$Eu(t,i);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let t=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let a of i)t.unshift(js(a))}else n!==void 0&&t.push(js(n));return t}static _$Eu(n,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return du(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,t,i){this._$AK(n,i)}_$ET(n,t){let i=this.constructor.elementProperties.get(n),a=this.constructor._$Eu(n,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:pa).toAttribute(t,i.type);this._$Em=n,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(n,t){let i=this.constructor,a=i._$Eh.get(n);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:pa;this._$Em=a;let s=o.fromAttribute(t,r.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(n,t,i,a=!1,r){if(n!==void 0){let o=this.constructor;if(a===!1&&(r=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??Ir)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,t,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??t??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(t=void 0),this._$AL.set(n,t)),a===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,s=this[a];o!==!0||this._$AL.has(a)||s===void 0||this.C(a,void 0,r,s)}}let n=!1,t=this._$AL;try{n=this.shouldUpdate(t),n?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(t)}willUpdate(n){}_$AE(n){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(n){}firstUpdated(n){}};jt.elementStyles=[],jt.shadowRootOptions={mode:"open"},jt[ua("elementProperties")]=new Map,jt[ua("finalized")]=new Map,Iy?.({ReactiveElement:jt}),(Lr.reactiveElementVersions??=[]).push("2.1.2");var Ys=globalThis,pu=e=>e,_r=Ys.trustedTypes,hu=_r?_r.createPolicy("lit-html",{createHTML:e=>e}):void 0,Xs="$lit$",qt=`lit$${Math.random().toFixed(9).slice(2)}$`,Js="?"+qt,_y=`<${Js}>`,jn=document,fa=()=>jn.createComment(""),ma=e=>e===null||typeof e!="object"&&typeof e!="function",Zs=Array.isArray,xu=e=>Zs(e)||typeof e?.[Symbol.iterator]=="function",qs=`[ 	
\f\r]`,ha=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fu=/-->/g,mu=/>/g,Wn=RegExp(`>|${qs}(?:([^\\s"'>=/]+)(${qs}*=${qs}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),gu=/'/g,yu=/"/g,wu=/^(?:script|style|textarea|title)$/i,Qs=e=>(n,...t)=>({_$litType$:e,strings:n,values:t}),h=Qs(1),w=Qs(2),D1=Qs(3),Yt=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),bu=new WeakMap,Kn=jn.createTreeWalker(jn,129);function vu(e,n){if(!Zs(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return hu!==void 0?hu.createHTML(n):n}var ku=(e,n)=>{let t=e.length-1,i=[],a,r=n===2?"<svg>":n===3?"<math>":"",o=ha;for(let s=0;s<t;s++){let l=e[s],d,c,u=-1,p=0;for(;p<l.length&&(o.lastIndex=p,c=o.exec(l),c!==null);)p=o.lastIndex,o===ha?c[1]==="!--"?o=fu:c[1]!==void 0?o=mu:c[2]!==void 0?(wu.test(c[2])&&(a=RegExp("</"+c[2],"g")),o=Wn):c[3]!==void 0&&(o=Wn):o===Wn?c[0]===">"?(o=a??ha,u=-1):c[1]===void 0?u=-2:(u=o.lastIndex-c[2].length,d=c[1],o=c[3]===void 0?Wn:c[3]==='"'?yu:gu):o===yu||o===gu?o=Wn:o===fu||o===mu?o=ha:(o=Wn,a=void 0);let f=o===Wn&&e[s+1].startsWith("/>")?" ":"";r+=o===ha?l+_y:u>=0?(i.push(d),l.slice(0,u)+Xs+l.slice(u)+qt+f):l+qt+(u===-2?s:f)}return[vu(e,r+(e[t]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},ga=class e{constructor({strings:n,_$litType$:t},i){let a;this.parts=[];let r=0,o=0,s=n.length-1,l=this.parts,[d,c]=ku(n,t);if(this.el=e.createElement(d,i),Kn.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(a=Kn.nextNode())!==null&&l.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(let u of a.getAttributeNames())if(u.endsWith(Xs)){let p=c[o++],f=a.getAttribute(u).split(qt),g=/([.?@])?(.*)/.exec(p);l.push({type:1,index:r,name:g[2],strings:f,ctor:g[1]==="."?Dr:g[1]==="?"?Pr:g[1]==="@"?zr:Yn}),a.removeAttribute(u)}else u.startsWith(qt)&&(l.push({type:6,index:r}),a.removeAttribute(u));if(wu.test(a.tagName)){let u=a.textContent.split(qt),p=u.length-1;if(p>0){a.textContent=_r?_r.emptyScript:"";for(let f=0;f<p;f++)a.append(u[f],fa()),Kn.nextNode(),l.push({type:2,index:++r});a.append(u[p],fa())}}}else if(a.nodeType===8)if(a.data===Js)l.push({type:2,index:r});else{let u=-1;for(;(u=a.data.indexOf(qt,u+1))!==-1;)l.push({type:7,index:r}),u+=qt.length-1}r++}}static createElement(n,t){let i=jn.createElement("template");return i.innerHTML=n,i}};function qn(e,n,t=e,i){if(n===Yt)return n;let a=i!==void 0?t._$Co?.[i]:t._$Cl,r=ma(n)?void 0:n._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,t,i)),i!==void 0?(t._$Co??=[])[i]=a:t._$Cl=a),a!==void 0&&(n=qn(e,a._$AS(e,n.values),a,i)),n}var Nr=class{constructor(n,t){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:t},parts:i}=this._$AD,a=(n?.creationScope??jn).importNode(t,!0);Kn.currentNode=a;let r=Kn.nextNode(),o=0,s=0,l=i[0];for(;l!==void 0;){if(o===l.index){let d;l.type===2?d=new Ii(r,r.nextSibling,this,n):l.type===1?d=new l.ctor(r,l.name,l.strings,this,n):l.type===6&&(d=new Or(r,this,n)),this._$AV.push(d),l=i[++s]}o!==l?.index&&(r=Kn.nextNode(),o++)}return Kn.currentNode=jn,a}p(n){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,t),t+=i.strings.length-2):i._$AI(n[t])),t++}},Ii=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,t,i,a){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=n,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,t=this._$AM;return t!==void 0&&n?.nodeType===11&&(n=t.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,t=this){n=qn(this,n,t),ma(n)?n===m||n==null||n===""?(this._$AH!==m&&this._$AR(),this._$AH=m):n!==this._$AH&&n!==Yt&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):xu(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==m&&ma(this._$AH)?this._$AA.nextSibling.data=n:this.T(jn.createTextNode(n)),this._$AH=n}$(n){let{values:t,_$litType$:i}=n,a=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=ga.createElement(vu(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{let r=new Nr(a,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(n){let t=bu.get(n.strings);return t===void 0&&bu.set(n.strings,t=new ga(n)),t}k(n){Zs(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,a=0;for(let r of n)a===t.length?t.push(i=new e(this.O(fa()),this.O(fa()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(n=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);n!==this._$AB;){let i=pu(n).nextSibling;pu(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},Yn=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,t,i,a,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=n,this.name=t,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=m}_$AI(n,t=this,i,a){let r=this.strings,o=!1;if(r===void 0)n=qn(this,n,t,0),o=!ma(n)||n!==this._$AH&&n!==Yt,o&&(this._$AH=n);else{let s=n,l,d;for(n=r[0],l=0;l<r.length-1;l++)d=qn(this,s[i+l],t,l),d===Yt&&(d=this._$AH[l]),o||=!ma(d)||d!==this._$AH[l],d===m?n=m:n!==m&&(n+=(d??"")+r[l+1]),this._$AH[l]=d}o&&!a&&this.j(n)}j(n){n===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Dr=class extends Yn{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===m?void 0:n}},Pr=class extends Yn{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==m)}},zr=class extends Yn{constructor(n,t,i,a,r){super(n,t,i,a,r),this.type=5}_$AI(n,t=this){if((n=qn(this,n,t,0)??m)===Yt)return;let i=this._$AH,a=n===m&&i!==m||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,r=n!==m&&(i===m||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Or=class{constructor(n,t,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){qn(this,n)}},$u={M:Xs,P:qt,A:Js,C:1,L:ku,R:Nr,D:xu,V:qn,I:Ii,H:Yn,N:Pr,U:zr,B:Dr,F:Or},Ny=Ys.litHtmlPolyfillSupport;Ny?.(ga,Ii),(Ys.litHtmlVersions??=[]).push("3.3.3");var Gr=(e,n,t)=>{let i=t?.renderBefore??n,a=i._$litPart$;if(a===void 0){let r=t?.renderBefore??null;i._$litPart$=a=new Ii(n.insertBefore(fa(),r),r,void 0,t??{})}return a._$AI(e),a};var el=globalThis,gn=class extends jt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Gr(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Yt}};gn._$litElement$=!0,gn.finalized=!0,el.litElementHydrateSupport?.({LitElement:gn});var Dy=el.litElementPolyfillSupport;Dy?.({LitElement:gn});(el.litElementVersions??=[]).push("4.2.2");var Py={attribute:!0,type:String,converter:pa,reflect:!1,hasChanged:Ir},zy=(e=Py,n,t)=>{let{kind:i,metadata:a}=t,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(t.name,e),i==="accessor"){let{name:o}=t;return{set(s){let l=n.get.call(this);n.set.call(this,s),this.requestUpdate(o,l,e,!0,s)},init(s){return s!==void 0&&this.C(o,void 0,e,s),s}}}if(i==="setter"){let{name:o}=t;return function(s){let l=this[o];n.call(this,s),this.requestUpdate(o,l,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function _i(e){return(n,t)=>typeof t=="object"?zy(e,n,t):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,n,t)}function L(e){return _i({...e,state:!0,attribute:!1})}var dl=["rectangular","circular","corner"],$n=["small","medium","large","xlarge"],de=[...dl,...$n];function rl(e){return de.includes(e)}var ce={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34},small:{width:162.67,height:162.67},medium:{width:344.67,height:162.67},large:{width:344.67,height:360},xlarge:{width:344.67,height:557.33}},ba=["rectangular","circular","corner","inline",...$n];var cl=64;function zu(e,n){let t=new Set(e);for(let i of n)t.add(i.slot);for(let i=0;i<cl;i++)if(!t.has(i))return i;return-1}function Ou(e,n){let t=new Set(e);return n.filter(i=>i.kind!=="preset"||!t.has(i.slot))}function ni(e){return $n.some(t=>e.supportedFamilies.includes(t))?7:dl.some(t=>!e.supportedFamilies.includes(t))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}function ul(e){return e==="standard"||e==="condensed"||e==="compressed"||e==="expanded"?e:void 0}var pl=4,pt=.5;function Sa(e){return Number.isFinite(e)?Math.min(1,Math.max(pt,e)):pt}var Oy=["none","dot","triangle"],Gy=["straight","smooth","step"],By=["light","medium","strong"],Vy={light:.05,medium:.1,strong:.2};function Cu(e){return typeof e=="string"&&Gy.includes(e)?e:"straight"}var Uy=["flat","fade"],Wy=["none","all","auto"],Gu=4,Zt="#FFFFFF33";function wn(e){return typeof e=="string"&&Uy.includes(e)?e:"flat"}function ol(e){return typeof e=="string"&&Wy.includes(e)?e:"none"}function sl(e){return typeof e!="number"||!Number.isFinite(e)?0:Math.max(0,Math.min(Gu,Math.round(e)))}function Di(e,n){return e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function yn(e){return typeof e=="string"&&e!==""?e:Zt}var Ky=1,jy=12;function Ft(e){if(!(typeof e!="number"||!Number.isFinite(e)))return Math.max(Ky,Math.min(jy,e))}function qr(e){return e==="all"?"all":"auto"}var Cn=1,Sn=3,Yr=.25,Xr=4;function ii(e){return typeof e!="number"||!Number.isFinite(e)?Sn:Math.max(1,Math.min(Gu,Math.round(e)))}function ai(e){return typeof e!="number"||!Number.isFinite(e)?Cn:Math.max(Yr,Math.min(Xr,e))}var qy=["all","top"],Pi=1.2;function vn(e){return typeof e!="number"||!Number.isFinite(e)?Pi:Math.max(0,e)}function kn(e){return typeof e=="string"&&qy.includes(e)?e:"all"}function xt(e){if(typeof e=="string")return By.includes(e)?e:void 0;if(e===3||e===5)return"light";if(e===7)return"medium";if(e===9)return"strong"}function Bu(e,n){if(n===void 0||e<2)return 0;let t=Math.max(3,Math.floor(e*Vy[n]+.5));return t%2===0?t+1:t}var Yy=[["history","Recorded history"],["statistics","Long-term statistics"]],Jr=[["5minute","5 min"],["hour","Hour"],["day","Day"],["week","Week"],["month","Month"]],hl=[["mean","Mean"],["min","Min"],["max","Max"],["change","Change"],["sum","Total"]],fl="history",Ta="hour",Ea="mean",Rt=[["latest","Newest reading"],["first","First reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["delta","Change"],["sum","Total"],["trend","Trend arrow"],["top","Top of the scale"],["bottom","Bottom of the scale"]],Fa={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},Ht=[["highest","Highest reading"],["lowest","Lowest reading"],["now","Now"],["first","First reading"],["latest","Newest reading"],["threshold","Threshold"],["zero","Zero"]];function Qt(e){return e!=="threshold"&&e!=="zero"}var Zr=[["above","Above"],["on","On"],["below","Inside"],["bottom","At the bottom"],["through","Through"]];function Xy(e){return Ht.some(([n])=>n===e)}function Jy(e){return Zr.some(([n])=>n===e)}function Zy(e){if(!V(e)||typeof e.layer!="string"||e.layer==="")return;let n={layer:e.layer.toUpperCase(),at:Xy(e.at)?e.at:"highest",place:Jy(e.place)?e.place:"above"},t=Z(e.dx,0),i=Z(e.dy,0);return t!==0&&(n.dx=t),i!==0&&(n.dy=i),n}function Vr(e,n){let t=Zy(e.chartAnchor);t!==void 0&&(n.chartAnchor=t)}function Ur(e,n){e.chartAnchor!==void 0&&(n.chartAnchor=Qy(e.chartAnchor))}function Qy(e){let n={layer:e.layer,at:e.at,place:e.place};return e.dx!==void 0&&e.dx!==0&&(n.dx=q(e.dx)),e.dy!==void 0&&e.dy!==0&&(n.dy=q(e.dy)),n}var Vu=[["linear","Linear"],["radial","Radial"]],ml=2,Qr=4;function xa(e){if(!V(e)||!Array.isArray(e.stops))return;let n=[];for(let a of e.stops){if(n.length===Qr)break;if(!V(a))continue;let r=ge(a.colorHex);r===void 0||r===""||n.push({at:bt(Z(a.at,0)),colorHex:r})}if(n.length<ml)return;let t={kind:e.kind==="radial"?"radial":"linear",stops:n},i=Z(e.angle,0);return t.kind==="linear"&&i!==0&&(t.angle=i),t}function Wr(e){let n={kind:e.kind,stops:e.stops.map(t=>({at:q(t.at),colorHex:t.colorHex}))};return e.kind==="linear"&&e.angle!==void 0&&e.angle!==0&&(n.angle=q(e.angle)),n}function At(e,n){let t=[...e.stops].sort((r,o)=>r.at-o.at),i=t[0],a=t[t.length-1];if(n<=i.at)return i.colorHex;if(n>=a.at)return a.colorHex;for(let r=1;r<t.length;r++){let o=t[r],s=t[r-1];if(n>o.at)continue;let l=o.at-s.at;return eb(s.colorHex,o.colorHex,l<=0?0:(n-s.at)/l)}return a.colorHex}function eb(e,n,t){let i=l=>{let d=l.replace(/^#/,""),c=d.length===6?`${d}FF`:d.padEnd(8,"F");return[0,2,4,6].map(u=>parseInt(c.slice(u,u+2),16)||0)},a=i(e),r=i(n),o=a.map((l,d)=>Math.round(l+(r[d]-l)*t)),s=o.map(l=>Math.max(0,Math.min(255,l)).toString(16).padStart(2,"0").toUpperCase());return o[3]===255?`#${s[0]}${s[1]}${s[2]}`:`#${s.join("")}`}var tb=["circular","rectangular","corner","small","medium","large","xlarge"];function eo(e){return tb.includes(e)}var to=.1,no=3,Ma=.5,gl=10,yl=360,We=120,bl=-2,xl=20;function nb(e){if(!V(e))return;let n=Z(e.radius,NaN);if(!Number.isFinite(n))return;let t={radius:Math.min(no,Math.max(to,n))},i=Z(e.angle,0);i!==0&&(t.angle=i);let a=Ra(Z(e.sweep,We));a!==We&&(t.sweep=a);let r=Ha(Z(e.spacing,0));return r!==0&&(t.spacing=r),e.flip===!0&&(t.flip=!0),t}function Ra(e){if(!Number.isFinite(e)||e===0)return We;let n=Math.min(yl,Math.max(gl,Math.abs(e)));return e<0?-n:n}function Ha(e){return Number.isFinite(e)?Math.min(xl,Math.max(bl,e)):0}function ib(e){let n={radius:q(e.radius)};return e.angle!==void 0&&e.angle!==0&&(n.angle=q(e.angle)),e.sweep!==void 0&&e.sweep!==We&&(n.sweep=q(e.sweep)),e.spacing!==void 0&&e.spacing!==0&&(n.spacing=q(e.spacing)),e.flip===!0&&(n.flip=!0),n}var je={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setFontDesign:"fontDesign",setFontWidth:"fontWidth",setItalic:"italic",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},wl=12,Qn=12,Aa="#000000",zi={colorHex:Aa,radius:3,dx:0,dy:1};function vl(e){return Number.isFinite(e)?Math.min(wl,Math.max(0,e)):0}function va(e){return Number.isFinite(e)?Math.min(Qn,Math.max(-Qn,e)):0}function La(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):1}function Uu(e){return e.countdown===!0?!1:e.coloring==="bands"&&(e.bands?.length??0)>0||e.highlight!==void 0&&e.highlight!=="none"}function vt(e){return e.countdown!==!0&&(e.parts?.length??0)>0}function ri(e){if(e.kind.kind==="literal")return(e.format?.prefix??"")+e.kind.value+(e.format?.suffix??"")}function Ia(e){let n=c=>c.value.kind.kind!=="literal",t=(c,u)=>e.slice(c,u).map(p=>ri(p.value)??"").join(""),i=e.findIndex(n);if(i<0)return U(t(0,e.length));let a=e.findIndex((c,u)=>u>i&&n(c)),r=e[i].value,o={...r.format},s=t(0,i)+(o.prefix??""),l=(o.suffix??"")+t(i+1,a<0?e.length:a);delete o.prefix,delete o.suffix,s!==""&&(o.prefix=s),l!==""&&(o.suffix=l);let d={kind:structuredClone(r.kind)};return Ve(o)||(d.format=o),d}function Wu(e){vt(e)&&(e.value=Ia(e.parts))}var Oi="#FFFFFF",en="#FFFFFF80",tn=3,io=60,ao=8,nn="#FFFFFF",an=8,ro=4,oo=20;function _a(e){if(!Number.isFinite(e))return"";let n=e.toFixed(2);return n.includes(".")&&(n=n.replace(/0+$/,"").replace(/\.$/,"")),n==="-0"?"0":n}function kl(){return{count:0,length:tn,colorHex:en,majorEvery:0}}function $l(){return{show:!1,size:an,colorHex:nn}}function so(e){return e.count===0&&e.length===tn&&Di(e.colorHex,en)&&e.majorEvery===0}function lo(e){return!e.show&&e.size===an&&Di(e.colorHex,nn)}function ab(e){if(!V(e))return;let n={count:Math.max(0,Math.min(io,Math.round(Z(e.count,0)))),length:Math.max(1,Math.min(ao,Z(e.length,tn))),colorHex:Q(e.colorHex,en),majorEvery:Math.max(0,Math.round(Z(e.majorEvery,0)))};return so(n)?void 0:n}function rb(e){let n={};return e.count!==0&&(n.count=Math.round(e.count)),e.length!==tn&&(n.length=q(e.length)),Di(e.colorHex,en)||(n.colorHex=e.colorHex),e.majorEvery!==0&&(n.majorEvery=Math.round(e.majorEvery)),n}function ob(e){if(!V(e))return;let n={show:e.show===!0,size:Math.max(ro,Math.min(oo,Z(e.size,an))),colorHex:Q(e.colorHex,nn)};return lo(n)?void 0:n}function sb(e){let n={};return e.show&&(n.show=!0),e.size!==an&&(n.size=q(e.size)),Di(e.colorHex,nn)||(n.colorHex=e.colorHex),n}function Su(e){return typeof e=="string"&&Oy.includes(e)}function lb(e){return e==="none"?{high:"none",low:"none"}:e==="pointer"?{high:"triangle",low:"dot"}:{high:"dot",low:"dot"}}function ka(e){let n=lb(e.marker);return{high:e.highMarker??n.high,low:e.lowMarker??n.low}}function Ku(e){return e.high==="triangle"?"pointer":e.high!=="none"||e.low!=="none"?"dot":"none"}function ju(e){return e.high==="none"&&e.low==="none"||e.high==="dot"&&e.low==="dot"||e.high==="triangle"&&e.low==="dot"}function db(e,n){e.marker=Ku(n),ju(n)?(delete e.highMarker,delete e.lowMarker):(e.highMarker=n.high,e.lowMarker=n.low)}var co=24,uo=6,$a="#FFFFFF";function Cl(e){if(e.style!=="bars")return 0;let n=e.barBorderWidth;return typeof n!="number"||!Number.isFinite(n)?0:Math.min(Math.max(n,0),uo)}function qu(e,n,t,i,a){if(a!==void 0)return{fill:a,border:a};if(!Na(e))return{fill:e.fillColorHex??i,border:e.barBorderColorHex??$a};let r=t.find(s=>n<=s.upTo),o=r?{color:r.colorHex,fill:r.fillColorHex,border:r.borderColorHex}:{color:e.bandAboveColorHex,fill:e.bandAboveFillColorHex,border:e.bandAboveBorderColorHex};return{fill:o.fill??e.fillColorHex??o.color,border:o.border??e.barBorderColorHex??$a}}var lt="#FF6B35",dt="#32D74B",Sl="#32D74B",be="#FF453A",Tl="#FF453A",El="#FFFFFF99";function Tn(e){return[...e.bands].sort((n,t)=>n.upTo-t.upTo)}function Na(e){return e.coloring==="bands"&&e.bands.length>0}function po(e,n,t){for(let i of n)if(e<=i.upTo)return i.colorHex;return t}function Da(e,n){let t=Math.abs(n),i=t>=10?0:t>=1?1:2;return e.toFixed(i)}function Yu(e){return e>0?"\u2191":e<0?"\u2193":"\u2192"}var oi=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],ho=360,fo=10080,Pa=[...oi,{minutes:43200,label:"Last 30 days"},{minutes:129600,label:"Last 90 days"},{minutes:527040,label:"Last year"}],Fl=366*24*60,mo=2,rn=120,Ml=0;function Rl(e){let n=Math.round(e.historyPoints);return Number.isFinite(n)?n<1?Ml:Math.max(mo,Math.min(rn,n)):24}function si(e){return Al(e)!==void 0?!0:Hl(e)!==void 0&&Rl(e)>0}function Hl(e){if(e.source==="history")return Xu(e)}function Al(e){if(e.source==="statistics")return Xu(e)}function Xu(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Lt(e){let n=Hl(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${Rl(e)}${e.gaps===!0?"|gaps":""}`}function It(e){let n=Al(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${e.statPeriod}|${e.statType}${e.gaps===!0?"|gaps":""}`}function Ju(e){return[...Ll(e).map(t=>t.key),...Il(e).map(t=>t.key)].sort().join(";")}function Ll(e){let n=new Map,t=i=>{n.has(i.key)||n.set(i.key,i)};for(let i of e.elements)if(i.kind==="chart"){let a=Lt(i.payload),r=Hl(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:Math.round(i.payload.historyMinutes),points:Rl(i.payload),mode:"numeric",gaps:i.payload.gaps===!0})}else if(i.kind==="timeline"){let a=Qe(i.payload),r=ip(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:kt(i.payload),points:Rn,mode:"states",gaps:!1})}return[...n.values()]}function Il(e){let n=new Map;for(let t of e.elements){if(t.kind!=="chart")continue;let i=It(t.payload),a=Al(t.payload);i===void 0||a===void 0||n.has(i)||n.set(i,{key:i,entityId:a,minutes:Math.round(t.payload.historyMinutes),period:t.payload.statPeriod,type:t.payload.statType,gaps:t.payload.gaps===!0})}return[...n.values()]}var Zu=[["auto","Auto"],["h12","12 hour"],["h24","24 hour"]],Qu=[["auto","Auto"],["always","Always"],["never","Never"]];function tl(e){return e==="h12"||e==="h24"?e:Jn}function nl(e){return e==="always"||e==="never"?e:Zn}function cb(e){return e.timeLabelCount!==void 0?Mt(e.timeLabelCount):e.timeLabels==="ends"?2:e.timeLabels==="four"?4:Xn}function Mt(e){let n=Number(e);return Number.isFinite(n)?Math.max(0,Math.min(li,Math.round(n))):Xn}function za(e){return e<=0?[]:e===1?[1]:Array.from({length:e},(n,t)=>t/(e-1))}var En="#8E8E93",ep=1,ub="#000000",pb=2,hb=1440,_l=60,Xn=0,ct=9,ut="#8E8E93",Jn="auto",Zn="auto",tp=4,li=12,Fn=1,Mn=20,go=4,Rn=120;function np(e,n,t){let i=e.trim().toLowerCase();for(let a of n)if(a.match.trim().toLowerCase()===i)return a.colorHex;return t}function kt(e){let n=Math.round(e.historyMinutes);return Number.isFinite(n)?Math.max(1,Math.min(fo,n)):_l}function ip(e){return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Qe(e){let n=ip(e);if(n!==void 0)return`${n}|${kt(e)}|${Rn}|states`}var fb={on:"#FF9F0A",off:"#0A84FF",open:"#FF453A",closed:"#32D74B",opening:"#FFD60A",closing:"#FFD60A",home:"#32D74B",not_home:"#0A84FF",locked:"#32D74B",unlocked:"#FF453A",jammed:"#BF5AF2",playing:"#32D74B",paused:"#FF9F0A",idle:"#0A84FF",standby:"#5E5CE6",heat:"#FF9F0A",cool:"#64D2FF",heat_cool:"#BF5AF2",dry:"#FFD60A",fan_only:"#5E5CE6",auto:"#BF5AF2",cleaning:"#32D74B",docked:"#0A84FF",returning:"#64D2FF",error:"#FF453A",disarmed:"#32D74B",armed_home:"#0A84FF",armed_away:"#FF9F0A",armed_night:"#5E5CE6",arming:"#FFD60A",pending:"#FFD60A",triggered:"#FF453A",unavailable:"#48484A",unknown:"#48484A"},Oa={binary_sensor:["on","off"],switch:["on","off"],light:["on","off"],input_boolean:["on","off"],fan:["on","off"],humidifier:["on","off"],siren:["on","off"],cover:["open","closed","opening","closing"],lock:["locked","unlocked","jammed"],person:["home","not_home"],device_tracker:["home","not_home"],media_player:["playing","paused","idle","off"],climate:["heat","cool","heat_cool","dry","fan_only","auto","off"],vacuum:["cleaning","docked","returning","idle","error"],alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","arming","pending","triggered"]};function wt(e){return fb[e.trim().toLowerCase()]??En}var mb=["door","garage_door","window","opening"];function Nl(e,n){let t=(n??"").trim().toLowerCase(),i=e==="binary_sensor"&&mb.includes(t),a=o=>wt(i&&o==="on"?"open":o);return[...Oa[e]??[],"unavailable","unknown"].map(o=>({id:ie(),match:o,colorHex:a(o)}))}var Gi=6,yo=9,gb=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function bo(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function yb(e,n){let t=n<=.5,i=e<=.5;return t?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var Dl={top:0,left:0,bottom:0,right:0};function xo(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var bb=["toggleEntity","runScene","runScript","addTodo","runHTTPAction"];function ap(e){return bb.includes(e)}function rp(e){let n=(e??"").trim();if(n==="")return!0;try{let t=JSON.parse(n);return typeof t=="object"&&t!==null&&!Array.isArray(t)}catch{return!1}}var Pl=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"],["callService","Call a service"]];function on(e){let n=Pl.find(([i])=>i===e.type)?.[1]??e.type;if(e.type==="callService"){let i=[e.serviceDomain,e.serviceName].filter(a=>a!=="").join(".");return i===""?n:`${n}: ${i}`}if(!("entityId"in e))return n;let t=e.displayName||e.entityId;return t?`${n}: ${t}`:n}function V(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Q(e,n=""){return typeof e=="string"?e:n}function Z(e,n){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:n}function bt(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function wa(e){return e==null?void 0:Z(e,0)}function ge(e){return typeof e=="string"?e:void 0}function Ni(e,n,t){return typeof e=="string"&&n.includes(e)?e:t}function il(e,n,t){return n.some(([i])=>i===e)?e:t}var ht=class extends Error{};function bn(e){if(typeof e.entityId!="string")throw new ht("entityId is required");let n={entityId:e.entityId,displayName:Q(e.displayName),domain:Q(e.domain)};return typeof e.iconName=="string"&&(n.iconName=e.iconName),n}function Tu(e){if(!V(e))return;let n={};return e.decimals!==void 0&&e.decimals!==null&&(n.decimals=Z(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(n.multiply=Z(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(n.offset=Z(e.offset,0)),typeof e.prefix=="string"&&(n.prefix=e.prefix),typeof e.suffix=="string"&&(n.suffix=e.suffix),e.useEntityUnit===!0&&(n.useEntityUnit=!0),e.relativeTime===!0&&(n.relativeTime=!0),e.duration===!0&&(n.duration=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(n.textCase=e.textCase),Ve(n)?void 0:n}function Ve(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&!e.duration&&e.textCase===void 0:!0}function xb(e){let n=Q(e.function,"count"),t=V(e.scope)?e.scope:{},i;if(t.kind==="entities")i={kind:"entities",entities:(Array.isArray(t.entities)?t.entities:[]).filter(V).map(bn)};else{let r=o=>Array.isArray(o)?o.filter(s=>typeof s=="string"):[];i={kind:"filter",domains:r(t.domains),areaIds:r(t.areaIds),labelIds:r(t.labelIds),floorIds:r(t.floorIds)}}let a={function:n,scope:i};if(V(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:Q(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function Eu(e){switch(e.kind){case"literal":return{kind:"literal",value:Q(e.value)};case"entityState":return{kind:"entityState",...bn(e)};case"entityAttribute":return{kind:"entityAttribute",...bn(e),attribute:Q(e.attribute)};case"entityAge":return{kind:"entityAge",...bn(e)};case"aggregate":return{kind:"aggregate",aggregate:xb(V(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:ge(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:Q(e.value)};case"named":return{kind:"named",id:Q(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:Q(e.layer).toUpperCase(),stat:Rt.some(([n])=>n===e.stat)?e.stat:"latest"};default:throw new ht(`unknown value kind ${String(e.kind)}`)}}function Se(e){if(!V(e))throw new ht("value must be an object");if(V(e.kind)){let i={kind:Eu(e.kind)},a=Tu(e.format);return a&&(i.format=a),i}let n={kind:Eu(e)},t=Tu(e.format);return t&&(n.format=t),n}function op(e){return V(e)?{x:Z(e.x,.25),y:Z(e.y,.25),width:Z(e.width,.5),height:Z(e.height,.5),rotationDegrees:Z(e.rotationDegrees,0)}:{...Fa}}function wb(e){if(!V(e))return{kind:"isOn"};let n=Q(e.kind,"isOn"),t={kind:n};switch(n){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=V(e.value)?Se(e.value):U("");break;case"between":case"timeBetween":t.value=V(e.value)?Se(e.value):U(""),t.upper=V(e.upper)?Se(e.upper):U("");break;case"matchesRegex":t.pattern=Q(e.pattern);break;case"isOneOf":t.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return t}function Fu(e){if(!V(e))return{kind:"show"};let n=Q(e.kind,"show"),t={kind:n};switch(n){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=V(e.value)?Se(e.value):U("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=Z(e.number,0);break;case"setFontWeight":t.weight=ge(e.weight)??"regular";break;case"setFontDesign":t.design=ge(e.design)??"default";break;case"setFontWidth":t.width=ul(ge(e.width))??"standard";break;case"setItalic":t.italic=e.italic!==!1;break;default:break}return t}function sp(e){return Array.isArray(e)?e.filter(V).map(n=>{let t={id:Q(n.id).toUpperCase(),cases:(Array.isArray(n.cases)?n.cases:[]).filter(V).map(i=>{let a=V(i.when)?i.when:{};return{id:Q(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(V).map(r=>({id:Q(r.id).toUpperCase(),value:V(r.value)?Se(r.value):U(""),comparison:wb(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(Fu)}})};return Array.isArray(n.otherwise)&&(t.otherwise=n.otherwise.map(Fu)),typeof n.partId=="string"&&n.partId!==""&&(t.partId=n.partId.toUpperCase()),t}):[]}function vb(e,n){return{baseColorHex:V(e)?Q(e.baseColorHex,n):n}}function jr(e){return Array.isArray(e)?e.filter(V).map(n=>{let t={id:Q(n.id,ie()),upTo:Z(n.upTo,0),colorHex:Q(n.colorHex,"#FFFFFF")};return typeof n.fillColorHex=="string"&&(t.fillColorHex=n.fillColorHex),typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),t}):[]}function Kr(e){let n={id:e.id,upTo:q(e.upTo),colorHex:e.colorHex};return e.fillColorHex!==void 0&&(n.fillColorHex=e.fillColorHex),e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n}function kb(e){return Array.isArray(e)?e.filter(V).map(n=>{let t={id:Q(n.id,ie()).toUpperCase(),value:V(n.value)?Se(n.value):U("")};typeof n.colorHex=="string"&&(t.colorHex=n.colorHex);let i=ge(n.fontWeight);(i==="regular"||i==="medium"||i==="semibold"||i==="bold")&&(t.fontWeight=i),typeof n.fontSize=="number"&&(t.fontSize=n.fontSize);let a=ge(n.fontDesign);(a==="default"||a==="rounded"||a==="monospaced"||a==="serif")&&(t.fontDesign=a);let r=ul(ge(n.fontWidth));r!==void 0&&(t.fontWidth=r),typeof n.italic=="boolean"&&(t.italic=n.italic),ge(n.coloring)==="bands"&&(t.coloring="bands");let o=jr(n.bands);o.length>0&&(t.bands=o);let s=Q(n.bandAboveColorHex,be);return s!==be&&(t.bandAboveColorHex=s),t}):[]}function $b(e){if(Array.isArray(e.bands))return jr(e.bands);if(typeof e.bandLowerBound!="number")return[];let n=V(e.colorSlot)?Q(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:ie(),upTo:e.bandLowerBound,colorHex:Q(e.bandLowColorHex,Sl)},{id:ie(),upTo:Z(e.bandUpperBound,100),colorHex:n}]}function Cb(e){return Array.isArray(e)?e.filter(V).map(n=>({id:Q(n.id,ie()).toUpperCase(),match:Q(n.match,""),colorHex:Q(n.colorHex,En)})):[]}function Sb(e){if(V(e))return{colorHex:Q(e.colorHex,Aa),radius:vl(Z(e.radius,0)),dx:va(Z(e.dx,0)),dy:va(Z(e.dy,0))}}function st(e,n){if(typeof e.id!="string")throw new ht("element id is required");let t={id:e.id.toUpperCase(),colorSlot:vb(e.colorSlot,n),rules:sp(e.rules),frame:op(e.frame),isHidden:e.isHidden===!0},i=La(Z(e.opacity,1));i!==1&&(t.opacity=i);let a=Sb(e.shadow);return a!==void 0&&(t.shadow=a),t}function Tb(e){let n=Eb(e),t=e.payload;return typeof t.groupId=="string"&&t.groupId!==""&&(n.payload.groupId=t.groupId.toUpperCase()),typeof t.name=="string"&&t.name!==""&&(n.payload.name=t.name),t.accentGroup==="accent"&&(n.payload.accentGroup="accent"),n}function Eb(e){if(!V(e)||!V(e.payload))throw new ht("element must have a payload");let n=e.payload;switch(e.kind){case"text":{let t={...st(n,"#FFFFFF"),value:V(n.value)?Se(n.value):U(""),fontSize:Z(n.fontSize,14),fontWeight:ge(n.fontWeight)??"regular"};n.countdown===!0&&(t.countdown=!0),n.monospacedDigits===!0&&(t.monospacedDigits=!0);let i=typeof n.lineLimit=="number"?Math.round(n.lineLimit):1,a=Math.min(pl,Math.max(1,i));a>1&&(t.lineLimit=a);let r=ge(n.fontDesign);(r==="rounded"||r==="monospaced"||r==="serif")&&(t.fontDesign=r);let o=ul(ge(n.fontWidth));o!==void 0&&o!=="standard"&&(t.fontWidth=o),n.italic===!0&&(t.italic=!0);let s=Sa(Z(n.minimumScale,pt));s!==pt&&(t.minimumScale=s);let l=ge(n.alignment);(l==="leading"||l==="trailing")&&(t.alignment=l),ge(n.coloring)==="bands"&&(t.coloring="bands");let d=jr(n.bands);d.length>0&&(t.bands=d);let c=Q(n.bandAboveColorHex,be);c!==be&&(t.bandAboveColorHex=c);let u=ge(n.highlight);(u==="highest"||u==="lowest"||u==="both")&&(t.highlight=u);let p=Q(n.highColorHex,lt);p!==lt&&(t.highColorHex=p);let f=Q(n.lowColorHex,dt);f!==dt&&(t.lowColorHex=f);let g=kb(n.parts);g.length>0&&(t.parts=g);let b=nb(n.arc);return b!==void 0&&(t.arc=b),Vr(n,t),{kind:"text",payload:t}}case"icon":{let t={...st(n,"#FFFFFF"),symbol:V(n.symbol)?Se(n.symbol):U("lightbulb"),size:Z(n.size,14)},i=ge(n.path);return i!==void 0&&i!==""&&(t.path=i),Vr(n,t),{kind:"icon",payload:t}}case"gauge":{let t={...st(n,"#FFFFFF"),value:V(n.value)?Se(n.value):U("50"),minValue:Z(n.minValue,0),maxValue:Z(n.maxValue,100),style:ge(n.style)??"arc",lineWidth:Z(n.lineWidth,4),trackColorHex:Q(n.trackColorHex,"#FFFFFF40"),coloring:ge(n.coloring)??"uniform",bands:jr(n.bands),bandAboveColorHex:Q(n.bandAboveColorHex,be),thresholdColorHex:Q(n.thresholdColorHex,Oi)},i=wa(n.thresholdValue);i!==void 0&&(t.thresholdValue=i),V(n.total)&&(t.total=Se(n.total)),V(n.minSource)&&(t.minSource=Se(n.minSource)),V(n.maxSource)&&(t.maxSource=Se(n.maxSource));let a=xa(n.fill);a!==void 0&&(t.fill=a);let r=ab(n.ticks);r!==void 0&&(t.ticks=r);let o=ob(n.labels);return o!==void 0&&(t.labels=o),{kind:"gauge",payload:t}}case"chart":return{kind:"chart",payload:{...st(n,"#FFFFFF"),value:V(n.value)?Se(n.value):U("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(Z(n.historyMinutes,0))),historyPoints:Math.round(Z(n.historyPoints,24)),source:il(ge(n.source),Yy,fl),statPeriod:il(ge(n.statPeriod),Jr,Ta),statType:il(ge(n.statType),hl,Ea),style:Ni(n.style,["bars","line","area"],"bars"),limit:Math.max(0,Math.round(Z(n.limit,0))),takeFromEnd:n.takeFromEnd===!0,scale:Ni(n.scale,["auto","fixed"],"auto"),minValue:Z(n.minValue,0),maxValue:Z(n.maxValue,100),baseline:Ni(n.baseline,["lowest","zero"],"lowest"),barGap:Z(n.barGap,1.5),lineWidth:Z(n.lineWidth,2),highlight:Ni(n.highlight,["none","highest","lowest","both"],"none"),highColorHex:Q(n.highColorHex,lt),lowColorHex:Q(n.lowColorHex,dt),marker:typeof n.marker=="string"?Ni(n.marker,["none","dot","pointer"],"dot"):"pointer",...Su(n.highMarker)?{highMarker:n.highMarker}:{},...Su(n.lowMarker)?{lowMarker:n.lowMarker}:{},coloring:Ni(n.coloring,["uniform","bands"],"uniform"),bands:$b(n),bandAboveColorHex:Q(n.bandHighColorHex,Q(n.bandAboveColorHex,be)),fillBands:n.fillBands===!0,...Cu(n.curve)!=="straight"?{curve:Cu(n.curve)}:{},...wn(n.fillStyle)!=="flat"?{fillStyle:wn(n.fillStyle)}:{},...typeof n.fillColorHex=="string"?{fillColorHex:n.fillColorHex}:{},...xa(n.areaFill)!==void 0?{areaFill:xa(n.areaFill)}:{},...vn(n.barRadius)!==Pi?{barRadius:vn(n.barRadius)}:{},...kn(n.barCorners)!=="all"?{barCorners:kn(n.barCorners)}:{},...typeof n.barBorderWidth=="number"&&Number.isFinite(n.barBorderWidth)&&n.barBorderWidth!==0?{barBorderWidth:n.barBorderWidth}:{},...typeof n.barBorderColorHex=="string"?{barBorderColorHex:n.barBorderColorHex}:{},...n.barBorderOpenBase===!0?{barBorderOpenBase:!0}:{},...typeof n.bandAboveFillColorHex=="string"?{bandAboveFillColorHex:n.bandAboveFillColorHex}:{},...typeof n.bandAboveBorderColorHex=="string"?{bandAboveBorderColorHex:n.bandAboveBorderColorHex}:{},...ol(n.pointDots)!=="none"?{pointDots:ol(n.pointDots)}:{},...Ft(n.pointDotSize)!==void 0?{pointDotSize:Ft(n.pointDotSize)}:{},...typeof n.pointDotColorHex=="string"?{pointDotColorHex:n.pointDotColorHex}:{},...sl(n.gridLines)!==0?{gridLines:sl(n.gridLines)}:{},...Di(yn(n.gridColorHex),Zt)?{}:{gridColorHex:yn(n.gridColorHex)},...n.zeroLine===!0?{zeroLine:!0}:{},...xt(n.smoothing)!==void 0?{smoothing:xt(n.smoothing)}:{},...n.gaps===!0?{gaps:!0}:{},...typeof n.thresholdValue=="number"&&Number.isFinite(n.thresholdValue)?{thresholdValue:n.thresholdValue}:{},thresholdColorHex:Q(n.thresholdColorHex,Tl),...V(n.nowIndex)?{nowIndex:Se(n.nowIndex)}:{},nowColorHex:Q(n.nowColorHex,El),...n.drawsThreshold===!1?{drawsThreshold:!1}:{},...n.drawsNowLine===!1?{drawsNowLine:!1}:{},...n.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{},...ge(n.scaleFrom)!==void 0?{scaleFrom:ge(n.scaleFrom)}:{},timeLabelCount:Mt(n.timeLabelCount),labelSize:Z(n.labelSize,ct),labelColorHex:Q(n.labelColorHex,ut),labelsAbove:n.labelsAbove===!0,hourCycle:tl(n.hourCycle),minutes:nl(n.minutes)}};case"timeline":{let{colorSlot:t,...i}=st(n,"#FFFFFF");return{kind:"timeline",payload:{...i,value:V(n.value)?Se(n.value):U(""),historyMinutes:Math.max(1,Math.round(Z(n.historyMinutes,_l))),bands:Cb(n.bands),otherColorHex:Q(n.otherColorHex,En),gap:Math.min(go,Math.max(0,Z(n.gap,0))),cornerRadius:Math.max(0,Z(n.cornerRadius,ep)),timeLabelCount:cb(n),labelSize:Z(n.labelSize,ct),labelColorHex:Q(n.labelColorHex,ut),labelsAbove:n.labelsAbove===!0,hourCycle:tl(n.hourCycle),minutes:nl(n.minutes),...n.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{}}}}case"shape":{let t={...st(n,"#FFFFFF33"),kind:ge(n.kind)??"roundedRectangle",cornerRadius:Z(n.cornerRadius,6),thickness:Z(n.thickness,1),borderWidth:Z(n.borderWidth,1)};typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex);let i=xa(n.fill);return i!==void 0&&(t.fill=i),Vr(n,t),{kind:"shape",payload:t}}case"image":{let{colorSlot:t,...i}=st(n,"#FFFFFF"),a={...i,entity:bn(V(n.entity)?n.entity:{}),source:n.source==="entityPicture"?"entityPicture":"camera",contentMode:n.contentMode==="fit"?"fit":"fill",zoom:Z(n.zoom,1),panX:Z(n.panX,0),panY:Z(n.panY,0),cornerRadius:Z(n.cornerRadius,Gi),timestampCorner:gb.includes(n.timestampCorner)?n.timestampCorner:"topLeading",timestampSize:Z(n.timestampSize,yo)};n.timestamp===!0&&(a.timestamp=!0);let r=wa(n.timestampX),o=wa(n.timestampY);return r!==void 0&&o!==void 0&&Number.isFinite(r)&&Number.isFinite(o)&&(a.timestampX=bt(r),a.timestampY=bt(o)),Vr(n,a),{kind:"image",payload:a}}case"tap":{let{colorSlot:t,...i}=st(n,"#FFFFFF"),a={...i,action:V(n.action)?lp(n.action):{type:"refresh"}};return typeof n.openPageId=="string"&&(a.openPageId=n.openPageId),typeof n.openPageName=="string"&&(a.openPageName=n.openPageName),typeof n.attachedTo=="string"&&(a.attachedTo=n.attachedTo.toUpperCase()),{kind:"tap",payload:a}}case"chartTimes":{let{colorSlot:t,...i}=st(n,"#FFFFFF");return{kind:"chartTimes",payload:{...i,chart:Q(n.chart).toUpperCase(),timeLabelCount:Mt(n.timeLabelCount),labelSize:Z(n.labelSize,ct),labelColorHex:Q(n.labelColorHex,ut),hourCycle:tl(n.hourCycle),minutes:nl(n.minutes)}}}case"imageTime":{let{colorSlot:t,...i}=st(n,"#FFFFFF");return{kind:"imageTime",payload:{...i,image:Q(n.image).toUpperCase()}}}case"chartDots":{let{colorSlot:t,...i}=st(n,"#FFFFFF"),a=Ft(n.size);return{kind:"chartDots",payload:{...i,chart:Q(n.chart).toUpperCase(),dots:qr(n.dots),...a!==void 0?{size:a}:{},...typeof n.colorHex=="string"?{colorHex:n.colorHex}:{}}}}case"chartGrid":{let{colorSlot:t,...i}=st(n,"#FFFFFF");return{kind:"chartGrid",payload:{...i,chart:Q(n.chart).toUpperCase(),lines:ii(n.lines),colorHex:yn(n.colorHex),thickness:ai(n.thickness)}}}default:throw new ht(`unknown element kind ${String(e.kind)}`)}}function Mu(e){let n=V(e)?e:{},t={};if(V(n.placements))for(let[r,o]of Object.entries(n.placements)){if(!V(o))continue;let s={frame:op(o.frame),isHidden:o.isHidden===!0},l=wa(o.size);l!==void 0&&(s.size=l),t[r.toUpperCase()]=s}let i={placements:t,cornerBodyShape:n.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:Z(n.borderWidth,2),rules:sp(n.rules)};if(V(n.bezelText)&&(i.bezelText=Se(n.bezelText)),n.bezelCountdown===!0&&(i.bezelCountdown=!0),V(n.curvedText)&&(i.curvedText=Se(n.curvedText)),typeof n.curvedColorHex=="string"&&(i.curvedColorHex=n.curvedColorHex),V(n.bezelGauge)){let r=n.bezelGauge,o={value:V(r.value)?Se(r.value):U("50"),minValue:Z(r.minValue,0),maxValue:Z(r.maxValue,100),colorHexes:Array.isArray(r.colorHexes)&&r.colorHexes.length>0?r.colorHexes.filter(s=>typeof s=="string"):["#34C759","#FFCC00","#FF3B30"]};V(r.minLabel)&&(o.minLabel=Se(r.minLabel)),V(r.maxLabel)&&(o.maxLabel=Se(r.maxLabel)),i.bezelGauge=o}typeof n.backgroundColorHex=="string"&&(i.backgroundColorHex=n.backgroundColorHex);let a=xa(n.backgroundFill);return a!==void 0&&(i.backgroundFill=a),typeof n.borderColorHex=="string"&&(i.borderColorHex=n.borderColorHex),i}function Fb(e){let n={};if(Array.isArray(e))for(let t=0;t+1<e.length;t+=2){let i=e[t];typeof i=="string"&&(n[i]=Mu(e[t+1]))}else if(V(e))for(let[t,i]of Object.entries(e))n[t]=Mu(i);return n}function Mb(e){let n={value:V(e.value)?Se(e.value):U("")};return typeof e.label=="string"&&(n.label=e.label),typeof e.symbol=="string"&&(n.symbol=e.symbol),e.countdown===!0&&(n.countdown=!0),n}function lp(e){if(!V(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...bn(e)};case"callService":{let n={type:"callService",serviceDomain:typeof e.serviceDomain=="string"?e.serviceDomain:"",serviceName:typeof e.serviceName=="string"?e.serviceName:""};return typeof e.serviceDataJSON=="string"&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),typeof e.entityId=="string"&&e.entityId!==""&&(n.target=bn(e)),n}default:return{type:"none"}}}function Bi(e){if(!V(e))throw new ht("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new ht(`${r} is required`);let n=(Array.isArray(e.values)?e.values:[]).filter(V).map(r=>({id:Q(r.id).toUpperCase(),name:Q(r.name),value:V(r.value)?Se(r.value):U("")})),t=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(V).map(r=>r.kind==="template"?{kind:"template",value:Q(r.value)}:r.kind==="entity"?{kind:"entity",...bn(r)}:null).filter(r=>r!==null),i={schemaVersion:Z(e.schemaVersion,1),id:Q(e.id).toUpperCase(),name:Q(e.name,"Custom"),values:n,slotIndex:Z(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Tb),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:Fb(e.perFamily),dataSources:t,tapAction:lp(e.tapAction)};V(e.inline)&&(i.inline=Mb(e.inline));let a=wa(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),e.hidden===!0&&(i.hidden=!0),Array.isArray(e.groups)){let r=e.groups.filter(V).filter(o=>typeof o.id=="string").map(o=>({id:Q(o.id).toUpperCase(),name:Q(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return Db(i,Array.isArray(e.elements)?e.elements:[]),$t(i),i}function zl(e,n){let t=n?.kind;if(!t||t.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===t.layer);return i?.kind==="chart"?i:void 0}function Hn(e,n){return e.elements.filter(t=>t.kind==="text"&&t.payload.value.kind.kind==="chartStat"&&t.payload.value.kind.layer===n)}function sn(e,n,t){let i=ft(e,n.payload.id);if(i){Ga(e,t,i.id);return}let a=ql(e,[n.payload.id,t]),r=e.groups?.find(o=>o.id===a);r&&(r.locked=!1)}var dp={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1},trend:{x:.85,y:0},delta:{x:.5,y:0},sum:{x:.2,y:0},first:{x:.65,y:1}};function cp(e,n,t,i){let a=ce.rectangular,r=Math.min(1,(i*t*.62+4)/a.width),o=Math.min(1,t*1.3/a.height),s=e.x+n.x*e.width-n.x*r,l=e.y+n.y*e.height-n.y*o;return{x:Math.max(0,Math.min(1-r,s)),y:Math.max(0,Math.min(1-o,l)),width:r,height:o,rotationDegrees:0}}function up(e,n,t){let i=e.elements.find(d=>d.payload.id===n);if(!i||i.kind!=="chart")return;let a=Le("text"),r=t==="latest"?10:8,o={kind:{kind:"chartStat",layer:n,stat:t}};(t==="latest"||t==="delta"||t==="sum")&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:t==="latest"?"#FFFFFF":"#FFFFFF99"};let s=t==="trend"?2:o.format?.useEntityUnit?7:4;a.payload.frame=cp(i.payload.frame,dp[t],r,s);let l=e.elements.findIndex(d=>d.payload.id===n);return e.elements.splice(l+1,0,a),sn(e,i,a.payload.id),a.payload.id}var pp={highest:"arrowtriangle.up.fill",lowest:"circle.fill",now:"arrowtriangle.down.fill",first:"circle.fill",latest:"circle.fill",threshold:"circle.fill",zero:"circle.fill"},Ru=6,Rb={"\u25B2":"arrowtriangle.up.fill","\u25BC":"arrowtriangle.down.fill","\u25CF":"circle.fill","\u25C6":"diamond.fill"};function Hb(e,n){let t=(i,a)=>i!==void 0&&i!==a?i:void 0;return n==="highest"?t(e.payload.highColorHex,lt)??"#FFD60A":n==="lowest"?t(e.payload.lowColorHex,dt)??"#FF453A":"#FFFFFF"}function Ol(e){e.nowIndex===void 0&&(e.nowIndex={kind:{kind:"time",timeField:"hour"}},e.drawsNowLine=!1)}function Ke(e,n){return e.elements.filter(t=>t.payload.chartAnchor?.layer===n)}function Gl(e,n,t,i="above"){let a=e.elements.find(s=>s.payload.id===n);if(!a||a.kind!=="chart")return;t==="now"&&Ol(a.payload);let r=Le("icon");r.payload.symbol=U(pp[t]),r.payload.size=Ru,r.payload.colorSlot={baseColorHex:Hb(a,t)},r.payload.frame=Ab(Ru),r.payload.chartAnchor={layer:n,at:t,place:i};let o=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(o+1,0,r),sn(e,a,r.payload.id),r.payload.id}function hp(e,n){let t=e.elements.findIndex(u=>u.payload.id===n),i=e.elements[t];if(!i||i.kind!=="text"||i.payload.chartAnchor===void 0)return;let a=i.payload,r=a.chartAnchor,o=u=>{let p=ri(u);return p===void 0?void 0:Rb[p.trim()]},s=new Set(Ua.icon),l=u=>u.flatMap(p=>{if(p.kind==="setText"){let f=p.value===void 0?void 0:o(p.value);return f===void 0?[]:[{kind:"setIcon",value:U(f)}]}return s.has(je[p.kind])?[p]:[]}),d=a.rules.filter(u=>u.partId===void 0).map(u=>({...u,cases:u.cases.map(p=>({...p,then:l(p.then)})),...u.otherwise!==void 0?{otherwise:l(u.otherwise)}:{}})),c=Le("icon");c.payload={...c.payload,id:a.id,colorSlot:a.colorSlot,rules:d,frame:a.frame,isHidden:a.isHidden,...a.groupId!==void 0?{groupId:a.groupId}:{},...a.name!==void 0?{name:a.name}:{},chartAnchor:r,symbol:U(o(a.value)??pp[r.at]),size:a.fontSize},e.elements[t]=c}function Ab(e){let n=ce.rectangular;return{x:0,y:0,width:Math.min(1,e*1.2/n.width),height:Math.min(1,e*1.3/n.height),rotationDegrees:0}}function ei(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;t==="now"&&Ol(a);let r=Le("shape");r.payload.kind="line",r.payload.thickness=1,r.payload.borderWidth=0,r.payload.colorSlot={baseColorHex:t==="now"?a.nowColorHex:a.thresholdColorHex},r.payload.frame=fp(a.frame,t),r.payload.chartAnchor={layer:n,at:t,place:"through"};let o=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(o+1,0,r),sn(e,i,r.payload.id),t==="now"?a.drawsNowLine=!1:a.drawsThreshold=!1,r.payload.id}function fp(e,n){let t=ce.rectangular,i=3;return n==="now"?{...e,width:Math.min(e.width,i/t.width),rotationDegrees:0}:{...e,height:Math.min(e.height,i/t.height),rotationDegrees:0}}function An(e,n){return e.elements.filter(t=>t.kind==="chartTimes"&&t.payload.chart===n)}function di(e,n){let t=e.elements.find(o=>o.payload.id===n);if(!t||t.kind!=="chart"&&t.kind!=="timeline")return;let i=t.payload,a=Le("chartTimes");a.payload.chart=n,a.payload.timeLabelCount=i.timeLabelCount>0?Mt(i.timeLabelCount):tp,a.payload.labelSize=i.labelSize,a.payload.labelColorHex=i.labelColorHex,a.payload.hourCycle=i.hourCycle,a.payload.minutes=i.minutes,a.payload.frame=Nb(i.frame,i.labelSize,i.labelsAbove);let r=e.elements.findIndex(o=>o.payload.id===n);return e.elements.splice(r+1,0,a),sn(e,t,a.payload.id),i.drawsTimeLabels=!1,a.payload.id}function Bl(e,n){return e.elements.filter(t=>t.kind==="imageTime"&&t.payload.image===n)}function Lb(e){let n=Math.min(40,Math.max(4,e));return{w:8*n*.578+n*.89,h:n*1.25}}function Vl(e,n){return Math.max(0,Math.min(e/(8*.578+.89),n/1.25))}function Ul(e,n,t=ce.rectangular){let i=e.elements.find(b=>b.payload.id===n);if(!i||i.kind!=="image")return;let a=i.payload,r=Le("imageTime");r.payload.image=n;let o=Lb(a.timestampSize),s=a.frame.x*t.width,l=a.frame.y*t.height,d=a.frame.width*t.width,c=a.frame.height*t.height,u,p;if(bo(a)){let b=(y,x,$,k)=>k>=$?x+($-k)/2:Math.min(x+$-k,Math.max(x,y-k/2));u=b(s+a.timestampX*d,s,d,o.w),p=b(l+a.timestampY*c,l,c,o.h)}else u=a.timestampCorner.endsWith("Leading")?s+4:s+d-4-o.w,p=a.timestampCorner.startsWith("top")?l+4:l+c-4-o.h;let f=b=>Math.round(b*1e3)/1e3;r.payload.frame={x:f(u/t.width),y:f(p/t.height),width:f(o.w/t.width),height:f(o.h/t.height),rotationDegrees:0};let g=e.elements.findIndex(b=>b.payload.id===n);return e.elements.splice(g+1,0,r),sn(e,i,r.payload.id),delete a.timestamp,delete a.timestampX,delete a.timestampY,a.timestampCorner="topLeading",a.timestampSize=yo,r.payload.id}function ci(e,n){return e.elements.filter(t=>t.kind==="chartDots"&&t.payload.chart===n)}function ui(e,n){return e.elements.filter(t=>t.kind==="chartGrid"&&t.payload.chart===n)}function Wl(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=Le("chartDots");i.payload.chart=n,i.payload.dots=t.payload.pointDots==="all"?"all":"auto",i.payload.frame={...t.payload.frame};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a+1,0,i),sn(e,t,i.payload.id),i.payload.id}function Kl(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=Le("chartGrid");i.payload.chart=n,i.payload.frame={...t.payload.frame};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a,0,i),sn(e,t,i.payload.id),i.payload.id}var Ib="#FFFFFF66";function jl(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=Le("shape");i.payload.kind="line",i.payload.thickness=1,i.payload.borderWidth=0,i.payload.colorSlot={baseColorHex:Ib},i.payload.frame=fp(t.payload.frame,"threshold"),i.payload.chartAnchor={layer:n,at:"zero",place:"through"};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a+1,0,i),sn(e,t,i.payload.id),i.payload.id}function mp(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;if(t===void 0){delete a.thresholdValue,delete a.drawsThreshold;for(let r of Ke(e,n))r.payload.chartAnchor?.at==="threshold"&&ke(e,r.payload.id);return}a.thresholdValue=t,a.drawsThreshold=!1,Ke(e,n).some(r=>r.payload.chartAnchor?.at==="threshold")||ei(e,n,"threshold")}function gp(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;if(!t){delete a.nowIndex,delete a.drawsNowLine;for(let r of Ke(e,n))r.payload.chartAnchor?.at==="now"&&ke(e,r.payload.id);return}Ol(a),a.drawsNowLine=!1,Ke(e,n).some(r=>r.payload.chartAnchor?.at==="now")||ei(e,n,"now")}function yp(e){let n=e.elements.filter(t=>t.kind==="chart"||t.kind==="timeline"||t.kind==="image");for(let t of n){let i=t.payload,a=new Set(e.elements.map(l=>l.payload.id)),r=de.find(l=>e.perFamily[l]?.placements[i.id]!==void 0),o=i.frame,s=r===void 0?void 0:e.perFamily[r].placements[i.id];if(s&&(i.frame={...s.frame}),t.kind==="chart"&&_b(e,t.payload),t.kind==="timeline"&&t.payload.drawsTimeLabels!==!1&&t.payload.timeLabelCount>0&&di(e,i.id),t.kind==="image"&&t.payload.timestamp===!0&&Ul(e,i.id,ce[r??"rectangular"]),i.frame=o,!(r===void 0||s===void 0))for(let l of e.elements)a.has(l.payload.id)||(e.perFamily[r].placements[l.payload.id]={frame:{...l.payload.frame},isHidden:s.isHidden},l.payload.isHidden=!0)}}function _b(e,n){{if(n.highlight!==void 0&&n.highlight!=="none"){let a=ka(n),r=[];(n.highlight==="highest"||n.highlight==="both")&&r.push(["highest",a.high]),(n.highlight==="lowest"||n.highlight==="both")&&r.push(["lowest",a.low]);for(let[o,s]of r){let l=Gl(e,n.id,o),d=e.elements.find(c=>c.payload.id===l);d?.kind==="icon"&&s!=="none"&&(d.payload.symbol=U(s==="triangle"?"arrowtriangle.up.fill":"circle.fill"))}db(n,{high:"none",low:"none"}),n.highlight="none"}n.thresholdValue!==void 0&&n.drawsThreshold!==!1&&ei(e,n.id,"threshold"),n.nowIndex!==void 0&&n.drawsNowLine!==!1&&ei(e,n.id,"now"),n.drawsTimeLabels!==!1&&si(n)&&n.timeLabelCount>0&&di(e,n.id);let t=ol(n.pointDots);if(t!=="none"){let a=Wl(e,n.id),r=e.elements.find(o=>o.payload.id===a);if(r?.kind==="chartDots"){r.payload.dots=t;let o=Ft(n.pointDotSize);o!==void 0&&(r.payload.size=o),typeof n.pointDotColorHex=="string"&&(r.payload.colorHex=n.pointDotColorHex)}}let i=sl(n.gridLines);if(i>0){let a=Kl(e,n.id),r=e.elements.find(o=>o.payload.id===a);r?.kind==="chartGrid"&&(r.payload.lines=i,r.payload.colorHex=yn(n.gridColorHex))}if(n.zeroLine===!0){let a=jl(e,n.id),r=e.elements.find(o=>o.payload.id===a);r?.kind==="shape"&&(r.payload.colorSlot={baseColorHex:yn(n.gridColorHex)})}delete n.pointDots,delete n.pointDotSize,delete n.pointDotColorHex,delete n.gridLines,delete n.gridColorHex,delete n.zeroLine}}function Nb(e,n,t){let i=ce.rectangular,a=Math.max(Fn,Math.min(Mn,n)),r=Math.min(1,a*1.2/i.height),o=Math.min(1,Math.max(0,e.width)),s=t?e.y-r:e.y+e.height;return{x:Math.max(0,Math.min(1-o,e.x)),y:Math.max(0,Math.min(1-r,s)),width:o,height:r,rotationDegrees:0}}function Db(e,n){for(let t of n){if(!V(t)||t.kind!=="chart"||!V(t.payload))continue;let i=t.payload,a=Q(i.id).toUpperCase(),r=e.elements.find(p=>p.payload.id===a);if(!r||r.kind!=="chart")continue;let o=Q(i.scaleLabelColorHex,"#FFFFFF99"),s=p=>{let f=V(p)?p:{};return{fontSize:Z(f.fontSize,8),colorHex:Q(f.colorHex,o),pillColorHex:typeof f.pillColorHex=="string"?f.pillColorHex:void 0}},l=[],d=ge(i.scaleLabels);(d==="top"||d==="range")&&l.push(["top",s(i.topLabelStyle)]),d==="range"&&l.push(["bottom",s(i.bottomLabelStyle)]);let c=ge(i.latestLabel);if((c==="corner"||c==="end")&&l.push(["latest",s(i.latestLabelStyle)]),l.length===0)continue;let u=e.elements.findIndex(p=>p.payload.id===a)+1;for(let[p,f]of l){let g=cp(r.payload.frame,dp[p],f.fontSize,p==="latest"?5:4),b=[];if(f.pillColorHex!==void 0){let x=Le("shape");x.payload.kind="capsule",x.payload.colorSlot={baseColorHex:f.pillColorHex},x.payload.frame={...g},b.push(x)}let y=Le("text");y.payload.value={kind:{kind:"chartStat",layer:a,stat:p}},y.payload.fontSize=f.fontSize,y.payload.fontWeight="medium",y.payload.colorSlot={baseColorHex:f.colorHex},y.payload.frame=g,b.push(y),e.elements.splice(u,0,...b),u+=b.length;for(let x of b)sn(e,r,x.payload.id)}}}function q(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function xn(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function Pb(e){let n={};return e.decimals!==void 0&&(n.decimals=q(e.decimals)),e.multiply!==void 0&&(n.multiply=q(e.multiply)),e.offset!==void 0&&(n.offset=q(e.offset)),e.prefix&&(n.prefix=e.prefix),e.suffix&&(n.suffix=e.suffix),e.useEntityUnit&&(n.useEntityUnit=!0),e.relativeTime&&(n.relativeTime=!0),e.duration&&(n.duration=!0),e.textCase!==void 0&&(n.textCase=e.textCase),n}function zb(e){let n=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(xn)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},t={function:e.function,scope:n};return e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(t.attribute=e.attribute),t}function Ob(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...xn(e)};case"entityAttribute":return{kind:"entityAttribute",...xn(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...xn(e)};case"aggregate":return{kind:"aggregate",aggregate:zb(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat}}}function ye(e){let n={kind:Ob(e.kind)};return Ve(e.format)||(n.format=Pb(e.format)),n}function Xt(e){return{x:q(e.x),y:q(e.y),width:q(e.width),height:q(e.height),rotationDegrees:q(e.rotationDegrees)}}function Gb(e){let n={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=ye(e.value??U(""));break;case"between":case"timeBetween":n.value=ye(e.value??U("")),n.upper=ye(e.upper??U(""));break;case"matchesRegex":n.pattern=e.pattern??"";break;case"isOneOf":n.options=e.options??[];break;default:break}return n}function Hu(e){let n={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=ye(e.value??U(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=q(e.number??0);break;case"setFontWeight":n.weight=e.weight??"regular";break;case"setFontDesign":n.design=e.design??"default";break;case"setFontWidth":n.width=e.width??"standard";break;case"setItalic":n.italic=e.italic!==!1;break;default:break}return n}function Jt(e){return e.map(n=>{let t={id:n.id,cases:n.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:ye(a.value),comparison:Gb(a.comparison)}))},then:i.then.map(Hu)}))};return n.otherwise&&(t.otherwise=n.otherwise.map(Hu)),n.partId!==void 0&&(t.partId=n.partId),t})}function Bb(e){let n={id:e.id,value:ye(e.value)};return e.colorHex!==void 0&&(n.colorHex=e.colorHex),e.fontWeight!==void 0&&(n.fontWeight=e.fontWeight),e.fontSize!==void 0&&(n.fontSize=q(e.fontSize)),e.fontDesign!==void 0&&(n.fontDesign=e.fontDesign),e.fontWidth!==void 0&&(n.fontWidth=e.fontWidth),e.italic!==void 0&&(n.italic=e.italic),e.coloring!==void 0&&e.coloring!=="uniform"&&(n.coloring=e.coloring),e.bands!==void 0&&e.bands.length>0&&(n.bands=e.bands.map(Kr)),e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==be&&(n.bandAboveColorHex=e.bandAboveColorHex),n}function Vb(e){let n=Ub(e);return e.payload.groupId!==void 0&&(n.payload.groupId=e.payload.groupId),e.payload.name!==void 0&&(n.payload.name=e.payload.name),e.payload.accentGroup==="accent"&&(n.payload.accentGroup="accent"),n}function Ub(e){let n=t=>{let i={id:t.id,colorSlot:{baseColorHex:t.colorSlot.baseColorHex},rules:Jt(t.rules),frame:Xt(t.frame),isHidden:t.isHidden};return t.opacity!==void 0&&t.opacity!==1&&(i.opacity=q(t.opacity)),t.shadow!==void 0&&(i.shadow={colorHex:t.shadow.colorHex,radius:q(t.shadow.radius),dx:q(t.shadow.dx),dy:q(t.shadow.dy)}),i};switch(e.kind){case"text":{let t={...n(e.payload),value:ye(e.payload.value),fontSize:q(e.payload.fontSize),fontWeight:e.payload.fontWeight};e.payload.countdown===!0&&(t.countdown=!0),e.payload.monospacedDigits===!0&&(t.monospacedDigits=!0),e.payload.lineLimit!==void 0&&e.payload.lineLimit>1&&(t.lineLimit=e.payload.lineLimit),e.payload.fontDesign!==void 0&&e.payload.fontDesign!=="default"&&(t.fontDesign=e.payload.fontDesign),e.payload.fontWidth!==void 0&&e.payload.fontWidth!=="standard"&&(t.fontWidth=e.payload.fontWidth),e.payload.italic===!0&&(t.italic=!0),e.payload.minimumScale!==void 0&&e.payload.minimumScale!==pt&&(t.minimumScale=q(e.payload.minimumScale)),e.payload.alignment!==void 0&&e.payload.alignment!=="center"&&(t.alignment=e.payload.alignment);let i=e.payload;return i.coloring!==void 0&&i.coloring!=="uniform"&&(t.coloring=i.coloring),i.bands!==void 0&&i.bands.length>0&&(t.bands=i.bands.map(Kr)),i.bandAboveColorHex!==void 0&&i.bandAboveColorHex!==be&&(t.bandAboveColorHex=i.bandAboveColorHex),i.highlight!==void 0&&i.highlight!=="none"&&(t.highlight=i.highlight),i.highColorHex!==void 0&&i.highColorHex!==lt&&(t.highColorHex=i.highColorHex),i.lowColorHex!==void 0&&i.lowColorHex!==dt&&(t.lowColorHex=i.lowColorHex),i.parts!==void 0&&i.parts.length>0&&(t.parts=i.parts.map(Bb),vt(i)&&(t.value=ye(Ia(i.parts)))),i.arc!==void 0&&(t.arc=ib(i.arc)),Ur(i,t),{kind:"text",payload:t}}case"icon":{let t={...n(e.payload),symbol:ye(e.payload.symbol)};return e.payload.path!==void 0&&e.payload.path!==""&&(t.path=e.payload.path),t.size=q(e.payload.size),Ur(e.payload,t),{kind:"icon",payload:t}}case"gauge":{let t=e.payload,i={...n(t),value:ye(t.value),minValue:q(t.minValue),maxValue:q(t.maxValue),style:t.style,lineWidth:q(t.lineWidth),trackColorHex:t.trackColorHex};return t.coloring!=="uniform"&&(i.coloring=t.coloring),t.bands.length>0&&(i.bands=t.bands.map(Kr)),t.bandAboveColorHex!==be&&(i.bandAboveColorHex=t.bandAboveColorHex),t.thresholdValue!==void 0&&(i.thresholdValue=q(t.thresholdValue)),t.thresholdColorHex!==Oi&&(i.thresholdColorHex=t.thresholdColorHex),t.total!==void 0&&(i.total=ye(t.total)),t.minSource!==void 0&&(i.minSource=ye(t.minSource)),t.maxSource!==void 0&&(i.maxSource=ye(t.maxSource)),t.fill!==void 0&&(i.fill=Wr(t.fill)),t.ticks!==void 0&&!so(t.ticks)&&(i.ticks=rb(t.ticks)),t.labels!==void 0&&!lo(t.labels)&&(i.labels=sb(t.labels)),{kind:"gauge",payload:i}}case"chart":{let t=e.payload,i={...n(t),value:ye(t.value),historyMinutes:Math.max(0,Math.round(t.historyMinutes)),historyPoints:Math.round(t.historyPoints),style:t.style,limit:Math.max(0,Math.round(t.limit)),takeFromEnd:t.takeFromEnd,scale:t.scale,minValue:q(t.minValue),maxValue:q(t.maxValue),baseline:t.baseline,barGap:q(t.barGap),lineWidth:q(t.lineWidth),highlight:t.highlight,highColorHex:t.highColorHex,lowColorHex:t.lowColorHex,marker:Ku(ka(t)),coloring:t.coloring,bands:t.bands.map(Kr),bandAboveColorHex:t.bandAboveColorHex,fillBands:t.fillBands};t.source!==fl&&(i.source=t.source),t.statPeriod!==Ta&&(i.statPeriod=t.statPeriod),t.statType!==Ea&&(i.statType=t.statType),t.thresholdValue!==void 0&&(i.thresholdValue=q(t.thresholdValue)),t.thresholdColorHex!==Tl&&(i.thresholdColorHex=t.thresholdColorHex),t.nowIndex!==void 0&&(i.nowIndex=ye(t.nowIndex)),t.nowColorHex!==El&&(i.nowColorHex=t.nowColorHex),t.drawsThreshold===!1&&(i.drawsThreshold=!1),t.drawsNowLine===!1&&(i.drawsNowLine=!1),t.drawsTimeLabels===!1&&(i.drawsTimeLabels=!1),t.scaleFrom!==void 0&&(i.scaleFrom=t.scaleFrom),t.labelSize!==ct&&(i.labelSize=q(t.labelSize)),t.labelColorHex!==ut&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==Xn&&(i.timeLabelCount=Mt(t.timeLabelCount)),t.hourCycle!==Jn&&(i.hourCycle=t.hourCycle),t.minutes!==Zn&&(i.minutes=t.minutes);let a=ka(t);ju(a)||(i.highMarker=a.high,i.lowMarker=a.low);let r=t.curve??"straight";r!=="straight"&&(i.curve=r);let o=wn(t.fillStyle);o!=="flat"&&(i.fillStyle=o),t.fillColorHex!==void 0&&(i.fillColorHex=t.fillColorHex),t.areaFill!==void 0&&(i.areaFill=Wr(t.areaFill));let s=vn(t.barRadius);s!==Pi&&(i.barRadius=q(s));let l=kn(t.barCorners);l!=="all"&&(i.barCorners=l);let d=xt(t.smoothing);return d!==void 0&&(i.smoothing=d),t.gaps===!0&&(i.gaps=!0),t.barBorderWidth!==void 0&&t.barBorderWidth!==0&&(i.barBorderWidth=q(t.barBorderWidth)),t.barBorderColorHex!==void 0&&(i.barBorderColorHex=t.barBorderColorHex),t.bandAboveFillColorHex!==void 0&&(i.bandAboveFillColorHex=t.bandAboveFillColorHex),t.bandAboveBorderColorHex!==void 0&&(i.bandAboveBorderColorHex=t.bandAboveBorderColorHex),t.barBorderOpenBase===!0&&(i.barBorderOpenBase=!0),{kind:"chart",payload:i}}case"timeline":{let t=e.payload,i={id:t.id,rules:Jt(t.rules),frame:Xt(t.frame),isHidden:t.isHidden,value:ye(t.value)};return t.historyMinutes!==_l&&(i.historyMinutes=Math.max(1,Math.round(t.historyMinutes))),t.bands.length>0&&(i.bands=t.bands.map(a=>({id:a.id,match:a.match,colorHex:a.colorHex}))),t.otherColorHex!==En&&(i.otherColorHex=t.otherColorHex),t.gap!==0&&(i.gap=q(t.gap)),t.cornerRadius!==ep&&(i.cornerRadius=q(t.cornerRadius)),t.labelSize!==ct&&(i.labelSize=q(t.labelSize)),t.labelColorHex!==ut&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==Xn&&(i.timeLabelCount=Math.max(0,Math.min(li,Math.round(t.timeLabelCount)))),t.hourCycle!==Jn&&(i.hourCycle=t.hourCycle),t.minutes!==Zn&&(i.minutes=t.minutes),t.drawsTimeLabels===!1&&(i.drawsTimeLabels=!1),{kind:"timeline",payload:i}}case"shape":{let t={...n(e.payload),kind:e.payload.kind,cornerRadius:q(e.payload.cornerRadius),borderWidth:q(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(t.borderColorHex=e.payload.borderColorHex),e.payload.thickness!==1&&(t.thickness=q(e.payload.thickness)),e.payload.fill!==void 0&&(t.fill=Wr(e.payload.fill)),Ur(e.payload,t),{kind:"shape",payload:t}}case"image":{let t=e.payload,i={id:t.id,entity:xn(t.entity),rules:Jt(t.rules),frame:Xt(t.frame),isHidden:t.isHidden};t.source!=="camera"&&(i.source=t.source),t.timestamp===!0&&(i.timestamp=!0),t.contentMode!=="fill"&&(i.contentMode=t.contentMode),t.zoom!==1&&(i.zoom=q(t.zoom)),t.panX!==0&&(i.panX=q(t.panX)),t.panY!==0&&(i.panY=q(t.panY)),t.cornerRadius!==Gi&&(i.cornerRadius=q(t.cornerRadius));let a=bo(t),r=a?yb(t.timestampX,t.timestampY):t.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),t.timestampSize!==yo&&(i.timestampSize=q(t.timestampSize)),a&&(i.timestampX=q(t.timestampX),i.timestampY=q(t.timestampY)),Ur(t,i),{kind:"image",payload:i}}case"tap":{let t=e.payload,i={id:t.id,action:bp(t.action)};return t.openPageId!==void 0&&(i.openPageId=t.openPageId),t.openPageName!==void 0&&(i.openPageName=t.openPageName),t.attachedTo!==void 0&&(i.attachedTo=t.attachedTo),i.rules=Jt(t.rules),i.frame=Xt(t.frame),i.isHidden=t.isHidden,t.opacity!==void 0&&t.opacity!==1&&(i.opacity=q(t.opacity)),t.shadow!==void 0&&(i.shadow={colorHex:t.shadow.colorHex,radius:q(t.shadow.radius),dx:q(t.shadow.dx),dy:q(t.shadow.dy)}),{kind:"tap",payload:i}}case"chartTimes":{let t=e.payload,i={id:t.id,rules:Jt(t.rules),frame:Xt(t.frame),isHidden:t.isHidden,chart:t.chart};return t.labelSize!==ct&&(i.labelSize=q(t.labelSize)),t.labelColorHex!==ut&&(i.labelColorHex=t.labelColorHex),t.timeLabelCount!==Xn&&(i.timeLabelCount=Mt(t.timeLabelCount)),t.hourCycle!==Jn&&(i.hourCycle=t.hourCycle),t.minutes!==Zn&&(i.minutes=t.minutes),{kind:"chartTimes",payload:i}}case"imageTime":{let t=e.payload,i={id:t.id,rules:Jt(t.rules),frame:Xt(t.frame),isHidden:t.isHidden};return t.image!==""&&(i.image=t.image),{kind:"imageTime",payload:i}}case"chartDots":{let t=e.payload,i={id:t.id,rules:Jt(t.rules),frame:Xt(t.frame),isHidden:t.isHidden,chart:t.chart};qr(t.dots)!=="auto"&&(i.dots="all");let a=Ft(t.size);return a!==void 0&&(i.size=q(a)),t.colorHex!==void 0&&(i.colorHex=t.colorHex),{kind:"chartDots",payload:i}}case"chartGrid":{let t=e.payload,i={id:t.id,rules:Jt(t.rules),frame:Xt(t.frame),isHidden:t.isHidden,chart:t.chart},a=ii(t.lines);a!==Sn&&(i.lines=a);let r=yn(t.colorHex);Di(r,Zt)||(i.colorHex=r);let o=ai(t.thickness);return o!==Cn&&(i.thickness=q(o)),{kind:"chartGrid",payload:i}}}}function Wb(e){let n={},t=Object.keys(e.placements);if(t.length>0){let i={};for(let a of t){let r=e.placements[a],o={frame:Xt(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=q(r.size)),i[a]=o}n.placements=i}if(e.bezelText&&(n.bezelText=ye(e.bezelText)),e.bezelCountdown===!0&&(n.bezelCountdown=!0),e.curvedText&&(n.curvedText=ye(e.curvedText)),e.curvedColorHex!==void 0&&(n.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:ye(i.value),minValue:q(i.minValue),maxValue:q(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=ye(i.minLabel)),i.maxLabel&&(a.maxLabel=ye(i.maxLabel)),n.bezelGauge=a}return e.backgroundColorHex!==void 0&&(n.backgroundColorHex=e.backgroundColorHex),e.backgroundFill!==void 0&&(n.backgroundFill=Wr(e.backgroundFill)),n.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n.borderWidth=q(e.borderWidth),e.rules.length>0&&(n.rules=Jt(e.rules)),n}function bp(e){if(e.type==="callService"){let n={type:e.type,serviceDomain:e.serviceDomain,serviceName:e.serviceName};return e.serviceDataJSON!==void 0&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),e.target!==void 0&&e.target.entityId!==""&&Object.assign(n,xn(e.target)),n}return"entityId"in e?{type:e.type,...xn(e)}:{type:e.type}}function Kb(e){let n={};return e.label!==void 0&&(n.label=e.label),n.value=ye(e.value),e.symbol!==void 0&&(n.symbol=e.symbol),e.countdown&&(n.countdown=!0),n}function Vi(e){let n=[];for(let i of de){let a=e.perFamily[i];a&&n.push(i,Wb(a))}let t={schemaVersion:ni(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:ye(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(Vb),supportedFamilies:e.supportedFamilies,perFamily:n,dataSources:e.dataSources.map(i=>i.kind==="template"?{kind:"template",value:i.value}:{kind:"entity",...xn(i)}),tapAction:bp(e.tapAction)};return e.inline!==void 0&&(t.inline=Kb(e.inline)),e.refreshMinutes!==void 0&&(t.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(t.openPageId=e.openPageId),e.openPageName!==void 0&&(t.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(t.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(t.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(t.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),e.hidden===!0&&(t.hidden=!0),t}function xp(e){return V(e)&&e.hidden===!0}function wp(e,n){let t={...e};return n?t.hidden=!0:delete t.hidden,t}function vp(e,n,t){let i=[],a=[];for(let r of e){let o=n(r);o!==void 0&&o.hidden&&o.id!==t?a.push(r):i.push(r)}return{shown:i,hidden:a}}function ft(e,n){let i=e.elements.find(a=>a.payload.id===n)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function mt(e,n){return e.elements.filter(t=>t.payload.groupId===n&&!xe(e,t))}function kp(e,n){let t=new Set;for(let i of n){let a=ft(e,i);if(a)for(let r of mt(e,a.id))t.add(r.payload.id);else t.add(i)}return e.elements.filter(i=>t.has(i.payload.id)&&i.kind!=="chartDots"&&i.kind!=="chartGrid"&&i.payload.chartAnchor===void 0).map(i=>i.payload.id)}function $t(e){let n=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!n.has(a.payload.groupId)&&delete a.payload.groupId;let t=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>t.has(a.id));i.length===0?delete e.groups:e.groups=i}function Ui(e){if(!e.groups?.length)return;let n=e.elements.filter(r=>!xe(e,r)),t=e.elements.filter(r=>xe(e,r)),i=[],a=new Set;for(let r=n.length-1;r>=0;r--){let o=n[r];if(a.has(o.payload.id))continue;let s=o.payload.groupId;if(s===void 0){i.unshift(o),a.add(o.payload.id);continue}let l=n.filter(d=>d.payload.groupId===s);for(let d=l.length-1;d>=0;d--)i.unshift(l[d]),a.add(l[d].payload.id)}e.elements=[...i,...t],Ln(e)}function jb(e){let n=new Set((e.groups??[]).map(i=>i.name.trim())),t=1;for(;n.has(`Group ${t}`);)t++;return`Group ${t}`}function ql(e,n,t=jb(e)){let i=e.elements.filter(r=>n.includes(r.payload.id)&&!xe(e,r));if(i.length<2)return;let a={id:ie(),name:t,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return $t(e),Ui(e),a.id}function Wi(e,n){for(let t of e.elements)t.payload.groupId===n&&delete t.payload.groupId;$t(e)}function Ga(e,n,t){let i=e.elements.find(a=>a.payload.id===n);!i||xe(e,i)||(t===void 0?delete i.payload.groupId:i.payload.groupId=t,$t(e),Ui(e))}var le={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups","hidden"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","duration","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],chartAnchor:["layer","at","place","dx","dy"],fill:["kind","stops","angle"],fillStop:["at","colorHex"],gaugeTicks:["count","length","colorHex","majorEvery"],gaugeLabels:["show","size","colorHex"],arc:["radius","angle","sweep","spacing","flip"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","opacity","shadow","groupId","name","accentGroup"],shadow:["colorHex","radius","dx","dy"],text:["value","fontSize","fontWeight","countdown","monospacedDigits","lineLimit","fontDesign","fontWidth","italic","minimumScale","alignment","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex","parts","arc","chartAnchor"],textPart:["id","value","colorHex","fontWeight","fontSize","fontDesign","fontWidth","italic","coloring","bands","bandAboveColorHex"],icon:["symbol","path","size","chartAnchor"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","total","minSource","maxSource","fill","ticks","labels"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes","highMarker","lowMarker","curve","fillStyle","fillColorHex","areaFill","barRadius","barCorners","smoothing","gaps","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","pointDots","pointDotSize","pointDotColorHex","gridLines","gridColorHex","zeroLine","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],timeline:["value","historyMinutes","bands","otherColorHex","gap","cornerRadius","timeLabels","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes","drawsTimeLabels"],shape:["kind","cornerRadius","thickness","borderColorHex","borderWidth","fill","chartAnchor"],image:["entity","source","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY","chartAnchor"],tap:["action","openPageId","openPageName","attachedTo","grow"],chartTimes:["chart","timeLabelCount","labelSize","labelColorHex","hourCycle","minutes"],chartDots:["chart","dots","size","colorHex"],chartGrid:["chart","lines","colorHex","thickness"],imageTime:["image","size"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise","partId"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight","design","width","italic"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","backgroundFill","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName","serviceDomain","serviceName","serviceDataJSON"]},Au={literal:["kind","value"],entityState:["kind",...le.entityRef],entityAttribute:["kind",...le.entityRef,"attribute"],entityAge:["kind",...le.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"]};function wo(e){let n=[],t=(d,c,u)=>{if(V(d))for(let p of Object.keys(d))c.includes(p)||n.push(`${u}.${p}`)},i=(d,c)=>{if(!V(d))return;let u=typeof d.kind=="string"?d.kind:"";t(d,Au[u]??["kind"],c),u==="aggregate"&&V(d.aggregate)&&(t(d.aggregate,le.aggregate,`${c}.aggregate`),t(d.aggregate.scope,le.scope,`${c}.aggregate.scope`),V(d.aggregate.scope)&&Array.isArray(d.aggregate.scope.entities)&&d.aggregate.scope.entities.forEach((p,f)=>t(p,le.entityRef,`${c}.aggregate.scope.entities[${f}]`)),t(d.aggregate.stateFilter,le.stateFilter,`${c}.aggregate.stateFilter`))},a=(d,c)=>{if(V(d)){if(V(d.kind))t(d,le.value,c),i(d.kind,`${c}.kind`);else{let u=typeof d.kind=="string"?d.kind:"";t(d,[...Au[u]??["kind"],"format"],c),u==="aggregate"&&i(d,c)}t(d.format,le.format,`${c}.format`)}},r=(d,c)=>{V(d)&&(t(d,le.fill,c),Array.isArray(d.stops)&&d.stops.forEach((u,p)=>t(u,le.fillStop,`${c}.stops[${p}]`)))},o=(d,c)=>{Array.isArray(d)&&d.forEach((u,p)=>{t(u,le.styleChange,`${c}[${p}]`),V(u)&&a(u.value,`${c}[${p}].value`)})},s=(d,c)=>{Array.isArray(d)&&d.forEach((u,p)=>{let f=`${c}[${p}]`;t(u,le.rule,f),V(u)&&(Array.isArray(u.cases)&&u.cases.forEach((g,b)=>{let y=`${f}.cases[${b}]`;t(g,le.case,y),V(g)&&(t(g.when,le.condition,`${y}.when`),V(g.when)&&Array.isArray(g.when.tests)&&g.when.tests.forEach((x,$)=>{let k=`${y}.when.tests[${$}]`;t(x,le.test,k),V(x)&&(a(x.value,`${k}.value`),t(x.comparison,le.comparison,`${k}.comparison`),V(x.comparison)&&(a(x.comparison.value,`${k}.comparison.value`),a(x.comparison.upper,`${k}.comparison.upper`)))}),o(g.then,`${y}.then`))}),o(u.otherwise,`${f}.otherwise`))})};if(!V(e))return n;t(e,le.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((d,c)=>t(d,le.group,`$.groups[${c}]`)),Array.isArray(e.values)&&e.values.forEach((d,c)=>{t(d,le.named,`$.values[${c}]`),V(d)&&a(d.value,`$.values[${c}].value`)}),Array.isArray(e.elements)&&e.elements.forEach((d,c)=>{let u=`$.elements[${c}]`;if(t(d,le.elementEnvelope,u),!V(d)||!V(d.payload))return;let p=typeof d.kind=="string"?d.kind:"",f=le[p]??[];t(d.payload,[...le.elementBase,...f],`${u}.payload`),t(d.payload.colorSlot,le.colorSlot,`${u}.payload.colorSlot`),t(d.payload.frame,le.frame,`${u}.payload.frame`),"chartAnchor"in d.payload&&t(d.payload.chartAnchor,le.chartAnchor,`${u}.payload.chartAnchor`),"shadow"in d.payload&&t(d.payload.shadow,le.shadow,`${u}.payload.shadow`);for(let g of["fill","areaFill"])g in d.payload&&r(d.payload[g],`${u}.payload.${g}`);"ticks"in d.payload&&t(d.payload.ticks,le.gaugeTicks,`${u}.payload.ticks`),"labels"in d.payload&&t(d.payload.labels,le.gaugeLabels,`${u}.payload.labels`),s(d.payload.rules,`${u}.payload.rules`);for(let g of["value","symbol","nowIndex","total","minSource","maxSource"])g in d.payload&&a(d.payload[g],`${u}.payload.${g}`);p==="text"&&"arc"in d.payload&&t(d.payload.arc,le.arc,`${u}.payload.arc`),p==="text"&&Array.isArray(d.payload.parts)&&d.payload.parts.forEach((g,b)=>{t(g,le.textPart,`${u}.payload.parts[${b}]`),V(g)&&a(g.value,`${u}.payload.parts[${b}].value`)}),p==="image"&&t(d.payload.entity,le.entityRef,`${u}.payload.entity`),p==="tap"&&t(d.payload.action,le.tapAction,`${u}.payload.action`)});let l=[];if(Array.isArray(e.perFamily))for(let d=0;d+1<e.perFamily.length;d+=2)l.push([String(e.perFamily[d]),e.perFamily[d+1]]);else V(e.perFamily)&&l.push(...Object.entries(e.perFamily));for(let[d,c]of l){let u=`$.perFamily.${d}`;if(t(c,le.layout,u),!!V(c)){if(V(c.placements))for(let[p,f]of Object.entries(c.placements))t(f,le.placement,`${u}.placements.${p}`),V(f)&&t(f.frame,le.frame,`${u}.placements.${p}.frame`);if(a(c.bezelText,`${u}.bezelText`),a(c.curvedText,`${u}.curvedText`),"backgroundFill"in c&&r(c.backgroundFill,`${u}.backgroundFill`),V(c.bezelGauge)){let p=`${u}.bezelGauge`;t(c.bezelGauge,le.bezelGauge,p),a(c.bezelGauge.value,`${p}.value`),a(c.bezelGauge.minLabel,`${p}.minLabel`),a(c.bezelGauge.maxLabel,`${p}.maxLabel`)}s(c.rules,`${u}.rules`)}}return V(e.inline)&&(t(e.inline,le.inline,"$.inline"),a(e.inline.value,"$.inline.value")),t(e.tapAction,le.tapAction,"$.tapAction"),n}function ie(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let n=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),t=(8+Math.floor(Math.random()*4)).toString(16)+n().slice(1);return`${n()}${n()}-${n()}-4${n().slice(1)}-${t}-${n()}${n()}${n()}`.toUpperCase()}function ln(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function $p(e,n,t=[...dl]){let i={};for(let r of de)t.includes(r)&&(i[r]=ln());let a={schemaVersion:4,id:ie(),name:e,values:[],slotIndex:n,elements:[],supportedFamilies:ba.filter(r=>t.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return t.includes("inline")&&(a.inline={value:U("Text")}),a.schemaVersion=ni(a),a}function Le(e){let n=t=>({id:ie(),colorSlot:{baseColorHex:t},rules:[],frame:{...Fa},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...n("#FFFFFF"),value:U("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...n("#FFFFFF"),symbol:U("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...n("#FFFFFF"),value:U("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40",coloring:"uniform",bands:[],bandAboveColorHex:be,thresholdColorHex:Oi}};case"chart":return{kind:e,payload:{...n("#FFFFFF"),value:U("13,14,16,17,19,22,24,28,30"),historyMinutes:ho,historyPoints:24,source:fl,statPeriod:Ta,statType:Ea,style:"bars",curve:"smooth",fillStyle:"fade",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:lt,lowColorHex:dt,marker:"none",coloring:"uniform",bands:[],bandAboveColorHex:be,fillBands:!1,thresholdColorHex:Tl,nowColorHex:El,timeLabelCount:Xn,labelSize:ct,labelColorHex:ut,labelsAbove:!1,hourCycle:Jn,minutes:Zn}};case"timeline":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,value:U(""),historyMinutes:hb,bands:[],otherColorHex:ub,gap:0,cornerRadius:pb,timeLabelCount:tp,labelSize:ct,labelColorHex:ut,labelsAbove:!1,hourCycle:Jn,minutes:Zn}}}case"shape":return{kind:e,payload:{...n("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,thickness:1,borderWidth:1}};case"image":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},source:"camera",contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:Gi,timestampCorner:"topLeading",timestampSize:yo}}}case"tap":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}case"chartTimes":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",timeLabelCount:Xn,labelSize:ct,labelColorHex:ut,hourCycle:Jn,minutes:Zn}}}case"imageTime":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,image:""}}}case"chartDots":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",dots:"auto"}}}case"chartGrid":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",lines:Sn,colorHex:Zt,thickness:Cn}}}}}function U(e){return{kind:{kind:"literal",value:e}}}function vo(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"timeline":return;case"shape":return;case"image":return;case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return}}var Lu=["circular","corner"],Iu=Math.SQRT1_2;function qb(e){return e==="text"||e==="icon"?4:.5}function ko(e,n,t,i){let a=structuredClone(e),r=ce[n],o=ce[t];if(n===t||!r||!o)return a;let s=Lu.includes(n),l=Lu.includes(t),d=s===l?1:l?Iu:1/Iu,c=Math.min(o.width/r.width,o.height/r.height)*d;if(d!==1){let u=a.frame,p=u.x+u.width/2,f=u.y+u.height/2;a.frame={...u,width:u.width*d,height:u.height*d,x:.5+(p-.5)*d-u.width*d/2,y:.5+(f-.5)*d-u.height*d/2}}return a.size!==void 0&&(a.size=Math.max(qb(i),Math.round(a.size*c*10)/10)),a}function Cp(e,n){let t=e.perFamily[n];return!t||Object.keys(t.placements).length===0?e.elements:e.elements.map(i=>{let a=t.placements[i.payload.id];if(!a)return i;let r={...i.payload,frame:a.frame,isHidden:a.isHidden};return a.size!==void 0&&(i.kind==="text"?r.fontSize=a.size:i.kind==="icon"?r.size=a.size:(i.kind==="gauge"||i.kind==="chart")&&(r.lineWidth=a.size)),{kind:i.kind,payload:r}})}function Ki(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"timeline":return e.payload.value;case"shape":return;case"image":return{kind:{kind:"entityState",...e.payload.entity}};case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return}}function Ca(e){let n=[],t=i=>{for(let a of i)a.value&&n.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)n.push(r.value),r.comparison.value&&n.push(r.comparison.value),r.comparison.upper&&n.push(r.comparison.upper);t(a.then)}i.otherwise&&t(i.otherwise)}return n}var Yl=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function ll(e,n){let t,i=n;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=zl(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return t===void 0?{ref:o}:{ref:o,namedId:t}}if(r.kind!=="named")return;t=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===t)?.value}}function Xl(e,n){return ll(e,Ki(n))?.ref}function Jl(e,n){let t=Xl(e,n),i=t&&(t.domain||t.entityId.split(".")[0])||"";return t&&Yl.includes(i)?{type:"toggleEntity",...t,domain:i}:{type:"refresh"}}function _u(e,n,t){if(xo(n)||t.width<=0||t.height<=0)return{...e};let i=n,a=e.x-i.left/t.width,r=e.x+e.width+i.right/t.width,o=e.y-i.top/t.height,s=e.y+e.height+i.bottom/t.height;return r<a&&(a=r=(a+r)/2),s<o&&(o=s=(o+s)/2),a=bt(a),r=bt(r),o=bt(o),s=bt(s),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,s-o)}}function Sp(e,n,t){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-n.x)*t.width),right:i((n.x+n.width-e.x-e.width)*t.width),top:i((e.y-n.y)*t.height),bottom:i((n.y+n.height-e.y-e.height)*t.height)}}function Tp(e,n,t,i){let a=e.elements.find(p=>p.payload.id===n);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(p=>p.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[t]?.placements[r.payload.id]?.frame??r.payload.frame,s=bt(i.x),l=bt(i.y),d=bt(i.x+i.width),c=bt(i.y+i.height),u={...i,x:s,y:l,width:Math.max(0,d-s),height:Math.max(0,c-l)};a.payload.outset=Sp(o,u,ce[t])}function Ep(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i)return;let a=e.perFamily[t];if(!a)return;let r=a.placements[n]?.frame??i.payload.frame,o=ce[t];return{width:r.width*o.width,height:r.height*o.height}}function et(e,n){return e.elements.filter(t=>t.kind==="tap"&&t.payload.attachedTo===n)}function xe(e,n){return n.kind!=="tap"||n.payload.attachedTo===void 0?!1:e.elements.some(t=>t.payload.id===n.payload.attachedTo&&t.kind!=="tap")}function $o(e,n){let t=e.elements.find(i=>i.payload.id===n);if(t){if(t.kind==="tap"&&t.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===t.payload.attachedTo);if(i)return i.payload.id}return t.payload.id}}function Ln(e){let n=new Map(e.elements.map(a=>[a.payload.id,a])),t=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=n.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let s=t.get(r);s?s.push(a):t.set(r,[a])}if(t.size===0)return;for(let[a,r]of t){let o=n.get(a);for(let s of r){let l=s.payload;l.outset===void 0&&(l.outset=Sp(o.payload.frame,l.frame,ce.rectangular));let d=l.outset,c=!xo(d);s.payload.frame=_u(o.payload.frame,d,ce.rectangular),s.payload.isHidden=o.payload.isHidden;let u=Qb(e,a);for(let p of de){let f=e.perFamily[p];if(!f)continue;let g=ce[p],b=f.placements[a];p!==u||!b?delete f.placements[s.payload.id]:c?f.placements[s.payload.id]={frame:_u(b.frame,d,g),isHidden:b.isHidden}:f.placements[s.payload.id]={frame:{...b.frame},isHidden:b.isHidden}}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=t.get(a.payload.id);r&&i.push(...r)}e.elements=i}function Co(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind==="tap")return;let a=et(e,n)[0];if(a)return a.payload;let r=Le("tap"),o=r.payload;return o.attachedTo=n,o.outset={...Dl},o.action=t??Jl(e,i),e.elements.push(r),Ln(e),o}function So(e,n){let t=et(e,n).map(i=>i.payload.id);if(t.length!==0){e.elements=e.elements.filter(i=>!t.includes(i.payload.id));for(let i of de)for(let a of t)delete e.perFamily[i]?.placements[a]}}function ke(e,n){for(let a of Hn(e,n))ke(e,a.payload.id);for(let a of An(e,n))ke(e,a.payload.id);for(let a of ci(e,n))ke(e,a.payload.id);for(let a of ui(e,n))ke(e,a.payload.id);for(let a of Bl(e,n))ke(e,a.payload.id);for(let a of Ke(e,n))delete a.payload.chartAnchor;let t=e.elements.find(a=>a.payload.id===n);So(e,n),e.elements=e.elements.filter(a=>a.payload.id!==n);let i=t?.payload.chartAnchor;if(i&&(i.at==="threshold"||i.at==="now")&&!Ke(e,i.layer).some(a=>a.payload.chartAnchor?.at===i.at)){let a=e.elements.find(r=>r.payload.id===i.layer);a?.kind==="chart"&&(i.at==="threshold"?(delete a.payload.thresholdValue,delete a.payload.drawsThreshold):(delete a.payload.nowIndex,delete a.payload.drawsNowLine))}for(let a of e.elements)a.kind==="chart"&&a.payload.scaleFrom===n&&delete a.payload.scaleFrom;for(let a of de)delete e.perFamily[a]?.placements[n];Ln(e),$t(e),t&&Xb(e,t.payload.groupId,Yb(t))}function Yb(e){if(e.payload.chartAnchor)return e.payload.chartAnchor.layer;switch(e.kind){case"text":return e.payload.value.kind.kind==="chartStat"?e.payload.value.kind.layer:void 0;case"chartTimes":return e.payload.chart;case"chartDots":return e.payload.chart;case"chartGrid":return e.payload.chart;case"imageTime":return e.payload.image;default:return}}function Xb(e,n,t){if(n===void 0||t===void 0||!e.groups?.some(a=>a.id===n))return;let i=mt(e,n);i.length===1&&i[0].payload.id===t&&Wi(e,n)}function Fp(e,n){let t=e.elements.findIndex(l=>l.payload.id===n),i=e.elements[t];if(!i)return;let a=ie(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],s=[[n,a]];for(let l of et(e,n)){let d=structuredClone(l);d.payload.id=ie(),d.payload.attachedTo=a,o.push(d),s.push([l.payload.id,d.payload.id])}e.elements.splice(t+1,0,...o);for(let l of de){let d=e.perFamily[l];if(d)for(let[c,u]of s){let p=d.placements[c];p&&(d.placements[u]=structuredClone(p))}}return Ln(e),a}function Jb(e,n){let t=/^(.*\S) \d+$/.exec(e)?.[1]??e,i=new Set(n),a=2;for(;i.has(`${t} ${a}`);)a++;return`${t} ${a}`}function Mp(e,n,t){let i=e.elements.findIndex(s=>s.payload.id===n),a=e.elements[i];if(!a||a.kind!=="chart")return;let r=ie(),o=structuredClone(a);o.payload.id=r,o.payload.scaleFrom=n,t&&(o.payload.name=Jb(t(a),e.elements.map(t))),e.elements.splice(i+1,0,o);for(let s of de){let l=e.perFamily[s],d=l?.placements[n];l&&d&&(l.placements[r]=structuredClone(d))}return r}function ji(e,n,t){let i=new Set,a=d=>{i.add(d);for(let c of et(e,d))i.add(c.payload.id)};for(let d of n){a(d);for(let c of Hn(e,d))a(c.payload.id)}let r=e.elements.filter(d=>i.has(d.payload.id)).map(d=>structuredClone(d)),o={};for(let d of de){let c=e.perFamily[d];if(!c)continue;let u={};for(let p of r){let f=c.placements[p.payload.id];f&&(u[p.payload.id]=structuredClone(f))}Object.keys(u).length>0&&(o[d]=u)}let s=new Set(r.map(d=>d.payload.groupId).filter(d=>d!==void 0)),l=(e.groups??[]).filter(d=>s.has(d.id)).map(d=>structuredClone(d));return{elements:r,placements:o,groups:l,...t!==void 0?{family:t}:{}}}function Rp(e,n,t){let i=n.family,a=i!==void 0&&i!==t&&rl(i);if(!rl(t))return ti(e,n);let r=ti(e,n,a?{nudge:!1}:{}),o=e.perFamily[t]??(e.perFamily[t]=ln());for(let s of r){let l=e.elements.find(p=>p.payload.id===s);if(!l)continue;let d=(i!==void 0?e.perFamily[i]?.placements[s]:void 0)??de.map(p=>e.perFamily[p]?.placements[s]).find(p=>p!==void 0),c=d?.size??vo(l),u={frame:{...d?.frame??l.payload.frame},isHidden:!1,...c!==void 0?{size:c}:{}};for(let p of de)p!==t&&delete e.perFamily[p]?.placements[s];o.placements[s]=a?ko(u,i,t,l.kind):u}return qi(e,t),r}function ti(e,n,t={}){let i=new Map;for(let d of n.elements)i.set(d.payload.id,ie());let a=new Set(e.elements.map(d=>d.payload.id)),r=t.nudge!==!1&&n.elements.some(d=>a.has(d.payload.id)),o=d=>r?{...d,x:Math.min(.9,d.x+.05),y:Math.min(.9,d.y+.05)}:d,s=[];for(let d of n.elements){let c=structuredClone(d);if(c.payload.id=i.get(d.payload.id),c.kind==="tap"&&c.payload.attachedTo!==void 0){let u=i.get(c.payload.attachedTo);u?c.payload.attachedTo=u:delete c.payload.attachedTo}if(c.kind==="chart"&&c.payload.scaleFrom!==void 0){let u=i.get(c.payload.scaleFrom);u?c.payload.scaleFrom=u:a.has(c.payload.scaleFrom)||delete c.payload.scaleFrom}if(c.kind==="text")for(let u of c.payload.parts??[]){let p=u.value.kind,f=p.kind==="chartStat"?i.get(p.layer):void 0;p.kind==="chartStat"&&f&&(p.layer=f)}if(c.kind==="text"&&c.payload.value.kind.kind==="chartStat"){let u=i.get(c.payload.value.kind.layer);if(u)c.payload.value.kind.layer=u;else if(!a.has(c.payload.value.kind.layer))continue}if(c.kind==="chartTimes"||c.kind==="chartDots"||c.kind==="chartGrid"){let u=i.get(c.payload.chart);if(u)c.payload.chart=u;else if(!a.has(c.payload.chart))continue}if(c.kind==="imageTime"){let u=i.get(c.payload.image);if(u)c.payload.image=u;else if(!a.has(c.payload.image))continue}if(c.payload.chartAnchor!==void 0){let u=i.get(c.payload.chartAnchor.layer);u?c.payload.chartAnchor.layer=u:a.has(c.payload.chartAnchor.layer)||delete c.payload.chartAnchor}c.payload.frame=o(c.payload.frame),s.push(c)}let l=new Map;for(let d of n.groups){if(s.filter(p=>p.payload.groupId===d.id&&!(p.kind==="tap"&&p.payload.attachedTo!==void 0)).length<2)continue;let u=ie();l.set(d.id,u),(e.groups??=[]).push({...structuredClone(d),id:u})}for(let d of s){if(d.payload.groupId===void 0)continue;let c=l.get(d.payload.groupId);c?d.payload.groupId=c:delete d.payload.groupId}e.elements.push(...s);for(let d of de){let c=n.placements[d],u=e.perFamily[d];if(!(!c||!u))for(let[p,f]of Object.entries(c)){let g=i.get(p);g&&s.some(b=>b.payload.id===g)&&(u.placements[g]={...structuredClone(f),frame:o(f.frame)})}}return Ln(e),$t(e),Ui(e),s.filter(d=>!xe(e,d)).map(d=>d.payload.id)}function Zb(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?!a.isHidden:!t.payload.isHidden}function Qb(e,n){let t=e.elements.find(r=>r.payload.id===n),a=(t&&t.kind==="tap"?t.payload.attachedTo:void 0)??n;return de.find(r=>e.supportedFamilies.includes(r)&&e.perFamily[r]?.placements[a]!==void 0)}function gt(e,n){let t=e.perFamily[n];return t?e.elements.filter(i=>{let a=i.kind==="tap"?i.payload.attachedTo:void 0;return t.placements[a??i.payload.id]!==void 0}):[]}function Hp(e,n){let t=e.perFamily[n];return t?gt(e,n).filter(i=>!xe(e,i)&&!t.placements[i.payload.id]?.isHidden).length:0}function qi(e,n){let t=de.filter(s=>e.supportedFamilies.includes(s));if(t.length===0)return;let i=n!==void 0&&rl(n)&&t.includes(n)?n:t[0];for(let s of t)e.perFamily[s]||(e.perFamily[s]=ln());let a=()=>e.elements.filter(s=>!xe(e,s)),r=new Map,o=new Set;if(n===void 0){let s=new Map(a().map(p=>[p.payload.id,t.filter(f=>Zb(e,f,p))]));for(let[p,f]of s)f[0]&&r.set(p,f[0]);let l=new Map([...a().entries()].map(([p,f])=>[f.payload.id,p]));for(let p of t){let f=a().filter(y=>(s.get(y.payload.id)??[]).includes(p)&&r.get(y.payload.id)!==p).map(y=>y.payload.id);if(f.length===0)continue;let g=ji(e,f,p),b=ti(e,g,{nudge:!1});b.forEach((y,x)=>{r.set(y,p);let $=b.length===f.length?f[x]:void 0;l.set(y,$!==void 0?l.get($)??0:l.size)})}for(let p of a())r.has(p.payload.id)||o.add(p.payload.id);let d=p=>t.indexOf(r.get(p)??i),c=a().sort((p,f)=>d(p.payload.id)-d(f.payload.id)||(l.get(p.payload.id)??0)-(l.get(f.payload.id)??0)),u=[];for(let p of c)u.push(p),u.push(...et(e,p.payload.id));e.elements=u}for(let s of a()){let l=s.payload.id,d=t.filter(f=>e.perFamily[f].placements[l]!==void 0),c=r.get(l)??d.find(f=>!e.perFamily[f].placements[l].isHidden)??d[0]??i,u=e.perFamily[c]?.placements[l],p={frame:{...u?.frame??s.payload.frame},isHidden:o.has(l)||u?.isHidden===!0,...u?.size!==void 0?{size:u.size}:{}};s.payload.isHidden=!0;for(let f of de){let g=e.perFamily[f];g&&(f===c?g.placements[l]=p:delete g.placements[l])}}}function To(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t)return[];let i=[],a=ll(e,Ki(t));if(a){let r=t.kind==="icon"?"symbol":t.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of et(e,n)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of t.payload.rules)for(let o of r.cases)for(let s of o.when.tests){let l=ll(e,s.value);if(!l)continue;let d={where:"test",ref:l.ref,ruleId:r.id,caseId:o.id,testId:s.id};l.namedId!==void 0&&(d.namedId=l.namedId),i.push(d)}return i}function al(e,n,t){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...n}};case"entityAge":return{...e,kind:{kind:"entityAge",...n}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...n,attribute:i.attribute}};case"literal":return t==="text"||t==="gauge"||t==="chart"||t==="timeline"?{...e,kind:{kind:"entityState",...n}}:void 0;default:return}}function Ap(e,n,t,i){let a=e.elements.find(o=>o.payload.id===n);if(!a||t.entityId==="")return;let r={...t,domain:t.domain||t.entityId.split(".")[0]||""};if(a.kind==="timeline"){let o=a.payload.value.kind.kind==="entityState"?a.payload.value.kind.entityId:void 0,s=al(a.payload.value,r,a.kind);s&&(a.payload.value=s),(a.payload.bands.length===0||o!==r.entityId)&&(a.payload.bands=Nl(r.domain,i))}else if(a.kind==="image")a.payload.entity=r;else if(a.kind==="text"||a.kind==="gauge"||a.kind==="chart"){let o=al(a.payload.value,r,a.kind);o&&(a.payload.value=o)}else if(a.kind==="icon"){let o=al(a.payload.symbol,r,a.kind);o&&(a.payload.symbol=o)}for(let o of et(e,n)){let s=o.payload;"entityId"in s.action&&(s.action={type:s.action.type,...r})}}var ex={text:"text",icon:"icon",gauge:"gauge",chart:"chart",timeline:"timeline",shape:"shape",image:"picture",tap:"tap area",chartTimes:"clock times",chartDots:"chart dots",chartGrid:"chart grid",imageTime:"timestamp"};function Nu(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function Du(e){if(e.part==="template")return"Template text";if(e.part==="serviceData")return"Service data";let n=e.layerKind===void 0?"":ex[e.layerKind],t=e.layerName?`${n} "${e.layerName}"`:n;switch(e.kind){case"named":return e.valueName?`Shared value "${e.valueName}"`:"Shared value";case"layer":case"image":return e.part==="total"?`Total on ${t}`:e.part==="gaugeMin"?`Min on ${t}`:e.part==="gaugeMax"?`Max on ${t}`:e.part==="nowIndex"?`Now marker on ${t}`:e.part==="textPart"?`Part of ${t}`:`${Nu(n)} layer${e.layerName?` "${e.layerName}"`:""}`;case"tap":return"Tap area";case"documentTap":return"Tap action";case"rule":return t===""?`Rule on the ${e.family??"shared"} shape`:`Rule on ${t}`;case"layout":{let i=Nu(e.family??"");switch(e.part){case"curvedText":return`${i} curved text`;case"bezelGauge":return`${i} bezel gauge`;case"bezelGaugeMin":return`${i} bezel gauge low label`;case"bezelGaugeMax":return`${i} bezel gauge high label`;default:return`${i} bezel`}}case"inline":return"Inline"}}var Lp=/(['"])([a-z0-9_]+\.[a-z0-9_]+)\1/g;function Ip(e){let n=[];for(let t of e.matchAll(Lp))t[2]!==void 0&&n.push(t[2]);return n}function Zl(e,n){return n.size===0?e:e.replace(Lp,(t,i,a)=>{let r=n.get(a);return r===void 0?t:`${i}${r}${i}`})}function ya(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function tx(e,n){if(n.payload.name)return n.payload.name;if(n.kind==="shape")return n.payload.kind==="roundedRectangle"?"rounded rectangle":n.payload.kind;if(n.kind==="tap")return"";if(n.kind==="image")return n.payload.entity.displayName||n.payload.entity.entityId;let t=Ki(n)?.kind;if(t===void 0)return"";if(t.kind==="literal")return t.value;if("entityId"in t)return t.displayName||t.entityId;if(t.kind==="named"){let i=t.id.toUpperCase();return e.values.find(a=>a.id.toUpperCase()===i)?.name??""}return""}function Ba(e,n){let t=(r,o)=>{n.value?.(r,o);let s=r.kind;if(s.kind==="jinja"){if(n.text){let d=n.text(s.value,{...o,part:"template"});d!==s.value&&(s.value=d)}return}if(s.kind==="aggregate"){let d=s.aggregate.scope;if(n.ref&&d.kind==="entities")for(let c=0;c<d.entities.length;c++){let u=n.ref(ya(d.entities[c]),o);u&&(d.entities[c]=u)}return}if(!n.ref||!("entityId"in s))return;let l=n.ref(ya(s),o);l&&(s.kind==="entityAttribute"?r.kind={kind:"entityAttribute",...l,attribute:s.attribute}:s.kind==="entityState"?r.kind={kind:"entityState",...l}:r.kind={kind:"entityAge",...l})},i=(r,o,s)=>{if(r.type==="callService"){if(n.ref&&r.target!==void 0&&r.target.entityId!==""){let d=n.ref(ya(r.target),o);d&&(r.target=d)}if(n.text&&r.serviceDataJSON!==void 0){let d=n.text(r.serviceDataJSON,{...o,part:"serviceData"});d!==r.serviceDataJSON&&(r.serviceDataJSON=d)}return}if(!n.ref||!("entityId"in r)||r.entityId==="")return;let l=n.ref(ya(r),o);l&&s({type:r.type,...l})};for(let r of e.values)t(r.value,{kind:"named",valueId:r.id,valueName:r.name});for(let r of e.elements){let o={kind:"layer",layerId:r.payload.id,layerKind:r.kind,layerName:tx(e,r)};if(r.kind==="image"){if(n.ref){let l=n.ref(ya(r.payload.entity),{...o,kind:"image"});l&&(r.payload.entity=l)}}else if(r.kind==="tap"){let l=r.payload;i(l.action,{...o,kind:"tap"},d=>{l.action=d})}else{let l=Ki(r);if(l&&t(l,o),r.kind==="text")for(let d of r.payload.parts??[])t(d.value,{...o,part:"textPart"});r.kind==="gauge"&&r.payload.total&&t(r.payload.total,{...o,part:"total"}),r.kind==="gauge"&&r.payload.minSource&&t(r.payload.minSource,{...o,part:"gaugeMin"}),r.kind==="gauge"&&r.payload.maxSource&&t(r.payload.maxSource,{...o,part:"gaugeMax"}),r.kind==="chart"&&r.payload.nowIndex&&t(r.payload.nowIndex,{...o,part:"nowIndex"})}let s={...o,kind:"rule"};for(let l of Ca(r.payload.rules))t(l,s)}let a=Object.keys(e.perFamily).sort((r,o)=>{let s=ba.indexOf(r),l=ba.indexOf(o);return(s<0?ba.length:s)-(l<0?ba.length:l)});for(let r of a){let o=e.perFamily[r];if(!o)continue;let s={kind:"layout",family:r};o.bezelText&&t(o.bezelText,{...s,part:"bezelText"}),o.curvedText&&t(o.curvedText,{...s,part:"curvedText"});let l=o.bezelGauge;l&&(t(l.value,{...s,part:"bezelGauge"}),l.minLabel&&t(l.minLabel,{...s,part:"bezelGaugeMin"}),l.maxLabel&&t(l.maxLabel,{...s,part:"bezelGaugeMax"}));let d={kind:"rule",family:r};for(let c of Ca(o.rules))t(c,d)}e.inline&&t(e.inline.value,{kind:"inline"}),i(e.tapAction,{kind:"documentTap"},r=>{e.tapAction=r})}function Ct(e,n){Ba(e,{value:n})}function _p(e,n){return e.kind.kind==="named"&&e.kind.id.toUpperCase()===n.toUpperCase()}function Va(e,n){let t=new Set;return Ct(e,(i,a)=>{_p(i,n)&&t.add(a.layerId??`${a.kind}:${a.valueId??""}:${a.family??""}:${a.part??""}`)}),t.size}function nx(e,n){let t=new Set(e.values.map(a=>a.name.trim().toLowerCase())),i=n.trim()||"Value";if(!t.has(i.toLowerCase()))return i;for(let a=2;;a++){let r=`${i} ${a}`;if(!t.has(r.toLowerCase()))return r}}function Ql(e,n,t){let i={id:ie(),name:nx(e,t),value:{kind:structuredClone(n.kind)}},a={kind:{kind:"named",id:i.id}};return n.format&&!Ve(n.format)&&(a.format=structuredClone(n.format)),{named:i,ref:a}}function ed(e,n){if(n.kind.kind!=="named")return;let t=n.kind.id,i=e.values.find(o=>o.id.toUpperCase()===t.toUpperCase());if(!i)return;let a=n.format&&!Ve(n.format)?n.format:i.value.format,r={kind:structuredClone(i.value.kind)};return a&&!Ve(a)&&(r.format=structuredClone(a)),r}function td(e,n){Ct(e,t=>{if(!_p(t,n))return;let i=ed(e,t);i&&(t.kind=i.kind,i.format?t.format=i.format:delete t.format)}),e.values=e.values.filter(t=>t.id.toUpperCase()!==n.toUpperCase())}function nd(e,n){Ba(e,{ref:n})}function Yi(e,n){Ba(e,{text:n})}function id(e,n){let t=[],i={ref:(a,r)=>{a.entityId!==""&&t.push({entityId:a.entityId,ref:a,where:Du(r)})}};return n&&(i.text=(a,r)=>{for(let o of Ip(a)){let s=o.split(".")[0]??"";n(o,s)&&t.push({entityId:o,ref:{entityId:o,displayName:"",domain:s},where:Du(r)})}return a}),Ba(e,i),t}function ad(e,n,t){let i=new Set,a=new Set,r=s=>{s.kind==="named"&&s.valueId!==void 0?a.add(s.valueId.toUpperCase()):s.layerId!==void 0&&i.add(s.layerId)},o={ref:(s,l)=>{s.entityId===n&&r(l)}};t&&(o.text=(s,l)=>{for(let d of Ip(s))d===n&&t(d,d.split(".")[0]??"")&&r(l);return s}),Ba(e,o);for(let s=a.size>0;s;)s=!1,Ct(e,(l,d)=>{if(!(l.kind.kind!=="named"||!a.has(l.kind.id.toUpperCase())))if(d.kind==="named"&&d.valueId!==void 0){let c=d.valueId.toUpperCase();a.has(c)||(a.add(c),s=!0)}else d.layerId!==void 0&&i.add(d.layerId)});return Dp(e,i)}function Np(e,n){let t=new Set([n.toUpperCase()]),i=new Set;for(let a=!0;a;)a=!1,Ct(e,(r,o)=>{if(!(r.kind.kind!=="named"||!t.has(r.kind.id.toUpperCase())))if(o.kind==="named"&&o.valueId!==void 0){let s=o.valueId.toUpperCase();t.has(s)||(t.add(s),a=!0)}else o.layerId!==void 0&&i.add(o.layerId)});return Dp(e,i)}function Dp(e,n){let t=new Set;for(let i of e.elements)n.has(i.payload.id)&&t.add(xe(e,i)&&i.kind==="tap"?i.payload.attachedTo:i.payload.id);return e.elements.map(i=>i.payload.id).filter(i=>t.has(i))}var Ua={text:["color","opacity","text","fontSize","fontWeight","fontDesign","fontWidth","italic","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],timeline:["opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],chartTimes:["opacity","rotation","visibility"],chartDots:["opacity","visibility"],chartGrid:["opacity","visibility"],imageTime:["opacity","rotation","visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},Pp=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","timeBetween","contains","startsWith","endsWith","matchesRegex","isOneOf"];function pi(e){let n=e.trim();return/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(n)?n:void 0}function hi(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"timeBetween":return"times";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function Eo(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setFontDesign":return"design";case"setFontWidth":return"width";case"setItalic":return"italic";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function rd(){return{id:ie(),value:U(""),comparison:{kind:"isOn"}}}function od(){return{id:ie(),when:{join:"all",tests:[rd()]},then:[]}}function Wa(){return{id:ie(),cases:[od()]}}function Pu(e,n){return e&&(e.kind.kind!=="literal"||pi(e.kind.value)!==void 0)?e:U(n)}function sd(e,n){let t={kind:n};switch(hi(n)){case"value":t.value=e.value??U("");break;case"between":t.value=e.value??U(""),t.upper=e.upper??U("");break;case"times":t.value=Pu(e.value,"22:00"),t.upper=Pu(e.upper,"06:00");break;case"pattern":t.pattern=e.pattern??"";break;case"options":t.options=e.options??[];break;case"none":break}return t}function fi(e){let n={kind:e};switch(Eo(e)){case"value":n.value=U(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":n.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":n.weight="bold";break;case"design":n.design="rounded";break;case"width":n.width="condensed";break;case"italic":n.italic=!0;break;case"none":break}return n}var St="wrist_assistant/complications";async function zp(e){return e.connection.sendMessagePromise({type:"wrist_assistant/gallery_key"})}async function Op(e){return e.connection.sendMessagePromise({type:`${St}/owners`})}async function Gp(e,n){return e.connection.sendMessagePromise({type:`${St}/list`,owner_watch_id:n})}async function Bp(e,n){return e.connection.sendMessagePromise({type:`${St}/nudge`,owner_watch_id:n})}async function Vp(e,n){return e.connection.sendMessagePromise({type:`${St}/watch_status`,owner_watch_id:n})}async function ld(e,n,t,i){return e.connection.sendMessagePromise({type:`${St}/save`,owner_watch_id:n,document:t,base_revision:i})}async function Up(e,n,t,i){return e.connection.sendMessagePromise({type:`${St}/delete`,owner_watch_id:n,complication_id:t,base_revision:i})}async function Wp(e,n,t){return e.connection.sendMessagePromise({type:`${St}/move_owner`,source_owner_watch_id:n,target_owner_watch_id:t})}function Kp(e,n,t){let i={type:`${St}/subscribe`};return n&&(i.owner_watch_id=n),e.connection.subscribeMessage(t,i)}async function jp(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${St}/render_values`,templates:n})).results}async function qp(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${St}/history_series`,requests:n})).results}function ix(e){return{entity_id:e.entityId,minutes:e.minutes,points:e.points,...e.mode==="states"?{mode:"states"}:{},...e.gaps?{gaps:!0}:{}}}function ax(e){return{entity_id:e.entityId,minutes:e.minutes,period:e.period,type:e.type,...e.gaps?{gaps:!0}:{}}}function Yp(e){let n=new Map,t=new Map;for(let[i,a]of Object.entries(e))a.ok&&(n.set(i,a.series),typeof a.readings=="number"&&t.set(i,{readings:a.readings,averaged:a.averaged===!0}));return{series:n,readings:t}}async function Xp(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${St}/statistics_series`,requests:n})).results}function dd(e,n=()=>!0){let t={};for(let a of Ll(e))n(a.entityId)&&(t[a.key]=ix(a));let i={};for(let a of Il(e))n(a.entityId)&&(i[a.key]=ax(a));return{history:t,statistics:i,signature:JSON.stringify([t,i])}}var Fo="shared:";function cd(e){return Fo+e.toUpperCase()}function Zp(e){return e.values.filter(n=>n.value.kind.kind!=="entityState"&&Va(e,n.id)>0)}function Qp(e,n){return n.size===0?e:e.map(t=>{let i=n.get(cd(t.id));if(i===void 0)return t;let a={kind:{kind:"literal",value:i}};return t.value.format&&(a.format=t.value.format),{...t,value:a}})}var rx=["unavailable","unknown"],ox={automation:["on","off"],script:["on","off"],remote:["on","off"],update:["on","off"],timer:["idle","active","paused"],sun:["above_horizon","below_horizon"],valve:["open","closed","opening","closing"],lawn_mower:["mowing","docked","paused","returning","error"],weather:["sunny","clear-night","partlycloudy","cloudy","rainy","pouring","snowy","snowy-rainy","fog","windy","windy-variant","lightning","lightning-rainy","hail","exceptional"]},sx=new Set(["\xB0C","\xB0F"]);function Jp(e){return Array.isArray(e)&&e.length>0&&e.every(n=>typeof n=="string")?e:void 0}function Ka(e){let n=typeof e=="number"?e:typeof e=="string"&&e.trim()!==""?Number(e):NaN;return Number.isFinite(n)?n:void 0}function lx(e){let n=e?.trim().match(/\.(\d+)$/)?.[1]?.length??0;return n===0?1:10**-Math.min(n,4)}function dx(e){let n=10**Math.floor(Math.log10(e));return([1,2,2.5,5,10].find(i=>i*n>=e)??10)*n}function cx(e){let n=new Set,t=[];for(let i of e)i===void 0||i===""||n.has(i)||(n.add(i),t.push(i));return t}function eh(e,n,t){let i=e.split(".")[0]??"",a=n?.attributes??{},o=Jp(a.options)??(i==="climate"?Jp(a.hvac_modes):void 0)??Oa[i]??ox[i];if(o)return{kind:"choice",options:cx([...o,n?.state,t,...rx])};let s=Ka(n?.state),l=typeof a.unit_of_measurement=="string"?a.unit_of_measurement:void 0;if(s===void 0&&l===void 0&&i!=="input_number"&&i!=="number")return{kind:"text"};let d=Ka(t),c=Ka(a.min),u=Ka(a.max),p=Ka(a.step),f,g;if(c!==void 0&&u!==void 0&&u>c)f=c,g=u;else if(l==="%")f=0,g=100;else{let y=dx(Math.max(Math.abs(s??0)*2,10));f=(s??0)<0||l!==void 0&&sx.has(l)?-y:0,g=y}d!==void 0&&(f=Math.min(f,d),g=Math.max(g,d));let b=p!==void 0&&p>0?p:lx(n?.state);return{kind:"number",min:f,max:g,step:b}}function nh(e){if(e.deviceKind==="iphone")return ux(e);if(e.appliedToken===void 0)return{kind:"unsupported"};if(e.token===e.appliedToken){let n=!e.polling&&typeof e.lastPollSeconds=="number"?e.lastPollSeconds:void 0;return n===void 0?{kind:"sent"}:{kind:"sent",awaySeconds:n}}return e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function ux(e){if(e.appliedToken===void 0||e.token!==e.appliedToken)return{kind:"openApp"};let n=typeof e.lastSyncSeconds=="number"?e.lastSyncSeconds:void 0;return n===void 0?{kind:"sent",device:"iphone"}:{kind:"sent",awaySeconds:n,device:"iphone"}}function th(e){if(e<60)return"just now";let n=Math.floor(e/60);if(n<60)return`${n} min ago`;let t=Math.floor(n/60);if(t<24)return`${t} h ago`;let i=Math.floor(t/24);return`${i} ${i===1?"day":"days"} ago`}function ih(e){switch(e.kind){case"unsupported":return{label:"Update the watch app",note:"to receive this",title:"This watch has never reported which changes it applied, so nothing saved here can reach it. Its Wrist Assistant app is older than custom complications, or it has not been opened on this home yet.",resend:!1};case"sent":return e.device==="iphone"?e.awaySeconds===void 0?{label:"On iPhone",title:"This iPhone has applied every change here.",resend:!1}:{label:"On iPhone",note:`last sync ${th(e.awaySeconds)}`,title:"This iPhone has applied every change here, as of its last sync. A save made after this reaches the lock screen when the app is opened, or on the widget's own refresh.",resend:!1}:e.awaySeconds===void 0?{label:"On watch",title:"The watch has applied every change here.",resend:!1}:{label:"On watch",note:`last seen ${th(e.awaySeconds)}`,title:"The watch has applied every change here, but it is not listening now. A save made after this will not reach it until the watch app is open on this home again.",resend:!1};case"openApp":return{label:"Open Wrist Assistant on your iPhone to sync",title:"Nothing here can be pushed to an iPhone. It pulls when the app is opened, when Sync now is tapped in the app, and on the lock screen widget's own refresh.",resend:!1};case"sending":return{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1};case"waiting":return{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0}}}function rh(e){let n=new TextEncoder().encode(e),t=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of n)t^=BigInt(r),t=t*i&a;return t.toString(16)}function oh(e){return new Map(e.map(n=>[n.id.toUpperCase(),n.value]))}function ah(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Xi(e,n,t=0){let i=n instanceof Map?n:oh(n),a=e.kind;if(a.kind==="named"){if(t>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?Xi(o,i,t+1):ah(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!ah(a))return;let r=ja(a);if(r!==void 0)return"e_"+rh(r)}function Tt(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function px(e){let n;if(e.scope.kind==="entities")n=`expand([${e.scope.entities.map(o=>Tt(o.entityId)).join(", ")}])`;else{let{domains:o,areaIds:s,labelIds:l,floorIds:d}=e.scope;if(!(s.length+l.length+d.length>0))n=o.length===0?"[]":"("+o.map(u=>`(states.${u} | list)`).join(" + ")+")";else{let u=[];for(let p of s)u.push(`area_entities(${Tt(p)})`);for(let p of l)u.push(`label_entities(${Tt(p)})`);d.length>0&&u.push(`((${d.map(p=>`floor_areas(${Tt(p)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),n=`(expand(${u.join(" + ")})`,o.length>0&&(n+=` | selectattr('domain', 'in', [${o.map(Tt).join(", ")}])`),n+=")"}}let t=n,i=e.stateFilter;if(i&&(i.kind==="isOn"?t+=" | selectattr('state', 'eq', 'on')":i.kind==="isOff"?t+=" | selectattr('state', 'eq', 'off')":i.kind==="equals"?t+=` | selectattr('state', 'eq', ${Tt(i.value)})`:t+=` | rejectattr('state', 'eq', ${Tt(i.value)})`),e.function==="count")return`(${t} | list | count)`;let a=e.attribute?`attributes.${e.attribute}`:"state",r=`${t} | map(attribute=${Tt(a)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${r} | sum)`;case"average":return`(${r} | average(0))`;case"min":return`(${r} | min(default=0))`;case"max":return`(${r} | max(default=0))`}}function ja(e){switch(e.kind){case"entityAttribute":return`state_attr(${Tt(e.entityId)}, ${Tt(e.attribute)})`;case"entityAge":{let n=Tt(e.entityId);return`(((now() - states[${n}].last_changed).total_seconds() if states[${n}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return px(e.aggregate);default:return}}function qa(e){let n=new Map,t=new Map,i=oh(e.values),a=(o,s=0)=>{let l=o.kind;switch(l.kind){case"literal":case"dataAge":case"chartStat":return;case"entityState":n.set(l.entityId,l);return;case"named":{if(s>8)return;let d=i.get(l.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,s+1);return}if(d.kind.kind==="entityState"){n.set(d.kind.entityId,d.kind);return}let c=ja(d.kind);if(c===void 0)return;t.set("n_"+l.id.toLowerCase().replace(/-/g,""),c);return}default:{let d=ja(l);if(d===void 0)return;t.set("e_"+rh(d),d)}}};for(let o of e.values)a({kind:{kind:"named",id:o.id}});for(let o of e.elements){let s=Ki(o);if(s&&a(s),o.kind==="text")for(let l of o.payload.parts??[])a(l.value);o.kind==="gauge"&&o.payload.total&&a(o.payload.total),o.kind==="gauge"&&o.payload.minSource&&a(o.payload.minSource),o.kind==="gauge"&&o.payload.maxSource&&a(o.payload.maxSource),o.kind==="chart"&&o.payload.nowIndex&&a(o.payload.nowIndex);for(let l of Ca(o.payload.rules))a(l)}for(let o of de){if(!e.supportedFamilies.includes(o))continue;let s=e.perFamily[o];if(s){s.bezelText&&a(s.bezelText),s.curvedText&&a(s.curvedText),s.bezelGauge&&(a(s.bezelGauge.value),s.bezelGauge.minLabel&&a(s.bezelGauge.minLabel),s.bezelGauge.maxLabel&&a(s.bezelGauge.maxLabel));for(let l of Ca(s.rules))a(l)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let r={entities:n,expressions:t};return t.size>0&&(r.document=hx(t)),r}function hx(e){let n=[...e.keys()].sort(),t=[];for(let a of n){let r=e.get(a);r.includes("{{")||r.includes("{%")?t.push(`{% set v_${a} %}${r}{% endset %}`):t.push(`{% set v_${a} = ${r} %}`)}let i=n.map(a=>`"${a}": v_${a}`).join(", ");return t.push(`{{ { ${i} } | to_json }}`),t.join(`
`)}function sh(e){let n;try{n=JSON.parse(e)}catch{return}if(typeof n!="object"||n===null||Array.isArray(n))return;let t=new Map,i=new Set;for(let[a,r]of Object.entries(n))r===null?i.add(a):t.set(a,fx(r));return{values:t,nullKeys:i}}function fx(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function ud(e){let n=qa(e),t=[...n.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));return n.document&&t.push({kind:"template",value:n.document}),t}function mx(e,n){let t=e.holes.length===0?e.values:e.values.filter((i,a)=>!e.holes[a]);if(t.length!==0)switch(n){case"latest":return t[t.length-1];case"highest":return Math.max(...t);case"lowest":return Math.min(...t);case"average":return t.reduce((i,a)=>i+a,0)/t.length;case"top":return e.domainMax;case"bottom":return e.domainMin;case"first":return t[0];case"delta":return t[t.length-1]-t[0];case"sum":return t.reduce((i,a)=>i+a,0);case"trend":{let i=t[t.length-1]-t[0],a=Number(Da(i,e.domainMax-e.domainMin));return a>0?1:a<0?-1:0}}}var gx=10800;function yx(e,n,t){let i=n==="always"||n==="auto"&&t<=gx;return new Intl.DateTimeFormat(void 0,{hour:"numeric",...i?{minute:"2-digit"}:{},...e==="h12"?{hourCycle:"h12"}:{},...e==="h24"?{hourCycle:"h23"}:{}})}function Mo(e,n,t,i,a){if(e<=0||n.length===0)return[];let r=yx(t,i,e);return n.map(o=>({position:o,text:r.format(new Date(a-e*1e3*(1-o)))}))}function bx(e,n){return Qe(e)===void 0?[]:Mo(kt(e)*60,za(e.timeLabelCount),e.hourCycle,e.minutes,n)}function xx(e,n){return si(e)?Mo(Math.round(e.historyMinutes)*60,za(Mt(e.timeLabelCount)),e.hourCycle,e.minutes,n):[]}function wx(e,n,t,i){return n===void 0&&i!==void 0?Qe(i)===void 0?[]:Mo(kt(i)*60,za(Mt(e.timeLabelCount)),e.hourCycle,e.minutes,t):n===void 0||!si(n)?[]:Mo(Math.round(n.historyMinutes)*60,za(Mt(e.timeLabelCount)),e.hourCycle,e.minutes,t)}function mi(e){let n=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(n))return Number(n);let t=n.toLowerCase();if(t==="inf"||t==="+inf"||t==="infinity"||t==="+infinity")return 1/0;if(t==="-inf"||t==="-infinity")return-1/0;if(t==="nan"||t==="+nan"||t==="-nan")return NaN}function tt(e){let n=e.trim(),t=mi(n);if(t!==void 0)return t;let i="";for(let r of n)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:mi(i)}function vx(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function kx(e){let n=Math.max(0,e);return n<60?`${Math.trunc(n)}s`:n<3600?`${Math.trunc(n/60)}m`:n<86400?`${Math.trunc(n/3600)}h`:`${Math.trunc(n/86400)}d`}function $x(e){let n=e.trim(),t=mi(n);if(t!==void 0)return t;let i=0,a=n.indexOf(",");if(a>=0){let s=n.slice(0,a).trim().split(" "),l=s.length===2?mi(s[0]):void 0;if(l===void 0||s[1]!=="day"&&s[1]!=="days")return;i=l,n=n.slice(a+1).trim()}let r=n.split(":");if(r.length!==2&&r.length!==3)return;let o=0;for(let s=0;s<r.length;s++){let l=mi(r[s]);if(l===void 0)return;o+=l*Math.pow(60,r.length-1-s)}return i*86400+o}function Cx(e){let n=Math.trunc(Math.min(Math.max(0,e)||0,863913600)),i=[[Math.trunc(n/86400),"d"],[Math.trunc(n%86400/3600),"h"],[Math.trunc(n%3600/60),"m"],[n%60,"s"]].filter(([a])=>a>0).slice(0,2).map(([a,r])=>`${a}${r}`);return i.length===0?"0s":i.join(" ")}function Sx(e){return e.replace(/\S+/g,n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase())}function Tx(e,n,t){if(Ve(n))return e;let i=n,a=e,r=mi(e.trim()),o=i.duration?$x(e):void 0;if(o!==void 0)a=Cx(o);else if(i.relativeTime&&r!==void 0)a=kx(r);else{let s=tt(e);if(s!==void 0){let l=s*(i.multiply??1)+(i.offset??0);i.decimals!==void 0?a=l.toFixed(Math.max(0,i.decimals)):l!==s&&(a=Number.isInteger(l)?String(l):vx(l))}}switch(i.useEntityUnit&&t&&(a+=t.startsWith("\xB0")||t.startsWith("%")?t:` ${t}`),i.prefix&&(a=i.prefix+a),i.suffix&&(a=a+i.suffix),i.textCase){case"upper":a=a.toUpperCase();break;case"lower":a=a.toLowerCase();break;case"capitalized":a=Sx(a);break}return a}function Ji(e){let n=Math.trunc(Math.max(0,e)),t=Math.trunc(n/3600),i=Math.trunc(n%3600/60),a=n%60,r=o=>String(o).padStart(2,"0");return t>0?`${t}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function nt(e,n=240){return ph(e,n).map(t=>t.value)}function hd(e,n=240){let t=[];for(let s of e.split(",")){if(t.length>=n)break;if(s.trim()===""){t.push(void 0);continue}for(let l of nt(s,n-t.length))t.push(l)}let i=t.find(s=>s!==void 0);if(i===void 0)return{values:[],holes:[]};let a=[],r=[],o=i;for(let s of t)s===void 0?(a.push(o),r.push(!0)):(o=s,a.push(s),r.push(!1));return{values:a,holes:uh(r)}}function uh(e){return e.some(n=>n)?e:[]}function ph(e,n=240){let t=[],i="",a=0,r=!1,o=0,s=()=>{if(i!==""){let l=Number(i);Number.isFinite(l)&&t.push({value:l,start:a,end:a+i.length})}i=""};for(let l of e){if(t.length>=n)break;if(l>="0"&&l<="9")i===""&&(a=o),i+=l,r=!0;else if(l===".")i.includes(".")&&s(),i===""&&(a=o),i+=".",r=!0;else if(l==="-"||l==="+"){let d=!r;s(),d&&(a=o,i=l),r=!1}else s(),r=!1;o+=l.length}return t.length<n&&s(),t}function Ex(e,n){if(e.arc===void 0||e.countdown===!0||!eo(n))return;let t=ce[n==="inline"?"rectangular":n],i=Math.max(0,Math.min(e.frame.width*t.width,e.frame.height*t.height));return{radius:e.arc.radius*i,angle:e.arc.angle??0,sweep:Ra(e.arc.sweep??We),spacing:Ha(e.arc.spacing??0),flip:e.arc.flip===!0,anchor:i/2}}function lh(e,n,t){let i=ph(e),a=i.map(b=>b.value),r=t.highlight??"none",o=-1,s=-1;a.length>0&&((r==="highest"||r==="both")&&(o=a.indexOf(Math.max(...a))),(r==="lowest"||r==="both")&&(s=a.indexOf(Math.min(...a))),s===o&&(s=-1));let l=t.coloring==="bands"?Tn({bands:t.bands??[]}):[],d=t.bandAboveColorHex??be,c=t.highColorHex??lt,u=t.lowColorHex??dt,p=[],f=(b,y)=>{if(b==="")return;let x=p.at(-1);x&&x.colorHex===y?x.text+=b:p.push({text:b,colorHex:y})},g=0;return i.forEach((b,y)=>{f(e.slice(g,b.start),n);let x=y===o?c:y===s?u:l.length>0?po(b.value,l,d):n,$=e[b.end-1]==="."?b.end-1:b.end;f(e.slice(b.start,$),x),g=$}),f(e.slice(g),n),p}function dh(e,n){let t,i;return n.scale==="fixed"?(t=Math.min(n.minValue,n.maxValue),i=Math.max(n.minValue,n.maxValue)):(t=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1,n.thresholdValue!==void 0&&Number.isFinite(n.thresholdValue)&&(t=Math.min(t,n.thresholdValue),i=Math.max(i,n.thresholdValue))),n.baseline==="zero"&&(t=Math.min(t,0),i=Math.max(i,0)),i>t||(i=t+1),{min:t,max:i}}function Fx(e,n,t){let i=e.thresholdValue;if(!(i===void 0||!Number.isFinite(i)||!(t>n)||i<n||i>t))return(i-n)/(t-n)}function Xa(e,n=Rn){let t=[];for(let i of e.split(" ")){if(t.length>=n)break;if(i==="")continue;let a=i.indexOf(":");if(a<=0)continue;let r=Number(i.slice(0,a));!Number.isFinite(r)||r<0||t.push({offsetSeconds:Math.round(r),state:Mx(i.slice(a+1))})}return t}function Mx(e){try{return decodeURIComponent(e)}catch{return e}}function Rx(e,n,t){if(e.length===0||!(n>0))return[];let i=[];for(let r=0;r<e.length;r++){let o=e[r],s=Math.min(1,Math.max(0,o.offsetSeconds/n)),l=e[r+1],d=l===void 0?1:Math.min(1,Math.max(s,l.offsetSeconds/n));if(!(d>s))continue;let c=t(o.state),u=i[i.length-1];u!==void 0&&u.colorHex===c?u.end=d:i.push({start:s,end:d,colorHex:c})}let a=i[i.length-1];return a!==void 0&&(a.end=1),i}function ch(e,n,t){if(Number.isNaN(e))return t;let i=e<0?-Math.round(-e):Math.round(e);return Math.min(t,Math.max(n,i))}function Hx(e,n,t){if(e===void 0)return 0;let i=tt(e);if(i===void 0||Number.isNaN(i))return 0;let a=t-n;return a===0?0:Math.min(1,Math.max(0,(i-n)/a))}var _t=class{constructor(n,t){this.ctx=n;this.charts=new Map;this.chartElements=new Map;this.timelineElements=new Map;this.imageElements=new Map;this.named=new Map(n.namedValues.map(i=>[i.id.toUpperCase(),i.value])),t&&this.settleCharts(t)}chartReadings(n){let{values:t,holes:i}=this.chartSeries(n),a=dh(t,n),r={values:t,holes:i,domainMin:a.min,domainMax:a.max},o=this.chartEntity(n);return o&&(r.entity=o),r}chartSeries(n){let t=Lt(n),i=It(n),a,r=t??i;r!==void 0?a=this.ctx.historySeries?.get(r)??"":a=this.resolve(n.value)??"";let{values:o,holes:s}=r!==void 0?hd(a):{values:nt(a),holes:[]},l=r===void 0?void 0:this.testedReading(n);if(l!==void 0&&(o=[...o.slice(0,-1),l],s.length>0&&(s=[...s.slice(0,-1),!1])),n.limit>0&&o.length>n.limit){let d=c=>n.takeFromEnd?c.slice(c.length-n.limit):c.slice(0,n.limit);o=d(o),s.length>0&&(s=d(s))}return s=uh(s),{values:fd(o,xt(n.smoothing),s),holes:s}}testedReading(n){let t=this.chartEntity(n);if(!t||!this.ctx.testedEntities?.has(t.entityId))return;let i=this.ctx.entityStates.get(t.entityId)?.state;return i===void 0?void 0:tt(i)}chartEntity(n){let t=this.dereference(n.value);if(!(!t||!("entityId"in t.kind)))return{entityId:t.kind.entityId,displayName:t.kind.displayName,domain:t.kind.domain}}chartNowIndex(n,t){if(n.nowIndex===void 0||t===0)return;let i=this.resolve(n.nowIndex);if(i===void 0)return;let a=tt(i);if(!(a===void 0||!Number.isFinite(a)))return Math.min(Math.max(Math.round(a),0),t-1)}settleCharts(n){let t=new Map,i=[];for(let s of n.elements)s.kind==="timeline"&&this.timelineElements.set(s.payload.id,s.payload),s.kind==="image"&&this.imageElements.set(s.payload.id,s.payload),!(s.kind!=="chart"||t.has(s.payload.id))&&(t.set(s.payload.id,s.payload),i.push(s.payload.id));let a=new Map;for(let s of i)a.set(s,this.chartSeries(t.get(s)));let r=new Map,o=(s,l)=>{let d=r.get(s);if(d)return d;let c=t.get(s);if(!c)return{min:0,max:1};let u=c.scaleFrom,p=u!==void 0&&u!==s&&t.has(u)&&!l.has(u)?o(u,new Set([...l,u])):dh(a.get(s)?.values??[],c);return r.set(s,p),p};for(let s of i){let l=t.get(s),d=o(s,new Set([s])),c={values:a.get(s)?.values??[],holes:a.get(s)?.holes??[],domainMin:d.min,domainMax:d.max},u=this.chartEntity(l);u&&(c.entity=u),this.charts.set(s,c),this.chartElements.set(s,l)}}dereference(n){let t=n,i=new Set,a=n.format;for(;t.kind.kind==="named";){let o=t.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let s=this.named.get(o);if(!s)return;a=a&&!Ve(a)?a:s.format,t=s}let r={kind:t.kind};return a&&(r.format=a),r}directEntityUnit(n){let t=n.kind;if(t.kind==="entityState"||t.kind==="entityAttribute"||t.kind==="entityAge")return this.ctx.entityStates.get(t.entityId)?.unitOfMeasurement;if(t.kind==="chartStat"){if(t.stat==="trend")return;let i=this.charts.get(t.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}}resolve(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i;switch(t.kind.kind){case"literal":i=t.kind.value;break;case"entityState":i=this.ctx.entityStates.get(t.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(t.kind.layer.toUpperCase()),r=a?mx(a,t.kind.stat):void 0;a&&r!==void 0&&(i=t.kind.stat==="trend"?Yu(r):Da(r,a.domainMax-a.domainMin));break}default:{let a=Xi(n,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return Tx(i,t.format,this.directEntityUnit(t))}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i=t.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let s=Date.parse(o.finishesAt);return Number.isFinite(s)&&s>this.nowMs()?s:void 0}}let a=this.resolve(n)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=mi(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}canCountDown(n){if(!n)return!1;let t=this.dereference(n);if(t?.kind.kind==="entityState"){let i=t.kind.entityId;if(i.startsWith("timer.")||this.ctx.entityStates.get(i)?.timerState!==void 0)return!0}return this.countdownEnd(n)!==void 0}countdownFallbackText(n){if(!n)return;let t=this.dereference(n);if(!t||t.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(t.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?Ji(i.remaining):"Paused":"Idle"}entityIcon(n){let t=this.dereference(n);return!t||t.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(t.kind.entityId)?.iconName??t.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(n){let t=n.comparison;if(t.kind==="isStale")return this.isStale();let i=this.resolve(n.value);if(i===void 0)return t.kind==="isUnavailable";let a=tt(i),r=()=>this.resolve(t.value),o=()=>{let l=r();return l===void 0?void 0:tt(l)},s=l=>{let d=o();return a===void 0||d===void 0?!1:l(a,d)};switch(t.kind){case"equals":{let l=r();return l!==void 0&&i===l}case"notEquals":{let l=r();return l!==void 0&&i!==l}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let l=i.toLowerCase();return l==="unavailable"||l==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return s((l,d)=>l>d);case"greaterOrEqual":return s((l,d)=>l>=d);case"lessThan":return s((l,d)=>l<d);case"lessOrEqual":return s((l,d)=>l<=d);case"between":{let l=o(),d=this.resolve(t.upper),c=d===void 0?void 0:tt(d);if(a===void 0||l===void 0||c===void 0)return!1;let[u,p]=l<=c?[l,c]:[c,l];return a>=u&&a<=p}case"timeBetween":{let l=pi(i),d=r(),c=this.resolve(t.upper),u=d===void 0?void 0:pi(d),p=c===void 0?void 0:pi(c);return l===void 0||u===void 0||p===void 0||u===p?!1:u<p?l>=u&&l<p:l>=u||l<p}case"contains":{let l=r();return!!l&&i.toLowerCase().includes(l.toLowerCase())}case"startsWith":{let l=r();return!!l&&i.toLowerCase().startsWith(l.toLowerCase())}case"endsWith":{let l=r();return!!l&&i.toLowerCase().endsWith(l.toLowerCase())}case"matchesRegex":{if(!t.pattern)return!1;try{return new RegExp(t.pattern).test(i)}catch{return!1}}case"isOneOf":return(t.options??[]).some(l=>l.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(n){return n.tests.length===0?!0:n.join==="any"?n.tests.some(t=>this.evaluateTest(t)):n.tests.every(t=>this.evaluateTest(t))}applyRules(n,t){let i=new Map;for(let a of n){let r=t?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(s=>s.id===r.caseId)?.then??[];else{let s=a.cases.find(l=>this.evaluateCondition(l.when));o=s?s.then:a.otherwise??[]}for(let s of o)i.set(je[s.kind],s)}return i}liveBranches(n){let t=new Map;for(let i of n){let a=i.cases.find(r=>this.evaluateCondition(r.when));t.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return t}styleColor(n,t){let i=n.get(t);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(n,t){let i=n.get(t);return i?this.resolve(i.value):void 0}styleNumber(n,t){return n.get(t)?.number}resolveTextParts(n,t,i,a){let r=[];for(let o of n){let s=this.applyRules(t.filter(d=>d.partId===o.id),a);if(s.get("visibility")?.kind==="hide")continue;let l={text:this.styleText(s,"text")??this.resolve(o.value)??"--",fontSize:this.styleNumber(s,"fontSize")??o.fontSize??i.fontSize,fontWeight:s.get("fontWeight")?.weight??o.fontWeight??i.fontWeight,fontDesign:s.get("fontDesign")?.design??o.fontDesign??i.fontDesign,fontWidth:s.get("fontWidth")?.width??o.fontWidth??i.fontWidth,italic:s.get("italic")?.italic??o.italic??i.italic,colorHex:this.styleColor(s,"color")??o.colorHex??i.colorHex};o.coloring==="bands"&&(o.bands?.length??0)>0&&(l.spans=lh(l.text,l.colorHex,o)),r.push(l)}return r}resolveElement(n,t,i="rectangular"){let a=n.payload,r=n.kind==="text"?a.rules.filter(f=>f.partId===void 0):a.rules,o=this.applyRules(r,t),s=o.get("visibility"),l=s?s.kind==="hide":a.isHidden,d=this.styleNumber(o,"rotation"),c=d===void 0?a.frame:{...a.frame,rotationDegrees:d},u=La((a.opacity??1)*(this.styleNumber(o,"opacity")??1)),p={id:a.id,isHidden:l,frame:c,opacity:u};switch(a.shadow!==void 0&&(p.shadow=a.shadow),a.chartAnchor!==void 0&&(p.chartAnchor=a.chartAnchor),a.accentGroup==="accent"&&(p.accentGroup="accent"),n.kind){case"text":{let f=n.payload.countdown?this.countdownEnd(n.payload.value):void 0,g=n.payload.countdown?this.countdownFallbackText(n.payload.value):void 0,b=vt(n.payload)&&!o.has("text"),y={kind:"text",...p,text:b?"":this.styleText(o,"text")??g??this.resolve(n.payload.value)??"--",fontSize:this.styleNumber(o,"fontSize")??n.payload.fontSize,fontWeight:o.get("fontWeight")?.weight??n.payload.fontWeight,colorHex:this.styleColor(o,"color")??n.payload.colorSlot.baseColorHex,monospacedDigits:n.payload.monospacedDigits===!0,lineLimit:Math.min(pl,Math.max(1,Math.round(n.payload.lineLimit??1))),fontDesign:o.get("fontDesign")?.design??n.payload.fontDesign??"default",fontWidth:o.get("fontWidth")?.width??n.payload.fontWidth??"standard",italic:o.get("italic")?.italic??n.payload.italic===!0,minimumScale:Sa(n.payload.minimumScale??pt),alignment:n.payload.alignment??"center"};f!==void 0&&(y.countdownEnd=f);let x=Ex(n.payload,i);return x!==void 0&&(y.arc=x),b?(y.parts=this.resolveTextParts(n.payload.parts,a.rules,y,t),y.text=y.parts.map($=>$.text).join(""),y):(Uu(n.payload)&&(y.spans=lh(y.text,y.colorHex,n.payload)),y)}case"icon":{let f=this.entityIcon(n.payload.symbol)??this.resolve(n.payload.symbol)??"questionmark.circle",g=this.styleText(o,"icon"),b=n.payload.symbol.kind.kind==="literal",y=g===void 0&&b&&n.payload.path!==""?n.payload.path:void 0,x=g??f;y===void 0&&x.startsWith("mdi:")&&(x="questionmark.circle");let $={kind:"icon",...p,symbol:x,size:this.styleNumber(o,"fontSize")??n.payload.size,colorHex:this.styleColor(o,"color")??n.payload.colorSlot.baseColorHex};return y!==void 0&&($.path=y),$}case"gauge":{let f=n.payload,g=this.styleText(o,"gaugeValue")??this.resolve(f.value),b=(N,j,B)=>N??(j?tt(this.resolve(j)??""):void 0)??B,y=b(this.styleNumber(o,"gaugeMin"),f.minSource,f.minValue),x=b(this.styleNumber(o,"gaugeMax"),f.maxSource,f.maxValue),$=g===void 0?void 0:tt(g),k=this.styleColor(o,"color"),C=k??f.colorSlot.baseColorHex,M=f.coloring==="bands"&&f.bands.length>0&&$!==void 0;M&&(C=po($,Tn(f),f.bandAboveColorHex));let D=M||k!==void 0?void 0:f.fill,I=x-y;if(f.total){let N=tt(this.resolve(f.total)??"");N!==void 0&&(I=N)}let T=ch(I,1,co),F={kind:"gauge",...p,fraction:Hx(g,y,x),style:f.style,lineWidth:f.lineWidth,colorHex:C,trackColorHex:f.trackColorHex,thresholdColorHex:f.thresholdColorHex,dotCount:T,filledCount:ch($??0,0,T),tickCount:f.ticks?.count??0,tickLength:f.ticks?.length??tn,tickColorHex:f.ticks?.colorHex??en,tickMajorEvery:f.ticks?.majorEvery??0,showsLabels:f.labels?.show===!0,labelSize:f.labels?.size??an,labelColorHex:f.labels?.colorHex??nn,minValue:y,maxValue:x,valueText:g??""};if(D!==void 0&&(F.fill=D),f.thresholdValue!==void 0&&x!==y){let N=(f.thresholdValue-y)/(x-y);N>=0&&N<=1&&(F.thresholdFraction=N)}return F}case"chart":{let f=n.payload,g=this.charts.get(f.id)??this.chartReadings(f),b=g.values,y=g.holes,x={min:g.domainMin,max:g.domainMax},$=this.styleColor(o,"color")??f.colorSlot.baseColorHex,k=Tn(f),C=Na(f)?b.map(B=>po(B,k,f.bandAboveColorHex)):[],M=f.highlight==="highest"||f.highlight==="both",D=f.highlight==="lowest"||f.highlight==="both",I=ka(f),T={kind:"chart",...p,values:b,holes:y,style:f.style,domainMin:x.min,domainMax:x.max,baseline:f.baseline,barGap:f.barGap,lineWidth:f.lineWidth,colorHex:$,highColorHex:f.highColorHex,lowColorHex:f.lowColorHex,marker:f.marker,highMarker:M?I.high:"none",lowMarker:D?I.low:"none",pointColorHexes:C,fillBands:f.fillBands,curve:f.curve??"straight",smoothing:xt(f.smoothing)??"off",fillStyle:wn(f.fillStyle),...f.fillColorHex!==void 0?{fillColorHex:f.fillColorHex}:{},...f.areaFill!==void 0&&f.style!=="bars"?{areaFill:f.areaFill}:{},barRadius:vn(f.barRadius),barCorners:kn(f.barCorners),barBorderWidth:Cl(f),barFillColorHexes:[],barBorderColorHexes:[],barBorderOpenBase:Cl(f)>0&&f.barBorderOpenBase===!0,thresholdColorHex:f.thresholdColorHex,drawsThreshold:f.drawsThreshold!==!1,nowColorHex:f.nowColorHex,drawsNowLine:f.drawsNowLine!==!1,labels:f.drawsTimeLabels===!1?[]:xx(f,this.nowMs()),labelSize:f.labelSize,labelColorHex:f.labelColorHex,labelsAbove:f.labelsAbove},F=y.length===0?b:b.filter((B,W)=>!y[W]);if(F.length>0){let B=X=>b.findIndex((z,K)=>z===X&&y[K]!==!0),W=M?B(Math.max(...F)):-1,ne=D?B(Math.min(...F)):-1;W>=0&&(T.highIndex=W),ne>=0&&ne!==W&&(T.lowIndex=ne)}if(f.style==="bars"){let B=b.map((W,ne)=>qu(f,W,k,$,ne===T.highIndex?f.highColorHex:ne===T.lowIndex?f.lowColorHex:void 0));T.barFillColorHexes=B.map(W=>W.fill),T.barBorderWidth>0&&(T.barBorderColorHexes=B.map(W=>W.border))}let N=Fx(f,x.min,x.max);N!==void 0&&(T.thresholdY=N);let j=this.chartNowIndex(f,b.length);return j!==void 0&&(T.nowIndex=j),T}case"timeline":{let f=n.payload,g=Qe(f),b=g===void 0?"":this.ctx.historySeries?.get(g)??"",y=Xa(b,Rn),x=Rx(y,kt(f)*60,k=>np(k,f.bands,f.otherColorHex));return{kind:"timeline",...p,runs:x,gap:f.gap,cornerRadius:f.cornerRadius,labels:f.drawsTimeLabels===!1?[]:bx(f,this.nowMs()),labelSize:f.labelSize,labelColorHex:f.labelColorHex,labelsAbove:f.labelsAbove}}case"shape":{let f=this.styleColor(o,"color"),g={kind:"shape",...p,shapeKind:n.payload.kind,cornerRadius:n.payload.cornerRadius,thickness:n.payload.thickness,fillColorHex:f??n.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(o,"borderWidth")??n.payload.borderWidth};f===void 0&&n.payload.fill!==void 0&&(g.fill=n.payload.fill);let b=this.styleColor(o,"borderColor")??n.payload.borderColorHex;return b!==void 0&&(g.borderColorHex=b),g}case"image":{let f={kind:"image",...p,entityId:n.payload.entity.entityId,source:n.payload.source,showTimestamp:n.payload.timestamp===!0,contentMode:n.payload.contentMode,zoom:n.payload.zoom,panX:n.payload.panX,panY:n.payload.panY,cornerRadius:n.payload.cornerRadius,timestampCorner:n.payload.timestampCorner,timestampSize:n.payload.timestampSize};bo(n.payload)&&(f.timestampX=n.payload.timestampX,f.timestampY=n.payload.timestampY);let g=this.ctx.entityStates.get(n.payload.entity.entityId)?.entityPicture;return g!==void 0&&(f.url=g),f}case"tap":{let f={kind:"tap",...p,shadow:void 0,frame:n.payload.frame,opacity:1,action:n.payload.action};return n.payload.openPageId!==void 0&&(f.openPageId=n.payload.openPageId),n.payload.attachedTo!==void 0&&(f.attachedTo=n.payload.attachedTo),f}case"chartTimes":{let f=n.payload;return{kind:"chartTimes",...p,labels:wx(f,this.chartElements.get(f.chart),this.nowMs(),this.timelineElements.get(f.chart)),labelSize:f.labelSize,labelColorHex:f.labelColorHex}}case"imageTime":{let f=n.payload,g=this.imageElements.get(f.image),b={kind:"imageTime",...p,image:f.image,linked:g!==void 0},y=g===void 0?void 0:this.ctx.entityStates.get(g.entity.entityId)?.entityPicture;return y!==void 0&&(b.url=y),b}case"chartDots":{let f=n.payload,g=Ft(f.size),b={kind:"chartDots",...p,chart:f.chart,dots:qr(f.dots),diameter:0,indices:[]};return g!==void 0&&(b.size=g),f.colorHex!==void 0&&(b.colorHex=f.colorHex),b}case"chartGrid":{let f=n.payload;return{kind:"chartGrid",...p,chart:f.chart,lines:ii(f.lines),colorHex:yn(f.colorHex),thickness:ai(f.thickness),draws:!1}}}}resolveLayout(n,t,i){let a=n.perFamily[t];this.settleCharts(n);let r=ce[t==="inline"?"rectangular":t],o=[...Dx(Nx(Cp(n,t).map(x=>this.resolveElement(x,i,t)),r),r)],s=a?this.applyRules(a.rules,i):new Map,l={family:t,elements:o,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(s,"borderWidth")??a?.borderWidth??2},d=this.styleText(s,"text"),c=a?.bezelCountdown&&d===void 0?this.countdownEnd(a.bezelText):void 0,u=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,p=d??u??this.resolve(a?.bezelText);p!==void 0&&(l.bezelText=p),c!==void 0&&(l.bezelCountdownEnd=c);let f=this.resolve(a?.curvedText);if(f!==void 0&&(l.curvedText=f),a?.curvedColorHex!==void 0&&(l.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let x=a.bezelGauge,$=this.resolve(x.value),k=$===void 0?void 0:tt($);if(k!==void 0){let C=Math.min(x.minValue,x.maxValue),M=Math.max(x.minValue,x.maxValue),D={value:Math.min(M,Math.max(C,k)),minValue:C,maxValue:M===C?C+1:M,colorHexes:x.colorHexes},I=this.resolve(x.minLabel);I!==void 0&&(D.minLabel=I);let T=this.resolve(x.maxLabel);T!==void 0&&(D.maxLabel=T),l.bezelGauge=D}}let g=this.styleColor(s,"backgroundColor"),b=g??a?.backgroundColorHex;b!==void 0&&(l.backgroundColorHex=b),g===void 0&&a?.backgroundFill!==void 0&&(l.backgroundFill=a.backgroundFill);let y=this.styleColor(s,"borderColor")??a?.borderColorHex;return y!==void 0&&(l.borderColorHex=y),l}};function Ax(e,n,t){let i=new _t(n,t),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function dn(e,n,t){let i=new _t(n),a={};for(let r of de)e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,t));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=Ax(e.inline,n,e)),a}function Zi(e,n){let t=Math.max(0,e.frame.width*n.width),i=Math.max(0,e.frame.height*n.height),a=(e.frame.x+e.frame.width/2)*n.width,r=(e.frame.y+e.frame.height/2)*n.height;return{x:a-t/2,y:r-i/2,w:t,h:i,cx:a,cy:r}}var pd=5,Lx=1.7,Ix=1.8;function _x(e,n,t,i,a,r){return e==="bars"||t===0?!1:n==="all"||t===1?!0:Math.max(i-a*2,0)/(t-1)>=3*r}function Nx(e,n){if(!e.some(r=>r.kind==="chartDots"||r.kind==="chartGrid"))return[...e];let t=new Map;for(let r of e)r.kind==="chart"&&t.set(r.id,r);let i=new Map,a=e.map(r=>{if(r.kind==="chartGrid"){let u=t.get(r.chart);return u===void 0?{...r,draws:!1}:{...r,frame:u.frame,draws:u.values.length>0}}if(r.kind!=="chartDots")return r;let o=t.get(r.chart);if(o===void 0)return{...r,diameter:0,indices:[]};let s=r.size??o.lineWidth*Ix,l=Math.max(o.frame.width*n.width,0),d=_x(o.style,r.dots,o.values.length,l,o.lineWidth/2,s);d&&!r.isHidden&&i.set(o.id,Math.max(i.get(o.id)??0,s));let c=d?o.values.map((u,p)=>p).filter(u=>o.holes[u]!==!0&&u!==o.highIndex&&u!==o.lowIndex):[];return{...r,frame:o.frame,diameter:s,indices:c}});return i.size===0?a:a.map(r=>{if(r.kind!=="chart")return r;let o=i.get(r.id);return o===void 0?r:{...r,dotDiameter:o}})}function hh(e){if(e.domainMin<0&&e.domainMax>0)return(0-e.domainMin)/(e.domainMax-e.domainMin)}function fh(e,n){let t=Math.max(0,Math.min(4,Math.round(n))),i=e.plotBottom-e.plotTop;return Array.from({length:t},(a,r)=>e.plotTop+i*(r+1)/(t+1))}function Ro(e,n){let t=e.values,i=Math.max(t.length,1),a=e.highIndex!==void 0?e.highMarker:"none",r=e.lowIndex!==void 0?e.lowMarker:"none",o=n.x,s=Math.max(n.w,0),l=e.style==="bars"?0:e.lineWidth/2,d=e.dotDiameter!==void 0&&e.style!=="bars"?Math.max(l,e.dotDiameter/2):l,c=I=>I==="triangle"?pd+d:I==="dot"?Math.max(d,Lx):d,u=c(a),p=c(r),f=n.y+u,g=Math.max(n.h-u-p,1),b=f+g,y=Math.max(e.domainMax-e.domainMin,Number.EPSILON),x=e.baseline==="lowest",$=x?g*.12:0,k=Math.min(Math.max(e.barGap,0),s/(i*2)),C=Math.max((s-k*(i-1))/i,.5),M=I=>Math.min(1,Math.max(0,(I-e.domainMin)/y)),D=I=>b-M(I)*g;return{count:t.length,barWidth:C,plotTop:f,plotBottom:b,plotLeft:o,plotRight:o+s,baselineY:x?b:D(0),inset:d,yAtFraction(I){return b-Math.min(Math.max(I,0),1)*g},barRect(I){let T=o+I*(C+k),F=t[I],N,j;if(x){let B=$+M(F)*(g-$);N=b-B,j=b}else N=D(F),j=x?b:D(0),N>j&&([N,j]=[j,N]);return{x:T,y:N,w:C,h:Math.max(j-N,.5)}},point(I){let T=Math.max(s-d*2,0);return{x:t.length>1?o+d+T*I/(t.length-1):o+s/2,y:D(t[I])}},markerCenter(I,T,F="high"){let N=T?this.barRect(I):void 0,j=N?N.x+N.w/2:this.point(I).x,B=F==="high"?a:r,W=F==="high"?B==="triangle"?n.y+pd/2:f:B==="triangle"?n.y+n.h-pd/2:b;return{x:j,y:W}}}}function mh(e,n){let t=e.length;if(t<2)return[];let i=[];if(n==="step"){for(let o=0;o<t-1;o++){let s=e[o],l=e[o+1];i.push({kind:"step",start:s,corner:{x:l.x,y:s.y},end:l})}return i}if(n!=="smooth"){for(let o=0;o<t-1;o++)i.push({kind:"straight",start:e[o],end:e[o+1]});return i}let a=[];for(let o=0;o<t-1;o++){let s=e[o+1].x-e[o].x;a.push(s===0?0:(e[o+1].y-e[o].y)/s)}let r=new Array(t).fill(0);r[0]=a[0],r[t-1]=a[t-2];for(let o=1;o<t-1;o++)r[o]=a[o-1]*a[o]<=0?0:(a[o-1]+a[o])/2;for(let o=0;o<t-1;o++){if(a[o]===0){r[o]=0,r[o+1]=0;continue}let s=r[o]/a[o],l=r[o+1]/a[o],d=s*s+l*l;if(d>9){let c=3/Math.sqrt(d);r[o]=c*s*a[o],r[o+1]=c*l*a[o]}}for(let o=0;o<t-1;o++){let s=e[o],l=e[o+1],d=l.x-s.x;i.push({kind:"smooth",start:s,c1:{x:s.x+d/3,y:s.y+r[o]*d/3},c2:{x:l.x-d/3,y:l.y-r[o+1]*d/3},end:l})}return i}function fd(e,n,t=[]){let i=e.length,a=Bu(i,n);if(a===0)return e;let r=Math.floor(a/2),o=r/2,s=u=>t[u]===!0,l=e.map((u,p)=>{if(s(p))return u;let f=0,g=0;for(let b=Math.max(0,p-r);b<=Math.min(i-1,p+r);b++){if(s(b))continue;let y=b-p,x=Math.exp(-(y*y)/(2*o*o));f+=e[b]*x,g+=x}return f/g}),d=l.find((u,p)=>!s(p));if(d===void 0)return l;let c=d;return l.map((u,p)=>s(p)?c:(c=u,u))}function gh(e,n){let t=[],i=[];for(let a=0;a<e;a++)n[a]===!0?(i.length>0&&t.push(i),i=[]):i.push(a);return i.length>0&&t.push(i),t}var Ya=1;function gi(e,n){let t=Math.max(Fn,Math.min(Mn,e.labelSize)),i=t*1.2,a=e.labels.length>0&&n.h-i-Ya>=2,r=a?{...n,y:e.labelsAbove?n.y+i+Ya:n.y,h:n.h-i-Ya,cy:(e.labelsAbove?n.y+i+Ya:n.y)+(n.h-i-Ya)/2}:n;return{labelSize:t,rowHeight:i,body:r,showsLabels:a}}function Dx(e,n){if(!e.some(i=>i.chartAnchor!==void 0))return e;let t=new Map;for(let i of e)i.kind==="chart"&&t.set(i.id,i);return t.size===0?e:e.map(i=>{let a=i.chartAnchor;if(a===void 0)return i;let r=t.get(a.layer);if(r===void 0)return i;if(a.at==="zero"&&hh(r)===void 0)return{...i,isHidden:!0};let o=zx(i.frame,a,r,n);return o===void 0?i:{...i,frame:o}})}function Px(e,n){let t=n.values;if(t.length===0)return;let i=t.map((a,r)=>r).filter(a=>n.holes.length===0||!n.holes[a]);if(i.length!==0)switch(e){case"highest":return i.reduce((a,r)=>t[r]>t[a]?r:a);case"lowest":return i.reduce((a,r)=>t[r]<t[a]?r:a);case"first":return i[0];case"latest":return i[i.length-1];case"now":return n.nowIndex===void 0?void 0:Math.min(Math.max(n.nowIndex,0),t.length-1);case"threshold":return;case"zero":return}}function zx(e,n,t,i){if(i.width<=0||i.height<=0)return;let a=Zi(t,i);if(a.w<=0||a.h<=0)return;let r=gi(t,a).body;if(r.w<=0||r.h<=0)return;let o=Ro(t,r),s,l;if(Qt(n.at)){let x=Px(n.at,t);if(x===void 0)return;if(t.style==="bars"){let $=o.barRect(x);s=$.x+$.w/2,l=$.y}else{let $=o.point(x);s=$.x,l=$.y}}else{let x=n.at==="zero"?hh(t):t.thresholdY;if(x===void 0)return;l=o.yAtFraction(x)}let d=Math.max(e.width,0)*i.width,c=Math.max(e.height,0)*i.height,u=.75,p=(x,$,k)=>$>k?($+k)/2:Math.min(Math.max(x,$),k),f={...e};if(s!==void 0){let x=p(s+(n.dx??0),r.x+d/2,r.x+r.w-d/2);f.x=(x-d/2)/i.width}if(n.place==="through"){if(s!==void 0)f.y=o.plotTop/i.height,f.height=(o.plotBottom-o.plotTop)/i.height;else{f.x=o.plotLeft/i.width,f.width=(o.plotRight-o.plotLeft)/i.width;let x=p(l+(n.dy??0),r.y+c/2,r.y+r.h-c/2);f.y=(x-c/2)/i.height}return f}let g=n.place==="on"?l:n.place==="below"?l+u+c/2:n.place==="bottom"?o.plotBottom-u-c/2:l-u-c/2,b=p(g,r.y+c/2,r.y+r.h-c/2),y=p(b+(n.dy??0),c/2,i.height-c/2);return f.y=(y-c/2)/i.height,f}var md=[.01,.025,.05,.1];function Qi(e,n){return!(n.width>0&&n.height>0)||n.width===n.height?{x:e,y:e}:n.width>n.height?{x:e*n.height/n.width,y:e}:{x:e,y:e*n.width/n.height}}function gd(e){return typeof e=="number"?{x:e,y:e}:e}function yd(e){return e.x>0&&e.y>0}var yh=1e-6;function Ja(e,n){return Math.round((e-.5)/n)*n+.5-e}function bh(e,n,t){let a=[e,e+n/2,e+n].map(r=>Ja(r,t)).reduce((r,o)=>Math.abs(o)<Math.abs(r)?o:r);return re(e+a)}function Ox(e,n){let t=gd(n);return yd(t)?yi({...e,x:bh(e.x,e.width,t.x),y:bh(e.y,e.height,t.y)}):e}function Gx(e,n,t,i={x:!0,y:!0}){let a=gd(t);if(!yd(a))return e;let{x:r,y:o,width:s,height:l}=e,d=r+s,c=o+l;if(i.x&&n.includes("e")&&(s=Math.max(Pe,re(d+Ja(d,a.x)-r))),i.x&&n.includes("w")){let u=Math.min(re(r+Ja(r,a.x)),d-Pe);s=re(d-u),r=re(u)}if(i.y&&n.includes("s")&&(l=Math.max(Pe,re(c+Ja(c,a.y)-o))),i.y&&n.includes("n")){let u=Math.min(re(o+Ja(o,a.y)),c-Pe);l=re(c-u),o=re(u)}return{...e,x:r,y:o,width:s,height:l}}function bd(e,n,t,i){let a=gd(i);if(!yd(a))return e;let r=(o,s,l)=>{if(s===0)return o;let d=(o-.5)/l,c=s>0?Math.floor(d+yh)+1:Math.ceil(d-yh)-1,u=re(c*l+.5);for(let p=0;p<1e3&&(s>0?u<=o:u>=o);p++)c+=s,u=re(c*l+.5);return u};return yi({...e,x:r(e.x,Math.sign(n),a.x),y:r(e.y,Math.sign(t),a.y)})}var Bx=3;function wh(e,n=Bx){return{x:e.width>0?n/e.width:0,y:e.height>0?n/e.height:0}}function vh(e){let n=[{axis:"x",at:.5},{axis:"y",at:.5}];for(let i of e)n.push({axis:"x",at:re(i.x)},{axis:"x",at:re(i.x+i.width/2)},{axis:"x",at:re(i.x+i.width)}),n.push({axis:"y",at:re(i.y)},{axis:"y",at:re(i.y+i.height/2)},{axis:"y",at:re(i.y+i.height)});let t=new Set;return n.filter(i=>{let a=`${i.axis}:${i.at}`;return t.has(a)?!1:(t.add(a),!0)})}function Ao(e,n,t,i){if(!(i>0))return;let a;for(let r of e)for(let o of n){if(o.axis!==t)continue;let s=o.at-r;Math.abs(s)>i||(a===void 0||Math.abs(s)<Math.abs(a.delta)-1e-9)&&(a={at:o.at,delta:s})}return a}function Vx(e,n){let t=n.axis==="x"?e.x:e.y,i=n.axis==="x"?e.width:e.height;return[t,t+i/2,t+i].some(a=>Math.abs(a-n.at)<1e-4)}function Ux(e,n,t){let{x:i,y:a}=e,r=t&&Ao([e.x,e.x+e.width/2,e.x+e.width],t.lines,"x",t.threshold.x),o=t&&Ao([e.y,e.y+e.height/2,e.y+e.height],t.lines,"y",t.threshold.y);if(r&&(i=re(e.x+r.delta)),o&&(a=re(e.y+o.delta)),n!==void 0){let d=Ox(e,n);r||(i=d.x),o||(a=d.y)}let s=yi({...e,x:i,y:a}),l=[];return r&&l.push({axis:"x",at:r.at}),o&&l.push({axis:"y",at:o.at}),{frame:s,guides:l.filter(d=>Vx(s,d))}}function xh(e,n,t,i,a={x:!0,y:!0}){let r={...e},o=[],s={x:a.x,y:a.y};if(i!==void 0){if(a.x){let l=n.includes("e"),d=Ao([l?e.x+e.width:e.x],i.lines,"x",i.threshold.x);if(d){if(l)r.width=Math.max(Pe,re(d.at-r.x));else{let c=Math.min(re(d.at),e.x+e.width-Pe);r.width=re(e.x+e.width-c),r.x=c}Math.abs((l?r.x+r.width:r.x)-d.at)<1e-4?(o.push({axis:"x",at:d.at}),s.x=!1):r={...r,x:e.x,width:e.width}}}if(a.y){let l=n.includes("s"),d=Ao([l?e.y+e.height:e.y],i.lines,"y",i.threshold.y);if(d){if(l)r.height=Math.max(Pe,re(d.at-r.y));else{let c=Math.min(re(d.at),e.y+e.height-Pe);r.height=re(e.y+e.height-c),r.y=c}Math.abs((l?r.y+r.height:r.y)-d.at)<1e-4?(o.push({axis:"y",at:d.at}),s.y=!1):r={...r,y:e.y,height:e.height}}}}return t!==void 0&&(r=Gx(r,n,t,s)),{frame:r,guides:o}}var Pe=.04,Ho=.04;function kh(e,n){let t=()=>{let a=e.getScreenCTM();return a&&a.a!==0&&a.d!==0?{x:a.a,y:a.d}:void 0},i=t()??{x:1,y:1};return a=>(i=t()??i,{x:(a.clientX-n.clientX)/i.x,y:(a.clientY-n.clientY)/i.y})}function Lo(e,n){let t={...e,...n};return yi({...t,x:re(t.x),y:re(t.y),width:Math.max(Pe,re(t.width)),height:Math.max(Pe,re(t.height))})}function xd(e,n){let t=n==="down"?e.x:re((1-e.width)/2),i=n==="across"?e.y:re((1-e.height)/2);return yi({...e,x:t,y:i})}function $h(e,n){let t=xd(e,n);return t.x===e.x&&t.y===e.y}function yi(e){let n=Math.min(1-Ho,Math.max(-e.width+Ho,e.x)),t=Math.min(1-Ho,Math.max(-e.height+Ho,e.y));return{...e,x:n,y:t}}var re=e=>Math.round(e*1e3)/1e3,Ch=10;function Io(e,n,t,i){let a=i.width>0?e.x+n/i.width:e.x,r=i.height>0?e.y+t/i.height:e.y;return yi({...e,x:re(a),y:re(r)})}function Wx(e,n,t,i){let a=n.width,r=n.height,o=e.width*a,s=e.height*r,l=Math.min(o,s),d=e.x*a+(o-l)/2,c=e.y*r+(s-l)/2,u=t.includes("e")?1:-1,p=t.includes("s")?1:-1,f=Pe*Math.max(a,r),g=Math.max(f,l+(u*i.x+p*i.y)/2),b=u>0?d:d+l-g,y=p>0?c:c+l-g;return{...e,x:re(b/a),y:re(y/r),width:re(g/a),height:re(g/r)}}function Kx(e,n,t,i,a=!1){let r=n.width,o=n.height;if(a||e.width*r>=e.height*o){let p=a?Pe:Math.max(Pe,e.height*o/r),f=e.x+e.width,g=t.includes("e")?Math.max(p,e.width+i.x/r):Math.max(p,e.width-i.x/r),b=t.includes("e")?e.x:f-g;return{...e,x:re(b),width:re(g)}}let l=Math.max(Pe,e.width*r/o),d=e.y+e.height,c=t.includes("s")?Math.max(l,e.height+i.y/o):Math.max(l,e.height-i.y/o),u=t.includes("s")?e.y:d-c;return{...e,y:re(u),height:re(c)}}function _o(e,n,t,i,a){let r=kh(e,t),o={...i.handle&&i.outline?i.outline:i.frame},s={...i.frame};e.setPointerCapture(t.pointerId);let l=g=>Math.round(g*1e3)/1e3,d=[],c=g=>{g.length===0&&d.length===0||g.length===d.length&&g.every((b,y)=>b.axis===d[y].axis&&b.at===d[y].at)||(d=g,a.onGuides?.(g))},u=g=>{if(g.pointerId!==t.pointerId)return;let b=r(g),y=b.x/n.width,x=b.y/n.height,$,k=i.snap!==void 0&&i.snap.on!==g.altKey,C=k?i.snap?.step:void 0,M=k?i.guides:void 0,D=[];if(i.handle)if(i.square)$=Wx(o,n,i.handle,b);else if(i.line||i.bar){if($=Kx(o,n,i.handle,b,i.bar===!0),k){let I=i.bar===!0||$.width*n.width>=$.height*n.height,T=xh($,i.handle,C,M,{x:I,y:!I});$=T.frame,D=T.guides}}else{let{x:I,y:T,width:F,height:N}=o,j=o.x+o.width,B=o.y+o.height;if(i.handle.includes("e")&&(F=Math.max(Pe,o.width+y)),i.handle.includes("s")&&(N=Math.max(Pe,o.height+x)),i.handle.includes("w")&&(F=Math.max(Pe,o.width-y),I=j-F),i.handle.includes("n")&&(N=Math.max(Pe,o.height-x),T=B-N),$={...o,x:l(I),y:l(T),width:l(F),height:l(N)},k){let W=xh($,i.handle,C,M);$=W.frame,D=W.guides}}else if($=yi({...o,x:l(o.x+y),y:l(o.y+x)}),k){let I=Ux($,C,M);$=I.frame,D=I.guides}s=$,c(D),a.onFrame(i.elementId,$,!1)},p=g=>{g.pointerId===t.pointerId&&(f(),a.onFrame(i.elementId,s,!0))},f=()=>{c([]),e.removeEventListener("pointermove",u),e.removeEventListener("pointerup",p),e.removeEventListener("pointercancel",p);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",u),e.addEventListener("pointerup",p),e.addEventListener("pointercancel",p),f}function Sh(e,n,t,i,a){let r=kh(e,n),o=1;e.setPointerCapture(n.pointerId);let s=c=>{if(c.pointerId!==n.pointerId)return;let u=r(c),p=u.x*(t.includes("e")?1:-1),f=u.y*(t.includes("s")?1:-1),g=i.w>0?(i.w+p)/i.w:1,b=i.h>0?(i.h+f)/i.h:1,y=Math.abs(g-1)>=Math.abs(b-1)?g:b;o=Math.max(.05,y),a(o,!1)},l=c=>{c.pointerId===n.pointerId&&(d(),a(o,!0))},d=()=>{e.removeEventListener("pointermove",s),e.removeEventListener("pointerup",l),e.removeEventListener("pointercancel",l);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",s),e.addEventListener("pointerup",l),e.addEventListener("pointercancel",l),d}var $e=ce,Wh=26.5;function Kh(e){return $n.includes(e)}var jx={rectangular:$e.rectangular,circular:$e.circular,corner:$e.corner},Qa=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:jx,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],Vo=Qa.find(e=>e.measured),qx={rectangular:{width:160,height:72},circular:{width:58,height:58},inline:{width:240,height:20},small:$e.small,medium:$e.medium,large:$e.large,xlarge:$e.xlarge},er=[{label:"iPhone SE",screen:{width:375,height:667},slots:{rectangular:{width:153,height:69},circular:{width:56,height:56},inline:{width:230,height:19},small:{width:148.33,height:148.33},medium:{width:321.67,height:148.33},large:{width:321.67,height:324},xlarge:{width:321.67,height:499.67}},measured:!1},{label:"iPhone 13 mini",screen:{width:375,height:812},slots:{rectangular:{width:153,height:69},circular:{width:56,height:56},inline:{width:230,height:19},small:{width:155.33,height:155.33},medium:{width:329,height:155.33},large:{width:329,height:345},xlarge:{width:329,height:534.67}},measured:!1},{label:"iPhone 15 Pro",screen:{width:393,height:852},slots:qx,measured:!0},{label:"iPhone 15 Pro Max",screen:{width:430,height:932},slots:{rectangular:{width:172,height:77},circular:{width:62,height:62},inline:{width:258,height:21},small:{width:170,height:170},medium:{width:364.33,height:170},large:{width:364.33,height:382},xlarge:{width:364.33,height:592}},measured:!1},{label:"iPhone 17 Pro Max",screen:{width:440,height:956},slots:{rectangular:{width:176,height:79},circular:{width:63,height:63},inline:{width:264,height:21},small:{width:174,height:174},medium:{width:373,height:174},large:{width:373,height:391},xlarge:{width:373,height:606}},measured:!1}],Td=er.find(e=>e.measured);function In(e,n){return e.slots[n]??$e[n]}function jh(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return er.find(a=>a.screen.width===t&&a.screen.height===i)}function qh(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return Qa.find(a=>a.screen.width===t&&a.screen.height===i)}function Uo(e,n){let t=$e[n];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/t.width,e.height/t.height),a=t.width*i,r=t.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var Yx={watch:["accent","plain","picture"],phone:["phonePrimary","phoneAccent"]},Ed=[{label:"Orange",hex:"#FF9F0A"},{label:"Red",hex:"#FF453A"},{label:"Green",hex:"#30D158"},{label:"Blue",hex:"#0A84FF"},{label:"Purple",hex:"#BF5AF2"},{label:"White",hex:"#FFFFFF"}];function Xx(e,n="watch",t=!1){let i=e!=="text"&&e!=="imageTime"&&e!=="tap"&&e!=="image";return n==="phone"?t||i?"phoneAccent":"phonePrimary":i||t?"accent":e==="image"?"picture":"plain"}function Jx(e){let n=ze(e)??{color:"#FFFFFF",opacity:1},t=i=>{let a=parseInt(n.color.slice(1+i*2,3+i*2),16);return Math.round(a+(255-a)*.5).toString(16).padStart(2,"0").toUpperCase()};return`#${t(0)}${t(1)}${t(2)}`}function Zx(e,n){let t=e==="phoneAccent"?Jx(n):n,i=ze(t)??{color:"#FFFFFF",opacity:1},a=c=>(parseInt(i.color.slice(1+c*2,3+c*2),16)/255).toFixed(4),[r,o,s]=e==="plain"?["1","1","1"]:[a(0),a(1),a(2)];return`0 0 0 0 ${r} 0 0 0 0 ${o} 0 0 0 0 ${s} ${e==="picture"||e==="phoneAccent"||e==="phonePrimary"?"0.2126 0.7152 0.0722 0 0":"0 0 0 1 0"}`}function Qx(e,n,t){return w`${Yx[t].map(i=>w`<filter id=${`${e}-${i}`} filterUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000"
    color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=${Zx(i,n)} />${t==="phone"?w`<feComposite in2="SourceGraphic" operator="in" />`:m}</filter>`)}`}function bi(e,n,t){return t===void 0?e:w`<g filter=${`url(#${t}-${n})`}>${e}</g>`}var ew=0;function tw(e,n,t){if(t===void 0)return e;let i=ze(t.colorHex)??{color:"#000000",opacity:1},a=Math.max(0,t.radius)/2;return w`<filter id=${n} filterUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000"
      color-interpolation-filters="sRGB">
      <feDropShadow dx=${t.dx} dy=${t.dy} stdDeviation=${a}
        flood-color=${i.color} flood-opacity=${i.opacity} /></filter>
    <g filter=${`url(#${n})`}>${e}</g>`}function Th(e,n){if(n===void 0||!(n>0))return m;let t=Qi(n,e),i=[],a=n<.025,r=l=>l===0?"rgba(10,132,255,0.6)":a&&l%10!==0?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.14)",o=Math.floor(.5/t.x+1e-6);for(let l=-o;l<=o;l++){let d=(.5+l*t.x)*e.width;d<=0||d>=e.width||i.push(w`<line x1=${d} y1="0" x2=${d} y2=${e.height} stroke=${r(l)} stroke-width="0.5" vector-effect="non-scaling-stroke" />`)}let s=Math.floor(.5/t.y+1e-6);for(let l=-s;l<=s;l++){let d=(.5+l*t.y)*e.height;d<=0||d>=e.height||i.push(w`<line x1="0" y1=${d} x2=${e.width} y2=${d} stroke=${r(l)} stroke-width="0.5" vector-effect="non-scaling-stroke" />`)}return w`<g class="snap-grid" pointer-events="none">${i}</g>`}function Eh(e,n){if(n===void 0||n.length===0)return m;let t=n.map(i=>i.axis==="x"?w`<line x1=${i.at*e.width} y1="0" x2=${i.at*e.width} y2=${e.height}
        stroke="#FF375F" stroke-width="1" vector-effect="non-scaling-stroke" />`:w`<line x1="0" y1=${i.at*e.height} x2=${e.width} y2=${i.at*e.height}
        stroke="#FF375F" stroke-width="1" vector-effect="non-scaling-stroke" />`);return w`<g class="smart-guides" pointer-events="none">${t}</g>`}var Po={regular:400,medium:500,semibold:600,bold:700},Fh={default:"-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif",rounded:"'SF Pro Rounded', 'Varela Round', 'Trebuchet MS', -apple-system, 'Helvetica Neue', sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, Monaco, 'Courier New', monospace",serif:"'New York', ui-serif, Georgia, 'Times New Roman', serif"},zo=e=>Fh[e??"default"]??Fh.default,nw={condensed:"75%",compressed:"62.5%",expanded:"125%"};function Oo(e,n){let t=[];e&&t.push("font-variant-numeric: tabular-nums");let i=nw[n??"standard"];return i!==void 0&&t.push(`font-stretch: ${i}`),t.length>0?t.join("; "):m}var Yh=1.15;function ze(e){if(!e)return;let n=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n))return;let t=n.length===8?parseInt(n.slice(6,8),16)/255:1;return{color:`#${n.slice(0,6)}`,opacity:t}}function ue(e,n,t="#FFFFFF"){let i=ze(e)??{color:t,opacity:1};return{[n]:i.color,[`${n}-opacity`]:i.opacity}}function iw(e){return[...e.stops].sort((n,t)=>n.at-t.at).map(n=>{let t=ze(n.colorHex)??{color:"#FFFFFF",opacity:1};return w`<stop offset=${Math.max(0,Math.min(1,n.at))} stop-color=${t.color} stop-opacity=${t.opacity} />`})}function Wo(e){let n=`wafill-${Md()}`,t=iw(e);if(e.kind==="radial")return{defs:w`<radialGradient id=${n} cx="0.5" cy="0.5" r="0.5">${t}</radialGradient>`,paint:`url(#${n})`};let i=(e.angle??0)*Math.PI/180,a=Math.cos(i)/2,r=Math.sin(i)/2;return{defs:w`<linearGradient id=${n} x1=${.5-a} y1=${.5-r} x2=${.5+a} y2=${.5+r}>${t}</linearGradient>`,paint:`url(#${n})`}}var aw=48;function Xh(e,n){if(e===void 0){let a=ue(n,"fill");return{defs:m,fill:a.fill,opacity:a["fill-opacity"]}}let{defs:t,paint:i}=Wo(e);return{defs:t,fill:i,opacity:1}}var Nt=e=>e*.55;function rw(e,n){let t={scale:1,placements:[]},i=n.radius;if(i<=0||e.length===0)return t;let a=n.sweep;if(a===0)return t;let r=i*Math.abs(a)*Math.PI/180,o=e.reduce((b,y)=>b+y,0)+n.spacing*(e.length-1);if(o<=0)return t;let s=o>r?Math.max(.5,r/o):1,l=e.map(b=>b*s),d=n.spacing*s,c=o*s,u=a<0?-1:1,p=180/(Math.PI*i),f=n.angle-u*c*p/2,g=l.map(b=>{let y=f+u*b*p/2;return f+=u*(b+d)*p,{angle:y,rotation:n.flip?y+180:y}});return{scale:s,placements:g}}function Jh(e,n,t,i){let a=i*Math.PI/180;return{x:e+t*Math.sin(a),y:n-t*Math.cos(a)}}function ow(e){let n={fontSize:e.fontSize,fontWeight:e.fontWeight,fontDesign:e.fontDesign,fontWidth:e.fontWidth,italic:e.italic,colorHex:e.colorHex},t=e.parts!==void 0&&e.parts.map(s=>s.text).join("")===e.text,i=t?nf(e.parts):void 0,a=t?void 0:Qh(e.text,e.spans),r=[],o=0;for(let s of e.text){let l=i?.[o]??(a===void 0?n:{...n,colorHex:a[o]});r.push({text:s,look:l}),o+=s.length}return r}function sw(e,n){let t=Jh(0,0,n.anchor-n.radius,n.angle);return{x:e.cx+t.x,y:e.cy+t.y}}function lw(e,n){if(e.arc===void 0||e.text==="")return;let t=ow(e),i=t.map(o=>Nt(o.look.fontSize)*o.text.length),a=rw(i,e.arc);if(a.placements.length===0)return;let r=sw(n,e.arc);return{glyphs:t,layout:a,cx:r.x,cy:r.y,radius:e.arc.radius}}function dw(e,n){let t=lw(e,n);if(t===void 0)return m;let{glyphs:i,layout:a,radius:r,cx:o,cy:s}=t;return w`${a.placements.map((l,d)=>{let c=i[d],u=c.look,p=ue(u.colorHex,"fill"),f=Jh(o,s,r,l.angle);return w`<text x="0" y="0" text-anchor="middle" dominant-baseline="central"
      transform=${`translate(${f.x} ${f.y}) rotate(${l.rotation})`}
      font-family=${zo(u.fontDesign)} font-style=${u.italic?"italic":"normal"}
      font-size=${u.fontSize*a.scale} font-weight=${Po[u.fontWeight]??400}
      style=${Oo(e.monospacedDigits,u.fontWidth)}
      fill=${p.fill} fill-opacity=${p["fill-opacity"]}>${c.text}</text>`})}`}function Zh(e,n){switch(e){case"leading":return{anchor:"start",x:n.x};case"trailing":return{anchor:"end",x:n.x+n.w};default:return{anchor:"middle",x:n.cx}}}function cw(e,n,t){let i=e.split(/\s+/).filter(s=>s!==""),a=Math.max(1,Math.min(t,i.length));if(a<2)return[e];let r=[],o=0;for(let s=0;s<a-1;s++){let l=i.length-(a-1-s)-1,d=i[o],c=o+1;for(let u=o+1;u<=l;u++){let p=`${d} ${i[u]}`;if(p.length>n)break;d=p,c=u+1}r.push(d),o=c}return r.push(i.slice(o).join(" ")),r}function uw(e,n,t){if(t<=0||e.length*Nt(n)<=t)return e;let i=t-.8*n,a=Math.max(1,Math.floor(i/Nt(n)));return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function Qh(e,n){if(!n||n.map(i=>i.text).join("")!==e)return;let t=[];for(let i of n)for(let a=0;a<i.text.length;a++)t.push(i.colorHex);return t}function ef(e,n){if(n.length<2)return[0];let t=[...e.matchAll(/\S+/g)].map(i=>i.index);return[t[0]??0,t[n[0].split(" ").length]??e.length]}function tf(e,n,t,i,a){let r=[],o=n,s=a,l=d=>d<t.length&&/\s/.test(t[d]);for(let d of e){let c=s;if(/\s/.test(d))for(l(o)&&(c=i[o]);l(o);)o++;else{for(;l(o);)o++;t.startsWith(d,o)&&(c=i[o],o+=d.length)}s=c;let u=r.at(-1);u&&u.look===c?u.text+=d:r.push({text:d,look:c})}return r}function nf(e){let n=[];for(let t of e){let i=t.spans!==void 0&&t.spans.map(a=>a.text).join("")===t.text?t.spans:[{text:t.text,colorHex:t.colorHex}];for(let a of i){let r={fontSize:t.fontSize,fontWeight:t.fontWeight,fontDesign:t.fontDesign,fontWidth:t.fontWidth,italic:t.italic,colorHex:a.colorHex};for(let o=0;o<a.text.length;o++)n.push(r)}}return n}function af(e,n){return e.reduce((t,i)=>t+i.text.length*Nt(i.look.fontSize*n),0)}function pw(e,n,t,i){let a=[...e.matchAll(/\S+/g)],r=Math.max(1,Math.min(i,a.length));if(r<2)return[e];let o=c=>n[c]?.fontSize??0,s=c=>c.map(u=>u[0]).join(" "),l=[],d=0;for(let c=0;c<r-1;c++){let u=a.length-(r-1-c)-1,p=0,f=d;for(let g=d;g<=u;g++){let b=a[g].index??0,y=g===d?0:Nt(o(b-1));for(let x=b;x<b+a[g][0].length;x++)y+=Nt(o(x));if(g>d&&p+y>t)break;p+=y,f=g+1}l.push(s(a.slice(d,f))),d=f}return l.push(s(a.slice(d))),l}function hw(e,n,t){if(t<=0||af(e,n)<=t)return[...e];let i=[],a=0,r=0;e:for(let s of e){let l=s.look.fontSize*n,d=t-.8*l,c="";for(let u of s.text){if(r>0&&a+u.length*Nt(l)>d){c!==""&&i.push({text:c,look:s.look});break e}c+=u,a+=u.length*Nt(l),r+=1}i.push({text:c,look:s.look})}for(;i.length>0;){let s=i.at(-1);if(s.text=s.text.replace(/\s+$/,""),s.text!=="")break;i.pop()}let o=i.at(-1);return o?o.text+="\u2026":e[0]&&i.push({text:"\u2026",look:e[0].look}),i}function fw(e,n,t){let i=nf(n),a=e.lineLimit>1&&t.w>0?pw(e.text,i,t.w,e.lineLimit):[e.text],r=ef(e.text,a),o=a.map(($,k)=>tf($,r[k]??0,e.text,i,i[0])),s=Math.max(...o.map($=>af($,1))),l=s>t.w&&t.w>0?Math.max(e.minimumScale,t.w/s):1,d=o.map($=>hw($,l,t.w)),{anchor:c,x:u}=Zh(e.alignment,t),p=Math.max(0,...d.flat().map($=>$.look.fontSize))*l||e.fontSize*l,f=.35*p,g=p*1.15,b=$=>$.map(k=>{let C=ue(k.look.colorHex,"fill");return w`<tspan font-size=${k.look.fontSize*l} font-weight=${Po[k.look.fontWeight]??400}
      font-family=${zo(k.look.fontDesign)} font-style=${k.look.italic?"italic":"normal"}
      style=${Oo(!1,k.look.fontWidth)}
      fill=${C.fill} fill-opacity=${C["fill-opacity"]}>${k.text}</tspan>`}),y=ue(e.colorHex,"fill"),x=d.length>1?w`${d.map(($,k)=>w`<tspan x=${u} y=${t.cy+f+(k-(d.length-1)/2)*g}>${b($)}</tspan>`)}`:b(d[0]);return w`<text x=${u} y=${t.cy+f} text-anchor=${c}
    font-family=${zo(e.fontDesign)} font-style=${e.italic?"italic":"normal"}
    font-size=${e.fontSize*l} font-weight=${Po[e.fontWeight]??400}
    style=${Oo(e.monospacedDigits,e.fontWidth)}
    fill=${y.fill} fill-opacity=${y["fill-opacity"]}>${x}</text>`}function mw(e,n){if(e.arc!==void 0)return dw(e,n);if(e.parts!==void 0&&e.countdownEnd===void 0&&e.parts.map(b=>b.text).join("")===e.text)return e.text===""?m:fw(e,e.parts,n);let t=ue(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:Ji((e.countdownEnd-Date.now())/1e3)});let i=e.lineLimit>1&&n.w>0?cw(e.text,n.w/Nt(e.fontSize),e.lineLimit):[e.text],a=Math.max(...i.map(b=>b.length))*Nt(e.fontSize),r=a>n.w&&n.w>0?Math.max(e.minimumScale,n.w/a):1,o=e.fontSize*r,s=i.map(b=>uw(b,o,n.w)),{anchor:l,x:d}=Zh(e.alignment,n),c=Qh(e.text,e.spans),u=c?ef(e.text,i):[],p=(b,y)=>c?tf(b,u[y]??0,e.text,c,e.colorHex).map(x=>{let $=ue(x.look,"fill");return w`<tspan fill=${$.fill} fill-opacity=${$["fill-opacity"]}>${x.text}</tspan>`}):b,f=o*1.15,g=s.length>1?w`${s.map((b,y)=>w`<tspan x=${d} y=${n.cy+(y-(s.length-1)/2)*f}>${p(b,y)}</tspan>`)}`:p(s[0],0);return w`<text x=${d} y=${n.cy} text-anchor=${l} dominant-baseline="central"
    font-family=${zo(e.fontDesign)} font-style=${e.italic?"italic":"normal"}
    font-size=${o} font-weight=${Po[e.fontWeight]??400}
    style=${Oo(e.monospacedDigits,e.fontWidth)}
    fill=${t.fill} fill-opacity=${t["fill-opacity"]}>${g}</text>`}var kd=2;function Fd(e,n){let t=n.w>=n.h,i=Math.max(1,e.dotCount),a=t?n.w:n.h,r=t?n.h:n.w,o=Math.max(1,Math.min(r,a/i-kd)),s=i*o+(i-1)*kd;return{horizontal:t,count:i,d:o,span:s}}function Ko(e){return e==="ring"?{start:-90,sweep:360}:{start:135,sweep:270}}function gw(e,n){let t=ue(e.colorHex,"stroke"),i=ue(e.trackColorHex,"stroke","#FFFFFF"),a=ue(e.thresholdColorHex,"stroke","#FFFFFF"),r=e.lineWidth;if(e.style==="dots"){let{horizontal:y,count:x,d:$,span:k}=Fd(e,n),C=(y?n.cx:n.cy)-k/2+$/2;return w`${Array.from({length:x},(M,D)=>{let I=C+D*($+kd),T=D<e.filledCount?e.fill===void 0?t:ue(At(e.fill,x<=1?0:D/(x-1)),"stroke"):i;return w`<circle cx=${y?I:n.cx} cy=${y?n.cy:I} r=${$/2}
        fill=${T.stroke} fill-opacity=${T["stroke-opacity"]} />`})}${Mh(e,n)}`}if(e.style==="bar"){let y=n.w,x=Math.max(r,y*e.fraction),$=1,k=Xh(e.fill,e.colorHex);return w`
      ${k.defs===m?m:w`<defs>${k.defs}</defs>`}
      <rect x=${n.x} y=${n.cy-r/2} width=${y} height=${r} rx=${r/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${n.x} y=${n.cy-r/2} width=${x} height=${r} rx=${r/2}
        fill=${k.fill} fill-opacity=${k.opacity} />
      ${e.thresholdFraction===void 0?m:w`<rect x=${n.x+Math.min(y-$,Math.max(0,y*e.thresholdFraction-$/2))}
            y=${n.cy-r/2} width=${$} height=${r}
            fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} />`}
      ${Mh(e,n)}`}let o=Math.min(n.w,n.h),s=Math.max(0,o/2-r/2),l=2*Math.PI*s,d=Ko(e.style),c=d.sweep/360,u=d.start,p=l*c,f=l*c*e.fraction,g=w`${bw(e,n,s,r)}${xw(e,n,s,r)}`;if(e.style==="needle")return w`
      <g transform="rotate(${u} ${n.cx} ${n.cy})">
        <circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
          stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
          stroke-dasharray="${p} ${l}" />
        ${e.thresholdFraction===void 0?m:Rh(n,s,r,d.sweep*e.thresholdFraction,e.thresholdColorHex)}
      </g>
      ${ww(e,n,s,r)}
      ${g}`;let b=e.fill===void 0?w`<circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${t.stroke} stroke-opacity=${t["stroke-opacity"]}
        stroke-dasharray="${f} ${l}" />`:yw(e.fill,n,s,r,d,e.fraction);return w`
    <g transform="rotate(${u} ${n.cx} ${n.cy})">
      <circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${p} ${l}" />
      ${e.fraction>0?b:m}
      ${e.thresholdFraction===void 0?m:Rh(n,s,r,d.sweep*e.thresholdFraction,e.thresholdColorHex)}
    </g>
    ${g}`}function yw(e,n,t,i,a,r){let o=Math.max(0,Math.min(1,r)),s=Math.max(1,Math.round(aw*o)),l=a.sweep*o/s,d=c=>{let u=c*Math.PI/180;return{x:n.cx+Math.cos(u)*t,y:n.cy+Math.sin(u)*t}};return w`${Array.from({length:s},(c,u)=>{let p=d(u*l-(u===0?0:.2)),f=d((u+1)*l),g=ze(At(e,(u+.5)*l/a.sweep))??{color:"#FFFFFF",opacity:1};return w`<path d=${`M${p.x} ${p.y} A ${t} ${t} 0 0 1 ${f.x} ${f.y}`} fill="none"
      stroke-width=${i} stroke-linecap=${u===0||u===s-1?"round":"butt"}
      stroke=${g.color} stroke-opacity=${g.opacity} />`})}`}function bw(e,n,t,i){if(e.tickCount<=0)return m;let a=ue(e.tickColorHex,"stroke"),r=Ko(e.style==="ring"?"ring":e.style==="needle"?"needle":"arc"),o=e.tickCount,s=e.style==="ring"?o:Math.max(1,o-1);return w`${Array.from({length:o},(l,d)=>{let c=e.tickMajorEvery>0&&d%e.tickMajorEvery===0,u=e.tickLength*(c?1.6:1),p=(r.start+r.sweep*d/s)*Math.PI/180,f=Math.cos(p),g=Math.sin(p),b=t-i/2-.5,y=Math.max(0,b-u);return w`<line x1=${n.cx+f*y} y1=${n.cy+g*y}
      x2=${n.cx+f*b} y2=${n.cy+g*b}
      stroke-width=${c?1.2:.8} stroke-linecap="round"
      stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} />`})}`}function xw(e,n,t,i){if(!e.showsLabels)return m;let a=ue(e.labelColorHex,"fill"),r=Ko(e.style==="ring"?"ring":e.style==="needle"?"needle":"arc"),o=e.labelSize,s=c=>{let u=c*Math.PI/180,p=Math.max(0,t-i/2-o*.7);return{x:n.cx+Math.cos(u)*p,y:n.cy+Math.sin(u)*p+o*.36}},l=e.style==="ring"?m:w`${[[r.start,_a(e.minValue)],[r.start+r.sweep,_a(e.maxValue)]].map(([c,u])=>{let p=s(c);return w`<text x=${p.x} y=${p.y} text-anchor="middle" font-size=${o} font-family=${Go}
          fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${u}</text>`})}`,d=e.style==="needle"&&e.valueText!==""?w`<text x=${n.cx} y=${n.cy+t*.55+o*.36} text-anchor="middle" font-size=${o*1.2} font-weight="600" font-family=${Go}
        fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${e.valueText}</text>`:m;return w`${l}${d}`}var Go="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif";function ww(e,n,t,i){let a=Ko("needle"),r=(a.start+a.sweep*Math.max(0,Math.min(1,e.fraction)))*Math.PI/180,o=Math.max(0,t-i/2-1),s=ue(e.fill===void 0?e.colorHex:At(e.fill,e.fraction),"fill"),l=Math.max(1,i*.8);return w`
    <line x1=${n.cx} y1=${n.cy} x2=${n.cx+Math.cos(r)*o} y2=${n.cy+Math.sin(r)*o}
      stroke-width=${i} stroke-linecap="round" stroke=${s.fill} stroke-opacity=${s["fill-opacity"]} />
    <circle cx=${n.cx} cy=${n.cy} r=${l} fill=${s.fill} fill-opacity=${s["fill-opacity"]} />`}function Mh(e,n){let t=e.style==="dots"?Fd(e,n).d:e.lineWidth,i=e.tickCount>0?w`${(()=>{let s=ue(e.tickColorHex,"stroke"),l=Math.max(1,e.tickCount-1);return Array.from({length:e.tickCount},(d,c)=>{let u=e.tickMajorEvery>0&&c%e.tickMajorEvery===0,p=e.tickLength*(u?1.6:1),f=n.x+n.w*c/l,g=n.cy+t/2+.5;return w`<line x1=${f} y1=${g} x2=${f} y2=${g+p}
            stroke-width=${u?1.2:.8} stroke-linecap="round"
            stroke=${s.stroke} stroke-opacity=${s["stroke-opacity"]} />`})})()}`:m;if(!e.showsLabels)return w`${i}`;let a=ue(e.labelColorHex,"fill"),r=e.labelSize,o=n.cy+t/2+(e.tickCount>0?e.tickLength*1.6:0)+r;return w`${i}
    <text x=${n.x} y=${o} text-anchor="start" font-size=${r} font-family=${Go}
      fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${_a(e.minValue)}</text>
    <text x=${n.x+n.w} y=${o} text-anchor="end" font-size=${r} font-family=${Go}
      fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${_a(e.maxValue)}</text>`}function Rh(e,n,t,i,a){let r=ue(a,"stroke","#FFFFFF"),o=i*Math.PI/180,s=Math.cos(o),l=Math.sin(o),d=t/2+1;return w`<line x1=${e.cx+s*(n-d)} y1=${e.cy+l*(n-d)}
    x2=${e.cx+s*(n+d)} y2=${e.cy+l*(n+d)}
    stroke-width="1" stroke=${r.stroke} stroke-opacity=${r["stroke-opacity"]} />`}function vw(e,n){let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=gi(e,n),o=r?Rd(e,n,t,i):void 0;if(e.values.length===0)return o===void 0?m:w`${o}`;let s=$w(e,a);return o===void 0?s:w`${s}${o}`}function wd(e){switch(e.kind){case"smooth":return`C${e.c1.x} ${e.c1.y} ${e.c2.x} ${e.c2.y} ${e.end.x} ${e.end.y}`;case"step":return`L${e.corner.x} ${e.corner.y} L${e.end.x} ${e.end.y}`;case"straight":return`L${e.end.x} ${e.end.y}`}}var Hh=0;function Md(){return Hh+=1,Hh.toString(36)}function No(e,n,t){let{x:i,y:a,w:r,h:o}=e,s=Math.max(0,n);if(s===0)return`M${i} ${a} L${i+r} ${a} L${i+r} ${a+o} L${i} ${a+o} Z`;if(s>o){let l=Math.sqrt(o*(2*s-o)),d=i+s-l,c=i+r-s+l;return t?`M${d} ${a} L${c} ${a} A${s} ${s} 0 0 1 ${i+r-s} ${a+o} L${i+s} ${a+o} A${s} ${s} 0 0 1 ${d} ${a} Z`:`M${d} ${a+o} A${s} ${s} 0 0 1 ${i+s} ${a} L${i+r-s} ${a} A${s} ${s} 0 0 1 ${c} ${a+o} Z`}return t?`M${i} ${a} L${i+r} ${a} L${i+r} ${a+o-s} A${s} ${s} 0 0 1 ${i+r-s} ${a+o} L${i+s} ${a+o} A${s} ${s} 0 0 1 ${i} ${a+o-s} Z`:`M${i} ${a+o} L${i} ${a+s} A${s} ${s} 0 0 1 ${i+s} ${a} L${i+r-s} ${a} A${s} ${s} 0 0 1 ${i+r} ${a+s} L${i+r} ${a+o} Z`}function kw(e,n,t,i){let a=n.x,r=n.x+n.w;if(i){let l=e.y,d=n.y+n.h;return t===0?`M${a} ${l} L${a} ${d} L${r} ${d} L${r} ${l}`:`M${a} ${l} L${a} ${d-t} A${t} ${t} 0 0 0 ${a+t} ${d} L${r-t} ${d} A${t} ${t} 0 0 0 ${r} ${d-t} L${r} ${l}`}let o=e.y+e.h,s=n.y;return t===0?`M${a} ${o} L${a} ${s} L${r} ${s} L${r} ${o}`:`M${a} ${o} L${a} ${s+t} A${t} ${t} 0 0 1 ${a+t} ${s} L${r-t} ${s} A${t} ${t} 0 0 1 ${r} ${s+t} L${r} ${o}`}function $w(e,n){let t=Ro(e,n),i=Md(),a=ue(e.colorHex,"fill"),r=ue(e.highColorHex,"fill",e.colorHex),o=ue(e.lowColorHex,"fill",e.colorHex),s=(y,x)=>w`<circle cx=${y.x} cy=${y.y} r="1.7" fill=${x.fill} fill-opacity=${x["fill-opacity"]} />`,l=[],d=new Map,c=e.pointColorHexes.length===t.count,u=y=>c?ue(e.pointColorHexes[y],"fill",e.colorHex):a,p=y=>{let x=ze(y)??ze(e.colorHex)??{color:"#FFFFFF",opacity:1};if(e.fillStyle!=="fade")return{fill:x.color,opacity:x.opacity*.28};let $=Cw(i,e.id,y),k=t.baselineY<=t.plotTop?t.plotBottom:t.plotTop;return d.has($)||d.set($,w`<linearGradient id=${$} gradientUnits="userSpaceOnUse" x1="0" y1=${k} x2="0" y2=${t.baselineY}>
        <stop offset="0" stop-color=${x.color} stop-opacity=${x.opacity*.28} />
        <stop offset="1" stop-color=${x.color} stop-opacity="0" /></linearGradient>`),{fill:`url(#${$})`,opacity:1}},f,g=y=>{if(f===void 0){let x=Wo(y);d.set("areaFill",x.defs),f={fill:x.paint,opacity:1}}return f};if(e.style==="bars")for(let y=0;y<t.count;y++){if(e.holes[y]===!0)continue;let x=t.barRect(y),$=e.barFillColorHexes.length===t.count?e.barFillColorHexes[y]:void 0,k=$!==void 0?ue($,"fill",e.colorHex):y===e.highIndex?r:y===e.lowIndex?o:u(y),C=e.barCorners==="top"?Math.min(Math.max(e.barRadius,0),x.w/2):Math.min(Math.max(e.barRadius,0),x.w/2,x.h/2),M=e.baseline==="zero"&&e.values[y]<0,D=e.barCorners==="top"&&M,I=e.barBorderWidth>0&&e.barBorderColorHexes.length===t.count?e.barBorderColorHexes[y]:void 0,T=e.barBorderWidth,F=I!==void 0&&(x.w<=2*T||x.h<=2*T),N=F?ue(I,"fill",e.colorHex):k;if(e.barCorners==="top"?l.push(w`<path d=${No(x,C,D)}
          fill=${N.fill} fill-opacity=${N["fill-opacity"]} />`):l.push(w`<rect x=${x.x} y=${x.y} width=${x.w} height=${x.h} rx=${C}
          fill=${N.fill} fill-opacity=${N["fill-opacity"]} />`),I!==void 0&&!F){let j=ue(I,"fill",e.colorHex),B={x:x.x+T/2,y:x.y+T/2,w:x.w-T,h:x.h-T},W=e.barCorners==="top"?Math.min(Math.max(C-T/2,0),B.w/2):Math.min(Math.max(C-T/2,0),B.w/2,B.h/2);if(e.barBorderOpenBase){let X=`${i}bb${y}`,z=e.barCorners==="top"?w`<path d=${No(x,C,D)} />`:w`<rect x=${x.x} y=${x.y} width=${x.w} height=${x.h} rx=${C} />`;d.set(X,w`<clipPath id=${X}>${z}</clipPath>`),l.push(w`<path d=${kw(x,B,W,M)} fill="none" stroke=${j.fill} stroke-opacity=${j["fill-opacity"]} stroke-width=${T} clip-path=${`url(#${X})`} />`);continue}let ne=e.barCorners==="top"?No(B,W,D):No(B,0,!1);e.barCorners==="top"||W===0?l.push(w`<path d=${ne} fill="none" stroke=${j.fill} stroke-opacity=${j["fill-opacity"]} stroke-width=${T} />`):l.push(w`<rect x=${B.x} y=${B.y} width=${B.w} height=${B.h} rx=${W}
            fill="none" stroke=${j.fill} stroke-opacity=${j["fill-opacity"]} stroke-width=${T} />`)}}else{let y=Array.from({length:t.count},(C,M)=>t.point(M)),x=e.holes.length>0,k=gh(t.count,e.holes).filter(C=>!x||C.length>1).map(C=>{let M=C.map(T=>y[T]),D=mh(M,e.curve),I=`M${M[0].x} ${M[0].y}${D.map(T=>` ${wd(T)}`).join("")}`;return{run:C,pts:M,legs:D,line:I}});if(e.style==="area")for(let{run:C,pts:M,legs:D,line:I}of k)if(e.fillBands&&c&&C.length>1&&e.fillColorHex===void 0)for(let T=0;T<D.length;T++){let F=M[T],N=M[T+1],j=p(e.pointColorHexes[C[T+1]]),B=`M${F.x} ${F.y} ${wd(D[T])} L${N.x} ${t.baselineY} L${F.x} ${t.baselineY} Z`;l.push(w`<path d=${B} fill=${j.fill} fill-opacity=${j.opacity} stroke="none" />`)}else{let T=e.areaFill===void 0?p(e.fillColorHex??e.colorHex):g(e.areaFill),F=`${I} L${M[M.length-1].x} ${t.baselineY} L${M[0].x} ${t.baselineY} Z`;l.push(w`<path d=${F} fill=${T.fill} fill-opacity=${T.opacity} stroke="none" />`)}for(let{run:C,pts:M,legs:D,line:I}of k)if(c&&C.length>1)for(let T=0;T<D.length;T++){let F=M[T],N=u(C[T+1]);l.push(w`<path d=${`M${F.x} ${F.y} ${wd(D[T])}`} fill="none"
            stroke=${N.fill} stroke-opacity=${N["fill-opacity"]}
            stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else l.push(w`<path d=${I} fill="none" stroke=${a.fill} stroke-opacity=${a["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&l.push(s(y[e.highIndex],r)),e.lowIndex!==void 0&&l.push(s(y[e.lowIndex],o))}let b=(y,x,$,k)=>{if(y===void 0||x==="none")return;let C=t.markerCenter(y,e.style==="bars",k);l.push(x==="triangle"?w`<path d=${`M${C.x} ${C.y-1.8} L${C.x+2.2} ${C.y+1.8} L${C.x-2.2} ${C.y+1.8} Z`}
          fill=${$.fill} fill-opacity=${$["fill-opacity"]} />`:s(C,$))};if(b(e.highIndex,e.highMarker,r,"high"),b(e.lowIndex,e.lowMarker,o,"low"),e.drawsThreshold&&e.thresholdY!==void 0){let y=t.yAtFraction(e.thresholdY),x=ue(e.thresholdColorHex,"fill",e.colorHex);l.push(w`<path d=${`M${t.plotLeft} ${y} L${t.plotRight} ${y}`} fill="none"
      stroke=${x.fill} stroke-opacity=${x["fill-opacity"]}
      stroke-width="1" stroke-dasharray="2 2" />`)}if(e.drawsNowLine&&e.nowIndex!==void 0&&e.nowIndex<t.count){let y=t.markerCenter(e.nowIndex,e.style==="bars").x,x=ue(e.nowColorHex,"fill",e.colorHex);l.push(w`<path d=${`M${y} ${t.plotTop} L${y} ${t.plotBottom}`} fill="none"
      stroke=${x.fill} stroke-opacity=${x["fill-opacity"]} stroke-width="1" />`)}return d.size===0?w`${l}`:w`<defs>${[...d.values()]}</defs>${l}`}function Cw(e,n,t){return`chartfade-${e}-${n}-${t}`.replace(/[^0-9A-Za-z_-]/g,"")}function Rd(e,n,t,i){let a=(e.labelsAbove?n.y:n.y+n.h-i)+i/2,r=ue(e.labelColorHex,"fill");return e.labels.map((o,s)=>{let d=s===e.labels.length-1?"end":s===0?"start":"middle",c=n.x+o.position*n.w;return w`<text x=${c} y=${a} text-anchor=${d} dominant-baseline="central"
      font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size=${t} font-weight="400"
      fill=${r.fill} fill-opacity=${r["fill-opacity"]}>${o.text}</text>`})}function Sw(e,n){if(e.runs.length===0&&e.labels.length===0||n.w<=0||n.h<=0)return m;let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=gi(e,n),o=Math.max(0,Math.min(e.gap,n.w/Math.max(1,e.runs.length))),s=e.runs.map((l,d)=>{let c=n.x+l.start*n.w,u=(l.end-l.start)*n.w,p=d===e.runs.length-1,f=Math.max(p?u:Math.min(u,.5),u-(p?0:o)),g=Math.max(0,Math.min(e.cornerRadius,f/2,a.h/2)),b=ue(l.colorHex,"fill");return w`<rect x=${c} y=${a.y} width=${f} height=${a.h} rx=${g}
      fill=${b.fill} fill-opacity=${b["fill-opacity"]} />`});return r?w`${s}${Rd(e,n,t,i)}`:w`${s}`}function Tw(e,n){if(e.labels.length===0||n.w<=0||n.h<=0)return m;let{labelSize:t,rowHeight:i}=gi({labels:e.labels,labelSize:e.labelSize,labelsAbove:!1},n),a={...n,y:n.cy-i/2,h:i};return w`${Rd({labels:e.labels,labelColorHex:e.labelColorHex,labelsAbove:!1},a,t,i)}`}function rf(e,n){if(!(e===void 0||n.w<=0||n.h<=0))return{chart:e,g:Ro(e,gi(e,n).body)}}function Ew(e,n,t,i=!1,a=0){let r=rf(t,n);if(e.indices.length===0||r===void 0)return m;let o=r.chart,s=o.pointColorHexes.length===o.values.length,l=Math.max(e.diameter/2,a),d=new Map,c=l+1.2,u="";for(let f of e.indices){if(f>=o.values.length)continue;let g=r.g.point(f),b=e.colorHex??(s?o.pointColorHexes[f]:o.colorHex);d.set(b,`${d.get(b)??""}M${g.x-l} ${g.y} a${l} ${l} 0 1 0 ${2*l} 0 a${l} ${l} 0 1 0 ${-2*l} 0 Z`),i&&(u+=`M${g.x-c} ${g.y} a${c} ${c} 0 1 0 ${2*c} 0 a${c} ${c} 0 1 0 ${-2*c} 0 Z`)}let p=i&&u!==""?w`<path d=${u} fill="none" stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:m;return w`${p}${[...d].map(([f,g])=>{let b=ue(f,"fill",o.colorHex);return w`<path d=${g} fill=${b.fill} fill-opacity=${b["fill-opacity"]} stroke="transparent" stroke-width="3" />`})}`}function Fw(e,n,t,i=!1,a=0){let r=rf(t,n);if(!e.draws||r===void 0)return m;let o=ze(e.colorHex)??{color:"#FFFFFF",opacity:.2},s=fh(r.g,e.lines);return w`${s.map(l=>w`<path d=${`M${r.g.plotLeft} ${l} L${r.g.plotRight} ${l}`} fill="none"
    stroke=${o.color} stroke-opacity=${Math.max(o.opacity,a>0?.6:0)} stroke-width=${Math.max(e.thickness,a)} />`)}${i?s.map(l=>w`<path d=${`M${r.g.plotLeft} ${l} L${r.g.plotRight} ${l}`} fill="none" stroke="#0A84FF"
        stroke-width="1" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />`):m}`}function Ah(e){let n=Math.min(e.w,e.h);return{x:e.cx-n/2,y:e.cy-n/2,w:n,h:n,cx:e.cx,cy:e.cy}}var Za=4;function Mw(e,n){let t=e.w>=e.h,i=t?e.h:e.w,a=Math.min(i,Math.max(Za,Math.max(0,n)));return t?{x:e.x,y:e.cy-a/2,w:e.w,h:a,cx:e.cx,cy:e.cy}:{x:e.cx-a/2,y:e.y,w:a,h:e.h,cx:e.cx,cy:e.cy}}function Hd(e,n){if(e.kind==="shape")return e.shapeKind==="circle"?Ah(n):e.shapeKind==="line"?Mw(n,e.thickness):n;if(e.kind==="icon"){let t=Math.max(Za,Ad(e));return{x:n.cx-t/2,y:n.cy-t/2,w:t,h:t,cx:n.cx,cy:n.cy}}if(e.kind==="chartTimes"){if(e.labels.length===0||n.w<=0||n.h<=0)return n;let{rowHeight:t}=gi({labels:e.labels,labelSize:e.labelSize,labelsAbove:!1},n),i=Math.max(Za,t);return{x:n.x,y:n.cy-i/2,w:n.w,h:i,cx:n.cx,cy:n.cy}}if(e.kind==="imageTime"){let t=Vl(n.w,n.h);if(!e.linked||t<=0)return n;let i=Id(new Date).length*t*.578+t*.89,a=t*1.25;return{x:n.cx-i/2,y:n.cy-a/2,w:i,h:a,cx:n.cx,cy:n.cy}}if(e.kind!=="gauge")return n;switch(e.style){case"ring":case"arc":return Ah(n);case"bar":{let t=Math.max(Za,e.lineWidth);return{x:n.x,y:n.cy-t/2,w:n.w,h:t,cx:n.cx,cy:n.cy}}case"dots":{let{horizontal:t,d:i,span:a}=Fd(e,n),r=Math.max(Za,i);return t?{x:n.cx-a/2,y:n.cy-r/2,w:a,h:r,cx:n.cx,cy:n.cy}:{x:n.cx-r/2,y:n.cy-a/2,w:r,h:a,cx:n.cx,cy:n.cy}}default:return n}}function of(e,n,t){return e.kind==="shape"?e.shapeKind==="circle"?{square:!0}:e.shapeKind==="line"?{line:!0}:{}:e.kind==="chartTimes"?{bar:!0}:e.kind==="imageTime"?Lh(e,n,t):e.kind!=="gauge"?{}:e.style==="ring"||e.style==="arc"?{square:!0}:e.style==="bar"?{bar:!0}:e.style!=="dots"?{}:Lh(e,n,t)}function Lh(e,n,t){if(t.width<=0||t.height<=0)return{};let i=Hd({...e,frame:n},Zi({...e,frame:n},t));return{outline:{...n,x:i.x/t.width,y:i.y/t.height,width:i.w/t.width,height:i.h/t.height}}}function Ad(e){return e.path!==void 0&&e.path!==""?e.size*Yh:e.size}function Rw(e,n){let t=Xh(e.fill,e.fillColorHex),i={fill:t.fill,"fill-opacity":t.opacity},a=t.defs===m?m:w`<defs>${t.defs}</defs>`,r=e.borderColorHex?ze(e.borderColorHex):void 0,o=r?e.borderWidth:0,s=o/2,l=r?r.color:"none",d=r?r.opacity:0;switch(e.shapeKind){case"circle":{let c=Math.min(n.w,n.h)/2-s;return w`${a}<circle cx=${n.cx} cy=${n.cy} r=${Math.max(0,c)}
        fill=${i.fill} fill-opacity=${i["fill-opacity"]}
        stroke=${l} stroke-opacity=${d} stroke-width=${o} />`}case"capsule":{let c=Math.min(n.w,n.h)/2;return w`${a}<rect x=${n.x+s} y=${n.y+s} width=${Math.max(0,n.w-o)} height=${Math.max(0,n.h-o)} rx=${c}
        fill=${i.fill} fill-opacity=${i["fill-opacity"]}
        stroke=${l} stroke-opacity=${d} stroke-width=${o} />`}case"roundedRectangle":return w`${a}<rect x=${n.x+s} y=${n.y+s} width=${Math.max(0,n.w-o)} height=${Math.max(0,n.h-o)} rx=${e.cornerRadius}
        fill=${i.fill} fill-opacity=${i["fill-opacity"]}
        stroke=${l} stroke-opacity=${d} stroke-width=${o} />`;case"rectangle":return w`${a}<rect x=${n.x+s} y=${n.y+s} width=${Math.max(0,n.w-o)} height=${Math.max(0,n.h-o)}
        fill=${i.fill} fill-opacity=${i["fill-opacity"]}
        stroke=${l} stroke-opacity=${d} stroke-width=${o} />`;case"line":{let c=n.w>=n.h,u=Math.max(0,Math.min(e.thickness,c?n.h:n.w)),p=c?n.x:n.cx-u/2,f=c?n.cy-u/2:n.y;return w`${a}<rect x=${p} y=${f} width=${c?n.w:u} height=${c?u:n.h}
        fill=${i.fill} fill-opacity=${i["fill-opacity"]} stroke="none" />`}}}function Hw(e,n,t){if(e.path!==void 0&&e.path!==""){let o=ue(e.colorHex,"fill"),s=e.size*Yh;return w`<g transform="translate(${n.cx-s/2} ${n.cy-s/2}) scale(${s/24})">
      <path d=${e.path} fill=${o.fill} fill-opacity=${o["fill-opacity"]} /></g>`}let i=t.render(e.symbol,e.size,e.colorHex);if(i)return w`<g transform="translate(${n.cx-e.size/2} ${n.cy-e.size/2})">${i}</g>`;let a=ue(e.colorHex,"stroke"),r=e.size;return w`
    <rect x=${n.cx-r/2} y=${n.cy-r/2} width=${r} height=${r} rx=${r*.2}
      fill="none" stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central" font-size=${r*.5}
      fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} font-family="sans-serif">?</text>`}var Ld=.25,Aw=8;function Lw(e,n,t,i,a,r,o,s){let l={x:0,y:0,width:e,height:n};if(!(e>0)||!(n>0)||!(t>0)||!(i>0))return l;let d=Math.min(Math.max(Number.isFinite(r)?r:1,Ld),Aw),c=Math.max(e/t,n/i),u=Math.min(e/t,n/i),p=(a==="fit"?u:c)*d,f=t*p,g=i*p,b=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),y=Math.min(Math.max(Number.isFinite(s)?s:0,-1),1);return{x:-(f-e)/2*(1+b)+0,y:-(g-n)/2*(1+y)+0,width:f,height:g}}function Id(e){let n=e.getHours()%12||12,t=i=>String(i).padStart(2,"0");return`${n}:${t(e.getMinutes())}:${t(e.getSeconds())}`}var Do=4;function Iw(e,n,t){let i=Math.min(Math.max(e.timestampSize,4),40),a=t.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let l=e.timestampCorner.endsWith("Leading")?n.x+Do:n.x+n.w-Do-a,d=e.timestampCorner.startsWith("top")?n.y+Do:n.y+n.h-Do-r;return{x:l,y:d,w:a,h:r,size:i,label:t}}let s=(l,d,c,u)=>u>=c?d+(c-u)/2:Math.min(d+c-u,Math.max(d,l-u/2));return{x:s(n.x+e.timestampX*n.w,n.x,n.w,a),y:s(n.y+e.timestampY*n.h,n.y,n.h,r),w:a,h:r,size:i,label:t}}function Ih(e,n){if(e==="camera")return"camera.fill";switch(n.split(".")[0]){case"camera":return"camera.fill";case"person":return"person.crop.circle";case"media_player":return"music.note";default:return"photo"}}function _w(e,n){let{x:t,y:i,w:a,h:r}=e,o=d=>t+a*d,s=d=>i+r*d,l=Math.max(2,Math.min(a,r)*.11);return w`
    <defs><linearGradient id=${n} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3B5B8C" /><stop offset="0.65" stop-color="#9DB4CF" /><stop offset="1" stop-color="#E8C9A0" />
    </linearGradient></defs>
    <rect x=${t} y=${i} width=${a} height=${r} fill=${`url(#${n})`} />
    <circle cx=${o(.72)} cy=${s(.36)} r=${l} fill="#FFF3D6" fill-opacity="0.9" />
    <path d=${`M${o(0)} ${s(.7)} L${o(.22)} ${s(.42)} L${o(.4)} ${s(.6)} L${o(.58)} ${s(.38)} L${o(.86)} ${s(.66)} L${o(1)} ${s(.56)} L${o(1)} ${s(1)} L${o(0)} ${s(1)} Z`}
      fill="#5C7391" />
    <path d=${`M${o(0)} ${s(.84)} Q${o(.3)} ${s(.62)} ${o(.62)} ${s(.8)} T${o(1)} ${s(.74)} L${o(1)} ${s(1)} L${o(0)} ${s(1)} Z`}
      fill="#34475E" />
    <rect x=${t} y=${s(.92)} width=${a} height=${r*.08} fill="#232F3E" />`}function Nw(e,n,t){let i=t.icons,a=`imgclip-${Md()}-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?Iw(e,n,Id(new Date)):void 0,s=o?sf(o):m,l=e.url?t.imageSizes?.size(e.url):void 0,d;if(e.url&&l){let c=Lw(n.w,n.h,l.width,l.height,e.contentMode,e.zoom,e.panX,e.panY);d=w`<image href=${e.url} x=${n.x+c.x} y=${n.y+c.y} width=${c.width} height=${c.height}
      preserveAspectRatio="none" />`}else e.url?d=w`<image href=${e.url} x=${n.x} y=${n.y} width=${n.w} height=${n.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:t.pictureScene&&["camera.fill","photo"].includes(Ih(e.source,e.entityId))?d=_w(n,`${a}-sky`):d=w`
      <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${n.cx-7} ${n.cy-7})">${i.render(Ih(e.source,e.entityId),14,"#FFFFFF99")??m}</g>`;return w`
    <defs><clipPath id=${a}><rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${d}${s}</g>`}function sf(e,n=1){return w`<g opacity=${n}>
    <rect x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx=${e.h/2} fill="#000000" fill-opacity="0.55" />
    <text x=${e.x+e.w/2} y=${e.y+e.h/2} text-anchor="middle" dominant-baseline="central"
      font-size=${e.size} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${e.label}</text></g>`}function Dw(e,n){if(!e.linked)return m;let t=Id(new Date),i=Vl(n.w,n.h);if(i<=0)return m;let a=t.length*i*.578+i*.89,r=i*1.25;return sf({x:n.cx-a/2,y:n.cy-r/2,w:a,h:r,size:i,label:t},e.url===void 0?.5:1)}function Pw(e,n,t,i,a){if(!i)return m;let r=Math.min(10,n.w*.5,n.h*.5),o=a!==void 0?zw(a,n):void 0;return w`
    <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?w`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${$d} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?w`<g transform="translate(${n.cx-r/2} ${n.cy-r/2})" opacity="0.8">${t.render("hand.tap.fill",r,"#FFD60A")??m}</g>`:m}`}var $d=5;function zw(e,n){let t=$d*.55,i=n.w-2;if(n.h<$d*1.6||i<t*4)return;if(e.length*t<=i)return e;let a=Math.max(1,Math.floor(i/t)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function lf(e){let n=new Map;for(let t of e)t.kind==="chart"&&n.set(t.id,t);return n}function Bo(e,n,t,i=new Map,a,r="body"){if(e.isHidden&&!t.showHidden)return m;let o=t.tapReview===!0,s=t.tapAreas===!0||o,l=o?t.tapFocusId:void 0,d=l!==void 0&&e.id===l,c=l!==void 0;if(e.kind==="tap"&&!s)return m;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!o||c&&!d))return m;let u=Zi(e,n),p=o&&(!c||d),f;if(r==="body")switch(e.kind){case"text":f=mw(e,u);break;case"icon":f=Hw(e,u,t.icons);break;case"gauge":f=gw(e,u);break;case"chart":f=vw(e,u);break;case"timeline":f=Sw(e,u);break;case"chartTimes":f=Tw(e,u);break;case"imageTime":f=Dw(e,u);break;case"chartDots":f=Ew(e,u,i.get(e.chart),t.highlightId===e.id||t.highlightIds?.includes(e.id)===!0,t.minDotRadius);break;case"chartGrid":f=Fw(e,u,i.get(e.chart),t.highlightId===e.id||t.highlightIds?.includes(e.id)===!0,t.minGridStroke);break;case"shape":f=Rw(e,u);break;case"image":f=Nw(e,u,t);break;case"tap":f=Pw(e,u,t.icons,s,p?on(e.action):void 0);break}e.kind!=="tap"&&(f=tw(f,`sh-${(ew+=1).toString(36)}`,e.shadow),f=bi(f,Xx(e.kind,t.tintSurface??"watch",e.accentGroup==="accent"),a));let g=o&&(e.kind!=="tap"||c&&!d)?.35:1,b=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*g,y=t.highlightId===e.id,x=y||t.highlightIds?.includes(e.id)===!0,$=e.kind==="chartDots"||e.kind==="chartGrid",k=e.chartAnchor?.place==="through",C=t.handles===!0&&(!c||d)&&!$&&!k,M=Hd(e,u),D=x&&!$?w`<rect x=${M.x} y=${M.y} width=${M.w} height=${M.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:m,I=t.hoverId===e.id||t.hoverIds?.includes(e.id)===!0?w`<rect x=${M.x} y=${M.y} width=${M.w} height=${M.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:m,T=$?m:w`<rect x=${M.x} y=${M.y} width=${M.w} height=${M.h} fill="transparent" stroke="none" />`,F=3,N=M,j=y&&C?[["nw",N.x-F,N.y-F],["ne",N.x+N.w,N.y-F],["sw",N.x-F,N.y+N.h],["se",N.x+N.w,N.y+N.h]].map(([B,W,ne])=>w`<rect data-handle=${B} x=${W} y=${ne} width=${F} height=${F}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${B}-resize" />`):m;return r==="handles"?j===m?m:w`<g data-element-id=${e.id} opacity=${b} transform="rotate(${e.frame.rotationDegrees} ${u.cx} ${u.cy})">${j}</g>`:w`<g data-element-id=${e.id} opacity=${b} style=${C?"cursor:move":e.kind==="chartDots"?"cursor:pointer":m}
    pointer-events=${e.kind==="chartGrid"?"none":m}
    transform="rotate(${e.frame.rotationDegrees} ${u.cx} ${u.cy})">${T}${f}${I}${D}</g>`}function jo(e,n){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:n?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function _d(e,n){return(n?23.5:34)*e}var _h=10.5;function df(e,n){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*n}function Nh(e,n){let t=0;for(let i of e)t+=df(i,n);return t}function Dh(e,n,t){let i=e.toUpperCase(),a=d=>df(d,t),r=.9*t,o=0;for(let d of i)o+=a(d);if(o<=n)return i;let s=0,l="";for(let d of i){if(s+a(d)+r>n)break;l+=d,s+=a(d)}return`${l.replace(/\s+$/,"")}\u2026`}function Cd(e,n,t){let i=t*Math.PI/180;return{x:e.cx+n*Math.cos(i),y:e.cy+n*Math.sin(i)}}function Sd(e,n,t,i){let a=Cd(e,n,t),r=Cd(e,n,i);return`M ${a.x} ${a.y} A ${n} ${n} 0 0 1 ${r.x} ${r.y}`}function cf(e,n,t,i){let{dial:a}=jo(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:n,d:Sd(a,t,i.start,i.end),length:t*r}}function Ow(e,n){let t=jo(e,!0);return cf(e,n,t.dial.r,t.labelArc)}var Ph=18.5,Gw=113,Bw={start:-71,end:-36},zh=104,Vw=6.2,Oh={start:-77,end:-30.5};function Gh(e){let n=e.replace("#",""),t=i=>parseInt(n.slice(i,i+2),16)||0;return[t(0),t(2),t(4)]}function Bh(e,n){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let t=Math.min(1,Math.max(0,n))*(e.length-1),i=Math.min(e.length-2,Math.floor(t)),a=t-i,r=Gh(e[i]),o=Gh(e[i+1]),s=(l,d)=>Math.round(l+(d-l)*a);return`rgb(${s(r[0],o[0])}, ${s(r[1],o[1])}, ${s(r[2],o[2])})`}var vd=11;function Uw(e,n,t){let{dial:i}=jo(n,!0),a=zh*n,r=180/(Math.PI*zh),o=e.minLabel!==void 0?Nh(e.minLabel,vd)*r:0,s=e.maxLabel!==void 0?Nh(e.maxLabel,vd)*r:0,l=Oh.start+(o>0?Math.max(0,o-1.8):0),d=Oh.end-(s>0?Math.max(0,s-1.8):0),c=d-l,u=24,p=[];for(let x=0;x<u;x++){let $=l+c*x/u,k=Math.min(d,l+c*(x+1)/u+.4);p.push(w`<path d=${Sd(i,a,$,k)} fill="none"
      stroke=${Bh(e.colorHexes,(x+.5)/u)} stroke-width=${Vw*n}
      stroke-linecap=${x===0||x===u-1?"round":"butt"} />`)}let f=(e.value-e.minValue)/(e.maxValue-e.minValue),g=Cd(i,a,l+c*f),b=1.5,y=(x,$,k,C)=>w`
    <defs><path id=${x} d=${Sd(i,a,$,k)} /></defs>
    <text font-size=${vd*n} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${x}" startOffset="50%" text-anchor="middle">${C}</textPath></text>`;return w`${p}
    <circle cx=${g.x} cy=${g.y} r=${3.2*n} fill=${Bh(e.colorHexes,f)}
      stroke="#000000" stroke-width=${1.2*n} />
    ${e.minLabel!==void 0?y(`${t}-gmin`,l-b-Math.max(o,3),l-b,e.minLabel):m}
    ${e.maxLabel!==void 0?y(`${t}-gmax`,d+b,d+b+Math.max(s,3),e.maxLabel):m}`}function xi(e,n){let t=e.family in $e?e.family:"rectangular",i=n.slot??$e[t],a=$e[t],r=Uo(i,t),o=`clip-${t}-${Math.random().toString(36).slice(2,8)}`,s=ze(e.backgroundColorHex),l=e.backgroundFill===void 0?void 0:Wo(e.backgroundFill),d=l===void 0?s===void 0?void 0:{fill:s.color,opacity:s.opacity}:{fill:l.paint,opacity:1},c=ze(e.borderColorHex),u=e.borderWidth*r.scale,p=e.elements,f=lf(p),g=n.tint===void 0?void 0:`${o}-tint`,b=n.tintSurface??"watch",y=g===void 0?m:Qx(g,n.tint,b),x=b==="phone"?"phonePrimary":"plain",$=d!==void 0&&!(g!==void 0&&b==="phone");if(t==="corner"){let T=r.scale,F=!!e.bezelText||!!e.bezelGauge,N=e.curvedText??"",j=N!=="",B=jo(T,F),W=_d(T,F),ne=W/(a.width*T),X=B.tile.cx-W/2,z=B.tile.cy-W/2,K=`M 0 0 H ${B.quad.width-B.cornerRadius} A ${B.cornerRadius} ${B.cornerRadius} 0 0 1 ${B.quad.width} ${B.cornerRadius} V ${B.quad.height} H 0 Z`,Y=m;if(e.bezelGauge)Y=Uw(e.bezelGauge,T,o);else if(e.bezelText){let S=Ow(T,`${o}-bezel`),E=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?Ji((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;Y=w`<defs><path id=${S.id} d=${S.d} /></defs>
        <text font-size=${_h*T} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${S.id}" startOffset="50%" text-anchor="middle">${Dh(E,S.length,_h*T)}</textPath></text>`}let v=m;if(j){let S=ze(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},E=cf(T,`${o}-curved`,Gw*T,Bw);v=w`<defs><path id=${E.id} d=${E.d} /></defs>
        <text font-size=${Ph*T} font-weight="600" fill=${S.color} fill-opacity=${S.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${E.id}" startOffset="50%" text-anchor="middle">${Dh(N,E.length,Ph*T*.88)}</textPath></text>`}else{let S=e.borderWidth*r.scale*ne,E=c?w`<circle cx=${W/2} cy=${W/2} r=${W/2-S/2} fill="none" stroke=${c.color} stroke-opacity=${c.opacity} stroke-width=${S} />`:m;v=w`<g transform="translate(${X} ${z})">
        <g clip-path=${`url(#${o})`}>
          ${$?bi(w`${l===void 0?m:w`<defs>${l.defs}</defs>`}<rect width=${W} height=${W} fill=${d.fill} fill-opacity=${d.opacity} />`,x,g):m}
          <g data-design-box transform="scale(${r.scale*ne})">
            ${p.map(_=>Bo(_,a,n,f,g))}
            ${Th(a,n.grid)}
            ${Eh(a,n.guides)}
          </g>
        </g>
        <circle cx=${W/2} cy=${W/2} r=${W/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*T} stroke-dasharray=${`${2*T} ${2*T}`} />
        ${bi(E,x,g)}
        <g transform="scale(${r.scale*ne})">${Uh(p,a,n,f)}</g>
      </g>`}return w`<svg viewBox=${`0 0 ${B.quad.width} ${B.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${B.quad.width} height=${B.quad.height}>
      <defs><clipPath id=${o}><circle cx=${W/2} cy=${W/2} r=${W/2} /></clipPath>${y}</defs>
      <path d=${K} fill="#000000" />
      ${bi(Y,b==="phone"?"phoneAccent":"accent",g)}
      ${j?bi(v,b==="phone"?"phoneAccent":"accent",g):v}
      ${j?m:Vh(p,a,n.spotlightIds,`${o}-spot`,B.quad.width,B.quad.height,`translate(${X} ${z}) scale(${r.scale*ne})`)}
    </svg>`}let k=Kh(t)?Wh*r.scale:0,C=w`<rect width=${i.width} height=${i.height} rx=${k} />`,M=c?w`<rect x=${u/2} y=${u/2} width=${i.width-u} height=${i.height-u} rx=${Math.max(0,k-u/2)} fill="none" stroke=${c.color} stroke-opacity=${c.opacity} stroke-width=${u} />`:m,D=w`<rect width=${i.width} height=${i.height} rx=${k} fill="#000000" />`,I=`0 0 ${i.width} ${i.height}`;return w`<svg viewBox=${I} xmlns="http://www.w3.org/2000/svg" class="complication ${t}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${C}</clipPath>${y}</defs>
    <g clip-path=${`url(#${o})`}>
      ${D}
      ${$?bi(w`${l===void 0?m:w`<defs>${l.defs}</defs>`}<rect width=${i.width} height=${i.height} rx=${k} fill=${d.fill} fill-opacity=${d.opacity} />`,x,g):m}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${p.map(T=>Bo(T,a,n,f,g))}
            ${Th(a,n.grid)}
            ${Eh(a,n.guides)}
      </g>
    </g>
    ${bi(M,x,g)}
    <g transform="translate(${r.x} ${r.y}) scale(${r.scale})">${Uh(p,a,n,f)}</g>
    ${Vh(p,a,n.spotlightIds,`${o}-spot`,i.width,i.height,`translate(${r.x} ${r.y}) scale(${r.scale})`)}
  </svg>`}function Ww(e,n,t){return e.filter(i=>t.includes(i.id)&&i.kind!=="tap").map(i=>{let a=Zi(i,n);return{box:{...Hd(i,a),cx:a.cx,cy:a.cy},rotation:i.frame.rotationDegrees}})}function Vh(e,n,t,i,a,r,o){if(t===void 0||t.length===0)return m;let s=Ww(e,n,t),l=(d,c)=>{let{box:u,rotation:p}=d,f=`rotate(${p} ${u.cx} ${u.cy})`;return c==="hole"?w`<rect x=${u.x} y=${u.y} width=${u.w} height=${u.h} rx="2" fill="#000000" transform=${f} />`:w`<rect x=${u.x} y=${u.y} width=${u.w} height=${u.h} rx="2" fill="none" transform=${f}
          style="stroke: var(--wa-accent, #7b6cff)" stroke-width="2" vector-effect="non-scaling-stroke" />`};return w`<g class="spotlight" pointer-events="none">
    <defs><mask id=${i} maskUnits="userSpaceOnUse" x="0" y="0" width=${a} height=${r}>
      <rect width=${a} height=${r} fill="#ffffff" />
      <g transform=${o}>${s.map(d=>l(d,"hole"))}</g>
    </mask></defs>
    <rect width=${a} height=${r} fill="#000000" fill-opacity="0.62" mask=${`url(#${i})`} />
    <g transform=${o}>${s.map(d=>l(d,"ring"))}</g>
  </g>`}function Uh(e,n,t,i){if(t.handles!==!0||t.highlightId===void 0)return m;let a=e.find(r=>r.id===t.highlightId);return a===void 0?m:Bo(a,n,t,i,void 0,"handles")}var Kw=.14;function jw(e,n){let t=Zi(e,n);if(e.kind!=="text"||e.text==="")return t;let i=Math.min(t.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(t.h,e.fontSize*1.3);return{x:t.cx-i/2,y:t.cy-a/2,w:i,h:a,cx:t.cx,cy:t.cy}}function qw(e,n,t){let i=e.family in $e?e.family:"rectangular",a=$e[i],r=e.elements.filter(p=>n.includes(p.id)),o=1/0,s=1/0,l=-1/0,d=-1/0;for(let p of r){let f=jw(p,a),g=p.frame.rotationDegrees%180===0?0:Math.hypot(f.w,f.h)/2;o=Math.min(o,g?f.cx-g:f.x),s=Math.min(s,g?f.cy-g:f.y),l=Math.max(l,g?f.cx+g:f.x+f.w),d=Math.max(d,g?f.cy+g:f.y+f.h)}let c=l-o,u=d-s;if(r.length===0||!(c>0)||!(u>0))o=0,s=0,c=a.width,u=a.height;else{let p=Math.max(2,Math.max(c,u)*Kw);o-=p,s-=p,c+=2*p,u+=2*p}if(c/u<t){let p=u*t;o-=(p-c)/2,c=p}else{let p=c/t;s-=(p-u)/2,u=p}return{x:o,y:s,w:c,h:u}}function Nd(e,n,t){let i=e.family in $e?e.family:"rectangular",a=$e[i],r=qw(e,n,t.width/t.height),o=ze(e.backgroundColorHex),s=e.backgroundFill===void 0?void 0:Wo(e.backgroundFill),l=s!==void 0?s.paint:o?o.color:"#000000",d=s!==void 0?1:o?o.opacity:1,c=ze(e.borderColorHex),u=e.borderWidth,p={icons:t.icons,showHidden:!0,tapAreas:!0,minDotRadius:r.w/40,minGridStroke:r.w/110,...t.imageSizes?{imageSizes:t.imageSizes}:{}},f=e.elements.filter($=>n.includes($.id)),g=i==="rectangular"?"rect":Kh(i)?"rounded":"circle",b=g==="rounded"?Wh:0,y=c&&u>0?g==="circle"?w`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-u/2} fill="none" stroke=${c.color} stroke-opacity=${c.opacity} stroke-width=${u} />`:w`<rect x=${u/2} y=${u/2} width=${a.width-u} height=${a.height-u} rx=${Math.max(0,b-u/2)} fill="none" stroke=${c.color} stroke-opacity=${c.opacity} stroke-width=${u} />`:m,x=g==="circle"?w`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${l} fill-opacity=${d} />`:w`<rect width=${a.width} height=${a.height} rx=${b} fill=${l} fill-opacity=${d} />`;return w`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${t.width} height=${t.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${s===void 0?m:w`<defs>${s.defs}</defs>`}
    ${x}
    ${f.map($=>Bo($,a,p,lf(e.elements)))}
    ${y}
  </svg>`}function te(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline";case"small":return"Small";case"medium":return"Medium";case"large":return"Large";case"xlarge":return"Extra Large"}}var uf="2.8.0";var pf="2.8.0",Dd="2.8.0";function Ge(e){return e?.device_kind==="iphone"?"iphone":"watch"}function Pd(e){return Ge(e)==="iphone"?"iPhone":"watch"}function ea(e){if(typeof e!="string")return;let n=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(n)return[Number(n[1]),Number(n[2]),Number(n[3]??0)]}function hf(e,n){for(let t=0;t<3;t++)if(e[t]!==n[t])return e[t]<n[t]?-1:1;return 0}function tr(e,n=uf){let t=ea(e),i=ea(n);return!t||!i?!1:hf(t,i)>=0}function zd(e,n=null){if(n===null)return;let t=ea(e),i=ea(n);return!t||!i||hf(t,i)>=0?void 0:`Needs Wrist Assistant ${i[2]===0?`${i[0]}.${i[1]}`:i.join(".")} or later on your watch.`}function Yw(e,n=uf){return`${ea(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The editor needs ${n}, coming soon to the App Store.`}function Xw(e,n=pf){return`${ea(e)?`This iPhone runs Wrist Assistant ${e}.`:"This iPhone has not reported its Wrist Assistant version yet."} Lock Screen and Home Screen complications need ${n}, coming soon to the App Store.`}function ff(e){return Ge(e)==="iphone"?tr(e?.app_version,pf):tr(e?.app_version)}function mf(e){return Ge(e)==="iphone"?Xw(e?.app_version):Yw(e?.app_version)}var qo=["rectangular","circular","corner","inline",...$n],gf=!1;function yf(e){if(Ge(e)!=="iphone")return qo.filter(t=>!Dt(t));let n=tr(e?.app_version,Dd);return qo.filter(t=>t==="corner"?!1:t==="xlarge"?n&&gf:Dt(t)?n:!0)}function bf(e){return gf?[]:Ge(e)!=="iphone"?[]:tr(e?.app_version,Dd)?["xlarge"]:[]}function qe(e){return de.includes(e)}function Dt(e){return $n.includes(e)}function _n(e){return e==="xlarge"?"iOS 27 and later":void 0}function xf(e,n=[]){let t=e.filter(Dt);if(t.length===0&&n.length===0)return[{families:[...e]}];let i=e.filter(o=>!Dt(o)),a={label:"Home Screen",families:t};n.length>0&&(a.comingSoon=[...n]);let r=[a];return i.length>0&&r.push({label:"Lock Screen",families:i}),r}function Od(e,n){let t=yt(e),i=t.filter(a=>n.includes(a));return i.length>0?i:t}function yt(e){return qo.filter(n=>e.supportedFamilies.includes(n))}function Yo(e){return de.find(n=>e.supportedFamilies.includes(n))}function Xo(e,n){return e.supportedFamilies.includes(n)&&e.supportedFamilies.length>1}function Jw(){return{value:U("")}}function wf(e,n){e.supportedFamilies.includes(n)||(e.supportedFamilies=qo.filter(t=>t===n||e.supportedFamilies.includes(t))),qe(n)?e.perFamily[n]||(e.perFamily[n]=ln()):e.inline||(e.inline=Jw()),e.schemaVersion=ni(e)}function Gd(e,n){if(Xo(e,n)){if(e.supportedFamilies=e.supportedFamilies.filter(t=>t!==n),qe(n)){for(let t of gt(e,n))ke(e,t.payload.id);delete e.perFamily[n],$t(e)}else delete e.inline;e.schemaVersion=ni(e)}}function Bd(e,n){let t=structuredClone(e),i=yt(t);if(!i.some(a=>n.includes(a)))return t;for(let a of i)n.includes(a)||Gd(t,a);return t}function vf(e,n){let t=[];if(!qe(n)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||t.push("the Inline text")),t}let i=e.perFamily[n];if(!i)return t;let a=gt(e,n).filter(r=>!xe(e,r)).length;return a>0&&t.push(`${a} layer${a===1?"":"s"}`),i.rules.length>0&&t.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&t.push("the bezel"),i.curvedText&&t.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&t.push("the background or border"),t}var it={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",shape:"#43a047",image:"#00acc1",tap:"#ec407a",chartTimes:"#5e35b1",chartDots:"#5e35b1",chartGrid:"#5e35b1",imageTime:"#00838f"},cn={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",shape:"Shape",image:"Picture",tap:"Tap area",chartTimes:"Clock times",chartDots:"Chart dots",chartGrid:"Chart grid",imageTime:"Timestamp"},Vd=["text","icon","gauge","chart","timeline","shape","image","tap"],oe={content:"#4a7fe8",look:"#a15fe0",numbers:"#26a69a",position:"#66bb6a",states:"#f9a825",tap:it.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var kf="52a9d81d0fd7";var $f="11fa18406cea";var Je="mdi:";function Zw(e){return e.trim().replace(/\./g,"-")}function Qw(e){return e.trim().replace(/-/g,".")}var Jo=class e{constructor(n){this.onReady=n;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let n=window.customIcons?.ios;if(!n||typeof n.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>n.getIconList()).then(t=>{this.nameList=(t??[]).map(i=>Qw(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(n,t,i){let a=Zw(n),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=ze(i)??{color:"#FFFFFF",opacity:1},s=r.viewBox??"0 0 24 24";return w`<svg x="0" y="0" width=${t} height=${t} viewBox=${s}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(n){if(this.pending.has(n))return;let t=window.customIcons?.ios;if(!t){this.cache.set(n,null);return}this.pending.add(n),Promise.resolve().then(()=>t.getIcon(n)).then(i=>this.cache.set(n,i&&i.path?i:null)).catch(()=>this.cache.set(n,null)).finally(()=>{this.pending.delete(n),this.onReady()})}},Zo=class{constructor(n,t="symbol-icons.json.gz",i=kf){this.onReady=n;this.file=t;this.digest=i;this.icons=new Map;this.state="idle"}path(n){return this.load(),this.icons.get(n.trim())?.[0]}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(n,t,i){this.load();let a=this.icons.get(n.trim());if(!a)return;let r=ze(i)??{color:"#FFFFFF",opacity:1};return w`<svg x="0" y="0" width=${t} height=${t} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let n=new URL(`${this.file}?v=${this.digest}`,import.meta.url);fetch(n).then(t=>{if(!t.ok||!t.body)throw new Error(`${this.file}: ${t.status}`);return new Response(t.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(t=>{if(t&&typeof t=="object")for(let[i,a]of Object.entries(t))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}},Ud=class{constructor(n,t){this.sf=n;this.mdi=new Zo(t,"mdi-icons.json.gz",$f)}render(n,t,i){return(n.trim().startsWith(Je)?this.mdi:this.sf).render(n,t,i)}available(){return this.sf.available()}names(){return this.sf.names()}mdiNames(){return this.mdi.names()}mdiPath(n){return this.mdi.path(n)}};function Cf(e){let n=Jo.available()?new Jo(e):new Zo(e);return new Ud(n,e)}function Sf(e){let n=new Map,t=new Set;return{size(i){let a=n.get(i);if(a)return a;if(t.has(i))return;t.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(n.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var es=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],ts=[...new Set(es.flatMap(e=>e.symbols))],ev={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function tv(e){return`${e.replace(/\./g," ")} ${(ev[e]??[]).join(" ")}`}function Wd(e,n){let t=n.toLowerCase().split(/[\s.]+/).filter(Boolean);if(t.length===0)return[...e];let i=[];for(let a of e){let r=tv(a);if(!t.every(s=>r.includes(s)))continue;let o=t.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var Qo=class e{constructor(n){this.onChange=n;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(n){return!this.collapsed.has(n)}toggle(n){this.collapsed.has(n)?this.collapsed.delete(n):this.collapsed.add(n),this.onChange()}query(n){return this.browsing.get(n)?.query??""}category(n){return this.browsing.get(n)?.category??""}pack(n){return this.browsing.get(n)?.pack}setQuery(n,t){this.browsing.set(n,{category:this.category(n),query:t,pack:this.pack(n)}),this.onChange()}setCategory(n,t){this.browsing.set(n,{query:this.query(n),category:t,pack:this.pack(n)}),this.onChange()}setPack(n,t){this.browsing.set(n,{query:"",category:this.category(n),pack:t}),this.onChange()}noteUsed(n){let t=n.trim();t&&(this.recent=[t,...this.recent.filter(i=>i!==t)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let n=localStorage.getItem(e.STORAGE_KEY),t=n?JSON.parse(n):[];return Array.isArray(t)?t.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(n){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(n))}catch{}}};var nv=100;function Tf(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var wi=class e{constructor(n,t){this.config=n;this.testValues=new Map;this.past=[];this.future=[];this.coalesceUntil=0;this.held=!1;this.heldStepTaken=!1;this.baseRevision=t,qi(n),Ln(n),yp(n),this.baseline=JSON.stringify(Vi(n))}static fromDocument(n,t){return new e(Bi(n),t)}get dirty(){return JSON.stringify(Vi(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(n,t,i){this.takeStep(t);let a=structuredClone(this.config);n(a),qi(a,i),Ln(a),this.config=a}setTestValues(n,t){this.takeStep(t),this.testValues=n}takeStep(n){let t=Date.now();(this.held?this.heldStepTaken:n!==void 0&&n===this.coalesceKey&&t<this.coalesceUntil)||(this.past.push({config:structuredClone(this.config),testValues:this.testValues}),this.past.length>nv&&this.past.shift(),this.future=[]),this.heldStepTaken=this.held,this.coalesceKey=n,this.coalesceUntil=n===void 0?0:t+800}markDirty(){this.baseline=""}beginGesture(){this.endGesture(),this.held=!0}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0,this.held=!1,this.heldStepTaken=!1}undo(){let n=this.past.pop();n&&(this.future.push({config:this.config,testValues:this.testValues}),this.config=n.config,this.testValues=n.testValues,this.endGesture())}redo(){let n=this.future.pop();n&&(this.past.push({config:this.config,testValues:this.testValues}),this.config=n.config,this.testValues=n.testValues,this.endGesture())}encoded(){let n=structuredClone(this.config);return n.dataSources=ud(n),Vi(n)}commit(){let n=structuredClone(this.config);return n.dataSources=ud(n),new e(n,null)}};var ns=class{constructor(){this.watched=new Map;this.onScroll=n=>this.mark(n.currentTarget);this.observer=new ResizeObserver(()=>{for(let n of this.watched.keys())this.mark(n)})}refresh(n){let t=new Set(n.filter(i=>i!=null));for(let[i,a]of[...this.watched])t.has(i)||this.drop(i,a);for(let i of t){let a=this.watched.get(i);a||(a=new Set,this.watched.set(i,a),i.addEventListener("scroll",this.onScroll,{passive:!0}),this.observer.observe(i));for(let r of a)r.parentElement!==i&&(this.observer.unobserve(r),a.delete(r));for(let r of i.children)a.has(r)||(a.add(r),this.observer.observe(r));this.mark(i)}}disconnect(){for(let[n,t]of[...this.watched])this.drop(n,t);this.observer.disconnect()}drop(n,t){n.removeEventListener("scroll",this.onScroll),this.observer.unobserve(n);for(let i of t)this.observer.unobserve(i);this.watched.delete(n)}mark(n){let t=n.scrollHeight-n.clientHeight,i=t>1;n.toggleAttribute("data-more-above",i&&n.scrollTop>1),n.toggleAttribute("data-more-below",i&&n.scrollTop<t-1)}};var ta={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",timeBetween:"is between times",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Pt={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",fontDesign:"Typeface",fontWidth:"Width",italic:"Italic",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},Ff=["icon","text","color","visibility","opacity","fontSize","fontWeight","fontDesign","fontWidth","italic","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],Mf={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",fontDesign:"setFontDesign",fontWidth:"setFontWidth",italic:"setItalic",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},Kd=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],iv=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function jd(e){return iv.includes(e)}function av(e){return Kd.includes(e)}function rv(e,n){return JSON.stringify(ye(e))===JSON.stringify(ye(n))}function qd(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let n=e[0];if(!n)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let t,i=[];for(let[r,o]of n.cases.entries()){let s=o.when.tests;if(s.length!==1)return{ok:!1,reason:s.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${s.length} things at once. A table row checks one.`};let l=s[0];if(!av(l.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${ta[l.comparison.kind]}", which a table row cannot show.`};if(t===void 0)t=l.value;else if(!rv(t,l.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let d=Ef(o.then);if(d)return{ok:!1,reason:`State ${r+1} sets ${Pt[d]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:l.id,join:o.when.join,comparison:l.comparison,changes:o.then})}if(n.otherwise){let r=Ef(n.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Pt[r]} twice. A table has one cell per column.`}}let a={ruleId:n.id,rows:i,columns:ov(i,n.otherwise),numberMode:i.length>0&&i.every(r=>jd(r.comparison.kind))};return t!==void 0&&(a.value=t),n.otherwise&&(a.otherwise=n.otherwise),{ok:!0,table:a}}function Ef(e){let n=new Set;for(let t of e){let i=je[t.kind];if(n.has(i))return i;n.add(i)}}function ov(e,n){let t=new Set;for(let i of e)for(let a of i.changes)t.add(je[a.kind]);for(let i of n??[])t.add(je[i.kind]);return Ff.filter(i=>t.has(i))}function Rf(e,n,t){let i=new Set(e);for(let a of n)i.add(a);return Ff.filter(a=>i.has(a)&&t.includes(a))}function is(e,n){return e.find(t=>je[t.kind]===n)}function as(e,n,t,i){let a=n.map(o=>({id:o.caseId??ie(),when:{join:o.join??"all",tests:[{id:o.testId??ie(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??ie(),cases:a};return t&&(r.otherwise=t),r}function nr(e){if(e.length===0)return"No states yet.";let n=qd(e);if(!n.ok)return"Advanced rules.";let t=n.table.rows.length+(n.table.otherwise?1:0);return t===1?"1 state.":`${t} states.`}function Hf(e){return`No states yet. This ${e==="layout"?"shape":"layer"} looks the same whatever the value is.`}function ir(e){return{state:`When the value matches, change how this ${e==="layout"?"shape":"layer"} looks.`,otherwise:"The look when no state above matches.",column:"Adds a column, so every state can change it.",fill:"One row per state this entity reports, ready to edit."}}function Af(e){let n=e[0];return n||(n={id:ie(),cases:[]},e.push(n)),n}function Lf(e){let n=e[0];n&&n.cases.length===0&&n.otherwise===void 0&&(e.length=0)}function If(e,n,t){let i=Af(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:ie(),when:{join:"all",tests:[{id:ie(),value:structuredClone(n),comparison:lv(a,t)}]},then:[]})}function _f(e,n){let t=e[0];t&&(t.cases=t.cases.filter(i=>i.id!==n),Lf(e))}function Yd(e,n,t){let i=e[0]?.cases;if(!i||t<0||t>=i.length)return;let[a]=i.splice(n,1);a&&i.splice(t,0,a)}function Xd(e,n){if(n){Af(e).otherwise=[];return}let t=e[0];t&&(delete t.otherwise,Lf(e))}function Nf(e,n){for(let t of e[0]?.cases??[]){let i=t.when.tests[0];i&&(i.value=structuredClone(n))}}function Df(e,n){let t=e[0];if(!t)return;let i=a=>a.filter(r=>je[r.kind]!==n);for(let a of t.cases)a.then=i(a.then);t.otherwise&&(t.otherwise=i(t.otherwise))}function sv(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function Pf(e,n=sv){let t=()=>n(e.value??U(""));switch(e.kind){case"lessThan":return`below ${t()}`;case"lessOrEqual":return`${t()} or below`;case"greaterThan":return`above ${t()}`;case"greaterOrEqual":return`${t()} or above`;case"between":return`${t()} to ${n(e.upper??U(""))}`;case"timeBetween":return`${t()} to ${n(e.upper??U(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return hi(e.kind)==="value"?`${ta[e.kind]} ${t()}`:ta[e.kind]}}function lv(e,n){if(!e)return n?{kind:"lessThan",value:U("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??U("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??U("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??U("0")};default:return{kind:e.kind,...hi(e.kind)==="value"?{value:U("")}:{}}}}var zf={text:"text",icon:"icon",gauge:"color",chart:"color",timeline:"visibility",shape:"color",image:"visibility",tap:"visibility",chartTimes:"visibility",chartDots:"visibility",chartGrid:"visibility",imageTime:"visibility",layout:"backgroundColor"};function Of(e){if(!e)return!1;let n=e.kind;if(n.kind!=="entityState")return!1;let t=n.domain||n.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(t)}function dv(e){switch(e){case"text":return w`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return w`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return w`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return w`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return w`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return w`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return w`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return w`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return w`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return w`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"chartDots":return w`<path d="M4 16L10 10L14 13L20 7" /><circle cx="4" cy="16" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="14" cy="13" r="1.8" /><circle cx="20" cy="7" r="1.8" />`;case"chartGrid":return w`<path d="M4 7H20M4 12H20M4 17H20" />`;case"chartTimes":case"imageTime":case"clock":return w`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return w`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return w`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return w`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return w`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return w`<path d="M6 9L12 15L18 9" />`;case"plus":return w`<path d="M12 5V19M5 12H19" />`;case"braces":return w`<path d="M9 4.5C6.9 4.5 6.3 5.55 6.3 7.5v2.4c0 1.2-.75 2.1-2.1 2.1 1.35 0 2.1.9 2.1 2.1v2.4c0 1.95.6 3 2.7 3" /><path d="M15 4.5c2.1 0 2.7 1.05 2.7 3v2.4c0 1.2.75 2.1 2.1 2.1-1.35 0-2.1.9-2.1 2.1v2.4c0 1.95-.6 3-2.7 3" />`;case"link":return w`<path d="M10.2 13.8L13.8 10.2" /><path d="M10.8 6.9l1.35-1.35a3.6 3.6 0 0 1 5.1 5.1l-1.35 1.35" /><path d="M13.2 17.1l-1.35 1.35a3.6 3.6 0 0 1-5.1-5.1l1.35-1.35" />`;case"info":return w`<circle cx="12" cy="12" r="8.5" /><path d="M12 11V16.5" /><path d="M12 7.6V7.8" />`;case"globe":return w`<circle cx="12" cy="12" r="8.5" /><path d="M3.5 12H20.5" /><path d="M12 3.5c2.5 3 2.5 14 0 17M12 3.5c-2.5 3-2.5 14 0 17" />`;case"download":return w`<path d="M12 4V15" /><path d="M7 10L12 15L17 10" /><path d="M5 20H19" />`;case"check":return w`<path d="M5 12.5L9.5 17L19 7.5" />`;case"arrow":return w`<path d="M5 12H19" /><path d="M13 6L19 12L13 18" />`;case"guides":return w`<path d="M12 3V21" /><rect x="4" y="6" width="8" height="4.5" rx="1.3" /><rect x="12" y="13.5" width="8" height="4.5" rx="1.3" />`;case"paste":return w`<rect x="6" y="4.5" width="12" height="16" rx="2" /><path d="M9 4.5V3.5H15V4.5" /><path d="M9 11H15M9 15H13" />`;case"watch":return w`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"compact":return w`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return w`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"lock":return w`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return w`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return w`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return w`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return w`<path d="M6 14L12 8L18 14" />`;case"down":return w`<path d="M6 10L12 16L18 10" />`;case"left":return w`<path d="M14 6L8 12L14 18" />`;case"right":return w`<path d="M10 6L16 12L10 18" />`;case"show":return w`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return w`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return w`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return w`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return w`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return w`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return w`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`;case"undo":return w`<path d="M9 14L4 9L9 4" /><path d="M4 9H15A5 5 0 0 1 15 19H12" />`;case"redo":return w`<path d="M15 14L20 9L15 4" /><path d="M20 9H9A5 5 0 0 0 9 19H12" />`;case"expand":return w`<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" />`}}function P(e){return h`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${dv(e)}</svg>`}var zt="color-mix(in srgb, var(--k) 45%, #6b7280)",na='system-ui, -apple-system, "Segoe UI", sans-serif';function Gf(e,n,t,i){let r=135+270*Math.max(0,Math.min(1,i)),o=c=>{let u=c*Math.PI/180;return{x:(e-t*Math.cos(u)).toFixed(2),y:(n-t*Math.sin(u)).toFixed(2)}},s=o(135),l=o(r),d=r-135>180?1:0;return`M${s.x} ${s.y}A${t} ${t} 0 ${d} 1 ${l.x} ${l.y}`}function Jd(e,n,t,i){return w`<g fill="none" stroke-linecap="round">
    <path d=${Gf(e,n,t,1)} stroke=${zt} stroke-width="2.6" opacity=".5" />
    <path d=${Gf(e,n,t,i)} stroke="var(--k)" stroke-width="2.6" />
  </g>`}function cv(e){switch(e){case"text":return w`<g font-family=${na} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${zt}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${zt}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${zt}>1.2 kW</text>
      </g>`;case"icon":return w`<g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <g opacity=".55" transform="translate(14 14) scale(.8)">
          <path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />
        </g>
        <g transform="translate(42 8) scale(1.25)">
          <path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" />
          <path d="M10.5 21.5H13.5" />
        </g>
        <g opacity=".55" transform="translate(80 14) scale(.8)">
          <path d="M12 20.5A4.5 4.5 0 0 0 16.5 16C16.5 12.5 12 4.5 12 4.5S7.5 12.5 7.5 16A4.5 4.5 0 0 0 12 20.5Z" />
        </g>
      </g>`;case"gauge":return w`<g>
        ${Jd(22,24,12,.28)}
        ${Jd(60,24,12,.62)}
        ${Jd(98,24,12,.92)}
        <text x="60" y="27" font-family=${na} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;case"chart":return w`<g>
        <g opacity=".4" fill=${zt}>
          <rect x="72" y="26" width="6" height="14" rx="1.5" />
          <rect x="82" y="18" width="6" height="22" rx="1.5" />
          <rect x="92" y="29" width="6" height="11" rx="1.5" />
          <rect x="102" y="12" width="6" height="28" rx="1.5" />
        </g>
        <path d="M4 40L4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15L68 40Z" fill="var(--k)" opacity=".22" />
        <path d="M4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15" fill="none" stroke="var(--k)"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="60" cy="8" r="2.6" fill="var(--k)" />
      </g>`;case"timeline":return w`<g>
        <rect x="6" y="17" width="30" height="12" rx="2.5" fill=${zt} opacity=".55" />
        <rect x="37" y="17" width="18" height="12" rx="2.5" fill="var(--k)" />
        <rect x="56" y="17" width="8" height="12" rx="2.5" fill=${zt} opacity=".55" />
        <rect x="65" y="17" width="24" height="12" rx="2.5" fill="var(--k)" />
        <rect x="90" y="17" width="24" height="12" rx="2.5" fill=${zt} opacity=".55" />
        <text x="6" y="39" font-family=${na} font-size="7" fill=${zt}>1h ago</text>
        <text x="114" y="39" font-family=${na} font-size="7" text-anchor="end" fill=${zt}>now</text>
      </g>`;case"shape":return w`<g fill="none" stroke="var(--k)" stroke-width="2">
        <rect x="6" y="12" width="26" height="22" rx="6" fill="var(--k)" fill-opacity=".18" />
        <rect x="40" y="11" width="2.5" height="24" fill="var(--k)" stroke="none" />
        <circle cx="63" cy="23" r="11" />
        <rect x="83" y="16" width="31" height="14" rx="7" stroke-dasharray="3 3" opacity=".7" />
      </g>`;case"image":return w`<g>
        <rect x="26" y="7" width="68" height="32" rx="5" fill="var(--k)" fill-opacity=".16"
          stroke="var(--k)" stroke-width="1.8" />
        <circle cx="44" cy="18" r="4" fill="var(--k)" opacity=".75" />
        <path d="M28 37L47 24L60 32L74 20L92 37Z" fill="var(--k)" opacity=".55" />
      </g>`;case"tap":return w`<g>
        <rect x="30" y="6" width="60" height="34" rx="8" fill="var(--k)" fill-opacity=".12"
          stroke="var(--k)" stroke-width="1.6" stroke-dasharray="5 4" />
        <g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
          transform="translate(48 9) scale(1)">
          <path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" />
          <path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" />
          <path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />
        </g>
      </g>`;case"chartTimes":return w`<g font-family=${na} font-size="8" fill="var(--k)">
        <text x="6" y="27">9 AM</text>
        <text x="60" y="27" text-anchor="middle">1 PM</text>
        <text x="114" y="27" text-anchor="end">5 PM</text>
      </g>`;case"chartDots":return w`<g fill="var(--k)">
        <circle cx="20" cy="30" r="3" /><circle cx="45" cy="18" r="3" /><circle cx="70" cy="24" r="3" /><circle cx="95" cy="12" r="3" />
      </g>`;case"chartGrid":return w`<g stroke="var(--k)" stroke-width="1.4" opacity=".7">
        <path d="M10 12H110M10 23H110M10 34H110" />
      </g>`;case"imageTime":return w`<g>
        <rect x="30" y="14" width="60" height="18" rx="9" fill="var(--k)" fill-opacity=".3" />
        <text x="60" y="27" text-anchor="middle" font-family=${na} font-size="10" fill="var(--k)">3:41:07</text>
      </g>`}}function Bf(e){return h`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${cv(e)}</svg>`}var Vf={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Uf=e=>(...n)=>({_$litDirective$:e,values:n}),rs=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,t,i){this._$Ct=n,this._$AM=t,this._$Ci=i}_$AS(n,t){return this.update(n,t)}update(n,t){return this.render(...t)}};var{I:uv}=$u,Wf=e=>e;var Kf=()=>document.createComment(""),ia=(e,n,t)=>{let i=e._$AA.parentNode,a=n===void 0?e._$AB:n._$AA;if(t===void 0){let r=i.insertBefore(Kf(),a),o=i.insertBefore(Kf(),a);t=new uv(r,o,e,e.options)}else{let r=t._$AB.nextSibling,o=t._$AM,s=o!==e;if(s){let l;t._$AQ?.(e),t._$AM=e,t._$AP!==void 0&&(l=e._$AU)!==o._$AU&&t._$AP(l)}if(r!==a||s){let l=t._$AA;for(;l!==r;){let d=Wf(l).nextSibling;Wf(i).insertBefore(l,a),l=d}}}return t},Nn=(e,n,t=e)=>(e._$AI(n,t),e),pv={},jf=(e,n=pv)=>e._$AH=n,qf=e=>e._$AH,os=e=>{e._$AR(),e._$AA.remove()};var Yf=(e,n,t)=>{let i=new Map;for(let a=n;a<=t;a++)i.set(e[a],a);return i},Xf=Uf(class extends rs{constructor(e){if(super(e),e.type!==Vf.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,n,t){let i;t===void 0?t=n:n!==void 0&&(i=n);let a=[],r=[],o=0;for(let s of e)a[o]=i?i(s,o):o,r[o]=t(s,o),o++;return{values:r,keys:a}}render(e,n,t){return this.dt(e,n,t).values}update(e,[n,t,i]){let a=qf(e),{values:r,keys:o}=this.dt(n,t,i);if(!Array.isArray(a))return this.ut=o,r;let s=this.ut??=[],l=[],d,c,u=0,p=a.length-1,f=0,g=r.length-1;for(;u<=p&&f<=g;)if(a[u]===null)u++;else if(a[p]===null)p--;else if(s[u]===o[f])l[f]=Nn(a[u],r[f]),u++,f++;else if(s[p]===o[g])l[g]=Nn(a[p],r[g]),p--,g--;else if(s[u]===o[g])l[g]=Nn(a[u],r[g]),ia(e,l[g+1],a[u]),u++,g--;else if(s[p]===o[f])l[f]=Nn(a[p],r[f]),ia(e,a[u],a[p]),p--,f++;else if(d===void 0&&(d=Yf(o,f,g),c=Yf(s,u,p)),d.has(s[u]))if(d.has(s[p])){let b=c.get(o[f]),y=b!==void 0?a[b]:null;if(y===null){let x=ia(e,a[u]);Nn(x,r[f]),l[f]=x}else l[f]=Nn(y,r[f]),ia(e,a[u],y),a[b]=null;f++}else os(a[p]),p--;else os(a[u]),u++;for(;f<=g;){let b=ia(e,l[g+1]);Nn(b,r[f]),l[f++]=b}for(;u<=p;){let b=a[u++];b!==null&&os(b)}return this.ut=o,jf(e,l),Yt}});var ar=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:Yl,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"doorHistory",title:"Door history",blurb:"A strip of when the entity was open over the last hour, with its name above. For a door, a window or anything else with two states.",domains:["binary_sensor","cover"],layerCount:2},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1}];function em(e){return ar.find(n=>n.kind===e)??ar[0]}var Jf="#FF9F0A",ss="#8E8E93",hv=["#FF453A","#FFD60A","#34C759"],tm=["#0A84FF","#34C759","#FF9F0A"];function fv(e){return e?.attributes?.device_class==="battery"?hv:tm}var mv={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function Zd(e){let n=e.iconName?.trim();return n?{off:n,on:n}:mv[Qd(e)]??{off:"circle",on:"circle.fill"}}function gv(e){switch(Qd(e)){case"lock":return{kind:"equals",value:U("locked")};case"cover":case"valve":return{kind:"equals",value:U("open")};case"media_player":return{kind:"equals",value:U("playing")};default:return{kind:"isOn"}}}function Qd(e){return e.domain||e.entityId.split(".")[0]||""}function zn(e){return{...e,domain:Qd(e)}}function yv(e){let n=e?.attributes??{},t=n.min,i=n.max;if(typeof t=="number"&&typeof i=="number"&&i>t)return{min:t,max:i};let a=typeof n.device_class=="string"?n.device_class:"",r=typeof n.unit_of_measurement=="string"?n.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function aa(e){return Math.round(e*1e4)/1e4}function ki(e,n,t){return Math.min(t,Math.max(n,e))}function ec(e,n,t){let i=$e[e],a=ki(aa(n/i.width),0,1),r=ki(aa(t/i.height),0,1);return{x:aa((1-a)/2),y:aa((1-r)/2),width:a,height:r,rotationDegrees:0}}function bv(e){let n=$e[e],t=ki(Math.round(Math.min(n.width,n.height)*.55),12,30);return{frame:ec(e,t*1.3,t*1.3),size:t}}function xv(e){let n=$e[e],t=ki(Math.round(Math.min(n.width,n.height)*.3),9,20);return{frame:ec(e,n.width*.88,t*1.7),size:t}}function wv(e){let n=$e[e],t=Math.min(n.width,n.height)*.9;return{frame:ec(e,t,t),size:Math.max(2.5,Math.round(t*.2)/2)}}function nm(e){let n=e==="rectangular"||e==="medium";return{frame:{x:.05,y:n?.34:.3,width:.9,height:n?.42:.4,rotationDegrees:0},size:2}}function vv(e){let n=$e[e],t=ki(Math.round(n.height*.2),6,14);return{frame:{x:.06,y:.56,width:.88,height:aa(t/n.height),rotationDegrees:0}}}function kv(e){let n=$e[e],t=ki(Math.round(Math.min(n.width,n.height)*.26),8,15);return{frame:{x:.06,y:.2,width:.88,height:aa(ki(t*1.5/n.height,0,1)),rotationDegrees:0},size:t}}function $v(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function Cv(e,n){n!==void 0&&(e.kind==="text"?e.payload.fontSize=n:e.kind==="icon"?e.payload.size=n:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=n))}function Dn(e,n,t,i){let a=i(t);n.payload.frame=a.frame,Cv(n,a.size);let r=e.perFamily[t]??(e.perFamily[t]=ln());r.placements[n.payload.id]={frame:a.frame,isHidden:!1,...a.size!==void 0?{size:a.size}:{}}}function Pn(e){return Le(e)}function tc(e,n){let t={kind:{kind:"entityState",...zn(e)}},i=n?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(t.format={useEntityUnit:!0}),t}function Zf(e){let n=fi("setIcon");return n.value=U(e),n}function vi(e){let n=fi("setColor");return n.value=U(e),n}function Sv(e,n){let t=Wa(),i=t.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...zn(e)}},a.comparison=gv(e);let r=n.on!==n.off;return i.then=r?[Zf(n.on),vi(Jf)]:[vi(Jf)],t.otherwise=r?[Zf(n.off),vi(ss)]:[vi(ss)],t}function Tv(e){let n=Wa(),t=n.cases[0],i=t.when.tests[0];i.value={kind:{kind:"entityState",...zn(e)}},i.comparison={kind:"isUnavailable"};let a=fi("setOpacity");return a.number=.35,t.then=[a],n}function Qf(e){let n=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(n)}function Ev(e,n,t=tm){let i=n.max-n.min,a=Qf(n.min+i/3),r=Qf(n.min+i*2/3),o=[{comparison:{kind:"lessThan",value:U(a)},changes:[vi(t[0])]},{comparison:{kind:"between",value:U(a),upper:U(r)},changes:[vi(t[1])]},{comparison:{kind:"greaterThan",value:U(r)},changes:[vi(t[2])]}];return as(tc(e),o)}function Fv(e,n,t){let i=Pn("icon"),a=Zd(n);return i.payload.symbol=U(a.off),i.payload.colorSlot.baseColorHex=ss,i.payload.rules=[Sv(n,a)],Dn(e,i,t.family,bv),e.elements.push(i),Co(e,i.payload.id,{type:"toggleEntity",...zn(n)}),i.payload.id}function Mv(e,n,t){let i=Pn("text");return i.payload.value=tc(n,t.state),i.payload.rules=[Tv(n)],Dn(e,i,t.family,xv),e.elements.push(i),i.payload.id}function Rv(e,n,t){let i=Pn("gauge");i.payload.value=tc(n);let a=yv(t.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[Ev(n,a,fv(t.state))],Dn(e,i,t.family,wv),e.elements.push(i),i.payload.id}function Hv(e,n,t){let i=Pn("chart");return i.payload.value={kind:{kind:"entityState",...zn(n)}},i.payload.historyMinutes=0,i.payload.highlight="both",i.payload.marker="pointer",Dn(e,i,t.family,nm),e.elements.push(i),i.payload.id}function Av(e,n,t){let i=Pn("chart");return i.payload.value={kind:{kind:"entityState",...zn(n)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",Dn(e,i,t.family,nm),e.elements.push(i),i.payload.id}function Lv(e,n,t){let i=zn(n),a=Pn("text");a.payload.value=U(i.displayName||i.entityId),a.payload.colorSlot.baseColorHex=ss,Dn(e,a,t.family,kv),e.elements.push(a);let r=t.state?.attributes?.device_class,o=Pn("timeline");return o.payload.value={kind:{kind:"entityState",...i}},o.payload.bands=Nl(i.domain,typeof r=="string"?r:void 0),Dn(e,o,t.family,vv),e.elements.push(o),o.payload.id}function Iv(e,n,t){let i=Pn("image");return i.payload.entity=zn(n),Dn(e,i,t.family,$v),e.elements.push(i),i.payload.id}function im(e,n,t,i){switch(n){case"toggle":return Fv(e,t,i);case"status":return Mv(e,t,i);case"gauge":return Rv(e,t,i);case"chart":return Hv(e,t,i);case"history":return Av(e,t,i);case"doorHistory":return Lv(e,t,i);case"camera":return Iv(e,t,i)}}var Ot=wt("on"),Gt=wt("off"),at=wt("open"),rt=wt("closed"),_v=wt("unavailable"),Nv=["light","switch","fan","input_boolean"],Dv={door:{on:{symbol:"door.left.hand.open",colorHex:at},off:{symbol:"door.left.hand.closed",colorHex:rt}},garage_door:{on:{symbol:"door.left.hand.open",colorHex:at},off:{symbol:"door.left.hand.closed",colorHex:rt}},opening:{on:{symbol:"door.left.hand.open",colorHex:at},off:{symbol:"door.left.hand.closed",colorHex:rt}},window:{on:{symbol:"window.casement",colorHex:at},off:{symbol:"curtains.closed",colorHex:rt}},motion:{on:{symbol:"figure.walk",colorHex:Ot},off:{symbol:"figure.stand",colorHex:Gt}},occupancy:{on:{symbol:"figure.walk",colorHex:Ot},off:{symbol:"figure.stand",colorHex:Gt}},presence:{on:{symbol:"figure.walk",colorHex:Ot},off:{symbol:"figure.stand",colorHex:Gt}},moisture:{on:{symbol:"drop.fill",colorHex:at},off:{symbol:"drop",colorHex:Gt}},smoke:{on:{symbol:"exclamationmark.triangle.fill",colorHex:at},off:{symbol:"checkmark.circle.fill",colorHex:rt}},gas:{on:{symbol:"exclamationmark.triangle.fill",colorHex:at},off:{symbol:"checkmark.circle.fill",colorHex:rt}},carbon_monoxide:{on:{symbol:"exclamationmark.triangle.fill",colorHex:at},off:{symbol:"checkmark.circle.fill",colorHex:rt}},problem:{on:{symbol:"exclamationmark.triangle.fill",colorHex:at},off:{symbol:"checkmark.circle.fill",colorHex:rt}},safety:{on:{symbol:"exclamationmark.triangle.fill",colorHex:at},off:{symbol:"checkmark.circle.fill",colorHex:rt}},battery:{on:{symbol:"battery.25percent",colorHex:at},off:{symbol:"battery.100percent",colorHex:rt}},lock:{on:{symbol:"lock.open.fill",colorHex:at},off:{symbol:"lock.fill",colorHex:rt}},plug:{on:{symbol:"powerplug.fill",colorHex:Ot},off:{symbol:"poweroutlet.type.b.fill",colorHex:Gt}},power:{on:{symbol:"powerplug.fill",colorHex:Ot},off:{symbol:"poweroutlet.type.b.fill",colorHex:Gt}},connectivity:{on:{symbol:"wifi",colorHex:rt},off:{symbol:"wifi.slash",colorHex:at}},sound:{on:{symbol:"speaker.wave.2.fill",colorHex:Ot},off:{symbol:"speaker.slash.fill",colorHex:Gt}},running:{on:{symbol:"play.fill",colorHex:Ot},off:{symbol:"stop.fill",colorHex:Gt}},update:{on:{symbol:"arrow.down.circle.fill",colorHex:Ot},off:{symbol:"checkmark.circle.fill",colorHex:rt}}},Pv={on:{symbol:"circle.fill",colorHex:Ot},off:{symbol:"circle",colorHex:Gt}},zv=[{state:"sunny",symbol:"sun.max.fill",colorHex:"#FFD60A"},{state:"clear-night",symbol:"moon.stars.fill",colorHex:"#5E5CE6"},{state:"partlycloudy",symbol:"cloud.sun.fill",colorHex:"#64D2FF"},{state:"cloudy",symbol:"cloud.fill",colorHex:"#8E8E93"},{state:"fog",symbol:"cloud.fog.fill",colorHex:"#AEAEB2"},{state:"rainy",symbol:"cloud.rain.fill",colorHex:"#64D2FF"},{state:"pouring",symbol:"cloud.heavyrain.fill",colorHex:"#0A84FF"},{state:"lightning",symbol:"cloud.bolt.fill",colorHex:"#FFD60A"},{state:"lightning-rainy",symbol:"cloud.bolt.rain.fill",colorHex:"#FFD60A"},{state:"snowy",symbol:"cloud.snow.fill",colorHex:"#FFFFFF"},{state:"snowy-rainy",symbol:"cloud.drizzle.fill",colorHex:"#AEAEB2"},{state:"hail",symbol:"cloud.snow.fill",colorHex:"#64D2FF"},{state:"windy",symbol:"wind",colorHex:"#8E8E93"},{state:"windy-variant",symbol:"wind",colorHex:"#8E8E93"},{state:"exceptional",symbol:"exclamationmark.triangle.fill",colorHex:"#FF453A"}],Ov={cover:[{state:"open",symbol:"window.casement"},{state:"closed",symbol:"curtains.closed"},{state:"opening",symbol:"arrow.up"},{state:"closing",symbol:"arrow.down"}],lock:[{state:"locked",symbol:"lock.fill"},{state:"unlocked",symbol:"lock.open.fill"},{state:"jammed",symbol:"exclamationmark.triangle.fill"}],media_player:[{state:"playing",symbol:"play.fill"},{state:"paused",symbol:"pause.fill"},{state:"idle",symbol:"stop.fill"},{state:"standby",symbol:"zzz"},{state:"off",symbol:"speaker.slash.fill"}],climate:[{state:"heat",symbol:"flame.fill"},{state:"cool",symbol:"snowflake"},{state:"heat_cool",symbol:"thermometer.medium"},{state:"dry",symbol:"humidity.fill"},{state:"fan_only",symbol:"fan.fill"},{state:"auto",symbol:"thermometer.variable"},{state:"off",symbol:"power"}],vacuum:[{state:"cleaning",symbol:"sparkles"},{state:"returning",symbol:"arrow.counterclockwise"},{state:"docked",symbol:"powerplug.fill"},{state:"idle",symbol:"pause.fill"},{state:"error",symbol:"exclamationmark.triangle.fill"}],alarm_control_panel:[{state:"disarmed",symbol:"shield.slash.fill"},{state:"armed_home",symbol:"house.fill"},{state:"armed_away",symbol:"shield.fill"},{state:"armed_night",symbol:"moon.fill"},{state:"armed_vacation",symbol:"airplane",colorHex:"#5E5CE6"},{state:"arming",symbol:"hourglass"},{state:"pending",symbol:"hourglass"},{state:"triggered",symbol:"bell.badge.fill"}],person:[{state:"home",symbol:"house.fill"},{state:"not_home",symbol:"figure.walk"}],device_tracker:[{state:"home",symbol:"house.fill"},{state:"not_home",symbol:"figure.walk"}]},am={state:"unavailable",symbol:"questionmark.circle.fill",colorHex:_v};function rm(e,n){let t=Gv(e.trim().toLowerCase(),(n??"").trim().toLowerCase());return t.length===0?[]:[...t,am]}function Gv(e,n){if(Nv.includes(e)){let t=Zd({entityId:`${e}.seed`,displayName:"",domain:e});return[{state:"on",symbol:t.on,colorHex:Ot},{state:"off",symbol:t.off,colorHex:Gt}]}if(e==="binary_sensor"){let t=Dv[n]??Pv;return[{state:"on",symbol:t.on.symbol,colorHex:t.on.colorHex},{state:"off",symbol:t.off.symbol,colorHex:t.off.colorHex}]}return e==="weather"?zv.map(t=>({...t})):(Ov[e]??[]).map(t=>({state:t.state,symbol:t.symbol,colorHex:t.colorHex??wt(t.state)}))}function om(e,n){return e.map(t=>{let i=[];return n.icon&&i.push({kind:"setIcon",value:U(t.symbol)}),n.color&&i.push({kind:"setColor",value:U(t.colorHex)}),{comparison:t.state===am.state?{kind:"isUnavailable"}:{kind:"equals",value:U(t.state)},changes:i}})}function sm(e){let n=e?.kind;if(n?.kind!=="entityState")return;let t=n.domain||n.entityId.split(".")[0]||"";return t===""?void 0:{entityId:n.entityId,domain:t}}var lm="sun.sun";function dm(e){let n=e?.[lm],t=typeof n?.attributes?.friendly_name=="string"?n.attributes.friendly_name.trim():"";return{entityId:lm,displayName:t||"Sun",domain:"sun"}}var cm=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],Bv=[0,1,2,3,4];function um(e){let n=[];for(let t of e??[]){let i=t.trim();if(i==="")continue;let a=Number(i);Number.isInteger(a)&&a>=0&&a<=6&&!n.includes(a)&&n.push(a)}return n.sort((t,i)=>t-i)}function nc(e){return[...new Set(e)].filter(n=>n>=0&&n<=6).sort((n,t)=>n-t).map(String)}var pm=[{kind:"afterSunset",label:"After sunset",hint:"True from sunset to sunrise, from the sun entity's own state."},{kind:"daytime",label:"Daytime",hint:"True while the sun is up."},{kind:"sunElevation",label:"Sun below an angle",hint:"The sun's elevation in degrees, below a number you set. 0 is the horizon."},{kind:"weekday",label:"Weekday is one of",hint:"A row of days, starting on Monday to Friday."},{kind:"timeBetween",label:"Time between",hint:"A clock window that may wrap midnight, starting at 22:00 to 06:00."}];function Vv(e){return[hm(e,"below_horizon")]}function Uv(e){return[hm(e,"above_horizon")]}function hm(e,n){return{id:ie(),value:{kind:{kind:"entityState",...e}},comparison:{kind:"equals",value:U(n)}}}function Wv(e,n=0){return[{id:ie(),value:{kind:{kind:"entityAttribute",...e,attribute:"elevation"}},comparison:{kind:"lessThan",value:U(String(n))}}]}function Kv(e=Bv){return[{id:ie(),value:{kind:{kind:"time",timeField:"weekday"}},comparison:{kind:"isOneOf",options:nc(e)}}]}function jv(e="22:00",n="06:00"){return[{id:ie(),value:{kind:{kind:"time",timeField:"now"}},comparison:{kind:"timeBetween",value:U(e),upper:U(n)}}]}function fm(e,n){switch(e){case"afterSunset":return Vv(n);case"daytime":return Uv(n);case"sunElevation":return Wv(n);case"weekday":return Kv();case"timeBetween":return jv()}}function ic(e){delete e.coloring,delete e.bands,delete e.bandAboveColorHex,delete e.highlight,delete e.highColorHex,delete e.lowColorHex}function sr(e){for(let n of e)delete n.partId}function mm(e,n=ie()){if(e.parts!==void 0&&e.parts.length>0)return e.parts[0].id;let t={id:n,value:structuredClone(e.value)};return e.coloring==="bands"&&(e.bands?.length??0)>0&&(t.coloring="bands",t.bands=e.bands,e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==be&&(t.bandAboveColorHex=e.bandAboveColorHex)),ic(e),e.parts=[t],e.value=Ia(e.parts),n}function ls(e,n=[]){let t=e.parts??[];if(e.countdown===!0||t.length===0)return delete e.parts,sr(e.rules),{ok:!0,joined:!1,moved:[]};if(t.length===1){let a=t[0],r=[];return e.value=a.value,a.fontSize!==void 0&&(e.fontSize=a.fontSize,r.push("fontSize")),a.fontWeight!==void 0&&(e.fontWeight=a.fontWeight,r.push("fontWeight")),a.colorHex!==void 0&&(e.colorSlot.baseColorHex=a.colorHex,r.push("color")),ic(e),a.coloring!==void 0&&a.coloring!=="uniform"&&(e.coloring=a.coloring),a.bands!==void 0&&a.bands.length>0&&(e.bands=a.bands),a.bandAboveColorHex!==void 0&&(e.bandAboveColorHex=a.bandAboveColorHex),a.coloring==="bands"&&(a.bands?.length??0)>0&&r.push("bands"),delete e.parts,sr(e.rules),{ok:!0,joined:!1,moved:r}}let i=ac(t,n);return i.ok?(e.value=i.value,ic(e),delete e.parts,sr(e.rules),{ok:!0,joined:!0}):i}function rr(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function or(e){return e.includes("{")?`{% raw %}${e}{% endraw %}`:e}function qv(e,n){let t=e,i=e.format;for(let r=0;t.kind.kind==="named";r++){if(r>8)return;let o=t.kind.id.toUpperCase(),s=n.find(l=>l.id.toUpperCase()===o)?.value;if(!s)return;i=Ve(i)?s.format:i,t=s}let a={kind:t.kind};return Ve(i)||(a.format=i),a}function Yv(e,n){let t=qv(e,n);if(!t)return{blocked:"kind"};let i=ri(t);if(i!==void 0)return or(i);let a=t.kind,r=t.format??{};if(r.relativeTime||r.duration)return{blocked:"format"};let o="",s;switch(a.kind){case"entityState":s=`states(${rr(a.entityId)})`;break;case"jinja":{if(a.value.trim()==="")return"";let c=a.value.includes("{{")||a.value.includes("{%"),u=r.decimals===void 0&&r.multiply===void 0&&r.offset===void 0&&!r.textCase;if(c&&u)return or(r.prefix??"")+a.value+or(r.suffix??"");c?(o=`{% set wa_text %}${a.value}{% endset %}`,s="wa_text"):s=`(${a.value})`;break}case"entityAttribute":case"entityAge":case"aggregate":case"time":{let c=ja(a);if(c===void 0)return{blocked:"kind"};s=c;break}default:return{blocked:"kind"}}if(r.decimals!==void 0||r.multiply!==void 0||r.offset!==void 0){let c=`(${s} | float(0))`;r.multiply!==void 0&&(c=`(${c} * ${r.multiply})`),r.offset!==void 0&&(c=`(${c} + ${r.offset})`),s=r.decimals!==void 0?`${rr(`%.${Math.max(0,Math.trunc(r.decimals))}f`)} | format(${c})`:c}let l=r.useEntityUnit&&"entityId"in a?a.entityId:void 0;l!==void 0&&(o+=`{% set wa_unit = state_attr(${rr(l)}, 'unit_of_measurement') %}`);let d="('' if not wa_unit else (wa_unit if wa_unit[:1] in ['\xB0', '%'] else ' ' ~ wa_unit))";if(r.textCase){let c=r.textCase==="upper"?"upper":r.textCase==="lower"?"lower":"title",u=[...r.prefix?[rr(r.prefix)]:[],`(${s})`,...l!==void 0?[d]:[],...r.suffix?[rr(r.suffix)]:[]].join(" ~ ");return`${o}{{ (${u}) | ${c} }}`}return o+or(r.prefix??"")+`{{ ${s} }}`+(l!==void 0?`{{ ${d} }}`:"")+or(r.suffix??"")}function ac(e,n=[]){if(e.every(a=>a.value.kind.kind==="literal"))return{ok:!0,value:Ia(e)};let t=[],i=[];return e.forEach((a,r)=>{let o=Yv(a.value,n);typeof o=="string"?t.push(o):i.push({index:r,partId:a.id,reason:o.blocked})}),i.length>0?{ok:!1,blocked:i}:{ok:!0,value:{kind:{kind:"jinja",value:t.join("")}}}}var us=[["threshold","Threshold line"],["now","Now line"],["zero","Zero line"],["grid","Grid lines"],["dots","Dots"],["times","Clock times"]],ym=[{label:"Newest",stat:"latest",marker:"latest"},{label:"First",stat:"first",marker:"first"},{label:"Highest",stat:"highest",marker:"highest"},{label:"Lowest",stat:"lowest",marker:"lowest"},{label:"Average",stat:"average"},{label:"Change",stat:"delta"},{label:"Total",stat:"sum"},{label:"Trend",stat:"trend"},{label:"Top of scale",stat:"top"},{label:"Bottom of scale",stat:"bottom"},{label:"Now",marker:"now"}],$i="color-mix(in srgb, var(--k) 30%, #6b7280)",cs='system-ui, -apple-system, "Segoe UI", sans-serif',Gn=40,ds=6,Xv=[22,17,11,16,27,23,35,31];function Jv(e={}){let n=(e.values??[]).filter(p=>Number.isFinite(p)),t=n.length>=2,i=t?n:Xv,a=Math.min(...i),r=Math.max(...i);t&&e.threshold!==void 0&&Number.isFinite(e.threshold)&&(a=Math.min(a,e.threshold),r=Math.max(r,e.threshold)),r===a&&(r+=1,a-=1);let o=p=>ds+(r-p)/(r-a)*(Gn-ds),s=i.length,l=i.map((p,f)=>10+f*100/(s-1)),d=i.map(o),c=p=>Math.min(Gn,Math.max(ds,p)),u=t&&e.now!==void 0&&Number.isFinite(e.now)?Math.min(s-1,Math.max(0,Math.round(e.now))):Math.round((s-1)*.6);return{xs:l,ys:d,y:o,real:t,zeroY:c(o(0)),thresholdY:c(o(t&&e.threshold!==void 0?e.threshold:(a+r)/2)),averageY:o(i.reduce((p,f)=>p+f,0)/s),column:{highest:i.indexOf(Math.max(...i)),lowest:i.indexOf(Math.min(...i)),first:0,latest:s-1,now:u}}}function Zv(e){let n=e.xs.map((t,i)=>`${i===0?"M":"L"}${t.toFixed(1)} ${e.ys[i].toFixed(1)}`).join("");return w`
    <path d=${`${n}L${e.xs[e.xs.length-1]} ${Gn}L${e.xs[0]} ${Gn}Z`} fill=${$i} opacity=".18" />
    <path d=${n} fill="none" stroke=${$i} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`}function Qv(e){let n=Math.min(10,Math.max(1,100/e.xs.length*.7));return w`${e.xs.map((t,i)=>{let a=Math.min(e.ys[i],Gn-1);return w`<rect x=${t-n/2} y=${a} width=${n} height=${Gn-a} rx=${Math.min(2,n/2)} fill=${$i} opacity=".45" />`})}`}function ek(){return w`${[[4,30,.35],[35,18,.7],[54,10,.35],[65,26,.7],[92,24,.35]].map(([n,t,i])=>w`<rect x=${n} y="10" width=${t} height="16" rx="3" fill=${$i} opacity=${i} />`)}`}function tk(){return w`
    <rect x="3" y="3" width="114" height="40" rx="5" fill=${$i} opacity=".22" />
    <circle cx="30" cy="16" r="6" fill=${$i} opacity=".6" />
    <path d="M3 43L3 36L34 20L56 32L80 16L117 38L117 43Z" fill=${$i} opacity=".5" />`}function On(e,n,t=2.6){return w`<circle cx=${e.xs[n]} cy=${e.ys[n]} r=${t} fill="var(--k)" />`}function Bt(e,n=!1){if(e===void 0||e==="")return"";let t=e.length*5.8+5,i=n?36:13;return w`<rect x="2" y=${i-9.5} width=${t} height="12.5" rx="3" fill="#000" fill-opacity=".7" />
    <text x="4.5" y=${i} font-family=${cs} font-size="10" font-weight="700" fill="var(--k)">${e}</text>`}function lr(e,n=!1){return w`<path d=${`M4 ${e}H116`} stroke="var(--k)" stroke-width="1.4" stroke-dasharray=${n?"4 3":"none"} />`}function gm(e){return w`<g font-family=${cs} font-size="6.5" fill="var(--k)">
    <text x="4" y=${e}>9 AM</text><text x="60" y=${e} text-anchor="middle">1 PM</text><text x="116" y=${e} text-anchor="end">5 PM</text>
  </g>`}function nk(e,n,t){if(e==="timeline:times")return gm(38);if(e==="image:time")return w`<rect x="70" y="30" width="42" height="10" rx="5" fill="#000" fill-opacity=".55" stroke="var(--k)" stroke-width=".8" />
      <text x="91" y="37.5" text-anchor="middle" font-family=${cs} font-size="7" fill="var(--k)">3:41:07</text>`;let[i,a]=e.split(":"),r=Math.min(2.2,Math.max(.8,40/n.xs.length));if(i==="draw")switch(a){case"threshold":return lr(n.thresholdY,!0);case"now":return w`<path d=${`M${n.xs[n.column.now]} 4V${Gn+2}`} stroke="var(--k)" stroke-width="1.4" />`;case"zero":return w`${lr(n.zeroY)}<text x="115" y=${Math.max(9,n.zeroY-3)} text-anchor="end" font-family=${cs} font-size="6.5" fill="var(--k)">0</text>`;case"times":return gm(45);case"dots":return w`${n.xs.map((d,c)=>On(n,c,r))}`;case"grid":return w`<path d="M4 10H116M4 20H116M4 30H116M4 40H116" stroke="var(--k)" stroke-width=".8" opacity=".7" />`}if(i==="number"){let d=n.real?t[a]:void 0,{first:c,latest:u}=n.column;switch(a){case"latest":return w`${On(n,u)}${Bt(d)}`;case"first":return w`${On(n,c)}${Bt(d)}`;case"highest":return w`${On(n,n.column.highest)}${Bt(d)}`;case"lowest":return w`${On(n,n.column.lowest)}${Bt(d)}`;case"average":return w`${lr(n.averageY,!0)}${Bt(d)}`;case"delta":return w`<path d=${`M${n.xs[c]} ${n.ys[c]}L${n.xs[u]} ${n.ys[u]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />
        ${On(n,c)}${On(n,u)}${Bt(d)}`;case"sum":return w`${n.xs.map((p,f)=>On(n,f,r))}${Bt(d)}`;case"trend":return w`<path d=${`M${n.xs[c]} ${n.ys[c]}L${n.xs[u]} ${n.ys[u]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />${Bt(d)}`;case"top":return w`${lr(ds)}${Bt(d,!0)}`;case"bottom":return w`${lr(Gn)}${Bt(d)}`}}let o=n.column[a]??0,s=n.xs[o],l=Math.max(5,n.ys[o]-7);return a==="highest"?w`<path d=${`M${s} ${l-4}L${s+4} ${l+3}L${s-4} ${l+3}Z`} fill="var(--k)" />`:a==="now"?w`<path d=${`M${s-4} ${l-3}L${s+4} ${l-3}L${s} ${l+4}Z`} fill="var(--k)" />`:w`<circle cx=${s} cy=${l} r="3" fill="var(--k)" />`}function rc(e){return e==="timeline:times"?"timeline":e==="image:time"?"image":"chart"}function bm(e,n,t=!1,i={}){let a=Jv(i),r=e==="timeline"?ek():e==="image"?tk():t?Qv(a):Zv(a),o=n!==void 0&&rc(n)===e?nk(n,a,i.texts??{}):"";return h`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${r}${o}</svg>`}function xm(e){if(e==="timeline:times")return"Clock times";if(e==="image:time")return"Timestamp";let[n,t]=e.split(":");return n==="draw"?us.find(([i])=>i===t)?.[1]??t:n==="number"?`${Rt.find(([i])=>i===t)?.[1]??t} number`:`${Ht.find(([i])=>i===t)?.[1]??"Reading"} marker`}var ik={"draw:threshold":"A flat line at a value you pick, so a reading over it stands out.","draw:now":"An upright line through the reading that counts as now.","draw:zero":"A flat line where zero falls. It is drawn only when the readings cross zero.","draw:times":"The clock times of the chart's span, spread under the plot.","draw:dots":"A dot on every reading. Line and area charts only.","draw:grid":"Faint rules across the plot, to read heights against.","number:latest":"A text layer printing the newest reading, with the entity's unit after it.","number:first":"A text layer printing the oldest reading in the span.","number:highest":"A text layer printing the highest reading in the span.","number:lowest":"A text layer printing the lowest reading in the span.","number:average":"A text layer printing the average of every reading in the span.","number:delta":"A text layer printing the newest reading minus the first, with the unit after it.","number:sum":"A text layer printing every reading in the span added up, with the unit after it.","number:trend":"A text layer printing the change as an arrow: up, down, or flat when it is too small to print.","number:top":"A text layer printing the value at the top of the plot. On a Fixed scale, this is Max.","number:bottom":"A text layer printing the value at the bottom of the plot. On a Fixed scale, this is Min.","marker:highest":"An icon over the highest reading. It starts as a triangle.","marker:lowest":"An icon over the lowest reading. It starts as a dot.","marker:now":"An icon over the reading that counts as now.","marker:first":"An icon over the oldest reading.","marker:latest":"An icon over the newest reading.","marker:threshold":"An icon at the threshold's height.","marker:zero":"An icon at zero's height.","timeline:times":"The clock times of the timeline's span, spread under the strip.","image:time":"The time the picture was fetched, so a picture that stops updating reads as stale."};function oc(e){return ik[e]}function wm(e){let n=Na(e),t=e.fillColorHex!==void 0;if(e.style==="bars"){let i=e.barBorderWidth!==void 0;if(!n)return{main:"Bar colour",...t?{fill:{label:"Fill colour",empty:"Bar colour",note:"Fills every bar in place of Bar colour, even when a state changes the colour. Clear it to fill in Bar colour.",warn:!0}}:{},...i?{border:{label:"Border colour",empty:"White"}}:{}};let a={};return i?(a.fill={label:"Band fill",empty:"Each band's colour",...t?{note:"Every band with no fill of its own fills in this."}:{}},a.border={label:"Band border",empty:"White",note:"Every band with no border of its own uses this."}):t&&(a.fill={label:"Band fill",empty:"Each band's colour",note:"This fill wins over every band's colour. Clear it to fill each bar in its band's colour.",warn:!0}),a}return e.style==="line"?n?{}:{main:"Line colour"}:n?t?{fill:{label:"Fill colour",empty:"Band colours",...e.fillBands?{note:"A fill colour wins over Band fill. Clear it to fill each stretch in its band's colour.",warn:!0}:{}}}:e.fillBands?{}:{main:"Fill colour"}:{main:"Line colour",fill:{label:"Fill colour",empty:"Line colour"}}}function ak(e){switch(e){case"light":return w`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;case"switch":case"input_boolean":return w`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;case"sensor":return w`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;case"binary_sensor":return w`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;case"climate":case"water_heater":return w`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;case"humidifier":return w`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;case"media_player":return w`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;case"camera":return w`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;case"cover":return w`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;case"lock":return w`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;case"fan":return w`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;case"script":case"automation":return w`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;case"scene":return w`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;case"person":case"device_tracker":return w`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;case"vacuum":case"lawn_mower":return w`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;case"weather":return w`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;case"sun":return w`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;case"input_number":case"number":return w`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;case"input_select":case"select":return w`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;case"input_text":case"text":return w`<path d="M5 6H19M12 6V19M9 19H15" />`;case"button":case"input_button":return w`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;case"alarm_control_panel":return w`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;case"update":return w`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;case"todo":return w`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;case"calendar":return w`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;case"timer":case"counter":return w`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;case"zone":return w`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;case"remote":return w`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;case"siren":return w`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;case"valve":return w`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;case"image":case"image_processing":return w`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"event":return w`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;case"group":return w`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;default:return w`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`}}function dr(e){return h`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ak(e)}</svg>`}var rk={binary_sensor:"Binary sensor",input_boolean:"Toggle helper",input_number:"Number helper",input_select:"Dropdown helper",input_text:"Text helper",input_button:"Button helper",input_datetime:"Date helper",alarm_control_panel:"Alarm panel",device_tracker:"Device tracker",media_player:"Media player",water_heater:"Water heater",lawn_mower:"Lawn mower",image_processing:"Image processing",persistent_notification:"Notification",remote:"Remote",sun:"Sun",todo:"To-do list"};function vm(e){let n=rk[e];if(n!==void 0)return n;if(e==="")return"";let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}var ok=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]);function sc(e){return ok.has(e.trim().toLowerCase())}function sk(e,n,t){let i=ko({frame:{...e.frame},isHidden:!1},e.family,n,t).frame;return Lo(i,{})}var wc=["content","look","numbers","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function Ee(e){return n=>e(n.target.value)}function un(e,n){let t=n===void 0?zd(e.watchAppVersion):zd(e.watchAppVersion,n);return t===void 0?m:h`<div class="hint keep">${t}</div>`}function kr(e){if(e===void 0||e.atDefault)return m;let n=`Changed. Click to reset. ${e.title.replace(/\.$/,"")}.`;return h`<button type="button" class="reset-dot" title=${n} aria-label=${n}
    @pointerdown=${t=>t.stopPropagation()}
    @click=${t=>{t.preventDefault(),t.stopPropagation(),e.reset()}}></button>`}function Ne(e,n,t){let i=kr(n),a=[i===m?"":"changed",t?"scrub":""].filter(r=>r!=="").join(" ");return h`<span class=${a===""?m:a} title=${t?"Drag left or right to change":m}
    @pointerdown=${t??m}>${e}${i}</span>`}var Es="wa-scrub-start",Fs="wa-scrub-end",lk=3,dk=3;function ck(e,n){return e!==void 0&&Number.isFinite(e)?e:Math.max(0,n.min??0)}function uk(e,n,t={}){let i=n!==void 0&&n>0?n:10**-Math.min(2,mc(e));return t.coarse?i*10:t.fine?i/10:i}function pk(e,n,t,i){let a=e+Math.round((n-e)/t)*t;return i.min!==void 0&&(a=Math.max(i.min,a)),i.max!==void 0&&(a=Math.min(i.max,a)),Number(a.toFixed(Math.min(10,Math.max(mc(t),mc(e)))))}function mc(e){if(!Number.isFinite(e)||Number.isInteger(e))return 0;let n=String(e),t=/e-(\d+)$/.exec(n);return t?Number(t[1])+(n.split("e")[0].split(".")[1]??"").length:(n.split(".")[1]??"").length}function qm(e,n,t,i,a,r){let o=ck(t,a),s=n.clientX,l=s,d=o,c=o,u=!1,p=g=>{if(!u){if(Math.abs(g.clientX-s)<lk)return;u=!0,l=g.clientX,e.classList.add("scrubbing"),e.dispatchEvent(new CustomEvent(Es,{bubbles:!0,composed:!0}))}let b=uk(o,a.step,{coarse:g.shiftKey,fine:g.altKey});d+=(g.clientX-l)/dk*b,l=g.clientX,a.min!==void 0&&(d=Math.max(a.min,d)),a.max!==void 0&&(d=Math.min(a.max,d));let y=pk(o,d,b,a);y!==c&&(c=y,i(y))},f=g=>{if(e.removeEventListener("pointermove",p),e.removeEventListener("pointerup",f),e.removeEventListener("pointercancel",f),u){e.classList.remove("scrubbing"),e.dispatchEvent(new CustomEvent(Fs,{bubbles:!0,composed:!0}));let b=y=>{y.preventDefault(),y.stopPropagation()};e.addEventListener("click",b,{capture:!0,once:!0}),setTimeout(()=>e.removeEventListener("click",b,{capture:!0}),0)}r(u,g)};e.setPointerCapture(n.pointerId),e.addEventListener("pointermove",p),e.addEventListener("pointerup",f),e.addEventListener("pointercancel",f)}function Ms(e,n,t){return i=>{if(i.button!==0||!i.isPrimary)return;let a=i.currentTarget;a.closest(".field")?.querySelector("input[type=number]")?.disabled||(i.preventDefault(),qm(a,i,e,n,t,()=>{}))}}function $r(e,n,t){return i=>{let a=i.currentTarget;i.button!==0||!i.isPrimary||a.disabled||a.matches(":focus")||(i.preventDefault(),qm(a,i,e,n,t,(r,o)=>{r||o.type!=="pointerup"||(a.focus(),a.select())}))}}function Vn(e,n,t,i=a=>String(a)){if(n===void 0)return;let a=n;return{atDefault:e===a,title:`Back to ${i(a)}`,reset:()=>t(a)}}function _e(e,n,t,i={}){return h`<label class="field">${Ne(e,Vn(n,i.def,t,a=>a===""?"empty":a))}
    <input type="text" .value=${n} placeholder=${i.placeholder??""} list=${i.list??m}
      class=${i.mono?"mono":""} @input=${Ee(t)} /></label>`}function Ym(e,n,t,i=3){return h`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${n} class="mono" @input=${Ee(t)}></textarea></label>`}function ee(e,n,t,i={}){let a=i.def===null?{atDefault:n===void 0,title:"Back to none",reset:()=>t(void 0)}:Vn(n,i.def,t);return h`<label class="field num">${Ne(e,a,Ms(n,t,i))}${Cr(n,t,i)}</label>`}function Cr(e,n,t){let i=e===void 0||Number.isNaN(e)?"":String(e),a=h`<input type="number" .value=${i} step=${t.step??"any"} min=${t.min??m} max=${t.max??m}
      aria-label=${t.ariaLabel??m} placeholder=${t.placeholder??m}
      data-scrub @pointerdown=${$r(e,n,t)}
      @input=${Ee(r=>{if(r.trim()===""){t.optional&&n(void 0);return}let o=Number(r);Number.isNaN(o)||n(o)})} />`;return t.unit===void 0&&t.lead===void 0?a:h`<span class=${t.lead===void 0?"num-box":"num-box lead"} style=${`--wa-unit:${t.unit?.length??0}`}>${t.lead===void 0?m:h`<span class="lead" aria-hidden="true">${t.lead}</span>`}${a}${t.unit===void 0?m:h`<span class="unit" aria-hidden="true">${t.unit}</span>`}</span>`}function He(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<label class="field">${Ne(e,Vn(n,a.def,i,r))}
    <select @change=${Ee(o=>i(o))}>
      ${t.map(([o,s])=>h`<option value=${o} ?selected=${o===n}>${s}</option>`)}
    </select></label>`}function ae(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<div class="field seg-field">${Ne(e,Vn(n,a.def,o=>i(o,null),r))}
    ${Ti(e,n,t,i,a)}</div>`}function Ti(e,n,t,i,a={}){return h`<div class="seg wide" role="radiogroup" aria-label=${e}>
      ${t.map(([r,o])=>{let s=n===void 0&&r===a.inherited,l=s?`${a.titles?.[r]??o} (from the layer)`:a.titles?.[r];return h`<button type="button" role="radio" aria-checked=${r===n?"true":"false"}
        class=${r===n?"on":s?"inh":""} title=${l??m} ?disabled=${a.disabled?.[r]===!0}
        @click=${d=>{r!==n&&i(r,d.currentTarget)}}>${o}</button>`})}
    </div>`}function hk(e,n){let t=i=>Vn(i.value,i.def,i.set,a=>i.options.find(([r])=>r===a)?.[1]??a);return h`<div class="field seg-field pair">${Ne(e.label,t(e))}
    <div class="pair-row">
      ${Ti(e.label,e.value,e.options,e.set,e)}
      ${Ne(n.label,t(n))}
      ${Ti(n.label,n.value,n.options,n.set,n)}
    </div></div>`}function Vt(e,n,t,i){let a=i.format??(o=>String(Math.round(o*100)/100)),r=o=>{o!==void 0&&o>=i.min&&o<=i.max&&t(o)};return h`<div class="field slider num">${Ne(e,Vn(n,i.def,t,a),Ms(n,t,i))}
    <div class="slider-row">
      ${i.range===!1?m:h`<input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(n)} aria-label=${e}
        @input=${Ee(o=>{let s=Number(o);Number.isNaN(s)||t(s)})} />`}
      ${Cr(n,r,{step:i.step,min:i.min,max:i.max,ariaLabel:e,...i.unit===void 0?{}:{unit:i.unit}})}
    </div></div>`}function Re(e,n,t,i,a={}){return h`<label class="field check">${Ne(e,Vn(n,i,t,r=>r?"on":"off"))}<input type="checkbox" .checked=${n} ?disabled=${a.disabled===!0} @change=${r=>t(r.target.checked)} /></label>`}function we(e,n,t,i=!1,a){let{rgb:r,alpha:o}=Xm(n),s=a===void 0?void 0:{atDefault:kc(n,a??void 0),title:a===null?"Back to none":`Back to ${a}`,reset:()=>t(a??void 0)},l=i&&n===void 0;return h`<div class="field color">${Ne(e,s)}
    <div class="color-row">
      ${i?h`<input type="checkbox" title="Enabled" aria-label=${`${e} on`} .checked=${n!==void 0} @change=${d=>t(d.target.checked?vs(r,o):void 0)} />`:m}
      ${Sr(e,n,t,l)}
    </div></div>`}function fk(e){let n=[...e.stops].sort((t,i)=>t.at-i.at).map(t=>`${t.colorHex} ${Math.round(Math.max(0,Math.min(1,t.at))*100)}%`).join(", ");return e.kind==="radial"?`radial-gradient(circle at 50% 50%, ${n})`:`linear-gradient(90deg, ${n})`}function fr(e){return{...e,stops:[...e.stops].sort((n,t)=>n.at-t.at)}}function ws(e,n,t,i){let a=n!==void 0,r=n,o=h`<div class="field color">${Ne(e,{atDefault:!a,title:"Back to one flat colour",reset:()=>t(void 0)})}
    <div class="color-row">
      <input type="checkbox" title="Enabled" aria-label=${`${e} on`} .checked=${a}
        @change=${d=>t(d.target.checked?fr(i()):void 0)} />
      ${r===void 0?h`<span class="hint">One flat colour</span>`:h`<span class="fill-bar" style=${`--g:${fk(r)}`} title="Drag a chip to move that colour">
            ${r.stops.map((d,c)=>h`<span class="fill-chip" style=${`left:${Math.round(Math.max(0,Math.min(1,d.at))*100)}%;--sw:${d.colorHex}`}
              @pointerdown=${mk(r,c,t)}></span>`)}
          </span>`}
    </div></div>`;if(r===void 0)return o;let s=r.stops,l=d=>t(fr({...r,stops:d}));return h`${o}
    <div class="grid2">
      ${ae("Gradient",r.kind,Vu,d=>{let c={...r,kind:d};d==="radial"&&delete c.angle,t(fr(c))},{def:"linear"})}
      ${r.kind==="linear"?ee("Angle",r.angle??0,d=>{let c={...r},u=d??0;u===0?delete c.angle:c.angle=u,t(fr(c))},{step:5,def:0,unit:"\xB0"}):m}
    </div>
    ${s.map((d,c)=>h`<div class="field color band-row">
      <span class="fill-stop-n">${c+1}</span>
      <div class="color-row">
        ${Sr(`Stop ${c+1}`,d.colorHex,u=>l(s.map((p,f)=>f===c?{...p,colorHex:u??"#FFFFFF"}:p)))}
        ${Cr(Math.round(d.at*100),u=>l(s.map((p,f)=>f===c?{...p,at:Math.max(0,Math.min(1,(u??0)/100))}:p)),{step:1,min:0,max:100,unit:"%",ariaLabel:`Stop ${c+1} position`})}
        <button class="small" title="Remove this colour" ?disabled=${s.length<=ml}
          @click=${()=>l(s.filter((u,p)=>p!==c))}>−</button>
      </div></div>`)}
    ${s.length<Qr?h`<button class="small" @click=${()=>{let d=[...s].sort((p,f)=>p.at-f.at),c=.5,u=-1;for(let p=1;p<d.length;p++){let f=d[p].at-d[p-1].at;f>u&&(u=f,c=(d[p].at+d[p-1].at)/2)}l([...s,{at:c,colorHex:At(r,c)}])}}>Add a colour</button>`:h`<div class="hint">A gradient takes at most ${Qr} colours.</div>`}`}function mk(e,n,t){return i=>{let a=i.currentTarget,r=a.parentElement;if(!r)return;i.preventDefault(),a.setPointerCapture(i.pointerId);let o=e,s=d=>{let c=r.getBoundingClientRect();if(c.width<=0)return;let u=Math.max(0,Math.min(1,(d.clientX-c.left)/c.width));o={...e,stops:e.stops.map((p,f)=>f===n?{...p,at:u}:p)},t(o)},l=()=>{a.removeEventListener("pointermove",s),a.removeEventListener("pointerup",l),a.removeEventListener("pointercancel",l),t(fr(o))};a.addEventListener("pointermove",s),a.addEventListener("pointerup",l),a.addEventListener("pointercancel",l)}}function Xm(e){let n=(e??"").replace(/^#/,""),t=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n);return{valid:t,swatch:t?`#${n}`:"transparent",rgb:t?`#${n.slice(0,6)}`:"#ffffff",alpha:t&&n.length===8?Math.round(parseInt(n.slice(6,8),16)/255*100):100}}function vs(e,n){let t=e.replace(/^#/,"").toUpperCase();return n>=100?`#${t}`:`#${t}${Math.round(n/100*255).toString(16).padStart(2,"0").toUpperCase()}`}function Sr(e,n,t,i=!1,a="#RRGGBB"){let{valid:r,swatch:o,rgb:s,alpha:l}=Xm(n);return h`<span class="color-box">
      <span class="color-swatch" style=${`--sw:${i||!r?"transparent":o}`} title="Pick a colour">
        <input type="color" .value=${s} ?disabled=${i} aria-label=${`${e}: pick a colour`} @input=${Ee(d=>t(vs(d,l)))} />
      </span>
      <input type="text" class="mono hex" .value=${n??""} placeholder=${a} spellcheck="false" aria-label=${`${e}: hex`} ?disabled=${i}
        @input=${Ee(d=>{let c=d.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(c)&&t(c.startsWith("#")?c.toUpperCase():`#${c.toUpperCase()}`)})} />
      <span class="num-box alpha" style="--wa-unit:1">
        <input type="number" min="0" max="100" step="1" .value=${String(l)} title="Opacity" aria-label=${`${e}: opacity`} ?disabled=${i}
          data-scrub @pointerdown=${$r(l,d=>t(vs(s,d)),{step:1,min:0,max:100})}
          @input=${Ee(d=>{let c=Number(d);d.trim()!==""&&c>=0&&c<=100&&t(vs(s,Math.round(c)))})} />
        <span class="unit" aria-hidden="true">%</span>
      </span>
    </span>`}function vc(e,n,t,i){let a={atDefault:n===void 0,title:`Back to ${t.toLowerCase()}`,reset:()=>i(void 0)};return h`<div class="field color">${Ne(e,a)}
    <div class="color-row">${Sr(e,n,i,!1,t)}</div></div>`}function lc(e,n,t){return h`${vc(e.label,n,e.empty,t)}${e.note===void 0?m:h`<div class=${e.warn?"hint warn":"hint"}>${e.note}</div>`}`}function kc(e,n){return e===void 0||n===void 0?e===n:e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function Rs(e,n){let t=e[n],i=t&&typeof t.attributes.friendly_name=="string"?t.attributes.friendly_name:n;return{entityId:n,displayName:i,domain:n.split(".")[0]??""}}function gk(e,n,t){let i=n===void 0?void 0:typeof n=="string"?[n]:n,a=[];for(let[r,o]of Object.entries(e)){let s=r.split(".")[0]??"";if(i!==void 0&&!i.includes(s))continue;let l=typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name.trim():"",d=t?.(r);a.push({entityId:r,name:l||r,state:o?.state??"",domain:s,...d?{area:d}:{}})}return a.sort((r,o)=>r.name.localeCompare(o.name)||r.entityId.localeCompare(o.entityId)),a}function km(e){let{entities:n,devices:t,areas:i}=e;if(!n||!i)return;let a=r=>{if(!r)return;let o=i[r]?.name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0};return r=>{let o=n[r];if(o)return a(o.area_id)??a(o.device_id?t?.[o.device_id]?.area_id:void 0)}}var Jm=50;function yk(e){let n=e.state.trim().split(/\s+/)[0]??"";return n!==""&&Number.isFinite(Number(n))}function bk(e,n,t=Jm,i){let a=n.trim().toLowerCase(),r=l=>i===void 0||i(l)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((l,d)=>r(l)-r(d))).slice(0,t);let o=a.split(/\s+/),s=[];for(let l of e){let d=l.entityId.toLowerCase(),c=l.name.toLowerCase(),u=(l.area??"").toLowerCase(),p=-1;d===a?p=0:d.startsWith(a)?p=1:c.startsWith(a)?p=2:d.includes(a)?p=3:c.includes(a)?p=4:o.length>1&&o.every(f=>d.includes(f)||c.includes(f))?p=5:u!==""&&(u.includes(a)||o.length>1&&o.every(f=>d.includes(f)||c.includes(f)||u.includes(f)))&&(p=6),p>=0&&s.push({c:l,rank:p})}return s.sort((l,d)=>l.rank-d.rank||r(l.c)-r(d.c)||l.c.name.localeCompare(d.c.name)||l.c.entityId.localeCompare(d.c.entityId)),s.slice(0,t).map(l=>l.c)}var xk=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function Zm(e){return xk.test(e.trim())}function wk(e,n,t){let i=e.trim();if(i!==n.entityId){if(i==="")return{entityId:"",displayName:"",domain:""};if(i in t)return Rs(t,i);if(Zm(i))return{...n,entityId:i,domain:i.split(".")[0]??""}}}var Si=new Map;function Te(e){let n=e instanceof Node?e:null;for(let t=0;n&&t<8;t+=1){let i=n.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}n=a}}function $c(e){return Si.has(e)}function Ut(e,n,t,i,a,r={}){let o=e.hass.states,s=Si.get(a),l=s?bk(gk(o,r.domain,km(e.hass)),s.query,Jm,r.preferNumeric?yk:void 0):[],d=s?Math.max(0,Math.min(s.index,l.length-1)):0,c=t.entityId?o[t.entityId]:void 0,u=(k,C,M=0)=>{Si.set(a,{query:C,index:M}),Te(k)},p=k=>{Si.delete(a),Te(k)},f=k=>{let C=wk(k,t,o);C&&i(C)},g=(k,C)=>{i(Rs(o,k.entityId)),p(C)},b=()=>Math.max(0,Math.min(Si.get(a)?.index??0,l.length-1)),y=k=>{let C=k.target;if(k.key==="ArrowDown"||k.key==="ArrowUp"){k.preventDefault();let M=Si.get(a);if(!M){u(C,C.value);return}let D=k.key==="ArrowDown"?b()+1:b()-1;u(C,M.query,Math.max(0,Math.min(l.length-1,D))),vk(C);return}if(k.key==="Enter"){k.preventDefault();let M=l[b()];s&&M?g(M,C):(f(C.value),p(C));return}if(k.key==="Escape"){if(!s)return;k.preventDefault(),k.stopPropagation(),p(C)}},x=t.entityId?km(e.hass)?.(t.entityId):void 0,$=t.entityId===""?h`<div class="hint">Type part of a name, a room, or an id.</div>`:c?h`<div class="entity-current">
          <span class="ent-ico ${sc(c.state)?"on":""}">${dr(t.domain||t.entityId.split(".")[0]||"")}</span>
          <span class="ent-name">${typeof c.attributes.friendly_name=="string"?c.attributes.friendly_name:t.entityId}</span>
          ${x?h`<span class="ent-area">${x}</span>`:m}
          <span class="ent-state">${c.state}</span>
        </div>`:h`<div class="hint warn">Not in Home Assistant right now.</div>`;return h`<div class="field entity-field">
    <span>${n}</span>
    <div class="ent-box ${s?"open":""} ${r.needed&&t.entityId===""?"needs":""}">
      <span class="ent-glass">${P("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${s?"true":"false"} autocomplete="off" spellcheck="false"
        .value=${s?s.query:t.entityId}
        placeholder="Search by name, room, or id"
        @focus=${k=>{let C=k.target;u(C,t.entityId),C.select()}}
        @input=${k=>{let C=k.target;u(C,C.value)}}
        @keydown=${y}
        @blur=${k=>{let C=k.target;s&&f(C.value),p(C)}} />
      ${(s?s.query:t.entityId)===""?m:h`<button type="button" class="ent-clear" title="Clear" aria-label="Clear"
        @mousedown=${k=>k.preventDefault()}
        @click=${k=>{let C=k.currentTarget.closest(".ent-box")?.querySelector("input")??null;i({entityId:"",displayName:"",domain:""}),Si.set(a,{query:"",index:0}),Te(C),C?.focus()}}>${P("close")}</button>`}
    </div>
    ${s?h`<div class="entity-results" role="listbox">
          ${l.length===0?h`<div class="hint keep" style="padding:6px 8px">${Zm(s.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:l.map((k,C)=>h`<button type="button" role="option" aria-selected=${C===d?"true":"false"} class="ent ${C===d?"hl":""}"
                @mousedown=${M=>M.preventDefault()} @click=${M=>g(k,M.target)}>
                <span class="ent-ico ${sc(k.state)?"on":""}">${dr(k.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${k.name}</span>
                  <span class="ent-sub">
                    ${k.area?h`<span class="ent-area">${k.area}</span>`:m}
                    <span class="ent-id mono">${k.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${vm(k.domain)}</span>
                  <span class="ent-state">${k.state}</span>
                </span>
              </button>`)}
        </div>`:$}
  </div>`}function vk(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var $m=120;function kk(e,n,t,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(es.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:n.trim()!==""&&t.length>0?{names:[...t],fromPack:!0}:{names:a(ts),fromPack:!1}}function Cm(e,n){return n.size===0?e.length:e.filter(t=>n.has(t)).length}function $k(e){return[{value:"",label:`Starter set (${Cm(ts,e)})`},...es.map(n=>({value:n.name,label:`${n.name} (${Cm(n.symbols,e)})`}))]}function Ck(e){return e.length>0?e.length:ts.length}function Sm(e,n,t,i){return t?n>e?`Showing ${e} of ${n}. Type more to narrow it down.`:n===1?"1 symbol matches.":`${n} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function ps(e,n,t,i){let a=e.icons.render(n,22,"#FFFFFF");return h`<button type="button" class="sym ${t?"on":""}" title=${n} @click=${()=>i(n)}>
    <span class="sym-glyph">${a??h`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${n}</span>
  </button>`}function Qm(e,n,t,i,a){let r=e.symbols,o=r.isOpen(i),s=r.query(i),l=e.icons.names(),d=l??[],c=new Set(d),u=n.trim(),p=u.startsWith(Je),f=a!==void 0,g=f?r.pack(i)??(p?"mdi":"sf"):"sf",b=Sk(u,c),y=k=>{t(k),a?.(k.startsWith(Je)?e.icons.mdiPath?.(k):void 0),r.noteUsed(k)},x=k=>{if(t(k),!f)return;let C=k.trim();a?.(C.startsWith(Je)?e.icons.mdiPath?.(C):void 0)},$=m;if(o&&g==="mdi"){let k=e.icons.mdiNames?.(),C=Tk(k??[],s),M=C.slice(0,$m),D=r.recent.filter(I=>I.startsWith(Je));$=h`<div class="sym-browse">
      ${Tm(r,i,g)}
      <div class="sym-controls">
        <input type="search" placeholder="Search Material Design icons" .value=${s} @input=${Ee(I=>r.setQuery(i,I))} />
      </div>
      ${D.length===0?m:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${D.map(I=>ps(e,I,I===u,y))}</div>`}
      <div class="sym-grid">${M.map(I=>ps(e,I,I===u,y))}</div>
      ${k===void 0?h`<div class="hint keep">Loading the Material Design catalogue.</div>`:C.length===0?h`<div class="hint keep">Nothing matches that search. Any<code>mdi:</code> name can still be typed above.</div>`:h`<div class="hint keep">${Sm(M.length,C.length,!0,k.length)}</div>`}
      ${k!==void 0&&p&&!k.includes(u)?h`<div class="hint warn">There is no <code>${u}</code> in this build's Material Design set, so the watch draws a question mark.</div>`:m}
    </div>`}else if(o){let k=r.category(i),C=kk(k,s,d,c),M=Wd(C.names,s),D=C.fromPack?M.slice(0,$m):M,I=r.recent.filter(F=>!F.startsWith(Je)),T=c.size===0?I:I.filter(F=>c.has(F));$=h`<div class="sym-browse">
      ${f?Tm(r,i,g):m}
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${s} @input=${Ee(F=>r.setQuery(i,F))} />
        <select @change=${Ee(F=>r.setCategory(i,F))}>
          ${$k(c).map(F=>h`<option value=${F.value} ?selected=${F.value===k}>${F.label}</option>`)}
        </select>
      </div>
      ${T.length===0?m:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${T.map(F=>ps(e,F,F===u,y))}</div>`}
      <div class="sym-grid">${D.map(F=>ps(e,F,F===u,y))}</div>
      ${M.length===0?h`<div class="hint keep">Nothing matches that search. Anyname can still be typed above.</div>`:h`<div class="hint keep">
            ${Sm(D.length,M.length,s.trim()!=="",Ck(d))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?h`<div class="hint keep">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:m:h`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return h`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${n} placeholder="lightbulb.fill"
        @input=${Ee(x)} @change=${Ee(k=>{let C=k.trim();C.startsWith(Je)?e.icons.mdiPath?.(C)!==void 0&&r.noteUsed(k):(c.size===0||c.has(C))&&r.noteUsed(k)})} /></label>
    ${b?h`<div class="hint warn">The installed icon pack has no <code>${u}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:m}
    <button type="button" class="link" @click=${()=>r.toggle(i)}>${o?"Hide symbols":"Browse symbols"}</button>
    ${$}`}function Sk(e,n){let t=e.trim();return t!==""&&!t.startsWith(Je)&&n.size>0&&!n.has(t)}function Tk(e,n){let t=n.trim(),i=t.startsWith(Je)?t.slice(Je.length):t,a=e.map(r=>r.startsWith(Je)?r.slice(Je.length):r);return Wd(a,i).map(r=>Je+r)}function Tm(e,n,t){return h`<div class="seg wide" role="radiogroup" aria-label="Icon set">
    ${[["sf","SF Symbols"],["mdi","Material Design Icons"]].map(([a,r])=>h`<button type="button" role="radio" aria-checked=${a===t?"true":"false"}
      class=${a===t?"on":""}
      @click=${()=>{a!==t&&e.setPack(n,a)}}>${r}</button>`)}
  </div>`}var Ek=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Time since entity changed"],["aggregate","Several entities combined"],["chartStat","Number from a chart"],["time","Clock and date"],["dataAge","Time since last refresh"],["jinja","Template (Jinja)"],["named","Shared value"]],Fk={literal:"Words or a number you type. It never changes.",entityState:"What Home Assistant shows for the entity, like 21.5 or on.",entityAttribute:"One detail the entity carries besides its state, like a light's brightness.",entityAge:"Seconds since the entity's state last changed. Set Seconds as, under Format, to read 5m instead of 300.",aggregate:"Count several entities, or take the sum, average, lowest or highest of their states.",time:"The time or date, read each time the complication refreshes.",dataAge:"Seconds since the watch last fetched values."},Mk=[["straight","Straight"],["smooth","Smooth"],["step","Step"]],Rk=[["flat","Flat"],["fade","Fade"]],eg=[["auto","Auto"],["all","All"]],Hk=[["off","Off"],["light","Light"],["medium","Medium"],["strong","Strong"]],tg=[["bars","Bars"],["line","Line"],["area","Area"]],Ak=[["auto","Auto"],["fixed","Fixed range"]],Lk=[["lowest","Lowest value"],["zero","Zero"]],Ik=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],gc=[["uniform","One colour"],["bands","By value"]];function $s(e){let n=[Sl,"#FFD60A"];if(e.length<2)return n.map((o,s)=>({id:ie(),upTo:(s+1)*33,colorHex:o}));let t=Math.min(...e),a=Math.max(...e)-t,r=o=>Number(o.toFixed(a>=10?0:2));return n.map((o,s)=>({id:ie(),upTo:r(t+a*(s+1)/3),colorHex:o}))}function Cc(e){if(e.length===0)return 0;let n=Math.min(...e),t=Math.max(...e),i=t-n;return Number(((n+t)/2).toFixed(i>=10?0:2))}function _k(e,n){let t=Tn({bands:e}),i=t.at(-1),a=e.length>1?Math.abs(t[1].upTo-t[0].upTo):10;return{id:ie(),upTo:(i?.upTo??0)+(a||10),colorHex:n}}function Em(e,n,t,i){return h`<span class="band-cell">${Sr(e,n,t)}${kr(i)}</span>`}function Nk(e,n){let t=(typeof n=="number"?[n]:n??[]).filter(s=>Number.isFinite(s)),i=[...e,...t];if(i.length===0)return{lo:-1,hi:1};let a=Math.min(...i),r=Math.max(...i),o=r>a?(r-a)*.12:Math.abs(a)/2||1;return{lo:a-o,hi:r+o}}var Dk=.1;function Pk(e,n,t,i=Dk){let a=[...e].sort(($,k)=>$-k),r=$=>Math.max(n,Math.min(t,$)),o=[n,...a.map(r),t],s=t-n||1,l=o.slice(1).map(($,k)=>Math.max(0,$-o[k])/s),d=Math.min(i,1/l.length),c=l.map($=>$<d),u=c.filter(Boolean).length,p=l.reduce(($,k,C)=>$+(c[C]?0:k),0),f=1-u*d,g=l.length-u,b=l.map(($,k)=>c[k]?d:p>0?$/p*f:f/g),y=b.map(($,k)=>b.slice(0,k).reduce((C,M)=>C+M,0));return{shares:b,at:$=>{let k=r($),C=o.length-2;for(let I=0;I<o.length-1;I++)if(k<=o[I+1]){C=I;break}let M=o[C+1]-o[C],D=M>0?(k-o[C])/M:0;return Math.max(0,Math.min(100,(y[C]+D*b[C])*100))}}}function hs(e){return Math.abs(e)>=1e3||Number.isInteger(e)?String(Math.round(e*100)/100):String(Number(e.toPrecision(4)))}function zk(e,n){let t=e.flatMap(f=>f.upTo===void 0?[]:[f.upTo]),{lo:i,hi:a}=Nk(t,n),{shares:r,at:o}=Pk(t,i,a),s=typeof n=="number"&&Number.isFinite(n)?n:void 0,l=typeof n=="object"?n.filter(f=>Number.isFinite(f)):[],d=l.length>0?Math.min(...l):void 0,c=l.length>0?Math.max(...l):void 0,u=-1/0,p=[...t].sort((f,g)=>f-g).flatMap(f=>{let g=o(f);return g-u<12?[]:(u=g,[h`<span style=${`left:${g}%`}>${hs(f)}</span>`])});return h`<div class="band-bar">
    <div class="bb" aria-hidden="true">${e.map((f,g)=>h`<i class=${f.border===void 0?"":"bordered"}
      style=${`flex-grow:${r[g]??0};--f:${f.fill}${f.border===void 0?"":`;--b:${f.border}`}`}></i>`)}</div>
    ${d===void 0||c===void 0?m:h`<span class="span" style=${`left:${o(d)}%;width:${o(c)-o(d)}%`}
      title=${d===c?`Reads ${hs(d)}`:`Reads ${hs(d)} to ${hs(c)}`}></span>`}
    ${s===void 0?m:h`<span class="now" style=${`left:${o(s)}%`} title=${`Now ${s}`}></span>`}
    ${p.length===0?m:h`<div class="ticks" aria-hidden="true">${p}</div>`}
  </div>`}function Cs(e,n,t,i,a){let r=Tn({bands:e.bands}),o=typeof i=="number"&&Number.isFinite(i)?i:void 0,s=o===void 0?void 0:r.find(y=>o<=y.upTo)?.id??"above",l=(y,x)=>$=>{let k=$.bands.find(C=>C.id===y);k&&x(k)},d=e.bandAboveColorHex,c={atDefault:kc(d,be),title:`Back to ${be}`,reset:()=>t(y=>{y.bandAboveColorHex=be})},u=a?.border===!0,p=(y,x,$,k,C)=>{if(!u)return Sr(y,x.colorHex,F=>$(F??"#FFFFFF"));let M=a?.fillHex,D=a?.borderHex,I=x.fillColorHex===void 0?void 0:{atDefault:!1,title:"Back to the chart fill colour",reset:()=>k(void 0)},T=x.borderColorHex===void 0?void 0:{atDefault:!1,title:`Back to ${D===void 0?"white":"the chart border colour"}`,reset:()=>C(void 0)};return h`
      ${Em(`${y} fill`,x.fillColorHex??M??x.colorHex,F=>{F!==void 0&&($(F),k(M===void 0?void 0:F))},I)}
      ${Em(`${y} border`,x.borderColorHex??D??$a,F=>C(F),T)}`},f=(y,x)=>{let $=r[y];return h`<input type="number" class="band-up" step="any" .value=${String($.upTo)} aria-label=${x}
      title=${`Band ${y+1} runs up to and including this number`}
      data-scrub @pointerdown=${$r($.upTo,k=>t(l($.id,C=>{C.upTo=k})),{...y>0?{min:r[y-1].upTo}:{},...y<r.length-1?{max:r[y+1].upTo}:{}})}
      @change=${Ee(k=>{let C=Number(k);k.trim()!==""&&Number.isFinite(C)&&t(l($.id,M=>{M.upTo=C}))})} />`},g=(y,x)=>({...y===void 0?{}:{upTo:y},fill:u?x.fillColorHex??a?.fillHex??x.colorHex:x.colorHex,...u?{border:x.borderColorHex??a?.borderHex??$a}:{}}),b=[...r.map(y=>g(y.upTo,y)),g(void 0,{colorHex:d,...e.bandAboveFillColorHex===void 0?{}:{fillColorHex:e.bandAboveFillColorHex},...e.bandAboveBorderColorHex===void 0?{}:{borderColorHex:e.bandAboveBorderColorHex}})];return h`<div class=${u?"bands split":"bands"}>
    ${zk(b,o??(typeof i=="object"?i:void 0))}
    ${!u||r.length===0?m:h`<div class="band-row band-head" aria-hidden="true">
      <span></span><span>Fill</span><span>Border</span><span></span>
    </div>`}
    ${r.map((y,x)=>h`
      <div class="band-row ${s===y.id?"hit":""}">
        <span class="range">${x===0?h`<span class="le">Less than</span>${f(x,"Less than")}`:h`${f(x-1,"From")}<span class="to">to</span>${f(x,"Up to")}`}</span>
        ${p(`Up to ${y.upTo}`,y,$=>t(l(y.id,k=>{k.colorHex=$}),`bcol${y.id}`),$=>t(l(y.id,k=>{$===void 0?delete k.fillColorHex:k.fillColorHex=$}),`bfill${y.id}`),$=>t(l(y.id,k=>{$===void 0?delete k.borderColorHex:k.borderColorHex=$}),`bborder${y.id}`))}
        <button type="button" class="icon" title="Remove this band" aria-label="Remove this band"
          @click=${()=>t($=>{$.bands=$.bands.filter(k=>k.id!==y.id)})}>${P("close")}</button>
      </div>`)}
    <div class="band-row ${s==="above"?"hit":""}">${kr(c)}
      <span class="range">${r.length===0?h`<span class="else">Every value</span>`:h`<span class="le">Greater than</span>${f(r.length-1,"Greater than")}`}</span>
      ${p("Above the last band",{colorHex:d,...e.bandAboveFillColorHex===void 0?{}:{fillColorHex:e.bandAboveFillColorHex},...e.bandAboveBorderColorHex===void 0?{}:{borderColorHex:e.bandAboveBorderColorHex}},y=>t(x=>{x.bandAboveColorHex=y},"babove"),y=>t(x=>{y===void 0?delete x.bandAboveFillColorHex:x.bandAboveFillColorHex=y},"bafill"),y=>t(x=>{y===void 0?delete x.bandAboveBorderColorHex:x.bandAboveBorderColorHex=y},"baborder"))}
      <span></span>
    </div>
    <button type="button" class="link add-band" @click=${()=>t(y=>{y.bands=[...y.bands,_k(y.bands,n)]})}>+ Band</button>
  </div>`}function Ok(e,n,t,i){let a=new Map,r=new Map,o=(d,c)=>{let u=d.trim();if(u==="")return;let p=u.toLowerCase();r.has(p)||r.set(p,u),a.set(p,(a.get(p)??0)+c)};e.forEach((d,c)=>{let u=e[c+1],p=u===void 0?n:u.offsetSeconds;o(d.state,Math.max(0,p-d.offsetSeconds))}),t!==void 0&&o(t,0),(Oa[i??""]??[]).forEach(d=>o(d,0));let s=["unavailable","unknown"];return[...[...a.entries()].filter(([d])=>!s.includes(d)).sort((d,c)=>c[1]-d[1]).map(([d])=>r.get(d)??d),...s]}function Gk(e,n,t=[],i="wa-timeline-states"){let a=new Set(e.bands.map(o=>o.match.trim().toLowerCase())),r=t.find(o=>!a.has(o.toLowerCase()))??"";return h`
    ${e.bands.map((o,s)=>h`
      <div class="row-inline">
        ${_e("State",o.match,l=>n(d=>{let c=d.bands[s];c&&(c.match=l)},`tmatch${o.id}`),{placeholder:"on",list:i})}
        ${we("Colour",o.colorHex,l=>n(d=>{let c=d.bands[s];c&&(c.colorHex=l??En)},`tcol${o.id}`))}
        <button class="icon" title="Remove this state" aria-label="Remove this state"
          @click=${()=>n(l=>{l.bands=l.bands.filter((d,c)=>c!==s)})}>${P("close")}</button>
      </div>`)}
    <datalist id=${i}>${t.map(o=>h`<option value=${o}></option>`)}</datalist>
    <button class="small" @click=${()=>n(o=>{o.bands=[...o.bands,{id:ie(),match:r,colorHex:wt(r)}]})}>${r===""?"Add state":`Add ${r}`}</button>
    ${we("Otherwise",e.otherColorHex,o=>n(s=>{s.otherColorHex=o??En},"tother"),!1,En)}`}var Fm=2,Bk=[["arc","Arc"],["ring","Ring"],["bar","Bar"],["dots","Dots"],["needle","Needle"]],Vk={arc:"A 270\xB0 arc, open at the bottom",ring:"A full circle",bar:"A straight bar",dots:"One dot per unit, the first few filled",needle:"A dial with a pointer at the reading"};function Mm(e){let n=e.value.kind;if(n.kind==="aggregate"){let{stateFilter:t,...i}=n.aggregate;return{kind:{kind:"aggregate",aggregate:{...i,function:"count"}}}}return U(String(Math.max(1,Math.round(e.maxValue-e.minValue))))}var Uk=[["now","Time (14:05)"],["hour","Hour"],["minute","Minute"],["weekday","Day of the week (0 is Monday)"],["day","Day of the month"],["month","Month number"],["timestamp","Unix timestamp (seconds)"]];function Wk(e,n){let t="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(n){case"literal":return{kind:n,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:n,...t};case"entityAttribute":return{kind:n,...t,attribute:""};case"entityAge":return{kind:n,...t};case"aggregate":return{kind:n,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:n,timeField:"now"};case"dataAge":return{kind:n};case"jinja":return{kind:n,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:n,id:""};case"chartStat":return{kind:n,layer:"",stat:"latest"}}}function pe(e,n,t,i){if(i.inline||!Kk())return h`<div class="value-editor">${rg(e,n,t,i)}</div>`;let a=Hs(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(n):void 0,s=Ie(n,ve(e)),l="entityId"in n.kind;return h`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact||i.noLabel?m:h`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${s}. Click to change it.`}>
      <span class="chip-text ${l?"ent-tok":""}">${s}</span>
      ${o===void 0?m:h`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${ng(e,a,r,n,t,i)}
  </div>`}function ng(e,n,t,i,a,r){return h`<div class="value-pop" id=${n} popover role="dialog" aria-label=${t} @toggle=${ag}>
    <div class="pop-head">
      <b>${t}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${n} popovertargetaction="hide">Done</button>
    </div>
    ${gr.has(n)?rg(e,i,a,r):m}
  </div>`}function ve(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function Hs(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function Kk(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var gr=new Set,cr=new WeakMap;function jk(e){let n=e.getRootNode();return(n instanceof ShadowRoot||n instanceof Document?n:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function ig(e,n,t=!1){let i=e instanceof Node?e:null;if(!i)return;let a=i.getRootNode();!(a instanceof ShadowRoot)&&!(a instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let r=a.querySelector(`#${CSS.escape(n)}`);r&&typeof r.showPopover=="function"&&!r.matches(":popover-open")&&r.showPopover(),r&&t&&requestAnimationFrame(()=>requestAnimationFrame(()=>{r.querySelector("textarea, input[type=text], input[type=search], input:not([type])")?.focus()}))}))}function ag(e){let n=e.currentTarget,t=e.newState==="open",i=cr.get(n);if(i&&(i(),cr.delete(n)),!t){gr.delete(n.id)&&Te(n);return}let a=jk(n);if(!a)return;let r=()=>{if(!n.isConnected||!n.matches(":popover-open")){cr.get(n)?.(),cr.delete(n);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){n.hidePopover();return}dc(n,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),cr.set(n,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),dc(n,a.getBoundingClientRect()),gr.has(n.id)||(gr.add(n.id),Te(n),requestAnimationFrame(()=>{n.isConnected&&dc(n,a.getBoundingClientRect())}))}function dc(e,n){e.style.maxHeight="";let t=e.getBoundingClientRect(),i=qk({left:n.left,top:n.top,bottom:n.bottom,width:n.width},{width:t.width,height:t.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var Ci=8,fs=6,Rm=140;function qk(e,n,t){let i=t.height-e.bottom-fs-Ci,a=e.top-fs-Ci,r=n.height>i&&a>i&&i<Rm,o=Math.max(Rm,r?a:i),s=Math.min(n.height,o),l=Math.max(Ci,Math.min(e.left,t.width-n.width-Ci)),d=r?Math.max(Ci,e.top-fs-s):Math.max(Ci,Math.min(e.bottom+fs,t.height-s-Ci));return{left:l,top:d,maxHeight:o,above:r}}function rg(e,n,t,i){let a=n.kind,r=c=>t({...n,kind:c}),o=i.key,s=Ek.filter(([c])=>i.allowNamed!==!1||c!=="named"),l=m;switch(a.kind){case"literal":l=i.symbol?Qm(e,a.value,c=>r({...a,value:c}),o,i.setSymbolPath):_e("Text",a.value,c=>r({...a,value:c}));break;case"entityState":case"entityAge":l=Ut(e,"Entity",a,c=>r({...a,...c}),`${o}-entity`);break;case"entityAttribute":{let c=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),u=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;l=h`${Ut(e,"Entity",a,p=>r({...a,...p}),`${o}-entity`)}
        ${_e("Attribute",a.attribute,p=>r({...a,attribute:p}),{list:u,mono:!0})}
        <datalist id=${u}>${c.map(p=>h`<option value=${p}></option>`)}</datalist>`;break}case"aggregate":l=n$(e,a.aggregate,c=>r({...a,aggregate:c}),o);break;case"time":l=He("Field",a.timeField,Uk,c=>r({...a,timeField:c}));break;case"dataAge":break;case"jinja":l=h`${Ym("Template",a.value,c=>r({...a,value:c}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":{let c=e.config.values.find(p=>p.id===a.id),u=c?Va(e.config,c.id):0;l=e.config.values.length===0?h`<div class="hint keep">No shared values yet.
            <button type="button" class="link" @click=${()=>e$(e,n,t)}>Start an empty one</button>,
            or choose another source and click Make shared.</div>`:h`${He("Value",a.id,[["","(choose)"],...e.config.values.map(p=>[p.id,p.name||p.id.slice(0,8)])],p=>r({...a,id:p}))}
          ${c?h`<div class="hint keep">Read by ${u} ${u===1?"layer":"layers"}.
            <button type="button" class="link" @click=${()=>e.selectValue(c.id)}>Edit it</button> to change them all, or
            <button type="button" class="link" @click=${()=>{let p=ed(e.config,n);p&&t(p)}}>stop sharing</button>
            to give this one its own copy.</div>`:m}`;break}case"chartStat":{let c=ve(e),u=e.config.elements.filter(p=>p.kind==="chart");l=u.length===0?h`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:h`
          ${He("Chart",a.layer,[["","(choose)"],...u.map(p=>[p.payload.id,Ae(p,c)])],p=>r({...a,layer:p}))}
          ${He("Number",a.stat,[...Rt],p=>r({...a,stat:p}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Add unit to print the entity's unit after it."}</div>`;break}}let d=Fk[a.kind];return h`
    ${He("Source",a.kind,s,c=>r(Wk(a,c)))}
    ${d?h`<div class="hint">${d}</div>`:m}
    ${l}
    ${Zk(n,i)?h`<div class="hint keep">
      <button type="button" class="link" title="Move this into a shared value that other layers can read too" @click=${()=>Qk(e,n,t)}>Make shared</button>
      so other layers can read this too.</div>`:m}
    ${i.noFormat?m:t$(n.format,c=>t(Ve(c)?{kind:n.kind}:{...n,format:c}),Xk(Yk(e,n)))}
    ${i.showResolved?Jk(e,n,e.resolve(i.resolveAs??n)):m}`}function Yk(e,n){let t=n.kind;for(let i=0;t.kind==="named"&&i<8;i++){let a=t.id.toUpperCase(),r=e.config.values.find(o=>o.id.toUpperCase()===a);if(!r)return;t=r.value.kind}return t.kind==="named"?void 0:t}function Xk(e){if(!e)return{numbers:!0,textCase:!0,unit:!0,seconds:!0};switch(e.kind){case"literal":{let n=tt(e.value)!==void 0;return{numbers:n,textCase:!n,unit:!1,seconds:n}}case"entityState":case"entityAttribute":case"jinja":case"named":return{numbers:!0,textCase:!0,unit:e.kind!=="jinja"&&e.kind!=="named",seconds:!0};case"entityAge":case"dataAge":return{numbers:!0,textCase:!1,unit:!1,seconds:!0};case"aggregate":return{numbers:!0,textCase:!1,unit:!1,seconds:!1};case"chartStat":{let n=e.stat==="trend";return{numbers:!n,textCase:!1,unit:!n,seconds:!1}}case"time":return{numbers:e.timeField!=="now",textCase:!1,unit:!1,seconds:!1}}}function Jk(e,n,t){let i=t===void 0?h`<span class="readout-v now-v none">${og(e,n)}</span>`:t.trim()===""?h`<span class="readout-v now-v none">Empty</span>`:h`<span class="readout-v now-v"><span class="now-tok">${t}</span></span>`;return h`<div class="field readout now-field"><span>Now</span>${i}</div>`}function og(e,n){let t=n.kind;switch(t.kind){case"entityState":case"entityAttribute":case"entityAge":return t.entityId===""?"Pick an entity":e.hass.states[t.entityId]?t.kind==="entityAttribute"&&t.attribute.trim()===""?"Pick an attribute":t.kind==="entityState"?"No reading":"Waiting for Home Assistant":"No such entity";case"chartStat":return t.layer===""?"Pick a chart":"The chart has no readings yet";case"named":{if(t.id==="")return"Pick a shared value";let i=t.id.toUpperCase(),a=e.config.values.find(r=>r.id.toUpperCase()===i);return a?og(e,a.value):"That shared value is gone"}case"jinja":return t.value.trim()===""?"Type a template":"Waiting for Home Assistant";default:return"Waiting for Home Assistant"}}function Zk(e,n){if(n.allowNamed===!1||n.noShare)return!1;let t=e.kind;return t.kind==="named"?!1:t.kind==="literal"||t.kind==="jinja"?t.value.trim()!=="":"entityId"in t?t.entityId!=="":t.kind==="chartStat"?t.layer!=="":!0}function Qk(e,n,t){let i=Tr(n,ve(e)).replace(/^"(.*)"$/,"$1"),{named:a,ref:r}=Ql(e.config,n,Ye(i,24));e.beginGesture(),e.update(o=>{o.values.push(a)}),t(r),e.endGesture()}function e$(e,n,t){let{named:i,ref:a}=Ql(e.config,{...n,kind:{kind:"literal",value:""}},"");i.name="",e.beginGesture(),e.update(r=>{r.values.push(i)}),t(a),e.endGesture(),e.selectValue(i.id)}function t$(e,n,t){let i=e??{},a=s=>{let l={...i,...s};for(let d of Object.keys(l))(l[d]===void 0||l[d]===!1||l[d]==="")&&delete l[d];n(l)},r=Ve(e),o={decimals:t.numbers||i.decimals!==void 0,multiply:t.numbers||i.multiply!==void 0,offset:t.numbers||i.offset!==void 0,textCase:t.textCase||i.textCase!==void 0,unit:t.unit||!!i.useEntityUnit,seconds:t.seconds||!!i.relativeTime||!!i.duration};return h`<details class="sub format" ?open=${!r}>
    <summary>Format${r?h`<span class="sum-note">as it comes</span>`:h`<span class="sum-note">${Eg(e).replace(/^ \((.*)\)$/,"$1")}</span>`}</summary>
    <div class="grid2">
      ${o.decimals?ee("Decimals",i.decimals,s=>a({decimals:s}),{step:1,min:0,max:6,optional:!0,placeholder:"as is"}):m}
      ${o.multiply?ee("Multiply",i.multiply,s=>a({multiply:s}),{optional:!0,placeholder:"1"}):m}
      ${o.offset?ee("Plus",i.offset,s=>a({offset:s}),{optional:!0,placeholder:"0"}):m}
      ${o.textCase?ae("Case",i.textCase??"",[["","As is"],["upper","ABC"],["lower","abc"],["capitalized","Abc"]],s=>a({textCase:s||void 0}),{titles:{"":"Leave the letters as they are",upper:"UPPER CASE",lower:"lower case",capitalized:"Capital First Letters"}}):m}
      ${_e("Before",i.prefix??"",s=>a({prefix:s}),{placeholder:"text in front"})}
      ${_e("After",i.suffix??"",s=>a({suffix:s}),{placeholder:"text after"})}
    </div>
    ${o.unit?Re("Add unit",!!i.useEntityUnit,s=>a({useEntityUnit:s})):m}
    ${o.seconds?ae("Seconds as",i.duration?"duration":i.relativeTime?"relativeTime":"",[["","Number"],["relativeTime","Short"],["duration","Duration"]],s=>a({relativeTime:s==="relativeTime",duration:s==="duration"}),{titles:{"":"300",relativeTime:"One unit: 45s, 5m, 3h",duration:"Two units: 1h 23m, 5m 0s"}}):m}
  </details>`}function n$(e,n,t,i){let a=s=>s.join(", "),r=s=>s.split(",").map(l=>l.trim()).filter(Boolean),o=n.scope;return h`
    ${He("Function",n.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],s=>t({...n,function:s}))}
    ${ae("Over",o.kind,[["filter","Entities matching a filter"],["entities","A fixed list"]],s=>t({...n,scope:s==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}}))}
    ${o.kind==="filter"?h`<div class="grid2">
          ${_e("Domains",a(o.domains),s=>t({...n,scope:{...o,domains:r(s)}}),{placeholder:"light, switch"})}
          ${_e("Area ids",a(o.areaIds),s=>t({...n,scope:{...o,areaIds:r(s)}}))}
          ${_e("Label ids",a(o.labelIds),s=>t({...n,scope:{...o,labelIds:r(s)}}))}
          ${_e("Floor ids",a(o.floorIds),s=>t({...n,scope:{...o,floorIds:r(s)}}))}
        </div>`:h`${o.entities.map((s,l)=>h`<div class="row-inline">
            ${Ut(e,`Entity ${l+1}`,s,d=>{let c=[...o.entities];c[l]=d,t({...n,scope:{...o,entities:c}})},`${i}-agg-${l}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>t({...n,scope:{...o,entities:o.entities.filter((d,c)=>c!==l)}})}>${P("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>t({...n,scope:{...o,entities:[...o.entities,{entityId:"",displayName:"",domain:""}]}})}>Add entity</button>`}
    ${He("Only count when",n.stateFilter?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],s=>{let l={...n};s===""?delete l.stateFilter:s==="equals"||s==="notEquals"?l.stateFilter={kind:s,value:n.stateFilter&&"value"in n.stateFilter?n.stateFilter.value:""}:l.stateFilter={kind:s},t(l)})}
    ${n.stateFilter&&"value"in n.stateFilter?_e("State",n.stateFilter.value,s=>t({...n,stateFilter:{kind:n.stateFilter.kind,value:s}})):m}
    ${n.function==="count"?m:_e("Attribute (blank = state)",n.attribute??"",s=>{let l={...n};s?l.attribute=s:delete l.attribute,t(l)})}`}var sg=Pl,i$=sg.filter(([e])=>e!=="none");function a$(e){if("entityId"in e)return{entityId:e.entityId,displayName:e.displayName,domain:e.domain};if(e.type==="callService")return e.target}function lg(e,n){let t=a$(n)??{entityId:"",displayName:"",domain:""};if(e==="callService"){let i=n.type==="callService"?{...n}:{type:"callService",serviceDomain:"",serviceName:""};return t.entityId!==""&&(i.target=t),i}return ap(e)?{type:e,...t}:{type:e}}var r$=[["Open a cover","cover","open_cover",""],["Close a cover","cover","close_cover",""],["Stop a cover","cover","stop_cover",""],["Lock","lock","lock",""],["Unlock","lock","unlock",""],["Light brightness","light","turn_on",'{"brightness_pct": 50}'],["Climate target","climate","set_temperature",'{"temperature": 21}'],["Play / pause","media_player","media_play_pause",""],["Start a vacuum","vacuum","start",""],["Send a vacuum home","vacuum","return_to_base",""]];function dg(e,n,t,i){let a=n.serviceDataJSON??"",r=rp(a),o=n.target??{entityId:"",displayName:"",domain:""};return h`
    <div class="gen-row">
      ${_e("Domain",n.serviceDomain,s=>t({...n,serviceDomain:s.trim()},"svc-domain"),{placeholder:"light"})}
      ${_e("Service",n.serviceName,s=>t({...n,serviceName:s.trim()},"svc-name"),{placeholder:"turn_on"})}
    </div>
    <div class="chips">
      ${r$.map(([s,l,d,c])=>h`
        <button class="small" title=${`Fill in ${l}.${d}`}
          @click=${()=>{let u={...n,serviceDomain:l,serviceName:d};c===""?delete u.serviceDataJSON:u.serviceDataJSON=c,t(u)}}>${s}</button>`)}
    </div>
    ${Ut(e,"Target entity (optional)",o,s=>{let l={...n};s.entityId===""?delete l.target:l.target=s,t(l,"svc-entity")},`${i}-svc-entity`)}
    ${Ym("Data (JSON)",a,s=>{let l={...n};s.trim()===""?delete l.serviceDataJSON:l.serviceDataJSON=s,t(l,"svc-data")},3)}
    ${r?h`<div class="hint">Leave the data empty for a service that needs nothing else. Anything here must be a JSON object, like <code>{"brightness_pct": 50}</code>. Templates are not run.</div>`:h`<div class="hint warn">That is not a JSON object, so the watch will refuse the tap. It has to look like <code>{"brightness_pct": 50}</code>.</div>`}`}function o$(e,n){return e!==void 0&&n.trim()!==""&&n.trim()!==e.trim()}function cg(e){let n=e.config,t=n.tapAction,i=o$(e.savedName,n.name),a=n.refreshMinutes??0,r=Hm.map(s=>[String(s),Am(s)]);Hm.includes(a)||r.push([String(a),Am(a)]);let o=n.showSuccessFlash??!0;return h`
    <div class="gen-row">
      ${_e("Name",n.name,s=>e.update(l=>{l.name=s},"name"))}
      ${He("Refresh",String(a),r,s=>e.update(l=>{l.refreshMinutes=Number(s)||0},"refresh"))}
      ${He("Tap action",t.type,sg,s=>e.update(l=>{l.tapAction=lg(s,l.tapAction),s!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
      <div class="field flash-cell"><span title="Flash when a tap works">Flash</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${o} title="Flash when a tap works"
            @change=${s=>e.update(l=>{l.showSuccessFlash=s.target.checked})} />
          ${o?h`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(n.successFlashColorHex??s$).slice(0,7)}
                @input=${Ee(s=>e.update(l=>{l.successFlashColorHex=s.toUpperCase()},"flash"))} />`:h`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${i?h`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:m}
    ${"entityId"in t?Ut(e,"Target",t,s=>e.update(l=>{l.tapAction={type:t.type,...s}},"tap-entity"),"general-tap"):m}
    ${t.type==="callService"?dg(e,t,(s,l)=>e.update(d=>{d.tapAction=s},l),"general-tap"):m}
    ${t.type==="openPage"?l$(e):m}`}var s$="#808080",Hm=[0,15,30,60,120];function Am(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function l$(e){let n=e.config;return ug(e,n.openPageId,n.openPageName,(t,i)=>e.update(a=>{if(t===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=t,i?a.openPageName=i:delete a.openPageName}))}function ug(e,n,t,i){let a=n??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${t||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?h`<div class="hint keep">No pages reported yet. Open the watch app once so it can send its page list.</div>`:h`${He("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(s=>s.id===o)?.name)})}
  ${a?m:h`<div class="hint keep">Without a page the tap falls back to the complication list.</div>`}`}function pg(e,n){let t=e.config.values.findIndex(o=>o.id===n.id),i=`nv-${n.id}`,a=Va(e.config,n.id),r={kind:{kind:"named",id:n.id}};return h`
    ${_e("Name",n.name,o=>e.update(s=>{s.values[t].name=o},`${i}-name`),{placeholder:"Name it, like Outside temp"})}
    ${pe(e,n.value,o=>e.update(s=>{s.values[t].value=o},i),{allowNamed:!1,showResolved:!0,resolveAs:r,inline:!0,key:i})}
    <div class="field readout"><span>Used by</span><span class="readout-v">${a===0?"No layers yet":`${a} ${a===1?"layer":"layers"}`}</span></div>`}function hg(){return{id:ie(),name:"",value:U("")}}function Oe(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:t.payload.frame,isHidden:t.payload.isHidden,fromPlacement:!1}}function Fe(e,n,t,i,a=!1){let r=e.elements.find(c=>c.payload.id===t);if(!r)return;let o=e.perFamily[n];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[n]=o);let s=Oe(e,n,r),d={...o.placements[t]??{frame:{...s.frame},isHidden:s.isHidden,...s.size!==void 0?{size:s.size}:{}},...i};a&&delete d.size,o.placements[t]=d}function Bn(e,n,t,i,a){let r=n.payload.id,o=vo(n)??a.min,s=Oe(e.config,t,n).size??o;return ee(i,s,l=>e.update(d=>Fe(d,t,r,{size:Math.max(a.min,l??o)}),`el-${r}-size-${t}`),{step:a.step,min:a.min,unit:"pt",...a.def===void 0?{}:{def:a.def}})}function fg(e,n,t){let i=e.perFamily[t]??(e.perFamily[t]=ln()),a=gt(e,n).filter(l=>!xe(e,l));if(a.length===0)return;let r=ji(e,a.map(l=>l.payload.id),n),o=ti(e,r,{nudge:!1}),s=e.perFamily[n];for(let l of o){let d=e.elements.find(f=>f.payload.id===l);if(!d)continue;let c=s?.placements[l],u=c?.size??vo(d),p={frame:{...c?.frame??d.payload.frame},isHidden:c?.isHidden??!1,...u!==void 0?{size:u}:{}};for(let f of de)f!==t&&delete e.perFamily[f]?.placements[l];i.placements[l]=ko(p,n,t,d.kind)}qi(e,t)}function As(e,n){return Hp(e,n)}function d$(e){return e.length===0?"none":e.every(n=>n)?"all":e.every(n=>!n)?"none":"mixed"}function Ei(e){return e.kind==="image"||e.kind==="tap"||e.kind==="timeline"||e.kind==="chartTimes"||e.kind==="chartDots"||e.kind==="chartGrid"||e.kind==="imageTime"?void 0:e.payload.colorSlot.baseColorHex}function mg(e,n,t){let i=d$(t.map(l=>Oe(e,n,l).isHidden)),a=t.map(Ei),r=t.length>0&&a.every(l=>l!==void 0),o=a[0],s=r&&o!==void 0&&a.every(l=>l!==void 0&&l.toUpperCase()===o.toUpperCase());return{hiddenHere:i,colourable:r,colour:s?o:void 0}}var ra=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]],c$=[["leading","Left"],["center","Center"],["trailing","Right"]],br=[["default","System"],["rounded","Rounded"],["monospaced","Mono"],["serif","Serif"]],xr=[["standard","Standard"],["condensed","Condensed"],["compressed","Compressed"],["expanded","Expanded"]],Sc=h`<div class="hint">The watch draws the system face's own narrow and wide cuts.
  The preview stretches the letters instead, so judge the shapes on the watch, not here.</div>`,u$=[["off","Upright"],["on","Italic"]],Tc=h`<div class="hint">The watch draws SF Rounded and New York.
  The preview has no web copy of either, so it shows the closest match: judge the shapes on the watch, not here.</div>`,p$=[["1","1"],["2","2"],["3","3"],["4","4"]];function gg(e,n){let t=e.hass.states[n]?.attributes?.device_class;return typeof t=="string"?t:void 0}function yg(e,n,t){let i=n.payload.id,a=To(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=n.kind==="image"&&n.payload.source==="camera",s={...o?{domain:"camera"}:{},needed:Lm(n)};return h`
    ${Ut(e,o?"Camera":"Entity",r,l=>e.update(d=>Ap(d,i,l,gg(e,l.entityId)),`${t}-entity`),`${t}-layer-entity`,s)}
    <div class="hint ${Lm(n)?"warn":""}">${f$(n,a)}</div>`}function Lm(e){return e.kind==="timeline"?e.payload.value.kind.kind!=="entityState":e.kind==="chart"?e.payload.historyMinutes>0&&e.payload.value.kind.kind!=="entityState":e.kind==="image"?e.payload.entity.entityId==="":!1}function h$(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function Ls(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function f$(e,n){let t=h$(e),i=t?.kind.kind,r=t!==void 0&&!("entityId"in t.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline"))?i==="named"?" Its content comes through a shared value, so change that shared value to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(n.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],s=n.find(d=>d.where==="value"||d.where==="symbol"||d.where==="camera");s&&o.push(s.where==="symbol"?"the symbol":s.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":e.kind==="timeline"?"the states":"the text"),n.some(d=>d.where==="tap")&&o.push("the tap");let l=n.filter(d=>d.where==="test").length;return l>0&&o.push(l===1?"1 state test":`${l} state tests`),`Used by ${Ls(o)}.${r}`}function m$(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function wr(e,n){if(e===n)return!0;if(typeof e!=typeof n||e===null||n===null||typeof e!="object"||Array.isArray(e)!==Array.isArray(n))return!1;if(Array.isArray(e))return e.length===n.length&&e.every((a,r)=>wr(a,n[r]));let t=Object.keys(e).filter(a=>e[a]!==void 0),i=Object.keys(n).filter(a=>n[a]!==void 0);return t.length!==i.length?!1:t.every(a=>wr(e[a],n[a]))}function cc(e,n,t){return t.some(i=>!wr(e[i],n[i]))}function ms(e,n,t){let i=e,a=n;for(let r of t)a[r]===void 0?delete i[r]:i[r]=structuredClone(a[r])}function Me(e,n,t,i,a={}){let r=a.alwaysOpen===!0,o=r||e.openSections.has(n),s=e.helpSections.has(n),l=()=>e.toggleSection(n),d=()=>{!s&&!o&&e.toggleSection(n),e.toggleHelp(n)},c=s?`Hide the help in ${t}`:`Show help for ${t}`,u=h`<span class="swatch">${P(a.icon??"content")}</span>
      <span class="tt"><h4>${t}${kr(a.reset===void 0?void 0:{atDefault:!1,title:a.resetTitle??`Put ${t} back to its defaults`,reset:a.reset})}</h4>${a.summary?h`<span class="sum">${a.summary}</span>`:m}</span>
      <button type="button" class="sec-help ${s?"on":""}" aria-pressed=${s?"true":"false"} title=${c} aria-label=${c}
        @click=${p=>{p.stopPropagation(),d()}}>?</button>`;return h`<section class="sec" data-open=${o?"true":"false"} data-help=${s?"on":"off"} style=${a.color?`--c:${a.color}`:""}>
    ${r?h`<div class="sec-h pinned">${u}</div>`:h`<div class="sec-h" role="button" tabindex="0" aria-expanded=${o?"true":"false"} @click=${l}
          @keydown=${p=>{p.target===p.currentTarget&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),l())}}>
          ${u}
          <span class="chev">${P("chevron")}</span>
        </div>`}
    ${o?h`<div class="sec-b">${i}</div>`:m}
  </section>`}function g$(e){if(e.length===0)return"nothing";let n=t=>Number.isInteger(t)?String(t):String(Math.round(t*100)/100);return e.length<=12?e.map(n).join(" "):`${e.slice(0,6).map(n).join(" ")} \u2026 ${e.slice(-3).map(n).join(" ")}`}function y$(e){if(e<60)return`${Math.max(0,Math.round(e))}s`;let n=Math.round(e/60);if(n<90)return`${n}m`;let t=Math.floor(n/60),i=n%60;return i===0?`${t}h`:`${t}h ${i}m`}function b$(e,n){let t=ce[e==="inline"?"rectangular":e],i=n.height*t.height>n.width*t.width,a=Math.round((n.rotationDegrees%180+180)%180)===90;return i!==a}function x$(e,n,t){let i=b$(e,n),a=ce[e==="inline"?"rectangular":e],r=n.height*a.height>n.width*a.width;return h`<div class="grid2">
    ${ae("Direction",i?"vertical":"horizontal",[["horizontal","Horizontal"],["vertical","Vertical"]],o=>{t({rotationDegrees:o==="vertical"===r?0:90},"line-dir")},{titles:{horizontal:"Lying along the frame",vertical:"Standing up, as a divider"}})}
  </div>
  <div class="hint">Direction sets the frame's rotation. A line runs along the frame's long side, so
    for a thin divider make the frame long in one direction and Direction will follow it.</div>`}function w$(e){let n=e.filter(i=>i.state!=="unavailable"&&i.state!=="unknown");return n.length===0?!1:n.filter(i=>i.state.trim()!==""&&Number.isFinite(Number(i.state))).length*2>n.length}function v$(e,n,t=4){if(e.length===0)return"nothing";let i=[];for(let o=0;o<e.length;o++){let s=e[o],l=e[o+1]?.offsetSeconds??n,d=Math.max(0,l-s.offsetSeconds),c=i[i.length-1];c!==void 0&&c.state.trim().toLowerCase()===s.state.trim().toLowerCase()?c.seconds+=d:i.push({state:s.state,seconds:d})}let a=i.slice(-t),r=a.map(o=>`${o.state||"(blank)"} ${y$(o.seconds)}`).join(", ");return i.length>a.length?`\u2026 ${r}`:r}function Fi(e,n=oi){let t=n.find(s=>s.minutes===e);if(t)return t.label;let i=Math.floor(e/1440),a=Math.floor(e%1440/60),r=e%60,o=[];return i>0&&o.push(`${i}d`),a>0&&o.push(`${a}h`),(r>0||o.length===0)&&o.push(`${r}m`),`Last ${o.join(" ")}`}function k$(e,n,t){if(!e||n===void 0||!n.averaged)return;let i=t.replace(/^Last\s+/,""),a=/^\d/.test(i)?`all ${i}`:`the whole ${i}`;return`This span has ${n.readings} readings, more than ${rn}, so they are averaged into ${rn} even slots to cover ${a}.`}var ks=new Set;function yc(e,n,t=oi){return ks.has(e)||!t.some(i=>i.minutes===n)}function uc(e,n,t,i,a=oi){let r=yc(e,n,a);return h`<label class="field">${Ne("Span",{atDefault:n===t&&!r,title:`Back to ${Fi(t,a)}`,reset:()=>{ks.delete(e),i(t)}})}
      <select @change=${o=>{let s=o.target.value;s==="custom"?(ks.add(e),Te(o.target)):(ks.delete(e),i(Number(s)||ho))}}>
        ${a.map(({minutes:o,label:s})=>h`<option value=${String(o)} ?selected=${!r&&o===n}>${s}</option>`)}
        <option value="custom" ?selected=${r}>Custom…</option>
      </select></label>`}function pc(e,n,t=!1){let i=t?Fl:fo,a=Math.floor(i/1440),r=t?Pa:oi,o=Math.floor(e/1440),s=Math.floor(e%1440/60),l=e%60,d=(c,u,p)=>n(Math.min(i,Math.max(1,Math.round(c)*1440+Math.round(u)*60+Math.round(p))));return h`<div class="grid3 span-parts">
      ${ee("Days",o,c=>d(c??0,s,l),{step:1,min:0,max:a})}
      ${ee("Hours",s,c=>d(o,c??0,l),{step:1,min:0,max:23})}
      ${ee("Minutes",l,c=>d(o,s,c??0),{step:1,min:0,max:59})}
    </div>
    <div class="hint">${t?h`${Fi(e,r)}, up to 366 days. Statistics rows are never
          purged, so the limit is about what fits on a complication rather than about what
          the recorder still holds.`:h`${Fi(e,r)}, up to 7 days: the recorder keeps
          ten by default, and a longer span would quietly come back short.`}</div>`}function $$(e){if(e.historyMinutes<=0)return"";if(e.source!=="statistics")return` \xB7 ${Fi(e.historyMinutes)}`;let n=Jr.find(([t])=>t===e.statPeriod)?.[1]??e.statPeriod;return` \xB7 ${Fi(e.historyMinutes,Pa)} \xB7 per ${n.toLowerCase()}`}function Ec(e,n){let t=ve(e);switch(n.kind){case"text":{let i=n.payload.parts?.length??0;return vt(n.payload)?`Rich text, ${i} part${i===1?"":"s"}`:Ye(Ie(n.payload.value,t),48)}case"icon":return Ye(Ie(n.payload.symbol,t),48);case"gauge":return Ye(Ie(n.payload.value,t),48);case"chart":return Ye(`${Ie(n.payload.value,t)}${$$(n.payload)}`,48);case"timeline":return Ye(`${Ie(n.payload.value,t)} \xB7 ${Fi(kt(n.payload))}`,48);case"shape":return n.payload.kind==="roundedRectangle"?"Rounded rectangle":n.payload.kind;case"image":return n.payload.entity.displayName||n.payload.entity.entityId||(n.payload.source==="camera"?"No camera yet":"No entity yet");case"tap":return on(n.payload.action);case"chartTimes":{let i=e.config.elements.find(a=>a.payload.id===n.payload.chart);return i?.kind==="chart"||i?.kind==="timeline"?Ye(`Times of ${Ie(i.payload.value,t)}`,48):"No chart or timeline"}case"imageTime":{let i=e.config.elements.find(a=>a.payload.id===n.payload.image);return i?.kind==="image"?Ye(`Time of ${Ae(i,t)}`,48):"No picture"}case"chartDots":case"chartGrid":{let i=e.config.elements.find(r=>r.payload.id===n.payload.chart),a=n.kind==="chartDots"?"Dots on":"Grid behind";return i?.kind==="chart"?Ye(`${a} ${Ie(i.payload.value,t)}`,48):"No chart"}}}function Ss(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${Be(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${Be(e.payload.colorSlot.baseColorHex)}`;case"gauge":{let n=e.payload,t=n.style==="dots"?`${n.bands.length>0&&n.coloring==="bands"?"banded":Be(n.colorSlot.baseColorHex)} dots`:`${n.lineWidth} pt line \xB7 ${n.coloring==="bands"&&n.bands.length>0?`${n.bands.length+1} colour bands`:Be(n.colorSlot.baseColorHex)}`;return`${n.style} \xB7 ${t}${n.thresholdValue===void 0?"":` \xB7 threshold ${n.thresholdValue}`}`}case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}`;case"timeline":{let n=e.payload;return`${n.bands.length===0?`one colour (${Be(n.otherColorHex)})`:`${n.bands.length} ${n.bands.length===1?"state":"states"} coloured`}${n.gap>0?` \xB7 ${n.gap} pt gap`:""} \xB7 corners ${n.cornerRadius} pt`}case"shape":return e.payload.kind==="line"?`${Be(e.payload.colorSlot.baseColorHex)} \xB7 ${e.payload.thickness} pt thick`:`${Be(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return;case"chartTimes":return`${e.payload.timeLabelCount<=0?"no":e.payload.timeLabelCount} times \xB7 ${e.payload.labelSize} pt \xB7 ${Be(e.payload.labelColorHex)}`;case"imageTime":return;case"chartDots":{let n=e.payload;return`${n.dots==="all"?"all":"auto"} \xB7 ${n.size===void 0?"automatic size":`${n.size} pt`} \xB7 ${n.colorHex===void 0?"series colour":Be(n.colorHex)}`}case"chartGrid":{let n=e.payload;return`${n.lines} ${n.lines===1?"line":"lines"} \xB7 ${n.thickness} pt \xB7 ${Be(n.colorHex)}`}}}function ur(e,n,t,i,a,r){let o=Math.round(t*1e3)/10,s=l=>i(l/100);return h`<label class="pf">
    <span class="pl" title=${`${n}. Drag left or right to change it.`}
      @pointerdown=${Ms(o,s,{step:.5,min:a,max:r})}>${e}</span>
    <input type="number" step="0.5" min=${a} max=${r} .value=${String(o)} aria-label=${`${n} in percent`}
      data-scrub @pointerdown=${$r(o,s,{step:.5,min:a,max:r})}
      @input=${Ee(l=>{let d=Number(l);l.trim()!==""&&Number.isFinite(d)&&s(d)})} />
    <span class="unit" aria-hidden="true">%</span>
  </label>`}function C$(e,n,t){let i=n.payload.id,a=`el-${i}`,r=Oe(e.config,t,n),o=r.frame,s=(c,u)=>e.update(p=>Fe(p,t,i,{frame:Lo(o,c)}),`${a}-${u}-${t}`),l=!wr(o,Fa)||r.isHidden,d=n.payload.chartAnchor;if(n.kind==="chartDots"||n.kind==="chartGrid"){let c=e.config.elements.find(u=>u.payload.id===n.payload.chart);return Me(e,"placement","Position",h`
      <div class="hint keep">${n.kind==="chartDots"?"Dots sit":"Grid lines sit"} on their chart, so they move,
        size and turn with it. To change where they are, change the chart.</div>
      ${c?h`<div class="field list-field"><span>Chart</span>
        <div class="chips"><button class="small" @click=${()=>e.selectLayer(c.payload.id)}>Select the chart</button></div>
      </div>`:m}
      ${Re("Hidden",r.isHidden,u=>e.update(p=>Fe(p,t,i,{isHidden:u})),!1)}`,{color:oe.position,icon:"place",summary:`On the chart \xB7 ${te(t)}`})}return d?.place==="through"?Me(e,"placement","Position",h`
      <div class="hint keep">A line sits on its chart at the reading it follows, and runs the whole plot. To
        change where it is, change the reading below or the chart. Thickness and colour are in Look.</div>
      ${Nm(e,n,t)}
      ${o.rotationDegrees!==0?Vt("Rotation",o.rotationDegrees,c=>s({rotationDegrees:c},"rot"),{min:-180,max:180,step:1,def:0,format:c=>`${Math.round(c)}\xB0`,unit:"\xB0",range:!1}):m}
      ${Re("Hidden",r.isHidden,c=>e.update(u=>Fe(u,t,i,{isHidden:c})),!1)}`,{color:oe.position,icon:"place",summary:`On the chart \xB7 ${te(t)}`}):Me(e,"placement","Position",h`
    ${Nm(e,n,t)}
    ${d===void 0?h`
    <div class="fgroup">
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${ur("X","Left",o.x,c=>s({x:c},"x"),-100,100)}
        ${ur("Y","Top",o.y,c=>s({y:c},"y"),-100,100)}
      </div>
    </div>
    ${_m(e,n,t,o,["across","down","both"])}
    </div>`:Qt(d.at)?m:h`
    <div class="fgroup">
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${ur("X","Left",o.x,c=>s({x:c},"x"),-100,100)}
      </div>
    </div>
    ${_m(e,n,t,o,["across"])}
    </div>`}
    <div class="field xy-field"><span>Size</span>
      <div class="xy">
        ${ur("W","Width",o.width,c=>s({width:c},"w"),4,200)}
        ${ur("H","Height",o.height,c=>s({height:c},"h"),4,200)}
      </div>
    </div>
    ${Vt("Rotation",o.rotationDegrees,c=>s({rotationDegrees:c},"rot"),{min:-180,max:180,step:1,def:0,format:c=>`${Math.round(c)}\xB0`,unit:"\xB0",range:!1})}
    ${Re("Hidden",r.isHidden,c=>e.update(u=>Fe(u,t,i,{isHidden:c})),!1)}
    <div class="hint">${d===void 0?"X, Y, W and H are":"W and H are"} a percent of the face, on the ${te(t)} shape only. Drag a letter left or right to change its number. Arrow keys nudge 1 pt, shift for 10.${d===void 0?" Copy position and Paste position repeat a spot on another layer, on any shape.":""}</div>`,{color:oe.position,icon:"place",summary:`${Math.round(o.width*100)}% wide \xB7 ${te(t)}`,...l?{resetTitle:`Put this layer back to the middle of the ${te(t)} face at half size, unrotated and shown`,reset:()=>e.update(c=>Fe(c,t,i,{frame:{...Fa},isHidden:!1}))}:{}})}var Im={across:{label:"Center across",title:"Move this layer to the middle of the face, left to right"},down:{label:"Center up and down",title:"Move this layer to the middle of the face, top to bottom"},both:{label:"Center",title:"Move this layer to the middle of the face"}};function _m(e,n,t,i,a){let r=n.payload.id,o=(c,u)=>e.update(p=>Fe(p,t,r,{frame:c}),`el-${r}-${u}-${t}`),s=e.copiedPosition,l=n.payload.chartAnchor!==void 0,d=s!==void 0&&s.family===t&&wr(s.frame,i);return h`<div class="field list-field"><span>Line up</span>
    <div class="chips">
      ${a.map(c=>h`<button class="small" title=${Im[c].title}
        ?disabled=${$h(i,c)}
        @click=${()=>o(xd(i,c),`center-${c}`)}>${Im[c].label}</button>`)}
    </div>
  </div>
  ${l?m:h`<div class="field list-field"><span>Copy</span>
    <div class="chips">
      <button class="small" title="Copy this layer's X, Y, W, H and rotation, to paste onto another layer"
        @click=${()=>e.copyPosition({frame:{...i},family:t})}>${d?"Copied":"Copy position"}</button>
      <button class="small" ?disabled=${s===void 0||d}
        title=${s===void 0?"Copy a position from a layer first":s.family===t||t!=="rectangular"&&s.family!=="rectangular"?`Put this layer where the copied one sits on the ${te(s.family)} face`:`Put this layer where the copied one sits on the ${te(s.family)} face, scaled for this shape`}
        @click=${()=>s&&o(sk(s,t,n.kind),"paste")}>Paste position</button>
    </div>
  </div>`}`}function Nm(e,n,t){let i=n.payload.chartAnchor;if(i===void 0)return m;let a=n.payload.id,r=`el-${a}-anchor`,o=e.config.elements.filter(c=>c.kind==="chart"),s=(c,u)=>e.update(p=>{let f=p.elements.find(g=>g.payload.id===a);f?.payload.chartAnchor&&c(f.payload.chartAnchor)},u?`${r}-${u}`:void 0),l=ve(e),d=!o.some(c=>c.payload.id===i.layer);return h`
    <div class="fgroup">
    ${o.length<2?m:He("Follows",i.layer,o.map(c=>[c.payload.id,Ae(c,l)]),c=>s(u=>{u.layer=c}))}
    ${He("Reading",i.at,Ht,c=>e.update(u=>{let p=u.elements.find(g=>g.payload.id===a);if(!p?.payload.chartAnchor)return;p.payload.chartAnchor.at=c;let f=u.elements.find(g=>g.payload.id===i.layer);f?.kind==="chart"&&(c==="threshold"&&f.payload.thresholdValue===void 0&&(f.payload.thresholdValue=Cc(nt(e.resolve(f.payload.value)??"")),f.payload.drawsThreshold=!1),c==="now"&&f.payload.nowIndex===void 0&&(f.payload.nowIndex={kind:{kind:"time",timeField:"hour"}},f.payload.drawsNowLine=!1))}),{def:"highest"})}
    ${bg(e,i,r)}
    ${i.place==="through"?m:He("Sits",i.place,Zr.filter(([c])=>c!=="through"),c=>s(u=>{u.place=c}),{def:"above"})}
    </div>
    <div class="grid2">
      ${i.dx?ee("Nudge X",i.dx,c=>s(u=>{c?u.dx=c:delete u.dx},"dx"),{step:.5,def:0,unit:"pt"}):m}
      ${i.place==="through"&&!i.dy?m:ee("Nudge Y",i.dy??0,c=>s(u=>{c?u.dy=c:delete u.dy},"dy"),{step:.5,def:0,unit:"pt"})}
    </div>
    ${i.place==="through"?m:h`
    <div class="field list-field"><span>Marker</span>
      <div class="chips">
        <button class="small" title="Stop following the chart and leave this layer where it is"
          @click=${()=>e.update(c=>{let u=c.elements.find(p=>p.payload.id===a);u&&delete u.payload.chartAnchor})}><span>Unpin</span></button>
        <span class="muted">Stops following the chart, so you can move it anywhere.</span>
        ${n.kind==="text"?h`<button class="small" title="Swap this text marker for an icon of the same shape, keeping where it sits"
              @click=${()=>e.update(c=>{hp(c,a)})}><span>Use an icon</span></button>`:m}
      </div>
    </div>`}
    ${d?h`<div class="hint keep">The chart this followed is not in this document any more, so the layer
          draws where its own frame puts it. Pick another chart above${i.place==="through"?", or delete the line":", or unpin it"}.</div>`:i.place==="through"?m:h`<div class="hint">This layer follows that reading on the ${te(t)} face and every
          other one: wherever the bar lands, it goes. It is held inside the plot, so a big glyph over a tall
          bar is pushed down rather than off the top, and the bars never give up height to make room. Nudge Y
          can still lift it past the top of the chart, as far as the edge of the face.</div>`}`}function bg(e,n,t){let i=e.config.elements.find(l=>l.payload.id===n.layer);if(i?.kind!=="chart")return m;let a=i.payload,r=(l,d)=>e.update(c=>{let u=c.elements.find(p=>p.payload.id===n.layer);u?.kind==="chart"&&l(u.payload)},`${t}-${d}`),o=Ke(e.config,n.layer).filter(l=>l.payload.chartAnchor?.at===n.at).length,s=o>1?` ${o} layers follow this ${n.at==="now"?"reading":"threshold"}, and they all move with this number.`:"";if(n.at==="threshold"){let l=Cc(nt(e.resolve(a.value)??""));return h`
      <div class="grid2">
        ${ee("Threshold at",a.thresholdValue??l,d=>r(c=>{c.thresholdValue=d??l,c.drawsThreshold=!1},"thval"),{def:l})}
      </div>
      <div class="hint">${a.scale==="fixed"?"A threshold outside the chart's Min and Max draws nothing: the plot keeps the range you asked for.":"The plot stretches to include the threshold, so a series that never reaches it still shows how far off it is."}${s}</div>`}return n.at==="now"?h`
      ${pe(e,a.nowIndex??{kind:{kind:"time",timeField:"hour"}},l=>r(d=>{d.nowIndex=l,d.drawsNowLine=!1},"nowidx"),{showResolved:!0,label:"Now is reading",key:`${t}-nowindex`})}
      <div class="hint">Counted from 0, so Hour puts now on reading 14 at 2 pm, which is what a 24-reading
        price or forecast chart wants. Rounded, and clamped to the readings drawn.${s}</div>`:n.at==="zero"?h`<div class="hint">Drawn only while the plot runs from below zero to above it, like a
      temperature or a battery charging and discharging. On readings that stay on one side of zero, zero
      sits on the edge of the plot or outside it, and nothing draws.</div>`:m}function S$(e,n){if(n.kind==="tap")return m;let t=n.payload.id,i=et(e.config,t)[0];return Me(e,"tappable","Tap",a0(e,n,`el-${t}`),{color:oe.tap,icon:"tap",summary:i?on(i.payload.action):"Not tappable",...i?{reset:()=>e.update(a=>So(a,t))}:{}})}function T$(e,n,t,i,a){return h`
    ${Vt("Times",e.timeLabelCount,r=>n(o=>{o.timeLabelCount=Math.max(0,Math.min(li,Math.round(r)))},`${i}count`),{min:0,max:li,step:1,def:t.timeLabelCount,format:r=>r<=0?"None":String(Math.round(r)),range:!1})}
    ${e.timeLabelCount<=0?m:h`
      <div class="fgroup">
      <div class="grid2">
        ${ee("Time size",e.labelSize,r=>n(o=>{o.labelSize=Math.min(Mn,Math.max(Fn,r??ct))},`${i}size`),{step:.5,min:Fn,max:Mn,def:t.labelSize,unit:"pt"})}
        ${we("Time colour",e.labelColorHex,r=>n(o=>{o.labelColorHex=r??ut},`${i}colour`),!1,t.labelColorHex)}
      </div>
      ${e.labelsAbove===void 0?m:ae("Row",e.labelsAbove?"above":"below",[["below","Below"],["above","Above"]],r=>n(o=>{o.labelsAbove=r==="above"}),{def:t.labelsAbove===!0?"above":"below"})}
      </div>
      <div class="fgroup">
      ${ae("Clock",e.hourCycle,Zu,r=>n(o=>{o.hourCycle=r}),{titles:{auto:"Whatever clock the watch is set to"},def:t.hourCycle})}
      ${ae("Minutes",e.minutes,Qu,r=>n(o=>{o.minutes=r}),{titles:{auto:"Kept up to a three hour span, dropped past it"},def:t.minutes})}
      ${a}
      </div>`}`}var E$=[["number","Number"],["entity","Entity"]];function F$(e,n){return(n==="min"?e.minSource:e.maxSource)===void 0?"number":"entity"}function M$(e,n,t){let i=n==="min"?"minSource":"maxSource";t==="number"?delete e[i]:e[i]===void 0&&(e[i]={kind:{kind:"entityState",entityId:"",displayName:"",domain:""}})}function R$(e,n,t,i,a){let r=o=>{let s=o==="min",l=s?"Min":"Max",d=F$(n,o),c=s?n.minValue:n.maxValue,u=b=>a(y=>{s?y.minValue=b??0:y.maxValue=b??100},o),p={number:`${l} is a fixed number`,entity:`${l} reads a number from an entity`},f=h`<div class="gauge-end-head">
      ${Ne(l,d==="number"?Vn(c,t[o],u):void 0)}
      <span class="seg" role="radiogroup" aria-label=${`${l} comes from`}>
        ${E$.map(([b,y])=>h`<button type="button" role="radio" aria-checked=${b===d?"true":"false"}
          class=${b===d?"on":""} title=${p[b]}
          @click=${()=>{b!==d&&a(x=>M$(x,o,b))}}>${y}</button>`)}
      </span>
    </div>`,g=s?n.minSource:n.maxSource;return d==="number"||g===void 0?h`<div class="field gauge-end">${f}${Cr(c,u,{ariaLabel:l})}</div>`:h`<div class="field gauge-end">${f}${pe(e,g,b=>a(y=>{s?y.minSource=b:y.maxSource=b},`${o}src`),{showResolved:!0,noLabel:!0,label:l,key:`${i}-${o}source`})}</div>
      <div class="hint">If the entity has no number, the gauge uses ${String(c)}.</div>`};return n.minSource===void 0&&n.maxSource===void 0?h`<div class="grid2 gauge-ends">${r("min")}${r("max")}</div>`:h`${r("min")}${r("max")}`}function H$(e,n,t){if(!eo(n))return m;let i=e.arc,a=e.countdown===!0,r=(o,s)=>t(l=>{l.arc!==void 0&&o(l.arc)},s);return h`
    <div class="fgroup">
      ${Re("Curve",i!==void 0,o=>t(s=>{o?s.arc={radius:Ma}:delete s.arc},"arc"),!1,{disabled:a})}
      ${a?h`<div class="hint">A countdown ticks as one piece of system text, which cannot be bent around a circle. Turn the countdown off to curve this layer.</div>`:m}
      ${i===void 0||a?m:h`
        ${ee("Radius",i.radius,o=>r(s=>{s.radius=Math.min(no,Math.max(to,o??Ma))},"arc-radius"),{step:.05,min:to,max:no,unit:"of box",def:Ma})}
        ${ee("Position",i.angle??0,o=>r(s=>{let l=o??0;l===0?delete s.angle:s.angle=l},"arc-angle"),{step:5,min:-360,max:360,unit:"\xB0",def:0})}
        ${ee("Spacing",i.spacing??0,o=>r(s=>{let l=Ha(o??0);l===0?delete s.spacing:s.spacing=l},"arc-spacing"),{step:.5,min:bl,max:xl,unit:"pt",def:0})}
        ${ee("Spread",Math.abs(i.sweep??We),o=>r(s=>{let l=(s.sweep??We)<0?-1:1,d=Ra(l*Math.abs(o??We));d===We?delete s.sweep:s.sweep=d},"arc-sweep"),{step:5,min:gl,max:yl,unit:"\xB0",def:We})}
        ${ae("Reads",L$(i),A$,o=>r(s=>{let l=Math.abs(s.sweep??We),d=o==="bottom"?-l:l;d===We?delete s.sweep:s.sweep=d,o==="bottom"?s.flip=!0:delete s.flip,o==="bottom"&&(s.angle??0)===0&&(s.angle=180),o==="top"&&s.angle===180&&delete s.angle},"arc-reads"),{def:"top"})}
        <div class="hint">Drag the box to grow the circle: a radius of ${Ma} fills it,
          and a bigger one bends the text less without moving it. Position is where the
          middle of the text sits, 0 at the top and 90 on the right. Spread is how much of the circle the text may use; longer text shrinks
          to half size, then runs past the ends. Spacing adds room between the letters.</div>`}
    </div>`}var A$=[["top","Over the top"],["bottom","Along the bottom"]];function L$(e){let n=(e.sweep??We)<0,t=e.flip===!0;return!n&&!t?"top":n&&t?"bottom":"mixed"}function I$(e,n,t,i){let a=n.coloring??"uniform",r=n.highlight??"none",o=(c,u)=>t(p=>{let f={bands:p.bands??[],bandAboveColorHex:p.bandAboveColorHex??be};c(f),f.bands.length>0?p.bands=f.bands:delete p.bands,f.bandAboveColorHex!==be?p.bandAboveColorHex=f.bandAboveColorHex:delete p.bandAboveColorHex},u),s=(c,u,p)=>t(f=>{p===void 0||p===u?delete f[c]:f[c]=p},c),l=r==="highest"?"The highest number takes its own colour":r==="lowest"?"The lowest number takes its own colour":"The highest and lowest numbers take their own colours",d=a==="bands"?nt(e.resolve(n.value)??""):[];return h`
    <div class="fgroup">
    ${ae("Colour",a,gc,c=>t(u=>{if(c==="uniform"){delete u.coloring;return}u.coloring=c,(u.bands?.length??0)===0&&(u.bands=$s(nt(e.resolve(u.value)??"")))}),{def:"uniform"})}
    ${i}
    ${a==="bands"?h`
      <div class="hint">Each number in the text takes the colour of the band it falls in, and other text keeps the layer colour.</div>
      ${Cs({bands:n.bands??[],bandAboveColorHex:n.bandAboveColorHex??be},n.colorSlot.baseColorHex,o,d.length===1?d[0]:void 0)}`:m}
    </div>
    <div class="fgroup">
    ${ae("Highlight",r,Ik,c=>t(u=>{c==="none"?delete u.highlight:u.highlight=c}),{def:"none"})}
    ${r==="none"?m:h`
      <div class="grid2">
        ${r==="lowest"?m:we("Highest colour",n.highColorHex??lt,c=>s("highColorHex",lt,c),!1,lt)}
        ${r==="highest"?m:we("Lowest colour",n.lowColorHex??dt,c=>s("lowColorHex",dt,c),!1,dt)}
      </div>
      ${a==="bands"?m:h`<div class="hint">${l}, and other text keeps the layer colour.</div>`}`}
    </div>`}var mr=new Map,pr=new Map,pn=new Map,hr=new Map,hc=4,fc=40,_$=[["layer","Layer"],["pick","Pick"],["bands","By value"]],N$=[["plain","Plain"],["rich","Rich"]],D$={plain:"One line: typed words, a live value or a template",rich:"Parts, each with its own colour, weight and size"};function Fc(e,n,t,i){let a=t!==void 0&&e.canCountDown(t);return!n&&!a?m:h`${Re("Count down",n,i)}
    <div class="hint">Ticks down to the value's time on the watch, once a second: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>
    ${n&&!a?h`<div class="hint warn">This value is not a timer or a future time, so nothing counts down. The watch shows it as plain text.</div>`:m}`}function P$(e){return e.countdown===!0?"countdown":vt(e)?"rich":"plain"}function z$(e){return(e.match(/ +|[^ ]+/g)??[]).map(n=>({text:n,space:n.startsWith(" ")}))}function O$(e,n){let t=ri(e);return t!==void 0?{kind:"text",label:t}:e.kind.kind==="jinja"?{kind:"template",label:Ye(e.kind.value,40)||"template"}:{kind:"value",label:Tr(e,n)}}function xg(e,n,t){let i=ri(e.value),a=i===void 0?Ye(Tr(e.value,t),28):i.trim()===""?i===""?"empty":"spaces":`"${Ye(i,24)}"`;return`Part ${n+1}: ${a}`}function G$(e,n,t){let i=[["","Whole text"],...e.map((a,r)=>[a.id,xg(a,r,t)])];return n!==void 0&&!e.some(a=>a.id===n)&&i.push([n,"A part that is gone"]),i}function bc(e){return e.coloring==="bands"?"bands":e.colorHex===void 0?"layer":"pick"}function B$(e,n){if(bc(e)==="bands"&&(e.bands?.length??0)>0){let t=[...Tn({bands:e.bands}).map(r=>r.colorHex),e.bandAboveColorHex??be],i=100/t.length,a=r=>`${Math.round(r*10)/10}%`;return`conic-gradient(${t.map((r,o)=>`${r} ${a(o*i)} ${a((o+1)*i)}`).join(", ")})`}return e.colorHex??n}function Dm(e){let n=r=>r.length===1?`Part ${r[0].index+1}`:`Parts ${Ls(r.map(o=>String(o.index+1)))}`,t=e.filter(r=>r.reason==="kind"),i=e.filter(r=>r.reason==="format"),a=[];return t.length>0&&a.push(`${n(t)} ${t.length===1?"shows":"show"} a value a template cannot read, such as data age or a chart's number.`),i.length>0&&a.push(`${n(i)} ${i.length===1?"uses":"use"} a relative time or duration format, which a template cannot print.`),`Rich text stays on, because the parts cannot join into one line. ${a.join(" ")} Change or remove ${e.length===1?"that part":"those parts"} first.`}var V$={fontSize:"font size",fontWeight:"weight",color:"colour",bands:"colour bands"};function U$(e){return e.joined?e.template?"Rich text is off. The parts joined into one template, so the live values still update.":"Rich text is off. The parts joined into one line of text.":e.moved.length===0?"Rich text is off.":`Rich text is off. The part's ${Ls(e.moved.map(n=>V$[n]))} moved into Look.`}function W$(e,n,t,i,a){let r=n.payload,o=r.id,s=P$(r),l=(r.parts?.length??0)>0,d=zl(e.config,r.value),c=pn.get(o),u=c&&c.rich===l?c:void 0,p=s==="rich"&&(r.parts?.length??0)>=2?pr.get(o):void 0,f=(y,x)=>{let $=!(r.parts??[]).every(C=>C.value.kind.kind==="literal"),k=ls(structuredClone(r),e.config.values);if(pr.delete(o),!k.ok){pn.set(o,{text:Dm(k.blocked),rich:!0,warn:!0}),Te(x);return}pn.set(o,{text:U$(k.joined?{joined:!0,template:$}:k),rich:!1}),i(C=>{ls(C,e.config.values),y==="countdown"&&(C.countdown=!0)})},g=(y,x)=>{if(pr.delete(o),s==="rich"){let $=y==="countdown"?"countdown":"plain",k=r.parts??[];if(k.length<2){f($,x);return}let C=ac(k,e.config.values);C.ok?(pn.delete(o),pr.set(o,$)):pn.set(o,{text:Dm(C.blocked),rich:!0,warn:!0}),Te(x);return}if(y==="rich"){let $=r.parts?.[0]?.id??ie();mr.set(o,$),pn.delete(o),i(k=>{delete k.countdown,mm(k,$)});return}pn.delete(o),i($=>{if(y==="countdown"){$.countdown=!0;return}($.parts?.length??0)>0&&ls($,e.config.values),delete $.countdown})},b=p==="countdown"?"Switch to Countdown?":"Switch to Plain?";return h`
    ${ae("Type",s==="rich"?"rich":"plain",N$,g,{titles:D$})}
    <div class="hint">Plain shows one line: typed words, a live value or a template. Rich splits the text into parts, and each part has its own colour, weight and size.</div>
    ${p===void 0?m:h`<div class="rich-confirm" role="alertdialog" aria-label=${b}>
        <b>${b}</b>
        <div>The parts join into one line, so every word and value stays. The part styles go away. Undo brings them back.${r.rules.some(y=>y.partId!==void 0)?" States that change one part will change the whole text.":""}</div>
        <div class="acts">
          <button class="small primary" @click=${y=>f(p,y.currentTarget)}>Switch</button>
          <button class="small" @click=${y=>{pr.delete(o),Te(y.currentTarget)}}>Keep Rich</button>
        </div>
      </div>`}
    ${u?h`<div class=${u.warn?"hint warn":"rich-note"}>${u.text}</div>`:m}
    ${s==="rich"?K$(e,n,t,i,a):h`
        ${yg(e,n,a)}
        ${pe(e,r.value,y=>i(x=>{x.value=y},"value"),{showResolved:!0,label:s==="countdown"?"Until":"Text",key:`${a}-value`})}
        ${Fc(e,s==="countdown",r.value,y=>g(y?"countdown":"plain",null))}
        ${d?h`<div class="hint keep">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(d.payload.id)}>${Ae(d,ve(e))}</button>. It stays in the chart's group and moves with it.</div>`:m}`}`}function K$(e,n,t,i,a){let r=n.payload,o=r.parts??[],s=r.id,l=ve(e),d=Math.max(0,o.findIndex(z=>z.id===mr.get(s))),c=o[d],u=o.length,p=r.colorSlot.baseColorHex,f=Oe(e.config,t,n).size??r.fontSize,g=(z,K)=>{pn.delete(s),i(Y=>{z(Y),Wu(Y)},K)},b=(z,K)=>g(Y=>{let v=Y.parts?.find(S=>S.id===c.id);v&&z(v)},K?`part-${c.id}-${K}`:void 0),y=(z,K)=>{mr.set(s,z),pn.delete(s),Te(K)},x=(z,K)=>{let Y=ie();mr.set(s,Y),g(v=>{(v.parts??=[]).push({id:Y,value:z})}),ig(K,Hs(`${a}-part-${Y}`),!0)},$=z=>g(K=>{K.parts&&vr(K.parts,d,z)}),k=()=>{let z=o[d+1]??o[d-1];z&&mr.set(s,z.id),g(K=>{K.parts=(K.parts??[]).filter(Y=>Y.id!==c.id)})},C=o.map((z,K)=>{let Y=O$(z.value,l),v=z.id===c.id,S=bc(z),E=Y.kind==="value"?e.resolve(z.value):void 0,_=z.fontWeight===void 0?void 0:ra.find(([O])=>O===z.fontWeight)?.[1];return h`<button type="button" role="option" aria-selected=${v?"true":"false"} class="part-chip ${Y.kind} ${v?"on":""}"
      aria-label=${xg(z,K,l)} @click=${O=>y(z.id,O.currentTarget)}>
      <span class="part-dot" style=${`background:${B$(z,p)}`}
        title=${S==="bands"?"By value, with its own bands":S==="pick"?"Its own colour":"The layer colour"}></span>
      ${Y.kind==="text"?h`<span class="part-txt">${Y.label===""?h`<span class="part-empty">empty</span>`:z$(Y.label).map(O=>O.space?h`<span class="part-sp">${"\xB7".repeat(O.text.length)}</span>`:O.text)}</span>`:h`<span class="part-txt">${Y.label}</span>`}
      ${E===void 0?m:h`<span class="part-now">${E}</span>`}
      ${_===void 0?m:h`<span class="part-flag" title="Its own weight">${_}</span>`}
      ${z.fontSize===void 0?m:h`<span class="part-flag" title="Its own font size">${z.fontSize} pt</span>`}
    </button>`}),M=r.rules.some(z=>z.partId===c.id),D=c.value.kind.kind==="literal",I=bc(c),T=c.fontSize!==void 0,F=ra.find(([z])=>z===r.fontWeight)?.[1]??r.fontWeight,N=br.find(([z])=>z===(r.fontDesign??"default"))?.[1]??"System",j=xr.find(([z])=>z===(r.fontWidth??"standard"))?.[1]??"Standard",B=z=>{z>=hc&&z<=fc&&b(K=>{K.fontSize=z},"size")},W=I==="bands"?nt(e.resolve(c.value)??""):[],ne={layer:"Use the layer colour",...D&&I!=="bands"?{bands:"By value needs a live value"}:{}},X=(z,K)=>b(Y=>{let v={bands:Y.bands??[],bandAboveColorHex:Y.bandAboveColorHex??be};z(v),v.bands.length>0?Y.bands=v.bands:delete Y.bands,v.bandAboveColorHex!==be?Y.bandAboveColorHex=v.bandAboveColorHex:delete Y.bandAboveColorHex},K);return h`<div class="rich-parts">
    <div class="field parts-field"><span>Parts</span>
      <div class="part-chips" role="listbox" aria-label="Parts">${C}</div>
      <div class="part-adds">
        <button type="button" class="small" title="Add a part of typed words"
          @click=${z=>x(U(""),z.currentTarget)}>${P("text")}<span>Add text</span></button>
        <button type="button" class="small" title="Add a part that shows a live value"
          @click=${z=>x({kind:{kind:"entityState",entityId:"",displayName:"",domain:""}},z.currentTarget)}>${P("braces")}<span>Add value</span></button>
      </div>
    </div>
    <div class="part-editor">
      <div class="part-head">
        <span class="part-title"><b>Part ${d+1}</b> of ${u} · ${D?"Text":"Value"}</span>
        <span class="spacer"></span>
        <button type="button" class="icon" title="Move left" aria-label="Move left" ?disabled=${d===0} @click=${()=>$(d-1)}>${P("left")}</button>
        <button type="button" class="icon" title="Move right" aria-label="Move right" ?disabled=${d===u-1} @click=${()=>$(d+1)}>${P("right")}</button>
        <button type="button" class="icon danger" aria-label="Remove this part" ?disabled=${u===1||M}
          title=${u===1?"A rich text layer keeps at least one part":M?"A state changes this part":"Remove this part"}
          @click=${k}>${P("delete")}</button>
      </div>
      ${M&&u>1?h`<div class="hint keep">A state changes this part. Change or delete that state first.</div>`:m}
      ${pe(e,c.value,z=>b(K=>{K.value=z},"value"),{showResolved:!0,label:D?"Text":"Shows",key:`${a}-part-${c.id}`})}
      ${D?h`<div class="hint">Spaces count, and show as dots in the parts list. Type one at the start or end when this part needs a gap.</div>`:m}
      ${ae("Colour",I,_$,z=>b(K=>{if(z==="layer"){delete K.colorHex,delete K.coloring;return}if(z==="pick"){delete K.coloring,K.colorHex=kc(p,"#FFFFFF")?"#64D2FF":p;return}delete K.colorHex,K.coloring="bands",(K.bands?.length??0)===0&&(K.bands=$s(nt(e.resolve(K.value)??"")))}),{def:"layer",titles:ne,...D&&I!=="bands"?{disabled:{bands:!0}}:{}})}
      ${I==="pick"?we("Part colour",c.colorHex,z=>b(K=>{K.colorHex=z??p},"color")):m}
      ${I==="bands"?h`
        ${Cs({bands:c.bands??[],bandAboveColorHex:c.bandAboveColorHex??be},c.colorHex??p,X,W.length===1?W[0]:void 0)}
        <div class="hint">These bands belong to this part. Another value in the same layer keeps its own.</div>`:m}
      <div class="field seg-field">${Ne("Weight",c.fontWeight===void 0?void 0:{atDefault:!1,title:`Back to the layer weight (${F})`,reset:()=>b(z=>{delete z.fontWeight})})}
        ${Ti("Weight",c.fontWeight,ra,z=>b(K=>{K.fontWeight=z}),{inherited:r.fontWeight})}
      </div>
      <div class="field seg-field">${Ne("Typeface",c.fontDesign===void 0?void 0:{atDefault:!1,title:`Back to the layer typeface (${N})`,reset:()=>b(z=>{delete z.fontDesign})})}
        ${Ti("Typeface",c.fontDesign,br,z=>b(K=>{K.fontDesign=z}),{inherited:r.fontDesign??"default"})}
      </div>
      ${c.fontDesign==="rounded"||c.fontDesign==="serif"?Tc:m}
      <div class="field seg-field">${Ne("Width",c.fontWidth===void 0?void 0:{atDefault:!1,title:`Back to the layer width (${j})`,reset:()=>b(z=>{delete z.fontWidth})})}
        ${Ti("Width",c.fontWidth,xr,z=>b(K=>{K.fontWidth=z}),{inherited:r.fontWidth??"standard"})}
      </div>
      ${c.fontWidth!==void 0&&c.fontWidth!=="standard"?Sc:m}
      <div class="field seg-field">${Ne("Italic",c.italic===void 0?void 0:{atDefault:!1,title:`Back to the layer slant (${r.italic===!0?"italic":"upright"})`,reset:()=>b(z=>{delete z.italic})})}
        ${Ti("Italic",c.italic===void 0?void 0:c.italic?"on":"off",u$,z=>b(K=>{K.italic=z==="on"}),{inherited:r.italic===!0?"on":"off"})}
      </div>
      <label class="field num part-size">${Ne("Font size",T?{atDefault:!1,title:`Back to the layer size (${f} pt)`,reset:()=>b(z=>{delete z.fontSize})}:void 0,Ms(c.fontSize??f,B,{step:1,min:hc,max:fc}))}
        ${Cr(c.fontSize,z=>{z===void 0?b(K=>{delete K.fontSize},"size"):B(z)},{step:1,min:hc,max:fc,optional:!0,unit:"pt",placeholder:String(f),ariaLabel:T?"Part font size":`Part font size, ${f} pt from the layer`,...T?{}:{lead:P("link")}})}
      </label>
    </div>
  </div>`}function wg(e,n,t,i={}){let a=n.payload.id,r=e.config.elements.findIndex(v=>v.payload.id===a),o=`el-${a}`,s=(v,S)=>e.update(E=>v(E.elements[r]),S?`${o}-${S}`:void 0),l=Oe(e.config,t,n),d=l.frame,c=(v,S)=>e.update(E=>Fe(E,t,a,{frame:Lo(d,v)}),`${o}-${S}-${t}`),u=Le(n.kind).payload,p=u.colorSlot?.baseColorHex??"#FFFFFF",f=v=>u[v],g=!1,b=v=>Ei(n)===void 0?m:we(v,Ei(n),S=>s(E=>{Ei(E)!==void 0&&(E.payload.colorSlot.baseColorHex=S??"#FFFFFF")},"color"),!1,p),y,x={},$=[],k,C;switch(n.kind){case"text":{let v=(S,E)=>s(_=>S(_.payload),E);k=W$(e,n,t,v,o),g=!n.payload.countdown&&!vt(n.payload),C=h`
        <div class="fgroup">
        ${Bn(e,n,t,"Font size",{step:1,min:4,def:f("fontSize")})}
        ${ae("Weight",n.payload.fontWeight,ra,S=>s(E=>{E.payload.fontWeight=S}),{def:u.fontWeight})}
        ${hk({label:"Align",value:n.payload.alignment??"center",options:c$,def:"center",set:S=>s(E=>{let _=E.payload;S==="center"?delete _.alignment:_.alignment=S})},{label:"Lines",value:String(n.payload.lineLimit??1),options:p$,def:"1",set:S=>s(E=>{let _=E.payload;S==="1"?delete _.lineLimit:_.lineLimit=Number(S)})})}
        ${ae("Typeface",n.payload.fontDesign??"default",br,S=>s(E=>{let _=E.payload;S==="default"?delete _.fontDesign:_.fontDesign=S}),{def:"default"})}
        ${n.payload.fontDesign==="rounded"||n.payload.fontDesign==="serif"?Tc:m}
        ${ae("Width",n.payload.fontWidth??"standard",xr,S=>s(E=>{let _=E.payload;S==="standard"?delete _.fontWidth:_.fontWidth=S}),{def:"standard"})}
        ${n.payload.fontWidth!==void 0&&n.payload.fontWidth!=="standard"?Sc:m}
        ${Re("Italic",n.payload.italic===!0,S=>s(E=>{let _=E.payload;S?_.italic=!0:delete _.italic}),u.italic===!0)}
        ${Re("Mono digits",n.payload.monospacedDigits===!0,S=>s(E=>{let _=E.payload;S?_.monospacedDigits=!0:delete _.monospacedDigits}),u.monospacedDigits===!0)}
        ${n.payload.monospacedDigits?h`<div class="hint">Digits take the same width, so a number that ticks does not shuffle what sits beside it.</div>`:m}
        ${Vt("Shrink to fit",n.payload.minimumScale??pt,S=>s(E=>{let _=E.payload,O=Sa(S);O===pt?delete _.minimumScale:_.minimumScale=O},"minscale"),{min:pt,max:1,step:.05,def:pt,format:S=>`${Math.round(S*100)}%`})}
        <div class="hint">How small the text may go to fit its box before it is cut off with an ellipsis.
          100% never shrinks.</div>
        </div>
        ${H$(n.payload,t,v)}
        ${g?I$(e,n.payload,v,b("Main colour")):m}`;break}case"icon":k=h`
        ${pe(e,n.payload.symbol,v=>s(S=>{S.payload.symbol=v},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${o}-symbol`,setSymbolPath:v=>s(S=>{let E=S.payload;v?E.path=v:delete E.path},"symbol")})}
        <div class="hint">An entity source draws that entity's own icon instead. A Material Design icon travels with the document, so a rule that swaps the icon goes back to SF Symbols.</div>`,C=Bn(e,n,t,"Icon size",{step:1,min:4,def:f("size")});break;case"gauge":{let v=n.payload,S=(_,O)=>s(J=>_(J.payload),O),E=v.style==="dots";k=h`
        ${pe(e,v.value,_=>S(O=>{O.value=_},"value"),{showResolved:!0,label:"Reading",key:`${o}-value`})}
        ${E?h`
            ${pe(e,v.total??Mm(v),_=>S(O=>{O.total=_},"total"),{showResolved:!0,label:"Total",key:`${o}-total`})}
            <div class="hint">How many dots to draw. Left as it is, a count of the same
              entities without the filter, so "3 of 8 lights on" is one reading and one
              total over one scope. At most ${co} dots are drawn.</div>`:h`<div class="fgroup">${R$(e,v,{min:u.minValue,max:u.maxValue},o,S)}</div>`}`,g=!0,C=h`
        <div class="grid2">
          ${ae("Style",v.style,Bk,_=>S(O=>{_==="dots"&&O.total===void 0&&(O.total=Mm(O)),_!=="dots"&&delete O.total,_==="needle"&&O.style!=="needle"&&O.lineWidth===u.lineWidth&&(O.lineWidth=Fm),_!=="needle"&&O.style==="needle"&&O.lineWidth===Fm&&(O.lineWidth=u.lineWidth),O.style=_}),{titles:Vk,def:u.style})}
          ${E?m:Bn(e,n,t,"Line width",{step:.5,min:.5,def:f("lineWidth")})}
        </div>
        <div class="fgroup">
        ${we(E?"Empty dot colour":"Track colour",v.trackColorHex,_=>S(O=>{O.trackColorHex=_??"#FFFFFF40"},"track"),!1,u.trackColorHex)}
        ${ae("Colour",v.coloring,gc,_=>S(O=>{O.coloring=_,_==="bands"&&O.bands.length===0&&(O.bands=$s([O.minValue,O.maxValue]))}),{def:u.coloring})}
        ${b("Main colour")}
        ${v.coloring==="bands"?m:ws("Gradient",v.fill,_=>S(O=>{if(_===void 0){delete O.fill;return}O.fill=_,O.colorSlot.baseColorHex=At(_,0)},"fill"),()=>({kind:"linear",stops:[{at:0,colorHex:v.colorSlot.baseColorHex},{at:1,colorHex:v.colorSlot.baseColorHex}]}))}
        ${v.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. The
            gauge takes the colour of the row its reading falls in, and a reading past the
            last row takes the colour underneath.</div>
          ${Cs(v,v.colorSlot.baseColorHex,S,nt(e.resolve(v.value)??"")[0])}`:m}
        </div>
        ${Z$(v,S)}
        ${E?m:h`
          <div class="fgroup">
          <div class="grid2">
            ${ee("Threshold",v.thresholdValue,_=>S(O=>{_===void 0?delete O.thresholdValue:O.thresholdValue=_},"thr"),{optional:!0,def:null})}
            ${v.thresholdValue===void 0?m:we("Threshold colour",v.thresholdColorHex,_=>S(O=>{O.thresholdColorHex=_??Oi},"thrcol"),!1,Oi)}
          </div>
          <div class="hint">A short tick on the scale at that value, so the fill reads
            against a target instead of on its own. A value outside Min to Max draws
            nothing. Leave it empty for no mark.</div>
          </div>`}`;break}case"chart":{let v=n.payload,S=(R,G)=>s(he=>R(he.payload),G),E=u.historyMinutes,_=u.historyPoints,O=v.historyMinutes>0,J=O&&v.source==="statistics",se=O&&!J,me=O?J?"statistics":"history":"value",Ze=J?Pa:oi,fn=Lt(v)??It(v),Ue=v.value.kind.kind==="entityState",Ce=fn===void 0?void 0:e.historySeries(fn),Xe=O&&Ue?Ce??"":e.resolve(v.value)??"",ot=v.historyPoints<1,by=se&&Ue&&fn!==void 0?e.historyReadings?.(fn):void 0,nu=k$(ot,by,Fi(v.historyMinutes)),iu=yc(a,v.historyMinutes,Ze),zs=O&&Ue?hd(Xe):{values:nt(Xe),holes:[]},Ai=zs.values,au=R=>v.limit>0&&R.length>v.limit?v.takeFromEnd?R.slice(R.length-v.limit):R.slice(0,v.limit):R,xy=au(Ai),Et=fd(xy,xt(v.smoothing),zs.holes.length>0?au(zs.holes):[]),wy=!O&&Ue&&Ai.length===1,Os=e.config.elements.filter(R=>R.kind==="chart"&&R.payload.id!==a),ru=ve(e),Mr=v.scaleFrom!==void 0&&Os.some(R=>R.payload.id===v.scaleFrom);k=h`
        ${pe(e,v.value,R=>S(G=>{G.value=R},"value"),{label:"Readings",noShare:!0,key:`${o}-value`})}
        <div class="fgroup">
        ${ae("Draw",me,[["history","Recorded history"],["statistics","Long-term statistics"],["value","The value itself"]],R=>S(G=>{if(R==="value"){G.historyMinutes=0;return}G.source=R==="statistics"?"statistics":"history";let he=G.historyMinutes||ho;G.historyMinutes=R==="statistics"?Math.min(he,Fl):Math.min(he,fo)}),{titles:{history:"Read the entity's recorded states from the recorder and plot them",statistics:"Plot the recorder's pre-aggregated rows, which reach back a year",value:"Plot the numbers the value holds right now, such as a forecast list"},def:u.historyMinutes>0?"history":"value"})}
        ${J?h`
            ${Ue?m:h`<div class="hint warn">Statistics need an entity.
              A typed-in value, a template or a shared value has no rows to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${uc(a,v.historyMinutes,E,R=>S(G=>{G.historyMinutes=R}),Pa)}
              ${ae("Per",v.statPeriod,Jr,R=>S(G=>{G.statPeriod=R}),{def:Ta})}
            </div>
            ${iu?pc(v.historyMinutes,R=>S(G=>{G.historyMinutes=R},"span"),!0):m}
            ${ae("Read",v.statType,hl,R=>S(G=>{G.statType=R}),{def:Ea})}
            <div class="hint">One bar per period, oldest first, newest ${rn} kept.
              Change suits energy (kWh per hour), Mean suits temperature.</div>
            ${v.statPeriod==="5minute"?h`<div class="hint warn">Five-minute rows are compacted into hourly ones after
                about ten days, so a longer span here comes back with only its recent tail.</div>`:m}
            ${Ue&&Ce===void 0?h`<div class="hint keep">Reading the statistics…</div>`:m}
            ${Ue&&Ce===""?h`<div class="hint warn">No long-term statistics for this entity in that span.
                Only an entity with a state class (measurement, total or total_increasing) gets
                them, and a brand new one has none yet.</div>`:m}`:m}
        ${se?h`
            ${Ue?m:h`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${uc(a,v.historyMinutes,E,R=>S(G=>{G.historyMinutes=R}))}
              <div class="field readings-field">${Ne("Points",{atDefault:v.historyPoints===_,title:`Back to ${_<1?"every one":`${_} averaged`}`,reset:()=>S(R=>{R.historyPoints=_})})}
                <div class="readings-row">
                  <div class="seg wide" role="radiogroup" aria-label="Points">
                    <button type="button" role="radio" aria-checked=${ot?"false":"true"} class=${ot?"":"on"}
                      title="Average the recorded states into this many equal time slots"
                      @click=${()=>{ot&&S(R=>{R.historyPoints=24})}}>Average</button>
                    <button type="button" role="radio" aria-checked=${ot?"true":"false"} class=${ot?"on":""}
                      title="Plot every recorded state change, no averaging"
                      @click=${()=>{ot||S(R=>{R.historyPoints=Ml})}}>Every one</button>
                  </div>
                  ${ot?m:h`<span class="readings-into">into</span>
                    <input type="number" class="short" aria-label="How many time slots" .value=${String(v.historyPoints)}
                      title="How many equal time slots the span is averaged into, so how many bars or points get drawn"
                      step="1" min=${mo} max=${rn}
                      data-scrub @pointerdown=${$r(v.historyPoints,R=>S(G=>{G.historyPoints=Math.round(R)},"hpoints"),{step:1,min:mo,max:rn})}
                      @input=${Ee(R=>{let G=Number(R);R.trim()!==""&&Number.isFinite(G)&&G>=1&&S(he=>{he.historyPoints=Math.round(G)},"hpoints")})} />
                    <span class="readings-unit">slots</span>`}
                </div>
              </div>
            </div>
            ${iu?pc(v.historyMinutes,R=>S(G=>{G.historyMinutes=R},"span")):m}
            <div class="hint">${ot?h`Every state the recorder holds in that span, oldest first, one reading per change.
                  The time axis follows the changes, so a quiet hour draws narrower than a busy one.
                  A span with more than ${rn} readings is averaged into
                  ${rn} even slots instead, so the chart still covers all of it.`:h`Home Assistant averages the recorded states into this many equal time slots,
                  oldest first. About 20 suits a rectangular complication; more than that draws bars
                  thinner than the screen can show.`}</div>
            ${nu===void 0?m:h`<div class="hint keep">${nu}</div>`}
            ${Ue&&Ce===void 0?h`<div class="hint keep">Reading the history…</div>`:m}
            ${Ue&&Ce===""?h`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:m}`:m}
        ${O?h`
            ${Re("Show gaps",v.gaps===!0,R=>S(G=>{R?G.gaps=!0:delete G.gaps}),u.gaps===!0)}
            ${un(e)}
            <div class="hint">Breaks the line, and leaves the bar out, wherever the entity was unavailable,
              instead of carrying the last reading across the outage.</div>`:m}
        ${O?m:h`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        </div>
        ${Ai.length===0&&!(O&&(!Ue||Ce===void 0||Ce===""))?h`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:m}
        ${Ai.length>0?h`<div class="field readout"><span>Reads</span>
              <span class="readout-v"><span class="nums">${g$(Et)}</span>${Ai.length===Et.length?h` · ${Et.length} ${Et.length===1?"value":"values"}`:h` · ${Et.length} of ${Ai.length}`}</span></div>`:m}
        ${wy?h`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Recorded history</b> to plot how it has moved.</div>`:m}
        ${O&&v.limit<=0?m:h`
        <div class="grid2">
          ${ee("Only draw",v.limit,R=>S(G=>{G.limit=Math.max(0,Math.round(R??0))},"limit"),{step:1,min:0,def:u.limit,unit:"readings"})}
          ${v.limit<=0?m:ae("Keep",v.takeFromEnd?"end":"start",O?[["start","Oldest"],["end","Newest"]]:[["start","First"],["end","Last"]],R=>S(G=>{G.takeFromEnd=R==="end"}),{def:u.takeFromEnd===!0?"end":"start"})}
        </div>
        ${O?h`<div class="hint warn">Span and slots already set how much is drawn, so set this to 0.
              Trimming here draws only ${v.limit} of the readings fetched above, while clock times still label the whole span.</div>`:h`<div class="hint">${v.limit<=0?"0 draws every reading. Type a number to draw only that many.":`Draws only ${v.limit} of the numbers: the first or the last ones. A forecast sensor often carries 24 or 48.`}</div>`}`}
        ${He("Smooth data",xt(v.smoothing)??"off",Hk,R=>S(G=>{let he=xt(R);he===void 0?delete G.smoothing:G.smoothing=he}),{def:xt(u.smoothing)??"off"})}
        ${un(e)}
        <div class="hint">Averages each reading with its neighbours, weighted towards the middle, so a
          jumpy sensor draws a calm line. The strength scales with the number of readings: over 120
          readings, Light, Medium and Strong average 7, 13 or 25 of them. The chart's own numbers
          read the smoothed series too: its stats, highlights and bands. A text layer pointed at the entity itself still shows the raw value.</div>`,g=!0;let vy=(()=>{if(Mr)return!0;if(v.scale==="fixed")return v.minValue<0&&v.maxValue>0;let R=Et.filter(Rr=>Number.isFinite(Rr));if(R.length===0)return!0;let G=Math.min(...R,v.thresholdValue??1/0),he=Math.max(...R,v.thresholdValue??-1/0);return G<0&&he>0})(),mn=wm(v);$=Et,C=h`
        <div class="grid2">
          ${ae("Style",v.style,tg,R=>S(G=>{G.style=R}),{def:u.style})}
          ${v.style==="bars"?ee("Bar gap",v.barGap,R=>S(G=>{G.barGap=Math.max(0,R??0)},"gap"),{step:.5,min:0,def:u.barGap,unit:"pt"}):Bn(e,n,t,"Line width",{step:.5,min:.5,def:f("lineWidth")})}
        </div>
        ${v.style==="bars"?h`
          <div class="fgroup">
          <div class="grid2">
            ${ee("Corner radius",vn(v.barRadius),R=>S(G=>{let he=Math.max(0,R??Pi);he===Pi?delete G.barRadius:G.barRadius=he},"barradius"),{step:.5,min:0,def:vn(u.barRadius),unit:"pt"})}
          </div>
          ${Re("Round top only",kn(v.barCorners)==="top",R=>S(G=>{R?G.barCorners="top":delete G.barCorners}),kn(u.barCorners)==="top")}
          ${un(e)}
          <div class="hint">Round top only rounds the end away from the baseline, so a bar hanging
            below zero rounds its bottom.</div>
          </div>
          <div class="fgroup">
          ${mn.fill===void 0?m:lc(mn.fill,v.fillColorHex,R=>S(G=>{R===void 0?delete G.fillColorHex:G.fillColorHex=R},"fillcol"))}
          ${v.style==="bars"?m:ws("Area gradient",v.areaFill,R=>S(G=>{if(R===void 0){delete G.areaFill;return}G.areaFill=R,G.fillColorHex=At(R,0)},"areafill"),()=>({kind:"linear",stops:[{at:0,colorHex:v.fillColorHex??v.colorSlot.baseColorHex},{at:1,colorHex:v.fillColorHex??v.colorSlot.baseColorHex}]}))}
          ${Re("Border",v.barBorderWidth!==void 0,R=>S(G=>{R?G.barBorderWidth=1:delete G.barBorderWidth}),!1)}
          ${v.barBorderWidth===void 0?m:h`
            ${ee("Border width",v.barBorderWidth,R=>S(G=>{G.barBorderWidth=Math.min(Math.max(R??1,0),uo)},"barborderw"),{step:.5,min:0,max:uo,def:1,unit:"pt"})}
            ${mn.border===void 0?m:lc(mn.border,v.barBorderColorHex,R=>S(G=>{R===void 0?delete G.barBorderColorHex:G.barBorderColorHex=R},"barbordercol"))}
            ${Re("Open at base",v.barBorderOpenBase===!0,R=>S(G=>{R?G.barBorderOpenBase=!0:delete G.barBorderOpenBase}),!1)}`}
          ${un(e)}
          <div class="hint">The border is drawn inside each bar, so bars keep their size. A highlighted
            bar fills and borders in its highlight colour.${v.barBorderOpenBase===!0?" Open at base leaves the border off the edge on the baseline, so a bar hanging below zero leaves its top open.":" Open at base leaves the border off the edge on the baseline."}${v.coloring==="bands"?" Each band can set its own fill and border below.":""}</div>
          </div>`:h`
          <div class="fgroup">
          ${ae("Curve",v.curve??"straight",Mk,R=>S(G=>{R==="straight"?delete G.curve:G.curve=R}),{titles:{straight:"A straight line from each reading to the next",smooth:"A smooth line that never rises past the highest reading or dips under the lowest",step:"Each reading holds flat until the next one, the way a state does"},def:u.curve??"straight"})}
          ${un(e)}
          </div>
          ${v.style==="area"?h`
            <div class="fgroup">
            ${ae("Fill",wn(v.fillStyle),Rk,R=>S(G=>{R==="flat"?delete G.fillStyle:G.fillStyle=R}),{titles:{flat:"One even wash under the line",fade:"Strongest at the top of the plot, fading to clear at the baseline"},def:wn(u.fillStyle)})}
            ${mn.fill===void 0?m:lc(mn.fill,v.fillColorHex,R=>S(G=>{R===void 0?delete G.fillColorHex:G.fillColorHex=R},"fillcol"))}
            ${un(e)}
            </div>`:m}`}
        <div class="fgroup">
        <div class="grid2">
          ${ae("Scale",v.scale,Ak,R=>S(G=>{G.scale=R}),{titles:{auto:"The plot stretches to fit the readings it has",fixed:"The plot always runs from Min to Max"},def:u.scale})}
          ${ae("Baseline",v.baseline,Lk,R=>S(G=>{G.baseline=R}),{def:u.baseline})}
        </div>
        ${Os.length===0?m:He("Same scale as",Mr?v.scaleFrom:"",[["","Its own"],...Os.map(R=>[R.payload.id,Ae(R,ru)])],R=>S(G=>{R?G.scaleFrom=R:delete G.scaleFrom}),{def:""})}
        ${Mr?h`<div class="hint keep">This chart is drawn against that one's range, so the two read as one
              plot. Give them the same frame and each keeps its own readings, colour, style and
              numbers. Scale, Min and Max above are ignored while a chart is picked here.</div>`:m}
        ${!Mr&&v.scale==="fixed"?h`<div class="grid2">
              ${ee("Min",v.minValue,R=>S(G=>{G.minValue=R??0},"cmin"),{def:u.minValue})}
              ${ee("Max",v.maxValue,R=>S(G=>{G.maxValue=R??100},"cmax"),{def:u.maxValue})}
            </div>`:m}
        <div class="hint">${v.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        </div>
        <div class="field"><span>Series</span>
          <div class="row-acts">
            <button class="small" title="Add a second chart layer on this frame, drawn against this chart's range"
              @click=${()=>{let R;e.update(G=>{R=Mp(G,a,he=>Ae(he,ru))}),R&&e.selectLayer(R)}}>${P("plus")}<span>Add a second series</span></button>
          </div>
        </div>
        <div class="fgroup">
        ${ae("Colour",v.coloring,gc,R=>S(G=>{G.coloring=R,R==="bands"&&G.bands.length===0&&(G.bands=$s(Et))}),{def:u.coloring})}
        ${mn.main===void 0?m:b(mn.main)}
        ${v.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${v.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${Cs(v,v.colorSlot.baseColorHex,S,Et,v.style==="bars"?{...v.fillColorHex===void 0?{}:{fillHex:v.fillColorHex},...v.barBorderColorHex===void 0?{}:{borderHex:v.barBorderColorHex},border:v.barBorderWidth!==void 0}:void 0)}
          ${v.style==="area"?h`${Re("Band fill",v.fillBands,R=>S(G=>{G.fillBands=R}),u.fillBands)}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:m}`:m}
        </div>`;let Gs=(R,G)=>Ke(R,a).filter(he=>he.payload.chartAnchor?.at===G&&he.payload.chartAnchor.place==="through"),ou=(R,G)=>Ke(R,a).some(he=>he.payload.chartAnchor?.at===G),su={threshold:R=>Gs(R,"threshold"),now:R=>Gs(R,"now"),zero:R=>Gs(R,"zero"),times:R=>An(R,a),dots:R=>ci(R,a),grid:R=>ui(R,a)},ky={threshold:R=>{ou(R,"threshold")?ei(R,a,"threshold"):mp(R,a,v.thresholdValue??Cc(Et))},now:R=>{ou(R,"now")?ei(R,a,"now"):gp(R,a,!0)},zero:R=>{jl(R,a)},times:R=>{di(R,a)},dots:R=>{Wl(R,a)},grid:R=>{Kl(R,a)}},Li={};si(v)||(Li.times=ot&&se?"Clock times need evenly spaced readings. Set Points to Average.":"Clock times need a recorded span. Set Draw to Recorded history."),v.style==="bars"&&(Li.dots="Dots need a line or area chart. Set Style to Line or Area.");let Bs=R=>su[R](e.config).length>0;x={};for(let[R,G]of Object.entries(Li))x[`draw:${R}`]=G;let $y=([R,G])=>{let he=Bs(R),Rr=he?void 0:Li[R],Vs=`draw:${R}`;return h`<div class="xr-row" role="row" data-extra=${Vs}>
          <span role="cell"><span class="xr-name">${G}</span></span>
          <span role="cell"></span>
          <span role="cell"><button type="button" class="xtog ${he?"on":""}" role="switch" aria-checked=${he?"true":"false"}
            aria-label=${G} ?disabled=${Rr!==void 0} data-extra=${Vs}
            title=${Rc(Vs,Rr??(he?`Remove the ${G.toLowerCase()} from this chart`:`Add ${G.toLowerCase()} to this chart`))}
            @click=${()=>e.update(Us=>{if(he)for(let Cy of su[R](Us))ke(Us,Cy.payload.id);else ky[R](Us)})}>${he?h`<span aria-hidden="true">✓</span>`:P("plus")}</button></span>
          <span role="cell"></span>
        </div>`};y=h`
        <div class="field list-field"><span>On the plot</span>
          <div class="xreadings" role="table" aria-label="On the plot" @pointerover=${oa} @focusin=${oa}>
            <div class="xr-row xr-head" role="row">
              <span role="columnheader"><span class="xr-name">Layer</span></span><span role="columnheader"></span>
              <span role="columnheader">Show</span><span role="columnheader"></span>
            </div>
            ${us.map($y)}
          </div>
        </div>
        ${us.filter(([R])=>Li[R]!==void 0&&!Bs(R)).map(([R])=>h`<div class="hint keep">${Li[R]}</div>`)}
        ${Bs("zero")&&!vy?h`<div class="hint warn">These readings never cross zero, so the zero line is not drawn.</div>`:m}
        ${un(e)}`;break}case"timeline":{let v=n.payload,S=(Ce,Xe)=>s(ot=>Ce(ot.payload),Xe),E=u.historyMinutes,_=v.value.kind.kind==="entityState",O=Qe(v),J=O===void 0?void 0:e.historySeries(O),se=kt(v)*60,me=Xa(J??"",Rn),Ze=yc(a,v.historyMinutes),fn=v.value.kind.kind==="entityState"?v.value.kind.entityId:void 0,Ue=Ok(me,se,fn===void 0?void 0:e.hass.states[fn]?.state,fn?.split(".")[0]);k=h`
        ${pe(e,v.value,Ce=>S(Xe=>{Xe.value=Ce},"value"),{label:"States",noShare:!0,key:`${o}-value`})}
        ${_?m:h`<div class="hint warn">A timeline draws an entity's recorded
          past, so it needs one named above. A typed-in value, a template or a shared value has no
          past to read, and this layer stays blank until States names an entity.</div>`}
        <div class="fgroup">
        ${uc(a,v.historyMinutes,E,Ce=>S(Xe=>{Xe.historyMinutes=Ce}))}
        ${Ze?pc(v.historyMinutes,Ce=>S(Xe=>{Xe.historyMinutes=Ce},"span")):m}
        <div class="hint">Every state the recorder holds in that span, oldest at the left, each run as
          wide as the time it lasted. At most ${Rn} changes are drawn, and a
          busier span keeps its newest.</div>
        ${_&&J===void 0?h`<div class="hint keep">Reading the history…</div>`:m}
        ${_&&J===""?h`<div class="hint warn">Nothing recorded for this entity in that span. Either it is
            excluded from the recorder, or it has not been seen in that long.</div>`:m}
        </div>
        ${me.length>0?h`<div class="field readout"><span>Reads</span><span class="readout-v"><span class="nums">${v$(me,se)}</span></span></div>`:m}
        ${w$(me)?h`<div class="hint warn">This entity reports numbers, so every reading is its own
            state and the strip is one colour with a hairline wherever it dropped out. A timeline is
            for states that are words, like on and off, open and closed, home and away. For a
            number's past, use a Chart layer instead.</div>`:m}`,C=h`
        <div class="hint">Each row is a state and the colour its runs draw in, checked top to bottom.
          Case and surrounding space are ignored, so <code>Home</code> matches <code>home</code>. A
          state no row names takes the colour underneath.</div>
        ${Gk(v,S,Ue,`wa-tl-states-${o.replace(/[^a-z0-9]/gi,"")}`)}
        ${Ue.length>2?h`<div class="hint keep">Seen in this span: <span class="nums">${Ue.filter(Ce=>Ce!=="unavailable"&&Ce!=="unknown").join(", ")}</span>. Click into a State box to pick one.</div>`:m}
        <div class="grid2">
          ${ee("Gap",v.gap,Ce=>S(Xe=>{Xe.gap=Math.min(go,Math.max(0,Ce??0))},"tgap"),{step:.5,min:0,max:go,def:u.gap,unit:"pt"})}
          ${ee("Corner radius",v.cornerRadius,Ce=>S(Xe=>{Xe.cornerRadius=Math.max(0,Ce??0)},"tradius"),{step:.5,min:0,def:u.cornerRadius,unit:"pt"})}
        </div>
        <div class="hint">A gap is taken off the right of each run, so the strip still ends flush with
          the frame and the newest state keeps the edge. 0 draws one continuous bar, which is what a
          door or a light usually wants.</div>
`;break}case"shape":k=h`<div class="grid2">
          ${ae("Shape",n.payload.kind,[["roundedRectangle","Rounded"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"],["line","Line"]],v=>s(S=>{S.payload.kind=v}),{titles:{roundedRectangle:"Rounded rectangle",line:"A rule along the frame's long side"},def:u.kind})}
          ${n.payload.kind==="roundedRectangle"?ee("Corner radius",n.payload.cornerRadius,v=>s(S=>{S.payload.cornerRadius=v??6},"radius"),{step:.5,min:0,def:u.cornerRadius,unit:"pt"}):m}
        </div>
        ${n.payload.kind==="line"?x$(t,d,c):m}`,C=n.payload.kind==="line"?ee("Thickness",n.payload.thickness,v=>s(S=>{S.payload.thickness=v??1},"thick"),{step:.5,min:.5,def:u.thickness,unit:"pt"}):h`
        <div class="fgroup">
        ${ws("Gradient",n.payload.fill,v=>s(S=>{let E=S.payload;if(v===void 0){delete E.fill;return}E.fill=v,E.colorSlot.baseColorHex=At(v,0)},"fill"),()=>({kind:"linear",stops:[{at:0,colorHex:n.payload.colorSlot.baseColorHex},{at:1,colorHex:n.payload.colorSlot.baseColorHex}]}))}
        ${we("Border colour",n.payload.borderColorHex,v=>s(S=>{v===void 0?delete S.payload.borderColorHex:S.payload.borderColorHex=v},"border"),!0,null)}
        ${n.payload.borderColorHex!==void 0?ee("Border width",n.payload.borderWidth,v=>s(S=>{S.payload.borderWidth=v??1},"bw"),{step:.5,min:0,def:u.borderWidth,unit:"pt"}):m}
        </div>`;break;case"image":{let v=n.payload,S=(J,se)=>s(me=>J(me.payload),se),E=v.entity.entityId?e.hass.states[v.entity.entityId]?.attributes?.entity_picture:void 0,_=typeof E=="string"?E:void 0,O=_!==void 0&&!_.startsWith("/");k=h`
        ${ae("Source",v.source,[["camera","Camera"],["entityPicture","Entity picture"]],J=>S(se=>{se.source=J}),{titles:{camera:"A snapshot from a camera entity",entityPicture:"The picture an entity already carries: a person's photo, cover art, a weather icon"},def:u.source})}
        ${v.source==="camera"?h`
            ${v.entity.entityId&&!v.entity.entityId.startsWith("camera.")?h`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera. Switch the source to Entity picture to use this entity's own photo.</div>`:m}
            <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`:h`
            ${v.entity.entityId&&_===void 0?h`<div class="hint warn">This entity has no picture right now, so the layer stays blank. Anything with an <code>entity_picture</code> works: a person, a media player playing something with cover art, a weather entity.</div>`:m}
            ${O?h`<div class="hint warn">This picture is hosted outside Home Assistant, so the watch cannot fetch it.</div>`:m}
            <div class="hint">The watch fetches the entity's own picture on refresh and shows the cached copy in between. This preview shows it live.</div>`}`,C=h`
        <div class="fgroup">
        ${ae("Picture",v.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],J=>S(se=>{se.contentMode=J}),{titles:{fill:"Cover the frame, cropping what does not fit",fit:"Show the whole picture, with space around it"},def:u.contentMode})}
        ${Vt("Zoom",v.zoom,J=>S(se=>{se.zoom=J},"zoom"),{min:Ld,max:4,step:.05,def:1,format:J=>`${J.toFixed(2)}x`,unit:"x"})}
        ${Vt("Pan left/right",v.panX,J=>S(se=>{se.panX=J},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${Vt("Pan up/down",v.panY,J=>S(se=>{se.panY=J},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class=${v.contentMode==="fit"&&v.zoom===1?"hint keep":"hint"}>${m$(v)}</div>
        </div>
        ${ee("Corner radius",v.cornerRadius,J=>S(se=>{se.cornerRadius=Math.max(0,J??Gi)},"imgradius"),{step:1,min:0,def:Gi,unit:"pt"})}`;break}case"tap":{k=h`
        ${Mc(e,n.payload,(v,S)=>s(E=>v(E.payload),S),o)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}case"chartTimes":{let v=n.payload,S=(J,se)=>s(me=>J(me.payload),se),E=e.config.elements.find(J=>J.payload.id===v.chart),_=E?.kind==="chart"||E?.kind==="timeline"?E:void 0,O=_?.kind==="timeline"?"timeline":"chart";k=h`
        <div class="field readout"><span>${_?.kind==="timeline"?"Timeline":"Chart"}</span><span class="readout-v">${_?h`<button class="small" title=${`Select that ${O}`} @click=${()=>e.selectLayer(_.payload.id)}>${Ae(_,ve(e))}</button>`:"None"}</span></div>
        ${_===void 0?h`<div class="hint warn">The chart or timeline these times belonged to is gone, so this layer draws nothing.</div>`:_.kind==="timeline"?Qe(_.payload)===void 0?h`<div class="hint warn">That timeline names no entity yet, so it has no span to label and
                  this layer draws nothing.</div>`:m:si(_.payload)?m:h`<div class="hint warn">That chart has no evenly spaced span to label, so this layer draws
                  nothing. Clock times are drawn when its Draw is Recorded history with Points on Average,
                  or Long-term statistics.</div>`}
        <div class="hint">The clock times of that ${O}'s span, spread across this layer's width and centred
          in its height. Move and size it like any other layer.</div>`,C=T$(v,S,u,"ct",h`
        <div class="hint">Evenly spaced from the start of the ${O}'s span to now. Auto follows the watch's
          own clock and drops the minutes past a three hour span.</div>`);break}case"imageTime":{let v=n.payload,S=e.config.elements.find(_=>_.payload.id===v.image),E=S?.kind==="image"?S:void 0;k=h`
        <div class="field readout"><span>Picture</span><span class="readout-v">${E?h`<button class="small" title="Select that picture" @click=${()=>e.selectLayer(E.payload.id)}>${Ae(E,ve(e))}</button>`:"None"}</span></div>
        ${E===void 0?h`<div class="hint warn">The picture this time belonged to is gone, so this layer draws nothing.</div>`:m}
        <div class="hint">The time that picture was fetched, not the time now: a picture that stops updating
          keeps its old time, so a stale one reads as stale. The watch shows nothing here until the picture
          has been fetched once. Move and size it like any other layer: the chip grows to fill the frame.</div>`;break}case"chartDots":{let v=n.payload,S=(se,me)=>s(Ze=>se(Ze.payload),me),E=e.config.elements.find(se=>se.payload.id===v.chart),_=E?.kind==="chart"?E:void 0,O=_===void 0?void 0:Oe(e.config,t,_).size??_.payload.lineWidth,J=O===void 0?void 0:Math.round(O*18)/10;k=h`
        ${zm(e,_)}
        ${_===void 0?h`<div class="hint warn">The chart these dots belonged to is gone, so this layer draws nothing.</div>`:_.payload.style==="bars"?h`<div class="hint warn">That chart draws bars, so this layer draws nothing. Dots are drawn on a
                line or area chart.</div>`:m}
        <div class="hint">This layer always sits on its chart: it draws in the chart's box whatever its own frame
          says, with a dot on each reading the chart draws.</div>
        ${un(e)}`,C=h`
        ${ae("Dots",v.dots,eg,se=>S(me=>{me.dots=se}),{titles:{auto:"A dot on every reading while they sit far enough apart to tell apart, none on a crowded chart",all:"A dot on every reading"},def:"auto"})}
        <div class="grid2">
          ${ee("Dot size",v.size??J,se=>S(me=>{let Ze=Ft(se);Ze===void 0||Ze===J?delete me.size:me.size=Ze},"dotsize"),{step:.5,min:1,max:12,...J===void 0?{}:{def:J},unit:"pt"})}
          ${vc("Dot colour",v.colorHex,"Series colour",se=>S(me=>{se===void 0?delete me.colorHex:me.colorHex=se},"dotcol"))}
        </div>
        <div class="hint">Auto leaves the dots off once the readings sit too close to tell apart. Left alone, a dot
          is a little wider than the chart's line and takes the colour the series has at its reading.</div>`;break}case"chartGrid":{let v=n.payload,S=(O,J)=>s(se=>O(se.payload),J),E=e.config.elements.find(O=>O.payload.id===v.chart),_=E?.kind==="chart"?E:void 0;k=h`
        ${zm(e,_)}
        ${_===void 0?h`<div class="hint warn">The chart these grid lines belonged to is gone, so this layer draws nothing.</div>`:m}
        <div class="hint">This layer always sits on its chart: it draws across the chart's plot whatever its own
          frame says. Where it sits in Layers decides whether the lines are behind the series or in front.</div>
        ${un(e)}`,C=h`
        <div class="grid2">
          ${ee("Lines",v.lines,O=>S(J=>{J.lines=ii(O??Sn)},"lines"),{step:1,min:1,max:4,def:Sn})}
          ${ee("Thickness",v.thickness,O=>S(J=>{J.thickness=ai(O??Cn)},"thick"),{step:.25,min:Yr,max:Xr,def:Cn,unit:"pt"})}
        </div>
        ${we("Colour",v.colorHex,O=>S(J=>{J.colorHex=O??Zt},"gridcol"),!1,Zt)}
        <div class="hint">Equal rows across the plot, never on its top or bottom edge.</div>`;break}}let M=g||Ei(n)===void 0?void 0:b(n.kind==="shape"?"Fill colour":n.kind==="text"&&vt(n.payload)?"Layer colour":"Colour"),D=n.kind!=="tap"&&e.config.supportedFamilies.some(Dt)?J$(n.payload.accentGroup??"primary",v=>s(S=>{v==="accent"?S.payload.accentGroup="accent":delete S.payload.accentGroup},"accent-group")):void 0,I=Xl(e.config,n),T=I?{kind:{kind:"entityState",...I}}:void 0,F=n.kind==="text"&&(n.payload.parts?.length??0)>0?n.payload.parts:void 0,N=q$[n.kind],j=n.kind==="tap"?Pm[n.kind]:[...Pm[n.kind],...Y$],B=cc(n.payload,u,N),W=n.kind==="text"?"fontSize":n.kind==="icon"?"size":n.kind==="gauge"||n.kind==="chart"?"lineWidth":void 0,ne=e.config.perFamily[t]?.placements[a]?.size!==void 0,X=cc(n.payload,u,j)||W!==void 0&&l.size!==void 0&&l.size!==u[W],z=Hn(e.config,a),K=(v,S)=>()=>s(E=>ms(E.payload,u,v),S),Y=h`<section class="sec name-sec" data-open="true" style=${`--c:${oe.place}`}>
    <div class="sec-h pinned">
      <span class="swatch">${P("text")}</span>
      <h4>Name${kr(n.payload.name===void 0?void 0:{atDefault:!1,title:"Go back to the automatic title",reset:()=>s(v=>{delete v.payload.name},"reset-name")})}</h4>
      <input type="text" aria-label="Layer name" .value=${n.payload.name??""} placeholder=${$g(n,ve(e))}
        @input=${Ee(v=>s(S=>{let E=o0(v);E===void 0?delete S.payload.name:S.payload.name=E},"name"))} />
    </div>
  </section>`;return h`
    ${Y}
    ${Me(e,"content","Content",h`${n.kind==="tap"||n.kind==="text"||n.kind==="chartTimes"||n.kind==="chartDots"||n.kind==="chartGrid"||n.kind==="imageTime"?m:yg(e,n,o)}${k}`,{color:oe.content,icon:"content",summary:Ec(e,n),...B?{reset:()=>s(v=>{ms(v.payload,u,N),v.kind==="text"&&sr(v.payload.rules)},"reset-content")}:{}})}
    ${C===void 0&&M===void 0&&D===void 0&&n.kind==="tap"?m:Me(e,"look",n.kind==="image"?"Picture":"Look",h`${C??m}${M??m}${D??m}${n.kind==="tap"?m:X$(n,s)}`,{color:oe.look,icon:n.kind==="image"?"image":"look",...Ss(n)?{summary:Ss(n)}:{},...X?{reset:()=>e.update(v=>{ms(v.elements[r].payload,u,j),ne&&Fe(v,t,a,{},!0)})}:{}})}
    ${n.kind==="chart"?Me(e,"numbers","Extras",n0(e,n,y,x,$),{color:oe.numbers,icon:"text",summary:t0(e,n),...z.length>0||Ke(e.config,a).length>0||An(e.config,a).length>0||ci(e.config,a).length>0||ui(e.config,a).length>0||cc(n.payload,u,Om)?{reset:()=>e.update(v=>{for(let E of Hn(v,a))ke(v,E.payload.id);for(let E of Ke(v,a))ke(v,E.payload.id);for(let E of An(v,a))ke(v,E.payload.id);for(let E of ci(v,a))ke(v,E.payload.id);for(let E of ui(v,a))ke(v,E.payload.id);let S=v.elements.find(E=>E.payload.id===a);S&&ms(S.payload,u,Om)})}:{}}):m}
    ${n.kind==="timeline"||n.kind==="image"?j$(e,n):m}
    ${Me(e,"states","States",Hg(e,n.payload.rules,n.kind,v=>v.elements.find(S=>S.payload.id===a)?.payload.rules,`rules-${a}`,T,F),{color:oe.states,icon:"states",summary:nr(n.payload.rules).replace(/\.$/,""),...n.payload.rules.length>0?{reset:()=>s(v=>{v.payload.rules=[]})}:{}})}
    ${i.placement===!1?m:C$(e,n,t)}
    ${i.tap===!1?m:S$(e,n)}`}function j$(e,n){let t=n.payload.id,i=n.kind==="timeline",a=i?An(e.config,t):Bl(e.config,t),r=i?"Clock times":"Timestamp",o=e.activeFamily,s=()=>e.update(p=>{let f=p.elements.find(b=>b.payload.id===t);if(!f)return;let g=f.payload.frame;f.payload.frame={...Oe(p,o,f).frame},i?di(p,t):Ul(p,t,ce[o==="inline"?"rectangular":o]),f.payload.frame=g}),l=a.length>0,d=a.map(p=>({el:p,lead:P("clock"),title:r,kind:i?"Times":"Timestamp"})),c=i?"timeline:times":"image:time",u=h`
    ${kg(i?"timeline":"image")}
    <div class="field list-field"><span>Draw</span>
      <div class="adders" @pointerover=${oa} @focusin=${oa}>
        <button class="small ${l?"on":""}" ?disabled=${l} aria-pressed=${l?"true":"false"} data-extra=${c}
          title=${Rc(c,l?`${r} is on this ${i?"timeline":"picture"}. Remove it in the list below.`:`Add ${r.toLowerCase()}`)}
          @click=${s}>${l?h`<span aria-hidden="true">✓</span>`:P("plus")}<span>${r}</span></button>
      </div>
    </div>
    <div class="hint">${i?"Adds the clock times of this timeline's span as their own layer in its group, so you can drag them anywhere and give them any size or colour.":"Adds the time the picture was fetched as its own layer in its group, so you can drag it anywhere, inside the picture or beside it."}</div>
    ${l?h`
      ${Hc(e,d,{icon:"close",danger:!0,label:p=>`Delete this ${p}`,run:p=>e.update(f=>ke(f,p))})}
      <div class="hint">Click the row to open its main settings here. More settings selects that layer. The ×
        deletes it, and Undo brings it back.</div>`:m}`;return Me(e,"numbers","Extras",u,{color:oe.numbers,icon:"clock",summary:l?`${r} layer`:"None yet",...l?{reset:()=>e.update(p=>{for(let f of a)ke(p,f.payload.id)})}:{}})}var q$={text:["value","countdown","parts"],icon:["symbol","path"],gauge:["value","minValue","maxValue","total","minSource","maxSource"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","limit","takeFromEnd"],timeline:["value","historyMinutes"],shape:["kind","cornerRadius"],image:["entity","source"],tap:["action","openPageName"],chartTimes:[],chartDots:[],chartGrid:[],imageTime:[]},Y$=["opacity","shadow"];function X$(e,n){let t=e.payload,i=t.shadow,a=(o,s)=>n(l=>{let d={...l.payload.shadow??zi};o(d),l.payload.shadow=d},s),r=e.kind==="text"&&i!==void 0&&i.dx===0&&i.dy===0&&i.radius>0&&e.payload.fontSize<10;return h`
    <div class="fgroup">
    ${Vt("Opacity",t.opacity??1,o=>n(s=>{let l=La(o);l===1?delete s.payload.opacity:s.payload.opacity=l},"opacity"),{min:0,max:1,step:.05,def:1,format:o=>`${Math.round(o*100)}%`})}
    ${Re("Shadow",i!==void 0,o=>n(s=>{o?s.payload.shadow={...zi}:delete s.payload.shadow},"shadow-on"),!1)}
    ${i===void 0?m:h`
      ${we("Shadow colour",i.colorHex,o=>a(s=>{s.colorHex=o??Aa},"shcol"),!1,Aa)}
      ${Vt("Blur",i.radius,o=>a(s=>{s.radius=vl(o)},"shrad"),{min:0,max:wl,step:.5,def:zi.radius,unit:"pt"})}
      <div class="grid2">
        ${ee("Offset X",i.dx,o=>a(s=>{s.dx=va(o??0)},"shdx"),{step:.5,min:-Qn,max:Qn,def:zi.dx,unit:"pt"})}
        ${ee("Offset Y",i.dy,o=>a(s=>{s.dy=va(o??0)},"shdy"),{step:.5,min:-Qn,max:Qn,def:zi.dy,unit:"pt"})}
      </div>
      <div class="hint">Both offsets at zero makes a glow. On a tinted face the shadow takes the tint, like every other colour.</div>
      ${r?h`<div class="hint warn">A glow under text this small reads as a smudge on the watch.</div>`:m}`}
    </div>`}function J$(e,n){return h`${ae("Tinted group",e,[["primary","Default"],["accent","Accent"]],t=>n(t),{def:"primary"})}
    <div class="hint">On a tinted Home Screen the accent group takes the lighter of the two colours. Full colour is unchanged.</div>`}var Pm={text:["fontSize","fontWeight","colorSlot","alignment","lineLimit","monospacedDigits","arc","fontDesign","fontWidth","italic","minimumScale","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex"],icon:["size","colorSlot"],gauge:["style","lineWidth","trackColorHex","colorSlot","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","fill","ticks","labels"],chart:["style","scale","minValue","maxValue","baseline","barGap","lineWidth","coloring","bands","bandAboveColorHex","fillBands","curve","fillStyle","fillColorHex","areaFill","barRadius","barCorners","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","scaleFrom","colorSlot"],timeline:["bands","otherColorHex","gap","cornerRadius"],shape:["colorSlot","borderColorHex","borderWidth","thickness","fill"],image:["contentMode","zoom","panX","panY","cornerRadius"],tap:[],chartTimes:["timeLabelCount","labelSize","labelColorHex","hourCycle","minutes"],chartDots:["dots","size","colorHex"],chartGrid:["lines","colorHex","thickness"],imageTime:[]};function Z$(e,n){let t=e.ticks??kl(),i=e.labels??$l(),a=(o,s)=>n(l=>{let d={...l.ticks??kl()};o(d),so(d)?delete l.ticks:l.ticks=d},s),r=(o,s)=>n(l=>{let d={...l.labels??$l()};o(d),lo(d)?delete l.labels:l.labels=d},s);return h`
    <div class="fgroup">
    <div class="grid2">
      ${ee("Marks",t.count,o=>a(s=>{s.count=Math.max(0,Math.min(io,Math.round(o??0)))},"tickn"),{step:1,min:0,max:io,def:0})}
      ${t.count>0?ee("Mark length",t.length,o=>a(s=>{s.length=Math.max(1,Math.min(ao,o??tn))},"ticklen"),{step:.5,min:1,max:ao,def:tn,unit:"pt"}):m}
    </div>
    ${t.count>0?h`
      ${we("Mark colour",t.colorHex,o=>a(s=>{s.colorHex=o??en},"tickcol"),!1,en)}
      ${ee("Long every",t.majorEvery,o=>a(s=>{s.majorEvery=Math.max(0,Math.round(o??0))},"tickmaj"),{step:1,min:0,def:0})}
      <div class="hint">Marks are spread across the scale. Long every 5 draws every fifth one
        half as long again, which is what makes a dial countable. 0 draws them all the same.</div>`:m}
    </div>
    <div class="fgroup">
    ${Re("End numbers",i.show,o=>r(s=>{s.show=o},"lblshow"),!1)}
    ${i.show?h`
      <div class="grid2">
        ${ee("Text size",i.size,o=>r(s=>{s.size=Math.max(ro,Math.min(oo,o??an))},"lblsize"),{step:.5,min:ro,max:oo,def:an,unit:"pt"})}
        ${we("Text colour",i.colorHex,o=>r(s=>{s.colorHex=o??nn},"lblcol"),!1,nn)}
      </div>
      <div class="hint">Min and max at the two ends of the scale${e.style==="needle"?", and the reading itself under the pointer":""}.</div>`:m}
    </div>`}function zm(e,n){return h`<div class="field readout"><span>Chart</span><span class="readout-v">${n?h`<button class="small" title="Select that chart" @click=${()=>e.selectLayer(n.payload.id)}>${Ae(n,ve(e))}</button>`:"None"}</span></div>`}var Om=["highlight","highColorHex","lowColorHex","marker","highMarker","lowMarker","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes"];function Mc(e,n,t,i){let a=n.action;return h`
    ${He("Tap action",a.type,i$,r=>t(o=>{o.action=lg(r,o.action),r!=="openPage"&&(delete o.openPageId,delete o.openPageName)}))}
    ${"entityId"in a?Ut(e,"Target",a,r=>t(o=>{o.action={type:a.type,...r}},"tap-entity"),`${i}-tap`):m}
    ${a.type==="callService"?dg(e,a,(r,o)=>t(s=>{s.action=r},o),`${i}-tap`):m}
    ${a.type==="openPage"?ug(e,n.openPageId,n.openPageName,(r,o)=>t(s=>{if(r===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=r,o?s.openPageName=o:delete s.openPageName},"tap-page")):m}`}var Q$=24;function e0(e,n){let t=[],i=1/0;for(let r of de){if(!e.config.supportedFamilies.includes(r))continue;let o=Ep(e.config,n,r);o&&(t.push(`${te(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(t.length===0)return m;let a=i<Q$;return h`<div class="field readout"><span>Tap size</span><span class="readout-v">${t.join(" \xB7 ")}</span></div>
    ${a?h`<div class="hint warn">That is small for a wrist. Show the tap area and drag its corners out.</div>`:m}`}function t0(e,n){let t=n.payload,i=Hn(e.config,t.id),a=Ke(e.config,t.id),r=An(e.config,t.id),o=ci(e.config,t.id),s=ui(e.config,t.id);if(i.length===0&&a.length===0&&r.length===0&&o.length===0&&s.length===0)return"None yet";let l=[...i.map(d=>{let c=d.payload.value.kind;return c.kind==="chartStat"?(Rt.find(([u])=>u===c.stat)?.[1]??"number").toLowerCase():"number"})];for(let d of a){let{at:c,place:u}=d.payload.chartAnchor,p=(Ht.find(([f])=>f===c)?.[1]??"reading").toLowerCase();l.push(u==="through"?`${p} line`:`${p} marker`)}for(let d of r)l.push("times layer");for(let d of o)l.push("dots layer");for(let d of s)l.push("grid layer");return l.join(" \xB7 ")}function n0(e,n,t,i={},a=[]){let r=n.payload.id,o=ve(e),s=Hn(e.config,r),l=An(e.config,r),d=ci(e.config,r),c=ui(e.config,r),u=Ke(e.config,r),p={};for(let[T]of Rt){let F=e.resolve({kind:{kind:"chartStat",layer:r,stat:T}});F!==void 0&&F.trim()!==""&&(p[T]=F)}let f=a.filter(T=>Number.isFinite(T)),g=n.payload.nowIndex===void 0?NaN:Number(e.resolve(n.payload.nowIndex)),b=Number.isFinite(g)&&a.length>0?Math.min(a.length-1,Math.max(0,Math.round(g))):void 0,y=b===void 0||!Number.isFinite(a[b])||f.length===0?void 0:Da(a[b],Math.max(...f)-Math.min(...f)),x={values:a,texts:p,...b===void 0?{}:{now:b},...n.payload.thresholdValue===void 0?{}:{threshold:n.payload.thresholdValue}},$=(T,F)=>Hn(T,r).filter(N=>N.payload.value.kind.kind==="chartStat"&&N.payload.value.kind.stat===F),k=(T,F)=>Ke(T,r).filter(N=>N.payload.chartAnchor?.at===F&&N.payload.chartAnchor.place!=="through"),C=(T,F,N,j,B,W,ne)=>h`
    <button type="button" class="xtog ${F>0?"on":""}" role="switch" aria-checked=${F>0?"true":"false"}
      aria-label=${B} data-extra=${T}
      title=${Rc(T,F===0?N:F===1?j:`${j}: all ${F} of them`)}
      @click=${()=>e.update(X=>{if(F>0)for(let z of ne(X))ke(X,z.payload.id);else W(X)})}>${F>0?h`<span aria-hidden="true">✓</span>`:P("plus")}</button>`,M=h`<div class="xreadings" role="table" aria-label="Readings" @pointerover=${oa} @focusin=${oa}>
    <div class="xr-row xr-head" role="row">
      <span role="columnheader"><span class="xr-name">Reading</span></span><span role="columnheader"></span>
      <span role="columnheader">Number</span><span role="columnheader">Marker</span>
    </div>
    ${ym.map(T=>{let F=T.stat!==void 0?p[T.stat]:y,N=T.stat===void 0?"":(Rt.find(([W])=>W===T.stat)?.[1]??T.label).toLowerCase(),j=T.marker==="now"?"the reading at now":`the ${(Ht.find(([W])=>W===T.marker)?.[1]??T.label).toLowerCase()}`,B=T.stat!==void 0?`number:${T.stat}`:T.marker!==void 0?`marker:${T.marker}`:void 0;return h`<div class="xr-row" role="row" data-extra=${B??m}>
        <span role="cell"><span class="xr-name">${T.label}</span></span>
        <span role="cell"><span class="xr-v nums">${F??""}</span></span>
        <span role="cell">${T.stat===void 0?m:C(`number:${T.stat}`,$(e.config,T.stat).length,`Print the ${N} as a number`,`Remove the ${N} number`,`${T.label} number`,W=>{up(W,r,T.stat)},W=>$(W,T.stat))}</span>
        <span role="cell">${T.marker===void 0?m:C(`marker:${T.marker}`,k(e.config,T.marker).length,`Put a marker over ${j}`,`Remove the marker over ${j}`,`${T.label} marker`,W=>{Gl(W,r,T.marker)},W=>k(W,T.marker))}</span>
      </div>`})}
  </div>`,D=[...s.map(T=>({el:T,lead:e.resolve(T.payload.value)??"--",title:Ae(T,o),kind:"Number"})),...u.map(T=>{let{at:F,place:N}=T.payload.chartAnchor,j=Ht.find(([W])=>W===F)?.[1]??"Reading";if(N==="through")return{el:T,lead:F==="now"?"\u2502":"\u2500",title:F==="zero"?"Zero":j,kind:"Line"};let B=T.kind==="text"?e.resolve(T.payload.value)??"\u25CF":T.kind==="icon"?r0(e.resolve(T.payload.symbol)):"\u25C6";return{el:T,lead:B,title:j,kind:"Marker"}}),...l.map(T=>({el:T,lead:P("clock"),title:"Clock times",kind:"Times"})),...d.map(T=>({el:T,lead:P("chartDots"),title:"Reading dots",kind:"Dots"})),...c.map(T=>({el:T,lead:P("chartGrid"),title:"Grid lines",kind:"Grid"}))],I=D.length;return h`
    <div class="hint keep">Each one you switch on is a layer in this chart's group.</div>
    ${kg("chart",i,n.payload.style==="bars",x)}
    ${t??m}
    <div class="field list-field"><span>Readings</span>${M}</div>
    <div class="hint">A number is a text layer that prints the reading. A marker is an icon over it, pushed down
      rather than off the chart when the bar is tall. Newest, Change and Total start with the entity's unit.</div>
    ${I===0?m:h`
      <div class="shown-head">On this chart <span class="shown-count">${I}</span></div>
      ${Hc(e,D,{icon:"close",danger:!0,label:T=>`Delete this ${T}`,run:T=>e.update(F=>ke(F,T))})}
      <div class="hint">Click a row to set its value, colour and size here. More settings selects that layer.
        On the preview, click right on a dot to pick the dots.</div>`}`}var yr,vg="wrist-assistant-extras-preview",Is=(()=>{try{return window.localStorage.getItem(vg)!=="off"}catch{return!0}})();function Gm(e,n){Is=e;try{window.localStorage.setItem(vg,e?"on":"off")}catch{}Te(n)}function oa(e){if(!Is)return;let n=e.target?.closest?.("[data-extra]")?.getAttribute("data-extra");!n||n===yr||(yr=n,Te(e.currentTarget))}function Rc(e,n){return Is?n:`${oc(e)} ${n}.`}function kg(e,n={},t=!1,i={}){if(!Is)return h`<button class="link xprev-show" @click=${l=>Gm(!0,l.currentTarget)}>
      ${P("show")}<span>Show preview</span></button>`;let a=e==="timeline"?"timeline:times":e==="image"?"image:time":void 0,r=yr!==void 0&&rc(yr)===e?yr:a,o=r===void 0?void 0:n[r],s=e==="image"?"picture":e;return h`<div class="xprev">
    <span class="well">${bm(e,r,t,i)}</span>
    <span class="xprev-t">
      <b>${r===void 0?"Preview":xm(r)}</b>
      <span>${r===void 0?`Point at a ${e==="chart"?"switch":"button"} below to see what it adds to the ${s}.`:oc(r)}</span>
      ${o?h`<span class="xprev-why">${o}</span>`:m}
    </span>
    <button class="icon xprev-hide" title="Hide the preview" aria-label="Hide the preview"
      @click=${l=>Gm(!1,l.currentTarget)}>${P("hide")}</button>
  </div>`}function Hc(e,n,t){return h`<div class="chart-numbers">${Xf(n,a=>a.el.payload.id,({el:a,lead:r,title:o,kind:s})=>{let l=a.payload.id,d=s.toLowerCase();return h`
    <div class="num-row">
      <details class="num-item"
        @pointerenter=${()=>e.peekLayer(l,!0)}
        @pointerleave=${()=>e.peekLayer(l,!1)}>
        <summary class="num-pick" title=${`Show the settings for this ${d}`}>
          <span class="num-lead">${r}</span>
          <span class="num-text"><span class="num-title">${o}</span><span class="num-kind">${s}</span></span>
          <span class="chev">${P("chevron")}</span>
        </summary>
        <div class="num-body">
          ${i0(e,a)}
          <div class="chips"><button class="small" title=${`Select this ${d} to see all of its settings`}
            @click=${()=>e.selectLayer(l)}><span>More settings</span></button></div>
        </div>
      </details>
      <button class="icon ${t.danger?"danger":""}" title=${t.label(d)} aria-label=${t.label(d)}
        @click=${()=>{e.peekLayer(l,!1),t.run(l)}}>${P(t.icon)}</button>
    </div>`})}</div>`}function i0(e,n){let t=n.payload.id,i=`quick-${t}`,a=e.activeFamily,r=(c,u)=>e.update(p=>{let f=p.elements.find(g=>g.payload.id===t);f&&c(f)},`${i}-${u}`),o=Le(n.kind).payload,s=Ei(n),l=s===void 0?m:we("Colour",s,c=>r(u=>{Ei(u)!==void 0&&(u.payload.colorSlot.baseColorHex=c??"#FFFFFF")},"colour"),!1,o.colorSlot?.baseColorHex??"#FFFFFF"),d=n.payload.chartAnchor;switch(n.kind){case"text":{let c=n.payload.value.kind;return h`
        ${c.kind==="chartStat"?He("Number",c.stat,[...Rt],u=>r(p=>{p.kind==="text"&&p.payload.value.kind.kind==="chartStat"&&(p.payload.value={...p.payload.value,kind:{...p.payload.value.kind,stat:u}})},"stat")):d||vt(n.payload)?m:pe(e,n.payload.value,u=>r(p=>{p.kind==="text"&&(p.payload.value=u)},"value"),{showResolved:!0,label:n.payload.countdown?"Until":"Text",key:`${i}-value`})}
        ${d&&d.place!=="through"?Bm(e,t,d,r):m}
        <div class="grid2">
          ${Bn(e,n,a,"Font size",{step:1,min:4,def:o.fontSize})}
          ${n.payload.countdown||vt(n.payload)?m:l}
        </div>`}case"icon":return h`
        ${d?Bm(e,t,d,r):pe(e,n.payload.symbol,c=>r(u=>{u.kind==="icon"&&(u.payload.symbol=c)},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${i}-symbol`,setSymbolPath:c=>r(u=>{u.kind==="icon"&&(c?u.payload.path=c:delete u.payload.path)},"symbol")})}
        <div class="grid2">
          ${Bn(e,n,a,"Icon size",{step:1,min:4,def:o.size})}
          ${l}
        </div>`;case"shape":return n.payload.kind!=="line"?h`
          <div class="grid2">
            ${n.payload.kind==="roundedRectangle"?ee("Corner radius",n.payload.cornerRadius,c=>r(u=>{u.kind==="shape"&&(u.payload.cornerRadius=c??6)},"radius"),{step:.5,min:0,def:o.cornerRadius,unit:"pt"}):m}
            ${l}
          </div>`:h`
        ${d?bg(e,d,i):m}
        <div class="grid2">
          ${ee("Thickness",n.payload.thickness,c=>r(u=>{u.kind==="shape"&&(u.payload.thickness=c??1)},"thick"),{step:.5,min:.5,def:o.thickness,unit:"pt"})}
          ${l}
        </div>`;case"gauge":{let c=n.payload;return h`
        ${pe(e,c.value,u=>r(p=>{p.kind==="gauge"&&(p.payload.value=u)},"value"),{showResolved:!0,label:"Reading",key:`${i}-value`})}
        <div class="grid2">
          ${c.style==="dots"?m:Bn(e,n,a,"Line width",{step:.5,min:.5,def:o.lineWidth})}
          ${l}
        </div>`}case"chart":{let c=n.payload;return h`
        ${pe(e,c.value,u=>r(p=>{p.kind==="chart"&&(p.payload.value=u)},"value"),{label:"Readings",noShare:!0,key:`${i}-value`})}
        ${ae("Style",c.style,tg,u=>r(p=>{p.kind==="chart"&&(p.payload.style=u)},"style"),{def:o.style})}
        <div class="grid2">
          ${c.style==="bars"?m:Bn(e,n,a,"Line width",{step:.5,min:.5,def:o.lineWidth})}
          ${l}
        </div>`}case"timeline":return h`
        ${pe(e,n.payload.value,c=>r(u=>{u.kind==="timeline"&&(u.payload.value=c)},"value"),{label:"States",noShare:!0,key:`${i}-value`})}`;case"image":{let c=n.payload;return h`
        ${ae("Source",c.source,[["camera","Camera"],["entityPicture","Entity picture"]],u=>r(p=>{p.kind==="image"&&(p.payload.source=u)},"source"),{def:o.source})}
        ${ae("Picture",c.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],u=>r(p=>{p.kind==="image"&&(p.payload.contentMode=u)},"mode"),{def:o.contentMode})}`}case"tap":return Mc(e,n.payload,(c,u)=>r(p=>{p.kind==="tap"&&c(p.payload)},u??"action"),i);case"chartTimes":{let c=n.payload;return h`
        ${Vt("Times",c.timeLabelCount,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.timeLabelCount=Math.max(0,Math.min(li,Math.round(u))))},"count"),{min:0,max:li,step:1,def:o.timeLabelCount,format:u=>u<=0?"None":String(Math.round(u)),range:!1})}
        <div class="grid2">
          ${ee("Time size",c.labelSize,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.labelSize=Math.min(Mn,Math.max(Fn,u??ct)))},"size"),{step:.5,min:Fn,max:Mn,def:o.labelSize,unit:"pt"})}
          ${we("Time colour",c.labelColorHex,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.labelColorHex=u??ut)},"colour"),!1,o.labelColorHex)}
        </div>`}case"imageTime":return h``;case"chartDots":{let c=n.payload,u=e.config.elements.find(g=>g.payload.id===c.chart),p=u?.kind==="chart"?Oe(e.config,a,u).size??u.payload.lineWidth:void 0,f=p===void 0?void 0:Math.round(p*18)/10;return h`
        ${ae("Dots",c.dots,eg,g=>r(b=>{b.kind==="chartDots"&&(b.payload.dots=g)},"mode"),{def:"auto"})}
        <div class="grid2">
          ${ee("Dot size",c.size??f,g=>r(b=>{if(b.kind!=="chartDots")return;let y=Ft(g);y===void 0||y===f?delete b.payload.size:b.payload.size=y},"size"),{step:.5,min:1,max:12,...f===void 0?{}:{def:f},unit:"pt"})}
          ${vc("Dot colour",c.colorHex,"Series colour",g=>r(b=>{b.kind==="chartDots"&&(g===void 0?delete b.payload.colorHex:b.payload.colorHex=g)},"colour"))}
        </div>`}case"chartGrid":{let c=n.payload;return h`
        <div class="grid2">
          ${ee("Lines",c.lines,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.lines=ii(u??Sn))},"lines"),{step:1,min:1,max:4,def:Sn})}
          ${ee("Thickness",c.thickness,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.thickness=ai(u??Cn))},"thick"),{step:.25,min:Yr,max:Xr,def:Cn,unit:"pt"})}
        </div>
        ${we("Colour",c.colorHex,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.colorHex=u??Zt)},"colour"),!1,Zt)}`}default:return h`${l}`}}function Bm(e,n,t,i){let a=Ht.filter(([r])=>Qt(r)||r===t.at);return h`
    <div class="grid2">
      ${He("Reading",t.at,a,r=>i(o=>{o.payload.chartAnchor&&(o.payload.chartAnchor.at=r)},"at"))}
      ${He("Sits",t.place,Zr.filter(([r])=>r!=="through"),r=>i(o=>{o.payload.chartAnchor&&(o.payload.chartAnchor.place=r)},"place"))}
    </div>`}function a0(e,n,t){if(n.kind==="tap")return m;let i=n.payload.id,a=et(e.config,i)[0],r=(s,l)=>e.update(d=>{let c=d.elements.find(u=>u.kind==="tap"&&u.payload.attachedTo===i);c&&s(c.payload)},l?`${t}-${l}`:void 0),o=Jl(e.config,n);return h`
    ${Re("Tappable",a!==void 0,s=>e.update(l=>{s?Co(l,i):So(l,i)}))}
    ${a?h`<div class="value-editor">
          ${Mc(e,a.payload,r,`${t}-attached`)}
          <div class="field"><span>Tap area</span>
            <div class="chips">
              <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
                title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
                @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide":"Show"}</button>
              ${xo(a.payload.outset)?m:h`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                    @click=${()=>r(s=>{s.outset={...Dl}})}>${P("reset")}</button>`}
            </div>
          </div>
        </div>
        ${e0(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:h`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${on(o)}</b>.</div>`}`}function Vm(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function r0(e){return e===void 0?"\u25C6":e.includes("up")?"\u25B2":e.includes("down")?"\u25BC":e.startsWith("circle")?"\u25CF":"\u25C6"}function Ae(e,n){return e.payload.name?e.payload.name:$g(e,n)}function o0(e){let n=e.trim();return n===""?void 0:n}function $g(e,n){let t=e.payload.chartAnchor;if(t!==void 0){let i=Ht.find(([a])=>a===t.at)?.[1]??"Reading";return t.place==="through"?`${i} line`:`${i} marker`}switch(e.kind){case"text":return Vm(Ie(e.payload.value,n));case"icon":return Vm(Ie(e.payload.symbol,n));case"gauge":return Ie(e.payload.value,n);case"chart":return Ie(e.payload.value,n);case"timeline":return Ie(e.payload.value,n);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{let i=e.payload.entity;return i.displayName||i.entityId||(e.payload.source==="camera"?"camera":"picture")}case"tap":{let i=e.payload.action,a="entityId"in i?i.displayName||i.entityId:i.type==="callService"?[i.serviceDomain,i.serviceName].filter(r=>r!=="").join("."):i.type==="openPage"&&e.payload.openPageName||"";return a?`${i.type} \xB7 ${a}`:i.type}case"chartTimes":return"Clock times";case"chartDots":return"Reading dots";case"chartGrid":return"Grid lines";case"imageTime":return"Timestamp"}}function Cg(e,n){let t=mt(e.config,n.id),i=ve(e),a=(r,o)=>e.update(s=>{let l=s.groups?.find(d=>d.id===n.id);l&&r(l)},o?`group-${n.id}-${o}`:void 0);return Me(e,"content","Group",h`
    ${_e("Name",n.name,r=>a(o=>{o.name=r},"name"))}
    ${Re("Move as one",n.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${n.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. With the group selected, a drag still moves all of them. Lock it when the part is the way you want it."}</div>
    <div class="shown-head">Layers <span class="shown-count">${t.length}</span></div>
    ${Hc(e,t.map(r=>({el:r,lead:P(r.kind),title:Ae(r,i),kind:cn[r.kind]})),{icon:"ungroup",label:r=>`Take this ${r} out of the group`,run:r=>e.update(o=>Ga(o,r,void 0))})}
    <div class="row-acts">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>Wi(r,n.id))}>Ungroup</button>
    </div>
    <div class="hint">Click a row to open its main settings here. More settings selects that layer for the rest.
      The button beside a row takes that layer out of the group and keeps it on the face.</div>`,{color:oe.group,icon:"folder",summary:`${t.length} layers \xB7 ${n.locked?"moves as one":"unlocked"}`})}function Sg(e,n){if(n==="inline")return s0(e);let t=e.config.perFamily[n];if(!t)return h`<div class="hint">No settings stored for ${te(n)} yet.</div>
      <button class="small" @click=${()=>e.update(c=>{c.perFamily[n]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${te(n)} settings</button>`;let i=(c,u)=>e.update(p=>c(p.perFamily[n]),u?`fam-${n}-${u}`:void 0),a=As(e.config,n),r=Dt(n),o=t.backgroundColorHex?Be(t.backgroundColorHex):r?"the system's widget material":"transparent",s=t.borderColorHex?`${t.borderWidth} pt ${Be(t.borderColorHex)} border`:"no border",l=we(r?"Tile background (blank = the system's widget material)":"Background (blank = transparent)",t.backgroundColorHex,c=>i(u=>{c===void 0?delete u.backgroundColorHex:u.backgroundColorHex=c},"bg"),!0,null),d=ws("Background gradient",t.backgroundFill,c=>i(u=>{if(c===void 0){delete u.backgroundFill;return}u.backgroundFill=c,u.backgroundColorHex=At(c,0)},"bgfill"),()=>({kind:"linear",stops:[{at:0,colorHex:t.backgroundColorHex??"#000000"},{at:1,colorHex:t.backgroundColorHex??"#000000"}]}));return h`
    ${Me(e,"look",`${te(n)} shape`,h`
      ${r?m:h`${l}${d}`}
      <div class="fgroup">
      ${we("Border colour",t.borderColorHex,c=>i(u=>{c===void 0?delete u.borderColorHex:u.borderColorHex=c},"border"),!0,null)}
      ${ee("Border width",t.borderWidth,c=>i(u=>{u.borderWidth=c??2},"bw"),{step:.5,min:0,def:2,unit:"pt"})}
      </div>`,{color:oe.look,icon:"shape",summary:`${o} \xB7 ${s}`,...t.backgroundColorHex!==void 0||t.backgroundFill!==void 0||t.borderColorHex!==void 0||t.borderWidth!==2?{reset:()=>i(c=>{delete c.backgroundColorHex,delete c.backgroundFill,delete c.borderColorHex,c.borderWidth=2},"reset-look")}:{}})}
    ${r?Me(e,"home","Home Screen",h`
      ${l}
      ${d}
      <div class="hint">The tile is drawn edge to edge: this colour fills every point of it, and the design is laid out inside the ${te(n)} box.</div>
      <div class="hint keep">iOS 18 lets a user tint the whole Home Screen. The system then drops the background and draws the design in two tones, so check that it still reads without its colours.</div>
      ${_n(n)?h`<div class="hint keep">${te(n)} needs ${_n(n)}. An iPhone on an older version is not offered this size when adding a widget, and every other size still draws.</div>`:m}`,{color:oe.look,icon:"shape",summary:o,...t.backgroundColorHex!==void 0||t.backgroundFill!==void 0?{reset:()=>i(c=>{delete c.backgroundColorHex,delete c.backgroundFill},"reset-home")}:{}}):m}
    ${n==="corner"?Me(e,"corner","Corner content",l0(e,t,i),{color:oe.content,icon:"content",summary:t.curvedText?"Big curved text":"Layer canvas",...t.curvedText!==void 0||t.bezelText!==void 0||t.bezelGauge!==void 0?{reset:()=>i(c=>{delete c.curvedText,delete c.bezelText,delete c.bezelGauge},"reset-corner")}:{}}):m}
    ${Me(e,"states","Shape states",Hg(e,t.rules,"layout",c=>c.perFamily[n]?.rules,`rules-${n}`),{color:oe.states,icon:"states",summary:nr(t.rules).replace(/\.$/,""),...t.rules.length>0?{reset:()=>i(c=>{c.rules=[]},"reset-states")}:{}})}
    ${Me(e,"placements","Layers",h`
      <div class="hint keep">${a===0?`Nothing is on the ${te(n)} shape. The Layers card offers a copy of another shape's whole arrangement, or you can add layers here one at a time.`:`${a} layer${a===1?" is":"s are"} on the ${te(n)} shape. They belong to this shape alone: no other shape draws them, and editing one here cannot reach another shape.`}</div>`,{color:oe.position,icon:"place",summary:a===0?"Nothing on it":`${a} layer${a===1?"":"s"}`})}`}function s0(e){let n=e.config.inline;if(!n)return h`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let t=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=ve(e);return h`
    ${Me(e,"content","Inline text",h`
      ${_e("Label (blank = value only)",n.label??"",a=>t(r=>{a?r.label=a:delete r.label},"label"))}
      ${pe(e,n.value,a=>t(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${Fc(e,n.countdown===!0,n.value,a=>t(r=>{a?r.countdown=!0:delete r.countdown}))}`,{color:oe.content,icon:"text",summary:Ye(`${n.label?`${n.label}: `:""}${Ie(n.value,i)}`,48)})}
    ${Me(e,"symbol","Symbol",h`
      ${Qm(e,n.symbol??"",a=>t(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="field readout"><span>On the face</span><span class="readout-v">${n.symbol?`${n.symbol} `:""}${n.label?`${n.label}: `:""}${e.resolve(n.value)??"--"}</span></div>`,{color:oe.look,icon:"icon",summary:n.symbol||"None"})}`}function l0(e,n,t){let i=n.curvedText?"curved":"canvas",a=n.bezelGauge?"gauge":n.bezelText?"text":"none";return h`
    <div class="fgroup">
    ${ae("Main content",i,[["canvas","Layer canvas"],["curved","Big curved text"]],r=>t(o=>{r==="curved"?o.curvedText||(o.curvedText=U("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&n.curvedText?h`
      ${pe(e,n.curvedText,r=>t(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${we("Curved text colour",n.curvedColorHex??"#FFFFFF",r=>t(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:m}
    </div>
    <div class="fgroup">
    ${ae("Bezel",a,[["none","None"],["text","Text label"],["gauge","Gauge arc"]],r=>t(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=U("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:U("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&n.bezelText?h`
      ${pe(e,n.bezelText,r=>t(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${Fc(e,n.bezelCountdown===!0,n.bezelText,r=>t(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:m}
    ${a==="gauge"&&n.bezelGauge?d0(e,n.bezelGauge,t):m}
    </div>`}function d0(e,n,t){let i=[n.colorHexes[0]??"#34C759",n.colorHexes[1]??n.colorHexes[n.colorHexes.length-1]??"#FFCC00",n.colorHexes[n.colorHexes.length-1]??"#FF3B30"],a=r=>o=>t(s=>{let l=[...i];l[r]=o??l[r],s.bezelGauge.colorHexes=l},`gstop${r}`);return h`
    ${pe(e,n.value,r=>t(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${ee("Gauge min",n.minValue,r=>t(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${ee("Gauge max",n.maxValue,r=>t(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${we("Arc colour (min end)",i[0],a(0))}
    ${we("Arc colour (middle)",i[1],a(1))}
    ${we("Arc colour (max end)",i[2],a(2))}
    ${Re("End labels",!!(n.minLabel||n.maxLabel),r=>t(o=>{let s=o.bezelGauge;r?(s.minLabel=U(String(s.minValue)),s.maxLabel=U(String(s.maxValue))):(delete s.minLabel,delete s.maxLabel)}))}
    ${n.minLabel?pe(e,n.minLabel,r=>t(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):m}
    ${n.maxLabel?pe(e,n.maxLabel,r=>t(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):m}`}var mT=de.map(e=>[e,te(e)]),Ac={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setFontDesign:"Set typeface",setFontWidth:"Set width",setItalic:"Set italic",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},c0=Object.keys(Ac),Ts=["color","text","fontSize","fontWeight","fontDesign","fontWidth","italic","visibility"];function u0(e,n=!1){let t=Ua[e].filter(i=>!n||Ts.includes(i));return c0.filter(i=>t.includes(je[i]))}function Tg(e,n,t,i){let a=n!==void 0&&!e.some(r=>r.id===n);return h`<label class="field"><span>Changes</span>
      <select @change=${r=>i(r.target.value,r.target)}>
        ${G$(e,n,t).map(([r,o])=>h`<option value=${r} ?selected=${r===(n??"")}>${o}</option>`)}
      </select></label>
    ${a?h`<div class="hint warn">The part this changed has been removed, so it changes nothing. Pick another part or Whole text.</div>`:m}`}var p0={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function gs(e,n){if(e.entityId==="")return"(no entity)";let t=e.displayName.trim();if(t!==""&&t!==e.entityId)return t;let i=n?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function Ye(e,n){let t=e.replace(/\s+/g," ").trim();return t.length>n?`${t.slice(0,n-1)}\u2026`:t}function Eg(e){if(!e||Ve(e))return"";let n=[];return e.decimals!==void 0&&n.push(`${e.decimals} dp`),e.multiply!==void 0&&n.push(`\xD7${e.multiply}`),e.offset!==void 0&&n.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&n.push(`"${e.prefix}" first`),e.suffix&&n.push(`"${e.suffix}" after`),e.useEntityUnit&&n.push("with unit"),e.relativeTime&&n.push("as relative time"),e.duration&&n.push("as a duration"),e.textCase&&n.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),n.length===0?"":` (${n.join(", ")})`}function Ie(e,n){return`${Tr(e,n)}${Eg(e.format)}`}function Tr(e,n){let t=e.kind;switch(t.kind){case"literal":return t.value?`"${Ye(t.value,40)}"`:"(empty)";case"entityState":return gs(t,n);case"entityAttribute":return t.attribute?`${gs(t,n)} \xB7 ${t.attribute}`:gs(t,n);case"entityAge":return`age of ${gs(t,n)}`;case"aggregate":return h0(t.aggregate);case"time":return p0[t.timeField];case"dataAge":return"data age";case"jinja":return t.value?`template ${Ye(t.value,32)}`:"template (empty)";case"named":return t.id===""?"(no value chosen)":n?.values?.find(a=>a.id===t.id)?.name?.trim()||`named ${t.id.slice(0,8)}`;case"chartStat":{let i=(Rt.find(([o])=>o===t.stat)?.[1]??t.stat).toLowerCase();if(t.layer==="")return`${i} (no chart chosen)`;let a=n?.elements?.find(o=>o.kind==="chart"&&o.payload.id===t.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?Tr(a.payload.value,n):"a missing chart";return`${i} of ${r}`}}}function h0(e){let n=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${n}`}function vr(e,n,t){if(t<0||t>=e.length)return;let[i]=e.splice(n,1);e.splice(t,0,i)}function f0(e,n,t,i,a,r){let o=(s,l)=>e.update(d=>{let c=i(d);c&&s(c)},l?`${a}-${l}`:void 0);return h`
    ${n.length===0?h`<div class="hint keep">No rules yet. A rule checks values and changes how this ${t==="layout"?"family":"layer"} looks.</div>`:m}
    ${n.map((s,l)=>m0(e,s,l,n.length,t,o,`${a}-${s.id}`,r))}
    <div class="adders"><button class="small" @click=${()=>o(s=>{s.push(Wa())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function m0(e,n,t,i,a,r,o,s){let l=e.liveBranch(n),d=e.forced.get(n.id)??"live",c=f=>d==="live"?f==="live":d==="otherwise"?f==="otherwise":d.caseId===f,u=(f,g)=>r(b=>{let y=b.find(x=>x.id===n.id);y&&f(y)},g),p=s!==void 0&&n.partId!==void 0;return h`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${t+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(f=>vr(f,t,t-1))}>${P("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i-1} @click=${()=>r(f=>vr(f,t,t+1))}>${P("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(f=>{let g=f.findIndex(b=>b.id===n.id);g>=0&&f.splice(g,1)})}>${P("delete")}</button>
    </div>
    ${s===void 0?m:Tg(s,n.partId,ve(e),f=>u(g=>{f?g.partId=f:delete g.partId}))}
    <div class="field"><span>Preview</span>
      <div class="branches">
        <button class=${c("live")?"active":""} @click=${()=>e.setForced(n.id,"live")}>Live</button>
        ${n.cases.map((f,g)=>h`<button class="${c(f.id)?"active":""} ${l===f.id?"live-match":""}" @click=${()=>e.setForced(n.id,{caseId:f.id})}>Case ${g+1}</button>`)}
        ${n.otherwise?h`<button class="${c("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(n.id,"otherwise")}>Otherwise</button>`:m}
      </div>
    </div>
    ${n.cases.map((f,g)=>g0(e,f,g,n,a,u,`${o}-${f.id}`,p))}
    <div class="adders"><button class="small" @click=${()=>u(f=>{f.cases.push(od())})}>+ case</button></div>
    ${Re("Otherwise",n.otherwise!==void 0,f=>u(g=>{f?g.otherwise=g.otherwise??[]:delete g.otherwise}))}
    ${n.otherwise?h`<div class="case-box otherwise">
          <div class="hint keep">${l==="otherwise"?h`<b>Active now.</b> `:m}Changes when no case matches:</div>
          ${Fg(e,n.otherwise,a,f=>u(g=>{g.otherwise&&f(g.otherwise)}),`${o}-otherwise`,p)}
        </div>`:m}
  </div>`}function g0(e,n,t,i,a,r,o,s=!1){let l=(c,u)=>r(p=>{let f=p.cases.find(g=>g.id===n.id);f&&c(f)},u),d=e.liveBranch(i)===n.id;return h`<div class="case-box ${d?"match":""}">
    <div class="rule-head">
      <span>Case ${t+1}${d?h` <span class="ok">· active now</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(c=>vr(c.cases,t,t-1))}>${P("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i.cases.length-1} @click=${()=>r(c=>vr(c.cases,t,t+1))}>${P("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(c=>{let u=c.cases.findIndex(p=>p.id===n.id);u>=0&&c.cases.splice(u,1)})}>${P("delete")}</button>
    </div>
    <div class="row-inline">
      ${ae("When",n.when.join,[["all","All of these are true"],["any","Any of these is true"]],c=>l(u=>{u.when.join=c}))}
    </div>
    ${n.when.tests.length===0?h`<div class="hint keep">No tests: this case always matches.</div>`:m}
    ${n.when.tests.map((c,u)=>y0(e,c,u,p=>l(f=>{let g=f.when.tests.find(b=>b.id===c.id);g&&p(g)}),()=>l(p=>{p.when.tests=p.when.tests.filter(f=>f.id!==c.id)}),`${o}-${c.id}`))}
    <div class="adders">
      <button class="small" @click=${()=>l(c=>{c.when.tests.push(rd())})}>+ test</button>
      <select class="adder" @change=${c=>{let u=c.target,p=u.value;if(u.value="",!p)return;let f=fm(p,dm(e.hass?.states));l(g=>{g.when.tests.push(...f)})}}>
        <option value="">+ preset…</option>
        ${pm.map(c=>h`<option value=${c.kind} title=${c.hint}>${c.label}</option>`)}
      </select>
    </div>
    <div class="hint keep" style="margin-top:8px">Then:</div>
    ${Fg(e,n.then,a,c=>l(u=>c(u.then)),`${o}-then`,s)}
  </div>`}function y0(e,n,t,i,a,r){let o=(u,p)=>i(u,p?`${r}-${p}`:void 0),s=n.comparison,l=hi(s.kind),d=e.evaluateTest(n),c=m;switch(l){case"value":c=pe(e,s.value??U(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":c=h`${pe(e,s.value??U(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${pe(e,s.upper??U(""),u=>o(p=>{p.comparison.upper=u},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":c=h`${_e("Pattern",s.pattern??"",u=>o(p=>{p.comparison.pattern=u},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${s.pattern&&!b0(s.pattern)?h`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:m}`;break;case"times":c=h`<div class="row-inline">
          ${Um(e,"From",s.value??U("22:00"),u=>o(p=>{p.comparison.value=u},"rhs"),`${r}-rhs`)}
          ${Um(e,"To",s.upper??U("06:00"),u=>o(p=>{p.comparison.upper=u},"upper"),`${r}-upper`)}
        </div>
        <div class="hint">The start is included and the end is not. An end earlier than the start wraps midnight, so 22:00 to 06:00 is the night. Equal times match nothing.</div>`;break;case"options":c=x0(n.value)?w0(s.options??[],u=>o(p=>{p.comparison.options=nc(u)},"options")):_e("Options (comma separated)",(s.options??[]).join(", "),u=>o(p=>{p.comparison.options=u.split(",").map(f=>f.trim()).filter(Boolean)},"options"));break;case"none":break}return h`<div class="test-box">
    <div class="rule-head">
      <span>Test ${t+1} <span class=${d?"ok":"no"}>${d?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${P("delete")}</button>
    </div>
    ${s.kind==="isStale"?h`<div class="hint keep">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:pe(e,n.value,u=>o(p=>{p.value=u},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${He("Comparison",s.kind,Pp.map(u=>[u,ta[u]]),u=>o(p=>{p.comparison=sd(p.comparison,u)}))}
    ${c}
  </div>`}function b0(e){try{return new RegExp(e),!0}catch{return!1}}function Um(e,n,t,i,a){if(t.kind.kind!=="literal")return pe(e,t,i,{showResolved:!0,label:n,key:a});let r=t.kind.value,o=pi(r)??"";return h`<label class="field"><span>${n}</span>
    <input type="time" .value=${o}
      @input=${Ee(s=>i({...t,kind:{kind:"literal",value:s}}))} />
    ${r!==""&&o===""?h`<div class="hint warn">"${r}" is not a 24-hour HH:MM time. The test stays false until it is.</div>`:m}</label>`}function x0(e){return e.kind.kind==="time"&&e.kind.timeField==="weekday"}function w0(e,n){let t=um(e),i=a=>n(t.includes(a)?t.filter(r=>r!==a):[...t,a]);return h`<div class="field seg-field"><span>Days</span>
    <div class="seg wide" role="group" aria-label="Days">
      ${cm.map((a,r)=>h`<button type="button" role="checkbox" aria-checked=${t.includes(r)?"true":"false"}
        class=${t.includes(r)?"on":""} @click=${()=>i(r)}>${a}</button>`)}
    </div></div>`}function Fg(e,n,t,i,a,r=!1){let o=u0(t,r);return h`
    ${n.length===0?h`<div class="hint keep">No changes.</div>`:m}
    ${n.map((s,l)=>v0(e,s,l,t,(d,c)=>i(u=>{u[l]&&d(u[l])},c?`${a}-${l}-${c}`:void 0),()=>i(d=>{d.splice(l,1)}),`${a}-${l}`,r))}
    <select class="adder" @change=${s=>{let l=s.target,d=l.value;l.value="",d&&i(c=>{c.push(fi(d))})}}>
      <option value="">+ change…</option>
      ${o.map(s=>h`<option value=${s}>${Ac[s]}</option>`)}
    </select>`}var Mg=["setColor","setBorderColor","setBackgroundColor"];function v0(e,n,t,i,a,r,o,s=!1){let l=!Ua[i].includes(je[n.kind]),d=s&&!l&&!Ts.includes(je[n.kind]);return h`<div class="change-box">
    <div class="rule-head">
      <span>${Ac[n.kind]}${l?h` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:d?h` <span class="no">(ignored by a part)</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${P("delete")}</button>
    </div>
    ${d?h`<div class="hint keep">A part only takes colour, text, size, weight, hide and show. Pick Whole text to use this change.</div>`:m}
    ${Rg(e,n,a,o)}
  </div>`}function Rg(e,n,t,i){let a=Eo(n.kind),r=m;if(a==="value"){let o=n.value??U("");if(Mg.includes(n.kind)){let s=o.kind.kind==="literal";r=h`${s?we("Colour",o.kind.kind==="literal"?o.kind.value:"",l=>t(d=>{d.value=U(l??"#FFFFFF")},"color")):pe(e,o,l=>t(d=>{d.value=l},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>t(l=>{l.value=s?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:U("#FFFFFF")})}>${s?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${s?m:h`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=pe(e,o,s=>t(l=>{l.value=s},"value"),{noFormat:n.kind==="setIcon",symbol:n.kind==="setIcon",showResolved:!0,label:n.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=n.kind==="setOpacity"?{step:.05,min:0,max:1}:n.kind==="setRotation"?{step:1,unit:"\xB0"}:n.kind==="setFontSize"||n.kind==="setBorderWidth"?{step:.5,min:0,unit:"pt"}:{step:.5,min:0},s=n.kind==="setOpacity"?"Opacity (0 to 1)":n.kind==="setRotation"?"Angle":n.kind==="setFontSize"?"Size":n.kind==="setBorderWidth"?"Width":"Value";r=ee(s,n.number??0,l=>t(d=>{d.number=l??0},"number"),o)}else a==="weight"?r=ae("Weight",n.weight??"regular",ra,o=>t(s=>{s.weight=o})):a==="design"?r=h`${ae("Typeface",n.design??"default",br,o=>t(s=>{s.design=o}))}
      ${Tc}`:a==="width"?r=h`${ae("Width",n.width??"standard",xr,o=>t(s=>{s.width=o}))}
      ${Sc}`:a==="italic"&&(r=Re("Italic",n.italic!==!1,o=>t(s=>{s.italic=o})));return r}var xc=new Set,ys=new Map,bs=new Map,xs=new Set,Wm=new Map;function Hg(e,n,t,i,a,r,o){let s=qd(n);return!s.ok||xc.has(a)?h`
      <div class="states-switch">
        <button class="link" ?disabled=${!s.ok} title=${s.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${d=>{xc.delete(a),Te(d.target)}}>Show as table</button>
        ${s.ok?m:h`<span class="hint keep">${s.reason}</span>`}
      </div>
      ${f0(e,n,t,i,a,o)}`:k0(e,s.table,n[0],t,i,a,r,o)}function k0(e,n,t,i,a,r,o,s){let l=(E,_)=>e.update(O=>{let J=a(O);J&&E(J)},_?`${r}-${_}`:void 0),d=n.value??Wm.get(r)??o,c=n.rows.length===0,u=n.numberMode||c&&d!==void 0&&!Of(d)&&$0(e.resolve(d)),p=Ua[i],f=ys.get(r)??new Set,g=n.columns.length===0&&f.size===0?[zf[i]]:[],b=Rf(n.columns,[...f,...g.filter(E=>E!==void 0)],p),y=hr.get(r),x=t?t.partId:s?.some(E=>E.id===y)?y:void 0,$=s!==void 0&&x!==void 0,k=$?p.filter(E=>Ts.includes(E)):p,C=$?b.filter(E=>!Ts.includes(E)):[],M=(E,_)=>{if(!t){E?hr.set(r,E):hr.delete(r),Te(_);return}l(O=>{let J=O[0];J&&(E?J.partId=E:delete J.partId)})},D=t?e.liveBranch(t):"none",I=t?e.forced.get(t.id)??"live":"live",T=E=>I!=="live"&&(I==="otherwise"?E==="otherwise":I.caseId===E),F=E=>{t&&e.setForced(t.id,T(E)?"live":E==="otherwise"?"otherwise":{caseId:E})},N=E=>{Wm.set(r,E),n.rows.length!==0&&l(_=>Nf(_,E),"lhs")},j=()=>{hr.delete(r),l(E=>{If(E,d??U(""),u),x!==void 0&&E[0]&&E[0].partId===void 0&&(E[0].partId=x)})},B=n.rows.map((E,_)=>jm(e,{key:`${r}-${E.caseId}`,label:Pf(E.comparison,O=>Ie(O,ve(e))),columns:b,changes:E.changes,live:D===E.caseId,forced:T(E.caseId),onForce:()=>F(E.caseId),when:F0(e,E.comparison,`${r}-${E.caseId}`,(O,J)=>l(se=>{let me=se[0]?.cases.find(Ze=>Ze.id===E.caseId)?.when.tests[0];me&&O(me.comparison)},J&&`${E.caseId}-${J}`)),updChanges:(O,J)=>l(se=>{let me=se[0]?.cases.find(Ze=>Ze.id===E.caseId);me&&O(me.then)},J&&`${E.caseId}-${J}`),acts:h`
      <button class="icon" title="Move up" ?disabled=${_===0} @click=${()=>l(O=>Yd(O,_,_-1))}>${P("up")}</button>
      <button class="icon" title="Move down" ?disabled=${_===n.rows.length-1} @click=${()=>l(O=>Yd(O,_,_+1))}>${P("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(O=>_f(O,E.caseId))}>${P("delete")}</button>`})),W=n.otherwise===void 0?m:jm(e,{key:`${r}-otherwise`,label:"Otherwise",columns:b,changes:n.otherwise,live:D==="otherwise",forced:T("otherwise"),onForce:()=>F("otherwise"),when:h`<span class="when-otherwise">Otherwise</span>`,updChanges:(E,_)=>l(O=>{let J=O[0]?.otherwise;J&&E(J)},_),acts:h`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(E=>Xd(E,!1))}>${P("close")}</button>`}),ne=bs.get(r),X=C0.filter(E=>k.includes(E)&&!b.includes(E)),z=sm(d),K={icon:k.includes("icon"),color:k.includes("color")},Y=z&&(K.icon||K.color)?rm(z.domain,gg(e,z.entityId)):[],v=n.rows.length>0||n.otherwise!==void 0,S=()=>{xs.delete(r),hr.delete(r),l(E=>{let _=as(d??U(""),om(Y,K),void 0,E[0]?.id);x!==void 0&&(_.partId=x),E.length=0,E.push(_)},"fill")};return h`
    <div class="states">
      ${pe(e,d??U(""),N,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${d===void 0?h`<div class="hint keep">Choose what these states look at.</div>`:m}
      ${s===void 0?m:Tg(s,x,ve(e),M)}
      <div class="states-scroll"><table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${b.map(E=>h`<th>
              <span>${Pt[E]}</span>
              <button class="icon" title=${`Remove the ${Pt[E]} column`}
                @click=${_=>{bs.set(r,E),Te(_.target)}}>${P("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${B}
          ${W}
          ${n.rows.length===0&&n.otherwise===void 0?h`<tr><td class="empty-row" colspan=${b.length+2}>${Hf(i)}</td></tr>`:m}
        </tbody>
      </table></div>
      ${C.length===0?m:h`<div class="hint warn">A part ignores ${Ls(C.map(E=>Pt[E]))}. Pick Whole text to use ${C.length===1?"it":"them"}.</div>`}
      ${ne===void 0?m:h`<div class="hint warn confirm-row">
        Remove the ${Pt[ne]} column? Its ${Km(n,ne)} value${Km(n,ne)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${E=>{bs.delete(r),ys.get(r)?.delete(ne),Te(E.target),l(_=>Df(_,ne))}}>Remove</button>
        <button class="small" @click=${E=>{bs.delete(r),Te(E.target)}}>Cancel</button>
      </div>`}
      ${xs.has(r)?h`<div class="hint warn confirm-row">
        Fill from the entity? The ${n.rows.length} state${n.rows.length===1?"":"s"} in this table ${n.rows.length===1?"is":"are"} replaced by one row per state a ${z?.domain.replace(/_/g," ")} reports.
        <button class="danger small" @click=${E=>{Te(E.target),S()}}>Fill</button>
        <button class="small" @click=${E=>{xs.delete(r),Te(E.target)}}>Cancel</button>
      </div>`:m}
      <div class="states-add">
        <button class="small" title="Add a row to the table: a value to match under When, and the look it gets" @click=${j}>${P("plus")}<span>Add a state</span></button>
        <span class="states-add-note">${ir(i).state}</span>
        ${Y.length===0?m:h`<button class="small" title=${`Write one row per state a ${z.domain.replace(/_/g," ")} reports, each with an icon and a colour`}
          @click=${E=>{if(v){xs.add(r),Te(E.target);return}S()}}>${P("plus")}<span>Fill from the entity</span></button>
        <span class="states-add-note">${ir(i).fill}</span>`}
        ${n.otherwise===void 0?h`<button class="small" title="Add an Otherwise row at the bottom of the table" @click=${()=>l(E=>Xd(E,!0))}>${P("plus")}<span>Add otherwise</span></button>
            <span class="states-add-note">${ir(i).otherwise}</span>`:m}
        ${X.length===0?m:h`<select class="chip-add" title="Add a column to the table" aria-label="Change another setting" @change=${E=>{let _=E.target,O=_.value;if(_.value="",!O)return;let J=ys.get(r)??new Set;J.add(O),ys.set(r,J),Te(_)}}>
          <option value="" selected>Change another setting…</option>
          ${X.map(E=>h`<option value=${E}>${Pt[E]}</option>`)}
        </select>
        <span class="states-add-note">${ir(i).column}</span>`}
      </div>
      ${I==="live"?m:h`<div class="field"><span>Preview</span>
        <div class="row-acts"><button class="small" @click=${()=>t&&e.setForced(t.id,"live")}>Back to live</button></div>
      </div>`}
      <div class="hint">${u?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${E=>{xc.add(r),Te(E.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function $0(e){let n=(e??"").trim();return n!==""&&Number.isFinite(Number(n))}var C0=["icon","text","color","visibility","opacity","fontSize","fontWeight","fontDesign","fontWidth","italic","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function Km(e,n){let t=0;for(let i of e.rows)is(i.changes,n)&&(t+=1);return e.otherwise&&is(e.otherwise,n)&&(t+=1),t}function S0(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function jm(e,n){return h`<tr class="state-row ${n.live?"live":""} ${n.forced?"forced":""}"
    title=${`${n.label}. Click to hold the previews on this state.`}
    @click=${t=>{S0(t)||n.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${n.forced?"The previews are held on this state":n.live?"This state matches right now":""}>${n.forced?"\u25C9":n.live?"\u25CF":""}</span>
      ${n.when}
    </td>
    ${n.columns.map(t=>h`<td>${T0(e,t,n.changes,n.updChanges,`${n.key}-${t}`)}</td>`)}
    <td class="acts">${n.acts}</td>
  </tr>`}function T0(e,n,t,i,a){let r=is(t,n),o=Hs(a);if(!r)return h`<button type="button" class="cell empty" title=${`Set ${Pt[n]} for this state`}
      @click=${d=>{i(c=>{c.push(fi(Mf[n]))}),ig(d.target,o)}}>unchanged</button>`;let s=(d,c)=>i(u=>{let p=u.find(f=>je[f.kind]===n);p&&d(p)},c&&`${n}-${c}`),l=Pt[n];return h`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${l}. Click to change it.`}>${E0(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${l} @toggle=${ag}>
      <div class="pop-head">
        <b>${l}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${gr.has(o)?h`${n==="visibility"?ae("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],d=>s(c=>{c.kind=d})):Rg(e,r,s,a)}
          <button class="link" @click=${d=>{d.target.closest("[popover]")?.hidePopover(),i(c=>{let u=c.findIndex(p=>je[p.kind]===n);u>=0&&c.splice(u,1)})}}>Leave ${l.toLowerCase()} unchanged</button>`:m}
    </div>`}function E0(e,n){if(n.kind==="hide")return h`<span class="cell-word">Hidden</span>`;if(n.kind==="show")return h`<span class="cell-word">Shown</span>`;let t=Eo(n.kind);if(t==="number")return h`<span class="cell-word mono">${n.number??0}</span>`;if(t==="weight")return h`<span class="cell-word">${ra.find(([r])=>r===(n.weight??"regular"))?.[1]}</span>`;if(t==="design")return h`<span class="cell-word">${br.find(([r])=>r===(n.design??"default"))?.[1]}</span>`;if(t==="width")return h`<span class="cell-word">${xr.find(([r])=>r===(n.width??"standard"))?.[1]}</span>`;if(t==="italic")return h`<span class="cell-word">${n.italic===!1?"Upright":"Italic"}</span>`;let i=n.value??U(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(Mg.includes(n.kind))return h`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?Be(a):Ie(i,ve(e))}</span>`;if(n.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return h`${r??m}<span class="cell-word">${a}</span>`}return h`<span class="cell-word">${Ie(i,ve(e))}</span>`}function Be(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function F0(e,n,t,i){let a=hi(n.kind),r=jd(n.kind),o=(s,l,d,c)=>R0(e,s,l,`${t}-${d}`,r,c,d==="rhs"?"Compare with":"Upper bound");return h`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${Ee(s=>i(l=>{let d=sd(l,s);l.kind=d.kind,d.value!==void 0?l.value=d.value:delete l.value,d.upper!==void 0?l.upper=d.upper:delete l.upper}))}>
      ${Kd.map(s=>h`<option value=${s} ?selected=${s===n.kind}>${M0(s)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(n.value??U(""),s=>i(l=>{l.value=s},"rhs"),"rhs",r?"0":"value"):m}
    ${a==="between"?h`<span class="when-and">to</span>${o(n.upper??U(""),s=>i(l=>{l.upper=s},"upper"),"upper","100")}`:m}
  </span>`}function M0(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return ta[e]}}function R0(e,n,t,i,a,r,o){let s=Hs(i),l={showResolved:!0,label:o,key:i};if(n.kind.kind!=="literal")return h`<span class="rhs">
      ${pe(e,n,t,{...l,compact:!0})}
    </span>`;let d=n.kind.value;return h`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${d} placeholder=${r}
      @input=${Ee(c=>t({...n,kind:{kind:"literal",value:c}}))} />
    <button type="button" class="icon more" popovertarget=${s} title="Compare with an entity or a template instead">…</button>
    ${ng(e,s,o,n,t,l)}
  </span>`}var H0=/^[a-z0-9_]+\.shared_(\d+)$/;function Mi(e){return H0.test(e)}function A0(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function Ig(e,n){let i=(e.domain||n.split(".")[0]||"").toLowerCase().replace(/[^a-z0-9_]/g,"");return i===""?"entity":i}function _g(e,n){let t=new Map;for(let i of id(e,(a,r)=>n.has(r))){if(i.entityId==="")continue;let a=t.get(i.entityId);if(!a){let r=Ig(i.ref,i.entityId),o=t.size+1;a={placeholderId:`${r}.shared_${o}`,domain:r,label:`${A0(r.replace(/_/g," "))} ${o}`,originalId:i.entityId,where:[]},t.set(i.entityId,a)}a.where.includes(i.where)||a.where.push(i.where)}return[...t.values()]}function sa(e,n){let t=structuredClone(e),i=new Map,a=new Map;for(let r of n)i.set(r.originalId,{entityId:r.placeholderId,displayName:r.label,domain:r.domain}),a.set(r.originalId,r.placeholderId);nd(t,r=>{let o=i.get(r.entityId);return o?{...o}:void 0}),Yi(t,r=>Zl(r,a)),delete t.openPageId,delete t.openPageName,t.tapAction.type==="openPage"&&(t.tapAction={type:"none"});for(let r of t.elements)r.kind==="tap"&&(delete r.payload.openPageId,delete r.payload.openPageName,r.payload.action.type==="openPage"&&(r.payload.action={type:"none"}));return t.dataSources=[],t}function _s(e){let n=!1;return Ct(e,t=>{let i=t.kind;if(i.kind!=="aggregate")return;let a=i.aggregate.scope;a.kind==="filter"&&a.areaIds.length+a.labelIds.length+a.floorIds.length>0&&(n=!0)}),n}function L0(e,n="  "){let t=(i,a)=>{if(i===null||typeof i!="object")return JSON.stringify(i)??"null";let r=a+n;if(Array.isArray(i))return i.length===0?"[]":`[
${i.map(d=>r+t(d,r)).join(`,
`)}
${a}]`;let o=i,s=Object.keys(o).filter(d=>o[d]!==void 0).sort();return s.length===0?"{}":`{
${s.map(d=>`${r}${JSON.stringify(d)}: ${t(o[d],r)}`).join(`,
`)}
${a}}`};return t(e,"")}function la(e,n,t=[]){let i=n==="share"?sa(e,t):e,a=Vi(i);return delete a.id,delete a.slotIndex,n==="share"&&delete a.hidden,a.dataSources=[],`${L0(a)}
`}function Lc(e){let t=(e.name===""?"Complication":e.name).split(/[^\p{L}\p{N}]+/u).filter(i=>i!=="").join("-");return`${t===""?"Complication":t}.json`}var I0="There is nothing to read here. Paste a complication first.",_0="This is not valid JSON. Check for a missing brace or a stray comma.",N0="This is valid JSON but not a complication. A complication starts with { and ends with }.",D0="This does not look like a complication.",Ag="It was made by a newer panel, so update the Wrist Assistant integration before importing it.",P0="00000000-0000-4000-8000-000000000000";function z0(e){let n=/^([A-Za-z]+) is required$/.exec(e);return n?`It is missing "${n[1]}".`:e}function Ng(e,n){let t=e.trim();if(t==="")return{ok:!1,error:I0};let i;try{i=JSON.parse(t)}catch{return{ok:!1,error:_0}}if(typeof i!="object"||i===null||Array.isArray(i))return{ok:!1,error:N0};let a=i,r=a.schemaVersion;if(typeof r=="number"&&r>n)return{ok:!1,error:`This complication is schema v${r}; this panel understands up to v${n}. ${Ag}`};let o={...a,id:P0,slotIndex:0},s;try{s=Bi(o)}catch(d){let c=d instanceof ht||d instanceof Error?d.message:String(d);return{ok:!1,error:`${D0}

${z0(c)}`}}delete s.hidden;let l=wo(a);if(l.length>0){let d=l.slice(0,3).join(", "),c=l.length>3?`, and ${l.length-3} more`:"";return{ok:!1,error:`This complication uses keys this panel does not know: ${d}${c}. ${Ag}`}}return{ok:!0,config:s,raw:i}}function Ic(e,n){let t=new Set;for(let o of Object.keys(n)){let s=o.split(".")[0]??"";s!==""&&t.add(s)}let i=o=>Object.prototype.hasOwnProperty.call(n,o),a=new Map,r=id(e,(o,s)=>Mi(o)||t.has(s));for(let o of r){if(o.entityId==="")continue;let s=Mi(o.entityId);if(!s&&i(o.entityId))continue;let l=a.get(o.entityId);l||(l={entityId:o.entityId,domain:Ig(o.ref,o.entityId),label:o.ref.displayName||o.entityId,where:[],required:s},a.set(o.entityId,l)),l.label===o.entityId&&o.ref.displayName!==""&&(l.label=o.ref.displayName),l.where.includes(o.where)||l.where.push(o.where)}return[...a.values()]}function _c(e,n){let t=structuredClone(e);nd(t,a=>{let r=n.get(a.entityId);if(r)return{entityId:r.entityId,displayName:r.displayName,domain:r.domain||r.entityId.split(".")[0]||""}});let i=new Map;for(let[a,r]of n)i.set(a,r.entityId);return Yi(t,a=>Zl(a,i)),t}function Dg(e,n){let t=e.trim();if(t==="")return"";let i=a=>n.has(a.toLowerCase());if(!i(t))return t;for(let a=2;a<=99;a+=1){let r=`${t} ${a}`;if(!i(r))return r}return t}var Pg="import";function Lg(e){let n="";for(let t=0;t<e.length;t+=32768)n+=String.fromCharCode(...e.subarray(t,t+32768));return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function O0(e){if(!/^[A-Za-z0-9_-]*$/.test(e)||e.length%4===1)return;let n=e.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((e.length+3)%4);try{let t=atob(n),i=new Uint8Array(t.length);for(let a=0;a<t.length;a+=1)i[a]=t.charCodeAt(a);return i}catch{return}}async function zg(e,n){let t=new Blob([e]).stream().pipeThrough(n);return new Uint8Array(await new Response(t).arrayBuffer())}async function Og(e,n={}){let t=new TextEncoder().encode(e);if(n.compress!==!1&&typeof CompressionStream=="function")try{return`z${Lg(await zg(t,new CompressionStream("gzip")))}`}catch{}return`t${Lg(t)}`}async function Nc(e){let n=O0(e.slice(1));if(!n)return;let t=new TextDecoder("utf-8",{fatal:!0});try{if(e.startsWith("t"))return t.decode(n);if(e.startsWith("z")&&typeof DecompressionStream=="function")return t.decode(await zg(n,new DecompressionStream("gzip")))}catch{}}var Gg="https://wrist-assistant.com/import/";function Bg(e,n){return`${e.split("#")[0]??e}#${Pg}=${n}`}function Dc(e){let n=e.startsWith("#")?e.slice(1):e,t=`${Pg}=`;if(!n.startsWith(t))return;let i=n.slice(t.length);return i.length>1?i:void 0}function Vg(e){let n=e.trim();if(n===""||/\s/.test(n)||n.startsWith("{"))return;let t=n.indexOf("#");return t<0?void 0:Dc(n.slice(t))}var Pc="This share link is damaged or cut short. Ask for it again, or paste the text instead.";function zc(e){if(!e.parsed)return"Paste a complication first.";let n=e.name.trim();if(n==="")return"Give it a name first.";if(e.taken.has(n.toLowerCase()))return"A complication on this watch already has that name.";if(e.unchosen===1)return"One entity still needs choosing.";if(e.unchosen>1)return`${e.unchosen} entities still need choosing.`}var Er="https://wrist-assistant.com/api/gallery",G0=["rectangular","circular","corner","inline","small","medium","large","xlarge"],Oc=["weather","energy","climate","security","media","health","calendar","transport","lights","sensors","battery","other"],Gc={weather:"Weather",energy:"Energy",climate:"Climate",security:"Security",media:"Media",health:"Health",calendar:"Calendar",transport:"Transport",lights:"Lights",sensors:"Sensors",battery:"Battery",other:"Other"},fe={title:60,description:500,authorName:40,tags:5,slots:40,slotLabel:60,previews:8,shareTextBytes:64*1024,pngBytes:150*1024,bodyBytes:1024*1024},B0=/^[a-z0-9_]+\.shared_[0-9]+$/;function Ns(e,n={}){let t=structuredClone(e),i=(a,r)=>r===void 0||r.trim()===""?a:r.trim();t.name=i(t.name,n.name);for(let a of t.groups??[])a.name=i(a.name,n.groupNames?.get(a.id));for(let a of t.values)a.name=i(a.name,n.valueNames?.get(a.id));for(let a of t.elements){let r=n.layerNames?.get(a.payload.id);a.payload.name!==void 0&&r!==void 0&&(a.payload.name=i(a.payload.name,r))}return t}function Ug(e){return Oc.includes(e)}function Wg(e){return new TextEncoder().encode(e).length}function Bc(e,n,t,i={}){let a=[];for(let r of t.tags)Ug(r)&&!a.includes(r)&&a.push(r);return{shareText:la(Ns(e,{...i,name:t.title}),"share",n),title:t.title.trim(),description:t.description.trim(),authorName:t.authorName.trim(),tags:a,families:yt(e).filter(r=>G0.includes(r)),slots:n.map(r=>({id:r.placeholderId,label:r.label.trim()})),panelVersion:t.panelVersion}}var V0=new Set(["id","kind","type","join","domain","domains","entityId","displayName","supportedFamilies","perFamily","fontWeight","weight","fontDesign","design","fontWidth","width","alignment","style","cornerBodyShape","function","baseline","coloring","highlight","marker","highMarker","lowMarker","scale","at","place","barCorners","curve","smoothing","dots","fillStyle","stat","source","statType","statPeriod","hourCycle","minutes","timeField","timestampCorner","contentMode","symbol","path","serviceDomain","serviceName","attachedTo","layer","chart","image","scaleFrom","groupId","partId","areaIds","labelIds","floorIds"]),U0=/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/,W0=/^#[0-9A-Fa-f]{3,8}$/,K0=/^-?\d+(\.\d+)?$/;function Ri(e,n){if(n===void 0)return;let t=n.trim();t!==""&&!e.includes(t)&&e.push(t)}function Kg(e,n,t={}){let i=Ns(e,t),a=sa(i,n),r=[],o=[],s=[],l=[],d=[],c=[],u=new Set,p=[],f=[],g=[];for(let M of a.elements)Ri(r,M.payload.name);(a.groups??[]).forEach((M,D)=>{Ri(o,M.name),f.push({kind:"group",id:M.id,value:M.name,original:e.groups?.[D]?.name??M.name})}),a.values.forEach((M,D)=>{Ri(s,M.name),g.push({kind:"shared",id:M.id,value:M.name,original:e.values[D]?.name??M.name})});for(let M of n)Ri(l,M.label);let b=n.map(M=>({kind:"slot",id:M.placeholderId,value:M.label,original:M.label}));Ct(a,M=>{M.kind.kind==="jinja"&&Ri(d,M.kind.value)}),Yi(a,(M,D)=>(D.part==="serviceData"&&Ri(c,M),M));let y=M=>{M?.kind.kind==="literal"&&u.add(M.kind.value.trim())},x=M=>{for(let D of M){for(let I of D.cases)for(let T of I.then)T.kind==="setIcon"&&y(T.value);for(let I of D.otherwise??[])I.kind==="setIcon"&&y(I.value)}};for(let M of a.elements)M.kind==="icon"&&y(M.payload.symbol),x(M.payload.rules);for(let M of Object.values(a.perFamily))M&&x(M.rules);let $=new Set([a.name.trim(),...r,...o,...s,...l,...d,...c,...u]),k=(M,D)=>{if(typeof M=="string"){let I=M.trim();if(I===""||$.has(I)||V0.has(D)||D.endsWith("Hex")||U0.test(I)||W0.test(I)||K0.test(I)||Mi(I))return;Ri(p,I);return}if(Array.isArray(M)){for(let I of M)k(I,D);return}if(M!==null&&typeof M=="object")for(let[I,T]of Object.entries(M))k(T,I)};return k(JSON.parse(la(i,"share",n)),""),[{label:"Layer names",values:r},{label:"Group names",values:o,rows:f},{label:"Shared value names",values:s,rows:g},{label:"Slot labels",values:l,rows:b},{label:"Template text",values:d},{label:"Service data",values:c},{label:"Other text",values:p}].filter(M=>M.values.length>0)}function j0(e,n){let t=[];for(let i of e.matchAll(/[a-z0-9_]+(?:\.[a-z0-9_]+)+/g)){let a=i.index??0,r=a>0?e[a-1]:"",o=i[0].split(".");for(let s=0;s+1<o.length;s++){if(!n.has(o[s]))continue;let l=`${o[s]}.${o[s+1]}`,d=s++;if(Mi(l))continue;!(d===0&&(r==="'"||r==='"')&&o.length===2)&&!t.includes(l)&&t.push(l)}}return t}function jg(e,n,t,i,a={}){return Yg(e,n,t,i,a).map(r=>r.text)}function qg(e,n,t,i,a={}){let r={details:[],send:[]};for(let o of Yg(e,n,t,i,a))r[o.step].push(o.text);return r}function Yg(e,n,t,i,a){let r=[],o={push:p=>{r.push({step:"send",text:p})}},s=p=>{r.push({step:"details",text:p})},l=Bc(e,n,t,a);_s(e)&&o.push("It reads entities by area, label or floor. Those belong to your Home Assistant, so pick the entities themselves before sending it to the gallery."),l.title===""&&s("Give it a title."),l.title.length>fe.title&&s(`The title is longer than ${fe.title} characters.`),l.description.length>fe.description&&s(`The description is longer than ${fe.description} characters.`),l.authorName.length>fe.authorName&&s(`The nickname is longer than ${fe.authorName} characters.`),t.tags.length>fe.tags&&s(`Pick at most ${fe.tags} tags.`),t.tags.some(p=>!Ug(p))&&s("One of the tags is not a gallery tag."),l.families.length===0&&o.push("It has no shape the gallery can show."),l.slots.length>fe.slots&&o.push(`It reads ${l.slots.length} entities. The gallery takes at most ${fe.slots}.`);for(let p of l.slots)B0.test(p.id)||o.push(`The gallery cannot take the slot ${p.id}, because its domain has characters other than letters and underscores.`),p.label.length>fe.slotLabel&&o.push(`The label for ${p.id} is longer than ${fe.slotLabel} characters.`);let d=Wg(l.shareText);d>fe.shareTextBytes&&o.push(`It is too big for the gallery: its text is ${Math.ceil(d/1024)} KB and the limit is ${fe.shareTextBytes/1024} KB.`);let c=n.filter(p=>p.originalId!==""&&l.shareText.includes(p.originalId)),u=new Set;i&&Yi(sa(e,n),p=>{for(let f of j0(p,i))u.add(f);return p});for(let p of c)u.add(p.originalId);return u.size>0&&o.push(`Template or service data text names ${[...u].join(", ")} in a way sharing cannot replace. Write it in quotes, like states('sensor.example'), so it becomes a slot.`),r}var q0=["bad_json","too_large","invalid_field","schema_too_new","bad_png","rate_limited","not_found","not_updatable","forbidden","server_error"],Wt=class extends Error{constructor(t,i,a,r){super(a?`${t}: ${a}`:t);this.code=t;this.status=i;this.detail=a;this.retryAfter=r;this.name="GalleryError"}},Y0={shareText:"complication text",title:"title",description:"description",authorName:"nickname",tags:"tags",families:"shapes",slots:"slot labels",previews:"preview pictures",panelVersion:"panel version",replaces:"upload to update"};function Ds(e){if(!(e instanceof Wt))return"Something went wrong. Try again.";switch(e.code){case"rate_limited":return"That is as many uploads as the gallery takes in a day. Try again tomorrow.";case"too_large":return"It is too big for the gallery.";case"invalid_field":{let n=e.detail===void 0?void 0:Y0[e.detail.split(/[.[\s]/)[0]??""]??e.detail;return n===void 0?"The gallery did not accept one of the fields.":`The gallery did not accept the ${n}.`}case"schema_too_new":return"The gallery does not take complications made by this panel version yet.";case"bad_png":return"A preview picture could not be read. Close this and try again.";case"bad_json":return"The gallery could not read the upload. Update the Wrist Assistant integration and try again.";case"not_found":return"That upload is not in the gallery any more.";case"not_updatable":return"It has to be in the gallery before it can be updated. Wait for the review, then send the new version.";case"forbidden":return"The gallery did not accept this Home Assistant's key.";case"network":return"Could not reach the gallery. Check the connection and try again.";case"server_error":return"The gallery had a problem. Try again later."}}async function X0(e){let n="server_error",t;try{let a=await e.json();typeof a.error=="string"&&q0.includes(a.error)&&(n=a.error),typeof a.detail=="string"&&(t=a.detail)}catch{}e.status===429&&(n="rate_limited");let i=Number(e.headers.get("retry-after"));return new Wt(n,e.status,t,Number.isFinite(i)&&i>0?i:void 0)}async function Vc(e,n,t,i,a){let r={"X-Gallery-Key":i};a!==void 0&&(r["content-type"]="application/json");let o;try{o=await e(n,{method:t,headers:r,body:a,credentials:"omit",mode:"cors"})}catch{throw new Wt("network",0)}if(!o.ok)throw await X0(o);return o}async function Xg(e,n,t,i=Er){let{replaces:a,...r}=t,o=JSON.stringify(a?{...r,replaces:a}:r);if(Wg(o)>fe.bodyBytes)throw new Wt("too_large",0);let l=await(await Vc(e,`${i}/submissions`,"POST",n,o)).json(),d={id:String(l.id??""),status:String(l.status??"pending")};return typeof l.replaces=="string"&&l.replaces!==""&&(d.replaces=l.replaces),d}function J0(e,n=Er){if(e===null||typeof e!="object")return;let t=e,i=(...l)=>{for(let d of l)if(typeof t[d]=="string")return t[d];return null},a=(...l)=>{for(let d of l)if(typeof t[d]=="number"&&Number.isFinite(t[d]))return t[d];return 0},r=i("id");if(r===null||r==="")return;let o=i("preview_url","previewUrl"),s=i("replaces_id","replacesId");return{id:r,title:i("title")??"",status:i("status")??"pending",rejectReason:i("rejectReason","reject_reason"),createdAt:i("createdAt","created_at")??"",voteCount:a("voteCount","vote_count"),replacesId:s===""?null:s,updatedAt:i("updated_at","updatedAt"),importCount:a("import_count","importCount"),previewUrl:o===null||o===""?null:Z0(o,n)}}function Z0(e,n=Er){if(/^https?:\/\//i.test(e))return e;let t=n.endsWith("/")?n:`${n}/`;try{return new URL(e.startsWith("/")?e:e.replace(/^\.\//,""),e.startsWith("/")?new URL(t).origin:t).toString()}catch{return e}}async function Jg(e,n,t=Er){let a=await(await Vc(e,`${t}/mine`,"GET",n)).json();return Array.isArray(a.items)?a.items.map(r=>J0(r,t)).filter(r=>r!==void 0):[]}function Uc(e){return e.replacesId!==null}function Fr(e){return e.status==="pending"&&Uc(e)}function Zg(e){let n=new Set(e.map(r=>r.id)),t=new Map;for(let r of e){if(!Uc(r)||r.replacesId===r.id||!n.has(r.replacesId))continue;let o=t.get(r.replacesId)??[];o.push(r),t.set(r.replacesId,o)}let i=new Set([...t.values()].flat().map(r=>r.id)),a=[];for(let r of e){if(i.has(r.id))continue;let o=t.get(r.id)??[];a.push({upload:r,updates:o,canUpdate:r.status==="approved"&&!o.some(Fr)})}return a}function Wc(e){if(e.status==="rejected")return e.rejectReason?e.rejectReason:"No reason was given.";if(Fr(e))return"The old version stays up until this one is approved.";if(e.status==="pending")return"It shows in the gallery after it is approved.";if(e.status==="removed")return"It is no longer in the gallery.";let n=e.voteCount===1?"1 vote":`${e.voteCount} votes`,t=e.importCount===1?"added once":`added ${e.importCount} times`;return`${n} \xB7 ${t}`}async function Qg(e,n,t,i=Er){await Vc(e,`${i}/mine/${encodeURIComponent(t)}`,"DELETE",n)}var Q0={pending:"Waiting for review",approved:"In the gallery",rejected:"Not approved",removed:"Removed"};function ey(e){return Fr(e)?"New version in review":Uc(e)&&e.status==="rejected"?"New version not approved":Q0[e.status]??e.status}var e1=2,t1=[e1,1.5,1];function n1(e){let n=structuredClone(e);return n.elements=n.elements.filter(t=>t.kind!=="imageTime"),n}function i1(e,n,t,i){let a=new Map;for(let c of t){let u=i.entityState(c.originalId);if(!u)continue;let p={...u,entityId:c.placeholderId,iconName:""};delete p.entityPicture,a.set(c.placeholderId,p)}let r=[],o=[];Ct(e,c=>{r.push(c)}),Ct(n,c=>{o.push(c)});let s=new Map;for(let c=0;c<Math.min(r.length,o.length);c++){let u=Xi(r[c],e.values),p=Xi(o[c],n.values);if(u===void 0||p===void 0)continue;let f=i.templateResults.get(u);f!==void 0&&s.set(p,f)}let l=new Map,d=(c,u)=>{if(c===void 0||u===void 0)return;let p=i.historySeries.get(c);p!==void 0&&l.set(u,p)};for(let c=0;c<Math.min(e.elements.length,n.elements.length);c++){let u=e.elements[c],p=n.elements[c];u.kind==="chart"&&p.kind==="chart"?(d(Lt(u.payload),Lt(p.payload)),d(It(u.payload),It(p.payload))):u.kind==="timeline"&&p.kind==="timeline"&&d(Qe(u.payload),Qe(p.payload))}return{entityStates:a,templateResults:s,historySeries:l,namedValues:n.values}}async function ty(e,n,t,i){let a=sa(e,n),r=i1(e,a,n,t),o=dn(n1(a),r),s=[];for(let l of de){let d=l,c=o[d];if(!c)continue;let u=await a1(xi(c,{icons:i,slot:ce[d],pictureScene:!0}));if(s.push({family:l,png:u}),s.length===fe.previews)break}return s}async function a1(e){let n=document.createElement("div");Gr(e,n);let t=n.querySelector("svg");if(!t)throw new Error("nothing was drawn");let i=Number(t.getAttribute("width")),a=Number(t.getAttribute("height"));if(!(i>0)||!(a>0))throw new Error("the drawing has no size");let r=new XMLSerializer().serializeToString(t),o=await r1(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(r)}`);for(let s of t1){let l=document.createElement("canvas");l.width=Math.round(i*s),l.height=Math.round(a*s);let d=l.getContext("2d");if(!d)throw new Error("no canvas");d.drawImage(o,0,0,l.width,l.height);let c=await new Promise(u=>l.toBlob(u,"image/png"));if(c&&c.size<=fe.pngBytes)return o1(c)}throw new Error("the picture is too large")}function r1(e){return new Promise((n,t)=>{let i=new Image;i.onload=()=>n(i),i.onerror=()=>t(new Error("the drawing could not be loaded")),i.src=e})}async function o1(e){let n=new Uint8Array(await e.arrayBuffer()),t="";for(let i=0;i<n.length;i+=32768)t+=String.fromCharCode(...n.subarray(i,i+32768));return btoa(t)}var l1="wrist-assistant-panel.picker-hidden.v1:",Kc=(e,n)=>window.fetch(e,n),Zc="wrist-assistant-gallery-nickname";function d1(){try{return window.localStorage.getItem(Zc)??""}catch{return""}}function c1(e){try{e===""?window.localStorage.removeItem(Zc):window.localStorage.setItem(Zc,e)}catch{}}var u1={"Layer names":"Layer name","Template text":"Template text","Service data":"Service data","Other text":"Other text"},jc="https://wrist-assistant.com/gallery/";function ny(e){let n=e.map(te);return n.length<=1?n[0]??"":`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}function iy(e){let n=e.elements.filter(t=>!xe(e,t)).length;return n===1?"1 layer":`${n} layers`}var p1=3e4,h1=500,f1=3e4,ay="preset-entity";function ry(e){return`import-entity-${e}`}var m1={entityId:"",displayName:"",domain:""},g1=new Map,y1={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function qc(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function b1(e){return e.kind==="family"?"look":"content"}function Yc(e){let n=e.document?.supportedFamilies;return Array.isArray(n)?n.filter(t=>typeof t=="string"):[]}function oy(){return h`<span class="hstep" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h13" /><path d="M12 6l6 6-6 6" /></svg></span>`}function sy(e){let n=w`<rect x="3" y="2" width="38" height="48" rx="11" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="1.5" />`,t=(a,r)=>w`<rect x=${22-a/2} y=${26-r/2} width=${a} height=${r} rx="3.5" fill="currentColor" />`,i;switch(e){case"rectangular":i=w`<rect x="8" y="21" width="28" height="10" rx="3" fill="currentColor" />`;break;case"circular":i=w`<circle cx="22" cy="26" r="8" fill="currentColor" />`;break;case"corner":i=w`<path d="M9 18a9 9 0 0 1 9-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              <circle cx="11.5" cy="11.5" r="3" fill="currentColor" />`;break;case"small":i=t(13,13);break;case"medium":i=t(28,13);break;case"large":i=t(28,28);break;case"xlarge":i=t(28,42);break;default:i=w`<rect x="10" y="7" width="24" height="5" rx="2.5" fill="currentColor" />`}return h`<svg class="shape-art" viewBox="0 0 44 52" aria-hidden="true">${n}${i}</svg>`}var ly=300,dy=360,Qc=44,eu=22,yy=[1,1.7,2.6],x1=["S","M","L"],cy=["Small","Medium","Large"];function w1(){return yy.map((e,n)=>{let t=Math.round(Qc*e),i=Math.round(eu*e),a=`.layers-card.s${n}`;return`
    @container layers (max-width: ${t+299}px) {
      ${a} .layer {
        grid-template-columns: 16px 3px var(--thumb-w) minmax(0, 1fr);
        grid-template-areas: "grip bar thumb name" "grip bar right right";
        row-gap: 0; padding-top: 5px; padding-bottom: 5px;
      }
      ${a} .layer.dragging { padding-top: 0; padding-bottom: 0; }
      ${a} .layer > .grip { grid-area: grip; }
      ${a} .layer > .bar { grid-area: bar; }
      ${a} .layer > .thumb, ${a} .layer > .folder { grid-area: thumb; }
      ${a} .layer > .name { grid-area: name; }
      ${a} .layer > .right { grid-area: right; min-width: 0; flex-wrap: wrap; justify-content: flex-start; gap: 0 4px; }
      ${a} .layer:not(.group) .badge, ${a} .layer:not(.group) .acts { margin-top: 4px; }
      ${a} .layer:not(.group):hover .badges, ${a} .layer.hl .badges, ${a} .layer:focus-within .badges { display: inline-flex; }
      ${a} .layer:not(.group):not(.rich):not(.hl):not(:focus-within):hover .acts { display: none; }
      ${a} .layer.pinned .badges { display: none; }
      ${a} .layer.group { grid-template-areas: "grip bar thumb name" "grip bar thumb right"; }
      ${a} .layer.group > .right { justify-content: flex-end; gap: 2px; }
      ${a} .group-kids { margin-left: 6px; padding-left: 6px; }
      ${a} .group-cta { flex-wrap: wrap; }
    }
    @container layers (max-width: ${t+149}px) {
      ${a} .layer {
        grid-template-columns: 16px 3px minmax(0, 1fr);
        grid-template-areas: "grip bar thumb" "grip bar name" "grip bar right";
      }
      ${a} .layer > .thumb { justify-self: start; width: min(var(--thumb-w), 100%); height: auto; aspect-ratio: ${t} / ${i}; }
      ${a} .layer > .name { padding-top: 4px; }
      ${a} .layer.group {
        grid-template-columns: 16px 3px minmax(0, 1fr) auto;
        grid-template-areas: "grip bar thumb right" "grip bar name name";
      }
      ${a} .layer.group > .folder { justify-self: start; width: auto; }
      ${a} .layer.group > .name { padding-top: 2px; }
      ${a} .group-kids { margin-left: 2px; padding-left: 4px; }
    }`}).join(`
`)}var uy="wrist-assistant-panel.layers.v1",py="wrist-assistant-panel.grid.v1",hn=34,Hi=200,v1=720,Ps=320,k1=80,$1=56,hy="wrist-assistant-panel.columns.v3",Xc=e=>Math.max(Hi,Math.min(v1,Math.round(e))),fy=e=>e.metaKey||e.ctrlKey||e.shiftKey;function C1(e,n,t){let a=e.querySelector(`g[data-element-id="${CSS.escape(n)}"]`)?.firstElementChild;if(!a||a.tagName.toLowerCase()!=="rect")return!1;let r=a.getBoundingClientRect();return t.clientX>=r.left&&t.clientX<=r.right&&t.clientY>=r.top&&t.clientY<=r.bottom}var S1=/^(range|checkbox|radio|color|button|submit|reset|file|image)$/,T1=3,da=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",Un=da==="Cmd"?"\u2318":"Ctrl+",Jc=da==="Cmd"?"\u21E7":"Shift+";function my(e,n,t){if(e<=0)return{columns:3,left:n,right:t};let i=e-k1;if(i>=Hi*2+Ps){let r=i-Ps,o=n,s=t;if(o+s>r){let l=r/(o+s);o=Math.max(Hi,Math.floor(o*l)),s=Math.max(Hi,Math.floor(s*l));let d=o+s-r;d>0&&(o>=s?o=Math.max(Hi,o-d):s=Math.max(Hi,s-d))}return{columns:3,left:o,right:s}}let a=e-$1;return a>=Hi+Ps?{columns:2,left:Math.min(n,a-Ps),right:t}:{columns:1,left:n,right:t}}var H=class H extends gn{constructor(){super(...arguments);this.narrow=!1;this.colLeft=ly;this.colRight=dy;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=7;this.presets=[];this.occupied=[];this.serverToken=0;this.sendStatusKnown=!1;this.polling=!1;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.historyReadings=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.helpSections=new Set;this.scrubStart=()=>this.draft?.beginGesture();this.scrubEnd=()=>this.draft?.endGesture();this.pickerOpen=!1;this.pickerFilter="all";this.pickerHiddenOpen=!1;this.sharedHelp=!1;this.thumbStep=0;this.layerDetail="compact";this.addOpen=!0;this.addDetail="expanded";this.multi=new Set;this.snapGrid=!0;this.gridStep=.01;this.showGridLines=!1;this.snapLayers=!0;this.guides=[];this.altHeld=!1;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newOpen=!1;this.newName="";this.shareOpen=!1;this.shareMode="share";this.shareLabels=new Map;this.shareFamilies=new Set;this.dialogLitIds=[];this.shareGroupNames=new Map;this.shareValueNames=new Map;this.shareName="";this.shareLayerNames=new Map;this.shareNote="";this.shareTextOpen=!1;this.shareLinkShown=!1;this.galleryOpen=!1;this.galleryTab="new";this.galleryStep=1;this.galleryTitle="";this.galleryDescription="";this.galleryTags=new Set;this.galleryNickname="";this.galleryPreviewNote="";this.gallerySending=!1;this.gallerySent=!1;this.galleryError="";this.galleryUploadsError="";this.galleryPreviewRun=0;this.importOpen=!1;this.importText="";this.importName="";this.importMap=new Map;this.importDrop=!1;this.importDragDepth=0;this.importTextShown=!1;this.importHistory=new Map;this.importHistoryRun=0;this.helpTab="basics";this.linkReady=!1;this.recordPreviews=new Map;this.previewCase=Vo.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=Cf(()=>this.requestUpdate());this.imageSizes=Sf(()=>this.requestUpdate());this.symbols=new Qo(()=>this.requestUpdate());this.keyHandler=t=>{t.key==="Alt"&&(this.altHeld=!0),this.onKey(t)};this.blurHandler=()=>{this.altHeld=!1};this.heldArrows=new Set;this.keyUpHandler=t=>{t.key==="Alt"&&(this.altHeld=!1),this.heldArrows.delete(t.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.fades=new ns;this.sizeObserver=new ResizeObserver(t=>{let i=t[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=t=>{this.draft?.dirty&&t.preventDefault()};this.menuOutside=t=>{let i=this.openMenu;if(i===void 0)return;t.composedPath().some(r=>r instanceof HTMLElement&&r.dataset.menu===i)||this.toggleMenu(i,!1)};this.pickerOutside=t=>{t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.newKeys=t=>{t.key==="Enter"&&(this.newName.trim()===""||this.newFamily===void 0||this.newNameProblem()!==void 0||(t.preventDefault(),this.createNew()))};this.importDragEnter=t=>{this.dragReadable(t)&&(t.preventDefault(),this.importDragDepth+=1,this.importDrop=!0)};this.importDragOver=t=>{this.dragReadable(t)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))};this.importDragLeave=()=>{this.importDragDepth!==0&&(this.importDragDepth-=1,this.importDragDepth===0&&(this.importDrop=!1))};this.importDropped=t=>{this.importDragDepth=0,this.importDrop=!1;let i=t.dataTransfer?.files?.[0];if(i){t.preventDefault(),this.readImportBlob(i);return}let a=t.dataTransfer?.getData("text/plain")??"";a!==""&&(t.preventDefault(),this.setImportText(a))};this.importPasted=t=>{if(this.importParse?.ok)return;let i=t.composedPath()[0];if(i instanceof HTMLTextAreaElement||i instanceof HTMLInputElement)return;let a=t.clipboardData?.files?.[0];if(a){t.preventDefault(),this.readImportBlob(a);return}let r=t.clipboardData?.getData("text/plain")??"";r.trim()!==""&&(t.preventDefault(),this.setImportText(r))};this.takeShareLink=()=>{let t=Dc(window.location.hash);t!==void 0&&(history.replaceState(history.state,"",`${window.location.pathname}${window.location.search}`),this.pendingLink=t,this.linkReady&&this.openPendingLink())};this.importKeys={handleEvent:t=>{if(t.key!=="Enter"||t.target instanceof HTMLTextAreaElement)return;let i=this.importConfig();!i||Ic(i,this.hass.states).some(o=>$c(ry(o.entityId)))||zc({parsed:!0,name:this.importName,taken:this.takenNames(),unchosen:0})!==void 0||(t.preventDefault(),t.stopPropagation(),this.doImport())},capture:!0};this.presetKeys={handleEvent:t=>{t.key==="Enter"&&(this.presetEntity===void 0||$c(ay)||(t.preventDefault(),t.stopPropagation(),this.createFromPreset()))},capture:!0};this.pressing=!1;this.pressStart=()=>{this.pressing=!0};this.pressEnd=()=>{window.setTimeout(()=>{this.pressing=!1})};this.sharedValueFocus=t=>{this.pressing||this.sharedValueOutside(t)};this.sharedValueOutside=t=>{if(this.openValue===void 0)return;let i=t.composedPath(),a=i[0];if(a instanceof HTMLElement&&a.classList.contains("values-list"))return;i.some(o=>o instanceof HTMLElement&&o.classList.contains("vitem")&&o.classList.contains("open"))||this.setOpenValue(void 0)}}get testValues(){return this.draft?.testValues??g1}static{this.styles=Ks`
    :host {
      /* Column so the footer can sit under a layout that takes the rest of the
         height, rather than being pushed off the bottom of the page. */
      display: flex;
      flex-direction: column;
      /* Home Assistant's ha-panel-custom is a plain block with no height of
         its own, so 100% here resolves to auto and the columns collapse to
         nothing. The panel owns the whole viewport (custom panels draw no
         HA toolbar), so take it from the viewport instead. */
      height: 100vh;
      height: 100dvh;
      font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, "Inter", Roboto, sans-serif);
      font-size: 14px;
      /* Colours the whole editor shares: one per layer kind, one per section
         that is not about a kind. Set once so a badge, a bar and a card agree. */
      --wa-text: ${De(it.text)};
      --wa-icon: ${De(it.icon)};
      --wa-gauge: ${De(it.gauge)};
      --wa-shape: ${De(it.shape)};
      --wa-image: ${De(it.image)};
      --wa-tap: ${De(it.tap)};
      --wa-states: ${De(oe.states)};
      --wa-place: ${De(oe.place)};
      /* The skin. Light follows the Home Assistant theme it sits in; the dark
         block below replaces these with the editor's own deep palette. The
         rest of the sheet only ever reads these names, so the two skins can
         never drift apart in anything but colour. */
      --wa-bg: var(--primary-background-color, #f3f1ec);
      --wa-card: var(--card-background-color, #ffffff);
      --wa-panel: var(--secondary-background-color, #f6f4ef);
      --wa-raised: #faf9f6;
      --wa-input: #ffffff;
      --wa-line: var(--divider-color, #e4e0d7);
      --wa-line-strong: #cfc9bd;
      --wa-ink: var(--primary-text-color, #201d19);
      --wa-muted: var(--secondary-text-color, #7d766c);
      --wa-accent: var(--primary-color, #3d5bd9);
      --wa-accent-ink: #fff;
      /* The one filled button on screen. Ink on paper in the light skin, where
         a saturated fill fights the tinted cards; the accent in the dark one,
         where ink is the ground. */
      --wa-primary-bg: var(--wa-ink);
      --wa-primary-ink: #fff;
      /* A selected row: a cool wash rather than the kind colour, so a list of
         eight kinds still has one obvious "you are here". */
      --wa-sel-bg: #edf0fb;
      --wa-sel-ring: #c5cef2;
      /* Inspector rows: a fixed title column, so every control starts at the
         same x, and one soft fill for the boxes in them. The fill is ink at
         low strength, so it suits both skins without a second value. The lit
         button of a segmented control sits a step above that fill. */
      --wa-lab: 88px;
      /* Where a card's controls start: past the title column. A narrow
         inspector stacks titles over controls and sets this to 0. */
      --wa-col: calc(var(--wa-lab) + 8px);
      --wa-field: color-mix(in srgb, var(--wa-ink) 5.5%, transparent);
      --wa-seg-on: var(--wa-card);
      /* Two colours for the things that come out of Home Assistant rather
         than out of this editor: the entity a layer names, and the value it
         is reading right now. They are the same two colours in the search
         list, the inspector, the layer rows and the strip at the bottom, so
         "which words here are my house" is answered by hue alone and a dense
         card stops being a wall of grey. Nothing else in the sheet may use
         them. */
      --wa-ent: #0f766e;
      --wa-val: #9a5b00;
      --wa-ent-bg: color-mix(in srgb, var(--wa-ent) 12%, transparent);
      --wa-val-bg: color-mix(in srgb, var(--wa-val) 14%, transparent);
      --wa-r-sm: 8px;
      --wa-r-md: 12px;
      --wa-r-lg: 16px;
      --wa-shadow-pop: 0 12px 36px rgba(0,0,0,.28);
      --wa-ring: 0 0 0 3px color-mix(in srgb, var(--wa-accent) 28%, transparent);
      color: var(--wa-ink);
      background: var(--wa-bg);
    }
    /* The 2026 skin: near-black navy ground, cards a step up, hairlines made
       of light rather than grey, and a violet accent for the one thing on
       screen you are meant to press. Only colours change here. */
    :host([dark]) {
      --wa-bg: #0b0d14;
      --wa-card: #12141d;
      --wa-panel: #1a1d28;
      --wa-raised: #171a24;
      --wa-input: #0e1017;
      --wa-line: rgba(255,255,255,.08);
      --wa-line-strong: rgba(255,255,255,.16);
      --wa-ink: #eceef5;
      --wa-muted: #8d92a6;
      --wa-accent: #7b6cff;
      --wa-accent-ink: #fff;
      --wa-primary-bg: var(--wa-accent);
      --wa-primary-ink: var(--wa-accent-ink);
      --wa-sel-bg: color-mix(in srgb, var(--wa-accent) 18%, var(--wa-card));
      --wa-sel-ring: color-mix(in srgb, var(--wa-accent) 45%, transparent);
      --wa-seg-on: #2b2f3d;
      --wa-ent: #5fd4c4;
      --wa-val: #ffc45c;
      --wa-ent-bg: color-mix(in srgb, var(--wa-ent) 14%, transparent);
      --wa-val-bg: color-mix(in srgb, var(--wa-val) 16%, transparent);
      --wa-shadow-pop: 0 16px 48px rgba(0,0,0,.6);
      color-scheme: dark;
      scrollbar-color: rgba(255,255,255,.14) transparent;
    }
    * { box-sizing: border-box; }
    svg { display: block; }
    :host([dark]) ::selection { background: color-mix(in srgb, var(--wa-accent) 45%, transparent); }
    /* The header sits on the page rather than on a bar of its own: no rule
       under it, no card behind it. What reads as chrome are the two white
       boxes in it, which is where the controls actually are. */
    header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
      min-height: 54px;
      background: var(--wa-bg);
      color: var(--wa-ink);
      flex-wrap: wrap;
      position: relative;
      flex: none;
      z-index: 20;
    }
    /* The step from one header question to the next. The header reads left to
       right as a route: choose a watch,
       then choose a complication, or make one. The arrows carry that, so they
       are drawn in ink rather than in the hairline grey they used to wear,
       where they were all but invisible against the bar. */
    header .hstep { color: var(--wa-muted); display: grid; place-items: center; flex: none; margin: 0 2px; }
    header .hstep svg { width: 20px; height: 20px; display: block; }
    header .hor { font-size: 12px; color: var(--wa-muted); flex: none; margin: 0 2px; }
    header .spacer { flex: 1; }
    header label { font-size: 12.5px; display: inline-flex; align-items: center; gap: 6px; color: var(--wa-muted); }
    header label.pick-label { margin-right: -2px; }
    header label select { max-width: 220px; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    /* Two boxes, one shape: a white pill with a hairline ring, holding a run of
       quiet controls with 1px dividers between the groups inside it. */
    .hbox {
      display: inline-flex; align-items: center; gap: 8px; height: 34px; flex: none;
      border-radius: 9px; background: var(--wa-card); box-shadow: 0 0 0 1px var(--wa-line);
    }
    .hbox.hist { gap: 2px; padding: 0 3px; }
    .hbox.status { padding: 0 3px 0 10px; gap: 10px; max-width: 100%; }
    .hbox .hdiv { width: 1px; height: 18px; background: var(--wa-line); flex: none; }
    .hbox button.icon { width: 28px; height: 28px; }
    /* Buttons: one quiet shape everywhere, the accent fill kept for the single
       action that matters, and a soft ring on focus instead of a hard outline. */
    .toolbar button, button.primary, button.small, button.danger {
      font: inherit; font-size: 12.5px; font-weight: 600; padding: 0 11px; min-height: 30px; border-radius: 8px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .toolbar button:hover:not(:disabled), button.small:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    .toolbar button:focus-visible, button.primary:focus-visible, button.small:focus-visible, button.danger:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .toolbar button:disabled, button:disabled { opacity: .45; cursor: default; }
    button.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; font-weight: 600; }
    button.primary:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-primary-bg) 85%, var(--wa-muted)); }
    /* The quiet third button: no fill, no ring, just muted words. */
    button.ghost {
      font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px; padding: 0 9px; min-height: 26px; border-radius: 8px;
      background: transparent; border: 1px solid transparent; color: var(--wa-muted);
    }
    button.ghost:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
    button.ghost:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.ghost.danger { color: var(--error-color, #b42318); background: transparent; border-color: transparent; }
    /* Save is the header's one call to action. It is quiet while there is
       nothing to save and lit, with the unsaved halo, once there is, so the
       button, the dirty dot and the footer line all say "unsaved" the same
       way. */
    header button.save { min-height: 28px; padding: 0 14px; }
    header button.save:not(.dirty) { background: var(--wa-panel); color: var(--wa-muted); border-color: transparent; }
    header button.save.dirty { box-shadow: 0 0 0 3px color-mix(in srgb, var(--warning-color, #e0a100) 35%, transparent); }
    button.danger { color: var(--error-color, #e5484d); border-color: color-mix(in srgb, var(--error-color, #e5484d) 45%, transparent); background: color-mix(in srgb, var(--error-color, #e5484d) 8%, transparent); }
    button.danger:hover:not(:disabled) { background: color-mix(in srgb, var(--error-color, #e5484d) 16%, transparent); border-color: var(--error-color, #e5484d); }
    button.small { padding: 0 9px; font-size: 12px; min-height: 26px; border-radius: 8px; }
    /* An icon and its words on one line. Without this the icon, drawn as a
       block, sits on a line of its own above the words. */
    button.small:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 5px; }
    button.small > svg.ui-icon { width: 13px; height: 13px; flex: none; }
    /* An Extras switch whose layer is already on the chart: pressed, not greyed.
       Clicking it again takes the layer off. */
    .adders button.small.on, .adders button.small.on:disabled { display: inline-flex; align-items: center; gap: 5px; opacity: 1;
      color: var(--primary-color, #7c6cf0); border-color: color-mix(in srgb, var(--primary-color, #7c6cf0) 45%, transparent);
      background: color-mix(in srgb, var(--primary-color, #7c6cf0) 12%, transparent); }
    button.icon {
      font: inherit; border: none; background: none; cursor: pointer; color: var(--wa-muted);
      display: inline-flex; align-items: center; justify-content: center;
      width: 24px; height: 24px; padding: 0; border-radius: 6px; opacity: .8;
      transition: background-color .12s ease-out, opacity .12s ease-out;
    }
    button.icon:hover:not(:disabled) { opacity: 1; background: color-mix(in srgb, var(--wa-ink) 10%, transparent); }
    button.icon:focus-visible { opacity: 1; outline: none; box-shadow: var(--wa-ring); }
    button.icon.danger:hover:not(:disabled) { color: var(--error-color, #e5484d); background: color-mix(in srgb, var(--error-color, #e5484d) 14%, transparent); }
    svg.ui-icon { width: 15px; height: 15px; display: block; }
    .dirty-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; flex: none; background: var(--warning-color, #e0a100); vertical-align: middle; box-shadow: 0 0 6px var(--warning-color, #e0a100); }
    .dirty-dot.clean { background: var(--success-color, #3dd68c); box-shadow: none; }
    .dirty-dot.none { background: var(--wa-line-strong); box-shadow: none; }

    /* Native controls: the same dark well, hairline and focus ring as the
       buttons, so a select in the header and a number field in the inspector
       read as one family. */
    select {
      font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); cursor: pointer; height: 30px;
      padding: 0 26px 0 10px; border-radius: 7px; border: 1px solid var(--wa-line); background-color: var(--wa-input);
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238d92a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 8px center; background-size: 14px;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    select:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    select:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input[type=text], input[type=number], input[type=search], input[type=url], textarea {
      font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); min-height: 30px;
      padding: 5px 10px; border-radius: 7px; border: 1px solid var(--wa-line); background: var(--wa-input);
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    input[type=text]:hover:not(:disabled), input[type=number]:hover:not(:disabled), textarea:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    input[type=text]:focus-visible, input[type=number]:focus-visible, input[type=search]:focus-visible, textarea:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input::placeholder, textarea::placeholder { color: color-mix(in srgb, var(--wa-muted) 70%, transparent); }
    /* Every checkbox is a switch: a pill that slides, tinted by the section
       it sits in, since a tick box is the one control that still looked like
       a form from 2009. */
    input[type=checkbox] {
      appearance: none; -webkit-appearance: none; margin: 0; cursor: pointer; flex: none;
      width: 32px; height: 18px; border-radius: 999px; position: relative;
      background: color-mix(in srgb, var(--wa-ink) 16%, transparent); border: 0;
      transition: background-color .15s ease-out, border-color .15s ease-out;
    }
    input[type=checkbox]::after {
      content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%;
      background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.35); transition: transform .15s ease-out;
    }
    input[type=checkbox]:checked { background: var(--c, var(--wa-accent)); border-color: transparent; }
    input[type=checkbox]:checked::after { transform: translateX(14px); }
    input[type=checkbox]:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    input[type=checkbox]:disabled { opacity: .45; cursor: default; }
    input[type=range] { accent-color: var(--c, var(--wa-accent)); }
    input[type=color] { border: 1px solid var(--wa-line); border-radius: 8px; background: var(--wa-input); padding: 2px; cursor: pointer; }

    /* The complication picker: one dropdown in the header instead of a list
       down the side, because the list was read once per session and the space
       it held is worth more to the layers. */
    .picker { position: relative; }
    .picker > button {
      display: inline-flex; align-items: center; gap: 10px; font: inherit; font-size: 13px; font-weight: 700;
      height: 34px; padding: 0 10px 0 8px; border-radius: 9px; cursor: pointer; color: var(--wa-ink);
      border: 0; box-shadow: 0 0 0 1px var(--wa-line-strong); background: var(--wa-card); min-width: 250px; max-width: 380px;
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .picker > button:hover { box-shadow: 0 0 0 1px var(--wa-ink); }
    .picker > button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker .pk-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; }
    .picker .pk-rev { color: var(--wa-muted); font-weight: 500; font-size: 12px; white-space: nowrap; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .picker > button svg { width: 16px; height: 16px; opacity: .7; }
    .picker .menu {
      position: absolute; top: calc(100% + 8px); left: 0; z-index: 50; width: 400px; max-height: 60vh; overflow: auto;
      background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
      border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 6px;
    }
    .picker .menu .row {
      display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; font: inherit; font-size: 13px;
      background: transparent; border: 0; color: inherit; padding: 6px 10px; border-radius: 8px; cursor: pointer;
    }
    .picker .menu .row:hover { background: var(--wa-panel); }
    .picker .menu .row[aria-current="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .picker .menu .row.locked { opacity: .6; cursor: help; }
    .picker .menu .pk-note { font-size: 12px; line-height: 1.4; color: var(--wa-muted); padding: 0 10px 8px 88px; }
    .picker .menu .pk-badge { font-size: 11px; opacity: .7; white-space: nowrap; }
    /* A saved complication's row: the part that opens it, then its own hide
       and delete buttons, which neither open it nor shut the menu. */
    .picker .menu .row.rec { padding: 0; gap: 0; cursor: default; }
    .picker .menu .row.rec > .pick {
      display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; text-align: left; font: inherit;
      background: transparent; border: 0; color: inherit; padding: 6px 4px 6px 10px; border-radius: 8px; cursor: pointer;
    }
    .picker .menu .row.rec > .pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker .menu .row.rec.dim > .pick { opacity: .5; }
    .picker .menu .pk-acts { display: flex; align-items: center; gap: 2px; flex: none; padding-right: 6px; }
    .picker .menu .pk-acts button.icon { width: 26px; height: 26px; }
    .picker .menu .pk-acts button.small { min-height: 24px; padding: 0 7px; }
    .picker .menu .pk-hidden-head {
      display: flex; align-items: center; gap: 6px; width: 100%; font: inherit; font-size: 12px; font-weight: 600;
      color: var(--wa-muted); background: transparent; border: 0; border-top: 1px solid var(--wa-line);
      margin-top: 6px; padding: 8px 10px 6px; cursor: pointer; text-align: left;
    }
    .picker .menu .pk-hidden-head:hover { color: var(--wa-ink); }
    .picker .menu .pk-hidden-head:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .picker .menu .pk-hidden-head svg { width: 14px; height: 14px; transition: transform .12s ease-out; }
    .picker .menu .pk-hidden-head[aria-expanded="true"] svg { transform: rotate(90deg); }
    /* The row picture: the complication drawn as the watch draws it, in a
       fixed box so every name in the list still starts on the same column. */
    .pk-art { width: 68px; height: 30px; flex: none; display: grid; place-items: center; pointer-events: none; }
    .pk-art svg { display: block; max-width: 100%; max-height: 30px; width: auto; height: auto; background: #000; border-radius: 4px; }
    .pk-art.circular svg { border-radius: 50%; }
    .pk-art.corner svg { background: #2c2c2e; }
    /* A Home Screen tile is rounded far harder than a lock screen slot, so its
       row picture takes the corner too, at the share of the box iOS uses. */
    .pk-art.small svg { border-radius: 16.3%; }
    .pk-art.medium svg { border-radius: 7.7% / 16.3%; }
    .pk-art.large svg { border-radius: 7.7% / 7.4%; }
    .pk-art.xlarge svg { border-radius: 7.7% / 4.8%; }
    .pk-art .inline-line {
      font-size: 9px; padding: 2px 6px; max-width: 100%; min-width: 0; display: inline-flex; align-items: center; gap: 3px;
      border-radius: 999px; background: #000; color: #fff; overflow: hidden; white-space: nowrap;
    }
    .pk-art .inline-line svg { background: transparent; border-radius: 0; }
    /* Shape filter, only drawn once the list is long. */
    .pk-filter { display: flex; gap: 4px; flex-wrap: wrap; padding: 4px 6px 8px; border-bottom: 1px solid var(--wa-line); margin-bottom: 6px; }
    .pk-chip {
      display: inline-flex; align-items: center; gap: 5px; font: inherit; font-size: 11.5px; font-weight: 500;
      padding: 4px 8px; border-radius: 999px; cursor: pointer; color: var(--wa-muted);
      border: 1px solid var(--wa-line); background: transparent;
    }
    .pk-chip:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .pk-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-chip:disabled { opacity: .35; cursor: default; }
    .pk-chip.on { border-color: var(--wa-accent); color: var(--wa-ink); background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .pk-count { font-size: 10.5px; opacity: .65; font-weight: 400; }

    /* New complication: its own button beside the list, because making one was
       a row buried under every complication that already existed. */
    .newc { position: relative; display: inline-flex; align-items: center; gap: 6px; }
    .new-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px; font-weight: 600;
      height: 30px; padding: 0 11px; border-radius: 8px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: var(--wa-ink);
      transition: border-color .12s ease-out, background-color .12s ease-out;
    }
    /* The one way to start something from an empty panel, so it is filled
       rather than outlined: the header's other controls are all about a
       complication that already exists. */
    .new-btn.primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .new-btn.primary:hover:not(:disabled) { border-color: transparent; filter: brightness(1.1); }
    .new-btn:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    .new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .new-btn:disabled { opacity: .45; cursor: not-allowed; }
    .new-btn svg { width: 16px; height: 16px; }
    .newc-full { font-size: 11px; color: var(--wa-muted); white-space: nowrap; }

    /* The New complication dialog: name, shape, Create. In the middle of the
       window rather than hanging off the button, because it asks two questions
       and refuses until both are answered. */
    dialog.new-dialog {
      width: min(430px, calc(100vw - 32px)); padding: 0;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.new-dialog::backdrop { background: rgba(0,0,0,.45); }
    .new-head { display: flex; align-items: center; gap: 8px; padding: 12px 12px 12px 18px; border-bottom: 1px solid var(--wa-line); }
    .new-head h2 { margin: 0; font-size: 15px; font-weight: 500; }
    .new-head .spacer { flex: 1; }
    /* Label over control here, not beside it: the inspector's two-column field
       gives a third of the row to a one-word label, and four shape cards need
       every pixel of a 430 px dialog. */
    .new-body .field { display: flex; flex-direction: column; align-items: stretch; gap: 5px; }
    .new-body .field > span { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
    .new-body { padding: 14px 18px 4px; }
    .new-body .field.new-shapes { margin-top: 14px; }
    .new-foot { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 18px 16px; }
    /* Auto-fit rather than four fixed columns: a watch owner has four shape
       cards and a phone owner up to seven, so the grid takes as many as the
       dialog's width allows and wraps the rest onto another row. */
    .shape-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(84px, 1fr)); gap: 8px; }
    /* A phone's shapes come in two runs, Lock Screen and Home Screen, each
       under its own quiet heading; a watch has one run and no heading. */
    .shape-groups { display: flex; flex-direction: column; gap: 12px; }
    .shape-group { display: flex; flex-direction: column; gap: 6px; }
    .shape-group-label { font-size: 11px; font-weight: 600; color: var(--wa-muted); }
    /* Not one of them starts picked. A tinted default reads as a
       recommendation, and the shape is the one thing about a complication
       that cannot be changed later without moving every layer. */
    .shape-card {
      display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;
      font: inherit; font-size: 11.5px; padding: 10px 4px 8px; color: var(--wa-muted);
      border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-raised);
      transition: border-color .12s ease-out, background-color .12s ease-out, color .12s ease-out;
    }
    .shape-card:hover { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .shape-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .shape-card.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-ink); }
    .shape-card .shape-art { width: 34px; height: 40px; display: block; }
    .shape-card-name { font-weight: 600; }
    /* The condition under a shape's name: small, quiet, and on its own line, so
       "Extra Large" still reads as the name of the shape. */
    .shape-card-note { font-size: 10px; font-weight: 500; line-height: 1.25; opacity: .8; text-align: center; }
    /* A shape that is announced but not yet pickable: same card, dimmed, no
       hover lift, so it reads as a place in the row rather than a choice. */
    .shape-card.soon { opacity: .45; cursor: default; }
    .shape-card.soon:hover { border-color: var(--wa-line); color: var(--wa-muted); }
    .shape-dots { display: inline-flex; gap: 3px; align-items: center; flex: none; }
    .shape-dot { width: 14px; height: 10px; border-radius: 2px; background: currentColor; opacity: .3; display: inline-block; }
    .shape-dot.circular { width: 10px; border-radius: 50%; }
    .shape-dot.corner { width: 10px; border-radius: 0 6px 0 0; }
    .shape-dot.inline { width: 16px; height: 4px; }
    /* One dot per Home Screen tile, at the tile's own proportions, so a row of
       them reads as which sizes the complication draws. */
    .shape-dot.small { width: 10px; height: 10px; border-radius: 3px; }
    .shape-dot.medium { width: 16px; height: 8px; border-radius: 3px; }
    .shape-dot.large { width: 11px; height: 11px; border-radius: 3px; }
    .shape-dot.xlarge { width: 8px; height: 13px; border-radius: 3px; }
    .shape-dot.on { opacity: 1; }

    /* Share, Post to online gallery and Import share one look: a head with a
       title and a close button, a body that scrolls between it and a foot
       that stays put, so a design with twenty entities still has its buttons
       on screen. Only the panel's own tokens, so both skins work. */
    dialog.xf {
      width: min(600px, calc(100vw - 32px)); max-height: calc(100vh - 40px); padding: 0;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg);
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: var(--wa-shadow-pop);
      display: flex; flex-direction: column;
    }
    dialog.xf::backdrop { background: rgba(0,0,0,.45); }
    /* Share stays open under the gallery dialog, so Back returns to it, but
       out of sight: one dialog and one dimmed backdrop at a time. */
    dialog.share-dialog.under { visibility: hidden; }
    dialog.share-dialog.under::backdrop { background: transparent; }
    .xf-head { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; padding: 12px 10px 12px 16px; border-bottom: 1px solid var(--wa-line); flex: none; }
    .xf-head .xf-t { flex: 1 1 180px; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .xf-head h2 { margin: 0; font-size: 15px; font-weight: 650; line-height: 1.3; overflow-wrap: anywhere; }
    .xf-head .xf-t > span { font-size: 12px; color: var(--wa-muted); }
    .xf-head > button.icon { width: 30px; height: 30px; flex: none; }
    .xf-head > button.icon svg.ui-icon { width: 16px; height: 16px; }
    .xfer-body {
      padding: 16px; overflow: auto; flex: 1 1 auto; min-height: 0;
      display: flex; flex-direction: column; gap: 16px; container: xfer / inline-size;
    }
    .xfer-body > * { flex: none; }
    .xf-stack { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
    .xf-label { font-size: 11px; text-transform: uppercase; letter-spacing: .07em; color: var(--wa-muted); font-weight: 600; display: flex; align-items: center; gap: 8px; }
    .xf-label .r { margin-left: auto; text-transform: none; letter-spacing: 0; font-weight: 500; }
    .xf-count { font-size: 11px; font-weight: 600; letter-spacing: 0; text-transform: none; line-height: 16px; padding: 0 6px; border-radius: 999px; background: var(--wa-field); color: var(--wa-muted); }
    .xf-f { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .xf-f > :is(input, textarea) { width: 100%; box-sizing: border-box; }
    .xf-sub { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
    .xf-lead { display: flex; gap: 10px; align-items: flex-start; font-size: 12.5px; line-height: 1.45; color: var(--wa-muted); }
    .xf-lead > svg.ui-icon { width: 16px; height: 16px; flex: none; margin-top: 1px; color: var(--wa-accent); }
    .xf-lead.warn > svg.ui-icon { color: var(--wa-val); }
    .xf-lead b { color: var(--wa-ink); font-weight: 600; }
    .xf-note { margin: 0; }
    .xf-galink { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; font-size: 13px; font-weight: 550; color: var(--wa-accent); text-decoration: none; }
    .xf-galink:hover { text-decoration: underline; }
    .xf-galink svg.ui-icon { width: 14px; height: 14px; }
    .xf-head .xf-galink { font-size: 12px; }
    /* The complication, drawn by the renderer on the black of a watch face.
       A spotlight inside the drawing picks out the layers being pointed at. */
    .xf-prev { display: grid; place-items: center; padding: 10px; border-radius: var(--wa-r-md); background: #000; border: 1px solid var(--wa-line); line-height: 0; }
    .xf-prev svg.complication { display: block; width: 100%; height: auto; max-height: 180px; }
    .xf-prev:is(.circular, .corner, .small) svg.complication { width: auto; height: 140px; max-width: 100%; }
    /* The two tall Home Screen tiles are given a height instead of a width, or
       a full-width Extra Large would be taller than the dialog. */
    .xf-prev:is(.large, .xlarge) svg.complication { width: auto; height: 180px; max-width: 100%; }
    .xf-prev.small svg.complication { border-radius: 16.3%; }
    .xf-prev.medium svg.complication { border-radius: 7.7% / 16.3%; }
    .xf-prev.large svg.complication { border-radius: 7.7% / 7.4%; }
    .xf-prev.xlarge svg.complication { border-radius: 7.7% / 4.8%; }
    .xf-prev .inline-line { line-height: 1.4; }
    .xf-prev-cap { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px 8px; margin-top: 6px; font-size: 12px; color: var(--wa-muted); }
    .xf-prev-cap b { color: var(--wa-ink); font-weight: 600; }
    .seg.wide.xf-modes { height: 34px; padding: 3px; border-radius: 10px; }
    .seg.wide.xf-modes button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; line-height: 1; font-size: 12.5px; font-weight: 600; border-radius: 7px; }
    .seg.wide.xf-modes button svg.ui-icon { width: 14px; height: 14px; flex: none; }
    .seg.xf-tabs { height: 30px; }
    .seg.xf-tabs button { display: inline-flex; align-items: center; gap: 6px; padding: 0 10px; font-size: 12px; }
    /* Rows of entities or uploads in one hairline box. */
    .xf-rows { border: 1px solid var(--wa-line); border-radius: var(--wa-r-md); overflow: hidden; }
    .xf-row { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 10px; align-items: start; padding: 10px 12px; transition: background-color .12s ease-out; }
    .xf-row + .xf-row { border-top: 1px solid var(--wa-line); }
    .xf-row.on { background: var(--wa-sel-bg); }
    .xf-row .ent-ico.xf-dom { background: var(--wa-ent-bg); color: var(--wa-ent); margin-top: 1px; }
    .xf-main { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
    .xf-main > input[type=text] { width: 100%; box-sizing: border-box; }
    .xf-uses { display: flex; flex-wrap: wrap; gap: 6px; }
    .xf-use { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; font-size: 12px; padding: 2px 8px 2px 2px; border-radius: 7px; border: 1px solid var(--wa-line); background: var(--wa-raised); }
    .xf-use .xf-lt { width: 34px; height: 20px; flex: none; border-radius: 4px; overflow: hidden; background: #000; line-height: 0; }
    .xf-use .xf-lt svg { display: block; }
    .xf-use .xf-ln { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .xf-use em { font-style: normal; color: var(--wa-muted); flex: none; }
    .xf-name { font-weight: 600; display: flex; align-items: center; gap: 6px; overflow-wrap: anywhere; }
    .xf-done { color: var(--wa-ent); display: inline-flex; }
    .xf-done svg.ui-icon { width: 14px; height: 14px; }
    /* The entity search under its row, the row's name standing in for its label. */
    .xf-picker .entity-field { display: block; padding: 0; }
    .xf-picker .entity-field > span:first-child { display: none; }
    /* Share's ways out, as tiles: the one that fits the mode is lit. */
    .xf-acts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .xf-act {
      font: inherit; color: inherit; text-align: left; cursor: pointer;
      display: flex; flex-direction: column; gap: 6px; padding: 12px; min-width: 0;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-md); background: var(--wa-raised);
      transition: border-color .12s ease-out, background-color .12s ease-out;
    }
    .xf-act:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    .xf-act:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .xf-act b { font-weight: 600; font-size: 13px; }
    .xf-act > span:last-child { font-size: 12px; color: var(--wa-muted); }
    .xf-act .ic { width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center; background: var(--wa-field); }
    .xf-act .ic svg.ui-icon { width: 16px; height: 16px; }
    .xf-act.main { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); }
    .xf-act.main .ic { background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .xf-act.flash { border-color: var(--wa-ent); }
    .xf-act.flash .ic { background: var(--wa-ent-bg); color: var(--wa-ent); }
    .xf-act:disabled { opacity: .45; cursor: not-allowed; }
    .xf-raw > summary { cursor: pointer; list-style: none; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--wa-muted); }
    .xf-raw > summary::-webkit-details-marker { display: none; }
    .xf-raw > summary:hover { color: var(--wa-ink); }
    .xf-raw > summary:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .xf-raw > summary svg.ui-icon { width: 13px; height: 13px; transition: transform .15s ease-out; }
    .xf-raw[open] > summary svg.ui-icon { transform: rotate(90deg); }
    .xf-raw > .xfer-text { margin-top: 8px; }
    .xf-raw > button.link { margin-top: 6px; font-size: 12.5px; font-weight: 600; }
    /* The gallery's steps. */
    .xf-steps { display: flex; gap: 4px 16px; padding: 0 16px; border-bottom: 1px solid var(--wa-line); overflow-x: auto; flex: none; }
    .xf-step {
      font: inherit; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); background: none; border: 0;
      border-bottom: 2px solid transparent; margin-bottom: -1px; padding: 10px 2px;
      display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; cursor: pointer;
    }
    .xf-step i { font-style: normal; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; background: var(--wa-field); font-variant-numeric: tabular-nums; }
    .xf-step i svg.ui-icon { width: 12px; height: 12px; }
    .xf-step[aria-current="step"] { color: var(--wa-ink); border-bottom-color: var(--wa-accent); }
    .xf-step[aria-current="step"] i { background: var(--wa-accent); color: var(--wa-accent-ink); }
    .xf-step.past i { background: var(--wa-ent-bg); color: var(--wa-ent); }
    .xf-step:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .xf-step:disabled { cursor: not-allowed; }
    .xf-two { display: grid; grid-template-columns: minmax(0, 1fr) 190px; gap: 16px; align-items: start; }
    .xf-form { gap: 14px; }
    .xf-caption { font-size: 11px; color: var(--wa-muted); text-align: center; margin-top: 6px; }
    .xf-gcard { border: 1px solid var(--wa-line); border-radius: var(--wa-r-md); overflow: hidden; background: var(--wa-raised); }
    .xf-gcard .img { aspect-ratio: 4 / 3; max-width: 100%; display: grid; place-items: center; padding: 10px; box-sizing: border-box; background: #000; }
    .xf-gcard .img img { max-width: 100%; max-height: 100%; display: block; }
    .xf-gcard .img .hint { margin: 0; color: #a0a0a8; }
    .xf-gcard .meta { padding: 10px; display: grid; gap: 3px; }
    .xf-gcard .meta b { font-size: 13px; overflow-wrap: anywhere; }
    .xf-gcard .meta > span { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
    .xf-gcard .tg { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 3px; }
    .xf-gcard .tg em { font-style: normal; font-size: 10.5px; padding: 1px 6px; border-radius: 999px; background: var(--wa-field); color: var(--wa-muted); }
    .gal-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .xf-blockers { margin: 0; padding: 8px 12px 8px 28px; border-radius: var(--wa-r-sm); font-size: 12.5px; line-height: 1.45; color: var(--error-color, #db4437); background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent); }
    div.xf-blockers { padding-left: 12px; }
    .xf-banner { display: flex; gap: 10px; align-items: flex-start; padding: 10px 12px; border-radius: var(--wa-r-md); background: var(--wa-sel-bg); border: 1px solid var(--wa-sel-ring); font-size: 12.5px; line-height: 1.45; }
    .xf-banner svg.ui-icon { width: 16px; height: 16px; flex: none; margin-top: 1px; color: var(--wa-accent); }
    /* What becomes public, in amber: the thing to read before sending. */
    .xf-pub { display: grid; gap: 4px; padding: 8px; border-radius: var(--wa-r-md); background: var(--wa-val-bg); border: 1px solid color-mix(in srgb, var(--wa-val) 40%, var(--wa-line)); }
    .xf-pub .kv { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 8px; align-items: start; padding: 6px; border-radius: 8px; transition: background-color .12s ease-out; }
    .xf-pub .kv.on { background: var(--wa-sel-bg); }
    .xf-sec { --sc: var(--wa-accent); display: flex; flex-direction: column; gap: 10px; min-width: 0; padding: 12px; border-radius: var(--wa-r-md);
      background: color-mix(in srgb, var(--sc) 7%, var(--wa-card)); border: 1px solid color-mix(in srgb, var(--sc) 34%, var(--wa-line)); }
    .xf-sec.s-shapes { --sc: #26a69a; }
    .xf-sec.s-names { --sc: var(--wa-val); }
    .xf-sec.s-send { --sc: #4a7fe8; }
    .xf-sec > h3 { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 13px; font-weight: 600; color: var(--wa-ink); }
    .xf-sec > h3 > i { display: inline-grid; place-items: center; flex: none; width: 20px; height: 20px; border-radius: 999px;
      font-style: normal; font-size: 11px; font-weight: 700; color: #fff; background: var(--sc); }
    .xf-sec.s-names > h3 > i { color: var(--wa-card); }
    .xf-sec > h3 .r { margin-left: auto; display: inline-flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 500; color: var(--wa-muted); }
    .xf-sec-b { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
    .xf-sec.locked > .xf-sec-b { opacity: .45; }
    .xf-sec.s-names .xf-pub { background: var(--wa-card); }
    .xf-shapes .pk-chip { display: inline-flex; align-items: center; gap: 4px; }
    .xf-shapes .pk-chip svg.ui-icon { width: 12px; height: 12px; }
    .xf-pub .kv > .k { font-size: 12px; color: var(--wa-muted); padding-top: 6px; }
    .xf-pub .kv > .v { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
    .xf-pub input[type=text] { width: 100%; box-sizing: border-box; background: var(--wa-card); }
    .xf-pill { font-size: 12px; padding: 5px 8px; border-radius: 6px; background: var(--wa-card); border: 1px solid var(--wa-line); overflow-wrap: anywhere; white-space: pre-wrap; }
    .xf-pill.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .xf-checks { display: grid; gap: 6px; }
    .xf-checks > div { display: flex; align-items: center; gap: 8px; font-size: 13px; }
    .xf-checks svg.ui-icon { width: 15px; height: 15px; flex: none; color: var(--wa-ent); }
    .xf-done { display: grid; justify-items: center; text-align: center; gap: 8px; padding: 24px 8px; }
    .xf-done .big { width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; background: var(--wa-ent-bg); color: var(--wa-ent); }
    .xf-done .big svg.ui-icon { width: 24px; height: 24px; }
    .xf-done b { font-size: 16px; }
    .xf-done p { margin: 0; max-width: 38ch; color: var(--wa-muted); font-size: 13px; }
    .xf-done .btns { display: flex; gap: 8px; margin-top: 6px; }
    /* My uploads: a picture, the title and its state, and what can be done. A
       new version still in review hangs under the upload it replaces. */
    .xf-up { display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; gap: 8px 12px; align-items: center; padding: 10px 12px; }
    .xf-up + .xf-up { border-top: 1px solid var(--wa-line); }
    .xf-up-thumb { width: 44px; height: 44px; border-radius: 10px; background: #000; overflow: hidden; display: grid; place-items: center; }
    .xf-up-thumb img { max-width: 100%; max-height: 100%; display: block; }
    .xf-up-t { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 8px; }
    .xf-up-t b { font-weight: 600; font-size: 13px; overflow-wrap: anywhere; }
    .xf-up .sub { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
    .xf-up-acts { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }
    .xf-up-v { grid-column: 2 / -1; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center; padding: 2px 0 2px 10px; border-left: 2px solid var(--wa-line-strong); }
    .gal-status { font-size: 11px; font-weight: 600; line-height: 18px; padding: 0 8px; border-radius: 999px; white-space: nowrap; color: var(--wa-muted); background: var(--wa-field); }
    .gal-status.approved { color: var(--wa-ent); background: var(--wa-ent-bg); }
    .gal-status.pending { color: var(--wa-val); background: var(--wa-val-bg); }
    .gal-status.rejected { color: var(--error-color, #db4437); background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent); }
    /* Import: one dashed drop area until something is loaded. */
    .xf-drop { display: grid; justify-items: center; gap: 10px; padding: 28px 16px; text-align: center; border: 1.5px dashed var(--wa-line-strong); border-radius: var(--wa-r-lg); transition: border-color .15s ease-out, background-color .15s ease-out; }
    .xf-drop.over { border-color: var(--wa-accent); background: var(--wa-sel-bg); }
    .xf-drop .big { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; background: var(--wa-sel-bg); color: var(--wa-accent); }
    .xf-drop .big svg.ui-icon { width: 22px; height: 22px; }
    .xf-drop b { font-size: 15px; }
    .xf-drop p { margin: 0; font-size: 13px; color: var(--wa-muted); }
    .xf-drop .btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 4px; }
    dialog.xf kbd { font: 11px ui-monospace, SFMono-Regular, Menlo, monospace; padding: 0 5px; border: 1px solid var(--wa-line-strong); border-bottom-width: 2px; border-radius: 5px; }
    button.link.xf-type { align-self: center; font-size: 13px; font-weight: 550; }
    .xf-galtile { display: flex; align-items: center; gap: 12px; padding: 12px; color: inherit; text-decoration: none; border: 1px solid var(--wa-line); border-radius: var(--wa-r-md); background: var(--wa-raised); }
    .xf-galtile:hover { border-color: var(--wa-line-strong); }
    .xf-galtile:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .xf-galtile .ic { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: var(--wa-sel-bg); color: var(--wa-accent); flex: none; }
    .xf-galtile svg.ui-icon { width: 16px; height: 16px; flex: none; }
    .xf-galtile .t { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .xf-galtile .t b { font-weight: 600; }
    .xf-galtile .t span { font-size: 12px; color: var(--wa-muted); }
    .xf-hero { display: grid; grid-template-columns: minmax(0, 220px) minmax(0, 1fr); gap: 16px; align-items: center; }
    .xf-bar { height: 6px; border-radius: 999px; background: var(--wa-field); overflow: hidden; }
    .xf-bar > i { display: block; height: 100%; background: var(--wa-accent); transition: width .2s ease-out; }
    button.primary:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; }
    button.primary > svg.ui-icon { width: 14px; height: 14px; }
    /* The document itself. Monospace and never wrapped: a wrapped line reads as
       a line break that is not in the text, and this text gets pasted. */
    .xfer-text {
      display: block; width: 100%; box-sizing: border-box; resize: vertical; white-space: pre; overflow: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; line-height: 1.45;
      border-color: transparent; border-radius: 7px; background: var(--wa-field);
    }
    .xfer-problem { white-space: pre-line; margin: 0; }
    .xfer-link { width: 100%; box-sizing: border-box; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    /* The whole dialog is the drop target, lit while a file is over it. */
    dialog.import-dialog.dropping { border-color: var(--wa-accent); box-shadow: 0 0 0 2px var(--wa-accent), 0 12px 40px rgba(0,0,0,.4); }
    .xfer-drop {
      position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; border-radius: 12px;
      background: color-mix(in srgb, var(--wa-accent) 16%, transparent); font-size: 14px; font-weight: 600;
    }
    .xfer-drop span { padding: 8px 14px; border-radius: 8px; background: var(--wa-card); }
    .link-note { margin: 4px 12px 0; display: flex; align-items: center; gap: 10px; }
    .xfer-foot { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--wa-line); flex: none; }
    .xfer-foot .spacer { flex: 1; }
    /* A narrow dialog stacks: the tiles, the card beside the form, the preview
       beside the name, and each public row's name over its text. */
    @container xfer (max-width: 480px) {
      .xf-acts, .xf-two, .xf-hero { grid-template-columns: minmax(0, 1fr); }
      .xf-pub .kv { grid-template-columns: minmax(0, 1fr); gap: 4px; }
      .xf-pub .kv > .k { padding-top: 0; }
      .xf-up { grid-template-columns: 44px minmax(0, 1fr); }
      .xf-up-acts { grid-column: 2; justify-content: flex-start; }
      .xf-up-v { grid-column: 1 / -1; }
    }
    @media (prefers-reduced-motion: reduce) {
      dialog.xf *, dialog.xf *::after { transition: none !important; }
    }

    /* Three columns with a draggable gutter between each pair. The side widths
       come in as custom properties already fitted to the measured panel width
       (see columnFit), and every track can shrink to zero here, so the grid
       itself can never be wider than the panel and clip a column. */
    .layout {
      display: grid;
      grid-template-columns: var(--wa-left, 300px) 8px minmax(0, 1fr) 8px var(--wa-right, 360px);
      column-gap: 8px;
      row-gap: 8px;
      padding: 4px 12px 10px;
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
    .column.inspector { --wa-fade: var(--wa-card); --wa-fade-gap: 0px; }
    .layers { --wa-fade: var(--wa-card); --wa-fade-gap: 2px; }
    .column.canvas { --wa-fade: var(--wa-bg); --wa-fade-gap: 8px; }
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
    /* The left column does not scroll: the Add card keeps its natural height
       and the Layers card takes the rest, scrolling its own rows. The shape
       row follows the last layer, and stays in sight once the rows scroll. */
    .column.left { display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
    .column.left .card { flex: none; }
    .column.left .card.layers-card {
      flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; padding: 10px 8px 8px;
      --thumb-w: ${Qc}px; --thumb-h: ${eu}px;
      container: layers / inline-size;
    }
    /* Card titles read as titles: sentence case, a little heavier, the ink
       colour. Their side notes stay small and muted. */
    .panel-title {
      display: flex; align-items: center; gap: 8px; margin: 0 0 10px; min-height: 30px;
      font-size: 13.5px; font-weight: 700; letter-spacing: 0; color: var(--wa-ink);
    }
    .panel-title .spacer { flex: 1; }
    .panel-title .mini { font-weight: 500; font-size: 12px; color: var(--wa-muted); letter-spacing: 0; }
    .panel-title button.small { font-weight: 600; letter-spacing: 0; }

    /* Status and the raw document: one line at the foot of the panel, shut by
       default, saying only whether the work is saved. */
    details.foot { flex: none; border-top: 1px solid var(--wa-line); background: var(--wa-raised); }
    details.foot > summary { display: flex; align-items: center; gap: 10px; min-height: 34px; padding: 0 24px; font-size: 12.5px; cursor: pointer; list-style: none; color: var(--wa-muted); }
    details.foot > summary::-webkit-details-marker { display: none; }
    details.foot > summary:hover { background: var(--wa-panel); }
    details.foot .foot-dot { font-size: 10px; }
    details.foot .foot-dot.ok { color: var(--success-color, #3dd68c); text-shadow: 0 0 8px var(--success-color, #3dd68c); }
    details.foot .foot-dot.warn { color: var(--warning-color, #ffa600); }
    /* Same colour on the words as on the dot, so the footer agrees with the
       header's Save button about there being work to save. */
    details.foot .foot-dot.warn + .foot-text { color: var(--warning-color, #ffa600); }
    details.foot .foot-dot.err { color: var(--error-color, #db4437); }
    details.foot .foot-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    details.foot .foot-more { font-size: 12px; opacity: .6; }
    details.foot[open] .foot-more { opacity: .4; }
    details.foot .foot-body { padding: 0 16px 12px; max-height: 40vh; overflow: auto; }
    details.foot .foot-body .hint { margin: 8px 0; }

    /* Add a layer: one tinted card per kind, each carrying a sample of what
       that kind draws, then the presets. It sits above the list so adding a
       layer never moves the button just pressed.

       The sample sits on the same black well the Layers list uses for its
       thumbnails, so "what a gauge looks like" is answered by the same picture
       in both places and the button reads as a watch face rather than a
       swatch. */
    /* A card whose whole title bar is the fold handle. Shut, the title keeps
       its own margin off the body it no longer has, so the card is one line. */
    .card.fold .fold-h { cursor: pointer; border-radius: var(--wa-r-sm); margin: -4px -6px 8px; padding: 4px 6px; user-select: none; }
    .card.fold[data-open="false"] .fold-h { margin-bottom: -4px; }
    .card.fold .fold-h:hover { background: var(--wa-panel); }
    .card.fold .fold-h:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .card.fold .fold-h .chev { color: var(--wa-muted); flex: none; display: grid; place-items: center; transition: transform .15s ease-out; }
    .card.fold .fold-h .chev svg { width: 16px; height: 16px; }
    .card.fold[data-open="true"] .fold-h .chev { transform: rotate(180deg); }

    /* Two across, not three: the sample is the whole point of the expanded
       buttons, and at a third of the column it was too small to tell a gauge
       from a chart without reading the name under it. */
    .add-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
    /* Compact: the samples go and every button becomes one 34px line, a colour
       chip and a name, so eight kinds take four short rows. */
    .add-grid.lean button.add {
      flex-direction: row; align-items: center; gap: 8px; height: 34px; padding: 0 10px; border-radius: 8px;
      background: var(--wa-card); border-color: var(--wa-line);
    }
    .add-grid.lean button.add .add-name { justify-content: flex-start; gap: 8px; }
    /* The colour chip: the same square that marks the kind in the Layers rows
       and the inspector, at the size a button can spare. */
    button.add .k { width: 8px; height: 8px; border-radius: 2px; background: var(--k); flex: none; }
    button.add {
      display: flex; flex-direction: column; align-items: stretch; gap: 7px; padding: 7px 7px 8px; border-radius: 10px;
      font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; color: var(--wa-ink); white-space: nowrap;
      background: color-mix(in srgb, var(--k) 10%, var(--wa-card)); border: 1px solid color-mix(in srgb, var(--k) 28%, transparent);
      transition: background-color .12s ease-out, border-color .12s ease-out, transform .12s ease-out, box-shadow .12s ease-out;
    }
    button.add:hover:not(:disabled) {
      background: color-mix(in srgb, var(--k) 18%, var(--wa-card)); border-color: color-mix(in srgb, var(--k) 55%, transparent);
    }
    button.add:active:not(:disabled) { transform: translateY(1px); }
    button.add:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--k) 30%, transparent); }
    button.add:disabled { opacity: .45; cursor: default; }
    /* The well is a fixed shape, not a fixed height: the column is whatever a
       third of the panel happens to be, and the samples are drawn to scale
       with it. */
    button.add .well {
      display: block; width: 100%; aspect-ratio: 120 / 46; border-radius: 7px; overflow: hidden;
      background: #000; border: 1px solid color-mix(in srgb, var(--k) 30%, var(--wa-line-strong));
      box-sizing: border-box;
    }
    button.add svg.shot { display: block; width: 100%; height: 100%; }
    button.add .add-name { display: flex; align-items: center; justify-content: center; gap: 6px; }
    button.add svg.ui-icon { color: var(--k); width: 14px; height: 14px; flex: none; }
    /* The presets are one wrapped row under the kinds, opened by a label
       rather than a sentence: they are a shortcut, not a second offer. */
    .presets { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 10px; }
    .presets-l {
      margin-right: 4px; font-size: 11px; font-weight: 700; letter-spacing: .08em;
      text-transform: uppercase; color: var(--wa-muted);
    }
    button.preset {
      font: inherit; font-size: 12px; font-weight: 600; height: 26px; padding: 0 10px; border-radius: 999px; cursor: pointer;
      border: 0; background: var(--wa-panel); color: color-mix(in srgb, var(--wa-ink) 78%, var(--wa-muted));
      transition: color .12s ease-out, background-color .12s ease-out;
    }
    button.preset:hover:not(:disabled) { color: var(--wa-ink); background: color-mix(in srgb, var(--wa-ink) 10%, var(--wa-panel)); }

    /* Layers: one row per layer, coloured by kind, the shape pinned last.
       The picture size is a variable on the list, set by the S/M/L control in
       the card's title bar, so one change resizes every row's picture and the
       column that holds it. */
    /* Only as tall as its rows, so the shape row sits right under the last
       layer; it shrinks and scrolls once the card runs out of room. */
    .layers {
      display: flex; flex-direction: column; gap: 2px; flex: 0 1 auto; min-height: 0;
      overflow-y: auto; overflow-x: hidden; scrollbar-width: thin;
    }
    /* A row is a line of a list, not a card: no outline at rest, and the eye
       finds the selection by its wash rather than by counting borders. */
    .layer {
      display: grid; grid-template-columns: 16px 3px var(--thumb-w) minmax(0, 1fr) auto; align-items: center; gap: 8px;
      min-height: 46px; padding: 0 6px 0 4px; border-radius: var(--wa-r-sm);
      /* The list is a scrolling flex column: without this, expanded rows
         shrink to their minimum and their lines pile on top of each other. */
      flex: none;
      border: 0 solid transparent; background: transparent; background-clip: padding-box;
      cursor: pointer; user-select: none; position: relative; font-size: 13px;
      transition: background-color .12s ease-out, box-shadow .12s ease-out,
        border-top-width .1s ease-out, border-bottom-width .1s ease-out;
    }
    /* A group's members keep a faint ground of their own, so they read as
       nested rather than as another run of top-level rows. */
    .layer.kid { background: color-mix(in srgb, var(--wa-panel) 55%, transparent); }
    .layer:hover { background: var(--wa-panel); }
    /* The selected row: one cool wash and a ring, the same one wherever a row
       is selected, so eight kind colours never fight the selection. */
    .layer.hl { background: var(--wa-sel-bg); box-shadow: inset 0 0 0 1px var(--wa-sel-ring); }
    .layer:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.pick { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .layer.lit { background: var(--wa-sel-bg); box-shadow: inset 0 0 0 2px var(--wa-accent); }
    /* A member of the selected group: lit in the folder's colour, without
       the selected row's ring, so the group reads as one block. */
    .layer.held { background: color-mix(in srgb, ${De(oe.group)} 12%, var(--wa-panel)); }
    .layer .grip { color: var(--wa-line-strong); display: grid; place-items: center; cursor: grab; }
    .layer:hover .grip { color: var(--wa-muted); }
    .layer .grip svg { width: 15px; height: 15px; }
    .layer .bar { width: 3px; height: 26px; border-radius: 2px; background: var(--k); }
    /* The layer's own picture, cropped to it, on the black face. The rounded
       black well is the picture's frame, so an empty thumb still reads as a
       slot rather than a hole. */
    .layer .thumb {
      width: var(--thumb-w); height: var(--thumb-h); border-radius: 4px; overflow: hidden; flex: none;
      background: #000; border: 0; box-sizing: border-box; display: block;
    }
    .layer .thumb svg { display: block; width: 100%; height: 100%; }
    .layer.dim .thumb { opacity: .6; }
    .layer .name { display: flex; flex-direction: column; min-width: 0; gap: 1px; }
    .layer .name b { font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
    .layer .name .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .layer .name .glyph svg { width: 16px; height: 16px; display: block; }
    .layer .name small { color: var(--wa-muted); font-size: 11.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .layer .name small .val-tok { color: var(--wa-val); }
    .layer .kind { font-size: 11.5px; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--wa-muted); }
    .layer.dim .name b { opacity: .55; }
    .layer .right { display: flex; align-items: center; gap: 2px; }
    .layer .badges { display: inline-flex; gap: 4px; }
    .badge {
      display: inline-flex; align-items: center; height: 18px; padding: 0 6px; border-radius: 4px;
      font-size: 10.5px; font-weight: 700; letter-spacing: .02em; white-space: nowrap;
      background: color-mix(in srgb, var(--wa-ink) 8%, transparent); color: var(--wa-muted);
    }
    .badge.tap { color: #c2185b; background: rgba(236,64,122,.14); }
    .badge.states { color: #8a5a00; background: rgba(249,168,37,.18); }
    :host([dark]) .badge.tap { color: var(--wa-tap); background: color-mix(in srgb, var(--wa-tap) 22%, transparent); }
    :host([dark]) .badge.states { color: var(--wa-states); background: color-mix(in srgb, var(--wa-states) 22%, transparent); }
    /* Reserved, not removed: taking the actions out of the layout made the
       name change width the moment the pointer arrived. The badges step aside
       for them instead, so the row keeps its width. */
    .layer .acts { display: none; gap: 0; }
    .layer:hover .acts, .layer.hl .acts, .layer:focus-within .acts { display: inline-flex; }
    .layer:hover .badges, .layer.hl .badges, .layer:focus-within .badges { display: none; }
    .layer .acts button.icon { width: 24px; height: 24px; }
    .layer .acts svg.ui-icon { width: 15px; height: 15px; }
    /* The row being dragged leaves the list. The slot opening under the
       pointer already says where the layer is going, so a ghost of it left
       behind in its old place is one thing too many to read.

       Collapsed, not removed: taking the drag source out of the document
       cancels the drag. The negative margin eats the second of the two 6px
       gaps a zero-height row would otherwise sit between. */
    .layer.dragging, .group-kids.dragging {
      height: 0; min-height: 0; margin-top: -1px; margin-bottom: -1px;
      padding-top: 0; padding-bottom: 0; border-top-width: 0; border-bottom-width: 0;
      opacity: 0; overflow: hidden;
    }
    /* The shape row closes the list, under a hairline that runs the full
       width of the card: it is the ground everything else is drawn on, not
       another layer in the stack, so nothing can be dropped below it. */
    .layer.pinned {
      flex: none; margin: 0 -8px; padding: 0 14px 0 12px; min-height: 40px; border-radius: 0;
      border-top: 1px solid var(--wa-line);
    }
    .layer.pinned .grip { cursor: default; }
    .layer.pinned .bar { background: repeating-linear-gradient(180deg, var(--k) 0 3px, transparent 3px 6px); }
    .group-cta {
      display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 8px; margin-bottom: 6px; border-radius: 8px;
      border: 1px solid color-mix(in srgb, var(--wa-accent) 30%, transparent);
      background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
    }
    .group-cta .spacer { flex: 1; }
    /* Picked for grouping: an accent ring, since the kind colour is taken. */
    .layer.multi { box-shadow: inset 0 0 0 1px var(--wa-accent); }
    /* A folder row: the chevron folds it, the lock says whether it moves as
       one, and its members sit indented under a guide line. */
    .layer.group .chev {
      font: inherit; background: transparent; border: 0; color: var(--wa-muted); padding: 0; cursor: pointer;
      width: 24px; height: 24px; border-radius: 6px; display: grid; place-items: center; flex: none;
    }
    .layer.group .chev:hover { background: color-mix(in srgb, var(--wa-ink) 10%, transparent); }
    .layer.group .chev svg { width: 15px; height: 15px; transition: transform .15s ease-out; }
    .layer.group .chev[aria-expanded="false"] svg { transform: rotate(-90deg); }
    /* A folder shows a folder where a layer shows its picture. */
    .layer.group .folder { display: grid; place-items: center; width: var(--thumb-w); color: var(--wa-muted); }
    .layer.group .folder svg { width: 17px; height: 17px; }
    .layer.group .bar { background: repeating-linear-gradient(180deg, var(--k) 0 5px, transparent 5px 8px); }
    .layer.group.drop-into { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .layer .lockbtn { width: 24px; height: 24px; opacity: .55; }
    .layer .lockbtn svg.ui-icon { width: 15px; height: 15px; }
    .layer .lockbtn.on { opacity: 1; color: ${De(oe.locked)}; }
    .layer:hover .lockbtn, .layer.hl .lockbtn { opacity: 1; }
    .group-kids {
      margin: 0 0 0 12px; padding-left: 10px; display: flex; flex-direction: column; gap: 2px;
      border-left: 2px solid color-mix(in srgb, var(--wa-line) 60%, transparent);
    }
    /* Drop targets last, so the slot beats whatever the row already had on its
       own border.

       The row grows a tall transparent border on the side the dragged layer
       will land, so every row past it really does step out of the way, and a
       dashed slot is drawn in the space that opens. The gap belongs to the
       row's own box, so a pointer resting in it still counts as hovering that
       row; a gap made of margin would leave the row, close, and flap. */
    .layer.drop-before, .layer.drop-after { z-index: 1; }
    .layer.drop-before { border-top: ${hn}px solid transparent; }
    .layer.drop-after { border-bottom: ${hn}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${hn}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${hn}px; }
    .layer.drop-after::after { bottom: -${hn}px; }

    /* Expanded rows say more: a third line about what the layer is made of,
       its meta free to wrap, and the badges kept beside the buttons rather
       than swapped for them. */
    .layer.rich .name small { white-space: normal; overflow: visible; text-overflow: clip; }
    .layer.rich .facts { display: flex; flex-wrap: wrap; gap: 2px 8px; margin-top: 2px; font-size: 11.5px; color: var(--wa-muted); }
    .layer.rich .facts .fact { white-space: nowrap; }
    .layer.rich .facts .fact b { font-weight: 600; color: var(--wa-ink); opacity: .75; }
    /* An expanded row keeps both the badges and the buttons, so the buttons
       cannot appear out of nothing the way they do on a compact row: arriving
       would widen the right end, squeeze the facts, wrap them onto another
       line and grow the row under the pointer. The buttons hold their place
       at all times and only turn visible, and the right end never wraps, so
       hovering changes colour and nothing else. */
    .layer.rich .right { flex-wrap: nowrap; justify-content: flex-end; gap: 4px; }
    .layer.rich .acts { display: inline-flex; visibility: hidden; }
    .layer.rich:hover .acts, .layer.rich.hl .acts, .layer.rich:focus-within .acts { visibility: visible; }
    .layer.rich:hover .badges, .layer.rich.hl .badges, .layer.rich:focus-within .badges { display: inline-flex; }
    ${De(w1())}

    /* Two small segmented controls in the Layers title: how big the row
       pictures are, and how much each row says. */
    .seg {
      display: inline-flex; flex: none; height: 24px; padding: 2px; gap: 2px; border: 0;
      border-radius: 7px; background: var(--wa-panel); box-shadow: inset 0 0 0 1px var(--wa-line);
    }
    .seg button {
      font: inherit; font-size: 11px; font-weight: 600; letter-spacing: .02em; line-height: 1;
      padding: 0 6px; min-width: 22px; border: 0; border-radius: 5px; background: transparent; color: var(--wa-muted);
      cursor: pointer; display: grid; place-items: center;
      transition: color .12s ease-out, background-color .12s ease-out, box-shadow .12s ease-out;
    }
    .seg button:hover { color: var(--wa-ink); }
    .seg button.on { color: var(--wa-ink); background: var(--wa-card); box-shadow: 0 1px 2px rgba(0,0,0,.08); }
    .seg button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .seg button svg.ui-icon { width: 13px; height: 13px; }
    /* The form-sized segmented control: a setting with two to four choices
       shows them all, the way a dropdown never can. Buttons share the width
       evenly and clip a label rather than wrap it, so a row never grows a
       second line, and the tint takes the section's colour where there is one. */
    .seg.wide { display: flex; width: 100%; min-width: 0; height: 24px; border-radius: 6px; background: var(--wa-field); box-shadow: none; }
    .seg.wide button {
      flex: 1 1 0; min-width: 0; padding: 0 4px; border-radius: 4px;
      font-size: 11.5px; font-weight: 500; letter-spacing: 0; line-height: 20px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; text-align: center;
    }
    .seg.wide button.on { color: var(--wa-ink); background: var(--wa-seg-on); box-shadow: 0 1px 1.5px rgba(0,0,0,.22); }
    /* The choice a setting falls back to while it has none of its own. */
    .seg.wide button.inh { color: var(--wa-ink); outline: 1px dashed var(--wa-muted); outline-offset: -3px; }
    .seg.wide button:focus-visible { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--c, var(--wa-accent)) 60%, transparent); }
    .seg.wide button:disabled, .seg.wide button:disabled:hover { color: var(--wa-muted); opacity: .38; cursor: not-allowed; }
    .field.seg-field { align-items: center; }
    /* Readings: which of two ways to count, then how many when it is a count. */
    .readings-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .readings-row .seg.wide { flex: 1 1 auto; width: auto; }
    /* Three digits is the most this box ever holds. The type selector is
       there to outrank the ".field input[type=number]" full-width rule. */
    .field .readings-row input.short[type=number] { width: 46px; flex: none; text-align: right; }
    /* The count used to sit against the buttons as a bare number, which reads
       as a setting nobody named. Two quiet words either side make the row a
       sentence, "Average into 24 slots", and the number stops being a riddle. */
    .readings-row .readings-into, .readings-row .readings-unit {
      font-size: 12px; color: var(--wa-muted); flex: none; white-space: nowrap;
    }
    .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 8px; }
    .grid3 .field { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }
    .grid3 .field > span { font-size: 12px; }
    /* The Layers title carries those controls, so it is allowed a second line
       in a narrow column instead of squeezing them. The auto margin keeps the
       pair on the right whichever line they land on. */
    .panel-title.tools { flex-wrap: wrap; row-gap: 8px; }
    .panel-title .tool-set { display: inline-flex; gap: 6px; margin-left: auto; }

    /* The canvas column: one card holding the bar, the big preview and the
       strip of things about the whole complication. */
    /* The canvas column is three blocks stacked: what the whole complication
       is, the face itself, and the two lists of values under it. */
    .column.canvas { display: flex; flex-direction: column; gap: 8px; }
    /* The bar and the two lists keep their own height; the face takes what is
       left, so the lists under it are on screen without scrolling. */
    .column.canvas > .card.canvas-card {
      padding: 0; overflow: hidden; flex: 1 1 auto; min-height: 260px;
      display: flex; flex-direction: column;
    }
    .banner { padding: 10px 14px; border-radius: 8px; font-size: 13px; background: var(--wa-panel); flex: none; }
    .banner.warn { border-left: 4px solid var(--warning-color, #ffa600); }
    .banner.err { border-left: 4px solid var(--error-color, #db4437); }
    .banner .acts { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }

    /* The watch gate: the one screen a too-old watch gets instead of the
       editor. Centred like a welcome page, with the accent reserved for the
       glyph and the step numbers, so it reads as a considered pause rather
       than an error strip. */
    .gate {
      flex: 1 1 auto; min-height: 0; overflow: auto;
      display: flex; align-items: flex-start; justify-content: center;
      padding: clamp(24px, 8vh, 72px) 24px 40px;
    }
    .gate-card {
      width: min(600px, 100%);
      background: var(--wa-card);
      border-radius: var(--wa-r-lg);
      box-shadow: 0 0 0 1px var(--wa-line);
      padding: 36px 40px 32px;
      display: flex; flex-direction: column; align-items: flex-start; gap: 0;
      position: relative; overflow: hidden;
    }
    .gate-glyph {
      position: relative; width: 52px; height: 52px; border-radius: 16px;
      display: grid; place-items: center; color: var(--wa-accent);
      background: color-mix(in srgb, var(--wa-accent) 14%, var(--wa-card));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-accent) 30%, transparent);
      margin-bottom: 22px;
    }
    .gate-glyph svg { width: 28px; height: 28px; }
    .gate-eyebrow {
      position: relative; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
      color: var(--wa-accent); margin-bottom: 10px;
    }
    .gate-title {
      position: relative; margin: 0 0 10px; font-size: 24px; line-height: 1.2; font-weight: 700;
      letter-spacing: -.015em; color: var(--wa-ink); text-wrap: balance;
    }
    .gate-lead { position: relative; margin: 0 0 26px; font-size: 14.5px; line-height: 1.55; color: var(--wa-muted); max-width: 52ch; }
    .gate-steps { position: relative; list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0; width: 100%; }
    .gate-steps li {
      display: grid; grid-template-columns: 30px 1fr; gap: 14px; align-items: start;
      padding: 14px 0; border-top: 1px solid var(--wa-line);
    }
    .gate-steps li:last-child { border-bottom: 1px solid var(--wa-line); }
    .gate-n {
      width: 30px; height: 30px; border-radius: 999px; display: grid; place-items: center;
      font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums;
      color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-accent) 28%, transparent);
    }
    .gate-steps b { display: block; font-size: 14.5px; font-weight: 650; color: var(--wa-ink); margin: 5px 0 3px; }
    .gate-steps span:not(.gate-n) { display: block; font-size: 13.5px; line-height: 1.5; color: var(--wa-muted); }
    .gate-foot { position: relative; margin-top: 18px; font-size: 13px; color: var(--wa-muted); }
    @media (max-width: 640px) {
      .gate { padding: 16px 12px 28px; }
      .gate-card { padding: 26px 22px 24px; }
      .gate-title { font-size: 21px; }
    }
    /* Two rows with a hairline between them: which shape is being edited on
       top, how the face is looked at underneath. The tool row sits a shade
       darker so the stage below reads as a third, separate surface. */
    .canvas-bar {
      display: flex; flex-direction: column; font-size: 13px; flex: none;
      border-bottom: 1px solid var(--wa-line); background: var(--wa-raised);
    }
    .bar-row { display: flex; align-items: center; gap: 6px; padding: 6px 10px; flex-wrap: wrap; }
    .bar-row.tools {
      border-top: 1px solid var(--wa-line);
      background: color-mix(in srgb, var(--wa-raised) 55%, var(--wa-input));
    }
    .bar-sep { width: 1px; height: 18px; background: var(--wa-line-strong); margin: 0 2px; flex: none; }
    .canvas-bar .spacer { flex: 1; min-width: 0; }
    /* The shapes the complication has, as one segmented control. */
    .shape-seg {
      display: inline-flex; flex-wrap: wrap; gap: 2px; padding: 2px; border-radius: 10px;
      background: var(--wa-input); box-shadow: inset 0 0 0 1px var(--wa-line);
    }
    .shape-seg button.tab { height: 30px; padding: 0 10px; border-radius: 8px; }
    .shape-adds { display: inline-flex; flex-wrap: wrap; gap: 4px; }
    .shape-adds button.tab { height: 28px; padding: 0 9px; gap: 5px; font-weight: 500; }
    .shape-adds button.tab svg { width: 12px; height: 12px; }
    .canvas-bar .hint { margin: 0; }
    /* Shape tabs: one per family, drawn with a real picture of what that shape
       holds. A family the complication does not have is a dashed invitation. */
    .tab-wrap { position: relative; display: inline-flex; align-items: center; }
    button.tab {
      display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px; border-radius: 9px;
      font: inherit; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); cursor: pointer;
      background: transparent; border: 1px solid transparent; white-space: nowrap;
      transition: background-color .12s ease-out, color .12s ease-out, box-shadow .12s ease-out;
    }
    button.tab:hover:not(:disabled) { color: var(--wa-ink); }
    button.tab[aria-pressed="true"] { background: var(--wa-card); color: var(--wa-ink); box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 0 0 1px var(--wa-line); }
    button.tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tab.off { border: 1px dashed var(--wa-line-strong); color: color-mix(in srgb, var(--wa-muted) 80%, var(--wa-card)); }
    button.tab small { font-weight: 500; opacity: .75; }
    .tab .art { display: grid; place-items: center; flex: none; height: 16px; }
    .tab .art svg { display: block; max-height: 16px; max-width: 34px; width: auto; height: auto; background: #000; border-radius: 3px; }
    .tab.circular .art svg { border-radius: 50%; }
    .tab.corner .art svg { background: #2c2c2e; }
    /* The tab pictures are small, so the Home Screen tiles take a share of
       their own box as the corner rather than a flat radius. */
    .tab.small .art svg { border-radius: 16.3%; }
    .tab.medium .art svg { border-radius: 7.7% / 16.3%; }
    .tab.large .art svg { border-radius: 7.7% / 7.4%; }
    .tab.xlarge .art svg { border-radius: 7.7% / 4.8%; }
    .tab .art .inline-line { font-size: 8px; padding: 2px 5px; min-width: 0; display: inline-flex; align-items: center; gap: 3px; border-radius: 999px; background: #000; color: #fff; }
    .tab .art .inline-line svg { background: transparent; border-radius: 0; }
    /* The remove button rides beside its tab and only while the pointer is on it. */
    .tab-wrap .tab-x { opacity: 0; pointer-events: none; margin-left: -4px; }
    .tab-wrap:hover .tab-x, .tab-wrap .tab-x:focus-visible { opacity: .7; pointer-events: auto; }
    .tab-wrap .tab-x:hover:not(:disabled) { opacity: 1; }
    .tab-wrap .tab-x:disabled { opacity: .2; }
    /* A control drawn as a box with a muted word inside it, so "Preview as" is
       part of the field rather than a label floating beside it. */
    .inbox {
      display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 4px 0 10px; border-radius: 7px;
      border: 1px solid var(--wa-line); background: var(--wa-input); flex: none;
    }
    .inbox .pre { color: var(--wa-muted); font-weight: 600; font-size: 12.5px; white-space: nowrap; }
    .inbox select { height: 26px; border: 0; background-color: transparent; padding-left: 0; }
    .inbox select:focus-visible { box-shadow: none; }
    /* The three face toggles wrap as one block, so a narrow bar never leaves
       one of them stranded on the line above the other two. */
    .over .face-tools { display: inline-flex; gap: 6px; flex: none; }
    /* The line-up strip: eight glyphs with no words, so it stays one block on
       a narrow bar. A hair tighter than the toggles beside it, since the six
       aligns read as one control. */
    .over .align-tools { display: inline-flex; gap: 1px; flex: none; }
    .over .align-tools svg { width: 17px; height: 17px; }
    /* The strip over the face: a small raised pill on the dotted stage, centred
       over the preview and moving with it, so the tools that act on the
       selection sit next to the selection. */
    .over {
      display: flex; align-items: center; justify-content: center; flex-wrap: nowrap; gap: 6px;
      position: sticky; top: 0; z-index: 4; justify-self: center;
      padding: 5px 8px; border-radius: 12px; font-size: 13px; max-width: 100%;
      background: color-mix(in srgb, var(--wa-raised) 92%, transparent);
      box-shadow: 0 0 0 1px var(--wa-line), 0 6px 18px rgba(0,0,0,.18);
    }
    /* The pill never wraps and never leaves: it sticks to the top of the stage
       when the face is scrolled, and on a narrow canvas the two words go and
       the glyphs stay, so every button is always there to press. */
    .over button.pick { white-space: nowrap; }
    @container (max-width: 860px) {
      .over .word { display: none; }
      .over button.pick { width: 30px; padding: 0; justify-content: center; }
      .over button.pick .glyph { margin: 0; }
      .over .grid-tool.on button.pick { padding-right: 0; }
    }
    /* With snapping on, the button and its size read as one accent pill. */
    /* With the grid on, the switch and its size read as one accent pill. */
    .grid-tool { display: inline-flex; align-items: center; position: relative; }
    .grid-tool.on button.pick { border-radius: 8px 0 0 8px; padding-right: 8px; }
    button.grid-step {
      height: 30px; font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
      border: 0; border-left: 1px solid color-mix(in srgb, var(--wa-accent-ink) 30%, transparent);
      background-color: color-mix(in srgb, var(--wa-accent) 82%, #000); color: var(--wa-accent-ink);
      padding: 0 6px 0 8px; border-radius: 0 8px 8px 0; display: inline-flex; align-items: center; gap: 3px; font-variant-numeric: tabular-nums;
    }
    button.grid-step svg { width: 12px; height: 12px; opacity: .8; }
    button.grid-step:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .grid-tool .pop-menu { left: 0; right: auto; }
    button.pick .glyph svg { width: 15px; height: 15px; display: block; }
    /* The preview bar's own menus (grid size, Preview as), in place of native
       selects, whose closing menu made Chrome on macOS hold the next click. */
    .pop-menu {
      position: absolute; top: calc(100% + 6px); right: 0; z-index: 50; min-width: 84px;
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
    .case-tool { position: relative; display: inline-flex; }
    .case-tool .pop-menu { left: -6px; right: auto; min-width: 150px; }
    button.case-pick {
      display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 6px 0 0; border: 0; border-radius: 6px;
      background: transparent; color: var(--wa-ink); font: inherit; font-weight: 500; cursor: pointer; white-space: nowrap;
    }
    button.case-pick svg { width: 14px; height: 14px; opacity: .7; }
    /* The Colour menu: a round swatch per tint, and a split one for full colour.
       While a tint is on the box takes an accent edge, so a tinted preview is
       never mistaken for the real colours. */
    .tint-box.on { border-color: var(--wa-accent); box-shadow: 0 0 0 1px var(--wa-accent); }
    .tint-dot {
      display: inline-block; flex: none; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; vertical-align: -1px;
      background: var(--sw); box-shadow: inset 0 0 0 1px rgba(128,128,128,.5);
    }
    button.case-pick .tint-dot { margin-right: 0; }
    .tint-dot.full { background: conic-gradient(#FF453A 0 25%, #FFD60A 0 50%, #30D158 0 75%, #0A84FF 0); }
    button.case-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .canvas-bar label { display: inline-flex; align-items: center; gap: 8px; color: var(--wa-muted); }
    .canvas-bar label select { color: var(--wa-ink); font-weight: 500; }
    button.pick {
      font: inherit; font-size: 12.5px; font-weight: 600; padding: 0 10px; height: 30px; border-radius: 8px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
      border: 1px solid transparent; background: transparent; color: var(--wa-muted);
      transition: background-color .12s ease-out, color .12s ease-out;
    }
    button.pick:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
    button.pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.pick.on { background: var(--wa-accent); color: var(--wa-accent-ink); }
    button.pick.only-icon { width: 30px; padding: 0; justify-content: center; }
    button.pick .glyph { font-size: 13px; line-height: 1; }
    /* The stage: a faint dot grid under a soft accent glow, so the watch face
       sits on a work surface rather than on the card. */
    .stage {
      display: grid; justify-items: center; align-content: center; gap: 20px; padding: 20px; flex: 1 1 auto; min-height: 0; overflow: auto;
      container-type: inline-size;
      background:
        radial-gradient(ellipse at 50% 35%, color-mix(in srgb, var(--wa-accent) 10%, transparent) 0, transparent 65%),
        radial-gradient(color-mix(in srgb, var(--wa-ink) 9%, transparent) 1px, transparent 1px) 0 0 / 18px 18px;
    }
    .preview { text-align: center; position: relative; width: 100%; min-width: 0; }
    .preview svg {
      display: block; margin: 0 auto; background: #000; border-radius: 18px; touch-action: none;
      height: auto; max-width: 100%;
      box-shadow: 0 0 0 1px rgba(255,255,255,.08), 0 20px 50px rgba(0,0,0,.45);
    }
    /* Resize handles sit just outside a layer's corners, so on a layer at the
       slot edge they reach past the face. */
    .preview > svg.complication { overflow: visible; }
    .preview.rectangular svg { width: 100%; max-width: 900px; }
    .preview.circular svg { width: min(100%, 440px); border-radius: 50%; }
    .preview.corner svg { width: min(100%, 420px); background: #2c2c2e; }
    /* The four Home Screen tiles. Each is capped at a width that leaves the
       whole tile on screen at its own ratio (square, 2.1:1, 0.96:1, 0.62:1),
       and takes the system's continuous corner as a share of its box, so the
       black behind the drawing rounds with it at any size. */
    .preview.small svg { width: min(100%, 460px); border-radius: 16.3%; }
    .preview.medium svg { width: min(100%, 880px); border-radius: 7.7% / 16.3%; }
    .preview.large svg { width: min(100%, 520px); border-radius: 7.7% / 7.4%; }
    .preview.xlarge svg { width: min(100%, 380px); border-radius: 7.7% / 4.8%; }
    .preview.picking svg, .preview.picking svg * { cursor: crosshair; }
    .preview.inline .inline-line {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 220px;
      padding: 8px 18px; border-radius: 999px; background: #000; color: #fff; font-size: 15px;
    }
    .preview.inline .inline-line svg { display: inline-block; margin: 0; background: transparent; border-radius: 0; }
    .preview.inline .inline-line.missing { color: #999; font-style: italic; }
    /* The line under the face: which shape, how big, and what a drag does. The
       size is set in mono, because it is a measurement rather than prose. */
    .under {
      display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px;
      text-align: center; font-size: 12.5px; font-weight: 500; color: var(--wa-muted);
    }
    .under b { color: var(--wa-ink); font-weight: 700; }
    .under .size { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    .under .dot { color: var(--wa-line-strong); }
    .under .tail b { font-weight: 700; }
    /* The two lists under the face: what the complication defines for itself,
       and what the house is telling it right now. Stacked, so each title and
       each value line gets the whole width instead of wrapping into a column
       half as wide. */
    .under-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; flex: none; }
    .card.tint-values {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${De(oe.complication)} 8%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${De(oe.complication)} 25%, var(--wa-card));
    }
    .card.tint-states {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${De(oe.states)} 12%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${De(oe.states)} 35%, var(--wa-card));
    }
    .card.tint-values .panel-title, .card.tint-states .panel-title { margin-bottom: 6px; }
    /* One value, one 30px white line: name, then what it reads. */
    .vrow {
      display: flex; align-items: center; gap: 8px; width: 100%; min-height: 30px; padding: 0 8px;
      border-radius: 7px; background: var(--wa-card); font-size: 13px; text-align: left;
    }
    .vrow .spacer { flex: 1; min-width: 0; }
    .vrow .nm { font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .vrow .kbar { width: 3px; height: 14px; border-radius: 2px; background: var(--k); flex: none; }
    /* A card title opens with a tinted mark, the same one the inspector's
       cards wear, so every column speaks the same language. */
    .panel-title .swatch {
      width: 22px; height: 22px; border-radius: 6px; flex: none; display: grid; place-items: center;
      background: var(--c, var(--wa-accent)); border: 0; color: #fff;
    }
    .panel-title .swatch svg { width: 13px; height: 13px; stroke-width: 2.4; }
    /* The complication card's Flash row: the switch, then the colour it
       flashes, or the word Off. */
    .flash-row { display: flex; align-items: center; gap: 8px; min-width: 0; min-height: 26px; }
    .flash-row input.flash-color { width: 34px; height: 22px; padding: 1px 2px; border-radius: 5px; }
    .flash-row .muted { color: var(--wa-muted); font-size: 12px; }
    /* Shared values: a row per named value. The whole row opens its editor
       in place, under the row, so it carries the hover and open states a
       button would, and the delete button stays out of the way until the
       pointer is on it. */
    .values-list .data { display: flex; flex-direction: column; gap: 6px; }
    /* A row and its open editor, grouped only so a click can tell whether it
       landed on the open value; the list lays them out as before. */
    .values-list .vitem { display: contents; }
    /* Marks a shared value's row under the preview, so it is not read as
       an entity. */
    .vchip .vtag {
      flex: none; padding: 0 5px; border-radius: 4px; font-size: 10.5px; font-weight: 600; line-height: 16px;
      color: var(--wa-muted); background: color-mix(in srgb, var(--wa-ink) 8%, transparent);
    }
    .values-list .value-open {
      display: flex; flex-direction: column; gap: 4px; margin-top: -2px; padding: 6px 8px 8px;
      border-radius: 7px; background: color-mix(in srgb, var(--c) 5%, var(--wa-card));
    }
    .values-list .value-open .value-editor { display: flex; flex-direction: column; gap: 4px; }
    .values-list.empty-list .panel-title { margin-bottom: 0; }
    /* The card's "?" always shows: unlike an inspector card, this one has
       no header to hover first. */
    .values-list .panel-title button.sec-help { opacity: 1; }
    .values-list .shared-help {
      margin: 0 0 8px; padding: 8px 10px; border-radius: 7px; background: var(--wa-card);
      font-size: 12.5px; line-height: 1.45; color: var(--wa-ink);
    }
    .values-list .shared-help p { margin: 0 0 6px; }
    .values-list .shared-help ol { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 3px; }
    /* Now: the printed value as a token, spaces kept, so a prefix of "xx "
       shows its space; or the missing step in muted words. */
    .field.now-field .now-v { color: var(--wa-ink); }
    .now-v .now-tok {
      display: inline-block; max-width: 100%; padding: 1px 6px; border-radius: 5px; white-space: pre-wrap; overflow-wrap: anywhere;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; font-weight: 600;
      color: var(--wa-val); background: color-mix(in srgb, var(--wa-val) 12%, transparent);
    }
    .now-v.none { font-style: italic; }
    details.sub.format summary .sum-note { margin-left: 6px; color: var(--wa-muted); font-weight: 400; }
    /* Under Layers, the list takes at most part of the column and scrolls, so
       an open value never pushes the layer rows out of sight. */
    .column.left .card.values-list { max-height: 45%; overflow-y: auto; scrollbar-width: thin; }
    .layout.cols-1 .column.left .card.values-list { max-height: none; overflow: visible; }
    .values-list .datum {
      padding: 0 8px; border-radius: 7px; gap: 8px;
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .values-list .datum + .datum { box-shadow: none; }
    .values-list .datum:hover { box-shadow: inset 0 0 0 1px var(--wa-accent); }
    /* Selected: the same tint the inspector gives its complication section. */
    .values-list .datum.hl { box-shadow: inset 0 0 0 1px var(--c); background: color-mix(in srgb, var(--c) 10%, var(--wa-card)); }
    .values-list .datum .meta {
      flex: none; min-width: 0; max-width: 140px; opacity: 1; color: var(--wa-val); font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
      overflow: hidden; text-overflow: ellipsis; white-space: pre;
    }
    .values-list .datum .meta.none { font-family: inherit; font-style: italic; color: var(--wa-muted); }
    .values-list .datum button.icon { opacity: 0; pointer-events: none; flex: none; }
    .values-list .datum:hover button.icon, .values-list .datum:focus-within button.icon { opacity: .7; pointer-events: auto; }
    .values-list .datum button.icon:hover:not(:disabled), .values-list .datum button.icon:focus-visible { opacity: 1; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
    .chips .muted { color: var(--wa-muted); font-size: 12px; }
    /* Every entity the face reads, one white line each. The whole line is the
       button, so clicking anywhere on it opens the test value. */
    .chips.values { display: flex; flex-direction: column; flex-wrap: nowrap; align-items: stretch; gap: 6px; }
    .vchip { border: 0; cursor: pointer; color: inherit; transition: box-shadow .12s ease-out; }
    .vchip:hover { box-shadow: inset 0 0 0 1px var(--wa-accent); }
    .vchip b { font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .vchip .val {
      flex: none; color: var(--wa-val); font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
    }
    .vchip.testing { box-shadow: inset 0 0 0 1px var(--wa-states); }
    .vchip.testing .val { color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    .vchip input[type=text] { width: 110px; min-height: 24px; font: inherit; font-size: 13px; padding: 2px 6px; border-radius: 6px; border: 1px solid var(--wa-states); background: var(--wa-card); color: inherit; }
    /* A test value's control sits at the end of its row: a slider and its
       reading for a number, a picker for known states, the reading alone for
       text. The row is no longer a button, so it drops the pointer. */
    .vchip.ctl { cursor: default; }
    .vchip .test-ctl { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex: 0 1 50%; min-width: 0; }
    .vchip .test-ctl input[type=range] { flex: 1 1 auto; min-width: 60px; height: 16px; margin: 0; accent-color: var(--wa-states); cursor: pointer; }
    .vchip .test-ctl select { min-width: 0; max-width: 100%; font: inherit; font-size: 12px; min-height: 24px; padding: 2px 6px; border-radius: 6px; cursor: pointer; }
    .vchip button.val { background: none; border: 0; padding: 0; cursor: text; min-width: 56px; text-align: right; }
    .vchip button.live-reset { flex: none; }
    .testing-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; text-transform: none; letter-spacing: 0; color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    .testing-pill button { font: inherit; font-size: 12px; font-weight: 500; background: var(--wa-states); color: #1a1600; border: 0; border-radius: 999px; padding: 2px 9px; cursor: pointer; }
    .empty { opacity: .6; padding: 24px; text-align: center; }
    /* A shape that draws nothing yet. Tinted in the placement colour rather
       than the accent: it is a statement about where you are, not a thing to
       press, and the buttons inside it carry the press. */
    .blank-shape {
      margin: 10px 0; padding: 10px 12px; border-radius: var(--wa-r-md);
      border: 1px solid color-mix(in srgb, var(--wa-place) 40%, var(--wa-line));
      background: color-mix(in srgb, var(--wa-place) 10%, transparent);
    }
    .blank-shape b { font-size: 13px; }
    .blank-shape .hint { margin: 5px 0 0; }
    .blank-shape .adders { margin-top: 9px; }

    /* The inspector: crumbs on top, then one card per section of the thing
       selected, tinted by what it is. */
    .column.inspector { padding: 10px 12px 12px; container: insp / inline-size; }
    /* The head grows when a long layer name wraps its crumbs onto a second
       line, rather than spilling over the first card. */
    .insp-head { display: flex; flex-wrap: wrap; align-items: center; gap: 0 8px; min-height: 34px; padding: 0; position: sticky; top: 0; background: var(--wa-card); z-index: 5; }
    /* The crumbs keep at least 180px; with less beside it, the One at a time
       button drops under them rather than squeezing every crumb onto its
       own line. */
    .crumbs { flex: 1 1 180px; min-width: 0; display: flex; align-items: center; gap: 2px 6px; flex-wrap: wrap; padding: 4px 0; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); }
    .crumbs button { font: inherit; font-size: 12.5px; font-weight: 600; background: transparent; border: 0; padding: 3px 6px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .insp-head .expand { margin-left: auto; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .crumbs .sep { opacity: .5; }
    .here {
      display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px 3px 6px; border-radius: 6px;
      background: color-mix(in srgb, var(--k) 14%, transparent); border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
      color: var(--wa-ink); font-weight: 500; min-width: 0; max-width: 100%;
    }
    .here .nm { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .here .kchip { flex: none; }
    .kchip { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: var(--k); padding: 1px 5px; border-radius: 3px; }
    .insp-head .expand {
      flex: none; font: inherit; font-size: 12px; font-weight: 600; color: var(--wa-muted); cursor: pointer;
      background: transparent; border: 0; padding: 0 9px; min-height: 26px; border-radius: 8px;
    }
    .insp-head .expand:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .insp-body { padding: 0 0 24px; }
    /* With no layer selected the inspector is the complication: its name, then
       its four actions, which wrap under the name when the column is narrow. */
    .insp-head.comp-head { height: auto; min-height: 34px; flex-wrap: wrap; row-gap: 0; }
    .comp-head .crumbs { flex: 1 1 100px; }
    .comp-acts { display: flex; align-items: center; gap: 0; margin-left: auto; flex: none; }
    .comp-acts button.ghost { font-size: 12px; padding: 0 6px; min-height: 24px; border-radius: 6px; }
    .insp-note { margin: 12px 0 0; font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
    /* One tinted box per subject, in the section's colour, so each card reads
       as its own thing: a 36px header with a small mark, then a body of
       label-left rows. The header's hover runs to the box's edges while the
       rows keep the box's padding. */
    .sec {
      --c: var(--wa-accent);
      margin: 6px 0 0; padding: 0 12px; border-radius: 9px; overflow: hidden;
      background: color-mix(in srgb, var(--c) 7%, var(--wa-card));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 24%, var(--wa-card));
    }
    .sec[data-open="true"] { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 40%, var(--wa-card)); }
    .sec-h {
      display: flex; align-items: center; gap: 8px; height: 36px; margin: 0 -12px; padding: 0 6px 0 12px;
      cursor: pointer; user-select: none; transition: background-color .12s ease-out;
    }
    .sec-h:hover { background: color-mix(in srgb, var(--c) 10%, transparent); }
    .sec-h.pinned { cursor: default; }
    .sec-h.pinned:hover { background: transparent; }
    .sec-h:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--c); }
    :is(.sec-h, .xfer-callout) .swatch {
      width: 18px; height: 18px; border-radius: 5px; border: 0; flex: none; display: grid; place-items: center;
      background: color-mix(in srgb, var(--c) 22%, transparent); color: var(--c);
    }
    :is(.sec-h, .xfer-callout) .swatch svg { width: 11px; height: 11px; stroke-width: 2.2; }
    /* Title and summary on one line: the summary is what the card says while
       it is shut, so it belongs beside the title, not under it. */
    .sec-h .tt { display: flex; flex-direction: row; align-items: center; gap: 8px; min-width: 0; flex: 1; }
    .sec-h h4 { margin: 0; flex: none; font-size: 12.5px; font-weight: 650; letter-spacing: 0; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
    .sec-h .sum { margin-left: auto; min-width: 0; color: var(--wa-muted); font-size: 11.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
    .fgroup > .hint { margin: 2px 0 6px; }
    .fgroup > .hint:last-child { margin-bottom: 4px; }
    .fgroup button.reset-dot { left: -6px; }
    .sec-b > :is(.adders, .chart-numbers, .states-switch, details.sub) { margin-top: 6px; }
    .sec-b > :is(button.small, button.link) { margin: 4px 0; }
    /* Anything in a card that is not a row (help, a note, a strip of buttons)
       starts where the controls start, so the titles keep one clean edge down
       the left. Boxes that hold rows of their own keep the full width. */
    :is(.sec-b, .sec-b :is(.fgroup, .grid2, .grid4, .value-editor, .states, .rich-parts, .part-editor, .rule-box, .case-box, .test-box, .change-box))
      > :is(.hint, .rich-note, .rich-confirm, .adders, .chips, .states-foot, .states-switch, .span-parts, button.small, button.link, select.adder, details.sub):not(.value-pop *) {
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
    /* The reset dot. One control, two places: in the gutter left of a changed
       setting's title, and beside a card's title for everything the card owns.
       It is drawn only while something is away from its default, so the dots
       are the list of what someone changed. The pseudo-element widens the hit
       area without widening the dot. */
    button.reset-dot {
      position: absolute; left: -9px; top: 12px; width: 6px; height: 6px; margin: 0; padding: 0;
      border: 0; border-radius: 50%; background: var(--wa-accent); cursor: pointer; flex: none;
    }
    button.reset-dot::after { content: ""; position: absolute; inset: -7px; }
    button.reset-dot:hover, button.reset-dot:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--wa-accent) 32%, transparent); }
    .sec-h h4 button.reset-dot { position: relative; left: auto; top: auto; }
    /* A layer's name: one header row with the input in place of the summary.
       The title never wraps and the input takes what width is left, down to
       nothing, so the row stays one line in the narrowest column. */
    .name-sec .sec-h { gap: 8px; }
    .name-sec .sec-h input[type=text] {
      flex: 1 1 auto; width: 0; min-width: 0; height: 26px; min-height: 26px; padding: 0 8px; font-size: 12px;
      border-radius: 6px; border-color: transparent; background-color: var(--wa-field);
    }
    .name-sec .sec-h input[type=text]:focus-visible { border-color: var(--c); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 28%, transparent); }
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
    button.sec-help.on { color: var(--wa-accent-ink); background: var(--wa-accent); border-color: transparent; }
    @media (hover: none) { button.sec-help { opacity: 1; } }
    /* Help text waits behind that "?". A plain hint shows only while its
       card's help is on; a warning, an error, or a hint marked keep (a status,
       an empty state, a step that is required) always shows. A value popover
       keeps its hints, since it has no "?" of its own to ask with. */
    .sec[data-help="off"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) { display: none; }
    .sec[data-help="on"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) {
      padding: 6px 9px; border-radius: 7px; background: var(--wa-field); color: var(--wa-ink);
    }
    /* An open card with no help text in it has nothing for its "?" to show. */
    .sec[data-open="true"][data-help="off"]:not(:has(> .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint))) button.sec-help { display: none; }
    /* The picked layers, read only: the Layers list's colour coding without
       its controls, so the eye can check the pick without leaving the form. */
    .picked { display: flex; flex-direction: column; gap: 5px; margin-bottom: 4px; }
    .picked .row { display: grid; grid-template-columns: 4px minmax(0, 1fr); align-items: center; gap: 8px; font-size: 13px; }
    .picked .row .bar { width: 4px; height: 22px; border-radius: 2px; background: var(--k); }
    .picked .row .name { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .picked .row .name b { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .picked .row .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .picked .row .glyph svg { width: 16px; height: 16px; display: block; }
    .picked .row .kind { font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--k); flex: none; }
    .adders { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
    /* The Extras preview: the button last pointed at, drawn on a sample chart.
       A fixed height, so the buttons under it never move as the text changes. */
    .xprev {
      display: grid; grid-template-columns: minmax(96px, 150px) minmax(0, 1fr) auto; gap: 10px; align-items: start;
      margin: 6px 0 4px; padding: 8px; border-radius: 9px; background: var(--wa-field); min-height: 74px; box-sizing: border-box;
    }
    .xprev .well {
      --k: var(--primary-color, #7c6cf0);
      display: block; aspect-ratio: 120 / 46; border-radius: 7px; overflow: hidden; background: #000;
      border: 1px solid var(--wa-line-strong); box-sizing: border-box;
    }
    .xprev svg.shot { display: block; width: 100%; height: 100%; }
    .xprev-t { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: var(--wa-muted); min-width: 0; }
    .xprev-t b { font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
    .xprev-t .xprev-why { color: var(--warning-color, #e0a100); }
    .xprev button.xprev-hide { width: 24px; height: 24px; border-radius: 6px; }
    .xprev button.xprev-hide svg { width: 15px; height: 15px; }
    button.link.xprev-show { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; }
    button.link.xprev-show svg { width: 14px; height: 14px; }
    /* One row per number: the whole label opens that text layer, and the ×
       at the end deletes it. Two buttons, because one cannot sit inside the
       other. */
    .chart-numbers { display: flex; flex-direction: column; gap: 4px; }
    .chart-numbers .num-row { display: flex; align-items: flex-start; gap: 4px; }
    .chart-numbers .num-row > button.icon { flex: none; margin-top: 8px; }
    /* A row opens in place: the header stays the same button-like strip, and the
       body holds that layer's main settings under it, inside the same border. */
    .chart-numbers details.num-item { flex: 1; min-width: 0; border-radius: 8px; border: 1px solid var(--wa-line-strong); background: var(--wa-panel); }
    .chart-numbers details.num-item:hover { border-color: color-mix(in srgb, var(--primary-color, #7c6cf0) 60%, transparent); }
    .chart-numbers details.num-item > summary { list-style: none; }
    .chart-numbers details.num-item > summary::-webkit-details-marker { display: none; }
    .chart-numbers details.num-item .chev { margin-left: auto; flex: none; color: var(--wa-muted); opacity: .6; transition: transform .15s ease-out; }
    .chart-numbers details.num-item .chev svg { width: 14px; height: 14px; display: block; }
    .chart-numbers details.num-item[open] .chev { transform: rotate(180deg); }
    .chart-numbers .num-body { padding: 4px 8px 8px; border-top: 1px solid var(--wa-line-strong); }
    .chart-numbers .num-body > .chips { margin-left: var(--wa-col); margin-top: 6px; }
    .shown-head { display: flex; align-items: center; gap: 6px; margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--wa-line-strong); font-size: 12px; font-weight: 600; }
    .shown-count { font-size: 11px; font-weight: 500; color: var(--wa-muted); background: var(--wa-panel); border-radius: 999px; padding: 0 7px; line-height: 18px; }
    .chart-numbers .num-pick { display: flex; align-items: center; gap: 10px; text-align: left;
      padding: 6px 8px; color: inherit; font: inherit; cursor: pointer; }
    .num-lead { flex: none; display: inline-flex; align-items: center; justify-content: center; min-width: 26px; height: 26px; padding: 0 6px;
      border-radius: 6px; background: color-mix(in srgb, currentColor 8%, transparent); font-variant-numeric: tabular-nums; font-weight: 600; font-size: 12px; }
    .num-lead svg { width: 15px; height: 15px; }
    .num-text { display: flex; flex-direction: column; min-width: 0; line-height: 1.25; }
    .num-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .num-kind { font-size: 11px; color: var(--wa-muted); }
    /* A chart's Readings list: one line per reading, its value now, and a
       Number and a Marker switch where the reading has one. The cells sit in
       one grid so every switch lines up down its column. */
    .field.list-field > .xreadings { margin: 0; }
    /* The On the plot and Readings tables share fixed columns, so their name,
       value and switch columns line up across both tables, not just inside one. */
    .field.list-field:has(> .xreadings) + .field.list-field:has(> .xreadings),
    .hint + .field.list-field:has(> .xreadings) { margin-top: 10px; }
    .xreadings { display: grid; grid-template-columns: minmax(0, 1fr) 52px 64px 64px; min-width: 0; }
    .xr-row { display: contents; }
    .xr-row > span { display: flex; align-items: center; min-width: 0; min-height: 28px; border-top: 1px solid var(--wa-line); }
    .xr-row > span:first-child { padding-left: 6px; }
    .xr-row > span:nth-child(n+3) { justify-content: center; }
    .xr-row > span:nth-child(2) { justify-content: flex-end; padding-right: 4px; }
    .xr-row:not(.xr-head):hover > span { background: var(--wa-field); }
    .xr-row:not(.xr-head):hover > span:first-child { border-radius: 6px 0 0 6px; }
    .xr-row:not(.xr-head):hover > span:last-child { border-radius: 0 6px 6px 0; }
    .xr-head > span {
      min-height: 20px; border-top: 0; font-size: 10.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--wa-muted);
    }
    .xr-name { display: block; min-width: 0; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .xr-head .xr-name { font-size: 10.5px; }
    .xr-v { display: block; max-width: 52px; font-size: 11.5px; color: var(--wa-muted); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    button.xtog {
      display: inline-grid; place-items: center; width: 48px; height: 22px; padding: 0; border-radius: 6px; cursor: pointer;
      font: inherit; font-size: 12px; font-weight: 700; line-height: 1;
      border: 1px dashed var(--wa-line-strong); background: transparent; color: var(--wa-muted);
    }
    button.xtog svg { width: 12px; height: 12px; display: block; }
    button.xtog:hover { color: var(--wa-ink); border-color: var(--wa-muted); }
    button.xtog:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.xtog.on { border: 1px solid transparent; background: var(--primary-color, #7c6cf0); color: #fff; }
    button.xtog:disabled { opacity: .35; cursor: not-allowed; }
    button.xtog:disabled:hover { color: var(--wa-muted); border-color: var(--wa-line-strong); }    dialog.preset-dialog {
      width: min(420px, calc(100vw - 32px)); padding: 16px 18px 18px;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.preset-dialog::backdrop { background: rgba(0,0,0,.45); }
    /* The dialog's one question keeps its title above the search box. */
    dialog.preset-dialog .field.entity-field { display: flex; flex-direction: column; align-items: stretch; gap: 4px; margin: 8px 0; }
    /* The keys-and-mouse help: two tables side by side when there is room,
       one under the other when there is not. */
    button.help {
      font: inherit; font-size: 14px; font-weight: 600; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
      display: inline-grid; place-items: center; padding: 0;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-muted);
      transition: background-color .12s ease-out, border-color .12s ease-out, color .12s ease-out;
    }
    button.help:hover { border-color: var(--wa-line-strong); background: var(--wa-panel); color: var(--wa-ink); }
    button.help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    dialog.help-dialog {
      width: min(880px, calc(100vw - 32px)); max-height: calc(100vh - 32px); padding: 0;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.help-dialog::backdrop { background: rgba(0,0,0,.45); }
    .help-head { display: flex; align-items: center; gap: 12px; padding: 14px 18px 4px; }
    .help-head a { font-size: 13px; color: var(--wa-accent); }
    .help-tabs { display: flex; gap: 4px; padding: 0 18px; border-bottom: 1px solid var(--wa-line); }
    .help-tabs button {
      font: inherit; font-size: 13px; font-weight: 500; padding: 8px 10px; margin-bottom: -1px; cursor: pointer;
      border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--wa-muted);
    }
    .help-tabs button:hover { color: var(--wa-ink); }
    .help-tabs button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .help-tabs button[aria-selected="true"] { color: var(--wa-ink); border-bottom-color: var(--wa-accent); }
    /* Words rather than keys in the first column wrap, so a long name does
       not squeeze its explanation into a sliver. */
    .help-body table.terms th { white-space: normal; width: 30%; }
    .help-body section + section h3 { margin-top: 0; }
    .help-head h2 { margin: 0; font-size: 15px; font-weight: 500; }
    .help-head .spacer { flex: 1; }
    .help-body { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 8px 24px; padding: 14px 18px 18px; }
    .help-body h3 { margin: 0 0 6px; font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--wa-muted); }
    .help-body table { border-collapse: collapse; width: 100%; font-size: 13px; }
    .help-body th { text-align: left; font-weight: 500; white-space: nowrap; padding: 5px 12px 5px 0; vertical-align: top; width: 1%; }
    .help-body td { padding: 5px 0; color: var(--wa-muted); vertical-align: top; border-top: 1px solid var(--wa-line); }
    .help-body th { border-top: 1px solid var(--wa-line); }
    .help-body tr:first-child th, .help-body tr:first-child td { border-top: 0; }
    .help-body kbd {
      font: inherit; font-size: 12px; padding: 2px 7px; border-radius: 6px;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-ink);
    }
    .help-body .hint { margin: 8px 0 0; }
    /* The zoomed preview: the whole window, the face as wide as it will go.
       The picture keeps its slot's aspect and never runs taller than the room
       under the bar, so a wide rectangular face on a short window still fits. */
    dialog.zoom-dialog {
      width: 100vw; max-width: 100vw; height: 100vh; max-height: 100vh; margin: 0; padding: 0; border: 0;
      background: var(--wa-bg, #111); color: var(--wa-ink);
      display: flex; flex-direction: column; overflow: hidden;
    }
    dialog.zoom-dialog::backdrop { background: rgba(0,0,0,.6); }
    .zoom-bar {
      display: flex; align-items: center; gap: 8px; padding: 10px 16px; flex: none;
      border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .zoom-bar .under { margin: 0; text-align: left; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .zoom-bar .spacer { flex: 1; min-width: 0; }
    .zoom-stage {
      flex: 1 1 auto; min-height: 0; display: grid; place-items: center; padding: 16px;
      background:
        radial-gradient(ellipse at 50% 35%, color-mix(in srgb, var(--wa-accent) 10%, transparent) 0, transparent 65%),
        radial-gradient(color-mix(in srgb, var(--wa-ink) 9%, transparent) 1px, transparent 1px) 0 0 / 18px 18px;
    }
    .zoom-stage .preview svg,
    .zoom-stage .preview.rectangular svg,
    .zoom-stage .preview.circular svg,
    .zoom-stage .preview.corner svg,
    .zoom-stage .preview.small svg,
    .zoom-stage .preview.medium svg,
    .zoom-stage .preview.large svg,
    .zoom-stage .preview.xlarge svg {
      width: min(100%, calc((100vh - 90px) * var(--wa-ratio, 1))); max-width: none;
    }
    dialog.preset-dialog h2 { margin: 0 0 4px; font-size: 15px; font-weight: 500; }
    .ok { color: var(--success-color, #43a047); }
    .warn { color: var(--warning-color, #ffa600); }
    .err, .error { color: var(--error-color, #db4437); }
    .kv { display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; font-size: 13px; }
    .kv dt { opacity: .7; }
    .kv dd { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .send { font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .send.sent { color: var(--wa-ent); }
    .send.sending { opacity: .7; }
    .send.offline { color: var(--warning-color, #ffa600); }
    .send.unsupported { color: var(--warning-color, #ffa600); }
    /* A phone that has not pulled yet reads the same as a watch that is not
       listening: something to do, not something wrong. */
    .send.openApp { color: var(--warning-color, #ffa600); }
    /* "last seen 2 h ago" beside a green tick. Muted, because the tick is
       still true: the change is on the watch, and this only says the watch
       stopped listening afterwards. */
    .send-note { font-size: 12px; color: var(--wa-muted); white-space: nowrap; flex: none; }
    ul { list-style: none; margin: 0; padding: 0; }
    .datum { padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .datum + .datum { box-shadow: inset 0 1px 0 var(--wa-line); }
    .datum:hover, .datum.hl { box-shadow: none; }
    .datum:hover { background: var(--wa-panel); }
    .datum.hl { background: color-mix(in srgb, var(--wa-accent) 14%, transparent); }
    .datum .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .datum .meta { font-size: 12px; opacity: .7; }
    .branches { display: flex; flex-wrap: wrap; gap: 4px; }
    .branches button {
      font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px;
      border: 1px solid var(--wa-line); background: transparent; color: inherit; cursor: pointer;
    }
    .branches button.active { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    .branches button.live-match { border-color: var(--success-color, #43a047); }
    pre { font-size: 11px; white-space: pre-wrap; word-break: break-all; max-height: 400px; overflow: auto; background: var(--wa-panel); padding: 8px; border-radius: 6px; }
    button.link { font: inherit; background: none; border: none; color: var(--wa-accent); cursor: pointer; padding: 0; }
    .rule-box { border: 1px solid var(--wa-line); border-radius: 8px; padding: 8px; margin: 8px 0; }
    .case-box { border-left: 3px solid var(--wa-line); padding: 4px 8px; margin: 8px 0; }
    .case-box.match { border-left-color: var(--success-color, #43a047); }
    .case-box.otherwise { border-left-style: dashed; }
    .test-box, .change-box { background: var(--wa-panel); border-radius: 6px; padding: 4px 8px; margin: 6px 0; }
    .rule-head { display: flex; align-items: center; gap: 4px; font-size: 13px; }
    .ok { color: var(--success-color, #43a047); font-size: 12px; }
    .no { color: var(--error-color, #db4437); font-size: 12px; }
    select.adder { font: inherit; font-size: 12px; padding: 3px 6px; margin-top: 4px; }
    /* Inside a row of adders the top margin would push it off the buttons'
       baseline; the row already spaces itself. */
    .adders select.adder { margin-top: 0; }

    /* Form rows, the way a property sheet reads: the title in a fixed column
       on the left, the control on the right, one row per setting and every
       row at least 30px, so a card reads as an even list rather than a form.
       Contexts that lay fields out another way (the dialogs, the bars under
       the preview) set their own display over this. */
    .field {
      position: relative; display: grid; grid-template-columns: var(--wa-lab) minmax(0, 1fr); align-items: center;
      gap: 4px 8px; min-height: 30px; margin: 0; font-size: 12px;
    }
    .field > span { color: var(--wa-muted); font-size: 12px; line-height: 1.25; min-width: 0; overflow-wrap: break-word; }
    .field > span.changed { color: var(--wa-ink); }
    /* A number's title drags the number. */
    .field > span.scrub { cursor: ew-resize; user-select: none; -webkit-user-select: none; touch-action: none; }
    .field > span.scrub:hover { color: var(--wa-accent); }
    /* So does an idle number box; one being typed in keeps its text cursor. */
    input[data-scrub]:not(:focus):not(:disabled) { cursor: ew-resize; touch-action: pan-y; }
    input[data-scrub].scrubbing { user-select: none; -webkit-user-select: none; }
    .field input[type=text], .field input[type=number], .field select, .field textarea { width: 100%; min-width: 0; }
    /* The controls in an inspector row: 26px, 12px text, a soft fill and no
       ring until hovered, so a card of twenty rows is not twenty boxes. */
    :is(.sec-b, .value-pop) .field :is(input[type=text], input[type=number], input[type=time], select) {
      height: 26px; min-height: 26px; padding: 0 8px; font-size: 12px; border-radius: 6px;
      border-color: transparent; background-color: var(--wa-field);
    }
    :is(.sec-b, .value-pop) .field select { padding-right: 22px; background-position: right 6px center; background-size: 12px; }
    :is(.sec-b, .value-pop) .field textarea { font-size: 12px; padding: 5px 8px; border-radius: 6px; border-color: transparent; background: var(--wa-field); }
    :is(.sec-b, .value-pop) .field input[type=number] { -moz-appearance: textfield; appearance: textfield; }
    :is(.sec-b, .value-pop) .field input[type=number]::-webkit-inner-spin-button,
    :is(.sec-b, .value-pop) .field input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    :is(.sec-b, .value-pop) .field .ent-box input { padding-left: 28px; padding-right: 26px; }
    /* Inside a tinted section the focus ring takes the section's colour. */
    .field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    .field:has(> textarea) { align-items: start; }
    .field:has(> textarea) > span { padding-top: 6px; }
    .field .mono, code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    /* A unit drawn faint inside the number box, after the number. */
    .num-box { position: relative; display: flex; align-items: center; min-width: 0; }
    .num-box input[type=number] { flex: 1; font-variant-numeric: tabular-nums; }
    .num-box input[type=number],
    :is(.sec-b, .value-pop) .field .num-box input[type=number] { padding-right: calc(10px + var(--wa-unit, 1) * 7px); }
    .num-box .unit { position: absolute; right: 8px; font-size: 11px; color: var(--wa-muted); opacity: .8; pointer-events: none; }
    /* A glyph before the number, such as the link on a size a part inherits. */
    .num-box .lead { position: absolute; left: 7px; display: grid; place-items: center; color: var(--wa-muted); pointer-events: none; }
    .num-box .lead svg.ui-icon { width: 12px; height: 12px; }
    .num-box.lead input[type=number],
    :is(.sec-b, .value-pop) .field .num-box.lead input[type=number] { padding-left: 24px; }
    .field.slider .slider-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .field.slider input[type=range] { flex: 1; min-width: 50px; height: 16px; margin: 0; }
    .field.slider .slider-row > :is(.num-box, input[type=number]) { flex: none; width: 66px; }
    .field.slider .slider-row > :is(.num-box, input[type=number]):only-child { flex: 1; width: auto; }
    /* A switch is a row like any other: title left, switch at the start of
       the control column. */
    .field.check { cursor: pointer; }
    .field.check > input[type=checkbox] { justify-self: start; }
    .field.check .mixed { color: var(--wa-muted); font-size: 12px; }
    /* The entity search and the value chip are rows like any other. The line
       under the search box stays in the control column; the result list takes
       the whole width, since its rows carry a name, a room and a state. */
    .field.entity-field > :not(:first-child) { grid-column: 2; }
    .field.entity-field > .entity-results { grid-column: 1 / -1; }
    .field.value-chip-field > button.value-chip:first-child { grid-column: 1 / -1; }
    /* A colour is one box: swatch, hex, and opacity in percent. */
    .color-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .color-box {
      flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; height: 26px; padding: 0 0 0 5px;
      border-radius: 6px; border: 1px solid transparent; background: var(--wa-field);
    }
    .color-box:hover { border-color: var(--wa-line-strong); }
    .color-box:focus-within { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    .color-box:has(input:disabled) { opacity: .5; }
    .color-swatch {
      position: relative; flex: none; width: 16px; height: 16px; border-radius: 4px; overflow: hidden; cursor: pointer;
      background: linear-gradient(var(--sw), var(--sw)), repeating-conic-gradient(#c8c8c8 0 25%, #fff 0 50%) 0 0 / 8px 8px;
      box-shadow: inset 0 0 0 1px rgba(128,128,128,.45);
    }
    .color-swatch input[type=color] { position: absolute; inset: -6px; width: auto; height: auto; opacity: 0; cursor: pointer; border: 0; padding: 0; }
    :is(.color-row, .band-row) .color-box :is(input.hex, .alpha input) {
      height: 24px; min-height: 0; border: 0; border-radius: 0; background: transparent; box-shadow: none; font-size: 12px;
    }
    :is(.color-row, .band-row) .color-box input.hex { flex: 1; min-width: 0; padding: 0; text-transform: uppercase; }
    .band-row .color-box input.hex { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    :is(.color-row, .band-row) .color-box .alpha { flex: none; width: 50px; border-left: 1px solid var(--wa-line); }
    :is(.color-row, .band-row) .color-box .alpha input { width: 100%; padding: 0 18px 0 4px; text-align: right; }
    :is(.color-row, .band-row) .color-box :is(input.hex, .alpha input):focus-visible { box-shadow: none; outline: none; }
    /* Outside a .field row the browser's own spin arrows would eat the
       opacity box and clip "100" to "10". */
    .color-box .alpha input { -moz-appearance: textfield; appearance: textfield; }
    .color-box .alpha input::-webkit-inner-spin-button,
    .color-box .alpha input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    /* A gradient's bar: the gradient itself, with one chip per stop sitting on
       it where that stop is. The checkerboard behind it shows transparency, the
       same way a colour swatch does. */
    .fill-bar {
      position: relative; flex: 1; min-width: 0; height: 22px; border-radius: 6px;
      background: var(--g), repeating-conic-gradient(#c8c8c8 0 25%, #fff 0 50%) 0 0 / 8px 8px;
      box-shadow: inset 0 0 0 1px rgba(128,128,128,.45); touch-action: none;
    }
    .fill-chip {
      position: absolute; top: 50%; width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px;
      border-radius: 50%; cursor: ew-resize; touch-action: none;
      background: var(--sw); box-shadow: 0 0 0 1.5px #fff, 0 0 0 2.5px rgba(0,0,0,.45);
    }
    .fill-stop-n { flex: none; width: 14px; font-size: 11px; opacity: .65; text-align: center; }
    /* A colour table: a thin bar of the bands to scale with a mark at the
       current value, then one compact row per band, lowest first. It sits in
       the control column, under the Colour row it belongs to. It is its own
       size container so a narrow inspector can drop the opacity box, which
       the eight-digit hex still carries. */
    .bands { display: grid; gap: 3px; margin: 2px 0 6px var(--wa-col); container-type: inline-size; }
    @container (max-width: 240px) {
      .band-row .color-box .alpha { display: none; }
      .band-row .color-box { padding-right: 6px; }
    }
    /* The bar is pieces with a hairline gap between them, so two close colours
       still read as two bands; each piece is at least a tenth of the bar (see
       bandLayout). With a bar border on, a piece shows its fill inside its
       border colour. Band ends are labelled under the bar. */
    .band-bar { position: relative; margin: 8px 0 4px; }
    .band-bar .bb { display: flex; gap: 2px; height: 14px; }
    .band-bar .bb i {
      display: block; flex: 0 1 0; min-width: 4px; height: 100%; border-radius: 3px;
      background: var(--f); box-shadow: inset 0 0 0 1px rgba(128,128,128,.3);
    }
    .band-bar .bb i:first-child { border-radius: 7px 3px 3px 7px; }
    .band-bar .bb i:last-child { border-radius: 3px 7px 7px 3px; }
    .band-bar .bb i:only-child { border-radius: 7px; }
    .band-bar .bb i.bordered { box-shadow: inset 0 0 0 2px var(--b); }
    .band-bar .now {
      position: absolute; top: -4px; width: 3px; height: 22px; margin-left: -1.5px; border-radius: 2px;
      background: var(--wa-ink); box-shadow: 0 0 0 1.5px var(--wa-card);
    }
    /* The stretch a chart reads, as a bracket just over the bar. */
    .band-bar .span {
      position: absolute; top: -6px; height: 3px; min-width: 3px; margin-left: -1.5px; padding-right: 3px; border-radius: 2px;
      background: var(--wa-val); box-sizing: content-box;
    }
    .band-bar .ticks { position: relative; height: 13px; margin-top: 3px; }
    .band-bar .ticks span {
      position: absolute; top: 0; transform: translateX(-50%); white-space: nowrap;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; line-height: 13px;
      color: var(--wa-muted); font-variant-numeric: tabular-nums;
    }    /* The first column is the band's range, three slots: a start box, "to" and
       an end box ("122 to 231"). The first row and the last put their words
       ("Less than", "Greater than") across the first two slots and their number
       in the end slot, so the words line up with the start boxes and every
       row's end box lines up. */
    .band-row { position: relative; display: grid; grid-template-columns: 164px minmax(0, 1fr) 22px; gap: 4px; align-items: center; min-height: 28px; }
    .band-row .range { display: grid; grid-template-columns: minmax(0, 1fr) 22px minmax(0, 1fr); align-items: center; }
    .band-row .le { grid-column: 1 / 3; font-size: 12px; color: var(--wa-muted); padding-left: 2px; white-space: nowrap; }
    .band-row .to { font-size: 12px; color: var(--wa-muted); text-align: center; }
    .band-row .range .else { grid-column: 1 / -1; }
    .band-row .else { font-size: 12px; color: var(--wa-muted); padding-left: 2px; }
    .band-row.hit .le, .band-row.hit .else { color: var(--wa-val); font-weight: 700; }
    .band-row input.band-up {
      width: 100%; min-width: 0; height: 26px; min-height: 26px; padding: 0 6px; border-radius: 6px;
      border: 1px solid transparent; background-color: var(--wa-field); box-shadow: none;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; font-variant-numeric: tabular-nums;
      -moz-appearance: textfield; appearance: textfield;
    }
    .band-row input.band-up:hover { border-color: var(--wa-line-strong); }
    .band-row input.band-up::-webkit-inner-spin-button,
    .band-row input.band-up::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    .band-row input.band-up:focus-visible { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    .band-row.hit input.band-up { color: var(--wa-val); }
    .band-row button.reset-dot { top: 50%; margin-top: -3px; }
    /* A bars chart with a border: a Fill and a Border colour box side by side
       on every row, under small column titles. A box whose colour is the
       band's own carries a reset dot at its corner. */
    .bands.split .band-row { grid-template-columns: 164px minmax(0, 1fr) minmax(0, 1fr) 22px; }
    .band-row.band-head { min-height: 0; margin-bottom: -2px; }
    .band-row.band-head span { font-size: 10px; line-height: 12px; color: var(--wa-muted); padding-left: 2px; white-space: nowrap; }
    .band-cell { position: relative; display: flex; min-width: 0; }
    .band-cell .color-box { flex: 1; min-width: 0; }
    .band-row .band-cell button.reset-dot { left: auto; right: -2px; top: -2px; margin-top: 0; }
    @container (max-width: 470px) {
      .bands.split .band-row .color-box .alpha { display: none; }
      .bands.split .band-row .color-box { padding-right: 6px; }
    }
    /* Too narrow for a hex beside the numbers: a colour box keeps its swatch. */
    @container (max-width: 340px) {
      .band-row, .bands.split .band-row { grid-template-columns: 136px minmax(0, 1fr) 22px; }
      .bands.split .band-row { grid-template-columns: 136px minmax(28px, 1fr) minmax(28px, 1fr) 22px; }
      .band-row .range { grid-template-columns: minmax(0, 1fr) 18px minmax(0, 1fr); }
      .band-row .le { font-size: 11px; }
    }
    @container (max-width: 300px) {
      .band-row .color-box input.hex { display: none; }
    }
    .bands button.link.add-band { justify-self: start; margin-top: 2px; font-size: 12px; font-weight: 500; }
    /* The Position card's four numbers: a 2x2 grid of boxes, each with its
       letter inside at the front. The letter drags the number. */
    .xy { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 4px 6px; min-width: 0; }
    label.pf {
      position: relative; display: flex; align-items: center; height: 26px; min-width: 0;
      border-radius: 6px; border: 1px solid transparent; background: var(--wa-field);
    }
    label.pf:hover { border-color: var(--wa-line-strong); }
    label.pf:focus-within { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    label.pf .pl {
      flex: none; width: 22px; align-self: stretch; display: grid; place-items: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10.5px; font-weight: 600; color: var(--wa-muted);
      cursor: ew-resize; user-select: none; -webkit-user-select: none; touch-action: none;
    }
    label.pf .pl:hover { color: var(--wa-accent); }
    /* Scoped under .xy so it outranks the inspector's own row input style,
       now that the boxes sit inside a .field row. */
    .xy label.pf input[type=number] {
      flex: 1; min-width: 0; height: 100%; min-height: 0; padding: 0 24px 0 0; margin: 0;
      border: 0; border-radius: 0; background: transparent; box-shadow: none; color: var(--wa-ink);
      font-size: 12px; font-variant-numeric: tabular-nums; -moz-appearance: textfield; appearance: textfield;
    }
    label.pf input[type=number]::-webkit-inner-spin-button,
    label.pf input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    label.pf input[type=number]:focus-visible { outline: none; box-shadow: none; border: 0; }
    label.pf .unit { position: absolute; right: 8px; font-size: 11px; color: var(--wa-muted); opacity: .8; pointer-events: none; }
    /* Pairs and quads stack: each field is its own label-left row. */
    .grid2, .grid4 { display: block; }
    /* Two short choices on one row, the second titled in line. */
    .pair-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .pair-row > .seg.wide:first-of-type { flex: 1 1 auto; width: auto; }
    .pair-row > .seg.wide:last-of-type { flex: 0 0 64px; width: 64px; }
    .pair-row > span { position: relative; flex: none; padding-left: 8px; color: var(--wa-muted); font-size: 12px; }
    .pair-row > span.changed { color: var(--wa-ink); }
    .pair-row > span button.reset-dot { left: -2px; top: 50%; margin-top: -3px; }
    /* A gauge's Min or Max: the title, then the one control the Number or
       Entity switch picks, then that switch at the end of the same row. */
    .field.gauge-end { grid-template-columns: var(--wa-lab) minmax(0, 1fr) auto; }
    .gauge-end-head { display: contents; }
    .gauge-end-head > .seg { grid-column: 3; grid-row: 1; height: 24px; }
    .field.gauge-end > :not(.gauge-end-head) { grid-column: 2; grid-row: 1; margin: 0; }
    /* A table row of fields: short titles in line, no title column. */
    .row-inline { display: flex; align-items: center; gap: 8px; }
    .row-inline .field { flex: 1; min-width: 0; grid-template-columns: auto minmax(0, 1fr); gap: 6px; }
    .row-inline > button.icon { flex: none; }
    /* A narrow inspector (a column dragged in, or a small window) stacks each
       row: the title on its own line and the control under it at full width,
       instead of squeezing the control into what is left beside an 88px
       title. A switch needs no width, so it keeps its title beside it. The
       value popover keeps its own label-left rows. */
    @container insp (max-width: 360px) {
      .insp-body { --wa-col: 0px; }
      .insp-body .value-pop { --wa-col: calc(var(--wa-lab) + 8px); }
      .sec-b .field:not(.value-pop *, .row-inline *) { grid-template-columns: minmax(0, 1fr); gap: 4px; min-height: 0; padding: 3px 0; }
      .sec-b .field:not(.value-pop *, .row-inline *) > * { grid-column: 1 / -1; }
      .sec-b .field:not(.value-pop *, .row-inline *) > span:first-child { padding-top: 0; }
      .sec-b .field.check:not(.value-pop *, .row-inline *) { grid-template-columns: minmax(0, 1fr) auto; min-height: 30px; padding: 0; }
      .sec-b .field.check:not(.value-pop *, .row-inline *) > * { grid-column: auto; }
      .sec-b .field.gauge-end:not(.value-pop *) { grid-template-columns: minmax(0, 1fr) auto; }
      .sec-b .field.gauge-end:not(.value-pop *) > .gauge-end-head > :first-child { grid-column: 1; grid-row: 1; align-self: center; }
      .sec-b .field.gauge-end:not(.value-pop *) > .gauge-end-head > .seg { grid-column: 2; grid-row: 1; }
      .sec-b .field.gauge-end:not(.value-pop *) > :not(.gauge-end-head) { grid-column: 1 / -1; grid-row: 2; }
      .sec-b .readout-v { padding-top: 0; }
      /* Choices wrap onto a second line rather than clip to "A…". */
      .sec-b .seg.wide { height: auto; min-height: 24px; flex-wrap: wrap; }
      .sec-b .seg.wide button { flex: 1 0 auto; text-overflow: clip; }
      .sec-b .pair-row { flex-wrap: wrap; row-gap: 4px; }
      .sec-b .pair-row > .seg.wide:first-of-type { flex: 1 1 100%; }
    }
    .hint { font-size: 11.5px; line-height: 1.45; color: var(--wa-muted); margin: 4px 0; }
    .hint.warn { color: var(--wa-ink); }
    /* The bare .err rule sits above .hint in this sheet, so a hint that is an
       error needs both class names to win the colour. */
    .hint.err { color: var(--error-color, #db4437); }
    details.sub { margin: 6px 0; }
    details.sub summary { font-size: 12px; opacity: .8; cursor: pointer; }
    .chip { display: inline-flex; align-items: center; gap: 6px; height: 24px; font-size: 12px; font-weight: 600; padding: 0 8px; border: 1px solid var(--wa-line); border-radius: 6px; }
    .chip.ent { border-color: transparent; background: var(--wa-ent-bg); color: var(--wa-ent); }
    .chip.val { border-color: transparent; background: var(--wa-val-bg); color: var(--wa-val); }
    button.chip { font: inherit; font-size: 12px; background: transparent; color: inherit; cursor: pointer; }
    button.chip.active { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    .chip-add { font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px; border: 1px dashed var(--wa-line); background: transparent; color: inherit; cursor: pointer; }
    .value-editor { margin: 0; }

    /* Value chip: one line saying what a value is, with the full form behind it.
       The form lives in a popover, which the browser draws in the top layer, so
       a scrolling card cannot clip it. Its position is set in editors.ts. */
    .value-chip-field { gap: 4px 8px; }
    button.value-chip {
      display: flex; align-items: center; gap: 8px; width: 100%;
      font: inherit; font-size: 13px; text-align: left; padding: 6px 10px; border-radius: 8px;
      border: 1px solid var(--wa-line); background: var(--wa-card);
      color: inherit; cursor: pointer;
    }
    button.value-chip:hover { border-color: var(--wa-accent); }
    button.value-chip:focus-visible { outline: 2px solid var(--wa-accent); outline-offset: 1px; }
    .value-chip .chip-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .value-chip .chip-now {
      max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      color: var(--wa-val); font-weight: 600;
      padding: 1px 6px; border-radius: 999px; background: var(--wa-val-bg);
    }
    .value-chip .chip-caret { opacity: .55; font-size: 11px; }
    /* In an inspector row the chip is a control like the boxes above and
       below it: 26px, 12px text and the same soft fill. */
    .sec-b .field.value-chip-field:not(.compact) > button.value-chip {
      min-height: 26px; padding: 2px 8px; font-size: 12px; border-radius: 6px;
      border-color: transparent; background: var(--wa-field);
    }
    .sec-b .field.value-chip-field:not(.compact) > button.value-chip:hover { border-color: var(--wa-line-strong); }
    .value-pop {
      position: fixed; inset: auto; margin: 0; width: min(430px, calc(100vw - 16px));
      max-height: 70vh; overflow: auto; padding: 10px 14px 14px;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 10px 30px rgba(0,0,0,.35);
    }
    .value-pop::backdrop { background: transparent; }
    .pop-head { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 2px; position: sticky; top: -10px; background: inherit; padding: 4px 0; }
    .pop-head .spacer { flex: 1; }

    /* States table: one rule as rows. A two-state light is two lines, so the
       row has to stay one line: every control in it is sized to the text it
       holds rather than to the column. */
    /* The table scrolls sideways inside its card when a narrow inspector
       cannot fit its columns, rather than running past the card's edge. */
    .states-scroll { overflow-x: auto; margin: 8px 0 4px; }
    .states-table { width: 100%; border-collapse: collapse; margin: 0; font-size: 13px; }
    .states-table th {
      text-align: left; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: .04em;
      opacity: .6; padding: 2px 6px; border-bottom: 1px solid var(--wa-line); white-space: nowrap;
    }
    .states-table th button.icon { opacity: 0; width: 18px; height: 18px; }
    /* A title with its remove button beside it sits on the same line as a
       title alone, so the header reads as one row. */
    .states-table th { height: 24px; vertical-align: middle; }
    .states-table th > :is(span, button) { vertical-align: middle; }
    .states-table th:hover button.icon, .states-table th button.icon:focus-visible { opacity: .7; }
    .states-table th.acts { width: 1%; }
    .states-table td { padding: 3px 6px; border-bottom: 1px solid var(--wa-line); vertical-align: middle; }
    .states-table td.empty-row { opacity: .6; padding: 12px 6px; border-bottom: none; }
    .states-table tr.state-row { cursor: pointer; }
    .states-table tr.state-row:hover td { background: var(--wa-panel); }
    .states-table tr.state-row.forced td { background: var(--wa-panel); }
    .states-table tr.state-row.forced td { background: color-mix(in srgb, var(--wa-states) 18%, transparent); }
    .states-table td.when { white-space: nowrap; }
    .states-table td.acts { width: 1%; white-space: nowrap; }
    .states-table td.acts button.icon { opacity: 0; }
    .states-table tr:hover td.acts button.icon, .states-table td.acts button.icon:focus-visible { opacity: .8; }
    .row-flag { display: inline-block; width: 12px; color: var(--success-color, #43a047); font-size: 11px; }
    tr.forced .row-flag { color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    .when-cell { display: inline-flex; align-items: center; gap: 4px; }
    .when-cell select.when-op { font: inherit; font-size: 12px; padding: 2px 4px; border-radius: 6px; border: 1px solid transparent; background: transparent; color: inherit; }
    .when-cell select.when-op:hover { border-color: var(--wa-line); }
    .when-and { opacity: .6; font-size: 12px; }
    .when-otherwise { opacity: .75; font-style: italic; }
    .rhs { display: inline-flex; align-items: center; gap: 2px; }
    .rhs .value-chip-field { margin: 0; }
    input.cellin {
      font: inherit; font-size: 13px; width: 90px; padding: 3px 6px; border-radius: 6px;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: inherit;
    }
    input.cellin.num { width: 64px; }
    button.more { font-size: 12px; opacity: .5; }
    button.cell {
      display: inline-flex; align-items: center; gap: 6px; max-width: 190px;
      font: inherit; font-size: 13px; text-align: left; padding: 3px 6px; border-radius: 6px;
      border: 1px solid transparent; background: transparent; color: inherit; cursor: pointer;
    }
    button.cell:hover { border-color: var(--wa-line); background: var(--wa-card); }
    button.cell.empty { opacity: .45; font-style: italic; }
    .cell-word { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .swatch { width: 12px; height: 12px; border-radius: 3px; border: 1px solid var(--wa-line); flex: none; }
    button.cell svg { display: block; }
    .states-foot { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
    .sec-b .field .states-foot select.chip-add {
      width: auto; flex: none; height: 26px; min-height: 26px; padding: 0 22px 0 9px; border-radius: 8px;
      border: 1px dashed var(--wa-line-strong); background-color: transparent; font-size: 12px; font-weight: 600;
    }
    .states-switch { display: flex; align-items: baseline; gap: 8px; margin-top: 8px; }
    .states-switch .hint { margin: 0; }
    /* The add controls under a states table, each with its one line of what it
       adds. A narrow inspector puts the line under its control. */
    .states > .states-add { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 5px 10px; margin: 8px 0 2px var(--wa-col); }
    .states-add > :is(button.small, select.chip-add) { justify-self: start; }
    .states-add-note { font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); }
    .sec-b .states-add select.chip-add {
      width: auto; flex: none; height: 26px; min-height: 26px; padding: 0 22px 0 9px; border-radius: 8px;
      border: 1px dashed var(--wa-line-strong); background-color: transparent; font-size: 12px; font-weight: 600;
    }
    @container insp (max-width: 360px) {
      .states > .states-add { grid-template-columns: minmax(0, 1fr); gap: 2px; }
      .states-add-note { margin-bottom: 5px; }
    }
    .confirm-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .value-chip-field.compact { margin: 0; }
    .value-chip-field.compact button.value-chip { padding: 3px 8px; font-size: 13px; max-width: 190px; }

    /* Rich text: a Parts row holding the chips in one filled box, with the
       two add buttons under it, then the part picked in the one light box the
       inspector still draws. A chip keeps the value chip's colours (entity
       teal, reading amber), so a part reads the way the same value reads
       anywhere else in the inspector. */
    .field.parts-field { align-items: start; margin: 2px 0 6px; }
    .field.parts-field > span:first-child { padding-top: 9px; }
    .part-chips {
      min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; min-height: 34px; padding: 4px;
      border-radius: 8px; background: var(--wa-field);
    }
    .part-adds { grid-column: 2; display: flex; flex-wrap: wrap; gap: 6px; }
    .part-adds button.small {
      display: inline-flex; align-items: center; gap: 5px; min-height: 26px; padding: 0 10px 0 8px;
      font-weight: 600; color: var(--c, var(--wa-accent));
      border: 1px solid color-mix(in srgb, var(--c, var(--wa-accent)) 45%, transparent);
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 12%, transparent);
    }
    .part-adds button.small:hover { background: color-mix(in srgb, var(--c, var(--wa-accent)) 22%, transparent); }
    .part-adds button.small svg.ui-icon { width: 13px; height: 13px; }
    button.part-chip {
      display: inline-flex; align-items: center; gap: 5px; max-width: 100%; height: 24px; margin: 1px 0; padding: 0 7px 0 6px;
      font: inherit; font-size: 12px; color: var(--wa-ink); cursor: pointer;
      border: 1px solid var(--wa-line); border-radius: 5px; background: var(--wa-card);
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    button.part-chip:hover { border-color: var(--wa-line-strong); }
    button.part-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.part-chip.on {
      border-color: var(--c, var(--wa-accent));
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent);
    }
    .part-chip .part-dot { width: 8px; height: 8px; border-radius: 2px; flex: none; box-shadow: inset 0 0 0 1px rgba(128,128,128,.35); }
    .part-chip .part-txt { min-width: 0; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: pre; }
    .part-chip.value .part-txt { color: var(--wa-ent); font-weight: 600; }
    .part-chip.template .part-txt { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px; }
    .part-chip .part-sp { color: var(--wa-muted); opacity: .75; }
    .part-chip .part-empty { color: var(--wa-muted); font-style: italic; }
    .part-chip .part-now {
      max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 5px; border-radius: 999px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; font-weight: 600; line-height: 16px;
      color: var(--wa-val); background: var(--wa-val-bg);
    }
    .part-chip .part-flag {
      padding: 0 3px; border: 1px solid var(--wa-line-strong); border-radius: 3px; white-space: nowrap;
      font-size: 9.5px; font-weight: 700; line-height: 13px; color: var(--wa-muted); font-variant-numeric: tabular-nums;
    }
    /* The one box left inside a card: the part being edited. Its header is a
       strip of its own, so the rows under it line up with the card's. */
    .part-editor { margin: 0 0 6px; padding: 0 8px 4px; border-radius: 8px; border: 1px solid var(--wa-line); }
    .part-editor button.reset-dot { left: -6px; }
    .part-head {
      display: flex; align-items: center; gap: 2px; height: 30px; margin: 0 -8px 4px; padding: 0 3px 0 9px;
      border-bottom: 1px solid var(--wa-line); font-size: 11.5px; color: var(--wa-muted);
    }
    .part-head .part-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .part-head b { color: var(--wa-ink); font-weight: 600; }
    .part-head .spacer { flex: 1; }
    .field.check:has(> input:disabled) { cursor: default; }
    .field.check:has(> input:disabled) > span { color: var(--wa-muted); }
    .rich-note {
      margin-top: 8px; padding: 8px 10px; border-radius: 8px; font-size: 12.5px; color: var(--wa-ink);
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 14%, var(--wa-card));
    }
    .rich-confirm { margin-top: 8px; padding: 10px; border-radius: 8px; font-size: 12.5px; background: var(--wa-card); box-shadow: inset 0 0 0 1px var(--wa-line-strong); }
    .rich-confirm .acts { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }

    /* Entity search, laid out the way Home Assistant's own entity list is: a
       glyph for the domain, the friendly name in full, and the things that
       tell two similar names apart (the room and the id) on a quieter second
       line. The type and the live state sit right, where the eye can run down
       one column instead of hunting.

       The glyph is the panel's own drawing, not Home Assistant's icon set, so
       a row still has a picture whatever the frontend ships. It only takes the
       accent colour when the entity is doing something, which is what makes
       the one light that is on findable in a list of forty. */
    .entity-field { position: relative; }
    .ent-box { position: relative; display: flex; align-items: center; }
    .ent-box input { width: 100%; min-width: 0; padding-left: 32px; padding-right: 30px; color: var(--wa-ent); font-weight: 500; }
    .ent-box .ent-glass { position: absolute; left: 10px; display: grid; place-items: center; color: var(--wa-muted); pointer-events: none; }
    .ent-box .ent-glass svg { width: 14px; height: 14px; display: block; }
    .ent-box.open .ent-glass { color: var(--wa-accent); }
    /* A layer that can draw nothing until it names an entity: a chart on
       recorded history, a timeline, a picture. The empty box wears a ring in
       the entity colour and keeps pulsing, so "why is my layer blank?" is
       marked where the answer gets typed. It runs without end on purpose: a
       finite pulse fires once on the first paint and never again, so anyone
       who looked away, opened another layer and came back found a plain box
       and no answer. The ring and the pulse both go the moment an id lands. */
    .ent-box.needs { border-radius: 8px; animation: wa-needs-pulse 1.8s ease-out infinite; }
    .ent-box.needs input { border-color: color-mix(in srgb, var(--wa-ent) 60%, var(--wa-line)); }
    .ent-box.needs .ent-glass { color: var(--wa-ent); }
    @keyframes wa-needs-pulse {
      0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--wa-ent) 55%, transparent); }
      70% { box-shadow: 0 0 0 7px color-mix(in srgb, var(--wa-ent) 0%, transparent); }
      100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--wa-ent) 0%, transparent); }
    }
    button.ent-clear {
      position: absolute; right: 5px; width: 22px; height: 22px; display: grid; place-items: center;
      padding: 0; border: none; border-radius: 6px; background: none; color: var(--wa-muted); cursor: pointer;
    }
    button.ent-clear:hover { background: var(--wa-panel); color: var(--wa-ink); }
    button.ent-clear svg { width: 13px; height: 13px; display: block; }

    .entity-results {
      border: 1px solid var(--wa-line); border-radius: 12px; margin-top: 6px; max-height: 340px; overflow: auto;
      background: var(--wa-raised); padding: 4px; box-shadow: 0 10px 28px rgba(0,0,0,.22);
    }
    button.ent {
      display: flex; align-items: center; gap: 10px; width: 100%; border-radius: 9px;
      font: inherit; font-size: 13px; text-align: left; padding: 7px 8px;
      background: none; border: none; color: inherit; cursor: pointer;
      transition: background-color .1s ease-out;
    }
    button.ent:hover, button.ent.hl { background: color-mix(in srgb, var(--wa-accent) 14%, var(--wa-card)); }
    button.ent.hl { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-accent) 45%, transparent); }
    /* The glyph tile. A fixed square keeps every name on the list starting at
       the same x, which is most of why the list reads as a column. */
    .ent-ico {
      flex: none; width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center;
      background: color-mix(in srgb, var(--wa-ink) 7%, transparent); color: var(--wa-muted);
    }
    .ent-ico.on { background: color-mix(in srgb, var(--wa-accent) 20%, transparent); color: var(--wa-accent); }
    .ent-ico svg { width: 17px; height: 17px; display: block; }
    .ent .ent-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .ent .ent-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; color: var(--wa-ent); }
    .ent .ent-sub { display: flex; align-items: baseline; gap: 6px; min-width: 0; font-size: 11px; }
    .ent .ent-area { flex: none; color: var(--wa-muted); }
    /* The room and the id are one line, and the id is the half that may be
       cut: the room is short and the id's tail is the least useful part. */
    .ent .ent-area + .ent-id::before { content: "·"; margin-right: 6px; opacity: .5; }
    .ent .ent-id { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--wa-ent); opacity: .8; }
    .ent .ent-right { flex: none; display: flex; flex-direction: column; align-items: flex-end; gap: 1px; max-width: 40%; }
    .ent .ent-type { font-size: 11px; color: var(--wa-muted); white-space: nowrap; }
    .ent .ent-state {
      font-size: 11px; font-weight: 600; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      color: var(--wa-val);
    }
    /* The line under the search box: which entity this layer holds, and what
       it says right now. It is the one place both tokens sit side by side, so
       it is also the key to reading them everywhere else. */
    .entity-current {
      display: flex; gap: 6px; align-items: center; font-size: 12px; margin: 0 0 2px;
      padding: 3px 8px 3px 4px; border-radius: 6px;
      border: 1px solid color-mix(in srgb, var(--wa-ent) 28%, var(--wa-line)); background: var(--wa-ent-bg);
    }
    .entity-current .ent-ico { width: 20px; height: 20px; border-radius: 5px; background: color-mix(in srgb, var(--wa-ent) 18%, transparent); color: var(--wa-ent); }
    .entity-current .ent-ico.on { background: color-mix(in srgb, var(--wa-ent) 28%, transparent); color: var(--wa-ent); }
    .entity-current .ent-ico svg { width: 12px; height: 12px; }
    .entity-current .ent-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--wa-ent); font-weight: 600; }
    .entity-current .ent-area { flex: none; color: var(--wa-muted); }
    .entity-current .ent-state { flex: none; max-width: 40%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* The two tokens, wherever a run of ordinary prose has to name an entity
       or print what it reads. Everything that shows a live value ends up
       here, so the colour never has to be repeated by hand. */
    .ent-tok { color: var(--wa-ent); font-weight: 600; }
    .val-tok, .entity-current .ent-state, .vchip .val, .chart-numbers b, .hint .nums, .readout-v .nums {
      color: var(--wa-val); font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .95em;
    }

    /* Symbol picker */
    .sym-browse { margin: 6px 0; }
    .sym-controls { display: flex; gap: 6px; margin-bottom: 6px; }
    .sym-controls input[type=search] { flex: 1; min-width: 0; }
    .sym-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 4px; max-height: 240px; overflow-y: auto; padding: 2px; }
    .sym-grid.one-row { display: flex; flex-wrap: nowrap; max-height: none; overflow-x: auto; overflow-y: hidden; }
    .sym-grid.one-row button.sym { flex: 0 0 64px; }
    button.sym { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 5px 2px; background: none; cursor: pointer; color: var(--wa-ink); border: 1px solid transparent; border-radius: 6px; overflow: hidden; }
    button.sym:hover { border-color: var(--wa-line); background: var(--wa-panel); }
    button.sym.on { border-color: var(--wa-accent); }
    .sym-glyph { display: flex; align-items: center; justify-content: center; height: 24px; }
    .sym-glyph svg path { fill: currentColor; fill-opacity: 1; }
    .sym-none { font-size: 14px; opacity: .4; }
    .sym-name { font-size: 9px; line-height: 1.1; text-align: center; opacity: .8; overflow-wrap: anywhere; max-height: 22px; overflow: hidden; }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } .ent-box.needs { animation: none; } }
  `}firstUpdated(t){super.firstUpdated(t),this.renderRoot.addEventListener("change",i=>{let a=i.target;a?.tagName==="SELECT"&&a.blur()})}connectedCallback(){super.connectedCallback(),this.clearLegacyPickerHidden(),this.loadColumnWidths(),this.loadListView(),this.loadGrid(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("blur",this.blurHandler),window.addEventListener("beforeunload",this.beforeUnload),window.addEventListener("pointerdown",this.pressStart,{capture:!0}),window.addEventListener("pointerup",this.pressEnd,{capture:!0}),window.addEventListener("pointercancel",this.pressEnd,{capture:!0}),window.addEventListener("click",this.sharedValueOutside,{capture:!0}),window.addEventListener("focusin",this.sharedValueFocus),this.addEventListener(Es,this.scrubStart),this.addEventListener(Fs,this.scrubEnd),window.addEventListener("hashchange",this.takeShareLink),this.takeShareLink(),this.loadOwners(),this.watchStatusTimer=window.setInterval(()=>{this.refreshWatchStatus()},f1)}loadColumnWidths(){try{let t=window.localStorage.getItem(hy);if(!t)return;let i=JSON.parse(t);typeof i.left=="number"&&(this.colLeft=Xc(i.left)),typeof i.right=="number"&&(this.colRight=Xc(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(hy,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}loadGrid(){try{let t=window.localStorage.getItem(py);if(!t)return;let i=JSON.parse(t);typeof i.on=="boolean"&&(this.snapGrid=i.on),md.includes(i.step)&&(this.gridStep=i.step),typeof i.lines=="boolean"&&(this.showGridLines=i.lines),typeof i.layers=="boolean"&&(this.snapLayers=i.layers)}catch{}}setGrid(t,i,a=this.showGridLines,r=this.snapLayers){this.snapGrid=t,this.gridStep=i,this.showGridLines=a,this.snapLayers=r;try{window.localStorage.setItem(py,JSON.stringify({on:t,step:i,lines:a,layers:r}))}catch{}}snapTarget(t){return{snap:{step:Qi(this.gridStep,ce[t]),on:this.snapGrid}}}guideTarget(t,i){let a=this.draft?.config;if(!this.snapLayers)return{};let r=a===void 0?[]:gt(a,t).filter(o=>!i.includes(o.payload.id)&&!xe(a,o)).map(o=>Oe(a,t,o)).filter(o=>!o.isHidden).map(o=>o.frame);return{guides:{lines:vh(r),threshold:wh(ce[t])}}}guideSink(){return{onGuides:t=>{this.guides=t}}}loadListView(){try{let t=window.localStorage.getItem(uy);if(!t)return;let i=JSON.parse(t);(i.thumbStep===0||i.thumbStep===1||i.thumbStep===2)&&(this.thumbStep=i.thumbStep),(i.detail==="compact"||i.detail==="expanded")&&(this.layerDetail=i.detail),typeof i.addOpen=="boolean"&&(this.addOpen=i.addOpen),(i.addDetail==="compact"||i.addDetail==="expanded")&&(this.addDetail=i.addDetail)}catch{}}saveListView(){try{window.localStorage.setItem(uy,JSON.stringify({thumbStep:this.thumbStep,detail:this.layerDetail,addOpen:this.addOpen,addDetail:this.addDetail}))}catch{}}renderGutter(t){return h`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(t,i)}
      @dblclick=${()=>{t==="left"?this.colLeft=ly:this.colRight=dy,this.saveColumnWidths()}}></div>`}beginColumnDrag(t,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=my(this.panelWidth,this.colLeft,this.colRight),s=t==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let l=u=>{if(u.pointerId!==i.pointerId)return;let p=u.clientX-r,f=Xc(t==="left"?s+p:s-p);t==="left"?this.colLeft=f:this.colRight=f},d=u=>{u.pointerId===i.pointerId&&(c(),this.saveColumnWidths())},c=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",l),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",d);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",l),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",d)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),this.fades.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("blur",this.blurHandler),window.removeEventListener("beforeunload",this.beforeUnload),window.removeEventListener("pointerdown",this.pressStart,{capture:!0}),window.removeEventListener("pointerup",this.pressEnd,{capture:!0}),window.removeEventListener("pointercancel",this.pressEnd,{capture:!0}),window.removeEventListener("click",this.sharedValueOutside,{capture:!0}),window.removeEventListener("focusin",this.sharedValueFocus),this.removeEventListener(Es,this.scrubStart),this.removeEventListener(Fs,this.scrubEnd),window.removeEventListener("hashchange",this.takeShareLink),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.watchStatusTimer!==void 0&&window.clearInterval(this.watchStatusTimer),this.cancelGesture?.()}syncCountdownTicker(t){let i=de.map(r=>t[r]).filter(r=>r!==void 0),a=t.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(t){if(t.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(t.has("inspect")){let i=t.get("inspect");(i===void 0||qc(i)!==qc(this.inspect))&&(this.openSections=new Set(wc),this.rowHoverId=void 0)}}updated(t){this.fades.refresh([this.renderRoot.querySelector(".column.inspector"),this.renderRoot.querySelector(".layers"),this.renderRoot.querySelector(".column.canvas")]);let i=qc(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(t.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),t.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(t.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(t.has("hass")&&this.draft){let a={};for(let s of this.compiled?.entities.keys()??[])a[s]=this.hass.states[s]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(t){if(t.key==="Escape"&&this.picking){t.preventDefault(),this.togglePicking(!1);return}let i=t.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=a&&i?.tagName!=="SELECT"&&!S1.test(i?.type??""),o=this.renderRoot.querySelector("dialog[open]")!==null;if(t.key==="Escape"&&!a&&!o){this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if((t.key==="Delete"||t.key==="Backspace")&&!a&&!o){this.deleteSelection()&&t.preventDefault();return}let s=y1[t.key];if(s&&!a&&!t.metaKey&&!t.ctrlKey&&!t.altKey){this.nudge(s.dx,s.dy,t.shiftKey)&&(t.preventDefault(),this.heldArrows.add(t.key));return}if(!(t.metaKey||t.ctrlKey)||(t.key==="s"?(t.preventDefault(),this.save()):t.key==="z"&&!r?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):t.key==="y"&&!r&&(t.preventDefault(),this.redo()),r||o))return;let d=t.key.toLowerCase(),c=!0;d==="a"?this.selectAll():d==="c"?this.copySelection():d==="x"?this.copySelection()&&this.deleteSelection():d==="v"?this.pasteClip():d==="d"?this.duplicateSelection():d==="g"?t.shiftKey?this.ungroupSelection():this.groupPicked():d==="h"&&t.shiftKey?this.toggleHiddenSelection():t.key==="]"||t.key==="["?this.moveSelection(t.key==="]"?1:-1):c=!1,c&&t.preventDefault()}selectedIds(){let t=this.draft?.config;if(!t)return[];if(this.multi.size>0)return[...this.multi].filter(a=>t.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?t.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?mt(t,i.id).map(a=>a.payload.id):[]}selectRows(t){t.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:t[0]}):t.length>1&&(this.multi=new Set(t))}deleteSelection(){let t=this.selectedIds();return!this.canEdit||t.length===0?!1:(this.mutate(i=>{for(let a of t)ke(i,a)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let t=this.draft?.config,i=this.selectedIds();return!t||i.length===0?!1:(this.clipboard=ji(t,i,this.canvasFamily),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let t=this.clipboard,i=this.canvasFamily,a=[];this.mutate(r=>{a=Rp(r,t,i)}),this.selectRows(a)}duplicateSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=ji(t,i),r=[];this.mutate(o=>{r=ti(o,a)}),this.selectRows(r)}selectAll(){let t=this.draft?.config;if(!t)return;let i=gt(t,this.canvasFamily).filter(a=>!xe(t,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let t=this.draft?.config;if(!t||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?ft(t,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>Wi(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(s=>t.elements.find(l=>l.payload.id===s)).filter(s=>s!==void 0).some(s=>!Oe(t,a,s).isHidden);this.mutate(s=>{for(let l of i)Fe(s,a,l,{isHidden:o})})}moveSelection(t){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,t)}moveLayer(t,i){this.mutate(a=>{let r=a.elements.filter(u=>!xe(a,u)),o=a.elements.filter(u=>xe(a,u)),s=r.findIndex(u=>u.payload.id===t),l=s+i;if(s<0||l<0||l>=r.length)return;[r[s],r[l]]=[r[l],r[s]];let d=r[l],c=r[s];d.payload.groupId!==c.payload.groupId&&(c.payload.groupId===void 0?delete d.payload.groupId:d.payload.groupId=c.payload.groupId),a.elements=[...r,...o],$t(a),Ui(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let t=await Op(this.hass);if(this.owners=t.owners,this.maxSchemaVersion=t.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(t){this.loadError=`Could not load devices: ${Kt(t)}`}this.linkReady=!0,this.openPendingLink()}async selectOwner(t){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=t,this.pickerConfirmDelete=void 0,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0,this.sendStatusKnown=!1,this.lastSyncSeconds=void 0;let i=this.owners.find(s=>s.owner_watch_id===t),a=Ge(i)==="iphone",r=a?er:Qa,o=a?jh(i?.screen_size):qh(i?.screen_size);o?this.previewCase=o.label:r.some(s=>s.label===this.previewCase)||(this.previewCase=(a?Td:Vo).label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await Kp(this.hass,t,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let t=await Gp(this.hass,this.ownerId);this.records=t.records,this.maxSchemaVersion=t.max_schema_version,this.presets=t.presets??[],this.occupied=t.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=t.pages??[],this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,this.polling=t.polling??!1,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(t){this.loadError=`Could not load complications: ${Kt(t)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(t){t.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(t))}openRecord(t){this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=wi.fromDocument(t.document,t.revision),this.savedName=String(t.document?.name??"");let i=Number(t.document?.schemaVersion??0),a=wo(t.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=Kt(i)}this.scheduleTemplates(0)}startNew(t){return this.draft?.dirty&&!this.confirmDiscard()?!1:(this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new wi(t,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0),!0)}freeSlot(){return zu(this.records.map(t=>Number(t.document?.slotIndex??-1)),this.occupied)}async refreshWatchStatus(){if(!(!this.ownerId||this.sendPending))try{let t=await Vp(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.lastSyncSeconds=typeof t.last_sync_seconds=="number"?t.last_sync_seconds:void 0,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0}catch{}}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},1e4)}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let t=await Bp(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,typeof t.applied_token=="number"&&t.applied_token!==t.token&&this.beginSendWait()}catch(t){this.saveError=Kt(t)}}renderSendButton(){let t=nh({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending,lastPollSeconds:this.lastPollSeconds,deviceKind:this.selectedOwner?.device_kind,lastSyncSeconds:this.lastSyncSeconds});if((t.kind==="unsupported"||t.kind==="openApp")&&!this.sendStatusKnown)return m;let i=ih(t),a=i.resend&&this.hass.user?.is_admin?h`<button class="ghost" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:m;return h`<span class="send ${t.kind}" title=${i.title}>${t.kind==="sent"?"\u2713 ":""}${i.label}</span>${i.note?h`<span class="send-note" title=${i.title}>${i.note}</span>`:m}${a}`}get slotChosen(){let t=this.draft?.config.slotIndex??-1;return t>=0&&t<cl}mutate(t,i){!this.draft||!this.canEdit||(this.draft.update(t,i,this.canvasFamily),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=qa(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let t=Ju(this.draft.config);(this.compiled?.document!==this.compiledDocument||t!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=t,this.scheduleTemplates(h1))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let t=new _t(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,watchAppVersion:this.selectedOwner?.app_version,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>t.resolve(i),canCountDown:i=>t.canCountDown(i),historySeries:i=>this.historySeries.get(i),historyReadings:i=>this.historyReadings.get(i),evaluateTest:i=>t.evaluateTest(i),liveBranch:i=>t.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),helpSections:this.helpSections,toggleHelp:i=>this.toggleHelp(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}},peekLayer:(i,a)=>{a?this.rowHoverId=i:this.rowHoverId===i&&(this.rowHoverId=void 0)},selectValue:i=>this.openSharedValue(i),beginGesture:()=>this.draft?.beginGesture(),copiedPosition:this.copiedPosition,copyPosition:i=>{this.copiedPosition=i}}}toggleSection(t){let i=new Set(this.openSections);i.has(t)?i.delete(t):(i.size<=1&&i.clear(),i.add(t)),this.openSections=i}toggleHelp(t){let i=new Set(this.helpSections);i.has(t)?i.delete(t):i.add(t),this.helpSections=i}get watchSupported(){let t=this.selectedOwner;return t?t.is_orphan||ff(t):!0}get ownerFamilies(){return yf(this.selectedOwner)}get deviceWord(){return Pd(this.selectedOwner)}get canvasFamily(){if(qe(this.activeFamily))return this.activeFamily;let t=this.draft?.config;return(t&&Yo(t))??"rectangular"}ensureActiveFamily(){let t=this.draft?.config;if(!t)return;let i=this.ownerFamilies;t.supportedFamilies.includes(this.activeFamily)&&i.includes(this.activeFamily)||(this.activeFamily=yt(t).find(a=>i.includes(a))??i[0]??"rectangular")}addHere(t){this.mutate(t)}static sizeWords(t){let i=ce[t];return`${i.width} \xD7 ${i.height} pt`}renderShapeIsBlank(t,i,a){if(t.elements.length===0||!qe(this.activeFamily))return m;if(gt(t,i).length>0)return m;let r=de.filter(o=>o!==i&&t.supportedFamilies.includes(o)).filter(o=>As(t,o)>0);return h`<div class="blank-shape">
      <b>Nothing is on the ${te(i)} shape yet.</b>
      <div class="hint">Each shape has its own layers. The ones on the other shapes belong to
        those shapes, so they are not listed here and nothing you do here can reach them. Add
        layers below, or take a copy of another shape's arrangement.</div>
      ${a&&r.length>0?h`<div class="adders">
            ${r.map(o=>h`<button class="small primary"
              title=${`Put a copy of every layer on the ${te(o)} shape here, where it sits there, scaled to this canvas`}
              @click=${()=>this.mutate(s=>fg(s,o,i))}>Copy the ${te(o)} layout</button>`)}
          </div>
          <div class="hint">The copies are layers of their own: editing one here changes nothing on
            the ${te(r[0])} shape. They are scaled on the way in, because a point is a
            point and this canvas is ${H.sizeWords(i)} against
            ${H.sizeWords(r[0])}, so sizes come down to match and a round
            shape pulls the layout in off its rim. Expect to nudge it by hand afterwards.</div>`:m}
    </div>`}addShape(t){this.ownerFamilies.includes(t)&&(this.mutate(i=>wf(i,t)),this.activeFamily=t,this.inspect={kind:"family"})}removeShape(t){let i=this.draft?.config;if(!i||!Xo(i,t))return;let a=vf(i,t);a.length>0&&!window.confirm(`Remove the ${te(t)} shape? This deletes ${a.join(", ")}. They are on this shape only, so nothing else in the complication loses anything.`)||(this.mutate(r=>Gd(r,t)),this.ensureActiveFamily())}createNew(){let t=this.newFamily,i=this.newName.trim();!t||i===""||this.newNameProblem()!==void 0||(this.closeNewDialog(),this.startNew($p(i,this.freeSlot(),[t])))}setForced(t,i){let a=new Map(this.forced);i==="live"?a.delete(t):a.set(t,i),this.forced=a}async save(t=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!t&&!this.draft.dirty)){if(!t&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(t){let s=this.freeSlot();if(s<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=ie(),l.slotIndex=s,i=new wi(l,null)}let a=i.encoded(),r=await ld(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id;let o=this.draft.testValues;this.draft=wi.fromDocument(r.record.document,r.record.revision),this.draft.testValues=o,this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=Kt(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}await this.deleteSaved(this.selectedId,this.draft.baseRevision)}}async deleteSaved(t,i){if(!this.ownerId)return;let a=t===this.selectedId;this.saving=!0;try{let r=await Up(this.hass,this.ownerId,t,i);if(!r.ok){r.error==="conflict"&&a?this.conflict={current:r.current??null,message:r.message??"This complication changed on the server."}:this.saveError=r.message??r.error??"Delete failed";return}a&&(this.clearDraft(),this.selectedId=void 0),await this.loadRecords()}catch(r){this.saveError=Kt(r)}finally{this.saving=!1,this.confirmDelete=!1,this.pickerConfirmDelete=void 0}}duplicate(){if(!this.draft)return;let t=structuredClone(this.draft.config);t.id=ie(),t.name=`${t.name} copy`,t.slotIndex=this.freeSlot(),this.startNew(t)}reloadFromServer(){let t=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,t&&!t.deleted?this.openRecord(t):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(t=>t.owner_watch_id===this.ownerId)}async moveAll(){let t=this.ownerId,i=this.moveTarget;if(!(!t||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await Wp(this.hass,t,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=Kt(a)}finally{this.moving=!1}}}scheduleTemplates(t){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},t),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},p1)}async refreshHistorySeries(){let t=this.draft?.config,i=t?dd(t):void 0;if(!i||Object.keys(i.history).length===0&&Object.keys(i.statistics).length===0){this.historySeries.size>0&&(this.historySeries=new Map),this.historyReadings.size>0&&(this.historyReadings=new Map);return}try{let a=await this.fetchSeries(i);this.historySeries=a.series,this.historyReadings=a.readings}catch{}}async fetchSeries(t){let[i,a]=await Promise.all([qp(this.hass,t.history),Xp(this.hass,t.statistics).catch(()=>({}))]);return Yp({...i,...a})}static{this.IMPORT_HISTORY_DELAY_MS=350}scheduleImportHistory(){this.importHistoryTimer&&window.clearTimeout(this.importHistoryTimer),this.importHistoryTimer=window.setTimeout(()=>{this.importHistoryTimer=void 0,this.refreshImportHistory()},H.IMPORT_HISTORY_DELAY_MS)}async refreshImportHistory(){let t=this.importOpen?this.importPreview()?.config:void 0,i=t?dd(t,r=>this.hass.states[r]!==void 0):void 0;if(i?.signature===this.importHistoryAsked)return;let a=++this.importHistoryRun;if(this.importHistoryAsked=i?.signature,!i||Object.keys(i.history).length===0&&Object.keys(i.statistics).length===0){this.importHistory.size>0&&(this.importHistory=new Map);return}try{let r=await this.fetchSeries(i);if(a!==this.importHistoryRun)return;this.importHistory=r.series}catch{a===this.importHistoryRun&&(this.importHistoryAsked=void 0)}}async refreshTemplates(){this.refreshHistorySeries();let t=this.compiled?.document;if(!t){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await jp(this.hass,{doc:t})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=sh(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=Kt(i)}}entityStateFor(t,i,a){let r=this.hass.states[t];if(!r)return;let o=r.attributes,s=t.split(".")[0]??"",l={entityId:t,state:(a?this.testValues.get(t):void 0)??r.state,unitOfMeasurement:typeof o.unit_of_measurement=="string"?o.unit_of_measurement:void 0,iconName:i,domain:s};if(s==="timer"){l.timerState=r.state,typeof o.finishes_at=="string"&&(l.finishesAt=o.finishes_at);let d=E1(o.remaining);d!==void 0&&(l.remaining=d)}return typeof o.entity_picture=="string"&&(l.entityPicture=o.entity_picture),l}buildContext(t=!0){let i=new Map;for(let[r,o]of this.compiled?.entities??[]){let s=this.entityStateFor(r,o.iconName??"",t);s&&i.set(r,s)}let a=this.draft?.config.values??[];return{entityStates:i,templateResults:this.templateResults,historySeries:this.historySeries,namedValues:t?Qp(a,this.testValues):a,dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3,testedEntities:t?new Set(this.testValues.keys()):new Set}}renderPickButton(){let t=this.picking,i=!this.draft||this.parseError!==void 0;return h`<button class="pick ${t?"on":""}" ?disabled=${i}
      aria-pressed=${t?"true":"false"}
      title=${t?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span><span class="word">${t?"Picking\u2026":"Pick layer"}</span></button>`}renderShowTapsButton(){let t=this.showTaps;return h`<button class="pick ${t?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${t?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span><span class="word">Show taps</span></button>`}renderTintTool(){let t=this.previewTint,i=Ed.find(l=>l.hex===t),a=!this.draft||this.parseError!==void 0,r=Dt(this.activeFamily),o=r?"iPhone tinted":"tint",s=l=>{this.toggleMenu("tint",!1),this.previewTint=l};return h`<span class="inbox tint-box ${t!==void 0?"on":""}"
      title=${r?"A tinted Home Screen drops the tile's background and paints every layer in one colour, keeping only how bright each part was. Layers in the accent group take the lighter of the two colours.":"Many watch faces draw complications in one colour. Colours become the face's tint, text and background turn white, and only how see-through each part is survives."}>
      <span class="pre">Colour</span>
      <span class="case-tool" data-menu="tint">
        <button class="case-pick" ?disabled=${a} aria-haspopup="listbox" aria-expanded=${this.openMenu==="tint"?"true":"false"}
          aria-label=${`Preview colour, ${i?`${i.label} ${r?"tinted Home Screen":"tinted face"}`:"full colour"}`} @click=${()=>this.toggleMenu("tint")}>
          ${i?h`<i class="tint-dot" style=${`--sw:${i.hex}`}></i>${i.label} ${o}`:"Full colour"}${P("chevron")}
        </button>
        ${this.openMenu==="tint"?h`<div class="pop-menu" role="listbox" aria-label="Preview colour">
          <button class="row" role="option" aria-selected=${t===void 0?"true":"false"} @click=${()=>s(void 0)}>
            <i class="tint-dot full"></i>Full colour</button>
          ${Ed.map(l=>h`<button class="row" role="option" aria-selected=${l.hex===t?"true":"false"}
            @click=${()=>s(l.hex)}><i class="tint-dot" style=${`--sw:${l.hex}`}></i>${l.label} ${o}</button>`)}
        </div>`:m}
      </span>
    </span>`}renderZoomButton(){let t=!this.draft||this.parseError!==void 0||!qe(this.activeFamily);return h`<button class="pick only-icon" ?disabled=${t} aria-label="Expand the preview"
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}>${P("expand")}</button>`}renderOver(){return h`<div class="over">
      <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}</span>
      <span class="bar-sep" aria-hidden="true"></span>
      <span class="face-tools">${this.renderSnapTools()}</span>
      <span class="bar-sep" aria-hidden="true"></span>
      ${this.renderZoomButton()}
    </div>`}renderSnapTools(){let t=!this.draft||this.parseError!==void 0||!qe(this.activeFamily),i=this.snapGrid,a=this.showGridLines,r=this.snapLayers,o=a?w`<path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><circle cx="8" cy="8" r="1.9" />`:w`<path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><path d="M2.5 13.5l11-11" />`;return h`<span class="grid-tool ${i?"on":""}" data-menu="grid">
      <button class="pick ${i?"on":""}" ?disabled=${t} aria-pressed=${i?"true":"false"}
        title=${i?"Layers land on the grid when you drag them, and arrow keys move one grid step. Hold Alt to drag freely. Click to turn it off.":"Snap layers to a grid when you drag them. Without it, hold Alt while dragging to snap."}
        @click=${()=>this.setGrid(!i,this.gridStep)}><span class="glyph">▦</span><span class="word">Snap to grid</span></button>
      ${i?h`<button class="grid-step" ?disabled=${t} aria-haspopup="listbox" aria-expanded=${this.openMenu==="grid"?"true":"false"}
        aria-label=${`Grid size, ${this.gridStep*100}%`} title="Grid size"
        @click=${()=>this.toggleMenu("grid")}>${this.gridStep*100}%${P("chevron")}</button>
      ${this.openMenu==="grid"?h`<div class="pop-menu" role="listbox" aria-label="Grid size">
        ${md.map(s=>h`<button class="row" role="option" aria-selected=${s===this.gridStep?"true":"false"}
          @click=${()=>{this.toggleMenu("grid",!1),this.setGrid(!0,s)}}>${s*100}%</button>`)}
      </div>`:m}`:m}
    </span>
    <button class="pick ${a?"on":""}" ?disabled=${t} aria-pressed=${a?"true":"false"}
      title=${a?"Hide the grid lines. Snapping is not changed.":"Draw the grid on the face. Snapping is not changed."}
      @click=${()=>this.setGrid(i,this.gridStep,!a)}>
      <span class="glyph"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${o}</svg></span><span class="word">Grid lines</span></button>
    <button class="pick ${r?"on":""}" ?disabled=${t} aria-pressed=${r?"true":"false"}
      title=${r?"Edges and middles land on the other layers' edges and middles, and on the middle of the face, with a pink line while they meet. Click to turn it off.":"Snap to the other layers' edges and middles while dragging."}
      @click=${()=>this.setGrid(i,this.gridStep,a,!r)}><span class="glyph">${P("guides")}</span><span class="word">Snap to layers</span></button>`}renderZoomDialog(t,i,a){let r=this.draft?.config;if(!r)return m;let o=In(a,t),s=t==="corner"?104/124:o.width/o.height;return h`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
      <div class="zoom-bar">
        ${this.renderUnder(r,t)}
        <span class="spacer"></span>
        ${this.renderTintTool()}
        ${this.renderPickButton()}
        ${this.renderShowTapsButton()}
        ${this.renderSnapTools()}
        <button class="pick" title="Back to the editor (Escape)" @click=${()=>{this.zoomed=!1}}><span class="glyph">⤡</span>Close</button>
      </div>
      <div class="zoom-stage" style=${`--wa-ratio:${s}`}>
        ${this.renderBigPreview(t,i,a)}
      </div>
    </dialog>`}renderHelpDialog(){let t=Un,i=Jc,a=[[`${t}S`,"Save"],[`${t}Z \xB7 ${i}${t}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${t}C \xB7 ${t}X \xB7 ${t}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${t}D`,"Duplicate the selection in place"],[`${t}A`,"Pick every layer"],[`${t}G \xB7 ${i}${t}G`,"Group the pick \xB7 Ungroup"],[`${t}] \xB7 ${t}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${t}H`,"Hide or show the selection in the shape being edited"],["Escape","Drop the pick, then the selection. Also stops Pick layer and closes a dialog"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${da}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a group to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Snapping","The three switches over the face. Snap to grid: layers land on a grid when you drag them, 1% by default, and arrows move one grid step; the size sits beside it. Grid lines draws the grid. Snap to layers: edges and middles land on the other layers' and on the middle of the face, with a pink line while they meet. Both snaps start on"],["Alt-drag","Flips snapping for that drag: a drag that would snap moves freely, and one that would not snaps to the grid"],["Expand","The button over the face. The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"]],o=[["Shapes","Rectangular, Circular, Corner and Inline are the kinds of slot on a watch face. The watch offers a complication only in slots whose shape it has."],["Shape tabs","Above the preview. Click one to edit that shape, or a dashed one to add it."],["Canvas shapes","Rectangular, Circular and Corner each hold their own layers. A layer belongs to one shape, so editing it never changes another. An empty shape can take a copy of another shape's layers."],["Corner","Its Corner content card picks big curved text or a canvas of layers."],["Inline","One line of text with an optional symbol before it. It has no layers."],["Home Screen","On an iPhone only: Small, Medium, Large and Extra Large are the Home Screen tile sizes. Each is a canvas shape with its own layers, drawn edge to edge in the tile."],["Small \xB7 Medium \xB7 Large","A square, a wide band about twice as wide as it is tall, and a tall tile a little taller than it is wide. Add the ones you want; a size the complication does not have is not offered when you add a widget."],["Extra Large","The full-page tile, iOS 27 and later. An iPhone on iOS 26 is not offered it when adding a widget, and everything else still draws."],["A tinted Home Screen","iOS 18 lets a user tint the whole Home Screen. The system then drops the tile background and draws the design in two tones, so a design that relies on colour alone reads differently there."],["The shape itself","The bottom row of the Layers list: its background, border and Shape states."]],s=[["Text","A value: typed words, an entity, a template, a shared value and more. It can count down to a time."],["Icon","An SF Symbol or Material Design icon, or the entity's own icon."],["Gauge","A number drawn between a minimum and a maximum."],["Chart","Recent history as bars, a line or an area."],["Timeline","Which state an entity was in over time, as a coloured strip."],["Shape","A rectangle, rounded rectangle, capsule, circle or line."],["Picture","A camera snapshot, or an entity's picture such as a person's avatar or album art."],["Tap area","Invisible. A tap inside it runs its own action. Outside it, the complication's tap action applies."],["Extras","Clock times, chart dots, a chart grid and a picture's timestamp are added from their layer's Extras card."],["Order","The top of the Layers list draws on top. Drag a row to reorder."],["Groups",`A set of layers kept together in the list. Pick some and press ${t}G. Locked, the group moves as one on the face. Unlocked, each layer moves alone. The watch never sees groups.`]],l=[["Content","What the layer shows, starting with its entity or value."],["Look","How it is drawn: size, colour and style. On a picture the card is called Picture."],["Extras","Charts, timelines and pictures only: labels, markers, clock times, dots, grid lines or a timestamp."],["States","Changes that apply while a value matches, described below."],["Position","Where the layer sits on the shape being edited, and its size."],["Tap","What a tap on the layer does."],["?","In a card's header: shows that card's help text."]],d=[["By value","Gauges, charts and text can colour by value instead of one colour. Each band colours readings up to its number, lowest band first. Readings above every band take the Above the last band colour."],["Timeline colours","A timeline colours each state from its own table."],["States","Rows that test a value, like is on or is greater than, each with the changes it makes: icon, text, colour, visibility and more. Rows are checked top to bottom and the first match wins. Otherwise applies when none match."],["Shape states","The same table, on the shape itself."],["Shared values","Like a variable: set it once under the Layers card, and every layer that reads it follows. On a layer, set Source to Shared value, or click Make shared."],["Values on the watch","Every entity and shared value the complication reads, with its live reading. Slide, pick or type another value to watch the preview and the states react. Nothing is saved, and Live or Back to live returns to the real reading."]],c=[["Save",`Writes the complication to Home Assistant (${t}S). A new one says Save new until then. Only an administrator can save.`],["The dot","Beside Save: unsaved changes, saved, or not saved yet. The footer says the same in words."],["Reaching the watch","The watch pulls saved changes by itself while Wrist Assistant is open on this home. There is no separate send step."],["Hide","The eye beside a complication in the list. It stops the watch offering that complication when you edit a face, and faces already using it keep it. Hidden ones fold into Hidden at the bottom of the list. For the open complication it saves with Save; for any other it saves at once."]],u=[["On watch","The watch has applied every change. With last seen beside it, the watch is not listening now, so a later save waits until the app is open again."],["Sending\u2026","Waiting for the watch to pull and confirm."],["Not on watch yet","The watch is connected but has not confirmed the latest change. Resend wakes it again."],["Open the watch app to sync","The watch is not listening. Open Wrist Assistant on the watch, or switch it to this home, and it pulls at once. Resend tries to wake it."],["Update the watch app","This watch has never reported a change. Its app is older than custom complications, or it has not opened this home yet."]],p=[["Share","In the top bar. Turns the open complication into text anyone can import. Your entity ids and names become numbered slots, and you can label each one."],["Backup","The other choice in Share: an exact copy, entity ids and names included. For your records, or another watch in this home."],["Copy link","A link to this panel with the text inside it. Opening it here fills in the Import dialog. On another home, paste the link into Import."],["Import","Beside New. Paste text or a link, choose a file, or drop one on the dialog. Check the preview, choose your own entity for each slot, then Import. It opens as unsaved work and reaches the watch at the first Save."]],f=x=>x.map(([$,k])=>h`<tr><th scope="row"><kbd>${$}</kbd></th><td>${k}</td></tr>`),g=(x,$)=>h`<section>
      <h3>${x}</h3>
      <table class="terms"><tbody>${$.map(([k,C])=>h`<tr><th scope="row">${k}</th><td>${C}</td></tr>`)}</tbody></table>
    </section>`,b=(x,$)=>h`<button role="tab" id=${`wa-help-${x}`} aria-selected=${this.helpTab===x?"true":"false"}
      @click=${()=>{this.helpTab=x}}>${$}</button>`,y;return this.helpTab==="keys"?y=h`
        <section>
          <h3>Keys</h3>
          <table><tbody>${f(a)}</tbody></table>
          <p class="hint">Keys act on layers only while nothing is being typed into. In a field they keep their usual meaning.</p>
        </section>
        <section>
          <h3>Mouse</h3>
          <table><tbody>${f(r)}</tbody></table>
        </section>`:this.helpTab==="sync"?y=h`<div>${g("Saving",c)}${g("Watch status",u)}</div>${g("Share and import",p)}`:y=h`<div>${g("Shapes",o)}${g("Cards",l)}</div><div>${g("Layers",s)}${g("Colour, states and values",d)}</div>`,h`<dialog class="help-dialog" @close=${()=>{this.helpOpen=!1}}>
      <div class="help-head">
        <h2>Help</h2>
        <span class="spacer"></span>
        <a href="https://docs.wrist-assistant.com/" target="_blank" rel="noopener noreferrer">Wrist Assistant docs</a>
        <button class="pick" title="Close (Escape)" @click=${()=>{this.helpOpen=!1}}>Close</button>
      </div>
      <div class="help-tabs" role="tablist" aria-label="Help topics">
        ${b("basics","Basics")}${b("keys","Keys and mouse")}${b("sync","Syncing and sharing")}
      </div>
      <div class="help-body" role="tabpanel" aria-labelledby=${`wa-help-${this.helpTab}`}>${y}</div>
    </dialog>`}setShowTaps(t){this.showTaps=t,t&&this.togglePicking(!1)}togglePicking(t=!this.picking){this.picking=t,this.pickHoverId=void 0,t&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(t){let i=this.draft?.config;if(!i)return;let r=t.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");return r?$o(i,r):void 0}leaveRow(t){this.listHoverIds.length===t.length&&this.listHoverIds.every((a,r)=>t[r]===a)&&(this.listHoverIds=[])}onPickMove(t){this.picking&&(this.pickHoverId=this.hitLayerId(t))}pickAt(t,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(t!==this.activeFamily&&(this.activeFamily=t),this.inspect={kind:"layer",id:a})}onPreviewPointerDown(t,i){let a=this.renderRoot,r="activeElement"in a?a.activeElement:null;if(r&&typeof r.blur=="function"&&!i.currentTarget?.contains(r)&&r.blur(),this.picking){i.preventDefault(),this.pickAt(t,i);return}let o=i.target,s=o.closest("[data-handle]")?.getAttribute("data-handle")??null,l=o.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0,d=o.closest("svg.complication");if(this.showTaps){let X=this.focusTapId();if(X!==void 0&&l===X&&d&&this.draft&&this.canEdit){if(t!==this.activeFamily){this.activeFamily=t;return}i.preventDefault(),this.beginTapBoxGesture(t,i,d,X,s??void 0);return}let z=this.hitLayerId(i);z?this.inspect={kind:"layer",id:z}:l===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;if(t!==this.activeFamily){this.activeFamily=t;return}let c=fy(i),u=l!==void 0?$o(this.draft.config,l):void 0;if(!c&&!s&&d&&this.multi.size>=2&&u!==void 0&&this.multi.has(u)){let X=kp(this.draft.config,this.multi);if(i.preventDefault(),X.length===0)return;this.beginMoveGesture(t,i,d,X,`drag-pick-${t}`,()=>{this.multi=new Set,this.inspect={kind:"layer",id:u}});return}if(!c&&this.multi.size>0&&(this.multi=new Set),!l||!d)return;let p=$o(this.draft.config,l),f=this.draft.config.elements.find(X=>X.payload.id===p);if(!p||!f)return;if(c){i.preventDefault(),this.togglePick(p);return}let g,b=this.inspect.kind==="layer"?this.inspect.id:void 0;if(b!==void 0&&b!==p&&!s){let X=this.draft.config.elements.find(K=>K.payload.id===b);X!==void 0&&X.kind!=="chartDots"&&X.kind!=="chartGrid"&&X.payload.chartAnchor?.place!=="through"&&ft(this.draft.config,b)?.locked!==!0&&C1(d,b,i)&&(g=p,p=b,f=X)}let y=ft(this.draft.config,p),x=y!==void 0&&this.inspect.kind==="group"&&this.inspect.id===y.id;if(y&&(y.locked||x)&&!s){let X=x||this.inspect.kind==="layer"&&ft(this.draft.config,this.inspect.id)?.id===y.id;this.beginGroupGesture(t,i,d,y,X?p:void 0);return}if((this.inspect.kind!=="layer"||this.inspect.id!==p)&&(this.inspect={kind:"layer",id:p},s)||f.payload.chartAnchor?.place==="through")return;i.preventDefault();let $=Oe(this.draft.config,t,f).frame,k=this.gestureCanvas(t),C=f.payload.chartAnchor,M=C!==void 0&&!Qt(C.at)&&C.place!=="through",D=C!==void 0&&Qt(C.at)&&C.place==="through",I=ce[t],T={dx:C?.dx??0,dy:C?.dy??0},F=C!==void 0&&!s?dn(this.draft.config,this.buildContext(),this.forced)[t]?.elements.find(X=>X.id===p)?.frame:void 0,N=F??$,j=X=>Math.round(X*10)/10;this.cancelGesture?.();let B=!1,W=s!==null?dn(this.draft.config,this.buildContext(),this.forced)[t]?.elements.find(X=>X.id===p):void 0;if(s!==null&&W?.kind==="icon"){let X=Ad(W)/2,z=W.size;this.cancelGesture=Sh(d,i,s,{w:X,h:X},(K,Y)=>{this.mutate(v=>{Fe(v,t,p,{size:Math.max(1,Math.round(z*K))})},`drag-${p}-${t}`),Y&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let ne=W!==void 0?of(W,N,k):{};this.cancelGesture=_o(d,k,i,{elementId:p,frame:N,handle:s??void 0,...ne,...C===void 0?{...this.snapTarget(t),...this.guideTarget(t,[p])}:{}},{...this.guideSink(),onFrame:(X,z,K)=>{if(K||(B=!0),K&&!B&&g!==void 0){this.inspect={kind:"layer",id:g},this.cancelGesture=void 0;return}this.mutate(Y=>{if(C===void 0){Fe(Y,t,X,{frame:z});return}let v=F?{width:$.width,height:$.height}:{width:z.width,height:z.height};Fe(Y,t,X,{frame:{...z,...v,x:M?z.x:$.x,y:$.y}});let S=Y.elements.find(O=>O.payload.id===X)?.payload.chartAnchor;if(S===void 0)return;let E=T.dx,_=D?T.dy:j(T.dy+(z.y-N.y)*I.height);E?S.dx=E:delete S.dx,_?S.dy=_:delete S.dy},`drag-${X}-${t}`),K&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(t,i,a,r,o){let s=this.draft?.config;if(!s)return;let l=mt(s,r.id);if(l.length===0)return;o===void 0&&(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let d=o===void 0?void 0:()=>{this.inspect={kind:"layer",id:o}};this.beginMoveGesture(t,i,a,l.map(c=>c.payload.id),`drag-group-${r.id}-${t}`,d)}beginMoveGesture(t,i,a,r,o,s){let l=this.draft?.config;if(!l)return;let d=l.elements.filter(D=>r.includes(D.payload.id));if(d.length===0)return;let c=new Map(d.map(D=>[D.payload.id,Oe(l,t,D).frame])),u=[...c.values()],p=Math.min(...u.map(D=>D.x)),f=Math.min(...u.map(D=>D.y)),g=Math.max(...u.map(D=>D.x+D.width)),b=Math.max(...u.map(D=>D.y+D.height)),y={x:p,y:f,width:g-p,height:b-f,rotationDegrees:0},x=D=>Math.round(D*1e3)/1e3;this.cancelGesture?.();let $=!1,k=D=>{D.pointerId===i.pointerId&&Math.hypot(D.clientX-i.clientX,D.clientY-i.clientY)>T1&&($=!0)};a.addEventListener("pointermove",k);let C=()=>a.removeEventListener("pointermove",k),M=_o(a,this.gestureCanvas(t),i,{elementId:o,frame:y,...this.snapTarget(t),...this.guideTarget(t,r)},{...this.guideSink(),onFrame:(D,I,T)=>{if(T&&C(),!T&&!$)return;if(T&&!$&&s!==void 0){s(),this.cancelGesture=void 0;return}let F=I.x-y.x,N=I.y-y.y;this.mutate(j=>{for(let[B,W]of c)Fe(j,t,B,{frame:{...W,x:x(W.x+F),y:x(W.y+N)}})},o),T&&(this.draft?.endGesture(),this.cancelGesture=void 0)}});this.cancelGesture=()=>{C(),M()}}nudge(t,i,a){let r=this.draft?.config;if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?Ch:1,s=t*o,l=i*o,d=this.canvasFamily,c=ce[d];if(this.multi.size>=2)return this.nudgeMany([...this.multi],d,c,`nudge-multi-${d}`,s,l);if(this.inspect.kind==="group"){let x=this.inspect.id;return this.nudgeMany(mt(r,x).map($=>$.payload.id),d,c,`nudge-group-${x}-${d}`,s,l)}if(this.inspect.kind!=="layer")return!1;let u=this.inspect.id,p=r.elements.find(x=>x.payload.id===u);if(!p||p.payload.chartAnchor?.place==="through")return!1;let f=ft(r,u);if(f?.locked)return this.nudgeMany(mt(r,f.id).map(x=>x.payload.id),d,c,`nudge-group-${f.id}-${d}`,s,l);let g=Oe(r,d,p).frame,b=p.payload.chartAnchor;if(b!==void 0){let x=!Qt(b.at);return l===0&&!(x&&s!==0)||this.mutate($=>{x&&s!==0&&Fe($,d,u,{frame:Io(g,s,0,c)});let k=$.elements.find(M=>M.payload.id===u)?.payload.chartAnchor;if(k===void 0||l===0)return;let C=Math.round(((k.dy??0)+l)*10)/10;C?k.dy=C:delete k.dy},`nudge-${u}-${d}`),!0}let y=this.snapGrid?bd(g,s,l,Qi(this.gridStep,c)):Io(g,s,l,c);return(y.x!==g.x||y.y!==g.y)&&this.mutate(x=>Fe(x,d,u,{frame:y}),`nudge-${u}-${d}`),!0}nudgeMany(t,i,a,r,o,s){let l=this.draft?.config;if(!l)return!1;let d=C=>Math.round(C*1e3)/1e3,c=new Map;for(let C of t){let M=l.elements.find(D=>D.payload.id===C);M&&c.set(C,Oe(l,i,M).frame)}if(c.size===0)return!1;let u=[...c.values()],p=Math.min(...u.map(C=>C.x)),f=Math.min(...u.map(C=>C.y)),g=Math.max(...u.map(C=>C.x+C.width)),b=Math.max(...u.map(C=>C.y+C.height)),y={x:p,y:f,width:g-p,height:b-f,rotationDegrees:0},x=this.snapGrid?bd(y,o,s,Qi(this.gridStep,a)):Io(y,o,s,a),$=x.x-y.x,k=x.y-y.y;return($!==0||k!==0)&&this.mutate(C=>{for(let[M,D]of c)Fe(C,i,M,{frame:{...D,x:d(D.x+$),y:d(D.y+k)}})},r),!0}gestureCanvas(t){let i=Uo(this.previewSlot(t),t);if(t!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=_d(i.scale,r);return{width:o,height:o}}focusTapId(){let t=this.draft?.config;if(!t||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=t.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:et(t,i)[0]?.payload.id}beginTapBoxGesture(t,i,a,r,o){let s=this.draft?.config,l=s?.elements.find(u=>u.payload.id===r);if(!s||!l)return;let d=xe(s,l),c=Oe(s,t,l).frame;this.cancelGesture?.(),this.cancelGesture=_o(a,this.gestureCanvas(t),i,{elementId:r,frame:c,handle:o,...this.snapTarget(t)},{onFrame:(u,p,f)=>{this.mutate(g=>{d?Tp(g,u,t,p):Fe(g,t,u,{frame:p})},`tap-box-${u}-${t}`),f&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let t=this.draft,i=!!t?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:my(this.panelWidth,this.colLeft,this.colRight),r=this.records.find(o=>o.id===this.selectedId);return h`
      <header>
        <label>${this.owners.some(o=>Ge(o)==="iphone")?"Choose device":"Choose watch"}
          <select @change=${o=>{this.selectOwner(o.target.value)}}>
            ${F1(this.owners).map(o=>h`<option value=${o.owner_watch_id} ?selected=${o.owner_watch_id===this.ownerId}>
              ${gy(o)} (${o.complication_count})</option>`)}
          </select>
        </label>
        ${oy()}
        <label class="pick-label" for="wa-picker">Choose complication</label>
        ${this.renderPicker()}
        ${this.hass.user?.is_admin?h`<span class="hor" aria-hidden="true">or</span>${oy()}`:m}
        ${this.renderNewButton()}
        ${t?h`<button class="new-btn" aria-haspopup="dialog" aria-expanded=${this.shareOpen?"true":"false"}
          title="Share or back up this complication as text, a file or a link"
          @click=${()=>this.openShareDialog()}><span>Share</span></button>`:m}
        <span class="spacer"></span>
        <button class="help" title="Help" aria-label="Help" @click=${()=>{this.helpOpen=!0}}>?</button>
        <div class="toolbar hbox hist">
          <button class="icon" @click=${()=>this.undo()} ?disabled=${!t?.canUndo} title="Undo (⌘Z)" aria-label="Undo">${P("undo")}</button>
          <span class="hdiv"></span>
          <button class="icon" @click=${()=>this.redo()} ?disabled=${!t?.canRedo} title="Redo (⇧⌘Z)" aria-label="Redo">${P("redo")}</button>
        </div>
        <div class="hbox status">
          <span class="dirty-dot ${i?"":r?"clean":"none"}" title=${i?"Unsaved changes":r?"Saved":"Not saved yet"}></span>
          ${this.renderSendButton()}
          <button class="primary save ${i?"dirty":""}" @click=${()=>{this.save()}} ?disabled=${!this.canEdit||!i||this.saving||!this.slotChosen} title="Save (⌘S)">${this.saving?"Saving\u2026":t?.baseRevision===null?"Save new":i?"Save":"Saved"}</button>
        </div>
      </header>
      ${this.loadError?h`<div class="card error">${this.loadError}</div>`:m}
      ${this.linkNote?h`<div class="banner warn link-note"><span>${this.linkNote}</span>
        <button class="link" @click=${()=>{this.linkNote=void 0}}>Dismiss</button></div>`:m}
      ${this.helpOpen?this.renderHelpDialog():m}
      ${this.newOpen?this.renderNewDialog():m}
      ${this.shareOpen?this.renderShareDialog():m}
      ${this.galleryOpen?this.renderGalleryDialog():m}
      ${this.importOpen?this.renderImportDialog():m}
      ${this.watchSupported?h`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}${this.renderSharedValues()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:this.renderWatchGate()}`}renderWatchGate(){let t=this.selectedOwner,i=Ge(t)==="iphone",a=t?.complication_count??0,r=a===0?`Nothing on this ${Pd(t)} changes until then.`:`Your ${a} complication${a===1?"":"s"} keep${a===1?"s":""} working until then.`,o=i?h`<li>
            <span class="gate-n">1</span>
            <div><b>Update Wrist Assistant on your iPhone</b><span>Lock Screen and Home Screen complications come with it.</span></div>
          </li>
          <li>
            <span class="gate-n">2</span>
            <div><b>Open the app</b><span>The iPhone reports its new version here.</span></div>
          </li>
          <li>
            <span class="gate-n">3</span>
            <div><b>Reload this page</b><span>The editor opens. What you save here shows up on the Lock Screen customise screen, and when you add a Home Screen widget.</span></div>
          </li>`:h`<li>
            <span class="gate-n">1</span>
            <div><b>Update Wrist Assistant on your iPhone</b><span>The watch app updates with it.</span></div>
          </li>
          <li>
            <span class="gate-n">2</span>
            <div><b>Open the app on your iPhone and on your watch</b><span>The watch reports its new version here.</span></div>
          </li>
          <li>
            <span class="gate-n">3</span>
            <div><b>Reload this page</b><span>The editor opens. Complications still on your iPhone move here by themselves once the watch app is updated.</span></div>
          </li>`;return h`<div class="gate">
      <div class="gate-card">
        <div class="gate-glyph">${P("watch")}</div>
        <div class="gate-eyebrow">${i?"iPhone app update coming soon":"Watch app update coming soon"}</div>
        <h2 class="gate-title">${i?"This iPhone needs the new app.":"This watch needs the new app."}</h2>
        <p class="gate-lead">${mf(t)}</p>
        <ol class="gate-steps">
          ${o}
        </ol>
        <div class="gate-foot">${r}</div>
      </div>
    </div>`}pickerRows(){let t=this.records.map(a=>({slot:Number(a.document?.slotIndex??0),kind:"record",record:a}));return[...t,...Ou(t.map(a=>a.slot),this.occupied).map(a=>a.kind==="custom"?{slot:a.slot,kind:"locked",name:a.name||"Unnamed complication",badge:a.home||"Other home",title:`A complication on ${a.home?`the ${a.home} home`:"another home"}${a.families?.length?` (${a.families.map(te).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:a.families??[]}:{slot:a.slot,kind:"locked",name:a.name||"Unnamed preset",badge:"iPhone",title:"Still on the iPhone. Open the Wrist Assistant app on the iPhone to move it here.",families:[]})].sort((a,r)=>a.slot-r.slot)}shapeDots(t){return h`<span class="shape-dots">${this.ownerFamilies.map(i=>h`<span class="shape-dot ${i} ${t.includes(i)?"on":""}" title=${te(i)}></span>`)}</span>`}static{this.FILTER_FROM_ROWS=8}recordPreview(t){let i=this.recordPreviews.get(t.id);if(i&&i.revision===t.revision)return i;try{let a=Bi(t.document),r={revision:t.revision,config:a,entities:[...qa(a).entities.values()]};return this.recordPreviews.set(t.id,r),r}catch{this.recordPreviews.delete(t.id);return}}renderRowArt(t){let i=this.recordPreview(t);if(!i)return h`<span class="pk-art"></span>`;let a=i.config,o=(this.pickerFilter!=="all"&&a.supportedFamilies.includes(this.pickerFilter)?this.pickerFilter:void 0)??Yo(a)??"inline";return this.renderConfigArts(a,i.entities,[o],"pk-art")[0]}renderConfigArts(t,i,a,r,o){let s=this.configLayouts(t,i,o);return a.map(l=>{if(l==="inline")return h`<span class="${r} inline">${this.renderInlinePreview(s.inline,!0)}</span>`;let d=s[l];return d?h`<span class="${r} ${l}">${xi(d,{icons:this.icons,imageSizes:this.imageSizes,slot:In(this.referenceCase,l)})}</span>`:h`<span class=${r}></span>`})}configLayouts(t,i,a){let r=new Map;for(let o of i){let s=this.entityStateFor(o.entityId,o.iconName??"",!1);s&&r.set(o.entityId,s)}return dn(t,{entityStates:r,templateResults:new Map,...a?{historySeries:a}:{},namedValues:t.values})}renderPickerFilter(t){let i=r=>r.kind==="record"?Yc(r.record):r.families,a=(r,o,s)=>h`<button
      class="pk-chip ${this.pickerFilter===r?"on":""}" ?disabled=${s===0}
      aria-pressed=${this.pickerFilter===r?"true":"false"}
      @click=${()=>{this.pickerFilter=r}}>${o}<span class="pk-count">${s}</span></button>`;return h`<div class="pk-filter">
      ${a("all","All",t.length)}
      ${this.ownerFamilies.map(r=>a(r,te(r),t.filter(o=>i(o).includes(r)).length))}
    </div>`}renderPicker(){let t=this.draft,i=t?t.config.name.trim()||"Untitled":"No complication",a=t?t.config.supportedFamilies:[],r=this.pickerRows(),o=this.pickerFilter,s=o==="all"?r:r.filter(d=>(d.kind==="record"?Yc(d.record):d.families).includes(o)),l=vp(s,d=>d.kind==="record"?{id:d.record.id,hidden:this.rowHidden(d.record)}:void 0,this.selectedId);return h`<div class="picker">
      <button id="wa-picker" aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(a)}
        <span class="pk-name">${i}</span>
        ${t&&t.baseRevision===null?h`<span class="pk-rev">unsaved</span>`:m}
        ${P("chevron")}
      </button>
      ${this.pickerOpen?h`<div class="menu" role="listbox">
        ${r.length>=H.FILTER_FROM_ROWS?this.renderPickerFilter(r):m}
        ${r.length===0&&!(t&&t.baseRevision===null)?h`<div class="empty">No complications for this ${this.deviceWord} yet.</div>`:m}
        ${r.length>0&&s.length===0?h`<div class="empty">Nothing on this ${this.deviceWord} has a ${o==="all"?"":te(o)} shape.</div>`:m}
        ${l.shown.map(d=>this.renderPickerRow(d))}
        ${t&&t.baseRevision===null?h`<div class="row" aria-current="true"><span class="pk-art"></span><span class="pk-name">${i}</span>${this.shapeDots(a)}<span class="pk-badge">unsaved</span></div>`:m}
        ${l.hidden.length>0?h`
          <button type="button" class="pk-hidden-head" aria-expanded=${this.pickerHiddenOpen?"true":"false"}
            @click=${()=>{this.pickerHiddenOpen=!this.pickerHiddenOpen}}>
            ${P("chevron")}<span>Hidden (${l.hidden.length})</span>
          </button>
          ${this.pickerHiddenOpen?l.hidden.map(d=>this.renderPickerRow(d)):m}`:m}
      </div>`:m}
    </div>`}renderPickerRow(t){if(t.kind!=="record")return h`<button type="button" class="row locked" role="option" aria-disabled="true" title=${t.title}
          @click=${()=>{this.pickerNote=this.pickerNote===t.slot?void 0:t.slot}}>
          <span class="pk-art"></span>
          <span class="pk-name">${t.name}</span>
          ${this.shapeDots(t.families)}
          <span class="pk-badge">${t.badge}</span>
        </button>
        ${this.pickerNote===t.slot?h`<div class="pk-note">${t.title}</div>`:m}`;let i=t.record,a=i.id===this.selectedId,r=this.rowHidden(i),o=String(i.document?.name??"Untitled"),s=a?this.canEdit:!!this.hass.user?.is_admin,l=s,d=this.pickerConfirmDelete===i.id,c=u=>u.stopPropagation();return h`<div class="row rec ${r?"dim":""}" aria-current=${a?"true":"false"}>
      <button type="button" class="pick" role="option" aria-selected=${a?"true":"false"}
        @click=${()=>{this.togglePicker(!1),this.selectRecord(i)}}>
        ${this.renderRowArt(i)}
        <span class="pk-name">${o}</span>
        ${this.shapeDots(Yc(i))}
      </button>
      <span class="pk-acts">
        ${d?h`<button type="button" class="ghost danger small" ?disabled=${this.saving}
              @click=${u=>{c(u),a?this.deleteCurrent():this.deleteSaved(i.id,i.revision)}}>Really delete</button>
            <button type="button" class="ghost small" @click=${u=>{c(u),this.pickerConfirmDelete=void 0}}>Cancel</button>`:h`${l?h`<button type="button" class="icon" ?disabled=${!a&&this.saving}
              title=${r?"Hidden from the watch's complication list. Show it there again.":"Hide from the watch's complication list. Faces already using it keep it."}
              aria-label=${r?`Show ${o} in the watch's complication list`:`Hide ${o} from the watch's complication list`}
              @click=${u=>{c(u),this.setPickerHidden(i,!r)}}>${P(r?"hide":"show")}</button>`:m}
            ${s?h`<button type="button" class="icon danger" title="Delete this complication" aria-label=${`Delete ${o}`}
              ?disabled=${this.saving} @click=${u=>{c(u),this.pickerConfirmDelete=i.id}}>${P("delete")}</button>`:m}`}
      </span>
    </div>`}rowHidden(t){return t.id===this.selectedId&&this.draft?this.draft.config.hidden===!0:xp(t.document)}async setPickerHidden(t,i){if(this.ownerId){if(t.id===this.selectedId){this.mutate(a=>{i?a.hidden=!0:delete a.hidden});return}if(!(!this.hass.user?.is_admin||this.saving||!t.document)){this.saving=!0,this.saveError=void 0;try{let a=wp(t.document,i),r=await ld(this.hass,this.ownerId,a,t.revision);if(!r.ok){this.saveError=r.error==="conflict"?`${String(t.document.name??"That complication")} changed on the server. Try again.`:r.message??r.error??"Save failed";return}this.beginSendWait(),await this.loadRecords()}catch(a){this.saveError=Kt(a)}finally{this.saving=!1}}}}clearLegacyPickerHidden(){try{let t=window.localStorage,i=[];for(let a=0;a<t.length;a++){let r=t.key(a);r?.startsWith(l1)&&i.push(r)}for(let a of i)t.removeItem(a)}catch{}}toggleMenu(t,i=this.openMenu!==t){this.openMenu=i?t:this.openMenu===t?void 0:this.openMenu,this.openMenu!==void 0?window.addEventListener("pointerdown",this.menuOutside,{capture:!0}):window.removeEventListener("pointerdown",this.menuOutside,{capture:!0})}togglePicker(t=!this.pickerOpen){this.pickerOpen=t,t||(this.pickerNote=void 0,this.pickerConfirmDelete=void 0),t?window.addEventListener("pointerdown",this.pickerOutside,{capture:!0}):window.removeEventListener("pointerdown",this.pickerOutside,{capture:!0})}renderNewButton(){if(!this.hass.user?.is_admin)return m;let t=this.freeSlot()<0;return h`<div class="newc">
      <button class="new-btn primary" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.newOpen?"true":"false"}
        title=${t?`This ${this.deviceWord} has no free slot. Delete a complication first.`:"Make a new complication"}
        @click=${()=>this.openNewDialog()}>${P("plus")}<span>New</span></button>
      <button class="new-btn" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.importOpen?"true":"false"}
        title=${t?`This ${this.deviceWord} has no free slot. Delete a complication first.`:"Paste a complication somebody shared"}
        @click=${()=>this.openImportDialog()}><span>Import</span></button>
      ${t?h`<span class="newc-full">${this.deviceWord} is full</span>`:m}
    </div>`}takenNames(){let t=[...this.records.map(i=>String(i.document?.name??"")),...this.occupied.map(i=>"name"in i&&typeof i.name=="string"?i.name:"")];return new Set(t.map(i=>i.trim().toLowerCase()).filter(i=>i!==""))}newNameProblem(){let t=this.newName.trim();if(t!==""&&this.takenNames().has(t.toLowerCase()))return`A complication on this ${this.deviceWord} already has that name.`}renderNewDialog(){let t=this.newNameProblem(),i=this.newName.trim()!=="",a=i&&t===void 0&&this.newFamily!==void 0;return h`<dialog class="new-dialog" @keydown=${this.newKeys} @close=${()=>{this.newOpen=!1}}>
      <div class="new-head">
        <h2>New complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${()=>this.closeNewDialog()}>${P("close")}</button>
      </div>
      <div class="new-body">
        <div class="field">
          <span>Name</span>
          <input type="text" .value=${this.newName} placeholder="Kitchen at a glance" maxlength="60"
            aria-label="Complication name" aria-invalid=${t?"true":"false"}
            @input=${r=>{this.newName=r.target.value}} />
        </div>
        ${t?h`<div class="hint err">${t}</div>`:h`<div class="hint">${Ge(this.selectedOwner)==="iphone"?"This is the name the Lock Screen customise screen and the Home Screen widget picker show, so make it one you will recognise there.":"This is what the name shows on the watch face picker, so make it one you will recognise there."}</div>`}
        <div class="field new-shapes">
          <span>Shape</span>
          <div class="shape-groups" role="radiogroup" aria-label="Shape">
            ${xf(this.ownerFamilies,bf(this.selectedOwner)).map(r=>h`<div class="shape-group">
              ${r.label?h`<span class="shape-group-label">${r.label}</span>`:m}
              <div class="shape-cards">
                ${r.families.map(o=>h`<button type="button" role="radio" class="shape-card ${this.newFamily===o?"on":""}"
                  aria-checked=${this.newFamily===o?"true":"false"}
                  @click=${()=>{this.newFamily=o}}>
                  ${sy(o)}
                  <span class="shape-card-name">${te(o)}</span>
                  ${_n(o)?h`<span class="shape-card-note">${_n(o)}</span>`:m}
                </button>`)}
                ${(r.comingSoon??[]).map(o=>h`<button type="button" role="radio" class="shape-card soon" disabled
                  aria-checked="false" aria-disabled="true" title="Coming soon">
                  ${sy(o)}
                  <span class="shape-card-name">${te(o)}</span>
                  <span class="shape-card-note">Coming soon${_n(o)?h`<br />${_n(o)}`:m}</span>
                </button>`)}
              </div>
            </div>`)}
          </div>
        </div>
        <div class="hint">Start with one shape. More can be added under the preview later.</div>
      </div>
      <div class="new-foot">
        <button class="small" @click=${()=>this.closeNewDialog()}>Cancel</button>
        <button class="primary" ?disabled=${!a}
          title=${a?"Make it":i?t||"Pick a shape first":"Give it a name first"}
          @click=${()=>this.createNew()}>Create</button>
      </div>
    </dialog>`}openNewDialog(){this.freeSlot()<0||(this.newOpen=!0,this.newName="",this.newFamily=void 0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.new-dialog");t&&(t.open||t.showModal(),t.querySelector("input[type=text]")?.focus())}))}closeNewDialog(){let t=this.renderRoot.querySelector("dialog.new-dialog");t?.open?t.close():this.newOpen=!1}knownDomains(){let t=new Set;for(let i of Object.keys(this.hass.states)){let a=i.split(".")[0]??"";a!==""&&t.add(a)}return t}currentShareSlots(){let t=this.shareConfig();return t?_g(t,this.knownDomains()).map(i=>{let a=this.shareLabels.get(i.placeholderId);return a===void 0?i:{...i,label:a}}):[]}renderShareDialog(){let t=this.draft?.config,i=this.shareConfig();if(!t||!i)return m;let a=yt(t),r=this.sharePicked(),o=r.length>0,s=this.currentShareSlots(),l=this.shareMode==="share",d=l?la(Ns(i,this.shareNameOverrides()),"share",s):la(i,"backup"),c=this.shareLink?.text===d?this.shareLink:void 0,u=dn(i,this.buildContext(),this.forced),p=l&&o?this.publicNameRows(i,s,this.knownDomains(),this.shareNameOverrides(),{label:"Name",value:i.name.trim()||"Untitled"}):[],f=p.find(T=>T.key===this.shareFocus),g=f?.ids??[],b=this.dialogFamily(i),y=this.hass.user?.is_admin===!0,x=this.shareCopied,$=0,k=this.shareSection(++$,"s-who","Who is it for",h`
      <div class="seg wide xf-modes" role="group" aria-label="Who is it for">
        <button class=${l?"on":""} aria-pressed=${l?"true":"false"} @click=${()=>this.setShareMode("share")}>${P("globe")}<span>Share with others</span></button>
        <button class=${l?"":"on"} aria-pressed=${l?"false":"true"} @click=${()=>this.setShareMode("backup")}>${P("lock")}<span>Backup for me</span></button>
      </div>
      <div class="xf-lead ${l?"":"warn"}">${P(l?"info":"lock")}
        <span>${l?"Your entities are removed. The other person picks their own.":"Exact copy with your entities. Keep it for yourself or this home."}</span></div>`),C=r.length===a.length,M=a.length<2?m:this.shareSection(++$,"s-shapes","Pick the shapes",h`
      ${this.familyChips(a,T=>this.shareFamilies.has(T),T=>this.setShareFamilies(T),!1)}
      ${o?m:h`<div class="xf-lead">${P("info")}<span>Only the shapes you pick go in the copy. Pick at least one.</span></div>`}`,h`${r.length} of ${a.length}<button class="link" @click=${()=>this.setShareFamilies(new Set(C?[]:a))}>${C?"None":"All"}</button>`),D=l?this.shareSection(++$,"s-names","Public names",o?this.renderPublicRows(p,this.shareFocus,T=>this.pointAtRow(p,T,F=>{this.shareFocus=F})):h`<div class="hint">Pick a shape first.</div>`,m,!o):m,I=this.shareSection(++$,"s-send","Send it",h`
      <div class="xf-acts">
        <button class="xf-act" ?disabled=${!l||!y||!o} aria-haspopup="dialog"
          @click=${()=>this.openGalleryDialog()}>
          <span class="ic">${P("globe")}</span><b>Post to online gallery</b>
          <span>${l?y?"Everyone can find it, after review":"Needs a Home Assistant administrator":"Only shares can go"}</span>
        </button>
        <button class="xf-act ${x==="link"?"flash":""}" ?disabled=${!o} @click=${()=>{this.copyShareLink(d)}}>
          <span class="ic">${P(x==="link"?"check":"link")}</span><b>${x==="link"?"Link copied":"Copy link"}</b>
          <span>Opens in their own Home Assistant</span>
        </button>
        <button class="xf-act ${x==="file"?"flash":""}" ?disabled=${!o} title=${`Saves ${Lc(i)}`} @click=${()=>this.downloadShareText(d)}>
          <span class="ic">${P(x==="file"?"check":"download")}</span><b>${x==="file"?"Saved":"Download"}</b>
          <span>A .json file</span>
        </button>
      </div>
      ${c&&this.shareLinkShown?h`<input class="xfer-link" type="text" readonly aria-label="Share link" .value=${c.url}
        @focus=${T=>T.target.select()} />`:m}
      ${this.shareNote===""?m:h`<div class="hint xf-note" role="status">${this.shareNote}</div>`}
      <a class="xf-galink" href=${jc} target="_blank" rel="noopener">${P("globe")}<span>See the online gallery</span>${P("arrow")}</a>
      <details class="xf-raw" .open=${this.shareTextOpen}
        @toggle=${T=>{this.shareTextOpen=T.target.open}}>
        <summary>${P("right")}<span>Share text</span></summary>
        <textarea class="xfer-text" rows="10" readonly aria-label="The text to share" .value=${d}></textarea>
        <button class="link" @click=${()=>{this.copyShareText(d,"text")}}>${x==="text"?"Copied":"Copy text"}</button>
      </details>`,m,!o);return h`<dialog class="share-dialog xf ${this.galleryOpen?"under":""}" @close=${()=>{this.shareOpen=!1,this.pointAtRow([],void 0,()=>{})}}>
      ${this.dialogHead(`Share \u201C${i.name.trim()||"Untitled"}\u201D`,`${o?ny(r):"No shapes picked yet"} \xB7 ${iy(i)}`,()=>this.closeShareDialog())}
      <div class="xfer-body">
        ${this.dialogPreview(u,b,g,f&&g.length>0?h`Where <b>${f.name}</b> is`:b?te(b):"",p.some(T=>T.ids.length>0)?"Point at a name to see where it is":"")}
        ${k}${M}${D}${I}
      </div>
    </dialog>`}shareSection(t,i,a,r,o=m,s=!1){return h`<section class="xf-sec ${i} ${s?"locked":""}">
      <h3><i>${t}</i><span>${a}</span>${o===m?m:h`<span class="r">${o}</span>`}</h3>
      <div class="xf-sec-b" ?inert=${s}>${r}</div>
    </section>`}pointAtRow(t,i,a){a(i);let r=i===void 0?[]:t.find(o=>o.key===i)?.ids??[];this.listHoverIds=r,this.dialogLitIds=i?.startsWith("g:")?[i.slice(2),...r]:r,r.length!==0&&this.updateComplete.then(()=>{this.renderRoot.querySelector(".layer.lit")?.scrollIntoView({block:"nearest"})})}dialogHead(t,i,a,r=m){return h`<div class="xf-head">
      <div class="xf-t"><h2>${t}</h2>${i===""||i===m?m:h`<span>${i}</span>`}</div>
      ${r}
      <button class="icon" title="Close" aria-label="Close" @click=${a}>${P("close")}</button>
    </div>`}dialogFamily(t){return Yo(t)??(t.supportedFamilies.includes("inline")?"inline":void 0)}dialogPreview(t,i,a,r,o,s=!1){if(i===void 0)return m;let l=m,d=!1;if(i==="inline")l=this.renderInlinePreview(t.inline,!0),d=a.length>0;else{let c=t[i];if(c){let u=a.filter(p=>c.elements.some(f=>f.id===p));d=a.length>0&&u.length===0,l=xi(c,{icons:this.icons,imageSizes:this.imageSizes,slot:In(this.referenceCase,i),pictureScene:s,...u.length>0?{spotlightIds:u}:{}})}}return h`<div class="xf-prev-wrap">
      <div class="xf-prev ${i}">${l}</div>
      <div class="xf-prev-cap"><span>${r}${d?", on another shape":""}</span>${o===""?m:h`<span>${o}</span>`}</div>
    </div>`}layerTags(t,i,a,r){return a.length===0?m:h`<span class="xf-uses">${a.map(o=>{let s=t.elements.find(c=>c.payload.id===o);if(!s)return m;let l=de.find(c=>gt(t,c).some(u=>u.payload.id===o)),d=l?i[l]:void 0;return h`<span class="xf-use">
        <span class="xf-lt">${d?Nd(d,[o],{icons:this.icons,imageSizes:this.imageSizes,width:34,height:20}):m}</span>
        <span class="xf-ln">${Ae(s,r)}</span><em>${cn[s.kind]}</em>
      </span>`})}</span>`}leaveRows(t,i){let a=t.currentTarget,r=t instanceof FocusEvent?t.relatedTarget:a.getRootNode().activeElement;r instanceof Node&&a.contains(r)||i()}shareConfig(){let t=this.draft?.config;if(!t)return t;let i=this.sharePicked();return i.length===0||i.length===yt(t).length?t:Bd(t,i)}sharePicked(){let t=this.draft?.config;if(!t)return[];let i=yt(t);return i.length<2?i:i.filter(a=>this.shareFamilies.has(a))}shareNameOverrides(){let t=new Map,i=this.draft?.config;if(i&&this.shareLayerNames.size>0)for(let a of i.elements){let r=a.payload.name===void 0?void 0:this.shareLayerNames.get(a.payload.name.trim());r!==void 0&&t.set(a.payload.id,r)}return{name:this.shareName,groupNames:this.shareGroupNames,valueNames:this.shareValueNames,layerNames:t}}setShareFamilies(t){this.shareFamilies=t,this.pointAtRow([],void 0,i=>{this.shareFocus=i}),this.shareNote="",this.shareLinkShown=!1}familyChips(t,i,a,r){let o=t.filter(i).length;return h`<div class="gal-tags xf-shapes" role="group" aria-label="Shapes">${t.map(s=>{let l=i(s),d=r&&l&&o===1;return h`<button class="pk-chip ${l?"on":""}" aria-pressed=${l?"true":"false"} ?disabled=${d}
        title=${d?"At least one shape stays on":l?`Leave ${te(s)} out`:`Put ${te(s)} in`}
        @click=${()=>{let c=new Set(t.filter(i));l?c.delete(s):c.add(s),a(c)}}>${l?P("check"):m}${te(s)}</button>`})}</div>`}publicNameRows(t,i,a,r,o){let s=Kg(t,i,r),l=(p,f)=>a.has(f),d=(p,f,g,b,y)=>h`<input type="text" maxlength=${y??m} aria-label=${`${p}: ${f}`}
          .value=${g??f} placeholder=${f} ?disabled=${this.gallerySending}
          @input=${x=>b(x.target.value)} />`,c=[{key:"head",label:o.label,name:o.value,ids:[],control:d(o.label,t.name.trim(),this.shareName===""?void 0:this.shareName,p=>{this.shareName=p})}],u=(p,f,g)=>d(f,p.original,g??(p.value===p.original?void 0:p.value),b=>this.setPublicName(p,b),p.kind==="slot"?40:void 0);for(let p of s){if(p.rows){for(let f of p.rows)if(f.kind==="group")c.push({key:`g:${f.id}`,label:"Group name",name:f.value,ids:mt(t,f.id).map(g=>g.payload.id),control:u(f,"Group name",this.shareGroupNames.get(f.id))});else if(f.kind==="shared")c.push({key:`v:${f.id}`,label:"Shared value name",name:f.value,ids:Np(t,f.id),control:u(f,"Shared value name",this.shareValueNames.get(f.id))});else{let g=i.find(b=>b.placeholderId===f.id);c.push({key:`e:${f.id}`,label:"Entity name",name:f.value,ids:g?ad(t,g.originalId,l):[],control:u(f,"Entity name",void 0)})}continue}if(p.label==="Layer names"){let f=[];for(let g of t.elements){let b=g.payload.name?.trim();b&&!xe(t,g)&&!f.includes(b)&&f.push(b)}for(let g of f){let b=t.elements.filter(y=>!xe(t,y)&&y.payload.name?.trim()===g).map(y=>y.payload.id);c.push({key:`l:${g}`,label:"Layer name",name:g,ids:b,control:d("Layer name",g,this.shareLayerNames.get(g),y=>this.setShareLayerName(g,y))})}continue}p.values.forEach((f,g)=>{c.push({key:`t:${p.label}:${g}`,label:u1[p.label]??p.label,name:f,ids:[],control:h`<div class="xf-pill mono">${f}</div>`})})}return c}renderPublicRows(t,i,a){let r=()=>a(void 0);return h`
      <div class="xf-lead">${P("info")}<span>Others can see these names. Change the names of layers and groups here before you share, if you want.</span></div>
      <div class="xf-pub" @pointerleave=${o=>this.leaveRows(o,r)} @focusout=${o=>this.leaveRows(o,r)}>
        ${t.map(o=>{let s=o.key===i&&o.ids.length>0,l=()=>a(o.key);return h`<div class="kv ${s?"on":""}" @pointerenter=${l} @focusin=${l}>
            <span class="k">${o.label}</span>
            <div class="v">${o.control}</div>
          </div>`})}
      </div>
      <div class="hint">Your own complication keeps its names. An empty box keeps the name it had.</div>`}setShareMode(t){this.shareMode=t,this.shareNote="",this.pointAtRow([],void 0,i=>{this.shareFocus=i}),this.shareCopied=void 0,this.shareLinkShown=!1}setShareLabel(t,i){let a=new Map(this.shareLabels);a.set(t,i),this.shareLabels=a}openShareDialog(){this.draft&&(this.shareOpen=!0,this.shareMode="share",this.shareLabels=new Map,this.shareFamilies=new Set,this.shareGroupNames=new Map,this.shareValueNames=new Map,this.shareName="",this.shareLayerNames=new Map,this.shareNote="",this.shareTextOpen=!1,this.shareLink=void 0,this.shareLinkShown=!1,this.shareCopied=void 0,this.shareFocus=void 0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.share-dialog");t&&!t.open&&t.showModal()}))}closeShareDialog(){let t=this.renderRoot.querySelector("dialog.share-dialog");t?.open?t.close():this.shareOpen=!1}galleryMeta(){return{title:this.galleryTitle,description:this.galleryDescription,authorName:this.galleryNickname,tags:[...this.galleryTags],panelVersion:this.panel?.config?.version??""}}openGalleryDialog(){let t=this.shareConfig();!t||!this.hass.user?.is_admin||this.sharePicked().length===0||(this.pointAtRow([],void 0,i=>{this.shareFocus=i}),this.galleryOpen=!0,this.galleryTitle=(this.shareName.trim()||t.name.trim()).slice(0,fe.title),this.galleryDescription="",this.galleryTags=new Set,this.galleryNickname=d1(),this.gallerySending=!1,this.gallerySent=!1,this.galleryError="",this.galleryPreviews=void 0,this.galleryPreviewNote="",this.galleryConfirmDelete=void 0,this.galleryTab="new",this.galleryStep=1,this.galleryReplaces=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.gallery-dialog");i&&!i.open&&i.showModal()}),this.makeGalleryPreviews(t,this.currentShareSlots()),this.loadGalleryUploads())}galleryOverrides(){return{...this.shareNameOverrides(),name:this.galleryTitle}}setShareLayerName(t,i){let a=new Map(this.shareLayerNames);a.set(t,i),this.shareLayerNames=a}setPublicName(t,i){if(t.kind==="slot"){if(this.setShareLabel(t.id,i),!this.galleryOpen)return;window.clearTimeout(this.galleryRedrawTimer),this.galleryRedrawTimer=window.setTimeout(()=>{let r=this.shareConfig();!r||!this.galleryOpen||this.gallerySent||(this.galleryPreviews=void 0,this.galleryPreviewNote="",this.makeGalleryPreviews(r,this.currentShareSlots()))},500);return}let a=new Map(t.kind==="group"?this.shareGroupNames:this.shareValueNames);a.set(t.id,i),t.kind==="group"?this.shareGroupNames=a:this.shareValueNames=a}closeGalleryDialog(){let t=this.renderRoot.querySelector("dialog.gallery-dialog");t?.open?t.close():this.galleryOpen=!1}async makeGalleryPreviews(t,i){let a=++this.galleryPreviewRun;try{let r=await ty(t,i,{entityState:o=>this.entityStateFor(o,"",!1),templateResults:this.templateResults,historySeries:this.historySeries},this.icons);if(a!==this.galleryPreviewRun)return;this.galleryPreviews=r}catch{if(a!==this.galleryPreviewRun)return;this.galleryPreviews=[],this.galleryPreviewNote="The preview pictures could not be made. It can still be sent without them."}}async ensureGalleryKey(){return this.galleryKey===void 0&&(this.galleryKey=(await zp(this.hass)).key),this.galleryKey}async loadGalleryUploads(){this.galleryUploadsError="";try{let t=await this.ensureGalleryKey();this.galleryUploads=await Jg(Kc,t)}catch(t){this.galleryUploads=[],this.galleryUploadsError=t instanceof Wt?Ds(t):"Could not read this Home Assistant's gallery key."}}async sendToGallery(){let t=this.shareConfig();if(!t||this.gallerySending||this.gallerySent||this.galleryPreviews===void 0)return;let i=this.currentShareSlots(),a=this.galleryMeta(),r=this.galleryOverrides();if(!(jg(t,i,a,this.knownDomains(),r).length>0)){this.gallerySending=!0,this.galleryError="";try{let o=await this.ensureGalleryKey();await Xg(Kc,o,{...Bc(t,i,a,r),previews:this.galleryPreviews,...this.galleryReplaces?{replaces:this.galleryReplaces.id}:{}}),this.gallerySent=!0,c1(a.authorName.trim()),this.loadGalleryUploads()}catch(o){this.galleryError=o instanceof Wt?Ds(o):"Could not read this Home Assistant's gallery key. Try again."}finally{this.gallerySending=!1}}}async deleteGalleryUpload(t){if(this.galleryConfirmDelete!==t){this.galleryConfirmDelete=t;return}this.galleryDeleting=t,this.galleryUploadsError="";try{let i=await this.ensureGalleryKey();await Qg(Kc,i,t),this.galleryUploads=this.galleryUploads?.filter(a=>a.id!==t),this.loadGalleryUploads()}catch(i){this.galleryUploadsError=i instanceof Wt?Ds(i):"Could not delete it. Try again."}finally{this.galleryDeleting=void 0,this.galleryConfirmDelete=void 0}}toggleGalleryTag(t){let i=new Set(this.galleryTags);i.has(t)?i.delete(t):i.size<fe.tags&&i.add(t),this.galleryTags=i}renderGalleryDialog(){let t=this.shareConfig();if(!t)return m;let i=this.galleryUploads?Zg(this.galleryUploads):void 0,a=this.galleryTab,r=h`<div class="seg xf-tabs" role="group" aria-label="Gallery view">
      <button class=${a==="new"?"on":""} aria-pressed=${a==="new"?"true":"false"} @click=${()=>this.setGalleryTab("new")}>New</button>
      <button class=${a==="mine"?"on":""} aria-pressed=${a==="mine"?"true":"false"} @click=${()=>this.setGalleryTab("mine")}>My uploads<span class="xf-count">${i===void 0?"\u2026":i.length}</span></button>
    </div>`;return h`<dialog class="gallery-dialog xf" @close=${()=>{this.galleryOpen=!1,this.pointAtRow([],void 0,()=>{})}}>
      ${this.dialogHead("Post to online gallery",h`<a class="xf-galink" href=${jc} target="_blank" rel="noopener">wrist-assistant.com/gallery</a>`,()=>this.closeGalleryDialog(),r)}
      ${a==="mine"?this.renderGalleryUploads(i):this.gallerySent?this.renderGallerySent():this.renderGallerySteps(t)}
    </dialog>`}setGalleryTab(t){t==="new"&&(this.gallerySent&&(this.gallerySent=!1,this.galleryStep=1,this.galleryError=""),this.galleryTab==="new"&&(this.galleryReplaces=void 0)),this.galleryTab=t,this.galleryConfirmDelete=void 0}goGalleryStep(t){this.galleryStep=t}startGalleryUpdate(t){this.galleryReplaces={id:t.id,title:t.title},this.galleryTitle=t.title.slice(0,fe.title),this.galleryTab="new",this.galleryStep=1,this.gallerySent=!1,this.galleryError="",this.galleryConfirmDelete=void 0}renderGallerySent(){return h`<div class="xfer-body"><div class="xf-done">
      <span class="big">${P("check")}</span>
      <b>Sent for review</b>
      <p>${this.galleryReplaces?"The new version goes up after it is approved. Until then the old one stays.":"It shows in the gallery after it is approved. Check My uploads for its status."}</p>
      <div class="btns">
        <button class="small" @click=${()=>this.setGalleryTab("mine")}>My uploads</button>
        <button class="primary" @click=${()=>this.closeGalleryDialog()}>Done</button>
      </div>
    </div></div>`}renderGallerySteps(t){let i=this.currentShareSlots(),a=this.galleryOverrides(),r=this.knownDomains(),o=qg(t,i,this.galleryMeta(),r,a),s=this.galleryStep,l=o.details.length===0,d=[...o.details,...o.send],c=d.length===0&&this.galleryPreviews!==void 0&&!this.gallerySending,u=d.length>0?d[0]:this.galleryPreviews===void 0?"Drawing the preview pictures":"Send it for review",f=h`<nav class="xf-steps" aria-label="Steps">${["Details","Send"].map((b,y)=>{let x=y+1;return h`<button class="xf-step ${x<s?"past":""}" aria-current=${x===s?"step":m}
        ?disabled=${x>1&&!l} @click=${()=>this.goGalleryStep(x)}>
        <i>${x<s?P("check"):x}</i>${b}</button>`})}</nav>`,g=s===1?this.renderGalleryDetails(o.details):this.renderGallerySend(t,i,d);return h`${f}
      <div class="xfer-body">
        ${this.galleryReplaces?h`<div class="xf-banner">${P("info")}<span>New version of <b>${this.galleryReplaces.title}</b>. The link and votes stay. The old version stays up until this one is approved.</span></div>`:m}
        ${g}
      </div>
      <div class="xfer-foot">
        ${s===1?h`<button class="ghost" @click=${()=>this.closeGalleryDialog()}>Back to Share</button>`:h`<button class="ghost" @click=${()=>this.goGalleryStep(1)}>Back</button>`}
        <span class="spacer"></span>
        ${s===1?h`<button class="primary" ?disabled=${!l} title=${l?"Next step":o.details[0]}
              @click=${()=>this.goGalleryStep(2)}>Next${P("arrow")}</button>`:h`<button class="primary" ?disabled=${!c} title=${u}
              @click=${()=>{this.sendToGallery()}}>${this.gallerySending?"Sending\u2026":"Send for review"}</button>`}
      </div>`}renderGalleryDetails(t){let i=this.galleryTags;return h`<div class="xf-two">
      <div class="xf-stack xf-form">
        <label class="xf-f"><span class="xf-label">Title</span>
          <input type="text" maxlength=${fe.title} .value=${this.galleryTitle}
            @input=${a=>{this.galleryTitle=a.target.value}} /></label>
        <label class="xf-f"><span class="xf-label">Description <span class="r">Optional</span></span>
          <textarea rows="2" maxlength=${fe.description} .value=${this.galleryDescription}
            @input=${a=>{this.galleryDescription=a.target.value}}></textarea></label>
        <div class="xf-f"><span class="xf-label">Tags <span class="r">${i.size} of ${fe.tags}</span></span>
          <div class="gal-tags">
            ${Oc.map(a=>{let r=i.has(a);return h`<button class="pk-chip ${r?"on":""}" aria-pressed=${r?"true":"false"}
                ?disabled=${!r&&i.size>=fe.tags}
                @click=${()=>this.toggleGalleryTag(a)}>${Gc[a]}</button>`})}
          </div></div>
        <label class="xf-f"><span class="xf-label">Your name <span class="r">Optional</span></span>
          <input type="text" maxlength=${fe.authorName} .value=${this.galleryNickname}
            @input=${a=>{this.galleryNickname=a.target.value}} /></label>
        ${t.length>0?h`<ul class="xf-blockers" role="alert">${t.map(a=>h`<li>${a}</li>`)}</ul>`:m}
      </div>
      <div>${this.galleryCard()}<div class="xf-caption">How it looks in the gallery</div></div>
    </div>`}galleryCard(){let t=this.galleryPreviews,i=this.galleryNickname.trim();return h`<div class="xf-gcard">
      <div class="img">${t===void 0?h`<span class="hint">Drawing…</span>`:t[0]?h`<img alt="Gallery picture" src=${`data:image/png;base64,${t[0].png}`} />`:h`<span class="hint">${this.galleryPreviewNote||"No picture for this shape"}</span>`}</div>
      <div class="meta">
        <b>${this.galleryTitle.trim()||"Untitled"}</b>
        <span>${i?`by ${i}`:"No name"}</span>
        ${this.galleryTags.size>0?h`<span class="tg">${[...this.galleryTags].map(a=>h`<em>${Gc[a]}</em>`)}</span>`:m}
      </div>
    </div>`}renderGallerySend(t,i,a){let r=this.galleryTags.size,o=t.elements.some(s=>s.kind==="image");return h`<div class="xf-two">
      <div class="xf-stack xf-form">
        <div class="xf-checks">
          <div>${P("check")}<span>${r===0?"Title, no tags":`Title and ${r===1?"1 tag":`${r} tags`}`}</span></div>
          <div>${P("check")}<span>${i.length>0?"Your entities are removed":"It reads none of your entities"}</span></div>
          <div>${P("check")}<span>${o?"Pictures show as a stand-in, never your photo":"The preview shows your current values"}</span></div>
        </div>
        ${a.length>0?h`<ul class="xf-blockers" role="alert">${a.map(s=>h`<li>${s}</li>`)}</ul>`:m}
        ${this.galleryError!==""?h`<div class="xf-blockers" role="alert">${this.galleryError}</div>`:m}
      </div>
      <div>${this.galleryCard()}</div>
    </div>`}renderGalleryUploads(t){return h`<div class="xfer-body">
      ${this.galleryUploadsError!==""?h`<div class="xf-blockers" role="alert">${this.galleryUploadsError}</div>`:m}
      ${t===void 0?h`<div class="hint">Loading…</div>`:t.length===0?this.galleryUploadsError===""?h`<div class="xf-lead">${P("info")}<span>Nothing sent from this Home Assistant yet.</span></div>`:m:h`<div class="xf-rows">${t.map(i=>this.renderUploadRow(i))}</div>`}
      <div class="xf-lead">${P("info")}<span><b>Update</b> sends this complication as a new version. The link and votes stay. <b>Delete</b> removes it for everyone.</span></div>
    </div>`}renderUploadRow(t){let i=t.upload;return h`<div class="xf-up">
      <span class="xf-up-thumb">${i.previewUrl?h`<img src=${i.previewUrl} alt="" loading="lazy" />`:m}</span>
      <div class="xf-main">
        <div class="xf-up-t"><b>${i.title}</b>${this.uploadStatus(i)}</div>
        <div class="sub">${Wc(i)}</div>
      </div>
      <div class="xf-up-acts">
        ${t.canUpdate?h`<button class="small" title="Send this complication as a new version of it"
          @click=${()=>this.startGalleryUpdate(i)}>Update</button>`:m}
        ${this.uploadDelete(i,!1)}
      </div>
      ${t.updates.map(a=>h`<div class="xf-up-v">
        <div class="xf-main">
          <div class="xf-up-t">${this.uploadStatus(a)}</div>
          <div class="sub">${Wc(a)}</div>
        </div>
        <div class="xf-up-acts">${this.uploadDelete(a,!0)}</div>
      </div>`)}
    </div>`}uploadStatus(t){return h`<span class="gal-status ${Fr(t)?"pending":t.status}">${ey(t)}</span>`}uploadDelete(t,i){let a=this.galleryDeleting!==void 0;if(this.galleryConfirmDelete===t.id||this.galleryDeleting===t.id){let r=this.galleryDeleting===t.id;return h`${r?m:h`<button class="small" @click=${()=>{this.galleryConfirmDelete=void 0}}>Keep</button>`}
        <button class="small danger" ?disabled=${a}
          title=${i?"Withdraws this new version. The one in the gallery stays.":"Removes it from the gallery for everyone"}
          @click=${()=>{this.deleteGalleryUpload(t.id)}}>${r?"Deleting\u2026":i?"Withdraw it":"Delete for good"}</button>`}return h`<button class="icon danger" ?disabled=${a}
      title=${i?"Withdraw this new version":"Delete it from the gallery"}
      aria-label=${i?`Withdraw the new version of ${t.title}`:`Delete ${t.title}`}
      @click=${()=>{this.deleteGalleryUpload(t.id)}}>${P("delete")}</button>`}async copyShareText(t,i){this.shareNote="";try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(t),this.flashShare(i);return}}catch{}i==="text"?this.shareTextOpen=!0:this.shareLinkShown=!0,await this.updateComplete;let a=this.renderRoot.querySelector(i==="text"?"dialog.share-dialog textarea.xfer-text":"dialog.share-dialog input.xfer-link");a?.focus(),a?.select();let r=!1;try{r=document.execCommand("copy")}catch{r=!1}r?this.flashShare(i):this.shareNote="Press Cmd+C or Ctrl+C to copy."}flashShare(t){this.shareCopied=t,window.clearTimeout(this.shareCopiedTimer),this.shareCopiedTimer=window.setTimeout(()=>{this.shareCopied=void 0},1600)}async copyShareLink(t){let i=await Og(t),a=Bg(Gg,i);this.shareLink={text:t,url:a},await this.copyShareText(a,"link")}downloadShareText(t){let i=this.draft?.config;if(!i)return;let a=Lc(i),r=URL.createObjectURL(new Blob([t],{type:"application/json"})),o=document.createElement("a");o.href=r,o.download=a,o.click(),window.setTimeout(()=>URL.revokeObjectURL(r),0),this.shareNote="",this.flashShare("file")}importConfig(){let t=this.importParse;if(!t?.ok)return;let i=Od(t.config,this.ownerFamilies),a=this.importFamilies===void 0?i:i.filter(r=>this.importFamilies.has(r));return a.length===yt(t.config).length?t.config:Bd(t.config,a)}setImportFamilies(t){this.importFamilies=t,this.importFocus=void 0,this.scheduleImportHistory()}renderImportDialog(){let t=this.importConfig();return h`<dialog class="import-dialog xf ${this.importDrop?"dropping":""}" @keydown=${this.importKeys} @close=${()=>this.importClosed()}
      @dragenter=${this.importDragEnter} @dragover=${this.importDragOver} @dragleave=${this.importDragLeave} @drop=${this.importDropped}
      @paste=${this.importPasted}>
      ${this.dialogHead("Import","",()=>this.closeImportDialog())}
      ${t?this.renderImportLoaded(t):this.renderImportEmpty()}
      ${t&&this.importDrop?h`<div class="xfer-drop" aria-hidden="true"><span>Drop to read the file</span></div>`:m}
    </dialog>`}renderImportEmpty(){let t=this.importParse,i=this.importTextShown||this.importText.trim()!=="";return h`<div class="xfer-body">
      <div class="xf-drop ${this.importDrop?"over":""}">
        <span class="big">${P("paste")}</span>
        <b>Paste a share link</b>
        <p>Press <kbd>${da==="Cmd"?"\u2318":"Ctrl"}</kbd> <kbd>V</kbd> anywhere here, or drop a file.</p>
        <div class="btns">
          <button class="primary xf-paste" @click=${()=>{this.pasteImport()}}>Paste</button>
          <button class="small"
            @click=${a=>a.currentTarget.parentElement?.querySelector("input[type=file]")?.click()}>Choose a file</button>
          <input type="file" hidden accept=".json,application/json,text/plain" @change=${a=>{this.readImportFile(a)}} />
        </div>
      </div>
      ${t&&!t.ok?h`<div class="hint err xfer-problem" role="alert">${t.error}</div>`:m}
      ${i?h`<textarea class="xfer-text xf-typed" rows="6" placeholder="Paste or type the shared text or a share link"
            aria-label="Shared complication text or link" .value=${this.importText}
            @input=${a=>this.setImportText(a.target.value)}></textarea>`:h`<button class="link xf-type" @click=${()=>{this.revealImportText()}}>Type the text instead</button>`}
      <a class="xf-galtile" href=${jc} target="_blank" rel="noopener">
        <span class="ic">${P("globe")}</span>
        <span class="t"><b>Browse the online gallery</b><span>Ready-made complications from other people</span></span>
        ${P("arrow")}
      </a>
    </div>
    <div class="xfer-foot">
      <span class="spacer"></span>
      <button class="small" @click=${()=>this.closeImportDialog()}>Cancel</button>
    </div>`}renderImportLoaded(t){let i=Ic(t,this.hass.states),a=this.knownDomains(),r=this.importParse,o=Od(r?.ok?r.config:t,this.ownerFamilies),s=this.importPreview(),l=s?this.configLayouts(s.config,s.entities,this.importHistory):{},d=new Map(i.map(k=>[k.entityId,ad(t,k.entityId,(C,M)=>Mi(C)||a.has(M))])),c=i.filter(k=>k.required),u=c.filter(k=>this.importMap.has(k.entityId)).length,p=i.find(k=>k.entityId===this.importFocus),f=this.dialogFamily(t),g=this.importName.trim(),b=this.takenNames(),y=g!==""&&b.has(g.toLowerCase()),x=zc({parsed:!0,name:this.importName,taken:b,unchosen:0}),$=()=>{this.importFocus=void 0};return h`<div class="xfer-body">
      <div class="xf-hero">
        ${this.dialogPreview(l,f,p?d.get(p.entityId)??[]:[],p?h`Uses <b>${p.label}</b>`:f?te(f):"","")}
        <div class="xf-stack">
          <label class="xf-f"><span class="xf-label">Name</span>
            <input type="text" maxlength="60" aria-invalid=${y?"true":"false"} .value=${this.importName}
              @input=${k=>{this.importName=k.target.value}} /></label>
          ${y?h`<div class="hint err">A complication on this ${this.deviceWord} already has that name.</div>`:m}
          ${o.length<2?m:h`<div class="xf-f"><span class="xf-label">Shapes to import<span class="r">${yt(t).length} of ${o.length}</span></span>
            ${this.familyChips(o,k=>this.importFamilies===void 0||this.importFamilies.has(k),k=>this.setImportFamilies(k),!0)}</div>`}
          <div class="xf-sub">${o.length<2?`${ny(o)} \xB7 `:""}${iy(t)}</div>
        </div>
      </div>
      ${i.length===0?h`<div class="xf-lead">${P("check")}<span>Every entity this design reads is already in your Home Assistant.</span></div>`:h`<div class="xf-stack">
          <div class="xf-label">Pick your entities${c.length>0?h`<span class="r">${u} of ${c.length}</span>`:m}</div>
          ${c.length>0?h`<div class="xf-bar" role="progressbar" aria-valuemin="0" aria-valuemax=${c.length} aria-valuenow=${u}>
            <i style=${`width:${u/c.length*100}%`}></i></div>`:m}
          <div class="xf-rows" @pointerleave=${k=>this.leaveRows(k,$)} @focusout=${k=>this.leaveRows(k,$)}>
            ${i.map(k=>this.renderImportRow(k,t,l,d.get(k.entityId)??[]))}
          </div>
          ${u<c.length?h`<div class="xf-lead">${P("info")}<span>You can import now and pick the rest later.</span></div>`:m}
        </div>`}
      ${_s(t)?h`<div class="xf-lead warn">${P("info")}<span>This design filters by areas, labels or floors from the sender's home. Check its aggregate layers after import.</span></div>`:m}
    </div>
    <div class="xfer-foot">
      <button class="ghost" @click=${()=>this.startImportOver()}>Start over</button>
      <span class="spacer"></span>
      <button class="primary" ?disabled=${x!==void 0}
        title=${x??"Save it to this watch and open it in the editor"} @click=${()=>{this.doImport()}}>Import and save</button>
    </div>`}dragReadable(t){let i=t.dataTransfer?[...t.dataTransfer.types]:[];return i.includes("Files")||i.includes("text/plain")}renderImportRow(t,i,a,r){let o=this.importMap.get(t.entityId),s=()=>{this.importFocus=t.entityId};return h`<div class="xf-row pick ${this.importFocus===t.entityId?"on":""}" @pointerenter=${s} @focusin=${s}>
      <span class="ent-ico xf-dom">${dr(t.domain)}</span>
      <div class="xf-main">
        <div class="xf-name">${t.label}${o?h`<span class="xf-done" title="Picked">${P("check")}</span>`:m}</div>
        ${r.length>0?this.layerTags(i,a,r):h`<div class="xf-sub">${t.where.join(", ")}</div>`}
        ${t.required?m:h`<div class="xf-sub">Not in your Home Assistant right now. Leave it empty to keep the id.</div>`}
        <div class="xf-picker">${Ut({hass:this.hass},t.label,o??m1,l=>this.setImportEntity(t.entityId,l),ry(t.entityId),{compact:!0,domain:t.domain,needed:t.required&&o===void 0})}</div>
      </div>
    </div>`}async pasteImport(){let t="";try{t=await navigator.clipboard.readText()}catch{t=""}if(t.trim()===""){await this.revealImportText();return}this.setImportText(t)}async revealImportText(){this.importTextShown=!0,await this.updateComplete,this.renderRoot.querySelector("dialog.import-dialog textarea.xf-typed")?.focus()}setImportEntity(t,i){let a=new Map(this.importMap);i.entityId===""?a.delete(t):a.set(t,Rs(this.hass.states,i.entityId)),this.importMap=a,this.scheduleImportHistory()}importPreview(){let t=this.importParse;if(!t?.ok)return;let i=this.importPreviewCache;if(i&&i.parse===t&&i.map===this.importMap&&i.families===this.importFamilies)return i;let a=_c(this.importConfig()??t.config,this.importMap),r;try{r=[...qa(a).entities.values()]}catch{r=[]}return this.importPreviewCache={parse:t,map:this.importMap,families:this.importFamilies,config:a,entities:r},this.importPreviewCache}setImportText(t){this.importText=t;let i=Vg(t);if(i!==void 0){this.importParse=void 0,this.importMap=new Map,this.importFamilies=void 0,this.importName="",Nc(i).then(o=>{this.importText===t&&(o===void 0?this.importParse={ok:!1,error:Pc}:this.setImportText(o))});return}let a=this.importParse?.ok?JSON.stringify(this.importParse.config):void 0,r=t.trim()===""?void 0:Ng(t,this.maxSchemaVersion);if(this.importParse=r,this.scheduleImportHistory(),!r?.ok){this.importMap=new Map,this.importFamilies=void 0,this.importName="";return}JSON.stringify(r.config)!==a&&(this.importMap=new Map,this.importFamilies=void 0,this.importName=Dg(r.config.name,this.takenNames()))}async readImportFile(t){let i=t.target,a=i.files?.[0];a&&(await this.readImportBlob(a),i.value="")}async readImportBlob(t){try{this.setImportText(await t.text())}catch(i){this.importParse={ok:!1,error:`That file could not be read: ${Kt(i)}`}}}async openPendingLink(){let t=this.pendingLink;if(t===void 0)return;if(this.pendingLink=void 0,!this.hass.user?.is_admin){this.linkNote="This link holds a shared complication. Only a Home Assistant administrator can import it.";return}let i=await Nc(t);if(i===void 0){this.linkNote=Pc;return}if(!this.ownerId){this.linkNote="This link holds a shared complication, but no watch has connected to this Home Assistant yet.";return}if(this.freeSlot()<0){this.linkNote="This link holds a shared complication, but this watch has no free slot. Delete a complication, then open the link again.";return}this.linkNote=void 0,this.openImportDialog(),this.setImportText(i)}async doImport(){let t=this.importConfig();if(!t)return;let i=_c(t,this.importMap);i.id=ie(),i.name=this.importName.trim(),i.slotIndex=this.freeSlot(),i.dataSources=[],i.schemaVersion=ni(i),this.startNew(i)&&(this.draft?.markDirty(),this.closeImportDialog(),await this.save())}openImportDialog(){!this.hass.user?.is_admin||this.freeSlot()<0||(this.importOpen=!0,this.resetImportState(),this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.import-dialog");t&&(t.open||t.showModal(),t.querySelector("button.xf-paste")?.focus())}))}resetImportState(){this.importText="",this.importParse=void 0,this.importName="",this.importMap=new Map,this.importFamilies=void 0,this.importTextShown=!1,this.importFocus=void 0,this.importHistory=new Map,this.importHistoryAsked=void 0,this.importPreviewCache=void 0,this.importDrop=!1,this.importDragDepth=0,this.importHistoryTimer&&window.clearTimeout(this.importHistoryTimer),this.importHistoryTimer=void 0,this.importHistoryRun+=1}startImportOver(){this.resetImportState(),this.updateComplete.then(()=>{this.renderRoot.querySelector("dialog.import-dialog button.xf-paste")?.focus()})}closeImportDialog(){let t=this.renderRoot.querySelector("dialog.import-dialog");t?.open?t.close():this.importClosed()}importClosed(){this.importOpen=!1,this.importHistoryTimer&&window.clearTimeout(this.importHistoryTimer),this.importHistoryTimer=void 0,this.importHistoryRun+=1}renderBanners(){let t=[],i=this.renderOrphanBanner();if(i&&t.push(i),this.readOnlyReason?t.push(h`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&t.push(h`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let a=this.conflict;t.push(h`<div class="banner err"><b>Save rejected.</b> ${a.message}
        ${a.current?h` The server has revision ${a.current.revision}, saved ${a.current.updatedAt} by ${a.current.updatedBy||"unknown"}.`:" The server no longer has this complication."}
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version (lose my draft)</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
          <button class="small" @click=${()=>{this.conflict=void 0}}>Keep editing</button>
        </div></div>`)}else this.remoteRevision!==void 0&&t.push(h`<div class="banner warn">${this.remoteRevision===-1?"This complication was deleted on the server while you were editing.":`Revision ${this.remoteRevision} was saved on the server while you were editing.`} Saving now will be rejected.
        <div class="acts">
          <button class="small" @click=${()=>this.reloadFromServer()}>Reload the server version</button>
          <button class="small" @click=${()=>{this.save(!0)}}>Save my draft as a new complication</button>
        </div></div>`);return this.saveError&&t.push(h`<div class="banner err"><b>Could not save.</b> ${this.saveError}</div>`),t}renderOrphanBanner(){let t=this.selectedOwner;if(!t?.is_orphan)return;let i=this.owners.filter(a=>!a.is_orphan);return h`<div class="banner warn">
      <b>This watch is no longer registered.</b> Reinstalling the watch app gives the watch a new id, and these
      ${t.complication_count} complication${t.complication_count===1?"":"s"} stayed behind under the old one.
      ${this.hass.user?.is_admin?i.length===0?h`<div class="hint">No registered watch to move them to. Open Wrist Assistant on the watch first.</div>`:h`<div class="acts">
              <select @change=${a=>{this.moveTarget=a.target.value||void 0}}>
                <option value="" ?selected=${!this.moveTarget}>Move all to…</option>
                ${i.map(a=>h`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${gy(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:h`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?h`<div class="err">${this.moveError}</div>`:m}
    </div>`}renderAddLayer(){let t=this.draft?.config;if(!t||!this.canEdit)return m;if(!qe(this.activeFamily))return m;let i=t.elements.length>=64,a=this.addOpen,r=this.addDetail==="expanded",o=()=>{this.addOpen=!this.addOpen,this.saveListView()};return h`<div class="card fold" data-open=${a?"true":"false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"}
        title=${a?"Hide the add buttons":"Show the add buttons"}
        @click=${o}
        @keydown=${s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),o())}}>
        <span class="swatch">${P("plus")}</span>Add a layer<span class="spacer"></span>
        ${a?m:h`<span class="mini">${Vd.length} kinds · ${ar.length} presets</span>`}
        ${a?h`<span class="tool-set" @click=${s=>s.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${[["compact","Names"],["expanded","Samples"]].map(([s,l])=>h`
                  <button class=${this.addDetail===s?"on":""} title=${l} aria-label=${l} aria-pressed=${this.addDetail===s?"true":"false"}
                    @click=${()=>{this.addDetail=s,this.saveListView()}}>${P(s)}</button>`)}
              </span>
            </span>`:m}
        <span class="chev">${P("chevron")}</span>
      </h2>
      ${a?h`
          <div class="add-grid ${r?"":"lean"}">
            ${Vd.map(s=>h`<button class="add" style=${`--k:${it[s]}`} ?disabled=${i} title=${`Add a blank ${cn[s].toLowerCase()} layer`}
              @click=${()=>{let l=Le(s);this.addHere(d=>{d.elements.push(l),l.kind==="timeline"&&di(d,l.payload.id)}),this.inspect={kind:"layer",id:l.payload.id}}}
              >${r?h`<span class="well">${Bf(s)}</span>`:m}<span class="add-name">${r?P(s):h`<span class="k"></span>`}<span>${cn[s]}</span></span></button>`)}
          </div>
          <div class="presets">
            <span class="presets-l">Presets</span>
            ${ar.map(s=>h`<button class="preset" title=${s.blurb}
              ?disabled=${t.elements.length+s.layerCount>64}
              @click=${()=>this.openPreset(s.kind)}>${s.title}</button>`)}
          </div>`:m}
      ${this.renderPresetDialog()}
    </div>`}isGroupId(t){return this.draft?.config.groups?.some(i=>i.id===t)===!0}reorderLayer(t,i,a,r=!1){t!==i&&this.mutate(o=>{let s=o.elements.filter(g=>!xe(o,g)),l=o.elements.filter(g=>xe(o,g)),d=[...s].reverse(),c=d.find(g=>g.payload.id===i);if(!c)return;let u=o.groups?.find(g=>g.id===t),p=u?d.filter(g=>g.payload.groupId===u.id):d.filter(g=>g.payload.id===t);if(p.length===0||p.includes(c))return;d=d.filter(g=>!p.includes(g));let f;if((u||r)&&c.payload.groupId!==void 0){let g=d.filter(b=>b.payload.groupId===c.payload.groupId);f=a?d.indexOf(g[0]):d.indexOf(g[g.length-1])+1}else f=d.indexOf(c)+(a?0:1);if(d.splice(f,0,...p),!u){let g=p[0],b=r?void 0:c.payload.groupId;b===void 0?delete g.payload.groupId:g.payload.groupId=b}o.elements=[...d.reverse(),...l],$t(o),Ui(o)})}markDrop(t,i){return t.classList.contains(i)?!1:(this.clearDropMarks(),t.classList.add(i),!0)}clearDropMarks(){for(let t of this.renderRoot.querySelectorAll(".layer"))t.classList.remove("drop-before","drop-after","drop-into")}clearDragMarks(){this.clearDropMarks();for(let t of this.renderRoot.querySelectorAll(".layer, .group-kids"))t.classList.remove("dragging")}rowDrag(t,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=t,a.dataTransfer?.setData("text/plain",t),a.dataTransfer&&(a.dataTransfer.effectAllowed="move");let r=a.currentTarget,o=r.classList.contains("group")?r.nextElementSibling:null;window.setTimeout(()=>{this.dragId===t&&(r.classList.add("dragging"),o?.classList.contains("group-kids")&&o.classList.add("dragging"))},0)},onEnd:()=>{this.dragId=void 0,this.clearDragMarks()},onOver:a=>{if(!this.dragId||this.dragId===t)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),s=o.top+(r.classList.contains("drop-before")?hn:0),l=o.bottom-(r.classList.contains("drop-after")?hn:0);this.markDrop(r,a.clientY<(s+l)/2?"drop-before":"drop-after")},onDrop:a=>{a.preventDefault();let o=a.currentTarget.classList.contains("drop-before");this.clearDragMarks(),this.dragId&&this.reorderLayer(this.dragId,t,o),this.dragId=void 0}}}clickRow(t,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(t);return}if(fy(i)){this.togglePick(t),this.pickAnchor=t;return}this.multi=new Set,this.inspect={kind:"layer",id:t},this.pickAnchor=t}pickRange(t){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===t){this.togglePick(t);return}let r=[...i.elements].filter(l=>!xe(i,l)).reverse().map(l=>l.payload.id),o=r.indexOf(a),s=r.indexOf(t);if(o<0||s<0){this.togglePick(t);return}this.multi=new Set(r.slice(Math.min(o,s),Math.max(o,s)+1))}togglePick(t){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==t&&i.add(this.inspect.id),i.has(t)?i.delete(t):i.add(t),this.multi=i}groupPicked(){let t=[...this.multi];if(!this.canEdit||t.length<2)return;let i;this.mutate(a=>{i=ql(a,t)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let t=this.draft?.config;if(!t)return m;if(!qe(this.activeFamily))return this.renderInlineHasNoLayers();let i=this.canEdit,a=this.canvasFamily,r=(F,N)=>this.moveLayer(F,N),o=F=>{let N;this.mutate(j=>{N=Fp(j,F)}),N&&(this.inspect={kind:"layer",id:N})},s=F=>{this.mutate(N=>ke(N,F)),this.inspect.kind==="layer"&&this.inspect.id===F&&(this.inspect={kind:"general"})},l=gt(t,a).filter(F=>!xe(t,F)).reverse(),d=ve(this.host()),c=new _t(this.buildContext(),this.draft?.config),u=t.perFamily[this.activeFamily],p=this.inspect.kind==="family",f=`${u?.backgroundColorHex?Be(u.backgroundColorHex):"transparent"} \xB7 ${u?.borderColorHex?`${u.borderWidth} pt border`:"no border"}`,g=[...this.multi].filter(F=>t.elements.some(N=>N.payload.id===F)).length,b=dn(t,this.buildContext(),this.forced)[a],y=yy[this.thumbStep],x=Math.round(Qc*y),$=Math.round(eu*y),k=F=>b?h`<span class="thumb">${Nd(b,F,{icons:this.icons,imageSizes:this.imageSizes,width:x,height:$})}</span>`:h`<span class="thumb"></span>`,C=this.layerDetail==="expanded",M=(F,N,j=!1)=>{let B=F.payload.id,W=this.inspect.kind==="layer"&&this.inspect.id===B,ne=Oe(t,a,F),X=ne.isHidden,z=et(t,B)[0],K=nr(F.payload.rules),Y=this.picking&&this.pickHoverId===B,v=this.rowDrag(B,i);return h`<div class="layer ${W?"hl":""} ${j?"held":""} ${Y?"pick":""} ${this.dialogLitIds.includes(B)?"lit":""} ${X?"dim":""} ${this.multi.has(B)?"multi":""} ${N?"kid":""} ${C?"rich":""}"
        style=${`--k:${it[F.kind]}`} tabindex="0" draggable=${v.draggable}
        @pointerenter=${()=>{this.listHoverIds=[B]}}
        @pointerleave=${()=>this.leaveRow([B])}
        @click=${S=>this.clickRow(B,S)}
        @keydown=${S=>{S.key==="Enter"&&(this.inspect={kind:"layer",id:B})}}
        @dragstart=${v.onStart} @dragend=${v.onEnd} @dragover=${v.onOver} @drop=${v.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a group to put it inside.">${P("grip")}</span>
        <span class="bar"></span>
        ${k([B])}
        <span class="name">
          <b>${Ae(F,d)}</b>
          <small><span class="kind">${cn[F.kind]}</span> · ${H1(F,c,this.historySeries,ne.size)}</small>
          ${C?h`<span class="facts">${M1(this.host(),a,F,ne).map(S=>h`<span class="fact"><b>${S.label}</b> ${S.value}</span>`)}</span>`:m}
        </span>
        <span class="right">
          <span class="badges">
            ${z?h`<span class="badge tap" title=${`Tappable \xB7 ${Ae(z,d)}`}>tap</span>`:m}
            ${F.payload.rules.length===0?m:h`<span class="badge states" title=${K}>${K.replace(/\.$/,"").toLowerCase()}</span>`}
            ${X?h`<span class="badge">hidden</span>`:m}
          </span>
          ${i?h`<span class="acts">
            <button class="icon" title=${`Bring forward (${Un}])`} aria-label="Bring forward" @click=${S=>{S.stopPropagation(),r(B,1)}}>${P("up")}</button>
            <button class="icon" title=${`Send back (${Un}[)`} aria-label="Send back" @click=${S=>{S.stopPropagation(),r(B,-1)}}>${P("down")}</button>
            <button class="icon" title=${`${ne.isHidden?"Show":"Hide"} (${Jc}${Un}H)`} aria-label=${ne.isHidden?"Show this layer":"Hide this layer"} @click=${S=>{S.stopPropagation(),this.mutate(E=>Fe(E,a,B,{isHidden:!ne.isHidden}))}}>${P(ne.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${Un}D)`} aria-label="Duplicate" @click=${S=>{S.stopPropagation(),o(B)}}>${P("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${S=>{S.stopPropagation(),s(B)}}>${P("delete")}</button>
          </span>`:m}
        </span>
      </div>`},D=(F,N)=>{let j=this.inspect.kind==="group"&&this.inspect.id===F.id,B=!this.collapsed.has(F.id),W=this.rowDrag(F.id,i),ne=N[0],X=N[N.length-1],z=Y=>{let v=Y.currentTarget,S=v.getBoundingClientRect(),E=S.top+(v.classList.contains("drop-before")?hn:0),_=S.bottom-(v.classList.contains("drop-after")?hn:0),O=(Y.clientY-E)/Math.max(1,_-E);return O<.25?"drop-before":!B&&O>.75?"drop-after":"drop-into"},K=N.map(Y=>Y.payload.id);return h`<div class="layer group ${j?"hl":""} ${this.dialogLitIds.includes(F.id)?"lit":""} ${C?"rich":""}" style=${`--k:${oe.group}`} tabindex="0" draggable=${W.draggable}
        @pointerenter=${()=>{this.listHoverIds=K}}
        @pointerleave=${()=>this.leaveRow(K)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:F.id}}}
        @keydown=${Y=>{Y.key==="Enter"&&(this.inspect={kind:"group",id:F.id})}}
        @dragstart=${W.onStart} @dragend=${W.onEnd}
        @dragover=${Y=>{!this.dragId||this.dragId===F.id||(Y.preventDefault(),this.markDrop(Y.currentTarget,z(Y)))}}
        @drop=${Y=>{Y.preventDefault();let v=z(Y);this.clearDragMarks();let S=this.dragId;if(this.dragId=void 0,!(!S||!ne||!X)){if(v==="drop-before"){this.reorderLayer(S,ne.payload.id,!0,!0);return}if(v==="drop-after"){this.reorderLayer(S,X.payload.id,!1,!0);return}this.isGroupId(S)||(this.reorderLayer(S,ne.payload.id,!0),this.mutate(E=>Ga(E,S,F.id)))}}}>
        <span class="grip" title="Drag to reorder the whole group.">${P("grip")}</span>
        <span class="bar"></span>
        <span class="folder">${P("folder")}</span>
        <span class="name">
          <b>${F.name}</b>
          <small><span class="kind">Group</span> · ${N.length} layer${N.length===1?"":"s"} · ${F.locked?"locked":"unlocked"}</small>
          ${C?h`<span class="facts"><span class="fact"><b>Holds</b> ${N.map(Y=>Ae(Y,d)).join(", ")}</span></span>`:m}
        </span>
        <span class="right">
          ${i?h`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${Jc}${Un}G)`} aria-label="Ungroup" @click=${Y=>{Y.stopPropagation(),this.mutate(v=>Wi(v,F.id)),j&&(this.inspect={kind:"general"})}}>${P("ungroup")}</button>
          </span>`:m}
          <button class="icon lockbtn ${F.locked?"on":""}" ?disabled=${!i}
            title=${F.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone, unless the group row is selected. Click to lock."}
            aria-label=${F.locked?"Unlock the group":"Lock the group"}
            @click=${Y=>{Y.stopPropagation(),this.mutate(v=>{let S=v.groups?.find(E=>E.id===F.id);S&&(S.locked=!S.locked)})}}>${P(F.locked?"lock":"unlock")}</button>
          <button class="chev" aria-expanded=${B?"true":"false"} title=${B?"Fold the group":"Unfold the group"}
            @click=${Y=>{Y.stopPropagation();let v=new Set(this.collapsed);B?v.add(F.id):v.delete(F.id),this.collapsed=v}}>${P("chevron")}</button>
        </span>
      </div>`},I=[],T=new Set;for(let F=0;F<l.length;F++){let N=l[F],j=N.payload.groupId,B=j===void 0?void 0:t.groups?.find(X=>X.id===j);if(!B){I.push(M(N,!1));continue}if(T.has(B.id))continue;T.add(B.id);let W=l.filter(X=>X.payload.groupId===B.id);I.push(D(B,W));let ne=this.inspect.kind==="group"&&this.inspect.id===B.id;this.collapsed.has(B.id)||I.push(h`<div class="group-kids">${W.map(X=>M(X,!0,ne))}</div>`)}return h`<div class="card layers-card s${this.thumbStep}" style=${`--thumb-w:${x}px;--thumb-h:${$}px`}>
      <h2 class="panel-title tools" style=${`--c:${oe.place}`}><span class="swatch">${P("layers")}</span>Layers
        <span class="mini">top draws last</span><span class="spacer"></span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${[["compact","Compact rows: the name and one line about the layer"],["expanded","Expanded rows: what the layer is made of and where it sits"]].map(([F,N])=>h`
              <button class=${this.layerDetail===F?"on":""} title=${N} aria-label=${N} aria-pressed=${this.layerDetail===F?"true":"false"}
                @click=${()=>{this.layerDetail=F,this.saveListView()}}>${P(F)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${x1.map((F,N)=>h`
              <button class=${this.thumbStep===N?"on":""} title=${`${cy[N]} row pictures`}
                aria-label=${`${cy[N]} row pictures`} aria-pressed=${this.thumbStep===N?"true":"false"}
                @click=${()=>{this.thumbStep=N,this.saveListView()}}>${F}</button>`)}
          </span>
        </span>
      </h2>
      ${g>=2&&i?h`<div class="group-cta"><span>${g} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${Un}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:t.elements.length>=2&&i&&!t.groups?.length?h`<div class="hint">${da}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`:m}
      ${t.elements.length===0?h`<div class="empty">No layers yet. Add one above.</div>`:m}
      ${this.renderShapeIsBlank(t,a,i)}
      <div class="layers">
      ${I}
      </div>
      <div class="layer pinned ${p?"hl":""}" style=${`--k:${oe.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${F=>{F.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${F=>{this.dragId&&(F.preventDefault(),this.markDrop(F.currentTarget,"drop-before"))}}
        @drop=${F=>{F.preventDefault(),this.clearDragMarks();let N=this.dragId,j=[...l].reverse().find(B=>B.payload.id!==N&&B.payload.groupId!==N);N&&j&&this.reorderLayer(N,j.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${P("shape")}</span>
        <span class="bar"></span>
        ${k([])}
        <span class="name">
          <b>${te(this.activeFamily)} shape</b>
          <small><span class="kind">Background</span> · ${f}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
    </div>`}renderInlineHasNoLayers(){return h`<div class="card">
      <h2 class="panel-title"><span class="swatch">${P("layers")}</span>Layers</h2>
      <div class="empty">Inline is one line of text and draws no layers.
        Its text is on the right. Pick a canvas shape above to work on layers.</div>
    </div>`}renderPresetDialog(){let t=this.presetKind?em(this.presetKind):void 0,i=this.presetEntity;return h`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${t===void 0?m:h`
        <h2>${t.title}</h2>
        <div class="hint">${t.blurb}</div>
        ${Ut(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},ay,{compact:!0,...t.domains?{domain:t.domains}:{},...t.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(t){this.canEdit&&(this.presetKind=t,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())}))}closePresetDialog(){let t=this.renderRoot.querySelector("dialog.preset-dialog");t?.open?t.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let t=this.presetKind,i=this.presetEntity;if(!t||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.addHere(s=>{o=im(s,t,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return h`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let t=this.draft?.config;if(!t)return h`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=dn(t,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return h`
      <div class="card canvas-card">
        <div class="canvas-bar">
          <div class="bar-row shapes">${this.renderShapeTabs(t,i)}</div>
          <div class="bar-row tools">
          <span class="inbox" title=${`Layouts are made in the ${this.referenceCase.label} box. Every other size draws a scaled copy of it.`}>
            <span class="pre">Preview as</span>
            <span class="case-tool" data-menu="case">
              <button class="case-pick" aria-haspopup="listbox" aria-expanded=${this.openMenu==="case"?"true":"false"}
                aria-label=${`Preview as ${a.label}`} @click=${()=>this.toggleMenu("case")}>
                ${a.label}${a.measured?"":" (estimated)"}${P("chevron")}
              </button>
              ${this.openMenu==="case"?h`<div class="pop-menu" role="listbox" aria-label="Preview as">
                ${this.previewCases.map(o=>h`<button class="row" role="option" aria-selected=${o.label===a.label?"true":"false"}
                  @click=${()=>{this.toggleMenu("case",!1),this.previewCase=o.label}}>${o.label}${o.measured?"":" (estimated)"}</button>`)}
              </div>`:m}
            </span>
          </span>
          ${qe(r)?this.renderTintTool():m}
          </div>
        </div>
        <div class="stage">
          ${qe(r)?this.renderOver():m}
          ${qe(r)?this.renderBigPreview(r,i,a):this.renderInlinePreview(i.inline,!1)}
          ${this.renderUnder(t,r)}
        </div>
        ${this.zoomed&&qe(r)?this.renderZoomDialog(r,i,a):m}
      </div>
      <div class="under-grid">
        ${this.renderValuesRow()}
      </div>`}renderBigPreview(t,i,a){let r=i[t];if(!r)return m;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,s=this.draft?.config,l=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&s?ft(s,o)?.id:void 0,d=s&&l!==void 0&&(this.inspect.kind==="group"||ft(s,o)?.locked)?mt(s,l).map(y=>y.payload.id):[],c=[...new Set([...d,...this.multi])],u=In(a,t),p=this.focusTapId(),f=!this.picking&&!this.showTaps&&this.rowHoverId!==void 0&&s?.elements.some(y=>y.payload.id===this.rowHoverId)?this.rowHoverId:void 0,g=f!==void 0?[]:this.listHoverIds,b={icons:this.icons,imageSizes:this.imageSizes,tapAreas:!0,slot:u,highlightId:p??f??o,...c.length>0&&!this.showTaps&&f===void 0?{highlightIds:c}:{},...this.showGridLines||!this.snapGrid&&this.altHeld&&this.canEdit?{grid:this.gridStep}:{},...this.guides.length>0&&t===this.activeFamily?{guides:this.guides}:{},tapReview:this.showTaps,...this.previewTint!==void 0?{tint:this.previewTint,...Dt(t)?{tintSurface:"phone"}:{}}:{},...p!==void 0?{tapFocusId:p}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||p!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:g.length>0?{hoverIds:g}:{}};return h`<div class="preview ${t} active ${this.picking?"picking":""}"
      @pointerdown=${y=>this.onPreviewPointerDown(t,y)}
      @pointermove=${y=>this.onPickMove(y)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${xi(r,b)}
    </div>`}renderUnder(t,i){let a=ve(this.host()),r=this.inspect,o=r.kind==="layer"?t.elements.find(u=>u.payload.id===r.id):void 0,s;if(this.showTaps)s=h`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${on(t.tapAction)}</b>.`;else if(this.picking)s="Point at a layer and click it. Escape stops.";else if(i==="inline")s="One line of text. Edit it on the right.";else if(r.kind==="group"){let u=t.groups?.find(f=>f.id===r.id),p=u?mt(t,u.id).length:0;s=u?h`editing group <b>${u.name}</b>. Drag to move all ${p} layers.${u.locked?"":" Click one layer to move it alone."}`:""}else if(o){let u=ft(t,o.payload.id);s=u?.locked?h`editing <b>${Ae(o,a)}</b> in <b>${u.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:h`editing <b>${Ae(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.${this.snapGrid&&this.snapLayers?" It snaps to the grid and to the other layers. Hold Alt to drag freely.":this.snapGrid?" It snaps to the grid. Hold Alt to drag freely.":this.snapLayers?" It snaps to the other layers. Hold Alt to drag freely.":" Hold Alt while dragging to snap to the grid."}`}else s="click a layer to edit it";if(!qe(i))return h`<div class="under"><b>Inline</b><span class="dot">·</span><span class="tail">${s}</span></div>`;let l=In(this.currentCase(),i),d=Uo(l,i),c=Math.round(d.scale*100);return h`<div class="under">
      <b>${te(i)}</b>
      <span class="size">${l.width} × ${l.height} pt${c!==100?` \xB7 ${c}%`:""}</span>
      <span class="dot">·</span>
      <span class="tail">${s}</span>
    </div>`}renderInlinePreview(t,i){let a;if(!t)a=h`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=t.countdownEnd!==void 0&&t.countdownEnd>r?Ji((t.countdownEnd-r)/1e3):t.text,s=t.symbol?this.icons.render(t.symbol,i?11:15,"#FFFFFF"):void 0;a=h`<div class="inline-line">${s??m}<span>${t.label?`${t.label}: `:""}${o}</span></div>`}return i?a:h`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSharedValues(){let t=this.draft?.config;if(!t)return m;let i=t.values,a=this.canEdit?h`<button class="small" @click=${()=>{let c=hg();this.mutate(u=>{u.values.push(c)}),this.openSharedValue(c.id)}}>Add</button>`:m,r="Like a variable: set it once, and every layer that reads it follows.",o=h`<h2 class="panel-title"><span class="swatch">${P("content")}</span>Shared values
        <span class="mini" title=${r}>set once, used by many layers</span>
        <button type="button" class="sec-help ${this.sharedHelp?"on":""}" title=${this.sharedHelp?"Hide how shared values work":"How shared values work"}
          aria-label="How shared values work" aria-expanded=${this.sharedHelp?"true":"false"}
          @click=${()=>{this.sharedHelp=!this.sharedHelp}}>?</button>
        <span class="spacer"></span>${a}
      </h2>
      ${this.sharedHelp?h`<div class="shared-help">
        <p>${r} Use one when several layers show the same thing, so a change is made in one place.</p>
        <ol>
          <li><b>Add</b> one here. Give it a name and choose its source, like an entity.</li>
          <li>On a layer, open its value and set <b>Source</b> to <b>Shared value</b>. Or click <b>Make shared</b> on a value that is already set up.</li>
          <li>Change the shared value here. Every layer that reads it changes too.</li>
          <li>Each layer can still add its own <b>Format</b>, like a unit or fewer decimals.</li>
        </ol>
      </div>`:m}`;if(i.length===0)return h`<div class="card tint-values values-list ${this.sharedHelp?"":"empty-list"}" style=${`--c:${oe.complication}`}>
        ${o}
      </div>`;let s=this.host(),l=new _t(this.buildContext(),this.draft?.config),d=ve(s);return h`<div class="card tint-values values-list" style=${`--c:${oe.complication}`}>
      ${o}
      <div class="data">
      ${i.map(c=>{let u=l.resolve({kind:{kind:"named",id:c.id}}),p=this.openValue===c.id,f=()=>{this.setOpenValue(p?void 0:c.id)};return h`<div class="vitem ${p?"open":""}"><div class="datum vrow ${p?"hl":""}" role="button" tabindex="0" aria-expanded=${p?"true":"false"}
            title=${p?"Close":"Edit this shared value"}
            @click=${f}
            @keydown=${g=>{(g.key==="Enter"||g.key===" ")&&g.target===g.currentTarget&&(g.preventDefault(),f())}}>
          <span class="nm">${c.name||"(unnamed)"}</span>
          <span class="spacer"></span>
          <span class="meta ${u===void 0?"none":""}" title=${Ie(c.value,d)}>${u??"unresolved"}</span>
          ${this.canEdit?h`<button class="icon danger" title="Delete. Layers that read it keep their own copy." aria-label="Delete value" @click=${g=>{g.stopPropagation(),this.mutate(b=>{td(b,c.id)}),p&&(this.openValue=void 0)}}>${P("delete")}</button>`:m}
        </div>
        ${p?h`<div class="value-open">${pg(s,c)}</div>`:m}</div>`})}
      </div>
    </div>`}setOpenValue(t){let i=this.openValue;if(this.openValue=t,i===void 0||i===t)return;let a=this.draft?.config.values.find(r=>r.id===i);a&&a.name.trim()===""&&this.mutate(r=>{td(r,i)})}openSharedValue(t){this.renderRoot.querySelectorAll(":popover-open").forEach(a=>a.hidePopover()),this.setOpenValue(t);let i=this.draft?.config.values.find(a=>a.id===t)?.name.trim()==="";this.updateComplete.then(()=>{this.renderRoot.querySelector(".values-list .datum.hl")?.scrollIntoView({block:"start",behavior:"smooth"}),i&&this.renderRoot.querySelector(".values-list .value-open input[type=text]")?.focus({preventScroll:!0})})}openRaw(){this.showRaw=!0;let t=this.renderRoot.querySelector("details.foot");t&&(t.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapeTabs(t,i){let a=t.supportedFamilies,r=this.ownerFamilies.filter(o=>!a.includes(o));return h`<div class="shape-seg" role="group" aria-label="Shapes">${this.renderHaveTabs(t,i)}</div>
      ${r.length>0?h`<span class="shape-adds">${r.map(o=>h`<button class="tab off ${o}" ?disabled=${!this.canEdit}
        title=${`Add the ${te(o)} shape`} @click=${()=>this.addShape(o)}>${P("plus")}${te(o)}</button>`)}</span>`:m}`}renderHaveTabs(t,i){let a=t.supportedFamilies;return this.ownerFamilies.filter(r=>a.includes(r)).map(r=>{let o=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let c=i[r];s=c?xi(c,{icons:this.icons,imageSizes:this.imageSizes,slot:In(this.referenceCase,r)}):m}let l=r!=="inline"&&As(t,r)===0&&t.elements.length>0,d=this.canEdit&&Xo(t,r);return h`<span class="tab-wrap">
        <button class="tab ${r}" aria-pressed=${o?"true":"false"} title=${`Edit the ${te(r)} shape`}
          @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
          <span class="art">${s}</span>
          <span class="lbl">${te(r)}</span>${l?h`<small>nothing shown</small>`:m}
        </button>
        ${this.canEdit?h`<button class="icon danger tab-x" ?disabled=${!d}
          title=${d?`Remove the ${te(r)} shape`:"The only shape. Add another before removing it."}
          aria-label=${`Remove the ${te(r)} shape`}
          @click=${c=>{c.stopPropagation(),this.removeShape(r)}}>${P("delete")}</button>`:m}
      </span>`})}renderValuesRow(){let t=this.draft?.config;if(!t)return m;let i=[...this.compiled?.entities.keys()??[]],a=Zp(t),r=this.testValues.size>0;return h`<div class="card tint-states" style=${`--c:${oe.states}`}>
      <h2 class="panel-title"><span class="swatch">${P("states")}</span>Values on the ${this.deviceWord}
        <span class="mini">live · slide, pick or type one to try another</span><span class="spacer"></span>
        ${r?h`<span class="testing-pill">Testing with your values <button @click=${()=>{this.editingValue=void 0,this.applyTestValues(new Map)}}>Back to live</button></span>`:m}
      </h2>
      ${i.length===0&&a.length===0?h`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:h`<div class="chips values">
        ${i.map(o=>{let s=this.hass.states[o],l=typeof s?.attributes.friendly_name=="string"?s.attributes.friendly_name:o,d=typeof s?.attributes.unit_of_measurement=="string"?` ${s.attributes.unit_of_measurement}`:"",c=s?`${s.state}${d}`:"not in Home Assistant",u=this.testValues.get(o),f=t.elements.find(g=>To(t,g.payload.id).some(b=>b.ref.entityId===o))?.kind??"text";return h`<div class="vchip vrow ctl ${u!==void 0?"testing":""}" style=${`--k:${it[f]}`}
            title=${u!==void 0?`Live value: ${c}`:""}>
            <span class="kbar"></span><b>${l}</b><span class="spacer"></span>
            ${this.renderTestControl(o,l,s,u,d,c)}
            ${u!==void 0?h`<button type="button" class="small live-reset" title=${`Back to the live value: ${c}`} @click=${()=>this.setTestValue(o,void 0)}>Live</button>`:m}
          </div>`})}
        ${a.map(o=>{let s=cd(o.id),l=this.sharedRaw(o.id)??"",d=l===""?"empty":l,c=o.name||"(unnamed)",u=this.testValues.get(s),p={entity_id:s,state:l,attributes:{},last_changed:"",last_updated:""};return h`<div class="vchip vrow ctl ${u!==void 0?"testing":""}" style=${`--k:${oe.complication}`}
            title=${u!==void 0?`Saved value: ${d}`:""}>
            <span class="kbar"></span><b>${c}</b><span class="vtag" title="A shared value. Trying one here is not saved; change it in Shared values to keep it.">shared</span><span class="spacer"></span>
            ${this.renderTestControl(s,c,p,u,"",d)}
            ${u!==void 0?h`<button type="button" class="small live-reset" title=${`Back to the saved value: ${d}`} @click=${()=>this.setTestValue(s,void 0)}>Live</button>`:m}
          </div>`})}
      </div>`}
    </div>`}renderTestControl(t,i,a,r,o,s){let l=r??a?.state??"",d=eh(t,a,r);if(d.kind==="choice")return h`<span class="test-ctl"><select aria-label=${`Test value for ${i}`} @change=${f=>this.setTestValue(t,f.target.value)}>
        ${d.options.map(f=>h`<option value=${f} ?selected=${f===l}>${f}</option>`)}
      </select></span>`;let c=this.editingValue===t?h`<input type="text" .value=${l} aria-label=${`Test value for ${i}`}
          @keydown=${f=>{f.key==="Enter"&&f.target.blur(),f.key==="Escape"&&(this.editingValue=void 0)}}
          @blur=${f=>this.commitTestValue(t,f.target.value)} />`:h`<button type="button" class="val" title="Click to type a value"
          @click=${()=>{this.editingValue=t,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input[type=text]")?.focus())}}>${r!==void 0?`${r}${o}`:s}</button>`;if(d.kind==="text")return h`<span class="test-ctl">${c}</span>`;let u=Number(l),p=l.trim()!==""&&Number.isFinite(u)?u:d.min;return h`<span class="test-ctl">
      <input type="range" min=${d.min} max=${d.max} step=${d.step} .value=${String(p)}
        aria-label=${`Slide the test value for ${i}`}
        @input=${f=>this.setTestValue(t,f.target.value,`test-${t}`)}
        @change=${()=>this.draft?.endGesture()} />
      ${c}
    </span>`}commitTestValue(t,i){this.editingValue=void 0,this.setTestValue(t,i)}setTestValue(t,i,a){let r=i?.trim()??"",o=new Map(this.testValues),s=t.startsWith(Fo)?this.sharedRaw(t.slice(Fo.length)):this.hass.states[t]?.state;r===""||r===s?o.delete(t):o.set(t,r),this.applyTestValues(o,a)}sharedRaw(t){let i=this.draft?.config;if(!i)return;let a=this.buildContext(!1),r=a.namedValues.map(o=>({...o,value:{kind:o.value.kind}}));return new _t({...a,namedValues:r},i).resolve({kind:{kind:"named",id:t}})}applyTestValues(t,i){let a=this.draft;!a||t.size===a.testValues.size&&[...t].every(([o,s])=>a.testValues.get(o)===s)||(a.setTestValues(t,i),this.version++)}get previewCases(){return Ge(this.selectedOwner)==="iphone"?er:Qa}get referenceCase(){return Ge(this.selectedOwner)==="iphone"?Td:Vo}currentCase(){return this.previewCases.find(t=>t.label===this.previewCase)??this.referenceCase}previewSlot(t){return In(this.currentCase(),t)}crumbs(t,i){let a=this.inspect,r=t.name.trim()||"Complication",o=te(this.activeFamily),s=a.kind==="family"&&i===void 0?h`<span class="here" style=${`--k:${oe.place}`}>${o} shape</span>`:h`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,l=m,d=m;if(i!==void 0)l=h`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span><span class="nm">${i} layers</span></span>`;else if(a.kind==="layer"){let c=t.elements.find(u=>u.payload.id===a.id);if(c){l=h`<span class="here" style=${`--k:${it[c.kind]}`} title=${Ae(c,ve(this.host()))}><span class="kchip">${cn[c.kind]}</span></span>`;let u=ft(t,c.payload.id);u&&(d=h`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:u.id}}} title="Edit the group">${u.name}</button>`)}}else if(a.kind==="group"){let c=t.groups?.find(u=>u.id===a.id);c&&(l=h`<span class="here" style=${`--k:${oe.group}`} title=${c.name}><span class="kchip">Group</span></span>`)}return h`<div class="crumbs">
      <button title="Edit the complication" @click=${()=>{this.multi=new Set,this.inspect={kind:"general"}}}>${r}</button><span class="sep">›</span>${s}${d}
      ${l===m?m:h`<span class="sep">›</span>${l}`}
    </div>`}pickedElements(t){return this.multi.size<2?[]:t.elements.filter(i=>this.multi.has(i.payload.id))}complicationHead(t){let i=t.name.trim()||"Complication";return h`<div class="insp-head comp-head">
      <div class="crumbs"><span class="here" style=${`--k:${oe.complication}`}>${i}</span></div>
      <span class="comp-acts">
        <button class="ghost" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?h`
          <button class="ghost" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?h`<button class="ghost danger" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="ghost" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:h`<button class="ghost danger" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:m}
      </span>
    </div>`}renderInspector(){let t=this.draft?.config;if(!t)return m;let i=this.pickedElements(t);if(i.length>=2)return h`
        <div class="insp-head">${this.crumbs(t,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(t,i)}</div>`;let a=this.host(),r=this.inspect,o=this.canEdit?"":"pointer-events:none;opacity:.6";if(r.kind==="general")return h`
        ${this.complicationHead(t)}
        <div class="insp-body" style=${o} @change=${()=>this.draft?.endGesture()}>
          ${Me(a,"complication","Complication",cg(a),{color:oe.complication,icon:"watch",alwaysOpen:!0})}
          <p class="insp-note">Click a layer ${Ge(this.selectedOwner)==="iphone"?"on the preview":"on the watch"} or in the list to edit it. The shape's own background and border are the bottom row of the list.</p>
        </div>`;let s=m,l=!0;if(r.kind==="layer"){let c=t.elements.find(u=>u.payload.id===r.id);if(!c)return this.inspect={kind:"general"},m;s=wg(a,c,this.canvasFamily,{placement:!0,tap:!0})}else if(r.kind==="group"){let c=t.groups?.find(u=>u.id===r.id);if(!c)return this.inspect={kind:"general"},m;l=!1,s=Cg(a,c)}else s=Sg(a,this.activeFamily);let d=this.openSections.size>1;return h`
      <div class="insp-head">
        ${this.crumbs(t)}
        ${l?h`<button class="expand" @click=${()=>{this.openSections=d?new Set([b1(r)]):new Set(wc)}}>${d?"One at a time":"Open all"}</button>`:m}
      </div>
      <div class="insp-body" style=${o} @change=${()=>this.draft?.endGesture()}>${s}</div>`}triCheck(t,i,a){return h`<label class="field check">
      <span>${t}${i==="mixed"?h` <span class="mixed">(mixed)</span>`:m}</span>
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} /></label>`}multiEditor(t,i){let a=this.canvasFamily,r=this.host(),o=ve(r),s=new _t(this.buildContext(),this.draft?.config),l=mg(t,a,i),d=i.length,c=[...i].reverse(),u=f=>this.mutate(g=>{for(let b of i)Fe(g,a,b.payload.id,{isHidden:f})}),p=f=>this.mutate(g=>{for(let b of i){let y=g.elements.find(x=>x.payload.id===b.payload.id);y&&y.kind!=="image"&&y.kind!=="tap"&&y.kind!=="timeline"&&y.kind!=="chartTimes"&&y.kind!=="chartDots"&&y.kind!=="chartGrid"&&y.kind!=="imageTime"&&(y.payload.colorSlot.baseColorHex=f)}},"multi-colour");return h`
      ${Me(r,"picked",`${d} layers picked`,h`
          <div class="field list-field"><span>Layers</span>
            <div class="picked">
              ${c.map(f=>h`<div class="row" style=${`--k:${it[f.kind]}`}>
                <span class="bar"></span>
                <span class="name">
                  ${f.kind==="icon"?h`<span class="glyph">${this.icons.render(s.resolve(f.payload.symbol)??"questionmark",16,f.payload.colorSlot.baseColorHex)??m}</span>`:m}
                  <b>${Ae(f,o)}</b><span class="kind">${cn[f.kind]}</span>
                </span>
              </div>`)}
            </div>
            <div class="row-acts">
              <button class="small primary" title=${`Group (${Un}G)`} @click=${()=>this.groupPicked()}>Group them</button>
              <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
            </div>
          </div>
          <div class="hint">${da}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>`,{color:"var(--wa-accent)",icon:"layers",summary:`Edits here land on all ${d}`,alwaysOpen:!0})}
      ${Me(r,"picked-common",`All ${d} at once`,h`
          ${this.triCheck("Hidden",l.hiddenHere,u)}
          ${l.colourable?h`${we("Colour",l.colour,f=>{f!==void 0&&p(f)})}
              ${l.colour===void 0?h`<div class="hint keep">These layers are different colours. Pick one to give them all the same.</div>`:m}`:h`<div class="hint keep">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">These layers are on the ${te(a)} shape and on no other, so nothing here reaches another shape.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>`,{color:oe.place,icon:"place",summary:"The settings every picked layer has",alwaysOpen:!0})}`}renderFooter(){let t=this.draft;if(!t)return m;let i=this.records.find(r=>r.id===this.selectedId),a=Tf({revision:i?.revision??null,dirty:t.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return h`<details class="foot">
      <summary>
        <span class="foot-dot ${a.tone}">●</span>
        <span class="foot-text">${a.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${i?i.revision:"unsaved"}${t.dirty?h` <span class="warn">· unsaved changes</span>`:""}</dd>
          ${i?h`<dt>Saved</dt><dd>${i.updatedAt||"\u2014"} by ${i.updatedBy||"\u2014"}</dd>`:m}
          <dt>Templates</dt><dd class=${this.templateError?"err":"ok"}>${this.templateError??(this.compiled?.document?"rendered":"none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size??0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the ${this.deviceWord} to pull it down.</p>
        <button class="link" @click=${()=>this.showRaw=!this.showRaw}>${this.showRaw?"Hide the raw configuration":"Show the raw configuration"}</button>
        ${this.showRaw?h`<pre>${JSON.stringify(t.encoded(),null,2)}</pre>`:m}
      </div>
    </details>`}};A([_i({attribute:!1})],H.prototype,"hass",2),A([_i({type:Boolean})],H.prototype,"narrow",2),A([_i({attribute:!1})],H.prototype,"panel",2),A([L()],H.prototype,"colLeft",2),A([L()],H.prototype,"colRight",2),A([L()],H.prototype,"panelWidth",2),A([L()],H.prototype,"owners",2),A([L()],H.prototype,"ownerId",2),A([L()],H.prototype,"records",2),A([L()],H.prototype,"selectedId",2),A([L()],H.prototype,"draft",2),A([L()],H.prototype,"readOnlyReason",2),A([L()],H.prototype,"parseError",2),A([L()],H.prototype,"maxSchemaVersion",2),A([L()],H.prototype,"presets",2),A([L()],H.prototype,"occupied",2),A([L()],H.prototype,"serverToken",2),A([L()],H.prototype,"appliedToken",2),A([L()],H.prototype,"sendStatusKnown",2),A([L()],H.prototype,"polling",2),A([L()],H.prototype,"lastPollSeconds",2),A([L()],H.prototype,"lastSyncSeconds",2),A([L()],H.prototype,"sendPending",2),A([L()],H.prototype,"pages",2),A([L()],H.prototype,"templateResults",2),A([L()],H.prototype,"historySeries",2),A([L()],H.prototype,"historyReadings",2),A([L()],H.prototype,"templateError",2),A([L()],H.prototype,"templateFetchedAt",2),A([L()],H.prototype,"forced",2),A([L()],H.prototype,"showRaw",2),A([L()],H.prototype,"inspect",2),A([L()],H.prototype,"openSections",2),A([L()],H.prototype,"helpSections",2),A([L()],H.prototype,"pickerOpen",2),A([L()],H.prototype,"pickerFilter",2),A([L()],H.prototype,"pickerNote",2),A([L()],H.prototype,"pickerHiddenOpen",2),A([L()],H.prototype,"pickerConfirmDelete",2),A([L()],H.prototype,"openValue",2),A([L()],H.prototype,"sharedHelp",2),A([L()],H.prototype,"editingValue",2),A([L()],H.prototype,"thumbStep",2),A([L()],H.prototype,"layerDetail",2),A([L()],H.prototype,"addOpen",2),A([L()],H.prototype,"addDetail",2),A([L()],H.prototype,"multi",2),A([L()],H.prototype,"copiedPosition",2),A([L()],H.prototype,"snapGrid",2),A([L()],H.prototype,"gridStep",2),A([L()],H.prototype,"showGridLines",2),A([L()],H.prototype,"snapLayers",2),A([L()],H.prototype,"guides",2),A([L()],H.prototype,"openMenu",2),A([L()],H.prototype,"altHeld",2),A([L()],H.prototype,"collapsed",2),A([L()],H.prototype,"activeFamily",2),A([L()],H.prototype,"picking",2),A([L()],H.prototype,"pickHoverId",2),A([L()],H.prototype,"listHoverIds",2),A([L()],H.prototype,"rowHoverId",2),A([L()],H.prototype,"zoomed",2),A([L()],H.prototype,"helpOpen",2),A([L()],H.prototype,"showTaps",2),A([L()],H.prototype,"savedName",2),A([L()],H.prototype,"presetKind",2),A([L()],H.prototype,"presetEntity",2),A([L()],H.prototype,"newOpen",2),A([L()],H.prototype,"newName",2),A([L()],H.prototype,"newFamily",2),A([L()],H.prototype,"shareOpen",2),A([L()],H.prototype,"shareMode",2),A([L()],H.prototype,"shareLabels",2),A([L()],H.prototype,"shareFamilies",2),A([L()],H.prototype,"dialogLitIds",2),A([L()],H.prototype,"shareGroupNames",2),A([L()],H.prototype,"shareValueNames",2),A([L()],H.prototype,"shareName",2),A([L()],H.prototype,"shareLayerNames",2),A([L()],H.prototype,"shareNote",2),A([L()],H.prototype,"shareTextOpen",2),A([L()],H.prototype,"shareCopied",2),A([L()],H.prototype,"shareLinkShown",2),A([L()],H.prototype,"shareFocus",2),A([L()],H.prototype,"galleryOpen",2),A([L()],H.prototype,"galleryTab",2),A([L()],H.prototype,"galleryStep",2),A([L()],H.prototype,"galleryReplaces",2),A([L()],H.prototype,"galleryTitle",2),A([L()],H.prototype,"galleryDescription",2),A([L()],H.prototype,"galleryTags",2),A([L()],H.prototype,"galleryNickname",2),A([L()],H.prototype,"galleryPreviews",2),A([L()],H.prototype,"galleryPreviewNote",2),A([L()],H.prototype,"gallerySending",2),A([L()],H.prototype,"gallerySent",2),A([L()],H.prototype,"galleryError",2),A([L()],H.prototype,"galleryUploads",2),A([L()],H.prototype,"galleryUploadsError",2),A([L()],H.prototype,"galleryConfirmDelete",2),A([L()],H.prototype,"galleryDeleting",2),A([L()],H.prototype,"importOpen",2),A([L()],H.prototype,"importText",2),A([L()],H.prototype,"importParse",2),A([L()],H.prototype,"importName",2),A([L()],H.prototype,"importMap",2),A([L()],H.prototype,"importFamilies",2),A([L()],H.prototype,"importDrop",2),A([L()],H.prototype,"importTextShown",2),A([L()],H.prototype,"importFocus",2),A([L()],H.prototype,"importHistory",2),A([L()],H.prototype,"shareLink",2),A([L()],H.prototype,"helpTab",2),A([L()],H.prototype,"linkNote",2),A([L()],H.prototype,"previewCase",2),A([L()],H.prototype,"previewTint",2),A([L()],H.prototype,"loadError",2),A([L()],H.prototype,"saveError",2),A([L()],H.prototype,"saving",2),A([L()],H.prototype,"conflict",2),A([L()],H.prototype,"remoteRevision",2),A([L()],H.prototype,"confirmDelete",2),A([L()],H.prototype,"moveTarget",2),A([L()],H.prototype,"moving",2),A([L()],H.prototype,"moveError",2),A([L()],H.prototype,"version",2);var tu=H;function Kt(e){return String(e?.message??e)}function E1(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let n=e.split(":").map(t=>Number(t));if(!(n.length===0||n.length>3||n.some(t=>Number.isNaN(t))))return n.reduce((t,i)=>t*60+i,0)}function gy(e){let n=e.device_name??e.owner_watch_id;return Ge(e)==="iphone"?/iphone/i.test(n)?n:`${n} (iPhone)`:e.paired_iphone_name?`${n} (${e.paired_iphone_name})`:n}function F1(e){return[...e.filter(n=>Ge(n)!=="iphone"),...e.filter(n=>Ge(n)==="iphone")]}function M1(e,n,t,i){let a=[{label:"Shows",value:Ec(e,t)}],r=Ss(t);return r&&a.push({label:"Looks",value:r}),i.frame.rotationDegrees!==0&&a.push({label:"Turned",value:`${Math.round(i.frame.rotationDegrees)}\xB0`}),a}function R1(e){return e<120?`${e} min`:e%1440===0?`${e/1440} d`:e%60===0?`${e/60} h`:`${e} min`}function H1(e,n,t,i){let a=r=>h`<span class="val-tok">${r??"--"}</span>`;switch(e.kind){case"text":return h`${a(n.resolve(e.payload.value))} · ${i??e.payload.fontSize} pt`;case"icon":return`${i??e.payload.size} pt \xB7 ${Be(e.payload.colorSlot.baseColorHex)}`;case"gauge":return h`${a(n.resolve(e.payload.value))} · ${e.payload.style}`;case"chart":{let r=Lt(e.payload)??It(e.payload),o=r!==void 0?t.get(r)??"":n.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${nt(o).length} values`}case"timeline":{let r=Qe(e.payload),o=r===void 0?[]:Xa(t.get(r)??""),s=Math.max(0,o.length-1);return`${R1(kt(e.payload))} \xB7 ${s} ${s===1?"change":"changes"}`}case"shape":return`${Be(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return e.payload.contentMode==="fill"?"fill":"fit";case"tap":return on(e.payload.action);case"chartTimes":return`${e.payload.timeLabelCount} times \xB7 ${e.payload.labelSize} pt`;case"chartDots":return`${e.payload.dots==="all"?"every reading":"auto"}${e.payload.size===void 0?"":` \xB7 ${e.payload.size} pt`}`;case"chartGrid":return`${e.payload.lines} ${e.payload.lines===1?"line":"lines"} \xB7 ${e.payload.thickness} pt`;case"imageTime":return}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",tu);export{tu as WristAssistantPanel,my as columnFit,M1 as layerFacts,gy as ownerLabel,F1 as ownersByKind};
