var Kx=Object.defineProperty;var jx=Object.getOwnPropertyDescriptor;var H=(e,n,t,i)=>{for(var a=i>1?void 0:i?jx(n,t):n,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(n,t,a):o(a))||a);return i&&a&&Kx(n,t,a),a};var bo=globalThis,xo=bo.ShadowRoot&&(bo.ShadyCSS===void 0||bo.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Yl=Symbol(),Pp=new WeakMap,Oa=class{constructor(n,t,i){if(this._$cssResult$=!0,i!==Yl)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=t}get styleSheet(){let n=this.o,t=this.t;if(xo&&n===void 0){let i=t!==void 0&&t.length===1;i&&(n=Pp.get(t)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&Pp.set(t,n))}return n}toString(){return this.cssText}},Pe=e=>new Oa(typeof e=="string"?e:e+"",void 0,Yl),Xl=(e,...n)=>{let t=e.length===1?e[0]:n.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new Oa(t,e,Yl)},zp=(e,n)=>{if(xo)e.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of n){let i=document.createElement("style"),a=bo.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=t.cssText,e.appendChild(i)}},Jl=xo?e=>e:e=>e instanceof CSSStyleSheet?(n=>{let t="";for(let i of n.cssRules)t+=i.cssText;return Pe(t)})(e):e;var{is:qx,defineProperty:Yx,getOwnPropertyDescriptor:Xx,getOwnPropertyNames:Jx,getOwnPropertySymbols:Zx,getPrototypeOf:Qx}=Object,wo=globalThis,Op=wo.trustedTypes,ew=Op?Op.emptyScript:"",tw=wo.reactiveElementPolyfillSupport,Ga=(e,n)=>e,Ba={toAttribute(e,n){switch(n){case Boolean:e=e?ew:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,n){let t=e;switch(n){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},vo=(e,n)=>!qx(e,n),Gp={attribute:!0,type:String,converter:Ba,reflect:!1,useDefault:!1,hasChanged:vo};Symbol.metadata??=Symbol("metadata"),wo.litPropertyMetadata??=new WeakMap;var sn=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,t=Gp){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(n,t),!t.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(n,i,t);a!==void 0&&Yx(this.prototype,n,a)}}static getPropertyDescriptor(n,t,i){let{get:a,set:r}=Xx(this.prototype,n)??{get(){return this[t]},set(o){this[t]=o}};return{get:a,set(o){let s=a?.call(this);r?.call(this,o),this.requestUpdate(n,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Gp}static _$Ei(){if(this.hasOwnProperty(Ga("elementProperties")))return;let n=Qx(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(Ga("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ga("properties"))){let t=this.properties,i=[...Jx(t),...Zx(t)];for(let a of i)this.createProperty(a,t[a])}let n=this[Symbol.metadata];if(n!==null){let t=litPropertyMetadata.get(n);if(t!==void 0)for(let[i,a]of t)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let a=this._$Eu(t,i);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let t=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let a of i)t.unshift(Jl(a))}else n!==void 0&&t.push(Jl(n));return t}static _$Eu(n,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return zp(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,t,i){this._$AK(n,i)}_$ET(n,t){let i=this.constructor.elementProperties.get(n),a=this.constructor._$Eu(n,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:Ba).toAttribute(t,i.type);this._$Em=n,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(n,t){let i=this.constructor,a=i._$Eh.get(n);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Ba;this._$Em=a;let s=o.fromAttribute(t,r.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(n,t,i,a=!1,r){if(n!==void 0){let o=this.constructor;if(a===!1&&(r=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??vo)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,t,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??t??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(t=void 0),this._$AL.set(n,t)),a===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,s=this[a];o!==!0||this._$AL.has(a)||s===void 0||this.C(a,void 0,r,s)}}let n=!1,t=this._$AL;try{n=this.shouldUpdate(t),n?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(t)}willUpdate(n){}_$AE(n){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(n){}firstUpdated(n){}};sn.elementStyles=[],sn.shadowRootOptions={mode:"open"},sn[Ga("elementProperties")]=new Map,sn[Ga("finalized")]=new Map,tw?.({ReactiveElement:sn}),(wo.reactiveElementVersions??=[]).push("2.1.2");var Ql=globalThis,Bp=e=>e,ko=Ql.trustedTypes,Vp=ko?ko.createPolicy("lit-html",{createHTML:e=>e}):void 0,ed="$lit$",ln=`lit$${Math.random().toFixed(9).slice(2)}$`,td="?"+ln,nw=`<${td}>`,oi=document,Ua=()=>oi.createComment(""),Wa=e=>e===null||typeof e!="object"&&typeof e!="function",nd=Array.isArray,Yp=e=>nd(e)||typeof e?.[Symbol.iterator]=="function",Zl=`[ 	
\f\r]`,Va=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Up=/-->/g,Wp=/>/g,ai=RegExp(`>|${Zl}(?:([^\\s"'>=/]+)(${Zl}*=${Zl}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Kp=/'/g,jp=/"/g,Xp=/^(?:script|style|textarea|title)$/i,id=e=>(n,...t)=>({_$litType$:e,strings:n,values:t}),h=id(1),v=id(2),_E=id(3),dn=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),qp=new WeakMap,ri=oi.createTreeWalker(oi,129);function Jp(e,n){if(!nd(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Vp!==void 0?Vp.createHTML(n):n}var Zp=(e,n)=>{let t=e.length-1,i=[],a,r=n===2?"<svg>":n===3?"<math>":"",o=Va;for(let s=0;s<t;s++){let l=e[s],c,d,u=-1,p=0;for(;p<l.length&&(o.lastIndex=p,d=o.exec(l),d!==null);)p=o.lastIndex,o===Va?d[1]==="!--"?o=Up:d[1]!==void 0?o=Wp:d[2]!==void 0?(Xp.test(d[2])&&(a=RegExp("</"+d[2],"g")),o=ai):d[3]!==void 0&&(o=ai):o===ai?d[0]===">"?(o=a??Va,u=-1):d[1]===void 0?u=-2:(u=o.lastIndex-d[2].length,c=d[1],o=d[3]===void 0?ai:d[3]==='"'?jp:Kp):o===jp||o===Kp?o=ai:o===Up||o===Wp?o=Va:(o=ai,a=void 0);let f=o===ai&&e[s+1].startsWith("/>")?" ":"";r+=o===Va?l+nw:u>=0?(i.push(c),l.slice(0,u)+ed+l.slice(u)+ln+f):l+ln+(u===-2?s:f)}return[Jp(e,r+(e[t]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},Ka=class e{constructor({strings:n,_$litType$:t},i){let a;this.parts=[];let r=0,o=0,s=n.length-1,l=this.parts,[c,d]=Zp(n,t);if(this.el=e.createElement(c,i),ri.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(a=ri.nextNode())!==null&&l.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(let u of a.getAttributeNames())if(u.endsWith(ed)){let p=d[o++],f=a.getAttribute(u).split(ln),g=/([.?@])?(.*)/.exec(p);l.push({type:1,index:r,name:g[2],strings:f,ctor:g[1]==="."?Co:g[1]==="?"?So:g[1]==="@"?To:li}),a.removeAttribute(u)}else u.startsWith(ln)&&(l.push({type:6,index:r}),a.removeAttribute(u));if(Xp.test(a.tagName)){let u=a.textContent.split(ln),p=u.length-1;if(p>0){a.textContent=ko?ko.emptyScript:"";for(let f=0;f<p;f++)a.append(u[f],Ua()),ri.nextNode(),l.push({type:2,index:++r});a.append(u[p],Ua())}}}else if(a.nodeType===8)if(a.data===td)l.push({type:2,index:r});else{let u=-1;for(;(u=a.data.indexOf(ln,u+1))!==-1;)l.push({type:7,index:r}),u+=ln.length-1}r++}}static createElement(n,t){let i=oi.createElement("template");return i.innerHTML=n,i}};function si(e,n,t=e,i){if(n===dn)return n;let a=i!==void 0?t._$Co?.[i]:t._$Cl,r=Wa(n)?void 0:n._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,t,i)),i!==void 0?(t._$Co??=[])[i]=a:t._$Cl=a),a!==void 0&&(n=si(e,a._$AS(e,n.values),a,i)),n}var $o=class{constructor(n,t){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:t},parts:i}=this._$AD,a=(n?.creationScope??oi).importNode(t,!0);ri.currentNode=a;let r=ri.nextNode(),o=0,s=0,l=i[0];for(;l!==void 0;){if(o===l.index){let c;l.type===2?c=new Qi(r,r.nextSibling,this,n):l.type===1?c=new l.ctor(r,l.name,l.strings,this,n):l.type===6&&(c=new Eo(r,this,n)),this._$AV.push(c),l=i[++s]}o!==l?.index&&(r=ri.nextNode(),o++)}return ri.currentNode=oi,a}p(n){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,t),t+=i.strings.length-2):i._$AI(n[t])),t++}},Qi=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,t,i,a){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=n,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,t=this._$AM;return t!==void 0&&n?.nodeType===11&&(n=t.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,t=this){n=si(this,n,t),Wa(n)?n===m||n==null||n===""?(this._$AH!==m&&this._$AR(),this._$AH=m):n!==this._$AH&&n!==dn&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Yp(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==m&&Wa(this._$AH)?this._$AA.nextSibling.data=n:this.T(oi.createTextNode(n)),this._$AH=n}$(n){let{values:t,_$litType$:i}=n,a=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=Ka.createElement(Jp(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{let r=new $o(a,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(n){let t=qp.get(n.strings);return t===void 0&&qp.set(n.strings,t=new Ka(n)),t}k(n){nd(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,a=0;for(let r of n)a===t.length?t.push(i=new e(this.O(Ua()),this.O(Ua()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(n=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);n!==this._$AB;){let i=Bp(n).nextSibling;Bp(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},li=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,t,i,a,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=n,this.name=t,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=m}_$AI(n,t=this,i,a){let r=this.strings,o=!1;if(r===void 0)n=si(this,n,t,0),o=!Wa(n)||n!==this._$AH&&n!==dn,o&&(this._$AH=n);else{let s=n,l,c;for(n=r[0],l=0;l<r.length-1;l++)c=si(this,s[i+l],t,l),c===dn&&(c=this._$AH[l]),o||=!Wa(c)||c!==this._$AH[l],c===m?n=m:n!==m&&(n+=(c??"")+r[l+1]),this._$AH[l]=c}o&&!a&&this.j(n)}j(n){n===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Co=class extends li{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===m?void 0:n}},So=class extends li{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==m)}},To=class extends li{constructor(n,t,i,a,r){super(n,t,i,a,r),this.type=5}_$AI(n,t=this){if((n=si(this,n,t,0)??m)===dn)return;let i=this._$AH,a=n===m&&i!==m||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,r=n!==m&&(i===m||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},Eo=class{constructor(n,t,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){si(this,n)}},Qp={M:ed,P:ln,A:td,C:1,L:Zp,R:$o,D:Yp,V:si,I:Qi,H:li,N:So,U:To,B:Co,F:Eo},iw=Ql.litHtmlPolyfillSupport;iw?.(Ka,Qi),(Ql.litHtmlVersions??=[]).push("3.3.3");var Ro=(e,n,t)=>{let i=t?.renderBefore??n,a=i._$litPart$;if(a===void 0){let r=t?.renderBefore??null;i._$litPart$=a=new Qi(n.insertBefore(Ua(),r),r,void 0,t??{})}return a._$AI(e),a};var ad=globalThis,Rn=class extends sn{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Ro(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return dn}};Rn._$litElement$=!0,Rn.finalized=!0,ad.litElementHydrateSupport?.({LitElement:Rn});var aw=ad.litElementPolyfillSupport;aw?.({LitElement:Rn});(ad.litElementVersions??=[]).push("4.2.2");var rw={attribute:!0,type:String,converter:Ba,reflect:!1,hasChanged:vo},ow=(e=rw,n,t)=>{let{kind:i,metadata:a}=t,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(t.name,e),i==="accessor"){let{name:o}=t;return{set(s){let l=n.get.call(this);n.set.call(this,s),this.requestUpdate(o,l,e,!0,s)},init(s){return s!==void 0&&this.C(o,void 0,e,s),s}}}if(i==="setter"){let{name:o}=t;return function(s){let l=this[o];n.call(this,s),this.requestUpdate(o,l,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ea(e){return(n,t)=>typeof t=="object"?ow(e,n,t):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,n,t)}function N(e){return ea({...e,state:!0,attribute:!1})}var hd=["rectangular","circular","corner"],Hn=["small","medium","large","xlarge"],de=[...hd,...Hn];function ld(e){return de.includes(e)}var ue={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34},small:{width:162.67,height:162.67},medium:{width:344.67,height:162.67},large:{width:344.67,height:360},xlarge:{width:344.67,height:557.33}},ja=["rectangular","circular","corner","inline",...Hn];var fd=64;function wh(e,n){let t=new Set(e);for(let i of n)t.add(i.slot);for(let i=0;i<fd;i++)if(!t.has(i))return i;return-1}function vh(e,n){let t=new Set(e);return n.filter(i=>i.kind!=="preset"||!t.has(i.slot))}function yi(e){return sw(e)?8:Hn.some(t=>e.supportedFamilies.includes(t))?7:hd.some(t=>!e.supportedFamilies.includes(t))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}function sw(e){if(e.elements.some(t=>t.kind==="list"))return!0;let n=!1;return jt(e,t=>{(t.kind.kind==="item"||t.kind.kind==="listStat")&&(n=!0)}),n}function md(e){return e==="standard"||e==="condensed"||e==="compressed"||e==="expanded"?e:void 0}var gd=4,wt=.5;function er(e){return Number.isFinite(e)?Math.min(1,Math.max(wt,e)):wt}var lw=["none","dot","triangle"],dw=["straight","smooth","step"],cw=["light","medium","strong"],uw={light:.05,medium:.1,strong:.2};function eh(e){return typeof e=="string"&&dw.includes(e)?e:"straight"}var pw=["flat","fade"],hw=["none","all","auto"],kh=4,cn="#FFFFFF33";function An(e){return typeof e=="string"&&pw.includes(e)?e:"flat"}function dd(e){return typeof e=="string"&&hw.includes(e)?e:"none"}function cd(e){return typeof e!="number"||!Number.isFinite(e)?0:Math.max(0,Math.min(kh,Math.round(e)))}function ia(e,n){return e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function Mn(e){return typeof e=="string"&&e!==""?e:cn}var fw=1,mw=12;function Ot(e){if(!(typeof e!="number"||!Number.isFinite(e)))return Math.max(fw,Math.min(mw,e))}function _o(e){return e==="all"?"all":"auto"}var _n=1,Nn=3,No=.25,Do=4;function bi(e){return typeof e!="number"||!Number.isFinite(e)?Nn:Math.max(1,Math.min(kh,Math.round(e)))}function xi(e){return typeof e!="number"||!Number.isFinite(e)?_n:Math.max(No,Math.min(Do,e))}var gw=["all","top"],aa=1.2;function In(e){return typeof e!="number"||!Number.isFinite(e)?aa:Math.max(0,e)}function Ln(e){return typeof e=="string"&&gw.includes(e)?e:"all"}function Ft(e){if(typeof e=="string")return cw.includes(e)?e:void 0;if(e===3||e===5)return"light";if(e===7)return"medium";if(e===9)return"strong"}function $h(e,n){if(n===void 0||e<2)return 0;let t=Math.max(3,Math.floor(e*uw[n]+.5));return t%2===0?t+1:t}var yw=[["history","Recorded history"],["statistics","Long-term statistics"]],Po=[["5minute","5 min"],["hour","Hour"],["day","Day"],["week","Week"],["month","Month"]],yd=[["mean","Mean"],["min","Min"],["max","Max"],["change","Change"],["sum","Total"]],bd="history",tr="hour",nr="mean",Bt=[["latest","Newest reading"],["first","First reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["delta","Change"],["sum","Total"],["trend","Trend arrow"],["top","Top of the scale"],["bottom","Bottom of the scale"]],zo=[["clock","Time"],["date","Date"],["weekday","Weekday"],["dateTime","Weekday and time"]],Ch=[["count","Items shown"],["total","Items in total"]],ir={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},Vt=[["highest","Highest reading"],["lowest","Lowest reading"],["now","Now"],["first","First reading"],["latest","Newest reading"],["threshold","Threshold"],["zero","Zero"]];function un(e){return e!=="threshold"&&e!=="zero"}var Oo=[["above","Above"],["on","On"],["below","Inside"],["bottom","At the bottom"],["through","Through"]];function bw(e){return Vt.some(([n])=>n===e)}function xw(e){return Oo.some(([n])=>n===e)}function ww(e){if(!U(e)||typeof e.layer!="string"||e.layer==="")return;let n={layer:e.layer.toUpperCase(),at:bw(e.at)?e.at:"highest",place:xw(e.place)?e.place:"above"},t=Z(e.dx,0),i=Z(e.dy,0);return t!==0&&(n.dx=t),i!==0&&(n.dy=i),n}function Fo(e,n){let t=ww(e.chartAnchor);t!==void 0&&(n.chartAnchor=t)}function Ao(e,n){e.chartAnchor!==void 0&&(n.chartAnchor=vw(e.chartAnchor))}function vw(e){let n={layer:e.layer,at:e.at,place:e.place};return e.dx!==void 0&&e.dx!==0&&(n.dx=Y(e.dx)),e.dy!==void 0&&e.dy!==0&&(n.dy=Y(e.dy)),n}var Sh=[["linear","Linear"],["radial","Radial"]],xd=2,Go=4;function qa(e){if(!U(e)||!Array.isArray(e.stops))return;let n=[];for(let a of e.stops){if(n.length===Go)break;if(!U(a))continue;let r=ce(a.colorHex);r===void 0||r===""||n.push({at:Mt(Z(a.at,0)),colorHex:r})}if(n.length<xd)return;let t={kind:e.kind==="radial"?"radial":"linear",stops:n},i=Z(e.angle,0);return t.kind==="linear"&&i!==0&&(t.angle=i),t}function Io(e){let n={kind:e.kind,stops:e.stops.map(t=>({at:Y(t.at),colorHex:t.colorHex}))};return e.kind==="linear"&&e.angle!==void 0&&e.angle!==0&&(n.angle=Y(e.angle)),n}function Ut(e,n){let t=[...e.stops].sort((r,o)=>r.at-o.at),i=t[0],a=t[t.length-1];if(n<=i.at)return i.colorHex;if(n>=a.at)return a.colorHex;for(let r=1;r<t.length;r++){let o=t[r],s=t[r-1];if(n>o.at)continue;let l=o.at-s.at;return kw(s.colorHex,o.colorHex,l<=0?0:(n-s.at)/l)}return a.colorHex}function kw(e,n,t){let i=l=>{let c=l.replace(/^#/,""),d=c.length===6?`${c}FF`:c.padEnd(8,"F");return[0,2,4,6].map(u=>parseInt(d.slice(u,u+2),16)||0)},a=i(e),r=i(n),o=a.map((l,c)=>Math.round(l+(r[c]-l)*t)),s=o.map(l=>Math.max(0,Math.min(255,l)).toString(16).padStart(2,"0").toUpperCase());return o[3]===255?`#${s[0]}${s[1]}${s[2]}`:`#${s.join("")}`}function Th(e,n){let t=e.replace(/^#/,""),i=t.length>=6?t.slice(0,6).toUpperCase():"FFFFFF",a=t.length>=8?parseInt(t.slice(6,8),16):255,r=Math.min(255,Math.max(0,Math.round(a*n)));return r===255?`#${i}`:`#${i}${r.toString(16).padStart(2,"0").toUpperCase()}`}var Bo=[["up","Up"],["down","Down"],["left","Left"],["right","Right"]],ar="up",rr=0,or=100,Eh=.25;function Vo(e){return{value:e,minValue:rr,maxValue:or,direction:ar}}function $w(e){if(!U(e))return;let n={value:U(e.value)?ke(e.value):K("50"),minValue:Z(e.minValue,rr),maxValue:Z(e.maxValue,or),direction:di(e.direction,Bo.map(([i])=>i),ar)};U(e.minSource)&&(n.minSource=ke(e.minSource)),U(e.maxSource)&&(n.maxSource=ke(e.maxSource));let t=ce(e.trackColorHex);return t!==void 0&&t!==""&&(n.trackColorHex=t),n}function Cw(e){let n={value:fe(e.value)};return e.minValue!==rr&&(n.minValue=Y(e.minValue)),e.maxValue!==or&&(n.maxValue=Y(e.maxValue)),e.minSource!==void 0&&(n.minSource=fe(e.minSource)),e.maxSource!==void 0&&(n.maxSource=fe(e.maxSource)),e.direction!==ar&&(n.direction=e.direction),e.trackColorHex!==void 0&&(n.trackColorHex=e.trackColorHex),n}function th(e,n){let t=$w(e.level);t!==void 0&&(n.level=t)}function nh(e,n){e.level!==void 0&&(n.level=Cw(e.level))}var Sw=["circular","rectangular","corner","small","medium","large","xlarge"];function Uo(e){return Sw.includes(e)}var Wo=.1,Ko=3,sr=.5,wd=10,vd=360,je=120,kd=-2,$d=20;function Tw(e){if(!U(e))return;let n=Z(e.radius,NaN);if(!Number.isFinite(n))return;let t={radius:Math.min(Ko,Math.max(Wo,n))},i=Z(e.angle,0);i!==0&&(t.angle=i);let a=lr(Z(e.sweep,je));a!==je&&(t.sweep=a);let r=dr(Z(e.spacing,0));return r!==0&&(t.spacing=r),e.flip===!0&&(t.flip=!0),t}function lr(e){if(!Number.isFinite(e)||e===0)return je;let n=Math.min(vd,Math.max(wd,Math.abs(e)));return e<0?-n:n}function dr(e){return Number.isFinite(e)?Math.min($d,Math.max(kd,e)):0}function Ew(e){let n={radius:Y(e.radius)};return e.angle!==void 0&&e.angle!==0&&(n.angle=Y(e.angle)),e.sweep!==void 0&&e.sweep!==je&&(n.sweep=Y(e.sweep)),e.spacing!==void 0&&e.spacing!==0&&(n.spacing=Y(e.spacing)),e.flip===!0&&(n.flip=!0),n}var Ye={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setFontDesign:"fontDesign",setFontWidth:"fontWidth",setItalic:"italic",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},Cd=12,fi=12,cr="#000000",ra={colorHex:cr,radius:3,dx:0,dy:1};function Sd(e){return Number.isFinite(e)?Math.min(Cd,Math.max(0,e)):0}function Xa(e){return Number.isFinite(e)?Math.min(fi,Math.max(-fi,e)):0}function ur(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):1}function Rh(e){return e.countdown===!0?!1:e.coloring==="bands"&&(e.bands?.length??0)>0||e.highlight!==void 0&&e.highlight!=="none"}function It(e){return e.countdown!==!0&&(e.parts?.length??0)>0}function wi(e){if(e.kind.kind==="literal")return(e.format?.prefix??"")+e.kind.value+(e.format?.suffix??"")}function pr(e){let n=d=>d.value.kind.kind!=="literal",t=(d,u)=>e.slice(d,u).map(p=>wi(p.value)??"").join(""),i=e.findIndex(n);if(i<0)return K(t(0,e.length));let a=e.findIndex((d,u)=>u>i&&n(d)),r=e[i].value,o={...r.format},s=t(0,i)+(o.prefix??""),l=(o.suffix??"")+t(i+1,a<0?e.length:a);delete o.prefix,delete o.suffix,s!==""&&(o.prefix=s),l!==""&&(o.suffix=l);let c={kind:structuredClone(r.kind)};return We(o)||(c.format=o),c}function Mh(e){It(e)&&(e.value=pr(e.parts))}var hr="svg:custom",Rw="0 0 24 24",ih=8*1024;function fr(e){return e.symbol.kind.kind==="literal"&&e.symbol.kind.value===hr}function Td(e){if(e===void 0)return;let n=e.trim();if(!(n===""||n===Rw))return n}function Fh(e){let n={minX:0,minY:0,width:24,height:24};if(e===void 0)return n;let t=e.trim().split(/[\s,]+/).filter(l=>l!=="");if(t.length!==4)return n;let i=t.map(l=>Number(l));if(!i.every(l=>Number.isFinite(l)))return n;let[a,r,o,s]=i;return!(o>0)||!(s>0)?n:{minX:a,minY:r,width:o,height:s}}var Mw=/^[MmLlHhVvCcSsQqTtAaZz0-9eE+\-.,\s]+$/;function Ah(e){let n=e.trim();if(n==="")return{ok:!1,error:"Paste an SVG path or the whole <svg> markup."};let t=n.startsWith("<"),i=t?Fw(n):n.replace(/\s+/g," ").trim();if(t&&i==="")return{ok:!1,error:"That markup has no <path> in it. Only paths can be drawn on a watch face."};if(!Mw.test(i))return{ok:!1,error:"That is not an SVG path: it holds characters no path command uses."};if(!/[Mm]/.test(i))return{ok:!1,error:"An SVG path starts with a move command (M)."};let a=new TextEncoder().encode(i).length;if(a>ih)return{ok:!1,error:`That drawing is ${Math.ceil(a/1024)} KB of path and the limit is ${ih/1024} KB. Simplify it in a vector editor first.`};let r=t?Td(Aw(n)):void 0;return r===void 0?{ok:!0,path:i}:{ok:!0,path:i,viewBox:r}}function Fw(e){let n=[];for(let t of e.matchAll(/<path\b[^>]*>/gi)){let i=/\sd\s*=\s*("([^"]*)"|'([^']*)')/i.exec(t[0]),a=(i?.[2]??i?.[3]??"").replace(/\s+/g," ").trim();a!==""&&n.push(a)}return n.join(" ")}function Aw(e){let n=/<svg\b[^>]*>/i.exec(e);if(!n)return;let t=/\sviewBox\s*=\s*("([^"]*)"|'([^']*)')/i.exec(n[0]),i=(t?.[2]??t?.[3]??"").replace(/\s+/g," ").trim();return i===""?void 0:i}var oa="#FFFFFF",pn="#FFFFFF80",hn=3,jo=60,qo=8,fn="#FFFFFF",mn=8,Yo=4,Xo=20;function mr(e){if(!Number.isFinite(e))return"";let n=e.toFixed(2);return n.includes(".")&&(n=n.replace(/0+$/,"").replace(/\.$/,"")),n==="-0"?"0":n}function Ed(){return{count:0,length:hn,colorHex:pn,majorEvery:0}}function Rd(){return{show:!1,size:mn,colorHex:fn}}function Jo(e){return e.count===0&&e.length===hn&&ia(e.colorHex,pn)&&e.majorEvery===0}function Zo(e){return!e.show&&e.size===mn&&ia(e.colorHex,fn)}function Iw(e){if(!U(e))return;let n={count:Math.max(0,Math.min(jo,Math.round(Z(e.count,0)))),length:Math.max(1,Math.min(qo,Z(e.length,hn))),colorHex:X(e.colorHex,pn),majorEvery:Math.max(0,Math.round(Z(e.majorEvery,0)))};return Jo(n)?void 0:n}function Lw(e){let n={};return e.count!==0&&(n.count=Math.round(e.count)),e.length!==hn&&(n.length=Y(e.length)),ia(e.colorHex,pn)||(n.colorHex=e.colorHex),e.majorEvery!==0&&(n.majorEvery=Math.round(e.majorEvery)),n}function Hw(e){if(!U(e))return;let n={show:e.show===!0,size:Math.max(Yo,Math.min(Xo,Z(e.size,mn))),colorHex:X(e.colorHex,fn)};return Zo(n)?void 0:n}function _w(e){let n={};return e.show&&(n.show=!0),e.size!==mn&&(n.size=Y(e.size)),ia(e.colorHex,fn)||(n.colorHex=e.colorHex),n}function ah(e){return typeof e=="string"&&lw.includes(e)}function Nw(e){return e==="none"?{high:"none",low:"none"}:e==="pointer"?{high:"triangle",low:"dot"}:{high:"dot",low:"dot"}}function Ja(e){let n=Nw(e.marker);return{high:e.highMarker??n.high,low:e.lowMarker??n.low}}function Ih(e){return e.high==="triangle"?"pointer":e.high!=="none"||e.low!=="none"?"dot":"none"}function Lh(e){return e.high==="none"&&e.low==="none"||e.high==="dot"&&e.low==="dot"||e.high==="triangle"&&e.low==="dot"}function Dw(e,n){e.marker=Ih(n),Lh(n)?(delete e.highMarker,delete e.lowMarker):(e.highMarker=n.high,e.lowMarker=n.low)}var Qo=24,es=6,Za="#FFFFFF";function Md(e){if(e.style!=="bars")return 0;let n=e.barBorderWidth;return typeof n!="number"||!Number.isFinite(n)?0:Math.min(Math.max(n,0),es)}function Hh(e,n,t,i,a){if(a!==void 0)return{fill:a,border:a};if(!gr(e))return{fill:e.fillColorHex??i,border:e.barBorderColorHex??Za};let r=t.find(s=>n<=s.upTo),o=r?{color:r.colorHex,fill:r.fillColorHex,border:r.borderColorHex}:{color:e.bandAboveColorHex,fill:e.bandAboveFillColorHex,border:e.bandAboveBorderColorHex};return{fill:o.fill??e.fillColorHex??o.color,border:o.border??e.barBorderColorHex??Za}}var gt="#FF6B35",yt="#32D74B",Fd="#32D74B",xe="#FF453A",Ad="#FF453A",Id="#FFFFFF99";function Dn(e){return[...e.bands].sort((n,t)=>n.upTo-t.upTo)}function gr(e){return e.coloring==="bands"&&e.bands.length>0}function ts(e,n,t){for(let i of n)if(e<=i.upTo)return i.colorHex;return t}function yr(e,n){let t=Math.abs(n),i=t>=10?0:t>=1?1:2;return e.toFixed(i)}function _h(e){return e>0?"\u2191":e<0?"\u2193":"\u2192"}var vi=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],ns=360,is=10080,br=[...vi,{minutes:43200,label:"Last 30 days"},{minutes:129600,label:"Last 90 days"},{minutes:527040,label:"Last year"}],Ld=366*24*60,as=2,gn=120,Hd=0;function _d(e){let n=Math.round(e.historyPoints);return Number.isFinite(n)?n<1?Hd:Math.max(as,Math.min(gn,n)):24}function ki(e){return Dd(e)!==void 0?!0:Nd(e)!==void 0&&_d(e)>0}function Nd(e){if(e.source==="history")return Nh(e)}function Dd(e){if(e.source==="statistics")return Nh(e)}function Nh(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Wt(e){let n=Nd(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${_d(e)}${e.gaps===!0?"|gaps":""}`}function Kt(e){let n=Dd(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${e.statPeriod}|${e.statType}${e.gaps===!0?"|gaps":""}`}function Dh(e){return[...Pd(e).map(t=>t.key),...zd(e).map(t=>t.key)].sort().join(";")}function Pd(e){let n=new Map,t=i=>{n.has(i.key)||n.set(i.key,i)};for(let i of e.elements)if(i.kind==="chart"){let a=Wt(i.payload),r=Nd(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:Math.round(i.payload.historyMinutes),points:_d(i.payload),mode:"numeric",gaps:i.payload.gaps===!0})}else if(i.kind==="timeline"){let a=st(i.payload),r=Wh(i.payload);if(a===void 0||r===void 0||Gd(i.payload))continue;let o=Ci(i.payload);t({key:a,entityId:r,minutes:Lt(i.payload),points:Gn,mode:"states",gaps:!1,...o.length>0?{entities:o,combine:i.payload.aggregate?.combine??yn}:{}})}return[...n.values()]}function zd(e){let n=new Map;for(let t of e.elements){if(t.kind!=="chart")continue;let i=Kt(t.payload),a=Dd(t.payload);i===void 0||a===void 0||n.has(i)||n.set(i,{key:i,entityId:a,minutes:Math.round(t.payload.historyMinutes),period:t.payload.statPeriod,type:t.payload.statType,gaps:t.payload.gaps===!0})}return[...n.values()]}var sa=2,la=20,yn="any",rs="binary_sensor",Ph=[["any","Any"],["all","All"]];function zh(e){return e==="all"?"On when all of them are active":"On when any of them is active"}var Oh=[["auto","Auto"],["h12","12 hour"],["h24","24 hour"]],Gh=[["auto","Auto"],["always","Always"],["never","Never"]];function rd(e){return e==="h12"||e==="h24"?e:pi}function od(e){return e==="always"||e==="never"?e:hi}function Pw(e){return e.timeLabelCount!==void 0?Gt(e.timeLabelCount):e.timeLabels==="ends"?2:e.timeLabels==="four"?4:ui}function Gt(e){let n=Number(e);return Number.isFinite(n)?Math.max(0,Math.min($i,Math.round(n))):ui}function xr(e){return e<=0?[]:e===1?[1]:Array.from({length:e},(n,t)=>t/(e-1))}var Pn="#8E8E93",Bh=1,zw="#000000",Ow=2,Gw=1440,Od=60,ui=0,bt=9,xt="#8E8E93",pi="auto",hi="auto",Vh=4,$i=12,zn=1,On=20,os=4,Gn=120;function Uh(e,n,t){let i=e.trim().toLowerCase();for(let a of n)if(a.match.trim().toLowerCase()===i)return a.colorHex;return t}function Lt(e){let n=Math.round(e.historyMinutes);return Number.isFinite(n)?Math.max(1,Math.min(is,n)):Od}function Wh(e){return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Ci(e){let n=e.aggregate?.entities??[],t=[];for(let i of n){let a=typeof i=="string"?i.trim():"";a!==""&&!t.includes(a)&&t.push(a)}return t}function da(e){let n=[...e.aggregate?.entities??[]];for(;n.length<sa;)n.push("");return n}function Gd(e){return Ci(e).length>la}function st(e){let n=Wh(e);if(n===void 0)return;let t=`${n}|${Lt(e)}|${Gn}|states`,i=Ci(e);return i.length===0?t:`${t}|${e.aggregate?.combine??yn}:${i.join(",")}`}var Bw={on:"#FF9F0A",off:"#0A84FF",open:"#FF453A",closed:"#32D74B",opening:"#FFD60A",closing:"#FFD60A",home:"#32D74B",not_home:"#0A84FF",locked:"#32D74B",unlocked:"#FF453A",jammed:"#BF5AF2",playing:"#32D74B",paused:"#FF9F0A",idle:"#0A84FF",standby:"#5E5CE6",heat:"#FF9F0A",cool:"#64D2FF",heat_cool:"#BF5AF2",dry:"#FFD60A",fan_only:"#5E5CE6",auto:"#BF5AF2",cleaning:"#32D74B",docked:"#0A84FF",returning:"#64D2FF",error:"#FF453A",disarmed:"#32D74B",armed_home:"#0A84FF",armed_away:"#FF9F0A",armed_night:"#5E5CE6",arming:"#FFD60A",pending:"#FFD60A",triggered:"#FF453A",unavailable:"#48484A",unknown:"#48484A"},ca={binary_sensor:["on","off"],switch:["on","off"],light:["on","off"],input_boolean:["on","off"],fan:["on","off"],humidifier:["on","off"],siren:["on","off"],cover:["open","closed","opening","closing"],lock:["locked","unlocked","jammed"],person:["home","not_home"],device_tracker:["home","not_home"],media_player:["playing","paused","idle","off"],climate:["heat","cool","heat_cool","dry","fan_only","auto","off"],vacuum:["cleaning","docked","returning","idle","error"],alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","arming","pending","triggered"]};function At(e){return Bw[e.trim().toLowerCase()]??Pn}var Vw=["door","garage_door","window","opening"];function na(e,n){let t=(n??"").trim().toLowerCase(),i=e==="binary_sensor"&&Vw.includes(t),a=o=>At(i&&o==="on"?"open":o);return[...ca[e]??[],"unavailable","unknown"].map(o=>({id:re(),match:o,colorHex:a(o)}))}var wr=48*1024,ua=6,ss=9,Uw=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function ls(e){let n=e.trim();if(n==="")return 0;let t=n.endsWith("==")?2:n.endsWith("=")?1:0;return Math.max(0,Math.floor(n.length*3/4)-t)}function Si(e){return e.source==="inline"&&e.data!==void 0?ls(e.data):0}function Kh(e){if(e.source!=="inline")return;let n=e.data;if(!(n===void 0||n===""))return`data:${e.format==="jpeg"?"image/jpeg":"image/png"};base64,${n}`}function ds(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function Ww(e,n){let t=n<=.5,i=e<=.5;return t?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var Bd={top:0,left:0,bottom:0,right:0};function cs(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var jh=[["down","Down"],["across","Across"]],Vd=[["name","Name"],["state","State"],["lastChanged","Last changed"]],Ud=[["open","To do"],["done","Done"],["all","Everything"]],Wd=[["list","List order"],["due","Due"]],Kd=[["hourly","Hourly"],["daily","Daily"],["twiceDaily","Twice daily"]],jd=[["entities","Entities"],["attribute","Attribute"],["template","Template"],["calendar","Calendar"],["todo","To-do list"],["forecast","Forecast"]],qd=1,Yd=12,vr=4,Xd=1,Jd=4,kr=1,$r=2,Zd=12,pa=8,us=5,Qd=1,ec=336,Cr=24,qh=["list","chart","timeline","chartTimes","chartDots","chartGrid","imageTime"],Ht=["rectangular","small","medium","large","xlarge"];function ps(e){let n=Xe(e.rows);if(e.direction==="across")return{lines:1,columns:n};let t=Math.min(Sr(e.columns),n);return{lines:Math.ceil(n/t),columns:t}}function Xe(e){let n=typeof e=="number"&&Number.isFinite(e)?Math.round(e):vr;return Math.min(Yd,Math.max(qd,n))}function Sr(e){let n=typeof e=="number"&&Number.isFinite(e)?Math.round(e):kr;return Math.min(Jd,Math.max(Xd,n))}function Ti(e){let n=typeof e=="number"&&Number.isFinite(e)?e:$r;return Math.min(Zd,Math.max(0,n))}function hs(e){let n=typeof e=="number"&&Number.isFinite(e)?Math.round(e):Cr;return Math.min(ec,Math.max(Qd,n))}var Kw=["toggleEntity","runScene","runScript","addTodo","runHTTPAction"];function Yh(e){return Kw.includes(e)}function Xh(e){let n=(e??"").trim();if(n==="")return!0;try{let t=JSON.parse(n);return typeof t=="object"&&t!==null&&!Array.isArray(t)}catch{return!1}}var tc=[["refresh","Refresh"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"],["callService","Call a service"]];function bn(e){let n=tc.find(([i])=>i===e.type)?.[1]??e.type;if(e.type==="callService"){let i=[e.serviceDomain,e.serviceName].filter(a=>a!=="").join(".");return i===""?n:`${n}: ${i}`}if(!("entityId"in e))return n;let t=e.displayName||e.entityId;return t?`${n}: ${t}`:n}function U(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function X(e,n=""){return typeof e=="string"?e:n}function Z(e,n){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:n}function Mt(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function Ya(e){return e==null?void 0:Z(e,0)}function ce(e){return typeof e=="string"?e:void 0}function di(e,n,t){return typeof e=="string"&&n.includes(e)?e:t}function ci(e,n,t){return n.some(([i])=>i===e)?e:t}var vt=class extends Error{};function Fn(e){if(typeof e.entityId!="string")throw new vt("entityId is required");let n={entityId:e.entityId,displayName:X(e.displayName),domain:X(e.domain)};return typeof e.iconName=="string"&&(n.iconName=e.iconName),n}function rh(e){if(!U(e))return;let n={};return e.decimals!==void 0&&e.decimals!==null&&(n.decimals=Z(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(n.multiply=Z(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(n.offset=Z(e.offset,0)),typeof e.prefix=="string"&&(n.prefix=e.prefix),typeof e.suffix=="string"&&(n.suffix=e.suffix),e.useEntityUnit===!0&&(n.useEntityUnit=!0),e.relativeTime===!0&&(n.relativeTime=!0),e.duration===!0&&(n.duration=!0),zo.some(([t])=>t===e.timestamp)&&(n.timestamp=e.timestamp),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(n.textCase=e.textCase),We(n)?void 0:n}function We(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&!e.duration&&e.timestamp===void 0&&e.textCase===void 0:!0}function Jh(e){let n=X(e.function,"count"),t=U(e.scope)?e.scope:{},i;if(t.kind==="entities")i={kind:"entities",entities:(Array.isArray(t.entities)?t.entities:[]).filter(U).map(Fn)};else{let r=o=>Array.isArray(o)?o.filter(s=>typeof s=="string"):[];i={kind:"filter",domains:r(t.domains),areaIds:r(t.areaIds),labelIds:r(t.labelIds),floorIds:r(t.floorIds)}}let a={function:n,scope:i};if(U(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:X(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function oh(e){switch(e.kind){case"literal":return{kind:"literal",value:X(e.value)};case"entityState":return{kind:"entityState",...Fn(e)};case"entityAttribute":return{kind:"entityAttribute",...Fn(e),attribute:X(e.attribute)};case"entityAge":return{kind:"entityAge",...Fn(e)};case"aggregate":return{kind:"aggregate",aggregate:Jh(U(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:ce(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:X(e.value)};case"named":return{kind:"named",id:X(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:X(e.layer).toUpperCase(),stat:Bt.some(([n])=>n===e.stat)?e.stat:"latest"};case"item":return{kind:"item",field:X(e.field)};case"listStat":return{kind:"listStat",layer:X(e.layer).toUpperCase(),stat:e.stat==="total"?"total":"count"};default:throw new vt(`unknown value kind ${String(e.kind)}`)}}function ke(e){if(!U(e))throw new vt("value must be an object");if(U(e.kind)){let i={kind:oh(e.kind)},a=rh(e.format);return a&&(i.format=a),i}let n={kind:oh(e)},t=rh(e.format);return t&&(n.format=t),n}function Zh(e){return U(e)?{x:Z(e.x,.25),y:Z(e.y,.25),width:Z(e.width,.5),height:Z(e.height,.5),rotationDegrees:Z(e.rotationDegrees,0)}:{...ir}}function jw(e){if(!U(e))return{kind:"isOn"};let n=X(e.kind,"isOn"),t={kind:n};switch(n){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=U(e.value)?ke(e.value):K("");break;case"between":case"timeBetween":t.value=U(e.value)?ke(e.value):K(""),t.upper=U(e.upper)?ke(e.upper):K("");break;case"matchesRegex":t.pattern=X(e.pattern);break;case"isOneOf":t.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return t}function sh(e){if(!U(e))return{kind:"show"};let n=X(e.kind,"show"),t={kind:n};switch(n){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=U(e.value)?ke(e.value):K("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=Z(e.number,0);break;case"setFontWeight":t.weight=ce(e.weight)??"regular";break;case"setFontDesign":t.design=ce(e.design)??"default";break;case"setFontWidth":t.width=md(ce(e.width))??"standard";break;case"setItalic":t.italic=e.italic!==!1;break;default:break}return t}function Qh(e){return Array.isArray(e)?e.filter(U).map(n=>{let t={id:X(n.id).toUpperCase(),cases:(Array.isArray(n.cases)?n.cases:[]).filter(U).map(i=>{let a=U(i.when)?i.when:{};return{id:X(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(U).map(r=>({id:X(r.id).toUpperCase(),value:U(r.value)?ke(r.value):K(""),comparison:jw(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(sh)}})};return Array.isArray(n.otherwise)&&(t.otherwise=n.otherwise.map(sh)),typeof n.partId=="string"&&n.partId!==""&&(t.partId=n.partId.toUpperCase()),t}):[]}function qw(e,n){return{baseColorHex:U(e)?X(e.baseColorHex,n):n}}function Ho(e){return Array.isArray(e)?e.filter(U).map(n=>{let t={id:X(n.id,re()),upTo:Z(n.upTo,0),colorHex:X(n.colorHex,"#FFFFFF")};return typeof n.fillColorHex=="string"&&(t.fillColorHex=n.fillColorHex),typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),t}):[]}function Lo(e){let n={id:e.id,upTo:Y(e.upTo),colorHex:e.colorHex};return e.fillColorHex!==void 0&&(n.fillColorHex=e.fillColorHex),e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n}function Yw(e){return Array.isArray(e)?e.filter(U).map(n=>{let t={id:X(n.id,re()).toUpperCase(),value:U(n.value)?ke(n.value):K("")};typeof n.colorHex=="string"&&(t.colorHex=n.colorHex);let i=ce(n.fontWeight);(i==="regular"||i==="medium"||i==="semibold"||i==="bold")&&(t.fontWeight=i),typeof n.fontSize=="number"&&(t.fontSize=n.fontSize);let a=ce(n.fontDesign);(a==="default"||a==="rounded"||a==="monospaced"||a==="serif")&&(t.fontDesign=a);let r=md(ce(n.fontWidth));r!==void 0&&(t.fontWidth=r),typeof n.italic=="boolean"&&(t.italic=n.italic),ce(n.coloring)==="bands"&&(t.coloring="bands");let o=Ho(n.bands);o.length>0&&(t.bands=o);let s=X(n.bandAboveColorHex,xe);return s!==xe&&(t.bandAboveColorHex=s),t}):[]}function Xw(e){if(Array.isArray(e.bands))return Ho(e.bands);if(typeof e.bandLowerBound!="number")return[];let n=U(e.colorSlot)?X(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:re(),upTo:e.bandLowerBound,colorHex:X(e.bandLowColorHex,Fd)},{id:re(),upTo:Z(e.bandUpperBound,100),colorHex:n}]}function Jw(e){return Array.isArray(e)?e.filter(U).map(n=>({id:X(n.id,re()).toUpperCase(),match:X(n.match,""),colorHex:X(n.colorHex,Pn)})):[]}function Zw(e){if(!U(e))return;let n=[];for(let t of Array.isArray(e.entities)?e.entities:[]){let i=typeof t=="string"?t.trim():"";i!==""&&!n.includes(i)&&n.push(i)}if(n.length!==0)return{entities:n,combine:e.combine==="all"?"all":yn}}function ud(e){let n=U(e)?e:{},t={entityId:X(n.entityId),displayName:X(n.displayName),domain:X(n.domain)};return typeof n.iconName=="string"&&(t.iconName=n.iconName),t}function lh(e){return Array.isArray(e)?e.map(ud).filter(n=>n.entityId!==""):[]}function Qw(e){let n=U(e)?e:{},t=i=>Array.isArray(i)?i.filter(a=>typeof a=="string"):[];switch(n.kind){case"attribute":return{kind:"attribute",...ud(n),attribute:X(n.attribute)};case"template":return{kind:"template",value:X(n.value)};case"calendar":return{kind:"calendar",entities:lh(n.entities),hours:hs(n.hours)};case"todo":return{kind:"todo",entities:lh(n.entities),status:ci(ce(n.status),Ud,"open"),sort:ci(ce(n.sort),Wd,"list")};case"forecast":return{kind:"forecast",...ud(n),type:ci(ce(n.type),Kd,"hourly")};default:{let i=Jh({scope:n.scope,stateFilter:n.stateFilter}),a={kind:"entities",scope:i.scope,sort:ci(ce(n.sort),Vd,"name"),descending:n.descending===!0,attributes:t(n.attributes)},r=X(n.deviceClass).trim();return r!==""&&(a.deviceClass=r),i.stateFilter&&(a.stateFilter=i.stateFilter),a}}}function ev(e){if(U(e))return{colorHex:X(e.colorHex,cr),radius:Sd(Z(e.radius,0)),dx:Xa(Z(e.dx,0)),dy:Xa(Z(e.dy,0))}}function ot(e,n){if(typeof e.id!="string")throw new vt("element id is required");let t={id:e.id.toUpperCase(),colorSlot:qw(e.colorSlot,n),rules:Qh(e.rules),frame:Zh(e.frame),isHidden:e.isHidden===!0},i=ur(Z(e.opacity,1));i!==1&&(t.opacity=i);let a=ev(e.shadow);return a!==void 0&&(t.shadow=a),t}function ef(e){let n=tv(e),t=e.payload;return typeof t.groupId=="string"&&t.groupId!==""&&(n.payload.groupId=t.groupId.toUpperCase()),typeof t.name=="string"&&t.name!==""&&(n.payload.name=t.name),t.accentGroup==="accent"&&(n.payload.accentGroup="accent"),n}function tv(e){if(!U(e)||!U(e.payload))throw new vt("element must have a payload");let n=e.payload;switch(e.kind){case"text":{let t={...ot(n,"#FFFFFF"),value:U(n.value)?ke(n.value):K(""),fontSize:Z(n.fontSize,14),fontWeight:ce(n.fontWeight)??"regular"};n.countdown===!0&&(t.countdown=!0),n.monospacedDigits===!0&&(t.monospacedDigits=!0);let i=typeof n.lineLimit=="number"?Math.round(n.lineLimit):1,a=Math.min(gd,Math.max(1,i));a>1&&(t.lineLimit=a);let r=ce(n.fontDesign);(r==="rounded"||r==="monospaced"||r==="serif")&&(t.fontDesign=r);let o=md(ce(n.fontWidth));o!==void 0&&o!=="standard"&&(t.fontWidth=o),n.italic===!0&&(t.italic=!0);let s=er(Z(n.minimumScale,wt));s!==wt&&(t.minimumScale=s);let l=ce(n.alignment);(l==="leading"||l==="trailing")&&(t.alignment=l),ce(n.coloring)==="bands"&&(t.coloring="bands");let c=Ho(n.bands);c.length>0&&(t.bands=c);let d=X(n.bandAboveColorHex,xe);d!==xe&&(t.bandAboveColorHex=d);let u=ce(n.highlight);(u==="highest"||u==="lowest"||u==="both")&&(t.highlight=u);let p=X(n.highColorHex,gt);p!==gt&&(t.highColorHex=p);let f=X(n.lowColorHex,yt);f!==yt&&(t.lowColorHex=f);let g=Yw(n.parts);g.length>0&&(t.parts=g);let b=Tw(n.arc);return b!==void 0&&(t.arc=b),Fo(n,t),{kind:"text",payload:t}}case"icon":{let t={...ot(n,"#FFFFFF"),symbol:U(n.symbol)?ke(n.symbol):K("lightbulb"),size:Z(n.size,14)},i=ce(n.path);i!==void 0&&i!==""&&(t.path=i);let a=Td(ce(n.viewBox));return a!==void 0&&(t.viewBox=a),th(n,t),Fo(n,t),{kind:"icon",payload:t}}case"gauge":{let t={...ot(n,"#FFFFFF"),value:U(n.value)?ke(n.value):K("50"),minValue:Z(n.minValue,0),maxValue:Z(n.maxValue,100),style:ce(n.style)??"arc",lineWidth:Z(n.lineWidth,4),trackColorHex:X(n.trackColorHex,"#FFFFFF40"),coloring:ce(n.coloring)??"uniform",bands:Ho(n.bands),bandAboveColorHex:X(n.bandAboveColorHex,xe),thresholdColorHex:X(n.thresholdColorHex,oa)},i=Ya(n.thresholdValue);i!==void 0&&(t.thresholdValue=i),U(n.total)&&(t.total=ke(n.total)),U(n.minSource)&&(t.minSource=ke(n.minSource)),U(n.maxSource)&&(t.maxSource=ke(n.maxSource));let a=qa(n.fill);a!==void 0&&(t.fill=a);let r=Iw(n.ticks);r!==void 0&&(t.ticks=r);let o=Hw(n.labels);return o!==void 0&&(t.labels=o),{kind:"gauge",payload:t}}case"chart":return{kind:"chart",payload:{...ot(n,"#FFFFFF"),value:U(n.value)?ke(n.value):K("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(Z(n.historyMinutes,0))),historyPoints:Math.round(Z(n.historyPoints,24)),source:ci(ce(n.source),yw,bd),statPeriod:ci(ce(n.statPeriod),Po,tr),statType:ci(ce(n.statType),yd,nr),style:di(n.style,["bars","line","area"],"bars"),limit:Math.max(0,Math.round(Z(n.limit,0))),takeFromEnd:n.takeFromEnd===!0,scale:di(n.scale,["auto","fixed"],"auto"),minValue:Z(n.minValue,0),maxValue:Z(n.maxValue,100),baseline:di(n.baseline,["lowest","zero"],"lowest"),barGap:Z(n.barGap,1.5),lineWidth:Z(n.lineWidth,2),highlight:di(n.highlight,["none","highest","lowest","both"],"none"),highColorHex:X(n.highColorHex,gt),lowColorHex:X(n.lowColorHex,yt),marker:typeof n.marker=="string"?di(n.marker,["none","dot","pointer"],"dot"):"pointer",...ah(n.highMarker)?{highMarker:n.highMarker}:{},...ah(n.lowMarker)?{lowMarker:n.lowMarker}:{},coloring:di(n.coloring,["uniform","bands"],"uniform"),bands:Xw(n),bandAboveColorHex:X(n.bandHighColorHex,X(n.bandAboveColorHex,xe)),fillBands:n.fillBands===!0,...eh(n.curve)!=="straight"?{curve:eh(n.curve)}:{},...An(n.fillStyle)!=="flat"?{fillStyle:An(n.fillStyle)}:{},...typeof n.fillColorHex=="string"?{fillColorHex:n.fillColorHex}:{},...qa(n.areaFill)!==void 0?{areaFill:qa(n.areaFill)}:{},...In(n.barRadius)!==aa?{barRadius:In(n.barRadius)}:{},...Ln(n.barCorners)!=="all"?{barCorners:Ln(n.barCorners)}:{},...typeof n.barBorderWidth=="number"&&Number.isFinite(n.barBorderWidth)&&n.barBorderWidth!==0?{barBorderWidth:n.barBorderWidth}:{},...typeof n.barBorderColorHex=="string"?{barBorderColorHex:n.barBorderColorHex}:{},...n.barBorderOpenBase===!0?{barBorderOpenBase:!0}:{},...typeof n.bandAboveFillColorHex=="string"?{bandAboveFillColorHex:n.bandAboveFillColorHex}:{},...typeof n.bandAboveBorderColorHex=="string"?{bandAboveBorderColorHex:n.bandAboveBorderColorHex}:{},...dd(n.pointDots)!=="none"?{pointDots:dd(n.pointDots)}:{},...Ot(n.pointDotSize)!==void 0?{pointDotSize:Ot(n.pointDotSize)}:{},...typeof n.pointDotColorHex=="string"?{pointDotColorHex:n.pointDotColorHex}:{},...cd(n.gridLines)!==0?{gridLines:cd(n.gridLines)}:{},...ia(Mn(n.gridColorHex),cn)?{}:{gridColorHex:Mn(n.gridColorHex)},...n.zeroLine===!0?{zeroLine:!0}:{},...Ft(n.smoothing)!==void 0?{smoothing:Ft(n.smoothing)}:{},...n.gaps===!0?{gaps:!0}:{},...typeof n.thresholdValue=="number"&&Number.isFinite(n.thresholdValue)?{thresholdValue:n.thresholdValue}:{},thresholdColorHex:X(n.thresholdColorHex,Ad),...U(n.nowIndex)?{nowIndex:ke(n.nowIndex)}:{},nowColorHex:X(n.nowColorHex,Id),...n.drawsThreshold===!1?{drawsThreshold:!1}:{},...n.drawsNowLine===!1?{drawsNowLine:!1}:{},...n.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{},...ce(n.scaleFrom)!==void 0?{scaleFrom:ce(n.scaleFrom)}:{},timeLabelCount:Gt(n.timeLabelCount),labelSize:Z(n.labelSize,bt),labelColorHex:X(n.labelColorHex,xt),labelsAbove:n.labelsAbove===!0,hourCycle:rd(n.hourCycle),minutes:od(n.minutes)}};case"timeline":{let{colorSlot:t,...i}=ot(n,"#FFFFFF"),a=Zw(n.aggregate);return{kind:"timeline",payload:{...i,value:U(n.value)?ke(n.value):K(""),...a!==void 0?{aggregate:a}:{},historyMinutes:Math.max(1,Math.round(Z(n.historyMinutes,Od))),bands:Jw(n.bands),otherColorHex:X(n.otherColorHex,Pn),gap:Math.min(os,Math.max(0,Z(n.gap,0))),cornerRadius:Math.max(0,Z(n.cornerRadius,Bh)),timeLabelCount:Pw(n),labelSize:Z(n.labelSize,bt),labelColorHex:X(n.labelColorHex,xt),labelsAbove:n.labelsAbove===!0,hourCycle:rd(n.hourCycle),minutes:od(n.minutes),...n.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{}}}}case"shape":{let t={...ot(n,"#FFFFFF33"),kind:ce(n.kind)??"roundedRectangle",cornerRadius:Z(n.cornerRadius,6),thickness:Z(n.thickness,1),borderWidth:Z(n.borderWidth,1)};typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex);let i=qa(n.fill);return i!==void 0&&(t.fill=i),th(n,t),Fo(n,t),{kind:"shape",payload:t}}case"image":{let{colorSlot:t,...i}=ot(n,"#FFFFFF"),a={...i,entity:U(n.entity)?Fn(n.entity):{entityId:"",displayName:"",domain:""},source:n.source==="entityPicture"?"entityPicture":n.source==="inline"?"inline":"camera",contentMode:n.contentMode==="fit"?"fit":"fill",zoom:Z(n.zoom,1),panX:Z(n.panX,0),panY:Z(n.panY,0),cornerRadius:Z(n.cornerRadius,ua),timestampCorner:Uw.includes(n.timestampCorner)?n.timestampCorner:"topLeading",timestampSize:Z(n.timestampSize,ss)},r=ce(n.data);r!==void 0&&r!==""&&(a.data=r),n.format==="jpeg"&&(a.format="jpeg"),n.timestamp===!0&&(a.timestamp=!0);let o=Ya(n.timestampX),s=Ya(n.timestampY);return o!==void 0&&s!==void 0&&Number.isFinite(o)&&Number.isFinite(s)&&(a.timestampX=Mt(o),a.timestampY=Mt(s)),Fo(n,a),{kind:"image",payload:a}}case"tap":{let{colorSlot:t,...i}=ot(n,"#FFFFFF"),a={...i,action:U(n.action)?tf(n.action):{type:"refresh"}};return typeof n.openPageId=="string"&&(a.openPageId=n.openPageId),typeof n.openPageName=="string"&&(a.openPageName=n.openPageName),typeof n.attachedTo=="string"&&(a.attachedTo=n.attachedTo.toUpperCase()),{kind:"tap",payload:a}}case"chartTimes":{let{colorSlot:t,...i}=ot(n,"#FFFFFF");return{kind:"chartTimes",payload:{...i,chart:X(n.chart).toUpperCase(),timeLabelCount:Gt(n.timeLabelCount),labelSize:Z(n.labelSize,bt),labelColorHex:X(n.labelColorHex,xt),hourCycle:rd(n.hourCycle),minutes:od(n.minutes)}}}case"imageTime":{let{colorSlot:t,...i}=ot(n,"#FFFFFF");return{kind:"imageTime",payload:{...i,image:X(n.image).toUpperCase()}}}case"chartDots":{let{colorSlot:t,...i}=ot(n,"#FFFFFF"),a=Ot(n.size);return{kind:"chartDots",payload:{...i,chart:X(n.chart).toUpperCase(),dots:_o(n.dots),...a!==void 0?{size:a}:{},...typeof n.colorHex=="string"?{colorHex:n.colorHex}:{}}}}case"chartGrid":{let{colorSlot:t,...i}=ot(n,"#FFFFFF");return{kind:"chartGrid",payload:{...i,chart:X(n.chart).toUpperCase(),lines:bi(n.lines),colorHex:Mn(n.colorHex),thickness:xi(n.thickness)}}}case"list":{let{colorSlot:t,...i}=ot(n,"#FFFFFF"),a=(Array.isArray(n.template)?n.template:[]).filter(r=>U(r)&&!qh.includes(String(r.kind))).map(ef);return{kind:"list",payload:{...i,source:Qw(n.source),rows:Xe(n.rows),direction:n.direction==="across"?"across":"down",columns:Sr(n.columns),gap:Ti(n.gap),template:a}}}default:throw new vt(`unknown element kind ${String(e.kind)}`)}}function dh(e){let n=U(e)?e:{},t={};if(U(n.placements))for(let[r,o]of Object.entries(n.placements)){if(!U(o))continue;let s={frame:Zh(o.frame),isHidden:o.isHidden===!0},l=Ya(o.size);l!==void 0&&(s.size=l),t[r.toUpperCase()]=s}let i={placements:t,cornerBodyShape:n.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:Z(n.borderWidth,2),rules:Qh(n.rules)};if(U(n.bezelText)&&(i.bezelText=ke(n.bezelText)),n.bezelCountdown===!0&&(i.bezelCountdown=!0),U(n.curvedText)&&(i.curvedText=ke(n.curvedText)),typeof n.curvedColorHex=="string"&&(i.curvedColorHex=n.curvedColorHex),U(n.bezelGauge)){let r=n.bezelGauge,o={value:U(r.value)?ke(r.value):K("50"),minValue:Z(r.minValue,0),maxValue:Z(r.maxValue,100),colorHexes:Array.isArray(r.colorHexes)&&r.colorHexes.length>0?r.colorHexes.filter(s=>typeof s=="string"):["#34C759","#FFCC00","#FF3B30"]};U(r.minLabel)&&(o.minLabel=ke(r.minLabel)),U(r.maxLabel)&&(o.maxLabel=ke(r.maxLabel)),i.bezelGauge=o}typeof n.backgroundColorHex=="string"&&(i.backgroundColorHex=n.backgroundColorHex);let a=qa(n.backgroundFill);return a!==void 0&&(i.backgroundFill=a),typeof n.borderColorHex=="string"&&(i.borderColorHex=n.borderColorHex),i}function nv(e){let n={};if(Array.isArray(e))for(let t=0;t+1<e.length;t+=2){let i=e[t];typeof i=="string"&&(n[i]=dh(e[t+1]))}else if(U(e))for(let[t,i]of Object.entries(e))n[t]=dh(i);return n}function iv(e){let n={value:U(e.value)?ke(e.value):K("")};return typeof e.label=="string"&&(n.label=e.label),typeof e.symbol=="string"&&(n.symbol=e.symbol),e.countdown===!0&&(n.countdown=!0),n}function tf(e){if(!U(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...Fn(e)};case"callService":{let n={type:"callService",serviceDomain:typeof e.serviceDomain=="string"?e.serviceDomain:"",serviceName:typeof e.serviceName=="string"?e.serviceName:""};return typeof e.serviceDataJSON=="string"&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),typeof e.entityId=="string"&&e.entityId!==""&&(n.target=Fn(e)),n}default:return{type:"none"}}}function ha(e){if(!U(e))throw new vt("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new vt(`${r} is required`);let n=(Array.isArray(e.values)?e.values:[]).filter(U).map(r=>({id:X(r.id).toUpperCase(),name:X(r.name),value:U(r.value)?ke(r.value):K("")})),t=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(U).map(r=>r.kind==="template"?{kind:"template",value:X(r.value)}:r.kind==="entity"?{kind:"entity",...Fn(r)}:null).filter(r=>r!==null),i={schemaVersion:Z(e.schemaVersion,1),id:X(e.id).toUpperCase(),name:X(e.name,"Custom"),values:n,slotIndex:Z(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(ef),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:nv(e.perFamily),dataSources:t,tapAction:tf(e.tapAction)};U(e.inline)&&(i.inline=iv(e.inline));let a=Ya(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),e.hidden===!0&&(i.hidden=!0),Array.isArray(e.groups)){let r=e.groups.filter(U).filter(o=>typeof o.id=="string").map(o=>({id:X(o.id).toUpperCase(),name:X(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return uv(i,Array.isArray(e.elements)?e.elements:[]),_t(i),i}function nc(e,n){let t=n?.kind;if(!t||t.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===t.layer);return i?.kind==="chart"?i:void 0}function Bn(e,n){return e.elements.filter(t=>t.kind==="text"&&t.payload.value.kind.kind==="chartStat"&&t.payload.value.kind.layer===n)}function xn(e,n,t){let i=kt(e,n.payload.id);if(i){Tr(e,t,i.id);return}let a=cc(e,[n.payload.id,t]),r=e.groups?.find(o=>o.id===a);r&&(r.locked=!1)}var nf={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1},trend:{x:.85,y:0},delta:{x:.5,y:0},sum:{x:.2,y:0},first:{x:.65,y:1}};function af(e,n,t,i){let a=ue.rectangular,r=Math.min(1,(i*t*.62+4)/a.width),o=Math.min(1,t*1.3/a.height),s=e.x+n.x*e.width-n.x*r,l=e.y+n.y*e.height-n.y*o;return{x:Math.max(0,Math.min(1-r,s)),y:Math.max(0,Math.min(1-o,l)),width:r,height:o,rotationDegrees:0}}function rf(e,n,t){let i=e.elements.find(c=>c.payload.id===n);if(!i||i.kind!=="chart")return;let a=Le("text"),r=t==="latest"?10:8,o={kind:{kind:"chartStat",layer:n,stat:t}};(t==="latest"||t==="delta"||t==="sum")&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:t==="latest"?"#FFFFFF":"#FFFFFF99"};let s=t==="trend"?2:o.format?.useEntityUnit?7:4;a.payload.frame=af(i.payload.frame,nf[t],r,s);let l=e.elements.findIndex(c=>c.payload.id===n);return e.elements.splice(l+1,0,a),xn(e,i,a.payload.id),a.payload.id}var of={highest:"arrowtriangle.up.fill",lowest:"circle.fill",now:"arrowtriangle.down.fill",first:"circle.fill",latest:"circle.fill",threshold:"circle.fill",zero:"circle.fill"},ch=6,av={"\u25B2":"arrowtriangle.up.fill","\u25BC":"arrowtriangle.down.fill","\u25CF":"circle.fill","\u25C6":"diamond.fill"};function rv(e,n){let t=(i,a)=>i!==void 0&&i!==a?i:void 0;return n==="highest"?t(e.payload.highColorHex,gt)??"#FFD60A":n==="lowest"?t(e.payload.lowColorHex,yt)??"#FF453A":"#FFFFFF"}function ic(e){e.nowIndex===void 0&&(e.nowIndex={kind:{kind:"time",timeField:"hour"}},e.drawsNowLine=!1)}function qe(e,n){return e.elements.filter(t=>t.payload.chartAnchor?.layer===n)}function ac(e,n,t,i="above"){let a=e.elements.find(s=>s.payload.id===n);if(!a||a.kind!=="chart")return;t==="now"&&ic(a.payload);let r=Le("icon");r.payload.symbol=K(of[t]),r.payload.size=ch,r.payload.colorSlot={baseColorHex:rv(a,t)},r.payload.frame=ov(ch),r.payload.chartAnchor={layer:n,at:t,place:i};let o=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(o+1,0,r),xn(e,a,r.payload.id),r.payload.id}function sf(e,n){let t=e.elements.findIndex(u=>u.payload.id===n),i=e.elements[t];if(!i||i.kind!=="text"||i.payload.chartAnchor===void 0)return;let a=i.payload,r=a.chartAnchor,o=u=>{let p=wi(u);return p===void 0?void 0:av[p.trim()]},s=new Set(Mr.icon),l=u=>u.flatMap(p=>{if(p.kind==="setText"){let f=p.value===void 0?void 0:o(p.value);return f===void 0?[]:[{kind:"setIcon",value:K(f)}]}return s.has(Ye[p.kind])?[p]:[]}),c=a.rules.filter(u=>u.partId===void 0).map(u=>({...u,cases:u.cases.map(p=>({...p,then:l(p.then)})),...u.otherwise!==void 0?{otherwise:l(u.otherwise)}:{}})),d=Le("icon");d.payload={...d.payload,id:a.id,colorSlot:a.colorSlot,rules:c,frame:a.frame,isHidden:a.isHidden,...a.groupId!==void 0?{groupId:a.groupId}:{},...a.name!==void 0?{name:a.name}:{},chartAnchor:r,symbol:K(o(a.value)??of[r.at]),size:a.fontSize},e.elements[t]=d}function ov(e){let n=ue.rectangular;return{x:0,y:0,width:Math.min(1,e*1.2/n.width),height:Math.min(1,e*1.3/n.height),rotationDegrees:0}}function mi(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;t==="now"&&ic(a);let r=Le("shape");r.payload.kind="line",r.payload.thickness=1,r.payload.borderWidth=0,r.payload.colorSlot={baseColorHex:t==="now"?a.nowColorHex:a.thresholdColorHex},r.payload.frame=lf(a.frame,t),r.payload.chartAnchor={layer:n,at:t,place:"through"};let o=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(o+1,0,r),xn(e,i,r.payload.id),t==="now"?a.drawsNowLine=!1:a.drawsThreshold=!1,r.payload.id}function lf(e,n){let t=ue.rectangular,i=3;return n==="now"?{...e,width:Math.min(e.width,i/t.width),rotationDegrees:0}:{...e,height:Math.min(e.height,i/t.height),rotationDegrees:0}}function Vn(e,n){return e.elements.filter(t=>t.kind==="chartTimes"&&t.payload.chart===n)}function Ei(e,n){let t=e.elements.find(o=>o.payload.id===n);if(!t||t.kind!=="chart"&&t.kind!=="timeline")return;let i=t.payload,a=Le("chartTimes");a.payload.chart=n,a.payload.timeLabelCount=i.timeLabelCount>0?Gt(i.timeLabelCount):Vh,a.payload.labelSize=i.labelSize,a.payload.labelColorHex=i.labelColorHex,a.payload.hourCycle=i.hourCycle,a.payload.minutes=i.minutes,a.payload.frame=cv(i.frame,i.labelSize,i.labelsAbove);let r=e.elements.findIndex(o=>o.payload.id===n);return e.elements.splice(r+1,0,a),xn(e,t,a.payload.id),i.drawsTimeLabels=!1,a.payload.id}function fs(e,n){return e.elements.filter(t=>t.kind==="imageTime"&&t.payload.image===n)}function sv(e){let n=Math.min(40,Math.max(4,e));return{w:8*n*.578+n*.89,h:n*1.25}}function rc(e,n){return Math.max(0,Math.min(e/(8*.578+.89),n/1.25))}function oc(e,n,t=ue.rectangular){let i=e.elements.find(b=>b.payload.id===n);if(!i||i.kind!=="image")return;let a=i.payload,r=Le("imageTime");r.payload.image=n;let o=sv(a.timestampSize),s=a.frame.x*t.width,l=a.frame.y*t.height,c=a.frame.width*t.width,d=a.frame.height*t.height,u,p;if(ds(a)){let b=(y,w,k,S)=>S>=k?w+(k-S)/2:Math.min(w+k-S,Math.max(w,y-S/2));u=b(s+a.timestampX*c,s,c,o.w),p=b(l+a.timestampY*d,l,d,o.h)}else u=a.timestampCorner.endsWith("Leading")?s+4:s+c-4-o.w,p=a.timestampCorner.startsWith("top")?l+4:l+d-4-o.h;let f=b=>Math.round(b*1e3)/1e3;r.payload.frame={x:f(u/t.width),y:f(p/t.height),width:f(o.w/t.width),height:f(o.h/t.height),rotationDegrees:0};let g=e.elements.findIndex(b=>b.payload.id===n);return e.elements.splice(g+1,0,r),xn(e,i,r.payload.id),delete a.timestamp,delete a.timestampX,delete a.timestampY,a.timestampCorner="topLeading",a.timestampSize=ss,r.payload.id}function Ri(e,n){return e.elements.filter(t=>t.kind==="chartDots"&&t.payload.chart===n)}function Mi(e,n){return e.elements.filter(t=>t.kind==="chartGrid"&&t.payload.chart===n)}function sc(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=Le("chartDots");i.payload.chart=n,i.payload.dots=t.payload.pointDots==="all"?"all":"auto",i.payload.frame={...t.payload.frame};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a+1,0,i),xn(e,t,i.payload.id),i.payload.id}function lc(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=Le("chartGrid");i.payload.chart=n,i.payload.frame={...t.payload.frame};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a,0,i),xn(e,t,i.payload.id),i.payload.id}var lv="#FFFFFF66";function dc(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=Le("shape");i.payload.kind="line",i.payload.thickness=1,i.payload.borderWidth=0,i.payload.colorSlot={baseColorHex:lv},i.payload.frame=lf(t.payload.frame,"threshold"),i.payload.chartAnchor={layer:n,at:"zero",place:"through"};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a+1,0,i),xn(e,t,i.payload.id),i.payload.id}function df(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;if(t===void 0){delete a.thresholdValue,delete a.drawsThreshold;for(let r of qe(e,n))r.payload.chartAnchor?.at==="threshold"&&Se(e,r.payload.id);return}a.thresholdValue=t,a.drawsThreshold=!1,qe(e,n).some(r=>r.payload.chartAnchor?.at==="threshold")||mi(e,n,"threshold")}function cf(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;if(!t){delete a.nowIndex,delete a.drawsNowLine;for(let r of qe(e,n))r.payload.chartAnchor?.at==="now"&&Se(e,r.payload.id);return}ic(a),a.drawsNowLine=!1,qe(e,n).some(r=>r.payload.chartAnchor?.at==="now")||mi(e,n,"now")}function uf(e){let n=e.elements.filter(t=>t.kind==="chart"||t.kind==="timeline"||t.kind==="image");for(let t of n){let i=t.payload,a=new Set(e.elements.map(l=>l.payload.id)),r=de.find(l=>e.perFamily[l]?.placements[i.id]!==void 0),o=i.frame,s=r===void 0?void 0:e.perFamily[r].placements[i.id];if(s&&(i.frame={...s.frame}),t.kind==="chart"&&dv(e,t.payload),t.kind==="timeline"&&t.payload.drawsTimeLabels!==!1&&t.payload.timeLabelCount>0&&Ei(e,i.id),t.kind==="image"&&t.payload.timestamp===!0&&oc(e,i.id,ue[r??"rectangular"]),i.frame=o,!(r===void 0||s===void 0))for(let l of e.elements)a.has(l.payload.id)||(e.perFamily[r].placements[l.payload.id]={frame:{...l.payload.frame},isHidden:s.isHidden},l.payload.isHidden=!0)}}function dv(e,n){{if(n.highlight!==void 0&&n.highlight!=="none"){let a=Ja(n),r=[];(n.highlight==="highest"||n.highlight==="both")&&r.push(["highest",a.high]),(n.highlight==="lowest"||n.highlight==="both")&&r.push(["lowest",a.low]);for(let[o,s]of r){let l=ac(e,n.id,o),c=e.elements.find(d=>d.payload.id===l);c?.kind==="icon"&&s!=="none"&&(c.payload.symbol=K(s==="triangle"?"arrowtriangle.up.fill":"circle.fill"))}Dw(n,{high:"none",low:"none"}),n.highlight="none"}n.thresholdValue!==void 0&&n.drawsThreshold!==!1&&mi(e,n.id,"threshold"),n.nowIndex!==void 0&&n.drawsNowLine!==!1&&mi(e,n.id,"now"),n.drawsTimeLabels!==!1&&ki(n)&&n.timeLabelCount>0&&Ei(e,n.id);let t=dd(n.pointDots);if(t!=="none"){let a=sc(e,n.id),r=e.elements.find(o=>o.payload.id===a);if(r?.kind==="chartDots"){r.payload.dots=t;let o=Ot(n.pointDotSize);o!==void 0&&(r.payload.size=o),typeof n.pointDotColorHex=="string"&&(r.payload.colorHex=n.pointDotColorHex)}}let i=cd(n.gridLines);if(i>0){let a=lc(e,n.id),r=e.elements.find(o=>o.payload.id===a);r?.kind==="chartGrid"&&(r.payload.lines=i,r.payload.colorHex=Mn(n.gridColorHex))}if(n.zeroLine===!0){let a=dc(e,n.id),r=e.elements.find(o=>o.payload.id===a);r?.kind==="shape"&&(r.payload.colorSlot={baseColorHex:Mn(n.gridColorHex)})}delete n.pointDots,delete n.pointDotSize,delete n.pointDotColorHex,delete n.gridLines,delete n.gridColorHex,delete n.zeroLine}}function cv(e,n,t){let i=ue.rectangular,a=Math.max(zn,Math.min(On,n)),r=Math.min(1,a*1.2/i.height),o=Math.min(1,Math.max(0,e.width)),s=t?e.y-r:e.y+e.height;return{x:Math.max(0,Math.min(1-o,e.x)),y:Math.max(0,Math.min(1-r,s)),width:o,height:r,rotationDegrees:0}}function uv(e,n){for(let t of n){if(!U(t)||t.kind!=="chart"||!U(t.payload))continue;let i=t.payload,a=X(i.id).toUpperCase(),r=e.elements.find(p=>p.payload.id===a);if(!r||r.kind!=="chart")continue;let o=X(i.scaleLabelColorHex,"#FFFFFF99"),s=p=>{let f=U(p)?p:{};return{fontSize:Z(f.fontSize,8),colorHex:X(f.colorHex,o),pillColorHex:typeof f.pillColorHex=="string"?f.pillColorHex:void 0}},l=[],c=ce(i.scaleLabels);(c==="top"||c==="range")&&l.push(["top",s(i.topLabelStyle)]),c==="range"&&l.push(["bottom",s(i.bottomLabelStyle)]);let d=ce(i.latestLabel);if((d==="corner"||d==="end")&&l.push(["latest",s(i.latestLabelStyle)]),l.length===0)continue;let u=e.elements.findIndex(p=>p.payload.id===a)+1;for(let[p,f]of l){let g=af(r.payload.frame,nf[p],f.fontSize,p==="latest"?5:4),b=[];if(f.pillColorHex!==void 0){let w=Le("shape");w.payload.kind="capsule",w.payload.colorSlot={baseColorHex:f.pillColorHex},w.payload.frame={...g},b.push(w)}let y=Le("text");y.payload.value={kind:{kind:"chartStat",layer:a,stat:p}},y.payload.fontSize=f.fontSize,y.payload.fontWeight="medium",y.payload.colorSlot={baseColorHex:f.colorHex},y.payload.frame=g,b.push(y),e.elements.splice(u,0,...b),u+=b.length;for(let w of b)xn(e,r,w.payload.id)}}}function Y(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function mt(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function pv(e){let n={};return e.decimals!==void 0&&(n.decimals=Y(e.decimals)),e.multiply!==void 0&&(n.multiply=Y(e.multiply)),e.offset!==void 0&&(n.offset=Y(e.offset)),e.prefix&&(n.prefix=e.prefix),e.suffix&&(n.suffix=e.suffix),e.useEntityUnit&&(n.useEntityUnit=!0),e.relativeTime&&(n.relativeTime=!0),e.duration&&(n.duration=!0),e.timestamp!==void 0&&(n.timestamp=e.timestamp),e.textCase!==void 0&&(n.textCase=e.textCase),n}function pf(e){let n=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(mt)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},t={function:e.function,scope:n};return e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(t.attribute=e.attribute),t}function hv(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...mt(e)};case"entityAttribute":return{kind:"entityAttribute",...mt(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...mt(e)};case"aggregate":return{kind:"aggregate",aggregate:pf(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat};case"item":return{kind:"item",field:e.field};case"listStat":return{kind:"listStat",layer:e.layer,stat:e.stat}}}function fe(e){let n={kind:hv(e.kind)};return We(e.format)||(n.format=pv(e.format)),n}function Pt(e){return{x:Y(e.x),y:Y(e.y),width:Y(e.width),height:Y(e.height),rotationDegrees:Y(e.rotationDegrees)}}function fv(e){let n={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=fe(e.value??K(""));break;case"between":case"timeBetween":n.value=fe(e.value??K("")),n.upper=fe(e.upper??K(""));break;case"matchesRegex":n.pattern=e.pattern??"";break;case"isOneOf":n.options=e.options??[];break;default:break}return n}function uh(e){let n={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=fe(e.value??K(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=Y(e.number??0);break;case"setFontWeight":n.weight=e.weight??"regular";break;case"setFontDesign":n.design=e.design??"default";break;case"setFontWidth":n.width=e.width??"standard";break;case"setItalic":n.italic=e.italic!==!1;break;default:break}return n}function zt(e){return e.map(n=>{let t={id:n.id,cases:n.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:fe(a.value),comparison:fv(a.comparison)}))},then:i.then.map(uh)}))};return n.otherwise&&(t.otherwise=n.otherwise.map(uh)),n.partId!==void 0&&(t.partId=n.partId),t})}function mv(e){let n={id:e.id,value:fe(e.value)};return e.colorHex!==void 0&&(n.colorHex=e.colorHex),e.fontWeight!==void 0&&(n.fontWeight=e.fontWeight),e.fontSize!==void 0&&(n.fontSize=Y(e.fontSize)),e.fontDesign!==void 0&&(n.fontDesign=e.fontDesign),e.fontWidth!==void 0&&(n.fontWidth=e.fontWidth),e.italic!==void 0&&(n.italic=e.italic),e.coloring!==void 0&&e.coloring!=="uniform"&&(n.coloring=e.coloring),e.bands!==void 0&&e.bands.length>0&&(n.bands=e.bands.map(Lo)),e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==xe&&(n.bandAboveColorHex=e.bandAboveColorHex),n}function hf(e){let n=gv(e);return e.payload.groupId!==void 0&&(n.payload.groupId=e.payload.groupId),e.payload.name!==void 0&&(n.payload.name=e.payload.name),e.payload.accentGroup==="accent"&&(n.payload.accentGroup="accent"),n}function gv(e){let n=t=>{let i={id:t.id,colorSlot:{baseColorHex:t.colorSlot.baseColorHex},rules:zt(t.rules),frame:Pt(t.frame),isHidden:t.isHidden};return t.opacity!==void 0&&t.opacity!==1&&(i.opacity=Y(t.opacity)),t.shadow!==void 0&&(i.shadow={colorHex:t.shadow.colorHex,radius:Y(t.shadow.radius),dx:Y(t.shadow.dx),dy:Y(t.shadow.dy)}),i};switch(e.kind){case"text":{let t={...n(e.payload),value:fe(e.payload.value),fontSize:Y(e.payload.fontSize),fontWeight:e.payload.fontWeight};e.payload.countdown===!0&&(t.countdown=!0),e.payload.monospacedDigits===!0&&(t.monospacedDigits=!0),e.payload.lineLimit!==void 0&&e.payload.lineLimit>1&&(t.lineLimit=e.payload.lineLimit),e.payload.fontDesign!==void 0&&e.payload.fontDesign!=="default"&&(t.fontDesign=e.payload.fontDesign),e.payload.fontWidth!==void 0&&e.payload.fontWidth!=="standard"&&(t.fontWidth=e.payload.fontWidth),e.payload.italic===!0&&(t.italic=!0),e.payload.minimumScale!==void 0&&e.payload.minimumScale!==wt&&(t.minimumScale=Y(e.payload.minimumScale)),e.payload.alignment!==void 0&&e.payload.alignment!=="center"&&(t.alignment=e.payload.alignment);let i=e.payload;return i.coloring!==void 0&&i.coloring!=="uniform"&&(t.coloring=i.coloring),i.bands!==void 0&&i.bands.length>0&&(t.bands=i.bands.map(Lo)),i.bandAboveColorHex!==void 0&&i.bandAboveColorHex!==xe&&(t.bandAboveColorHex=i.bandAboveColorHex),i.highlight!==void 0&&i.highlight!=="none"&&(t.highlight=i.highlight),i.highColorHex!==void 0&&i.highColorHex!==gt&&(t.highColorHex=i.highColorHex),i.lowColorHex!==void 0&&i.lowColorHex!==yt&&(t.lowColorHex=i.lowColorHex),i.parts!==void 0&&i.parts.length>0&&(t.parts=i.parts.map(mv),It(i)&&(t.value=fe(pr(i.parts)))),i.arc!==void 0&&(t.arc=Ew(i.arc)),Ao(i,t),{kind:"text",payload:t}}case"icon":{let t={...n(e.payload),symbol:fe(e.payload.symbol)};e.payload.path!==void 0&&e.payload.path!==""&&(t.path=e.payload.path);let i=Td(e.payload.viewBox);return i!==void 0&&(t.viewBox=i),t.size=Y(e.payload.size),nh(e.payload,t),Ao(e.payload,t),{kind:"icon",payload:t}}case"gauge":{let t=e.payload,i={...n(t),value:fe(t.value),minValue:Y(t.minValue),maxValue:Y(t.maxValue),style:t.style,lineWidth:Y(t.lineWidth),trackColorHex:t.trackColorHex};return t.coloring!=="uniform"&&(i.coloring=t.coloring),t.bands.length>0&&(i.bands=t.bands.map(Lo)),t.bandAboveColorHex!==xe&&(i.bandAboveColorHex=t.bandAboveColorHex),t.thresholdValue!==void 0&&(i.thresholdValue=Y(t.thresholdValue)),t.thresholdColorHex!==oa&&(i.thresholdColorHex=t.thresholdColorHex),t.total!==void 0&&(i.total=fe(t.total)),t.minSource!==void 0&&(i.minSource=fe(t.minSource)),t.maxSource!==void 0&&(i.maxSource=fe(t.maxSource)),t.fill!==void 0&&(i.fill=Io(t.fill)),t.ticks!==void 0&&!Jo(t.ticks)&&(i.ticks=Lw(t.ticks)),t.labels!==void 0&&!Zo(t.labels)&&(i.labels=_w(t.labels)),{kind:"gauge",payload:i}}case"chart":{let t=e.payload,i={...n(t),value:fe(t.value),historyMinutes:Math.max(0,Math.round(t.historyMinutes)),historyPoints:Math.round(t.historyPoints),style:t.style,limit:Math.max(0,Math.round(t.limit)),takeFromEnd:t.takeFromEnd,scale:t.scale,minValue:Y(t.minValue),maxValue:Y(t.maxValue),baseline:t.baseline,barGap:Y(t.barGap),lineWidth:Y(t.lineWidth),highlight:t.highlight,highColorHex:t.highColorHex,lowColorHex:t.lowColorHex,marker:Ih(Ja(t)),coloring:t.coloring,bands:t.bands.map(Lo),bandAboveColorHex:t.bandAboveColorHex,fillBands:t.fillBands};t.source!==bd&&(i.source=t.source),t.statPeriod!==tr&&(i.statPeriod=t.statPeriod),t.statType!==nr&&(i.statType=t.statType),t.thresholdValue!==void 0&&(i.thresholdValue=Y(t.thresholdValue)),t.thresholdColorHex!==Ad&&(i.thresholdColorHex=t.thresholdColorHex),t.nowIndex!==void 0&&(i.nowIndex=fe(t.nowIndex)),t.nowColorHex!==Id&&(i.nowColorHex=t.nowColorHex),t.drawsThreshold===!1&&(i.drawsThreshold=!1),t.drawsNowLine===!1&&(i.drawsNowLine=!1),t.drawsTimeLabels===!1&&(i.drawsTimeLabels=!1),t.scaleFrom!==void 0&&(i.scaleFrom=t.scaleFrom),t.labelSize!==bt&&(i.labelSize=Y(t.labelSize)),t.labelColorHex!==xt&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==ui&&(i.timeLabelCount=Gt(t.timeLabelCount)),t.hourCycle!==pi&&(i.hourCycle=t.hourCycle),t.minutes!==hi&&(i.minutes=t.minutes);let a=Ja(t);Lh(a)||(i.highMarker=a.high,i.lowMarker=a.low);let r=t.curve??"straight";r!=="straight"&&(i.curve=r);let o=An(t.fillStyle);o!=="flat"&&(i.fillStyle=o),t.fillColorHex!==void 0&&(i.fillColorHex=t.fillColorHex),t.areaFill!==void 0&&(i.areaFill=Io(t.areaFill));let s=In(t.barRadius);s!==aa&&(i.barRadius=Y(s));let l=Ln(t.barCorners);l!=="all"&&(i.barCorners=l);let c=Ft(t.smoothing);return c!==void 0&&(i.smoothing=c),t.gaps===!0&&(i.gaps=!0),t.barBorderWidth!==void 0&&t.barBorderWidth!==0&&(i.barBorderWidth=Y(t.barBorderWidth)),t.barBorderColorHex!==void 0&&(i.barBorderColorHex=t.barBorderColorHex),t.bandAboveFillColorHex!==void 0&&(i.bandAboveFillColorHex=t.bandAboveFillColorHex),t.bandAboveBorderColorHex!==void 0&&(i.bandAboveBorderColorHex=t.bandAboveBorderColorHex),t.barBorderOpenBase===!0&&(i.barBorderOpenBase=!0),{kind:"chart",payload:i}}case"timeline":{let t=e.payload,i={id:t.id,rules:zt(t.rules),frame:Pt(t.frame),isHidden:t.isHidden,value:fe(t.value)},a=Ci(t);return t.aggregate!==void 0&&a.length>0&&(i.aggregate={entities:a,...t.aggregate.combine!==yn?{combine:t.aggregate.combine}:{}}),t.historyMinutes!==Od&&(i.historyMinutes=Math.max(1,Math.round(t.historyMinutes))),t.bands.length>0&&(i.bands=t.bands.map(r=>({id:r.id,match:r.match,colorHex:r.colorHex}))),t.otherColorHex!==Pn&&(i.otherColorHex=t.otherColorHex),t.gap!==0&&(i.gap=Y(t.gap)),t.cornerRadius!==Bh&&(i.cornerRadius=Y(t.cornerRadius)),t.labelSize!==bt&&(i.labelSize=Y(t.labelSize)),t.labelColorHex!==xt&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==ui&&(i.timeLabelCount=Math.max(0,Math.min($i,Math.round(t.timeLabelCount)))),t.hourCycle!==pi&&(i.hourCycle=t.hourCycle),t.minutes!==hi&&(i.minutes=t.minutes),t.drawsTimeLabels===!1&&(i.drawsTimeLabels=!1),{kind:"timeline",payload:i}}case"shape":{let t={...n(e.payload),kind:e.payload.kind,cornerRadius:Y(e.payload.cornerRadius),borderWidth:Y(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(t.borderColorHex=e.payload.borderColorHex),e.payload.thickness!==1&&(t.thickness=Y(e.payload.thickness)),e.payload.fill!==void 0&&(t.fill=Io(e.payload.fill)),nh(e.payload,t),Ao(e.payload,t),{kind:"shape",payload:t}}case"image":{let t=e.payload,i={id:t.id};(t.source!=="inline"||t.entity.entityId!=="")&&(i.entity=mt(t.entity)),i.rules=zt(t.rules),i.frame=Pt(t.frame),i.isHidden=t.isHidden,t.source!=="camera"&&(i.source=t.source),t.data!==void 0&&t.data!==""&&(i.data=t.data),t.format==="jpeg"&&(i.format="jpeg"),t.timestamp===!0&&(i.timestamp=!0),t.contentMode!=="fill"&&(i.contentMode=t.contentMode),t.zoom!==1&&(i.zoom=Y(t.zoom)),t.panX!==0&&(i.panX=Y(t.panX)),t.panY!==0&&(i.panY=Y(t.panY)),t.cornerRadius!==ua&&(i.cornerRadius=Y(t.cornerRadius));let a=ds(t),r=a?Ww(t.timestampX,t.timestampY):t.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),t.timestampSize!==ss&&(i.timestampSize=Y(t.timestampSize)),a&&(i.timestampX=Y(t.timestampX),i.timestampY=Y(t.timestampY)),Ao(t,i),{kind:"image",payload:i}}case"tap":{let t=e.payload,i={id:t.id,action:ff(t.action)};return t.openPageId!==void 0&&(i.openPageId=t.openPageId),t.openPageName!==void 0&&(i.openPageName=t.openPageName),t.attachedTo!==void 0&&(i.attachedTo=t.attachedTo),i.rules=zt(t.rules),i.frame=Pt(t.frame),i.isHidden=t.isHidden,t.opacity!==void 0&&t.opacity!==1&&(i.opacity=Y(t.opacity)),t.shadow!==void 0&&(i.shadow={colorHex:t.shadow.colorHex,radius:Y(t.shadow.radius),dx:Y(t.shadow.dx),dy:Y(t.shadow.dy)}),{kind:"tap",payload:i}}case"chartTimes":{let t=e.payload,i={id:t.id,rules:zt(t.rules),frame:Pt(t.frame),isHidden:t.isHidden,chart:t.chart};return t.labelSize!==bt&&(i.labelSize=Y(t.labelSize)),t.labelColorHex!==xt&&(i.labelColorHex=t.labelColorHex),t.timeLabelCount!==ui&&(i.timeLabelCount=Gt(t.timeLabelCount)),t.hourCycle!==pi&&(i.hourCycle=t.hourCycle),t.minutes!==hi&&(i.minutes=t.minutes),{kind:"chartTimes",payload:i}}case"imageTime":{let t=e.payload,i={id:t.id,rules:zt(t.rules),frame:Pt(t.frame),isHidden:t.isHidden};return t.image!==""&&(i.image=t.image),{kind:"imageTime",payload:i}}case"chartDots":{let t=e.payload,i={id:t.id,rules:zt(t.rules),frame:Pt(t.frame),isHidden:t.isHidden,chart:t.chart};_o(t.dots)!=="auto"&&(i.dots="all");let a=Ot(t.size);return a!==void 0&&(i.size=Y(a)),t.colorHex!==void 0&&(i.colorHex=t.colorHex),{kind:"chartDots",payload:i}}case"chartGrid":{let t=e.payload,i={id:t.id,rules:zt(t.rules),frame:Pt(t.frame),isHidden:t.isHidden,chart:t.chart},a=bi(t.lines);a!==Nn&&(i.lines=a);let r=Mn(t.colorHex);ia(r,cn)||(i.colorHex=r);let o=xi(t.thickness);return o!==_n&&(i.thickness=Y(o)),{kind:"chartGrid",payload:i}}case"list":{let t=e.payload,i={id:t.id,rules:zt(t.rules),frame:Pt(t.frame),isHidden:t.isHidden};t.opacity!==void 0&&t.opacity!==1&&(i.opacity=Y(t.opacity)),t.shadow!==void 0&&(i.shadow={colorHex:t.shadow.colorHex,radius:Y(t.shadow.radius),dx:Y(t.shadow.dx),dy:Y(t.shadow.dy)}),i.source=yv(t.source);let a=Xe(t.rows);a!==vr&&(i.rows=a),t.direction==="across"&&(i.direction="across");let r=Sr(t.columns);r!==kr&&(i.columns=r);let o=Ti(t.gap);return o!==$r&&(i.gap=Y(o)),t.template.length>0&&(i.template=t.template.map(hf)),{kind:"list",payload:i}}}}function yv(e){switch(e.kind){case"entities":{let n={kind:"entities",scope:pf({function:"count",scope:e.scope}).scope},t=(e.deviceClass??"").trim();return t!==""&&(n.deviceClass=t),e.stateFilter&&(n.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.sort!=="name"&&(n.sort=e.sort),e.descending&&(n.descending=!0),e.attributes.length>0&&(n.attributes=[...e.attributes]),n}case"attribute":return{kind:"attribute",...mt(e),attribute:e.attribute};case"template":return{kind:"template",value:e.value};case"calendar":{let n={kind:"calendar",entities:e.entities.map(mt)},t=hs(e.hours);return t!==Cr&&(n.hours=t),n}case"todo":{let n={kind:"todo",entities:e.entities.map(mt)};return e.status!=="open"&&(n.status=e.status),e.sort!=="list"&&(n.sort=e.sort),n}case"forecast":{let n={kind:"forecast",...mt(e)};return e.type!=="hourly"&&(n.type=e.type),n}}}function bv(e){let n={},t=Object.keys(e.placements);if(t.length>0){let i={};for(let a of t){let r=e.placements[a],o={frame:Pt(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=Y(r.size)),i[a]=o}n.placements=i}if(e.bezelText&&(n.bezelText=fe(e.bezelText)),e.bezelCountdown===!0&&(n.bezelCountdown=!0),e.curvedText&&(n.curvedText=fe(e.curvedText)),e.curvedColorHex!==void 0&&(n.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:fe(i.value),minValue:Y(i.minValue),maxValue:Y(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=fe(i.minLabel)),i.maxLabel&&(a.maxLabel=fe(i.maxLabel)),n.bezelGauge=a}return e.backgroundColorHex!==void 0&&(n.backgroundColorHex=e.backgroundColorHex),e.backgroundFill!==void 0&&(n.backgroundFill=Io(e.backgroundFill)),n.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n.borderWidth=Y(e.borderWidth),e.rules.length>0&&(n.rules=zt(e.rules)),n}function ff(e){if(e.type==="callService"){let n={type:e.type,serviceDomain:e.serviceDomain,serviceName:e.serviceName};return e.serviceDataJSON!==void 0&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),e.target!==void 0&&e.target.entityId!==""&&Object.assign(n,mt(e.target)),n}return"entityId"in e?{type:e.type,...mt(e)}:{type:e.type}}function xv(e){if(e.kind==="template")return{kind:"template",value:e.value};if(e.kind==="entity")return{kind:"entity",...mt(e)};let n={kind:"list",source:e.source};return e.entities!==void 0&&(n.entities=[...e.entities]),e.entity_id!==void 0&&(n.entity_id=e.entity_id),e.hours!==void 0&&(n.hours=e.hours),e.status!==void 0&&(n.status=e.status),e.sort!==void 0&&(n.sort=e.sort),e.type!==void 0&&(n.type=e.type),n.limit=e.limit,n}function wv(e){let n={};return e.label!==void 0&&(n.label=e.label),n.value=fe(e.value),e.symbol!==void 0&&(n.symbol=e.symbol),e.countdown&&(n.countdown=!0),n}function fa(e){let n=[];for(let i of de){let a=e.perFamily[i];a&&n.push(i,bv(a))}let t={schemaVersion:yi(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:fe(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(hf),supportedFamilies:e.supportedFamilies,perFamily:n,dataSources:e.dataSources.map(xv),tapAction:ff(e.tapAction)};return e.inline!==void 0&&(t.inline=wv(e.inline)),e.refreshMinutes!==void 0&&(t.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(t.openPageId=e.openPageId),e.openPageName!==void 0&&(t.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(t.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(t.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(t.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),e.hidden===!0&&(t.hidden=!0),t}function mf(e){return U(e)&&e.hidden===!0}function gf(e,n){let t={...e};return n?t.hidden=!0:delete t.hidden,t}function yf(e,n,t){let i=[],a=[];for(let r of e){let o=n(r);o!==void 0&&o.hidden&&o.id!==t?a.push(r):i.push(r)}return{shown:i,hidden:a}}function kt(e,n){let i=e.elements.find(a=>a.payload.id===n)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function $t(e,n){return e.elements.filter(t=>t.payload.groupId===n&&!we(e,t))}function bf(e,n){let t=new Set;for(let i of n){let a=kt(e,i);if(a)for(let r of $t(e,a.id))t.add(r.payload.id);else t.add(i)}return e.elements.filter(i=>t.has(i.payload.id)&&i.kind!=="chartDots"&&i.kind!=="chartGrid"&&i.payload.chartAnchor===void 0).map(i=>i.payload.id)}function _t(e){let n=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!n.has(a.payload.groupId)&&delete a.payload.groupId;let t=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>t.has(a.id));i.length===0?delete e.groups:e.groups=i}function ma(e){if(!e.groups?.length)return;let n=e.elements.filter(r=>!we(e,r)),t=e.elements.filter(r=>we(e,r)),i=[],a=new Set;for(let r=n.length-1;r>=0;r--){let o=n[r];if(a.has(o.payload.id))continue;let s=o.payload.groupId;if(s===void 0){i.unshift(o),a.add(o.payload.id);continue}let l=n.filter(c=>c.payload.groupId===s);for(let c=l.length-1;c>=0;c--)i.unshift(l[c]),a.add(l[c].payload.id)}e.elements=[...i,...t],Un(e)}function vv(e){let n=new Set((e.groups??[]).map(i=>i.name.trim())),t=1;for(;n.has(`Group ${t}`);)t++;return`Group ${t}`}function cc(e,n,t=vv(e)){let i=e.elements.filter(r=>n.includes(r.payload.id)&&!we(e,r));if(i.length<2)return;let a={id:re(),name:t,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return _t(e),ma(e),a.id}function ga(e,n){for(let t of e.elements)t.payload.groupId===n&&delete t.payload.groupId;_t(e)}function Tr(e,n,t){let i=e.elements.find(a=>a.payload.id===n);!i||we(e,i)||(t===void 0?delete i.payload.groupId:i.payload.groupId=t,_t(e),ma(e))}var ie={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups","hidden"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","duration","timestamp","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],chartAnchor:["layer","at","place","dx","dy"],fill:["kind","stops","angle"],fillStop:["at","colorHex"],level:["value","minValue","maxValue","minSource","maxSource","direction","trackColorHex"],gaugeTicks:["count","length","colorHex","majorEvery"],gaugeLabels:["show","size","colorHex"],arc:["radius","angle","sweep","spacing","flip"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","opacity","shadow","groupId","name","accentGroup"],shadow:["colorHex","radius","dx","dy"],text:["value","fontSize","fontWeight","countdown","monospacedDigits","lineLimit","fontDesign","fontWidth","italic","minimumScale","alignment","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex","parts","arc","chartAnchor"],textPart:["id","value","colorHex","fontWeight","fontSize","fontDesign","fontWidth","italic","coloring","bands","bandAboveColorHex"],icon:["symbol","path","viewBox","size","level","chartAnchor"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","total","minSource","maxSource","fill","ticks","labels"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes","highMarker","lowMarker","curve","fillStyle","fillColorHex","areaFill","barRadius","barCorners","smoothing","gaps","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","pointDots","pointDotSize","pointDotColorHex","gridLines","gridColorHex","zeroLine","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],timeline:["value","aggregate","historyMinutes","bands","otherColorHex","gap","cornerRadius","timeLabels","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes","drawsTimeLabels"],timelineAggregate:["entities","combine"],shape:["kind","cornerRadius","thickness","borderColorHex","borderWidth","fill","level","chartAnchor"],image:["entity","source","data","format","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY","chartAnchor"],tap:["action","openPageId","openPageName","attachedTo","grow"],chartTimes:["chart","timeLabelCount","labelSize","labelColorHex","hourCycle","minutes"],chartDots:["chart","dots","size","colorHex"],chartGrid:["chart","lines","colorHex","thickness"],imageTime:["image","size"],list:["source","rows","direction","columns","gap","template"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise","partId"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight","design","width","italic"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","backgroundFill","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName","serviceDomain","serviceName","serviceDataJSON"]},ph={literal:["kind","value"],entityState:["kind",...ie.entityRef],entityAttribute:["kind",...ie.entityRef,"attribute"],entityAge:["kind",...ie.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"],item:["kind","field"],listStat:["kind","layer","stat"]},kv={entities:["kind","scope","deviceClass","stateFilter","sort","descending","attributes"],attribute:["kind",...ie.entityRef,"attribute"],template:["kind","value"],calendar:["kind","entities","hours"],todo:["kind","entities","status","sort"],forecast:["kind",...ie.entityRef,"type"]};function ms(e){let n=[],t=(u,p,f)=>{if(U(u))for(let g of Object.keys(u))p.includes(g)||n.push(`${f}.${g}`)},i=(u,p)=>{if(!U(u))return;let f=typeof u.kind=="string"?u.kind:"";t(u,ph[f]??["kind"],p),f==="aggregate"&&U(u.aggregate)&&(t(u.aggregate,ie.aggregate,`${p}.aggregate`),t(u.aggregate.scope,ie.scope,`${p}.aggregate.scope`),U(u.aggregate.scope)&&Array.isArray(u.aggregate.scope.entities)&&u.aggregate.scope.entities.forEach((g,b)=>t(g,ie.entityRef,`${p}.aggregate.scope.entities[${b}]`)),t(u.aggregate.stateFilter,ie.stateFilter,`${p}.aggregate.stateFilter`))},a=(u,p)=>{if(U(u)){if(U(u.kind))t(u,ie.value,p),i(u.kind,`${p}.kind`);else{let f=typeof u.kind=="string"?u.kind:"";t(u,[...ph[f]??["kind"],"format"],p),f==="aggregate"&&i(u,p)}t(u.format,ie.format,`${p}.format`)}},r=(u,p)=>{U(u)&&(t(u,ie.fill,p),Array.isArray(u.stops)&&u.stops.forEach((f,g)=>t(f,ie.fillStop,`${p}.stops[${g}]`)))},o=(u,p)=>{Array.isArray(u)&&u.forEach((f,g)=>{t(f,ie.styleChange,`${p}[${g}]`),U(f)&&a(f.value,`${p}[${g}].value`)})},s=(u,p)=>{Array.isArray(u)&&u.forEach((f,g)=>{let b=`${p}[${g}]`;t(f,ie.rule,b),U(f)&&(Array.isArray(f.cases)&&f.cases.forEach((y,w)=>{let k=`${b}.cases[${w}]`;t(y,ie.case,k),U(y)&&(t(y.when,ie.condition,`${k}.when`),U(y.when)&&Array.isArray(y.when.tests)&&y.when.tests.forEach((S,R)=>{let O=`${k}.when.tests[${R}]`;t(S,ie.test,O),U(S)&&(a(S.value,`${O}.value`),t(S.comparison,ie.comparison,`${O}.comparison`),U(S.comparison)&&(a(S.comparison.value,`${O}.comparison.value`),a(S.comparison.upper,`${O}.comparison.upper`)))}),o(y.then,`${k}.then`))}),o(f.otherwise,`${b}.otherwise`))})};if(!U(e))return n;t(e,ie.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((u,p)=>t(u,ie.group,`$.groups[${p}]`)),Array.isArray(e.values)&&e.values.forEach((u,p)=>{t(u,ie.named,`$.values[${p}]`),U(u)&&a(u.value,`$.values[${p}].value`)});let l=(u,p)=>{if(!U(u))return;let f=typeof u.kind=="string"?u.kind:"";t(u,kv[f]??["kind"],p),f==="entities"&&(t(u.scope,ie.scope,`${p}.scope`),U(u.scope)&&Array.isArray(u.scope.entities)&&u.scope.entities.forEach((g,b)=>t(g,ie.entityRef,`${p}.scope.entities[${b}]`)),t(u.stateFilter,ie.stateFilter,`${p}.stateFilter`)),(f==="calendar"||f==="todo")&&Array.isArray(u.entities)&&u.entities.forEach((g,b)=>t(g,ie.entityRef,`${p}.entities[${b}]`))},c=(u,p)=>{if(t(u,ie.elementEnvelope,p),!U(u)||!U(u.payload))return;let f=typeof u.kind=="string"?u.kind:"",g=ie[f]??[];t(u.payload,[...ie.elementBase,...g],`${p}.payload`),t(u.payload.colorSlot,ie.colorSlot,`${p}.payload.colorSlot`),t(u.payload.frame,ie.frame,`${p}.payload.frame`),"chartAnchor"in u.payload&&t(u.payload.chartAnchor,ie.chartAnchor,`${p}.payload.chartAnchor`),"shadow"in u.payload&&t(u.payload.shadow,ie.shadow,`${p}.payload.shadow`);for(let b of["fill","areaFill"])b in u.payload&&r(u.payload[b],`${p}.payload.${b}`);if("ticks"in u.payload&&t(u.payload.ticks,ie.gaugeTicks,`${p}.payload.ticks`),"labels"in u.payload&&t(u.payload.labels,ie.gaugeLabels,`${p}.payload.labels`),U(u.payload.level)){let b=`${p}.payload.level`;t(u.payload.level,ie.level,b);for(let y of["value","minSource","maxSource"])y in u.payload.level&&a(u.payload.level[y],`${b}.${y}`)}s(u.payload.rules,`${p}.payload.rules`);for(let b of["value","symbol","nowIndex","total","minSource","maxSource"])b in u.payload&&a(u.payload[b],`${p}.payload.${b}`);if(f==="text"&&"arc"in u.payload&&t(u.payload.arc,ie.arc,`${p}.payload.arc`),f==="timeline"&&"aggregate"in u.payload&&t(u.payload.aggregate,ie.timelineAggregate,`${p}.payload.aggregate`),f==="text"&&Array.isArray(u.payload.parts)&&u.payload.parts.forEach((b,y)=>{t(b,ie.textPart,`${p}.payload.parts[${y}]`),U(b)&&a(b.value,`${p}.payload.parts[${y}].value`)}),f==="image"&&t(u.payload.entity,ie.entityRef,`${p}.payload.entity`),f==="tap"&&t(u.payload.action,ie.tapAction,`${p}.payload.action`),f==="list"){l(u.payload.source,`${p}.payload.source`);let b=Array.isArray(u.payload.template)?u.payload.template:[];b.length>pa&&n.push(`${p}.payload.template.length`),b.forEach((y,w)=>{let k=`${p}.payload.template[${w}]`;U(y)&&qh.includes(String(y.kind))?n.push(`${k}.kind`):c(y,k)})}};Array.isArray(e.elements)&&e.elements.forEach((u,p)=>c(u,`$.elements[${p}]`));let d=[];if(Array.isArray(e.perFamily))for(let u=0;u+1<e.perFamily.length;u+=2)d.push([String(e.perFamily[u]),e.perFamily[u+1]]);else U(e.perFamily)&&d.push(...Object.entries(e.perFamily));for(let[u,p]of d){let f=`$.perFamily.${u}`;if(t(p,ie.layout,f),!!U(p)){if(U(p.placements))for(let[g,b]of Object.entries(p.placements))t(b,ie.placement,`${f}.placements.${g}`),U(b)&&t(b.frame,ie.frame,`${f}.placements.${g}.frame`);if(a(p.bezelText,`${f}.bezelText`),a(p.curvedText,`${f}.curvedText`),"backgroundFill"in p&&r(p.backgroundFill,`${f}.backgroundFill`),U(p.bezelGauge)){let g=`${f}.bezelGauge`;t(p.bezelGauge,ie.bezelGauge,g),a(p.bezelGauge.value,`${g}.value`),a(p.bezelGauge.minLabel,`${g}.minLabel`),a(p.bezelGauge.maxLabel,`${g}.maxLabel`)}s(p.rules,`${f}.rules`)}}return U(e.inline)&&(t(e.inline,ie.inline,"$.inline"),a(e.inline.value,"$.inline.value")),t(e.tapAction,ie.tapAction,"$.tapAction"),n}function re(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let n=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),t=(8+Math.floor(Math.random()*4)).toString(16)+n().slice(1);return`${n()}${n()}-${n()}-4${n().slice(1)}-${t}-${n()}${n()}${n()}`.toUpperCase()}function wn(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function xf(e,n,t=[...hd]){let i={};for(let r of de)t.includes(r)&&(i[r]=wn());let a={schemaVersion:4,id:re(),name:e,values:[],slotIndex:n,elements:[],supportedFamilies:ja.filter(r=>t.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return t.includes("inline")&&(a.inline={value:K("Text")}),a.schemaVersion=yi(a),a}function Le(e){let n=t=>({id:re(),colorSlot:{baseColorHex:t},rules:[],frame:{...ir},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...n("#FFFFFF"),value:K("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...n("#FFFFFF"),symbol:K("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...n("#FFFFFF"),value:K("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40",coloring:"uniform",bands:[],bandAboveColorHex:xe,thresholdColorHex:oa}};case"chart":return{kind:e,payload:{...n("#FFFFFF"),value:K("13,14,16,17,19,22,24,28,30"),historyMinutes:ns,historyPoints:24,source:bd,statPeriod:tr,statType:nr,style:"bars",curve:"smooth",fillStyle:"fade",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:gt,lowColorHex:yt,marker:"none",coloring:"uniform",bands:[],bandAboveColorHex:xe,fillBands:!1,thresholdColorHex:Ad,nowColorHex:Id,timeLabelCount:ui,labelSize:bt,labelColorHex:xt,labelsAbove:!1,hourCycle:pi,minutes:hi}};case"timeline":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,value:K(""),historyMinutes:Gw,bands:[],otherColorHex:zw,gap:0,cornerRadius:Ow,timeLabelCount:Vh,labelSize:bt,labelColorHex:xt,labelsAbove:!1,hourCycle:pi,minutes:hi}}}case"shape":return{kind:e,payload:{...n("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,thickness:1,borderWidth:1}};case"image":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},source:"camera",contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:ua,timestampCorner:"topLeading",timestampSize:ss}}}case"tap":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}case"chartTimes":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",timeLabelCount:ui,labelSize:bt,labelColorHex:xt,hourCycle:pi,minutes:hi}}}case"imageTime":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,image:""}}}case"chartDots":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",dots:"auto"}}}case"chartGrid":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",lines:Nn,colorHex:cn,thickness:_n}}}case"list":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,source:{kind:"entities",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},sort:"name",descending:!1,attributes:[]},rows:vr,direction:"down",columns:kr,gap:$r,template:[]}}}}}function K(e){return{kind:{kind:"literal",value:e}}}function gs(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"timeline":return;case"shape":return;case"image":return;case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return;case"list":return}}var hh=["circular","corner"],fh=Math.SQRT1_2;function $v(e){return e==="text"||e==="icon"?4:.5}function ys(e,n,t,i){let a=structuredClone(e),r=ue[n],o=ue[t];if(n===t||!r||!o)return a;let s=hh.includes(n),l=hh.includes(t),c=s===l?1:l?fh:1/fh,d=Math.min(o.width/r.width,o.height/r.height)*c;if(c!==1){let u=a.frame,p=u.x+u.width/2,f=u.y+u.height/2;a.frame={...u,width:u.width*c,height:u.height*c,x:.5+(p-.5)*c-u.width*c/2,y:.5+(f-.5)*c-u.height*c/2}}return a.size!==void 0&&(a.size=Math.max($v(i),Math.round(a.size*d*10)/10)),a}function uc(e,n){if(!n)return e;let t={...e.payload,frame:n.frame,isHidden:n.isHidden};return n.size!==void 0&&(e.kind==="text"?t.fontSize=n.size:e.kind==="icon"?t.size=n.size:(e.kind==="gauge"||e.kind==="chart")&&(t.lineWidth=n.size)),{kind:e.kind,payload:t}}function wf(e,n){let t=e.perFamily[n];return!t||Object.keys(t.placements).length===0?e.elements:e.elements.map(i=>uc(i,t.placements[i.payload.id]))}function ya(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"timeline":return e.payload.value;case"shape":return;case"image":return e.payload.source==="inline"?void 0:{kind:{kind:"entityState",...e.payload.entity}};case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return;case"list":return}}function Qa(e){let n=[],t=i=>{for(let a of i)a.value&&n.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)n.push(r.value),r.comparison.value&&n.push(r.comparison.value),r.comparison.upper&&n.push(r.comparison.upper);t(a.then)}i.otherwise&&t(i.otherwise)}return n}var pc=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function pd(e,n){let t,i=n;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=nc(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return t===void 0?{ref:o}:{ref:o,namedId:t}}if(r.kind!=="named")return;t=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===t)?.value}}function bs(e,n){return pd(e,ya(n))?.ref}function hc(e,n){let t=bs(e,n),i=t&&(t.domain||t.entityId.split(".")[0])||"";return t&&pc.includes(i)?{type:"toggleEntity",...t,domain:i}:{type:"refresh"}}function mh(e,n,t){if(cs(n)||t.width<=0||t.height<=0)return{...e};let i=n,a=e.x-i.left/t.width,r=e.x+e.width+i.right/t.width,o=e.y-i.top/t.height,s=e.y+e.height+i.bottom/t.height;return r<a&&(a=r=(a+r)/2),s<o&&(o=s=(o+s)/2),a=Mt(a),r=Mt(r),o=Mt(o),s=Mt(s),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,s-o)}}function vf(e,n,t){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-n.x)*t.width),right:i((n.x+n.width-e.x-e.width)*t.width),top:i((e.y-n.y)*t.height),bottom:i((n.y+n.height-e.y-e.height)*t.height)}}function kf(e,n,t,i){let a=e.elements.find(p=>p.payload.id===n);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(p=>p.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[t]?.placements[r.payload.id]?.frame??r.payload.frame,s=Mt(i.x),l=Mt(i.y),c=Mt(i.x+i.width),d=Mt(i.y+i.height),u={...i,x:s,y:l,width:Math.max(0,c-s),height:Math.max(0,d-l)};a.payload.outset=vf(o,u,ue[t])}function $f(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i)return;let a=e.perFamily[t];if(!a)return;let r=a.placements[n]?.frame??i.payload.frame,o=ue[t];return{width:r.width*o.width,height:r.height*o.height}}function lt(e,n){return e.elements.filter(t=>t.kind==="tap"&&t.payload.attachedTo===n)}function we(e,n){return n.kind!=="tap"||n.payload.attachedTo===void 0?!1:e.elements.some(t=>t.payload.id===n.payload.attachedTo&&t.kind!=="tap")}function ba(e,n){for(let t of e.elements)if(t.kind==="list"&&t.payload.template.some(i=>i.payload.id===n))return t}function xs(e,n){let t=e.elements.find(i=>i.payload.id===n);if(!t)return ba(e,n)?.payload.id;if(t.kind==="tap"&&t.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===t.payload.attachedTo);if(i)return i.payload.id}return t.payload.id}function Un(e){let n=new Map(e.elements.map(a=>[a.payload.id,a])),t=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=n.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let s=t.get(r);s?s.push(a):t.set(r,[a])}if(t.size===0)return;for(let[a,r]of t){let o=n.get(a);for(let s of r){let l=s.payload;l.outset===void 0&&(l.outset=vf(o.payload.frame,l.frame,ue.rectangular));let c=l.outset,d=!cs(c);s.payload.frame=mh(o.payload.frame,c,ue.rectangular),s.payload.isHidden=o.payload.isHidden;let u=Rv(e,a);for(let p of de){let f=e.perFamily[p];if(!f)continue;let g=ue[p],b=f.placements[a];p!==u||!b?delete f.placements[s.payload.id]:d?f.placements[s.payload.id]={frame:mh(b.frame,c,g),isHidden:b.isHidden}:f.placements[s.payload.id]={frame:{...b.frame},isHidden:b.isHidden}}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=t.get(a.payload.id);r&&i.push(...r)}e.elements=i}function ws(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind==="tap")return;let a=lt(e,n)[0];if(a)return a.payload;let r=Le("tap"),o=r.payload;return o.attachedTo=n,o.outset={...Bd},o.action=t??hc(e,i),e.elements.push(r),Un(e),o}function vs(e,n){let t=lt(e,n).map(i=>i.payload.id);if(t.length!==0){e.elements=e.elements.filter(i=>!t.includes(i.payload.id));for(let i of de)for(let a of t)delete e.perFamily[i]?.placements[a]}}function Se(e,n){for(let a of Bn(e,n))Se(e,a.payload.id);for(let a of Vn(e,n))Se(e,a.payload.id);for(let a of Ri(e,n))Se(e,a.payload.id);for(let a of Mi(e,n))Se(e,a.payload.id);for(let a of fs(e,n))Se(e,a.payload.id);for(let a of qe(e,n))delete a.payload.chartAnchor;let t=e.elements.find(a=>a.payload.id===n);vs(e,n),e.elements=e.elements.filter(a=>a.payload.id!==n);let i=t?.payload.chartAnchor;if(i&&(i.at==="threshold"||i.at==="now")&&!qe(e,i.layer).some(a=>a.payload.chartAnchor?.at===i.at)){let a=e.elements.find(r=>r.payload.id===i.layer);a?.kind==="chart"&&(i.at==="threshold"?(delete a.payload.thresholdValue,delete a.payload.drawsThreshold):(delete a.payload.nowIndex,delete a.payload.drawsNowLine))}for(let a of e.elements)a.kind==="chart"&&a.payload.scaleFrom===n&&delete a.payload.scaleFrom;for(let a of de)delete e.perFamily[a]?.placements[n];if(t?.kind==="list")for(let a of t.payload.template)for(let r of de)delete e.perFamily[r]?.placements[a.payload.id];Un(e),_t(e),t&&Sv(e,t.payload.groupId,Cv(t))}function Cv(e){if(e.payload.chartAnchor)return e.payload.chartAnchor.layer;switch(e.kind){case"text":return e.payload.value.kind.kind==="chartStat"?e.payload.value.kind.layer:void 0;case"chartTimes":return e.payload.chart;case"chartDots":return e.payload.chart;case"chartGrid":return e.payload.chart;case"imageTime":return e.payload.image;default:return}}function Sv(e,n,t){if(n===void 0||t===void 0||!e.groups?.some(a=>a.id===n))return;let i=$t(e,n);i.length===1&&i[0].payload.id===t&&ga(e,n)}function Cf(e,n){let t=e.elements.findIndex(l=>l.payload.id===n),i=e.elements[t];if(!i)return;let a=re(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],s=[[n,a]];for(let l of lt(e,n)){let c=structuredClone(l);c.payload.id=re(),c.payload.attachedTo=a,o.push(c),s.push([l.payload.id,c.payload.id])}e.elements.splice(t+1,0,...o);for(let l of de){let c=e.perFamily[l];if(c)for(let[d,u]of s){let p=c.placements[d];p&&(c.placements[u]=structuredClone(p))}}return Un(e),a}function Tv(e,n){let t=/^(.*\S) \d+$/.exec(e)?.[1]??e,i=new Set(n),a=2;for(;i.has(`${t} ${a}`);)a++;return`${t} ${a}`}function Sf(e,n,t){let i=e.elements.findIndex(s=>s.payload.id===n),a=e.elements[i];if(!a||a.kind!=="chart")return;let r=re(),o=structuredClone(a);o.payload.id=r,o.payload.scaleFrom=n,t&&(o.payload.name=Tv(t(a),e.elements.map(t))),e.elements.splice(i+1,0,o);for(let s of de){let l=e.perFamily[s],c=l?.placements[n];l&&c&&(l.placements[r]=structuredClone(c))}return r}function xa(e,n,t){let i=new Set,a=d=>{i.add(d);for(let u of lt(e,d))i.add(u.payload.id)};for(let d of n){a(d);for(let u of Bn(e,d))a(u.payload.id)}let r=e.elements.filter(d=>i.has(d.payload.id)).map(d=>structuredClone(d)),o=r.flatMap(d=>d.kind==="list"?[d.payload.id,...d.payload.template.map(u=>u.payload.id)]:[d.payload.id]),s={};for(let d of de){let u=e.perFamily[d];if(!u)continue;let p={};for(let f of o){let g=u.placements[f];g&&(p[f]=structuredClone(g))}Object.keys(p).length>0&&(s[d]=p)}let l=new Set(r.map(d=>d.payload.groupId).filter(d=>d!==void 0)),c=(e.groups??[]).filter(d=>l.has(d.id)).map(d=>structuredClone(d));return{elements:r,placements:s,groups:c,...t!==void 0?{family:t}:{}}}function Tf(e,n,t){let i=n.family,a=i!==void 0&&i!==t&&ld(i);if(!ld(t))return gi(e,n);let r=gi(e,n,a?{nudge:!1}:{}),o=e.perFamily[t]??(e.perFamily[t]=wn());for(let s of r){let l=e.elements.find(p=>p.payload.id===s);if(!l)continue;let c=(i!==void 0?e.perFamily[i]?.placements[s]:void 0)??de.map(p=>e.perFamily[p]?.placements[s]).find(p=>p!==void 0),d=c?.size??gs(l),u={frame:{...c?.frame??l.payload.frame},isHidden:!1,...d!==void 0?{size:d}:{}};for(let p of de)p!==t&&delete e.perFamily[p]?.placements[s];o.placements[s]=a?ys(u,i,t,l.kind):u}return wa(e,t),r}function gi(e,n,t={}){let i=new Map;for(let u of n.elements)if(i.set(u.payload.id,re()),u.kind==="list")for(let p of u.payload.template)i.set(p.payload.id,re());let a=new Set(e.elements.map(u=>u.payload.id)),r=t.nudge!==!1&&n.elements.some(u=>a.has(u.payload.id)),o=u=>r?{...u,x:Math.min(.9,u.x+.05),y:Math.min(.9,u.y+.05)}:u,s=[];for(let u of n.elements){let p=structuredClone(u);if(p.payload.id=i.get(u.payload.id),p.kind==="tap"&&p.payload.attachedTo!==void 0){let f=i.get(p.payload.attachedTo);f?p.payload.attachedTo=f:delete p.payload.attachedTo}if(p.kind==="chart"&&p.payload.scaleFrom!==void 0){let f=i.get(p.payload.scaleFrom);f?p.payload.scaleFrom=f:a.has(p.payload.scaleFrom)||delete p.payload.scaleFrom}if(p.kind==="text")for(let f of p.payload.parts??[]){let g=f.value.kind,b=g.kind==="chartStat"?i.get(g.layer):void 0;g.kind==="chartStat"&&b&&(g.layer=b)}if(p.kind==="text"&&p.payload.value.kind.kind==="chartStat"){let f=i.get(p.payload.value.kind.layer);if(f)p.payload.value.kind.layer=f;else if(!a.has(p.payload.value.kind.layer))continue}if(p.kind==="chartTimes"||p.kind==="chartDots"||p.kind==="chartGrid"){let f=i.get(p.payload.chart);if(f)p.payload.chart=f;else if(!a.has(p.payload.chart))continue}if(p.kind==="imageTime"){let f=i.get(p.payload.image);if(f)p.payload.image=f;else if(!a.has(p.payload.image))continue}if(p.payload.chartAnchor!==void 0){let f=i.get(p.payload.chartAnchor.layer);f?p.payload.chartAnchor.layer=f:a.has(p.payload.chartAnchor.layer)||delete p.payload.chartAnchor}if(p.kind==="list")for(let f of p.payload.template){let g=i.get(f.payload.id);g&&(f.payload.id=g)}p.payload.frame=o(p.payload.frame),s.push(p)}let l=new Map;for(let u of n.groups){if(s.filter(g=>g.payload.groupId===u.id&&!(g.kind==="tap"&&g.payload.attachedTo!==void 0)).length<2)continue;let f=re();l.set(u.id,f),(e.groups??=[]).push({...structuredClone(u),id:f})}for(let u of s){if(u.payload.groupId===void 0)continue;let p=l.get(u.payload.groupId);p?u.payload.groupId=p:delete u.payload.groupId}e.elements.push(...s);let c=new Set(s.map(u=>u.payload.id)),d=new Set(s.flatMap(u=>u.kind==="list"?u.payload.template.map(p=>p.payload.id):[]));for(let u of de){let p=n.placements[u],f=e.perFamily[u];if(!(!p||!f))for(let[g,b]of Object.entries(p)){let y=i.get(g);y!==void 0&&(d.has(y)?f.placements[y]=structuredClone(b):c.has(y)&&(f.placements[y]={...structuredClone(b),frame:o(b.frame)}))}}return Un(e),_t(e),ma(e),s.filter(u=>!we(e,u)).map(u=>u.payload.id)}function Ev(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?!a.isHidden:!t.payload.isHidden}function Rv(e,n){let t=e.elements.find(r=>r.payload.id===n),a=(t&&t.kind==="tap"?t.payload.attachedTo:void 0)??n;return de.find(r=>e.supportedFamilies.includes(r)&&e.perFamily[r]?.placements[a]!==void 0)}function Ct(e,n){let t=e.perFamily[n];return t?e.elements.filter(i=>{let a=i.kind==="tap"?i.payload.attachedTo:void 0;return t.placements[a??i.payload.id]!==void 0}):[]}function Ef(e,n){let t=e.perFamily[n];return t?Ct(e,n).filter(i=>!we(e,i)&&!t.placements[i.payload.id]?.isHidden).length:0}function wa(e,n){let t=de.filter(s=>e.supportedFamilies.includes(s));if(t.length===0)return;let i=n!==void 0&&ld(n)&&t.includes(n)?n:t[0];for(let s of t)e.perFamily[s]||(e.perFamily[s]=wn());let a=()=>e.elements.filter(s=>!we(e,s)),r=new Map,o=new Set;if(n===void 0){let s=new Map(a().map(p=>[p.payload.id,t.filter(f=>Ev(e,f,p))]));for(let[p,f]of s)f[0]&&r.set(p,f[0]);let l=new Map([...a().entries()].map(([p,f])=>[f.payload.id,p]));for(let p of t){let f=a().filter(y=>(s.get(y.payload.id)??[]).includes(p)&&r.get(y.payload.id)!==p).map(y=>y.payload.id);if(f.length===0)continue;let g=xa(e,f,p),b=gi(e,g,{nudge:!1});b.forEach((y,w)=>{r.set(y,p);let k=b.length===f.length?f[w]:void 0;l.set(y,k!==void 0?l.get(k)??0:l.size)})}for(let p of a())r.has(p.payload.id)||o.add(p.payload.id);let c=p=>t.indexOf(r.get(p)??i),d=a().sort((p,f)=>c(p.payload.id)-c(f.payload.id)||(l.get(p.payload.id)??0)-(l.get(f.payload.id)??0)),u=[];for(let p of d)u.push(p),u.push(...lt(e,p.payload.id));e.elements=u}for(let s of a()){let l=s.payload.id,c=t.filter(f=>e.perFamily[f].placements[l]!==void 0),d=r.get(l)??c.find(f=>!e.perFamily[f].placements[l].isHidden)??c[0]??i,u=e.perFamily[d]?.placements[l],p={frame:{...u?.frame??s.payload.frame},isHidden:o.has(l)||u?.isHidden===!0,...u?.size!==void 0?{size:u.size}:{}};s.payload.isHidden=!0;for(let f of de){let g=e.perFamily[f];g&&(f===d?g.placements[l]=p:delete g.placements[l])}}}function ks(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t)return[];let i=[],a=pd(e,ya(t));if(a){let r=t.kind==="icon"?"symbol":t.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of lt(e,n)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of t.payload.rules)for(let o of r.cases)for(let s of o.when.tests){let l=pd(e,s.value);if(!l)continue;let c={where:"test",ref:l.ref,ruleId:r.id,caseId:o.id,testId:s.id};l.namedId!==void 0&&(c.namedId=l.namedId),i.push(c)}return i}function sd(e,n,t){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...n}};case"entityAge":return{...e,kind:{kind:"entityAge",...n}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...n,attribute:i.attribute}};case"literal":return t==="text"||t==="gauge"||t==="chart"||t==="timeline"?{...e,kind:{kind:"entityState",...n}}:void 0;default:return}}function Rf(e,n,t,i){let a=e.elements.find(o=>o.payload.id===n);if(!a||t.entityId==="")return;let r={...t,domain:t.domain||t.entityId.split(".")[0]||""};if(a.kind==="timeline"){let o=a.payload.value.kind.kind==="entityState"?a.payload.value.kind.entityId:void 0,s=sd(a.payload.value,r,a.kind);s&&(a.payload.value=s),(a.payload.bands.length===0||o!==r.entityId)&&(a.payload.bands=a.payload.aggregate!==void 0?na(rs):na(r.domain,i)),a.payload.aggregate!==void 0&&(a.payload.aggregate={...a.payload.aggregate,entities:a.payload.aggregate.entities.map((l,c)=>c===0?r.entityId:l)})}else if(a.kind==="image")a.payload.entity=r;else if(a.kind==="text"||a.kind==="gauge"||a.kind==="chart"){let o=sd(a.payload.value,r,a.kind);o&&(a.payload.value=o)}else if(a.kind==="icon"){let o=sd(a.payload.symbol,r,a.kind);o&&(a.payload.symbol=o)}for(let o of lt(e,n)){let s=o.payload;"entityId"in s.action&&(s.action={type:s.action.type,...r})}}var Mv={text:"text",icon:"icon",gauge:"gauge",chart:"chart",timeline:"timeline",shape:"shape",image:"picture",tap:"tap area",chartTimes:"clock times",chartDots:"chart dots",chartGrid:"chart grid",imageTime:"timestamp",list:"list"};function gh(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function yh(e){if(e.part==="template")return"Template text";if(e.part==="serviceData")return"Service data";let n=e.layerKind===void 0?"":Mv[e.layerKind],t=e.layerName?`${n} "${e.layerName}"`:n;if(e.part==="listSource")return`Items of ${t}`;if(e.part==="listRow")return t===""?"List row":`Row of ${t}`;switch(e.kind){case"named":return e.valueName?`Shared value "${e.valueName}"`:"Shared value";case"layer":case"image":return e.part==="total"?`Total on ${t}`:e.part==="gaugeMin"?`Min on ${t}`:e.part==="gaugeMax"?`Max on ${t}`:e.part==="nowIndex"?`Now marker on ${t}`:e.part==="level"?`Fill on ${t}`:e.part==="levelMin"?`Fill min on ${t}`:e.part==="levelMax"?`Fill max on ${t}`:e.part==="textPart"?`Part of ${t}`:e.part==="timelineGroup"?`Combined on ${t}`:`${gh(n)} layer${e.layerName?` "${e.layerName}"`:""}`;case"tap":return"Tap area";case"documentTap":return"Tap action";case"rule":return t===""?`Rule on the ${e.family??"shared"} shape`:`Rule on ${t}`;case"layout":{let i=gh(e.family??"");switch(e.part){case"curvedText":return`${i} curved text`;case"bezelGauge":return`${i} bezel gauge`;case"bezelGaugeMin":return`${i} bezel gauge low label`;case"bezelGaugeMax":return`${i} bezel gauge high label`;default:return`${i} bezel`}}case"inline":return"Inline"}}var Mf=/(['"])([a-z0-9_]+\.[a-z0-9_]+)\1/g,fc="{item.";function bh(e){return e.startsWith(fc)}function Ff(e){let n=[];for(let t of e.matchAll(Mf))t[2]!==void 0&&n.push(t[2]);return n}function mc(e,n){return n.size===0?e:e.replace(Mf,(t,i,a)=>{let r=n.get(a);return r===void 0?t:`${i}${r}${i}`})}function ta(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function Fv(e,n){if(n.payload.name)return n.payload.name;if(n.kind==="shape")return n.payload.kind==="roundedRectangle"?"rounded rectangle":n.payload.kind;if(n.kind==="tap")return"";if(n.kind==="image")return n.payload.entity.displayName||n.payload.entity.entityId;let t=ya(n)?.kind;if(t===void 0)return"";if(t.kind==="literal")return t.value;if("entityId"in t)return t.displayName||t.entityId;if(t.kind==="named"){let i=t.id.toUpperCase();return e.values.find(a=>a.id.toUpperCase()===i)?.name??""}return""}function Er(e,n){let t=(s,l)=>{n.value?.(s,l);let c=s.kind;if(c.kind==="jinja"){if(n.text){let u=n.text(c.value,{...l,part:"template"});u!==c.value&&(c.value=u)}return}if(c.kind==="aggregate"){let u=c.aggregate.scope;if(n.ref&&u.kind==="entities")for(let p=0;p<u.entities.length;p++){let f=n.ref(ta(u.entities[p]),l);f&&(u.entities[p]=f)}return}if(!n.ref||!("entityId"in c))return;let d=n.ref(ta(c),l);d&&(c.kind==="entityAttribute"?s.kind={kind:"entityAttribute",...d,attribute:c.attribute}:c.kind==="entityState"?s.kind={kind:"entityState",...d}:s.kind={kind:"entityAge",...d})},i=(s,l,c)=>{if(s.type==="callService"){if(n.ref&&s.target!==void 0&&!bh(s.target.entityId)&&s.target.entityId!==""){let u=n.ref(ta(s.target),l);u&&(s.target=u)}if(n.text&&s.serviceDataJSON!==void 0){let u=n.text(s.serviceDataJSON,{...l,part:"serviceData"});u!==s.serviceDataJSON&&(s.serviceDataJSON=u)}return}if(!n.ref||!("entityId"in s)||s.entityId===""||bh(s.entityId))return;let d=n.ref(ta(s),l);d&&c({type:s.type,...d})};for(let s of e.values)t(s.value,{kind:"named",valueId:s.id,valueName:s.name});let a=(s,l)=>{if(s.kind==="image"){if(n.ref){let d=n.ref(ta(s.payload.entity),{...l,kind:"image"});d&&(s.payload.entity=d)}}else if(s.kind==="tap"){let d=s.payload;i(d.action,{...l,kind:"tap"},u=>{d.action=u})}else{let d=ya(s);if(d&&t(d,l),s.kind==="text")for(let u of s.payload.parts??[])t(u.value,{...l,part:"textPart"});if(s.kind==="gauge"&&s.payload.total&&t(s.payload.total,{...l,part:"total"}),s.kind==="gauge"&&s.payload.minSource&&t(s.payload.minSource,{...l,part:"gaugeMin"}),s.kind==="gauge"&&s.payload.maxSource&&t(s.payload.maxSource,{...l,part:"gaugeMax"}),s.kind==="chart"&&s.payload.nowIndex&&t(s.payload.nowIndex,{...l,part:"nowIndex"}),s.kind==="icon"||s.kind==="shape"){let u=s.payload.level;u&&(t(u.value,{...l,part:"level"}),u.minSource&&t(u.minSource,{...l,part:"levelMin"}),u.maxSource&&t(u.maxSource,{...l,part:"levelMax"}))}if(s.kind==="timeline"&&n.ref&&s.payload.aggregate!==void 0){let u=s.payload.aggregate.entities;for(let p=0;p<u.length;p++){let f=u[p]??"";if(f==="")continue;let g=n.ref({entityId:f,displayName:"",domain:f.split(".")[0]??""},{...l,part:"timelineGroup"});g&&(u[p]=g.entityId)}}if(s.kind==="list"){r(s.payload.source,{...l,part:"listSource"});let u={...l,part:"listRow"};for(let p of s.payload.template)a(p,u)}}let c={...l,kind:"rule"};for(let d of Qa(s.payload.rules))t(d,c)},r=(s,l)=>{if(s.kind==="template"){if(n.text){let d=n.text(s.value,{...l,part:"template"});d!==s.value&&(s.value=d)}return}if(!n.ref)return;let c=(d,u)=>{if(d.entityId==="")return;let p=n.ref(ta(d),l);p&&u(p)};switch(s.kind){case"entities":if(s.scope.kind==="entities"){let d=s.scope.entities;for(let u=0;u<d.length;u++)c(d[u],p=>{d[u]=p})}return;case"calendar":case"todo":{let d=s.entities;for(let u=0;u<d.length;u++)c(d[u],p=>{d[u]=p});return}case"attribute":case"forecast":c(s,d=>{s.entityId=d.entityId,s.displayName=d.displayName,s.domain=d.domain,d.iconName!==void 0?s.iconName=d.iconName:delete s.iconName});return}};for(let s of e.elements)a(s,{kind:"layer",layerId:s.payload.id,layerKind:s.kind,layerName:Fv(e,s)});let o=Object.keys(e.perFamily).sort((s,l)=>{let c=ja.indexOf(s),d=ja.indexOf(l);return(c<0?ja.length:c)-(d<0?ja.length:d)});for(let s of o){let l=e.perFamily[s];if(!l)continue;let c={kind:"layout",family:s};l.bezelText&&t(l.bezelText,{...c,part:"bezelText"}),l.curvedText&&t(l.curvedText,{...c,part:"curvedText"});let d=l.bezelGauge;d&&(t(d.value,{...c,part:"bezelGauge"}),d.minLabel&&t(d.minLabel,{...c,part:"bezelGaugeMin"}),d.maxLabel&&t(d.maxLabel,{...c,part:"bezelGaugeMax"}));let u={kind:"rule",family:s};for(let p of Qa(l.rules))t(p,u)}e.inline&&t(e.inline.value,{kind:"inline"}),i(e.tapAction,{kind:"documentTap"},s=>{e.tapAction=s})}function jt(e,n){Er(e,{value:n})}function Af(e,n){return e.kind.kind==="named"&&e.kind.id.toUpperCase()===n.toUpperCase()}function Rr(e,n){let t=new Set;return jt(e,(i,a)=>{Af(i,n)&&t.add(a.layerId??`${a.kind}:${a.valueId??""}:${a.family??""}:${a.part??""}`)}),t.size}function Av(e,n){let t=new Set(e.values.map(a=>a.name.trim().toLowerCase())),i=n.trim()||"Value";if(!t.has(i.toLowerCase()))return i;for(let a=2;;a++){let r=`${i} ${a}`;if(!t.has(r.toLowerCase()))return r}}function gc(e,n,t){let i={id:re(),name:Av(e,t),value:{kind:structuredClone(n.kind)}},a={kind:{kind:"named",id:i.id}};return n.format&&!We(n.format)&&(a.format=structuredClone(n.format)),{named:i,ref:a}}function yc(e,n){if(n.kind.kind!=="named")return;let t=n.kind.id,i=e.values.find(o=>o.id.toUpperCase()===t.toUpperCase());if(!i)return;let a=n.format&&!We(n.format)?n.format:i.value.format,r={kind:structuredClone(i.value.kind)};return a&&!We(a)&&(r.format=structuredClone(a)),r}function bc(e,n){jt(e,t=>{if(!Af(t,n))return;let i=yc(e,t);i&&(t.kind=i.kind,i.format?t.format=i.format:delete t.format)}),e.values=e.values.filter(t=>t.id.toUpperCase()!==n.toUpperCase())}function xc(e,n){Er(e,{ref:n})}function va(e,n){Er(e,{text:n})}function wc(e,n){let t=[],i={ref:(a,r)=>{a.entityId!==""&&t.push({entityId:a.entityId,ref:a,where:yh(r)})}};return n&&(i.text=(a,r)=>{for(let o of Ff(a)){let s=o.split(".")[0]??"";n(o,s)&&t.push({entityId:o,ref:{entityId:o,displayName:"",domain:s},where:yh(r)})}return a}),Er(e,i),t}function vc(e,n,t){let i=new Set,a=new Set,r=s=>{s.kind==="named"&&s.valueId!==void 0?a.add(s.valueId.toUpperCase()):s.layerId!==void 0&&i.add(s.layerId)},o={ref:(s,l)=>{s.entityId===n&&r(l)}};t&&(o.text=(s,l)=>{for(let c of Ff(s))c===n&&t(c,c.split(".")[0]??"")&&r(l);return s}),Er(e,o);for(let s=a.size>0;s;)s=!1,jt(e,(l,c)=>{if(!(l.kind.kind!=="named"||!a.has(l.kind.id.toUpperCase())))if(c.kind==="named"&&c.valueId!==void 0){let d=c.valueId.toUpperCase();a.has(d)||(a.add(d),s=!0)}else c.layerId!==void 0&&i.add(c.layerId)});return Lf(e,i)}function If(e,n){let t=new Set([n.toUpperCase()]),i=new Set;for(let a=!0;a;)a=!1,jt(e,(r,o)=>{if(!(r.kind.kind!=="named"||!t.has(r.kind.id.toUpperCase())))if(o.kind==="named"&&o.valueId!==void 0){let s=o.valueId.toUpperCase();t.has(s)||(t.add(s),a=!0)}else o.layerId!==void 0&&i.add(o.layerId)});return Lf(e,i)}function Lf(e,n){let t=new Set;for(let i of e.elements)n.has(i.payload.id)&&t.add(we(e,i)&&i.kind==="tap"?i.payload.attachedTo:i.payload.id);return e.elements.map(i=>i.payload.id).filter(i=>t.has(i))}var Mr={text:["color","opacity","text","fontSize","fontWeight","fontDesign","fontWidth","italic","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],timeline:["opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],chartTimes:["opacity","rotation","visibility"],chartDots:["opacity","visibility"],chartGrid:["opacity","visibility"],imageTime:["opacity","rotation","visibility"],list:["opacity","rotation","visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},Hf=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","timeBetween","contains","startsWith","endsWith","matchesRegex","isOneOf"];function Fi(e){let n=e.trim();return/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(n)?n:void 0}function Ai(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"timeBetween":return"times";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function $s(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setFontDesign":return"design";case"setFontWidth":return"width";case"setItalic":return"italic";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function kc(){return{id:re(),value:K(""),comparison:{kind:"isOn"}}}function $c(){return{id:re(),when:{join:"all",tests:[kc()]},then:[]}}function ka(){return{id:re(),cases:[$c()]}}function xh(e,n){return e&&(e.kind.kind!=="literal"||Fi(e.kind.value)!==void 0)?e:K(n)}function Cc(e,n){let t={kind:n};switch(Ai(n)){case"value":t.value=e.value??K("");break;case"between":t.value=e.value??K(""),t.upper=e.upper??K("");break;case"times":t.value=xh(e.value,"22:00"),t.upper=xh(e.upper,"06:00");break;case"pattern":t.pattern=e.pattern??"";break;case"options":t.options=e.options??[];break;case"none":break}return t}function Wn(e){let n={kind:e};switch($s(e)){case"value":n.value=K(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":n.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":n.weight="bold";break;case"design":n.design="rounded";break;case"width":n.width="condensed";break;case"italic":n.italic=!0;break;case"none":break}return n}function Cs(e){let n=new TextEncoder().encode(e),t=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of n)t^=BigInt(r),t=t*i&a;return t.toString(16)}function Nf(e){return new Map(e.map(n=>[n.id.toUpperCase(),n.value]))}function _f(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function $a(e,n,t=0){let i=n instanceof Map?n:Nf(n),a=e.kind;if(a.kind==="named"){if(t>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?$a(o,i,t+1):_f(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!_f(a))return;let r=Fr(a);if(r!==void 0)return"e_"+Cs(r)}function Je(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Df(e){let n;if(e.scope.kind==="entities")n=`expand([${e.scope.entities.map(t=>Je(t.entityId)).join(", ")}])`;else{let{domains:t,areaIds:i,labelIds:a,floorIds:r}=e.scope;if(!(i.length+a.length+r.length>0))n=t.length===0?"[]":"("+t.map(s=>`(states.${s} | list)`).join(" + ")+")";else{let s=[];for(let l of i)s.push(`area_entities(${Je(l)})`);for(let l of a)s.push(`label_entities(${Je(l)})`);r.length>0&&s.push(`((${r.map(l=>`floor_areas(${Je(l)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),n=`(expand(${s.join(" + ")})`,t.length>0&&(n+=` | selectattr('domain', 'in', [${t.map(Je).join(", ")}])`),n+=")"}}return n}function Pf(e){return e?e.kind==="isOn"?" | selectattr('state', 'eq', 'on')":e.kind==="isOff"?" | selectattr('state', 'eq', 'off')":e.kind==="equals"?` | selectattr('state', 'eq', ${Je(e.value)})`:` | rejectattr('state', 'eq', ${Je(e.value)})`:""}function Iv(e){let n=Df(e)+Pf(e.stateFilter);if(e.function==="count")return`(${n} | list | count)`;let t=e.attribute?`attributes.${e.attribute}`:"state",i=`${n} | map(attribute=${Je(t)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${i} | sum)`;case"average":return`(${i} | average(0))`;case"min":return`(${i} | min(default=0))`;case"max":return`(${i} | max(default=0))`}}var Lv=" | rejectattr('state', 'in', ['unavailable', 'unknown'])";function zf(e,n){let t=Xe(n);switch(e.kind){case"entities":{let i=e.stateFilter,a=i?.kind==="equals"&&(i.value==="unavailable"||i.value==="unknown"),r=(e.deviceClass??"").trim(),o=r===""?"":` | selectattr('attributes.device_class', 'eq', ${Je(r)})`,s=`(${Df(e)})${a?"":Lv}${o}${Pf(i)}`,l=e.attributes.map(u=>`, 'attr.${u}': s.attributes.get(${Je(u)})`).join(""),c=e.descending?"true":"false",d=e.sort==="state"?`((ns.items | rejectattr('n', 'none') | sort(attribute='n', reverse=${c}) | list) + (ns.items | selectattr('n', 'none') | sort(attribute='state', reverse=${c}) | list))`:`(ns.items | sort(attribute='${e.sort==="lastChanged"?"lastChanged":"name"}', reverse=${c}) | list)`;return`{% set ns = namespace(items=[]) %}{% for s in ${s} %}{% set ns.items = ns.items + [{'entityId': s.entity_id, 'name': s.name[:120], 'state': s.state[:120], 'unit': s.attributes.get('unit_of_measurement'), 'domain': s.domain, 'deviceClass': s.attributes.get('device_class'), 'area': area_name(s.entity_id), 'lastChanged': (as_timestamp(s.last_changed) | round(0)), 'n': (s.state | float(none))${l}}] %}{% endfor %}{% set sorted = ${d} %}{{ {'items': sorted[:${t}], 'total': (sorted | count)} | to_json }}`}case"attribute":return`{% set a = state_attr(${Je(e.entityId)}, ${Je(e.attribute)}) %}{% if a is string or a is mapping or a is not iterable %}{% set a = [] %}{% endif %}{% set a = a | list %}{{ {'items': a[:${t}], 'total': (a | count)} | to_json }}`;case"template":{let i=e.value.trim();return i.length===0?void 0:i}default:return}}function Kn(e,n){let t=zf(e,n);return t===void 0?void 0:"e_"+Cs(t)}function vn(e){let n=t=>t.map(i=>i.entityId).filter(i=>i!=="");switch(e.kind){case"calendar":{let t=n(e.entities);return t.length===0?void 0:`calendar|${t.join(",")}|${e.hours}`}case"todo":{let t=n(e.entities);return t.length===0?void 0:`todo|${t.join(",")}|${e.status}|${e.sort}`}case"forecast":return e.entityId===""?void 0:`forecast|${e.entityId}|${e.type}`;default:return}}function Hv(e,n){let t=Xe(n),i=a=>a.map(r=>r.entityId).filter(r=>r!=="");switch(e.kind){case"calendar":{let a=i(e.entities);return a.length===0?void 0:{source:"calendar",entities:a,hours:e.hours,limit:t}}case"todo":{let a=i(e.entities);return a.length===0?void 0:{source:"todo",entities:a,status:e.status,sort:e.sort,limit:t}}case"forecast":return e.entityId===""?void 0:{source:"forecast",entity_id:e.entityId,type:e.type,limit:t};default:return}}function _v(e){let n=[];for(let t of e.elements)t.kind==="list"&&n.push(t.payload);return n}function Sc(e){let n=new Map;for(let t of _v(e)){let i=vn(t.source),a=Hv(t.source,t.rows);if(i===void 0||a===void 0)continue;let r=n.get(i);r===void 0?n.set(i,a):a.limit>r.limit&&n.set(i,{...r,limit:a.limit})}return new Map([...n.entries()].sort(([t],[i])=>t<i?-1:t>i?1:0))}function Fr(e){switch(e.kind){case"entityAttribute":return`state_attr(${Je(e.entityId)}, ${Je(e.attribute)})`;case"entityAge":{let n=Je(e.entityId);return`(((now() - states[${n}].last_changed).total_seconds() if states[${n}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return Iv(e.aggregate);default:return}}function Ar(e){let n=new Map,t=new Map,i=Nf(e.values),a=(s,l=0)=>{let c=s.kind;switch(c.kind){case"literal":case"dataAge":case"chartStat":case"item":case"listStat":return;case"entityState":n.set(c.entityId,c);return;case"named":{if(l>8)return;let d=i.get(c.id.toUpperCase());if(!d)return;if(d.kind.kind==="named"){a(d,l+1);return}if(d.kind.kind==="entityState"){n.set(d.kind.entityId,d.kind);return}let u=Fr(d.kind);if(u===void 0)return;t.set("n_"+c.id.toLowerCase().replace(/-/g,""),u);return}default:{let d=Fr(c);if(d===void 0)return;t.set("e_"+Cs(d),d)}}},r=s=>{let l=ya(s);if(l&&a(l),s.kind==="text")for(let c of s.payload.parts??[])a(c.value);if(s.kind==="gauge"&&s.payload.total&&a(s.payload.total),s.kind==="gauge"&&s.payload.minSource&&a(s.payload.minSource),s.kind==="gauge"&&s.payload.maxSource&&a(s.payload.maxSource),s.kind==="chart"&&s.payload.nowIndex&&a(s.payload.nowIndex),s.kind==="icon"||s.kind==="shape"){let c=s.payload.level;c&&(a(c.value),c.minSource&&a(c.minSource),c.maxSource&&a(c.maxSource))}if(s.kind==="list"){let c=zf(s.payload.source,s.payload.rows);c!==void 0&&t.set("e_"+Cs(c),c);for(let d of s.payload.template)r(d)}for(let c of Qa(s.payload.rules))a(c)};for(let s of e.values)a({kind:{kind:"named",id:s.id}});for(let s of e.elements)r(s);for(let s of de){if(!e.supportedFamilies.includes(s))continue;let l=e.perFamily[s];if(l){l.bezelText&&a(l.bezelText),l.curvedText&&a(l.curvedText),l.bezelGauge&&(a(l.bezelGauge.value),l.bezelGauge.minLabel&&a(l.bezelGauge.minLabel),l.bezelGauge.maxLabel&&a(l.bezelGauge.maxLabel));for(let c of Qa(l.rules))a(c)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let o={entities:n,expressions:t};return t.size>0&&(o.document=Nv(t)),o}function Nv(e){let n=[...e.keys()].sort(),t=[];for(let a of n){let r=e.get(a);r.includes("{{")||r.includes("{%")?t.push(`{% set v_${a} %}${r}{% endset %}`):t.push(`{% set v_${a} = ${r} %}`)}let i=n.map(a=>`"${a}": v_${a}`).join(", ");return t.push(`{{ { ${i} } | to_json }}`),t.join(`
`)}function Of(e){let n;try{n=JSON.parse(e)}catch{return}if(typeof n!="object"||n===null||Array.isArray(n))return;let t=new Map,i=new Set;for(let[a,r]of Object.entries(n))r===null?i.add(a):t.set(a,Tc(r));return{values:t,nullKeys:i}}function Tc(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function Ec(e){let n=Ar(e),t=[...n.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));n.document&&t.push({kind:"template",value:n.document});for(let i of Sc(e).values())t.push({kind:"list",...i});return t}var St="wrist_assistant/complications";async function Gf(e){return e.connection.sendMessagePromise({type:"wrist_assistant/gallery_key"})}async function Bf(e){return e.connection.sendMessagePromise({type:`${St}/owners`})}async function Vf(e,n){return e.connection.sendMessagePromise({type:`${St}/list`,owner_watch_id:n})}async function Uf(e,n){return e.connection.sendMessagePromise({type:`${St}/nudge`,owner_watch_id:n})}async function Wf(e,n){return e.connection.sendMessagePromise({type:`${St}/watch_status`,owner_watch_id:n})}async function Rc(e,n,t,i){return e.connection.sendMessagePromise({type:`${St}/save`,owner_watch_id:n,document:t,base_revision:i})}async function Kf(e,n,t,i){return e.connection.sendMessagePromise({type:`${St}/delete`,owner_watch_id:n,complication_id:t,base_revision:i})}async function jf(e,n,t){return e.connection.sendMessagePromise({type:`${St}/move_owner`,source_owner_watch_id:n,target_owner_watch_id:t})}function qf(e,n,t){let i={type:`${St}/subscribe`};return n&&(i.owner_watch_id=n),e.connection.subscribeMessage(t,i)}async function Yf(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${St}/render_values`,templates:n})).results}async function Xf(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${St}/history_series`,requests:n})).results}function Dv(e){return{entity_id:e.entityId,minutes:e.minutes,points:e.points,...e.mode==="states"?{mode:"states"}:{},...e.gaps?{gaps:!0}:{},...e.entities!==void 0&&e.entities.length>0?{entities:[...e.entities],combine:e.combine??"any"}:{}}}function Pv(e){return{entity_id:e.entityId,minutes:e.minutes,period:e.period,type:e.type,...e.gaps?{gaps:!0}:{}}}function Jf(e){let n=new Map,t=new Map;for(let[i,a]of Object.entries(e))a.ok&&(n.set(i,a.series),typeof a.readings=="number"&&t.set(i,{readings:a.readings,averaged:a.averaged===!0}));return{series:n,readings:t}}async function Zf(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${St}/statistics_series`,requests:n})).results}async function Qf(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${St}/list_items`,requests:n})).results}function em(e){let n={};for(let[t,i]of Sc(e))n[t]=i;return{requests:n,signature:JSON.stringify(n)}}function tm(e){let n=new Map;for(let[t,i]of Object.entries(e))i.ok&&n.set(t,JSON.stringify({items:i.items,total:i.total}));return n}function Mc(e,n=()=>!0){let t={};for(let a of Pd(e))n(a.entityId)&&(t[a.key]=Dv(a));let i={};for(let a of zd(e))n(a.entityId)&&(i[a.key]=Pv(a));return{history:t,statistics:i,signature:JSON.stringify([t,i])}}var Ss="shared:";function Fc(e){return Ss+e.toUpperCase()}function im(e){return e.values.filter(n=>n.value.kind.kind!=="entityState"&&Rr(e,n.id)>0)}function am(e,n){return n.size===0?e:e.map(t=>{let i=n.get(Fc(t.id));if(i===void 0)return t;let a={kind:{kind:"literal",value:i}};return t.value.format&&(a.format=t.value.format),{...t,value:a}})}var zv=["unavailable","unknown"],Ov={automation:["on","off"],script:["on","off"],remote:["on","off"],update:["on","off"],timer:["idle","active","paused"],sun:["above_horizon","below_horizon"],valve:["open","closed","opening","closing"],lawn_mower:["mowing","docked","paused","returning","error"],weather:["sunny","clear-night","partlycloudy","cloudy","rainy","pouring","snowy","snowy-rainy","fog","windy","windy-variant","lightning","lightning-rainy","hail","exceptional"]},Gv=new Set(["\xB0C","\xB0F"]);function nm(e){return Array.isArray(e)&&e.length>0&&e.every(n=>typeof n=="string")?e:void 0}function Ir(e){let n=typeof e=="number"?e:typeof e=="string"&&e.trim()!==""?Number(e):NaN;return Number.isFinite(n)?n:void 0}function Bv(e){let n=e?.trim().match(/\.(\d+)$/)?.[1]?.length??0;return n===0?1:10**-Math.min(n,4)}function Vv(e){let n=10**Math.floor(Math.log10(e));return([1,2,2.5,5,10].find(i=>i*n>=e)??10)*n}function Uv(e){let n=new Set,t=[];for(let i of e)i===void 0||i===""||n.has(i)||(n.add(i),t.push(i));return t}function rm(e,n,t){let i=e.split(".")[0]??"",a=n?.attributes??{},o=nm(a.options)??(i==="climate"?nm(a.hvac_modes):void 0)??ca[i]??Ov[i];if(o)return{kind:"choice",options:Uv([...o,n?.state,t,...zv])};let s=Ir(n?.state),l=typeof a.unit_of_measurement=="string"?a.unit_of_measurement:void 0;if(s===void 0&&l===void 0&&i!=="input_number"&&i!=="number")return{kind:"text"};let c=Ir(t),d=Ir(a.min),u=Ir(a.max),p=Ir(a.step),f,g;if(d!==void 0&&u!==void 0&&u>d)f=d,g=u;else if(l==="%")f=0,g=100;else{let y=Vv(Math.max(Math.abs(s??0)*2,10));f=(s??0)<0||l!==void 0&&Gv.has(l)?-y:0,g=y}c!==void 0&&(f=Math.min(f,c),g=Math.max(g,c));let b=p!==void 0&&p>0?p:Bv(n?.state);return{kind:"number",min:f,max:g,step:b}}function sm(e){return e==="iphone"?2e4:1e4}function lm(e){if(e.deviceKind==="iphone")return Wv(e);if(e.appliedToken===void 0)return{kind:"unsupported"};if(e.token===e.appliedToken){let n=!e.polling&&typeof e.lastPollSeconds=="number"?e.lastPollSeconds:void 0;return n===void 0?{kind:"sent"}:{kind:"sent",awaySeconds:n}}return e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function Wv(e){let n=e.appliedToken!==void 0&&e.token===e.appliedToken;if(!e.pushAvailable){if(!n)return{kind:"openApp"};let t=typeof e.lastSyncSeconds=="number"?e.lastSyncSeconds:void 0;return t===void 0?{kind:"sent",device:"iphone"}:{kind:"sent",awaySeconds:t,device:"iphone"}}if(n){let t=typeof e.lastSyncSeconds=="number"?e.lastSyncSeconds:void 0;return t===void 0?{kind:"sent",device:"iphone",push:!0}:{kind:"sent",awaySeconds:t,device:"iphone",push:!0}}return e.pending?{kind:"sending",device:"iphone"}:{kind:"waiting",device:"iphone"}}function om(e){if(e<60)return"just now";let n=Math.floor(e/60);if(n<60)return`${n} min ago`;let t=Math.floor(n/60);if(t<24)return`${t} h ago`;let i=Math.floor(t/24);return`${i} ${i===1?"day":"days"} ago`}function dm(e){switch(e.kind){case"unsupported":return{label:"Update the watch app",note:"to receive this",title:"This watch has never reported which changes it applied, so nothing saved here can reach it. Its Wrist Assistant app is older than custom complications, or it has not been opened on this home yet.",resend:!1,refresh:!1};case"sent":if(e.device==="iphone"){let n=e.push===!0;return e.awaySeconds===void 0?{label:"On iPhone",title:n?"This iPhone has applied every change here. A save sends it a push and it syncs in the background. iOS redraws the widget when it allows: opening the app or tapping the widget redraws it at once.":"This iPhone has applied every change here.",resend:!1,refresh:n}:{label:"On iPhone",note:`last sync ${om(e.awaySeconds)}`,title:n?"This iPhone has applied every change here, as of its last sync. A save sends it a push and it syncs in the background. iOS redraws the widget when it allows: opening the app or tapping the widget redraws it at once.":"This iPhone has applied every change here, as of its last sync. A save made after this reaches the lock screen when the app is opened, or on the widget's own refresh.",resend:!1,refresh:n}}return e.awaySeconds===void 0?{label:"On watch",title:"The watch has applied every change here.",resend:!1,refresh:!1}:{label:"On watch",note:`last seen ${om(e.awaySeconds)}`,title:"The watch has applied every change here, but it is not listening now. A save made after this will not reach it until the watch app is open on this home again.",resend:!1,refresh:!1};case"openApp":return{label:"Open Wrist Assistant on your iPhone to sync",title:"This iPhone has no push token yet. Open Wrist Assistant on it once.",resend:!1,refresh:!1};case"sending":return e.device==="iphone"?{label:"Sending to the phone",title:"The push is on its way. The iPhone pulls in the background and confirms. The widget itself redraws when iOS allows, or at once when the app is opened or the widget is tapped.",resend:!1,refresh:!1}:{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1,refresh:!1};case"waiting":return e.device==="iphone"?{label:"Sent to the phone, waiting for it to sync",title:"The push has gone out, and the iPhone has not confirmed the latest change yet. Refresh now sends it another.",resend:!1,refresh:!0}:{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0,refresh:!1};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0,refresh:!1}}}var cm="questionmark.circle.fill",um="calendar",pm="checklist",Kv={sunny:"sun.max.fill","clear-night":"moon.stars.fill",partlycloudy:"cloud.sun.fill",cloudy:"cloud.fill",fog:"cloud.fog.fill",rainy:"cloud.rain.fill",pouring:"cloud.heavyrain.fill",lightning:"cloud.bolt.fill","lightning-rainy":"cloud.bolt.rain.fill",snowy:"cloud.snow.fill","snowy-rainy":"cloud.drizzle.fill",hail:"cloud.snow.fill",windy:"wind","windy-variant":"wind",exceptional:"exclamationmark.triangle.fill"};function Ac(e){return Kv[e.trim().toLowerCase()]??cm}var jv={light:{on:"lightbulb.fill",off:"lightbulb"},switch:{on:"power",off:"power"},fan:{on:"fan.fill",off:"fan.fill"},input_boolean:{on:"circle.fill",off:"circle"}},qv={door:{on:"door.left.hand.open",off:"door.left.hand.closed"},garage_door:{on:"door.left.hand.open",off:"door.left.hand.closed"},opening:{on:"door.left.hand.open",off:"door.left.hand.closed"},window:{on:"window.casement",off:"curtains.closed"},motion:{on:"figure.walk",off:"figure.stand"},occupancy:{on:"figure.walk",off:"figure.stand"},presence:{on:"figure.walk",off:"figure.stand"},moisture:{on:"drop.fill",off:"drop"},smoke:{on:"exclamationmark.triangle.fill",off:"checkmark.circle.fill"},gas:{on:"exclamationmark.triangle.fill",off:"checkmark.circle.fill"},carbon_monoxide:{on:"exclamationmark.triangle.fill",off:"checkmark.circle.fill"},problem:{on:"exclamationmark.triangle.fill",off:"checkmark.circle.fill"},safety:{on:"exclamationmark.triangle.fill",off:"checkmark.circle.fill"},battery:{on:"battery.25percent",off:"battery.100percent"},lock:{on:"lock.open.fill",off:"lock.fill"},plug:{on:"powerplug.fill",off:"poweroutlet.type.b.fill"},power:{on:"powerplug.fill",off:"poweroutlet.type.b.fill"},connectivity:{on:"wifi",off:"wifi.slash"},sound:{on:"speaker.wave.2.fill",off:"speaker.slash.fill"},running:{on:"play.fill",off:"stop.fill"},update:{on:"arrow.down.circle.fill",off:"checkmark.circle.fill"}},Yv={on:"circle.fill",off:"circle"},Xv={cover:{open:"window.casement",closed:"curtains.closed",opening:"arrow.up",closing:"arrow.down"},lock:{locked:"lock.fill",unlocked:"lock.open.fill",jammed:"exclamationmark.triangle.fill"},media_player:{playing:"play.fill",paused:"pause.fill",idle:"stop.fill",standby:"zzz",off:"speaker.slash.fill"},climate:{heat:"flame.fill",cool:"snowflake",heat_cool:"thermometer.medium",dry:"humidity.fill",fan_only:"fan.fill",auto:"thermometer.variable",off:"power"},vacuum:{cleaning:"sparkles",returning:"arrow.counterclockwise",docked:"powerplug.fill",idle:"pause.fill",error:"exclamationmark.triangle.fill"},alarm_control_panel:{disarmed:"shield.slash.fill",armed_home:"house.fill",armed_away:"shield.fill",armed_night:"moon.fill",armed_vacation:"airplane",arming:"hourglass",pending:"hourglass",triggered:"bell.badge.fill"},person:{home:"house.fill",not_home:"figure.walk"},device_tracker:{home:"house.fill",not_home:"figure.walk"}},Jv={light:{on:"lightbulb.fill",off:"lightbulb"},switch:{on:"power",off:"power"},fan:{on:"fan.fill",off:"fan.fill"},input_boolean:{on:"circle.fill",off:"circle"},cover:{on:"window.casement",off:"curtains.closed"},lock:{on:"lock.fill",off:"lock.open.fill"},media_player:{on:"speaker.wave.2.fill",off:"speaker.slash.fill"},siren:{on:"bell.fill",off:"bell.slash.fill"},humidifier:{on:"humidifier.fill",off:"humidifier.fill"},valve:{on:"spigot.fill",off:"spigot.fill"},automation:{on:"gearshape.fill",off:"gearshape.fill"},script:{on:"play.fill",off:"play.fill"},scene:{on:"sparkles",off:"sparkles"},climate:{on:"flame.fill",off:"thermometer.medium"},binary_sensor:{on:"circle.fill",off:"circle"},group:{on:"circle.fill",off:"circle"}},Zv={on:"circle.fill",off:"circle"};function Qv(e){let n=Number(e);return Number.isFinite(n)?`battery.${Math.min(4,Math.max(0,Math.round(n/25)))*25}percent`:void 0}var ek=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]),tk=new Set(["unavailable","unknown",""]);function hm(e,n,t){let i=e.trim().toLowerCase(),a=n.trim().toLowerCase(),r=t.trim().toLowerCase();if(tk.has(r))return cm;let o=jv[i]??(i==="binary_sensor"?qv[a]??Yv:void 0);if(o)return r==="off"?o.off:o.on;if(i==="weather")return Ac(r);if(i==="sensor"&&a==="battery"){let c=Qv(r);if(c!==void 0)return c}let s=Xv[i]?.[r];if(s!==void 0)return s;let l=Jv[i]??Zv;return ek.has(r)?l.on:l.off}function nk(e,n){let t=e.holes.length===0?e.values:e.values.filter((i,a)=>!e.holes[a]);if(t.length!==0)switch(n){case"latest":return t[t.length-1];case"highest":return Math.max(...t);case"lowest":return Math.min(...t);case"average":return t.reduce((i,a)=>i+a,0)/t.length;case"top":return e.domainMax;case"bottom":return e.domainMin;case"first":return t[0];case"delta":return t[t.length-1]-t[0];case"sum":return t.reduce((i,a)=>i+a,0);case"trend":{let i=t[t.length-1]-t[0],a=Number(yr(i,e.domainMax-e.domainMin));return a>0?1:a<0?-1:0}}}var ik=10800;function ak(e,n,t){let i=n==="always"||n==="auto"&&t<=ik;return new Intl.DateTimeFormat(void 0,{hour:"numeric",...i?{minute:"2-digit"}:{},...e==="h12"?{hourCycle:"h12"}:{},...e==="h24"?{hourCycle:"h23"}:{}})}function Es(e,n,t,i,a){if(e<=0||n.length===0)return[];let r=ak(t,i,e);return n.map(o=>({position:o,text:r.format(new Date(a-e*1e3*(1-o)))}))}function rk(e,n){return st(e)===void 0?[]:Es(Lt(e)*60,xr(e.timeLabelCount),e.hourCycle,e.minutes,n)}function ok(e,n){return ki(e)?Es(Math.round(e.historyMinutes)*60,xr(Gt(e.timeLabelCount)),e.hourCycle,e.minutes,n):[]}function sk(e,n,t,i){return n===void 0&&i!==void 0?st(i)===void 0?[]:Es(Lt(i)*60,xr(Gt(e.timeLabelCount)),e.hourCycle,e.minutes,t):n===void 0||!ki(n)?[]:Es(Math.round(n.historyMinutes)*60,xr(Gt(e.timeLabelCount)),e.hourCycle,e.minutes,t)}function jn(e){let n=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(n))return Number(n);let t=n.toLowerCase();if(t==="inf"||t==="+inf"||t==="infinity"||t==="+infinity")return 1/0;if(t==="-inf"||t==="-infinity")return-1/0;if(t==="nan"||t==="+nan"||t==="-nan")return NaN}function et(e){let n=e.trim(),t=jn(n);if(t!==void 0)return t;let i="";for(let r of n)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:jn(i)}function lk(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function dk(e){let n=Math.max(0,e);return n<60?`${Math.trunc(n)}s`:n<3600?`${Math.trunc(n/60)}m`:n<86400?`${Math.trunc(n/3600)}h`:`${Math.trunc(n/86400)}d`}function ck(e){let n=e.trim(),t=jn(n);if(t!==void 0)return t;let i=0,a=n.indexOf(",");if(a>=0){let s=n.slice(0,a).trim().split(" "),l=s.length===2?jn(s[0]):void 0;if(l===void 0||s[1]!=="day"&&s[1]!=="days")return;i=l,n=n.slice(a+1).trim()}let r=n.split(":");if(r.length!==2&&r.length!==3)return;let o=0;for(let s=0;s<r.length;s++){let l=jn(r[s]);if(l===void 0)return;o+=l*Math.pow(60,r.length-1-s)}return i*86400+o}function uk(e){let n=Math.trunc(Math.min(Math.max(0,e)||0,863913600)),i=[[Math.trunc(n/86400),"d"],[Math.trunc(n%86400/3600),"h"],[Math.trunc(n%3600/60),"m"],[n%60,"s"]].filter(([a])=>a>0).slice(0,2).map(([a,r])=>`${a}${r}`);return i.length===0?"0s":i.join(" ")}function pk(e){return e.replace(/\S+/g,n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase())}function hk(e,n,t,i){let a=new Date(e*1e3);if(!Number.isFinite(a.getTime()))return String(e);let r=i!==void 0?{timeZone:i}:{};if(n==="date")return new Intl.DateTimeFormat(t,{day:"numeric",month:"short",...r}).format(a);if(n==="weekday")return new Intl.DateTimeFormat(t,{weekday:"short",...r}).format(a);let o=n==="dateTime"?{weekday:"short"}:{},s=new Intl.DateTimeFormat(t,{...o,hour:"numeric",minute:"2-digit",...r});return s.resolvedOptions().hour12!==!1?s.format(a):new Intl.DateTimeFormat(t,{...o,hour:"2-digit",minute:"2-digit",...r}).format(a)}function fk(e,n,t,i,a){if(We(n))return e;let r=n,o=e,s=jn(e.trim()),l=r.duration?ck(e):void 0;if(l!==void 0)o=uk(l);else if(r.relativeTime&&s!==void 0)o=dk(s);else if(r.timestamp!==void 0&&s!==void 0)o=hk(s,r.timestamp,i,a);else{let c=et(e);if(c!==void 0){let d=c*(r.multiply??1)+(r.offset??0);r.decimals!==void 0?o=d.toFixed(Math.max(0,r.decimals)):d!==c&&(o=Number.isInteger(d)?String(d):lk(d))}}switch(r.useEntityUnit&&t&&(o+=t.startsWith("\xB0")||t.startsWith("%")?t:` ${t}`),r.prefix&&(o=r.prefix+o),r.suffix&&(o=o+r.suffix),r.textCase){case"upper":o=o.toUpperCase();break;case"lower":o=o.toLowerCase();break;case"capitalized":o=pk(o);break}return o}function Ca(e){let n=Math.trunc(Math.max(0,e)),t=Math.trunc(n/3600),i=Math.trunc(n%3600/60),a=n%60,r=o=>String(o).padStart(2,"0");return t>0?`${t}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function dt(e,n=240){return vm(e,n).map(t=>t.value)}function Lc(e,n=240){let t=[];for(let s of e.split(",")){if(t.length>=n)break;if(s.trim()===""){t.push(void 0);continue}for(let l of dt(s,n-t.length))t.push(l)}let i=t.find(s=>s!==void 0);if(i===void 0)return{values:[],holes:[]};let a=[],r=[],o=i;for(let s of t)s===void 0?(a.push(o),r.push(!0)):(o=s,a.push(s),r.push(!1));return{values:a,holes:wm(r)}}function wm(e){return e.some(n=>n)?e:[]}function vm(e,n=240){let t=[],i="",a=0,r=!1,o=0,s=()=>{if(i!==""){let l=Number(i);Number.isFinite(l)&&t.push({value:l,start:a,end:a+i.length})}i=""};for(let l of e){if(t.length>=n)break;if(l>="0"&&l<="9")i===""&&(a=o),i+=l,r=!0;else if(l===".")i.includes(".")&&s(),i===""&&(a=o),i+=".",r=!0;else if(l==="-"||l==="+"){let c=!r;s(),c&&(a=o,i=l),r=!1}else s(),r=!1;o+=l.length}return t.length<n&&s(),t}function mk(e,n){if(e.arc===void 0||e.countdown===!0||!Uo(n))return;let t=ue[n==="inline"?"rectangular":n],i=Math.max(0,Math.min(e.frame.width*t.width,e.frame.height*t.height));return{radius:e.arc.radius*i,angle:e.arc.angle??0,sweep:lr(e.arc.sweep??je),spacing:dr(e.arc.spacing??0),flip:e.arc.flip===!0,anchor:i/2}}function fm(e,n,t){let i=vm(e),a=i.map(b=>b.value),r=t.highlight??"none",o=-1,s=-1;a.length>0&&((r==="highest"||r==="both")&&(o=a.indexOf(Math.max(...a))),(r==="lowest"||r==="both")&&(s=a.indexOf(Math.min(...a))),s===o&&(s=-1));let l=t.coloring==="bands"?Dn({bands:t.bands??[]}):[],c=t.bandAboveColorHex??xe,d=t.highColorHex??gt,u=t.lowColorHex??yt,p=[],f=(b,y)=>{if(b==="")return;let w=p.at(-1);w&&w.colorHex===y?w.text+=b:p.push({text:b,colorHex:y})},g=0;return i.forEach((b,y)=>{f(e.slice(g,b.start),n);let w=y===o?d:y===s?u:l.length>0?ts(b.value,l,c):n,k=e[b.end-1]==="."?b.end-1:b.end;f(e.slice(b.start,k),w),g=k}),f(e.slice(g),n),p}function mm(e,n){let t,i;return n.scale==="fixed"?(t=Math.min(n.minValue,n.maxValue),i=Math.max(n.minValue,n.maxValue)):(t=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1,n.thresholdValue!==void 0&&Number.isFinite(n.thresholdValue)&&(t=Math.min(t,n.thresholdValue),i=Math.max(i,n.thresholdValue))),n.baseline==="zero"&&(t=Math.min(t,0),i=Math.max(i,0)),i>t||(i=t+1),{min:t,max:i}}function gk(e,n,t){let i=e.thresholdValue;if(!(i===void 0||!Number.isFinite(i)||!(t>n)||i<n||i>t))return(i-n)/(t-n)}function Hr(e,n=Gn){let t=[];for(let i of e.split(" ")){if(t.length>=n)break;if(i==="")continue;let a=i.indexOf(":");if(a<=0)continue;let r=Number(i.slice(0,a));!Number.isFinite(r)||r<0||t.push({offsetSeconds:Math.round(r),state:yk(i.slice(a+1))})}return t}function yk(e){try{return decodeURIComponent(e)}catch{return e}}function bk(e,n,t){if(e.length===0||!(n>0))return[];let i=[];for(let r=0;r<e.length;r++){let o=e[r],s=Math.min(1,Math.max(0,o.offsetSeconds/n)),l=e[r+1],c=l===void 0?1:Math.min(1,Math.max(s,l.offsetSeconds/n));if(!(c>s))continue;let d=t(o.state),u=i[i.length-1];u!==void 0&&u.colorHex===d?u.end=c:i.push({start:s,end:c,colorHex:d})}let a=i[i.length-1];return a!==void 0&&(a.end=1),i}function gm(e,n,t){if(Number.isNaN(e))return t;let i=e<0?-Math.round(-e):Math.round(e);return Math.min(t,Math.max(n,i))}function ym(e,n,t){if(e===void 0)return 0;let i=et(e);if(i===void 0||Number.isNaN(i))return 0;let a=t-n;return a===0?0:Math.min(1,Math.max(0,(i-n)/a))}function xk(e){let n=t=>{if(Array.isArray(t))return t.map(n);if(t!==null&&typeof t=="object"){let i=t,a={};for(let r of Object.keys(i).sort())a[r]=n(i[r]);return a}return t};return JSON.stringify(n(e))??""}function bm(e){return e===null?"":typeof e=="string"?e:typeof e=="boolean"||typeof e=="number"?Tc(e):xk(e)}function wk(e){let n=new Map;if(e!==null&&typeof e=="object"&&!Array.isArray(e))for(let[t,i]of Object.entries(e))n.set(t,bm(i));else n.set("value",bm(e));return n}function Ts(e,n){let t=e.get(n);if(t===void 0)return;let i=jn(t.trim());return i===void 0||!Number.isFinite(i)?void 0:i}function vk(e,n,t,i){switch(e.set("index",String(t)),n.kind){case"entities":{let a=Ts(e,"lastChanged");a!==void 0&&e.set("age",String(Math.round(i-a))),e.set("icon",hm(e.get("domain")??"",e.get("deviceClass")??"",e.get("state")??""));return}case"calendar":{let a=Ts(e,"start");a!==void 0&&e.set("startsIn",String(Math.max(0,Math.round(a-i))));let r=Ts(e,"end");r!==void 0&&e.set("endsIn",String(Math.max(0,Math.round(r-i)))),e.set("icon",um);return}case"todo":{let a=Ts(e,"due");a!==void 0&&e.set("dueIn",String(Math.round(a-i))),e.set("icon",pm);return}case"forecast":e.set("icon",Ac(e.get("condition")??""));return;default:return}}function Hc(e,n,t,i){let a;try{a=JSON.parse(e)}catch{return{items:[],total:0}}let r,o;if(Array.isArray(a))r=a,o=a.length;else if(a!==null&&typeof a=="object"&&Array.isArray(a.items)){let l=a;r=l.items,o=typeof l.total=="number"&&Number.isFinite(l.total)?Math.round(l.total):l.items.length}else return{items:[],total:0};let s=r.slice(0,Math.max(0,n)).map((l,c)=>{let d=wk(l);return vk(d,t,c,i),{fields:d,index:c}});return{items:s,total:Math.max(o,s.length)}}function _c(e,n){let t=Xe(e.rows),{lines:i,columns:a}=ps(e),r=Ti(e.gap),o=(d,u)=>{if(d<=1)return{size:1,step:0};let p=u>0?r/u:0,f=Math.min(p,1/(d-1)),g=(1-f*(d-1))/d;return{size:g,step:g+f}},s=o(a,Math.abs(e.frame.width)*n.width),l=o(i,Math.abs(e.frame.height)*n.height),c=[];for(let d=0;d<t;d++)c.push({x:d%a*s.step,y:Math.floor(d/a)*l.step,width:s.size,height:l.size,rotationDegrees:0});return c}var kk=/\{item\.([^{}]+)\}/g;function xm(e,n){return{entityId:e,displayName:n,domain:e.split(".")[0]??""}}var qt=class{constructor(n,t){this.ctx=n;this.charts=new Map;this.chartElements=new Map;this.timelineElements=new Map;this.imageElements=new Map;this.lists=new Map;this.listCells=new Map;this.named=new Map(n.namedValues.map(i=>[i.id.toUpperCase(),i.value])),t&&(this.settleCharts(t),this.settleListItems(t.elements))}settleListItems(n){this.lists.clear();let t=this.nowMs()/1e3;for(let i of n){if(i.kind!=="list")continue;let a=this.listText(i.payload);this.lists.set(i.payload.id,a===void 0?{items:[],total:0}:Hc(a,Xe(i.payload.rows),i.payload.source,t))}}listText(n){let t=Kn(n.source,n.rows);if(t!==void 0)return this.ctx.templateResults.get(t);let i=vn(n.source);return i===void 0?void 0:this.ctx.listItems?.get(i)}settleListCells(n,t,i,a){this.listCells.clear();let r=n.perFamily[i],o=ue[i==="inline"?"rectangular":i];for(let s of t){if(s.kind!=="list")continue;let l=this.lists.get(s.payload.id)?.items??[],c=_c(s.payload,o),d=[];for(let u=0;u<l.length&&u<c.length;u++){this.currentItem=l[u];let p=s.payload.template.map(f=>this.resolveElement(uc(f,r?.placements[f.payload.id]),a,i));this.currentItem=void 0,d.push({frame:c[u],elements:p})}this.listCells.set(s.payload.id,d)}}chartReadings(n){let{values:t,holes:i}=this.chartSeries(n),a=mm(t,n),r={values:t,holes:i,domainMin:a.min,domainMax:a.max},o=this.chartEntity(n);return o&&(r.entity=o),r}chartSeries(n){let t=Wt(n),i=Kt(n),a,r=t??i;r!==void 0?a=this.ctx.historySeries?.get(r)??"":a=this.resolve(n.value)??"";let{values:o,holes:s}=r!==void 0?Lc(a):{values:dt(a),holes:[]},l=r===void 0?void 0:this.testedReading(n);if(l!==void 0&&(o=[...o.slice(0,-1),l],s.length>0&&(s=[...s.slice(0,-1),!1])),n.limit>0&&o.length>n.limit){let c=d=>n.takeFromEnd?d.slice(d.length-n.limit):d.slice(0,n.limit);o=c(o),s.length>0&&(s=c(s))}return s=wm(s),{values:Nc(o,Ft(n.smoothing),s),holes:s}}testedReading(n){let t=this.chartEntity(n);if(!t||!this.ctx.testedEntities?.has(t.entityId))return;let i=this.ctx.entityStates.get(t.entityId)?.state;return i===void 0?void 0:et(i)}chartEntity(n){let t=this.dereference(n.value);if(!(!t||!("entityId"in t.kind)))return{entityId:t.kind.entityId,displayName:t.kind.displayName,domain:t.kind.domain}}chartNowIndex(n,t){if(n.nowIndex===void 0||t===0)return;let i=this.resolve(n.nowIndex);if(i===void 0)return;let a=et(i);if(!(a===void 0||!Number.isFinite(a)))return Math.min(Math.max(Math.round(a),0),t-1)}settleCharts(n){let t=new Map,i=[];for(let s of n.elements)s.kind==="timeline"&&this.timelineElements.set(s.payload.id,s.payload),s.kind==="image"&&this.imageElements.set(s.payload.id,s.payload),!(s.kind!=="chart"||t.has(s.payload.id))&&(t.set(s.payload.id,s.payload),i.push(s.payload.id));let a=new Map;for(let s of i)a.set(s,this.chartSeries(t.get(s)));let r=new Map,o=(s,l)=>{let c=r.get(s);if(c)return c;let d=t.get(s);if(!d)return{min:0,max:1};let u=d.scaleFrom,p=u!==void 0&&u!==s&&t.has(u)&&!l.has(u)?o(u,new Set([...l,u])):mm(a.get(s)?.values??[],d);return r.set(s,p),p};for(let s of i){let l=t.get(s),c=o(s,new Set([s])),d={values:a.get(s)?.values??[],holes:a.get(s)?.holes??[],domainMin:c.min,domainMax:c.max},u=this.chartEntity(l);u&&(d.entity=u),this.charts.set(s,d),this.chartElements.set(s,l)}}dereference(n){let t=n,i=new Set,a=n.format;for(;t.kind.kind==="named";){let o=t.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let s=this.named.get(o);if(!s)return;a=a&&!We(a)?a:s.format,t=s}let r={kind:t.kind};return a&&(r.format=a),r}directEntityUnit(n){let t=n.kind;if(t.kind==="entityState"||t.kind==="entityAttribute"||t.kind==="entityAge")return this.ctx.entityStates.get(t.entityId)?.unitOfMeasurement;if(t.kind==="chartStat"){if(t.stat==="trend")return;let i=this.charts.get(t.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}if(t.kind==="item")return this.currentItem?.fields.get("unit")}resolve(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i;switch(t.kind.kind){case"literal":i=t.kind.value;break;case"entityState":i=this.ctx.entityStates.get(t.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(t.kind.layer.toUpperCase()),r=a?nk(a,t.kind.stat):void 0;a&&r!==void 0&&(i=t.kind.stat==="trend"?_h(r):yr(r,a.domainMax-a.domainMin));break}case"item":i=this.currentItem?.fields.get(t.kind.field);break;case"listStat":{let a=this.lists.get(t.kind.layer.toUpperCase());a&&(i=String(t.kind.stat==="total"?a.total:a.items.length));break}default:{let a=$a(n,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return fk(i,t.format,this.directEntityUnit(t),this.ctx.locale,this.ctx.timeZone)}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i=t.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let s=Date.parse(o.finishesAt);return Number.isFinite(s)&&s>this.nowMs()?s:void 0}}let a=this.resolve(n)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=jn(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}canCountDown(n){if(!n)return!1;let t=this.dereference(n);if(t?.kind.kind==="entityState"){let i=t.kind.entityId;if(i.startsWith("timer.")||this.ctx.entityStates.get(i)?.timerState!==void 0)return!0}return this.countdownEnd(n)!==void 0}countdownFallbackText(n){if(!n)return;let t=this.dereference(n);if(!t||t.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(t.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?Ca(i.remaining):"Paused":"Idle"}entityIcon(n){let t=this.dereference(n);return!t||t.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(t.kind.entityId)?.iconName??t.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(n){let t=n.comparison;if(t.kind==="isStale")return this.isStale();let i=this.resolve(n.value);if(i===void 0)return t.kind==="isUnavailable";let a=et(i),r=()=>this.resolve(t.value),o=()=>{let l=r();return l===void 0?void 0:et(l)},s=l=>{let c=o();return a===void 0||c===void 0?!1:l(a,c)};switch(t.kind){case"equals":{let l=r();return l!==void 0&&i===l}case"notEquals":{let l=r();return l!==void 0&&i!==l}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let l=i.toLowerCase();return l==="unavailable"||l==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return s((l,c)=>l>c);case"greaterOrEqual":return s((l,c)=>l>=c);case"lessThan":return s((l,c)=>l<c);case"lessOrEqual":return s((l,c)=>l<=c);case"between":{let l=o(),c=this.resolve(t.upper),d=c===void 0?void 0:et(c);if(a===void 0||l===void 0||d===void 0)return!1;let[u,p]=l<=d?[l,d]:[d,l];return a>=u&&a<=p}case"timeBetween":{let l=Fi(i),c=r(),d=this.resolve(t.upper),u=c===void 0?void 0:Fi(c),p=d===void 0?void 0:Fi(d);return l===void 0||u===void 0||p===void 0||u===p?!1:u<p?l>=u&&l<p:l>=u||l<p}case"contains":{let l=r();return!!l&&i.toLowerCase().includes(l.toLowerCase())}case"startsWith":{let l=r();return!!l&&i.toLowerCase().startsWith(l.toLowerCase())}case"endsWith":{let l=r();return!!l&&i.toLowerCase().endsWith(l.toLowerCase())}case"matchesRegex":{if(!t.pattern)return!1;try{return new RegExp(t.pattern).test(i)}catch{return!1}}case"isOneOf":return(t.options??[]).some(l=>l.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(n){return n.tests.length===0?!0:n.join==="any"?n.tests.some(t=>this.evaluateTest(t)):n.tests.every(t=>this.evaluateTest(t))}applyRules(n,t){let i=new Map;for(let a of n){let r=t?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(s=>s.id===r.caseId)?.then??[];else{let s=a.cases.find(l=>this.evaluateCondition(l.when));o=s?s.then:a.otherwise??[]}for(let s of o)i.set(Ye[s.kind],s)}return i}liveBranches(n){let t=new Map;for(let i of n){let a=i.cases.find(r=>this.evaluateCondition(r.when));t.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return t}styleColor(n,t){let i=n.get(t);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(n,t){let i=n.get(t);return i?this.resolve(i.value):void 0}styleNumber(n,t){return n.get(t)?.number}resolveLevel(n,t){if(!n)return;let i=(o,s)=>(o?et(this.resolve(o)??""):void 0)??s,a=i(n.minSource,n.minValue),r=i(n.maxSource,n.maxValue);return{fraction:ym(this.resolve(n.value),a,r),direction:n.direction,trackColorHex:n.trackColorHex??Th(t,Eh)}}resolveTextParts(n,t,i,a){let r=[];for(let o of n){let s=this.applyRules(t.filter(c=>c.partId===o.id),a);if(s.get("visibility")?.kind==="hide")continue;let l={text:this.styleText(s,"text")??this.resolve(o.value)??"--",fontSize:this.styleNumber(s,"fontSize")??o.fontSize??i.fontSize,fontWeight:s.get("fontWeight")?.weight??o.fontWeight??i.fontWeight,fontDesign:s.get("fontDesign")?.design??o.fontDesign??i.fontDesign,fontWidth:s.get("fontWidth")?.width??o.fontWidth??i.fontWidth,italic:s.get("italic")?.italic??o.italic??i.italic,colorHex:this.styleColor(s,"color")??o.colorHex??i.colorHex};o.coloring==="bands"&&(o.bands?.length??0)>0&&(l.spans=fm(l.text,l.colorHex,o)),r.push(l)}return r}resolveElement(n,t,i="rectangular"){let a=n.payload,r=n.kind==="text"?a.rules.filter(f=>f.partId===void 0):a.rules,o=this.applyRules(r,t),s=o.get("visibility"),l=s?s.kind==="hide":a.isHidden,c=this.styleNumber(o,"rotation"),d=c===void 0?a.frame:{...a.frame,rotationDegrees:c},u=ur((a.opacity??1)*(this.styleNumber(o,"opacity")??1)),p={id:a.id,isHidden:l,frame:d,opacity:u};switch(a.shadow!==void 0&&(p.shadow=a.shadow),a.chartAnchor!==void 0&&(p.chartAnchor=a.chartAnchor),a.accentGroup==="accent"&&(p.accentGroup="accent"),n.kind){case"text":{let f=n.payload.countdown?this.countdownEnd(n.payload.value):void 0,g=n.payload.countdown?this.countdownFallbackText(n.payload.value):void 0,b=It(n.payload)&&!o.has("text"),y={kind:"text",...p,text:b?"":this.styleText(o,"text")??g??this.resolve(n.payload.value)??"--",fontSize:this.styleNumber(o,"fontSize")??n.payload.fontSize,fontWeight:o.get("fontWeight")?.weight??n.payload.fontWeight,colorHex:this.styleColor(o,"color")??n.payload.colorSlot.baseColorHex,monospacedDigits:n.payload.monospacedDigits===!0,lineLimit:Math.min(gd,Math.max(1,Math.round(n.payload.lineLimit??1))),fontDesign:o.get("fontDesign")?.design??n.payload.fontDesign??"default",fontWidth:o.get("fontWidth")?.width??n.payload.fontWidth??"standard",italic:o.get("italic")?.italic??n.payload.italic===!0,minimumScale:er(n.payload.minimumScale??wt),alignment:n.payload.alignment??"center"};f!==void 0&&(y.countdownEnd=f);let w=mk(n.payload,i);return w!==void 0&&(y.arc=w),b?(y.parts=this.resolveTextParts(n.payload.parts,a.rules,y,t),y.text=y.parts.map(k=>k.text).join(""),y):(Rh(n.payload)&&(y.spans=fm(y.text,y.colorHex,n.payload)),y)}case"icon":{let f=this.entityIcon(n.payload.symbol)??this.resolve(n.payload.symbol)??"questionmark.circle",g=this.styleText(o,"icon"),b=n.payload.symbol.kind.kind==="literal",y=g===void 0&&b&&n.payload.path!==""?n.payload.path:void 0,w=g??f;y===void 0&&(w.startsWith("mdi:")||w===hr)&&(w="questionmark.circle");let k={kind:"icon",...p,symbol:w,size:this.styleNumber(o,"fontSize")??n.payload.size,colorHex:this.styleColor(o,"color")??n.payload.colorSlot.baseColorHex};y!==void 0&&(k.path=y),y!==void 0&&n.payload.viewBox!==void 0&&(k.viewBox=n.payload.viewBox);let S=this.resolveLevel(n.payload.level,k.colorHex);return S!==void 0&&(k.level=S),k}case"gauge":{let f=n.payload,g=this.styleText(o,"gaugeValue")??this.resolve(f.value),b=(W,Q,I)=>W??(Q?et(this.resolve(Q)??""):void 0)??I,y=b(this.styleNumber(o,"gaugeMin"),f.minSource,f.minValue),w=b(this.styleNumber(o,"gaugeMax"),f.maxSource,f.maxValue),k=g===void 0?void 0:et(g),S=this.styleColor(o,"color"),R=S??f.colorSlot.baseColorHex,O=f.coloring==="bands"&&f.bands.length>0&&k!==void 0;O&&(R=ts(k,Dn(f),f.bandAboveColorHex));let F=O||S!==void 0?void 0:f.fill,z=w-y;if(f.total){let W=et(this.resolve(f.total)??"");W!==void 0&&(z=W)}let $=gm(z,1,Qo),A={kind:"gauge",...p,fraction:ym(g,y,w),style:f.style,lineWidth:f.lineWidth,colorHex:R,trackColorHex:f.trackColorHex,thresholdColorHex:f.thresholdColorHex,dotCount:$,filledCount:gm(k??0,0,$),tickCount:f.ticks?.count??0,tickLength:f.ticks?.length??hn,tickColorHex:f.ticks?.colorHex??pn,tickMajorEvery:f.ticks?.majorEvery??0,showsLabels:f.labels?.show===!0,labelSize:f.labels?.size??mn,labelColorHex:f.labels?.colorHex??fn,minValue:y,maxValue:w,valueText:g??""};if(F!==void 0&&(A.fill=F),f.thresholdValue!==void 0&&w!==y){let W=(f.thresholdValue-y)/(w-y);W>=0&&W<=1&&(A.thresholdFraction=W)}return A}case"chart":{let f=n.payload,g=this.charts.get(f.id)??this.chartReadings(f),b=g.values,y=g.holes,w={min:g.domainMin,max:g.domainMax},k=this.styleColor(o,"color")??f.colorSlot.baseColorHex,S=Dn(f),R=gr(f)?b.map(I=>ts(I,S,f.bandAboveColorHex)):[],O=f.highlight==="highest"||f.highlight==="both",F=f.highlight==="lowest"||f.highlight==="both",z=Ja(f),$={kind:"chart",...p,values:b,holes:y,style:f.style,domainMin:w.min,domainMax:w.max,baseline:f.baseline,barGap:f.barGap,lineWidth:f.lineWidth,colorHex:k,highColorHex:f.highColorHex,lowColorHex:f.lowColorHex,marker:f.marker,highMarker:O?z.high:"none",lowMarker:F?z.low:"none",pointColorHexes:R,fillBands:f.fillBands,curve:f.curve??"straight",smoothing:Ft(f.smoothing)??"off",fillStyle:An(f.fillStyle),...f.fillColorHex!==void 0?{fillColorHex:f.fillColorHex}:{},...f.areaFill!==void 0&&f.style!=="bars"?{areaFill:f.areaFill}:{},barRadius:In(f.barRadius),barCorners:Ln(f.barCorners),barBorderWidth:Md(f),barFillColorHexes:[],barBorderColorHexes:[],barBorderOpenBase:Md(f)>0&&f.barBorderOpenBase===!0,thresholdColorHex:f.thresholdColorHex,drawsThreshold:f.drawsThreshold!==!1,nowColorHex:f.nowColorHex,drawsNowLine:f.drawsNowLine!==!1,labels:f.drawsTimeLabels===!1?[]:ok(f,this.nowMs()),labelSize:f.labelSize,labelColorHex:f.labelColorHex,labelsAbove:f.labelsAbove},A=y.length===0?b:b.filter((I,G)=>!y[G]);if(A.length>0){let I=te=>b.findIndex((M,q)=>M===te&&y[q]!==!0),G=O?I(Math.max(...A)):-1,J=F?I(Math.min(...A)):-1;G>=0&&($.highIndex=G),J>=0&&J!==G&&($.lowIndex=J)}if(f.style==="bars"){let I=b.map((G,J)=>Hh(f,G,S,k,J===$.highIndex?f.highColorHex:J===$.lowIndex?f.lowColorHex:void 0));$.barFillColorHexes=I.map(G=>G.fill),$.barBorderWidth>0&&($.barBorderColorHexes=I.map(G=>G.border))}let W=gk(f,w.min,w.max);W!==void 0&&($.thresholdY=W);let Q=this.chartNowIndex(f,b.length);return Q!==void 0&&($.nowIndex=Q),$}case"timeline":{let f=n.payload,g=st(f),b=g===void 0?"":this.ctx.historySeries?.get(g)??"",y=Hr(b,Gn),w=bk(y,Lt(f)*60,S=>Uh(S,f.bands,f.otherColorHex));return{kind:"timeline",...p,runs:w,gap:f.gap,cornerRadius:f.cornerRadius,labels:f.drawsTimeLabels===!1?[]:rk(f,this.nowMs()),labelSize:f.labelSize,labelColorHex:f.labelColorHex,labelsAbove:f.labelsAbove}}case"shape":{let f=this.styleColor(o,"color"),g={kind:"shape",...p,shapeKind:n.payload.kind,cornerRadius:n.payload.cornerRadius,thickness:n.payload.thickness,fillColorHex:f??n.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(o,"borderWidth")??n.payload.borderWidth};f===void 0&&n.payload.fill!==void 0&&(g.fill=n.payload.fill);let b=this.styleColor(o,"borderColor")??n.payload.borderColorHex;if(b!==void 0&&(g.borderColorHex=b),n.payload.kind!=="line"){let y=this.resolveLevel(n.payload.level,g.fillColorHex);y!==void 0&&(g.level=y)}return g}case"image":{let f={kind:"image",...p,entityId:n.payload.entity.entityId,source:n.payload.source,showTimestamp:n.payload.timestamp===!0,contentMode:n.payload.contentMode,zoom:n.payload.zoom,panX:n.payload.panX,panY:n.payload.panY,cornerRadius:n.payload.cornerRadius,timestampCorner:n.payload.timestampCorner,timestampSize:n.payload.timestampSize};if(ds(n.payload)&&(f.timestampX=n.payload.timestampX,f.timestampY=n.payload.timestampY),n.payload.source==="inline"){let b=Kh(n.payload);return b!==void 0&&(f.url=b),f.imageBytes=Si(n.payload),f}let g=this.ctx.entityStates.get(n.payload.entity.entityId)?.entityPicture;return g!==void 0&&(f.url=g),f}case"tap":{let f={kind:"tap",...p,shadow:void 0,frame:n.payload.frame,opacity:1,action:this.itemAction(n.payload.action)};return n.payload.openPageId!==void 0&&(f.openPageId=n.payload.openPageId),n.payload.attachedTo!==void 0&&(f.attachedTo=n.payload.attachedTo),f}case"chartTimes":{let f=n.payload;return{kind:"chartTimes",...p,labels:sk(f,this.chartElements.get(f.chart),this.nowMs(),this.timelineElements.get(f.chart)),labelSize:f.labelSize,labelColorHex:f.labelColorHex}}case"imageTime":{let f=n.payload,g=this.imageElements.get(f.image),b={kind:"imageTime",...p,image:f.image,linked:g!==void 0},y=g===void 0?void 0:this.ctx.entityStates.get(g.entity.entityId)?.entityPicture;return y!==void 0&&(b.url=y),b}case"chartDots":{let f=n.payload,g=Ot(f.size),b={kind:"chartDots",...p,chart:f.chart,dots:_o(f.dots),diameter:0,indices:[]};return g!==void 0&&(b.size=g),f.colorHex!==void 0&&(b.colorHex=f.colorHex),b}case"chartGrid":{let f=n.payload;return{kind:"chartGrid",...p,chart:f.chart,lines:bi(f.lines),colorHex:Mn(f.colorHex),thickness:xi(f.thickness),draws:!1}}case"list":return{kind:"list",...p,cells:this.listCells.get(n.payload.id)??[]}}}itemAction(n){let t=this.currentItem;if(t===void 0)return n;let i=!1,a=s=>s.replace(kk,(l,c)=>{let d=t.fields.get(c);return d===void 0?(i=!0,l):d}),r=s=>s!==void 0&&s.includes(fc);if(n.type==="callService"){let s=n.target;if(!r(n.serviceDataJSON)&&!r(s?.entityId)&&!r(s?.displayName))return n;let l=n.serviceDataJSON===void 0?void 0:a(n.serviceDataJSON),c=s===void 0?void 0:xm(a(s.entityId),a(s.displayName));return i?{type:"none"}:{...n,...l!==void 0?{serviceDataJSON:l}:{},...c!==void 0?{target:c}:{}}}if(!("entityId"in n)||!r(n.entityId)&&!r(n.displayName))return n;let o=xm(a(n.entityId),a(n.displayName));return i?{type:"none"}:{type:n.type,...o}}resolveLayout(n,t,i){let a=n.perFamily[t];this.settleCharts(n);let r=ue[t==="inline"?"rectangular":t],o=wf(n,t);this.settleListItems(o),this.settleListCells(n,o,t,i);let s=[...Rk(Ek(o.map(k=>this.resolveElement(k,i,t)),r),r)],l=a?this.applyRules(a.rules,i):new Map,c={family:t,elements:s,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(l,"borderWidth")??a?.borderWidth??2},d=this.styleText(l,"text"),u=a?.bezelCountdown&&d===void 0?this.countdownEnd(a.bezelText):void 0,p=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,f=d??p??this.resolve(a?.bezelText);f!==void 0&&(c.bezelText=f),u!==void 0&&(c.bezelCountdownEnd=u);let g=this.resolve(a?.curvedText);if(g!==void 0&&(c.curvedText=g),a?.curvedColorHex!==void 0&&(c.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let k=a.bezelGauge,S=this.resolve(k.value),R=S===void 0?void 0:et(S);if(R!==void 0){let O=Math.min(k.minValue,k.maxValue),F=Math.max(k.minValue,k.maxValue),z={value:Math.min(F,Math.max(O,R)),minValue:O,maxValue:F===O?O+1:F,colorHexes:k.colorHexes},$=this.resolve(k.minLabel);$!==void 0&&(z.minLabel=$);let A=this.resolve(k.maxLabel);A!==void 0&&(z.maxLabel=A),c.bezelGauge=z}}let b=this.styleColor(l,"backgroundColor"),y=b??a?.backgroundColorHex;y!==void 0&&(c.backgroundColorHex=y),b===void 0&&a?.backgroundFill!==void 0&&(c.backgroundFill=a.backgroundFill);let w=this.styleColor(l,"borderColor")??a?.borderColorHex;return w!==void 0&&(c.borderColorHex=w),c}};function $k(e,n,t){let i=new qt(n,t),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function Yt(e,n,t){let i=new qt(n),a={};for(let r of de)e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,t));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=$k(e.inline,n,e)),a}function Sa(e,n){let t=Math.max(0,e.frame.width*n.width),i=Math.max(0,e.frame.height*n.height),a=(e.frame.x+e.frame.width/2)*n.width,r=(e.frame.y+e.frame.height/2)*n.height;return{x:a-t/2,y:r-i/2,w:t,h:i,cx:a,cy:r}}var Ic=5,Ck=1.7,Sk=1.8;function Tk(e,n,t,i,a,r){return e==="bars"||t===0?!1:n==="all"||t===1?!0:Math.max(i-a*2,0)/(t-1)>=3*r}function Ek(e,n){if(!e.some(r=>r.kind==="chartDots"||r.kind==="chartGrid"))return[...e];let t=new Map;for(let r of e)r.kind==="chart"&&t.set(r.id,r);let i=new Map,a=e.map(r=>{if(r.kind==="chartGrid"){let u=t.get(r.chart);return u===void 0?{...r,draws:!1}:{...r,frame:u.frame,draws:u.values.length>0}}if(r.kind!=="chartDots")return r;let o=t.get(r.chart);if(o===void 0)return{...r,diameter:0,indices:[]};let s=r.size??o.lineWidth*Sk,l=Math.max(o.frame.width*n.width,0),c=Tk(o.style,r.dots,o.values.length,l,o.lineWidth/2,s);c&&!r.isHidden&&i.set(o.id,Math.max(i.get(o.id)??0,s));let d=c?o.values.map((u,p)=>p).filter(u=>o.holes[u]!==!0&&u!==o.highIndex&&u!==o.lowIndex):[];return{...r,frame:o.frame,diameter:s,indices:d}});return i.size===0?a:a.map(r=>{if(r.kind!=="chart")return r;let o=i.get(r.id);return o===void 0?r:{...r,dotDiameter:o}})}function km(e){if(e.domainMin<0&&e.domainMax>0)return(0-e.domainMin)/(e.domainMax-e.domainMin)}function $m(e,n){let t=Math.max(0,Math.min(4,Math.round(n))),i=e.plotBottom-e.plotTop;return Array.from({length:t},(a,r)=>e.plotTop+i*(r+1)/(t+1))}function Rs(e,n){let t=e.values,i=Math.max(t.length,1),a=e.highIndex!==void 0?e.highMarker:"none",r=e.lowIndex!==void 0?e.lowMarker:"none",o=n.x,s=Math.max(n.w,0),l=e.style==="bars"?0:e.lineWidth/2,c=e.dotDiameter!==void 0&&e.style!=="bars"?Math.max(l,e.dotDiameter/2):l,d=z=>z==="triangle"?Ic+c:z==="dot"?Math.max(c,Ck):c,u=d(a),p=d(r),f=n.y+u,g=Math.max(n.h-u-p,1),b=f+g,y=Math.max(e.domainMax-e.domainMin,Number.EPSILON),w=e.baseline==="lowest",k=w?g*.12:0,S=Math.min(Math.max(e.barGap,0),s/(i*2)),R=Math.max((s-S*(i-1))/i,.5),O=z=>Math.min(1,Math.max(0,(z-e.domainMin)/y)),F=z=>b-O(z)*g;return{count:t.length,barWidth:R,plotTop:f,plotBottom:b,plotLeft:o,plotRight:o+s,baselineY:w?b:F(0),inset:c,yAtFraction(z){return b-Math.min(Math.max(z,0),1)*g},barRect(z){let $=o+z*(R+S),A=t[z],W,Q;if(w){let I=k+O(A)*(g-k);W=b-I,Q=b}else W=F(A),Q=w?b:F(0),W>Q&&([W,Q]=[Q,W]);return{x:$,y:W,w:R,h:Math.max(Q-W,.5)}},point(z){let $=Math.max(s-c*2,0);return{x:t.length>1?o+c+$*z/(t.length-1):o+s/2,y:F(t[z])}},markerCenter(z,$,A="high"){let W=$?this.barRect(z):void 0,Q=W?W.x+W.w/2:this.point(z).x,I=A==="high"?a:r,G=A==="high"?I==="triangle"?n.y+Ic/2:f:I==="triangle"?n.y+n.h-Ic/2:b;return{x:Q,y:G}}}}function Cm(e,n){let t=e.length;if(t<2)return[];let i=[];if(n==="step"){for(let o=0;o<t-1;o++){let s=e[o],l=e[o+1];i.push({kind:"step",start:s,corner:{x:l.x,y:s.y},end:l})}return i}if(n!=="smooth"){for(let o=0;o<t-1;o++)i.push({kind:"straight",start:e[o],end:e[o+1]});return i}let a=[];for(let o=0;o<t-1;o++){let s=e[o+1].x-e[o].x;a.push(s===0?0:(e[o+1].y-e[o].y)/s)}let r=new Array(t).fill(0);r[0]=a[0],r[t-1]=a[t-2];for(let o=1;o<t-1;o++)r[o]=a[o-1]*a[o]<=0?0:(a[o-1]+a[o])/2;for(let o=0;o<t-1;o++){if(a[o]===0){r[o]=0,r[o+1]=0;continue}let s=r[o]/a[o],l=r[o+1]/a[o],c=s*s+l*l;if(c>9){let d=3/Math.sqrt(c);r[o]=d*s*a[o],r[o+1]=d*l*a[o]}}for(let o=0;o<t-1;o++){let s=e[o],l=e[o+1],c=l.x-s.x;i.push({kind:"smooth",start:s,c1:{x:s.x+c/3,y:s.y+r[o]*c/3},c2:{x:l.x-c/3,y:l.y-r[o+1]*c/3},end:l})}return i}function Nc(e,n,t=[]){let i=e.length,a=$h(i,n);if(a===0)return e;let r=Math.floor(a/2),o=r/2,s=u=>t[u]===!0,l=e.map((u,p)=>{if(s(p))return u;let f=0,g=0;for(let b=Math.max(0,p-r);b<=Math.min(i-1,p+r);b++){if(s(b))continue;let y=b-p,w=Math.exp(-(y*y)/(2*o*o));f+=e[b]*w,g+=w}return f/g}),c=l.find((u,p)=>!s(p));if(c===void 0)return l;let d=c;return l.map((u,p)=>s(p)?d:(d=u,u))}function Sm(e,n){let t=[],i=[];for(let a=0;a<e;a++)n[a]===!0?(i.length>0&&t.push(i),i=[]):i.push(a);return i.length>0&&t.push(i),t}var Lr=1;function Ii(e,n){let t=Math.max(zn,Math.min(On,e.labelSize)),i=t*1.2,a=e.labels.length>0&&n.h-i-Lr>=2,r=a?{...n,y:e.labelsAbove?n.y+i+Lr:n.y,h:n.h-i-Lr,cy:(e.labelsAbove?n.y+i+Lr:n.y)+(n.h-i-Lr)/2}:n;return{labelSize:t,rowHeight:i,body:r,showsLabels:a}}function Rk(e,n){if(!e.some(i=>i.chartAnchor!==void 0))return e;let t=new Map;for(let i of e)i.kind==="chart"&&t.set(i.id,i);return t.size===0?e:e.map(i=>{let a=i.chartAnchor;if(a===void 0)return i;let r=t.get(a.layer);if(r===void 0)return i;if(a.at==="zero"&&km(r)===void 0)return{...i,isHidden:!0};let o=Fk(i.frame,a,r,n);return o===void 0?i:{...i,frame:o}})}function Mk(e,n){let t=n.values;if(t.length===0)return;let i=t.map((a,r)=>r).filter(a=>n.holes.length===0||!n.holes[a]);if(i.length!==0)switch(e){case"highest":return i.reduce((a,r)=>t[r]>t[a]?r:a);case"lowest":return i.reduce((a,r)=>t[r]<t[a]?r:a);case"first":return i[0];case"latest":return i[i.length-1];case"now":return n.nowIndex===void 0?void 0:Math.min(Math.max(n.nowIndex,0),t.length-1);case"threshold":return;case"zero":return}}function Fk(e,n,t,i){if(i.width<=0||i.height<=0)return;let a=Sa(t,i);if(a.w<=0||a.h<=0)return;let r=Ii(t,a).body;if(r.w<=0||r.h<=0)return;let o=Rs(t,r),s,l;if(un(n.at)){let w=Mk(n.at,t);if(w===void 0)return;if(t.style==="bars"){let k=o.barRect(w);s=k.x+k.w/2,l=k.y}else{let k=o.point(w);s=k.x,l=k.y}}else{let w=n.at==="zero"?km(t):t.thresholdY;if(w===void 0)return;l=o.yAtFraction(w)}let c=Math.max(e.width,0)*i.width,d=Math.max(e.height,0)*i.height,u=.75,p=(w,k,S)=>k>S?(k+S)/2:Math.min(Math.max(w,k),S),f={...e};if(s!==void 0){let w=p(s+(n.dx??0),r.x+c/2,r.x+r.w-c/2);f.x=(w-c/2)/i.width}if(n.place==="through"){if(s!==void 0)f.y=o.plotTop/i.height,f.height=(o.plotBottom-o.plotTop)/i.height;else{f.x=o.plotLeft/i.width,f.width=(o.plotRight-o.plotLeft)/i.width;let w=p(l+(n.dy??0),r.y+d/2,r.y+r.h-d/2);f.y=(w-d/2)/i.height}return f}let g=n.place==="on"?l:n.place==="below"?l+u+d/2:n.place==="bottom"?o.plotBottom-u-d/2:l-u-d/2,b=p(g,r.y+d/2,r.y+r.h-d/2),y=p(b+(n.dy??0),d/2,i.height-d/2);return f.y=(y-d/2)/i.height,f}var Dc=[.01,.025,.05,.1];function Ta(e,n){return!(n.width>0&&n.height>0)||n.width===n.height?{x:e,y:e}:n.width>n.height?{x:e*n.height/n.width,y:e}:{x:e,y:e*n.width/n.height}}function Pc(e){return typeof e=="number"?{x:e,y:e}:e}function zc(e){return e.x>0&&e.y>0}var Tm=1e-6;function _r(e,n){return Math.round((e-.5)/n)*n+.5-e}function Em(e,n,t){let a=[e,e+n/2,e+n].map(r=>_r(r,t)).reduce((r,o)=>Math.abs(o)<Math.abs(r)?o:r);return le(e+a)}function Ak(e,n){let t=Pc(n);return zc(t)?Li({...e,x:Em(e.x,e.width,t.x),y:Em(e.y,e.height,t.y)}):e}function Ik(e,n,t,i={x:!0,y:!0}){let a=Pc(t);if(!zc(a))return e;let{x:r,y:o,width:s,height:l}=e,c=r+s,d=o+l;if(i.x&&n.includes("e")&&(s=Math.max(ze,le(c+_r(c,a.x)-r))),i.x&&n.includes("w")){let u=Math.min(le(r+_r(r,a.x)),c-ze);s=le(c-u),r=le(u)}if(i.y&&n.includes("s")&&(l=Math.max(ze,le(d+_r(d,a.y)-o))),i.y&&n.includes("n")){let u=Math.min(le(o+_r(o,a.y)),d-ze);l=le(d-u),o=le(u)}return{...e,x:r,y:o,width:s,height:l}}function Oc(e,n,t,i){let a=Pc(i);if(!zc(a))return e;let r=(o,s,l)=>{if(s===0)return o;let c=(o-.5)/l,d=s>0?Math.floor(c+Tm)+1:Math.ceil(c-Tm)-1,u=le(d*l+.5);for(let p=0;p<1e3&&(s>0?u<=o:u>=o);p++)d+=s,u=le(d*l+.5);return u};return Li({...e,x:r(e.x,Math.sign(n),a.x),y:r(e.y,Math.sign(t),a.y)})}var Lk=3;function Mm(e,n=Lk){return{x:e.width>0?n/e.width:0,y:e.height>0?n/e.height:0}}function Fm(e){let n=[{axis:"x",at:.5},{axis:"y",at:.5}];for(let i of e)n.push({axis:"x",at:le(i.x)},{axis:"x",at:le(i.x+i.width/2)},{axis:"x",at:le(i.x+i.width)}),n.push({axis:"y",at:le(i.y)},{axis:"y",at:le(i.y+i.height/2)},{axis:"y",at:le(i.y+i.height)});let t=new Set;return n.filter(i=>{let a=`${i.axis}:${i.at}`;return t.has(a)?!1:(t.add(a),!0)})}function Fs(e,n,t,i){if(!(i>0))return;let a;for(let r of e)for(let o of n){if(o.axis!==t)continue;let s=o.at-r;Math.abs(s)>i||(a===void 0||Math.abs(s)<Math.abs(a.delta)-1e-9)&&(a={at:o.at,delta:s})}return a}function Hk(e,n){let t=n.axis==="x"?e.x:e.y,i=n.axis==="x"?e.width:e.height;return[t,t+i/2,t+i].some(a=>Math.abs(a-n.at)<1e-4)}function _k(e,n,t){let{x:i,y:a}=e,r=t&&Fs([e.x,e.x+e.width/2,e.x+e.width],t.lines,"x",t.threshold.x),o=t&&Fs([e.y,e.y+e.height/2,e.y+e.height],t.lines,"y",t.threshold.y);if(r&&(i=le(e.x+r.delta)),o&&(a=le(e.y+o.delta)),n!==void 0){let c=Ak(e,n);r||(i=c.x),o||(a=c.y)}let s=Li({...e,x:i,y:a}),l=[];return r&&l.push({axis:"x",at:r.at}),o&&l.push({axis:"y",at:o.at}),{frame:s,guides:l.filter(c=>Hk(s,c))}}function Rm(e,n,t,i,a={x:!0,y:!0}){let r={...e},o=[],s={x:a.x,y:a.y};if(i!==void 0){if(a.x){let l=n.includes("e"),c=Fs([l?e.x+e.width:e.x],i.lines,"x",i.threshold.x);if(c){if(l)r.width=Math.max(ze,le(c.at-r.x));else{let d=Math.min(le(c.at),e.x+e.width-ze);r.width=le(e.x+e.width-d),r.x=d}Math.abs((l?r.x+r.width:r.x)-c.at)<1e-4?(o.push({axis:"x",at:c.at}),s.x=!1):r={...r,x:e.x,width:e.width}}}if(a.y){let l=n.includes("s"),c=Fs([l?e.y+e.height:e.y],i.lines,"y",i.threshold.y);if(c){if(l)r.height=Math.max(ze,le(c.at-r.y));else{let d=Math.min(le(c.at),e.y+e.height-ze);r.height=le(e.y+e.height-d),r.y=d}Math.abs((l?r.y+r.height:r.y)-c.at)<1e-4?(o.push({axis:"y",at:c.at}),s.y=!1):r={...r,y:e.y,height:e.height}}}}return t!==void 0&&(r=Ik(r,n,t,s)),{frame:r,guides:o}}var ze=.04,Ms=.04;function Am(e,n){let t=()=>{let a=e.getScreenCTM();return a&&a.a!==0&&a.d!==0?{x:a.a,y:a.d}:void 0},i=t()??{x:1,y:1};return a=>(i=t()??i,{x:(a.clientX-n.clientX)/i.x,y:(a.clientY-n.clientY)/i.y})}function As(e,n){let t={...e,...n};return Li({...t,x:le(t.x),y:le(t.y),width:Math.max(ze,le(t.width)),height:Math.max(ze,le(t.height))})}function Gc(e,n){let t=n==="down"?e.x:le((1-e.width)/2),i=n==="across"?e.y:le((1-e.height)/2);return Li({...e,x:t,y:i})}function Im(e,n){let t=Gc(e,n);return t.x===e.x&&t.y===e.y}function Li(e){let n=Math.min(1-Ms,Math.max(-e.width+Ms,e.x)),t=Math.min(1-Ms,Math.max(-e.height+Ms,e.y));return{...e,x:n,y:t}}var le=e=>Math.round(e*1e3)/1e3,Lm=10;function Is(e,n,t,i){let a=i.width>0?e.x+n/i.width:e.x,r=i.height>0?e.y+t/i.height:e.y;return Li({...e,x:le(a),y:le(r)})}function Nk(e,n,t,i){let a=n.width,r=n.height,o=e.width*a,s=e.height*r,l=Math.min(o,s),c=e.x*a+(o-l)/2,d=e.y*r+(s-l)/2,u=t.includes("e")?1:-1,p=t.includes("s")?1:-1,f=ze*Math.max(a,r),g=Math.max(f,l+(u*i.x+p*i.y)/2),b=u>0?c:c+l-g,y=p>0?d:d+l-g;return{...e,x:le(b/a),y:le(y/r),width:le(g/a),height:le(g/r)}}function Dk(e,n,t,i,a=!1){let r=n.width,o=n.height;if(a||e.width*r>=e.height*o){let p=a?ze:Math.max(ze,e.height*o/r),f=e.x+e.width,g=t.includes("e")?Math.max(p,e.width+i.x/r):Math.max(p,e.width-i.x/r),b=t.includes("e")?e.x:f-g;return{...e,x:le(b),width:le(g)}}let l=Math.max(ze,e.width*r/o),c=e.y+e.height,d=t.includes("s")?Math.max(l,e.height+i.y/o):Math.max(l,e.height-i.y/o),u=t.includes("s")?e.y:c-d;return{...e,y:le(u),height:le(d)}}function Ls(e,n,t,i,a){let r=Am(e,t),o={...i.handle&&i.outline?i.outline:i.frame},s={...i.frame};e.setPointerCapture(t.pointerId);let l=g=>Math.round(g*1e3)/1e3,c=[],d=g=>{g.length===0&&c.length===0||g.length===c.length&&g.every((b,y)=>b.axis===c[y].axis&&b.at===c[y].at)||(c=g,a.onGuides?.(g))},u=g=>{if(g.pointerId!==t.pointerId)return;let b=r(g),y=b.x/n.width,w=b.y/n.height,k,S=i.snap!==void 0&&i.snap.on!==g.altKey,R=S?i.snap?.step:void 0,O=S?i.guides:void 0,F=[];if(i.handle)if(i.square)k=Nk(o,n,i.handle,b);else if(i.line||i.bar){if(k=Dk(o,n,i.handle,b,i.bar===!0),S){let z=i.bar===!0||k.width*n.width>=k.height*n.height,$=Rm(k,i.handle,R,O,{x:z,y:!z});k=$.frame,F=$.guides}}else{let{x:z,y:$,width:A,height:W}=o,Q=o.x+o.width,I=o.y+o.height;if(i.handle.includes("e")&&(A=Math.max(ze,o.width+y)),i.handle.includes("s")&&(W=Math.max(ze,o.height+w)),i.handle.includes("w")&&(A=Math.max(ze,o.width-y),z=Q-A),i.handle.includes("n")&&(W=Math.max(ze,o.height-w),$=I-W),k={...o,x:l(z),y:l($),width:l(A),height:l(W)},S){let G=Rm(k,i.handle,R,O);k=G.frame,F=G.guides}}else if(k=Li({...o,x:l(o.x+y),y:l(o.y+w)}),S){let z=_k(k,R,O);k=z.frame,F=z.guides}s=k,d(F),a.onFrame(i.elementId,k,!1)},p=g=>{g.pointerId===t.pointerId&&(f(),a.onFrame(i.elementId,s,!0))},f=()=>{d([]),e.removeEventListener("pointermove",u),e.removeEventListener("pointerup",p),e.removeEventListener("pointercancel",p);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",u),e.addEventListener("pointerup",p),e.addEventListener("pointercancel",p),f}function Hm(e,n,t,i,a){let r=Am(e,n),o=1;e.setPointerCapture(n.pointerId);let s=d=>{if(d.pointerId!==n.pointerId)return;let u=r(d),p=u.x*(t.includes("e")?1:-1),f=u.y*(t.includes("s")?1:-1),g=i.w>0?(i.w+p)/i.w:1,b=i.h>0?(i.h+f)/i.h:1,y=Math.abs(g-1)>=Math.abs(b-1)?g:b;o=Math.max(.05,y),a(o,!1)},l=d=>{d.pointerId===n.pointerId&&(c(),a(o,!0))},c=()=>{e.removeEventListener("pointermove",s),e.removeEventListener("pointerup",l),e.removeEventListener("pointercancel",l);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",s),e.addEventListener("pointerup",l),e.addEventListener("pointercancel",l),c}var Ee=ue,eg=26.5;function tg(e){return Hn.includes(e)}var Pk={rectangular:Ee.rectangular,circular:Ee.circular,corner:Ee.corner},Pr=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:Pk,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],Gs=Pr.find(e=>e.measured),zk={rectangular:{width:160,height:72},circular:{width:58,height:58},inline:{width:240,height:20},small:Ee.small,medium:Ee.medium,large:Ee.large,xlarge:Ee.xlarge},zr=[{label:"iPhone SE",screen:{width:375,height:667},slots:{rectangular:{width:153,height:69},circular:{width:56,height:56},inline:{width:230,height:19},small:{width:148.33,height:148.33},medium:{width:321.67,height:148.33},large:{width:321.67,height:324},xlarge:{width:321.67,height:499.67}},measured:!1},{label:"iPhone 13 mini",screen:{width:375,height:812},slots:{rectangular:{width:153,height:69},circular:{width:56,height:56},inline:{width:230,height:19},small:{width:155.33,height:155.33},medium:{width:329,height:155.33},large:{width:329,height:345},xlarge:{width:329,height:534.67}},measured:!1},{label:"iPhone 15 Pro",screen:{width:393,height:852},slots:zk,measured:!0},{label:"iPhone 15 Pro Max",screen:{width:430,height:932},slots:{rectangular:{width:172,height:77},circular:{width:62,height:62},inline:{width:258,height:21},small:{width:170,height:170},medium:{width:364.33,height:170},large:{width:364.33,height:382},xlarge:{width:364.33,height:592}},measured:!1},{label:"iPhone 17 Pro Max",screen:{width:440,height:956},slots:{rectangular:{width:176,height:79},circular:{width:63,height:63},inline:{width:264,height:21},small:{width:174,height:174},medium:{width:373,height:174},large:{width:373,height:391},xlarge:{width:373,height:606}},measured:!1}],Yc=zr.find(e=>e.measured);function qn(e,n){return e.slots[n]??Ee[n]}function ng(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return zr.find(a=>a.screen.width===t&&a.screen.height===i)}function ig(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return Pr.find(a=>a.screen.width===t&&a.screen.height===i)}function Bs(e,n){let t=Ee[n];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/t.width,e.height/t.height),a=t.width*i,r=t.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var Ok={watch:["accent","plain","picture"],phone:["phonePrimary","phoneAccent"]},Xc=[{label:"Orange",hex:"#FF9F0A"},{label:"Red",hex:"#FF453A"},{label:"Green",hex:"#30D158"},{label:"Blue",hex:"#0A84FF"},{label:"Purple",hex:"#BF5AF2"},{label:"White",hex:"#FFFFFF"}];function Gk(e,n="watch",t=!1){let i=e!=="text"&&e!=="imageTime"&&e!=="tap"&&e!=="image";return n==="phone"?t||i?"phoneAccent":"phonePrimary":i||t?"accent":e==="image"?"picture":"plain"}function Bk(e){let n=Oe(e)??{color:"#FFFFFF",opacity:1},t=i=>{let a=parseInt(n.color.slice(1+i*2,3+i*2),16);return Math.round(a+(255-a)*.5).toString(16).padStart(2,"0").toUpperCase()};return`#${t(0)}${t(1)}${t(2)}`}function Vk(e,n){let t=e==="phoneAccent"?Bk(n):n,i=Oe(t)??{color:"#FFFFFF",opacity:1},a=d=>(parseInt(i.color.slice(1+d*2,3+d*2),16)/255).toFixed(4),[r,o,s]=e==="plain"?["1","1","1"]:[a(0),a(1),a(2)];return`0 0 0 0 ${r} 0 0 0 0 ${o} 0 0 0 0 ${s} ${e==="picture"||e==="phoneAccent"||e==="phonePrimary"?"0.2126 0.7152 0.0722 0 0":"0 0 0 1 0"}`}function Uk(e,n,t){return v`${Ok[t].map(i=>v`<filter id=${`${e}-${i}`} filterUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000"
    color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=${Vk(i,n)} />${t==="phone"?v`<feComposite in2="SourceGraphic" operator="in" />`:m}</filter>`)}`}function Hi(e,n,t){return t===void 0?e:v`<g filter=${`url(#${t}-${n})`}>${e}</g>`}var Wk=0;function Kk(e,n,t){if(t===void 0)return e;let i=Oe(t.colorHex)??{color:"#000000",opacity:1},a=Math.max(0,t.radius)/2;return v`<filter id=${n} filterUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000"
      color-interpolation-filters="sRGB">
      <feDropShadow dx=${t.dx} dy=${t.dy} stdDeviation=${a}
        flood-color=${i.color} flood-opacity=${i.opacity} /></filter>
    <g filter=${`url(#${n})`}>${e}</g>`}function _m(e,n){if(n===void 0||!(n>0))return m;let t=Ta(n,e),i=[],a=n<.025,r=l=>l===0?"rgba(10,132,255,0.6)":a&&l%10!==0?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.14)",o=Math.floor(.5/t.x+1e-6);for(let l=-o;l<=o;l++){let c=(.5+l*t.x)*e.width;c<=0||c>=e.width||i.push(v`<line x1=${c} y1="0" x2=${c} y2=${e.height} stroke=${r(l)} stroke-width="0.5" vector-effect="non-scaling-stroke" />`)}let s=Math.floor(.5/t.y+1e-6);for(let l=-s;l<=s;l++){let c=(.5+l*t.y)*e.height;c<=0||c>=e.height||i.push(v`<line x1="0" y1=${c} x2=${e.width} y2=${c} stroke=${r(l)} stroke-width="0.5" vector-effect="non-scaling-stroke" />`)}return v`<g class="snap-grid" pointer-events="none">${i}</g>`}function Nm(e,n){if(n===void 0||n.length===0)return m;let t=n.map(i=>i.axis==="x"?v`<line x1=${i.at*e.width} y1="0" x2=${i.at*e.width} y2=${e.height}
        stroke="#FF375F" stroke-width="1" vector-effect="non-scaling-stroke" />`:v`<line x1="0" y1=${i.at*e.height} x2=${e.width} y2=${i.at*e.height}
        stroke="#FF375F" stroke-width="1" vector-effect="non-scaling-stroke" />`);return v`<g class="smart-guides" pointer-events="none">${t}</g>`}var Ds={regular:400,medium:500,semibold:600,bold:700},Dm={default:"-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif",rounded:"'SF Pro Rounded', 'Varela Round', 'Trebuchet MS', -apple-system, 'Helvetica Neue', sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, Monaco, 'Courier New', monospace",serif:"'New York', ui-serif, Georgia, 'Times New Roman', serif"},Ps=e=>Dm[e??"default"]??Dm.default,jk={condensed:"75%",compressed:"62.5%",expanded:"125%"};function zs(e,n){let t=[];e&&t.push("font-variant-numeric: tabular-nums");let i=jk[n??"standard"];return i!==void 0&&t.push(`font-stretch: ${i}`),t.length>0?t.join("; "):m}var ag=1.15;function Oe(e){if(!e)return;let n=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n))return;let t=n.length===8?parseInt(n.slice(6,8),16)/255:1;return{color:`#${n.slice(0,6)}`,opacity:t}}function pe(e,n,t="#FFFFFF"){let i=Oe(e)??{color:t,opacity:1};return{[n]:i.color,[`${n}-opacity`]:i.opacity}}function qk(e){return[...e.stops].sort((n,t)=>n.at-t.at).map(n=>{let t=Oe(n.colorHex)??{color:"#FFFFFF",opacity:1};return v`<stop offset=${Math.max(0,Math.min(1,n.at))} stop-color=${t.color} stop-opacity=${t.opacity} />`})}function Vs(e){let n=`wafill-${Zc()}`,t=qk(e);if(e.kind==="radial")return{defs:v`<radialGradient id=${n} cx="0.5" cy="0.5" r="0.5">${t}</radialGradient>`,paint:`url(#${n})`};let i=(e.angle??0)*Math.PI/180,a=Math.cos(i)/2,r=Math.sin(i)/2;return{defs:v`<linearGradient id=${n} x1=${.5-a} y1=${.5-r} x2=${.5+a} y2=${.5+r}>${t}</linearGradient>`,paint:`url(#${n})`}}var Yk=48;function rg(e,n){if(e===void 0){let a=pe(n,"fill");return{defs:m,fill:a.fill,opacity:a["fill-opacity"]}}let{defs:t,paint:i}=Vs(e);return{defs:t,fill:i,opacity:1}}var Xt=e=>e*.55;function Xk(e,n){let t={scale:1,placements:[]},i=n.radius;if(i<=0||e.length===0)return t;let a=n.sweep;if(a===0)return t;let r=i*Math.abs(a)*Math.PI/180,o=e.reduce((b,y)=>b+y,0)+n.spacing*(e.length-1);if(o<=0)return t;let s=o>r?Math.max(.5,r/o):1,l=e.map(b=>b*s),c=n.spacing*s,d=o*s,u=a<0?-1:1,p=180/(Math.PI*i),f=n.angle-u*d*p/2,g=l.map(b=>{let y=f+u*b*p/2;return f+=u*(b+c)*p,{angle:y,rotation:n.flip?y+180:y}});return{scale:s,placements:g}}function og(e,n,t,i){let a=i*Math.PI/180;return{x:e+t*Math.sin(a),y:n-t*Math.cos(a)}}function Jk(e){let n={fontSize:e.fontSize,fontWeight:e.fontWeight,fontDesign:e.fontDesign,fontWidth:e.fontWidth,italic:e.italic,colorHex:e.colorHex},t=e.parts!==void 0&&e.parts.map(s=>s.text).join("")===e.text,i=t?ug(e.parts):void 0,a=t?void 0:lg(e.text,e.spans),r=[],o=0;for(let s of e.text){let l=i?.[o]??(a===void 0?n:{...n,colorHex:a[o]});r.push({text:s,look:l}),o+=s.length}return r}function Zk(e,n){let t=og(0,0,n.anchor-n.radius,n.angle);return{x:e.cx+t.x,y:e.cy+t.y}}function Qk(e,n){if(e.arc===void 0||e.text==="")return;let t=Jk(e),i=t.map(o=>Xt(o.look.fontSize)*o.text.length),a=Xk(i,e.arc);if(a.placements.length===0)return;let r=Zk(n,e.arc);return{glyphs:t,layout:a,cx:r.x,cy:r.y,radius:e.arc.radius}}function e0(e,n){let t=Qk(e,n);if(t===void 0)return m;let{glyphs:i,layout:a,radius:r,cx:o,cy:s}=t;return v`${a.placements.map((l,c)=>{let d=i[c],u=d.look,p=pe(u.colorHex,"fill"),f=og(o,s,r,l.angle);return v`<text x="0" y="0" text-anchor="middle" dominant-baseline="central"
      transform=${`translate(${f.x} ${f.y}) rotate(${l.rotation})`}
      font-family=${Ps(u.fontDesign)} font-style=${u.italic?"italic":"normal"}
      font-size=${u.fontSize*a.scale} font-weight=${Ds[u.fontWeight]??400}
      style=${zs(e.monospacedDigits,u.fontWidth)}
      fill=${p.fill} fill-opacity=${p["fill-opacity"]}>${d.text}</text>`})}`}function sg(e,n){switch(e){case"leading":return{anchor:"start",x:n.x};case"trailing":return{anchor:"end",x:n.x+n.w};default:return{anchor:"middle",x:n.cx}}}function t0(e,n,t){let i=e.split(/\s+/).filter(s=>s!==""),a=Math.max(1,Math.min(t,i.length));if(a<2)return[e];let r=[],o=0;for(let s=0;s<a-1;s++){let l=i.length-(a-1-s)-1,c=i[o],d=o+1;for(let u=o+1;u<=l;u++){let p=`${c} ${i[u]}`;if(p.length>n)break;c=p,d=u+1}r.push(c),o=d}return r.push(i.slice(o).join(" ")),r}function n0(e,n,t){if(t<=0||e.length*Xt(n)<=t)return e;let i=t-.8*n,a=Math.max(1,Math.floor(i/Xt(n)));return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function lg(e,n){if(!n||n.map(i=>i.text).join("")!==e)return;let t=[];for(let i of n)for(let a=0;a<i.text.length;a++)t.push(i.colorHex);return t}function dg(e,n){if(n.length<2)return[0];let t=[...e.matchAll(/\S+/g)].map(i=>i.index);return[t[0]??0,t[n[0].split(" ").length]??e.length]}function cg(e,n,t,i,a){let r=[],o=n,s=a,l=c=>c<t.length&&/\s/.test(t[c]);for(let c of e){let d=s;if(/\s/.test(c))for(l(o)&&(d=i[o]);l(o);)o++;else{for(;l(o);)o++;t.startsWith(c,o)&&(d=i[o],o+=c.length)}s=d;let u=r.at(-1);u&&u.look===d?u.text+=c:r.push({text:c,look:d})}return r}function ug(e){let n=[];for(let t of e){let i=t.spans!==void 0&&t.spans.map(a=>a.text).join("")===t.text?t.spans:[{text:t.text,colorHex:t.colorHex}];for(let a of i){let r={fontSize:t.fontSize,fontWeight:t.fontWeight,fontDesign:t.fontDesign,fontWidth:t.fontWidth,italic:t.italic,colorHex:a.colorHex};for(let o=0;o<a.text.length;o++)n.push(r)}}return n}function pg(e,n){return e.reduce((t,i)=>t+i.text.length*Xt(i.look.fontSize*n),0)}function i0(e,n,t,i){let a=[...e.matchAll(/\S+/g)],r=Math.max(1,Math.min(i,a.length));if(r<2)return[e];let o=d=>n[d]?.fontSize??0,s=d=>d.map(u=>u[0]).join(" "),l=[],c=0;for(let d=0;d<r-1;d++){let u=a.length-(r-1-d)-1,p=0,f=c;for(let g=c;g<=u;g++){let b=a[g].index??0,y=g===c?0:Xt(o(b-1));for(let w=b;w<b+a[g][0].length;w++)y+=Xt(o(w));if(g>c&&p+y>t)break;p+=y,f=g+1}l.push(s(a.slice(c,f))),c=f}return l.push(s(a.slice(c))),l}function a0(e,n,t){if(t<=0||pg(e,n)<=t)return[...e];let i=[],a=0,r=0;e:for(let s of e){let l=s.look.fontSize*n,c=t-.8*l,d="";for(let u of s.text){if(r>0&&a+u.length*Xt(l)>c){d!==""&&i.push({text:d,look:s.look});break e}d+=u,a+=u.length*Xt(l),r+=1}i.push({text:d,look:s.look})}for(;i.length>0;){let s=i.at(-1);if(s.text=s.text.replace(/\s+$/,""),s.text!=="")break;i.pop()}let o=i.at(-1);return o?o.text+="\u2026":e[0]&&i.push({text:"\u2026",look:e[0].look}),i}function r0(e,n,t){let i=ug(n),a=e.lineLimit>1&&t.w>0?i0(e.text,i,t.w,e.lineLimit):[e.text],r=dg(e.text,a),o=a.map((k,S)=>cg(k,r[S]??0,e.text,i,i[0])),s=Math.max(...o.map(k=>pg(k,1))),l=s>t.w&&t.w>0?Math.max(e.minimumScale,t.w/s):1,c=o.map(k=>a0(k,l,t.w)),{anchor:d,x:u}=sg(e.alignment,t),p=Math.max(0,...c.flat().map(k=>k.look.fontSize))*l||e.fontSize*l,f=.35*p,g=p*1.15,b=k=>k.map(S=>{let R=pe(S.look.colorHex,"fill");return v`<tspan font-size=${S.look.fontSize*l} font-weight=${Ds[S.look.fontWeight]??400}
      font-family=${Ps(S.look.fontDesign)} font-style=${S.look.italic?"italic":"normal"}
      style=${zs(!1,S.look.fontWidth)}
      fill=${R.fill} fill-opacity=${R["fill-opacity"]}>${S.text}</tspan>`}),y=pe(e.colorHex,"fill"),w=c.length>1?v`${c.map((k,S)=>v`<tspan x=${u} y=${t.cy+f+(S-(c.length-1)/2)*g}>${b(k)}</tspan>`)}`:b(c[0]);return v`<text x=${u} y=${t.cy+f} text-anchor=${d}
    font-family=${Ps(e.fontDesign)} font-style=${e.italic?"italic":"normal"}
    font-size=${e.fontSize*l} font-weight=${Ds[e.fontWeight]??400}
    style=${zs(e.monospacedDigits,e.fontWidth)}
    fill=${y.fill} fill-opacity=${y["fill-opacity"]}>${w}</text>`}function o0(e,n){if(e.arc!==void 0)return e0(e,n);if(e.parts!==void 0&&e.countdownEnd===void 0&&e.parts.map(b=>b.text).join("")===e.text)return e.text===""?m:r0(e,e.parts,n);let t=pe(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:Ca((e.countdownEnd-Date.now())/1e3)});let i=e.lineLimit>1&&n.w>0?t0(e.text,n.w/Xt(e.fontSize),e.lineLimit):[e.text],a=Math.max(...i.map(b=>b.length))*Xt(e.fontSize),r=a>n.w&&n.w>0?Math.max(e.minimumScale,n.w/a):1,o=e.fontSize*r,s=i.map(b=>n0(b,o,n.w)),{anchor:l,x:c}=sg(e.alignment,n),d=lg(e.text,e.spans),u=d?dg(e.text,i):[],p=(b,y)=>d?cg(b,u[y]??0,e.text,d,e.colorHex).map(w=>{let k=pe(w.look,"fill");return v`<tspan fill=${k.fill} fill-opacity=${k["fill-opacity"]}>${w.text}</tspan>`}):b,f=o*1.15,g=s.length>1?v`${s.map((b,y)=>v`<tspan x=${c} y=${n.cy+(y-(s.length-1)/2)*f}>${p(b,y)}</tspan>`)}`:p(s[0],0);return v`<text x=${c} y=${n.cy} text-anchor=${l} dominant-baseline="central"
    font-family=${Ps(e.fontDesign)} font-style=${e.italic?"italic":"normal"}
    font-size=${o} font-weight=${Ds[e.fontWeight]??400}
    style=${zs(e.monospacedDigits,e.fontWidth)}
    fill=${t.fill} fill-opacity=${t["fill-opacity"]}>${g}</text>`}var Wc=2;function Jc(e,n){let t=n.w>=n.h,i=Math.max(1,e.dotCount),a=t?n.w:n.h,r=t?n.h:n.w,o=Math.max(1,Math.min(r,a/i-Wc)),s=i*o+(i-1)*Wc;return{horizontal:t,count:i,d:o,span:s}}function Us(e){return e==="ring"?{start:-90,sweep:360}:{start:135,sweep:270}}function s0(e,n){let t=pe(e.colorHex,"stroke"),i=pe(e.trackColorHex,"stroke","#FFFFFF"),a=pe(e.thresholdColorHex,"stroke","#FFFFFF"),r=e.lineWidth;if(e.style==="dots"){let{horizontal:y,count:w,d:k,span:S}=Jc(e,n),R=(y?n.cx:n.cy)-S/2+k/2;return v`${Array.from({length:w},(O,F)=>{let z=R+F*(k+Wc),$=F<e.filledCount?e.fill===void 0?t:pe(Ut(e.fill,w<=1?0:F/(w-1)),"stroke"):i;return v`<circle cx=${y?z:n.cx} cy=${y?n.cy:z} r=${k/2}
        fill=${$.stroke} fill-opacity=${$["stroke-opacity"]} />`})}${Pm(e,n)}`}if(e.style==="bar"){let y=n.w,w=Math.max(r,y*e.fraction),k=1,S=rg(e.fill,e.colorHex);return v`
      ${S.defs===m?m:v`<defs>${S.defs}</defs>`}
      <rect x=${n.x} y=${n.cy-r/2} width=${y} height=${r} rx=${r/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${n.x} y=${n.cy-r/2} width=${w} height=${r} rx=${r/2}
        fill=${S.fill} fill-opacity=${S.opacity} />
      ${e.thresholdFraction===void 0?m:v`<rect x=${n.x+Math.min(y-k,Math.max(0,y*e.thresholdFraction-k/2))}
            y=${n.cy-r/2} width=${k} height=${r}
            fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} />`}
      ${Pm(e,n)}`}let o=Math.min(n.w,n.h),s=Math.max(0,o/2-r/2),l=2*Math.PI*s,c=Us(e.style),d=c.sweep/360,u=c.start,p=l*d,f=l*d*e.fraction,g=v`${d0(e,n,s,r)}${c0(e,n,s,r)}`;if(e.style==="needle")return v`
      <g transform="rotate(${u} ${n.cx} ${n.cy})">
        <circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
          stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
          stroke-dasharray="${p} ${l}" />
        ${e.thresholdFraction===void 0?m:zm(n,s,r,c.sweep*e.thresholdFraction,e.thresholdColorHex)}
      </g>
      ${u0(e,n,s,r)}
      ${g}`;let b=e.fill===void 0?v`<circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${t.stroke} stroke-opacity=${t["stroke-opacity"]}
        stroke-dasharray="${f} ${l}" />`:l0(e.fill,n,s,r,c,e.fraction);return v`
    <g transform="rotate(${u} ${n.cx} ${n.cy})">
      <circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${p} ${l}" />
      ${e.fraction>0?b:m}
      ${e.thresholdFraction===void 0?m:zm(n,s,r,c.sweep*e.thresholdFraction,e.thresholdColorHex)}
    </g>
    ${g}`}function l0(e,n,t,i,a,r){let o=Math.max(0,Math.min(1,r)),s=Math.max(1,Math.round(Yk*o)),l=a.sweep*o/s,c=d=>{let u=d*Math.PI/180;return{x:n.cx+Math.cos(u)*t,y:n.cy+Math.sin(u)*t}};return v`${Array.from({length:s},(d,u)=>{let p=c(u*l-(u===0?0:.2)),f=c((u+1)*l),g=Oe(Ut(e,(u+.5)*l/a.sweep))??{color:"#FFFFFF",opacity:1};return v`<path d=${`M${p.x} ${p.y} A ${t} ${t} 0 0 1 ${f.x} ${f.y}`} fill="none"
      stroke-width=${i} stroke-linecap=${u===0||u===s-1?"round":"butt"}
      stroke=${g.color} stroke-opacity=${g.opacity} />`})}`}function d0(e,n,t,i){if(e.tickCount<=0)return m;let a=pe(e.tickColorHex,"stroke"),r=Us(e.style==="ring"?"ring":e.style==="needle"?"needle":"arc"),o=e.tickCount,s=e.style==="ring"?o:Math.max(1,o-1);return v`${Array.from({length:o},(l,c)=>{let d=e.tickMajorEvery>0&&c%e.tickMajorEvery===0,u=e.tickLength*(d?1.6:1),p=(r.start+r.sweep*c/s)*Math.PI/180,f=Math.cos(p),g=Math.sin(p),b=t-i/2-.5,y=Math.max(0,b-u);return v`<line x1=${n.cx+f*y} y1=${n.cy+g*y}
      x2=${n.cx+f*b} y2=${n.cy+g*b}
      stroke-width=${d?1.2:.8} stroke-linecap="round"
      stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} />`})}`}function c0(e,n,t,i){if(!e.showsLabels)return m;let a=pe(e.labelColorHex,"fill"),r=Us(e.style==="ring"?"ring":e.style==="needle"?"needle":"arc"),o=e.labelSize,s=d=>{let u=d*Math.PI/180,p=Math.max(0,t-i/2-o*.7);return{x:n.cx+Math.cos(u)*p,y:n.cy+Math.sin(u)*p+o*.36}},l=e.style==="ring"?m:v`${[[r.start,mr(e.minValue)],[r.start+r.sweep,mr(e.maxValue)]].map(([d,u])=>{let p=s(d);return v`<text x=${p.x} y=${p.y} text-anchor="middle" font-size=${o} font-family=${Os}
          fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${u}</text>`})}`,c=e.style==="needle"&&e.valueText!==""?v`<text x=${n.cx} y=${n.cy+t*.55+o*.36} text-anchor="middle" font-size=${o*1.2} font-weight="600" font-family=${Os}
        fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${e.valueText}</text>`:m;return v`${l}${c}`}var Os="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif";function u0(e,n,t,i){let a=Us("needle"),r=(a.start+a.sweep*Math.max(0,Math.min(1,e.fraction)))*Math.PI/180,o=Math.max(0,t-i/2-1),s=pe(e.fill===void 0?e.colorHex:Ut(e.fill,e.fraction),"fill"),l=Math.max(1,i*.8);return v`
    <line x1=${n.cx} y1=${n.cy} x2=${n.cx+Math.cos(r)*o} y2=${n.cy+Math.sin(r)*o}
      stroke-width=${i} stroke-linecap="round" stroke=${s.fill} stroke-opacity=${s["fill-opacity"]} />
    <circle cx=${n.cx} cy=${n.cy} r=${l} fill=${s.fill} fill-opacity=${s["fill-opacity"]} />`}function Pm(e,n){let t=e.style==="dots"?Jc(e,n).d:e.lineWidth,i=e.tickCount>0?v`${(()=>{let s=pe(e.tickColorHex,"stroke"),l=Math.max(1,e.tickCount-1);return Array.from({length:e.tickCount},(c,d)=>{let u=e.tickMajorEvery>0&&d%e.tickMajorEvery===0,p=e.tickLength*(u?1.6:1),f=n.x+n.w*d/l,g=n.cy+t/2+.5;return v`<line x1=${f} y1=${g} x2=${f} y2=${g+p}
            stroke-width=${u?1.2:.8} stroke-linecap="round"
            stroke=${s.stroke} stroke-opacity=${s["stroke-opacity"]} />`})})()}`:m;if(!e.showsLabels)return v`${i}`;let a=pe(e.labelColorHex,"fill"),r=e.labelSize,o=n.cy+t/2+(e.tickCount>0?e.tickLength*1.6:0)+r;return v`${i}
    <text x=${n.x} y=${o} text-anchor="start" font-size=${r} font-family=${Os}
      fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${mr(e.minValue)}</text>
    <text x=${n.x+n.w} y=${o} text-anchor="end" font-size=${r} font-family=${Os}
      fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${mr(e.maxValue)}</text>`}function zm(e,n,t,i,a){let r=pe(a,"stroke","#FFFFFF"),o=i*Math.PI/180,s=Math.cos(o),l=Math.sin(o),c=t/2+1;return v`<line x1=${e.cx+s*(n-c)} y1=${e.cy+l*(n-c)}
    x2=${e.cx+s*(n+c)} y2=${e.cy+l*(n+c)}
    stroke-width="1" stroke=${r.stroke} stroke-opacity=${r["stroke-opacity"]} />`}function p0(e,n){let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=Ii(e,n),o=r?Qc(e,n,t,i):void 0;if(e.values.length===0)return o===void 0?m:v`${o}`;let s=f0(e,a);return o===void 0?s:v`${s}${o}`}function Bc(e){switch(e.kind){case"smooth":return`C${e.c1.x} ${e.c1.y} ${e.c2.x} ${e.c2.y} ${e.end.x} ${e.end.y}`;case"step":return`L${e.corner.x} ${e.corner.y} L${e.end.x} ${e.end.y}`;case"straight":return`L${e.end.x} ${e.end.y}`}}var Om=0;function Zc(){return Om+=1,Om.toString(36)}function Hs(e,n,t){let{x:i,y:a,w:r,h:o}=e,s=Math.max(0,n);if(s===0)return`M${i} ${a} L${i+r} ${a} L${i+r} ${a+o} L${i} ${a+o} Z`;if(s>o){let l=Math.sqrt(o*(2*s-o)),c=i+s-l,d=i+r-s+l;return t?`M${c} ${a} L${d} ${a} A${s} ${s} 0 0 1 ${i+r-s} ${a+o} L${i+s} ${a+o} A${s} ${s} 0 0 1 ${c} ${a} Z`:`M${c} ${a+o} A${s} ${s} 0 0 1 ${i+s} ${a} L${i+r-s} ${a} A${s} ${s} 0 0 1 ${d} ${a+o} Z`}return t?`M${i} ${a} L${i+r} ${a} L${i+r} ${a+o-s} A${s} ${s} 0 0 1 ${i+r-s} ${a+o} L${i+s} ${a+o} A${s} ${s} 0 0 1 ${i} ${a+o-s} Z`:`M${i} ${a+o} L${i} ${a+s} A${s} ${s} 0 0 1 ${i+s} ${a} L${i+r-s} ${a} A${s} ${s} 0 0 1 ${i+r} ${a+s} L${i+r} ${a+o} Z`}function h0(e,n,t,i){let a=n.x,r=n.x+n.w;if(i){let l=e.y,c=n.y+n.h;return t===0?`M${a} ${l} L${a} ${c} L${r} ${c} L${r} ${l}`:`M${a} ${l} L${a} ${c-t} A${t} ${t} 0 0 0 ${a+t} ${c} L${r-t} ${c} A${t} ${t} 0 0 0 ${r} ${c-t} L${r} ${l}`}let o=e.y+e.h,s=n.y;return t===0?`M${a} ${o} L${a} ${s} L${r} ${s} L${r} ${o}`:`M${a} ${o} L${a} ${s+t} A${t} ${t} 0 0 1 ${a+t} ${s} L${r-t} ${s} A${t} ${t} 0 0 1 ${r} ${s+t} L${r} ${o}`}function f0(e,n){let t=Rs(e,n),i=Zc(),a=pe(e.colorHex,"fill"),r=pe(e.highColorHex,"fill",e.colorHex),o=pe(e.lowColorHex,"fill",e.colorHex),s=(y,w)=>v`<circle cx=${y.x} cy=${y.y} r="1.7" fill=${w.fill} fill-opacity=${w["fill-opacity"]} />`,l=[],c=new Map,d=e.pointColorHexes.length===t.count,u=y=>d?pe(e.pointColorHexes[y],"fill",e.colorHex):a,p=y=>{let w=Oe(y)??Oe(e.colorHex)??{color:"#FFFFFF",opacity:1};if(e.fillStyle!=="fade")return{fill:w.color,opacity:w.opacity*.28};let k=m0(i,e.id,y),S=t.baselineY<=t.plotTop?t.plotBottom:t.plotTop;return c.has(k)||c.set(k,v`<linearGradient id=${k} gradientUnits="userSpaceOnUse" x1="0" y1=${S} x2="0" y2=${t.baselineY}>
        <stop offset="0" stop-color=${w.color} stop-opacity=${w.opacity*.28} />
        <stop offset="1" stop-color=${w.color} stop-opacity="0" /></linearGradient>`),{fill:`url(#${k})`,opacity:1}},f,g=y=>{if(f===void 0){let w=Vs(y);c.set("areaFill",w.defs),f={fill:w.paint,opacity:1}}return f};if(e.style==="bars")for(let y=0;y<t.count;y++){if(e.holes[y]===!0)continue;let w=t.barRect(y),k=e.barFillColorHexes.length===t.count?e.barFillColorHexes[y]:void 0,S=k!==void 0?pe(k,"fill",e.colorHex):y===e.highIndex?r:y===e.lowIndex?o:u(y),R=e.barCorners==="top"?Math.min(Math.max(e.barRadius,0),w.w/2):Math.min(Math.max(e.barRadius,0),w.w/2,w.h/2),O=e.baseline==="zero"&&e.values[y]<0,F=e.barCorners==="top"&&O,z=e.barBorderWidth>0&&e.barBorderColorHexes.length===t.count?e.barBorderColorHexes[y]:void 0,$=e.barBorderWidth,A=z!==void 0&&(w.w<=2*$||w.h<=2*$),W=A?pe(z,"fill",e.colorHex):S;if(e.barCorners==="top"?l.push(v`<path d=${Hs(w,R,F)}
          fill=${W.fill} fill-opacity=${W["fill-opacity"]} />`):l.push(v`<rect x=${w.x} y=${w.y} width=${w.w} height=${w.h} rx=${R}
          fill=${W.fill} fill-opacity=${W["fill-opacity"]} />`),z!==void 0&&!A){let Q=pe(z,"fill",e.colorHex),I={x:w.x+$/2,y:w.y+$/2,w:w.w-$,h:w.h-$},G=e.barCorners==="top"?Math.min(Math.max(R-$/2,0),I.w/2):Math.min(Math.max(R-$/2,0),I.w/2,I.h/2);if(e.barBorderOpenBase){let te=`${i}bb${y}`,M=e.barCorners==="top"?v`<path d=${Hs(w,R,F)} />`:v`<rect x=${w.x} y=${w.y} width=${w.w} height=${w.h} rx=${R} />`;c.set(te,v`<clipPath id=${te}>${M}</clipPath>`),l.push(v`<path d=${h0(w,I,G,O)} fill="none" stroke=${Q.fill} stroke-opacity=${Q["fill-opacity"]} stroke-width=${$} clip-path=${`url(#${te})`} />`);continue}let J=e.barCorners==="top"?Hs(I,G,F):Hs(I,0,!1);e.barCorners==="top"||G===0?l.push(v`<path d=${J} fill="none" stroke=${Q.fill} stroke-opacity=${Q["fill-opacity"]} stroke-width=${$} />`):l.push(v`<rect x=${I.x} y=${I.y} width=${I.w} height=${I.h} rx=${G}
            fill="none" stroke=${Q.fill} stroke-opacity=${Q["fill-opacity"]} stroke-width=${$} />`)}}else{let y=Array.from({length:t.count},(R,O)=>t.point(O)),w=e.holes.length>0,S=Sm(t.count,e.holes).filter(R=>!w||R.length>1).map(R=>{let O=R.map($=>y[$]),F=Cm(O,e.curve),z=`M${O[0].x} ${O[0].y}${F.map($=>` ${Bc($)}`).join("")}`;return{run:R,pts:O,legs:F,line:z}});if(e.style==="area")for(let{run:R,pts:O,legs:F,line:z}of S)if(e.fillBands&&d&&R.length>1&&e.fillColorHex===void 0)for(let $=0;$<F.length;$++){let A=O[$],W=O[$+1],Q=p(e.pointColorHexes[R[$+1]]),I=`M${A.x} ${A.y} ${Bc(F[$])} L${W.x} ${t.baselineY} L${A.x} ${t.baselineY} Z`;l.push(v`<path d=${I} fill=${Q.fill} fill-opacity=${Q.opacity} stroke="none" />`)}else{let $=e.areaFill===void 0?p(e.fillColorHex??e.colorHex):g(e.areaFill),A=`${z} L${O[O.length-1].x} ${t.baselineY} L${O[0].x} ${t.baselineY} Z`;l.push(v`<path d=${A} fill=${$.fill} fill-opacity=${$.opacity} stroke="none" />`)}for(let{run:R,pts:O,legs:F,line:z}of S)if(d&&R.length>1)for(let $=0;$<F.length;$++){let A=O[$],W=u(R[$+1]);l.push(v`<path d=${`M${A.x} ${A.y} ${Bc(F[$])}`} fill="none"
            stroke=${W.fill} stroke-opacity=${W["fill-opacity"]}
            stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else l.push(v`<path d=${z} fill="none" stroke=${a.fill} stroke-opacity=${a["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&l.push(s(y[e.highIndex],r)),e.lowIndex!==void 0&&l.push(s(y[e.lowIndex],o))}let b=(y,w,k,S)=>{if(y===void 0||w==="none")return;let R=t.markerCenter(y,e.style==="bars",S);l.push(w==="triangle"?v`<path d=${`M${R.x} ${R.y-1.8} L${R.x+2.2} ${R.y+1.8} L${R.x-2.2} ${R.y+1.8} Z`}
          fill=${k.fill} fill-opacity=${k["fill-opacity"]} />`:s(R,k))};if(b(e.highIndex,e.highMarker,r,"high"),b(e.lowIndex,e.lowMarker,o,"low"),e.drawsThreshold&&e.thresholdY!==void 0){let y=t.yAtFraction(e.thresholdY),w=pe(e.thresholdColorHex,"fill",e.colorHex);l.push(v`<path d=${`M${t.plotLeft} ${y} L${t.plotRight} ${y}`} fill="none"
      stroke=${w.fill} stroke-opacity=${w["fill-opacity"]}
      stroke-width="1" stroke-dasharray="2 2" />`)}if(e.drawsNowLine&&e.nowIndex!==void 0&&e.nowIndex<t.count){let y=t.markerCenter(e.nowIndex,e.style==="bars").x,w=pe(e.nowColorHex,"fill",e.colorHex);l.push(v`<path d=${`M${y} ${t.plotTop} L${y} ${t.plotBottom}`} fill="none"
      stroke=${w.fill} stroke-opacity=${w["fill-opacity"]} stroke-width="1" />`)}return c.size===0?v`${l}`:v`<defs>${[...c.values()]}</defs>${l}`}function m0(e,n,t){return`chartfade-${e}-${n}-${t}`.replace(/[^0-9A-Za-z_-]/g,"")}function Qc(e,n,t,i){let a=(e.labelsAbove?n.y:n.y+n.h-i)+i/2,r=pe(e.labelColorHex,"fill");return e.labels.map((o,s)=>{let c=s===e.labels.length-1?"end":s===0?"start":"middle",d=n.x+o.position*n.w;return v`<text x=${d} y=${a} text-anchor=${c} dominant-baseline="central"
      font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size=${t} font-weight="400"
      fill=${r.fill} fill-opacity=${r["fill-opacity"]}>${o.text}</text>`})}function g0(e,n){if(e.runs.length===0&&e.labels.length===0||n.w<=0||n.h<=0)return m;let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=Ii(e,n),o=Math.max(0,Math.min(e.gap,n.w/Math.max(1,e.runs.length))),s=e.runs.map((l,c)=>{let d=n.x+l.start*n.w,u=(l.end-l.start)*n.w,p=c===e.runs.length-1,f=Math.max(p?u:Math.min(u,.5),u-(p?0:o)),g=Math.max(0,Math.min(e.cornerRadius,f/2,a.h/2)),b=pe(l.colorHex,"fill");return v`<rect x=${d} y=${a.y} width=${f} height=${a.h} rx=${g}
      fill=${b.fill} fill-opacity=${b["fill-opacity"]} />`});return r?v`${s}${Qc(e,n,t,i)}`:v`${s}`}function y0(e,n){if(e.labels.length===0||n.w<=0||n.h<=0)return m;let{labelSize:t,rowHeight:i}=Ii({labels:e.labels,labelSize:e.labelSize,labelsAbove:!1},n),a={...n,y:n.cy-i/2,h:i};return v`${Qc({labels:e.labels,labelColorHex:e.labelColorHex,labelsAbove:!1},a,t,i)}`}function hg(e,n){if(!(e===void 0||n.w<=0||n.h<=0))return{chart:e,g:Rs(e,Ii(e,n).body)}}function b0(e,n,t,i=!1,a=0){let r=hg(t,n);if(e.indices.length===0||r===void 0)return m;let o=r.chart,s=o.pointColorHexes.length===o.values.length,l=Math.max(e.diameter/2,a),c=new Map,d=l+1.2,u="";for(let f of e.indices){if(f>=o.values.length)continue;let g=r.g.point(f),b=e.colorHex??(s?o.pointColorHexes[f]:o.colorHex);c.set(b,`${c.get(b)??""}M${g.x-l} ${g.y} a${l} ${l} 0 1 0 ${2*l} 0 a${l} ${l} 0 1 0 ${-2*l} 0 Z`),i&&(u+=`M${g.x-d} ${g.y} a${d} ${d} 0 1 0 ${2*d} 0 a${d} ${d} 0 1 0 ${-2*d} 0 Z`)}let p=i&&u!==""?v`<path d=${u} fill="none" stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:m;return v`${p}${[...c].map(([f,g])=>{let b=pe(f,"fill",o.colorHex);return v`<path d=${g} fill=${b.fill} fill-opacity=${b["fill-opacity"]} stroke="transparent" stroke-width="3" />`})}`}function x0(e,n,t,i=!1,a=0){let r=hg(t,n);if(!e.draws||r===void 0)return m;let o=Oe(e.colorHex)??{color:"#FFFFFF",opacity:.2},s=$m(r.g,e.lines);return v`${s.map(l=>v`<path d=${`M${r.g.plotLeft} ${l} L${r.g.plotRight} ${l}`} fill="none"
    stroke=${o.color} stroke-opacity=${Math.max(o.opacity,a>0?.6:0)} stroke-width=${Math.max(e.thickness,a)} />`)}${i?s.map(l=>v`<path d=${`M${r.g.plotLeft} ${l} L${r.g.plotRight} ${l}`} fill="none" stroke="#0A84FF"
        stroke-width="1" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />`):m}`}function Gm(e){let n=Math.min(e.w,e.h);return{x:e.cx-n/2,y:e.cy-n/2,w:n,h:n,cx:e.cx,cy:e.cy}}var Nr=4;function w0(e,n){let t=e.w>=e.h,i=t?e.h:e.w,a=Math.min(i,Math.max(Nr,Math.max(0,n)));return t?{x:e.x,y:e.cy-a/2,w:e.w,h:a,cx:e.cx,cy:e.cy}:{x:e.cx-a/2,y:e.y,w:a,h:e.h,cx:e.cx,cy:e.cy}}function Ws(e,n){if(e.kind==="shape")return e.shapeKind==="circle"?Gm(n):e.shapeKind==="line"?w0(n,e.thickness):n;if(e.kind==="icon"){let t=Math.max(Nr,eu(e));return{x:n.cx-t/2,y:n.cy-t/2,w:t,h:t,cx:n.cx,cy:n.cy}}if(e.kind==="chartTimes"){if(e.labels.length===0||n.w<=0||n.h<=0)return n;let{rowHeight:t}=Ii({labels:e.labels,labelSize:e.labelSize,labelsAbove:!1},n),i=Math.max(Nr,t);return{x:n.x,y:n.cy-i/2,w:n.w,h:i,cx:n.cx,cy:n.cy}}if(e.kind==="imageTime"){let t=rc(n.w,n.h);if(!e.linked||t<=0)return n;let i=nu(new Date).length*t*.578+t*.89,a=t*1.25;return{x:n.cx-i/2,y:n.cy-a/2,w:i,h:a,cx:n.cx,cy:n.cy}}if(e.kind!=="gauge")return n;switch(e.style){case"ring":case"arc":return Gm(n);case"bar":{let t=Math.max(Nr,e.lineWidth);return{x:n.x,y:n.cy-t/2,w:n.w,h:t,cx:n.cx,cy:n.cy}}case"dots":{let{horizontal:t,d:i,span:a}=Jc(e,n),r=Math.max(Nr,i);return t?{x:n.cx-a/2,y:n.cy-r/2,w:a,h:r,cx:n.cx,cy:n.cy}:{x:n.cx-r/2,y:n.cy-a/2,w:r,h:a,cx:n.cx,cy:n.cy}}default:return n}}function fg(e,n,t){return e.kind==="shape"?e.shapeKind==="circle"?{square:!0}:e.shapeKind==="line"?{line:!0}:{}:e.kind==="chartTimes"?{bar:!0}:e.kind==="imageTime"?Bm(e,n,t):e.kind!=="gauge"?{}:e.style==="ring"||e.style==="arc"?{square:!0}:e.style==="bar"?{bar:!0}:e.style!=="dots"?{}:Bm(e,n,t)}function Bm(e,n,t){if(t.width<=0||t.height<=0)return{};let i=Ws({...e,frame:n},Sa({...e,frame:n},t));return{outline:{...n,x:i.x/t.width,y:i.y/t.height,width:i.w/t.width,height:i.h/t.height}}}function eu(e){return e.path!==void 0&&e.path!==""?e.size*ag:e.size}var v0=1e3;function k0(e,n,t){let i=Math.min(1,Math.max(0,n)),a=v0;switch(t){case"up":return{x:e.x-a,y:e.y+e.h*(1-i),w:e.w+a*2,h:e.h*i+a};case"down":return{x:e.x-a,y:e.y-a,w:e.w+a*2,h:a+e.h*i};case"left":return{x:e.x+e.w*(1-i),y:e.y-a,w:e.w*i+a,h:e.h+a*2};case"right":return{x:e.x-a,y:e.y-a,w:a+e.w*i,h:e.h+a*2}}}function mg(e,n,t){let i=`lv-${($0+=1).toString(36)}`,a=k0(Ws(e,n),t.fraction,t.direction);return{id:i,defs:v`<defs><clipPath id=${i}><rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} /></clipPath></defs>`}}var $0=0;function C0(e,n){let t=rg(e.fill,e.fillColorHex),i=e.borderColorHex?Oe(e.borderColorHex):void 0,a=i?e.borderWidth:0,r={fill:t.fill,fillOpacity:t.opacity,stroke:i?i.color:"none",strokeOpacity:i?i.opacity:0},o=t.defs===m?m:v`<defs>${t.defs}</defs>`;if(e.level===void 0)return v`${o}${_s(e,n,a,r)}`;let s=pe(e.level.trackColorHex,"fill"),l={fill:s.fill,fillOpacity:s["fill-opacity"],stroke:"none",strokeOpacity:0},c={...r,stroke:"none",strokeOpacity:0},d={...r,fill:"none",fillOpacity:0},u=mg(e,n,e.level);return v`${o}${u.defs}
    ${_s(e,n,a,l)}
    <g clip-path=${`url(#${u.id})`}>${_s(e,n,a,c)}</g>
    ${i?_s(e,n,a,d):m}`}function _s(e,n,t,i){let a=t/2;switch(e.shapeKind){case"circle":{let r=Math.min(n.w,n.h)/2-a;return v`<circle cx=${n.cx} cy=${n.cy} r=${Math.max(0,r)}
        fill=${i.fill} fill-opacity=${i.fillOpacity}
        stroke=${i.stroke} stroke-opacity=${i.strokeOpacity} stroke-width=${t} />`}case"capsule":{let r=Math.min(n.w,n.h)/2;return v`<rect x=${n.x+a} y=${n.y+a} width=${Math.max(0,n.w-t)} height=${Math.max(0,n.h-t)} rx=${r}
        fill=${i.fill} fill-opacity=${i.fillOpacity}
        stroke=${i.stroke} stroke-opacity=${i.strokeOpacity} stroke-width=${t} />`}case"roundedRectangle":return v`<rect x=${n.x+a} y=${n.y+a} width=${Math.max(0,n.w-t)} height=${Math.max(0,n.h-t)} rx=${e.cornerRadius}
        fill=${i.fill} fill-opacity=${i.fillOpacity}
        stroke=${i.stroke} stroke-opacity=${i.strokeOpacity} stroke-width=${t} />`;case"rectangle":return v`<rect x=${n.x+a} y=${n.y+a} width=${Math.max(0,n.w-t)} height=${Math.max(0,n.h-t)}
        fill=${i.fill} fill-opacity=${i.fillOpacity}
        stroke=${i.stroke} stroke-opacity=${i.strokeOpacity} stroke-width=${t} />`;case"line":{let r=n.w>=n.h,o=Math.max(0,Math.min(e.thickness,r?n.h:n.w)),s=r?n.x:n.cx-o/2,l=r?n.cy-o/2:n.y;return v`<rect x=${s} y=${l} width=${r?n.w:o} height=${r?o:n.h}
        fill=${i.fill} fill-opacity=${i.fillOpacity} stroke="none" />`}}}function S0(e,n,t){if(e.level===void 0)return Vc(e,n,t,e.colorHex);let i=mg(e,n,e.level);return v`${i.defs}
    ${Vc(e,n,t,e.level.trackColorHex)}
    <g clip-path=${`url(#${i.id})`}>${Vc(e,n,t,e.colorHex)}</g>`}function Vc(e,n,t,i){if(e.path!==void 0&&e.path!==""){let s=pe(i,"fill"),l=e.size*ag,c=Fh(e.viewBox),d=Math.min(l/c.width,l/c.height),u=n.cx-c.width*d/2-c.minX*d,p=n.cy-c.height*d/2-c.minY*d;return v`<g transform="translate(${u} ${p}) scale(${d})">
      <path d=${e.path} fill=${s.fill} fill-opacity=${s["fill-opacity"]} /></g>`}let a=t.render(e.symbol,e.size,i);if(a)return v`<g transform="translate(${n.cx-e.size/2} ${n.cy-e.size/2})">${a}</g>`;let r=pe(i,"stroke"),o=e.size;return v`
    <rect x=${n.cx-o/2} y=${n.cy-o/2} width=${o} height=${o} rx=${o*.2}
      fill="none" stroke=${r.stroke} stroke-opacity=${r["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central" font-size=${o*.5}
      fill=${r.stroke} fill-opacity=${r["stroke-opacity"]} font-family="sans-serif">?</text>`}var tu=.25,T0=8;function E0(e,n,t,i,a,r,o,s){let l={x:0,y:0,width:e,height:n};if(!(e>0)||!(n>0)||!(t>0)||!(i>0))return l;let c=Math.min(Math.max(Number.isFinite(r)?r:1,tu),T0),d=Math.max(e/t,n/i),u=Math.min(e/t,n/i),p=(a==="fit"?u:d)*c,f=t*p,g=i*p,b=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),y=Math.min(Math.max(Number.isFinite(s)?s:0,-1),1);return{x:-(f-e)/2*(1+b)+0,y:-(g-n)/2*(1+y)+0,width:f,height:g}}function nu(e){let n=e.getHours()%12||12,t=i=>String(i).padStart(2,"0");return`${n}:${t(e.getMinutes())}:${t(e.getSeconds())}`}var Ns=4;function R0(e,n,t){let i=Math.min(Math.max(e.timestampSize,4),40),a=t.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let l=e.timestampCorner.endsWith("Leading")?n.x+Ns:n.x+n.w-Ns-a,c=e.timestampCorner.startsWith("top")?n.y+Ns:n.y+n.h-Ns-r;return{x:l,y:c,w:a,h:r,size:i,label:t}}let s=(l,c,d,u)=>u>=d?c+(d-u)/2:Math.min(c+d-u,Math.max(c,l-u/2));return{x:s(n.x+e.timestampX*n.w,n.x,n.w,a),y:s(n.y+e.timestampY*n.h,n.y,n.h,r),w:a,h:r,size:i,label:t}}function Vm(e,n){if(e==="camera")return"camera.fill";if(e==="inline")return"photo";switch(n.split(".")[0]){case"camera":return"camera.fill";case"person":return"person.crop.circle";case"media_player":return"music.note";default:return"photo"}}function M0(e,n){let{x:t,y:i,w:a,h:r}=e,o=c=>t+a*c,s=c=>i+r*c,l=Math.max(2,Math.min(a,r)*.11);return v`
    <defs><linearGradient id=${n} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3B5B8C" /><stop offset="0.65" stop-color="#9DB4CF" /><stop offset="1" stop-color="#E8C9A0" />
    </linearGradient></defs>
    <rect x=${t} y=${i} width=${a} height=${r} fill=${`url(#${n})`} />
    <circle cx=${o(.72)} cy=${s(.36)} r=${l} fill="#FFF3D6" fill-opacity="0.9" />
    <path d=${`M${o(0)} ${s(.7)} L${o(.22)} ${s(.42)} L${o(.4)} ${s(.6)} L${o(.58)} ${s(.38)} L${o(.86)} ${s(.66)} L${o(1)} ${s(.56)} L${o(1)} ${s(1)} L${o(0)} ${s(1)} Z`}
      fill="#5C7391" />
    <path d=${`M${o(0)} ${s(.84)} Q${o(.3)} ${s(.62)} ${o(.62)} ${s(.8)} T${o(1)} ${s(.74)} L${o(1)} ${s(1)} L${o(0)} ${s(1)} Z`}
      fill="#34475E" />
    <rect x=${t} y=${s(.92)} width=${a} height=${r*.08} fill="#232F3E" />`}function F0(e,n,t){let i=t.icons,a=`imgclip-${Zc()}-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?R0(e,n,nu(new Date)):void 0,s=o?gg(o):m,l=e.url?t.imageSizes?.size(e.url):void 0,c;if(e.url&&l){let d=E0(n.w,n.h,l.width,l.height,e.contentMode,e.zoom,e.panX,e.panY);c=v`<image href=${e.url} x=${n.x+d.x} y=${n.y+d.y} width=${d.width} height=${d.height}
      preserveAspectRatio="none" />`}else e.url?c=v`<image href=${e.url} x=${n.x} y=${n.y} width=${n.w} height=${n.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:t.pictureScene&&e.source!=="inline"&&["camera.fill","photo"].includes(Vm(e.source,e.entityId))?c=M0(n,`${a}-sky`):c=v`
      <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${n.cx-7} ${n.cy-7})">${i.render(Vm(e.source,e.entityId),14,"#FFFFFF99")??m}</g>`;return v`
    <defs><clipPath id=${a}><rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${c}${s}</g>`}function gg(e,n=1){return v`<g opacity=${n}>
    <rect x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx=${e.h/2} fill="#000000" fill-opacity="0.55" />
    <text x=${e.x+e.w/2} y=${e.y+e.h/2} text-anchor="middle" dominant-baseline="central"
      font-size=${e.size} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${e.label}</text></g>`}function A0(e,n){if(!e.linked)return m;let t=nu(new Date),i=rc(n.w,n.h);if(i<=0)return m;let a=t.length*i*.578+i*.89,r=i*1.25;return gg({x:n.cx-a/2,y:n.cy-r/2,w:a,h:r,size:i,label:t},e.url===void 0?.5:1)}function I0(e,n,t,i,a){if(!i)return m;let r=Math.min(10,n.w*.5,n.h*.5),o=a!==void 0?L0(a,n):void 0;return v`
    <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?v`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${Kc} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?v`<g transform="translate(${n.cx-r/2} ${n.cy-r/2})" opacity="0.8">${t.render("hand.tap.fill",r,"#FFD60A")??m}</g>`:m}`}var Kc=5;function L0(e,n){let t=Kc*.55,i=n.w-2;if(n.h<Kc*1.6||i<t*4)return;if(e.length*t<=i)return e;let a=Math.max(1,Math.floor(i/t)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function H0(e,n,t,i,a){if(e.cells.length===0)return m;let r=t.tapReview===!0,o={...t,handles:!1,tapAreas:r};return v`${e.cells.map(s=>{let l=Math.max(0,s.frame.width*n.w),c=Math.max(0,s.frame.height*n.h);if(l<=0||c<=0)return m;let d=n.x+s.frame.x*n.w,u=n.y+s.frame.y*n.h,p={width:l,height:c};return v`<g data-list-cell transform="translate(${d} ${u})" style=${r?m:"cursor:move"}>
      ${s.elements.map(f=>Dr(f,p,o,i,a))}</g>`})}`}function yg(e){let n=new Map;for(let t of e)t.kind==="chart"&&n.set(t.id,t);return n}function Dr(e,n,t,i=new Map,a,r="body"){if(e.isHidden&&!t.showHidden)return m;let o=t.tapReview===!0,s=t.tapAreas===!0||o,l=o?t.tapFocusId:void 0,c=l!==void 0&&e.id===l,d=l!==void 0;if(e.kind==="tap"&&!s)return m;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!o||d&&!c))return m;let u=Sa(e,n),p=o&&(!d||c),f;if(r==="body")switch(e.kind){case"text":f=o0(e,u);break;case"icon":f=S0(e,u,t.icons);break;case"gauge":f=s0(e,u);break;case"chart":f=p0(e,u);break;case"timeline":f=g0(e,u);break;case"chartTimes":f=y0(e,u);break;case"imageTime":f=A0(e,u);break;case"chartDots":f=b0(e,u,i.get(e.chart),t.highlightId===e.id||t.highlightIds?.includes(e.id)===!0,t.minDotRadius);break;case"chartGrid":f=x0(e,u,i.get(e.chart),t.highlightId===e.id||t.highlightIds?.includes(e.id)===!0,t.minGridStroke);break;case"shape":f=C0(e,u);break;case"image":f=F0(e,u,t);break;case"tap":f=I0(e,u,t.icons,s,p?bn(e.action):void 0);break;case"list":f=H0(e,u,t,i,a);break}e.kind!=="tap"&&(f=Kk(f,`sh-${(Wk+=1).toString(36)}`,e.shadow),e.kind!=="list"&&(f=Hi(f,Gk(e.kind,t.tintSurface??"watch",e.accentGroup==="accent"),a)));let g=o&&(e.kind!=="tap"||d&&!c)?.35:1,b=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*g,y=t.highlightId===e.id,w=y||t.highlightIds?.includes(e.id)===!0,k=e.kind==="chartDots"||e.kind==="chartGrid",S=e.chartAnchor?.place==="through",R=t.handles===!0&&(!d||c)&&!k&&!S,O=Ws(e,u),F=w&&!k?v`<rect x=${O.x} y=${O.y} width=${O.w} height=${O.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:m,z=t.hoverId===e.id||t.hoverIds?.includes(e.id)===!0?v`<rect x=${O.x} y=${O.y} width=${O.w} height=${O.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:m,$=k?m:v`<rect x=${O.x} y=${O.y} width=${O.w} height=${O.h} fill="transparent" stroke="none" />`,A=3,W=O,Q=y&&R?[["nw",W.x-A,W.y-A],["ne",W.x+W.w,W.y-A],["sw",W.x-A,W.y+W.h],["se",W.x+W.w,W.y+W.h]].map(([I,G,J])=>v`<rect data-handle=${I} x=${G} y=${J} width=${A} height=${A}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${I}-resize" />`):m;return r==="handles"?Q===m?m:v`<g data-element-id=${e.id} opacity=${b} transform="rotate(${e.frame.rotationDegrees} ${u.cx} ${u.cy})">${Q}</g>`:v`<g data-element-id=${e.id} opacity=${b} style=${R?"cursor:move":e.kind==="chartDots"?"cursor:pointer":m}
    pointer-events=${e.kind==="chartGrid"?"none":m}
    transform="rotate(${e.frame.rotationDegrees} ${u.cx} ${u.cy})">${$}${f}${z}${F}</g>`}function Ks(e,n){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:n?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function iu(e,n){return(n?23.5:34)*e}var Um=10.5;function bg(e,n){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*n}function Wm(e,n){let t=0;for(let i of e)t+=bg(i,n);return t}function Km(e,n,t){let i=e.toUpperCase(),a=c=>bg(c,t),r=.9*t,o=0;for(let c of i)o+=a(c);if(o<=n)return i;let s=0,l="";for(let c of i){if(s+a(c)+r>n)break;l+=c,s+=a(c)}return`${l.replace(/\s+$/,"")}\u2026`}function jc(e,n,t){let i=t*Math.PI/180;return{x:e.cx+n*Math.cos(i),y:e.cy+n*Math.sin(i)}}function qc(e,n,t,i){let a=jc(e,n,t),r=jc(e,n,i);return`M ${a.x} ${a.y} A ${n} ${n} 0 0 1 ${r.x} ${r.y}`}function xg(e,n,t,i){let{dial:a}=Ks(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:n,d:qc(a,t,i.start,i.end),length:t*r}}function _0(e,n){let t=Ks(e,!0);return xg(e,n,t.dial.r,t.labelArc)}var jm=18.5,N0=113,D0={start:-71,end:-36},qm=104,P0=6.2,Ym={start:-77,end:-30.5};function Xm(e){let n=e.replace("#",""),t=i=>parseInt(n.slice(i,i+2),16)||0;return[t(0),t(2),t(4)]}function Jm(e,n){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let t=Math.min(1,Math.max(0,n))*(e.length-1),i=Math.min(e.length-2,Math.floor(t)),a=t-i,r=Xm(e[i]),o=Xm(e[i+1]),s=(l,c)=>Math.round(l+(c-l)*a);return`rgb(${s(r[0],o[0])}, ${s(r[1],o[1])}, ${s(r[2],o[2])})`}var Uc=11;function z0(e,n,t){let{dial:i}=Ks(n,!0),a=qm*n,r=180/(Math.PI*qm),o=e.minLabel!==void 0?Wm(e.minLabel,Uc)*r:0,s=e.maxLabel!==void 0?Wm(e.maxLabel,Uc)*r:0,l=Ym.start+(o>0?Math.max(0,o-1.8):0),c=Ym.end-(s>0?Math.max(0,s-1.8):0),d=c-l,u=24,p=[];for(let w=0;w<u;w++){let k=l+d*w/u,S=Math.min(c,l+d*(w+1)/u+.4);p.push(v`<path d=${qc(i,a,k,S)} fill="none"
      stroke=${Jm(e.colorHexes,(w+.5)/u)} stroke-width=${P0*n}
      stroke-linecap=${w===0||w===u-1?"round":"butt"} />`)}let f=(e.value-e.minValue)/(e.maxValue-e.minValue),g=jc(i,a,l+d*f),b=1.5,y=(w,k,S,R)=>v`
    <defs><path id=${w} d=${qc(i,a,k,S)} /></defs>
    <text font-size=${Uc*n} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${w}" startOffset="50%" text-anchor="middle">${R}</textPath></text>`;return v`${p}
    <circle cx=${g.x} cy=${g.y} r=${3.2*n} fill=${Jm(e.colorHexes,f)}
      stroke="#000000" stroke-width=${1.2*n} />
    ${e.minLabel!==void 0?y(`${t}-gmin`,l-b-Math.max(o,3),l-b,e.minLabel):m}
    ${e.maxLabel!==void 0?y(`${t}-gmax`,c+b,c+b+Math.max(s,3),e.maxLabel):m}`}function _i(e,n){let t=e.family in Ee?e.family:"rectangular",i=n.slot??Ee[t],a=Ee[t],r=Bs(i,t),o=`clip-${t}-${Math.random().toString(36).slice(2,8)}`,s=Oe(e.backgroundColorHex),l=e.backgroundFill===void 0?void 0:Vs(e.backgroundFill),c=l===void 0?s===void 0?void 0:{fill:s.color,opacity:s.opacity}:{fill:l.paint,opacity:1},d=Oe(e.borderColorHex),u=e.borderWidth*r.scale,p=e.elements,f=yg(p),g=n.tint===void 0?void 0:`${o}-tint`,b=n.tintSurface??"watch",y=g===void 0?m:Uk(g,n.tint,b),w=b==="phone"?"phonePrimary":"plain",k=c!==void 0&&!(g!==void 0&&b==="phone");if(t==="corner"){let $=r.scale,A=!!e.bezelText||!!e.bezelGauge,W=e.curvedText??"",Q=W!=="",I=Ks($,A),G=iu($,A),J=G/(a.width*$),te=I.tile.cx-G/2,M=I.tile.cy-G/2,q=`M 0 0 H ${I.quad.width-I.cornerRadius} A ${I.cornerRadius} ${I.cornerRadius} 0 0 1 ${I.quad.width} ${I.cornerRadius} V ${I.quad.height} H 0 Z`,x=m;if(e.bezelGauge)x=z0(e.bezelGauge,$,o);else if(e.bezelText){let P=_0($,`${o}-bezel`),C=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?Ca((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;x=v`<defs><path id=${P.id} d=${P.d} /></defs>
        <text font-size=${Um*$} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${P.id}" startOffset="50%" text-anchor="middle">${Km(C,P.length,Um*$)}</textPath></text>`}let T=m;if(Q){let P=Oe(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},C=xg($,`${o}-curved`,N0*$,D0);T=v`<defs><path id=${C.id} d=${C.d} /></defs>
        <text font-size=${jm*$} font-weight="600" fill=${P.color} fill-opacity=${P.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${C.id}" startOffset="50%" text-anchor="middle">${Km(W,C.length,jm*$*.88)}</textPath></text>`}else{let P=e.borderWidth*r.scale*J,C=d?v`<circle cx=${G/2} cy=${G/2} r=${G/2-P/2} fill="none" stroke=${d.color} stroke-opacity=${d.opacity} stroke-width=${P} />`:m;T=v`<g transform="translate(${te} ${M})">
        <g clip-path=${`url(#${o})`}>
          ${k?Hi(v`${l===void 0?m:v`<defs>${l.defs}</defs>`}<rect width=${G} height=${G} fill=${c.fill} fill-opacity=${c.opacity} />`,w,g):m}
          <g data-design-box transform="scale(${r.scale*J})">
            ${p.map(_=>Dr(_,a,n,f,g))}
            ${_m(a,n.grid)}
            ${Nm(a,n.guides)}
          </g>
        </g>
        <circle cx=${G/2} cy=${G/2} r=${G/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*$} stroke-dasharray=${`${2*$} ${2*$}`} />
        ${Hi(C,w,g)}
        <g transform="scale(${r.scale*J})">${Qm(p,a,n,f)}</g>
      </g>`}return v`<svg viewBox=${`0 0 ${I.quad.width} ${I.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${I.quad.width} height=${I.quad.height}>
      <defs><clipPath id=${o}><circle cx=${G/2} cy=${G/2} r=${G/2} /></clipPath>${y}</defs>
      <path d=${q} fill="#000000" />
      ${Hi(x,b==="phone"?"phoneAccent":"accent",g)}
      ${Q?Hi(T,b==="phone"?"phoneAccent":"accent",g):T}
      ${Q?m:Zm(p,a,n.spotlightIds,`${o}-spot`,I.quad.width,I.quad.height,`translate(${te} ${M}) scale(${r.scale*J})`)}
    </svg>`}let S=tg(t)?eg*r.scale:0,R=v`<rect width=${i.width} height=${i.height} rx=${S} />`,O=d?v`<rect x=${u/2} y=${u/2} width=${i.width-u} height=${i.height-u} rx=${Math.max(0,S-u/2)} fill="none" stroke=${d.color} stroke-opacity=${d.opacity} stroke-width=${u} />`:m,F=v`<rect width=${i.width} height=${i.height} rx=${S} fill="#000000" />`,z=`0 0 ${i.width} ${i.height}`;return v`<svg viewBox=${z} xmlns="http://www.w3.org/2000/svg" class="complication ${t}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${R}</clipPath>${y}</defs>
    <g clip-path=${`url(#${o})`}>
      ${F}
      ${k?Hi(v`${l===void 0?m:v`<defs>${l.defs}</defs>`}<rect width=${i.width} height=${i.height} rx=${S} fill=${c.fill} fill-opacity=${c.opacity} />`,w,g):m}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${p.map($=>Dr($,a,n,f,g))}
            ${_m(a,n.grid)}
            ${Nm(a,n.guides)}
      </g>
    </g>
    ${Hi(O,w,g)}
    <g transform="translate(${r.x} ${r.y}) scale(${r.scale})">${Qm(p,a,n,f)}</g>
    ${Zm(p,a,n.spotlightIds,`${o}-spot`,i.width,i.height,`translate(${r.x} ${r.y}) scale(${r.scale})`)}
  </svg>`}function O0(e,n,t){return e.filter(i=>t.includes(i.id)&&i.kind!=="tap").map(i=>{let a=Sa(i,n);return{box:{...Ws(i,a),cx:a.cx,cy:a.cy},rotation:i.frame.rotationDegrees}})}function Zm(e,n,t,i,a,r,o){if(t===void 0||t.length===0)return m;let s=O0(e,n,t),l=(c,d)=>{let{box:u,rotation:p}=c,f=`rotate(${p} ${u.cx} ${u.cy})`;return d==="hole"?v`<rect x=${u.x} y=${u.y} width=${u.w} height=${u.h} rx="2" fill="#000000" transform=${f} />`:v`<rect x=${u.x} y=${u.y} width=${u.w} height=${u.h} rx="2" fill="none" transform=${f}
          style="stroke: var(--wa-accent, #7b6cff)" stroke-width="2" vector-effect="non-scaling-stroke" />`};return v`<g class="spotlight" pointer-events="none">
    <defs><mask id=${i} maskUnits="userSpaceOnUse" x="0" y="0" width=${a} height=${r}>
      <rect width=${a} height=${r} fill="#ffffff" />
      <g transform=${o}>${s.map(c=>l(c,"hole"))}</g>
    </mask></defs>
    <rect width=${a} height=${r} fill="#000000" fill-opacity="0.62" mask=${`url(#${i})`} />
    <g transform=${o}>${s.map(c=>l(c,"ring"))}</g>
  </g>`}function Qm(e,n,t,i){if(t.handles!==!0||t.highlightId===void 0)return m;let a=e.find(r=>r.id===t.highlightId);return a===void 0?m:Dr(a,n,t,i,void 0,"handles")}var G0=.14;function B0(e,n){let t=Sa(e,n);if(e.kind!=="text"||e.text==="")return t;let i=Math.min(t.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(t.h,e.fontSize*1.3);return{x:t.cx-i/2,y:t.cy-a/2,w:i,h:a,cx:t.cx,cy:t.cy}}function V0(e,n,t){let i=e.family in Ee?e.family:"rectangular",a=Ee[i],r=e.elements.filter(p=>n.includes(p.id)),o=1/0,s=1/0,l=-1/0,c=-1/0;for(let p of r){let f=B0(p,a),g=p.frame.rotationDegrees%180===0?0:Math.hypot(f.w,f.h)/2;o=Math.min(o,g?f.cx-g:f.x),s=Math.min(s,g?f.cy-g:f.y),l=Math.max(l,g?f.cx+g:f.x+f.w),c=Math.max(c,g?f.cy+g:f.y+f.h)}let d=l-o,u=c-s;if(r.length===0||!(d>0)||!(u>0))o=0,s=0,d=a.width,u=a.height;else{let p=Math.max(2,Math.max(d,u)*G0);o-=p,s-=p,d+=2*p,u+=2*p}if(d/u<t){let p=u*t;o-=(p-d)/2,d=p}else{let p=d/t;s-=(p-u)/2,u=p}return{x:o,y:s,w:d,h:u}}function js(e,n,t){let i=e.family in Ee?e.family:"rectangular",a=Ee[i],r=V0(e,n,t.width/t.height),o=Oe(e.backgroundColorHex),s=e.backgroundFill===void 0?void 0:Vs(e.backgroundFill),l=s!==void 0?s.paint:o?o.color:"#000000",c=s!==void 0?1:o?o.opacity:1,d=Oe(e.borderColorHex),u=e.borderWidth,p={icons:t.icons,showHidden:!0,tapAreas:!0,minDotRadius:r.w/40,minGridStroke:r.w/110,...t.imageSizes?{imageSizes:t.imageSizes}:{}},f=e.elements.filter(k=>n.includes(k.id)),g=i==="rectangular"?"rect":tg(i)?"rounded":"circle",b=g==="rounded"?eg:0,y=d&&u>0?g==="circle"?v`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-u/2} fill="none" stroke=${d.color} stroke-opacity=${d.opacity} stroke-width=${u} />`:v`<rect x=${u/2} y=${u/2} width=${a.width-u} height=${a.height-u} rx=${Math.max(0,b-u/2)} fill="none" stroke=${d.color} stroke-opacity=${d.opacity} stroke-width=${u} />`:m,w=g==="circle"?v`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${l} fill-opacity=${c} />`:v`<rect width=${a.width} height=${a.height} rx=${b} fill=${l} fill-opacity=${c} />`;return v`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${t.width} height=${t.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${s===void 0?m:v`<defs>${s.defs}</defs>`}
    ${w}
    ${f.map(k=>Dr(k,a,p,yg(e.elements)))}
    ${y}
  </svg>`}function ae(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline";case"small":return"Small";case"medium":return"Medium";case"large":return"Large";case"xlarge":return"Extra Large"}}var wg="2.8.0";var vg="2.8.0",au="2.8.0";function Ve(e){return e?.device_kind==="iphone"?"iphone":"watch"}function ru(e){return Ve(e)==="iphone"?"iPhone":"watch"}function Ea(e){if(typeof e!="string")return;let n=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(n)return[Number(n[1]),Number(n[2]),Number(n[3]??0)]}function kg(e,n){for(let t=0;t<3;t++)if(e[t]!==n[t])return e[t]<n[t]?-1:1;return 0}function Or(e,n=wg){let t=Ea(e),i=Ea(n);return!t||!i?!1:kg(t,i)>=0}function ou(e,n=null){if(n===null)return;let t=Ea(e),i=Ea(n);return!t||!i||kg(t,i)>=0?void 0:`Needs Wrist Assistant ${i[2]===0?`${i[0]}.${i[1]}`:i.join(".")} or later on your watch.`}function U0(e,n=wg){return`${Ea(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The editor needs ${n}, coming soon to the App Store.`}function W0(e,n=vg){return`${Ea(e)?`This iPhone runs Wrist Assistant ${e}.`:"This iPhone has not reported its Wrist Assistant version yet."} Lock Screen and Home Screen complications need ${n}, coming soon to the App Store.`}function $g(e){return Ve(e)==="iphone"?Or(e?.app_version,vg):Or(e?.app_version)}function Cg(e){return Ve(e)==="iphone"?W0(e?.app_version):U0(e?.app_version)}var qs=["rectangular","circular","corner","inline",...Hn],Sg=!1;function Tg(e){if(Ve(e)!=="iphone")return qs.filter(t=>!Jt(t));let n=Or(e?.app_version,au);return qs.filter(t=>t==="corner"?!1:t==="xlarge"?n&&Sg:Jt(t)?n:!0)}function Eg(e){return Sg?[]:Ve(e)!=="iphone"?[]:Or(e?.app_version,au)?["xlarge"]:[]}function Ze(e){return de.includes(e)}function Rg(e,n){return n!=="list"?!0:Ht.includes(e)}function Jt(e){return Hn.includes(e)}function Yn(e){return e==="xlarge"?"iOS 27 and later":void 0}function Mg(e,n=[]){let t=e.filter(Jt);if(t.length===0&&n.length===0)return[{families:[...e]}];let i=e.filter(o=>!Jt(o)),a={label:"Home Screen",families:t};n.length>0&&(a.comingSoon=[...n]);let r=[a];return i.length>0&&r.push({label:"Lock Screen",families:i}),r}function su(e,n){let t=Tt(e),i=t.filter(a=>n.includes(a));return i.length>0?i:t}function Tt(e){return qs.filter(n=>e.supportedFamilies.includes(n))}function Ys(e){return de.find(n=>e.supportedFamilies.includes(n))}function Xs(e,n){return e.supportedFamilies.includes(n)&&e.supportedFamilies.length>1}function K0(){return{value:K("")}}function Fg(e,n){e.supportedFamilies.includes(n)||(e.supportedFamilies=qs.filter(t=>t===n||e.supportedFamilies.includes(t))),Ze(n)?e.perFamily[n]||(e.perFamily[n]=wn()):e.inline||(e.inline=K0()),e.schemaVersion=yi(e)}function lu(e,n){if(Xs(e,n)){if(e.supportedFamilies=e.supportedFamilies.filter(t=>t!==n),Ze(n)){for(let t of Ct(e,n))Se(e,t.payload.id);delete e.perFamily[n],_t(e)}else delete e.inline;e.schemaVersion=yi(e)}}function du(e,n){let t=structuredClone(e),i=Tt(t);if(!i.some(a=>n.includes(a)))return t;for(let a of i)n.includes(a)||lu(t,a);return t}function Ag(e,n){let t=[];if(!Ze(n)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||t.push("the Inline text")),t}let i=e.perFamily[n];if(!i)return t;let a=Ct(e,n).filter(r=>!we(e,r)).length;return a>0&&t.push(`${a} layer${a===1?"":"s"}`),i.rules.length>0&&t.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&t.push("the bezel"),i.curvedText&&t.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&t.push("the background or border"),t}var tt={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",list:"#c0ca33",shape:"#43a047",image:"#00acc1",tap:"#ec407a",chartTimes:"#5e35b1",chartDots:"#5e35b1",chartGrid:"#5e35b1",imageTime:"#00838f"},ct={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",list:"List",shape:"Shape",image:"Picture",tap:"Tap area",chartTimes:"Clock times",chartDots:"Chart dots",chartGrid:"Chart grid",imageTime:"Timestamp"},Ig=["text","icon","gauge","chart","timeline","list","shape","image","tap"],oe={content:"#4a7fe8",look:"#a15fe0",numbers:"#26a69a",position:"#66bb6a",states:"#f9a825",tap:tt.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var Lg="52a9d81d0fd7";var Hg="11fa18406cea";var nt="mdi:";function j0(e){return e.trim().replace(/\./g,"-")}function q0(e){return e.trim().replace(/-/g,".")}var Js=class e{constructor(n){this.onReady=n;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let n=window.customIcons?.ios;if(!n||typeof n.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>n.getIconList()).then(t=>{this.nameList=(t??[]).map(i=>q0(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(n,t,i){let a=j0(n),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=Oe(i)??{color:"#FFFFFF",opacity:1},s=r.viewBox??"0 0 24 24";return v`<svg x="0" y="0" width=${t} height=${t} viewBox=${s}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(n){if(this.pending.has(n))return;let t=window.customIcons?.ios;if(!t){this.cache.set(n,null);return}this.pending.add(n),Promise.resolve().then(()=>t.getIcon(n)).then(i=>this.cache.set(n,i&&i.path?i:null)).catch(()=>this.cache.set(n,null)).finally(()=>{this.pending.delete(n),this.onReady()})}},Zs=class{constructor(n,t="symbol-icons.json.gz",i=Lg){this.onReady=n;this.file=t;this.digest=i;this.icons=new Map;this.state="idle"}path(n){return this.load(),this.icons.get(n.trim())?.[0]}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(n,t,i){this.load();let a=this.icons.get(n.trim());if(!a)return;let r=Oe(i)??{color:"#FFFFFF",opacity:1};return v`<svg x="0" y="0" width=${t} height=${t} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let n=new URL(`${this.file}?v=${this.digest}`,import.meta.url);fetch(n).then(t=>{if(!t.ok||!t.body)throw new Error(`${this.file}: ${t.status}`);return new Response(t.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(t=>{if(t&&typeof t=="object")for(let[i,a]of Object.entries(t))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}},cu=class{constructor(n,t){this.sf=n;this.mdi=new Zs(t,"mdi-icons.json.gz",Hg)}render(n,t,i){return(n.trim().startsWith(nt)?this.mdi:this.sf).render(n,t,i)}available(){return this.sf.available()}names(){return this.sf.names()}mdiNames(){return this.mdi.names()}mdiPath(n){return this.mdi.path(n)}};function _g(e){let n=Js.available()?new Js(e):new Zs(e);return new cu(n,e)}function Ng(e){let n=new Map,t=new Set;return{size(i){let a=n.get(i);if(a)return a;if(t.has(i))return;t.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(n.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var el=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],tl=[...new Set(el.flatMap(e=>e.symbols))],Y0={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function X0(e){return`${e.replace(/\./g," ")} ${(Y0[e]??[]).join(" ")}`}function uu(e,n){let t=n.toLowerCase().split(/[\s.]+/).filter(Boolean);if(t.length===0)return[...e];let i=[];for(let a of e){let r=X0(a);if(!t.every(s=>r.includes(s)))continue;let o=t.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var Qs=class e{constructor(n){this.onChange=n;this.collapsed=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(n){return!this.collapsed.has(n)}toggle(n){this.collapsed.has(n)?this.collapsed.delete(n):this.collapsed.add(n),this.onChange()}query(n){return this.browsing.get(n)?.query??""}category(n){return this.browsing.get(n)?.category??""}pack(n){return this.browsing.get(n)?.pack}setQuery(n,t){this.browsing.set(n,{category:this.category(n),query:t,pack:this.pack(n)}),this.onChange()}setCategory(n,t){this.browsing.set(n,{query:this.query(n),category:t,pack:this.pack(n)}),this.onChange()}setPack(n,t){this.browsing.set(n,{query:"",category:this.category(n),pack:t}),this.onChange()}noteUsed(n){let t=n.trim();t&&(this.recent=[t,...this.recent.filter(i=>i!==t)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let n=localStorage.getItem(e.STORAGE_KEY),t=n?JSON.parse(n):[];return Array.isArray(t)?t.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(n){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(n))}catch{}}};var J0=100;function Dg(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var Ni=class e{constructor(n,t){this.config=n;this.testValues=new Map;this.past=[];this.future=[];this.coalesceUntil=0;this.held=!1;this.heldStepTaken=!1;this.baseRevision=t,wa(n),Un(n),uf(n),this.baseline=JSON.stringify(fa(n))}static fromDocument(n,t){return new e(ha(n),t)}get dirty(){return JSON.stringify(fa(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(n,t,i){this.takeStep(t);let a=structuredClone(this.config);n(a),wa(a,i),Un(a),this.config=a}setTestValues(n,t){this.takeStep(t),this.testValues=n}takeStep(n){let t=Date.now();(this.held?this.heldStepTaken:n!==void 0&&n===this.coalesceKey&&t<this.coalesceUntil)||(this.past.push({config:structuredClone(this.config),testValues:this.testValues}),this.past.length>J0&&this.past.shift(),this.future=[]),this.heldStepTaken=this.held,this.coalesceKey=n,this.coalesceUntil=n===void 0?0:t+800}markDirty(){this.baseline=""}beginGesture(){this.endGesture(),this.held=!0}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0,this.held=!1,this.heldStepTaken=!1}undo(){let n=this.past.pop();n&&(this.future.push({config:this.config,testValues:this.testValues}),this.config=n.config,this.testValues=n.testValues,this.endGesture())}redo(){let n=this.future.pop();n&&(this.past.push({config:this.config,testValues:this.testValues}),this.config=n.config,this.testValues=n.testValues,this.endGesture())}encoded(){let n=structuredClone(this.config);return n.dataSources=Ec(n),fa(n)}commit(){let n=structuredClone(this.config);return n.dataSources=Ec(n),new e(n,null)}};var nl=class{constructor(){this.watched=new Map;this.onScroll=n=>this.mark(n.currentTarget);this.observer=new ResizeObserver(()=>{for(let n of this.watched.keys())this.mark(n)})}refresh(n){let t=new Set(n.filter(i=>i!=null));for(let[i,a]of[...this.watched])t.has(i)||this.drop(i,a);for(let i of t){let a=this.watched.get(i);a||(a=new Set,this.watched.set(i,a),i.addEventListener("scroll",this.onScroll,{passive:!0}),this.observer.observe(i));for(let r of a)r.parentElement!==i&&(this.observer.unobserve(r),a.delete(r));for(let r of i.children)a.has(r)||(a.add(r),this.observer.observe(r));this.mark(i)}}disconnect(){for(let[n,t]of[...this.watched])this.drop(n,t);this.observer.disconnect()}drop(n,t){n.removeEventListener("scroll",this.onScroll),this.observer.unobserve(n);for(let i of t)this.observer.unobserve(i);this.watched.delete(n)}mark(n){let t=n.scrollHeight-n.clientHeight,i=t>1;n.toggleAttribute("data-more-above",i&&n.scrollTop>1),n.toggleAttribute("data-more-below",i&&n.scrollTop<t-1)}};var Ra={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",timeBetween:"is between times",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},Zt={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",fontDesign:"Typeface",fontWidth:"Width",italic:"Italic",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},zg=["icon","text","color","visibility","opacity","fontSize","fontWeight","fontDesign","fontWidth","italic","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],Og={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",fontDesign:"setFontDesign",fontWidth:"setFontWidth",italic:"setItalic",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},pu=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],Z0=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function hu(e){return Z0.includes(e)}function Q0(e){return pu.includes(e)}function e$(e,n){return JSON.stringify(fe(e))===JSON.stringify(fe(n))}function fu(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let n=e[0];if(!n)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let t,i=[];for(let[r,o]of n.cases.entries()){let s=o.when.tests;if(s.length!==1)return{ok:!1,reason:s.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${s.length} things at once. A table row checks one.`};let l=s[0];if(!Q0(l.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${Ra[l.comparison.kind]}", which a table row cannot show.`};if(t===void 0)t=l.value;else if(!e$(t,l.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let c=Pg(o.then);if(c)return{ok:!1,reason:`State ${r+1} sets ${Zt[c]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:l.id,join:o.when.join,comparison:l.comparison,changes:o.then})}if(n.otherwise){let r=Pg(n.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${Zt[r]} twice. A table has one cell per column.`}}let a={ruleId:n.id,rows:i,columns:t$(i,n.otherwise),numberMode:i.length>0&&i.every(r=>hu(r.comparison.kind))};return t!==void 0&&(a.value=t),n.otherwise&&(a.otherwise=n.otherwise),{ok:!0,table:a}}function Pg(e){let n=new Set;for(let t of e){let i=Ye[t.kind];if(n.has(i))return i;n.add(i)}}function t$(e,n){let t=new Set;for(let i of e)for(let a of i.changes)t.add(Ye[a.kind]);for(let i of n??[])t.add(Ye[i.kind]);return zg.filter(i=>t.has(i))}function Gg(e,n,t){let i=new Set(e);for(let a of n)i.add(a);return zg.filter(a=>i.has(a)&&t.includes(a))}function il(e,n){return e.find(t=>Ye[t.kind]===n)}function al(e,n,t,i){let a=n.map(o=>({id:o.caseId??re(),when:{join:o.join??"all",tests:[{id:o.testId??re(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??re(),cases:a};return t&&(r.otherwise=t),r}function Gr(e){if(e.length===0)return"No states yet.";let n=fu(e);if(!n.ok)return"Advanced rules.";let t=n.table.rows.length+(n.table.otherwise?1:0);return t===1?"1 state.":`${t} states.`}function Bg(e){return`No states yet. This ${e==="layout"?"shape":"layer"} looks the same whatever the value is.`}function Br(e){return{state:`When the value matches, change how this ${e==="layout"?"shape":"layer"} looks.`,otherwise:"The look when no state above matches.",column:"Adds a column, so every state can change it.",fill:"One row per state this entity reports, ready to edit."}}function Vg(e){let n=e[0];return n||(n={id:re(),cases:[]},e.push(n)),n}function Ug(e){let n=e[0];n&&n.cases.length===0&&n.otherwise===void 0&&(e.length=0)}function Wg(e,n,t){let i=Vg(e),a=i.cases[i.cases.length-1]?.when.tests[0]?.comparison;i.cases.push({id:re(),when:{join:"all",tests:[{id:re(),value:structuredClone(n),comparison:i$(a,t)}]},then:[]})}function Kg(e,n){let t=e[0];t&&(t.cases=t.cases.filter(i=>i.id!==n),Ug(e))}function mu(e,n,t){let i=e[0]?.cases;if(!i||t<0||t>=i.length)return;let[a]=i.splice(n,1);a&&i.splice(t,0,a)}function gu(e,n){if(n){Vg(e).otherwise=[];return}let t=e[0];t&&(delete t.otherwise,Ug(e))}function jg(e,n){for(let t of e[0]?.cases??[]){let i=t.when.tests[0];i&&(i.value=structuredClone(n))}}function qg(e,n){let t=e[0];if(!t)return;let i=a=>a.filter(r=>Ye[r.kind]!==n);for(let a of t.cases)a.then=i(a.then);t.otherwise&&(t.otherwise=i(t.otherwise))}function n$(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function Yg(e,n=n$){let t=()=>n(e.value??K(""));switch(e.kind){case"lessThan":return`below ${t()}`;case"lessOrEqual":return`${t()} or below`;case"greaterThan":return`above ${t()}`;case"greaterOrEqual":return`${t()} or above`;case"between":return`${t()} to ${n(e.upper??K(""))}`;case"timeBetween":return`${t()} to ${n(e.upper??K(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return Ai(e.kind)==="value"?`${Ra[e.kind]} ${t()}`:Ra[e.kind]}}function i$(e,n){if(!e)return n?{kind:"lessThan",value:K("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??K("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??K("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??K("0")};default:return{kind:e.kind,...Ai(e.kind)==="value"?{value:K("")}:{}}}}var Xg={text:"text",icon:"icon",gauge:"color",chart:"color",timeline:"visibility",shape:"color",image:"visibility",tap:"visibility",chartTimes:"visibility",chartDots:"visibility",chartGrid:"visibility",imageTime:"visibility",list:"visibility",layout:"backgroundColor"};function Jg(e){if(!e)return!1;let n=e.kind;if(n.kind!=="entityState")return!1;let t=n.domain||n.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(t)}function a$(e){switch(e){case"text":return v`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return v`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return v`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return v`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return v`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return v`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return v`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return v`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return v`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return v`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"list":return v`<circle cx="5.5" cy="7" r="1.6" /><circle cx="5.5" cy="12" r="1.6" /><circle cx="5.5" cy="17" r="1.6" /><path d="M10 7H19M10 12H19M10 17H19" />`;case"chartDots":return v`<path d="M4 16L10 10L14 13L20 7" /><circle cx="4" cy="16" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="14" cy="13" r="1.8" /><circle cx="20" cy="7" r="1.8" />`;case"chartGrid":return v`<path d="M4 7H20M4 12H20M4 17H20" />`;case"chartTimes":case"imageTime":case"clock":return v`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return v`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return v`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return v`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return v`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return v`<path d="M6 9L12 15L18 9" />`;case"plus":return v`<path d="M12 5V19M5 12H19" />`;case"braces":return v`<path d="M9 4.5C6.9 4.5 6.3 5.55 6.3 7.5v2.4c0 1.2-.75 2.1-2.1 2.1 1.35 0 2.1.9 2.1 2.1v2.4c0 1.95.6 3 2.7 3" /><path d="M15 4.5c2.1 0 2.7 1.05 2.7 3v2.4c0 1.2.75 2.1 2.1 2.1-1.35 0-2.1.9-2.1 2.1v2.4c0 1.95-.6 3-2.7 3" />`;case"link":return v`<path d="M10.2 13.8L13.8 10.2" /><path d="M10.8 6.9l1.35-1.35a3.6 3.6 0 0 1 5.1 5.1l-1.35 1.35" /><path d="M13.2 17.1l-1.35 1.35a3.6 3.6 0 0 1-5.1-5.1l1.35-1.35" />`;case"info":return v`<circle cx="12" cy="12" r="8.5" /><path d="M12 11V16.5" /><path d="M12 7.6V7.8" />`;case"globe":return v`<circle cx="12" cy="12" r="8.5" /><path d="M3.5 12H20.5" /><path d="M12 3.5c2.5 3 2.5 14 0 17M12 3.5c-2.5 3-2.5 14 0 17" />`;case"download":return v`<path d="M12 4V15" /><path d="M7 10L12 15L17 10" /><path d="M5 20H19" />`;case"check":return v`<path d="M5 12.5L9.5 17L19 7.5" />`;case"arrow":return v`<path d="M5 12H19" /><path d="M13 6L19 12L13 18" />`;case"guides":return v`<path d="M12 3V21" /><rect x="4" y="6" width="8" height="4.5" rx="1.3" /><rect x="12" y="13.5" width="8" height="4.5" rx="1.3" />`;case"paste":return v`<rect x="6" y="4.5" width="12" height="16" rx="2" /><path d="M9 4.5V3.5H15V4.5" /><path d="M9 11H15M9 15H13" />`;case"watch":return v`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"compact":return v`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return v`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"lock":return v`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return v`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return v`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return v`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return v`<path d="M6 14L12 8L18 14" />`;case"down":return v`<path d="M6 10L12 16L18 10" />`;case"left":return v`<path d="M14 6L8 12L14 18" />`;case"right":return v`<path d="M10 6L16 12L10 18" />`;case"show":return v`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return v`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return v`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return v`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return v`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return v`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return v`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`;case"undo":return v`<path d="M9 14L4 9L9 4" /><path d="M4 9H15A5 5 0 0 1 15 19H12" />`;case"redo":return v`<path d="M15 14L20 9L15 4" /><path d="M20 9H9A5 5 0 0 0 9 19H12" />`;case"expand":return v`<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" />`}}function D(e){return h`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${a$(e)}</svg>`}var Nt="color-mix(in srgb, var(--k) 45%, #6b7280)",Di='system-ui, -apple-system, "Segoe UI", sans-serif';function Zg(e,n,t,i){let r=135+270*Math.max(0,Math.min(1,i)),o=d=>{let u=d*Math.PI/180;return{x:(e-t*Math.cos(u)).toFixed(2),y:(n-t*Math.sin(u)).toFixed(2)}},s=o(135),l=o(r),c=r-135>180?1:0;return`M${s.x} ${s.y}A${t} ${t} 0 ${c} 1 ${l.x} ${l.y}`}function yu(e,n,t,i){return v`<g fill="none" stroke-linecap="round">
    <path d=${Zg(e,n,t,1)} stroke=${Nt} stroke-width="2.6" opacity=".5" />
    <path d=${Zg(e,n,t,i)} stroke="var(--k)" stroke-width="2.6" />
  </g>`}function r$(e){switch(e){case"text":return v`<g font-family=${Di} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${Nt}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${Nt}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${Nt}>1.2 kW</text>
      </g>`;case"icon":return v`<g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
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
      </g>`;case"gauge":return v`<g>
        ${yu(22,24,12,.28)}
        ${yu(60,24,12,.62)}
        ${yu(98,24,12,.92)}
        <text x="60" y="27" font-family=${Di} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;case"chart":return v`<g>
        <g opacity=".4" fill=${Nt}>
          <rect x="72" y="26" width="6" height="14" rx="1.5" />
          <rect x="82" y="18" width="6" height="22" rx="1.5" />
          <rect x="92" y="29" width="6" height="11" rx="1.5" />
          <rect x="102" y="12" width="6" height="28" rx="1.5" />
        </g>
        <path d="M4 40L4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15L68 40Z" fill="var(--k)" opacity=".22" />
        <path d="M4 30L12 22L20 27L28 14L36 20L44 11L52 18L60 8L68 15" fill="none" stroke="var(--k)"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="60" cy="8" r="2.6" fill="var(--k)" />
      </g>`;case"timeline":return v`<g>
        <rect x="6" y="17" width="30" height="12" rx="2.5" fill=${Nt} opacity=".55" />
        <rect x="37" y="17" width="18" height="12" rx="2.5" fill="var(--k)" />
        <rect x="56" y="17" width="8" height="12" rx="2.5" fill=${Nt} opacity=".55" />
        <rect x="65" y="17" width="24" height="12" rx="2.5" fill="var(--k)" />
        <rect x="90" y="17" width="24" height="12" rx="2.5" fill=${Nt} opacity=".55" />
        <text x="6" y="39" font-family=${Di} font-size="7" fill=${Nt}>1h ago</text>
        <text x="114" y="39" font-family=${Di} font-size="7" text-anchor="end" fill=${Nt}>now</text>
      </g>`;case"shape":return v`<g fill="none" stroke="var(--k)" stroke-width="2">
        <rect x="6" y="12" width="26" height="22" rx="6" fill="var(--k)" fill-opacity=".18" />
        <rect x="40" y="11" width="2.5" height="24" fill="var(--k)" stroke="none" />
        <circle cx="63" cy="23" r="11" />
        <rect x="83" y="16" width="31" height="14" rx="7" stroke-dasharray="3 3" opacity=".7" />
      </g>`;case"image":return v`<g>
        <rect x="26" y="7" width="68" height="32" rx="5" fill="var(--k)" fill-opacity=".16"
          stroke="var(--k)" stroke-width="1.8" />
        <circle cx="44" cy="18" r="4" fill="var(--k)" opacity=".75" />
        <path d="M28 37L47 24L60 32L74 20L92 37Z" fill="var(--k)" opacity=".55" />
      </g>`;case"tap":return v`<g>
        <rect x="30" y="6" width="60" height="34" rx="8" fill="var(--k)" fill-opacity=".12"
          stroke="var(--k)" stroke-width="1.6" stroke-dasharray="5 4" />
        <g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
          transform="translate(48 9) scale(1)">
          <path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" />
          <path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" />
          <path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />
        </g>
      </g>`;case"chartTimes":return v`<g font-family=${Di} font-size="8" fill="var(--k)">
        <text x="6" y="27">9 AM</text>
        <text x="60" y="27" text-anchor="middle">1 PM</text>
        <text x="114" y="27" text-anchor="end">5 PM</text>
      </g>`;case"chartDots":return v`<g fill="var(--k)">
        <circle cx="20" cy="30" r="3" /><circle cx="45" cy="18" r="3" /><circle cx="70" cy="24" r="3" /><circle cx="95" cy="12" r="3" />
      </g>`;case"chartGrid":return v`<g stroke="var(--k)" stroke-width="1.4" opacity=".7">
        <path d="M10 12H110M10 23H110M10 34H110" />
      </g>`;case"list":return v`<g font-family=${Di}>
        <g fill="var(--k)"><circle cx="14" cy="12" r="3.2" /><circle cx="14" cy="23" r="3.2" /><circle cx="14" cy="34" r="3.2" /></g>
        <g fill=${Nt} font-size="9">
          <text x="24" y="15">Kitchen</text><text x="24" y="26">Hall</text><text x="24" y="37">Porch</text>
        </g>
        <g fill="var(--k)" font-size="9" text-anchor="end">
          <text x="108" y="15">21°</text><text x="108" y="26">19°</text><text x="108" y="37">12°</text>
        </g>
      </g>`;case"imageTime":return v`<g>
        <rect x="30" y="14" width="60" height="18" rx="9" fill="var(--k)" fill-opacity=".3" />
        <text x="60" y="27" text-anchor="middle" font-family=${Di} font-size="10" fill="var(--k)">3:41:07</text>
      </g>`}}function Qg(e){return h`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${r$(e)}</svg>`}var ey={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ty=e=>(...n)=>({_$litDirective$:e,values:n}),rl=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,t,i){this._$Ct=n,this._$AM=t,this._$Ci=i}_$AS(n,t){return this.update(n,t)}update(n,t){return this.render(...t)}};var{I:o$}=Qp,ny=e=>e;var iy=()=>document.createComment(""),Ma=(e,n,t)=>{let i=e._$AA.parentNode,a=n===void 0?e._$AB:n._$AA;if(t===void 0){let r=i.insertBefore(iy(),a),o=i.insertBefore(iy(),a);t=new o$(r,o,e,e.options)}else{let r=t._$AB.nextSibling,o=t._$AM,s=o!==e;if(s){let l;t._$AQ?.(e),t._$AM=e,t._$AP!==void 0&&(l=e._$AU)!==o._$AU&&t._$AP(l)}if(r!==a||s){let l=t._$AA;for(;l!==r;){let c=ny(l).nextSibling;ny(i).insertBefore(l,a),l=c}}}return t},Xn=(e,n,t=e)=>(e._$AI(n,t),e),s$={},ay=(e,n=s$)=>e._$AH=n,ry=e=>e._$AH,ol=e=>{e._$AR(),e._$AA.remove()};var oy=(e,n,t)=>{let i=new Map;for(let a=n;a<=t;a++)i.set(e[a],a);return i},bu=ty(class extends rl{constructor(e){if(super(e),e.type!==ey.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,n,t){let i;t===void 0?t=n:n!==void 0&&(i=n);let a=[],r=[],o=0;for(let s of e)a[o]=i?i(s,o):o,r[o]=t(s,o),o++;return{values:r,keys:a}}render(e,n,t){return this.dt(e,n,t).values}update(e,[n,t,i]){let a=ry(e),{values:r,keys:o}=this.dt(n,t,i);if(!Array.isArray(a))return this.ut=o,r;let s=this.ut??=[],l=[],c,d,u=0,p=a.length-1,f=0,g=r.length-1;for(;u<=p&&f<=g;)if(a[u]===null)u++;else if(a[p]===null)p--;else if(s[u]===o[f])l[f]=Xn(a[u],r[f]),u++,f++;else if(s[p]===o[g])l[g]=Xn(a[p],r[g]),p--,g--;else if(s[u]===o[g])l[g]=Xn(a[u],r[g]),Ma(e,l[g+1],a[u]),u++,g--;else if(s[p]===o[f])l[f]=Xn(a[p],r[f]),Ma(e,a[u],a[p]),p--,f++;else if(c===void 0&&(c=oy(o,f,g),d=oy(s,u,p)),c.has(s[u]))if(c.has(s[p])){let b=d.get(o[f]),y=b!==void 0?a[b]:null;if(y===null){let w=Ma(e,a[u]);Xn(w,r[f]),l[f]=w}else l[f]=Xn(y,r[f]),Ma(e,a[u],y),a[b]=null;f++}else ol(a[p]),p--;else ol(a[u]),u++;for(;f<=g;){let b=Ma(e,l[g+1]);Xn(b,r[f]),l[f++]=b}for(;u<=p;){let b=a[u++];b!==null&&ol(b)}return this.ut=o,ay(e,l),dn}});var sl=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:pc,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"doorHistory",title:"Door history",blurb:"A strip of when the entity was open over the last hour, with its name above. For a door, a window or anything else with two states.",domains:["binary_sensor","cover"],layerCount:2},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1},{kind:"listEvents",title:"Next events",blurb:"The next three events from one calendar, each with the time it starts.",domains:["calendar"],layerCount:1,group:"list",families:Ht},{kind:"listTodo",title:"To-do",blurb:"Open items from one list. Tap a row to complete it.",domains:["todo"],layerCount:1,group:"list",families:Ht},{kind:"listHourly",title:"Hourly forecast",blurb:"Six hours across the face: the time, the weather and the temperature.",domains:["weather"],layerCount:1,group:"list",families:Ht},{kind:"listDaily",title:"Daily forecast",blurb:"Five days across the face: the day, the weather, the high and the low.",domains:["weather"],layerCount:1,group:"list",families:Ht},{kind:"listLightsOn",title:"Lights on",blurb:"Every light that is on, one per row. Tap a row to turn that light off.",layerCount:1,group:"list",needsEntity:!1,families:Ht},{kind:"listBatteries",title:"Low batteries",blurb:"Your battery sensors, emptiest first, each with a bar that runs down as it does.",layerCount:1,group:"list",needsEntity:!1,families:Ht},{kind:"listRecent",title:"Recent activity",blurb:"Whatever changed most recently, newest first, with how long ago it was.",layerCount:1,group:"list",needsEntity:!1,families:Ht},{kind:"listScenes",title:"Scenes grid",blurb:"Your scenes as a two by two grid. Tap a cell to run that scene.",layerCount:1,group:"list",needsEntity:!1,families:Ht}];function wu(e){return sl.find(n=>n.kind===e)??sl[0]}var xu="#FF9F0A",kn="#8E8E93",l$=["#FF453A","#FFD60A","#34C759"],dy=["#0A84FF","#34C759","#FF9F0A"];function d$(e){return e?.attributes?.device_class==="battery"?l$:dy}var c$={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function vu(e){let n=e.iconName?.trim();return n?{off:n,on:n}:c$[ku(e)]??{off:"circle",on:"circle.fill"}}function u$(e){switch(ku(e)){case"lock":return{kind:"equals",value:K("locked")};case"cover":case"valve":return{kind:"equals",value:K("open")};case"media_player":return{kind:"equals",value:K("playing")};default:return{kind:"isOn"}}}function ku(e){return e.domain||e.entityId.split(".")[0]||""}function Et(e){return{...e,domain:ku(e)}}function p$(e){let n=e?.attributes??{},t=n.min,i=n.max;if(typeof t=="number"&&typeof i=="number"&&i>t)return{min:t,max:i};let a=typeof n.device_class=="string"?n.device_class:"",r=typeof n.unit_of_measurement=="string"?n.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function Fa(e){return Math.round(e*1e4)/1e4}function zi(e,n,t){return Math.min(t,Math.max(n,e))}function $u(e,n,t){let i=Ee[e],a=zi(Fa(n/i.width),0,1),r=zi(Fa(t/i.height),0,1);return{x:Fa((1-a)/2),y:Fa((1-r)/2),width:a,height:r,rotationDegrees:0}}function h$(e){let n=Ee[e],t=zi(Math.round(Math.min(n.width,n.height)*.55),12,30);return{frame:$u(e,t*1.3,t*1.3),size:t}}function f$(e){let n=Ee[e],t=zi(Math.round(Math.min(n.width,n.height)*.3),9,20);return{frame:$u(e,n.width*.88,t*1.7),size:t}}function m$(e){let n=Ee[e],t=Math.min(n.width,n.height)*.9;return{frame:$u(e,t,t),size:Math.max(2.5,Math.round(t*.2)/2)}}function cy(e){let n=e==="rectangular"||e==="medium";return{frame:{x:.05,y:n?.34:.3,width:.9,height:n?.42:.4,rotationDegrees:0},size:2}}function g$(e){let n=Ee[e],t=zi(Math.round(n.height*.2),6,14);return{frame:{x:.06,y:.56,width:.88,height:Fa(t/n.height),rotationDegrees:0}}}function y$(e){let n=Ee[e],t=zi(Math.round(Math.min(n.width,n.height)*.26),8,15);return{frame:{x:.06,y:.2,width:.88,height:Fa(zi(t*1.5/n.height,0,1)),rotationDegrees:0},size:t}}function b$(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function x$(e,n){n!==void 0&&(e.kind==="text"?e.payload.fontSize=n:e.kind==="icon"?e.payload.size=n:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=n))}function $n(e,n,t,i){let a=i(t);n.payload.frame=a.frame,x$(n,a.size);let r=e.perFamily[t]??(e.perFamily[t]=wn());r.placements[n.payload.id]={frame:a.frame,isHidden:!1,...a.size!==void 0?{size:a.size}:{}}}function ut(e){return Le(e)}function Cu(e,n){let t={kind:{kind:"entityState",...Et(e)}},i=n?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(t.format={useEntityUnit:!0}),t}function sy(e){let n=Wn("setIcon");return n.value=K(e),n}function Pi(e){let n=Wn("setColor");return n.value=K(e),n}function w$(e,n){let t=ka(),i=t.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...Et(e)}},a.comparison=u$(e);let r=n.on!==n.off;return i.then=r?[sy(n.on),Pi(xu)]:[Pi(xu)],t.otherwise=r?[sy(n.off),Pi(kn)]:[Pi(kn)],t}function v$(e){let n=ka(),t=n.cases[0],i=t.when.tests[0];i.value={kind:{kind:"entityState",...Et(e)}},i.comparison={kind:"isUnavailable"};let a=Wn("setOpacity");return a.number=.35,t.then=[a],n}function ly(e){let n=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(n)}function k$(e,n,t=dy){let i=n.max-n.min,a=ly(n.min+i/3),r=ly(n.min+i*2/3),o=[{comparison:{kind:"lessThan",value:K(a)},changes:[Pi(t[0])]},{comparison:{kind:"between",value:K(a),upper:K(r)},changes:[Pi(t[1])]},{comparison:{kind:"greaterThan",value:K(r)},changes:[Pi(t[2])]}];return al(Cu(e),o)}function $$(e,n,t){let i=ut("icon"),a=vu(n);return i.payload.symbol=K(a.off),i.payload.colorSlot.baseColorHex=kn,i.payload.rules=[w$(n,a)],$n(e,i,t.family,h$),e.elements.push(i),ws(e,i.payload.id,{type:"toggleEntity",...Et(n)}),i.payload.id}function C$(e,n,t){let i=ut("text");return i.payload.value=Cu(n,t.state),i.payload.rules=[v$(n)],$n(e,i,t.family,f$),e.elements.push(i),i.payload.id}function S$(e,n,t){let i=ut("gauge");i.payload.value=Cu(n);let a=p$(t.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[k$(n,a,d$(t.state))],$n(e,i,t.family,m$),e.elements.push(i),i.payload.id}function T$(e,n,t){let i=ut("chart");return i.payload.value={kind:{kind:"entityState",...Et(n)}},i.payload.historyMinutes=0,i.payload.highlight="both",i.payload.marker="pointer",$n(e,i,t.family,cy),e.elements.push(i),i.payload.id}function E$(e,n,t){let i=ut("chart");return i.payload.value={kind:{kind:"entityState",...Et(n)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",$n(e,i,t.family,cy),e.elements.push(i),i.payload.id}function R$(e,n,t){let i=Et(n),a=ut("text");a.payload.value=K(i.displayName||i.entityId),a.payload.colorSlot.baseColorHex=kn,$n(e,a,t.family,y$),e.elements.push(a);let r=t.state?.attributes?.device_class,o=ut("timeline");return o.payload.value={kind:{kind:"entityState",...i}},o.payload.bands=na(i.domain,typeof r=="string"?r:void 0),$n(e,o,t.family,g$),e.elements.push(o),o.payload.id}function M$(e,n,t){let i=ut("image");return i.payload.entity=Et(n),$n(e,i,t.family,b$),e.elements.push(i),i.payload.id}function F$(){return{x:.04,y:.06,width:.92,height:.88,rotationDegrees:0}}function Ke(e,n){let t={kind:{kind:"item",field:e}};return n&&(t.format=n),t}function it(e,n,t={}){let i=ut("text");return i.payload.value=e,i.payload.frame={...n,rotationDegrees:0},i.payload.fontSize=t.size??11,t.weight&&(i.payload.fontWeight=t.weight),t.align&&t.align!=="center"&&(i.payload.alignment=t.align),t.colorHex&&(i.payload.colorSlot.baseColorHex=t.colorHex),i}function Vr(e,n=11){let t=ut("icon");return t.payload.symbol=Ke("icon"),t.payload.frame={...e,rotationDegrees:0},t.payload.size=n,t}function A$(e,n,t){let i=ut("shape");return i.payload.kind="capsule",i.payload.borderWidth=0,i.payload.frame={...n,rotationDegrees:0},i.payload.colorSlot.baseColorHex=t,i.payload.level={...Vo(e),direction:"right"},i}function Su(e){let n=ut("tap");return n.payload.action=e,n.payload.frame={x:0,y:0,width:1,height:1,rotationDegrees:0},n}function Jn(e,n,t,i,a){let r=ut("list");return r.payload.source=t,r.payload.rows=i.rows,i.direction&&(r.payload.direction=i.direction),i.columns!==void 0&&(r.payload.columns=i.columns),i.gap!==void 0&&(r.payload.gap=i.gap),r.payload.template=a,$n(e,r,n.family,()=>({frame:F$()})),e.elements.push(r),r.payload.id}function I$(e,n,t){return Jn(e,t,{kind:"calendar",entities:[Et(n)],hours:24},{rows:3},[it(Ke("title"),{x:0,y:0,width:.68,height:1},{align:"leading"}),it(Ke("start",{timestamp:"clock"}),{x:.7,y:0,width:.3,height:1},{align:"trailing",colorHex:kn})])}function L$(e,n,t){let i=Et(n),a={type:"callService",serviceDomain:"todo",serviceName:"update_item",serviceDataJSON:'{"entity_id": "{item.listId}", "item": "{item.uid}", "status": "completed"}'};return Jn(e,t,{kind:"todo",entities:[i],status:"open",sort:"list"},{rows:4},[Vr({x:0,y:.1,width:.14,height:.8},10),it(Ke("title"),{x:.18,y:0,width:.82,height:1},{align:"leading"}),Su(a)])}function H$(e,n,t){return Jn(e,t,{kind:"forecast",...Et(n),type:"hourly"},{rows:6,direction:"across",gap:1},[it(Ke("time",{timestamp:"clock"}),{x:0,y:0,width:1,height:.3},{size:9,colorHex:kn}),Vr({x:.15,y:.34,width:.7,height:.32},12),it(Ke("temperature",{decimals:0,suffix:"\xB0"}),{x:0,y:.7,width:1,height:.3},{size:10})])}function _$(e,n,t){return Jn(e,t,{kind:"forecast",...Et(n),type:"daily"},{rows:5,direction:"across",gap:1},[it(Ke("time",{timestamp:"weekday"}),{x:0,y:0,width:1,height:.26},{size:9,colorHex:kn}),Vr({x:.18,y:.3,width:.64,height:.28},12),it(Ke("temperature",{decimals:0,suffix:"\xB0"}),{x:0,y:.6,width:1,height:.22},{size:10}),it(Ke("templow",{decimals:0,suffix:"\xB0"}),{x:0,y:.8,width:1,height:.2},{size:9,colorHex:kn})])}function N$(e,n){return Jn(e,n,{kind:"entities",scope:{kind:"filter",domains:["light"],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"},sort:"name",descending:!1,attributes:[]},{rows:4},[Vr({x:0,y:.1,width:.14,height:.8},10),it(Ke("name"),{x:.18,y:0,width:.82,height:1},{align:"leading"}),Su({type:"toggleEntity",entityId:"{item.entityId}",displayName:"",domain:""})])}function D$(e,n){return Jn(e,n,{kind:"entities",scope:{kind:"filter",domains:["sensor"],areaIds:[],labelIds:[],floorIds:[]},deviceClass:"battery",sort:"state",descending:!1,attributes:[]},{rows:4},[A$(Ke("state"),{x:0,y:.34,width:.14,height:.32},xu),it(Ke("name"),{x:.18,y:0,width:.5,height:1},{align:"leading"}),it(Ke("state",{decimals:0,useEntityUnit:!0}),{x:.7,y:0,width:.3,height:1},{align:"trailing"})])}function P$(e,n){return Jn(e,n,{kind:"entities",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},sort:"lastChanged",descending:!0,attributes:[]},{rows:4},[it(Ke("name"),{x:0,y:0,width:.7,height:1},{align:"leading"}),it(Ke("age",{relativeTime:!0}),{x:.72,y:0,width:.28,height:1},{align:"trailing",colorHex:kn})])}function z$(e,n){return Jn(e,n,{kind:"entities",scope:{kind:"filter",domains:["scene"],areaIds:[],labelIds:[],floorIds:[]},sort:"name",descending:!1,attributes:[]},{rows:4,columns:2,gap:3},[Vr({x:.34,y:.06,width:.32,height:.44},12),it(Ke("name"),{x:0,y:.54,width:1,height:.46},{size:9}),Su({type:"runScene",entityId:"{item.entityId}",displayName:"",domain:""})])}function Tu(e,n,t,i){switch(n){case"toggle":return $$(e,t,i);case"status":return C$(e,t,i);case"gauge":return S$(e,t,i);case"chart":return T$(e,t,i);case"history":return E$(e,t,i);case"doorHistory":return R$(e,t,i);case"camera":return M$(e,t,i);case"listEvents":return I$(e,t,i);case"listTodo":return L$(e,t,i);case"listHourly":return H$(e,t,i);case"listDaily":return _$(e,t,i);case"listLightsOn":return N$(e,i);case"listBatteries":return D$(e,i);case"listRecent":return P$(e,i);case"listScenes":return z$(e,i)}}var Qt=At("on"),en=At("off"),pt=At("open"),ht=At("closed"),O$=At("unavailable"),G$=["light","switch","fan","input_boolean"],B$={door:{on:{symbol:"door.left.hand.open",colorHex:pt},off:{symbol:"door.left.hand.closed",colorHex:ht}},garage_door:{on:{symbol:"door.left.hand.open",colorHex:pt},off:{symbol:"door.left.hand.closed",colorHex:ht}},opening:{on:{symbol:"door.left.hand.open",colorHex:pt},off:{symbol:"door.left.hand.closed",colorHex:ht}},window:{on:{symbol:"window.casement",colorHex:pt},off:{symbol:"curtains.closed",colorHex:ht}},motion:{on:{symbol:"figure.walk",colorHex:Qt},off:{symbol:"figure.stand",colorHex:en}},occupancy:{on:{symbol:"figure.walk",colorHex:Qt},off:{symbol:"figure.stand",colorHex:en}},presence:{on:{symbol:"figure.walk",colorHex:Qt},off:{symbol:"figure.stand",colorHex:en}},moisture:{on:{symbol:"drop.fill",colorHex:pt},off:{symbol:"drop",colorHex:en}},smoke:{on:{symbol:"exclamationmark.triangle.fill",colorHex:pt},off:{symbol:"checkmark.circle.fill",colorHex:ht}},gas:{on:{symbol:"exclamationmark.triangle.fill",colorHex:pt},off:{symbol:"checkmark.circle.fill",colorHex:ht}},carbon_monoxide:{on:{symbol:"exclamationmark.triangle.fill",colorHex:pt},off:{symbol:"checkmark.circle.fill",colorHex:ht}},problem:{on:{symbol:"exclamationmark.triangle.fill",colorHex:pt},off:{symbol:"checkmark.circle.fill",colorHex:ht}},safety:{on:{symbol:"exclamationmark.triangle.fill",colorHex:pt},off:{symbol:"checkmark.circle.fill",colorHex:ht}},battery:{on:{symbol:"battery.25percent",colorHex:pt},off:{symbol:"battery.100percent",colorHex:ht}},lock:{on:{symbol:"lock.open.fill",colorHex:pt},off:{symbol:"lock.fill",colorHex:ht}},plug:{on:{symbol:"powerplug.fill",colorHex:Qt},off:{symbol:"poweroutlet.type.b.fill",colorHex:en}},power:{on:{symbol:"powerplug.fill",colorHex:Qt},off:{symbol:"poweroutlet.type.b.fill",colorHex:en}},connectivity:{on:{symbol:"wifi",colorHex:ht},off:{symbol:"wifi.slash",colorHex:pt}},sound:{on:{symbol:"speaker.wave.2.fill",colorHex:Qt},off:{symbol:"speaker.slash.fill",colorHex:en}},running:{on:{symbol:"play.fill",colorHex:Qt},off:{symbol:"stop.fill",colorHex:en}},update:{on:{symbol:"arrow.down.circle.fill",colorHex:Qt},off:{symbol:"checkmark.circle.fill",colorHex:ht}}},V$={on:{symbol:"circle.fill",colorHex:Qt},off:{symbol:"circle",colorHex:en}},U$=[{state:"sunny",symbol:"sun.max.fill",colorHex:"#FFD60A"},{state:"clear-night",symbol:"moon.stars.fill",colorHex:"#5E5CE6"},{state:"partlycloudy",symbol:"cloud.sun.fill",colorHex:"#64D2FF"},{state:"cloudy",symbol:"cloud.fill",colorHex:"#8E8E93"},{state:"fog",symbol:"cloud.fog.fill",colorHex:"#AEAEB2"},{state:"rainy",symbol:"cloud.rain.fill",colorHex:"#64D2FF"},{state:"pouring",symbol:"cloud.heavyrain.fill",colorHex:"#0A84FF"},{state:"lightning",symbol:"cloud.bolt.fill",colorHex:"#FFD60A"},{state:"lightning-rainy",symbol:"cloud.bolt.rain.fill",colorHex:"#FFD60A"},{state:"snowy",symbol:"cloud.snow.fill",colorHex:"#FFFFFF"},{state:"snowy-rainy",symbol:"cloud.drizzle.fill",colorHex:"#AEAEB2"},{state:"hail",symbol:"cloud.snow.fill",colorHex:"#64D2FF"},{state:"windy",symbol:"wind",colorHex:"#8E8E93"},{state:"windy-variant",symbol:"wind",colorHex:"#8E8E93"},{state:"exceptional",symbol:"exclamationmark.triangle.fill",colorHex:"#FF453A"}],W$={cover:[{state:"open",symbol:"window.casement"},{state:"closed",symbol:"curtains.closed"},{state:"opening",symbol:"arrow.up"},{state:"closing",symbol:"arrow.down"}],lock:[{state:"locked",symbol:"lock.fill"},{state:"unlocked",symbol:"lock.open.fill"},{state:"jammed",symbol:"exclamationmark.triangle.fill"}],media_player:[{state:"playing",symbol:"play.fill"},{state:"paused",symbol:"pause.fill"},{state:"idle",symbol:"stop.fill"},{state:"standby",symbol:"zzz"},{state:"off",symbol:"speaker.slash.fill"}],climate:[{state:"heat",symbol:"flame.fill"},{state:"cool",symbol:"snowflake"},{state:"heat_cool",symbol:"thermometer.medium"},{state:"dry",symbol:"humidity.fill"},{state:"fan_only",symbol:"fan.fill"},{state:"auto",symbol:"thermometer.variable"},{state:"off",symbol:"power"}],vacuum:[{state:"cleaning",symbol:"sparkles"},{state:"returning",symbol:"arrow.counterclockwise"},{state:"docked",symbol:"powerplug.fill"},{state:"idle",symbol:"pause.fill"},{state:"error",symbol:"exclamationmark.triangle.fill"}],alarm_control_panel:[{state:"disarmed",symbol:"shield.slash.fill"},{state:"armed_home",symbol:"house.fill"},{state:"armed_away",symbol:"shield.fill"},{state:"armed_night",symbol:"moon.fill"},{state:"armed_vacation",symbol:"airplane",colorHex:"#5E5CE6"},{state:"arming",symbol:"hourglass"},{state:"pending",symbol:"hourglass"},{state:"triggered",symbol:"bell.badge.fill"}],person:[{state:"home",symbol:"house.fill"},{state:"not_home",symbol:"figure.walk"}],device_tracker:[{state:"home",symbol:"house.fill"},{state:"not_home",symbol:"figure.walk"}]},uy={state:"unavailable",symbol:"questionmark.circle.fill",colorHex:O$};function py(e,n){let t=K$(e.trim().toLowerCase(),(n??"").trim().toLowerCase());return t.length===0?[]:[...t,uy]}function K$(e,n){if(G$.includes(e)){let t=vu({entityId:`${e}.seed`,displayName:"",domain:e});return[{state:"on",symbol:t.on,colorHex:Qt},{state:"off",symbol:t.off,colorHex:en}]}if(e==="binary_sensor"){let t=B$[n]??V$;return[{state:"on",symbol:t.on.symbol,colorHex:t.on.colorHex},{state:"off",symbol:t.off.symbol,colorHex:t.off.colorHex}]}return e==="weather"?U$.map(t=>({...t})):(W$[e]??[]).map(t=>({state:t.state,symbol:t.symbol,colorHex:t.colorHex??At(t.state)}))}function hy(e,n){return e.map(t=>{let i=[];return n.icon&&i.push({kind:"setIcon",value:K(t.symbol)}),n.color&&i.push({kind:"setColor",value:K(t.colorHex)}),{comparison:t.state===uy.state?{kind:"isUnavailable"}:{kind:"equals",value:K(t.state)},changes:i}})}function fy(e){let n=e?.kind;if(n?.kind!=="entityState")return;let t=n.domain||n.entityId.split(".")[0]||"";return t===""?void 0:{entityId:n.entityId,domain:t}}var my="sun.sun";function gy(e){let n=e?.[my],t=typeof n?.attributes?.friendly_name=="string"?n.attributes.friendly_name.trim():"";return{entityId:my,displayName:t||"Sun",domain:"sun"}}var yy=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],j$=[0,1,2,3,4];function by(e){let n=[];for(let t of e??[]){let i=t.trim();if(i==="")continue;let a=Number(i);Number.isInteger(a)&&a>=0&&a<=6&&!n.includes(a)&&n.push(a)}return n.sort((t,i)=>t-i)}function Eu(e){return[...new Set(e)].filter(n=>n>=0&&n<=6).sort((n,t)=>n-t).map(String)}var xy=[{kind:"afterSunset",label:"After sunset",hint:"True from sunset to sunrise, from the sun entity's own state."},{kind:"daytime",label:"Daytime",hint:"True while the sun is up."},{kind:"sunElevation",label:"Sun below an angle",hint:"The sun's elevation in degrees, below a number you set. 0 is the horizon."},{kind:"weekday",label:"Weekday is one of",hint:"A row of days, starting on Monday to Friday."},{kind:"timeBetween",label:"Time between",hint:"A clock window that may wrap midnight, starting at 22:00 to 06:00."}];function q$(e){return[wy(e,"below_horizon")]}function Y$(e){return[wy(e,"above_horizon")]}function wy(e,n){return{id:re(),value:{kind:{kind:"entityState",...e}},comparison:{kind:"equals",value:K(n)}}}function X$(e,n=0){return[{id:re(),value:{kind:{kind:"entityAttribute",...e,attribute:"elevation"}},comparison:{kind:"lessThan",value:K(String(n))}}]}function J$(e=j$){return[{id:re(),value:{kind:{kind:"time",timeField:"weekday"}},comparison:{kind:"isOneOf",options:Eu(e)}}]}function Z$(e="22:00",n="06:00"){return[{id:re(),value:{kind:{kind:"time",timeField:"now"}},comparison:{kind:"timeBetween",value:K(e),upper:K(n)}}]}function vy(e,n){switch(e){case"afterSunset":return q$(n);case"daytime":return Y$(n);case"sunElevation":return X$(n);case"weekday":return J$();case"timeBetween":return Z$()}}var Aa=["index","Position (0 first)"],Q$={entities:[["name","Name"],["state","State"],["unit","Unit"],["entityId","Entity id"],["domain","Domain"],["deviceClass","Device class"],["area","Area"],["icon","Icon"],["lastChanged","Last changed (seconds)"],["age","Age (seconds)"],Aa],attribute:[["value","Value"],Aa],template:[["value","Value"],Aa],calendar:[["title","Title"],["start","Start (seconds)"],["end","End (seconds)"],["startsIn","Starts in (seconds)"],["endsIn","Ends in (seconds)"],["isAllDay","All day"],["location","Location"],["description","Description"],["calendar","Calendar"],["calendarId","Calendar id"],["icon","Icon"],Aa],todo:[["title","Title"],["status","Status"],["due","Due (seconds)"],["dueIn","Due in (seconds)"],["description","Description"],["uid","Item id"],["list","List"],["listId","List id"],["icon","Icon"],Aa],forecast:[["time","Time (seconds)"],["condition","Condition"],["icon","Icon"],["temperature","Temperature"],["templow","Low temperature"],["unit","Unit"],["precipitation","Precipitation"],["precipitationProbability","Chance of rain"],["humidity","Humidity"],["windSpeed","Wind speed"],["isDaytime","Daytime"],Aa]};function Mu(e){let n=Q$[e.kind];return e.kind!=="entities"||e.attributes.length===0?n:[...n,...e.attributes.map(t=>[`attr.${t}`,`Attribute: ${t}`])]}var Oi=60,Cn=3600,Ia=86400;function at(e,n){return Math.round(e+n)}function eC(e){return[{entityId:"light.kitchen",name:"Kitchen",state:"on",unit:null,domain:"light",deviceClass:null,area:"Kitchen",lastChanged:at(e,-2*Oi),n:null},{entityId:"light.hallway",name:"Hallway",state:"on",unit:null,domain:"light",deviceClass:null,area:"Hallway",lastChanged:at(e,-18*Oi),n:null},{entityId:"sensor.living_room_temperature",name:"Living room",state:"21.5",unit:"\xB0C",domain:"sensor",deviceClass:"temperature",area:"Living room",lastChanged:at(e,-1*Oi),n:21.5},{entityId:"binary_sensor.front_door",name:"Front door",state:"on",unit:null,domain:"binary_sensor",deviceClass:"door",area:"Hallway",lastChanged:at(e,-45),n:null}]}function tC(e){return[{entityId:"sensor.front_door_battery",name:"Front door",state:"8",unit:"%",domain:"sensor",deviceClass:"battery",area:"Hallway",lastChanged:at(e,-2*Oi),n:8},{entityId:"sensor.thermostat_battery",name:"Thermostat",state:"34",unit:"%",domain:"sensor",deviceClass:"battery",area:"Living room",lastChanged:at(e,-26*Oi),n:34},{entityId:"sensor.back_door_battery",name:"Back door",state:"67",unit:"%",domain:"sensor",deviceClass:"battery",area:"Kitchen",lastChanged:at(e,-3*Cn),n:67},{entityId:"sensor.doorbell_battery",name:"Doorbell",state:"95",unit:"%",domain:"sensor",deviceClass:"battery",area:"Hallway",lastChanged:at(e,-9*Cn),n:95}]}function nC(e){let n=Math.floor(e/Ia)*Ia;return[{title:"Bin day",start:n,end:n+Ia,isAllDay:!0,location:null,description:null,calendar:"Home",calendarId:"calendar.home"},{title:"Stand-up",start:at(e,25*Oi),end:at(e,40*Oi),isAllDay:!1,location:"Office",description:null,calendar:"Work",calendarId:"calendar.work"},{title:"Dentist",start:at(e,5*Cn),end:at(e,6*Cn),isAllDay:!1,location:"High Street",description:null,calendar:"Home",calendarId:"calendar.home"}]}function iC(e){return[{title:"Milk",status:"open",due:at(e,3*Cn),description:null,uid:"seed-1",list:"Shopping",listId:"todo.shopping"},{title:"Water the plants",status:"open",due:at(e,-20*Cn),description:null,uid:"seed-2",list:"Shopping",listId:"todo.shopping"},{title:"Book the car in",status:"open",due:"",description:null,uid:"seed-3",list:"Shopping",listId:"todo.shopping"}]}var aC=[["sunny",18,0],["partlycloudy",19,5],["partlycloudy",20,10],["cloudy",19,25],["rainy",17,70],["rainy",16,55]],rC=[["sunny",21,12,0],["partlycloudy",20,11,10],["rainy",17,10,80],["cloudy",18,11,30],["sunny",22,13,0]];function oC(e,n){if(n==="hourly"){let i=Math.ceil(e/Cn)*Cn;return aC.map(([a,r,o],s)=>({time:i+s*Cn,condition:a,temperature:r,templow:null,unit:"\xB0C",precipitation:o>20?.4:0,precipitationProbability:o,humidity:60+s,windSpeed:8+s,isDaytime:!0}))}let t=Math.floor(e/Ia)*Ia;return rC.map(([i,a,r,o],s)=>({time:t+s*Ia,condition:i,temperature:a,templow:r,unit:"\xB0C",precipitation:o>20?2.5:0,precipitationProbability:o,humidity:62+s,windSpeed:10+s,isDaytime:n==="twiceDaily"?s%2===0:!0}))}var sC=["Living room","Kitchen","Bedroom","Office"];function lC(e,n){switch(e.kind){case"entities":return e.deviceClass?.trim()==="battery"?tC(n):eC(n);case"calendar":return nC(n);case"todo":return iC(n);case"forecast":return oC(n,e.type);case"attribute":case"template":return[...sC]}}function Ru(e,n){let t=lC(e,n);return JSON.stringify({items:t,total:t.length})}var dC={entityId:"calendar.sample",displayName:"Sample calendar",domain:"calendar"},cC={entityId:"todo.sample",displayName:"Sample list",domain:"todo"},uC={entityId:"weather.sample",displayName:"Sample forecast",domain:"weather"},pC="{{ [] | to_json }}";function hC(e){switch(e.kind){case"calendar":return e.entities.some(n=>n.entityId!=="")?e:{...e,entities:[dC]};case"todo":return e.entities.some(n=>n.entityId!=="")?e:{...e,entities:[cC]};case"forecast":return e.entityId===""?{...e,...uC}:e;case"template":return e.value.trim()===""?{...e,value:pC}:e;default:return e}}function ky(e,n,t,i){let a=hC(e.source),r=Kn(a,e.rows),o=r??vn(a),l=(r!==void 0?n.get(r):o===void 0?void 0:t.get(o))??Ru(a,i),d=Hc(l,Xe(e.rows),a,i).items[0];return d===void 0?void 0:{source:a,fields:d.fields}}function fC(e){let n=[];for(let t of e.elements)t.kind==="list"&&n.push(t.payload);return n}function $y(e,n,t,i){if(!e)return{templateResults:n,listItems:t};let a=n,r=t;for(let o of fC(e)){let s=Kn(o.source,o.rows);if(s!==void 0){if(a.has(s))continue;a===n&&(a=new Map(n)),a.set(s,Ru(o.source,i));continue}let l=vn(o.source);l===void 0||r.has(l)||(r===t&&(r=new Map(t)),r.set(l,Ru(o.source,i)))}return{templateResults:a,listItems:r}}function Fu(e){delete e.coloring,delete e.bands,delete e.bandAboveColorHex,delete e.highlight,delete e.highColorHex,delete e.lowColorHex}function Kr(e){for(let n of e)delete n.partId}function Cy(e,n=re()){if(e.parts!==void 0&&e.parts.length>0)return e.parts[0].id;let t={id:n,value:structuredClone(e.value)};return e.coloring==="bands"&&(e.bands?.length??0)>0&&(t.coloring="bands",t.bands=e.bands,e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==xe&&(t.bandAboveColorHex=e.bandAboveColorHex)),Fu(e),e.parts=[t],e.value=pr(e.parts),n}function ll(e,n=[]){let t=e.parts??[];if(e.countdown===!0||t.length===0)return delete e.parts,Kr(e.rules),{ok:!0,joined:!1,moved:[]};if(t.length===1){let a=t[0],r=[];return e.value=a.value,a.fontSize!==void 0&&(e.fontSize=a.fontSize,r.push("fontSize")),a.fontWeight!==void 0&&(e.fontWeight=a.fontWeight,r.push("fontWeight")),a.colorHex!==void 0&&(e.colorSlot.baseColorHex=a.colorHex,r.push("color")),Fu(e),a.coloring!==void 0&&a.coloring!=="uniform"&&(e.coloring=a.coloring),a.bands!==void 0&&a.bands.length>0&&(e.bands=a.bands),a.bandAboveColorHex!==void 0&&(e.bandAboveColorHex=a.bandAboveColorHex),a.coloring==="bands"&&(a.bands?.length??0)>0&&r.push("bands"),delete e.parts,Kr(e.rules),{ok:!0,joined:!1,moved:r}}let i=Au(t,n);return i.ok?(e.value=i.value,Fu(e),delete e.parts,Kr(e.rules),{ok:!0,joined:!0}):i}function Ur(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Wr(e){return e.includes("{")?`{% raw %}${e}{% endraw %}`:e}function mC(e,n){let t=e,i=e.format;for(let r=0;t.kind.kind==="named";r++){if(r>8)return;let o=t.kind.id.toUpperCase(),s=n.find(l=>l.id.toUpperCase()===o)?.value;if(!s)return;i=We(i)?s.format:i,t=s}let a={kind:t.kind};return We(i)||(a.format=i),a}function gC(e,n){let t=mC(e,n);if(!t)return{blocked:"kind"};let i=wi(t);if(i!==void 0)return Wr(i);let a=t.kind,r=t.format??{};if(r.relativeTime||r.duration)return{blocked:"format"};let o="",s;switch(a.kind){case"entityState":s=`states(${Ur(a.entityId)})`;break;case"jinja":{if(a.value.trim()==="")return"";let d=a.value.includes("{{")||a.value.includes("{%"),u=r.decimals===void 0&&r.multiply===void 0&&r.offset===void 0&&!r.textCase;if(d&&u)return Wr(r.prefix??"")+a.value+Wr(r.suffix??"");d?(o=`{% set wa_text %}${a.value}{% endset %}`,s="wa_text"):s=`(${a.value})`;break}case"entityAttribute":case"entityAge":case"aggregate":case"time":{let d=Fr(a);if(d===void 0)return{blocked:"kind"};s=d;break}default:return{blocked:"kind"}}if(r.decimals!==void 0||r.multiply!==void 0||r.offset!==void 0){let d=`(${s} | float(0))`;r.multiply!==void 0&&(d=`(${d} * ${r.multiply})`),r.offset!==void 0&&(d=`(${d} + ${r.offset})`),s=r.decimals!==void 0?`${Ur(`%.${Math.max(0,Math.trunc(r.decimals))}f`)} | format(${d})`:d}let l=r.useEntityUnit&&"entityId"in a?a.entityId:void 0;l!==void 0&&(o+=`{% set wa_unit = state_attr(${Ur(l)}, 'unit_of_measurement') %}`);let c="('' if not wa_unit else (wa_unit if wa_unit[:1] in ['\xB0', '%'] else ' ' ~ wa_unit))";if(r.textCase){let d=r.textCase==="upper"?"upper":r.textCase==="lower"?"lower":"title",u=[...r.prefix?[Ur(r.prefix)]:[],`(${s})`,...l!==void 0?[c]:[],...r.suffix?[Ur(r.suffix)]:[]].join(" ~ ");return`${o}{{ (${u}) | ${d} }}`}return o+Wr(r.prefix??"")+`{{ ${s} }}`+(l!==void 0?`{{ ${c} }}`:"")+Wr(r.suffix??"")}function Au(e,n=[]){if(e.every(a=>a.value.kind.kind==="literal"))return{ok:!0,value:pr(e)};let t=[],i=[];return e.forEach((a,r)=>{let o=gC(a.value,n);typeof o=="string"?t.push(o):i.push({index:r,partId:a.id,reason:o.blocked})}),i.length>0?{ok:!1,blocked:i}:{ok:!0,value:{kind:{kind:"jinja",value:t.join("")}}}}var Sy=2,Iu=400,yC=.85,bC=[1,.8,.64,.51,.41,.33],Ty="image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif";function xC(e,n){let t=Number.isFinite(e)&&e>0?e*Sy:Iu,i=Number.isFinite(n)&&n>0?n*Sy:Iu,a=Math.min(1,Iu/Math.max(t,i));return{width:Math.max(1,Math.round(t*a)),height:Math.max(1,Math.round(i*a))}}function wC(e,n,t,i){if(!(e>0)||!(n>0))return{width:1,height:1};let a=Math.min(1,t/e,i/n);return{width:Math.max(1,Math.round(e*a)),height:Math.max(1,Math.round(n*a))}}function vC(e){return ls(e)<=wr}function dl(e){return e<=0?"0 KB":`${Math.max(1,Math.round(e/1024))} KB`}function kC(e){let n=e.indexOf(",");return n<0?"":e.slice(n+1)}async function $C(e){let n=URL.createObjectURL(e);try{return await new Promise(t=>{let i=new Image;i.onload=()=>t(i),i.onerror=()=>t(void 0),i.src=n})}finally{URL.revokeObjectURL(n)}}async function Ey(e,n){let t=await $C(e);if(!t||!(t.naturalWidth>0)||!(t.naturalHeight>0))return{error:"This browser could not read that picture. Try a PNG or a JPEG."};let i=xC(n.width,n.height),a=document.createElement("canvas"),r=a.getContext("2d");if(!r)return{error:"This browser has no canvas to resize the picture with."};for(let o of bC){let s=wC(t.naturalWidth,t.naturalHeight,Math.max(1,i.width*o),Math.max(1,i.height*o));a.width=s.width,a.height=s.height,r.clearRect(0,0,s.width,s.height),r.drawImage(t,0,0,s.width,s.height);let l=o===1?["png","jpeg"]:["jpeg"];for(let c of l){let d=kC(a.toDataURL(c==="png"?"image/png":"image/jpeg",c==="png"?void 0:yC));if(d!==""&&vC(d))return{data:d,format:c,width:s.width,height:s.height,bytes:ls(d)}}}return{error:`That picture will not fit in ${wr/1024} KB, even shrunk. Crop it or save it smaller first.`}}var pl=[["threshold","Threshold line"],["now","Now line"],["zero","Zero line"],["grid","Grid lines"],["dots","Dots"],["times","Clock times"]],My=[{label:"Newest",stat:"latest",marker:"latest"},{label:"First",stat:"first",marker:"first"},{label:"Highest",stat:"highest",marker:"highest"},{label:"Lowest",stat:"lowest",marker:"lowest"},{label:"Average",stat:"average"},{label:"Change",stat:"delta"},{label:"Total",stat:"sum"},{label:"Trend",stat:"trend"},{label:"Top of scale",stat:"top"},{label:"Bottom of scale",stat:"bottom"},{label:"Now",marker:"now"}],Gi="color-mix(in srgb, var(--k) 30%, #6b7280)",ul='system-ui, -apple-system, "Segoe UI", sans-serif',Qn=40,cl=6,CC=[22,17,11,16,27,23,35,31];function SC(e={}){let n=(e.values??[]).filter(p=>Number.isFinite(p)),t=n.length>=2,i=t?n:CC,a=Math.min(...i),r=Math.max(...i);t&&e.threshold!==void 0&&Number.isFinite(e.threshold)&&(a=Math.min(a,e.threshold),r=Math.max(r,e.threshold)),r===a&&(r+=1,a-=1);let o=p=>cl+(r-p)/(r-a)*(Qn-cl),s=i.length,l=i.map((p,f)=>10+f*100/(s-1)),c=i.map(o),d=p=>Math.min(Qn,Math.max(cl,p)),u=t&&e.now!==void 0&&Number.isFinite(e.now)?Math.min(s-1,Math.max(0,Math.round(e.now))):Math.round((s-1)*.6);return{xs:l,ys:c,y:o,real:t,zeroY:d(o(0)),thresholdY:d(o(t&&e.threshold!==void 0?e.threshold:(a+r)/2)),averageY:o(i.reduce((p,f)=>p+f,0)/s),column:{highest:i.indexOf(Math.max(...i)),lowest:i.indexOf(Math.min(...i)),first:0,latest:s-1,now:u}}}function TC(e){let n=e.xs.map((t,i)=>`${i===0?"M":"L"}${t.toFixed(1)} ${e.ys[i].toFixed(1)}`).join("");return v`
    <path d=${`${n}L${e.xs[e.xs.length-1]} ${Qn}L${e.xs[0]} ${Qn}Z`} fill=${Gi} opacity=".18" />
    <path d=${n} fill="none" stroke=${Gi} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`}function EC(e){let n=Math.min(10,Math.max(1,100/e.xs.length*.7));return v`${e.xs.map((t,i)=>{let a=Math.min(e.ys[i],Qn-1);return v`<rect x=${t-n/2} y=${a} width=${n} height=${Qn-a} rx=${Math.min(2,n/2)} fill=${Gi} opacity=".45" />`})}`}function RC(){return v`${[[4,30,.35],[35,18,.7],[54,10,.35],[65,26,.7],[92,24,.35]].map(([n,t,i])=>v`<rect x=${n} y="10" width=${t} height="16" rx="3" fill=${Gi} opacity=${i} />`)}`}function MC(){return v`
    <rect x="3" y="3" width="114" height="40" rx="5" fill=${Gi} opacity=".22" />
    <circle cx="30" cy="16" r="6" fill=${Gi} opacity=".6" />
    <path d="M3 43L3 36L34 20L56 32L80 16L117 38L117 43Z" fill=${Gi} opacity=".5" />`}function Zn(e,n,t=2.6){return v`<circle cx=${e.xs[n]} cy=${e.ys[n]} r=${t} fill="var(--k)" />`}function tn(e,n=!1){if(e===void 0||e==="")return"";let t=e.length*5.8+5,i=n?36:13;return v`<rect x="2" y=${i-9.5} width=${t} height="12.5" rx="3" fill="#000" fill-opacity=".7" />
    <text x="4.5" y=${i} font-family=${ul} font-size="10" font-weight="700" fill="var(--k)">${e}</text>`}function jr(e,n=!1){return v`<path d=${`M4 ${e}H116`} stroke="var(--k)" stroke-width="1.4" stroke-dasharray=${n?"4 3":"none"} />`}function Ry(e){return v`<g font-family=${ul} font-size="6.5" fill="var(--k)">
    <text x="4" y=${e}>9 AM</text><text x="60" y=${e} text-anchor="middle">1 PM</text><text x="116" y=${e} text-anchor="end">5 PM</text>
  </g>`}function FC(e,n,t){if(e==="timeline:times")return Ry(38);if(e==="image:time")return v`<rect x="70" y="30" width="42" height="10" rx="5" fill="#000" fill-opacity=".55" stroke="var(--k)" stroke-width=".8" />
      <text x="91" y="37.5" text-anchor="middle" font-family=${ul} font-size="7" fill="var(--k)">3:41:07</text>`;let[i,a]=e.split(":"),r=Math.min(2.2,Math.max(.8,40/n.xs.length));if(i==="draw")switch(a){case"threshold":return jr(n.thresholdY,!0);case"now":return v`<path d=${`M${n.xs[n.column.now]} 4V${Qn+2}`} stroke="var(--k)" stroke-width="1.4" />`;case"zero":return v`${jr(n.zeroY)}<text x="115" y=${Math.max(9,n.zeroY-3)} text-anchor="end" font-family=${ul} font-size="6.5" fill="var(--k)">0</text>`;case"times":return Ry(45);case"dots":return v`${n.xs.map((c,d)=>Zn(n,d,r))}`;case"grid":return v`<path d="M4 10H116M4 20H116M4 30H116M4 40H116" stroke="var(--k)" stroke-width=".8" opacity=".7" />`}if(i==="number"){let c=n.real?t[a]:void 0,{first:d,latest:u}=n.column;switch(a){case"latest":return v`${Zn(n,u)}${tn(c)}`;case"first":return v`${Zn(n,d)}${tn(c)}`;case"highest":return v`${Zn(n,n.column.highest)}${tn(c)}`;case"lowest":return v`${Zn(n,n.column.lowest)}${tn(c)}`;case"average":return v`${jr(n.averageY,!0)}${tn(c)}`;case"delta":return v`<path d=${`M${n.xs[d]} ${n.ys[d]}L${n.xs[u]} ${n.ys[u]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />
        ${Zn(n,d)}${Zn(n,u)}${tn(c)}`;case"sum":return v`${n.xs.map((p,f)=>Zn(n,f,r))}${tn(c)}`;case"trend":return v`<path d=${`M${n.xs[d]} ${n.ys[d]}L${n.xs[u]} ${n.ys[u]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />${tn(c)}`;case"top":return v`${jr(cl)}${tn(c,!0)}`;case"bottom":return v`${jr(Qn)}${tn(c)}`}}let o=n.column[a]??0,s=n.xs[o],l=Math.max(5,n.ys[o]-7);return a==="highest"?v`<path d=${`M${s} ${l-4}L${s+4} ${l+3}L${s-4} ${l+3}Z`} fill="var(--k)" />`:a==="now"?v`<path d=${`M${s-4} ${l-3}L${s+4} ${l-3}L${s} ${l+4}Z`} fill="var(--k)" />`:v`<circle cx=${s} cy=${l} r="3" fill="var(--k)" />`}function Lu(e){return e==="timeline:times"?"timeline":e==="image:time"?"image":"chart"}function Fy(e,n,t=!1,i={}){let a=SC(i),r=e==="timeline"?RC():e==="image"?MC():t?EC(a):TC(a),o=n!==void 0&&Lu(n)===e?FC(n,a,i.texts??{}):"";return h`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${r}${o}</svg>`}function Ay(e){if(e==="timeline:times")return"Clock times";if(e==="image:time")return"Timestamp";let[n,t]=e.split(":");return n==="draw"?pl.find(([i])=>i===t)?.[1]??t:n==="number"?`${Bt.find(([i])=>i===t)?.[1]??t} number`:`${Vt.find(([i])=>i===t)?.[1]??"Reading"} marker`}var AC={"draw:threshold":"A flat line at a value you pick, so a reading over it stands out.","draw:now":"An upright line through the reading that counts as now.","draw:zero":"A flat line where zero falls. It is drawn only when the readings cross zero.","draw:times":"The clock times of the chart's span, spread under the plot.","draw:dots":"A dot on every reading. Line and area charts only.","draw:grid":"Faint rules across the plot, to read heights against.","number:latest":"A text layer printing the newest reading, with the entity's unit after it.","number:first":"A text layer printing the oldest reading in the span.","number:highest":"A text layer printing the highest reading in the span.","number:lowest":"A text layer printing the lowest reading in the span.","number:average":"A text layer printing the average of every reading in the span.","number:delta":"A text layer printing the newest reading minus the first, with the unit after it.","number:sum":"A text layer printing every reading in the span added up, with the unit after it.","number:trend":"A text layer printing the change as an arrow: up, down, or flat when it is too small to print.","number:top":"A text layer printing the value at the top of the plot. On a Fixed scale, this is Max.","number:bottom":"A text layer printing the value at the bottom of the plot. On a Fixed scale, this is Min.","marker:highest":"An icon over the highest reading. It starts as a triangle.","marker:lowest":"An icon over the lowest reading. It starts as a dot.","marker:now":"An icon over the reading that counts as now.","marker:first":"An icon over the oldest reading.","marker:latest":"An icon over the newest reading.","marker:threshold":"An icon at the threshold's height.","marker:zero":"An icon at zero's height.","timeline:times":"The clock times of the timeline's span, spread under the strip.","image:time":"The time the picture was fetched, so a picture that stops updating reads as stale."};function Hu(e){return AC[e]}function Iy(e){let n=gr(e),t=e.fillColorHex!==void 0;if(e.style==="bars"){let i=e.barBorderWidth!==void 0;if(!n)return{main:"Bar colour",...t?{fill:{label:"Fill colour",empty:"Bar colour",note:"Fills every bar in place of Bar colour, even when a state changes the colour. Clear it to fill in Bar colour.",warn:!0}}:{},...i?{border:{label:"Border colour",empty:"White"}}:{}};let a={};return i?(a.fill={label:"Band fill",empty:"Each band's colour",...t?{note:"Every band with no fill of its own fills in this."}:{}},a.border={label:"Band border",empty:"White",note:"Every band with no border of its own uses this."}):t&&(a.fill={label:"Band fill",empty:"Each band's colour",note:"This fill wins over every band's colour. Clear it to fill each bar in its band's colour.",warn:!0}),a}return e.style==="line"?n?{}:{main:"Line colour"}:n?t?{fill:{label:"Fill colour",empty:"Band colours",...e.fillBands?{note:"A fill colour wins over Band fill. Clear it to fill each stretch in its band's colour.",warn:!0}:{}}}:e.fillBands?{}:{main:"Fill colour"}:{main:"Line colour",fill:{label:"Fill colour",empty:"Line colour"}}}function IC(e){switch(e){case"light":return v`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;case"switch":case"input_boolean":return v`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;case"sensor":return v`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;case"binary_sensor":return v`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;case"climate":case"water_heater":return v`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;case"humidifier":return v`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;case"media_player":return v`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;case"camera":return v`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;case"cover":return v`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;case"lock":return v`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;case"fan":return v`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;case"script":case"automation":return v`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;case"scene":return v`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;case"person":case"device_tracker":return v`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;case"vacuum":case"lawn_mower":return v`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;case"weather":return v`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;case"sun":return v`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;case"input_number":case"number":return v`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;case"input_select":case"select":return v`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;case"input_text":case"text":return v`<path d="M5 6H19M12 6V19M9 19H15" />`;case"button":case"input_button":return v`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;case"alarm_control_panel":return v`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;case"update":return v`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;case"todo":return v`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;case"calendar":return v`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;case"timer":case"counter":return v`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;case"zone":return v`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;case"remote":return v`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;case"siren":return v`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;case"valve":return v`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;case"image":case"image_processing":return v`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"event":return v`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;case"group":return v`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;default:return v`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`}}function qr(e){return h`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC(e)}</svg>`}var LC={binary_sensor:"Binary sensor",input_boolean:"Toggle helper",input_number:"Number helper",input_select:"Dropdown helper",input_text:"Text helper",input_button:"Button helper",input_datetime:"Date helper",alarm_control_panel:"Alarm panel",device_tracker:"Device tracker",media_player:"Media player",water_heater:"Water heater",lawn_mower:"Lawn mower",image_processing:"Image processing",persistent_notification:"Notification",remote:"Remote",sun:"Sun",todo:"To-do list"};function Ly(e){let n=LC[e];if(n!==void 0)return n;if(e==="")return"";let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}var HC=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]);function _u(e){return HC.has(e.trim().toLowerCase())}function _C(e,n,t){let i=ys({frame:{...e.frame},isHidden:!1},e.family,n,t).frame;return As(i,{})}var Xu=["content","look","numbers","row","level","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function He(e){return n=>e(n.target.value)}function nn(e,n){let t=n===void 0?ou(e.watchAppVersion):ou(e.watchAppVersion,n);return t===void 0?m:h`<div class="hint keep">${t}</div>`}function oo(e){if(e===void 0||e.atDefault)return m;let n=`Changed. Click to reset. ${e.title.replace(/\.$/,"")}.`;return h`<button type="button" class="reset-dot" title=${n} aria-label=${n}
    @pointerdown=${t=>t.stopPropagation()}
    @click=${t=>{t.preventDefault(),t.stopPropagation(),e.reset()}}></button>`}function De(e,n,t){let i=oo(n),a=[i===m?"":"changed",t?"scrub":""].filter(r=>r!=="").join(" ");return h`<span class=${a===""?m:a} title=${t?"Drag left or right to change":m}
    @pointerdown=${t??m}>${e}${i}</span>`}var Al="wa-scrub-start",Il="wa-scrub-end",NC=3,DC=3;function PC(e,n){return e!==void 0&&Number.isFinite(e)?e:Math.max(0,n.min??0)}function zC(e,n,t={}){let i=n!==void 0&&n>0?n:10**-Math.min(2,Vu(e));return t.coarse?i*10:t.fine?i/10:i}function OC(e,n,t,i){let a=e+Math.round((n-e)/t)*t;return i.min!==void 0&&(a=Math.max(i.min,a)),i.max!==void 0&&(a=Math.min(i.max,a)),Number(a.toFixed(Math.min(10,Math.max(Vu(t),Vu(e)))))}function Vu(e){if(!Number.isFinite(e)||Number.isInteger(e))return 0;let n=String(e),t=/e-(\d+)$/.exec(n);return t?Number(t[1])+(n.split("e")[0].split(".")[1]??"").length:(n.split(".")[1]??"").length}function lb(e,n,t,i,a,r){let o=PC(t,a),s=n.clientX,l=s,c=o,d=o,u=!1,p=g=>{if(!u){if(Math.abs(g.clientX-s)<NC)return;u=!0,l=g.clientX,e.classList.add("scrubbing"),e.dispatchEvent(new CustomEvent(Al,{bubbles:!0,composed:!0}))}let b=zC(o,a.step,{coarse:g.shiftKey,fine:g.altKey});c+=(g.clientX-l)/DC*b,l=g.clientX,a.min!==void 0&&(c=Math.max(a.min,c)),a.max!==void 0&&(c=Math.min(a.max,c));let y=OC(o,c,b,a);y!==d&&(d=y,i(y))},f=g=>{if(e.removeEventListener("pointermove",p),e.removeEventListener("pointerup",f),e.removeEventListener("pointercancel",f),u){e.classList.remove("scrubbing"),e.dispatchEvent(new CustomEvent(Il,{bubbles:!0,composed:!0}));let b=y=>{y.preventDefault(),y.stopPropagation()};e.addEventListener("click",b,{capture:!0,once:!0}),setTimeout(()=>e.removeEventListener("click",b,{capture:!0}),0)}r(u,g)};e.setPointerCapture(n.pointerId),e.addEventListener("pointermove",p),e.addEventListener("pointerup",f),e.addEventListener("pointercancel",f)}function Ll(e,n,t){return i=>{if(i.button!==0||!i.isPrimary)return;let a=i.currentTarget;a.closest(".field")?.querySelector("input[type=number]")?.disabled||(i.preventDefault(),lb(a,i,e,n,t,()=>{}))}}function so(e,n,t){return i=>{let a=i.currentTarget;i.button!==0||!i.isPrimary||a.disabled||a.matches(":focus")||(i.preventDefault(),lb(a,i,e,n,t,(r,o)=>{r||o.type!=="pointerup"||(a.focus(),a.select())}))}}function ti(e,n,t,i=a=>String(a)){if(n===void 0)return;let a=n;return{atDefault:e===a,title:`Back to ${i(a)}`,reset:()=>t(a)}}function Ie(e,n,t,i={}){return h`<label class="field">${De(e,ti(n,i.def,t,a=>a===""?"empty":a))}
    <input type="text" .value=${n} placeholder=${i.placeholder??""} list=${i.list??m}
      class=${i.mono?"mono":""} @input=${He(t)} /></label>`}function Ju(e,n,t,i=3){return h`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${n} class="mono" @input=${He(t)}></textarea></label>`}function ee(e,n,t,i={}){let a=i.def===null?{atDefault:n===void 0,title:"Back to none",reset:()=>t(void 0)}:ti(n,i.def,t);return h`<label class="field num">${De(e,a,Ll(n,t,i))}${lo(n,t,i)}</label>`}function lo(e,n,t){let i=e===void 0||Number.isNaN(e)?"":String(e),a=h`<input type="number" .value=${i} step=${t.step??"any"} min=${t.min??m} max=${t.max??m}
      aria-label=${t.ariaLabel??m} placeholder=${t.placeholder??m}
      data-scrub @pointerdown=${so(e,n,t)}
      @input=${He(r=>{if(r.trim()===""){t.optional&&n(void 0);return}let o=Number(r);Number.isNaN(o)||n(o)})} />`;return t.unit===void 0&&t.lead===void 0?a:h`<span class=${t.lead===void 0?"num-box":"num-box lead"} style=${`--wa-unit:${t.unit?.length??0}`}>${t.lead===void 0?m:h`<span class="lead" aria-hidden="true">${t.lead}</span>`}${a}${t.unit===void 0?m:h`<span class="unit" aria-hidden="true">${t.unit}</span>`}</span>`}function $e(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<label class="field">${De(e,ti(n,a.def,i,r))}
    <select @change=${He(o=>i(o))}>
      ${t.map(([o,s])=>h`<option value=${o} ?selected=${o===n}>${s}</option>`)}
    </select></label>`}function ne(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<div class="field seg-field">${De(e,ti(n,a.def,o=>i(o,null),r))}
    ${Ui(e,n,t,i,a)}</div>`}function Ui(e,n,t,i,a={}){return h`<div class="seg wide" role="radiogroup" aria-label=${e}>
      ${t.map(([r,o])=>{let s=n===void 0&&r===a.inherited,l=s?`${a.titles?.[r]??o} (from the layer)`:a.titles?.[r];return h`<button type="button" role="radio" aria-checked=${r===n?"true":"false"}
        class=${r===n?"on":s?"inh":""} title=${l??m} ?disabled=${a.disabled?.[r]===!0}
        @click=${c=>{r!==n&&i(r,c.currentTarget)}}>${o}</button>`})}
    </div>`}function Uu(e,n){let t=i=>ti(i.value,i.def,i.set,a=>i.options.find(([r])=>r===a)?.[1]??a);return h`<div class="field seg-field pair">${De(e.label,t(e))}
    <div class="pair-row">
      ${Ui(e.label,e.value,e.options,e.set,e)}
      ${De(n.label,t(n))}
      ${Ui(n.label,n.value,n.options,n.set,n)}
    </div></div>`}function an(e,n,t,i){let a=i.format??(o=>String(Math.round(o*100)/100)),r=o=>{o!==void 0&&o>=i.min&&o<=i.max&&t(o)};return h`<div class="field slider num">${De(e,ti(n,i.def,t,a),Ll(n,t,i))}
    <div class="slider-row">
      ${i.range===!1?m:h`<input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(n)} aria-label=${e}
        @input=${He(o=>{let s=Number(o);Number.isNaN(s)||t(s)})} />`}
      ${lo(n,r,{step:i.step,min:i.min,max:i.max,ariaLabel:e,...i.unit===void 0?{}:{unit:i.unit}})}
    </div></div>`}function Fe(e,n,t,i,a={}){return h`<label class="field check">${De(e,ti(n,i,t,r=>r?"on":"off"))}<input type="checkbox" .checked=${n} ?disabled=${a.disabled===!0} @change=${r=>t(r.target.checked)} /></label>`}function ye(e,n,t,i=!1,a){let{rgb:r,alpha:o}=db(n),s=a===void 0?void 0:{atDefault:Qu(n,a??void 0),title:a===null?"Back to none":`Back to ${a}`,reset:()=>t(a??void 0)},l=i&&n===void 0;return h`<div class="field color">${De(e,s)}
    <div class="color-row">
      ${i?h`<input type="checkbox" title="Enabled" aria-label=${`${e} on`} .checked=${n!==void 0} @change=${c=>t(c.target.checked?Sl(r,o):void 0)} />`:m}
      ${co(e,n,t,l)}
    </div></div>`}function GC(e){let n=[...e.stops].sort((t,i)=>t.at-i.at).map(t=>`${t.colorHex} ${Math.round(Math.max(0,Math.min(1,t.at))*100)}%`).join(", ");return e.kind==="radial"?`radial-gradient(circle at 50% 50%, ${n})`:`linear-gradient(90deg, ${n})`}function Qr(e){return{...e,stops:[...e.stops].sort((n,t)=>n.at-t.at)}}function Cl(e,n,t,i){let a=n!==void 0,r=n,o=h`<div class="field color">${De(e,{atDefault:!a,title:"Back to one flat colour",reset:()=>t(void 0)})}
    <div class="color-row">
      <input type="checkbox" title="Enabled" aria-label=${`${e} on`} .checked=${a}
        @change=${c=>t(c.target.checked?Qr(i()):void 0)} />
      ${r===void 0?h`<span class="hint">One flat colour</span>`:h`<span class="fill-bar" style=${`--g:${GC(r)}`} title="Drag a chip to move that colour">
            ${r.stops.map((c,d)=>h`<span class="fill-chip" style=${`left:${Math.round(Math.max(0,Math.min(1,c.at))*100)}%;--sw:${c.colorHex}`}
              @pointerdown=${BC(r,d,t)}></span>`)}
          </span>`}
    </div></div>`;if(r===void 0)return o;let s=r.stops,l=c=>t(Qr({...r,stops:c}));return h`${o}
    <div class="grid2">
      ${ne("Gradient",r.kind,Sh,c=>{let d={...r,kind:c};c==="radial"&&delete d.angle,t(Qr(d))},{def:"linear"})}
      ${r.kind==="linear"?ee("Angle",r.angle??0,c=>{let d={...r},u=c??0;u===0?delete d.angle:d.angle=u,t(Qr(d))},{step:5,def:0,unit:"\xB0"}):m}
    </div>
    ${s.map((c,d)=>h`<div class="field color band-row">
      <span class="fill-stop-n">${d+1}</span>
      <div class="color-row">
        ${co(`Stop ${d+1}`,c.colorHex,u=>l(s.map((p,f)=>f===d?{...p,colorHex:u??"#FFFFFF"}:p)))}
        ${lo(Math.round(c.at*100),u=>l(s.map((p,f)=>f===d?{...p,at:Math.max(0,Math.min(1,(u??0)/100))}:p)),{step:1,min:0,max:100,unit:"%",ariaLabel:`Stop ${d+1} position`})}
        <button class="small" title="Remove this colour" ?disabled=${s.length<=xd}
          @click=${()=>l(s.filter((u,p)=>p!==d))}>−</button>
      </div></div>`)}
    ${s.length<Go?h`<button class="small" @click=${()=>{let c=[...s].sort((p,f)=>p.at-f.at),d=.5,u=-1;for(let p=1;p<c.length;p++){let f=c[p].at-c[p-1].at;f>u&&(u=f,d=(c[p].at+c[p-1].at)/2)}l([...s,{at:d,colorHex:Ut(r,d)}])}}>Add a colour</button>`:h`<div class="hint">A gradient takes at most ${Go} colours.</div>`}`}function BC(e,n,t){return i=>{let a=i.currentTarget,r=a.parentElement;if(!r)return;i.preventDefault(),a.setPointerCapture(i.pointerId);let o=e,s=c=>{let d=r.getBoundingClientRect();if(d.width<=0)return;let u=Math.max(0,Math.min(1,(c.clientX-d.left)/d.width));o={...e,stops:e.stops.map((p,f)=>f===n?{...p,at:u}:p)},t(o)},l=()=>{a.removeEventListener("pointermove",s),a.removeEventListener("pointerup",l),a.removeEventListener("pointercancel",l),t(Qr(o))};a.addEventListener("pointermove",s),a.addEventListener("pointerup",l),a.addEventListener("pointercancel",l)}}function db(e){let n=(e??"").replace(/^#/,""),t=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n);return{valid:t,swatch:t?`#${n}`:"transparent",rgb:t?`#${n.slice(0,6)}`:"#ffffff",alpha:t&&n.length===8?Math.round(parseInt(n.slice(6,8),16)/255*100):100}}function Sl(e,n){let t=e.replace(/^#/,"").toUpperCase();return n>=100?`#${t}`:`#${t}${Math.round(n/100*255).toString(16).padStart(2,"0").toUpperCase()}`}function co(e,n,t,i=!1,a="#RRGGBB"){let{valid:r,swatch:o,rgb:s,alpha:l}=db(n);return h`<span class="color-box">
      <span class="color-swatch" style=${`--sw:${i||!r?"transparent":o}`} title="Pick a colour">
        <input type="color" .value=${s} ?disabled=${i} aria-label=${`${e}: pick a colour`} @input=${He(c=>t(Sl(c,l)))} />
      </span>
      <input type="text" class="mono hex" .value=${n??""} placeholder=${a} spellcheck="false" aria-label=${`${e}: hex`} ?disabled=${i}
        @input=${He(c=>{let d=c.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(d)&&t(d.startsWith("#")?d.toUpperCase():`#${d.toUpperCase()}`)})} />
      <span class="num-box alpha" style="--wa-unit:1">
        <input type="number" min="0" max="100" step="1" .value=${String(l)} title="Opacity" aria-label=${`${e}: opacity`} ?disabled=${i}
          data-scrub @pointerdown=${so(l,c=>t(Sl(s,c)),{step:1,min:0,max:100})}
          @input=${He(c=>{let d=Number(c);c.trim()!==""&&d>=0&&d<=100&&t(Sl(s,Math.round(d)))})} />
        <span class="unit" aria-hidden="true">%</span>
      </span>
    </span>`}function Zu(e,n,t,i){let a={atDefault:n===void 0,title:`Back to ${t.toLowerCase()}`,reset:()=>i(void 0)};return h`<div class="field color">${De(e,a)}
    <div class="color-row">${co(e,n,i,!1,t)}</div></div>`}function Nu(e,n,t){return h`${Zu(e.label,n,e.empty,t)}${e.note===void 0?m:h`<div class=${e.warn?"hint warn":"hint"}>${e.note}</div>`}`}function Qu(e,n){return e===void 0||n===void 0?e===n:e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function Ha(e,n){let t=e[n],i=t&&typeof t.attributes.friendly_name=="string"?t.attributes.friendly_name:n;return{entityId:n,displayName:i,domain:n.split(".")[0]??""}}function VC(e,n,t){let i=n===void 0?void 0:typeof n=="string"?[n]:n,a=[];for(let[r,o]of Object.entries(e)){let s=r.split(".")[0]??"";if(i!==void 0&&!i.includes(s))continue;let l=typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name.trim():"",c=t?.(r);a.push({entityId:r,name:l||r,state:o?.state??"",domain:s,...c?{area:c}:{}})}return a.sort((r,o)=>r.name.localeCompare(o.name)||r.entityId.localeCompare(o.entityId)),a}function UC(e){let{entities:n,devices:t,areas:i}=e;if(!n||!i)return;let a=r=>{if(!r)return;let o=i[r]?.name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0};return r=>{let o=n[r];if(o)return a(o.area_id)??a(o.device_id?t?.[o.device_id]?.area_id:void 0)}}var cb=50;function WC(e){let n=e.state.trim().split(/\s+/)[0]??"";return n!==""&&Number.isFinite(Number(n))}function KC(e,n,t=cb,i){let a=n.trim().toLowerCase(),r=l=>i===void 0||i(l)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((l,c)=>r(l)-r(c))).slice(0,t);let o=a.split(/\s+/),s=[];for(let l of e){let c=l.entityId.toLowerCase(),d=l.name.toLowerCase(),u=(l.area??"").toLowerCase(),p=-1;c===a?p=0:c.startsWith(a)?p=1:d.startsWith(a)?p=2:c.includes(a)?p=3:d.includes(a)?p=4:o.length>1&&o.every(f=>c.includes(f)||d.includes(f))?p=5:u!==""&&(u.includes(a)||o.length>1&&o.every(f=>c.includes(f)||d.includes(f)||u.includes(f)))&&(p=6),p>=0&&s.push({c:l,rank:p})}return s.sort((l,c)=>l.rank-c.rank||r(l.c)-r(c.c)||l.c.name.localeCompare(c.c.name)||l.c.entityId.localeCompare(c.c.entityId)),s.slice(0,t).map(l=>l.c)}var jC=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function ub(e){return jC.test(e.trim())}function qC(e,n,t){let i=e.trim();if(!(i===n.entityId||i==="")){if(i in t)return Ha(t,i);if(ub(i))return{...n,entityId:i,domain:i.split(".")[0]??""}}}var Vi=new Map;function Te(e){let n=e instanceof Node?e:null;for(let t=0;n&&t<8;t+=1){let i=n.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}n=a}}function ep(e){return Vi.has(e)}function rt(e,n,t,i,a,r={}){let o=e.hass.states,s=Vi.get(a),l=s?KC(VC(o,r.domain,UC(e.hass)),s.query,cb,r.preferNumeric?WC:void 0):[],c=s?Math.max(0,Math.min(s.index,l.length-1)):0,d=t.entityId?o[t.entityId]:void 0,u=($,A,W=0)=>{Vi.set(a,{query:A,index:W}),Te($)},p=$=>{Vi.delete(a),Te($)},f=$=>{let A=qC($,t,o);A&&i(A)},g=($,A)=>{i(Ha(o,$.entityId)),p(A)},b=()=>Math.max(0,Math.min(Vi.get(a)?.index??0,l.length-1)),y=$=>{let A=$.target;if($.key==="ArrowDown"||$.key==="ArrowUp"){$.preventDefault();let W=Vi.get(a);if(!W){u(A,A.value);return}let Q=$.key==="ArrowDown"?b()+1:b()-1;u(A,W.query,Math.max(0,Math.min(l.length-1,Q))),YC(A);return}if($.key==="Enter"){$.preventDefault();let W=l[b()];s&&W?g(W,A):(f(A.value),p(A));return}if($.key==="Escape"){if(!s)return;$.preventDefault(),$.stopPropagation(),p(A)}},w=t.entityId===""?h`<div class="hint">Type part of a name, a room, or an id.</div>`:d?m:h`<div class="hint warn">Not in Home Assistant right now.</div>`,k=$=>requestAnimationFrame(()=>$?.querySelector(".ent-box input")?.focus()),S=$=>{let A=$.currentTarget.closest(".entity-field");u(A,""),k(A)},R=r.clearable??!0,O=d&&typeof d.attributes.friendly_name=="string"?d.attributes.friendly_name:t.displayName||t.entityId,F=h`<div class="ent-chosen">
      <button type="button" class="ent-pick" title=${`${O}
${t.entityId}
Click to change`} @click=${S}>
        <span class="ent-ico ${d&&_u(d.state)?"on":""}">${qr(t.domain||t.entityId.split(".")[0]||"")}</span>
        <span class="ent-name">${O}</span>
        ${O===t.entityId?m:h`<span class="ent-id mono">${t.entityId}</span>`}
        ${d?h`<span class="ent-state">${d.state}</span>`:m}
      </button>
      ${R?h`<button type="button" class="ent-clear" title="Remove entity" aria-label="Remove entity"
        @click=${$=>{let A=$.currentTarget.closest(".entity-field");i({entityId:"",displayName:"",domain:""}),Te(A)}}>${D("close")}</button>`:m}
    </div>`,z=h`<div class="ent-box ${s?"open":""} ${r.needed&&t.entityId===""?"needs":""}">
      <span class="ent-glass">${D("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${s?"true":"false"} autocomplete="off" spellcheck="false"
        .value=${s?s.query:""}
        placeholder=${t.entityId||"Search by name, room, or id"}
        @focus=${$=>{let A=$.target;u(A,Vi.get(a)?.query??"")}}
        @input=${$=>{let A=$.target;u(A,A.value)}}
        @keydown=${y}
        @blur=${$=>{let A=$.target;s&&f(A.value),p(A)}} />
    </div>`;return h`<div class="field entity-field">
    <span>${n}</span>
    <div class="ent-anchor">
    ${!s&&t.entityId!==""?F:z}
    ${s?h`<div class="entity-results" role="listbox">
          ${l.length===0?h`<div class="hint keep" style="padding:6px 8px">${ub(s.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:l.map(($,A)=>h`<button type="button" role="option" aria-selected=${A===c?"true":"false"} class="ent ${A===c?"hl":""}"
                @mousedown=${W=>W.preventDefault()} @click=${W=>g($,W.target)}>
                <span class="ent-ico ${_u($.state)?"on":""}">${qr($.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${$.name}</span>
                  <span class="ent-sub">
                    ${$.area?h`<span class="ent-area">${$.area}</span>`:m}
                    <span class="ent-id mono">${$.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${Ly($.domain)}</span>
                  <span class="ent-state">${$.state}</span>
                </span>
              </button>`)}
        </div>`:m}
    </div>
    ${s?m:w}
  </div>`}function YC(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var Hy=120;function XC(e,n,t,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(el.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:n.trim()!==""&&t.length>0?{names:[...t],fromPack:!0}:{names:a(tl),fromPack:!1}}function _y(e,n){return n.size===0?e.length:e.filter(t=>n.has(t)).length}function JC(e){return[{value:"",label:`Starter set (${_y(tl,e)})`},...el.map(n=>({value:n.name,label:`${n.name} (${_y(n.symbols,e)})`}))]}function ZC(e){return e.length>0?e.length:tl.length}function Ny(e,n,t,i){return t?n>e?`Showing ${e} of ${n}. Type more to narrow it down.`:n===1?"1 symbol matches.":`${n} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function hl(e,n,t,i){let a=e.icons.render(n,22,"#FFFFFF");return h`<button type="button" class="sym ${t?"on":""}" title=${n} @click=${()=>i(n)}>
    <span class="sym-glyph">${a??h`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${n}</span>
  </button>`}function pb(e,n,t,i,a){let r=e.symbols,o=r.isOpen(i),s=r.query(i),l=e.icons.names(),c=l??[],d=new Set(c),u=n.trim(),p=u.startsWith(nt),f=a!==void 0,g=f?r.pack(i)??(p?"mdi":"sf"):"sf",b=t1(u,d),y=S=>{t(S),a?.(S.startsWith(nt)?e.icons.mdiPath?.(S):void 0),r.noteUsed(S)},w=S=>{if(t(S),!f)return;let R=S.trim();a?.(R.startsWith(nt)?e.icons.mdiPath?.(R):void 0)},k=m;if(o&&g==="mdi"){let S=e.icons.mdiNames?.(),R=n1(S??[],s),O=R.slice(0,Hy),F=r.recent.filter(z=>z.startsWith(nt));k=h`<div class="sym-browse">
      ${Dy(r,i,g)}
      <div class="sym-controls">
        <input type="search" placeholder="Search Material Design icons" .value=${s} @input=${He(z=>r.setQuery(i,z))} />
      </div>
      ${F.length===0?m:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${F.map(z=>hl(e,z,z===u,y))}</div>`}
      <div class="sym-grid">${O.map(z=>hl(e,z,z===u,y))}</div>
      ${S===void 0?h`<div class="hint keep">Loading the Material Design catalogue.</div>`:R.length===0?h`<div class="hint keep">Nothing matches that search. Any<code>mdi:</code> name can still be typed above.</div>`:h`<div class="hint keep">${Ny(O.length,R.length,!0,S.length)}</div>`}
      ${S!==void 0&&p&&!S.includes(u)?h`<div class="hint warn">There is no <code>${u}</code> in this build's Material Design set, so the watch draws a question mark.</div>`:m}
    </div>`}else if(o){let S=r.category(i),R=XC(S,s,c,d),O=uu(R.names,s),F=R.fromPack?O.slice(0,Hy):O,z=r.recent.filter(A=>!A.startsWith(nt)),$=d.size===0?z:z.filter(A=>d.has(A));k=h`<div class="sym-browse">
      ${f?Dy(r,i,g):m}
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${s} @input=${He(A=>r.setQuery(i,A))} />
        <select @change=${He(A=>r.setCategory(i,A))}>
          ${JC(d).map(A=>h`<option value=${A.value} ?selected=${A.value===S}>${A.label}</option>`)}
        </select>
      </div>
      ${$.length===0?m:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${$.map(A=>hl(e,A,A===u,y))}</div>`}
      <div class="sym-grid">${F.map(A=>hl(e,A,A===u,y))}</div>
      ${O.length===0?h`<div class="hint keep">Nothing matches that search. Anyname can still be typed above.</div>`:h`<div class="hint keep">
            ${Ny(F.length,O.length,s.trim()!=="",ZC(c))}
          </div>`}
      ${e.icons.available()?l!==void 0&&l.length===0?h`<div class="hint keep">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:m:h`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return h`
    <label class="field"><span>Symbol</span>
      <input type="text" class="mono" .value=${n} placeholder="lightbulb.fill"
        @input=${He(w)} @change=${He(S=>{let R=S.trim();R.startsWith(nt)?e.icons.mdiPath?.(R)!==void 0&&r.noteUsed(S):(d.size===0||d.has(R))&&r.noteUsed(S)})} /></label>
    ${b?h`<div class="hint warn">The installed icon pack has no <code>${u}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:m}
    <button type="button" class="link" @click=${()=>r.toggle(i)}>${o?"Hide symbols":"Browse symbols"}</button>
    ${k}`}var fl=new Map;function QC(e,n){if(n==="svg"){e.symbol=K(hr);return}e.symbol=K("lightbulb"),delete e.path,delete e.viewBox}function hb(e,n){let t=fl.get(e.id),i=new TextEncoder().encode(e.path??"").length,a=(r,o)=>{if(r.trim()===""){fl.delete(e.id),n(c=>{delete c.path,delete c.viewBox},"svg-path");return}let s=Ah(r);if(!s.ok){fl.set(e.id,{text:s.error,warn:!0}),Te(o);return}let l=s.viewBox;fl.set(e.id,{text:l===void 0?"Path taken. It draws in the standard 24 by 24 box.":`Path taken, in the box ${l} the markup names.`,warn:!1}),n(c=>{c.path=s.path,l===void 0?delete c.viewBox:c.viewBox=l},"svg-path")};return h`
    <label class="field"><span>SVG</span>
      <textarea rows="4" class="mono" .value=${e.path??""}
        placeholder="M7 2v11h3v9l7-12h-4l4-8z  or a whole <svg …> tag"
        @input=${r=>a(r.target.value,r.target)}></textarea></label>
    ${t?h`<div class="hint ${t.warn?"warn":"keep"}">${t.text}</div>`:m}
    ${e.path===void 0||e.path===""?h`<div class="hint keep">Paste an SVG path's <code>d</code>, or the whole <code>&lt;svg&gt;</code> markup and the paths in it are taken. The drawing takes the layer's colour, so a flat single-colour shape is what reads on a watch face.</div>`:h`<div class="field readout"><span>Size</span><span class="readout-v">${i} bytes${e.viewBox===void 0?"":` \xB7 ${e.viewBox}`}</span></div>`}
    <div class="hint">Only <code>&lt;path&gt;</code> elements are drawn: a circle, a rectangle or a group transform in the markup is ignored. Convert those to paths in a vector editor first.</div>`}var ml=new Map;function fb(e,n){if(e.source=n,n==="inline"){e.entity={entityId:"",displayName:"",domain:""};return}delete e.data,delete e.format}function e1(e,n,t,i){let a=ml.get(n.id),r=Si(n),o=async s=>{let l=s.target,c=l.files?.[0];if(l.value="",!c)return;let d=ue[t==="inline"?"rectangular":t],u=_e(e.config,t,{kind:"image",payload:n}),p=await Ey(c,{width:u.frame.width*d.width,height:u.frame.height*d.height});if("error"in p){ml.set(n.id,{text:p.error,warn:!0}),Te(l);return}ml.set(n.id,{text:`${c.name} is in the complication at ${p.width} by ${p.height} pixels, ${dl(p.bytes)}.`,warn:!1}),i(f=>{f.data=p.data,p.format==="jpeg"?f.format="jpeg":delete f.format},"inline-image")};return h`
    <div class="field list-field"><span>Picture</span>
      <div class="adders">
        <label class="small" title="Choose a picture from this device">
          ${D("plus")}<span>${r>0?"Replace":"Upload"}</span>
          <input type="file" accept=${Ty} style="display:none" @change=${o} />
        </label>
        ${r>0?h`<button type="button" class="small" title="Take the picture out of this complication"
              @click=${()=>{ml.delete(n.id),i(s=>{delete s.data,delete s.format},"inline-image")}}>Remove</button>`:m}
        ${r>0?h`<span class="readout-v">${dl(r)}</span>`:m}
      </div>
    </div>
    ${a?h`<div class="hint ${a.warn?"warn":"keep"}">${a.text}</div>`:m}
    ${r===0?h`<div class="hint warn">This layer has no picture yet, so it draws a placeholder.</div>`:m}
    <div class="hint">The picture travels inside the complication, so nothing is fetched and it works with no entity at all. It is resized to the layer's own size on the way in, and each one may be at most ${wr/1024} KB.</div>`}function t1(e,n){let t=e.trim();return t!==""&&!t.startsWith(nt)&&n.size>0&&!n.has(t)}function n1(e,n){let t=n.trim(),i=t.startsWith(nt)?t.slice(nt.length):t,a=e.map(r=>r.startsWith(nt)?r.slice(nt.length):r);return uu(a,i).map(r=>nt+r)}function Dy(e,n,t){return h`<div class="seg wide" role="radiogroup" aria-label="Icon set">
    ${[["sf","SF Symbols"],["mdi","Material Design Icons"]].map(([a,r])=>h`<button type="button" role="radio" aria-checked=${a===t?"true":"false"}
      class=${a===t?"on":""}
      @click=${()=>{a!==t&&e.setPack(n,a)}}>${r}</button>`)}
  </div>`}var i1=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Time since entity changed"],["aggregate","Several entities combined"],["chartStat","Number from a chart"],["time","Clock and date"],["dataAge","Time since last refresh"],["jinja","Template (Jinja)"],["named","Shared value"]],a1={literal:"Words or a number you type. It never changes.",entityState:"What Home Assistant shows for the entity, like 21.5 or on.",entityAttribute:"One detail the entity carries besides its state, like a light's brightness.",entityAge:"Seconds since the entity's state last changed. Set Seconds as, under Format, to read 5m instead of 300.",aggregate:"Count several entities, or take the sum, average, lowest or highest of their states.",time:"The time or date, read each time the complication refreshes.",dataAge:"Seconds since the watch last fetched values."},r1=[["straight","Straight"],["smooth","Smooth"],["step","Step"]],o1=[["flat","Flat"],["fade","Fade"]],mb=[["auto","Auto"],["all","All"]],s1=[["off","Off"],["light","Light"],["medium","Medium"],["strong","Strong"]],gb=[["bars","Bars"],["line","Line"],["area","Area"]],l1=[["auto","Auto"],["fixed","Fixed range"]],d1=[["lowest","Lowest value"],["zero","Zero"]],c1=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],Wu=[["uniform","One colour"],["bands","By value"]];function El(e){let n=[Fd,"#FFD60A"];if(e.length<2)return n.map((o,s)=>({id:re(),upTo:(s+1)*33,colorHex:o}));let t=Math.min(...e),a=Math.max(...e)-t,r=o=>Number(o.toFixed(a>=10?0:2));return n.map((o,s)=>({id:re(),upTo:r(t+a*(s+1)/3),colorHex:o}))}function tp(e){if(e.length===0)return 0;let n=Math.min(...e),t=Math.max(...e),i=t-n;return Number(((n+t)/2).toFixed(i>=10?0:2))}function u1(e,n){let t=Dn({bands:e}),i=t.at(-1),a=e.length>1?Math.abs(t[1].upTo-t[0].upTo):10;return{id:re(),upTo:(i?.upTo??0)+(a||10),colorHex:n}}function Py(e,n,t,i){return h`<span class="band-cell">${co(e,n,t)}${oo(i)}</span>`}function p1(e,n){let t=(typeof n=="number"?[n]:n??[]).filter(s=>Number.isFinite(s)),i=[...e,...t];if(i.length===0)return{lo:-1,hi:1};let a=Math.min(...i),r=Math.max(...i),o=r>a?(r-a)*.12:Math.abs(a)/2||1;return{lo:a-o,hi:r+o}}var h1=.1;function f1(e,n,t,i=h1){let a=[...e].sort((k,S)=>k-S),r=k=>Math.max(n,Math.min(t,k)),o=[n,...a.map(r),t],s=t-n||1,l=o.slice(1).map((k,S)=>Math.max(0,k-o[S])/s),c=Math.min(i,1/l.length),d=l.map(k=>k<c),u=d.filter(Boolean).length,p=l.reduce((k,S,R)=>k+(d[R]?0:S),0),f=1-u*c,g=l.length-u,b=l.map((k,S)=>d[S]?c:p>0?k/p*f:f/g),y=b.map((k,S)=>b.slice(0,S).reduce((R,O)=>R+O,0));return{shares:b,at:k=>{let S=r(k),R=o.length-2;for(let z=0;z<o.length-1;z++)if(S<=o[z+1]){R=z;break}let O=o[R+1]-o[R],F=O>0?(S-o[R])/O:0;return Math.max(0,Math.min(100,(y[R]+F*b[R])*100))}}}function gl(e){return Math.abs(e)>=1e3||Number.isInteger(e)?String(Math.round(e*100)/100):String(Number(e.toPrecision(4)))}function m1(e,n){let t=e.flatMap(f=>f.upTo===void 0?[]:[f.upTo]),{lo:i,hi:a}=p1(t,n),{shares:r,at:o}=f1(t,i,a),s=typeof n=="number"&&Number.isFinite(n)?n:void 0,l=typeof n=="object"?n.filter(f=>Number.isFinite(f)):[],c=l.length>0?Math.min(...l):void 0,d=l.length>0?Math.max(...l):void 0,u=-1/0,p=[...t].sort((f,g)=>f-g).flatMap(f=>{let g=o(f);return g-u<12?[]:(u=g,[h`<span style=${`left:${g}%`}>${gl(f)}</span>`])});return h`<div class="band-bar">
    <div class="bb" aria-hidden="true">${e.map((f,g)=>h`<i class=${f.border===void 0?"":"bordered"}
      style=${`flex-grow:${r[g]??0};--f:${f.fill}${f.border===void 0?"":`;--b:${f.border}`}`}></i>`)}</div>
    ${c===void 0||d===void 0?m:h`<span class="span" style=${`left:${o(c)}%;width:${o(d)-o(c)}%`}
      title=${c===d?`Reads ${gl(c)}`:`Reads ${gl(c)} to ${gl(d)}`}></span>`}
    ${s===void 0?m:h`<span class="now" style=${`left:${o(s)}%`} title=${`Now ${s}`}></span>`}
    ${p.length===0?m:h`<div class="ticks" aria-hidden="true">${p}</div>`}
  </div>`}function Rl(e,n,t,i,a){let r=Dn({bands:e.bands}),o=typeof i=="number"&&Number.isFinite(i)?i:void 0,s=o===void 0?void 0:r.find(y=>o<=y.upTo)?.id??"above",l=(y,w)=>k=>{let S=k.bands.find(R=>R.id===y);S&&w(S)},c=e.bandAboveColorHex,d={atDefault:Qu(c,xe),title:`Back to ${xe}`,reset:()=>t(y=>{y.bandAboveColorHex=xe})},u=a?.border===!0,p=(y,w,k,S,R)=>{if(!u)return co(y,w.colorHex,A=>k(A??"#FFFFFF"));let O=a?.fillHex,F=a?.borderHex,z=w.fillColorHex===void 0?void 0:{atDefault:!1,title:"Back to the chart fill colour",reset:()=>S(void 0)},$=w.borderColorHex===void 0?void 0:{atDefault:!1,title:`Back to ${F===void 0?"white":"the chart border colour"}`,reset:()=>R(void 0)};return h`
      ${Py(`${y} fill`,w.fillColorHex??O??w.colorHex,A=>{A!==void 0&&(k(A),S(O===void 0?void 0:A))},z)}
      ${Py(`${y} border`,w.borderColorHex??F??Za,A=>R(A),$)}`},f=(y,w)=>{let k=r[y];return h`<input type="number" class="band-up" step="any" .value=${String(k.upTo)} aria-label=${w}
      title=${`Band ${y+1} runs up to and including this number`}
      data-scrub @pointerdown=${so(k.upTo,S=>t(l(k.id,R=>{R.upTo=S})),{...y>0?{min:r[y-1].upTo}:{},...y<r.length-1?{max:r[y+1].upTo}:{}})}
      @change=${He(S=>{let R=Number(S);S.trim()!==""&&Number.isFinite(R)&&t(l(k.id,O=>{O.upTo=R}))})} />`},g=(y,w)=>({...y===void 0?{}:{upTo:y},fill:u?w.fillColorHex??a?.fillHex??w.colorHex:w.colorHex,...u?{border:w.borderColorHex??a?.borderHex??Za}:{}}),b=[...r.map(y=>g(y.upTo,y)),g(void 0,{colorHex:c,...e.bandAboveFillColorHex===void 0?{}:{fillColorHex:e.bandAboveFillColorHex},...e.bandAboveBorderColorHex===void 0?{}:{borderColorHex:e.bandAboveBorderColorHex}})];return h`<div class=${u?"bands split":"bands"}>
    ${m1(b,o??(typeof i=="object"?i:void 0))}
    ${!u||r.length===0?m:h`<div class="band-row band-head" aria-hidden="true">
      <span></span><span>Fill</span><span>Border</span><span></span>
    </div>`}
    ${r.map((y,w)=>h`
      <div class="band-row ${s===y.id?"hit":""}">
        <span class="range">${w===0?h`<span class="le">Less than</span>${f(w,"Less than")}`:h`${f(w-1,"From")}<span class="to">to</span>${f(w,"Up to")}`}</span>
        ${p(`Up to ${y.upTo}`,y,k=>t(l(y.id,S=>{S.colorHex=k}),`bcol${y.id}`),k=>t(l(y.id,S=>{k===void 0?delete S.fillColorHex:S.fillColorHex=k}),`bfill${y.id}`),k=>t(l(y.id,S=>{k===void 0?delete S.borderColorHex:S.borderColorHex=k}),`bborder${y.id}`))}
        <button type="button" class="icon" title="Remove this band" aria-label="Remove this band"
          @click=${()=>t(k=>{k.bands=k.bands.filter(S=>S.id!==y.id)})}>${D("close")}</button>
      </div>`)}
    <div class="band-row ${s==="above"?"hit":""}">${oo(d)}
      <span class="range">${r.length===0?h`<span class="else">Every value</span>`:h`<span class="le">Greater than</span>${f(r.length-1,"Greater than")}`}</span>
      ${p("Above the last band",{colorHex:c,...e.bandAboveFillColorHex===void 0?{}:{fillColorHex:e.bandAboveFillColorHex},...e.bandAboveBorderColorHex===void 0?{}:{borderColorHex:e.bandAboveBorderColorHex}},y=>t(w=>{w.bandAboveColorHex=y},"babove"),y=>t(w=>{y===void 0?delete w.bandAboveFillColorHex:w.bandAboveFillColorHex=y},"bafill"),y=>t(w=>{y===void 0?delete w.bandAboveBorderColorHex:w.bandAboveBorderColorHex=y},"baborder"))}
      <span></span>
    </div>
    <button type="button" class="link add-band" @click=${()=>t(y=>{y.bands=[...y.bands,u1(y.bands,n)]})}>+ Band</button>
  </div>`}function g1(e,n,t,i){let a=new Map,r=new Map,o=(c,d)=>{let u=c.trim();if(u==="")return;let p=u.toLowerCase();r.has(p)||r.set(p,u),a.set(p,(a.get(p)??0)+d)};e.forEach((c,d)=>{let u=e[d+1],p=u===void 0?n:u.offsetSeconds;o(c.state,Math.max(0,p-c.offsetSeconds))}),t!==void 0&&o(t,0),(ca[i??""]??[]).forEach(c=>o(c,0));let s=["unavailable","unknown"];return[...[...a.entries()].filter(([c])=>!s.includes(c)).sort((c,d)=>d[1]-c[1]).map(([c])=>r.get(c)??c),...s]}function y1(e,n,t){return Fe("Combine several entities",e.aggregate!==void 0,i=>n(a=>{if(!i){delete a.aggregate;return}let r=a.value.kind.kind==="entityState"?a.value.kind.entityId:"",o=r===""?[]:[r];a.aggregate={entities:o,combine:yn},a.bands.some(s=>s.match.trim().toLowerCase()==="on")||(a.bands=na(rs))},`tagg${t}`))}function b1(e,n,t,i){let a=da(n),r=Ci(n),o=n.aggregate?.combine??yn,s=a.length>=la,l=(c,d)=>{c.aggregate={entities:d,combine:c.aggregate?.combine??yn};let u=d.find(p=>p.trim()!=="")??"";u!==""&&(c.value={...c.value,kind:{kind:"entityState",...Ha(e.hass.states,u)}})};return h`
    ${a.map((c,d)=>h`
      <div class="row-inline">
        ${rt(e,`Entity ${d+1}`,Ha(e.hass.states,c),u=>t(p=>{let f=da(p);f[d]=u.entityId,l(p,f)},`tagge${i}-${d}`),`${i}-agg-${d}`,{needed:c==="",clearable:a.length<=sa})}
        ${a.length>sa?h`<button class="icon" title="Remove this entity" aria-label="Remove this entity"
              @click=${()=>t(u=>{l(u,da(u).filter((p,f)=>f!==d))})}>${D("close")}</button>`:m}
      </div>`)}
    <button class="small" ?disabled=${s}
      title=${s?`A timeline merges at most ${la} entities`:"Add another entity to this strip"}
      @click=${()=>t(c=>{l(c,[...da(c),""])})}>Add entity</button>
    ${ne("Combine",o,Ph,c=>t(d=>{d.aggregate={entities:da(d),combine:c}}),{titles:{any:"On while at least one of them is active",all:"On only while every one of them is active"},def:yn})}
    <div class="hint">${zh(o)}. Home Assistant reads a door as open, a
      person as home, a lock as unlocked and a washer as running, so one switch answers all of
      them.</div>
    ${r.length<sa?h`<div class="hint warn">Name at least ${sa} entities, or turn
        the switch off and draw the one entity's own states.</div>`:m}
    ${Gd(n)?h`<div class="hint warn">A timeline merges at most ${la}
        entities, and this one names ${r.length}. Remove ${r.length-la}
        of them: until then the strip asks the recorder nothing and draws nothing.</div>`:m}
    <div class="hint">One strip for all of them: Home Assistant merges their recorded pasts into a
      single run of on and off. The colour table below reads those two words, whatever domain the
      entities are from.</div>`}function x1(e,n,t=[],i="wa-timeline-states"){let a=new Set(e.bands.map(o=>o.match.trim().toLowerCase())),r=t.find(o=>!a.has(o.toLowerCase()))??"";return h`
    ${e.bands.map((o,s)=>h`
      <div class="row-inline">
        ${Ie("State",o.match,l=>n(c=>{let d=c.bands[s];d&&(d.match=l)},`tmatch${o.id}`),{placeholder:"on",list:i})}
        ${ye("Colour",o.colorHex,l=>n(c=>{let d=c.bands[s];d&&(d.colorHex=l??Pn)},`tcol${o.id}`))}
        <button class="icon" title="Remove this state" aria-label="Remove this state"
          @click=${()=>n(l=>{l.bands=l.bands.filter((c,d)=>d!==s)})}>${D("close")}</button>
      </div>`)}
    <datalist id=${i}>${t.map(o=>h`<option value=${o}></option>`)}</datalist>
    <button class="small" @click=${()=>n(o=>{o.bands=[...o.bands,{id:re(),match:r,colorHex:At(r)}]})}>${r===""?"Add state":`Add ${r}`}</button>
    ${ye("Otherwise",e.otherColorHex,o=>n(s=>{s.otherColorHex=o??Pn},"tother"),!1,Pn)}`}var zy=2,w1=[["arc","Arc"],["ring","Ring"],["bar","Bar"],["dots","Dots"],["needle","Needle"]],v1={arc:"A 270\xB0 arc, open at the bottom",ring:"A full circle",bar:"A straight bar",dots:"One dot per unit, the first few filled",needle:"A dial with a pointer at the reading"};function Oy(e){let n=e.value.kind;if(n.kind==="aggregate"){let{stateFilter:t,...i}=n.aggregate;return{kind:{kind:"aggregate",aggregate:{...i,function:"count"}}}}return K(String(Math.max(1,Math.round(e.maxValue-e.minValue))))}var k1=[["now","Time (14:05)"],["hour","Hour"],["minute","Minute"],["weekday","Day of the week (0 is Monday)"],["day","Day of the month"],["month","Month number"],["timestamp","Unix timestamp (seconds)"]];function $1(e,n){let t="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(n){case"literal":return{kind:n,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:n,...t};case"entityAttribute":return{kind:n,...t,attribute:""};case"entityAge":return{kind:n,...t};case"aggregate":return{kind:n,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:n,timeField:"now"};case"dataAge":return{kind:n};case"jinja":return{kind:n,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:n,id:""};case"chartStat":return{kind:n,layer:"",stat:"latest"};case"item":return{kind:n,field:e.kind==="item"?e.field:""};case"listStat":return{kind:n,layer:"",stat:"count"}}}function he(e,n,t,i){if(i.inline||!C1())return h`<div class="value-editor">${wb(e,n,t,i)}</div>`;let a=Hl(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(n):void 0,s=Ne(n,me(e)),l="entityId"in n.kind;return h`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact||i.noLabel?m:h`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${s}. Click to change it.`}>
      <span class="chip-text ${l?"ent-tok":""}">${s}</span>
      ${o===void 0?m:h`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${yb(e,a,r,n,t,i)}
  </div>`}function yb(e,n,t,i,a,r){return h`<div class="value-pop" id=${n} popover role="dialog" aria-label=${t} @toggle=${xb}>
    <div class="pop-head">
      <b>${t}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${n} popovertargetaction="hide">Done</button>
    </div>
    ${to.has(n)?wb(e,i,a,r):m}
  </div>`}function me(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function Hl(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function C1(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var to=new Set,Yr=new WeakMap;function S1(e){let n=e.getRootNode();return(n instanceof ShadowRoot||n instanceof Document?n:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function bb(e,n,t=!1){let i=e instanceof Node?e:null;if(!i)return;let a=i.getRootNode();!(a instanceof ShadowRoot)&&!(a instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let r=a.querySelector(`#${CSS.escape(n)}`);r&&typeof r.showPopover=="function"&&!r.matches(":popover-open")&&r.showPopover(),r&&t&&requestAnimationFrame(()=>requestAnimationFrame(()=>{r.querySelector("textarea, input[type=text], input[type=search], input:not([type])")?.focus()}))}))}function xb(e){let n=e.currentTarget,t=e.newState==="open",i=Yr.get(n);if(i&&(i(),Yr.delete(n)),!t){to.delete(n.id)&&Te(n);return}let a=S1(n);if(!a)return;let r=()=>{if(!n.isConnected||!n.matches(":popover-open")){Yr.get(n)?.(),Yr.delete(n);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){n.hidePopover();return}Du(n,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),Yr.set(n,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),Du(n,a.getBoundingClientRect()),to.has(n.id)||(to.add(n.id),Te(n),requestAnimationFrame(()=>{n.isConnected&&Du(n,a.getBoundingClientRect())}))}function Du(e,n){e.style.maxHeight="";let t=e.getBoundingClientRect(),i=T1({left:n.left,top:n.top,bottom:n.bottom,width:n.width},{width:t.width,height:t.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var Bi=8,yl=6,Gy=140;function T1(e,n,t){let i=t.height-e.bottom-yl-Bi,a=e.top-yl-Bi,r=n.height>i&&a>i&&i<Gy,o=Math.max(Gy,r?a:i),s=Math.min(n.height,o),l=Math.max(Bi,Math.min(e.left,t.width-n.width-Bi)),c=r?Math.max(Bi,e.top-yl-s):Math.max(Bi,Math.min(e.bottom+yl,t.height-s-Bi));return{left:l,top:c,maxHeight:o,above:r}}function E1(e,n,t){let i=i1.filter(([r])=>t.allowNamed!==!1||r!=="named");return(e.rowEditListId!==void 0||n.kind==="item")&&i.push(["item","Item field"]),(e.config.elements.some(r=>r.kind==="list")||n.kind==="listStat")&&i.push(["listStat","List count"]),i}function wb(e,n,t,i){let a=n.kind,r=d=>t({...n,kind:d}),o=i.key,s=E1(e,a,i),l=m;switch(a.kind){case"literal":l=i.symbol?pb(e,a.value,d=>r({...a,value:d}),o,i.setSymbolPath):Ie("Text",a.value,d=>r({...a,value:d}));break;case"entityState":case"entityAge":l=rt(e,"Entity",a,d=>r({...a,...d}),`${o}-entity`);break;case"entityAttribute":{let d=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),u=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;l=h`${rt(e,"Entity",a,p=>r({...a,...p}),`${o}-entity`)}
        ${Ie("Attribute",a.attribute,p=>r({...a,attribute:p}),{list:u,mono:!0})}
        <datalist id=${u}>${d.map(p=>h`<option value=${p}></option>`)}</datalist>`;break}case"aggregate":l=_1(e,a.aggregate,d=>r({...a,aggregate:d}),o);break;case"time":l=$e("Field",a.timeField,k1,d=>r({...a,timeField:d}));break;case"dataAge":break;case"jinja":l=h`${Ju("Template",a.value,d=>r({...a,value:d}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":{let d=e.config.values.find(p=>p.id===a.id),u=d?Rr(e.config,d.id):0;l=e.config.values.length===0?h`<div class="hint keep">No shared values yet.
            <button type="button" class="link" @click=${()=>L1(e,n,t)}>Start an empty one</button>,
            or choose another source and click Make shared.</div>`:h`${$e("Value",a.id,[["","(choose)"],...e.config.values.map(p=>[p.id,p.name||p.id.slice(0,8)])],p=>r({...a,id:p}))}
          ${d?h`<div class="hint keep">Read by ${u} ${u===1?"layer":"layers"}.
            <button type="button" class="link" @click=${()=>e.selectValue(d.id)}>Edit it</button> to change them all, or
            <button type="button" class="link" @click=${()=>{let p=yc(e.config,n);p&&t(p)}}>stop sharing</button>
            to give this one its own copy.</div>`:m}`;break}case"chartStat":{let d=me(e),u=e.config.elements.filter(p=>p.kind==="chart");l=u.length===0?h`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:h`
          ${$e("Chart",a.layer,[["","(choose)"],...u.map(p=>[p.payload.id,Ce(p,d)])],p=>r({...a,layer:p}))}
          ${$e("Number",a.stat,[...Bt],p=>r({...a,stat:p}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Add unit to print the entity's unit after it."}</div>`;break}case"item":l=N1(e,a,d=>r(d),o);break;case"listStat":{let d=me(e),u=e.config.elements.filter(p=>p.kind==="list");l=u.length===0?h`<div class="hint warn">There is no list layer yet. Add one first, then this can print how many rows it drew.</div>`:h`
          ${$e("List",a.layer,[["","(choose)"],...u.map(p=>[p.payload.id,Ce(p,d)])],p=>r({...a,layer:p}))}
          ${$e("Number",a.stat,[...Ch],p=>r({...a,stat:p}))}
          <div class="hint">${a.stat==="total"?'How many items there were before the list took the first few. Use it for "4 of 12".':"How many rows the list actually drew. Use it for a header above the list, or a rule that shows an empty state when it is 0."}</div>`;break}}let c=a1[a.kind];return h`
    ${$e("Source",a.kind,s,d=>r($1(a,d)))}
    ${c?h`<div class="hint">${c}</div>`:m}
    ${l}
    ${A1(n,i)?h`<div class="hint keep">
      <button type="button" class="link" title="Move this into a shared value that other layers can read too" @click=${()=>I1(e,n,t)}>Make shared</button>
      so other layers can read this too.</div>`:m}
    ${i.noFormat?m:H1(n.format,d=>t(We(d)?{kind:n.kind}:{...n,format:d}),M1(R1(e,n)))}
    ${i.showResolved?F1(e,n,e.resolve(i.resolveAs??n)):m}`}function R1(e,n){let t=n.kind;for(let i=0;t.kind==="named"&&i<8;i++){let a=t.id.toUpperCase(),r=e.config.values.find(o=>o.id.toUpperCase()===a);if(!r)return;t=r.value.kind}return t.kind==="named"?void 0:t}function M1(e){if(!e)return{numbers:!0,textCase:!0,unit:!0,seconds:!0};switch(e.kind){case"literal":{let n=et(e.value)!==void 0;return{numbers:n,textCase:!n,unit:!1,seconds:n}}case"entityState":case"entityAttribute":case"jinja":case"named":return{numbers:!0,textCase:!0,unit:e.kind!=="jinja"&&e.kind!=="named",seconds:!0};case"entityAge":case"dataAge":return{numbers:!0,textCase:!1,unit:!1,seconds:!0};case"aggregate":return{numbers:!0,textCase:!1,unit:!1,seconds:!1};case"chartStat":{let n=e.stat==="trend";return{numbers:!n,textCase:!1,unit:!n,seconds:!1}}case"time":return{numbers:e.timeField!=="now",textCase:!1,unit:!1,seconds:!1};case"item":return{numbers:!0,textCase:!0,unit:!0,seconds:!0};case"listStat":return{numbers:!0,textCase:!1,unit:!1,seconds:!1}}}function F1(e,n,t){let i=t===void 0?h`<span class="readout-v now-v none">${vb(e,n)}</span>`:t.trim()===""?h`<span class="readout-v now-v none">Empty</span>`:h`<span class="readout-v now-v"><span class="now-tok">${t}</span></span>`;return h`<div class="field readout now-field"><span>Now</span>${i}</div>`}function vb(e,n){let t=n.kind;switch(t.kind){case"entityState":case"entityAttribute":case"entityAge":return t.entityId===""?"Pick an entity":e.hass.states[t.entityId]?t.kind==="entityAttribute"&&t.attribute.trim()===""?"Pick an attribute":t.kind==="entityState"?"No reading":"Waiting for Home Assistant":"No such entity";case"chartStat":return t.layer===""?"Pick a chart":"The chart has no readings yet";case"item":return t.field===""?"Pick a field":"Only while a row is drawn";case"listStat":return t.layer===""?"Pick a list":"That list has drawn nothing yet";case"named":{if(t.id==="")return"Pick a shared value";let i=t.id.toUpperCase(),a=e.config.values.find(r=>r.id.toUpperCase()===i);return a?vb(e,a.value):"That shared value is gone"}case"jinja":return t.value.trim()===""?"Type a template":"Waiting for Home Assistant";default:return"Waiting for Home Assistant"}}function A1(e,n){if(n.allowNamed===!1||n.noShare)return!1;let t=e.kind;return t.kind==="named"?!1:t.kind==="literal"||t.kind==="jinja"?t.value.trim()!=="":"entityId"in t?t.entityId!=="":t.kind==="chartStat"?t.layer!=="":!0}function I1(e,n,t){let i=uo(n,me(e)).replace(/^"(.*)"$/,"$1"),{named:a,ref:r}=gc(e.config,n,Qe(i,24));e.beginGesture(),e.update(o=>{o.values.push(a)}),t(r),e.endGesture()}function L1(e,n,t){let{named:i,ref:a}=gc(e.config,{...n,kind:{kind:"literal",value:""}},"");i.name="",e.beginGesture(),e.update(r=>{r.values.push(i)}),t(a),e.endGesture(),e.selectValue(i.id)}function H1(e,n,t){let i=e??{},a=s=>{let l={...i,...s};for(let c of Object.keys(l))(l[c]===void 0||l[c]===!1||l[c]==="")&&delete l[c];n(l)},r=We(e),o={decimals:t.numbers||i.decimals!==void 0,multiply:t.numbers||i.multiply!==void 0,offset:t.numbers||i.offset!==void 0,textCase:t.textCase||i.textCase!==void 0,unit:t.unit||!!i.useEntityUnit,seconds:t.seconds||!!i.relativeTime||!!i.duration};return h`<details class="sub format" ?open=${!r}>
    <summary>Format${r?h`<span class="sum-note">as it comes</span>`:h`<span class="sum-note">${Yb(e).replace(/^ \((.*)\)$/,"$1")}</span>`}</summary>
    <div class="grid2">
      ${o.decimals?ee("Decimals",i.decimals,s=>a({decimals:s}),{step:1,min:0,max:6,optional:!0,placeholder:"as is"}):m}
      ${o.multiply?ee("Multiply",i.multiply,s=>a({multiply:s}),{optional:!0,placeholder:"1"}):m}
      ${o.offset?ee("Plus",i.offset,s=>a({offset:s}),{optional:!0,placeholder:"0"}):m}
      ${o.textCase?ne("Case",i.textCase??"",[["","As is"],["upper","ABC"],["lower","abc"],["capitalized","Abc"]],s=>a({textCase:s||void 0}),{titles:{"":"Leave the letters as they are",upper:"UPPER CASE",lower:"lower case",capitalized:"Capital First Letters"}}):m}
      ${Ie("Before",i.prefix??"",s=>a({prefix:s}),{placeholder:"text in front"})}
      ${Ie("After",i.suffix??"",s=>a({suffix:s}),{placeholder:"text after"})}
    </div>
    ${o.unit?Fe("Add unit",!!i.useEntityUnit,s=>a({useEntityUnit:s})):m}
    ${o.seconds?ne("Seconds as",i.duration?"duration":i.relativeTime?"relativeTime":"",[["","Number"],["relativeTime","Short"],["duration","Duration"]],s=>a({relativeTime:s==="relativeTime",duration:s==="duration"}),{titles:{"":"300",relativeTime:"One unit: 45s, 5m, 3h",duration:"Two units: 1h 23m, 5m 0s"}}):m}
    ${$e("Timestamp",i.timestamp??"",[["","None"],...zo],s=>a({timestamp:s||void 0}))}
    ${i.timestamp===void 0?m:h`<div class="hint">Read as a moment in time (unix seconds) and printed by the watch's own clock and locale. A value that is not a number prints exactly as it did.</div>`}
  </details>`}function kb(e,n,t,i){let a=o=>o.join(", "),r=o=>o.split(",").map(s=>s.trim()).filter(Boolean);return h`
    ${ne("Over",n.kind,[["filter","Entities matching a filter"],["entities","A fixed list"]],o=>t(o==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}))}
    ${n.kind==="filter"?h`<div class="grid2">
          ${Ie("Domains",a(n.domains),o=>t({...n,domains:r(o)}),{placeholder:"light, switch"})}
          ${Ie("Area ids",a(n.areaIds),o=>t({...n,areaIds:r(o)}))}
          ${Ie("Label ids",a(n.labelIds),o=>t({...n,labelIds:r(o)}))}
          ${Ie("Floor ids",a(n.floorIds),o=>t({...n,floorIds:r(o)}))}
        </div>`:h`${n.entities.map((o,s)=>h`<div class="row-inline">
            ${rt(e,`Entity ${s+1}`,o,l=>{let c=[...n.entities];c[s]=l,t({...n,entities:c})},`${i}-agg-${s}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>t({...n,entities:n.entities.filter((l,c)=>c!==s)})}>${D("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>t({...n,entities:[...n.entities,{entityId:"",displayName:"",domain:""}]})}>Add entity</button>`}`}function $b(e,n,t){return h`
    ${$e(e,n?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],i=>{t(i===""?void 0:i==="equals"||i==="notEquals"?{kind:i,value:n&&"value"in n?n.value:""}:{kind:i})})}
    ${n&&"value"in n?Ie("State",n.value,i=>t({kind:n.kind,value:i})):m}`}function _1(e,n,t,i){return h`
    ${$e("Function",n.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],a=>t({...n,function:a}))}
    ${kb(e,n.scope,a=>t({...n,scope:a}),i)}
    ${$b("Only count when",n.stateFilter,a=>{let r={...n};a===void 0?delete r.stateFilter:r.stateFilter=a,t(r)})}
    ${n.function==="count"?m:Ie("Attribute (blank = state)",n.attribute??"",a=>{let r={...n};a?r.attribute=a:delete r.attribute,t(r)})}`}function Cb(e){let n=e.rowEditListId;if(n===void 0)return;let t=e.config.elements.find(i=>i.kind==="list"&&i.payload.id===n);return t?.kind==="list"?t.payload.source:void 0}var Pu="__other";function N1(e,n,t,i){let a=Cb(e),r=a?Mu(a):[],o=r.some(([d])=>d===n.field),s=n.field!==""&&!o,l=[["","(choose)"],...r.map(([d,u])=>[d,u]),[Pu,"Something else\u2026"]],c=a?.kind==="entities";return h`
    ${a===void 0?h`<div class="hint warn">An item field only reads something while a row is being drawn. Open the list's Row card and click Design the row.</div>`:m}
    ${$e("Field",s?Pu:n.field,l,d=>{t(d===Pu?{...n,field:c?"attr.":""}:{...n,field:d})})}
    ${s||c&&n.field.startsWith("attr.")?h`${Ie(c?"Attribute":"Field name",n.field,d=>t({...n,field:d.trim()}),{mono:!0,placeholder:c?"attr.brightness":"title"})}
        ${c?h`<div class="hint">Write it as <code>attr.</code> and the attribute's name. The list asks Home Assistant for exactly the attributes its row reads, so adding one here adds it to the fetch.</div>`:m}`:m}
    <div class="hint">An unknown field draws <code>--</code>. A time field takes a Timestamp style under Format, and a count of seconds takes Seconds as.</div>`}function Sb(e){let n=[],t=i=>{i&&n.push(i)};switch(e.kind){case"text":t(e.payload.value);for(let i of e.payload.parts??[])t(i.value);break;case"icon":t(e.payload.symbol),t(e.payload.level?.value),t(e.payload.level?.minSource),t(e.payload.level?.maxSource);break;case"shape":t(e.payload.level?.value),t(e.payload.level?.minSource),t(e.payload.level?.maxSource);break;case"gauge":t(e.payload.value),t(e.payload.total),t(e.payload.minSource),t(e.payload.maxSource);break;default:break}for(let i of e.payload.rules){for(let a of i.cases){for(let r of a.when.tests)t(r.value),t(r.comparison&&"value"in r.comparison?r.comparison.value:void 0),t(r.comparison&&"upper"in r.comparison?r.comparison.upper:void 0);for(let r of a.then)t(r.value)}for(let a of i.otherwise??[])t(a.value)}return n}var D1=/\{item\.attr\.([^{}]+)\}/g;function P1(e){let n=[],t=i=>{let a=i.trim();a!==""&&!n.includes(a)&&n.push(a)};for(let i of e){for(let o of Sb(i))o.kind.kind==="item"&&o.kind.field.startsWith("attr.")&&t(o.kind.field.slice(5));if(i.kind!=="tap")continue;let a=i.payload.action,r=["entityId"in a?a.entityId:"","displayName"in a?a.displayName:"",a.type==="callService"?a.serviceDataJSON??"":"",a.type==="callService"?a.target?.entityId??"":""];for(let o of r)for(let s of o.matchAll(D1))t(s[1]??"")}return n}function qi(e){if(e.source.kind!=="entities")return;let n=P1(e.template);n.length===e.source.attributes.length&&n.every((i,a)=>e.source.kind==="entities"&&e.source.attributes[a]===i)||(e.source={...e.source,attributes:n})}function z1(e,n){let t=e.kind==="calendar"||e.kind==="todo"?e.entities.filter(a=>a.entityId!==""):"entityId"in e&&e.entityId!==""?[{entityId:e.entityId,displayName:e.displayName,domain:e.domain}]:[],i=t[0]??{entityId:"",displayName:"",domain:""};switch(n){case"entities":return e.kind==="entities"?e:{kind:"entities",scope:t.length>0?{kind:"entities",entities:t}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},sort:"name",descending:!1,attributes:[]};case"attribute":return{kind:"attribute",...i,attribute:e.kind==="attribute"?e.attribute:""};case"template":return{kind:"template",value:e.kind==="template"?e.value:""};case"calendar":return{kind:"calendar",entities:t.slice(0,us),hours:Cr};case"todo":return{kind:"todo",entities:t.slice(0,us),status:"open",sort:"list"};case"forecast":return{kind:"forecast",...i,type:"hourly"}}}var By={sensor:["battery","energy","humidity","illuminance","power","pressure","signal_strength","temperature"],binary_sensor:["battery","connectivity","door","gas","moisture","motion","occupancy","problem","smoke","window"],cover:["door","garage","shade","window"]};function O1(e){return(e.kind==="filter"?e.domains:e.entities.map(t=>t.entityId.split(".")[0]??"")).map(t=>t.trim().toLowerCase()).filter(t=>t!=="")}function G1(e,n){let t=O1(n),i=new Set;for(let[r,o]of Object.entries(e??{})){let s=r.split(".")[0]??"";if(t.length>0&&!t.includes(s))continue;let l=o?.attributes?.device_class;typeof l=="string"&&l.trim()!==""&&i.add(l.trim())}if(i.size>0)return[...i].sort();let a=new Set;for(let r of t.length>0?t:Object.keys(By))for(let o of By[r]??[])a.add(o);return[...a].sort()}function B1(e,n){let t={...e},i=n.trim();return i===""?delete t.deviceClass:t.deviceClass=i,t}function Vy(e,n,t,i,a,r){let o=t.length>=us;return h`
    ${t.map((s,l)=>h`<div class="row-inline">
      ${rt(e,`${n} ${l+1}`,s,c=>{let d=[...t];d[l]=c,i(d)},`${a}-ref-${l}`,{compact:!0,domain:r})}
      <button class="icon" title="Remove" @click=${()=>i(t.filter((c,d)=>d!==l))}>${D("close")}</button>
    </div>`)}
    <button class="small" ?disabled=${o} @click=${()=>i([...t,{entityId:"",displayName:"",domain:""}])}>Add ${n.toLowerCase()}</button>
    ${t.length===0?h`<div class="hint warn">Nothing is picked yet, so this list has nothing to draw.</div>`:m}
    ${o?h`<div class="hint">Five is the most one list may merge.</div>`:m}`}function V1(e,n,t,i){let a=n.source,r=(s,l)=>t(c=>{c.source=s,qi(c)},l),o=m;switch(a.kind){case"entities":{let s=a.attributes,l=G1(e.hass.states,a.scope),c=`wa-list-classes-${i.replace(/[^a-z0-9]/gi,"")}`;o=h`
        ${kb(e,a.scope,d=>r({...a,scope:d}),`${i}-scope`)}
        ${Ie("Device class",a.deviceClass??"",d=>r(B1(a,d),"list-device-class"),{list:c,placeholder:"any",mono:!0,def:""})}
        <datalist id=${c}>${l.map(d=>h`<option value=${d}></option>`)}</datalist>
        <div class="hint">Keeps only the entities whose device class is exactly this, so a scope of sensors becomes your battery sensors. Leave it empty for any.</div>
        ${$b("Only when",a.stateFilter,d=>{let u={...a};d===void 0?delete u.stateFilter:u.stateFilter=d,r(u)})}
        ${Uu({label:"Sort by",value:a.sort,options:[...Vd],def:"name",set:d=>r({...a,sort:d})},{label:"Order",value:a.descending?"down":"up",options:[["up","A to Z"],["down","Z to A"]],def:"up",set:d=>r({...a,descending:d==="down"})})}
        <div class="hint">Entities that are unavailable are left out, unless Only when asks for exactly that state. Sorting by state compares numbers as numbers, and puts the text ones after them.</div>
        ${s.length>0?h`<div class="field readout"><span>Attributes</span><span class="readout-v mono">${s.join(", ")}</span></div>
            <div class="hint">Asked for because the row reads them. Remove the layer that reads one and it stops being fetched.</div>`:m}`;break}case"attribute":{let l=Object.entries(e.hass.states[a.entityId]?.attributes??{}).filter(([,d])=>Array.isArray(d)).map(([d])=>d).sort(),c=`wa-list-attrs-${i.replace(/[^a-z0-9]/gi,"")}`;o=h`
        ${rt(e,"Entity",a,d=>r({...a,...d}),`${i}-attr-entity`)}
        ${Ie("Attribute",a.attribute,d=>r({...a,attribute:d},"list-attr"),{list:c,mono:!0})}
        <datalist id=${c}>${l.map(d=>h`<option value=${d}></option>`)}</datalist>
        <div class="hint">An attribute that holds a list: a group's members, a select's options, a media player's sources, or any sensor that carries an array. Each entry becomes a row.</div>
        ${a.entityId!==""&&l.length===0?h`<div class="hint warn">None of that entity's attributes holds a list right now. The name can still be typed above.</div>`:m}`;break}case"template":o=h`
        ${Ju("Template",a.value,s=>r({...a,value:s},"list-template"),4)}
        <div class="hint">Rendered by Home Assistant, the same way a template value is. It should yield a JSON array: a list of objects becomes a row each, with one field per key, and a list of plain values gives each row one field called <code>value</code>.</div>`;break;case"calendar":o=h`
        ${Vy(e,"Calendar",a.entities,s=>r({...a,entities:s}),`${i}-cal`,"calendar")}
        ${ee("Look ahead",a.hours,s=>r({...a,hours:hs(s)},"list-hours"),{step:1,min:Qd,max:ec,def:Cr,unit:"h"})}
        <div class="hint">Events from now to that many hours ahead, merged across the calendars and sorted by when they start. An event already under way is included.</div>`;break;case"todo":o=h`
        ${Vy(e,"List",a.entities,s=>r({...a,entities:s}),`${i}-todo`,"todo")}
        ${Uu({label:"Show",value:a.status,options:[...Ud],def:"open",set:s=>r({...a,status:s})},{label:"Sort by",value:a.sort,options:[...Wd],def:"list",set:s=>r({...a,sort:s})})}`;break;case"forecast":o=h`
        ${rt(e,"Weather",a,s=>r({...a,...s}),`${i}-fc-entity`,{domain:"weather"})}
        ${ne("Forecast",a.type,[...Kd],s=>r({...a,type:s}),{def:"hourly"})}
        <div class="hint">Whatever that weather entity supports. An entity with no forecast of the chosen kind draws nothing.</div>`;break}return h`
    ${$e("Items",a.kind,[...jd],s=>r(z1(a,s),"list-kind"))}
    ${o}`}function U1(e,n,t){let i=ue[t==="inline"?"rectangular":t],a=_c({...e,frame:n},i)[0];return a===void 0?0:a.height*Math.abs(n.height)*i.height}var W1=10;function K1(e,n,t,i){let a=n.payload,r=_e(e.config,t,n).frame,o=ps(a),s=U1(a,r,t),l=a.direction==="down";return h`
    ${ee("Cells",a.rows,c=>i(d=>{d.rows=Xe(c),qi(d)},"list-rows"),{step:1,min:qd,max:Yd,def:vr})}
    ${ne("Direction",a.direction,[...jh],c=>i(d=>{d.direction=c}),{def:"down"})}
    ${l?ee("Columns",a.columns,c=>i(d=>{d.columns=Sr(c)},"list-cols"),{step:1,min:Xd,max:Jd,def:kr}):m}
    ${ee("Gap",a.gap,c=>i(d=>{d.gap=Ti(c)},"list-gap"),{step:.5,min:0,max:Zd,def:$r,unit:"pt"})}
    <div class="field readout"><span>Grid</span><span class="readout-v">${l?`${o.lines} ${o.lines===1?"line":"lines"} of ${o.columns}`:`${o.columns} across`} · ${s.toFixed(1)} pt tall</span></div>
    ${s>0&&s<W1?h`<div class="hint warn">A cell is ${s.toFixed(1)} points tall on this shape, which is too short for a line of text. Draw fewer cells, or make the list taller.</div>`:m}
    <div class="hint">The frame is split into this many cells whatever the item count, so a short list leaves the design where you put it rather than stretching two items over four rows.</div>`}var j1=["text","icon","shape","gauge","image","tap"];function q1(e,n,t){let i=n.payload,a=me(e),r=e.rowEditListId===i.id,o=i.template.length>=pa,s=(l,c)=>t(d=>{Na(d.template,l,l+c)});return h`
    <div class="chips">
      <button class="small ${r?"on":""}" title=${r?"Go back to the whole face":"Fill the preview with one cell of this list, so the row can be dragged and sized like any other layer"}
        @click=${()=>e.setRowEdit(r?void 0:i.id)}>${r?"Done designing":"Design the row"}</button>
    </div>
    ${r?h`<div class="hint keep">The preview is one cell of this list, scaled up. Drag and resize the row's layers there. Values can read Item field, and a tap can aim at the item it is drawn for.</div>`:m}
    ${i.template.length===0?h`<div class="hint warn">The row is empty, so the list draws nothing. Add a layer below.</div>`:h`<div class="chart-numbers">${bu(i.template,l=>l.payload.id,(l,c)=>h`
        <div class="num-row">
          <button class="num-pick" title="Show this layer's settings"
            @click=${()=>{e.setRowEdit(i.id),e.selectLayer(l.payload.id)}}>
            <span class="num-lead">${D(np(l.kind))}</span>
            <span class="num-text"><span class="num-title">${Ce(l,a)}</span><span class="num-kind">${ct[l.kind]}</span></span>
          </button>
          <button class="icon" title=${l.payload.isHidden?"Show this layer":"Hide this layer"}
            aria-label=${l.payload.isHidden?"Show this layer":"Hide this layer"}
            @click=${()=>t(d=>{let u=d.template[c];u&&(u.payload.isHidden=!u.payload.isHidden)})}
            >${D(l.payload.isHidden?"hide":"show")}</button>
          <button class="icon" title="Move up" aria-label="Move up" ?disabled=${c===0} @click=${()=>s(c,-1)}>${D("up")}</button>
          <button class="icon" title="Move down" aria-label="Move down" ?disabled=${c===i.template.length-1} @click=${()=>s(c,1)}>${D("down")}</button>
          <button class="icon danger" title="Remove this layer" aria-label="Remove this layer"
            @click=${()=>t(d=>{d.template.splice(c,1),qi(d)})}>${D("delete")}</button>
        </div>`)}</div>`}
    <div class="chips">
      ${j1.map(l=>h`<button class="small" ?disabled=${o}
        title=${`Add a ${ct[l].toLowerCase()} to the row`}
        @click=${()=>{let c=Y1(l);t(d=>{d.template.length<pa&&d.template.push(c)}),e.setRowEdit(i.id),e.selectLayer(c.payload.id)}}>${ct[l]}</button>`)}
    </div>
    <div class="hint">Every row draws these layers with its own item. Change them once and every row follows. Double click a row on the face, or click a layer here, to design them.</div>
    <div class="hint">${o?"Eight layers is the most a row may hold.":`${i.template.length} of ${pa} layers. A row holds text, icons, shapes, gauges, uploaded pictures and taps.`}</div>`}function np(e){return e==="image"?"image":e==="tap"?"tap":e==="gauge"?"gauge":e==="icon"?"icon":e==="shape"?"shape":"text"}function Y1(e){let n=Le(e);return n.payload.frame={x:0,y:0,width:1,height:1,rotationDegrees:0},n.kind==="text"&&(n.payload.value={kind:{kind:"item",field:""}},n.payload.fontSize=11),n.kind==="icon"&&(n.payload.symbol={kind:{kind:"item",field:"icon"}},n.payload.size=11,n.payload.frame={x:.3,y:.1,width:.4,height:.8,rotationDegrees:0}),n.kind==="image"&&(n.payload.source="inline"),n.kind==="gauge"&&(n.payload.value={kind:{kind:"item",field:""}}),n}function Tb(e,n,t,i){let a=e.elements.find(c=>c.kind==="list"&&c.payload.id===n);if(a?.kind!=="list")return;let r=structuredClone(a.payload.template);if(i!==void 0)for(let c of r)X1(c,i);let o=new Set(r.map(c=>c.payload.id)),s={...e,elements:r,groups:[],perFamily:{}};for(let c of de){let d=e.perFamily[c];if(!d)continue;let u={};for(let p of o){let f=d.placements[p];f&&(u[p]=structuredClone(f))}s.perFamily[c]={...d,placements:u,rules:[]}}let l=s.perFamily[t];if(l)for(let c of r)l.placements[c.payload.id]||(l.placements[c.payload.id]={frame:{...c.payload.frame},isHidden:c.payload.isHidden});return s}function X1(e,n){for(let t of Sb(e))t.kind.kind==="item"&&(t.kind={kind:"literal",value:n.get(t.kind.field)??"--"})}function Ku(e,n,t){let i=Cb(e);if(i===void 0)return m;let a=Mu(i).filter(([r])=>r!=="index"&&r!=="icon");return a.length===0?m:h`
    <div class="chips">
      ${a.map(([r,o])=>h`<button class="small" title=${`Put {item.${r}} into ${t}`}
        @click=${()=>n(`{item.${r}}`)}>${o}</button>`)}
    </div>
    <div class="hint">Each one is filled in per row when the tap fires. A placeholder naming a field the item does not have leaves that row's tap doing nothing.</div>`}function J1(e){switch(e.kind){case"calendar":return"No events";case"todo":return"All done";case"forecast":return"No forecast";default:return"Nothing to show"}}function Z1(e,n,t){let i=e.elements.find(c=>c.kind==="list"&&c.payload.id===n);if(i?.kind!=="list")return;let a={..._e(e,t,i).frame},r=Le("text");r.payload.frame=a,r.payload.isHidden=!0,r.kind==="text"&&(r.payload.value=K(J1(i.payload.source)),r.payload.fontSize=12,r.payload.colorSlot.baseColorHex="#8E8E93"),r.payload.name="Empty state";let o=ka(),s=o.cases[0],l=s.when.tests[0];return l.value={kind:{kind:"listStat",layer:n,stat:"count"}},l.comparison={kind:"equals",value:K("0")},s.then=[Wn("show")],r.payload.rules=[o],e.elements.push(r),Ae(e,t,r.payload.id,{frame:a,isHidden:!0}),r.payload.id}var Eb=tc,Q1=Eb.filter(([e])=>e!=="none");function eS(e){if("entityId"in e)return{entityId:e.entityId,displayName:e.displayName,domain:e.domain};if(e.type==="callService")return e.target}function Rb(e,n){let t=eS(n)??{entityId:"",displayName:"",domain:""};if(e==="callService"){let i=n.type==="callService"?{...n}:{type:"callService",serviceDomain:"",serviceName:""};return t.entityId!==""&&(i.target=t),i}return Yh(e)?{type:e,...t}:{type:e}}var tS=[["Open a cover","cover","open_cover",""],["Close a cover","cover","close_cover",""],["Stop a cover","cover","stop_cover",""],["Lock","lock","lock",""],["Unlock","lock","unlock",""],["Light brightness","light","turn_on",'{"brightness_pct": 50}'],["Climate target","climate","set_temperature",'{"temperature": 21}'],["Play / pause","media_player","media_play_pause",""],["Start a vacuum","vacuum","start",""],["Send a vacuum home","vacuum","return_to_base",""]];function Mb(e,n,t,i){let a=n.serviceDataJSON??"",r=Xh(a),o=n.target??{entityId:"",displayName:"",domain:""};return h`
    <div class="gen-row">
      ${Ie("Domain",n.serviceDomain,s=>t({...n,serviceDomain:s.trim()},"svc-domain"),{placeholder:"light"})}
      ${Ie("Service",n.serviceName,s=>t({...n,serviceName:s.trim()},"svc-name"),{placeholder:"turn_on"})}
    </div>
    <div class="chips">
      ${tS.map(([s,l,c,d])=>h`
        <button class="small" title=${`Fill in ${l}.${c}`}
          @click=${()=>{let u={...n,serviceDomain:l,serviceName:c};d===""?delete u.serviceDataJSON:u.serviceDataJSON=d,t(u)}}>${s}</button>`)}
    </div>
    ${rt(e,"Target entity (optional)",o,s=>{let l={...n};s.entityId===""?delete l.target:l.target=s,t(l,"svc-entity")},`${i}-svc-entity`)}
    ${Ku(e,s=>{let l={...n};l.target={entityId:s,displayName:"",domain:""},t(l,"svc-entity")},"the target entity")}
    ${Ju("Data (JSON)",a,s=>{let l={...n};s.trim()===""?delete l.serviceDataJSON:l.serviceDataJSON=s,t(l,"svc-data")},3)}
    ${Ku(e,s=>{let l={...n};l.serviceDataJSON=`${a}${s}`,t(l,"svc-data")},"the data")}
    ${r?h`<div class="hint">Leave the data empty for a service that needs nothing else. Anything here must be a JSON object, like <code>{"brightness_pct": 50}</code>. Templates are not run.</div>`:h`<div class="hint warn">That is not a JSON object, so the watch will refuse the tap. It has to look like <code>{"brightness_pct": 50}</code>.</div>`}`}function nS(e,n){return e!==void 0&&n.trim()!==""&&n.trim()!==e.trim()}function Fb(e){let n=e.config,t=n.tapAction,i=nS(e.savedName,n.name),a=n.refreshMinutes??0,r=Uy.map(s=>[String(s),Wy(s)]);Uy.includes(a)||r.push([String(a),Wy(a)]);let o=n.showSuccessFlash??!0;return h`
    <div class="gen-row">
      ${Ie("Name",n.name,s=>e.update(l=>{l.name=s},"name"))}
      ${$e("Refresh",String(a),r,s=>e.update(l=>{l.refreshMinutes=Number(s)||0},"refresh"))}
      ${$e("Tap action",t.type,Eb,s=>e.update(l=>{l.tapAction=Rb(s,l.tapAction),s!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
      <div class="field flash-cell"><span title="Flash when a tap works">Flash</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${o} title="Flash when a tap works"
            @change=${s=>e.update(l=>{l.showSuccessFlash=s.target.checked})} />
          ${o?h`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(n.successFlashColorHex??iS).slice(0,7)}
                @input=${He(s=>e.update(l=>{l.successFlashColorHex=s.toUpperCase()},"flash"))} />`:h`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${i?h`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:m}
    ${"entityId"in t?rt(e,"Target",t,s=>e.update(l=>{l.tapAction={type:t.type,...s}},"tap-entity"),"general-tap"):m}
    ${t.type==="callService"?Mb(e,t,(s,l)=>e.update(c=>{c.tapAction=s},l),"general-tap"):m}
    ${t.type==="openPage"?aS(e):m}`}var iS="#808080",Uy=[0,15,30,60,120];function Wy(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function aS(e){let n=e.config;return Ab(e,n.openPageId,n.openPageName,(t,i)=>e.update(a=>{if(t===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=t,i?a.openPageName=i:delete a.openPageName}))}function Ab(e,n,t,i){let a=n??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${t||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?h`<div class="hint keep">No pages reported yet. Open the watch app once so it can send its page list.</div>`:h`${$e("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(s=>s.id===o)?.name)})}
  ${a?m:h`<div class="hint keep">Without a page the tap falls back to the complication list.</div>`}`}function Ib(e,n){let t=e.config.values.findIndex(o=>o.id===n.id),i=`nv-${n.id}`,a=Rr(e.config,n.id),r={kind:{kind:"named",id:n.id}};return h`
    ${Ie("Name",n.name,o=>e.update(s=>{s.values[t].name=o},`${i}-name`),{placeholder:"Name it, like Outside temp"})}
    ${he(e,n.value,o=>e.update(s=>{s.values[t].value=o},i),{allowNamed:!1,showResolved:!0,resolveAs:r,inline:!0,key:i})}
    <div class="field readout"><span>Used by</span><span class="readout-v">${a===0?"No layers yet":`${a} ${a===1?"layer":"layers"}`}</span></div>`}function Lb(){return{id:re(),name:"",value:K("")}}function _e(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:t.payload.frame,isHidden:t.payload.isHidden,fromPlacement:!1}}function Ki(e,n){for(let t of e.elements){if(t.payload.id===n)return t;if(t.kind!=="list")continue;let i=t.payload.template.find(a=>a.payload.id===n);if(i)return i}}function Hb(e,n){return ba(e,n)}function Ae(e,n,t,i,a=!1){let r=Ki(e,t);if(!r)return;let o=e.perFamily[n];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[n]=o);let s=_e(e,n,r),c={...o.placements[t]??{frame:{...s.frame},isHidden:s.isHidden,...s.size!==void 0?{size:s.size}:{}},...i};a&&delete c.size,o.placements[t]=c}function ei(e,n,t,i,a){let r=n.payload.id,o=gs(n)??a.min,s=_e(e.config,t,n).size??o;return ee(i,s,l=>e.update(c=>Ae(c,t,r,{size:Math.max(a.min,l??o)}),`el-${r}-size-${t}`),{step:a.step,min:a.min,unit:"pt",...a.def===void 0?{}:{def:a.def}})}function _b(e,n,t){let i=e.perFamily[t]??(e.perFamily[t]=wn()),a=Ct(e,n).filter(l=>!we(e,l));if(a.length===0)return;let r=xa(e,a.map(l=>l.payload.id),n),o=gi(e,r,{nudge:!1}),s=e.perFamily[n];for(let l of o){let c=e.elements.find(f=>f.payload.id===l);if(!c)continue;let d=s?.placements[l],u=d?.size??gs(c),p={frame:{...d?.frame??c.payload.frame},isHidden:d?.isHidden??!1,...u!==void 0?{size:u}:{}};for(let f of de)f!==t&&delete e.perFamily[f]?.placements[l];i.placements[l]=ys(p,n,t,c.kind)}wa(e,t)}function _l(e,n){return Ef(e,n)}function rS(e){return e.length===0?"none":e.every(n=>n)?"all":e.every(n=>!n)?"none":"mixed"}function Wi(e){return e.kind==="image"||e.kind==="tap"||e.kind==="timeline"||e.kind==="chartTimes"||e.kind==="chartDots"||e.kind==="chartGrid"||e.kind==="imageTime"||e.kind==="list"?void 0:e.payload.colorSlot.baseColorHex}function Nb(e,n,t){let i=rS(t.map(l=>_e(e,n,l).isHidden)),a=t.map(Wi),r=t.length>0&&a.every(l=>l!==void 0),o=a[0],s=r&&o!==void 0&&a.every(l=>l!==void 0&&l.toUpperCase()===o.toUpperCase());return{hiddenHere:i,colourable:r,colour:s?o:void 0}}var La=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]],oS=[["leading","Left"],["center","Center"],["trailing","Right"]],io=[["default","System"],["rounded","Rounded"],["monospaced","Mono"],["serif","Serif"]],ao=[["standard","Standard"],["condensed","Condensed"],["compressed","Compressed"],["expanded","Expanded"]],ip=h`<div class="hint">The watch draws the system face's own narrow and wide cuts.
  The preview stretches the letters instead, so judge the shapes on the watch, not here.</div>`,sS=[["off","Upright"],["on","Italic"]],ap=h`<div class="hint">The watch draws SF Rounded and New York.
  The preview has no web copy of either, so it shows the closest match: judge the shapes on the watch, not here.</div>`,lS=[["1","1"],["2","2"],["3","3"],["4","4"]];function Db(e,n){let t=e.hass.states[n]?.attributes?.device_class;return typeof t=="string"?t:void 0}function Pb(e,n,t){let i=n.payload.id,a=ks(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=n.kind==="image"&&n.payload.source==="camera",s={...o?{domain:"camera"}:{},needed:Ky(n)};return h`
    ${rt(e,o?"Camera":"Entity",r,l=>e.update(c=>Rf(c,i,l,Db(e,l.entityId)),`${t}-entity`),`${t}-layer-entity`,s)}
    <div class="hint ${Ky(n)?"warn":""}">${uS(n,a)}</div>`}function Ky(e){return e.kind==="timeline"?e.payload.value.kind.kind!=="entityState":e.kind==="chart"?e.payload.historyMinutes>0&&e.payload.value.kind.kind!=="entityState":e.kind==="image"?e.payload.source!=="inline"&&e.payload.entity.entityId==="":!1}function dS(e){return e.kind==="tap"||e.kind==="text"||e.kind==="timeline"&&e.payload.aggregate!==void 0||e.kind==="chartTimes"||e.kind==="chartDots"||e.kind==="chartGrid"||e.kind==="imageTime"||e.kind==="list"?!1:!(e.kind==="image"&&e.payload.source==="inline")}function cS(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function Nl(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function uS(e,n){let t=cS(e),i=t?.kind.kind,r=t!==void 0&&!("entityId"in t.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline"))?i==="named"?" Its content comes through a shared value, so change that shared value to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(n.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],s=n.find(c=>c.where==="value"||c.where==="symbol"||c.where==="camera");s&&o.push(s.where==="symbol"?"the symbol":s.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":e.kind==="timeline"?"the states":"the text"),n.some(c=>c.where==="tap")&&o.push("the tap");let l=n.filter(c=>c.where==="test").length;return l>0&&o.push(l===1?"1 state test":`${l} state tests`),`Used by ${Nl(o)}.${r}`}function pS(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function ro(e,n){if(e===n)return!0;if(typeof e!=typeof n||e===null||n===null||typeof e!="object"||Array.isArray(e)!==Array.isArray(n))return!1;if(Array.isArray(e))return e.length===n.length&&e.every((a,r)=>ro(a,n[r]));let t=Object.keys(e).filter(a=>e[a]!==void 0),i=Object.keys(n).filter(a=>n[a]!==void 0);return t.length!==i.length?!1:t.every(a=>ro(e[a],n[a]))}function bl(e,n,t){return t.some(i=>!ro(e[i],n[i]))}function xl(e,n,t){let i=e,a=n;for(let r of t)a[r]===void 0?delete i[r]:i[r]=structuredClone(a[r])}function Re(e,n,t,i,a={}){let r=a.alwaysOpen===!0,o=r||e.openSections.has(n),s=e.helpSections.has(n),l=()=>e.toggleSection(n),c=()=>{!s&&!o&&e.toggleSection(n),e.toggleHelp(n)},d=s?`Hide the help in ${t}`:`Show help for ${t}`,u=h`<span class="swatch">${D(a.icon??"content")}</span>
      <span class="tt"><h4>${t}${oo(a.reset===void 0?void 0:{atDefault:!1,title:a.resetTitle??`Put ${t} back to its defaults`,reset:a.reset})}</h4>${a.summary?h`<span class="sum">${a.summary}</span>`:m}</span>
      <button type="button" class="sec-help ${s?"on":""}" aria-pressed=${s?"true":"false"} title=${d} aria-label=${d}
        @click=${p=>{p.stopPropagation(),c()}}>?</button>`;return h`<section class="sec" data-open=${o?"true":"false"} data-help=${s?"on":"off"} style=${a.color?`--c:${a.color}`:""}>
    ${r?h`<div class="sec-h pinned">${u}</div>`:h`<div class="sec-h" role="button" tabindex="0" aria-expanded=${o?"true":"false"} @click=${l}
          @keydown=${p=>{p.target===p.currentTarget&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),l())}}>
          ${u}
          <span class="chev">${D("chevron")}</span>
        </div>`}
    ${o?h`<div class="sec-b">${i}</div>`:m}
  </section>`}function hS(e){if(e.length===0)return"nothing";let n=t=>Number.isInteger(t)?String(t):String(Math.round(t*100)/100);return e.length<=12?e.map(n).join(" "):`${e.slice(0,6).map(n).join(" ")} \u2026 ${e.slice(-3).map(n).join(" ")}`}function fS(e){if(e<60)return`${Math.max(0,Math.round(e))}s`;let n=Math.round(e/60);if(n<90)return`${n}m`;let t=Math.floor(n/60),i=n%60;return i===0?`${t}h`:`${t}h ${i}m`}function mS(e,n){let t=ue[e==="inline"?"rectangular":e],i=n.height*t.height>n.width*t.width,a=Math.round((n.rotationDegrees%180+180)%180)===90;return i!==a}function gS(e,n,t){let i=mS(e,n),a=ue[e==="inline"?"rectangular":e],r=n.height*a.height>n.width*a.width;return h`<div class="grid2">
    ${ne("Direction",i?"vertical":"horizontal",[["horizontal","Horizontal"],["vertical","Vertical"]],o=>{t({rotationDegrees:o==="vertical"===r?0:90},"line-dir")},{titles:{horizontal:"Lying along the frame",vertical:"Standing up, as a divider"}})}
  </div>
  <div class="hint">Direction sets the frame's rotation. A line runs along the frame's long side, so
    for a thin divider make the frame long in one direction and Direction will follow it.</div>`}function yS(e){let n=e.filter(i=>i.state!=="unavailable"&&i.state!=="unknown");return n.length===0?!1:n.filter(i=>i.state.trim()!==""&&Number.isFinite(Number(i.state))).length*2>n.length}function bS(e,n,t=4){if(e.length===0)return"nothing";let i=[];for(let o=0;o<e.length;o++){let s=e[o],l=e[o+1]?.offsetSeconds??n,c=Math.max(0,l-s.offsetSeconds),d=i[i.length-1];d!==void 0&&d.state.trim().toLowerCase()===s.state.trim().toLowerCase()?d.seconds+=c:i.push({state:s.state,seconds:c})}let a=i.slice(-t),r=a.map(o=>`${o.state||"(blank)"} ${fS(o.seconds)}`).join(", ");return i.length>a.length?`\u2026 ${r}`:r}function ji(e,n=vi){let t=n.find(s=>s.minutes===e);if(t)return t.label;let i=Math.floor(e/1440),a=Math.floor(e%1440/60),r=e%60,o=[];return i>0&&o.push(`${i}d`),a>0&&o.push(`${a}h`),(r>0||o.length===0)&&o.push(`${r}m`),`Last ${o.join(" ")}`}function xS(e,n,t){if(!e||n===void 0||!n.averaged)return;let i=t.replace(/^Last\s+/,""),a=/^\d/.test(i)?`all ${i}`:`the whole ${i}`;return`This span has ${n.readings} readings, more than ${gn}, so they are averaged into ${gn} even slots to cover ${a}.`}var Tl=new Set;function ju(e,n,t=vi){return Tl.has(e)||!t.some(i=>i.minutes===n)}function zu(e,n,t,i,a=vi){let r=ju(e,n,a);return h`<label class="field">${De("Span",{atDefault:n===t&&!r,title:`Back to ${ji(t,a)}`,reset:()=>{Tl.delete(e),i(t)}})}
      <select @change=${o=>{let s=o.target.value;s==="custom"?(Tl.add(e),Te(o.target)):(Tl.delete(e),i(Number(s)||ns))}}>
        ${a.map(({minutes:o,label:s})=>h`<option value=${String(o)} ?selected=${!r&&o===n}>${s}</option>`)}
        <option value="custom" ?selected=${r}>Custom…</option>
      </select></label>`}function Ou(e,n,t=!1){let i=t?Ld:is,a=Math.floor(i/1440),r=t?br:vi,o=Math.floor(e/1440),s=Math.floor(e%1440/60),l=e%60,c=(d,u,p)=>n(Math.min(i,Math.max(1,Math.round(d)*1440+Math.round(u)*60+Math.round(p))));return h`<div class="grid3 span-parts">
      ${ee("Days",o,d=>c(d??0,s,l),{step:1,min:0,max:a})}
      ${ee("Hours",s,d=>c(o,d??0,l),{step:1,min:0,max:23})}
      ${ee("Minutes",l,d=>c(o,s,d??0),{step:1,min:0,max:59})}
    </div>
    <div class="hint">${t?h`${ji(e,r)}, up to 366 days. Statistics rows are never
          purged, so the limit is about what fits on a complication rather than about what
          the recorder still holds.`:h`${ji(e,r)}, up to 7 days: the recorder keeps
          ten by default, and a longer span would quietly come back short.`}</div>`}function wS(e){if(e.historyMinutes<=0)return"";if(e.source!=="statistics")return` \xB7 ${ji(e.historyMinutes)}`;let n=Po.find(([t])=>t===e.statPeriod)?.[1]??e.statPeriod;return` \xB7 ${ji(e.historyMinutes,br)} \xB7 per ${n.toLowerCase()}`}function rp(e,n){let t=me(e);switch(n.kind){case"text":{let i=n.payload.parts?.length??0;return It(n.payload)?`Rich text, ${i} part${i===1?"":"s"}`:Qe(Ne(n.payload.value,t),48)}case"icon":return fr(n.payload)?n.payload.path?"Custom SVG":"No drawing yet":Qe(Ne(n.payload.symbol,t),48);case"gauge":return Qe(Ne(n.payload.value,t),48);case"chart":return Qe(`${Ne(n.payload.value,t)}${wS(n.payload)}`,48);case"timeline":{let i=Ci(n.payload).length,a=i>1?`${i} entities, ${n.payload.aggregate?.combine==="all"?"all":"any"}`:Ne(n.payload.value,t);return Qe(`${a} \xB7 ${ji(Lt(n.payload))}`,48)}case"shape":return n.payload.kind==="roundedRectangle"?"Rounded rectangle":n.payload.kind;case"image":{if(n.payload.source==="inline"){let i=Si(n.payload);return i>0?`Uploaded picture \xB7 ${dl(i)}`:"No picture yet"}return n.payload.entity.displayName||n.payload.entity.entityId||(n.payload.source==="camera"?"No camera yet":"No entity yet")}case"tap":return bn(n.payload.action);case"list":return`${jd.find(([a])=>a===n.payload.source.kind)?.[1]??n.payload.source.kind} \xB7 ${Xe(n.payload.rows)} cells`;case"chartTimes":{let i=e.config.elements.find(a=>a.payload.id===n.payload.chart);return i?.kind==="chart"||i?.kind==="timeline"?Qe(`Times of ${Ne(i.payload.value,t)}`,48):"No chart or timeline"}case"imageTime":{let i=e.config.elements.find(a=>a.payload.id===n.payload.image);return i?.kind==="image"?Qe(`Time of ${Ce(i,t)}`,48):"No picture"}case"chartDots":case"chartGrid":{let i=e.config.elements.find(r=>r.payload.id===n.payload.chart),a=n.kind==="chartDots"?"Dots on":"Grid behind";return i?.kind==="chart"?Qe(`${a} ${Ne(i.payload.value,t)}`,48):"No chart"}}}function Ml(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${Ue(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${Ue(e.payload.colorSlot.baseColorHex)}`;case"gauge":{let n=e.payload,t=n.style==="dots"?`${n.bands.length>0&&n.coloring==="bands"?"banded":Ue(n.colorSlot.baseColorHex)} dots`:`${n.lineWidth} pt line \xB7 ${n.coloring==="bands"&&n.bands.length>0?`${n.bands.length+1} colour bands`:Ue(n.colorSlot.baseColorHex)}`;return`${n.style} \xB7 ${t}${n.thresholdValue===void 0?"":` \xB7 threshold ${n.thresholdValue}`}`}case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}`;case"timeline":{let n=e.payload;return`${n.bands.length===0?`one colour (${Ue(n.otherColorHex)})`:`${n.bands.length} ${n.bands.length===1?"state":"states"} coloured`}${n.gap>0?` \xB7 ${n.gap} pt gap`:""} \xB7 corners ${n.cornerRadius} pt`}case"shape":return e.payload.kind==="line"?`${Ue(e.payload.colorSlot.baseColorHex)} \xB7 ${e.payload.thickness} pt thick`:`${Ue(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return;case"chartTimes":return`${e.payload.timeLabelCount<=0?"no":e.payload.timeLabelCount} times \xB7 ${e.payload.labelSize} pt \xB7 ${Ue(e.payload.labelColorHex)}`;case"imageTime":return;case"list":return`${Xe(e.payload.rows)} cells \xB7 gap ${Ti(e.payload.gap)} pt`;case"chartDots":{let n=e.payload;return`${n.dots==="all"?"all":"auto"} \xB7 ${n.size===void 0?"automatic size":`${n.size} pt`} \xB7 ${n.colorHex===void 0?"series colour":Ue(n.colorHex)}`}case"chartGrid":{let n=e.payload;return`${n.lines} ${n.lines===1?"line":"lines"} \xB7 ${n.thickness} pt \xB7 ${Ue(n.colorHex)}`}}}function Xr(e,n,t,i,a,r){let o=Math.round(t*1e3)/10,s=l=>i(l/100);return h`<label class="pf">
    <span class="pl" title=${`${n}. Drag left or right to change it.`}
      @pointerdown=${Ll(o,s,{step:.5,min:a,max:r})}>${e}</span>
    <input type="number" step="0.5" min=${a} max=${r} .value=${String(o)} aria-label=${`${n} in percent`}
      data-scrub @pointerdown=${so(o,s,{step:.5,min:a,max:r})}
      @input=${He(l=>{let c=Number(l);l.trim()!==""&&Number.isFinite(c)&&s(c)})} />
    <span class="unit" aria-hidden="true">%</span>
  </label>`}function vS(e,n,t){let i=n.payload.id,a=`el-${i}`,r=_e(e.config,t,n),o=r.frame,s=(d,u)=>e.update(p=>Ae(p,t,i,{frame:As(o,d)}),`${a}-${u}-${t}`),l=!ro(o,ir)||r.isHidden,c=n.payload.chartAnchor;if(n.kind==="chartDots"||n.kind==="chartGrid"){let d=e.config.elements.find(u=>u.payload.id===n.payload.chart);return Re(e,"placement","Position",h`
      <div class="hint keep">${n.kind==="chartDots"?"Dots sit":"Grid lines sit"} on their chart, so they move,
        size and turn with it. To change where they are, change the chart.</div>
      ${d?h`<div class="field list-field"><span>Chart</span>
        <div class="chips"><button class="small" @click=${()=>e.selectLayer(d.payload.id)}>Select the chart</button></div>
      </div>`:m}
      ${Fe("Hidden",r.isHidden,u=>e.update(p=>Ae(p,t,i,{isHidden:u})),!1)}`,{color:oe.position,icon:"place",summary:`On the chart \xB7 ${ae(t)}`})}return c?.place==="through"?Re(e,"placement","Position",h`
      <div class="hint keep">A line sits on its chart at the reading it follows, and runs the whole plot. To
        change where it is, change the reading below or the chart. Thickness and colour are in Look.</div>
      ${Yy(e,n,t)}
      ${o.rotationDegrees!==0?an("Rotation",o.rotationDegrees,d=>s({rotationDegrees:d},"rot"),{min:-180,max:180,step:1,def:0,format:d=>`${Math.round(d)}\xB0`,unit:"\xB0",range:!1}):m}
      ${Fe("Hidden",r.isHidden,d=>e.update(u=>Ae(u,t,i,{isHidden:d})),!1)}`,{color:oe.position,icon:"place",summary:`On the chart \xB7 ${ae(t)}`}):Re(e,"placement","Position",h`
    ${Yy(e,n,t)}
    ${c===void 0?h`
    <div class="fgroup">
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${Xr("X","Left",o.x,d=>s({x:d},"x"),-100,100)}
        ${Xr("Y","Top",o.y,d=>s({y:d},"y"),-100,100)}
      </div>
    </div>
    ${qy(e,n,t,o,["across","down","both"])}
    </div>`:un(c.at)?m:h`
    <div class="fgroup">
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${Xr("X","Left",o.x,d=>s({x:d},"x"),-100,100)}
      </div>
    </div>
    ${qy(e,n,t,o,["across"])}
    </div>`}
    <div class="field xy-field"><span>Size</span>
      <div class="xy">
        ${Xr("W","Width",o.width,d=>s({width:d},"w"),4,200)}
        ${Xr("H","Height",o.height,d=>s({height:d},"h"),4,200)}
      </div>
    </div>
    ${an("Rotation",o.rotationDegrees,d=>s({rotationDegrees:d},"rot"),{min:-180,max:180,step:1,def:0,format:d=>`${Math.round(d)}\xB0`,unit:"\xB0",range:!1})}
    ${Fe("Hidden",r.isHidden,d=>e.update(u=>Ae(u,t,i,{isHidden:d})),!1)}
    <div class="hint">${c===void 0?"X, Y, W and H are":"W and H are"} a percent of the face, on the ${ae(t)} shape only. Drag a letter left or right to change its number. Arrow keys nudge 1 pt, shift for 10.${c===void 0?" Copy position and Paste position repeat a spot on another layer, on any shape.":""}</div>`,{color:oe.position,icon:"place",summary:`${Math.round(o.width*100)}% wide \xB7 ${ae(t)}`,...l?{resetTitle:`Put this layer back to the middle of the ${ae(t)} face at half size, unrotated and shown`,reset:()=>e.update(d=>Ae(d,t,i,{frame:{...ir},isHidden:!1}))}:{}})}var jy={across:{label:"Center across",title:"Move this layer to the middle of the face, left to right"},down:{label:"Center up and down",title:"Move this layer to the middle of the face, top to bottom"},both:{label:"Center",title:"Move this layer to the middle of the face"}};function qy(e,n,t,i,a){let r=n.payload.id,o=(d,u)=>e.update(p=>Ae(p,t,r,{frame:d}),`el-${r}-${u}-${t}`),s=e.copiedPosition,l=n.payload.chartAnchor!==void 0,c=s!==void 0&&s.family===t&&ro(s.frame,i);return h`<div class="field list-field"><span>Line up</span>
    <div class="chips">
      ${a.map(d=>h`<button class="small" title=${jy[d].title}
        ?disabled=${Im(i,d)}
        @click=${()=>o(Gc(i,d),`center-${d}`)}>${jy[d].label}</button>`)}
    </div>
  </div>
  ${l?m:h`<div class="field list-field"><span>Copy</span>
    <div class="chips">
      <button class="small" title="Copy this layer's X, Y, W, H and rotation, to paste onto another layer"
        @click=${()=>e.copyPosition({frame:{...i},family:t})}>${c?"Copied":"Copy position"}</button>
      <button class="small" ?disabled=${s===void 0||c}
        title=${s===void 0?"Copy a position from a layer first":s.family===t||t!=="rectangular"&&s.family!=="rectangular"?`Put this layer where the copied one sits on the ${ae(s.family)} face`:`Put this layer where the copied one sits on the ${ae(s.family)} face, scaled for this shape`}
        @click=${()=>s&&o(_C(s,t,n.kind),"paste")}>Paste position</button>
    </div>
  </div>`}`}function Yy(e,n,t){let i=n.payload.chartAnchor;if(i===void 0)return m;let a=n.payload.id,r=`el-${a}-anchor`,o=e.config.elements.filter(d=>d.kind==="chart"),s=(d,u)=>e.update(p=>{let f=p.elements.find(g=>g.payload.id===a);f?.payload.chartAnchor&&d(f.payload.chartAnchor)},u?`${r}-${u}`:void 0),l=me(e),c=!o.some(d=>d.payload.id===i.layer);return h`
    <div class="fgroup">
    ${o.length<2?m:$e("Follows",i.layer,o.map(d=>[d.payload.id,Ce(d,l)]),d=>s(u=>{u.layer=d}))}
    ${$e("Reading",i.at,Vt,d=>e.update(u=>{let p=u.elements.find(g=>g.payload.id===a);if(!p?.payload.chartAnchor)return;p.payload.chartAnchor.at=d;let f=u.elements.find(g=>g.payload.id===i.layer);f?.kind==="chart"&&(d==="threshold"&&f.payload.thresholdValue===void 0&&(f.payload.thresholdValue=tp(dt(e.resolve(f.payload.value)??"")),f.payload.drawsThreshold=!1),d==="now"&&f.payload.nowIndex===void 0&&(f.payload.nowIndex={kind:{kind:"time",timeField:"hour"}},f.payload.drawsNowLine=!1))}),{def:"highest"})}
    ${zb(e,i,r)}
    ${i.place==="through"?m:$e("Sits",i.place,Oo.filter(([d])=>d!=="through"),d=>s(u=>{u.place=d}),{def:"above"})}
    </div>
    <div class="grid2">
      ${i.dx?ee("Nudge X",i.dx,d=>s(u=>{d?u.dx=d:delete u.dx},"dx"),{step:.5,def:0,unit:"pt"}):m}
      ${i.place==="through"&&!i.dy?m:ee("Nudge Y",i.dy??0,d=>s(u=>{d?u.dy=d:delete u.dy},"dy"),{step:.5,def:0,unit:"pt"})}
    </div>
    ${i.place==="through"?m:h`
    <div class="field list-field"><span>Marker</span>
      <div class="chips">
        <button class="small" title="Stop following the chart and leave this layer where it is"
          @click=${()=>e.update(d=>{let u=d.elements.find(p=>p.payload.id===a);u&&delete u.payload.chartAnchor})}><span>Unpin</span></button>
        <span class="muted">Stops following the chart, so you can move it anywhere.</span>
        ${n.kind==="text"?h`<button class="small" title="Swap this text marker for an icon of the same shape, keeping where it sits"
              @click=${()=>e.update(d=>{sf(d,a)})}><span>Use an icon</span></button>`:m}
      </div>
    </div>`}
    ${c?h`<div class="hint keep">The chart this followed is not in this document any more, so the layer
          draws where its own frame puts it. Pick another chart above${i.place==="through"?", or delete the line":", or unpin it"}.</div>`:i.place==="through"?m:h`<div class="hint">This layer follows that reading on the ${ae(t)} face and every
          other one: wherever the bar lands, it goes. It is held inside the plot, so a big glyph over a tall
          bar is pushed down rather than off the top, and the bars never give up height to make room. Nudge Y
          can still lift it past the top of the chart, as far as the edge of the face.</div>`}`}function zb(e,n,t){let i=e.config.elements.find(l=>l.payload.id===n.layer);if(i?.kind!=="chart")return m;let a=i.payload,r=(l,c)=>e.update(d=>{let u=d.elements.find(p=>p.payload.id===n.layer);u?.kind==="chart"&&l(u.payload)},`${t}-${c}`),o=qe(e.config,n.layer).filter(l=>l.payload.chartAnchor?.at===n.at).length,s=o>1?` ${o} layers follow this ${n.at==="now"?"reading":"threshold"}, and they all move with this number.`:"";if(n.at==="threshold"){let l=tp(dt(e.resolve(a.value)??""));return h`
      <div class="grid2">
        ${ee("Threshold at",a.thresholdValue??l,c=>r(d=>{d.thresholdValue=c??l,d.drawsThreshold=!1},"thval"),{def:l})}
      </div>
      <div class="hint">${a.scale==="fixed"?"A threshold outside the chart's Min and Max draws nothing: the plot keeps the range you asked for.":"The plot stretches to include the threshold, so a series that never reaches it still shows how far off it is."}${s}</div>`}return n.at==="now"?h`
      ${he(e,a.nowIndex??{kind:{kind:"time",timeField:"hour"}},l=>r(c=>{c.nowIndex=l,c.drawsNowLine=!1},"nowidx"),{showResolved:!0,label:"Now is reading",key:`${t}-nowindex`})}
      <div class="hint">Counted from 0, so Hour puts now on reading 14 at 2 pm, which is what a 24-reading
        price or forecast chart wants. Rounded, and clamped to the readings drawn.${s}</div>`:n.at==="zero"?h`<div class="hint">Drawn only while the plot runs from below zero to above it, like a
      temperature or a battery charging and discharging. On readings that stay on one side of zero, zero
      sits on the edge of the plot or outside it, and nothing draws.</div>`:m}function kS(e,n){if(n.kind==="tap")return m;if(Hb(e.config,n.payload.id))return m;let t=n.payload.id,i=lt(e.config,t)[0];return Re(e,"tappable","Tap",iT(e,n,`el-${t}`),{color:oe.tap,icon:"tap",summary:i?bn(i.payload.action):"Not tappable",...i?{reset:()=>e.update(a=>vs(a,t))}:{}})}function $S(e,n,t,i,a){return h`
    ${an("Times",e.timeLabelCount,r=>n(o=>{o.timeLabelCount=Math.max(0,Math.min($i,Math.round(r)))},`${i}count`),{min:0,max:$i,step:1,def:t.timeLabelCount,format:r=>r<=0?"None":String(Math.round(r)),range:!1})}
    ${e.timeLabelCount<=0?m:h`
      <div class="fgroup">
      <div class="grid2">
        ${ee("Time size",e.labelSize,r=>n(o=>{o.labelSize=Math.min(On,Math.max(zn,r??bt))},`${i}size`),{step:.5,min:zn,max:On,def:t.labelSize,unit:"pt"})}
        ${ye("Time colour",e.labelColorHex,r=>n(o=>{o.labelColorHex=r??xt},`${i}colour`),!1,t.labelColorHex)}
      </div>
      ${e.labelsAbove===void 0?m:ne("Row",e.labelsAbove?"above":"below",[["below","Below"],["above","Above"]],r=>n(o=>{o.labelsAbove=r==="above"}),{def:t.labelsAbove===!0?"above":"below"})}
      </div>
      <div class="fgroup">
      ${ne("Clock",e.hourCycle,Oh,r=>n(o=>{o.hourCycle=r}),{titles:{auto:"Whatever clock the watch is set to"},def:t.hourCycle})}
      ${ne("Minutes",e.minutes,Gh,r=>n(o=>{o.minutes=r}),{titles:{auto:"Kept up to a three hour span, dropped past it"},def:t.minutes})}
      ${a}
      </div>`}`}var CS=[["number","Number"],["entity","Entity"]];function SS(e,n){return(n==="min"?e.minSource:e.maxSource)===void 0?"number":"entity"}function TS(e,n,t){let i=n==="min"?"minSource":"maxSource";t==="number"?delete e[i]:e[i]===void 0&&(e[i]={kind:{kind:"entityState",entityId:"",displayName:"",domain:""}})}function Ob(e,n,t,i,a,r="gauge"){let o=s=>{let l=s==="min",c=l?"Min":"Max",d=SS(n,s),u=l?n.minValue:n.maxValue,p=y=>a(w=>{l?w.minValue=y??0:w.maxValue=y??100},s),f={number:`${c} is a fixed number`,entity:`${c} reads a number from an entity`},g=h`<div class="gauge-end-head">
      ${De(c,d==="number"?ti(u,t[s],p):void 0)}
      <span class="seg" role="radiogroup" aria-label=${`${c} comes from`}>
        ${CS.map(([y,w])=>h`<button type="button" role="radio" aria-checked=${y===d?"true":"false"}
          class=${y===d?"on":""} title=${f[y]}
          @click=${()=>{y!==d&&a(k=>TS(k,s,y))}}>${w}</button>`)}
      </span>
    </div>`,b=l?n.minSource:n.maxSource;return d==="number"||b===void 0?h`<div class="field gauge-end">${g}${lo(u,p,{ariaLabel:c})}</div>`:h`<div class="field gauge-end">${g}${he(e,b,y=>a(w=>{l?w.minSource=y:w.maxSource=y},`${s}src`),{showResolved:!0,noLabel:!0,label:c,key:`${i}-${s}source`})}</div>
      <div class="hint">If the entity has no number, the ${r} uses ${String(u)}.</div>`};return n.minSource===void 0&&n.maxSource===void 0?h`<div class="grid2 gauge-ends">${o("min")}${o("max")}</div>`:h`${o("min")}${o("max")}`}var Xy=["level"];function ES(e){let n=e.payload.level;return n===void 0?"Off":`${Bo.find(([i])=>i===n.direction)?.[1]??"Up"}, ${n.minValue} to ${n.maxValue}`}function RS(e){return e.kind==="icon"?!0:e.kind==="shape"&&e.payload.kind!=="line"}function MS(e,n,t,i){let a=n.payload.level,r=(c,d)=>i(u=>{let p=u.payload;p.level!==void 0&&c(p.level)},d),o=bs(e.config,n),s=()=>Vo(o?{kind:{kind:"entityState",...o}}:K("50")),l=n.kind==="icon"?"icon":"shape";return h`
    ${Fe("Fill by value",a!==void 0,c=>i(d=>{let u=d.payload;c?u.level=s():delete u.level},"level-on"),!1)}
    ${a===void 0?h`<div class="hint">Draws the ${l} twice: all of it in a faint track colour, then as much of it as
          the reading fills, in its own colour. A battery icon that fills to 60%, or a tank that empties.</div>`:h`
        ${he(e,a.value,c=>r(d=>{d.value=c},"level-value"),{showResolved:!0,label:"Reading",key:`${t}-level-value`})}
        <div class="fgroup">
        ${Ob(e,a,{min:rr,max:or},`${t}-level`,(c,d)=>r(c,d?`level-${d}`:"level-range"),"fill")}
        </div>
        <div class="fgroup">
        ${ne("Direction",a.direction,[...Bo],c=>r(d=>{d.direction=c},"level-dir"),{titles:{up:"Fills from the bottom edge upward",down:"Fills from the top edge downward",left:"Fills from the right edge leftward",right:"Fills from the left edge rightward"},def:ar})}
        ${ye("Track colour",a.trackColorHex,c=>r(d=>{c===void 0?delete d.trackColorHex:d.trackColorHex=c},"level-track"),!0,null)}
        <div class="hint">Off, the empty part takes the layer's own colour at a quarter strength.
          A tinted face keeps only how see-through a colour is, so a track at full strength reads
          there as the same colour as the fill.</div>
        </div>`}`}function FS(e,n,t){if(!Uo(n))return m;let i=e.arc,a=e.countdown===!0,r=(o,s)=>t(l=>{l.arc!==void 0&&o(l.arc)},s);return h`
    <div class="fgroup">
      ${Fe("Curve",i!==void 0,o=>t(s=>{o?s.arc={radius:sr}:delete s.arc},"arc"),!1,{disabled:a})}
      ${a?h`<div class="hint">A countdown ticks as one piece of system text, which cannot be bent around a circle. Turn the countdown off to curve this layer.</div>`:m}
      ${i===void 0||a?m:h`
        ${ee("Radius",i.radius,o=>r(s=>{s.radius=Math.min(Ko,Math.max(Wo,o??sr))},"arc-radius"),{step:.05,min:Wo,max:Ko,unit:"of box",def:sr})}
        ${ee("Position",i.angle??0,o=>r(s=>{let l=o??0;l===0?delete s.angle:s.angle=l},"arc-angle"),{step:5,min:-360,max:360,unit:"\xB0",def:0})}
        ${ee("Spacing",i.spacing??0,o=>r(s=>{let l=dr(o??0);l===0?delete s.spacing:s.spacing=l},"arc-spacing"),{step:.5,min:kd,max:$d,unit:"pt",def:0})}
        ${ee("Spread",Math.abs(i.sweep??je),o=>r(s=>{let l=(s.sweep??je)<0?-1:1,c=lr(l*Math.abs(o??je));c===je?delete s.sweep:s.sweep=c},"arc-sweep"),{step:5,min:wd,max:vd,unit:"\xB0",def:je})}
        ${ne("Reads",IS(i),AS,o=>r(s=>{let l=Math.abs(s.sweep??je),c=o==="bottom"?-l:l;c===je?delete s.sweep:s.sweep=c,o==="bottom"?s.flip=!0:delete s.flip,o==="bottom"&&(s.angle??0)===0&&(s.angle=180),o==="top"&&s.angle===180&&delete s.angle},"arc-reads"),{def:"top"})}
        <div class="hint">Drag the box to grow the circle: a radius of ${sr} fills it,
          and a bigger one bends the text less without moving it. Position is where the
          middle of the text sits, 0 at the top and 90 on the right. Spread is how much of the circle the text may use; longer text shrinks
          to half size, then runs past the ends. Spacing adds room between the letters.</div>`}
    </div>`}var AS=[["top","Over the top"],["bottom","Along the bottom"]];function IS(e){let n=(e.sweep??je)<0,t=e.flip===!0;return!n&&!t?"top":n&&t?"bottom":"mixed"}function LS(e,n,t,i){let a=n.coloring??"uniform",r=n.highlight??"none",o=(d,u)=>t(p=>{let f={bands:p.bands??[],bandAboveColorHex:p.bandAboveColorHex??xe};d(f),f.bands.length>0?p.bands=f.bands:delete p.bands,f.bandAboveColorHex!==xe?p.bandAboveColorHex=f.bandAboveColorHex:delete p.bandAboveColorHex},u),s=(d,u,p)=>t(f=>{p===void 0||p===u?delete f[d]:f[d]=p},d),l=r==="highest"?"The highest number takes its own colour":r==="lowest"?"The lowest number takes its own colour":"The highest and lowest numbers take their own colours",c=a==="bands"?dt(e.resolve(n.value)??""):[];return h`
    <div class="fgroup">
    ${ne("Colour",a,Wu,d=>t(u=>{if(d==="uniform"){delete u.coloring;return}u.coloring=d,(u.bands?.length??0)===0&&(u.bands=El(dt(e.resolve(u.value)??"")))}),{def:"uniform"})}
    ${i}
    ${a==="bands"?h`
      <div class="hint">Each number in the text takes the colour of the band it falls in, and other text keeps the layer colour.</div>
      ${Rl({bands:n.bands??[],bandAboveColorHex:n.bandAboveColorHex??xe},n.colorSlot.baseColorHex,o,c.length===1?c[0]:void 0)}`:m}
    </div>
    <div class="fgroup">
    ${ne("Highlight",r,c1,d=>t(u=>{d==="none"?delete u.highlight:u.highlight=d}),{def:"none"})}
    ${r==="none"?m:h`
      <div class="grid2">
        ${r==="lowest"?m:ye("Highest colour",n.highColorHex??gt,d=>s("highColorHex",gt,d),!1,gt)}
        ${r==="highest"?m:ye("Lowest colour",n.lowColorHex??yt,d=>s("lowColorHex",yt,d),!1,yt)}
      </div>
      ${a==="bands"?m:h`<div class="hint">${l}, and other text keeps the layer colour.</div>`}`}
    </div>`}var eo=new Map,Jr=new Map,Sn=new Map,Zr=new Map,Gu=4,Bu=40,HS=[["layer","Layer"],["pick","Pick"],["bands","By value"]],_S=[["plain","Plain"],["rich","Rich"]],NS={plain:"One line: typed words, a live value or a template",rich:"Parts, each with its own colour, weight and size"};function op(e,n,t,i){let a=t!==void 0&&e.canCountDown(t);return!n&&!a?m:h`${Fe("Count down",n,i)}
    <div class="hint">Ticks down to the value's time on the watch, once a second: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>
    ${n&&!a?h`<div class="hint warn">This value is not a timer or a future time, so nothing counts down. The watch shows it as plain text.</div>`:m}`}function DS(e){return e.countdown===!0?"countdown":It(e)?"rich":"plain"}function PS(e){return(e.match(/ +|[^ ]+/g)??[]).map(n=>({text:n,space:n.startsWith(" ")}))}function zS(e,n){let t=wi(e);return t!==void 0?{kind:"text",label:t}:e.kind.kind==="jinja"?{kind:"template",label:Qe(e.kind.value,40)||"template"}:{kind:"value",label:uo(e,n)}}function Gb(e,n,t){let i=wi(e.value),a=i===void 0?Qe(uo(e.value,t),28):i.trim()===""?i===""?"empty":"spaces":`"${Qe(i,24)}"`;return`Part ${n+1}: ${a}`}function OS(e,n,t){let i=[["","Whole text"],...e.map((a,r)=>[a.id,Gb(a,r,t)])];return n!==void 0&&!e.some(a=>a.id===n)&&i.push([n,"A part that is gone"]),i}function qu(e){return e.coloring==="bands"?"bands":e.colorHex===void 0?"layer":"pick"}function GS(e,n){if(qu(e)==="bands"&&(e.bands?.length??0)>0){let t=[...Dn({bands:e.bands}).map(r=>r.colorHex),e.bandAboveColorHex??xe],i=100/t.length,a=r=>`${Math.round(r*10)/10}%`;return`conic-gradient(${t.map((r,o)=>`${r} ${a(o*i)} ${a((o+1)*i)}`).join(", ")})`}return e.colorHex??n}function Jy(e){let n=r=>r.length===1?`Part ${r[0].index+1}`:`Parts ${Nl(r.map(o=>String(o.index+1)))}`,t=e.filter(r=>r.reason==="kind"),i=e.filter(r=>r.reason==="format"),a=[];return t.length>0&&a.push(`${n(t)} ${t.length===1?"shows":"show"} a value a template cannot read, such as data age or a chart's number.`),i.length>0&&a.push(`${n(i)} ${i.length===1?"uses":"use"} a relative time or duration format, which a template cannot print.`),`Rich text stays on, because the parts cannot join into one line. ${a.join(" ")} Change or remove ${e.length===1?"that part":"those parts"} first.`}var BS={fontSize:"font size",fontWeight:"weight",color:"colour",bands:"colour bands"};function VS(e){return e.joined?e.template?"Rich text is off. The parts joined into one template, so the live values still update.":"Rich text is off. The parts joined into one line of text.":e.moved.length===0?"Rich text is off.":`Rich text is off. The part's ${Nl(e.moved.map(n=>BS[n]))} moved into Look.`}function US(e,n,t,i,a){let r=n.payload,o=r.id,s=DS(r),l=(r.parts?.length??0)>0,c=nc(e.config,r.value),d=Sn.get(o),u=d&&d.rich===l?d:void 0,p=s==="rich"&&(r.parts?.length??0)>=2?Jr.get(o):void 0,f=(y,w)=>{let k=!(r.parts??[]).every(R=>R.value.kind.kind==="literal"),S=ll(structuredClone(r),e.config.values);if(Jr.delete(o),!S.ok){Sn.set(o,{text:Jy(S.blocked),rich:!0,warn:!0}),Te(w);return}Sn.set(o,{text:VS(S.joined?{joined:!0,template:k}:S),rich:!1}),i(R=>{ll(R,e.config.values),y==="countdown"&&(R.countdown=!0)})},g=(y,w)=>{if(Jr.delete(o),s==="rich"){let k=y==="countdown"?"countdown":"plain",S=r.parts??[];if(S.length<2){f(k,w);return}let R=Au(S,e.config.values);R.ok?(Sn.delete(o),Jr.set(o,k)):Sn.set(o,{text:Jy(R.blocked),rich:!0,warn:!0}),Te(w);return}if(y==="rich"){let k=r.parts?.[0]?.id??re();eo.set(o,k),Sn.delete(o),i(S=>{delete S.countdown,Cy(S,k)});return}Sn.delete(o),i(k=>{if(y==="countdown"){k.countdown=!0;return}(k.parts?.length??0)>0&&ll(k,e.config.values),delete k.countdown})},b=p==="countdown"?"Switch to Countdown?":"Switch to Plain?";return h`
    ${ne("Type",s==="rich"?"rich":"plain",_S,g,{titles:NS})}
    <div class="hint">Plain shows one line: typed words, a live value or a template. Rich splits the text into parts, and each part has its own colour, weight and size.</div>
    ${p===void 0?m:h`<div class="rich-confirm" role="alertdialog" aria-label=${b}>
        <b>${b}</b>
        <div>The parts join into one line, so every word and value stays. The part styles go away. Undo brings them back.${r.rules.some(y=>y.partId!==void 0)?" States that change one part will change the whole text.":""}</div>
        <div class="acts">
          <button class="small primary" @click=${y=>f(p,y.currentTarget)}>Switch</button>
          <button class="small" @click=${y=>{Jr.delete(o),Te(y.currentTarget)}}>Keep Rich</button>
        </div>
      </div>`}
    ${u?h`<div class=${u.warn?"hint warn":"rich-note"}>${u.text}</div>`:m}
    ${s==="rich"?WS(e,n,t,i,a):h`
        ${Pb(e,n,a)}
        ${he(e,r.value,y=>i(w=>{w.value=y},"value"),{showResolved:!0,label:s==="countdown"?"Until":"Text",key:`${a}-value`})}
        ${op(e,s==="countdown",r.value,y=>g(y?"countdown":"plain",null))}
        ${c?h`<div class="hint keep">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(c.payload.id)}>${Ce(c,me(e))}</button>. It stays in the chart's group and moves with it.</div>`:m}`}`}function WS(e,n,t,i,a){let r=n.payload,o=r.parts??[],s=r.id,l=me(e),c=Math.max(0,o.findIndex(M=>M.id===eo.get(s))),d=o[c],u=o.length,p=r.colorSlot.baseColorHex,f=_e(e.config,t,n).size??r.fontSize,g=(M,q)=>{Sn.delete(s),i(x=>{M(x),Mh(x)},q)},b=(M,q)=>g(x=>{let T=x.parts?.find(P=>P.id===d.id);T&&M(T)},q?`part-${d.id}-${q}`:void 0),y=(M,q)=>{eo.set(s,M),Sn.delete(s),Te(q)},w=(M,q)=>{let x=re();eo.set(s,x),g(T=>{(T.parts??=[]).push({id:x,value:M})}),bb(q,Hl(`${a}-part-${x}`),!0)},k=M=>g(q=>{q.parts&&Na(q.parts,c,M)}),S=()=>{let M=o[c+1]??o[c-1];M&&eo.set(s,M.id),g(q=>{q.parts=(q.parts??[]).filter(x=>x.id!==d.id)})},R=o.map((M,q)=>{let x=zS(M.value,l),T=M.id===d.id,P=qu(M),C=x.kind==="value"?e.resolve(M.value):void 0,_=M.fontWeight===void 0?void 0:La.find(([B])=>B===M.fontWeight)?.[1];return h`<button type="button" role="option" aria-selected=${T?"true":"false"} class="part-chip ${x.kind} ${T?"on":""}"
      aria-label=${Gb(M,q,l)} @click=${B=>y(M.id,B.currentTarget)}>
      <span class="part-dot" style=${`background:${GS(M,p)}`}
        title=${P==="bands"?"By value, with its own bands":P==="pick"?"Its own colour":"The layer colour"}></span>
      ${x.kind==="text"?h`<span class="part-txt">${x.label===""?h`<span class="part-empty">empty</span>`:PS(x.label).map(B=>B.space?h`<span class="part-sp">${"\xB7".repeat(B.text.length)}</span>`:B.text)}</span>`:h`<span class="part-txt">${x.label}</span>`}
      ${C===void 0?m:h`<span class="part-now">${C}</span>`}
      ${_===void 0?m:h`<span class="part-flag" title="Its own weight">${_}</span>`}
      ${M.fontSize===void 0?m:h`<span class="part-flag" title="Its own font size">${M.fontSize} pt</span>`}
    </button>`}),O=r.rules.some(M=>M.partId===d.id),F=d.value.kind.kind==="literal",z=qu(d),$=d.fontSize!==void 0,A=La.find(([M])=>M===r.fontWeight)?.[1]??r.fontWeight,W=io.find(([M])=>M===(r.fontDesign??"default"))?.[1]??"System",Q=ao.find(([M])=>M===(r.fontWidth??"standard"))?.[1]??"Standard",I=M=>{M>=Gu&&M<=Bu&&b(q=>{q.fontSize=M},"size")},G=z==="bands"?dt(e.resolve(d.value)??""):[],J={layer:"Use the layer colour",...F&&z!=="bands"?{bands:"By value needs a live value"}:{}},te=(M,q)=>b(x=>{let T={bands:x.bands??[],bandAboveColorHex:x.bandAboveColorHex??xe};M(T),T.bands.length>0?x.bands=T.bands:delete x.bands,T.bandAboveColorHex!==xe?x.bandAboveColorHex=T.bandAboveColorHex:delete x.bandAboveColorHex},q);return h`<div class="rich-parts">
    <div class="field parts-field"><span>Parts</span>
      <div class="part-chips" role="listbox" aria-label="Parts">${R}</div>
      <div class="part-adds">
        <button type="button" class="small" title="Add a part of typed words"
          @click=${M=>w(K(""),M.currentTarget)}>${D("text")}<span>Add text</span></button>
        <button type="button" class="small" title="Add a part that shows a live value"
          @click=${M=>w({kind:{kind:"entityState",entityId:"",displayName:"",domain:""}},M.currentTarget)}>${D("braces")}<span>Add value</span></button>
      </div>
    </div>
    <div class="part-editor">
      <div class="part-head">
        <span class="part-title"><b>Part ${c+1}</b> of ${u} · ${F?"Text":"Value"}</span>
        <span class="spacer"></span>
        <button type="button" class="icon" title="Move left" aria-label="Move left" ?disabled=${c===0} @click=${()=>k(c-1)}>${D("left")}</button>
        <button type="button" class="icon" title="Move right" aria-label="Move right" ?disabled=${c===u-1} @click=${()=>k(c+1)}>${D("right")}</button>
        <button type="button" class="icon danger" aria-label="Remove this part" ?disabled=${u===1||O}
          title=${u===1?"A rich text layer keeps at least one part":O?"A state changes this part":"Remove this part"}
          @click=${S}>${D("delete")}</button>
      </div>
      ${O&&u>1?h`<div class="hint keep">A state changes this part. Change or delete that state first.</div>`:m}
      ${he(e,d.value,M=>b(q=>{q.value=M},"value"),{showResolved:!0,label:F?"Text":"Shows",key:`${a}-part-${d.id}`})}
      ${F?h`<div class="hint">Spaces count, and show as dots in the parts list. Type one at the start or end when this part needs a gap.</div>`:m}
      ${ne("Colour",z,HS,M=>b(q=>{if(M==="layer"){delete q.colorHex,delete q.coloring;return}if(M==="pick"){delete q.coloring,q.colorHex=Qu(p,"#FFFFFF")?"#64D2FF":p;return}delete q.colorHex,q.coloring="bands",(q.bands?.length??0)===0&&(q.bands=El(dt(e.resolve(q.value)??"")))}),{def:"layer",titles:J,...F&&z!=="bands"?{disabled:{bands:!0}}:{}})}
      ${z==="pick"?ye("Part colour",d.colorHex,M=>b(q=>{q.colorHex=M??p},"color")):m}
      ${z==="bands"?h`
        ${Rl({bands:d.bands??[],bandAboveColorHex:d.bandAboveColorHex??xe},d.colorHex??p,te,G.length===1?G[0]:void 0)}
        <div class="hint">These bands belong to this part. Another value in the same layer keeps its own.</div>`:m}
      <div class="field seg-field">${De("Weight",d.fontWeight===void 0?void 0:{atDefault:!1,title:`Back to the layer weight (${A})`,reset:()=>b(M=>{delete M.fontWeight})})}
        ${Ui("Weight",d.fontWeight,La,M=>b(q=>{q.fontWeight=M}),{inherited:r.fontWeight})}
      </div>
      <div class="field seg-field">${De("Typeface",d.fontDesign===void 0?void 0:{atDefault:!1,title:`Back to the layer typeface (${W})`,reset:()=>b(M=>{delete M.fontDesign})})}
        ${Ui("Typeface",d.fontDesign,io,M=>b(q=>{q.fontDesign=M}),{inherited:r.fontDesign??"default"})}
      </div>
      ${d.fontDesign==="rounded"||d.fontDesign==="serif"?ap:m}
      <div class="field seg-field">${De("Width",d.fontWidth===void 0?void 0:{atDefault:!1,title:`Back to the layer width (${Q})`,reset:()=>b(M=>{delete M.fontWidth})})}
        ${Ui("Width",d.fontWidth,ao,M=>b(q=>{q.fontWidth=M}),{inherited:r.fontWidth??"standard"})}
      </div>
      ${d.fontWidth!==void 0&&d.fontWidth!=="standard"?ip:m}
      <div class="field seg-field">${De("Italic",d.italic===void 0?void 0:{atDefault:!1,title:`Back to the layer slant (${r.italic===!0?"italic":"upright"})`,reset:()=>b(M=>{delete M.italic})})}
        ${Ui("Italic",d.italic===void 0?void 0:d.italic?"on":"off",sS,M=>b(q=>{q.italic=M==="on"}),{inherited:r.italic===!0?"on":"off"})}
      </div>
      <label class="field num part-size">${De("Font size",$?{atDefault:!1,title:`Back to the layer size (${f} pt)`,reset:()=>b(M=>{delete M.fontSize})}:void 0,Ll(d.fontSize??f,I,{step:1,min:Gu,max:Bu}))}
        ${lo(d.fontSize,M=>{M===void 0?b(q=>{delete q.fontSize},"size"):I(M)},{step:1,min:Gu,max:Bu,optional:!0,unit:"pt",placeholder:String(f),ariaLabel:$?"Part font size":`Part font size, ${f} pt from the layer`,...$?{}:{lead:D("link")}})}
      </label>
    </div>
  </div>`}function Bb(e,n,t,i={}){let a=n.payload.id,r=`el-${a}`,o=(x,T)=>e.update(P=>{let C=Ki(P,a);if(!C)return;x(C);let _=Hb(P,a);_&&qi(_.payload)},T?`${r}-${T}`:void 0),s=_e(e.config,t,n),l=s.frame,c=(x,T)=>e.update(P=>Ae(P,t,a,{frame:As(l,x)}),`${r}-${T}-${t}`),d=Le(n.kind).payload,u=d.colorSlot?.baseColorHex??"#FFFFFF",p=x=>d[x],f=!1,g=x=>Wi(n)===void 0?m:ye(x,Wi(n),T=>o(P=>{Wi(P)!==void 0&&(P.payload.colorSlot.baseColorHex=T??"#FFFFFF")},"color"),!1,u),b,y={},w=[],k,S;switch(n.kind){case"text":{let x=(T,P)=>o(C=>T(C.payload),P);k=US(e,n,t,x,r),f=!n.payload.countdown&&!It(n.payload),S=h`
        <div class="fgroup">
        ${ei(e,n,t,"Font size",{step:1,min:4,def:p("fontSize")})}
        ${ne("Weight",n.payload.fontWeight,La,T=>o(P=>{P.payload.fontWeight=T}),{def:d.fontWeight})}
        ${Uu({label:"Align",value:n.payload.alignment??"center",options:oS,def:"center",set:T=>o(P=>{let C=P.payload;T==="center"?delete C.alignment:C.alignment=T})},{label:"Lines",value:String(n.payload.lineLimit??1),options:lS,def:"1",set:T=>o(P=>{let C=P.payload;T==="1"?delete C.lineLimit:C.lineLimit=Number(T)})})}
        ${ne("Typeface",n.payload.fontDesign??"default",io,T=>o(P=>{let C=P.payload;T==="default"?delete C.fontDesign:C.fontDesign=T}),{def:"default"})}
        ${n.payload.fontDesign==="rounded"||n.payload.fontDesign==="serif"?ap:m}
        ${ne("Width",n.payload.fontWidth??"standard",ao,T=>o(P=>{let C=P.payload;T==="standard"?delete C.fontWidth:C.fontWidth=T}),{def:"standard"})}
        ${n.payload.fontWidth!==void 0&&n.payload.fontWidth!=="standard"?ip:m}
        ${Fe("Italic",n.payload.italic===!0,T=>o(P=>{let C=P.payload;T?C.italic=!0:delete C.italic}),d.italic===!0)}
        ${Fe("Mono digits",n.payload.monospacedDigits===!0,T=>o(P=>{let C=P.payload;T?C.monospacedDigits=!0:delete C.monospacedDigits}),d.monospacedDigits===!0)}
        ${n.payload.monospacedDigits?h`<div class="hint">Digits take the same width, so a number that ticks does not shuffle what sits beside it.</div>`:m}
        ${an("Shrink to fit",n.payload.minimumScale??wt,T=>o(P=>{let C=P.payload,_=er(T);_===wt?delete C.minimumScale:C.minimumScale=_},"minscale"),{min:wt,max:1,step:.05,def:wt,format:T=>`${Math.round(T*100)}%`})}
        <div class="hint">How small the text may go to fit its box before it is cut off with an ellipsis.
          100% never shrinks.</div>
        </div>
        ${FS(n.payload,t,x)}
        ${f?LS(e,n.payload,x,g("Main colour")):m}`;break}case"icon":{let x=fr(n.payload)?"svg":"symbol";k=h`
        ${ne("Drawing",x,[["symbol","Symbol"],["svg","Custom SVG"]],T=>o(P=>{QC(P.payload,T)},"icon-drawing"),{titles:{symbol:"An SF Symbol or a Material Design icon, by name",svg:"An SVG path you paste yourself"},def:"symbol"})}
        ${x==="svg"?hb(n.payload,(T,P)=>o(C=>T(C.payload),P)):h`
            ${he(e,n.payload.symbol,T=>o(P=>{P.payload.symbol=T},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${r}-symbol`,setSymbolPath:T=>o(P=>{let C=P.payload;T?C.path=T:delete C.path,delete C.viewBox},"symbol")})}
            <div class="hint">An entity source draws that entity's own icon instead. A Material Design icon travels with the document, so a rule that swaps the icon goes back to SF Symbols.</div>`}`,S=ei(e,n,t,"Icon size",{step:1,min:4,def:p("size")});break}case"gauge":{let x=n.payload,T=(C,_)=>o(B=>C(B.payload),_),P=x.style==="dots";k=h`
        ${he(e,x.value,C=>T(_=>{_.value=C},"value"),{showResolved:!0,label:"Reading",key:`${r}-value`})}
        ${P?h`
            ${he(e,x.total??Oy(x),C=>T(_=>{_.total=C},"total"),{showResolved:!0,label:"Total",key:`${r}-total`})}
            <div class="hint">How many dots to draw. Left as it is, a count of the same
              entities without the filter, so "3 of 8 lights on" is one reading and one
              total over one scope. At most ${Qo} dots are drawn.</div>`:h`<div class="fgroup">${Ob(e,x,{min:d.minValue,max:d.maxValue},r,T)}</div>`}`,f=!0,S=h`
        <div class="grid2">
          ${ne("Style",x.style,w1,C=>T(_=>{C==="dots"&&_.total===void 0&&(_.total=Oy(_)),C!=="dots"&&delete _.total,C==="needle"&&_.style!=="needle"&&_.lineWidth===d.lineWidth&&(_.lineWidth=zy),C!=="needle"&&_.style==="needle"&&_.lineWidth===zy&&(_.lineWidth=d.lineWidth),_.style=C}),{titles:v1,def:d.style})}
          ${P?m:ei(e,n,t,"Line width",{step:.5,min:.5,def:p("lineWidth")})}
        </div>
        <div class="fgroup">
        ${ye(P?"Empty dot colour":"Track colour",x.trackColorHex,C=>T(_=>{_.trackColorHex=C??"#FFFFFF40"},"track"),!1,d.trackColorHex)}
        ${ne("Colour",x.coloring,Wu,C=>T(_=>{_.coloring=C,C==="bands"&&_.bands.length===0&&(_.bands=El([_.minValue,_.maxValue]))}),{def:d.coloring})}
        ${g("Main colour")}
        ${x.coloring==="bands"?m:Cl("Gradient",x.fill,C=>T(_=>{if(C===void 0){delete _.fill;return}_.fill=C,_.colorSlot.baseColorHex=Ut(C,0)},"fill"),()=>({kind:"linear",stops:[{at:0,colorHex:x.colorSlot.baseColorHex},{at:1,colorHex:x.colorSlot.baseColorHex}]}))}
        ${x.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. The
            gauge takes the colour of the row its reading falls in, and a reading past the
            last row takes the colour underneath.</div>
          ${Rl(x,x.colorSlot.baseColorHex,T,dt(e.resolve(x.value)??"")[0])}`:m}
        </div>
        ${JS(x,T)}
        ${P?m:h`
          <div class="fgroup">
          <div class="grid2">
            ${ee("Threshold",x.thresholdValue,C=>T(_=>{C===void 0?delete _.thresholdValue:_.thresholdValue=C},"thr"),{optional:!0,def:null})}
            ${x.thresholdValue===void 0?m:ye("Threshold colour",x.thresholdColorHex,C=>T(_=>{_.thresholdColorHex=C??oa},"thrcol"),!1,oa)}
          </div>
          <div class="hint">A short tick on the scale at that value, so the fill reads
            against a target instead of on its own. A value outside Min to Max draws
            nothing. Leave it empty for no mark.</div>
          </div>`}`;break}case"chart":{let x=n.payload,T=(E,V)=>o(ge=>E(ge.payload),V),P=d.historyMinutes,C=d.historyPoints,_=x.historyMinutes>0,B=_&&x.source==="statistics",j=_&&!B,se=_?B?"statistics":"history":"value",ve=B?br:vi,ft=Wt(x)??Kt(x),Ge=x.value.kind.kind==="entityState",Rt=ft===void 0?void 0:e.historySeries(ft),Be=_&&Ge?Rt??"":e.resolve(x.value)??"",Me=x.historyPoints<1,Bl=j&&Ge&&ft!==void 0?e.historyReadings?.(ft):void 0,Ip=xS(Me,Bl,ji(x.historyMinutes)),Lp=ju(a,x.historyMinutes,ve),Vl=_&&Ge?Lc(Be):{values:dt(Be),holes:[]},Ji=Vl.values,Hp=E=>x.limit>0&&E.length>x.limit?x.takeFromEnd?E.slice(E.length-x.limit):E.slice(0,x.limit):E,Ox=Hp(Ji),Dt=Nc(Ox,Ft(x.smoothing),Vl.holes.length>0?Hp(Vl.holes):[]),Gx=!_&&Ge&&Ji.length===1,Ul=e.config.elements.filter(E=>E.kind==="chart"&&E.payload.id!==a),_p=me(e),go=x.scaleFrom!==void 0&&Ul.some(E=>E.payload.id===x.scaleFrom);k=h`
        ${he(e,x.value,E=>T(V=>{V.value=E},"value"),{label:"Readings",noShare:!0,key:`${r}-value`})}
        <div class="fgroup">
        ${ne("Draw",se,[["history","Recorded history"],["statistics","Long-term statistics"],["value","The value itself"]],E=>T(V=>{if(E==="value"){V.historyMinutes=0;return}V.source=E==="statistics"?"statistics":"history";let ge=V.historyMinutes||ns;V.historyMinutes=E==="statistics"?Math.min(ge,Ld):Math.min(ge,is)}),{titles:{history:"Read the entity's recorded states from the recorder and plot them",statistics:"Plot the recorder's pre-aggregated rows, which reach back a year",value:"Plot the numbers the value holds right now, such as a forecast list"},def:d.historyMinutes>0?"history":"value"})}
        ${B?h`
            ${Ge?m:h`<div class="hint warn">Statistics need an entity.
              A typed-in value, a template or a shared value has no rows to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${zu(a,x.historyMinutes,P,E=>T(V=>{V.historyMinutes=E}),br)}
              ${ne("Per",x.statPeriod,Po,E=>T(V=>{V.statPeriod=E}),{def:tr})}
            </div>
            ${Lp?Ou(x.historyMinutes,E=>T(V=>{V.historyMinutes=E},"span"),!0):m}
            ${ne("Read",x.statType,yd,E=>T(V=>{V.statType=E}),{def:nr})}
            <div class="hint">One bar per period, oldest first, newest ${gn} kept.
              Change suits energy (kWh per hour), Mean suits temperature.</div>
            ${x.statPeriod==="5minute"?h`<div class="hint warn">Five-minute rows are compacted into hourly ones after
                about ten days, so a longer span here comes back with only its recent tail.</div>`:m}
            ${Ge&&Rt===void 0?h`<div class="hint keep">Reading the statistics…</div>`:m}
            ${Ge&&Rt===""?h`<div class="hint warn">No long-term statistics for this entity in that span.
                Only an entity with a state class (measurement, total or total_increasing) gets
                them, and a brand new one has none yet.</div>`:m}`:m}
        ${j?h`
            ${Ge?m:h`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${zu(a,x.historyMinutes,P,E=>T(V=>{V.historyMinutes=E}))}
              <div class="field readings-field">${De("Points",{atDefault:x.historyPoints===C,title:`Back to ${C<1?"every one":`${C} averaged`}`,reset:()=>T(E=>{E.historyPoints=C})})}
                <div class="readings-row">
                  <div class="seg wide" role="radiogroup" aria-label="Points">
                    <button type="button" role="radio" aria-checked=${Me?"false":"true"} class=${Me?"":"on"}
                      title="Average the recorded states into this many equal time slots"
                      @click=${()=>{Me&&T(E=>{E.historyPoints=24})}}>Average</button>
                    <button type="button" role="radio" aria-checked=${Me?"true":"false"} class=${Me?"on":""}
                      title="Plot every recorded state change, no averaging"
                      @click=${()=>{Me||T(E=>{E.historyPoints=Hd})}}>Every one</button>
                  </div>
                  ${Me?m:h`<span class="readings-into">into</span>
                    <input type="number" class="short" aria-label="How many time slots" .value=${String(x.historyPoints)}
                      title="How many equal time slots the span is averaged into, so how many bars or points get drawn"
                      step="1" min=${as} max=${gn}
                      data-scrub @pointerdown=${so(x.historyPoints,E=>T(V=>{V.historyPoints=Math.round(E)},"hpoints"),{step:1,min:as,max:gn})}
                      @input=${He(E=>{let V=Number(E);E.trim()!==""&&Number.isFinite(V)&&V>=1&&T(ge=>{ge.historyPoints=Math.round(V)},"hpoints")})} />
                    <span class="readings-unit">slots</span>`}
                </div>
              </div>
            </div>
            ${Lp?Ou(x.historyMinutes,E=>T(V=>{V.historyMinutes=E},"span")):m}
            <div class="hint">${Me?h`Every state the recorder holds in that span, oldest first, one reading per change.
                  The time axis follows the changes, so a quiet hour draws narrower than a busy one.
                  A span with more than ${gn} readings is averaged into
                  ${gn} even slots instead, so the chart still covers all of it.`:h`Home Assistant averages the recorded states into this many equal time slots,
                  oldest first. About 20 suits a rectangular complication; more than that draws bars
                  thinner than the screen can show.`}</div>
            ${Ip===void 0?m:h`<div class="hint keep">${Ip}</div>`}
            ${Ge&&Rt===void 0?h`<div class="hint keep">Reading the history…</div>`:m}
            ${Ge&&Rt===""?h`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:m}`:m}
        ${_?h`
            ${Fe("Show gaps",x.gaps===!0,E=>T(V=>{E?V.gaps=!0:delete V.gaps}),d.gaps===!0)}
            ${nn(e)}
            <div class="hint">Breaks the line, and leaves the bar out, wherever the entity was unavailable,
              instead of carrying the last reading across the outage.</div>`:m}
        ${_?m:h`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        </div>
        ${Ji.length===0&&!(_&&(!Ge||Rt===void 0||Rt===""))?h`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:m}
        ${Ji.length>0?h`<div class="field readout"><span>Reads</span>
              <span class="readout-v"><span class="nums">${hS(Dt)}</span>${Ji.length===Dt.length?h` · ${Dt.length} ${Dt.length===1?"value":"values"}`:h` · ${Dt.length} of ${Ji.length}`}</span></div>`:m}
        ${Gx?h`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Recorded history</b> to plot how it has moved.</div>`:m}
        ${_&&x.limit<=0?m:h`
        <div class="grid2">
          ${ee("Only draw",x.limit,E=>T(V=>{V.limit=Math.max(0,Math.round(E??0))},"limit"),{step:1,min:0,def:d.limit,unit:"readings"})}
          ${x.limit<=0?m:ne("Keep",x.takeFromEnd?"end":"start",_?[["start","Oldest"],["end","Newest"]]:[["start","First"],["end","Last"]],E=>T(V=>{V.takeFromEnd=E==="end"}),{def:d.takeFromEnd===!0?"end":"start"})}
        </div>
        ${_?h`<div class="hint warn">Span and slots already set how much is drawn, so set this to 0.
              Trimming here draws only ${x.limit} of the readings fetched above, while clock times still label the whole span.</div>`:h`<div class="hint">${x.limit<=0?"0 draws every reading. Type a number to draw only that many.":`Draws only ${x.limit} of the numbers: the first or the last ones. A forecast sensor often carries 24 or 48.`}</div>`}`}
        ${$e("Smooth data",Ft(x.smoothing)??"off",s1,E=>T(V=>{let ge=Ft(E);ge===void 0?delete V.smoothing:V.smoothing=ge}),{def:Ft(d.smoothing)??"off"})}
        ${nn(e)}
        <div class="hint">Averages each reading with its neighbours, weighted towards the middle, so a
          jumpy sensor draws a calm line. The strength scales with the number of readings: over 120
          readings, Light, Medium and Strong average 7, 13 or 25 of them. The chart's own numbers
          read the smoothed series too: its stats, highlights and bands. A text layer pointed at the entity itself still shows the raw value.</div>`,f=!0;let Bx=(()=>{if(go)return!0;if(x.scale==="fixed")return x.minValue<0&&x.maxValue>0;let E=Dt.filter(yo=>Number.isFinite(yo));if(E.length===0)return!0;let V=Math.min(...E,x.thresholdValue??1/0),ge=Math.max(...E,x.thresholdValue??-1/0);return V<0&&ge>0})(),En=Iy(x);w=Dt,S=h`
        <div class="grid2">
          ${ne("Style",x.style,gb,E=>T(V=>{V.style=E}),{def:d.style})}
          ${x.style==="bars"?ee("Bar gap",x.barGap,E=>T(V=>{V.barGap=Math.max(0,E??0)},"gap"),{step:.5,min:0,def:d.barGap,unit:"pt"}):ei(e,n,t,"Line width",{step:.5,min:.5,def:p("lineWidth")})}
        </div>
        ${x.style==="bars"?h`
          <div class="fgroup">
          <div class="grid2">
            ${ee("Corner radius",In(x.barRadius),E=>T(V=>{let ge=Math.max(0,E??aa);ge===aa?delete V.barRadius:V.barRadius=ge},"barradius"),{step:.5,min:0,def:In(d.barRadius),unit:"pt"})}
          </div>
          ${Fe("Round top only",Ln(x.barCorners)==="top",E=>T(V=>{E?V.barCorners="top":delete V.barCorners}),Ln(d.barCorners)==="top")}
          ${nn(e)}
          <div class="hint">Round top only rounds the end away from the baseline, so a bar hanging
            below zero rounds its bottom.</div>
          </div>
          <div class="fgroup">
          ${En.fill===void 0?m:Nu(En.fill,x.fillColorHex,E=>T(V=>{E===void 0?delete V.fillColorHex:V.fillColorHex=E},"fillcol"))}
          ${x.style==="bars"?m:Cl("Area gradient",x.areaFill,E=>T(V=>{if(E===void 0){delete V.areaFill;return}V.areaFill=E,V.fillColorHex=Ut(E,0)},"areafill"),()=>({kind:"linear",stops:[{at:0,colorHex:x.fillColorHex??x.colorSlot.baseColorHex},{at:1,colorHex:x.fillColorHex??x.colorSlot.baseColorHex}]}))}
          ${Fe("Border",x.barBorderWidth!==void 0,E=>T(V=>{E?V.barBorderWidth=1:delete V.barBorderWidth}),!1)}
          ${x.barBorderWidth===void 0?m:h`
            ${ee("Border width",x.barBorderWidth,E=>T(V=>{V.barBorderWidth=Math.min(Math.max(E??1,0),es)},"barborderw"),{step:.5,min:0,max:es,def:1,unit:"pt"})}
            ${En.border===void 0?m:Nu(En.border,x.barBorderColorHex,E=>T(V=>{E===void 0?delete V.barBorderColorHex:V.barBorderColorHex=E},"barbordercol"))}
            ${Fe("Open at base",x.barBorderOpenBase===!0,E=>T(V=>{E?V.barBorderOpenBase=!0:delete V.barBorderOpenBase}),!1)}`}
          ${nn(e)}
          <div class="hint">The border is drawn inside each bar, so bars keep their size. A highlighted
            bar fills and borders in its highlight colour.${x.barBorderOpenBase===!0?" Open at base leaves the border off the edge on the baseline, so a bar hanging below zero leaves its top open.":" Open at base leaves the border off the edge on the baseline."}${x.coloring==="bands"?" Each band can set its own fill and border below.":""}</div>
          </div>`:h`
          <div class="fgroup">
          ${ne("Curve",x.curve??"straight",r1,E=>T(V=>{E==="straight"?delete V.curve:V.curve=E}),{titles:{straight:"A straight line from each reading to the next",smooth:"A smooth line that never rises past the highest reading or dips under the lowest",step:"Each reading holds flat until the next one, the way a state does"},def:d.curve??"straight"})}
          ${nn(e)}
          </div>
          ${x.style==="area"?h`
            <div class="fgroup">
            ${ne("Fill",An(x.fillStyle),o1,E=>T(V=>{E==="flat"?delete V.fillStyle:V.fillStyle=E}),{titles:{flat:"One even wash under the line",fade:"Strongest at the top of the plot, fading to clear at the baseline"},def:An(d.fillStyle)})}
            ${En.fill===void 0?m:Nu(En.fill,x.fillColorHex,E=>T(V=>{E===void 0?delete V.fillColorHex:V.fillColorHex=E},"fillcol"))}
            ${nn(e)}
            </div>`:m}`}
        <div class="fgroup">
        <div class="grid2">
          ${ne("Scale",x.scale,l1,E=>T(V=>{V.scale=E}),{titles:{auto:"The plot stretches to fit the readings it has",fixed:"The plot always runs from Min to Max"},def:d.scale})}
          ${ne("Baseline",x.baseline,d1,E=>T(V=>{V.baseline=E}),{def:d.baseline})}
        </div>
        ${Ul.length===0?m:$e("Same scale as",go?x.scaleFrom:"",[["","Its own"],...Ul.map(E=>[E.payload.id,Ce(E,_p)])],E=>T(V=>{E?V.scaleFrom=E:delete V.scaleFrom}),{def:""})}
        ${go?h`<div class="hint keep">This chart is drawn against that one's range, so the two read as one
              plot. Give them the same frame and each keeps its own readings, colour, style and
              numbers. Scale, Min and Max above are ignored while a chart is picked here.</div>`:m}
        ${!go&&x.scale==="fixed"?h`<div class="grid2">
              ${ee("Min",x.minValue,E=>T(V=>{V.minValue=E??0},"cmin"),{def:d.minValue})}
              ${ee("Max",x.maxValue,E=>T(V=>{V.maxValue=E??100},"cmax"),{def:d.maxValue})}
            </div>`:m}
        <div class="hint">${x.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        </div>
        <div class="field"><span>Series</span>
          <div class="row-acts">
            <button class="small" title="Add a second chart layer on this frame, drawn against this chart's range"
              @click=${()=>{let E;e.update(V=>{E=Sf(V,a,ge=>Ce(ge,_p))}),E&&e.selectLayer(E)}}>${D("plus")}<span>Add a second series</span></button>
          </div>
        </div>
        <div class="fgroup">
        ${ne("Colour",x.coloring,Wu,E=>T(V=>{V.coloring=E,E==="bands"&&V.bands.length===0&&(V.bands=El(Dt))}),{def:d.coloring})}
        ${En.main===void 0?m:g(En.main)}
        ${x.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${x.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${Rl(x,x.colorSlot.baseColorHex,T,Dt,x.style==="bars"?{...x.fillColorHex===void 0?{}:{fillHex:x.fillColorHex},...x.barBorderColorHex===void 0?{}:{borderHex:x.barBorderColorHex},border:x.barBorderWidth!==void 0}:void 0)}
          ${x.style==="area"?h`${Fe("Band fill",x.fillBands,E=>T(V=>{V.fillBands=E}),d.fillBands)}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:m}`:m}
        </div>`;let Wl=(E,V)=>qe(E,a).filter(ge=>ge.payload.chartAnchor?.at===V&&ge.payload.chartAnchor.place==="through"),Np=(E,V)=>qe(E,a).some(ge=>ge.payload.chartAnchor?.at===V),Dp={threshold:E=>Wl(E,"threshold"),now:E=>Wl(E,"now"),zero:E=>Wl(E,"zero"),times:E=>Vn(E,a),dots:E=>Ri(E,a),grid:E=>Mi(E,a)},Vx={threshold:E=>{Np(E,"threshold")?mi(E,a,"threshold"):df(E,a,x.thresholdValue??tp(Dt))},now:E=>{Np(E,"now")?mi(E,a,"now"):cf(E,a,!0)},zero:E=>{dc(E,a)},times:E=>{Ei(E,a)},dots:E=>{sc(E,a)},grid:E=>{lc(E,a)}},Zi={};ki(x)||(Zi.times=Me&&j?"Clock times need evenly spaced readings. Set Points to Average.":"Clock times need a recorded span. Set Draw to Recorded history."),x.style==="bars"&&(Zi.dots="Dots need a line or area chart. Set Style to Line or Area.");let Kl=E=>Dp[E](e.config).length>0;y={};for(let[E,V]of Object.entries(Zi))y[`draw:${E}`]=V;let Ux=([E,V])=>{let ge=Kl(E),yo=ge?void 0:Zi[E],jl=`draw:${E}`;return h`<div class="xr-row" role="row" data-extra=${jl}>
          <span role="cell"><span class="xr-name">${V}</span></span>
          <span role="cell"></span>
          <span role="cell"><button type="button" class="xtog ${ge?"on":""}" role="switch" aria-checked=${ge?"true":"false"}
            aria-label=${V} ?disabled=${yo!==void 0} data-extra=${jl}
            title=${lp(jl,yo??(ge?`Remove the ${V.toLowerCase()} from this chart`:`Add ${V.toLowerCase()} to this chart`))}
            @click=${()=>e.update(ql=>{if(ge)for(let Wx of Dp[E](ql))Se(ql,Wx.payload.id);else Vx[E](ql)})}>${ge?h`<span aria-hidden="true">✓</span>`:D("plus")}</button></span>
          <span role="cell"></span>
        </div>`};b=h`
        <div class="field list-field"><span>On the plot</span>
          <div class="xreadings" role="table" aria-label="On the plot" @pointerover=${_a} @focusin=${_a}>
            <div class="xr-row xr-head" role="row">
              <span role="columnheader"><span class="xr-name">Layer</span></span><span role="columnheader"></span>
              <span role="columnheader">Show</span><span role="columnheader"></span>
            </div>
            ${pl.map(Ux)}
          </div>
        </div>
        ${pl.filter(([E])=>Zi[E]!==void 0&&!Kl(E)).map(([E])=>h`<div class="hint keep">${Zi[E]}</div>`)}
        ${Kl("zero")&&!Bx?h`<div class="hint warn">These readings never cross zero, so the zero line is not drawn.</div>`:m}
        ${nn(e)}`;break}case"timeline":{let x=n.payload,T=(Be,Me)=>o(Bl=>Be(Bl.payload),Me),P=d.historyMinutes,C=x.value.kind.kind==="entityState",_=st(x),B=_===void 0?void 0:e.historySeries(_),j=Lt(x)*60,se=Hr(B??"",Gn),ve=ju(a,x.historyMinutes),ft=x.value.kind.kind==="entityState"?x.value.kind.entityId:void 0,Ge=x.aggregate!==void 0,Rt=Ge?ca[rs]??[]:g1(se,j,ft===void 0?void 0:e.hass.states[ft]?.state,ft?.split(".")[0]);k=h`
        ${y1(x,T,r)}
        ${Ge?b1(e,x,T,r):h`
            ${he(e,x.value,Be=>T(Me=>{Me.value=Be},"value"),{label:"States",noShare:!0,key:`${r}-value`})}
            ${C?m:h`<div class="hint warn">A timeline draws an entity's recorded
              past, so it needs one named above. A typed-in value, a template or a shared value has no
              past to read, and this layer stays blank until States names an entity.</div>`}`}
        <div class="fgroup">
        ${zu(a,x.historyMinutes,P,Be=>T(Me=>{Me.historyMinutes=Be}))}
        ${ve?Ou(x.historyMinutes,Be=>T(Me=>{Me.historyMinutes=Be},"span")):m}
        <div class="hint">Every state the recorder holds in that span, oldest at the left, each run as
          wide as the time it lasted. At most ${Gn} changes are drawn, and a
          busier span keeps its newest.</div>
        ${C&&B===void 0?h`<div class="hint keep">Reading the history…</div>`:m}
        ${C&&B===""?h`<div class="hint warn">Nothing recorded for ${Ge?"these entities":"this entity"}
            in that span. Either ${Ge?"they are":"it is"} excluded from the recorder, or
            ${Ge?"none of them have":"it has not"} been seen in that long.</div>`:m}
        </div>
        ${se.length>0?h`<div class="field readout"><span>Reads</span><span class="readout-v"><span class="nums">${bS(se,j)}</span></span></div>`:m}
        ${yS(se)?h`<div class="hint warn">This entity reports numbers, so every reading is its own
            state and the strip is one colour with a hairline wherever it dropped out. A timeline is
            for states that are words, like on and off, open and closed, home and away. For a
            number's past, use a Chart layer instead.</div>`:m}`,S=h`
        <div class="hint">Each row is a state and the colour its runs draw in, checked top to bottom.
          Case and surrounding space are ignored, so <code>Home</code> matches <code>home</code>. A
          state no row names takes the colour underneath.</div>
        ${x1(x,T,Rt,`wa-tl-states-${r.replace(/[^a-z0-9]/gi,"")}`)}
        ${Rt.length>2?h`<div class="hint keep">Seen in this span: <span class="nums">${Rt.filter(Be=>Be!=="unavailable"&&Be!=="unknown").join(", ")}</span>. Click into a State box to pick one.</div>`:m}
        <div class="grid2">
          ${ee("Gap",x.gap,Be=>T(Me=>{Me.gap=Math.min(os,Math.max(0,Be??0))},"tgap"),{step:.5,min:0,max:os,def:d.gap,unit:"pt"})}
          ${ee("Corner radius",x.cornerRadius,Be=>T(Me=>{Me.cornerRadius=Math.max(0,Be??0)},"tradius"),{step:.5,min:0,def:d.cornerRadius,unit:"pt"})}
        </div>
        <div class="hint">A gap is taken off the right of each run, so the strip still ends flush with
          the frame and the newest state keeps the edge. 0 draws one continuous bar, which is what a
          door or a light usually wants.</div>
`;break}case"shape":k=h`<div class="grid2">
          ${ne("Shape",n.payload.kind,[["roundedRectangle","Rounded"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"],["line","Line"]],x=>o(T=>{T.payload.kind=x}),{titles:{roundedRectangle:"Rounded rectangle",line:"A rule along the frame's long side"},def:d.kind})}
          ${n.payload.kind==="roundedRectangle"?ee("Corner radius",n.payload.cornerRadius,x=>o(T=>{T.payload.cornerRadius=x??6},"radius"),{step:.5,min:0,def:d.cornerRadius,unit:"pt"}):m}
        </div>
        ${n.payload.kind==="line"?gS(t,l,c):m}`,S=n.payload.kind==="line"?ee("Thickness",n.payload.thickness,x=>o(T=>{T.payload.thickness=x??1},"thick"),{step:.5,min:.5,def:d.thickness,unit:"pt"}):h`
        <div class="fgroup">
        ${Cl("Gradient",n.payload.fill,x=>o(T=>{let P=T.payload;if(x===void 0){delete P.fill;return}P.fill=x,P.colorSlot.baseColorHex=Ut(x,0)},"fill"),()=>({kind:"linear",stops:[{at:0,colorHex:n.payload.colorSlot.baseColorHex},{at:1,colorHex:n.payload.colorSlot.baseColorHex}]}))}
        ${ye("Border colour",n.payload.borderColorHex,x=>o(T=>{x===void 0?delete T.payload.borderColorHex:T.payload.borderColorHex=x},"border"),!0,null)}
        ${n.payload.borderColorHex!==void 0?ee("Border width",n.payload.borderWidth,x=>o(T=>{T.payload.borderWidth=x??1},"bw"),{step:.5,min:0,def:d.borderWidth,unit:"pt"}):m}
        </div>`;break;case"image":{let x=n.payload,T=(B,j)=>o(se=>B(se.payload),j),P=x.entity.entityId?e.hass.states[x.entity.entityId]?.attributes?.entity_picture:void 0,C=typeof P=="string"?P:void 0,_=C!==void 0&&!C.startsWith("/");k=h`
        ${ne("Source",x.source,[["camera","Camera"],["entityPicture","Entity picture"],["inline","Upload"]],B=>e.update(j=>{let se=j.elements.find(ve=>ve.payload.id===x.id);if(se?.kind==="image"&&(fb(se.payload,B),B==="inline"))for(let ve of fs(j,x.id))Se(j,ve.payload.id)},"img-source"),{titles:{camera:"A snapshot from a camera entity",entityPicture:"The picture an entity already carries: a person's photo, cover art, a weather icon",inline:"A picture you upload, carried in the complication itself"},def:d.source})}
        ${x.source==="inline"?e1(e,x,t,T):x.source==="camera"?h`
            ${x.entity.entityId&&!x.entity.entityId.startsWith("camera.")?h`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera. Switch the source to Entity picture to use this entity's own photo.</div>`:m}
            <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`:h`
            ${x.entity.entityId&&C===void 0?h`<div class="hint warn">This entity has no picture right now, so the layer stays blank. Anything with an <code>entity_picture</code> works: a person, a media player playing something with cover art, a weather entity.</div>`:m}
            ${_?h`<div class="hint warn">This picture is hosted outside Home Assistant, so the watch cannot fetch it.</div>`:m}
            <div class="hint">The watch fetches the entity's own picture on refresh and shows the cached copy in between. This preview shows it live.</div>`}`,S=h`
        <div class="fgroup">
        ${ne("Picture",x.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],B=>T(j=>{j.contentMode=B}),{titles:{fill:"Cover the frame, cropping what does not fit",fit:"Show the whole picture, with space around it"},def:d.contentMode})}
        ${an("Zoom",x.zoom,B=>T(j=>{j.zoom=B},"zoom"),{min:tu,max:4,step:.05,def:1,format:B=>`${B.toFixed(2)}x`,unit:"x"})}
        ${an("Pan left/right",x.panX,B=>T(j=>{j.panX=B},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${an("Pan up/down",x.panY,B=>T(j=>{j.panY=B},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class=${x.contentMode==="fit"&&x.zoom===1?"hint keep":"hint"}>${pS(x)}</div>
        </div>
        ${ee("Corner radius",x.cornerRadius,B=>T(j=>{j.cornerRadius=Math.max(0,B??ua)},"imgradius"),{step:1,min:0,def:ua,unit:"pt"})}`;break}case"tap":{k=h`
        ${sp(e,n.payload,(x,T)=>o(P=>x(P.payload),T),r)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}case"chartTimes":{let x=n.payload,T=(B,j)=>o(se=>B(se.payload),j),P=e.config.elements.find(B=>B.payload.id===x.chart),C=P?.kind==="chart"||P?.kind==="timeline"?P:void 0,_=C?.kind==="timeline"?"timeline":"chart";k=h`
        <div class="field readout"><span>${C?.kind==="timeline"?"Timeline":"Chart"}</span><span class="readout-v">${C?h`<button class="small" title=${`Select that ${_}`} @click=${()=>e.selectLayer(C.payload.id)}>${Ce(C,me(e))}</button>`:"None"}</span></div>
        ${C===void 0?h`<div class="hint warn">The chart or timeline these times belonged to is gone, so this layer draws nothing.</div>`:C.kind==="timeline"?st(C.payload)===void 0?h`<div class="hint warn">That timeline names no entity yet, so it has no span to label and
                  this layer draws nothing.</div>`:m:ki(C.payload)?m:h`<div class="hint warn">That chart has no evenly spaced span to label, so this layer draws
                  nothing. Clock times are drawn when its Draw is Recorded history with Points on Average,
                  or Long-term statistics.</div>`}
        <div class="hint">The clock times of that ${_}'s span, spread across this layer's width and centred
          in its height. Move and size it like any other layer.</div>`,S=$S(x,T,d,"ct",h`
        <div class="hint">Evenly spaced from the start of the ${_}'s span to now. Auto follows the watch's
          own clock and drops the minutes past a three hour span.</div>`);break}case"imageTime":{let x=n.payload,T=e.config.elements.find(C=>C.payload.id===x.image),P=T?.kind==="image"?T:void 0;k=h`
        <div class="field readout"><span>Picture</span><span class="readout-v">${P?h`<button class="small" title="Select that picture" @click=${()=>e.selectLayer(P.payload.id)}>${Ce(P,me(e))}</button>`:"None"}</span></div>
        ${P===void 0?h`<div class="hint warn">The picture this time belonged to is gone, so this layer draws nothing.</div>`:m}
        <div class="hint">The time that picture was fetched, not the time now: a picture that stops updating
          keeps its old time, so a stale one reads as stale. The watch shows nothing here until the picture
          has been fetched once. Move and size it like any other layer: the chip grows to fill the frame.</div>`;break}case"chartDots":{let x=n.payload,T=(j,se)=>o(ve=>j(ve.payload),se),P=e.config.elements.find(j=>j.payload.id===x.chart),C=P?.kind==="chart"?P:void 0,_=C===void 0?void 0:_e(e.config,t,C).size??C.payload.lineWidth,B=_===void 0?void 0:Math.round(_*18)/10;k=h`
        ${Qy(e,C)}
        ${C===void 0?h`<div class="hint warn">The chart these dots belonged to is gone, so this layer draws nothing.</div>`:C.payload.style==="bars"?h`<div class="hint warn">That chart draws bars, so this layer draws nothing. Dots are drawn on a
                line or area chart.</div>`:m}
        <div class="hint">This layer always sits on its chart: it draws in the chart's box whatever its own frame
          says, with a dot on each reading the chart draws.</div>
        ${nn(e)}`,S=h`
        ${ne("Dots",x.dots,mb,j=>T(se=>{se.dots=j}),{titles:{auto:"A dot on every reading while they sit far enough apart to tell apart, none on a crowded chart",all:"A dot on every reading"},def:"auto"})}
        <div class="grid2">
          ${ee("Dot size",x.size??B,j=>T(se=>{let ve=Ot(j);ve===void 0||ve===B?delete se.size:se.size=ve},"dotsize"),{step:.5,min:1,max:12,...B===void 0?{}:{def:B},unit:"pt"})}
          ${Zu("Dot colour",x.colorHex,"Series colour",j=>T(se=>{j===void 0?delete se.colorHex:se.colorHex=j},"dotcol"))}
        </div>
        <div class="hint">Auto leaves the dots off once the readings sit too close to tell apart. Left alone, a dot
          is a little wider than the chart's line and takes the colour the series has at its reading.</div>`;break}case"chartGrid":{let x=n.payload,T=(_,B)=>o(j=>_(j.payload),B),P=e.config.elements.find(_=>_.payload.id===x.chart),C=P?.kind==="chart"?P:void 0;k=h`
        ${Qy(e,C)}
        ${C===void 0?h`<div class="hint warn">The chart these grid lines belonged to is gone, so this layer draws nothing.</div>`:m}
        <div class="hint">This layer always sits on its chart: it draws across the chart's plot whatever its own
          frame says. Where it sits in Layers decides whether the lines are behind the series or in front.</div>
        ${nn(e)}`,S=h`
        <div class="grid2">
          ${ee("Lines",x.lines,_=>T(B=>{B.lines=bi(_??Nn)},"lines"),{step:1,min:1,max:4,def:Nn})}
          ${ee("Thickness",x.thickness,_=>T(B=>{B.thickness=xi(_??_n)},"thick"),{step:.25,min:No,max:Do,def:_n,unit:"pt"})}
        </div>
        ${ye("Colour",x.colorHex,_=>T(B=>{B.colorHex=_??cn},"gridcol"),!1,cn)}
        <div class="hint">Equal rows across the plot, never on its top or bottom edge.</div>`;break}case"list":{let x=(T,P)=>o(C=>T(C.payload),P);k=h`
        ${V1(e,n.payload,x,r)}
        ${nn(e)}`,S=h`
        ${K1(e,n,t,x)}
        <div class="chips">
          <button class="small" title="Add a hidden line of text that shows only when this list has nothing to draw"
            @click=${()=>{let T;e.update(P=>{T=Z1(P,a,t)}),T&&e.selectLayer(T)}}>Add an empty state</button>
        </div>`;break}}let R=f||Wi(n)===void 0?void 0:g(n.kind==="shape"?"Fill colour":n.kind==="text"&&It(n.payload)?"Layer colour":"Colour"),O=n.kind!=="tap"&&e.config.supportedFamilies.some(Jt)?XS(n.payload.accentGroup??"primary",x=>o(T=>{x==="accent"?T.payload.accentGroup="accent":delete T.payload.accentGroup},"accent-group")):void 0,F=bs(e.config,n),z=F?{kind:{kind:"entityState",...F}}:void 0,$=n.kind==="text"&&(n.payload.parts?.length??0)>0?n.payload.parts:void 0,A=jS[n.kind],W=n.kind==="tap"?Zy[n.kind]:[...Zy[n.kind],...qS],Q=bl(n.payload,d,A),I=n.kind==="text"?"fontSize":n.kind==="icon"?"size":n.kind==="gauge"||n.kind==="chart"?"lineWidth":void 0,G=e.config.perFamily[t]?.placements[a]?.size!==void 0,J=bl(n.payload,d,W)||I!==void 0&&s.size!==void 0&&s.size!==d[I],te=Bn(e.config,a),M=(x,T)=>()=>o(P=>xl(P.payload,d,x),T),q=h`<section class="sec name-sec" data-open="true" style=${`--c:${oe.place}`}>
    <div class="sec-h pinned">
      <span class="swatch">${D("text")}</span>
      <h4>Name${oo(n.payload.name===void 0?void 0:{atDefault:!1,title:"Go back to the automatic title",reset:()=>o(x=>{delete x.payload.name},"reset-name")})}</h4>
      <input type="text" aria-label="Layer name" .value=${n.payload.name??""} placeholder=${Wb(n,me(e))}
        @input=${He(x=>o(T=>{let P=rT(x);P===void 0?delete T.payload.name:T.payload.name=P},"name"))} />
    </div>
  </section>`;return h`
    ${q}
    ${Re(e,"content","Content",h`${dS(n)?Pb(e,n,r):m}${k}`,{color:oe.content,icon:"content",summary:rp(e,n),...Q?{reset:()=>o(x=>{xl(x.payload,d,A),x.kind==="text"&&Kr(x.payload.rules)},"reset-content")}:{}})}
    ${S===void 0&&R===void 0&&O===void 0&&n.kind==="tap"?m:Re(e,"look",n.kind==="image"?"Picture":"Look",h`${S??m}${R??m}${O??m}${n.kind==="tap"?m:YS(n,o)}`,{color:oe.look,icon:n.kind==="image"?"image":"look",...Ml(n)?{summary:Ml(n)}:{},...J?{reset:()=>e.update(x=>{let T=Ki(x,a);T&&xl(T.payload,d,W),G&&Ae(x,t,a,{},!0)})}:{}})}
    ${n.kind==="chart"?Re(e,"numbers","Extras",tT(e,n,b,y,w),{color:oe.numbers,icon:"text",summary:eT(e,n),...te.length>0||qe(e.config,a).length>0||Vn(e.config,a).length>0||Ri(e.config,a).length>0||Mi(e.config,a).length>0||bl(n.payload,d,eb)?{reset:()=>e.update(x=>{for(let P of Bn(x,a))Se(x,P.payload.id);for(let P of qe(x,a))Se(x,P.payload.id);for(let P of Vn(x,a))Se(x,P.payload.id);for(let P of Ri(x,a))Se(x,P.payload.id);for(let P of Mi(x,a))Se(x,P.payload.id);let T=x.elements.find(P=>P.payload.id===a);T&&xl(T.payload,d,eb)})}:{}}):m}
    ${n.kind==="timeline"||n.kind==="image"&&n.payload.source!=="inline"?KS(e,n):m}
    ${n.kind==="list"?Re(e,"row","Row",q1(e,n,(x,T)=>o(P=>x(P.payload),T)),{color:oe.numbers,icon:"content",summary:`${n.payload.template.length} of ${pa} layers`}):m}
    ${RS(n)?Re(e,"level","Fill by value",MS(e,n,r,o),{color:oe.numbers,icon:"gauge",summary:ES(n),...bl(n.payload,d,Xy)?{reset:M(Xy,"reset-level")}:{}}):m}
    ${Re(e,"states","States",Qb(e,n.payload.rules,n.kind,x=>x.elements.find(T=>T.payload.id===a)?.payload.rules,`rules-${a}`,z,$),{color:oe.states,icon:"states",summary:Gr(n.payload.rules).replace(/\.$/,""),...n.payload.rules.length>0?{reset:()=>o(x=>{x.payload.rules=[]})}:{}})}
    ${i.placement===!1?m:vS(e,n,t)}
    ${i.tap===!1?m:kS(e,n)}`}function KS(e,n){let t=n.payload.id,i=n.kind==="timeline",a=i?Vn(e.config,t):fs(e.config,t),r=i?"Clock times":"Timestamp",o=e.activeFamily,s=()=>e.update(p=>{let f=p.elements.find(b=>b.payload.id===t);if(!f)return;let g=f.payload.frame;f.payload.frame={..._e(p,o,f).frame},i?Ei(p,t):oc(p,t,ue[o==="inline"?"rectangular":o]),f.payload.frame=g}),l=a.length>0,c=a.map(p=>({el:p,lead:D("clock"),title:r,kind:i?"Times":"Timestamp"})),d=i?"timeline:times":"image:time",u=h`
    ${Ub(i?"timeline":"image")}
    <div class="field list-field"><span>Draw</span>
      <div class="adders" @pointerover=${_a} @focusin=${_a}>
        <button class="small ${l?"on":""}" ?disabled=${l} aria-pressed=${l?"true":"false"} data-extra=${d}
          title=${lp(d,l?`${r} is on this ${i?"timeline":"picture"}. Remove it in the list below.`:`Add ${r.toLowerCase()}`)}
          @click=${s}>${l?h`<span aria-hidden="true">✓</span>`:D("plus")}<span>${r}</span></button>
      </div>
    </div>
    <div class="hint">${i?"Adds the clock times of this timeline's span as their own layer in its group, so you can drag them anywhere and give them any size or colour.":"Adds the time the picture was fetched as its own layer in its group, so you can drag it anywhere, inside the picture or beside it."}</div>
    ${l?h`
      ${dp(e,c,{icon:"close",danger:!0,label:p=>`Delete this ${p}`,run:p=>e.update(f=>Se(f,p))})}
      <div class="hint">Click the row to open its main settings here. More settings selects that layer. The ×
        deletes it, and Undo brings it back.</div>`:m}`;return Re(e,"numbers","Extras",u,{color:oe.numbers,icon:"clock",summary:l?`${r} layer`:"None yet",...l?{reset:()=>e.update(p=>{for(let f of a)Se(p,f.payload.id)})}:{}})}var jS={text:["value","countdown","parts"],icon:["symbol","path"],gauge:["value","minValue","maxValue","total","minSource","maxSource"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","limit","takeFromEnd"],timeline:["value","historyMinutes"],shape:["kind","cornerRadius"],image:["entity","source"],tap:["action","openPageName"],chartTimes:[],chartDots:[],chartGrid:[],imageTime:[],list:["source","template"]},qS=["opacity","shadow"];function YS(e,n){let t=e.payload,i=t.shadow,a=(o,s)=>n(l=>{let c={...l.payload.shadow??ra};o(c),l.payload.shadow=c},s),r=e.kind==="text"&&i!==void 0&&i.dx===0&&i.dy===0&&i.radius>0&&e.payload.fontSize<10;return h`
    <div class="fgroup">
    ${an("Opacity",t.opacity??1,o=>n(s=>{let l=ur(o);l===1?delete s.payload.opacity:s.payload.opacity=l},"opacity"),{min:0,max:1,step:.05,def:1,format:o=>`${Math.round(o*100)}%`})}
    ${Fe("Shadow",i!==void 0,o=>n(s=>{o?s.payload.shadow={...ra}:delete s.payload.shadow},"shadow-on"),!1)}
    ${i===void 0?m:h`
      ${ye("Shadow colour",i.colorHex,o=>a(s=>{s.colorHex=o??cr},"shcol"),!1,cr)}
      ${an("Blur",i.radius,o=>a(s=>{s.radius=Sd(o)},"shrad"),{min:0,max:Cd,step:.5,def:ra.radius,unit:"pt"})}
      <div class="grid2">
        ${ee("Offset X",i.dx,o=>a(s=>{s.dx=Xa(o??0)},"shdx"),{step:.5,min:-fi,max:fi,def:ra.dx,unit:"pt"})}
        ${ee("Offset Y",i.dy,o=>a(s=>{s.dy=Xa(o??0)},"shdy"),{step:.5,min:-fi,max:fi,def:ra.dy,unit:"pt"})}
      </div>
      <div class="hint">Both offsets at zero makes a glow. On a tinted face the shadow takes the tint, like every other colour.</div>
      ${r?h`<div class="hint warn">A glow under text this small reads as a smudge on the watch.</div>`:m}`}
    </div>`}function XS(e,n){return h`${ne("Tinted group",e,[["primary","Default"],["accent","Accent"]],t=>n(t),{def:"primary"})}
    <div class="hint">On a tinted Home Screen the accent group takes the lighter of the two colours. Full colour is unchanged.</div>`}var Zy={text:["fontSize","fontWeight","colorSlot","alignment","lineLimit","monospacedDigits","arc","fontDesign","fontWidth","italic","minimumScale","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex"],icon:["size","colorSlot"],gauge:["style","lineWidth","trackColorHex","colorSlot","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","fill","ticks","labels"],chart:["style","scale","minValue","maxValue","baseline","barGap","lineWidth","coloring","bands","bandAboveColorHex","fillBands","curve","fillStyle","fillColorHex","areaFill","barRadius","barCorners","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","scaleFrom","colorSlot"],timeline:["bands","otherColorHex","gap","cornerRadius"],shape:["colorSlot","borderColorHex","borderWidth","thickness","fill"],image:["contentMode","zoom","panX","panY","cornerRadius"],tap:[],chartTimes:["timeLabelCount","labelSize","labelColorHex","hourCycle","minutes"],chartDots:["dots","size","colorHex"],chartGrid:["lines","colorHex","thickness"],imageTime:[],list:["rows","direction","columns","gap"]};function JS(e,n){let t=e.ticks??Ed(),i=e.labels??Rd(),a=(o,s)=>n(l=>{let c={...l.ticks??Ed()};o(c),Jo(c)?delete l.ticks:l.ticks=c},s),r=(o,s)=>n(l=>{let c={...l.labels??Rd()};o(c),Zo(c)?delete l.labels:l.labels=c},s);return h`
    <div class="fgroup">
    <div class="grid2">
      ${ee("Marks",t.count,o=>a(s=>{s.count=Math.max(0,Math.min(jo,Math.round(o??0)))},"tickn"),{step:1,min:0,max:jo,def:0})}
      ${t.count>0?ee("Mark length",t.length,o=>a(s=>{s.length=Math.max(1,Math.min(qo,o??hn))},"ticklen"),{step:.5,min:1,max:qo,def:hn,unit:"pt"}):m}
    </div>
    ${t.count>0?h`
      ${ye("Mark colour",t.colorHex,o=>a(s=>{s.colorHex=o??pn},"tickcol"),!1,pn)}
      ${ee("Long every",t.majorEvery,o=>a(s=>{s.majorEvery=Math.max(0,Math.round(o??0))},"tickmaj"),{step:1,min:0,def:0})}
      <div class="hint">Marks are spread across the scale. Long every 5 draws every fifth one
        half as long again, which is what makes a dial countable. 0 draws them all the same.</div>`:m}
    </div>
    <div class="fgroup">
    ${Fe("End numbers",i.show,o=>r(s=>{s.show=o},"lblshow"),!1)}
    ${i.show?h`
      <div class="grid2">
        ${ee("Text size",i.size,o=>r(s=>{s.size=Math.max(Yo,Math.min(Xo,o??mn))},"lblsize"),{step:.5,min:Yo,max:Xo,def:mn,unit:"pt"})}
        ${ye("Text colour",i.colorHex,o=>r(s=>{s.colorHex=o??fn},"lblcol"),!1,fn)}
      </div>
      <div class="hint">Min and max at the two ends of the scale${e.style==="needle"?", and the reading itself under the pointer":""}.</div>`:m}
    </div>`}function Qy(e,n){return h`<div class="field readout"><span>Chart</span><span class="readout-v">${n?h`<button class="small" title="Select that chart" @click=${()=>e.selectLayer(n.payload.id)}>${Ce(n,me(e))}</button>`:"None"}</span></div>`}var eb=["highlight","highColorHex","lowColorHex","marker","highMarker","lowMarker","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes"];function sp(e,n,t,i){let a=n.action;return h`
    ${$e("Tap action",a.type,Q1,r=>t(o=>{o.action=Rb(r,o.action),r!=="openPage"&&(delete o.openPageId,delete o.openPageName)}))}
    ${"entityId"in a?h`
      ${rt(e,"Target",a,r=>t(o=>{o.action={type:a.type,...r}},"tap-entity"),`${i}-tap`)}
      ${Ku(e,r=>t(o=>{let s=o.action;"entityId"in s&&(o.action={type:s.type,entityId:r,displayName:"",domain:""})},"tap-entity"),"the target")}`:m}
    ${a.type==="callService"?Mb(e,a,(r,o)=>t(s=>{s.action=r},o),`${i}-tap`):m}
    ${a.type==="openPage"?Ab(e,n.openPageId,n.openPageName,(r,o)=>t(s=>{if(r===void 0){delete s.openPageId,delete s.openPageName;return}s.openPageId=r,o?s.openPageName=o:delete s.openPageName},"tap-page")):m}`}var ZS=24;function QS(e,n){let t=[],i=1/0;for(let r of de){if(!e.config.supportedFamilies.includes(r))continue;let o=$f(e.config,n,r);o&&(t.push(`${ae(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(t.length===0)return m;let a=i<ZS;return h`<div class="field readout"><span>Tap size</span><span class="readout-v">${t.join(" \xB7 ")}</span></div>
    ${a?h`<div class="hint warn">That is small for a wrist. Show the tap area and drag its corners out.</div>`:m}`}function eT(e,n){let t=n.payload,i=Bn(e.config,t.id),a=qe(e.config,t.id),r=Vn(e.config,t.id),o=Ri(e.config,t.id),s=Mi(e.config,t.id);if(i.length===0&&a.length===0&&r.length===0&&o.length===0&&s.length===0)return"None yet";let l=[...i.map(c=>{let d=c.payload.value.kind;return d.kind==="chartStat"?(Bt.find(([u])=>u===d.stat)?.[1]??"number").toLowerCase():"number"})];for(let c of a){let{at:d,place:u}=c.payload.chartAnchor,p=(Vt.find(([f])=>f===d)?.[1]??"reading").toLowerCase();l.push(u==="through"?`${p} line`:`${p} marker`)}for(let c of r)l.push("times layer");for(let c of o)l.push("dots layer");for(let c of s)l.push("grid layer");return l.join(" \xB7 ")}function tT(e,n,t,i={},a=[]){let r=n.payload.id,o=me(e),s=Bn(e.config,r),l=Vn(e.config,r),c=Ri(e.config,r),d=Mi(e.config,r),u=qe(e.config,r),p={};for(let[$]of Bt){let A=e.resolve({kind:{kind:"chartStat",layer:r,stat:$}});A!==void 0&&A.trim()!==""&&(p[$]=A)}let f=a.filter($=>Number.isFinite($)),g=n.payload.nowIndex===void 0?NaN:Number(e.resolve(n.payload.nowIndex)),b=Number.isFinite(g)&&a.length>0?Math.min(a.length-1,Math.max(0,Math.round(g))):void 0,y=b===void 0||!Number.isFinite(a[b])||f.length===0?void 0:yr(a[b],Math.max(...f)-Math.min(...f)),w={values:a,texts:p,...b===void 0?{}:{now:b},...n.payload.thresholdValue===void 0?{}:{threshold:n.payload.thresholdValue}},k=($,A)=>Bn($,r).filter(W=>W.payload.value.kind.kind==="chartStat"&&W.payload.value.kind.stat===A),S=($,A)=>qe($,r).filter(W=>W.payload.chartAnchor?.at===A&&W.payload.chartAnchor.place!=="through"),R=($,A,W,Q,I,G,J)=>h`
    <button type="button" class="xtog ${A>0?"on":""}" role="switch" aria-checked=${A>0?"true":"false"}
      aria-label=${I} data-extra=${$}
      title=${lp($,A===0?W:A===1?Q:`${Q}: all ${A} of them`)}
      @click=${()=>e.update(te=>{if(A>0)for(let M of J(te))Se(te,M.payload.id);else G(te)})}>${A>0?h`<span aria-hidden="true">✓</span>`:D("plus")}</button>`,O=h`<div class="xreadings" role="table" aria-label="Readings" @pointerover=${_a} @focusin=${_a}>
    <div class="xr-row xr-head" role="row">
      <span role="columnheader"><span class="xr-name">Reading</span></span><span role="columnheader"></span>
      <span role="columnheader">Number</span><span role="columnheader">Marker</span>
    </div>
    ${My.map($=>{let A=$.stat!==void 0?p[$.stat]:y,W=$.stat===void 0?"":(Bt.find(([G])=>G===$.stat)?.[1]??$.label).toLowerCase(),Q=$.marker==="now"?"the reading at now":`the ${(Vt.find(([G])=>G===$.marker)?.[1]??$.label).toLowerCase()}`,I=$.stat!==void 0?`number:${$.stat}`:$.marker!==void 0?`marker:${$.marker}`:void 0;return h`<div class="xr-row" role="row" data-extra=${I??m}>
        <span role="cell"><span class="xr-name">${$.label}</span></span>
        <span role="cell"><span class="xr-v nums">${A??""}</span></span>
        <span role="cell">${$.stat===void 0?m:R(`number:${$.stat}`,k(e.config,$.stat).length,`Print the ${W} as a number`,`Remove the ${W} number`,`${$.label} number`,G=>{rf(G,r,$.stat)},G=>k(G,$.stat))}</span>
        <span role="cell">${$.marker===void 0?m:R(`marker:${$.marker}`,S(e.config,$.marker).length,`Put a marker over ${Q}`,`Remove the marker over ${Q}`,`${$.label} marker`,G=>{ac(G,r,$.marker)},G=>S(G,$.marker))}</span>
      </div>`})}
  </div>`,F=[...s.map($=>({el:$,lead:e.resolve($.payload.value)??"--",title:Ce($,o),kind:"Number"})),...u.map($=>{let{at:A,place:W}=$.payload.chartAnchor,Q=Vt.find(([G])=>G===A)?.[1]??"Reading";if(W==="through")return{el:$,lead:A==="now"?"\u2502":"\u2500",title:A==="zero"?"Zero":Q,kind:"Line"};let I=$.kind==="text"?e.resolve($.payload.value)??"\u25CF":$.kind==="icon"?aT(e.resolve($.payload.symbol)):"\u25C6";return{el:$,lead:I,title:Q,kind:"Marker"}}),...l.map($=>({el:$,lead:D("clock"),title:"Clock times",kind:"Times"})),...c.map($=>({el:$,lead:D("chartDots"),title:"Reading dots",kind:"Dots"})),...d.map($=>({el:$,lead:D("chartGrid"),title:"Grid lines",kind:"Grid"}))],z=F.length;return h`
    <div class="hint keep">Each one you switch on is a layer in this chart's group.</div>
    ${Ub("chart",i,n.payload.style==="bars",w)}
    ${t??m}
    <div class="field list-field"><span>Readings</span>${O}</div>
    <div class="hint">A number is a text layer that prints the reading. A marker is an icon over it, pushed down
      rather than off the chart when the bar is tall. Newest, Change and Total start with the entity's unit.</div>
    ${z===0?m:h`
      <div class="shown-head">On this chart <span class="shown-count">${z}</span></div>
      ${dp(e,F,{icon:"close",danger:!0,label:$=>`Delete this ${$}`,run:$=>e.update(A=>Se(A,$))})}
      <div class="hint">Click a row to set its value, colour and size here. More settings selects that layer.
        On the preview, click right on a dot to pick the dots.</div>`}`}var no,Vb="wrist-assistant-extras-preview",Dl=(()=>{try{return window.localStorage.getItem(Vb)!=="off"}catch{return!0}})();function tb(e,n){Dl=e;try{window.localStorage.setItem(Vb,e?"on":"off")}catch{}Te(n)}function _a(e){if(!Dl)return;let n=e.target?.closest?.("[data-extra]")?.getAttribute("data-extra");!n||n===no||(no=n,Te(e.currentTarget))}function lp(e,n){return Dl?n:`${Hu(e)} ${n}.`}function Ub(e,n={},t=!1,i={}){if(!Dl)return h`<button class="link xprev-show" @click=${l=>tb(!0,l.currentTarget)}>
      ${D("show")}<span>Show preview</span></button>`;let a=e==="timeline"?"timeline:times":e==="image"?"image:time":void 0,r=no!==void 0&&Lu(no)===e?no:a,o=r===void 0?void 0:n[r],s=e==="image"?"picture":e;return h`<div class="xprev">
    <span class="well">${Fy(e,r,t,i)}</span>
    <span class="xprev-t">
      <b>${r===void 0?"Preview":Ay(r)}</b>
      <span>${r===void 0?`Point at a ${e==="chart"?"switch":"button"} below to see what it adds to the ${s}.`:Hu(r)}</span>
      ${o?h`<span class="xprev-why">${o}</span>`:m}
    </span>
    <button class="icon xprev-hide" title="Hide the preview" aria-label="Hide the preview"
      @click=${l=>tb(!1,l.currentTarget)}>${D("hide")}</button>
  </div>`}function dp(e,n,t){return h`<div class="chart-numbers">${bu(n,a=>a.el.payload.id,({el:a,lead:r,title:o,kind:s})=>{let l=a.payload.id,c=s.toLowerCase();return h`
    <div class="num-row">
      <details class="num-item"
        @pointerenter=${()=>e.peekLayer(l,!0)}
        @pointerleave=${()=>e.peekLayer(l,!1)}>
        <summary class="num-pick" title=${`Show the settings for this ${c}`}>
          <span class="num-lead">${r}</span>
          <span class="num-text"><span class="num-title">${o}</span><span class="num-kind">${s}</span></span>
          <span class="chev">${D("chevron")}</span>
        </summary>
        <div class="num-body">
          ${nT(e,a)}
          <div class="chips"><button class="small" title=${`Select this ${c} to see all of its settings`}
            @click=${()=>e.selectLayer(l)}><span>More settings</span></button></div>
        </div>
      </details>
      <button class="icon ${t.danger?"danger":""}" title=${t.label(c)} aria-label=${t.label(c)}
        @click=${()=>{e.peekLayer(l,!1),t.run(l)}}>${D(t.icon)}</button>
    </div>`})}</div>`}function nT(e,n){let t=n.payload.id,i=`quick-${t}`,a=e.activeFamily,r=(d,u)=>e.update(p=>{let f=p.elements.find(g=>g.payload.id===t);f&&d(f)},`${i}-${u}`),o=Le(n.kind).payload,s=Wi(n),l=s===void 0?m:ye("Colour",s,d=>r(u=>{Wi(u)!==void 0&&(u.payload.colorSlot.baseColorHex=d??"#FFFFFF")},"colour"),!1,o.colorSlot?.baseColorHex??"#FFFFFF"),c=n.payload.chartAnchor;switch(n.kind){case"text":{let d=n.payload.value.kind;return h`
        ${d.kind==="chartStat"?$e("Number",d.stat,[...Bt],u=>r(p=>{p.kind==="text"&&p.payload.value.kind.kind==="chartStat"&&(p.payload.value={...p.payload.value,kind:{...p.payload.value.kind,stat:u}})},"stat")):c||It(n.payload)?m:he(e,n.payload.value,u=>r(p=>{p.kind==="text"&&(p.payload.value=u)},"value"),{showResolved:!0,label:n.payload.countdown?"Until":"Text",key:`${i}-value`})}
        ${c&&c.place!=="through"?nb(e,t,c,r):m}
        <div class="grid2">
          ${ei(e,n,a,"Font size",{step:1,min:4,def:o.fontSize})}
          ${n.payload.countdown||It(n.payload)?m:l}
        </div>`}case"icon":return h`
        ${c?nb(e,t,c,r):fr(n.payload)?hb(n.payload,(d,u)=>r(p=>{p.kind==="icon"&&d(p.payload)},u??"svg-path")):he(e,n.payload.symbol,d=>r(u=>{u.kind==="icon"&&(u.payload.symbol=d)},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${i}-symbol`,setSymbolPath:d=>r(u=>{u.kind==="icon"&&(d?u.payload.path=d:delete u.payload.path,delete u.payload.viewBox)},"symbol")})}
        <div class="grid2">
          ${ei(e,n,a,"Icon size",{step:1,min:4,def:o.size})}
          ${l}
        </div>`;case"shape":return n.payload.kind!=="line"?h`
          <div class="grid2">
            ${n.payload.kind==="roundedRectangle"?ee("Corner radius",n.payload.cornerRadius,d=>r(u=>{u.kind==="shape"&&(u.payload.cornerRadius=d??6)},"radius"),{step:.5,min:0,def:o.cornerRadius,unit:"pt"}):m}
            ${l}
          </div>`:h`
        ${c?zb(e,c,i):m}
        <div class="grid2">
          ${ee("Thickness",n.payload.thickness,d=>r(u=>{u.kind==="shape"&&(u.payload.thickness=d??1)},"thick"),{step:.5,min:.5,def:o.thickness,unit:"pt"})}
          ${l}
        </div>`;case"gauge":{let d=n.payload;return h`
        ${he(e,d.value,u=>r(p=>{p.kind==="gauge"&&(p.payload.value=u)},"value"),{showResolved:!0,label:"Reading",key:`${i}-value`})}
        <div class="grid2">
          ${d.style==="dots"?m:ei(e,n,a,"Line width",{step:.5,min:.5,def:o.lineWidth})}
          ${l}
        </div>`}case"chart":{let d=n.payload;return h`
        ${he(e,d.value,u=>r(p=>{p.kind==="chart"&&(p.payload.value=u)},"value"),{label:"Readings",noShare:!0,key:`${i}-value`})}
        ${ne("Style",d.style,gb,u=>r(p=>{p.kind==="chart"&&(p.payload.style=u)},"style"),{def:o.style})}
        <div class="grid2">
          ${d.style==="bars"?m:ei(e,n,a,"Line width",{step:.5,min:.5,def:o.lineWidth})}
          ${l}
        </div>`}case"timeline":return h`
        ${he(e,n.payload.value,d=>r(u=>{u.kind==="timeline"&&(u.payload.value=d)},"value"),{label:"States",noShare:!0,key:`${i}-value`})}`;case"image":{let d=n.payload;return h`
        ${ne("Source",d.source,[["camera","Camera"],["entityPicture","Entity picture"],["inline","Upload"]],u=>r(p=>{p.kind==="image"&&fb(p.payload,u)},"source"),{def:o.source})}
        ${ne("Picture",d.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],u=>r(p=>{p.kind==="image"&&(p.payload.contentMode=u)},"mode"),{def:o.contentMode})}`}case"tap":return sp(e,n.payload,(d,u)=>r(p=>{p.kind==="tap"&&d(p.payload)},u??"action"),i);case"chartTimes":{let d=n.payload;return h`
        ${an("Times",d.timeLabelCount,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.timeLabelCount=Math.max(0,Math.min($i,Math.round(u))))},"count"),{min:0,max:$i,step:1,def:o.timeLabelCount,format:u=>u<=0?"None":String(Math.round(u)),range:!1})}
        <div class="grid2">
          ${ee("Time size",d.labelSize,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.labelSize=Math.min(On,Math.max(zn,u??bt)))},"size"),{step:.5,min:zn,max:On,def:o.labelSize,unit:"pt"})}
          ${ye("Time colour",d.labelColorHex,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.labelColorHex=u??xt)},"colour"),!1,o.labelColorHex)}
        </div>`}case"imageTime":return h``;case"chartDots":{let d=n.payload,u=e.config.elements.find(g=>g.payload.id===d.chart),p=u?.kind==="chart"?_e(e.config,a,u).size??u.payload.lineWidth:void 0,f=p===void 0?void 0:Math.round(p*18)/10;return h`
        ${ne("Dots",d.dots,mb,g=>r(b=>{b.kind==="chartDots"&&(b.payload.dots=g)},"mode"),{def:"auto"})}
        <div class="grid2">
          ${ee("Dot size",d.size??f,g=>r(b=>{if(b.kind!=="chartDots")return;let y=Ot(g);y===void 0||y===f?delete b.payload.size:b.payload.size=y},"size"),{step:.5,min:1,max:12,...f===void 0?{}:{def:f},unit:"pt"})}
          ${Zu("Dot colour",d.colorHex,"Series colour",g=>r(b=>{b.kind==="chartDots"&&(g===void 0?delete b.payload.colorHex:b.payload.colorHex=g)},"colour"))}
        </div>`}case"chartGrid":{let d=n.payload;return h`
        <div class="grid2">
          ${ee("Lines",d.lines,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.lines=bi(u??Nn))},"lines"),{step:1,min:1,max:4,def:Nn})}
          ${ee("Thickness",d.thickness,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.thickness=xi(u??_n))},"thick"),{step:.25,min:No,max:Do,def:_n,unit:"pt"})}
        </div>
        ${ye("Colour",d.colorHex,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.colorHex=u??cn)},"colour"),!1,cn)}`}default:return h`${l}`}}function nb(e,n,t,i){let a=Vt.filter(([r])=>un(r)||r===t.at);return h`
    <div class="grid2">
      ${$e("Reading",t.at,a,r=>i(o=>{o.payload.chartAnchor&&(o.payload.chartAnchor.at=r)},"at"))}
      ${$e("Sits",t.place,Oo.filter(([r])=>r!=="through"),r=>i(o=>{o.payload.chartAnchor&&(o.payload.chartAnchor.place=r)},"place"))}
    </div>`}function iT(e,n,t){if(n.kind==="tap")return m;let i=n.payload.id,a=lt(e.config,i)[0],r=(s,l)=>e.update(c=>{let d=c.elements.find(u=>u.kind==="tap"&&u.payload.attachedTo===i);d&&s(d.payload)},l?`${t}-${l}`:void 0),o=hc(e.config,n);return h`
    ${Fe("Tappable",a!==void 0,s=>e.update(l=>{s?ws(l,i):vs(l,i)}))}
    ${a?h`<div class="value-editor">
          ${sp(e,a.payload,r,`${t}-attached`)}
          <div class="field"><span>Tap area</span>
            <div class="chips">
              <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
                title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
                @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide":"Show"}</button>
              ${cs(a.payload.outset)?m:h`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                    @click=${()=>r(s=>{s.outset={...Bd}})}>${D("reset")}</button>`}
            </div>
          </div>
        </div>
        ${QS(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:h`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${bn(o)}</b>.</div>`}`}function ib(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function aT(e){return e===void 0?"\u25C6":e.includes("up")?"\u25B2":e.includes("down")?"\u25BC":e.startsWith("circle")?"\u25CF":"\u25C6"}function Ce(e,n){return e.payload.name?e.payload.name:Wb(e,n)}function rT(e){let n=e.trim();return n===""?void 0:n}function Wb(e,n){let t=e.payload.chartAnchor;if(t!==void 0){let i=Vt.find(([a])=>a===t.at)?.[1]??"Reading";return t.place==="through"?`${i} line`:`${i} marker`}switch(e.kind){case"text":return ib(Ne(e.payload.value,n));case"icon":return fr(e.payload)?"Custom SVG":ib(Ne(e.payload.symbol,n));case"gauge":return Ne(e.payload.value,n);case"chart":return Ne(e.payload.value,n);case"timeline":return Ne(e.payload.value,n);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{if(e.payload.source==="inline")return"picture";let i=e.payload.entity;return i.displayName||i.entityId||(e.payload.source==="camera"?"camera":"picture")}case"tap":{let i=e.payload.action,a="entityId"in i?i.displayName||i.entityId:i.type==="callService"?[i.serviceDomain,i.serviceName].filter(r=>r!=="").join("."):i.type==="openPage"&&e.payload.openPageName||"";return a?`${i.type} \xB7 ${a}`:i.type}case"chartTimes":return"Clock times";case"chartDots":return"Reading dots";case"chartGrid":return"Grid lines";case"imageTime":return"Timestamp";case"list":return"List"}}function Kb(e,n){let t=$t(e.config,n.id),i=me(e),a=(r,o)=>e.update(s=>{let l=s.groups?.find(c=>c.id===n.id);l&&r(l)},o?`group-${n.id}-${o}`:void 0);return Re(e,"content","Group",h`
    ${Ie("Name",n.name,r=>a(o=>{o.name=r},"name"))}
    ${Fe("Move as one",n.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${n.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. With the group selected, a drag still moves all of them. Lock it when the part is the way you want it."}</div>
    <div class="shown-head">Layers <span class="shown-count">${t.length}</span></div>
    ${dp(e,t.map(r=>({el:r,lead:D(r.kind),title:Ce(r,i),kind:ct[r.kind]})),{icon:"ungroup",label:r=>`Take this ${r} out of the group`,run:r=>e.update(o=>Tr(o,r,void 0))})}
    <div class="row-acts">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>ga(r,n.id))}>Ungroup</button>
    </div>
    <div class="hint">Click a row to open its main settings here. More settings selects that layer for the rest.
      The button beside a row takes that layer out of the group and keeps it on the face.</div>`,{color:oe.group,icon:"folder",summary:`${t.length} layers \xB7 ${n.locked?"moves as one":"unlocked"}`})}function jb(e,n){if(n==="inline")return oT(e);let t=e.config.perFamily[n];if(!t)return h`<div class="hint">No settings stored for ${ae(n)} yet.</div>
      <button class="small" @click=${()=>e.update(d=>{d.perFamily[n]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${ae(n)} settings</button>`;let i=(d,u)=>e.update(p=>d(p.perFamily[n]),u?`fam-${n}-${u}`:void 0),a=_l(e.config,n),r=Jt(n),o=t.backgroundColorHex?Ue(t.backgroundColorHex):r?"the system's widget material":"transparent",s=t.borderColorHex?`${t.borderWidth} pt ${Ue(t.borderColorHex)} border`:"no border",l=ye(r?"Tile background (blank = the system's widget material)":"Background (blank = transparent)",t.backgroundColorHex,d=>i(u=>{d===void 0?delete u.backgroundColorHex:u.backgroundColorHex=d},"bg"),!0,null),c=Cl("Background gradient",t.backgroundFill,d=>i(u=>{if(d===void 0){delete u.backgroundFill;return}u.backgroundFill=d,u.backgroundColorHex=Ut(d,0)},"bgfill"),()=>({kind:"linear",stops:[{at:0,colorHex:t.backgroundColorHex??"#000000"},{at:1,colorHex:t.backgroundColorHex??"#000000"}]}));return h`
    ${Re(e,"look",`${ae(n)} shape`,h`
      ${r?m:h`${l}${c}`}
      <div class="fgroup">
      ${ye("Border colour",t.borderColorHex,d=>i(u=>{d===void 0?delete u.borderColorHex:u.borderColorHex=d},"border"),!0,null)}
      ${ee("Border width",t.borderWidth,d=>i(u=>{u.borderWidth=d??2},"bw"),{step:.5,min:0,def:2,unit:"pt"})}
      </div>`,{color:oe.look,icon:"shape",summary:`${o} \xB7 ${s}`,...t.backgroundColorHex!==void 0||t.backgroundFill!==void 0||t.borderColorHex!==void 0||t.borderWidth!==2?{reset:()=>i(d=>{delete d.backgroundColorHex,delete d.backgroundFill,delete d.borderColorHex,d.borderWidth=2},"reset-look")}:{}})}
    ${r?Re(e,"home","Home Screen",h`
      ${l}
      ${c}
      <div class="hint">The tile is drawn edge to edge: this colour fills every point of it, and the design is laid out inside the ${ae(n)} box.</div>
      <div class="hint keep">iOS 18 lets a user tint the whole Home Screen. The system then drops the background and draws the design in two tones, so check that it still reads without its colours.</div>
      ${Yn(n)?h`<div class="hint keep">${ae(n)} needs ${Yn(n)}. An iPhone on an older version is not offered this size when adding a widget, and every other size still draws.</div>`:m}`,{color:oe.look,icon:"shape",summary:o,...t.backgroundColorHex!==void 0||t.backgroundFill!==void 0?{reset:()=>i(d=>{delete d.backgroundColorHex,delete d.backgroundFill},"reset-home")}:{}}):m}
    ${n==="corner"?Re(e,"corner","Corner content",sT(e,t,i),{color:oe.content,icon:"content",summary:t.curvedText?"Big curved text":"Layer canvas",...t.curvedText!==void 0||t.bezelText!==void 0||t.bezelGauge!==void 0?{reset:()=>i(d=>{delete d.curvedText,delete d.bezelText,delete d.bezelGauge},"reset-corner")}:{}}):m}
    ${Re(e,"states","Shape states",Qb(e,t.rules,"layout",d=>d.perFamily[n]?.rules,`rules-${n}`),{color:oe.states,icon:"states",summary:Gr(t.rules).replace(/\.$/,""),...t.rules.length>0?{reset:()=>i(d=>{d.rules=[]},"reset-states")}:{}})}
    ${Re(e,"placements","Layers",h`
      <div class="hint keep">${a===0?`Nothing is on the ${ae(n)} shape. The Layers card offers a copy of another shape's whole arrangement, or you can add layers here one at a time.`:`${a} layer${a===1?" is":"s are"} on the ${ae(n)} shape. They belong to this shape alone: no other shape draws them, and editing one here cannot reach another shape.`}</div>`,{color:oe.position,icon:"place",summary:a===0?"Nothing on it":`${a} layer${a===1?"":"s"}`})}`}function oT(e){let n=e.config.inline;if(!n)return h`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let t=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=me(e);return h`
    ${Re(e,"content","Inline text",h`
      ${Ie("Label (blank = value only)",n.label??"",a=>t(r=>{a?r.label=a:delete r.label},"label"))}
      ${he(e,n.value,a=>t(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${op(e,n.countdown===!0,n.value,a=>t(r=>{a?r.countdown=!0:delete r.countdown}))}`,{color:oe.content,icon:"text",summary:Qe(`${n.label?`${n.label}: `:""}${Ne(n.value,i)}`,48)})}
    ${Re(e,"symbol","Symbol",h`
      ${pb(e,n.symbol??"",a=>t(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="field readout"><span>On the face</span><span class="readout-v">${n.symbol?`${n.symbol} `:""}${n.label?`${n.label}: `:""}${e.resolve(n.value)??"--"}</span></div>`,{color:oe.look,icon:"icon",summary:n.symbol||"None"})}`}function sT(e,n,t){let i=n.curvedText?"curved":"canvas",a=n.bezelGauge?"gauge":n.bezelText?"text":"none";return h`
    <div class="fgroup">
    ${ne("Main content",i,[["canvas","Layer canvas"],["curved","Big curved text"]],r=>t(o=>{r==="curved"?o.curvedText||(o.curvedText=K("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&n.curvedText?h`
      ${he(e,n.curvedText,r=>t(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${ye("Curved text colour",n.curvedColorHex??"#FFFFFF",r=>t(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:m}
    </div>
    <div class="fgroup">
    ${ne("Bezel",a,[["none","None"],["text","Text label"],["gauge","Gauge arc"]],r=>t(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=K("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:K("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&n.bezelText?h`
      ${he(e,n.bezelText,r=>t(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${op(e,n.bezelCountdown===!0,n.bezelText,r=>t(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:m}
    ${a==="gauge"&&n.bezelGauge?lT(e,n.bezelGauge,t):m}
    </div>`}function lT(e,n,t){let i=[n.colorHexes[0]??"#34C759",n.colorHexes[1]??n.colorHexes[n.colorHexes.length-1]??"#FFCC00",n.colorHexes[n.colorHexes.length-1]??"#FF3B30"],a=r=>o=>t(s=>{let l=[...i];l[r]=o??l[r],s.bezelGauge.colorHexes=l},`gstop${r}`);return h`
    ${he(e,n.value,r=>t(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${ee("Gauge min",n.minValue,r=>t(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${ee("Gauge max",n.maxValue,r=>t(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${ye("Arc colour (min end)",i[0],a(0))}
    ${ye("Arc colour (middle)",i[1],a(1))}
    ${ye("Arc colour (max end)",i[2],a(2))}
    ${Fe("End labels",!!(n.minLabel||n.maxLabel),r=>t(o=>{let s=o.bezelGauge;r?(s.minLabel=K(String(s.minValue)),s.maxLabel=K(String(s.maxValue))):(delete s.minLabel,delete s.maxLabel)}))}
    ${n.minLabel?he(e,n.minLabel,r=>t(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):m}
    ${n.maxLabel?he(e,n.maxLabel,r=>t(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):m}`}var CF=de.map(e=>[e,ae(e)]),cp={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setFontDesign:"Set typeface",setFontWidth:"Set width",setItalic:"Set italic",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},dT=Object.keys(cp),Fl=["color","text","fontSize","fontWeight","fontDesign","fontWidth","italic","visibility"];function cT(e,n=!1){let t=Mr[e].filter(i=>!n||Fl.includes(i));return dT.filter(i=>t.includes(Ye[i]))}function qb(e,n,t,i){let a=n!==void 0&&!e.some(r=>r.id===n);return h`<label class="field"><span>Changes</span>
      <select @change=${r=>i(r.target.value,r.target)}>
        ${OS(e,n,t).map(([r,o])=>h`<option value=${r} ?selected=${r===(n??"")}>${o}</option>`)}
      </select></label>
    ${a?h`<div class="hint warn">The part this changed has been removed, so it changes nothing. Pick another part or Whole text.</div>`:m}`}var uT={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function wl(e,n){if(e.entityId==="")return"(no entity)";let t=e.displayName.trim();if(t!==""&&t!==e.entityId)return t;let i=n?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function Qe(e,n){let t=e.replace(/\s+/g," ").trim();return t.length>n?`${t.slice(0,n-1)}\u2026`:t}function Yb(e){if(!e||We(e))return"";let n=[];return e.decimals!==void 0&&n.push(`${e.decimals} dp`),e.multiply!==void 0&&n.push(`\xD7${e.multiply}`),e.offset!==void 0&&n.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&n.push(`"${e.prefix}" first`),e.suffix&&n.push(`"${e.suffix}" after`),e.useEntityUnit&&n.push("with unit"),e.relativeTime&&n.push("as relative time"),e.duration&&n.push("as a duration"),e.timestamp&&n.push(`as ${(zo.find(([t])=>t===e.timestamp)?.[1]??e.timestamp).toLowerCase()}`),e.textCase&&n.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),n.length===0?"":` (${n.join(", ")})`}function Ne(e,n){return`${uo(e,n)}${Yb(e.format)}`}function uo(e,n){let t=e.kind;switch(t.kind){case"literal":return t.value?`"${Qe(t.value,40)}"`:"(empty)";case"entityState":return wl(t,n);case"entityAttribute":return t.attribute?`${wl(t,n)} \xB7 ${t.attribute}`:wl(t,n);case"entityAge":return`age of ${wl(t,n)}`;case"aggregate":return pT(t.aggregate);case"time":return uT[t.timeField];case"dataAge":return"data age";case"item":return t.field?`item ${t.field}`:"item field";case"listStat":return t.stat==="total"?"items in total":"items shown";case"jinja":return t.value?`template ${Qe(t.value,32)}`:"template (empty)";case"named":return t.id===""?"(no value chosen)":n?.values?.find(a=>a.id===t.id)?.name?.trim()||`named ${t.id.slice(0,8)}`;case"chartStat":{let i=(Bt.find(([o])=>o===t.stat)?.[1]??t.stat).toLowerCase();if(t.layer==="")return`${i} (no chart chosen)`;let a=n?.elements?.find(o=>o.kind==="chart"&&o.payload.id===t.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?uo(a.payload.value,n):"a missing chart";return`${i} of ${r}`}}}function pT(e){let n=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${n}`}function Na(e,n,t){if(t<0||t>=e.length)return;let[i]=e.splice(n,1);e.splice(t,0,i)}function hT(e,n,t,i,a,r){let o=(s,l)=>e.update(c=>{let d=i(c);d&&s(d)},l?`${a}-${l}`:void 0);return h`
    ${n.length===0?h`<div class="hint keep">No rules yet. A rule checks values and changes how this ${t==="layout"?"family":"layer"} looks.</div>`:m}
    ${n.map((s,l)=>fT(e,s,l,n.length,t,o,`${a}-${s.id}`,r))}
    <div class="adders"><button class="small" @click=${()=>o(s=>{s.push(ka())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function fT(e,n,t,i,a,r,o,s){let l=e.liveBranch(n),c=e.forced.get(n.id)??"live",d=f=>c==="live"?f==="live":c==="otherwise"?f==="otherwise":c.caseId===f,u=(f,g)=>r(b=>{let y=b.find(w=>w.id===n.id);y&&f(y)},g),p=s!==void 0&&n.partId!==void 0;return h`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${t+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(f=>Na(f,t,t-1))}>${D("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i-1} @click=${()=>r(f=>Na(f,t,t+1))}>${D("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(f=>{let g=f.findIndex(b=>b.id===n.id);g>=0&&f.splice(g,1)})}>${D("delete")}</button>
    </div>
    ${s===void 0?m:qb(s,n.partId,me(e),f=>u(g=>{f?g.partId=f:delete g.partId}))}
    <div class="field"><span>Preview</span>
      <div class="branches">
        <button class=${d("live")?"active":""} @click=${()=>e.setForced(n.id,"live")}>Live</button>
        ${n.cases.map((f,g)=>h`<button class="${d(f.id)?"active":""} ${l===f.id?"live-match":""}" @click=${()=>e.setForced(n.id,{caseId:f.id})}>Case ${g+1}</button>`)}
        ${n.otherwise?h`<button class="${d("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(n.id,"otherwise")}>Otherwise</button>`:m}
      </div>
    </div>
    ${n.cases.map((f,g)=>mT(e,f,g,n,a,u,`${o}-${f.id}`,p))}
    <div class="adders"><button class="small" @click=${()=>u(f=>{f.cases.push($c())})}>+ case</button></div>
    ${Fe("Otherwise",n.otherwise!==void 0,f=>u(g=>{f?g.otherwise=g.otherwise??[]:delete g.otherwise}))}
    ${n.otherwise?h`<div class="case-box otherwise">
          <div class="hint keep">${l==="otherwise"?h`<b>Active now.</b> `:m}Changes when no case matches:</div>
          ${Xb(e,n.otherwise,a,f=>u(g=>{g.otherwise&&f(g.otherwise)}),`${o}-otherwise`,p)}
        </div>`:m}
  </div>`}function mT(e,n,t,i,a,r,o,s=!1){let l=(d,u)=>r(p=>{let f=p.cases.find(g=>g.id===n.id);f&&d(f)},u),c=e.liveBranch(i)===n.id;return h`<div class="case-box ${c?"match":""}">
    <div class="rule-head">
      <span>Case ${t+1}${c?h` <span class="ok">· active now</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(d=>Na(d.cases,t,t-1))}>${D("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i.cases.length-1} @click=${()=>r(d=>Na(d.cases,t,t+1))}>${D("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(d=>{let u=d.cases.findIndex(p=>p.id===n.id);u>=0&&d.cases.splice(u,1)})}>${D("delete")}</button>
    </div>
    <div class="row-inline">
      ${ne("When",n.when.join,[["all","All of these are true"],["any","Any of these is true"]],d=>l(u=>{u.when.join=d}))}
    </div>
    ${n.when.tests.length===0?h`<div class="hint keep">No tests: this case always matches.</div>`:m}
    ${n.when.tests.map((d,u)=>gT(e,d,u,p=>l(f=>{let g=f.when.tests.find(b=>b.id===d.id);g&&p(g)}),()=>l(p=>{p.when.tests=p.when.tests.filter(f=>f.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders">
      <button class="small" @click=${()=>l(d=>{d.when.tests.push(kc())})}>+ test</button>
      <select class="adder" @change=${d=>{let u=d.target,p=u.value;if(u.value="",!p)return;let f=vy(p,gy(e.hass?.states));l(g=>{g.when.tests.push(...f)})}}>
        <option value="">+ preset…</option>
        ${xy.map(d=>h`<option value=${d.kind} title=${d.hint}>${d.label}</option>`)}
      </select>
    </div>
    <div class="hint keep" style="margin-top:8px">Then:</div>
    ${Xb(e,n.then,a,d=>l(u=>d(u.then)),`${o}-then`,s)}
  </div>`}function gT(e,n,t,i,a,r){let o=(u,p)=>i(u,p?`${r}-${p}`:void 0),s=n.comparison,l=Ai(s.kind),c=e.evaluateTest(n),d=m;switch(l){case"value":d=he(e,s.value??K(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":d=h`${he(e,s.value??K(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${he(e,s.upper??K(""),u=>o(p=>{p.comparison.upper=u},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":d=h`${Ie("Pattern",s.pattern??"",u=>o(p=>{p.comparison.pattern=u},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${s.pattern&&!yT(s.pattern)?h`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:m}`;break;case"times":d=h`<div class="row-inline">
          ${ab(e,"From",s.value??K("22:00"),u=>o(p=>{p.comparison.value=u},"rhs"),`${r}-rhs`)}
          ${ab(e,"To",s.upper??K("06:00"),u=>o(p=>{p.comparison.upper=u},"upper"),`${r}-upper`)}
        </div>
        <div class="hint">The start is included and the end is not. An end earlier than the start wraps midnight, so 22:00 to 06:00 is the night. Equal times match nothing.</div>`;break;case"options":d=bT(n.value)?xT(s.options??[],u=>o(p=>{p.comparison.options=Eu(u)},"options")):Ie("Options (comma separated)",(s.options??[]).join(", "),u=>o(p=>{p.comparison.options=u.split(",").map(f=>f.trim()).filter(Boolean)},"options"));break;case"none":break}return h`<div class="test-box">
    <div class="rule-head">
      <span>Test ${t+1} <span class=${c?"ok":"no"}>${c?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${D("delete")}</button>
    </div>
    ${s.kind==="isStale"?h`<div class="hint keep">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:he(e,n.value,u=>o(p=>{p.value=u},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${$e("Comparison",s.kind,Hf.map(u=>[u,Ra[u]]),u=>o(p=>{p.comparison=Cc(p.comparison,u)}))}
    ${d}
  </div>`}function yT(e){try{return new RegExp(e),!0}catch{return!1}}function ab(e,n,t,i,a){if(t.kind.kind!=="literal")return he(e,t,i,{showResolved:!0,label:n,key:a});let r=t.kind.value,o=Fi(r)??"";return h`<label class="field"><span>${n}</span>
    <input type="time" .value=${o}
      @input=${He(s=>i({...t,kind:{kind:"literal",value:s}}))} />
    ${r!==""&&o===""?h`<div class="hint warn">"${r}" is not a 24-hour HH:MM time. The test stays false until it is.</div>`:m}</label>`}function bT(e){return e.kind.kind==="time"&&e.kind.timeField==="weekday"}function xT(e,n){let t=by(e),i=a=>n(t.includes(a)?t.filter(r=>r!==a):[...t,a]);return h`<div class="field seg-field"><span>Days</span>
    <div class="seg wide" role="group" aria-label="Days">
      ${yy.map((a,r)=>h`<button type="button" role="checkbox" aria-checked=${t.includes(r)?"true":"false"}
        class=${t.includes(r)?"on":""} @click=${()=>i(r)}>${a}</button>`)}
    </div></div>`}function Xb(e,n,t,i,a,r=!1){let o=cT(t,r);return h`
    ${n.length===0?h`<div class="hint keep">No changes.</div>`:m}
    ${n.map((s,l)=>wT(e,s,l,t,(c,d)=>i(u=>{u[l]&&c(u[l])},d?`${a}-${l}-${d}`:void 0),()=>i(c=>{c.splice(l,1)}),`${a}-${l}`,r))}
    <select class="adder" @change=${s=>{let l=s.target,c=l.value;l.value="",c&&i(d=>{d.push(Wn(c))})}}>
      <option value="">+ change…</option>
      ${o.map(s=>h`<option value=${s}>${cp[s]}</option>`)}
    </select>`}var Jb=["setColor","setBorderColor","setBackgroundColor"];function wT(e,n,t,i,a,r,o,s=!1){let l=!Mr[i].includes(Ye[n.kind]),c=s&&!l&&!Fl.includes(Ye[n.kind]);return h`<div class="change-box">
    <div class="rule-head">
      <span>${cp[n.kind]}${l?h` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:c?h` <span class="no">(ignored by a part)</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${D("delete")}</button>
    </div>
    ${c?h`<div class="hint keep">A part only takes colour, text, size, weight, hide and show. Pick Whole text to use this change.</div>`:m}
    ${Zb(e,n,a,o)}
  </div>`}function Zb(e,n,t,i){let a=$s(n.kind),r=m;if(a==="value"){let o=n.value??K("");if(Jb.includes(n.kind)){let s=o.kind.kind==="literal";r=h`${s?ye("Colour",o.kind.kind==="literal"?o.kind.value:"",l=>t(c=>{c.value=K(l??"#FFFFFF")},"color")):he(e,o,l=>t(c=>{c.value=l},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>t(l=>{l.value=s?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:K("#FFFFFF")})}>${s?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${s?m:h`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=he(e,o,s=>t(l=>{l.value=s},"value"),{noFormat:n.kind==="setIcon",symbol:n.kind==="setIcon",showResolved:!0,label:n.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=n.kind==="setOpacity"?{step:.05,min:0,max:1}:n.kind==="setRotation"?{step:1,unit:"\xB0"}:n.kind==="setFontSize"||n.kind==="setBorderWidth"?{step:.5,min:0,unit:"pt"}:{step:.5,min:0},s=n.kind==="setOpacity"?"Opacity (0 to 1)":n.kind==="setRotation"?"Angle":n.kind==="setFontSize"?"Size":n.kind==="setBorderWidth"?"Width":"Value";r=ee(s,n.number??0,l=>t(c=>{c.number=l??0},"number"),o)}else a==="weight"?r=ne("Weight",n.weight??"regular",La,o=>t(s=>{s.weight=o})):a==="design"?r=h`${ne("Typeface",n.design??"default",io,o=>t(s=>{s.design=o}))}
      ${ap}`:a==="width"?r=h`${ne("Width",n.width??"standard",ao,o=>t(s=>{s.width=o}))}
      ${ip}`:a==="italic"&&(r=Fe("Italic",n.italic!==!1,o=>t(s=>{s.italic=o})));return r}var Yu=new Set,vl=new Map,kl=new Map,$l=new Set,rb=new Map;function Qb(e,n,t,i,a,r,o){let s=fu(n);return!s.ok||Yu.has(a)?h`
      <div class="states-switch">
        <button class="link" ?disabled=${!s.ok} title=${s.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${c=>{Yu.delete(a),Te(c.target)}}>Show as table</button>
        ${s.ok?m:h`<span class="hint keep">${s.reason}</span>`}
      </div>
      ${hT(e,n,t,i,a,o)}`:vT(e,s.table,n[0],t,i,a,r,o)}function vT(e,n,t,i,a,r,o,s){let l=(C,_)=>e.update(B=>{let j=a(B);j&&C(j)},_?`${r}-${_}`:void 0),c=n.value??rb.get(r)??o,d=n.rows.length===0,u=n.numberMode||d&&c!==void 0&&!Jg(c)&&kT(e.resolve(c)),p=Mr[i],f=vl.get(r)??new Set,g=n.columns.length===0&&f.size===0?[Xg[i]]:[],b=Gg(n.columns,[...f,...g.filter(C=>C!==void 0)],p),y=Zr.get(r),w=t?t.partId:s?.some(C=>C.id===y)?y:void 0,k=s!==void 0&&w!==void 0,S=k?p.filter(C=>Fl.includes(C)):p,R=k?b.filter(C=>!Fl.includes(C)):[],O=(C,_)=>{if(!t){C?Zr.set(r,C):Zr.delete(r),Te(_);return}l(B=>{let j=B[0];j&&(C?j.partId=C:delete j.partId)})},F=t?e.liveBranch(t):"none",z=t?e.forced.get(t.id)??"live":"live",$=C=>z!=="live"&&(z==="otherwise"?C==="otherwise":z.caseId===C),A=C=>{t&&e.setForced(t.id,$(C)?"live":C==="otherwise"?"otherwise":{caseId:C})},W=C=>{rb.set(r,C),n.rows.length!==0&&l(_=>jg(_,C),"lhs")},Q=()=>{Zr.delete(r),l(C=>{Wg(C,c??K(""),u),w!==void 0&&C[0]&&C[0].partId===void 0&&(C[0].partId=w)})},I=n.rows.map((C,_)=>sb(e,{key:`${r}-${C.caseId}`,label:Yg(C.comparison,B=>Ne(B,me(e))),columns:b,changes:C.changes,live:F===C.caseId,forced:$(C.caseId),onForce:()=>A(C.caseId),when:ET(e,C.comparison,`${r}-${C.caseId}`,(B,j)=>l(se=>{let ve=se[0]?.cases.find(ft=>ft.id===C.caseId)?.when.tests[0];ve&&B(ve.comparison)},j&&`${C.caseId}-${j}`)),updChanges:(B,j)=>l(se=>{let ve=se[0]?.cases.find(ft=>ft.id===C.caseId);ve&&B(ve.then)},j&&`${C.caseId}-${j}`),acts:h`
      <button class="icon" title="Move up" ?disabled=${_===0} @click=${()=>l(B=>mu(B,_,_-1))}>${D("up")}</button>
      <button class="icon" title="Move down" ?disabled=${_===n.rows.length-1} @click=${()=>l(B=>mu(B,_,_+1))}>${D("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>l(B=>Kg(B,C.caseId))}>${D("delete")}</button>`})),G=n.otherwise===void 0?m:sb(e,{key:`${r}-otherwise`,label:"Otherwise",columns:b,changes:n.otherwise,live:F==="otherwise",forced:$("otherwise"),onForce:()=>A("otherwise"),when:h`<span class="when-otherwise">Otherwise</span>`,updChanges:(C,_)=>l(B=>{let j=B[0]?.otherwise;j&&C(j)},_),acts:h`<button class="icon" title="Remove the Otherwise row" @click=${()=>l(C=>gu(C,!1))}>${D("close")}</button>`}),J=kl.get(r),te=$T.filter(C=>S.includes(C)&&!b.includes(C)),M=fy(c),q={icon:S.includes("icon"),color:S.includes("color")},x=M&&(q.icon||q.color)?py(M.domain,Db(e,M.entityId)):[],T=n.rows.length>0||n.otherwise!==void 0,P=()=>{$l.delete(r),Zr.delete(r),l(C=>{let _=al(c??K(""),hy(x,q),void 0,C[0]?.id);w!==void 0&&(_.partId=w),C.length=0,C.push(_)},"fill")};return h`
    <div class="states">
      ${he(e,c??K(""),W,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${c===void 0?h`<div class="hint keep">Choose what these states look at.</div>`:m}
      ${s===void 0?m:qb(s,w,me(e),O)}
      <div class="states-scroll"><table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${b.map(C=>h`<th>
              <span>${Zt[C]}</span>
              <button class="icon" title=${`Remove the ${Zt[C]} column`}
                @click=${_=>{kl.set(r,C),Te(_.target)}}>${D("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${I}
          ${G}
          ${n.rows.length===0&&n.otherwise===void 0?h`<tr><td class="empty-row" colspan=${b.length+2}>${Bg(i)}</td></tr>`:m}
        </tbody>
      </table></div>
      ${R.length===0?m:h`<div class="hint warn">A part ignores ${Nl(R.map(C=>Zt[C]))}. Pick Whole text to use ${R.length===1?"it":"them"}.</div>`}
      ${J===void 0?m:h`<div class="hint warn confirm-row">
        Remove the ${Zt[J]} column? Its ${ob(n,J)} value${ob(n,J)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${C=>{kl.delete(r),vl.get(r)?.delete(J),Te(C.target),l(_=>qg(_,J))}}>Remove</button>
        <button class="small" @click=${C=>{kl.delete(r),Te(C.target)}}>Cancel</button>
      </div>`}
      ${$l.has(r)?h`<div class="hint warn confirm-row">
        Fill from the entity? The ${n.rows.length} state${n.rows.length===1?"":"s"} in this table ${n.rows.length===1?"is":"are"} replaced by one row per state a ${M?.domain.replace(/_/g," ")} reports.
        <button class="danger small" @click=${C=>{Te(C.target),P()}}>Fill</button>
        <button class="small" @click=${C=>{$l.delete(r),Te(C.target)}}>Cancel</button>
      </div>`:m}
      <div class="states-add">
        <button class="small" title="Add a row to the table: a value to match under When, and the look it gets" @click=${Q}>${D("plus")}<span>Add a state</span></button>
        <span class="states-add-note">${Br(i).state}</span>
        ${x.length===0?m:h`<button class="small" title=${`Write one row per state a ${M.domain.replace(/_/g," ")} reports, each with an icon and a colour`}
          @click=${C=>{if(T){$l.add(r),Te(C.target);return}P()}}>${D("plus")}<span>Fill from the entity</span></button>
        <span class="states-add-note">${Br(i).fill}</span>`}
        ${n.otherwise===void 0?h`<button class="small" title="Add an Otherwise row at the bottom of the table" @click=${()=>l(C=>gu(C,!0))}>${D("plus")}<span>Add otherwise</span></button>
            <span class="states-add-note">${Br(i).otherwise}</span>`:m}
        ${te.length===0?m:h`<select class="chip-add" title="Add a column to the table" aria-label="Change another setting" @change=${C=>{let _=C.target,B=_.value;if(_.value="",!B)return;let j=vl.get(r)??new Set;j.add(B),vl.set(r,j),Te(_)}}>
          <option value="" selected>Change another setting…</option>
          ${te.map(C=>h`<option value=${C}>${Zt[C]}</option>`)}
        </select>
        <span class="states-add-note">${Br(i).column}</span>`}
      </div>
      ${z==="live"?m:h`<div class="field"><span>Preview</span>
        <div class="row-acts"><button class="small" @click=${()=>t&&e.setForced(t.id,"live")}>Back to live</button></div>
      </div>`}
      <div class="hint">${u?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${C=>{Yu.add(r),Te(C.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function kT(e){let n=(e??"").trim();return n!==""&&Number.isFinite(Number(n))}var $T=["icon","text","color","visibility","opacity","fontSize","fontWeight","fontDesign","fontWidth","italic","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function ob(e,n){let t=0;for(let i of e.rows)il(i.changes,n)&&(t+=1);return e.otherwise&&il(e.otherwise,n)&&(t+=1),t}function CT(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function sb(e,n){return h`<tr class="state-row ${n.live?"live":""} ${n.forced?"forced":""}"
    title=${`${n.label}. Click to hold the previews on this state.`}
    @click=${t=>{CT(t)||n.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${n.forced?"The previews are held on this state":n.live?"This state matches right now":""}>${n.forced?"\u25C9":n.live?"\u25CF":""}</span>
      ${n.when}
    </td>
    ${n.columns.map(t=>h`<td>${ST(e,t,n.changes,n.updChanges,`${n.key}-${t}`)}</td>`)}
    <td class="acts">${n.acts}</td>
  </tr>`}function ST(e,n,t,i,a){let r=il(t,n),o=Hl(a);if(!r)return h`<button type="button" class="cell empty" title=${`Set ${Zt[n]} for this state`}
      @click=${c=>{i(d=>{d.push(Wn(Og[n]))}),bb(c.target,o)}}>unchanged</button>`;let s=(c,d)=>i(u=>{let p=u.find(f=>Ye[f.kind]===n);p&&c(p)},d&&`${n}-${d}`),l=Zt[n];return h`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${l}. Click to change it.`}>${TT(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${l} @toggle=${xb}>
      <div class="pop-head">
        <b>${l}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${to.has(o)?h`${n==="visibility"?ne("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],c=>s(d=>{d.kind=c})):Zb(e,r,s,a)}
          <button class="link" @click=${c=>{c.target.closest("[popover]")?.hidePopover(),i(d=>{let u=d.findIndex(p=>Ye[p.kind]===n);u>=0&&d.splice(u,1)})}}>Leave ${l.toLowerCase()} unchanged</button>`:m}
    </div>`}function TT(e,n){if(n.kind==="hide")return h`<span class="cell-word">Hidden</span>`;if(n.kind==="show")return h`<span class="cell-word">Shown</span>`;let t=$s(n.kind);if(t==="number")return h`<span class="cell-word mono">${n.number??0}</span>`;if(t==="weight")return h`<span class="cell-word">${La.find(([r])=>r===(n.weight??"regular"))?.[1]}</span>`;if(t==="design")return h`<span class="cell-word">${io.find(([r])=>r===(n.design??"default"))?.[1]}</span>`;if(t==="width")return h`<span class="cell-word">${ao.find(([r])=>r===(n.width??"standard"))?.[1]}</span>`;if(t==="italic")return h`<span class="cell-word">${n.italic===!1?"Upright":"Italic"}</span>`;let i=n.value??K(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(Jb.includes(n.kind))return h`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?Ue(a):Ne(i,me(e))}</span>`;if(n.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return h`${r??m}<span class="cell-word">${a}</span>`}return h`<span class="cell-word">${Ne(i,me(e))}</span>`}function Ue(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function ET(e,n,t,i){let a=Ai(n.kind),r=hu(n.kind),o=(s,l,c,d)=>MT(e,s,l,`${t}-${c}`,r,d,c==="rhs"?"Compare with":"Upper bound");return h`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${He(s=>i(l=>{let c=Cc(l,s);l.kind=c.kind,c.value!==void 0?l.value=c.value:delete l.value,c.upper!==void 0?l.upper=c.upper:delete l.upper}))}>
      ${pu.map(s=>h`<option value=${s} ?selected=${s===n.kind}>${RT(s)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(n.value??K(""),s=>i(l=>{l.value=s},"rhs"),"rhs",r?"0":"value"):m}
    ${a==="between"?h`<span class="when-and">to</span>${o(n.upper??K(""),s=>i(l=>{l.upper=s},"upper"),"upper","100")}`:m}
  </span>`}function RT(e){switch(e){case"lessThan":return"below\u2026";case"lessOrEqual":return"\u2026or below";case"between":return"between\u2026";case"greaterOrEqual":return"\u2026or above";case"greaterThan":return"above\u2026";default:return Ra[e]}}function MT(e,n,t,i,a,r,o){let s=Hl(i),l={showResolved:!0,label:o,key:i};if(n.kind.kind!=="literal")return h`<span class="rhs">
      ${he(e,n,t,{...l,compact:!0})}
    </span>`;let c=n.kind.value;return h`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${c} placeholder=${r}
      @input=${He(d=>t({...n,kind:{kind:"literal",value:d}}))} />
    <button type="button" class="icon more" popovertarget=${s} title="Compare with an entity or a template instead">…</button>
    ${yb(e,s,o,n,t,l)}
  </span>`}var FT=/^[a-z0-9_]+\.shared_(\d+)$/;function Yi(e){return FT.test(e)}function AT(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function nx(e,n){let i=(e.domain||n.split(".")[0]||"").toLowerCase().replace(/[^a-z0-9_]/g,"");return i===""?"entity":i}function ix(e,n){let t=new Map;for(let i of wc(e,(a,r)=>n.has(r))){if(i.entityId==="")continue;let a=t.get(i.entityId);if(!a){let r=nx(i.ref,i.entityId),o=t.size+1;a={placeholderId:`${r}.shared_${o}`,domain:r,label:`${AT(r.replace(/_/g," "))} ${o}`,originalId:i.entityId,where:[]},t.set(i.entityId,a)}a.where.includes(i.where)||a.where.push(i.where)}return[...t.values()]}function Da(e,n){let t=structuredClone(e),i=new Map,a=new Map;for(let r of n)i.set(r.originalId,{entityId:r.placeholderId,displayName:r.label,domain:r.domain}),a.set(r.originalId,r.placeholderId);xc(t,r=>{let o=i.get(r.entityId);return o?{...o}:void 0}),va(t,r=>mc(r,a)),delete t.openPageId,delete t.openPageName,t.tapAction.type==="openPage"&&(t.tapAction={type:"none"});for(let r of t.elements)r.kind==="tap"&&(delete r.payload.openPageId,delete r.payload.openPageName,r.payload.action.type==="openPage"&&(r.payload.action={type:"none"}));return t.dataSources=[],t}function Pl(e){let n=i=>i.kind==="filter"&&i.areaIds.length+i.labelIds.length+i.floorIds.length>0,t=!1;jt(e,i=>{let a=i.kind;a.kind==="aggregate"&&n(a.aggregate.scope)&&(t=!0)});for(let i of e.elements){if(i.kind!=="list")continue;let a=i.payload.source;a.kind==="entities"&&n(a.scope)&&(t=!0)}return t}function IT(e,n="  "){let t=(i,a)=>{if(i===null||typeof i!="object")return JSON.stringify(i)??"null";let r=a+n;if(Array.isArray(i))return i.length===0?"[]":`[
${i.map(c=>r+t(c,r)).join(`,
`)}
${a}]`;let o=i,s=Object.keys(o).filter(c=>o[c]!==void 0).sort();return s.length===0?"{}":`{
${s.map(c=>`${r}${JSON.stringify(c)}: ${t(o[c],r)}`).join(`,
`)}
${a}}`};return t(e,"")}function Pa(e,n,t=[]){let i=n==="share"?Da(e,t):e,a=fa(i);return delete a.id,delete a.slotIndex,n==="share"&&delete a.hidden,a.dataSources=[],`${IT(a)}
`}function up(e){let t=(e.name===""?"Complication":e.name).split(/[^\p{L}\p{N}]+/u).filter(i=>i!=="").join("-");return`${t===""?"Complication":t}.json`}var LT="There is nothing to read here. Paste a complication first.",HT="This is not valid JSON. Check for a missing brace or a stray comma.",_T="This is valid JSON but not a complication. A complication starts with { and ends with }.",NT="This does not look like a complication.",ex="It was made by a newer panel, so update the Wrist Assistant integration before importing it.",DT="00000000-0000-4000-8000-000000000000";function PT(e){let n=/^([A-Za-z]+) is required$/.exec(e);return n?`It is missing "${n[1]}".`:e}function ax(e,n){let t=e.trim();if(t==="")return{ok:!1,error:LT};let i;try{i=JSON.parse(t)}catch{return{ok:!1,error:HT}}if(typeof i!="object"||i===null||Array.isArray(i))return{ok:!1,error:_T};let a=i,r=a.schemaVersion;if(typeof r=="number"&&r>n)return{ok:!1,error:`This complication is schema v${r}; this panel understands up to v${n}. ${ex}`};let o={...a,id:DT,slotIndex:0},s;try{s=ha(o)}catch(c){let d=c instanceof vt||c instanceof Error?c.message:String(c);return{ok:!1,error:`${NT}

${PT(d)}`}}delete s.hidden;let l=ms(a);if(l.length>0){let c=l.slice(0,3).join(", "),d=l.length>3?`, and ${l.length-3} more`:"";return{ok:!1,error:`This complication uses keys this panel does not know: ${c}${d}. ${ex}`}}return{ok:!0,config:s,raw:i}}function pp(e,n){let t=new Set;for(let o of Object.keys(n)){let s=o.split(".")[0]??"";s!==""&&t.add(s)}let i=o=>Object.prototype.hasOwnProperty.call(n,o),a=new Map,r=wc(e,(o,s)=>Yi(o)||t.has(s));for(let o of r){if(o.entityId==="")continue;let s=Yi(o.entityId);if(!s&&i(o.entityId))continue;let l=a.get(o.entityId);l||(l={entityId:o.entityId,domain:nx(o.ref,o.entityId),label:o.ref.displayName||o.entityId,where:[],required:s},a.set(o.entityId,l)),l.label===o.entityId&&o.ref.displayName!==""&&(l.label=o.ref.displayName),l.where.includes(o.where)||l.where.push(o.where)}return[...a.values()]}function hp(e,n){let t=structuredClone(e);xc(t,a=>{let r=n.get(a.entityId);if(r)return{entityId:r.entityId,displayName:r.displayName,domain:r.domain||r.entityId.split(".")[0]||""}});let i=new Map;for(let[a,r]of n)i.set(a,r.entityId);return va(t,a=>mc(a,i)),t}function rx(e,n){let t=e.trim();if(t==="")return"";let i=a=>n.has(a.toLowerCase());if(!i(t))return t;for(let a=2;a<=99;a+=1){let r=`${t} ${a}`;if(!i(r))return r}return t}var ox="import";function tx(e){let n="";for(let t=0;t<e.length;t+=32768)n+=String.fromCharCode(...e.subarray(t,t+32768));return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function zT(e){if(!/^[A-Za-z0-9_-]*$/.test(e)||e.length%4===1)return;let n=e.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((e.length+3)%4);try{let t=atob(n),i=new Uint8Array(t.length);for(let a=0;a<t.length;a+=1)i[a]=t.charCodeAt(a);return i}catch{return}}async function sx(e,n){let t=new Blob([e]).stream().pipeThrough(n);return new Uint8Array(await new Response(t).arrayBuffer())}async function lx(e,n={}){let t=new TextEncoder().encode(e);if(n.compress!==!1&&typeof CompressionStream=="function")try{return`z${tx(await sx(t,new CompressionStream("gzip")))}`}catch{}return`t${tx(t)}`}async function fp(e){let n=zT(e.slice(1));if(!n)return;let t=new TextDecoder("utf-8",{fatal:!0});try{if(e.startsWith("t"))return t.decode(n);if(e.startsWith("z")&&typeof DecompressionStream=="function")return t.decode(await sx(n,new DecompressionStream("gzip")))}catch{}}var dx="https://wrist-assistant.com/import/";function cx(e,n){return`${e.split("#")[0]??e}#${ox}=${n}`}function mp(e){let n=e.startsWith("#")?e.slice(1):e,t=`${ox}=`;if(!n.startsWith(t))return;let i=n.slice(t.length);return i.length>1?i:void 0}function ux(e){let n=e.trim();if(n===""||/\s/.test(n)||n.startsWith("{"))return;let t=n.indexOf("#");return t<0?void 0:mp(n.slice(t))}var gp="This share link is damaged or cut short. Ask for it again, or paste the text instead.";function yp(e){if(!e.parsed)return"Paste a complication first.";let n=e.name.trim();if(n==="")return"Give it a name first.";if(e.taken.has(n.toLowerCase()))return"A complication on this watch already has that name.";if(e.unchosen===1)return"One entity still needs choosing.";if(e.unchosen>1)return`${e.unchosen} entities still need choosing.`}var po="https://wrist-assistant.com/api/gallery",OT=["rectangular","circular","corner","inline","small","medium","large","xlarge"],bp=["weather","energy","climate","security","media","health","calendar","transport","lights","sensors","battery","other"],xp={weather:"Weather",energy:"Energy",climate:"Climate",security:"Security",media:"Media",health:"Health",calendar:"Calendar",transport:"Transport",lights:"Lights",sensors:"Sensors",battery:"Battery",other:"Other"},be={title:60,description:500,authorName:40,tags:5,slots:40,slotLabel:60,previews:8,shareTextBytes:64*1024,pngBytes:150*1024,bodyBytes:1024*1024},GT=/^[a-z0-9_]+\.shared_[0-9]+$/;function zl(e,n={}){let t=structuredClone(e),i=(a,r)=>r===void 0||r.trim()===""?a:r.trim();t.name=i(t.name,n.name);for(let a of t.groups??[])a.name=i(a.name,n.groupNames?.get(a.id));for(let a of t.values)a.name=i(a.name,n.valueNames?.get(a.id));for(let a of t.elements){let r=n.layerNames?.get(a.payload.id);a.payload.name!==void 0&&r!==void 0&&(a.payload.name=i(a.payload.name,r))}return t}function px(e){return bp.includes(e)}function hx(e){return new TextEncoder().encode(e).length}function wp(e,n,t,i={}){let a=[];for(let r of t.tags)px(r)&&!a.includes(r)&&a.push(r);return{shareText:Pa(zl(e,{...i,name:t.title}),"share",n),title:t.title.trim(),description:t.description.trim(),authorName:t.authorName.trim(),tags:a,families:Tt(e).filter(r=>OT.includes(r)),slots:n.map(r=>({id:r.placeholderId,label:r.label.trim()})),panelVersion:t.panelVersion}}var BT=new Set(["id","kind","type","join","domain","domains","entityId","displayName","supportedFamilies","perFamily","fontWeight","weight","fontDesign","design","fontWidth","width","alignment","style","cornerBodyShape","function","baseline","coloring","highlight","marker","highMarker","lowMarker","scale","at","place","barCorners","curve","smoothing","dots","fillStyle","stat","source","statType","statPeriod","hourCycle","minutes","timeField","timestampCorner","contentMode","symbol","path","viewBox","serviceDomain","serviceName","attachedTo","layer","chart","image","data","format","scaleFrom","groupId","partId","areaIds","labelIds","floorIds"]),VT=/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/,UT=/^#[0-9A-Fa-f]{3,8}$/,WT=/^-?\d+(\.\d+)?$/;function ni(e,n){if(n===void 0)return;let t=n.trim();t!==""&&!e.includes(t)&&e.push(t)}function fx(e,n,t={}){let i=zl(e,t),a=Da(i,n),r=[],o=[],s=[],l=[],c=[],d=[],u=new Set,p=[],f=[],g=[];for(let F of a.elements)if(ni(r,F.payload.name),F.kind==="list")for(let z of F.payload.template)ni(r,z.payload.name);(a.groups??[]).forEach((F,z)=>{ni(o,F.name),f.push({kind:"group",id:F.id,value:F.name,original:e.groups?.[z]?.name??F.name})}),a.values.forEach((F,z)=>{ni(s,F.name),g.push({kind:"shared",id:F.id,value:F.name,original:e.values[z]?.name??F.name})});for(let F of n)ni(l,F.label);let b=n.map(F=>({kind:"slot",id:F.placeholderId,value:F.label,original:F.label}));va(a,(F,z)=>(z.part==="template"&&ni(c,F),z.part==="serviceData"&&ni(d,F),F));let y=F=>{F?.kind.kind==="literal"&&u.add(F.kind.value.trim())},w=F=>{for(let z of F){for(let $ of z.cases)for(let A of $.then)A.kind==="setIcon"&&y(A.value);for(let $ of z.otherwise??[])$.kind==="setIcon"&&y($.value)}},k=[];for(let F of a.elements){if(F.kind==="icon"&&y(F.payload.symbol),F.kind==="image"){let z=Si(F.payload);z>0&&k.push(`Embedded image, ${Math.max(1,Math.round(z/1024))} KiB`)}w(F.payload.rules)}for(let F of Object.values(a.perFamily))F&&w(F.rules);let S=new Set([a.name.trim(),...r,...o,...s,...l,...c,...d,...u]),R=(F,z)=>{if(typeof F=="string"){let $=F.trim();if($===""||S.has($)||BT.has(z)||z.endsWith("Hex")||VT.test($)||UT.test($)||WT.test($)||Yi($))return;ni(p,$);return}if(Array.isArray(F)){for(let $ of F)R($,z);return}if(F!==null&&typeof F=="object")for(let[$,A]of Object.entries(F))R(A,$)};return R(JSON.parse(Pa(i,"share",n)),""),[{label:"Layer names",values:r},{label:"Group names",values:o,rows:f},{label:"Shared value names",values:s,rows:g},{label:"Slot labels",values:l,rows:b},{label:"Template text",values:c},{label:"Service data",values:d},{label:"Embedded pictures",values:k},{label:"Other text",values:p}].filter(F=>F.values.length>0)}function KT(e,n){let t=[];for(let i of e.matchAll(/[a-z0-9_]+(?:\.[a-z0-9_]+)+/g)){let a=i.index??0,r=a>0?e[a-1]:"",o=i[0].split(".");for(let s=0;s+1<o.length;s++){if(!n.has(o[s]))continue;let l=`${o[s]}.${o[s+1]}`,c=s++;if(Yi(l))continue;!(c===0&&(r==="'"||r==='"')&&o.length===2)&&!t.includes(l)&&t.push(l)}}return t}function mx(e,n,t,i,a={}){return yx(e,n,t,i,a).map(r=>r.text)}function gx(e,n,t,i,a={}){let r={details:[],send:[]};for(let o of yx(e,n,t,i,a))r[o.step].push(o.text);return r}function yx(e,n,t,i,a){let r=[],o={push:p=>{r.push({step:"send",text:p})}},s=p=>{r.push({step:"details",text:p})},l=wp(e,n,t,a);Pl(e)&&o.push("It reads entities by area, label or floor. Those belong to your Home Assistant, so pick the entities themselves before sending it to the gallery."),l.title===""&&s("Give it a title."),l.title.length>be.title&&s(`The title is longer than ${be.title} characters.`),l.description.length>be.description&&s(`The description is longer than ${be.description} characters.`),l.authorName.length>be.authorName&&s(`The nickname is longer than ${be.authorName} characters.`),t.tags.length>be.tags&&s(`Pick at most ${be.tags} tags.`),t.tags.some(p=>!px(p))&&s("One of the tags is not a gallery tag."),l.families.length===0&&o.push("It has no shape the gallery can show."),l.slots.length>be.slots&&o.push(`It reads ${l.slots.length} entities. The gallery takes at most ${be.slots}.`);for(let p of l.slots)GT.test(p.id)||o.push(`The gallery cannot take the slot ${p.id}, because its domain has characters other than letters and underscores.`),p.label.length>be.slotLabel&&o.push(`The label for ${p.id} is longer than ${be.slotLabel} characters.`);let c=hx(l.shareText);c>be.shareTextBytes&&o.push(`It is too big for the gallery: its text is ${Math.ceil(c/1024)} KB and the limit is ${be.shareTextBytes/1024} KB.`);let d=n.filter(p=>p.originalId!==""&&l.shareText.includes(p.originalId)),u=new Set;i&&va(Da(e,n),p=>{for(let f of KT(p,i))u.add(f);return p});for(let p of d)u.add(p.originalId);return u.size>0&&o.push(`Template or service data text names ${[...u].join(", ")} in a way sharing cannot replace. Write it in quotes, like states('sensor.example'), so it becomes a slot.`),r}var jT=["bad_json","too_large","invalid_field","schema_too_new","bad_png","rate_limited","not_found","not_updatable","forbidden","server_error"],rn=class extends Error{constructor(t,i,a,r){super(a?`${t}: ${a}`:t);this.code=t;this.status=i;this.detail=a;this.retryAfter=r;this.name="GalleryError"}},qT={shareText:"complication text",title:"title",description:"description",authorName:"nickname",tags:"tags",families:"shapes",slots:"slot labels",previews:"preview pictures",panelVersion:"panel version",replaces:"upload to update"};function Ol(e){if(!(e instanceof rn))return"Something went wrong. Try again.";switch(e.code){case"rate_limited":return"That is as many uploads as the gallery takes in a day. Try again tomorrow.";case"too_large":return"It is too big for the gallery.";case"invalid_field":{let n=e.detail===void 0?void 0:qT[e.detail.split(/[.[\s]/)[0]??""]??e.detail;return n===void 0?"The gallery did not accept one of the fields.":`The gallery did not accept the ${n}.`}case"schema_too_new":return"The gallery does not take complications made by this panel version yet.";case"bad_png":return"A preview picture could not be read. Close this and try again.";case"bad_json":return"The gallery could not read the upload. Update the Wrist Assistant integration and try again.";case"not_found":return"That upload is not in the gallery any more.";case"not_updatable":return"It has to be in the gallery before it can be updated. Wait for the review, then send the new version.";case"forbidden":return"The gallery did not accept this Home Assistant's key.";case"network":return"Could not reach the gallery. Check the connection and try again.";case"server_error":return"The gallery had a problem. Try again later."}}async function YT(e){let n="server_error",t;try{let a=await e.json();typeof a.error=="string"&&jT.includes(a.error)&&(n=a.error),typeof a.detail=="string"&&(t=a.detail)}catch{}e.status===429&&(n="rate_limited");let i=Number(e.headers.get("retry-after"));return new rn(n,e.status,t,Number.isFinite(i)&&i>0?i:void 0)}async function vp(e,n,t,i,a){let r={"X-Gallery-Key":i};a!==void 0&&(r["content-type"]="application/json");let o;try{o=await e(n,{method:t,headers:r,body:a,credentials:"omit",mode:"cors"})}catch{throw new rn("network",0)}if(!o.ok)throw await YT(o);return o}async function bx(e,n,t,i=po){let{replaces:a,...r}=t,o=JSON.stringify(a?{...r,replaces:a}:r);if(hx(o)>be.bodyBytes)throw new rn("too_large",0);let l=await(await vp(e,`${i}/submissions`,"POST",n,o)).json(),c={id:String(l.id??""),status:String(l.status??"pending")};return typeof l.replaces=="string"&&l.replaces!==""&&(c.replaces=l.replaces),c}function XT(e,n=po){if(e===null||typeof e!="object")return;let t=e,i=(...l)=>{for(let c of l)if(typeof t[c]=="string")return t[c];return null},a=(...l)=>{for(let c of l)if(typeof t[c]=="number"&&Number.isFinite(t[c]))return t[c];return 0},r=i("id");if(r===null||r==="")return;let o=i("preview_url","previewUrl"),s=i("replaces_id","replacesId");return{id:r,title:i("title")??"",status:i("status")??"pending",rejectReason:i("rejectReason","reject_reason"),createdAt:i("createdAt","created_at")??"",voteCount:a("voteCount","vote_count"),replacesId:s===""?null:s,updatedAt:i("updated_at","updatedAt"),importCount:a("import_count","importCount"),previewUrl:o===null||o===""?null:JT(o,n)}}function JT(e,n=po){if(/^https?:\/\//i.test(e))return e;let t=n.endsWith("/")?n:`${n}/`;try{return new URL(e.startsWith("/")?e:e.replace(/^\.\//,""),e.startsWith("/")?new URL(t).origin:t).toString()}catch{return e}}async function xx(e,n,t=po){let a=await(await vp(e,`${t}/mine`,"GET",n)).json();return Array.isArray(a.items)?a.items.map(r=>XT(r,t)).filter(r=>r!==void 0):[]}function kp(e){return e.replacesId!==null}function ho(e){return e.status==="pending"&&kp(e)}function wx(e){let n=new Set(e.map(r=>r.id)),t=new Map;for(let r of e){if(!kp(r)||r.replacesId===r.id||!n.has(r.replacesId))continue;let o=t.get(r.replacesId)??[];o.push(r),t.set(r.replacesId,o)}let i=new Set([...t.values()].flat().map(r=>r.id)),a=[];for(let r of e){if(i.has(r.id))continue;let o=t.get(r.id)??[];a.push({upload:r,updates:o,canUpdate:r.status==="approved"&&!o.some(ho)})}return a}function $p(e){if(e.status==="rejected")return e.rejectReason?e.rejectReason:"No reason was given.";if(ho(e))return"The old version stays up until this one is approved.";if(e.status==="pending")return"It shows in the gallery after it is approved.";if(e.status==="removed")return"It is no longer in the gallery.";let n=e.voteCount===1?"1 vote":`${e.voteCount} votes`,t=e.importCount===1?"added once":`added ${e.importCount} times`;return`${n} \xB7 ${t}`}async function vx(e,n,t,i=po){await vp(e,`${i}/mine/${encodeURIComponent(t)}`,"DELETE",n)}var ZT={pending:"Waiting for review",approved:"In the gallery",rejected:"Not approved",removed:"Removed"};function kx(e){return ho(e)?"New version in review":kp(e)&&e.status==="rejected"?"New version not approved":ZT[e.status]??e.status}var QT=2,eE=[QT,1.5,1];function tE(e){let n=structuredClone(e);return n.elements=n.elements.filter(t=>t.kind!=="imageTime"),n}function nE(e,n,t,i){let a=new Map;for(let g of t){let b=i.entityState(g.originalId);if(!b)continue;let y={...b,entityId:g.placeholderId,iconName:""};delete y.entityPicture,a.set(g.placeholderId,y)}let r=[],o=[];jt(e,g=>{r.push(g)}),jt(n,g=>{o.push(g)});let s=new Map;for(let g=0;g<Math.min(r.length,o.length);g++){let b=$a(r[g],e.values),y=$a(o[g],n.values);if(b===void 0||y===void 0)continue;let w=i.templateResults.get(b);w!==void 0&&s.set(y,w)}let l=new Map,c=new Map,d=(g,b)=>(y,w)=>{if(y===void 0||w===void 0)return;let k=g.get(y);k!==void 0&&b.set(w,k)},u=d(i.historySeries,l),p=d(i.templateResults,s),f=d(i.listItems??new Map,c);for(let g=0;g<Math.min(e.elements.length,n.elements.length);g++){let b=e.elements[g],y=n.elements[g];b.kind==="chart"&&y.kind==="chart"?(u(Wt(b.payload),Wt(y.payload)),u(Kt(b.payload),Kt(y.payload))):b.kind==="timeline"&&y.kind==="timeline"?u(st(b.payload),st(y.payload)):b.kind==="list"&&y.kind==="list"&&(p(Kn(b.payload.source,b.payload.rows),Kn(y.payload.source,y.payload.rows)),f(vn(b.payload.source),vn(y.payload.source)))}return{entityStates:a,templateResults:s,historySeries:l,listItems:c,namedValues:n.values}}async function $x(e,n,t,i){let a=Da(e,n),r=nE(e,a,n,t),o=Yt(tE(a),r),s=[];for(let l of de){let c=l,d=o[c];if(!d)continue;let u=await iE(_i(d,{icons:i,slot:ue[c],pictureScene:!0}));if(s.push({family:l,png:u}),s.length===be.previews)break}return s}async function iE(e){let n=document.createElement("div");Ro(e,n);let t=n.querySelector("svg");if(!t)throw new Error("nothing was drawn");let i=Number(t.getAttribute("width")),a=Number(t.getAttribute("height"));if(!(i>0)||!(a>0))throw new Error("the drawing has no size");let r=new XMLSerializer().serializeToString(t),o=await aE(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(r)}`);for(let s of eE){let l=document.createElement("canvas");l.width=Math.round(i*s),l.height=Math.round(a*s);let c=l.getContext("2d");if(!c)throw new Error("no canvas");c.drawImage(o,0,0,l.width,l.height);let d=await new Promise(u=>l.toBlob(u,"image/png"));if(d&&d.size<=be.pngBytes)return rE(d)}throw new Error("the picture is too large")}function aE(e){return new Promise((n,t)=>{let i=new Image;i.onload=()=>n(i),i.onerror=()=>t(new Error("the drawing could not be loaded")),i.src=e})}async function rE(e){let n=new Uint8Array(await e.arrayBuffer()),t="";for(let i=0;i<n.length;i+=32768)t+=String.fromCharCode(...n.subarray(i,i+32768));return btoa(t)}var oE="wrist-assistant-panel.picker-hidden.v1:",Cp=(e,n)=>window.fetch(e,n),Fp="wrist-assistant-gallery-nickname";function sE(){try{return window.localStorage.getItem(Fp)??""}catch{return""}}function lE(e){try{e===""?window.localStorage.removeItem(Fp):window.localStorage.setItem(Fp,e)}catch{}}var dE={"Layer names":"Layer name","Template text":"Template text","Service data":"Service data","Other text":"Other text"},Sp="https://wrist-assistant.com/gallery/";function Cx(e){let n=e.map(ae);return n.length<=1?n[0]??"":`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}function Sx(e){let n=e.elements.filter(t=>!we(e,t)).length;return n===1?"1 layer":`${n} layers`}var cE=3e4,uE=500,pE=3e4,Tx="preset-entity";function Ex(e){return`import-entity-${e}`}var hE={entityId:"",displayName:"",domain:""},fE=new Map,mE={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function Tp(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function gE(e){return e.kind==="family"?"look":"content"}function Ep(e){let n=e.document?.supportedFamilies;return Array.isArray(n)?n.filter(t=>typeof t=="string"):[]}function Rx(){return h`<span class="hstep" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h13" /><path d="M12 6l6 6-6 6" /></svg></span>`}function Mx(e){let n=v`<rect x="3" y="2" width="38" height="48" rx="11" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="1.5" />`,t=(a,r)=>v`<rect x=${22-a/2} y=${26-r/2} width=${a} height=${r} rx="3.5" fill="currentColor" />`,i;switch(e){case"rectangular":i=v`<rect x="8" y="21" width="28" height="10" rx="3" fill="currentColor" />`;break;case"circular":i=v`<circle cx="22" cy="26" r="8" fill="currentColor" />`;break;case"corner":i=v`<path d="M9 18a9 9 0 0 1 9-9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              <circle cx="11.5" cy="11.5" r="3" fill="currentColor" />`;break;case"small":i=t(13,13);break;case"medium":i=t(28,13);break;case"large":i=t(28,28);break;case"xlarge":i=t(28,42);break;default:i=v`<rect x="10" y="7" width="24" height="5" rx="2.5" fill="currentColor" />`}return h`<svg class="shape-art" viewBox="0 0 44 52" aria-hidden="true">${n}${i}</svg>`}var Fx=300,Ax=360,fo=44,mo=22,zx=[1,1.7,2.6],yE=["S","M","L"],Ix=["Small","Medium","Large"];function bE(){return zx.map((e,n)=>{let t=Math.round(fo*e),i=Math.round(mo*e),a=`.layers-card.s${n}`;return`
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
`)}var Lx="wrist-assistant-panel.layers.v1",Hx="wrist-assistant-panel.grid.v1",Tn=34,Xi=200,xE=720,Gl=320,wE=80,vE=56,_x="wrist-assistant-panel.columns.v3",Rp=e=>Math.max(Xi,Math.min(xE,Math.round(e))),Nx=e=>e.metaKey||e.ctrlKey||e.shiftKey;function kE(e,n,t){let a=e.querySelector(`g[data-element-id="${CSS.escape(n)}"]`)?.firstElementChild;if(!a||a.tagName.toLowerCase()!=="rect")return!1;let r=a.getBoundingClientRect();return t.clientX>=r.left&&t.clientX<=r.right&&t.clientY>=r.top&&t.clientY<=r.bottom}var $E=/^(range|checkbox|radio|color|button|submit|reset|file|image)$/,CE=3,za=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",ii=za==="Cmd"?"\u2318":"Ctrl+",Mp=za==="Cmd"?"\u21E7":"Shift+";function Dx(e,n,t){if(e<=0)return{columns:3,left:n,right:t};let i=e-wE;if(i>=Xi*2+Gl){let r=i-Gl,o=n,s=t;if(o+s>r){let l=r/(o+s);o=Math.max(Xi,Math.floor(o*l)),s=Math.max(Xi,Math.floor(s*l));let c=o+s-r;c>0&&(o>=s?o=Math.max(Xi,o-c):s=Math.max(Xi,s-c))}return{columns:3,left:o,right:s}}let a=e-vE;return a>=Xi+Gl?{columns:2,left:Math.min(n,a-Gl),right:t}:{columns:1,left:n,right:t}}var L=class L extends Rn{constructor(){super(...arguments);this.narrow=!1;this.colLeft=Fx;this.colRight=Ax;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=7;this.presets=[];this.occupied=[];this.serverToken=0;this.sendStatusKnown=!1;this.polling=!1;this.pushAvailable=!1;this.lastPushSeconds=null;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.historyReadings=new Map;this.listItems=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.helpSections=new Set;this.scrubStart=()=>this.draft?.beginGesture();this.scrubEnd=()=>this.draft?.endGesture();this.pickerOpen=!1;this.pickerFilter="all";this.pickerHiddenOpen=!1;this.sharedHelp=!1;this.thumbStep=0;this.layerDetail="compact";this.addOpen=!0;this.addDetail="expanded";this.multi=new Set;this.snapGrid=!0;this.gridStep=.01;this.showGridLines=!1;this.snapLayers=!0;this.guides=[];this.altHeld=!1;this.collapsed=new Set;this.activeFamily="rectangular";this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newOpen=!1;this.newName="";this.shareOpen=!1;this.shareMode="share";this.shareLabels=new Map;this.shareFamilies=new Set;this.dialogLitIds=[];this.shareGroupNames=new Map;this.shareValueNames=new Map;this.shareName="";this.shareLayerNames=new Map;this.shareNote="";this.shareTextOpen=!1;this.shareLinkShown=!1;this.galleryOpen=!1;this.galleryTab="new";this.galleryStep=1;this.galleryTitle="";this.galleryDescription="";this.galleryTags=new Set;this.galleryNickname="";this.galleryPreviewNote="";this.gallerySending=!1;this.gallerySent=!1;this.galleryError="";this.galleryUploadsError="";this.galleryPreviewRun=0;this.importOpen=!1;this.importText="";this.importName="";this.importMap=new Map;this.importDrop=!1;this.importDragDepth=0;this.importTextShown=!1;this.importHistory=new Map;this.importHistoryRun=0;this.helpTab="basics";this.linkReady=!1;this.recordPreviews=new Map;this.previewCase=Gs.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=_g(()=>this.requestUpdate());this.imageSizes=Ng(()=>this.requestUpdate());this.symbols=new Qs(()=>this.requestUpdate());this.keyHandler=t=>{t.key==="Alt"&&(this.altHeld=!0),this.onKey(t)};this.blurHandler=()=>{this.altHeld=!1};this.heldArrows=new Set;this.keyUpHandler=t=>{t.key==="Alt"&&(this.altHeld=!1),this.heldArrows.delete(t.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.fades=new nl;this.sizeObserver=new ResizeObserver(t=>{let i=t[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=t=>{this.draft?.dirty&&t.preventDefault()};this.menuOutside=t=>{let i=this.openMenu;if(i===void 0)return;t.composedPath().some(r=>r instanceof HTMLElement&&r.dataset.menu===i)||this.toggleMenu(i,!1)};this.pickerOutside=t=>{t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.newKeys=t=>{t.key==="Enter"&&(this.newName.trim()===""||this.newFamily===void 0||this.newNameProblem()!==void 0||(t.preventDefault(),this.createNew()))};this.importDragEnter=t=>{this.dragReadable(t)&&(t.preventDefault(),this.importDragDepth+=1,this.importDrop=!0)};this.importDragOver=t=>{this.dragReadable(t)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))};this.importDragLeave=()=>{this.importDragDepth!==0&&(this.importDragDepth-=1,this.importDragDepth===0&&(this.importDrop=!1))};this.importDropped=t=>{this.importDragDepth=0,this.importDrop=!1;let i=t.dataTransfer?.files?.[0];if(i){t.preventDefault(),this.readImportBlob(i);return}let a=t.dataTransfer?.getData("text/plain")??"";a!==""&&(t.preventDefault(),this.setImportText(a))};this.importPasted=t=>{if(this.importParse?.ok)return;let i=t.composedPath()[0];if(i instanceof HTMLTextAreaElement||i instanceof HTMLInputElement)return;let a=t.clipboardData?.files?.[0];if(a){t.preventDefault(),this.readImportBlob(a);return}let r=t.clipboardData?.getData("text/plain")??"";r.trim()!==""&&(t.preventDefault(),this.setImportText(r))};this.takeShareLink=()=>{let t=mp(window.location.hash);t!==void 0&&(history.replaceState(history.state,"",`${window.location.pathname}${window.location.search}`),this.pendingLink=t,this.linkReady&&this.openPendingLink())};this.importKeys={handleEvent:t=>{if(t.key!=="Enter"||t.target instanceof HTMLTextAreaElement)return;let i=this.importConfig();!i||pp(i,this.hass.states).some(o=>ep(Ex(o.entityId)))||yp({parsed:!0,name:this.importName,taken:this.takenNames(),unchosen:0})!==void 0||(t.preventDefault(),t.stopPropagation(),this.doImport())},capture:!0};this.presetKeys={handleEvent:t=>{t.key==="Enter"&&(this.presetEntity===void 0||ep(Tx)||(t.preventDefault(),t.stopPropagation(),this.createFromPreset()))},capture:!0};this.pressing=!1;this.pressStart=()=>{this.pressing=!0};this.pressEnd=()=>{window.setTimeout(()=>{this.pressing=!1})};this.sharedValueFocus=t=>{this.pressing||this.sharedValueOutside(t)};this.sharedValueOutside=t=>{if(this.openValue===void 0)return;let i=t.composedPath(),a=i[0];if(a instanceof HTMLElement&&a.classList.contains("values-list"))return;i.some(o=>o instanceof HTMLElement&&o.classList.contains("vitem")&&o.classList.contains("open"))||this.setOpenValue(void 0)}}get testValues(){return this.draft?.testValues??fE}static{this.styles=Xl`
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
      --wa-text: ${Pe(tt.text)};
      --wa-icon: ${Pe(tt.icon)};
      --wa-gauge: ${Pe(tt.gauge)};
      --wa-shape: ${Pe(tt.shape)};
      --wa-image: ${Pe(tt.image)};
      --wa-tap: ${Pe(tt.tap)};
      --wa-states: ${Pe(oe.states)};
      --wa-place: ${Pe(oe.place)};
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
      --thumb-w: ${fo}px; --thumb-h: ${mo}px;
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
    .layer.held { background: color-mix(in srgb, ${Pe(oe.group)} 12%, var(--wa-panel)); }
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
    .layer .chev {
      font: inherit; background: transparent; border: 0; color: var(--wa-muted); padding: 0; cursor: pointer;
      width: 24px; height: 24px; border-radius: 6px; display: grid; place-items: center; flex: none;
    }
    .layer .chev:hover { background: color-mix(in srgb, var(--wa-ink) 10%, transparent); }
    .layer .chev svg { width: 15px; height: 15px; transition: transform .15s ease-out; }
    .layer .chev[aria-expanded="false"] svg { transform: rotate(-90deg); }
    /* A list's row layers. They hang under the list the way a group's members
       hang under their folder, and they are not dragged: the grip column stays
       empty so the names still line up with the rows above. */
    .layer.rowkid { cursor: pointer; }
    .layer.rowkid .grip { cursor: default; }
    .layer.rowkid .bar { background: repeating-linear-gradient(180deg, var(--k) 0 4px, transparent 4px 7px); }
    .layer.rowkid .rowglyph { display: grid; place-items: center; width: var(--thumb-w); color: var(--wa-muted); }
    .layer.rowkid .rowglyph svg { width: 16px; height: 16px; }
    /* A folder shows a folder where a layer shows its picture. */
    .layer.group .folder { display: grid; place-items: center; width: var(--thumb-w); color: var(--wa-muted); }
    .layer.group .folder svg { width: 17px; height: 17px; }
    .layer.group .bar { background: repeating-linear-gradient(180deg, var(--k) 0 5px, transparent 5px 8px); }
    .layer.group.drop-into { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .layer .lockbtn { width: 24px; height: 24px; opacity: .55; }
    .layer .lockbtn svg.ui-icon { width: 15px; height: 15px; }
    .layer .lockbtn.on { opacity: 1; color: ${Pe(oe.locked)}; }
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
    .layer.drop-before { border-top: ${Tn}px solid transparent; }
    .layer.drop-after { border-bottom: ${Tn}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${Tn}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${Tn}px; }
    .layer.drop-after::after { bottom: -${Tn}px; }

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
    ${Pe(bE())}

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
    /* The banner that says the canvas is showing one cell of a list. Same card
       as the tools pill, sitting above it, and it wraps rather than pushing
       Done off the edge of a narrow canvas. */
    .row-strip {
      display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
      justify-self: center; max-width: 100%; font-size: 13px;
      padding: 7px 8px 7px 10px; border-radius: 12px;
      background: color-mix(in srgb, var(--wa-raised) 92%, transparent);
      box-shadow: 0 0 0 1px var(--wa-line), 0 6px 18px rgba(0,0,0,.18);
    }
    .row-strip .row-strip-thumb {
      width: ${fo}px; height: ${mo}px; border-radius: 4px; overflow: hidden;
      background: #000; flex: none; display: block;
    }
    .row-strip .row-strip-thumb svg { display: block; width: 100%; height: 100%; }
    .row-strip .row-strip-text { flex: 1 1 200px; min-width: 0; }
    .row-strip button {
      font: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; flex: none;
      height: 28px; padding: 0 14px; border-radius: 8px; border: 0;
      background: var(--wa-accent); color: var(--wa-accent-ink);
    }
    .row-strip button:hover { filter: brightness(1.06); }
    .row-strip button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
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
      background: color-mix(in srgb, ${Pe(oe.complication)} 8%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${Pe(oe.complication)} 25%, var(--wa-card));
    }
    .card.tint-states {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${Pe(oe.states)} 12%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${Pe(oe.states)} 35%, var(--wa-card));
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
    /* Entity 1, Entity 2 sit in rows with a remove button, and still start
       their box at the same x as every other row in the card. */
    .row-inline .field.entity-field { grid-template-columns: var(--wa-lab) minmax(0, 1fr); gap: 4px 8px; }
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
    /* A chosen entity: one row in place of the search box, exactly as tall as
       the box, so the label beside it and the rows under it never move when
       one swaps for the other. The name reads in the ordinary ink, the id
       after it is the quiet half and is cut first, the state sits right. The
       row is the edit target; the x beside it removes the entity. */
    .ent-anchor { position: relative; min-width: 0; }
    .ent-chosen {
      display: flex; align-items: center; height: 26px; min-width: 0; border-radius: 6px;
      background: var(--wa-field); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ent) 22%, transparent);
    }
    .ent-chosen:hover { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ent) 50%, transparent); }
    button.ent-pick {
      flex: 1; min-width: 0; height: 100%; display: flex; align-items: center; gap: 7px;
      font: inherit; font-size: 12px; text-align: left; padding: 0 8px 0 4px; border: 0; border-radius: 6px;
      background: none; color: var(--wa-ink); cursor: pointer;
    }
    button.ent-pick:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .ent-pick .ent-ico { width: 18px; height: 18px; border-radius: 4px; background: color-mix(in srgb, var(--wa-ent) 16%, transparent); color: var(--wa-ent); }
    .ent-pick .ent-ico.on { background: color-mix(in srgb, var(--wa-ent) 30%, transparent); }
    .ent-pick .ent-ico svg { width: 11px; height: 11px; }
    .ent-pick .ent-name { flex: 0 1 auto; min-width: 3em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
    .ent-pick .ent-id { flex: 1 1 0; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--wa-muted); }
    .ent-pick .ent-state { flex: none; max-width: 35%; margin-left: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    button.ent-clear {
      flex: none; width: 24px; height: 24px; margin-right: 1px; display: grid; place-items: center;
      padding: 0; border: none; border-radius: 5px; background: none; color: var(--wa-muted); cursor: pointer;
    }
    button.ent-clear:hover { background: var(--wa-panel); color: var(--wa-ink); }
    button.ent-clear svg { width: 12px; height: 12px; display: block; }

    .entity-results {
      border: 1px solid var(--wa-line); border-radius: 12px; margin-top: 6px; max-height: 340px; overflow: auto;
      background: var(--wa-raised); padding: 4px; box-shadow: 0 10px 28px rgba(0,0,0,.22);
    }
    /* In an inspector card the list floats over the rows under the box, like
       any dropdown, rather than pushing the card taller. The card clips its
       rounded corners, so it stops clipping while a search is open. Dialogs
       and the value popover keep the list in the flow, where a float would
       be cut off at their own edge. */
    .sec:has(.ent-box.open) { overflow: visible; }
    .sec-b .ent-anchor:not(.value-pop *) > .entity-results {
      position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 40; margin: 0;
      background: var(--wa-card); border-color: var(--wa-line-strong, var(--wa-line));
      box-shadow: 0 14px 36px rgba(0,0,0,.45);
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
    .ent .ent-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; color: var(--wa-ink); }
    .ent .ent-sub { display: flex; align-items: baseline; gap: 6px; min-width: 0; font-size: 11px; }
    .ent .ent-area { flex: none; color: var(--wa-muted); }
    /* The room and the id are one line, and the id is the half that may be
       cut: the room is short and the id's tail is the least useful part. */
    .ent .ent-area + .ent-id::before { content: "·"; margin-right: 6px; opacity: .5; }
    .ent .ent-id { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--wa-muted); }
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
    .val-tok, .entity-current .ent-state, .ent-pick .ent-state, .vchip .val, .chart-numbers b, .hint .nums, .readout-v .nums {
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
  `}firstUpdated(t){super.firstUpdated(t),this.renderRoot.addEventListener("change",i=>{let a=i.target;a?.tagName==="SELECT"&&a.blur()})}connectedCallback(){super.connectedCallback(),this.clearLegacyPickerHidden(),this.loadColumnWidths(),this.loadListView(),this.loadGrid(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("blur",this.blurHandler),window.addEventListener("beforeunload",this.beforeUnload),window.addEventListener("pointerdown",this.pressStart,{capture:!0}),window.addEventListener("pointerup",this.pressEnd,{capture:!0}),window.addEventListener("pointercancel",this.pressEnd,{capture:!0}),window.addEventListener("click",this.sharedValueOutside,{capture:!0}),window.addEventListener("focusin",this.sharedValueFocus),this.addEventListener(Al,this.scrubStart),this.addEventListener(Il,this.scrubEnd),window.addEventListener("hashchange",this.takeShareLink),this.takeShareLink(),this.loadOwners(),this.watchStatusTimer=window.setInterval(()=>{this.refreshWatchStatus()},pE)}loadColumnWidths(){try{let t=window.localStorage.getItem(_x);if(!t)return;let i=JSON.parse(t);typeof i.left=="number"&&(this.colLeft=Rp(i.left)),typeof i.right=="number"&&(this.colRight=Rp(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(_x,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}loadGrid(){try{let t=window.localStorage.getItem(Hx);if(!t)return;let i=JSON.parse(t);typeof i.on=="boolean"&&(this.snapGrid=i.on),Dc.includes(i.step)&&(this.gridStep=i.step),typeof i.lines=="boolean"&&(this.showGridLines=i.lines),typeof i.layers=="boolean"&&(this.snapLayers=i.layers)}catch{}}setGrid(t,i,a=this.showGridLines,r=this.snapLayers){this.snapGrid=t,this.gridStep=i,this.showGridLines=a,this.snapLayers=r;try{window.localStorage.setItem(Hx,JSON.stringify({on:t,step:i,lines:a,layers:r}))}catch{}}snapTarget(t){return{snap:{step:Ta(this.gridStep,ue[t]),on:this.snapGrid}}}guideTarget(t,i){let a=this.canvasConfig();if(!this.snapLayers)return{};let r=a===void 0?[]:Ct(a,t).filter(o=>!i.includes(o.payload.id)&&!we(a,o)).map(o=>_e(a,t,o)).filter(o=>!o.isHidden).map(o=>o.frame);return{guides:{lines:Fm(r),threshold:Mm(ue[t])}}}guideSink(){return{onGuides:t=>{this.guides=t}}}loadListView(){try{let t=window.localStorage.getItem(Lx);if(!t)return;let i=JSON.parse(t);(i.thumbStep===0||i.thumbStep===1||i.thumbStep===2)&&(this.thumbStep=i.thumbStep),(i.detail==="compact"||i.detail==="expanded")&&(this.layerDetail=i.detail),typeof i.addOpen=="boolean"&&(this.addOpen=i.addOpen),(i.addDetail==="compact"||i.addDetail==="expanded")&&(this.addDetail=i.addDetail)}catch{}}saveListView(){try{window.localStorage.setItem(Lx,JSON.stringify({thumbStep:this.thumbStep,detail:this.layerDetail,addOpen:this.addOpen,addDetail:this.addDetail}))}catch{}}renderGutter(t){return h`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(t,i)}
      @dblclick=${()=>{t==="left"?this.colLeft=Fx:this.colRight=Ax,this.saveColumnWidths()}}></div>`}beginColumnDrag(t,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=Dx(this.panelWidth,this.colLeft,this.colRight),s=t==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let l=u=>{if(u.pointerId!==i.pointerId)return;let p=u.clientX-r,f=Rp(t==="left"?s+p:s-p);t==="left"?this.colLeft=f:this.colRight=f},c=u=>{u.pointerId===i.pointerId&&(d(),this.saveColumnWidths())},d=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",l),a.removeEventListener("pointerup",c),a.removeEventListener("pointercancel",c);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",l),a.addEventListener("pointerup",c),a.addEventListener("pointercancel",c)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),this.fades.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("blur",this.blurHandler),window.removeEventListener("beforeunload",this.beforeUnload),window.removeEventListener("pointerdown",this.pressStart,{capture:!0}),window.removeEventListener("pointerup",this.pressEnd,{capture:!0}),window.removeEventListener("pointercancel",this.pressEnd,{capture:!0}),window.removeEventListener("click",this.sharedValueOutside,{capture:!0}),window.removeEventListener("focusin",this.sharedValueFocus),this.removeEventListener(Al,this.scrubStart),this.removeEventListener(Il,this.scrubEnd),window.removeEventListener("hashchange",this.takeShareLink),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.watchStatusTimer!==void 0&&window.clearInterval(this.watchStatusTimer),this.cancelGesture?.()}syncCountdownTicker(t){let i=de.map(r=>t[r]).filter(r=>r!==void 0),a=t.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(t){if(t.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(t.has("inspect")){let i=t.get("inspect");(i===void 0||Tp(i)!==Tp(this.inspect))&&(this.openSections=new Set(Xu),this.rowHoverId=void 0)}}updated(t){this.fades.refresh([this.renderRoot.querySelector(".column.inspector"),this.renderRoot.querySelector(".layers"),this.renderRoot.querySelector(".column.canvas")]);let i=Tp(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(t.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),t.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(t.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(t.has("hass")&&this.draft){let a={};for(let s of this.compiled?.entities.keys()??[])a[s]=this.hass.states[s]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(t){if(t.key==="Escape"&&this.picking){t.preventDefault(),this.togglePicking(!1);return}let i=t.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=a&&i?.tagName!=="SELECT"&&!$E.test(i?.type??""),o=this.renderRoot.querySelector("dialog[open]")!==null;if(t.key==="Escape"&&!a&&!o){this.rowEditList()?this.setRowEdit(void 0):this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if((t.key==="Delete"||t.key==="Backspace")&&!a&&!o){this.deleteSelection()&&t.preventDefault();return}let s=mE[t.key];if(s&&!a&&!t.metaKey&&!t.ctrlKey&&!t.altKey){this.nudge(s.dx,s.dy,t.shiftKey)&&(t.preventDefault(),this.heldArrows.add(t.key));return}if(!(t.metaKey||t.ctrlKey)||(t.key==="s"?(t.preventDefault(),this.save()):t.key==="z"&&!r?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):t.key==="y"&&!r&&(t.preventDefault(),this.redo()),r||o))return;let c=t.key.toLowerCase(),d=!0;c==="a"?this.selectAll():c==="c"?this.copySelection():c==="x"?this.copySelection()&&this.deleteSelection():c==="v"?this.pasteClip():c==="d"?this.duplicateSelection():c==="g"?t.shiftKey?this.ungroupSelection():this.groupPicked():c==="h"&&t.shiftKey?this.toggleHiddenSelection():t.key==="]"||t.key==="["?this.moveSelection(t.key==="]"?1:-1):d=!1,d&&t.preventDefault()}selectedIds(){let t=this.canvasConfig();if(!t)return[];if(this.multi.size>0)return[...this.multi].filter(a=>t.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?t.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?$t(t,i.id).map(a=>a.payload.id):[]}selectRows(t){t.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:t[0]}):t.length>1&&(this.multi=new Set(t))}deleteSelection(){let t=this.selectedIds();if(!this.canEdit||t.length===0)return!1;let i=this.rowEditList();return i?(this.mutate(a=>{let r=a.elements.find(o=>o.payload.id===i.payload.id);r?.kind==="list"&&(r.payload.template=r.payload.template.filter(o=>!t.includes(o.payload.id)),qi(r.payload))}),this.multi=new Set,this.inspect={kind:"layer",id:i.payload.id},!0):(this.mutate(a=>{for(let r of t)Se(a,r)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let t=this.draft?.config,i=this.selectedIds();return!t||i.length===0||this.rowEditList()?!1:(this.clipboard=xa(t,i,this.canvasFamily),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let t=this.clipboard,i=this.canvasFamily,a=[];this.mutate(r=>{a=Tf(r,t,i)}),this.selectRows(a)}duplicateSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=xa(t,i),r=[];this.mutate(o=>{r=gi(o,a)}),this.selectRows(r)}selectAll(){let t=this.draft?.config;if(!t)return;let i=Ct(t,this.canvasFamily).filter(a=>!we(t,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let t=this.draft?.config;if(!t||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?kt(t,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>ga(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(s=>t.elements.find(l=>l.payload.id===s)).filter(s=>s!==void 0).some(s=>!_e(t,a,s).isHidden);this.mutate(s=>{for(let l of i)Ae(s,a,l,{isHidden:o})})}moveSelection(t){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,t)}moveLayer(t,i){this.mutate(a=>{let r=a.elements.filter(u=>!we(a,u)),o=a.elements.filter(u=>we(a,u)),s=r.findIndex(u=>u.payload.id===t),l=s+i;if(s<0||l<0||l>=r.length)return;[r[s],r[l]]=[r[l],r[s]];let c=r[l],d=r[s];c.payload.groupId!==d.payload.groupId&&(d.payload.groupId===void 0?delete c.payload.groupId:c.payload.groupId=d.payload.groupId),a.elements=[...r,...o],_t(a),ma(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let t=await Bf(this.hass);if(this.owners=t.owners,this.maxSchemaVersion=t.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(t){this.loadError=`Could not load devices: ${on(t)}`}this.linkReady=!0,this.openPendingLink()}async selectOwner(t){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=t,this.pickerConfirmDelete=void 0,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0,this.sendStatusKnown=!1,this.lastSyncSeconds=void 0,this.pushAvailable=!1,this.lastPushSeconds=null;let i=this.owners.find(s=>s.owner_watch_id===t),a=Ve(i)==="iphone",r=a?zr:Pr,o=a?ng(i?.screen_size):ig(i?.screen_size);o?this.previewCase=o.label:r.some(s=>s.label===this.previewCase)||(this.previewCase=(a?Yc:Gs).label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await qf(this.hass,t,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let t=await Vf(this.hass,this.ownerId);this.records=t.records,this.maxSchemaVersion=t.max_schema_version,this.presets=t.presets??[],this.occupied=t.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=t.pages??[],this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,this.polling=t.polling??!1,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,typeof t.push_available=="boolean"&&(this.pushAvailable=t.push_available),t.last_push_seconds!==void 0&&(this.lastPushSeconds=typeof t.last_push_seconds=="number"?t.last_push_seconds:null),this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(t){this.loadError=`Could not load complications: ${on(t)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(t){t.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(t))}openRecord(t){this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=Ni.fromDocument(t.document,t.revision),this.savedName=String(t.document?.name??"");let i=Number(t.document?.schemaVersion??0),a=ms(t.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily()}catch(i){this.parseError=on(i)}this.scheduleTemplates(0)}startNew(t){return this.draft?.dirty&&!this.confirmDiscard()?!1:(this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new Ni(t,null),this.recompile(),this.ensureActiveFamily(),this.scheduleTemplates(0),!0)}freeSlot(){return wh(this.records.map(t=>Number(t.document?.slotIndex??-1)),this.occupied)}async refreshWatchStatus(){if(!(!this.ownerId||this.sendPending))try{let t=await Wf(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.lastSyncSeconds=typeof t.last_sync_seconds=="number"?t.last_sync_seconds:void 0,this.pushAvailable=t.push_available===!0,this.lastPushSeconds=typeof t.last_push_seconds=="number"?t.last_push_seconds:null,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0}catch{}}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},sm(this.selectedOwner?.device_kind))}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let t=await Uf(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,typeof t.push_available=="boolean"&&(this.pushAvailable=t.push_available),this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,t.pushed===!0?this.beginSendWait():typeof t.applied_token=="number"&&t.applied_token!==t.token&&this.beginSendWait()}catch(t){this.saveError=on(t)}}renderSendButton(){let t=lm({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending,lastPollSeconds:this.lastPollSeconds,deviceKind:this.selectedOwner?.device_kind,lastSyncSeconds:this.lastSyncSeconds,pushAvailable:this.pushAvailable});if((t.kind==="unsupported"||t.kind==="openApp")&&!this.sendStatusKnown)return m;let i=dm(t),a=i.resend&&this.hass.user?.is_admin?h`<button class="ghost" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:m,r=i.refresh&&this.hass.user?.is_admin?h`<button class="ghost" title="Send the phone a push so it pulls this now. iOS decides when the widget redraws; opening the app or tapping the widget redraws it at once." @click=${()=>{this.sendToWatch()}}>Refresh now</button>`:m;return h`<span class="send ${t.kind}" title=${i.title}>${t.kind==="sent"?"\u2713 ":""}${i.label}</span>${i.note?h`<span class="send-note" title=${i.title}>${i.note}</span>`:m}${a}${r}`}get slotChosen(){let t=this.draft?.config.slotIndex??-1;return t>=0&&t<fd}mutate(t,i){!this.draft||!this.canEdit||(this.draft.update(t,i,this.canvasFamily),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=Ar(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let t=Dh(this.draft.config);(this.compiled?.document!==this.compiledDocument||t!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=t,this.scheduleTemplates(uE))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let t=new qt(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,watchAppVersion:this.selectedOwner?.app_version,update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>t.resolve(i),canCountDown:i=>t.canCountDown(i),historySeries:i=>this.historySeries.get(i),historyReadings:i=>this.historyReadings.get(i),evaluateTest:i=>t.evaluateTest(i),liveBranch:i=>t.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.setRowEdit(void 0),this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),helpSections:this.helpSections,toggleHelp:i=>this.toggleHelp(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}},peekLayer:(i,a)=>{a?this.rowHoverId=i:this.rowHoverId===i&&(this.rowHoverId=void 0)},selectValue:i=>this.openSharedValue(i),beginGesture:()=>this.draft?.beginGesture(),copiedPosition:this.copiedPosition,copyPosition:i=>{this.copiedPosition=i},...this.rowEditList()?{rowEditListId:this.rowEditListId}:{},setRowEdit:i=>this.setRowEdit(i)}}setRowEdit(t){if(this.rowEditListId===t)return;let i=this.rowEditListId;this.cancelGesture?.(),this.multi=new Set,this.rowEditListId=t,t===void 0&&i!==void 0&&(this.inspect={kind:"layer",id:i})}rowEditList(){let t=this.rowEditListId;if(t===void 0)return;let i=this.draft?.config.elements.find(a=>a.payload.id===t);return i?.kind==="list"?i:void 0}canvasConfig(){let t=this.draft?.config;if(!t)return;let i=this.rowEditList();if(!i)return t;let a=ky(i.payload,this.templateResults,this.listItems,Date.now()/1e3);return Tb(t,i.payload.id,this.canvasFamily,a?.fields)??t}toggleSection(t){let i=new Set(this.openSections);i.has(t)?i.delete(t):(i.size<=1&&i.clear(),i.add(t)),this.openSections=i}toggleHelp(t){let i=new Set(this.helpSections);i.has(t)?i.delete(t):i.add(t),this.helpSections=i}get watchSupported(){let t=this.selectedOwner;return t?t.is_orphan||$g(t):!0}get ownerFamilies(){return Tg(this.selectedOwner)}get deviceWord(){return ru(this.selectedOwner)}get canvasFamily(){if(Ze(this.activeFamily))return this.activeFamily;let t=this.draft?.config;return(t&&Ys(t))??"rectangular"}ensureActiveFamily(){let t=this.draft?.config;if(!t)return;let i=this.ownerFamilies;t.supportedFamilies.includes(this.activeFamily)&&i.includes(this.activeFamily)||(this.activeFamily=Tt(t).find(a=>i.includes(a))??i[0]??"rectangular")}addHere(t){this.mutate(t)}static sizeWords(t){let i=ue[t];return`${i.width} \xD7 ${i.height} pt`}renderShapeIsBlank(t,i,a){if(t.elements.length===0||!Ze(this.activeFamily))return m;if(Ct(t,i).length>0)return m;let r=de.filter(o=>o!==i&&t.supportedFamilies.includes(o)).filter(o=>_l(t,o)>0);return h`<div class="blank-shape">
      <b>Nothing is on the ${ae(i)} shape yet.</b>
      <div class="hint">Each shape has its own layers. The ones on the other shapes belong to
        those shapes, so they are not listed here and nothing you do here can reach them. Add
        layers below, or take a copy of another shape's arrangement.</div>
      ${a&&r.length>0?h`<div class="adders">
            ${r.map(o=>h`<button class="small primary"
              title=${`Put a copy of every layer on the ${ae(o)} shape here, where it sits there, scaled to this canvas`}
              @click=${()=>this.mutate(s=>_b(s,o,i))}>Copy the ${ae(o)} layout</button>`)}
          </div>
          <div class="hint">The copies are layers of their own: editing one here changes nothing on
            the ${ae(r[0])} shape. They are scaled on the way in, because a point is a
            point and this canvas is ${L.sizeWords(i)} against
            ${L.sizeWords(r[0])}, so sizes come down to match and a round
            shape pulls the layout in off its rim. Expect to nudge it by hand afterwards.</div>`:m}
    </div>`}addShape(t){this.ownerFamilies.includes(t)&&(this.mutate(i=>Fg(i,t)),this.activeFamily=t,this.inspect={kind:"family"})}removeShape(t){let i=this.draft?.config;if(!i||!Xs(i,t))return;let a=Ag(i,t);a.length>0&&!window.confirm(`Remove the ${ae(t)} shape? This deletes ${a.join(", ")}. They are on this shape only, so nothing else in the complication loses anything.`)||(this.mutate(r=>lu(r,t)),this.ensureActiveFamily())}createNew(){let t=this.newFamily,i=this.newName.trim();!t||i===""||this.newNameProblem()!==void 0||(this.closeNewDialog(),this.startNew(xf(i,this.freeSlot(),[t])))}setForced(t,i){let a=new Map(this.forced);i==="live"?a.delete(t):a.set(t,i),this.forced=a}async save(t=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!t&&!this.draft.dirty)){if(!t&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(t){let s=this.freeSlot();if(s<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let l=structuredClone(i.config);l.id=re(),l.slotIndex=s,i=new Ni(l,null)}let a=i.encoded(),r=await Rc(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id;let o=this.draft.testValues;this.draft=Ni.fromDocument(r.record.document,r.record.revision),this.draft.testValues=o,this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=on(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}await this.deleteSaved(this.selectedId,this.draft.baseRevision)}}async deleteSaved(t,i){if(!this.ownerId)return;let a=t===this.selectedId;this.saving=!0;try{let r=await Kf(this.hass,this.ownerId,t,i);if(!r.ok){r.error==="conflict"&&a?this.conflict={current:r.current??null,message:r.message??"This complication changed on the server."}:this.saveError=r.message??r.error??"Delete failed";return}a&&(this.clearDraft(),this.selectedId=void 0),await this.loadRecords()}catch(r){this.saveError=on(r)}finally{this.saving=!1,this.confirmDelete=!1,this.pickerConfirmDelete=void 0}}duplicate(){if(!this.draft)return;let t=structuredClone(this.draft.config);t.id=re(),t.name=`${t.name} copy`,t.slotIndex=this.freeSlot(),this.startNew(t)}reloadFromServer(){let t=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,t&&!t.deleted?this.openRecord(t):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(t=>t.owner_watch_id===this.ownerId)}async moveAll(){let t=this.ownerId,i=this.moveTarget;if(!(!t||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await jf(this.hass,t,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=on(a)}finally{this.moving=!1}}}scheduleTemplates(t){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},t),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},cE)}async refreshHistorySeries(){let t=this.draft?.config,i=t?Mc(t):void 0;if(!i||Object.keys(i.history).length===0&&Object.keys(i.statistics).length===0){this.historySeries.size>0&&(this.historySeries=new Map),this.historyReadings.size>0&&(this.historyReadings=new Map);return}try{let a=await this.fetchSeries(i);this.historySeries=a.series,this.historyReadings=a.readings}catch{}}async refreshListItems(){let t=this.draft?.config,i=t?em(t):void 0;if(!i||Object.keys(i.requests).length===0){this.listItems.size>0&&(this.listItems=new Map);return}try{this.listItems=tm(await Qf(this.hass,i.requests))}catch{}}async fetchSeries(t){let[i,a]=await Promise.all([Xf(this.hass,t.history),Zf(this.hass,t.statistics).catch(()=>({}))]);return Jf({...i,...a})}static{this.IMPORT_HISTORY_DELAY_MS=350}scheduleImportHistory(){this.importHistoryTimer&&window.clearTimeout(this.importHistoryTimer),this.importHistoryTimer=window.setTimeout(()=>{this.importHistoryTimer=void 0,this.refreshImportHistory()},L.IMPORT_HISTORY_DELAY_MS)}async refreshImportHistory(){let t=this.importOpen?this.importPreview()?.config:void 0,i=t?Mc(t,r=>this.hass.states[r]!==void 0):void 0;if(i?.signature===this.importHistoryAsked)return;let a=++this.importHistoryRun;if(this.importHistoryAsked=i?.signature,!i||Object.keys(i.history).length===0&&Object.keys(i.statistics).length===0){this.importHistory.size>0&&(this.importHistory=new Map);return}try{let r=await this.fetchSeries(i);if(a!==this.importHistoryRun)return;this.importHistory=r.series}catch{a===this.importHistoryRun&&(this.importHistoryAsked=void 0)}}async refreshTemplates(){this.refreshHistorySeries(),this.refreshListItems();let t=this.compiled?.document;if(!t){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await Yf(this.hass,{doc:t})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=Of(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=on(i)}}entityStateFor(t,i,a){let r=this.hass.states[t];if(!r)return;let o=r.attributes,s=t.split(".")[0]??"",l={entityId:t,state:(a?this.testValues.get(t):void 0)??r.state,unitOfMeasurement:typeof o.unit_of_measurement=="string"?o.unit_of_measurement:void 0,iconName:i,domain:s};if(s==="timer"){l.timerState=r.state,typeof o.finishes_at=="string"&&(l.finishesAt=o.finishes_at);let c=SE(o.remaining);c!==void 0&&(l.remaining=c)}return typeof o.entity_picture=="string"&&(l.entityPicture=o.entity_picture),l}buildContext(t=!0){let i=new Map;for(let[o,s]of this.compiled?.entities??[]){let l=this.entityStateFor(o,s.iconName??"",t);l&&i.set(o,l)}let a=this.draft?.config.values??[],r=$y(this.draft?.config,this.templateResults,this.listItems,Date.now()/1e3);return{entityStates:i,templateResults:r.templateResults,listItems:r.listItems,historySeries:this.historySeries,namedValues:t?am(a,this.testValues):a,dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3,testedEntities:t?new Set(this.testValues.keys()):new Set}}renderPickButton(){let t=this.picking,i=!this.draft||this.parseError!==void 0;return h`<button class="pick ${t?"on":""}" ?disabled=${i}
      aria-pressed=${t?"true":"false"}
      title=${t?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span><span class="word">${t?"Picking\u2026":"Pick layer"}</span></button>`}renderShowTapsButton(){let t=this.showTaps;return h`<button class="pick ${t?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${t?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span><span class="word">Show taps</span></button>`}renderTintTool(){let t=this.previewTint,i=Xc.find(l=>l.hex===t),a=!this.draft||this.parseError!==void 0,r=Jt(this.activeFamily),o=r?"iPhone tinted":"tint",s=l=>{this.toggleMenu("tint",!1),this.previewTint=l};return h`<span class="inbox tint-box ${t!==void 0?"on":""}"
      title=${r?"A tinted Home Screen drops the tile's background and paints every layer in one colour, keeping only how bright each part was. Layers in the accent group take the lighter of the two colours.":"Many watch faces draw complications in one colour. Colours become the face's tint, text and background turn white, and only how see-through each part is survives."}>
      <span class="pre">Colour</span>
      <span class="case-tool" data-menu="tint">
        <button class="case-pick" ?disabled=${a} aria-haspopup="listbox" aria-expanded=${this.openMenu==="tint"?"true":"false"}
          aria-label=${`Preview colour, ${i?`${i.label} ${r?"tinted Home Screen":"tinted face"}`:"full colour"}`} @click=${()=>this.toggleMenu("tint")}>
          ${i?h`<i class="tint-dot" style=${`--sw:${i.hex}`}></i>${i.label} ${o}`:"Full colour"}${D("chevron")}
        </button>
        ${this.openMenu==="tint"?h`<div class="pop-menu" role="listbox" aria-label="Preview colour">
          <button class="row" role="option" aria-selected=${t===void 0?"true":"false"} @click=${()=>s(void 0)}>
            <i class="tint-dot full"></i>Full colour</button>
          ${Xc.map(l=>h`<button class="row" role="option" aria-selected=${l.hex===t?"true":"false"}
            @click=${()=>s(l.hex)}><i class="tint-dot" style=${`--sw:${l.hex}`}></i>${l.label} ${o}</button>`)}
        </div>`:m}
      </span>
    </span>`}renderZoomButton(){let t=!this.draft||this.parseError!==void 0||!Ze(this.activeFamily);return h`<button class="pick only-icon" ?disabled=${t} aria-label="Expand the preview"
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}>${D("expand")}</button>`}renderOver(){return h`<div class="over">
      <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}</span>
      <span class="bar-sep" aria-hidden="true"></span>
      <span class="face-tools">${this.renderSnapTools()}</span>
      <span class="bar-sep" aria-hidden="true"></span>
      ${this.renderZoomButton()}
    </div>`}renderRowStrip(){let t=this.rowEditList(),i=this.draft?.config;if(!t||!i)return m;let a=me(this.host()),r=Yt(i,this.buildContext(),this.forced)[this.canvasFamily];return h`<div class="row-strip">
      ${r?h`<span class="row-strip-thumb">${js(r,[t.payload.id],{icons:this.icons,imageSizes:this.imageSizes,width:fo,height:mo})}</span>`:m}
      <span class="row-strip-text">Designing the row of <b>${Ce(t,a)}</b>. Every row draws these layers.</span>
      <button @click=${()=>this.setRowEdit(void 0)}>Done</button>
    </div>`}renderSnapTools(){let t=!this.draft||this.parseError!==void 0||!Ze(this.activeFamily),i=this.snapGrid,a=this.showGridLines,r=this.snapLayers,o=a?v`<path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><circle cx="8" cy="8" r="1.9" />`:v`<path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><path d="M2.5 13.5l11-11" />`;return h`<span class="grid-tool ${i?"on":""}" data-menu="grid">
      <button class="pick ${i?"on":""}" ?disabled=${t} aria-pressed=${i?"true":"false"}
        title=${i?"Layers land on the grid when you drag them, and arrow keys move one grid step. Hold Alt to drag freely. Click to turn it off.":"Snap layers to a grid when you drag them. Without it, hold Alt while dragging to snap."}
        @click=${()=>this.setGrid(!i,this.gridStep)}><span class="glyph">▦</span><span class="word">Snap to grid</span></button>
      ${i?h`<button class="grid-step" ?disabled=${t} aria-haspopup="listbox" aria-expanded=${this.openMenu==="grid"?"true":"false"}
        aria-label=${`Grid size, ${this.gridStep*100}%`} title="Grid size"
        @click=${()=>this.toggleMenu("grid")}>${this.gridStep*100}%${D("chevron")}</button>
      ${this.openMenu==="grid"?h`<div class="pop-menu" role="listbox" aria-label="Grid size">
        ${Dc.map(s=>h`<button class="row" role="option" aria-selected=${s===this.gridStep?"true":"false"}
          @click=${()=>{this.toggleMenu("grid",!1),this.setGrid(!0,s)}}>${s*100}%</button>`)}
      </div>`:m}`:m}
    </span>
    <button class="pick ${a?"on":""}" ?disabled=${t} aria-pressed=${a?"true":"false"}
      title=${a?"Hide the grid lines. Snapping is not changed.":"Draw the grid on the face. Snapping is not changed."}
      @click=${()=>this.setGrid(i,this.gridStep,!a)}>
      <span class="glyph"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${o}</svg></span><span class="word">Grid lines</span></button>
    <button class="pick ${r?"on":""}" ?disabled=${t} aria-pressed=${r?"true":"false"}
      title=${r?"Edges and middles land on the other layers' edges and middles, and on the middle of the face, with a pink line while they meet. Click to turn it off.":"Snap to the other layers' edges and middles while dragging."}
      @click=${()=>this.setGrid(i,this.gridStep,a,!r)}><span class="glyph">${D("guides")}</span><span class="word">Snap to layers</span></button>`}renderZoomDialog(t,i,a){let r=this.draft?.config;if(!r)return m;let o=qn(a,t),s=t==="corner"?104/124:o.width/o.height;return h`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
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
    </dialog>`}renderHelpDialog(){let t=ii,i=Mp,a=[[`${t}S`,"Save"],[`${t}Z \xB7 ${i}${t}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${t}C \xB7 ${t}X \xB7 ${t}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${t}D`,"Duplicate the selection in place"],[`${t}A`,"Pick every layer"],[`${t}G \xB7 ${i}${t}G`,"Group the pick \xB7 Ungroup"],[`${t}] \xB7 ${t}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${t}H`,"Hide or show the selection in the shape being edited"],["Escape","Leave the row designer, then drop the pick, then the selection. Also stops Pick layer and closes a dialog"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${za}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a group to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Snapping","The three switches over the face. Snap to grid: layers land on a grid when you drag them, 1% by default, and arrows move one grid step; the size sits beside it. Grid lines draws the grid. Snap to layers: edges and middles land on the other layers' and on the middle of the face, with a pink line while they meet. Both snaps start on"],["Alt-drag","Flips snapping for that drag: a drag that would snap moves freely, and one that would not snaps to the grid"],["Expand","The button over the face. The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"]],o=[["Shapes","Rectangular, Circular, Corner and Inline are the kinds of slot on a watch face. The watch offers a complication only in slots whose shape it has."],["Shape tabs","Above the preview. Click one to edit that shape, or a dashed one to add it."],["Canvas shapes","Rectangular, Circular and Corner each hold their own layers. A layer belongs to one shape, so editing it never changes another. An empty shape can take a copy of another shape's layers."],["Corner","Its Corner content card picks big curved text or a canvas of layers."],["Inline","One line of text with an optional symbol before it. It has no layers."],["Home Screen","On an iPhone only: Small, Medium, Large and Extra Large are the Home Screen tile sizes. Each is a canvas shape with its own layers, drawn edge to edge in the tile."],["Small \xB7 Medium \xB7 Large","A square, a wide band about twice as wide as it is tall, and a tall tile a little taller than it is wide. Add the ones you want; a size the complication does not have is not offered when you add a widget."],["Extra Large","The full-page tile, iOS 27 and later. An iPhone on iOS 26 is not offered it when adding a widget, and everything else still draws."],["A tinted Home Screen","iOS 18 lets a user tint the whole Home Screen. The system then drops the tile background and draws the design in two tones, so a design that relies on colour alone reads differently there."],["The shape itself","The bottom row of the Layers list: its background, border and Shape states."]],s=[["Text","A value: typed words, an entity, a template, a shared value and more. It can count down to a time."],["Icon","An SF Symbol or Material Design icon, or the entity's own icon."],["Gauge","A number drawn between a minimum and a maximum."],["Chart","Recent history as bars, a line or an area."],["Timeline","Which state an entity was in over time, as a coloured strip."],["Shape","A rectangle, rounded rectangle, capsule, circle or line."],["Picture","A camera snapshot, or an entity's picture such as a person's avatar or album art."],["Tap area","Invisible. A tap inside it runs its own action. Outside it, the complication's tap action applies."],["Extras","Clock times, chart dots, a chart grid and a picture's timestamp are added from their layer's Extras card."],["Order","The top of the Layers list draws on top. Drag a row to reorder."],["Groups",`A set of layers kept together in the list. Pick some and press ${t}G. Locked, the group moves as one on the face. Unlocked, each layer moves alone. The watch never sees groups.`]],l=[["Content","What the layer shows, starting with its entity or value."],["Look","How it is drawn: size, colour and style. On a picture the card is called Picture."],["Extras","Charts, timelines and pictures only: labels, markers, clock times, dots, grid lines or a timestamp."],["States","Changes that apply while a value matches, described below."],["Position","Where the layer sits on the shape being edited, and its size."],["Tap","What a tap on the layer does."],["?","In a card's header: shows that card's help text."]],c=[["By value","Gauges, charts and text can colour by value instead of one colour. Each band colours readings up to its number, lowest band first. Readings above every band take the Above the last band colour."],["Timeline colours","A timeline colours each state from its own table."],["States","Rows that test a value, like is on or is greater than, each with the changes it makes: icon, text, colour, visibility and more. Rows are checked top to bottom and the first match wins. Otherwise applies when none match."],["Shape states","The same table, on the shape itself."],["Shared values","Like a variable: set it once under the Layers card, and every layer that reads it follows. On a layer, set Source to Shared value, or click Make shared."],["Values on the watch","Every entity and shared value the complication reads, with its live reading. Slide, pick or type another value to watch the preview and the states react. Nothing is saved, and Live or Back to live returns to the real reading."]],d=[["Save",`Writes the complication to Home Assistant (${t}S). A new one says Save new until then. Only an administrator can save.`],["The dot","Beside Save: unsaved changes, saved, or not saved yet. The footer says the same in words."],["Reaching the watch","The watch pulls saved changes by itself while Wrist Assistant is open on this home. There is no separate send step."],["Hide","The eye beside a complication in the list. It stops the watch offering that complication when you edit a face, and faces already using it keep it. Hidden ones fold into Hidden at the bottom of the list. For the open complication it saves with Save; for any other it saves at once."]],u=[["On watch","The watch has applied every change. With last seen beside it, the watch is not listening now, so a later save waits until the app is open again."],["Sending\u2026","Waiting for the watch to pull and confirm."],["Not on watch yet","The watch is connected but has not confirmed the latest change. Resend wakes it again."],["Open the watch app to sync","The watch is not listening. Open Wrist Assistant on the watch, or switch it to this home, and it pulls at once. Resend tries to wake it."],["Update the watch app","This watch has never reported a change. Its app is older than custom complications, or it has not opened this home yet."]],p=[["Share","In the top bar. Turns the open complication into text anyone can import. Your entity ids and names become numbered slots, and you can label each one."],["Backup","The other choice in Share: an exact copy, entity ids and names included. For your records, or another watch in this home."],["Copy link","A link to this panel with the text inside it. Opening it here fills in the Import dialog. On another home, paste the link into Import."],["Import","Beside New. Paste text or a link, choose a file, or drop one on the dialog. Check the preview, choose your own entity for each slot, then Import. It opens as unsaved work and reaches the watch at the first Save."]],f=w=>w.map(([k,S])=>h`<tr><th scope="row"><kbd>${k}</kbd></th><td>${S}</td></tr>`),g=(w,k)=>h`<section>
      <h3>${w}</h3>
      <table class="terms"><tbody>${k.map(([S,R])=>h`<tr><th scope="row">${S}</th><td>${R}</td></tr>`)}</tbody></table>
    </section>`,b=(w,k)=>h`<button role="tab" id=${`wa-help-${w}`} aria-selected=${this.helpTab===w?"true":"false"}
      @click=${()=>{this.helpTab=w}}>${k}</button>`,y;return this.helpTab==="keys"?y=h`
        <section>
          <h3>Keys</h3>
          <table><tbody>${f(a)}</tbody></table>
          <p class="hint">Keys act on layers only while nothing is being typed into. In a field they keep their usual meaning.</p>
        </section>
        <section>
          <h3>Mouse</h3>
          <table><tbody>${f(r)}</tbody></table>
        </section>`:this.helpTab==="sync"?y=h`<div>${g("Saving",d)}${g("Watch status",u)}</div>${g("Share and import",p)}`:y=h`<div>${g("Shapes",o)}${g("Cards",l)}</div><div>${g("Layers",s)}${g("Colour, states and values",c)}</div>`,h`<dialog class="help-dialog" @close=${()=>{this.helpOpen=!1}}>
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
    </dialog>`}setShowTaps(t){this.showTaps=t,t&&this.togglePicking(!1)}togglePicking(t=!this.picking){this.picking=t,this.pickHoverId=void 0,t&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(t){let i=this.canvasConfig();if(!i)return;let a=this.rawHitId(t);return a?xs(i,a):void 0}rawHitId(t){return t.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id")??void 0}rowLayerHitId(t){let i=this.draft?.config;if(!i||this.rowEditList())return;let a=this.rawHitId(t);return a!==void 0&&ba(i,a)?a:void 0}leaveRow(t){this.listHoverIds.length===t.length&&this.listHoverIds.every((a,r)=>t[r]===a)&&(this.listHoverIds=[])}onPickMove(t){this.picking&&(this.pickHoverId=this.hitLayerId(t))}pickAt(t,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(t!==this.activeFamily&&(this.activeFamily=t),this.inspect={kind:"layer",id:a})}onPreviewDoubleClick(t){if(!this.canEdit||this.picking||this.showTaps||this.rowEditList())return;let i=this.draft?.config;if(!i)return;let a=this.rawHitId(t)??this.lastPressHitId;if(a===void 0)return;let r=ba(i,a);if(r){this.cancelGesture?.(),this.setRowEdit(r.payload.id),this.inspect={kind:"layer",id:a};return}let o=i.elements.find(l=>l.payload.id===a);if(o?.kind!=="list")return;this.cancelGesture?.(),this.setRowEdit(o.payload.id);let s=o.payload.template[0];this.inspect={kind:"layer",id:s?s.payload.id:o.payload.id}}onPreviewPointerDown(t,i){let a=this.renderRoot,r="activeElement"in a?a.activeElement:null;if(r&&typeof r.blur=="function"&&!i.currentTarget?.contains(r)&&r.blur(),this.picking){i.preventDefault(),this.pickAt(t,i);return}let o=i.target,s=o.closest("[data-handle]")?.getAttribute("data-handle")??null,l=o.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0;this.lastPressHitId=l;let c=o.closest("svg.complication");if(this.showTaps){let M=this.focusTapId();if(M!==void 0&&l===M&&c&&this.draft&&this.canEdit){if(t!==this.activeFamily){this.activeFamily=t;return}i.preventDefault(),this.beginTapBoxGesture(t,i,c,M,s??void 0);return}let q=this.rowLayerHitId(i)??this.hitLayerId(i);q?this.inspect={kind:"layer",id:q}:l===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;let d=this.canvasConfig();if(!d)return;if(t!==this.activeFamily){this.activeFamily=t;return}let u=Nx(i),p=l!==void 0?xs(d,l):void 0;if(!u&&!s&&c&&this.multi.size>=2&&p!==void 0&&this.multi.has(p)){let M=bf(d,this.multi);if(i.preventDefault(),M.length===0)return;this.beginMoveGesture(t,i,c,M,`drag-pick-${t}`,()=>{this.multi=new Set,this.inspect={kind:"layer",id:p}});return}if(!u&&this.multi.size>0&&(this.multi=new Set),!l||!c)return;let f=xs(d,l),g=d.elements.find(M=>M.payload.id===f);if(!f||!g)return;if(u){i.preventDefault(),this.togglePick(f);return}let b,y=this.inspect.kind==="layer"?this.inspect.id:void 0;if(y!==void 0&&y!==f&&!s){let M=d.elements.find(x=>x.payload.id===y);M!==void 0&&M.kind!=="chartDots"&&M.kind!=="chartGrid"&&M.payload.chartAnchor?.place!=="through"&&kt(d,y)?.locked!==!0&&kE(c,y,i)&&(b=f,f=y,g=M)}let w=kt(d,f),k=w!==void 0&&this.inspect.kind==="group"&&this.inspect.id===w.id;if(w&&(w.locked||k)&&!s){let M=k||this.inspect.kind==="layer"&&kt(d,this.inspect.id)?.id===w.id;this.beginGroupGesture(t,i,c,w,M?f:void 0);return}if((this.inspect.kind!=="layer"||this.inspect.id!==f)&&(this.inspect={kind:"layer",id:f},s)||g.payload.chartAnchor?.place==="through")return;i.preventDefault();let S=_e(d,t,g).frame,R=this.gestureCanvas(t),O=g.payload.chartAnchor,F=O!==void 0&&!un(O.at)&&O.place!=="through",z=O!==void 0&&un(O.at)&&O.place==="through",$=ue[t],A={dx:O?.dx??0,dy:O?.dy??0},W=O!==void 0&&!s?Yt(d,this.buildContext(),this.forced)[t]?.elements.find(M=>M.id===f)?.frame:void 0,Q=W??S,I=M=>Math.round(M*10)/10;this.cancelGesture?.();let G=!1,J=s!==null?Yt(d,this.buildContext(),this.forced)[t]?.elements.find(M=>M.id===f):void 0;if(s!==null&&J?.kind==="icon"){let M=eu(J)/2,q=J.size;this.cancelGesture=Hm(c,i,s,{w:M,h:M},(x,T)=>{this.mutate(P=>{Ae(P,t,f,{size:Math.max(1,Math.round(q*x))})},`drag-${f}-${t}`),T&&(this.draft?.endGesture(),this.cancelGesture=void 0)});return}let te=J!==void 0?fg(J,Q,R):{};this.cancelGesture=Ls(c,R,i,{elementId:f,frame:Q,handle:s??void 0,...te,...O===void 0?{...this.snapTarget(t),...this.guideTarget(t,[f])}:{}},{...this.guideSink(),onFrame:(M,q,x)=>{if(x||(G=!0),x&&!G&&b!==void 0){this.inspect={kind:"layer",id:b},this.cancelGesture=void 0;return}this.mutate(T=>{if(O===void 0){Ae(T,t,M,{frame:q});return}let P=W?{width:S.width,height:S.height}:{width:q.width,height:q.height};Ae(T,t,M,{frame:{...q,...P,x:F?q.x:S.x,y:S.y}});let C=T.elements.find(j=>j.payload.id===M)?.payload.chartAnchor;if(C===void 0)return;let _=A.dx,B=z?A.dy:I(A.dy+(q.y-Q.y)*$.height);_?C.dx=_:delete C.dx,B?C.dy=B:delete C.dy},`drag-${M}-${t}`),x&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}beginGroupGesture(t,i,a,r,o){let s=this.draft?.config;if(!s)return;let l=$t(s,r.id);if(l.length===0)return;o===void 0&&(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let c=o===void 0?void 0:()=>{this.inspect={kind:"layer",id:o}};this.beginMoveGesture(t,i,a,l.map(d=>d.payload.id),`drag-group-${r.id}-${t}`,c)}beginMoveGesture(t,i,a,r,o,s){let l=this.canvasConfig();if(!l)return;let c=l.elements.filter(F=>r.includes(F.payload.id));if(c.length===0)return;let d=new Map(c.map(F=>[F.payload.id,_e(l,t,F).frame])),u=[...d.values()],p=Math.min(...u.map(F=>F.x)),f=Math.min(...u.map(F=>F.y)),g=Math.max(...u.map(F=>F.x+F.width)),b=Math.max(...u.map(F=>F.y+F.height)),y={x:p,y:f,width:g-p,height:b-f,rotationDegrees:0},w=F=>Math.round(F*1e3)/1e3;this.cancelGesture?.();let k=!1,S=F=>{F.pointerId===i.pointerId&&Math.hypot(F.clientX-i.clientX,F.clientY-i.clientY)>CE&&(k=!0)};a.addEventListener("pointermove",S);let R=()=>a.removeEventListener("pointermove",S),O=Ls(a,this.gestureCanvas(t),i,{elementId:o,frame:y,...this.snapTarget(t),...this.guideTarget(t,r)},{...this.guideSink(),onFrame:(F,z,$)=>{if($&&R(),!$&&!k)return;if($&&!k&&s!==void 0){s(),this.cancelGesture=void 0;return}let A=z.x-y.x,W=z.y-y.y;this.mutate(Q=>{for(let[I,G]of d)Ae(Q,t,I,{frame:{...G,x:w(G.x+A),y:w(G.y+W)}})},o),$&&(this.draft?.endGesture(),this.cancelGesture=void 0)}});this.cancelGesture=()=>{R(),O()}}nudge(t,i,a){let r=this.canvasConfig();if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?Lm:1,s=t*o,l=i*o,c=this.canvasFamily,d=ue[c];if(this.multi.size>=2)return this.nudgeMany([...this.multi],c,d,`nudge-multi-${c}`,s,l);if(this.inspect.kind==="group"){let w=this.inspect.id;return this.nudgeMany($t(r,w).map(k=>k.payload.id),c,d,`nudge-group-${w}-${c}`,s,l)}if(this.inspect.kind!=="layer")return!1;let u=this.inspect.id,p=r.elements.find(w=>w.payload.id===u);if(!p||p.payload.chartAnchor?.place==="through")return!1;let f=kt(r,u);if(f?.locked)return this.nudgeMany($t(r,f.id).map(w=>w.payload.id),c,d,`nudge-group-${f.id}-${c}`,s,l);let g=_e(r,c,p).frame,b=p.payload.chartAnchor;if(b!==void 0){let w=!un(b.at);return l===0&&!(w&&s!==0)||this.mutate(k=>{w&&s!==0&&Ae(k,c,u,{frame:Is(g,s,0,d)});let S=k.elements.find(O=>O.payload.id===u)?.payload.chartAnchor;if(S===void 0||l===0)return;let R=Math.round(((S.dy??0)+l)*10)/10;R?S.dy=R:delete S.dy},`nudge-${u}-${c}`),!0}let y=this.snapGrid?Oc(g,s,l,Ta(this.gridStep,d)):Is(g,s,l,d);return(y.x!==g.x||y.y!==g.y)&&this.mutate(w=>Ae(w,c,u,{frame:y}),`nudge-${u}-${c}`),!0}nudgeMany(t,i,a,r,o,s){let l=this.canvasConfig();if(!l)return!1;let c=R=>Math.round(R*1e3)/1e3,d=new Map;for(let R of t){let O=l.elements.find(F=>F.payload.id===R);O&&d.set(R,_e(l,i,O).frame)}if(d.size===0)return!1;let u=[...d.values()],p=Math.min(...u.map(R=>R.x)),f=Math.min(...u.map(R=>R.y)),g=Math.max(...u.map(R=>R.x+R.width)),b=Math.max(...u.map(R=>R.y+R.height)),y={x:p,y:f,width:g-p,height:b-f,rotationDegrees:0},w=this.snapGrid?Oc(y,o,s,Ta(this.gridStep,a)):Is(y,o,s,a),k=w.x-y.x,S=w.y-y.y;return(k!==0||S!==0)&&this.mutate(R=>{for(let[O,F]of d)Ae(R,i,O,{frame:{...F,x:c(F.x+k),y:c(F.y+S)}})},r),!0}gestureCanvas(t){let i=Bs(this.previewSlot(t),t);if(t!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=iu(i.scale,r);return{width:o,height:o}}focusTapId(){let t=this.draft?.config;if(!t||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=t.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:lt(t,i)[0]?.payload.id}beginTapBoxGesture(t,i,a,r,o){let s=this.draft?.config,l=s?.elements.find(u=>u.payload.id===r);if(!s||!l)return;let c=we(s,l),d=_e(s,t,l).frame;this.cancelGesture?.(),this.cancelGesture=Ls(a,this.gestureCanvas(t),i,{elementId:r,frame:d,handle:o,...this.snapTarget(t)},{onFrame:(u,p,f)=>{this.mutate(g=>{c?kf(g,u,t,p):Ae(g,t,u,{frame:p})},`tap-box-${u}-${t}`),f&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let t=this.draft,i=!!t?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:Dx(this.panelWidth,this.colLeft,this.colRight),r=this.records.find(o=>o.id===this.selectedId);return h`
      <header>
        <label>${this.owners.some(o=>Ve(o)==="iphone")?"Choose device":"Choose watch"}
          <select @change=${o=>{this.selectOwner(o.target.value)}}>
            ${TE(this.owners).map(o=>h`<option value=${o.owner_watch_id} ?selected=${o.owner_watch_id===this.ownerId}>
              ${Px(o)} (${o.complication_count})</option>`)}
          </select>
        </label>
        ${Rx()}
        <label class="pick-label" for="wa-picker">Choose complication</label>
        ${this.renderPicker()}
        ${this.hass.user?.is_admin?h`<span class="hor" aria-hidden="true">or</span>${Rx()}`:m}
        ${this.renderNewButton()}
        ${t?h`<button class="new-btn" aria-haspopup="dialog" aria-expanded=${this.shareOpen?"true":"false"}
          title="Share or back up this complication as text, a file or a link"
          @click=${()=>this.openShareDialog()}><span>Share</span></button>`:m}
        <span class="spacer"></span>
        <button class="help" title="Help" aria-label="Help" @click=${()=>{this.helpOpen=!0}}>?</button>
        <div class="toolbar hbox hist">
          <button class="icon" @click=${()=>this.undo()} ?disabled=${!t?.canUndo} title="Undo (⌘Z)" aria-label="Undo">${D("undo")}</button>
          <span class="hdiv"></span>
          <button class="icon" @click=${()=>this.redo()} ?disabled=${!t?.canRedo} title="Redo (⇧⌘Z)" aria-label="Redo">${D("redo")}</button>
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
          ${this.renderFooter()}`:this.renderWatchGate()}`}renderWatchGate(){let t=this.selectedOwner,i=Ve(t)==="iphone",a=t?.complication_count??0,r=a===0?`Nothing on this ${ru(t)} changes until then.`:`Your ${a} complication${a===1?"":"s"} keep${a===1?"s":""} working until then.`,o=i?h`<li>
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
        <div class="gate-glyph">${D("watch")}</div>
        <div class="gate-eyebrow">${i?"iPhone app update coming soon":"Watch app update coming soon"}</div>
        <h2 class="gate-title">${i?"This iPhone needs the new app.":"This watch needs the new app."}</h2>
        <p class="gate-lead">${Cg(t)}</p>
        <ol class="gate-steps">
          ${o}
        </ol>
        <div class="gate-foot">${r}</div>
      </div>
    </div>`}pickerRows(){let t=this.records.map(a=>({slot:Number(a.document?.slotIndex??0),kind:"record",record:a}));return[...t,...vh(t.map(a=>a.slot),this.occupied).map(a=>a.kind==="custom"?{slot:a.slot,kind:"locked",name:a.name||"Unnamed complication",badge:a.home||"Other home",title:`A complication on ${a.home?`the ${a.home} home`:"another home"}${a.families?.length?` (${a.families.map(ae).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:a.families??[]}:{slot:a.slot,kind:"locked",name:a.name||"Unnamed preset",badge:"iPhone",title:"Still on the iPhone. Open the Wrist Assistant app on the iPhone to move it here.",families:[]})].sort((a,r)=>a.slot-r.slot)}shapeDots(t){return h`<span class="shape-dots">${this.ownerFamilies.map(i=>h`<span class="shape-dot ${i} ${t.includes(i)?"on":""}" title=${ae(i)}></span>`)}</span>`}static{this.FILTER_FROM_ROWS=8}recordPreview(t){let i=this.recordPreviews.get(t.id);if(i&&i.revision===t.revision)return i;try{let a=ha(t.document),r={revision:t.revision,config:a,entities:[...Ar(a).entities.values()]};return this.recordPreviews.set(t.id,r),r}catch{this.recordPreviews.delete(t.id);return}}renderRowArt(t){let i=this.recordPreview(t);if(!i)return h`<span class="pk-art"></span>`;let a=i.config,o=(this.pickerFilter!=="all"&&a.supportedFamilies.includes(this.pickerFilter)?this.pickerFilter:void 0)??Ys(a)??"inline";return this.renderConfigArts(a,i.entities,[o],"pk-art")[0]}renderConfigArts(t,i,a,r,o){let s=this.configLayouts(t,i,o);return a.map(l=>{if(l==="inline")return h`<span class="${r} inline">${this.renderInlinePreview(s.inline,!0)}</span>`;let c=s[l];return c?h`<span class="${r} ${l}">${_i(c,{icons:this.icons,imageSizes:this.imageSizes,slot:qn(this.referenceCase,l)})}</span>`:h`<span class=${r}></span>`})}configLayouts(t,i,a){let r=new Map;for(let o of i){let s=this.entityStateFor(o.entityId,o.iconName??"",!1);s&&r.set(o.entityId,s)}return Yt(t,{entityStates:r,templateResults:new Map,...a?{historySeries:a}:{},namedValues:t.values})}renderPickerFilter(t){let i=r=>r.kind==="record"?Ep(r.record):r.families,a=(r,o,s)=>h`<button
      class="pk-chip ${this.pickerFilter===r?"on":""}" ?disabled=${s===0}
      aria-pressed=${this.pickerFilter===r?"true":"false"}
      @click=${()=>{this.pickerFilter=r}}>${o}<span class="pk-count">${s}</span></button>`;return h`<div class="pk-filter">
      ${a("all","All",t.length)}
      ${this.ownerFamilies.map(r=>a(r,ae(r),t.filter(o=>i(o).includes(r)).length))}
    </div>`}renderPicker(){let t=this.draft,i=t?t.config.name.trim()||"Untitled":"No complication",a=t?t.config.supportedFamilies:[],r=this.pickerRows(),o=this.pickerFilter,s=o==="all"?r:r.filter(c=>(c.kind==="record"?Ep(c.record):c.families).includes(o)),l=yf(s,c=>c.kind==="record"?{id:c.record.id,hidden:this.rowHidden(c.record)}:void 0,this.selectedId);return h`<div class="picker">
      <button id="wa-picker" aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(a)}
        <span class="pk-name">${i}</span>
        ${t&&t.baseRevision===null?h`<span class="pk-rev">unsaved</span>`:m}
        ${D("chevron")}
      </button>
      ${this.pickerOpen?h`<div class="menu" role="listbox">
        ${r.length>=L.FILTER_FROM_ROWS?this.renderPickerFilter(r):m}
        ${r.length===0&&!(t&&t.baseRevision===null)?h`<div class="empty">No complications for this ${this.deviceWord} yet.</div>`:m}
        ${r.length>0&&s.length===0?h`<div class="empty">Nothing on this ${this.deviceWord} has a ${o==="all"?"":ae(o)} shape.</div>`:m}
        ${l.shown.map(c=>this.renderPickerRow(c))}
        ${t&&t.baseRevision===null?h`<div class="row" aria-current="true"><span class="pk-art"></span><span class="pk-name">${i}</span>${this.shapeDots(a)}<span class="pk-badge">unsaved</span></div>`:m}
        ${l.hidden.length>0?h`
          <button type="button" class="pk-hidden-head" aria-expanded=${this.pickerHiddenOpen?"true":"false"}
            @click=${()=>{this.pickerHiddenOpen=!this.pickerHiddenOpen}}>
            ${D("chevron")}<span>Hidden (${l.hidden.length})</span>
          </button>
          ${this.pickerHiddenOpen?l.hidden.map(c=>this.renderPickerRow(c)):m}`:m}
      </div>`:m}
    </div>`}renderPickerRow(t){if(t.kind!=="record")return h`<button type="button" class="row locked" role="option" aria-disabled="true" title=${t.title}
          @click=${()=>{this.pickerNote=this.pickerNote===t.slot?void 0:t.slot}}>
          <span class="pk-art"></span>
          <span class="pk-name">${t.name}</span>
          ${this.shapeDots(t.families)}
          <span class="pk-badge">${t.badge}</span>
        </button>
        ${this.pickerNote===t.slot?h`<div class="pk-note">${t.title}</div>`:m}`;let i=t.record,a=i.id===this.selectedId,r=this.rowHidden(i),o=String(i.document?.name??"Untitled"),s=a?this.canEdit:!!this.hass.user?.is_admin,l=s,c=this.pickerConfirmDelete===i.id,d=u=>u.stopPropagation();return h`<div class="row rec ${r?"dim":""}" aria-current=${a?"true":"false"}>
      <button type="button" class="pick" role="option" aria-selected=${a?"true":"false"}
        @click=${()=>{this.togglePicker(!1),this.selectRecord(i)}}>
        ${this.renderRowArt(i)}
        <span class="pk-name">${o}</span>
        ${this.shapeDots(Ep(i))}
      </button>
      <span class="pk-acts">
        ${c?h`<button type="button" class="ghost danger small" ?disabled=${this.saving}
              @click=${u=>{d(u),a?this.deleteCurrent():this.deleteSaved(i.id,i.revision)}}>Really delete</button>
            <button type="button" class="ghost small" @click=${u=>{d(u),this.pickerConfirmDelete=void 0}}>Cancel</button>`:h`${l?h`<button type="button" class="icon" ?disabled=${!a&&this.saving}
              title=${r?"Hidden from the watch's complication list. Show it there again.":"Hide from the watch's complication list. Faces already using it keep it."}
              aria-label=${r?`Show ${o} in the watch's complication list`:`Hide ${o} from the watch's complication list`}
              @click=${u=>{d(u),this.setPickerHidden(i,!r)}}>${D(r?"hide":"show")}</button>`:m}
            ${s?h`<button type="button" class="icon danger" title="Delete this complication" aria-label=${`Delete ${o}`}
              ?disabled=${this.saving} @click=${u=>{d(u),this.pickerConfirmDelete=i.id}}>${D("delete")}</button>`:m}`}
      </span>
    </div>`}rowHidden(t){return t.id===this.selectedId&&this.draft?this.draft.config.hidden===!0:mf(t.document)}async setPickerHidden(t,i){if(this.ownerId){if(t.id===this.selectedId){this.mutate(a=>{i?a.hidden=!0:delete a.hidden});return}if(!(!this.hass.user?.is_admin||this.saving||!t.document)){this.saving=!0,this.saveError=void 0;try{let a=gf(t.document,i),r=await Rc(this.hass,this.ownerId,a,t.revision);if(!r.ok){this.saveError=r.error==="conflict"?`${String(t.document.name??"That complication")} changed on the server. Try again.`:r.message??r.error??"Save failed";return}this.beginSendWait(),await this.loadRecords()}catch(a){this.saveError=on(a)}finally{this.saving=!1}}}}clearLegacyPickerHidden(){try{let t=window.localStorage,i=[];for(let a=0;a<t.length;a++){let r=t.key(a);r?.startsWith(oE)&&i.push(r)}for(let a of i)t.removeItem(a)}catch{}}toggleMenu(t,i=this.openMenu!==t){this.openMenu=i?t:this.openMenu===t?void 0:this.openMenu,this.openMenu!==void 0?window.addEventListener("pointerdown",this.menuOutside,{capture:!0}):window.removeEventListener("pointerdown",this.menuOutside,{capture:!0})}togglePicker(t=!this.pickerOpen){this.pickerOpen=t,t||(this.pickerNote=void 0,this.pickerConfirmDelete=void 0),t?window.addEventListener("pointerdown",this.pickerOutside,{capture:!0}):window.removeEventListener("pointerdown",this.pickerOutside,{capture:!0})}renderNewButton(){if(!this.hass.user?.is_admin)return m;let t=this.freeSlot()<0;return h`<div class="newc">
      <button class="new-btn primary" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.newOpen?"true":"false"}
        title=${t?`This ${this.deviceWord} has no free slot. Delete a complication first.`:"Make a new complication"}
        @click=${()=>this.openNewDialog()}>${D("plus")}<span>New</span></button>
      <button class="new-btn" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.importOpen?"true":"false"}
        title=${t?`This ${this.deviceWord} has no free slot. Delete a complication first.`:"Paste a complication somebody shared"}
        @click=${()=>this.openImportDialog()}><span>Import</span></button>
      ${t?h`<span class="newc-full">${this.deviceWord} is full</span>`:m}
    </div>`}takenNames(){let t=[...this.records.map(i=>String(i.document?.name??"")),...this.occupied.map(i=>"name"in i&&typeof i.name=="string"?i.name:"")];return new Set(t.map(i=>i.trim().toLowerCase()).filter(i=>i!==""))}newNameProblem(){let t=this.newName.trim();if(t!==""&&this.takenNames().has(t.toLowerCase()))return`A complication on this ${this.deviceWord} already has that name.`}renderNewDialog(){let t=this.newNameProblem(),i=this.newName.trim()!=="",a=i&&t===void 0&&this.newFamily!==void 0;return h`<dialog class="new-dialog" @keydown=${this.newKeys} @close=${()=>{this.newOpen=!1}}>
      <div class="new-head">
        <h2>New complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${()=>this.closeNewDialog()}>${D("close")}</button>
      </div>
      <div class="new-body">
        <div class="field">
          <span>Name</span>
          <input type="text" .value=${this.newName} placeholder="Kitchen at a glance" maxlength="60"
            aria-label="Complication name" aria-invalid=${t?"true":"false"}
            @input=${r=>{this.newName=r.target.value}} />
        </div>
        ${t?h`<div class="hint err">${t}</div>`:h`<div class="hint">${Ve(this.selectedOwner)==="iphone"?"This is the name the Lock Screen customise screen and the Home Screen widget picker show, so make it one you will recognise there.":"This is what the name shows on the watch face picker, so make it one you will recognise there."}</div>`}
        <div class="field new-shapes">
          <span>Shape</span>
          <div class="shape-groups" role="radiogroup" aria-label="Shape">
            ${Mg(this.ownerFamilies,Eg(this.selectedOwner)).map(r=>h`<div class="shape-group">
              ${r.label?h`<span class="shape-group-label">${r.label}</span>`:m}
              <div class="shape-cards">
                ${r.families.map(o=>h`<button type="button" role="radio" class="shape-card ${this.newFamily===o?"on":""}"
                  aria-checked=${this.newFamily===o?"true":"false"}
                  @click=${()=>{this.newFamily=o}}>
                  ${Mx(o)}
                  <span class="shape-card-name">${ae(o)}</span>
                  ${Yn(o)?h`<span class="shape-card-note">${Yn(o)}</span>`:m}
                </button>`)}
                ${(r.comingSoon??[]).map(o=>h`<button type="button" role="radio" class="shape-card soon" disabled
                  aria-checked="false" aria-disabled="true" title="Coming soon">
                  ${Mx(o)}
                  <span class="shape-card-name">${ae(o)}</span>
                  <span class="shape-card-note">Coming soon${Yn(o)?h`<br />${Yn(o)}`:m}</span>
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
    </dialog>`}openNewDialog(){this.freeSlot()<0||(this.newOpen=!0,this.newName="",this.newFamily=void 0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.new-dialog");t&&(t.open||t.showModal(),t.querySelector("input[type=text]")?.focus())}))}closeNewDialog(){let t=this.renderRoot.querySelector("dialog.new-dialog");t?.open?t.close():this.newOpen=!1}knownDomains(){let t=new Set;for(let i of Object.keys(this.hass.states)){let a=i.split(".")[0]??"";a!==""&&t.add(a)}return t}currentShareSlots(){let t=this.shareConfig();return t?ix(t,this.knownDomains()).map(i=>{let a=this.shareLabels.get(i.placeholderId);return a===void 0?i:{...i,label:a}}):[]}renderShareDialog(){let t=this.draft?.config,i=this.shareConfig();if(!t||!i)return m;let a=Tt(t),r=this.sharePicked(),o=r.length>0,s=this.currentShareSlots(),l=this.shareMode==="share",c=l?Pa(zl(i,this.shareNameOverrides()),"share",s):Pa(i,"backup"),d=this.shareLink?.text===c?this.shareLink:void 0,u=Yt(i,this.buildContext(),this.forced),p=l&&o?this.publicNameRows(i,s,this.knownDomains(),this.shareNameOverrides(),{label:"Name",value:i.name.trim()||"Untitled"}):[],f=p.find($=>$.key===this.shareFocus),g=f?.ids??[],b=this.dialogFamily(i),y=this.hass.user?.is_admin===!0,w=this.shareCopied,k=0,S=this.shareSection(++k,"s-who","Who is it for",h`
      <div class="seg wide xf-modes" role="group" aria-label="Who is it for">
        <button class=${l?"on":""} aria-pressed=${l?"true":"false"} @click=${()=>this.setShareMode("share")}>${D("globe")}<span>Share with others</span></button>
        <button class=${l?"":"on"} aria-pressed=${l?"false":"true"} @click=${()=>this.setShareMode("backup")}>${D("lock")}<span>Backup for me</span></button>
      </div>
      <div class="xf-lead ${l?"":"warn"}">${D(l?"info":"lock")}
        <span>${l?"Your entities are removed. The other person picks their own.":"Exact copy with your entities. Keep it for yourself or this home."}</span></div>`),R=r.length===a.length,O=a.length<2?m:this.shareSection(++k,"s-shapes","Pick the shapes",h`
      ${this.familyChips(a,$=>this.shareFamilies.has($),$=>this.setShareFamilies($),!1)}
      ${o?m:h`<div class="xf-lead">${D("info")}<span>Only the shapes you pick go in the copy. Pick at least one.</span></div>`}`,h`${r.length} of ${a.length}<button class="link" @click=${()=>this.setShareFamilies(new Set(R?[]:a))}>${R?"None":"All"}</button>`),F=l?this.shareSection(++k,"s-names","Public names",o?this.renderPublicRows(p,this.shareFocus,$=>this.pointAtRow(p,$,A=>{this.shareFocus=A})):h`<div class="hint">Pick a shape first.</div>`,m,!o):m,z=this.shareSection(++k,"s-send","Send it",h`
      <div class="xf-acts">
        <button class="xf-act" ?disabled=${!l||!y||!o} aria-haspopup="dialog"
          @click=${()=>this.openGalleryDialog()}>
          <span class="ic">${D("globe")}</span><b>Post to online gallery</b>
          <span>${l?y?"Everyone can find it, after review":"Needs a Home Assistant administrator":"Only shares can go"}</span>
        </button>
        <button class="xf-act ${w==="link"?"flash":""}" ?disabled=${!o} @click=${()=>{this.copyShareLink(c)}}>
          <span class="ic">${D(w==="link"?"check":"link")}</span><b>${w==="link"?"Link copied":"Copy link"}</b>
          <span>Opens in their own Home Assistant</span>
        </button>
        <button class="xf-act ${w==="file"?"flash":""}" ?disabled=${!o} title=${`Saves ${up(i)}`} @click=${()=>this.downloadShareText(c)}>
          <span class="ic">${D(w==="file"?"check":"download")}</span><b>${w==="file"?"Saved":"Download"}</b>
          <span>A .json file</span>
        </button>
      </div>
      ${d&&this.shareLinkShown?h`<input class="xfer-link" type="text" readonly aria-label="Share link" .value=${d.url}
        @focus=${$=>$.target.select()} />`:m}
      ${this.shareNote===""?m:h`<div class="hint xf-note" role="status">${this.shareNote}</div>`}
      <a class="xf-galink" href=${Sp} target="_blank" rel="noopener">${D("globe")}<span>See the online gallery</span>${D("arrow")}</a>
      <details class="xf-raw" .open=${this.shareTextOpen}
        @toggle=${$=>{this.shareTextOpen=$.target.open}}>
        <summary>${D("right")}<span>Share text</span></summary>
        <textarea class="xfer-text" rows="10" readonly aria-label="The text to share" .value=${c}></textarea>
        <button class="link" @click=${()=>{this.copyShareText(c,"text")}}>${w==="text"?"Copied":"Copy text"}</button>
      </details>`,m,!o);return h`<dialog class="share-dialog xf ${this.galleryOpen?"under":""}" @close=${()=>{this.shareOpen=!1,this.pointAtRow([],void 0,()=>{})}}>
      ${this.dialogHead(`Share \u201C${i.name.trim()||"Untitled"}\u201D`,`${o?Cx(r):"No shapes picked yet"} \xB7 ${Sx(i)}`,()=>this.closeShareDialog())}
      <div class="xfer-body">
        ${this.dialogPreview(u,b,g,f&&g.length>0?h`Where <b>${f.name}</b> is`:b?ae(b):"",p.some($=>$.ids.length>0)?"Point at a name to see where it is":"")}
        ${S}${O}${F}${z}
      </div>
    </dialog>`}shareSection(t,i,a,r,o=m,s=!1){return h`<section class="xf-sec ${i} ${s?"locked":""}">
      <h3><i>${t}</i><span>${a}</span>${o===m?m:h`<span class="r">${o}</span>`}</h3>
      <div class="xf-sec-b" ?inert=${s}>${r}</div>
    </section>`}pointAtRow(t,i,a){a(i);let r=i===void 0?[]:t.find(o=>o.key===i)?.ids??[];this.listHoverIds=r,this.dialogLitIds=i?.startsWith("g:")?[i.slice(2),...r]:r,r.length!==0&&this.updateComplete.then(()=>{this.renderRoot.querySelector(".layer.lit")?.scrollIntoView({block:"nearest"})})}dialogHead(t,i,a,r=m){return h`<div class="xf-head">
      <div class="xf-t"><h2>${t}</h2>${i===""||i===m?m:h`<span>${i}</span>`}</div>
      ${r}
      <button class="icon" title="Close" aria-label="Close" @click=${a}>${D("close")}</button>
    </div>`}dialogFamily(t){return Ys(t)??(t.supportedFamilies.includes("inline")?"inline":void 0)}dialogPreview(t,i,a,r,o,s=!1){if(i===void 0)return m;let l=m,c=!1;if(i==="inline")l=this.renderInlinePreview(t.inline,!0),c=a.length>0;else{let d=t[i];if(d){let u=a.filter(p=>d.elements.some(f=>f.id===p));c=a.length>0&&u.length===0,l=_i(d,{icons:this.icons,imageSizes:this.imageSizes,slot:qn(this.referenceCase,i),pictureScene:s,...u.length>0?{spotlightIds:u}:{}})}}return h`<div class="xf-prev-wrap">
      <div class="xf-prev ${i}">${l}</div>
      <div class="xf-prev-cap"><span>${r}${c?", on another shape":""}</span>${o===""?m:h`<span>${o}</span>`}</div>
    </div>`}layerTags(t,i,a,r){return a.length===0?m:h`<span class="xf-uses">${a.map(o=>{let s=t.elements.find(d=>d.payload.id===o);if(!s)return m;let l=de.find(d=>Ct(t,d).some(u=>u.payload.id===o)),c=l?i[l]:void 0;return h`<span class="xf-use">
        <span class="xf-lt">${c?js(c,[o],{icons:this.icons,imageSizes:this.imageSizes,width:34,height:20}):m}</span>
        <span class="xf-ln">${Ce(s,r)}</span><em>${ct[s.kind]}</em>
      </span>`})}</span>`}leaveRows(t,i){let a=t.currentTarget,r=t instanceof FocusEvent?t.relatedTarget:a.getRootNode().activeElement;r instanceof Node&&a.contains(r)||i()}shareConfig(){let t=this.draft?.config;if(!t)return t;let i=this.sharePicked();return i.length===0||i.length===Tt(t).length?t:du(t,i)}sharePicked(){let t=this.draft?.config;if(!t)return[];let i=Tt(t);return i.length<2?i:i.filter(a=>this.shareFamilies.has(a))}shareNameOverrides(){let t=new Map,i=this.draft?.config;if(i&&this.shareLayerNames.size>0)for(let a of i.elements){let r=a.payload.name===void 0?void 0:this.shareLayerNames.get(a.payload.name.trim());r!==void 0&&t.set(a.payload.id,r)}return{name:this.shareName,groupNames:this.shareGroupNames,valueNames:this.shareValueNames,layerNames:t}}setShareFamilies(t){this.shareFamilies=t,this.pointAtRow([],void 0,i=>{this.shareFocus=i}),this.shareNote="",this.shareLinkShown=!1}familyChips(t,i,a,r){let o=t.filter(i).length;return h`<div class="gal-tags xf-shapes" role="group" aria-label="Shapes">${t.map(s=>{let l=i(s),c=r&&l&&o===1;return h`<button class="pk-chip ${l?"on":""}" aria-pressed=${l?"true":"false"} ?disabled=${c}
        title=${c?"At least one shape stays on":l?`Leave ${ae(s)} out`:`Put ${ae(s)} in`}
        @click=${()=>{let d=new Set(t.filter(i));l?d.delete(s):d.add(s),a(d)}}>${l?D("check"):m}${ae(s)}</button>`})}</div>`}publicNameRows(t,i,a,r,o){let s=fx(t,i,r),l=(p,f)=>a.has(f),c=(p,f,g,b,y)=>h`<input type="text" maxlength=${y??m} aria-label=${`${p}: ${f}`}
          .value=${g??f} placeholder=${f} ?disabled=${this.gallerySending}
          @input=${w=>b(w.target.value)} />`,d=[{key:"head",label:o.label,name:o.value,ids:[],control:c(o.label,t.name.trim(),this.shareName===""?void 0:this.shareName,p=>{this.shareName=p})}],u=(p,f,g)=>c(f,p.original,g??(p.value===p.original?void 0:p.value),b=>this.setPublicName(p,b),p.kind==="slot"?40:void 0);for(let p of s){if(p.rows){for(let f of p.rows)if(f.kind==="group")d.push({key:`g:${f.id}`,label:"Group name",name:f.value,ids:$t(t,f.id).map(g=>g.payload.id),control:u(f,"Group name",this.shareGroupNames.get(f.id))});else if(f.kind==="shared")d.push({key:`v:${f.id}`,label:"Shared value name",name:f.value,ids:If(t,f.id),control:u(f,"Shared value name",this.shareValueNames.get(f.id))});else{let g=i.find(b=>b.placeholderId===f.id);d.push({key:`e:${f.id}`,label:"Entity name",name:f.value,ids:g?vc(t,g.originalId,l):[],control:u(f,"Entity name",void 0)})}continue}if(p.label==="Layer names"){let f=[];for(let g of t.elements){let b=g.payload.name?.trim();b&&!we(t,g)&&!f.includes(b)&&f.push(b)}for(let g of f){let b=t.elements.filter(y=>!we(t,y)&&y.payload.name?.trim()===g).map(y=>y.payload.id);d.push({key:`l:${g}`,label:"Layer name",name:g,ids:b,control:c("Layer name",g,this.shareLayerNames.get(g),y=>this.setShareLayerName(g,y))})}continue}p.values.forEach((f,g)=>{d.push({key:`t:${p.label}:${g}`,label:dE[p.label]??p.label,name:f,ids:[],control:h`<div class="xf-pill mono">${f}</div>`})})}return d}renderPublicRows(t,i,a){let r=()=>a(void 0);return h`
      <div class="xf-lead">${D("info")}<span>Others can see these names. Change the names of layers and groups here before you share, if you want.</span></div>
      <div class="xf-pub" @pointerleave=${o=>this.leaveRows(o,r)} @focusout=${o=>this.leaveRows(o,r)}>
        ${t.map(o=>{let s=o.key===i&&o.ids.length>0,l=()=>a(o.key);return h`<div class="kv ${s?"on":""}" @pointerenter=${l} @focusin=${l}>
            <span class="k">${o.label}</span>
            <div class="v">${o.control}</div>
          </div>`})}
      </div>
      <div class="hint">Your own complication keeps its names. An empty box keeps the name it had.</div>`}setShareMode(t){this.shareMode=t,this.shareNote="",this.pointAtRow([],void 0,i=>{this.shareFocus=i}),this.shareCopied=void 0,this.shareLinkShown=!1}setShareLabel(t,i){let a=new Map(this.shareLabels);a.set(t,i),this.shareLabels=a}openShareDialog(){this.draft&&(this.shareOpen=!0,this.shareMode="share",this.shareLabels=new Map,this.shareFamilies=new Set,this.shareGroupNames=new Map,this.shareValueNames=new Map,this.shareName="",this.shareLayerNames=new Map,this.shareNote="",this.shareTextOpen=!1,this.shareLink=void 0,this.shareLinkShown=!1,this.shareCopied=void 0,this.shareFocus=void 0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.share-dialog");t&&!t.open&&t.showModal()}))}closeShareDialog(){let t=this.renderRoot.querySelector("dialog.share-dialog");t?.open?t.close():this.shareOpen=!1}galleryMeta(){return{title:this.galleryTitle,description:this.galleryDescription,authorName:this.galleryNickname,tags:[...this.galleryTags],panelVersion:this.panel?.config?.version??""}}openGalleryDialog(){let t=this.shareConfig();!t||!this.hass.user?.is_admin||this.sharePicked().length===0||(this.pointAtRow([],void 0,i=>{this.shareFocus=i}),this.galleryOpen=!0,this.galleryTitle=(this.shareName.trim()||t.name.trim()).slice(0,be.title),this.galleryDescription="",this.galleryTags=new Set,this.galleryNickname=sE(),this.gallerySending=!1,this.gallerySent=!1,this.galleryError="",this.galleryPreviews=void 0,this.galleryPreviewNote="",this.galleryConfirmDelete=void 0,this.galleryTab="new",this.galleryStep=1,this.galleryReplaces=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.gallery-dialog");i&&!i.open&&i.showModal()}),this.makeGalleryPreviews(t,this.currentShareSlots()),this.loadGalleryUploads())}galleryOverrides(){return{...this.shareNameOverrides(),name:this.galleryTitle}}setShareLayerName(t,i){let a=new Map(this.shareLayerNames);a.set(t,i),this.shareLayerNames=a}setPublicName(t,i){if(t.kind==="slot"){if(this.setShareLabel(t.id,i),!this.galleryOpen)return;window.clearTimeout(this.galleryRedrawTimer),this.galleryRedrawTimer=window.setTimeout(()=>{let r=this.shareConfig();!r||!this.galleryOpen||this.gallerySent||(this.galleryPreviews=void 0,this.galleryPreviewNote="",this.makeGalleryPreviews(r,this.currentShareSlots()))},500);return}let a=new Map(t.kind==="group"?this.shareGroupNames:this.shareValueNames);a.set(t.id,i),t.kind==="group"?this.shareGroupNames=a:this.shareValueNames=a}closeGalleryDialog(){let t=this.renderRoot.querySelector("dialog.gallery-dialog");t?.open?t.close():this.galleryOpen=!1}async makeGalleryPreviews(t,i){let a=++this.galleryPreviewRun;try{let r=await $x(t,i,{entityState:o=>this.entityStateFor(o,"",!1),templateResults:this.templateResults,historySeries:this.historySeries,listItems:this.listItems},this.icons);if(a!==this.galleryPreviewRun)return;this.galleryPreviews=r}catch{if(a!==this.galleryPreviewRun)return;this.galleryPreviews=[],this.galleryPreviewNote="The preview pictures could not be made. It can still be sent without them."}}async ensureGalleryKey(){return this.galleryKey===void 0&&(this.galleryKey=(await Gf(this.hass)).key),this.galleryKey}async loadGalleryUploads(){this.galleryUploadsError="";try{let t=await this.ensureGalleryKey();this.galleryUploads=await xx(Cp,t)}catch(t){this.galleryUploads=[],this.galleryUploadsError=t instanceof rn?Ol(t):"Could not read this Home Assistant's gallery key."}}async sendToGallery(){let t=this.shareConfig();if(!t||this.gallerySending||this.gallerySent||this.galleryPreviews===void 0)return;let i=this.currentShareSlots(),a=this.galleryMeta(),r=this.galleryOverrides();if(!(mx(t,i,a,this.knownDomains(),r).length>0)){this.gallerySending=!0,this.galleryError="";try{let o=await this.ensureGalleryKey();await bx(Cp,o,{...wp(t,i,a,r),previews:this.galleryPreviews,...this.galleryReplaces?{replaces:this.galleryReplaces.id}:{}}),this.gallerySent=!0,lE(a.authorName.trim()),this.loadGalleryUploads()}catch(o){this.galleryError=o instanceof rn?Ol(o):"Could not read this Home Assistant's gallery key. Try again."}finally{this.gallerySending=!1}}}async deleteGalleryUpload(t){if(this.galleryConfirmDelete!==t){this.galleryConfirmDelete=t;return}this.galleryDeleting=t,this.galleryUploadsError="";try{let i=await this.ensureGalleryKey();await vx(Cp,i,t),this.galleryUploads=this.galleryUploads?.filter(a=>a.id!==t),this.loadGalleryUploads()}catch(i){this.galleryUploadsError=i instanceof rn?Ol(i):"Could not delete it. Try again."}finally{this.galleryDeleting=void 0,this.galleryConfirmDelete=void 0}}toggleGalleryTag(t){let i=new Set(this.galleryTags);i.has(t)?i.delete(t):i.size<be.tags&&i.add(t),this.galleryTags=i}renderGalleryDialog(){let t=this.shareConfig();if(!t)return m;let i=this.galleryUploads?wx(this.galleryUploads):void 0,a=this.galleryTab,r=h`<div class="seg xf-tabs" role="group" aria-label="Gallery view">
      <button class=${a==="new"?"on":""} aria-pressed=${a==="new"?"true":"false"} @click=${()=>this.setGalleryTab("new")}>New</button>
      <button class=${a==="mine"?"on":""} aria-pressed=${a==="mine"?"true":"false"} @click=${()=>this.setGalleryTab("mine")}>My uploads<span class="xf-count">${i===void 0?"\u2026":i.length}</span></button>
    </div>`;return h`<dialog class="gallery-dialog xf" @close=${()=>{this.galleryOpen=!1,this.pointAtRow([],void 0,()=>{})}}>
      ${this.dialogHead("Post to online gallery",h`<a class="xf-galink" href=${Sp} target="_blank" rel="noopener">wrist-assistant.com/gallery</a>`,()=>this.closeGalleryDialog(),r)}
      ${a==="mine"?this.renderGalleryUploads(i):this.gallerySent?this.renderGallerySent():this.renderGallerySteps(t)}
    </dialog>`}setGalleryTab(t){t==="new"&&(this.gallerySent&&(this.gallerySent=!1,this.galleryStep=1,this.galleryError=""),this.galleryTab==="new"&&(this.galleryReplaces=void 0)),this.galleryTab=t,this.galleryConfirmDelete=void 0}goGalleryStep(t){this.galleryStep=t}startGalleryUpdate(t){this.galleryReplaces={id:t.id,title:t.title},this.galleryTitle=t.title.slice(0,be.title),this.galleryTab="new",this.galleryStep=1,this.gallerySent=!1,this.galleryError="",this.galleryConfirmDelete=void 0}renderGallerySent(){return h`<div class="xfer-body"><div class="xf-done">
      <span class="big">${D("check")}</span>
      <b>Sent for review</b>
      <p>${this.galleryReplaces?"The new version goes up after it is approved. Until then the old one stays.":"It shows in the gallery after it is approved. Check My uploads for its status."}</p>
      <div class="btns">
        <button class="small" @click=${()=>this.setGalleryTab("mine")}>My uploads</button>
        <button class="primary" @click=${()=>this.closeGalleryDialog()}>Done</button>
      </div>
    </div></div>`}renderGallerySteps(t){let i=this.currentShareSlots(),a=this.galleryOverrides(),r=this.knownDomains(),o=gx(t,i,this.galleryMeta(),r,a),s=this.galleryStep,l=o.details.length===0,c=[...o.details,...o.send],d=c.length===0&&this.galleryPreviews!==void 0&&!this.gallerySending,u=c.length>0?c[0]:this.galleryPreviews===void 0?"Drawing the preview pictures":"Send it for review",f=h`<nav class="xf-steps" aria-label="Steps">${["Details","Send"].map((b,y)=>{let w=y+1;return h`<button class="xf-step ${w<s?"past":""}" aria-current=${w===s?"step":m}
        ?disabled=${w>1&&!l} @click=${()=>this.goGalleryStep(w)}>
        <i>${w<s?D("check"):w}</i>${b}</button>`})}</nav>`,g=s===1?this.renderGalleryDetails(o.details):this.renderGallerySend(t,i,c);return h`${f}
      <div class="xfer-body">
        ${this.galleryReplaces?h`<div class="xf-banner">${D("info")}<span>New version of <b>${this.galleryReplaces.title}</b>. The link and votes stay. The old version stays up until this one is approved.</span></div>`:m}
        ${g}
      </div>
      <div class="xfer-foot">
        ${s===1?h`<button class="ghost" @click=${()=>this.closeGalleryDialog()}>Back to Share</button>`:h`<button class="ghost" @click=${()=>this.goGalleryStep(1)}>Back</button>`}
        <span class="spacer"></span>
        ${s===1?h`<button class="primary" ?disabled=${!l} title=${l?"Next step":o.details[0]}
              @click=${()=>this.goGalleryStep(2)}>Next${D("arrow")}</button>`:h`<button class="primary" ?disabled=${!d} title=${u}
              @click=${()=>{this.sendToGallery()}}>${this.gallerySending?"Sending\u2026":"Send for review"}</button>`}
      </div>`}renderGalleryDetails(t){let i=this.galleryTags;return h`<div class="xf-two">
      <div class="xf-stack xf-form">
        <label class="xf-f"><span class="xf-label">Title</span>
          <input type="text" maxlength=${be.title} .value=${this.galleryTitle}
            @input=${a=>{this.galleryTitle=a.target.value}} /></label>
        <label class="xf-f"><span class="xf-label">Description <span class="r">Optional</span></span>
          <textarea rows="2" maxlength=${be.description} .value=${this.galleryDescription}
            @input=${a=>{this.galleryDescription=a.target.value}}></textarea></label>
        <div class="xf-f"><span class="xf-label">Tags <span class="r">${i.size} of ${be.tags}</span></span>
          <div class="gal-tags">
            ${bp.map(a=>{let r=i.has(a);return h`<button class="pk-chip ${r?"on":""}" aria-pressed=${r?"true":"false"}
                ?disabled=${!r&&i.size>=be.tags}
                @click=${()=>this.toggleGalleryTag(a)}>${xp[a]}</button>`})}
          </div></div>
        <label class="xf-f"><span class="xf-label">Your name <span class="r">Optional</span></span>
          <input type="text" maxlength=${be.authorName} .value=${this.galleryNickname}
            @input=${a=>{this.galleryNickname=a.target.value}} /></label>
        ${t.length>0?h`<ul class="xf-blockers" role="alert">${t.map(a=>h`<li>${a}</li>`)}</ul>`:m}
      </div>
      <div>${this.galleryCard()}<div class="xf-caption">How it looks in the gallery</div></div>
    </div>`}galleryCard(){let t=this.galleryPreviews,i=this.galleryNickname.trim();return h`<div class="xf-gcard">
      <div class="img">${t===void 0?h`<span class="hint">Drawing…</span>`:t[0]?h`<img alt="Gallery picture" src=${`data:image/png;base64,${t[0].png}`} />`:h`<span class="hint">${this.galleryPreviewNote||"No picture for this shape"}</span>`}</div>
      <div class="meta">
        <b>${this.galleryTitle.trim()||"Untitled"}</b>
        <span>${i?`by ${i}`:"No name"}</span>
        ${this.galleryTags.size>0?h`<span class="tg">${[...this.galleryTags].map(a=>h`<em>${xp[a]}</em>`)}</span>`:m}
      </div>
    </div>`}renderGallerySend(t,i,a){let r=this.galleryTags.size,o=t.elements.some(s=>s.kind==="image");return h`<div class="xf-two">
      <div class="xf-stack xf-form">
        <div class="xf-checks">
          <div>${D("check")}<span>${r===0?"Title, no tags":`Title and ${r===1?"1 tag":`${r} tags`}`}</span></div>
          <div>${D("check")}<span>${i.length>0?"Your entities are removed":"It reads none of your entities"}</span></div>
          <div>${D("check")}<span>${o?"Pictures show as a stand-in, never your photo":"The preview shows your current values"}</span></div>
        </div>
        ${a.length>0?h`<ul class="xf-blockers" role="alert">${a.map(s=>h`<li>${s}</li>`)}</ul>`:m}
        ${this.galleryError!==""?h`<div class="xf-blockers" role="alert">${this.galleryError}</div>`:m}
      </div>
      <div>${this.galleryCard()}</div>
    </div>`}renderGalleryUploads(t){return h`<div class="xfer-body">
      ${this.galleryUploadsError!==""?h`<div class="xf-blockers" role="alert">${this.galleryUploadsError}</div>`:m}
      ${t===void 0?h`<div class="hint">Loading…</div>`:t.length===0?this.galleryUploadsError===""?h`<div class="xf-lead">${D("info")}<span>Nothing sent from this Home Assistant yet.</span></div>`:m:h`<div class="xf-rows">${t.map(i=>this.renderUploadRow(i))}</div>`}
      <div class="xf-lead">${D("info")}<span><b>Update</b> sends this complication as a new version. The link and votes stay. <b>Delete</b> removes it for everyone.</span></div>
    </div>`}renderUploadRow(t){let i=t.upload;return h`<div class="xf-up">
      <span class="xf-up-thumb">${i.previewUrl?h`<img src=${i.previewUrl} alt="" loading="lazy" />`:m}</span>
      <div class="xf-main">
        <div class="xf-up-t"><b>${i.title}</b>${this.uploadStatus(i)}</div>
        <div class="sub">${$p(i)}</div>
      </div>
      <div class="xf-up-acts">
        ${t.canUpdate?h`<button class="small" title="Send this complication as a new version of it"
          @click=${()=>this.startGalleryUpdate(i)}>Update</button>`:m}
        ${this.uploadDelete(i,!1)}
      </div>
      ${t.updates.map(a=>h`<div class="xf-up-v">
        <div class="xf-main">
          <div class="xf-up-t">${this.uploadStatus(a)}</div>
          <div class="sub">${$p(a)}</div>
        </div>
        <div class="xf-up-acts">${this.uploadDelete(a,!0)}</div>
      </div>`)}
    </div>`}uploadStatus(t){return h`<span class="gal-status ${ho(t)?"pending":t.status}">${kx(t)}</span>`}uploadDelete(t,i){let a=this.galleryDeleting!==void 0;if(this.galleryConfirmDelete===t.id||this.galleryDeleting===t.id){let r=this.galleryDeleting===t.id;return h`${r?m:h`<button class="small" @click=${()=>{this.galleryConfirmDelete=void 0}}>Keep</button>`}
        <button class="small danger" ?disabled=${a}
          title=${i?"Withdraws this new version. The one in the gallery stays.":"Removes it from the gallery for everyone"}
          @click=${()=>{this.deleteGalleryUpload(t.id)}}>${r?"Deleting\u2026":i?"Withdraw it":"Delete for good"}</button>`}return h`<button class="icon danger" ?disabled=${a}
      title=${i?"Withdraw this new version":"Delete it from the gallery"}
      aria-label=${i?`Withdraw the new version of ${t.title}`:`Delete ${t.title}`}
      @click=${()=>{this.deleteGalleryUpload(t.id)}}>${D("delete")}</button>`}async copyShareText(t,i){this.shareNote="";try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(t),this.flashShare(i);return}}catch{}i==="text"?this.shareTextOpen=!0:this.shareLinkShown=!0,await this.updateComplete;let a=this.renderRoot.querySelector(i==="text"?"dialog.share-dialog textarea.xfer-text":"dialog.share-dialog input.xfer-link");a?.focus(),a?.select();let r=!1;try{r=document.execCommand("copy")}catch{r=!1}r?this.flashShare(i):this.shareNote="Press Cmd+C or Ctrl+C to copy."}flashShare(t){this.shareCopied=t,window.clearTimeout(this.shareCopiedTimer),this.shareCopiedTimer=window.setTimeout(()=>{this.shareCopied=void 0},1600)}async copyShareLink(t){let i=await lx(t),a=cx(dx,i);this.shareLink={text:t,url:a},await this.copyShareText(a,"link")}downloadShareText(t){let i=this.draft?.config;if(!i)return;let a=up(i),r=URL.createObjectURL(new Blob([t],{type:"application/json"})),o=document.createElement("a");o.href=r,o.download=a,o.click(),window.setTimeout(()=>URL.revokeObjectURL(r),0),this.shareNote="",this.flashShare("file")}importConfig(){let t=this.importParse;if(!t?.ok)return;let i=su(t.config,this.ownerFamilies),a=this.importFamilies===void 0?i:i.filter(r=>this.importFamilies.has(r));return a.length===Tt(t.config).length?t.config:du(t.config,a)}setImportFamilies(t){this.importFamilies=t,this.importFocus=void 0,this.scheduleImportHistory()}renderImportDialog(){let t=this.importConfig();return h`<dialog class="import-dialog xf ${this.importDrop?"dropping":""}" @keydown=${this.importKeys} @close=${()=>this.importClosed()}
      @dragenter=${this.importDragEnter} @dragover=${this.importDragOver} @dragleave=${this.importDragLeave} @drop=${this.importDropped}
      @paste=${this.importPasted}>
      ${this.dialogHead("Import","",()=>this.closeImportDialog())}
      ${t?this.renderImportLoaded(t):this.renderImportEmpty()}
      ${t&&this.importDrop?h`<div class="xfer-drop" aria-hidden="true"><span>Drop to read the file</span></div>`:m}
    </dialog>`}renderImportEmpty(){let t=this.importParse,i=this.importTextShown||this.importText.trim()!=="";return h`<div class="xfer-body">
      <div class="xf-drop ${this.importDrop?"over":""}">
        <span class="big">${D("paste")}</span>
        <b>Paste a share link</b>
        <p>Press <kbd>${za==="Cmd"?"\u2318":"Ctrl"}</kbd> <kbd>V</kbd> anywhere here, or drop a file.</p>
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
      <a class="xf-galtile" href=${Sp} target="_blank" rel="noopener">
        <span class="ic">${D("globe")}</span>
        <span class="t"><b>Browse the online gallery</b><span>Ready-made complications from other people</span></span>
        ${D("arrow")}
      </a>
    </div>
    <div class="xfer-foot">
      <span class="spacer"></span>
      <button class="small" @click=${()=>this.closeImportDialog()}>Cancel</button>
    </div>`}renderImportLoaded(t){let i=pp(t,this.hass.states),a=this.knownDomains(),r=this.importParse,o=su(r?.ok?r.config:t,this.ownerFamilies),s=this.importPreview(),l=s?this.configLayouts(s.config,s.entities,this.importHistory):{},c=new Map(i.map(S=>[S.entityId,vc(t,S.entityId,(R,O)=>Yi(R)||a.has(O))])),d=i.filter(S=>S.required),u=d.filter(S=>this.importMap.has(S.entityId)).length,p=i.find(S=>S.entityId===this.importFocus),f=this.dialogFamily(t),g=this.importName.trim(),b=this.takenNames(),y=g!==""&&b.has(g.toLowerCase()),w=yp({parsed:!0,name:this.importName,taken:b,unchosen:0}),k=()=>{this.importFocus=void 0};return h`<div class="xfer-body">
      <div class="xf-hero">
        ${this.dialogPreview(l,f,p?c.get(p.entityId)??[]:[],p?h`Uses <b>${p.label}</b>`:f?ae(f):"","")}
        <div class="xf-stack">
          <label class="xf-f"><span class="xf-label">Name</span>
            <input type="text" maxlength="60" aria-invalid=${y?"true":"false"} .value=${this.importName}
              @input=${S=>{this.importName=S.target.value}} /></label>
          ${y?h`<div class="hint err">A complication on this ${this.deviceWord} already has that name.</div>`:m}
          ${o.length<2?m:h`<div class="xf-f"><span class="xf-label">Shapes to import<span class="r">${Tt(t).length} of ${o.length}</span></span>
            ${this.familyChips(o,S=>this.importFamilies===void 0||this.importFamilies.has(S),S=>this.setImportFamilies(S),!0)}</div>`}
          <div class="xf-sub">${o.length<2?`${Cx(o)} \xB7 `:""}${Sx(t)}</div>
        </div>
      </div>
      ${i.length===0?h`<div class="xf-lead">${D("check")}<span>Every entity this design reads is already in your Home Assistant.</span></div>`:h`<div class="xf-stack">
          <div class="xf-label">Pick your entities${d.length>0?h`<span class="r">${u} of ${d.length}</span>`:m}</div>
          ${d.length>0?h`<div class="xf-bar" role="progressbar" aria-valuemin="0" aria-valuemax=${d.length} aria-valuenow=${u}>
            <i style=${`width:${u/d.length*100}%`}></i></div>`:m}
          <div class="xf-rows" @pointerleave=${S=>this.leaveRows(S,k)} @focusout=${S=>this.leaveRows(S,k)}>
            ${i.map(S=>this.renderImportRow(S,t,l,c.get(S.entityId)??[]))}
          </div>
          ${u<d.length?h`<div class="xf-lead">${D("info")}<span>You can import now and pick the rest later.</span></div>`:m}
        </div>`}
      ${Pl(t)?h`<div class="xf-lead warn">${D("info")}<span>This design filters by areas, labels or floors from the sender's home. Check its aggregate layers after import.</span></div>`:m}
    </div>
    <div class="xfer-foot">
      <button class="ghost" @click=${()=>this.startImportOver()}>Start over</button>
      <span class="spacer"></span>
      <button class="primary" ?disabled=${w!==void 0}
        title=${w??"Save it to this watch and open it in the editor"} @click=${()=>{this.doImport()}}>Import and save</button>
    </div>`}dragReadable(t){let i=t.dataTransfer?[...t.dataTransfer.types]:[];return i.includes("Files")||i.includes("text/plain")}renderImportRow(t,i,a,r){let o=this.importMap.get(t.entityId),s=()=>{this.importFocus=t.entityId};return h`<div class="xf-row pick ${this.importFocus===t.entityId?"on":""}" @pointerenter=${s} @focusin=${s}>
      <span class="ent-ico xf-dom">${qr(t.domain)}</span>
      <div class="xf-main">
        <div class="xf-name">${t.label}${o?h`<span class="xf-done" title="Picked">${D("check")}</span>`:m}</div>
        ${r.length>0?this.layerTags(i,a,r):h`<div class="xf-sub">${t.where.join(", ")}</div>`}
        ${t.required?m:h`<div class="xf-sub">Not in your Home Assistant right now. Leave it empty to keep the id.</div>`}
        <div class="xf-picker">${rt({hass:this.hass},t.label,o??hE,l=>this.setImportEntity(t.entityId,l),Ex(t.entityId),{compact:!0,domain:t.domain,needed:t.required&&o===void 0})}</div>
      </div>
    </div>`}async pasteImport(){let t="";try{t=await navigator.clipboard.readText()}catch{t=""}if(t.trim()===""){await this.revealImportText();return}this.setImportText(t)}async revealImportText(){this.importTextShown=!0,await this.updateComplete,this.renderRoot.querySelector("dialog.import-dialog textarea.xf-typed")?.focus()}setImportEntity(t,i){let a=new Map(this.importMap);i.entityId===""?a.delete(t):a.set(t,Ha(this.hass.states,i.entityId)),this.importMap=a,this.scheduleImportHistory()}importPreview(){let t=this.importParse;if(!t?.ok)return;let i=this.importPreviewCache;if(i&&i.parse===t&&i.map===this.importMap&&i.families===this.importFamilies)return i;let a=hp(this.importConfig()??t.config,this.importMap),r;try{r=[...Ar(a).entities.values()]}catch{r=[]}return this.importPreviewCache={parse:t,map:this.importMap,families:this.importFamilies,config:a,entities:r},this.importPreviewCache}setImportText(t){this.importText=t;let i=ux(t);if(i!==void 0){this.importParse=void 0,this.importMap=new Map,this.importFamilies=void 0,this.importName="",fp(i).then(o=>{this.importText===t&&(o===void 0?this.importParse={ok:!1,error:gp}:this.setImportText(o))});return}let a=this.importParse?.ok?JSON.stringify(this.importParse.config):void 0,r=t.trim()===""?void 0:ax(t,this.maxSchemaVersion);if(this.importParse=r,this.scheduleImportHistory(),!r?.ok){this.importMap=new Map,this.importFamilies=void 0,this.importName="";return}JSON.stringify(r.config)!==a&&(this.importMap=new Map,this.importFamilies=void 0,this.importName=rx(r.config.name,this.takenNames()))}async readImportFile(t){let i=t.target,a=i.files?.[0];a&&(await this.readImportBlob(a),i.value="")}async readImportBlob(t){try{this.setImportText(await t.text())}catch(i){this.importParse={ok:!1,error:`That file could not be read: ${on(i)}`}}}async openPendingLink(){let t=this.pendingLink;if(t===void 0)return;if(this.pendingLink=void 0,!this.hass.user?.is_admin){this.linkNote="This link holds a shared complication. Only a Home Assistant administrator can import it.";return}let i=await fp(t);if(i===void 0){this.linkNote=gp;return}if(!this.ownerId){this.linkNote="This link holds a shared complication, but no watch has connected to this Home Assistant yet.";return}if(this.freeSlot()<0){this.linkNote="This link holds a shared complication, but this watch has no free slot. Delete a complication, then open the link again.";return}this.linkNote=void 0,this.openImportDialog(),this.setImportText(i)}async doImport(){let t=this.importConfig();if(!t)return;let i=hp(t,this.importMap);i.id=re(),i.name=this.importName.trim(),i.slotIndex=this.freeSlot(),i.dataSources=[],i.schemaVersion=yi(i),this.startNew(i)&&(this.draft?.markDirty(),this.closeImportDialog(),await this.save())}openImportDialog(){!this.hass.user?.is_admin||this.freeSlot()<0||(this.importOpen=!0,this.resetImportState(),this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.import-dialog");t&&(t.open||t.showModal(),t.querySelector("button.xf-paste")?.focus())}))}resetImportState(){this.importText="",this.importParse=void 0,this.importName="",this.importMap=new Map,this.importFamilies=void 0,this.importTextShown=!1,this.importFocus=void 0,this.importHistory=new Map,this.importHistoryAsked=void 0,this.importPreviewCache=void 0,this.importDrop=!1,this.importDragDepth=0,this.importHistoryTimer&&window.clearTimeout(this.importHistoryTimer),this.importHistoryTimer=void 0,this.importHistoryRun+=1}startImportOver(){this.resetImportState(),this.updateComplete.then(()=>{this.renderRoot.querySelector("dialog.import-dialog button.xf-paste")?.focus()})}closeImportDialog(){let t=this.renderRoot.querySelector("dialog.import-dialog");t?.open?t.close():this.importClosed()}importClosed(){this.importOpen=!1,this.importHistoryTimer&&window.clearTimeout(this.importHistoryTimer),this.importHistoryTimer=void 0,this.importHistoryRun+=1}renderBanners(){let t=[],i=this.renderOrphanBanner();if(i&&t.push(i),this.readOnlyReason?t.push(h`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&t.push(h`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let a=this.conflict;t.push(h`<div class="banner err"><b>Save rejected.</b> ${a.message}
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
                ${i.map(a=>h`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${Px(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:h`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?h`<div class="err">${this.moveError}</div>`:m}
    </div>`}renderAddLayer(){let t=this.draft?.config;if(!t||!this.canEdit)return m;if(!Ze(this.activeFamily))return m;let i=t.elements.length>=64,a=this.addOpen,r=this.addDetail==="expanded",o=Ig.filter(u=>Rg(this.activeFamily,u)),s=sl.filter(u=>u.families===void 0||u.families.includes(this.activeFamily)),l=s.filter(u=>u.group===void 0),c=s.filter(u=>u.group==="list"),d=()=>{this.addOpen=!this.addOpen,this.saveListView()};return h`<div class="card fold" data-open=${a?"true":"false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"}
        title=${a?"Hide the add buttons":"Show the add buttons"}
        @click=${d}
        @keydown=${u=>{(u.key==="Enter"||u.key===" ")&&(u.preventDefault(),d())}}>
        <span class="swatch">${D("plus")}</span>Add a layer<span class="spacer"></span>
        ${a?m:h`<span class="mini">${o.length} kinds · ${s.length} presets</span>`}
        ${a?h`<span class="tool-set" @click=${u=>u.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${[["compact","Names"],["expanded","Samples"]].map(([u,p])=>h`
                  <button class=${this.addDetail===u?"on":""} title=${p} aria-label=${p} aria-pressed=${this.addDetail===u?"true":"false"}
                    @click=${()=>{this.addDetail=u,this.saveListView()}}>${D(u)}</button>`)}
              </span>
            </span>`:m}
        <span class="chev">${D("chevron")}</span>
      </h2>
      ${a?h`
          <div class="add-grid ${r?"":"lean"}">
            ${o.map(u=>h`<button class="add" style=${`--k:${tt[u]}`} ?disabled=${i} title=${`Add a blank ${ct[u].toLowerCase()} layer`}
              @click=${()=>{let p=Le(u);this.addHere(f=>{f.elements.push(p),p.kind==="timeline"&&Ei(f,p.payload.id)}),this.inspect={kind:"layer",id:p.payload.id}}}
              >${r?h`<span class="well">${Qg(u)}</span>`:m}<span class="add-name">${r?D(u):h`<span class="k"></span>`}<span>${ct[u]}</span></span></button>`)}
          </div>
          <div class="presets">
            <span class="presets-l">Presets</span>
            ${l.map(u=>h`<button class="preset" title=${u.blurb}
              ?disabled=${t.elements.length+u.layerCount>64}
              @click=${()=>this.openPreset(u.kind)}>${u.title}</button>`)}
          </div>
          ${c.length===0?m:h`<div class="presets">
            <span class="presets-l">List</span>
            ${c.map(u=>h`<button class="preset" title=${u.blurb}
              ?disabled=${t.elements.length+u.layerCount>64}
              @click=${()=>this.openPreset(u.kind)}>${u.title}</button>`)}
          </div>`}`:m}
      ${this.renderPresetDialog()}
    </div>`}isGroupId(t){return this.draft?.config.groups?.some(i=>i.id===t)===!0}reorderLayer(t,i,a,r=!1){t!==i&&this.mutate(o=>{let s=o.elements.filter(g=>!we(o,g)),l=o.elements.filter(g=>we(o,g)),c=[...s].reverse(),d=c.find(g=>g.payload.id===i);if(!d)return;let u=o.groups?.find(g=>g.id===t),p=u?c.filter(g=>g.payload.groupId===u.id):c.filter(g=>g.payload.id===t);if(p.length===0||p.includes(d))return;c=c.filter(g=>!p.includes(g));let f;if((u||r)&&d.payload.groupId!==void 0){let g=c.filter(b=>b.payload.groupId===d.payload.groupId);f=a?c.indexOf(g[0]):c.indexOf(g[g.length-1])+1}else f=c.indexOf(d)+(a?0:1);if(c.splice(f,0,...p),!u){let g=p[0],b=r?void 0:d.payload.groupId;b===void 0?delete g.payload.groupId:g.payload.groupId=b}o.elements=[...c.reverse(),...l],_t(o),ma(o)})}markDrop(t,i){return t.classList.contains(i)?!1:(this.clearDropMarks(),t.classList.add(i),!0)}clearDropMarks(){for(let t of this.renderRoot.querySelectorAll(".layer"))t.classList.remove("drop-before","drop-after","drop-into")}clearDragMarks(){this.clearDropMarks();for(let t of this.renderRoot.querySelectorAll(".layer, .group-kids"))t.classList.remove("dragging")}rowDrag(t,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=t,a.dataTransfer?.setData("text/plain",t),a.dataTransfer&&(a.dataTransfer.effectAllowed="move");let r=a.currentTarget,o=r.nextElementSibling;window.setTimeout(()=>{this.dragId===t&&(r.classList.add("dragging"),o?.classList.contains("group-kids")&&o.classList.add("dragging"))},0)},onEnd:()=>{this.dragId=void 0,this.clearDragMarks()},onOver:a=>{if(!this.dragId||this.dragId===t)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),s=o.top+(r.classList.contains("drop-before")?Tn:0),l=o.bottom-(r.classList.contains("drop-after")?Tn:0);this.markDrop(r,a.clientY<(s+l)/2?"drop-before":"drop-after")},onDrop:a=>{a.preventDefault();let o=a.currentTarget.classList.contains("drop-before");this.clearDragMarks(),this.dragId&&this.reorderLayer(this.dragId,t,o),this.dragId=void 0}}}clickRow(t,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(t);return}if(Nx(i)){this.togglePick(t),this.pickAnchor=t;return}this.multi=new Set,this.inspect={kind:"layer",id:t},this.pickAnchor=t}pickRange(t){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===t){this.togglePick(t);return}let r=[...i.elements].filter(l=>!we(i,l)).reverse().map(l=>l.payload.id),o=r.indexOf(a),s=r.indexOf(t);if(o<0||s<0){this.togglePick(t);return}this.multi=new Set(r.slice(Math.min(o,s),Math.max(o,s)+1))}togglePick(t){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==t&&i.add(this.inspect.id),i.has(t)?i.delete(t):i.add(t),this.multi=i}groupPicked(){let t=[...this.multi];if(!this.canEdit||t.length<2)return;let i;this.mutate(a=>{i=cc(a,t)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let t=this.draft?.config;if(!t)return m;if(!Ze(this.activeFamily))return this.renderInlineHasNoLayers();let i=this.canEdit,a=this.canvasFamily,r=(I,G)=>this.moveLayer(I,G),o=I=>{let G;this.mutate(J=>{G=Cf(J,I)}),G&&(this.inspect={kind:"layer",id:G})},s=I=>{this.mutate(G=>Se(G,I)),this.inspect.kind==="layer"&&this.inspect.id===I&&(this.inspect={kind:"general"})},l=Ct(t,a).filter(I=>!we(t,I)).reverse(),c=me(this.host()),d=new qt(this.buildContext(),this.draft?.config),u=t.perFamily[this.activeFamily],p=this.inspect.kind==="family",f=`${u?.backgroundColorHex?Ue(u.backgroundColorHex):"transparent"} \xB7 ${u?.borderColorHex?`${u.borderWidth} pt border`:"no border"}`,g=[...this.multi].filter(I=>t.elements.some(G=>G.payload.id===I)).length,b=Yt(t,this.buildContext(),this.forced)[a],y=zx[this.thumbStep],w=Math.round(fo*y),k=Math.round(mo*y),S=I=>b?h`<span class="thumb">${js(b,I,{icons:this.icons,imageSizes:this.imageSizes,width:w,height:k})}</span>`:h`<span class="thumb"></span>`,R=this.layerDetail==="expanded",O=(I,G,J=!1,te=m)=>{let M=I.payload.id,q=this.inspect.kind==="layer"&&this.inspect.id===M,x=_e(t,a,I),T=x.isHidden,P=lt(t,M)[0],C=Gr(I.payload.rules),_=this.picking&&this.pickHoverId===M,B=this.rowDrag(M,i);return h`<div class="layer ${q?"hl":""} ${J?"held":""} ${_?"pick":""} ${this.dialogLitIds.includes(M)?"lit":""} ${T?"dim":""} ${this.multi.has(M)?"multi":""} ${G?"kid":""} ${R?"rich":""}"
        style=${`--k:${tt[I.kind]}`} tabindex="0" draggable=${B.draggable}
        @pointerenter=${()=>{this.listHoverIds=[M]}}
        @pointerleave=${()=>this.leaveRow([M])}
        @click=${j=>this.clickRow(M,j)}
        @keydown=${j=>{j.key==="Enter"&&(this.inspect={kind:"layer",id:M})}}
        @dragstart=${B.onStart} @dragend=${B.onEnd} @dragover=${B.onOver} @drop=${B.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a group to put it inside.">${D("grip")}</span>
        <span class="bar"></span>
        ${S([M])}
        <span class="name">
          <b>${Ce(I,c)}</b>
          <small><span class="kind">${ct[I.kind]}</span> · ${ME(I,d,this.historySeries,x.size)}</small>
          ${R?h`<span class="facts">${EE(this.host(),a,I,x).map(j=>h`<span class="fact"><b>${j.label}</b> ${j.value}</span>`)}</span>`:m}
        </span>
        <span class="right">
          <span class="badges">
            ${P?h`<span class="badge tap" title=${`Tappable \xB7 ${Ce(P,c)}`}>tap</span>`:m}
            ${I.payload.rules.length===0?m:h`<span class="badge states" title=${C}>${C.replace(/\.$/,"").toLowerCase()}</span>`}
            ${T?h`<span class="badge">hidden</span>`:m}
          </span>
          ${i?h`<span class="acts">
            <button class="icon" title=${`Bring forward (${ii}])`} aria-label="Bring forward" @click=${j=>{j.stopPropagation(),r(M,1)}}>${D("up")}</button>
            <button class="icon" title=${`Send back (${ii}[)`} aria-label="Send back" @click=${j=>{j.stopPropagation(),r(M,-1)}}>${D("down")}</button>
            <button class="icon" title=${`${x.isHidden?"Show":"Hide"} (${Mp}${ii}H)`} aria-label=${x.isHidden?"Show this layer":"Hide this layer"} @click=${j=>{j.stopPropagation(),this.mutate(se=>Ae(se,a,M,{isHidden:!x.isHidden}))}}>${D(x.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${ii}D)`} aria-label="Duplicate" @click=${j=>{j.stopPropagation(),o(M)}}>${D("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${j=>{j.stopPropagation(),s(M)}}>${D("delete")}</button>
          </span>`:m}
          ${te}
        </span>
      </div>`},F=(I,G)=>{let J=this.inspect.kind==="group"&&this.inspect.id===I.id,te=!this.collapsed.has(I.id),M=this.rowDrag(I.id,i),q=G[0],x=G[G.length-1],T=C=>{let _=C.currentTarget,B=_.getBoundingClientRect(),j=B.top+(_.classList.contains("drop-before")?Tn:0),se=B.bottom-(_.classList.contains("drop-after")?Tn:0),ve=(C.clientY-j)/Math.max(1,se-j);return ve<.25?"drop-before":!te&&ve>.75?"drop-after":"drop-into"},P=G.map(C=>C.payload.id);return h`<div class="layer group ${J?"hl":""} ${this.dialogLitIds.includes(I.id)?"lit":""} ${R?"rich":""}" style=${`--k:${oe.group}`} tabindex="0" draggable=${M.draggable}
        @pointerenter=${()=>{this.listHoverIds=P}}
        @pointerleave=${()=>this.leaveRow(P)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:I.id}}}
        @keydown=${C=>{C.key==="Enter"&&(this.inspect={kind:"group",id:I.id})}}
        @dragstart=${M.onStart} @dragend=${M.onEnd}
        @dragover=${C=>{!this.dragId||this.dragId===I.id||(C.preventDefault(),this.markDrop(C.currentTarget,T(C)))}}
        @drop=${C=>{C.preventDefault();let _=T(C);this.clearDragMarks();let B=this.dragId;if(this.dragId=void 0,!(!B||!q||!x)){if(_==="drop-before"){this.reorderLayer(B,q.payload.id,!0,!0);return}if(_==="drop-after"){this.reorderLayer(B,x.payload.id,!1,!0);return}this.isGroupId(B)||(this.reorderLayer(B,q.payload.id,!0),this.mutate(j=>Tr(j,B,I.id)))}}}>
        <span class="grip" title="Drag to reorder the whole group.">${D("grip")}</span>
        <span class="bar"></span>
        <span class="folder">${D("folder")}</span>
        <span class="name">
          <b>${I.name}</b>
          <small><span class="kind">Group</span> · ${G.length} layer${G.length===1?"":"s"} · ${I.locked?"locked":"unlocked"}</small>
          ${R?h`<span class="facts"><span class="fact"><b>Holds</b> ${G.map(C=>Ce(C,c)).join(", ")}</span></span>`:m}
        </span>
        <span class="right">
          ${i?h`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${Mp}${ii}G)`} aria-label="Ungroup" @click=${C=>{C.stopPropagation(),this.mutate(_=>ga(_,I.id)),J&&(this.inspect={kind:"general"})}}>${D("ungroup")}</button>
          </span>`:m}
          <button class="icon lockbtn ${I.locked?"on":""}" ?disabled=${!i}
            title=${I.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone, unless the group row is selected. Click to lock."}
            aria-label=${I.locked?"Unlock the group":"Lock the group"}
            @click=${C=>{C.stopPropagation(),this.mutate(_=>{let B=_.groups?.find(j=>j.id===I.id);B&&(B.locked=!B.locked)})}}>${D(I.locked?"lock":"unlock")}</button>
          <button class="chev" aria-expanded=${te?"true":"false"} title=${te?"Fold the group":"Unfold the group"}
            @click=${C=>{C.stopPropagation();let _=new Set(this.collapsed);te?_.add(I.id):_.delete(I.id),this.collapsed=_}}>${D("chevron")}</button>
        </span>
      </div>`},z=(I,G,J)=>{let te=I.payload.id,M=G.payload.id,q=this.inspect.kind==="layer"&&this.inspect.id===M,x=G.payload.isHidden,T=I.payload.template.length,P=()=>{this.setRowEdit(te),this.inspect={kind:"layer",id:M}},C=B=>this.mutate(j=>{let se=Ki(j,te);se?.kind==="list"&&B(se.payload)}),_=B=>C(j=>{let se=j.template[J],ve=j.template[J+B];!se||!ve||(j.template[J]=ve,j.template[J+B]=se)});return h`<div class="layer kid rowkid ${q?"hl":""} ${x?"dim":""}"
        style=${`--k:${tt[G.kind]}`} tabindex="0"
        @pointerenter=${()=>{this.listHoverIds=[M]}}
        @pointerleave=${()=>this.leaveRow([M])}
        @click=${()=>P()}
        @keydown=${B=>{B.key==="Enter"&&P()}}>
        <span class="grip" aria-hidden="true"></span>
        <span class="bar"></span>
        <span class="rowglyph">${D(np(G.kind))}</span>
        <span class="name">
          <b>${Ce(G,c)}</b>
          <small><span class="kind">${ct[G.kind]}</span> · drawn in every row</small>
        </span>
        <span class="right">
          <span class="badges">${x?h`<span class="badge">hidden</span>`:m}</span>
          ${i?h`<span class="acts">
            <button class="icon" title="Bring forward in the row" aria-label="Bring forward in the row" ?disabled=${J===T-1}
              @click=${B=>{B.stopPropagation(),_(1)}}>${D("up")}</button>
            <button class="icon" title="Send back in the row" aria-label="Send back in the row" ?disabled=${J===0}
              @click=${B=>{B.stopPropagation(),_(-1)}}>${D("down")}</button>
            <button class="icon" title=${x?"Show this layer":"Hide this layer"} aria-label=${x?"Show this layer":"Hide this layer"}
              @click=${B=>{B.stopPropagation(),C(j=>{let se=j.template[J];se&&(se.payload.isHidden=!se.payload.isHidden)})}}>${D(x?"hide":"show")}</button>
            <button class="icon danger" title="Remove this layer from the row" aria-label="Remove this layer from the row"
              @click=${B=>{B.stopPropagation(),C(j=>{j.template.splice(J,1),qi(j)}),this.inspect.kind==="layer"&&this.inspect.id===M&&(this.inspect={kind:"layer",id:te})}}>${D("delete")}</button>
          </span>`:m}
        </span>
      </div>`},$=I=>{if(I.kind!=="list"||I.payload.template.length===0)return m;let G=I.payload.id,J=!this.collapsed.has(G);return h`<button class="chev" aria-expanded=${J?"true":"false"}
        title=${J?"Fold the row's layers":"Unfold the row's layers"}
        @click=${te=>{te.stopPropagation();let M=new Set(this.collapsed);J?M.add(G):M.delete(G),this.collapsed=M}}>${D("chevron")}</button>`},A=I=>{if(I.kind!=="list"||I.payload.template.length===0)return m;if(this.collapsed.has(I.payload.id))return m;let G=I.payload.template.map((J,te)=>[J,te]).reverse();return h`<div class="group-kids rowkids">${G.map(([J,te])=>z(I,J,te))}</div>`},W=[],Q=new Set;for(let I=0;I<l.length;I++){let G=l[I],J=G.payload.groupId,te=J===void 0?void 0:t.groups?.find(x=>x.id===J);if(!te){W.push(h`${O(G,!1,!1,$(G))}${A(G)}`);continue}if(Q.has(te.id))continue;Q.add(te.id);let M=l.filter(x=>x.payload.groupId===te.id);W.push(F(te,M));let q=this.inspect.kind==="group"&&this.inspect.id===te.id;this.collapsed.has(te.id)||W.push(h`<div class="group-kids">${M.map(x=>h`${O(x,!0,q,$(x))}${A(x)}`)}</div>`)}return h`<div class="card layers-card s${this.thumbStep}" style=${`--thumb-w:${w}px;--thumb-h:${k}px`}>
      <h2 class="panel-title tools" style=${`--c:${oe.place}`}><span class="swatch">${D("layers")}</span>Layers
        <span class="mini">top draws last</span><span class="spacer"></span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${[["compact","Compact rows: the name and one line about the layer"],["expanded","Expanded rows: what the layer is made of and where it sits"]].map(([I,G])=>h`
              <button class=${this.layerDetail===I?"on":""} title=${G} aria-label=${G} aria-pressed=${this.layerDetail===I?"true":"false"}
                @click=${()=>{this.layerDetail=I,this.saveListView()}}>${D(I)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${yE.map((I,G)=>h`
              <button class=${this.thumbStep===G?"on":""} title=${`${Ix[G]} row pictures`}
                aria-label=${`${Ix[G]} row pictures`} aria-pressed=${this.thumbStep===G?"true":"false"}
                @click=${()=>{this.thumbStep=G,this.saveListView()}}>${I}</button>`)}
          </span>
        </span>
      </h2>
      ${g>=2&&i?h`<div class="group-cta"><span>${g} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${ii}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:t.elements.length>=2&&i&&!t.groups?.length?h`<div class="hint">${za}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`:m}
      ${t.elements.length===0?h`<div class="empty">No layers yet. Add one above.</div>`:m}
      ${this.renderShapeIsBlank(t,a,i)}
      <div class="layers">
      ${W}
      </div>
      <div class="layer pinned ${p?"hl":""}" style=${`--k:${oe.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${I=>{I.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${I=>{this.dragId&&(I.preventDefault(),this.markDrop(I.currentTarget,"drop-before"))}}
        @drop=${I=>{I.preventDefault(),this.clearDragMarks();let G=this.dragId,J=[...l].reverse().find(te=>te.payload.id!==G&&te.payload.groupId!==G);G&&J&&this.reorderLayer(G,J.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${D("shape")}</span>
        <span class="bar"></span>
        ${S([])}
        <span class="name">
          <b>${ae(this.activeFamily)} shape</b>
          <small><span class="kind">Background</span> · ${f}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
    </div>`}renderInlineHasNoLayers(){return h`<div class="card">
      <h2 class="panel-title"><span class="swatch">${D("layers")}</span>Layers</h2>
      <div class="empty">Inline is one line of text and draws no layers.
        Its text is on the right. Pick a canvas shape above to work on layers.</div>
    </div>`}renderPresetDialog(){let t=this.presetKind?wu(this.presetKind):void 0,i=this.presetEntity;return h`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${t===void 0?m:h`
        <h2>${t.title}</h2>
        <div class="hint">${t.blurb}</div>
        ${rt(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},Tx,{compact:!0,...t.domains?{domain:t.domains}:{},...t.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(t){if(this.canEdit){if(wu(t).needsEntity===!1){let i={family:this.canvasFamily},a;this.addHere(r=>{a=Tu(r,t,{entityId:"",displayName:"",domain:""},i)}),a&&(this.inspect={kind:"layer",id:a});return}this.presetKind=t,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())})}}closePresetDialog(){let t=this.renderRoot.querySelector("dialog.preset-dialog");t?.open?t.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let t=this.presetKind,i=this.presetEntity;if(!t||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.addHere(s=>{o=Tu(s,t,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return h`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let t=this.canvasConfig();if(!t)return h`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=Yt(t,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return h`
      <div class="card canvas-card">
        <div class="canvas-bar">
          <div class="bar-row shapes">${this.renderShapeTabs(t,i)}</div>
          <div class="bar-row tools">
          <span class="inbox" title=${`Layouts are made in the ${this.referenceCase.label} box. Every other size draws a scaled copy of it.`}>
            <span class="pre">Preview as</span>
            <span class="case-tool" data-menu="case">
              <button class="case-pick" aria-haspopup="listbox" aria-expanded=${this.openMenu==="case"?"true":"false"}
                aria-label=${`Preview as ${a.label}`} @click=${()=>this.toggleMenu("case")}>
                ${a.label}${a.measured?"":" (estimated)"}${D("chevron")}
              </button>
              ${this.openMenu==="case"?h`<div class="pop-menu" role="listbox" aria-label="Preview as">
                ${this.previewCases.map(o=>h`<button class="row" role="option" aria-selected=${o.label===a.label?"true":"false"}
                  @click=${()=>{this.toggleMenu("case",!1),this.previewCase=o.label}}>${o.label}${o.measured?"":" (estimated)"}</button>`)}
              </div>`:m}
            </span>
          </span>
          ${Ze(r)?this.renderTintTool():m}
          </div>
        </div>
        <div class="stage">
          ${this.renderRowStrip()}
          ${Ze(r)?this.renderOver():m}
          ${Ze(r)?this.renderBigPreview(r,i,a):this.renderInlinePreview(i.inline,!1)}
          ${this.renderUnder(t,r)}
        </div>
        ${this.zoomed&&Ze(r)?this.renderZoomDialog(r,i,a):m}
      </div>
      <div class="under-grid">
        ${this.renderValuesRow()}
      </div>`}renderBigPreview(t,i,a){let r=i[t];if(!r)return m;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,s=this.canvasConfig(),l=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&s?kt(s,o)?.id:void 0,c=s&&l!==void 0&&(this.inspect.kind==="group"||kt(s,o)?.locked)?$t(s,l).map(y=>y.payload.id):[],d=[...new Set([...c,...this.multi])],u=qn(a,t),p=this.focusTapId(),f=!this.picking&&!this.showTaps&&this.rowHoverId!==void 0&&s?.elements.some(y=>y.payload.id===this.rowHoverId)?this.rowHoverId:void 0,g=f!==void 0?[]:this.listHoverIds,b={icons:this.icons,imageSizes:this.imageSizes,tapAreas:!0,slot:u,highlightId:p??f??o,...d.length>0&&!this.showTaps&&f===void 0?{highlightIds:d}:{},...this.showGridLines||!this.snapGrid&&this.altHeld&&this.canEdit?{grid:this.gridStep}:{},...this.guides.length>0&&t===this.activeFamily?{guides:this.guides}:{},tapReview:this.showTaps,...this.previewTint!==void 0?{tint:this.previewTint,...Jt(t)?{tintSurface:"phone"}:{}}:{},...p!==void 0?{tapFocusId:p}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||p!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:g.length>0?{hoverIds:g}:{}};return h`<div class="preview ${t} active ${this.picking?"picking":""}"
      @pointerdown=${y=>this.onPreviewPointerDown(t,y)}
      @dblclick=${y=>this.onPreviewDoubleClick(y)}
      @pointermove=${y=>this.onPickMove(y)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${_i(r,b)}
    </div>`}renderUnder(t,i){let a=me(this.host()),r=this.inspect,o=r.kind==="layer"?t.elements.find(p=>p.payload.id===r.id):void 0,s,l=this.rowEditList();if(l)s=h`one cell of <b>${Ce(l,a)}</b>, scaled up. Drag and size the row's layers here.
        <button class="link" @click=${()=>this.setRowEdit(void 0)}>Done designing</button>`;else if(this.showTaps)s=h`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${bn(t.tapAction)}</b>.`;else if(this.picking)s="Point at a layer and click it. Escape stops.";else if(i==="inline")s="One line of text. Edit it on the right.";else if(r.kind==="group"){let p=t.groups?.find(g=>g.id===r.id),f=p?$t(t,p.id).length:0;s=p?h`editing group <b>${p.name}</b>. Drag to move all ${f} layers.${p.locked?"":" Click one layer to move it alone."}`:""}else if(o){let p=kt(t,o.payload.id);s=p?.locked?h`editing <b>${Ce(o,a)}</b> in <b>${p.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:h`editing <b>${Ce(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.${this.snapGrid&&this.snapLayers?" It snaps to the grid and to the other layers. Hold Alt to drag freely.":this.snapGrid?" It snaps to the grid. Hold Alt to drag freely.":this.snapLayers?" It snaps to the other layers. Hold Alt to drag freely.":" Hold Alt while dragging to snap to the grid."}`}else s="click a layer to edit it";if(!Ze(i))return h`<div class="under"><b>Inline</b><span class="dot">·</span><span class="tail">${s}</span></div>`;let c=qn(this.currentCase(),i),d=Bs(c,i),u=Math.round(d.scale*100);return h`<div class="under">
      <b>${ae(i)}</b>
      <span class="size">${c.width} × ${c.height} pt${u!==100?` \xB7 ${u}%`:""}</span>
      <span class="dot">·</span>
      <span class="tail">${s}</span>
    </div>`}renderInlinePreview(t,i){let a;if(!t)a=h`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=t.countdownEnd!==void 0&&t.countdownEnd>r?Ca((t.countdownEnd-r)/1e3):t.text,s=t.symbol?this.icons.render(t.symbol,i?11:15,"#FFFFFF"):void 0;a=h`<div class="inline-line">${s??m}<span>${t.label?`${t.label}: `:""}${o}</span></div>`}return i?a:h`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSharedValues(){let t=this.draft?.config;if(!t)return m;let i=t.values,a=this.canEdit?h`<button class="small" @click=${()=>{let d=Lb();this.mutate(u=>{u.values.push(d)}),this.openSharedValue(d.id)}}>Add</button>`:m,r="Like a variable: set it once, and every layer that reads it follows.",o=h`<h2 class="panel-title"><span class="swatch">${D("content")}</span>Shared values
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
      </div>`;let s=this.host(),l=new qt(this.buildContext(),this.draft?.config),c=me(s);return h`<div class="card tint-values values-list" style=${`--c:${oe.complication}`}>
      ${o}
      <div class="data">
      ${i.map(d=>{let u=l.resolve({kind:{kind:"named",id:d.id}}),p=this.openValue===d.id,f=()=>{this.setOpenValue(p?void 0:d.id)};return h`<div class="vitem ${p?"open":""}"><div class="datum vrow ${p?"hl":""}" role="button" tabindex="0" aria-expanded=${p?"true":"false"}
            title=${p?"Close":"Edit this shared value"}
            @click=${f}
            @keydown=${g=>{(g.key==="Enter"||g.key===" ")&&g.target===g.currentTarget&&(g.preventDefault(),f())}}>
          <span class="nm">${d.name||"(unnamed)"}</span>
          <span class="spacer"></span>
          <span class="meta ${u===void 0?"none":""}" title=${Ne(d.value,c)}>${u??"unresolved"}</span>
          ${this.canEdit?h`<button class="icon danger" title="Delete. Layers that read it keep their own copy." aria-label="Delete value" @click=${g=>{g.stopPropagation(),this.mutate(b=>{bc(b,d.id)}),p&&(this.openValue=void 0)}}>${D("delete")}</button>`:m}
        </div>
        ${p?h`<div class="value-open">${Ib(s,d)}</div>`:m}</div>`})}
      </div>
    </div>`}setOpenValue(t){let i=this.openValue;if(this.openValue=t,i===void 0||i===t)return;let a=this.draft?.config.values.find(r=>r.id===i);a&&a.name.trim()===""&&this.mutate(r=>{bc(r,i)})}openSharedValue(t){this.renderRoot.querySelectorAll(":popover-open").forEach(a=>a.hidePopover()),this.setOpenValue(t);let i=this.draft?.config.values.find(a=>a.id===t)?.name.trim()==="";this.updateComplete.then(()=>{this.renderRoot.querySelector(".values-list .datum.hl")?.scrollIntoView({block:"start",behavior:"smooth"}),i&&this.renderRoot.querySelector(".values-list .value-open input[type=text]")?.focus({preventScroll:!0})})}openRaw(){this.showRaw=!0;let t=this.renderRoot.querySelector("details.foot");t&&(t.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapeTabs(t,i){let a=t.supportedFamilies,r=this.ownerFamilies.filter(o=>!a.includes(o));return h`<div class="shape-seg" role="group" aria-label="Shapes">${this.renderHaveTabs(t,i)}</div>
      ${r.length>0?h`<span class="shape-adds">${r.map(o=>h`<button class="tab off ${o}" ?disabled=${!this.canEdit}
        title=${`Add the ${ae(o)} shape`} @click=${()=>this.addShape(o)}>${D("plus")}${ae(o)}</button>`)}</span>`:m}`}renderHaveTabs(t,i){let a=t.supportedFamilies;return this.ownerFamilies.filter(r=>a.includes(r)).map(r=>{let o=r===this.activeFamily,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let d=i[r];s=d?_i(d,{icons:this.icons,imageSizes:this.imageSizes,slot:qn(this.referenceCase,r)}):m}let l=r!=="inline"&&_l(t,r)===0&&t.elements.length>0,c=this.canEdit&&Xs(t,r);return h`<span class="tab-wrap">
        <button class="tab ${r}" aria-pressed=${o?"true":"false"} title=${`Edit the ${ae(r)} shape`}
          @click=${()=>{this.activeFamily=r,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
          <span class="art">${s}</span>
          <span class="lbl">${ae(r)}</span>${l?h`<small>nothing shown</small>`:m}
        </button>
        ${this.canEdit?h`<button class="icon danger tab-x" ?disabled=${!c}
          title=${c?`Remove the ${ae(r)} shape`:"The only shape. Add another before removing it."}
          aria-label=${`Remove the ${ae(r)} shape`}
          @click=${d=>{d.stopPropagation(),this.removeShape(r)}}>${D("delete")}</button>`:m}
      </span>`})}renderValuesRow(){let t=this.draft?.config;if(!t)return m;let i=[...this.compiled?.entities.keys()??[]],a=im(t),r=this.testValues.size>0;return h`<div class="card tint-states" style=${`--c:${oe.states}`}>
      <h2 class="panel-title"><span class="swatch">${D("states")}</span>Values on the ${this.deviceWord}
        <span class="mini">live · slide, pick or type one to try another</span><span class="spacer"></span>
        ${r?h`<span class="testing-pill">Testing with your values <button @click=${()=>{this.editingValue=void 0,this.applyTestValues(new Map)}}>Back to live</button></span>`:m}
      </h2>
      ${i.length===0&&a.length===0?h`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>`:h`<div class="chips values">
        ${i.map(o=>{let s=this.hass.states[o],l=typeof s?.attributes.friendly_name=="string"?s.attributes.friendly_name:o,c=typeof s?.attributes.unit_of_measurement=="string"?` ${s.attributes.unit_of_measurement}`:"",d=s?`${s.state}${c}`:"not in Home Assistant",u=this.testValues.get(o),f=t.elements.find(g=>ks(t,g.payload.id).some(b=>b.ref.entityId===o))?.kind??"text";return h`<div class="vchip vrow ctl ${u!==void 0?"testing":""}" style=${`--k:${tt[f]}`}
            title=${u!==void 0?`Live value: ${d}`:""}>
            <span class="kbar"></span><b>${l}</b><span class="spacer"></span>
            ${this.renderTestControl(o,l,s,u,c,d)}
            ${u!==void 0?h`<button type="button" class="small live-reset" title=${`Back to the live value: ${d}`} @click=${()=>this.setTestValue(o,void 0)}>Live</button>`:m}
          </div>`})}
        ${a.map(o=>{let s=Fc(o.id),l=this.sharedRaw(o.id)??"",c=l===""?"empty":l,d=o.name||"(unnamed)",u=this.testValues.get(s),p={entity_id:s,state:l,attributes:{},last_changed:"",last_updated:""};return h`<div class="vchip vrow ctl ${u!==void 0?"testing":""}" style=${`--k:${oe.complication}`}
            title=${u!==void 0?`Saved value: ${c}`:""}>
            <span class="kbar"></span><b>${d}</b><span class="vtag" title="A shared value. Trying one here is not saved; change it in Shared values to keep it.">shared</span><span class="spacer"></span>
            ${this.renderTestControl(s,d,p,u,"",c)}
            ${u!==void 0?h`<button type="button" class="small live-reset" title=${`Back to the saved value: ${c}`} @click=${()=>this.setTestValue(s,void 0)}>Live</button>`:m}
          </div>`})}
      </div>`}
    </div>`}renderTestControl(t,i,a,r,o,s){let l=r??a?.state??"",c=rm(t,a,r);if(c.kind==="choice")return h`<span class="test-ctl"><select aria-label=${`Test value for ${i}`} @change=${f=>this.setTestValue(t,f.target.value)}>
        ${c.options.map(f=>h`<option value=${f} ?selected=${f===l}>${f}</option>`)}
      </select></span>`;let d=this.editingValue===t?h`<input type="text" .value=${l} aria-label=${`Test value for ${i}`}
          @keydown=${f=>{f.key==="Enter"&&f.target.blur(),f.key==="Escape"&&(this.editingValue=void 0)}}
          @blur=${f=>this.commitTestValue(t,f.target.value)} />`:h`<button type="button" class="val" title="Click to type a value"
          @click=${()=>{this.editingValue=t,this.updateComplete.then(()=>this.renderRoot.querySelector(".vchip input[type=text]")?.focus())}}>${r!==void 0?`${r}${o}`:s}</button>`;if(c.kind==="text")return h`<span class="test-ctl">${d}</span>`;let u=Number(l),p=l.trim()!==""&&Number.isFinite(u)?u:c.min;return h`<span class="test-ctl">
      <input type="range" min=${c.min} max=${c.max} step=${c.step} .value=${String(p)}
        aria-label=${`Slide the test value for ${i}`}
        @input=${f=>this.setTestValue(t,f.target.value,`test-${t}`)}
        @change=${()=>this.draft?.endGesture()} />
      ${d}
    </span>`}commitTestValue(t,i){this.editingValue=void 0,this.setTestValue(t,i)}setTestValue(t,i,a){let r=i?.trim()??"",o=new Map(this.testValues),s=t.startsWith(Ss)?this.sharedRaw(t.slice(Ss.length)):this.hass.states[t]?.state;r===""||r===s?o.delete(t):o.set(t,r),this.applyTestValues(o,a)}sharedRaw(t){let i=this.draft?.config;if(!i)return;let a=this.buildContext(!1),r=a.namedValues.map(o=>({...o,value:{kind:o.value.kind}}));return new qt({...a,namedValues:r},i).resolve({kind:{kind:"named",id:t}})}applyTestValues(t,i){let a=this.draft;!a||t.size===a.testValues.size&&[...t].every(([o,s])=>a.testValues.get(o)===s)||(a.setTestValues(t,i),this.version++)}get previewCases(){return Ve(this.selectedOwner)==="iphone"?zr:Pr}get referenceCase(){return Ve(this.selectedOwner)==="iphone"?Yc:Gs}currentCase(){return this.previewCases.find(t=>t.label===this.previewCase)??this.referenceCase}previewSlot(t){return qn(this.currentCase(),t)}crumbs(t,i){let a=this.inspect,r=t.name.trim()||"Complication",o=ae(this.activeFamily),s=a.kind==="family"&&i===void 0?h`<span class="here" style=${`--k:${oe.place}`}>${o} shape</span>`:h`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,l=m,c=m;if(i!==void 0)l=h`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span><span class="nm">${i} layers</span></span>`;else if(a.kind==="layer"){let d=Ki(t,a.id);if(d){l=h`<span class="here" style=${`--k:${tt[d.kind]}`} title=${Ce(d,me(this.host()))}><span class="kchip">${ct[d.kind]}</span></span>`;let u=kt(t,d.payload.id);u&&(c=h`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:u.id}}} title="Edit the group">${u.name}</button>`)}}else if(a.kind==="group"){let d=t.groups?.find(u=>u.id===a.id);d&&(l=h`<span class="here" style=${`--k:${oe.group}`} title=${d.name}><span class="kchip">Group</span></span>`)}return h`<div class="crumbs">
      <button title="Edit the complication" @click=${()=>{this.multi=new Set,this.inspect={kind:"general"}}}>${r}</button><span class="sep">›</span>${s}${c}
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
          ${Re(a,"complication","Complication",Fb(a),{color:oe.complication,icon:"watch",alwaysOpen:!0})}
          <p class="insp-note">Click a layer ${Ve(this.selectedOwner)==="iphone"?"on the preview":"on the watch"} or in the list to edit it. The shape's own background and border are the bottom row of the list.</p>
        </div>`;let s=m,l=!0;if(r.kind==="layer"){let d=Ki(t,r.id);if(!d)return this.inspect={kind:"general"},m;s=Bb(a,d,this.canvasFamily,{placement:!0,tap:!0})}else if(r.kind==="group"){let d=t.groups?.find(u=>u.id===r.id);if(!d)return this.inspect={kind:"general"},m;l=!1,s=Kb(a,d)}else s=jb(a,this.activeFamily);let c=this.openSections.size>1;return h`
      <div class="insp-head">
        ${this.crumbs(t)}
        ${l?h`<button class="expand" @click=${()=>{this.openSections=c?new Set([gE(r)]):new Set(Xu)}}>${c?"One at a time":"Open all"}</button>`:m}
      </div>
      <div class="insp-body" style=${o} @change=${()=>this.draft?.endGesture()}>${s}</div>`}triCheck(t,i,a){return h`<label class="field check">
      <span>${t}${i==="mixed"?h` <span class="mixed">(mixed)</span>`:m}</span>
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} /></label>`}multiEditor(t,i){let a=this.canvasFamily,r=this.host(),o=me(r),s=new qt(this.buildContext(),this.draft?.config),l=Nb(t,a,i),c=i.length,d=[...i].reverse(),u=f=>this.mutate(g=>{for(let b of i)Ae(g,a,b.payload.id,{isHidden:f})}),p=f=>this.mutate(g=>{for(let b of i){let y=g.elements.find(w=>w.payload.id===b.payload.id);y&&y.kind!=="image"&&y.kind!=="tap"&&y.kind!=="timeline"&&y.kind!=="chartTimes"&&y.kind!=="chartDots"&&y.kind!=="chartGrid"&&y.kind!=="imageTime"&&y.kind!=="list"&&(y.payload.colorSlot.baseColorHex=f)}},"multi-colour");return h`
      ${Re(r,"picked",`${c} layers picked`,h`
          <div class="field list-field"><span>Layers</span>
            <div class="picked">
              ${d.map(f=>h`<div class="row" style=${`--k:${tt[f.kind]}`}>
                <span class="bar"></span>
                <span class="name">
                  ${f.kind==="icon"?h`<span class="glyph">${this.icons.render(s.resolve(f.payload.symbol)??"questionmark",16,f.payload.colorSlot.baseColorHex)??m}</span>`:m}
                  <b>${Ce(f,o)}</b><span class="kind">${ct[f.kind]}</span>
                </span>
              </div>`)}
            </div>
            <div class="row-acts">
              <button class="small primary" title=${`Group (${ii}G)`} @click=${()=>this.groupPicked()}>Group them</button>
              <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
            </div>
          </div>
          <div class="hint">${za}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>`,{color:"var(--wa-accent)",icon:"layers",summary:`Edits here land on all ${c}`,alwaysOpen:!0})}
      ${Re(r,"picked-common",`All ${c} at once`,h`
          ${this.triCheck("Hidden",l.hiddenHere,u)}
          ${l.colourable?h`${ye("Colour",l.colour,f=>{f!==void 0&&p(f)})}
              ${l.colour===void 0?h`<div class="hint keep">These layers are different colours. Pick one to give them all the same.</div>`:m}`:h`<div class="hint keep">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">These layers are on the ${ae(a)} shape and on no other, so nothing here reaches another shape.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>`,{color:oe.place,icon:"place",summary:"The settings every picked layer has",alwaysOpen:!0})}`}renderFooter(){let t=this.draft;if(!t)return m;let i=this.records.find(r=>r.id===this.selectedId),a=Dg({revision:i?.revision??null,dirty:t.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return h`<details class="foot">
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
    </details>`}};H([ea({attribute:!1})],L.prototype,"hass",2),H([ea({type:Boolean})],L.prototype,"narrow",2),H([ea({attribute:!1})],L.prototype,"panel",2),H([N()],L.prototype,"colLeft",2),H([N()],L.prototype,"colRight",2),H([N()],L.prototype,"panelWidth",2),H([N()],L.prototype,"owners",2),H([N()],L.prototype,"ownerId",2),H([N()],L.prototype,"records",2),H([N()],L.prototype,"selectedId",2),H([N()],L.prototype,"draft",2),H([N()],L.prototype,"readOnlyReason",2),H([N()],L.prototype,"parseError",2),H([N()],L.prototype,"maxSchemaVersion",2),H([N()],L.prototype,"presets",2),H([N()],L.prototype,"occupied",2),H([N()],L.prototype,"serverToken",2),H([N()],L.prototype,"appliedToken",2),H([N()],L.prototype,"sendStatusKnown",2),H([N()],L.prototype,"polling",2),H([N()],L.prototype,"lastPollSeconds",2),H([N()],L.prototype,"lastSyncSeconds",2),H([N()],L.prototype,"pushAvailable",2),H([N()],L.prototype,"lastPushSeconds",2),H([N()],L.prototype,"sendPending",2),H([N()],L.prototype,"pages",2),H([N()],L.prototype,"templateResults",2),H([N()],L.prototype,"historySeries",2),H([N()],L.prototype,"historyReadings",2),H([N()],L.prototype,"listItems",2),H([N()],L.prototype,"rowEditListId",2),H([N()],L.prototype,"templateError",2),H([N()],L.prototype,"templateFetchedAt",2),H([N()],L.prototype,"forced",2),H([N()],L.prototype,"showRaw",2),H([N()],L.prototype,"inspect",2),H([N()],L.prototype,"openSections",2),H([N()],L.prototype,"helpSections",2),H([N()],L.prototype,"pickerOpen",2),H([N()],L.prototype,"pickerFilter",2),H([N()],L.prototype,"pickerNote",2),H([N()],L.prototype,"pickerHiddenOpen",2),H([N()],L.prototype,"pickerConfirmDelete",2),H([N()],L.prototype,"openValue",2),H([N()],L.prototype,"sharedHelp",2),H([N()],L.prototype,"editingValue",2),H([N()],L.prototype,"thumbStep",2),H([N()],L.prototype,"layerDetail",2),H([N()],L.prototype,"addOpen",2),H([N()],L.prototype,"addDetail",2),H([N()],L.prototype,"multi",2),H([N()],L.prototype,"copiedPosition",2),H([N()],L.prototype,"snapGrid",2),H([N()],L.prototype,"gridStep",2),H([N()],L.prototype,"showGridLines",2),H([N()],L.prototype,"snapLayers",2),H([N()],L.prototype,"guides",2),H([N()],L.prototype,"openMenu",2),H([N()],L.prototype,"altHeld",2),H([N()],L.prototype,"collapsed",2),H([N()],L.prototype,"activeFamily",2),H([N()],L.prototype,"picking",2),H([N()],L.prototype,"pickHoverId",2),H([N()],L.prototype,"listHoverIds",2),H([N()],L.prototype,"rowHoverId",2),H([N()],L.prototype,"zoomed",2),H([N()],L.prototype,"helpOpen",2),H([N()],L.prototype,"showTaps",2),H([N()],L.prototype,"savedName",2),H([N()],L.prototype,"presetKind",2),H([N()],L.prototype,"presetEntity",2),H([N()],L.prototype,"newOpen",2),H([N()],L.prototype,"newName",2),H([N()],L.prototype,"newFamily",2),H([N()],L.prototype,"shareOpen",2),H([N()],L.prototype,"shareMode",2),H([N()],L.prototype,"shareLabels",2),H([N()],L.prototype,"shareFamilies",2),H([N()],L.prototype,"dialogLitIds",2),H([N()],L.prototype,"shareGroupNames",2),H([N()],L.prototype,"shareValueNames",2),H([N()],L.prototype,"shareName",2),H([N()],L.prototype,"shareLayerNames",2),H([N()],L.prototype,"shareNote",2),H([N()],L.prototype,"shareTextOpen",2),H([N()],L.prototype,"shareCopied",2),H([N()],L.prototype,"shareLinkShown",2),H([N()],L.prototype,"shareFocus",2),H([N()],L.prototype,"galleryOpen",2),H([N()],L.prototype,"galleryTab",2),H([N()],L.prototype,"galleryStep",2),H([N()],L.prototype,"galleryReplaces",2),H([N()],L.prototype,"galleryTitle",2),H([N()],L.prototype,"galleryDescription",2),H([N()],L.prototype,"galleryTags",2),H([N()],L.prototype,"galleryNickname",2),H([N()],L.prototype,"galleryPreviews",2),H([N()],L.prototype,"galleryPreviewNote",2),H([N()],L.prototype,"gallerySending",2),H([N()],L.prototype,"gallerySent",2),H([N()],L.prototype,"galleryError",2),H([N()],L.prototype,"galleryUploads",2),H([N()],L.prototype,"galleryUploadsError",2),H([N()],L.prototype,"galleryConfirmDelete",2),H([N()],L.prototype,"galleryDeleting",2),H([N()],L.prototype,"importOpen",2),H([N()],L.prototype,"importText",2),H([N()],L.prototype,"importParse",2),H([N()],L.prototype,"importName",2),H([N()],L.prototype,"importMap",2),H([N()],L.prototype,"importFamilies",2),H([N()],L.prototype,"importDrop",2),H([N()],L.prototype,"importTextShown",2),H([N()],L.prototype,"importFocus",2),H([N()],L.prototype,"importHistory",2),H([N()],L.prototype,"shareLink",2),H([N()],L.prototype,"helpTab",2),H([N()],L.prototype,"linkNote",2),H([N()],L.prototype,"previewCase",2),H([N()],L.prototype,"previewTint",2),H([N()],L.prototype,"loadError",2),H([N()],L.prototype,"saveError",2),H([N()],L.prototype,"saving",2),H([N()],L.prototype,"conflict",2),H([N()],L.prototype,"remoteRevision",2),H([N()],L.prototype,"confirmDelete",2),H([N()],L.prototype,"moveTarget",2),H([N()],L.prototype,"moving",2),H([N()],L.prototype,"moveError",2),H([N()],L.prototype,"version",2);var Ap=L;function on(e){return String(e?.message??e)}function SE(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let n=e.split(":").map(t=>Number(t));if(!(n.length===0||n.length>3||n.some(t=>Number.isNaN(t))))return n.reduce((t,i)=>t*60+i,0)}function Px(e){let n=e.device_name??e.owner_watch_id;return Ve(e)==="iphone"?/iphone/i.test(n)?n:`${n} (iPhone)`:e.paired_iphone_name?`${n} (${e.paired_iphone_name})`:n}function TE(e){return[...e.filter(n=>Ve(n)!=="iphone"),...e.filter(n=>Ve(n)==="iphone")]}function EE(e,n,t,i){let a=[{label:"Shows",value:rp(e,t)}],r=Ml(t);return r&&a.push({label:"Looks",value:r}),i.frame.rotationDegrees!==0&&a.push({label:"Turned",value:`${Math.round(i.frame.rotationDegrees)}\xB0`}),a}function RE(e){return e<120?`${e} min`:e%1440===0?`${e/1440} d`:e%60===0?`${e/60} h`:`${e} min`}function ME(e,n,t,i){let a=r=>h`<span class="val-tok">${r??"--"}</span>`;switch(e.kind){case"text":return h`${a(n.resolve(e.payload.value))} · ${i??e.payload.fontSize} pt`;case"icon":return`${i??e.payload.size} pt \xB7 ${Ue(e.payload.colorSlot.baseColorHex)}`;case"gauge":return h`${a(n.resolve(e.payload.value))} · ${e.payload.style}`;case"chart":{let r=Wt(e.payload)??Kt(e.payload),o=r!==void 0?t.get(r)??"":n.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${dt(o).length} values`}case"timeline":{let r=st(e.payload),o=r===void 0?[]:Hr(t.get(r)??""),s=Math.max(0,o.length-1);return`${RE(Lt(e.payload))} \xB7 ${s} ${s===1?"change":"changes"}`}case"shape":return`${Ue(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return e.payload.contentMode==="fill"?"fill":"fit";case"tap":return bn(e.payload.action);case"chartTimes":return`${e.payload.timeLabelCount} times \xB7 ${e.payload.labelSize} pt`;case"chartDots":return`${e.payload.dots==="all"?"every reading":"auto"}${e.payload.size===void 0?"":` \xB7 ${e.payload.size} pt`}`;case"chartGrid":return`${e.payload.lines} ${e.payload.lines===1?"line":"lines"} \xB7 ${e.payload.thickness} pt`;case"imageTime":return}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",Ap);export{Ap as WristAssistantPanel,Dx as columnFit,EE as layerFacts,Px as ownerLabel,TE as ownersByKind};
