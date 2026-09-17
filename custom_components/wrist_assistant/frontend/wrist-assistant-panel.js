var ew=Object.defineProperty;var tw=Object.getOwnPropertyDescriptor;var A=(e,n,t,i)=>{for(var a=i>1?void 0:i?tw(n,t):n,r=e.length-1,o;r>=0;r--)(o=e[r])&&(a=(i?o(n,t,a):o(a))||a);return i&&a&&ew(n,t,a),a};var Oo=globalThis,zo=Oo.ShadowRoot&&(Oo.ShadyCSS===void 0||Oo.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Td=Symbol(),Rh=new WeakMap,Qa=class{constructor(n,t,i){if(this._$cssResult$=!0,i!==Td)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=t}get styleSheet(){let n=this.o,t=this.t;if(zo&&n===void 0){let i=t!==void 0&&t.length===1;i&&(n=Rh.get(t)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),i&&Rh.set(t,n))}return n}toString(){return this.cssText}},Ve=e=>new Qa(typeof e=="string"?e:e+"",void 0,Td),Ed=(e,...n)=>{let t=e.length===1?e[0]:n.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[r+1],e[0]);return new Qa(t,e,Td)},Ah=(e,n)=>{if(zo)e.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of n){let i=document.createElement("style"),a=Oo.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=t.cssText,e.appendChild(i)}},Rd=zo?e=>e:e=>e instanceof CSSStyleSheet?(n=>{let t="";for(let i of n.cssRules)t+=i.cssText;return Ve(t)})(e):e;var{is:nw,defineProperty:iw,getOwnPropertyDescriptor:aw,getOwnPropertyNames:rw,getOwnPropertySymbols:ow,getPrototypeOf:sw}=Object,Go=globalThis,Fh=Go.trustedTypes,lw=Fh?Fh.emptyScript:"",dw=Go.reactiveElementPolyfillSupport,er=(e,n)=>e,tr={toAttribute(e,n){switch(n){case Boolean:e=e?lw:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,n){let t=e;switch(n){case Boolean:t=e!==null;break;case Number:t=e===null?null:Number(e);break;case Object:case Array:try{t=JSON.parse(e)}catch{t=null}}return t}},Bo=(e,n)=>!nw(e,n),Mh={attribute:!0,type:String,converter:tr,reflect:!1,useDefault:!1,hasChanged:Bo};Symbol.metadata??=Symbol("metadata"),Go.litPropertyMetadata??=new WeakMap;var cn=class extends HTMLElement{static addInitializer(n){this._$Ei(),(this.l??=[]).push(n)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(n,t=Mh){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(n)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(n,t),!t.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(n,i,t);a!==void 0&&iw(this.prototype,n,a)}}static getPropertyDescriptor(n,t,i){let{get:a,set:r}=aw(this.prototype,n)??{get(){return this[t]},set(o){this[t]=o}};return{get:a,set(o){let s=a?.call(this);r?.call(this,o),this.requestUpdate(n,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)??Mh}static _$Ei(){if(this.hasOwnProperty(er("elementProperties")))return;let n=sw(this);n.finalize(),n.l!==void 0&&(this.l=[...n.l]),this.elementProperties=new Map(n.elementProperties)}static finalize(){if(this.hasOwnProperty(er("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(er("properties"))){let t=this.properties,i=[...rw(t),...ow(t)];for(let a of i)this.createProperty(a,t[a])}let n=this[Symbol.metadata];if(n!==null){let t=litPropertyMetadata.get(n);if(t!==void 0)for(let[i,a]of t)this.elementProperties.set(i,a)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let a=this._$Eu(t,i);a!==void 0&&this._$Eh.set(a,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(n){let t=[];if(Array.isArray(n)){let i=new Set(n.flat(1/0).reverse());for(let a of i)t.unshift(Rd(a))}else n!==void 0&&t.push(Rd(n));return t}static _$Eu(n,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof n=="string"?n.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(n=>this.enableUpdating=n),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(n=>n(this))}addController(n){(this._$EO??=new Set).add(n),this.renderRoot!==void 0&&this.isConnected&&n.hostConnected?.()}removeController(n){this._$EO?.delete(n)}_$E_(){let n=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(n.set(i,this[i]),delete this[i]);n.size>0&&(this._$Ep=n)}createRenderRoot(){let n=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ah(n,this.constructor.elementStyles),n}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(n=>n.hostConnected?.())}enableUpdating(n){}disconnectedCallback(){this._$EO?.forEach(n=>n.hostDisconnected?.())}attributeChangedCallback(n,t,i){this._$AK(n,i)}_$ET(n,t){let i=this.constructor.elementProperties.get(n),a=this.constructor._$Eu(n,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:tr).toAttribute(t,i.type);this._$Em=n,r==null?this.removeAttribute(a):this.setAttribute(a,r),this._$Em=null}}_$AK(n,t){let i=this.constructor,a=i._$Eh.get(n);if(a!==void 0&&this._$Em!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:tr;this._$Em=a;let s=o.fromAttribute(t,r.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(n,t,i,a=!1,r){if(n!==void 0){let o=this.constructor;if(a===!1&&(r=this[n]),i??=o.getPropertyOptions(n),!((i.hasChanged??Bo)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(n)&&!this.hasAttribute(o._$Eu(n,i))))return;this.C(n,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(n,t,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this._$Ej??=new Map).has(n)&&(this._$Ej.set(n,o??t??this[n]),r!==!0||o!==void 0)||(this._$AL.has(n)||(this.hasUpdated||i||(t=void 0),this._$AL.set(n,t)),a===!0&&this._$Em!==n&&(this._$Eq??=new Set).add(n))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[a,r]of this._$Ep)this[a]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,s=this[a];o!==!0||this._$AL.has(a)||s===void 0||this.C(a,void 0,r,s)}}let n=!1,t=this._$AL;try{n=this.shouldUpdate(t),n?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw n=!1,this._$EM(),i}n&&this._$AE(t)}willUpdate(n){}_$AE(n){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(n){return!0}update(n){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(n){}firstUpdated(n){}};cn.elementStyles=[],cn.shadowRootOptions={mode:"open"},cn[er("elementProperties")]=new Map,cn[er("finalized")]=new Map,dw?.({ReactiveElement:cn}),(Go.reactiveElementVersions??=[]).push("2.1.2");var Fd=globalThis,Lh=e=>e,Vo=Fd.trustedTypes,Ih=Vo?Vo.createPolicy("lit-html",{createHTML:e=>e}):void 0,Md="$lit$",un=`lit$${Math.random().toFixed(9).slice(2)}$`,Ld="?"+un,cw=`<${Ld}>`,mi=document,ir=()=>mi.createComment(""),ar=e=>e===null||typeof e!="object"&&typeof e!="function",Id=Array.isArray,Oh=e=>Id(e)||typeof e?.[Symbol.iterator]=="function",Ad=`[ 	
\f\r]`,nr=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Hh=/-->/g,_h=/>/g,hi=RegExp(`>|${Ad}(?:([^\\s"'>=/]+)(${Ad}*=${Ad}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ph=/'/g,Nh=/"/g,zh=/^(?:script|style|textarea|title)$/i,Hd=e=>(n,...t)=>({_$litType$:e,strings:n,values:t}),h=Hd(1),x=Hd(2),SA=Hd(3),pn=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),Dh=new WeakMap,fi=mi.createTreeWalker(mi,129);function Gh(e,n){if(!Id(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ih!==void 0?Ih.createHTML(n):n}var Bh=(e,n)=>{let t=e.length-1,i=[],a,r=n===2?"<svg>":n===3?"<math>":"",o=nr;for(let s=0;s<t;s++){let l=e[s],c,d,u=-1,p=0;for(;p<l.length&&(o.lastIndex=p,d=o.exec(l),d!==null);)p=o.lastIndex,o===nr?d[1]==="!--"?o=Hh:d[1]!==void 0?o=_h:d[2]!==void 0?(zh.test(d[2])&&(a=RegExp("</"+d[2],"g")),o=hi):d[3]!==void 0&&(o=hi):o===hi?d[0]===">"?(o=a??nr,u=-1):d[1]===void 0?u=-2:(u=o.lastIndex-d[2].length,c=d[1],o=d[3]===void 0?hi:d[3]==='"'?Nh:Ph):o===Nh||o===Ph?o=hi:o===Hh||o===_h?o=nr:(o=hi,a=void 0);let f=o===hi&&e[s+1].startsWith("/>")?" ":"";r+=o===nr?l+cw:u>=0?(i.push(c),l.slice(0,u)+Md+l.slice(u)+un+f):l+un+(u===-2?s:f)}return[Gh(e,r+(e[t]||"<?>")+(n===2?"</svg>":n===3?"</math>":"")),i]},rr=class e{constructor({strings:n,_$litType$:t},i){let a;this.parts=[];let r=0,o=0,s=n.length-1,l=this.parts,[c,d]=Bh(n,t);if(this.el=e.createElement(c,i),fi.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(a=fi.nextNode())!==null&&l.length<s;){if(a.nodeType===1){if(a.hasAttributes())for(let u of a.getAttributeNames())if(u.endsWith(Md)){let p=d[o++],f=a.getAttribute(u).split(un),g=/([.?@])?(.*)/.exec(p);l.push({type:1,index:r,name:g[2],strings:f,ctor:g[1]==="."?Ko:g[1]==="?"?Wo:g[1]==="@"?jo:yi}),a.removeAttribute(u)}else u.startsWith(un)&&(l.push({type:6,index:r}),a.removeAttribute(u));if(zh.test(a.tagName)){let u=a.textContent.split(un),p=u.length-1;if(p>0){a.textContent=Vo?Vo.emptyScript:"";for(let f=0;f<p;f++)a.append(u[f],ir()),fi.nextNode(),l.push({type:2,index:++r});a.append(u[p],ir())}}}else if(a.nodeType===8)if(a.data===Ld)l.push({type:2,index:r});else{let u=-1;for(;(u=a.data.indexOf(un,u+1))!==-1;)l.push({type:7,index:r}),u+=un.length-1}r++}}static createElement(n,t){let i=mi.createElement("template");return i.innerHTML=n,i}};function gi(e,n,t=e,i){if(n===pn)return n;let a=i!==void 0?t._$Co?.[i]:t._$Cl,r=ar(n)?void 0:n._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(e),a._$AT(e,t,i)),i!==void 0?(t._$Co??=[])[i]=a:t._$Cl=a),a!==void 0&&(n=gi(e,a._$AS(e,n.values),a,i)),n}var Uo=class{constructor(n,t){this._$AV=[],this._$AN=void 0,this._$AD=n,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(n){let{el:{content:t},parts:i}=this._$AD,a=(n?.creationScope??mi).importNode(t,!0);fi.currentNode=a;let r=fi.nextNode(),o=0,s=0,l=i[0];for(;l!==void 0;){if(o===l.index){let c;l.type===2?c=new ca(r,r.nextSibling,this,n):l.type===1?c=new l.ctor(r,l.name,l.strings,this,n):l.type===6&&(c=new qo(r,this,n)),this._$AV.push(c),l=i[++s]}o!==l?.index&&(r=fi.nextNode(),o++)}return fi.currentNode=mi,a}p(n){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(n,i,t),t+=i.strings.length-2):i._$AI(n[t])),t++}},ca=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(n,t,i,a){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=n,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let n=this._$AA.parentNode,t=this._$AM;return t!==void 0&&n?.nodeType===11&&(n=t.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,t=this){n=gi(this,n,t),ar(n)?n===m||n==null||n===""?(this._$AH!==m&&this._$AR(),this._$AH=m):n!==this._$AH&&n!==pn&&this._(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):Oh(n)?this.k(n):this._(n)}O(n){return this._$AA.parentNode.insertBefore(n,this._$AB)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}_(n){this._$AH!==m&&ar(this._$AH)?this._$AA.nextSibling.data=n:this.T(mi.createTextNode(n)),this._$AH=n}$(n){let{values:t,_$litType$:i}=n,a=typeof i=="number"?this._$AC(n):(i.el===void 0&&(i.el=rr.createElement(Gh(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{let r=new Uo(a,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(n){let t=Dh.get(n.strings);return t===void 0&&Dh.set(n.strings,t=new rr(n)),t}k(n){Id(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,a=0;for(let r of n)a===t.length?t.push(i=new e(this.O(ir()),this.O(ir()),this,this.options)):i=t[a],i._$AI(r),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(n=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);n!==this._$AB;){let i=Lh(n).nextSibling;Lh(n).remove(),n=i}}setConnected(n){this._$AM===void 0&&(this._$Cv=n,this._$AP?.(n))}},yi=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(n,t,i,a,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=n,this.name=t,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=m}_$AI(n,t=this,i,a){let r=this.strings,o=!1;if(r===void 0)n=gi(this,n,t,0),o=!ar(n)||n!==this._$AH&&n!==pn,o&&(this._$AH=n);else{let s=n,l,c;for(n=r[0],l=0;l<r.length-1;l++)c=gi(this,s[i+l],t,l),c===pn&&(c=this._$AH[l]),o||=!ar(c)||c!==this._$AH[l],c===m?n=m:n!==m&&(n+=(c??"")+r[l+1]),this._$AH[l]=c}o&&!a&&this.j(n)}j(n){n===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}},Ko=class extends yi{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===m?void 0:n}},Wo=class extends yi{constructor(){super(...arguments),this.type=4}j(n){this.element.toggleAttribute(this.name,!!n&&n!==m)}},jo=class extends yi{constructor(n,t,i,a,r){super(n,t,i,a,r),this.type=5}_$AI(n,t=this){if((n=gi(this,n,t,0)??m)===pn)return;let i=this._$AH,a=n===m&&i!==m||n.capture!==i.capture||n.once!==i.once||n.passive!==i.passive,r=n!==m&&(i===m||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,n):this._$AH.handleEvent(n)}},qo=class{constructor(n,t,i){this.element=n,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(n){gi(this,n)}},Vh={M:Md,P:un,A:Ld,C:1,L:Bh,R:Uo,D:Oh,V:gi,I:ca,H:yi,N:Wo,U:jo,B:Ko,F:qo},uw=Fd.litHtmlPolyfillSupport;uw?.(rr,ca),(Fd.litHtmlVersions??=[]).push("3.3.3");var Yo=(e,n,t)=>{let i=t?.renderBefore??n,a=i._$litPart$;if(a===void 0){let r=t?.renderBefore??null;i._$litPart$=a=new ca(n.insertBefore(ir(),r),r,void 0,t??{})}return a._$AI(e),a};var _d=globalThis,_n=class extends cn{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let n=super.createRenderRoot();return this.renderOptions.renderBefore??=n.firstChild,n}update(n){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=Yo(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return pn}};_n._$litElement$=!0,_n.finalized=!0,_d.litElementHydrateSupport?.({LitElement:_n});var pw=_d.litElementPolyfillSupport;pw?.({LitElement:_n});(_d.litElementVersions??=[]).push("4.2.2");var hw={attribute:!0,type:String,converter:tr,reflect:!1,hasChanged:Bo},fw=(e=hw,n,t)=>{let{kind:i,metadata:a}=t,r=globalThis.litPropertyMetadata.get(a);if(r===void 0&&globalThis.litPropertyMetadata.set(a,r=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),r.set(t.name,e),i==="accessor"){let{name:o}=t;return{set(s){let l=n.get.call(this);n.set.call(this,s),this.requestUpdate(o,l,e,!0,s)},init(s){return s!==void 0&&this.C(o,void 0,e,s),s}}}if(i==="setter"){let{name:o}=t;return function(s){let l=this[o];n.call(this,s),this.requestUpdate(o,l,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ua(e){return(n,t)=>typeof t=="object"?fw(e,n,t):((i,a,r)=>{let o=a.hasOwnProperty(r);return a.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(a,r):void 0})(e,n,t)}function F(e){return ua({...e,state:!0,attribute:!1})}var Vd=["rectangular","circular","corner"],Gn=["small","medium","large","xlarge"],ue=[...Vd,...Gn];function $i(e){return ue.includes(e)}var ge={rectangular:{width:181,height:65.5},circular:{width:51,height:51},corner:{width:34,height:34},small:{width:162.67,height:162.67},medium:{width:344.67,height:162.67},large:{width:344.67,height:360},xlarge:{width:344.67,height:557.33}},or=["rectangular","circular","corner","inline",...Gn];var Ud=64;function uf(e,n){let t=new Set(e);for(let i of n)t.add(i.slot);for(let i=0;i<Ud;i++)if(!t.has(i))return i;return-1}function pf(e,n){let t=new Set(e);return n.filter(i=>i.kind!=="preset"||!t.has(i.slot))}function hn(e){return mw(e)?8:Gn.some(t=>e.supportedFamilies.includes(t))?7:Vd.some(t=>!e.supportedFamilies.includes(t))||e.supportedFamilies.includes("inline")||e.inline!==void 0?6:e.slotIndex>7?5:4}function mw(e){if(e.elements.some(t=>t.kind==="list"))return!0;let n=!1;return mt(e,t=>{(t.kind.kind==="item"||t.kind.kind==="listStat")&&(n=!0)}),n}function Kd(e){return e==="standard"||e==="condensed"||e==="compressed"||e==="expanded"?e:void 0}var Wd=4,St=.5;function mr(e){return Number.isFinite(e)?Math.min(1,Math.max(St,e)):St}var gw=["none","dot","triangle"],yw=["straight","smooth","step"],bw=["light","medium","strong"],xw={light:.05,medium:.1,strong:.2};function Uh(e){return typeof e=="string"&&yw.includes(e)?e:"straight"}var vw=["flat","fade"],ww=["none","all","auto"],hf=4,fn="#FFFFFF33";function Dn(e){return typeof e=="string"&&vw.includes(e)?e:"flat"}function Od(e){return typeof e=="string"&&ww.includes(e)?e:"none"}function zd(e){return typeof e!="number"||!Number.isFinite(e)?0:Math.max(0,Math.min(hf,Math.round(e)))}function fa(e,n){return e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function Pn(e){return typeof e=="string"&&e!==""?e:fn}var kw=1,$w=12;function Kt(e){if(!(typeof e!="number"||!Number.isFinite(e)))return Math.max(kw,Math.min($w,e))}function es(e){return e==="all"?"all":"auto"}var Bn=1,Vn=3,ts=.25,ns=4;function Ri(e){return typeof e!="number"||!Number.isFinite(e)?Vn:Math.max(1,Math.min(hf,Math.round(e)))}function Ai(e){return typeof e!="number"||!Number.isFinite(e)?Bn:Math.max(ts,Math.min(ns,e))}var Cw=["all","top"],ma=1.2;function On(e){return typeof e!="number"||!Number.isFinite(e)?ma:Math.max(0,e)}function zn(e){return typeof e=="string"&&Cw.includes(e)?e:"all"}function It(e){if(typeof e=="string")return bw.includes(e)?e:void 0;if(e===3||e===5)return"light";if(e===7)return"medium";if(e===9)return"strong"}function ff(e,n){if(n===void 0||e<2)return 0;let t=Math.max(3,Math.floor(e*xw[n]+.5));return t%2===0?t+1:t}var Sw=[["history","Recorded history"],["statistics","Long-term statistics"]],is=[["5minute","5 min"],["hour","Hour"],["day","Day"],["week","Week"],["month","Month"]],jd=[["mean","Mean"],["min","Min"],["max","Max"],["change","Change"],["sum","Total"]],qd="history",gr="hour",yr="mean",jt=[["latest","Newest reading"],["first","First reading"],["highest","Highest reading"],["lowest","Lowest reading"],["average","Average reading"],["delta","Change"],["sum","Total"],["trend","Trend arrow"],["top","Top of the scale"],["bottom","Bottom of the scale"]],as=[["clock","Time"],["date","Date"],["weekday","Weekday"],["dateTime","Weekday and time"]];function rs(e){return e==="clock"||e==="dateTime"}var mf=[["count","Items shown"],["total","Items in total"]],br={x:.25,y:.25,width:.5,height:.5,rotationDegrees:0},qt=[["highest","Highest reading"],["lowest","Lowest reading"],["now","Now"],["first","First reading"],["latest","Newest reading"],["threshold","Threshold"],["zero","Zero"]];function mn(e){return e!=="threshold"&&e!=="zero"}var os=[["above","Above"],["on","On"],["below","Inside"],["bottom","At the bottom"],["through","Through"]];function Tw(e){return qt.some(([n])=>n===e)}function Ew(e){return os.some(([n])=>n===e)}function Rw(e){if(!G(e)||typeof e.layer!="string"||e.layer==="")return;let n={layer:e.layer.toUpperCase(),at:Tw(e.at)?e.at:"highest",place:Ew(e.place)?e.place:"above"},t=te(e.dx,0),i=te(e.dy,0);return t!==0&&(n.dx=t),i!==0&&(n.dy=i),n}function Jo(e,n){let t=Rw(e.chartAnchor);t!==void 0&&(n.chartAnchor=t)}function Zo(e,n){e.chartAnchor!==void 0&&(n.chartAnchor=Aw(e.chartAnchor))}function Aw(e){let n={layer:e.layer,at:e.at,place:e.place};return e.dx!==void 0&&e.dx!==0&&(n.dx=Z(e.dx)),e.dy!==void 0&&e.dy!==0&&(n.dy=Z(e.dy)),n}var gf=[["linear","Linear"],["radial","Radial"]],Yd=2,ss=4;function sr(e){if(!G(e)||!Array.isArray(e.stops))return;let n=[];for(let a of e.stops){if(n.length===ss)break;if(!G(a))continue;let r=fe(a.colorHex);r===void 0||r===""||n.push({at:Lt(te(a.at,0)),colorHex:r})}if(n.length<Yd)return;let t={kind:e.kind==="radial"?"radial":"linear",stops:n},i=te(e.angle,0);return t.kind==="linear"&&i!==0&&(t.angle=i),t}function Qo(e){let n={kind:e.kind,stops:e.stops.map(t=>({at:Z(t.at),colorHex:t.colorHex}))};return e.kind==="linear"&&e.angle!==void 0&&e.angle!==0&&(n.angle=Z(e.angle)),n}function Yt(e,n){let t=[...e.stops].sort((r,o)=>r.at-o.at),i=t[0],a=t[t.length-1];if(n<=i.at)return i.colorHex;if(n>=a.at)return a.colorHex;for(let r=1;r<t.length;r++){let o=t[r],s=t[r-1];if(n>o.at)continue;let l=o.at-s.at;return Fw(s.colorHex,o.colorHex,l<=0?0:(n-s.at)/l)}return a.colorHex}function Fw(e,n,t){let i=l=>{let c=l.replace(/^#/,""),d=c.length===6?`${c}FF`:c.padEnd(8,"F");return[0,2,4,6].map(u=>parseInt(d.slice(u,u+2),16)||0)},a=i(e),r=i(n),o=a.map((l,c)=>Math.round(l+(r[c]-l)*t)),s=o.map(l=>Math.max(0,Math.min(255,l)).toString(16).padStart(2,"0").toUpperCase());return o[3]===255?`#${s[0]}${s[1]}${s[2]}`:`#${s.join("")}`}function yf(e,n){let t=e.replace(/^#/,""),i=t.length>=6?t.slice(0,6).toUpperCase():"FFFFFF",a=t.length>=8?parseInt(t.slice(6,8),16):255,r=Math.min(255,Math.max(0,Math.round(a*n)));return r===255?`#${i}`:`#${i}${r.toString(16).padStart(2,"0").toUpperCase()}`}var ls=[["up","Up"],["down","Down"],["left","Left"],["right","Right"]],xr="up",vr=0,wr=100,bf=.25;function ds(e){return{value:e,minValue:vr,maxValue:wr,direction:xr}}function Mw(e){if(!G(e))return;let n={value:G(e.value)?we(e.value):U("50"),minValue:te(e.minValue,vr),maxValue:te(e.maxValue,wr),direction:bi(e.direction,ls.map(([i])=>i),xr)};G(e.minSource)&&(n.minSource=we(e.minSource)),G(e.maxSource)&&(n.maxSource=we(e.maxSource));let t=fe(e.trackColorHex);return t!==void 0&&t!==""&&(n.trackColorHex=t),n}function Lw(e){let n={value:me(e.value)};return e.minValue!==vr&&(n.minValue=Z(e.minValue)),e.maxValue!==wr&&(n.maxValue=Z(e.maxValue)),e.minSource!==void 0&&(n.minSource=me(e.minSource)),e.maxSource!==void 0&&(n.maxSource=me(e.maxSource)),e.direction!==xr&&(n.direction=e.direction),e.trackColorHex!==void 0&&(n.trackColorHex=e.trackColorHex),n}function Kh(e,n){let t=Mw(e.level);t!==void 0&&(n.level=t)}function Wh(e,n){e.level!==void 0&&(n.level=Lw(e.level))}var Iw=["circular","rectangular","corner","small","medium","large","xlarge"];function cs(e){return Iw.includes(e)}var us=.1,ps=3,kr=.5,Xd=10,Jd=360,Qe=120,Zd=-2,Qd=20;function Hw(e){if(!G(e))return;let n=te(e.radius,NaN);if(!Number.isFinite(n))return;let t={radius:Math.min(ps,Math.max(us,n))},i=te(e.angle,0);i!==0&&(t.angle=i);let a=$r(te(e.sweep,Qe));a!==Qe&&(t.sweep=a);let r=Cr(te(e.spacing,0));return r!==0&&(t.spacing=r),e.flip===!0&&(t.flip=!0),t}function $r(e){if(!Number.isFinite(e)||e===0)return Qe;let n=Math.min(Jd,Math.max(Xd,Math.abs(e)));return e<0?-n:n}function Cr(e){return Number.isFinite(e)?Math.min(Qd,Math.max(Zd,e)):0}function _w(e){let n={radius:Z(e.radius)};return e.angle!==void 0&&e.angle!==0&&(n.angle=Z(e.angle)),e.sweep!==void 0&&e.sweep!==Qe&&(n.sweep=Z(e.sweep)),e.spacing!==void 0&&e.spacing!==0&&(n.spacing=Z(e.spacing)),e.flip===!0&&(n.flip=!0),n}var tt={setColor:"color",setOpacity:"opacity",setText:"text",setIcon:"icon",setFontSize:"fontSize",setFontWeight:"fontWeight",setFontDesign:"fontDesign",setFontWidth:"fontWidth",setItalic:"italic",setRotation:"rotation",hide:"visibility",show:"visibility",setGaugeValue:"gaugeValue",setGaugeMin:"gaugeMin",setGaugeMax:"gaugeMax",setBorderColor:"borderColor",setBorderWidth:"borderWidth",setBackgroundColor:"backgroundColor"},ec=12,Ci=12,Sr="#000000",ga={colorHex:Sr,radius:3,dx:0,dy:1};function tc(e){return Number.isFinite(e)?Math.min(ec,Math.max(0,e)):0}function cr(e){return Number.isFinite(e)?Math.min(Ci,Math.max(-Ci,e)):0}function Tr(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):1}function xf(e){return e.countdown===!0?!1:e.coloring==="bands"&&(e.bands?.length??0)>0||e.highlight!==void 0&&e.highlight!=="none"}function _t(e){return e.countdown!==!0&&(e.parts?.length??0)>0}function Fi(e){if(e.kind.kind==="literal")return(e.format?.prefix??"")+e.kind.value+(e.format?.suffix??"")}function Er(e){let n=d=>d.value.kind.kind!=="literal",t=(d,u)=>e.slice(d,u).map(p=>Fi(p.value)??"").join(""),i=e.findIndex(n);if(i<0)return U(t(0,e.length));let a=e.findIndex((d,u)=>u>i&&n(d)),r=e[i].value,o={...r.format},s=t(0,i)+(o.prefix??""),l=(o.suffix??"")+t(i+1,a<0?e.length:a);delete o.prefix,delete o.suffix,s!==""&&(o.prefix=s),l!==""&&(o.suffix=l);let c={kind:structuredClone(r.kind)};return Xe(o)||(c.format=o),c}function vf(e){_t(e)&&(e.value=Er(e.parts))}var Rr="svg:custom",Pw="0 0 24 24",jh=8*1024;function Ar(e){return e.symbol.kind.kind==="literal"&&e.symbol.kind.value===Rr}function nc(e){if(e===void 0)return;let n=e.trim();if(!(n===""||n===Pw))return n}function wf(e){let n={minX:0,minY:0,width:24,height:24};if(e===void 0)return n;let t=e.trim().split(/[\s,]+/).filter(l=>l!=="");if(t.length!==4)return n;let i=t.map(l=>Number(l));if(!i.every(l=>Number.isFinite(l)))return n;let[a,r,o,s]=i;return!(o>0)||!(s>0)?n:{minX:a,minY:r,width:o,height:s}}var Nw=/^[MmLlHhVvCcSsQqTtAaZz0-9eE+\-.,\s]+$/;function kf(e){let n=e.trim();if(n==="")return{ok:!1,error:"Paste an SVG path or the whole <svg> markup."};let t=n.startsWith("<"),i=t?Dw(n):n.replace(/\s+/g," ").trim();if(t&&i==="")return{ok:!1,error:"That markup has no <path> in it. Only paths can be drawn on a watch face."};if(!Nw.test(i))return{ok:!1,error:"That is not an SVG path: it holds characters no path command uses."};if(!/[Mm]/.test(i))return{ok:!1,error:"An SVG path starts with a move command (M)."};let a=new TextEncoder().encode(i).length;if(a>jh)return{ok:!1,error:`That drawing is ${Math.ceil(a/1024)} KB of path and the limit is ${jh/1024} KB. Simplify it in a vector editor first.`};let r=t?nc(Ow(n)):void 0;return r===void 0?{ok:!0,path:i}:{ok:!0,path:i,viewBox:r}}function Dw(e){let n=[];for(let t of e.matchAll(/<path\b[^>]*>/gi)){let i=/\sd\s*=\s*("([^"]*)"|'([^']*)')/i.exec(t[0]),a=(i?.[2]??i?.[3]??"").replace(/\s+/g," ").trim();a!==""&&n.push(a)}return n.join(" ")}function Ow(e){let n=/<svg\b[^>]*>/i.exec(e);if(!n)return;let t=/\sviewBox\s*=\s*("([^"]*)"|'([^']*)')/i.exec(n[0]),i=(t?.[2]??t?.[3]??"").replace(/\s+/g," ").trim();return i===""?void 0:i}var ya="#FFFFFF",gn="#FFFFFF80",yn=3,hs=60,fs=8,bn="#FFFFFF",xn=8,ms=4,gs=20;function Fr(e){if(!Number.isFinite(e))return"";let n=e.toFixed(2);return n.includes(".")&&(n=n.replace(/0+$/,"").replace(/\.$/,"")),n==="-0"?"0":n}function ic(){return{count:0,length:yn,colorHex:gn,majorEvery:0}}function ac(){return{show:!1,size:xn,colorHex:bn}}function ys(e){return e.count===0&&e.length===yn&&fa(e.colorHex,gn)&&e.majorEvery===0}function bs(e){return!e.show&&e.size===xn&&fa(e.colorHex,bn)}function zw(e){if(!G(e))return;let n={count:Math.max(0,Math.min(hs,Math.round(te(e.count,0)))),length:Math.max(1,Math.min(fs,te(e.length,yn))),colorHex:Q(e.colorHex,gn),majorEvery:Math.max(0,Math.round(te(e.majorEvery,0)))};return ys(n)?void 0:n}function Gw(e){let n={};return e.count!==0&&(n.count=Math.round(e.count)),e.length!==yn&&(n.length=Z(e.length)),fa(e.colorHex,gn)||(n.colorHex=e.colorHex),e.majorEvery!==0&&(n.majorEvery=Math.round(e.majorEvery)),n}function Bw(e){if(!G(e))return;let n={show:e.show===!0,size:Math.max(ms,Math.min(gs,te(e.size,xn))),colorHex:Q(e.colorHex,bn)};return bs(n)?void 0:n}function Vw(e){let n={};return e.show&&(n.show=!0),e.size!==xn&&(n.size=Z(e.size)),fa(e.colorHex,bn)||(n.colorHex=e.colorHex),n}function qh(e){return typeof e=="string"&&gw.includes(e)}function Uw(e){return e==="none"?{high:"none",low:"none"}:e==="pointer"?{high:"triangle",low:"dot"}:{high:"dot",low:"dot"}}function ur(e){let n=Uw(e.marker);return{high:e.highMarker??n.high,low:e.lowMarker??n.low}}function $f(e){return e.high==="triangle"?"pointer":e.high!=="none"||e.low!=="none"?"dot":"none"}function Cf(e){return e.high==="none"&&e.low==="none"||e.high==="dot"&&e.low==="dot"||e.high==="triangle"&&e.low==="dot"}function Kw(e,n){e.marker=$f(n),Cf(n)?(delete e.highMarker,delete e.lowMarker):(e.highMarker=n.high,e.lowMarker=n.low)}var xs=24,vs=6,pr="#FFFFFF";function rc(e){if(e.style!=="bars")return 0;let n=e.barBorderWidth;return typeof n!="number"||!Number.isFinite(n)?0:Math.min(Math.max(n,0),vs)}function Sf(e,n,t,i,a){if(a!==void 0)return{fill:a,border:a};if(!Mr(e))return{fill:e.fillColorHex??i,border:e.barBorderColorHex??pr};let r=t.find(s=>n<=s.upTo),o=r?{color:r.colorHex,fill:r.fillColorHex,border:r.borderColorHex}:{color:e.bandAboveColorHex,fill:e.bandAboveFillColorHex,border:e.bandAboveBorderColorHex};return{fill:o.fill??e.fillColorHex??o.color,border:o.border??e.barBorderColorHex??pr}}var wt="#FF6B35",kt="#32D74B",oc="#32D74B",ve="#FF453A",sc="#FF453A",lc="#FFFFFF99";function vn(e){return[...e.bands].sort((n,t)=>n.upTo-t.upTo)}function Mr(e){return e.coloring==="bands"&&e.bands.length>0}function Lr(e,n,t){for(let i of n)if(e<=i.upTo)return i.colorHex;return t}function Ir(e,n){let t=Math.abs(n),i=t>=10?0:t>=1?1:2;return e.toFixed(i)}function Tf(e){return e>0?"\u2191":e<0?"\u2193":"\u2192"}var Mi=[{minutes:60,label:"Last hour"},{minutes:180,label:"Last 3 hours"},{minutes:360,label:"Last 6 hours"},{minutes:720,label:"Last 12 hours"},{minutes:1440,label:"Last 24 hours"},{minutes:4320,label:"Last 3 days"},{minutes:10080,label:"Last 7 days"}],ws=360,ks=10080,Hr=[...Mi,{minutes:43200,label:"Last 30 days"},{minutes:129600,label:"Last 90 days"},{minutes:527040,label:"Last year"}],dc=366*24*60,$s=2,wn=120,cc=0;function uc(e){let n=Math.round(e.historyPoints);return Number.isFinite(n)?n<1?cc:Math.max($s,Math.min(wn,n)):24}function Li(e){return hc(e)!==void 0?!0:pc(e)!==void 0&&uc(e)>0}function pc(e){if(e.source==="history")return Ef(e)}function hc(e){if(e.source==="statistics")return Ef(e)}function Ef(e){if(!(e.historyMinutes<=0))return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Xt(e){let n=pc(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${uc(e)}${e.gaps===!0?"|gaps":""}`}function Jt(e){let n=hc(e);if(n!==void 0)return`${n}|${Math.round(e.historyMinutes)}|${e.statPeriod}|${e.statType}${e.gaps===!0?"|gaps":""}`}function Rf(e){return[...fc(e).map(t=>t.key),...mc(e).map(t=>t.key)].sort().join(";")}function fc(e){let n=new Map,t=i=>{n.has(i.key)||n.set(i.key,i)};for(let i of e.elements)if(i.kind==="chart"){let a=Xt(i.payload),r=pc(i.payload);if(a===void 0||r===void 0)continue;t({key:a,entityId:r,minutes:Math.round(i.payload.historyMinutes),points:uc(i.payload),mode:"numeric",gaps:i.payload.gaps===!0})}else if(i.kind==="timeline"){let a=ht(i.payload),r=Pf(i.payload);if(a===void 0||r===void 0||yc(i.payload))continue;let o=Hi(i.payload);t({key:a,entityId:r,minutes:Pt(i.payload),points:jn,mode:"states",gaps:!1,...o.length>0?{entities:o,combine:i.payload.aggregate?.combine??kn}:{}})}return[...n.values()]}function mc(e){let n=new Map;for(let t of e.elements){if(t.kind!=="chart")continue;let i=Jt(t.payload),a=hc(t.payload);i===void 0||a===void 0||n.has(i)||n.set(i,{key:i,entityId:a,minutes:Math.round(t.payload.historyMinutes),period:t.payload.statPeriod,type:t.payload.statType,gaps:t.payload.gaps===!0})}return[...n.values()]}var ba=2,xa=20,kn="any",Cs="binary_sensor",Af=[["any","Any"],["all","All"]];function Ff(e){return e==="all"?"On when all of them are active":"On when any of them is active"}var Mf=[["auto","Auto"],["h12","12 hour"],["h24","24 hour"]],Lf=[["auto","Auto"],["always","Always"],["never","Never"]];function Pd(e){return e==="h12"||e==="h24"?e:wi}function Nd(e){return e==="always"||e==="never"?e:ki}function Ww(e){return e.timeLabelCount!==void 0?Wt(e.timeLabelCount):e.timeLabels==="ends"?2:e.timeLabels==="four"?4:vi}function Wt(e){let n=Number(e);return Number.isFinite(n)?Math.max(0,Math.min(Ii,Math.round(n))):vi}function _r(e){return e<=0?[]:e===1?[1]:Array.from({length:e},(n,t)=>t/(e-1))}var Un="#8E8E93",If=1,jw="#000000",qw=2,Yw=1440,gc=60,vi=0,$t=9,Ct="#8E8E93",wi="auto",ki="auto",Hf=4,Ii=12,Kn=1,Wn=20,Ss=4,jn=120;function _f(e,n,t){let i=e.trim().toLowerCase();for(let a of n)if(a.match.trim().toLowerCase()===i)return a.colorHex;return t}function Pt(e){let n=Math.round(e.historyMinutes);return Number.isFinite(n)?Math.max(1,Math.min(ks,n)):gc}function Pf(e){return e.value.kind.kind==="entityState"?e.value.kind.entityId:void 0}function Hi(e){let n=e.aggregate?.entities??[],t=[];for(let i of n){let a=typeof i=="string"?i.trim():"";a!==""&&!t.includes(a)&&t.push(a)}return t}function va(e){let n=[...e.aggregate?.entities??[]];for(;n.length<ba;)n.push("");return n}function yc(e){return Hi(e).length>xa}function ht(e){let n=Pf(e);if(n===void 0)return;let t=`${n}|${Pt(e)}|${jn}|states`,i=Hi(e);return i.length===0?t:`${t}|${e.aggregate?.combine??kn}:${i.join(",")}`}var Xw={on:"#FF9F0A",off:"#0A84FF",open:"#FF453A",closed:"#32D74B",opening:"#FFD60A",closing:"#FFD60A",home:"#32D74B",not_home:"#0A84FF",locked:"#32D74B",unlocked:"#FF453A",jammed:"#BF5AF2",playing:"#32D74B",paused:"#FF9F0A",idle:"#0A84FF",standby:"#5E5CE6",heat:"#FF9F0A",cool:"#64D2FF",heat_cool:"#BF5AF2",dry:"#FFD60A",fan_only:"#5E5CE6",auto:"#BF5AF2",cleaning:"#32D74B",docked:"#0A84FF",returning:"#64D2FF",error:"#FF453A",disarmed:"#32D74B",armed_home:"#0A84FF",armed_away:"#FF9F0A",armed_night:"#5E5CE6",arming:"#FFD60A",pending:"#FFD60A",triggered:"#FF453A",unavailable:"#48484A",unknown:"#48484A"},wa={binary_sensor:["on","off"],switch:["on","off"],light:["on","off"],input_boolean:["on","off"],fan:["on","off"],humidifier:["on","off"],siren:["on","off"],cover:["open","closed","opening","closing"],lock:["locked","unlocked","jammed"],person:["home","not_home"],device_tracker:["home","not_home"],media_player:["playing","paused","idle","off"],climate:["heat","cool","heat_cool","dry","fan_only","auto","off"],vacuum:["cleaning","docked","returning","idle","error"],alarm_control_panel:["disarmed","armed_home","armed_away","armed_night","arming","pending","triggered"]};function Ht(e){return Xw[e.trim().toLowerCase()]??Un}var Jw=["door","garage_door","window","opening"];function ha(e,n){let t=(n??"").trim().toLowerCase(),i=e==="binary_sensor"&&Jw.includes(t),a=o=>Ht(i&&o==="on"?"open":o);return[...wa[e]??[],"unavailable","unknown"].map(o=>({id:se(),match:o,colorHex:a(o)}))}var Pr=48*1024,ka=6,Ts=9,Zw=["topLeading","topTrailing","bottomLeading","bottomTrailing"];function Es(e){let n=e.trim();if(n==="")return 0;let t=n.endsWith("==")?2:n.endsWith("=")?1:0;return Math.max(0,Math.floor(n.length*3/4)-t)}function _i(e){return e.source==="inline"&&e.data!==void 0?Es(e.data):0}function Nf(e){if(e.source!=="inline")return;let n=e.data;if(!(n===void 0||n===""))return`data:${e.format==="jpeg"?"image/jpeg":"image/png"};base64,${n}`}function Rs(e){return Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY)}function Qw(e,n){let t=n<=.5,i=e<=.5;return t?i?"topLeading":"topTrailing":i?"bottomLeading":"bottomTrailing"}var bc={top:0,left:0,bottom:0,right:0};function As(e){return e===void 0||e.top===0&&e.left===0&&e.bottom===0&&e.right===0}var Df=[["down","Down"],["across","Across"]],xc=[["name","Name"],["state","State"],["lastChanged","Last changed"]],vc=[["open","To do"],["done","Done"],["all","Everything"]],wc=[["list","List order"],["due","Due"]],kc=[["hourly","Hourly"],["daily","Daily"],["twiceDaily","Twice daily"]],$c=[["entities","Entities"],["attribute","Attribute"],["template","Template"],["calendar","Calendar"],["todo","To-do list"],["forecast","Forecast"]],Cc=1,Sc=12,Nr=4,Tc=1,Ec=4,Dr=1,Or=2,Rc=12,$a=8,Fs=5,ek=1,Of=8784,zr=24,zf=["list","chart","timeline","chartTimes","chartDots","chartGrid","imageTime"],Nt=["rectangular","small","medium","large","xlarge"];function Ms(e){let n=nt(e.rows);if(e.direction==="across")return{lines:1,columns:n};let t=Math.min(Gr(e.columns),n);return{lines:Math.ceil(n/t),columns:t}}function nt(e){let n=typeof e=="number"&&Number.isFinite(e)?Math.round(e):Nr;return Math.min(Sc,Math.max(Cc,n))}function Gr(e){let n=typeof e=="number"&&Number.isFinite(e)?Math.round(e):Dr;return Math.min(Ec,Math.max(Tc,n))}function Pi(e){let n=typeof e=="number"&&Number.isFinite(e)?e:Or;return Math.min(Rc,Math.max(0,n))}function Ca(e){let n=typeof e=="number"&&Number.isFinite(e)?Math.round(e):zr;return Math.min(Of,Math.max(ek,n))}var Gf=["hours","days","weeks","months"],Ut={hours:1,days:24,weeks:168,months:720};function Ac(e){let n=Ca(e);return n%Ut.months===0?{value:n/Ut.months,unit:"months"}:n%Ut.weeks===0?{value:n/Ut.weeks,unit:"weeks"}:n%Ut.days===0?{value:n/Ut.days,unit:"days"}:{value:n,unit:"hours"}}function Fc(e,n){let t=Number.isFinite(e)?e:1;return Ca(Math.round(t*Ut[n]))}function Mc(e){return Math.floor(Of/Ut[e])}function Bf(e,n){let t=Math.ceil(Ca(e)/Ut[n]);return Math.min(Mc(n),Math.max(1,t))}function Vf(e,n){return Math.round(Ca(e)/Ut[n]*100)/100}var tk=["toggleEntity","runScene","runScript","addTodo","runHTTPAction"];function Uf(e){return tk.includes(e)}function Kf(e){let n=(e??"").trim();if(n==="")return!0;try{let t=JSON.parse(n);return typeof t=="object"&&t!==null&&!Array.isArray(t)}catch{return!1}}var Ls=[["refresh","Refresh"],["refreshAll","Refresh complications"],["none","Nothing"],["openApp","Open the app"],["openPage","Open the page"],["openRoomPage","Open the room page"],["timerStartPause","Timer start / pause"],["timerCancel","Timer cancel"],["toggleEntity","Toggle an entity"],["runScene","Run a scene"],["runScript","Run a script"],["addTodo","Add a to-do"],["runHTTPAction","Run an HTTP action"],["callService","Call a service"]];function Zt(e){let n=Ls.find(([i])=>i===e.type)?.[1]??e.type;if(e.type==="callService"){let i=[e.serviceDomain,e.serviceName].filter(a=>a!=="").join(".");return i===""?n:`${n}: ${i}`}if(e.type==="refreshAll"){if(e.allPlaced===!0)return`${n}: all placed`;let i=e.targets?.length??0;return i>0?`${n}: ${i} picked`:`${n}: none picked`}if(!("entityId"in e))return n;let t=e.displayName||e.entityId;return t?`${n}: ${t}`:n}function Wf(e,n,t){if(e.allPlaced===!0)return{type:"refreshAll",allPlaced:!0};let i=n.trim().toUpperCase(),a=e.targets??[],r=t?i===""||a.includes(i)?[...a]:[...a,i]:a.filter(s=>s!==i),o={type:"refreshAll"};return r.length>0&&(o.targets=r),o}function jf(e){if(e.type!=="refreshAll")return;let n=" On a watch running an older app this tap does nothing.";if(e.allPlaced===!0)return"Refreshes every Wrist Assistant complication placed on the watch, not just this one."+n;let t=e.targets?.length??0;return t>0?`Refreshes this complication and the ${t} picked below.`+n:"Nothing is picked, so this tap only refreshes this complication. Pick all placed complications or some below."+n}var Lc=["toggleEntity","runScene","runScript","callService","runHTTPAction","openApp"],nk=["toggleEntity","callService"],ik=new Set(["on","open","unlocked","home","playing","heat","cool"]),Is="switch.2";function ak(e){return Lc.includes(e)}function Qt(e){return e.kind==="toggle"&&nk.includes(e.action.type)?"toggle":"button"}function qf(e){return e!==void 0&&ik.has(e.trim().toLowerCase())}function G(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Q(e,n=""){return typeof e=="string"?e:n}function te(e,n){return typeof e=="number"?e:e==="+inf"?1/0:e==="-inf"?-1/0:e==="nan"?NaN:n}function Lt(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function lr(e){return e==null?void 0:te(e,0)}function fe(e){return typeof e=="string"?e:void 0}function bi(e,n,t){return typeof e=="string"&&n.includes(e)?e:t}function xi(e,n,t){return n.some(([i])=>i===e)?e:t}var Tt=class extends Error{};function Nn(e){if(typeof e.entityId!="string")throw new Tt("entityId is required");let n={entityId:e.entityId,displayName:Q(e.displayName),domain:Q(e.domain)};return typeof e.iconName=="string"&&(n.iconName=e.iconName),n}function Yh(e){if(!G(e))return;let n={};return e.decimals!==void 0&&e.decimals!==null&&(n.decimals=te(e.decimals,0)),e.multiply!==void 0&&e.multiply!==null&&(n.multiply=te(e.multiply,1)),e.offset!==void 0&&e.offset!==null&&(n.offset=te(e.offset,0)),typeof e.prefix=="string"&&(n.prefix=e.prefix),typeof e.suffix=="string"&&(n.suffix=e.suffix),e.useEntityUnit===!0&&(n.useEntityUnit=!0),e.relativeTime===!0&&(n.relativeTime=!0),e.duration===!0&&(n.duration=!0),as.some(([t])=>t===e.timestamp)&&(n.timestamp=e.timestamp),e.hideMinutes===!0&&(n.hideMinutes=!0),e.hideDayPeriod===!0&&(n.hideDayPeriod=!0),(e.textCase==="upper"||e.textCase==="lower"||e.textCase==="capitalized")&&(n.textCase=e.textCase),Xe(n)?void 0:n}function Xe(e){return e?e.decimals===void 0&&e.multiply===void 0&&e.offset===void 0&&!e.prefix&&!e.suffix&&!e.useEntityUnit&&!e.relativeTime&&!e.duration&&e.timestamp===void 0&&!e.hideMinutes&&!e.hideDayPeriod&&e.textCase===void 0:!0}function Yf(e){let n=Q(e.function,"count"),t=G(e.scope)?e.scope:{},i;if(t.kind==="entities")i={kind:"entities",entities:(Array.isArray(t.entities)?t.entities:[]).filter(G).map(Nn)};else{let r=o=>Array.isArray(o)?o.filter(s=>typeof s=="string"):[];i={kind:"filter",domains:r(t.domains),areaIds:r(t.areaIds),labelIds:r(t.labelIds),floorIds:r(t.floorIds)}}let a={function:n,scope:i};if(G(e.stateFilter)){let r=e.stateFilter.kind;r==="isOn"||r==="isOff"?a.stateFilter={kind:r}:(r==="equals"||r==="notEquals")&&(a.stateFilter={kind:r,value:Q(e.stateFilter.value)})}return typeof e.attribute=="string"&&(a.attribute=e.attribute),a}function Xh(e){switch(e.kind){case"literal":return{kind:"literal",value:Q(e.value)};case"entityState":return{kind:"entityState",...Nn(e)};case"entityAttribute":return{kind:"entityAttribute",...Nn(e),attribute:Q(e.attribute)};case"entityAge":return{kind:"entityAge",...Nn(e)};case"aggregate":return{kind:"aggregate",aggregate:Yf(G(e.aggregate)?e.aggregate:{})};case"time":return{kind:"time",timeField:fe(e.timeField)??"now"};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:Q(e.value)};case"named":return{kind:"named",id:Q(e.id).toUpperCase()};case"chartStat":return{kind:"chartStat",layer:Q(e.layer).toUpperCase(),stat:jt.some(([n])=>n===e.stat)?e.stat:"latest"};case"item":return{kind:"item",field:Q(e.field)};case"listStat":return{kind:"listStat",layer:Q(e.layer).toUpperCase(),stat:e.stat==="total"?"total":"count"};default:throw new Tt(`unknown value kind ${String(e.kind)}`)}}function we(e){if(!G(e))throw new Tt("value must be an object");if(G(e.kind)){let i={kind:Xh(e.kind)},a=Yh(e.format);return a&&(i.format=a),i}let n={kind:Xh(e)},t=Yh(e.format);return t&&(n.format=t),n}function Xf(e){return G(e)?{x:te(e.x,.25),y:te(e.y,.25),width:te(e.width,.5),height:te(e.height,.5),rotationDegrees:te(e.rotationDegrees,0)}:{...br}}function rk(e){if(!G(e))return{kind:"isOn"};let n=Q(e.kind,"isOn"),t={kind:n};switch(n){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":t.value=G(e.value)?we(e.value):U("");break;case"between":case"timeBetween":t.value=G(e.value)?we(e.value):U(""),t.upper=G(e.upper)?we(e.upper):U("");break;case"matchesRegex":t.pattern=Q(e.pattern);break;case"isOneOf":t.options=Array.isArray(e.options)?e.options.filter(i=>typeof i=="string"):[];break;default:break}return t}function Jh(e){if(!G(e))return{kind:"show"};let n=Q(e.kind,"show"),t={kind:n};switch(n){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":t.value=G(e.value)?we(e.value):U("");break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":t.number=te(e.number,0);break;case"setFontWeight":t.weight=fe(e.weight)??"regular";break;case"setFontDesign":t.design=fe(e.design)??"default";break;case"setFontWidth":t.width=Kd(fe(e.width))??"standard";break;case"setItalic":t.italic=e.italic!==!1;break;default:break}return t}function Jf(e){return Array.isArray(e)?e.filter(G).map(n=>{let t={id:Q(n.id).toUpperCase(),cases:(Array.isArray(n.cases)?n.cases:[]).filter(G).map(i=>{let a=G(i.when)?i.when:{};return{id:Q(i.id).toUpperCase(),when:{join:a.join==="any"?"any":"all",tests:(Array.isArray(a.tests)?a.tests:[]).filter(G).map(r=>({id:Q(r.id).toUpperCase(),value:G(r.value)?we(r.value):U(""),comparison:rk(r.comparison)}))},then:(Array.isArray(i.then)?i.then:[]).map(Jh)}})};return Array.isArray(n.otherwise)&&(t.otherwise=n.otherwise.map(Jh)),typeof n.partId=="string"&&n.partId!==""&&(t.partId=n.partId.toUpperCase()),t}):[]}function ok(e,n){return{baseColorHex:G(e)?Q(e.baseColorHex,n):n}}function hr(e){return Array.isArray(e)?e.filter(G).map(n=>{let t={id:Q(n.id,se()),upTo:te(n.upTo,0),colorHex:Q(n.colorHex,"#FFFFFF")};return typeof n.fillColorHex=="string"&&(t.fillColorHex=n.fillColorHex),typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex),t}):[]}function dr(e){let n={id:e.id,upTo:Z(e.upTo),colorHex:e.colorHex};return e.fillColorHex!==void 0&&(n.fillColorHex=e.fillColorHex),e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n}function sk(e){return Array.isArray(e)?e.filter(G).map(n=>{let t={id:Q(n.id,se()).toUpperCase(),value:G(n.value)?we(n.value):U("")};typeof n.colorHex=="string"&&(t.colorHex=n.colorHex);let i=fe(n.fontWeight);(i==="regular"||i==="medium"||i==="semibold"||i==="bold")&&(t.fontWeight=i),typeof n.fontSize=="number"&&(t.fontSize=n.fontSize);let a=fe(n.fontDesign);(a==="default"||a==="rounded"||a==="monospaced"||a==="serif")&&(t.fontDesign=a);let r=Kd(fe(n.fontWidth));r!==void 0&&(t.fontWidth=r),typeof n.italic=="boolean"&&(t.italic=n.italic),fe(n.coloring)==="bands"&&(t.coloring="bands");let o=hr(n.bands);o.length>0&&(t.bands=o);let s=Q(n.bandAboveColorHex,ve);return s!==ve&&(t.bandAboveColorHex=s),t}):[]}function lk(e){if(Array.isArray(e.bands))return hr(e.bands);if(typeof e.bandLowerBound!="number")return[];let n=G(e.colorSlot)?Q(e.colorSlot.baseColorHex,"#FFFFFF"):"#FFFFFF";return[{id:se(),upTo:e.bandLowerBound,colorHex:Q(e.bandLowColorHex,oc)},{id:se(),upTo:te(e.bandUpperBound,100),colorHex:n}]}function dk(e){return Array.isArray(e)?e.filter(G).map(n=>({id:Q(n.id,se()).toUpperCase(),match:Q(n.match,""),colorHex:Q(n.colorHex,Un)})):[]}function ck(e){if(!G(e))return;let n=[];for(let t of Array.isArray(e.entities)?e.entities:[]){let i=typeof t=="string"?t.trim():"";i!==""&&!n.includes(i)&&n.push(i)}if(n.length!==0)return{entities:n,combine:e.combine==="all"?"all":kn}}function Gd(e){let n=G(e)?e:{},t={entityId:Q(n.entityId),displayName:Q(n.displayName),domain:Q(n.domain)};return typeof n.iconName=="string"&&(t.iconName=n.iconName),t}function Zh(e){return Array.isArray(e)?e.map(Gd).filter(n=>n.entityId!==""):[]}function uk(e){let n=G(e)?e:{},t=i=>Array.isArray(i)?i.filter(a=>typeof a=="string"):[];switch(n.kind){case"attribute":return{kind:"attribute",...Gd(n),attribute:Q(n.attribute)};case"template":return{kind:"template",value:Q(n.value)};case"calendar":return{kind:"calendar",entities:Zh(n.entities),hours:Ca(n.hours)};case"todo":return{kind:"todo",entities:Zh(n.entities),status:xi(fe(n.status),vc,"open"),sort:xi(fe(n.sort),wc,"list")};case"forecast":return{kind:"forecast",...Gd(n),type:xi(fe(n.type),kc,"hourly")};default:{let i=Yf({scope:n.scope,stateFilter:n.stateFilter}),a={kind:"entities",scope:i.scope,sort:xi(fe(n.sort),xc,"name"),descending:n.descending===!0,attributes:t(n.attributes)},r=Q(n.deviceClass).trim();return r!==""&&(a.deviceClass=r),i.stateFilter&&(a.stateFilter=i.stateFilter),a}}}function pk(e){if(G(e))return{colorHex:Q(e.colorHex,Sr),radius:tc(te(e.radius,0)),dx:cr(te(e.dx,0)),dy:cr(te(e.dy,0))}}function pt(e,n){if(typeof e.id!="string")throw new Tt("element id is required");let t={id:e.id.toUpperCase(),colorSlot:ok(e.colorSlot,n),rules:Jf(e.rules),frame:Xf(e.frame),isHidden:e.isHidden===!0},i=Tr(te(e.opacity,1));i!==1&&(t.opacity=i);let a=pk(e.shadow);return a!==void 0&&(t.shadow=a),t}function Zf(e){let n=hk(e),t=e.payload;return typeof t.groupId=="string"&&t.groupId!==""&&(n.payload.groupId=t.groupId.toUpperCase()),typeof t.name=="string"&&t.name!==""&&(n.payload.name=t.name),t.accentGroup==="accent"&&(n.payload.accentGroup="accent"),n}function hk(e){if(!G(e)||!G(e.payload))throw new Tt("element must have a payload");let n=e.payload;switch(e.kind){case"text":{let t={...pt(n,"#FFFFFF"),value:G(n.value)?we(n.value):U(""),fontSize:te(n.fontSize,14),fontWeight:fe(n.fontWeight)??"regular"};n.countdown===!0&&(t.countdown=!0),n.monospacedDigits===!0&&(t.monospacedDigits=!0);let i=typeof n.lineLimit=="number"?Math.round(n.lineLimit):1,a=Math.min(Wd,Math.max(1,i));a>1&&(t.lineLimit=a);let r=fe(n.fontDesign);(r==="rounded"||r==="monospaced"||r==="serif")&&(t.fontDesign=r);let o=Kd(fe(n.fontWidth));o!==void 0&&o!=="standard"&&(t.fontWidth=o),n.italic===!0&&(t.italic=!0);let s=mr(te(n.minimumScale,St));s!==St&&(t.minimumScale=s);let l=fe(n.alignment);(l==="leading"||l==="trailing")&&(t.alignment=l),fe(n.coloring)==="bands"&&(t.coloring="bands");let c=hr(n.bands);c.length>0&&(t.bands=c);let d=Q(n.bandAboveColorHex,ve);d!==ve&&(t.bandAboveColorHex=d);let u=fe(n.highlight);(u==="highest"||u==="lowest"||u==="both")&&(t.highlight=u);let p=Q(n.highColorHex,wt);p!==wt&&(t.highColorHex=p);let f=Q(n.lowColorHex,kt);f!==kt&&(t.lowColorHex=f);let g=sk(n.parts);g.length>0&&(t.parts=g);let b=Hw(n.arc);return b!==void 0&&(t.arc=b),Jo(n,t),{kind:"text",payload:t}}case"icon":{let t={...pt(n,"#FFFFFF"),symbol:G(n.symbol)?we(n.symbol):U("lightbulb"),size:te(n.size,14)},i=fe(n.path);i!==void 0&&i!==""&&(t.path=i);let a=nc(fe(n.viewBox));return a!==void 0&&(t.viewBox=a),Kh(n,t),Jo(n,t),{kind:"icon",payload:t}}case"gauge":{let t={...pt(n,"#FFFFFF"),value:G(n.value)?we(n.value):U("50"),minValue:te(n.minValue,0),maxValue:te(n.maxValue,100),style:fe(n.style)??"arc",lineWidth:te(n.lineWidth,4),trackColorHex:Q(n.trackColorHex,"#FFFFFF40"),coloring:fe(n.coloring)??"uniform",bands:hr(n.bands),bandAboveColorHex:Q(n.bandAboveColorHex,ve),thresholdColorHex:Q(n.thresholdColorHex,ya)},i=lr(n.thresholdValue);i!==void 0&&(t.thresholdValue=i),G(n.total)&&(t.total=we(n.total)),G(n.minSource)&&(t.minSource=we(n.minSource)),G(n.maxSource)&&(t.maxSource=we(n.maxSource));let a=sr(n.fill);a!==void 0&&(t.fill=a);let r=zw(n.ticks);r!==void 0&&(t.ticks=r);let o=Bw(n.labels);return o!==void 0&&(t.labels=o),{kind:"gauge",payload:t}}case"chart":return{kind:"chart",payload:{...pt(n,"#FFFFFF"),value:G(n.value)?we(n.value):U("13,14,16,17,19,22,24,28,30"),historyMinutes:Math.max(0,Math.round(te(n.historyMinutes,0))),historyPoints:Math.round(te(n.historyPoints,24)),source:xi(fe(n.source),Sw,qd),statPeriod:xi(fe(n.statPeriod),is,gr),statType:xi(fe(n.statType),jd,yr),style:bi(n.style,["bars","line","area"],"bars"),limit:Math.max(0,Math.round(te(n.limit,0))),takeFromEnd:n.takeFromEnd===!0,scale:bi(n.scale,["auto","fixed"],"auto"),minValue:te(n.minValue,0),maxValue:te(n.maxValue,100),baseline:bi(n.baseline,["lowest","zero"],"lowest"),barGap:te(n.barGap,1.5),lineWidth:te(n.lineWidth,2),highlight:bi(n.highlight,["none","highest","lowest","both"],"none"),highColorHex:Q(n.highColorHex,wt),lowColorHex:Q(n.lowColorHex,kt),marker:typeof n.marker=="string"?bi(n.marker,["none","dot","pointer"],"dot"):"pointer",...qh(n.highMarker)?{highMarker:n.highMarker}:{},...qh(n.lowMarker)?{lowMarker:n.lowMarker}:{},coloring:bi(n.coloring,["uniform","bands"],"uniform"),bands:lk(n),bandAboveColorHex:Q(n.bandHighColorHex,Q(n.bandAboveColorHex,ve)),fillBands:n.fillBands===!0,...Uh(n.curve)!=="straight"?{curve:Uh(n.curve)}:{},...Dn(n.fillStyle)!=="flat"?{fillStyle:Dn(n.fillStyle)}:{},...typeof n.fillColorHex=="string"?{fillColorHex:n.fillColorHex}:{},...sr(n.areaFill)!==void 0?{areaFill:sr(n.areaFill)}:{},...On(n.barRadius)!==ma?{barRadius:On(n.barRadius)}:{},...zn(n.barCorners)!=="all"?{barCorners:zn(n.barCorners)}:{},...typeof n.barBorderWidth=="number"&&Number.isFinite(n.barBorderWidth)&&n.barBorderWidth!==0?{barBorderWidth:n.barBorderWidth}:{},...typeof n.barBorderColorHex=="string"?{barBorderColorHex:n.barBorderColorHex}:{},...n.barBorderOpenBase===!0?{barBorderOpenBase:!0}:{},...typeof n.bandAboveFillColorHex=="string"?{bandAboveFillColorHex:n.bandAboveFillColorHex}:{},...typeof n.bandAboveBorderColorHex=="string"?{bandAboveBorderColorHex:n.bandAboveBorderColorHex}:{},...Od(n.pointDots)!=="none"?{pointDots:Od(n.pointDots)}:{},...Kt(n.pointDotSize)!==void 0?{pointDotSize:Kt(n.pointDotSize)}:{},...typeof n.pointDotColorHex=="string"?{pointDotColorHex:n.pointDotColorHex}:{},...zd(n.gridLines)!==0?{gridLines:zd(n.gridLines)}:{},...fa(Pn(n.gridColorHex),fn)?{}:{gridColorHex:Pn(n.gridColorHex)},...n.zeroLine===!0?{zeroLine:!0}:{},...It(n.smoothing)!==void 0?{smoothing:It(n.smoothing)}:{},...n.gaps===!0?{gaps:!0}:{},...typeof n.thresholdValue=="number"&&Number.isFinite(n.thresholdValue)?{thresholdValue:n.thresholdValue}:{},thresholdColorHex:Q(n.thresholdColorHex,sc),...G(n.nowIndex)?{nowIndex:we(n.nowIndex)}:{},nowColorHex:Q(n.nowColorHex,lc),...n.drawsThreshold===!1?{drawsThreshold:!1}:{},...n.drawsNowLine===!1?{drawsNowLine:!1}:{},...n.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{},...fe(n.scaleFrom)!==void 0?{scaleFrom:fe(n.scaleFrom)}:{},timeLabelCount:Wt(n.timeLabelCount),labelSize:te(n.labelSize,$t),labelColorHex:Q(n.labelColorHex,Ct),labelsAbove:n.labelsAbove===!0,hourCycle:Pd(n.hourCycle),minutes:Nd(n.minutes)}};case"timeline":{let{colorSlot:t,...i}=pt(n,"#FFFFFF"),a=ck(n.aggregate);return{kind:"timeline",payload:{...i,value:G(n.value)?we(n.value):U(""),...a!==void 0?{aggregate:a}:{},historyMinutes:Math.max(1,Math.round(te(n.historyMinutes,gc))),bands:dk(n.bands),otherColorHex:Q(n.otherColorHex,Un),gap:Math.min(Ss,Math.max(0,te(n.gap,0))),cornerRadius:Math.max(0,te(n.cornerRadius,If)),timeLabelCount:Ww(n),labelSize:te(n.labelSize,$t),labelColorHex:Q(n.labelColorHex,Ct),labelsAbove:n.labelsAbove===!0,hourCycle:Pd(n.hourCycle),minutes:Nd(n.minutes),...n.drawsTimeLabels===!1?{drawsTimeLabels:!1}:{}}}}case"shape":{let t={...pt(n,"#FFFFFF33"),kind:fe(n.kind)??"roundedRectangle",cornerRadius:te(n.cornerRadius,6),thickness:te(n.thickness,1),borderWidth:te(n.borderWidth,1)};typeof n.borderColorHex=="string"&&(t.borderColorHex=n.borderColorHex);let i=sr(n.fill);return i!==void 0&&(t.fill=i),Kh(n,t),Jo(n,t),{kind:"shape",payload:t}}case"image":{let{colorSlot:t,...i}=pt(n,"#FFFFFF"),a={...i,entity:G(n.entity)?Nn(n.entity):{entityId:"",displayName:"",domain:""},source:n.source==="entityPicture"?"entityPicture":n.source==="inline"?"inline":"camera",contentMode:n.contentMode==="fit"?"fit":"fill",zoom:te(n.zoom,1),panX:te(n.panX,0),panY:te(n.panY,0),cornerRadius:te(n.cornerRadius,ka),timestampCorner:Zw.includes(n.timestampCorner)?n.timestampCorner:"topLeading",timestampSize:te(n.timestampSize,Ts)},r=fe(n.data);r!==void 0&&r!==""&&(a.data=r),n.format==="jpeg"&&(a.format="jpeg"),n.timestamp===!0&&(a.timestamp=!0);let o=lr(n.timestampX),s=lr(n.timestampY);return o!==void 0&&s!==void 0&&Number.isFinite(o)&&Number.isFinite(s)&&(a.timestampX=Lt(o),a.timestampY=Lt(s)),Jo(n,a),{kind:"image",payload:a}}case"tap":{let{colorSlot:t,...i}=pt(n,"#FFFFFF"),a={...i,action:G(n.action)?Ic(n.action):{type:"refresh"}};return typeof n.openPageId=="string"&&(a.openPageId=n.openPageId),typeof n.openPageName=="string"&&(a.openPageName=n.openPageName),typeof n.attachedTo=="string"&&(a.attachedTo=n.attachedTo.toUpperCase()),{kind:"tap",payload:a}}case"chartTimes":{let{colorSlot:t,...i}=pt(n,"#FFFFFF");return{kind:"chartTimes",payload:{...i,chart:Q(n.chart).toUpperCase(),timeLabelCount:Wt(n.timeLabelCount),labelSize:te(n.labelSize,$t),labelColorHex:Q(n.labelColorHex,Ct),hourCycle:Pd(n.hourCycle),minutes:Nd(n.minutes)}}}case"imageTime":{let{colorSlot:t,...i}=pt(n,"#FFFFFF");return{kind:"imageTime",payload:{...i,image:Q(n.image).toUpperCase()}}}case"chartDots":{let{colorSlot:t,...i}=pt(n,"#FFFFFF"),a=Kt(n.size);return{kind:"chartDots",payload:{...i,chart:Q(n.chart).toUpperCase(),dots:es(n.dots),...a!==void 0?{size:a}:{},...typeof n.colorHex=="string"?{colorHex:n.colorHex}:{}}}}case"chartGrid":{let{colorSlot:t,...i}=pt(n,"#FFFFFF");return{kind:"chartGrid",payload:{...i,chart:Q(n.chart).toUpperCase(),lines:Ri(n.lines),colorHex:Pn(n.colorHex),thickness:Ai(n.thickness)}}}case"list":{let{colorSlot:t,...i}=pt(n,"#FFFFFF"),a=(Array.isArray(n.template)?n.template:[]).filter(r=>G(r)&&!zf.includes(String(r.kind))).map(Zf);return{kind:"list",payload:{...i,source:uk(n.source),rows:nt(n.rows),direction:n.direction==="across"?"across":"down",columns:Gr(n.columns),gap:Pi(n.gap),template:a}}}default:throw new Tt(`unknown element kind ${String(e.kind)}`)}}function Qh(e){let n=G(e)?e:{},t={};if(G(n.placements))for(let[r,o]of Object.entries(n.placements)){if(!G(o))continue;let s={frame:Xf(o.frame),isHidden:o.isHidden===!0},l=lr(o.size);l!==void 0&&(s.size=l),t[r.toUpperCase()]=s}let i={placements:t,cornerBodyShape:n.cornerBodyShape==="circle"?"circle":"wedge",borderWidth:te(n.borderWidth,2),rules:Jf(n.rules)};if(G(n.bezelText)&&(i.bezelText=we(n.bezelText)),n.bezelCountdown===!0&&(i.bezelCountdown=!0),G(n.curvedText)&&(i.curvedText=we(n.curvedText)),typeof n.curvedColorHex=="string"&&(i.curvedColorHex=n.curvedColorHex),G(n.bezelGauge)){let r=n.bezelGauge,o={value:G(r.value)?we(r.value):U("50"),minValue:te(r.minValue,0),maxValue:te(r.maxValue,100),colorHexes:Array.isArray(r.colorHexes)&&r.colorHexes.length>0?r.colorHexes.filter(s=>typeof s=="string"):["#34C759","#FFCC00","#FF3B30"]};G(r.minLabel)&&(o.minLabel=we(r.minLabel)),G(r.maxLabel)&&(o.maxLabel=we(r.maxLabel)),i.bezelGauge=o}typeof n.backgroundColorHex=="string"&&(i.backgroundColorHex=n.backgroundColorHex);let a=sr(n.backgroundFill);return a!==void 0&&(i.backgroundFill=a),typeof n.borderColorHex=="string"&&(i.borderColorHex=n.borderColorHex),i}function fk(e){let n={};if(Array.isArray(e))for(let t=0;t+1<e.length;t+=2){let i=e[t];typeof i=="string"&&(n[i]=Qh(e[t+1]))}else if(G(e))for(let[t,i]of Object.entries(e))n[t]=Qh(i);return n}function mk(e){let n={value:G(e.value)?we(e.value):U("")};return typeof e.label=="string"&&(n.label=e.label),typeof e.symbol=="string"&&(n.symbol=e.symbol),e.countdown===!0&&(n.countdown=!0),n}function gk(e){let n={kind:e.kind==="button"?"button":"toggle",title:G(e.title)?we(e.title):U(""),symbol:Q(e.symbol,Is),coloring:e.coloring==="bands"?"bands":"uniform",bands:hr(e.bands),action:Ic(e.action)};return G(e.valueLabel)&&(n.valueLabel=we(e.valueLabel)),G(e.state)&&(n.state=we(e.state)),typeof e.symbolOff=="string"&&(n.symbolOff=e.symbolOff),typeof e.tintColorHex=="string"&&(n.tintColorHex=e.tintColorHex),typeof e.bandAboveColorHex=="string"&&(n.bandAboveColorHex=e.bandAboveColorHex),G(e.status)&&(n.status=we(e.status)),n}function yk(e){if(!Array.isArray(e))return[];let n=[];for(let t of e){if(typeof t!="string")continue;let i=t.trim().toUpperCase();i===""||n.includes(i)||n.push(i)}return n}function Ic(e){if(!G(e)||typeof e.type!="string")return{type:"none"};switch(e.type){case"none":case"refresh":case"openApp":case"openPage":case"openRoomPage":case"timerStartPause":case"timerCancel":return{type:e.type};case"refreshAll":{let n={type:"refreshAll"};if(e.allPlaced===!0)return n.allPlaced=!0,n;let t=yk(e.targets);return t.length>0&&(n.targets=t),n}case"toggleEntity":case"runScene":case"runScript":case"addTodo":case"runHTTPAction":return{type:e.type,...Nn(e)};case"callService":{let n={type:"callService",serviceDomain:typeof e.serviceDomain=="string"?e.serviceDomain:"",serviceName:typeof e.serviceName=="string"?e.serviceName:""};return typeof e.serviceDataJSON=="string"&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),typeof e.entityId=="string"&&e.entityId!==""&&(n.target=Nn(e)),n}default:return{type:"none"}}}function Ni(e){if(!G(e))throw new Tt("config must be an object");for(let r of["id","name","slotIndex","supportedFamilies","perFamily","tapAction"])if(!(r in e))throw new Tt(`${r} is required`);let n=(Array.isArray(e.values)?e.values:[]).filter(G).map(r=>({id:Q(r.id).toUpperCase(),name:Q(r.name),value:G(r.value)?we(r.value):U("")})),t=(Array.isArray(e.dataSources)?e.dataSources:[]).filter(G).map(r=>r.kind==="template"?{kind:"template",value:Q(r.value)}:r.kind==="entity"?{kind:"entity",...Nn(r)}:null).filter(r=>r!==null),i={schemaVersion:te(e.schemaVersion,1),id:Q(e.id).toUpperCase(),name:Q(e.name,"Custom"),values:n,slotIndex:te(e.slotIndex,0),elements:(Array.isArray(e.elements)?e.elements:[]).map(Zf),supportedFamilies:(Array.isArray(e.supportedFamilies)?e.supportedFamilies:[]).filter(r=>typeof r=="string"),perFamily:fk(e.perFamily),dataSources:t,tapAction:Ic(e.tapAction)};G(e.inline)&&(i.inline=mk(e.inline)),G(e.control)&&(i.control=gk(e.control));let a=lr(e.refreshMinutes);if(a!==void 0&&(i.refreshMinutes=a),typeof e.openPageId=="string"&&(i.openPageId=e.openPageId),typeof e.openPageName=="string"&&(i.openPageName=e.openPageName),typeof e.showSuccessFlash=="boolean"&&(i.showSuccessFlash=e.showSuccessFlash),typeof e.successFlashColorHex=="string"&&(i.successFlashColorHex=e.successFlashColorHex),e.hidden===!0&&(i.hidden=!0),Array.isArray(e.groups)){let r=e.groups.filter(G).filter(o=>typeof o.id=="string").map(o=>({id:Q(o.id).toUpperCase(),name:Q(o.name,"Group"),locked:o.locked!==!1}));r.length>0&&(i.groups=r)}return Sk(i,Array.isArray(e.elements)?e.elements:[]),Dt(i),i}function Hc(e,n){let t=n?.kind;if(!t||t.kind!=="chartStat")return;let i=e.elements.find(a=>a.payload.id===t.layer);return i?.kind==="chart"?i:void 0}function qn(e,n){return e.elements.filter(t=>t.kind==="text"&&t.payload.value.kind.kind==="chartStat"&&t.payload.value.kind.layer===n)}function $n(e,n,t){let i=Et(e,n.payload.id);if(i){Br(e,t,i.id);return}let a=Vc(e,[n.payload.id,t]),r=e.groups?.find(o=>o.id===a);r&&(r.locked=!1)}var Qf={top:{x:0,y:0},highest:{x:.35,y:0},average:{x:.65,y:0},latest:{x:1,y:0},bottom:{x:0,y:1},lowest:{x:.35,y:1},trend:{x:.85,y:0},delta:{x:.5,y:0},sum:{x:.2,y:0},first:{x:.65,y:1}};function em(e,n,t,i){let a=ge.rectangular,r=Math.min(1,(i*t*.62+4)/a.width),o=Math.min(1,t*1.3/a.height),s=e.x+n.x*e.width-n.x*r,l=e.y+n.y*e.height-n.y*o;return{x:Math.max(0,Math.min(1-r,s)),y:Math.max(0,Math.min(1-o,l)),width:r,height:o,rotationDegrees:0}}function tm(e,n,t){let i=e.elements.find(c=>c.payload.id===n);if(!i||i.kind!=="chart")return;let a=De("text"),r=t==="latest"?10:8,o={kind:{kind:"chartStat",layer:n,stat:t}};(t==="latest"||t==="delta"||t==="sum")&&(o.format={useEntityUnit:!0}),a.payload.value=o,a.payload.fontSize=r,a.payload.fontWeight="medium",a.payload.colorSlot={baseColorHex:t==="latest"?"#FFFFFF":"#FFFFFF99"};let s=t==="trend"?2:o.format?.useEntityUnit?7:4;a.payload.frame=em(i.payload.frame,Qf[t],r,s);let l=e.elements.findIndex(c=>c.payload.id===n);return e.elements.splice(l+1,0,a),$n(e,i,a.payload.id),a.payload.id}var nm={highest:"arrowtriangle.up.fill",lowest:"circle.fill",now:"arrowtriangle.down.fill",first:"circle.fill",latest:"circle.fill",threshold:"circle.fill",zero:"circle.fill"},ef=6,bk={"\u25B2":"arrowtriangle.up.fill","\u25BC":"arrowtriangle.down.fill","\u25CF":"circle.fill","\u25C6":"diamond.fill"};function xk(e,n){let t=(i,a)=>i!==void 0&&i!==a?i:void 0;return n==="highest"?t(e.payload.highColorHex,wt)??"#FFD60A":n==="lowest"?t(e.payload.lowColorHex,kt)??"#FF453A":"#FFFFFF"}function _c(e){e.nowIndex===void 0&&(e.nowIndex={kind:{kind:"time",timeField:"hour"}},e.drawsNowLine=!1)}function et(e,n){return e.elements.filter(t=>t.payload.chartAnchor?.layer===n)}function Pc(e,n,t,i="above"){let a=e.elements.find(s=>s.payload.id===n);if(!a||a.kind!=="chart")return;t==="now"&&_c(a.payload);let r=De("icon");r.payload.symbol=U(nm[t]),r.payload.size=ef,r.payload.colorSlot={baseColorHex:xk(a,t)},r.payload.frame=vk(ef),r.payload.chartAnchor={layer:n,at:t,place:i};let o=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(o+1,0,r),$n(e,a,r.payload.id),r.payload.id}function im(e,n){let t=e.elements.findIndex(u=>u.payload.id===n),i=e.elements[t];if(!i||i.kind!=="text"||i.payload.chartAnchor===void 0)return;let a=i.payload,r=a.chartAnchor,o=u=>{let p=Fi(u);return p===void 0?void 0:bk[p.trim()]},s=new Set(Ur.icon),l=u=>u.flatMap(p=>{if(p.kind==="setText"){let f=p.value===void 0?void 0:o(p.value);return f===void 0?[]:[{kind:"setIcon",value:U(f)}]}return s.has(tt[p.kind])?[p]:[]}),c=a.rules.filter(u=>u.partId===void 0).map(u=>({...u,cases:u.cases.map(p=>({...p,then:l(p.then)})),...u.otherwise!==void 0?{otherwise:l(u.otherwise)}:{}})),d=De("icon");d.payload={...d.payload,id:a.id,colorSlot:a.colorSlot,rules:c,frame:a.frame,isHidden:a.isHidden,...a.groupId!==void 0?{groupId:a.groupId}:{},...a.name!==void 0?{name:a.name}:{},chartAnchor:r,symbol:U(o(a.value)??nm[r.at]),size:a.fontSize},e.elements[t]=d}function vk(e){let n=ge.rectangular;return{x:0,y:0,width:Math.min(1,e*1.2/n.width),height:Math.min(1,e*1.3/n.height),rotationDegrees:0}}function Si(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;t==="now"&&_c(a);let r=De("shape");r.payload.kind="line",r.payload.thickness=1,r.payload.borderWidth=0,r.payload.colorSlot={baseColorHex:t==="now"?a.nowColorHex:a.thresholdColorHex},r.payload.frame=am(a.frame,t),r.payload.chartAnchor={layer:n,at:t,place:"through"};let o=e.elements.findIndex(s=>s.payload.id===n);return e.elements.splice(o+1,0,r),$n(e,i,r.payload.id),t==="now"?a.drawsNowLine=!1:a.drawsThreshold=!1,r.payload.id}function am(e,n){let t=ge.rectangular,i=3;return n==="now"?{...e,width:Math.min(e.width,i/t.width),rotationDegrees:0}:{...e,height:Math.min(e.height,i/t.height),rotationDegrees:0}}function Yn(e,n){return e.elements.filter(t=>t.kind==="chartTimes"&&t.payload.chart===n)}function Di(e,n){let t=e.elements.find(o=>o.payload.id===n);if(!t||t.kind!=="chart"&&t.kind!=="timeline")return;let i=t.payload,a=De("chartTimes");a.payload.chart=n,a.payload.timeLabelCount=i.timeLabelCount>0?Wt(i.timeLabelCount):Hf,a.payload.labelSize=i.labelSize,a.payload.labelColorHex=i.labelColorHex,a.payload.hourCycle=i.hourCycle,a.payload.minutes=i.minutes,a.payload.frame=Ck(i.frame,i.labelSize,i.labelsAbove);let r=e.elements.findIndex(o=>o.payload.id===n);return e.elements.splice(r+1,0,a),$n(e,t,a.payload.id),i.drawsTimeLabels=!1,a.payload.id}function Hs(e,n){return e.elements.filter(t=>t.kind==="imageTime"&&t.payload.image===n)}function wk(e){let n=Math.min(40,Math.max(4,e));return{w:8*n*.578+n*.89,h:n*1.25}}function Nc(e,n){return Math.max(0,Math.min(e/(8*.578+.89),n/1.25))}function Dc(e,n,t=ge.rectangular){let i=e.elements.find(b=>b.payload.id===n);if(!i||i.kind!=="image")return;let a=i.payload,r=De("imageTime");r.payload.image=n;let o=wk(a.timestampSize),s=a.frame.x*t.width,l=a.frame.y*t.height,c=a.frame.width*t.width,d=a.frame.height*t.height,u,p;if(Rs(a)){let b=(y,v,k,S)=>S>=k?v+(k-S)/2:Math.min(v+k-S,Math.max(v,y-S/2));u=b(s+a.timestampX*c,s,c,o.w),p=b(l+a.timestampY*d,l,d,o.h)}else u=a.timestampCorner.endsWith("Leading")?s+4:s+c-4-o.w,p=a.timestampCorner.startsWith("top")?l+4:l+d-4-o.h;let f=b=>Math.round(b*1e3)/1e3;r.payload.frame={x:f(u/t.width),y:f(p/t.height),width:f(o.w/t.width),height:f(o.h/t.height),rotationDegrees:0};let g=e.elements.findIndex(b=>b.payload.id===n);return e.elements.splice(g+1,0,r),$n(e,i,r.payload.id),delete a.timestamp,delete a.timestampX,delete a.timestampY,a.timestampCorner="topLeading",a.timestampSize=Ts,r.payload.id}function Oi(e,n){return e.elements.filter(t=>t.kind==="chartDots"&&t.payload.chart===n)}function zi(e,n){return e.elements.filter(t=>t.kind==="chartGrid"&&t.payload.chart===n)}function Oc(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=De("chartDots");i.payload.chart=n,i.payload.dots=t.payload.pointDots==="all"?"all":"auto",i.payload.frame={...t.payload.frame};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a+1,0,i),$n(e,t,i.payload.id),i.payload.id}function zc(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=De("chartGrid");i.payload.chart=n,i.payload.frame={...t.payload.frame};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a,0,i),$n(e,t,i.payload.id),i.payload.id}var kk="#FFFFFF66";function Gc(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t||t.kind!=="chart")return;let i=De("shape");i.payload.kind="line",i.payload.thickness=1,i.payload.borderWidth=0,i.payload.colorSlot={baseColorHex:kk},i.payload.frame=am(t.payload.frame,"threshold"),i.payload.chartAnchor={layer:n,at:"zero",place:"through"};let a=e.elements.findIndex(r=>r.payload.id===n);return e.elements.splice(a+1,0,i),$n(e,t,i.payload.id),i.payload.id}function rm(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;if(t===void 0){delete a.thresholdValue,delete a.drawsThreshold;for(let r of et(e,n))r.payload.chartAnchor?.at==="threshold"&&Me(e,r.payload.id);return}a.thresholdValue=t,a.drawsThreshold=!1,et(e,n).some(r=>r.payload.chartAnchor?.at==="threshold")||Si(e,n,"threshold")}function om(e,n,t){let i=e.elements.find(r=>r.payload.id===n);if(!i||i.kind!=="chart")return;let a=i.payload;if(!t){delete a.nowIndex,delete a.drawsNowLine;for(let r of et(e,n))r.payload.chartAnchor?.at==="now"&&Me(e,r.payload.id);return}_c(a),a.drawsNowLine=!1,et(e,n).some(r=>r.payload.chartAnchor?.at==="now")||Si(e,n,"now")}function sm(e){let n=e.elements.filter(t=>t.kind==="chart"||t.kind==="timeline"||t.kind==="image");for(let t of n){let i=t.payload,a=new Set(e.elements.map(l=>l.payload.id)),r=ue.find(l=>e.perFamily[l]?.placements[i.id]!==void 0),o=i.frame,s=r===void 0?void 0:e.perFamily[r].placements[i.id];if(s&&(i.frame={...s.frame}),t.kind==="chart"&&$k(e,t.payload),t.kind==="timeline"&&t.payload.drawsTimeLabels!==!1&&t.payload.timeLabelCount>0&&Di(e,i.id),t.kind==="image"&&t.payload.timestamp===!0&&Dc(e,i.id,ge[r??"rectangular"]),i.frame=o,!(r===void 0||s===void 0))for(let l of e.elements)a.has(l.payload.id)||(e.perFamily[r].placements[l.payload.id]={frame:{...l.payload.frame},isHidden:s.isHidden},l.payload.isHidden=!0)}}function $k(e,n){{if(n.highlight!==void 0&&n.highlight!=="none"){let a=ur(n),r=[];(n.highlight==="highest"||n.highlight==="both")&&r.push(["highest",a.high]),(n.highlight==="lowest"||n.highlight==="both")&&r.push(["lowest",a.low]);for(let[o,s]of r){let l=Pc(e,n.id,o),c=e.elements.find(d=>d.payload.id===l);c?.kind==="icon"&&s!=="none"&&(c.payload.symbol=U(s==="triangle"?"arrowtriangle.up.fill":"circle.fill"))}Kw(n,{high:"none",low:"none"}),n.highlight="none"}n.thresholdValue!==void 0&&n.drawsThreshold!==!1&&Si(e,n.id,"threshold"),n.nowIndex!==void 0&&n.drawsNowLine!==!1&&Si(e,n.id,"now"),n.drawsTimeLabels!==!1&&Li(n)&&n.timeLabelCount>0&&Di(e,n.id);let t=Od(n.pointDots);if(t!=="none"){let a=Oc(e,n.id),r=e.elements.find(o=>o.payload.id===a);if(r?.kind==="chartDots"){r.payload.dots=t;let o=Kt(n.pointDotSize);o!==void 0&&(r.payload.size=o),typeof n.pointDotColorHex=="string"&&(r.payload.colorHex=n.pointDotColorHex)}}let i=zd(n.gridLines);if(i>0){let a=zc(e,n.id),r=e.elements.find(o=>o.payload.id===a);r?.kind==="chartGrid"&&(r.payload.lines=i,r.payload.colorHex=Pn(n.gridColorHex))}if(n.zeroLine===!0){let a=Gc(e,n.id),r=e.elements.find(o=>o.payload.id===a);r?.kind==="shape"&&(r.payload.colorSlot={baseColorHex:Pn(n.gridColorHex)})}delete n.pointDots,delete n.pointDotSize,delete n.pointDotColorHex,delete n.gridLines,delete n.gridColorHex,delete n.zeroLine}}function Ck(e,n,t){let i=ge.rectangular,a=Math.max(Kn,Math.min(Wn,n)),r=Math.min(1,a*1.2/i.height),o=Math.min(1,Math.max(0,e.width)),s=t?e.y-r:e.y+e.height;return{x:Math.max(0,Math.min(1-o,e.x)),y:Math.max(0,Math.min(1-r,s)),width:o,height:r,rotationDegrees:0}}function Sk(e,n){for(let t of n){if(!G(t)||t.kind!=="chart"||!G(t.payload))continue;let i=t.payload,a=Q(i.id).toUpperCase(),r=e.elements.find(p=>p.payload.id===a);if(!r||r.kind!=="chart")continue;let o=Q(i.scaleLabelColorHex,"#FFFFFF99"),s=p=>{let f=G(p)?p:{};return{fontSize:te(f.fontSize,8),colorHex:Q(f.colorHex,o),pillColorHex:typeof f.pillColorHex=="string"?f.pillColorHex:void 0}},l=[],c=fe(i.scaleLabels);(c==="top"||c==="range")&&l.push(["top",s(i.topLabelStyle)]),c==="range"&&l.push(["bottom",s(i.bottomLabelStyle)]);let d=fe(i.latestLabel);if((d==="corner"||d==="end")&&l.push(["latest",s(i.latestLabelStyle)]),l.length===0)continue;let u=e.elements.findIndex(p=>p.payload.id===a)+1;for(let[p,f]of l){let g=em(r.payload.frame,Qf[p],f.fontSize,p==="latest"?5:4),b=[];if(f.pillColorHex!==void 0){let v=De("shape");v.payload.kind="capsule",v.payload.colorSlot={baseColorHex:f.pillColorHex},v.payload.frame={...g},b.push(v)}let y=De("text");y.payload.value={kind:{kind:"chartStat",layer:a,stat:p}},y.payload.fontSize=f.fontSize,y.payload.fontWeight="medium",y.payload.colorSlot={baseColorHex:f.colorHex},y.payload.frame=g,b.push(y),e.elements.splice(u,0,...b),u+=b.length;for(let v of b)$n(e,r,v.payload.id)}}}function Z(e){return Number.isNaN(e)?"nan":e===1/0?"+inf":e===-1/0?"-inf":e}function vt(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function Tk(e){let n={};return e.decimals!==void 0&&(n.decimals=Z(e.decimals)),e.multiply!==void 0&&(n.multiply=Z(e.multiply)),e.offset!==void 0&&(n.offset=Z(e.offset)),e.prefix&&(n.prefix=e.prefix),e.suffix&&(n.suffix=e.suffix),e.useEntityUnit&&(n.useEntityUnit=!0),e.relativeTime&&(n.relativeTime=!0),e.duration&&(n.duration=!0),e.timestamp!==void 0&&(n.timestamp=e.timestamp),e.hideMinutes&&(n.hideMinutes=!0),e.hideDayPeriod&&(n.hideDayPeriod=!0),e.textCase!==void 0&&(n.textCase=e.textCase),n}function lm(e){let n=e.scope.kind==="entities"?{kind:"entities",entities:e.scope.entities.map(vt)}:{kind:"filter",domains:e.scope.domains,areaIds:e.scope.areaIds,labelIds:e.scope.labelIds,floorIds:e.scope.floorIds},t={function:e.function,scope:n};return e.stateFilter&&(t.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.attribute!==void 0&&(t.attribute=e.attribute),t}function Ek(e){switch(e.kind){case"literal":return{kind:"literal",value:e.value};case"entityState":return{kind:"entityState",...vt(e)};case"entityAttribute":return{kind:"entityAttribute",...vt(e),attribute:e.attribute};case"entityAge":return{kind:"entityAge",...vt(e)};case"aggregate":return{kind:"aggregate",aggregate:lm(e.aggregate)};case"time":return{kind:"time",timeField:e.timeField};case"dataAge":return{kind:"dataAge"};case"jinja":return{kind:"jinja",value:e.value};case"named":return{kind:"named",id:e.id};case"chartStat":return{kind:"chartStat",layer:e.layer,stat:e.stat};case"item":return{kind:"item",field:e.field};case"listStat":return{kind:"listStat",layer:e.layer,stat:e.stat}}}function me(e){let n={kind:Ek(e.kind)};return Xe(e.format)||(n.format=Tk(e.format)),n}function Bt(e){return{x:Z(e.x),y:Z(e.y),width:Z(e.width),height:Z(e.height),rotationDegrees:Z(e.rotationDegrees)}}function Rk(e){let n={kind:e.kind};switch(e.kind){case"equals":case"notEquals":case"greaterThan":case"greaterOrEqual":case"lessThan":case"lessOrEqual":case"contains":case"startsWith":case"endsWith":n.value=me(e.value??U(""));break;case"between":case"timeBetween":n.value=me(e.value??U("")),n.upper=me(e.upper??U(""));break;case"matchesRegex":n.pattern=e.pattern??"";break;case"isOneOf":n.options=e.options??[];break;default:break}return n}function tf(e){let n={kind:e.kind};switch(e.kind){case"setColor":case"setText":case"setIcon":case"setGaugeValue":case"setBorderColor":case"setBackgroundColor":n.value=me(e.value??U(""));break;case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":n.number=Z(e.number??0);break;case"setFontWeight":n.weight=e.weight??"regular";break;case"setFontDesign":n.design=e.design??"default";break;case"setFontWidth":n.width=e.width??"standard";break;case"setItalic":n.italic=e.italic!==!1;break;default:break}return n}function Vt(e){return e.map(n=>{let t={id:n.id,cases:n.cases.map(i=>({id:i.id,when:{join:i.when.join,tests:i.when.tests.map(a=>({id:a.id,value:me(a.value),comparison:Rk(a.comparison)}))},then:i.then.map(tf)}))};return n.otherwise&&(t.otherwise=n.otherwise.map(tf)),n.partId!==void 0&&(t.partId=n.partId),t})}function Ak(e){let n={id:e.id,value:me(e.value)};return e.colorHex!==void 0&&(n.colorHex=e.colorHex),e.fontWeight!==void 0&&(n.fontWeight=e.fontWeight),e.fontSize!==void 0&&(n.fontSize=Z(e.fontSize)),e.fontDesign!==void 0&&(n.fontDesign=e.fontDesign),e.fontWidth!==void 0&&(n.fontWidth=e.fontWidth),e.italic!==void 0&&(n.italic=e.italic),e.coloring!==void 0&&e.coloring!=="uniform"&&(n.coloring=e.coloring),e.bands!==void 0&&e.bands.length>0&&(n.bands=e.bands.map(dr)),e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==ve&&(n.bandAboveColorHex=e.bandAboveColorHex),n}function dm(e){let n=Fk(e);return e.payload.groupId!==void 0&&(n.payload.groupId=e.payload.groupId),e.payload.name!==void 0&&(n.payload.name=e.payload.name),e.payload.accentGroup==="accent"&&(n.payload.accentGroup="accent"),n}function Fk(e){let n=t=>{let i={id:t.id,colorSlot:{baseColorHex:t.colorSlot.baseColorHex},rules:Vt(t.rules),frame:Bt(t.frame),isHidden:t.isHidden};return t.opacity!==void 0&&t.opacity!==1&&(i.opacity=Z(t.opacity)),t.shadow!==void 0&&(i.shadow={colorHex:t.shadow.colorHex,radius:Z(t.shadow.radius),dx:Z(t.shadow.dx),dy:Z(t.shadow.dy)}),i};switch(e.kind){case"text":{let t={...n(e.payload),value:me(e.payload.value),fontSize:Z(e.payload.fontSize),fontWeight:e.payload.fontWeight};e.payload.countdown===!0&&(t.countdown=!0),e.payload.monospacedDigits===!0&&(t.monospacedDigits=!0),e.payload.lineLimit!==void 0&&e.payload.lineLimit>1&&(t.lineLimit=e.payload.lineLimit),e.payload.fontDesign!==void 0&&e.payload.fontDesign!=="default"&&(t.fontDesign=e.payload.fontDesign),e.payload.fontWidth!==void 0&&e.payload.fontWidth!=="standard"&&(t.fontWidth=e.payload.fontWidth),e.payload.italic===!0&&(t.italic=!0),e.payload.minimumScale!==void 0&&e.payload.minimumScale!==St&&(t.minimumScale=Z(e.payload.minimumScale)),e.payload.alignment!==void 0&&e.payload.alignment!=="center"&&(t.alignment=e.payload.alignment);let i=e.payload;return i.coloring!==void 0&&i.coloring!=="uniform"&&(t.coloring=i.coloring),i.bands!==void 0&&i.bands.length>0&&(t.bands=i.bands.map(dr)),i.bandAboveColorHex!==void 0&&i.bandAboveColorHex!==ve&&(t.bandAboveColorHex=i.bandAboveColorHex),i.highlight!==void 0&&i.highlight!=="none"&&(t.highlight=i.highlight),i.highColorHex!==void 0&&i.highColorHex!==wt&&(t.highColorHex=i.highColorHex),i.lowColorHex!==void 0&&i.lowColorHex!==kt&&(t.lowColorHex=i.lowColorHex),i.parts!==void 0&&i.parts.length>0&&(t.parts=i.parts.map(Ak),_t(i)&&(t.value=me(Er(i.parts)))),i.arc!==void 0&&(t.arc=_w(i.arc)),Zo(i,t),{kind:"text",payload:t}}case"icon":{let t={...n(e.payload),symbol:me(e.payload.symbol)};e.payload.path!==void 0&&e.payload.path!==""&&(t.path=e.payload.path);let i=nc(e.payload.viewBox);return i!==void 0&&(t.viewBox=i),t.size=Z(e.payload.size),Wh(e.payload,t),Zo(e.payload,t),{kind:"icon",payload:t}}case"gauge":{let t=e.payload,i={...n(t),value:me(t.value),minValue:Z(t.minValue),maxValue:Z(t.maxValue),style:t.style,lineWidth:Z(t.lineWidth),trackColorHex:t.trackColorHex};return t.coloring!=="uniform"&&(i.coloring=t.coloring),t.bands.length>0&&(i.bands=t.bands.map(dr)),t.bandAboveColorHex!==ve&&(i.bandAboveColorHex=t.bandAboveColorHex),t.thresholdValue!==void 0&&(i.thresholdValue=Z(t.thresholdValue)),t.thresholdColorHex!==ya&&(i.thresholdColorHex=t.thresholdColorHex),t.total!==void 0&&(i.total=me(t.total)),t.minSource!==void 0&&(i.minSource=me(t.minSource)),t.maxSource!==void 0&&(i.maxSource=me(t.maxSource)),t.fill!==void 0&&(i.fill=Qo(t.fill)),t.ticks!==void 0&&!ys(t.ticks)&&(i.ticks=Gw(t.ticks)),t.labels!==void 0&&!bs(t.labels)&&(i.labels=Vw(t.labels)),{kind:"gauge",payload:i}}case"chart":{let t=e.payload,i={...n(t),value:me(t.value),historyMinutes:Math.max(0,Math.round(t.historyMinutes)),historyPoints:Math.round(t.historyPoints),style:t.style,limit:Math.max(0,Math.round(t.limit)),takeFromEnd:t.takeFromEnd,scale:t.scale,minValue:Z(t.minValue),maxValue:Z(t.maxValue),baseline:t.baseline,barGap:Z(t.barGap),lineWidth:Z(t.lineWidth),highlight:t.highlight,highColorHex:t.highColorHex,lowColorHex:t.lowColorHex,marker:$f(ur(t)),coloring:t.coloring,bands:t.bands.map(dr),bandAboveColorHex:t.bandAboveColorHex,fillBands:t.fillBands};t.source!==qd&&(i.source=t.source),t.statPeriod!==gr&&(i.statPeriod=t.statPeriod),t.statType!==yr&&(i.statType=t.statType),t.thresholdValue!==void 0&&(i.thresholdValue=Z(t.thresholdValue)),t.thresholdColorHex!==sc&&(i.thresholdColorHex=t.thresholdColorHex),t.nowIndex!==void 0&&(i.nowIndex=me(t.nowIndex)),t.nowColorHex!==lc&&(i.nowColorHex=t.nowColorHex),t.drawsThreshold===!1&&(i.drawsThreshold=!1),t.drawsNowLine===!1&&(i.drawsNowLine=!1),t.drawsTimeLabels===!1&&(i.drawsTimeLabels=!1),t.scaleFrom!==void 0&&(i.scaleFrom=t.scaleFrom),t.labelSize!==$t&&(i.labelSize=Z(t.labelSize)),t.labelColorHex!==Ct&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==vi&&(i.timeLabelCount=Wt(t.timeLabelCount)),t.hourCycle!==wi&&(i.hourCycle=t.hourCycle),t.minutes!==ki&&(i.minutes=t.minutes);let a=ur(t);Cf(a)||(i.highMarker=a.high,i.lowMarker=a.low);let r=t.curve??"straight";r!=="straight"&&(i.curve=r);let o=Dn(t.fillStyle);o!=="flat"&&(i.fillStyle=o),t.fillColorHex!==void 0&&(i.fillColorHex=t.fillColorHex),t.areaFill!==void 0&&(i.areaFill=Qo(t.areaFill));let s=On(t.barRadius);s!==ma&&(i.barRadius=Z(s));let l=zn(t.barCorners);l!=="all"&&(i.barCorners=l);let c=It(t.smoothing);return c!==void 0&&(i.smoothing=c),t.gaps===!0&&(i.gaps=!0),t.barBorderWidth!==void 0&&t.barBorderWidth!==0&&(i.barBorderWidth=Z(t.barBorderWidth)),t.barBorderColorHex!==void 0&&(i.barBorderColorHex=t.barBorderColorHex),t.bandAboveFillColorHex!==void 0&&(i.bandAboveFillColorHex=t.bandAboveFillColorHex),t.bandAboveBorderColorHex!==void 0&&(i.bandAboveBorderColorHex=t.bandAboveBorderColorHex),t.barBorderOpenBase===!0&&(i.barBorderOpenBase=!0),{kind:"chart",payload:i}}case"timeline":{let t=e.payload,i={id:t.id,rules:Vt(t.rules),frame:Bt(t.frame),isHidden:t.isHidden,value:me(t.value)},a=Hi(t);return t.aggregate!==void 0&&a.length>0&&(i.aggregate={entities:a,...t.aggregate.combine!==kn?{combine:t.aggregate.combine}:{}}),t.historyMinutes!==gc&&(i.historyMinutes=Math.max(1,Math.round(t.historyMinutes))),t.bands.length>0&&(i.bands=t.bands.map(r=>({id:r.id,match:r.match,colorHex:r.colorHex}))),t.otherColorHex!==Un&&(i.otherColorHex=t.otherColorHex),t.gap!==0&&(i.gap=Z(t.gap)),t.cornerRadius!==If&&(i.cornerRadius=Z(t.cornerRadius)),t.labelSize!==$t&&(i.labelSize=Z(t.labelSize)),t.labelColorHex!==Ct&&(i.labelColorHex=t.labelColorHex),t.labelsAbove&&(i.labelsAbove=!0),t.timeLabelCount!==vi&&(i.timeLabelCount=Math.max(0,Math.min(Ii,Math.round(t.timeLabelCount)))),t.hourCycle!==wi&&(i.hourCycle=t.hourCycle),t.minutes!==ki&&(i.minutes=t.minutes),t.drawsTimeLabels===!1&&(i.drawsTimeLabels=!1),{kind:"timeline",payload:i}}case"shape":{let t={...n(e.payload),kind:e.payload.kind,cornerRadius:Z(e.payload.cornerRadius),borderWidth:Z(e.payload.borderWidth)};return e.payload.borderColorHex!==void 0&&(t.borderColorHex=e.payload.borderColorHex),e.payload.thickness!==1&&(t.thickness=Z(e.payload.thickness)),e.payload.fill!==void 0&&(t.fill=Qo(e.payload.fill)),Wh(e.payload,t),Zo(e.payload,t),{kind:"shape",payload:t}}case"image":{let t=e.payload,i={id:t.id};(t.source!=="inline"||t.entity.entityId!=="")&&(i.entity=vt(t.entity)),i.rules=Vt(t.rules),i.frame=Bt(t.frame),i.isHidden=t.isHidden,t.source!=="camera"&&(i.source=t.source),t.data!==void 0&&t.data!==""&&(i.data=t.data),t.format==="jpeg"&&(i.format="jpeg"),t.timestamp===!0&&(i.timestamp=!0),t.contentMode!=="fill"&&(i.contentMode=t.contentMode),t.zoom!==1&&(i.zoom=Z(t.zoom)),t.panX!==0&&(i.panX=Z(t.panX)),t.panY!==0&&(i.panY=Z(t.panY)),t.cornerRadius!==ka&&(i.cornerRadius=Z(t.cornerRadius));let a=Rs(t),r=a?Qw(t.timestampX,t.timestampY):t.timestampCorner;return r!=="topLeading"&&(i.timestampCorner=r),t.timestampSize!==Ts&&(i.timestampSize=Z(t.timestampSize)),a&&(i.timestampX=Z(t.timestampX),i.timestampY=Z(t.timestampY)),Zo(t,i),{kind:"image",payload:i}}case"tap":{let t=e.payload,i={id:t.id,action:Bc(t.action)};return t.openPageId!==void 0&&(i.openPageId=t.openPageId),t.openPageName!==void 0&&(i.openPageName=t.openPageName),t.attachedTo!==void 0&&(i.attachedTo=t.attachedTo),i.rules=Vt(t.rules),i.frame=Bt(t.frame),i.isHidden=t.isHidden,t.opacity!==void 0&&t.opacity!==1&&(i.opacity=Z(t.opacity)),t.shadow!==void 0&&(i.shadow={colorHex:t.shadow.colorHex,radius:Z(t.shadow.radius),dx:Z(t.shadow.dx),dy:Z(t.shadow.dy)}),{kind:"tap",payload:i}}case"chartTimes":{let t=e.payload,i={id:t.id,rules:Vt(t.rules),frame:Bt(t.frame),isHidden:t.isHidden,chart:t.chart};return t.labelSize!==$t&&(i.labelSize=Z(t.labelSize)),t.labelColorHex!==Ct&&(i.labelColorHex=t.labelColorHex),t.timeLabelCount!==vi&&(i.timeLabelCount=Wt(t.timeLabelCount)),t.hourCycle!==wi&&(i.hourCycle=t.hourCycle),t.minutes!==ki&&(i.minutes=t.minutes),{kind:"chartTimes",payload:i}}case"imageTime":{let t=e.payload,i={id:t.id,rules:Vt(t.rules),frame:Bt(t.frame),isHidden:t.isHidden};return t.image!==""&&(i.image=t.image),{kind:"imageTime",payload:i}}case"chartDots":{let t=e.payload,i={id:t.id,rules:Vt(t.rules),frame:Bt(t.frame),isHidden:t.isHidden,chart:t.chart};es(t.dots)!=="auto"&&(i.dots="all");let a=Kt(t.size);return a!==void 0&&(i.size=Z(a)),t.colorHex!==void 0&&(i.colorHex=t.colorHex),{kind:"chartDots",payload:i}}case"chartGrid":{let t=e.payload,i={id:t.id,rules:Vt(t.rules),frame:Bt(t.frame),isHidden:t.isHidden,chart:t.chart},a=Ri(t.lines);a!==Vn&&(i.lines=a);let r=Pn(t.colorHex);fa(r,fn)||(i.colorHex=r);let o=Ai(t.thickness);return o!==Bn&&(i.thickness=Z(o)),{kind:"chartGrid",payload:i}}case"list":{let t=e.payload,i={id:t.id,rules:Vt(t.rules),frame:Bt(t.frame),isHidden:t.isHidden};t.opacity!==void 0&&t.opacity!==1&&(i.opacity=Z(t.opacity)),t.shadow!==void 0&&(i.shadow={colorHex:t.shadow.colorHex,radius:Z(t.shadow.radius),dx:Z(t.shadow.dx),dy:Z(t.shadow.dy)}),i.source=Mk(t.source);let a=nt(t.rows);a!==Nr&&(i.rows=a),t.direction==="across"&&(i.direction="across");let r=Gr(t.columns);r!==Dr&&(i.columns=r);let o=Pi(t.gap);return o!==Or&&(i.gap=Z(o)),t.template.length>0&&(i.template=t.template.map(dm)),{kind:"list",payload:i}}}}function Mk(e){switch(e.kind){case"entities":{let n={kind:"entities",scope:lm({function:"count",scope:e.scope}).scope},t=(e.deviceClass??"").trim();return t!==""&&(n.deviceClass=t),e.stateFilter&&(n.stateFilter=e.stateFilter.kind==="equals"||e.stateFilter.kind==="notEquals"?{kind:e.stateFilter.kind,value:e.stateFilter.value}:{kind:e.stateFilter.kind}),e.sort!=="name"&&(n.sort=e.sort),e.descending&&(n.descending=!0),e.attributes.length>0&&(n.attributes=[...e.attributes]),n}case"attribute":return{kind:"attribute",...vt(e),attribute:e.attribute};case"template":return{kind:"template",value:e.value};case"calendar":{let n={kind:"calendar",entities:e.entities.map(vt)},t=Ca(e.hours);return t!==zr&&(n.hours=t),n}case"todo":{let n={kind:"todo",entities:e.entities.map(vt)};return e.status!=="open"&&(n.status=e.status),e.sort!=="list"&&(n.sort=e.sort),n}case"forecast":{let n={kind:"forecast",...vt(e)};return e.type!=="hourly"&&(n.type=e.type),n}}}function Lk(e){let n={},t=Object.keys(e.placements);if(t.length>0){let i={};for(let a of t){let r=e.placements[a],o={frame:Bt(r.frame)};r.isHidden&&(o.isHidden=!0),r.size!==void 0&&(o.size=Z(r.size)),i[a]=o}n.placements=i}if(e.bezelText&&(n.bezelText=me(e.bezelText)),e.bezelCountdown===!0&&(n.bezelCountdown=!0),e.curvedText&&(n.curvedText=me(e.curvedText)),e.curvedColorHex!==void 0&&(n.curvedColorHex=e.curvedColorHex),e.bezelGauge){let i=e.bezelGauge,a={value:me(i.value),minValue:Z(i.minValue),maxValue:Z(i.maxValue),colorHexes:i.colorHexes};i.minLabel&&(a.minLabel=me(i.minLabel)),i.maxLabel&&(a.maxLabel=me(i.maxLabel)),n.bezelGauge=a}return e.backgroundColorHex!==void 0&&(n.backgroundColorHex=e.backgroundColorHex),e.backgroundFill!==void 0&&(n.backgroundFill=Qo(e.backgroundFill)),n.cornerBodyShape=e.cornerBodyShape,e.borderColorHex!==void 0&&(n.borderColorHex=e.borderColorHex),n.borderWidth=Z(e.borderWidth),e.rules.length>0&&(n.rules=Vt(e.rules)),n}function Bc(e){if(e.type==="callService"){let n={type:e.type,serviceDomain:e.serviceDomain,serviceName:e.serviceName};return e.serviceDataJSON!==void 0&&e.serviceDataJSON.trim()!==""&&(n.serviceDataJSON=e.serviceDataJSON),e.target!==void 0&&e.target.entityId!==""&&Object.assign(n,vt(e.target)),n}if(e.type==="refreshAll"){let n={type:e.type};return e.allPlaced===!0?(n.allPlaced=!0,n):(e.targets!==void 0&&e.targets.length>0&&(n.targets=[...e.targets]),n)}return"entityId"in e?{type:e.type,...vt(e)}:{type:e.type}}function Ik(e){if(e.kind==="template")return{kind:"template",value:e.value};if(e.kind==="entity")return{kind:"entity",...vt(e)};let n={kind:"list",source:e.source};return e.entities!==void 0&&(n.entities=[...e.entities]),e.entity_id!==void 0&&(n.entity_id=e.entity_id),e.hours!==void 0&&(n.hours=e.hours),e.status!==void 0&&(n.status=e.status),e.sort!==void 0&&(n.sort=e.sort),e.type!==void 0&&(n.type=e.type),n.limit=e.limit,n}function Hk(e){let n={};return e.label!==void 0&&(n.label=e.label),n.value=me(e.value),e.symbol!==void 0&&(n.symbol=e.symbol),e.countdown&&(n.countdown=!0),n}function _k(e){let n={kind:e.kind,title:me(e.title)};return e.valueLabel!==void 0&&(n.valueLabel=me(e.valueLabel)),e.state!==void 0&&(n.state=me(e.state)),n.symbol=e.symbol,e.symbolOff!==void 0&&(n.symbolOff=e.symbolOff),e.tintColorHex!==void 0&&(n.tintColorHex=e.tintColorHex),e.coloring!=="uniform"&&(n.coloring=e.coloring),e.bands.length>0&&(n.bands=e.bands.map(dr)),e.bandAboveColorHex!==void 0&&(n.bandAboveColorHex=e.bandAboveColorHex),e.status!==void 0&&(n.status=me(e.status)),n.action=Bc(e.action),n}function Sa(e){let n=[];for(let i of ue){let a=e.perFamily[i];a&&n.push(i,Lk(a))}let t={schemaVersion:hn(e),id:e.id,name:e.name,values:e.values.map(i=>({id:i.id,name:i.name,value:me(i.value)})),slotIndex:e.slotIndex,elements:e.elements.map(dm),supportedFamilies:e.supportedFamilies,perFamily:n,dataSources:e.dataSources.map(Ik),tapAction:Bc(e.tapAction)};return e.inline!==void 0&&(t.inline=Hk(e.inline)),e.refreshMinutes!==void 0&&(t.refreshMinutes=e.refreshMinutes),e.openPageId!==void 0&&(t.openPageId=e.openPageId),e.openPageName!==void 0&&(t.openPageName=e.openPageName),e.showSuccessFlash!==void 0&&(t.showSuccessFlash=e.showSuccessFlash),e.successFlashColorHex!==void 0&&(t.successFlashColorHex=e.successFlashColorHex),e.groups!==void 0&&e.groups.length>0&&(t.groups=e.groups.map(i=>({id:i.id,name:i.name,locked:i.locked}))),e.hidden===!0&&(t.hidden=!0),e.control!==void 0&&(t.control=_k(e.control)),t}function cm(e){return G(e)&&e.hidden===!0}function um(e,n){let t={...e};return n?t.hidden=!0:delete t.hidden,t}function pm(e,n,t){let i=[],a=[];for(let r of e){let o=n(r);o!==void 0&&o.hidden&&o.id!==t?a.push(r):i.push(r)}return{shown:i,hidden:a}}function Et(e,n){let i=e.elements.find(a=>a.payload.id===n)?.payload.groupId;return i===void 0?void 0:e.groups?.find(a=>a.id===i)}function Rt(e,n){return e.elements.filter(t=>t.payload.groupId===n&&!Re(e,t))}function hm(e,n){let t=new Set;for(let i of n){let a=Et(e,i);if(a)for(let r of Rt(e,a.id))t.add(r.payload.id);else t.add(i)}return e.elements.filter(i=>t.has(i.payload.id)&&i.kind!=="chartDots"&&i.kind!=="chartGrid"&&i.payload.chartAnchor===void 0).map(i=>i.payload.id)}function Dt(e){let n=new Set((e.groups??[]).map(a=>a.id));for(let a of e.elements)a.payload.groupId!==void 0&&!n.has(a.payload.groupId)&&delete a.payload.groupId;let t=new Set(e.elements.map(a=>a.payload.groupId).filter(a=>a!==void 0)),i=(e.groups??[]).filter(a=>t.has(a.id));i.length===0?delete e.groups:e.groups=i}function Ta(e){if(!e.groups?.length)return;let n=e.elements.filter(r=>!Re(e,r)),t=e.elements.filter(r=>Re(e,r)),i=[],a=new Set;for(let r=n.length-1;r>=0;r--){let o=n[r];if(a.has(o.payload.id))continue;let s=o.payload.groupId;if(s===void 0){i.unshift(o),a.add(o.payload.id);continue}let l=n.filter(c=>c.payload.groupId===s);for(let c=l.length-1;c>=0;c--)i.unshift(l[c]),a.add(l[c].payload.id)}e.elements=[...i,...t],Xn(e)}function Pk(e){let n=new Set((e.groups??[]).map(i=>i.name.trim())),t=1;for(;n.has(`Group ${t}`);)t++;return`Group ${t}`}function Vc(e,n,t=Pk(e)){let i=e.elements.filter(r=>n.includes(r.payload.id)&&!Re(e,r));if(i.length<2)return;let a={id:se(),name:t,locked:!0};e.groups=[...e.groups??[],a];for(let r of i)r.payload.groupId=a.id;return Dt(e),Ta(e),a.id}function Ea(e,n){for(let t of e.elements)t.payload.groupId===n&&delete t.payload.groupId;Dt(e)}function Br(e,n,t){let i=e.elements.find(a=>a.payload.id===n);!i||Re(e,i)||(t===void 0?delete i.payload.groupId:i.payload.groupId=t,Dt(e),Ta(e))}var oe={config:["schemaVersion","id","name","values","slotIndex","elements","supportedFamilies","perFamily","inline","dataSources","refreshMinutes","tapAction","openPageId","openPageName","showSuccessFlash","successFlashColorHex","groups","hidden","control"],group:["id","name","locked"],inline:["label","value","symbol","countdown"],control:["kind","title","valueLabel","state","symbol","symbolOff","tintColorHex","coloring","bands","bandAboveColorHex","status","action"],named:["id","name","value"],value:["kind","format"],format:["decimals","multiply","offset","prefix","suffix","useEntityUnit","relativeTime","duration","timestamp","hideMinutes","hideDayPeriod","textCase"],entityRef:["entityId","displayName","domain","iconName"],aggregate:["function","scope","stateFilter","attribute"],scope:["kind","entities","domains","areaIds","labelIds","floorIds"],stateFilter:["kind","value"],frame:["x","y","width","height","rotationDegrees"],chartAnchor:["layer","at","place","dx","dy"],fill:["kind","stops","angle"],fillStop:["at","colorHex"],level:["value","minValue","maxValue","minSource","maxSource","direction","trackColorHex"],gaugeTicks:["count","length","colorHex","majorEvery"],gaugeLabels:["show","size","colorHex"],arc:["radius","angle","sweep","spacing","flip"],elementEnvelope:["kind","payload"],elementBase:["id","colorSlot","rules","frame","isHidden","opacity","shadow","groupId","name","accentGroup"],shadow:["colorHex","radius","dx","dy"],text:["value","fontSize","fontWeight","countdown","monospacedDigits","lineLimit","fontDesign","fontWidth","italic","minimumScale","alignment","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex","parts","arc","chartAnchor"],textPart:["id","value","colorHex","fontWeight","fontSize","fontDesign","fontWidth","italic","coloring","bands","bandAboveColorHex"],icon:["symbol","path","viewBox","size","level","chartAnchor"],gauge:["value","minValue","maxValue","style","lineWidth","trackColorHex","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","total","minSource","maxSource","fill","ticks","labels"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","style","limit","takeFromEnd","scale","minValue","maxValue","baseline","barGap","lineWidth","highlight","highColorHex","lowColorHex","marker","coloring","bands","bandAboveColorHex","fillBands","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","scaleFrom","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes","highMarker","lowMarker","curve","fillStyle","fillColorHex","areaFill","barRadius","barCorners","smoothing","gaps","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","pointDots","pointDotSize","pointDotColorHex","gridLines","gridColorHex","zeroLine","bandLowColorHex","bandHighColorHex","bandLowerBound","bandUpperBound","scaleLabels","scaleLabelPlacement","latestLabel","topLabelStyle","bottomLabelStyle","latestLabelStyle","latestLabelFollowsBand","scaleLabelColorHex"],timeline:["value","aggregate","historyMinutes","bands","otherColorHex","gap","cornerRadius","timeLabels","labelSize","labelColorHex","labelsAbove","timeLabelCount","hourCycle","minutes","drawsTimeLabels"],timelineAggregate:["entities","combine"],shape:["kind","cornerRadius","thickness","borderColorHex","borderWidth","fill","level","chartAnchor"],image:["entity","source","data","format","timestamp","contentMode","zoom","panX","panY","cornerRadius","timestampCorner","timestampSize","timestampStyle","timestampX","timestampY","chartAnchor"],tap:["action","openPageId","openPageName","attachedTo","grow"],chartTimes:["chart","timeLabelCount","labelSize","labelColorHex","hourCycle","minutes"],chartDots:["chart","dots","size","colorHex"],chartGrid:["chart","lines","colorHex","thickness"],imageTime:["image","size"],list:["source","rows","direction","columns","gap","template"],colorSlot:["baseColorHex"],rule:["id","cases","otherwise","partId"],case:["id","when","then"],condition:["join","tests"],test:["id","value","comparison"],comparison:["kind","value","upper","pattern","options"],styleChange:["kind","value","number","weight","design","width","italic"],layout:["placements","bezelText","bezelCountdown","curvedText","curvedColorHex","bezelGauge","backgroundColorHex","backgroundFill","cornerBodyShape","borderColorHex","borderWidth","rules"],bezelGauge:["value","minValue","maxValue","colorHexes","minLabel","maxLabel"],placement:["frame","isHidden","size"],tapAction:["type","entityId","displayName","domain","iconName","serviceDomain","serviceName","serviceDataJSON","targets","allPlaced"]},nf={literal:["kind","value"],entityState:["kind",...oe.entityRef],entityAttribute:["kind",...oe.entityRef,"attribute"],entityAge:["kind",...oe.entityRef],aggregate:["kind","aggregate"],time:["kind","timeField"],dataAge:["kind"],jinja:["kind","value"],named:["kind","id"],chartStat:["kind","layer","stat"],item:["kind","field"],listStat:["kind","layer","stat"]},Nk={entities:["kind","scope","deviceClass","stateFilter","sort","descending","attributes"],attribute:["kind",...oe.entityRef,"attribute"],template:["kind","value"],calendar:["kind","entities","hours"],todo:["kind","entities","status","sort"],forecast:["kind",...oe.entityRef,"type"]};function _s(e){let n=[],t=(u,p,f)=>{if(G(u))for(let g of Object.keys(u))p.includes(g)||n.push(`${f}.${g}`)},i=(u,p)=>{if(!G(u))return;let f=typeof u.kind=="string"?u.kind:"";t(u,nf[f]??["kind"],p),f==="aggregate"&&G(u.aggregate)&&(t(u.aggregate,oe.aggregate,`${p}.aggregate`),t(u.aggregate.scope,oe.scope,`${p}.aggregate.scope`),G(u.aggregate.scope)&&Array.isArray(u.aggregate.scope.entities)&&u.aggregate.scope.entities.forEach((g,b)=>t(g,oe.entityRef,`${p}.aggregate.scope.entities[${b}]`)),t(u.aggregate.stateFilter,oe.stateFilter,`${p}.aggregate.stateFilter`))},a=(u,p)=>{if(G(u)){if(G(u.kind))t(u,oe.value,p),i(u.kind,`${p}.kind`);else{let f=typeof u.kind=="string"?u.kind:"";t(u,[...nf[f]??["kind"],"format"],p),f==="aggregate"&&i(u,p)}t(u.format,oe.format,`${p}.format`)}},r=(u,p)=>{G(u)&&(t(u,oe.fill,p),Array.isArray(u.stops)&&u.stops.forEach((f,g)=>t(f,oe.fillStop,`${p}.stops[${g}]`)))},o=(u,p)=>{Array.isArray(u)&&u.forEach((f,g)=>{t(f,oe.styleChange,`${p}[${g}]`),G(f)&&a(f.value,`${p}[${g}].value`)})},s=(u,p)=>{Array.isArray(u)&&u.forEach((f,g)=>{let b=`${p}[${g}]`;t(f,oe.rule,b),G(f)&&(Array.isArray(f.cases)&&f.cases.forEach((y,v)=>{let k=`${b}.cases[${v}]`;t(y,oe.case,k),G(y)&&(t(y.when,oe.condition,`${k}.when`),G(y.when)&&Array.isArray(y.when.tests)&&y.when.tests.forEach((S,I)=>{let _=`${k}.when.tests[${I}]`;t(S,oe.test,_),G(S)&&(a(S.value,`${_}.value`),t(S.comparison,oe.comparison,`${_}.comparison`),G(S.comparison)&&(a(S.comparison.value,`${_}.comparison.value`),a(S.comparison.upper,`${_}.comparison.upper`)))}),o(y.then,`${k}.then`))}),o(f.otherwise,`${b}.otherwise`))})};if(!G(e))return n;t(e,oe.config,"$"),Array.isArray(e.groups)&&e.groups.forEach((u,p)=>t(u,oe.group,`$.groups[${p}]`)),Array.isArray(e.values)&&e.values.forEach((u,p)=>{t(u,oe.named,`$.values[${p}]`),G(u)&&a(u.value,`$.values[${p}].value`)});let l=(u,p)=>{if(!G(u))return;let f=typeof u.kind=="string"?u.kind:"";t(u,Nk[f]??["kind"],p),f==="entities"&&(t(u.scope,oe.scope,`${p}.scope`),G(u.scope)&&Array.isArray(u.scope.entities)&&u.scope.entities.forEach((g,b)=>t(g,oe.entityRef,`${p}.scope.entities[${b}]`)),t(u.stateFilter,oe.stateFilter,`${p}.stateFilter`)),(f==="calendar"||f==="todo")&&Array.isArray(u.entities)&&u.entities.forEach((g,b)=>t(g,oe.entityRef,`${p}.entities[${b}]`))},c=(u,p)=>{if(t(u,oe.elementEnvelope,p),!G(u)||!G(u.payload))return;let f=typeof u.kind=="string"?u.kind:"",g=oe[f]??[];t(u.payload,[...oe.elementBase,...g],`${p}.payload`),t(u.payload.colorSlot,oe.colorSlot,`${p}.payload.colorSlot`),t(u.payload.frame,oe.frame,`${p}.payload.frame`),"chartAnchor"in u.payload&&t(u.payload.chartAnchor,oe.chartAnchor,`${p}.payload.chartAnchor`),"shadow"in u.payload&&t(u.payload.shadow,oe.shadow,`${p}.payload.shadow`);for(let b of["fill","areaFill"])b in u.payload&&r(u.payload[b],`${p}.payload.${b}`);if("ticks"in u.payload&&t(u.payload.ticks,oe.gaugeTicks,`${p}.payload.ticks`),"labels"in u.payload&&t(u.payload.labels,oe.gaugeLabels,`${p}.payload.labels`),G(u.payload.level)){let b=`${p}.payload.level`;t(u.payload.level,oe.level,b);for(let y of["value","minSource","maxSource"])y in u.payload.level&&a(u.payload.level[y],`${b}.${y}`)}s(u.payload.rules,`${p}.payload.rules`);for(let b of["value","symbol","nowIndex","total","minSource","maxSource"])b in u.payload&&a(u.payload[b],`${p}.payload.${b}`);if(f==="text"&&"arc"in u.payload&&t(u.payload.arc,oe.arc,`${p}.payload.arc`),f==="timeline"&&"aggregate"in u.payload&&t(u.payload.aggregate,oe.timelineAggregate,`${p}.payload.aggregate`),f==="text"&&Array.isArray(u.payload.parts)&&u.payload.parts.forEach((b,y)=>{t(b,oe.textPart,`${p}.payload.parts[${y}]`),G(b)&&a(b.value,`${p}.payload.parts[${y}].value`)}),f==="image"&&t(u.payload.entity,oe.entityRef,`${p}.payload.entity`),f==="tap"&&t(u.payload.action,oe.tapAction,`${p}.payload.action`),f==="list"){l(u.payload.source,`${p}.payload.source`);let b=Array.isArray(u.payload.template)?u.payload.template:[];b.length>$a&&n.push(`${p}.payload.template.length`),b.forEach((y,v)=>{let k=`${p}.payload.template[${v}]`;G(y)&&zf.includes(String(y.kind))?n.push(`${k}.kind`):c(y,k)})}};Array.isArray(e.elements)&&e.elements.forEach((u,p)=>c(u,`$.elements[${p}]`));let d=[];if(Array.isArray(e.perFamily))for(let u=0;u+1<e.perFamily.length;u+=2)d.push([String(e.perFamily[u]),e.perFamily[u+1]]);else G(e.perFamily)&&d.push(...Object.entries(e.perFamily));for(let[u,p]of d){let f=`$.perFamily.${u}`;if(t(p,oe.layout,f),!!G(p)){if(G(p.placements))for(let[g,b]of Object.entries(p.placements))t(b,oe.placement,`${f}.placements.${g}`),G(b)&&t(b.frame,oe.frame,`${f}.placements.${g}.frame`);if(a(p.bezelText,`${f}.bezelText`),a(p.curvedText,`${f}.curvedText`),"backgroundFill"in p&&r(p.backgroundFill,`${f}.backgroundFill`),G(p.bezelGauge)){let g=`${f}.bezelGauge`;t(p.bezelGauge,oe.bezelGauge,g),a(p.bezelGauge.value,`${g}.value`),a(p.bezelGauge.minLabel,`${g}.minLabel`),a(p.bezelGauge.maxLabel,`${g}.maxLabel`)}s(p.rules,`${f}.rules`)}}if(G(e.inline)&&(t(e.inline,oe.inline,"$.inline"),a(e.inline.value,"$.inline.value")),G(e.control)){t(e.control,oe.control,"$.control");for(let u of["title","valueLabel","state","status"])u in e.control&&a(e.control[u],`$.control.${u}`);t(e.control.action,oe.tapAction,"$.control.action")}return t(e.tapAction,oe.tapAction,"$.tapAction"),n}function se(){let e=globalThis.crypto;if(e&&"randomUUID"in e)return e.randomUUID().toUpperCase();let n=()=>Math.floor(Math.random()*65536).toString(16).padStart(4,"0"),t=(8+Math.floor(Math.random()*4)).toString(16)+n().slice(1);return`${n()}${n()}-${n()}-4${n().slice(1)}-${t}-${n()}${n()}${n()}`.toUpperCase()}function At(){return{placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}}function fm(e,n,t=[...Vd]){let i={};for(let r of ue)t.includes(r)&&(i[r]=At());let a={schemaVersion:4,id:se(),name:e,values:[],slotIndex:n,elements:[],supportedFamilies:or.filter(r=>t.includes(r)),perFamily:i,dataSources:[],refreshMinutes:0,tapAction:{type:"refresh"}};return t.includes("inline")&&(a.inline={value:U("Text")}),a.schemaVersion=hn(a),a}function Dk(e){let n=ak(e.tapAction.type)?structuredClone(e.tapAction):{type:"toggleEntity",entityId:"",displayName:"",domain:""};return{kind:"toggle",title:U(e.name.trim()||"Control"),symbol:Is,coloring:"uniform",bands:[],action:n}}function mm(e){return e.control===void 0}function Ps(e){return e.control!==void 0&&e.supportedFamilies.length===0}function Ns(e,n){if(!n){if(Ps(e))return;delete e.control;return}e.control===void 0&&(e.control=Dk(e))}function De(e){let n=t=>({id:se(),colorSlot:{baseColorHex:t},rules:[],frame:{...br},isHidden:!1});switch(e){case"text":return{kind:e,payload:{...n("#FFFFFF"),value:U("Text"),fontSize:14,fontWeight:"regular"}};case"icon":return{kind:e,payload:{...n("#FFFFFF"),symbol:U("lightbulb"),size:14}};case"gauge":return{kind:e,payload:{...n("#FFFFFF"),value:U("50"),minValue:0,maxValue:100,style:"arc",lineWidth:4,trackColorHex:"#FFFFFF40",coloring:"uniform",bands:[],bandAboveColorHex:ve,thresholdColorHex:ya}};case"chart":return{kind:e,payload:{...n("#FFFFFF"),value:U("13,14,16,17,19,22,24,28,30"),historyMinutes:ws,historyPoints:24,source:qd,statPeriod:gr,statType:yr,style:"bars",curve:"smooth",fillStyle:"fade",limit:0,takeFromEnd:!1,scale:"auto",minValue:0,maxValue:100,baseline:"lowest",barGap:1.5,lineWidth:2,highlight:"none",highColorHex:wt,lowColorHex:kt,marker:"none",coloring:"uniform",bands:[],bandAboveColorHex:ve,fillBands:!1,thresholdColorHex:sc,nowColorHex:lc,timeLabelCount:vi,labelSize:$t,labelColorHex:Ct,labelsAbove:!1,hourCycle:wi,minutes:ki}};case"timeline":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,value:U(""),historyMinutes:Yw,bands:[],otherColorHex:jw,gap:0,cornerRadius:qw,timeLabelCount:Hf,labelSize:$t,labelColorHex:Ct,labelsAbove:!1,hourCycle:wi,minutes:ki}}}case"shape":return{kind:e,payload:{...n("#FFFFFF33"),kind:"roundedRectangle",cornerRadius:6,thickness:1,borderWidth:1}};case"image":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,entity:{entityId:"",displayName:"",domain:"camera"},source:"camera",contentMode:"fill",zoom:1,panX:0,panY:0,cornerRadius:ka,timestampCorner:"topLeading",timestampSize:Ts}}}case"tap":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,action:{type:"refresh"}}}}case"chartTimes":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",timeLabelCount:vi,labelSize:$t,labelColorHex:Ct,hourCycle:wi,minutes:ki}}}case"imageTime":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,image:""}}}case"chartDots":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",dots:"auto"}}}case"chartGrid":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,chart:"",lines:Vn,colorHex:fn,thickness:Bn}}}case"list":{let{colorSlot:t,...i}=n("#FFFFFF");return{kind:e,payload:{...i,source:{kind:"entities",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},sort:"name",descending:!1,attributes:[]},rows:Nr,direction:"down",columns:Dr,gap:Or,template:[]}}}}}function U(e){return{kind:{kind:"literal",value:e}}}function Ds(e){switch(e.kind){case"text":return e.payload.fontSize;case"icon":return e.payload.size;case"gauge":return e.payload.lineWidth;case"chart":return e.payload.lineWidth;case"timeline":return;case"shape":return;case"image":return;case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return;case"list":return}}var af=["circular","corner"],rf=Math.SQRT1_2;function Ok(e){return e==="text"||e==="icon"?4:.5}function Os(e,n,t,i){let a=structuredClone(e),r=ge[n],o=ge[t];if(n===t||!r||!o)return a;let s=af.includes(n),l=af.includes(t),c=s===l?1:l?rf:1/rf,d=Math.min(o.width/r.width,o.height/r.height)*c;if(c!==1){let u=a.frame,p=u.x+u.width/2,f=u.y+u.height/2;a.frame={...u,width:u.width*c,height:u.height*c,x:.5+(p-.5)*c-u.width*c/2,y:.5+(f-.5)*c-u.height*c/2}}return a.size!==void 0&&(a.size=Math.max(Ok(i),Math.round(a.size*d*10)/10)),a}function Uc(e,n){if(!n)return e;let t={...e.payload,frame:n.frame,isHidden:n.isHidden};return n.size!==void 0&&(e.kind==="text"?t.fontSize=n.size:e.kind==="icon"?t.size=n.size:(e.kind==="gauge"||e.kind==="chart")&&(t.lineWidth=n.size)),{kind:e.kind,payload:t}}function gm(e,n){let t=e.perFamily[n];return!t||Object.keys(t.placements).length===0?e.elements:e.elements.map(i=>Uc(i,t.placements[i.payload.id]))}function Ra(e){switch(e.kind){case"text":return e.payload.value;case"icon":return e.payload.symbol;case"gauge":return e.payload.value;case"chart":return e.payload.value;case"timeline":return e.payload.value;case"shape":return;case"image":return e.payload.source==="inline"?void 0:{kind:{kind:"entityState",...e.payload.entity}};case"tap":return;case"chartTimes":return;case"chartDots":return;case"chartGrid":return;case"imageTime":return;case"list":return}}function fr(e){let n=[],t=i=>{for(let a of i)a.value&&n.push(a.value)};for(let i of e){for(let a of i.cases){for(let r of a.when.tests)n.push(r.value),r.comparison.value&&n.push(r.comparison.value),r.comparison.upper&&n.push(r.comparison.upper);t(a.then)}i.otherwise&&t(i.otherwise)}return n}var Kc=["light","switch","fan","input_boolean","cover","lock","media_player","siren","humidifier","valve","automation","group"];function Bd(e,n){let t,i=n;for(let a=0;i!==void 0&&a<4;a++){let r=i.kind;if(r.kind==="chartStat"){i=Hc(e,i)?.payload.value;continue}if("entityId"in r){if(r.entityId==="")return;let o={entityId:r.entityId,displayName:r.displayName,domain:r.domain};return t===void 0?{ref:o}:{ref:o,namedId:t}}if(r.kind!=="named")return;t=r.id.toUpperCase(),i=e.values.find(o=>o.id.toUpperCase()===t)?.value}}function zs(e,n){return Bd(e,Ra(n))?.ref}function Wc(e,n){let t=zs(e,n),i=t&&(t.domain||t.entityId.split(".")[0])||"";return t&&Kc.includes(i)?{type:"toggleEntity",...t,domain:i}:{type:"refresh"}}function of(e,n,t){if(As(n)||t.width<=0||t.height<=0)return{...e};let i=n,a=e.x-i.left/t.width,r=e.x+e.width+i.right/t.width,o=e.y-i.top/t.height,s=e.y+e.height+i.bottom/t.height;return r<a&&(a=r=(a+r)/2),s<o&&(o=s=(o+s)/2),a=Lt(a),r=Lt(r),o=Lt(o),s=Lt(s),{...e,x:a,y:o,width:Math.max(0,r-a),height:Math.max(0,s-o)}}function ym(e,n,t){let i=a=>Math.round(a*100)/100||0;return{left:i((e.x-n.x)*t.width),right:i((n.x+n.width-e.x-e.width)*t.width),top:i((e.y-n.y)*t.height),bottom:i((n.y+n.height-e.y-e.height)*t.height)}}function bm(e,n,t,i){let a=e.elements.find(p=>p.payload.id===n);if(!a||a.kind!=="tap"||a.payload.attachedTo===void 0)return;let r=e.elements.find(p=>p.payload.id===a.payload.attachedTo);if(!r)return;let o=e.perFamily[t]?.placements[r.payload.id]?.frame??r.payload.frame,s=Lt(i.x),l=Lt(i.y),c=Lt(i.x+i.width),d=Lt(i.y+i.height),u={...i,x:s,y:l,width:Math.max(0,c-s),height:Math.max(0,d-l)};a.payload.outset=ym(o,u,ge[t])}function xm(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i)return;let a=e.perFamily[t];if(!a)return;let r=a.placements[n]?.frame??i.payload.frame,o=ge[t];return{width:r.width*o.width,height:r.height*o.height}}function ft(e,n){return e.elements.filter(t=>t.kind==="tap"&&t.payload.attachedTo===n)}function Re(e,n){return n.kind!=="tap"||n.payload.attachedTo===void 0?!1:e.elements.some(t=>t.payload.id===n.payload.attachedTo&&t.kind!=="tap")}function Aa(e,n){for(let t of e.elements)if(t.kind==="list"&&t.payload.template.some(i=>i.payload.id===n))return t}function Gs(e,n){let t=e.elements.find(i=>i.payload.id===n);if(!t)return Aa(e,n)?.payload.id;if(t.kind==="tap"&&t.payload.attachedTo!==void 0){let i=e.elements.find(a=>a.payload.id===t.payload.attachedTo);if(i)return i.payload.id}return t.payload.id}function Xn(e){let n=new Map(e.elements.map(a=>[a.payload.id,a])),t=new Map;for(let a of e.elements){if(a.kind!=="tap")continue;let r=a.payload.attachedTo;if(r===void 0)continue;let o=n.get(r);if(!o||o.kind==="tap"||r===a.payload.id){delete a.payload.attachedTo;continue}let s=t.get(r);s?s.push(a):t.set(r,[a])}if(t.size===0)return;for(let[a,r]of t){let o=n.get(a);for(let s of r){let l=s.payload;l.outset===void 0&&(l.outset=ym(o.payload.frame,l.frame,ge.rectangular));let c=l.outset,d=!As(c);s.payload.frame=of(o.payload.frame,c,ge.rectangular),s.payload.isHidden=o.payload.isHidden;let u=Vk(e,a);for(let p of ue){let f=e.perFamily[p];if(!f)continue;let g=ge[p],b=f.placements[a];p!==u||!b?delete f.placements[s.payload.id]:d?f.placements[s.payload.id]={frame:of(b.frame,c,g),isHidden:b.isHidden}:f.placements[s.payload.id]={frame:{...b.frame},isHidden:b.isHidden}}}}let i=[];for(let a of e.elements){if(a.kind==="tap"&&a.payload.attachedTo!==void 0)continue;i.push(a);let r=t.get(a.payload.id);r&&i.push(...r)}e.elements=i}function Bs(e,n,t){let i=e.elements.find(s=>s.payload.id===n);if(!i||i.kind==="tap")return;let a=ft(e,n)[0];if(a)return a.payload;let r=De("tap"),o=r.payload;return o.attachedTo=n,o.outset={...bc},o.action=t??Wc(e,i),e.elements.push(r),Xn(e),o}function Vs(e,n){let t=ft(e,n).map(i=>i.payload.id);if(t.length!==0){e.elements=e.elements.filter(i=>!t.includes(i.payload.id));for(let i of ue)for(let a of t)delete e.perFamily[i]?.placements[a]}}function Me(e,n){for(let a of qn(e,n))Me(e,a.payload.id);for(let a of Yn(e,n))Me(e,a.payload.id);for(let a of Oi(e,n))Me(e,a.payload.id);for(let a of zi(e,n))Me(e,a.payload.id);for(let a of Hs(e,n))Me(e,a.payload.id);for(let a of et(e,n))delete a.payload.chartAnchor;let t=e.elements.find(a=>a.payload.id===n);Vs(e,n),e.elements=e.elements.filter(a=>a.payload.id!==n);let i=t?.payload.chartAnchor;if(i&&(i.at==="threshold"||i.at==="now")&&!et(e,i.layer).some(a=>a.payload.chartAnchor?.at===i.at)){let a=e.elements.find(r=>r.payload.id===i.layer);a?.kind==="chart"&&(i.at==="threshold"?(delete a.payload.thresholdValue,delete a.payload.drawsThreshold):(delete a.payload.nowIndex,delete a.payload.drawsNowLine))}for(let a of e.elements)a.kind==="chart"&&a.payload.scaleFrom===n&&delete a.payload.scaleFrom;for(let a of ue)delete e.perFamily[a]?.placements[n];if(t?.kind==="list")for(let a of t.payload.template)for(let r of ue)delete e.perFamily[r]?.placements[a.payload.id];Xn(e),Dt(e),t&&Gk(e,t.payload.groupId,zk(t))}function zk(e){if(e.payload.chartAnchor)return e.payload.chartAnchor.layer;switch(e.kind){case"text":return e.payload.value.kind.kind==="chartStat"?e.payload.value.kind.layer:void 0;case"chartTimes":return e.payload.chart;case"chartDots":return e.payload.chart;case"chartGrid":return e.payload.chart;case"imageTime":return e.payload.image;default:return}}function Gk(e,n,t){if(n===void 0||t===void 0||!e.groups?.some(a=>a.id===n))return;let i=Rt(e,n);i.length===1&&i[0].payload.id===t&&Ea(e,n)}function vm(e,n){let t=e.elements.findIndex(l=>l.payload.id===n),i=e.elements[t];if(!i)return;let a=se(),r=structuredClone(i);r.payload.id=a,r.payload.frame={...r.payload.frame,x:Math.min(.9,r.payload.frame.x+.05),y:Math.min(.9,r.payload.frame.y+.05)};let o=[r],s=[[n,a]];for(let l of ft(e,n)){let c=structuredClone(l);c.payload.id=se(),c.payload.attachedTo=a,o.push(c),s.push([l.payload.id,c.payload.id])}e.elements.splice(t+1,0,...o);for(let l of ue){let c=e.perFamily[l];if(c)for(let[d,u]of s){let p=c.placements[d];p&&(c.placements[u]=structuredClone(p))}}return Xn(e),a}function Bk(e,n){let t=/^(.*\S) \d+$/.exec(e)?.[1]??e,i=new Set(n),a=2;for(;i.has(`${t} ${a}`);)a++;return`${t} ${a}`}function wm(e,n,t){let i=e.elements.findIndex(s=>s.payload.id===n),a=e.elements[i];if(!a||a.kind!=="chart")return;let r=se(),o=structuredClone(a);o.payload.id=r,o.payload.scaleFrom=n,t&&(o.payload.name=Bk(t(a),e.elements.map(t))),e.elements.splice(i+1,0,o);for(let s of ue){let l=e.perFamily[s],c=l?.placements[n];l&&c&&(l.placements[r]=structuredClone(c))}return r}function Cn(e,n,t){let i=new Set,a=d=>{i.add(d);for(let u of ft(e,d))i.add(u.payload.id)};for(let d of n){a(d);for(let u of qn(e,d))a(u.payload.id)}let r=e.elements.filter(d=>i.has(d.payload.id)).map(d=>structuredClone(d)),o=r.flatMap(d=>d.kind==="list"?[d.payload.id,...d.payload.template.map(u=>u.payload.id)]:[d.payload.id]),s={};for(let d of ue){let u=e.perFamily[d];if(!u)continue;let p={};for(let f of o){let g=u.placements[f];g&&(p[f]=structuredClone(g))}Object.keys(p).length>0&&(s[d]=p)}let l=new Set(r.map(d=>d.payload.groupId).filter(d=>d!==void 0)),c=(e.groups??[]).filter(d=>l.has(d.id)).map(d=>structuredClone(d));return{elements:r,placements:s,groups:c,...t!==void 0?{family:t}:{}}}function Us(e,n,t){let i=n.family,a=i!==void 0&&i!==t&&$i(i);if(!$i(t))return Ti(e,n);let r=Ti(e,n,a?{nudge:!1}:{}),o=e.perFamily[t]??(e.perFamily[t]=At());for(let s of r){let l=e.elements.find(p=>p.payload.id===s);if(!l)continue;let c=(i!==void 0?e.perFamily[i]?.placements[s]:void 0)??ue.map(p=>e.perFamily[p]?.placements[s]).find(p=>p!==void 0),d=c?.size??Ds(l),u={frame:{...c?.frame??l.payload.frame},isHidden:!1,...d!==void 0?{size:d}:{}};for(let p of ue)p!==t&&delete e.perFamily[p]?.placements[s];o.placements[s]=a?Os(u,i,t,l.kind):u}return Fa(e,t),r}function Ti(e,n,t={}){let i=new Map;for(let u of n.elements)if(i.set(u.payload.id,se()),u.kind==="list")for(let p of u.payload.template)i.set(p.payload.id,se());let a=new Set(e.elements.map(u=>u.payload.id)),r=t.nudge!==!1&&n.elements.some(u=>a.has(u.payload.id)),o=u=>r?{...u,x:Math.min(.9,u.x+.05),y:Math.min(.9,u.y+.05)}:u,s=[];for(let u of n.elements){let p=structuredClone(u);if(p.payload.id=i.get(u.payload.id),p.kind==="tap"&&p.payload.attachedTo!==void 0){let f=i.get(p.payload.attachedTo);f?p.payload.attachedTo=f:delete p.payload.attachedTo}if(p.kind==="chart"&&p.payload.scaleFrom!==void 0){let f=i.get(p.payload.scaleFrom);f?p.payload.scaleFrom=f:a.has(p.payload.scaleFrom)||delete p.payload.scaleFrom}if(p.kind==="text")for(let f of p.payload.parts??[]){let g=f.value.kind,b=g.kind==="chartStat"?i.get(g.layer):void 0;g.kind==="chartStat"&&b&&(g.layer=b)}if(p.kind==="text"&&p.payload.value.kind.kind==="chartStat"){let f=i.get(p.payload.value.kind.layer);if(f)p.payload.value.kind.layer=f;else if(!a.has(p.payload.value.kind.layer))continue}if(p.kind==="chartTimes"||p.kind==="chartDots"||p.kind==="chartGrid"){let f=i.get(p.payload.chart);if(f)p.payload.chart=f;else if(!a.has(p.payload.chart))continue}if(p.kind==="imageTime"){let f=i.get(p.payload.image);if(f)p.payload.image=f;else if(!a.has(p.payload.image))continue}if(p.payload.chartAnchor!==void 0){let f=i.get(p.payload.chartAnchor.layer);f?p.payload.chartAnchor.layer=f:a.has(p.payload.chartAnchor.layer)||delete p.payload.chartAnchor}if(p.kind==="list")for(let f of p.payload.template){let g=i.get(f.payload.id);g&&(f.payload.id=g)}p.payload.frame=o(p.payload.frame),s.push(p)}let l=new Map;for(let u of n.groups){if(s.filter(g=>g.payload.groupId===u.id&&!(g.kind==="tap"&&g.payload.attachedTo!==void 0)).length<2)continue;let f=se();l.set(u.id,f),(e.groups??=[]).push({...structuredClone(u),id:f})}for(let u of s){if(u.payload.groupId===void 0)continue;let p=l.get(u.payload.groupId);p?u.payload.groupId=p:delete u.payload.groupId}e.elements.push(...s);let c=new Set(s.map(u=>u.payload.id)),d=new Set(s.flatMap(u=>u.kind==="list"?u.payload.template.map(p=>p.payload.id):[]));for(let u of ue){let p=n.placements[u],f=e.perFamily[u];if(!(!p||!f))for(let[g,b]of Object.entries(p)){let y=i.get(g);y!==void 0&&(d.has(y)?f.placements[y]=structuredClone(b):c.has(y)&&(f.placements[y]={...structuredClone(b),frame:o(b.frame)}))}}return Xn(e),Dt(e),Ta(e),s.filter(u=>!Re(e,u)).map(u=>u.payload.id)}function km(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?!a.isHidden:!t.payload.isHidden}function Vk(e,n){let t=e.elements.find(r=>r.payload.id===n),a=(t&&t.kind==="tap"?t.payload.attachedTo:void 0)??n;return ue.find(r=>e.supportedFamilies.includes(r)&&e.perFamily[r]?.placements[a]!==void 0)}function Ft(e,n){let t=e.perFamily[n];return t?e.elements.filter(i=>{let a=i.kind==="tap"?i.payload.attachedTo:void 0;return t.placements[a??i.payload.id]!==void 0}):[]}function $m(e,n){let t=e.perFamily[n];return t?Ft(e,n).filter(i=>!Re(e,i)&&!t.placements[i.payload.id]?.isHidden).length:0}function Fa(e,n){let t=ue.filter(s=>e.supportedFamilies.includes(s));if(t.length===0)return;let i=n!==void 0&&$i(n)&&t.includes(n)?n:t[0];for(let s of t)e.perFamily[s]||(e.perFamily[s]=At());let a=()=>e.elements.filter(s=>!Re(e,s)),r=new Map,o=new Set;if(n===void 0){let s=new Map(a().map(p=>[p.payload.id,t.filter(f=>km(e,f,p))]));for(let[p,f]of s)f[0]&&r.set(p,f[0]);let l=new Map([...a().entries()].map(([p,f])=>[f.payload.id,p]));for(let p of t){let f=a().filter(y=>(s.get(y.payload.id)??[]).includes(p)&&r.get(y.payload.id)!==p).map(y=>y.payload.id);if(f.length===0)continue;let g=Cn(e,f,p),b=Ti(e,g,{nudge:!1});b.forEach((y,v)=>{r.set(y,p);let k=b.length===f.length?f[v]:void 0;l.set(y,k!==void 0?l.get(k)??0:l.size)})}for(let p of a())r.has(p.payload.id)||o.add(p.payload.id);let c=p=>t.indexOf(r.get(p)??i),d=a().sort((p,f)=>c(p.payload.id)-c(f.payload.id)||(l.get(p.payload.id)??0)-(l.get(f.payload.id)??0)),u=[];for(let p of d)u.push(p),u.push(...ft(e,p.payload.id));e.elements=u}for(let s of a()){let l=s.payload.id,c=t.filter(f=>e.perFamily[f].placements[l]!==void 0),d=r.get(l)??c.find(f=>!e.perFamily[f].placements[l].isHidden)??c[0]??i,u=e.perFamily[d]?.placements[l],p={frame:{...u?.frame??s.payload.frame},isHidden:o.has(l)||u?.isHidden===!0,...u?.size!==void 0?{size:u.size}:{}};s.payload.isHidden=!0;for(let f of ue){let g=e.perFamily[f];g&&(f===d?g.placements[l]=p:delete g.placements[l])}}}function Ks(e,n){let t=e.elements.find(r=>r.payload.id===n);if(!t)return[];let i=[],a=Bd(e,Ra(t));if(a){let r=t.kind==="icon"?"symbol":t.kind==="image"?"camera":"value";i.push(a.namedId===void 0?{where:r,ref:a.ref}:{where:r,ref:a.ref,namedId:a.namedId})}for(let r of ft(e,n)){let o=r.payload.action;!("entityId"in o)||o.entityId===""||i.push({where:"tap",ref:{entityId:o.entityId,displayName:o.displayName,domain:o.domain},tapId:r.payload.id})}for(let r of t.payload.rules)for(let o of r.cases)for(let s of o.when.tests){let l=Bd(e,s.value);if(!l)continue;let c={where:"test",ref:l.ref,ruleId:r.id,caseId:o.id,testId:s.id};l.namedId!==void 0&&(c.namedId=l.namedId),i.push(c)}return i}function Dd(e,n,t){if(!e)return;let i=e.kind;switch(i.kind){case"entityState":return{...e,kind:{kind:"entityState",...n}};case"entityAge":return{...e,kind:{kind:"entityAge",...n}};case"entityAttribute":return{...e,kind:{kind:"entityAttribute",...n,attribute:i.attribute}};case"literal":return t==="text"||t==="gauge"||t==="chart"||t==="timeline"?{...e,kind:{kind:"entityState",...n}}:void 0;default:return}}function Cm(e,n,t,i){let a=e.elements.find(o=>o.payload.id===n);if(!a||t.entityId==="")return;let r={...t,domain:t.domain||t.entityId.split(".")[0]||""};if(a.kind==="timeline"){let o=a.payload.value.kind.kind==="entityState"?a.payload.value.kind.entityId:void 0,s=Dd(a.payload.value,r,a.kind);s&&(a.payload.value=s),(a.payload.bands.length===0||o!==r.entityId)&&(a.payload.bands=a.payload.aggregate!==void 0?ha(Cs):ha(r.domain,i)),a.payload.aggregate!==void 0&&(a.payload.aggregate={...a.payload.aggregate,entities:a.payload.aggregate.entities.map((l,c)=>c===0?r.entityId:l)})}else if(a.kind==="image")a.payload.entity=r;else if(a.kind==="text"||a.kind==="gauge"||a.kind==="chart"){let o=Dd(a.payload.value,r,a.kind);o&&(a.payload.value=o)}else if(a.kind==="icon"){let o=Dd(a.payload.symbol,r,a.kind);o&&(a.payload.symbol=o)}for(let o of ft(e,n)){let s=o.payload;"entityId"in s.action&&(s.action={type:s.action.type,...r})}}var Uk={text:"text",icon:"icon",gauge:"gauge",chart:"chart",timeline:"timeline",shape:"shape",image:"picture",tap:"tap area",chartTimes:"clock times",chartDots:"chart dots",chartGrid:"chart grid",imageTime:"timestamp",list:"list"};function sf(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function lf(e){if(e.part==="template")return"Template text";if(e.part==="serviceData")return"Service data";let n=e.layerKind===void 0?"":Uk[e.layerKind],t=e.layerName?`${n} "${e.layerName}"`:n;if(e.part==="listSource")return`Items of ${t}`;if(e.part==="listRow")return t===""?"List row":`Row of ${t}`;switch(e.kind){case"named":return e.valueName?`Shared value "${e.valueName}"`:"Shared value";case"layer":case"image":return e.part==="total"?`Total on ${t}`:e.part==="gaugeMin"?`Min on ${t}`:e.part==="gaugeMax"?`Max on ${t}`:e.part==="nowIndex"?`Now marker on ${t}`:e.part==="level"?`Fill on ${t}`:e.part==="levelMin"?`Fill min on ${t}`:e.part==="levelMax"?`Fill max on ${t}`:e.part==="textPart"?`Part of ${t}`:e.part==="timelineGroup"?`Combined on ${t}`:`${sf(n)} layer${e.layerName?` "${e.layerName}"`:""}`;case"tap":return"Tap area";case"documentTap":return"Tap action";case"rule":return t===""?`Rule on the ${e.family??"shared"} shape`:`Rule on ${t}`;case"layout":{let i=sf(e.family??"");switch(e.part){case"curvedText":return`${i} curved text`;case"bezelGauge":return`${i} bezel gauge`;case"bezelGaugeMin":return`${i} bezel gauge low label`;case"bezelGaugeMax":return`${i} bezel gauge high label`;default:return`${i} bezel`}}case"inline":return"Inline";case"control":switch(e.part){case"controlValue":return"Control Center value line";case"controlState":return"Control Center state";case"controlStatus":return"Control Center status text";default:return"Control Center"}}}var Sm=/(['"])([a-z0-9_]+\.[a-z0-9_]+)\1/g,jc="{item.";function df(e){return e.startsWith(jc)}function qc(e){let n=[];for(let t of e.matchAll(Sm))t[2]!==void 0&&n.push(t[2]);return n}function Yc(e,n){return n.size===0?e:e.replace(Sm,(t,i,a)=>{let r=n.get(a);return r===void 0?t:`${i}${r}${i}`})}function pa(e){let n={entityId:e.entityId,displayName:e.displayName,domain:e.domain};return e.iconName!==void 0&&(n.iconName=e.iconName),n}function Kk(e,n){if(n.payload.name)return n.payload.name;if(n.kind==="shape")return n.payload.kind==="roundedRectangle"?"rounded rectangle":n.payload.kind;if(n.kind==="tap")return"";if(n.kind==="image")return n.payload.entity.displayName||n.payload.entity.entityId;let t=Ra(n)?.kind;if(t===void 0)return"";if(t.kind==="literal")return t.value;if("entityId"in t)return t.displayName||t.entityId;if(t.kind==="named"){let i=t.id.toUpperCase();return e.values.find(a=>a.id.toUpperCase()===i)?.name??""}return""}function Ei(e,n){let t=(l,c)=>{n.value?.(l,c);let d=l.kind;if(d.kind==="jinja"){if(n.text){let p=n.text(d.value,{...c,part:"template"});p!==d.value&&(d.value=p)}return}if(d.kind==="aggregate"){let p=d.aggregate.scope;if(n.ref&&p.kind==="entities")for(let f=0;f<p.entities.length;f++){let g=n.ref(pa(p.entities[f]),c);g&&(p.entities[f]=g)}return}if(!n.ref||!("entityId"in d))return;let u=n.ref(pa(d),c);u&&(d.kind==="entityAttribute"?l.kind={kind:"entityAttribute",...u,attribute:d.attribute}:d.kind==="entityState"?l.kind={kind:"entityState",...u}:l.kind={kind:"entityAge",...u})},i=(l,c,d)=>{if(l.type==="callService"){if(n.ref&&l.target!==void 0&&!df(l.target.entityId)&&l.target.entityId!==""){let p=n.ref(pa(l.target),c);p&&(l.target=p)}if(n.text&&l.serviceDataJSON!==void 0){let p=n.text(l.serviceDataJSON,{...c,part:"serviceData"});p!==l.serviceDataJSON&&(l.serviceDataJSON=p)}return}if(!n.ref||!("entityId"in l)||l.entityId===""||df(l.entityId))return;let u=n.ref(pa(l),c);u&&d({type:l.type,...u})};for(let l of e.values)t(l.value,{kind:"named",valueId:l.id,valueName:l.name});let a=(l,c)=>{if(l.kind==="image"){if(n.ref){let u=n.ref(pa(l.payload.entity),{...c,kind:"image"});u&&(l.payload.entity=u)}}else if(l.kind==="tap"){let u=l.payload;i(u.action,{...c,kind:"tap"},p=>{u.action=p})}else{let u=Ra(l);if(u&&t(u,c),l.kind==="text")for(let p of l.payload.parts??[])t(p.value,{...c,part:"textPart"});if(l.kind==="gauge"&&l.payload.total&&t(l.payload.total,{...c,part:"total"}),l.kind==="gauge"&&l.payload.minSource&&t(l.payload.minSource,{...c,part:"gaugeMin"}),l.kind==="gauge"&&l.payload.maxSource&&t(l.payload.maxSource,{...c,part:"gaugeMax"}),l.kind==="chart"&&l.payload.nowIndex&&t(l.payload.nowIndex,{...c,part:"nowIndex"}),l.kind==="icon"||l.kind==="shape"){let p=l.payload.level;p&&(t(p.value,{...c,part:"level"}),p.minSource&&t(p.minSource,{...c,part:"levelMin"}),p.maxSource&&t(p.maxSource,{...c,part:"levelMax"}))}if(l.kind==="timeline"&&n.ref&&l.payload.aggregate!==void 0){let p=l.payload.aggregate.entities;for(let f=0;f<p.length;f++){let g=p[f]??"";if(g==="")continue;let b=n.ref({entityId:g,displayName:"",domain:g.split(".")[0]??""},{...c,part:"timelineGroup"});b&&(p[f]=b.entityId)}}if(l.kind==="list"){r(l.payload.source,{...c,part:"listSource"});let p={...c,part:"listRow"};for(let f of l.payload.template)a(f,p)}}let d={...c,kind:"rule"};for(let u of fr(l.payload.rules))t(u,d)},r=(l,c)=>{if(l.kind==="template"){if(n.text){let u=n.text(l.value,{...c,part:"template"});u!==l.value&&(l.value=u)}return}if(!n.ref)return;let d=(u,p)=>{if(u.entityId==="")return;let f=n.ref(pa(u),c);f&&p(f)};switch(l.kind){case"entities":if(l.scope.kind==="entities"){let u=l.scope.entities;for(let p=0;p<u.length;p++)d(u[p],f=>{u[p]=f})}return;case"calendar":case"todo":{let u=l.entities;for(let p=0;p<u.length;p++)d(u[p],f=>{u[p]=f});return}case"attribute":case"forecast":d(l,u=>{l.entityId=u.entityId,l.displayName=u.displayName,l.domain=u.domain,u.iconName!==void 0?l.iconName=u.iconName:delete l.iconName});return}};for(let l of e.elements)a(l,{kind:"layer",layerId:l.payload.id,layerKind:l.kind,layerName:Kk(e,l)});let o=Object.keys(e.perFamily).sort((l,c)=>{let d=or.indexOf(l),u=or.indexOf(c);return(d<0?or.length:d)-(u<0?or.length:u)});for(let l of o){let c=e.perFamily[l];if(!c)continue;let d={kind:"layout",family:l};c.bezelText&&t(c.bezelText,{...d,part:"bezelText"}),c.curvedText&&t(c.curvedText,{...d,part:"curvedText"});let u=c.bezelGauge;u&&(t(u.value,{...d,part:"bezelGauge"}),u.minLabel&&t(u.minLabel,{...d,part:"bezelGaugeMin"}),u.maxLabel&&t(u.maxLabel,{...d,part:"bezelGaugeMax"}));let p={kind:"rule",family:l};for(let f of fr(c.rules))t(f,p)}e.inline&&t(e.inline.value,{kind:"inline"});let s=e.control;if(s){let l={kind:"control"};t(s.title,l),s.valueLabel&&t(s.valueLabel,{...l,part:"controlValue"}),s.state&&t(s.state,{...l,part:"controlState"}),s.status&&t(s.status,{...l,part:"controlStatus"}),i(s.action,l,c=>{s.action=c})}i(e.tapAction,{kind:"documentTap"},l=>{e.tapAction=l})}function mt(e,n){Ei(e,{value:n})}function Tm(e,n){return e.kind.kind==="named"&&e.kind.id.toUpperCase()===n.toUpperCase()}function Vr(e,n){let t=new Set;return mt(e,(i,a)=>{Tm(i,n)&&t.add(a.layerId??`${a.kind}:${a.valueId??""}:${a.family??""}:${a.part??""}`)}),t.size}function Wk(e,n){let t=new Set(e.values.map(a=>a.name.trim().toLowerCase())),i=n.trim()||"Value";if(!t.has(i.toLowerCase()))return i;for(let a=2;;a++){let r=`${i} ${a}`;if(!t.has(r.toLowerCase()))return r}}function Xc(e,n,t){let i={id:se(),name:Wk(e,t),value:{kind:structuredClone(n.kind)}},a={kind:{kind:"named",id:i.id}};return n.format&&!Xe(n.format)&&(a.format=structuredClone(n.format)),{named:i,ref:a}}function Jc(e,n){if(n.kind.kind!=="named")return;let t=n.kind.id,i=e.values.find(o=>o.id.toUpperCase()===t.toUpperCase());if(!i)return;let a=n.format&&!Xe(n.format)?n.format:i.value.format,r={kind:structuredClone(i.value.kind)};return a&&!Xe(a)&&(r.format=structuredClone(a)),r}function Zc(e,n){mt(e,t=>{if(!Tm(t,n))return;let i=Jc(e,t);i&&(t.kind=i.kind,i.format?t.format=i.format:delete t.format)}),e.values=e.values.filter(t=>t.id.toUpperCase()!==n.toUpperCase())}function Qc(e,n){Ei(e,{ref:n})}function Ma(e,n){Ei(e,{text:n})}function eu(e,n){let t=[],i={ref:(a,r)=>{a.entityId!==""&&t.push({entityId:a.entityId,ref:a,where:lf(r)})}};return n&&(i.text=(a,r)=>{for(let o of qc(a)){let s=o.split(".")[0]??"";n(o,s)&&t.push({entityId:o,ref:{entityId:o,displayName:"",domain:s},where:lf(r)})}return a}),Ei(e,i),t}function Em(e,n,t){let i=p=>{switch(p.kind){case"control":return n.kind==="control";case"layer":case"image":case"tap":{if(n.kind!=="family")return!1;let f=e.elements.find(b=>b.payload.id===p.layerId);if(!f)return!1;let g=f.kind==="tap"&&f.payload.attachedTo!==void 0?e.elements.find(b=>b.payload.id===f.payload.attachedTo)??f:f;return km(e,n.family,g)}case"layout":case"rule":return n.kind==="family"&&p.family===n.family;case"documentTap":case"inline":return n.kind==="family";case"named":return!1}},a=new Set,r={value:(p,f)=>{p.kind.kind==="named"&&(i(f)||f.kind==="named"&&f.valueId!==void 0&&a.has(f.valueId))&&a.add(p.kind.id)}},o=-1;for(let p=0;p<4&&o!==a.size;p++)o=a.size,Ei(e,r);let s=p=>i(p)||p.kind==="named"&&p.valueId!==void 0&&a.has(p.valueId),l=[],c=new Set,d=p=>{p===""||c.has(p)||(c.add(p),l.push(p))},u={ref:(p,f)=>{s(f)&&d(p.entityId)}};return t&&(u.text=(p,f)=>{if(s(f))for(let g of qc(p))t(g,g.split(".")[0]??"")&&d(g);return p}),Ei(e,u),{entityIds:l,namedIds:[...a]}}function tu(e,n,t){let i=new Set,a=new Set,r=s=>{s.kind==="named"&&s.valueId!==void 0?a.add(s.valueId.toUpperCase()):s.layerId!==void 0&&i.add(s.layerId)},o={ref:(s,l)=>{s.entityId===n&&r(l)}};t&&(o.text=(s,l)=>{for(let c of qc(s))c===n&&t(c,c.split(".")[0]??"")&&r(l);return s}),Ei(e,o);for(let s=a.size>0;s;)s=!1,mt(e,(l,c)=>{if(!(l.kind.kind!=="named"||!a.has(l.kind.id.toUpperCase())))if(c.kind==="named"&&c.valueId!==void 0){let d=c.valueId.toUpperCase();a.has(d)||(a.add(d),s=!0)}else c.layerId!==void 0&&i.add(c.layerId)});return Am(e,i)}function Rm(e,n){let t=new Set([n.toUpperCase()]),i=new Set;for(let a=!0;a;)a=!1,mt(e,(r,o)=>{if(!(r.kind.kind!=="named"||!t.has(r.kind.id.toUpperCase())))if(o.kind==="named"&&o.valueId!==void 0){let s=o.valueId.toUpperCase();t.has(s)||(t.add(s),a=!0)}else o.layerId!==void 0&&i.add(o.layerId)});return Am(e,i)}function Am(e,n){let t=new Set;for(let i of e.elements)n.has(i.payload.id)&&t.add(Re(e,i)&&i.kind==="tap"?i.payload.attachedTo:i.payload.id);return e.elements.map(i=>i.payload.id).filter(i=>t.has(i))}var Ur={text:["color","opacity","text","fontSize","fontWeight","fontDesign","fontWidth","italic","rotation","visibility"],icon:["color","opacity","icon","fontSize","rotation","visibility"],gauge:["color","opacity","gaugeValue","gaugeMin","gaugeMax","rotation","visibility"],chart:["color","opacity","rotation","visibility"],timeline:["opacity","rotation","visibility"],shape:["color","opacity","borderColor","borderWidth","rotation","visibility"],image:["opacity","rotation","visibility"],tap:["visibility"],chartTimes:["opacity","rotation","visibility"],chartDots:["opacity","visibility"],chartGrid:["opacity","visibility"],imageTime:["opacity","rotation","visibility"],list:["opacity","rotation","visibility"],layout:["backgroundColor","borderColor","borderWidth","text"]},Fm=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","greaterThan","greaterOrEqual","lessThan","lessOrEqual","between","timeBetween","contains","startsWith","endsWith","matchesRegex","isOneOf"];function Gi(e){let n=e.trim();return/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(n)?n:void 0}function Bi(e){switch(e){case"isOn":case"isOff":case"isUnavailable":case"isStale":case"isEmpty":return"none";case"between":return"between";case"timeBetween":return"times";case"matchesRegex":return"pattern";case"isOneOf":return"options";default:return"value"}}function Ws(e){switch(e){case"hide":case"show":return"none";case"setFontWeight":return"weight";case"setFontDesign":return"design";case"setFontWidth":return"width";case"setItalic":return"italic";case"setOpacity":case"setFontSize":case"setRotation":case"setGaugeMin":case"setGaugeMax":case"setBorderWidth":return"number";default:return"value"}}function nu(){return{id:se(),value:U(""),comparison:{kind:"isOn"}}}function iu(){return{id:se(),when:{join:"all",tests:[nu()]},then:[]}}function La(){return{id:se(),cases:[iu()]}}function cf(e,n){return e&&(e.kind.kind!=="literal"||Gi(e.kind.value)!==void 0)?e:U(n)}function au(e,n){let t={kind:n};switch(Bi(n)){case"value":t.value=e.value??U("");break;case"between":t.value=e.value??U(""),t.upper=e.upper??U("");break;case"times":t.value=cf(e.value,"22:00"),t.upper=cf(e.upper,"06:00");break;case"pattern":t.pattern=e.pattern??"";break;case"options":t.options=e.options??[];break;case"none":break}return t}function Jn(e){let n={kind:e};switch(Ws(e)){case"value":n.value=U(e==="setColor"||e==="setBorderColor"||e==="setBackgroundColor"?"#FF453A":e==="setIcon"?"exclamationmark.triangle":e==="setGaugeValue"?"50":"Text");break;case"number":n.number=e==="setOpacity"?.5:e==="setFontSize"?14:e==="setBorderWidth"?2:e==="setGaugeMax"?100:0;break;case"weight":n.weight="bold";break;case"design":n.design="rounded";break;case"width":n.width="condensed";break;case"italic":n.italic=!0;break;case"none":break}return n}function js(e){let n=new TextEncoder().encode(e),t=0xcbf29ce484222325n,i=0x100000001b3n,a=0xffffffffffffffffn;for(let r of n)t^=BigInt(r),t=t*i&a;return t.toString(16)}function Lm(e){return new Map(e.map(n=>[n.id.toUpperCase(),n.value]))}function Mm(e){return e.kind==="entityAttribute"||e.kind==="entityAge"||e.kind==="aggregate"||e.kind==="time"||e.kind==="jinja"}function Ia(e,n,t=0){let i=n instanceof Map?n:Lm(n),a=e.kind;if(a.kind==="named"){if(t>8)return;let o=i.get(a.id.toUpperCase());return o?o.kind.kind==="named"?Ia(o,i,t+1):Mm(o.kind)?"n_"+a.id.toLowerCase().replace(/-/g,""):void 0:void 0}if(!Mm(a))return;let r=Kr(a);if(r!==void 0)return"e_"+js(r)}function it(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function Im(e){let n;if(e.scope.kind==="entities")n=`expand([${e.scope.entities.map(t=>it(t.entityId)).join(", ")}])`;else{let{domains:t,areaIds:i,labelIds:a,floorIds:r}=e.scope;if(!(i.length+a.length+r.length>0))n=t.length===0?"[]":"("+t.map(s=>`(states.${s} | list)`).join(" + ")+")";else{let s=[];for(let l of i)s.push(`area_entities(${it(l)})`);for(let l of a)s.push(`label_entities(${it(l)})`);r.length>0&&s.push(`((${r.map(l=>`floor_areas(${it(l)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`),n=`(expand(${s.join(" + ")})`,t.length>0&&(n+=` | selectattr('domain', 'in', [${t.map(it).join(", ")}])`),n+=")"}}return n}function Hm(e){return e?e.kind==="isOn"?" | selectattr('state', 'eq', 'on')":e.kind==="isOff"?" | selectattr('state', 'eq', 'off')":e.kind==="equals"?` | selectattr('state', 'eq', ${it(e.value)})`:` | rejectattr('state', 'eq', ${it(e.value)})`:""}function jk(e){let n=Im(e)+Hm(e.stateFilter);if(e.function==="count")return`(${n} | list | count)`;let t=e.attribute?`attributes.${e.attribute}`:"state",i=`${n} | map(attribute=${it(t)}) | map('float', 0) | list`;switch(e.function){case"sum":return`(${i} | sum)`;case"average":return`(${i} | average(0))`;case"min":return`(${i} | min(default=0))`;case"max":return`(${i} | max(default=0))`}}var qk=" | rejectattr('state', 'in', ['unavailable', 'unknown'])";function _m(e,n){let t=nt(n);switch(e.kind){case"entities":{let i=e.stateFilter,a=i?.kind==="equals"&&(i.value==="unavailable"||i.value==="unknown"),r=(e.deviceClass??"").trim(),o=r===""?"":` | selectattr('attributes.device_class', 'eq', ${it(r)})`,s=`(${Im(e)})${a?"":qk}${o}${Hm(i)}`,l=e.attributes.map(u=>`, 'attr.${u}': s.attributes.get(${it(u)})`).join(""),c=e.descending?"true":"false",d=e.sort==="state"?`((ns.items | rejectattr('n', 'none') | sort(attribute='n', reverse=${c}) | list) + (ns.items | selectattr('n', 'none') | sort(attribute='state', reverse=${c}) | list))`:`(ns.items | sort(attribute='${e.sort==="lastChanged"?"lastChanged":"name"}', reverse=${c}) | list)`;return`{% set ns = namespace(items=[]) %}{% for s in ${s} %}{% set ns.items = ns.items + [{'entityId': s.entity_id, 'name': s.name[:120], 'state': s.state[:120], 'unit': s.attributes.get('unit_of_measurement'), 'domain': s.domain, 'deviceClass': s.attributes.get('device_class'), 'area': area_name(s.entity_id), 'lastChanged': (as_timestamp(s.last_changed) | round(0)), 'n': (s.state | float(none))${l}}] %}{% endfor %}{% set sorted = ${d} %}{{ {'items': sorted[:${t}], 'total': (sorted | count)} | to_json }}`}case"attribute":return`{% set a = state_attr(${it(e.entityId)}, ${it(e.attribute)}) %}{% if a is string or a is mapping or a is not iterable %}{% set a = [] %}{% endif %}{% set a = a | list %}{{ {'items': a[:${t}], 'total': (a | count)} | to_json }}`;case"template":{let i=e.value.trim();return i.length===0?void 0:i}default:return}}function Zn(e,n){let t=_m(e,n);return t===void 0?void 0:"e_"+js(t)}function Sn(e){let n=t=>t.map(i=>i.entityId).filter(i=>i!=="");switch(e.kind){case"calendar":{let t=n(e.entities);return t.length===0?void 0:`calendar|${t.join(",")}|${e.hours}`}case"todo":{let t=n(e.entities);return t.length===0?void 0:`todo|${t.join(",")}|${e.status}|${e.sort}`}case"forecast":return e.entityId===""?void 0:`forecast|${e.entityId}|${e.type}`;default:return}}function Yk(e,n){let t=nt(n),i=a=>a.map(r=>r.entityId).filter(r=>r!=="");switch(e.kind){case"calendar":{let a=i(e.entities);return a.length===0?void 0:{source:"calendar",entities:a,hours:e.hours,limit:t}}case"todo":{let a=i(e.entities);return a.length===0?void 0:{source:"todo",entities:a,status:e.status,sort:e.sort,limit:t}}case"forecast":return e.entityId===""?void 0:{source:"forecast",entity_id:e.entityId,type:e.type,limit:t};default:return}}function Xk(e){let n=[];for(let t of e.elements)t.kind==="list"&&n.push(t.payload);return n}function ru(e){let n=new Map;for(let t of Xk(e)){let i=Sn(t.source),a=Yk(t.source,t.rows);if(i===void 0||a===void 0)continue;let r=n.get(i);r===void 0?n.set(i,a):a.limit>r.limit&&n.set(i,{...r,limit:a.limit})}return new Map([...n.entries()].sort(([t],[i])=>t<i?-1:t>i?1:0))}function Kr(e){switch(e.kind){case"entityAttribute":return`state_attr(${it(e.entityId)}, ${it(e.attribute)})`;case"entityAge":{let n=it(e.entityId);return`(((now() - states[${n}].last_changed).total_seconds() if states[${n}] is not none else 0) | round(0))`}case"time":switch(e.timeField){case"now":return"now().strftime('%H:%M')";case"hour":return"now().hour";case"minute":return"now().minute";case"day":return"now().day";case"month":return"now().month";case"weekday":return"now().weekday()";case"timestamp":return"(as_timestamp(now()) | round(0))"}return;case"jinja":return e.value.trim().length===0?void 0:e.value;case"aggregate":return jk(e.aggregate);default:return}}function Vi(e){let n=new Map,t=new Map,i=Lm(e.values),a=(l,c=0)=>{let d=l.kind;switch(d.kind){case"literal":case"dataAge":case"chartStat":case"item":case"listStat":return;case"entityState":n.set(d.entityId,d);return;case"named":{if(c>8)return;let u=i.get(d.id.toUpperCase());if(!u)return;if(u.kind.kind==="named"){a(u,c+1);return}if(u.kind.kind==="entityState"){n.set(u.kind.entityId,u.kind);return}let p=Kr(u.kind);if(p===void 0)return;t.set("n_"+d.id.toLowerCase().replace(/-/g,""),p);return}default:{let u=Kr(d);if(u===void 0)return;t.set("e_"+js(u),u)}}},r=l=>{let c=Ra(l);if(c&&a(c),l.kind==="text")for(let d of l.payload.parts??[])a(d.value);if(l.kind==="gauge"&&l.payload.total&&a(l.payload.total),l.kind==="gauge"&&l.payload.minSource&&a(l.payload.minSource),l.kind==="gauge"&&l.payload.maxSource&&a(l.payload.maxSource),l.kind==="chart"&&l.payload.nowIndex&&a(l.payload.nowIndex),l.kind==="icon"||l.kind==="shape"){let d=l.payload.level;d&&(a(d.value),d.minSource&&a(d.minSource),d.maxSource&&a(d.maxSource))}if(l.kind==="list"){let d=_m(l.payload.source,l.payload.rows);d!==void 0&&t.set("e_"+js(d),d);for(let u of l.payload.template)r(u)}for(let d of fr(l.payload.rules))a(d)};for(let l of e.values)a({kind:{kind:"named",id:l.id}});for(let l of e.elements)r(l);for(let l of ue){if(!e.supportedFamilies.includes(l))continue;let c=e.perFamily[l];if(c){c.bezelText&&a(c.bezelText),c.curvedText&&a(c.curvedText),c.bezelGauge&&(a(c.bezelGauge.value),c.bezelGauge.minLabel&&a(c.bezelGauge.minLabel),c.bezelGauge.maxLabel&&a(c.bezelGauge.maxLabel));for(let d of fr(c.rules))a(d)}}e.supportedFamilies.includes("inline")&&e.inline&&a(e.inline.value);let o=e.control;o&&(a(o.title),o.valueLabel&&a(o.valueLabel),o.state&&a(o.state),o.status&&a(o.status));let s={entities:n,expressions:t};return t.size>0&&(s.document=Jk(t)),s}function Jk(e){let n=[...e.keys()].sort(),t=[];for(let a of n){let r=e.get(a);r.includes("{{")||r.includes("{%")?t.push(`{% set v_${a} %}${r}{% endset %}`):t.push(`{% set v_${a} = ${r} %}`)}let i=n.map(a=>`"${a}": v_${a}`).join(", ");return t.push(`{{ { ${i} } | to_json }}`),t.join(`
`)}function Pm(e){let n;try{n=JSON.parse(e)}catch{return}if(typeof n!="object"||n===null||Array.isArray(n))return;let t=new Map,i=new Set;for(let[a,r]of Object.entries(n))r===null?i.add(a):t.set(a,ou(r));return{values:t,nullKeys:i}}function ou(e){return typeof e=="string"?e:typeof e=="boolean"?e?"true":"false":typeof e=="number"?(Number.isInteger(e)&&Math.abs(e)<1e15,String(e)):JSON.stringify(e)}function su(e){let n=Vi(e),t=[...n.entities.entries()].sort(([i],[a])=>i<a?-1:i>a?1:0).map(([,i])=>({kind:"entity",entityId:i.entityId,displayName:i.displayName,domain:i.domain,...i.iconName!==void 0?{iconName:i.iconName}:{}}));n.document&&t.push({kind:"template",value:n.document});for(let i of ru(e).values())t.push({kind:"list",...i});return t}var Ue="wrist_assistant/complications";async function Nm(e){return e.connection.sendMessagePromise({type:"wrist_assistant/gallery_key"})}async function Dm(e){return e.connection.sendMessagePromise({type:`${Ue}/parts_list`})}async function lu(e,n,t,i){let a={type:`${Ue}/parts_save`,name:n,text:t};return i!==void 0&&(a.part_id=i),e.connection.sendMessagePromise(a)}async function Om(e,n){return e.connection.sendMessagePromise({type:`${Ue}/parts_delete`,part_id:n})}async function zm(e){return e.connection.sendMessagePromise({type:`${Ue}/owners`})}async function Gm(e,n){return e.connection.sendMessagePromise({type:`${Ue}/list`,owner_watch_id:n})}async function Bm(e,n){return e.connection.sendMessagePromise({type:`${Ue}/nudge`,owner_watch_id:n})}async function Vm(e,n){return e.connection.sendMessagePromise({type:`${Ue}/watch_status`,owner_watch_id:n})}async function du(e,n,t,i){return e.connection.sendMessagePromise({type:`${Ue}/save`,owner_watch_id:n,document:t,base_revision:i})}async function Um(e,n,t,i){return e.connection.sendMessagePromise({type:`${Ue}/delete`,owner_watch_id:n,complication_id:t,base_revision:i})}async function Km(e,n,t){return e.connection.sendMessagePromise({type:`${Ue}/history`,owner_watch_id:n,complication_id:t})}async function Wm(e,n,t,i){return e.connection.sendMessagePromise({type:`${Ue}/history_get`,owner_watch_id:n,complication_id:t,revision:i})}async function jm(e,n,t,i,a){return e.connection.sendMessagePromise({type:`${Ue}/history_restore`,owner_watch_id:n,complication_id:t,revision:i,base_revision:a})}async function qm(e,n,t){return e.connection.sendMessagePromise({type:`${Ue}/move_owner`,source_owner_watch_id:n,target_owner_watch_id:t})}function Ym(e,n,t){let i={type:`${Ue}/subscribe`};return n&&(i.owner_watch_id=n),e.connection.subscribeMessage(t,i)}async function Xm(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${Ue}/render_values`,templates:n})).results}async function Jm(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${Ue}/history_series`,requests:n})).results}function Zk(e){return{entity_id:e.entityId,minutes:e.minutes,points:e.points,...e.mode==="states"?{mode:"states"}:{},...e.gaps?{gaps:!0}:{},...e.entities!==void 0&&e.entities.length>0?{entities:[...e.entities],combine:e.combine??"any"}:{}}}function Qk(e){return{entity_id:e.entityId,minutes:e.minutes,period:e.period,type:e.type,...e.gaps?{gaps:!0}:{}}}function Zm(e){let n=new Map,t=new Map;for(let[i,a]of Object.entries(e))a.ok&&(n.set(i,a.series),typeof a.readings=="number"&&t.set(i,{readings:a.readings,averaged:a.averaged===!0}));return{series:n,readings:t}}async function Qm(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${Ue}/statistics_series`,requests:n})).results}async function eg(e,n){return Object.keys(n).length===0?{}:(await e.connection.sendMessagePromise({type:`${Ue}/list_items`,requests:n})).results}function tg(e){let n={};for(let[t,i]of ru(e))n[t]=i;return{requests:n,signature:JSON.stringify(n)}}function ng(e){let n=new Map;for(let[t,i]of Object.entries(e))i.ok&&n.set(t,JSON.stringify({items:i.items,total:i.total}));return n}function cu(e,n=()=>!0){let t={};for(let a of fc(e))n(a.entityId)&&(t[a.key]=Zk(a));let i={};for(let a of mc(e))n(a.entityId)&&(i[a.key]=Qk(a));return{history:t,statistics:i,signature:JSON.stringify([t,i])}}var qs="shared:";function uu(e){return qs+e.toUpperCase()}function ag(e){return e.values.filter(n=>n.value.kind.kind!=="entityState"&&Vr(e,n.id)>0)}function rg(e,n){return n.size===0?e:e.map(t=>{let i=n.get(uu(t.id));if(i===void 0)return t;let a={kind:{kind:"literal",value:i}};return t.value.format&&(a.format=t.value.format),{...t,value:a}})}var e$=["unavailable","unknown"],t$={automation:["on","off"],script:["on","off"],remote:["on","off"],update:["on","off"],timer:["idle","active","paused"],sun:["above_horizon","below_horizon"],valve:["open","closed","opening","closing"],lawn_mower:["mowing","docked","paused","returning","error"],weather:["sunny","clear-night","partlycloudy","cloudy","rainy","pouring","snowy","snowy-rainy","fog","windy","windy-variant","lightning","lightning-rainy","hail","exceptional"]},n$=new Set(["\xB0C","\xB0F"]);function ig(e){return Array.isArray(e)&&e.length>0&&e.every(n=>typeof n=="string")?e:void 0}function Wr(e){let n=typeof e=="number"?e:typeof e=="string"&&e.trim()!==""?Number(e):NaN;return Number.isFinite(n)?n:void 0}function i$(e){let n=e?.trim().match(/\.(\d+)$/)?.[1]?.length??0;return n===0?1:10**-Math.min(n,4)}function a$(e){let n=10**Math.floor(Math.log10(e));return([1,2,2.5,5,10].find(i=>i*n>=e)??10)*n}function r$(e){let n=new Set,t=[];for(let i of e)i===void 0||i===""||n.has(i)||(n.add(i),t.push(i));return t}function og(e,n,t){let i=e.split(".")[0]??"",a=n?.attributes??{},o=ig(a.options)??(i==="climate"?ig(a.hvac_modes):void 0)??wa[i]??t$[i];if(o)return{kind:"choice",options:r$([...o,n?.state,t,...e$])};let s=Wr(n?.state),l=typeof a.unit_of_measurement=="string"?a.unit_of_measurement:void 0;if(s===void 0&&l===void 0&&i!=="input_number"&&i!=="number")return{kind:"text"};let c=Wr(t),d=Wr(a.min),u=Wr(a.max),p=Wr(a.step),f,g;if(d!==void 0&&u!==void 0&&u>d)f=d,g=u;else if(l==="%")f=0,g=100;else{let y=a$(Math.max(Math.abs(s??0)*2,10));f=(s??0)<0||l!==void 0&&n$.has(l)?-y:0,g=y}c!==void 0&&(f=Math.min(f,c),g=Math.max(g,c));let b=p!==void 0&&p>0?p:i$(n?.state);return{kind:"number",min:f,max:g,step:b}}function sg(e){return e==="iphone"?2e4:1e4}function lg(e){if(e.deviceKind==="iphone")return o$(e);if(e.appliedToken===void 0)return{kind:"unsupported"};if(e.token===e.appliedToken){let n=!e.polling&&typeof e.lastPollSeconds=="number"?e.lastPollSeconds:void 0;return n===void 0?{kind:"sent"}:{kind:"sent",awaySeconds:n}}return e.pending&&e.polling?{kind:"sending"}:e.polling?{kind:"waiting"}:{kind:"offline"}}function o$(e){let n=e.appliedToken!==void 0&&e.token===e.appliedToken;if(!e.pushAvailable){if(!n)return{kind:"openApp"};let t=typeof e.lastSyncSeconds=="number"?e.lastSyncSeconds:void 0;return t===void 0?{kind:"sent",device:"iphone"}:{kind:"sent",awaySeconds:t,device:"iphone"}}if(n){let t=typeof e.lastSyncSeconds=="number"?e.lastSyncSeconds:void 0;return t===void 0?{kind:"sent",device:"iphone",push:!0}:{kind:"sent",awaySeconds:t,device:"iphone",push:!0}}return e.pending?{kind:"sending",device:"iphone"}:{kind:"waiting",device:"iphone"}}function Ys(e){if(e<60)return"just now";let n=Math.floor(e/60);if(n<60)return`${n} min ago`;let t=Math.floor(n/60);if(t<24)return`${t} h ago`;let i=Math.floor(t/24);return`${i} ${i===1?"day":"days"} ago`}function dg(e){switch(e.kind){case"unsupported":return{label:"Update the watch app",note:"to receive this",title:"This watch has never reported which changes it applied, so nothing saved here can reach it. Its Wrist Assistant app is older than custom complications, or it has not been opened on this home yet.",resend:!1,refresh:!1};case"sent":if(e.device==="iphone"){let n=e.push===!0;return e.awaySeconds===void 0?{label:"On iPhone",title:n?"This iPhone has applied every change here. A save sends it a push and it syncs in the background. iOS redraws the widget when it allows: opening the app or tapping the widget redraws it at once.":"This iPhone has applied every change here.",resend:!1,refresh:n}:{label:"On iPhone",note:`last sync ${Ys(e.awaySeconds)}`,title:n?"This iPhone has applied every change here, as of its last sync. A save sends it a push and it syncs in the background. iOS redraws the widget when it allows: opening the app or tapping the widget redraws it at once.":"This iPhone has applied every change here, as of its last sync. A save made after this reaches the lock screen when the app is opened, or on the widget's own refresh.",resend:!1,refresh:n}}return e.awaySeconds===void 0?{label:"On watch",title:"The watch has applied every change here.",resend:!1,refresh:!1}:{label:"On watch",note:`last seen ${Ys(e.awaySeconds)}`,title:"The watch has applied every change here, but it is not listening now. A save made after this will not reach it until the watch app is open on this home again.",resend:!1,refresh:!1};case"openApp":return{label:"Open Wrist Assistant on your iPhone to sync",title:"This iPhone has no push token yet. Open Wrist Assistant on it once.",resend:!1,refresh:!1};case"sending":return e.device==="iphone"?{label:"Sending to the phone",title:"The push is on its way. The iPhone pulls in the background and confirms. The widget itself redraws when iOS allows, or at once when the app is opened or the widget is tapped.",resend:!1,refresh:!1}:{label:"Sending\u2026",title:"Waiting for the watch to pull and confirm.",resend:!1,refresh:!1};case"waiting":return e.device==="iphone"?{label:"Sent to the phone, waiting for it to sync",title:"The push has gone out, and the iPhone has not confirmed the latest change yet. Refresh now sends it another.",resend:!1,refresh:!0}:{label:"Not on watch yet",title:"The watch is connected but has not confirmed the latest change. Resend wakes it again.",resend:!0,refresh:!1};case"offline":return{label:"Open the watch app to sync",title:"Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",resend:!0,refresh:!1}}}var cg="questionmark.circle.fill",ug="calendar",pg="checklist",s$={sunny:"sun.max.fill","clear-night":"moon.stars.fill",partlycloudy:"cloud.sun.fill",cloudy:"cloud.fill",fog:"cloud.fog.fill",rainy:"cloud.rain.fill",pouring:"cloud.heavyrain.fill",lightning:"cloud.bolt.fill","lightning-rainy":"cloud.bolt.rain.fill",snowy:"cloud.snow.fill","snowy-rainy":"cloud.drizzle.fill",hail:"cloud.snow.fill",windy:"wind","windy-variant":"wind",exceptional:"exclamationmark.triangle.fill"};function pu(e){return s$[e.trim().toLowerCase()]??cg}var l$={light:{on:"lightbulb.fill",off:"lightbulb"},switch:{on:"power",off:"power"},fan:{on:"fan.fill",off:"fan.fill"},input_boolean:{on:"circle.fill",off:"circle"}},d$={door:{on:"door.left.hand.open",off:"door.left.hand.closed"},garage_door:{on:"door.left.hand.open",off:"door.left.hand.closed"},opening:{on:"door.left.hand.open",off:"door.left.hand.closed"},window:{on:"window.casement",off:"curtains.closed"},motion:{on:"figure.walk",off:"figure.stand"},occupancy:{on:"figure.walk",off:"figure.stand"},presence:{on:"figure.walk",off:"figure.stand"},moisture:{on:"drop.fill",off:"drop"},smoke:{on:"exclamationmark.triangle.fill",off:"checkmark.circle.fill"},gas:{on:"exclamationmark.triangle.fill",off:"checkmark.circle.fill"},carbon_monoxide:{on:"exclamationmark.triangle.fill",off:"checkmark.circle.fill"},problem:{on:"exclamationmark.triangle.fill",off:"checkmark.circle.fill"},safety:{on:"exclamationmark.triangle.fill",off:"checkmark.circle.fill"},battery:{on:"battery.25percent",off:"battery.100percent"},lock:{on:"lock.open.fill",off:"lock.fill"},plug:{on:"powerplug.fill",off:"poweroutlet.type.b.fill"},power:{on:"powerplug.fill",off:"poweroutlet.type.b.fill"},connectivity:{on:"wifi",off:"wifi.slash"},sound:{on:"speaker.wave.2.fill",off:"speaker.slash.fill"},running:{on:"play.fill",off:"stop.fill"},update:{on:"arrow.down.circle.fill",off:"checkmark.circle.fill"}},c$={on:"circle.fill",off:"circle"},u$={cover:{open:"window.casement",closed:"curtains.closed",opening:"arrow.up",closing:"arrow.down"},lock:{locked:"lock.fill",unlocked:"lock.open.fill",jammed:"exclamationmark.triangle.fill"},media_player:{playing:"play.fill",paused:"pause.fill",idle:"stop.fill",standby:"zzz",off:"speaker.slash.fill"},climate:{heat:"flame.fill",cool:"snowflake",heat_cool:"thermometer.medium",dry:"humidity.fill",fan_only:"fan.fill",auto:"thermometer.variable",off:"power"},vacuum:{cleaning:"sparkles",returning:"arrow.counterclockwise",docked:"powerplug.fill",idle:"pause.fill",error:"exclamationmark.triangle.fill"},alarm_control_panel:{disarmed:"shield.slash.fill",armed_home:"house.fill",armed_away:"shield.fill",armed_night:"moon.fill",armed_vacation:"airplane",arming:"hourglass",pending:"hourglass",triggered:"bell.badge.fill"},person:{home:"house.fill",not_home:"figure.walk"},device_tracker:{home:"house.fill",not_home:"figure.walk"}},p$={light:{on:"lightbulb.fill",off:"lightbulb"},switch:{on:"power",off:"power"},fan:{on:"fan.fill",off:"fan.fill"},input_boolean:{on:"circle.fill",off:"circle"},cover:{on:"window.casement",off:"curtains.closed"},lock:{on:"lock.fill",off:"lock.open.fill"},media_player:{on:"speaker.wave.2.fill",off:"speaker.slash.fill"},siren:{on:"bell.fill",off:"bell.slash.fill"},humidifier:{on:"humidifier.fill",off:"humidifier.fill"},valve:{on:"spigot.fill",off:"spigot.fill"},automation:{on:"gearshape.fill",off:"gearshape.fill"},script:{on:"play.fill",off:"play.fill"},scene:{on:"sparkles",off:"sparkles"},climate:{on:"flame.fill",off:"thermometer.medium"},binary_sensor:{on:"circle.fill",off:"circle"},group:{on:"circle.fill",off:"circle"}},h$={on:"circle.fill",off:"circle"};function f$(e){let n=Number(e);return Number.isFinite(n)?`battery.${Math.min(4,Math.max(0,Math.round(n/25)))*25}percent`:void 0}var m$=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]),g$=new Set(["unavailable","unknown",""]);function hg(e,n,t){let i=e.trim().toLowerCase(),a=n.trim().toLowerCase(),r=t.trim().toLowerCase();if(g$.has(r))return cg;let o=l$[i]??(i==="binary_sensor"?d$[a]??c$:void 0);if(o)return r==="off"?o.off:o.on;if(i==="weather")return pu(r);if(i==="sensor"&&a==="battery"){let c=f$(r);if(c!==void 0)return c}let s=u$[i]?.[r];if(s!==void 0)return s;let l=p$[i]??h$;return m$.has(r)?l.on:l.off}function y$(e,n){let t=e.holes.length===0?e.values:e.values.filter((i,a)=>!e.holes[a]);if(t.length!==0)switch(n){case"latest":return t[t.length-1];case"highest":return Math.max(...t);case"lowest":return Math.min(...t);case"average":return t.reduce((i,a)=>i+a,0)/t.length;case"top":return e.domainMax;case"bottom":return e.domainMin;case"first":return t[0];case"delta":return t[t.length-1]-t[0];case"sum":return t.reduce((i,a)=>i+a,0);case"trend":{let i=t[t.length-1]-t[0],a=Number(Ir(i,e.domainMax-e.domainMin));return a>0?1:a<0?-1:0}}}var b$=10800;function x$(e,n,t){let i=n==="always"||n==="auto"&&t<=b$;return new Intl.DateTimeFormat(void 0,{hour:"numeric",...i?{minute:"2-digit"}:{},...e==="h12"?{hourCycle:"h12"}:{},...e==="h24"?{hourCycle:"h23"}:{}})}function Js(e,n,t,i,a){if(e<=0||n.length===0)return[];let r=x$(t,i,e);return n.map(o=>({position:o,text:r.format(new Date(a-e*1e3*(1-o)))}))}function v$(e,n){return ht(e)===void 0?[]:Js(Pt(e)*60,_r(e.timeLabelCount),e.hourCycle,e.minutes,n)}function w$(e,n){return Li(e)?Js(Math.round(e.historyMinutes)*60,_r(Wt(e.timeLabelCount)),e.hourCycle,e.minutes,n):[]}function k$(e,n,t,i){return n===void 0&&i!==void 0?ht(i)===void 0?[]:Js(Pt(i)*60,_r(Wt(e.timeLabelCount)),e.hourCycle,e.minutes,t):n===void 0||!Li(n)?[]:Js(Math.round(n.historyMinutes)*60,_r(Wt(e.timeLabelCount)),e.hourCycle,e.minutes,t)}function Qn(e){let n=e;if(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(n))return Number(n);let t=n.toLowerCase();if(t==="inf"||t==="+inf"||t==="infinity"||t==="+infinity")return 1/0;if(t==="-inf"||t==="-infinity")return-1/0;if(t==="nan"||t==="+nan"||t==="-nan")return NaN}function at(e){let n=e.trim(),t=Qn(n);if(t!==void 0)return t;let i="";for(let r of n)if(/\p{N}/u.test(r)||r==="."||r==="-"||r==="+")i+=r;else if(i.length>0)break;return i.length===0?void 0:Qn(i)}function $$(e){return Number.isInteger(e)&&Math.abs(e)<1e16?e.toFixed(1):String(e)}function C$(e){let n=Math.max(0,e);return n<60?`${Math.trunc(n)}s`:n<3600?`${Math.trunc(n/60)}m`:n<86400?`${Math.trunc(n/3600)}h`:`${Math.trunc(n/86400)}d`}function S$(e){let n=e.trim(),t=Qn(n);if(t!==void 0)return t;let i=0,a=n.indexOf(",");if(a>=0){let s=n.slice(0,a).trim().split(" "),l=s.length===2?Qn(s[0]):void 0;if(l===void 0||s[1]!=="day"&&s[1]!=="days")return;i=l,n=n.slice(a+1).trim()}let r=n.split(":");if(r.length!==2&&r.length!==3)return;let o=0;for(let s=0;s<r.length;s++){let l=Qn(r[s]);if(l===void 0)return;o+=l*Math.pow(60,r.length-1-s)}return i*86400+o}function T$(e){let n=Math.trunc(Math.min(Math.max(0,e)||0,863913600)),i=[[Math.trunc(n/86400),"d"],[Math.trunc(n%86400/3600),"h"],[Math.trunc(n%3600/60),"m"],[n%60,"s"]].filter(([a])=>a>0).slice(0,2).map(([a,r])=>`${a}${r}`);return i.length===0?"0s":i.join(" ")}function E$(e){return e.replace(/\S+/g,n=>n.charAt(0).toUpperCase()+n.slice(1).toLowerCase())}function R$(e,n,t,i,a){let r=new Date(e*1e3);if(!Number.isFinite(r.getTime()))return String(e);let o=i!==void 0?{timeZone:i}:{};if(n==="date")return new Intl.DateTimeFormat(t,{day:"numeric",month:"short",...o}).format(r);if(n==="weekday")return new Intl.DateTimeFormat(t,{weekday:"short",...o}).format(r);let s=n==="dateTime"?{weekday:"short"}:{},l=new Intl.DateTimeFormat(t,{...s,hour:"numeric",minute:"2-digit",...o}),c=l.resolvedOptions().hour12!==!1?l:new Intl.DateTimeFormat(t,{...s,hour:"2-digit",minute:"2-digit",...o});return!a?.minutes&&!a?.dayPeriod?c.format(r):A$(c.formatToParts(r),a)}function A$(e,n){let t=new Set([...n.minutes?["minute"]:[],...n.dayPeriod?["dayPeriod"]:[]]),i=e.map(()=>!0);return e.forEach((a,r)=>{if(!t.has(a.type))return;i[r]=!1;let o=e[r-1],s=e[r+1];o?.type==="literal"&&i[r-1]?i[r-1]=!1:s?.type==="literal"&&(i[r+1]=!1)}),e.filter((a,r)=>i[r]).map(a=>a.value).join("").trim()}function F$(e,n,t,i,a){if(Xe(n))return e;let r=n,o=e,s=Qn(e.trim()),l=r.duration?S$(e):void 0;if(l!==void 0)o=T$(l);else if(r.relativeTime&&s!==void 0)o=C$(s);else if(r.timestamp!==void 0&&s!==void 0)o=R$(s,r.timestamp,i,a,{minutes:r.hideMinutes,dayPeriod:r.hideDayPeriod});else{let c=at(e);if(c!==void 0){let d=c*(r.multiply??1)+(r.offset??0);r.decimals!==void 0?o=d.toFixed(Math.max(0,r.decimals)):d!==c&&(o=Number.isInteger(d)?String(d):$$(d))}}switch(r.useEntityUnit&&t&&(o+=t.startsWith("\xB0")||t.startsWith("%")?t:` ${t}`),r.prefix&&(o=r.prefix+o),r.suffix&&(o=o+r.suffix),r.textCase){case"upper":o=o.toUpperCase();break;case"lower":o=o.toLowerCase();break;case"capitalized":o=E$(o);break}return o}function Ha(e){let n=Math.trunc(Math.max(0,e)),t=Math.trunc(n/3600),i=Math.trunc(n%3600/60),a=n%60,r=o=>String(o).padStart(2,"0");return t>0?`${t}:${r(i)}:${r(a)}`:`${i}:${r(a)}`}function rt(e,n=240){return wg(e,n).map(t=>t.value)}function fu(e,n=240){let t=[];for(let s of e.split(",")){if(t.length>=n)break;if(s.trim()===""){t.push(void 0);continue}for(let l of rt(s,n-t.length))t.push(l)}let i=t.find(s=>s!==void 0);if(i===void 0)return{values:[],holes:[]};let a=[],r=[],o=i;for(let s of t)s===void 0?(a.push(o),r.push(!0)):(o=s,a.push(s),r.push(!1));return{values:a,holes:vg(r)}}function vg(e){return e.some(n=>n)?e:[]}function wg(e,n=240){let t=[],i="",a=0,r=!1,o=0,s=()=>{if(i!==""){let l=Number(i);Number.isFinite(l)&&t.push({value:l,start:a,end:a+i.length})}i=""};for(let l of e){if(t.length>=n)break;if(l>="0"&&l<="9")i===""&&(a=o),i+=l,r=!0;else if(l===".")i.includes(".")&&s(),i===""&&(a=o),i+=".",r=!0;else if(l==="-"||l==="+"){let c=!r;s(),c&&(a=o,i=l),r=!1}else s(),r=!1;o+=l.length}return t.length<n&&s(),t}function M$(e,n){if(e.arc===void 0||e.countdown===!0||!cs(n))return;let t=ge[n==="inline"?"rectangular":n],i=Math.max(0,Math.min(e.frame.width*t.width,e.frame.height*t.height));return{radius:e.arc.radius*i,angle:e.arc.angle??0,sweep:$r(e.arc.sweep??Qe),spacing:Cr(e.arc.spacing??0),flip:e.arc.flip===!0,anchor:i/2}}function fg(e,n,t){let i=wg(e),a=i.map(b=>b.value),r=t.highlight??"none",o=-1,s=-1;a.length>0&&((r==="highest"||r==="both")&&(o=a.indexOf(Math.max(...a))),(r==="lowest"||r==="both")&&(s=a.indexOf(Math.min(...a))),s===o&&(s=-1));let l=t.coloring==="bands"?vn({bands:t.bands??[]}):[],c=t.bandAboveColorHex??ve,d=t.highColorHex??wt,u=t.lowColorHex??kt,p=[],f=(b,y)=>{if(b==="")return;let v=p.at(-1);v&&v.colorHex===y?v.text+=b:p.push({text:b,colorHex:y})},g=0;return i.forEach((b,y)=>{f(e.slice(g,b.start),n);let v=y===o?d:y===s?u:l.length>0?Lr(b.value,l,c):n,k=e[b.end-1]==="."?b.end-1:b.end;f(e.slice(b.start,k),v),g=k}),f(e.slice(g),n),p}function mg(e,n){let t,i;return n.scale==="fixed"?(t=Math.min(n.minValue,n.maxValue),i=Math.max(n.minValue,n.maxValue)):(t=e.length>0?Math.min(...e):0,i=e.length>0?Math.max(...e):1,n.thresholdValue!==void 0&&Number.isFinite(n.thresholdValue)&&(t=Math.min(t,n.thresholdValue),i=Math.max(i,n.thresholdValue))),n.baseline==="zero"&&(t=Math.min(t,0),i=Math.max(i,0)),i>t||(i=t+1),{min:t,max:i}}function L$(e,n,t){let i=e.thresholdValue;if(!(i===void 0||!Number.isFinite(i)||!(t>n)||i<n||i>t))return(i-n)/(t-n)}function qr(e,n=jn){let t=[];for(let i of e.split(" ")){if(t.length>=n)break;if(i==="")continue;let a=i.indexOf(":");if(a<=0)continue;let r=Number(i.slice(0,a));!Number.isFinite(r)||r<0||t.push({offsetSeconds:Math.round(r),state:I$(i.slice(a+1))})}return t}function I$(e){try{return decodeURIComponent(e)}catch{return e}}function H$(e,n,t){if(e.length===0||!(n>0))return[];let i=[];for(let r=0;r<e.length;r++){let o=e[r],s=Math.min(1,Math.max(0,o.offsetSeconds/n)),l=e[r+1],c=l===void 0?1:Math.min(1,Math.max(s,l.offsetSeconds/n));if(!(c>s))continue;let d=t(o.state),u=i[i.length-1];u!==void 0&&u.colorHex===d?u.end=c:i.push({start:s,end:c,colorHex:d})}let a=i[i.length-1];return a!==void 0&&(a.end=1),i}function gg(e,n,t){if(Number.isNaN(e))return t;let i=e<0?-Math.round(-e):Math.round(e);return Math.min(t,Math.max(n,i))}function yg(e,n,t){if(e===void 0)return 0;let i=at(e);if(i===void 0||Number.isNaN(i))return 0;let a=t-n;return a===0?0:Math.min(1,Math.max(0,(i-n)/a))}function _$(e){let n=t=>{if(Array.isArray(t))return t.map(n);if(t!==null&&typeof t=="object"){let i=t,a={};for(let r of Object.keys(i).sort())a[r]=n(i[r]);return a}return t};return JSON.stringify(n(e))??""}function bg(e){return e===null?"":typeof e=="string"?e:typeof e=="boolean"||typeof e=="number"?ou(e):_$(e)}function P$(e){let n=new Map;if(e!==null&&typeof e=="object"&&!Array.isArray(e))for(let[t,i]of Object.entries(e))n.set(t,bg(i));else n.set("value",bg(e));return n}function Xs(e,n){let t=e.get(n);if(t===void 0)return;let i=Qn(t.trim());return i===void 0||!Number.isFinite(i)?void 0:i}function N$(e,n,t,i){switch(e.set("index",String(t)),n.kind){case"entities":{let a=Xs(e,"lastChanged");a!==void 0&&e.set("age",String(Math.round(i-a))),e.set("icon",hg(e.get("domain")??"",e.get("deviceClass")??"",e.get("state")??""));return}case"calendar":{let a=Xs(e,"start");a!==void 0&&e.set("startsIn",String(Math.max(0,Math.round(a-i))));let r=Xs(e,"end");r!==void 0&&e.set("endsIn",String(Math.max(0,Math.round(r-i)))),e.set("icon",ug);return}case"todo":{let a=Xs(e,"due");a!==void 0&&e.set("dueIn",String(Math.round(a-i))),e.set("icon",pg);return}case"forecast":e.set("icon",pu(e.get("condition")??""));return;default:return}}function mu(e,n,t,i){let a;try{a=JSON.parse(e)}catch{return{items:[],total:0}}let r,o;if(Array.isArray(a))r=a,o=a.length;else if(a!==null&&typeof a=="object"&&Array.isArray(a.items)){let l=a;r=l.items,o=typeof l.total=="number"&&Number.isFinite(l.total)?Math.round(l.total):l.items.length}else return{items:[],total:0};let s=r.slice(0,Math.max(0,n)).map((l,c)=>{let d=P$(l);return N$(d,t,c,i),{fields:d,index:c}});return{items:s,total:Math.max(o,s.length)}}function gu(e,n){let t=nt(e.rows),{lines:i,columns:a}=Ms(e),r=Pi(e.gap),o=(d,u)=>{if(d<=1)return{size:1,step:0};let p=u>0?r/u:0,f=Math.min(p,1/(d-1)),g=(1-f*(d-1))/d;return{size:g,step:g+f}},s=o(a,Math.abs(e.frame.width)*n.width),l=o(i,Math.abs(e.frame.height)*n.height),c=[];for(let d=0;d<t;d++)c.push({x:d%a*s.step,y:Math.floor(d/a)*l.step,width:s.size,height:l.size,rotationDegrees:0});return c}var D$=/\{item\.([^{}]+)\}/g;function xg(e,n){return{entityId:e,displayName:n,domain:e.split(".")[0]??""}}var Ot=class{constructor(n,t){this.ctx=n;this.charts=new Map;this.chartElements=new Map;this.timelineElements=new Map;this.imageElements=new Map;this.lists=new Map;this.listCells=new Map;this.named=new Map(n.namedValues.map(i=>[i.id.toUpperCase(),i.value])),t&&(this.settleCharts(t),this.settleListItems(t.elements))}settleListItems(n){this.lists.clear();let t=this.nowMs()/1e3;for(let i of n){if(i.kind!=="list")continue;let a=this.listText(i.payload);this.lists.set(i.payload.id,a===void 0?{items:[],total:0}:mu(a,nt(i.payload.rows),i.payload.source,t))}}listText(n){let t=Zn(n.source,n.rows);if(t!==void 0)return this.ctx.templateResults.get(t);let i=Sn(n.source);return i===void 0?void 0:this.ctx.listItems?.get(i)}settleListCells(n,t,i,a){this.listCells.clear();let r=n.perFamily[i],o=ge[i==="inline"?"rectangular":i];for(let s of t){if(s.kind!=="list")continue;let l=this.lists.get(s.payload.id)?.items??[],c=gu(s.payload,o),d=[];for(let u=0;u<l.length&&u<c.length;u++){this.currentItem=l[u];let p=s.payload.template.map(f=>this.resolveElement(Uc(f,r?.placements[f.payload.id]),a,i));this.currentItem=void 0,d.push({frame:c[u],elements:p})}this.listCells.set(s.payload.id,d)}}chartReadings(n){let{values:t,holes:i}=this.chartSeries(n),a=mg(t,n),r={values:t,holes:i,domainMin:a.min,domainMax:a.max},o=this.chartEntity(n);return o&&(r.entity=o),r}chartSeries(n){let t=Xt(n),i=Jt(n),a,r=t??i;r!==void 0?a=this.ctx.historySeries?.get(r)??"":a=this.resolve(n.value)??"";let{values:o,holes:s}=r!==void 0?fu(a):{values:rt(a),holes:[]},l=r===void 0?void 0:this.testedReading(n);if(l!==void 0&&(o=[...o.slice(0,-1),l],s.length>0&&(s=[...s.slice(0,-1),!1])),n.limit>0&&o.length>n.limit){let c=d=>n.takeFromEnd?d.slice(d.length-n.limit):d.slice(0,n.limit);o=c(o),s.length>0&&(s=c(s))}return s=vg(s),{values:yu(o,It(n.smoothing),s),holes:s}}testedReading(n){let t=this.chartEntity(n);if(!t||!this.ctx.testedEntities?.has(t.entityId))return;let i=this.ctx.entityStates.get(t.entityId)?.state;return i===void 0?void 0:at(i)}chartEntity(n){let t=this.dereference(n.value);if(!(!t||!("entityId"in t.kind)))return{entityId:t.kind.entityId,displayName:t.kind.displayName,domain:t.kind.domain}}chartNowIndex(n,t){if(n.nowIndex===void 0||t===0)return;let i=this.resolve(n.nowIndex);if(i===void 0)return;let a=at(i);if(!(a===void 0||!Number.isFinite(a)))return Math.min(Math.max(Math.round(a),0),t-1)}settleCharts(n){let t=new Map,i=[];for(let s of n.elements)s.kind==="timeline"&&this.timelineElements.set(s.payload.id,s.payload),s.kind==="image"&&this.imageElements.set(s.payload.id,s.payload),!(s.kind!=="chart"||t.has(s.payload.id))&&(t.set(s.payload.id,s.payload),i.push(s.payload.id));let a=new Map;for(let s of i)a.set(s,this.chartSeries(t.get(s)));let r=new Map,o=(s,l)=>{let c=r.get(s);if(c)return c;let d=t.get(s);if(!d)return{min:0,max:1};let u=d.scaleFrom,p=u!==void 0&&u!==s&&t.has(u)&&!l.has(u)?o(u,new Set([...l,u])):mg(a.get(s)?.values??[],d);return r.set(s,p),p};for(let s of i){let l=t.get(s),c=o(s,new Set([s])),d={values:a.get(s)?.values??[],holes:a.get(s)?.holes??[],domainMin:c.min,domainMax:c.max},u=this.chartEntity(l);u&&(d.entity=u),this.charts.set(s,d),this.chartElements.set(s,l)}}dereference(n){let t=n,i=new Set,a=n.format;for(;t.kind.kind==="named";){let o=t.kind.id.toUpperCase();if(i.has(o))return;i.add(o);let s=this.named.get(o);if(!s)return;a=a&&!Xe(a)?a:s.format,t=s}let r={kind:t.kind};return a&&(r.format=a),r}directEntityUnit(n){let t=n.kind;if(t.kind==="entityState"||t.kind==="entityAttribute"||t.kind==="entityAge")return this.ctx.entityStates.get(t.entityId)?.unitOfMeasurement;if(t.kind==="chartStat"){if(t.stat==="trend")return;let i=this.charts.get(t.layer.toUpperCase())?.entity;return i?this.ctx.entityStates.get(i.entityId)?.unitOfMeasurement:void 0}if(t.kind==="item")return this.currentItem?.fields.get("unit")}resolve(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i;switch(t.kind.kind){case"literal":i=t.kind.value;break;case"entityState":i=this.ctx.entityStates.get(t.kind.entityId)?.state;break;case"dataAge":i=this.ctx.dataAgeSeconds===void 0?void 0:String(Math.trunc(this.ctx.dataAgeSeconds));break;case"chartStat":{let a=this.charts.get(t.kind.layer.toUpperCase()),r=a?y$(a,t.kind.stat):void 0;a&&r!==void 0&&(i=t.kind.stat==="trend"?Tf(r):Ir(r,a.domainMax-a.domainMin));break}case"item":i=this.currentItem?.fields.get(t.kind.field);break;case"listStat":{let a=this.lists.get(t.kind.layer.toUpperCase());a&&(i=String(t.kind.stat==="total"?a.total:a.items.length));break}default:{let a=Ia(n,this.named);i=a===void 0?void 0:this.ctx.templateResults.get(a)}}if(i!==void 0)return F$(i,t.format,this.directEntityUnit(t),this.ctx.locale,this.ctx.timeZone)}nowMs(){return this.ctx.nowMs??Date.now()}countdownEnd(n){if(!n)return;let t=this.dereference(n);if(!t)return;let i=t.kind;if(i.kind==="entityState"){let o=this.ctx.entityStates.get(i.entityId);if(o?.timerState!==void 0){if(o.timerState!=="active"||!o.finishesAt)return;let s=Date.parse(o.finishesAt);return Number.isFinite(s)&&s>this.nowMs()?s:void 0}}let a=this.resolve(n)?.trim();if(!a)return;let r=Date.parse(a);if(!Number.isFinite(r)){let o=Qn(a);r=o===void 0?NaN:o*1e3}return Number.isFinite(r)&&r>this.nowMs()?r:void 0}canCountDown(n){if(!n)return!1;let t=this.dereference(n);if(t?.kind.kind==="entityState"){let i=t.kind.entityId;if(i.startsWith("timer.")||this.ctx.entityStates.get(i)?.timerState!==void 0)return!0}return this.countdownEnd(n)!==void 0}countdownFallbackText(n){if(!n)return;let t=this.dereference(n);if(!t||t.kind.kind!=="entityState")return;let i=this.ctx.entityStates.get(t.kind.entityId);if(i?.timerState!==void 0)return i.timerState==="paused"?i.remaining!==void 0&&i.remaining>0?Ha(i.remaining):"Paused":"Idle"}entityIcon(n){let t=this.dereference(n);return!t||t.kind.kind!=="entityState"?void 0:this.ctx.entityStates.get(t.kind.entityId)?.iconName??t.kind.iconName}isStale(){return(this.ctx.dataAgeSeconds??1/0)>(this.ctx.stalenessThresholdSeconds??1200)}evaluateTest(n){let t=n.comparison;if(t.kind==="isStale")return this.isStale();let i=this.resolve(n.value);if(i===void 0)return t.kind==="isUnavailable";let a=at(i),r=()=>this.resolve(t.value),o=()=>{let l=r();return l===void 0?void 0:at(l)},s=l=>{let c=o();return a===void 0||c===void 0?!1:l(a,c)};switch(t.kind){case"equals":{let l=r();return l!==void 0&&i===l}case"notEquals":{let l=r();return l!==void 0&&i!==l}case"isOn":return i.toLowerCase()==="on";case"isOff":return i.toLowerCase()==="off";case"isUnavailable":{let l=i.toLowerCase();return l==="unavailable"||l==="unknown"}case"isEmpty":return i.trim().length===0;case"greaterThan":return s((l,c)=>l>c);case"greaterOrEqual":return s((l,c)=>l>=c);case"lessThan":return s((l,c)=>l<c);case"lessOrEqual":return s((l,c)=>l<=c);case"between":{let l=o(),c=this.resolve(t.upper),d=c===void 0?void 0:at(c);if(a===void 0||l===void 0||d===void 0)return!1;let[u,p]=l<=d?[l,d]:[d,l];return a>=u&&a<=p}case"timeBetween":{let l=Gi(i),c=r(),d=this.resolve(t.upper),u=c===void 0?void 0:Gi(c),p=d===void 0?void 0:Gi(d);return l===void 0||u===void 0||p===void 0||u===p?!1:u<p?l>=u&&l<p:l>=u||l<p}case"contains":{let l=r();return!!l&&i.toLowerCase().includes(l.toLowerCase())}case"startsWith":{let l=r();return!!l&&i.toLowerCase().startsWith(l.toLowerCase())}case"endsWith":{let l=r();return!!l&&i.toLowerCase().endsWith(l.toLowerCase())}case"matchesRegex":{if(!t.pattern)return!1;try{return new RegExp(t.pattern).test(i)}catch{return!1}}case"isOneOf":return(t.options??[]).some(l=>l.toLowerCase()===i.toLowerCase());default:return!1}}evaluateCondition(n){return n.tests.length===0?!0:n.join==="any"?n.tests.some(t=>this.evaluateTest(t)):n.tests.every(t=>this.evaluateTest(t))}applyRules(n,t){let i=new Map;for(let a of n){let r=t?.get(a.id),o=[];if(r&&r!=="live")r==="otherwise"?o=a.otherwise??[]:o=a.cases.find(s=>s.id===r.caseId)?.then??[];else{let s=a.cases.find(l=>this.evaluateCondition(l.when));o=s?s.then:a.otherwise??[]}for(let s of o)i.set(tt[s.kind],s)}return i}liveBranches(n){let t=new Map;for(let i of n){let a=i.cases.find(r=>this.evaluateCondition(r.when));t.set(i.id,a?a.id:i.otherwise?"otherwise":"none")}return t}styleColor(n,t){let i=n.get(t);if(!i)return;let a=this.resolve(i.value);return a||void 0}styleText(n,t){let i=n.get(t);return i?this.resolve(i.value):void 0}styleNumber(n,t){return n.get(t)?.number}resolveLevel(n,t){if(!n)return;let i=(o,s)=>(o?at(this.resolve(o)??""):void 0)??s,a=i(n.minSource,n.minValue),r=i(n.maxSource,n.maxValue);return{fraction:yg(this.resolve(n.value),a,r),direction:n.direction,trackColorHex:n.trackColorHex??yf(t,bf)}}resolveTextParts(n,t,i,a){let r=[];for(let o of n){let s=this.applyRules(t.filter(c=>c.partId===o.id),a);if(s.get("visibility")?.kind==="hide")continue;let l={text:this.styleText(s,"text")??this.resolve(o.value)??"--",fontSize:this.styleNumber(s,"fontSize")??o.fontSize??i.fontSize,fontWeight:s.get("fontWeight")?.weight??o.fontWeight??i.fontWeight,fontDesign:s.get("fontDesign")?.design??o.fontDesign??i.fontDesign,fontWidth:s.get("fontWidth")?.width??o.fontWidth??i.fontWidth,italic:s.get("italic")?.italic??o.italic??i.italic,colorHex:this.styleColor(s,"color")??o.colorHex??i.colorHex};o.coloring==="bands"&&(o.bands?.length??0)>0&&(l.spans=fg(l.text,l.colorHex,o)),r.push(l)}return r}resolveElement(n,t,i="rectangular"){let a=n.payload,r=n.kind==="text"?a.rules.filter(f=>f.partId===void 0):a.rules,o=this.applyRules(r,t),s=o.get("visibility"),l=s?s.kind==="hide":a.isHidden,c=this.styleNumber(o,"rotation"),d=c===void 0?a.frame:{...a.frame,rotationDegrees:c},u=Tr((a.opacity??1)*(this.styleNumber(o,"opacity")??1)),p={id:a.id,isHidden:l,frame:d,opacity:u};switch(a.shadow!==void 0&&(p.shadow=a.shadow),a.chartAnchor!==void 0&&(p.chartAnchor=a.chartAnchor),a.accentGroup==="accent"&&(p.accentGroup="accent"),n.kind){case"text":{let f=n.payload.countdown?this.countdownEnd(n.payload.value):void 0,g=n.payload.countdown?this.countdownFallbackText(n.payload.value):void 0,b=_t(n.payload)&&!o.has("text"),y={kind:"text",...p,text:b?"":this.styleText(o,"text")??g??this.resolve(n.payload.value)??"--",fontSize:this.styleNumber(o,"fontSize")??n.payload.fontSize,fontWeight:o.get("fontWeight")?.weight??n.payload.fontWeight,colorHex:this.styleColor(o,"color")??n.payload.colorSlot.baseColorHex,monospacedDigits:n.payload.monospacedDigits===!0,lineLimit:Math.min(Wd,Math.max(1,Math.round(n.payload.lineLimit??1))),fontDesign:o.get("fontDesign")?.design??n.payload.fontDesign??"default",fontWidth:o.get("fontWidth")?.width??n.payload.fontWidth??"standard",italic:o.get("italic")?.italic??n.payload.italic===!0,minimumScale:mr(n.payload.minimumScale??St),alignment:n.payload.alignment??"center"};f!==void 0&&(y.countdownEnd=f);let v=M$(n.payload,i);return v!==void 0&&(y.arc=v),b?(y.parts=this.resolveTextParts(n.payload.parts,a.rules,y,t),y.text=y.parts.map(k=>k.text).join(""),y):(xf(n.payload)&&(y.spans=fg(y.text,y.colorHex,n.payload)),y)}case"icon":{let f=this.entityIcon(n.payload.symbol)??this.resolve(n.payload.symbol)??"questionmark.circle",g=this.styleText(o,"icon"),b=n.payload.symbol.kind.kind==="literal",y=g===void 0&&b&&n.payload.path!==""?n.payload.path:void 0,v=g??f;y===void 0&&(v.startsWith("mdi:")||v===Rr)&&(v="questionmark.circle");let k={kind:"icon",...p,symbol:v,size:this.styleNumber(o,"fontSize")??n.payload.size,colorHex:this.styleColor(o,"color")??n.payload.colorSlot.baseColorHex};y!==void 0&&(k.path=y),y!==void 0&&n.payload.viewBox!==void 0&&(k.viewBox=n.payload.viewBox);let S=this.resolveLevel(n.payload.level,k.colorHex);return S!==void 0&&(k.level=S),k}case"gauge":{let f=n.payload,g=this.styleText(o,"gaugeValue")??this.resolve(f.value),b=(K,Y,J)=>K??(Y?at(this.resolve(Y)??""):void 0)??J,y=b(this.styleNumber(o,"gaugeMin"),f.minSource,f.minValue),v=b(this.styleNumber(o,"gaugeMax"),f.maxSource,f.maxValue),k=g===void 0?void 0:at(g),S=this.styleColor(o,"color"),I=S??f.colorSlot.baseColorHex,_=f.coloring==="bands"&&f.bands.length>0&&k!==void 0;_&&(I=Lr(k,vn(f),f.bandAboveColorHex));let E=_||S!==void 0?void 0:f.fill,z=v-y;if(f.total){let K=at(this.resolve(f.total)??"");K!==void 0&&(z=K)}let C=gg(z,1,xs),M={kind:"gauge",...p,fraction:yg(g,y,v),style:f.style,lineWidth:f.lineWidth,colorHex:I,trackColorHex:f.trackColorHex,thresholdColorHex:f.thresholdColorHex,dotCount:C,filledCount:gg(k??0,0,C),tickCount:f.ticks?.count??0,tickLength:f.ticks?.length??yn,tickColorHex:f.ticks?.colorHex??gn,tickMajorEvery:f.ticks?.majorEvery??0,showsLabels:f.labels?.show===!0,labelSize:f.labels?.size??xn,labelColorHex:f.labels?.colorHex??bn,minValue:y,maxValue:v,valueText:g??""};if(E!==void 0&&(M.fill=E),f.thresholdValue!==void 0&&v!==y){let K=(f.thresholdValue-y)/(v-y);K>=0&&K<=1&&(M.thresholdFraction=K)}return M}case"chart":{let f=n.payload,g=this.charts.get(f.id)??this.chartReadings(f),b=g.values,y=g.holes,v={min:g.domainMin,max:g.domainMax},k=this.styleColor(o,"color")??f.colorSlot.baseColorHex,S=vn(f),I=Mr(f)?b.map(J=>Lr(J,S,f.bandAboveColorHex)):[],_=f.highlight==="highest"||f.highlight==="both",E=f.highlight==="lowest"||f.highlight==="both",z=ur(f),C={kind:"chart",...p,values:b,holes:y,style:f.style,domainMin:v.min,domainMax:v.max,baseline:f.baseline,barGap:f.barGap,lineWidth:f.lineWidth,colorHex:k,highColorHex:f.highColorHex,lowColorHex:f.lowColorHex,marker:f.marker,highMarker:_?z.high:"none",lowMarker:E?z.low:"none",pointColorHexes:I,fillBands:f.fillBands,curve:f.curve??"straight",smoothing:It(f.smoothing)??"off",fillStyle:Dn(f.fillStyle),...f.fillColorHex!==void 0?{fillColorHex:f.fillColorHex}:{},...f.areaFill!==void 0&&f.style!=="bars"?{areaFill:f.areaFill}:{},barRadius:On(f.barRadius),barCorners:zn(f.barCorners),barBorderWidth:rc(f),barFillColorHexes:[],barBorderColorHexes:[],barBorderOpenBase:rc(f)>0&&f.barBorderOpenBase===!0,thresholdColorHex:f.thresholdColorHex,drawsThreshold:f.drawsThreshold!==!1,nowColorHex:f.nowColorHex,drawsNowLine:f.drawsNowLine!==!1,labels:f.drawsTimeLabels===!1?[]:w$(f,this.nowMs()),labelSize:f.labelSize,labelColorHex:f.labelColorHex,labelsAbove:f.labelsAbove},M=y.length===0?b:b.filter((J,L)=>!y[L]);if(M.length>0){let J=ne=>b.findIndex((D,W)=>D===ne&&y[W]!==!0),L=_?J(Math.max(...M)):-1,X=E?J(Math.min(...M)):-1;L>=0&&(C.highIndex=L),X>=0&&X!==L&&(C.lowIndex=X)}if(f.style==="bars"){let J=b.map((L,X)=>Sf(f,L,S,k,X===C.highIndex?f.highColorHex:X===C.lowIndex?f.lowColorHex:void 0));C.barFillColorHexes=J.map(L=>L.fill),C.barBorderWidth>0&&(C.barBorderColorHexes=J.map(L=>L.border))}let K=L$(f,v.min,v.max);K!==void 0&&(C.thresholdY=K);let Y=this.chartNowIndex(f,b.length);return Y!==void 0&&(C.nowIndex=Y),C}case"timeline":{let f=n.payload,g=ht(f),b=g===void 0?"":this.ctx.historySeries?.get(g)??"",y=qr(b,jn),v=H$(y,Pt(f)*60,S=>_f(S,f.bands,f.otherColorHex));return{kind:"timeline",...p,runs:v,gap:f.gap,cornerRadius:f.cornerRadius,labels:f.drawsTimeLabels===!1?[]:v$(f,this.nowMs()),labelSize:f.labelSize,labelColorHex:f.labelColorHex,labelsAbove:f.labelsAbove}}case"shape":{let f=this.styleColor(o,"color"),g={kind:"shape",...p,shapeKind:n.payload.kind,cornerRadius:n.payload.cornerRadius,thickness:n.payload.thickness,fillColorHex:f??n.payload.colorSlot.baseColorHex,borderWidth:this.styleNumber(o,"borderWidth")??n.payload.borderWidth};f===void 0&&n.payload.fill!==void 0&&(g.fill=n.payload.fill);let b=this.styleColor(o,"borderColor")??n.payload.borderColorHex;if(b!==void 0&&(g.borderColorHex=b),n.payload.kind!=="line"){let y=this.resolveLevel(n.payload.level,g.fillColorHex);y!==void 0&&(g.level=y)}return g}case"image":{let f={kind:"image",...p,entityId:n.payload.entity.entityId,source:n.payload.source,showTimestamp:n.payload.timestamp===!0,contentMode:n.payload.contentMode,zoom:n.payload.zoom,panX:n.payload.panX,panY:n.payload.panY,cornerRadius:n.payload.cornerRadius,timestampCorner:n.payload.timestampCorner,timestampSize:n.payload.timestampSize};if(Rs(n.payload)&&(f.timestampX=n.payload.timestampX,f.timestampY=n.payload.timestampY),n.payload.source==="inline"){let b=Nf(n.payload);return b!==void 0&&(f.url=b),f.imageBytes=_i(n.payload),f}let g=this.ctx.entityStates.get(n.payload.entity.entityId)?.entityPicture;return g!==void 0&&(f.url=g),f}case"tap":{let f={kind:"tap",...p,shadow:void 0,frame:n.payload.frame,opacity:1,action:this.itemAction(n.payload.action)};return n.payload.openPageId!==void 0&&(f.openPageId=n.payload.openPageId),n.payload.attachedTo!==void 0&&(f.attachedTo=n.payload.attachedTo),f}case"chartTimes":{let f=n.payload;return{kind:"chartTimes",...p,labels:k$(f,this.chartElements.get(f.chart),this.nowMs(),this.timelineElements.get(f.chart)),labelSize:f.labelSize,labelColorHex:f.labelColorHex}}case"imageTime":{let f=n.payload,g=this.imageElements.get(f.image),b={kind:"imageTime",...p,image:f.image,linked:g!==void 0},y=g===void 0?void 0:this.ctx.entityStates.get(g.entity.entityId)?.entityPicture;return y!==void 0&&(b.url=y),b}case"chartDots":{let f=n.payload,g=Kt(f.size),b={kind:"chartDots",...p,chart:f.chart,dots:es(f.dots),diameter:0,indices:[]};return g!==void 0&&(b.size=g),f.colorHex!==void 0&&(b.colorHex=f.colorHex),b}case"chartGrid":{let f=n.payload;return{kind:"chartGrid",...p,chart:f.chart,lines:Ri(f.lines),colorHex:Pn(f.colorHex),thickness:Ai(f.thickness),draws:!1}}case"list":return{kind:"list",...p,cells:this.listCells.get(n.payload.id)??[]}}}itemAction(n){let t=this.currentItem;if(t===void 0)return n;let i=!1,a=s=>s.replace(D$,(l,c)=>{let d=t.fields.get(c);return d===void 0?(i=!0,l):d}),r=s=>s!==void 0&&s.includes(jc);if(n.type==="callService"){let s=n.target;if(!r(n.serviceDataJSON)&&!r(s?.entityId)&&!r(s?.displayName))return n;let l=n.serviceDataJSON===void 0?void 0:a(n.serviceDataJSON),c=s===void 0?void 0:xg(a(s.entityId),a(s.displayName));return i?{type:"none"}:{...n,...l!==void 0?{serviceDataJSON:l}:{},...c!==void 0?{target:c}:{}}}if(!("entityId"in n)||!r(n.entityId)&&!r(n.displayName))return n;let o=xg(a(n.entityId),a(n.displayName));return i?{type:"none"}:{type:n.type,...o}}resolveLayout(n,t,i){let a=n.perFamily[t];this.settleCharts(n);let r=ge[t==="inline"?"rectangular":t],o=gm(n,t);this.settleListItems(o),this.settleListCells(n,o,t,i);let s=[...U$(V$(o.map(k=>this.resolveElement(k,i,t)),r),r)],l=a?this.applyRules(a.rules,i):new Map,c={family:t,elements:s,cornerBodyShape:a?.cornerBodyShape??"wedge",borderWidth:this.styleNumber(l,"borderWidth")??a?.borderWidth??2},d=this.styleText(l,"text"),u=a?.bezelCountdown&&d===void 0?this.countdownEnd(a.bezelText):void 0,p=a?.bezelCountdown?this.countdownFallbackText(a.bezelText):void 0,f=d??p??this.resolve(a?.bezelText);f!==void 0&&(c.bezelText=f),u!==void 0&&(c.bezelCountdownEnd=u);let g=this.resolve(a?.curvedText);if(g!==void 0&&(c.curvedText=g),a?.curvedColorHex!==void 0&&(c.curvedColorHex=a.curvedColorHex),a?.bezelGauge){let k=a.bezelGauge,S=this.resolve(k.value),I=S===void 0?void 0:at(S);if(I!==void 0){let _=Math.min(k.minValue,k.maxValue),E=Math.max(k.minValue,k.maxValue),z={value:Math.min(E,Math.max(_,I)),minValue:_,maxValue:E===_?_+1:E,colorHexes:k.colorHexes},C=this.resolve(k.minLabel);C!==void 0&&(z.minLabel=C);let M=this.resolve(k.maxLabel);M!==void 0&&(z.maxLabel=M),c.bezelGauge=z}}let b=this.styleColor(l,"backgroundColor"),y=b??a?.backgroundColorHex;y!==void 0&&(c.backgroundColorHex=y),b===void 0&&a?.backgroundFill!==void 0&&(c.backgroundFill=a.backgroundFill);let v=this.styleColor(l,"borderColor")??a?.borderColorHex;return v!==void 0&&(c.borderColorHex=v),c}};function O$(e,n,t){let i=new Ot(n,t),a=e.countdown?i.countdownEnd(e.value):void 0,o={text:(e.countdown?i.countdownFallbackText(e.value):void 0)??i.resolve(e.value)??"--"};return e.label&&(o.label=e.label),e.symbol&&(o.symbol=e.symbol),a!==void 0&&(o.countdownEnd=a),o}function Yr(e,n,t){let i=new Ot(n,t),a=Qt(e),r=b=>{if(b===void 0)return;let y=i.resolve(b);return y===void 0||y===""?void 0:y},o=i.resolve(e.title)??"--",s=r(e.valueLabel),l=a==="toggle"?r(e.state):void 0,c=a==="toggle"?qf(l):!1,d={kind:a,title:o,symbol:a==="toggle"&&!c&&e.symbolOff!==void 0&&e.symbolOff!==""?e.symbolOff:e.symbol,isOn:c};s!==void 0&&(d.valueLabel=s);let u=r(e.status);u!==void 0&&(d.status=u);let f=e.coloring==="bands"&&e.bands.length>0?at(s??l??o):void 0,g=f!==void 0?Lr(f,vn(e),e.bandAboveColorHex??ve):e.tintColorHex;return g!==void 0&&(d.tintColorHex=g),d}function en(e,n,t){let i=new Ot(n),a={};for(let r of ue)e.supportedFamilies.includes(r)&&(a[r]=i.resolveLayout(e,r,t));return e.supportedFamilies.includes("inline")&&e.inline&&(a.inline=O$(e.inline,n,e)),a}function _a(e,n){let t=Math.max(0,e.frame.width*n.width),i=Math.max(0,e.frame.height*n.height),a=(e.frame.x+e.frame.width/2)*n.width,r=(e.frame.y+e.frame.height/2)*n.height;return{x:a-t/2,y:r-i/2,w:t,h:i,cx:a,cy:r}}var hu=5,z$=1.7,G$=1.8;function B$(e,n,t,i,a,r){return e==="bars"||t===0?!1:n==="all"||t===1?!0:Math.max(i-a*2,0)/(t-1)>=3*r}function V$(e,n){if(!e.some(r=>r.kind==="chartDots"||r.kind==="chartGrid"))return[...e];let t=new Map;for(let r of e)r.kind==="chart"&&t.set(r.id,r);let i=new Map,a=e.map(r=>{if(r.kind==="chartGrid"){let u=t.get(r.chart);return u===void 0?{...r,draws:!1}:{...r,frame:u.frame,draws:u.values.length>0}}if(r.kind!=="chartDots")return r;let o=t.get(r.chart);if(o===void 0)return{...r,diameter:0,indices:[]};let s=r.size??o.lineWidth*G$,l=Math.max(o.frame.width*n.width,0),c=B$(o.style,r.dots,o.values.length,l,o.lineWidth/2,s);c&&!r.isHidden&&i.set(o.id,Math.max(i.get(o.id)??0,s));let d=c?o.values.map((u,p)=>p).filter(u=>o.holes[u]!==!0&&u!==o.highIndex&&u!==o.lowIndex):[];return{...r,frame:o.frame,diameter:s,indices:d}});return i.size===0?a:a.map(r=>{if(r.kind!=="chart")return r;let o=i.get(r.id);return o===void 0?r:{...r,dotDiameter:o}})}function kg(e){if(e.domainMin<0&&e.domainMax>0)return(0-e.domainMin)/(e.domainMax-e.domainMin)}function $g(e,n){let t=Math.max(0,Math.min(4,Math.round(n))),i=e.plotBottom-e.plotTop;return Array.from({length:t},(a,r)=>e.plotTop+i*(r+1)/(t+1))}function Zs(e,n){let t=e.values,i=Math.max(t.length,1),a=e.highIndex!==void 0?e.highMarker:"none",r=e.lowIndex!==void 0?e.lowMarker:"none",o=n.x,s=Math.max(n.w,0),l=e.style==="bars"?0:e.lineWidth/2,c=e.dotDiameter!==void 0&&e.style!=="bars"?Math.max(l,e.dotDiameter/2):l,d=z=>z==="triangle"?hu+c:z==="dot"?Math.max(c,z$):c,u=d(a),p=d(r),f=n.y+u,g=Math.max(n.h-u-p,1),b=f+g,y=Math.max(e.domainMax-e.domainMin,Number.EPSILON),v=e.baseline==="lowest",k=v?g*.12:0,S=Math.min(Math.max(e.barGap,0),s/(i*2)),I=Math.max((s-S*(i-1))/i,.5),_=z=>Math.min(1,Math.max(0,(z-e.domainMin)/y)),E=z=>b-_(z)*g;return{count:t.length,barWidth:I,plotTop:f,plotBottom:b,plotLeft:o,plotRight:o+s,baselineY:v?b:E(0),inset:c,yAtFraction(z){return b-Math.min(Math.max(z,0),1)*g},barRect(z){let C=o+z*(I+S),M=t[z],K,Y;if(v){let J=k+_(M)*(g-k);K=b-J,Y=b}else K=E(M),Y=v?b:E(0),K>Y&&([K,Y]=[Y,K]);return{x:C,y:K,w:I,h:Math.max(Y-K,.5)}},point(z){let C=Math.max(s-c*2,0);return{x:t.length>1?o+c+C*z/(t.length-1):o+s/2,y:E(t[z])}},markerCenter(z,C,M="high"){let K=C?this.barRect(z):void 0,Y=K?K.x+K.w/2:this.point(z).x,J=M==="high"?a:r,L=M==="high"?J==="triangle"?n.y+hu/2:f:J==="triangle"?n.y+n.h-hu/2:b;return{x:Y,y:L}}}}function Cg(e,n){let t=e.length;if(t<2)return[];let i=[];if(n==="step"){for(let o=0;o<t-1;o++){let s=e[o],l=e[o+1];i.push({kind:"step",start:s,corner:{x:l.x,y:s.y},end:l})}return i}if(n!=="smooth"){for(let o=0;o<t-1;o++)i.push({kind:"straight",start:e[o],end:e[o+1]});return i}let a=[];for(let o=0;o<t-1;o++){let s=e[o+1].x-e[o].x;a.push(s===0?0:(e[o+1].y-e[o].y)/s)}let r=new Array(t).fill(0);r[0]=a[0],r[t-1]=a[t-2];for(let o=1;o<t-1;o++)r[o]=a[o-1]*a[o]<=0?0:(a[o-1]+a[o])/2;for(let o=0;o<t-1;o++){if(a[o]===0){r[o]=0,r[o+1]=0;continue}let s=r[o]/a[o],l=r[o+1]/a[o],c=s*s+l*l;if(c>9){let d=3/Math.sqrt(c);r[o]=d*s*a[o],r[o+1]=d*l*a[o]}}for(let o=0;o<t-1;o++){let s=e[o],l=e[o+1],c=l.x-s.x;i.push({kind:"smooth",start:s,c1:{x:s.x+c/3,y:s.y+r[o]*c/3},c2:{x:l.x-c/3,y:l.y-r[o+1]*c/3},end:l})}return i}function yu(e,n,t=[]){let i=e.length,a=ff(i,n);if(a===0)return e;let r=Math.floor(a/2),o=r/2,s=u=>t[u]===!0,l=e.map((u,p)=>{if(s(p))return u;let f=0,g=0;for(let b=Math.max(0,p-r);b<=Math.min(i-1,p+r);b++){if(s(b))continue;let y=b-p,v=Math.exp(-(y*y)/(2*o*o));f+=e[b]*v,g+=v}return f/g}),c=l.find((u,p)=>!s(p));if(c===void 0)return l;let d=c;return l.map((u,p)=>s(p)?d:(d=u,u))}function Sg(e,n){let t=[],i=[];for(let a=0;a<e;a++)n[a]===!0?(i.length>0&&t.push(i),i=[]):i.push(a);return i.length>0&&t.push(i),t}var jr=1;function Ui(e,n){let t=Math.max(Kn,Math.min(Wn,e.labelSize)),i=t*1.2,a=e.labels.length>0&&n.h-i-jr>=2,r=a?{...n,y:e.labelsAbove?n.y+i+jr:n.y,h:n.h-i-jr,cy:(e.labelsAbove?n.y+i+jr:n.y)+(n.h-i-jr)/2}:n;return{labelSize:t,rowHeight:i,body:r,showsLabels:a}}function U$(e,n){if(!e.some(i=>i.chartAnchor!==void 0))return e;let t=new Map;for(let i of e)i.kind==="chart"&&t.set(i.id,i);return t.size===0?e:e.map(i=>{let a=i.chartAnchor;if(a===void 0)return i;let r=t.get(a.layer);if(r===void 0)return i;if(a.at==="zero"&&kg(r)===void 0)return{...i,isHidden:!0};let o=W$(i.frame,a,r,n);return o===void 0?i:{...i,frame:o}})}function K$(e,n){let t=n.values;if(t.length===0)return;let i=t.map((a,r)=>r).filter(a=>n.holes.length===0||!n.holes[a]);if(i.length!==0)switch(e){case"highest":return i.reduce((a,r)=>t[r]>t[a]?r:a);case"lowest":return i.reduce((a,r)=>t[r]<t[a]?r:a);case"first":return i[0];case"latest":return i[i.length-1];case"now":return n.nowIndex===void 0?void 0:Math.min(Math.max(n.nowIndex,0),t.length-1);case"threshold":return;case"zero":return}}function W$(e,n,t,i){if(i.width<=0||i.height<=0)return;let a=_a(t,i);if(a.w<=0||a.h<=0)return;let r=Ui(t,a).body;if(r.w<=0||r.h<=0)return;let o=Zs(t,r),s,l;if(mn(n.at)){let v=K$(n.at,t);if(v===void 0)return;if(t.style==="bars"){let k=o.barRect(v);s=k.x+k.w/2,l=k.y}else{let k=o.point(v);s=k.x,l=k.y}}else{let v=n.at==="zero"?kg(t):t.thresholdY;if(v===void 0)return;l=o.yAtFraction(v)}let c=Math.max(e.width,0)*i.width,d=Math.max(e.height,0)*i.height,u=.75,p=(v,k,S)=>k>S?(k+S)/2:Math.min(Math.max(v,k),S),f={...e};if(s!==void 0){let v=p(s+(n.dx??0),r.x+c/2,r.x+r.w-c/2);f.x=(v-c/2)/i.width}if(n.place==="through"){if(s!==void 0)f.y=o.plotTop/i.height,f.height=(o.plotBottom-o.plotTop)/i.height;else{f.x=o.plotLeft/i.width,f.width=(o.plotRight-o.plotLeft)/i.width;let v=p(l+(n.dy??0),r.y+d/2,r.y+r.h-d/2);f.y=(v-d/2)/i.height}return f}let g=n.place==="on"?l:n.place==="below"?l+u+d/2:n.place==="bottom"?o.plotBottom-u-d/2:l-u-d/2,b=p(g,r.y+d/2,r.y+r.h-d/2),y=p(b+(n.dy??0),d/2,i.height-d/2);return f.y=(y-d/2)/i.height,f}var bu=[.01,.025,.05,.1];function Pa(e,n){return!(n.width>0&&n.height>0)||n.width===n.height?{x:e,y:e}:n.width>n.height?{x:e*n.height/n.width,y:e}:{x:e,y:e*n.width/n.height}}function xu(e){return typeof e=="number"?{x:e,y:e}:e}function vu(e){return e.x>0&&e.y>0}var Tg=1e-6;function Xr(e,n){return Math.round((e-.5)/n)*n+.5-e}function Eg(e,n,t){let a=[e,e+n/2,e+n].map(r=>Xr(r,t)).reduce((r,o)=>Math.abs(o)<Math.abs(r)?o:r);return de(e+a)}function j$(e,n){let t=xu(n);return vu(t)?Ki({...e,x:Eg(e.x,e.width,t.x),y:Eg(e.y,e.height,t.y)}):e}function q$(e,n,t,i={x:!0,y:!0}){let a=xu(t);if(!vu(a))return e;let{x:r,y:o,width:s,height:l}=e,c=r+s,d=o+l;if(i.x&&n.includes("e")&&(s=Math.max(Ke,de(c+Xr(c,a.x)-r))),i.x&&n.includes("w")){let u=Math.min(de(r+Xr(r,a.x)),c-Ke);s=de(c-u),r=de(u)}if(i.y&&n.includes("s")&&(l=Math.max(Ke,de(d+Xr(d,a.y)-o))),i.y&&n.includes("n")){let u=Math.min(de(o+Xr(o,a.y)),d-Ke);l=de(d-u),o=de(u)}return{...e,x:r,y:o,width:s,height:l}}function wu(e,n,t,i){let a=xu(i);if(!vu(a))return e;let r=(o,s,l)=>{if(s===0)return o;let c=(o-.5)/l,d=s>0?Math.floor(c+Tg)+1:Math.ceil(c-Tg)-1,u=de(d*l+.5);for(let p=0;p<1e3&&(s>0?u<=o:u>=o);p++)d+=s,u=de(d*l+.5);return u};return Ki({...e,x:r(e.x,Math.sign(n),a.x),y:r(e.y,Math.sign(t),a.y)})}var Y$=3;function Ag(e,n=Y$){return{x:e.width>0?n/e.width:0,y:e.height>0?n/e.height:0}}function Fg(e){let n=[{axis:"x",at:.5},{axis:"y",at:.5}];for(let i of e)n.push({axis:"x",at:de(i.x)},{axis:"x",at:de(i.x+i.width/2)},{axis:"x",at:de(i.x+i.width)}),n.push({axis:"y",at:de(i.y)},{axis:"y",at:de(i.y+i.height/2)},{axis:"y",at:de(i.y+i.height)});let t=new Set;return n.filter(i=>{let a=`${i.axis}:${i.at}`;return t.has(a)?!1:(t.add(a),!0)})}function el(e,n,t,i){if(!(i>0))return;let a;for(let r of e)for(let o of n){if(o.axis!==t)continue;let s=o.at-r;Math.abs(s)>i||(a===void 0||Math.abs(s)<Math.abs(a.delta)-1e-9)&&(a={at:o.at,delta:s})}return a}function X$(e,n){let t=n.axis==="x"?e.x:e.y,i=n.axis==="x"?e.width:e.height;return[t,t+i/2,t+i].some(a=>Math.abs(a-n.at)<1e-4)}function J$(e,n,t){let{x:i,y:a}=e,r=t&&el([e.x,e.x+e.width/2,e.x+e.width],t.lines,"x",t.threshold.x),o=t&&el([e.y,e.y+e.height/2,e.y+e.height],t.lines,"y",t.threshold.y);if(r&&(i=de(e.x+r.delta)),o&&(a=de(e.y+o.delta)),n!==void 0){let c=j$(e,n);r||(i=c.x),o||(a=c.y)}let s=Ki({...e,x:i,y:a}),l=[];return r&&l.push({axis:"x",at:r.at}),o&&l.push({axis:"y",at:o.at}),{frame:s,guides:l.filter(c=>X$(s,c))}}function Rg(e,n,t,i,a={x:!0,y:!0}){let r={...e},o=[],s={x:a.x,y:a.y};if(i!==void 0){if(a.x){let l=n.includes("e"),c=el([l?e.x+e.width:e.x],i.lines,"x",i.threshold.x);if(c){if(l)r.width=Math.max(Ke,de(c.at-r.x));else{let d=Math.min(de(c.at),e.x+e.width-Ke);r.width=de(e.x+e.width-d),r.x=d}Math.abs((l?r.x+r.width:r.x)-c.at)<1e-4?(o.push({axis:"x",at:c.at}),s.x=!1):r={...r,x:e.x,width:e.width}}}if(a.y){let l=n.includes("s"),c=el([l?e.y+e.height:e.y],i.lines,"y",i.threshold.y);if(c){if(l)r.height=Math.max(Ke,de(c.at-r.y));else{let d=Math.min(de(c.at),e.y+e.height-Ke);r.height=de(e.y+e.height-d),r.y=d}Math.abs((l?r.y+r.height:r.y)-c.at)<1e-4?(o.push({axis:"y",at:c.at}),s.y=!1):r={...r,y:e.y,height:e.height}}}}return t!==void 0&&(r=q$(r,n,t,s)),{frame:r,guides:o}}var Ke=.04,Qs=.04;function Mg(e,n){let t=()=>{let a=e.getScreenCTM();return a&&a.a!==0&&a.d!==0?{x:a.a,y:a.d}:void 0},i=t()??{x:1,y:1};return a=>(i=t()??i,{x:(a.clientX-n.clientX)/i.x,y:(a.clientY-n.clientY)/i.y})}function tl(e,n){let t={...e,...n};return Ki({...t,x:de(t.x),y:de(t.y),width:Math.max(Ke,de(t.width)),height:Math.max(Ke,de(t.height))})}function ku(e,n){let t=n==="down"?e.x:de((1-e.width)/2),i=n==="across"?e.y:de((1-e.height)/2);return Ki({...e,x:t,y:i})}function Lg(e,n){let t=ku(e,n);return t.x===e.x&&t.y===e.y}function Ki(e){let n=Math.min(1-Qs,Math.max(-e.width+Qs,e.x)),t=Math.min(1-Qs,Math.max(-e.height+Qs,e.y));return{...e,x:n,y:t}}var de=e=>Math.round(e*1e3)/1e3,Ig=10;function nl(e,n,t,i){let a=i.width>0?e.x+n/i.width:e.x,r=i.height>0?e.y+t/i.height:e.y;return Ki({...e,x:de(a),y:de(r)})}function Z$(e,n,t,i){let a=n.width,r=n.height,o=e.width*a,s=e.height*r,l=Math.min(o,s),c=e.x*a+(o-l)/2,d=e.y*r+(s-l)/2,u=t.includes("e")?1:-1,p=t.includes("s")?1:-1,f=Ke*Math.max(a,r),g=Math.max(f,l+(u*i.x+p*i.y)/2),b=u>0?c:c+l-g,y=p>0?d:d+l-g;return{...e,x:de(b/a),y:de(y/r),width:de(g/a),height:de(g/r)}}function Q$(e,n,t,i,a=!1){let r=n.width,o=n.height;if(a||e.width*r>=e.height*o){let p=a?Ke:Math.max(Ke,e.height*o/r),f=e.x+e.width,g=t.includes("e")?Math.max(p,e.width+i.x/r):Math.max(p,e.width-i.x/r),b=t.includes("e")?e.x:f-g;return{...e,x:de(b),width:de(g)}}let l=Math.max(Ke,e.width*r/o),c=e.y+e.height,d=t.includes("s")?Math.max(l,e.height+i.y/o):Math.max(l,e.height-i.y/o),u=t.includes("s")?e.y:c-d;return{...e,y:de(u),height:de(d)}}function il(e,n,t,i,a){let r=Mg(e,t),o={...i.handle&&i.outline?i.outline:i.frame},s={...i.frame};e.setPointerCapture(t.pointerId);let l=g=>Math.round(g*1e3)/1e3,c=[],d=g=>{g.length===0&&c.length===0||g.length===c.length&&g.every((b,y)=>b.axis===c[y].axis&&b.at===c[y].at)||(c=g,a.onGuides?.(g))},u=g=>{if(g.pointerId!==t.pointerId)return;let b=r(g),y=b.x/n.width,v=b.y/n.height,k,S=i.snap!==void 0&&i.snap.on!==g.altKey,I=S?i.snap?.step:void 0,_=S?i.guides:void 0,E=[];if(i.handle)if(i.square)k=Z$(o,n,i.handle,b);else if(i.line||i.bar){if(k=Q$(o,n,i.handle,b,i.bar===!0),S){let z=i.bar===!0||k.width*n.width>=k.height*n.height,C=Rg(k,i.handle,I,_,{x:z,y:!z});k=C.frame,E=C.guides}}else{let{x:z,y:C,width:M,height:K}=o,Y=o.x+o.width,J=o.y+o.height;if(i.handle.includes("e")&&(M=Math.max(Ke,o.width+y)),i.handle.includes("s")&&(K=Math.max(Ke,o.height+v)),i.handle.includes("w")&&(M=Math.max(Ke,o.width-y),z=Y-M),i.handle.includes("n")&&(K=Math.max(Ke,o.height-v),C=J-K),k={...o,x:l(z),y:l(C),width:l(M),height:l(K)},S){let L=Rg(k,i.handle,I,_);k=L.frame,E=L.guides}}else if(k=Ki({...o,x:l(o.x+y),y:l(o.y+v)}),S){let z=J$(k,I,_);k=z.frame,E=z.guides}s=k,d(E),a.onFrame(i.elementId,k,!1)},p=g=>{g.pointerId===t.pointerId&&(f(),a.onFrame(i.elementId,s,!0))},f=()=>{d([]),e.removeEventListener("pointermove",u),e.removeEventListener("pointerup",p),e.removeEventListener("pointercancel",p);try{e.releasePointerCapture(t.pointerId)}catch{}};return e.addEventListener("pointermove",u),e.addEventListener("pointerup",p),e.addEventListener("pointercancel",p),f}function Hg(e,n,t,i,a){let r=Mg(e,n),o=1;e.setPointerCapture(n.pointerId);let s=d=>{if(d.pointerId!==n.pointerId)return;let u=r(d),p=u.x*(t.includes("e")?1:-1),f=u.y*(t.includes("s")?1:-1),g=i.w>0?(i.w+p)/i.w:1,b=i.h>0?(i.h+f)/i.h:1,y=Math.abs(g-1)>=Math.abs(b-1)?g:b;o=Math.max(.05,y),a(o,!1)},l=d=>{d.pointerId===n.pointerId&&(c(),a(o,!0))},c=()=>{e.removeEventListener("pointermove",s),e.removeEventListener("pointerup",l),e.removeEventListener("pointercancel",l);try{e.releasePointerCapture(n.pointerId)}catch{}};return e.addEventListener("pointermove",s),e.addEventListener("pointerup",l),e.addEventListener("pointercancel",l),c}var He=ge,ey=26.5;function ty(e){return Gn.includes(e)}var e0={rectangular:He.rectangular,circular:He.circular,corner:He.corner},Qr=[{label:"40 mm",screen:{width:162,height:197},slots:{rectangular:{width:141,height:51},circular:{width:40,height:40},corner:{width:26,height:26}},measured:!1},{label:"41 mm",screen:{width:176,height:215},slots:{rectangular:{width:153,height:55.5},circular:{width:43,height:43},corner:{width:29,height:29}},measured:!1},{label:"42 mm",screen:{width:187,height:223},slots:{rectangular:{width:163,height:59},circular:{width:46,height:46},corner:{width:31,height:31}},measured:!1},{label:"44 mm",screen:{width:184,height:224},slots:{rectangular:{width:160,height:58},circular:{width:45,height:45},corner:{width:30,height:30}},measured:!1},{label:"45 mm",screen:{width:198,height:242},slots:{rectangular:{width:172,height:62.5},circular:{width:48.5,height:48.5},corner:{width:32,height:32}},measured:!1},{label:"46 mm",screen:{width:208,height:248},slots:e0,measured:!0},{label:"49 mm",screen:{width:205,height:251},slots:{rectangular:{width:178.5,height:64.5},circular:{width:50,height:50},corner:{width:33.5,height:33.5}},measured:!1}],ul=Qr.find(e=>e.measured),t0={rectangular:{width:160,height:72},circular:{width:58,height:58},inline:{width:240,height:20},small:He.small,medium:He.medium,large:He.large,xlarge:He.xlarge},eo=[{label:"iPhone SE",screen:{width:375,height:667},slots:{rectangular:{width:153,height:69},circular:{width:56,height:56},inline:{width:230,height:19},small:{width:148.33,height:148.33},medium:{width:321.67,height:148.33},large:{width:321.67,height:324},xlarge:{width:321.67,height:499.67}},measured:!1},{label:"iPhone 13 mini",screen:{width:375,height:812},slots:{rectangular:{width:153,height:69},circular:{width:56,height:56},inline:{width:230,height:19},small:{width:155.33,height:155.33},medium:{width:329,height:155.33},large:{width:329,height:345},xlarge:{width:329,height:534.67}},measured:!1},{label:"iPhone 15 Pro",screen:{width:393,height:852},slots:t0,measured:!0},{label:"iPhone 15 Pro Max",screen:{width:430,height:932},slots:{rectangular:{width:172,height:77},circular:{width:62,height:62},inline:{width:258,height:21},small:{width:170,height:170},medium:{width:364.33,height:170},large:{width:364.33,height:382},xlarge:{width:364.33,height:592}},measured:!1},{label:"iPhone 17 Pro Max",screen:{width:440,height:956},slots:{rectangular:{width:176,height:79},circular:{width:63,height:63},inline:{width:264,height:21},small:{width:174,height:174},medium:{width:373,height:174},large:{width:373,height:391},xlarge:{width:373,height:606}},measured:!1}],Fu=eo.find(e=>e.measured);function Tn(e,n){return e.slots[n]??He[n]}function ny(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return eo.find(a=>a.screen.width===t&&a.screen.height===i)}function iy(e){if(!e)return;let n=/^(\d+)x(\d+)$/.exec(e.trim());if(!n)return;let t=Number(n[1]),i=Number(n[2]);return Qr.find(a=>a.screen.width===t&&a.screen.height===i)}function pl(e,n){let t=He[n];if(e.width<=0||e.height<=0)return{scale:0,x:0,y:0,width:0,height:0};let i=Math.min(e.width/t.width,e.height/t.height),a=t.width*i,r=t.height*i;return{scale:i,x:(e.width-a)/2,y:(e.height-r)/2,width:a,height:r}}var n0={watch:["accent","plain","picture"],phone:["phonePrimary","phoneAccent"]},Mu=[{label:"Orange",hex:"#FF9F0A"},{label:"Red",hex:"#FF453A"},{label:"Green",hex:"#30D158"},{label:"Blue",hex:"#0A84FF"},{label:"Purple",hex:"#BF5AF2"},{label:"White",hex:"#FFFFFF"}];function i0(e,n="watch",t=!1){let i=e!=="text"&&e!=="imageTime"&&e!=="tap"&&e!=="image";return n==="phone"?t||i?"phoneAccent":"phonePrimary":i||t?"accent":e==="image"?"picture":"plain"}function a0(e){let n=We(e)??{color:"#FFFFFF",opacity:1},t=i=>{let a=parseInt(n.color.slice(1+i*2,3+i*2),16);return Math.round(a+(255-a)*.5).toString(16).padStart(2,"0").toUpperCase()};return`#${t(0)}${t(1)}${t(2)}`}function r0(e,n){let t=e==="phoneAccent"?a0(n):n,i=We(t)??{color:"#FFFFFF",opacity:1},a=d=>(parseInt(i.color.slice(1+d*2,3+d*2),16)/255).toFixed(4),[r,o,s]=e==="plain"?["1","1","1"]:[a(0),a(1),a(2)];return`0 0 0 0 ${r} 0 0 0 0 ${o} 0 0 0 0 ${s} ${e==="picture"||e==="phoneAccent"||e==="phonePrimary"?"0.2126 0.7152 0.0722 0 0":"0 0 0 1 0"}`}function o0(e,n,t){return x`${n0[t].map(i=>x`<filter id=${`${e}-${i}`} filterUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000"
    color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=${r0(i,n)} />${t==="phone"?x`<feComposite in2="SourceGraphic" operator="in" />`:m}</filter>`)}`}function Wi(e,n,t){return t===void 0?e:x`<g filter=${`url(#${t}-${n})`}>${e}</g>`}var s0=0;function l0(e,n,t){if(t===void 0)return e;let i=We(t.colorHex)??{color:"#000000",opacity:1},a=Math.max(0,t.radius)/2;return x`<filter id=${n} filterUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000"
      color-interpolation-filters="sRGB">
      <feDropShadow dx=${t.dx} dy=${t.dy} stdDeviation=${a}
        flood-color=${i.color} flood-opacity=${i.opacity} /></filter>
    <g filter=${`url(#${n})`}>${e}</g>`}function _g(e,n){if(n===void 0||!(n>0))return m;let t=Pa(n,e),i=[],a=n<.025,r=l=>l===0?"rgba(10,132,255,0.6)":a&&l%10!==0?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.14)",o=Math.floor(.5/t.x+1e-6);for(let l=-o;l<=o;l++){let c=(.5+l*t.x)*e.width;c<=0||c>=e.width||i.push(x`<line x1=${c} y1="0" x2=${c} y2=${e.height} stroke=${r(l)} stroke-width="0.5" vector-effect="non-scaling-stroke" />`)}let s=Math.floor(.5/t.y+1e-6);for(let l=-s;l<=s;l++){let c=(.5+l*t.y)*e.height;c<=0||c>=e.height||i.push(x`<line x1="0" y1=${c} x2=${e.width} y2=${c} stroke=${r(l)} stroke-width="0.5" vector-effect="non-scaling-stroke" />`)}return x`<g class="snap-grid" pointer-events="none">${i}</g>`}function Pg(e,n){if(n===void 0||n.length===0)return m;let t=n.map(i=>i.axis==="x"?x`<line x1=${i.at*e.width} y1="0" x2=${i.at*e.width} y2=${e.height}
        stroke="#FF375F" stroke-width="1" vector-effect="non-scaling-stroke" />`:x`<line x1="0" y1=${i.at*e.height} x2=${e.width} y2=${i.at*e.height}
        stroke="#FF375F" stroke-width="1" vector-effect="non-scaling-stroke" />`);return x`<g class="smart-guides" pointer-events="none">${t}</g>`}var sl={regular:400,medium:500,semibold:600,bold:700},Ng={default:"-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif",rounded:"'SF Pro Rounded', 'Varela Round', 'Trebuchet MS', -apple-system, 'Helvetica Neue', sans-serif",monospaced:"ui-monospace, 'SF Mono', Menlo, Monaco, 'Courier New', monospace",serif:"'New York', ui-serif, Georgia, 'Times New Roman', serif"},ll=e=>Ng[e??"default"]??Ng.default,d0={condensed:"75%",compressed:"62.5%",expanded:"125%"};function dl(e,n){let t=[];e&&t.push("font-variant-numeric: tabular-nums");let i=d0[n??"standard"];return i!==void 0&&t.push(`font-stretch: ${i}`),t.length>0?t.join("; "):m}var ay=1.15;function We(e){if(!e)return;let n=e.startsWith("#")?e.slice(1):e;if(!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n))return;let t=n.length===8?parseInt(n.slice(6,8),16)/255:1;return{color:`#${n.slice(0,6)}`,opacity:t}}function be(e,n,t="#FFFFFF"){let i=We(e)??{color:t,opacity:1};return{[n]:i.color,[`${n}-opacity`]:i.opacity}}function c0(e){return[...e.stops].sort((n,t)=>n.at-t.at).map(n=>{let t=We(n.colorHex)??{color:"#FFFFFF",opacity:1};return x`<stop offset=${Math.max(0,Math.min(1,n.at))} stop-color=${t.color} stop-opacity=${t.opacity} />`})}function hl(e){let n=`wafill-${Iu()}`,t=c0(e);if(e.kind==="radial")return{defs:x`<radialGradient id=${n} cx="0.5" cy="0.5" r="0.5">${t}</radialGradient>`,paint:`url(#${n})`};let i=(e.angle??0)*Math.PI/180,a=Math.cos(i)/2,r=Math.sin(i)/2;return{defs:x`<linearGradient id=${n} x1=${.5-a} y1=${.5-r} x2=${.5+a} y2=${.5+r}>${t}</linearGradient>`,paint:`url(#${n})`}}var u0=48;function ry(e,n){if(e===void 0){let a=be(n,"fill");return{defs:m,fill:a.fill,opacity:a["fill-opacity"]}}let{defs:t,paint:i}=hl(e);return{defs:t,fill:i,opacity:1}}var tn=e=>e*.55;function p0(e,n){let t={scale:1,placements:[]},i=n.radius;if(i<=0||e.length===0)return t;let a=n.sweep;if(a===0)return t;let r=i*Math.abs(a)*Math.PI/180,o=e.reduce((b,y)=>b+y,0)+n.spacing*(e.length-1);if(o<=0)return t;let s=o>r?Math.max(.5,r/o):1,l=e.map(b=>b*s),c=n.spacing*s,d=o*s,u=a<0?-1:1,p=180/(Math.PI*i),f=n.angle-u*d*p/2,g=l.map(b=>{let y=f+u*b*p/2;return f+=u*(b+c)*p,{angle:y,rotation:n.flip?y+180:y}});return{scale:s,placements:g}}function oy(e,n,t,i){let a=i*Math.PI/180;return{x:e+t*Math.sin(a),y:n-t*Math.cos(a)}}function h0(e){let n={fontSize:e.fontSize,fontWeight:e.fontWeight,fontDesign:e.fontDesign,fontWidth:e.fontWidth,italic:e.italic,colorHex:e.colorHex},t=e.parts!==void 0&&e.parts.map(s=>s.text).join("")===e.text,i=t?uy(e.parts):void 0,a=t?void 0:ly(e.text,e.spans),r=[],o=0;for(let s of e.text){let l=i?.[o]??(a===void 0?n:{...n,colorHex:a[o]});r.push({text:s,look:l}),o+=s.length}return r}function f0(e,n){let t=oy(0,0,n.anchor-n.radius,n.angle);return{x:e.cx+t.x,y:e.cy+t.y}}function m0(e,n){if(e.arc===void 0||e.text==="")return;let t=h0(e),i=t.map(o=>tn(o.look.fontSize)*o.text.length),a=p0(i,e.arc);if(a.placements.length===0)return;let r=f0(n,e.arc);return{glyphs:t,layout:a,cx:r.x,cy:r.y,radius:e.arc.radius}}function g0(e,n){let t=m0(e,n);if(t===void 0)return m;let{glyphs:i,layout:a,radius:r,cx:o,cy:s}=t;return x`${a.placements.map((l,c)=>{let d=i[c],u=d.look,p=be(u.colorHex,"fill"),f=oy(o,s,r,l.angle);return x`<text x="0" y="0" text-anchor="middle" dominant-baseline="central"
      transform=${`translate(${f.x} ${f.y}) rotate(${l.rotation})`}
      font-family=${ll(u.fontDesign)} font-style=${u.italic?"italic":"normal"}
      font-size=${u.fontSize*a.scale} font-weight=${sl[u.fontWeight]??400}
      style=${dl(e.monospacedDigits,u.fontWidth)}
      fill=${p.fill} fill-opacity=${p["fill-opacity"]}>${d.text}</text>`})}`}function sy(e,n){switch(e){case"leading":return{anchor:"start",x:n.x};case"trailing":return{anchor:"end",x:n.x+n.w};default:return{anchor:"middle",x:n.cx}}}function y0(e,n,t){let i=e.split(/\s+/).filter(s=>s!==""),a=Math.max(1,Math.min(t,i.length));if(a<2)return[e];let r=[],o=0;for(let s=0;s<a-1;s++){let l=i.length-(a-1-s)-1,c=i[o],d=o+1;for(let u=o+1;u<=l;u++){let p=`${c} ${i[u]}`;if(p.length>n)break;c=p,d=u+1}r.push(c),o=d}return r.push(i.slice(o).join(" ")),r}function b0(e,n,t){if(t<=0||e.length*tn(n)<=t)return e;let i=t-.8*n,a=Math.max(1,Math.floor(i/tn(n)));return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function ly(e,n){if(!n||n.map(i=>i.text).join("")!==e)return;let t=[];for(let i of n)for(let a=0;a<i.text.length;a++)t.push(i.colorHex);return t}function dy(e,n){if(n.length<2)return[0];let t=[...e.matchAll(/\S+/g)].map(i=>i.index);return[t[0]??0,t[n[0].split(" ").length]??e.length]}function cy(e,n,t,i,a){let r=[],o=n,s=a,l=c=>c<t.length&&/\s/.test(t[c]);for(let c of e){let d=s;if(/\s/.test(c))for(l(o)&&(d=i[o]);l(o);)o++;else{for(;l(o);)o++;t.startsWith(c,o)&&(d=i[o],o+=c.length)}s=d;let u=r.at(-1);u&&u.look===d?u.text+=c:r.push({text:c,look:d})}return r}function uy(e){let n=[];for(let t of e){let i=t.spans!==void 0&&t.spans.map(a=>a.text).join("")===t.text?t.spans:[{text:t.text,colorHex:t.colorHex}];for(let a of i){let r={fontSize:t.fontSize,fontWeight:t.fontWeight,fontDesign:t.fontDesign,fontWidth:t.fontWidth,italic:t.italic,colorHex:a.colorHex};for(let o=0;o<a.text.length;o++)n.push(r)}}return n}function py(e,n){return e.reduce((t,i)=>t+i.text.length*tn(i.look.fontSize*n),0)}function x0(e,n,t,i){let a=[...e.matchAll(/\S+/g)],r=Math.max(1,Math.min(i,a.length));if(r<2)return[e];let o=d=>n[d]?.fontSize??0,s=d=>d.map(u=>u[0]).join(" "),l=[],c=0;for(let d=0;d<r-1;d++){let u=a.length-(r-1-d)-1,p=0,f=c;for(let g=c;g<=u;g++){let b=a[g].index??0,y=g===c?0:tn(o(b-1));for(let v=b;v<b+a[g][0].length;v++)y+=tn(o(v));if(g>c&&p+y>t)break;p+=y,f=g+1}l.push(s(a.slice(c,f))),c=f}return l.push(s(a.slice(c))),l}function v0(e,n,t){if(t<=0||py(e,n)<=t)return[...e];let i=[],a=0,r=0;e:for(let s of e){let l=s.look.fontSize*n,c=t-.8*l,d="";for(let u of s.text){if(r>0&&a+u.length*tn(l)>c){d!==""&&i.push({text:d,look:s.look});break e}d+=u,a+=u.length*tn(l),r+=1}i.push({text:d,look:s.look})}for(;i.length>0;){let s=i.at(-1);if(s.text=s.text.replace(/\s+$/,""),s.text!=="")break;i.pop()}let o=i.at(-1);return o?o.text+="\u2026":e[0]&&i.push({text:"\u2026",look:e[0].look}),i}function w0(e,n,t){let i=uy(n),a=e.lineLimit>1&&t.w>0?x0(e.text,i,t.w,e.lineLimit):[e.text],r=dy(e.text,a),o=a.map((k,S)=>cy(k,r[S]??0,e.text,i,i[0])),s=Math.max(...o.map(k=>py(k,1))),l=s>t.w&&t.w>0?Math.max(e.minimumScale,t.w/s):1,c=o.map(k=>v0(k,l,t.w)),{anchor:d,x:u}=sy(e.alignment,t),p=Math.max(0,...c.flat().map(k=>k.look.fontSize))*l||e.fontSize*l,f=.35*p,g=p*1.15,b=k=>k.map(S=>{let I=be(S.look.colorHex,"fill");return x`<tspan font-size=${S.look.fontSize*l} font-weight=${sl[S.look.fontWeight]??400}
      font-family=${ll(S.look.fontDesign)} font-style=${S.look.italic?"italic":"normal"}
      style=${dl(!1,S.look.fontWidth)}
      fill=${I.fill} fill-opacity=${I["fill-opacity"]}>${S.text}</tspan>`}),y=be(e.colorHex,"fill"),v=c.length>1?x`${c.map((k,S)=>x`<tspan x=${u} y=${t.cy+f+(S-(c.length-1)/2)*g}>${b(k)}</tspan>`)}`:b(c[0]);return x`<text x=${u} y=${t.cy+f} text-anchor=${d}
    font-family=${ll(e.fontDesign)} font-style=${e.italic?"italic":"normal"}
    font-size=${e.fontSize*l} font-weight=${sl[e.fontWeight]??400}
    style=${dl(e.monospacedDigits,e.fontWidth)}
    fill=${y.fill} fill-opacity=${y["fill-opacity"]}>${v}</text>`}function k0(e,n){if(e.arc!==void 0)return g0(e,n);if(e.parts!==void 0&&e.countdownEnd===void 0&&e.parts.map(b=>b.text).join("")===e.text)return e.text===""?m:w0(e,e.parts,n);let t=be(e.colorHex,"fill");e.countdownEnd!==void 0&&e.countdownEnd>Date.now()&&(e={...e,text:Ha((e.countdownEnd-Date.now())/1e3)});let i=e.lineLimit>1&&n.w>0?y0(e.text,n.w/tn(e.fontSize),e.lineLimit):[e.text],a=Math.max(...i.map(b=>b.length))*tn(e.fontSize),r=a>n.w&&n.w>0?Math.max(e.minimumScale,n.w/a):1,o=e.fontSize*r,s=i.map(b=>b0(b,o,n.w)),{anchor:l,x:c}=sy(e.alignment,n),d=ly(e.text,e.spans),u=d?dy(e.text,i):[],p=(b,y)=>d?cy(b,u[y]??0,e.text,d,e.colorHex).map(v=>{let k=be(v.look,"fill");return x`<tspan fill=${k.fill} fill-opacity=${k["fill-opacity"]}>${v.text}</tspan>`}):b,f=o*1.15,g=s.length>1?x`${s.map((b,y)=>x`<tspan x=${c} y=${n.cy+(y-(s.length-1)/2)*f}>${p(b,y)}</tspan>`)}`:p(s[0],0);return x`<text x=${c} y=${n.cy} text-anchor=${l} dominant-baseline="central"
    font-family=${ll(e.fontDesign)} font-style=${e.italic?"italic":"normal"}
    font-size=${o} font-weight=${sl[e.fontWeight]??400}
    style=${dl(e.monospacedDigits,e.fontWidth)}
    fill=${t.fill} fill-opacity=${t["fill-opacity"]}>${g}</text>`}var Tu=2;function Lu(e,n){let t=n.w>=n.h,i=Math.max(1,e.dotCount),a=t?n.w:n.h,r=t?n.h:n.w,o=Math.max(1,Math.min(r,a/i-Tu)),s=i*o+(i-1)*Tu;return{horizontal:t,count:i,d:o,span:s}}function fl(e){return e==="ring"?{start:-90,sweep:360}:{start:135,sweep:270}}function $0(e,n){let t=be(e.colorHex,"stroke"),i=be(e.trackColorHex,"stroke","#FFFFFF"),a=be(e.thresholdColorHex,"stroke","#FFFFFF"),r=e.lineWidth;if(e.style==="dots"){let{horizontal:y,count:v,d:k,span:S}=Lu(e,n),I=(y?n.cx:n.cy)-S/2+k/2;return x`${Array.from({length:v},(_,E)=>{let z=I+E*(k+Tu),C=E<e.filledCount?e.fill===void 0?t:be(Yt(e.fill,v<=1?0:E/(v-1)),"stroke"):i;return x`<circle cx=${y?z:n.cx} cy=${y?n.cy:z} r=${k/2}
        fill=${C.stroke} fill-opacity=${C["stroke-opacity"]} />`})}${Dg(e,n)}`}if(e.style==="bar"){let y=n.w,v=Math.max(r,y*e.fraction),k=1,S=ry(e.fill,e.colorHex);return x`
      ${S.defs===m?m:x`<defs>${S.defs}</defs>`}
      <rect x=${n.x} y=${n.cy-r/2} width=${y} height=${r} rx=${r/2}
        fill=${i.stroke} fill-opacity=${i["stroke-opacity"]} />
      <rect x=${n.x} y=${n.cy-r/2} width=${v} height=${r} rx=${r/2}
        fill=${S.fill} fill-opacity=${S.opacity} />
      ${e.thresholdFraction===void 0?m:x`<rect x=${n.x+Math.min(y-k,Math.max(0,y*e.thresholdFraction-k/2))}
            y=${n.cy-r/2} width=${k} height=${r}
            fill=${a.stroke} fill-opacity=${a["stroke-opacity"]} />`}
      ${Dg(e,n)}`}let o=Math.min(n.w,n.h),s=Math.max(0,o/2-r/2),l=2*Math.PI*s,c=fl(e.style),d=c.sweep/360,u=c.start,p=l*d,f=l*d*e.fraction,g=x`${S0(e,n,s,r)}${T0(e,n,s,r)}`;if(e.style==="needle")return x`
      <g transform="rotate(${u} ${n.cx} ${n.cy})">
        <circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
          stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
          stroke-dasharray="${p} ${l}" />
        ${e.thresholdFraction===void 0?m:Og(n,s,r,c.sweep*e.thresholdFraction,e.thresholdColorHex)}
      </g>
      ${E0(e,n,s,r)}
      ${g}`;let b=e.fill===void 0?x`<circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${t.stroke} stroke-opacity=${t["stroke-opacity"]}
        stroke-dasharray="${f} ${l}" />`:C0(e.fill,n,s,r,c,e.fraction);return x`
    <g transform="rotate(${u} ${n.cx} ${n.cy})">
      <circle cx=${n.cx} cy=${n.cy} r=${s} fill="none" stroke-width=${r} stroke-linecap="round"
        stroke=${i.stroke} stroke-opacity=${i["stroke-opacity"]}
        stroke-dasharray="${p} ${l}" />
      ${e.fraction>0?b:m}
      ${e.thresholdFraction===void 0?m:Og(n,s,r,c.sweep*e.thresholdFraction,e.thresholdColorHex)}
    </g>
    ${g}`}function C0(e,n,t,i,a,r){let o=Math.max(0,Math.min(1,r)),s=Math.max(1,Math.round(u0*o)),l=a.sweep*o/s,c=d=>{let u=d*Math.PI/180;return{x:n.cx+Math.cos(u)*t,y:n.cy+Math.sin(u)*t}};return x`${Array.from({length:s},(d,u)=>{let p=c(u*l-(u===0?0:.2)),f=c((u+1)*l),g=We(Yt(e,(u+.5)*l/a.sweep))??{color:"#FFFFFF",opacity:1};return x`<path d=${`M${p.x} ${p.y} A ${t} ${t} 0 0 1 ${f.x} ${f.y}`} fill="none"
      stroke-width=${i} stroke-linecap=${u===0||u===s-1?"round":"butt"}
      stroke=${g.color} stroke-opacity=${g.opacity} />`})}`}function S0(e,n,t,i){if(e.tickCount<=0)return m;let a=be(e.tickColorHex,"stroke"),r=fl(e.style==="ring"?"ring":e.style==="needle"?"needle":"arc"),o=e.tickCount,s=e.style==="ring"?o:Math.max(1,o-1);return x`${Array.from({length:o},(l,c)=>{let d=e.tickMajorEvery>0&&c%e.tickMajorEvery===0,u=e.tickLength*(d?1.6:1),p=(r.start+r.sweep*c/s)*Math.PI/180,f=Math.cos(p),g=Math.sin(p),b=t-i/2-.5,y=Math.max(0,b-u);return x`<line x1=${n.cx+f*y} y1=${n.cy+g*y}
      x2=${n.cx+f*b} y2=${n.cy+g*b}
      stroke-width=${d?1.2:.8} stroke-linecap="round"
      stroke=${a.stroke} stroke-opacity=${a["stroke-opacity"]} />`})}`}function T0(e,n,t,i){if(!e.showsLabels)return m;let a=be(e.labelColorHex,"fill"),r=fl(e.style==="ring"?"ring":e.style==="needle"?"needle":"arc"),o=e.labelSize,s=d=>{let u=d*Math.PI/180,p=Math.max(0,t-i/2-o*.7);return{x:n.cx+Math.cos(u)*p,y:n.cy+Math.sin(u)*p+o*.36}},l=e.style==="ring"?m:x`${[[r.start,Fr(e.minValue)],[r.start+r.sweep,Fr(e.maxValue)]].map(([d,u])=>{let p=s(d);return x`<text x=${p.x} y=${p.y} text-anchor="middle" font-size=${o} font-family=${cl}
          fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${u}</text>`})}`,c=e.style==="needle"&&e.valueText!==""?x`<text x=${n.cx} y=${n.cy+t*.55+o*.36} text-anchor="middle" font-size=${o*1.2} font-weight="600" font-family=${cl}
        fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${e.valueText}</text>`:m;return x`${l}${c}`}var cl="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif";function E0(e,n,t,i){let a=fl("needle"),r=(a.start+a.sweep*Math.max(0,Math.min(1,e.fraction)))*Math.PI/180,o=Math.max(0,t-i/2-1),s=be(e.fill===void 0?e.colorHex:Yt(e.fill,e.fraction),"fill"),l=Math.max(1,i*.8);return x`
    <line x1=${n.cx} y1=${n.cy} x2=${n.cx+Math.cos(r)*o} y2=${n.cy+Math.sin(r)*o}
      stroke-width=${i} stroke-linecap="round" stroke=${s.fill} stroke-opacity=${s["fill-opacity"]} />
    <circle cx=${n.cx} cy=${n.cy} r=${l} fill=${s.fill} fill-opacity=${s["fill-opacity"]} />`}function Dg(e,n){let t=e.style==="dots"?Lu(e,n).d:e.lineWidth,i=e.tickCount>0?x`${(()=>{let s=be(e.tickColorHex,"stroke"),l=Math.max(1,e.tickCount-1);return Array.from({length:e.tickCount},(c,d)=>{let u=e.tickMajorEvery>0&&d%e.tickMajorEvery===0,p=e.tickLength*(u?1.6:1),f=n.x+n.w*d/l,g=n.cy+t/2+.5;return x`<line x1=${f} y1=${g} x2=${f} y2=${g+p}
            stroke-width=${u?1.2:.8} stroke-linecap="round"
            stroke=${s.stroke} stroke-opacity=${s["stroke-opacity"]} />`})})()}`:m;if(!e.showsLabels)return x`${i}`;let a=be(e.labelColorHex,"fill"),r=e.labelSize,o=n.cy+t/2+(e.tickCount>0?e.tickLength*1.6:0)+r;return x`${i}
    <text x=${n.x} y=${o} text-anchor="start" font-size=${r} font-family=${cl}
      fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${Fr(e.minValue)}</text>
    <text x=${n.x+n.w} y=${o} text-anchor="end" font-size=${r} font-family=${cl}
      fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${Fr(e.maxValue)}</text>`}function Og(e,n,t,i,a){let r=be(a,"stroke","#FFFFFF"),o=i*Math.PI/180,s=Math.cos(o),l=Math.sin(o),c=t/2+1;return x`<line x1=${e.cx+s*(n-c)} y1=${e.cy+l*(n-c)}
    x2=${e.cx+s*(n+c)} y2=${e.cy+l*(n+c)}
    stroke-width="1" stroke=${r.stroke} stroke-opacity=${r["stroke-opacity"]} />`}function R0(e,n){let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=Ui(e,n),o=r?Hu(e,n,t,i):void 0;if(e.values.length===0)return o===void 0?m:x`${o}`;let s=F0(e,a);return o===void 0?s:x`${s}${o}`}function $u(e){switch(e.kind){case"smooth":return`C${e.c1.x} ${e.c1.y} ${e.c2.x} ${e.c2.y} ${e.end.x} ${e.end.y}`;case"step":return`L${e.corner.x} ${e.corner.y} L${e.end.x} ${e.end.y}`;case"straight":return`L${e.end.x} ${e.end.y}`}}var zg=0;function Iu(){return zg+=1,zg.toString(36)}function al(e,n,t){let{x:i,y:a,w:r,h:o}=e,s=Math.max(0,n);if(s===0)return`M${i} ${a} L${i+r} ${a} L${i+r} ${a+o} L${i} ${a+o} Z`;if(s>o){let l=Math.sqrt(o*(2*s-o)),c=i+s-l,d=i+r-s+l;return t?`M${c} ${a} L${d} ${a} A${s} ${s} 0 0 1 ${i+r-s} ${a+o} L${i+s} ${a+o} A${s} ${s} 0 0 1 ${c} ${a} Z`:`M${c} ${a+o} A${s} ${s} 0 0 1 ${i+s} ${a} L${i+r-s} ${a} A${s} ${s} 0 0 1 ${d} ${a+o} Z`}return t?`M${i} ${a} L${i+r} ${a} L${i+r} ${a+o-s} A${s} ${s} 0 0 1 ${i+r-s} ${a+o} L${i+s} ${a+o} A${s} ${s} 0 0 1 ${i} ${a+o-s} Z`:`M${i} ${a+o} L${i} ${a+s} A${s} ${s} 0 0 1 ${i+s} ${a} L${i+r-s} ${a} A${s} ${s} 0 0 1 ${i+r} ${a+s} L${i+r} ${a+o} Z`}function A0(e,n,t,i){let a=n.x,r=n.x+n.w;if(i){let l=e.y,c=n.y+n.h;return t===0?`M${a} ${l} L${a} ${c} L${r} ${c} L${r} ${l}`:`M${a} ${l} L${a} ${c-t} A${t} ${t} 0 0 0 ${a+t} ${c} L${r-t} ${c} A${t} ${t} 0 0 0 ${r} ${c-t} L${r} ${l}`}let o=e.y+e.h,s=n.y;return t===0?`M${a} ${o} L${a} ${s} L${r} ${s} L${r} ${o}`:`M${a} ${o} L${a} ${s+t} A${t} ${t} 0 0 1 ${a+t} ${s} L${r-t} ${s} A${t} ${t} 0 0 1 ${r} ${s+t} L${r} ${o}`}function F0(e,n){let t=Zs(e,n),i=Iu(),a=be(e.colorHex,"fill"),r=be(e.highColorHex,"fill",e.colorHex),o=be(e.lowColorHex,"fill",e.colorHex),s=(y,v)=>x`<circle cx=${y.x} cy=${y.y} r="1.7" fill=${v.fill} fill-opacity=${v["fill-opacity"]} />`,l=[],c=new Map,d=e.pointColorHexes.length===t.count,u=y=>d?be(e.pointColorHexes[y],"fill",e.colorHex):a,p=y=>{let v=We(y)??We(e.colorHex)??{color:"#FFFFFF",opacity:1};if(e.fillStyle!=="fade")return{fill:v.color,opacity:v.opacity*.28};let k=M0(i,e.id,y),S=t.baselineY<=t.plotTop?t.plotBottom:t.plotTop;return c.has(k)||c.set(k,x`<linearGradient id=${k} gradientUnits="userSpaceOnUse" x1="0" y1=${S} x2="0" y2=${t.baselineY}>
        <stop offset="0" stop-color=${v.color} stop-opacity=${v.opacity*.28} />
        <stop offset="1" stop-color=${v.color} stop-opacity="0" /></linearGradient>`),{fill:`url(#${k})`,opacity:1}},f,g=y=>{if(f===void 0){let v=hl(y);c.set("areaFill",v.defs),f={fill:v.paint,opacity:1}}return f};if(e.style==="bars")for(let y=0;y<t.count;y++){if(e.holes[y]===!0)continue;let v=t.barRect(y),k=e.barFillColorHexes.length===t.count?e.barFillColorHexes[y]:void 0,S=k!==void 0?be(k,"fill",e.colorHex):y===e.highIndex?r:y===e.lowIndex?o:u(y),I=e.barCorners==="top"?Math.min(Math.max(e.barRadius,0),v.w/2):Math.min(Math.max(e.barRadius,0),v.w/2,v.h/2),_=e.baseline==="zero"&&e.values[y]<0,E=e.barCorners==="top"&&_,z=e.barBorderWidth>0&&e.barBorderColorHexes.length===t.count?e.barBorderColorHexes[y]:void 0,C=e.barBorderWidth,M=z!==void 0&&(v.w<=2*C||v.h<=2*C),K=M?be(z,"fill",e.colorHex):S;if(e.barCorners==="top"?l.push(x`<path d=${al(v,I,E)}
          fill=${K.fill} fill-opacity=${K["fill-opacity"]} />`):l.push(x`<rect x=${v.x} y=${v.y} width=${v.w} height=${v.h} rx=${I}
          fill=${K.fill} fill-opacity=${K["fill-opacity"]} />`),z!==void 0&&!M){let Y=be(z,"fill",e.colorHex),J={x:v.x+C/2,y:v.y+C/2,w:v.w-C,h:v.h-C},L=e.barCorners==="top"?Math.min(Math.max(I-C/2,0),J.w/2):Math.min(Math.max(I-C/2,0),J.w/2,J.h/2);if(e.barBorderOpenBase){let ne=`${i}bb${y}`,D=e.barCorners==="top"?x`<path d=${al(v,I,E)} />`:x`<rect x=${v.x} y=${v.y} width=${v.w} height=${v.h} rx=${I} />`;c.set(ne,x`<clipPath id=${ne}>${D}</clipPath>`),l.push(x`<path d=${A0(v,J,L,_)} fill="none" stroke=${Y.fill} stroke-opacity=${Y["fill-opacity"]} stroke-width=${C} clip-path=${`url(#${ne})`} />`);continue}let X=e.barCorners==="top"?al(J,L,E):al(J,0,!1);e.barCorners==="top"||L===0?l.push(x`<path d=${X} fill="none" stroke=${Y.fill} stroke-opacity=${Y["fill-opacity"]} stroke-width=${C} />`):l.push(x`<rect x=${J.x} y=${J.y} width=${J.w} height=${J.h} rx=${L}
            fill="none" stroke=${Y.fill} stroke-opacity=${Y["fill-opacity"]} stroke-width=${C} />`)}}else{let y=Array.from({length:t.count},(I,_)=>t.point(_)),v=e.holes.length>0,S=Sg(t.count,e.holes).filter(I=>!v||I.length>1).map(I=>{let _=I.map(C=>y[C]),E=Cg(_,e.curve),z=`M${_[0].x} ${_[0].y}${E.map(C=>` ${$u(C)}`).join("")}`;return{run:I,pts:_,legs:E,line:z}});if(e.style==="area")for(let{run:I,pts:_,legs:E,line:z}of S)if(e.fillBands&&d&&I.length>1&&e.fillColorHex===void 0)for(let C=0;C<E.length;C++){let M=_[C],K=_[C+1],Y=p(e.pointColorHexes[I[C+1]]),J=`M${M.x} ${M.y} ${$u(E[C])} L${K.x} ${t.baselineY} L${M.x} ${t.baselineY} Z`;l.push(x`<path d=${J} fill=${Y.fill} fill-opacity=${Y.opacity} stroke="none" />`)}else{let C=e.areaFill===void 0?p(e.fillColorHex??e.colorHex):g(e.areaFill),M=`${z} L${_[_.length-1].x} ${t.baselineY} L${_[0].x} ${t.baselineY} Z`;l.push(x`<path d=${M} fill=${C.fill} fill-opacity=${C.opacity} stroke="none" />`)}for(let{run:I,pts:_,legs:E,line:z}of S)if(d&&I.length>1)for(let C=0;C<E.length;C++){let M=_[C],K=u(I[C+1]);l.push(x`<path d=${`M${M.x} ${M.y} ${$u(E[C])}`} fill="none"
            stroke=${K.fill} stroke-opacity=${K["fill-opacity"]}
            stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`)}else l.push(x`<path d=${z} fill="none" stroke=${a.fill} stroke-opacity=${a["fill-opacity"]}
          stroke-width=${e.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);e.highIndex!==void 0&&l.push(s(y[e.highIndex],r)),e.lowIndex!==void 0&&l.push(s(y[e.lowIndex],o))}let b=(y,v,k,S)=>{if(y===void 0||v==="none")return;let I=t.markerCenter(y,e.style==="bars",S);l.push(v==="triangle"?x`<path d=${`M${I.x} ${I.y-1.8} L${I.x+2.2} ${I.y+1.8} L${I.x-2.2} ${I.y+1.8} Z`}
          fill=${k.fill} fill-opacity=${k["fill-opacity"]} />`:s(I,k))};if(b(e.highIndex,e.highMarker,r,"high"),b(e.lowIndex,e.lowMarker,o,"low"),e.drawsThreshold&&e.thresholdY!==void 0){let y=t.yAtFraction(e.thresholdY),v=be(e.thresholdColorHex,"fill",e.colorHex);l.push(x`<path d=${`M${t.plotLeft} ${y} L${t.plotRight} ${y}`} fill="none"
      stroke=${v.fill} stroke-opacity=${v["fill-opacity"]}
      stroke-width="1" stroke-dasharray="2 2" />`)}if(e.drawsNowLine&&e.nowIndex!==void 0&&e.nowIndex<t.count){let y=t.markerCenter(e.nowIndex,e.style==="bars").x,v=be(e.nowColorHex,"fill",e.colorHex);l.push(x`<path d=${`M${y} ${t.plotTop} L${y} ${t.plotBottom}`} fill="none"
      stroke=${v.fill} stroke-opacity=${v["fill-opacity"]} stroke-width="1" />`)}return c.size===0?x`${l}`:x`<defs>${[...c.values()]}</defs>${l}`}function M0(e,n,t){return`chartfade-${e}-${n}-${t}`.replace(/[^0-9A-Za-z_-]/g,"")}function Hu(e,n,t,i){let a=(e.labelsAbove?n.y:n.y+n.h-i)+i/2,r=be(e.labelColorHex,"fill");return e.labels.map((o,s)=>{let c=s===e.labels.length-1?"end":s===0?"start":"middle",d=n.x+o.position*n.w;return x`<text x=${d} y=${a} text-anchor=${c} dominant-baseline="central"
      font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
      font-size=${t} font-weight="400"
      fill=${r.fill} fill-opacity=${r["fill-opacity"]}>${o.text}</text>`})}function L0(e,n){if(e.runs.length===0&&e.labels.length===0||n.w<=0||n.h<=0)return m;let{labelSize:t,rowHeight:i,body:a,showsLabels:r}=Ui(e,n),o=Math.max(0,Math.min(e.gap,n.w/Math.max(1,e.runs.length))),s=e.runs.map((l,c)=>{let d=n.x+l.start*n.w,u=(l.end-l.start)*n.w,p=c===e.runs.length-1,f=Math.max(p?u:Math.min(u,.5),u-(p?0:o)),g=Math.max(0,Math.min(e.cornerRadius,f/2,a.h/2)),b=be(l.colorHex,"fill");return x`<rect x=${d} y=${a.y} width=${f} height=${a.h} rx=${g}
      fill=${b.fill} fill-opacity=${b["fill-opacity"]} />`});return r?x`${s}${Hu(e,n,t,i)}`:x`${s}`}function I0(e,n){if(e.labels.length===0||n.w<=0||n.h<=0)return m;let{labelSize:t,rowHeight:i}=Ui({labels:e.labels,labelSize:e.labelSize,labelsAbove:!1},n),a={...n,y:n.cy-i/2,h:i};return x`${Hu({labels:e.labels,labelColorHex:e.labelColorHex,labelsAbove:!1},a,t,i)}`}function hy(e,n){if(!(e===void 0||n.w<=0||n.h<=0))return{chart:e,g:Zs(e,Ui(e,n).body)}}function H0(e,n,t,i=!1,a=0){let r=hy(t,n);if(e.indices.length===0||r===void 0)return m;let o=r.chart,s=o.pointColorHexes.length===o.values.length,l=Math.max(e.diameter/2,a),c=new Map,d=l+1.2,u="";for(let f of e.indices){if(f>=o.values.length)continue;let g=r.g.point(f),b=e.colorHex??(s?o.pointColorHexes[f]:o.colorHex);c.set(b,`${c.get(b)??""}M${g.x-l} ${g.y} a${l} ${l} 0 1 0 ${2*l} 0 a${l} ${l} 0 1 0 ${-2*l} 0 Z`),i&&(u+=`M${g.x-d} ${g.y} a${d} ${d} 0 1 0 ${2*d} 0 a${d} ${d} 0 1 0 ${-2*d} 0 Z`)}let p=i&&u!==""?x`<path d=${u} fill="none" stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:m;return x`${p}${[...c].map(([f,g])=>{let b=be(f,"fill",o.colorHex);return x`<path d=${g} fill=${b.fill} fill-opacity=${b["fill-opacity"]} stroke="transparent" stroke-width="3" />`})}`}function _0(e,n,t,i=!1,a=0){let r=hy(t,n);if(!e.draws||r===void 0)return m;let o=We(e.colorHex)??{color:"#FFFFFF",opacity:.2},s=$g(r.g,e.lines);return x`${s.map(l=>x`<path d=${`M${r.g.plotLeft} ${l} L${r.g.plotRight} ${l}`} fill="none"
    stroke=${o.color} stroke-opacity=${Math.max(o.opacity,a>0?.6:0)} stroke-width=${Math.max(e.thickness,a)} />`)}${i?s.map(l=>x`<path d=${`M${r.g.plotLeft} ${l} L${r.g.plotRight} ${l}`} fill="none" stroke="#0A84FF"
        stroke-width="1" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />`):m}`}function Gg(e){let n=Math.min(e.w,e.h);return{x:e.cx-n/2,y:e.cy-n/2,w:n,h:n,cx:e.cx,cy:e.cy}}var Jr=4;function P0(e,n){let t=e.w>=e.h,i=t?e.h:e.w,a=Math.min(i,Math.max(Jr,Math.max(0,n)));return t?{x:e.x,y:e.cy-a/2,w:e.w,h:a,cx:e.cx,cy:e.cy}:{x:e.cx-a/2,y:e.y,w:a,h:e.h,cx:e.cx,cy:e.cy}}function ml(e,n){if(e.kind==="shape")return e.shapeKind==="circle"?Gg(n):e.shapeKind==="line"?P0(n,e.thickness):n;if(e.kind==="icon"){let t=Math.max(Jr,_u(e));return{x:n.cx-t/2,y:n.cy-t/2,w:t,h:t,cx:n.cx,cy:n.cy}}if(e.kind==="chartTimes"){if(e.labels.length===0||n.w<=0||n.h<=0)return n;let{rowHeight:t}=Ui({labels:e.labels,labelSize:e.labelSize,labelsAbove:!1},n),i=Math.max(Jr,t);return{x:n.x,y:n.cy-i/2,w:n.w,h:i,cx:n.cx,cy:n.cy}}if(e.kind==="imageTime"){let t=Nc(n.w,n.h);if(!e.linked||t<=0)return n;let i=Nu(new Date).length*t*.578+t*.89,a=t*1.25;return{x:n.cx-i/2,y:n.cy-a/2,w:i,h:a,cx:n.cx,cy:n.cy}}if(e.kind!=="gauge")return n;switch(e.style){case"ring":case"arc":return Gg(n);case"bar":{let t=Math.max(Jr,e.lineWidth);return{x:n.x,y:n.cy-t/2,w:n.w,h:t,cx:n.cx,cy:n.cy}}case"dots":{let{horizontal:t,d:i,span:a}=Lu(e,n),r=Math.max(Jr,i);return t?{x:n.cx-a/2,y:n.cy-r/2,w:a,h:r,cx:n.cx,cy:n.cy}:{x:n.cx-r/2,y:n.cy-a/2,w:r,h:a,cx:n.cx,cy:n.cy}}default:return n}}function fy(e,n,t){return e.kind==="shape"?e.shapeKind==="circle"?{square:!0}:e.shapeKind==="line"?{line:!0}:{}:e.kind==="chartTimes"?{bar:!0}:e.kind==="imageTime"?Bg(e,n,t):e.kind!=="gauge"?{}:e.style==="ring"||e.style==="arc"?{square:!0}:e.style==="bar"?{bar:!0}:e.style!=="dots"?{}:Bg(e,n,t)}function Bg(e,n,t){if(t.width<=0||t.height<=0)return{};let i=ml({...e,frame:n},_a({...e,frame:n},t));return{outline:{...n,x:i.x/t.width,y:i.y/t.height,width:i.w/t.width,height:i.h/t.height}}}function _u(e){return e.path!==void 0&&e.path!==""?e.size*ay:e.size}var N0=1e3;function D0(e,n,t){let i=Math.min(1,Math.max(0,n)),a=N0;switch(t){case"up":return{x:e.x-a,y:e.y+e.h*(1-i),w:e.w+a*2,h:e.h*i+a};case"down":return{x:e.x-a,y:e.y-a,w:e.w+a*2,h:a+e.h*i};case"left":return{x:e.x+e.w*(1-i),y:e.y-a,w:e.w*i+a,h:e.h+a*2};case"right":return{x:e.x-a,y:e.y-a,w:a+e.w*i,h:e.h+a*2}}}function my(e,n,t){let i=`lv-${(O0+=1).toString(36)}`,a=D0(ml(e,n),t.fraction,t.direction);return{id:i,defs:x`<defs><clipPath id=${i}><rect x=${a.x} y=${a.y} width=${a.w} height=${a.h} /></clipPath></defs>`}}var O0=0;function z0(e,n){let t=ry(e.fill,e.fillColorHex),i=e.borderColorHex?We(e.borderColorHex):void 0,a=i?e.borderWidth:0,r={fill:t.fill,fillOpacity:t.opacity,stroke:i?i.color:"none",strokeOpacity:i?i.opacity:0},o=t.defs===m?m:x`<defs>${t.defs}</defs>`;if(e.level===void 0)return x`${o}${rl(e,n,a,r)}`;let s=be(e.level.trackColorHex,"fill"),l={fill:s.fill,fillOpacity:s["fill-opacity"],stroke:"none",strokeOpacity:0},c={...r,stroke:"none",strokeOpacity:0},d={...r,fill:"none",fillOpacity:0},u=my(e,n,e.level);return x`${o}${u.defs}
    ${rl(e,n,a,l)}
    <g clip-path=${`url(#${u.id})`}>${rl(e,n,a,c)}</g>
    ${i?rl(e,n,a,d):m}`}function rl(e,n,t,i){let a=t/2;switch(e.shapeKind){case"circle":{let r=Math.min(n.w,n.h)/2-a;return x`<circle cx=${n.cx} cy=${n.cy} r=${Math.max(0,r)}
        fill=${i.fill} fill-opacity=${i.fillOpacity}
        stroke=${i.stroke} stroke-opacity=${i.strokeOpacity} stroke-width=${t} />`}case"capsule":{let r=Math.min(n.w,n.h)/2;return x`<rect x=${n.x+a} y=${n.y+a} width=${Math.max(0,n.w-t)} height=${Math.max(0,n.h-t)} rx=${r}
        fill=${i.fill} fill-opacity=${i.fillOpacity}
        stroke=${i.stroke} stroke-opacity=${i.strokeOpacity} stroke-width=${t} />`}case"roundedRectangle":return x`<rect x=${n.x+a} y=${n.y+a} width=${Math.max(0,n.w-t)} height=${Math.max(0,n.h-t)} rx=${e.cornerRadius}
        fill=${i.fill} fill-opacity=${i.fillOpacity}
        stroke=${i.stroke} stroke-opacity=${i.strokeOpacity} stroke-width=${t} />`;case"rectangle":return x`<rect x=${n.x+a} y=${n.y+a} width=${Math.max(0,n.w-t)} height=${Math.max(0,n.h-t)}
        fill=${i.fill} fill-opacity=${i.fillOpacity}
        stroke=${i.stroke} stroke-opacity=${i.strokeOpacity} stroke-width=${t} />`;case"line":{let r=n.w>=n.h,o=Math.max(0,Math.min(e.thickness,r?n.h:n.w)),s=r?n.x:n.cx-o/2,l=r?n.cy-o/2:n.y;return x`<rect x=${s} y=${l} width=${r?n.w:o} height=${r?o:n.h}
        fill=${i.fill} fill-opacity=${i.fillOpacity} stroke="none" />`}}}function G0(e,n,t){if(e.level===void 0)return Cu(e,n,t,e.colorHex);let i=my(e,n,e.level);return x`${i.defs}
    ${Cu(e,n,t,e.level.trackColorHex)}
    <g clip-path=${`url(#${i.id})`}>${Cu(e,n,t,e.colorHex)}</g>`}function Cu(e,n,t,i){if(e.path!==void 0&&e.path!==""){let s=be(i,"fill"),l=e.size*ay,c=wf(e.viewBox),d=Math.min(l/c.width,l/c.height),u=n.cx-c.width*d/2-c.minX*d,p=n.cy-c.height*d/2-c.minY*d;return x`<g transform="translate(${u} ${p}) scale(${d})">
      <path d=${e.path} fill=${s.fill} fill-opacity=${s["fill-opacity"]} /></g>`}let a=t.render(e.symbol,e.size,i);if(a)return x`<g transform="translate(${n.cx-e.size/2} ${n.cy-e.size/2})">${a}</g>`;let r=be(i,"stroke"),o=e.size;return x`
    <rect x=${n.cx-o/2} y=${n.cy-o/2} width=${o} height=${o} rx=${o*.2}
      fill="none" stroke=${r.stroke} stroke-opacity=${r["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central" font-size=${o*.5}
      fill=${r.stroke} fill-opacity=${r["stroke-opacity"]} font-family="sans-serif">?</text>`}var Pu=.25,B0=8;function V0(e,n,t,i,a,r,o,s){let l={x:0,y:0,width:e,height:n};if(!(e>0)||!(n>0)||!(t>0)||!(i>0))return l;let c=Math.min(Math.max(Number.isFinite(r)?r:1,Pu),B0),d=Math.max(e/t,n/i),u=Math.min(e/t,n/i),p=(a==="fit"?u:d)*c,f=t*p,g=i*p,b=Math.min(Math.max(Number.isFinite(o)?o:0,-1),1),y=Math.min(Math.max(Number.isFinite(s)?s:0,-1),1);return{x:-(f-e)/2*(1+b)+0,y:-(g-n)/2*(1+y)+0,width:f,height:g}}function Nu(e){let n=e.getHours()%12||12,t=i=>String(i).padStart(2,"0");return`${n}:${t(e.getMinutes())}:${t(e.getSeconds())}`}var ol=4;function U0(e,n,t){let i=Math.min(Math.max(e.timestampSize,4),40),a=t.length*i*.578+i*.89,r=i*1.25;if(!(Number.isFinite(e.timestampX)&&Number.isFinite(e.timestampY))){let l=e.timestampCorner.endsWith("Leading")?n.x+ol:n.x+n.w-ol-a,c=e.timestampCorner.startsWith("top")?n.y+ol:n.y+n.h-ol-r;return{x:l,y:c,w:a,h:r,size:i,label:t}}let s=(l,c,d,u)=>u>=d?c+(d-u)/2:Math.min(c+d-u,Math.max(c,l-u/2));return{x:s(n.x+e.timestampX*n.w,n.x,n.w,a),y:s(n.y+e.timestampY*n.h,n.y,n.h,r),w:a,h:r,size:i,label:t}}function Vg(e,n){if(e==="camera")return"camera.fill";if(e==="inline")return"photo";switch(n.split(".")[0]){case"camera":return"camera.fill";case"person":return"person.crop.circle";case"media_player":return"music.note";default:return"photo"}}function K0(e,n){let{x:t,y:i,w:a,h:r}=e,o=c=>t+a*c,s=c=>i+r*c,l=Math.max(2,Math.min(a,r)*.11);return x`
    <defs><linearGradient id=${n} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3B5B8C" /><stop offset="0.65" stop-color="#9DB4CF" /><stop offset="1" stop-color="#E8C9A0" />
    </linearGradient></defs>
    <rect x=${t} y=${i} width=${a} height=${r} fill=${`url(#${n})`} />
    <circle cx=${o(.72)} cy=${s(.36)} r=${l} fill="#FFF3D6" fill-opacity="0.9" />
    <path d=${`M${o(0)} ${s(.7)} L${o(.22)} ${s(.42)} L${o(.4)} ${s(.6)} L${o(.58)} ${s(.38)} L${o(.86)} ${s(.66)} L${o(1)} ${s(.56)} L${o(1)} ${s(1)} L${o(0)} ${s(1)} Z`}
      fill="#5C7391" />
    <path d=${`M${o(0)} ${s(.84)} Q${o(.3)} ${s(.62)} ${o(.62)} ${s(.8)} T${o(1)} ${s(.74)} L${o(1)} ${s(1)} L${o(0)} ${s(1)} Z`}
      fill="#34475E" />
    <rect x=${t} y=${s(.92)} width=${a} height=${r*.08} fill="#232F3E" />`}function W0(e,n,t){let i=t.icons,a=`imgclip-${Iu()}-${e.id}`,r=Math.max(0,e.cornerRadius),o=e.showTimestamp&&e.url?U0(e,n,Nu(new Date)):void 0,s=o?gy(o):m,l=e.url?t.imageSizes?.size(e.url):void 0,c;if(e.url&&l){let d=V0(n.w,n.h,l.width,l.height,e.contentMode,e.zoom,e.panX,e.panY);c=x`<image href=${e.url} x=${n.x+d.x} y=${n.y+d.y} width=${d.width} height=${d.height}
      preserveAspectRatio="none" />`}else e.url?c=x`<image href=${e.url} x=${n.x} y=${n.y} width=${n.w} height=${n.h}
      preserveAspectRatio=${e.contentMode==="fit"?"xMidYMid meet":"xMidYMid slice"} />`:t.pictureScene&&e.source!=="inline"&&["camera.fill","photo"].includes(Vg(e.source,e.entityId))?c=K0(n,`${a}-sky`):c=x`
      <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${n.cx-7} ${n.cy-7})">${i.render(Vg(e.source,e.entityId),14,"#FFFFFF99")??m}</g>`;return x`
    <defs><clipPath id=${a}><rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${a})`}>${c}${s}</g>`}function gy(e,n=1){return x`<g opacity=${n}>
    <rect x=${e.x} y=${e.y} width=${e.w} height=${e.h} rx=${e.h/2} fill="#000000" fill-opacity="0.55" />
    <text x=${e.x+e.w/2} y=${e.y+e.h/2} text-anchor="middle" dominant-baseline="central"
      font-size=${e.size} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${e.label}</text></g>`}function j0(e,n){if(!e.linked)return m;let t=Nu(new Date),i=Nc(n.w,n.h);if(i<=0)return m;let a=t.length*i*.578+i*.89,r=i*1.25;return gy({x:n.cx-a/2,y:n.cy-r/2,w:a,h:r,size:i,label:t},e.url===void 0?.5:1)}function q0(e,n,t,i,a){if(!i)return m;let r=Math.min(10,n.w*.5,n.h*.5),o=a!==void 0?Y0(a,n):void 0;return x`
    <rect x=${n.x} y=${n.y} width=${n.w} height=${n.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${o!==void 0?x`<text x=${n.cx} y=${n.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${Eu} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${o}</text>`:r>=5?x`<g transform="translate(${n.cx-r/2} ${n.cy-r/2})" opacity="0.8">${t.render("hand.tap.fill",r,"#FFD60A")??m}</g>`:m}`}var Eu=5;function Y0(e,n){let t=Eu*.55,i=n.w-2;if(n.h<Eu*1.6||i<t*4)return;if(e.length*t<=i)return e;let a=Math.max(1,Math.floor(i/t)-1);return`${e.slice(0,a).replace(/\s+$/,"")}\u2026`}function X0(e,n,t,i,a){if(e.cells.length===0)return m;let r=t.tapReview===!0,o={...t,handles:!1,tapAreas:r};return x`${e.cells.map(s=>{let l=Math.max(0,s.frame.width*n.w),c=Math.max(0,s.frame.height*n.h);if(l<=0||c<=0)return m;let d=n.x+s.frame.x*n.w,u=n.y+s.frame.y*n.h,p={width:l,height:c};return x`<g data-list-cell transform="translate(${d} ${u})" style=${r?m:"cursor:move"}>
      ${s.elements.map(f=>Zr(f,p,o,i,a))}</g>`})}`}function yy(e){let n=new Map;for(let t of e)t.kind==="chart"&&n.set(t.id,t);return n}function Zr(e,n,t,i=new Map,a,r="body"){if(e.isHidden&&!t.showHidden)return m;let o=t.tapReview===!0,s=t.tapAreas===!0||o,l=o?t.tapFocusId:void 0,c=l!==void 0&&e.id===l,d=l!==void 0;if(e.kind==="tap"&&!s)return m;if(e.kind==="tap"&&e.attachedTo!==void 0&&(!o||d&&!c))return m;let u=_a(e,n),p=o&&(!d||c),f;if(r==="body")switch(e.kind){case"text":f=k0(e,u);break;case"icon":f=G0(e,u,t.icons);break;case"gauge":f=$0(e,u);break;case"chart":f=R0(e,u);break;case"timeline":f=L0(e,u);break;case"chartTimes":f=I0(e,u);break;case"imageTime":f=j0(e,u);break;case"chartDots":f=H0(e,u,i.get(e.chart),t.highlightId===e.id||t.highlightIds?.includes(e.id)===!0,t.minDotRadius);break;case"chartGrid":f=_0(e,u,i.get(e.chart),t.highlightId===e.id||t.highlightIds?.includes(e.id)===!0,t.minGridStroke);break;case"shape":f=z0(e,u);break;case"image":f=W0(e,u,t);break;case"tap":f=q0(e,u,t.icons,s,p?Zt(e.action):void 0);break;case"list":f=X0(e,u,t,i,a);break}e.kind!=="tap"&&(f=l0(f,`sh-${(s0+=1).toString(36)}`,e.shadow),e.kind!=="list"&&(f=Wi(f,i0(e.kind,t.tintSurface??"watch",e.accentGroup==="accent"),a)));let g=o&&(e.kind!=="tap"||d&&!c)?.35:1,b=Math.min(1,Math.max(0,e.opacity))*(e.isHidden?.35:1)*g,y=t.highlightId===e.id,v=y||t.highlightIds?.includes(e.id)===!0,k=e.kind==="chartDots"||e.kind==="chartGrid",S=e.chartAnchor?.place==="through",I=t.handles===!0&&(!d||c)&&!k&&!S,_=ml(e,u),E=v&&!k?x`<rect x=${_.x} y=${_.y} width=${_.w} height=${_.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`:m,z=t.hoverId===e.id||t.hoverIds?.includes(e.id)===!0?x`<rect x=${_.x} y=${_.y} width=${_.w} height=${_.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`:m,C=k?m:x`<rect x=${_.x} y=${_.y} width=${_.w} height=${_.h} fill="transparent" stroke="none" />`,M=3,K=_,Y=y&&I?[["nw",K.x-M,K.y-M],["ne",K.x+K.w,K.y-M],["sw",K.x-M,K.y+K.h],["se",K.x+K.w,K.y+K.h]].map(([J,L,X])=>x`<rect data-handle=${J} x=${L} y=${X} width=${M} height=${M}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${J}-resize" />`):m;return r==="handles"?Y===m?m:x`<g data-element-id=${e.id} opacity=${b} transform="rotate(${e.frame.rotationDegrees} ${u.cx} ${u.cy})">${Y}</g>`:x`<g data-element-id=${e.id} opacity=${b} style=${I?"cursor:move":e.kind==="chartDots"?"cursor:pointer":m}
    pointer-events=${e.kind==="chartGrid"?"none":m}
    transform="rotate(${e.frame.rotationDegrees} ${u.cx} ${u.cy})">${C}${f}${z}${E}</g>`}function gl(e,n){return{quad:{width:104*e,height:124*e},cornerRadius:52*e,tile:n?{cx:(104-29.75)*e,cy:24*e}:{cx:70*e,cy:29.5*e},dial:{cx:0,cy:124*e,r:100.5*e},labelArc:{start:-90,end:-24}}}function Du(e,n){return(n?23.5:34)*e}var Ug=10.5;function by(e,n){return(e===" "?.35:/[ILJ1.,:;'!|]/.test(e)?.34:/[MW]/.test(e)?.92:.66)*n}function Kg(e,n){let t=0;for(let i of e)t+=by(i,n);return t}function Wg(e,n,t){let i=e.toUpperCase(),a=c=>by(c,t),r=.9*t,o=0;for(let c of i)o+=a(c);if(o<=n)return i;let s=0,l="";for(let c of i){if(s+a(c)+r>n)break;l+=c,s+=a(c)}return`${l.replace(/\s+$/,"")}\u2026`}function Ru(e,n,t){let i=t*Math.PI/180;return{x:e.cx+n*Math.cos(i),y:e.cy+n*Math.sin(i)}}function Au(e,n,t,i){let a=Ru(e,n,t),r=Ru(e,n,i);return`M ${a.x} ${a.y} A ${n} ${n} 0 0 1 ${r.x} ${r.y}`}function xy(e,n,t,i){let{dial:a}=gl(e,!0),r=(i.end-i.start)*Math.PI/180;return{id:n,d:Au(a,t,i.start,i.end),length:t*r}}function J0(e,n){let t=gl(e,!0);return xy(e,n,t.dial.r,t.labelArc)}var jg=18.5,Z0=113,Q0={start:-71,end:-36},qg=104,eC=6.2,Yg={start:-77,end:-30.5};function Xg(e){let n=e.replace("#",""),t=i=>parseInt(n.slice(i,i+2),16)||0;return[t(0),t(2),t(4)]}function Jg(e,n){if(e.length===0)return"#34C759";if(e.length===1)return e[0];let t=Math.min(1,Math.max(0,n))*(e.length-1),i=Math.min(e.length-2,Math.floor(t)),a=t-i,r=Xg(e[i]),o=Xg(e[i+1]),s=(l,c)=>Math.round(l+(c-l)*a);return`rgb(${s(r[0],o[0])}, ${s(r[1],o[1])}, ${s(r[2],o[2])})`}var Su=11;function tC(e,n,t){let{dial:i}=gl(n,!0),a=qg*n,r=180/(Math.PI*qg),o=e.minLabel!==void 0?Kg(e.minLabel,Su)*r:0,s=e.maxLabel!==void 0?Kg(e.maxLabel,Su)*r:0,l=Yg.start+(o>0?Math.max(0,o-1.8):0),c=Yg.end-(s>0?Math.max(0,s-1.8):0),d=c-l,u=24,p=[];for(let v=0;v<u;v++){let k=l+d*v/u,S=Math.min(c,l+d*(v+1)/u+.4);p.push(x`<path d=${Au(i,a,k,S)} fill="none"
      stroke=${Jg(e.colorHexes,(v+.5)/u)} stroke-width=${eC*n}
      stroke-linecap=${v===0||v===u-1?"round":"butt"} />`)}let f=(e.value-e.minValue)/(e.maxValue-e.minValue),g=Ru(i,a,l+d*f),b=1.5,y=(v,k,S,I)=>x`
    <defs><path id=${v} d=${Au(i,a,k,S)} /></defs>
    <text font-size=${Su*n} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${v}" startOffset="50%" text-anchor="middle">${I}</textPath></text>`;return x`${p}
    <circle cx=${g.x} cy=${g.y} r=${3.2*n} fill=${Jg(e.colorHexes,f)}
      stroke="#000000" stroke-width=${1.2*n} />
    ${e.minLabel!==void 0?y(`${t}-gmin`,l-b-Math.max(o,3),l-b,e.minLabel):m}
    ${e.maxLabel!==void 0?y(`${t}-gmax`,c+b,c+b+Math.max(s,3),e.maxLabel):m}`}function ei(e,n){let t=e.family in He?e.family:"rectangular",i=n.slot??He[t],a=He[t],r=pl(i,t),o=`clip-${t}-${Math.random().toString(36).slice(2,8)}`,s=We(e.backgroundColorHex),l=e.backgroundFill===void 0?void 0:hl(e.backgroundFill),c=l===void 0?s===void 0?void 0:{fill:s.color,opacity:s.opacity}:{fill:l.paint,opacity:1},d=We(e.borderColorHex),u=e.borderWidth*r.scale,p=e.elements,f=yy(p),g=n.tint===void 0?void 0:`${o}-tint`,b=n.tintSurface??"watch",y=g===void 0?m:o0(g,n.tint,b),v=b==="phone"?"phonePrimary":"plain",k=c!==void 0&&!(g!==void 0&&b==="phone");if(t==="corner"){let C=r.scale,M=!!e.bezelText||!!e.bezelGauge,K=e.curvedText??"",Y=K!=="",J=gl(C,M),L=Du(C,M),X=L/(a.width*C),ne=J.tile.cx-L/2,D=J.tile.cy-L/2,W=`M 0 0 H ${J.quad.width-J.cornerRadius} A ${J.cornerRadius} ${J.cornerRadius} 0 0 1 ${J.quad.width} ${J.cornerRadius} V ${J.quad.height} H 0 Z`,w=m;if(e.bezelGauge)w=tC(e.bezelGauge,C,o);else if(e.bezelText){let P=J0(C,`${o}-bezel`),N=e.bezelCountdownEnd!==void 0&&e.bezelCountdownEnd>Date.now()?Ha((e.bezelCountdownEnd-Date.now())/1e3):e.bezelText;w=x`<defs><path id=${P.id} d=${P.d} /></defs>
        <text font-size=${Ug*C} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${P.id}" startOffset="50%" text-anchor="middle">${Wg(N,P.length,Ug*C)}</textPath></text>`}let $=m;if(Y){let P=We(e.curvedColorHex??"#FFFFFF")??{color:"#FFFFFF",opacity:1},N=xy(C,`${o}-curved`,Z0*C,Q0);$=x`<defs><path id=${N.id} d=${N.d} /></defs>
        <text font-size=${jg*C} font-weight="600" fill=${P.color} fill-opacity=${P.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${N.id}" startOffset="50%" text-anchor="middle">${Wg(K,N.length,jg*C*.88)}</textPath></text>`}else{let P=e.borderWidth*r.scale*X,N=d?x`<circle cx=${L/2} cy=${L/2} r=${L/2-P/2} fill="none" stroke=${d.color} stroke-opacity=${d.opacity} stroke-width=${P} />`:m;$=x`<g transform="translate(${ne} ${D})">
        <g clip-path=${`url(#${o})`}>
          ${k?Wi(x`${l===void 0?m:x`<defs>${l.defs}</defs>`}<rect width=${L} height=${L} fill=${c.fill} fill-opacity=${c.opacity} />`,v,g):m}
          <g data-design-box transform="scale(${r.scale*X})">
            ${p.map(O=>Zr(O,a,n,f,g))}
            ${_g(a,n.grid)}
            ${Pg(a,n.guides)}
          </g>
        </g>
        <circle cx=${L/2} cy=${L/2} r=${L/2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${.75*C} stroke-dasharray=${`${2*C} ${2*C}`} />
        ${Wi(N,v,g)}
        <g transform="scale(${r.scale*X})">${Qg(p,a,n,f)}</g>
      </g>`}return x`<svg viewBox=${`0 0 ${J.quad.width} ${J.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${J.quad.width} height=${J.quad.height}>
      <defs><clipPath id=${o}><circle cx=${L/2} cy=${L/2} r=${L/2} /></clipPath>${y}</defs>
      <path d=${W} fill="#000000" />
      ${Wi(w,b==="phone"?"phoneAccent":"accent",g)}
      ${Y?Wi($,b==="phone"?"phoneAccent":"accent",g):$}
      ${Y?m:Zg(p,a,n.spotlightIds,`${o}-spot`,J.quad.width,J.quad.height,`translate(${ne} ${D}) scale(${r.scale*X})`)}
    </svg>`}let S=ty(t)?ey*r.scale:0,I=x`<rect width=${i.width} height=${i.height} rx=${S} />`,_=d?x`<rect x=${u/2} y=${u/2} width=${i.width-u} height=${i.height-u} rx=${Math.max(0,S-u/2)} fill="none" stroke=${d.color} stroke-opacity=${d.opacity} stroke-width=${u} />`:m,E=x`<rect width=${i.width} height=${i.height} rx=${S} fill="#000000" />`,z=`0 0 ${i.width} ${i.height}`;return x`<svg viewBox=${z} xmlns="http://www.w3.org/2000/svg" class="complication ${t}"
      width=${i.width} height=${i.height}>
    <defs><clipPath id=${o}>${I}</clipPath>${y}</defs>
    <g clip-path=${`url(#${o})`}>
      ${E}
      ${k?Wi(x`${l===void 0?m:x`<defs>${l.defs}</defs>`}<rect width=${i.width} height=${i.height} rx=${S} fill=${c.fill} fill-opacity=${c.opacity} />`,v,g):m}
      <g data-design-box transform="translate(${r.x} ${r.y}) scale(${r.scale})">
        ${p.map(C=>Zr(C,a,n,f,g))}
            ${_g(a,n.grid)}
            ${Pg(a,n.guides)}
      </g>
    </g>
    ${Wi(_,v,g)}
    <g transform="translate(${r.x} ${r.y}) scale(${r.scale})">${Qg(p,a,n,f)}</g>
    ${Zg(p,a,n.spotlightIds,`${o}-spot`,i.width,i.height,`translate(${r.x} ${r.y}) scale(${r.scale})`)}
  </svg>`}function nC(e,n,t){return e.filter(i=>t.includes(i.id)&&i.kind!=="tap").map(i=>{let a=_a(i,n);return{box:{...ml(i,a),cx:a.cx,cy:a.cy},rotation:i.frame.rotationDegrees}})}function Zg(e,n,t,i,a,r,o){if(t===void 0||t.length===0)return m;let s=nC(e,n,t),l=(c,d)=>{let{box:u,rotation:p}=c,f=`rotate(${p} ${u.cx} ${u.cy})`;return d==="hole"?x`<rect x=${u.x} y=${u.y} width=${u.w} height=${u.h} rx="2" fill="#000000" transform=${f} />`:x`<rect x=${u.x} y=${u.y} width=${u.w} height=${u.h} rx="2" fill="none" transform=${f}
          style="stroke: var(--wa-accent, #7b6cff)" stroke-width="2" vector-effect="non-scaling-stroke" />`};return x`<g class="spotlight" pointer-events="none">
    <defs><mask id=${i} maskUnits="userSpaceOnUse" x="0" y="0" width=${a} height=${r}>
      <rect width=${a} height=${r} fill="#ffffff" />
      <g transform=${o}>${s.map(c=>l(c,"hole"))}</g>
    </mask></defs>
    <rect width=${a} height=${r} fill="#000000" fill-opacity="0.62" mask=${`url(#${i})`} />
    <g transform=${o}>${s.map(c=>l(c,"ring"))}</g>
  </g>`}function Qg(e,n,t,i){if(t.handles!==!0||t.highlightId===void 0)return m;let a=e.find(r=>r.id===t.highlightId);return a===void 0?m:Zr(a,n,t,i,void 0,"handles")}var iC=.14;function aC(e,n){let t=_a(e,n);if(e.kind!=="text"||e.text==="")return t;let i=Math.min(t.w,Math.max(e.fontSize,e.text.length*e.fontSize*.55)),a=Math.min(t.h,e.fontSize*1.3);return{x:t.cx-i/2,y:t.cy-a/2,w:i,h:a,cx:t.cx,cy:t.cy}}function rC(e,n,t){let i=e.family in He?e.family:"rectangular",a=He[i],r=e.elements.filter(p=>n.includes(p.id)),o=1/0,s=1/0,l=-1/0,c=-1/0;for(let p of r){let f=aC(p,a),g=p.frame.rotationDegrees%180===0?0:Math.hypot(f.w,f.h)/2;o=Math.min(o,g?f.cx-g:f.x),s=Math.min(s,g?f.cy-g:f.y),l=Math.max(l,g?f.cx+g:f.x+f.w),c=Math.max(c,g?f.cy+g:f.y+f.h)}let d=l-o,u=c-s;if(r.length===0||!(d>0)||!(u>0))o=0,s=0,d=a.width,u=a.height;else{let p=Math.max(2,Math.max(d,u)*iC);o-=p,s-=p,d+=2*p,u+=2*p}if(d/u<t){let p=u*t;o-=(p-d)/2,d=p}else{let p=d/t;s-=(p-u)/2,u=p}return{x:o,y:s,w:d,h:u}}function yl(e,n,t){let i=e.family in He?e.family:"rectangular",a=He[i],r=rC(e,n,t.width/t.height),o=We(e.backgroundColorHex),s=e.backgroundFill===void 0?void 0:hl(e.backgroundFill),l=s!==void 0?s.paint:o?o.color:"#000000",c=s!==void 0?1:o?o.opacity:1,d=We(e.borderColorHex),u=e.borderWidth,p={icons:t.icons,showHidden:!0,tapAreas:!0,minDotRadius:r.w/40,minGridStroke:r.w/110,...t.imageSizes?{imageSizes:t.imageSizes}:{}},f=e.elements.filter(k=>n.includes(k.id)),g=i==="rectangular"?"rect":ty(i)?"rounded":"circle",b=g==="rounded"?ey:0,y=d&&u>0?g==="circle"?x`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2-u/2} fill="none" stroke=${d.color} stroke-opacity=${d.opacity} stroke-width=${u} />`:x`<rect x=${u/2} y=${u/2} width=${a.width-u} height=${a.height-u} rx=${Math.max(0,b-u/2)} fill="none" stroke=${d.color} stroke-opacity=${d.opacity} stroke-width=${u} />`:m,v=g==="circle"?x`<circle cx=${a.width/2} cy=${a.height/2} r=${a.width/2} fill=${l} fill-opacity=${c} />`:x`<rect width=${a.width} height=${a.height} rx=${b} fill=${l} fill-opacity=${c} />`;return x`<svg viewBox=${`${r.x} ${r.y} ${r.w} ${r.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${i}"
      width=${t.width} height=${t.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} fill="#000000" />
    ${s===void 0?m:x`<defs>${s.defs}</defs>`}
    ${v}
    ${f.map(k=>Zr(k,a,p,yy(e.elements)))}
    ${y}
  </svg>`}function ie(e){switch(e){case"rectangular":return"Rectangular";case"circular":return"Circular";case"corner":return"Corner";case"inline":return"Inline";case"small":return"Small";case"medium":return"Medium";case"large":return"Large";case"xlarge":return"Extra Large"}}var vy="2.8.0";var wy="2.8.0",Ou="2.8.0",oC="2.8.0";function En(e,n=oC){if(n===null)return!1;let t=ti(n);if(!t)return!1;let i=ti(e);return i?Gu(i,t)>=0:!0}function Ae(e){return e?.device_kind==="iphone"?"iphone":"watch"}function zu(e){return Ae(e)==="iphone"?"iPhone":"watch"}function ti(e){if(typeof e!="string")return;let n=/^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(e);if(n)return[Number(n[1]),Number(n[2]),Number(n[3]??0)]}function Gu(e,n){for(let t=0;t<3;t++)if(e[t]!==n[t])return e[t]<n[t]?-1:1;return 0}function to(e,n=vy){let t=ti(e),i=ti(n);return!t||!i?!1:Gu(t,i)>=0}function Bu(e,n=null){if(n===null)return;let t=ti(e),i=ti(n);return!t||!i||Gu(t,i)>=0?void 0:`Needs Wrist Assistant ${i[2]===0?`${i[0]}.${i[1]}`:i.join(".")} or later on your watch.`}function sC(e,n=vy){return`${ti(e)?`This watch runs Wrist Assistant ${e}.`:"This watch has not reported its Wrist Assistant version yet."} The editor needs ${n}, coming soon to the App Store.`}function lC(e,n=wy){return`${ti(e)?`This iPhone runs Wrist Assistant ${e}.`:"This iPhone has not reported its Wrist Assistant version yet."} Lock Screen and Home Screen complications need ${n}, coming soon to the App Store.`}function ky(e){return Ae(e)==="iphone"?to(e?.app_version,wy):to(e?.app_version)}function $y(e){return Ae(e)==="iphone"?lC(e?.app_version):sC(e?.app_version)}var bl=["rectangular","circular","corner","inline",...Gn],Sy=!1;function Ty(e){if(Ae(e)!=="iphone")return bl.filter(t=>!Rn(t));let n=to(e?.app_version,Ou);return bl.filter(t=>t==="corner"?!1:t==="xlarge"?n&&Sy:Rn(t)?n:!0)}function Vu(e){return Sy?[]:Ae(e)!=="iphone"?[]:to(e?.app_version,Ou)?["xlarge"]:[]}function je(e){return ue.includes(e)}function Ey(e,n){return n!=="list"?!0:Nt.includes(e)}function Rn(e){return Gn.includes(e)}function Da(e){return e==="xlarge"?"iOS 27 and later":void 0}var dC=["small","medium","large"];function cC(e){let n=0;for(let t of e)dC.includes(t)&&n++;return n>=2}function Oa(e){if(cC(e))return"The phone also offers these sizes together as one widget. Long press it on the Home Screen to switch between them."}var Cy=["xlarge","large","medium","small","rectangular","circular","corner","inline"];function Na(e){return[...e].sort((n,t)=>Cy.indexOf(n)-Cy.indexOf(t))}function no(e,n){return Rn(e)?"home":Ae(n)==="iphone"?"lock":"watch"}function uC(e){switch(e){case"home":return"Home Screen";case"lock":return"Lock Screen";case"watch":return"Watch face"}}function Uu(e,n,t=[]){let i=[];for(let a of["home","lock","watch"]){let r=Na(n.filter(s=>no(s,e)===a)),o=Na(t.filter(s=>no(s,e)===a));r.length===0&&o.length===0||i.push({place:a,label:uC(a),families:r,comingSoon:o})}return i}function Ku(e,n){let t=gt(e),i=t.filter(a=>n.includes(a));return i.length>0?i:t}function gt(e){return bl.filter(n=>e.supportedFamilies.includes(n))}function xl(e){return ue.find(n=>e.supportedFamilies.includes(n))}function vl(e,n){return e.supportedFamilies.includes(n)?e.supportedFamilies.length>1||!mm(e):!1}function Wu(e){return e.control===void 0?!1:e.supportedFamilies.length>0}function pC(){return{value:U("")}}function Ry(e,n){e.supportedFamilies.includes(n)||(e.supportedFamilies=bl.filter(t=>t===n||e.supportedFamilies.includes(t))),je(n)?e.perFamily[n]||(e.perFamily[n]=At()):e.inline||(e.inline=pC()),e.schemaVersion=hn(e)}function ju(e,n){if(vl(e,n)){if(e.supportedFamilies=e.supportedFamilies.filter(t=>t!==n),je(n)){for(let t of Ft(e,n))Me(e,t.payload.id);delete e.perFamily[n],Dt(e)}else delete e.inline;e.schemaVersion=hn(e)}}function qu(e,n){let t=structuredClone(e),i=gt(t);if(!i.some(a=>n.includes(a)))return t;for(let a of i)n.includes(a)||ju(t,a);return t}function Ay(e,n){let t=[];if(!je(n)){let r=e.inline;return r&&(r.value.kind.kind==="literal"&&(r.value.kind.value===""||r.value.kind.value==="Text")&&!r.label&&!r.symbol||t.push("the Inline text")),t}let i=e.perFamily[n];if(!i)return t;let a=Ft(e,n).filter(r=>!Re(e,r)).length;return a>0&&t.push(`${a} layer${a===1?"":"s"}`),i.rules.length>0&&t.push(`${i.rules.length} rule${i.rules.length===1?"":"s"}`),(i.bezelText||i.bezelGauge)&&t.push("the bezel"),i.curvedText&&t.push("the curved text"),(i.backgroundColorHex||i.borderColorHex)&&t.push("the background or border"),t}function Fy(e){return e.control!==void 0&&e.elements.length===0}function My(e,n){let t=n?"Lock Screen":"watch face";return["A control has no layers. Control Center draws it from the title, symbol, tint, value line and status on the right.",e===void 0?`This complication has no widget. Add a shape above if you want one on the ${t}.`:`The ${e} tab is what the ${t} shows; a complication always keeps at least one shape.`]}var ot={text:"#42a5f5",icon:"#ab47bc",gauge:"#fb8c00",chart:"#3949ab",timeline:"#00897b",list:"#c0ca33",shape:"#43a047",image:"#00acc1",tap:"#ec407a",chartTimes:"#5e35b1",chartDots:"#5e35b1",chartGrid:"#5e35b1",imageTime:"#00838f"},lt={text:"Text",icon:"Icon",gauge:"Gauge",chart:"Chart",timeline:"Timeline",list:"List",shape:"Shape",image:"Picture",tap:"Tap area",chartTimes:"Clock times",chartDots:"Chart dots",chartGrid:"Chart grid",imageTime:"Timestamp"},Ly=["text","icon","gauge","chart","timeline","list","shape","image","tap"],le={content:"#4a7fe8",look:"#a15fe0",numbers:"#26a69a",position:"#66bb6a",states:"#f9a825",tap:ot.tap,place:"#78909c",complication:"#5c6bc0",group:"#90a4ae",locked:"#e53935"};var Iy="52a9d81d0fd7";var Hy="11fa18406cea";var dt="mdi:";function hC(e){return e.trim().replace(/\./g,"-")}function fC(e){return e.trim().replace(/-/g,".")}var wl=class e{constructor(n){this.onReady=n;this.cache=new Map;this.pending=new Set;this.nameList=[];this.nameState="idle"}static available(){return typeof window<"u"&&!!window.customIcons?.ios}available(){return e.available()}names(){return this.nameState==="idle"&&this.fetchNames(),this.nameState==="loaded"?this.nameList:void 0}fetchNames(){this.nameState="loading";let n=window.customIcons?.ios;if(!n||typeof n.getIconList!="function"){this.nameState="loaded";return}Promise.resolve().then(()=>n.getIconList()).then(t=>{this.nameList=(t??[]).map(i=>fC(i.name)).sort()}).catch(()=>{this.nameList=[]}).finally(()=>{this.nameState="loaded",this.onReady()})}render(n,t,i){let a=hC(n),r=this.cache.get(a);if(r===void 0){this.fetch(a);return}if(r===null||!r.path)return;let o=We(i)??{color:"#FFFFFF",opacity:1},s=r.viewBox??"0 0 24 24";return x`<svg x="0" y="0" width=${t} height=${t} viewBox=${s}>
      <path d=${r.path} fill=${o.color} fill-opacity=${o.opacity} /></svg>`}fetch(n){if(this.pending.has(n))return;let t=window.customIcons?.ios;if(!t){this.cache.set(n,null);return}this.pending.add(n),Promise.resolve().then(()=>t.getIcon(n)).then(i=>this.cache.set(n,i&&i.path?i:null)).catch(()=>this.cache.set(n,null)).finally(()=>{this.pending.delete(n),this.onReady()})}},kl=class{constructor(n,t="symbol-icons.json.gz",i=Iy){this.onReady=n;this.file=t;this.digest=i;this.icons=new Map;this.state="idle"}path(n){return this.load(),this.icons.get(n.trim())?.[0]}available(){return this.state!=="loaded"||this.icons.size>0}names(){return this.load(),this.state==="loaded"?[...this.icons.keys()].sort():void 0}render(n,t,i){this.load();let a=this.icons.get(n.trim());if(!a)return;let r=We(i)??{color:"#FFFFFF",opacity:1};return x`<svg x="0" y="0" width=${t} height=${t} viewBox=${a[1]}>
      <path d=${a[0]} fill=${r.color} fill-opacity=${r.opacity} /></svg>`}load(){if(this.state!=="idle")return;this.state="loading";let n=new URL(`${this.file}?v=${this.digest}`,import.meta.url);fetch(n).then(t=>{if(!t.ok||!t.body)throw new Error(`${this.file}: ${t.status}`);return new Response(t.body.pipeThrough(new DecompressionStream("gzip"))).json()}).then(t=>{if(t&&typeof t=="object")for(let[i,a]of Object.entries(t))Array.isArray(a)&&typeof a[0]=="string"&&typeof a[1]=="string"&&this.icons.set(i,[a[0],a[1]])}).catch(()=>{}).finally(()=>{this.state="loaded",this.onReady()})}},Yu=class{constructor(n,t){this.sf=n;this.mdi=new kl(t,"mdi-icons.json.gz",Hy)}render(n,t,i){return(n.trim().startsWith(dt)?this.mdi:this.sf).render(n,t,i)}available(){return this.sf.available()}names(){return this.sf.names()}mdiNames(){return this.mdi.names()}mdiPath(n){return this.mdi.path(n)}};function _y(e){let n=wl.available()?new wl(e):new kl(e);return new Yu(n,e)}function Py(e){let n=new Map,t=new Set;return{size(i){let a=n.get(i);if(a)return a;if(t.has(i))return;t.add(i);let r=new Image;r.onload=()=>{r.naturalWidth<=0||r.naturalHeight<=0||(n.set(i,{width:r.naturalWidth,height:r.naturalHeight}),e())},r.src=i}}}var Cl=[{name:"Home",symbols:["house","house.fill","house.circle.fill","bed.double.fill","sofa.fill","chair.lounge.fill","lamp.desk.fill","washer.fill","dryer.fill","refrigerator.fill","oven.fill","dishwasher.fill","microwave.fill","shower.fill","bathtub.fill","toilet.fill","stairs","door.left.hand.open","door.left.hand.closed","window.casement","curtains.closed","spigot.fill","humidifier.fill","air.purifier.fill","fan.fill","fan.ceiling.fill"]},{name:"Climate",symbols:["thermometer.variable","thermometer.medium","thermometer.low","thermometer.high","thermometer.sun.fill","thermometer.snowflake","humidity.fill","drop.fill","drop.degreesign","flame.fill","snowflake","wind","air.conditioner.horizontal.fill","heater.vertical.fill","gauge.with.needle"]},{name:"Weather",symbols:["sun.max.fill","sun.min.fill","sunrise.fill","sunset.fill","moon.fill","moon.stars.fill","cloud.fill","cloud.sun.fill","cloud.rain.fill","cloud.heavyrain.fill","cloud.drizzle.fill","cloud.snow.fill","cloud.bolt.fill","cloud.bolt.rain.fill","cloud.fog.fill","tornado","hurricane","umbrella.fill","rainbow","aqi.medium"]},{name:"Lighting",symbols:["lightbulb","lightbulb.fill","lightbulb.slash.fill","lightbulb.led.fill","light.recessed","light.panel.fill","light.strip.2","lamp.ceiling.fill","lamp.floor.fill","lamp.table.fill","sparkles","rays"]},{name:"Security",symbols:["lock.fill","lock.open.fill","lock.shield.fill","shield.fill","shield.slash.fill","key.fill","exclamationmark.shield.fill","video.fill","video.slash.fill","web.camera.fill","sensor.fill","sensor.tag.radiowaves.forward.fill","bell.fill","bell.slash.fill","bell.badge.fill","alarm.fill","eye.fill","eye.slash.fill"]},{name:"Media",symbols:["play.fill","pause.fill","stop.fill","forward.fill","backward.fill","forward.end.fill","backward.end.fill","speaker.wave.2.fill","speaker.wave.3.fill","speaker.slash.fill","music.note","music.note.list","tv","tv.fill","appletv.fill","homepod.fill","homepod.2.fill","airplay.audio","airplay.video","hifispeaker.fill","headphones","radio.fill","film.fill","photo.fill"]},{name:"Power",symbols:["bolt.fill","bolt.slash.fill","bolt.circle.fill","battery.100percent","battery.75percent","battery.50percent","battery.25percent","battery.0percent","battery.100percent.bolt","powerplug.fill","power","poweroutlet.type.b.fill","minus.plus.batteryblock.fill","leaf.fill"]},{name:"Devices",symbols:["iphone","ipad","applewatch","macbook","desktopcomputer","laptopcomputer","homekit","wifi","wifi.slash","antenna.radiowaves.left.and.right","network","externaldrive.fill","server.rack","printer.fill","cpu","memorychip","sdcard.fill","cable.connector","dot.radiowaves.left.and.right"]},{name:"Status",symbols:["checkmark","checkmark.circle.fill","xmark","xmark.circle.fill","exclamationmark.triangle.fill","exclamationmark.circle.fill","questionmark.circle.fill","info.circle.fill","circle.fill","circle","circle.circle.fill","minus.circle.fill","plus.circle.fill","hand.thumbsup.fill","hand.thumbsdown.fill","star.fill","heart.fill","flag.fill","pin.fill","wrench.and.screwdriver.fill","gearshape.fill","hourglass","ellipsis"]},{name:"Time",symbols:["clock","clock.fill","alarm","timer","stopwatch.fill","calendar","calendar.badge.clock","hourglass.bottomhalf.filled","deskclock.fill","sunrise","sunset","moon.zzz.fill","zzz"]},{name:"Arrows",symbols:["arrow.up","arrow.down","arrow.left","arrow.right","arrow.up.right","arrow.down.right","arrow.up.circle.fill","arrow.down.circle.fill","arrow.clockwise","arrow.counterclockwise","arrow.up.arrow.down","arrow.up.and.down","arrow.left.and.right","arrowshape.turn.up.left.fill","chevron.up","chevron.down","chevron.left","chevron.right"]},{name:"Shapes",symbols:["square.fill","square","circle.dashed","triangle.fill","diamond.fill","hexagon.fill","octagon.fill","capsule.fill","rectangle.fill","app.fill","seal.fill","shield","oval.fill","pentagon.fill","rhombus.fill","drop","cloud","bolt"]},{name:"Text and numbers",symbols:["0.circle.fill","1.circle.fill","2.circle.fill","3.circle.fill","textformat","textformat.size","percent","number","plus","minus","multiply","divide","equal","function","sum","character","character.textbox","degreesign.celsius","degreesign.fahrenheit"]},{name:"Nature",symbols:["tree.fill","carrot.fill","drop.triangle.fill","pawprint.fill","hare.fill","tortoise.fill","ant.fill","ladybug.fill","bird.fill","fish.fill","camera.macro","mountain.2.fill","water.waves","globe.americas.fill"]},{name:"People",symbols:["person.fill","person.2.fill","person.3.fill","person.crop.circle.fill","person.fill.checkmark","person.fill.xmark","figure.walk","figure.run","figure.stand","hand.raised.fill","ear.fill","brain.head.profile","eye","accessibility"]},{name:"Transport",symbols:["car.fill","car.2.fill","bus.fill","tram.fill","airplane","bicycle","figure.walk.motion","ev.charger.fill","fuelpump.fill","parkingsign.circle.fill","road.lanes","location.fill","location.slash.fill","map.fill","mappin.and.ellipse"]}],Sl=[...new Set(Cl.flatMap(e=>e.symbols))],mC={"aqi.medium":["air quality"],"arrow.clockwise":["refresh","reload","update"],"battery.100percent":["charge","level"],"bolt.fill":["power","energy","watt","electric"],"checkmark.circle.fill":["ok","done","good"],"clock.fill":["time"],"curtains.closed":["blind","shade","cover"],"door.left.hand.open":["entry"],"drop.fill":["humidity","water","moisture"],"dryer.fill":["laundry"],"exclamationmark.triangle.fill":["alert","alarm","problem","error"],"fan.fill":["ventilation"],"figure.walk":["motion","presence"],"flame.fill":["heat","heating","boiler","fire"],"gauge.with.needle":["pressure"],"gearshape.fill":["settings","config"],"house.fill":["home"],"leaf.fill":["eco","plant","garden"],"lock.fill":["security","locked","secure"],"moon.fill":["night","sleep"],"person.fill":["presence","occupancy"],"poweroutlet.type.b.fill":["socket","outlet"],"powerplug.fill":["outlet","socket","plug","switch"],"sensor.tag.radiowaves.forward.fill":["motion"],snowflake:["cool","cooling","ac","freeze"],"speaker.wave.2.fill":["volume","sound","audio"],"sun.max.fill":["day","bright","brightness"],"thermometer.medium":["temperature","temp"],"video.fill":["camera"],"washer.fill":["laundry"],"water.waves":["pool","flood"],wifi:["network","internet","signal"],"window.casement":["blind","shade"]};function gC(e){return`${e.replace(/\./g," ")} ${(mC[e]??[]).join(" ")}`}function Xu(e,n){let t=n.toLowerCase().split(/[\s.]+/).filter(Boolean);if(t.length===0)return[...e];let i=[];for(let a of e){let r=gC(a);if(!t.every(s=>r.includes(s)))continue;let o=t.join(".");i.push({name:a,score:a===o?0:a.startsWith(o)?1:2})}return i.sort((a,r)=>a.score-r.score).map(a=>a.name)}var $l=class e{constructor(n){this.onChange=n;this.collapsed=new Set;this.expanded=new Set;this.browsing=new Map;this.recent=[];this.recent=e.loadRecent()}static{this.STORAGE_KEY="wrist-assistant.recent-symbols"}static{this.RECENT_LIMIT=12}isOpen(n,t=!0){return this.collapsed.has(n)?!1:this.expanded.has(n)?!0:t}toggle(n,t=!0){this.isOpen(n,t)?(this.expanded.delete(n),this.collapsed.add(n)):(this.collapsed.delete(n),this.expanded.add(n)),this.onChange()}query(n){return this.browsing.get(n)?.query??""}category(n){return this.browsing.get(n)?.category??""}pack(n){return this.browsing.get(n)?.pack}setQuery(n,t){this.browsing.set(n,{category:this.category(n),query:t,pack:this.pack(n)}),this.onChange()}setCategory(n,t){this.browsing.set(n,{query:this.query(n),category:t,pack:this.pack(n)}),this.onChange()}setPack(n,t){this.browsing.set(n,{query:"",category:this.category(n),pack:t}),this.onChange()}noteUsed(n){let t=n.trim();t&&(this.recent=[t,...this.recent.filter(i=>i!==t)].slice(0,e.RECENT_LIMIT),e.saveRecent(this.recent),this.onChange())}static loadRecent(){try{let n=localStorage.getItem(e.STORAGE_KEY),t=n?JSON.parse(n):[];return Array.isArray(t)?t.filter(i=>typeof i=="string").slice(0,e.RECENT_LIMIT):[]}catch{return[]}}static saveRecent(n){try{localStorage.setItem(e.STORAGE_KEY,JSON.stringify(n))}catch{}}};var yC=100;function Ny(e){return e.error!==void 0&&e.error!==""?{tone:"err",text:`Not saved: ${e.error}`}:e.templateError!==void 0&&e.templateError!==""?{tone:"err",text:`Template error: ${e.templateError}`}:e.dirty?{tone:"warn",text:"Unsaved changes"}:e.revision===null?{tone:"warn",text:"Not saved yet"}:{tone:"ok",text:`Saved, revision ${e.revision}`}}var za=class e{constructor(n,t){this.config=n;this.testValues=new Map;this.past=[];this.future=[];this.coalesceUntil=0;this.held=!1;this.heldStepTaken=!1;this.baseRevision=t,Fa(n),Xn(n),sm(n),this.baseline=JSON.stringify(Sa(n))}static fromDocument(n,t){return new e(Ni(n),t)}get dirty(){return JSON.stringify(Sa(this.config))!==this.baseline}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}update(n,t,i){this.takeStep(t);let a=structuredClone(this.config);n(a),Fa(a,i),Xn(a),this.config=a}setTestValues(n,t){this.takeStep(t),this.testValues=n}takeStep(n){let t=Date.now();(this.held?this.heldStepTaken:n!==void 0&&n===this.coalesceKey&&t<this.coalesceUntil)||(this.past.push({config:structuredClone(this.config),testValues:this.testValues}),this.past.length>yC&&this.past.shift(),this.future=[]),this.heldStepTaken=this.held,this.coalesceKey=n,this.coalesceUntil=n===void 0?0:t+800}markDirty(){this.baseline=""}beginGesture(){this.endGesture(),this.held=!0}endGesture(){this.coalesceKey=void 0,this.coalesceUntil=0,this.held=!1,this.heldStepTaken=!1}undo(){let n=this.past.pop();n&&(this.future.push({config:this.config,testValues:this.testValues}),this.config=n.config,this.testValues=n.testValues,this.endGesture())}redo(){let n=this.future.pop();n&&(this.past.push({config:this.config,testValues:this.testValues}),this.config=n.config,this.testValues=n.testValues,this.endGesture())}encoded(){let n=structuredClone(this.config);return n.dataSources=su(n),Sa(n)}commit(n){let t=structuredClone(this.config);t.dataSources=su(t);let i=new e(t,n);return i.past=this.past,i.future=this.future,i.testValues=this.testValues,i}};var Tl=class{constructor(){this.watched=new Map;this.onScroll=n=>this.mark(n.currentTarget);this.observer=new ResizeObserver(()=>{for(let n of this.watched.keys())this.mark(n)})}refresh(n){let t=new Set(n.filter(i=>i!=null));for(let[i,a]of[...this.watched])t.has(i)||this.drop(i,a);for(let i of t){let a=this.watched.get(i);a||(a=new Set,this.watched.set(i,a),i.addEventListener("scroll",this.onScroll,{passive:!0}),this.observer.observe(i));for(let r of a)r.parentElement!==i&&(this.observer.unobserve(r),a.delete(r));for(let r of i.children)a.has(r)||(a.add(r),this.observer.observe(r));this.mark(i)}}disconnect(){for(let[n,t]of[...this.watched])this.drop(n,t);this.observer.disconnect()}drop(n,t){n.removeEventListener("scroll",this.onScroll),this.observer.unobserve(n);for(let i of t)this.observer.unobserve(i);this.watched.delete(n)}mark(n){let t=n.scrollHeight-n.clientHeight,i=t>1;n.toggleAttribute("data-more-above",i&&n.scrollTop>1),n.toggleAttribute("data-more-below",i&&n.scrollTop<t-1)}};var Ga={isOn:"is on",isOff:"is off",equals:"equals",notEquals:"does not equal",isUnavailable:"is unavailable or unknown",isStale:"data is stale",isEmpty:"is empty",greaterThan:"is greater than",greaterOrEqual:"is at least",lessThan:"is less than",lessOrEqual:"is at most",between:"is between",timeBetween:"is between times",contains:"contains",startsWith:"starts with",endsWith:"ends with",matchesRegex:"matches regex",isOneOf:"is one of"},nn={icon:"Icon",text:"Text",color:"Colour",visibility:"Visible",opacity:"Opacity",fontSize:"Size",fontWeight:"Weight",fontDesign:"Typeface",fontWidth:"Width",italic:"Italic",rotation:"Rotation",gaugeValue:"Gauge value",gaugeMin:"Gauge min",gaugeMax:"Gauge max",backgroundColor:"Background",borderColor:"Border colour",borderWidth:"Border width"},zy=["icon","text","color","visibility","opacity","fontSize","fontWeight","fontDesign","fontWidth","italic","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"],Ju={color:"setColor",opacity:"setOpacity",text:"setText",icon:"setIcon",fontSize:"setFontSize",fontWeight:"setFontWeight",fontDesign:"setFontDesign",fontWidth:"setFontWidth",italic:"setItalic",rotation:"setRotation",visibility:"hide",gaugeValue:"setGaugeValue",gaugeMin:"setGaugeMin",gaugeMax:"setGaugeMax",borderColor:"setBorderColor",borderWidth:"setBorderWidth",backgroundColor:"setBackgroundColor"},Zu=["isOn","isOff","equals","notEquals","isUnavailable","isStale","isEmpty","lessThan","lessOrEqual","between","greaterOrEqual","greaterThan","contains","startsWith","endsWith"],bC=["lessThan","lessOrEqual","between","greaterOrEqual","greaterThan"];function Qu(e){return bC.includes(e)}function xC(e){return Zu.includes(e)}function vC(e,n){return JSON.stringify(me(e))===JSON.stringify(me(n))}function ep(e){if(e.length>1)return{ok:!1,reason:`There are ${e.length} rules here. A table shows one.`};let n=e[0];if(!n)return{ok:!0,table:{ruleId:"",rows:[],columns:[],numberMode:!1}};let t,i=[];for(let[r,o]of n.cases.entries()){let s=o.when.tests;if(s.length!==1)return{ok:!1,reason:s.length===0?`State ${r+1} checks nothing, so it always matches.`:`State ${r+1} checks ${s.length} things at once. A table row checks one.`};let l=s[0];if(!xC(l.comparison.kind))return{ok:!1,reason:`State ${r+1} uses "${Ga[l.comparison.kind]}", which a table row cannot show.`};if(t===void 0)t=l.value;else if(!vC(t,l.value))return{ok:!1,reason:"The states test different values. A table tests one value in every row."};let c=Dy(o.then);if(c)return{ok:!1,reason:`State ${r+1} sets ${nn[c]} twice. A table has one cell per column.`};i.push({caseId:o.id,testId:l.id,join:o.when.join,comparison:l.comparison,changes:o.then})}if(n.otherwise){let r=Dy(n.otherwise);if(r)return{ok:!1,reason:`Otherwise sets ${nn[r]} twice. A table has one cell per column.`}}let a={ruleId:n.id,rows:i,columns:wC(i,n.otherwise),numberMode:i.length>0&&i.every(r=>Qu(r.comparison.kind))};return t!==void 0&&(a.value=t),n.otherwise&&(a.otherwise=n.otherwise),{ok:!0,table:a}}function Dy(e){let n=new Set;for(let t of e){let i=tt[t.kind];if(n.has(i))return i;n.add(i)}}function wC(e,n){let t=new Set;for(let i of e)for(let a of i.changes)t.add(tt[a.kind]);for(let i of n??[])t.add(tt[i.kind]);return zy.filter(i=>t.has(i))}function Gy(e,n,t){let i=new Set(e);for(let a of n)i.add(a);return zy.filter(a=>i.has(a)&&t.includes(a))}function El(e,n){return e.find(t=>tt[t.kind]===n)}function Rl(e,n,t,i){let a=n.map(o=>({id:o.caseId??se(),when:{join:o.join??"all",tests:[{id:o.testId??se(),value:structuredClone(e),comparison:o.comparison}]},then:o.changes})),r={id:i??se(),cases:a};return t&&(r.otherwise=t),r}function io(e){if(e.length===0)return"No states yet.";let n=ep(e);if(!n.ok)return"Advanced rules.";let t=n.table.rows.length+(n.table.otherwise?1:0);return t===1?"1 state.":`${t} states.`}function By(e){return`No states yet. This ${e==="layout"?"shape":"layer"} looks the same whatever the value is.`}function Vy(e){let n=e[0];return n||(n={id:se(),cases:[]},e.push(n)),n}function Uy(e){let n=e[0];n&&n.cases.length===0&&n.otherwise===void 0&&(e.length=0)}var Oy=["#FF453A","#FF9F0A","#30D158"];function kC(e,n){let t=e.kind==="isOn"?"#30D158":e.kind==="isOff"?"#8E8E93":Oy[Math.min(n,Oy.length-1)];return{kind:"setColor",value:U(t)}}function Ky(e,n,t,i=!1){let a=Vy(e),r=a.cases[a.cases.length-1]?.when.tests[0]?.comparison,o=CC(r,t);a.cases.push({id:se(),when:{join:"all",tests:[{id:se(),value:structuredClone(n),comparison:o}]},then:i?[kC(o,a.cases.length)]:[]})}function Wy(e,n){let t=e[0];t&&(t.cases=t.cases.filter(i=>i.id!==n),Uy(e))}function tp(e,n,t){let i=e[0]?.cases;if(!i||t<0||t>=i.length)return;let[a]=i.splice(n,1);a&&i.splice(t,0,a)}function np(e,n,t=!1){if(n){Vy(e).otherwise=t?[{kind:"setColor",value:U("#30D158")}]:[];return}let i=e[0];i&&(delete i.otherwise,Uy(e))}function jy(e,n){for(let t of e[0]?.cases??[]){let i=t.when.tests[0];i&&(i.value=structuredClone(n))}}function qy(e,n){let t=e[0];if(!t)return;let i=a=>a.filter(r=>tt[r.kind]!==n);for(let a of t.cases)a.then=i(a.then);t.otherwise&&(t.otherwise=i(t.otherwise))}function $C(e){return e?e.kind.kind==="literal"?e.kind.value===""?"?":e.kind.value:"a value":"?"}function Yy(e,n=$C){let t=()=>n(e.value??U(""));switch(e.kind){case"lessThan":return`less than ${t()}`;case"lessOrEqual":return`at most ${t()}`;case"greaterThan":return`greater than ${t()}`;case"greaterOrEqual":return`at least ${t()}`;case"between":return`${t()} to ${n(e.upper??U(""))}`;case"timeBetween":return`${t()} to ${n(e.upper??U(""))}`;case"matchesRegex":return`matches ${e.pattern||"?"}`;case"isOneOf":return`is one of ${(e.options??[]).join(", ")||"?"}`;default:return Bi(e.kind)==="value"?`${Ga[e.kind]} ${t()}`:Ga[e.kind]}}function CC(e,n){if(!e)return n?{kind:"lessThan",value:U("20")}:{kind:"isOn"};switch(e.kind){case"isOn":return{kind:"isOff"};case"isOff":return{kind:"isOn"};case"lessThan":case"lessOrEqual":return{kind:"greaterOrEqual",value:e.value??U("0")};case"between":return{kind:"greaterOrEqual",value:e.upper??U("0")};case"greaterThan":case"greaterOrEqual":return{kind:"greaterOrEqual",value:e.value??U("0")};default:return{kind:e.kind,...Bi(e.kind)==="value"?{value:U("")}:{}}}}var ip={text:"text",icon:"icon",gauge:"color",chart:"color",timeline:"visibility",shape:"color",image:"visibility",tap:"visibility",chartTimes:"visibility",chartDots:"visibility",chartGrid:"visibility",imageTime:"visibility",list:"visibility",layout:"backgroundColor"};function Xy(e){if(!e)return!1;let n=e.kind;if(n.kind!=="entityState")return!1;let t=n.domain||n.entityId.split(".")[0]||"";return["light","switch","fan","input_boolean","binary_sensor","automation","siren","humidifier","group"].includes(t)}function SC(e){switch(e){case"text":return x`<path d="M5 6H19M12 6V19M9 19H15" />`;case"icon":return x`<path d="M12 3.5L14.6 9L20.5 9.7L16.1 13.8L17.3 19.7L12 16.8L6.7 19.7L7.9 13.8L3.5 9.7L9.4 9Z" />`;case"gauge":return x`<path d="M5 17A8 8 0 1 1 19 17" /><path d="M12 13L15.5 9.5" /><circle cx="12" cy="13" r="1.4" />`;case"chart":return x`<path d="M5 19V13" /><path d="M9.7 19V9" /><path d="M14.3 19V15" /><path d="M19 19V5" />`;case"timeline":return x`<rect x="3" y="9" width="6" height="6" rx="1.5" /><rect x="10.5" y="9" width="3.5" height="6" rx="1.5" /><rect x="15.5" y="9" width="5.5" height="6" rx="1.5" />`;case"shape":return x`<rect x="4" y="5" width="16" height="14" rx="3" />`;case"image":return x`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"tap":return x`<path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" /><path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" /><path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />`;case"content":return x`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="M7 9.5H17M7 13H13" />`;case"look":return x`<circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="10.5" r="1.1" /><circle cx="12" cy="8" r="1.1" /><circle cx="15.5" cy="10.5" r="1.1" /><path d="M12 20.5a2.5 2.5 0 0 0 0-5h-1a1.8 1.8 0 0 1 0-3.6" />`;case"list":return x`<circle cx="5.5" cy="7" r="1.6" /><circle cx="5.5" cy="12" r="1.6" /><circle cx="5.5" cy="17" r="1.6" /><path d="M10 7H19M10 12H19M10 17H19" />`;case"chartDots":return x`<path d="M4 16L10 10L14 13L20 7" /><circle cx="4" cy="16" r="1.8" /><circle cx="10" cy="10" r="1.8" /><circle cx="14" cy="13" r="1.8" /><circle cx="20" cy="7" r="1.8" />`;case"chartGrid":return x`<path d="M4 7H20M4 12H20M4 17H20" />`;case"chartTimes":case"imageTime":case"clock":return x`<circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12L15 14" />`;case"states":return x`<path d="M6 4V9.5A2.5 2.5 0 0 0 8.5 12H15.5A2.5 2.5 0 0 1 18 14.5V20" /><circle cx="6" cy="4" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 20V14" />`;case"place":return x`<path d="M12 3V6.5M12 17.5V21M3 12H6.5M17.5 12H21" /><circle cx="12" cy="12" r="4.5" />`;case"layers":return x`<path d="M12 4L20 8.5L12 13L4 8.5Z" /><path d="M4 12.5L12 17L20 12.5" /><path d="M4 16.5L12 21L20 16.5" />`;case"grip":return x`<circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" />`;case"chevron":return x`<path d="M6 9L12 15L18 9" />`;case"plus":return x`<path d="M12 5V19M5 12H19" />`;case"braces":return x`<path d="M9 4.5C6.9 4.5 6.3 5.55 6.3 7.5v2.4c0 1.2-.75 2.1-2.1 2.1 1.35 0 2.1.9 2.1 2.1v2.4c0 1.95.6 3 2.7 3" /><path d="M15 4.5c2.1 0 2.7 1.05 2.7 3v2.4c0 1.2.75 2.1 2.1 2.1-1.35 0-2.1.9-2.1 2.1v2.4c0 1.95-.6 3-2.7 3" />`;case"link":return x`<path d="M10.2 13.8L13.8 10.2" /><path d="M10.8 6.9l1.35-1.35a3.6 3.6 0 0 1 5.1 5.1l-1.35 1.35" /><path d="M13.2 17.1l-1.35 1.35a3.6 3.6 0 0 1-5.1-5.1l1.35-1.35" />`;case"info":return x`<circle cx="12" cy="12" r="8.5" /><path d="M12 11V16.5" /><path d="M12 7.6V7.8" />`;case"globe":return x`<circle cx="12" cy="12" r="8.5" /><path d="M3.5 12H20.5" /><path d="M12 3.5c2.5 3 2.5 14 0 17M12 3.5c-2.5 3-2.5 14 0 17" />`;case"download":return x`<path d="M12 4V15" /><path d="M7 10L12 15L17 10" /><path d="M5 20H19" />`;case"check":return x`<path d="M5 12.5L9.5 17L19 7.5" />`;case"arrow":return x`<path d="M5 12H19" /><path d="M13 6L19 12L13 18" />`;case"guides":return x`<path d="M12 3V21" /><rect x="4" y="6" width="8" height="4.5" rx="1.3" /><rect x="12" y="13.5" width="8" height="4.5" rx="1.3" />`;case"paste":return x`<rect x="6" y="4.5" width="12" height="16" rx="2" /><path d="M9 4.5V3.5H15V4.5" /><path d="M9 11H15M9 15H13" />`;case"watch":return x`<rect x="6" y="6.5" width="12" height="11" rx="3" /><path d="M9 6.5L9.6 3H14.4L15 6.5M9 17.5L9.6 21H14.4L15 17.5" />`;case"compact":return x`<path d="M4 6.5H20M4 12H20M4 17.5H20" />`;case"expanded":return x`<rect x="3.5" y="4" width="17" height="7" rx="1.8" /><rect x="3.5" y="13" width="17" height="7" rx="1.8" /><path d="M6.5 8H13M6.5 17H13" />`;case"lock":return x`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" />`;case"unlock":return x`<rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />`;case"folder":return x`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" />`;case"ungroup":return x`<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H9.5L11.5 7.5H18.5A2 2 0 0 1 20.5 9.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><path d="M9 13.5H15" />`;case"up":return x`<path d="M6 14L12 8L18 14" />`;case"down":return x`<path d="M6 10L12 16L18 10" />`;case"left":return x`<path d="M14 6L8 12L14 18" />`;case"right":return x`<path d="M10 6L16 12L10 18" />`;case"show":return x`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />`;case"hide":return x`<path d="M2.5 12C5.5 7 8.7 5.5 12 5.5C15.3 5.5 18.5 7 21.5 12C18.5 17 15.3 18.5 12 18.5C8.7 18.5 5.5 17 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
        <path d="M4 20L20 4" />`;case"duplicate":return x`<rect x="9" y="9" width="12" height="12" rx="2.5" />
        <path d="M15 9V5.5A2.5 2.5 0 0 0 12.5 3H5.5A2.5 2.5 0 0 0 3 5.5V12.5A2.5 2.5 0 0 0 5.5 15H9" />`;case"delete":return x`<path d="M4.5 7H19.5" />
        <path d="M9.5 7V4.5H14.5V7" />
        <path d="M6.5 7L7.4 19.6A1.5 1.5 0 0 0 8.9 21H15.1A1.5 1.5 0 0 0 16.6 19.6L17.5 7" />
        <path d="M10.2 11V17M13.8 11V17" />`;case"close":return x`<path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" />`;case"reset":return x`<path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
        <path d="M4 3.5V7H7.5" />`;case"search":return x`<circle cx="10.8" cy="10.8" r="6.3" /><path d="M15.4 15.4L20 20" />`;case"undo":return x`<path d="M9 14L4 9L9 4" /><path d="M4 9H15A5 5 0 0 1 15 19H12" />`;case"redo":return x`<path d="M15 14L20 9L15 4" /><path d="M20 9H9A5 5 0 0 0 9 19H12" />`;case"expand":return x`<path d="M15 3H21V9M9 21H3V15M21 3L14 10M3 21L10 14" />`}}function H(e){return h`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SC(e)}</svg>`}var zt="color-mix(in srgb, var(--k) 45%, #6b7280)",ji='system-ui, -apple-system, "Segoe UI", sans-serif';function Jy(e,n,t,i){let r=135+270*Math.max(0,Math.min(1,i)),o=d=>{let u=d*Math.PI/180;return{x:(e-t*Math.cos(u)).toFixed(2),y:(n-t*Math.sin(u)).toFixed(2)}},s=o(135),l=o(r),c=r-135>180?1:0;return`M${s.x} ${s.y}A${t} ${t} 0 ${c} 1 ${l.x} ${l.y}`}function ap(e,n,t,i){return x`<g fill="none" stroke-linecap="round">
    <path d=${Jy(e,n,t,1)} stroke=${zt} stroke-width="2.6" opacity=".5" />
    <path d=${Jy(e,n,t,i)} stroke="var(--k)" stroke-width="2.6" />
  </g>`}function TC(e){switch(e){case"text":return x`<g font-family=${ji} text-anchor="middle">
        <text x="36" y="27" font-size="19" font-weight="600" fill="var(--k)">72°</text>
        <text x="36" y="38" font-size="8" fill=${zt}>Kitchen</text>
        <text x="90" y="20" font-size="11" font-weight="500" fill=${zt}>48%</text>
        <text x="90" y="34" font-size="11" font-weight="500" fill=${zt}>1.2 kW</text>
      </g>`;case"icon":return x`<g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
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
      </g>`;case"gauge":return x`<g>
        ${ap(22,24,12,.28)}
        ${ap(60,24,12,.62)}
        ${ap(98,24,12,.92)}
        <text x="60" y="27" font-family=${ji} font-size="8" font-weight="600" text-anchor="middle" fill="var(--k)">62</text>
      </g>`;case"chart":return x`<g>
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
      </g>`;case"timeline":return x`<g>
        <rect x="6" y="17" width="30" height="12" rx="2.5" fill=${zt} opacity=".55" />
        <rect x="37" y="17" width="18" height="12" rx="2.5" fill="var(--k)" />
        <rect x="56" y="17" width="8" height="12" rx="2.5" fill=${zt} opacity=".55" />
        <rect x="65" y="17" width="24" height="12" rx="2.5" fill="var(--k)" />
        <rect x="90" y="17" width="24" height="12" rx="2.5" fill=${zt} opacity=".55" />
        <text x="6" y="39" font-family=${ji} font-size="7" fill=${zt}>1h ago</text>
        <text x="114" y="39" font-family=${ji} font-size="7" text-anchor="end" fill=${zt}>now</text>
      </g>`;case"shape":return x`<g fill="none" stroke="var(--k)" stroke-width="2">
        <rect x="6" y="12" width="26" height="22" rx="6" fill="var(--k)" fill-opacity=".18" />
        <rect x="40" y="11" width="2.5" height="24" fill="var(--k)" stroke="none" />
        <circle cx="63" cy="23" r="11" />
        <rect x="83" y="16" width="31" height="14" rx="7" stroke-dasharray="3 3" opacity=".7" />
      </g>`;case"image":return x`<g>
        <rect x="26" y="7" width="68" height="32" rx="5" fill="var(--k)" fill-opacity=".16"
          stroke="var(--k)" stroke-width="1.8" />
        <circle cx="44" cy="18" r="4" fill="var(--k)" opacity=".75" />
        <path d="M28 37L47 24L60 32L74 20L92 37Z" fill="var(--k)" opacity=".55" />
      </g>`;case"tap":return x`<g>
        <rect x="30" y="6" width="60" height="34" rx="8" fill="var(--k)" fill-opacity=".12"
          stroke="var(--k)" stroke-width="1.6" stroke-dasharray="5 4" />
        <g fill="none" stroke="var(--k)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
          transform="translate(48 9) scale(1)">
          <path d="M10 12V5.5a1.8 1.8 0 0 1 3.6 0V12" />
          <path d="M13.6 10.5a1.8 1.8 0 0 1 3.6 0V13" />
          <path d="M10 11.5a1.8 1.8 0 0 0-3.6 0v3.5a6.6 6.6 0 0 0 13.2 0v-1.5" />
        </g>
      </g>`;case"chartTimes":return x`<g font-family=${ji} font-size="8" fill="var(--k)">
        <text x="6" y="27">9 AM</text>
        <text x="60" y="27" text-anchor="middle">1 PM</text>
        <text x="114" y="27" text-anchor="end">5 PM</text>
      </g>`;case"chartDots":return x`<g fill="var(--k)">
        <circle cx="20" cy="30" r="3" /><circle cx="45" cy="18" r="3" /><circle cx="70" cy="24" r="3" /><circle cx="95" cy="12" r="3" />
      </g>`;case"chartGrid":return x`<g stroke="var(--k)" stroke-width="1.4" opacity=".7">
        <path d="M10 12H110M10 23H110M10 34H110" />
      </g>`;case"list":return x`<g font-family=${ji}>
        <g fill="var(--k)"><circle cx="14" cy="12" r="3.2" /><circle cx="14" cy="23" r="3.2" /><circle cx="14" cy="34" r="3.2" /></g>
        <g fill=${zt} font-size="9">
          <text x="24" y="15">Kitchen</text><text x="24" y="26">Hall</text><text x="24" y="37">Porch</text>
        </g>
        <g fill="var(--k)" font-size="9" text-anchor="end">
          <text x="108" y="15">21°</text><text x="108" y="26">19°</text><text x="108" y="37">12°</text>
        </g>
      </g>`;case"imageTime":return x`<g>
        <rect x="30" y="14" width="60" height="18" rx="9" fill="var(--k)" fill-opacity=".3" />
        <text x="60" y="27" text-anchor="middle" font-family=${ji} font-size="10" fill="var(--k)">3:41:07</text>
      </g>`}}function Zy(e){return h`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${TC(e)}</svg>`}var Qy={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},eb=e=>(...n)=>({_$litDirective$:e,values:n}),Al=class{constructor(n){}get _$AU(){return this._$AM._$AU}_$AT(n,t,i){this._$Ct=n,this._$AM=t,this._$Ci=i}_$AS(n,t){return this.update(n,t)}update(n,t){return this.render(...t)}};var{I:EC}=Vh,tb=e=>e;var nb=()=>document.createComment(""),Ba=(e,n,t)=>{let i=e._$AA.parentNode,a=n===void 0?e._$AB:n._$AA;if(t===void 0){let r=i.insertBefore(nb(),a),o=i.insertBefore(nb(),a);t=new EC(r,o,e,e.options)}else{let r=t._$AB.nextSibling,o=t._$AM,s=o!==e;if(s){let l;t._$AQ?.(e),t._$AM=e,t._$AP!==void 0&&(l=e._$AU)!==o._$AU&&t._$AP(l)}if(r!==a||s){let l=t._$AA;for(;l!==r;){let c=tb(l).nextSibling;tb(i).insertBefore(l,a),l=c}}}return t},ni=(e,n,t=e)=>(e._$AI(n,t),e),RC={},ib=(e,n=RC)=>e._$AH=n,ab=e=>e._$AH,Fl=e=>{e._$AR(),e._$AA.remove()};var rb=(e,n,t)=>{let i=new Map;for(let a=n;a<=t;a++)i.set(e[a],a);return i},rp=eb(class extends Al{constructor(e){if(super(e),e.type!==Qy.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,n,t){let i;t===void 0?t=n:n!==void 0&&(i=n);let a=[],r=[],o=0;for(let s of e)a[o]=i?i(s,o):o,r[o]=t(s,o),o++;return{values:r,keys:a}}render(e,n,t){return this.dt(e,n,t).values}update(e,[n,t,i]){let a=ab(e),{values:r,keys:o}=this.dt(n,t,i);if(!Array.isArray(a))return this.ut=o,r;let s=this.ut??=[],l=[],c,d,u=0,p=a.length-1,f=0,g=r.length-1;for(;u<=p&&f<=g;)if(a[u]===null)u++;else if(a[p]===null)p--;else if(s[u]===o[f])l[f]=ni(a[u],r[f]),u++,f++;else if(s[p]===o[g])l[g]=ni(a[p],r[g]),p--,g--;else if(s[u]===o[g])l[g]=ni(a[u],r[g]),Ba(e,l[g+1],a[u]),u++,g--;else if(s[p]===o[f])l[f]=ni(a[p],r[f]),Ba(e,a[u],a[p]),p--,f++;else if(c===void 0&&(c=rb(o,f,g),d=rb(s,u,p)),c.has(s[u]))if(c.has(s[p])){let b=d.get(o[f]),y=b!==void 0?a[b]:null;if(y===null){let v=Ba(e,a[u]);ni(v,r[f]),l[f]=v}else l[f]=ni(y,r[f]),Ba(e,a[u],y),a[b]=null;f++}else Fl(a[p]),p--;else Fl(a[u]),u++;for(;f<=g;){let b=Ba(e,l[g+1]);ni(b,r[f]),l[f++]=b}for(;u<=p;){let b=a[u++];b!==null&&Fl(b)}return this.ut=o,ib(e,l),pn}});var Ml=[{kind:"toggle",title:"Toggle button",blurb:"An icon that toggles the entity when tapped and looks different while it is on.",domains:Kc,layerCount:2},{kind:"status",title:"Status text",blurb:"The entity's state as one line of text, dimmed while it is unavailable.",layerCount:1},{kind:"gauge",title:"Sensor gauge",blurb:"An arc that fills with the entity's reading and changes colour across three bands.",preferNumeric:!0,layerCount:1},{kind:"chart",title:"Forecast chart",blurb:"A bar chart of the readings already in the entity, with the highest and lowest marked. For a forecast sensor that holds a list.",layerCount:1},{kind:"history",title:"History chart",blurb:"A line of how the entity has moved over the last six hours, read from Home Assistant's recorder.",preferNumeric:!0,layerCount:1},{kind:"doorHistory",title:"Door history",blurb:"A strip of when the entity was open over the last hour, with its name above. For a door, a window or anything else with two states.",domains:["binary_sensor","cover"],layerCount:2},{kind:"camera",title:"Camera",blurb:"The camera's latest snapshot, filling the face.",domains:["camera"],layerCount:1},{kind:"listEvents",title:"Next events",blurb:"The next three events from one calendar, each with the time it starts.",domains:["calendar"],layerCount:1,group:"list",families:Nt},{kind:"listTodo",title:"To-do",blurb:"Open items from one list. Tap a row to complete it.",domains:["todo"],layerCount:1,group:"list",families:Nt},{kind:"listHourly",title:"Hourly forecast",blurb:"Six hours across the face: the time, the weather and the temperature.",domains:["weather"],layerCount:1,group:"list",families:Nt},{kind:"listDaily",title:"Daily forecast",blurb:"Five days across the face: the day, the weather, the high and the low.",domains:["weather"],layerCount:1,group:"list",families:Nt},{kind:"listLightsOn",title:"Lights on",blurb:"Every light that is on, one per row. Tap a row to turn that light off.",layerCount:1,group:"list",needsEntity:!1,families:Nt},{kind:"listBatteries",title:"Low batteries",blurb:"Your battery sensors, emptiest first, each with a bar that runs down as it does.",layerCount:1,group:"list",needsEntity:!1,families:Nt},{kind:"listRecent",title:"Recent activity",blurb:"Whatever changed most recently, newest first, with how long ago it was.",layerCount:1,group:"list",needsEntity:!1,families:Nt},{kind:"listScenes",title:"Scenes grid",blurb:"Your scenes as a two by two grid. Tap a cell to run that scene.",layerCount:1,group:"list",needsEntity:!1,families:Nt}];function sp(e){return Ml.find(n=>n.kind===e)??Ml[0]}var ao="#FF9F0A",An="#8E8E93",AC=["#FF453A","#FFD60A","#34C759"],lb=["#0A84FF","#34C759","#FF9F0A"];function FC(e){return e?.attributes?.device_class==="battery"?AC:lb}var MC={light:{off:"lightbulb",on:"lightbulb.fill"},switch:{off:"power",on:"power"},fan:{off:"fan.fill",on:"fan.fill"},input_boolean:{off:"circle",on:"circle.fill"},cover:{off:"curtains.closed",on:"window.casement"},lock:{off:"lock.open.fill",on:"lock.fill"},media_player:{off:"speaker.slash.fill",on:"speaker.wave.2.fill"},siren:{off:"bell.slash.fill",on:"bell.fill"},humidifier:{off:"humidifier.fill",on:"humidifier.fill"},valve:{off:"spigot.fill",on:"spigot.fill"},automation:{off:"gearshape.fill",on:"gearshape.fill"},script:{off:"play.fill",on:"play.fill"},scene:{off:"sparkles",on:"sparkles"},climate:{off:"thermometer.medium",on:"flame.fill"},binary_sensor:{off:"circle",on:"circle.fill"},group:{off:"circle",on:"circle.fill"}};function lp(e){let n=e.iconName?.trim();return n?{off:n,on:n}:op(e)??{off:"circle",on:"circle.fill"}}function op(e){return MC[dp(e)]}function LC(e){switch(dp(e)){case"lock":return{kind:"equals",value:U("locked")};case"cover":case"valve":return{kind:"equals",value:U("open")};case"media_player":return{kind:"equals",value:U("playing")};default:return{kind:"isOn"}}}function dp(e){return e.domain||e.entityId.split(".")[0]||""}function Mt(e){return{...e,domain:dp(e)}}function db(e){return e.displayName.trim()||e.entityId.trim()}function IC(e,n,t){if(e.kind.kind!=="literal")return!1;let i=e.kind.value.trim();return i===""||i==="Control"||n!==void 0&&i===n.trim()?!0:t!==void 0&&i===db(t)}function HC(e,n){return e===void 0||n===void 0?!1:e.kind.kind==="entityState"&&e.kind.entityId===n.entityId}function cb(e,n,t,i){if(n.entityId.trim()==="")return e;let a=t!==void 0&&t.entityId.trim()!==""?t:void 0,r={...e},o=Qt(r)==="toggle";IC(r.title,i,a)&&(r.title=U(db(n))),o&&(r.state===void 0||HC(r.state,a))&&(r.state=Ll(n));let s=op(n);if(s!==void 0){let l=a===void 0?void 0:op(a);(r.symbol.trim()===""||r.symbol===Is||l!==void 0&&r.symbol===l.on)&&(r.symbol=s.on),o&&(r.symbolOff===void 0||l!==void 0&&r.symbolOff===l.off)&&(s.off===s.on?delete r.symbolOff:r.symbolOff=s.off)}return(r.tintColorHex===void 0||r.tintColorHex===ao)&&(r.tintColorHex=ao),r}function _C(e){let n=e?.attributes??{},t=n.min,i=n.max;if(typeof t=="number"&&typeof i=="number"&&i>t)return{min:t,max:i};let a=typeof n.device_class=="string"?n.device_class:"",r=typeof n.unit_of_measurement=="string"?n.unit_of_measurement:"";switch(a){case"battery":case"humidity":case"moisture":return{min:0,max:100};case"temperature":return r.includes("F")?{min:0,max:100}:{min:-10,max:40};default:return r==="%"?{min:0,max:100}:{min:0,max:100}}}function Va(e){return Math.round(e*1e4)/1e4}function Yi(e,n,t){return Math.min(t,Math.max(n,e))}function cp(e,n,t){let i=He[e],a=Yi(Va(n/i.width),0,1),r=Yi(Va(t/i.height),0,1);return{x:Va((1-a)/2),y:Va((1-r)/2),width:a,height:r,rotationDegrees:0}}function PC(e){let n=He[e],t=Yi(Math.round(Math.min(n.width,n.height)*.55),12,30);return{frame:cp(e,t*1.3,t*1.3),size:t}}function NC(e){let n=He[e],t=Yi(Math.round(Math.min(n.width,n.height)*.3),9,20);return{frame:cp(e,n.width*.88,t*1.7),size:t}}function DC(e){let n=He[e],t=Math.min(n.width,n.height)*.9;return{frame:cp(e,t,t),size:Math.max(2.5,Math.round(t*.2)/2)}}function ub(e){let n=e==="rectangular"||e==="medium";return{frame:{x:.05,y:n?.34:.3,width:.9,height:n?.42:.4,rotationDegrees:0},size:2}}function OC(e){let n=He[e],t=Yi(Math.round(n.height*.2),6,14);return{frame:{x:.06,y:.56,width:.88,height:Va(t/n.height),rotationDegrees:0}}}function zC(e){let n=He[e],t=Yi(Math.round(Math.min(n.width,n.height)*.26),8,15);return{frame:{x:.06,y:.2,width:.88,height:Va(Yi(t*1.5/n.height,0,1)),rotationDegrees:0},size:t}}function GC(){return{frame:{x:0,y:0,width:1,height:1,rotationDegrees:0}}}function BC(e,n){n!==void 0&&(e.kind==="text"?e.payload.fontSize=n:e.kind==="icon"?e.payload.size=n:(e.kind==="gauge"||e.kind==="chart")&&(e.payload.lineWidth=n))}function Fn(e,n,t,i){let a=i(t);n.payload.frame=a.frame,BC(n,a.size);let r=e.perFamily[t]??(e.perFamily[t]=At());r.placements[n.payload.id]={frame:a.frame,isHidden:!1,...a.size!==void 0?{size:a.size}:{}}}function yt(e){return De(e)}function Ll(e,n){let t={kind:{kind:"entityState",...Mt(e)}},i=n?.attributes?.unit_of_measurement;return typeof i=="string"&&i.trim()!==""&&(t.format={useEntityUnit:!0}),t}function ob(e){let n=Jn("setIcon");return n.value=U(e),n}function qi(e){let n=Jn("setColor");return n.value=U(e),n}function VC(e,n){let t=La(),i=t.cases[0],a=i.when.tests[0];a.value={kind:{kind:"entityState",...Mt(e)}},a.comparison=LC(e);let r=n.on!==n.off;return i.then=r?[ob(n.on),qi(ao)]:[qi(ao)],t.otherwise=r?[ob(n.off),qi(An)]:[qi(An)],t}function UC(e){let n=La(),t=n.cases[0],i=t.when.tests[0];i.value={kind:{kind:"entityState",...Mt(e)}},i.comparison={kind:"isUnavailable"};let a=Jn("setOpacity");return a.number=.35,t.then=[a],n}function sb(e){let n=Math.abs(e)>=10?Math.round(e):Math.round(e*10)/10;return String(n)}function KC(e,n,t=lb){let i=n.max-n.min,a=sb(n.min+i/3),r=sb(n.min+i*2/3),o=[{comparison:{kind:"lessThan",value:U(a)},changes:[qi(t[0])]},{comparison:{kind:"between",value:U(a),upper:U(r)},changes:[qi(t[1])]},{comparison:{kind:"greaterThan",value:U(r)},changes:[qi(t[2])]}];return Rl(Ll(e),o)}function WC(e,n,t){let i=yt("icon"),a=lp(n);return i.payload.symbol=U(a.off),i.payload.colorSlot.baseColorHex=An,i.payload.rules=[VC(n,a)],Fn(e,i,t.family,PC),e.elements.push(i),Bs(e,i.payload.id,{type:"toggleEntity",...Mt(n)}),i.payload.id}function jC(e,n,t){let i=yt("text");return i.payload.value=Ll(n,t.state),i.payload.rules=[UC(n)],Fn(e,i,t.family,NC),e.elements.push(i),i.payload.id}function qC(e,n,t){let i=yt("gauge");i.payload.value=Ll(n);let a=_C(t.state);return i.payload.minValue=a.min,i.payload.maxValue=a.max,i.payload.rules=[KC(n,a,FC(t.state))],Fn(e,i,t.family,DC),e.elements.push(i),i.payload.id}function YC(e,n,t){let i=yt("chart");return i.payload.value={kind:{kind:"entityState",...Mt(n)}},i.payload.historyMinutes=0,i.payload.highlight="both",i.payload.marker="pointer",Fn(e,i,t.family,ub),e.elements.push(i),i.payload.id}function XC(e,n,t){let i=yt("chart");return i.payload.value={kind:{kind:"entityState",...Mt(n)}},i.payload.historyMinutes=360,i.payload.historyPoints=24,i.payload.style="line",i.payload.highlight="both",i.payload.marker="pointer",Fn(e,i,t.family,ub),e.elements.push(i),i.payload.id}function JC(e,n,t){let i=Mt(n),a=yt("text");a.payload.value=U(i.displayName||i.entityId),a.payload.colorSlot.baseColorHex=An,Fn(e,a,t.family,zC),e.elements.push(a);let r=t.state?.attributes?.device_class,o=yt("timeline");return o.payload.value={kind:{kind:"entityState",...i}},o.payload.bands=ha(i.domain,typeof r=="string"?r:void 0),Fn(e,o,t.family,OC),e.elements.push(o),o.payload.id}function ZC(e,n,t){let i=yt("image");return i.payload.entity=Mt(n),Fn(e,i,t.family,GC),e.elements.push(i),i.payload.id}function QC(){return{x:.04,y:.06,width:.92,height:.88,rotationDegrees:0}}function Je(e,n){let t={kind:{kind:"item",field:e}};return n&&(t.format=n),t}function ct(e,n,t={}){let i=yt("text");return i.payload.value=e,i.payload.frame={...n,rotationDegrees:0},i.payload.fontSize=t.size??11,t.weight&&(i.payload.fontWeight=t.weight),t.align&&t.align!=="center"&&(i.payload.alignment=t.align),t.colorHex&&(i.payload.colorSlot.baseColorHex=t.colorHex),i}function ro(e,n=11){let t=yt("icon");return t.payload.symbol=Je("icon"),t.payload.frame={...e,rotationDegrees:0},t.payload.size=n,t}function e1(e,n,t){let i=yt("shape");return i.payload.kind="capsule",i.payload.borderWidth=0,i.payload.frame={...n,rotationDegrees:0},i.payload.colorSlot.baseColorHex=t,i.payload.level={...ds(e),direction:"right"},i}function up(e){let n=yt("tap");return n.payload.action=e,n.payload.frame={x:0,y:0,width:1,height:1,rotationDegrees:0},n}function ii(e,n,t,i,a){let r=yt("list");return r.payload.source=t,r.payload.rows=i.rows,i.direction&&(r.payload.direction=i.direction),i.columns!==void 0&&(r.payload.columns=i.columns),i.gap!==void 0&&(r.payload.gap=i.gap),r.payload.template=a,Fn(e,r,n.family,()=>({frame:QC()})),e.elements.push(r),r.payload.id}function t1(e,n,t){return ii(e,t,{kind:"calendar",entities:[Mt(n)],hours:24},{rows:3},[ct(Je("title"),{x:0,y:0,width:.68,height:1},{align:"leading"}),ct(Je("start",{timestamp:"clock"}),{x:.7,y:0,width:.3,height:1},{align:"trailing",colorHex:An})])}function n1(e,n,t){let i=Mt(n),a={type:"callService",serviceDomain:"todo",serviceName:"update_item",serviceDataJSON:'{"entity_id": "{item.listId}", "item": "{item.uid}", "status": "completed"}'};return ii(e,t,{kind:"todo",entities:[i],status:"open",sort:"list"},{rows:4},[ro({x:0,y:.1,width:.14,height:.8},10),ct(Je("title"),{x:.18,y:0,width:.82,height:1},{align:"leading"}),up(a)])}function i1(e,n,t){return ii(e,t,{kind:"forecast",...Mt(n),type:"hourly"},{rows:6,direction:"across",gap:1},[ct(Je("time",{timestamp:"clock"}),{x:0,y:0,width:1,height:.3},{size:9,colorHex:An}),ro({x:.15,y:.34,width:.7,height:.32},12),ct(Je("temperature",{decimals:0,suffix:"\xB0"}),{x:0,y:.7,width:1,height:.3},{size:10})])}function a1(e,n,t){return ii(e,t,{kind:"forecast",...Mt(n),type:"daily"},{rows:5,direction:"across",gap:1},[ct(Je("time",{timestamp:"weekday"}),{x:0,y:0,width:1,height:.26},{size:9,colorHex:An}),ro({x:.18,y:.3,width:.64,height:.28},12),ct(Je("temperature",{decimals:0,suffix:"\xB0"}),{x:0,y:.6,width:1,height:.22},{size:10}),ct(Je("templow",{decimals:0,suffix:"\xB0"}),{x:0,y:.8,width:1,height:.2},{size:9,colorHex:An})])}function r1(e,n){return ii(e,n,{kind:"entities",scope:{kind:"filter",domains:["light"],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"},sort:"name",descending:!1,attributes:[]},{rows:4},[ro({x:0,y:.1,width:.14,height:.8},10),ct(Je("name"),{x:.18,y:0,width:.82,height:1},{align:"leading"}),up({type:"toggleEntity",entityId:"{item.entityId}",displayName:"",domain:""})])}function o1(e,n){return ii(e,n,{kind:"entities",scope:{kind:"filter",domains:["sensor"],areaIds:[],labelIds:[],floorIds:[]},deviceClass:"battery",sort:"state",descending:!1,attributes:[]},{rows:4},[e1(Je("state"),{x:0,y:.34,width:.14,height:.32},ao),ct(Je("name"),{x:.18,y:0,width:.5,height:1},{align:"leading"}),ct(Je("state",{decimals:0,useEntityUnit:!0}),{x:.7,y:0,width:.3,height:1},{align:"trailing"})])}function s1(e,n){return ii(e,n,{kind:"entities",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},sort:"lastChanged",descending:!0,attributes:[]},{rows:4},[ct(Je("name"),{x:0,y:0,width:.7,height:1},{align:"leading"}),ct(Je("age",{relativeTime:!0}),{x:.72,y:0,width:.28,height:1},{align:"trailing",colorHex:An})])}function l1(e,n){return ii(e,n,{kind:"entities",scope:{kind:"filter",domains:["scene"],areaIds:[],labelIds:[],floorIds:[]},sort:"name",descending:!1,attributes:[]},{rows:4,columns:2,gap:3},[ro({x:.34,y:.06,width:.32,height:.44},12),ct(Je("name"),{x:0,y:.54,width:1,height:.46},{size:9}),up({type:"runScene",entityId:"{item.entityId}",displayName:"",domain:""})])}function pp(e,n,t,i){switch(n){case"toggle":return WC(e,t,i);case"status":return jC(e,t,i);case"gauge":return qC(e,t,i);case"chart":return YC(e,t,i);case"history":return XC(e,t,i);case"doorHistory":return JC(e,t,i);case"camera":return ZC(e,t,i);case"listEvents":return t1(e,t,i);case"listTodo":return n1(e,t,i);case"listHourly":return i1(e,t,i);case"listDaily":return a1(e,t,i);case"listLightsOn":return r1(e,i);case"listBatteries":return o1(e,i);case"listRecent":return s1(e,i);case"listScenes":return l1(e,i)}}var an=Ht("on"),rn=Ht("off"),bt=Ht("open"),xt=Ht("closed"),d1=Ht("unavailable"),c1=["light","switch","fan","input_boolean"],u1={door:{on:{symbol:"door.left.hand.open",colorHex:bt},off:{symbol:"door.left.hand.closed",colorHex:xt}},garage_door:{on:{symbol:"door.left.hand.open",colorHex:bt},off:{symbol:"door.left.hand.closed",colorHex:xt}},opening:{on:{symbol:"door.left.hand.open",colorHex:bt},off:{symbol:"door.left.hand.closed",colorHex:xt}},window:{on:{symbol:"window.casement",colorHex:bt},off:{symbol:"curtains.closed",colorHex:xt}},motion:{on:{symbol:"figure.walk",colorHex:an},off:{symbol:"figure.stand",colorHex:rn}},occupancy:{on:{symbol:"figure.walk",colorHex:an},off:{symbol:"figure.stand",colorHex:rn}},presence:{on:{symbol:"figure.walk",colorHex:an},off:{symbol:"figure.stand",colorHex:rn}},moisture:{on:{symbol:"drop.fill",colorHex:bt},off:{symbol:"drop",colorHex:rn}},smoke:{on:{symbol:"exclamationmark.triangle.fill",colorHex:bt},off:{symbol:"checkmark.circle.fill",colorHex:xt}},gas:{on:{symbol:"exclamationmark.triangle.fill",colorHex:bt},off:{symbol:"checkmark.circle.fill",colorHex:xt}},carbon_monoxide:{on:{symbol:"exclamationmark.triangle.fill",colorHex:bt},off:{symbol:"checkmark.circle.fill",colorHex:xt}},problem:{on:{symbol:"exclamationmark.triangle.fill",colorHex:bt},off:{symbol:"checkmark.circle.fill",colorHex:xt}},safety:{on:{symbol:"exclamationmark.triangle.fill",colorHex:bt},off:{symbol:"checkmark.circle.fill",colorHex:xt}},battery:{on:{symbol:"battery.25percent",colorHex:bt},off:{symbol:"battery.100percent",colorHex:xt}},lock:{on:{symbol:"lock.open.fill",colorHex:bt},off:{symbol:"lock.fill",colorHex:xt}},plug:{on:{symbol:"powerplug.fill",colorHex:an},off:{symbol:"poweroutlet.type.b.fill",colorHex:rn}},power:{on:{symbol:"powerplug.fill",colorHex:an},off:{symbol:"poweroutlet.type.b.fill",colorHex:rn}},connectivity:{on:{symbol:"wifi",colorHex:xt},off:{symbol:"wifi.slash",colorHex:bt}},sound:{on:{symbol:"speaker.wave.2.fill",colorHex:an},off:{symbol:"speaker.slash.fill",colorHex:rn}},running:{on:{symbol:"play.fill",colorHex:an},off:{symbol:"stop.fill",colorHex:rn}},update:{on:{symbol:"arrow.down.circle.fill",colorHex:an},off:{symbol:"checkmark.circle.fill",colorHex:xt}}},p1={on:{symbol:"circle.fill",colorHex:an},off:{symbol:"circle",colorHex:rn}},h1=[{state:"sunny",symbol:"sun.max.fill",colorHex:"#FFD60A"},{state:"clear-night",symbol:"moon.stars.fill",colorHex:"#5E5CE6"},{state:"partlycloudy",symbol:"cloud.sun.fill",colorHex:"#64D2FF"},{state:"cloudy",symbol:"cloud.fill",colorHex:"#8E8E93"},{state:"fog",symbol:"cloud.fog.fill",colorHex:"#AEAEB2"},{state:"rainy",symbol:"cloud.rain.fill",colorHex:"#64D2FF"},{state:"pouring",symbol:"cloud.heavyrain.fill",colorHex:"#0A84FF"},{state:"lightning",symbol:"cloud.bolt.fill",colorHex:"#FFD60A"},{state:"lightning-rainy",symbol:"cloud.bolt.rain.fill",colorHex:"#FFD60A"},{state:"snowy",symbol:"cloud.snow.fill",colorHex:"#FFFFFF"},{state:"snowy-rainy",symbol:"cloud.drizzle.fill",colorHex:"#AEAEB2"},{state:"hail",symbol:"cloud.snow.fill",colorHex:"#64D2FF"},{state:"windy",symbol:"wind",colorHex:"#8E8E93"},{state:"windy-variant",symbol:"wind",colorHex:"#8E8E93"},{state:"exceptional",symbol:"exclamationmark.triangle.fill",colorHex:"#FF453A"}],f1={cover:[{state:"open",symbol:"window.casement"},{state:"closed",symbol:"curtains.closed"},{state:"opening",symbol:"arrow.up"},{state:"closing",symbol:"arrow.down"}],lock:[{state:"locked",symbol:"lock.fill"},{state:"unlocked",symbol:"lock.open.fill"},{state:"jammed",symbol:"exclamationmark.triangle.fill"}],media_player:[{state:"playing",symbol:"play.fill"},{state:"paused",symbol:"pause.fill"},{state:"idle",symbol:"stop.fill"},{state:"standby",symbol:"zzz"},{state:"off",symbol:"speaker.slash.fill"}],climate:[{state:"heat",symbol:"flame.fill"},{state:"cool",symbol:"snowflake"},{state:"heat_cool",symbol:"thermometer.medium"},{state:"dry",symbol:"humidity.fill"},{state:"fan_only",symbol:"fan.fill"},{state:"auto",symbol:"thermometer.variable"},{state:"off",symbol:"power"}],vacuum:[{state:"cleaning",symbol:"sparkles"},{state:"returning",symbol:"arrow.counterclockwise"},{state:"docked",symbol:"powerplug.fill"},{state:"idle",symbol:"pause.fill"},{state:"error",symbol:"exclamationmark.triangle.fill"}],alarm_control_panel:[{state:"disarmed",symbol:"shield.slash.fill"},{state:"armed_home",symbol:"house.fill"},{state:"armed_away",symbol:"shield.fill"},{state:"armed_night",symbol:"moon.fill"},{state:"armed_vacation",symbol:"airplane",colorHex:"#5E5CE6"},{state:"arming",symbol:"hourglass"},{state:"pending",symbol:"hourglass"},{state:"triggered",symbol:"bell.badge.fill"}],person:[{state:"home",symbol:"house.fill"},{state:"not_home",symbol:"figure.walk"}],device_tracker:[{state:"home",symbol:"house.fill"},{state:"not_home",symbol:"figure.walk"}]},pb={state:"unavailable",symbol:"questionmark.circle.fill",colorHex:d1};function hb(e,n){let t=m1(e.trim().toLowerCase(),(n??"").trim().toLowerCase());return t.length===0?[]:[...t,pb]}function m1(e,n){if(c1.includes(e)){let t=lp({entityId:`${e}.seed`,displayName:"",domain:e});return[{state:"on",symbol:t.on,colorHex:an},{state:"off",symbol:t.off,colorHex:rn}]}if(e==="binary_sensor"){let t=u1[n]??p1;return[{state:"on",symbol:t.on.symbol,colorHex:t.on.colorHex},{state:"off",symbol:t.off.symbol,colorHex:t.off.colorHex}]}return e==="weather"?h1.map(t=>({...t})):(f1[e]??[]).map(t=>({state:t.state,symbol:t.symbol,colorHex:t.colorHex??Ht(t.state)}))}function fb(e,n){return e.map(t=>{let i=[];return n.icon&&i.push({kind:"setIcon",value:U(t.symbol)}),n.color&&i.push({kind:"setColor",value:U(t.colorHex)}),{comparison:t.state===pb.state?{kind:"isUnavailable"}:{kind:"equals",value:U(t.state)},changes:i}})}function mb(e){let n=e?.kind;if(n?.kind!=="entityState")return;let t=n.domain||n.entityId.split(".")[0]||"";return t===""?void 0:{entityId:n.entityId,domain:t}}var gb="sun.sun";function yb(e){let n=e?.[gb],t=typeof n?.attributes?.friendly_name=="string"?n.attributes.friendly_name.trim():"";return{entityId:gb,displayName:t||"Sun",domain:"sun"}}var bb=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],g1=[0,1,2,3,4];function xb(e){let n=[];for(let t of e??[]){let i=t.trim();if(i==="")continue;let a=Number(i);Number.isInteger(a)&&a>=0&&a<=6&&!n.includes(a)&&n.push(a)}return n.sort((t,i)=>t-i)}function hp(e){return[...new Set(e)].filter(n=>n>=0&&n<=6).sort((n,t)=>n-t).map(String)}var vb=[{kind:"afterSunset",label:"After sunset",hint:"True from sunset to sunrise, from the sun entity's own state."},{kind:"daytime",label:"Daytime",hint:"True while the sun is up."},{kind:"sunElevation",label:"Sun below an angle",hint:"The sun's elevation in degrees, below a number you set. 0 is the horizon."},{kind:"weekday",label:"Weekday is one of",hint:"A row of days, starting on Monday to Friday."},{kind:"timeBetween",label:"Time between",hint:"A clock window that may wrap midnight, starting at 22:00 to 06:00."}];function y1(e){return[wb(e,"below_horizon")]}function b1(e){return[wb(e,"above_horizon")]}function wb(e,n){return{id:se(),value:{kind:{kind:"entityState",...e}},comparison:{kind:"equals",value:U(n)}}}function x1(e,n=0){return[{id:se(),value:{kind:{kind:"entityAttribute",...e,attribute:"elevation"}},comparison:{kind:"lessThan",value:U(String(n))}}]}function v1(e=g1){return[{id:se(),value:{kind:{kind:"time",timeField:"weekday"}},comparison:{kind:"isOneOf",options:hp(e)}}]}function w1(e="22:00",n="06:00"){return[{id:se(),value:{kind:{kind:"time",timeField:"now"}},comparison:{kind:"timeBetween",value:U(e),upper:U(n)}}]}function kb(e,n){switch(e){case"afterSunset":return y1(n);case"daytime":return b1(n);case"sunElevation":return x1(n);case"weekday":return v1();case"timeBetween":return w1()}}var Ua=["index","Position (0 first)"],k1={entities:[["name","Name"],["state","State"],["unit","Unit"],["entityId","Entity id"],["domain","Domain"],["deviceClass","Device class"],["area","Area"],["icon","Icon"],["lastChanged","Last changed (seconds)"],["age","Age (seconds)"],Ua],attribute:[["value","Value"],Ua],template:[["value","Value"],Ua],calendar:[["title","Title"],["start","Start (seconds)"],["end","End (seconds)"],["startsIn","Starts in (seconds)"],["endsIn","Ends in (seconds)"],["isAllDay","All day"],["location","Location"],["description","Description"],["calendar","Calendar"],["calendarId","Calendar id"],["icon","Icon"],Ua],todo:[["title","Title"],["status","Status"],["due","Due (seconds)"],["dueIn","Due in (seconds)"],["description","Description"],["uid","Item id"],["list","List"],["listId","List id"],["icon","Icon"],Ua],forecast:[["time","Time (seconds)"],["condition","Condition"],["icon","Icon"],["temperature","Temperature"],["templow","Low temperature"],["unit","Unit"],["precipitation","Precipitation"],["precipitationProbability","Chance of rain"],["humidity","Humidity"],["windSpeed","Wind speed"],["isDaytime","Daytime"],Ua]};function mp(e){let n=k1[e.kind];return e.kind!=="entities"||e.attributes.length===0?n:[...n,...e.attributes.map(t=>[`attr.${t}`,`Attribute: ${t}`])]}var Xi=60,Mn=3600,Ka=86400;function ut(e,n){return Math.round(e+n)}function $1(e){return[{entityId:"light.kitchen",name:"Kitchen",state:"on",unit:null,domain:"light",deviceClass:null,area:"Kitchen",lastChanged:ut(e,-2*Xi),n:null},{entityId:"light.hallway",name:"Hallway",state:"on",unit:null,domain:"light",deviceClass:null,area:"Hallway",lastChanged:ut(e,-18*Xi),n:null},{entityId:"sensor.living_room_temperature",name:"Living room",state:"21.5",unit:"\xB0C",domain:"sensor",deviceClass:"temperature",area:"Living room",lastChanged:ut(e,-1*Xi),n:21.5},{entityId:"binary_sensor.front_door",name:"Front door",state:"on",unit:null,domain:"binary_sensor",deviceClass:"door",area:"Hallway",lastChanged:ut(e,-45),n:null}]}function C1(e){return[{entityId:"sensor.front_door_battery",name:"Front door",state:"8",unit:"%",domain:"sensor",deviceClass:"battery",area:"Hallway",lastChanged:ut(e,-2*Xi),n:8},{entityId:"sensor.thermostat_battery",name:"Thermostat",state:"34",unit:"%",domain:"sensor",deviceClass:"battery",area:"Living room",lastChanged:ut(e,-26*Xi),n:34},{entityId:"sensor.back_door_battery",name:"Back door",state:"67",unit:"%",domain:"sensor",deviceClass:"battery",area:"Kitchen",lastChanged:ut(e,-3*Mn),n:67},{entityId:"sensor.doorbell_battery",name:"Doorbell",state:"95",unit:"%",domain:"sensor",deviceClass:"battery",area:"Hallway",lastChanged:ut(e,-9*Mn),n:95}]}function S1(e){let n=Math.floor(e/Ka)*Ka;return[{title:"Bin day",start:n,end:n+Ka,isAllDay:!0,location:null,description:null,calendar:"Home",calendarId:"calendar.home"},{title:"Stand-up",start:ut(e,25*Xi),end:ut(e,40*Xi),isAllDay:!1,location:"Office",description:null,calendar:"Work",calendarId:"calendar.work"},{title:"Dentist",start:ut(e,5*Mn),end:ut(e,6*Mn),isAllDay:!1,location:"High Street",description:null,calendar:"Home",calendarId:"calendar.home"}]}function T1(e){return[{title:"Milk",status:"open",due:ut(e,3*Mn),description:null,uid:"seed-1",list:"Shopping",listId:"todo.shopping"},{title:"Water the plants",status:"open",due:ut(e,-20*Mn),description:null,uid:"seed-2",list:"Shopping",listId:"todo.shopping"},{title:"Book the car in",status:"open",due:"",description:null,uid:"seed-3",list:"Shopping",listId:"todo.shopping"}]}var E1=[["sunny",18,0],["partlycloudy",19,5],["partlycloudy",20,10],["cloudy",19,25],["rainy",17,70],["rainy",16,55]],R1=[["sunny",21,12,0],["partlycloudy",20,11,10],["rainy",17,10,80],["cloudy",18,11,30],["sunny",22,13,0]];function A1(e,n){if(n==="hourly"){let i=Math.ceil(e/Mn)*Mn;return E1.map(([a,r,o],s)=>({time:i+s*Mn,condition:a,temperature:r,templow:null,unit:"\xB0C",precipitation:o>20?.4:0,precipitationProbability:o,humidity:60+s,windSpeed:8+s,isDaytime:!0}))}let t=Math.floor(e/Ka)*Ka;return R1.map(([i,a,r,o],s)=>({time:t+s*Ka,condition:i,temperature:a,templow:r,unit:"\xB0C",precipitation:o>20?2.5:0,precipitationProbability:o,humidity:62+s,windSpeed:10+s,isDaytime:n==="twiceDaily"?s%2===0:!0}))}var F1=["Living room","Kitchen","Bedroom","Office"];function M1(e,n){switch(e.kind){case"entities":return e.deviceClass?.trim()==="battery"?C1(n):$1(n);case"calendar":return S1(n);case"todo":return T1(n);case"forecast":return A1(n,e.type);case"attribute":case"template":return[...F1]}}function fp(e,n){let t=M1(e,n);return JSON.stringify({items:t,total:t.length})}var L1={entityId:"calendar.sample",displayName:"Sample calendar",domain:"calendar"},I1={entityId:"todo.sample",displayName:"Sample list",domain:"todo"},H1={entityId:"weather.sample",displayName:"Sample forecast",domain:"weather"},_1="{{ [] | to_json }}";function P1(e){switch(e.kind){case"calendar":return e.entities.some(n=>n.entityId!=="")?e:{...e,entities:[L1]};case"todo":return e.entities.some(n=>n.entityId!=="")?e:{...e,entities:[I1]};case"forecast":return e.entityId===""?{...e,...H1}:e;case"template":return e.value.trim()===""?{...e,value:_1}:e;default:return e}}function $b(e,n,t,i){let a=P1(e.source),r=Zn(a,e.rows),o=r??Sn(a),l=(r!==void 0?n.get(r):o===void 0?void 0:t.get(o))??fp(a,i),d=mu(l,nt(e.rows),a,i).items[0];return d===void 0?void 0:{source:a,fields:d.fields}}function N1(e){let n=[];for(let t of e.elements)t.kind==="list"&&n.push(t.payload);return n}function Cb(e,n,t,i){if(!e)return{templateResults:n,listItems:t};let a=n,r=t;for(let o of N1(e)){let s=Zn(o.source,o.rows);if(s!==void 0){if(a.has(s))continue;a===n&&(a=new Map(n)),a.set(s,fp(o.source,i));continue}let l=Sn(o.source);l===void 0||r.has(l)||(r===t&&(r=new Map(t)),r.set(l,fp(o.source,i)))}return{templateResults:a,listItems:r}}function gp(e){delete e.coloring,delete e.bands,delete e.bandAboveColorHex,delete e.highlight,delete e.highColorHex,delete e.lowColorHex}function lo(e){for(let n of e)delete n.partId}function Sb(e,n=se()){if(e.parts!==void 0&&e.parts.length>0)return e.parts[0].id;let t={id:n,value:structuredClone(e.value)};return e.coloring==="bands"&&(e.bands?.length??0)>0&&(t.coloring="bands",t.bands=e.bands,e.bandAboveColorHex!==void 0&&e.bandAboveColorHex!==ve&&(t.bandAboveColorHex=e.bandAboveColorHex)),gp(e),e.parts=[t],e.value=Er(e.parts),n}function Il(e,n=[]){let t=e.parts??[];if(e.countdown===!0||t.length===0)return delete e.parts,lo(e.rules),{ok:!0,joined:!1,moved:[]};if(t.length===1){let a=t[0],r=[];return e.value=a.value,a.fontSize!==void 0&&(e.fontSize=a.fontSize,r.push("fontSize")),a.fontWeight!==void 0&&(e.fontWeight=a.fontWeight,r.push("fontWeight")),a.colorHex!==void 0&&(e.colorSlot.baseColorHex=a.colorHex,r.push("color")),gp(e),a.coloring!==void 0&&a.coloring!=="uniform"&&(e.coloring=a.coloring),a.bands!==void 0&&a.bands.length>0&&(e.bands=a.bands),a.bandAboveColorHex!==void 0&&(e.bandAboveColorHex=a.bandAboveColorHex),a.coloring==="bands"&&(a.bands?.length??0)>0&&r.push("bands"),delete e.parts,lo(e.rules),{ok:!0,joined:!1,moved:r}}let i=yp(t,n);return i.ok?(e.value=i.value,gp(e),delete e.parts,lo(e.rules),{ok:!0,joined:!0}):i}function oo(e){return"'"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"}function so(e){return e.includes("{")?`{% raw %}${e}{% endraw %}`:e}function D1(e,n){let t=e,i=e.format;for(let r=0;t.kind.kind==="named";r++){if(r>8)return;let o=t.kind.id.toUpperCase(),s=n.find(l=>l.id.toUpperCase()===o)?.value;if(!s)return;i=Xe(i)?s.format:i,t=s}let a={kind:t.kind};return Xe(i)||(a.format=i),a}function O1(e,n){let t=D1(e,n);if(!t)return{blocked:"kind"};let i=Fi(t);if(i!==void 0)return so(i);let a=t.kind,r=t.format??{};if(r.relativeTime||r.duration)return{blocked:"format"};let o="",s;switch(a.kind){case"entityState":s=`states(${oo(a.entityId)})`;break;case"jinja":{if(a.value.trim()==="")return"";let d=a.value.includes("{{")||a.value.includes("{%"),u=r.decimals===void 0&&r.multiply===void 0&&r.offset===void 0&&!r.textCase;if(d&&u)return so(r.prefix??"")+a.value+so(r.suffix??"");d?(o=`{% set wa_text %}${a.value}{% endset %}`,s="wa_text"):s=`(${a.value})`;break}case"entityAttribute":case"entityAge":case"aggregate":case"time":{let d=Kr(a);if(d===void 0)return{blocked:"kind"};s=d;break}default:return{blocked:"kind"}}if(r.decimals!==void 0||r.multiply!==void 0||r.offset!==void 0){let d=`(${s} | float(0))`;r.multiply!==void 0&&(d=`(${d} * ${r.multiply})`),r.offset!==void 0&&(d=`(${d} + ${r.offset})`),s=r.decimals!==void 0?`${oo(`%.${Math.max(0,Math.trunc(r.decimals))}f`)} | format(${d})`:d}let l=r.useEntityUnit&&"entityId"in a?a.entityId:void 0;l!==void 0&&(o+=`{% set wa_unit = state_attr(${oo(l)}, 'unit_of_measurement') %}`);let c="('' if not wa_unit else (wa_unit if wa_unit[:1] in ['\xB0', '%'] else ' ' ~ wa_unit))";if(r.textCase){let d=r.textCase==="upper"?"upper":r.textCase==="lower"?"lower":"title",u=[...r.prefix?[oo(r.prefix)]:[],`(${s})`,...l!==void 0?[c]:[],...r.suffix?[oo(r.suffix)]:[]].join(" ~ ");return`${o}{{ (${u}) | ${d} }}`}return o+so(r.prefix??"")+`{{ ${s} }}`+(l!==void 0?`{{ ${c} }}`:"")+so(r.suffix??"")}function yp(e,n=[]){if(e.every(a=>a.value.kind.kind==="literal"))return{ok:!0,value:Er(e)};let t=[],i=[];return e.forEach((a,r)=>{let o=O1(a.value,n);typeof o=="string"?t.push(o):i.push({index:r,partId:a.id,reason:o.blocked})}),i.length>0?{ok:!1,blocked:i}:{ok:!0,value:{kind:{kind:"jinja",value:t.join("")}}}}var Tb=2,bp=400,z1=.85,G1=[1,.8,.64,.51,.41,.33],Eb="image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif";function B1(e,n){let t=Number.isFinite(e)&&e>0?e*Tb:bp,i=Number.isFinite(n)&&n>0?n*Tb:bp,a=Math.min(1,bp/Math.max(t,i));return{width:Math.max(1,Math.round(t*a)),height:Math.max(1,Math.round(i*a))}}function V1(e,n,t,i){if(!(e>0)||!(n>0))return{width:1,height:1};let a=Math.min(1,t/e,i/n);return{width:Math.max(1,Math.round(e*a)),height:Math.max(1,Math.round(n*a))}}function U1(e){return Es(e)<=Pr}function Hl(e){return e<=0?"0 KB":`${Math.max(1,Math.round(e/1024))} KB`}function K1(e){let n=e.indexOf(",");return n<0?"":e.slice(n+1)}async function W1(e){let n=URL.createObjectURL(e);try{return await new Promise(t=>{let i=new Image;i.onload=()=>t(i),i.onerror=()=>t(void 0),i.src=n})}finally{URL.revokeObjectURL(n)}}async function Rb(e,n){let t=await W1(e);if(!t||!(t.naturalWidth>0)||!(t.naturalHeight>0))return{error:"This browser could not read that picture. Try a PNG or a JPEG."};let i=B1(n.width,n.height),a=document.createElement("canvas"),r=a.getContext("2d");if(!r)return{error:"This browser has no canvas to resize the picture with."};for(let o of G1){let s=V1(t.naturalWidth,t.naturalHeight,Math.max(1,i.width*o),Math.max(1,i.height*o));a.width=s.width,a.height=s.height,r.clearRect(0,0,s.width,s.height),r.drawImage(t,0,0,s.width,s.height);let l=o===1?["png","jpeg"]:["jpeg"];for(let c of l){let d=K1(a.toDataURL(c==="png"?"image/png":"image/jpeg",c==="png"?void 0:z1));if(d!==""&&U1(d))return{data:d,format:c,width:s.width,height:s.height,bytes:Es(d)}}}return{error:`That picture will not fit in ${Pr/1024} KB, even shrunk. Crop it or save it smaller first.`}}var Nl=[["threshold","Threshold line"],["now","Now line"],["zero","Zero line"],["grid","Grid lines"],["dots","Dots"],["times","Clock times"]],Fb=[{label:"Newest",stat:"latest",marker:"latest"},{label:"First",stat:"first",marker:"first"},{label:"Highest",stat:"highest",marker:"highest"},{label:"Lowest",stat:"lowest",marker:"lowest"},{label:"Average",stat:"average"},{label:"Change",stat:"delta"},{label:"Total",stat:"sum"},{label:"Trend",stat:"trend"},{label:"Top of scale",stat:"top"},{label:"Bottom of scale",stat:"bottom"},{label:"Now",marker:"now"}],Ji="color-mix(in srgb, var(--k) 30%, #6b7280)",Pl='system-ui, -apple-system, "Segoe UI", sans-serif',ri=40,_l=6,j1=[22,17,11,16,27,23,35,31];function q1(e={}){let n=(e.values??[]).filter(p=>Number.isFinite(p)),t=n.length>=2,i=t?n:j1,a=Math.min(...i),r=Math.max(...i);t&&e.threshold!==void 0&&Number.isFinite(e.threshold)&&(a=Math.min(a,e.threshold),r=Math.max(r,e.threshold)),r===a&&(r+=1,a-=1);let o=p=>_l+(r-p)/(r-a)*(ri-_l),s=i.length,l=i.map((p,f)=>10+f*100/(s-1)),c=i.map(o),d=p=>Math.min(ri,Math.max(_l,p)),u=t&&e.now!==void 0&&Number.isFinite(e.now)?Math.min(s-1,Math.max(0,Math.round(e.now))):Math.round((s-1)*.6);return{xs:l,ys:c,y:o,real:t,zeroY:d(o(0)),thresholdY:d(o(t&&e.threshold!==void 0?e.threshold:(a+r)/2)),averageY:o(i.reduce((p,f)=>p+f,0)/s),column:{highest:i.indexOf(Math.max(...i)),lowest:i.indexOf(Math.min(...i)),first:0,latest:s-1,now:u}}}function Y1(e){let n=e.xs.map((t,i)=>`${i===0?"M":"L"}${t.toFixed(1)} ${e.ys[i].toFixed(1)}`).join("");return x`
    <path d=${`${n}L${e.xs[e.xs.length-1]} ${ri}L${e.xs[0]} ${ri}Z`} fill=${Ji} opacity=".18" />
    <path d=${n} fill="none" stroke=${Ji} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`}function X1(e){let n=Math.min(10,Math.max(1,100/e.xs.length*.7));return x`${e.xs.map((t,i)=>{let a=Math.min(e.ys[i],ri-1);return x`<rect x=${t-n/2} y=${a} width=${n} height=${ri-a} rx=${Math.min(2,n/2)} fill=${Ji} opacity=".45" />`})}`}function J1(){return x`${[[4,30,.35],[35,18,.7],[54,10,.35],[65,26,.7],[92,24,.35]].map(([n,t,i])=>x`<rect x=${n} y="10" width=${t} height="16" rx="3" fill=${Ji} opacity=${i} />`)}`}function Z1(){return x`
    <rect x="3" y="3" width="114" height="40" rx="5" fill=${Ji} opacity=".22" />
    <circle cx="30" cy="16" r="6" fill=${Ji} opacity=".6" />
    <path d="M3 43L3 36L34 20L56 32L80 16L117 38L117 43Z" fill=${Ji} opacity=".5" />`}function ai(e,n,t=2.6){return x`<circle cx=${e.xs[n]} cy=${e.ys[n]} r=${t} fill="var(--k)" />`}function on(e,n=!1){if(e===void 0||e==="")return"";let t=e.length*5.8+5,i=n?36:13;return x`<rect x="2" y=${i-9.5} width=${t} height="12.5" rx="3" fill="#000" fill-opacity=".7" />
    <text x="4.5" y=${i} font-family=${Pl} font-size="10" font-weight="700" fill="var(--k)">${e}</text>`}function co(e,n=!1){return x`<path d=${`M4 ${e}H116`} stroke="var(--k)" stroke-width="1.4" stroke-dasharray=${n?"4 3":"none"} />`}function Ab(e){return x`<g font-family=${Pl} font-size="6.5" fill="var(--k)">
    <text x="4" y=${e}>9 AM</text><text x="60" y=${e} text-anchor="middle">1 PM</text><text x="116" y=${e} text-anchor="end">5 PM</text>
  </g>`}function Q1(e,n,t){if(e==="timeline:times")return Ab(38);if(e==="image:time")return x`<rect x="70" y="30" width="42" height="10" rx="5" fill="#000" fill-opacity=".55" stroke="var(--k)" stroke-width=".8" />
      <text x="91" y="37.5" text-anchor="middle" font-family=${Pl} font-size="7" fill="var(--k)">3:41:07</text>`;let[i,a]=e.split(":"),r=Math.min(2.2,Math.max(.8,40/n.xs.length));if(i==="draw")switch(a){case"threshold":return co(n.thresholdY,!0);case"now":return x`<path d=${`M${n.xs[n.column.now]} 4V${ri+2}`} stroke="var(--k)" stroke-width="1.4" />`;case"zero":return x`${co(n.zeroY)}<text x="115" y=${Math.max(9,n.zeroY-3)} text-anchor="end" font-family=${Pl} font-size="6.5" fill="var(--k)">0</text>`;case"times":return Ab(45);case"dots":return x`${n.xs.map((c,d)=>ai(n,d,r))}`;case"grid":return x`<path d="M4 10H116M4 20H116M4 30H116M4 40H116" stroke="var(--k)" stroke-width=".8" opacity=".7" />`}if(i==="number"){let c=n.real?t[a]:void 0,{first:d,latest:u}=n.column;switch(a){case"latest":return x`${ai(n,u)}${on(c)}`;case"first":return x`${ai(n,d)}${on(c)}`;case"highest":return x`${ai(n,n.column.highest)}${on(c)}`;case"lowest":return x`${ai(n,n.column.lowest)}${on(c)}`;case"average":return x`${co(n.averageY,!0)}${on(c)}`;case"delta":return x`<path d=${`M${n.xs[d]} ${n.ys[d]}L${n.xs[u]} ${n.ys[u]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />
        ${ai(n,d)}${ai(n,u)}${on(c)}`;case"sum":return x`${n.xs.map((p,f)=>ai(n,f,r))}${on(c)}`;case"trend":return x`<path d=${`M${n.xs[d]} ${n.ys[d]}L${n.xs[u]} ${n.ys[u]}`} stroke="var(--k)" stroke-width="1" stroke-dasharray="2 2" />${on(c)}`;case"top":return x`${co(_l)}${on(c,!0)}`;case"bottom":return x`${co(ri)}${on(c)}`}}let o=n.column[a]??0,s=n.xs[o],l=Math.max(5,n.ys[o]-7);return a==="highest"?x`<path d=${`M${s} ${l-4}L${s+4} ${l+3}L${s-4} ${l+3}Z`} fill="var(--k)" />`:a==="now"?x`<path d=${`M${s-4} ${l-3}L${s+4} ${l-3}L${s} ${l+4}Z`} fill="var(--k)" />`:x`<circle cx=${s} cy=${l} r="3" fill="var(--k)" />`}function xp(e){return e==="timeline:times"?"timeline":e==="image:time"?"image":"chart"}function Mb(e,n,t=!1,i={}){let a=q1(i),r=e==="timeline"?J1():e==="image"?Z1():t?X1(a):Y1(a),o=n!==void 0&&xp(n)===e?Q1(n,a,i.texts??{}):"";return h`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${r}${o}</svg>`}function Lb(e){if(e==="timeline:times")return"Clock times";if(e==="image:time")return"Timestamp";let[n,t]=e.split(":");return n==="draw"?Nl.find(([i])=>i===t)?.[1]??t:n==="number"?`${jt.find(([i])=>i===t)?.[1]??t} number`:`${qt.find(([i])=>i===t)?.[1]??"Reading"} marker`}var eS={"draw:threshold":"A flat line at a value you pick, so a reading over it stands out.","draw:now":"An upright line through the reading that counts as now.","draw:zero":"A flat line where zero falls. It is drawn only when the readings cross zero.","draw:times":"The clock times of the chart's span, spread under the plot.","draw:dots":"A dot on every reading. Line and area charts only.","draw:grid":"Faint rules across the plot, to read heights against.","number:latest":"A text layer printing the newest reading, with the entity's unit after it.","number:first":"A text layer printing the oldest reading in the span.","number:highest":"A text layer printing the highest reading in the span.","number:lowest":"A text layer printing the lowest reading in the span.","number:average":"A text layer printing the average of every reading in the span.","number:delta":"A text layer printing the newest reading minus the first, with the unit after it.","number:sum":"A text layer printing every reading in the span added up, with the unit after it.","number:trend":"A text layer printing the change as an arrow: up, down, or flat when it is too small to print.","number:top":"A text layer printing the value at the top of the plot. On a Fixed scale, this is Max.","number:bottom":"A text layer printing the value at the bottom of the plot. On a Fixed scale, this is Min.","marker:highest":"An icon over the highest reading. It starts as a triangle.","marker:lowest":"An icon over the lowest reading. It starts as a dot.","marker:now":"An icon over the reading that counts as now.","marker:first":"An icon over the oldest reading.","marker:latest":"An icon over the newest reading.","marker:threshold":"An icon at the threshold's height.","marker:zero":"An icon at zero's height.","timeline:times":"The clock times of the timeline's span, spread under the strip.","image:time":"The time the picture was fetched, so a picture that stops updating reads as stale."};function vp(e){return eS[e]}function Ib(e){let n=Mr(e),t=e.fillColorHex!==void 0;if(e.style==="bars"){let i=e.barBorderWidth!==void 0;if(!n)return{main:"Bar colour",...t?{fill:{label:"Fill colour",empty:"Bar colour",note:"Fills every bar in place of Bar colour, even when a state changes the colour. Clear it to fill in Bar colour.",warn:!0}}:{},...i?{border:{label:"Border colour",empty:"White"}}:{}};let a={};return i?(a.fill={label:"Band fill",empty:"Each band's colour",...t?{note:"Every band with no fill of its own fills in this."}:{}},a.border={label:"Band border",empty:"White",note:"Every band with no border of its own uses this."}):t&&(a.fill={label:"Band fill",empty:"Each band's colour",note:"This fill wins over every band's colour. Clear it to fill each bar in its band's colour.",warn:!0}),a}return e.style==="line"?n?{}:{main:"Line colour"}:n?t?{fill:{label:"Fill colour",empty:"Band colours",...e.fillBands?{note:"A fill colour wins over Band fill. Clear it to fill each stretch in its band's colour.",warn:!0}:{}}}:e.fillBands?{}:{main:"Fill colour"}:{main:"Line colour",fill:{label:"Fill colour",empty:"Line colour"}}}function tS(e){switch(e){case"light":return x`<path d="M9.2 15.5A5.5 5.5 0 1 1 14.8 15.5C13.8 16.6 13.6 17.4 13.5 19H10.5C10.4 17.4 10.2 16.6 9.2 15.5Z" /><path d="M10.5 21.5H13.5" />`;case"switch":case"input_boolean":return x`<rect x="3" y="7.5" width="18" height="9" rx="4.5" /><circle cx="16.5" cy="12" r="2.6" />`;case"sensor":return x`<path d="M12 14.5V4.5" /><circle cx="12" cy="17.5" r="3.2" /><path d="M14.5 6.5H12M14.5 9.5H12" />`;case"binary_sensor":return x`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" />`;case"climate":case"water_heater":return x`<path d="M10 13.8V5.5a2 2 0 0 1 4 0V13.8" /><circle cx="12" cy="17" r="3.6" /><path d="M16.5 7H19M16.5 10.5H19" />`;case"humidifier":return x`<path d="M12 3.5S6.5 10.5 6.5 14.5A5.5 5.5 0 0 0 17.5 14.5C17.5 10.5 12 3.5 12 3.5Z" />`;case"media_player":return x`<rect x="2.8" y="4.5" width="18.4" height="12" rx="2.5" /><path d="M8 20H16" /><path d="M10.6 9.2L14.4 10.6L10.6 12Z" />`;case"camera":return x`<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5H9L10.5 4.5H13.5L15 6.5H18.5A2 2 0 0 1 20.5 8.5V17A2 2 0 0 1 18.5 19H5.5A2 2 0 0 1 3.5 17Z" /><circle cx="12" cy="12.5" r="3.5" />`;case"cover":return x`<rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M3.5 8.5H20.5M3.5 13H20.5M3.5 17.5H20.5" />`;case"lock":return x`<rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0V10.5" />`;case"fan":return x`<circle cx="12" cy="12" r="2" /><path d="M12 10C12 6 9 3.5 7 5.5S8.5 10 12 10Z" /><path d="M14 12C18 12 20.5 9 18.5 7S14 8.5 14 12Z" /><path d="M12 14C12 18 15 20.5 17 18.5S15.5 14 12 14Z" /><path d="M10 12C6 12 3.5 15 5.5 17S10 15.5 10 12Z" />`;case"script":case"automation":return x`<path d="M5 5.5H19M5 10H19M5 14.5H14M5 19H11" />`;case"scene":return x`<path d="M12 3.5L14.2 8.6L19.7 9.2L15.6 12.9L16.8 18.3L12 15.5L7.2 18.3L8.4 12.9L4.3 9.2L9.8 8.6Z" />`;case"person":case"device_tracker":return x`<circle cx="12" cy="8" r="3.6" /><path d="M5 20.5a7 7 0 0 1 14 0" />`;case"vacuum":case"lawn_mower":return x`<circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 3.5V8.5" />`;case"weather":return x`<circle cx="9" cy="9" r="3.2" /><path d="M8.5 19.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 10 1.2 3.4 3.4 0 0 1-.4 6.8Z" />`;case"sun":return x`<circle cx="12" cy="12" r="4.2" /><path d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4" />`;case"input_number":case"number":return x`<path d="M8 4.5L6 19.5M18 4.5L16 19.5M4.5 9H19.5M4 15H19" />`;case"input_select":case"select":return x`<rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="M14 10.5L16.2 13L18.4 10.5" />`;case"input_text":case"text":return x`<path d="M5 6H19M12 6V19M9 19H15" />`;case"button":case"input_button":return x`<circle cx="12" cy="12" r="8.5" /><path d="M12 8.5V15.5M8.5 12H15.5" />`;case"alarm_control_panel":return x`<path d="M12 3.5L19.5 6.5V12C19.5 16.5 16.3 19.6 12 20.8C7.7 19.6 4.5 16.5 4.5 12V6.5Z" /><path d="M9.5 12L11.3 14L14.8 10.2" />`;case"update":return x`<path d="M12 4.5V14.5" /><path d="M8.2 10.8L12 14.6L15.8 10.8" /><path d="M5 18.5H19" />`;case"todo":return x`<rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 12L10.6 14.5L16 9" />`;case"calendar":return x`<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M3.5 10H20.5M8 3.5V7.5M16 3.5V7.5" />`;case"timer":case"counter":return x`<circle cx="12" cy="13.5" r="7.5" /><path d="M12 9.5V13.5L14.6 15.4" /><path d="M9.5 2.8H14.5" />`;case"zone":return x`<path d="M12 21S5 15.4 5 10.2A7 7 0 0 1 19 10.2C19 15.4 12 21 12 21Z" /><circle cx="12" cy="10" r="2.6" />`;case"remote":return x`<rect x="7" y="2.8" width="10" height="18.4" rx="3" /><circle cx="12" cy="8" r="1.5" /><path d="M9.6 12.5H14.4M9.6 16H14.4" />`;case"siren":return x`<path d="M5 18.5a7 7 0 0 1 14 0Z" /><path d="M3.5 18.5H20.5M12 4V7M5.5 6.5L7.4 8.4M18.5 6.5L16.6 8.4" />`;case"valve":return x`<path d="M4 8L12 12L4 16Z" /><path d="M20 8L12 12L20 16Z" /><path d="M12 12V4M9 4H15" />`;case"image":case"image_processing":return x`<rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 15.5L15.5 11L7 19" />`;case"event":return x`<circle cx="12" cy="12" r="2.4" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" /><path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />`;case"group":return x`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" />`;default:return x`<circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" />`}}function Wa(e){return h`<svg class="dom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${tS(e)}</svg>`}var nS={binary_sensor:"Binary sensor",input_boolean:"Toggle helper",input_number:"Number helper",input_select:"Dropdown helper",input_text:"Text helper",input_button:"Button helper",input_datetime:"Date helper",alarm_control_panel:"Alarm panel",device_tracker:"Device tracker",media_player:"Media player",water_heater:"Water heater",lawn_mower:"Lawn mower",image_processing:"Image processing",persistent_notification:"Notification",remote:"Remote",sun:"Sun",todo:"To-do list"};function Hb(e){let n=nS[e];if(n!==void 0)return n;if(e==="")return"";let t=e.replace(/_/g," ");return t.charAt(0).toUpperCase()+t.slice(1)}var iS=new Set(["on","open","opening","closing","home","playing","heat","cool","heat_cool","auto","dry","fan_only","cleaning","returning","active","running","recording","streaming","triggered","armed_home","armed_away","armed_night","armed_vacation","unlocked"]);function wp(e){return iS.has(e.trim().toLowerCase())}function aS(e,n,t){let i=Os({frame:{...e.frame},isHidden:!1},e.family,n,t).frame;return tl(i,{})}var Np=["content","look","numbers","row","level","timestamp","tappable","states","placement","corner","placements","shape","symbol"];function ze(e){return n=>e(n.target.value)}function sn(e,n){let t=n===void 0?Bu(e.watchAppVersion):Bu(e.watchAppVersion,n);return t===void 0?m:h`<div class="hint keep">${t}</div>`}function Co(e){if(e===void 0||e.atDefault)return m;let n=`Changed. Click to reset. ${e.title.replace(/\.$/,"")}.`;return h`<button type="button" class="reset-dot" title=${n} aria-label=${n}
    @pointerdown=${t=>t.stopPropagation()}
    @click=${t=>{t.preventDefault(),t.stopPropagation(),e.reset()}}></button>`}function Be(e,n,t){let i=Co(n),a=[i===m?"":"changed",t?"scrub":""].filter(r=>r!=="").join(" ");return h`<span class=${a===""?m:a} title=${t?"Drag left or right to change":m}
    @pointerdown=${t??m}>${e}${i}</span>`}var nd="wa-scrub-start",id="wa-scrub-end",rS=3,oS=3;function sS(e,n){return e!==void 0&&Number.isFinite(e)?e:Math.max(0,n.min??0)}function lS(e,n,t={}){let i=n!==void 0&&n>0?n:10**-Math.min(2,Ap(e));return t.coarse?i*10:t.fine?i/10:i}function dS(e,n,t,i){let a=e+Math.round((n-e)/t)*t;return i.min!==void 0&&(a=Math.max(i.min,a)),i.max!==void 0&&(a=Math.min(i.max,a)),Number(a.toFixed(Math.min(10,Math.max(Ap(t),Ap(e)))))}function Ap(e){if(!Number.isFinite(e)||Number.isInteger(e))return 0;let n=String(e),t=/e-(\d+)$/.exec(n);return t?Number(t[1])+(n.split("e")[0].split(".")[1]??"").length:(n.split(".")[1]??"").length}function ux(e,n,t,i,a,r){let o=sS(t,a),s=n.clientX,l=s,c=o,d=o,u=!1,p=g=>{if(!u){if(Math.abs(g.clientX-s)<rS)return;u=!0,l=g.clientX,e.classList.add("scrubbing"),e.dispatchEvent(new CustomEvent(nd,{bubbles:!0,composed:!0}))}let b=lS(o,a.step,{coarse:g.shiftKey,fine:g.altKey});c+=(g.clientX-l)/oS*b,l=g.clientX,a.min!==void 0&&(c=Math.max(a.min,c)),a.max!==void 0&&(c=Math.min(a.max,c));let y=dS(o,c,b,a);y!==d&&(d=y,i(y))},f=g=>{if(e.removeEventListener("pointermove",p),e.removeEventListener("pointerup",f),e.removeEventListener("pointercancel",f),u){e.classList.remove("scrubbing"),e.dispatchEvent(new CustomEvent(id,{bubbles:!0,composed:!0}));let b=y=>{y.preventDefault(),y.stopPropagation()};e.addEventListener("click",b,{capture:!0,once:!0}),setTimeout(()=>e.removeEventListener("click",b,{capture:!0}),0)}r(u,g)};e.setPointerCapture(n.pointerId),e.addEventListener("pointermove",p),e.addEventListener("pointerup",f),e.addEventListener("pointercancel",f)}function ad(e,n,t){return i=>{if(i.button!==0||!i.isPrimary)return;let a=i.currentTarget;a.closest(".field")?.querySelector("input[type=number]")?.disabled||(i.preventDefault(),ux(a,i,e,n,t,()=>{}))}}function So(e,n,t){return i=>{let a=i.currentTarget;i.button!==0||!i.isPrimary||a.disabled||a.matches(":focus")||(i.preventDefault(),ux(a,i,e,n,t,(r,o)=>{r||o.type!=="pointerup"||(a.focus(),a.select())}))}}function si(e,n,t,i=a=>String(a)){if(n===void 0)return;let a=n;return{atDefault:e===a,title:`Back to ${i(a)}`,reset:()=>t(a)}}function _e(e,n,t,i={}){return h`<label class="field">${Be(e,si(n,i.def,t,a=>a===""?"empty":a))}
    <input type="text" .value=${n} placeholder=${i.placeholder??""} list=${i.list??m}
      class=${i.mono?"mono":""} @input=${ze(t)} /></label>`}function Dp(e,n,t,i=3){return h`<label class="field"><span>${e}</span>
    <textarea rows=${i} .value=${n} class="mono" @input=${ze(t)}></textarea></label>`}function re(e,n,t,i={}){let a=i.def===null?{atDefault:n===void 0,title:"Back to none",reset:()=>t(void 0)}:si(n,i.def,t);return h`<label class="field num">${Be(e,a,ad(n,t,i))}${To(n,t,i)}</label>`}function To(e,n,t){let i=e===void 0||Number.isNaN(e)?"":String(e),a=h`<input type="number" .value=${i} step=${t.step??"any"} min=${t.min??m} max=${t.max??m}
      aria-label=${t.ariaLabel??m} placeholder=${t.placeholder??m}
      data-scrub @pointerdown=${So(e,n,t)}
      @input=${ze(r=>{if(r.trim()===""){t.optional&&n(void 0);return}let o=Number(r);Number.isNaN(o)||n(o)})} />`;return t.unit===void 0&&t.lead===void 0?a:h`<span class=${t.lead===void 0?"num-box":"num-box lead"} style=${`--wa-unit:${t.unit?.length??0}`}>${t.lead===void 0?m:h`<span class="lead" aria-hidden="true">${t.lead}</span>`}${a}${t.unit===void 0?m:h`<span class="unit" aria-hidden="true">${t.unit}</span>`}</span>`}function Fe(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<label class="field">${Be(e,si(n,a.def,i,r))}
    <select @change=${ze(o=>i(o))}>
      ${t.map(([o,s])=>h`<option value=${o} ?selected=${o===n}>${s}</option>`)}
    </select></label>`}function ae(e,n,t,i,a={}){let r=o=>t.find(([s])=>s===o)?.[1]??o;return h`<div class="field seg-field">${Be(e,si(n,a.def,o=>i(o,null),r))}
    ${ea(e,n,t,i,a)}</div>`}function ea(e,n,t,i,a={}){return h`<div class="seg wide" role="radiogroup" aria-label=${e}>
      ${t.map(([r,o])=>{let s=n===void 0&&r===a.inherited,l=s?`${a.titles?.[r]??o} (from the layer)`:a.titles?.[r];return h`<button type="button" role="radio" aria-checked=${r===n?"true":"false"}
        class=${r===n?"on":s?"inh":""} title=${l??m} ?disabled=${a.disabled?.[r]===!0}
        @click=${c=>{r!==n&&i(r,c.currentTarget)}}>${o}</button>`})}
    </div>`}function Fp(e,n){let t=i=>si(i.value,i.def,i.set,a=>i.options.find(([r])=>r===a)?.[1]??a);return h`<div class="field seg-field pair">${Be(e.label,t(e))}
    <div class="pair-row">
      ${ea(e.label,e.value,e.options,e.set,e)}
      ${Be(n.label,t(n))}
      ${ea(n.label,n.value,n.options,n.set,n)}
    </div></div>`}function ln(e,n,t,i){let a=i.format??(o=>String(Math.round(o*100)/100)),r=o=>{o!==void 0&&o>=i.min&&o<=i.max&&t(o)};return h`<div class="field slider num">${Be(e,si(n,i.def,t,a),ad(n,t,i))}
    <div class="slider-row">
      ${i.range===!1?m:h`<input type="range" min=${i.min} max=${i.max} step=${i.step} .value=${String(n)} aria-label=${e}
        @input=${ze(o=>{let s=Number(o);Number.isNaN(s)||t(s)})} />`}
      ${To(n,r,{step:i.step,min:i.min,max:i.max,ariaLabel:e,...i.unit===void 0?{}:{unit:i.unit}})}
    </div></div>`}function xe(e,n,t,i,a={}){return h`<label class="field check">${Be(e,si(n,i,t,r=>r?"on":"off"))}<input type="checkbox" .checked=${n} ?disabled=${a.disabled===!0} @change=${r=>t(r.target.checked)} /></label>`}function Ce(e,n,t,i=!1,a){let{rgb:r,alpha:o}=Op(n),s=a===void 0?void 0:{atDefault:Gp(n,a??void 0),title:a===null?"Back to none":`Back to ${a}`,reset:()=>t(a??void 0)},l=i&&n===void 0;return h`<div class="field color">${Be(e,s)}
    <div class="color-row">
      ${i?h`<input type="checkbox" title="Enabled" aria-label=${`${e} on`} .checked=${n!==void 0} @change=${c=>t(c.target.checked?Yl(r,o):void 0)} />`:m}
      ${Eo(e,n,t,l)}
    </div></div>`}function cS(e){let n=[...e.stops].sort((t,i)=>t.at-i.at).map(t=>`${t.colorHex} ${Math.round(Math.max(0,Math.min(1,t.at))*100)}%`).join(", ");return e.kind==="radial"?`radial-gradient(circle at 50% 50%, ${n})`:`linear-gradient(90deg, ${n})`}function mo(e){return{...e,stops:[...e.stops].sort((n,t)=>n.at-t.at)}}function ql(e,n,t,i){let a=n!==void 0,r=n,o=h`<div class="field color">${Be(e,{atDefault:!a,title:"Back to one flat colour",reset:()=>t(void 0)})}
    <div class="color-row">
      <input type="checkbox" title="Enabled" aria-label=${`${e} on`} .checked=${a}
        @change=${c=>t(c.target.checked?mo(i()):void 0)} />
      ${r===void 0?h`<span class="hint">One flat colour</span>`:h`<span class="fill-bar" style=${`--g:${cS(r)}`} title="Drag a chip to move that colour">
            ${r.stops.map((c,d)=>h`<span class="fill-chip" style=${`left:${Math.round(Math.max(0,Math.min(1,c.at))*100)}%;--sw:${c.colorHex}`}
              @pointerdown=${uS(r,d,t)}></span>`)}
          </span>`}
    </div></div>`;if(r===void 0)return o;let s=r.stops,l=c=>t(mo({...r,stops:c}));return h`${o}
    <div class="grid2">
      ${ae("Gradient",r.kind,gf,c=>{let d={...r,kind:c};c==="radial"&&delete d.angle,t(mo(d))},{def:"linear"})}
      ${r.kind==="linear"?re("Angle",r.angle??0,c=>{let d={...r},u=c??0;u===0?delete d.angle:d.angle=u,t(mo(d))},{step:5,def:0,unit:"\xB0"}):m}
    </div>
    ${s.map((c,d)=>h`<div class="field color band-row">
      <span class="fill-stop-n">${d+1}</span>
      <div class="color-row">
        ${Eo(`Stop ${d+1}`,c.colorHex,u=>l(s.map((p,f)=>f===d?{...p,colorHex:u??"#FFFFFF"}:p)))}
        ${To(Math.round(c.at*100),u=>l(s.map((p,f)=>f===d?{...p,at:Math.max(0,Math.min(1,(u??0)/100))}:p)),{step:1,min:0,max:100,unit:"%",ariaLabel:`Stop ${d+1} position`})}
        <button class="small" title="Remove this colour" ?disabled=${s.length<=Yd}
          @click=${()=>l(s.filter((u,p)=>p!==d))}>−</button>
      </div></div>`)}
    ${s.length<ss?h`<button class="small" @click=${()=>{let c=[...s].sort((p,f)=>p.at-f.at),d=.5,u=-1;for(let p=1;p<c.length;p++){let f=c[p].at-c[p-1].at;f>u&&(u=f,d=(c[p].at+c[p-1].at)/2)}l([...s,{at:d,colorHex:Yt(r,d)}])}}>Add a colour</button>`:h`<div class="hint">A gradient takes at most ${ss} colours.</div>`}`}function uS(e,n,t){return i=>{let a=i.currentTarget,r=a.parentElement;if(!r)return;i.preventDefault(),a.setPointerCapture(i.pointerId);let o=e,s=c=>{let d=r.getBoundingClientRect();if(d.width<=0)return;let u=Math.max(0,Math.min(1,(c.clientX-d.left)/d.width));o={...e,stops:e.stops.map((p,f)=>f===n?{...p,at:u}:p)},t(o)},l=()=>{a.removeEventListener("pointermove",s),a.removeEventListener("pointerup",l),a.removeEventListener("pointercancel",l),t(mo(o))};a.addEventListener("pointermove",s),a.addEventListener("pointerup",l),a.addEventListener("pointercancel",l)}}function Op(e){let n=(e??"").replace(/^#/,""),t=/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(n);return{valid:t,swatch:t?`#${n}`:"transparent",rgb:t?`#${n.slice(0,6)}`:"#ffffff",alpha:t&&n.length===8?Math.round(parseInt(n.slice(6,8),16)/255*100):100}}function Yl(e,n){let t=e.replace(/^#/,"").toUpperCase();return n>=100?`#${t}`:`#${t}${Math.round(n/100*255).toString(16).padStart(2,"0").toUpperCase()}`}function Eo(e,n,t,i=!1,a="#RRGGBB"){let{valid:r,swatch:o,rgb:s,alpha:l}=Op(n);return h`<span class="color-box">
      <span class="color-swatch" style=${`--sw:${i||!r?"transparent":o}`} title="Pick a colour">
        <input type="color" .value=${s} ?disabled=${i} aria-label=${`${e}: pick a colour`} @input=${ze(c=>t(Yl(c,l)))} />
      </span>
      <input type="text" class="mono hex" .value=${n??""} placeholder=${a} spellcheck="false" aria-label=${`${e}: hex`} ?disabled=${i}
        @input=${ze(c=>{let d=c.trim();/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(d)&&t(d.startsWith("#")?d.toUpperCase():`#${d.toUpperCase()}`)})} />
      <span class="num-box alpha" style="--wa-unit:1">
        <input type="number" min="0" max="100" step="1" .value=${String(l)} title="Opacity" aria-label=${`${e}: opacity`} ?disabled=${i}
          data-scrub @pointerdown=${So(l,c=>t(Yl(s,c)),{step:1,min:0,max:100})}
          @input=${ze(c=>{let d=Number(c);c.trim()!==""&&d>=0&&d<=100&&t(Yl(s,Math.round(d)))})} />
        <span class="unit" aria-hidden="true">%</span>
      </span>
    </span>`}function zp(e,n,t,i){let a={atDefault:n===void 0,title:`Back to ${t.toLowerCase()}`,reset:()=>i(void 0)};return h`<div class="field color">${Be(e,a)}
    <div class="color-row">${Eo(e,n,i,!1,t)}</div></div>`}function kp(e,n,t){return h`${zp(e.label,n,e.empty,t)}${e.note===void 0?m:h`<div class=${e.warn?"hint warn":"hint"}>${e.note}</div>`}`}function Gp(e,n){return e===void 0||n===void 0?e===n:e.replace(/^#/,"").toUpperCase()===n.replace(/^#/,"").toUpperCase()}function na(e,n){let t=e[n],i=t&&typeof t.attributes.friendly_name=="string"?t.attributes.friendly_name:n;return{entityId:n,displayName:i,domain:n.split(".")[0]??""}}function pS(e,n,t){let i=n===void 0?void 0:typeof n=="string"?[n]:n,a=[];for(let[r,o]of Object.entries(e)){let s=r.split(".")[0]??"";if(i!==void 0&&!i.includes(s))continue;let l=typeof o?.attributes?.friendly_name=="string"?o.attributes.friendly_name.trim():"",c=t?.(r);a.push({entityId:r,name:l||r,state:o?.state??"",domain:s,...c?{area:c}:{}})}return a.sort((r,o)=>r.name.localeCompare(o.name)||r.entityId.localeCompare(o.entityId)),a}function hS(e){let{entities:n,devices:t,areas:i}=e;if(!n||!i)return;let a=r=>{if(!r)return;let o=i[r]?.name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0};return r=>{let o=n[r];if(o)return a(o.area_id)??a(o.device_id?t?.[o.device_id]?.area_id:void 0)}}var px=50;function fS(e){let n=e.state.trim().split(/\s+/)[0]??"";return n!==""&&Number.isFinite(Number(n))}function mS(e,n,t=px,i){let a=n.trim().toLowerCase(),r=l=>i===void 0||i(l)?0:1;if(a==="")return(i===void 0?e.slice():[...e].sort((l,c)=>r(l)-r(c))).slice(0,t);let o=a.split(/\s+/),s=[];for(let l of e){let c=l.entityId.toLowerCase(),d=l.name.toLowerCase(),u=(l.area??"").toLowerCase(),p=-1;c===a?p=0:c.startsWith(a)?p=1:d.startsWith(a)?p=2:c.includes(a)?p=3:d.includes(a)?p=4:o.length>1&&o.every(f=>c.includes(f)||d.includes(f))?p=5:u!==""&&(u.includes(a)||o.length>1&&o.every(f=>c.includes(f)||d.includes(f)||u.includes(f)))&&(p=6),p>=0&&s.push({c:l,rank:p})}return s.sort((l,c)=>l.rank-c.rank||r(l.c)-r(c.c)||l.c.name.localeCompare(c.c.name)||l.c.entityId.localeCompare(c.c.entityId)),s.slice(0,t).map(l=>l.c)}var gS=/^[a-z0-9_]+\.[a-z0-9_]+$/i;function hx(e){return gS.test(e.trim())}function yS(e,n,t){let i=e.trim();if(!(i===n.entityId||i==="")){if(i in t)return na(t,i);if(hx(i))return{...n,entityId:i,domain:i.split(".")[0]??""}}}var Qi=new Map;function Le(e){let n=e instanceof Node?e:null;for(let t=0;n&&t<8;t+=1){let i=n.getRootNode();if(!(i instanceof ShadowRoot))return;let a=i.host;if(typeof a.requestUpdate=="function"){a.requestUpdate();return}n=a}}function Bp(e){return Qi.has(e)}function st(e,n,t,i,a,r={}){let o=e.hass.states,s=Qi.get(a),l=s?mS(pS(o,r.domain,hS(e.hass)),s.query,px,r.preferNumeric?fS:void 0):[],c=s?Math.max(0,Math.min(s.index,l.length-1)):0,d=t.entityId?o[t.entityId]:void 0,u=(C,M,K=0)=>{Qi.set(a,{query:M,index:K}),Le(C)},p=C=>{Qi.delete(a),Le(C)},f=C=>{let M=yS(C,t,o);M&&i(M)},g=(C,M)=>{i(na(o,C.entityId)),p(M)},b=()=>Math.max(0,Math.min(Qi.get(a)?.index??0,l.length-1)),y=C=>{let M=C.target;if(C.key==="ArrowDown"||C.key==="ArrowUp"){C.preventDefault();let K=Qi.get(a);if(!K){u(M,M.value);return}let Y=C.key==="ArrowDown"?b()+1:b()-1;u(M,K.query,Math.max(0,Math.min(l.length-1,Y))),bS(M);return}if(C.key==="Enter"){C.preventDefault();let K=l[b()];s&&K?g(K,M):(f(M.value),p(M));return}if(C.key==="Escape"){if(!s)return;C.preventDefault(),C.stopPropagation(),p(M)}},v=t.entityId===""?h`<div class="hint">Type part of a name, a room, or an id.</div>`:d?m:h`<div class="hint warn">Not in Home Assistant right now.</div>`,k=C=>requestAnimationFrame(()=>C?.querySelector(".ent-box input")?.focus()),S=C=>{let M=C.currentTarget.closest(".entity-field");u(M,""),k(M)},I=r.clearable??!0,_=d&&typeof d.attributes.friendly_name=="string"?d.attributes.friendly_name:t.displayName||t.entityId,E=h`<div class="ent-chosen">
      <button type="button" class="ent-pick" title=${`${_}
${t.entityId}
Click to change`} @click=${S}>
        <span class="ent-ico ${d&&wp(d.state)?"on":""}">${Wa(t.domain||t.entityId.split(".")[0]||"")}</span>
        <span class="ent-name">${_}</span>
        ${_===t.entityId?m:h`<span class="ent-id mono">${t.entityId}</span>`}
        ${d?h`<span class="ent-state">${d.state}</span>`:m}
      </button>
      ${I?h`<button type="button" class="ent-clear" title="Remove entity" aria-label="Remove entity"
        @click=${C=>{let M=C.currentTarget.closest(".entity-field");i({entityId:"",displayName:"",domain:""}),Le(M)}}>${H("close")}</button>`:m}
    </div>`,z=h`<div class="ent-box ${s?"open":""} ${r.needed&&t.entityId===""?"needs":""}">
      <span class="ent-glass">${H("search")}</span>
      <input type="text" class="mono" role="combobox" aria-autocomplete="list" aria-expanded=${s?"true":"false"} autocomplete="off" spellcheck="false"
        .value=${s?s.query:""}
        placeholder=${t.entityId||"Search by name, room, or id"}
        @focus=${C=>{let M=C.target;u(M,Qi.get(a)?.query??"")}}
        @input=${C=>{let M=C.target;u(M,M.value)}}
        @keydown=${y}
        @blur=${C=>{let M=C.target;s&&f(M.value),p(M)}} />
    </div>`;return h`<div class="field entity-field">
    <span>${n}</span>
    <div class="ent-anchor">
    ${!s&&t.entityId!==""?E:z}
    ${s?h`<div class="entity-results" role="listbox">
          ${l.length===0?h`<div class="hint keep" style="padding:6px 8px">${hx(s.query)?"Nothing here has that id. Press Enter to use it anyway.":"Nothing matches that search."}</div>`:l.map((C,M)=>h`<button type="button" role="option" aria-selected=${M===c?"true":"false"} class="ent ${M===c?"hl":""}"
                @mousedown=${K=>K.preventDefault()} @click=${K=>g(C,K.target)}>
                <span class="ent-ico ${wp(C.state)?"on":""}">${Wa(C.domain)}</span>
                <span class="ent-main">
                  <span class="ent-name">${C.name}</span>
                  <span class="ent-sub">
                    ${C.area?h`<span class="ent-area">${C.area}</span>`:m}
                    <span class="ent-id mono">${C.entityId}</span>
                  </span>
                </span>
                <span class="ent-right">
                  <span class="ent-type">${Hb(C.domain)}</span>
                  <span class="ent-state">${C.state}</span>
                </span>
              </button>`)}
        </div>`:m}
    </div>
    ${s?m:v}
  </div>`}function bS(e){requestAnimationFrame(()=>{e.closest(".entity-field")?.querySelector("button.ent.hl")?.scrollIntoView({block:"nearest"})})}var _b=120;function xS(e,n,t,i){let a=r=>i.size===0?[...r]:r.filter(o=>i.has(o));return e!==""?{names:a(Cl.find(r=>r.name===e)?.symbols??[]),fromPack:!1}:n.trim()!==""&&t.length>0?{names:[...t],fromPack:!0}:{names:a(Sl),fromPack:!1}}function Pb(e,n){return n.size===0?e.length:e.filter(t=>n.has(t)).length}function vS(e){return[{value:"",label:`Starter set (${Pb(Sl,e)})`},...Cl.map(n=>({value:n.name,label:`${n.name} (${Pb(n.symbols,e)})`}))]}function wS(e){return e.length>0?e.length:Sl.length}function Nb(e,n,t,i){return t?n>e?`Showing ${e} of ${n}. Type more to narrow it down.`:n===1?"1 symbol matches.":`${n} symbols match.`:i===1?"1 symbol available.":`${i} symbols available.`}function Dl(e,n,t,i){let a=e.icons.render(n,22,"#FFFFFF");return h`<button type="button" class="sym ${t?"on":""}" title=${n} @click=${()=>i(n)}>
    <span class="sym-glyph">${a??h`<span class="sym-none">?</span>`}</span>
    <span class="sym-name">${n}</span>
  </button>`}function Jl(e,n,t,i,a,r="Symbol",o=!0){let s=e.symbols,l=s.isOpen(i,o),c=s.query(i),d=e.icons.names(),u=d??[],p=new Set(u),f=n.trim(),g=f.startsWith(dt),b=a!==void 0,y=b?s.pack(i)??(g?"mdi":"sf"):"sf",v=CS(f,p),k=_=>{t(_),a?.(_.startsWith(dt)?e.icons.mdiPath?.(_):void 0),s.noteUsed(_)},S=_=>{if(t(_),!b)return;let E=_.trim();a?.(E.startsWith(dt)?e.icons.mdiPath?.(E):void 0)},I=m;if(l&&y==="mdi"){let _=e.icons.mdiNames?.(),E=SS(_??[],c),z=E.slice(0,_b),C=s.recent.filter(M=>M.startsWith(dt));I=h`<div class="sym-browse">
      ${Db(s,i,y)}
      <div class="sym-controls">
        <input type="search" placeholder="Search Material Design icons" .value=${c} @input=${ze(M=>s.setQuery(i,M))} />
      </div>
      ${C.length===0?m:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${C.map(M=>Dl(e,M,M===f,k))}</div>`}
      <div class="sym-grid">${z.map(M=>Dl(e,M,M===f,k))}</div>
      ${_===void 0?h`<div class="hint keep">Loading the Material Design catalogue.</div>`:E.length===0?h`<div class="hint keep">Nothing matches that search. Any<code>mdi:</code> name can still be typed above.</div>`:h`<div class="hint keep">${Nb(z.length,E.length,!0,_.length)}</div>`}
      ${_!==void 0&&g&&!_.includes(f)?h`<div class="hint warn">There is no <code>${f}</code> in this build's Material Design set, so the watch draws a question mark.</div>`:m}
    </div>`}else if(l){let _=s.category(i),E=xS(_,c,u,p),z=Xu(E.names,c),C=E.fromPack?z.slice(0,_b):z,M=s.recent.filter(Y=>!Y.startsWith(dt)),K=p.size===0?M:M.filter(Y=>p.has(Y));I=h`<div class="sym-browse">
      ${b?Db(s,i,y):m}
      <div class="sym-controls">
        <input type="search" placeholder="Search symbols" .value=${c} @input=${ze(Y=>s.setQuery(i,Y))} />
        <select @change=${ze(Y=>s.setCategory(i,Y))}>
          ${vS(p).map(Y=>h`<option value=${Y.value} ?selected=${Y.value===_}>${Y.label}</option>`)}
        </select>
      </div>
      ${K.length===0?m:h`<div class="hint keep">Recent</div>
        <div class="sym-grid one-row">${K.map(Y=>Dl(e,Y,Y===f,k))}</div>`}
      <div class="sym-grid">${C.map(Y=>Dl(e,Y,Y===f,k))}</div>
      ${z.length===0?h`<div class="hint keep">Nothing matches that search. Anyname can still be typed above.</div>`:h`<div class="hint keep">
            ${Nb(C.length,z.length,c.trim()!=="",wS(u))}
          </div>`}
      ${e.icons.available()?d!==void 0&&d.length===0?h`<div class="hint keep">The icon pack does not list its symbols, so search covers the built-in set only. Any other name can still be typed above.</div>`:m:h`<div class="hint warn">No icon pack is installed, so the list shows names without pictures. Install the Cupertino Icons frontend to see them.</div>`}
    </div>`}return h`
    <label class="field"><span>${r}</span>
      <input type="text" class="mono" .value=${n} placeholder="lightbulb.fill"
        @input=${ze(S)} @change=${ze(_=>{let E=_.trim();E.startsWith(dt)?e.icons.mdiPath?.(E)!==void 0&&s.noteUsed(_):(p.size===0||p.has(E))&&s.noteUsed(_)})} /></label>
    ${v?h`<div class="hint warn">The installed icon pack has no <code>${f}</code>, so the preview shows a placeholder. The watch still draws it if the name is a real SF Symbol.</div>`:m}
    <button type="button" class="link" @click=${()=>s.toggle(i,o)}>${l?"Hide symbols":"Browse symbols"}</button>
    ${I}`}var Ol=new Map;function kS(e,n){if(n==="svg"){e.symbol=U(Rr);return}e.symbol=U("lightbulb"),delete e.path,delete e.viewBox}function fx(e,n){let t=Ol.get(e.id),i=new TextEncoder().encode(e.path??"").length,a=(r,o)=>{if(r.trim()===""){Ol.delete(e.id),n(c=>{delete c.path,delete c.viewBox},"svg-path");return}let s=kf(r);if(!s.ok){Ol.set(e.id,{text:s.error,warn:!0}),Le(o);return}let l=s.viewBox;Ol.set(e.id,{text:l===void 0?"Path taken. It draws in the standard 24 by 24 box.":`Path taken, in the box ${l} the markup names.`,warn:!1}),n(c=>{c.path=s.path,l===void 0?delete c.viewBox:c.viewBox=l},"svg-path")};return h`
    <label class="field"><span>SVG</span>
      <textarea rows="4" class="mono" .value=${e.path??""}
        placeholder="M7 2v11h3v9l7-12h-4l4-8z  or a whole <svg …> tag"
        @input=${r=>a(r.target.value,r.target)}></textarea></label>
    ${t?h`<div class="hint ${t.warn?"warn":"keep"}">${t.text}</div>`:m}
    ${e.path===void 0||e.path===""?h`<div class="hint keep">Paste an SVG path's <code>d</code>, or the whole <code>&lt;svg&gt;</code> markup and the paths in it are taken. The drawing takes the layer's colour, so a flat single-colour shape is what reads on a watch face.</div>`:h`<div class="field readout"><span>Size</span><span class="readout-v">${i} bytes${e.viewBox===void 0?"":` \xB7 ${e.viewBox}`}</span></div>`}
    <div class="hint">Only <code>&lt;path&gt;</code> elements are drawn: a circle, a rectangle or a group transform in the markup is ignored. Convert those to paths in a vector editor first.</div>`}var zl=new Map;function mx(e,n){if(e.source=n,n==="inline"){e.entity={entityId:"",displayName:"",domain:""};return}delete e.data,delete e.format}function $S(e,n,t,i){let a=zl.get(n.id),r=_i(n),o=async s=>{let l=s.target,c=l.files?.[0];if(l.value="",!c)return;let d=ge[t==="inline"?"rectangular":t],u=Ge(e.config,t,{kind:"image",payload:n}),p=await Rb(c,{width:u.frame.width*d.width,height:u.frame.height*d.height});if("error"in p){zl.set(n.id,{text:p.error,warn:!0}),Le(l);return}zl.set(n.id,{text:`${c.name} is in the complication at ${p.width} by ${p.height} pixels, ${Hl(p.bytes)}.`,warn:!1}),i(f=>{f.data=p.data,p.format==="jpeg"?f.format="jpeg":delete f.format},"inline-image")};return h`
    <div class="field list-field"><span>Picture</span>
      <div class="adders">
        <label class="small" title="Choose a picture from this device">
          ${H("plus")}<span>${r>0?"Replace":"Upload"}</span>
          <input type="file" accept=${Eb} style="display:none" @change=${o} />
        </label>
        ${r>0?h`<button type="button" class="small" title="Take the picture out of this complication"
              @click=${()=>{zl.delete(n.id),i(s=>{delete s.data,delete s.format},"inline-image")}}>Remove</button>`:m}
        ${r>0?h`<span class="readout-v">${Hl(r)}</span>`:m}
      </div>
    </div>
    ${a?h`<div class="hint ${a.warn?"warn":"keep"}">${a.text}</div>`:m}
    ${r===0?h`<div class="hint warn">This layer has no picture yet, so it draws a placeholder.</div>`:m}
    <div class="hint">The picture travels inside the complication, so nothing is fetched and it works with no entity at all. It is resized to the layer's own size on the way in, and each one may be at most ${Pr/1024} KB.</div>`}function CS(e,n){let t=e.trim();return t!==""&&!t.startsWith(dt)&&n.size>0&&!n.has(t)}function SS(e,n){let t=n.trim(),i=t.startsWith(dt)?t.slice(dt.length):t,a=e.map(r=>r.startsWith(dt)?r.slice(dt.length):r);return Xu(a,i).map(r=>dt+r)}function Db(e,n,t){return h`<div class="seg wide" role="radiogroup" aria-label="Icon set">
    ${[["sf","SF Symbols"],["mdi","Material Design Icons"]].map(([a,r])=>h`<button type="button" role="radio" aria-checked=${a===t?"true":"false"}
      class=${a===t?"on":""}
      @click=${()=>{a!==t&&e.setPack(n,a)}}>${r}</button>`)}
  </div>`}var TS=[["literal","Fixed text"],["entityState","Entity state"],["entityAttribute","Entity attribute"],["entityAge","Time since entity changed"],["aggregate","Several entities combined"],["chartStat","Number from a chart"],["time","Clock and date"],["dataAge","Time since last refresh"],["jinja","Template (Jinja)"],["named","Shared value"]],ES={literal:"Words or a number you type. It never changes.",entityState:"What Home Assistant shows for the entity, like 21.5 or on.",entityAttribute:"One detail the entity carries besides its state, like a light's brightness.",entityAge:"Seconds since the entity's state last changed. Set Seconds as, under Format, to read 5m instead of 300.",aggregate:"Count several entities, or take the sum, average, lowest or highest of their states.",time:"The time or date, read each time the complication refreshes.",dataAge:"Seconds since the watch last fetched values."},RS=[["straight","Straight"],["smooth","Smooth"],["step","Step"]],AS=[["flat","Flat"],["fade","Fade"]],gx=[["auto","Auto"],["all","All"]],FS=[["off","Off"],["light","Light"],["medium","Medium"],["strong","Strong"]],yx=[["bars","Bars"],["line","Line"],["area","Area"]],MS=[["auto","Auto"],["fixed","Fixed range"]],LS=[["lowest","Lowest value"],["zero","Zero"]],IS=[["none","None"],["highest","Highest"],["lowest","Lowest"],["both","Both"]],Zl=[["uniform","One colour"],["bands","By value"]];function xo(e){let n=[oc,"#FFD60A"];if(e.length<2)return n.map((o,s)=>({id:se(),upTo:(s+1)*33,colorHex:o}));let t=Math.min(...e),a=Math.max(...e)-t,r=o=>Number(o.toFixed(a>=10?0:2));return n.map((o,s)=>({id:se(),upTo:r(t+a*(s+1)/3),colorHex:o}))}function Vp(e){if(e.length===0)return 0;let n=Math.min(...e),t=Math.max(...e),i=t-n;return Number(((n+t)/2).toFixed(i>=10?0:2))}function HS(e,n){let t=vn({bands:e}),i=t.at(-1),a=e.length>1?Math.abs(t[1].upTo-t[0].upTo):10;return{id:se(),upTo:(i?.upTo??0)+(a||10),colorHex:n}}function Ob(e,n,t,i){return h`<span class="band-cell">${Eo(e,n,t)}${Co(i)}</span>`}function _S(e,n){let t=(typeof n=="number"?[n]:n??[]).filter(s=>Number.isFinite(s)),i=[...e,...t];if(i.length===0)return{lo:-1,hi:1};let a=Math.min(...i),r=Math.max(...i),o=r>a?(r-a)*.12:Math.abs(a)/2||1;return{lo:a-o,hi:r+o}}var PS=.1;function NS(e,n,t,i=PS){let a=[...e].sort((k,S)=>k-S),r=k=>Math.max(n,Math.min(t,k)),o=[n,...a.map(r),t],s=t-n||1,l=o.slice(1).map((k,S)=>Math.max(0,k-o[S])/s),c=Math.min(i,1/l.length),d=l.map(k=>k<c),u=d.filter(Boolean).length,p=l.reduce((k,S,I)=>k+(d[I]?0:S),0),f=1-u*c,g=l.length-u,b=l.map((k,S)=>d[S]?c:p>0?k/p*f:f/g),y=b.map((k,S)=>b.slice(0,S).reduce((I,_)=>I+_,0));return{shares:b,at:k=>{let S=r(k),I=o.length-2;for(let z=0;z<o.length-1;z++)if(S<=o[z+1]){I=z;break}let _=o[I+1]-o[I],E=_>0?(S-o[I])/_:0;return Math.max(0,Math.min(100,(y[I]+E*b[I])*100))}}}function Gl(e){return Math.abs(e)>=1e3||Number.isInteger(e)?String(Math.round(e*100)/100):String(Number(e.toPrecision(4)))}function DS(e,n){let t=e.flatMap(f=>f.upTo===void 0?[]:[f.upTo]),{lo:i,hi:a}=_S(t,n),{shares:r,at:o}=NS(t,i,a),s=typeof n=="number"&&Number.isFinite(n)?n:void 0,l=typeof n=="object"?n.filter(f=>Number.isFinite(f)):[],c=l.length>0?Math.min(...l):void 0,d=l.length>0?Math.max(...l):void 0,u=-1/0,p=[...t].sort((f,g)=>f-g).flatMap(f=>{let g=o(f);return g-u<12?[]:(u=g,[h`<span style=${`left:${g}%`}>${Gl(f)}</span>`])});return h`<div class="band-bar">
    <div class="bb" aria-hidden="true">${e.map((f,g)=>h`<i class=${f.border===void 0?"":"bordered"}
      style=${`flex-grow:${r[g]??0};--f:${f.fill}${f.border===void 0?"":`;--b:${f.border}`}`}></i>`)}</div>
    ${c===void 0||d===void 0?m:h`<span class="span" style=${`left:${o(c)}%;width:${o(d)-o(c)}%`}
      title=${c===d?`Reads ${Gl(c)}`:`Reads ${Gl(c)} to ${Gl(d)}`}></span>`}
    ${s===void 0?m:h`<span class="now" style=${`left:${o(s)}%`} title=${`Now ${s}`}></span>`}
    ${p.length===0?m:h`<div class="ticks" aria-hidden="true">${p}</div>`}
  </div>`}function vo(e,n,t,i,a){let r=vn({bands:e.bands}),o=typeof i=="number"&&Number.isFinite(i)?i:void 0,s=o===void 0?void 0:r.find(y=>o<=y.upTo)?.id??"above",l=(y,v)=>k=>{let S=k.bands.find(I=>I.id===y);S&&v(S)},c=e.bandAboveColorHex,d={atDefault:Gp(c,ve),title:`Back to ${ve}`,reset:()=>t(y=>{y.bandAboveColorHex=ve})},u=a?.border===!0,p=(y,v,k,S,I)=>{if(!u)return Eo(y,v.colorHex,M=>k(M??"#FFFFFF"));let _=a?.fillHex,E=a?.borderHex,z=v.fillColorHex===void 0?void 0:{atDefault:!1,title:"Back to the chart fill colour",reset:()=>S(void 0)},C=v.borderColorHex===void 0?void 0:{atDefault:!1,title:`Back to ${E===void 0?"white":"the chart border colour"}`,reset:()=>I(void 0)};return h`
      ${Ob(`${y} fill`,v.fillColorHex??_??v.colorHex,M=>{M!==void 0&&(k(M),S(_===void 0?void 0:M))},z)}
      ${Ob(`${y} border`,v.borderColorHex??E??pr,M=>I(M),C)}`},f=(y,v)=>{let k=r[y];return h`<input type="number" class="band-up" step="any" .value=${String(k.upTo)} aria-label=${v}
      title=${`Band ${y+1} runs up to and including this number`}
      data-scrub @pointerdown=${So(k.upTo,S=>t(l(k.id,I=>{I.upTo=S})),{...y>0?{min:r[y-1].upTo}:{},...y<r.length-1?{max:r[y+1].upTo}:{}})}
      @change=${ze(S=>{let I=Number(S);S.trim()!==""&&Number.isFinite(I)&&t(l(k.id,_=>{_.upTo=I}))})} />`},g=(y,v)=>({...y===void 0?{}:{upTo:y},fill:u?v.fillColorHex??a?.fillHex??v.colorHex:v.colorHex,...u?{border:v.borderColorHex??a?.borderHex??pr}:{}}),b=[...r.map(y=>g(y.upTo,y)),g(void 0,{colorHex:c,...e.bandAboveFillColorHex===void 0?{}:{fillColorHex:e.bandAboveFillColorHex},...e.bandAboveBorderColorHex===void 0?{}:{borderColorHex:e.bandAboveBorderColorHex}})];return h`<div class=${u?"bands split":"bands"}>
    ${DS(b,o??(typeof i=="object"?i:void 0))}
    ${!u||r.length===0?m:h`<div class="band-row band-head" aria-hidden="true">
      <span></span><span>Fill</span><span>Border</span><span></span>
    </div>`}
    ${r.map((y,v)=>h`
      <div class="band-row ${s===y.id?"hit":""}">
        <span class="range">${v===0?h`<span class="le">Less than</span>${f(v,"Less than")}`:h`${f(v-1,"From")}<span class="to">to</span>${f(v,"Up to")}`}</span>
        ${p(`Up to ${y.upTo}`,y,k=>t(l(y.id,S=>{S.colorHex=k}),`bcol${y.id}`),k=>t(l(y.id,S=>{k===void 0?delete S.fillColorHex:S.fillColorHex=k}),`bfill${y.id}`),k=>t(l(y.id,S=>{k===void 0?delete S.borderColorHex:S.borderColorHex=k}),`bborder${y.id}`))}
        <button type="button" class="icon" title="Remove this band" aria-label="Remove this band"
          @click=${()=>t(k=>{k.bands=k.bands.filter(S=>S.id!==y.id)})}>${H("close")}</button>
      </div>`)}
    <div class="band-row ${s==="above"?"hit":""}">${Co(d)}
      <span class="range">${r.length===0?h`<span class="else">Every value</span>`:h`<span class="le">Greater than</span>${f(r.length-1,"Greater than")}`}</span>
      ${p("Above the last band",{colorHex:c,...e.bandAboveFillColorHex===void 0?{}:{fillColorHex:e.bandAboveFillColorHex},...e.bandAboveBorderColorHex===void 0?{}:{borderColorHex:e.bandAboveBorderColorHex}},y=>t(v=>{v.bandAboveColorHex=y},"babove"),y=>t(v=>{y===void 0?delete v.bandAboveFillColorHex:v.bandAboveFillColorHex=y},"bafill"),y=>t(v=>{y===void 0?delete v.bandAboveBorderColorHex:v.bandAboveBorderColorHex=y},"baborder"))}
      <span></span>
    </div>
    <button type="button" class="link add-band" @click=${()=>t(y=>{y.bands=[...y.bands,HS(y.bands,n)]})}>+ Band</button>
  </div>`}function OS(e,n,t,i){let a=new Map,r=new Map,o=(c,d)=>{let u=c.trim();if(u==="")return;let p=u.toLowerCase();r.has(p)||r.set(p,u),a.set(p,(a.get(p)??0)+d)};e.forEach((c,d)=>{let u=e[d+1],p=u===void 0?n:u.offsetSeconds;o(c.state,Math.max(0,p-c.offsetSeconds))}),t!==void 0&&o(t,0),(wa[i??""]??[]).forEach(c=>o(c,0));let s=["unavailable","unknown"];return[...[...a.entries()].filter(([c])=>!s.includes(c)).sort((c,d)=>d[1]-c[1]).map(([c])=>r.get(c)??c),...s]}function zS(e,n,t){return xe("Combine several entities",e.aggregate!==void 0,i=>n(a=>{if(!i){delete a.aggregate;return}let r=a.value.kind.kind==="entityState"?a.value.kind.entityId:"",o=r===""?[]:[r];a.aggregate={entities:o,combine:kn},a.bands.some(s=>s.match.trim().toLowerCase()==="on")||(a.bands=ha(Cs))},`tagg${t}`))}function GS(e,n,t,i){let a=va(n),r=Hi(n),o=n.aggregate?.combine??kn,s=a.length>=xa,l=(c,d)=>{c.aggregate={entities:d,combine:c.aggregate?.combine??kn};let u=d.find(p=>p.trim()!=="")??"";u!==""&&(c.value={...c.value,kind:{kind:"entityState",...na(e.hass.states,u)}})};return h`
    ${a.map((c,d)=>h`
      <div class="row-inline">
        ${st(e,`Entity ${d+1}`,na(e.hass.states,c),u=>t(p=>{let f=va(p);f[d]=u.entityId,l(p,f)},`tagge${i}-${d}`),`${i}-agg-${d}`,{needed:c==="",clearable:a.length<=ba})}
        ${a.length>ba?h`<button class="icon" title="Remove this entity" aria-label="Remove this entity"
              @click=${()=>t(u=>{l(u,va(u).filter((p,f)=>f!==d))})}>${H("close")}</button>`:m}
      </div>`)}
    <button class="small" ?disabled=${s}
      title=${s?`A timeline merges at most ${xa} entities`:"Add another entity to this strip"}
      @click=${()=>t(c=>{l(c,[...va(c),""])})}>Add entity</button>
    ${ae("Combine",o,Af,c=>t(d=>{d.aggregate={entities:va(d),combine:c}}),{titles:{any:"On while at least one of them is active",all:"On only while every one of them is active"},def:kn})}
    <div class="hint">${Ff(o)}. Home Assistant reads a door as open, a
      person as home, a lock as unlocked and a washer as running, so one switch answers all of
      them.</div>
    ${r.length<ba?h`<div class="hint warn">Name at least ${ba} entities, or turn
        the switch off and draw the one entity's own states.</div>`:m}
    ${yc(n)?h`<div class="hint warn">A timeline merges at most ${xa}
        entities, and this one names ${r.length}. Remove ${r.length-xa}
        of them: until then the strip asks the recorder nothing and draws nothing.</div>`:m}
    <div class="hint">One strip for all of them: Home Assistant merges their recorded pasts into a
      single run of on and off. The colour table below reads those two words, whatever domain the
      entities are from.</div>`}function BS(e,n,t=[],i="wa-timeline-states"){let a=new Set(e.bands.map(o=>o.match.trim().toLowerCase())),r=t.find(o=>!a.has(o.toLowerCase()))??"";return h`
    ${e.bands.map((o,s)=>h`
      <div class="row-inline">
        ${_e("State",o.match,l=>n(c=>{let d=c.bands[s];d&&(d.match=l)},`tmatch${o.id}`),{placeholder:"on",list:i})}
        ${Ce("Colour",o.colorHex,l=>n(c=>{let d=c.bands[s];d&&(d.colorHex=l??Un)},`tcol${o.id}`))}
        <button class="icon" title="Remove this state" aria-label="Remove this state"
          @click=${()=>n(l=>{l.bands=l.bands.filter((c,d)=>d!==s)})}>${H("close")}</button>
      </div>`)}
    <datalist id=${i}>${t.map(o=>h`<option value=${o}></option>`)}</datalist>
    <button class="small" @click=${()=>n(o=>{o.bands=[...o.bands,{id:se(),match:r,colorHex:Ht(r)}]})}>${r===""?"Add state":`Add ${r}`}</button>
    ${Ce("Otherwise",e.otherColorHex,o=>n(s=>{s.otherColorHex=o??Un},"tother"),!1,Un)}`}var zb=2,VS=[["arc","Arc"],["ring","Ring"],["bar","Bar"],["dots","Dots"],["needle","Needle"]],US={arc:"A 270\xB0 arc, open at the bottom",ring:"A full circle",bar:"A straight bar",dots:"One dot per unit, the first few filled",needle:"A dial with a pointer at the reading"};function Gb(e){let n=e.value.kind;if(n.kind==="aggregate"){let{stateFilter:t,...i}=n.aggregate;return{kind:{kind:"aggregate",aggregate:{...i,function:"count"}}}}return U(String(Math.max(1,Math.round(e.maxValue-e.minValue))))}var KS=[["now","Time (14:05)"],["hour","Hour"],["minute","Minute"],["weekday","Day of the week (0 is Monday)"],["day","Day of the month"],["month","Month number"],["timestamp","Unix timestamp (seconds)"]];function WS(e,n){let t="entityId"in e?{entityId:e.entityId,displayName:e.displayName,domain:e.domain}:{entityId:"",displayName:"",domain:""};switch(n){case"literal":return{kind:n,value:e.kind==="literal"?e.value:""};case"entityState":return{kind:n,...t};case"entityAttribute":return{kind:n,...t,attribute:""};case"entityAge":return{kind:n,...t};case"aggregate":return{kind:n,aggregate:{function:"count",scope:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},stateFilter:{kind:"isOn"}}};case"time":return{kind:n,timeField:"now"};case"dataAge":return{kind:n};case"jinja":return{kind:n,value:e.kind==="jinja"?e.value:"{{ states('sensor.example') }}"};case"named":return{kind:n,id:""};case"chartStat":return{kind:n,layer:"",stat:"latest"};case"item":return{kind:n,field:e.kind==="item"?e.field:""};case"listStat":return{kind:n,layer:"",stat:"count"}}}function he(e,n,t,i){if(i.inline||!jS())return h`<div class="value-editor">${vx(e,n,t,i)}</div>`;let a=Ro(i.key),r=i.label??"Value",o=i.showResolved?e.resolve(n):void 0,s=Oe(n,ye(e)),l="entityId"in n.kind;return h`<div class="field value-chip-field ${i.compact?"compact":""}">
    ${i.compact||i.noLabel?m:h`<span>${r}</span>`}
    <button type="button" class="value-chip ${i.compact?"chip-cell":""}" popovertarget=${a} aria-haspopup="dialog" title=${`${r}: ${s}. Click to change it.`}>
      <span class="chip-text ${l?"ent-tok":""}">${s}</span>
      ${o===void 0?m:h`<span class="chip-now mono" title="Value right now">${o}</span>`}
      <span class="chip-caret" aria-hidden="true">▾</span>
    </button>
    ${bx(e,a,r,n,t,i)}
  </div>`}function bx(e,n,t,i,a,r){return h`<div class="value-pop" id=${n} popover role="dialog" aria-label=${t} @toggle=${Up}>
    <div class="pop-head">
      <b>${t}</b>
      <span class="spacer"></span>
      <button type="button" class="small" popovertarget=${n} popovertargetaction="hide">Done</button>
    </div>
    ${yo.has(n)?vx(e,i,a,r):m}
  </div>`}function ye(e){return{values:e.config.values,hass:e.hass,elements:e.config.elements}}function Ro(e){return`wa-pop-${e.replace(/[^a-zA-Z0-9_-]/g,"")}`}function jS(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype.showPopover=="function"}var yo=new Set,uo=new WeakMap;function qS(e){let n=e.getRootNode();return(n instanceof ShadowRoot||n instanceof Document?n:e.ownerDocument).querySelector(`[popovertarget="${e.id}"]`)}function xx(e,n,t=!1){let i=e instanceof Node?e:null;if(!i)return;let a=i.getRootNode();!(a instanceof ShadowRoot)&&!(a instanceof Document)||requestAnimationFrame(()=>requestAnimationFrame(()=>{let r=a.querySelector(`#${CSS.escape(n)}`);r&&typeof r.showPopover=="function"&&!r.matches(":popover-open")&&r.showPopover(),r&&t&&requestAnimationFrame(()=>requestAnimationFrame(()=>{r.querySelector("textarea, input[type=text], input[type=search], input:not([type])")?.focus()}))}))}function Up(e){let n=e.currentTarget,t=e.newState==="open",i=uo.get(n);if(i&&(i(),uo.delete(n)),!t){yo.delete(n.id)&&Le(n);return}let a=qS(n);if(!a)return;let r=()=>{if(!n.isConnected||!n.matches(":popover-open")){uo.get(n)?.(),uo.delete(n);return}let o=a.getBoundingClientRect();if(o.bottom<0||o.top>window.innerHeight){n.hidePopover();return}$p(n,o)};window.addEventListener("scroll",r,!0),window.addEventListener("resize",r),uo.set(n,()=>{window.removeEventListener("scroll",r,!0),window.removeEventListener("resize",r)}),$p(n,a.getBoundingClientRect()),yo.has(n.id)||(yo.add(n.id),Le(n),requestAnimationFrame(()=>{n.isConnected&&$p(n,a.getBoundingClientRect())}))}function $p(e,n){e.style.maxHeight="";let t=e.getBoundingClientRect(),i=YS({left:n.left,top:n.top,bottom:n.bottom,width:n.width},{width:t.width,height:t.height},{width:window.innerWidth,height:window.innerHeight});e.style.left=`${i.left}px`,e.style.top=`${i.top}px`,e.style.maxHeight=`${i.maxHeight}px`}var Zi=8,Bl=6,Bb=140;function YS(e,n,t){let i=t.height-e.bottom-Bl-Zi,a=e.top-Bl-Zi,r=n.height>i&&a>i&&i<Bb,o=Math.max(Bb,r?a:i),s=Math.min(n.height,o),l=Math.max(Zi,Math.min(e.left,t.width-n.width-Zi)),c=r?Math.max(Zi,e.top-Bl-s):Math.max(Zi,Math.min(e.bottom+Bl,t.height-s-Zi));return{left:l,top:c,maxHeight:o,above:r}}function XS(e,n,t){let i=TS.filter(([r])=>t.allowNamed!==!1||r!=="named");return(e.rowEditListId!==void 0||n.kind==="item")&&i.push(["item","Item field"]),(e.config.elements.some(r=>r.kind==="list")||n.kind==="listStat")&&i.push(["listStat","List count"]),i}function vx(e,n,t,i){let a=n.kind,r=d=>t({...n,kind:d}),o=i.key,s=XS(e,a,i),l=m;switch(a.kind){case"literal":l=i.symbol?Jl(e,a.value,d=>r({...a,value:d}),o,i.setSymbolPath):_e("Text",a.value,d=>r({...a,value:d}));break;case"entityState":case"entityAge":l=st(e,"Entity",a,d=>r({...a,...d}),`${o}-entity`);break;case"entityAttribute":{let d=Object.keys(e.hass.states[a.entityId]?.attributes??{}).sort(),u=`wa-attrs-${o.replace(/[^a-z0-9]/gi,"")}`;l=h`${st(e,"Entity",a,p=>r({...a,...p}),`${o}-entity`)}
        ${_e("Attribute",a.attribute,p=>r({...a,attribute:p}),{list:u,mono:!0})}
        <datalist id=${u}>${d.map(p=>h`<option value=${p}></option>`)}</datalist>`;break}case"aggregate":l=aT(e,a.aggregate,d=>r({...a,aggregate:d}),o);break;case"time":l=Fe("Field",a.timeField,KS,d=>r({...a,timeField:d}));break;case"dataAge":break;case"jinja":l=h`${Dp("Template",a.value,d=>r({...a,value:d}),4)}
        <div class="hint">Rendered by Home Assistant. The result should be one value, not a whole document.</div>`;break;case"named":{let d=e.config.values.find(p=>p.id===a.id),u=d?Vr(e.config,d.id):0;l=e.config.values.length===0?h`<div class="hint keep">No shared values yet.
            <button type="button" class="link" @click=${()=>nT(e,n,t)}>Start an empty one</button>,
            or choose another source and click Make shared.</div>`:h`${Fe("Value",a.id,[["","(choose)"],...e.config.values.map(p=>[p.id,p.name||p.id.slice(0,8)])],p=>r({...a,id:p}))}
          ${d?h`<div class="hint keep">Read by ${u} ${u===1?"layer":"layers"}.
            <button type="button" class="link" @click=${()=>e.selectValue(d.id)}>Edit it</button> to change them all, or
            <button type="button" class="link" @click=${()=>{let p=Jc(e.config,n);p&&t(p)}}>stop sharing</button>
            to give this one its own copy.</div>`:m}`;break}case"chartStat":{let d=ye(e),u=e.config.elements.filter(p=>p.kind==="chart");l=u.length===0?h`<div class="hint warn">There is no chart layer yet. Add one first, then this can print one of its numbers.</div>`:h`
          ${Fe("Chart",a.layer,[["","(choose)"],...u.map(p=>[p.payload.id,Te(p,d)])],p=>r({...a,layer:p}))}
          ${Fe("Number",a.stat,[...jt],p=>r({...a,stat:p}))}
          <div class="hint">${a.stat==="top"||a.stat==="bottom"?"One end of the plot's range: what the tallest or shortest mark means. On a Fixed scale that is the Min or Max the chart was given.":"Read from the readings the chart draws, after any trim. Decimals follow the chart's spread; set Decimals below to override, and Add unit to print the entity's unit after it."}</div>`;break}case"item":l=rT(e,a,d=>r(d),o);break;case"listStat":{let d=ye(e),u=e.config.elements.filter(p=>p.kind==="list");l=u.length===0?h`<div class="hint warn">There is no list layer yet. Add one first, then this can print how many rows it drew.</div>`:h`
          ${Fe("List",a.layer,[["","(choose)"],...u.map(p=>[p.payload.id,Te(p,d)])],p=>r({...a,layer:p}))}
          ${Fe("Number",a.stat,[...mf],p=>r({...a,stat:p}))}
          <div class="hint">${a.stat==="total"?'How many items there were before the list took the first few. Use it for "4 of 12".':"How many rows the list actually drew. Use it for a header above the list, or a rule that shows an empty state when it is 0."}</div>`;break}}let c=ES[a.kind];return h`
    ${Fe("Source",a.kind,s,d=>r(WS(a,d)))}
    ${c?h`<div class="hint">${c}</div>`:m}
    ${l}
    ${eT(n,i)?h`<div class="hint keep">
      <button type="button" class="link" title="Move this into a shared value that other layers can read too" @click=${()=>tT(e,n,t)}>Make shared</button>
      so other layers can read this too.</div>`:m}
    ${i.noFormat?m:iT(n.format,d=>t(Xe(d)?{kind:n.kind}:{...n,format:d}),ZS(JS(e,n)))}
    ${i.showResolved?QS(e,n,e.resolve(i.resolveAs??n)):m}`}function JS(e,n){let t=n.kind;for(let i=0;t.kind==="named"&&i<8;i++){let a=t.id.toUpperCase(),r=e.config.values.find(o=>o.id.toUpperCase()===a);if(!r)return;t=r.value.kind}return t.kind==="named"?void 0:t}function ZS(e){if(!e)return{numbers:!0,textCase:!0,unit:!0,seconds:!0};switch(e.kind){case"literal":{let n=at(e.value)!==void 0;return{numbers:n,textCase:!n,unit:!1,seconds:n}}case"entityState":case"entityAttribute":case"jinja":case"named":return{numbers:!0,textCase:!0,unit:e.kind!=="jinja"&&e.kind!=="named",seconds:!0};case"entityAge":case"dataAge":return{numbers:!0,textCase:!1,unit:!1,seconds:!0};case"aggregate":return{numbers:!0,textCase:!1,unit:!1,seconds:!1};case"chartStat":{let n=e.stat==="trend";return{numbers:!n,textCase:!1,unit:!n,seconds:!1}}case"time":return{numbers:e.timeField!=="now",textCase:!1,unit:!1,seconds:!1};case"item":return{numbers:!0,textCase:!0,unit:!0,seconds:!0};case"listStat":return{numbers:!0,textCase:!1,unit:!1,seconds:!1}}}function QS(e,n,t){let i=t===void 0?h`<span class="readout-v now-v none">${wx(e,n)}</span>`:t.trim()===""?h`<span class="readout-v now-v none">Empty</span>`:h`<span class="readout-v now-v"><span class="now-tok">${t}</span></span>`;return h`<div class="field readout now-field"><span>Now</span>${i}</div>`}function wx(e,n){let t=n.kind;switch(t.kind){case"entityState":case"entityAttribute":case"entityAge":return t.entityId===""?"Pick an entity":e.hass.states[t.entityId]?t.kind==="entityAttribute"&&t.attribute.trim()===""?"Pick an attribute":t.kind==="entityState"?"No reading":"Waiting for Home Assistant":"No such entity";case"chartStat":return t.layer===""?"Pick a chart":"The chart has no readings yet";case"item":return t.field===""?"Pick a field":"Only while a row is drawn";case"listStat":return t.layer===""?"Pick a list":"That list has drawn nothing yet";case"named":{if(t.id==="")return"Pick a shared value";let i=t.id.toUpperCase(),a=e.config.values.find(r=>r.id.toUpperCase()===i);return a?wx(e,a.value):"That shared value is gone"}case"jinja":return t.value.trim()===""?"Type a template":"Waiting for Home Assistant";default:return"Waiting for Home Assistant"}}function eT(e,n){if(n.allowNamed===!1||n.noShare)return!1;let t=e.kind;return t.kind==="named"?!1:t.kind==="literal"||t.kind==="jinja"?t.value.trim()!=="":"entityId"in t?t.entityId!=="":t.kind==="chartStat"?t.layer!=="":!0}function tT(e,n,t){let i=Ao(n,ye(e)).replace(/^"(.*)"$/,"$1"),{named:a,ref:r}=Xc(e.config,n,Ze(i,24));e.beginGesture(),e.update(o=>{o.values.push(a)}),t(r),e.endGesture()}function nT(e,n,t){let{named:i,ref:a}=Xc(e.config,{...n,kind:{kind:"literal",value:""}},"");i.name="",e.beginGesture(),e.update(r=>{r.values.push(i)}),t(a),e.endGesture(),e.selectValue(i.id)}function iT(e,n,t){let i=e??{},a=s=>{let l={...i,...s};for(let c of Object.keys(l))(l[c]===void 0||l[c]===!1||l[c]==="")&&delete l[c];n(l)},r=Xe(e),o={decimals:t.numbers||i.decimals!==void 0,multiply:t.numbers||i.multiply!==void 0,offset:t.numbers||i.offset!==void 0,textCase:t.textCase||i.textCase!==void 0,unit:t.unit||!!i.useEntityUnit,seconds:t.seconds||!!i.relativeTime||!!i.duration};return h`<details class="sub format" ?open=${!r}>
    <summary>Format${r?h`<span class="sum-note">as it comes</span>`:h`<span class="sum-note">${Qx(e).replace(/^ \((.*)\)$/,"$1")}</span>`}</summary>
    <div class="grid2">
      ${o.decimals?re("Decimals",i.decimals,s=>a({decimals:s}),{step:1,min:0,max:6,optional:!0,placeholder:"as is"}):m}
      ${o.multiply?re("Multiply",i.multiply,s=>a({multiply:s}),{optional:!0,placeholder:"1"}):m}
      ${o.offset?re("Plus",i.offset,s=>a({offset:s}),{optional:!0,placeholder:"0"}):m}
      ${o.textCase?ae("Case",i.textCase??"",[["","As is"],["upper","ABC"],["lower","abc"],["capitalized","Abc"]],s=>a({textCase:s||void 0}),{titles:{"":"Leave the letters as they are",upper:"UPPER CASE",lower:"lower case",capitalized:"Capital First Letters"}}):m}
      ${_e("Before",i.prefix??"",s=>a({prefix:s}),{placeholder:"text in front"})}
      ${_e("After",i.suffix??"",s=>a({suffix:s}),{placeholder:"text after"})}
    </div>
    ${o.unit?xe("Add unit",!!i.useEntityUnit,s=>a({useEntityUnit:s})):m}
    ${o.seconds?ae("Seconds as",i.duration?"duration":i.relativeTime?"relativeTime":"",[["","Number"],["relativeTime","Short"],["duration","Duration"]],s=>a({relativeTime:s==="relativeTime",duration:s==="duration"}),{titles:{"":"300",relativeTime:"One unit: 45s, 5m, 3h",duration:"Two units: 1h 23m, 5m 0s"}}):m}
    ${Fe("Timestamp",i.timestamp??"",[["","None"],...as],s=>a({timestamp:s||void 0}))}
    ${rs(i.timestamp)?h`<div class="grid2">
          ${xe("Minutes",!i.hideMinutes,s=>a({hideMinutes:!s}))}
          ${xe("AM/PM",!i.hideDayPeriod,s=>a({hideDayPeriod:!s}))}
        </div>
        <div class="hint">Turn both off and 5:30 PM reads 5. AM/PM does nothing on a watch set to a 24-hour clock, which never shows one.</div>`:m}
    ${i.timestamp===void 0?m:h`<div class="hint">Read as a moment in time (unix seconds) and printed by the watch's own clock and locale. A value that is not a number prints exactly as it did.</div>`}
  </details>`}function kx(e,n,t,i){let a=o=>o.join(", "),r=o=>o.split(",").map(s=>s.trim()).filter(Boolean);return h`
    ${ae("Over",n.kind,[["filter","Entities matching a filter"],["entities","A fixed list"]],o=>t(o==="entities"?{kind:"entities",entities:[]}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]}))}
    ${n.kind==="filter"?h`<div class="grid2">
          ${_e("Domains",a(n.domains),o=>t({...n,domains:r(o)}),{placeholder:"light, switch"})}
          ${_e("Area ids",a(n.areaIds),o=>t({...n,areaIds:r(o)}))}
          ${_e("Label ids",a(n.labelIds),o=>t({...n,labelIds:r(o)}))}
          ${_e("Floor ids",a(n.floorIds),o=>t({...n,floorIds:r(o)}))}
        </div>`:h`${n.entities.map((o,s)=>h`<div class="row-inline">
            ${st(e,`Entity ${s+1}`,o,l=>{let c=[...n.entities];c[s]=l,t({...n,entities:c})},`${i}-agg-${s}`,{compact:!0})}
            <button class="icon" title="Remove" @click=${()=>t({...n,entities:n.entities.filter((l,c)=>c!==s)})}>${H("close")}</button>
          </div>`)}
          <button class="small" @click=${()=>t({...n,entities:[...n.entities,{entityId:"",displayName:"",domain:""}]})}>Add entity</button>`}`}function $x(e,n,t){return h`
    ${Fe(e,n?.kind??"",[["","Any state"],["isOn","On"],["isOff","Off"],["equals","State equals"],["notEquals","State does not equal"]],i=>{t(i===""?void 0:i==="equals"||i==="notEquals"?{kind:i,value:n&&"value"in n?n.value:""}:{kind:i})})}
    ${n&&"value"in n?_e("State",n.value,i=>t({kind:n.kind,value:i})):m}`}function aT(e,n,t,i){return h`
    ${Fe("Function",n.function,[["count","Count"],["sum","Sum"],["average","Average"],["min","Min"],["max","Max"]],a=>t({...n,function:a}))}
    ${kx(e,n.scope,a=>t({...n,scope:a}),i)}
    ${$x("Only count when",n.stateFilter,a=>{let r={...n};a===void 0?delete r.stateFilter:r.stateFilter=a,t(r)})}
    ${n.function==="count"?m:_e("Attribute (blank = state)",n.attribute??"",a=>{let r={...n};a?r.attribute=a:delete r.attribute,t(r)})}`}function Cx(e){let n=e.rowEditListId;if(n===void 0)return;let t=e.config.elements.find(i=>i.kind==="list"&&i.payload.id===n);return t?.kind==="list"?t.payload.source:void 0}var Cp="__other";function rT(e,n,t,i){let a=Cx(e),r=a?mp(a):[],o=r.some(([d])=>d===n.field),s=n.field!==""&&!o,l=[["","(choose)"],...r.map(([d,u])=>[d,u]),[Cp,"Something else\u2026"]],c=a?.kind==="entities";return h`
    ${a===void 0?h`<div class="hint warn">An item field only reads something while a row is being drawn. Open the list's Row card and click Design the row.</div>`:m}
    ${Fe("Field",s?Cp:n.field,l,d=>{t(d===Cp?{...n,field:c?"attr.":""}:{...n,field:d})})}
    ${s||c&&n.field.startsWith("attr.")?h`${_e(c?"Attribute":"Field name",n.field,d=>t({...n,field:d.trim()}),{mono:!0,placeholder:c?"attr.brightness":"title"})}
        ${c?h`<div class="hint">Write it as <code>attr.</code> and the attribute's name. The list asks Home Assistant for exactly the attributes its row reads, so adding one here adds it to the fetch.</div>`:m}`:m}
    <div class="hint">An unknown field draws <code>--</code>. A time field takes a Timestamp style under Format, and a count of seconds takes Seconds as.</div>`}function Sx(e){let n=[],t=i=>{i&&n.push(i)};switch(e.kind){case"text":t(e.payload.value);for(let i of e.payload.parts??[])t(i.value);break;case"icon":t(e.payload.symbol),t(e.payload.level?.value),t(e.payload.level?.minSource),t(e.payload.level?.maxSource);break;case"shape":t(e.payload.level?.value),t(e.payload.level?.minSource),t(e.payload.level?.maxSource);break;case"gauge":t(e.payload.value),t(e.payload.total),t(e.payload.minSource),t(e.payload.maxSource);break;default:break}for(let i of e.payload.rules){for(let a of i.cases){for(let r of a.when.tests)t(r.value),t(r.comparison&&"value"in r.comparison?r.comparison.value:void 0),t(r.comparison&&"upper"in r.comparison?r.comparison.upper:void 0);for(let r of a.then)t(r.value)}for(let a of i.otherwise??[])t(a.value)}return n}var oT=/\{item\.attr\.([^{}]+)\}/g;function sT(e){let n=[],t=i=>{let a=i.trim();a!==""&&!n.includes(a)&&n.push(a)};for(let i of e){for(let o of Sx(i))o.kind.kind==="item"&&o.kind.field.startsWith("attr.")&&t(o.kind.field.slice(5));if(i.kind!=="tap")continue;let a=i.payload.action,r=["entityId"in a?a.entityId:"","displayName"in a?a.displayName:"",a.type==="callService"?a.serviceDataJSON??"":"",a.type==="callService"?a.target?.entityId??"":""];for(let o of r)for(let s of o.matchAll(oT))t(s[1]??"")}return n}function ra(e){if(e.source.kind!=="entities")return;let n=sT(e.template);n.length===e.source.attributes.length&&n.every((i,a)=>e.source.kind==="entities"&&e.source.attributes[a]===i)||(e.source={...e.source,attributes:n})}function lT(e,n){let t=e.kind==="calendar"||e.kind==="todo"?e.entities.filter(a=>a.entityId!==""):"entityId"in e&&e.entityId!==""?[{entityId:e.entityId,displayName:e.displayName,domain:e.domain}]:[],i=t[0]??{entityId:"",displayName:"",domain:""};switch(n){case"entities":return e.kind==="entities"?e:{kind:"entities",scope:t.length>0?{kind:"entities",entities:t}:{kind:"filter",domains:[],areaIds:[],labelIds:[],floorIds:[]},sort:"name",descending:!1,attributes:[]};case"attribute":return{kind:"attribute",...i,attribute:e.kind==="attribute"?e.attribute:""};case"template":return{kind:"template",value:e.kind==="template"?e.value:""};case"calendar":return{kind:"calendar",entities:t.slice(0,Fs),hours:zr};case"todo":return{kind:"todo",entities:t.slice(0,Fs),status:"open",sort:"list"};case"forecast":return{kind:"forecast",...i,type:"hourly"}}}var Vb={sensor:["battery","energy","humidity","illuminance","power","pressure","signal_strength","temperature"],binary_sensor:["battery","connectivity","door","gas","moisture","motion","occupancy","problem","smoke","window"],cover:["door","garage","shade","window"]};function dT(e){return(e.kind==="filter"?e.domains:e.entities.map(t=>t.entityId.split(".")[0]??"")).map(t=>t.trim().toLowerCase()).filter(t=>t!=="")}function cT(e,n){let t=dT(n),i=new Set;for(let[r,o]of Object.entries(e??{})){let s=r.split(".")[0]??"";if(t.length>0&&!t.includes(s))continue;let l=o?.attributes?.device_class;typeof l=="string"&&l.trim()!==""&&i.add(l.trim())}if(i.size>0)return[...i].sort();let a=new Set;for(let r of t.length>0?t:Object.keys(Vb))for(let o of Vb[r]??[])a.add(o);return[...a].sort()}function uT(e,n){let t={...e},i=n.trim();return i===""?delete t.deviceClass:t.deviceClass=i,t}function Ub(e,n,t,i,a,r){let o=t.length>=Fs;return h`
    ${t.map((s,l)=>h`<div class="row-inline">
      ${st(e,`${n} ${l+1}`,s,c=>{let d=[...t];d[l]=c,i(d)},`${a}-ref-${l}`,{compact:!0,domain:r})}
      <button class="icon" title="Remove" @click=${()=>i(t.filter((c,d)=>d!==l))}>${H("close")}</button>
    </div>`)}
    <button class="small" ?disabled=${o} @click=${()=>i([...t,{entityId:"",displayName:"",domain:""}])}>Add ${n.toLowerCase()}</button>
    ${t.length===0?h`<div class="hint warn">Nothing is picked yet, so this list has nothing to draw.</div>`:m}
    ${o?h`<div class="hint">Five is the most one list may merge.</div>`:m}`}var Kb=new Map;function pT(e,n,t,i){let a=n.source,r=(s,l)=>t(c=>{c.source=s,ra(c)},l),o=m;switch(a.kind){case"entities":{let s=a.attributes,l=cT(e.hass.states,a.scope),c=`wa-list-classes-${i.replace(/[^a-z0-9]/gi,"")}`;o=h`
        ${kx(e,a.scope,d=>r({...a,scope:d}),`${i}-scope`)}
        ${_e("Device class",a.deviceClass??"",d=>r(uT(a,d),"list-device-class"),{list:c,placeholder:"any",mono:!0,def:""})}
        <datalist id=${c}>${l.map(d=>h`<option value=${d}></option>`)}</datalist>
        <div class="hint">Keeps only the entities whose device class is exactly this, so a scope of sensors becomes your battery sensors. Leave it empty for any.</div>
        ${$x("Only when",a.stateFilter,d=>{let u={...a};d===void 0?delete u.stateFilter:u.stateFilter=d,r(u)})}
        ${Fp({label:"Sort by",value:a.sort,options:[...xc],def:"name",set:d=>r({...a,sort:d})},{label:"Order",value:a.descending?"down":"up",options:[["up","A to Z"],["down","Z to A"]],def:"up",set:d=>r({...a,descending:d==="down"})})}
        <div class="hint">Entities that are unavailable are left out, unless Only when asks for exactly that state. Sorting by state compares numbers as numbers, and puts the text ones after them.</div>
        ${s.length>0?h`<div class="field readout"><span>Attributes</span><span class="readout-v mono">${s.join(", ")}</span></div>
            <div class="hint">Asked for because the row reads them. Remove the layer that reads one and it stops being fetched.</div>`:m}`;break}case"attribute":{let l=Object.entries(e.hass.states[a.entityId]?.attributes??{}).filter(([,d])=>Array.isArray(d)).map(([d])=>d).sort(),c=`wa-list-attrs-${i.replace(/[^a-z0-9]/gi,"")}`;o=h`
        ${st(e,"Entity",a,d=>r({...a,...d}),`${i}-attr-entity`)}
        ${_e("Attribute",a.attribute,d=>r({...a,attribute:d},"list-attr"),{list:c,mono:!0})}
        <datalist id=${c}>${l.map(d=>h`<option value=${d}></option>`)}</datalist>
        <div class="hint">An attribute that holds a list: a group's members, a select's options, a media player's sources, or any sensor that carries an array. Each entry becomes a row.</div>
        ${a.entityId!==""&&l.length===0?h`<div class="hint warn">None of that entity's attributes holds a list right now. The name can still be typed above.</div>`:m}`;break}case"template":o=h`
        ${Dp("Template",a.value,s=>r({...a,value:s},"list-template"),4)}
        <div class="hint">Rendered by Home Assistant, the same way a template value is. It should yield a JSON array: a list of objects becomes a row each, with one field per key, and a list of plain values gives each row one field called <code>value</code>.</div>`;break;case"calendar":{let s=Kb.get(n.id)??Ac(a.hours).unit,l=Vf(a.hours,s),c=Ac(zr),d={hours:"h",days:"d",weeks:"w",months:"mo"};o=h`
        ${Ub(e,"Calendar",a.entities,u=>r({...a,entities:u}),`${i}-cal`,"calendar")}
        ${re("Look ahead",l,u=>r({...a,hours:Fc(u??1,s)},"list-hours"),{step:1,min:1,max:Mc(s),unit:d[s],...c.unit===s?{def:c.value}:{}})}
        ${ae("Counted in",s,Gf.map(u=>[u,u[0].toUpperCase()+u.slice(1)]),u=>{Kb.set(n.id,u),r({...a,hours:Fc(Bf(a.hours,u),u)})},{def:c.unit})}
        <div class="hint">Events from now to that far ahead, up to a year, merged across the calendars and sorted by when they start. A month counts as thirty days. An event already under way is included. How many of them show is Items shown, in the Look card.</div>`;break}case"todo":o=h`
        ${Ub(e,"List",a.entities,s=>r({...a,entities:s}),`${i}-todo`,"todo")}
        ${Fp({label:"Show",value:a.status,options:[...vc],def:"open",set:s=>r({...a,status:s})},{label:"Sort by",value:a.sort,options:[...wc],def:"list",set:s=>r({...a,sort:s})})}`;break;case"forecast":o=h`
        ${st(e,"Weather",a,s=>r({...a,...s}),`${i}-fc-entity`,{domain:"weather"})}
        ${ae("Forecast",a.type,[...kc],s=>r({...a,type:s}),{def:"hourly"})}
        <div class="hint">Whatever that weather entity supports. An entity with no forecast of the chosen kind draws nothing.</div>`;break}return h`
    ${Fe("Items",a.kind,[...$c],s=>r(lT(a,s),"list-kind"))}
    ${o}`}function hT(e,n,t){let i=ge[t==="inline"?"rectangular":t],a=gu({...e,frame:n},i)[0];return a===void 0?0:a.height*Math.abs(n.height)*i.height}var fT=10;function mT(e,n,t,i){let a=n.payload,r=Ge(e.config,t,n).frame,o=Ms(a),s=hT(a,r,t),l=a.direction==="down";return h`
    ${re("Items shown",a.rows,c=>i(d=>{d.rows=nt(c),ra(d)},"list-rows"),{step:1,min:Cc,max:Sc,def:Nr})}
    ${ae("Direction",a.direction,[...Df],c=>i(d=>{d.direction=c}),{def:"down"})}
    ${l?re("Columns",a.columns,c=>i(d=>{d.columns=Gr(c)},"list-cols"),{step:1,min:Tc,max:Ec,def:Dr}):m}
    ${re("Gap",a.gap,c=>i(d=>{d.gap=Pi(c)},"list-gap"),{step:.5,min:0,max:Rc,def:Or,unit:"pt"})}
    <div class="field readout"><span>Grid</span><span class="readout-v">${l?`${o.lines} ${o.lines===1?"line":"lines"} of ${o.columns}`:`${o.columns} across`} · ${s.toFixed(1)} pt tall</span></div>
    ${s>0&&s<fT?h`<div class="hint warn">A cell is ${s.toFixed(1)} points tall on this shape, which is too short for a line of text. Draw fewer cells, or make the list taller.</div>`:m}
    <div class="hint">The frame is split into this many cells whatever the item count, so a short list leaves the design where you put it rather than stretching two items over four rows.</div>`}var gT=["text","icon","shape","gauge","image","tap"];function yT(e,n,t){let i=n.payload,a=ye(e),r=e.rowEditListId===i.id,o=i.template.length>=$a,s=(l,c)=>t(d=>{Ya(d.template,l,l+c)});return h`
    <div class="chips">
      <button class="small ${r?"on":""}" title=${r?"Go back to the whole face":"Fill the preview with one cell of this list, so the row can be dragged and sized like any other layer"}
        @click=${()=>e.setRowEdit(r?void 0:i.id)}>${r?"Done designing":"Design the row"}</button>
    </div>
    ${r?h`<div class="hint keep">The preview is one cell of this list, scaled up. Drag and resize the row's layers there. Values can read Item field, and a tap can aim at the item it is drawn for.</div>`:m}
    ${i.template.length===0?h`<div class="hint warn">The row is empty, so the list draws nothing. Add a layer below.</div>`:h`<div class="chart-numbers">${rp(i.template,l=>l.payload.id,(l,c)=>h`
        <div class="num-row">
          <button class="num-pick" title="Show this layer's settings"
            @click=${()=>{e.setRowEdit(i.id),e.selectLayer(l.payload.id)}}>
            <span class="num-lead">${H(Kp(l.kind))}</span>
            <span class="num-text"><span class="num-title">${Te(l,a)}</span><span class="num-kind">${lt[l.kind]}</span></span>
          </button>
          <button class="icon" title=${l.payload.isHidden?"Show this layer":"Hide this layer"}
            aria-label=${l.payload.isHidden?"Show this layer":"Hide this layer"}
            @click=${()=>t(d=>{let u=d.template[c];u&&(u.payload.isHidden=!u.payload.isHidden)})}
            >${H(l.payload.isHidden?"hide":"show")}</button>
          <button class="icon" title="Move up" aria-label="Move up" ?disabled=${c===0} @click=${()=>s(c,-1)}>${H("up")}</button>
          <button class="icon" title="Move down" aria-label="Move down" ?disabled=${c===i.template.length-1} @click=${()=>s(c,1)}>${H("down")}</button>
          <button class="icon danger" title="Remove this layer" aria-label="Remove this layer"
            @click=${()=>t(d=>{d.template.splice(c,1),ra(d)})}>${H("delete")}</button>
        </div>`)}</div>`}
    <div class="chips">
      ${gT.map(l=>h`<button class="small" ?disabled=${o}
        title=${`Add a ${lt[l].toLowerCase()} to the row`}
        @click=${()=>{let c=bT(l);t(d=>{d.template.length<$a&&d.template.push(c)}),e.setRowEdit(i.id),e.selectLayer(c.payload.id)}}>${lt[l]}</button>`)}
    </div>
    <div class="hint">Every row draws these layers with its own item. Change them once and every row follows. Double click a row on the face, or click a layer here, to design them.</div>
    <div class="hint">${o?"Eight layers is the most a row may hold.":`${i.template.length} of ${$a} layers. A row holds text, icons, shapes, gauges, uploaded pictures and taps.`}</div>`}function Kp(e){return e==="image"?"image":e==="tap"?"tap":e==="gauge"?"gauge":e==="icon"?"icon":e==="shape"?"shape":"text"}function bT(e){let n=De(e);return n.payload.frame={x:0,y:0,width:1,height:1,rotationDegrees:0},n.kind==="text"&&(n.payload.value={kind:{kind:"item",field:""}},n.payload.fontSize=11),n.kind==="icon"&&(n.payload.symbol={kind:{kind:"item",field:"icon"}},n.payload.size=11,n.payload.frame={x:.3,y:.1,width:.4,height:.8,rotationDegrees:0}),n.kind==="image"&&(n.payload.source="inline"),n.kind==="gauge"&&(n.payload.value={kind:{kind:"item",field:""}}),n}function Tx(e,n,t,i){let a=e.elements.find(c=>c.kind==="list"&&c.payload.id===n);if(a?.kind!=="list")return;let r=structuredClone(a.payload.template);if(i!==void 0)for(let c of r)xT(c,i);let o=new Set(r.map(c=>c.payload.id)),s={...e,elements:r,groups:[],perFamily:{}};for(let c of ue){let d=e.perFamily[c];if(!d)continue;let u={};for(let p of o){let f=d.placements[p];f&&(u[p]=structuredClone(f))}s.perFamily[c]={...d,placements:u,rules:[]}}let l=s.perFamily[t];if(l)for(let c of r)l.placements[c.payload.id]||(l.placements[c.payload.id]={frame:{...c.payload.frame},isHidden:c.payload.isHidden});return s}function xT(e,n){for(let t of Sx(e))t.kind.kind==="item"&&(t.kind={kind:"literal",value:n.get(t.kind.field)??"--"})}function Mp(e,n,t){let i=Cx(e);if(i===void 0)return m;let a=mp(i).filter(([r])=>r!=="index"&&r!=="icon");return a.length===0?m:h`
    <div class="chips">
      ${a.map(([r,o])=>h`<button class="small" title=${`Put {item.${r}} into ${t}`}
        @click=${()=>n(`{item.${r}}`)}>${o}</button>`)}
    </div>
    <div class="hint">Each one is filled in per row when the tap fires. A placeholder naming a field the item does not have leaves that row's tap doing nothing.</div>`}function vT(e){switch(e.kind){case"calendar":return"No events";case"todo":return"All done";case"forecast":return"No forecast";default:return"Nothing to show"}}function wT(e,n,t){let i=e.elements.find(c=>c.kind==="list"&&c.payload.id===n);if(i?.kind!=="list")return;let a={...Ge(e,t,i).frame},r=De("text");r.payload.frame=a,r.payload.isHidden=!0,r.kind==="text"&&(r.payload.value=U(vT(i.payload.source)),r.payload.fontSize=12,r.payload.colorSlot.baseColorHex="#8E8E93"),r.payload.name="Empty state";let o=La(),s=o.cases[0],l=s.when.tests[0];return l.value={kind:{kind:"listStat",layer:n,stat:"count"}},l.comparison={kind:"equals",value:U("0")},s.then=[Jn("show")],r.payload.rules=[o],e.elements.push(r),Pe(e,t,r.payload.id,{frame:a,isHidden:!0}),r.payload.id}var Ex=Ls,kT=Ex.filter(([e])=>e!=="none");function Lp(e){if("entityId"in e)return{entityId:e.entityId,displayName:e.displayName,domain:e.domain};if(e.type==="callService")return e.target}function Rx(e,n){let t=Lp(n)??{entityId:"",displayName:"",domain:""};if(e==="callService"){let i=n.type==="callService"?{...n}:{type:"callService",serviceDomain:"",serviceName:""};return t.entityId!==""&&(i.target=t),i}if(e==="refreshAll"){if(n.type!=="refreshAll")return{type:"refreshAll"};let i={type:"refreshAll"};return n.allPlaced===!0?i.allPlaced=!0:n.targets!==void 0&&n.targets.length>0&&(i.targets=[...n.targets]),i}return Uf(e)?{type:e,...t}:{type:e}}function Ax(e){let n=jf(e);return n===void 0?m:h`<div class="hint">${n}</div>`}function Fx(e,n,t){let i=n.allPlaced===!0,a=n.targets??[],r=e.config.id.toUpperCase(),o=(e.documents??[]).map(u=>({id:u.id.toUpperCase(),name:u.name})).filter(u=>u.id!==r).sort((u,p)=>u.name.localeCompare(p.name,void 0,{sensitivity:"base"})),s=a.filter(u=>!o.some(p=>p.id===u)),l=(u,p)=>t(Wf(n,u,p)),c=u=>t(u?{type:"refreshAll",allPlaced:!0}:{type:"refreshAll"});if(i)return h`${xe("All placed complications",!0,c)}`;let d=[...o.map(u=>xe(u.name||"Unnamed",a.includes(u.id),p=>l(u.id,p))),...s.map(u=>xe("Unknown complication (deleted)",!0,p=>l(u,p)))];return h`
    ${xe("All placed complications",!1,c)}
    ${d.length===0?h`<div class="hint keep">No other complications on this watch yet.</div>`:h`${d}
        <div class="hint keep">This complication always refreshes itself, so it is not in the list.</div>`}`}var $T=[["Open a cover","cover","open_cover",""],["Close a cover","cover","close_cover",""],["Stop a cover","cover","stop_cover",""],["Lock","lock","lock",""],["Unlock","lock","unlock",""],["Light brightness","light","turn_on",'{"brightness_pct": 50}'],["Climate target","climate","set_temperature",'{"temperature": 21}'],["Play / pause","media_player","media_play_pause",""],["Start a vacuum","vacuum","start",""],["Send a vacuum home","vacuum","return_to_base",""]];function Mx(e,n,t,i){let a=n.serviceDataJSON??"",r=Kf(a),o=n.target??{entityId:"",displayName:"",domain:""};return h`
    <div class="gen-row">
      ${_e("Domain",n.serviceDomain,s=>t({...n,serviceDomain:s.trim()},"svc-domain"),{placeholder:"light"})}
      ${_e("Service",n.serviceName,s=>t({...n,serviceName:s.trim()},"svc-name"),{placeholder:"turn_on"})}
    </div>
    <div class="chips">
      ${$T.map(([s,l,c,d])=>h`
        <button class="small" title=${`Fill in ${l}.${c}`}
          @click=${()=>{let u={...n,serviceDomain:l,serviceName:c};d===""?delete u.serviceDataJSON:u.serviceDataJSON=d,t(u)}}>${s}</button>`)}
    </div>
    ${st(e,"Target entity (optional)",o,s=>{let l={...n};s.entityId===""?delete l.target:l.target=s,t(l,"svc-entity")},`${i}-svc-entity`)}
    ${Mp(e,s=>{let l={...n};l.target={entityId:s,displayName:"",domain:""},t(l,"svc-entity")},"the target entity")}
    ${Dp("Data (JSON)",a,s=>{let l={...n};s.trim()===""?delete l.serviceDataJSON:l.serviceDataJSON=s,t(l,"svc-data")},3)}
    ${Mp(e,s=>{let l={...n};l.serviceDataJSON=`${a}${s}`,t(l,"svc-data")},"the data")}
    ${r?h`<div class="hint">Leave the data empty for a service that needs nothing else. Anything here must be a JSON object, like <code>{"brightness_pct": 50}</code>. Templates are not run.</div>`:h`<div class="hint warn">That is not a JSON object, so the watch will refuse the tap. It has to look like <code>{"brightness_pct": 50}</code>.</div>`}`}function CT(e,n){return e!==void 0&&n.trim()!==""&&n.trim()!==e.trim()}function Lx(e,n={}){let t=e.config,i=t.tapAction,a=CT(e.savedName,t.name),r=t.refreshMinutes??0,o=Wb.map(c=>[String(c),jb(c)]);Wb.includes(r)||o.push([String(r),jb(r)]);let s=t.showSuccessFlash??!0,l=a?h`<div class="hint warn">After you change a complication name, let the change sync to the watch, then re-select the complication in the watch's complication picker. Otherwise the list starts to look wrong.</div>`:m;return n.nameOnly===!0?h`
      <div class="gen-row">
        ${_e("Name",t.name,c=>e.update(d=>{d.name=c},"name"))}
      </div>
      ${l}`:h`
    <div class="gen-row">
      ${_e("Name",t.name,c=>e.update(d=>{d.name=c},"name"))}
      ${Fe("Refresh",String(r),o,c=>e.update(d=>{d.refreshMinutes=Number(c)||0},"refresh"))}
      ${Fe("Tap action",i.type,Ex,c=>e.update(d=>{d.tapAction=Rx(c,d.tapAction),c!=="openPage"&&(delete d.openPageId,delete d.openPageName)}))}
      <div class="field flash-cell"><span title="Flash when a tap works">Flash</span>
        <div class="flash-row">
          <input type="checkbox" .checked=${s} title="Flash when a tap works"
            @change=${c=>e.update(d=>{d.showSuccessFlash=c.target.checked})} />
          ${s?h`<input type="color" class="flash-color" title="Flash colour. Click to change it." .value=${(t.successFlashColorHex??ST).slice(0,7)}
                @input=${ze(c=>e.update(d=>{d.successFlashColorHex=c.toUpperCase()},"flash"))} />`:h`<span class="muted">Off</span>`}
        </div>
      </div>
    </div>
    ${l}
    ${Ax(i)}
    ${i.type==="refreshAll"?Fx(e,i,c=>e.update(d=>{d.tapAction=c})):m}
    ${"entityId"in i?st(e,"Target",i,c=>e.update(d=>{d.tapAction={type:i.type,...c}},"tap-entity"),"general-tap"):m}
    ${i.type==="callService"?Mx(e,i,(c,d)=>e.update(u=>{u.tapAction=c},d),"general-tap"):m}
    ${i.type==="openPage"?TT(e):m}`}var ST="#808080",Wb=[0,15,30,60,120];function jb(e){return e===0?"None":e%60===0?e===60?"Every hour":`Every ${e/60} hours`:e===1?"Every minute":`Every ${e} minutes`}function TT(e){let n=e.config;return Ix(e,n.openPageId,n.openPageName,(t,i)=>e.update(a=>{if(t===void 0){delete a.openPageId,delete a.openPageName;return}a.openPageId=t,i?a.openPageName=i:delete a.openPageName}))}function Ix(e,n,t,i){let a=n??"",r=e.pages.map(o=>[o.id,o.name||"Unnamed page"]);return a&&!e.pages.some(o=>o.id.toUpperCase()===a.toUpperCase())&&r.unshift([a,`${t||"Unknown page"} (not on the watch)`]),a||r.unshift(["","Choose a page\u2026"]),r.length<=1&&!a?h`<div class="hint keep">No pages reported yet. Open the watch app once so it can send its page list.</div>`:h`${Fe("Page",a,r,o=>{if(!o){i(void 0,void 0);return}i(o,e.pages.find(s=>s.id===o)?.name)})}
  ${a?m:h`<div class="hint keep">Without a page the tap falls back to the complication list.</div>`}`}var ET=[["toggle","Toggle"],["button","Button"]],RT=Ls.filter(([e])=>Lc.includes(e)),rd=82,AT=40,Hx="#0A84FF";function od(e){return e==="iphone"?["phoneCircle","phoneWide"]:["watchPill"]}function Xa(e){return e.deviceKind??"watch"}function Wp(e){let n=Ip(e);return n===void 0?e.title:`${e.title}: ${n}`}function Ip(e){return e.valueLabel??(e.kind==="toggle"?e.isOn?"On":"Off":void 0)}function sd(e,n){return Xa(e)==="iphone"||Qt(n)==="toggle"}function ld(e){return e.kind==="toggle"?e.isOn?"On":"Off":void 0}function qb(e,n){let{valid:t,rgb:i}=Op(e);if(!t)return"#FFFFFF";let a=i.slice(1),r=s=>parseInt(a.slice(s,s+2),16),o=s=>Math.round(s+(255-s)*n).toString(16).padStart(2,"0");return`#${o(r(0))}${o(r(2))}${o(r(4))}`.toUpperCase()}function FT(e,n){let t=n.tintColorHex??Hx,i="rgba(120,120,128,0.36)",a="1px solid rgba(255,255,255,0.12)";return e==="watchPill"?n.kind==="toggle"&&n.isOn?{background:t,border:"1px solid transparent",glyph:qb(t,.72),title:"",value:""}:n.kind==="button"?{background:`color-mix(in srgb, ${t} 30%, #2c2c2e)`,border:`1px solid color-mix(in srgb, ${t} 55%, transparent)`,glyph:qb(t,.72),title:"",value:""}:{background:i,border:a,glyph:"#E5E5EA",title:"",value:""}:n.kind==="toggle"&&n.isOn?{background:"#FFFFFF",border:"1px solid transparent",glyph:t,title:"#000000",value:"rgba(60,60,67,0.6)"}:{background:i,border:a,glyph:n.kind==="button"?t:"#FFFFFF",title:"#FFFFFF",value:"rgba(235,235,245,0.6)"}}function dd(e,n,t,i=rd){let a=e.resolveContext?.();if(a===void 0)return m;let r=Yr(n,a,e.config),o=FT(t,r),s=g=>Math.round(i*g),l=t==="phoneWide"&&i>=AT,c=t==="watchPill"?s(1.6):t==="phoneWide"?s(2.35):i,d=s(t==="watchPill"?.46:t==="phoneCircle"?.44:.5),u=e.icons.render(r.symbol||"questionmark",d,o.glyph),p=`width:${c}px;height:${i}px;box-sizing:border-box;border-radius:${Math.ceil(i/2)}px;display:flex;align-items:center;overflow:hidden;`+(l?`justify-content:flex-start;gap:${s(.14)}px;padding:0 ${s(.16)}px 0 ${s(.2)}px;`:"justify-content:center;")+`background:${o.background};border:${o.border};color:${o.glyph};`;return h`<span style=${p} data-shape=${t}>
      <span style=${`display:block;flex:none;height:${d}px;line-height:0`}>${u??m}</span>
      ${l?h`<span style="display:block;min-width:0;flex:1 1 auto">
            <span style=${`display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;overflow-wrap:anywhere;font-size:${s(.17)}px;font-weight:600;line-height:1.1;color:${o.title}`}>${r.title}</span>
            ${Ip(r)===void 0?m:h`<span style=${`display:block;font-size:${s(.15)}px;line-height:1.2;color:${o.value};overflow:hidden;text-overflow:ellipsis;white-space:nowrap`}>${Ip(r)}</span>`}
          </span>`:m}
    </span>`}function MT(e,n,t=rd){let i=od(Xa(e)).map(a=>dd(e,n,a,t));return h`<span style=${`display:inline-flex;align-items:center;gap:${Math.round(t*.15)}px;flex-wrap:wrap`}>${i}</span>`}function LT(e,n){let t=e.resolveContext?.();if(t===void 0)return m;let i=Yr(n,t,e.config),a=Xa(e)==="watch",r=ld(i);return h`<div class="field readout"><span>In Control Center</span>
    <span class="readout-v">${MT(e,n)}</span></div>
    ${r===void 0?m:h`<div class="field readout"><span>Reads</span><span class="readout-v">${r}${i.isOn?", so the tile is lit":", so the tile is dark"}</span></div>`}
    ${a?h`<div class="field readout"><span>Above the tiles</span><span class="readout-v">${Wp(i)}</span></div>`:m}
    ${i.status===void 0||!sd(e,n)?m:h`<div class="field readout"><span>On a press</span><span class="readout-v">${i.status}</span></div>`}`}function IT(e,n){return n===void 0?"Off":`${Qt(n)==="toggle"?"Toggle":"Button"} \xB7 ${Ze(Oe(n.title,ye(e)),32)}`}function HT(e,n){let t=e.control;if(t===void 0)return;let i=Lp(t.action);n(t);let a=Lp(t.action);a===void 0||a.entityId.trim()===""||i!==void 0&&i.entityId===a.entityId||(e.control=cb(t,a,i,e.name))}function _T(e,n){let t=(c,d)=>e.update(u=>{u.control&&c(u.control)},d?`control-${d}`:void 0),i=Qt(n),a=n.kind==="toggle"&&i==="button",r=n.valueLabel??n.state??n.title,o=n.coloring==="bands"?rt(e.resolve(r)??""):[],s=(c,d)=>t(u=>{let p={bands:u.bands,bandAboveColorHex:u.bandAboveColorHex??ve};c(p),u.bands=p.bands,p.bandAboveColorHex!==ve?u.bandAboveColorHex=p.bandAboveColorHex:delete u.bandAboveColorHex},d),l=(c,d)=>e.update(u=>{HT(u,c)},d?`control-${d}`:void 0);return h`
    ${LT(e,n)}
    <div class="hint keep">Shows the last synced value.</div>
    <div class="fgroup">
    ${ae("Kind",n.kind,ET,c=>t(d=>{d.kind=c}),{def:"toggle"})}
    <div class="hint">A toggle shows on or off and flips it. A button runs the action and shows nothing.</div>
    </div>
    <div class="fgroup">
    ${pd(e,n,l,"control",RT,"On press")}
    ${a?h`<div class="hint warn">${Zt(n.action)} cannot be switched off again, so this control acts as a button however the Kind row is set.</div>`:m}
    <div class="hint">A control is one press in Control Center, so it runs the same actions a tap does minus the ones that need the app open on a page.</div>
    </div>
    <div class="fgroup">
    ${he(e,n.title,c=>t(d=>{d.title=c},"title"),{showResolved:!0,label:"Title",key:"control-title"})}
    <div class="hint">The name on the tile. Reads a value, so it can show a sensor or a template.</div>
    ${xe("Value line",n.valueLabel!==void 0,c=>t(d=>{c?d.valueLabel=U("--"):delete d.valueLabel}))}
    ${n.valueLabel===void 0?m:he(e,n.valueLabel,c=>t(d=>{d.valueLabel=c},"valueline"),{showResolved:!0,label:"Value line",key:"control-valueline"})}
    <div class="hint">A second, smaller line under the title. A reading, a unit, or anything the title does not say.</div>
    </div>
    ${n.kind==="button"?m:h`
    <div class="fgroup">
    ${xe("State",n.state!==void 0,c=>t(d=>{c?d.state=U("on"):delete d.state}))}
    ${n.state===void 0?m:he(e,n.state,c=>t(d=>{d.state=c},"state"),{showResolved:!0,label:"State",key:"control-state"})}
    ${n.state===void 0?h`<div class="hint warn">A toggle with no state cannot tell on from off, so it always draws as off. Give it the entity whose state it follows.</div>`:h`<div class="hint">What the toggle reads to know if it is on. One of <code>on</code>, <code>open</code>, <code>unlocked</code>, <code>home</code>, <code>playing</code>, <code>heat</code> or <code>cool</code> counts as on.</div>`}
    </div>`}
    <div class="fgroup">
    ${Jl(e,n.symbol,c=>t(d=>{d.symbol=c},"symbol"),"control-symbol",void 0,"Symbol",!1)}
    ${i==="button"?h`<div class="hint">The icon on the tile.</div>`:h`
      ${Jl(e,n.symbolOff??"",c=>t(d=>{c?d.symbolOff=c:delete d.symbolOff},"symboloff"),"control-symbol-off",void 0,"Symbol when off",!1)}
      <div class="hint">The icon on the tile. Symbol when off is drawn while a toggle reads off. Leave it blank to keep the one symbol on both faces.</div>`}
    </div>
    <div class="fgroup">
    ${ae("Color",n.coloring,Zl,c=>t(d=>{d.coloring=c,c==="bands"&&d.bands.length===0&&(d.bands=xo(rt(e.resolve(r)??"")))}),{def:"uniform"})}
    <div class="hint">One colour paints the tint you pick. By value picks a colour from the reading, band by band.</div>
    ${Ce("Tint",n.tintColorHex,c=>t(d=>{c===void 0?delete d.tintColorHex:d.tintColorHex=c},"tint"),!0,null)}
    <div class="hint">Off uses the system colour. A toggle paints the tint only while it reads on. A button always paints it.</div>
    ${n.coloring==="bands"?h`
      ${vo({bands:n.bands,bandAboveColorHex:n.bandAboveColorHex??ve},n.tintColorHex??Hx,s,o.length===1?o[0]:void 0)}
      <div class="hint">The tint takes the colour of the band the reading falls in. Without a number to read, the flat colour above stands.</div>`:m}
    </div>
    ${sd(e,n)?h`<div class="fgroup">
    ${xe("Status text",n.status!==void 0,c=>t(d=>{c?d.status=U("Done"):delete d.status}))}
    ${n.status===void 0?m:he(e,n.status,c=>t(d=>{d.status=c},"status"),{showResolved:!0,label:"Status text",key:"control-status"})}
    <div class="hint">What Control Center flashes over the tile after a press. Off means no flash.</div>
    </div>`:h`<div class="fgroup">
    <div class="hint keep">The watch prints no status text for a button, only for a toggle. Switch the kind to Toggle to set one.</div>
    </div>`}`}function _x(e,n={}){if(!En(e.watchAppVersion))return m;let t=e.config.control;return t===void 0?m:Ie(e,"control","Control Center",_T(e,t),{color:le.tap,icon:"tap",summary:IT(e,t),...n.alwaysOpen===!0?{alwaysOpen:!0}:{}})}function Px(e,n){let t=e.config.values.findIndex(o=>o.id===n.id),i=`nv-${n.id}`,a=Vr(e.config,n.id),r={kind:{kind:"named",id:n.id}};return h`
    ${_e("Name",n.name,o=>e.update(s=>{s.values[t].name=o},`${i}-name`),{placeholder:"Name it, like Outside temp"})}
    ${he(e,n.value,o=>e.update(s=>{s.values[t].value=o},i),{allowNamed:!1,showResolved:!0,resolveAs:r,inline:!0,key:i})}
    <div class="field readout"><span>Used by</span><span class="readout-v">${a===0?"No layers yet":`${a} ${a===1?"layer":"layers"}`}</span></div>`}function Nx(){return{id:se(),name:"",value:U("")}}function Ge(e,n,t){let i=e.perFamily[n],a=i?.placements[t.payload.id];return i&&Object.keys(i.placements).length>0&&a?{frame:a.frame,isHidden:a.isHidden,size:a.size,fromPlacement:!0}:{frame:t.payload.frame,isHidden:t.payload.isHidden,fromPlacement:!1}}function ia(e,n){for(let t of e.elements){if(t.payload.id===n)return t;if(t.kind!=="list")continue;let i=t.payload.template.find(a=>a.payload.id===n);if(i)return i}}function Dx(e,n){return Aa(e,n)}function Pe(e,n,t,i,a=!1){let r=ia(e,t);if(!r)return;let o=e.perFamily[n];o||(o={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]},e.perFamily[n]=o);let s=Ge(e,n,r),c={...o.placements[t]??{frame:{...s.frame},isHidden:s.isHidden,...s.size!==void 0?{size:s.size}:{}},...i};a&&delete c.size,o.placements[t]=c}function oi(e,n,t,i,a){let r=n.payload.id,o=Ds(n)??a.min,s=Ge(e.config,t,n).size??o;return re(i,s,l=>e.update(c=>Pe(c,t,r,{size:Math.max(a.min,l??o)}),`el-${r}-size-${t}`),{step:a.step,min:a.min,unit:"pt",...a.def===void 0?{}:{def:a.def}})}function Ox(e,n,t){let i=e.perFamily[t]??(e.perFamily[t]=At()),a=Ft(e,n).filter(l=>!Re(e,l));if(a.length===0)return;let r=Cn(e,a.map(l=>l.payload.id),n),o=Ti(e,r,{nudge:!1}),s=e.perFamily[n];for(let l of o){let c=e.elements.find(f=>f.payload.id===l);if(!c)continue;let d=s?.placements[l],u=d?.size??Ds(c),p={frame:{...d?.frame??c.payload.frame},isHidden:d?.isHidden??!1,...u!==void 0?{size:u}:{}};for(let f of ue)f!==t&&delete e.perFamily[f]?.placements[l];i.placements[l]=Os(p,n,t,c.kind)}Fa(e,t)}function cd(e,n){return $m(e,n)}function PT(e){return e.length===0?"none":e.every(n=>n)?"all":e.every(n=>!n)?"none":"mixed"}function ta(e){return e.kind==="image"||e.kind==="tap"||e.kind==="timeline"||e.kind==="chartTimes"||e.kind==="chartDots"||e.kind==="chartGrid"||e.kind==="imageTime"||e.kind==="list"?void 0:e.payload.colorSlot.baseColorHex}function zx(e,n,t){let i=PT(t.map(l=>Ge(e,n,l).isHidden)),a=t.map(ta),r=t.length>0&&a.every(l=>l!==void 0),o=a[0],s=r&&o!==void 0&&a.every(l=>l!==void 0&&l.toUpperCase()===o.toUpperCase());return{hiddenHere:i,colourable:r,colour:s?o:void 0}}var ja=[["regular","Regular"],["medium","Medium"],["semibold","Semibold"],["bold","Bold"]],NT=[["leading","Left"],["center","Center"],["trailing","Right"]],wo=[["default","System"],["rounded","Rounded"],["monospaced","Mono"],["serif","Serif"]],ko=[["standard","Standard"],["condensed","Condensed"],["compressed","Compressed"],["expanded","Expanded"]],jp=h`<div class="hint">The watch draws the system face's own narrow and wide cuts.
  The preview stretches the letters instead, so judge the shapes on the watch, not here.</div>`,DT=[["off","Upright"],["on","Italic"]],qp=h`<div class="hint">The watch draws SF Rounded and New York.
  The preview has no web copy of either, so it shows the closest match: judge the shapes on the watch, not here.</div>`,OT=[["1","1"],["2","2"],["3","3"],["4","4"]];function Gx(e,n){let t=e.hass.states[n]?.attributes?.device_class;return typeof t=="string"?t:void 0}function Bx(e,n,t){let i=n.payload.id,a=Ks(e.config,i),r=a[0]?.ref??{entityId:"",displayName:"",domain:""},o=n.kind==="image"&&n.payload.source==="camera",s={...o?{domain:"camera"}:{},needed:Yb(n)};return h`
    ${st(e,o?"Camera":"Entity",r,l=>e.update(c=>Cm(c,i,l,Gx(e,l.entityId)),`${t}-entity`),`${t}-layer-entity`,s)}
    <div class="hint ${Yb(n)?"warn":""}">${BT(n,a)}</div>`}function Yb(e){return e.kind==="timeline"?e.payload.value.kind.kind!=="entityState":e.kind==="chart"?e.payload.historyMinutes>0&&e.payload.value.kind.kind!=="entityState":e.kind==="image"?e.payload.source!=="inline"&&e.payload.entity.entityId==="":!1}function zT(e){return e.kind==="tap"||e.kind==="text"||e.kind==="timeline"&&e.payload.aggregate!==void 0||e.kind==="chartTimes"||e.kind==="chartDots"||e.kind==="chartGrid"||e.kind==="imageTime"||e.kind==="list"?!1:!(e.kind==="image"&&e.payload.source==="inline")}function GT(e){if(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline")return e.payload.value;if(e.kind==="icon")return e.payload.symbol}function ud(e){return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function BT(e,n){let t=GT(e),i=t?.kind.kind,r=t!==void 0&&!("entityId"in t.kind)&&!(i==="literal"&&(e.kind==="text"||e.kind==="gauge"||e.kind==="chart"||e.kind==="timeline"))?i==="named"?" Its content comes through a shared value, so change that shared value to point it somewhere else.":i==="chartStat"?" Its number comes from a chart, so point the chart somewhere else to change it.":e.kind==="icon"&&i==="literal"?" The symbol above is a fixed name and stays as it is.":" The value above was written by hand and stays as it is.":"";if(n.length===0)return e.kind==="shape"?"A shape draws no value, so an entity reaches it only through a tap. Tick Tappable below, then choose the entity here.":`Nothing on this layer reads an entity yet. Choosing one points the layer, and its tap, at it.${r}`;let o=[],s=n.find(c=>c.where==="value"||c.where==="symbol"||c.where==="camera");s&&o.push(s.where==="symbol"?"the symbol":s.where==="camera"?"the picture":e.kind==="gauge"?"the reading":e.kind==="chart"?"the readings":e.kind==="timeline"?"the states":"the text"),n.some(c=>c.where==="tap")&&o.push("the tap");let l=n.filter(c=>c.where==="test").length;return l>0&&o.push(l===1?"1 state test":`${l} state tests`),`Used by ${ud(o)}.${r}`}function VT(e){return e.zoom<1?"Below 1x the picture pulls away from the frame and the spare edges are left empty. Pan still moves whatever does overflow.":e.contentMode==="fit"&&e.zoom===1?"The whole picture is inside the frame, so there is nothing to pan. Zoom in, or switch to Fill, to crop it first.":"Pan moves the frame over the picture: -1 is hard left (or top), 1 is hard right (or bottom). An edge the picture does not overflow cannot move."}function $o(e,n){if(e===n)return!0;if(typeof e!=typeof n||e===null||n===null||typeof e!="object"||Array.isArray(e)!==Array.isArray(n))return!1;if(Array.isArray(e))return e.length===n.length&&e.every((a,r)=>$o(a,n[r]));let t=Object.keys(e).filter(a=>e[a]!==void 0),i=Object.keys(n).filter(a=>n[a]!==void 0);return t.length!==i.length?!1:t.every(a=>$o(e[a],n[a]))}function Vl(e,n,t){return t.some(i=>!$o(e[i],n[i]))}function Ul(e,n,t){let i=e,a=n;for(let r of t)a[r]===void 0?delete i[r]:i[r]=structuredClone(a[r])}function Ie(e,n,t,i,a={}){let r=a.alwaysOpen===!0,o=r||e.openSections.has(n),s=e.helpSections.has(n),l=()=>e.toggleSection(n),c=()=>{!s&&!o&&e.toggleSection(n),e.toggleHelp(n)},d=s?`Hide the help in ${t}`:`Show help for ${t}`,u=h`<span class="swatch">${H(a.icon??"content")}</span>
      <span class="tt"><h4>${t}${Co(a.reset===void 0?void 0:{atDefault:!1,title:a.resetTitle??`Put ${t} back to its defaults`,reset:a.reset})}</h4>${a.summary?h`<span class="sum">${a.summary}</span>`:m}</span>
      <button type="button" class="sec-help ${s?"on":""}" aria-pressed=${s?"true":"false"} title=${d} aria-label=${d}
        @click=${p=>{p.stopPropagation(),c()}}>?</button>`;return h`<section class="sec" data-open=${o?"true":"false"} data-help=${s?"on":"off"} style=${a.color?`--c:${a.color}`:""}>
    ${r?h`<div class="sec-h pinned">${u}</div>`:h`<div class="sec-h" role="button" tabindex="0" aria-expanded=${o?"true":"false"} @click=${l}
          @keydown=${p=>{p.target===p.currentTarget&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),l())}}>
          ${u}
          <span class="chev">${H("chevron")}</span>
        </div>`}
    ${o?h`<div class="sec-b">${i}</div>`:m}
  </section>`}function UT(e){if(e.length===0)return"nothing";let n=t=>Number.isInteger(t)?String(t):String(Math.round(t*100)/100);return e.length<=12?e.map(n).join(" "):`${e.slice(0,6).map(n).join(" ")} \u2026 ${e.slice(-3).map(n).join(" ")}`}function KT(e){if(e<60)return`${Math.max(0,Math.round(e))}s`;let n=Math.round(e/60);if(n<90)return`${n}m`;let t=Math.floor(n/60),i=n%60;return i===0?`${t}h`:`${t}h ${i}m`}function WT(e,n){let t=ge[e==="inline"?"rectangular":e],i=n.height*t.height>n.width*t.width,a=Math.round((n.rotationDegrees%180+180)%180)===90;return i!==a}function jT(e,n,t){let i=WT(e,n),a=ge[e==="inline"?"rectangular":e],r=n.height*a.height>n.width*a.width;return h`<div class="grid2">
    ${ae("Direction",i?"vertical":"horizontal",[["horizontal","Horizontal"],["vertical","Vertical"]],o=>{t({rotationDegrees:o==="vertical"===r?0:90},"line-dir")},{titles:{horizontal:"Lying along the frame",vertical:"Standing up, as a divider"}})}
  </div>
  <div class="hint">Direction sets the frame's rotation. A line runs along the frame's long side, so
    for a thin divider make the frame long in one direction and Direction will follow it.</div>`}function qT(e){let n=e.filter(i=>i.state!=="unavailable"&&i.state!=="unknown");return n.length===0?!1:n.filter(i=>i.state.trim()!==""&&Number.isFinite(Number(i.state))).length*2>n.length}function YT(e,n,t=4){if(e.length===0)return"nothing";let i=[];for(let o=0;o<e.length;o++){let s=e[o],l=e[o+1]?.offsetSeconds??n,c=Math.max(0,l-s.offsetSeconds),d=i[i.length-1];d!==void 0&&d.state.trim().toLowerCase()===s.state.trim().toLowerCase()?d.seconds+=c:i.push({state:s.state,seconds:c})}let a=i.slice(-t),r=a.map(o=>`${o.state||"(blank)"} ${KT(o.seconds)}`).join(", ");return i.length>a.length?`\u2026 ${r}`:r}function aa(e,n=Mi){let t=n.find(s=>s.minutes===e);if(t)return t.label;let i=Math.floor(e/1440),a=Math.floor(e%1440/60),r=e%60,o=[];return i>0&&o.push(`${i}d`),a>0&&o.push(`${a}h`),(r>0||o.length===0)&&o.push(`${r}m`),`Last ${o.join(" ")}`}function XT(e,n,t){if(!e||n===void 0||!n.averaged)return;let i=t.replace(/^Last\s+/,""),a=/^\d/.test(i)?`all ${i}`:`the whole ${i}`;return`This span has ${n.readings} readings, more than ${wn}, so they are averaged into ${wn} even slots to cover ${a}.`}var Xl=new Set;function Hp(e,n,t=Mi){return Xl.has(e)||!t.some(i=>i.minutes===n)}function Sp(e,n,t,i,a=Mi){let r=Hp(e,n,a);return h`<label class="field">${Be("Span",{atDefault:n===t&&!r,title:`Back to ${aa(t,a)}`,reset:()=>{Xl.delete(e),i(t)}})}
      <select @change=${o=>{let s=o.target.value;s==="custom"?(Xl.add(e),Le(o.target)):(Xl.delete(e),i(Number(s)||ws))}}>
        ${a.map(({minutes:o,label:s})=>h`<option value=${String(o)} ?selected=${!r&&o===n}>${s}</option>`)}
        <option value="custom" ?selected=${r}>Custom…</option>
      </select></label>`}function Tp(e,n,t=!1){let i=t?dc:ks,a=Math.floor(i/1440),r=t?Hr:Mi,o=Math.floor(e/1440),s=Math.floor(e%1440/60),l=e%60,c=(d,u,p)=>n(Math.min(i,Math.max(1,Math.round(d)*1440+Math.round(u)*60+Math.round(p))));return h`<div class="grid3 span-parts">
      ${re("Days",o,d=>c(d??0,s,l),{step:1,min:0,max:a})}
      ${re("Hours",s,d=>c(o,d??0,l),{step:1,min:0,max:23})}
      ${re("Minutes",l,d=>c(o,s,d??0),{step:1,min:0,max:59})}
    </div>
    <div class="hint">${t?h`${aa(e,r)}, up to 366 days. Statistics rows are never
          purged, so the limit is about what fits on a complication rather than about what
          the recorder still holds.`:h`${aa(e,r)}, up to 7 days: the recorder keeps
          ten by default, and a longer span would quietly come back short.`}</div>`}function JT(e){if(e.historyMinutes<=0)return"";if(e.source!=="statistics")return` \xB7 ${aa(e.historyMinutes)}`;let n=is.find(([t])=>t===e.statPeriod)?.[1]??e.statPeriod;return` \xB7 ${aa(e.historyMinutes,Hr)} \xB7 per ${n.toLowerCase()}`}function Yp(e,n){let t=ye(e);switch(n.kind){case"text":{let i=n.payload.parts?.length??0;return _t(n.payload)?`Rich text, ${i} part${i===1?"":"s"}`:Ze(Oe(n.payload.value,t),48)}case"icon":return Ar(n.payload)?n.payload.path?"Custom SVG":"No drawing yet":Ze(Oe(n.payload.symbol,t),48);case"gauge":return Ze(Oe(n.payload.value,t),48);case"chart":return Ze(`${Oe(n.payload.value,t)}${JT(n.payload)}`,48);case"timeline":{let i=Hi(n.payload).length,a=i>1?`${i} entities, ${n.payload.aggregate?.combine==="all"?"all":"any"}`:Oe(n.payload.value,t);return Ze(`${a} \xB7 ${aa(Pt(n.payload))}`,48)}case"shape":return n.payload.kind==="roundedRectangle"?"Rounded rectangle":n.payload.kind;case"image":{if(n.payload.source==="inline"){let i=_i(n.payload);return i>0?`Uploaded picture \xB7 ${Hl(i)}`:"No picture yet"}return n.payload.entity.displayName||n.payload.entity.entityId||(n.payload.source==="camera"?"No camera yet":"No entity yet")}case"tap":return Zt(n.payload.action);case"list":return`${$c.find(([a])=>a===n.payload.source.kind)?.[1]??n.payload.source.kind} \xB7 ${nt(n.payload.rows)} cells`;case"chartTimes":{let i=e.config.elements.find(a=>a.payload.id===n.payload.chart);return i?.kind==="chart"||i?.kind==="timeline"?Ze(`Times of ${Oe(i.payload.value,t)}`,48):"No chart or timeline"}case"imageTime":{let i=e.config.elements.find(a=>a.payload.id===n.payload.image);return i?.kind==="image"?Ze(`Time of ${Te(i,t)}`,48):"No picture"}case"chartDots":case"chartGrid":{let i=e.config.elements.find(r=>r.payload.id===n.payload.chart),a=n.kind==="chartDots"?"Dots on":"Grid behind";return i?.kind==="chart"?Ze(`${a} ${Oe(i.payload.value,t)}`,48):"No chart"}}}function Ql(e){switch(e.kind){case"text":return`${e.payload.fontSize} pt ${e.payload.fontWeight.toLowerCase()} \xB7 ${qe(e.payload.colorSlot.baseColorHex)}`;case"icon":return`${e.payload.size} pt \xB7 ${qe(e.payload.colorSlot.baseColorHex)}`;case"gauge":{let n=e.payload,t=n.style==="dots"?`${n.bands.length>0&&n.coloring==="bands"?"banded":qe(n.colorSlot.baseColorHex)} dots`:`${n.lineWidth} pt line \xB7 ${n.coloring==="bands"&&n.bands.length>0?`${n.bands.length+1} colour bands`:qe(n.colorSlot.baseColorHex)}`;return`${n.style} \xB7 ${t}${n.thresholdValue===void 0?"":` \xB7 threshold ${n.thresholdValue}`}`}case"chart":return`${e.payload.style} \xB7 ${e.payload.scale==="auto"?"auto scale":`${e.payload.minValue} to ${e.payload.maxValue}`}`;case"timeline":{let n=e.payload;return`${n.bands.length===0?`one colour (${qe(n.otherColorHex)})`:`${n.bands.length} ${n.bands.length===1?"state":"states"} coloured`}${n.gap>0?` \xB7 ${n.gap} pt gap`:""} \xB7 corners ${n.cornerRadius} pt`}case"shape":return e.payload.kind==="line"?`${qe(e.payload.colorSlot.baseColorHex)} \xB7 ${e.payload.thickness} pt thick`:`${qe(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?` \xB7 ${e.payload.borderWidth} pt border`:""}`;case"image":return`${e.payload.contentMode==="fill"?"Fill the frame":"Fit inside"} \xB7 ${e.payload.zoom.toFixed(2)}x \xB7 corners ${e.payload.cornerRadius} pt`;case"tap":return;case"chartTimes":return`${e.payload.timeLabelCount<=0?"no":e.payload.timeLabelCount} times \xB7 ${e.payload.labelSize} pt \xB7 ${qe(e.payload.labelColorHex)}`;case"imageTime":return;case"list":return`${nt(e.payload.rows)} cells \xB7 gap ${Pi(e.payload.gap)} pt`;case"chartDots":{let n=e.payload;return`${n.dots==="all"?"all":"auto"} \xB7 ${n.size===void 0?"automatic size":`${n.size} pt`} \xB7 ${n.colorHex===void 0?"series colour":qe(n.colorHex)}`}case"chartGrid":{let n=e.payload;return`${n.lines} ${n.lines===1?"line":"lines"} \xB7 ${n.thickness} pt \xB7 ${qe(n.colorHex)}`}}}function po(e,n,t,i,a,r){let o=Math.round(t*1e3)/10,s=l=>i(l/100);return h`<label class="pf">
    <span class="pl" title=${`${n}. Drag left or right to change it.`}
      @pointerdown=${ad(o,s,{step:.5,min:a,max:r})}>${e}</span>
    <input type="number" step="0.5" min=${a} max=${r} .value=${String(o)} aria-label=${`${n} in percent`}
      data-scrub @pointerdown=${So(o,s,{step:.5,min:a,max:r})}
      @input=${ze(l=>{let c=Number(l);l.trim()!==""&&Number.isFinite(c)&&s(c)})} />
    <span class="unit" aria-hidden="true">%</span>
  </label>`}function ZT(e,n,t){let i=n.payload.id,a=`el-${i}`,r=Ge(e.config,t,n),o=r.frame,s=(d,u)=>e.update(p=>Pe(p,t,i,{frame:tl(o,d)}),`${a}-${u}-${t}`),l=!$o(o,br)||r.isHidden,c=n.payload.chartAnchor;if(n.kind==="chartDots"||n.kind==="chartGrid"){let d=e.config.elements.find(u=>u.payload.id===n.payload.chart);return Ie(e,"placement","Position",h`
      <div class="hint keep">${n.kind==="chartDots"?"Dots sit":"Grid lines sit"} on their chart, so they move,
        size and turn with it. To change where they are, change the chart.</div>
      ${d?h`<div class="field list-field"><span>Chart</span>
        <div class="chips"><button class="small" @click=${()=>e.selectLayer(d.payload.id)}>Select the chart</button></div>
      </div>`:m}
      ${xe("Hidden",r.isHidden,u=>e.update(p=>Pe(p,t,i,{isHidden:u})),!1)}`,{color:le.position,icon:"place",summary:`On the chart \xB7 ${ie(t)}`})}return c?.place==="through"?Ie(e,"placement","Position",h`
      <div class="hint keep">A line sits on its chart at the reading it follows, and runs the whole plot. To
        change where it is, change the reading below or the chart. Thickness and colour are in Look.</div>
      ${Zb(e,n,t)}
      ${o.rotationDegrees!==0?ln("Rotation",o.rotationDegrees,d=>s({rotationDegrees:d},"rot"),{min:-180,max:180,step:1,def:0,format:d=>`${Math.round(d)}\xB0`,unit:"\xB0",range:!1}):m}
      ${xe("Hidden",r.isHidden,d=>e.update(u=>Pe(u,t,i,{isHidden:d})),!1)}`,{color:le.position,icon:"place",summary:`On the chart \xB7 ${ie(t)}`}):Ie(e,"placement","Position",h`
    ${Zb(e,n,t)}
    ${c===void 0?h`
    <div class="fgroup">
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${po("X","Left",o.x,d=>s({x:d},"x"),-100,100)}
        ${po("Y","Top",o.y,d=>s({y:d},"y"),-100,100)}
      </div>
    </div>
    ${Jb(e,n,t,o,["across","down","both"])}
    </div>`:mn(c.at)?m:h`
    <div class="fgroup">
    <div class="field xy-field"><span>Position</span>
      <div class="xy">
        ${po("X","Left",o.x,d=>s({x:d},"x"),-100,100)}
      </div>
    </div>
    ${Jb(e,n,t,o,["across"])}
    </div>`}
    <div class="field xy-field"><span>Size</span>
      <div class="xy">
        ${po("W","Width",o.width,d=>s({width:d},"w"),4,200)}
        ${po("H","Height",o.height,d=>s({height:d},"h"),4,200)}
      </div>
    </div>
    ${ln("Rotation",o.rotationDegrees,d=>s({rotationDegrees:d},"rot"),{min:-180,max:180,step:1,def:0,format:d=>`${Math.round(d)}\xB0`,unit:"\xB0",range:!1})}
    ${xe("Hidden",r.isHidden,d=>e.update(u=>Pe(u,t,i,{isHidden:d})),!1)}
    <div class="hint">${c===void 0?"X, Y, W and H are":"W and H are"} a percent of the face, on the ${ie(t)} shape only. Drag a letter left or right to change its number. Arrow keys nudge 1 pt, shift for 10.${c===void 0?" Copy position and Paste position repeat a spot on another layer, on any shape.":""}</div>`,{color:le.position,icon:"place",summary:`${Math.round(o.width*100)}% wide \xB7 ${ie(t)}`,...l?{resetTitle:`Put this layer back to the middle of the ${ie(t)} face at half size, unrotated and shown`,reset:()=>e.update(d=>Pe(d,t,i,{frame:{...br},isHidden:!1}))}:{}})}var Xb={across:{label:"Center across",title:"Move this layer to the middle of the face, left to right"},down:{label:"Center up and down",title:"Move this layer to the middle of the face, top to bottom"},both:{label:"Center",title:"Move this layer to the middle of the face"}};function Jb(e,n,t,i,a){let r=n.payload.id,o=(d,u)=>e.update(p=>Pe(p,t,r,{frame:d}),`el-${r}-${u}-${t}`),s=e.copiedPosition,l=n.payload.chartAnchor!==void 0,c=s!==void 0&&s.family===t&&$o(s.frame,i);return h`<div class="field list-field"><span>Line up</span>
    <div class="chips">
      ${a.map(d=>h`<button class="small" title=${Xb[d].title}
        ?disabled=${Lg(i,d)}
        @click=${()=>o(ku(i,d),`center-${d}`)}>${Xb[d].label}</button>`)}
    </div>
  </div>
  ${l?m:h`<div class="field list-field"><span>Copy</span>
    <div class="chips">
      <button class="small" title="Copy this layer's X, Y, W, H and rotation, to paste onto another layer"
        @click=${()=>e.copyPosition({frame:{...i},family:t})}>${c?"Copied":"Copy position"}</button>
      <button class="small" ?disabled=${s===void 0||c}
        title=${s===void 0?"Copy a position from a layer first":s.family===t||t!=="rectangular"&&s.family!=="rectangular"?`Put this layer where the copied one sits on the ${ie(s.family)} face`:`Put this layer where the copied one sits on the ${ie(s.family)} face, scaled for this shape`}
        @click=${()=>s&&o(aS(s,t,n.kind),"paste")}>Paste position</button>
    </div>
  </div>`}`}function Zb(e,n,t){let i=n.payload.chartAnchor;if(i===void 0)return m;let a=n.payload.id,r=`el-${a}-anchor`,o=e.config.elements.filter(d=>d.kind==="chart"),s=(d,u)=>e.update(p=>{let f=p.elements.find(g=>g.payload.id===a);f?.payload.chartAnchor&&d(f.payload.chartAnchor)},u?`${r}-${u}`:void 0),l=ye(e),c=!o.some(d=>d.payload.id===i.layer);return h`
    <div class="fgroup">
    ${o.length<2?m:Fe("Follows",i.layer,o.map(d=>[d.payload.id,Te(d,l)]),d=>s(u=>{u.layer=d}))}
    ${Fe("Reading",i.at,qt,d=>e.update(u=>{let p=u.elements.find(g=>g.payload.id===a);if(!p?.payload.chartAnchor)return;p.payload.chartAnchor.at=d;let f=u.elements.find(g=>g.payload.id===i.layer);f?.kind==="chart"&&(d==="threshold"&&f.payload.thresholdValue===void 0&&(f.payload.thresholdValue=Vp(rt(e.resolve(f.payload.value)??"")),f.payload.drawsThreshold=!1),d==="now"&&f.payload.nowIndex===void 0&&(f.payload.nowIndex={kind:{kind:"time",timeField:"hour"}},f.payload.drawsNowLine=!1))}),{def:"highest"})}
    ${Vx(e,i,r)}
    ${i.place==="through"?m:Fe("Sits",i.place,os.filter(([d])=>d!=="through"),d=>s(u=>{u.place=d}),{def:"above"})}
    </div>
    <div class="grid2">
      ${i.dx?re("Nudge X",i.dx,d=>s(u=>{d?u.dx=d:delete u.dx},"dx"),{step:.5,def:0,unit:"pt"}):m}
      ${i.place==="through"&&!i.dy?m:re("Nudge Y",i.dy??0,d=>s(u=>{d?u.dy=d:delete u.dy},"dy"),{step:.5,def:0,unit:"pt"})}
    </div>
    ${i.place==="through"?m:h`
    <div class="field list-field"><span>Marker</span>
      <div class="chips">
        <button class="small" title="Stop following the chart and leave this layer where it is"
          @click=${()=>e.update(d=>{let u=d.elements.find(p=>p.payload.id===a);u&&delete u.payload.chartAnchor})}><span>Unpin</span></button>
        <span class="muted">Stops following the chart, so you can move it anywhere.</span>
        ${n.kind==="text"?h`<button class="small" title="Swap this text marker for an icon of the same shape, keeping where it sits"
              @click=${()=>e.update(d=>{im(d,a)})}><span>Use an icon</span></button>`:m}
      </div>
    </div>`}
    ${c?h`<div class="hint keep">The chart this followed is not in this document any more, so the layer
          draws where its own frame puts it. Pick another chart above${i.place==="through"?", or delete the line":", or unpin it"}.</div>`:i.place==="through"?m:h`<div class="hint">This layer follows that reading on the ${ie(t)} face and every
          other one: wherever the bar lands, it goes. It is held inside the plot, so a big glyph over a tall
          bar is pushed down rather than off the top, and the bars never give up height to make room. Nudge Y
          can still lift it past the top of the chart, as far as the edge of the face.</div>`}`}function Vx(e,n,t){let i=e.config.elements.find(l=>l.payload.id===n.layer);if(i?.kind!=="chart")return m;let a=i.payload,r=(l,c)=>e.update(d=>{let u=d.elements.find(p=>p.payload.id===n.layer);u?.kind==="chart"&&l(u.payload)},`${t}-${c}`),o=et(e.config,n.layer).filter(l=>l.payload.chartAnchor?.at===n.at).length,s=o>1?` ${o} layers follow this ${n.at==="now"?"reading":"threshold"}, and they all move with this number.`:"";if(n.at==="threshold"){let l=Vp(rt(e.resolve(a.value)??""));return h`
      <div class="grid2">
        ${re("Threshold at",a.thresholdValue??l,c=>r(d=>{d.thresholdValue=c??l,d.drawsThreshold=!1},"thval"),{def:l})}
      </div>
      <div class="hint">${a.scale==="fixed"?"A threshold outside the chart's Min and Max draws nothing: the plot keeps the range you asked for.":"The plot stretches to include the threshold, so a series that never reaches it still shows how far off it is."}${s}</div>`}return n.at==="now"?h`
      ${he(e,a.nowIndex??{kind:{kind:"time",timeField:"hour"}},l=>r(c=>{c.nowIndex=l,c.drawsNowLine=!1},"nowidx"),{showResolved:!0,label:"Now is reading",key:`${t}-nowindex`})}
      <div class="hint">Counted from 0, so Hour puts now on reading 14 at 2 pm, which is what a 24-reading
        price or forecast chart wants. Rounded, and clamped to the readings drawn.${s}</div>`:n.at==="zero"?h`<div class="hint">Drawn only while the plot runs from below zero to above it, like a
      temperature or a battery charging and discharging. On readings that stay on one side of zero, zero
      sits on the edge of the plot or outside it, and nothing draws.</div>`:m}function QT(e,n){if(n.kind==="tap")return m;if(Dx(e.config,n.payload.id))return m;let t=n.payload.id,i=ft(e.config,t)[0];return Ie(e,"tappable","Tap",HE(e,n,`el-${t}`),{color:le.tap,icon:"tap",summary:i?Zt(i.payload.action):"Not tappable",...i?{reset:()=>e.update(a=>Vs(a,t))}:{}})}function eE(e,n,t,i,a){return h`
    ${ln("Times",e.timeLabelCount,r=>n(o=>{o.timeLabelCount=Math.max(0,Math.min(Ii,Math.round(r)))},`${i}count`),{min:0,max:Ii,step:1,def:t.timeLabelCount,format:r=>r<=0?"None":String(Math.round(r)),range:!1})}
    ${e.timeLabelCount<=0?m:h`
      <div class="fgroup">
      <div class="grid2">
        ${re("Time size",e.labelSize,r=>n(o=>{o.labelSize=Math.min(Wn,Math.max(Kn,r??$t))},`${i}size`),{step:.5,min:Kn,max:Wn,def:t.labelSize,unit:"pt"})}
        ${Ce("Time colour",e.labelColorHex,r=>n(o=>{o.labelColorHex=r??Ct},`${i}colour`),!1,t.labelColorHex)}
      </div>
      ${e.labelsAbove===void 0?m:ae("Row",e.labelsAbove?"above":"below",[["below","Below"],["above","Above"]],r=>n(o=>{o.labelsAbove=r==="above"}),{def:t.labelsAbove===!0?"above":"below"})}
      </div>
      <div class="fgroup">
      ${ae("Clock",e.hourCycle,Mf,r=>n(o=>{o.hourCycle=r}),{titles:{auto:"Whatever clock the watch is set to"},def:t.hourCycle})}
      ${ae("Minutes",e.minutes,Lf,r=>n(o=>{o.minutes=r}),{titles:{auto:"Kept up to a three hour span, dropped past it"},def:t.minutes})}
      ${a}
      </div>`}`}var tE=[["number","Number"],["entity","Entity"]];function nE(e,n){return(n==="min"?e.minSource:e.maxSource)===void 0?"number":"entity"}function iE(e,n,t){let i=n==="min"?"minSource":"maxSource";t==="number"?delete e[i]:e[i]===void 0&&(e[i]={kind:{kind:"entityState",entityId:"",displayName:"",domain:""}})}function Ux(e,n,t,i,a,r="gauge"){let o=s=>{let l=s==="min",c=l?"Min":"Max",d=nE(n,s),u=l?n.minValue:n.maxValue,p=y=>a(v=>{l?v.minValue=y??0:v.maxValue=y??100},s),f={number:`${c} is a fixed number`,entity:`${c} reads a number from an entity`},g=h`<div class="gauge-end-head">
      ${Be(c,d==="number"?si(u,t[s],p):void 0)}
      <span class="seg" role="radiogroup" aria-label=${`${c} comes from`}>
        ${tE.map(([y,v])=>h`<button type="button" role="radio" aria-checked=${y===d?"true":"false"}
          class=${y===d?"on":""} title=${f[y]}
          @click=${()=>{y!==d&&a(k=>iE(k,s,y))}}>${v}</button>`)}
      </span>
    </div>`,b=l?n.minSource:n.maxSource;return d==="number"||b===void 0?h`<div class="field gauge-end">${g}${To(u,p,{ariaLabel:c})}</div>`:h`<div class="field gauge-end">${g}${he(e,b,y=>a(v=>{l?v.minSource=y:v.maxSource=y},`${s}src`),{showResolved:!0,noLabel:!0,label:c,key:`${i}-${s}source`})}</div>
      <div class="hint">If the entity has no number, the ${r} uses ${String(u)}.</div>`};return n.minSource===void 0&&n.maxSource===void 0?h`<div class="grid2 gauge-ends">${o("min")}${o("max")}</div>`:h`${o("min")}${o("max")}`}var Qb=["level"];function aE(e){let n=e.payload.level;return n===void 0?"Off":`${ls.find(([i])=>i===n.direction)?.[1]??"Up"}, ${n.minValue} to ${n.maxValue}`}function rE(e){return e.kind==="icon"?!0:e.kind==="shape"&&e.payload.kind!=="line"}function oE(e,n,t,i){let a=n.payload.level,r=(c,d)=>i(u=>{let p=u.payload;p.level!==void 0&&c(p.level)},d),o=zs(e.config,n),s=()=>ds(o?{kind:{kind:"entityState",...o}}:U("50")),l=n.kind==="icon"?"icon":"shape";return h`
    ${xe("Fill by value",a!==void 0,c=>i(d=>{let u=d.payload;c?u.level=s():delete u.level},"level-on"),!1)}
    ${a===void 0?h`<div class="hint">Draws the ${l} twice: all of it in a faint track colour, then as much of it as
          the reading fills, in its own colour. A battery icon that fills to 60%, or a tank that empties.</div>`:h`
        ${he(e,a.value,c=>r(d=>{d.value=c},"level-value"),{showResolved:!0,label:"Reading",key:`${t}-level-value`})}
        <div class="fgroup">
        ${Ux(e,a,{min:vr,max:wr},`${t}-level`,(c,d)=>r(c,d?`level-${d}`:"level-range"),"fill")}
        </div>
        <div class="fgroup">
        ${ae("Direction",a.direction,[...ls],c=>r(d=>{d.direction=c},"level-dir"),{titles:{up:"Fills from the bottom edge upward",down:"Fills from the top edge downward",left:"Fills from the right edge leftward",right:"Fills from the left edge rightward"},def:xr})}
        ${Ce("Track colour",a.trackColorHex,c=>r(d=>{c===void 0?delete d.trackColorHex:d.trackColorHex=c},"level-track"),!0,null)}
        <div class="hint">Off, the empty part takes the layer's own colour at a quarter strength.
          A tinted face keeps only how see-through a colour is, so a track at full strength reads
          there as the same colour as the fill.</div>
        </div>`}`}function sE(e,n,t){if(!cs(n))return m;let i=e.arc,a=e.countdown===!0,r=(o,s)=>t(l=>{l.arc!==void 0&&o(l.arc)},s);return h`
    <div class="fgroup">
      ${xe("Curve",i!==void 0,o=>t(s=>{o?s.arc={radius:kr}:delete s.arc},"arc"),!1,{disabled:a})}
      ${a?h`<div class="hint">A countdown ticks as one piece of system text, which cannot be bent around a circle. Turn the countdown off to curve this layer.</div>`:m}
      ${i===void 0||a?m:h`
        ${re("Radius",i.radius,o=>r(s=>{s.radius=Math.min(ps,Math.max(us,o??kr))},"arc-radius"),{step:.05,min:us,max:ps,unit:"of box",def:kr})}
        ${re("Position",i.angle??0,o=>r(s=>{let l=o??0;l===0?delete s.angle:s.angle=l},"arc-angle"),{step:5,min:-360,max:360,unit:"\xB0",def:0})}
        ${re("Spacing",i.spacing??0,o=>r(s=>{let l=Cr(o??0);l===0?delete s.spacing:s.spacing=l},"arc-spacing"),{step:.5,min:Zd,max:Qd,unit:"pt",def:0})}
        ${re("Spread",Math.abs(i.sweep??Qe),o=>r(s=>{let l=(s.sweep??Qe)<0?-1:1,c=$r(l*Math.abs(o??Qe));c===Qe?delete s.sweep:s.sweep=c},"arc-sweep"),{step:5,min:Xd,max:Jd,unit:"\xB0",def:Qe})}
        ${ae("Reads",dE(i),lE,o=>r(s=>{let l=Math.abs(s.sweep??Qe),c=o==="bottom"?-l:l;c===Qe?delete s.sweep:s.sweep=c,o==="bottom"?s.flip=!0:delete s.flip,o==="bottom"&&(s.angle??0)===0&&(s.angle=180),o==="top"&&s.angle===180&&delete s.angle},"arc-reads"),{def:"top"})}
        <div class="hint">Drag the box to grow the circle: a radius of ${kr} fills it,
          and a bigger one bends the text less without moving it. Position is where the
          middle of the text sits, 0 at the top and 90 on the right. Spread is how much of the circle the text may use; longer text shrinks
          to half size, then runs past the ends. Spacing adds room between the letters.</div>`}
    </div>`}var lE=[["top","Over the top"],["bottom","Along the bottom"]];function dE(e){let n=(e.sweep??Qe)<0,t=e.flip===!0;return!n&&!t?"top":n&&t?"bottom":"mixed"}function cE(e,n,t,i){let a=n.coloring??"uniform",r=n.highlight??"none",o=(d,u)=>t(p=>{let f={bands:p.bands??[],bandAboveColorHex:p.bandAboveColorHex??ve};d(f),f.bands.length>0?p.bands=f.bands:delete p.bands,f.bandAboveColorHex!==ve?p.bandAboveColorHex=f.bandAboveColorHex:delete p.bandAboveColorHex},u),s=(d,u,p)=>t(f=>{p===void 0||p===u?delete f[d]:f[d]=p},d),l=r==="highest"?"The highest number takes its own colour":r==="lowest"?"The lowest number takes its own colour":"The highest and lowest numbers take their own colours",c=a==="bands"?rt(e.resolve(n.value)??""):[];return h`
    <div class="fgroup">
    ${ae("Colour",a,Zl,d=>t(u=>{if(d==="uniform"){delete u.coloring;return}u.coloring=d,(u.bands?.length??0)===0&&(u.bands=xo(rt(e.resolve(u.value)??"")))}),{def:"uniform"})}
    ${i}
    ${a==="bands"?h`
      <div class="hint">Each number in the text takes the colour of the band it falls in, and other text keeps the layer colour.</div>
      ${vo({bands:n.bands??[],bandAboveColorHex:n.bandAboveColorHex??ve},n.colorSlot.baseColorHex,o,c.length===1?c[0]:void 0)}`:m}
    </div>
    <div class="fgroup">
    ${ae("Highlight",r,IS,d=>t(u=>{d==="none"?delete u.highlight:u.highlight=d}),{def:"none"})}
    ${r==="none"?m:h`
      <div class="grid2">
        ${r==="lowest"?m:Ce("Highest colour",n.highColorHex??wt,d=>s("highColorHex",wt,d),!1,wt)}
        ${r==="highest"?m:Ce("Lowest colour",n.lowColorHex??kt,d=>s("lowColorHex",kt,d),!1,kt)}
      </div>
      ${a==="bands"?m:h`<div class="hint">${l}, and other text keeps the layer colour.</div>`}`}
    </div>`}var go=new Map,ho=new Map,Ln=new Map,fo=new Map,Ep=4,Rp=40,uE=[["layer","Layer"],["pick","Pick"],["bands","By value"]],pE=[["plain","Plain"],["rich","Rich"]],hE={plain:"One line: typed words, a live value or a template",rich:"Parts, each with its own colour, weight and size"};function Xp(e,n,t,i){let a=t!==void 0&&e.canCountDown(t);return!n&&!a?m:h`${xe("Count down",n,i)}
    <div class="hint">Ticks down to the value's time on the watch, once a second: an active timer's finish, or any future timestamp. A paused timer shows its remaining time.</div>
    ${n&&!a?h`<div class="hint warn">This value is not a timer or a future time, so nothing counts down. The watch shows it as plain text.</div>`:m}`}function fE(e){return e.countdown===!0?"countdown":_t(e)?"rich":"plain"}function mE(e){return(e.match(/ +|[^ ]+/g)??[]).map(n=>({text:n,space:n.startsWith(" ")}))}function gE(e,n){let t=Fi(e);return t!==void 0?{kind:"text",label:t}:e.kind.kind==="jinja"?{kind:"template",label:Ze(e.kind.value,40)||"template"}:{kind:"value",label:Ao(e,n)}}function Kx(e,n,t){let i=Fi(e.value),a=i===void 0?Ze(Ao(e.value,t),28):i.trim()===""?i===""?"empty":"spaces":`"${Ze(i,24)}"`;return`Part ${n+1}: ${a}`}function yE(e,n,t){let i=[["","Whole text"],...e.map((a,r)=>[a.id,Kx(a,r,t)])];return n!==void 0&&!e.some(a=>a.id===n)&&i.push([n,"A part that is gone"]),i}function _p(e){return e.coloring==="bands"?"bands":e.colorHex===void 0?"layer":"pick"}function bE(e,n){if(_p(e)==="bands"&&(e.bands?.length??0)>0){let t=[...vn({bands:e.bands}).map(r=>r.colorHex),e.bandAboveColorHex??ve],i=100/t.length,a=r=>`${Math.round(r*10)/10}%`;return`conic-gradient(${t.map((r,o)=>`${r} ${a(o*i)} ${a((o+1)*i)}`).join(", ")})`}return e.colorHex??n}function ex(e){let n=r=>r.length===1?`Part ${r[0].index+1}`:`Parts ${ud(r.map(o=>String(o.index+1)))}`,t=e.filter(r=>r.reason==="kind"),i=e.filter(r=>r.reason==="format"),a=[];return t.length>0&&a.push(`${n(t)} ${t.length===1?"shows":"show"} a value a template cannot read, such as data age or a chart's number.`),i.length>0&&a.push(`${n(i)} ${i.length===1?"uses":"use"} a relative time or duration format, which a template cannot print.`),`Rich text stays on, because the parts cannot join into one line. ${a.join(" ")} Change or remove ${e.length===1?"that part":"those parts"} first.`}var xE={fontSize:"font size",fontWeight:"weight",color:"colour",bands:"colour bands"};function vE(e){return e.joined?e.template?"Rich text is off. The parts joined into one template, so the live values still update.":"Rich text is off. The parts joined into one line of text.":e.moved.length===0?"Rich text is off.":`Rich text is off. The part's ${ud(e.moved.map(n=>xE[n]))} moved into Look.`}function wE(e,n,t,i,a){let r=n.payload,o=r.id,s=fE(r),l=(r.parts?.length??0)>0,c=Hc(e.config,r.value),d=Ln.get(o),u=d&&d.rich===l?d:void 0,p=s==="rich"&&(r.parts?.length??0)>=2?ho.get(o):void 0,f=(y,v)=>{let k=!(r.parts??[]).every(I=>I.value.kind.kind==="literal"),S=Il(structuredClone(r),e.config.values);if(ho.delete(o),!S.ok){Ln.set(o,{text:ex(S.blocked),rich:!0,warn:!0}),Le(v);return}Ln.set(o,{text:vE(S.joined?{joined:!0,template:k}:S),rich:!1}),i(I=>{Il(I,e.config.values),y==="countdown"&&(I.countdown=!0)})},g=(y,v)=>{if(ho.delete(o),s==="rich"){let k=y==="countdown"?"countdown":"plain",S=r.parts??[];if(S.length<2){f(k,v);return}let I=yp(S,e.config.values);I.ok?(Ln.delete(o),ho.set(o,k)):Ln.set(o,{text:ex(I.blocked),rich:!0,warn:!0}),Le(v);return}if(y==="rich"){let k=r.parts?.[0]?.id??se();go.set(o,k),Ln.delete(o),i(S=>{delete S.countdown,Sb(S,k)});return}Ln.delete(o),i(k=>{if(y==="countdown"){k.countdown=!0;return}(k.parts?.length??0)>0&&Il(k,e.config.values),delete k.countdown})},b=p==="countdown"?"Switch to Countdown?":"Switch to Plain?";return h`
    ${ae("Type",s==="rich"?"rich":"plain",pE,g,{titles:hE})}
    <div class="hint">Plain shows one line: typed words, a live value or a template. Rich splits the text into parts, and each part has its own colour, weight and size.</div>
    ${p===void 0?m:h`<div class="rich-confirm" role="alertdialog" aria-label=${b}>
        <b>${b}</b>
        <div>The parts join into one line, so every word and value stays. The part styles go away. Undo brings them back.${r.rules.some(y=>y.partId!==void 0)?" States that change one part will change the whole text.":""}</div>
        <div class="acts">
          <button class="small primary" @click=${y=>f(p,y.currentTarget)}>Switch</button>
          <button class="small" @click=${y=>{ho.delete(o),Le(y.currentTarget)}}>Keep Rich</button>
        </div>
      </div>`}
    ${u?h`<div class=${u.warn?"hint warn":"rich-note"}>${u.text}</div>`:m}
    ${s==="rich"?kE(e,n,t,i,a):h`
        ${Bx(e,n,a)}
        ${he(e,r.value,y=>i(v=>{v.value=y},"value"),{showResolved:!0,label:s==="countdown"?"Until":"Text",key:`${a}-value`})}
        ${Xp(e,s==="countdown",r.value,y=>g(y?"countdown":"plain",null))}
        ${c?h`<div class="hint keep">Prints a number from the chart <button type="button" class="link" @click=${()=>e.selectLayer(c.payload.id)}>${Te(c,ye(e))}</button>. It stays in the chart's group and moves with it.</div>`:m}`}`}function kE(e,n,t,i,a){let r=n.payload,o=r.parts??[],s=r.id,l=ye(e),c=Math.max(0,o.findIndex(D=>D.id===go.get(s))),d=o[c],u=o.length,p=r.colorSlot.baseColorHex,f=Ge(e.config,t,n).size??r.fontSize,g=(D,W)=>{Ln.delete(s),i(w=>{D(w),vf(w)},W)},b=(D,W)=>g(w=>{let $=w.parts?.find(P=>P.id===d.id);$&&D($)},W?`part-${d.id}-${W}`:void 0),y=(D,W)=>{go.set(s,D),Ln.delete(s),Le(W)},v=(D,W)=>{let w=se();go.set(s,w),g($=>{($.parts??=[]).push({id:w,value:D})}),xx(W,Ro(`${a}-part-${w}`),!0)},k=D=>g(W=>{W.parts&&Ya(W.parts,c,D)}),S=()=>{let D=o[c+1]??o[c-1];D&&go.set(s,D.id),g(W=>{W.parts=(W.parts??[]).filter(w=>w.id!==d.id)})},I=o.map((D,W)=>{let w=gE(D.value,l),$=D.id===d.id,P=_p(D),N=w.kind==="value"?e.resolve(D.value):void 0,O=D.fontWeight===void 0?void 0:ja.find(([q])=>q===D.fontWeight)?.[1];return h`<button type="button" role="option" aria-selected=${$?"true":"false"} class="part-chip ${w.kind} ${$?"on":""}"
      aria-label=${Kx(D,W,l)} @click=${q=>y(D.id,q.currentTarget)}>
      <span class="part-dot" style=${`background:${bE(D,p)}`}
        title=${P==="bands"?"By value, with its own bands":P==="pick"?"Its own colour":"The layer colour"}></span>
      ${w.kind==="text"?h`<span class="part-txt">${w.label===""?h`<span class="part-empty">empty</span>`:mE(w.label).map(q=>q.space?h`<span class="part-sp">${"\xB7".repeat(q.text.length)}</span>`:q.text)}</span>`:h`<span class="part-txt">${w.label}</span>`}
      ${N===void 0?m:h`<span class="part-now">${N}</span>`}
      ${O===void 0?m:h`<span class="part-flag" title="Its own weight">${O}</span>`}
      ${D.fontSize===void 0?m:h`<span class="part-flag" title="Its own font size">${D.fontSize} pt</span>`}
    </button>`}),_=r.rules.some(D=>D.partId===d.id),E=d.value.kind.kind==="literal",z=_p(d),C=d.fontSize!==void 0,M=ja.find(([D])=>D===r.fontWeight)?.[1]??r.fontWeight,K=wo.find(([D])=>D===(r.fontDesign??"default"))?.[1]??"System",Y=ko.find(([D])=>D===(r.fontWidth??"standard"))?.[1]??"Standard",J=D=>{D>=Ep&&D<=Rp&&b(W=>{W.fontSize=D},"size")},L=z==="bands"?rt(e.resolve(d.value)??""):[],X={layer:"Use the layer colour",...E&&z!=="bands"?{bands:"By value needs a live value"}:{}},ne=(D,W)=>b(w=>{let $={bands:w.bands??[],bandAboveColorHex:w.bandAboveColorHex??ve};D($),$.bands.length>0?w.bands=$.bands:delete w.bands,$.bandAboveColorHex!==ve?w.bandAboveColorHex=$.bandAboveColorHex:delete w.bandAboveColorHex},W);return h`<div class="rich-parts">
    <div class="field parts-field"><span>Parts</span>
      <div class="part-chips" role="listbox" aria-label="Parts">${I}</div>
      <div class="part-adds">
        <button type="button" class="small" title="Add a part of typed words"
          @click=${D=>v(U(""),D.currentTarget)}>${H("text")}<span>Add text</span></button>
        <button type="button" class="small" title="Add a part that shows a live value"
          @click=${D=>v({kind:{kind:"entityState",entityId:"",displayName:"",domain:""}},D.currentTarget)}>${H("braces")}<span>Add value</span></button>
      </div>
    </div>
    <div class="part-editor">
      <div class="part-head">
        <span class="part-title"><b>Part ${c+1}</b> of ${u} · ${E?"Text":"Value"}</span>
        <span class="spacer"></span>
        <button type="button" class="icon" title="Move left" aria-label="Move left" ?disabled=${c===0} @click=${()=>k(c-1)}>${H("left")}</button>
        <button type="button" class="icon" title="Move right" aria-label="Move right" ?disabled=${c===u-1} @click=${()=>k(c+1)}>${H("right")}</button>
        <button type="button" class="icon danger" aria-label="Remove this part" ?disabled=${u===1||_}
          title=${u===1?"A rich text layer keeps at least one part":_?"A state changes this part":"Remove this part"}
          @click=${S}>${H("delete")}</button>
      </div>
      ${_&&u>1?h`<div class="hint keep">A state changes this part. Change or delete that state first.</div>`:m}
      ${he(e,d.value,D=>b(W=>{W.value=D},"value"),{showResolved:!0,label:E?"Text":"Shows",key:`${a}-part-${d.id}`})}
      ${E?h`<div class="hint">Spaces count, and show as dots in the parts list. Type one at the start or end when this part needs a gap.</div>`:m}
      ${ae("Colour",z,uE,D=>b(W=>{if(D==="layer"){delete W.colorHex,delete W.coloring;return}if(D==="pick"){delete W.coloring,W.colorHex=Gp(p,"#FFFFFF")?"#64D2FF":p;return}delete W.colorHex,W.coloring="bands",(W.bands?.length??0)===0&&(W.bands=xo(rt(e.resolve(W.value)??"")))}),{def:"layer",titles:X,...E&&z!=="bands"?{disabled:{bands:!0}}:{}})}
      ${z==="pick"?Ce("Part colour",d.colorHex,D=>b(W=>{W.colorHex=D??p},"color")):m}
      ${z==="bands"?h`
        ${vo({bands:d.bands??[],bandAboveColorHex:d.bandAboveColorHex??ve},d.colorHex??p,ne,L.length===1?L[0]:void 0)}
        <div class="hint">These bands belong to this part. Another value in the same layer keeps its own.</div>`:m}
      <div class="field seg-field">${Be("Weight",d.fontWeight===void 0?void 0:{atDefault:!1,title:`Back to the layer weight (${M})`,reset:()=>b(D=>{delete D.fontWeight})})}
        ${ea("Weight",d.fontWeight,ja,D=>b(W=>{W.fontWeight=D}),{inherited:r.fontWeight})}
      </div>
      <div class="field seg-field">${Be("Typeface",d.fontDesign===void 0?void 0:{atDefault:!1,title:`Back to the layer typeface (${K})`,reset:()=>b(D=>{delete D.fontDesign})})}
        ${ea("Typeface",d.fontDesign,wo,D=>b(W=>{W.fontDesign=D}),{inherited:r.fontDesign??"default"})}
      </div>
      ${d.fontDesign==="rounded"||d.fontDesign==="serif"?qp:m}
      <div class="field seg-field">${Be("Width",d.fontWidth===void 0?void 0:{atDefault:!1,title:`Back to the layer width (${Y})`,reset:()=>b(D=>{delete D.fontWidth})})}
        ${ea("Width",d.fontWidth,ko,D=>b(W=>{W.fontWidth=D}),{inherited:r.fontWidth??"standard"})}
      </div>
      ${d.fontWidth!==void 0&&d.fontWidth!=="standard"?jp:m}
      <div class="field seg-field">${Be("Italic",d.italic===void 0?void 0:{atDefault:!1,title:`Back to the layer slant (${r.italic===!0?"italic":"upright"})`,reset:()=>b(D=>{delete D.italic})})}
        ${ea("Italic",d.italic===void 0?void 0:d.italic?"on":"off",DT,D=>b(W=>{W.italic=D==="on"}),{inherited:r.italic===!0?"on":"off"})}
      </div>
      <label class="field num part-size">${Be("Font size",C?{atDefault:!1,title:`Back to the layer size (${f} pt)`,reset:()=>b(D=>{delete D.fontSize})}:void 0,ad(d.fontSize??f,J,{step:1,min:Ep,max:Rp}))}
        ${To(d.fontSize,D=>{D===void 0?b(W=>{delete W.fontSize},"size"):J(D)},{step:1,min:Ep,max:Rp,optional:!0,unit:"pt",placeholder:String(f),ariaLabel:C?"Part font size":`Part font size, ${f} pt from the layer`,...C?{}:{lead:H("link")}})}
      </label>
    </div>
  </div>`}function Wx(e,n,t,i={}){let a=n.payload.id,r=`el-${a}`,o=(w,$)=>e.update(P=>{let N=ia(P,a);if(!N)return;w(N);let O=Dx(P,a);O&&ra(O.payload)},$?`${r}-${$}`:void 0),s=Ge(e.config,t,n),l=s.frame,c=(w,$)=>e.update(P=>Pe(P,t,a,{frame:tl(l,w)}),`${r}-${$}-${t}`),d=De(n.kind).payload,u=d.colorSlot?.baseColorHex??"#FFFFFF",p=w=>d[w],f=!1,g=w=>ta(n)===void 0?m:Ce(w,ta(n),$=>o(P=>{ta(P)!==void 0&&(P.payload.colorSlot.baseColorHex=$??"#FFFFFF")},"color"),!1,u),b,y={},v=[],k,S;switch(n.kind){case"text":{let w=($,P)=>o(N=>$(N.payload),P);k=wE(e,n,t,w,r),f=!n.payload.countdown&&!_t(n.payload),S=h`
        <div class="fgroup">
        ${oi(e,n,t,"Font size",{step:1,min:4,def:p("fontSize")})}
        ${ae("Weight",n.payload.fontWeight,ja,$=>o(P=>{P.payload.fontWeight=$}),{def:d.fontWeight})}
        ${Fp({label:"Align",value:n.payload.alignment??"center",options:NT,def:"center",set:$=>o(P=>{let N=P.payload;$==="center"?delete N.alignment:N.alignment=$})},{label:"Lines",value:String(n.payload.lineLimit??1),options:OT,def:"1",set:$=>o(P=>{let N=P.payload;$==="1"?delete N.lineLimit:N.lineLimit=Number($)})})}
        ${ae("Typeface",n.payload.fontDesign??"default",wo,$=>o(P=>{let N=P.payload;$==="default"?delete N.fontDesign:N.fontDesign=$}),{def:"default"})}
        ${n.payload.fontDesign==="rounded"||n.payload.fontDesign==="serif"?qp:m}
        ${ae("Width",n.payload.fontWidth??"standard",ko,$=>o(P=>{let N=P.payload;$==="standard"?delete N.fontWidth:N.fontWidth=$}),{def:"standard"})}
        ${n.payload.fontWidth!==void 0&&n.payload.fontWidth!=="standard"?jp:m}
        ${xe("Italic",n.payload.italic===!0,$=>o(P=>{let N=P.payload;$?N.italic=!0:delete N.italic}),d.italic===!0)}
        ${xe("Mono digits",n.payload.monospacedDigits===!0,$=>o(P=>{let N=P.payload;$?N.monospacedDigits=!0:delete N.monospacedDigits}),d.monospacedDigits===!0)}
        ${n.payload.monospacedDigits?h`<div class="hint">Digits take the same width, so a number that ticks does not shuffle what sits beside it.</div>`:m}
        ${ln("Shrink to fit",n.payload.minimumScale??St,$=>o(P=>{let N=P.payload,O=mr($);O===St?delete N.minimumScale:N.minimumScale=O},"minscale"),{min:St,max:1,step:.05,def:St,format:$=>`${Math.round($*100)}%`})}
        <div class="hint">How small the text may go to fit its box before it is cut off with an ellipsis.
          100% never shrinks.</div>
        </div>
        ${sE(n.payload,t,w)}
        ${f?cE(e,n.payload,w,g("Main colour")):m}`;break}case"icon":{let w=Ar(n.payload)?"svg":"symbol";k=h`
        ${ae("Drawing",w,[["symbol","Symbol"],["svg","Custom SVG"]],$=>o(P=>{kS(P.payload,$)},"icon-drawing"),{titles:{symbol:"An SF Symbol or a Material Design icon, by name",svg:"An SVG path you paste yourself"},def:"symbol"})}
        ${w==="svg"?fx(n.payload,($,P)=>o(N=>$(N.payload),P)):h`
            ${he(e,n.payload.symbol,$=>o(P=>{P.payload.symbol=$},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${r}-symbol`,setSymbolPath:$=>o(P=>{let N=P.payload;$?N.path=$:delete N.path,delete N.viewBox},"symbol")})}
            <div class="hint">An entity source draws that entity's own icon instead. A Material Design icon travels with the document, so a rule that swaps the icon goes back to SF Symbols.</div>`}`,S=oi(e,n,t,"Icon size",{step:1,min:4,def:p("size")});break}case"gauge":{let w=n.payload,$=(N,O)=>o(q=>N(q.payload),O),P=w.style==="dots";k=h`
        ${he(e,w.value,N=>$(O=>{O.value=N},"value"),{showResolved:!0,label:"Reading",key:`${r}-value`})}
        ${P?h`
            ${he(e,w.total??Gb(w),N=>$(O=>{O.total=N},"total"),{showResolved:!0,label:"Total",key:`${r}-total`})}
            <div class="hint">How many dots to draw. Left as it is, a count of the same
              entities without the filter, so "3 of 8 lights on" is one reading and one
              total over one scope. At most ${xs} dots are drawn.</div>`:h`<div class="fgroup">${Ux(e,w,{min:d.minValue,max:d.maxValue},r,$)}</div>`}`,f=!0,S=h`
        <div class="grid2">
          ${ae("Style",w.style,VS,N=>$(O=>{N==="dots"&&O.total===void 0&&(O.total=Gb(O)),N!=="dots"&&delete O.total,N==="needle"&&O.style!=="needle"&&O.lineWidth===d.lineWidth&&(O.lineWidth=zb),N!=="needle"&&O.style==="needle"&&O.lineWidth===zb&&(O.lineWidth=d.lineWidth),O.style=N}),{titles:US,def:d.style})}
          ${P?m:oi(e,n,t,"Line width",{step:.5,min:.5,def:p("lineWidth")})}
        </div>
        <div class="fgroup">
        ${Ce(P?"Empty dot colour":"Track colour",w.trackColorHex,N=>$(O=>{O.trackColorHex=N??"#FFFFFF40"},"track"),!1,d.trackColorHex)}
        ${ae("Colour",w.coloring,Zl,N=>$(O=>{O.coloring=N,N==="bands"&&O.bands.length===0&&(O.bands=xo([O.minValue,O.maxValue]))}),{def:d.coloring})}
        ${g("Main colour")}
        ${w.coloring==="bands"?m:ql("Gradient",w.fill,N=>$(O=>{if(N===void 0){delete O.fill;return}O.fill=N,O.colorSlot.baseColorHex=Yt(N,0)},"fill"),()=>({kind:"linear",stops:[{at:0,colorHex:w.colorSlot.baseColorHex},{at:1,colorHex:w.colorSlot.baseColorHex}]}))}
        ${w.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. The
            gauge takes the colour of the row its reading falls in, and a reading past the
            last row takes the colour underneath.</div>
          ${vo(w,w.colorSlot.baseColorHex,$,rt(e.resolve(w.value)??"")[0])}`:m}
        </div>
        ${RE(w,$)}
        ${P?m:h`
          <div class="fgroup">
          <div class="grid2">
            ${re("Threshold",w.thresholdValue,N=>$(O=>{N===void 0?delete O.thresholdValue:O.thresholdValue=N},"thr"),{optional:!0,def:null})}
            ${w.thresholdValue===void 0?m:Ce("Threshold colour",w.thresholdColorHex,N=>$(O=>{O.thresholdColorHex=N??ya},"thrcol"),!1,ya)}
          </div>
          <div class="hint">A short tick on the scale at that value, so the fill reads
            against a target instead of on its own. A value outside Min to Max draws
            nothing. Leave it empty for no mark.</div>
          </div>`}`;break}case"chart":{let w=n.payload,$=(R,V)=>o($e=>R($e.payload),V),P=d.historyMinutes,N=d.historyPoints,O=w.historyMinutes>0,q=O&&w.source==="statistics",j=O&&!q,ee=O?q?"statistics":"history":"value",B=q?Hr:Mi,ce=Xt(w)??Jt(w),pe=w.value.kind.kind==="entityState",Se=ce===void 0?void 0:e.historySeries(ce),Ne=O&&pe?Se??"":e.resolve(w.value)??"",ke=w.historyPoints<1,pi=j&&pe&&ce!==void 0?e.historyReadings?.(ce):void 0,kh=XT(ke,pi,aa(w.historyMinutes)),$h=Hp(a,w.historyMinutes,B),vd=O&&pe?fu(Ne):{values:rt(Ne),holes:[]},la=vd.values,Ch=R=>w.limit>0&&R.length>w.limit?w.takeFromEnd?R.slice(R.length-w.limit):R.slice(0,w.limit):R,qv=Ch(la),Gt=yu(qv,It(w.smoothing),vd.holes.length>0?Ch(vd.holes):[]),Yv=!O&&pe&&la.length===1,wd=e.config.elements.filter(R=>R.kind==="chart"&&R.payload.id!==a),Sh=ye(e),No=w.scaleFrom!==void 0&&wd.some(R=>R.payload.id===w.scaleFrom);k=h`
        ${he(e,w.value,R=>$(V=>{V.value=R},"value"),{label:"Readings",noShare:!0,key:`${r}-value`})}
        <div class="fgroup">
        ${ae("Draw",ee,[["history","Recorded history"],["statistics","Long-term statistics"],["value","The value itself"]],R=>$(V=>{if(R==="value"){V.historyMinutes=0;return}V.source=R==="statistics"?"statistics":"history";let $e=V.historyMinutes||ws;V.historyMinutes=R==="statistics"?Math.min($e,dc):Math.min($e,ks)}),{titles:{history:"Read the entity's recorded states from the recorder and plot them",statistics:"Plot the recorder's pre-aggregated rows, which reach back a year",value:"Plot the numbers the value holds right now, such as a forecast list"},def:d.historyMinutes>0?"history":"value"})}
        ${q?h`
            ${pe?m:h`<div class="hint warn">Statistics need an entity.
              A typed-in value, a template or a shared value has no rows to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${Sp(a,w.historyMinutes,P,R=>$(V=>{V.historyMinutes=R}),Hr)}
              ${ae("Per",w.statPeriod,is,R=>$(V=>{V.statPeriod=R}),{def:gr})}
            </div>
            ${$h?Tp(w.historyMinutes,R=>$(V=>{V.historyMinutes=R},"span"),!0):m}
            ${ae("Read",w.statType,jd,R=>$(V=>{V.statType=R}),{def:yr})}
            <div class="hint">One bar per period, oldest first, newest ${wn} kept.
              Change suits energy (kWh per hour), Mean suits temperature.</div>
            ${w.statPeriod==="5minute"?h`<div class="hint warn">Five-minute rows are compacted into hourly ones after
                about ten days, so a longer span here comes back with only its recent tail.</div>`:m}
            ${pe&&Se===void 0?h`<div class="hint keep">Reading the statistics…</div>`:m}
            ${pe&&Se===""?h`<div class="hint warn">No long-term statistics for this entity in that span.
                Only an entity with a state class (measurement, total or total_increasing) gets
                them, and a brand new one has none yet.</div>`:m}`:m}
        ${j?h`
            ${pe?m:h`<div class="hint warn">History needs an entity.
              A typed-in value, a template or a shared value has no past to read, so this chart
              draws the value itself until Readings names an entity.</div>`}
            <div class="grid2">
              ${Sp(a,w.historyMinutes,P,R=>$(V=>{V.historyMinutes=R}))}
              <div class="field readings-field">${Be("Points",{atDefault:w.historyPoints===N,title:`Back to ${N<1?"every one":`${N} averaged`}`,reset:()=>$(R=>{R.historyPoints=N})})}
                <div class="readings-row">
                  <div class="seg wide" role="radiogroup" aria-label="Points">
                    <button type="button" role="radio" aria-checked=${ke?"false":"true"} class=${ke?"":"on"}
                      title="Average the recorded states into this many equal time slots"
                      @click=${()=>{ke&&$(R=>{R.historyPoints=24})}}>Average</button>
                    <button type="button" role="radio" aria-checked=${ke?"true":"false"} class=${ke?"on":""}
                      title="Plot every recorded state change, no averaging"
                      @click=${()=>{ke||$(R=>{R.historyPoints=cc})}}>Every one</button>
                  </div>
                  ${ke?m:h`<span class="readings-into">into</span>
                    <input type="number" class="short" aria-label="How many time slots" .value=${String(w.historyPoints)}
                      title="How many equal time slots the span is averaged into, so how many bars or points get drawn"
                      step="1" min=${$s} max=${wn}
                      data-scrub @pointerdown=${So(w.historyPoints,R=>$(V=>{V.historyPoints=Math.round(R)},"hpoints"),{step:1,min:$s,max:wn})}
                      @input=${ze(R=>{let V=Number(R);R.trim()!==""&&Number.isFinite(V)&&V>=1&&$($e=>{$e.historyPoints=Math.round(V)},"hpoints")})} />
                    <span class="readings-unit">slots</span>`}
                </div>
              </div>
            </div>
            ${$h?Tp(w.historyMinutes,R=>$(V=>{V.historyMinutes=R},"span")):m}
            <div class="hint">${ke?h`Every state the recorder holds in that span, oldest first, one reading per change.
                  The time axis follows the changes, so a quiet hour draws narrower than a busy one.
                  A span with more than ${wn} readings is averaged into
                  ${wn} even slots instead, so the chart still covers all of it.`:h`Home Assistant averages the recorded states into this many equal time slots,
                  oldest first. About 20 suits a rectangular complication; more than that draws bars
                  thinner than the screen can show.`}</div>
            ${kh===void 0?m:h`<div class="hint keep">${kh}</div>`}
            ${pe&&Se===void 0?h`<div class="hint keep">Reading the history…</div>`:m}
            ${pe&&Se===""?h`<div class="hint warn">Nothing recorded for this entity in that span.
                Either it is excluded from the recorder, or it has no numeric states.</div>`:m}`:m}
        ${O?h`
            ${xe("Show gaps",w.gaps===!0,R=>$(V=>{R?V.gaps=!0:delete V.gaps}),d.gaps===!0)}
            ${sn(e)}
            <div class="hint">Breaks the line, and leaves the bar out, wherever the entity was unavailable,
              instead of carrying the last reading across the outage.</div>`:m}
        ${O?m:h`
            <div class="hint">Every number in what this resolves to becomes one point, in order.
              Commas, spaces and square brackets are all just separators, so a text sensor, a list
              attribute and a template that joins a forecast all work. A dot is a decimal point;
              a comma never is.</div>`}
        </div>
        ${la.length===0&&!(O&&(!pe||Se===void 0||Se===""))?h`<div class="hint warn">No numbers in this value yet, so the chart draws nothing.</div>`:m}
        ${la.length>0?h`<div class="field readout"><span>Reads</span>
              <span class="readout-v"><span class="nums">${UT(Gt)}</span>${la.length===Gt.length?h` · ${Gt.length} ${Gt.length===1?"value":"values"}`:h` · ${Gt.length} of ${la.length}`}</span></div>`:m}
        ${Yv?h`<div class="hint warn">This entity holds one number, so the chart draws one bar.
              Switch Draw to <b>Recorded history</b> to plot how it has moved.</div>`:m}
        ${O&&w.limit<=0?m:h`
        <div class="grid2">
          ${re("Only draw",w.limit,R=>$(V=>{V.limit=Math.max(0,Math.round(R??0))},"limit"),{step:1,min:0,def:d.limit,unit:"readings"})}
          ${w.limit<=0?m:ae("Keep",w.takeFromEnd?"end":"start",O?[["start","Oldest"],["end","Newest"]]:[["start","First"],["end","Last"]],R=>$(V=>{V.takeFromEnd=R==="end"}),{def:d.takeFromEnd===!0?"end":"start"})}
        </div>
        ${O?h`<div class="hint warn">Span and slots already set how much is drawn, so set this to 0.
              Trimming here draws only ${w.limit} of the readings fetched above, while clock times still label the whole span.</div>`:h`<div class="hint">${w.limit<=0?"0 draws every reading. Type a number to draw only that many.":`Draws only ${w.limit} of the numbers: the first or the last ones. A forecast sensor often carries 24 or 48.`}</div>`}`}
        ${Fe("Smooth data",It(w.smoothing)??"off",FS,R=>$(V=>{let $e=It(R);$e===void 0?delete V.smoothing:V.smoothing=$e}),{def:It(d.smoothing)??"off"})}
        ${sn(e)}
        <div class="hint">Averages each reading with its neighbours, weighted towards the middle, so a
          jumpy sensor draws a calm line. The strength scales with the number of readings: over 120
          readings, Light, Medium and Strong average 7, 13 or 25 of them. The chart's own numbers
          read the smoothed series too: its stats, highlights and bands. A text layer pointed at the entity itself still shows the raw value.</div>`,f=!0;let Xv=(()=>{if(No)return!0;if(w.scale==="fixed")return w.minValue<0&&w.maxValue>0;let R=Gt.filter(Do=>Number.isFinite(Do));if(R.length===0)return!0;let V=Math.min(...R,w.thresholdValue??1/0),$e=Math.max(...R,w.thresholdValue??-1/0);return V<0&&$e>0})(),Hn=Ib(w);v=Gt,S=h`
        <div class="grid2">
          ${ae("Style",w.style,yx,R=>$(V=>{V.style=R}),{def:d.style})}
          ${w.style==="bars"?re("Bar gap",w.barGap,R=>$(V=>{V.barGap=Math.max(0,R??0)},"gap"),{step:.5,min:0,def:d.barGap,unit:"pt"}):oi(e,n,t,"Line width",{step:.5,min:.5,def:p("lineWidth")})}
        </div>
        ${w.style==="bars"?h`
          <div class="fgroup">
          <div class="grid2">
            ${re("Corner radius",On(w.barRadius),R=>$(V=>{let $e=Math.max(0,R??ma);$e===ma?delete V.barRadius:V.barRadius=$e},"barradius"),{step:.5,min:0,def:On(d.barRadius),unit:"pt"})}
          </div>
          ${xe("Round top only",zn(w.barCorners)==="top",R=>$(V=>{R?V.barCorners="top":delete V.barCorners}),zn(d.barCorners)==="top")}
          ${sn(e)}
          <div class="hint">Round top only rounds the end away from the baseline, so a bar hanging
            below zero rounds its bottom.</div>
          </div>
          <div class="fgroup">
          ${Hn.fill===void 0?m:kp(Hn.fill,w.fillColorHex,R=>$(V=>{R===void 0?delete V.fillColorHex:V.fillColorHex=R},"fillcol"))}
          ${w.style==="bars"?m:ql("Area gradient",w.areaFill,R=>$(V=>{if(R===void 0){delete V.areaFill;return}V.areaFill=R,V.fillColorHex=Yt(R,0)},"areafill"),()=>({kind:"linear",stops:[{at:0,colorHex:w.fillColorHex??w.colorSlot.baseColorHex},{at:1,colorHex:w.fillColorHex??w.colorSlot.baseColorHex}]}))}
          ${xe("Border",w.barBorderWidth!==void 0,R=>$(V=>{R?V.barBorderWidth=1:delete V.barBorderWidth}),!1)}
          ${w.barBorderWidth===void 0?m:h`
            ${re("Border width",w.barBorderWidth,R=>$(V=>{V.barBorderWidth=Math.min(Math.max(R??1,0),vs)},"barborderw"),{step:.5,min:0,max:vs,def:1,unit:"pt"})}
            ${Hn.border===void 0?m:kp(Hn.border,w.barBorderColorHex,R=>$(V=>{R===void 0?delete V.barBorderColorHex:V.barBorderColorHex=R},"barbordercol"))}
            ${xe("Open at base",w.barBorderOpenBase===!0,R=>$(V=>{R?V.barBorderOpenBase=!0:delete V.barBorderOpenBase}),!1)}`}
          ${sn(e)}
          <div class="hint">The border is drawn inside each bar, so bars keep their size. A highlighted
            bar fills and borders in its highlight colour.${w.barBorderOpenBase===!0?" Open at base leaves the border off the edge on the baseline, so a bar hanging below zero leaves its top open.":" Open at base leaves the border off the edge on the baseline."}${w.coloring==="bands"?" Each band can set its own fill and border below.":""}</div>
          </div>`:h`
          <div class="fgroup">
          ${ae("Curve",w.curve??"straight",RS,R=>$(V=>{R==="straight"?delete V.curve:V.curve=R}),{titles:{straight:"A straight line from each reading to the next",smooth:"A smooth line that never rises past the highest reading or dips under the lowest",step:"Each reading holds flat until the next one, the way a state does"},def:d.curve??"straight"})}
          ${sn(e)}
          </div>
          ${w.style==="area"?h`
            <div class="fgroup">
            ${ae("Fill",Dn(w.fillStyle),AS,R=>$(V=>{R==="flat"?delete V.fillStyle:V.fillStyle=R}),{titles:{flat:"One even wash under the line",fade:"Strongest at the top of the plot, fading to clear at the baseline"},def:Dn(d.fillStyle)})}
            ${Hn.fill===void 0?m:kp(Hn.fill,w.fillColorHex,R=>$(V=>{R===void 0?delete V.fillColorHex:V.fillColorHex=R},"fillcol"))}
            ${sn(e)}
            </div>`:m}`}
        <div class="fgroup">
        <div class="grid2">
          ${ae("Scale",w.scale,MS,R=>$(V=>{V.scale=R}),{titles:{auto:"The plot stretches to fit the readings it has",fixed:"The plot always runs from Min to Max"},def:d.scale})}
          ${ae("Baseline",w.baseline,LS,R=>$(V=>{V.baseline=R}),{def:d.baseline})}
        </div>
        ${wd.length===0?m:Fe("Same scale as",No?w.scaleFrom:"",[["","Its own"],...wd.map(R=>[R.payload.id,Te(R,Sh)])],R=>$(V=>{R?V.scaleFrom=R:delete V.scaleFrom}),{def:""})}
        ${No?h`<div class="hint keep">This chart is drawn against that one's range, so the two read as one
              plot. Give them the same frame and each keeps its own readings, colour, style and
              numbers. Scale, Min and Max above are ignored while a chart is picked here.</div>`:m}
        ${!No&&w.scale==="fixed"?h`<div class="grid2">
              ${re("Min",w.minValue,R=>$(V=>{V.minValue=R??0},"cmin"),{def:d.minValue})}
              ${re("Max",w.maxValue,R=>$(V=>{V.maxValue=R??100},"cmax"),{def:d.maxValue})}
            </div>`:m}
        <div class="hint">${w.baseline==="zero"?"Bars grow from where zero falls, so a negative reading hangs below the line.":"Bars grow from the bottom, and the smallest reading keeps a visible stub. Switch to Zero when the readings can go negative."}</div>
        </div>
        <div class="field"><span>Series</span>
          <div class="row-acts">
            <button class="small" title="Add a second chart layer on this frame, drawn against this chart's range"
              @click=${()=>{let R;e.update(V=>{R=wm(V,a,$e=>Te($e,Sh))}),R&&e.selectLayer(R)}}>${H("plus")}<span>Add a second series</span></button>
          </div>
        </div>
        <div class="fgroup">
        ${ae("Colour",w.coloring,Zl,R=>$(V=>{V.coloring=R,R==="bands"&&V.bands.length===0&&(V.bands=xo(Gt))}),{def:d.coloring})}
        ${Hn.main===void 0?m:g(Hn.main)}
        ${w.coloring==="bands"?h`
          <div class="hint">Checked lowest first, so each row only says where it ends. A reading past
            the last row takes the colour underneath.
            ${w.style==="bars"?"Each bar is coloured on its own value.":"A stroke cannot change colour halfway, so each leg of the line takes the band of the reading it arrives at."}</div>
          ${vo(w,w.colorSlot.baseColorHex,$,Gt,w.style==="bars"?{...w.fillColorHex===void 0?{}:{fillHex:w.fillColorHex},...w.barBorderColorHex===void 0?{}:{borderHex:w.barBorderColorHex},border:w.barBorderWidth!==void 0}:void 0)}
          ${w.style==="area"?h`${xe("Band fill",w.fillBands,R=>$(V=>{V.fillBands=R}),d.fillBands)}
              <div class="hint">Off, the wash under the line stays one colour. On, each stretch of
                fill takes its own band, which reads well on a chart that spends real time in more
                than one band and as noise on one that flickers between them.</div>`:m}`:m}
        </div>`;let kd=(R,V)=>et(R,a).filter($e=>$e.payload.chartAnchor?.at===V&&$e.payload.chartAnchor.place==="through"),Th=(R,V)=>et(R,a).some($e=>$e.payload.chartAnchor?.at===V),Eh={threshold:R=>kd(R,"threshold"),now:R=>kd(R,"now"),zero:R=>kd(R,"zero"),times:R=>Yn(R,a),dots:R=>Oi(R,a),grid:R=>zi(R,a)},Jv={threshold:R=>{Th(R,"threshold")?Si(R,a,"threshold"):rm(R,a,w.thresholdValue??Vp(Gt))},now:R=>{Th(R,"now")?Si(R,a,"now"):om(R,a,!0)},zero:R=>{Gc(R,a)},times:R=>{Di(R,a)},dots:R=>{Oc(R,a)},grid:R=>{zc(R,a)}},da={};Li(w)||(da.times=ke&&j?"Clock times need evenly spaced readings. Set Points to Average.":"Clock times need a recorded span. Set Draw to Recorded history."),w.style==="bars"&&(da.dots="Dots need a line or area chart. Set Style to Line or Area.");let $d=R=>Eh[R](e.config).length>0;y={};for(let[R,V]of Object.entries(da))y[`draw:${R}`]=V;let Zv=([R,V])=>{let $e=$d(R),Do=$e?void 0:da[R],Cd=`draw:${R}`;return h`<div class="xr-row" role="row" data-extra=${Cd}>
          <span role="cell"><span class="xr-name">${V}</span></span>
          <span role="cell"></span>
          <span role="cell"><button type="button" class="xtog ${$e?"on":""}" role="switch" aria-checked=${$e?"true":"false"}
            aria-label=${V} ?disabled=${Do!==void 0} data-extra=${Cd}
            title=${Jp(Cd,Do??($e?`Remove the ${V.toLowerCase()} from this chart`:`Add ${V.toLowerCase()} to this chart`))}
            @click=${()=>e.update(Sd=>{if($e)for(let Qv of Eh[R](Sd))Me(Sd,Qv.payload.id);else Jv[R](Sd)})}>${$e?h`<span aria-hidden="true">✓</span>`:H("plus")}</button></span>
          <span role="cell"></span>
        </div>`};b=h`
        <div class="field list-field"><span>On the plot</span>
          <div class="xreadings" role="table" aria-label="On the plot" @pointerover=${qa} @focusin=${qa}>
            <div class="xr-row xr-head" role="row">
              <span role="columnheader"><span class="xr-name">Layer</span></span><span role="columnheader"></span>
              <span role="columnheader">Show</span><span role="columnheader"></span>
            </div>
            ${Nl.map(Zv)}
          </div>
        </div>
        ${Nl.filter(([R])=>da[R]!==void 0&&!$d(R)).map(([R])=>h`<div class="hint keep">${da[R]}</div>`)}
        ${$d("zero")&&!Xv?h`<div class="hint warn">These readings never cross zero, so the zero line is not drawn.</div>`:m}
        ${sn(e)}`;break}case"timeline":{let w=n.payload,$=(Ne,ke)=>o(pi=>Ne(pi.payload),ke),P=d.historyMinutes,N=w.value.kind.kind==="entityState",O=ht(w),q=O===void 0?void 0:e.historySeries(O),j=Pt(w)*60,ee=qr(q??"",jn),B=Hp(a,w.historyMinutes),ce=w.value.kind.kind==="entityState"?w.value.kind.entityId:void 0,pe=w.aggregate!==void 0,Se=pe?wa[Cs]??[]:OS(ee,j,ce===void 0?void 0:e.hass.states[ce]?.state,ce?.split(".")[0]);k=h`
        ${zS(w,$,r)}
        ${pe?GS(e,w,$,r):h`
            ${he(e,w.value,Ne=>$(ke=>{ke.value=Ne},"value"),{label:"States",noShare:!0,key:`${r}-value`})}
            ${N?m:h`<div class="hint warn">A timeline draws an entity's recorded
              past, so it needs one named above. A typed-in value, a template or a shared value has no
              past to read, and this layer stays blank until States names an entity.</div>`}`}
        <div class="fgroup">
        ${Sp(a,w.historyMinutes,P,Ne=>$(ke=>{ke.historyMinutes=Ne}))}
        ${B?Tp(w.historyMinutes,Ne=>$(ke=>{ke.historyMinutes=Ne},"span")):m}
        <div class="hint">Every state the recorder holds in that span, oldest at the left, each run as
          wide as the time it lasted. At most ${jn} changes are drawn, and a
          busier span keeps its newest.</div>
        ${N&&q===void 0?h`<div class="hint keep">Reading the history…</div>`:m}
        ${N&&q===""?h`<div class="hint warn">Nothing recorded for ${pe?"these entities":"this entity"}
            in that span. Either ${pe?"they are":"it is"} excluded from the recorder, or
            ${pe?"none of them have":"it has not"} been seen in that long.</div>`:m}
        </div>
        ${ee.length>0?h`<div class="field readout"><span>Reads</span><span class="readout-v"><span class="nums">${YT(ee,j)}</span></span></div>`:m}
        ${qT(ee)?h`<div class="hint warn">This entity reports numbers, so every reading is its own
            state and the strip is one colour with a hairline wherever it dropped out. A timeline is
            for states that are words, like on and off, open and closed, home and away. For a
            number's past, use a Chart layer instead.</div>`:m}`,S=h`
        <div class="hint">Each row is a state and the colour its runs draw in, checked top to bottom.
          Case and surrounding space are ignored, so <code>Home</code> matches <code>home</code>. A
          state no row names takes the colour underneath.</div>
        ${BS(w,$,Se,`wa-tl-states-${r.replace(/[^a-z0-9]/gi,"")}`)}
        ${Se.length>2?h`<div class="hint keep">Seen in this span: <span class="nums">${Se.filter(Ne=>Ne!=="unavailable"&&Ne!=="unknown").join(", ")}</span>. Click into a State box to pick one.</div>`:m}
        <div class="grid2">
          ${re("Gap",w.gap,Ne=>$(ke=>{ke.gap=Math.min(Ss,Math.max(0,Ne??0))},"tgap"),{step:.5,min:0,max:Ss,def:d.gap,unit:"pt"})}
          ${re("Corner radius",w.cornerRadius,Ne=>$(ke=>{ke.cornerRadius=Math.max(0,Ne??0)},"tradius"),{step:.5,min:0,def:d.cornerRadius,unit:"pt"})}
        </div>
        <div class="hint">A gap is taken off the right of each run, so the strip still ends flush with
          the frame and the newest state keeps the edge. 0 draws one continuous bar, which is what a
          door or a light usually wants.</div>
`;break}case"shape":k=h`<div class="grid2">
          ${ae("Shape",n.payload.kind,[["roundedRectangle","Rounded"],["rectangle","Rectangle"],["capsule","Capsule"],["circle","Circle"],["line","Line"]],w=>o($=>{$.payload.kind=w}),{titles:{roundedRectangle:"Rounded rectangle",line:"A rule along the frame's long side"},def:d.kind})}
          ${n.payload.kind==="roundedRectangle"?re("Corner radius",n.payload.cornerRadius,w=>o($=>{$.payload.cornerRadius=w??6},"radius"),{step:.5,min:0,def:d.cornerRadius,unit:"pt"}):m}
        </div>
        ${n.payload.kind==="line"?jT(t,l,c):m}`,S=n.payload.kind==="line"?re("Thickness",n.payload.thickness,w=>o($=>{$.payload.thickness=w??1},"thick"),{step:.5,min:.5,def:d.thickness,unit:"pt"}):h`
        <div class="fgroup">
        ${ql("Gradient",n.payload.fill,w=>o($=>{let P=$.payload;if(w===void 0){delete P.fill;return}P.fill=w,P.colorSlot.baseColorHex=Yt(w,0)},"fill"),()=>({kind:"linear",stops:[{at:0,colorHex:n.payload.colorSlot.baseColorHex},{at:1,colorHex:n.payload.colorSlot.baseColorHex}]}))}
        ${Ce("Border colour",n.payload.borderColorHex,w=>o($=>{w===void 0?delete $.payload.borderColorHex:$.payload.borderColorHex=w},"border"),!0,null)}
        ${n.payload.borderColorHex!==void 0?re("Border width",n.payload.borderWidth,w=>o($=>{$.payload.borderWidth=w??1},"bw"),{step:.5,min:0,def:d.borderWidth,unit:"pt"}):m}
        </div>`;break;case"image":{let w=n.payload,$=(q,j)=>o(ee=>q(ee.payload),j),P=w.entity.entityId?e.hass.states[w.entity.entityId]?.attributes?.entity_picture:void 0,N=typeof P=="string"?P:void 0,O=N!==void 0&&!N.startsWith("/");k=h`
        ${ae("Source",w.source,[["camera","Camera"],["entityPicture","Entity picture"],["inline","Upload"]],q=>e.update(j=>{let ee=j.elements.find(B=>B.payload.id===w.id);if(ee?.kind==="image"&&(mx(ee.payload,q),q==="inline"))for(let B of Hs(j,w.id))Me(j,B.payload.id)},"img-source"),{titles:{camera:"A snapshot from a camera entity",entityPicture:"The picture an entity already carries: a person's photo, cover art, a weather icon",inline:"A picture you upload, carried in the complication itself"},def:d.source})}
        ${w.source==="inline"?$S(e,w,t,$):w.source==="camera"?h`
            ${w.entity.entityId&&!w.entity.entityId.startsWith("camera.")?h`<div class="hint warn">Only camera entities have snapshots, so this layer stays blank until the entity is a camera. Switch the source to Entity picture to use this entity's own photo.</div>`:m}
            <div class="hint">The watch fetches a snapshot on refresh and shows the cached frame in between. This preview shows the camera live.</div>`:h`
            ${w.entity.entityId&&N===void 0?h`<div class="hint warn">This entity has no picture right now, so the layer stays blank. Anything with an <code>entity_picture</code> works: a person, a media player playing something with cover art, a weather entity.</div>`:m}
            ${O?h`<div class="hint warn">This picture is hosted outside Home Assistant, so the watch cannot fetch it.</div>`:m}
            <div class="hint">The watch fetches the entity's own picture on refresh and shows the cached copy in between. This preview shows it live.</div>`}`,S=h`
        <div class="fgroup">
        ${ae("Picture",w.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],q=>$(j=>{j.contentMode=q}),{titles:{fill:"Cover the frame, cropping what does not fit",fit:"Show the whole picture, with space around it"},def:d.contentMode})}
        ${ln("Zoom",w.zoom,q=>$(j=>{j.zoom=q},"zoom"),{min:Pu,max:4,step:.05,def:1,format:q=>`${q.toFixed(2)}x`,unit:"x"})}
        ${ln("Pan left/right",w.panX,q=>$(j=>{j.panX=q},"panx"),{min:-1,max:1,step:.02,def:0})}
        ${ln("Pan up/down",w.panY,q=>$(j=>{j.panY=q},"pany"),{min:-1,max:1,step:.02,def:0})}
        <div class=${w.contentMode==="fit"&&w.zoom===1?"hint keep":"hint"}>${VT(w)}</div>
        </div>
        ${re("Corner radius",w.cornerRadius,q=>$(j=>{j.cornerRadius=Math.max(0,q??ka)},"imgradius"),{step:1,min:0,def:ka,unit:"pt"})}`;break}case"tap":{k=h`
        ${pd(e,n.payload,(w,$)=>o(P=>w(P.payload),$),r)}
        <div class="hint">An invisible area: a tap inside this frame runs this action, and the layer highest in the list wins where two overlap.</div>
        <div class="hint">To make one layer tappable, tick Tappable on that layer instead.</div>`;break}case"chartTimes":{let w=n.payload,$=(q,j)=>o(ee=>q(ee.payload),j),P=e.config.elements.find(q=>q.payload.id===w.chart),N=P?.kind==="chart"||P?.kind==="timeline"?P:void 0,O=N?.kind==="timeline"?"timeline":"chart";k=h`
        <div class="field readout"><span>${N?.kind==="timeline"?"Timeline":"Chart"}</span><span class="readout-v">${N?h`<button class="small" title=${`Select that ${O}`} @click=${()=>e.selectLayer(N.payload.id)}>${Te(N,ye(e))}</button>`:"None"}</span></div>
        ${N===void 0?h`<div class="hint warn">The chart or timeline these times belonged to is gone, so this layer draws nothing.</div>`:N.kind==="timeline"?ht(N.payload)===void 0?h`<div class="hint warn">That timeline names no entity yet, so it has no span to label and
                  this layer draws nothing.</div>`:m:Li(N.payload)?m:h`<div class="hint warn">That chart has no evenly spaced span to label, so this layer draws
                  nothing. Clock times are drawn when its Draw is Recorded history with Points on Average,
                  or Long-term statistics.</div>`}
        <div class="hint">The clock times of that ${O}'s span, spread across this layer's width and centred
          in its height. Move and size it like any other layer.</div>`,S=eE(w,$,d,"ct",h`
        <div class="hint">Evenly spaced from the start of the ${O}'s span to now. Auto follows the watch's
          own clock and drops the minutes past a three hour span.</div>`);break}case"imageTime":{let w=n.payload,$=e.config.elements.find(N=>N.payload.id===w.image),P=$?.kind==="image"?$:void 0;k=h`
        <div class="field readout"><span>Picture</span><span class="readout-v">${P?h`<button class="small" title="Select that picture" @click=${()=>e.selectLayer(P.payload.id)}>${Te(P,ye(e))}</button>`:"None"}</span></div>
        ${P===void 0?h`<div class="hint warn">The picture this time belonged to is gone, so this layer draws nothing.</div>`:m}
        <div class="hint">The time that picture was fetched, not the time now: a picture that stops updating
          keeps its old time, so a stale one reads as stale. The watch shows nothing here until the picture
          has been fetched once. Move and size it like any other layer: the chip grows to fill the frame.</div>`;break}case"chartDots":{let w=n.payload,$=(j,ee)=>o(B=>j(B.payload),ee),P=e.config.elements.find(j=>j.payload.id===w.chart),N=P?.kind==="chart"?P:void 0,O=N===void 0?void 0:Ge(e.config,t,N).size??N.payload.lineWidth,q=O===void 0?void 0:Math.round(O*18)/10;k=h`
        ${nx(e,N)}
        ${N===void 0?h`<div class="hint warn">The chart these dots belonged to is gone, so this layer draws nothing.</div>`:N.payload.style==="bars"?h`<div class="hint warn">That chart draws bars, so this layer draws nothing. Dots are drawn on a
                line or area chart.</div>`:m}
        <div class="hint">This layer always sits on its chart: it draws in the chart's box whatever its own frame
          says, with a dot on each reading the chart draws.</div>
        ${sn(e)}`,S=h`
        ${ae("Dots",w.dots,gx,j=>$(ee=>{ee.dots=j}),{titles:{auto:"A dot on every reading while they sit far enough apart to tell apart, none on a crowded chart",all:"A dot on every reading"},def:"auto"})}
        <div class="grid2">
          ${re("Dot size",w.size??q,j=>$(ee=>{let B=Kt(j);B===void 0||B===q?delete ee.size:ee.size=B},"dotsize"),{step:.5,min:1,max:12,...q===void 0?{}:{def:q},unit:"pt"})}
          ${zp("Dot colour",w.colorHex,"Series colour",j=>$(ee=>{j===void 0?delete ee.colorHex:ee.colorHex=j},"dotcol"))}
        </div>
        <div class="hint">Auto leaves the dots off once the readings sit too close to tell apart. Left alone, a dot
          is a little wider than the chart's line and takes the colour the series has at its reading.</div>`;break}case"chartGrid":{let w=n.payload,$=(O,q)=>o(j=>O(j.payload),q),P=e.config.elements.find(O=>O.payload.id===w.chart),N=P?.kind==="chart"?P:void 0;k=h`
        ${nx(e,N)}
        ${N===void 0?h`<div class="hint warn">The chart these grid lines belonged to is gone, so this layer draws nothing.</div>`:m}
        <div class="hint">This layer always sits on its chart: it draws across the chart's plot whatever its own
          frame says. Where it sits in Layers decides whether the lines are behind the series or in front.</div>
        ${sn(e)}`,S=h`
        <div class="grid2">
          ${re("Lines",w.lines,O=>$(q=>{q.lines=Ri(O??Vn)},"lines"),{step:1,min:1,max:4,def:Vn})}
          ${re("Thickness",w.thickness,O=>$(q=>{q.thickness=Ai(O??Bn)},"thick"),{step:.25,min:ts,max:ns,def:Bn,unit:"pt"})}
        </div>
        ${Ce("Colour",w.colorHex,O=>$(q=>{q.colorHex=O??fn},"gridcol"),!1,fn)}
        <div class="hint">Equal rows across the plot, never on its top or bottom edge.</div>`;break}case"list":{let w=($,P)=>o(N=>$(N.payload),P);k=h`
        ${pT(e,n.payload,w,r)}
        ${sn(e)}`,S=h`
        ${mT(e,n,t,w)}
        <div class="chips">
          <button class="small" title="Add a hidden line of text that shows only when this list has nothing to draw"
            @click=${()=>{let $;e.update(P=>{$=wT(P,a,t)}),$&&e.selectLayer($)}}>Add an empty state</button>
        </div>`;break}}let I=f||ta(n)===void 0?void 0:g(n.kind==="shape"?"Fill colour":n.kind==="text"&&_t(n.payload)?"Layer colour":"Colour"),_=n.kind!=="tap"&&e.config.supportedFamilies.some(Rn)?EE(n.payload.accentGroup??"primary",w=>o($=>{w==="accent"?$.payload.accentGroup="accent":delete $.payload.accentGroup},"accent-group")):void 0,E=zs(e.config,n),z=E?{kind:{kind:"entityState",...E}}:void 0,C=n.kind==="text"&&(n.payload.parts?.length??0)>0?n.payload.parts:void 0,M=CE[n.kind],K=n.kind==="tap"?tx[n.kind]:[...tx[n.kind],...SE],Y=Vl(n.payload,d,M),J=n.kind==="text"?"fontSize":n.kind==="icon"?"size":n.kind==="gauge"||n.kind==="chart"?"lineWidth":void 0,L=e.config.perFamily[t]?.placements[a]?.size!==void 0,X=Vl(n.payload,d,K)||J!==void 0&&s.size!==void 0&&s.size!==d[J],ne=qn(e.config,a),D=(w,$)=>()=>o(P=>Ul(P.payload,d,w),$),W=h`<section class="sec name-sec" data-open="true" style=${`--c:${le.place}`}>
    <div class="sec-h pinned">
      <span class="swatch">${H("text")}</span>
      <h4>Name${Co(n.payload.name===void 0?void 0:{atDefault:!1,title:"Go back to the automatic title",reset:()=>o(w=>{delete w.payload.name},"reset-name")})}</h4>
      <input type="text" aria-label="Layer name" .value=${n.payload.name??""} placeholder=${Yx(n,ye(e))}
        @input=${ze(w=>o($=>{let P=PE(w);P===void 0?delete $.payload.name:$.payload.name=P},"name"))} />
    </div>
  </section>`;return h`
    ${W}
    ${Ie(e,"content","Content",h`${zT(n)?Bx(e,n,r):m}${k}`,{color:le.content,icon:"content",summary:Yp(e,n),...Y?{reset:()=>o(w=>{Ul(w.payload,d,M),w.kind==="text"&&lo(w.payload.rules)},"reset-content")}:{}})}
    ${S===void 0&&I===void 0&&_===void 0&&n.kind==="tap"?m:Ie(e,"look",n.kind==="image"?"Picture":"Look",h`${S??m}${I??m}${_??m}${n.kind==="tap"?m:TE(n,o)}`,{color:le.look,icon:n.kind==="image"?"image":"look",...Ql(n)?{summary:Ql(n)}:{},...X?{reset:()=>e.update(w=>{let $=ia(w,a);$&&Ul($.payload,d,K),L&&Pe(w,t,a,{},!0)})}:{}})}
    ${n.kind==="chart"?Ie(e,"numbers","Extras",LE(e,n,b,y,v),{color:le.numbers,icon:"text",summary:ME(e,n),...ne.length>0||et(e.config,a).length>0||Yn(e.config,a).length>0||Oi(e.config,a).length>0||zi(e.config,a).length>0||Vl(n.payload,d,ix)?{reset:()=>e.update(w=>{for(let P of qn(w,a))Me(w,P.payload.id);for(let P of et(w,a))Me(w,P.payload.id);for(let P of Yn(w,a))Me(w,P.payload.id);for(let P of Oi(w,a))Me(w,P.payload.id);for(let P of zi(w,a))Me(w,P.payload.id);let $=w.elements.find(P=>P.payload.id===a);$&&Ul($.payload,d,ix)})}:{}}):m}
    ${n.kind==="timeline"||n.kind==="image"&&n.payload.source!=="inline"?$E(e,n):m}
    ${n.kind==="list"?Ie(e,"row","Row",yT(e,n,(w,$)=>o(P=>w(P.payload),$)),{color:le.numbers,icon:"content",summary:`${n.payload.template.length} of ${$a} layers`}):m}
    ${rE(n)?Ie(e,"level","Fill by value",oE(e,n,r,o),{color:le.numbers,icon:"gauge",summary:aE(n),...Vl(n.payload,d,Qb)?{reset:D(Qb,"reset-level")}:{}}):m}
    ${Ie(e,"states","States",nv(e,n.payload.rules,n.kind,w=>w.elements.find($=>$.payload.id===a)?.payload.rules,`rules-${a}`,z,C,{colorByValue:ZE(n)}),{color:le.states,icon:"states",summary:io(n.payload.rules).replace(/\.$/,""),...n.payload.rules.length>0?{reset:()=>o(w=>{w.payload.rules=[]})}:{}})}
    ${i.placement===!1?m:ZT(e,n,t)}
    ${i.tap===!1?m:QT(e,n)}`}function $E(e,n){let t=n.payload.id,i=n.kind==="timeline",a=i?Yn(e.config,t):Hs(e.config,t),r=i?"Clock times":"Timestamp",o=e.activeFamily,s=()=>e.update(p=>{let f=p.elements.find(b=>b.payload.id===t);if(!f)return;let g=f.payload.frame;f.payload.frame={...Ge(p,o,f).frame},i?Di(p,t):Dc(p,t,ge[o==="inline"?"rectangular":o]),f.payload.frame=g}),l=a.length>0,c=a.map(p=>({el:p,lead:H("clock"),title:r,kind:i?"Times":"Timestamp"})),d=i?"timeline:times":"image:time",u=h`
    ${qx(i?"timeline":"image")}
    <div class="field list-field"><span>Draw</span>
      <div class="adders" @pointerover=${qa} @focusin=${qa}>
        <button class="small ${l?"on":""}" ?disabled=${l} aria-pressed=${l?"true":"false"} data-extra=${d}
          title=${Jp(d,l?`${r} is on this ${i?"timeline":"picture"}. Remove it in the list below.`:`Add ${r.toLowerCase()}`)}
          @click=${s}>${l?h`<span aria-hidden="true">✓</span>`:H("plus")}<span>${r}</span></button>
      </div>
    </div>
    <div class="hint">${i?"Adds the clock times of this timeline's span as their own layer in its group, so you can drag them anywhere and give them any size or colour.":"Adds the time the picture was fetched as its own layer in its group, so you can drag it anywhere, inside the picture or beside it."}</div>
    ${l?h`
      ${Zp(e,c,{icon:"close",danger:!0,label:p=>`Delete this ${p}`,run:p=>e.update(f=>Me(f,p))})}
      <div class="hint">Click the row to open its main settings here. More settings selects that layer. The ×
        deletes it, and Undo brings it back.</div>`:m}`;return Ie(e,"numbers","Extras",u,{color:le.numbers,icon:"clock",summary:l?`${r} layer`:"None yet",...l?{reset:()=>e.update(p=>{for(let f of a)Me(p,f.payload.id)})}:{}})}var CE={text:["value","countdown","parts"],icon:["symbol","path"],gauge:["value","minValue","maxValue","total","minSource","maxSource"],chart:["value","historyMinutes","historyPoints","source","statPeriod","statType","limit","takeFromEnd"],timeline:["value","historyMinutes"],shape:["kind","cornerRadius"],image:["entity","source"],tap:["action","openPageName"],chartTimes:[],chartDots:[],chartGrid:[],imageTime:[],list:["source","template"]},SE=["opacity","shadow"];function TE(e,n){let t=e.payload,i=t.shadow,a=(o,s)=>n(l=>{let c={...l.payload.shadow??ga};o(c),l.payload.shadow=c},s),r=e.kind==="text"&&i!==void 0&&i.dx===0&&i.dy===0&&i.radius>0&&e.payload.fontSize<10;return h`
    <div class="fgroup">
    ${ln("Opacity",t.opacity??1,o=>n(s=>{let l=Tr(o);l===1?delete s.payload.opacity:s.payload.opacity=l},"opacity"),{min:0,max:1,step:.05,def:1,format:o=>`${Math.round(o*100)}%`})}
    ${xe("Shadow",i!==void 0,o=>n(s=>{o?s.payload.shadow={...ga}:delete s.payload.shadow},"shadow-on"),!1)}
    ${i===void 0?m:h`
      ${Ce("Shadow colour",i.colorHex,o=>a(s=>{s.colorHex=o??Sr},"shcol"),!1,Sr)}
      ${ln("Blur",i.radius,o=>a(s=>{s.radius=tc(o)},"shrad"),{min:0,max:ec,step:.5,def:ga.radius,unit:"pt"})}
      <div class="grid2">
        ${re("Offset X",i.dx,o=>a(s=>{s.dx=cr(o??0)},"shdx"),{step:.5,min:-Ci,max:Ci,def:ga.dx,unit:"pt"})}
        ${re("Offset Y",i.dy,o=>a(s=>{s.dy=cr(o??0)},"shdy"),{step:.5,min:-Ci,max:Ci,def:ga.dy,unit:"pt"})}
      </div>
      <div class="hint">Both offsets at zero makes a glow. On a tinted face the shadow takes the tint, like every other colour.</div>
      ${r?h`<div class="hint warn">A glow under text this small reads as a smudge on the watch.</div>`:m}`}
    </div>`}function EE(e,n){return h`${ae("Tinted group",e,[["primary","Default"],["accent","Accent"]],t=>n(t),{def:"primary"})}
    <div class="hint">On a tinted Home Screen the accent group takes the lighter of the two colours. Full colour is unchanged.</div>`}var tx={text:["fontSize","fontWeight","colorSlot","alignment","lineLimit","monospacedDigits","arc","fontDesign","fontWidth","italic","minimumScale","coloring","bands","bandAboveColorHex","highlight","highColorHex","lowColorHex"],icon:["size","colorSlot"],gauge:["style","lineWidth","trackColorHex","colorSlot","coloring","bands","bandAboveColorHex","thresholdValue","thresholdColorHex","fill","ticks","labels"],chart:["style","scale","minValue","maxValue","baseline","barGap","lineWidth","coloring","bands","bandAboveColorHex","fillBands","curve","fillStyle","fillColorHex","areaFill","barRadius","barCorners","barBorderWidth","barBorderColorHex","bandAboveFillColorHex","bandAboveBorderColorHex","barBorderOpenBase","scaleFrom","colorSlot"],timeline:["bands","otherColorHex","gap","cornerRadius"],shape:["colorSlot","borderColorHex","borderWidth","thickness","fill"],image:["contentMode","zoom","panX","panY","cornerRadius"],tap:[],chartTimes:["timeLabelCount","labelSize","labelColorHex","hourCycle","minutes"],chartDots:["dots","size","colorHex"],chartGrid:["lines","colorHex","thickness"],imageTime:[],list:["rows","direction","columns","gap"]};function RE(e,n){let t=e.ticks??ic(),i=e.labels??ac(),a=(o,s)=>n(l=>{let c={...l.ticks??ic()};o(c),ys(c)?delete l.ticks:l.ticks=c},s),r=(o,s)=>n(l=>{let c={...l.labels??ac()};o(c),bs(c)?delete l.labels:l.labels=c},s);return h`
    <div class="fgroup">
    <div class="grid2">
      ${re("Marks",t.count,o=>a(s=>{s.count=Math.max(0,Math.min(hs,Math.round(o??0)))},"tickn"),{step:1,min:0,max:hs,def:0})}
      ${t.count>0?re("Mark length",t.length,o=>a(s=>{s.length=Math.max(1,Math.min(fs,o??yn))},"ticklen"),{step:.5,min:1,max:fs,def:yn,unit:"pt"}):m}
    </div>
    ${t.count>0?h`
      ${Ce("Mark colour",t.colorHex,o=>a(s=>{s.colorHex=o??gn},"tickcol"),!1,gn)}
      ${re("Long every",t.majorEvery,o=>a(s=>{s.majorEvery=Math.max(0,Math.round(o??0))},"tickmaj"),{step:1,min:0,def:0})}
      <div class="hint">Marks are spread across the scale. Long every 5 draws every fifth one
        half as long again, which is what makes a dial countable. 0 draws them all the same.</div>`:m}
    </div>
    <div class="fgroup">
    ${xe("End numbers",i.show,o=>r(s=>{s.show=o},"lblshow"),!1)}
    ${i.show?h`
      <div class="grid2">
        ${re("Text size",i.size,o=>r(s=>{s.size=Math.max(ms,Math.min(gs,o??xn))},"lblsize"),{step:.5,min:ms,max:gs,def:xn,unit:"pt"})}
        ${Ce("Text colour",i.colorHex,o=>r(s=>{s.colorHex=o??bn},"lblcol"),!1,bn)}
      </div>
      <div class="hint">Min and max at the two ends of the scale${e.style==="needle"?", and the reading itself under the pointer":""}.</div>`:m}
    </div>`}function nx(e,n){return h`<div class="field readout"><span>Chart</span><span class="readout-v">${n?h`<button class="small" title="Select that chart" @click=${()=>e.selectLayer(n.payload.id)}>${Te(n,ye(e))}</button>`:"None"}</span></div>`}var ix=["highlight","highColorHex","lowColorHex","marker","highMarker","lowMarker","thresholdValue","thresholdColorHex","nowIndex","nowColorHex","drawsThreshold","drawsNowLine","drawsTimeLabels","timeLabelCount","labelSize","labelColorHex","labelsAbove","hourCycle","minutes"];function pd(e,n,t,i,a=kT,r="Tap action"){let o=n.action;return h`
    ${Fe(r,o.type,a,s=>t(l=>{l.action=Rx(s,l.action),s!=="openPage"&&(delete l.openPageId,delete l.openPageName)}))}
    ${Ax(o)}
    ${o.type==="refreshAll"?Fx(e,o,s=>t(l=>{l.action=s})):m}
    ${"entityId"in o?h`
      ${st(e,"Target",o,s=>t(l=>{l.action={type:o.type,...s}},"tap-entity"),`${i}-tap`)}
      ${Mp(e,s=>t(l=>{let c=l.action;"entityId"in c&&(l.action={type:c.type,entityId:s,displayName:"",domain:""})},"tap-entity"),"the target")}`:m}
    ${o.type==="callService"?Mx(e,o,(s,l)=>t(c=>{c.action=s},l),`${i}-tap`):m}
    ${o.type==="openPage"?Ix(e,n.openPageId,n.openPageName,(s,l)=>t(c=>{if(s===void 0){delete c.openPageId,delete c.openPageName;return}c.openPageId=s,l?c.openPageName=l:delete c.openPageName},"tap-page")):m}`}var AE=24;function FE(e,n){let t=[],i=1/0;for(let r of ue){if(!e.config.supportedFamilies.includes(r))continue;let o=xm(e.config,n,r);o&&(t.push(`${ie(r)} ${Math.round(o.width)} x ${Math.round(o.height)} pt`),i=Math.min(i,o.width,o.height))}if(t.length===0)return m;let a=i<AE;return h`<div class="field readout"><span>Tap size</span><span class="readout-v">${t.join(" \xB7 ")}</span></div>
    ${a?h`<div class="hint warn">That is small for a wrist. Show the tap area and drag its corners out.</div>`:m}`}function ME(e,n){let t=n.payload,i=qn(e.config,t.id),a=et(e.config,t.id),r=Yn(e.config,t.id),o=Oi(e.config,t.id),s=zi(e.config,t.id);if(i.length===0&&a.length===0&&r.length===0&&o.length===0&&s.length===0)return"None yet";let l=[...i.map(c=>{let d=c.payload.value.kind;return d.kind==="chartStat"?(jt.find(([u])=>u===d.stat)?.[1]??"number").toLowerCase():"number"})];for(let c of a){let{at:d,place:u}=c.payload.chartAnchor,p=(qt.find(([f])=>f===d)?.[1]??"reading").toLowerCase();l.push(u==="through"?`${p} line`:`${p} marker`)}for(let c of r)l.push("times layer");for(let c of o)l.push("dots layer");for(let c of s)l.push("grid layer");return l.join(" \xB7 ")}function LE(e,n,t,i={},a=[]){let r=n.payload.id,o=ye(e),s=qn(e.config,r),l=Yn(e.config,r),c=Oi(e.config,r),d=zi(e.config,r),u=et(e.config,r),p={};for(let[C]of jt){let M=e.resolve({kind:{kind:"chartStat",layer:r,stat:C}});M!==void 0&&M.trim()!==""&&(p[C]=M)}let f=a.filter(C=>Number.isFinite(C)),g=n.payload.nowIndex===void 0?NaN:Number(e.resolve(n.payload.nowIndex)),b=Number.isFinite(g)&&a.length>0?Math.min(a.length-1,Math.max(0,Math.round(g))):void 0,y=b===void 0||!Number.isFinite(a[b])||f.length===0?void 0:Ir(a[b],Math.max(...f)-Math.min(...f)),v={values:a,texts:p,...b===void 0?{}:{now:b},...n.payload.thresholdValue===void 0?{}:{threshold:n.payload.thresholdValue}},k=(C,M)=>qn(C,r).filter(K=>K.payload.value.kind.kind==="chartStat"&&K.payload.value.kind.stat===M),S=(C,M)=>et(C,r).filter(K=>K.payload.chartAnchor?.at===M&&K.payload.chartAnchor.place!=="through"),I=(C,M,K,Y,J,L,X)=>h`
    <button type="button" class="xtog ${M>0?"on":""}" role="switch" aria-checked=${M>0?"true":"false"}
      aria-label=${J} data-extra=${C}
      title=${Jp(C,M===0?K:M===1?Y:`${Y}: all ${M} of them`)}
      @click=${()=>e.update(ne=>{if(M>0)for(let D of X(ne))Me(ne,D.payload.id);else L(ne)})}>${M>0?h`<span aria-hidden="true">✓</span>`:H("plus")}</button>`,_=h`<div class="xreadings" role="table" aria-label="Readings" @pointerover=${qa} @focusin=${qa}>
    <div class="xr-row xr-head" role="row">
      <span role="columnheader"><span class="xr-name">Reading</span></span><span role="columnheader"></span>
      <span role="columnheader">Number</span><span role="columnheader">Marker</span>
    </div>
    ${Fb.map(C=>{let M=C.stat!==void 0?p[C.stat]:y,K=C.stat===void 0?"":(jt.find(([L])=>L===C.stat)?.[1]??C.label).toLowerCase(),Y=C.marker==="now"?"the reading at now":`the ${(qt.find(([L])=>L===C.marker)?.[1]??C.label).toLowerCase()}`,J=C.stat!==void 0?`number:${C.stat}`:C.marker!==void 0?`marker:${C.marker}`:void 0;return h`<div class="xr-row" role="row" data-extra=${J??m}>
        <span role="cell"><span class="xr-name">${C.label}</span></span>
        <span role="cell"><span class="xr-v nums">${M??""}</span></span>
        <span role="cell">${C.stat===void 0?m:I(`number:${C.stat}`,k(e.config,C.stat).length,`Print the ${K} as a number`,`Remove the ${K} number`,`${C.label} number`,L=>{tm(L,r,C.stat)},L=>k(L,C.stat))}</span>
        <span role="cell">${C.marker===void 0?m:I(`marker:${C.marker}`,S(e.config,C.marker).length,`Put a marker over ${Y}`,`Remove the marker over ${Y}`,`${C.label} marker`,L=>{Pc(L,r,C.marker)},L=>S(L,C.marker))}</span>
      </div>`})}
  </div>`,E=[...s.map(C=>({el:C,lead:e.resolve(C.payload.value)??"--",title:Te(C,o),kind:"Number"})),...u.map(C=>{let{at:M,place:K}=C.payload.chartAnchor,Y=qt.find(([L])=>L===M)?.[1]??"Reading";if(K==="through")return{el:C,lead:M==="now"?"\u2502":"\u2500",title:M==="zero"?"Zero":Y,kind:"Line"};let J=C.kind==="text"?e.resolve(C.payload.value)??"\u25CF":C.kind==="icon"?_E(e.resolve(C.payload.symbol)):"\u25C6";return{el:C,lead:J,title:Y,kind:"Marker"}}),...l.map(C=>({el:C,lead:H("clock"),title:"Clock times",kind:"Times"})),...c.map(C=>({el:C,lead:H("chartDots"),title:"Reading dots",kind:"Dots"})),...d.map(C=>({el:C,lead:H("chartGrid"),title:"Grid lines",kind:"Grid"}))],z=E.length;return h`
    <div class="hint keep">Each one you switch on is a layer in this chart's group.</div>
    ${qx("chart",i,n.payload.style==="bars",v)}
    ${t??m}
    <div class="field list-field"><span>Readings</span>${_}</div>
    <div class="hint">A number is a text layer that prints the reading. A marker is an icon over it, pushed down
      rather than off the chart when the bar is tall. Newest, Change and Total start with the entity's unit.</div>
    ${z===0?m:h`
      <div class="shown-head">On this chart <span class="shown-count">${z}</span></div>
      ${Zp(e,E,{icon:"close",danger:!0,label:C=>`Delete this ${C}`,run:C=>e.update(M=>Me(M,C))})}
      <div class="hint">Click a row to set its value, colour and size here. More settings selects that layer.
        On the preview, click right on a dot to pick the dots.</div>`}`}var bo,jx="wrist-assistant-extras-preview",hd=(()=>{try{return window.localStorage.getItem(jx)!=="off"}catch{return!0}})();function ax(e,n){hd=e;try{window.localStorage.setItem(jx,e?"on":"off")}catch{}Le(n)}function qa(e){if(!hd)return;let n=e.target?.closest?.("[data-extra]")?.getAttribute("data-extra");!n||n===bo||(bo=n,Le(e.currentTarget))}function Jp(e,n){return hd?n:`${vp(e)} ${n}.`}function qx(e,n={},t=!1,i={}){if(!hd)return h`<button class="link xprev-show" @click=${l=>ax(!0,l.currentTarget)}>
      ${H("show")}<span>Show preview</span></button>`;let a=e==="timeline"?"timeline:times":e==="image"?"image:time":void 0,r=bo!==void 0&&xp(bo)===e?bo:a,o=r===void 0?void 0:n[r],s=e==="image"?"picture":e;return h`<div class="xprev">
    <span class="well">${Mb(e,r,t,i)}</span>
    <span class="xprev-t">
      <b>${r===void 0?"Preview":Lb(r)}</b>
      <span>${r===void 0?`Point at a ${e==="chart"?"switch":"button"} below to see what it adds to the ${s}.`:vp(r)}</span>
      ${o?h`<span class="xprev-why">${o}</span>`:m}
    </span>
    <button class="icon xprev-hide" title="Hide the preview" aria-label="Hide the preview"
      @click=${l=>ax(!1,l.currentTarget)}>${H("hide")}</button>
  </div>`}function Zp(e,n,t){return h`<div class="chart-numbers">${rp(n,a=>a.el.payload.id,({el:a,lead:r,title:o,kind:s})=>{let l=a.payload.id,c=s.toLowerCase();return h`
    <div class="num-row">
      <details class="num-item"
        @pointerenter=${()=>e.peekLayer(l,!0)}
        @pointerleave=${()=>e.peekLayer(l,!1)}>
        <summary class="num-pick" title=${`Show the settings for this ${c}`}>
          <span class="num-lead">${r}</span>
          <span class="num-text"><span class="num-title">${o}</span><span class="num-kind">${s}</span></span>
          <span class="chev">${H("chevron")}</span>
        </summary>
        <div class="num-body">
          ${IE(e,a)}
          <div class="chips"><button class="small" title=${`Select this ${c} to see all of its settings`}
            @click=${()=>e.selectLayer(l)}><span>More settings</span></button></div>
        </div>
      </details>
      <button class="icon ${t.danger?"danger":""}" title=${t.label(c)} aria-label=${t.label(c)}
        @click=${()=>{e.peekLayer(l,!1),t.run(l)}}>${H(t.icon)}</button>
    </div>`})}</div>`}function IE(e,n){let t=n.payload.id,i=`quick-${t}`,a=e.activeFamily,r=(d,u)=>e.update(p=>{let f=p.elements.find(g=>g.payload.id===t);f&&d(f)},`${i}-${u}`),o=De(n.kind).payload,s=ta(n),l=s===void 0?m:Ce("Colour",s,d=>r(u=>{ta(u)!==void 0&&(u.payload.colorSlot.baseColorHex=d??"#FFFFFF")},"colour"),!1,o.colorSlot?.baseColorHex??"#FFFFFF"),c=n.payload.chartAnchor;switch(n.kind){case"text":{let d=n.payload.value.kind;return h`
        ${d.kind==="chartStat"?Fe("Number",d.stat,[...jt],u=>r(p=>{p.kind==="text"&&p.payload.value.kind.kind==="chartStat"&&(p.payload.value={...p.payload.value,kind:{...p.payload.value.kind,stat:u}})},"stat")):c||_t(n.payload)?m:he(e,n.payload.value,u=>r(p=>{p.kind==="text"&&(p.payload.value=u)},"value"),{showResolved:!0,label:n.payload.countdown?"Until":"Text",key:`${i}-value`})}
        ${c&&c.place!=="through"?rx(e,t,c,r):m}
        <div class="grid2">
          ${oi(e,n,a,"Font size",{step:1,min:4,def:o.fontSize})}
          ${n.payload.countdown||_t(n.payload)?m:l}
        </div>`}case"icon":return h`
        ${c?rx(e,t,c,r):Ar(n.payload)?fx(n.payload,(d,u)=>r(p=>{p.kind==="icon"&&d(p.payload)},u??"svg-path")):he(e,n.payload.symbol,d=>r(u=>{u.kind==="icon"&&(u.payload.symbol=d)},"symbol"),{noFormat:!0,showResolved:!0,symbol:!0,label:"Symbol",key:`${i}-symbol`,setSymbolPath:d=>r(u=>{u.kind==="icon"&&(d?u.payload.path=d:delete u.payload.path,delete u.payload.viewBox)},"symbol")})}
        <div class="grid2">
          ${oi(e,n,a,"Icon size",{step:1,min:4,def:o.size})}
          ${l}
        </div>`;case"shape":return n.payload.kind!=="line"?h`
          <div class="grid2">
            ${n.payload.kind==="roundedRectangle"?re("Corner radius",n.payload.cornerRadius,d=>r(u=>{u.kind==="shape"&&(u.payload.cornerRadius=d??6)},"radius"),{step:.5,min:0,def:o.cornerRadius,unit:"pt"}):m}
            ${l}
          </div>`:h`
        ${c?Vx(e,c,i):m}
        <div class="grid2">
          ${re("Thickness",n.payload.thickness,d=>r(u=>{u.kind==="shape"&&(u.payload.thickness=d??1)},"thick"),{step:.5,min:.5,def:o.thickness,unit:"pt"})}
          ${l}
        </div>`;case"gauge":{let d=n.payload;return h`
        ${he(e,d.value,u=>r(p=>{p.kind==="gauge"&&(p.payload.value=u)},"value"),{showResolved:!0,label:"Reading",key:`${i}-value`})}
        <div class="grid2">
          ${d.style==="dots"?m:oi(e,n,a,"Line width",{step:.5,min:.5,def:o.lineWidth})}
          ${l}
        </div>`}case"chart":{let d=n.payload;return h`
        ${he(e,d.value,u=>r(p=>{p.kind==="chart"&&(p.payload.value=u)},"value"),{label:"Readings",noShare:!0,key:`${i}-value`})}
        ${ae("Style",d.style,yx,u=>r(p=>{p.kind==="chart"&&(p.payload.style=u)},"style"),{def:o.style})}
        <div class="grid2">
          ${d.style==="bars"?m:oi(e,n,a,"Line width",{step:.5,min:.5,def:o.lineWidth})}
          ${l}
        </div>`}case"timeline":return h`
        ${he(e,n.payload.value,d=>r(u=>{u.kind==="timeline"&&(u.payload.value=d)},"value"),{label:"States",noShare:!0,key:`${i}-value`})}`;case"image":{let d=n.payload;return h`
        ${ae("Source",d.source,[["camera","Camera"],["entityPicture","Entity picture"],["inline","Upload"]],u=>r(p=>{p.kind==="image"&&mx(p.payload,u)},"source"),{def:o.source})}
        ${ae("Picture",d.contentMode,[["fill","Fill the frame"],["fit","Fit inside"]],u=>r(p=>{p.kind==="image"&&(p.payload.contentMode=u)},"mode"),{def:o.contentMode})}`}case"tap":return pd(e,n.payload,(d,u)=>r(p=>{p.kind==="tap"&&d(p.payload)},u??"action"),i);case"chartTimes":{let d=n.payload;return h`
        ${ln("Times",d.timeLabelCount,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.timeLabelCount=Math.max(0,Math.min(Ii,Math.round(u))))},"count"),{min:0,max:Ii,step:1,def:o.timeLabelCount,format:u=>u<=0?"None":String(Math.round(u)),range:!1})}
        <div class="grid2">
          ${re("Time size",d.labelSize,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.labelSize=Math.min(Wn,Math.max(Kn,u??$t)))},"size"),{step:.5,min:Kn,max:Wn,def:o.labelSize,unit:"pt"})}
          ${Ce("Time colour",d.labelColorHex,u=>r(p=>{p.kind==="chartTimes"&&(p.payload.labelColorHex=u??Ct)},"colour"),!1,o.labelColorHex)}
        </div>`}case"imageTime":return h``;case"chartDots":{let d=n.payload,u=e.config.elements.find(g=>g.payload.id===d.chart),p=u?.kind==="chart"?Ge(e.config,a,u).size??u.payload.lineWidth:void 0,f=p===void 0?void 0:Math.round(p*18)/10;return h`
        ${ae("Dots",d.dots,gx,g=>r(b=>{b.kind==="chartDots"&&(b.payload.dots=g)},"mode"),{def:"auto"})}
        <div class="grid2">
          ${re("Dot size",d.size??f,g=>r(b=>{if(b.kind!=="chartDots")return;let y=Kt(g);y===void 0||y===f?delete b.payload.size:b.payload.size=y},"size"),{step:.5,min:1,max:12,...f===void 0?{}:{def:f},unit:"pt"})}
          ${zp("Dot colour",d.colorHex,"Series colour",g=>r(b=>{b.kind==="chartDots"&&(g===void 0?delete b.payload.colorHex:b.payload.colorHex=g)},"colour"))}
        </div>`}case"chartGrid":{let d=n.payload;return h`
        <div class="grid2">
          ${re("Lines",d.lines,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.lines=Ri(u??Vn))},"lines"),{step:1,min:1,max:4,def:Vn})}
          ${re("Thickness",d.thickness,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.thickness=Ai(u??Bn))},"thick"),{step:.25,min:ts,max:ns,def:Bn,unit:"pt"})}
        </div>
        ${Ce("Colour",d.colorHex,u=>r(p=>{p.kind==="chartGrid"&&(p.payload.colorHex=u??fn)},"colour"),!1,fn)}`}default:return h`${l}`}}function rx(e,n,t,i){let a=qt.filter(([r])=>mn(r)||r===t.at);return h`
    <div class="grid2">
      ${Fe("Reading",t.at,a,r=>i(o=>{o.payload.chartAnchor&&(o.payload.chartAnchor.at=r)},"at"))}
      ${Fe("Sits",t.place,os.filter(([r])=>r!=="through"),r=>i(o=>{o.payload.chartAnchor&&(o.payload.chartAnchor.place=r)},"place"))}
    </div>`}function HE(e,n,t){if(n.kind==="tap")return m;let i=n.payload.id,a=ft(e.config,i)[0],r=(s,l)=>e.update(c=>{let d=c.elements.find(u=>u.kind==="tap"&&u.payload.attachedTo===i);d&&s(d.payload)},l?`${t}-${l}`:void 0),o=Wc(e.config,n);return h`
    ${xe("Tappable",a!==void 0,s=>e.update(l=>{s?Bs(l,i):Vs(l,i)}))}
    ${a?h`<div class="value-editor">
          ${pd(e,a.payload,r,`${t}-attached`)}
          <div class="field"><span>Tap area</span>
            <div class="chips">
              <button class="pick ${e.tapAreaShown?"on":""}" aria-pressed=${e.tapAreaShown?"true":"false"}
                title=${e.tapAreaShown?"Back to the normal face":"Dim the face and show only this layer's tap area, with corners to drag"}
                @click=${()=>e.showTapArea(!e.tapAreaShown)}><span class="glyph">☞</span>${e.tapAreaShown?"Hide":"Show"}</button>
              ${As(a.payload.outset)?m:h`<button class="icon" title="Fit the tap area to the layer again" aria-label="Fit the tap area to the layer again"
                    @click=${()=>r(s=>{s.outset={...bc}})}>${H("reset")}</button>`}
            </div>
          </div>
        </div>
        ${FE(e,a.payload.id)}
        <div class="hint">The tap area follows this layer in every shape, so there is nothing to line up. Show it to drag its corners past the layer, so a small layer is still an easy target. Where two tap areas overlap, the one higher in Layers wins.</div>`:h`<div class="hint">Tapping this layer runs an action of its own, instead of the complication's tap action. It starts as <b>${Zt(o)}</b>.</div>`}`}function ox(e){return e.length>=2&&e.startsWith('"')&&e.endsWith('"')?e.slice(1,-1):e}function _E(e){return e===void 0?"\u25C6":e.includes("up")?"\u25B2":e.includes("down")?"\u25BC":e.startsWith("circle")?"\u25CF":"\u25C6"}function Te(e,n){return e.payload.name?e.payload.name:Yx(e,n)}function PE(e){let n=e.trim();return n===""?void 0:n}function Yx(e,n){let t=e.payload.chartAnchor;if(t!==void 0){let i=qt.find(([a])=>a===t.at)?.[1]??"Reading";return t.place==="through"?`${i} line`:`${i} marker`}switch(e.kind){case"text":return ox(Oe(e.payload.value,n));case"icon":return Ar(e.payload)?"Custom SVG":ox(Oe(e.payload.symbol,n));case"gauge":return Oe(e.payload.value,n);case"chart":return Oe(e.payload.value,n);case"timeline":return Oe(e.payload.value,n);case"shape":return e.payload.kind==="roundedRectangle"?"Rounded rectangle":e.payload.kind;case"image":{if(e.payload.source==="inline")return"picture";let i=e.payload.entity;return i.displayName||i.entityId||(e.payload.source==="camera"?"camera":"picture")}case"tap":{let i=e.payload.action,a="entityId"in i?i.displayName||i.entityId:i.type==="callService"?[i.serviceDomain,i.serviceName].filter(r=>r!=="").join("."):i.type==="openPage"&&e.payload.openPageName||"";return a?`${i.type} \xB7 ${a}`:i.type}case"chartTimes":return"Clock times";case"chartDots":return"Reading dots";case"chartGrid":return"Grid lines";case"imageTime":return"Timestamp";case"list":return"List"}}function Xx(e,n){let t=Rt(e.config,n.id),i=ye(e),a=(r,o)=>e.update(s=>{let l=s.groups?.find(c=>c.id===n.id);l&&r(l)},o?`group-${n.id}-${o}`:void 0);return Ie(e,"content","Group",h`
    ${_e("Name",n.name,r=>a(o=>{o.name=r},"name"))}
    ${xe("Move as one",n.locked,r=>a(o=>{o.locked=r}))}
    <div class="hint">${n.locked?"Locked: a drag on any of these layers moves all of them. Unlock to move one at a time.":"Unlocked: each layer moves on its own. With the group selected, a drag still moves all of them. Lock it when the part is the way you want it."}</div>
    <div class="shown-head">Layers <span class="shown-count">${t.length}</span></div>
    ${Zp(e,t.map(r=>({el:r,lead:H(r.kind),title:Te(r,i),kind:lt[r.kind]})),{icon:"ungroup",label:r=>`Take this ${r} out of the group`,run:r=>e.update(o=>Br(o,r,void 0))})}
    <div class="row-acts">
      <button class="small" title="Keep the layers where they are and drop the folder" @click=${()=>e.update(r=>Ea(r,n.id))}>Ungroup</button>
    </div>
    <div class="hint">Click a row to open its main settings here. More settings selects that layer for the rest.
      The button beside a row takes that layer out of the group and keeps it on the face.</div>`,{color:le.group,icon:"folder",summary:`${t.length} layers \xB7 ${n.locked?"moves as one":"unlocked"}`})}function Jx(e,n){if(n==="inline")return NE(e);let t=e.config.perFamily[n];if(!t)return h`<div class="hint">No settings stored for ${ie(n)} yet.</div>
      <button class="small" @click=${()=>e.update(d=>{d.perFamily[n]={placements:{},cornerBodyShape:"circle",borderWidth:2,rules:[]}})}>Add ${ie(n)} settings</button>`;let i=(d,u)=>e.update(p=>d(p.perFamily[n]),u?`fam-${n}-${u}`:void 0),a=cd(e.config,n),r=Rn(n),o=t.backgroundColorHex?qe(t.backgroundColorHex):r?"the system's widget material":"transparent",s=t.borderColorHex?`${t.borderWidth} pt ${qe(t.borderColorHex)} border`:"no border",l=Ce(r?"Tile background (blank = the system's widget material)":"Background (blank = transparent)",t.backgroundColorHex,d=>i(u=>{d===void 0?delete u.backgroundColorHex:u.backgroundColorHex=d},"bg"),!0,null),c=ql("Background gradient",t.backgroundFill,d=>i(u=>{if(d===void 0){delete u.backgroundFill;return}u.backgroundFill=d,u.backgroundColorHex=Yt(d,0)},"bgfill"),()=>({kind:"linear",stops:[{at:0,colorHex:t.backgroundColorHex??"#000000"},{at:1,colorHex:t.backgroundColorHex??"#000000"}]}));return h`
    ${Ie(e,"look",`${ie(n)} shape`,h`
      ${r?m:h`${l}${c}`}
      <div class="fgroup">
      ${Ce("Border colour",t.borderColorHex,d=>i(u=>{d===void 0?delete u.borderColorHex:u.borderColorHex=d},"border"),!0,null)}
      ${re("Border width",t.borderWidth,d=>i(u=>{u.borderWidth=d??2},"bw"),{step:.5,min:0,def:2,unit:"pt"})}
      </div>`,{color:le.look,icon:"shape",summary:`${o} \xB7 ${s}`,...t.backgroundColorHex!==void 0||t.backgroundFill!==void 0||t.borderColorHex!==void 0||t.borderWidth!==2?{reset:()=>i(d=>{delete d.backgroundColorHex,delete d.backgroundFill,delete d.borderColorHex,d.borderWidth=2},"reset-look")}:{}})}
    ${r?Ie(e,"home","Home Screen",h`
      ${l}
      ${c}
      <div class="hint">The tile is drawn edge to edge: this colour fills every point of it, and the design is laid out inside the ${ie(n)} box.</div>
      <div class="hint keep">iOS 18 lets a user tint the whole Home Screen. The system then drops the background and draws the design in two tones, so check that it still reads without its colours.</div>
      ${Da(n)?h`<div class="hint keep">${ie(n)} needs ${Da(n)}. An iPhone on an older version is not offered this size when adding a widget, and every other size still draws.</div>`:m}
      ${Oa(e.config.supportedFamilies)?h`<div class="hint keep">${Oa(e.config.supportedFamilies)}</div>`:m}`,{color:le.look,icon:"shape",summary:o,...t.backgroundColorHex!==void 0||t.backgroundFill!==void 0?{reset:()=>i(d=>{delete d.backgroundColorHex,delete d.backgroundFill},"reset-home")}:{}}):m}
    ${n==="corner"?Ie(e,"corner","Corner content",DE(e,t,i),{color:le.content,icon:"content",summary:t.curvedText?"Big curved text":"Layer canvas",...t.curvedText!==void 0||t.bezelText!==void 0||t.bezelGauge!==void 0?{reset:()=>i(d=>{delete d.curvedText,delete d.bezelText,delete d.bezelGauge},"reset-corner")}:{}}):m}
    ${Ie(e,"states","Shape states",nv(e,t.rules,"layout",d=>d.perFamily[n]?.rules,`rules-${n}`),{color:le.states,icon:"states",summary:io(t.rules).replace(/\.$/,""),...t.rules.length>0?{reset:()=>i(d=>{d.rules=[]},"reset-states")}:{}})}
    ${Ie(e,"placements","Layers",h`
      <div class="hint keep">${a===0?`Nothing is on the ${ie(n)} shape. The Layers card offers a copy of another shape's whole arrangement, or you can add layers here one at a time.`:`${a} layer${a===1?" is":"s are"} on the ${ie(n)} shape. They belong to this shape alone: no other shape draws them, and editing one here cannot reach another shape.`}</div>`,{color:le.position,icon:"place",summary:a===0?"Nothing on it":`${a} layer${a===1?"":"s"}`})}`}function NE(e){let n=e.config.inline;if(!n)return h`<div class="hint">This complication lists Inline but has no Inline text yet (it was saved by an older integration). The watch shows "No inline layout" until one is added.</div>
      <button class="small" @click=${()=>e.addFamily("inline")}>Add Inline text</button>`;let t=(a,r)=>e.update(o=>{o.inline&&a(o.inline)},r?`inline-${r}`:void 0),i=ye(e);return h`
    ${Ie(e,"content","Inline text",h`
      ${_e("Label (blank = value only)",n.label??"",a=>t(r=>{a?r.label=a:delete r.label},"label"))}
      ${he(e,n.value,a=>t(r=>{r.value=a},"value"),{showResolved:!0,label:"Text",key:"inline-value"})}
      ${Xp(e,n.countdown===!0,n.value,a=>t(r=>{a?r.countdown=!0:delete r.countdown}))}`,{color:le.content,icon:"text",summary:Ze(`${n.label?`${n.label}: `:""}${Oe(n.value,i)}`,48)})}
    ${Ie(e,"symbol","Symbol",h`
      ${Jl(e,n.symbol??"",a=>t(r=>{a?r.symbol=a:delete r.symbol},"symbol"),"inline-symbol")}
      <div class="hint">Drawn before the text. Leave it blank for text only.</div>
      <div class="field readout"><span>On the face</span><span class="readout-v">${n.symbol?`${n.symbol} `:""}${n.label?`${n.label}: `:""}${e.resolve(n.value)??"--"}</span></div>`,{color:le.look,icon:"icon",summary:n.symbol||"None"})}`}function DE(e,n,t){let i=n.curvedText?"curved":"canvas",a=n.bezelGauge?"gauge":n.bezelText?"text":"none";return h`
    <div class="fgroup">
    ${ae("Main content",i,[["canvas","Layer canvas"],["curved","Big curved text"]],r=>t(o=>{r==="curved"?o.curvedText||(o.curvedText=U("Text")):(delete o.curvedText,delete o.curvedColorHex)}))}
    ${i==="curved"&&n.curvedText?h`
      ${he(e,n.curvedText,r=>t(o=>{o.curvedText=r},"curved"),{showResolved:!0,label:"Curved text",key:"fam-corner-curved"})}
      ${Ce("Curved text colour",n.curvedColorHex??"#FFFFFF",r=>t(o=>{r===void 0?delete o.curvedColorHex:o.curvedColorHex=r},"curvedcolor"))}
      <div class="hint">Curved text replaces the layer canvas in the corner. The watch draws it big along the corner curve, like the stock Calendar and Weather corners.</div>
    `:m}
    </div>
    <div class="fgroup">
    ${ae("Bezel",a,[["none","None"],["text","Text label"],["gauge","Gauge arc"]],r=>t(o=>{r==="text"?(delete o.bezelGauge,o.bezelText||(o.bezelText=U("Label"))):r==="gauge"?(delete o.bezelText,o.bezelGauge||(o.bezelGauge={value:U("50"),minValue:0,maxValue:100,colorHexes:["#34C759","#FFCC00","#FF3B30"]})):(delete o.bezelText,delete o.bezelGauge)}))}
    ${a==="text"&&n.bezelText?h`
      ${he(e,n.bezelText,r=>t(o=>{o.bezelText=r},"bezel"),{showResolved:!0,label:"Bezel label",key:"fam-corner-bezel"})}
      ${Xp(e,n.bezelCountdown===!0,n.bezelText,r=>t(o=>{r?o.bezelCountdown=!0:delete o.bezelCountdown}))}`:m}
    ${a==="gauge"&&n.bezelGauge?OE(e,n.bezelGauge,t):m}
    </div>`}function OE(e,n,t){let i=[n.colorHexes[0]??"#34C759",n.colorHexes[1]??n.colorHexes[n.colorHexes.length-1]??"#FFCC00",n.colorHexes[n.colorHexes.length-1]??"#FF3B30"],a=r=>o=>t(s=>{let l=[...i];l[r]=o??l[r],s.bezelGauge.colorHexes=l},`gstop${r}`);return h`
    ${he(e,n.value,r=>t(o=>{o.bezelGauge.value=r},"gvalue"),{showResolved:!0,label:"Reading",key:"fam-corner-gvalue"})}
    <div class="grid2">
      ${re("Gauge min",n.minValue,r=>t(o=>{o.bezelGauge.minValue=r??0},"gmin"),{step:1})}
      ${re("Gauge max",n.maxValue,r=>t(o=>{o.bezelGauge.maxValue=r??100},"gmax"),{step:1})}
    </div>
    ${Ce("Arc colour (min end)",i[0],a(0))}
    ${Ce("Arc colour (middle)",i[1],a(1))}
    ${Ce("Arc colour (max end)",i[2],a(2))}
    ${xe("End labels",!!(n.minLabel||n.maxLabel),r=>t(o=>{let s=o.bezelGauge;r?(s.minLabel=U(String(s.minValue)),s.maxLabel=U(String(s.maxValue))):(delete s.minLabel,delete s.maxLabel)}))}
    ${n.minLabel?he(e,n.minLabel,r=>t(o=>{o.bezelGauge.minLabel=r},"gminlab"),{label:"Min label",key:"fam-corner-gminlab"}):m}
    ${n.maxLabel?he(e,n.maxLabel,r=>t(o=>{o.bezelGauge.maxLabel=r},"gmaxlab"),{label:"Max label",key:"fam-corner-gmaxlab"}):m}`}var mL=ue.map(e=>[e,ie(e)]),Qp={setColor:"Set colour",setOpacity:"Set opacity",setText:"Set text",setIcon:"Set icon",setFontSize:"Set size",setFontWeight:"Set weight",setFontDesign:"Set typeface",setFontWidth:"Set width",setItalic:"Set italic",setRotation:"Set rotation",hide:"Hide",show:"Show",setGaugeValue:"Set gauge value",setGaugeMin:"Set gauge min",setGaugeMax:"Set gauge max",setBorderColor:"Set border colour",setBorderWidth:"Set border width",setBackgroundColor:"Set background colour"},zE=Object.keys(Qp),ed=["color","text","fontSize","fontWeight","fontDesign","fontWidth","italic","visibility"];function GE(e,n=!1){let t=Ur[e].filter(i=>!n||ed.includes(i));return zE.filter(i=>t.includes(tt[i]))}function Zx(e,n,t,i){let a=n!==void 0&&!e.some(r=>r.id===n);return h`<label class="field"><span>Changes</span>
      <select @change=${r=>i(r.target.value,r.target)}>
        ${yE(e,n,t).map(([r,o])=>h`<option value=${r} ?selected=${r===(n??"")}>${o}</option>`)}
      </select></label>
    ${a?h`<div class="hint warn">The part this changed has been removed, so it changes nothing. Pick another part or Whole text.</div>`:m}`}var BE={now:"the time",hour:"the hour",minute:"the minute",weekday:"the weekday",day:"the day",month:"the month",timestamp:"the timestamp"};function Kl(e,n){if(e.entityId==="")return"(no entity)";let t=e.displayName.trim();if(t!==""&&t!==e.entityId)return t;let i=n?.hass?.states[e.entityId]?.attributes.friendly_name;return typeof i=="string"&&i.trim()!==""?i.trim():e.entityId}function Ze(e,n){let t=e.replace(/\s+/g," ").trim();return t.length>n?`${t.slice(0,n-1)}\u2026`:t}function Qx(e){if(!e||Xe(e))return"";let n=[];return e.decimals!==void 0&&n.push(`${e.decimals} dp`),e.multiply!==void 0&&n.push(`\xD7${e.multiply}`),e.offset!==void 0&&n.push(`${e.offset<0?"":"+"}${e.offset}`),e.prefix&&n.push(`"${e.prefix}" first`),e.suffix&&n.push(`"${e.suffix}" after`),e.useEntityUnit&&n.push("with unit"),e.relativeTime&&n.push("as relative time"),e.duration&&n.push("as a duration"),e.timestamp&&n.push(`as ${(as.find(([t])=>t===e.timestamp)?.[1]??e.timestamp).toLowerCase()}`),rs(e.timestamp)&&e.hideMinutes&&n.push("no minutes"),rs(e.timestamp)&&e.hideDayPeriod&&n.push("no AM/PM"),e.textCase&&n.push(e.textCase==="capitalized"?"Capitalized":e.textCase==="upper"?"UPPER":"lower"),n.length===0?"":` (${n.join(", ")})`}function Oe(e,n){return`${Ao(e,n)}${Qx(e.format)}`}function Ao(e,n){let t=e.kind;switch(t.kind){case"literal":return t.value?`"${Ze(t.value,40)}"`:"(empty)";case"entityState":return Kl(t,n);case"entityAttribute":return t.attribute?`${Kl(t,n)} \xB7 ${t.attribute}`:Kl(t,n);case"entityAge":return`age of ${Kl(t,n)}`;case"aggregate":return VE(t.aggregate);case"time":return BE[t.timeField];case"dataAge":return"data age";case"item":return t.field?`item ${t.field}`:"item field";case"listStat":return t.stat==="total"?"items in total":"items shown";case"jinja":return t.value?`template ${Ze(t.value,32)}`:"template (empty)";case"named":return t.id===""?"(no value chosen)":n?.values?.find(a=>a.id===t.id)?.name?.trim()||`named ${t.id.slice(0,8)}`;case"chartStat":{let i=(jt.find(([o])=>o===t.stat)?.[1]??t.stat).toLowerCase();if(t.layer==="")return`${i} (no chart chosen)`;let a=n?.elements?.find(o=>o.kind==="chart"&&o.payload.id===t.layer),r=a?.kind==="chart"&&a.payload.value.kind.kind!=="chartStat"?Ao(a.payload.value,n):"a missing chart";return`${i} of ${r}`}}}function VE(e){let n=e.scope.kind==="entities"?`${e.scope.entities.length} entit${e.scope.entities.length===1?"y":"ies"}`:e.scope.domains.length>0?e.scope.domains.join(" + "):"matching entities";return`${e.function} of ${n}`}function Ya(e,n,t){if(t<0||t>=e.length)return;let[i]=e.splice(n,1);e.splice(t,0,i)}function UE(e,n,t,i,a,r){let o=(s,l)=>e.update(c=>{let d=i(c);d&&s(d)},l?`${a}-${l}`:void 0);return h`
    ${n.length===0?h`<div class="hint keep">No rules yet. A rule checks values and changes how this ${t==="layout"?"family":"layer"} looks.</div>`:m}
    ${n.map((s,l)=>KE(e,s,l,n.length,t,o,`${a}-${s.id}`,r))}
    <div class="adders"><button class="small" @click=${()=>o(s=>{s.push(La())})}>+ rule</button></div>
    <div class="hint">Inside a rule the first matching case wins. Across rules the later rule wins for the same property. Different properties add up.</div>`}function KE(e,n,t,i,a,r,o,s){let l=e.liveBranch(n),c=e.forced.get(n.id)??"live",d=f=>c==="live"?f==="live":c==="otherwise"?f==="otherwise":c.caseId===f,u=(f,g)=>r(b=>{let y=b.find(v=>v.id===n.id);y&&f(y)},g),p=s!==void 0&&n.partId!==void 0;return h`<div class="rule-box">
    <div class="rule-head">
      <b>Rule ${t+1}</b>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(f=>Ya(f,t,t-1))}>${H("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i-1} @click=${()=>r(f=>Ya(f,t,t+1))}>${H("down")}</button>
      <button class="icon danger" title="Delete rule" @click=${()=>r(f=>{let g=f.findIndex(b=>b.id===n.id);g>=0&&f.splice(g,1)})}>${H("delete")}</button>
    </div>
    ${s===void 0?m:Zx(s,n.partId,ye(e),f=>u(g=>{f?g.partId=f:delete g.partId}))}
    <div class="field"><span>Preview</span>
      <div class="branches">
        <button class=${d("live")?"active":""} @click=${()=>e.setForced(n.id,"live")}>Live</button>
        ${n.cases.map((f,g)=>h`<button class="${d(f.id)?"active":""} ${l===f.id?"live-match":""}" @click=${()=>e.setForced(n.id,{caseId:f.id})}>Case ${g+1}</button>`)}
        ${n.otherwise?h`<button class="${d("otherwise")?"active":""} ${l==="otherwise"?"live-match":""}" @click=${()=>e.setForced(n.id,"otherwise")}>Otherwise</button>`:m}
      </div>
    </div>
    ${n.cases.map((f,g)=>WE(e,f,g,n,a,u,`${o}-${f.id}`,p))}
    <div class="adders"><button class="small" @click=${()=>u(f=>{f.cases.push(iu())})}>+ case</button></div>
    ${xe("Otherwise",n.otherwise!==void 0,f=>u(g=>{f?g.otherwise=g.otherwise??[]:delete g.otherwise}))}
    ${n.otherwise?h`<div class="case-box otherwise">
          <div class="hint keep">${l==="otherwise"?h`<b>Active now.</b> `:m}Changes when no case matches:</div>
          ${ev(e,n.otherwise,a,f=>u(g=>{g.otherwise&&f(g.otherwise)}),`${o}-otherwise`,p)}
        </div>`:m}
  </div>`}function WE(e,n,t,i,a,r,o,s=!1){let l=(d,u)=>r(p=>{let f=p.cases.find(g=>g.id===n.id);f&&d(f)},u),c=e.liveBranch(i)===n.id;return h`<div class="case-box ${c?"match":""}">
    <div class="rule-head">
      <span>Case ${t+1}${c?h` <span class="ok">· active now</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon" title="Move up" ?disabled=${t===0} @click=${()=>r(d=>Ya(d.cases,t,t-1))}>${H("up")}</button>
      <button class="icon" title="Move down" ?disabled=${t===i.cases.length-1} @click=${()=>r(d=>Ya(d.cases,t,t+1))}>${H("down")}</button>
      <button class="icon danger" title="Delete case" @click=${()=>r(d=>{let u=d.cases.findIndex(p=>p.id===n.id);u>=0&&d.cases.splice(u,1)})}>${H("delete")}</button>
    </div>
    <div class="row-inline">
      ${ae("When",n.when.join,[["all","All of these are true"],["any","Any of these is true"]],d=>l(u=>{u.when.join=d}))}
    </div>
    ${n.when.tests.length===0?h`<div class="hint keep">No tests: this case always matches.</div>`:m}
    ${n.when.tests.map((d,u)=>jE(e,d,u,p=>l(f=>{let g=f.when.tests.find(b=>b.id===d.id);g&&p(g)}),()=>l(p=>{p.when.tests=p.when.tests.filter(f=>f.id!==d.id)}),`${o}-${d.id}`))}
    <div class="adders">
      <button class="small" @click=${()=>l(d=>{d.when.tests.push(nu())})}>+ test</button>
      <select class="adder" @change=${d=>{let u=d.target,p=u.value;if(u.value="",!p)return;let f=kb(p,yb(e.hass?.states));l(g=>{g.when.tests.push(...f)})}}>
        <option value="">+ preset…</option>
        ${vb.map(d=>h`<option value=${d.kind} title=${d.hint}>${d.label}</option>`)}
      </select>
    </div>
    <div class="hint keep" style="margin-top:8px">Then:</div>
    ${ev(e,n.then,a,d=>l(u=>d(u.then)),`${o}-then`,s)}
  </div>`}function jE(e,n,t,i,a,r){let o=(u,p)=>i(u,p?`${r}-${p}`:void 0),s=n.comparison,l=Bi(s.kind),c=e.evaluateTest(n),d=m;switch(l){case"value":d=he(e,s.value??U(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Compare with",key:`${r}-rhs`});break;case"between":d=h`${he(e,s.value??U(""),u=>o(p=>{p.comparison.value=u},"rhs"),{showResolved:!0,label:"Lower bound",key:`${r}-rhs`})}
        ${he(e,s.upper??U(""),u=>o(p=>{p.comparison.upper=u},"upper"),{showResolved:!0,label:"Upper bound",key:`${r}-upper`})}`;break;case"pattern":d=h`${_e("Pattern",s.pattern??"",u=>o(p=>{p.comparison.pattern=u},"pattern"),{mono:!0,placeholder:"^on$"})}
        ${s.pattern&&!qE(s.pattern)?h`<div class="hint warn">This pattern does not compile. The test fails until it does.</div>`:m}`;break;case"times":d=h`<div class="row-inline">
          ${sx(e,"From",s.value??U("22:00"),u=>o(p=>{p.comparison.value=u},"rhs"),`${r}-rhs`)}
          ${sx(e,"To",s.upper??U("06:00"),u=>o(p=>{p.comparison.upper=u},"upper"),`${r}-upper`)}
        </div>
        <div class="hint">The start is included and the end is not. An end earlier than the start wraps midnight, so 22:00 to 06:00 is the night. Equal times match nothing.</div>`;break;case"options":d=YE(n.value)?XE(s.options??[],u=>o(p=>{p.comparison.options=hp(u)},"options")):_e("Options (comma separated)",(s.options??[]).join(", "),u=>o(p=>{p.comparison.options=u.split(",").map(f=>f.trim()).filter(Boolean)},"options"));break;case"none":break}return h`<div class="test-box">
    <div class="rule-head">
      <span>Test ${t+1} <span class=${c?"ok":"no"}>${c?"\u2713 true now":"\u2717 false now"}</span></span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete test" @click=${a}>${H("delete")}</button>
    </div>
    ${s.kind==="isStale"?h`<div class="hint keep">True when the watch's cached values are older than the staleness limit. The value below is not read.</div>`:he(e,n.value,u=>o(p=>{p.value=u},"lhs"),{showResolved:!0,label:"Value",key:`${r}-lhs`})}
    ${Fe("Comparison",s.kind,Fm.map(u=>[u,Ga[u]]),u=>o(p=>{p.comparison=au(p.comparison,u)}))}
    ${d}
  </div>`}function qE(e){try{return new RegExp(e),!0}catch{return!1}}function sx(e,n,t,i,a){if(t.kind.kind!=="literal")return he(e,t,i,{showResolved:!0,label:n,key:a});let r=t.kind.value,o=Gi(r)??"";return h`<label class="field"><span>${n}</span>
    <input type="time" .value=${o}
      @input=${ze(s=>i({...t,kind:{kind:"literal",value:s}}))} />
    ${r!==""&&o===""?h`<div class="hint warn">"${r}" is not a 24-hour HH:MM time. The test stays false until it is.</div>`:m}</label>`}function YE(e){return e.kind.kind==="time"&&e.kind.timeField==="weekday"}function XE(e,n){let t=xb(e),i=a=>n(t.includes(a)?t.filter(r=>r!==a):[...t,a]);return h`<div class="field seg-field"><span>Days</span>
    <div class="seg wide" role="group" aria-label="Days">
      ${bb.map((a,r)=>h`<button type="button" role="checkbox" aria-checked=${t.includes(r)?"true":"false"}
        class=${t.includes(r)?"on":""} @click=${()=>i(r)}>${a}</button>`)}
    </div></div>`}function ev(e,n,t,i,a,r=!1){let o=GE(t,r);return h`
    ${n.length===0?h`<div class="hint keep">No changes.</div>`:m}
    ${n.map((s,l)=>JE(e,s,l,t,(c,d)=>i(u=>{u[l]&&c(u[l])},d?`${a}-${l}-${d}`:void 0),()=>i(c=>{c.splice(l,1)}),`${a}-${l}`,r))}
    <select class="adder" @change=${s=>{let l=s.target,c=l.value;l.value="",c&&i(d=>{d.push(Jn(c))})}}>
      <option value="">+ change…</option>
      ${o.map(s=>h`<option value=${s}>${Qp[s]}</option>`)}
    </select>`}var eh=["setColor","setBorderColor","setBackgroundColor"];function JE(e,n,t,i,a,r,o,s=!1){let l=!Ur[i].includes(tt[n.kind]),c=s&&!l&&!ed.includes(tt[n.kind]);return h`<div class="change-box">
    <div class="rule-head">
      <span>${Qp[n.kind]}${l?h` <span class="no">(ignored by ${i==="layout"?"layouts":`${i} layers`})</span>`:c?h` <span class="no">(ignored by a part)</span>`:m}</span>
      <span class="spacer"></span>
      <button class="icon danger" title="Delete change" @click=${r}>${H("delete")}</button>
    </div>
    ${c?h`<div class="hint keep">A part only takes colour, text, size, weight, hide and show. Pick Whole text to use this change.</div>`:m}
    ${tv(e,n,a,o)}
  </div>`}function tv(e,n,t,i){let a=Ws(n.kind),r=m;if(a==="value"){let o=n.value??U("");if(eh.includes(n.kind)){let s=o.kind.kind==="literal";r=h`${s?Ce("Colour",o.kind.kind==="literal"?o.kind.value:"",l=>t(c=>{c.value=U(l??"#FFFFFF")},"color")):he(e,o,l=>t(c=>{c.value=l},"value"),{noFormat:!0,showResolved:!0,label:"Colour from",key:`${i}-value`})}
        <button class="link" @click=${()=>t(l=>{l.value=s?{kind:{kind:"entityAttribute",entityId:"",displayName:"",domain:"",attribute:"rgb_color"}}:U("#FFFFFF")})}>${s?"Read the colour from a value instead":"Use a fixed colour instead"}</button>
        ${s?m:h`<div class="hint">The value must resolve to a hex colour such as <code>#FF9F0A</code>. Empty or invalid results leave the colour unchanged.</div>`}`}else r=he(e,o,s=>t(l=>{l.value=s},"value"),{noFormat:n.kind==="setIcon",symbol:n.kind==="setIcon",showResolved:!0,label:n.kind==="setIcon"?"Symbol":"To",key:`${i}-value`})}else if(a==="number"){let o=n.kind==="setOpacity"?{step:.05,min:0,max:1}:n.kind==="setRotation"?{step:1,unit:"\xB0"}:n.kind==="setFontSize"||n.kind==="setBorderWidth"?{step:.5,min:0,unit:"pt"}:{step:.5,min:0},s=n.kind==="setOpacity"?"Opacity (0 to 1)":n.kind==="setRotation"?"Angle":n.kind==="setFontSize"?"Size":n.kind==="setBorderWidth"?"Width":"Value";r=re(s,n.number??0,l=>t(c=>{c.number=l??0},"number"),o)}else a==="weight"?r=ae("Weight",n.weight??"regular",ja,o=>t(s=>{s.weight=o})):a==="design"?r=h`${ae("Typeface",n.design??"default",wo,o=>t(s=>{s.design=o}))}
      ${qp}`:a==="width"?r=h`${ae("Width",n.width??"standard",ko,o=>t(s=>{s.width=o}))}
      ${jp}`:a==="italic"&&(r=xe("Italic",n.italic!==!1,o=>t(s=>{s.italic=o})));return r}var Pp=new Set,td=new Map,Wl=new Map,jl=new Set,lx=new Map;function ZE(e){let n=e.payload;return n.coloring==="bands"&&(n.bands?.length??0)>0}function nv(e,n,t,i,a,r,o,s={}){let l=ep(n);return!l.ok||Pp.has(a)?h`
      <div class="states-switch">
        <button class="link" ?disabled=${!l.ok} title=${l.ok?"Go back to the table":"These rules cannot be shown as a table"}
          @click=${d=>{Pp.delete(a),Le(d.target)}}>Show as table</button>
        ${l.ok?m:h`<span class="hint keep">${l.reason}</span>`}
      </div>
      ${UE(e,n,t,i,a,o)}`:QE(e,l.table,n[0],t,i,a,r,o,s)}function QE(e,n,t,i,a,r,o,s,l={}){let c=(B,ce)=>e.update(pe=>{let Se=a(pe);Se&&B(Se)},ce?`${r}-${ce}`:void 0),d=n.value??lx.get(r)??o,u=n.rows.length===0,p=n.numberMode||u&&d!==void 0&&!Xy(d)&&tR(e.resolve(d)),f=l.colorByValue===!0,g=Ur[i],b=td.get(r)??new Set,y=ip[i]==="color"&&f?"visibility":ip[i],v=n.columns.length===0&&b.size===0?[y]:[],k=Gy(n.columns,[...b,...v.filter(B=>B!==void 0)],g),S=f&&k.includes("color"),I=fo.get(r),_=t?t.partId:s?.some(B=>B.id===I)?I:void 0,E=s!==void 0&&_!==void 0,z=(E?g.filter(B=>ed.includes(B)):g).filter(B=>!(f&&B==="color")),C=E?k.filter(B=>!ed.includes(B)):[],M=k.includes("color")&&!S,K=(B,ce)=>{if(!t){B?fo.set(r,B):fo.delete(r),Le(ce);return}c(pe=>{let Se=pe[0];Se&&(B?Se.partId=B:delete Se.partId)})},Y=t?e.liveBranch(t):"none",J=t?e.forced.get(t.id)??"live":"live",L=B=>J!=="live"&&(J==="otherwise"?B==="otherwise":J.caseId===B),X=B=>{t&&e.setForced(t.id,L(B)?"live":B==="otherwise"?"otherwise":{caseId:B})},ne=B=>{lx.set(r,B),n.rows.length!==0&&c(ce=>jy(ce,B),"lhs")},D=()=>{fo.delete(r),c(B=>{Ky(B,d??U(""),p,M),_!==void 0&&B[0]&&B[0].partId===void 0&&(B[0].partId=_)})},W=n.rows.map((B,ce)=>cx(e,{key:`${r}-${B.caseId}`,label:Yy(B.comparison,pe=>Oe(pe,ye(e))),columns:k,changes:B.changes,live:Y===B.caseId,forced:L(B.caseId),onForce:()=>X(B.caseId),when:sR(e,B.comparison,`${r}-${B.caseId}`,(pe,Se)=>c(Ne=>{let ke=Ne[0]?.cases.find(pi=>pi.id===B.caseId)?.when.tests[0];ke&&pe(ke.comparison)},Se&&`${B.caseId}-${Se}`)),updChanges:(pe,Se)=>c(Ne=>{let ke=Ne[0]?.cases.find(pi=>pi.id===B.caseId);ke&&pe(ke.then)},Se&&`${B.caseId}-${Se}`),acts:h`
      <button class="icon" title="Move up" ?disabled=${ce===0} @click=${()=>c(pe=>tp(pe,ce,ce-1))}>${H("up")}</button>
      <button class="icon" title="Move down" ?disabled=${ce===n.rows.length-1} @click=${()=>c(pe=>tp(pe,ce,ce+1))}>${H("down")}</button>
      <button class="icon danger" title="Delete this state" @click=${()=>c(pe=>Wy(pe,B.caseId))}>${H("delete")}</button>`})),w=n.otherwise===void 0?m:cx(e,{key:`${r}-otherwise`,label:"Otherwise",columns:k,changes:n.otherwise,live:Y==="otherwise",forced:L("otherwise"),onForce:()=>X("otherwise"),when:h`<span class="when-otherwise">Otherwise</span>`,updChanges:(B,ce)=>c(pe=>{let Se=pe[0]?.otherwise;Se&&B(Se)},ce),acts:h`<button class="icon" title="Remove the Otherwise row" @click=${()=>c(B=>np(B,!1))}>${H("close")}</button>`}),$=Wl.get(r),P=nR.filter(B=>z.includes(B)&&!k.includes(B)),N=mb(d),O={icon:z.includes("icon"),color:z.includes("color")},q=N&&(O.icon||O.color)?hb(N.domain,Gx(e,N.entityId)):[],j=n.rows.length>0||n.otherwise!==void 0,ee=()=>{jl.delete(r),fo.delete(r),c(B=>{let ce=Rl(d??U(""),fb(q,O),void 0,B[0]?.id);_!==void 0&&(ce.partId=_),B.length=0,B.push(ce)},"fill")};return h`
    <div class="states">
      ${he(e,d??U(""),ne,{label:"Testing",showResolved:!0,key:`${r}-lhs`})}
      ${d===void 0?h`<div class="hint keep">Choose what these states look at.</div>`:m}
      ${s===void 0?m:Zx(s,_,ye(e),K)}
      <div class="states-scroll"><table class="states-table">
        <thead>
          <tr>
            <th class="when">When</th>
            ${k.map(B=>h`<th>
              <span>${nn[B]}</span>
              <button class="icon" title=${`Remove the ${nn[B]} column`}
                @click=${ce=>{Wl.set(r,B),Le(ce.target)}}>${H("close")}</button>
            </th>`)}
            <th class="acts"></th>
          </tr>
        </thead>
        <tbody>
          ${W}
          ${w}
          ${n.rows.length===0&&n.otherwise===void 0?h`<tr><td class="empty-row" colspan=${k.length+2}>${By(i)}</td></tr>`:m}
        </tbody>
      </table></div>
      ${C.length===0?m:h`<div class="hint warn">A part ignores ${ud(C.map(B=>nn[B]))}. Pick Whole text to use ${C.length===1?"it":"them"}.</div>`}
      ${S?h`<div class="hint warn">Colour is set by value above, so the Colour column here draws nothing. Switch Colour to One colour to use it, or remove the column.</div>`:m}
      ${$===void 0?m:h`<div class="hint warn confirm-row">
        Remove the ${nn[$]} column? Its ${dx(n,$)} value${dx(n,$)===1?"":"s"} are deleted from every state.
        <button class="danger small" @click=${B=>{Wl.delete(r),td.get(r)?.delete($),Le(B.target),c(ce=>qy(ce,$))}}>Remove</button>
        <button class="small" @click=${B=>{Wl.delete(r),Le(B.target)}}>Cancel</button>
      </div>`}
      ${jl.has(r)?h`<div class="hint warn confirm-row">
        Fill from the entity? The ${n.rows.length} state${n.rows.length===1?"":"s"} in this table ${n.rows.length===1?"is":"are"} replaced by one row per state a ${N?.domain.replace(/_/g," ")} reports.
        <button class="danger small" @click=${B=>{Le(B.target),ee()}}>Fill</button>
        <button class="small" @click=${B=>{jl.delete(r),Le(B.target)}}>Cancel</button>
      </div>`:m}
      <div class="states-add">
        <button class="small" title="Add a row: when the value matches, this ${i==="layout"?"shape":"layer"} changes how it looks" @click=${D}>${H("plus")}<span>Add a state</span></button>
        ${q.length===0?m:h`<button class="small" title=${`Write one row per state a ${N.domain.replace(/_/g," ")} reports, each with an icon and a colour, ready to edit`}
          @click=${B=>{if(j){jl.add(r),Le(B.target);return}ee()}}>${H("plus")}<span>Fill from the entity</span></button>`}
        ${n.otherwise===void 0?h`<button class="small" title="Add an Otherwise row at the bottom: the look when no state above matches" @click=${()=>c(B=>np(B,!0,M))}>${H("plus")}<span>Add otherwise</span></button>`:m}
        ${P.length===0?m:eR(r,P)}
      </div>
      ${J==="live"?m:h`<div class="field"><span>Preview</span>
        <div class="row-acts"><button class="small" @click=${()=>t&&e.setForced(t.id,"live")}>Back to live</button></div>
      </div>`}
      <div class="hint">${p?"States are checked top to bottom and the first match wins, so each band only has to say where it starts.":"States are checked top to bottom and the first match wins. Otherwise applies when none of them do."}</div>
      <div class="hint">Click a row to hold the previews on it, and again to go back to live.</div>
      <div class="states-switch">
        <button class="link" @click=${B=>{Pp.add(r),Le(B.target)}}>Advanced</button>
        <span class="hint">Several rules, several tests per state, or a regular expression.</span>
      </div>
    </div>`}function eR(e,n){let t=Ro(`${e}-columns`),i=(a,r)=>{let o=td.get(e)??new Set;o.add(a),td.set(e,o),Le(r)};return h`
    <button type="button" class="small" popovertarget=${t} aria-haspopup="menu"
      title="Add a column, so every state can change one more setting">${H("plus")}<span>Add a column</span></button>
    <div class="col-menu" id=${t} popover role="menu" aria-label="Add a column" @toggle=${Up}>
      ${n.map(a=>h`<button type="button" role="menuitem" popovertarget=${t} popovertargetaction="hide"
        @click=${r=>i(a,r.target)}>${nn[a]}</button>`)}
    </div>`}function tR(e){let n=(e??"").trim();return n!==""&&Number.isFinite(Number(n))}var nR=["icon","text","color","visibility","opacity","fontSize","fontWeight","fontDesign","fontWidth","italic","rotation","gaugeValue","gaugeMin","gaugeMax","backgroundColor","borderColor","borderWidth"];function dx(e,n){let t=0;for(let i of e.rows)El(i.changes,n)&&(t+=1);return e.otherwise&&El(e.otherwise,n)&&(t+=1),t}function iR(e){return!!e.target?.closest?.("input, select, textarea, button, label, [popover]")}function cx(e,n){return h`<tr class="state-row ${n.live?"live":""} ${n.forced?"forced":""}"
    title=${`${n.label}. Click to hold the previews on this state.`}
    @click=${t=>{iR(t)||n.onForce()}}>
    <td class="when">
      <span class="row-flag" title=${n.forced?"The previews are held on this state":n.live?"This state matches right now":""}>${n.forced?"\u25C9":n.live?"\u25CF":""}</span>
      ${n.when}
    </td>
    ${n.columns.map(t=>h`<td>${aR(e,t,n.changes,n.updChanges,`${n.key}-${t}`)}</td>`)}
    <td class="acts">${n.acts}</td>
  </tr>`}function aR(e,n,t,i,a){let r=El(t,n),o=Ro(a);if(!r)return h`<button type="button" class="cell empty" title=${`${nn[n]} unchanged. Click to set it for this state.`}
      @click=${c=>{i(d=>{d.push(Jn(Ju[n]))}),xx(c.target,o)}}>${rR(n)}</button>`;let s=(c,d)=>i(u=>{let p=u.find(f=>tt[f.kind]===n);p&&c(p)},d&&`${n}-${d}`),l=nn[n];return h`
    <button type="button" class="cell filled" popovertarget=${o} aria-haspopup="dialog" title=${`${l}. Click to change it.`}>${oR(e,r)}</button>
    <div class="value-pop" id=${o} popover role="dialog" aria-label=${l} @toggle=${Up}>
      <div class="pop-head">
        <b>${l}</b>
        <span class="spacer"></span>
        <button type="button" class="small" popovertarget=${o} popovertargetaction="hide">Done</button>
      </div>
      ${yo.has(o)?h`${n==="visibility"?ae("This state",r.kind==="hide"?"hide":"show",[["show","Shown"],["hide","Hidden"]],c=>s(d=>{d.kind=c})):tv(e,r,s,a)}
          <button class="link" @click=${c=>{c.target.closest("[popover]")?.hidePopover(),i(d=>{let u=d.findIndex(p=>tt[p.kind]===n);u>=0&&d.splice(u,1)})}}>Leave ${l.toLowerCase()} unchanged</button>`:m}
    </div>`}function rR(e){let n=Ju[e];return eh.includes(n)?h`<span class="swatch ghost"></span>`:e==="icon"?h`<span class="ghost-icon">${H("icon")}</span>`:h`<span class="ghost-box"></span>`}function oR(e,n){if(n.kind==="hide")return h`<span class="cell-word">Hidden</span>`;if(n.kind==="show")return h`<span class="cell-word">Shown</span>`;let t=Ws(n.kind);if(t==="number")return h`<span class="cell-word mono">${n.number??0}</span>`;if(t==="weight")return h`<span class="cell-word">${ja.find(([r])=>r===(n.weight??"regular"))?.[1]}</span>`;if(t==="design")return h`<span class="cell-word">${wo.find(([r])=>r===(n.design??"default"))?.[1]}</span>`;if(t==="width")return h`<span class="cell-word">${ko.find(([r])=>r===(n.width??"standard"))?.[1]}</span>`;if(t==="italic")return h`<span class="cell-word">${n.italic===!1?"Upright":"Italic"}</span>`;let i=n.value??U(""),a=i.kind.kind==="literal"?i.kind.value:void 0;if(eh.includes(n.kind))return h`<span class="swatch" style=${`background:${a&&/^#[0-9a-fA-F]{6,8}$/.test(a)?a:"transparent"}`}></span>
      <span class="cell-word">${a?qe(a):Oe(i,ye(e))}</span>`;if(n.kind==="setIcon"&&a){let r=e.icons.render(a,16,"#FFFFFF");return h`${r??m}<span class="cell-word">${a}</span>`}return h`<span class="cell-word">${Oe(i,ye(e))}</span>`}function qe(e){return{"#FF453A":"red","#FF9F0A":"orange","#FFD60A":"amber","#34C759":"green","#30D158":"green","#0A84FF":"blue","#64D2FF":"cyan","#BF5AF2":"purple","#FFFFFF":"white","#8E8E93":"grey","#000000":"black","#FFCC00":"amber","#FF3B30":"red"}[e.toUpperCase()]??e}function sR(e,n,t,i){let a=Bi(n.kind),r=Qu(n.kind),o=(s,l,c,d)=>dR(e,s,l,`${t}-${c}`,r,d,c==="rhs"?"Compare with":"Upper bound");return h`<span class="when-cell">
    <select class="when-op" title="How this state is decided" @change=${ze(s=>i(l=>{let c=au(l,s);l.kind=c.kind,c.value!==void 0?l.value=c.value:delete l.value,c.upper!==void 0?l.upper=c.upper:delete l.upper}))}>
      ${Zu.map(s=>h`<option value=${s} ?selected=${s===n.kind}>${lR(s)}</option>`)}
    </select>
    ${a==="value"||a==="between"?o(n.value??U(""),s=>i(l=>{l.value=s},"rhs"),"rhs",r?"0":"value"):m}
    ${a==="between"?h`<span class="when-and">to</span>${o(n.upper??U(""),s=>i(l=>{l.upper=s},"upper"),"upper","100")}`:m}
  </span>`}function lR(e){switch(e){case"lessThan":return"Less than";case"lessOrEqual":return"At most";case"between":return"Between";case"greaterOrEqual":return"At least";case"greaterThan":return"Greater than";default:{let n=Ga[e];return n.charAt(0).toUpperCase()+n.slice(1)}}}function dR(e,n,t,i,a,r,o){let s=Ro(i),l={showResolved:!0,label:o,key:i};if(n.kind.kind!=="literal")return h`<span class="rhs">
      ${he(e,n,t,{...l,compact:!0})}
    </span>`;let c=n.kind.value;return h`<span class="rhs">
    <input class="cellin ${a?"num":""}" type=${a?"number":"text"} .value=${c} placeholder=${r}
      @input=${ze(d=>t({...n,kind:{kind:"literal",value:d}}))} />
    <button type="button" class="icon more" popovertarget=${s} aria-label="Compare with an entity instead" title="Compare with an entity or a template instead of a number">${H("link")}</button>
    ${bx(e,s,o,n,t,l)}
  </span>`}var cR=/^[a-z0-9_]+\.shared_(\d+)$/;function oa(e){return cR.test(e)}function uR(e){return e.length===0?e:e[0].toUpperCase()+e.slice(1)}function ov(e,n){let i=(e.domain||n.split(".")[0]||"").toLowerCase().replace(/[^a-z0-9_]/g,"");return i===""?"entity":i}function fd(e,n){let t=new Map;for(let i of eu(e,(a,r)=>n.has(r))){if(i.entityId==="")continue;let a=t.get(i.entityId);if(!a){let r=ov(i.ref,i.entityId),o=t.size+1;a={placeholderId:`${r}.shared_${o}`,domain:r,label:`${uR(r.replace(/_/g," "))} ${o}`,originalId:i.entityId,where:[]},t.set(i.entityId,a)}a.where.includes(i.where)||a.where.push(i.where)}return[...t.values()]}function iv(e){if(e.type!=="refreshAll"||e.targets===void 0)return e;let{targets:n,...t}=e;return t}function Ja(e,n){let t=structuredClone(e),i=new Map,a=new Map;for(let r of n)i.set(r.originalId,{entityId:r.placeholderId,displayName:r.label,domain:r.domain}),a.set(r.originalId,r.placeholderId);Qc(t,r=>{let o=i.get(r.entityId);return o?{...o}:void 0}),Ma(t,r=>Yc(r,a)),delete t.openPageId,delete t.openPageName,t.tapAction.type==="openPage"&&(t.tapAction={type:"none"}),t.tapAction=iv(t.tapAction);for(let r of t.elements)r.kind==="tap"&&(delete r.payload.openPageId,delete r.payload.openPageName,r.payload.action.type==="openPage"&&(r.payload.action={type:"none"}),r.payload.action=iv(r.payload.action));return t.dataSources=[],t}function Fo(e){let n=i=>i.kind==="filter"&&i.areaIds.length+i.labelIds.length+i.floorIds.length>0,t=!1;mt(e,i=>{let a=i.kind;a.kind==="aggregate"&&n(a.aggregate.scope)&&(t=!0)});for(let i of e.elements){if(i.kind!=="list")continue;let a=i.payload.source;a.kind==="entities"&&n(a.scope)&&(t=!0)}return t}function pR(e,n="  "){let t=(i,a)=>{if(i===null||typeof i!="object")return JSON.stringify(i)??"null";let r=a+n;if(Array.isArray(i))return i.length===0?"[]":`[
${i.map(c=>r+t(c,r)).join(`,
`)}
${a}]`;let o=i,s=Object.keys(o).filter(c=>o[c]!==void 0).sort();return s.length===0?"{}":`{
${s.map(c=>`${r}${JSON.stringify(c)}: ${t(o[c],r)}`).join(`,
`)}
${a}}`};return t(e,"")}function li(e,n,t=[]){let i=n==="share"?Ja(e,t):e,a=Sa(i);return delete a.id,delete a.slotIndex,n==="share"&&delete a.hidden,a.dataSources=[],`${pR(a)}
`}function th(e){let t=(e.name===""?"Complication":e.name).split(/[^\p{L}\p{N}]+/u).filter(i=>i!=="").join("-");return`${t===""?"Complication":t}.json`}var hR="There is nothing to read here. Paste a complication first.",fR="This is not valid JSON. Check for a missing brace or a stray comma.",mR="This is valid JSON but not a complication. A complication starts with { and ends with }.",gR="This does not look like a complication.",av="It was made by a newer panel, so update the Wrist Assistant integration before importing it.",yR="00000000-0000-4000-8000-000000000000";function bR(e){let n=/^([A-Za-z]+) is required$/.exec(e);return n?`It is missing "${n[1]}".`:e}function nh(e,n){let t=e.trim();if(t==="")return{ok:!1,error:hR};let i;try{i=JSON.parse(t)}catch{return{ok:!1,error:fR}}if(typeof i!="object"||i===null||Array.isArray(i))return{ok:!1,error:mR};let a=i,r=a.schemaVersion;if(typeof r=="number"&&r>n)return{ok:!1,error:`This complication is schema v${r}; this panel understands up to v${n}. ${av}`};let o={...a,id:yR,slotIndex:0},s;try{s=Ni(o)}catch(c){let d=c instanceof Tt||c instanceof Error?c.message:String(c);return{ok:!1,error:`${gR}

${bR(d)}`}}delete s.hidden;let l=_s(a);if(l.length>0){let c=l.slice(0,3).join(", "),d=l.length>3?`, and ${l.length-3} more`:"";return{ok:!1,error:`This complication uses keys this panel does not know: ${c}${d}. ${av}`}}return{ok:!0,config:s,raw:i}}function md(e,n){let t=new Set;for(let o of Object.keys(n)){let s=o.split(".")[0]??"";s!==""&&t.add(s)}let i=o=>Object.prototype.hasOwnProperty.call(n,o),a=new Map,r=eu(e,(o,s)=>oa(o)||t.has(s));for(let o of r){if(o.entityId==="")continue;let s=oa(o.entityId);if(!s&&i(o.entityId))continue;let l=a.get(o.entityId);l||(l={entityId:o.entityId,domain:ov(o.ref,o.entityId),label:o.ref.displayName||o.entityId,where:[],required:s},a.set(o.entityId,l)),l.label===o.entityId&&o.ref.displayName!==""&&(l.label=o.ref.displayName),l.where.includes(o.where)||l.where.push(o.where)}return[...a.values()]}function Mo(e,n){let t=structuredClone(e);Qc(t,a=>{let r=n.get(a.entityId);if(r)return{entityId:r.entityId,displayName:r.displayName,domain:r.domain||r.entityId.split(".")[0]||""}});let i=new Map;for(let[a,r]of n)i.set(a,r.entityId);return Ma(t,a=>Yc(a,i)),t}function sv(e,n){let t=e.trim();if(t==="")return"";let i=a=>n.has(a.toLowerCase());if(!i(t))return t;for(let a=2;a<=99;a+=1){let r=`${t} ${a}`;if(!i(r))return r}return t}var lv="import";function rv(e){let n="";for(let t=0;t<e.length;t+=32768)n+=String.fromCharCode(...e.subarray(t,t+32768));return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function xR(e){if(!/^[A-Za-z0-9_-]*$/.test(e)||e.length%4===1)return;let n=e.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((e.length+3)%4);try{let t=atob(n),i=new Uint8Array(t.length);for(let a=0;a<t.length;a+=1)i[a]=t.charCodeAt(a);return i}catch{return}}async function dv(e,n){let t=new Blob([e]).stream().pipeThrough(n);return new Uint8Array(await new Response(t).arrayBuffer())}async function cv(e,n={}){let t=new TextEncoder().encode(e);if(n.compress!==!1&&typeof CompressionStream=="function")try{return`z${rv(await dv(t,new CompressionStream("gzip")))}`}catch{}return`t${rv(t)}`}async function ih(e){let n=xR(e.slice(1));if(!n)return;let t=new TextDecoder("utf-8",{fatal:!0});try{if(e.startsWith("t"))return t.decode(n);if(e.startsWith("z")&&typeof DecompressionStream=="function")return t.decode(await dv(n,new DecompressionStream("gzip")))}catch{}}var uv="https://wrist-assistant.com/import/";function pv(e,n){return`${e.split("#")[0]??e}#${lv}=${n}`}function ah(e){let n=e.startsWith("#")?e.slice(1):e,t=`${lv}=`;if(!n.startsWith(t))return;let i=n.slice(t.length);return i.length>1?i:void 0}function hv(e){let n=e.trim();if(n===""||/\s/.test(n)||n.startsWith("{"))return;let t=n.indexOf("#");return t<0?void 0:ah(n.slice(t))}var rh="This share link is damaged or cut short. Ask for it again, or paste the text instead.";function oh(e){if(!e.parsed)return"Paste a complication first.";let n=e.name.trim();if(n==="")return"Give it a name first.";if(e.taken.has(n.toLowerCase()))return"A complication on this watch already has that name.";if(e.unchosen===1)return"One entity still needs choosing.";if(e.unchosen>1)return`${e.unchosen} entities still need choosing.`}var Lo="https://wrist-assistant.com/api/gallery",vR=["rectangular","circular","corner","inline","small","medium","large","xlarge"],sh=["weather","energy","climate","security","media","health","calendar","transport","lights","sensors","battery","other"],lh={weather:"Weather",energy:"Energy",climate:"Climate",security:"Security",media:"Media",health:"Health",calendar:"Calendar",transport:"Transport",lights:"Lights",sensors:"Sensors",battery:"Battery",other:"Other"},Ee={title:60,description:500,authorName:40,tags:5,slots:40,slotLabel:60,previews:8,shareTextBytes:64*1024,pngBytes:150*1024,bodyBytes:1024*1024},wR=/^[a-z0-9_]+\.shared_[0-9]+$/;function gd(e,n={}){let t=structuredClone(e),i=(a,r)=>r===void 0||r.trim()===""?a:r.trim();t.name=i(t.name,n.name);for(let a of t.groups??[])a.name=i(a.name,n.groupNames?.get(a.id));for(let a of t.values)a.name=i(a.name,n.valueNames?.get(a.id));for(let a of t.elements){let r=n.layerNames?.get(a.payload.id);a.payload.name!==void 0&&r!==void 0&&(a.payload.name=i(a.payload.name,r))}return t}function fv(e){return sh.includes(e)}function mv(e){return new TextEncoder().encode(e).length}function dh(e,n,t,i={}){let a=[];for(let r of t.tags)fv(r)&&!a.includes(r)&&a.push(r);return{shareText:li(gd(e,{...i,name:t.title}),"share",n),title:t.title.trim(),description:t.description.trim(),authorName:t.authorName.trim(),tags:a,families:gt(e).filter(r=>vR.includes(r)),slots:n.map(r=>({id:r.placeholderId,label:r.label.trim()})),panelVersion:t.panelVersion}}var kR=new Set(["id","kind","type","join","domain","domains","entityId","displayName","supportedFamilies","perFamily","fontWeight","weight","fontDesign","design","fontWidth","width","alignment","style","cornerBodyShape","function","baseline","coloring","highlight","marker","highMarker","lowMarker","scale","at","place","barCorners","curve","smoothing","dots","fillStyle","stat","source","statType","statPeriod","hourCycle","minutes","timeField","timestampCorner","contentMode","symbol","path","viewBox","serviceDomain","serviceName","attachedTo","layer","chart","image","data","format","scaleFrom","groupId","partId","areaIds","labelIds","floorIds"]),$R=/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/,CR=/^#[0-9A-Fa-f]{3,8}$/,SR=/^-?\d+(\.\d+)?$/;function di(e,n){if(n===void 0)return;let t=n.trim();t!==""&&!e.includes(t)&&e.push(t)}function gv(e,n,t={}){let i=gd(e,t),a=Ja(i,n),r=[],o=[],s=[],l=[],c=[],d=[],u=new Set,p=[],f=[],g=[];for(let E of a.elements)if(di(r,E.payload.name),E.kind==="list")for(let z of E.payload.template)di(r,z.payload.name);(a.groups??[]).forEach((E,z)=>{di(o,E.name),f.push({kind:"group",id:E.id,value:E.name,original:e.groups?.[z]?.name??E.name})}),a.values.forEach((E,z)=>{di(s,E.name),g.push({kind:"shared",id:E.id,value:E.name,original:e.values[z]?.name??E.name})});for(let E of n)di(l,E.label);let b=n.map(E=>({kind:"slot",id:E.placeholderId,value:E.label,original:E.label}));Ma(a,(E,z)=>(z.part==="template"&&di(c,E),z.part==="serviceData"&&di(d,E),E));let y=E=>{E?.kind.kind==="literal"&&u.add(E.kind.value.trim())},v=E=>{for(let z of E){for(let C of z.cases)for(let M of C.then)M.kind==="setIcon"&&y(M.value);for(let C of z.otherwise??[])C.kind==="setIcon"&&y(C.value)}},k=[];for(let E of a.elements){if(E.kind==="icon"&&y(E.payload.symbol),E.kind==="image"){let z=_i(E.payload);z>0&&k.push(`Embedded image, ${Math.max(1,Math.round(z/1024))} KiB`)}v(E.payload.rules)}for(let E of Object.values(a.perFamily))E&&v(E.rules);let S=new Set([a.name.trim(),...r,...o,...s,...l,...c,...d,...u]),I=(E,z)=>{if(typeof E=="string"){let C=E.trim();if(C===""||S.has(C)||kR.has(z)||z.endsWith("Hex")||$R.test(C)||CR.test(C)||SR.test(C)||oa(C))return;di(p,C);return}if(Array.isArray(E)){for(let C of E)I(C,z);return}if(E!==null&&typeof E=="object")for(let[C,M]of Object.entries(E))I(M,C)};return I(JSON.parse(li(i,"share",n)),""),[{label:"Layer names",values:r},{label:"Group names",values:o,rows:f},{label:"Shared value names",values:s,rows:g},{label:"Slot labels",values:l,rows:b},{label:"Template text",values:c},{label:"Service data",values:d},{label:"Embedded pictures",values:k},{label:"Other text",values:p}].filter(E=>E.values.length>0)}function TR(e,n){let t=[];for(let i of e.matchAll(/[a-z0-9_]+(?:\.[a-z0-9_]+)+/g)){let a=i.index??0,r=a>0?e[a-1]:"",o=i[0].split(".");for(let s=0;s+1<o.length;s++){if(!n.has(o[s]))continue;let l=`${o[s]}.${o[s+1]}`,c=s++;if(oa(l))continue;!(c===0&&(r==="'"||r==='"')&&o.length===2)&&!t.includes(l)&&t.push(l)}}return t}function yv(e,n,t,i,a={}){return xv(e,n,t,i,a).map(r=>r.text)}function bv(e,n,t,i,a={}){let r={details:[],send:[]};for(let o of xv(e,n,t,i,a))r[o.step].push(o.text);return r}function xv(e,n,t,i,a){let r=[],o={push:p=>{r.push({step:"send",text:p})}},s=p=>{r.push({step:"details",text:p})},l=dh(e,n,t,a);Fo(e)&&o.push("It reads entities by area, label or floor. Those belong to your Home Assistant, so pick the entities themselves before sending it to the gallery."),l.title===""&&s("Give it a title."),l.title.length>Ee.title&&s(`The title is longer than ${Ee.title} characters.`),l.description.length>Ee.description&&s(`The description is longer than ${Ee.description} characters.`),l.authorName.length>Ee.authorName&&s(`The nickname is longer than ${Ee.authorName} characters.`),t.tags.length>Ee.tags&&s(`Pick at most ${Ee.tags} tags.`),t.tags.some(p=>!fv(p))&&s("One of the tags is not a gallery tag."),l.families.length===0&&o.push("It has no shape the gallery can show."),l.slots.length>Ee.slots&&o.push(`It reads ${l.slots.length} entities. The gallery takes at most ${Ee.slots}.`);for(let p of l.slots)wR.test(p.id)||o.push(`The gallery cannot take the slot ${p.id}, because its domain has characters other than letters and underscores.`),p.label.length>Ee.slotLabel&&o.push(`The label for ${p.id} is longer than ${Ee.slotLabel} characters.`);let c=mv(l.shareText);c>Ee.shareTextBytes&&o.push(`It is too big for the gallery: its text is ${Math.ceil(c/1024)} KB and the limit is ${Ee.shareTextBytes/1024} KB.`);let d=n.filter(p=>p.originalId!==""&&l.shareText.includes(p.originalId)),u=new Set;i&&Ma(Ja(e,n),p=>{for(let f of TR(p,i))u.add(f);return p});for(let p of d)u.add(p.originalId);return u.size>0&&o.push(`Template or service data text names ${[...u].join(", ")} in a way sharing cannot replace. Write it in quotes, like states('sensor.example'), so it becomes a slot.`),r}var ER=["bad_json","too_large","invalid_field","schema_too_new","bad_png","rate_limited","not_found","not_updatable","forbidden","server_error"],dn=class extends Error{constructor(t,i,a,r){super(a?`${t}: ${a}`:t);this.code=t;this.status=i;this.detail=a;this.retryAfter=r;this.name="GalleryError"}},RR={shareText:"complication text",title:"title",description:"description",authorName:"nickname",tags:"tags",families:"shapes",slots:"slot labels",previews:"preview pictures",panelVersion:"panel version",replaces:"upload to update"};function yd(e){if(!(e instanceof dn))return"Something went wrong. Try again.";switch(e.code){case"rate_limited":return"That is as many uploads as the gallery takes in a day. Try again tomorrow.";case"too_large":return"It is too big for the gallery.";case"invalid_field":{let n=e.detail===void 0?void 0:RR[e.detail.split(/[.[\s]/)[0]??""]??e.detail;return n===void 0?"The gallery did not accept one of the fields.":`The gallery did not accept the ${n}.`}case"schema_too_new":return"The gallery does not take complications made by this panel version yet.";case"bad_png":return"A preview picture could not be read. Close this and try again.";case"bad_json":return"The gallery could not read the upload. Update the Wrist Assistant integration and try again.";case"not_found":return"That upload is not in the gallery any more.";case"not_updatable":return"It has to be in the gallery before it can be updated. Wait for the review, then send the new version.";case"forbidden":return"The gallery did not accept this Home Assistant's key.";case"network":return"Could not reach the gallery. Check the connection and try again.";case"server_error":return"The gallery had a problem. Try again later."}}async function AR(e){let n="server_error",t;try{let a=await e.json();typeof a.error=="string"&&ER.includes(a.error)&&(n=a.error),typeof a.detail=="string"&&(t=a.detail)}catch{}e.status===429&&(n="rate_limited");let i=Number(e.headers.get("retry-after"));return new dn(n,e.status,t,Number.isFinite(i)&&i>0?i:void 0)}async function ch(e,n,t,i,a){let r={"X-Gallery-Key":i};a!==void 0&&(r["content-type"]="application/json");let o;try{o=await e(n,{method:t,headers:r,body:a,credentials:"omit",mode:"cors"})}catch{throw new dn("network",0)}if(!o.ok)throw await AR(o);return o}async function vv(e,n,t,i=Lo){let{replaces:a,...r}=t,o=JSON.stringify(a?{...r,replaces:a}:r);if(mv(o)>Ee.bodyBytes)throw new dn("too_large",0);let l=await(await ch(e,`${i}/submissions`,"POST",n,o)).json(),c={id:String(l.id??""),status:String(l.status??"pending")};return typeof l.replaces=="string"&&l.replaces!==""&&(c.replaces=l.replaces),c}function FR(e,n=Lo){if(e===null||typeof e!="object")return;let t=e,i=(...l)=>{for(let c of l)if(typeof t[c]=="string")return t[c];return null},a=(...l)=>{for(let c of l)if(typeof t[c]=="number"&&Number.isFinite(t[c]))return t[c];return 0},r=i("id");if(r===null||r==="")return;let o=i("preview_url","previewUrl"),s=i("replaces_id","replacesId");return{id:r,title:i("title")??"",status:i("status")??"pending",rejectReason:i("rejectReason","reject_reason"),createdAt:i("createdAt","created_at")??"",voteCount:a("voteCount","vote_count"),replacesId:s===""?null:s,updatedAt:i("updated_at","updatedAt"),importCount:a("import_count","importCount"),previewUrl:o===null||o===""?null:MR(o,n)}}function MR(e,n=Lo){if(/^https?:\/\//i.test(e))return e;let t=n.endsWith("/")?n:`${n}/`;try{return new URL(e.startsWith("/")?e:e.replace(/^\.\//,""),e.startsWith("/")?new URL(t).origin:t).toString()}catch{return e}}async function wv(e,n,t=Lo){let a=await(await ch(e,`${t}/mine`,"GET",n)).json();return Array.isArray(a.items)?a.items.map(r=>FR(r,t)).filter(r=>r!==void 0):[]}function uh(e){return e.replacesId!==null}function Io(e){return e.status==="pending"&&uh(e)}function kv(e){let n=new Set(e.map(r=>r.id)),t=new Map;for(let r of e){if(!uh(r)||r.replacesId===r.id||!n.has(r.replacesId))continue;let o=t.get(r.replacesId)??[];o.push(r),t.set(r.replacesId,o)}let i=new Set([...t.values()].flat().map(r=>r.id)),a=[];for(let r of e){if(i.has(r.id))continue;let o=t.get(r.id)??[];a.push({upload:r,updates:o,canUpdate:r.status==="approved"&&!o.some(Io)})}return a}function ph(e){if(e.status==="rejected")return e.rejectReason?e.rejectReason:"No reason was given.";if(Io(e))return"The old version stays up until this one is approved.";if(e.status==="pending")return"It shows in the gallery after it is approved.";if(e.status==="removed")return"It is no longer in the gallery.";let n=e.voteCount===1?"1 vote":`${e.voteCount} votes`,t=e.importCount===1?"added once":`added ${e.importCount} times`;return`${n} \xB7 ${t}`}async function $v(e,n,t,i=Lo){await ch(e,`${i}/mine/${encodeURIComponent(t)}`,"DELETE",n)}var LR={pending:"Waiting for review",approved:"In the gallery",rejected:"Not approved",removed:"Removed"};function Cv(e){return Io(e)?"New version in review":uh(e)&&e.status==="rejected"?"New version not approved":LR[e.status]??e.status}var IR=2,HR=[IR,1.5,1];function _R(e){let n=structuredClone(e);return n.elements=n.elements.filter(t=>t.kind!=="imageTime"),n}function PR(e,n,t,i){let a=new Map;for(let g of t){let b=i.entityState(g.originalId);if(!b)continue;let y={...b,entityId:g.placeholderId,iconName:""};delete y.entityPicture,a.set(g.placeholderId,y)}let r=[],o=[];mt(e,g=>{r.push(g)}),mt(n,g=>{o.push(g)});let s=new Map;for(let g=0;g<Math.min(r.length,o.length);g++){let b=Ia(r[g],e.values),y=Ia(o[g],n.values);if(b===void 0||y===void 0)continue;let v=i.templateResults.get(b);v!==void 0&&s.set(y,v)}let l=new Map,c=new Map,d=(g,b)=>(y,v)=>{if(y===void 0||v===void 0)return;let k=g.get(y);k!==void 0&&b.set(v,k)},u=d(i.historySeries,l),p=d(i.templateResults,s),f=d(i.listItems??new Map,c);for(let g=0;g<Math.min(e.elements.length,n.elements.length);g++){let b=e.elements[g],y=n.elements[g];b.kind==="chart"&&y.kind==="chart"?(u(Xt(b.payload),Xt(y.payload)),u(Jt(b.payload),Jt(y.payload))):b.kind==="timeline"&&y.kind==="timeline"?u(ht(b.payload),ht(y.payload)):b.kind==="list"&&y.kind==="list"&&(p(Zn(b.payload.source,b.payload.rows),Zn(y.payload.source,y.payload.rows)),f(Sn(b.payload.source),Sn(y.payload.source)))}return{entityStates:a,templateResults:s,historySeries:l,listItems:c,namedValues:n.values}}async function Sv(e,n,t,i){let a=Ja(e,n),r=PR(e,a,n,t),o=en(_R(a),r),s=[];for(let l of ue){let c=l,d=o[c];if(!d)continue;let u=await NR(ei(d,{icons:i,slot:ge[c],pictureScene:!0}));if(s.push({family:l,png:u}),s.length===Ee.previews)break}return s}async function NR(e){let n=document.createElement("div");Yo(e,n);let t=n.querySelector("svg");if(!t)throw new Error("nothing was drawn");let i=Number(t.getAttribute("width")),a=Number(t.getAttribute("height"));if(!(i>0)||!(a>0))throw new Error("the drawing has no size");let r=new XMLSerializer().serializeToString(t),o=await DR(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(r)}`);for(let s of HR){let l=document.createElement("canvas");l.width=Math.round(i*s),l.height=Math.round(a*s);let c=l.getContext("2d");if(!c)throw new Error("no canvas");c.drawImage(o,0,0,l.width,l.height);let d=await new Promise(u=>l.toBlob(u,"image/png"));if(d&&d.size<=Ee.pngBytes)return OR(d)}throw new Error("the picture is too large")}function DR(e){return new Promise((n,t)=>{let i=new Image;i.onload=()=>n(i),i.onerror=()=>t(new Error("the drawing could not be loaded")),i.src=e})}async function OR(e){let n=new Uint8Array(await e.arrayBuffer()),t="";for(let i=0;i<n.length;i+=32768)t+=String.fromCharCode(...n.subarray(i,i+32768));return btoa(t)}var zR=64*1024;function GR(e){let n=new Set;for(let t=!0;t;)t=!1,mt(e,(i,a)=>{if(i.kind.kind!=="named")return;if(a.kind==="named"){let o=a.valueId?.toUpperCase();if(o===void 0||!n.has(o))return}let r=i.kind.id.toUpperCase();n.has(r)||(n.add(r),t=!0)});return n}function Tv(e,n,t,i){let a=Cn(e,n,i),r=structuredClone(e);r.id=se(),r.name=t,r.slotIndex=0,r.elements=a.elements,a.groups.length>0?r.groups=a.groups:delete r.groups;let o={};for(let l of ue){let c=a.placements[l];!c||Object.keys(c).length===0||(o[l]={...At(),placements:structuredClone(c)})}if(Object.keys(o).length===0){let l=i!==void 0&&$i(i)?i:e.supportedFamilies.find(c=>$i(c))??"rectangular";o[l]=At()}r.perFamily=o,r.supportedFamilies=ue.filter(l=>o[l]!==void 0),delete r.inline,delete r.control,delete r.openPageId,delete r.openPageName,delete r.hidden,delete r.refreshMinutes,delete r.showSuccessFlash,delete r.successFlashColorHex,r.tapAction={type:"none"},r.dataSources=[];let s=GR(r);return r.values=r.values.filter(l=>s.has(l.id.toUpperCase())),r.schemaVersion=hn(r),r}function Ev(e,n){return li(e,"share",fd(e,n))}function Rv(e){return new TextEncoder().encode(e).length<=zR}function Av(e,n){let t=e.map(r=>r.trim()).filter(r=>r!==""),i="Part";t.length===1?i=t[0]:t.length===2?i=`${t[0]} and ${t[1]}`:t.length>2&&(i=`${t[0]} and ${t.length-1} more`),i=i.slice(0,60);let a=r=>n.has(r.trim().toLowerCase());if(!a(i))return i;for(let r=2;r<=99;r+=1){let o=`${i.slice(0,56)} ${r}`;if(!a(o))return o}return i}function BR(e){return e.supportedFamilies.find(n=>$i(n))??ue.find(n=>e.perFamily[n]!==void 0)}function VR(e,n){let t=n.trim()||"Value";if(!e.has(t.toLowerCase()))return e.add(t.toLowerCase()),t;for(let i=2;;i+=1){let a=`${t} ${i}`;if(!e.has(a.toLowerCase()))return e.add(a.toLowerCase()),a}}function UR(e,n){let t=new Map;for(let i of e.values)t.set(i.id.toUpperCase(),se());mt(e,i=>{if(i.kind.kind!=="named")return;let a=t.get(i.kind.id.toUpperCase());a&&(i.kind.id=a)});for(let i of e.values)i.id=t.get(i.id.toUpperCase()),i.name=VR(n,i.name)}function Fv(e,n,t){let i=structuredClone(n),a=new Set(e.values.map(s=>s.name.trim().toLowerCase()));UR(i,a),e.values.push(...i.values.map(s=>structuredClone(s)));let r=BR(i),o=Cn(i,i.elements.map(s=>s.payload.id),r);return Us(e,o,t)}var KR="wrist-assistant-panel.picker-hidden.v1:",hh=(e,n)=>window.fetch(e,n),vh="wrist-assistant-gallery-nickname";function WR(){try{return window.localStorage.getItem(vh)??""}catch{return""}}function jR(e){try{e===""?window.localStorage.removeItem(vh):window.localStorage.setItem(vh,e)}catch{}}var qR={"Layer names":"Layer name","Template text":"Template text","Service data":"Service data","Other text":"Other text"},fh="https://wrist-assistant.com/gallery/";function Mv(e){let n=e.map(ie);return n.length<=1?n[0]??"":`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}function mh(e){let n=e.elements.filter(t=>!Re(e,t)).length;return n===1?"1 layer":`${n} layers`}var YR=3e4,XR=500,JR=3e4,Lv="preset-entity";function Iv(e){return`import-entity-${e}`}var Hv={entityId:"",displayName:"",domain:""},ZR=new Map,QR={ArrowLeft:{dx:-1,dy:0},ArrowRight:{dx:1,dy:0},ArrowUp:{dx:0,dy:-1},ArrowDown:{dx:0,dy:1}};function gh(e){return"id"in e?`${e.kind}:${e.id}`:e.kind}function eA(e){return e.kind==="family"?"look":"content"}function yh(e){let n=e.document?.supportedFamilies;return Array.isArray(n)?n.filter(t=>typeof t=="string"):[]}function tA(e){let n=e.document?.control;return n!==null&&typeof n=="object"}function _v(){return h`<span class="hstep" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h13" /><path d="M12 6l6 6-6 6" /></svg></span>`}function ui(e){return h`<svg class="shape-art phone" viewBox="0 0 44 64" aria-hidden="true">
    <rect x="5" y="1.5" width="34" height="61" rx="8.5" fill="var(--wa-art-case)" />
    <rect x="7" y="3.5" width="30" height="57" rx="7" fill="var(--wa-art-screen)" />
    <rect x="17" y="5.5" width="10" height="3" rx="1.5" fill="var(--wa-art-case)" />
    ${e}
  </svg>`}function Ho(e){return h`<svg class="shape-art watch" viewBox="0 0 60 64" aria-hidden="true">
    <rect x="51" y="21" width="4.5" height="11" rx="2.25" fill="var(--wa-art-case)" />
    <rect x="51.5" y="35" width="3.4" height="8" rx="1.7" fill="var(--wa-art-case)" />
    <rect x="8" y="4" width="44" height="52" rx="14.5" fill="var(--wa-art-case)" />
    <rect x="10.5" y="6.5" width="39" height="47" rx="12.5" fill="var(--wa-art-screen)" />
    ${e}
  </svg>`}function bd(e,n){let t=(a,r,o,s)=>x`<rect x=${a} y=${r} width=${o} height=${s} rx="3.5" fill="currentColor" />`;if(n){let a=x`<rect x="12" y="13" width="20" height="9" rx="2.5" fill="var(--wa-art-dim)" />`;switch(e){case"small":return ui(t(16,27,12,13.5));case"medium":return ui(t(9.5,27,25,13.5));case"large":return ui(t(9.5,20,25,27.5));case"xlarge":return ui(t(9.5,12,25,44));case"circular":return ui(x`${a}
        <circle cx="12" cy="30" r="4" fill="var(--wa-art-dim)" />
        <circle cx="22" cy="30" r="4" fill="currentColor" />
        <circle cx="32" cy="30" r="4" fill="var(--wa-art-dim)" />`);case"inline":return ui(x`${a}<rect x="11" y="25" width="22" height="4.5" rx="2.25" fill="currentColor" />`);default:return ui(x`${a}<rect x="9.5" y="26" width="25" height="9" rx="3" fill="currentColor" />`)}}let i=a=>x`<rect x="31" y=${a} width="15" height="5" rx="2.5" fill="var(--wa-art-dim)" />`;switch(e){case"circular":return Ho(x`${i(10)}<circle cx="20.5" cy="21" r="8" fill="currentColor" />`);case"corner":return Ho(x`${i(34)}<path d="M15.5 23a10 10 0 0 1 10-10" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" />
      <circle cx="17.5" cy="15" r="3.4" fill="currentColor" />`);case"inline":return Ho(x`${i(10)}<rect x="18" y="44" width="24" height="5" rx="2.5" fill="currentColor" />`);default:return Ho(x`${i(10)}<rect x="15" y="24" width="30" height="11" rx="3.5" fill="currentColor" />`)}}function nA(e){let n=(t,i,a)=>x`<rect x=${t} y=${i} width=${a} height=${a} rx="5.5" fill="currentColor" />
    <circle cx=${t+a/2} cy=${i+a/2} r="3.2" fill="var(--wa-art-screen)" />`;return e?ui(x`${n(13,11,18)}
      <rect x="13" y="33" width="18" height="4" rx="2" fill="var(--wa-art-dim)" />
      <rect x="13" y="39" width="18" height="4" rx="2" fill="var(--wa-art-dim)" />`):Ho(x`${n(15.75,15.75,13)}
    <rect x="31.25" y="15.75" width="13" height="13" rx="4.5" fill="var(--wa-art-dim)" />
    <rect x="15.75" y="31.25" width="13" height="13" rx="4.5" fill="var(--wa-art-dim)" />
    <rect x="31.25" y="31.25" width="13" height="13" rx="4.5" fill="var(--wa-art-dim)" />`)}function iA(e){let n=i=>x`<rect x="7.5" y=${i} width="5.5" height="5.5" rx="1.8" fill="var(--wa-art-dim)" />
    <rect x="15" y=${i} width="5.5" height="5.5" rx="1.8" fill="var(--wa-art-dim)" />
    <rect x="22.5" y=${i} width="5.5" height="5.5" rx="1.8" fill="var(--wa-art-dim)" />
    <rect x="30" y=${i} width="5.5" height="5.5" rx="1.8" fill="var(--wa-art-dim)" />`,t=i=>h`<svg class="place-art" viewBox="0 0 44 80" aria-hidden="true">
    <rect x="2" y="2" width="40" height="76" rx="9.5" fill="var(--wa-art-case)" />
    <rect x="4" y="4" width="36" height="72" rx="7.5" fill="var(--wa-art-screen)" />
    <rect x="17" y="6" width="10" height="3" rx="1.5" fill="var(--wa-art-case)" />
    ${i}
  </svg>`;return e==="home"?t(x`<rect x="7.5" y="13" width="29" height="13" rx="3.5" fill="currentColor" />
      ${n(30)}${n(39)}${n(48)}
      <rect x="6" y="60" width="32" height="12" rx="4.5" fill="var(--wa-art-dock)" />`):e==="lock"?t(x`<rect x="15" y="12" width="14" height="3" rx="1.5" fill="var(--wa-art-dim)" />
      <rect x="11" y="18" width="22" height="12" rx="3.5" fill="var(--wa-art-clock)" />
      <rect x="7.5" y="34" width="29" height="10" rx="3.5" fill="currentColor" />
      <circle cx="12" cy="68" r="4.5" fill="var(--wa-art-dim)" />
      <circle cx="32" cy="68" r="4.5" fill="var(--wa-art-dim)" />`):h`<svg class="place-art watch" viewBox="0 0 60 64" aria-hidden="true">
    <rect x="51" y="21" width="4.5" height="11" rx="2.25" fill="var(--wa-art-case)" />
    <rect x="51.5" y="35" width="3.4" height="8" rx="1.7" fill="var(--wa-art-case)" />
    <rect x="8" y="4" width="44" height="52" rx="14.5" fill="var(--wa-art-case)" />
    <rect x="10.5" y="6.5" width="39" height="47" rx="12.5" fill="var(--wa-art-screen)" />
    <rect x="31" y="10" width="15" height="5" rx="2.5" fill="var(--wa-art-clock)" />
    <rect x="15" y="24" width="30" height="11" rx="3.5" fill="currentColor" />
  </svg>`}function aA(e){if(e)return h`<svg class="place-art" viewBox="0 0 44 80" aria-hidden="true">
      <rect x="2" y="2" width="40" height="76" rx="9.5" fill="var(--wa-art-case)" />
      <rect x="4" y="4" width="36" height="72" rx="7.5" fill="var(--wa-art-blur)" />
      <rect x="17" y="6" width="10" height="3" rx="1.5" fill="var(--wa-art-case)" />
      <rect x="7.5" y="14" width="13" height="13" rx="4.5" fill="currentColor" />
      <circle cx="14" cy="20.5" r="3" fill="var(--wa-art-blur)" />
      <rect x="23.5" y="14" width="13" height="13" rx="4.5" fill="var(--wa-art-dim)" />
      <rect x="7.5" y="31" width="13" height="13" rx="4.5" fill="var(--wa-art-dim)" />
      <rect x="23.5" y="31" width="13" height="13" rx="4.5" fill="var(--wa-art-dim)" />
      <rect x="7.5" y="48" width="6" height="24" rx="3" fill="var(--wa-art-dim)" />
      <rect x="16" y="48" width="6" height="24" rx="3" fill="var(--wa-art-dim)" />
      <rect x="25.5" y="48" width="11" height="11" rx="3.5" fill="var(--wa-art-dim)" />
      <rect x="25.5" y="61" width="11" height="11" rx="3.5" fill="var(--wa-art-dim)" />
    </svg>`;let n=(t,i)=>x`<rect x=${t} y=${i} width="12" height="12" rx="4.5" fill="var(--wa-art-dim)" />`;return h`<svg class="place-art watch" viewBox="0 0 60 64" aria-hidden="true">
    <rect x="51" y="21" width="4.5" height="11" rx="2.25" fill="var(--wa-art-case)" />
    <rect x="51.5" y="35" width="3.4" height="8" rx="1.7" fill="var(--wa-art-case)" />
    <rect x="8" y="4" width="44" height="52" rx="14.5" fill="var(--wa-art-case)" />
    <rect x="10.5" y="6.5" width="39" height="47" rx="12.5" fill="var(--wa-art-blur)" />
    <rect x="26.5" y="8.5" width="7" height="3" rx="1.5" fill="var(--wa-art-dim)" />
    <rect x="16.75" y="14" width="12" height="12" rx="4.5" fill="currentColor" />
    <circle cx="22.75" cy="20" r="2.6" fill="var(--wa-art-blur)" />
    ${n(31.25,14)}
    ${n(16.75,28)}${n(31.25,28)}
    ${n(16.75,42)}${n(31.25,42)}
  </svg>`}function Pv(){return h`<span class="pick-tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg></span>`}var rA=20,Nv=300,Dv=360,_o=44,Po=22,jv=[1,1.7,2.6],oA=["S","M","L"],Ov=["Small","Medium","Large"];function sA(){return jv.map((e,n)=>{let t=Math.round(_o*e),i=Math.round(Po*e),a=`.layers-card.s${n}`;return`
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
`)}var zv="wrist-assistant-panel.layers.v1",Gv="wrist-assistant-panel.grid.v1",In=34,sa=200,lA=720,xd=320,dA=80,cA=56,Bv="wrist-assistant-panel.columns.v3",bh=e=>Math.max(sa,Math.min(lA,Math.round(e))),Vv=e=>e.metaKey||e.ctrlKey||e.shiftKey;function uA(e,n,t){let a=e.querySelector(`g[data-element-id="${CSS.escape(n)}"]`)?.firstElementChild;if(!a||a.tagName.toLowerCase()!=="rect")return!1;let r=a.getBoundingClientRect();return t.clientX>=r.left&&t.clientX<=r.right&&t.clientY>=r.top&&t.clientY<=r.bottom}var pA=/^(range|checkbox|radio|color|button|submit|reset|file|image)$/,Uv=3,Za=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform)?"Cmd":"Ctrl",ci=Za==="Cmd"?"\u2318":"Ctrl+",xh=Za==="Cmd"?"\u21E7":"Shift+";function Kv(e,n,t){if(e<=0)return{columns:3,left:n,right:t};let i=e-dA;if(i>=sa*2+xd){let r=i-xd,o=n,s=t;if(o+s>r){let l=r/(o+s);o=Math.max(sa,Math.floor(o*l)),s=Math.max(sa,Math.floor(s*l));let c=o+s-r;c>0&&(o>=s?o=Math.max(sa,o-c):s=Math.max(sa,s-c))}return{columns:3,left:o,right:s}}let a=e-cA;return a>=sa+xd?{columns:2,left:Math.min(n,a-xd),right:t}:{columns:1,left:n,right:t}}var T=class T extends _n{constructor(){super(...arguments);this.narrow=!1;this.colLeft=Nv;this.colRight=Dv;this.panelWidth=0;this.owners=[];this.records=[];this.maxSchemaVersion=7;this.presets=[];this.occupied=[];this.serverToken=0;this.sendStatusKnown=!1;this.polling=!1;this.pushAvailable=!1;this.lastPushSeconds=null;this.sendPending=!1;this.pages=[];this.templateResults=new Map;this.historySeries=new Map;this.historyReadings=new Map;this.listItems=new Map;this.forced=new Map;this.showRaw=!1;this.inspect={kind:"general"};this.openSections=new Set(["content"]);this.helpSections=new Set(["control"]);this.scrubStart=()=>this.draft?.beginGesture();this.scrubEnd=()=>this.draft?.endGesture();this.pickerOpen=!1;this.pickerFilter="all";this.pickerHiddenOpen=!1;this.sharedHelp=!1;this.thumbStep=0;this.layerDetail="compact";this.addOpen=!0;this.addDetail="expanded";this.multi=new Set;this.savePartOpen=!1;this.savePartName="";this.savePartIds=[];this.savePartBusy=!1;this.partsOpen=!1;this.partsBusy=!1;this.partMap=new Map;this.partConfigCache=new Map;this.snapGrid=!0;this.gridStep=.01;this.showGridLines=!1;this.snapLayers=!0;this.guides=[];this.altHeld=!1;this.collapsed=new Set;this.activeFamily="rectangular";this.controlView=!1;this.picking=!1;this.listHoverIds=[];this.zoomed=!1;this.helpOpen=!1;this.showTaps=!1;this.newOpen=!1;this.newName="";this.newFamilies=new Set;this.newControl=!1;this.shareOpen=!1;this.shareMode="share";this.shareLabels=new Map;this.shareFamilies=new Set;this.dialogLitIds=[];this.shareGroupNames=new Map;this.shareValueNames=new Map;this.shareName="";this.shareLayerNames=new Map;this.shareNote="";this.shareTextOpen=!1;this.shareLinkShown=!1;this.galleryOpen=!1;this.galleryTab="new";this.galleryStep=1;this.galleryTitle="";this.galleryDescription="";this.galleryTags=new Set;this.galleryNickname="";this.galleryPreviewNote="";this.gallerySending=!1;this.gallerySent=!1;this.galleryError="";this.galleryUploadsError="";this.galleryPreviewRun=0;this.importOpen=!1;this.importText="";this.importName="";this.importMap=new Map;this.importDrop=!1;this.importDragDepth=0;this.importTextShown=!1;this.importHistory=new Map;this.importHistoryRun=0;this.historyOpen=!1;this.historyEntries=[];this.historyBusy=!1;this.historyConfirm=!1;this.historyRun=0;this.helpTab="basics";this.linkReady=!1;this.recordPreviews=new Map;this.previewCase=ul.label;this.saving=!1;this.confirmDelete=!1;this.moving=!1;this.version=0;this.historySignature="";this.icons=_y(()=>this.requestUpdate());this.imageSizes=Py(()=>this.requestUpdate());this.symbols=new $l(()=>this.requestUpdate());this.keyHandler=t=>{t.key==="Alt"&&(this.altHeld=!0),this.onKey(t)};this.blurHandler=()=>{this.altHeld=!1};this.heldArrows=new Set;this.keyUpHandler=t=>{t.key==="Alt"&&(this.altHeld=!1),this.heldArrows.delete(t.key)&&this.heldArrows.size===0&&this.draft?.endGesture()};this.fades=new Tl;this.sizeObserver=new ResizeObserver(t=>{let i=t[0]?.contentRect.width??0;Math.abs(i-this.panelWidth)>=1&&(this.panelWidth=i)});this.beforeUnload=t=>{this.draft?.dirty&&t.preventDefault()};this.menuOutside=t=>{let i=this.openMenu;if(i===void 0)return;t.composedPath().some(r=>r instanceof HTMLElement&&r.dataset.menu===i)||this.toggleMenu(i,!1)};this.pickerOutside=t=>{t.composedPath().some(a=>a instanceof HTMLElement&&a.classList.contains("picker"))||this.togglePicker(!1)};this.newKeys=t=>{t.key==="Enter"&&(this.newName.trim()===""||this.newFamilies.size===0&&!this.newControl||this.newNameProblem()!==void 0||(t.preventDefault(),this.createNew()))};this.importDragEnter=t=>{this.dragReadable(t)&&(t.preventDefault(),this.importDragDepth+=1,this.importDrop=!0)};this.importDragOver=t=>{this.dragReadable(t)&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))};this.importDragLeave=()=>{this.importDragDepth!==0&&(this.importDragDepth-=1,this.importDragDepth===0&&(this.importDrop=!1))};this.importDropped=t=>{this.importDragDepth=0,this.importDrop=!1;let i=t.dataTransfer?.files?.[0];if(i){t.preventDefault(),this.readImportBlob(i);return}let a=t.dataTransfer?.getData("text/plain")??"";a!==""&&(t.preventDefault(),this.setImportText(a))};this.importPasted=t=>{if(this.importParse?.ok)return;let i=t.composedPath()[0];if(i instanceof HTMLTextAreaElement||i instanceof HTMLInputElement)return;let a=t.clipboardData?.files?.[0];if(a){t.preventDefault(),this.readImportBlob(a);return}let r=t.clipboardData?.getData("text/plain")??"";r.trim()!==""&&(t.preventDefault(),this.setImportText(r))};this.takeShareLink=()=>{let t=ah(window.location.hash);t!==void 0&&(history.replaceState(history.state,"",`${window.location.pathname}${window.location.search}`),this.pendingLink=t,this.linkReady&&this.openPendingLink())};this.importKeys={handleEvent:t=>{if(t.key!=="Enter"||t.target instanceof HTMLTextAreaElement)return;let i=this.importConfig();!i||md(i,this.hass.states).some(o=>Bp(Iv(o.entityId)))||oh({parsed:!0,name:this.importName,taken:this.takenNames(),unchosen:0})!==void 0||(t.preventDefault(),t.stopPropagation(),this.doImport())},capture:!0};this.presetKeys={handleEvent:t=>{t.key==="Enter"&&(this.presetEntity===void 0||Bp(Lv)||(t.preventDefault(),t.stopPropagation(),this.createFromPreset()))},capture:!0};this.pressing=!1;this.pressStart=()=>{this.pressing=!0};this.pressEnd=()=>{window.setTimeout(()=>{this.pressing=!1})};this.sharedValueFocus=t=>{this.pressing||this.sharedValueOutside(t)};this.sharedValueOutside=t=>{if(this.openValue===void 0)return;let i=t.composedPath(),a=i[0];if(a instanceof HTMLElement&&a.classList.contains("values-list"))return;i.some(o=>o instanceof HTMLElement&&o.classList.contains("vitem")&&o.classList.contains("open"))||this.setOpenValue(void 0)};this.placeAddMenu=t=>{if(t.newState!=="open")return;let i=t.currentTarget,a=this.renderRoot.querySelector("button.add-shape");if(!a)return;let r=a.getBoundingClientRect(),o=Math.min(370,window.innerWidth-24);i.style.left=`${Math.max(12,Math.min(r.left,window.innerWidth-o-12))}px`,i.style.top=`${r.bottom+6}px`}}get testValues(){return this.draft?.testValues??ZR}static{this.styles=Ed`
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
      --wa-text: ${Ve(ot.text)};
      --wa-icon: ${Ve(ot.icon)};
      --wa-gauge: ${Ve(ot.gauge)};
      --wa-shape: ${Ve(ot.shape)};
      --wa-image: ${Ve(ot.image)};
      --wa-tap: ${Ve(ot.tap)};
      --wa-states: ${Ve(le.states)};
      --wa-place: ${Ve(le.place)};
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
      /* The little drawn devices in the New dialog and the Add a shape panel.
         The device stays a quiet object in every theme and the slot inside it
         is drawn in currentColor, so picking a card lights the slot alone.
         A screen is dark in both themes, the way Apple's own pickers draw one:
         a white rectangle reads as a piece of paper. */
      --wa-art-case: #cfc9bd;
      --wa-art-screen: #26241f;
      --wa-art-dim: #45413a;
      --wa-art-clock: #5d584f;
      --wa-art-dock: #322f2a;
      --wa-art-blur: #2f2c27;
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
      --wa-art-case: #2b2f3d;
      --wa-art-screen: #05060a;
      --wa-art-dim: #232734;
      --wa-art-clock: #3a3f52;
      --wa-art-dock: #14161f;
      --wa-art-blur: #0f1119;
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
      width: min(520px, calc(100vw - 32px)); padding: 0;
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
    /* The running count sits opposite the buttons, so what Create is about to
       make is readable without moving the eye to the button itself. */
    .new-foot { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 14px 18px 16px; }
    .new-count { flex: 1; font-size: 12px; color: var(--wa-muted); }
    /* Auto-fit rather than four fixed columns: a watch owner has four shape
       cards and a phone owner up to seven, so the grid takes as many as the
       dialog's width allows and wraps the rest onto another row. */
    .shape-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(84px, 1fr)); gap: 8px; }
    /* The three place cards: where on the device this ends up. They behave as
       tabs, so leaving one keeps its picks, and its count says so. */
    .place-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(96px, 1fr)); gap: 9px; }
    .place-card {
      position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px;
      cursor: pointer; font: inherit; font-size: 13px; padding: 12px 6px 10px; color: var(--wa-muted);
      border: 1px solid var(--wa-line); border-radius: 13px; background: var(--wa-raised);
      transition: border-color .12s ease-out, background-color .12s ease-out, color .12s ease-out;
    }
    .place-card:hover { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .place-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* Open, not picked: the card whose shapes the panel below is showing. A
       place with picks in it that is not open still says so with its count. */
    .place-card.open { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-ink); }
    .place-card.has { color: var(--wa-ink); }
    .place-card .place-art { width: 46px; height: 84px; display: block; color: var(--wa-accent); }
    /* A watch is wider than it is tall. Left in the phone's tall slot the
       drawing shrinks to fit the width and lands half the size of the card. */
    .place-card .place-art.watch { width: 76px; height: 81px; }
    .place-card-name { font-weight: 600; color: var(--wa-ink); }
    .place-count {
      position: absolute; top: 7px; right: 7px; min-width: 18px; height: 18px; box-sizing: border-box;
      padding: 0 5px; display: flex; align-items: center; justify-content: center; border-radius: 9px;
      background: var(--wa-accent); color: var(--wa-accent-ink); font-size: 11px; font-weight: 700;
    }
    /* The open place's shapes, in a box tied to the card above by its accent
       edge, so the panel reads as that card's contents rather than a new
       question. */
    .pick-panel {
      margin-top: 12px; padding: 12px 12px 10px; border-radius: 13px;
      border: 1px solid var(--wa-sel-ring); background: var(--wa-sel-bg);
      display: flex; flex-direction: column; gap: 10px;
    }
    .pick-panel .hint { margin: 0; }
    /* Control Center's panel is the words alone: a tighter gap, because there
       is no grid of cards between the heading and the sentence. */
    .pick-panel.words { gap: 6px; }
    .pick-head { display: flex; align-items: baseline; gap: 8px; }
    .pick-title { flex: 1; font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--wa-accent); }
    .pick-order { font-size: 11px; font-weight: 600; color: var(--wa-muted); }
    /* Not one of them starts picked. A tinted default reads as a
       recommendation, and the shape is the one thing about a complication
       that cannot be changed later without moving every layer. */
    .shape-card {
      position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;
      font: inherit; font-size: 11.5px; padding: 10px 4px 8px; color: var(--wa-muted);
      border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-raised);
      transition: border-color .12s ease-out, background-color .12s ease-out, color .12s ease-out;
    }
    .shape-card:hover { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .shape-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .shape-card.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-ink); }
    .shape-card .shape-art { width: 30px; height: 44px; display: block; }
    /* The watch art is wider than it is tall next to the phone's, because the
       crown and the button hang off its right edge. */
    .shape-card .shape-art.watch { width: 42px; height: 45px; }
    /* The tick on a picked card, and the empty ring that holds its place so
       nothing shifts when one is ticked. */
    .pick-tick {
      position: absolute; top: 6px; right: 6px; width: 16px; height: 16px; box-sizing: border-box;
      display: flex; align-items: center; justify-content: center; border-radius: 50%;
      background: var(--wa-accent); color: var(--wa-accent-ink);
    }
    .pick-tick svg { width: 10px; height: 10px; }
    .pick-tick.off { background: transparent; border: 1px solid var(--wa-line-strong); }
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
    /* What stands in for the dots on a complication that is only a control. */
    .shape-none { font-size: 11px; opacity: .7; white-space: nowrap; flex: none; }

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

    /* Parts: the library as a grid of pictures, each card its own picture,
       name and two actions. The same dialog chrome as Share and Import, so
       only the grid is new. */
    .pt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
    .pt-card {
      display: flex; flex-direction: column; gap: 6px; padding: 8px; min-width: 0;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-md); background: var(--wa-raised);
    }
    .pt-card.asking { border-color: var(--wa-line-strong); }
    .pt-pick {
      font: inherit; color: inherit; text-align: left; cursor: pointer; min-width: 0;
      display: flex; flex-direction: column; gap: 6px; padding: 0; border: 0; background: none;
    }
    .pt-pick:disabled { opacity: .5; cursor: not-allowed; }
    .pt-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: var(--wa-r-sm); }
    .pt-thumb { display: grid; place-items: center; height: 74px; padding: 6px; border-radius: var(--wa-r-sm); background: #000; border: 1px solid var(--wa-line); line-height: 0; }
    .pt-thumb svg.complication { display: block; max-width: 100%; max-height: 100%; width: auto; height: 100%; }
    .pt-name { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pt-sub { font-size: 11.5px; color: var(--wa-muted); }
    .pt-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
    .pt-ask { font-size: 11.5px; color: var(--wa-muted); }
    .pt-rename { width: 100%; box-sizing: border-box; }
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
    /* History: one row per earlier save, the picked one lit. A button rather
       than a div, so the keyboard walks the list the way it walks any list. */
    .hs-rows { max-height: 260px; overflow: auto; }
    button.hs-row { font: inherit; color: inherit; text-align: left; width: 100%; box-sizing: border-box; border: 0; background: none; cursor: pointer; align-items: center; }
    button.hs-row:hover { background: var(--wa-raised); }
    button.hs-row.on { background: var(--wa-sel-bg); }
    button.hs-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .hs-rev { display: grid; place-items: center; width: 30px; height: 24px; border-radius: 7px; font-size: 12px; font-weight: 650; font-variant-numeric: tabular-nums; background: var(--wa-field); color: var(--wa-muted); }
    button.hs-row.on .hs-rev { background: var(--wa-accent); color: var(--wa-accent-ink); }
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
      --thumb-w: ${_o}px; --thumb-h: ${Po}px;
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
    .layer.held { background: color-mix(in srgb, ${Ve(le.group)} 12%, var(--wa-panel)); }
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
    /* A lone selection offers only Save to parts: a quiet row, no box. */
    .part-cta { display: flex; align-items: center; font-size: 12px; margin-bottom: 4px; }
    .part-cta .spacer { flex: 1; }
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
    .layer .lockbtn.on { opacity: 1; color: ${Ve(le.locked)}; }
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
    .layer.drop-before { border-top: ${In}px solid transparent; }
    .layer.drop-after { border-bottom: ${In}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${In}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${In}px; }
    .layer.drop-after::after { bottom: -${In}px; }

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
    ${Ve(sA())}

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
    .shape-seg button.tab { height: 34px; padding: 0 10px; border-radius: 8px; }
    .shape-adds { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 8px; }
    .shape-adds button.tab { height: 28px; padding: 0 9px; gap: 5px; font-weight: 500; }
    .shape-adds button.tab svg { width: 12px; height: 12px; }
    .shape-adds button.tab.add-shape { height: 30px; padding: 0 11px; font-weight: 600; }
    .shape-spare { font-size: 11.5px; color: var(--wa-muted); }
    /* Every shape this complication could still have, under the same place
       headings the New dialog uses. A panel rather than a row because the
       headings are the point, and a row of nine cards with three headings in
       it is wider than the bar it hangs off. */
    .add-menu {
      position: fixed; inset: auto; margin: 0; width: min(370px, calc(100vw - 24px)); padding: 12px;
      border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-md);
      background: var(--wa-panel); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    .add-menu:popover-open { display: flex; flex-direction: column; gap: 12px; }
    .add-group { display: flex; flex-direction: column; gap: 7px; }
    .add-group-label { font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--wa-muted); }
    /* Three to a row here, not the dialog's auto-fit: the panel is narrower
       than the dialog and a fourth column would squeeze the names. */
    .add-menu .shape-cards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
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
    /* A shape's own render, drawn on the black a watch face and a Lock Screen
       are. On the dark skin that plate is all but invisible against the bar
       behind it, so every plate carries a hairline ring. The ring is a
       box-shadow rather than a border because a shadow follows the radius each
       shape sets below, and a circular tab needs a circular ring. */
    .tab .art { display: grid; place-items: center; flex: none; height: 18px; }
    .tab .art svg {
      display: block; max-height: 18px; max-width: 38px; width: auto; height: auto;
      background: #000; border-radius: 3px; box-shadow: 0 0 0 1px var(--wa-line-strong);
    }
    .tab.circular .art svg { border-radius: 50%; }
    .tab.corner .art svg { background: #2c2c2e; }
    /* The tab pictures are small, so the Home Screen tiles take a share of
       their own box as the corner rather than a flat radius. */
    .tab.small .art svg { border-radius: 16.3%; }
    .tab.medium .art svg { border-radius: 7.7% / 16.3%; }
    .tab.large .art svg { border-radius: 7.7% / 7.4%; }
    .tab.xlarge .art svg { border-radius: 7.7% / 4.8%; }
    .tab .art .inline-line { font-size: 8px; padding: 2px 5px; min-width: 0; display: inline-flex; align-items: center; gap: 3px; border-radius: 999px; background: #000; color: #fff; box-shadow: 0 0 0 1px var(--wa-line-strong); }
    .tab .art .inline-line svg { background: transparent; border-radius: 0; box-shadow: none; }
    /* The Control Center tab draws a mock tile rather than a face, so the art
       rules above (a black ground, a rounded corner, a 16px cap) must not
       reach its glyph: the tile carries its own tint and corner. */
    .tab.control .art { height: 20px; }
    .tab.control .art svg { background: transparent; border-radius: 0; box-shadow: none; max-height: none; max-width: none; }
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
      width: ${_o}px; height: ${Po}px; border-radius: 4px; overflow: hidden;
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
    /* The List button's menu: a blank list first, then the ready-made ones.
       The wrapper takes the button's grid cell so the menu hangs off it. */
    .add-tool { position: relative; display: grid; min-width: 0; }
    .add-tool .pop-menu { left: 0; right: auto; min-width: 210px; }
    .add-tool .pop-menu .row { display: flex; flex-direction: column; align-items: stretch; gap: 1px; white-space: normal; }
    .add-tool .pop-menu .row small { font-weight: 500; font-size: 11.5px; color: var(--wa-muted); }
    .add-tool .pop-menu .sep { height: 1px; margin: 3px 6px; background: var(--wa-line); }
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
    /* The big mock tile on the stage, where a face would be. It takes the same
       drop shadow the faces take, so it sits on the work surface rather than
       floating over it. */
    .control-big { display: grid; place-items: center; gap: 22px; }
    .control-big.phone { grid-auto-flow: column; gap: 36px; }
    .control-big > span { box-shadow: 0 20px 50px rgba(0,0,0,.45); }
    /* What the watch prints above its grid: white, centred, two lines at most. */
    .control-big .cc-head {
      max-width: 300px; text-align: center; color: #fff; font-size: 22px; font-weight: 500; line-height: 1.2;
      display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere;
    }
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
      background: color-mix(in srgb, ${Ve(le.complication)} 8%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${Ve(le.complication)} 25%, var(--wa-card));
    }
    .card.tint-states {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${Ve(le.states)} 12%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${Ve(le.states)} 35%, var(--wa-card));
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
    /* On the Control Center tab the layer tools are one note, so Shared
       values sits at the foot of the column rather than right under it. */
    .column.left.control .card.values-list { margin-top: auto; }
    .layout.cols-1 .column.left.control .card.values-list { margin-top: 0; }
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
    /* Shown help is quiet text, not a box: italic and muted, so a card with a
       sentence under every row still reads as one form (Jesse, 2026-09-16). */
    .sec[data-help="on"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) {
      padding: 0 2px; font-style: italic; color: var(--wa-muted);
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
    .states-table td { padding: 4px 6px; border-bottom: 1px solid color-mix(in srgb, var(--wa-line) 55%, transparent); vertical-align: middle; }
    .states-table tbody tr:last-child td { border-bottom: none; }
    .states-table td.empty-row { opacity: .6; padding: 12px 6px; border-bottom: none; }
    .states-table tr.state-row { cursor: pointer; }
    .states-table tr.state-row:hover td { background: var(--wa-panel); }
    .states-table tr.state-row.forced td { background: var(--wa-panel); }
    .states-table tr.state-row.forced td { background: color-mix(in srgb, var(--wa-states) 18%, transparent); }
    /* When shrinks to its controls, so the first setting's column and its
       header start right after it rather than far across the table. */
    .states-table :is(th, td).when { width: 1%; white-space: nowrap; }
    .states-table td.acts { width: 1%; white-space: nowrap; }
    .states-table td.acts button.icon { opacity: 0; }
    .states-table tr:hover td.acts button.icon, .states-table td.acts button.icon:focus-visible { opacity: .8; }
    .row-flag { display: inline-block; width: 12px; color: var(--success-color, #43a047); font-size: 11px; }
    tr.forced .row-flag { color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    /* A row reads as one sentence of controls, drawn the way the band rows
       above a chart draw theirs: the comparison is a chip with a chevron, the
       number a quiet mono box, and a set cell the same box again. */
    .when-cell { display: inline-flex; align-items: center; gap: 6px; }
    .when-cell select.when-op {
      font: inherit; font-size: 12px; font-weight: 500; height: 26px; padding: 0 22px 0 8px; border-radius: 6px;
      border: 1px solid transparent; background-color: var(--wa-field); color: inherit;
      background-size: 12px; background-position: right 5px center;
      /* Sized for its longest common label rather than its longest option, so
         the chip hugs "Greater than" instead of stretching for "Is unavailable". */
      width: 118px; text-overflow: ellipsis;
    }
    .when-cell select.when-op:hover { border-color: var(--wa-line-strong); }
    .when-and { color: var(--wa-muted); font-size: 12px; }
    .when-otherwise { display: inline-block; padding-left: 8px; line-height: 26px; color: var(--wa-muted); font-style: italic; }
    .rhs { display: inline-flex; align-items: center; gap: 2px; }
    .rhs .value-chip-field { margin: 0; }
    input.cellin {
      font: inherit; font-size: 12px; width: 90px; height: 26px; min-height: 26px; padding: 0 6px; border-radius: 6px;
      border: 1px solid transparent; background: var(--wa-field); color: inherit; box-shadow: none;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums;
    }
    input.cellin:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    input.cellin.num { width: 64px; -moz-appearance: textfield; appearance: textfield; }
    input.cellin.num::-webkit-inner-spin-button, input.cellin.num::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    button.more { width: 22px; height: 22px; opacity: .45; }
    button.more svg { width: 13px; height: 13px; }
    button.more:hover { opacity: .9; }
    button.cell {
      display: inline-flex; align-items: center; gap: 6px; max-width: 190px; height: 26px;
      font: inherit; font-size: 12px; font-weight: 500; text-align: left; padding: 0 8px; border-radius: 6px;
      border: 1px solid transparent; background: transparent; color: inherit; cursor: pointer;
    }
    button.cell.filled { background: var(--wa-field); }
    button.cell:hover { border-color: var(--wa-line-strong); }
    button.cell .cell-word.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; }
    /* An empty cell is a ghost of what it would set, not a word: a dashed
       swatch, a faint icon, or a short dashed box. Hovering brings it up. */
    button.cell.empty { opacity: .55; }
    button.cell.empty:hover { opacity: .9; }
    .swatch.ghost { background: transparent; border: 1px dashed var(--wa-line-strong); }
    .ghost-icon { display: inline-flex; }
    .ghost-icon svg { width: 14px; height: 14px; }
    .ghost-box { display: inline-block; width: 26px; height: 12px; border-radius: 3px; border: 1px dashed var(--wa-line-strong); }
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
    /* The add controls under a states table: one strip of buttons, each with
       its explanation in its tooltip, so the table is the loudest thing here. */
    .states > .states-add { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 8px 0 2px var(--wa-col); }
    /* The column menu: the settings a state can still change, one per line. */
    .col-menu {
      position: fixed; inset: auto; margin: 0; padding: 4px; border-radius: 10px; border: 1px solid var(--wa-line-strong);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: 0 8px 24px rgba(0, 0, 0, .28);
      min-width: 140px;
    }
    .col-menu:popover-open { display: flex; flex-direction: column; }
    .col-menu button {
      font: inherit; font-size: 13px; text-align: left; padding: 6px 10px; border-radius: 6px;
      border: none; background: transparent; color: inherit; cursor: pointer;
    }
    .col-menu button:hover, .col-menu button:focus-visible { background: var(--wa-panel); outline: none; }
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
  `}firstUpdated(t){super.firstUpdated(t),this.renderRoot.addEventListener("change",i=>{let a=i.target;a?.tagName==="SELECT"&&a.blur()})}connectedCallback(){super.connectedCallback(),this.clearLegacyPickerHidden(),this.loadColumnWidths(),this.loadListView(),this.loadGrid(),this.sizeObserver.observe(this),window.addEventListener("keydown",this.keyHandler),window.addEventListener("keyup",this.keyUpHandler),window.addEventListener("blur",this.blurHandler),window.addEventListener("beforeunload",this.beforeUnload),window.addEventListener("pointerdown",this.pressStart,{capture:!0}),window.addEventListener("pointerup",this.pressEnd,{capture:!0}),window.addEventListener("pointercancel",this.pressEnd,{capture:!0}),window.addEventListener("click",this.sharedValueOutside,{capture:!0}),window.addEventListener("focusin",this.sharedValueFocus),this.addEventListener(nd,this.scrubStart),this.addEventListener(id,this.scrubEnd),window.addEventListener("hashchange",this.takeShareLink),this.takeShareLink(),this.loadOwners(),this.watchStatusTimer=window.setInterval(()=>{this.refreshWatchStatus()},JR)}loadColumnWidths(){try{let t=window.localStorage.getItem(Bv);if(!t)return;let i=JSON.parse(t);typeof i.left=="number"&&(this.colLeft=bh(i.left)),typeof i.right=="number"&&(this.colRight=bh(i.right))}catch{}}saveColumnWidths(){try{window.localStorage.setItem(Bv,JSON.stringify({left:this.colLeft,right:this.colRight}))}catch{}}loadGrid(){try{let t=window.localStorage.getItem(Gv);if(!t)return;let i=JSON.parse(t);typeof i.on=="boolean"&&(this.snapGrid=i.on),bu.includes(i.step)&&(this.gridStep=i.step),typeof i.lines=="boolean"&&(this.showGridLines=i.lines),typeof i.layers=="boolean"&&(this.snapLayers=i.layers)}catch{}}setGrid(t,i,a=this.showGridLines,r=this.snapLayers){this.snapGrid=t,this.gridStep=i,this.showGridLines=a,this.snapLayers=r;try{window.localStorage.setItem(Gv,JSON.stringify({on:t,step:i,lines:a,layers:r}))}catch{}}snapTarget(t){return{snap:{step:Pa(this.gridStep,ge[t]),on:this.snapGrid}}}guideTarget(t,i){let a=this.canvasConfig();if(!this.snapLayers)return{};let r=a===void 0?[]:Ft(a,t).filter(o=>!i.includes(o.payload.id)&&!Re(a,o)).map(o=>Ge(a,t,o)).filter(o=>!o.isHidden).map(o=>o.frame);return{guides:{lines:Fg(r),threshold:Ag(ge[t])}}}guideSink(){return{onGuides:t=>{this.guides=t}}}loadListView(){try{let t=window.localStorage.getItem(zv);if(!t)return;let i=JSON.parse(t);(i.thumbStep===0||i.thumbStep===1||i.thumbStep===2)&&(this.thumbStep=i.thumbStep),(i.detail==="compact"||i.detail==="expanded")&&(this.layerDetail=i.detail),typeof i.addOpen=="boolean"&&(this.addOpen=i.addOpen),(i.addDetail==="compact"||i.addDetail==="expanded")&&(this.addDetail=i.addDetail)}catch{}}saveListView(){try{window.localStorage.setItem(zv,JSON.stringify({thumbStep:this.thumbStep,detail:this.layerDetail,addOpen:this.addOpen,addDetail:this.addDetail}))}catch{}}renderGutter(t){return h`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>this.beginColumnDrag(t,i)}
      @dblclick=${()=>{t==="left"?this.colLeft=Nv:this.colRight=Dv,this.saveColumnWidths()}}></div>`}beginColumnDrag(t,i){if(i.button!==0)return;i.preventDefault();let a=i.currentTarget,r=i.clientX,o=Kv(this.panelWidth,this.colLeft,this.colRight),s=t==="left"?o.left:o.right;a.setPointerCapture(i.pointerId),a.classList.add("dragging");let l=u=>{if(u.pointerId!==i.pointerId)return;let p=u.clientX-r,f=bh(t==="left"?s+p:s-p);t==="left"?this.colLeft=f:this.colRight=f},c=u=>{u.pointerId===i.pointerId&&(d(),this.saveColumnWidths())},d=()=>{a.classList.remove("dragging"),a.removeEventListener("pointermove",l),a.removeEventListener("pointerup",c),a.removeEventListener("pointercancel",c);try{a.releasePointerCapture(i.pointerId)}catch{}};a.addEventListener("pointermove",l),a.addEventListener("pointerup",c),a.addEventListener("pointercancel",c)}disconnectedCallback(){super.disconnectedCallback(),this.sizeObserver.disconnect(),this.fades.disconnect(),window.removeEventListener("keydown",this.keyHandler),window.removeEventListener("keyup",this.keyUpHandler),window.removeEventListener("blur",this.blurHandler),window.removeEventListener("beforeunload",this.beforeUnload),window.removeEventListener("pointerdown",this.pressStart,{capture:!0}),window.removeEventListener("pointerup",this.pressEnd,{capture:!0}),window.removeEventListener("pointercancel",this.pressEnd,{capture:!0}),window.removeEventListener("click",this.sharedValueOutside,{capture:!0}),window.removeEventListener("focusin",this.sharedValueFocus),this.removeEventListener(nd,this.scrubStart),this.removeEventListener(id,this.scrubEnd),window.removeEventListener("hashchange",this.takeShareLink),this.unsubscribe?.(),this.templateTimer&&window.clearInterval(this.templateTimer),this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.countdownTimer!==void 0&&window.clearInterval(this.countdownTimer),this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.watchStatusTimer!==void 0&&window.clearInterval(this.watchStatusTimer),this.cancelGesture?.()}syncCountdownTicker(t){let i=ue.map(r=>t[r]).filter(r=>r!==void 0),a=t.inline?.countdownEnd!==void 0||i.some(r=>r.bezelCountdownEnd!==void 0||r.elements.some(o=>o.kind==="text"&&o.countdownEnd!==void 0));a&&this.countdownTimer===void 0?this.countdownTimer=window.setInterval(()=>this.requestUpdate(),1e3):!a&&this.countdownTimer!==void 0&&(window.clearInterval(this.countdownTimer),this.countdownTimer=void 0)}willUpdate(t){if(t.has("hass")){let i=this.hass?.themes?.darkMode??window.matchMedia?.("(prefers-color-scheme: dark)").matches??!1;this.toggleAttribute("dark",i)}if(t.has("inspect")){let i=t.get("inspect");(i===void 0||gh(i)!==gh(this.inspect))&&(this.openSections=new Set(Np),this.rowHoverId=void 0),this.inspect.kind!=="general"&&(this.controlView=!1)}}updated(t){this.fades.refresh([this.renderRoot.querySelector(".column.inspector"),this.renderRoot.querySelector(".layers"),this.renderRoot.querySelector(".column.canvas")]);let i=gh(this.inspect);if(i!==this.lastInspectKey){this.lastInspectKey=i;let a=this.renderRoot.querySelector(".column.inspector");a&&(a.scrollTop=0)}if(t.has("pickHoverId")&&this.pickHoverId!==void 0&&this.renderRoot.querySelector(".layer.pick")?.scrollIntoView({block:"nearest"}),t.has("zoomed")&&this.zoomed){let a=this.renderRoot.querySelector("dialog.zoom-dialog");a&&!a.open&&a.showModal()}if(t.has("helpOpen")&&this.helpOpen){let a=this.renderRoot.querySelector("dialog.help-dialog");a&&!a.open&&a.showModal()}if(t.has("hass")&&this.draft){let a={};for(let s of this.compiled?.entities.keys()??[])a[s]=this.hass.states[s]?.last_updated;let r=JSON.stringify(this.lastStatesSnapshot??{}),o=JSON.stringify(a);r!==o&&(this.lastStatesSnapshot=a,this.requestUpdate())}}onKey(t){if(t.key==="Escape"&&this.picking){t.preventDefault(),this.togglePicking(!1);return}let i=t.composedPath()[0],a=!!i?.tagName?.match(/INPUT|TEXTAREA|SELECT/)||i?.isContentEditable===!0,r=a&&i?.tagName!=="SELECT"&&!pA.test(i?.type??""),o=this.renderRoot.querySelector("dialog[open]")!==null;if(t.key==="Escape"&&!a&&!o){this.rowEditList()?this.setRowEdit(void 0):this.multi.size>0?this.multi=new Set:(this.inspect.kind==="layer"||this.inspect.kind==="group")&&(this.inspect={kind:"general"});return}if((t.key==="Delete"||t.key==="Backspace")&&!a&&!o){this.deleteSelection()&&t.preventDefault();return}let s=QR[t.key];if(s&&!a&&!t.metaKey&&!t.ctrlKey&&!t.altKey){this.nudge(s.dx,s.dy,t.shiftKey)&&(t.preventDefault(),this.heldArrows.add(t.key));return}if(!(t.metaKey||t.ctrlKey)||(t.key==="s"?(t.preventDefault(),this.save()):t.key==="z"&&!r?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):t.key==="y"&&!r&&(t.preventDefault(),this.redo()),r||o))return;let c=t.key.toLowerCase(),d=!0;c==="a"?this.selectAll():c==="c"?this.copySelection():c==="x"?this.copySelection()&&this.deleteSelection():c==="v"?this.pasteClip():c==="d"?this.duplicateSelection():c==="g"?t.shiftKey?this.ungroupSelection():this.groupPicked():c==="h"&&t.shiftKey?this.toggleHiddenSelection():t.key==="]"||t.key==="["?this.moveSelection(t.key==="]"?1:-1):d=!1,d&&t.preventDefault()}selectedIds(){let t=this.canvasConfig();if(!t)return[];if(this.multi.size>0)return[...this.multi].filter(a=>t.elements.some(r=>r.payload.id===a));let i=this.inspect;return i.kind==="layer"?t.elements.some(a=>a.payload.id===i.id)?[i.id]:[]:i.kind==="group"?Rt(t,i.id).map(a=>a.payload.id):[]}selectRows(t){t.length===1?(this.multi=new Set,this.inspect={kind:"layer",id:t[0]}):t.length>1&&(this.multi=new Set(t))}deleteSelection(){let t=this.selectedIds();if(!this.canEdit||t.length===0)return!1;let i=this.rowEditList();return i?(this.mutate(a=>{let r=a.elements.find(o=>o.payload.id===i.payload.id);r?.kind==="list"&&(r.payload.template=r.payload.template.filter(o=>!t.includes(o.payload.id)),ra(r.payload))}),this.multi=new Set,this.inspect={kind:"layer",id:i.payload.id},!0):(this.mutate(a=>{for(let r of t)Me(a,r)}),this.multi=new Set,this.inspect={kind:"general"},!0)}copySelection(){let t=this.draft?.config,i=this.selectedIds();return!t||i.length===0||this.rowEditList()?!1:(this.clipboard=Cn(t,i,this.canvasFamily),!0)}pasteClip(){if(!this.canEdit||!this.clipboard)return;let t=this.draft?.config;if(t&&t.supportedFamilies.length===0)return;let i=this.clipboard,a=this.canvasFamily,r=[];this.mutate(o=>{r=Us(o,i,a)}),this.selectRows(r)}duplicateSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=Cn(t,i),r=[];this.mutate(o=>{r=Ti(o,a)}),this.selectRows(r)}selectAll(){let t=this.draft?.config;if(!t)return;let i=Ft(t,this.canvasFamily).filter(a=>!Re(t,a)).map(a=>a.payload.id);i.length!==0&&(i.length===1?this.selectRows(i):this.multi=new Set(i))}ungroupSelection(){let t=this.draft?.config;if(!t||!this.canEdit)return;let i=this.inspect,a=i.kind==="group"?i.id:i.kind==="layer"?Et(t,i.id)?.id:void 0;a!==void 0&&(this.mutate(r=>Ea(r,a)),i.kind==="group"&&(this.inspect={kind:"general"}))}toggleHiddenSelection(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0)return;let a=this.canvasFamily,o=i.map(s=>t.elements.find(l=>l.payload.id===s)).filter(s=>s!==void 0).some(s=>!Ge(t,a,s).isHidden);this.mutate(s=>{for(let l of i)Pe(s,a,l,{isHidden:o})})}moveSelection(t){!this.canEdit||this.inspect.kind!=="layer"||this.multi.size>0||this.moveLayer(this.inspect.id,t)}moveLayer(t,i){this.mutate(a=>{let r=a.elements.filter(u=>!Re(a,u)),o=a.elements.filter(u=>Re(a,u)),s=r.findIndex(u=>u.payload.id===t),l=s+i;if(s<0||l<0||l>=r.length)return;[r[s],r[l]]=[r[l],r[s]];let c=r[l],d=r[s];c.payload.groupId!==d.payload.groupId&&(d.payload.groupId===void 0?delete c.payload.groupId:c.payload.groupId=d.payload.groupId),a.elements=[...r,...o],Dt(a),Ta(a)})}get canEdit(){return!!this.hass.user?.is_admin&&!this.readOnlyReason&&!!this.draft}async loadOwners(){try{let t=await zm(this.hass);if(this.owners=t.owners,this.maxSchemaVersion=t.max_schema_version,this.loadError=void 0,!this.ownerId&&this.owners.length>0){let i=this.owners.find(a=>a.complication_count>0)??this.owners[0];await this.selectOwner(i.owner_watch_id)}}catch(t){this.loadError=`Could not load devices: ${Ye(t)}`}this.linkReady=!0,this.openPendingLink()}async selectOwner(t){if(this.draft?.dirty&&!this.confirmDiscard()){this.requestUpdate();return}this.ownerId=t,this.pickerConfirmDelete=void 0,this.selectedId=void 0,this.moveTarget=void 0,this.moveError=void 0,this.sendStatusKnown=!1,this.lastSyncSeconds=void 0,this.pushAvailable=!1,this.lastPushSeconds=null;let i=this.owners.find(s=>s.owner_watch_id===t),a=Ae(i)==="iphone",r=a?eo:Qr,o=a?ny(i?.screen_size):iy(i?.screen_size);o?this.previewCase=o.label:r.some(s=>s.label===this.previewCase)||(this.previewCase=(a?Fu:ul).label),this.clearDraft(),await this.unsubscribe?.(),this.unsubscribe=await Ym(this.hass,t,()=>{this.loadRecords()}),await this.loadRecords()}async loadRecords(){if(this.ownerId)try{let t=await Gm(this.hass,this.ownerId);this.records=t.records,this.maxSchemaVersion=t.max_schema_version,this.presets=t.presets??[],this.occupied=t.occupied??this.presets.map(a=>({slot:a.slot,name:a.name,kind:"preset",home:""})),this.pages=t.pages??[],this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,this.polling=t.polling??!1,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,typeof t.push_available=="boolean"&&(this.pushAvailable=t.push_available),t.last_push_seconds!==void 0&&(this.lastPushSeconds=typeof t.last_push_seconds=="number"?t.last_push_seconds:null),this.appliedToken===this.serverToken&&this.endSendWait();let i=this.records.find(a=>a.id===this.selectedId);i?this.draft&&this.draft.dirty?this.remoteRevision=i.revision!==this.draft.baseRevision?i.revision:void 0:this.draft&&i.revision!==this.draft.baseRevision&&this.openRecord(i):this.draft&&this.selectedId&&this.draft.baseRevision!==null?this.draft.dirty?this.remoteRevision=-1:this.selectFirst():this.draft||this.selectFirst()}catch(t){this.loadError=`Could not load complications: ${Ye(t)}`}}selectFirst(){this.records[0]?this.openRecord(this.records[0]):(this.selectedId=void 0,this.clearDraft())}clearDraft(){this.draft=void 0,this.compiled=void 0,this.compiledDocument=void 0,this.historySignature="",this.readOnlyReason=void 0,this.parseError=void 0,this.remoteRevision=void 0,this.conflict=void 0,this.saveError=void 0,this.confirmDelete=!1}confirmDiscard(){return window.confirm("You have unsaved changes. Discard them?")}selectRecord(t){t.id!==this.selectedId&&(this.draft?.dirty&&!this.confirmDiscard()||this.openRecord(t))}openRecord(t){this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"};try{this.draft=za.fromDocument(t.document,t.revision),this.savedName=String(t.document?.name??"");let i=Number(t.document?.schemaVersion??0),a=_s(t.document);i>this.maxSchemaVersion?this.readOnlyReason=`This document is schema v${i}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`:a.length>0&&(this.readOnlyReason=`This document has fields the panel does not understand, so saving would drop them: ${a.slice(0,5).join(", ")}${a.length>5?` and ${a.length-5} more`:""}. Update the integration to edit it.`),this.recompile(),this.ensureActiveFamily(),this.startView(this.draft.config)}catch(i){this.parseError=Ye(i)}this.scheduleTemplates(0)}startNew(t){return this.draft?.dirty&&!this.confirmDiscard()?!1:(this.selectedId=t.id,this.clearDraft(),this.forced=new Map,this.inspect={kind:"general"},this.savedName=void 0,this.draft=new za(t,null),this.recompile(),this.ensureActiveFamily(),this.startView(t),this.scheduleTemplates(0),!0)}freeSlot(){return uf(this.records.map(t=>Number(t.document?.slotIndex??-1)),this.occupied)}async refreshWatchStatus(){if(!(!this.ownerId||this.sendPending))try{let t=await Vm(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,this.lastSyncSeconds=typeof t.last_sync_seconds=="number"?t.last_sync_seconds:void 0,this.pushAvailable=t.push_available===!0,this.lastPushSeconds=typeof t.last_push_seconds=="number"?t.last_push_seconds:null,this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0}catch{}}beginSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendPending=!0,this.sendTimer=window.setTimeout(()=>{this.sendTimer=void 0,this.sendPending=!1,this.loadRecords()},sg(this.selectedOwner?.device_kind))}endSendWait(){this.sendTimer!==void 0&&window.clearTimeout(this.sendTimer),this.sendTimer=void 0,this.sendPending=!1}async sendToWatch(){if(this.ownerId)try{let t=await Bm(this.hass,this.ownerId);this.polling=t.polling,this.lastPollSeconds=typeof t.last_poll_seconds=="number"?t.last_poll_seconds:void 0,typeof t.push_available=="boolean"&&(this.pushAvailable=t.push_available),this.serverToken=t.token,this.appliedToken=t.applied_token??void 0,this.sendStatusKnown=!0,t.pushed===!0?this.beginSendWait():typeof t.applied_token=="number"&&t.applied_token!==t.token&&this.beginSendWait()}catch(t){this.saveError=Ye(t)}}renderSendButton(){let t=lg({token:this.serverToken,appliedToken:this.appliedToken,polling:this.polling,pending:this.sendPending,lastPollSeconds:this.lastPollSeconds,deviceKind:this.selectedOwner?.device_kind,lastSyncSeconds:this.lastSyncSeconds,pushAvailable:this.pushAvailable});if((t.kind==="unsupported"||t.kind==="openApp")&&!this.sendStatusKnown)return m;let i=dg(t),a=i.resend&&this.hass.user?.is_admin?h`<button class="ghost" title="Wake the watch again" @click=${()=>{this.sendToWatch()}}>Resend</button>`:m,r=i.refresh&&this.hass.user?.is_admin?h`<button class="ghost" title="Send the phone a push so it pulls this now. iOS decides when the widget redraws; opening the app or tapping the widget redraws it at once." @click=${()=>{this.sendToWatch()}}>Refresh now</button>`:m;return h`<span class="send ${t.kind}" title=${i.title}>${t.kind==="sent"?"\u2713 ":""}${i.label}</span>${i.note?h`<span class="send-note" title=${i.title}>${i.note}</span>`:m}${a}${r}`}get slotChosen(){let t=this.draft?.config.slotIndex??-1;return t>=0&&t<Ud}mutate(t,i){!this.draft||!this.canEdit||(this.draft.update(t,i,this.canvasFamily),this.afterMutation())}afterMutation(){this.version++,this.recompile(),this.ensureActiveFamily()}recompile(){if(!this.draft)return;try{this.compiled=Vi(this.draft.config)}catch{this.compiled=void 0}this.lastStatesSnapshot=void 0;let t=Rf(this.draft.config);(this.compiled?.document!==this.compiledDocument||t!==this.historySignature)&&(this.compiledDocument=this.compiled?.document,this.historySignature=t,this.scheduleTemplates(XR))}undo(){this.draft?.canUndo&&(this.draft.undo(),this.afterMutation())}redo(){this.draft?.canRedo&&(this.draft.redo(),this.afterMutation())}host(){let t=new Ot(this.buildContext(),this.draft?.config);return{hass:this.hass,config:this.draft.config,icons:this.icons,symbols:this.symbols,pages:this.pages,documents:this.documentList(),watchAppVersion:this.selectedOwner?.app_version,deviceKind:Ae(this.selectedOwner),update:(i,a)=>this.mutate(i,a),endGesture:()=>this.draft?.endGesture(),resolve:i=>t.resolve(i),resolveContext:()=>this.buildContext(),canCountDown:i=>t.canCountDown(i),historySeries:i=>this.historySeries.get(i),historyReadings:i=>this.historyReadings.get(i),evaluateTest:i=>t.evaluateTest(i),liveBranch:i=>t.liveBranches([i]).get(i.id)??"none",forced:this.forced,setForced:(i,a)=>this.setForced(i,a),activeFamily:this.activeFamily,setActiveFamily:i=>{this.setRowEdit(void 0),this.activeFamily=i,this.inspect={kind:"family"}},addFamily:i=>this.addShape(i),savedName:this.savedName,tapAreaShown:this.showTaps,showTapArea:i=>this.setShowTaps(i),openSections:this.openSections,toggleSection:i=>this.toggleSection(i),helpSections:this.helpSections,toggleHelp:i=>this.toggleHelp(i),selectLayer:i=>{this.multi=new Set,this.inspect={kind:"layer",id:i}},peekLayer:(i,a)=>{a?this.rowHoverId=i:this.rowHoverId===i&&(this.rowHoverId=void 0)},selectValue:i=>this.openSharedValue(i),beginGesture:()=>this.draft?.beginGesture(),copiedPosition:this.copiedPosition,copyPosition:i=>{this.copiedPosition=i},...this.rowEditList()?{rowEditListId:this.rowEditListId}:{},setRowEdit:i=>this.setRowEdit(i)}}documentList(){return this.records.filter(t=>!t.deleted&&t.document!==null).filter(t=>t.ownerWatchId===""||t.ownerWatchId===this.ownerId).map(t=>{let i=typeof t.document?.name=="string"?t.document.name.trim():"";return{id:t.id.toUpperCase(),name:i===""?"Unnamed":i}})}setRowEdit(t){if(this.rowEditListId===t)return;let i=this.rowEditListId;this.cancelGesture?.(),this.multi=new Set,this.rowEditListId=t,t===void 0&&i!==void 0&&(this.inspect={kind:"layer",id:i})}rowEditList(){let t=this.rowEditListId;if(t===void 0)return;let i=this.draft?.config.elements.find(a=>a.payload.id===t);return i?.kind==="list"?i:void 0}canvasConfig(){let t=this.draft?.config;if(!t)return;let i=this.rowEditList();if(!i)return t;let a=$b(i.payload,this.templateResults,this.listItems,Date.now()/1e3);return Tx(t,i.payload.id,this.canvasFamily,a?.fields)??t}toggleSection(t){let i=new Set(this.openSections);i.has(t)?i.delete(t):(i.size<=1&&i.clear(),i.add(t)),this.openSections=i}toggleHelp(t){let i=new Set(this.helpSections);i.has(t)?i.delete(t):i.add(t),this.helpSections=i}get watchSupported(){let t=this.selectedOwner;return t?t.is_orphan||ky(t):!0}get ownerFamilies(){return Ty(this.selectedOwner)}get deviceWord(){return zu(this.selectedOwner)}get canvasFamily(){if(je(this.activeFamily))return this.activeFamily;let t=this.draft?.config;return(t&&xl(t))??"rectangular"}ensureActiveFamily(){let t=this.draft?.config;if(!t)return;if(Ps(t)){this.controlView=!0,this.inspect.kind!=="general"&&(this.inspect={kind:"general"});return}let i=this.ownerFamilies;t.supportedFamilies.includes(this.activeFamily)&&i.includes(this.activeFamily)||(this.activeFamily=gt(t).find(a=>i.includes(a))??i[0]??"rectangular")}get inControlView(){let t=this.draft?.config;return t?.control===void 0||!En(this.selectedOwner?.app_version)?!1:Ps(t)?!0:this.controlView&&this.inspect.kind==="general"}openControlView(){this.setRowEdit(void 0),this.picking=!1,this.controlView=!0,this.inspect={kind:"general"}}startView(t){this.controlView=Fy(t)}addHere(t){this.mutate(t)}static sizeWords(t){let i=ge[t];return`${i.width} \xD7 ${i.height} pt`}renderShapeIsBlank(t,i,a){if(t.elements.length===0||!je(this.activeFamily))return m;if(Ft(t,i).length>0)return m;let r=ue.filter(o=>o!==i&&t.supportedFamilies.includes(o)).filter(o=>cd(t,o)>0);return h`<div class="blank-shape">
      <b>Nothing is on the ${ie(i)} shape yet.</b>
      <div class="hint">Each shape has its own layers. The ones on the other shapes belong to
        those shapes, so they are not listed here and nothing you do here can reach them. Add
        layers below, or take a copy of another shape's arrangement.</div>
      ${a&&r.length>0?h`<div class="adders">
            ${r.map(o=>h`<button class="small primary"
              title=${`Put a copy of every layer on the ${ie(o)} shape here, where it sits there, scaled to this canvas`}
              @click=${()=>this.mutate(s=>Ox(s,o,i))}>Copy the ${ie(o)} layout</button>`)}
          </div>
          <div class="hint">The copies are layers of their own: editing one here changes nothing on
            the ${ie(r[0])} shape. They are scaled on the way in, because a point is a
            point and this canvas is ${T.sizeWords(i)} against
            ${T.sizeWords(r[0])}, so sizes come down to match and a round
            shape pulls the layout in off its rim. Expect to nudge it by hand afterwards.</div>`:m}
    </div>`}addShape(t){this.ownerFamilies.includes(t)&&(this.mutate(i=>Ry(i,t)),this.activeFamily=t,this.controlView=!1,this.inspect={kind:"family"})}removeShape(t){let i=this.draft?.config;if(!i||!vl(i,t))return;let a=i.supportedFamilies.length===1,r=Ay(i,t),o=a?`Remove the ${ie(t)} shape? It is the last one, so the complication keeps its Control Center control and stops appearing in any widget picker.${r.length>0?` This deletes ${r.join(", ")}.`:""} A shape can be added again at any time.`:r.length>0?`Remove the ${ie(t)} shape? This deletes ${r.join(", ")}. They are on this shape only, so nothing else in the complication loses anything.`:void 0;o!==void 0&&!window.confirm(o)||(this.mutate(s=>ju(s,t)),this.ensureActiveFamily())}addControl(){let t=this.draft?.config;!t||t.control!==void 0||En(this.selectedOwner?.app_version)&&(this.mutate(i=>{Ns(i,!0)}),this.openControlView())}removeControl(){let t=this.draft?.config;if(!t||!Wu(t))return;let i=Oe(t.control.title,ye(this.host())).trim();window.confirm(`Remove the Control Center control${i===""?"":` "${i}"`}? This deletes the control alone, so every shape keeps its layers, and a control can be added again at any time.`)&&(this.mutate(a=>{Ns(a,!1)}),this.controlView=!1,this.ensureActiveFamily())}createNew(){let t=Na([...this.newFamilies].filter(o=>this.ownerFamilies.includes(o))),i=this.newName.trim();if(t.length===0&&!this.newControl||i===""||this.newNameProblem()!==void 0)return;this.closeNewDialog();let a=this.freeSlot(),r=fm(i,a,t);this.newControl&&Ns(r,!0),this.startNew(r)&&this.newControl&&(this.openSections=new Set(["control"]),this.controlView=!0)}setForced(t,i){let a=new Map(this.forced);i==="live"?a.delete(t):a.set(t,i),this.forced=a}async save(t=!1){if(!(!this.draft||!this.ownerId||!this.canEdit||this.saving)&&!(!t&&!this.draft.dirty)){if(!t&&!this.slotChosen){this.saveError="The watch is full. Delete a complication first.";return}this.saving=!0,this.saveError=void 0;try{let i=this.draft;if(t){let o=this.freeSlot();if(o<0){this.saveError="The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";return}let s=structuredClone(i.config);s.id=se(),s.slotIndex=o,i=new za(s,null)}let a=i.encoded(),r=await du(this.hass,this.ownerId,a,i.baseRevision);if(!r.ok||!r.record){r.error==="conflict"?this.conflict={current:r.current??null,message:r.message??"Someone else saved this complication first."}:this.saveError=r.message??r.error??"Save failed";return}this.conflict=void 0,this.remoteRevision=void 0,this.selectedId=r.record.id,this.draft=i.commit(r.record.revision),this.savedName=String(r.record.document?.name??""),this.recompile(),this.beginSendWait(),await this.loadRecords()}catch(i){this.saveError=Ye(i)}finally{this.saving=!1}}}async deleteCurrent(){if(!(!this.draft||!this.ownerId||!this.selectedId||!this.canEdit)){if(this.draft.baseRevision===null){this.clearDraft(),this.selectedId=void 0,this.selectFirst();return}await this.deleteSaved(this.selectedId,this.draft.baseRevision)}}async deleteSaved(t,i){if(!this.ownerId)return;let a=t===this.selectedId;this.saving=!0;try{let r=await Um(this.hass,this.ownerId,t,i);if(!r.ok){r.error==="conflict"&&a?this.conflict={current:r.current??null,message:r.message??"This complication changed on the server."}:this.saveError=r.message??r.error??"Delete failed";return}a&&(this.clearDraft(),this.selectedId=void 0),await this.loadRecords()}catch(r){this.saveError=Ye(r)}finally{this.saving=!1,this.confirmDelete=!1,this.pickerConfirmDelete=void 0}}duplicate(){if(!this.draft)return;let t=structuredClone(this.draft.config);t.id=se(),t.name=`${t.name} copy`,t.slotIndex=this.freeSlot(),this.startNew(t)}reloadFromServer(){let t=this.conflict?.current??this.records.find(i=>i.id===this.selectedId);this.conflict=void 0,t&&!t.deleted?this.openRecord(t):(this.clearDraft(),this.selectedId=void 0,this.loadRecords())}get selectedOwner(){return this.owners.find(t=>t.owner_watch_id===this.ownerId)}async moveAll(){let t=this.ownerId,i=this.moveTarget;if(!(!t||!i||this.moving)){this.moving=!0,this.moveError=void 0;try{await qm(this.hass,t,i),this.moveTarget=void 0,await this.loadOwners(),await this.selectOwner(i)}catch(a){this.moveError=Ye(a)}finally{this.moving=!1}}}scheduleTemplates(t){this.debounceTimer&&window.clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.refreshTemplates()},t),this.templateTimer&&window.clearInterval(this.templateTimer),this.templateTimer=window.setInterval(()=>{this.refreshTemplates()},YR)}async refreshHistorySeries(){let t=this.draft?.config,i=t?cu(t):void 0;if(!i||Object.keys(i.history).length===0&&Object.keys(i.statistics).length===0){this.historySeries.size>0&&(this.historySeries=new Map),this.historyReadings.size>0&&(this.historyReadings=new Map);return}try{let a=await this.fetchSeries(i);this.historySeries=a.series,this.historyReadings=a.readings}catch{}}async refreshListItems(){let t=this.draft?.config,i=t?tg(t):void 0;if(!i||Object.keys(i.requests).length===0){this.listItems.size>0&&(this.listItems=new Map);return}try{this.listItems=ng(await eg(this.hass,i.requests))}catch{}}async fetchSeries(t){let[i,a]=await Promise.all([Jm(this.hass,t.history),Qm(this.hass,t.statistics).catch(()=>({}))]);return Zm({...i,...a})}static{this.IMPORT_HISTORY_DELAY_MS=350}scheduleImportHistory(){this.importHistoryTimer&&window.clearTimeout(this.importHistoryTimer),this.importHistoryTimer=window.setTimeout(()=>{this.importHistoryTimer=void 0,this.refreshImportHistory()},T.IMPORT_HISTORY_DELAY_MS)}async refreshImportHistory(){let t=this.importOpen?this.importPreview()?.config:void 0,i=t?cu(t,r=>this.hass.states[r]!==void 0):void 0;if(i?.signature===this.importHistoryAsked)return;let a=++this.importHistoryRun;if(this.importHistoryAsked=i?.signature,!i||Object.keys(i.history).length===0&&Object.keys(i.statistics).length===0){this.importHistory.size>0&&(this.importHistory=new Map);return}try{let r=await this.fetchSeries(i);if(a!==this.importHistoryRun)return;this.importHistory=r.series}catch{a===this.importHistoryRun&&(this.importHistoryAsked=void 0)}}async refreshTemplates(){this.refreshHistorySeries(),this.refreshListItems();let t=this.compiled?.document;if(!t){this.templateResults=new Map,this.templateError=void 0,this.templateFetchedAt=Date.now();return}try{let a=(await Xm(this.hass,{doc:t})).doc;if(!a)return;if(!a.ok){this.templateError=a.error;return}let r=Pm(a.value);if(!r){this.templateError="Template did not render to a JSON object";return}this.templateResults=r.values,this.templateError=void 0,this.templateFetchedAt=Date.now()}catch(i){this.templateError=Ye(i)}}entityStateFor(t,i,a){let r=this.hass.states[t];if(!r)return;let o=r.attributes,s=t.split(".")[0]??"",l={entityId:t,state:(a?this.testValues.get(t):void 0)??r.state,unitOfMeasurement:typeof o.unit_of_measurement=="string"?o.unit_of_measurement:void 0,iconName:i,domain:s};if(s==="timer"){l.timerState=r.state,typeof o.finishes_at=="string"&&(l.finishesAt=o.finishes_at);let c=mA(o.remaining);c!==void 0&&(l.remaining=c)}return typeof o.entity_picture=="string"&&(l.entityPicture=o.entity_picture),l}buildContext(t=!0){let i=new Map;for(let[o,s]of this.compiled?.entities??[]){let l=this.entityStateFor(o,s.iconName??"",t);l&&i.set(o,l)}let a=this.draft?.config.values??[],r=Cb(this.draft?.config,this.templateResults,this.listItems,Date.now()/1e3);return{entityStates:i,templateResults:r.templateResults,listItems:r.listItems,historySeries:this.historySeries,namedValues:t?rg(a,this.testValues):a,dataAgeSeconds:this.templateFetchedAt===void 0?void 0:(Date.now()-this.templateFetchedAt)/1e3,testedEntities:t?new Set(this.testValues.keys()):new Set}}renderPickButton(){let t=this.picking,i=!this.draft||this.parseError!==void 0;return h`<button class="pick ${t?"on":""}" ?disabled=${i}
      aria-pressed=${t?"true":"false"}
      title=${t?"Point at the face to name a layer. Click one to select it. Escape stops.":"Point at a layer on the face to find it (Escape stops)"}
      @click=${()=>this.togglePicking()}><span class="glyph">⌖</span><span class="word">${t?"Picking\u2026":"Pick layer"}</span></button>`}renderShowTapsButton(){let t=this.showTaps;return h`<button class="pick ${t?"on":""}" ?disabled=${!this.draft||this.parseError!==void 0}
      aria-pressed=${t?"true":"false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${()=>this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span><span class="word">Show taps</span></button>`}renderTintTool(){let t=this.previewTint,i=Mu.find(l=>l.hex===t),a=!this.draft||this.parseError!==void 0,r=Rn(this.activeFamily),o=r?"iPhone tinted":"tint",s=l=>{this.toggleMenu("tint",!1),this.previewTint=l};return h`<span class="inbox tint-box ${t!==void 0?"on":""}"
      title=${r?"A tinted Home Screen drops the tile's background and paints every layer in one colour, keeping only how bright each part was. Layers in the accent group take the lighter of the two colours.":"Many watch faces draw complications in one colour. Colours become the face's tint, text and background turn white, and only how see-through each part is survives."}>
      <span class="pre">Colour</span>
      <span class="case-tool" data-menu="tint">
        <button class="case-pick" ?disabled=${a} aria-haspopup="listbox" aria-expanded=${this.openMenu==="tint"?"true":"false"}
          aria-label=${`Preview colour, ${i?`${i.label} ${r?"tinted Home Screen":"tinted face"}`:"full colour"}`} @click=${()=>this.toggleMenu("tint")}>
          ${i?h`<i class="tint-dot" style=${`--sw:${i.hex}`}></i>${i.label} ${o}`:"Full colour"}${H("chevron")}
        </button>
        ${this.openMenu==="tint"?h`<div class="pop-menu" role="listbox" aria-label="Preview colour">
          <button class="row" role="option" aria-selected=${t===void 0?"true":"false"} @click=${()=>s(void 0)}>
            <i class="tint-dot full"></i>Full colour</button>
          ${Mu.map(l=>h`<button class="row" role="option" aria-selected=${l.hex===t?"true":"false"}
            @click=${()=>s(l.hex)}><i class="tint-dot" style=${`--sw:${l.hex}`}></i>${l.label} ${o}</button>`)}
        </div>`:m}
      </span>
    </span>`}renderZoomButton(){let t=!this.draft||this.parseError!==void 0||!je(this.activeFamily);return h`<button class="pick only-icon" ?disabled=${t} aria-label="Expand the preview"
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${()=>{this.zoomed=!0}}>${H("expand")}</button>`}renderOver(){return h`<div class="over">
      <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}</span>
      <span class="bar-sep" aria-hidden="true"></span>
      <span class="face-tools">${this.renderSnapTools()}</span>
      <span class="bar-sep" aria-hidden="true"></span>
      ${this.renderZoomButton()}
    </div>`}renderRowStrip(){let t=this.rowEditList(),i=this.draft?.config;if(!t||!i)return m;let a=ye(this.host()),r=en(i,this.buildContext(),this.forced)[this.canvasFamily];return h`<div class="row-strip">
      ${r?h`<span class="row-strip-thumb">${yl(r,[t.payload.id],{icons:this.icons,imageSizes:this.imageSizes,width:_o,height:Po})}</span>`:m}
      <span class="row-strip-text">Designing the row of <b>${Te(t,a)}</b>. Every row draws these layers.</span>
      <button @click=${()=>this.setRowEdit(void 0)}>Done</button>
    </div>`}renderSnapTools(){let t=!this.draft||this.parseError!==void 0||!je(this.activeFamily),i=this.snapGrid,a=this.showGridLines,r=this.snapLayers,o=a?x`<path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><circle cx="8" cy="8" r="1.9" />`:x`<path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><path d="M2.5 13.5l11-11" />`;return h`<span class="grid-tool ${i?"on":""}" data-menu="grid">
      <button class="pick ${i?"on":""}" ?disabled=${t} aria-pressed=${i?"true":"false"}
        title=${i?"Layers land on the grid when you drag them, and arrow keys move one grid step. Hold Alt to drag freely. Click to turn it off.":"Snap layers to a grid when you drag them. Without it, hold Alt while dragging to snap."}
        @click=${()=>this.setGrid(!i,this.gridStep)}><span class="glyph">▦</span><span class="word">Snap to grid</span></button>
      ${i?h`<button class="grid-step" ?disabled=${t} aria-haspopup="listbox" aria-expanded=${this.openMenu==="grid"?"true":"false"}
        aria-label=${`Grid size, ${this.gridStep*100}%`} title="Grid size"
        @click=${()=>this.toggleMenu("grid")}>${this.gridStep*100}%${H("chevron")}</button>
      ${this.openMenu==="grid"?h`<div class="pop-menu" role="listbox" aria-label="Grid size">
        ${bu.map(s=>h`<button class="row" role="option" aria-selected=${s===this.gridStep?"true":"false"}
          @click=${()=>{this.toggleMenu("grid",!1),this.setGrid(!0,s)}}>${s*100}%</button>`)}
      </div>`:m}`:m}
    </span>
    <button class="pick ${a?"on":""}" ?disabled=${t} aria-pressed=${a?"true":"false"}
      title=${a?"Hide the grid lines. Snapping is not changed.":"Draw the grid on the face. Snapping is not changed."}
      @click=${()=>this.setGrid(i,this.gridStep,!a)}>
      <span class="glyph"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${o}</svg></span><span class="word">Grid lines</span></button>
    <button class="pick ${r?"on":""}" ?disabled=${t} aria-pressed=${r?"true":"false"}
      title=${r?"Edges and middles land on the other layers' edges and middles, and on the middle of the face, with a pink line while they meet. Click to turn it off.":"Snap to the other layers' edges and middles while dragging."}
      @click=${()=>this.setGrid(i,this.gridStep,a,!r)}><span class="glyph">${H("guides")}</span><span class="word">Snap to layers</span></button>`}renderZoomDialog(t,i,a){let r=this.draft?.config;if(!r)return m;let o=Tn(a,t),s=t==="corner"?104/124:o.width/o.height;return h`<dialog class="zoom-dialog" @close=${()=>{this.zoomed=!1}}>
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
    </dialog>`}renderHelpDialog(){let t=ci,i=xh,a=[[`${t}S`,"Save"],[`${t}Z \xB7 ${i}${t}Z`,"Undo \xB7 Redo"],["Arrows \xB7 \u21E7 Arrows","Nudge the selection 1 pt \xB7 10 pt"],["Delete","Remove the selected layer, pick or group"],[`${t}C \xB7 ${t}X \xB7 ${t}V`,"Copy \xB7 Cut \xB7 Paste layers, into this complication or another one opened in this tab"],[`${t}D`,"Duplicate the selection in place"],[`${t}A`,"Pick every layer"],[`${t}G \xB7 ${i}${t}G`,"Group the pick \xB7 Ungroup"],[`${t}] \xB7 ${t}[`,"Bring the layer forward \xB7 Send it back"],[`${i}${t}H`,"Hide or show the selection in the shape being edited"],["Escape","Leave the row designer, then drop the pick, then the selection. Also stops Pick layer and closes a dialog"]],r=[["Click","A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],[`${Za}-click \xB7 \u21E7-click`,"Add a layer to the pick \xB7 Pick a range of rows. Then Group them so a finished part moves as one"],["Rest on a row","Tints that layer on the face without selecting it. A group row tints every member"],["Drag a row","Reorder the list. Drop it on a group to put it inside"],["Pick layer","Point at the face to find a layer. Click it to select it"],["Show taps","Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],["Snapping","The three switches over the face. Snap to grid: layers land on a grid when you drag them, 1% by default, and arrows move one grid step; the size sits beside it. Grid lines draws the grid. Snap to layers: edges and middles land on the other layers' and on the middle of the face, with a pink line while they meet. Both snaps start on"],["Alt-drag","Flips snapping for that drag: a drag that would snap moves freely, and one that would not snaps to the grid"],["Expand","The button over the face. The face full-window, for small moves. Everything above works there too"],["Locked group","Drags as one. Unlock it in its row to move layers alone"],["Timestamp chip","On a picture layer: click it to move it, pull a corner for its size"]],o=[["Shapes","Rectangular, Circular, Corner and Inline are the kinds of slot on a watch face. The watch offers a complication only in slots whose shape it has."],["Shape tabs","Above the preview. Click one to edit that shape, or a dashed one to add it."],["Canvas shapes","Rectangular, Circular and Corner each hold their own layers. A layer belongs to one shape, so editing it never changes another. An empty shape can take a copy of another shape's layers."],["Corner","Its Corner content card picks big curved text or a canvas of layers."],["Inline","One line of text with an optional symbol before it. It has no layers."],["Home Screen","On an iPhone only: Small, Medium, Large and Extra Large are the Home Screen tile sizes. Each is a canvas shape with its own layers, drawn edge to edge in the tile."],["Small \xB7 Medium \xB7 Large","A square, a wide band about twice as wide as it is tall, and a tall tile a little taller than it is wide. Add the ones you want; a size the complication does not have is not offered when you add a widget."],["Extra Large","The full-page tile, iOS 27 and later. An iPhone on iOS 26 is not offered it when adding a widget, and everything else still draws."],["A tinted Home Screen","iOS 18 lets a user tint the whole Home Screen. The system then drops the tile background and draws the design in two tones, so a design that relies on colour alone reads differently there."],["The shape itself","The bottom row of the Layers list: its background, border and Shape states."]],s=[["Text","A value: typed words, an entity, a template, a shared value and more. It can count down to a time."],["Icon","An SF Symbol or Material Design icon, or the entity's own icon."],["Gauge","A number drawn between a minimum and a maximum."],["Chart","Recent history as bars, a line or an area."],["Timeline","Which state an entity was in over time, as a coloured strip."],["Shape","A rectangle, rounded rectangle, capsule, circle or line."],["Picture","A camera snapshot, or an entity's picture such as a person's avatar or album art."],["Tap area","Invisible. A tap inside it runs its own action. Outside it, the complication's tap action applies."],["Extras","Clock times, chart dots, a chart grid and a picture's timestamp are added from their layer's Extras card."],["Order","The top of the Layers list draws on top. Drag a row to reorder."],["Groups",`A set of layers kept together in the list. Pick some and press ${t}G. Locked, the group moves as one on the face. Unlocked, each layer moves alone. The watch never sees groups.`]],l=[["Content","What the layer shows, starting with its entity or value."],["Look","How it is drawn: size, colour and style. On a picture the card is called Picture."],["Extras","Charts, timelines and pictures only: labels, markers, clock times, dots, grid lines or a timestamp."],["States","Changes that apply while a value matches, described below."],["Position","Where the layer sits on the shape being edited, and its size."],["Tap","What a tap on the layer does."],["?","In a card's header: shows that card's help text."]],c=[["By value","Gauges, charts and text can colour by value instead of one colour. Each band colours readings up to its number, lowest band first. Readings above every band take the Above the last band colour."],["Timeline colours","A timeline colours each state from its own table."],["States","Rows that test a value, like is on or is greater than, each with the changes it makes: icon, text, colour, visibility and more. Rows are checked top to bottom and the first match wins. Otherwise applies when none match."],["Shape states","The same table, on the shape itself."],["Shared values","Like a variable: set it once under the Layers card, and every layer that reads it follows. On a layer, set Source to Shared value, or click Make shared."],["Values on the watch","Every entity and shared value the complication reads, with its live reading. Slide, pick or type another value to watch the preview and the states react. Nothing is saved, and Live or Back to live returns to the real reading."]],d=[["Save",`Writes the complication to Home Assistant (${t}S). A new one says Save new until then. Only an administrator can save.`],["The dot","Beside Save: unsaved changes, saved, or not saved yet. The footer says the same in words."],["Reaching the watch","The watch pulls saved changes by itself while Wrist Assistant is open on this home. There is no separate send step."],["Hide","The eye beside a complication in the list. It stops the watch offering that complication when you edit a face, and faces already using it keep it. Hidden ones fold into Hidden at the bottom of the list. For the open complication it saves with Save; for any other it saves at once."]],u=[["On watch","The watch has applied every change. With last seen beside it, the watch is not listening now, so a later save waits until the app is open again."],["Sending\u2026","Waiting for the watch to pull and confirm."],["Not on watch yet","The watch is connected but has not confirmed the latest change. Resend wakes it again."],["Open the watch app to sync","The watch is not listening. Open Wrist Assistant on the watch, or switch it to this home, and it pulls at once. Resend tries to wake it."],["Update the watch app","This watch has never reported a change. Its app is older than custom complications, or it has not opened this home yet."]],p=[["Share","In the top bar. Turns the open complication into text anyone can import. Your entity ids and names become numbered slots, and you can label each one."],["Backup","The other choice in Share: an exact copy, entity ids and names included. For your records, or another watch in this home."],["Copy link","A link to this panel with the text inside it. Opening it here fills in the Import dialog. On another home, paste the link into Import."],["Import","Beside New. Paste text or a link, choose a file, or drop one on the dialog. Check the preview, choose your own entity for each slot, then Import. It opens as unsaved work and reaches the watch at the first Save."],["History","In the complication's header, beside Duplicate. The last 20 saves of this complication, newest first, with a picture of the one you pick. Restore writes it back as a new revision, so the design you restored over becomes the newest entry and you can come straight back and undo it."],["Parts","A few layers kept under a name, for this home. Pick layers in the Layers list and press Save to parts; Add from parts, under the add buttons, drops them into the complication you have open. A part is stored the way a share is, so it asks which of your entities each slot is on the way in."]],f=v=>v.map(([k,S])=>h`<tr><th scope="row"><kbd>${k}</kbd></th><td>${S}</td></tr>`),g=(v,k)=>h`<section>
      <h3>${v}</h3>
      <table class="terms"><tbody>${k.map(([S,I])=>h`<tr><th scope="row">${S}</th><td>${I}</td></tr>`)}</tbody></table>
    </section>`,b=(v,k)=>h`<button role="tab" id=${`wa-help-${v}`} aria-selected=${this.helpTab===v?"true":"false"}
      @click=${()=>{this.helpTab=v}}>${k}</button>`,y;return this.helpTab==="keys"?y=h`
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
    </dialog>`}setShowTaps(t){this.showTaps=t,t&&this.togglePicking(!1)}togglePicking(t=!this.picking){this.picking=t,this.pickHoverId=void 0,t&&(this.showTaps=!1,this.cancelGesture?.())}hitLayerId(t){let i=this.canvasConfig();if(!i)return;let a=this.rawHitId(t);return a?Gs(i,a):void 0}rawHitId(t){return t.target?.closest?.("[data-element-id]")?.getAttribute("data-element-id")??void 0}rowLayerHitId(t){let i=this.draft?.config;if(!i||this.rowEditList())return;let a=this.rawHitId(t);return a!==void 0&&Aa(i,a)?a:void 0}leaveRow(t){this.listHoverIds.length===t.length&&this.listHoverIds.every((a,r)=>t[r]===a)&&(this.listHoverIds=[])}onPickMove(t){this.picking&&(this.pickHoverId=this.hitLayerId(t))}pickAt(t,i){let a=this.hitLayerId(i);this.togglePicking(!1),a&&(t!==this.activeFamily&&(this.activeFamily=t),this.inspect={kind:"layer",id:a})}onPreviewDoubleClick(t){if(!this.canEdit||this.picking||this.showTaps||this.rowEditList())return;let i=this.draft?.config;if(!i)return;let a=this.rawHitId(t)??this.lastPressHitId;if(a===void 0)return;let r=Aa(i,a);if(r){this.cancelGesture?.(),this.setRowEdit(r.payload.id),this.inspect={kind:"layer",id:a};return}let o=i.elements.find(l=>l.payload.id===a);if(o?.kind!=="list")return;this.cancelGesture?.(),this.setRowEdit(o.payload.id);let s=o.payload.template[0];this.inspect={kind:"layer",id:s?s.payload.id:o.payload.id}}onPreviewPointerDown(t,i){let a=this.renderRoot,r="activeElement"in a?a.activeElement:null;if(r&&typeof r.blur=="function"&&!i.currentTarget?.contains(r)&&r.blur(),this.picking){i.preventDefault(),this.pickAt(t,i);return}let o=i.target,s=o.closest("[data-handle]")?.getAttribute("data-handle")??null,l=o.closest("[data-element-id]")?.getAttribute("data-element-id")??void 0;this.lastPressHitId=l;let c=o.closest("svg.complication");if(this.showTaps){let $=this.focusTapId();if($!==void 0&&l===$&&c&&this.draft&&this.canEdit){if(t!==this.activeFamily){this.activeFamily=t;return}i.preventDefault(),this.beginTapBoxGesture(t,i,c,$,s??void 0);return}let P=this.rowLayerHitId(i)??this.hitLayerId(i);P?this.inspect={kind:"layer",id:P}:l===void 0&&(this.inspect={kind:"general"});return}if(!this.draft||!this.canEdit)return;let d=this.canvasConfig();if(!d)return;if(t!==this.activeFamily){this.activeFamily=t;return}let u=Vv(i),p=l!==void 0?Gs(d,l):void 0;if(!u&&!s&&c&&this.multi.size>=2&&p!==void 0&&this.multi.has(p)){let $=hm(d,this.multi);if(i.preventDefault(),$.length===0)return;this.beginMoveGesture(t,i,c,$,`drag-pick-${t}`,()=>{this.multi=new Set,this.inspect={kind:"layer",id:p}});return}if(!u&&this.multi.size>0&&(this.multi=new Set),!l||!c)return;let f=Gs(d,l),g=d.elements.find($=>$.payload.id===f);if(!f||!g)return;if(u){i.preventDefault(),this.togglePick(f);return}let b,y=this.inspect.kind==="layer"?this.inspect.id:void 0;if(y!==void 0&&y!==f&&!s){let $=d.elements.find(N=>N.payload.id===y);$!==void 0&&$.kind!=="chartDots"&&$.kind!=="chartGrid"&&$.payload.chartAnchor?.place!=="through"&&Et(d,y)?.locked!==!0&&uA(c,y,i)&&(b=f,f=y,g=$)}let v=Et(d,f),k=v!==void 0&&this.inspect.kind==="group"&&this.inspect.id===v.id;if(v&&(v.locked||k)&&!s){let $=k||this.inspect.kind==="layer"&&Et(d,this.inspect.id)?.id===v.id;this.beginGroupGesture(t,i,c,v,$?f:void 0);return}if((this.inspect.kind!=="layer"||this.inspect.id!==f)&&(this.inspect={kind:"layer",id:f},s)||g.payload.chartAnchor?.place==="through")return;i.preventDefault();let S=Ge(d,t,g).frame,I=this.gestureCanvas(t),_=g.payload.chartAnchor,E=_!==void 0&&!mn(_.at)&&_.place!=="through",z=_!==void 0&&mn(_.at)&&_.place==="through",C=ge[t],M={dx:_?.dx??0,dy:_?.dy??0},K=_!==void 0&&!s?en(d,this.buildContext(),this.forced)[t]?.elements.find($=>$.id===f)?.frame:void 0,Y=K??S,J=$=>Math.round($*10)/10;this.cancelGesture?.();let L=!1,X=$=>{$.pointerId===i.pointerId&&Math.hypot($.clientX-i.clientX,$.clientY-i.clientY)>Uv&&(L=!0)};c.addEventListener("pointermove",X);let ne=()=>c.removeEventListener("pointermove",X),D=s!==null?en(d,this.buildContext(),this.forced)[t]?.elements.find($=>$.id===f):void 0;if(s!==null&&D?.kind==="icon"){let $=_u(D)/2,P=D.size,N=Hg(c,i,s,{w:$,h:$},(O,q)=>{if(q&&ne(),!L){q&&(this.cancelGesture=void 0);return}this.mutate(j=>{Pe(j,t,f,{size:Math.max(1,Math.round(P*O))})},`drag-${f}-${t}`),q&&(this.draft?.endGesture(),this.cancelGesture=void 0)});this.cancelGesture=()=>{ne(),N()};return}let W=D!==void 0?fy(D,Y,I):{},w=il(c,I,i,{elementId:f,frame:Y,handle:s??void 0,...W,..._===void 0?{...this.snapTarget(t),...this.guideTarget(t,[f])}:{}},{...this.guideSink(),onFrame:($,P,N)=>{if(N&&ne(),!L){N&&(b!==void 0&&(this.inspect={kind:"layer",id:b}),this.cancelGesture=void 0);return}this.mutate(O=>{if(_===void 0){Pe(O,t,$,{frame:P});return}let q=K?{width:S.width,height:S.height}:{width:P.width,height:P.height};Pe(O,t,$,{frame:{...P,...q,x:E?P.x:S.x,y:S.y}});let j=O.elements.find(ce=>ce.payload.id===$)?.payload.chartAnchor;if(j===void 0)return;let ee=M.dx,B=z?M.dy:J(M.dy+(P.y-Y.y)*C.height);ee?j.dx=ee:delete j.dx,B?j.dy=B:delete j.dy},`drag-${$}-${t}`),N&&(this.draft?.endGesture(),this.cancelGesture=void 0)}});this.cancelGesture=()=>{ne(),w()}}beginGroupGesture(t,i,a,r,o){let s=this.draft?.config;if(!s)return;let l=Rt(s,r.id);if(l.length===0)return;o===void 0&&(this.inspect.kind!=="group"||this.inspect.id!==r.id)&&(this.inspect={kind:"group",id:r.id}),i.preventDefault();let c=o===void 0?void 0:()=>{this.inspect={kind:"layer",id:o}};this.beginMoveGesture(t,i,a,l.map(d=>d.payload.id),`drag-group-${r.id}-${t}`,c)}beginMoveGesture(t,i,a,r,o,s){let l=this.canvasConfig();if(!l)return;let c=l.elements.filter(E=>r.includes(E.payload.id));if(c.length===0)return;let d=new Map(c.map(E=>[E.payload.id,Ge(l,t,E).frame])),u=[...d.values()],p=Math.min(...u.map(E=>E.x)),f=Math.min(...u.map(E=>E.y)),g=Math.max(...u.map(E=>E.x+E.width)),b=Math.max(...u.map(E=>E.y+E.height)),y={x:p,y:f,width:g-p,height:b-f,rotationDegrees:0},v=E=>Math.round(E*1e3)/1e3;this.cancelGesture?.();let k=!1,S=E=>{E.pointerId===i.pointerId&&Math.hypot(E.clientX-i.clientX,E.clientY-i.clientY)>Uv&&(k=!0)};a.addEventListener("pointermove",S);let I=()=>a.removeEventListener("pointermove",S),_=il(a,this.gestureCanvas(t),i,{elementId:o,frame:y,...this.snapTarget(t),...this.guideTarget(t,r)},{...this.guideSink(),onFrame:(E,z,C)=>{if(C&&I(),!C&&!k)return;if(C&&!k&&s!==void 0){s(),this.cancelGesture=void 0;return}let M=z.x-y.x,K=z.y-y.y;this.mutate(Y=>{for(let[J,L]of d)Pe(Y,t,J,{frame:{...L,x:v(L.x+M),y:v(L.y+K)}})},o),C&&(this.draft?.endGesture(),this.cancelGesture=void 0)}});this.cancelGesture=()=>{I(),_()}}nudge(t,i,a){let r=this.canvasConfig();if(!r||!this.canEdit||this.showTaps||this.picking)return!1;let o=a?Ig:1,s=t*o,l=i*o,c=this.canvasFamily,d=ge[c];if(this.multi.size>=2)return this.nudgeMany([...this.multi],c,d,`nudge-multi-${c}`,s,l);if(this.inspect.kind==="group"){let v=this.inspect.id;return this.nudgeMany(Rt(r,v).map(k=>k.payload.id),c,d,`nudge-group-${v}-${c}`,s,l)}if(this.inspect.kind!=="layer")return!1;let u=this.inspect.id,p=r.elements.find(v=>v.payload.id===u);if(!p||p.payload.chartAnchor?.place==="through")return!1;let f=Et(r,u);if(f?.locked)return this.nudgeMany(Rt(r,f.id).map(v=>v.payload.id),c,d,`nudge-group-${f.id}-${c}`,s,l);let g=Ge(r,c,p).frame,b=p.payload.chartAnchor;if(b!==void 0){let v=!mn(b.at);return l===0&&!(v&&s!==0)||this.mutate(k=>{v&&s!==0&&Pe(k,c,u,{frame:nl(g,s,0,d)});let S=k.elements.find(_=>_.payload.id===u)?.payload.chartAnchor;if(S===void 0||l===0)return;let I=Math.round(((S.dy??0)+l)*10)/10;I?S.dy=I:delete S.dy},`nudge-${u}-${c}`),!0}let y=this.snapGrid?wu(g,s,l,Pa(this.gridStep,d)):nl(g,s,l,d);return(y.x!==g.x||y.y!==g.y)&&this.mutate(v=>Pe(v,c,u,{frame:y}),`nudge-${u}-${c}`),!0}nudgeMany(t,i,a,r,o,s){let l=this.canvasConfig();if(!l)return!1;let c=I=>Math.round(I*1e3)/1e3,d=new Map;for(let I of t){let _=l.elements.find(E=>E.payload.id===I);_&&d.set(I,Ge(l,i,_).frame)}if(d.size===0)return!1;let u=[...d.values()],p=Math.min(...u.map(I=>I.x)),f=Math.min(...u.map(I=>I.y)),g=Math.max(...u.map(I=>I.x+I.width)),b=Math.max(...u.map(I=>I.y+I.height)),y={x:p,y:f,width:g-p,height:b-f,rotationDegrees:0},v=this.snapGrid?wu(y,o,s,Pa(this.gridStep,a)):nl(y,o,s,a),k=v.x-y.x,S=v.y-y.y;return(k!==0||S!==0)&&this.mutate(I=>{for(let[_,E]of d)Pe(I,i,_,{frame:{...E,x:c(E.x+k),y:c(E.y+S)}})},r),!0}gestureCanvas(t){let i=pl(this.previewSlot(t),t);if(t!=="corner")return{width:i.width,height:i.height};let a=this.draft?.config.perFamily.corner,r=!!a?.bezelText||!!a?.bezelGauge,o=Du(i.scale,r);return{width:o,height:o}}focusTapId(){let t=this.draft?.config;if(!t||!this.showTaps||this.inspect.kind!=="layer")return;let i=this.inspect.id,a=t.elements.find(r=>r.payload.id===i);if(a)return a.kind==="tap"?a.payload.id:ft(t,i)[0]?.payload.id}beginTapBoxGesture(t,i,a,r,o){let s=this.draft?.config,l=s?.elements.find(u=>u.payload.id===r);if(!s||!l)return;let c=Re(s,l),d=Ge(s,t,l).frame;this.cancelGesture?.(),this.cancelGesture=il(a,this.gestureCanvas(t),i,{elementId:r,frame:d,handle:o,...this.snapTarget(t)},{onFrame:(u,p,f)=>{this.mutate(g=>{c?bm(g,u,t,p):Pe(g,t,u,{frame:p})},`tap-box-${u}-${t}`),f&&(this.draft?.endGesture(),this.cancelGesture=void 0)}})}render(){let t=this.draft,i=!!t?.dirty,a=this.narrow?{columns:1,left:this.colLeft,right:this.colRight}:Kv(this.panelWidth,this.colLeft,this.colRight),r=this.records.find(o=>o.id===this.selectedId);return h`
      <header>
        <label>${this.owners.some(o=>Ae(o)==="iphone")?"Choose device":"Choose watch"}
          <select @change=${o=>{this.selectOwner(o.target.value)}}>
            ${gA(this.owners).map(o=>h`<option value=${o.owner_watch_id} ?selected=${o.owner_watch_id===this.ownerId}>
              ${Wv(o)} (${o.complication_count})</option>`)}
          </select>
        </label>
        ${_v()}
        <label class="pick-label" for="wa-picker">Choose complication</label>
        ${this.renderPicker()}
        ${this.hass.user?.is_admin?h`<span class="hor" aria-hidden="true">or</span>${_v()}`:m}
        ${this.renderNewButton()}
        ${t?h`<button class="new-btn" aria-haspopup="dialog" aria-expanded=${this.shareOpen?"true":"false"}
          title="Share or back up this complication as text, a file or a link"
          @click=${()=>this.openShareDialog()}><span>Share</span></button>`:m}
        <span class="spacer"></span>
        <button class="help" title="Help" aria-label="Help" @click=${()=>{this.helpOpen=!0}}>?</button>
        <div class="toolbar hbox hist">
          <button class="icon" @click=${()=>this.undo()} ?disabled=${!t?.canUndo} title="Undo (⌘Z)" aria-label="Undo">${H("undo")}</button>
          <span class="hdiv"></span>
          <button class="icon" @click=${()=>this.redo()} ?disabled=${!t?.canRedo} title="Redo (⇧⌘Z)" aria-label="Redo">${H("redo")}</button>
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
      ${this.historyOpen?this.renderHistoryDialog():m}
      ${this.savePartOpen?this.renderSavePartDialog():m}
      ${this.partsOpen?this.renderPartsDialog():m}
      ${this.watchSupported?h`<div class="layout cols-${a.columns}"
              style="--wa-left:${a.left}px;--wa-right:${a.right}px">
            <div class=${`column left ${this.inControlView?"control":""}`}>${this.inControlView?this.renderControlHasNoLayers():h`${this.renderAddLayer()}${this.renderLayers()}`}${this.renderSharedValues()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`:this.renderWatchGate()}`}renderWatchGate(){let t=this.selectedOwner,i=Ae(t)==="iphone",a=t?.complication_count??0,r=a===0?`Nothing on this ${zu(t)} changes until then.`:`Your ${a} complication${a===1?"":"s"} keep${a===1?"s":""} working until then.`,o=i?h`<li>
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
        <div class="gate-glyph">${H("watch")}</div>
        <div class="gate-eyebrow">${i?"iPhone app update coming soon":"Watch app update coming soon"}</div>
        <h2 class="gate-title">${i?"This iPhone needs the new app.":"This watch needs the new app."}</h2>
        <p class="gate-lead">${$y(t)}</p>
        <ol class="gate-steps">
          ${o}
        </ol>
        <div class="gate-foot">${r}</div>
      </div>
    </div>`}pickerRows(){let t=this.records.map(a=>({slot:Number(a.document?.slotIndex??0),kind:"record",record:a}));return[...t,...pf(t.map(a=>a.slot),this.occupied).map(a=>a.kind==="custom"?{slot:a.slot,kind:"locked",name:a.name||"Unnamed complication",badge:a.home||"Other home",title:`A complication on ${a.home?`the ${a.home} home`:"another home"}${a.families?.length?` (${a.families.map(ie).join(", ")})`:""}. Edit it in that home's Wrist Assistant panel.`,families:a.families??[]}:{slot:a.slot,kind:"locked",name:a.name||"Unnamed preset",badge:"iPhone",title:"Still on the iPhone. Open the Wrist Assistant app on the iPhone to move it here.",families:[]})].sort((a,r)=>a.slot-r.slot)}shapeDots(t,i=!1){return t.length===0&&i?h`<span class="shape-none" title="A control in Control Center, and no widget">Control</span>`:h`<span class="shape-dots">${Na(this.ownerFamilies).map(a=>h`<span class="shape-dot ${a} ${t.includes(a)?"on":""}" title=${ie(a)}></span>`)}</span>`}static{this.FILTER_FROM_ROWS=8}recordPreview(t){let i=this.recordPreviews.get(t.id);if(i&&i.revision===t.revision)return i;try{let a=Ni(t.document),r={revision:t.revision,config:a,entities:[...Vi(a).entities.values()]};return this.recordPreviews.set(t.id,r),r}catch{this.recordPreviews.delete(t.id);return}}renderRowArt(t){let i=this.recordPreview(t);if(!i)return h`<span class="pk-art"></span>`;let a=i.config;if(a.supportedFamilies.length===0)return h`<span class="pk-art"></span>`;let o=(this.pickerFilter!=="all"&&a.supportedFamilies.includes(this.pickerFilter)?this.pickerFilter:void 0)??xl(a)??"inline";return this.renderConfigArts(a,i.entities,[o],"pk-art")[0]}renderConfigArts(t,i,a,r,o){let s=this.configLayouts(t,i,o);return a.map(l=>{if(l==="inline")return h`<span class="${r} inline">${this.renderInlinePreview(s.inline,!0)}</span>`;let c=s[l];return c?h`<span class="${r} ${l}">${ei(c,{icons:this.icons,imageSizes:this.imageSizes,slot:Tn(this.referenceCase,l)})}</span>`:h`<span class=${r}></span>`})}configLayouts(t,i,a){let r=new Map;for(let o of i){let s=this.entityStateFor(o.entityId,o.iconName??"",!1);s&&r.set(o.entityId,s)}return en(t,{entityStates:r,templateResults:new Map,...a?{historySeries:a}:{},namedValues:t.values})}renderPickerFilter(t){let i=r=>r.kind==="record"?yh(r.record):r.families,a=(r,o,s)=>h`<button
      class="pk-chip ${this.pickerFilter===r?"on":""}" ?disabled=${s===0}
      aria-pressed=${this.pickerFilter===r?"true":"false"}
      @click=${()=>{this.pickerFilter=r}}>${o}<span class="pk-count">${s}</span></button>`;return h`<div class="pk-filter">
      ${a("all","All",t.length)}
      ${this.ownerFamilies.map(r=>a(r,ie(r),t.filter(o=>i(o).includes(r)).length))}
    </div>`}renderPicker(){let t=this.draft,i=t?t.config.name.trim()||"Untitled":"No complication",a=t?t.config.supportedFamilies:[],r=this.pickerRows(),o=this.pickerFilter,s=o==="all"?r:r.filter(c=>(c.kind==="record"?yh(c.record):c.families).includes(o)),l=pm(s,c=>c.kind==="record"?{id:c.record.id,hidden:this.rowHidden(c.record)}:void 0,this.selectedId);return h`<div class="picker">
      <button id="wa-picker" aria-haspopup="listbox" aria-expanded=${this.pickerOpen?"true":"false"} title="Choose a complication"
        @click=${()=>this.togglePicker()}>
        ${this.shapeDots(a,t?.config.control!==void 0)}
        <span class="pk-name">${i}</span>
        ${t&&t.baseRevision===null?h`<span class="pk-rev">unsaved</span>`:m}
        ${H("chevron")}
      </button>
      ${this.pickerOpen?h`<div class="menu" role="listbox">
        ${r.length>=T.FILTER_FROM_ROWS?this.renderPickerFilter(r):m}
        ${r.length===0&&!(t&&t.baseRevision===null)?h`<div class="empty">No complications for this ${this.deviceWord} yet.</div>`:m}
        ${r.length>0&&s.length===0?h`<div class="empty">Nothing on this ${this.deviceWord} has a ${o==="all"?"":ie(o)} shape.</div>`:m}
        ${l.shown.map(c=>this.renderPickerRow(c))}
        ${t&&t.baseRevision===null?h`<div class="row" aria-current="true"><span class="pk-art"></span><span class="pk-name">${i}</span>${this.shapeDots(a,t.config.control!==void 0)}<span class="pk-badge">unsaved</span></div>`:m}
        ${l.hidden.length>0?h`
          <button type="button" class="pk-hidden-head" aria-expanded=${this.pickerHiddenOpen?"true":"false"}
            @click=${()=>{this.pickerHiddenOpen=!this.pickerHiddenOpen}}>
            ${H("chevron")}<span>Hidden (${l.hidden.length})</span>
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
        ${this.shapeDots(yh(i),tA(i))}
      </button>
      <span class="pk-acts">
        ${c?h`<button type="button" class="ghost danger small" ?disabled=${this.saving}
              @click=${u=>{d(u),a?this.deleteCurrent():this.deleteSaved(i.id,i.revision)}}>Really delete</button>
            <button type="button" class="ghost small" @click=${u=>{d(u),this.pickerConfirmDelete=void 0}}>Cancel</button>`:h`${l?h`<button type="button" class="icon" ?disabled=${!a&&this.saving}
              title=${r?"Hidden from the watch's complication list. Show it there again.":"Hide from the watch's complication list. Faces already using it keep it."}
              aria-label=${r?`Show ${o} in the watch's complication list`:`Hide ${o} from the watch's complication list`}
              @click=${u=>{d(u),this.setPickerHidden(i,!r)}}>${H(r?"hide":"show")}</button>`:m}
            ${s?h`<button type="button" class="icon danger" title="Delete this complication" aria-label=${`Delete ${o}`}
              ?disabled=${this.saving} @click=${u=>{d(u),this.pickerConfirmDelete=i.id}}>${H("delete")}</button>`:m}`}
      </span>
    </div>`}rowHidden(t){return t.id===this.selectedId&&this.draft?this.draft.config.hidden===!0:cm(t.document)}async setPickerHidden(t,i){if(this.ownerId){if(t.id===this.selectedId){this.mutate(a=>{i?a.hidden=!0:delete a.hidden});return}if(!(!this.hass.user?.is_admin||this.saving||!t.document)){this.saving=!0,this.saveError=void 0;try{let a=um(t.document,i),r=await du(this.hass,this.ownerId,a,t.revision);if(!r.ok){this.saveError=r.error==="conflict"?`${String(t.document.name??"That complication")} changed on the server. Try again.`:r.message??r.error??"Save failed";return}this.beginSendWait(),await this.loadRecords()}catch(a){this.saveError=Ye(a)}finally{this.saving=!1}}}}clearLegacyPickerHidden(){try{let t=window.localStorage,i=[];for(let a=0;a<t.length;a++){let r=t.key(a);r?.startsWith(KR)&&i.push(r)}for(let a of i)t.removeItem(a)}catch{}}toggleMenu(t,i=this.openMenu!==t){this.openMenu=i?t:this.openMenu===t?void 0:this.openMenu,this.openMenu!==void 0?window.addEventListener("pointerdown",this.menuOutside,{capture:!0}):window.removeEventListener("pointerdown",this.menuOutside,{capture:!0})}togglePicker(t=!this.pickerOpen){this.pickerOpen=t,t||(this.pickerNote=void 0,this.pickerConfirmDelete=void 0),t?window.addEventListener("pointerdown",this.pickerOutside,{capture:!0}):window.removeEventListener("pointerdown",this.pickerOutside,{capture:!0})}renderNewButton(){if(!this.hass.user?.is_admin)return m;let t=this.freeSlot()<0;return h`<div class="newc">
      <button class="new-btn primary" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.newOpen?"true":"false"}
        title=${t?`This ${this.deviceWord} has no free slot. Delete a complication first.`:"Make a new complication"}
        @click=${()=>this.openNewDialog()}>${H("plus")}<span>New</span></button>
      <button class="new-btn" ?disabled=${t} aria-haspopup="dialog" aria-expanded=${this.importOpen?"true":"false"}
        title=${t?`This ${this.deviceWord} has no free slot. Delete a complication first.`:"Paste a complication somebody shared"}
        @click=${()=>this.openImportDialog()}><span>Import</span></button>
      ${t?h`<span class="newc-full">${this.deviceWord} is full</span>`:m}
    </div>`}takenNames(){let t=[...this.records.map(i=>String(i.document?.name??"")),...this.occupied.map(i=>"name"in i&&typeof i.name=="string"?i.name:"")];return new Set(t.map(i=>i.trim().toLowerCase()).filter(i=>i!==""))}newNameProblem(){let t=this.newName.trim();if(t!==""&&this.takenNames().has(t.toLowerCase()))return`A complication on this ${this.deviceWord} already has that name.`}newPlaces(){return Uu(this.selectedOwner,this.ownerFamilies,Vu(this.selectedOwner))}pickedIn(t){let i=0;for(let a of this.newFamilies)no(a,this.selectedOwner)===t&&(i+=1);return i}firstPlace(){let t=this.newPlaces();return t.length>0?t[0].place:En(this.selectedOwner?.app_version)?"control":void 0}renderNewDialog(){let t=this.newNameProblem(),i=this.newName.trim()!=="",a=En(this.selectedOwner?.app_version),r=this.newPlaces(),o=this.newPlace??this.firstPlace(),s=this.newFamilies.size+(this.newControl?1:0),l=i&&t===void 0&&s>0;return h`<dialog class="new-dialog" @keydown=${this.newKeys} @close=${()=>{this.newOpen=!1}}>
      <div class="new-head">
        <h2>New complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${()=>this.closeNewDialog()}>${H("close")}</button>
      </div>
      <div class="new-body">
        <div class="field">
          <span>Name</span>
          <input type="text" .value=${this.newName} placeholder="Kitchen at a glance" maxlength="60"
            aria-label="Complication name" aria-invalid=${t?"true":"false"}
            @input=${c=>{this.newName=c.target.value}} />
        </div>
        ${t?h`<div class="hint err">${t}</div>`:h`<div class="hint">${Ae(this.selectedOwner)==="iphone"?"This is the name the Lock Screen customise screen and the Home Screen widget picker show, so make it one you will recognise there.":"This is what the name shows on the watch face picker, so make it one you will recognise there."}</div>`}
        <div class="field new-shapes">
          <span>Where does it live?</span>
          <div class="place-cards" role="tablist" aria-label="Where does it live?">
            ${r.map(c=>this.renderPlaceCard({label:c.label,art:iA(c.place),open:o===c.place,picked:this.pickedIn(c.place),click:()=>{this.newPlace=c.place}}))}
            ${a?this.renderPlaceCard({label:"Control Center",art:aA(Ae(this.selectedOwner)==="iphone"),open:o==="control",ticked:this.newControl,click:()=>{o==="control"?this.newControl=!this.newControl:(this.newPlace="control",this.newControl=!0)}}):m}
          </div>
        </div>
        ${o===void 0?m:o==="control"?this.renderControlPanel():this.renderShapePanel(r.find(c=>c.place===o))}
      </div>
      <div class="new-foot">
        <span class="new-count">${T.pickedWords(s,this.newFamilies,this.selectedOwner)}</span>
        <button class="small" @click=${()=>this.closeNewDialog()}>Cancel</button>
        <button class="primary" ?disabled=${!l}
          title=${l?"Make it":i?t||(a?"Tick a shape or the control first":"Tick a shape first"):"Give it a name first"}
          @click=${()=>this.createNew()}>${s>1?`Create ${s} shapes`:"Create"}</button>
      </div>
    </dialog>`}renderPlaceCard(t){let i=t.picked??0,a=t.ticked===!0||i>0;return h`<button type="button" role="tab" class="place-card ${t.open?"open":""} ${a?"has":""}"
      aria-selected=${t.open?"true":"false"} aria-controls="pick-panel"
      title=${t.ticked===void 0?`Shapes on the ${t.label}`:"A toggle or a button in Control Center"}
      @click=${t.click}>
      ${t.art}
      <span class="place-card-name">${t.label}</span>
      ${t.ticked!==void 0?t.ticked?Pv():m:i>0?h`<span class="place-count" aria-label=${`${i} picked`}>${i}</span>`:m}
    </button>`}renderShapePanel(t){if(!t)return m;let i=t.place==="home"?"Biggest first":"Widest first",a=t.place==="home"?"size":"shape";return h`<div class="pick-panel" id="pick-panel" role="tabpanel">
      <div class="pick-head">
        <span class="pick-title">${t.label} ${t.place==="home"?"sizes":"shapes"}</span>
        <span class="pick-order">${i}</span>
      </div>
      <div class="shape-cards" role="group" aria-label=${`${t.label} shapes`}>
        ${t.families.map(r=>{let o=this.newFamilies.has(r);return h`<button type="button" role="checkbox" class="shape-card ${o?"on":""}"
            aria-checked=${o?"true":"false"}
            @click=${()=>this.toggleNewFamily(r)}>
            ${bd(r,Ae(this.selectedOwner)==="iphone")}
            <span class="shape-card-name">${ie(r)}</span>
            ${o?Pv():h`<span class="pick-tick off" aria-hidden="true"></span>`}
          </button>`})}
        ${t.comingSoon.map(r=>h`<button type="button" role="checkbox" class="shape-card soon" disabled
          aria-checked="false" aria-disabled="true" title="Coming soon">
          ${bd(r,Ae(this.selectedOwner)==="iphone")}
          <span class="shape-card-name">${ie(r)}</span>
          <span class="shape-card-note">Coming soon${Da(r)?h`<br />${Da(r)}`:m}</span>
        </button>`)}
      </div>
      <div class="hint">Every ${a} is its own design. Nothing copies across on its own, so build the ${t.place==="home"?"biggest":"widest"} one first and trim it down for the smaller ones.</div>
      ${t.place==="home"&&Oa(this.newFamilies)?h`<div class="hint keep">${Oa(this.newFamilies)}</div>`:m}
    </div>`}renderControlPanel(){let t=Ae(this.selectedOwner)==="iphone";return h`<div class="pick-panel words" id="pick-panel" role="tabpanel">
      <div class="pick-head"><span class="pick-title">Control Center</span></div>
      <div class="hint">A toggle or a button, on ${t?"the Control Center page and the Lock Screen's bottom corners":"the Control Center that swipes up from the watch face"}. ${this.newControl?this.newFamilies.size===0?"With no shape ticked beside it, this complication appears there and nowhere else.":"It sits beside the shapes rather than instead of them.":"Click the card above to add one."}</div>
    </div>`}toggleNewFamily(t){let i=new Set(this.newFamilies);i.delete(t)||i.add(t),this.newFamilies=i}static pickedWords(t,i,a){if(t===0)return"";let r=new Set;for(let o of i)r.add(no(o,a));return r.size>1?`${t} picked, across ${r.size} places.`:t===1?"1 picked.":`${t} picked.`}openNewDialog(){this.freeSlot()<0||(this.newOpen=!0,this.newName="",this.newFamilies=new Set,this.newPlace=void 0,this.newControl=!1,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.new-dialog");t&&(t.open||t.showModal(),t.querySelector("input[type=text]")?.focus())}))}closeNewDialog(){let t=this.renderRoot.querySelector("dialog.new-dialog");t?.open?t.close():this.newOpen=!1}knownDomains(){let t=new Set;for(let i of Object.keys(this.hass.states)){let a=i.split(".")[0]??"";a!==""&&t.add(a)}return t}currentShareSlots(){let t=this.shareConfig();return t?fd(t,this.knownDomains()).map(i=>{let a=this.shareLabels.get(i.placeholderId);return a===void 0?i:{...i,label:a}}):[]}renderShareDialog(){let t=this.draft?.config,i=this.shareConfig();if(!t||!i)return m;let a=gt(t),r=this.sharePicked(),o=r.length>0||a.length===0,s=this.currentShareSlots(),l=this.shareMode==="share",c=l?li(gd(i,this.shareNameOverrides()),"share",s):li(i,"backup"),d=this.shareLink?.text===c?this.shareLink:void 0,u=en(i,this.buildContext(),this.forced),p=l&&o?this.publicNameRows(i,s,this.knownDomains(),this.shareNameOverrides(),{label:"Name",value:i.name.trim()||"Untitled"}):[],f=p.find(C=>C.key===this.shareFocus),g=f?.ids??[],b=this.dialogFamily(i),y=this.hass.user?.is_admin===!0,v=this.shareCopied,k=0,S=this.shareSection(++k,"s-who","Who is it for",h`
      <div class="seg wide xf-modes" role="group" aria-label="Who is it for">
        <button class=${l?"on":""} aria-pressed=${l?"true":"false"} @click=${()=>this.setShareMode("share")}>${H("globe")}<span>Share with others</span></button>
        <button class=${l?"":"on"} aria-pressed=${l?"false":"true"} @click=${()=>this.setShareMode("backup")}>${H("lock")}<span>Backup for me</span></button>
      </div>
      <div class="xf-lead ${l?"":"warn"}">${H(l?"info":"lock")}
        <span>${l?"Your entities are removed. The other person picks their own.":"Exact copy with your entities. Keep it for yourself or this home."}</span></div>`),I=r.length===a.length,_=a.length<2?m:this.shareSection(++k,"s-shapes","Pick the shapes",h`
      ${this.familyChips(a,C=>this.shareFamilies.has(C),C=>this.setShareFamilies(C),!1)}
      ${o?m:h`<div class="xf-lead">${H("info")}<span>Only the shapes you pick go in the copy. Pick at least one.</span></div>`}`,h`${r.length} of ${a.length}<button class="link" @click=${()=>this.setShareFamilies(new Set(I?[]:a))}>${I?"None":"All"}</button>`),E=l?this.shareSection(++k,"s-names","Public names",o?this.renderPublicRows(p,this.shareFocus,C=>this.pointAtRow(p,C,M=>{this.shareFocus=M})):h`<div class="hint">Pick a shape first.</div>`,m,!o):m,z=this.shareSection(++k,"s-send","Send it",h`
      <div class="xf-acts">
        <button class="xf-act" ?disabled=${!l||!y||!o} aria-haspopup="dialog"
          @click=${()=>this.openGalleryDialog()}>
          <span class="ic">${H("globe")}</span><b>Post to online gallery</b>
          <span>${l?y?"Everyone can find it, after review":"Needs a Home Assistant administrator":"Only shares can go"}</span>
        </button>
        <button class="xf-act ${v==="link"?"flash":""}" ?disabled=${!o} @click=${()=>{this.copyShareLink(c)}}>
          <span class="ic">${H(v==="link"?"check":"link")}</span><b>${v==="link"?"Link copied":"Copy link"}</b>
          <span>Opens in their own Home Assistant</span>
        </button>
        <button class="xf-act ${v==="file"?"flash":""}" ?disabled=${!o} title=${`Saves ${th(i)}`} @click=${()=>this.downloadShareText(c)}>
          <span class="ic">${H(v==="file"?"check":"download")}</span><b>${v==="file"?"Saved":"Download"}</b>
          <span>A .json file</span>
        </button>
      </div>
      ${d&&this.shareLinkShown?h`<input class="xfer-link" type="text" readonly aria-label="Share link" .value=${d.url}
        @focus=${C=>C.target.select()} />`:m}
      ${this.shareNote===""?m:h`<div class="hint xf-note" role="status">${this.shareNote}</div>`}
      <a class="xf-galink" href=${fh} target="_blank" rel="noopener">${H("globe")}<span>See the online gallery</span>${H("arrow")}</a>
      <details class="xf-raw" .open=${this.shareTextOpen}
        @toggle=${C=>{this.shareTextOpen=C.target.open}}>
        <summary>${H("right")}<span>Share text</span></summary>
        <textarea class="xfer-text" rows="10" readonly aria-label="The text to share" .value=${c}></textarea>
        <button class="link" @click=${()=>{this.copyShareText(c,"text")}}>${v==="text"?"Copied":"Copy text"}</button>
      </details>`,m,!o);return h`<dialog class="share-dialog xf ${this.galleryOpen?"under":""}" @close=${()=>{this.shareOpen=!1,this.pointAtRow([],void 0,()=>{})}}>
      ${this.dialogHead(`Share \u201C${i.name.trim()||"Untitled"}\u201D`,a.length===0?"A Control Center control, and no shape":`${o?Mv(r):"No shapes picked yet"} \xB7 ${mh(i)}`,()=>this.closeShareDialog())}
      <div class="xfer-body">
        ${this.dialogPreview(u,b,g,f&&g.length>0?h`Where <b>${f.name}</b> is`:b?ie(b):"",p.some(C=>C.ids.length>0)?"Point at a name to see where it is":"")}
        ${S}${_}${E}${z}
      </div>
    </dialog>`}shareSection(t,i,a,r,o=m,s=!1){return h`<section class="xf-sec ${i} ${s?"locked":""}">
      <h3><i>${t}</i><span>${a}</span>${o===m?m:h`<span class="r">${o}</span>`}</h3>
      <div class="xf-sec-b" ?inert=${s}>${r}</div>
    </section>`}pointAtRow(t,i,a){a(i);let r=i===void 0?[]:t.find(o=>o.key===i)?.ids??[];this.listHoverIds=r,this.dialogLitIds=i?.startsWith("g:")?[i.slice(2),...r]:r,r.length!==0&&this.updateComplete.then(()=>{this.renderRoot.querySelector(".layer.lit")?.scrollIntoView({block:"nearest"})})}dialogHead(t,i,a,r=m){return h`<div class="xf-head">
      <div class="xf-t"><h2>${t}</h2>${i===""||i===m?m:h`<span>${i}</span>`}</div>
      ${r}
      <button class="icon" title="Close" aria-label="Close" @click=${a}>${H("close")}</button>
    </div>`}dialogFamily(t){return xl(t)??(t.supportedFamilies.includes("inline")?"inline":void 0)}dialogPreview(t,i,a,r,o,s=!1){if(i===void 0)return m;let l=m,c=!1;if(i==="inline")l=this.renderInlinePreview(t.inline,!0),c=a.length>0;else{let d=t[i];if(d){let u=a.filter(p=>d.elements.some(f=>f.id===p));c=a.length>0&&u.length===0,l=ei(d,{icons:this.icons,imageSizes:this.imageSizes,slot:Tn(this.referenceCase,i),pictureScene:s,...u.length>0?{spotlightIds:u}:{}})}}return h`<div class="xf-prev-wrap">
      <div class="xf-prev ${i}">${l}</div>
      <div class="xf-prev-cap"><span>${r}${c?", on another shape":""}</span>${o===""?m:h`<span>${o}</span>`}</div>
    </div>`}layerTags(t,i,a,r){return a.length===0?m:h`<span class="xf-uses">${a.map(o=>{let s=t.elements.find(d=>d.payload.id===o);if(!s)return m;let l=ue.find(d=>Ft(t,d).some(u=>u.payload.id===o)),c=l?i[l]:void 0;return h`<span class="xf-use">
        <span class="xf-lt">${c?yl(c,[o],{icons:this.icons,imageSizes:this.imageSizes,width:34,height:20}):m}</span>
        <span class="xf-ln">${Te(s,r)}</span><em>${lt[s.kind]}</em>
      </span>`})}</span>`}leaveRows(t,i){let a=t.currentTarget,r=t instanceof FocusEvent?t.relatedTarget:a.getRootNode().activeElement;r instanceof Node&&a.contains(r)||i()}shareConfig(){let t=this.draft?.config;if(!t)return t;let i=this.sharePicked();return i.length===0||i.length===gt(t).length?t:qu(t,i)}sharePicked(){let t=this.draft?.config;if(!t)return[];let i=gt(t);return i.length<2?i:i.filter(a=>this.shareFamilies.has(a))}shareNameOverrides(){let t=new Map,i=this.draft?.config;if(i&&this.shareLayerNames.size>0)for(let a of i.elements){let r=a.payload.name===void 0?void 0:this.shareLayerNames.get(a.payload.name.trim());r!==void 0&&t.set(a.payload.id,r)}return{name:this.shareName,groupNames:this.shareGroupNames,valueNames:this.shareValueNames,layerNames:t}}setShareFamilies(t){this.shareFamilies=t,this.pointAtRow([],void 0,i=>{this.shareFocus=i}),this.shareNote="",this.shareLinkShown=!1}familyChips(t,i,a,r){let o=t.filter(i).length;return h`<div class="gal-tags xf-shapes" role="group" aria-label="Shapes">${t.map(s=>{let l=i(s),c=r&&l&&o===1;return h`<button class="pk-chip ${l?"on":""}" aria-pressed=${l?"true":"false"} ?disabled=${c}
        title=${c?"At least one shape stays on":l?`Leave ${ie(s)} out`:`Put ${ie(s)} in`}
        @click=${()=>{let d=new Set(t.filter(i));l?d.delete(s):d.add(s),a(d)}}>${l?H("check"):m}${ie(s)}</button>`})}</div>`}publicNameRows(t,i,a,r,o){let s=gv(t,i,r),l=(p,f)=>a.has(f),c=(p,f,g,b,y)=>h`<input type="text" maxlength=${y??m} aria-label=${`${p}: ${f}`}
          .value=${g??f} placeholder=${f} ?disabled=${this.gallerySending}
          @input=${v=>b(v.target.value)} />`,d=[{key:"head",label:o.label,name:o.value,ids:[],control:c(o.label,t.name.trim(),this.shareName===""?void 0:this.shareName,p=>{this.shareName=p})}],u=(p,f,g)=>c(f,p.original,g??(p.value===p.original?void 0:p.value),b=>this.setPublicName(p,b),p.kind==="slot"?40:void 0);for(let p of s){if(p.rows){for(let f of p.rows)if(f.kind==="group")d.push({key:`g:${f.id}`,label:"Group name",name:f.value,ids:Rt(t,f.id).map(g=>g.payload.id),control:u(f,"Group name",this.shareGroupNames.get(f.id))});else if(f.kind==="shared")d.push({key:`v:${f.id}`,label:"Shared value name",name:f.value,ids:Rm(t,f.id),control:u(f,"Shared value name",this.shareValueNames.get(f.id))});else{let g=i.find(b=>b.placeholderId===f.id);d.push({key:`e:${f.id}`,label:"Entity name",name:f.value,ids:g?tu(t,g.originalId,l):[],control:u(f,"Entity name",void 0)})}continue}if(p.label==="Layer names"){let f=[];for(let g of t.elements){let b=g.payload.name?.trim();b&&!Re(t,g)&&!f.includes(b)&&f.push(b)}for(let g of f){let b=t.elements.filter(y=>!Re(t,y)&&y.payload.name?.trim()===g).map(y=>y.payload.id);d.push({key:`l:${g}`,label:"Layer name",name:g,ids:b,control:c("Layer name",g,this.shareLayerNames.get(g),y=>this.setShareLayerName(g,y))})}continue}p.values.forEach((f,g)=>{d.push({key:`t:${p.label}:${g}`,label:qR[p.label]??p.label,name:f,ids:[],control:h`<div class="xf-pill mono">${f}</div>`})})}return d}renderPublicRows(t,i,a){let r=()=>a(void 0);return h`
      <div class="xf-lead">${H("info")}<span>Others can see these names. Change the names of layers and groups here before you share, if you want.</span></div>
      <div class="xf-pub" @pointerleave=${o=>this.leaveRows(o,r)} @focusout=${o=>this.leaveRows(o,r)}>
        ${t.map(o=>{let s=o.key===i&&o.ids.length>0,l=()=>a(o.key);return h`<div class="kv ${s?"on":""}" @pointerenter=${l} @focusin=${l}>
            <span class="k">${o.label}</span>
            <div class="v">${o.control}</div>
          </div>`})}
      </div>
      <div class="hint">Your own complication keeps its names. An empty box keeps the name it had.</div>`}setShareMode(t){this.shareMode=t,this.shareNote="",this.pointAtRow([],void 0,i=>{this.shareFocus=i}),this.shareCopied=void 0,this.shareLinkShown=!1}setShareLabel(t,i){let a=new Map(this.shareLabels);a.set(t,i),this.shareLabels=a}openShareDialog(){this.draft&&(this.shareOpen=!0,this.shareMode="share",this.shareLabels=new Map,this.shareFamilies=new Set,this.shareGroupNames=new Map,this.shareValueNames=new Map,this.shareName="",this.shareLayerNames=new Map,this.shareNote="",this.shareTextOpen=!1,this.shareLink=void 0,this.shareLinkShown=!1,this.shareCopied=void 0,this.shareFocus=void 0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.share-dialog");t&&!t.open&&t.showModal()}))}closeShareDialog(){let t=this.renderRoot.querySelector("dialog.share-dialog");t?.open?t.close():this.shareOpen=!1}galleryMeta(){return{title:this.galleryTitle,description:this.galleryDescription,authorName:this.galleryNickname,tags:[...this.galleryTags],panelVersion:this.panel?.config?.version??""}}openGalleryDialog(){let t=this.shareConfig();!t||!this.hass.user?.is_admin||this.sharePicked().length===0||(this.pointAtRow([],void 0,i=>{this.shareFocus=i}),this.galleryOpen=!0,this.galleryTitle=(this.shareName.trim()||t.name.trim()).slice(0,Ee.title),this.galleryDescription="",this.galleryTags=new Set,this.galleryNickname=WR(),this.gallerySending=!1,this.gallerySent=!1,this.galleryError="",this.galleryPreviews=void 0,this.galleryPreviewNote="",this.galleryConfirmDelete=void 0,this.galleryTab="new",this.galleryStep=1,this.galleryReplaces=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.gallery-dialog");i&&!i.open&&i.showModal()}),this.makeGalleryPreviews(t,this.currentShareSlots()),this.loadGalleryUploads())}galleryOverrides(){return{...this.shareNameOverrides(),name:this.galleryTitle}}setShareLayerName(t,i){let a=new Map(this.shareLayerNames);a.set(t,i),this.shareLayerNames=a}setPublicName(t,i){if(t.kind==="slot"){if(this.setShareLabel(t.id,i),!this.galleryOpen)return;window.clearTimeout(this.galleryRedrawTimer),this.galleryRedrawTimer=window.setTimeout(()=>{let r=this.shareConfig();!r||!this.galleryOpen||this.gallerySent||(this.galleryPreviews=void 0,this.galleryPreviewNote="",this.makeGalleryPreviews(r,this.currentShareSlots()))},500);return}let a=new Map(t.kind==="group"?this.shareGroupNames:this.shareValueNames);a.set(t.id,i),t.kind==="group"?this.shareGroupNames=a:this.shareValueNames=a}closeGalleryDialog(){let t=this.renderRoot.querySelector("dialog.gallery-dialog");t?.open?t.close():this.galleryOpen=!1}async makeGalleryPreviews(t,i){let a=++this.galleryPreviewRun;try{let r=await Sv(t,i,{entityState:o=>this.entityStateFor(o,"",!1),templateResults:this.templateResults,historySeries:this.historySeries,listItems:this.listItems},this.icons);if(a!==this.galleryPreviewRun)return;this.galleryPreviews=r}catch{if(a!==this.galleryPreviewRun)return;this.galleryPreviews=[],this.galleryPreviewNote="The preview pictures could not be made. It can still be sent without them."}}async ensureGalleryKey(){return this.galleryKey===void 0&&(this.galleryKey=(await Nm(this.hass)).key),this.galleryKey}async loadGalleryUploads(){this.galleryUploadsError="";try{let t=await this.ensureGalleryKey();this.galleryUploads=await wv(hh,t)}catch(t){this.galleryUploads=[],this.galleryUploadsError=t instanceof dn?yd(t):"Could not read this Home Assistant's gallery key."}}async sendToGallery(){let t=this.shareConfig();if(!t||this.gallerySending||this.gallerySent||this.galleryPreviews===void 0)return;let i=this.currentShareSlots(),a=this.galleryMeta(),r=this.galleryOverrides();if(!(yv(t,i,a,this.knownDomains(),r).length>0)){this.gallerySending=!0,this.galleryError="";try{let o=await this.ensureGalleryKey();await vv(hh,o,{...dh(t,i,a,r),previews:this.galleryPreviews,...this.galleryReplaces?{replaces:this.galleryReplaces.id}:{}}),this.gallerySent=!0,jR(a.authorName.trim()),this.loadGalleryUploads()}catch(o){this.galleryError=o instanceof dn?yd(o):"Could not read this Home Assistant's gallery key. Try again."}finally{this.gallerySending=!1}}}async deleteGalleryUpload(t){if(this.galleryConfirmDelete!==t){this.galleryConfirmDelete=t;return}this.galleryDeleting=t,this.galleryUploadsError="";try{let i=await this.ensureGalleryKey();await $v(hh,i,t),this.galleryUploads=this.galleryUploads?.filter(a=>a.id!==t),this.loadGalleryUploads()}catch(i){this.galleryUploadsError=i instanceof dn?yd(i):"Could not delete it. Try again."}finally{this.galleryDeleting=void 0,this.galleryConfirmDelete=void 0}}toggleGalleryTag(t){let i=new Set(this.galleryTags);i.has(t)?i.delete(t):i.size<Ee.tags&&i.add(t),this.galleryTags=i}renderGalleryDialog(){let t=this.shareConfig();if(!t)return m;let i=this.galleryUploads?kv(this.galleryUploads):void 0,a=this.galleryTab,r=h`<div class="seg xf-tabs" role="group" aria-label="Gallery view">
      <button class=${a==="new"?"on":""} aria-pressed=${a==="new"?"true":"false"} @click=${()=>this.setGalleryTab("new")}>New</button>
      <button class=${a==="mine"?"on":""} aria-pressed=${a==="mine"?"true":"false"} @click=${()=>this.setGalleryTab("mine")}>My uploads<span class="xf-count">${i===void 0?"\u2026":i.length}</span></button>
    </div>`;return h`<dialog class="gallery-dialog xf" @close=${()=>{this.galleryOpen=!1,this.pointAtRow([],void 0,()=>{})}}>
      ${this.dialogHead("Post to online gallery",h`<a class="xf-galink" href=${fh} target="_blank" rel="noopener">wrist-assistant.com/gallery</a>`,()=>this.closeGalleryDialog(),r)}
      ${a==="mine"?this.renderGalleryUploads(i):this.gallerySent?this.renderGallerySent():this.renderGallerySteps(t)}
    </dialog>`}setGalleryTab(t){t==="new"&&(this.gallerySent&&(this.gallerySent=!1,this.galleryStep=1,this.galleryError=""),this.galleryTab==="new"&&(this.galleryReplaces=void 0)),this.galleryTab=t,this.galleryConfirmDelete=void 0}goGalleryStep(t){this.galleryStep=t}startGalleryUpdate(t){this.galleryReplaces={id:t.id,title:t.title},this.galleryTitle=t.title.slice(0,Ee.title),this.galleryTab="new",this.galleryStep=1,this.gallerySent=!1,this.galleryError="",this.galleryConfirmDelete=void 0}renderGallerySent(){return h`<div class="xfer-body"><div class="xf-done">
      <span class="big">${H("check")}</span>
      <b>Sent for review</b>
      <p>${this.galleryReplaces?"The new version goes up after it is approved. Until then the old one stays.":"It shows in the gallery after it is approved. Check My uploads for its status."}</p>
      <div class="btns">
        <button class="small" @click=${()=>this.setGalleryTab("mine")}>My uploads</button>
        <button class="primary" @click=${()=>this.closeGalleryDialog()}>Done</button>
      </div>
    </div></div>`}renderGallerySteps(t){let i=this.currentShareSlots(),a=this.galleryOverrides(),r=this.knownDomains(),o=bv(t,i,this.galleryMeta(),r,a),s=this.galleryStep,l=o.details.length===0,c=[...o.details,...o.send],d=c.length===0&&this.galleryPreviews!==void 0&&!this.gallerySending,u=c.length>0?c[0]:this.galleryPreviews===void 0?"Drawing the preview pictures":"Send it for review",f=h`<nav class="xf-steps" aria-label="Steps">${["Details","Send"].map((b,y)=>{let v=y+1;return h`<button class="xf-step ${v<s?"past":""}" aria-current=${v===s?"step":m}
        ?disabled=${v>1&&!l} @click=${()=>this.goGalleryStep(v)}>
        <i>${v<s?H("check"):v}</i>${b}</button>`})}</nav>`,g=s===1?this.renderGalleryDetails(o.details):this.renderGallerySend(t,i,c);return h`${f}
      <div class="xfer-body">
        ${this.galleryReplaces?h`<div class="xf-banner">${H("info")}<span>New version of <b>${this.galleryReplaces.title}</b>. The link and votes stay. The old version stays up until this one is approved.</span></div>`:m}
        ${g}
      </div>
      <div class="xfer-foot">
        ${s===1?h`<button class="ghost" @click=${()=>this.closeGalleryDialog()}>Back to Share</button>`:h`<button class="ghost" @click=${()=>this.goGalleryStep(1)}>Back</button>`}
        <span class="spacer"></span>
        ${s===1?h`<button class="primary" ?disabled=${!l} title=${l?"Next step":o.details[0]}
              @click=${()=>this.goGalleryStep(2)}>Next${H("arrow")}</button>`:h`<button class="primary" ?disabled=${!d} title=${u}
              @click=${()=>{this.sendToGallery()}}>${this.gallerySending?"Sending\u2026":"Send for review"}</button>`}
      </div>`}renderGalleryDetails(t){let i=this.galleryTags;return h`<div class="xf-two">
      <div class="xf-stack xf-form">
        <label class="xf-f"><span class="xf-label">Title</span>
          <input type="text" maxlength=${Ee.title} .value=${this.galleryTitle}
            @input=${a=>{this.galleryTitle=a.target.value}} /></label>
        <label class="xf-f"><span class="xf-label">Description <span class="r">Optional</span></span>
          <textarea rows="2" maxlength=${Ee.description} .value=${this.galleryDescription}
            @input=${a=>{this.galleryDescription=a.target.value}}></textarea></label>
        <div class="xf-f"><span class="xf-label">Tags <span class="r">${i.size} of ${Ee.tags}</span></span>
          <div class="gal-tags">
            ${sh.map(a=>{let r=i.has(a);return h`<button class="pk-chip ${r?"on":""}" aria-pressed=${r?"true":"false"}
                ?disabled=${!r&&i.size>=Ee.tags}
                @click=${()=>this.toggleGalleryTag(a)}>${lh[a]}</button>`})}
          </div></div>
        <label class="xf-f"><span class="xf-label">Your name <span class="r">Optional</span></span>
          <input type="text" maxlength=${Ee.authorName} .value=${this.galleryNickname}
            @input=${a=>{this.galleryNickname=a.target.value}} /></label>
        ${t.length>0?h`<ul class="xf-blockers" role="alert">${t.map(a=>h`<li>${a}</li>`)}</ul>`:m}
      </div>
      <div>${this.galleryCard()}<div class="xf-caption">How it looks in the gallery</div></div>
    </div>`}galleryCard(){let t=this.galleryPreviews,i=this.galleryNickname.trim();return h`<div class="xf-gcard">
      <div class="img">${t===void 0?h`<span class="hint">Drawing…</span>`:t[0]?h`<img alt="Gallery picture" src=${`data:image/png;base64,${t[0].png}`} />`:h`<span class="hint">${this.galleryPreviewNote||"No picture for this shape"}</span>`}</div>
      <div class="meta">
        <b>${this.galleryTitle.trim()||"Untitled"}</b>
        <span>${i?`by ${i}`:"No name"}</span>
        ${this.galleryTags.size>0?h`<span class="tg">${[...this.galleryTags].map(a=>h`<em>${lh[a]}</em>`)}</span>`:m}
      </div>
    </div>`}renderGallerySend(t,i,a){let r=this.galleryTags.size,o=t.elements.some(s=>s.kind==="image");return h`<div class="xf-two">
      <div class="xf-stack xf-form">
        <div class="xf-checks">
          <div>${H("check")}<span>${r===0?"Title, no tags":`Title and ${r===1?"1 tag":`${r} tags`}`}</span></div>
          <div>${H("check")}<span>${i.length>0?"Your entities are removed":"It reads none of your entities"}</span></div>
          <div>${H("check")}<span>${o?"Pictures show as a stand-in, never your photo":"The preview shows your current values"}</span></div>
        </div>
        ${a.length>0?h`<ul class="xf-blockers" role="alert">${a.map(s=>h`<li>${s}</li>`)}</ul>`:m}
        ${this.galleryError!==""?h`<div class="xf-blockers" role="alert">${this.galleryError}</div>`:m}
      </div>
      <div>${this.galleryCard()}</div>
    </div>`}renderGalleryUploads(t){return h`<div class="xfer-body">
      ${this.galleryUploadsError!==""?h`<div class="xf-blockers" role="alert">${this.galleryUploadsError}</div>`:m}
      ${t===void 0?h`<div class="hint">Loading…</div>`:t.length===0?this.galleryUploadsError===""?h`<div class="xf-lead">${H("info")}<span>Nothing sent from this Home Assistant yet.</span></div>`:m:h`<div class="xf-rows">${t.map(i=>this.renderUploadRow(i))}</div>`}
      <div class="xf-lead">${H("info")}<span><b>Update</b> sends this complication as a new version. The link and votes stay. <b>Delete</b> removes it for everyone.</span></div>
    </div>`}renderUploadRow(t){let i=t.upload;return h`<div class="xf-up">
      <span class="xf-up-thumb">${i.previewUrl?h`<img src=${i.previewUrl} alt="" loading="lazy" />`:m}</span>
      <div class="xf-main">
        <div class="xf-up-t"><b>${i.title}</b>${this.uploadStatus(i)}</div>
        <div class="sub">${ph(i)}</div>
      </div>
      <div class="xf-up-acts">
        ${t.canUpdate?h`<button class="small" title="Send this complication as a new version of it"
          @click=${()=>this.startGalleryUpdate(i)}>Update</button>`:m}
        ${this.uploadDelete(i,!1)}
      </div>
      ${t.updates.map(a=>h`<div class="xf-up-v">
        <div class="xf-main">
          <div class="xf-up-t">${this.uploadStatus(a)}</div>
          <div class="sub">${ph(a)}</div>
        </div>
        <div class="xf-up-acts">${this.uploadDelete(a,!0)}</div>
      </div>`)}
    </div>`}uploadStatus(t){return h`<span class="gal-status ${Io(t)?"pending":t.status}">${Cv(t)}</span>`}uploadDelete(t,i){let a=this.galleryDeleting!==void 0;if(this.galleryConfirmDelete===t.id||this.galleryDeleting===t.id){let r=this.galleryDeleting===t.id;return h`${r?m:h`<button class="small" @click=${()=>{this.galleryConfirmDelete=void 0}}>Keep</button>`}
        <button class="small danger" ?disabled=${a}
          title=${i?"Withdraws this new version. The one in the gallery stays.":"Removes it from the gallery for everyone"}
          @click=${()=>{this.deleteGalleryUpload(t.id)}}>${r?"Deleting\u2026":i?"Withdraw it":"Delete for good"}</button>`}return h`<button class="icon danger" ?disabled=${a}
      title=${i?"Withdraw this new version":"Delete it from the gallery"}
      aria-label=${i?`Withdraw the new version of ${t.title}`:`Delete ${t.title}`}
      @click=${()=>{this.deleteGalleryUpload(t.id)}}>${H("delete")}</button>`}async copyShareText(t,i){this.shareNote="";try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(t),this.flashShare(i);return}}catch{}i==="text"?this.shareTextOpen=!0:this.shareLinkShown=!0,await this.updateComplete;let a=this.renderRoot.querySelector(i==="text"?"dialog.share-dialog textarea.xfer-text":"dialog.share-dialog input.xfer-link");a?.focus(),a?.select();let r=!1;try{r=document.execCommand("copy")}catch{r=!1}r?this.flashShare(i):this.shareNote="Press Cmd+C or Ctrl+C to copy."}flashShare(t){this.shareCopied=t,window.clearTimeout(this.shareCopiedTimer),this.shareCopiedTimer=window.setTimeout(()=>{this.shareCopied=void 0},1600)}async copyShareLink(t){let i=await cv(t),a=pv(uv,i);this.shareLink={text:t,url:a},await this.copyShareText(a,"link")}downloadShareText(t){let i=this.draft?.config;if(!i)return;let a=th(i),r=URL.createObjectURL(new Blob([t],{type:"application/json"})),o=document.createElement("a");o.href=r,o.download=a,o.click(),window.setTimeout(()=>URL.revokeObjectURL(r),0),this.shareNote="",this.flashShare("file")}importConfig(){let t=this.importParse;if(!t?.ok)return;let i=Ku(t.config,this.ownerFamilies),a=this.importFamilies===void 0?i:i.filter(r=>this.importFamilies.has(r));return a.length===gt(t.config).length?t.config:qu(t.config,a)}setImportFamilies(t){this.importFamilies=t,this.importFocus=void 0,this.scheduleImportHistory()}renderImportDialog(){let t=this.importConfig();return h`<dialog class="import-dialog xf ${this.importDrop?"dropping":""}" @keydown=${this.importKeys} @close=${()=>this.importClosed()}
      @dragenter=${this.importDragEnter} @dragover=${this.importDragOver} @dragleave=${this.importDragLeave} @drop=${this.importDropped}
      @paste=${this.importPasted}>
      ${this.dialogHead("Import","",()=>this.closeImportDialog())}
      ${t?this.renderImportLoaded(t):this.renderImportEmpty()}
      ${t&&this.importDrop?h`<div class="xfer-drop" aria-hidden="true"><span>Drop to read the file</span></div>`:m}
    </dialog>`}renderImportEmpty(){let t=this.importParse,i=this.importTextShown||this.importText.trim()!=="";return h`<div class="xfer-body">
      <div class="xf-drop ${this.importDrop?"over":""}">
        <span class="big">${H("paste")}</span>
        <b>Paste a share link</b>
        <p>Press <kbd>${Za==="Cmd"?"\u2318":"Ctrl"}</kbd> <kbd>V</kbd> anywhere here, or drop a file.</p>
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
      <a class="xf-galtile" href=${fh} target="_blank" rel="noopener">
        <span class="ic">${H("globe")}</span>
        <span class="t"><b>Browse the online gallery</b><span>Ready-made complications from other people</span></span>
        ${H("arrow")}
      </a>
    </div>
    <div class="xfer-foot">
      <span class="spacer"></span>
      <button class="small" @click=${()=>this.closeImportDialog()}>Cancel</button>
    </div>`}renderImportLoaded(t){let i=md(t,this.hass.states),a=this.knownDomains(),r=this.importParse,o=Ku(r?.ok?r.config:t,this.ownerFamilies),s=this.importPreview(),l=s?this.configLayouts(s.config,s.entities,this.importHistory):{},c=new Map(i.map(S=>[S.entityId,tu(t,S.entityId,(I,_)=>oa(I)||a.has(_))])),d=i.filter(S=>S.required),u=d.filter(S=>this.importMap.has(S.entityId)).length,p=i.find(S=>S.entityId===this.importFocus),f=this.dialogFamily(t),g=this.importName.trim(),b=this.takenNames(),y=g!==""&&b.has(g.toLowerCase()),v=oh({parsed:!0,name:this.importName,taken:b,unchosen:0}),k=()=>{this.importFocus=void 0};return h`<div class="xfer-body">
      <div class="xf-hero">
        ${this.dialogPreview(l,f,p?c.get(p.entityId)??[]:[],p?h`Uses <b>${p.label}</b>`:f?ie(f):"","")}
        <div class="xf-stack">
          <label class="xf-f"><span class="xf-label">Name</span>
            <input type="text" maxlength="60" aria-invalid=${y?"true":"false"} .value=${this.importName}
              @input=${S=>{this.importName=S.target.value}} /></label>
          ${y?h`<div class="hint err">A complication on this ${this.deviceWord} already has that name.</div>`:m}
          ${o.length<2?m:h`<div class="xf-f"><span class="xf-label">Shapes to import<span class="r">${gt(t).length} of ${o.length}</span></span>
            ${this.familyChips(o,S=>this.importFamilies===void 0||this.importFamilies.has(S),S=>this.setImportFamilies(S),!0)}</div>`}
          <div class="xf-sub">${o.length===0&&t.control!==void 0?"A Control Center control, and no shape":h`${o.length<2?`${Mv(o)} \xB7 `:""}${mh(t)}`}</div>
        </div>
      </div>
      ${i.length===0?h`<div class="xf-lead">${H("check")}<span>Every entity this design reads is already in your Home Assistant.</span></div>`:h`<div class="xf-stack">
          <div class="xf-label">Pick your entities${d.length>0?h`<span class="r">${u} of ${d.length}</span>`:m}</div>
          ${d.length>0?h`<div class="xf-bar" role="progressbar" aria-valuemin="0" aria-valuemax=${d.length} aria-valuenow=${u}>
            <i style=${`width:${u/d.length*100}%`}></i></div>`:m}
          <div class="xf-rows" @pointerleave=${S=>this.leaveRows(S,k)} @focusout=${S=>this.leaveRows(S,k)}>
            ${i.map(S=>this.renderImportRow(S,t,l,c.get(S.entityId)??[]))}
          </div>
          ${u<d.length?h`<div class="xf-lead">${H("info")}<span>You can import now and pick the rest later.</span></div>`:m}
        </div>`}
      ${Fo(t)?h`<div class="xf-lead warn">${H("info")}<span>This design filters by areas, labels or floors from the sender's home. Check its aggregate layers after import.</span></div>`:m}
    </div>
    <div class="xfer-foot">
      <button class="ghost" @click=${()=>this.startImportOver()}>Start over</button>
      <span class="spacer"></span>
      <button class="primary" ?disabled=${v!==void 0}
        title=${v??"Save it to this watch and open it in the editor"} @click=${()=>{this.doImport()}}>Import and save</button>
    </div>`}dragReadable(t){let i=t.dataTransfer?[...t.dataTransfer.types]:[];return i.includes("Files")||i.includes("text/plain")}renderImportRow(t,i,a,r){let o=this.importMap.get(t.entityId),s=()=>{this.importFocus=t.entityId};return h`<div class="xf-row pick ${this.importFocus===t.entityId?"on":""}" @pointerenter=${s} @focusin=${s}>
      <span class="ent-ico xf-dom">${Wa(t.domain)}</span>
      <div class="xf-main">
        <div class="xf-name">${t.label}${o?h`<span class="xf-done" title="Picked">${H("check")}</span>`:m}</div>
        ${r.length>0?this.layerTags(i,a,r):h`<div class="xf-sub">${t.where.join(", ")}</div>`}
        ${t.required?m:h`<div class="xf-sub">Not in your Home Assistant right now. Leave it empty to keep the id.</div>`}
        <div class="xf-picker">${st({hass:this.hass},t.label,o??Hv,l=>this.setImportEntity(t.entityId,l),Iv(t.entityId),{compact:!0,domain:t.domain,needed:t.required&&o===void 0})}</div>
      </div>
    </div>`}async pasteImport(){let t="";try{t=await navigator.clipboard.readText()}catch{t=""}if(t.trim()===""){await this.revealImportText();return}this.setImportText(t)}async revealImportText(){this.importTextShown=!0,await this.updateComplete,this.renderRoot.querySelector("dialog.import-dialog textarea.xf-typed")?.focus()}setImportEntity(t,i){let a=new Map(this.importMap);i.entityId===""?a.delete(t):a.set(t,na(this.hass.states,i.entityId)),this.importMap=a,this.scheduleImportHistory()}importPreview(){let t=this.importParse;if(!t?.ok)return;let i=this.importPreviewCache;if(i&&i.parse===t&&i.map===this.importMap&&i.families===this.importFamilies)return i;let a=Mo(this.importConfig()??t.config,this.importMap),r;try{r=[...Vi(a).entities.values()]}catch{r=[]}return this.importPreviewCache={parse:t,map:this.importMap,families:this.importFamilies,config:a,entities:r},this.importPreviewCache}setImportText(t){this.importText=t;let i=hv(t);if(i!==void 0){this.importParse=void 0,this.importMap=new Map,this.importFamilies=void 0,this.importName="",ih(i).then(o=>{this.importText===t&&(o===void 0?this.importParse={ok:!1,error:rh}:this.setImportText(o))});return}let a=this.importParse?.ok?JSON.stringify(this.importParse.config):void 0,r=t.trim()===""?void 0:nh(t,this.maxSchemaVersion);if(this.importParse=r,this.scheduleImportHistory(),!r?.ok){this.importMap=new Map,this.importFamilies=void 0,this.importName="";return}JSON.stringify(r.config)!==a&&(this.importMap=new Map,this.importFamilies=void 0,this.importName=sv(r.config.name,this.takenNames()))}async readImportFile(t){let i=t.target,a=i.files?.[0];a&&(await this.readImportBlob(a),i.value="")}async readImportBlob(t){try{this.setImportText(await t.text())}catch(i){this.importParse={ok:!1,error:`That file could not be read: ${Ye(i)}`}}}async openPendingLink(){let t=this.pendingLink;if(t===void 0)return;if(this.pendingLink=void 0,!this.hass.user?.is_admin){this.linkNote="This link holds a shared complication. Only a Home Assistant administrator can import it.";return}let i=await ih(t);if(i===void 0){this.linkNote=rh;return}if(!this.ownerId){this.linkNote="This link holds a shared complication, but no watch has connected to this Home Assistant yet.";return}if(this.freeSlot()<0){this.linkNote="This link holds a shared complication, but this watch has no free slot. Delete a complication, then open the link again.";return}this.linkNote=void 0,this.openImportDialog(),this.setImportText(i)}async doImport(){let t=this.importConfig();if(!t)return;let i=Mo(t,this.importMap);i.id=se(),i.name=this.importName.trim(),i.slotIndex=this.freeSlot(),i.dataSources=[],i.schemaVersion=hn(i),this.startNew(i)&&(this.draft?.markDirty(),this.closeImportDialog(),await this.save())}openImportDialog(){!this.hass.user?.is_admin||this.freeSlot()<0||(this.importOpen=!0,this.resetImportState(),this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("dialog.import-dialog");t&&(t.open||t.showModal(),t.querySelector("button.xf-paste")?.focus())}))}resetImportState(){this.importText="",this.importParse=void 0,this.importName="",this.importMap=new Map,this.importFamilies=void 0,this.importTextShown=!1,this.importFocus=void 0,this.importHistory=new Map,this.importHistoryAsked=void 0,this.importPreviewCache=void 0,this.importDrop=!1,this.importDragDepth=0,this.importHistoryTimer&&window.clearTimeout(this.importHistoryTimer),this.importHistoryTimer=void 0,this.importHistoryRun+=1}startImportOver(){this.resetImportState(),this.updateComplete.then(()=>{this.renderRoot.querySelector("dialog.import-dialog button.xf-paste")?.focus()})}closeImportDialog(){let t=this.renderRoot.querySelector("dialog.import-dialog");t?.open?t.close():this.importClosed()}importClosed(){this.importOpen=!1,this.importHistoryTimer&&window.clearTimeout(this.importHistoryTimer),this.importHistoryTimer=void 0,this.importHistoryRun+=1}renderHistoryDialog(){let t=this.historyEntries,i=this.historyPick,a=this.historyDoc,r=a?this.configLayouts(a,this.historyEntities(a)):{},o=a?this.dialogFamily(a):void 0,s=this.draft?.dirty===!0,l=this.draft?.config.name.trim()||"Untitled";return h`<dialog class="history-dialog xf" @close=${()=>this.historyClosed()}>
      ${this.dialogHead(`History of \u201C${l}\u201D`,this.draft?.baseRevision===null||this.draft?.baseRevision===void 0?"":`Revision ${this.draft.baseRevision} is open`,()=>this.closeHistoryDialog())}
      <div class="xfer-body">
        ${this.historyNote===void 0?m:h`<div class="hint err" role="alert">${this.historyNote}</div>`}
        ${t.length===0?h`<div class="xf-lead">${H("info")}<span>No earlier saves yet. Every save from now on leaves the revision it replaced here.</span></div>`:h`
            <div class="xf-hero">
              ${a?this.dialogPreview(r,o,[],i===void 0?"":`Revision ${i}`,""):h`<div class="xf-prev-wrap"><div class="xf-prev"></div>
                    <div class="xf-prev-cap"><span>${this.historyBusy?"Loading":"Pick a revision"}</span></div></div>`}
              <div class="xf-stack">
                <span class="xf-label">Earlier saves<span class="r">${t.length}</span></span>
                <div class="xf-sub">Restoring writes the old design back as a new revision. Nothing is thrown away, so you can come straight back here and undo it.</div>
              </div>
            </div>
            <div class="xf-rows hs-rows">
              ${t.map(c=>this.renderHistoryRow(c))}
            </div>`}
      </div>
      <div class="xfer-foot">
        ${this.historyConfirm?h`<span class="xf-sub">Your unsaved changes to this complication go.</span>
            <span class="spacer"></span>
            <button class="small" @click=${()=>{this.historyConfirm=!1}}>Cancel</button>
            <button class="primary" @click=${()=>{this.restoreHistory()}}>Discard and restore</button>`:h`<span class="spacer"></span>
            <button class="small" @click=${()=>this.closeHistoryDialog()}>Close</button>
            <button class="primary" ?disabled=${i===void 0||this.historyBusy||!this.canEdit}
              title=${i===void 0?"Pick a revision first":`Put revision ${i} back as a new revision`}
              @click=${()=>{s?this.historyConfirm=!0:this.restoreHistory()}}>Restore</button>`}
      </div>
    </dialog>`}renderHistoryRow(t){let i=this.historyPick===t.revision,a=t.families.filter(o=>o!=="inline").length,r=[`${t.layers} ${t.layers===1?"layer":"layers"}`,a>0?`${a} ${a===1?"shape":"shapes"}`:"",fA(t.updatedBy)].filter(o=>o!=="");return h`<button class="xf-row hs-row ${i?"on":""}" aria-pressed=${i?"true":"false"}
      @click=${()=>{this.pickHistory(t.revision)}}>
      <span class="hs-rev">${t.revision}</span>
      <span class="xf-main">
        <span class="xf-name">${t.name||"Untitled"}</span>
        <span class="xf-sub">${hA(t.savedAt)} · ${r.join(" \xB7 ")}</span>
      </span>
    </button>`}historyEntities(t){try{return[...Vi(t).entities.values()]}catch{return[]}}async openHistoryDialog(){let t=this.selectedId;if(!(!this.ownerId||!t||this.draft?.baseRevision===null)){this.historyOpen=!0,this.historyEntries=[],this.historyPick=void 0,this.historyDoc=void 0,this.historyNote=void 0,this.historyConfirm=!1,this.historyBusy=!0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.history-dialog");i&&!i.open&&i.showModal()});try{let i=await Km(this.hass,this.ownerId,t);if(!this.historyOpen||this.selectedId!==t)return;this.historyEntries=i.entries,this.historyBusy=!1;let a=i.entries[0];a!==void 0&&await this.pickHistory(a.revision)}catch(i){this.historyBusy=!1,this.historyNote=Ye(i)}}}async pickHistory(t){let i=this.selectedId;if(!this.ownerId||!i)return;this.historyPick=t,this.historyDoc=void 0,this.historyNote=void 0,this.historyBusy=!0;let a=++this.historyRun;try{let r=await Wm(this.hass,this.ownerId,i,t);if(a!==this.historyRun||!this.historyOpen)return;this.historyDoc=Ni(r.entry.document)}catch(r){if(a!==this.historyRun)return;this.historyNote=Ye(r)}finally{a===this.historyRun&&(this.historyBusy=!1)}}async restoreHistory(){let t=this.selectedId,i=this.historyPick;if(!(!this.ownerId||!t||i===void 0||!this.canEdit)){this.historyConfirm=!1,this.historyBusy=!0,this.historyNote=void 0;try{let a=await jm(this.hass,this.ownerId,t,i,this.draft?.baseRevision??null);if(!a.ok||!a.record){if(a.error==="conflict"){this.conflict={current:a.current??null,message:a.message??"Someone else saved this complication first."},this.closeHistoryDialog();return}this.historyNote=a.message??a.error??"Restore failed";return}this.closeHistoryDialog(),this.conflict=void 0,this.remoteRevision=void 0,this.openRecord(a.record),this.beginSendWait(),await this.loadRecords()}catch(a){this.historyNote=Ye(a)}finally{this.historyBusy=!1}}}closeHistoryDialog(){let t=this.renderRoot.querySelector("dialog.history-dialog");t?.open?t.close():this.historyClosed()}historyClosed(){this.historyOpen=!1,this.historyConfirm=!1,this.historyBusy=!1,this.historyRun+=1}partNames(t){let i=(this.parts??[]).filter(a=>a.id!==t);return new Set(i.map(a=>a.name.trim().toLowerCase()))}async loadParts(){this.partsBusy=!0;try{let t=await Dm(this.hass);this.parts=t.parts,this.partsError=void 0}catch(t){this.partsError=Ye(t)}finally{this.partsBusy=!1}}partConfig(t){let i=this.partConfigCache.get(t.id);if(i&&i.text===t.text)return i.config;let a=nh(t.text,this.maxSchemaVersion),r=a.ok?a.config:void 0;return this.partConfigCache.set(t.id,{text:t.text,config:r}),r}async openSavePartDialog(){let t=this.draft?.config,i=this.selectedIds();if(!t||!this.canEdit||i.length===0||this.rowEditList())return;this.parts===void 0&&await this.loadParts();let a=ye(this.host()),r=i.map(s=>{let l=t.elements.find(c=>c.payload.id===s);return l?Te(l,a):""});this.savePartIds=i,this.savePartName=Av(r,this.partNames()),this.savePartError=void 0,this.savePartOpen=!0,await this.updateComplete;let o=this.renderRoot.querySelector("dialog.save-part-dialog");o&&!o.open&&o.showModal(),o?.querySelector("input.part-name")?.select()}closeSavePartDialog(){let t=this.renderRoot.querySelector("dialog.save-part-dialog");t?.open&&t.close(),this.savePartOpen=!1}async doSavePart(){let t=this.draft?.config,i=this.savePartName.trim();if(!t||this.savePartBusy||i===""||this.savePartIds.length===0)return;let a=Tv(t,this.savePartIds,i,this.canvasFamily),r=Ev(a,this.knownDomains());if(!Rv(r)){this.savePartError="These layers are too big to keep as a part. Pick fewer of them.";return}this.savePartBusy=!0,this.savePartError=void 0;try{let o=await lu(this.hass,i,r);this.parts=[o.part,...(this.parts??[]).filter(s=>s.id!==o.part.id)],this.closeSavePartDialog()}catch(o){this.savePartError=Ye(o)}finally{this.savePartBusy=!1}}renderSavePartDialog(){let t=this.draft?.config;if(!t)return m;let i=ye(this.host()),a=this.savePartIds.map(l=>t.elements.find(c=>c.payload.id===l)).filter(l=>l!==void 0),r=this.savePartName.trim(),o=r!==""&&this.partNames().has(r.toLowerCase()),s=r===""?"Give it a name first.":o?"A part already has that name.":void 0;return h`<dialog class="save-part-dialog xf" @close=${()=>{this.savePartOpen=!1}}
      @keydown=${l=>{l.key==="Enter"&&s===void 0&&(l.preventDefault(),this.doSavePart())}}>
      ${this.dialogHead("Save to parts","Kept for this home, ready to drop into any complication",()=>this.closeSavePartDialog())}
      <div class="xfer-body">
        <label class="xf-f"><span class="xf-label">Name</span>
          <input class="part-name" type="text" maxlength="60" aria-invalid=${o?"true":"false"} .value=${this.savePartName}
            @input=${l=>{this.savePartName=l.target.value}} /></label>
        ${o?h`<div class="hint err">A part already has that name.</div>`:m}
        <div class="xf-stack">
          <span class="xf-label">Layers<span class="r">${a.length}</span></span>
          <div class="xf-rows">
            ${a.map(l=>h`<div class="xf-row" style=${`--k:${ot[l.kind]}`}>
              <span class="ent-ico xf-dom">${H(l.kind)}</span>
              <div class="xf-main"><div class="xf-name">${Te(l,i)}</div>
                <div class="xf-sub">${lt[l.kind]}</div></div>
            </div>`)}
          </div>
        </div>
        <div class="xf-lead">${H("info")}<span>Your entity ids become numbered slots, the way Share does it. Adding the part back asks which of your entities each slot is.</span></div>
        ${this.savePartError?h`<div class="hint err" role="alert">${this.savePartError}</div>`:m}
      </div>
      <div class="xfer-foot">
        <span class="spacer"></span>
        <button class="small" @click=${()=>this.closeSavePartDialog()}>Cancel</button>
        <button class="primary" ?disabled=${s!==void 0||this.savePartBusy}
          title=${s??"Keep these layers"} @click=${()=>{this.doSavePart()}}>${this.savePartBusy?"Saving\u2026":"Save"}</button>
      </div>
    </dialog>`}async openPartsDialog(){if(!this.canEdit||!this.draft)return;this.partsOpen=!0,this.partPick=void 0,this.partMap=new Map,this.partRename=void 0,this.partConfirmDelete=void 0,this.partsError=void 0,await this.updateComplete;let t=this.renderRoot.querySelector("dialog.parts-dialog");t&&!t.open&&t.showModal(),await this.loadParts()}closePartsDialog(){let t=this.renderRoot.querySelector("dialog.parts-dialog");t?.open&&t.close(),this.partsOpen=!1}choosePart(t){let i=this.partConfig(t);if(!i){this.partsError="That part could not be read. It may have been made by a newer panel.";return}this.partPick={id:t.id,config:i},this.partMap=new Map,this.partsError=void 0}setPartEntity(t,i){let a=new Map(this.partMap);i.entityId===""?a.delete(t):a.set(t,na(this.hass.states,i.entityId)),this.partMap=a}doAddPart(){let t=this.partPick,i=this.draft?.config;if(!t||!i||!this.canEdit)return;let a=this.canvasFamily;if(!je(a))return;let r=Mo(t.config,this.partMap),o=[];this.mutate(s=>{o=Fv(s,r,a)}),this.closePartsDialog(),this.selectRows(o)}async renamePart(t,i){this.partRename=void 0;let a=(this.parts??[]).find(o=>o.id===t),r=i.trim();if(!(!a||r===""||r===a.name))try{let o=await lu(this.hass,r,a.text,t);this.parts=(this.parts??[]).map(s=>s.id===t?o.part:s),this.partsError=void 0}catch(o){this.partsError=Ye(o)}}async removePart(t){this.partConfirmDelete=void 0;try{await Om(this.hass,t),this.parts=(this.parts??[]).filter(i=>i.id!==t),this.partConfigCache.delete(t),this.partPick?.id===t&&(this.partPick=void 0),this.partsError=void 0}catch(i){this.partsError=Ye(i)}}partThumb(t){let i=this.partConfig(t),a=i?this.dialogFamily(i):void 0;if(!i||a===void 0||!je(a))return h`<span class="pt-thumb"></span>`;let r=this.configLayouts(i,[])[a];return h`<span class="pt-thumb ${a}">${r?ei(r,{icons:this.icons,imageSizes:this.imageSizes,slot:Tn(this.referenceCase,a)}):m}</span>`}renderPartsDialog(){return h`<dialog class="parts-dialog xf" @close=${()=>{this.partsOpen=!1}}>
      ${this.dialogHead("Parts","Layers you kept, ready to drop into this complication",()=>this.closePartsDialog())}
      ${this.partPick?this.renderPartPicked(this.partPick.config):this.renderPartsGrid()}
    </dialog>`}renderPartsGrid(){let t=this.parts??[];return h`<div class="xfer-body">
      ${this.partsError?h`<div class="hint err" role="alert">${this.partsError}</div>`:m}
      ${this.parts===void 0?h`<div class="xf-sub">Reading your parts…</div>`:t.length===0?h`<div class="xf-lead">${H("info")}<span>No parts yet. Pick a layer or a few in the Layers list, then <b>Save to parts</b>.</span></div>`:h`<div class="pt-grid">${t.map(i=>this.renderPartCard(i))}</div>`}
    </div>
    <div class="xfer-foot">
      <span class="spacer"></span>
      <button class="small" @click=${()=>this.closePartsDialog()}>Close</button>
    </div>`}renderPartCard(t){let i=this.partRename?.id===t.id,a=this.partConfirmDelete===t.id,r=this.partConfig(t),o=r?r.elements.length:0;return h`<div class="pt-card ${a?"asking":""}">
      <button class="pt-pick" title=${r?"Add this part":"This part could not be read"} ?disabled=${!r}
        @click=${()=>this.choosePart(t)}>
        ${this.partThumb(t)}
        <span class="pt-name">${t.name}</span>
        <span class="pt-sub">${r?`${o} ${o===1?"layer":"layers"}`:"Could not be read"}</span>
      </button>
      ${i?h`<input class="pt-rename" type="text" maxlength="60" .value=${this.partRename.name}
            @input=${s=>{this.partRename={id:t.id,name:s.target.value}}}
            @keydown=${s=>{s.key==="Enter"&&(s.preventDefault(),this.renamePart(t.id,this.partRename?.name??"")),s.key==="Escape"&&(s.preventDefault(),s.stopPropagation(),this.partRename=void 0)}}
            @blur=${()=>{this.renamePart(t.id,this.partRename?.name??"")}} />`:a?h`<div class="pt-acts"><span class="pt-ask">Delete it?</span>
              <button class="small danger" @click=${()=>{this.removePart(t.id)}}>Delete</button>
              <button class="small" @click=${()=>{this.partConfirmDelete=void 0}}>Keep</button></div>`:h`<div class="pt-acts">
              <button class="small" @click=${()=>{this.partRename={id:t.id,name:t.name}}}>Rename</button>
              <button class="small danger" @click=${()=>{this.partConfirmDelete=t.id}}>Delete</button></div>`}
    </div>`}renderPartPicked(t){let i=md(t,this.hass.states),a=i.filter(p=>p.required),r=a.filter(p=>this.partMap.has(p.entityId)).length,o=Mo(t,this.partMap),s=[];try{s=[...Vi(o).entities.values()]}catch{s=[]}let l=this.configLayouts(o,s),c=this.dialogFamily(o),d=this.canvasFamily,u=je(d)?void 0:"Open a shape with a canvas first. A part is layers, and there is nowhere to put them here.";return h`<div class="xfer-body">
      <div class="xf-hero">
        ${this.dialogPreview(l,c,[],c?ie(c):"","")}
        <div class="xf-stack">
          <div class="xf-sub">${mh(t)}</div>
          <div class="xf-lead">${H("info")}<span>These layers land on the <b>${ie(d)}</b> shape, the one you are editing.</span></div>
        </div>
      </div>
      ${i.length===0?h`<div class="xf-lead">${H("check")}<span>Every entity this part reads is already in your Home Assistant.</span></div>`:h`<div class="xf-stack">
          <div class="xf-label">Pick your entities${a.length>0?h`<span class="r">${r} of ${a.length}</span>`:m}</div>
          <div class="xf-rows">${i.map(p=>this.renderPartRow(p))}</div>
          ${r<a.length?h`<div class="xf-lead">${H("info")}<span>You can add it now and pick the rest in the editor.</span></div>`:m}
        </div>`}
      ${Fo(t)?h`<div class="xf-lead warn">${H("info")}<span>This part filters by areas, labels or floors from the home it was made on. Check its aggregate layers after adding it.</span></div>`:m}
      ${this.partsError?h`<div class="hint err" role="alert">${this.partsError}</div>`:m}
    </div>
    <div class="xfer-foot">
      <button class="ghost" @click=${()=>{this.partPick=void 0,this.partMap=new Map}}>Back to parts</button>
      <span class="spacer"></span>
      <button class="primary" ?disabled=${u!==void 0}
        title=${u??"Put these layers into the open complication"} @click=${()=>this.doAddPart()}>Add to this complication</button>
    </div>`}renderPartRow(t){let i=this.partMap.get(t.entityId);return h`<div class="xf-row pick">
      <span class="ent-ico xf-dom">${Wa(t.domain)}</span>
      <div class="xf-main">
        <div class="xf-name">${t.label}${i?h`<span class="xf-done" title="Picked">${H("check")}</span>`:m}</div>
        <div class="xf-sub">${t.where.join(", ")}</div>
        ${t.required?m:h`<div class="xf-sub">Not in your Home Assistant right now. Leave it empty to keep the id.</div>`}
        <div class="xf-picker">${st({hass:this.hass},t.label,i??Hv,a=>this.setPartEntity(t.entityId,a),`part-entity-${t.entityId}`,{compact:!0,domain:t.domain,needed:t.required&&i===void 0})}</div>
      </div>
    </div>`}renderBanners(){let t=[],i=this.renderOrphanBanner();if(i&&t.push(i),this.readOnlyReason?t.push(h`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`):this.draft&&!this.hass.user?.is_admin&&t.push(h`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`),this.conflict){let a=this.conflict;t.push(h`<div class="banner err"><b>Save rejected.</b> ${a.message}
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
                ${i.map(a=>h`<option value=${a.owner_watch_id} ?selected=${a.owner_watch_id===this.moveTarget}>${Wv(a)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget||this.moving} @click=${()=>{this.moveAll()}}>${this.moving?"Moving\u2026":"Move"}</button>
            </div>`:h`<div class="hint">Only a Home Assistant administrator can move them.</div>`}
      ${this.moveError?h`<div class="err">${this.moveError}</div>`:m}
    </div>`}renderAddLayer(){let t=this.draft?.config;if(!t||!this.canEdit)return m;if(!je(this.activeFamily))return m;let i=t.elements.length>=64,a=this.addOpen,r=this.addDetail==="expanded",o=Ly.filter(g=>Ey(this.activeFamily,g)),s=Ml.filter(g=>g.families===void 0||g.families.includes(this.activeFamily)),l=s.filter(g=>g.group===void 0),c=s.filter(g=>g.group==="list"),d=()=>{this.addOpen=!this.addOpen,this.saveListView()},u=g=>{let b=De(g);this.addHere(y=>{y.elements.push(b),b.kind==="timeline"&&Di(y,b.payload.id)}),this.inspect={kind:"layer",id:b.payload.id}},p=(g,b,y,v=!1)=>h`
      <button class="add" style=${`--k:${ot[g]}`} ?disabled=${i} title=${b}
        aria-haspopup=${v?"listbox":m} aria-expanded=${v?this.openMenu==="list"?"true":"false":m}
        @click=${y}
        >${r?h`<span class="well">${Zy(g)}</span>`:m}<span class="add-name">${r?H(g):h`<span class="k"></span>`}<span>${lt[g]}</span></span></button>`,f=h`<span class="add-tool" data-menu="list">
      ${p("list","Add a list: blank, or one of the ready-made ones",()=>this.toggleMenu("list"),!0)}
      ${this.openMenu==="list"?h`<div class="pop-menu" role="listbox" aria-label="Add a list">
        <button class="row" role="option" @click=${()=>{this.toggleMenu("list",!1),u("list")}}>
          Blank list<small>Start from nothing and design the row yourself.</small></button>
        ${c.length===0?m:h`<div class="sep"></div>`}
        ${c.map(g=>h`<button class="row" role="option" ?disabled=${t.elements.length+g.layerCount>64}
          @click=${()=>{this.toggleMenu("list",!1),this.openPreset(g.kind)}}>${g.title}<small>${g.blurb}</small></button>`)}
      </div>`:m}
    </span>`;return h`<div class="card fold" data-open=${a?"true":"false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${a?"true":"false"}
        title=${a?"Hide the add buttons":"Show the add buttons"}
        @click=${d}
        @keydown=${g=>{(g.key==="Enter"||g.key===" ")&&(g.preventDefault(),d())}}>
        <span class="swatch">${H("plus")}</span>Add a layer<span class="spacer"></span>
        ${a?m:h`<span class="mini">${o.length} kinds · ${s.length} presets</span>`}
        ${a?h`<span class="tool-set" @click=${g=>g.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${[["compact","Names"],["expanded","Samples"]].map(([g,b])=>h`
                  <button class=${this.addDetail===g?"on":""} title=${b} aria-label=${b} aria-pressed=${this.addDetail===g?"true":"false"}
                    @click=${()=>{this.addDetail=g,this.saveListView()}}>${H(g)}</button>`)}
              </span>
            </span>`:m}
        <span class="chev">${H("chevron")}</span>
      </h2>
      ${a?h`
          <div class="add-grid ${r?"":"lean"}">
            ${o.map(g=>g==="list"?f:p(g,`Add a blank ${lt[g].toLowerCase()} layer`,()=>u(g)))}
          </div>
          <div class="presets">
            <span class="presets-l">Presets</span>
            ${l.map(g=>h`<button class="preset" title=${g.blurb}
              ?disabled=${t.elements.length+g.layerCount>64}
              @click=${()=>this.openPreset(g.kind)}>${g.title}</button>`)}
          </div>
          <div class="presets">
            <span class="presets-l">Saved</span>
            <button class="preset" ?disabled=${i}
              title="Layers you kept earlier, ready to drop onto this shape"
              @click=${()=>{this.openPartsDialog()}}>Add from parts</button>
          </div>`:m}
      ${this.renderPresetDialog()}
    </div>`}isGroupId(t){return this.draft?.config.groups?.some(i=>i.id===t)===!0}reorderLayer(t,i,a,r=!1){t!==i&&this.mutate(o=>{let s=o.elements.filter(g=>!Re(o,g)),l=o.elements.filter(g=>Re(o,g)),c=[...s].reverse(),d=c.find(g=>g.payload.id===i);if(!d)return;let u=o.groups?.find(g=>g.id===t),p=u?c.filter(g=>g.payload.groupId===u.id):c.filter(g=>g.payload.id===t);if(p.length===0||p.includes(d))return;c=c.filter(g=>!p.includes(g));let f;if((u||r)&&d.payload.groupId!==void 0){let g=c.filter(b=>b.payload.groupId===d.payload.groupId);f=a?c.indexOf(g[0]):c.indexOf(g[g.length-1])+1}else f=c.indexOf(d)+(a?0:1);if(c.splice(f,0,...p),!u){let g=p[0],b=r?void 0:d.payload.groupId;b===void 0?delete g.payload.groupId:g.payload.groupId=b}o.elements=[...c.reverse(),...l],Dt(o),Ta(o)})}markDrop(t,i){return t.classList.contains(i)?!1:(this.clearDropMarks(),t.classList.add(i),!0)}clearDropMarks(){for(let t of this.renderRoot.querySelectorAll(".layer"))t.classList.remove("drop-before","drop-after","drop-into")}clearDragMarks(){this.clearDropMarks();for(let t of this.renderRoot.querySelectorAll(".layer, .group-kids"))t.classList.remove("dragging")}rowDrag(t,i){return{draggable:i?"true":"false",onStart:a=>{this.dragId=t,a.dataTransfer?.setData("text/plain",t),a.dataTransfer&&(a.dataTransfer.effectAllowed="move");let r=a.currentTarget,o=r.nextElementSibling;window.setTimeout(()=>{this.dragId===t&&(r.classList.add("dragging"),o?.classList.contains("group-kids")&&o.classList.add("dragging"))},0)},onEnd:()=>{this.dragId=void 0,this.clearDragMarks()},onOver:a=>{if(!this.dragId||this.dragId===t)return;a.preventDefault();let r=a.currentTarget,o=r.getBoundingClientRect(),s=o.top+(r.classList.contains("drop-before")?In:0),l=o.bottom-(r.classList.contains("drop-after")?In:0);this.markDrop(r,a.clientY<(s+l)/2?"drop-before":"drop-after")},onDrop:a=>{a.preventDefault();let o=a.currentTarget.classList.contains("drop-before");this.clearDragMarks(),this.dragId&&this.reorderLayer(this.dragId,t,o),this.dragId=void 0}}}clickRow(t,i){if(i.shiftKey&&!i.metaKey&&!i.ctrlKey){this.pickRange(t);return}if(Vv(i)){this.togglePick(t),this.pickAnchor=t;return}this.multi=new Set,this.inspect={kind:"layer",id:t},this.pickAnchor=t}pickRange(t){let i=this.draft?.config,a=this.pickAnchor??(this.inspect.kind==="layer"?this.inspect.id:void 0);if(!i||a===void 0||a===t){this.togglePick(t);return}let r=[...i.elements].filter(l=>!Re(i,l)).reverse().map(l=>l.payload.id),o=r.indexOf(a),s=r.indexOf(t);if(o<0||s<0){this.togglePick(t);return}this.multi=new Set(r.slice(Math.min(o,s),Math.max(o,s)+1))}togglePick(t){let i=new Set(this.multi);i.size===0&&this.inspect.kind==="layer"&&this.inspect.id!==t&&i.add(this.inspect.id),i.has(t)?i.delete(t):i.add(t),this.multi=i}groupPicked(){let t=[...this.multi];if(!this.canEdit||t.length<2)return;let i;this.mutate(a=>{i=Vc(a,t)}),this.multi=new Set,i&&(this.inspect={kind:"group",id:i})}renderLayers(){let t=this.draft?.config;if(!t)return m;if(!je(this.activeFamily))return this.renderInlineHasNoLayers();let i=this.canEdit,a=this.canvasFamily,r=(L,X)=>this.moveLayer(L,X),o=L=>{let X;this.mutate(ne=>{X=vm(ne,L)}),X&&(this.inspect={kind:"layer",id:X})},s=L=>{this.mutate(X=>Me(X,L)),this.inspect.kind==="layer"&&this.inspect.id===L&&(this.inspect={kind:"general"})},l=Ft(t,a).filter(L=>!Re(t,L)).reverse(),c=ye(this.host()),d=new Ot(this.buildContext(),this.draft?.config),u=t.perFamily[this.activeFamily],p=this.inspect.kind==="family",f=`${u?.backgroundColorHex?qe(u.backgroundColorHex):"transparent"} \xB7 ${u?.borderColorHex?`${u.borderWidth} pt border`:"no border"}`,g=[...this.multi].filter(L=>t.elements.some(X=>X.payload.id===L)).length,b=this.rowEditList()?0:this.selectedIds().length,y=en(t,this.buildContext(),this.forced)[a],v=jv[this.thumbStep],k=Math.round(_o*v),S=Math.round(Po*v),I=L=>y?h`<span class="thumb">${yl(y,L,{icons:this.icons,imageSizes:this.imageSizes,width:k,height:S})}</span>`:h`<span class="thumb"></span>`,_=this.layerDetail==="expanded",E=(L,X,ne=!1,D=m)=>{let W=L.payload.id,w=this.inspect.kind==="layer"&&this.inspect.id===W,$=Ge(t,a,L),P=$.isHidden,N=ft(t,W)[0],O=io(L.payload.rules),q=this.picking&&this.pickHoverId===W,j=this.rowDrag(W,i);return h`<div class="layer ${w?"hl":""} ${ne?"held":""} ${q?"pick":""} ${this.dialogLitIds.includes(W)?"lit":""} ${P?"dim":""} ${this.multi.has(W)?"multi":""} ${X?"kid":""} ${_?"rich":""}"
        style=${`--k:${ot[L.kind]}`} tabindex="0" draggable=${j.draggable}
        @pointerenter=${()=>{this.listHoverIds=[W]}}
        @pointerleave=${()=>this.leaveRow([W])}
        @click=${ee=>this.clickRow(W,ee)}
        @keydown=${ee=>{ee.key==="Enter"&&(this.inspect={kind:"layer",id:W})}}
        @dragstart=${j.onStart} @dragend=${j.onEnd} @dragover=${j.onOver} @drop=${j.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a group to put it inside.">${H("grip")}</span>
        <span class="bar"></span>
        ${I([W])}
        <span class="name">
          <b>${Te(L,c)}</b>
          <small><span class="kind">${lt[L.kind]}</span> · ${xA(L,d,this.historySeries,$.size)}</small>
          ${_?h`<span class="facts">${yA(this.host(),a,L,$).map(ee=>h`<span class="fact"><b>${ee.label}</b> ${ee.value}</span>`)}</span>`:m}
        </span>
        <span class="right">
          <span class="badges">
            ${N?h`<span class="badge tap" title=${`Tappable \xB7 ${Te(N,c)}`}>tap</span>`:m}
            ${L.payload.rules.length===0?m:h`<span class="badge states" title=${O}>${O.replace(/\.$/,"").toLowerCase()}</span>`}
            ${P?h`<span class="badge">hidden</span>`:m}
          </span>
          ${i?h`<span class="acts">
            <button class="icon" title=${`Bring forward (${ci}])`} aria-label="Bring forward" @click=${ee=>{ee.stopPropagation(),r(W,1)}}>${H("up")}</button>
            <button class="icon" title=${`Send back (${ci}[)`} aria-label="Send back" @click=${ee=>{ee.stopPropagation(),r(W,-1)}}>${H("down")}</button>
            <button class="icon" title=${`${$.isHidden?"Show":"Hide"} (${xh}${ci}H)`} aria-label=${$.isHidden?"Show this layer":"Hide this layer"} @click=${ee=>{ee.stopPropagation(),this.mutate(B=>Pe(B,a,W,{isHidden:!$.isHidden}))}}>${H($.isHidden?"hide":"show")}</button>
            <button class="icon" title=${`Duplicate (${ci}D)`} aria-label="Duplicate" @click=${ee=>{ee.stopPropagation(),o(W)}}>${H("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${ee=>{ee.stopPropagation(),s(W)}}>${H("delete")}</button>
          </span>`:m}
          ${D}
        </span>
      </div>`},z=(L,X)=>{let ne=this.inspect.kind==="group"&&this.inspect.id===L.id,D=!this.collapsed.has(L.id),W=this.rowDrag(L.id,i),w=X[0],$=X[X.length-1],P=O=>{let q=O.currentTarget,j=q.getBoundingClientRect(),ee=j.top+(q.classList.contains("drop-before")?In:0),B=j.bottom-(q.classList.contains("drop-after")?In:0),ce=(O.clientY-ee)/Math.max(1,B-ee);return ce<.25?"drop-before":!D&&ce>.75?"drop-after":"drop-into"},N=X.map(O=>O.payload.id);return h`<div class="layer group ${ne?"hl":""} ${this.dialogLitIds.includes(L.id)?"lit":""} ${_?"rich":""}" style=${`--k:${le.group}`} tabindex="0" draggable=${W.draggable}
        @pointerenter=${()=>{this.listHoverIds=N}}
        @pointerleave=${()=>this.leaveRow(N)}
        @click=${()=>{this.multi=new Set,this.inspect={kind:"group",id:L.id}}}
        @keydown=${O=>{O.key==="Enter"&&(this.inspect={kind:"group",id:L.id})}}
        @dragstart=${W.onStart} @dragend=${W.onEnd}
        @dragover=${O=>{!this.dragId||this.dragId===L.id||(O.preventDefault(),this.markDrop(O.currentTarget,P(O)))}}
        @drop=${O=>{O.preventDefault();let q=P(O);this.clearDragMarks();let j=this.dragId;if(this.dragId=void 0,!(!j||!w||!$)){if(q==="drop-before"){this.reorderLayer(j,w.payload.id,!0,!0);return}if(q==="drop-after"){this.reorderLayer(j,$.payload.id,!1,!0);return}this.isGroupId(j)||(this.reorderLayer(j,w.payload.id,!0),this.mutate(ee=>Br(ee,j,L.id)))}}}>
        <span class="grip" title="Drag to reorder the whole group.">${H("grip")}</span>
        <span class="bar"></span>
        <span class="folder">${H("folder")}</span>
        <span class="name">
          <b>${L.name}</b>
          <small><span class="kind">Group</span> · ${X.length} layer${X.length===1?"":"s"} · ${L.locked?"locked":"unlocked"}</small>
          ${_?h`<span class="facts"><span class="fact"><b>Holds</b> ${X.map(O=>Te(O,c)).join(", ")}</span></span>`:m}
        </span>
        <span class="right">
          ${i?h`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${xh}${ci}G)`} aria-label="Ungroup" @click=${O=>{O.stopPropagation(),this.mutate(q=>Ea(q,L.id)),ne&&(this.inspect={kind:"general"})}}>${H("ungroup")}</button>
          </span>`:m}
          <button class="icon lockbtn ${L.locked?"on":""}" ?disabled=${!i}
            title=${L.locked?"Locked: drags on the watch move the whole group. Click to unlock.":"Unlocked: each layer moves alone, unless the group row is selected. Click to lock."}
            aria-label=${L.locked?"Unlock the group":"Lock the group"}
            @click=${O=>{O.stopPropagation(),this.mutate(q=>{let j=q.groups?.find(ee=>ee.id===L.id);j&&(j.locked=!j.locked)})}}>${H(L.locked?"lock":"unlock")}</button>
          <button class="chev" aria-expanded=${D?"true":"false"} title=${D?"Fold the group":"Unfold the group"}
            @click=${O=>{O.stopPropagation();let q=new Set(this.collapsed);D?q.add(L.id):q.delete(L.id),this.collapsed=q}}>${H("chevron")}</button>
        </span>
      </div>`},C=(L,X,ne)=>{let D=L.payload.id,W=X.payload.id,w=this.inspect.kind==="layer"&&this.inspect.id===W,$=X.payload.isHidden,P=L.payload.template.length,N=()=>{this.setRowEdit(D),this.inspect={kind:"layer",id:W}},O=j=>this.mutate(ee=>{let B=ia(ee,D);B?.kind==="list"&&j(B.payload)}),q=j=>O(ee=>{let B=ee.template[ne],ce=ee.template[ne+j];!B||!ce||(ee.template[ne]=ce,ee.template[ne+j]=B)});return h`<div class="layer kid rowkid ${w?"hl":""} ${$?"dim":""}"
        style=${`--k:${ot[X.kind]}`} tabindex="0"
        @pointerenter=${()=>{this.listHoverIds=[W]}}
        @pointerleave=${()=>this.leaveRow([W])}
        @click=${()=>N()}
        @keydown=${j=>{j.key==="Enter"&&N()}}>
        <span class="grip" aria-hidden="true"></span>
        <span class="bar"></span>
        <span class="rowglyph">${H(Kp(X.kind))}</span>
        <span class="name">
          <b>${Te(X,c)}</b>
          <small><span class="kind">${lt[X.kind]}</span> · drawn in every row</small>
        </span>
        <span class="right">
          <span class="badges">${$?h`<span class="badge">hidden</span>`:m}</span>
          ${i?h`<span class="acts">
            <button class="icon" title="Bring forward in the row" aria-label="Bring forward in the row" ?disabled=${ne===P-1}
              @click=${j=>{j.stopPropagation(),q(1)}}>${H("up")}</button>
            <button class="icon" title="Send back in the row" aria-label="Send back in the row" ?disabled=${ne===0}
              @click=${j=>{j.stopPropagation(),q(-1)}}>${H("down")}</button>
            <button class="icon" title=${$?"Show this layer":"Hide this layer"} aria-label=${$?"Show this layer":"Hide this layer"}
              @click=${j=>{j.stopPropagation(),O(ee=>{let B=ee.template[ne];B&&(B.payload.isHidden=!B.payload.isHidden)})}}>${H($?"hide":"show")}</button>
            <button class="icon danger" title="Remove this layer from the row" aria-label="Remove this layer from the row"
              @click=${j=>{j.stopPropagation(),O(ee=>{ee.template.splice(ne,1),ra(ee)}),this.inspect.kind==="layer"&&this.inspect.id===W&&(this.inspect={kind:"layer",id:D})}}>${H("delete")}</button>
          </span>`:m}
        </span>
      </div>`},M=L=>{if(L.kind!=="list"||L.payload.template.length===0)return m;let X=L.payload.id,ne=!this.collapsed.has(X);return h`<button class="chev" aria-expanded=${ne?"true":"false"}
        title=${ne?"Fold the row's layers":"Unfold the row's layers"}
        @click=${D=>{D.stopPropagation();let W=new Set(this.collapsed);ne?W.add(X):W.delete(X),this.collapsed=W}}>${H("chevron")}</button>`},K=L=>{if(L.kind!=="list"||L.payload.template.length===0)return m;if(this.collapsed.has(L.payload.id))return m;let X=L.payload.template.map((ne,D)=>[ne,D]).reverse();return h`<div class="group-kids rowkids">${X.map(([ne,D])=>C(L,ne,D))}</div>`},Y=[],J=new Set;for(let L=0;L<l.length;L++){let X=l[L],ne=X.payload.groupId,D=ne===void 0?void 0:t.groups?.find($=>$.id===ne);if(!D){Y.push(h`${E(X,!1,!1,M(X))}${K(X)}`);continue}if(J.has(D.id))continue;J.add(D.id);let W=l.filter($=>$.payload.groupId===D.id);Y.push(z(D,W));let w=this.inspect.kind==="group"&&this.inspect.id===D.id;this.collapsed.has(D.id)||Y.push(h`<div class="group-kids">${W.map($=>h`${E($,!0,w,M($))}${K($)}`)}</div>`)}return h`<div class="card layers-card s${this.thumbStep}" style=${`--thumb-w:${k}px;--thumb-h:${S}px`}>
      <h2 class="panel-title tools" style=${`--c:${le.place}`}><span class="swatch">${H("layers")}</span>Layers
        <span class="mini">top draws last</span><span class="spacer"></span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${[["compact","Compact rows: the name and one line about the layer"],["expanded","Expanded rows: what the layer is made of and where it sits"]].map(([L,X])=>h`
              <button class=${this.layerDetail===L?"on":""} title=${X} aria-label=${X} aria-pressed=${this.layerDetail===L?"true":"false"}
                @click=${()=>{this.layerDetail=L,this.saveListView()}}>${H(L)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${oA.map((L,X)=>h`
              <button class=${this.thumbStep===X?"on":""} title=${`${Ov[X]} row pictures`}
                aria-label=${`${Ov[X]} row pictures`} aria-pressed=${this.thumbStep===X?"true":"false"}
                @click=${()=>{this.thumbStep=X,this.saveListView()}}>${L}</button>`)}
          </span>
        </span>
      </h2>
      ${g>=2&&i?h`<div class="group-cta"><span>${g} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${ci}G)`} @click=${()=>this.groupPicked()}>Group them</button>
            <button class="small" title="Keep these layers under a name, to use in another complication"
              @click=${()=>{this.openSavePartDialog()}}>Save to parts</button>
            <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button></div>`:b>=1&&i?h`<div class="part-cta"><span class="spacer"></span>
              <button class="ghost" title=${b===1?"Keep this layer under a name, to use in another complication":"Keep these layers under a name, to use in another complication"}
                @click=${()=>{this.openSavePartDialog()}}>Save to parts</button></div>`:t.elements.length>=2&&i&&!t.groups?.length?h`<div class="hint">${Za}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`:m}
      ${t.elements.length===0?h`<div class="empty">No layers yet. Add one above.</div>`:m}
      ${this.renderShapeIsBlank(t,a,i)}
      <div class="layers">
      ${Y}
      </div>
      <div class="layer pinned ${p?"hl":""}" style=${`--k:${le.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${()=>{this.inspect={kind:"family"}}}
        @keydown=${L=>{L.key==="Enter"&&(this.inspect={kind:"family"})}}
        @dragover=${L=>{this.dragId&&(L.preventDefault(),this.markDrop(L.currentTarget,"drop-before"))}}
        @drop=${L=>{L.preventDefault(),this.clearDragMarks();let X=this.dragId,ne=[...l].reverse().find(D=>D.payload.id!==X&&D.payload.groupId!==X);X&&ne&&this.reorderLayer(X,ne.payload.id,!1,!0),this.dragId=void 0}}>
        <span class="grip">${H("shape")}</span>
        <span class="bar"></span>
        ${I([])}
        <span class="name">
          <b>${ie(this.activeFamily)} shape</b>
          <small><span class="kind">Background</span> · ${f}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
    </div>`}renderInlineHasNoLayers(){return h`<div class="card">
      <h2 class="panel-title"><span class="swatch">${H("layers")}</span>Layers</h2>
      <div class="empty">Inline is one line of text and draws no layers.
        Its text is on the right. Pick a canvas shape above to work on layers.</div>
    </div>`}renderControlHasNoLayers(){let t=this.draft?.config,i=t&&gt(t).length===0?void 0:ie(this.activeFamily),[a,r]=My(i,Ae(this.selectedOwner)==="iphone");return h`<div class="card">
      <h2 class="panel-title"><span class="swatch">${H("layers")}</span>Layers</h2>
      <div class="empty">${a}</div>
      <div class="hint">${r}</div>
    </div>`}renderPresetDialog(){let t=this.presetKind?sp(this.presetKind):void 0,i=this.presetEntity;return h`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${()=>{this.presetKind=void 0,this.presetEntity=void 0}}>
      ${t===void 0?m:h`
        <h2>${t.title}</h2>
        <div class="hint">${t.blurb}</div>
        ${st(this.host(),"Entity",i??{entityId:"",displayName:"",domain:""},a=>{this.presetEntity=a.entityId===""?void 0:a},Lv,{compact:!0,...t.domains?{domain:t.domains}:{},...t.preferNumeric?{preferNumeric:!0}:{}})}
        <div class="adders">
          <button class="primary" ?disabled=${i===void 0} @click=${()=>this.createFromPreset()}>Create</button>
          <button class="small" @click=${()=>this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`}openPreset(t){if(this.canEdit){if(sp(t).needsEntity===!1){let i={family:this.canvasFamily},a;this.addHere(r=>{a=pp(r,t,{entityId:"",displayName:"",domain:""},i)}),a&&(this.inspect={kind:"layer",id:a});return}this.presetKind=t,this.presetEntity=void 0,this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("dialog.preset-dialog");i&&(i.open||i.showModal(),i.querySelector(".entity-field input")?.focus())})}}closePresetDialog(){let t=this.renderRoot.querySelector("dialog.preset-dialog");t?.open?t.close():(this.presetKind=void 0,this.presetEntity=void 0)}createFromPreset(){let t=this.presetKind,i=this.presetEntity;if(!t||!i)return;let a={family:this.canvasFamily},r=this.hass.states[i.entityId];r&&(a.state=r);let o;this.addHere(s=>{o=pp(s,t,i,a)}),this.closePresetDialog(),o&&(this.inspect={kind:"layer",id:o})}renderCanvas(){if(this.parseError)return h`<div class="card error">This document cannot be read: ${this.parseError}</div>`;let t=this.canvasConfig();if(!t)return h`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;let i=en(t,this.buildContext(),this.forced);this.syncCountdownTicker(i);let a=this.currentCase(),r=this.activeFamily;return this.inControlView?h`
        <div class="card canvas-card">
          <div class="canvas-bar">
            <div class="bar-row shapes">${this.renderShapeTabs(t,i)}</div>
          </div>
          <div class="stage">${this.renderControlStage(t)}</div>
        </div>
        <div class="under-grid">
          ${this.renderValuesRow()}
        </div>`:h`
      <div class="card canvas-card">
        <div class="canvas-bar">
          <div class="bar-row shapes">${this.renderShapeTabs(t,i)}</div>
          <div class="bar-row tools">
          <span class="inbox" title=${`Layouts are made in the ${this.referenceCase.label} box. Every other size draws a scaled copy of it.`}>
            <span class="pre">Preview as</span>
            <span class="case-tool" data-menu="case">
              <button class="case-pick" aria-haspopup="listbox" aria-expanded=${this.openMenu==="case"?"true":"false"}
                aria-label=${`Preview as ${a.label}`} @click=${()=>this.toggleMenu("case")}>
                ${a.label}${a.measured?"":" (estimated)"}${H("chevron")}
              </button>
              ${this.openMenu==="case"?h`<div class="pop-menu" role="listbox" aria-label="Preview as">
                ${this.previewCases.map(o=>h`<button class="row" role="option" aria-selected=${o.label===a.label?"true":"false"}
                  @click=${()=>{this.toggleMenu("case",!1),this.previewCase=o.label}}>${o.label}${o.measured?"":" (estimated)"}</button>`)}
              </div>`:m}
            </span>
          </span>
          ${je(r)?this.renderTintTool():m}
          </div>
        </div>
        <div class="stage">
          ${this.renderRowStrip()}
          ${je(r)?this.renderOver():m}
          ${je(r)?this.renderBigPreview(r,i,a):this.renderInlinePreview(i.inline,!1)}
          ${this.renderUnder(t,r)}
        </div>
        ${this.zoomed&&je(r)?this.renderZoomDialog(r,i,a):m}
      </div>
      <div class="under-grid">
        ${this.renderValuesRow()}
      </div>`}renderBigPreview(t,i,a){let r=i[t];if(!r)return m;let o=this.inspect.kind==="layer"?this.inspect.id:void 0,s=this.canvasConfig(),l=this.inspect.kind==="group"?this.inspect.id:o!==void 0&&s?Et(s,o)?.id:void 0,c=s&&l!==void 0&&(this.inspect.kind==="group"||Et(s,o)?.locked)?Rt(s,l).map(y=>y.payload.id):[],d=[...new Set([...c,...this.multi])],u=Tn(a,t),p=this.focusTapId(),f=!this.picking&&!this.showTaps&&this.rowHoverId!==void 0&&s?.elements.some(y=>y.payload.id===this.rowHoverId)?this.rowHoverId:void 0,g=f!==void 0?[]:this.listHoverIds,b={icons:this.icons,imageSizes:this.imageSizes,tapAreas:!0,slot:u,highlightId:p??f??o,...d.length>0&&!this.showTaps&&f===void 0?{highlightIds:d}:{},...this.showGridLines||!this.snapGrid&&this.altHeld&&this.canEdit?{grid:this.gridStep}:{},...this.guides.length>0&&t===this.activeFamily?{guides:this.guides}:{},tapReview:this.showTaps,...this.previewTint!==void 0?{tint:this.previewTint,...Rn(t)?{tintSurface:"phone"}:{}}:{},...p!==void 0?{tapFocusId:p}:{},handles:this.canEdit&&!this.picking&&(!this.showTaps||p!==void 0),...this.picking?this.pickHoverId!==void 0?{hoverId:this.pickHoverId}:{}:g.length>0?{hoverIds:g}:{}};return h`<div class="preview ${t} active ${this.picking?"picking":""}"
      @pointerdown=${y=>this.onPreviewPointerDown(t,y)}
      @dblclick=${y=>this.onPreviewDoubleClick(y)}
      @pointermove=${y=>this.onPickMove(y)}
      @pointerleave=${()=>{this.picking&&(this.pickHoverId=void 0)}}>
      ${ei(r,b)}
    </div>`}renderControlStage(t){let i=t.control;if(i===void 0)return m;let a=this.host(),r=a.resolveContext?.(),o=r===void 0?void 0:Yr(i,r,t),s=o?.status,l=Xa(a)==="iphone",c=Qt(i)==="toggle"?"Toggle":"Button";return h`
      <div class=${`control-big ${l?"phone":"watch"}`}>
        ${l||o===void 0?m:h`<div class="cc-head">${Wp(o)}</div>`}
        ${od(Xa(a)).map(d=>dd(a,i,d,rd*2))}
      </div>
      <div class="under">
        <b>Control Center</b>
        <span class="dot">·</span>
        <span class="tail">${o===void 0||ld(o)===void 0?`${c}.`:h`${c}, reads <b>${ld(o)}</b>.`} ${l?"A circle in the grid, or the wide tile when it is given two columns.":"The watch prints the title and value line above the grid, not on the tile."}</span>
      </div>
      ${s===void 0||!sd(a,i)?m:h`<div class="under"><span class="tail">A press flashes <b>${s}</b> over the tile.</span></div>`}`}renderUnder(t,i){let a=ye(this.host()),r=this.inspect,o=r.kind==="layer"?t.elements.find(p=>p.payload.id===r.id):void 0,s,l=this.rowEditList();if(l)s=h`one cell of <b>${Te(l,a)}</b>, scaled up. Drag and size the row's layers here.
        <button class="link" @click=${()=>this.setRowEdit(void 0)}>Done designing</button>`;else if(this.showTaps)s=h`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${Zt(t.tapAction)}</b>.`;else if(this.picking)s="Point at a layer and click it. Escape stops.";else if(i==="inline")s="One line of text. Edit it on the right.";else if(r.kind==="group"){let p=t.groups?.find(g=>g.id===r.id),f=p?Rt(t,p.id).length:0;s=p?h`editing group <b>${p.name}</b>. Drag to move all ${f} layers.${p.locked?"":" Click one layer to move it alone."}`:""}else if(o){let p=Et(t,o.payload.id);s=p?.locked?h`editing <b>${Te(o,a)}</b> in <b>${p.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`:h`editing <b>${Te(o,a)}</b>. Drag it, or pull a corner. Arrow keys nudge it.${this.snapGrid&&this.snapLayers?" It snaps to the grid and to the other layers. Hold Alt to drag freely.":this.snapGrid?" It snaps to the grid. Hold Alt to drag freely.":this.snapLayers?" It snaps to the other layers. Hold Alt to drag freely.":" Hold Alt while dragging to snap to the grid."}`}else s="click a layer to edit it";if(!je(i))return h`<div class="under"><b>Inline</b><span class="dot">·</span><span class="tail">${s}</span></div>`;let c=Tn(this.currentCase(),i),d=pl(c,i),u=Math.round(d.scale*100);return h`<div class="under">
      <b>${ie(i)}</b>
      <span class="size">${c.width} × ${c.height} pt${u!==100?` \xB7 ${u}%`:""}</span>
      <span class="dot">·</span>
      <span class="tail">${s}</span>
    </div>`}renderInlinePreview(t,i){let a;if(!t)a=h`<div class="inline-line missing">No inline text</div>`;else{let r=Date.now(),o=t.countdownEnd!==void 0&&t.countdownEnd>r?Ha((t.countdownEnd-r)/1e3):t.text,s=t.symbol?this.icons.render(t.symbol,i?11:15,"#FFFFFF"):void 0;a=h`<div class="inline-line">${s??m}<span>${t.label?`${t.label}: `:""}${o}</span></div>`}return i?a:h`<div class="preview inline active" @click=${()=>{this.inspect={kind:"family"}}}>${a}</div>`}renderSharedValues(){let t=this.draft?.config;if(!t)return m;let i=t.values,a=this.canEdit?h`<button class="small" @click=${()=>{let d=Nx();this.mutate(u=>{u.values.push(d)}),this.openSharedValue(d.id)}}>Add</button>`:m,r="Like a variable: set it once, and every layer that reads it follows.",o=h`<h2 class="panel-title"><span class="swatch">${H("content")}</span>Shared values
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
      </div>`:m}`;if(i.length===0)return h`<div class="card tint-values values-list ${this.sharedHelp?"":"empty-list"}" style=${`--c:${le.complication}`}>
        ${o}
      </div>`;let s=this.host(),l=new Ot(this.buildContext(),this.draft?.config),c=ye(s);return h`<div class="card tint-values values-list" style=${`--c:${le.complication}`}>
      ${o}
      <div class="data">
      ${i.map(d=>{let u=l.resolve({kind:{kind:"named",id:d.id}}),p=this.openValue===d.id,f=()=>{this.setOpenValue(p?void 0:d.id)};return h`<div class="vitem ${p?"open":""}"><div class="datum vrow ${p?"hl":""}" role="button" tabindex="0" aria-expanded=${p?"true":"false"}
            title=${p?"Close":"Edit this shared value"}
            @click=${f}
            @keydown=${g=>{(g.key==="Enter"||g.key===" ")&&g.target===g.currentTarget&&(g.preventDefault(),f())}}>
          <span class="nm">${d.name||"(unnamed)"}</span>
          <span class="spacer"></span>
          <span class="meta ${u===void 0?"none":""}" title=${Oe(d.value,c)}>${u??"unresolved"}</span>
          ${this.canEdit?h`<button class="icon danger" title="Delete. Layers that read it keep their own copy." aria-label="Delete value" @click=${g=>{g.stopPropagation(),this.mutate(b=>{Zc(b,d.id)}),p&&(this.openValue=void 0)}}>${H("delete")}</button>`:m}
        </div>
        ${p?h`<div class="value-open">${Px(s,d)}</div>`:m}</div>`})}
      </div>
    </div>`}setOpenValue(t){let i=this.openValue;if(this.openValue=t,i===void 0||i===t)return;let a=this.draft?.config.values.find(r=>r.id===i);a&&a.name.trim()===""&&this.mutate(r=>{Zc(r,i)})}openSharedValue(t){this.renderRoot.querySelectorAll(":popover-open").forEach(a=>a.hidePopover()),this.setOpenValue(t);let i=this.draft?.config.values.find(a=>a.id===t)?.name.trim()==="";this.updateComplete.then(()=>{this.renderRoot.querySelector(".values-list .datum.hl")?.scrollIntoView({block:"start",behavior:"smooth"}),i&&this.renderRoot.querySelector(".values-list .value-open input[type=text]")?.focus({preventScroll:!0})})}openRaw(){this.showRaw=!0;let t=this.renderRoot.querySelector("details.foot");t&&(t.open=!0),this.updateComplete.then(()=>this.renderRoot.querySelector("pre")?.scrollIntoView({block:"nearest"}))}renderShapeTabs(t,i){let a=t.supportedFamilies,r=this.ownerFamilies.filter(l=>!a.includes(l)),o=t.control===void 0&&En(this.selectedOwner?.app_version),s=r.length+(o?1:0);return h`<div class="shape-seg" role="group" aria-label="Shapes">${this.renderHaveTabs(t,i)}${this.renderControlTab(t)}</div>
      ${s>0?h`<span class="shape-adds">
        <button class="tab off add-shape" ?disabled=${!this.canEdit} popovertarget="add-shapes"
          title="Add another shape, or the Control Center control">${H("plus")}Add a shape</button>
        <span class="shape-spare">${s===1?"1 more available":`${s} more available`}</span>
        <div id="add-shapes" popover="auto" class="add-menu" @beforetoggle=${this.placeAddMenu}>
          ${this.renderAddGroups(r,o)}
        </div>
      </span>`:m}`}renderAddGroups(t,i){let a=Ae(this.selectedOwner)==="iphone";return h`${Uu(this.selectedOwner,t,Vu(this.selectedOwner)).map(r=>h`<div class="add-group">
        <span class="add-group-label">${r.label}</span>
        <div class="shape-cards">
          ${r.families.map(o=>h`<button type="button" class="shape-card" title=${`Add the ${ie(o)} shape`}
            @click=${()=>{this.closeAddMenu(),this.addShape(o)}}>
            ${bd(o,a)}
            <span class="shape-card-name">${ie(o)}</span>
          </button>`)}
          ${r.comingSoon.map(o=>h`<button type="button" class="shape-card soon" disabled aria-disabled="true" title="Coming soon">
            ${bd(o,a)}
            <span class="shape-card-name">${ie(o)}</span>
            <span class="shape-card-note">Coming soon</span>
          </button>`)}
        </div>
      </div>`)}
      ${i?h`<div class="add-group">
        <span class="add-group-label">Control Center</span>
        <div class="shape-cards">
          <button type="button" class="shape-card" title="Add a Control Center control, beside whatever the complication already draws"
            @click=${()=>{this.closeAddMenu(),this.addControl()}}>
            ${nA(a)}
            <span class="shape-card-name">Control</span>
          </button>
        </div>
      </div>`:m}`}closeAddMenu(){this.renderRoot.querySelector("#add-shapes")?.hidePopover()}renderHaveTabs(t,i){let a=t.supportedFamilies;return Na(this.ownerFamilies.filter(r=>a.includes(r))).map(r=>{let o=r===this.activeFamily&&!this.inControlView,s;if(r==="inline")s=this.renderInlinePreview(i.inline,!0);else{let d=i[r];s=d?ei(d,{icons:this.icons,imageSizes:this.imageSizes,slot:Tn(this.referenceCase,r)}):m}let l=r!=="inline"&&cd(t,r)===0&&t.elements.length>0,c=this.canEdit&&vl(t,r);return h`<span class="tab-wrap">
        <button class="tab ${r}" aria-pressed=${o?"true":"false"} title=${`Edit the ${ie(r)} shape`}
          @click=${()=>{this.activeFamily=r,this.controlView=!1,r==="inline"&&this.inspect.kind==="layer"&&(this.inspect={kind:"family"})}}>
          <span class="art">${s}</span>
          <span class="lbl">${ie(r)}</span>${l?h`<small>nothing shown</small>`:m}
        </button>
        ${this.canEdit?h`<button class="icon danger tab-x" ?disabled=${!c}
          title=${c?a.length===1?`Remove the ${ie(r)} shape, leaving the Control Center control on its own`:`Remove the ${ie(r)} shape`:"The only shape. Add another before removing it."}
          aria-label=${`Remove the ${ie(r)} shape`}
          @click=${d=>{d.stopPropagation(),this.removeShape(r)}}>${H("delete")}</button>`:m}
      </span>`})}renderControlTab(t){let i=t.control;if(i===void 0||!En(this.selectedOwner?.app_version))return m;let a=this.inControlView,r=this.canEdit&&Wu(t);return h`<span class="tab-wrap">
      <button class="tab control" aria-pressed=${a?"true":"false"} title="Edit the Control Center control"
        @click=${()=>this.openControlView()}>
        <span class="art">${dd(this.host(),i,od(Ae(this.selectedOwner))[0],rA)}</span>
        <span class="lbl">Control Center</span>
      </button>
      ${this.canEdit?h`<button class="icon danger tab-x" ?disabled=${!r}
        title=${r?"Remove the Control Center control":"The only one. Add a shape before removing it."}
        aria-label="Remove the Control Center control"
        @click=${o=>{o.stopPropagation(),this.removeControl()}}>${H("delete")}</button>`:m}
    </span>`}renderValuesRow(){let t=this.draft?.config;if(!t)return m;let i=this.inControlView?{kind:"control"}:{kind:"family",family:this.activeFamily},a=new Set(this.compiled?.entities.keys()??[]),r=Em(t,i,d=>a.has(d)),o=r.entityIds.filter(d=>a.has(d)),s=new Set(r.namedIds),l=ag(t).filter(d=>s.has(d.id)),c=this.testValues.size>0;return h`<div class="card tint-states" style=${`--c:${le.states}`}>
      <h2 class="panel-title"><span class="swatch">${H("states")}</span>Values on the ${this.deviceWord}
        <span class="mini">live · slide, pick or type one to try another</span><span class="spacer"></span>
        ${c?h`<span class="testing-pill">Testing with your values <button @click=${()=>{this.editingValue=void 0,this.applyTestValues(new Map)}}>Back to live</button></span>`:m}
      </h2>
      ${o.length===0&&l.length===0?h`<div class="hint">${this.inControlView?"The control reads no entity yet. Point its target, title or value line at one and its live value shows here.":"No entities on this shape yet. Give one of its layers an entity and its live value shows here."}</div>`:h`<div class="chips values">
        ${o.map(d=>{let u=this.hass.states[d],p=typeof u?.attributes.friendly_name=="string"?u.attributes.friendly_name:d,f=typeof u?.attributes.unit_of_measurement=="string"?` ${u.attributes.unit_of_measurement}`:"",g=u?`${u.state}${f}`:"not in Home Assistant",b=this.testValues.get(d),v=t.elements.find(k=>Ks(t,k.payload.id).some(S=>S.ref.entityId===d))?.kind??"text";return h`<div class="vchip vrow ctl ${b!==void 0?"testing":""}" style=${`--k:${ot[v]}`}
            title=${b!==void 0?`Live value: ${g}`:""}>
            <span class="kbar"></span><b>${p}</b><span class="spacer"></span>
            ${this.renderTestControl(d,p,u,b,f,g)}
            ${b!==void 0?h`<button type="button" class="small live-reset" title=${`Back to the live value: ${g}`} @click=${()=>this.setTestValue(d,void 0)}>Live</button>`:m}
          </div>`})}
        ${l.map(d=>{let u=uu(d.id),p=this.sharedRaw(d.id)??"",f=p===""?"empty":p,g=d.name||"(unnamed)",b=this.testValues.get(u),y={entity_id:u,state:p,attributes:{},last_changed:"",last_updated:""};return h`<div class="vchip vrow ctl ${b!==void 0?"testing":""}" style=${`--k:${le.complication}`}
            title=${b!==void 0?`Saved value: ${f}`:""}>
            <span class="kbar"></span><b>${g}</b><span class="vtag" title="A shared value. Trying one here is not saved; change it in Shared values to keep it.">shared</span><span class="spacer"></span>
            ${this.renderTestControl(u,g,y,b,"",f)}
            ${b!==void 0?h`<button type="button" class="small live-reset" title=${`Back to the saved value: ${f}`} @click=${()=>this.setTestValue(u,void 0)}>Live</button>`:m}
          </div>`})}
      </div>`}
    </div>`}renderTestControl(t,i,a,r,o,s){let l=r??a?.state??"",c=og(t,a,r);if(c.kind==="choice")return h`<span class="test-ctl"><select aria-label=${`Test value for ${i}`} @change=${f=>this.setTestValue(t,f.target.value)}>
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
    </span>`}commitTestValue(t,i){this.editingValue=void 0,this.setTestValue(t,i)}setTestValue(t,i,a){let r=i?.trim()??"",o=new Map(this.testValues),s=t.startsWith(qs)?this.sharedRaw(t.slice(qs.length)):this.hass.states[t]?.state;r===""||r===s?o.delete(t):o.set(t,r),this.applyTestValues(o,a)}sharedRaw(t){let i=this.draft?.config;if(!i)return;let a=this.buildContext(!1),r=a.namedValues.map(o=>({...o,value:{kind:o.value.kind}}));return new Ot({...a,namedValues:r},i).resolve({kind:{kind:"named",id:t}})}applyTestValues(t,i){let a=this.draft;!a||t.size===a.testValues.size&&[...t].every(([o,s])=>a.testValues.get(o)===s)||(a.setTestValues(t,i),this.version++)}get previewCases(){return Ae(this.selectedOwner)==="iphone"?eo:Qr}get referenceCase(){return Ae(this.selectedOwner)==="iphone"?Fu:ul}currentCase(){return this.previewCases.find(t=>t.label===this.previewCase)??this.referenceCase}previewSlot(t){return Tn(this.currentCase(),t)}crumbs(t,i){let a=this.inspect,r=t.name.trim()||"Complication",o=ie(this.activeFamily),s=a.kind==="family"&&i===void 0?h`<span class="here" style=${`--k:${le.place}`}>${o} shape</span>`:h`<button @click=${()=>{this.inspect={kind:"family"}}} title="Edit the shape">${o}</button>`,l=m,c=m;if(i!==void 0)l=h`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span><span class="nm">${i} layers</span></span>`;else if(a.kind==="layer"){let d=ia(t,a.id);if(d){l=h`<span class="here" style=${`--k:${ot[d.kind]}`} title=${Te(d,ye(this.host()))}><span class="kchip">${lt[d.kind]}</span></span>`;let u=Et(t,d.payload.id);u&&(c=h`<span class="sep">›</span><button @click=${()=>{this.inspect={kind:"group",id:u.id}}} title="Edit the group">${u.name}</button>`)}}else if(a.kind==="group"){let d=t.groups?.find(u=>u.id===a.id);d&&(l=h`<span class="here" style=${`--k:${le.group}`} title=${d.name}><span class="kchip">Group</span></span>`)}return h`<div class="crumbs">
      <button title="Edit the complication" @click=${()=>{this.multi=new Set,this.inspect={kind:"general"}}}>${r}</button><span class="sep">›</span>${s}${c}
      ${l===m?m:h`<span class="sep">›</span>${l}`}
    </div>`}pickedElements(t){return this.multi.size<2?[]:t.elements.filter(i=>this.multi.has(i.payload.id))}complicationHead(t){let i=t.name.trim()||"Complication";return h`<div class="insp-head comp-head">
      <div class="crumbs"><span class="here" style=${`--k:${le.complication}`}>${i}</span></div>
      <span class="comp-acts">
        <button class="ghost" @click=${()=>this.openRaw()}>Raw JSON</button>
        ${this.canEdit?h`
          ${this.draft?.baseRevision===null?m:h`
            <button class="ghost" aria-haspopup="dialog" aria-expanded=${this.historyOpen?"true":"false"}
              title="Earlier saves of this complication" @click=${()=>{this.openHistoryDialog()}}>History</button>`}
          <button class="ghost" @click=${()=>this.duplicate()}>Duplicate</button>
          ${this.confirmDelete?h`<button class="ghost danger" @click=${()=>{this.deleteCurrent()}}>Really delete</button><button class="ghost" @click=${()=>{this.confirmDelete=!1}}>Cancel</button>`:h`<button class="ghost danger" @click=${()=>{this.confirmDelete=!0}}>Delete</button>`}`:m}
      </span>
    </div>`}renderInspector(){let t=this.draft?.config;if(!t)return m;let i=this.pickedElements(t);if(i.length>=2)return h`
        <div class="insp-head">${this.crumbs(t,i.length)}</div>
        <div class="insp-body" style=${this.canEdit?"":"pointer-events:none;opacity:.6"}
          @change=${()=>this.draft?.endGesture()}>${this.multiEditor(t,i)}</div>`;let a=this.host(),r=this.inspect,o=this.canEdit?"":"pointer-events:none;opacity:.6",s=this.inControlView;if(r.kind==="general"||s){let u=Ie(a,"complication","Complication",Lx(a,{nameOnly:s}),{color:le.complication,icon:"watch",alwaysOpen:!0});return h`
        ${this.complicationHead(t)}
        <div class="insp-body" style=${o} @change=${()=>this.draft?.endGesture()}>
          ${s?h`${u}${_x(a,{alwaysOpen:!0})}`:h`${u}
              <p class="insp-note">Click a layer ${Ae(this.selectedOwner)==="iphone"?"on the preview":"on the watch"} or in the list to edit it. The shape's own background and border are the bottom row of the list.</p>`}
        </div>`}let l=m,c=!0;if(r.kind==="layer"){let u=ia(t,r.id);if(!u)return this.inspect={kind:"general"},m;l=Wx(a,u,this.canvasFamily,{placement:!0,tap:!0})}else if(r.kind==="group"){let u=t.groups?.find(p=>p.id===r.id);if(!u)return this.inspect={kind:"general"},m;c=!1,l=Xx(a,u)}else l=Jx(a,this.activeFamily);let d=this.openSections.size>1;return h`
      <div class="insp-head">
        ${this.crumbs(t)}
        ${c?h`<button class="expand" @click=${()=>{this.openSections=d?new Set([eA(r)]):new Set(Np)}}>${d?"One at a time":"Open all"}</button>`:m}
      </div>
      <div class="insp-body" style=${o} @change=${()=>this.draft?.endGesture()}>${l}</div>`}triCheck(t,i,a){return h`<label class="field check">
      <span>${t}${i==="mixed"?h` <span class="mixed">(mixed)</span>`:m}</span>
      <input type="checkbox" .checked=${i==="all"} .indeterminate=${i==="mixed"}
        @change=${r=>a(r.target.checked)} /></label>`}multiEditor(t,i){let a=this.canvasFamily,r=this.host(),o=ye(r),s=new Ot(this.buildContext(),this.draft?.config),l=zx(t,a,i),c=i.length,d=[...i].reverse(),u=f=>this.mutate(g=>{for(let b of i)Pe(g,a,b.payload.id,{isHidden:f})}),p=f=>this.mutate(g=>{for(let b of i){let y=g.elements.find(v=>v.payload.id===b.payload.id);y&&y.kind!=="image"&&y.kind!=="tap"&&y.kind!=="timeline"&&y.kind!=="chartTimes"&&y.kind!=="chartDots"&&y.kind!=="chartGrid"&&y.kind!=="imageTime"&&y.kind!=="list"&&(y.payload.colorSlot.baseColorHex=f)}},"multi-colour");return h`
      ${Ie(r,"picked",`${c} layers picked`,h`
          <div class="field list-field"><span>Layers</span>
            <div class="picked">
              ${d.map(f=>h`<div class="row" style=${`--k:${ot[f.kind]}`}>
                <span class="bar"></span>
                <span class="name">
                  ${f.kind==="icon"?h`<span class="glyph">${this.icons.render(s.resolve(f.payload.symbol)??"questionmark",16,f.payload.colorSlot.baseColorHex)??m}</span>`:m}
                  <b>${Te(f,o)}</b><span class="kind">${lt[f.kind]}</span>
                </span>
              </div>`)}
            </div>
            <div class="row-acts">
              <button class="small primary" title=${`Group (${ci}G)`} @click=${()=>this.groupPicked()}>Group them</button>
              <button class="small" @click=${()=>{this.multi=new Set}}>Clear</button>
            </div>
          </div>
          <div class="hint">${Za}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>`,{color:"var(--wa-accent)",icon:"layers",summary:`Edits here land on all ${c}`,alwaysOpen:!0})}
      ${Ie(r,"picked-common",`All ${c} at once`,h`
          ${this.triCheck("Hidden",l.hiddenHere,u)}
          ${l.colourable?h`${Ce("Colour",l.colour,f=>{f!==void 0&&p(f)})}
              ${l.colour===void 0?h`<div class="hint keep">These layers are different colours. Pick one to give them all the same.</div>`:m}`:h`<div class="hint keep">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">These layers are on the ${ie(a)} shape and on no other, so nothing here reaches another shape.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>`,{color:le.place,icon:"place",summary:"The settings every picked layer has",alwaysOpen:!0})}`}renderFooter(){let t=this.draft;if(!t)return m;let i=this.records.find(r=>r.id===this.selectedId),a=Ny({revision:i?.revision??null,dirty:t.dirty,...this.saveError!==void 0?{error:this.saveError}:{},...this.templateError!==void 0?{templateError:this.templateError}:{}});return h`<details class="foot">
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
    </details>`}};A([ua({attribute:!1})],T.prototype,"hass",2),A([ua({type:Boolean})],T.prototype,"narrow",2),A([ua({attribute:!1})],T.prototype,"panel",2),A([F()],T.prototype,"colLeft",2),A([F()],T.prototype,"colRight",2),A([F()],T.prototype,"panelWidth",2),A([F()],T.prototype,"owners",2),A([F()],T.prototype,"ownerId",2),A([F()],T.prototype,"records",2),A([F()],T.prototype,"selectedId",2),A([F()],T.prototype,"draft",2),A([F()],T.prototype,"readOnlyReason",2),A([F()],T.prototype,"parseError",2),A([F()],T.prototype,"maxSchemaVersion",2),A([F()],T.prototype,"presets",2),A([F()],T.prototype,"occupied",2),A([F()],T.prototype,"serverToken",2),A([F()],T.prototype,"appliedToken",2),A([F()],T.prototype,"sendStatusKnown",2),A([F()],T.prototype,"polling",2),A([F()],T.prototype,"lastPollSeconds",2),A([F()],T.prototype,"lastSyncSeconds",2),A([F()],T.prototype,"pushAvailable",2),A([F()],T.prototype,"lastPushSeconds",2),A([F()],T.prototype,"sendPending",2),A([F()],T.prototype,"pages",2),A([F()],T.prototype,"templateResults",2),A([F()],T.prototype,"historySeries",2),A([F()],T.prototype,"historyReadings",2),A([F()],T.prototype,"listItems",2),A([F()],T.prototype,"rowEditListId",2),A([F()],T.prototype,"templateError",2),A([F()],T.prototype,"templateFetchedAt",2),A([F()],T.prototype,"forced",2),A([F()],T.prototype,"showRaw",2),A([F()],T.prototype,"inspect",2),A([F()],T.prototype,"openSections",2),A([F()],T.prototype,"helpSections",2),A([F()],T.prototype,"pickerOpen",2),A([F()],T.prototype,"pickerFilter",2),A([F()],T.prototype,"pickerNote",2),A([F()],T.prototype,"pickerHiddenOpen",2),A([F()],T.prototype,"pickerConfirmDelete",2),A([F()],T.prototype,"openValue",2),A([F()],T.prototype,"sharedHelp",2),A([F()],T.prototype,"editingValue",2),A([F()],T.prototype,"thumbStep",2),A([F()],T.prototype,"layerDetail",2),A([F()],T.prototype,"addOpen",2),A([F()],T.prototype,"addDetail",2),A([F()],T.prototype,"multi",2),A([F()],T.prototype,"copiedPosition",2),A([F()],T.prototype,"savePartOpen",2),A([F()],T.prototype,"savePartName",2),A([F()],T.prototype,"savePartIds",2),A([F()],T.prototype,"savePartError",2),A([F()],T.prototype,"savePartBusy",2),A([F()],T.prototype,"partsOpen",2),A([F()],T.prototype,"parts",2),A([F()],T.prototype,"partsError",2),A([F()],T.prototype,"partsBusy",2),A([F()],T.prototype,"partPick",2),A([F()],T.prototype,"partMap",2),A([F()],T.prototype,"partRename",2),A([F()],T.prototype,"partConfirmDelete",2),A([F()],T.prototype,"snapGrid",2),A([F()],T.prototype,"gridStep",2),A([F()],T.prototype,"showGridLines",2),A([F()],T.prototype,"snapLayers",2),A([F()],T.prototype,"guides",2),A([F()],T.prototype,"openMenu",2),A([F()],T.prototype,"altHeld",2),A([F()],T.prototype,"collapsed",2),A([F()],T.prototype,"activeFamily",2),A([F()],T.prototype,"controlView",2),A([F()],T.prototype,"picking",2),A([F()],T.prototype,"pickHoverId",2),A([F()],T.prototype,"listHoverIds",2),A([F()],T.prototype,"rowHoverId",2),A([F()],T.prototype,"zoomed",2),A([F()],T.prototype,"helpOpen",2),A([F()],T.prototype,"showTaps",2),A([F()],T.prototype,"savedName",2),A([F()],T.prototype,"presetKind",2),A([F()],T.prototype,"presetEntity",2),A([F()],T.prototype,"newOpen",2),A([F()],T.prototype,"newName",2),A([F()],T.prototype,"newFamilies",2),A([F()],T.prototype,"newPlace",2),A([F()],T.prototype,"newControl",2),A([F()],T.prototype,"shareOpen",2),A([F()],T.prototype,"shareMode",2),A([F()],T.prototype,"shareLabels",2),A([F()],T.prototype,"shareFamilies",2),A([F()],T.prototype,"dialogLitIds",2),A([F()],T.prototype,"shareGroupNames",2),A([F()],T.prototype,"shareValueNames",2),A([F()],T.prototype,"shareName",2),A([F()],T.prototype,"shareLayerNames",2),A([F()],T.prototype,"shareNote",2),A([F()],T.prototype,"shareTextOpen",2),A([F()],T.prototype,"shareCopied",2),A([F()],T.prototype,"shareLinkShown",2),A([F()],T.prototype,"shareFocus",2),A([F()],T.prototype,"galleryOpen",2),A([F()],T.prototype,"galleryTab",2),A([F()],T.prototype,"galleryStep",2),A([F()],T.prototype,"galleryReplaces",2),A([F()],T.prototype,"galleryTitle",2),A([F()],T.prototype,"galleryDescription",2),A([F()],T.prototype,"galleryTags",2),A([F()],T.prototype,"galleryNickname",2),A([F()],T.prototype,"galleryPreviews",2),A([F()],T.prototype,"galleryPreviewNote",2),A([F()],T.prototype,"gallerySending",2),A([F()],T.prototype,"gallerySent",2),A([F()],T.prototype,"galleryError",2),A([F()],T.prototype,"galleryUploads",2),A([F()],T.prototype,"galleryUploadsError",2),A([F()],T.prototype,"galleryConfirmDelete",2),A([F()],T.prototype,"galleryDeleting",2),A([F()],T.prototype,"importOpen",2),A([F()],T.prototype,"importText",2),A([F()],T.prototype,"importParse",2),A([F()],T.prototype,"importName",2),A([F()],T.prototype,"importMap",2),A([F()],T.prototype,"importFamilies",2),A([F()],T.prototype,"importDrop",2),A([F()],T.prototype,"importTextShown",2),A([F()],T.prototype,"importFocus",2),A([F()],T.prototype,"importHistory",2),A([F()],T.prototype,"historyOpen",2),A([F()],T.prototype,"historyEntries",2),A([F()],T.prototype,"historyPick",2),A([F()],T.prototype,"historyDoc",2),A([F()],T.prototype,"historyBusy",2),A([F()],T.prototype,"historyNote",2),A([F()],T.prototype,"historyConfirm",2),A([F()],T.prototype,"shareLink",2),A([F()],T.prototype,"helpTab",2),A([F()],T.prototype,"linkNote",2),A([F()],T.prototype,"previewCase",2),A([F()],T.prototype,"previewTint",2),A([F()],T.prototype,"loadError",2),A([F()],T.prototype,"saveError",2),A([F()],T.prototype,"saving",2),A([F()],T.prototype,"conflict",2),A([F()],T.prototype,"remoteRevision",2),A([F()],T.prototype,"confirmDelete",2),A([F()],T.prototype,"moveTarget",2),A([F()],T.prototype,"moving",2),A([F()],T.prototype,"moveError",2),A([F()],T.prototype,"version",2);var wh=T;function Ye(e){return String(e?.message??e)}function hA(e){let n=Date.parse(e);return Number.isNaN(n)?"Saved":`Saved ${Ys(Math.max(0,(Date.now()-n)/1e3))}`}function fA(e){let n=e.startsWith("ha-panel:")?e.slice(9):e;return n.trim()===""?"":`by ${n.trim()}`}function mA(e){if(typeof e=="number"&&Number.isFinite(e))return e;if(typeof e!="string"||e==="")return;let n=e.split(":").map(t=>Number(t));if(!(n.length===0||n.length>3||n.some(t=>Number.isNaN(t))))return n.reduce((t,i)=>t*60+i,0)}function Wv(e){let n=e.device_name??e.owner_watch_id;return Ae(e)==="iphone"?/iphone/i.test(n)?n:`${n} (iPhone)`:e.paired_iphone_name?`${n} (${e.paired_iphone_name})`:n}function gA(e){return[...e.filter(n=>Ae(n)!=="iphone"),...e.filter(n=>Ae(n)==="iphone")]}function yA(e,n,t,i){let a=[{label:"Shows",value:Yp(e,t)}],r=Ql(t);return r&&a.push({label:"Looks",value:r}),i.frame.rotationDegrees!==0&&a.push({label:"Turned",value:`${Math.round(i.frame.rotationDegrees)}\xB0`}),a}function bA(e){return e<120?`${e} min`:e%1440===0?`${e/1440} d`:e%60===0?`${e/60} h`:`${e} min`}function xA(e,n,t,i){let a=r=>h`<span class="val-tok">${r??"--"}</span>`;switch(e.kind){case"text":return h`${a(n.resolve(e.payload.value))} · ${i??e.payload.fontSize} pt`;case"icon":return`${i??e.payload.size} pt \xB7 ${qe(e.payload.colorSlot.baseColorHex)}`;case"gauge":return h`${a(n.resolve(e.payload.value))} · ${e.payload.style}`;case"chart":{let r=Xt(e.payload)??Jt(e.payload),o=r!==void 0?t.get(r)??"":n.resolve(e.payload.value)??"";return`${e.payload.style} \xB7 ${rt(o).length} values`}case"timeline":{let r=ht(e.payload),o=r===void 0?[]:qr(t.get(r)??""),s=Math.max(0,o.length-1);return`${bA(Pt(e.payload))} \xB7 ${s} ${s===1?"change":"changes"}`}case"shape":return`${qe(e.payload.colorSlot.baseColorHex)}${e.payload.borderColorHex?" \xB7 border":""}`;case"image":return e.payload.contentMode==="fill"?"fill":"fit";case"tap":return Zt(e.payload.action);case"chartTimes":return`${e.payload.timeLabelCount} times \xB7 ${e.payload.labelSize} pt`;case"chartDots":return`${e.payload.dots==="all"?"every reading":"auto"}${e.payload.size===void 0?"":` \xB7 ${e.payload.size} pt`}`;case"chartGrid":return`${e.payload.lines} ${e.payload.lines===1?"line":"lines"} \xB7 ${e.payload.thickness} pt`;case"imageTime":return}}customElements.get("wrist-assistant-panel")||customElements.define("wrist-assistant-panel",wh);export{wh as WristAssistantPanel,Kv as columnFit,yA as layerFacts,Wv as ownerLabel,gA as ownersByKind};
